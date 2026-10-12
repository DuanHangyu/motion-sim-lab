import("paris/app.js").catch((e) => {
  console.error(e);
  const t = document.getElementById("error");
  ((t.hidden = !1),
    (t.textContent =
      "The 3D scene could not start. Please use a current browser with WebGL 2 and hardware acceleration enabled. " +
      e.message));
});
