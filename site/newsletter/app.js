const T0 = Date.now(),
  f = document.getElementById("nf"),
  m = document.getElementById("nm"),
  b = document.getElementById("nb"),
  e = document.getElementById("ne"),
  ok = document.getElementById("no");
f.addEventListener("submit", async (o) => {
  o.preventDefault();
  const n = m.value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(n)) {
    ((e.textContent = "That address does not look right."),
      (e.hidden = !1),
      m.focus());
    return;
  }
  ((e.hidden = !0), (b.disabled = !0), (b.textContent = "\u2026"));
  try {
    const t = await fetch("/api/say", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "newsletter",
        email: n,
        pot: document.getElementById("np").value,
        ms: Date.now() - T0,
      }),
    });
    if (!t.ok) throw new Error(await t.text());
    if (((f.hidden = !0), (ok.hidden = !1), window.umami))
      try {
        umami.track("newsletter-signup");
      } catch {}
  } catch {
    ((e.textContent =
      "That did not go through. Try again in a moment, or write to hello@sael.net."),
      (e.hidden = !1),
      (b.disabled = !1),
      (b.textContent = "Sign up"));
  }
});
