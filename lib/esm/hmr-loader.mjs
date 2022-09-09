import { fileURLToPath } from "url";
import { HmrEngine } from "../hmr-engine.js";
import { EsmHmrAdapter } from "./adapter.js";
import { hmrLoaderClient } from "./hmr-loader-client.mjs";

let adapter;
let engine;

export async function resolve(specifier, context, nextResolve) {
  if (context.parentURL?.includes("/node_modules/")) {
    return nextResolve(specifier);
  }

  const resolved = await nextResolve(specifier);
  if (!resolved.url.startsWith("file:///") || resolved.url.includes("/node_modules/") || !context.parentURL) {
    return resolved;
  }

  const modulePath = fileURLToPath(resolved.url);
  const parentModulePath = fileURLToPath(context.parentURL);
  engine.watchFile(modulePath, parentModulePath);

  if (adapter.isDirty(modulePath)) {
    adapter.removeDirty(modulePath);
    return { ...resolved, url: `${resolved.url}?${Date.now()}` };
  }

  return resolved;
}

export function globalPreload({ port }) {
  adapter = new EsmHmrAdapter({ port });
  engine = new HmrEngine(adapter);

  return `
    ${hmrLoaderClient.toString()}
    hmrLoaderClient()
  `;
}
