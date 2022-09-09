import Module from "module";

export class CommonJsHmrAdapter {
  constructor({ reload }) {
    this.reload = reload;

    this._require = Module.createRequire(import.meta.url);
  }

  clearCache(modulePath) {
    delete this._require.cache[modulePath];
  }

  async onModuleChanged() {
    await this.reload();
  }
}
