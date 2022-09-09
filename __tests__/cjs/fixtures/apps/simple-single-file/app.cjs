module.exports = async () => {
  const interval = setInterval(() => {}, 1000);

  globalThis.__APP_RUNNING(1);

  return {
    dispose() {
      clearInterval(interval);
    },
  };
};
