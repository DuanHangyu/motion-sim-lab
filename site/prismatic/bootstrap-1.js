(() => {
  const r = "wdecr",
    n = (t) => {
      if (t._houseKey || t.ctrlKey || t.metaKey || t.altKey || t.isComposing)
        return;
      const o = t.target,
        e = t.key;
      if (
        !e ||
        e.length !== 1 ||
        !/[a-z]/i.test(e) ||
        r.includes(e.toLowerCase()) ||
        (o &&
          (o.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(o.tagName)))
      )
        return;
      if (!t.shiftKey) {
        t.type === "keydown" && t.stopImmediatePropagation();
        return;
      }
      t.stopImmediatePropagation();
      const a = new KeyboardEvent(t.type, {
        key: e.toLowerCase(),
        code: t.code,
        location: t.location,
        repeat: t.repeat,
        bubbles: !0,
        cancelable: !0,
        composed: !0,
      });
      ((a._houseKey = 1), (o || window).dispatchEvent(a) || t.preventDefault());
    };
  (addEventListener("keydown", n, !0), addEventListener("keyup", n, !0));
})();
