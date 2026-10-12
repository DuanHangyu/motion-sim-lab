(() => {
  const t =
    (/\/community\/[^/]+\/[^/]*$/.test(location.pathname) ? "../../" : "../") +
    "lib/";
  document.write(
    `<link rel="stylesheet" href="${t}fonts.css" onerror="this.onerror=null;this.href='https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap'"><script src="${t}three-0.183.2.js"><\/script>`,
  );
})();
