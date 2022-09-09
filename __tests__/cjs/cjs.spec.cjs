const fs = require("fs/promises");
const cjsEntry = require("../../lib/cjs/cjs-entry.cjs");
const test = require("tape");
const path = require("path");
const os = require("os");

const replaceInFile = async (filePath, searchString, replaceString) =>
  await fs.writeFile(filePath, (await fs.readFile(filePath, "utf-8")).replace(searchString, replaceString));

const createHmr = async (appDir) => {
  appDir = path.isAbsolute(appDir) ? appDir : path.join(__dirname, "fixtures", "apps", appDir);
  const sourceClientFilePath = path.join(__dirname, "fixtures", "hmr-client.cjs");

  const tmpDir = await fs.mkdtemp(os.tmpdir());
  await fs.cp(appDir, tmpDir, { recursive: true });
  await fs.cp(sourceClientFilePath, path.join(tmpDir, "hmr-client.cjs"));

  const appFilePath = path.join(tmpDir, "app.cjs");
  const clientFilePath = path.join(tmpDir, "hmr-client.cjs");

  const hmr = await cjsEntry(clientFilePath);

  return {
    hmr,
    hmrDir: tmpDir,
    appFilePath,
    clientFilePath,
  };
};

test(
  "Simple single file",
  async function (t) {
    const cbCalls = [];
    const cb = (...args) => cbCalls.push(args[0]);
    globalThis.__APP_RUNNING = cb;

    const { hmr, appFilePath } = await createHmr("simple-single-file");
    t.ok(cbCalls.pop(1));

    await replaceInFile(appFilePath, `globalThis.__APP_RUNNING(1);`, `globalThis.__APP_RUNNING(2);`);
    t.ok(cbCalls.pop(2));

    t.equal(cbCalls.length, 0);

    await hmr.stop();
  },
  { timeout: 1000000 }
);

test(
  "Multiple files",
  async function (t) {
    const cbCalls = [];
    const cb = (...args) => cbCalls.push(args[0]);
    globalThis.__APP_RUNNING = cb;

    const { hmr, hmrDir } = await createHmr("multiple-files");
    t.ok(cbCalls.pop("lib1,lib2"));

    await replaceInFile(path.join(hmrDir, "lib1.cjs"), `lib1`, `lib1+1`);
    t.ok(cbCalls.pop("lib1+1,lib2"));

    await replaceInFile(path.join(hmrDir, "lib2.cjs"), `lib2`, `lib2+2`);
    t.ok(cbCalls.pop("lib1+1,lib2+2"));

    t.equal(cbCalls.length, 0);

    await hmr.stop();
  },
  { timeout: 1000000 }
);
