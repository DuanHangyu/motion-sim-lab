const $$ = (q) => [...document.querySelectorAll(q)];
const grid = document.querySelector(".grid");
const fmt = (n) =>
  n >= 1e6
    ? (n / 1e6).toFixed(n < 1e7 ? 1 : 0) + "M"
    : n >= 1e3
      ? (n / 1e3).toFixed(n < 1e4 ? 1 : 0).replace(/\.0$/, "") + "k"
      : String(n || 0);
const EYE =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
// soft synthesized UI sounds (no files): a tick on hover, a tock on press; muted state remembered per visitor
const S = { on: true, ac: null, last: 0 };
try {
  S.on = localStorage.getItem("sael-sound") !== "0";
} catch {}
const snd = document.querySelector(".snd");
snd.setAttribute("aria-pressed", S.on);
function tone(f, d, g, type = "sine", sweep = 0.55) {
  if (!S.on || !S.ac || S.ac.state !== "running") return;
  const t = S.ac.currentTime,
    o = S.ac.createOscillator(),
    v = S.ac.createGain(),
    lp = S.ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = f * 2.2;
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * sweep, t + d);
  v.gain.setValueAtTime(0.0001, t);
  v.gain.exponentialRampToValueAtTime(g, t + 0.004);
  v.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(lp).connect(v).connect(S.ac.destination);
  o.start(t);
  o.stop(t + d + 0.02);
}
const wake = () => {
  try {
    S.ac = S.ac || new (window.AudioContext || window.webkitAudioContext)();
    if (S.ac.state === "suspended") S.ac.resume();
  } catch {}
};
addEventListener("pointerdown", wake, { capture: true });
addEventListener("keydown", wake, { capture: true });
const tick = () => {
    const n = performance.now();
    if (n - S.last < 45) return;
    S.last = n;
    tone(2600, 0.03, 0.025);
  },
  tock = () => tone(640, 0.09, 0.09, "triangle", 0.5),
  clack = () => tone(1500, 0.05, 0.05, "triangle", 0.7);
snd.onclick = () => {
  S.on = !S.on;
  snd.setAttribute("aria-pressed", S.on);
  try {
    localStorage.setItem("sael-sound", S.on ? "1" : "0");
  } catch {}
  wake();
  tone(S.on ? 1200 : 500, 0.08, 0.06, "triangle", S.on ? 1.6 : 0.6);
};
const noteOff = (el) => {
  try {
    return localStorage.getItem("sael-note-" + el.dataset.note) === "0";
  } catch {
    return false;
  }
};
{
  const dis = document.querySelector(".dis");
  if (dis)
    dis.querySelector("button").onclick = () => {
      dis.hidden = true;
      clack();
      try {
        localStorage.setItem("sael-note-" + dis.dataset.note, "0");
      } catch {}
    };
}
{
  const f = document.querySelector(".ask-box");
  if (f) {
    const inp = f.querySelector("input"),
      go = f.querySelector(".ask-go"),
      msg = document.getElementById("ask-msg");
    const REPO = "https://github.com/rsael/visual-learning";
    document.querySelectorAll(".ask-try button").forEach(
      (b) =>
        (b.onclick = () => {
          inp.value = b.textContent;
          inp.focus();
          msg.hidden = true;
          clack();
        }),
    );
    inp.oninput = () => {
      msg.hidden = true;
      go.classList.remove("done");
    };
    f.onsubmit = async (e) => {
      e.preventDefault();
      const topic = inp.value
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[.?!]+$/, "");
      if (!topic) {
        f.classList.remove("ask-shake");
        void f.offsetWidth;
        f.classList.add("ask-shake");
        inp.focus();
        return;
      }
      const text =
        "Clone " +
        REPO +
        " and follow its AGENTS.md: build me a lab, review it against the collection, and submit it if it passes. The topic: " +
        topic +
        ".";
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const t = document.createElement("textarea");
        t.value = text;
        t.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      go.classList.add("done");
      go.querySelector(".t").textContent = "Copied";
      msg.hidden = false;
      clack();
      setTimeout(() => {
        go.classList.remove("done");
        go.querySelector(".t").textContent = "Copy prompt";
      }, 2200);
    };
  }
}
let tag = "";
let cat = "Design",
  sort = cat ? "views" : "date";
