/* global port */

export async function hmrLoaderClient() {
  globalThis.__HMR_LOADER_READY = async (lifecycle) => {
    port.onmessage = async () => {
      await lifecycle.reload();
    };

    await lifecycle.onReady();
  };
}
