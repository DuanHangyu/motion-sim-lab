(() => {
  const t =
    (/\/community\/[^/]+\/[^/]*$/.test(location.pathname) ? "../../" : "../") +
    "lib/";
  document.write(`<script src="${t}three-0.183.2.js"><\/script>`);
})();