const CATP = {
  Explainers: "/explainers",
  Worlds: "/worlds",
  Data: "/data",
  Design: "/design",
  Play: "/play",
  "Virtual Tour": "/virtual-tour",
};
const setSort = (v) => {
  sort = v;
  $$("[data-sort]").forEach((x) =>
    x.setAttribute("aria-pressed", x.dataset.sort === v),
  );
};
setSort(sort);
function lay() {
  const all = $$(".card");
  const inCat = (c) => !cat || c.dataset.cat === cat;
  all.forEach((c) => {
    c.hidden =
      !inCat(c) || (!!tag && !(c.dataset.tags || "").split("|").includes(tag));
  });
  // the tag line follows the category: only tags that appear in it, most used first
  const box = document.querySelector(".tags");
  if (box) {
    const count = {};
    all.filter(inCat).forEach((c) =>
      (c.dataset.tags || "")
        .split("|")
        .filter(Boolean)
        .forEach((t) => (count[t] = (count[t] || 0) + 1)),
    );
    const list = Object.entries(count)
      .filter(([t, n]) => n > 1 || t === tag)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 14);
    box.innerHTML = list.length
      ? list
          .map(
            ([t]) =>
              '<button data-tag="' +
              t +
              '" class="' +
              (t === tag ? "on" : "") +
              '">' +
              t +
              "</button>",
          )
          .join("<span>·</span>")
      : "";
    box.querySelectorAll("[data-tag]").forEach(
      (b) =>
        (b.onclick = () => {
          tag = tag === b.dataset.tag ? "" : b.dataset.tag;
          clack();
          glide(lay);
        }),
    );
  }
  const cards = all.filter((c) => !c.hidden);
  // in All, a work that has not been posted on X yet sits below the ones that have
  const sunk = (c) => (!cat && !c.dataset.x ? 1 : 0);
  cards.sort(
    (a, b) =>
      sunk(a) - sunk(b) ||
      (sort === "views"
        ? b.dataset.views - a.dataset.views
        : b.dataset.date.localeCompare(a.dataset.date)),
  );
  cards.forEach((c) => {
    c.classList.remove("big", "wide", "hero", "tall");
    grid.appendChild(c);
  });
  const cn = document.querySelector(".count");
  if (cn)
    cn.textContent = cards.length + " work" + (cards.length === 1 ? "" : "s");
  const ban = document.querySelector(".banner");
  if (ban) ban.hidden = ban.dataset.for !== cat;
  const dis = document.querySelector(".dis");
  if (dis)
    dis.hidden = !dis.dataset.for.split(" ").includes(cat) || noteOff(dis);
  // size by audience: the most-viewed work gets a 2x2 tile and the next two a wide one, with dense
  // packing closing the holes. Narrow screens and short lists stay uniform.
  const cs = getComputedStyle(grid),
    n = cards.length,
    cols = cs.gridTemplateColumns.split(" ").length;
  // give every row a height derived from the column width, so a 2x1 or 1x2 tile keeps the 16:10 shape
  // even when it sits in a row with nothing else to stretch it
  const gap = parseFloat(cs.gap) || 12,
    colW = (grid.clientWidth - gap * (cols - 1)) / cols;
  grid.style.setProperty("--row", Math.round((colW * 10) / 16) + "px");
  if (cols < 3 || n < 5) {
    if (cols === 2 && n % 2 === 1 && cards[0]) cards[0].classList.add("hero");
    return;
  }
  // pinned sizes win; the rest are weighted by views
  const SIZE = { "2x2": "big", "2x1": "wide", "1x2": "tall", full: "hero" };
  const pinned = cards.filter((c) => c.dataset.size);
  pinned.forEach((c) => {
    const k = SIZE[c.dataset.size];
    if (k) c.classList.add(k);
  });
  const free = cards.filter((c) => !c.dataset.size);
  const up = free.filter((c) => !sunk(c));
  const byViews = (up.length ? up : free).sort(
    (a, b) => b.dataset.views - a.dataset.views,
  );
  const give = (c, k) => c && c.classList.add(k);
  if (!pinned.some((c) => c.classList.contains("big"))) {
    give(byViews[0], "big");
    give(byViews[1], "wide");
    give(byViews[2], "wide");
  } else {
    give(byViews[0], "wide");
    give(byViews[1], "wide");
  }
}
// No row-straightening pass: it could strip every tile back to 1x1 (pressing "auto" shrank the whole
// grid). Dense packing already closes holes, and a short last row is normal.
const glide = (fn) => {
  const before = new Map(
    $$(".card").map((c) => [c, c.getBoundingClientRect()]),
  );
  fn();
  before.forEach((r, c) => {
    if (c.hidden) return;
    const n = c.getBoundingClientRect();
    const dx = r.left - n.left,
      dy = r.top - n.top;
    if (!dx && !dy && r.width === n.width) return;
    c.animate(
      [
        {
          transform: "translate(" + dx + "px," + dy + "px)",
          opacity: r.width ? 1 : 0,
        },
        { transform: "none", opacity: 1 },
      ],
      { duration: 440, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
  });
};
const pickCat = (v) => {
  if (cat === v) return;
  cat = v;
  tag = "";
  setSort(v ? "views" : "date"); // only the chips and the sidebar call this
  $$("[data-filter]").forEach((x) => {
    const mine = x.dataset.filter === v;
    if (x.tagName === "BUTTON") x.setAttribute("aria-pressed", mine);
    else x.classList.toggle("on", mine);
  });
  clack();
  glide(lay);
  const path = v
    ? CATP[v] ||
      "/" +
        v
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
    : "/";
  if (location.pathname !== path)
    history.pushState({ cat: v }, "", path + location.search);
};
history.replaceState({ cat }, "", location.pathname + location.search); // the first entry needs to carry its category
addEventListener("popstate", (e) => {
  const v = e.state?.cat ?? "";
  if (v !== cat) {
    cat = v;
    setSort(v ? "views" : "date");
    $$("[data-filter]").forEach((x) => {
      const mine = x.dataset.filter === v;
      if (x.tagName === "BUTTON") x.setAttribute("aria-pressed", mine);
      else x.classList.toggle("on", mine);
    });
    lay();
  }
});
$$("[data-filter]").forEach((b) =>
  b.addEventListener("click", (e) => {
    e.preventDefault();
    pickCat(b.dataset.filter);
  }),
);
// hysteresis: turn the fade on at 24px and off again below 6px, so a page resting near the
// threshold (or a rubber-band scroll) cannot flick it on and off
let faded = false;
const onScroll = () => {
  const y = scrollY;
  if (!faded && y > 24) faded = true;
  else if (faded && y < 6) faded = false;
  else return;
  document.body.classList.toggle("scrolled", faded);
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();
$$("[data-sort]").forEach(
  (b) =>
    (b.onclick = () => {
      if (sort === b.dataset.sort) return;
      sort = b.dataset.sort;
      $$("[data-sort]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      clack();
      const before = new Map(
        $$(".card").map((c) => [c, c.getBoundingClientRect()]),
      );
      lay();
      // FLIP: cards glide to their new places instead of jumping
      before.forEach((r, c) => {
        const n = c.getBoundingClientRect(),
          dx = r.left - n.left,
          dy = r.top - n.top;
        if (!dx && !dy) return;
        c.animate(
          [
            { transform: "translate(" + dx + "px," + dy + "px)" },
            { transform: "none" },
          ],
          { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
      });
    }),
);
lay();
addEventListener("resize", () => {
  clearTimeout(lay.t);
  lay.t = setTimeout(lay, 120);
});
$$(".hit").forEach((h) => {
  h.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") tick();
  });
  h.addEventListener("pointerdown", tock);
});
$$(".chip:not(.snd):not([data-sort])").forEach((c) =>
  c.addEventListener("pointerdown", clack),
);
// loops: only load and play what is on screen; posters only for reduced motion or data saver
const still =
  matchMedia("(prefers-reduced-motion: reduce)").matches ||
  navigator.connection?.saveData;
// Loops take turns. At most THREE play at once, only ones on screen, and every few seconds the
// longest-running one hands its slot to the next card along. A wall of 40 videos playing together is
// what made the page heavy; this keeps the movement without the heat.
if (!still && "IntersectionObserver" in window) {
  const MAX = 3,
    HOLD = 6500;
  const seen = new Set(),
    playing = new Set();
  const arm = (v) => {
    if (v.dataset.ready) return;
    v.dataset.ready = 1;
    v.innerHTML = v.dataset.src
      .split(" ")
      .map(
        (u) =>
          '<source src="' +
          u +
          '" type="' +
          (u.endsWith("webm") ? "video/webm; codecs=vp9" : "video/mp4") +
          '">',
      )
      .join("");
    v.load();
    v.addEventListener("playing", () => v.classList.add("on"));
  }; // not once: it fades in again on every turn
  const start = (v) => {
    arm(v);
    playing.add(v);
    v.play().catch(() => {});
  };
  const stop = (v) => {
    playing.delete(v);
    v.classList.remove("on");
    v.pause();
  };
  const order = () =>
    $$(".media video").filter((v) => seen.has(v) && !v.closest(".card").hidden);
  function fill() {
    playing.forEach((v) => {
      if (!seen.has(v) || v.closest(".card").hidden) stop(v);
    });
    const pool = order();
    for (const v of pool) {
      if (playing.size >= Math.min(MAX, pool.length)) break;
      if (!playing.has(v)) start(v);
    }
  }
  function pass() {
    const pool = order();
    if (pool.length <= MAX || !playing.size) return;
    const out = playing.values().next().value;
    const i = pool.indexOf(out);
    stop(out);
    for (let k = 1; k <= pool.length; k++) {
      const v = pool[(i + k) % pool.length];
      if (!playing.has(v)) {
        start(v);
        break;
      }
    }
  }
  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) =>
        e.isIntersecting ? seen.add(e.target) : seen.delete(e.target),
      );
      fill();
    },
    { threshold: 0.35 },
  );
  $$(".media video").forEach((v) => io.observe(v));
  setInterval(() => {
    if (document.hidden) return;
    fill();
    pass();
  }, HOLD);
  // hovering a card jumps it to the front of the queue, whatever the rotation is doing
  $$(".card").forEach((c) =>
    c.addEventListener(
      "pointerenter",
      () => {
        const v = c.querySelector(".media video");
        if (!v || playing.has(v) || !seen.has(v)) return;
        if (playing.size >= MAX) stop(playing.values().next().value);
        start(v);
      },
      { passive: true },
    ),
  );
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) [...playing].forEach(stop);
    else fill();
  });
}
// counts: the page ships with a snapshot; refresh it, and "viewing" every minute while visible
// The two endpoints are painted independently: Umami is the slow one, so the X numbers (and the
// numbers already on the page) never wait for it. Baked figures stand in until each answer lands.
let SN = null,
  XN = null;
