export function hmrClient(importHmrClient) {
  let lastHmrClient;

  const dispose = () => lastHmrClient?.dispose().catch((err) => console.error("ERROR SWALLOWED DURING DISPOSE", err)); // TODO:

  const start = () =>
    importHmrClient()
      .then((client) => (lastHmrClient = client))
      .then((client) => client.start())
      .catch((err) => console.error("ERROR SWALLOWED DURING START", err)); // TODO:

  return {
    dispose,
    start,
  };
}
