export function hmrClientLifecycle({ dispose, start, onQueued, onBeforeReload, onAfterReload }) {
  let isReady = false;
  const onReady = async () => {
    isReady = true;
    await reload();
  };

  let isReloading = false;
  let isReloadQueued = false;
  const reload = async (isQueuedReload = false) => {
    if (isReloading || !isReady) {
      isReloadQueued = true;
      await onQueued?.();
      return;
    }
    isReloading = true;

    console.log("[HMR-Client] Reloading...");
    console.time("[HMR-Client] Reloaded");
    await onBeforeReload?.(isQueuedReload);
    await dispose?.();
    await start?.();
    await onAfterReload?.(isQueuedReload);
    console.timeEnd("[HMR-Client] Reloaded");

    isReloading = false;

    if (isReloadQueued) {
      isReloadQueued = false;
      await reload(true);
    }
  };

  return {
    reload,
    onReady,
  };
}
