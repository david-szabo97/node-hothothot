import url from "url";
import { hmrClient } from "../hmr-client.js";
import { hmrClientLifecycle } from "../hmr-client-lifecycle.js";

export const hmrEntry = async (file) => {
  if (!globalThis.__HMR_LOADER_READY) {
    console.error("HMR functions are missing, are you sure `--loader node-hmr-esm/loader` has been added?");
    process.exit(1);
  }

  const moduleFileUrl = url.pathToFileURL(file);
  const { start, dispose } = hmrClient(() => import(new URL(`${moduleFileUrl}?${Date.now()}`)));
  const lifecycle = hmrClientLifecycle({
    start,
    dispose,
  });

  globalThis.__HMR_LOADER_READY(lifecycle);
};

export default hmrEntry;
