const lib1 = require("./lib1.cjs");

module.exports = async () => {
  const interval = setInterval(() => {}, 1000);

  globalThis.__APP_RUNNING(lib1());

  return {
    dispose() {
      clearInterval(interval);
    },
  };
};
