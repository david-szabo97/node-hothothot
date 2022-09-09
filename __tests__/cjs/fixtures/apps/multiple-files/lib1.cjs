const lib2 = require("./lib2.cjs");

module.exports = () => {
  return `lib1,${lib2()}`;
};
