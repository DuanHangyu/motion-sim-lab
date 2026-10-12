(function () {
  const n = Number(window.devicePixelRatio) || 1;
  try {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: !0,
      get: function () {
        return Math.min(n, 1);
      },
    });
  } catch {}
  function t(e) {
    const r = new Error(e);
    dispatchEvent(new ErrorEvent("error", { message: r.message, error: r }));
  }
  (addEventListener(
    "webglcontextlost",
    function () {
      t("WebGL context lost");
    },
    !0,
  ),
    addEventListener(
      "webglcontextcreationerror",
      function (e) {
        t(
          String(
            (e && e.statusMessage) || "WebGL context could not be created",
          ),
        );
      },
      !0,
    ),
    addEventListener(
      "keydown",
      function (e) {
        e.key === "Escape" &&
          parent.postMessage({ type: "mux-h2h-preview-escape" }, "*");
      },
      !0,
    ));
})();
