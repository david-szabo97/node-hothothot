export function isNodeModule(filePath) {
  return filePath.includes("/node_modules/") || filePath.includes("\\node_modules\\");
}
