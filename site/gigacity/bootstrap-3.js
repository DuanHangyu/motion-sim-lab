(() => {
  const o = /[?&#]seed=(\d{1,9})/.exec(location.search + location.hash),
    n = document.querySelector("#loading .ld-msg");
  n && (n.textContent = "Growing the city from seed " + (o ? +o[1] : 4417));
  const t = document.querySelector("#loading .ld-img"),
    e = window.__cover;
  if (!t || !e) return;
  const c = () => {
    e.naturalWidth &&
      ((t.style.backgroundImage = 'url("' + e.src + '")'),
      t.classList.add("on"));
  };
  e.complete ? c() : e.addEventListener("load", c, { once: !0 });
})();
