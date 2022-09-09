export class EsmHmrAdapter {
  constructor({ port }) {
    this.port = port;
    this.dirtyModulePaths = new Set();
  }

  clearCache(modulePath) {
    this.markAsDirty(modulePath);
  }

  async onModuleChanged(filename) {
    this.port.postMessage(filename);
  }

  markAsDirty(modulePath) {
    this.dirtyModulePaths.add(modulePath);
  }

  isDirty(modulePath) {
    return this.dirtyModulePaths.has(modulePath);
  }

  removeDirty(modulePath) {
    this.dirtyModulePaths.delete(modulePath);
  }
}
