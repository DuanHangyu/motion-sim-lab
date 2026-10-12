{
  const t = "5939188d-f702-467b-8321-0fbe60af9604";
  if (/^[0-9a-f-]{36}$/.test(t)) {
    const e = document.createElement("script");
    ((e.defer = !0),
      (e.src = "https://dat.d1.tel/script.js"),
      (e.dataset.websiteId = t),
      (e.dataset.excludeHash = "true"),
      (e.dataset.domains = "llmon.lab.sael.net,sael.net"),
      document.head.appendChild(e));
  }
}
