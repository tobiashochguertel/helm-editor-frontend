const go = new Go();
// eslint-disable-next-line react-refresh/only-export-components
export default WebAssembly.instantiateStreaming(
  fetch('main.wasm'), go.importObject
).then((result) => {
  go.run(result.instance);
  return window.helmRender = helmRender;
}).catch((err: Error) => {
  console.error('webassembly instantiate error', err)
});