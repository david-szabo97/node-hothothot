const createApp = require("./app.cjs");

let app;

module.exports.start = async () => {
  app = await createApp();
};

module.exports.dispose = async () => {
  app?.dispose();
};
