import Module from "module";
import isBuiltinModule from "is-builtin-module";

const isBuiltin = Module.isBuiltin ? Module.isBuiltin : isBuiltinModule;

export const hookIntoRequire = (require, engine, isNodeModule) => {
  const originalRequire = Module.prototype.require;

  const watchFile = (modulePath, parentModulePath) => {
    if (!isBuiltin(modulePath) && !isNodeModule(modulePath)) {
      engine.watchFile(modulePath, parentModulePath);
    }
  };

  Object.values(require.cache).forEach((cachedModule) => {
    cachedModule.children.forEach((childModule) => {
      watchFile(childModule.id, cachedModule.id);
    });
  });

  Module.prototype.require = function hookIntoRequireInterceptor(id) {
    const resolvedPath = Module._resolveFilename(id, this);

    watchFile(resolvedPath, this.id);

    return originalRequire.apply(this, arguments);
  };

  return () => {
    Module.prototype.require = originalRequire;
  };
};