function paint() {
  let sum = 0;
  $$(".card").forEach((c) => {
    const s = SN && SN.projects[c.dataset.slug];
    const bx = c.dataset.x ? +c.dataset.x : 0;
    const x =
      XN && XN.projects[c.dataset.slug]
        ? XN.projects[c.dataset.slug].views
        : bx;
    const site = s ? s.views || 0 : Math.max(0, (+c.dataset.views || 0) - bx);
    const v = site + x;
    sum += v;
    c.dataset.views = v;
    const el = c.querySelector(".views");
    // same rule as the server: a number appears once the work is on X or past a thousand visits
    el.innerHTML =
      (c.hasAttribute("data-x") || x > 0 || site >= 1000) && v
        ? EYE + "<b>" + fmt(v) + "</b>"
        : "";
    el.title =
      site.toLocaleString("en-US") +
      " on the site" +
      (x || bx ? " + " + x.toLocaleString("en-US") + " on X" : "");
  });
  document.querySelector('[data-stat="views"]').textContent = fmt(sum);
  if (SN && HERE === null)
    document.querySelector('[data-stat="active"]').textContent =
      SN.total.active;
}
let HERE = null; // once the socket answers, Umami stops writing to the live number
function stats() {
  if (document.hidden) return;
  fetch("/api/stats")
    .then((r) => (r.ok ? r.json() : null))
    .then((s) => {
      if (s) {
        SN = s;
        paint();
      }
    })
    .catch(() => {});
  fetch("/api/x")
    .then((r) => (r.ok ? r.json() : null))
    .then((x) => {
      if (x) {
        XN = x;
        paint();
      }
    })
    .catch(() => {});
}
stats();
setInterval(stats, 90000);
document.addEventListener("visibilitychange", stats);

