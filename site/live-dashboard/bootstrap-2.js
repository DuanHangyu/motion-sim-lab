(() => {
  const c = new Image();
  ((c.decoding = "async"), (c.src = "cover.webp"), (window.__cover = c));
})();
