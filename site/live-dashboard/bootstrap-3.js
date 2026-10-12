(() => {
  const t = document.getElementById("cover0"),
    d = document.getElementById("cover"),
    e = window.__cover;
  t.style.backgroundImage =
    "url(data:image/webp;base64,UklGRvYAAABXRUJQVlA4IOoAAADwBgCdASowACcAPq1Em0mmI6IhONSYAMAViUAZEzGXuMc0DgDJXlbnorwhTADhRvS1z3+48USihk8tNlP+hyYAAP78pyFyj7txeu/MwvYOylbgTBXCYlM0y7FBlpO8sVlXqihKL9LnpJFpECv50ZyIUTmhtSS3gmMKsccWmLgDI8tLNfASydr6uqEHMIsGfDUAex6vTNwHSGyFvNQ8bW+GcNU3qfSRgVV1LELu1CCVIxQnl4S98K/dnByTNj+21MsTcjCWPksEUMphfJaC/eEkPYx4GjDRDfD0gDC5pKJP4LZkD4ia2bg9UAA=)";
  const l = () => {
    e && e.naturalWidth && (d.style.backgroundImage = `url("${e.src}")`);
  };
  e &&
    (e.complete ? l() : e.addEventListener("load", l),
    e.addEventListener("error", () => {
      (d.classList.add("gone"), t.classList.add("gone"));
    }));
})();