(() => {
  const APP = "c1f77e38-c085-4afe-af44-daf47e70855d",
    HOST = "api-db.d1.tel";
  if (!APP || !window.WebSocket) return;
  const rooms = new Map(); // room id -> { n, by, cbs: [], whos: [] }
  let ws = null,
    tries = 0,
    closed = false;

  // where the corner was served from, so a work hosted on another domain still asks sael.net
  let ORIGIN = location.origin;
  try {
    const s = document.currentScript;
    if (s && s.src) ORIGIN = new URL(s.src).origin;
  } catch {}

  const sub = (room, cb, watchOnly) => {
    const r = get(room);
    r.cbs.push(cb);
    if (watchOnly) r.watch = true;
    if (ws && ws.readyState === 1) join(room);
    if (r.n !== null) cb(r.n);
  };
  // the same room, broken down: { FR: 3, US: 1, "": 2 } — "" is a visitor whose country we never learned
  const who = (room, cb) => {
    const r = get(room);
    r.whos.push(cb);
    if (r.by) cb(r.by);
  };
  const get = (room) => {
    let r = rooms.get(room);
    if (!r) {
      r = { n: null, by: null, cbs: [], whos: [], watch: false };
      rooms.set(room, r);
    } // null until the server answers
    return r;
  };
  const say = (room) => {
    const r = rooms.get(room);
    if (!r) return;
    if (r.n !== null) r.cbs.forEach((cb) => cb(r.n));
    if (r.by) r.whos.forEach((cb) => cb(r.by));
  };
  // crypto.randomUUID only exists in a secure context, so on the plain-http preview host it threw and
  // every message, init included, vanished into the catch below. The id only has to be unique per socket.
  const rnd = (n) =>
    Array.from({ length: n }, () =>
      ((Math.random() * 16) | 0).toString(16),
    ).join("");
  const uid = () =>
    crypto.randomUUID
      ? crypto.randomUUID()
      : rnd(8) + "-" + rnd(4) + "-4" + rnd(3) + "-a" + rnd(3) + "-" + rnd(12);
  const send = (m) => {
    try {
      ws.send(JSON.stringify({ "client-event-id": uid(), ...m }));
    } catch {}
  };

  // whether the socket is up, for anything that wants to say so on screen
  let linked = false;
  const linkCbs = [];
  const setLink = (v) => {
    if (linked === v) return;
    linked = v;
    linkCbs.forEach((cb) => {
      try {
        cb(v);
      } catch {}
    });
  };

  // the country, asked once a session and remembered. An empty answer is a real answer: it means
  // "not known", and a visitor counts the same either way.
  let CC = null;
  try {
    CC = sessionStorage.getItem("sael-cc");
  } catch {}
  const tell = (room) => {
    const r = rooms.get(room);
    if (!r || r.watch || !CC || !ws || ws.readyState !== 1) return;
    send({ op: "set-presence", "room-id": room, data: { c: CC } });
  };
  if (CC === null) {
    fetch(ORIGIN + "/api/where")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        CC = (j && j.c) || "";
        try {
          sessionStorage.setItem("sael-cc", CC);
        } catch {}
        rooms.forEach((_, room) => tell(room));
      })
      .catch(() => {
        CC = "";
      });
  }

  let queue = [],
    draining = false;
  const join = (room) => {
    queue.push(room);
    drain();
  };
  function drain() {
    if (draining || !queue.length || !ws || ws.readyState !== 1) return;
    draining = true;
    const room = queue.shift();
    send({ op: "join-room", "room-type": "sael", "room-id": room, data: {} });
    // a watcher says so, and is left out of everyone else's count. Everyone else says where they are.
    if (rooms.get(room)?.watch)
      send({ op: "set-presence", "room-id": room, data: { o: 1 } });
    else tell(room);
    setTimeout(() => {
      draining = false;
      drain();
    }, 30);
  }

  function open() {
    if (closed) return;
    try {
      ws = new WebSocket("wss://" + HOST + "/runtime/session");
    } catch {
      return;
    }
    ws.onopen = () =>
      send({ op: "init", "app-id": APP, versions: { sael: "1" } });
    ws.onmessage = (e) => {
      let m;
      try {
        m = JSON.parse(e.data);
      } catch {
        return;
      }
      // a reconnect starts every room from "not answered yet", so an empty room's join-room-ok can set it back to zero
      // (otherwise a room that has since emptied keeps showing the count it had before the socket dropped)
      if (m.op === "init-ok") {
        tries = 0;
        queue = [];
        setLink(true);
        rooms.forEach((r, room) => {
          r.n = null;
          join(room);
        });
        return;
      }
      // an empty room sends nothing at all, so the answer to "how many are here" is zero, not silence
      if (m.op === "join-room-ok" && m["room-id"]) {
        const r = rooms.get(m["room-id"]);
        if (r && r.n === null) {
          r.n = 0;
          r.by = {};
          say(m["room-id"]);
        }
        return;
      }
      if (m.op === "refresh-presence" && m["room-id"]) {
        const r = rooms.get(m["room-id"]);
        if (!r) return;
        const here = Object.values(m.data || {}).filter(
          (p) => !(p && p.data && p.data.o),
        ); // watchers do not count
        r.n = here.length;
        r.by = here.reduce((o, p) => {
          const c = (p && p.data && p.data.c) || "";
          o[c] = (o[c] || 0) + 1;
          return o;
        }, {});
        say(m["room-id"]);
      }
    };
    // a dropped socket comes back, with a widening gap, and gives up after a few minutes
    ws.onclose = () => {
      setLink(false);
      if (closed || tries > 6) return;
      setTimeout(open, Math.min(30000, 1000 * 2 ** tries++));
    };
    ws.onerror = () => {
      try {
        ws.close();
      } catch {}
    };
  }

  addEventListener("pagehide", () => {
    closed = true;
    try {
      ws.close();
    } catch {}
  });
  open();
  window.__saelHere = sub; // __saelHere(room, n => …)
  window.__saelWho = who; // __saelWho(room, by => …)   { FR: 3, "": 1 }
  window.__saelLink = (cb) => {
    linkCbs.push(cb);
    cb(linked);
  };
})();

