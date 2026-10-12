(() => {
  const c = /[?&]embed\b/.test(location.search);
  c && document.documentElement.classList.add("embed");
  const e = new Image();
  ((e.decoding = "async"),
    (e.src = c ? "x-card.jpg" : "cover.webp"),
    (window.__cover = e));
})();
