(() => {
  const t = window.__THREE_LIB,
    s = "https://cdn.jsdelivr.net/npm/three@0.183.2/",
    i = {
      three: s + "build/three.module.js",
      "three/addons/": s + "examples/jsm/",
    };
  if (t)
    for (const r in t)
      i[r] = URL.createObjectURL(
        new Blob(
          [
            Object.keys(t[r])
              .map(
                (n) =>
                  (n === "default" ? "export default " : `export const ${n}=`) +
                  `__THREE_LIB[${JSON.stringify(r)}][${JSON.stringify(n)}];`,
              )
              .join(""),
          ],
          { type: "text/javascript" },
        ),
      );
  const e = document.createElement("script");
  ((e.type = "importmap"),
    (e.textContent = JSON.stringify({ imports: i })),
    document.currentScript.after(e));
})();
