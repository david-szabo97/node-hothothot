import chokidar from "chokidar";

export class HmrEngine {
  filesWatching = new Set();
  moduleParents = new Map();

  constructor(adapter) {
    this.adapter = adapter;
    this.watcher = chokidar.watch().on("all", this._onFileWatchEvent.bind(this));
  }

  _onFileWatchEvent(event, path) {
    if (event === "add") {
      this.adapter.onModuleAdded?.(path);
      return;
    }

    this.clearCache(path);
    console.log(`[HMR-Server] ${path} changed...`);
    this.adapter.onModuleChanged?.(path);
  }

  clearCache(startModulePath) {
    const dependencies = new Set();
    const queue = [startModulePath];
    while (queue.length > 0) {
      const modulePath = queue.shift();

      dependencies.add(modulePath);

      this.moduleParents[modulePath]?.forEach((parentModulePath) => {
        if (!dependencies.has(parentModulePath)) {
          queue.push(parentModulePath);
        }
      });
    }

    dependencies.forEach((dependencyModulePath) => {
      this.adapter.clearCache(dependencyModulePath);
      console.log(`[HMR-Server] ${dependencyModulePath} invalidated`);
    });
  }

  watchFile(modulePath, parentModulePath) {
    if (this.filesWatching.has(modulePath + parentModulePath)) {
      return;
    }

    this.filesWatching.add(modulePath + parentModulePath);
    if (!this.moduleParents[modulePath]) {
      this.moduleParents[modulePath] = new Set();
    }
    this.moduleParents[modulePath].add(parentModulePath);
    this.watcher.add(modulePath);

    console.log(`[HMR-Server] ${modulePath} watching...`);
  }

  async close() {
    await this.watcher.close();
    await this.adapter.close?.();
  }
}
