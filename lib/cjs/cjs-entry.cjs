module.exports = async (file) => (await import("./cjs-entry.js")).default(file);
module.exports.hmrEntry = module.exports;

// Runs when required via CLI (node -r ...)
(async () => {
  if (!require.main) {
    const modulePath = require("path").resolve(process.argv[1]);

    // "node -r" uses `require`, so both CJS and ESM projects will call the CJS entry file.
    // If the require above fails, it might be an ESM module after all.
    if (isEsmModule(modulePath)) {
      import("../esm/esm-entry.js").then((esmEntry) => {
        let timeout;
        let interval;

        // Loader doesn't run immediately, therefore __HMR_LOADER_READY
        // won't be available when this module is required.
        // This intervall polls the __HMR_LOADER_READY.
        interval = setInterval(() => {
          if (globalThis.__HMR_LOADER_READY) {
            clearInterval(interval);
            clearTimeout(timeout);
            esmEntry.default(modulePath);
          }
        }, 16);

        // Timeout for __HMR_LOADER_READY polling.
        timeout = setTimeout(() => {
          clearInterval(interval);
          esmEntry.default(modulePath);
        }, 1000);
      });
    } else {
      await module.exports(modulePath);
    }
  }
})();

function isEsmModule(modulePath) {
  try {
    require(modulePath);
    return false;
  } catch (err) {
    if (err.code === "ERR_REQUIRE_ESM") {
      return true;
    }

    throw err;
  }
}
