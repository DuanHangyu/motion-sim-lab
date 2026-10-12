(() => {
  const t = document.getElementById("cta"),
    l = document.getElementById("cta-open"),
    a = "sl-referral-hidden",
    n = (e) => {
      (t.classList.toggle("gone", e), l.classList.toggle("show", e));
      try {
        e ? localStorage.setItem(a, "1") : localStorage.removeItem(a);
      } catch {}
    };
  let o = !1;
  try {
    o = localStorage.getItem(a) === "1";
  } catch {}
  (n(o),
    document.getElementById("cta-x").addEventListener("click", () => n(!0)),
    l.addEventListener("click", () => {
      (n(!1), t.classList.add("in"));
    }),
    setTimeout(() => t.classList.add("in"), 5200));
  const s = document.getElementById("big"),
    c = (e) => s.classList.toggle("on", e);
  (t.querySelector(".qr").addEventListener("click", () => c(!0)),
    document.getElementById("big-x").addEventListener("click", () => c(!1)),
    s.addEventListener("click", (e) => {
      e.target === s && c(!1);
    }),
    addEventListener(
      "keydown",
      (e) => {
        e.key === "Escape" &&
          s.classList.contains("on") &&
          (e.stopPropagation(), c(!1));
      },
      !0,
    ));
})();