// Umami counts live visitors per site and cannot say who is on this page; presence can, so when the
// socket is up the number becomes a count of people actually here rather than an estimate.
const showLive = () =>
  document.querySelector(".now .live")?.classList.remove("waiting");
setTimeout(showLive, 6000); // no socket, or none answering: show what we have
if (window.__saelHere) {
  const el = document.querySelector('[data-stat="active"]');
  window.__saelHere("home", () => {});
  window.__saelHere("all", (n) => {
    HERE = n;
    if (el) el.textContent = n;
    showLive();
  });
}

// the dialog: opened from the banner, closed on Escape, backdrop or ✕. Focus goes in and comes back out.
{
  const say = document.getElementById("say");
  if (say) {
    const sheet = say.querySelector(".sheet"),
      form = document.getElementById("say-f"),
      msg = document.getElementById("say-msg"),
      send = document.getElementById("say-send"),
      err = document.getElementById("say-err"),
      done = document.getElementById("say-done"),
      who2 = document.getElementById("say-who2"),
      who2w = document.getElementById("say-who2w"),
      hint = document.getElementById("say-hint");
    let last = null,
      rot = null,
      typed = false;
    const PH = [
      "I want one that explains how a jet engine actually makes thrust.",
      "I teach year 9 physics. Can I put this on the classroom projector without the internet?",
      "A phone version my students could poke at on the bus would be perfect.",
      "How does a vaccine train the immune system? That one, please.",
      "I'm writing a chapter on tides. Could I embed this in it?",
      "Can you do one on how GPS knows where I am?",
      "I'd use this in a lab induction if I could add our own equipment.",
      "Something on how antibiotics stop working would help my students a lot.",
      "How do I show this to a room of 30 without everyone needing a laptop?",
      "One on how a battery actually stores energy, for a first-year course.",
    ];
    // the placeholder rotates while the field is untouched, so it reads as a list of real asks
    const spin = () => {
      let i = Math.floor(Math.random() * PH.length);
      msg.placeholder = PH[i];
      rot = setInterval(() => {
        if (typed || document.hidden) return;
        msg.classList.add("ph");
        msg.style.opacity = ".45";
        setTimeout(() => {
          i = (i + 1) % PH.length;
          msg.placeholder = PH[i];
          msg.style.opacity = "1";
        }, 350);
      }, 4200);
    };
    const open = () => {
      last = document.activeElement;
      say.opened = Date.now();
      say.classList.add("on");
      say.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      typed = false;
      spin();
      setTimeout(() => say.querySelector(".who input").focus(), 60);
      if (window.umami)
        try {
          umami.track("say-open");
        } catch {}
    };
    const close = () => {
      say.classList.remove("on");
      say.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      clearInterval(rot);
      last && last.focus && last.focus();
    };
    say.querySelector(".x").onclick = close;
    document.getElementById("say-close2").onclick = close;
    say.addEventListener("click", (e) => {
      if (e.target === say) close();
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && say.classList.contains("on")) close();
    });
    // a dialog should not let the tab key wander off behind it
    sheet.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = [
        ...sheet.querySelectorAll("button,input,textarea,a[href]"),
      ].filter((el) => !el.disabled && el.offsetParent !== null && !el.hidden);
      if (!f.length) return;
      const first = f[0],
        lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    });
    const mailEl = document.getElementById("say-mail"),
      share = document.getElementById("say-share"),
      news = document.getElementById("say-news"),
      xh = document.getElementById("say-xh");
    const mailOk = () => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mailEl.value.trim());
    const ok = () =>
      (send.disabled =
        msg.value.trim().length < 3 ||
        !form.querySelector("input[name=who]:checked") ||
        (news.checked && !mailOk()));
    // the handle only means something once posting is allowed, and the newsletter only once there is an address
    const opts = () => {
      document.getElementById("say-xhw").hidden = !share.checked;
      document.getElementById("say-newsw").hidden = !news.checked || mailOk();
      ok();
    };
    share.addEventListener("change", () => {
      opts();
      if (share.checked) setTimeout(() => xh.focus(), 40);
    });
    news.addEventListener("change", () => {
      opts();
      if (news.checked && !mailOk()) mailEl.focus();
    });
    mailEl.addEventListener("input", opts);
    [...form.querySelectorAll("input[name=who]")].forEach((r) =>
      r.addEventListener("change", ok),
    );
    msg.addEventListener("input", () => {
      typed = msg.value.length > 0;
      ok();
      hint.textContent =
        msg.value.length > 1900
          ? 2000 - msg.value.length + " characters left"
          : "Anything goes: a topic, a frustration, a way you would use these.";
    });
    // Curious is the catch-all, so it is the one that offers a line to say what you actually do
    [...form.querySelectorAll("input[name=who]")].forEach((r) =>
      r.addEventListener("change", () => {
        const curious =
          form.querySelector("input[name=who]:checked")?.value ===
          "just curious";
        who2w.hidden = !curious;
        if (curious) setTimeout(() => who2.focus(), 40);
        else who2.value = "";
      }),
    );
    // ⌘/Ctrl + Enter sends, like every other message box
    msg.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !send.disabled)
        form.requestSubmit();
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const mail = document.getElementById("say-mail").value.trim();
      if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
        err.textContent =
          "That email address does not look right. Leave it empty if you would rather not say.";
        err.hidden = false;
        return;
      }
      err.hidden = true;
      send.disabled = true;
      send.textContent = "Sending…";
      const whoSel = form.querySelector("input[name=who]:checked")?.value || "";
      try {
        const r = await fetch("/api/say", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "feedback",
            who: whoSel,
            does: who2.value.trim(),
            name: document.getElementById("say-name").value.trim(),
            message: msg.value.trim(),
            email: mail,
            share: share.checked,
            xh: share.checked ? xh.value.trim() : "",
            news: news.checked,
            from: location.pathname,
            pot: document.getElementById("say-pot").value,
            ms: Date.now() - (say.opened || 0),
          }),
        });
        if (!r.ok) throw new Error(await r.text());
        form.hidden = true;
        done.hidden = false;
        document.getElementById("say-done-p").textContent = mail
          ? "I read every one of these myself, and I'll reply to " +
            mail +
            "." +
            (news.checked ? " You are on the newsletter too." : "")
          : "I read every one of these myself. No address, so I cannot write back, but it is read.";
        clearInterval(rot);
        if (window.umami)
          try {
            umami.track("say-sent", { who: whoSel });
            if (news.checked) umami.track("say-newsletter");
          } catch {}
      } catch (ex) {
        err.textContent =
          "That did not go through. Try again in a moment, or write to hello@sael.net.";
        err.hidden = false;
        send.disabled = false;
        send.textContent = "Send it";
      }
    });
    document.querySelectorAll("[data-say]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        open();
      }),
    );
  }
}
