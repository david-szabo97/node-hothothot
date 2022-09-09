# Work in progress

## ESM

- HMR Engine: loader
- HMR Adapter: loader
- HMR Client: userland
- HMR Client Lifecycle: userland

node --loader @david-szabo97/hothothot/loader -r @david-szabo97/hothothot hmr-client.js

## CJS

- HMR Engine: userland
- HMR Adapter: userland
- HMR Client: userland
- HMR Client Lifecycle: userland

node -r node-hmr-esm hmr-client.js

node -r @david-szabo97/hothothot hmr-client.js
