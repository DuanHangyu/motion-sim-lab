(() => {
  const r = window.__THREE_LIB,
    i = "https://cdn.jsdelivr.net/npm/three@0.186.1/",
    n = {
      "three/webgpu": i + "build/three.webgpu.js",
      "three/tsl": i + "build/three.tsl.js",
      "three/addons/": i + "examples/jsm/",
    };
  if (r)
    for (const t in r)
      n[t] = URL.createObjectURL(
        new Blob(
          [
            Object.keys(r[t])
              .map(
                (e) =>
                  (e === "default" ? "export default " : `export const ${e}=`) +
                  `__THREE_LIB[${JSON.stringify(t)}][${JSON.stringify(e)}];`,
              )
              .join(""),
          ],
          { type: "text/javascript" },
        ),
      );
  const s = document.createElement("script");
  if (
    ((s.type = "importmap"),
    (s.textContent = JSON.stringify({ imports: n })),
    document.currentScript.after(s),
    self.GPUTexture)
  ) {
    const t = GPUTexture.prototype.createView;
    GPUTexture.prototype.createView = function (e) {
      return (
        e && e.swizzle === "rgba" && ((e = { ...e }), delete e.swizzle),
        t.call(this, e)
      );
    };
  }
})();
