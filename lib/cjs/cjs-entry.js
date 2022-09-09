import Module from "module";
import { hmrClient } from "../hmr-client.js";
import { hmrClientLifecycle } from "../hmr-client-lifecycle.js";
import { CommonJsHmrAdapter } from "./adapter.js";
import { HmrEngine } from "../hmr-engine.js";
import { isNodeModule } from "../utils/is-node-module.js";
import { hookIntoRequire } from "./hook-into-require.js";

export default async function (file, { onAfterReload } = {}) {
  const require = Module.createRequire(import.meta.url);

  const modulePath = Module._resolveFilename(file, require.main);

  const importModule = async () => require(modulePath);
  const { start, dispose } = hmrClient(importModule);
  const { reload, onReady } = hmrClientLifecycle({
    start,
    dispose,
    onAfterReload,
  });

  const adapter = new CommonJsHmrAdapter({ reload });
  const engine = new HmrEngine(adapter);

  const revertHookIntoRequire = hookIntoRequire(require, engine, isNodeModule);

  await onReady();

  return {
    engine,
    start,
    dispose,
    stop: async () => {
      revertHookIntoRequire();
      await engine.close();
      await dispose();
    },
  };
}
