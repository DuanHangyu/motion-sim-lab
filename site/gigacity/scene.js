import * as f from "three/webgpu";
import {
  Fn as At,
  If as F,
  Loop as Pe,
  Break as ia,
  Discard as ns,
  select as Y,
  float as k,
  int as Jn,
  vec2 as X,
  vec3 as w,
  vec4 as nt,
  mat3 as r0,
  uniform as W,
  uniformArray as Us,
  texture as Ve,
  attribute as Et,
  vertexStage as kt,
  property as Ys,
  positionGeometry as ce,
  normalGeometry as to,
  positionWorld as ua,
  positionPrevious as eo,
  normalWorld as os,
  cameraPosition as de,
  cameraViewMatrix as i0,
  cameraNear as Gd,
  cameraFar as Hd,
  normalView as Od,
  screenCoordinate as no,
  screenUV as kr,
  uv as re,
  mrt as Cr,
  output as u0,
  diffuseColor as Wd,
  velocity as qd,
  pass as Er,
  packNormalToRGB as c0,
  unpackRGBToNormal as Lr,
  sample as Kd,
  rtt as Fn,
  getViewPosition as Ud,
  perspectiveDepthToViewZ as Pr,
  mix as B,
  smoothstep as _,
  clamp as d0,
  fract as rt,
  floor as Jt,
  ceil as Yd,
  dot as gt,
  cross as Ao,
  normalize as vt,
  length as oe,
  distance as $d,
  abs as at,
  sign as oo,
  min as qt,
  max as Z,
  pow as Ft,
  exp as Kt,
  log as jd,
  sqrt as $s,
  inverseSqrt as m0,
  sin as ae,
  cos as Ke,
  atan as as,
  asin as Xd,
  acos as Qd,
  step as pt,
  mod as js,
  reflect as Tn,
  refract as Zd,
  fwidth as we,
  dFdx as f0,
  dFdy as h0,
} from "three/tsl";
import { ssgi as Jd } from "three/addons/tsl/display/SSGINode.js";
import { traa as tm } from "three/addons/tsl/display/TRAANode.js";
const tt = (t) => document.querySelector(t),
  fn = tt("#world"),
  Xs = tt("#app"),
  Q = (t, e, n) =>
    t?.isNode || e?.isNode || n?.isNode
      ? d0(t, e, n)
      : t < e
        ? e
        : t > n
          ? n
          : t,
  ne = (t, e, n) => t + (e - t) * n,
  Ir = (t, e, n) => {
    const o = Q((n - t) / (e - t), 0, 1);
    return o * o * (3 - 2 * o);
  },
  a5 = (t) => 1 - (1 - t) ** 3,
  em = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  Nn = (t) => Math.round(t).toLocaleString("en-US");
function g0(t) {
  return () => {
    ((t |= 0), (t = (t + 1831565813) | 0));
    let e = Math.imul(t ^ (t >>> 15), 1 | t);
    return (
      (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
const Br = "https://x.com/ryansael",
  s5 = "gigacity";
let nm = null;
const te = { on: !1, at: 0, off: 0, moved: 0, cam: new f.Matrix4() },
  Zt = { auto: !0, on: !1, over: !1, from: 0, last: 0, wait: 14 };
try {
  Zt.auto = localStorage.getItem("gigacity-compact") !== "0";
} catch {}
const tn = document.documentElement.classList.contains("embed");
let Vo = !tn,
  $e = (() => {
    const t = /[?&#]seed=(\d{1,9})/.exec(location.search + location.hash);
    return t ? +t[1] : 4417;
  })();
{
  const t = document.querySelector("#loading .ld-msg");
  t && (t.textContent = "Growing the city from seed " + $e);
}
function p0(t) {
  try {
    const e = new URLSearchParams(String(t || "").replace(/^#/, "")),
      n = (e.get("at") || "").split(",").map(Number),
      o = (e.get("look") || "").split(",").map(Number),
      a = e.get("sky"),
      s = +e.get("seed") || null,
      l = e.get("anime");
    return n.length !== 3 || n.some((r) => !isFinite(r))
      ? a || s || l
        ? { sky: a, seed: s, anime: l }
        : null
      : {
          sky: a,
          seed: s,
          anime: l,
          view: ["chase", "seat", "drone"].includes(e.get("view"))
            ? e.get("view")
            : "chase",
          x: n[0],
          y: n[1],
          z: n[2],
          h: ((isFinite(o[0]) ? o[0] : 90) * Math.PI) / 180,
          p:
            (Math.max(-89, Math.min(89, isFinite(o[1]) ? o[1] : 0)) * Math.PI) /
            180,
        };
  } catch {
    return null;
  }
}
const om = (() => {
  const t = p0(location.hash);
  return tn && !(t && t.sky) ? { ...(t || {}), sky: "dusk" } : t;
})();
function Qs(t) {
  return (
    (t ^= t >>> 16),
    (t = Math.imul(t, 2146121005)),
    (t ^= t >>> 15),
    (t = Math.imul(t, 2221713035)),
    (t ^= t >>> 16),
    t >>> 0
  );
}
const ca = (t, e = 0, n = 0) =>
    Qs(
      Math.imul($e | 0, 2654435761) ^
        Qs((t | 0) ^ Qs(((e | 0) + 1663821227) ^ Qs((n | 0) + 2232777461))),
    ),
  se = (t, e, n) => ca(t, e, n) / 4294967296,
  Fr = (t, e, n) => g0(ca(t, e, n));
function y0(t, e, n) {
  const o = Math.floor(t),
    a = Math.floor(e);
  let s = t - o,
    l = e - a;
  return (
    (s = s * s * (3 - 2 * s)),
    (l = l * l * (3 - 2 * l)),
    ne(
      ne(se(o, a, n), se(o + 1, a, n), s),
      ne(se(o, a + 1, n), se(o + 1, a + 1, n), s),
      l,
    )
  );
}
const Zs = (t, e) =>
    Q(
      y0(t / 1150, e / 1150, 901) * 0.64 + y0(t / 420, e / 420, 902) * 0.36,
      0,
      1,
    ),
  It = 170,
  Ue = (t, e) => {
    const n = se(e, t, 77);
    return ((e % 4) + 4) % 4 === 0 ? 66 + n * 26 : 30 + n * 20;
  },
  hn = 0,
  da = 1,
  ao = 2,
  ma = 3,
  x0 = ["residential", "terraced", "industrial", "glass"];
function b0(t, e, n, o, a) {
  const s = e - t,
    l = Math.max(1, Math.round(s / (o + n() * (a - o)))),
    r = [t];
  for (let u = 1; u < l; u++)
    r.push(t + (s * u) / l + (((n() - 0.5) * s) / l) * 0.4);
  return (r.push(e), r);
}
function am(t, e) {
  const n = t();
  return e > 0.62
    ? n < 0.22
      ? ma
      : n < 0.72
        ? hn
        : n < 0.88
          ? da
          : ao
    : n < 0.66
      ? hn
      : n < 0.82
        ? da
        : n < 0.93
          ? ao
          : ma;
}
const zo = new Map();
let w0 = 0;
function Rn(t, e) {
  const n = t * 65537 + e;
  let o = zo.get(n);
  return (o || ((o = sm(t, e)), zo.set(n, o)), o);
}
function sm(t, e) {
  const n = t * It + Ue(0, t) / 2,
    o = (t + 1) * It - Ue(0, t + 1) / 2,
    a = e * It + Ue(1, e) / 2,
    s = (e + 1) * It - Ue(1, e + 1) / 2,
    l = Fr(t, e, 1),
    r = b0(n, o, l, 34, 56),
    u = b0(a, s, l, 34, 56),
    i = r.length - 1,
    c = u.length - 1,
    m = new Uint8Array(i * c),
    d = [],
    h = hm(t, e),
    y = gm(h);
  if (h && (h.role === "spire" || h.role === "gate" || h.role === "foot")) {
    const x = Dr(
      h,
      { x0: n, x1: o, z0: a, z1: s },
      ...(h.role === "foot" ? h.a : [t, e]),
    );
    (h.role === "foot" && (x.ghost = !0), d.push(x));
  } else
    for (let x = 0; x < i; x++)
      for (let b = 0; b < c; b++) {
        if (m[x * c + b]) continue;
        let V = 1,
          T = 1;
        (l() < 0.16 && x + 1 < i && !m[(x + 1) * c + b] && (V = 2),
          l() < 0.12 &&
            b + 1 < c &&
            !m[x * c + b + 1] &&
            (V === 1 || !m[(x + 1) * c + b + 1]) &&
            (T = 2));
        for (let A = 0; A < V; A++)
          for (let g = 0; g < T; g++) m[(x + A) * c + b + g] = 1;
        d.push(
          lm(
            { x0: r[x], x1: r[x + V], z0: u[b], z1: u[b + T] },
            [x === 0, x + V === i, b === 0, b + T === c],
            l,
            t,
            e,
            d.length,
            y,
          ),
        );
      }
  if (h && h.role === "under") {
    const x = Dr(h, { x0: n, x1: o, z0: a, z1: s }, ...h.a);
    ((x.ghost = !0), d.push(x));
  }
  h && h.role === "port" && d.push(Dr(h, { x0: n, x1: o, z0: a, z1: s }, t, e));
  for (const x of d) {
    x.nh = [0, 0, 0, 0];
    for (const b of d) {
      if (b === x || b.para || b.ghost) continue;
      const V = Math.min(x.z1, b.z1) - Math.max(x.z0, b.z0) > 0.5,
        T = Math.min(x.x1, b.x1) - Math.max(x.x0, b.x0) > 0.5;
      (V && Math.abs(b.x1 - x.x0) < 0.01 && (x.nh[0] = Math.max(x.nh[0], b.H)),
        V && Math.abs(b.x0 - x.x1) < 0.01 && (x.nh[1] = Math.max(x.nh[1], b.H)),
        T && Math.abs(b.z1 - x.z0) < 0.01 && (x.nh[2] = Math.max(x.nh[2], b.H)),
        T &&
          Math.abs(b.z0 - x.z1) < 0.01 &&
          (x.nh[3] = Math.max(x.nh[3], b.H)));
    }
  }
  return { i: t, j: e, x0: n, x1: o, z0: a, z1: s, towers: d, detail: null };
}
function lm(t, e, n, o, a, s, l = 1e9) {
  if (l >= 720 && um(t, o, a, s)) return im(t, e, n, o, a, s);
  const r = (t.x0 + t.x1) / 2,
    u = (t.z0 + t.z1) / 2,
    i = Zs(r, u),
    c = am(n, i),
    m = e[0] || e[1] || e[2] || e[3],
    d = [3.05, 3.5, 4.6, 3.9][c] + n() * 0.3,
    h = [
      [3.1, 4.2],
      [5.2, 7],
      [4, 6],
      [1.5, 2.1],
    ][c].reduce((A, g) => A + n() * (g - A));
  let y = 60 + 390 * Math.pow(i, 1.15) * (0.5 + 0.9 * n());
  (n() < 0.07 && (y = y * 1.45 + 160),
    m || (y *= 0.85 + 0.3 * n()),
    (y = Math.max(d * 16, Math.round(Math.min(y, l) / d) * d)));
  const x = {
    x0: t.x0,
    x1: t.x1,
    z0: t.z0,
    z1: t.z1,
    cx: r,
    cz: u,
    H: y,
    style: c,
    fh: d,
    bay: h,
    E: e,
    street: m,
    seed: n(),
    lit: 0.35 + 0.65 * n(),
    segs: [],
    pods: [],
    id: (ca(o, a, s) % 9e3) + 1e3,
    blk: [o, a],
  };
  let b = 0;
  for (; b < y - 0.5;) {
    let A =
      b === 0 ? d * Math.round(3 + n() * 5) : d * Math.round(5 + n() * 15);
    b + A > y - d * 4 && (A = y - b);
    const g = b / y,
      M = [0, 0, 0, 0];
    for (let G = 0; G < 4; G++) {
      let H = n() * 1.1;
      (n() < 0.17 && (H += 2 + n() * 7),
        g > 0.6 && (H += (g - 0.6) * n() * 30),
        e[G] && b > 14 && n() < 0.2 && (H = -(0.8 + n() * 2.8)),
        (M[G] = Math.round(H * 2) / 2));
    }
    let L = t.x0 + M[0],
      C = t.x1 - M[1],
      E = t.z0 + M[2],
      R = t.z1 - M[3];
    if (C - L < 10) {
      const G = (L + C) / 2;
      ((L = G - 5), (C = G + 5));
    }
    if (R - E < 10) {
      const G = (E + R) / 2;
      ((E = G - 5), (R = G + 5));
    }
    (x.segs.push({ x0: L, x1: C, z0: E, z1: R, y0: b, y1: b + A, v: n() }),
      (b += A));
  }
  const V = (A, g, M, L, C) => {
    const E = x.segs.find((K) => g >= K.y0 && g < K.y1);
    if (!E || g + M > E.y1) return;
    const R = A < 2,
      G = R ? E.z0 : E.x0,
      H = R ? E.z1 : E.x1;
    if (H - G < L + 3) return;
    const I = G + 1.5 + L / 2 + n() * (H - G - L - 3),
      P = A === 0 ? E.x0 : A === 1 ? E.x1 : A === 2 ? E.z0 : E.z1,
      q = A % 2 ? 1 : -1,
      S = n();
    x.pods.push(
      R
        ? {
            x0: Math.min(P, P + q * C),
            x1: Math.max(P, P + q * C),
            z0: I - L / 2,
            z1: I + L / 2,
            y0: g,
            y1: g + M,
            v: S,
          }
        : {
            x0: I - L / 2,
            x1: I + L / 2,
            z0: Math.min(P, P + q * C),
            z1: Math.max(P, P + q * C),
            y0: g,
            y1: g + M,
            v: S,
          },
    );
  };
  for (let A = 0; A < 4; A++)
    if (e[A]) {
      for (let g = 0, M = Math.floor(n() * n() * 6); g < M; g++)
        V(
          A,
          d * Math.round((18 + n() * (y - 60)) / d),
          d * (3 + Math.floor(n() * 4)),
          7 + n() * 8,
          2 + n() * 2,
        );
      if (c === hn || c === da)
        for (let g = 0, M = 2 + Math.floor(n() * 9); g < M; g++)
          V(
            A,
            d * Math.round((10 + n() * (y - 30)) / d),
            d * (1 + Math.floor(n() * 2)),
            3 + n() * 4,
            0.7 + n() * 0.8,
          );
    }
  const T = (A, g, M, L, C) => {
    const E = 3 + n() * 5,
      R = 3 + n() * 5;
    if (g - A < E + 1 || L - M < R + 1) return;
    const G = A + 0.5 + E / 2 + n() * (g - A - E - 1),
      H = M + 0.5 + R / 2 + n() * (L - M - R - 1),
      I = d * (1 + Math.floor(n() * n() * 3));
    x.pods.push({
      x0: G - E / 2,
      x1: G + E / 2,
      z0: H - R / 2,
      z1: H + R / 2,
      y0: C,
      y1: C + I,
      v: n(),
    });
  };
  {
    const A = x.segs[x.segs.length - 1];
    for (let g = 0, M = Math.floor(n() * 5); g < M; g++)
      T(A.x0 + 2, A.x1 - 2, A.z0 + 2, A.z1 - 2, y);
  }
  for (let A = 0; A + 1 < x.segs.length; A++) {
    const g = x.segs[A],
      M = x.segs[A + 1],
      L = g.y1;
    (M.x0 - g.x0 > 4.5 &&
      n() < 0.7 &&
      T(g.x0 + 0.3, M.x0 - 0.3, g.z0 + 0.3, g.z1 - 0.3, L),
      g.x1 - M.x1 > 4.5 &&
        n() < 0.7 &&
        T(M.x1 + 0.3, g.x1 - 0.3, g.z0 + 0.3, g.z1 - 0.3, L),
      M.z0 - g.z0 > 4.5 &&
        n() < 0.7 &&
        T(g.x0 + 0.3, g.x1 - 0.3, g.z0 + 0.3, M.z0 - 0.3, L),
      g.z1 - M.z1 > 4.5 &&
        n() < 0.7 &&
        T(g.x0 + 0.3, g.x1 - 0.3, M.z1 + 0.3, g.z1 - 0.3, L));
  }
  return (w0++, x);
}
const M0 = 4;
x0.push("parametric");
const ss = [
    {
      p: 2,
      ab: 0.74,
      tw: 1.3,
      bu: 0.1,
      vb: 0.36,
      tp: 0.6,
      nf: 22,
      fd: 0.075,
      vl: 0.79,
      cr: 0.075,
      ci: 0.55,
      cant: 0,
    },
    {
      p: 3.4,
      ab: 1,
      tw: 1.57,
      bu: 0.06,
      vb: 0.5,
      tp: 0.72,
      nf: 24,
      fd: 0.065,
      vl: 0.83,
      cr: 0.055,
      ci: 0.42,
      cant: 1.9,
    },
    {
      p: 2.2,
      ab: 0.62,
      tw: 0.8,
      bu: 0.14,
      vb: 0.3,
      tp: 0.52,
      nf: 18,
      fd: 0.085,
      vl: 0.76,
      cr: 0.09,
      ci: 0.66,
      cant: 3.6,
    },
    {
      p: 4.6,
      ab: 0.9,
      tw: 1.05,
      bu: 0.05,
      vb: 0.44,
      tp: 0.8,
      nf: 28,
      fd: 0.06,
      vl: 0.81,
      cr: 0.06,
      ci: 0.36,
      cant: 5.1,
    },
  ],
  Js = 600,
  T0 = 13 / Js,
  tl = 1.1 / Js;
function rm(t) {
  const e = [],
    n = [],
    o = [],
    a = [],
    s = [];
  let l = 0,
    r = 0,
    u = 0,
    i = 0;
  const c = (N) => t.tw * Math.pow(Math.max(N, 0), 1.15),
    m = (N) =>
      1 +
      t.bu * Math.exp(-(((N - t.vb) / 0.27) ** 2)) -
      (1 - t.tp) * Math.pow(Math.min(N, 1), 1.6),
    d = (N) =>
      Math.pow(
        Math.abs(Math.cos(N)) ** t.p + Math.abs(Math.sin(N) / t.ab) ** t.p,
        -1 / t.p,
      ),
    h = (N, O) => {
      const $ = d(N) * m(O),
        ht = N + c(O);
      return [$ * Math.cos(ht), O, $ * Math.sin(ht)];
    },
    y = (N, O) => {
      const ht = h(N + 0.001, O),
        ut = h(N - 0.001, O),
        ct = h(N, Math.min(1, O + 0.001)),
        lt = h(N, Math.max(0, O - 0.001)),
        dt = [ht[0] - ut[0], ht[1] - ut[1], ht[2] - ut[2]],
        j = [ct[0] - lt[0], ct[1] - lt[1], ct[2] - lt[2]],
        it = [
          j[1] * dt[2] - j[2] * dt[1],
          j[2] * dt[0] - j[0] * dt[2],
          j[0] * dt[1] - j[1] * dt[0],
        ],
        bt = Math.hypot(...it) || 1;
      return [it[0] / bt, it[1] / bt, it[2] / bt];
    },
    x = (N, O, $, ht, ut) => (
      e.push(N[0], N[1], N[2]),
      n.push(O[0], O[1], O[2]),
      o.push($, ht),
      a.push(ut),
      l++
    ),
    b = (N, O, $, ht, ut) => {
      const ct = (Mt) => [e[Mt * 3], e[Mt * 3 + 1], e[Mt * 3 + 2]],
        lt = ct(N),
        dt = ct(O),
        j = ct($),
        it = [dt[0] - lt[0], dt[1] - lt[1], dt[2] - lt[2]],
        bt = [j[0] - lt[0], j[1] - lt[1], j[2] - lt[2]];
      (it[1] * bt[2] - it[2] * bt[1]) * ut[0] +
        (it[2] * bt[0] - it[0] * bt[2]) * ut[1] +
        (it[0] * bt[1] - it[1] * bt[0]) * ut[2] >=
      0
        ? s.push(N, O, $, N, $, ht)
        : s.push(N, $, O, N, ht, $);
    },
    V = 112,
    T = 80,
    A = Math.PI * 2;
  for (let N = 0; N <= T; N++) {
    const O = N / T;
    for (let $ = 0; $ <= V; $++) {
      const ht = ($ / V) * A,
        ut = h(ht, O);
      ((r = Math.max(r, Math.hypot(ut[0], ut[2]))),
        x(ut, y(ht, O), $ / V, O, 0));
    }
  }
  for (let N = 0; N < T; N++)
    for (let O = 0; O < V; O++) {
      const $ = N * (V + 1) + O;
      b($, $ + V + 1, $ + V + 2, $ + 1, y(((O + 0.5) / V) * A, (N + 0.5) / T));
    }
  {
    const N = x([0, 1, 0], [0, 1, 0], 0.5, 1, 2),
      O = l;
    for (let $ = 0; $ <= V; $++) x(h(($ / V) * A, 1), [0, 1, 0], $ / V, 1, 2);
    for (let $ = 0; $ < V; $++) s.push(N, O + $ + 1, O + $);
  }
  const g = 12,
    M = 0.024,
    L = (N, O) => {
      const $ = Math.min(O, 1),
        ht = y(N, $);
      let ut = ht[0],
        ct = ht[2];
      {
        const dt = Math.hypot(ut, ct) || 1;
        ((ut /= dt), (ct /= dt));
      }
      let lt = h(N, $);
      if (O > 1) {
        const dt = (O - 1) / t.cr,
          j = c(O) - c(1),
          it = d(N) * m(1) * (1 - t.ci * Math.pow(dt, 1.3)),
          bt = N + c(O),
          St = Math.cos(j),
          Mt = Math.sin(j);
        lt = [it * Math.cos(bt), O, it * Math.sin(bt)];
        const mt = ut * St - ct * Mt,
          Rt = ut * Mt + ct * St;
        ((ut = mt), (ct = Rt));
      }
      return {
        p: lt,
        ox: ut,
        oz: ct,
        d: t.fd * (1 - 0.55 * Math.max(0, (O - 1) / t.cr)),
      };
    };
  for (let N = 0; N < t.nf; N++) {
    const O = ((N + 0.5) / t.nf) * A,
      $ = (N + 0.5) / t.nf,
      ht = [];
    for (let ut = 0; ut <= T + g; ut++) {
      const ct = ut <= T ? ut / T : 1 + ((ut - T) / g) * t.cr,
        { p: lt, ox: dt, oz: j, d: it } = L(O, ct),
        bt = (-j * M) / 2,
        St = (dt * M) / 2,
        Mt = 0.004,
        mt = [lt[0] - dt * Mt - bt, ct, lt[2] - j * Mt - St],
        Rt = [lt[0] + dt * it - bt, ct, lt[2] + j * it - St],
        $t = [lt[0] + dt * it + bt, ct, lt[2] + j * it + St],
        Xn = [lt[0] - dt * Mt + bt, ct, lt[2] - j * Mt + St];
      r = Math.max(r, Math.hypot(Rt[0], Rt[2]), Math.hypot($t[0], $t[2]));
      const Je = [-j, 0, dt].map((Ws) => -Ws),
        yo = [-j, 0, dt],
        Mn = [dt, 0, j];
      ht.push({
        n: [Je, Mn, yo],
        v: [
          x(mt, Je, $, ct, 1),
          x(Rt, Je, $, ct, 1),
          x(Rt, Mn, $, ct, 7),
          x($t, Mn, $, ct, 7),
          x($t, yo, $, ct, 1),
          x(Xn, yo, $, ct, 1),
        ],
      });
    }
    for (let ut = 0; ut < ht.length - 1; ut++) {
      const ct = ht[ut].v,
        lt = ht[ut + 1].v;
      for (let dt = 0; dt < 3; dt++)
        b(ct[dt * 2], ct[dt * 2 + 1], lt[dt * 2 + 1], lt[dt * 2], ht[ut].n[dt]);
    }
    {
      const ut = ht[ht.length - 1].v,
        ct = [0, 1, 0],
        lt = [0, 1, 2, 3, 4, 5].map((dt) =>
          x(
            [e[ut[dt] * 3], e[ut[dt] * 3 + 1], e[ut[dt] * 3 + 2]],
            ct,
            $,
            1 + t.cr,
            1,
          ),
        );
      b(lt[0], lt[1], lt[4], lt[5], ct);
    }
  }
  const C = t.vl,
    E = C + T0,
    R = c(C),
    G = (N) => Math.pow(Math.max(0, Math.cos(N + R - t.cant)), 2),
    H = (N) => d(N) * m(C),
    I = (N) => H(N) * (1.09 + 0.34 * G(N)),
    P = (N, O, $) => [O * Math.cos(N + R), $, O * Math.sin(N + R)],
    q = (N) => {
      const $ = P(N + 0.001, I(N + 0.001), 0),
        ht = P(N - 0.001, I(N - 0.001), 0),
        ut = $[0] - ht[0],
        ct = $[2] - ht[2],
        lt = Math.hypot(ut, ct) || 1;
      return [ct / lt, 0, -ut / lt];
    };
  for (let N = 0; N < V; N++) {
    const O = ((N + 0.5) / V) * A;
    ((i = Math.max(i, I(O) - H(O))), (u = Math.max(u, I(O))));
  }
  const S = (N, O, $, ht, ut) => {
      const ct = l;
      for (let lt = 0; lt <= V; lt++) {
        const dt = (lt / V) * A;
        x(P(dt, N(dt), O), $ || q(dt), lt / V, ut, ht);
      }
      return ct;
    },
    K = (N, O, $) => {
      for (let ht = 0; ht < V; ht++)
        b(N + ht, N + ht + 1, O + ht + 1, O + ht, $ || q(((ht + 0.5) / V) * A));
    },
    ot = (N) => H(N) * 0.96,
    xt = [0, 1, 0],
    U = [0, -1, 0];
  K(S(ot, C, U, 2, 0), S(I, C, U, 2, 0), U);
  const J = [
    [C, C + tl, 2],
    [C + tl, E - tl, 3],
    [E - tl, E, 2],
  ];
  for (const [N, O, $] of J) K(S(I, N, null, $, 0), S(I, O, null, $, 1), null);
  K(S(ot, E, xt, 2, 1), S(I, E, xt, 2, 1), xt);
  {
    const N = E + 0.12 / Js,
      O = Math.round((((((t.cant - R) / A) % 1) + 1) % 1) * V),
      $ = Math.floor(V * 0.3),
      ht = [],
      ut = [];
    for (let ct = -$; ct <= $; ct++) {
      const lt = ((O + ct) / V) * A,
        dt = H(lt) * 1.1 + 0.05,
        j = I(lt) - 0.018;
      j <= dt + 0.02 ||
        (ht.push(x(P(lt, dt, N), xt, (O + ct) / V, 0, 4)),
        ut.push(x(P(lt, j, N), xt, (O + ct) / V, 1, 4)));
    }
    for (let ct = 0; ct + 1 < ht.length; ct++)
      b(ht[ct], ht[ct + 1], ut[ct + 1], ut[ct], xt);
  }
  {
    const N = 1 + t.cr * 0.32,
      O = 6,
      $ = 0.012,
      ht = l;
    for (let ut = 0; ut <= V; ut++) {
      const ct = (ut / V) * A,
        { p: lt, ox: dt, oz: j, d: it } = L(ct, N),
        bt = lt[0] + dt * (it + 0.006),
        St = lt[2] + j * (it + 0.006);
      for (let Mt = 0; Mt <= O; Mt++) {
        const mt = (Mt / O) * A,
          Rt = Math.cos(mt),
          $t = Math.sin(mt);
        x(
          [bt + dt * Rt * $, N + ($t * $) / 30, St + j * Rt * $],
          [dt * Rt, $t * 30, j * Rt],
          ut / V,
          Mt / O,
          5,
        );
      }
    }
    for (let ut = 0; ut < V; ut++)
      for (let ct = 0; ct < O; ct++) {
        const lt = ht + ut * (O + 1) + ct,
          dt = lt + O + 1,
          j = [n[lt * 3], n[lt * 3 + 1], n[lt * 3 + 2]];
        b(lt, dt, dt + 1, lt + 1, j);
      }
  }
  {
    const N = 1 + t.cr + 0.014,
      O = 0.007,
      $ = 10,
      ht = l;
    for (let lt = 0; lt <= $; lt++) {
      const dt = (lt / $) * A,
        j = [Math.cos(dt), 0, Math.sin(dt)];
      (x([j[0] * O, 1, j[2] * O], j, lt / $, 0, 2),
        x([j[0] * O, N, j[2] * O], j, lt / $, 1, 2));
    }
    for (let lt = 0; lt < $; lt++) {
      const dt = ht + lt * 2;
      b(dt, dt + 2, dt + 3, dt + 1, [n[dt * 3], 0, n[dt * 3 + 2]]);
    }
    const ut = 0.009,
      ct = 2.2 / Js;
    for (const [lt, dt] of [
      [
        [1, 0, 0],
        [
          [1, -1, -1],
          [1, 1, -1],
          [1, 1, 1],
          [1, -1, 1],
        ],
      ],
      [
        [-1, 0, 0],
        [
          [-1, -1, -1],
          [-1, -1, 1],
          [-1, 1, 1],
          [-1, 1, -1],
        ],
      ],
      [
        [0, 0, 1],
        [
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ],
      ],
      [
        [0, 0, -1],
        [
          [-1, -1, -1],
          [-1, 1, -1],
          [1, 1, -1],
          [1, -1, -1],
        ],
      ],
      [
        [0, 1, 0],
        [
          [-1, 1, -1],
          [-1, 1, 1],
          [1, 1, 1],
          [1, 1, -1],
        ],
      ],
    ]) {
      const j = dt.map((it) =>
        x([it[0] * ut, N + (ct * (it[1] + 1)) / 2, it[2] * ut], lt, 0, 0, 6),
      );
      b(j[0], j[1], j[2], j[3], lt);
    }
  }
  const st = new f.InstancedBufferGeometry();
  return (
    st.setIndex(s),
    st.setAttribute("position", new f.Float32BufferAttribute(e, 3)),
    st.setAttribute("normal", new f.Float32BufferAttribute(n, 3)),
    st.setAttribute("pU", new f.Float32BufferAttribute(o, 2)),
    st.setAttribute("pK", new f.Float32BufferAttribute(a, 1)),
    { g: st, rBody: r, rLounge: u, cant: i, T: t }
  );
}
const ls = ss.map(rm);
function im(t, e, n, o, a, s) {
  const l = (t.x0 + t.x1) / 2,
    r = (t.z0 + t.z1) / 2,
    u = Math.min(
      ss.length - 1,
      Math.floor(se(o + s * 3, a - s, 611) * ss.length),
    ),
    i = ss[u],
    c = ls[u],
    m = 4.2,
    d = Math.round((450 + 260 * se(o, a + s, 612)) / m) * m,
    h = (Math.min(t.x1 - t.x0, t.z1 - t.z0) / 2 - 1.5) / c.rBody,
    y = se(o - s, a + s * 5, 613) * Math.PI * 2,
    x = c.rBody * h,
    b = c.rLounge * h,
    V = {
      x0: t.x0,
      x1: t.x1,
      z0: t.z0,
      z1: t.z1,
      cx: l,
      cz: r,
      H: d,
      style: M0,
      fh: m,
      bay: 3,
      E: e,
      street: e[0] || e[1] || e[2] || e[3],
      seed: n(),
      lit: 0.45 + 0.5 * n(),
      segs: [],
      pods: [],
      id: (ca(o, a, s) % 9e3) + 1e3,
      blk: [o, a],
      para: { tp: u, h, rot: y, T: i, cant: c.cant * h, lounge: d * i.vl },
    };
  return (
    V.segs.push(
      {
        x0: l - x,
        x1: l + x,
        z0: r - x,
        z1: r + x,
        y0: 0,
        y1: d * (1 + i.cr + 0.018),
        v: 0,
      },
      {
        x0: l - b,
        x1: l + b,
        z0: r - b,
        z1: r + b,
        y0: d * i.vl,
        y1: d * (i.vl + T0),
        v: 0,
      },
    ),
    w0++,
    V
  );
}
function um(t, e, n, o) {
  if (Math.min(t.x1 - t.x0, t.z1 - t.z0) < 42) return !1;
  const a = Zs((t.x0 + t.x1) / 2, (t.z0 + t.z1) / 2);
  return a > 0.5 && se(e * 7 + o, n * 13 - o, 404) < 0.04 + 0.25 * (a - 0.5);
}
const So = 400,
  ko = 3.6,
  el = ss.length,
  ye = Math.PI * 2;
function Nr(t) {
  const e = [],
    n = [],
    o = [],
    a = [],
    s = [],
    l = [];
  let r = 0;
  const u = (b) => {
      const V = Math.hypot(b[0], b[1], b[2]) || 1;
      return [b[0] / V, b[1] / V, b[2] / V];
    },
    i = (b, V, T, A, g) => (
      e.push(b[0], b[1] / t, b[2]),
      n.push(V[0], V[1] * t, V[2]),
      o.push(T, A),
      a.push(g),
      l.push(b[0], b[1], b[2]),
      r++
    ),
    c = (b, V, T, A, g) => {
      const M = b * 3,
        L = V * 3,
        C = T * 3,
        E = [l[L] - l[M], l[L + 1] - l[M + 1], l[L + 2] - l[M + 2]],
        R = [l[C] - l[M], l[C + 1] - l[M + 1], l[C + 2] - l[M + 2]];
      (E[1] * R[2] - E[2] * R[1]) * g[0] +
        (E[2] * R[0] - E[0] * R[2]) * g[1] +
        (E[0] * R[1] - E[1] * R[0]) * g[2] >=
      0
        ? s.push(b, V, T, b, T, A)
        : s.push(b, T, V, b, A, T);
    };
  return {
    vert: i,
    quad: c,
    lathe: (b, V, T, A = !1) => {
      const g = b
        .slice(0, -1)
        .map((M, L) => u([b[L + 1][1] - M[1], -(b[L + 1][0] - M[0]), 0]));
      for (let M = 0; M + 1 < b.length; M++) {
        const [L, C] = b[M],
          [E, R] = b[M + 1],
          G = T(M),
          H =
            A && M > 0
              ? u([g[M - 1][0] + g[M][0], g[M - 1][1] + g[M][1], 0])
              : g[M],
          I =
            A && M + 2 < b.length
              ? u([g[M][0] + g[M + 1][0], g[M][1] + g[M + 1][1], 0])
              : g[M],
          P = r;
        for (let q = 0; q <= V; q++) {
          const S = (q / V) * ye,
            K = Math.cos(S),
            ot = Math.sin(S);
          for (const [xt, U, J, st] of [
            [L, C, H, 0],
            [E, R, I, 1],
          ])
            i(
              [xt * K, U, xt * ot],
              [J[0] * K, J[1], J[0] * ot],
              (S * Math.max(xt, 0.5)) / (So * ko),
              G.v === null ? U / t : G.v === "span" ? st : G.v,
              G.k,
            );
        }
        for (let q = 0; q < V; q++) {
          const S = P + q * 2,
            K = ((q + 0.5) / V) * ye;
          c(S, S + 2, S + 3, S + 1, [
            g[M][0] * Math.cos(K),
            g[M][1],
            g[M][0] * Math.sin(K),
          ]);
        }
      }
    },
    torus: (b, V, T, A, g = 96, M = 8, L = 0, C = 0) => {
      const E = r;
      for (let R = 0; R <= g; R++) {
        const G = (R / g) * ye,
          H = Math.cos(G),
          I = Math.sin(G);
        for (let P = 0; P <= M; P++) {
          const q = (P / M) * ye,
            S = Math.cos(q),
            K = Math.sin(q);
          i(
            [L + (b + V * S) * H, T + V * K, C + (b + V * S) * I],
            [S * H, K, S * I],
            R / g,
            P / M,
            A,
          );
        }
      }
      for (let R = 0; R < g; R++)
        for (let G = 0; G < M; G++) {
          const H = E + R * (M + 1) + G,
            I = H + M + 1,
            P = ((R + 0.5) / g) * ye,
            q = ((G + 0.5) / M) * ye;
          c(H, I, I + 1, H + 1, [
            Math.cos(q) * Math.cos(P),
            Math.sin(q),
            Math.cos(q) * Math.sin(P),
          ]);
        }
    },
    tube: (b, V, T, A = 0) => {
      let g = [0, 1, 0];
      const M = b.map((C, E) => {
          const R = b[Math.max(0, E - 1)],
            G = b[Math.min(b.length - 1, E + 1)],
            H = u([G[0] - R[0], G[1] - R[1], G[2] - R[2]]);
          let I = [
            H[1] * g[2] - H[2] * g[1],
            H[2] * g[0] - H[0] * g[2],
            H[0] * g[1] - H[1] * g[0],
          ];
          I = Math.hypot(...I) < 1e-4 ? [1, 0, 0] : u(I);
          const P = u([
            I[1] * H[2] - I[2] * H[1],
            I[2] * H[0] - I[0] * H[2],
            I[0] * H[1] - I[1] * H[0],
          ]);
          return ((g = P), { s: I, up: P });
        }),
        L = [
          [1, 1],
          [-1, 1],
          [-1, -1],
          [1, -1],
        ];
      for (let C = 0; C < 4; C++) {
        const E = L[C],
          R = L[(C + 1) % 4],
          G = r,
          H = (I) => {
            const { s: P, up: q } = M[I];
            return u(
              [0, 1, 2].map((S) => P[S] * (E[0] + R[0]) + q[S] * (E[1] + R[1])),
            );
          };
        for (let I = 0; I < b.length; I++) {
          const P = b[I],
            { s: q, up: S } = M[I],
            K = (xt) =>
              [0, 1, 2].map(
                (U) => P[U] + ((q[U] * xt[0] + S[U] * xt[1]) * V) / 2,
              ),
            ot = H(I);
          (i(K(E), ot, A + C * 0.25, P[1] / t, T),
            i(K(R), ot, A + C * 0.25, P[1] / t, T));
        }
        for (let I = 0; I + 1 < b.length; I++) {
          const P = G + I * 2;
          c(P, P + 1, P + 3, P + 2, H(I));
        }
      }
    },
    box: (b, V, T, A, g, M, L, C = L) => {
      for (const [E, R] of [
        [
          [1, 0, 0],
          [
            [V, T, g],
            [V, A, g],
            [V, A, M],
            [V, T, M],
          ],
        ],
        [
          [-1, 0, 0],
          [
            [b, T, g],
            [b, T, M],
            [b, A, M],
            [b, A, g],
          ],
        ],
        [
          [0, 0, 1],
          [
            [b, T, M],
            [V, T, M],
            [V, A, M],
            [b, A, M],
          ],
        ],
        [
          [0, 0, -1],
          [
            [b, T, g],
            [b, A, g],
            [V, A, g],
            [V, T, g],
          ],
        ],
        [
          [0, 1, 0],
          [
            [b, A, g],
            [b, A, M],
            [V, A, M],
            [V, A, g],
          ],
        ],
        [
          [0, -1, 0],
          [
            [b, T, g],
            [V, T, g],
            [V, T, M],
            [b, T, M],
          ],
        ],
      ]) {
        const G = R.map((H) =>
          i(
            H,
            E,
            (Math.abs(E[0]) > 0.5 ? H[2] : H[0]) / (So * ko),
            E[1] ? 0.5 : (H[1] - T) / Math.max(A - T, 0.001),
            E[1] > 0.5 ? C : L,
          ),
        );
        c(G[0], G[1], G[2], G[3], E);
      }
    },
    done: (b) => {
      const V = new f.InstancedBufferGeometry();
      return (
        V.setIndex(s),
        V.setAttribute("position", new f.Float32BufferAttribute(e, 3)),
        V.setAttribute("normal", new f.Float32BufferAttribute(n, 3)),
        V.setAttribute("pU", new f.Float32BufferAttribute(o, 2)),
        V.setAttribute("pK", new f.Float32BufferAttribute(a, 1)),
        {
          g: V,
          rBody: b,
          rLounge: b,
          cant: 0,
          T: { nf: So },
          tris: s.length / 3,
        }
      );
    },
    nrm: u,
  };
}
const nl = 1400,
  rs = 72,
  ee = { y0: 30, y1: 1080, rb: 70, rt: 150, phi: ye / 3 },
  ol = (t) => {
    const e = Q((t - ee.y0) / (ee.y1 - ee.y0), 0, 1);
    return Math.sqrt(
      (1 - e) * (1 - e) * ee.rb * ee.rb +
        e * e * ee.rt * ee.rt +
        2 * e * (1 - e) * ee.rb * ee.rt * Math.cos(ee.phi),
    );
  };
function cm() {
  const t = nl,
    e = Nr(t),
    n = (r) => {
      const u = r / t;
      return 26 * Math.pow(1 - u, 0.8) + 6 * u;
    },
    o = 41,
    a = 1020,
    s = 1270;
  e.lathe(
    [
      [0, 0],
      [rs, 0],
      [rs, 1.2],
      [rs, 22.8],
      [rs, 24],
      [60, 24],
      [60, 25.2],
      [60, 39.8],
      [60, o],
      [0, o],
    ],
    112,
    (r) =>
      [
        { k: 2, v: 0.5 },
        { k: 2, v: "span" },
        { k: 0, v: null },
        { k: 2, v: "span" },
        { k: 2, v: 0.5 },
        { k: 2, v: "span" },
        { k: 0, v: null },
        { k: 2, v: "span" },
        { k: 2, v: 0.5 },
      ][r],
  );
  const l = [];
  for (let r = o; r < s; r += r < 900 ? 30 : 12) l.push([n(r), r]);
  (l.push([n(s), s]),
    e.lathe(l, 64, (r) => ({ k: l[r][1] < a + 50 ? 0 : 1, v: null }), !0),
    e.lathe(
      [
        [n(s), s],
        [0, s],
      ],
      64,
      () => ({ k: 1, v: null }),
    ));
  for (const r of [1, -1])
    for (let u = 0; u < 12; u++) {
      const i = (u / 12) * ye + (r < 0 ? ye / 24 : 0),
        c = [];
      for (let m = 0; m <= 10; m++) {
        const d = m / 10,
          h = [ee.rb * Math.cos(i), ee.rb * Math.sin(i)],
          y = [
            ee.rt * Math.cos(i + r * ee.phi),
            ee.rt * Math.sin(i + r * ee.phi),
          ];
        c.push([ne(h[0], y[0], d), ne(ee.y0, ee.y1, d), ne(h[1], y[1], d)]);
      }
      e.tube(c, 7, 7, u / 12);
    }
  for (const r of [170, 340, 520, 700, 880])
    e.torus(ol(r) + 1, 2.6, r, 5, 160, 8);
  (e.torus(ee.rt + 2, 4.2, ee.y1, 5, 192, 10),
    e.torus(ee.rt - 1, 2.4, ee.y1 - 9, 1, 192, 6));
  for (let r = 0; r < 6; r++) {
    const u = ((r + 0.5) / 6) * ye,
      i = Math.cos(u),
      c = Math.sin(u),
      m = [];
    for (let d = 0; d <= 24; d++) {
      const h = d / 24,
        y = 24 + h * 240,
        x = ne(68, n(y) + 1.5, Math.pow(h, 0.7));
      m.push([x * i, y, x * c]);
    }
    e.tube(m, 7, 1, r / 6);
  }
  {
    const u = [];
    for (let i = 0; i <= 32; i++) {
      const c = -Math.PI / 2 + (i / 32) * Math.PI;
      u.push([Math.max(n(a) * 0.5, 40 * Math.cos(c)), a + 40 * Math.sin(c)]);
    }
    (e.lathe(
      u,
      80,
      (i) => {
        const c = -Math.PI / 2 + ((i + 0.5) / 32) * Math.PI;
        return Math.abs(c) < 0.09
          ? { k: 2, v: "span" }
          : Math.abs(c) < 0.85
            ? { k: 3, v: c < 0 ? (c + 0.85) / 0.76 : (c - 0.09) / 0.76 }
            : { k: 1, v: null };
      },
      !0,
    ),
      e.torus(40 + 1.4, 1.5, a, 5, 128, 6));
  }
  {
    e.torus(52, 3, 1190, 5, 160, 8);
    for (let i = 0; i < 4; i++) {
      const c = (i / 4) * ye + ye / 8,
        m = [];
      for (let d = 0; d <= 6; d++) {
        const h = ne(n(1190), 52, d / 6);
        m.push([h * Math.cos(c), 1190 - (1 - d / 6) * 16, h * Math.sin(c)]);
      }
      e.tube(m, 3, 1, i / 4);
    }
  }
  return (
    e.lathe(
      [
        [4, s],
        [2.6, 1330],
        [0.9, t - 4],
        [0, t - 4],
      ],
      12,
      (r) => ({ k: r < 2 ? 1 : 2, v: null }),
      !0,
    ),
    e.box(-1.8, 1.8, t - 4, t - 0.6, -1.8, 1.8, 6),
    e.done(ee.rt + 6)
  );
}
const is = 780,
  fa = 170;
function dm() {
  const t = is,
    e = fa,
    n = Nr(t),
    o = 2,
    a = Math.cosh(o) - 1,
    s = (h) => t * (1 - (Math.cosh((o * h) / e) - 1) / a),
    l = (h) => (((-t * o) / e) * Math.sinh((o * h) / e)) / a,
    r = 6,
    u = 128,
    i = [];
  for (let h = 0; h <= u; h++) {
    const y = (h / u) * 2 - 1;
    i.push(e * Math.sign(y) * Math.pow(Math.abs(y), 0.75));
  }
  const c = i.map((h) => {
      const y = s(h),
        x = l(h),
        b = Math.hypot(1, x),
        V = [-x / b, 1 / b],
        T = Q(y / t, 0, 1),
        A = ne(28, 12, T),
        g = ne(31, 14, T),
        M = Math.min(A, g) * 0.26,
        L = [];
      for (let C = 0; C < 4; C++) {
        const E = C === 0 || C === 3 ? 1 : -1,
          R = C < 2 ? 1 : -1;
        for (let G = 0; G <= r; G++) {
          const H = (C * Math.PI) / 2 + ((G / r) * Math.PI) / 2,
            I = Math.cos(H),
            P = Math.sin(H),
            q = E * (A - M) + I * M,
            S = R * (g - M) + P * M;
          L.push({
            p: [h + V[0] * q, y + V[1] * q, S],
            n: [V[0] * I, V[1] * I, P],
          });
        }
      }
      return { y, pts: L };
    }),
    m = c[0].pts.length;
  let d = 0;
  for (let h = 0; h < m; h++) {
    const y = (h + 1) % m,
      x = Math.floor(h / (r + 1)) === Math.floor(y / (r + 1)) && y !== 0,
      b = Math.floor(h / (r + 1)),
      V = x ? 7 : b === 1 || b === 3 ? 1 : 0,
      T = [],
      A = Math.hypot(
        ...[0, 1, 2].map((g) => c[u / 2].pts[h].p[g] - c[u / 2].pts[y].p[g]),
      );
    for (const g of c)
      T.push(
        n.vert(g.pts[h].p, g.pts[h].n, d / (So * ko), g.y / t, V),
        n.vert(g.pts[y].p, g.pts[y].n, (d + A) / (So * ko), g.y / t, V),
      );
    for (let g = 0; g + 1 < c.length; g++) {
      const M = c[g].pts[h].n,
        L = c[g].pts[y].n;
      n.quad(
        T[g * 2],
        T[g * 2 + 1],
        T[g * 2 + 3],
        T[g * 2 + 2],
        n.nrm([M[0] + L[0], M[1] + L[1], M[2] + L[2]]),
      );
    }
    d += A;
  }
  for (const h of [-1, 1]) n.box(h * e - 38, h * e + 38, -4, 8, -40, 40, 2, 2);
  return n.done(e + 38);
}
const Rr = 640,
  en = 112;
function mm() {
  const t = Rr,
    e = Nr(t),
    n = 482;
  e.lathe(
    [
      [0, 452],
      [40, 455.5],
      [86, 465],
      [en - 2, 472],
      [en, 473],
      [en, 477],
      [en - 12, 481],
      [0, n],
    ],
    144,
    (o) =>
      [
        { k: 2, v: 0.5 },
        { k: 2, v: 0.5 },
        { k: 1, v: null },
        { k: 1, v: null },
        { k: 5, v: 0.5 },
        { k: 1, v: null },
        { k: 2, v: 0.5 },
      ][o],
  );
  for (const [o, a, s] of [
    [30, 454.2, 2],
    [56, 458.5, 2.4],
    [82, 464.8, 2.6],
  ])
    e.torus(o, s, a - 1.6, 5, 144, 8);
  {
    const o = [];
    for (let a = 0; a <= 10; a++) {
      const s = ((a / 10) * Math.PI) / 2;
      o.push([16 * Math.sin(s), 452 - 12 * Math.cos(s)]);
    }
    e.lathe(o, 48, () => ({ k: 5, v: 0.5 }), !0);
  }
  for (let o = 0; o < 24; o++) {
    const a = (o / 24) * ye,
      s = Math.cos(a),
      l = Math.sin(a),
      r = [];
    for (let u = 0; u <= 6; u++) {
      const i = u / 6;
      r.push([(en - 14 + i * 6) * s, n - 1 + i * 12, (en - 14 + i * 6) * l]);
    }
    e.tube(r, 2, 7, o / 24);
  }
  {
    const a = [
      [49, n],
      [49, n + 3],
      [46, n + 3],
    ];
    for (let s = 1; s <= 24; s++) {
      const l = ((s / 24) * Math.PI) / 2;
      a.push([46 * Math.cos(l), n + 3 + 46 * Math.sin(l)]);
    }
    e.lathe(
      a,
      96,
      (s) =>
        s < 2
          ? { k: 2, v: s === 0 ? "span" : 0.5 }
          : { k: 3, v: Q((s - 2) / 16, 0, 1) },
      !0,
    );
    for (let s = 0; s < 12; s++) {
      const l = (s / 12) * ye,
        r = [];
      for (let u = 0; u <= 16; u++) {
        const i = ((u / 16) * Math.PI) / 2;
        r.push([
          (46 + 0.8) * Math.cos(i) * Math.cos(l),
          n + 3 + (46 + 0.8) * Math.sin(i),
          (46 + 0.8) * Math.cos(i) * Math.sin(l),
        ]);
      }
      e.tube(r, 1.4, 1, s / 12);
    }
    e.lathe(
      [
        [7, n + 3 + 46 - 0.5],
        [7, n + 3 + 46 + 5],
        [0, n + 3 + 46 + 5],
      ],
      24,
      () => ({ k: 1, v: null }),
    );
  }
  for (let o = 0; o < 3; o++) {
    const a = ((o + 0.5) / 3) * ye,
      s = 74 * Math.cos(a),
      l = 74 * Math.sin(a),
      r = [72, 98, 124][o],
      u = [];
    for (let m = 0; m <= 8; m++) {
      const d = n + (m / 8) * r;
      u.push([9.5 - (m / 8) * 3.5, d]);
    }
    const i = (m) => [m[0] + s, m[1], m[2] + l];
    for (let m = 0; m + 1 < u.length; m++) {
      const [d, h] = u[m],
        [y, x] = u[m + 1],
        b = [];
      for (let V = 0; V <= 32; V++) {
        const T = (V / 32) * ye,
          A = Math.cos(T),
          g = Math.sin(T),
          M = e.nrm([x - h, -(y - d), 0]);
        b.push(
          e.vert(
            i([d * A, h, d * g]),
            [M[0] * A, M[1], M[0] * g],
            (T * d) / (So * ko),
            h / t,
            0,
          ),
          e.vert(
            i([y * A, x, y * g]),
            [M[0] * A, M[1], M[0] * g],
            (T * y) / (So * ko),
            x / t,
            0,
          ),
        );
      }
      for (let V = 0; V < 32; V++) {
        const T = ((V + 0.5) / 32) * ye,
          A = e.nrm([x - h, -(y - d), 0]);
        e.quad(b[V * 2], b[V * 2 + 2], b[V * 2 + 3], b[V * 2 + 1], [
          A[0] * Math.cos(T),
          A[1],
          A[0] * Math.sin(T),
        ]);
      }
    }
    const c = n + r;
    (e.box(s - 6.5, s + 6.5, c, c + 4, l - 6.5, l + 6.5, 1, 2),
      e.box(s - 0.6, s + 0.6, c + 4, c + 16, l - 0.6, l + 0.6, 1),
      e.box(s - 1, s + 1, c + 16, c + 18, l - 1, l + 1, 6));
  }
  for (let o = 0; o < 3; o++) {
    const a = (o / 3) * ye;
    e.torus(7, 0.4, n + 0.3, 5, 32, 4, 96 * Math.cos(a), 96 * Math.sin(a));
  }
  return e.done(en);
}
ls.push(cm(), dm(), mm());
const ha = 8,
  fm = ["The Spire", "The Gate", "The Skyport"];
function v0(t, e) {
  if (se(t, e, 7301) > 0.82) return null;
  const n = {
    kind: Math.floor(se(t, e, 7302) * 3),
    bi: t * ha + 1 + Math.floor(se(t, e, 7303) * (ha - 4)),
    bj: e * ha + 1 + Math.floor(se(t, e, 7304) * (ha - 4)),
    ax: se(t, e, 7305) < 0.5 ? 0 : 1,
  };
  return (
    n.kind === 2 &&
      Zs((n.bi + 0.5) * It, (n.bj + 0.5) * It) > 0.42 &&
      (n.kind = 1),
    n
  );
}
function hm(t, e) {
  const n = v0(Math.floor(t / ha), Math.floor(e / ha));
  if (!n) return null;
  if (n.kind === 1) {
    const o = [n.bi, n.bj],
      a = n.ax === 0 ? [n.bi + 2, n.bj] : [n.bi, n.bj + 2],
      s = n.ax === 0 ? [n.bi + 1, n.bj] : [n.bi, n.bj + 1],
      l = (r) => t === r[0] && e === r[1];
    return l(o)
      ? { ...n, role: "gate", a: o, b: a }
      : l(a) || l(s)
        ? { ...n, role: l(a) ? "foot" : "under", a: o, b: a }
        : null;
  }
  return n.kind === 2
    ? Math.abs(t - n.bi) <= 1 && Math.abs(e - n.bj) <= 1
      ? { ...n, role: t === n.bi && e === n.bj ? "port" : "near" }
      : null
    : Math.abs(t - n.bi) <= 1 && Math.abs(e - n.bj) <= 1
      ? { ...n, role: t === n.bi && e === n.bj ? "spire" : "snear" }
      : null;
}
const gm = (t) =>
    t
      ? t.role === "under"
        ? 420
        : t.role === "port" || t.role === "near"
          ? 380
          : t.role === "snear"
            ? 640
            : 1e9
      : 1e9,
  A0 = (t, e) => [
    (t * It + Ue(0, t) / 2 + (t + 1) * It - Ue(0, t + 1) / 2) / 2,
    (e * It + Ue(1, e) / 2 + (e + 1) * It - Ue(1, e + 1) / 2) / 2,
  ];
function Dr(t, e, n, o) {
  const a = t.kind,
    s = ls[el + a],
    l = se(n, o, 7310),
    r = (ca(n, o, 7311) % 9e3) + 1e3,
    u = {
      style: M0,
      fh: 4.2,
      bay: ko,
      E: [1, 1, 1, 1],
      street: !0,
      seed: l,
      lit: 0.5 + 0.4 * se(n, o, 7312),
      pods: [],
      id: r,
      blk: [n, o],
      mega: { kind: a, name: fm[a] },
    };
  if (a === 0) {
    const m = Q((Math.min(e.x1 - e.x0, e.z1 - e.z0) / 2 - 3) / rs, 0.55, 1.2),
      d = (e.x0 + e.x1) / 2,
      h = (e.z0 + e.z1) / 2,
      y = (x) => x * m;
    return {
      ...u,
      x0: d - 4,
      x1: d + 4,
      z0: h - 4,
      z1: h + 4,
      cx: d,
      cz: h,
      H: nl,
      para: { tp: el, h: m, rot: l * ye, T: s.T, cant: 0, lounge: 0 },
      segs: [
        {
          x0: d - y(72),
          x1: d + y(72),
          z0: h - y(72),
          z1: h + y(72),
          y0: 0,
          y1: 41,
          v: 0,
        },
        ...[0, 1, 2, 3, 4, 5, 6, 7].map((x) => {
          const b = ne(41, ee.y1, x / 8),
            V = ne(41, ee.y1, (x + 1) / 8),
            T = y(Math.max(ol(b), ol(V)) + 6);
          return {
            x0: d - T,
            x1: d + T,
            z0: h - T,
            z1: h + T,
            y0: b,
            y1: V + 6,
            v: 0,
          };
        }),
        {
          x0: d - y(56),
          x1: d + y(56),
          z0: h - y(56),
          z1: h + y(56),
          y0: ee.y1,
          y1: nl,
          v: 0,
        },
      ],
    };
  }
  if (a === 1) {
    const m = A0(...t.a),
      d = A0(...t.b),
      h = (m[0] + d[0]) / 2,
      y = (m[1] + d[1]) / 2,
      x = Math.hypot(d[0] - m[0], d[1] - m[1]) / 2,
      b = x / fa,
      V = t.ax === 0 ? 0 : Math.PI / 2,
      T = [],
      A = Math.cosh(2) - 1,
      g = (M) => is * (1 - (Math.cosh((2 * M) / fa) - 1) / A);
    for (let M = 0; M < 16; M++) {
      const L = -fa + (M / 16) * 2 * fa,
        C = L + fa / 8,
        E = g(L),
        R = g(C),
        G = Math.min(E, R) / is,
        H = ne(28, 12, G) + 4,
        I = ne(31, 14, G) + 2,
        P = Math.min(L, C) * b - H,
        q = Math.max(L, C) * b + H;
      T.push(
        t.ax === 0
          ? {
              x0: h + P,
              x1: h + q,
              z0: y - I * b,
              z1: y + I * b,
              y0: Math.max(0, Math.min(E, R) - H),
              y1: Math.max(E, R) + H,
              v: 0,
            }
          : {
              x0: h - I * b,
              x1: h + I * b,
              z0: y + P,
              z1: y + q,
              y0: Math.max(0, Math.min(E, R) - H),
              y1: Math.max(E, R) + H,
              v: 0,
            },
      );
    }
    return {
      ...u,
      x0: h - 4,
      x1: h + 4,
      z0: y - 4,
      z1: y + 4,
      cx: h,
      cz: y,
      H: is,
      para: { tp: el + 1, h: b, rot: V, T: s.T, cant: 0, lounge: 0 },
      segs: T,
      mega: { ...u.mega, span: x * 2 },
    };
  }
  const i = (e.x0 + e.x1) / 2,
    c = (e.z0 + e.z1) / 2;
  return {
    ...u,
    x0: i - 4,
    x1: i + 4,
    z0: c - 4,
    z1: c + 4,
    cx: i,
    cz: c,
    H: Rr,
    para: { tp: el + 2, h: 1, rot: l * ye, T: s.T, cant: 0, lounge: 0 },
    segs: [
      {
        x0: i - en,
        x1: i + en,
        z0: c - en,
        z1: c + en,
        y0: 438,
        y1: 536,
        v: 0,
      },
      {
        x0: i - 86,
        x1: i + 86,
        z0: c - 86,
        z1: c + 86,
        y0: 536,
        y1: Rr - 16,
        v: 0,
      },
    ],
  };
}
const je = document.createElement("canvas");
let zt;
try {
  ((zt = new f.WebGPURenderer({
    canvas: je,
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
    depth: !0,
    alpha: !1,
  })),
    await zt.init());
} catch (t) {
  throw (
    (tt("#loading").textContent =
      "This city needs WebGPU or WebGL 2. Try a browser with graphics acceleration on."),
    t
  );
}
const _r = !!zt.backend.isWebGPUBackend;
(fn.appendChild(je), (zt.autoClear = !1));
const V0 = tn
    ? matchMedia("(pointer:coarse)").matches
    : (innerWidth || 1440) < 900,
  pm = V0 ? 13e5 : 24e5,
  ym = () => {
    const t = innerWidth || 1440,
      e = innerHeight || 900;
    return Q(Math.min(devicePixelRatio, 2, Math.sqrt(pm / (t * e))), 1, 2);
  },
  z0 = ym(),
  ze = new f.Scene(),
  Gr = new f.Scene(),
  et = new f.PerspectiveCamera(62, 1, 0.4, 5600);
et.rotation.order = "YXZ";
const al = 1650,
  Hr = 470,
  sl = 2048,
  D = {
    auto: 1,
    pixelRatio: z0,
    ssgi: 2,
    giK: 1,
    aoK: 1,
    bloom: 1,
    bloomK: 0.3,
    bloomRadius: 1.2,
    shafts: 1,
    lights: 1,
    exposure: 1,
    sat: 1.1,
    fog: 1,
    detail: 1,
    traffic: 0.7,
    fov: 62,
    grain: 1,
    gi: 1,
    refl: 1,
    nshadow: 1,
    mblur: 1,
    ae: 1,
    mirror: 1,
    flare: 1,
    flareK: 0.35,
  };
V0 && Object.assign(D, { refl: 0, nshadow: 0, mblur: 0, ssgi: 1 });
const ll = { ...D },
  ga = 2048,
  Co = 120,
  pa = 1100,
  Or = 1024,
  Wr = new f.RenderTarget(256, 128, {
    type: f.HalfFloatType,
    depthBuffer: !1,
    minFilter: f.LinearFilter,
    magFilter: f.LinearFilter,
    wrapS: f.RepeatWrapping,
    generateMipmaps: !1,
  }),
  S0 = new f.RenderTarget(1024, 1024, {
    depthBuffer: !1,
    generateMipmaps: !0,
    minFilter: f.LinearMipmapLinearFilter,
    magFilter: f.LinearFilter,
    wrapS: f.RepeatWrapping,
    wrapT: f.RepeatWrapping,
  }),
  us = new f.RenderTarget(sl, sl, {
    depthTexture: new f.DepthTexture(sl, sl),
    type: f.UnsignedByteType,
    generateMipmaps: !1,
  }),
  k0 = new f.RenderTarget(ga, ga, {
    depthTexture: new f.DepthTexture(ga, ga),
    type: f.UnsignedByteType,
    generateMipmaps: !1,
  }),
  C0 = new f.RenderTarget(Or, Or, {
    type: f.HalfFloatType,
    minFilter: f.LinearFilter,
    magFilter: f.LinearFilter,
    depthBuffer: !0,
    generateMipmaps: !1,
  }),
  Eo = 20,
  p = {
    uSunDir: W(new f.Vector3(0.4, 0.6, 0.3).normalize()),
    uSkyLUT: Ve(Wr.texture),
    uCloudTex: Ve(S0.texture),
    uSkyK: W(12),
    uSkyLutOn: W(0),
    uCloudH: W(1900),
    uCov: W(0.56),
    uWind: W(new f.Vector2()),
    uGlowSky: W(new f.Color(0, 0, 0)),
    uFogD0: W(0.011),
    uFogH: W(78),
    uFogBase: W(4e-4),
    uHazeH: W(650),
    uShadowN: Ve(k0.depthTexture),
    uShadowNM: W(new f.Matrix4()),
    uShadowNOn: W(0),
    uShadowNTexel: W(1 / 2048),
    uShadowNBias: W(1e-5),
    uHeight: Ve(C0.texture),
    uHU: W(new f.Vector3()),
    uHV: W(new f.Vector3()),
    uHO: W(new f.Vector3(0, 0, 1100)),
    uHOn: W(0),
    uReflOn: W(1),
    uGIOn: W(1),
    uCityGlow: W(new f.Color(0, 0, 0)),
    uSunCol: W(new f.Color()),
    uSkyZen: W(new f.Color()),
    uSkyHor: W(new f.Color()),
    uSkyLow: W(new f.Color()),
    uGroundCol: W(new f.Color()),
    uFogCol: W(new f.Color()),
    uFogLow: W(new f.Color()),
    uTime: W(0),
    uNightK: W(0),
    uCloudK: W(0.5),
    uCityH: W(360),
    uAmb: W(1),
    uShadow: Ve(us.depthTexture),
    uShadowM: W(new f.Matrix4()),
    uShadowOn: W(0),
    uShadowTexel: W(1 / 2048),
    uLitK: W(0.3),
    uBlue: W(0),
    uGrowT: W(99),
    uGrowTP: W(99),
    uGrowO: W(new f.Vector2()),
    uGrowOn: W(0),
    uPick: W(-1),
    uWinK: W(1),
    uBounceK: W(1),
    uNeonK: W(1),
    uFrame: W(0),
    uCarK: W(1),
    uBeamK: W(1),
    uLaneK: W(0),
    uHazeSky: W(0.7),
    uHotC: W(new f.Vector3(0, -1e4, 0)),
    uHot: W(-1),
    uTurbo: W(0),
    uCel: W(0),
    uCelW: W(0.03),
    uFlat: W(0),
    uFlatWin: W(0),
    uCloudE: W(new f.Vector3(0, 1, 0)),
    uCloudBand: W(0),
    uCloudRim: W(0),
    uSkyVib: W(0),
    uFogVib: W(0),
    uFogTint: W(new f.Vector3(1, 1, 1)),
  },
  ya = {
    uLP: {
      value: Array.from({ length: Eo }, () => new f.Vector4(0, -9999, 0, 1)),
    },
    uLC: { value: Array.from({ length: Eo }, () => new f.Vector4()) },
    uLD: {
      value: Array.from({ length: Eo }, () => new f.Vector4(0, -1, 0, 0)),
    },
  },
  so = {
    uLP: Us(ya.uLP.value, "vec4"),
    uLC: Us(ya.uLC.value, "vec4"),
    uLD: Us(ya.uLD.value, "vec4"),
  },
  Me = {
    uInvProj: W(et.projectionMatrixInverse),
    uProj: W(et.projectionMatrix),
    uCamWorld: W(et.matrixWorld),
    uView: W(et.matrixWorldInverse),
    uCamPos: W(new f.Vector3()),
    uNF: W(new f.Vector2(0.4, 4200)),
  },
  Xe = (t, e, n, o) =>
    At(o).setLayout({
      name: t,
      type: e,
      inputs: n.map((a) => {
        const [s, l] = a.split(":");
        return { name: s, type: l };
      }),
    }),
  vn = (t, e, n) =>
    e.reduceRight((o, [a, s]) => Y(t.lessThan(a), w(...s), o), w(...n)),
  ie = Xe("hash12", "float", ["p:vec2"], ([t]) => {
    const e = rt(w(t.x, t.y, t.x).mul(0.1031)).toVar();
    return (e.addAssign(gt(e, e.yzx.add(33.33))), rt(e.x.add(e.y).mul(e.z)));
  }),
  jt = Xe("vnoise", "float", ["p:vec2"], ([t]) => {
    const e = Jt(t).toVar(),
      n = rt(t).toVar();
    return (
      n.assign(n.mul(n).mul(n.mul(-2).add(3))),
      B(
        B(ie(e), ie(e.add(X(1, 0))), n.x),
        B(ie(e.add(X(0, 1))), ie(e.add(1)), n.x),
        n.y,
      )
    );
  }),
  qr = Xe("fbm3", "float", ["p:vec2"], ([t]) =>
    jt(t)
      .mul(0.55)
      .add(jt(t.mul(2.07).add(13.1)).mul(0.3))
      .add(jt(t.mul(4.13).add(37.7)).mul(0.15)),
  ),
  nn = (t) => gt(t, w(0.2126, 0.7152, 0.0722)),
  E0 = (t) => rt(rt(gt(t, X(0.06711056, 0.00583715))).mul(52.9829189)),
  rl = (t) => rt(E0(t).add(p.uFrame.mul(0.618034))),
  xm = At(([t]) => {
    const e = Xd(Q(t.y, -1, 1)).toVar();
    return p.uSkyLUT
      .sample(
        X(
          as(t.x.add(1e-7), t.z).div(6.2831853).add(0.5),
          oo(e)
            .mul($s(at(e).div(1.5707963)))
            .mul(0.5)
            .add(0.5),
        ),
      )
      .rgb.mul(p.uSkyK);
  }),
  Lo = At(([t]) => {
    const e = t.y.toVar(),
      n = Z(gt(t, p.uSunDir), 0).toVar(),
      o = w(0).toVar();
    return (
      F(p.uSkyLutOn.greaterThan(0.5), () => {
        (o.assign(B(p.uSkyLow, xm(w(t.x, Z(e, 0), t.z)), _(-0.3, 0, e))),
          o.addAssign(
            p.uSunCol.mul(Ft(n, 48).mul(0.25)).mul(p.uNightK.mul(-0.8).add(1)),
          ));
      }).Else(() => {
        (o.assign(
          B(
            p.uSkyLow,
            B(p.uSkyHor, p.uSkyZen, _(-0.02, 0.75, e)),
            _(-0.35, 0.01, e),
          ),
        ),
          o.addAssign(
            p.uSunCol
              .mul(Ft(n, 4).mul(0.07).add(Ft(n, 48).mul(0.32)))
              .mul(p.uNightK.mul(-0.7).add(1)),
          ));
      }),
      o.add(p.uGlowSky.mul(Kt(Z(e, 0).mul(-4.5))).mul(_(-0.4, 0, e)))
    );
  }),
  Kr = (t) =>
    _(p.uCov, p.uCov.add(0.2), p.uCloudTex.sample(t.add(p.uWind).div(12e3)).r),
  Ur = At(([t, e]) =>
    B(
      p.uFogLow.mul(0.7).add(p.uGroundCol.mul(0.3)),
      Lo(t),
      _(-0.05, 0.45, t.y).mul(B(0.35, 1, Q(e.div(p.uCityH), 0, 1))),
    ),
  ),
  cs = (t) => B(0.035, 1, Ft(Q(t.add(30).div(p.uCityH.add(30)), 0, 1), 1.15)),
  gn = (t) =>
    B(p.uGroundCol, B(p.uSkyHor, p.uSkyZen, Z(t.y, 0)), _(-0.6, 0.6, t.y)),
  il = Xe(
    "layerTau",
    "float",
    ["a0:float", "H:float", "o:vec3", "dir:vec3", "dist:float"],
    ([t, e, n, o, a]) => {
      const s = k(1).div(e),
        l = t.mul(Kt(n.y.mul(s).negate())),
        r = o.y.mul(a).mul(s);
      return Y(
        at(r).greaterThan(1e-4),
        l.mul(Kt(r.negate()).oneMinus()).div(o.y.mul(s)),
        l.mul(a),
      );
    },
  ),
  ds = (t, e, n) =>
    il(p.uFogD0, p.uFogH, t, e, n).add(il(p.uFogBase, p.uHazeH, t, e, n)),
  L0 = (t) =>
    At(([e, n, o]) => {
      const a = e.div(o).sub(0.5).toVar(),
        s = rt(a).toVar(),
        l = Jt(a).add(0.5).mul(o).toVar(),
        r = pt(n, t.sample(l).x),
        u = pt(n, t.sample(l.add(X(o, 0))).x),
        i = pt(n, t.sample(l.add(X(0, o))).x),
        c = pt(n, t.sample(l.add(o)).x);
      return B(B(r, u, s.x), B(i, c, s.x), s.y);
    }),
  bm = L0(p.uShadow),
  wm = L0(p.uShadowN),
  Yr = At(([t, e]) => {
    const n = k(1).toVar();
    return (
      F(p.uShadowOn.greaterThan(0.5), () => {
        const o = p.uShadowM.mul(nt(t.add(e.mul(1.2)), 1)),
          a = o.xyz.div(o.w).toVar();
        F(
          a.x
            .greaterThanEqual(0)
            .and(a.x.lessThanEqual(1))
            .and(a.y.greaterThanEqual(0))
            .and(a.y.lessThanEqual(1))
            .and(a.z.lessThanEqual(1)),
          () => {
            n.assign(
              bm(X(a.x, a.y.oneMinus()), a.z.sub(12e-5), p.uShadowTexel),
            );
          },
        );
      }),
      n
    );
  }),
  Mm = At(([t, e]) => {
    const n = k(0).toVar(),
      o = k(1).toVar(),
      a = Yr(t, e).toVar();
    return (
      F(p.uShadowNOn.greaterThan(0.5), () => {
        const s = p.uShadowNM.mul(nt(t.add(e.mul(0.1)), 1)),
          l = s.xyz.div(s.w).toVar(),
          r = qt(qt(l.x, l.x.oneMinus()), qt(l.y, l.y.oneMinus())).toVar();
        F(r.greaterThan(0).and(l.z.lessThan(1)), () => {
          (n.assign(_(0, 0.05, r)),
            o.assign(
              wm(
                X(l.x, l.y.oneMinus()),
                l.z.sub(p.uShadowNBias),
                p.uShadowNTexel,
              ),
            ));
        });
      }),
      B(a, qt(a, o), n)
    );
  }),
  ul = At(([t, e]) => {
    const n = k(1).toVar();
    return (
      F(p.uShadowOn.greaterThan(0.5), () => {
        (n.assign(Mm(t, e)),
          F(
            p.uSunDir.y.greaterThanEqual(0.04).and(p.uCov.lessThanEqual(0.95)),
            () => {
              n.mulAssign(
                Kr(
                  t.xz.add(
                    p.uSunDir.xz.div(p.uSunDir.y).mul(p.uCloudH.sub(t.y)),
                  ),
                )
                  .mul(-0.7)
                  .add(1),
              );
            },
          ));
      }),
      n
    );
  }),
  $r = At(([t, e]) => {
    const n = w(0).toVar();
    return (
      Pe(Eo, ({ i: o }) => {
        const a = so.uLP.element(o),
          s = so.uLC.element(o),
          l = a.xyz.sub(t).toVar(),
          r = gt(l, l).toVar(),
          u = Z(0, r.mul(a.w).oneMinus()).toVar();
        F(u.greaterThan(0), () => {
          const i = l.mul(m0(r.add(1e-4))).toVar(),
            c = Y(
              s.w.lessThan(-1),
              k(1),
              _(s.w, s.w.add(0.25), gt(i.negate(), so.uLD.element(o).xyz)),
            );
          n.addAssign(
            s.rgb.mul(
              u
                .mul(u)
                .mul(c)
                .mul(Z(gt(e, i), 0).mul(0.85).add(0.15))
                .div(r.mul(0.012).add(1)),
            ),
          );
        });
      }),
      n
    );
  }),
  ms = At(([t]) => {
    const e = t.sub(p.uHO.xy).div(p.uHO.z.mul(2)),
      n = k(-1).toVar();
    return (
      F(Z(at(e.x), at(e.y)).lessThanEqual(0.497), () => {
        n.assign(
          p.uHeight.sample(
            X(gt(p.uHU.xy, t).add(p.uHU.z), gt(p.uHV.xy, t).add(p.uHV.z)),
          ).r,
        );
      }),
      n
    );
  });
function Tm(t, e, n, o) {
  const a = k(0).toVar(),
    s = k(0).toVar(),
    l = k(0).toVar(),
    r = k(0).toVar();
  return (
    Pe(5, ({ i: u }) => {
      F(u.greaterThanEqual(n), () => {
        ia();
      });
      const i = Ft(2.15, k(u)).mul(4).toVar(),
        c = ms(t.xz.add(e.mul(i))).toVar();
      (F(c.lessThan(0), () => {
        (r.assign(1), ia());
      }),
        c.subAssign(t.y),
        a.assign(Z(a, c.div(i))),
        F(l.equal(0).and(c.greaterThan(0)), () => {
          (l.assign(i),
            F(o, () => {
              const m = s.toVar(),
                d = i.toVar();
              (Pe(3, () => {
                const h = m.add(d).mul(0.5).toVar();
                F(ms(t.xz.add(e.mul(h))).greaterThan(t.y), () => {
                  d.assign(h);
                }).Else(() => {
                  m.assign(h);
                });
              }),
                l.assign(d));
            }));
        }),
        s.assign(i));
    }),
    X(Y(r.greaterThan(0.5), k(-1), as(a)), l)
  );
}
const jr = At(([t, e]) => {
    const n = w(cs(t.y), 0.25, 0).toVar();
    return (
      F(p.uHOn.greaterThan(0.5).and(p.uGIOn.greaterThan(0.5)), () => {
        F(e.y.lessThan(-0.5), () => {
          n.assign(w(cs(t.y).mul(0.4), 0.3, 0));
        }).Else(() => {
          const o = e.y.greaterThan(0.5).toVar(),
            a = vt(e.xz.add(X(1e-6, 0))).toVar(),
            s = X(
              a.x.mul(0.643).sub(a.y.mul(0.766)),
              a.x.mul(0.766).add(a.y.mul(0.643)),
            ).toVar(),
            l = X(
              a.x.mul(0.643).add(a.y.mul(0.766)),
              a.x.mul(-0.766).add(a.y.mul(0.643)),
            ).toVar(),
            r = k(0).toVar(),
            u = k(0).toVar(),
            i = k(0).toVar(),
            c = k(0).toVar(),
            m = k(0).toVar(),
            d = k(0).toVar();
          (Pe(4, ({ i: h }) => {
            F(
              h.greaterThanEqual(Y(o, Jn(4), Jn(3))).or(d.greaterThan(0.5)),
              () => {
                ia();
              },
            );
            const y = o.not().and(h.equal(0)).toVar(),
              x = Y(
                o,
                Y(
                  h.equal(0),
                  X(1, 0),
                  Y(h.equal(1), X(-1, 0), Y(h.equal(2), X(0, 1), X(0, -1))),
                ),
                Y(h.equal(0), a, Y(h.equal(1), s, l)),
              ).toVar(),
              b = Tm(t, x, Y(y, Jn(5), Jn(4)), y).toVar();
            F(o, () => {
              F(b.x.lessThan(0), () => {
                d.assign(1);
              }).Else(() => {
                const V = ae(b.x);
                r.addAssign(V.mul(V));
              });
            })
              .ElseIf(y, () => {
                F(b.x.lessThan(0), () => {
                  d.assign(1);
                }).Else(() => {
                  (u.assign(b.x), m.assign(b.y));
                });
              })
              .ElseIf(h.equal(1), () => {
                i.assign(Z(b.x, 0));
              })
              .Else(() => {
                c.assign(Z(b.x, 0));
              });
          }),
            F(o, () => {
              n.assign(
                Y(
                  d.greaterThan(0.5),
                  w(cs(t.y), 0, 0),
                  w(r.mul(-0.25).add(1), 0, 0),
                ),
              );
            }).ElseIf(d.lessThan(0.5), () => {
              const h = w(u, i, c),
                y = h
                  .mul(2)
                  .add(ae(h.mul(2)))
                  .div(3.14159)
                  .oneMinus(),
                x = gt(y, w(0.5, 0.25, 0.25)).toVar();
              n.assign(w(x, x.oneMinus().mul(0.5).add(0.1), m));
            }));
        });
      }),
      n
    );
  }),
  Xr = At(([t, e, n]) => {
    const o = w(0).toVar();
    return (
      F(n.z.greaterThan(0), () => {
        const a = vt(e.xz.add(1e-5)),
          s = w(a.x, 0, a.y).toVar(),
          l = Z(gt(s, p.uSunDir).negate(), 0)
            .mul(_(-0.05, 0.15, p.uSunDir.y))
            .toVar();
        (F(l.greaterThan(0), () => {
          o.assign(
            p.uSunCol.mul(
              l
                .mul(Yr(t.add(s.mul(Z(n.z.sub(1.5), 0.5))), s.negate()))
                .mul(0.35)
                .mul(n.y),
            ),
          );
        }),
          o.addAssign(p.uCityGlow.mul(n.y)));
      }),
      gn(e).mul(p.uAmb).mul(n.x).add(o.mul(p.uBounceK))
    );
  }),
  cl = (t) =>
    B(
      t,
      _(0.15, p.uCelW.add(0.15), t)
        .mul(0.55)
        .add(_(0.5, p.uCelW.add(0.5), t).mul(0.35)),
      p.uCel,
    ),
  Qr = (t) => B(t, _(0.3, p.uCelW.add(0.3), t).mul(1.3), p.uCel),
  An = (t, e, n) => {
    const o = jr(t, e).toVar();
    return {
      amb: Xr(t, e, o).mul(n).toVar(),
      dir: p.uSunCol
        .mul(cl(Z(gt(e, p.uSunDir), 0).mul(ul(t, e))))
        .add($r(t, e))
        .toVar(),
    };
  },
  on = (t, e) => Q(nn(t).div(Z(nn(e), 1e-4)), 0, 1).mul(p.uBlue.oneMinus()),
  Zr = At(([t, e, n]) => {
    const o = Ur(e, t.y).toVar(),
      a = w(o).toVar();
    return (
      F(p.uReflOn.greaterThan(0.5).and(p.uHOn.greaterThan(0.5)), () => {
        const s = k(4).toVar(),
          l = k(0).toVar(),
          r = k(0).toVar(),
          u = k(0).toVar();
        (Pe(11, () => {
          const i = t.add(e.mul(s)).toVar();
          F(i.y.lessThan(0), () => {
            (r.assign(1), ia());
          });
          const c = ms(i.xz).toVar();
          (F(c.lessThan(0), () => {
            (u.assign(1), ia());
          }),
            F(i.y.lessThan(c), () => {
              (r.assign(1), ia());
            }),
            l.assign(s),
            s.mulAssign(1.45));
        }),
          F(r.greaterThan(0.5).and(u.lessThan(0.5)), () => {
            const i = l.toVar(),
              c = s.toVar();
            Pe(4, () => {
              const y = i.add(c).mul(0.5).toVar(),
                x = t.add(e.mul(y)).toVar();
              F(x.y.lessThan(Z(ms(x.xz), 0)), () => {
                c.assign(y);
              }).Else(() => {
                i.assign(y);
              });
            });
            const m = t.add(e.mul(c)).toVar(),
              d = Kt(ds(t, e, c).negate()).toVar(),
              h = B(p.uFogLow, p.uFogCol, _(0, p.uCityH, m.y)).toVar();
            F(m.y.lessThan(0.5), () => {
              a.assign(B(h, p.uGroundCol.mul(0.5).add(p.uCityGlow.mul(2)), d));
            }).Else(() => {
              const y = t.xz.add(e.xz.mul(i)).toVar(),
                x = k(0).toVar(),
                b = k(0).toVar(),
                V = k(0).toVar();
              Pe(3, ({ i: R }) => {
                const G = ms(
                  Y(R.equal(0), m.xz, Y(R.equal(1), y, X(m.x, y.y))),
                ).toVar();
                F(R.equal(0), () => {
                  x.assign(G);
                })
                  .ElseIf(R.equal(1), () => {
                    b.assign(G);
                  })
                  .Else(() => {
                    V.assign(G);
                  });
              });
              const T = e.y
                  .lessThan(0)
                  .and(m.y.greaterThan(x.sub(1.5)))
                  .and(b.greaterThan(m.y.sub(1.5))),
                A = Y(T, k(1), k(0)).toVar(),
                g = Y(
                  T,
                  w(0, 1, 0),
                  Y(
                    V.greaterThan(m.y),
                    w(oo(e.x).negate(), 0, 0),
                    w(0, 0, oo(e.z).negate()),
                  ),
                ).toVar(),
                M = Jt(m.xz.div(23)).toVar(),
                L = vn(
                  ie(M),
                  [
                    [0.5, [0.42, 0.38, 0.32]],
                    [0.8, [0.3, 0.31, 0.32]],
                  ],
                  [0.12, 0.13, 0.15],
                )
                  .mul(ie(M.add(7)).mul(0.4).add(0.75))
                  .toVar(),
                C = Z(gt(g, p.uSunDir), 0).toVar();
              F(C.greaterThan(0), () => {
                C.mulAssign(Yr(m.add(g.mul(0.6)), g));
              });
              const E = L.mul(
                p.uSunCol.mul(C).add(
                  gn(g)
                    .mul(p.uAmb)
                    .mul(B(0.45, 1, A)),
                ),
              ).toVar();
              (F(A.lessThan(0.5), () => {
                const R = Y(g.x.notEqual(0), m.z, m.x),
                  G = X(R.div(3.6), m.y.div(3.4)),
                  H = rt(G),
                  I = ie(Jt(G).add(M.mul(7.1))),
                  P = B(
                    pt(0.2, H.x)
                      .mul(pt(H.x, 0.8))
                      .mul(pt(0.28, H.y))
                      .mul(pt(H.y, 0.84)),
                    0.336,
                    n,
                  ),
                  q = B(w(0.012), Ur(Tn(e, g), m.y).mul(0.3), 0.6).add(
                    w(1, 0.76, 0.5)
                      .mul(B(pt(I, p.uLitK.mul(0.85)), p.uLitK.mul(0.85), n))
                      .mul(0.55)
                      .mul(p.uWinK),
                  );
                E.assign(B(E, q, P.mul(0.8)));
              }),
                a.assign(B(h, E, d)),
                F(n.greaterThan(0), () => {
                  const R = Q(
                    x.sub(m.y).div(c.mul(n).mul(0.22).add(0.01)),
                    0,
                    1,
                  );
                  a.assign(B(o, a, Z(A, R)));
                }));
            });
          }));
      }),
      a
    );
  }),
  Jr = (t, e) => Zr(t, e, k(0)),
  fs = Xe("wallPal", "vec3", ["r:float", "st:float"], ([t, e]) => {
    const n = w(0.07, 0.085, 0.095).toVar();
    return (
      F(e.lessThan(0.5), () => {
        n.assign(
          vn(
            t,
            [
              [0.14, [0.56, 0.47, 0.36]],
              [0.28, [0.6, 0.55, 0.45]],
              [0.4, [0.48, 0.45, 0.41]],
              [0.52, [0.56, 0.42, 0.35]],
              [0.62, [0.42, 0.47, 0.4]],
              [0.72, [0.4, 0.43, 0.47]],
              [0.86, [0.62, 0.6, 0.55]],
            ],
            [0.4, 0.32, 0.25],
          ),
        );
      })
        .ElseIf(e.lessThan(1.5), () => {
          n.assign(
            Y(t.lessThan(0.5), w(0.46, 0.44, 0.41), w(0.52, 0.48, 0.42)),
          );
        })
        .ElseIf(e.lessThan(2.5), () => {
          n.assign(
            vn(
              t,
              [
                [0.4, [0.2, 0.2, 0.22]],
                [0.7, [0.25, 0.21, 0.19]],
              ],
              [0.17, 0.19, 0.2],
            ),
          );
        }),
      n
    );
  }),
  Po = (t, e, n, o = p.uGrowT) => {
    const a = Q(
      o
        .sub(
          oe(t.sub(p.uGrowO))
            .mul(0.0011)
            .add(rt(e.mul(91.7)).mul(0.4)),
        )
        .div(1.9),
      0,
      1,
    ).oneMinus();
    return Y(p.uGrowOn.greaterThan(0.5), n.add(40).mul(a.mul(a).mul(a)), k(0));
  },
  vm = (t) => c0(vt(i0.mul(nt(t, 0)).xyz));
function Se(t) {
  const e = new f.MeshBasicNodeMaterial(t.opts || {}),
    n = Ys("vec3", "mAlb"),
    o = Ys("vec4", "mOut"),
    a = Ys("vec3", "mNrm"),
    s = Ys("float", "mInk");
  return (
    t.position && (e.positionNode = t.position),
    (e.colorNode = At(
      () => (
        s.assign(t.ink ?? 1),
        t.shade({ alb: n, out: o, nrm: a, ink: s }),
        nt(n, 1)
      ),
    )()),
    (e.outputNode = o),
    (e.mrtNode = Cr({ normal: nt(vm(a), s) })),
    (e.fog = !1),
    e
  );
}
function Io(t, e = f.BackSide) {
  const n = new f.MeshBasicNodeMaterial({ side: e });
  return ((n.positionNode = t), (n.colorNode = nt(1)), (n.fog = !1), n);
}
const P0 = new f.QuadMesh();
function ti(t, e) {
  ((P0.material = t), zt.setRenderTarget(e), P0.render(zt));
}
const ei = (t) => {
    const e = new f.NodeMaterial();
    return ((e.fragmentNode = t), (e.depthTest = !1), (e.depthWrite = !1), e);
  },
  hs = 6360,
  I0 = 6460,
  dl = w(0.005802, 0.013558, 0.0331),
  Am = w(65e-5, 0.001881, 85e-6),
  B0 = 0.003996,
  Vm = 0.00444,
  ml = Xe("rs", "vec2", ["o:vec3", "d:vec3", "r:float"], ([t, e, n]) => {
    const o = gt(t, e).toVar(),
      a = o
        .mul(o)
        .sub(gt(t, t).sub(n.mul(n)))
        .toVar(),
      s = X(-1).toVar();
    return (
      F(a.greaterThanEqual(0), () => {
        const l = $s(a);
        s.assign(X(o.negate().sub(l), o.negate().add(l)));
      }),
      s
    );
  }),
  F0 = Xe("ext", "vec3", ["h:float"], ([t]) =>
    dl
      .mul(Kt(t.div(-8)))
      .add(w(Kt(t.div(-1.2)).mul(Vm)))
      .add(Am.mul(Z(0, at(t.sub(25)).div(15).oneMinus()))),
  ),
  N0 = Xe("sunT", "vec3", ["p:vec3", "sd:vec3"], ([t, e]) => {
    const n = w(0).toVar();
    return (
      F(ml(t, e, k(hs)).x.lessThanEqual(0), () => {
        const o = ml(t, e, k(I0)).y.toVar(),
          a = w(0).toVar();
        (Pe(8, ({ i: s }) => {
          a.addAssign(
            F0(oe(t.add(e.mul(o.mul(k(s).add(0.5).div(8))))).sub(hs)),
          );
        }),
          n.assign(Kt(a.mul(o).div(-8))));
      }),
      n
    );
  }),
  zm = ei(
    At(() => {
      const t = re(),
        e = t.y.mul(2).sub(1),
        n = oo(e).mul(e).mul(e).mul(1.5707963).toVar(),
        o = t.x.sub(0.5).mul(6.2831853).toVar(),
        a = w(Ke(n).mul(ae(o)), ae(n), Ke(n).mul(Ke(o))).toVar(),
        s = w(0, hs + 0.3, 0),
        l = ml(s, a, k(hs)).x.toVar(),
        r = Y(l.greaterThan(0), l, ml(s, a, k(I0)).y).toVar(),
        u = gt(a, p.uSunDir).toVar(),
        i = 0.8,
        c = i * i,
        m = u.mul(u).add(1).mul(0.0596831),
        d = u
          .mul(u)
          .add(1)
          .mul(0.1193662 * (1 - c))
          .div(Ft(Z(u.mul(-2 * i).add(1 + c), 1e-4), 1.5).mul(2 + c)),
        h = w(1).toVar(),
        y = w(0).toVar();
      return (
        Pe(32, ({ i: x }) => {
          const b = r.mul(Ft(k(x).div(32), 1.6)),
            V = r.mul(Ft(k(x).add(1).div(32), 1.6)),
            T = V.sub(b),
            A = s.add(a.mul(b.add(V).mul(0.5))).toVar(),
            g = Z(oe(A).sub(hs), 0).toVar(),
            M = F0(g).toVar(),
            L = N0(A, p.uSunDir).toVar(),
            C = Kt(g.div(-8)),
            E = Kt(g.div(-1.2)),
            R = dl
              .mul(C.mul(m))
              .add(E.mul(d).mul(B0))
              .mul(L)
              .add(
                dl
                  .mul(C.mul(0.7))
                  .add(E.mul(B0 * 0.25))
                  .mul(L)
                  .mul(0.0477),
              ),
            G = Kt(M.mul(T).negate()).toVar();
          (y.addAssign(
            h
              .mul(R)
              .mul(G.oneMinus())
              .div(Z(M, w(1e-7))),
          ),
            h.mulAssign(G));
        }),
        F(l.greaterThan(0), () => {
          const x = s.add(a.mul(l)).toVar(),
            b = vt(x);
          y.addAssign(
            h
              .mul(N0(x.add(b.mul(0.01)), p.uSunDir))
              .mul(Z(gt(b, p.uSunDir), 0))
              .mul(0.1 * 0.3183),
          );
        }),
        nt(y, 1)
      );
    })(),
  );
let ni = !0,
  R0 = -9;
function Sm() {
  !ni ||
    Dt - R0 < 0.05 ||
    ((ni = !1), (R0 = Dt), ti(zm, Wr), (p.uSkyLutOn.value = 1));
}
const fl = (t, e) => ie(js(t, e)),
  km = Xe("vP", "float", ["p:vec2", "P:float"], ([t, e]) => {
    const n = Jt(t).toVar(),
      o = rt(t).toVar();
    return (
      o.assign(o.mul(o).mul(o.mul(-2).add(3))),
      B(
        B(fl(n, e), fl(n.add(X(1, 0)), e), o.x),
        B(fl(n.add(X(0, 1)), e), fl(n.add(1), e), o.x),
        o.y,
      )
    );
  }),
  oi = Xe("fbmP", "float", ["p:vec2", "P0:float"], ([t, e]) => {
    const n = k(0).toVar(),
      o = k(0.5).toVar(),
      a = k(0).toVar(),
      s = e.toVar();
    return (
      Pe(6, () => {
        (n.addAssign(o.mul(km(t.mul(s), s))),
          a.addAssign(o),
          o.mulAssign(0.5),
          s.mulAssign(2));
      }),
      n.div(a)
    );
  }),
  Cm = ei(
    At(() => {
      const t = re().toVar(),
        e = X(oi(t.add(0.31), k(4)), oi(t.add(0.77), k(4))).sub(0.5);
      return nt(w(oi(t.add(e.mul(0.12)), k(6))), 1);
    })(),
  );
function Em() {
  ti(Cm, S0);
}
const Dn = Er(ze, et);
(Dn.setMRT(Cr({ output: u0, diffuseColor: Wd, normal: c0(Od), velocity: qd })),
  (Dn.getTexture("diffuseColor").type = f.UnsignedByteType),
  (Dn.getTexture("normal").type = f.UnsignedByteType));
const Lm = Ve(Dn.getTexture("depth")),
  ai = (t) => Pr(Lm.sample(t).r, Gd, Hd).negate(),
  si = (t) => i0.mul(nt(t, 1)).z.negate();
function li(t, e) {
  const n = new f.MeshBasicNodeMaterial({
    transparent: !0,
    depthTest: !1,
    depthWrite: !1,
    blending: f.AdditiveBlending,
    side: f.DoubleSide,
  });
  return ((n.positionNode = t), (n.fragmentNode = e), (n.fog = !1), n);
}
const xa = 6e4,
  _n = new f.BoxGeometry(1, 1, 1);
_n.deleteAttribute("uv");
const an = new f.InstancedBufferGeometry();
((an.index = _n.index),
  an.setAttribute("position", _n.attributes.position),
  an.setAttribute("normal", _n.attributes.normal));
const gs = new Float32Array(xa * 4),
  ps = new Float32Array(xa * 4),
  ys = new Float32Array(xa * 4),
  hl = new Float32Array(xa * 4);
for (const [t, e] of [
  ["iA", gs],
  ["iB", ps],
  ["iC", ys],
  ["iD", hl],
]) {
  const n = new f.InstancedBufferAttribute(e, 4);
  (n.setUsage(f.DynamicDrawUsage), an.setAttribute(t, n));
}
((an.instanceCount = 0),
  (an.boundingSphere = new f.Sphere(new f.Vector3(), 1e5)));
const xs = Et("iA", "vec4"),
  ri = Et("iB", "vec4"),
  Bo = Et("iC", "vec4"),
  gl = Et("iD", "vec4"),
  D0 = ce.mul(ri.xyz),
  ii = xs.xyz.add(D0),
  ui = At(
    () => (
      eo.assign(ii.sub(w(0, Po(gl.xy, xs.w, Bo.z, p.uGrowTP), 0))),
      ii.sub(w(0, Po(gl.xy, xs.w, Bo.z), 0))
    ),
  ),
  _0 = Xe("roomLight", "vec3", ["r:float"], ([t]) =>
    vn(
      t,
      [
        [0.5, [1, 0.72, 0.42]],
        [0.72, [1, 0.86, 0.66]],
        [0.84, [0.78, 0.88, 1]],
        [0.9, [0.55, 0.75, 1]],
        [0.95, [1, 0.42, 0.78]],
      ],
      [0.4, 1, 0.82],
    ),
  ),
  Pm = ({ alb: t, out: e, nrm: n }) => {
    const o = kt(ii),
      a = kt(D0),
      s = kt(ri.xyz),
      l = kt(nt(xs.w, ri.w, Bo.x, Bo.y)),
      r = kt(w(Po(gl.xy, xs.w, Bo.z), Bo.z, Bo.w)),
      u = kt(gl.z),
      i = vt(to).toVar(),
      c = w(o.x, o.y.sub(r.x), o.z).toVar(),
      m = vt(c.sub(de)).toVar(),
      d = jr(c, i).toVar(),
      h = l.x.toVar(),
      y = l.y.toVar(),
      x = l.z.toVar(),
      b = l.w.toVar(),
      V = r.z.toVar(),
      T = w(0).toVar(),
      A = w(0).toVar(),
      g = k(1).toVar(),
      M = w(i).toVar(),
      L = w(i.z, 0, i.x.negate()),
      C = Y(at(i.x).greaterThan(0.5), s.z, s.x).toVar(),
      E = gt(a, L).add(C.mul(0.5)).toVar(),
      R = o.y.toVar(),
      G = Z(oe(X(f0(E), h0(E))), oe(X(f0(R), h0(R))))
        .mul(0.75)
        .add(1e-4)
        .toVar();
    F(i.y.greaterThan(0.5), () => {
      const J = o.xz;
      (T.assign(
        B(
          w(0.17, 0.16, 0.15),
          w(0.3, 0.28, 0.25),
          qr(J.mul(0.12).add(h.mul(9))),
        ),
      ),
        F(rt(u.mul(5.3)).lessThan(0.3), () => {
          T.mulAssign(w(0.6, 0.6, 0.62));
        }));
      const st = qt(s.x.mul(0.5).sub(at(a.x)), s.z.mul(0.5).sub(at(a.z)));
      (g.assign(B(0.55, 1, _(0, 4, st))),
        T.mulAssign(B(0.8, 1, jt(J.mul(0.9)))));
    })
      .ElseIf(i.y.lessThan(-0.5), () => {
        T.assign(w(0.16, 0.16, 0.17));
        const J = rt(o.xz.div(4)).sub(0.5);
        A.assign(
          w(1, 0.82, 0.6)
            .mul(_(0.09, 0.04, oe(J)))
            .mul(3),
        );
      })
      .Else(() => {
        const J = Z(1, Jt(C.div(b).add(0.5))),
          st = C.div(J).toVar(),
          N = X(E.div(st), R.div(x)),
          O = Jt(N).toVar(),
          $ = rt(N).toVar(),
          ht = h
            .mul(173)
            .add(gt(i, w(1, 2, 3)).mul(31))
            .toVar(),
          ut = O.add(X(ht, ht.mul(0.71))).toVar(),
          ct = ie(ut).toVar(),
          lt = ie(ut.add(17.3)).toVar(),
          dt = ie(ut.add(41.9)).toVar(),
          j = ie(ut.mul(1.7).add(3.1)).toVar(),
          it = pt(O.y, 1).toVar(),
          bt = G.div(qt(st, x)),
          St = Z(_(0.12, 0.3, bt), p.uFlatWin).toVar(),
          Mt = _(0.42, 1, bt).toVar(),
          mt = nt(0.18, 0.3, 0.82, 0.82).toVar(),
          Rt = k(0.28).toVar(),
          $t = pt(0.07, j).toVar(),
          Xn = k(0.93).toVar(),
          Je = u.toVar(),
          yo = Y(
            y.lessThan(0.5).and(rt(Je.mul(11.7)).lessThan(0.4)),
            k(0.38),
            k(0),
          ).toVar(),
          Mn = pt(rt(O.x.mul(0.618034).add(Je.mul(7.13))), yo)
            .mul(it.oneMinus())
            .toVar();
        (F(y.lessThan(0.5), () => {
          const Qt = rt(Je.mul(7.31)).mul(0.18).add(0.2);
          mt.assign(
            nt(
              Qt.oneMinus().sub(0.5),
              rt(Je.mul(3.7)).mul(0.1).add(0.26),
              Qt.add(0.5),
              rt(Je.mul(5.3)).mul(0.08).add(0.78),
            ),
          );
        })
          .ElseIf(y.lessThan(1.5), () => {
            (mt.assign(nt(0.04, 0.2, 0.96, 0.66)),
              Rt.assign(0.95),
              $t.assign(1),
              Xn.assign(1));
          })
          .ElseIf(y.lessThan(2.5), () => {
            (mt.assign(nt(0.3, 0.46, 0.7, 0.76)),
              Rt.assign(0.18),
              $t.assign(pt(0.68, j)),
              Xn.assign(0.32));
          })
          .Else(() => {
            (mt.assign(nt(0.035, 0.14, 0.965, 0.9)),
              Rt.assign(0.06),
              $t.assign(1),
              Xn.assign(1));
          }),
          F(it.greaterThan(0.5), () => {
            (mt.assign(nt(0.05, 0.06, 0.95, 0.86)),
              Rt.assign(0.35),
              $t.assign(pt(0.15, j)),
              Xn.assign(0.85));
          }));
        const Ws = mt.z
          .sub(mt.x)
          .mul(mt.w.sub(mt.y))
          .mul(Xn)
          .mul(yo.oneMinus())
          .toVar();
        (F(Mn.greaterThan(0.5), () => {
          (mt.assign(nt(0.06, k(1.05).div(x), 0.94, 0.965)),
            Rt.assign(0),
            $t.assign(1));
        }),
          mt.mulAssign(nt(st, x, st, x)));
        const Re = $.mul(X(st, x)).toVar(),
          $u = at(Re.sub(mt.xy.add(mt.zw).mul(0.5))).sub(
            mt.zw.sub(mt.xy).mul(0.5),
          ),
          ju = Z($u.x, $u.y).toVar(),
          Qn = $t.mul(_(G.negate(), G, ju).oneMinus()).toVar(),
          Xu = o.sub(a),
          wr = ie(Xu.xz.mul(0.37).add(Xu.y.mul(0.13)).add(h)).toVar();
        (T.assign(
          fs(rt(h.mul(13.7)), y)
            .mul(0.8)
            .mul(B(0.82, 1.14, wr)),
        ),
          F(wr.greaterThan(0.78).and(y.lessThan(0.5)), () => {
            T.assign(B(T, fs(rt(wr.mul(7.7)), y).mul(0.8), 0.7));
          }));
        const Mr = qr(X(E.mul(0.07), R.mul(0.018)).add(h.mul(7))).toVar(),
          Sd = jt(X(E.mul(2.3), R.mul(0.045)).add(h.mul(3))).mul(
            jt(X(E.mul(0.9), R.mul(0.02)).add(h)),
          );
        (T.mulAssign(
          B(
            B(0.55, 1.12, Mr).mul(Sd.mul(-0.5).add(1)),
            B(0.84, 1.02, Mr),
            p.uFlat,
          ),
        ),
          T.mulAssign(B(0.45, 1, _(0, 110, R))));
        const kd = a.y.add(s.y.mul(0.5)),
          Cd = s.y.mul(0.5).sub(a.y);
        T.mulAssign(B(0.62, 1, _(0, 2.8, kd)).mul(B(0.8, 1, _(0, 1.2, Cd))));
        const xo = St.oneMinus().toVar();
        (F(y.lessThan(1.5), () => {
          const Qt = _(mt.x.sub(0.1), mt.x.add(0.1), Re.x)
            .mul(_(mt.z.add(0.1), mt.z.sub(0.1), Re.x))
            .mul(_(mt.y, mt.y.sub(x.mul(0.64)), Re.y))
            .mul($t);
          T.mulAssign(
            Qt.mul(jt(X(E.mul(3), R.mul(0.5))))
              .mul(xo)
              .mul(-0.3)
              .add(1),
          );
          const De = _(0, 0.012, $.y).mul(_(0.07, 0.085, $.y).oneMinus());
          T.mulAssign(B(1, B(1, Y(y.lessThan(0.5), k(1.18), k(0.82)), De), xo));
          const qe = qt($.x, $.x.oneMinus()).mul(st);
          T.mulAssign(
            _(0.02, G.add(0.02), qe).oneMinus().mul(xo).mul(-0.3).add(1),
          );
        }),
          F(y.greaterThan(1.5).and(y.lessThan(2.5)), () => {
            const Qt = Ke(E.mul(12.5663706)).mul(0.5).add(0.5);
            (M.assign(
              vt(
                i.add(
                  L.mul(ae(E.mul(6.2831853 * 2)))
                    .mul(0.25)
                    .mul(xo),
                ),
              ),
            ),
              T.mulAssign(B(1, B(0.82, 1.08, Qt), xo)),
              T.assign(
                B(
                  T,
                  w(0.33, 0.19, 0.12),
                  _(0.62, 0.8, qr(X(E.mul(0.2), R.mul(0.05)).add(h))),
                ),
              ));
          }),
          F(y.greaterThan(2.5), () => {
            const Qt = _(0.05, 0, at($.x.sub(0.5)).sub(0.47)).add(
              _(0.06, 0, at($.y.sub(0.5)).sub(0.44)),
            );
            T.assign(B(T, w(0.22, 0.24, 0.27), Q(Qt, 0, 1).mul(xo)));
          }),
          g.mulAssign(B(1, B(0.62, 1, _(0, 0.35, ju.add(0.05))), xo)));
        const Tr = _(330, 440, oe(c.sub(de)))
          .mul(Mt.oneMinus())
          .mul(pt(y, 1.5))
          .mul(Mn.oneMinus())
          .mul(it.oneMinus())
          .toVar();
        (F(Tr.greaterThan(0.001), () => {
          const Qt = ie(ut.add(7.7)).toVar(),
            De = X(
              st.mul(0.5).add(Y(Qt.lessThan(0.14), k(-0.32), k(0.32)).mul(st)),
              mt.y.sub(0.42),
            ).toVar(),
            qe = at(Re.sub(De)).sub(X(0.44, 0.28));
          F(Qt.lessThan(0.28).and(Z(qe.x, qe.y).lessThan(0)), () => {
            T.assign(
              B(
                T,
                w(0.6, 0.6, 0.57).mul(
                  Y(Re.y.lessThan(De.y.sub(0.16)), k(0.55), k(1)),
                ),
                Tr,
              ),
            );
          });
          const wo = ie(X(O.x, ht).add(3.3));
          F(wo.lessThan(0.3).and(Re.y.lessThan(0.42)), () => {
            T.assign(B(T, T.mul(Y(Re.y.lessThan(0.18), k(1.25), k(0.35))), Tr));
          });
        }),
          F(Mn.greaterThan(0.5).and(Re.y.lessThan(mt.y)), () => {
            const Qt = rt(Je.mul(13.3)).toVar();
            F(Qt.lessThan(0.55), () => {
              T.assign(
                vn(
                  Qt,
                  [
                    [0.18, [0.2, 0.36, 0.28]],
                    [0.32, [0.24, 0.33, 0.46]],
                    [0.44, [0.68, 0.64, 0.54]],
                  ],
                  [0.58, 0.4, 0.34],
                ).mul(B(0.75, 1, Mr)),
              );
            });
          }));
        const la = gn(i).mul(p.uAmb).mul(d.x).toVar(),
          Qu = qt(
            1,
            p.uLitK.mul(V).mul(Y(it.greaterThan(0.5), k(2.2), k(1))),
          ).toVar(),
          ra = pt(
            ct,
            Qu.add(ae(p.uTime.mul(0.06).add(lt.mul(60))).mul(0.035)),
          ).toVar(),
          Zn = _0(dt).toVar();
        (F(y.greaterThan(2.5), () => {
          Zn.assign(B(Zn, w(0.86, 0.93, 1), 0.7));
        }),
          F(it.greaterThan(0.5), () => {
            Zn.assign(
              vn(
                dt,
                [
                  [0.5, [1, 0.55, 0.85]],
                  [0.8, [0.5, 0.9, 1]],
                ],
                [1, 0.8, 0.45],
              ),
            );
          }));
        const Ed = Y(y.greaterThan(2.5), w(0.9, 0.93, 1), w(1, 0.8, 0.56)),
          Ld = Ft(Q(gt(m, i).negate(), 0, 1).oneMinus(), 5)
            .mul(0.96)
            .add(0.04),
          Zu = Tn(m, i).toVar(),
          bo = w(0).toVar();
        F(
          Mt.lessThan(0.98).and(
            Qn.greaterThan(0.01)
              .or(St.greaterThan(0.01))
              .or(Mn.greaterThan(0.5)),
          ),
          () => {
            bo.assign(Jr(c, Zu));
          },
        ).Else(() => {
          bo.assign(Ur(Zu, c.y));
        });
        const vr = Ld.mul(Y(y.greaterThan(2.5), k(1), k(0.85))).toVar(),
          Ju = B(
            ra.mul(Zn).mul(0.62).add(0.012).add(la.mul(0.03)).mul(p.uWinK),
            bo,
            vr,
          ).toVar(),
          Pd = B(
            Qu.mul(Ed).mul(0.62).add(0.012).add(la.mul(0.03)).mul(p.uWinK),
            bo,
            vr,
          );
        F(Mn.greaterThan(0.5), () => {
          Ju.assign(T.mul(la).mul(0.36));
        });
        const Ja = Ju.mul(Qn).toVar(),
          ts = T.mul(Qn.oneMinus()).toVar(),
          le = w(gt(m, L), m.y, Z(gt(m, i).negate(), 0.02)).toVar();
        (F(Mn.greaterThan(0.5), () => {
          const Qt = Y(
              at(le.x).lessThan(1e-4),
              k(1e4),
              Y(le.x.greaterThan(0), mt.z.sub(Re.x), mt.x.sub(Re.x)).div(le.x),
            ).toVar(),
            De = Y(
              at(le.y).lessThan(1e-4),
              k(1e4),
              Y(le.y.greaterThan(0), x.sub(0.12).sub(Re.y), Re.y.negate()).div(
                le.y,
              ),
            ).toVar(),
            qe = k(1.5).div(le.z).toVar(),
            wo = qt(qt(Qt, De), qe),
            mn = w(Re, 0).add(le.mul(wo)).toVar(),
            Bn = w(0).toVar(),
            es = k(0).toVar();
          F(qe.lessThanEqual(Qt).and(qe.lessThanEqual(De)), () => {
            (Bn.assign(T.mul(0.85)),
              F(
                at(mn.x.sub(st.mul(0.5)))
                  .lessThan(st.mul(0.24))
                  .and(mn.y.lessThan(2.35)),
                () => {
                  (es.assign(1),
                    Bn.assign(
                      B(
                        ra.mul(Zn).mul(0.55).mul(p.uWinK).add(0.012),
                        bo.mul(0.25),
                        0.3,
                      ),
                    ));
                },
              ));
          })
            .ElseIf(De.lessThanEqual(Qt), () => {
              Bn.assign(T.mul(Y(le.y.greaterThan(0), k(0.55), k(0.8))));
            })
            .Else(() => {
              Bn.assign(T.mul(0.7));
            });
          const Ar = Y(
            es.greaterThan(0.5),
            Bn,
            Bn.mul(la.mul(0.42).add(p.uSunCol.mul(0.02))),
          );
          (Ja.assign(B(Ar.mul(Qn), Ja, St)),
            ts.assign(B(T.mul(Qn.oneMinus()), ts, St)));
        }).ElseIf(St.lessThan(0.999).and(Qn.greaterThan(0.001)), () => {
          const Qt = Re.add(le.xy.mul(Rt.div(le.z))).toVar(),
            De = qt(Qt.sub(mt.xy), mt.zw.sub(Qt)).toVar(),
            qe = w(0).toVar(),
            wo = w(0).toVar();
          (F(qt(De.x, De.y).lessThan(0), () => {
            const mn = pt(De.y, De.x).mul(pt(le.y, 0));
            wo.assign(T.mul(Y(mn.greaterThan(0.5), k(0.8), k(0.4))));
          }).Else(() => {
            const mn = mt.zw.sub(mt.xy).toVar(),
              Bn = Y(
                y.lessThan(0.5),
                Y(mn.x.greaterThan(1.5), k(2), k(1)),
                Y(
                  y.lessThan(1.5),
                  Jt(mn.x.div(1.3).add(0.5)),
                  Y(y.lessThan(2.5), k(2), k(1)),
                ),
              ).toVar(),
              es = Y(y.greaterThan(2.5), k(0.03), k(0.055)),
              Ar = Qt.x.sub(mt.x).div(mn.x).mul(Bn),
              Id = at(rt(Ar.add(0.5)).sub(0.5))
                .mul(mn.x)
                .div(Bn),
              Bd = Y(
                y.lessThan(0.5).and(dt.greaterThan(0.35)),
                at(Qt.y.sub(mt.y.add(mn.y.mul(0.7)))),
                k(9),
              ),
              Fd = qt(qt(De.x, De.y), qt(Id.mul(1.6), Bd)),
              t0 = G.mul(Rt.div(le.z).mul(0.2).add(1)),
              e0 = _(es.sub(t0), es.add(t0), Fd).oneMinus().toVar(),
              n0 = lt.mul(4.2).add(2.6).toVar(),
              Vr = Y(
                at(le.x).lessThan(1e-4),
                k(1e4),
                Y(le.x.greaterThan(0), st.sub(Qt.x), Qt.x.negate()).div(le.x),
              ).toVar(),
              zr = Y(
                at(le.y).lessThan(1e-4),
                k(1e4),
                Y(le.y.greaterThan(0), x.sub(Qt.y), Qt.y.negate()).div(le.y),
              ).toVar(),
              Sr = n0.div(le.z).toVar(),
              qs = k(0).toVar(),
              Mo = k(0).toVar();
            F(Sr.lessThanEqual(Vr).and(Sr.lessThanEqual(zr)), () => {
              (qs.assign(Sr), Mo.assign(1));
            })
              .ElseIf(zr.lessThanEqual(Vr), () => {
                (qs.assign(zr), Mo.assign(Y(le.y.greaterThan(0), k(2), k(3))));
              })
              .Else(() => {
                (qs.assign(Vr), Mo.assign(0));
              });
            const To = w(Qt, 0).add(le.mul(qs)).toVar(),
              o0 = Y(
                lt.greaterThan(0.8),
                w(0.55, 0.62, 0.55),
                B(w(0.75, 0.72, 0.66), w(0.62, 0.66, 0.7), j),
              ).toVar(),
              vo = w(0).toVar();
            F(Mo.equal(1), () => {
              vo.assign(o0.mul(0.9));
              const l0 = rt(lt.mul(7.3)).mul(0.6);
              (F(
                To.y
                  .lessThan(x.mul(dt.mul(0.2).add(0.22)))
                  .and(To.x.greaterThan(st.mul(l0)))
                  .and(To.x.lessThan(st.mul(l0.add(0.25).add(j.mul(0.3))))),
                () => {
                  vo.mulAssign(0.25);
                },
              ),
                F(
                  j
                    .greaterThan(0.86)
                    .and(at(To.x.sub(st.mul(0.5))).lessThan(st.mul(0.16)))
                    .and(at(To.y.sub(x.mul(0.52))).lessThan(x.mul(0.11))),
                  () => {
                    vo.assign(
                      w(0.3, 0.55, 1)
                        .mul(ra.mul(2).add(1.5))
                        .mul(
                          jt(X(p.uTime.mul(2.3), ct.mul(50)))
                            .mul(0.35)
                            .add(0.65),
                        ),
                    );
                  },
                ));
            })
              .ElseIf(Mo.equal(2), () => {
                vo.assign(w(0.82, 0.8, 0.76));
              })
              .ElseIf(Mo.equal(3), () => {
                vo.assign(B(w(0.3, 0.22, 0.16), w(0.36, 0.36, 0.38), j));
              })
              .Else(() => {
                vo.assign(o0.mul(0.8));
              });
            const a0 = w(st.mul(0.5), x.sub(0.15), n0.mul(0.45)).toVar(),
              s0 = To.sub(a0),
              Nd = k(1).div(gt(s0, s0).mul(0.09).add(1)),
              Ks = vo
                .mul(
                  ra
                    .mul(Zn)
                    .mul(Nd.mul(1.7).add(0.25))
                    .add(0.01)
                    .add(la.mul(0.035)),
                )
                .toVar();
            F(Mo.equal(2).and(ra.greaterThan(0.5)), () => {
              Ks.addAssign(
                Zn.mul(_(0.35, 0.1, oe(To.xz.sub(a0.xz).mul(X(1, 0.6))))).mul(
                  3,
                ),
              );
            });
            const Rd = Y(
                rt(dt.mul(5.3)).lessThan(0.6),
                rt(ct.mul(11)).mul(0.7).add(0.1),
                k(0),
              ),
              Dd = Qt.add(le.xy.mul(k(0.06).div(le.z)));
            (F(Dd.y.greaterThan(mt.w.sub(Rd.mul(mn.y))), () => {
              Ks.assign(
                B(w(0.78, 0.74, 0.66), w(0.62, 0.66, 0.7), lt).mul(
                  ra.mul(Zn).mul(0.7).add(0.015).add(la.mul(0.05)),
                ),
              );
            }),
              Ks.mulAssign(p.uWinK),
              qe.assign(B(Ks.mul(0.86), bo, vr)),
              F(y.greaterThan(2.5), () => {
                qe.assign(B(qe, bo, 0.2));
              }));
            const _d = Y(
              y.greaterThan(2.5),
              w(0.1, 0.11, 0.12),
              Y(
                y.greaterThan(1.5),
                w(0.12, 0.12, 0.13),
                Y(j.lessThan(0.5), w(0.6, 0.6, 0.58), w(0.16, 0.17, 0.18)),
              ),
            );
            (wo.assign(_d.mul(e0)), qe.mulAssign(e0.oneMinus()));
          }),
            Ja.assign(B(qe.mul(Qn), Ja, St)),
            ts.assign(B(B(T, wo, Qn), ts, St)));
        }),
          T.assign(B(ts, T.mul(Ws.oneMinus()).mul(yo.mul(-0.55).add(1)), Mt)),
          A.assign(B(Ja, Pd.mul(Ws), Mt)));
      });
    const H = Xr(c, M, d).mul(g).toVar(),
      I = T.mul(
        H.add(p.uSunCol.mul(cl(Z(gt(M, p.uSunDir), 0).mul(ul(c, M))))).add(
          $r(c, M),
        ),
      )
        .add(A)
        .toVar(),
      P = on(T.mul(H), I).toVar();
    F(p.uBlue.greaterThan(0.001), () => {
      const J = w(0.006, 0.012, 0.03).toVar();
      (F(at(i.y).lessThan(0.5), () => {
        const st = Z(1, Jt(C.div(b).add(0.5))),
          N = X(E.div(C.div(st)), o.y.div(x)),
          O = we(N).mul(1.2),
          $ = _(O, X(0), at(rt(N.add(0.5)).sub(0.5)));
        J.addAssign(
          w(0.15, 0.75, 1).mul(
            Z($.x, $.y)
              .mul(0.45)
              .add(_(1.2, 0, E).mul(1.6))
              .add(_(1.2, 0, C.sub(E)).mul(1.6)),
          ),
        );
      }).Else(() => {
        const st = s.xz.mul(0.5).sub(at(a.xz));
        J.addAssign(
          w(0.15, 0.75, 1)
            .mul(_(1.5, 0, qt(st.x, st.y)))
            .mul(1.6),
        );
      }),
        J.mulAssign(cs(c.y).mul(0.4).add(0.6)),
        I.assign(B(I, J, p.uBlue)));
    });
    const q = s.mul(0.5),
      S = at(a),
      K = at(i.x).greaterThan(0.5),
      ot = at(i.y).greaterThan(0.5),
      xt = Y(K, q.zy.sub(S.zy), Y(ot, q.xz.sub(S.xz), q.xy.sub(S.xy))),
      U = Y(
        K,
        X(we(a.z), we(a.y)),
        Y(ot, X(we(a.x), we(a.z)), X(we(a.x), we(a.y))),
      );
    (F(p.uPick.greaterThan(0).and(at(h.sub(p.uPick)).lessThan(1e-7)), () => {
      const J = _(U.mul(0.7), U.mul(1.9), xt).oneMinus();
      I.addAssign(w(0.3, 0.85, 1).mul(Z(J.x, J.y)).mul(1.3));
    }),
      t.assign(T),
      n.assign(M),
      e.assign(nt(I, P)));
  },
  Im = Se({ position: ui(), shade: Pm }),
  G0 = new f.Mesh(an, Im);
((G0.frustumCulled = !1), ze.add(G0));
const Fo = Et("pA", "vec4"),
  lo = Et("pB", "vec4"),
  H0 = w(lo.x, lo.y, lo.x),
  O0 = (t) => {
    const e = Ke(Fo.z),
      n = ae(Fo.z);
    return w(t.x.mul(e).sub(t.z.mul(n)), t.y, t.x.mul(n).add(t.z.mul(e)));
  },
  ci = (t) =>
    O0(ce.mul(H0)).add(w(Fo.x, Po(Fo.xy, Fo.w, lo.y, t).negate(), Fo.y)),
  sn = {
    position: At(() => (eo.assign(ci(p.uGrowTP)), ci(p.uGrowT)))(),
    W: kt(ci(p.uGrowT)),
    N: kt(O0(to.div(H0))),
    U: kt(Et("pU", "vec2")),
    K: kt(Et("pK", "float")),
    S: kt(nt(Fo.w, lo.y, lo.z, lo.w)),
    LY: kt(ce.y.mul(lo.y)),
  },
  Bm = ({ alb: t, out: e, nrm: n }) => {
    const o = sn.W,
      a = vt(sn.N).toVar(),
      s = vt(o.sub(de)).toVar(),
      l = Jt(sn.K.add(0.5)).toVar(),
      r = sn.U.x.toVar(),
      u = sn.U.y.toVar(),
      i = sn.S.x.toVar(),
      c = sn.S.z.toVar(),
      m = sn.S.w.toVar(),
      d = sn.LY.toVar(),
      h = vn(
        rt(i.mul(7.31)),
        [
          [0.3, [0.42, 0.64, 0.68]],
          [0.55, [0.7, 0.56, 0.42]],
          [0.8, [0.54, 0.62, 0.76]],
        ],
        [0.72, 0.68, 0.58],
      ).toVar(),
      y = w(0).toVar(),
      x = w(0).toVar(),
      b = w(a).toVar(),
      V = k(0).toVar(),
      T = k(0.04).toVar(),
      A = k(0).toVar(),
      g = k(0).toVar(),
      M = d.div(4.2),
      L = Jt(M).toVar(),
      C = rt(M).toVar(),
      E = we(M).add(1e-4).toVar();
    F(l.lessThan(0.5), () => {
      const U = _(E.negate(), E, k(0.085).sub(C))
          .mul(_(0.9, 0.4, E))
          .toVar(),
        J = Jt(r.mul(m)),
        st = ie(X(L, J).add(i.mul(97))).toVar(),
        N = ie(X(L.mul(1.37), J.add(0.5)).add(i.mul(41).add(7))),
        O = qt(1, p.uLitK.mul(c).mul(1.3)),
        $ = pt(st, O.add(ae(p.uTime.mul(0.05).add(N.mul(50))).mul(0.03)));
      (x.assign(
        B(_0(N), w(1, 0.84, 0.64), 0.75)
          .mul($)
          .mul(_(0.15, 0.92, C).mul(0.55).add(0.3))
          .add(0.006)
          .mul(p.uWinK)
          .mul(0.6),
      ),
        V.assign(U.oneMinus()),
        T.assign(0.14),
        y.assign(B(w(0.03), w(0.62, 0.62, 0.6), U)),
        g.assign(_(E.mul(1.6), 0, at(C.sub(0.085))).mul(_(0.5, 0.2, E))));
    })
      .ElseIf(l.lessThan(1.5).or(l.greaterThan(6.5)), () => {
        (y.assign(w(0.74, 0.75, 0.74)),
          T.assign(0.05),
          A.assign(0.55),
          F(l.greaterThan(6.5), () => {
            g.assign(1);
            const U = _(
              0.86,
              1,
              rt(
                u
                  .mul(3)
                  .sub(p.uTime.mul(0.07))
                  .add(rt(r.mul(13.7))),
              ),
            );
            x.assign(
              w(0.55, 0.85, 1)
                .mul(p.uNeonK)
                .mul(
                  _(0.5, 1.05, u)
                    .mul(0.35)
                    .add(U.mul(_(0.2, 0.6, u)).mul(1.2)),
                ),
            );
          }));
      })
      .ElseIf(l.lessThan(2.5), () => {
        (y.assign(w(0.78, 0.77, 0.74)),
          T.assign(0.04),
          A.assign(0.8),
          F(a.y.greaterThan(0.5), () => {
            y.assign(
              B(
                w(0.34, 0.21, 0.12),
                w(0.45, 0.29, 0.17),
                jt(o.xz.mul(X(1.6, 0.14))),
              ),
            );
          })
            .ElseIf(a.y.lessThan(-0.5), () => {
              const U = rt(o.xz.div(3)).sub(0.5);
              (x.assign(
                w(1, 0.8, 0.55)
                  .mul(_(0.12, 0.05, oe(U)))
                  .mul(4),
              ),
                y.assign(w(0.5)));
            })
            .Else(() => {
              (x.assign(
                w(1, 0.86, 0.66)
                  .mul(_(0.16, 0.04, at(u.sub(0.5))))
                  .mul(p.uNeonK.mul(1.4).add(0.3)),
              ),
                g.assign(_(0.2, 0.05, at(u.sub(0.5)))));
            }));
      })
      .ElseIf(l.lessThan(3.5), () => {
        const U = r.mul(m).mul(3),
          J = Jt(U),
          st = rt(U).toVar(),
          N = ie(X(J, i.mul(13))).toVar(),
          O = we(U).add(1e-4),
          $ = _(O.add(0.04), 0.04, qt(st, st.oneMinus())).toVar(),
          ht = w(1, 0.7, 0.42)
            .mul(
              _(0.8, 0.93, u)
                .mul(_(1, 0.95, u))
                .mul(2.2)
                .add(_(0.25, 0, u).mul(0.6))
                .add(0.38),
            )
            .toVar(),
          ut = rt(N.mul(7.7)).mul(0.6).add(0.2),
          ct = rt(N.mul(3.1)).mul(0.12).add(0.05),
          lt = rt(N.mul(11.3)).mul(0.28).add(0.32);
        (ht.mulAssign(
          pt(0.5, N)
            .mul(_(0.02, 0, at(st.sub(ut)).sub(ct)))
            .mul(pt(u, lt))
            .mul(-0.85)
            .add(1),
        ),
          x.assign(ht.mul($.oneMinus()).mul(p.uWinK.mul(0.7).add(0.5))),
          y.assign(B(w(0.02), w(0.72), $)),
          V.assign($.oneMinus()),
          T.assign(0.07));
      })
      .ElseIf(l.lessThan(4.5), () => {
        const U = o.xz.mul(0.55).add(p.uTime.mul(X(0.31, 0.23))),
          J = k(0.06),
          st = jt(U.add(X(J, 0))).sub(jt(U.sub(X(J, 0)))),
          N = jt(U.add(X(0, J))).sub(jt(U.sub(X(0, J))));
        (b.assign(vt(w(st.mul(-0.5), 1, N.mul(-0.5)))),
          T.assign(0.02),
          V.assign(1),
          h.assign(w(1)),
          x.assign(w(0.04, 0.5, 0.58).mul(p.uNeonK.mul(0.45).add(0.12))),
          y.assign(w(0.02, 0.08, 0.1)));
      })
      .ElseIf(l.lessThan(5.5), () => {
        (y.assign(w(0.1)),
          x.assign(w(0.72, 0.9, 1).mul(2.6).mul(p.uNeonK.mul(0.7).add(0.3))),
          g.assign(1));
      })
      .Else(() => {
        (y.assign(w(0.05)),
          x.assign(
            w(1, 0.05, 0.03)
              .mul(20)
              .mul(pt(0.84, rt(p.uTime.mul(0.7).add(i.mul(5))))),
          ));
      });
    const R = jr(o, b).toVar(),
      G = Xr(o, b, R).toVar(),
      H = ul(o, b).toVar(),
      I = p.uSunCol
        .mul(cl(Z(gt(b, p.uSunDir), 0).mul(H)))
        .add($r(o, b))
        .toVar(),
      P = Tn(s, b).toVar(),
      q = Q(gt(s, b).negate(), 0, 1),
      S = T.add(T.oneMinus().mul(Ft(q.oneMinus(), 5))).toVar(),
      K = Zr(o, P, A).toVar(),
      ot = y
        .mul(G.add(I))
        .add(x)
        .add(K.mul(S).mul(V.oneMinus()).mul(0.6))
        .toVar();
    F(V.greaterThan(0.001), () => {
      const U = x
        .mul(S.oneMinus())
        .add(K.mul(h).mul(S))
        .add(p.uSunCol.mul(Ft(Z(gt(P, p.uSunDir), 0), 220).mul(3)).mul(H));
      ot.assign(B(ot, U, V));
    });
    const xt = on(y.mul(G).mul(V.oneMinus()), ot).toVar();
    (F(p.uBlue.greaterThan(0.001), () => {
      const U = r.mul(m),
        J = _(we(U).mul(1.5), 0, at(rt(U).sub(0.5)));
      ot.assign(
        B(
          ot,
          w(0.006, 0.012, 0.03)
            .add(
              w(0.15, 0.75, 1).mul(Z(g, Y(l.lessThan(0.5), J, k(0))).mul(0.9)),
            )
            .mul(cs(o.y).mul(0.4).add(0.6)),
          p.uBlue,
        ),
      );
    }),
      F(p.uPick.greaterThan(0).and(at(i.sub(p.uPick)).lessThan(1e-7)), () => {
        ot.addAssign(w(0.3, 0.85, 1).mul(g).mul(1.2));
      }),
      t.assign(y.mul(V.oneMinus())),
      n.assign(b),
      e.assign(nt(ot, xt)));
  },
  Fm = Se({ position: sn.position, shade: Bm }),
  di = 48,
  bs = ls.map((t) => {
    const e = t.g,
      n = new Float32Array(di * 4),
      o = new Float32Array(di * 4);
    for (const [s, l] of [
      ["pA", n],
      ["pB", o],
    ]) {
      const r = new f.InstancedBufferAttribute(l, 4);
      (r.setUsage(f.DynamicDrawUsage), e.setAttribute(s, r));
    }
    ((e.instanceCount = 0),
      (e.boundingSphere = new f.Sphere(new f.Vector3(), 1e5)));
    const a = new f.Mesh(e, Fm);
    return (
      (a.frustumCulled = !1),
      ze.add(a),
      { m: a, g: e, a: n, b: o, n: 0 }
    );
  });
function Nm(t) {
  for (const e of bs) e.n = 0;
  for (const e of t) {
    const n = bs[e.para.tp];
    if (n.n >= di) continue;
    const o = n.n * 4;
    ((n.a[o] = e.cx),
      (n.a[o + 1] = e.cz),
      (n.a[o + 2] = e.para.rot),
      (n.a[o + 3] = e.seed),
      (n.b[o] = e.para.h),
      (n.b[o + 1] = e.H),
      (n.b[o + 2] = e.lit),
      (n.b[o + 3] = e.para.T.nf),
      n.n++);
  }
  for (const e of bs) {
    ((e.g.instanceCount = e.n), (e.m.visible = e.n > 0));
    for (const n of ["pA", "pB"]) {
      const o = e.g.attributes[n];
      (o.clearUpdateRanges(),
        o.addUpdateRange(0, e.n * 4),
        (o.needsUpdate = !0));
    }
  }
}
const _t = {
    WALL: 0,
    AC: 1,
    METAL: 2,
    SCAF: 4,
    LAMP: 5,
    RED: 6,
    GLASS: 7,
    VENT: 8,
    DARK: 9,
    SLAB: 10,
    TEMPLE: 11,
    LANTERN: 12,
    RAIL: 20,
    CAGE: 21,
    NET: 22,
    LATT: 23,
  },
  ba = { TANK: 0, MAST: 1, PIPE: 2, COLUMN: 3, DISH: 4 },
  No = Et("iP", "vec4"),
  pl = Et("iS", "vec4"),
  Ro = Et("iR", "vec4"),
  Rm = Et("iT", "vec4");
function W0(t) {
  const e = ce.mul(pl.xyz),
    n = to,
    o = t ? Ke(Ro.x) : k(1),
    a = t ? ae(Ro.x) : k(0),
    s = w(e.x.mul(o).sub(e.y.mul(a)), e.x.mul(a).add(e.y.mul(o)), e.z),
    l = w(n.x.mul(o).sub(n.y.mul(a)), n.x.mul(a).add(n.y.mul(o)), n.z),
    r = Ke(No.w),
    u = ae(No.w),
    i = w(
      r.mul(s.x).add(u.mul(s.z)),
      s.y,
      u.negate().mul(s.x).add(r.mul(s.z)),
    ).add(No.xyz),
    c = w(r.mul(l.x).add(u.mul(l.z)), l.y, u.negate().mul(l.x).add(r.mul(l.z))),
    m = (d) => i.sub(w(0, Po(Rm.xy, Ro.y, Ro.w, d), 0));
  return {
    position: At(() => (eo.assign(m(p.uGrowTP)), m(p.uGrowT)))(),
    W: kt(m(p.uGrowT)),
    N: kt(c),
    L: kt(ce.mul(pl.xyz)),
    LN: to,
    S: kt(pl.xyz),
    K: kt(
      nt(
        pl.w,
        Ro.y,
        Ro.z,
        rt(No.x.mul(0.137).add(No.z.mul(0.291)).add(No.y.mul(0.073))),
      ),
    ),
    slot: kt(Ro.x),
    C: kt(No.xyz),
  };
}
const ro = Xe(
    "bars",
    "float",
    ["x:float", "pitch:float", "w:float", "aa:float"],
    ([t, e, n, o]) => {
      const a = at(rt(t.div(e).add(0.5)).sub(0.5)).mul(e);
      return B(
        _(n.sub(o), n.add(o), a).oneMinus(),
        n.mul(2).div(e),
        _(e.mul(0.2), e.mul(0.5), o),
      );
    },
  ),
  yl = W0(!0),
  q0 =
    (t) =>
    ({ alb: e, out: n, nrm: o }) => {
      const { W: a, N: s, L: l, LN: r, S: u, K: i } = yl,
        c = vt(s).toVar(),
        m = i.x.toVar(),
        d = i.y.toVar(),
        h = i.z.toVar(),
        y = i.w.toVar(),
        x = u.mul(0.5).toVar(),
        b = w(0).toVar(),
        V = w(0).toVar(),
        T = k(1).toVar(),
        A = k(1).toVar(),
        g = Y(
          at(r.x).greaterThan(0.5),
          l.zy,
          Y(at(r.y).greaterThan(0.5), l.xz, l.xy),
        ).toVar(),
        M = Y(
          at(r.x).greaterThan(0.5),
          x.zy,
          Y(at(r.y).greaterThan(0.5), x.xz, x.xy),
        ).toVar(),
        L = Z(we(g.x), we(g.y)).mul(0.7).add(1e-4).toVar(),
        C = qt(M.x.sub(at(g.x)), M.y.sub(at(g.y))).toVar();
      F(m.lessThan(0.5), () => {
        (b.assign(
          fs(rt(d.mul(13.7)), h)
            .mul(0.7)
            .mul(B(0.82, 1.12, jt(a.xz.mul(0.31).add(a.y.mul(0.07))))),
        ),
          A.assign(B(0.75, 1, _(0, 0.25, C))));
      })
        .ElseIf(m.lessThan(1.5), () => {
          (b.assign(B(w(0.66, 0.66, 0.62), w(0.5, 0.52, 0.5), y)),
            F(r.z.greaterThan(0.5), () => {
              const H = oe(l.xy.sub(X(x.x.mul(0.3), 0))).toVar(),
                I = pt(H, x.y.mul(0.8));
              (b.mulAssign(
                B(
                  1,
                  pt(0.5, rt(H.mul(24)))
                    .mul(0.35)
                    .add(0.3),
                  I,
                ),
              ),
                b.mulAssign(pt(H, x.y.mul(0.13)).mul(-0.7).add(1)));
            }).ElseIf(at(r.x).greaterThan(0.5), () => {
              b.mulAssign(
                pt(0.5, rt(l.y.mul(16)))
                  .mul(0.3)
                  .add(0.7),
              );
            }),
            b.mulAssign(B(0.62, 1, jt(a.xz.mul(2.3).add(a.y.mul(0.7))))),
            A.assign(B(0.6, 1, _(0, 0.06, C))));
        })
        .ElseIf(m.lessThan(2.5), () => {
          (b.assign(w(0.15, 0.155, 0.165).mul(B(0.75, 1.25, y))),
            A.assign(B(0.7, 1, _(0, 0.2, C))));
        })
        .ElseIf(m.lessThan(4.5), () => {
          b.assign(
            vn(
              y,
              [
                [0.5, [0.62, 0.42, 0.12]],
                [0.8, [0.42, 0.43, 0.45]],
              ],
              [0.3, 0.18, 0.1],
            ),
          );
        })
        .ElseIf(m.lessThan(5.5), () => {
          (b.assign(w(0.07, 0.075, 0.08)),
            F(r.y.lessThan(-0.5), () => {
              const H = at(l.xz).div(x.xz);
              V.assign(
                w(1, 0.95, 0.86)
                  .mul(40)
                  .mul(_(0.55, 0.85, Z(H.x, H.y)).oneMinus()),
              );
            }));
        })
        .ElseIf(m.lessThan(6.5), () => {
          (b.assign(w(0.1)),
            V.assign(
              w(1, 0.06, 0.03)
                .mul(p.uNightK.mul(10).add(14))
                .mul(pt(0.45, rt(p.uTime.mul(0.5).add(y)))),
            ));
        })
        .ElseIf(m.lessThan(7.5), () => {
          (b.assign(w(0.05, 0.07, 0.08)),
            V.assign(Jr(a, Tn(vt(a.sub(de)), c)).mul(0.35)));
        })
        .ElseIf(m.lessThan(8.5), () => {
          b.assign(
            w(0.36, 0.37, 0.37).mul(
              pt(0.5, rt(l.y.mul(7)))
                .mul(0.25)
                .add(0.75),
            ),
          );
        })
        .ElseIf(m.lessThan(9.5), () => {
          b.assign(w(0.035, 0.04, 0.045));
        })
        .ElseIf(m.lessThan(10.5), () => {
          (b.assign(
            fs(rt(d.mul(13.7)), h)
              .mul(0.62)
              .mul(Y(r.y.lessThan(-0.5), k(0.55), k(1))),
          ),
            A.assign(B(0.7, 1, _(0, 0.3, C))));
        })
        .ElseIf(m.lessThan(11.5), () => {
          const H = at(rt(g.x.div(2.6).add(0.5)).sub(0.5)).mul(2.6);
          (b.assign(w(0.12, 0.07, 0.05)),
            F(H.lessThan(0.22), () => {
              b.assign(w(0.42, 0.06, 0.04));
            }).ElseIf(
              at(g.y).lessThan(M.y.sub(0.6)).and(at(r.y).lessThan(0.5)),
              () => {
                (b.assign(w(0.05)),
                  V.assign(
                    w(1, 0.62, 0.3)
                      .mul(p.uNightK.mul(1.8).add(0.5))
                      .mul(
                        jt(g.mul(1.3).add(d.mul(9)))
                          .mul(0.3)
                          .add(0.7),
                      ),
                  ));
              },
            ));
        })
        .ElseIf(m.lessThan(12.5), () => {
          (b.assign(w(0.2, 0.05, 0.03)),
            V.assign(w(1, 0.42, 0.12).mul(p.uNightK.mul(5).add(2.5))));
        })
        .Else(() => {
          t &&
            (F(m.lessThan(20.5), () => {
              (b.assign(
                Y(y.lessThan(0.5), w(0.2, 0.21, 0.22), w(0.55, 0.56, 0.55)),
              ),
                F(at(r.z).greaterThan(0.5), () => {
                  T.assign(
                    Z(
                      ro(g.x, k(0.12), k(0.012), L),
                      Z(
                        pt(M.y.sub(0.05), g.y),
                        Z(
                          pt(g.y, M.y.negate().add(0.04)),
                          _(
                            0.015,
                            L.add(0.015),
                            at(g.y.add(M.y.mul(0.1))),
                          ).oneMinus(),
                        ),
                      ),
                    ),
                  );
                }));
            })
              .ElseIf(m.lessThan(21.5), () => {
                (b.assign(
                  Y(y.lessThan(0.6), w(0.13, 0.14, 0.15), w(0.45, 0.47, 0.48)),
                ),
                  T.assign(
                    Z(
                      Z(
                        ro(g.x, k(0.14), k(0.011), L),
                        ro(g.y, k(0.3), k(0.013), L),
                      ),
                      _(0.03, L.add(0.03), C).oneMinus(),
                    ),
                  ));
              })
              .ElseIf(m.lessThan(22.5), () => {
                (b.assign(
                  Y(y.lessThan(0.5), w(0.1, 0.14, 0.18), w(0.11, 0.16, 0.13)),
                ),
                  T.assign(
                    Z(ro(g.x, k(0.3), k(0.02), L), ro(g.y, k(0.3), k(0.02), L))
                      .mul(0.35)
                      .add(0.5),
                  ));
              })
              .Else(() => {
                (b.assign(w(0.75, 0.55, 0.12)),
                  T.assign(
                    Z(
                      Z(
                        ro(g.x.add(g.y), k(2), k(0.06), L),
                        ro(g.x.sub(g.y), k(2), k(0.06), L),
                      ),
                      Z(
                        _(0.09, L.add(0.09), C).oneMinus(),
                        ro(g.y, k(2), k(0.05), L),
                      ),
                    ),
                  ));
              }),
            F(T.lessThan(0.03).or(T.lessThan(rl(no.xy))), () => {
              ns();
            }));
        });
      const E = An(a, c, A),
        R = b.mul(E.amb.add(E.dir)).add(V).toVar(),
        G = on(b.mul(E.amb), R).toVar();
      (F(p.uBlue.greaterThan(0.001), () => {
        R.assign(
          B(
            R,
            w(0.006, 0.012, 0.03).add(
              w(0.15, 0.75, 1)
                .mul(_(L.mul(2.5), 0, C))
                .mul(1.4),
            ),
            p.uBlue,
          ),
        );
      }),
        e.assign(b),
        o.assign(c),
        n.assign(nt(R, G)));
    },
  K0 = Et("iP", "vec4"),
  io = Et("iS", "vec4"),
  xl = Et("iR", "vec4"),
  Dm = Et("iT", "vec4"),
  mi = (() => {
    const t = ce,
      e = to,
      n = w(t.x.mul(io.x), t.y.mul(io.y), t.z.mul(io.x)),
      o = io.z.greaterThan(0.5).and(io.z.lessThan(1.5)),
      a = io.z.greaterThan(1.5),
      s = Y(o, n.yxz, Y(a, n.xzy, n)),
      l = Y(o, e.yxz, Y(a, e.xzy, e)),
      r = (u) => s.add(K0.xyz).sub(w(0, Po(Dm.xy, xl.x, xl.z, u), 0));
    return {
      position: At(() => (eo.assign(r(p.uGrowTP)), r(p.uGrowT)))(),
      W: kt(r(p.uGrowT)),
      N: kt(l),
      L: kt(w(t.x, t.z, t.y.mul(io.y))),
      K: kt(nt(K0.w, xl.x, xl.y, io.w)),
    };
  })(),
  _m = ({ alb: t, out: e, nrm: n }) => {
    const { W: o, N: a, L: s, K: l } = mi,
      r = vt(a).toVar(),
      u = l.x,
      i = l.y,
      c = l.z,
      m = l.w.toVar(),
      d = w(0).toVar();
    F(u.lessThan(0.5), () => {
      (d.assign(
        vn(
          m,
          [
            [0.3, [0.55, 0.5, 0.42]],
            [0.6, [0.32, 0.36, 0.4]],
          ],
          [0.42, 0.3, 0.22],
        ),
      ),
        d.mulAssign(
          pt(0.5, rt(s.z.mul(0.55)))
            .mul(0.2)
            .add(0.8),
        ),
        d.mulAssign(B(0.6, 1, jt(X(as(s.x, s.y).mul(3), s.z.mul(0.4))))));
    })
      .ElseIf(u.lessThan(1.5), () => {
        d.assign(w(0.12, 0.12, 0.13));
      })
      .ElseIf(u.lessThan(2.5), () => {
        d.assign(
          Y(m.lessThan(0.6), w(0.32, 0.33, 0.34), w(0.36, 0.24, 0.16)).mul(
            B(0.75, 1.05, jt(X(s.z.mul(0.3), m.mul(40)))),
          ),
        );
      })
      .ElseIf(u.lessThan(3.5), () => {
        d.assign(fs(rt(i.mul(13.7)), c).mul(0.65));
      })
      .Else(() => {
        d.assign(w(0.62, 0.62, 0.6).mul(m.mul(0.15).add(0.85)));
      });
    const h = An(o, r, k(1)),
      y = d.mul(h.amb.add(h.dir)).toVar(),
      x = on(d.mul(h.amb), y).toVar();
    (F(p.uBlue.greaterThan(0.001), () => {
      y.assign(
        B(
          y,
          w(0.006, 0.012, 0.03).add(
            w(0.15, 0.75, 1)
              .mul(0.25)
              .mul(Ft(at(gt(r, vt(o.sub(de)))).oneMinus(), 3)),
          ),
          p.uBlue,
        ),
      );
    }),
      t.assign(d),
      n.assign(r),
      e.assign(nt(y, x)));
  },
  U0 = Se({ position: yl.position, shade: q0(!1), ink: 0.4 }),
  Gm = Se({
    position: yl.position,
    shade: q0(!0),
    opts: { side: f.DoubleSide },
    ink: 0,
  }),
  Y0 = Se({ position: mi.position, shade: _m, ink: 0.4 }),
  $0 = new f.CylinderGeometry(1, 1, 1, 10, 1, !1);
$0.deleteAttribute("uv");
function j0(t, e) {
  const n = e === 0 ? -1 : e === 1 ? 1 : 0,
    o = e === 2 ? -1 : e === 3 ? 1 : 0,
    a = o,
    s = -n,
    l = e < 2 ? t.z1 - t.z0 : t.x1 - t.x0,
    r = e === 0 ? t.x0 : e === 1 ? t.x1 : (t.x0 + t.x1) / 2,
    u = e === 2 ? t.z0 : e === 3 ? t.z1 : (t.z0 + t.z1) / 2;
  return {
    nx: n,
    nz: o,
    tx: a,
    tz: s,
    w: l,
    ox: r - (a * l) / 2,
    oz: u - (s * l) / 2,
    yaw: Math.atan2(n, o),
  };
}
function Ie(t, e, n, o, a, s, l, r, u, i, c) {
  t.push(e, n, o, a, s, l, r, u, i, c.seed, c.style, c.H, c.cx, c.cz, 0, 0);
}
function Te(t, e, n, o, a, s, l, r, u, i, c) {
  Ie(
    t,
    e.ox + e.tx * n + e.nx * a,
    o,
    e.oz + e.tz * n + e.nz * a,
    e.yaw,
    s,
    l,
    r,
    u,
    i || 0,
    c,
  );
}
function bl(t, e, n, o, a, s, l, r, u, i) {
  t.push(e, n, o, r, a, s, l, u, i.seed, i.style, i.H, 0, i.cx, i.cz, 0, 0);
}
function fi(t, e, n, o, a, s, l, r, u, i, c) {
  bl(
    t,
    e.ox + e.tx * n + e.nx * a,
    o,
    e.oz + e.tz * n + e.nz * a,
    s,
    l,
    r,
    u,
    i,
    c,
  );
}
const hi = (t, e, n) => [
  t.ox + t.tx * e + t.nx * n,
  t.oz + t.tz * e + t.nz * n,
];
function Hm(t, e, n, o) {
  const [a, s] = t.blk,
    l =
      e === 0
        ? Rn(a - 1, s)
        : e === 1
          ? Rn(a + 1, s)
          : e === 2
            ? Rn(a, s - 1)
            : Rn(a, s + 1),
    r = e === 0 ? l.x1 - 1 : e === 1 ? l.x0 + 1 : n,
    u = e === 2 ? l.z1 - 1 : e === 3 ? l.z0 + 1 : o;
  for (const i of l.towers)
    if (r >= i.x0 && r <= i.x1 && u >= i.z0 && u <= i.z1)
      return {
        u: i,
        x: e < 2 ? (e === 0 ? l.x1 : l.x0) : n,
        z: e < 2 ? o : e === 2 ? l.z1 : l.z0,
      };
  return null;
}
function X0(t, e, n, o, a, s, l, r, u) {
  let c = e,
    m = n,
    d = o;
  for (let h = 1; h <= 5; h++) {
    const y = h / 5,
      x = ne(e, a, y),
      b = ne(o, l, y),
      V = ne(n, s, y) - r * 4 * y * (1 - y);
    (t.push(c, m, d, u, x, V, b, 0), (c = x), (m = V), (d = b));
  }
}
function Om(t, e, n, o, a, s, l, r, u, i, c) {
  if (t.para) return;
  const m = t.style,
    d = t.fh,
    h = t.H,
    y = m === hn && e() < 0.45 ? 2 + Math.floor(e() * 3) : 0,
    x = m === hn ? 0.18 + e() * 0.14 : m === da ? 0.08 : m === ao ? 0.05 : 0,
    b = m === hn ? (e() < 0.45 ? 0.1 + e() * 0.16 : 0.03) : 0,
    V = m === ma ? (e() < 0.5 ? 8 : 0) : 3 + Math.floor(e() * 7),
    T =
      m === ma
        ? e() < 0.7
          ? 1
          : 0
        : m === da
          ? 1
          : m === ao && e() < 0.5
            ? 2
            : 0,
    A = m === ma ? 0.3 + e() * 0.35 : 0.45 + e() * 0.8,
    g = 0.26 + 0.12 * ((t.seed * 7.1) % 1),
    M = e() < 0.06,
    L = 1.3 + ((t.seed * 31) % 1) * 1.1;
  for (const P of t.segs)
    for (let q = 0; q < 4; q++) {
      const S = j0(P, q);
      if (S.w < 5) continue;
      const K = t.E[q] ? P.y0 : Math.max(P.y0, t.nh[q] + 0.5);
      if (K >= P.y1 - d) continue;
      const ot = t.E[q],
        xt = ot ? 1 : 0.4,
        U = Math.max(1, Math.round(S.w / t.bay)),
        J = S.w / U,
        st = Math.max(2, Math.ceil(K / d)),
        N = Math.floor(P.y1 / d) - 1;
      if (N <= st) continue;
      const O = st * d,
        $ = N * d + d;
      if (V)
        for (let j = st; j <= N; j++)
          j % V === 0 &&
            Te(
              n.big,
              S,
              S.w / 2,
              j * d - 0.18,
              0.24,
              S.w + 0.5,
              0.36,
              0.48,
              _t.WALL,
              0,
              t,
            );
      if (T)
        for (let j = 0; j <= U; j += T)
          Te(n.big, S, j * J, (O + $) / 2, A / 2, 0.3, $ - O, A, _t.WALL, 0, t);
      if (m === da)
        for (let j = st; j <= N; j++) {
          const it = j * d;
          (Te(n.big, S, S.w / 2, it + 0.15, L / 2, S.w, 0.3, L, _t.SLAB, 0, t),
            Te(
              n.big,
              S,
              S.w / 2,
              it + 0.8,
              L - 0.1,
              S.w,
              1,
              0.2,
              _t.WALL,
              0,
              t,
            ));
        }
      if (ot || e() < 0.3) {
        const j = 1 + Math.floor(e() * 3);
        for (let it = 0; it < j; it++)
          fi(
            a,
            S,
            Math.floor(e() * (U + 1)) * J + (e() - 0.5) * 0.5,
            (O + $) / 2,
            0.3,
            0.11 + e() * 0.07,
            $ - O,
            0,
            ba.PIPE,
            e(),
            t,
          );
      }
      if (m === ao) {
        for (let j = st + 2; j < N; j += 4 + Math.floor(e() * 3)) {
          const it = j * d;
          (Te(n.big, S, S.w / 2, it, 0.75, S.w - 1, 0.12, 1.5, _t.METAL, 0, t),
            Te(
              o.big,
              S,
              S.w / 2,
              it + 0.6,
              1.47,
              S.w - 1,
              1.1,
              0.04,
              _t.RAIL,
              0,
              t,
            ));
        }
        if (e() < 0.65) {
          const j = 0.5 + e() * 0.8;
          fi(
            a,
            S,
            J * (0.5 + Math.floor(e() * U)),
            (O + $) / 2,
            j + 0.35,
            j,
            $ - O,
            0,
            ba.PIPE,
            e(),
            t,
          );
        }
      }
      if (M && ot) {
        const j = O + d * Math.floor(e() * (N - st) * 0.5),
          it = Math.min($, j + d * (8 + Math.floor(e() * 14))),
          bt = J * Math.floor(e() * U * 0.4),
          St = Math.min(S.w, bt + J * (3 + Math.floor(e() * 6)));
        for (let Mt = bt; Mt <= St + 0.01; Mt += 2.4)
          Te(
            n.big,
            S,
            Mt,
            (j + it) / 2,
            1.5,
            0.09,
            it - j,
            0.09,
            _t.SCAF,
            0,
            t,
          );
        for (let Mt = j; Mt <= it; Mt += 2)
          (Te(
            n.big,
            S,
            (bt + St) / 2,
            Mt,
            1.5,
            St - bt,
            0.09,
            0.09,
            _t.SCAF,
            0,
            t,
          ),
            Te(
              n.big,
              S,
              (bt + St) / 2,
              Mt - 0.05,
              0.9,
              St - bt,
              0.05,
              1.3,
              _t.METAL,
              0,
              t,
            ));
        e() < 0.6 &&
          Te(
            o.big,
            S,
            (bt + St) / 2,
            (j + it) / 2,
            1.62,
            St - bt,
            it - j,
            0.02,
            _t.NET,
            0,
            t,
          );
      }
      if (c && ot && S.w > 28 && P.y1 - P.y0 > 24) {
        const j = se(t.id * 4 + q, Math.floor(P.y0), 4711);
        if (j < nc) {
          const it = se(t.id, q, 4712),
            bt =
              it < 0.2
                ? 0
                : it < 0.36
                  ? 1
                  : 2 + Math.floor(se(t.id, q, 4715) * Ta.length),
            St = j / nc,
            Mt = Math.min(S.w - 6, bt === 1 ? 30 + St * 10 : 24 + St * 10),
            mt = bt === 0 ? Mt / 2 : bt === 1 ? Mt / 4 : Mt / 1.6,
            Rt = Q(
              55 + se(t.id, q, 4713) * 95,
              P.y0 + mt / 2 + 4,
              P.y1 - mt / 2 - 4,
            );
          Rt > 36 &&
            Rt - mt / 2 >= P.y0 + 3 &&
            Rt + mt / 2 <= P.y1 - 3 &&
            c.push({
              F: S,
              u: 3 + Mt / 2 + se(t.id, q, 4714) * (S.w - Mt - 6),
              y: Rt,
              w: Mt,
              h: mt,
              kind: bt,
              t,
            });
        }
      }
      if (m === ao || m === ma) continue;
      const ht = P.v,
        ut = m === hn && (ht * 11.7) % 1 < 0.4 ? 0.38 : 0,
        ct = 0.2 + 0.18 * ((ht * 7.31) % 1),
        lt = 0.26 + 0.1 * ((ht * 3.7) % 1),
        dt = 0.78 + 0.08 * ((ht * 5.3) % 1);
      if (ot && r) {
        for (let j = 0, it = Math.floor(e() * e() * 7); j < it; j++) {
          const bt =
              Math.max(P.y0 + 3, 6) + e() * Math.min(P.y1 - P.y0 - 6, 150),
            St = 1 + e() * (S.w - 2),
            Mt = Q(St + (e() < 0.5 ? -1 : 1) * (3 + e() * 12), 0.5, S.w - 0.5),
            mt = hi(S, St, 0.25),
            Rt = hi(S, Mt, 0.25);
          X0(
            r,
            mt[0],
            bt,
            mt[1],
            Rt[0],
            bt + (e() - 0.5) * 5,
            Rt[1],
            0.3 + e() * 1.1,
            0.035 + e() * 0.03,
          );
        }
        if (P.y0 < 30)
          for (let j = 0, it = Math.floor(e() * 2.6); j < it; j++) {
            const bt = 9 + e() * 20,
              St = 2 + e() * (S.w - 4),
              Mt = hi(S, St, 0.1),
              mt = Hm(t, q, Mt[0], Mt[1]);
            mt &&
              mt.u.H > bt + 4 &&
              X0(
                r,
                Mt[0],
                bt,
                Mt[1],
                mt.x,
                bt + (e() - 0.5) * 4,
                mt.z,
                1 + e() * 2.5,
                0.05,
              );
          }
      }
      for (let j = st; j <= N; j++) {
        const it = j * d;
        for (let bt = 0; bt < U; bt++) {
          const St = (bt + 0.5) * J,
            Mt = e();
          if (!(ut && (bt * 0.618034 + ht * 7.13) % 1 < ut)) {
            if (m === hn && y && bt % y === 0 && ot) {
              const mt = J * (J < 3.6 ? 1.9 : 1) - 0.25,
                Rt = St + (J < 3.6 ? J * 0.45 : 0),
                $t = 1.15;
              (Te(n.big, S, Rt, it + 0.09, $t / 2, mt, 0.18, $t, _t.SLAB, 0, t),
                Te(
                  o.small,
                  S,
                  Rt,
                  it + 0.7,
                  $t - 0.03,
                  mt,
                  1.05,
                  0.05,
                  _t.RAIL,
                  0,
                  t,
                ),
                Te(
                  o.small,
                  S,
                  Rt - mt / 2 + 0.03,
                  it + 0.7,
                  $t / 2,
                  0.05,
                  1.05,
                  $t,
                  _t.RAIL,
                  0,
                  t,
                ),
                Te(
                  o.small,
                  S,
                  Rt + mt / 2 - 0.03,
                  it + 0.7,
                  $t / 2,
                  0.05,
                  1.05,
                  $t,
                  _t.RAIL,
                  0,
                  t,
                ));
              continue;
            }
            if (Mt < b * xt) {
              const mt = ct * 2 * J + 0.32,
                Rt = (dt - lt) * d + 0.3;
              (Te(
                o.small,
                S,
                St,
                it + (d * (lt + dt)) / 2,
                0.24,
                mt,
                Rt,
                0.48,
                _t.CAGE,
                0,
                t,
              ),
                e() < 0.4 &&
                  Te(
                    n.small,
                    S,
                    St,
                    it + d * lt - 0.02,
                    0.24,
                    mt,
                    0.06,
                    0.48,
                    _t.METAL,
                    0,
                    t,
                  ));
              continue;
            }
            if (Mt < (b + x) * xt) {
              const mt = e() < 0.5 ? -1 : 1,
                Rt =
                  m === hn
                    ? mt *
                      Math.min(ct * J + 0.5, J * 0.5 - 0.5) *
                      (e() < 0.5 ? 1 : 0)
                    : 0;
              Te(
                n.small,
                S,
                St + Rt,
                it + d * (m === hn ? lt : 0.3) - 0.34,
                0.24,
                0.84,
                0.54,
                0.46,
                _t.AC,
                0,
                t,
              );
              continue;
            }
            if (m === hn && Mt < (b + x) * xt + 0.03) {
              const mt = e() < 0.5 ? -1 : 1;
              fi(
                a,
                S,
                St + mt * Math.min(ct * J + 0.5, J * 0.5 - 0.5),
                it + d * 0.62,
                0.2,
                0.42,
                0.1,
                S.nx ? 1 : 2,
                ba.DISH,
                e(),
                t,
              );
            }
          }
        }
      }
      if (ot && P.y0 < 230) {
        const j = Math.max(P.y0 + d * 2, 14),
          it = Math.min(P.y1 - d, 240);
        if (it > j)
          for (let bt = 6 + e() * 24; bt < S.w - 4; bt += 30 + e() * 40) {
            if (e() < 0.58) continue;
            const St = j + e() * (it - j),
              Mt = 0.45;
            Te(n.small, S, bt, St, Mt, 1.1, 0.36, 0.95, _t.LAMP, 0, t);
            const mt = S.ox + S.tx * bt + S.nx * (Mt + 0.3),
              Rt = S.oz + S.tz * bt + S.nz * (Mt + 0.3),
              $t = 0.55 + e() * 0.35,
              Xn = Math.hypot(1 - $t * $t),
              Je = e() < 0.35;
            s.push({
              x: mt,
              y: St - 0.2,
              z: Rt,
              dx: S.nx * Math.sqrt(1 - $t * $t),
              dy: -$t,
              dz: S.nz * Math.sqrt(1 - $t * $t),
              c: Je ? [1, 0.78, 0.5] : [0.86, 0.93, 1],
              i: 1,
              t,
            });
          }
      }
      if (ot && P.y0 < 120 && e() < 0.75) {
        const j = 1 + Math.floor(e() * 3);
        for (let it = 0; it < j; it++) {
          const bt =
            Math.max(P.y0 + d * 2, 10) +
            e() * Math.min(70, P.y1 - P.y0 - d * 4);
          if (bt > P.y1 - 8) continue;
          const St = 3.5 + e() * 7,
            Mt = 3 + e() * (S.w - 6),
            mt = 1.1 + e() * 0.8;
          l.push({
            F: S,
            u: Mt,
            y: bt,
            out: mt / 2 + 0.25,
            sx: 0.28,
            sy: St,
            sz: mt,
            blade: 1,
            slot: Math.floor(e() * Wm),
            t,
          });
        }
      }
      if (i && ot && e() < 0.07 && S.w > 24 && P.y1 - P.y0 > 40) {
        const j = 16 + e() * 18,
          it = Math.min(S.w - 6, j * (0.45 + e() * 0.5)),
          bt = Math.max(P.y0 + j / 2 + 6, 30 + e() * 90);
        if (bt + j / 2 < P.y1 - 4) {
          const St = 3 + it / 2 + e() * (S.w - it - 6);
          i.push({
            F: S,
            u: St,
            y: bt,
            w: it,
            h: j,
            t,
            slot: Math.floor(e() * 16),
            prog: Math.floor(e() * 3),
          });
        }
      }
      if (ot && e() < 0.22 && S.w > 14) {
        const j =
          Math.max(P.y0 + d * 3, 18) + e() * Math.min(110, P.y1 - P.y0 - d * 6);
        if (j < P.y1 - 10) {
          const it = Math.min(S.w - 4, 8 + e() * 10);
          l.push({
            F: S,
            u: S.w / 2 + (e() - 0.5) * (S.w - it - 4),
            y: j,
            out: 0.35,
            sx: it,
            sy: it * 0.32,
            sz: 0.3,
            blade: 0,
            slot: Math.floor(e() * qm),
            t,
          });
        }
      }
    }
  const C = t.segs[t.segs.length - 1],
    E = C.x1 - C.x0,
    R = C.z1 - C.z0,
    G = (C.x0 + C.x1) / 2,
    H = (C.z0 + C.z1) / 2;
  for (let P = 0; P < 4; P++) {
    const q = j0(C, P);
    Te(n.big, q, q.w / 2, h + 0.55, -0.18, q.w, 1.1, 0.36, _t.WALL, 0, t);
  }
  if (
    u &&
    h > 260 &&
    Math.min(E, R) > 24 &&
    e() < 1 &&
    se(t.id, t.blk[0] * 31 + t.blk[1], 4801) < 0.035
  ) {
    const P = 3 + Math.floor(e() * 3),
      q = 0;
    let S = h,
      K = Math.min(E, R) / 2 - 3.5;
    (Ie(n.big, G, S + 1.2, H, 0, K * 2 + 3, 2.4, K * 2 + 3, _t.WALL, 0, t),
      (S += 2.4));
    for (let ot = 0; ot < P; ot++) {
      const xt = 6.5 - ot * 0.6;
      (Ie(n.big, G, S + xt / 2, H, 0, K * 2, xt, K * 2, _t.TEMPLE, 0, t),
        (S += xt));
      const U = K + 2.8,
        J = U * 0.5;
      u.push(G, S, H, 0, U, J, 0, 0, 0, t.seed, t.style, t.H, t.cx, t.cz, 0, 0);
      for (let st = 0; st < 4; st++)
        Ie(
          n.small,
          G + (st < 2 ? -1 : 1) * (U - 0.6),
          S - 0.9,
          H + (st % 2 ? -1 : 1) * (U - 0.6),
          0,
          0.55,
          0.8,
          0.55,
          _t.LANTERN,
          0,
          t,
        );
      ((S += J * 0.62), (K *= 0.72));
    }
    (bl(a, G, S + 5, H, 0.25, 10, 0, ba.MAST, 0, t),
      Ie(n.small, G, S + 10.3, H, 0, 0.6, 0.6, 0.6, _t.RED, 0, t),
      (t.temple = !0));
    return;
  }
  const I = 1 + Math.floor(e() * 4);
  for (let P = 0; P < I; P++) {
    const q = 3 + e() * Math.min(9, E * 0.35),
      S = 3 + e() * Math.min(9, R * 0.35),
      K = 2.5 + e() * 5;
    (Ie(
      n.big,
      G + (e() - 0.5) * (E - q - 4),
      h + K / 2,
      H + (e() - 0.5) * (R - S - 4),
      0,
      q,
      K,
      S,
      e() < 0.5 ? _t.WALL : _t.METAL,
      0,
      t,
    ),
      e() < 0.5 &&
        Ie(
          n.small,
          G + (e() - 0.5) * (E - 6),
          h + 0.6,
          H + (e() - 0.5) * (R - 6),
          (Math.floor(e() * 4) * Math.PI) / 2,
          2.2,
          1.2,
          1.4,
          _t.VENT,
          0,
          t,
        ));
  }
  if (e() < 0.5) {
    const P = 1.5 + e() * 2.2,
      q = 3 + e() * 5,
      S = G + (e() - 0.5) * (E - P * 2 - 4),
      K = H + (e() - 0.5) * (R - P * 2 - 4);
    bl(a, S, h + 1.6 + q / 2, K, P, q, 0, ba.TANK, e(), t);
    for (let ot = 0; ot < 4; ot++)
      Ie(
        n.small,
        S + (ot < 2 ? -1 : 1) * P * 0.6,
        h + 0.8,
        K + (ot % 2 ? -1 : 1) * P * 0.6,
        0,
        0.25,
        1.6,
        0.25,
        _t.METAL,
        0,
        t,
      );
  }
  if (h > 320 || e() < 0.3) {
    const P = 10 + e() * (h > 420 ? 60 : 28),
      q = G + (e() - 0.5) * E * 0.3,
      S = H + (e() - 0.5) * R * 0.3;
    if (
      (bl(a, q, h + P / 2, S, 0.3 + P * 0.006, P, 0, ba.MAST, 0, t),
      Ie(n.small, q, h + P + 0.3, S, 0, 0.7, 0.7, 0.7, _t.RED, 0, t),
      h > 380)
    )
      for (let K = 0; K < 4; K++)
        Ie(
          n.small,
          C.x0 + (K < 2 ? 0.6 : E - 0.6),
          h + 1.4,
          C.z0 + (K % 2 ? 0.6 : R - 0.6),
          0,
          0.6,
          0.6,
          0.6,
          _t.RED,
          0,
          t,
        );
  }
  if (e() < 0.04 && E > 18) {
    const P = 34 + e() * 30,
      q = G + (e() - 0.5) * (E - 10),
      S = H + (e() - 0.5) * (R - 10),
      K = 34 + e() * 22,
      ot = e() * Math.PI * 2,
      xt = Math.cos(ot),
      U = Math.sin(ot),
      J = 1.9;
    (Ie(o.big, q, h + P / 2, S, ot, J, P, J, _t.LATT, 0, t),
      Ie(
        o.big,
        q + xt * K * 0.32,
        h + P + 1,
        S - U * K * 0.32,
        ot,
        K,
        1.8,
        1.6,
        _t.LATT,
        0,
        t,
      ),
      Ie(
        n.big,
        q - xt * 9,
        h + P + 0.6,
        S + U * 9,
        ot,
        4,
        2.4,
        2.2,
        _t.WALL,
        0,
        t,
      ),
      Ie(
        n.big,
        q + xt * 1.6,
        h + P - 1.4,
        S - U * 1.6,
        ot,
        2.2,
        2.2,
        2.2,
        _t.METAL,
        0,
        t,
      ),
      Ie(
        n.small,
        q + xt * (K * 0.82),
        h + P - 0.2,
        S - U * (K * 0.82),
        0,
        0.6,
        0.6,
        0.6,
        _t.RED,
        0,
        t,
      ));
  }
}
const Wm = 16,
  qm = 16,
  gi = [
    "#ff3d8b",
    "#38e4ff",
    "#ffb12e",
    "#ff4436",
    "#46ff9a",
    "#b77bff",
    "#f3f6ff",
    "#ff7a2e",
  ],
  Km = [
    "HOTEL",
    "NOODLE",
    "KARAOKE",
    "PHARMACY",
    "24H",
    "TEA",
    "ARCADE",
    "CLINIC",
    "RAMEN",
    "BAR",
    "DENTIST",
    "CINEMA",
    "LAUNDRY",
    "BOOKS",
    "SUSHI",
    "GOLD",
  ],
  Um = [
    "NOODLE BAR",
    "TEA HOUSE",
    "PAWN & GOLD",
    "KARAOKE 24H",
    "HOTEL STAR",
    "DUMPLINGS",
    "RADIO REPAIR",
    "MAHJONG CLUB",
    "NIGHT MARKET",
    "TAILOR",
    "DAT.CITY",
    "TOKEN TOWN",
    "AI RACE",
    "PHARMACY",
    "CYBER CAFE",
    "OPEN LATE",
  ],
  wl = document.createElement("canvas");
((wl.width = 2048), (wl.height = 1024));
const wa = new f.CanvasTexture(wl);
((wa.colorSpace = f.SRGBColorSpace),
  (wa.anisotropy = 4),
  (wa.generateMipmaps = !0),
  (wa.minFilter = f.LinearMipmapLinearFilter));
function Q0() {
  const t = wl.getContext("2d");
  ((t.fillStyle = "#07080c"), t.fillRect(0, 0, 2048, 1024));
  const e = (n, o, a, s, l, r) => {
    (t.save(),
      t.beginPath(),
      t.rect(n, o, a, s),
      t.clip(),
      (t.fillStyle = "#0b0c12"),
      t.fillRect(n, o, a, s),
      (t.strokeStyle = l),
      (t.lineWidth = 5),
      (t.shadowColor = l),
      (t.shadowBlur = 18),
      t.strokeRect(n + 10, o + 10, a - 20, s - 20),
      (t.fillStyle = l),
      r(),
      (t.shadowBlur = 0),
      t.restore());
  };
  for (let n = 0; n < 16; n++) {
    const o = gi[(n * 3) % 8],
      a = Km[n],
      s = n * 128,
      l = a.length;
    e(s, 0, 128, 512, o, () => {
      const r = Math.min(88, 440 / l);
      ((t.font = `800 ${r}px Outfit, Arial, sans-serif`),
        (t.textAlign = "center"),
        (t.textBaseline = "middle"));
      for (let u = 0; u < l; u++)
        ((t.shadowBlur = 22),
          t.fillText(a[u], s + 64, 256 + (u - (l - 1) / 2) * r * 0.98));
    });
  }
  for (let n = 0; n < 16; n++) {
    const o = gi[(n * 5 + 1) % 8],
      a = Um[n],
      s = (n % 4) * 512,
      l = 512 + Math.floor(n / 4) * 128;
    e(s, l, 512, 128, o, () => {
      let r = 74;
      for (
        t.font = `800 ${r}px Outfit, Arial, sans-serif`;
        t.measureText(a).width > 440 && r > 30;
      )
        ((r -= 4), (t.font = `800 ${r}px Outfit, Arial, sans-serif`));
      ((t.textAlign = "center"),
        (t.textBaseline = "middle"),
        (t.shadowBlur = 24),
        t.fillText(a, s + 256, l + 66));
    });
  }
  wa.needsUpdate = !0;
}
(Q0(), document.fonts?.ready.then(Q0));
const Do = W0(!1),
  Z0 = Ve(wa),
  Ym = ({ alb: t, out: e, nrm: n }) => {
    const { W: o, N: a, L: s, LN: l, S: r, K: u, slot: i } = Do,
      c = vt(a).toVar(),
      m = u.x.toVar(),
      d = w(0.06, 0.065, 0.07).toVar(),
      h = w(0).toVar(),
      y = X(-1).toVar();
    (F(m.greaterThan(0.5).and(at(l.x).greaterThan(0.5)), () => {
      y.assign(X(s.z.mul(oo(l.x)).div(r.z).add(0.5), s.y.div(r.y).add(0.5)));
    }),
      F(m.lessThan(0.5).and(l.z.greaterThan(0.5)), () => {
        y.assign(X(s.x.div(r.x).add(0.5), s.y.div(r.y).add(0.5)));
      }),
      F(y.x.greaterThanEqual(0), () => {
        const T = Y(
            m.greaterThan(0.5),
            X(i.add(y.x).mul(0.0625), y.y.mul(0.5).add(0.5)),
            X(
              js(i, 4).add(y.x).mul(0.25),
              k(3)
                .sub(Jt(i.div(4)))
                .add(y.y)
                .mul(0.125),
            ),
          ),
          A = Z0.sample(T).rgb,
          g = Y(
            rt(i.mul(0.37).add(u.y.mul(3))).greaterThan(0.86),
            pt(
              0.25,
              rt(p.uTime.mul(1.7).add(u.y.mul(9))).add(
                ae(p.uTime.mul(23)).mul(0.2),
              ),
            ),
            k(1),
          );
        (h.assign(A.mul(A).mul(p.uNeonK).mul(7).mul(g)), d.assign(w(0.02)));
      }));
    const x = An(o, c, k(1)),
      b = d.mul(x.amb.add(x.dir)).add(h).toVar(),
      V = on(d.mul(x.amb), b).toVar();
    (F(p.uBlue.greaterThan(0.001), () => {
      b.assign(B(b, h.mul(0.15).add(w(0.006, 0.012, 0.03)), p.uBlue));
    }),
      t.assign(d),
      n.assign(c),
      e.assign(nt(b, V)));
  },
  J0 = Se({ position: Do.position, shade: Ym }),
  $m = ({ alb: t, out: e, nrm: n }) => {
    const { W: o, N: a, L: s, LN: l, S: r, K: u, slot: i } = Do,
      c = vt(a).toVar(),
      m = u.x.toVar(),
      d = w(0.03).toVar(),
      h = w(0).toVar();
    F(l.z.greaterThan(0.5), () => {
      const V = X(s.x.div(r.x).add(0.5), s.y.div(r.y).add(0.5)).toVar(),
        T = p.uTime.add(u.y.mul(40)).toVar(),
        A = w(0).toVar();
      F(m.lessThan(0.5), () => {
        const M = X(
            js(i, 4)
              .add(Q(V.y.sub(0.5).mul(r.y).div(r.x).negate().add(0.5), 0, 1))
              .mul(0.25),
            k(3)
              .sub(Jt(i.div(4)))
              .add(Q(V.x, 0, 1))
              .mul(0.125),
          ),
          L = Z0.sample(M).rgb;
        (A.assign(
          B(w(0.25, 0.02, 0.35), w(0.02, 0.1, 0.4), V.y).add(L.mul(L).mul(2.5)),
        ),
          A.addAssign(
            w(1, 0.6, 1)
              .mul(_(0.08, 0, at(rt(V.y.mul(0.5).sub(T.mul(0.12))).sub(0.5))))
              .mul(0.6),
          ));
      })
        .ElseIf(m.lessThan(1.5), () => {
          const M = oe(V.sub(0.5).mul(X(r.x.div(r.y), 1))).toVar();
          (A.assign(
            B(
              w(0, 0.5, 0.9),
              w(0.9, 0.1, 0.6),
              ae(M.mul(24).sub(T.mul(2.2)))
                .mul(0.5)
                .add(0.5),
            ),
          ),
            A.mulAssign(_(0.5, 0.1, M).mul(0.6).add(0.4)));
        })
        .Else(() => {
          const M = Jt(V.x.mul(14)),
            L = jt(X(M.mul(1.7), T.mul(2)))
              .mul(0.55)
              .add(0.35);
          (A.assign(
            B(w(1, 0.45, 0.1), w(1, 0.15, 0.35), V.y)
              .mul(pt(V.y, L))
              .mul(pt(0.12, rt(V.x.mul(14))))
              .mul(pt(0.25, rt(V.y.mul(30)))),
          ),
            A.addAssign(w(0.05, 0.02, 0.08)));
        });
      const g = qt(qt(V.x, V.x.oneMinus()), qt(V.y, V.y.oneMinus()));
      (A.mulAssign(_(0, 0.02, g)),
        h.assign(
          A.mul(p.uNeonK)
            .mul(2.6)
            .mul(
              pt(0.5, rt(no.y.mul(0.5)))
                .mul(0.15)
                .add(0.85),
            ),
        ),
        d.assign(w(0.01)));
    });
    const y = An(o, c, k(1)),
      x = d.mul(y.amb.add(y.dir)).add(h).toVar(),
      b = on(d.mul(y.amb), x).toVar();
    (F(p.uBlue.greaterThan(0.001), () => {
      x.assign(B(x, h.mul(0.12).add(w(0.006, 0.012, 0.03)), p.uBlue));
    }),
      t.assign(d),
      n.assign(c),
      e.assign(nt(x, b)));
  },
  tc = Se({ position: Do.position, shade: $m }),
  ec = "https://sael.net",
  nc = 0.024,
  Ml = document.createElement("canvas");
((Ml.width = 1536), (Ml.height = 1152));
const Ma = new f.CanvasTexture(Ml);
((Ma.colorSpace = f.SRGBColorSpace),
  (Ma.anisotropy = 8),
  (Ma.generateMipmaps = !0),
  (Ma.minFilter = f.LinearMipmapLinearFilter));
const jm = new Path2D(
  "M18.9 1.2h3.7l-8 9.1L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.5-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.4h2L6.5 3.3H4.3l13.3 17.3Z",
);
function oc() {
  const t = Ml.getContext("2d"),
    e = 1536;
  t.clearRect(0, 0, e, 1152);
  const n = (a, s, l) => {
      (t.save(),
        (t.lineJoin = "round"),
        (t.lineCap = "round"),
        (t.strokeStyle = s),
        (t.shadowColor = s),
        (t.shadowBlur = l * 3),
        (t.globalAlpha = 0.5),
        (t.lineWidth = l * 2),
        a(),
        (t.globalAlpha = 1),
        (t.shadowBlur = l),
        (t.lineWidth = l),
        a(),
        (t.shadowBlur = 0),
        (t.strokeStyle = "#fff"),
        (t.globalAlpha = 0.85),
        (t.lineWidth = l * 0.32),
        a(),
        t.restore());
    },
    o = (a, s, l, r, u, i, c) => () => {
      let m = r;
      for (
        t.letterSpacing = i + "px",
          t.font = `${u} ${m}px Outfit, Arial, sans-serif`;
        t.measureText(a).width > c && m > 40;
      )
        ((m -= 6), (t.font = `${u} ${m}px Outfit, Arial, sans-serif`));
      ((t.textAlign = "center"),
        (t.textBaseline = "middle"),
        t.strokeText(a, s, l));
    };
  ((t.fillStyle = "#06070c"),
    t.fillRect(0, 0, e, 768),
    n(
      () => {
        (t.beginPath(), t.roundRect(28, 28, e - 56, 712, 42), t.stroke());
      },
      "#ff3d8b",
      9,
    ),
    n(o("FOLLOW", e / 2, 172, 118, 700, 24, e - 300), "#38e4ff", 7),
    n(o("RYANSAEL", e / 2, 384, 250, 800, 12, e - 170), "#ff3d8b", 11),
    n(o("ON", e / 2 - 86, 600, 118, 700, 14, 400), "#38e4ff", 7),
    n(
      () => {
        (t.save(),
          t.translate(e / 2 + 18, 544),
          t.scale(112 / 24, 112 / 24),
          (t.lineWidth /= 112 / 24),
          t.stroke(jm),
          t.restore());
      },
      "#f3f6ff",
      6,
    ),
    (t.fillStyle = "#08060a"),
    t.fillRect(0, 768, e, 384),
    n(
      () => {
        (t.beginPath(), t.roundRect(24, 792, e - 48, 336, 36), t.stroke());
      },
      "#ff8a2e",
      8,
    ),
    n(o("SAEL.NET", e / 2, 962, 236, 800, 22, e - 180), "#ffb12e", 12),
    (Ma.needsUpdate = !0));
}
(oc(), document.fonts?.ready.then(oc));
const Xm = Ve(Ma),
  Ta = [
    ["token-town", "Token Town", "ai-mall"],
    ["airace", "AI Race", "airace", "https://airace.lol", "airace.lol"],
    ["model-monsters", "Model Monsters"],
    ["final-boss", "The Final Boss"],
    ["ai-museum", "Model Museum"],
    ["ai-office", "The AI Office"],
    ["benchmark-mountain", "Benchmark Mountain"],
    ["plane-of-focus", "The Plane of Focus"],
    ["data-center", "Inside an AI Data Center"],
    ["token-factory", "Token Factory"],
    ["dat-city", "dat.city", "dat-city", "https://dat.city", "dat.city"],
    ["paris-inception", "Inception's Paris"],
  ].map(([t, e, n = t, o = ec + "/" + t, a = "sael.net/" + t]) => ({
    slug: t,
    title: e,
    dir: n,
    url: o,
    shown: a,
    img: null,
  })),
  Ye = 512,
  Be = 320,
  va = 4,
  ac = 1024,
  Tl = document.createElement("canvas");
((Tl.width = Ye * va), (Tl.height = ac));
const Aa = new f.CanvasTexture(Tl);
((Aa.colorSpace = f.SRGBColorSpace),
  (Aa.anisotropy = 8),
  (Aa.generateMipmaps = !0),
  (Aa.minFilter = f.LinearMipmapLinearFilter));
const sc = ["#38e4ff", "#ff3d8b", "#ffb12e", "#9b7bff", "#5fffb0", "#ff6a4a"];
function pi(t) {
  const e = Tl.getContext("2d"),
    n = Ta[t],
    o = (t % va) * Ye,
    a = Math.floor(t / va) * Be,
    s = sc[t % sc.length];
  if ((e.save(), e.beginPath(), e.rect(o, a, Ye, Be), e.clip(), n.img)) {
    const i = Math.max(Ye / n.img.naturalWidth, Be / n.img.naturalHeight),
      c = n.img.naturalWidth * i,
      m = n.img.naturalHeight * i;
    e.drawImage(n.img, o + (Ye - c) / 2, a + (Be - m) / 2, c, m);
  } else {
    const i = e.createLinearGradient(o, a, o + Ye, a + Be);
    (i.addColorStop(0, "#10142a"),
      i.addColorStop(1, "#04060c"),
      (e.fillStyle = i),
      e.fillRect(o, a, Ye, Be));
    const c = e.createRadialGradient(
      o + Ye * 0.72,
      a + Be * 0.3,
      10,
      o + Ye * 0.72,
      a + Be * 0.3,
      Ye * 0.6,
    );
    (c.addColorStop(0, s + "88"),
      c.addColorStop(1, s + "00"),
      (e.fillStyle = c),
      e.fillRect(o, a, Ye, Be));
  }
  const l = e.createLinearGradient(0, a + Be * 0.42, 0, a + Be);
  (l.addColorStop(0, "#05070d00"),
    l.addColorStop(1, "#05070de6"),
    (e.fillStyle = l),
    e.fillRect(o, a, Ye, Be));
  let r = 50;
  const u = n.title.toUpperCase();
  ((e.textAlign = "left"),
    (e.textBaseline = "alphabetic"),
    "letterSpacing" in e && (e.letterSpacing = "1px"));
  do e.font = `800 ${r}px Outfit, Arial, sans-serif`;
  while (e.measureText(u).width > Ye - 60 && (r -= 3) > 24);
  ((e.fillStyle = "#ffffff"),
    (e.shadowColor = "#000c"),
    (e.shadowBlur = 12),
    e.fillText(u, o + 30, a + Be - 62),
    (e.shadowBlur = 0),
    "letterSpacing" in e && (e.letterSpacing = "0px"),
    (e.font = '500 21px "DM Mono", ui-monospace, monospace'),
    (e.fillStyle = s),
    e.fillText(n.shown, o + 31, a + Be - 28),
    (e.strokeStyle = s),
    (e.lineWidth = 5),
    (e.shadowColor = s),
    (e.shadowBlur = 14),
    e.beginPath(),
    e.roundRect(o + 7, a + 7, Ye - 14, Be - 14, 14),
    e.stroke(),
    e.restore(),
    (Aa.needsUpdate = !0));
}
const Qm = /(^|\.)sael\.net$/.test(location.hostname);
(Ta.forEach((t, e) => {
  pi(e);
  const n = new Image();
  ((n.decoding = "async"),
    (n.onload = () => {
      ((t.img = n), pi(e));
    }),
    (n.src = Qm
      ? "/p/" + t.slug + "/poster.webp"
      : "../" + t.dir + "/poster.webp"));
}),
  document.fonts?.ready.then(() => Ta.forEach((t, e) => pi(e))));
const Zm = Ve(Aa),
  Jm = ({ alb: t, out: e, nrm: n }) => {
    const { W: o, N: a, L: s, LN: l, S: r, slot: u, C: i } = Do,
      c = vt(a).toVar(),
      m = u.toVar(),
      d = rt(i.x.mul(0.0137).add(i.z.mul(0.0291)).add(i.y.mul(0.0073))).toVar(),
      h = w(0.03).toVar(),
      y = w(0).toVar();
    F(l.z.greaterThan(0.5), () => {
      const T = X(s.x.div(r.x).add(0.5), s.y.div(r.y).add(0.5)).toVar(),
        A = $d(i, p.uHotC).lessThan(1);
      (F(m.lessThan(1.5), () => {
        const g = Y(
            m.lessThan(0.5),
            X(T.x, T.y.mul(0.66667).add(0.33333)),
            X(T.x, T.y.mul(0.33333)),
          ),
          M = Xm.sample(g).rgb,
          L = Y(
            A.not().and(rt(d.mul(7.3)).greaterThan(0.55)),
            pt(
              0.08,
              rt(p.uTime.mul(0.31).add(d.mul(11))).add(
                ae(p.uTime.mul(29).add(d.mul(40))).mul(0.18),
              ),
            ),
            k(1),
          );
        y.assign(
          M.mul(M)
            .mul(p.uNeonK)
            .mul(
              ae(p.uTime.mul(1.6).add(d.mul(9)))
                .mul(0.5)
                .add(4.6),
            )
            .mul(L)
            .mul(Y(A, k(1.75), k(1))),
        );
      }).Else(() => {
        const g = m.sub(2),
          M = X(
            js(g, va)
              .add(Q(T.x, 0.002, 0.998))
              .div(va),
            k(1).sub(
              Jt(g.div(va))
                .add(Q(T.y, 0.002, 0.998).oneMinus())
                .mul(Be / ac),
            ),
          );
        y.assign(
          Zm.sample(M)
            .rgb.mul(p.uNeonK)
            .mul(2.3)
            .mul(Y(A, k(1.45), k(1)))
            .mul(
              pt(0.5, rt(no.y.mul(0.5)))
                .mul(0.12)
                .add(0.88),
            ),
        );
      }),
        h.assign(w(0.012)));
    });
    const x = An(o, c, k(1)),
      b = h.mul(x.amb.add(x.dir)).add(y).toVar(),
      V = on(h.mul(x.amb), b).toVar();
    (F(p.uBlue.greaterThan(0.001), () => {
      b.assign(B(b, y.mul(0.12).add(w(0.006, 0.012, 0.03)), p.uBlue));
    }),
      t.assign(h),
      n.assign(c),
      e.assign(nt(b, V)));
  },
  lc = Se({ position: Do.position, shade: Jm }),
  rc = (() => {
    const t = new f.CylinderGeometry(0, 1, 1, 18, 6, !0);
    return (t.translate(0, -0.5, 0), t.deleteAttribute("uv"), t);
  })(),
  ic = 2400,
  Qe = new Float32Array(ic * 12),
  _o = new f.InstancedInterleavedBuffer(Qe, 12);
_o.setUsage(f.DynamicDrawUsage);
const Gn = new f.InstancedBufferGeometry();
((Gn.index = rc.index),
  Gn.setAttribute("position", rc.attributes.position),
  Gn.setAttribute("iA", new f.InterleavedBufferAttribute(_o, 4, 0)),
  Gn.setAttribute("iB", new f.InterleavedBufferAttribute(_o, 4, 4)),
  Gn.setAttribute("iC", new f.InterleavedBufferAttribute(_o, 4, 8)),
  (Gn.instanceCount = 0),
  (Gn.boundingSphere = new f.Sphere(new f.Vector3(), 1e5)));
const tf = { uBeamK: p.uBeamK },
  vl = Et("iA", "vec4"),
  uc = Et("iB", "vec4"),
  ef = Et("iC", "vec4"),
  cc = (() => {
    const t = vt(uc.xyz),
      e = Y(at(t.y).greaterThan(0.95), w(1, 0, 0), w(0, 1, 0)),
      n = vt(Ao(e, t)),
      o = Ao(t, n),
      a = ce.y.negate(),
      s = n.mul(ce.x).add(o.mul(ce.z)),
      l = vl.xyz.add(t.mul(a).mul(vl.w)).add(s.mul(uc.w));
    return {
      position: l,
      T: kt(a),
      WP: kt(l),
      R: kt(vt(s.add(1e-5))),
      C: kt(ef.mul(p.uGrowOn.oneMinus())),
      seed: kt(rt(vl.x.mul(0.13).add(vl.z.mul(0.71)))),
    };
  })(),
  nf = li(
    cc.position,
    At(() => {
      const { T: t, WP: e, R: n, C: o, seed: a } = cc,
        s = Q(ai(kr).sub(si(e)).div(5), 0, 1).toVar();
      F(s.lessThanEqual(0), () => {
        ns();
      });
      const l = vt(e.sub(de)).toVar(),
        r = Ft(at(gt(n, l)), 1.7),
        u = oe(e.sub(de)).toVar(),
        i = Kt(ds(de, l, u).negate()),
        c = _(0, 0.06, t).mul(Ft(Z(t.oneMinus(), 0), 1.6)),
        m = jt(X(t.mul(6).sub(p.uTime.mul(0.6)), a.mul(40).add(gt(n, w(3)))))
          .mul(0.25)
          .add(0.75);
      return nt(
        o.rgb
          .mul(o.a)
          .mul(r)
          .mul(c)
          .mul(m)
          .mul(s)
          .mul(i)
          .mul(p.uBeamK)
          .mul(_(4, 18, u))
          .mul(B(1, 0.25, _(40, 220, e.y).mul(p.uNightK.oneMinus())))
          .mul(p.uBlue.oneMinus()),
        1,
      );
    })(),
  ),
  dc = new f.Mesh(Gn, nf);
((dc.frustumCulled = !1), Gr.add(dc));
function of() {
  let t = 0;
  for (const e of Hn)
    for (const n of e.detail.lamps) {
      if (t >= ic) break;
      if (n.omni) continue;
      const o = t * 12,
        a = 46 + ((((n.x * 7.3 + n.z * 3.1) % 1) + 1) % 1) * 40;
      ((Qe[o] = n.x),
        (Qe[o + 1] = n.y),
        (Qe[o + 2] = n.z),
        (Qe[o + 3] = a),
        (Qe[o + 4] = n.dx),
        (Qe[o + 5] = n.dy),
        (Qe[o + 6] = n.dz),
        (Qe[o + 7] = a * 0.24),
        (Qe[o + 8] = n.c[0]),
        (Qe[o + 9] = n.c[1]),
        (Qe[o + 10] = n.c[2]),
        (Qe[o + 11] = 0.16),
        t++);
    }
  ((Gn.instanceCount = t),
    _o.clearUpdateRanges(),
    _o.addUpdateRange(0, t * 12),
    (_o.needsUpdate = !0));
}
const af = (() => {
    const t = [
      new f.Vector2(0, -0.06),
      new f.Vector2(0.96, -0.06),
      new f.Vector2(1, 0),
    ];
    for (let n = 1; n <= 10; n++) {
      const o = 1 - (n / 10) * 0.93;
      t.push(new f.Vector2(o, Math.pow(1 - o, 1.7)));
    }
    t.push(new f.Vector2(0, Math.pow(0.93, 1.7) + 0.02));
    let e = new f.LatheGeometry(t, 4).rotateY(Math.PI / 4).toNonIndexed();
    return (
      e.scale(Math.SQRT2, 1, Math.SQRT2),
      e.deleteAttribute("uv"),
      e.computeVertexNormals(),
      e
    );
  })(),
  sf = Et("iP", "vec4"),
  yi = Et("iS", "vec4"),
  mc = Et("iR", "vec4"),
  lf = Et("iT", "vec4"),
  xi = (() => {
    const t = (e) =>
      ce
        .mul(w(yi.x, yi.y, yi.x))
        .add(sf.xyz)
        .sub(w(0, Po(lf.xy, mc.y, mc.w, e), 0));
    return {
      position: At(() => (eo.assign(t(p.uGrowTP)), t(p.uGrowT)))(),
      W: kt(t(p.uGrowT)),
    };
  })(),
  fc = Se({
    position: xi.position,
    shade: ({ alb: t, out: e, nrm: n }) => {
      const o = xi.W,
        a = vt(to).toVar(),
        s = Y(
          a.y.lessThan(-0.2),
          w(0.35, 0.08, 0.05),
          w(0.2, 0.1, 0.07).mul(
            pt(0.5, rt(ce.y.mul(14)))
              .mul(0.25)
              .add(0.75),
          ),
        ).toVar(),
        l = An(o, a, k(1)),
        r = s.mul(l.amb.add(l.dir)).toVar(),
        u = on(s.mul(l.amb), r).toVar();
      (F(p.uBlue.greaterThan(0.001), () => {
        r.assign(
          B(
            r,
            w(0.006, 0.012, 0.03).add(
              w(0.15, 0.75, 1)
                .mul(0.3)
                .mul(Ft(at(a.y).oneMinus(), 2)),
            ),
            p.uBlue,
          ),
        );
      }),
        t.assign(s),
        n.assign(a),
        e.assign(nt(r, u)));
    },
  }),
  hc = (() => {
    const t = new f.CylinderGeometry(1, 1, 1, 4, 1, !0);
    return (t.translate(0, 0.5, 0), t.deleteAttribute("uv"), t);
  })(),
  bi = Et("iA", "vec4"),
  rf = Et("iB", "vec4"),
  wi = (() => {
    const t = rf.xyz.sub(bi.xyz),
      e = oe(t),
      n = t.div(Z(e, 1e-4)),
      o = Y(at(n.y).greaterThan(0.9), w(1, 0, 0), w(0, 1, 0)),
      a = vt(Ao(o, n)),
      s = Ao(n, a),
      l = a.mul(ce.x).add(s.mul(ce.z)),
      r = Y(
        p.uGrowOn.greaterThan(0.5),
        w(0, -9999, 0),
        bi.xyz.add(n.mul(ce.y).mul(e)).add(l.mul(bi.w)),
      );
    return { position: At(() => (eo.assign(r), r))(), W: kt(r), N: kt(vt(l)) };
  })(),
  uf = Se({
    position: wi.position,
    shade: ({ alb: t, out: e, nrm: n }) => {
      const o = vt(wi.N).toVar(),
        a = An(wi.W, o, k(1)),
        s = w(0.03, 0.03, 0.032).mul(a.amb.add(a.dir)).toVar(),
        l = on(a.amb, a.amb.add(a.dir)).toVar();
      (F(p.uBlue.greaterThan(0.001), () => {
        s.assign(B(s, w(0.04, 0.18, 0.25), p.uBlue));
      }),
        t.assign(w(0.03, 0.03, 0.032)),
        n.assign(o),
        e.assign(nt(s, l)));
    },
  });
function cf(t, e) {
  const n = new f.InstancedInterleavedBuffer(new Float32Array(t), 8),
    o = new f.InstancedBufferGeometry();
  return (
    (o.index = hc.index.clone()),
    o.setAttribute("position", hc.attributes.position.clone()),
    o.setAttribute("iA", new f.InterleavedBufferAttribute(n, 4, 0)),
    o.setAttribute("iB", new f.InterleavedBufferAttribute(n, 4, 4)),
    (o.instanceCount = t.length / 8),
    (o.boundingSphere = e.sphere),
    o
  );
}
const Hn = new Set(),
  Al = Math.ceil(Hr / It) + 1;
function gc(t, e, n, o) {
  const a = new f.InstancedInterleavedBuffer(new Float32Array(t), 16),
    s = new f.InstancedBufferGeometry();
  return (
    e.index && (s.index = e.index.clone()),
    s.setAttribute("position", e.attributes.position.clone()),
    s.setAttribute("normal", e.attributes.normal.clone()),
    s.setAttribute("iP", new f.InterleavedBufferAttribute(a, 4, 0)),
    s.setAttribute("iS", new f.InterleavedBufferAttribute(a, 4, 4)),
    s.setAttribute("iR", new f.InterleavedBufferAttribute(a, 4, 8)),
    s.setAttribute("iT", new f.InterleavedBufferAttribute(a, 4, 12)),
    (s.instanceCount = t.length / 16),
    (s.userData = { nAll: t.length / 16, nBig: n }),
    (s.boundingSphere = o.sphere),
    s
  );
}
function df(t) {
  const e = Fr(t.i, t.j, 5),
    n = { big: [], small: [] },
    o = { big: [], small: [] },
    a = [],
    s = [],
    l = [],
    r = [],
    u = [],
    i = [],
    c = [];
  let m = 0;
  for (const g of t.towers)
    (Om(g, e, n, o, a, s, l, r, u, i, c), (m = Math.max(m, g.H + 60)));
  const d = (t.x0 + t.x1) / 2,
    h = (t.z0 + t.z1) / 2;
  t.sphere = new f.Sphere(
    new f.Vector3(d, m / 2 + 30, h),
    Math.hypot((t.x1 - t.x0) / 2 + 12, m / 2 + 90, (t.z1 - t.z0) / 2 + 12),
  );
  const y = [],
    x = (g, M, L, C) => {
      if (!g.length) return null;
      const E = new f.Mesh(gc(g, C, M, t), L);
      return ((E.frustumCulled = !0), ze.add(E), y.push(E), E);
    },
    b = [];
  for (const g of i) {
    const M = g.F,
      L = M.ox + M.tx * g.u + M.nx * 0.45,
      C = M.oz + M.tz * g.u + M.nz * 0.45;
    b.push(
      L,
      g.y,
      C,
      M.yaw,
      g.w,
      g.h,
      0.6,
      g.prog,
      g.slot,
      g.t.seed,
      g.t.style,
      g.t.H,
      g.t.cx,
      g.t.cz,
      0,
      0,
    );
    const E = [
      [0.9, 0.3, 1],
      [0.3, 0.8, 1],
      [1, 0.5, 0.25],
    ][g.prog];
    s.push({
      x: L + M.nx * 10,
      y: g.y,
      z: C + M.nz * 10,
      dx: 0,
      dy: -1,
      dz: 0,
      c: E,
      i: 1,
      omni: 1,
      r: 42,
      k: 2.2,
      t: g.t,
    });
  }
  const V = [];
  for (const g of l) {
    const M = g.F;
    if (
      (V.push(
        M.ox + M.tx * g.u + M.nx * g.out,
        g.y,
        M.oz + M.tz * g.u + M.nz * g.out,
        M.yaw,
        g.sx,
        g.sy,
        g.sz,
        g.blade,
        g.slot,
        g.t.seed,
        g.t.style,
        g.t.H,
        g.t.cx,
        g.t.cz,
        0,
        0,
      ),
      g.blade)
    ) {
      const L = new f.Color(gi[(g.slot * 3) % 8]).convertSRGBToLinear();
      s.push({
        x: M.ox + M.tx * g.u + M.nx * (g.out + 1.6),
        y: g.y,
        z: M.oz + M.tz * g.u + M.nz * (g.out + 1.6),
        dx: 0,
        dy: -1,
        dz: 0,
        c: [L.r, L.g, L.b],
        i: 0.55,
        omni: 1,
        t: g.t,
      });
    }
  }
  const T = [],
    A = [];
  for (const g of c) {
    const M = g.F,
      L = 0.5,
      C = 0.36 + L / 2,
      E = M.ox + M.tx * g.u + M.nx * C,
      R = M.oz + M.tz * g.u + M.nz * C;
    (T.push(
      E,
      g.y,
      R,
      M.yaw,
      g.w,
      g.h,
      L,
      g.kind,
      g.kind,
      g.t.seed,
      g.t.style,
      g.t.H,
      g.t.cx,
      g.t.cz,
      0,
      0,
    ),
      Ie(
        n.big,
        M.ox + M.tx * g.u + M.nx * 0.2,
        g.y,
        M.oz + M.tz * g.u + M.nz * 0.2,
        M.yaw,
        g.w + 1.4,
        g.h + 1.4,
        0.4,
        _t.DARK,
        0,
        g.t,
      ));
    const G = Ta[g.kind - 2];
    (A.push({
      x: E + M.nx * (L / 2 + 0.01),
      y: g.y,
      z: R + M.nz * (L / 2 + 0.01),
      cx: E,
      cy: g.y,
      cz: R,
      nx: M.nx,
      nz: M.nz,
      tx: M.tx,
      tz: M.tz,
      w: g.w,
      h: g.h,
      kind: g.kind,
      url: G ? G.url : g.kind ? ec : Br,
      name: G ? G.title : g.kind ? "sael.net" : "Ryan Sael on X",
      sub: G ? G.shown : g.kind ? null : "@RYANSAEL",
    }),
      s.push({
        x: E + M.nx * 12,
        y: g.y,
        z: R + M.nz * 12,
        dx: 0,
        dy: -1,
        dz: 0,
        c: G ? [0.55, 0.7, 1] : g.kind ? [1, 0.6, 0.25] : [0.85, 0.35, 1],
        i: G ? 0.9 : 1.15,
        omni: 1,
        r: 48,
        k: 2.6,
        t: g.t,
      }));
  }
  ((t.detail = {
    meshes: y,
    twins: null,
    boards: A,
    lamps: s,
    board: x(T, T.length / 16, lc, _n),
    trim: x(n.big.concat(n.small), n.big.length / 16, U0, _n),
    cut: x(o.big.concat(o.small), o.big.length / 16, Gm, _n),
    cyl: x(a, a.length / 16, Y0, $0),
    sign: x(V, V.length / 16, J0, _n),
    screen: x(b, b.length / 16, tc, _n),
    roof: u.length
      ? (() => {
          const g = gc(u, af, u.length / 16, t),
            M = new f.Mesh(g, fc);
          return (ze.add(M), y.push(M), M);
        })()
      : null,
    wire: r.length
      ? (() => {
          const g = new f.Mesh(cf(r, t), uf);
          return (ze.add(g), y.push(g), g);
        })()
      : null,
    n:
      (n.big.length +
        n.small.length +
        o.big.length +
        o.small.length +
        a.length +
        V.length) /
      16,
  }),
    (t.detail.twins = [
      t.detail.trim,
      t.detail.cyl,
      t.detail.sign,
      t.detail.screen,
      t.detail.roof,
      t.detail.board,
    ]
      .filter(Boolean)
      .map(zi)),
    Hn.add(t));
}
function Mi(t) {
  if (t.detail) {
    for (const e of t.detail.twins || []) Ms.remove(e);
    for (const e of t.detail.meshes) (ze.remove(e), e.geometry.dispose());
    ((t.detail = null), Hn.delete(t));
  }
}
const Ti = (t, e, n) =>
  Math.hypot(Math.max(t.x0 - e, 0, e - t.x1), Math.max(t.z0 - n, 0, n - t.z1));
function mf(t) {
  const e = et.position.x,
    n = et.position.z,
    o = Math.floor(e / It),
    a = Math.floor(n / It),
    s = performance.now();
  let l = !1;
  for (const u of [...Hn]) Ti(u, e, n) > Hr + 160 && (Mi(u), (l = !0));
  const r = [];
  for (let u = -Al; u <= Al; u++)
    for (let i = -Al; i <= Al; i++) {
      const c = Rn(o + u, a + i),
        m = Ti(c, e, n);
      m < Hr && !c.detail && r.push([m, c]);
    }
  r.sort((u, i) => u[0] - i[0]);
  for (const [, u] of r) {
    if (performance.now() - s > t) break;
    (df(u), (l = !0));
  }
  for (const u of Hn) {
    const i = Ti(u, e, n),
      c = u.detail;
    (c.trim &&
      (c.trim.geometry.instanceCount =
        i < 380 * D.detail
          ? c.trim.geometry.userData.nAll
          : c.trim.geometry.userData.nBig),
      c.cut &&
        (c.cut.geometry.instanceCount =
          i < 300 * D.detail
            ? c.cut.geometry.userData.nAll
            : c.cut.geometry.userData.nBig));
  }
  l && of();
}
const Va = Math.ceil(al / It) + 1,
  vi = [];
for (let t = -Va; t <= Va; t++)
  for (let e = -Va; e <= Va; e++) {
    const n = Math.max(0, Math.hypot(t, e) - 1) * It;
    n <= al && vi.push([t, e, n]);
  }
vi.sort((t, e) => t[2] - e[2]);
const me = {
  ci: 1e9,
  cj: 1e9,
  boxes: 0,
  towers: 0,
  rooms: 0,
  lit: 0,
  list: [],
  builtIn: 0,
};
function pc(t, e, n) {
  const o = t * 4;
  ((gs[o] = (e.x0 + e.x1) * 0.5),
    (gs[o + 1] = (e.y0 + e.y1) * 0.5),
    (gs[o + 2] = (e.z0 + e.z1) * 0.5),
    (gs[o + 3] = n.seed),
    (ps[o] = e.x1 - e.x0),
    (ps[o + 1] = e.y1 - e.y0),
    (ps[o + 2] = e.z1 - e.z0),
    (ps[o + 3] = n.style),
    (ys[o] = n.fh),
    (ys[o + 1] = n.bay),
    (ys[o + 2] = n.H),
    (ys[o + 3] = n.lit),
    (hl[o] = n.cx),
    (hl[o + 1] = n.cz),
    (hl[o + 2] = e.v || 0));
}
function ff(t, e) {
  const n = performance.now();
  let o = 0,
    a = 0,
    s = 0,
    l = 0;
  me.list.length = 0;
  const r = [];
  for (const [u, i] of vi) {
    const c = Rn(t + u, e + i);
    for (const m of c.towers) {
      if (m.ghost) continue;
      (a++, me.list.push(m));
      const d = 2 * (m.x1 - m.x0 + (m.z1 - m.z0)),
        h = (d / m.bay) * (m.H / m.fh) * (m.style === ao ? 0.32 : 0.93);
      if (
        ((m.rooms = h),
        (s += h),
        (l += h * Math.min(1, wt.litK * m.lit)),
        m.para)
      ) {
        r.push(m);
        continue;
      }
      for (const y of m.segs) o < xa && pc(o++, y, m);
      for (const y of m.pods) o < xa && pc(o++, y, m);
    }
  }
  (Nm(r), (an.instanceCount = o));
  for (const u of ["iA", "iB", "iC", "iD"]) {
    const i = an.attributes[u];
    (i.clearUpdateRanges(), i.addUpdateRange(0, o * 4), (i.needsUpdate = !0));
  }
  if (
    (Object.assign(me, {
      ci: t,
      cj: e,
      boxes: o,
      towers: a,
      rooms: s,
      lit: l,
      litAt: wt.litK,
      builtIn: performance.now() - n,
    }),
    zo.size > 2600)
  )
    for (const [u, i] of zo)
      (Math.abs(i.i - t) > Va + 3 || Math.abs(i.j - e) > Va + 3) &&
        (Mi(i), zo.delete(u));
  ((za = !0), (ws = !0));
}
let za = !0,
  ws = !0;
const yc =
    zt.coordinateSystem === f.WebGPUCoordinateSystem ? [1, 0] : [0.5, 0.5],
  hf = new f.Matrix4().set(
    0.5,
    0,
    0,
    0.5,
    0,
    0.5,
    0,
    0.5,
    0,
    0,
    yc[0],
    yc[1],
    0,
    0,
    0,
    1,
  ),
  xc = (t, e) =>
    t.copy(hf).multiply(e.projectionMatrix).multiply(e.matrixWorldInverse),
  Fe = new f.OrthographicCamera(-1, 1, 1, -1, 50, 7e3),
  Ai = new f.Scene();
Fe.coordinateSystem = zt.coordinateSystem;
const bc = Io(ui());
{
  const t = new f.Mesh(an, bc);
  ((t.frustumCulled = !1), Ai.add(t));
}
const Vn = { c: new f.Vector3(1e9, 0, 0), R: 1e3 },
  ln = new f.Vector3();
function gf() {
  const t = et.position;
  (ln.set(0, 0, -1).applyQuaternion(et.quaternion), (ln.y = 0), ln.normalize());
  const e = t.x + ln.x * 360,
    n = t.z + ln.z * 360;
  if (!za && Math.hypot(e - Vn.c.x, n - Vn.c.z) < 200) return;
  za = !1;
  const o = p.uSunDir.value;
  (Vn.c.set(e, 0, n),
    Fe.position.copy(Vn.c).addScaledVector(o, 3200),
    Fe.up.set(0, 1, 0),
    Fe.lookAt(Vn.c),
    Fe.updateMatrixWorld());
  const a = (2 * Vn.R) / us.width,
    s = ue.setFromMatrixColumn(Fe.matrixWorld, 0),
    l = Ql.setFromMatrixColumn(Fe.matrixWorld, 1),
    r = Fe.position.dot(s),
    u = Fe.position.dot(l);
  (Fe.position
    .addScaledVector(s, Math.round(r / a) * a - r)
    .addScaledVector(l, Math.round(u / a) * a - u),
    Object.assign(Fe, { left: -Vn.R, right: Vn.R, top: Vn.R, bottom: -Vn.R }),
    Fe.updateProjectionMatrix(),
    Fe.updateMatrixWorld(),
    zt.setRenderTarget(us),
    zt.setClearColor(16777215, 1),
    zt.clear(!0, !0, !1),
    zt.render(Ai, Fe),
    xc(p.uShadowM.value, Fe),
    (p.uShadowOn.value = 1),
    (p.uShadowTexel.value = 1 / us.width));
}
const _e = new f.OrthographicCamera(-Co, Co, Co, -Co, 50, 7e3),
  Ms = new f.Scene();
_e.coordinateSystem = zt.coordinateSystem;
{
  const t = new f.Mesh(an, bc);
  ((t.frustumCulled = !1), Ms.add(t));
}
const Vi = Io(Do.position),
  wc = new Map([
    [U0, Io(yl.position)],
    [Y0, Io(mi.position)],
    [J0, Vi],
    [tc, Vi],
    [fc, Io(xi.position, f.DoubleSide)],
    [lc, Vi],
  ]),
  zi = (t) => {
    const e = new f.Mesh(t.geometry, wc.get(t.material));
    return ((e.frustumCulled = t.frustumCulled), Ms.add(e), e);
  };
function pf() {
  const t = p.uSunDir.value;
  if (!D.nshadow || !p.uShadowOn.value || t.y < 0.03 || p.uBlue.value > 0.99) {
    p.uShadowNOn.value = 0;
    return;
  }
  const e = et.position;
  (ln.set(0, 0, -1).applyQuaternion(et.quaternion),
    (ln.y = 0),
    ln.lengthSq() < 1e-4 && ln.set(0, 0, 1),
    ln.normalize());
  const n = Rh.set(e.x + ln.x * Co * 0.4, e.y - 8, e.z + ln.z * Co * 0.4);
  (_e.position.copy(n).addScaledVector(t, 3200),
    _e.up.set(0, 1, 0),
    _e.lookAt(n),
    _e.updateMatrixWorld());
  const o = (2 * Co) / ga,
    a = ue.setFromMatrixColumn(_e.matrixWorld, 0),
    s = Ql.setFromMatrixColumn(_e.matrixWorld, 1),
    l = _e.position.dot(a),
    r = _e.position.dot(s);
  (_e.position
    .addScaledVector(a, Math.round(l / o) * o - l)
    .addScaledVector(s, Math.round(r / o) * o - r),
    _e.updateMatrixWorld(),
    zt.setRenderTarget(k0),
    zt.setClearColor(16777215, 1),
    zt.clear(!0, !0, !1),
    zt.render(Ms, _e),
    xc(p.uShadowNM.value, _e),
    (p.uShadowNOn.value = 1),
    (p.uShadowNTexel.value = 1 / ga),
    (p.uShadowNBias.value = 0.06 / (_e.far - _e.near)));
}
const uo = new f.OrthographicCamera(-pa, pa, pa, -pa, 1, 3e3),
  Si = new f.Scene();
uo.coordinateSystem = zt.coordinateSystem;
const ki = new f.MeshBasicNodeMaterial();
((ki.positionNode = ui()), (ki.fragmentNode = nt(ua.y, 0, 0, 1)));
{
  const t = new f.Mesh(an, ki);
  ((t.frustumCulled = !1), Si.add(t));
}
{
  const t = Io(sn.position),
    e = new f.MeshBasicNodeMaterial();
  ((e.positionNode = sn.position), (e.fragmentNode = nt(ua.y, 0, 0, 1)));
  for (const n of bs) {
    for (const a of [Ai, Ms]) {
      const s = new f.Mesh(n.g, t);
      ((s.frustumCulled = !1), a.add(s));
    }
    const o = new f.Mesh(n.g, e);
    ((o.frustumCulled = !1), Si.add(o));
  }
}
const Vl = { x: 1e9, z: 0 },
  yf = new f.Matrix4();
function xf() {
  const t = et.position;
  if (!ws && Math.hypot(t.x - Vl.x, t.z - Vl.z) < 250) return;
  ws = !1;
  const e = (2 * pa) / Or,
    n = Math.round(t.x / e) * e,
    o = Math.round(t.z / e) * e;
  ((Vl.x = n),
    (Vl.z = o),
    uo.position.set(n, 2e3, o),
    uo.up.set(0, 0, -1),
    uo.lookAt(n, 0, o),
    uo.updateMatrixWorld(),
    zt.setRenderTarget(C0),
    zt.setClearColor(0, 1),
    zt.clear(!0, !0, !1),
    zt.render(Si, uo));
  const a = yf.multiplyMatrices(
    uo.projectionMatrix,
    uo.matrixWorldInverse,
  ).elements;
  (p.uHU.value.set(0.5 * a[0], 0.5 * a[8], 0.5 + 0.5 * a[12]),
    p.uHV.value.set(-0.5 * a[1], -0.5 * a[9], 0.5 - 0.5 * a[13]),
    p.uHO.value.set(n, o, pa),
    (p.uHOn.value = 1));
}
const Ts = {
    day: {
      carK: 0.4,
      beam: 0.45,
      sun: [0.5, 0.66, -0.56],
      sunCol: [2.7, 2.3, 1.75],
      zen: [0.06, 0.17, 0.56],
      hor: [0.42, 0.55, 0.77],
      low: [0.24, 0.27, 0.31],
      ground: [0.17, 0.135, 0.1],
      amb: 0.62,
      fog: [0.5, 0.59, 0.7],
      fogLow: [0.1, 0.11, 0.12],
      hh: 420,
      d0: 0.04,
      fh: 32,
      base: 28e-5,
      litK: 0.13,
      win: 0.55,
      night: 0,
      cloud: 0.55,
      expo: 1.05,
      air: 0.8,
      neon: 0.5,
      shaft: 1.3,
      cov: 0.55,
      skyK: 12,
      glow: [0, 0, 0],
      hazeSky: 0.7,
      key: -2.45,
    },
    dusk: {
      carK: 0.8,
      beam: 1,
      hh: 520,
      sun: [0.86, 0.085, -0.5],
      sunCol: [3.4, 1.55, 0.62],
      zen: [0.1, 0.13, 0.3],
      hor: [1.05, 0.54, 0.3],
      low: [0.22, 0.17, 0.2],
      ground: [0.06, 0.05, 0.06],
      amb: 0.72,
      fog: [0.56, 0.4, 0.36],
      fogLow: [0.12, 0.11, 0.15],
      d0: 0.04,
      fh: 34,
      base: 32e-5,
      litK: 0.52,
      win: 1,
      night: 0.35,
      cloud: 0.5,
      expo: 1.08,
      air: 1.2,
      neon: 1,
      shaft: 2.6,
      cov: 0.5,
      skyK: 14,
      glow: [0.03, 0.016, 0.018],
      hazeSky: 0.8,
      key: -2.4,
    },
    night: {
      carK: 1,
      beam: 1.25,
      hh: 600,
      sun: [-0.3, 0.62, 0.45],
      sunCol: [0.05, 0.065, 0.11],
      zen: [0.006, 0.009, 0.022],
      hor: [0.07, 0.058, 0.075],
      low: [0.025, 0.025, 0.035],
      ground: [0.02, 0.02, 0.025],
      amb: 0.3,
      fog: [0.06, 0.06, 0.075],
      fogLow: [0.045, 0.04, 0.055],
      d0: 0.042,
      fh: 36,
      base: 42e-5,
      litK: 0.62,
      win: 1.2,
      night: 1,
      cloud: 0.4,
      expo: 1.3,
      air: 1.5,
      neon: 1.4,
      shaft: 0,
      cov: 0.6,
      skyK: 1.2,
      glow: [0.055, 0.032, 0.024],
      hazeSky: 0.3,
      key: -2.5,
    },
  },
  wt = {
    name: "day",
    from: null,
    to: null,
    t0: -9,
    dur: 2.2,
    litK: 0.2,
    win: 0.65,
    night: 0,
    cloud: 0.6,
    expo: 1,
    air: 1,
    neon: 0.6,
    shaft: 1,
    d0: 0.022,
    fh: 46,
    base: 34e-5,
    hh: 650,
    cov: 0.55,
    skyK: 12,
    hazeSky: 0.7,
    key: -2.45,
  },
  l5 = {};
function r5(t) {
  return Ts[t];
}
const Mc = new f.Vector3(0, -2, 0);
function Ci(t, e, n) {
  const o = (l, r) => ne(l, r, n),
    a = (l, r, u) => l.setRGB(o(r[0], u[0]), o(r[1], u[1]), o(r[2], u[2])),
    s = p.uSunDir.value
      .set(o(t.sun[0], e.sun[0]), o(t.sun[1], e.sun[1]), o(t.sun[2], e.sun[2]))
      .normalize();
  (a(p.uSunCol.value, t.sunCol, e.sunCol),
    a(p.uSkyZen.value, t.zen, e.zen),
    a(p.uSkyHor.value, t.hor, e.hor),
    a(p.uSkyLow.value, t.low, e.low),
    a(p.uGroundCol.value, t.ground, e.ground),
    a(p.uFogCol.value, t.fog, e.fog),
    a(p.uFogLow.value, t.fogLow, e.fogLow),
    (p.uAmb.value = o(t.amb, e.amb)),
    (p.uNightK.value = o(t.night, e.night)),
    (p.uCloudK.value = o(t.cloud, e.cloud)),
    (p.uWinK.value = o(t.win, e.win)),
    a(p.uGlowSky.value, t.glow, e.glow));
  for (const l of [
    "litK",
    "win",
    "night",
    "cloud",
    "expo",
    "air",
    "neon",
    "shaft",
    "d0",
    "fh",
    "base",
    "carK",
    "beam",
    "hh",
    "cov",
    "skyK",
    "hazeSky",
    "key",
  ])
    wt[l] = o(t[l], e[l]);
  ((p.uLitK.value = wt.litK),
    (p.uCov.value = wt.cov),
    (p.uSkyK.value = wt.skyK),
    (id.uHazeSky.value = wt.hazeSky),
    Mc.distanceToSquared(s) > 1e-9 && (Mc.copy(s), (ni = !0)),
    (p.uCarK.value = wt.carK),
    (tf.uBeamK.value = wt.beam));
}
function Sa(t, e = !1) {
  if (!Ts[t]) return;
  const n = e ? Ts[t] : { ...bf() };
  ((wt.from = n),
    (wt.to = Ts[t]),
    (wt.name = t),
    (wt.t0 = e ? -99 : Nt),
    document
      .querySelectorAll("#seg-sky button")
      .forEach((o) => o.classList.toggle("on", o.dataset.s === t)),
    e && Ci(n, n, 1));
}
function bf() {
  const t = (n) => [n.r, n.g, n.b],
    e = p;
  return {
    sun: [e.uSunDir.value.x, e.uSunDir.value.y, e.uSunDir.value.z],
    sunCol: t(e.uSunCol.value),
    zen: t(e.uSkyZen.value),
    hor: t(e.uSkyHor.value),
    low: t(e.uSkyLow.value),
    ground: t(e.uGroundCol.value),
    fog: t(e.uFogCol.value),
    fogLow: t(e.uFogLow.value),
    amb: e.uAmb.value,
    night: e.uNightK.value,
    cloud: e.uCloudK.value,
    win: e.uWinK.value,
    litK: wt.litK,
    expo: wt.expo,
    air: wt.air,
    neon: wt.neon,
    shaft: wt.shaft,
    d0: wt.d0,
    fh: wt.fh,
    base: wt.base,
    carK: wt.carK,
    beam: wt.beam,
    hh: wt.hh,
    cov: wt.cov,
    skyK: wt.skyK,
    hazeSky: wt.hazeSky,
    key: wt.key,
    glow: t(e.uGlowSky.value),
  };
}
function wf() {
  if (!wt.to) return;
  const t = wt.t0 < -50 ? 1 : Q((Nt - wt.t0) / wt.dur, 0, 1),
    e = t < 1;
  (Ci(wt.from, wt.to, em(t)),
    e && (za = !0),
    t >= 1 && (Ci(wt.to, wt.to, 1), (wt.from = wt.to)));
}
const Ei = W(new f.Vector2()),
  Tc = (() => {
    const t = ce.add(w(Ei.x, 0, Ei.y));
    return { position: At(() => (eo.assign(t), t))(), W: kt(t) };
  })(),
  vc = (t) => at(t.sub(Jt(t.div(It).add(0.5)).mul(It))),
  Mf = Se({
    position: Tc.position,
    shade: ({ alb: t, out: e, nrm: n }) => {
      const o = Tc.W,
        a = o.xz.toVar(),
        s = vc(a.x).toVar(),
        l = vc(a.y).toVar(),
        r = w(0.022, 0.024, 0.027)
          .mul(B(0.7, 1.2, jt(a.mul(0.15))))
          .toVar(),
        u = _(0.55, 0.7, jt(a.mul(0.05).add(3))).toVar(),
        i = pt(0.5, rt(a.y.mul(0.08)))
          .mul(_(0.18, 0.08, s))
          .add(pt(0.5, rt(a.x.mul(0.08))).mul(_(0.18, 0.08, l))),
        c = qt(s, l),
        m = _(12, 26, c).mul(_(32, 24, c)),
        d = w(0.9, 0.8, 0.5)
          .mul(i)
          .mul(0.08)
          .add(
            B(w(1, 0.55, 0.3), w(0.4, 0.8, 1), pt(0.5, jt(a.mul(0.02))))
              .mul(m)
              .mul(jt(a.mul(0.21)).mul(0.4).add(0.35))
              .mul(p.uNeonK),
          )
          .toVar(),
        h = vt(o.sub(de)).toVar(),
        y = w(0, 1, 0),
        x = An(o, y, k(1)),
        b = r
          .mul(x.amb.add(x.dir))
          .mul(u.mul(-0.5).add(1))
          .add(d)
          .add(
            Jr(o.add(w(0, 0.3, 0)), Tn(h, y))
              .mul(u)
              .mul(Ft(at(h.y).oneMinus(), 5).mul(0.5).add(0.04)),
          )
          .toVar();
      (F(p.uBlue.greaterThan(0.001), () => {
        b.assign(
          B(
            b,
            w(0.006, 0.012, 0.03).add(
              w(0.15, 0.75, 1)
                .mul(
                  _(0.4, 0, at(rt(a.x.div(10).add(0.5)).sub(0.5)).mul(10)).add(
                    _(0.4, 0, at(rt(a.y.div(10).add(0.5)).sub(0.5)).mul(10)),
                  ),
                )
                .mul(0.18),
            ),
            p.uBlue,
          ),
        );
      }),
        t.assign(r.mul(u.mul(-0.5).add(1))),
        n.assign(y),
        e.assign(nt(b, on(r.mul(x.amb).mul(u.mul(-0.5).add(1)), b))));
    },
  }),
  Ac = new f.Mesh(new f.PlaneGeometry(7e3, 7e3).rotateX(-Math.PI / 2), Mf);
((Ac.frustumCulled = !1), ze.add(Ac));
const Tf = [],
  vs = [];
function vf() {
  const t = et.position;
  vs.length = 0;
  for (const e of Hn)
    for (const n of e.detail.lamps) {
      const o = n.x - t.x,
        a = n.y - t.y,
        s = n.z - t.z,
        l = o * o + a * a + s * s;
      l > 340 * 340 || ((n.score = n.i / (1 + l * 35e-5)), vs.push(n));
    }
  for (const e of [Tf, El])
    for (const n of e) {
      const o = n.x - t.x,
        a = n.y - t.y,
        s = n.z - t.z;
      ((n.score = (n.i / (1 + (o * o + a * a + s * s) * 35e-5)) * (n.pri || 1)),
        n.i > 0 && vs.push(n));
    }
  vs.sort((e, n) => n.score - e.score);
  for (let e = 0; e < Eo; e++) {
    const n = vs[e],
      o = ya.uLP.value[e],
      a = ya.uLC.value[e],
      s = ya.uLD.value[e];
    if (!n || !D.lights) {
      (o.set(0, -9999, 0, 1), a.set(0, 0, 0, 0));
      continue;
    }
    const l = !!n.omni,
      r = n.r || (l ? 24 : 75),
      u = (n.k || (l ? 2.2 : 7)) * n.i;
    (o.set(n.x, n.y, n.z, 1 / (r * r)),
      a.set(n.c[0] * u, n.c[1] * u, n.c[2] * u, l ? -2 : n.cut || 0.62),
      s.set(n.dx, n.dy, n.dz, n.ns ? 1 : 0));
  }
}
function zn(t, e, n = {}) {
  const o = [],
    a = [],
    s = [],
    l = [],
    r = new f.Vector3(),
    u = new f.Vector3(),
    i = new f.Vector3(),
    c = new f.Vector3(),
    m = (h, y, x, b, V, T = 0) => {
      if (
        (r.subVectors(y, h),
        u.subVectors(x, h),
        i.crossVectors(r, u).normalize(),
        c
          .copy(h)
          .add(y)
          .add(x)
          .multiplyScalar(1 / 3)
          .sub(V),
        i.dot(c) < 0)
      ) {
        const g = y;
        ((y = x), (x = g), i.negate());
      }
      const A = typeof b == "function" ? b(i) : b;
      for (const g of [h, y, x])
        (o.push(g.x, g.y, g.z), a.push(i.x, i.y, i.z), s.push(A), l.push(T));
    };
  for (const h of t) {
    if (h.loft) {
      Af(h, m);
      continue;
    }
    if (h.loftHQ) {
      zf(h, m);
      continue;
    }
    if (h.disc) {
      const [S, K, ot, xt, U] = h.disc,
        J = h.n || 10,
        st = new f.Vector3(S, K, ot),
        N = (O, $) =>
          new f.Vector3(
            S + Math.cos((O / J) * 6.2831853) * xt,
            $,
            ot + Math.sin((O / J) * 6.2831853) * xt,
          );
      for (let O = 0; O < J; O++) {
        const $ = N(O, K - U / 2),
          ht = N(O + 1, K - U / 2),
          ut = N(O, K + U / 2),
          ct = N(O + 1, K + U / 2);
        (m($, ht, ct, h.mat, st),
          m($, ct, ut, h.mat, st),
          m(new f.Vector3(S, K - U / 2, ot), $, ht, h.bot ?? h.mat, st),
          m(new f.Vector3(S, K + U / 2, ot), ut, ct, h.mat, st));
      }
      continue;
    }
    const y = h.prof,
      x = y.length,
      b = y.map((S) => S[1]),
      V = Math.min(...b),
      T = Math.max(...b),
      A = h.ch ?? 0.08,
      g = h.x || 0;
    let M = 0;
    for (let S = 0; S < x; S++) {
      const K = y[S],
        ot = y[(S + 1) % x];
      M += K[0] * ot[1] - ot[0] * K[1];
    }
    const L = M > 0 ? 1 : -1,
      C = (S) => {
        const K = y[S],
          ot = y[(S + 1) % x],
          xt = ot[0] - K[0],
          U = ot[1] - K[1],
          J = Math.hypot(xt, U) || 1;
        return [(-U / J) * L, (xt / J) * L];
      },
      E = y.map((S, K) => {
        const ot = C((K - 1 + x) % x),
          xt = C(K),
          U = 1 + ot[0] * xt[0] + ot[1] * xt[1];
        return [
          S[0] + ((ot[0] + xt[0]) * A) / Math.max(U, 0.3),
          S[1] + ((ot[1] + xt[1]) * A) / Math.max(U, 0.3),
        ];
      }),
      R = (S) => (h.w / 2) * (1 - ((h.taper || 0) * (S - V)) / (T - V || 1)),
      G = E.map(([S, K]) => new f.Vector3(-R(K) + g, K, S)),
      H = E.map(([S, K]) => new f.Vector3(R(K) + g, K, S)),
      I = y.map(([S, K]) => new f.Vector3(-R(K) + A + g, K, S)),
      P = y.map(([S, K]) => new f.Vector3(R(K) - A + g, K, S)),
      q = new f.Vector3(
        g,
        y.reduce((S, K) => S + K[1], 0) / x,
        y.reduce((S, K) => S + K[0], 0) / x,
      );
    for (let S = 1; S < x - 1; S++)
      (m(G[0], G[S], G[S + 1], h.mat, q), m(H[0], H[S], H[S + 1], h.mat, q));
    for (let S = 0; S < x; S++) {
      const K = (S + 1) % x;
      (m(I[S], I[K], P[K], h.mat, q),
        m(I[S], P[K], P[S], h.mat, q),
        m(G[S], G[K], I[K], h.mat, q),
        m(G[S], I[K], I[S], h.mat, q),
        m(P[S], P[K], H[K], h.mat, q),
        m(P[S], H[K], H[S], h.mat, q));
    }
  }
  for (const [h, y, x, b, V, T, A] of e) {
    const g = new f.BoxGeometry(b, V, T).toNonIndexed().translate(h, y, x),
      M = g.attributes.position,
      L = new f.Vector3(h, y, x);
    for (let C = 0; C < M.count; C += 3)
      m(
        new f.Vector3().fromBufferAttribute(M, C),
        new f.Vector3().fromBufferAttribute(M, C + 1),
        new f.Vector3().fromBufferAttribute(M, C + 2),
        A,
        L,
      );
  }
  const d = new f.BufferGeometry();
  return (
    d.setAttribute("position", new f.Float32BufferAttribute(o, 3)),
    d.setAttribute("normal", new f.Float32BufferAttribute(a, 3)),
    d.setAttribute("aM", new f.Float32BufferAttribute(s, 1)),
    d.setAttribute("aD", new f.Float32BufferAttribute(l, 1)),
    n.smooth && Zi(d, n.smooth),
    d
  );
}
const Li = [0, 1, 2, 3, 4, 4, 3, 2, 1, 0];
function Af(t, e) {
  const n = t.loft,
    o = new f.Vector3(),
    a = n.map(([s, l, r, u, i, c, m, d]) =>
      [
        [0, r],
        [l * 0.8, r],
        [l, u],
        [l * 0.985, i],
        [c, m],
        [0, m + d],
        [-c, m],
        [-l * 0.985, i],
        [-l, u],
        [-l * 0.8, r],
      ].map(([h, y]) => new f.Vector3(h, y, s)),
    );
  for (let s = 0; s + 1 < n.length; s++) {
    const l = a[s],
      r = a[s + 1],
      u = (n[s][0] + n[s + 1][0]) / 2;
    o.set(0, (n[s][2] + n[s][6] + n[s + 1][2] + n[s + 1][6]) / 4, u);
    for (let i = 0; i < 10; i++) {
      const c = (i + 1) % 10,
        m = (d) => t.mat(Li[i], u, d);
      (e(l[i], l[c], r[c], m, o), e(l[i], r[c], r[i], m, o));
    }
  }
  for (const [s, l] of [
    [0, 1],
    [n.length - 1, -1],
  ]) {
    const r = a[s],
      u = new f.Vector3(0, (n[s][2] + n[s][6]) / 2, n[s][0]);
    o.copy(u).z += l;
    for (let i = 0; i < 10; i++) e(u, r[i], r[(i + 1) % 10], t.cap ?? 1, o);
  }
}
const Vf = [0, 0.03, 0.014, 0.022, 0.02, 0.24, 0.02, 0.022, 0.014, 0.03],
  Pi = [-0.88, 0.62];
function zf(t, e) {
  const n = t.loftHQ,
    o = n.length,
    a = n.map((d) => d[0]),
    s = (d, h) => {
      let y = 0;
      for (; y < o - 2 && h > a[y + 1];) y++;
      const x = a[y],
        b = a[y + 1],
        V = Q((h - x) / (b - x), 0, 1),
        T = (E) => n[Q(E, 0, o - 1)][d],
        A = (E) => a[Q(E, 0, o - 1)],
        g = ((T(y + 1) - T(y - 1)) / (A(y + 1) - A(y - 1) || 1)) * (b - x),
        M = ((T(y + 2) - T(y)) / (A(y + 2) - A(y) || 1)) * (b - x),
        L = V * V,
        C = L * V;
      return (
        (2 * C - 3 * L + 1) * T(y) +
        (C - 2 * L + V) * g +
        (-2 * C + 3 * L) * T(y + 1) +
        (C - L) * M
      );
    },
    l = new Set();
  for (let d = a[0]; d < a[o - 1] - 0.02; d += 0.08) l.add(+d.toFixed(4));
  l.add(a[o - 1]);
  for (const d of [...Pi, -1.75, -0.95, 0.75]) l.add(d);
  const r = [...l].sort((d, h) => d - h),
    u = [],
    i = r.map((d, h) => {
      const [y, x, b, V, T, A, g] = [1, 2, 3, 4, 5, 6, 7].map((C) => s(C, d)),
        M = [
          [0, x],
          [y * 0.8, x],
          [y, b],
          [y * 0.985, V],
          [T, A],
          [0, A + g],
          [-T, A],
          [-y * 0.985, V],
          [-y, b],
          [-y * 0.8, x],
        ],
        L = [];
      for (let C = 0; C < 10; C++) {
        const E = M[C],
          R = M[(C + 9) % 10],
          G = M[(C + 1) % 10],
          H = Vf[C],
          I = Math.hypot(R[0] - E[0], R[1] - E[1]) || 1,
          P = Math.hypot(G[0] - E[0], G[1] - E[1]) || 1,
          q = Math.min(H, I * 0.4) / I,
          S = Math.min(H, P * 0.4) / P,
          K = [E[0] + (R[0] - E[0]) * q, E[1] + (R[1] - E[1]) * q],
          ot = [E[0] + (G[0] - E[0]) * S, E[1] + (G[1] - E[1]) * S],
          xt = Li[(C + 9) % 10],
          U = Li[C],
          J = xt === 3 ? U : U === 3 ? xt : null;
        for (let st = 0; st <= 3; st++) {
          const N = st / 3,
            O =
              (1 - N) * (1 - N) * K[0] + 2 * (1 - N) * N * E[0] + N * N * ot[0],
            $ =
              (1 - N) * (1 - N) * K[1] + 2 * (1 - N) * N * E[1] + N * N * ot[1];
          (L.push(new f.Vector3(O, $, d)),
            h || u.push(st === 3 ? U : (J ?? (st < 2 ? xt : U))));
        }
      }
      return L;
    }),
    c = i[0].length,
    m = new f.Vector3();
  for (let d = 0; d + 1 < i.length; d++) {
    const h = i[d],
      y = i[d + 1],
      x = (r[d] + r[d + 1]) / 2;
    m.set(0, (h[0].y + h[(c / 4) * 2 + 2].y) / 2, x);
    const b = x > Pi[0] && x < Pi[1];
    for (let V = 0; V < c; V++) {
      const T = (V + 1) % c,
        A = u[V],
        g = (L) => t.mat(A, x, L),
        M = b && (A === 2 || A === 3) ? Math.sign(h[V].x + h[T].x) : 0;
      (e(h[V], h[T], y[T], g, m, M), e(h[V], y[T], y[V], g, m, M));
    }
  }
  for (const [d, h] of [
    [0, 1],
    [i.length - 1, -1],
  ]) {
    const y = i[d],
      x = new f.Vector3(0, (y[0].y + y[22].y) / 2, r[d]);
    m.copy(x).z += h;
    for (let b = 0; b < c; b++) e(x, y[b], y[(b + 1) % c], t.cap ?? 1, m);
  }
}
const Ii = (t) => (t.y > 0.8 ? 0 : 2),
  Bi = (t) => (t.z > 0.35 && t.y > 0.25 ? 2 : 0),
  Wt = (t, e, n = 0.5, o = 0.7, a = 0.2) => [
    [t, a, e, n, 0.18, o, 1],
    [t, a - 0.1, e, n * 0.42, 0.03, o * 0.42, 5],
  ],
  he = [
    {
      name: "sedan",
      len: 5.1,
      geo: zn(
        [
          {
            prof: [
              [-2.5, 0.35],
              [-2.56, 0.9],
              [-2.3, 1.05],
              [2.1, 1],
              [2.56, 0.68],
              [2.5, 0.38],
              [2.2, 0.24],
              [-2.2, 0.24],
            ],
            w: 2.1,
            taper: 0.08,
            mat: 0,
          },
          {
            prof: [
              [-1.9, 1.02],
              [-1.45, 1.48],
              [0.5, 1.5],
              [1.45, 1.01],
            ],
            w: 1.84,
            taper: 0.24,
            mat: Ii,
          },
        ],
        [
          [0, 0.87, -2.55, 1.86, 0.08, 0.06, 3],
          [0, 0.75, -2.53, 1.5, 0.04, 0.06, 3],
          [0, 0.72, 2.53, 1.6, 0.05, 0.06, 4],
          [0, 0.5, 0, 2.14, 0.12, 4.2, 1],
          ...Wt(0.72, 1.5),
          ...Wt(-0.72, 1.5),
          ...Wt(0.72, -1.5),
          ...Wt(-0.72, -1.5),
        ],
      ),
    },
    {
      name: "van",
      len: 6.4,
      geo: zn(
        [
          {
            prof: [
              [-3.1, 0.4],
              [-3.15, 1.9],
              [-2.92, 2.06],
              [1.5, 2.06],
              [3.06, 1.15],
              [3.1, 0.55],
              [2.8, 0.3],
              [-2.8, 0.3],
            ],
            w: 2.6,
            taper: 0.1,
            mat: Bi,
          },
        ],
        [
          [0, 1.78, -3.17, 2.2, 0.1, 0.05, 3],
          [0, 1.6, -3.17, 1.9, 0.05, 0.05, 3],
          [1.27, 1.5, -0.6, 0.02, 0.42, 3.6, 2],
          [-1.27, 1.5, -0.6, 0.02, 0.42, 3.6, 2],
          [0, 0.85, 3.08, 1.9, 0.06, 0.05, 4],
          [0, 1.03, -3.165, 2.32, 0.035, 0.03, 1],
          [0, 1.115, -3.165, 2.32, 0.035, 0.03, 1],
          [0, 1.2, -3.165, 2.32, 0.035, 0.03, 1],
          [0, 1.285, -3.165, 2.32, 0.035, 0.03, 1],
          [0, 1.37, -3.165, 2.32, 0.035, 0.03, 1],
          [0, 1.455, -3.165, 2.3, 0.035, 0.03, 1],
          [0, 0.46, -3.16, 2.2, 0.05, 0.04, 1],
          [0, 0.25, -1.9, 1.1, 0.04, 0.16, 4],
          [1.31, 1.2, -0.3, 0.02, 0.05, 5.2, 1],
          [-1.31, 1.2, -0.3, 0.02, 0.05, 5.2, 1],
          [1.33, 0.75, -0.3, 0.02, 0.04, 5.4, 1],
          [-1.33, 0.75, -0.3, 0.02, 0.04, 5.4, 1],
          ...Wt(0.9, 2, 0.6, 0.9),
          ...Wt(-0.9, 2, 0.6, 0.9),
          ...Wt(0.9, -2, 0.6, 0.9),
          ...Wt(-0.9, -2, 0.6, 0.9),
        ],
      ),
    },
    {
      name: "truck",
      len: 10.6,
      geo: zn(
        [
          {
            prof: [
              [2.2, 0.4],
              [2.2, 2.6],
              [4.6, 2.6],
              [5.3, 1.5],
              [5.3, 0.5],
            ],
            w: 2.6,
            taper: 0.08,
            mat: Bi,
          },
          {
            prof: [
              [-5.3, 0.5],
              [-5.3, 3.5],
              [2.05, 3.5],
              [2.05, 0.5],
            ],
            w: 2.8,
            taper: 0,
            mat: 0,
          },
        ],
        [
          [0, 3.42, -5.33, 2.4, 0.08, 0.05, 3],
          [0, 0.8, -5.33, 2.4, 0.08, 0.05, 3],
          [1.42, 3.45, -1.6, 0.06, 0.06, 7, 6],
          [-1.42, 3.45, -1.6, 0.06, 0.06, 7, 6],
          [0, 0.85, 5.33, 2.2, 0.06, 0.05, 4],
          [1.41, 2, -1.6, 0.02, 2.6, 7, 1],
          [-1.41, 2, -1.6, 0.02, 2.6, 7, 1],
          ...Wt(1, 3.6, 0.7, 1),
          ...Wt(-1, 3.6, 0.7, 1),
          ...Wt(1, -3.6, 0.7, 1),
          ...Wt(-1, -3.6, 0.7, 1),
          ...Wt(1, 0, 0.7, 1),
          ...Wt(-1, 0, 0.7, 1),
        ],
      ),
    },
    {
      name: "bus",
      len: 12,
      geo: zn(
        [
          {
            prof: [
              [-6, 0.45],
              [-6, 2.9],
              [-5.6, 3.1],
              [5.4, 3.1],
              [6, 2.2],
              [6, 0.45],
              [5.7, 0.3],
              [-5.7, 0.3],
            ],
            w: 2.8,
            taper: 0.06,
            mat: Bi,
          },
        ],
        [
          [1.36, 2.05, -0.3, 0.03, 0.8, 10, 7],
          [-1.36, 2.05, -0.3, 0.03, 0.8, 10, 7],
          [0, 2.9, -6.03, 2.4, 0.1, 0.05, 3],
          [0, 1.1, -6.03, 2.2, 0.07, 0.05, 3],
          [0, 1, 6.03, 2.3, 0.06, 0.05, 4],
          [0, 0.3, -4.6, 1.4, 0.04, 0.18, 4],
          ...Wt(1, 4.4, 0.7, 1.1),
          ...Wt(-1, 4.4, 0.7, 1.1),
          ...Wt(1, -4.4, 0.7, 1.1),
          ...Wt(-1, -4.4, 0.7, 1.1),
        ],
      ),
    },
    { name: "taxi", len: 5.1, geo: null },
    { name: "police", len: 5.1, geo: null },
  ];
((he[4].geo = zn(
  [
    {
      prof: [
        [-2.5, 0.35],
        [-2.56, 0.9],
        [-2.3, 1.05],
        [2.1, 1],
        [2.56, 0.68],
        [2.5, 0.38],
        [2.2, 0.24],
        [-2.2, 0.24],
      ],
      w: 2.1,
      taper: 0.08,
      mat: 0,
    },
    {
      prof: [
        [-1.9, 1.02],
        [-1.45, 1.48],
        [0.5, 1.5],
        [1.45, 1.01],
      ],
      w: 1.84,
      taper: 0.24,
      mat: Ii,
    },
  ],
  [
    [0, 0.87, -2.55, 1.86, 0.08, 0.06, 3],
    [0, 0.72, 2.53, 1.6, 0.05, 0.06, 4],
    [0, 1.62, -0.4, 0.9, 0.24, 0.4, 9],
    [0, 0.5, 0, 2.14, 0.12, 4.2, 1],
    ...Wt(0.72, 1.5),
    ...Wt(-0.72, 1.5),
    ...Wt(0.72, -1.5),
    ...Wt(-0.72, -1.5),
  ],
)),
  (he[5].geo = zn(
    [
      {
        prof: [
          [-2.5, 0.35],
          [-2.56, 0.9],
          [-2.3, 1.05],
          [2.1, 1],
          [2.56, 0.68],
          [2.5, 0.38],
          [2.2, 0.24],
          [-2.2, 0.24],
        ],
        w: 2.1,
        taper: 0.08,
        mat: 0,
      },
      {
        prof: [
          [-1.9, 1.02],
          [-1.45, 1.48],
          [0.5, 1.5],
          [1.45, 1.01],
        ],
        w: 1.84,
        taper: 0.24,
        mat: Ii,
      },
    ],
    [
      [0, 0.87, -2.55, 1.86, 0.08, 0.06, 3],
      [0, 0.72, 2.53, 1.6, 0.05, 0.06, 4],
      [0, 1.58, -0.4, 1.3, 0.16, 0.32, 8],
      [0, 0.5, 0, 2.14, 0.12, 4.2, 1],
      ...Wt(0.72, 1.5),
      ...Wt(-0.72, 1.5),
      ...Wt(0.72, -1.5),
      ...Wt(-0.72, -1.5),
    ],
  )),
  he.push({
    name: "far",
    len: 6,
    geo: zn(
      [],
      [[0, 1.1, 0, 2.4, 1.6, 5.6, (t) => (t.z < -0.5 ? 3 : t.z > 0.5 ? 4 : 0)]],
    ),
  }));
const ka = [
    [-2.45, 0.9, 0.44, 0.56, 0.84, 0.74, 0.9, 0],
    [-2.32, 0.99, 0.36, 0.52, 0.88, 0.82, 0.96, 0.01],
    [-1.75, 1.04, 0.31, 0.5, 0.88, 0.74, 1.03, 0.02],
    [-0.95, 1.03, 0.3, 0.5, 0.86, 0.6, 1.2, 0.03],
    [-0.15, 1.01, 0.3, 0.5, 0.82, 0.58, 1.24, 0.03],
    [0.75, 0.99, 0.31, 0.5, 0.76, 0.8, 0.86, 0.02],
    [1.55, 0.95, 0.32, 0.49, 0.7, 0.8, 0.76, 0.02],
    [2.2, 0.86, 0.35, 0.47, 0.62, 0.7, 0.66, 0.01],
    [2.45, 0.7, 0.42, 0.47, 0.56, 0.56, 0.58, 0],
  ],
  Sf = (t, e) =>
    t < 2
      ? 1
      : t === 2
        ? 10
        : t === 3
          ? e > -0.95 && e < 0.75
            ? 2
            : 10
          : e > -1.75 && e < 0.75
            ? 2
            : 10,
  Vc = 4.9,
  Ca = he.length;
function Go(t, e) {
  const n = ka,
    o = n.length;
  let a = 0;
  for (; a < o - 2 && e > n[a + 1][0];) a++;
  const s = n[a][0],
    l = n[a + 1][0],
    r = Q((e - s) / (l - s), 0, 1),
    u = (y) => n[Q(y, 0, o - 1)][t],
    i = (y) => n[Q(y, 0, o - 1)][0],
    c = ((u(a + 1) - u(a - 1)) / (i(a + 1) - i(a - 1) || 1)) * (l - s),
    m = ((u(a + 2) - u(a)) / (i(a + 2) - i(a) || 1)) * (l - s),
    d = r * r,
    h = d * r;
  return (
    (2 * h - 3 * d + 1) * u(a) +
    (h - 2 * d + r) * c +
    (-2 * h + 3 * d) * u(a + 1) +
    (h - d) * m
  );
}
function zc(t, e) {
  const n = Go(1, e),
    o = Go(4, e),
    a = Go(5, e),
    s = Go(6, e),
    l = Go(7, e),
    r = Math.abs(t),
    u = n * 0.985;
  return r <= a
    ? s + l * (1 - (r / a) ** 2)
    : r < u
      ? s + ((o - s) * (r - a)) / (u - a)
      : o;
}
const zl = (t, e, n, o = 0.27, a = 12) => [
  { disc: [t, o, e, n, 0.12], mat: 1, n: a },
  { disc: [t, o - 0.065, e, n * 0.7, 0.02], mat: 5, n: a },
];
he.push({
  name: "hero",
  len: Vc,
  solo: 1,
  geo: zn(
    [
      { loftHQ: ka, mat: Sf },
      ...zl(0.78, 1.5, 0.34, 0.27, 36),
      ...zl(-0.78, 1.5, 0.34, 0.27, 36),
      ...zl(0.8, -1.55, 0.36, 0.27, 36),
      ...zl(-0.8, -1.55, 0.36, 0.27, 36),
    ],
    [
      [0, 0.86, -2.458, 1.6, 0.05, 0.03, 3],
      [0.83, 0.84, -2.4, 0.04, 0.09, 0.12, 3],
      [-0.83, 0.84, -2.4, 0.04, 0.09, 0.12, 3],
      [0, 0.548, 2.456, 1.18, 0.028, 0.03, 4],
      [0.79, 0.535, 2.36, 0.1, 0.02, 0.16, 6],
      [-0.79, 0.535, 2.36, 0.1, 0.02, 0.16, 6],
      [0, 0.4, 2.37, 1.42, 0.03, 0.22, 1],
      ...[0, 1, 2, 3, 4, 5].map((t) => {
        const e = -1.62 + t * 0.12,
          n = (e + 1.75) / 0.8;
        return [
          0,
          ne(1.05, 1.23, n) + 0.004,
          e,
          ne(0.74, 0.6, n) * 1.84,
          0.025,
          0.05,
          1,
        ];
      }),
      [1.035, 0.66, -1.25, 0.035, 0.15, 0.5, 1],
      [-1.035, 0.66, -1.25, 0.035, 0.15, 0.5, 1],
      [1.04, 0.68, 0.62, 0.012, 0.3, 0.012, 1],
      [-1.04, 0.68, 0.62, 0.012, 0.3, 0.012, 1],
      [1.04, 0.68, -0.88, 0.012, 0.3, 0.012, 1],
      [-1.04, 0.68, -0.88, 0.012, 0.3, 0.012, 1],
      [0.8, 0.295, 0, 0.03, 0.02, 3.4, 5],
      [-0.8, 0.295, 0, 0.03, 0.02, 3.4, 5],
      ...[-0.6, -0.25, 0.25, 0.6].map((t) => [
        t,
        0.41,
        -2.36,
        0.025,
        0.09,
        0.2,
        1,
      ]),
    ],
    { smooth: 38 },
  ),
});
const kf = ka.map(([t, e, n, o, a, s, l, r]) => [
  t * 0.94,
  e * 0.95,
  n,
  o,
  a * 0.98,
  s * 0.95,
  l * 0.97,
  r,
]);
he.push({
  name: "coupe",
  len: 4.6,
  geo: zn(
    [
      {
        loft: kf,
        mat: (t, e) =>
          t < 2
            ? 1
            : t === 2
              ? 0
              : t === 3
                ? e > -0.9 && e < 0.7
                  ? 2
                  : 0
                : e > -1.65 && e < 0.7
                  ? 2
                  : 0,
      },
    ],
    [
      [0, 0.83, -2.31, 1.5, 0.05, 0.03, 3],
      [0, 0.53, 2.31, 1.08, 0.028, 0.03, 4],
      ...Wt(0.72, 1.35, 0.4, 0.55, 0.25),
      ...Wt(-0.72, 1.35, 0.4, 0.55, 0.25),
      ...Wt(0.72, -1.4, 0.4, 0.55, 0.25),
      ...Wt(-0.72, -1.4, 0.4, 0.55, 0.25),
    ],
  ),
});
const Cf = [
  [-1.7, 0.62, 0.46, 0.6, 0.94, 0.5, 1.22, 0.02],
  [-1.48, 0.8, 0.37, 0.6, 1, 0.64, 1.42, 0.05],
  [-0.8, 0.87, 0.33, 0.58, 1, 0.67, 1.56, 0.06],
  [0.15, 0.87, 0.33, 0.58, 0.98, 0.63, 1.56, 0.06],
  [0.9, 0.83, 0.35, 0.56, 0.9, 0.6, 1.32, 0.04],
  [1.45, 0.67, 0.39, 0.54, 0.78, 0.48, 1.02, 0.02],
  [1.7, 0.42, 0.47, 0.54, 0.66, 0.3, 0.76, 0],
];
he.push({
  name: "pod",
  len: 3.4,
  geo: zn(
    [
      {
        loft: Cf,
        mat: (t, e) =>
          t < 2
            ? 1
            : t === 2
              ? 0
              : t === 3
                ? e > -1.2 && e < 1.2
                  ? 2
                  : 0
                : e > -0.4 && e < 1.5
                  ? 2
                  : 0,
      },
    ],
    [
      [0.5, 0.86, -1.71, 0.32, 0.06, 0.03, 3],
      [-0.5, 0.86, -1.71, 0.32, 0.06, 0.03, 3],
      [0, 0.63, 1.71, 0.5, 0.03, 0.03, 4],
      ...Wt(0.58, 1, 0.36, 0.5, 0.28),
      ...Wt(-0.58, 1, 0.36, 0.5, 0.28),
      ...Wt(0.58, -1, 0.36, 0.5, 0.28),
      ...Wt(-0.58, -1, 0.36, 0.5, 0.28),
    ],
  ),
});
const Ef = 6,
  Sc = 8,
  kc = 9;
for (const [t, e] of [
  [0, 1.02],
  [1, 1.5],
  [2, 9],
  [3, 2.05],
  [4, 9],
  [5, 1.02],
  [6, 9],
  [7, 9],
  [8, 0.84],
  [9, 0.98],
])
  he[t].belt = e;
const As = Et("iP", "vec4"),
  On = Et("iQ", "vec4"),
  Fi = Et("iE", "vec4"),
  Cc = Et("iF", "vec4"),
  Ec = Et("iG", "vec4"),
  Lc = Et("iH", "vec4"),
  Lf = Et("aM", "float"),
  Sl = (t, e, n, o) => {
    const a = Ke(e),
      s = ae(e),
      l = Ke(n),
      r = ae(n),
      u = Ke(o),
      i = ae(o),
      c = w(u.mul(t.x).sub(i.mul(t.y)), i.mul(t.x).add(u.mul(t.y)), t.z),
      m = w(
        c.x,
        l.mul(c.y).add(r.mul(c.z)),
        r.negate().mul(c.y).add(l.mul(c.z)),
      );
    return w(
      a.mul(m.x).add(s.mul(m.z)),
      m.y,
      s.negate().mul(m.x).add(a.mul(m.z)),
    );
  },
  Pf = (t, e, n, o) => {
    const a = Ke(e),
      s = ae(e),
      l = Ke(n),
      r = ae(n),
      u = Ke(o),
      i = ae(o),
      c = w(a.mul(t.x).sub(s.mul(t.z)), t.y, s.mul(t.x).add(a.mul(t.z))),
      m = w(c.x, l.mul(c.y).sub(r.mul(c.z)), r.mul(c.y).add(l.mul(c.z)));
    return w(
      u.mul(m.x).add(i.mul(m.y)),
      i.negate().mul(m.x).add(u.mul(m.y)),
      m.z,
    );
  },
  Ni = Et("aD", "float"),
  Pc = Ni.mul(Cc.z),
  kl = Ke(Pc),
  Cl = ae(Pc),
  If = (t) => {
    const e = Ni.mul(0.56),
      n = t.x.sub(e),
      o = t.y.sub(1.22);
    return w(
      e.add(n.mul(kl)).sub(o.mul(Cl)),
      n.mul(Cl).add(o.mul(kl)).add(1.22),
      t.z,
    );
  },
  Bf = (t) =>
    w(t.x.mul(kl).sub(t.y.mul(Cl)), t.x.mul(Cl).add(t.y.mul(kl)), t.z),
  Vs = (() => {
    const t = If(ce).mul(Fi.w),
      e = Sl(t, As.w, On.x, On.y).add(As.xyz),
      n = Sl(t, Ec.w, Lc.x, Lc.y).add(Ec.xyz);
    return {
      position: At(() => (eo.assign(n), e))(),
      W: kt(e),
      N: kt(Sl(Bf(to), As.w, On.x, On.y)),
      Lp: ce,
      M: Lf,
      Q: kt(On),
      E: kt(Fi),
      F: kt(Cc),
      Tz: kt(Sl(w(0, 0, 1), As.w, On.x, On.y)),
      Vl: kt(Pf(e.sub(de), As.w, On.x, On.y).div(Fi.w)),
      Nl: to,
    };
  })(),
  Ff = Us(
    [
      [0.022, 0.022, 0.022],
      [0.06, 0.062, 0.068],
      [0.14, 0.15, 0.16],
      [0.5, 0.51, 0.5],
      [0.72, 0.72, 0.68],
      [0.02, 0.035, 0.09],
      [0.02, 0.11, 0.12],
      [0.03, 0.08, 0.04],
      [0.16, 0.02, 0.015],
      [0.45, 0.03, 0.02],
      [0.38, 0.32, 0.22],
      [0.2, 0.25, 0.18],
      [0.42, 0.14, 0.07],
      [0.2, 0.35, 0.5],
      [0.7, 0.25, 0.03],
      [0.72, 0.5, 0.03],
    ].map((t) => new f.Vector3(...t)),
    "vec3",
  ),
  Nf = At(([t, e, n, o]) => {
    const a = w(0).toVar();
    return (
      Pe(Eo, ({ i: s }) => {
        const l = so.uLP.element(s),
          r = so.uLC.element(s),
          u = so.uLD.element(s);
        F(u.w.lessThanEqual(0.5), () => {
          const i = l.xyz.sub(t).toVar(),
            c = gt(i, i).toVar(),
            m = Z(0, c.mul(l.w).oneMinus()).toVar();
          F(m.greaterThan(0), () => {
            const d = i.mul(m0(c.add(1e-4))).toVar(),
              h = vt(d.sub(n)),
              y = Y(
                r.w.lessThan(-1),
                k(1),
                _(r.w, r.w.add(0.25), gt(d.negate(), u.xyz)),
              );
            a.addAssign(
              r.rgb
                .mul(m)
                .mul(y)
                .mul(Ft(Z(gt(e, h), 0), o))
                .mul(o.add(8))
                .div(c.mul(0.012).add(1).mul(8)),
            );
          });
        });
      }),
      a
    );
  }),
  Rf = Xe(
    "boxHit",
    "vec4",
    ["o:vec3", "d:vec3", "lo:vec3", "hi:vec3"],
    ([t, e, n, o]) => {
      const a = w(
          Y(e.x.lessThan(0), k(-1), k(1)),
          Y(e.y.lessThan(0), k(-1), k(1)),
          Y(e.z.lessThan(0), k(-1), k(1)),
        ).div(Z(at(e), w(1e-5))),
        s = n.sub(t).mul(a),
        l = o.sub(t).mul(a),
        r = qt(s, l).toVar(),
        u = Z(s, l),
        i = Z(Z(r.x, r.y), r.z).toVar(),
        c = qt(qt(u.x, u.y), u.z),
        m = nt(1e4, 0, 1, 0).toVar();
      return (
        F(i.lessThanEqual(c).and(i.greaterThanEqual(0)), () => {
          m.assign(
            nt(
              i,
              Y(
                i.equal(r.x),
                w(oo(e.x).negate(), 0, 0),
                Y(
                  i.equal(r.y),
                  w(0, oo(e.y).negate(), 0),
                  w(0, 0, oo(e.z).negate()),
                ),
              ),
            ),
          );
        }),
        m
      );
    },
  ),
  Df = [
    [[0.12, 0.36, -0.86], [0.72, 0.6, -0.2], 1],
    [[-0.72, 0.36, -0.86], [-0.12, 0.6, -0.2], 1],
    [[0.15, 0.55, -1], [0.69, 1.07, -0.78], 1],
    [[-0.69, 0.55, -1], [-0.15, 1.07, -0.78], 1],
    [[-0.09, 0.36, -0.72], [0.09, 0.55, 0.45], 2],
    [[-0.92, 0.4, 0.42], [0.92, 0.74, 0.95], 3],
  ],
  _f = At(([t, e]) => {
    const n = k(1e4).toVar(),
      o = w(0, 1, 0).toVar(),
      a = k(0).toVar();
    for (const [l, r, u] of Df) {
      const i = Rf(t, e, w(...l), w(...r)).toVar();
      F(i.x.lessThan(n), () => {
        (n.assign(i.x), o.assign(i.yzw), a.assign(u));
      });
    }
    (F(e.y.lessThan(0), () => {
      const l = k(0.36).sub(t.y).div(e.y).toVar();
      F(l.greaterThan(0).and(l.lessThan(n)), () => {
        (n.assign(l), o.assign(w(0, 1, 0)), a.assign(4));
      });
    }),
      F(e.z.lessThan(0), () => {
        const l = k(-1.25).sub(t.z).div(e.z).toVar();
        F(l.greaterThan(0).and(l.lessThan(n)), () => {
          (n.assign(l), o.assign(w(0, 0, 1)), a.assign(4));
        });
      }));
    const s = w(0).toVar();
    return (
      F(a.equal(0), () => {
        s.assign(B(p.uFogCol.mul(0.3), gn(e).mul(p.uAmb).mul(0.6), 0.5));
      }).Else(() => {
        const l = gn(w(0, 1, 0))
            .mul(p.uAmb)
            .mul(1.1)
            .add(p.uSunCol.mul(0.3).mul(Z(p.uSunDir.y, 0)))
            .add(p.uCityGlow.mul(1.5)),
          r = w(0.25, 0.75, 1),
          u = t.add(e.mul(n)).toVar(),
          i = Kt(Z(k(0.42).sub(u.z), 0).mul(-2.2)).mul(0.22);
        (s.assign(
          Y(
            a.equal(1),
            w(0.15, 0.085, 0.05),
            Y(a.equal(4), w(0.025), w(0.03, 0.032, 0.035)),
          ).mul(l.mul(Z(o.y, 0).mul(0.45).add(0.55)).add(r.mul(i))),
        ),
          F(
            a.equal(3).and(o.z.lessThan(-0.5)).and(u.y.greaterThan(0.55)),
            () => {
              s.addAssign(
                r
                  .mul(
                    ae(p.uTime.mul(1.3).add(u.x.mul(4)))
                      .mul(0.3)
                      .add(1.2),
                  )
                  .mul(_(0.56, 0.6, u.y))
                  .mul(_(0.72, 0.68, u.y))
                  .mul(_(0.86, 0.6, at(u.x))),
              );
            },
          ),
          F(a.equal(3).and(o.y.greaterThan(0.5)).and(u.z.lessThan(0.5)), () => {
            s.addAssign(w(1, 0.78, 0.5).mul(0.4));
          }));
      }),
      s
    );
  }),
  Gf = ({ alb: t, out: e, nrm: n }) => {
    const o = Vs,
      a = o.W,
      s = o.Lp,
      l = o.E,
      r = o.F,
      u = vt(o.N).toVar(),
      i = vt(a.sub(de)).toVar(),
      c = Jt(o.M.add(0.5)).toVar(),
      m = o.Q.z.toVar(),
      d = o.Q.w,
      h = l.y.toVar(),
      y = l.z.toVar();
    F(y.greaterThan(3.5).and(y.lessThan(4.5)), () => {
      m.assign(0.95);
    });
    const x = Y(at(y.sub(Ca)).lessThan(0.5), p.uTurbo, k(0)).toVar(),
      b = s.y.add(s.x).mul(170).toVar(),
      V = Q(we(b).mul(-0.35).add(1), 0, 1).toVar(),
      T = w(0).toVar(),
      A = w(0).toVar(),
      g = k(0).toVar(),
      M = k(0).toVar();
    F(c.lessThan(0.5), () => {
      const P = Jn(Q(Jt(m.mul(16)), 0, 15)).toVar();
      (F(r.x.greaterThan(-0.5).and(s.y.greaterThan(r.y)), () => {
        P.assign(Jn(r.x));
      }),
        T.assign(Ff.element(P).xyz),
        F(
          y
            .greaterThan(2.5)
            .and(y.lessThan(3.5))
            .and(r.x.lessThan(-0.5).or(s.y.lessThanEqual(r.y))),
          () => {
            T.assign(
              vn(
                m,
                [
                  [0.6, [0.62, 0.58, 0.47]],
                  [0.8, [0.5, 0.52, 0.5]],
                ],
                [0.5, 0.1, 0.06],
              ),
            );
          },
        ),
        g.assign(0.75));
    })
      .ElseIf(c.lessThan(1.5), () => {
        T.assign(w(0.025));
      })
      .ElseIf(c.lessThan(2.5), () => {
        (T.assign(w(0.01, 0.012, 0.015)), g.assign(1));
      })
      .ElseIf(c.lessThan(3.5), () => {
        (T.assign(w(0.05, 0, 0)),
          A.assign(
            w(1, 0.022, 0.03)
              .mul(d.mul(3).add(2.5))
              .mul(l.x)
              .mul(B(1, p.uCarK, 0.5))
              .mul(x.mul(1.6).add(1)),
          ));
      })
      .ElseIf(c.lessThan(4.5), () => {
        (T.assign(w(0.1)),
          A.assign(w(0.92, 0.95, 1).mul(12).mul(l.x).mul(p.uCarK)));
      })
      .ElseIf(c.lessThan(5.5), () => {
        (T.assign(w(0.02)),
          A.assign(
            B(w(0.06, 0.3, 1), w(0.5, 0.78, 1), x)
              .mul(
                ae(p.uTime.mul(40).add(h.mul(20)))
                  .mul(0.6)
                  .add(2.8),
              )
              .mul(x.mul(3.5).add(1))
              .mul(l.x),
          ));
      })
      .ElseIf(c.lessThan(6.5), () => {
        (T.assign(w(0.1)), A.assign(w(1, 0.55, 0.08).mul(6).mul(l.x)));
      })
      .ElseIf(c.lessThan(7.5), () => {
        (T.assign(w(0.02)), A.assign(w(1, 0.82, 0.6).mul(1.6).mul(l.x)));
      })
      .ElseIf(c.lessThan(8.5), () => {
        T.assign(w(0.02));
        const P = s.x.greaterThanEqual(0),
          q = pt(0.5, rt(p.uTime.mul(2.6).add(h)));
        A.assign(
          Y(P, w(1, 0.05, 0.04), w(0.1, 0.3, 1))
            .mul(22)
            .mul(Y(P, q, q.oneMinus()))
            .mul(l.x),
        );
      })
      .ElseIf(c.lessThan(9.5), () => {
        (T.assign(w(0.1)), A.assign(w(1, 0.7, 0.15).mul(5).mul(l.x)));
      })
      .Else(() => {
        (T.assign(w(0.07, 0.072, 0.076)), M.assign(1));
      });
    const L = An(a, u, k(1)),
      C = T.mul(L.amb.add(L.dir)).add(A).toVar(),
      E = k(0).toVar(),
      R = w(0).toVar(),
      G = w(0).toVar(),
      H = c.greaterThan(1.5).and(M.lessThan(0.5)).toVar(),
      I = Tn(i, u).toVar();
    (F(g.add(M).greaterThan(0), () => {
      (E.assign(ul(a, u)),
        R.assign(
          Zr(a, I, Y(M.greaterThan(0.5), k(0.85), Y(H, k(0.1), k(0.5)))),
        ),
        G.assign(
          Nf(a, u, i, Y(M.greaterThan(0.5), k(12), Y(H, k(40), k(16)))),
        ));
    }),
      F(g.greaterThan(0), () => {
        const P = Ft(Q(gt(i, u).negate(), 0, 1).oneMinus(), 5)
          .mul(0.96)
          .add(0.04)
          .toVar();
        (C.addAssign(
          R.mul(P)
            .mul(g)
            .mul(Y(H, k(0.85), k(0.6))),
        ),
          C.addAssign(
            p.uSunCol
              .mul(Qr(Ft(Z(gt(I, p.uSunDir), 0), Y(H, k(90), k(40)))))
              .mul(E)
              .mul(g)
              .mul(Y(H, k(1.5), k(0.8))),
          ),
          C.addAssign(
            G.mul(g)
              .mul(P)
              .mul(Y(H, k(3), k(2))),
          ),
          F(H.and(at(y.sub(Ca)).lessThan(0.5)).and(r.z.lessThan(0.5)), () => {
            const q = Zd(vt(o.Vl), vt(o.Nl), 0.6896551724137931).toVar();
            F(gt(q, q).greaterThan(0.5), () => {
              C.addAssign(
                _f(s.add(q.mul(0.02)), q)
                  .mul(P.oneMinus())
                  .mul(0.62)
                  .mul(w(0.85, 0.93, 1))
                  .mul(_(0, 0.5, r.z).oneMinus()),
              );
            });
          }));
      }),
      F(M.greaterThan(0), () => {
        const P = jt(X(s.z.mul(2.3), b)),
          q = w(0.42, 0.43, 0.445).mul(P.sub(0.5).mul(0.12).mul(V).add(1)),
          S = Q(gt(i, u).negate(), 0, 1),
          K = q.add(q.oneMinus().mul(Ft(S.oneMinus(), 5)).mul(0.6)).toVar(),
          ot = vt(p.uSunDir.sub(i)),
          xt = gt(vt(o.Tz), ot),
          U = Ft(Z(xt.mul(xt).oneMinus(), 0), 40).mul(Ft(Z(gt(u, ot), 0), 4));
        C.addAssign(
          T.mul(gn(u))
            .mul(p.uAmb)
            .mul(1.4)
            .add(
              B(R, gn(I).mul(p.uAmb), B(0.45, 0.78, p.uCel))
                .mul(K)
                .mul(0.7),
            )
            .add(
              p.uSunCol
                .mul(K)
                .mul(
                  Qr(U)
                    .mul(0.9)
                    .add(Qr(Ft(Z(gt(I, p.uSunDir), 0), 120)).mul(1.6)),
                )
                .mul(cl(Z(gt(u, p.uSunDir), 0).mul(E))),
            )
            .add(G.mul(K).mul(1.4)),
        );
      }),
      F(p.uBlue.greaterThan(0.001), () => {
        C.assign(
          B(
            C,
            A.mul(0.2)
              .add(w(0.006, 0.012, 0.03))
              .add(
                w(1, 0.35, 0.3)
                  .mul(0.3)
                  .mul(Ft(at(gt(u, i)).oneMinus(), 2)),
              ),
            p.uBlue,
          ),
        );
      }),
      t.assign(T),
      n.assign(u),
      e.assign(nt(C, on(T.mul(L.amb), C))));
  },
  Ri = Se({ position: Vs.position, shade: Gf }),
  Hf = Se({
    position: Vs.position,
    opts: { side: f.BackSide },
    shade: ({ alb: t, out: e, nrm: n, ink: o }) => {
      const a = Vs,
        s = Jt(a.M.add(0.5)),
        l = vt(a.N).negate().toVar(),
        r = vt(a.W.sub(de)).toVar();
      F(s.greaterThan(1.5).and(s.lessThan(2.5)), () => {
        const u = Ft(Q(gt(r, l).negate(), 0, 1).oneMinus(), 5)
            .mul(0.96)
            .add(0.04),
          i = B(0.24, 0.7, u)
            .mul(_(0.05, 0.6, a.F.z))
            .mul(pt(0.5, at(kt(Ni))));
        (F(rl(no.xy).greaterThanEqual(i), () => {
          ns();
        }),
          o.assign(0),
          t.assign(w(0)),
          n.assign(l),
          e.assign(
            nt(
              gn(Tn(r, l))
                .mul(p.uAmb)
                .mul(0.4)
                .add(w(0.01, 0.012, 0.014)),
              0,
            ),
          ));
      }).Else(() => {
        const u = w(0.03, 0.031, 0.034),
          i = An(a.W, l, k(1)),
          c = u.mul(i.amb.add(i.dir.mul(0.3))).toVar();
        (t.assign(u), n.assign(l), e.assign(nt(c, on(u.mul(i.amb), c))));
      });
    },
  }),
  Ic = [1400, 700, 400, 300, 300, 120, 6e3, 0, 700, 700],
  Ea = 24,
  Bc = he.map((t, e) => {
    if (t.solo) return null;
    const n = new Float32Array(Ic[e] * Ea),
      o = new f.InstancedInterleavedBuffer(n, Ea);
    o.setUsage(f.DynamicDrawUsage);
    const a = new f.InstancedBufferGeometry();
    for (const l of ["position", "normal", "aM", "aD"])
      a.setAttribute(l, t.geo.attributes[l]);
    for (const [l, r] of [
      ["iP", 0],
      ["iQ", 4],
      ["iE", 8],
      ["iF", 12],
      ["iG", 16],
      ["iH", 20],
    ])
      a.setAttribute(l, new f.InterleavedBufferAttribute(o, 4, r));
    ((a.instanceCount = 0),
      (a.boundingSphere = new f.Sphere(new f.Vector3(), 1e5)));
    const s = new f.Mesh(a, Ri);
    return (
      (s.frustumCulled = !1),
      ze.add(s),
      { a: n, ib: o, g: a, m: s, n: 0, max: Ic[e] }
    );
  }),
  Di = Bc.filter(Boolean);
wc.set(Ri, Io(Vs.position));
for (const t of Di) zi(t.m);
const Of = [38, 76, 114, 152, 190, 228, 266, 304],
  Wf = [57, 95, 133, 171, 209, 247, 285],
  Wn = 980,
  La = 2 * Wn,
  _i = new Map();
function Gi(t, e) {
  const n = t * 1e6 + e;
  let o = _i.get(n);
  if (o) return o;
  o = [];
  const a = Ue(t, e),
    s = t ? Wf : Of,
    l = a > 60;
  for (let r = 0; r < s.length; r++)
    for (const u of [1, -1])
      for (let i = 0; i < (l ? 2 : 1); i++) {
        const c = se(t * 7 + r * 31 + i * 5 + (u > 0 ? 1 : 0), e, 4242),
          m = se(r, e * 3 + t + i * 11, 77);
        if (c < 0.14) continue;
        const d = (0.3 + 0.9 * m) * (1 - r * 0.05) * (l ? 1.25 : 1),
          h = Math.max(2, Math.round((La / 100) * d * 3.2)),
          y = {
            ax: t,
            i: e,
            h: r,
            y: s[r] + (i ? 3 : 0),
            dir: u,
            off: u * (l ? (i ? 0.36 : 0.19) : 0.26) * a,
            v: (24 + r * 3.2 + m * 9) * (l ? 1.15 : 1),
            n: h,
            seed: ca(t * 7 + r * 13 + i, e, u > 0 ? 5 : 9) >>> 8,
            low: r < 2,
          };
        (Uf(y), o.push(y));
      }
  return (_i.set(n, o), o);
}
const qf = [14, 12, 10, 12, 14, 6, 3, 3, 4, 5, 4, 3, 3, 3, 2, 2],
  Fc = (t) => {
    let e = t * 100;
    for (let n = 0; n < 16; n++) if (((e -= qf[n]), e < 0)) return n;
    return 15;
  };
function Kf(t, e) {
  return t
    ? e < 0.16
      ? 2
      : e < 0.26
        ? 3
        : e < 0.46
          ? 1
          : e < 0.66
            ? 0
            : e < 0.8
              ? 4
              : e < 0.86
                ? Sc
                : e < 0.96
                  ? kc
                  : 5
    : e < 0.3
      ? 0
      : e < 0.42
        ? 1
        : e < 0.6
          ? 4
          : e < 0.76
            ? Sc
            : e < 0.92
              ? kc
              : e < 0.95
                ? 3
                : 5;
}
function Uf(t) {
  const e = g0((t.seed * 2654435761) >>> 0),
    n = t.n,
    o = 0.12 + 0.5 * e(),
    a = e() < 0.3,
    s = new Uint8Array(n),
    l = new Float32Array(n),
    r = new Int32Array(n),
    u = new Float32Array(n);
  let i = 0;
  for (let I = 0; I < n; I++) {
    const P = I === 0 || e() < o;
    (P && (i = I),
      (r[I] = i),
      (s[I] = !P && (a || e() < 0.35) ? s[i] : Kf(t.low, e())),
      (l[I] = P ? 2 + e() * 9 : 0.12 + e() * 0.5),
      (u[I] = 0.95 + e() * 0.1));
  }
  const c = (I) => he[s[I]].len * u[I],
    m = (I) => (c(I) + c((I - 1 + d) % d)) / 2 + 6;
  let d = n,
    h = 0;
  for (;;) {
    h = 0;
    for (let I = 0; I < d; I++) h += m(I);
    if (h < La * 0.8 || d <= 2) break;
    d--;
  }
  let y = 0;
  for (let I = 0; I < d; I++) y += l[I];
  const x = new Float32Array(d),
    b = new Float32Array(d);
  let V = t.seed % 977;
  for (let I = 0; I < d; I++)
    ((x[I] = ((La - h) * l[I]) / y), (V += m(I) + x[I]), (b[I] = V));
  const T = new Float32Array(d),
    A = new Float32Array(d),
    g = new Float32Array(d),
    M = new Float32Array(d),
    L = new Float32Array(d),
    C = new Float32Array(d),
    E = new Float32Array(d),
    R = new Float32Array(d),
    G = new Uint8Array(d),
    H = new Int8Array(d);
  for (let I = 0; I < d; I++) {
    const P = r[I];
    if (P === I) {
      let q = I;
      for (; q + 1 < d && r[q + 1] === P;) q++;
      const S = x[(q + 1) % d];
      ((T[I] = Math.min(0.22 * Math.min(x[I], S), 45)),
        (A[I] = 0.05 + 0.1 * e()),
        (g[I] = e() * 6.2832));
    } else ((T[I] = T[P]), (A[I] = A[P]), (g[I] = g[P]));
    ((M[I] = Math.min(0.2 * Math.min(x[I], x[(I + 1) % d]), 4)),
      (L[I] = 0.1 + 0.14 * e()),
      (C[I] = e() * 6.2832),
      (E[I] = (e() - 0.5) * 2.4),
      (R[I] = (e() - 0.5) * 1.8),
      (G[I] = Fc(e())),
      (H[I] = e() < 0.22 ? (e() < 0.45 ? 0 : e() < 0.6 ? 4 : Fc(e())) : -1),
      s[I] === 5 && ((G[I] = 0), (H[I] = 4)));
  }
  Object.assign(t, {
    n: d,
    type: s,
    sc: u.slice(0, d),
    base: b,
    A: T,
    om: A,
    ph: g,
    a: M,
    om2: L,
    ph2: C,
    lat: E,
    dy: R,
    tone: G,
    tone2: H,
  });
}
const Nc = {
  x: 0,
  y: 0,
  z: 0,
  yaw: 0,
  pitch: 0,
  roll: 0,
  type: 0,
  tone: 0,
  tone2: -1,
  belt: 9,
  sc: 1,
  brake: 0,
  seed: 0,
  len: 5,
  v: 0,
};
function Yf(t, e) {
  return (((t.seed * 2654435761 + e * 40503) >>> 0) % 1e5) / 1e5;
}
function Hi(t, e, n, o, a = Nc) {
  const s = t.om[e] * n + t.ph[e],
    l = t.om2[e] * n + t.ph2[e],
    r =
      t.base[e] + t.dir * t.v * n + t.A[e] * Math.sin(s) + t.a[e] * Math.sin(l),
    u = o - Wn,
    i = u + ((((r - u) % La) + La) % La),
    c = Math.sin(n * t.om2[e] * 1.7 + t.ph2[e] * 3.1),
    m = Math.sin(n * 0.5 + t.ph2[e] * 2.3),
    d = t.i * It + t.off + t.lat[e] + c * 0.5;
  ((a.type = t.type[e]),
    (a.sc = t.sc[e]),
    (a.len = he[a.type].len * a.sc),
    (a.belt = he[a.type].belt),
    t.ax === 0
      ? ((a.x = d), (a.z = i), (a.yaw = t.dir > 0 ? 0 : Math.PI))
      : ((a.x = i),
        (a.z = d),
        (a.yaw = t.dir > 0 ? Math.PI / 2 : -Math.PI / 2)),
    (a.y = t.y + t.dy[e] + m * 0.35),
    (a.roll = -Math.cos(n * t.om2[e] * 1.7 + t.ph2[e] * 3.1) * 0.05 * t.dir),
    (a.pitch = -0.025 + Math.cos(n * 0.5 + t.ph2[e] * 2.3) * 0.01));
  const h = t.A[e] * t.om[e] * Math.cos(s) + t.a[e] * t.om2[e] * Math.cos(l),
    y =
      -t.A[e] * t.om[e] * t.om[e] * Math.sin(s) -
      t.a[e] * t.om2[e] * t.om2[e] * Math.sin(l);
  ((a.v = Math.abs(t.dir * t.v + h)),
    (a.brake =
      y * t.dir < -0.2 ||
      (Math.imul(e * 977 + t.seed, (Math.floor(n / 7) + e) | 0) >>> 0) % 100 < 3
        ? 1
        : 0),
    (a.tone = (t.tone[e] + 0.5) / 16),
    (a.tone2 = t.tone2[e]),
    (a.seed = ((t.seed % 1e3) * 1e3 + e) / 1e6));
  const x = a.x - v.pos.x,
    b = a.z - v.pos.z,
    V = x * x + b * b;
  if (V < 484) {
    const T = Ir(22, 9, Math.sqrt(V));
    t.y > v.homeY
      ? (a.y = Math.max(a.y, v.pos.y + 6 * T))
      : (a.y = Math.min(a.y, v.pos.y - 4.6 * T));
  }
  return a;
}
const Rc = new f.Frustum(),
  Dc = new f.Matrix4(),
  Oi = new f.Sphere(),
  rn = [],
  Wi = { aloft: 0, drawn: 0 };
let _c = null;
const $f = { ...Nc };
function jf(t) {
  const e = et.position;
  (Dc.multiplyMatrices(et.projectionMatrix, et.matrixWorldInverse),
    Rc.setFromProjectionMatrix(Dc, et.coordinateSystem));
  const n = _c ?? t;
  _c = t;
  for (const i of Di) i.n = 0;
  rn.length = 0;
  let o = 0;
  const a = D.traffic,
    s = Math.floor((e.x - Wn) / It),
    l = Math.ceil((e.x + Wn) / It),
    r = Math.floor((e.z - Wn) / It),
    u = Math.ceil((e.z + Wn) / It);
  for (let i = 0; i < 2; i++)
    for (let c = i ? r : s; c <= (i ? u : l); c++) {
      const m = c * It;
      if (!(Math.abs(m - (i ? e.z : e.x)) > Wn))
        for (const d of Gi(i, c)) {
          const h = i ? e.x : e.z;
          for (let y = 0; y < d.n; y++) {
            if (Yf(d, y * 3 + 1) > a && !(Ct && Ct.L === d && Ct.k === y))
              continue;
            o++;
            const x = Hi(d, y, t, h),
              b = x.x - e.x,
              V = x.y - e.y,
              T = x.z - e.z,
              A = b * b + V * V + T * T;
            if (
              A > Wn * Wn ||
              (Oi.center.set(x.x, x.y, x.z),
              (Oi.radius = x.len),
              !Rc.intersectsSphere(Oi))
            )
              continue;
            const g = A < 330 * 330,
              M = Bc[g ? x.type : Ef];
            M.n >= M.max ||
              (Xf(M, x, 1, Hi(d, y, n, h, $f)),
              g &&
                rn.push({
                  L: d,
                  k: y,
                  x: x.x,
                  y: x.y,
                  z: x.z,
                  yaw: x.yaw,
                  type: x.type,
                  len: x.len,
                  v: x.v,
                  dir: d.dir,
                  ax: d.ax,
                  d2: A,
                }));
          }
        }
    }
  Wi.aloft = o;
  for (const i of Di)
    ((i.g.instanceCount = i.n),
      i.ib.clearUpdateRanges(),
      i.ib.addUpdateRange(0, i.n * Ea),
      (i.ib.needsUpdate = !0));
  (rn.sort((i, c) => i.d2 - c.d2), (El.length = 0));
  for (let i = 0; i < Math.min(6, rn.length); i++) {
    const c = rn[i],
      m = Math.sin(c.yaw),
      d = Math.cos(c.yaw);
    El.push({
      x: c.x - m * (c.len * 0.5 + 5),
      y: c.y + 1,
      z: c.z - d * (c.len * 0.5 + 5),
      dx: 0,
      dy: -1,
      dz: 0,
      c: [1, 0.06, 0.03],
      i: 0.8,
      omni: 1,
      r: 18,
      k: 0.9,
      pri: 1.3,
      ns: 1,
    });
  }
}
const El = [];
function Xf(t, e, n, o = e) {
  const a = t.a,
    s = t.n * Ea;
  ((a[s] = e.x),
    (a[s + 1] = e.y),
    (a[s + 2] = e.z),
    (a[s + 3] = e.yaw),
    (a[s + 4] = e.pitch),
    (a[s + 5] = e.roll),
    (a[s + 6] = e.tone),
    (a[s + 7] = e.brake),
    (a[s + 8] = n),
    (a[s + 9] = e.seed),
    (a[s + 10] = e.type),
    (a[s + 11] = e.sc),
    (a[s + 12] = e.tone2),
    (a[s + 13] = e.belt),
    (a[s + 14] = 0),
    (a[s + 15] = 0),
    (a[s + 16] = o.x),
    (a[s + 17] = o.y),
    (a[s + 18] = o.z),
    (a[s + 19] = o.yaw),
    (a[s + 20] = o.pitch),
    (a[s + 21] = o.roll),
    t.n++);
}
const Ce = [
    47.5, 66.5, 85.5, 104.5, 123.5, 142.5, 161.5, 180.5, 199.5, 218.5, 237.5,
    256.5, 275.5, 294.5,
  ],
  Gc = 9,
  qi = 312,
  Ki = 430,
  v = {
    s: 0,
    v: 38,
    route: [],
    end: null,
    pos: new f.Vector3(),
    fwd: new f.Vector3(0, 0, 1),
    yaw: 0,
    pitch: 0,
    roll: 0,
    y: 104.5,
    alt: [],
    dive: 0,
    seg: null,
    lat: 0,
    latV: 0,
    vy: 0,
    man: !1,
    yT: null,
    homeY: 104.5,
    pathYaw: 0,
    frozen: !1,
    yoke: 0,
  },
  Ut = { x: 0, y: 0, boost: 0, heldT: 0, side: 0, told: 0, turned: 0 };
let Ge = null;
function Ui(t) {
  ((v.route.length = 0),
    (v.alt.length = 0),
    (v.s = 0),
    (v.v = 38),
    (v.lat = v.latV = v.vy = v.yoke = 0),
    (v.man = !1),
    (v.yT = null),
    (v.homeY = 104.5));
  let e = 1,
    n = 0,
    o = 1,
    a = It * 0.5 + 20,
    s = 104.5;
  if (t && t.x != null) {
    const l = Math.sin(t.h),
      r = Math.cos(t.h);
    ((e = Math.abs(l) >= Math.abs(r) ? 1 : 0),
      (o = Math.sign(e ? l : r) || 1),
      (n = Math.round((e ? t.z : t.x) / It)),
      (a = (e ? t.x : t.z) + o * (t.view === "seat" ? 0 : 13)),
      (s = Math.min(
        Ki,
        Math.max(Ce[0], t.y - (t.view === "seat" ? 1.1 : 3.5)),
      )));
  }
  for (
    v.end = { ax: e, L: n, d: o, pos: a, s: 0 },
      t && t.x != null && s >= qi
        ? (v.alt.push([0, Ce[Ce.length - 1]]), (v.man = !0), (v.y = v.yT = s))
        : ((s = Pa(s)), v.alt.push([0, s]), (v.homeY = s));
    Ll() < 2200;
  )
    zs();
}
function Hc(t) {
  if (!t) return;
  (t.seed && t.seed !== $e && ir(t.seed),
    t.sky && Ts[t.sky] && t.sky !== wt.name && Sa(t.sky, !0));
  const e = t.anime && hr[t.anime] ? t.anime : t.x != null ? "off" : null;
  (e && e !== be.style && Ds(e, !0),
    t.x != null &&
      ((Ct = null),
      (Yt = null),
      (p.uPick.value = -1),
      Vt.on && ks(!1, !0),
      Bt.on && Fa(!1, !0),
      Ui(t),
      (Ba.length = 0),
      (z.cut = !0),
      t.view === "drone"
        ? (Ae("drone"),
          z.dPos.set(t.x, t.y, t.z),
          (z.dYaw = t.h + Math.PI),
          (z.dPitch = t.p))
        : Ae(t.view === "seat" ? "cockpit" : "chase"),
      Ot("A shared spot in seed " + $e + " \xB7 R to fly on from here")));
}
const Qf = new f.Vector3();
let Oc = -9,
  Wc = "";
function qc() {
  const t = et.getWorldDirection(Qf),
    e = z.mode === "drone" ? "drone" : Ze() ? "seat" : "chase",
    n = et.position;
  return `seed=${$e}&sky=${wt.name}&view=${e}&at=${n.x.toFixed(1)},${n.y.toFixed(1)},${n.z.toFixed(1)}&look=${Math.round((Math.atan2(t.x, t.z) * 180) / Math.PI)},${Math.round((Math.asin(Math.max(-1, Math.min(1, t.y))) * 180) / Math.PI)}${be.style !== "off" ? "&anime=" + be.style : ""}`;
}
function Yi() {
  const t = new URL(location.href);
  return (t.searchParams.delete("seed"), (t.hash = qc()), t.toString());
}
function Kc(t) {
  if (!ja || (!t && Nt - Oc < 1)) return;
  Oc = Nt;
  const e = qc();
  if (!(e === Wc && !t)) {
    Wc = e;
    try {
      history.replaceState(history.state, "", Yi());
    } catch {}
  }
}
addEventListener("hashchange", () => Hc(p0(location.hash)));
function Ll() {
  return v.end.s - v.s;
}
const Ho = (() => {
  const o = Math.PI / 2 / 0.7,
    a = (i) =>
      i < 0.3
        ? Math.sin((Math.PI * i) / (2 * 0.3)) ** 2
        : i > 1 - 0.3
          ? Math.sin((Math.PI * (1 - i)) / (2 * 0.3)) ** 2
          : 1,
    s = new Float32Array(257 * 4);
  let l = 0,
    r = 0,
    u = 0;
  for (let i = 0; i <= 4096; i++) {
    if (i) {
      const c = o * a((i - 0.5) / 4096),
        m = l + c / 4096 / 2;
      ((r += Math.cos(m) / 4096), (u += Math.sin(m) / 4096), (l += c / 4096));
    }
    if (i % (4096 / 256) === 0) {
      const c = (i / 16) * 4;
      ((s[c] = r),
        (s[c + 1] = u),
        (s[c + 2] = l),
        (s[c + 3] = o * a(i / 4096)));
    }
  }
  for (let i = 0; i < s.length; i += 4)
    ((s[i] = s[i] / r - 1), (s[i + 1] /= r), (s[i + 3] *= r));
  return { T: s, N: 256, len: 1 / r, rMin: 1 / (o * r) };
})();
function Zf(t, e) {
  if (t <= 0 || e <= 0) return 0;
  const n = Ho.T;
  let o = 1e9;
  for (let a = 4; a < n.length - 4; a += 4) {
    const s = n[a],
      l = n[a + 1];
    s < 0 && l > 0 && (o = Math.min(o, Math.max(e / -s, t / l)));
  }
  return o;
}
function $i(t) {
  const e =
      t.d > 0
        ? Math.floor(t.pos / It + 1e-6) + 1
        : Math.ceil(t.pos / It - 1e-6) - 1,
    n = e * It,
    o = Math.min(70, Zf(Ue(t.ax, t.L) / 2 - 13, Ue(1 - t.ax, e) / 2 - 13));
  return {
    m: e,
    cc: n,
    D: o,
    canTurn: o >= 16 && Math.abs(n - t.pos) > o + 30,
  };
}
function zs(t = 0, e = !1) {
  const n = v.end,
    o = Fr(
      n.L * 31 + n.ax,
      Math.floor(n.pos / It) * 7 + n.d,
      991 + v.route.length,
    ),
    { m: a, cc: s, D: l, canTurn: r } = $i(n),
    u = { ...n };
  let i = r && o() < (Bt.on && l < 45 ? 0.14 : 0.42) ? (o() < 0.5 ? 1 : -1) : 0;
  t && r && (i = n.ax === 0 ? t * n.d : -t * n.d);
  const c = i ? s - n.d * l : s,
    m = ji(n.ax, n.L, n.pos),
    d = ji(n.ax, n.L, c),
    h = Math.abs(c - n.pos),
    y = {
      kind: "line",
      s0: n.s,
      len: h,
      x0: m[0],
      z0: m[1],
      ux: d[0] - m[0],
      uz: d[1] - m[1],
      ax: n.ax,
      L: n.L,
      beg: u,
    };
  v.route.push(y);
  const x = Sn(n.s),
    b = o();
  if (!e && h > 150 && b < 0.75) {
    const V = Ce.indexOf(Pa(x));
    let T = Q(V + Math.round((o() - 0.5) * 7), 0, Math.max(Gc, V));
    const A = n.s + Math.min(60, h * 0.25),
      g = n.s + h - Math.min(60, h * 0.25),
      M = v.alt.length ? v.alt[v.alt.length - 1][0] : -1,
      L = Math.max(1, Math.floor((g - A) / 2.2 / 19));
    ((T = Q(T, V - L, V + L)),
      A > M + 1 && x < qi && v.alt.push([A, x], [g, Ce[T]]));
  }
  if (((n.s += h), (n.pos = c), (y.end = { ...n }), i)) {
    const V = n.ax === 0 ? [0, n.d] : [n.d, 0],
      T = n.ax === 0 ? [i, 0] : [0, i],
      A = ji(n.ax, n.L, s),
      g = Ho.len * l;
    (v.route.push({
      kind: "turn",
      s0: n.s,
      len: g,
      ix: A[0],
      iz: A[1],
      D: l,
      ux: V[0],
      uz: V[1],
      wx: T[0],
      wz: T[1],
      side: V[1] * T[0] - V[0] * T[1],
    }),
      (n.s += g));
    const M = 1 - n.ax,
      L = a,
      C = i;
    ((n.ax = M),
      (n.L = L),
      (n.d = C),
      (n.pos = (M === 0 ? A[1] : A[0]) + C * l),
      (v.route[v.route.length - 1].end = { ...n }));
  }
}
function Jf(t) {
  const e = v.route,
    n = e.findIndex((i) => v.s < i.s0 + i.len);
  if (n < 0) return !1;
  const o = e[n];
  if (o.kind !== "line") return !1;
  const a = e[n + 1];
  if (a && a.kind === "turn" && a.side === t) return !1;
  const s = o.beg,
    l = $i(s);
  if (!l.canTurn || s.s + Math.abs(l.cc - s.d * l.D - s.pos) < v.s + 22)
    return !1;
  const u = v.man ? v.y : Sn(v.s);
  if (((e.length = n), (v.end = { ...s }), !v.man)) {
    const i = v.alt.filter((m) => m[0] <= v.s),
      c = v.alt.find((m) => m[0] > v.s);
    ((v.alt.length = 0), v.alt.push(...i, c || [v.s, u]));
  }
  for (zs(t, !0); Ll() < 2200;) zs();
  return !0;
}
function ji(t, e, n) {
  return t === 0 ? [e * It, n] : [n, e * It];
}
function Pa(t) {
  let e = Ce[0];
  for (const n of Ce) Math.abs(n - t) < Math.abs(e - t) && (e = n);
  return e;
}
function Sn(t) {
  const e = v.alt;
  if (!e.length) return v.y;
  if (t <= e[0][0]) return e[0][1];
  for (let n = 1; n < e.length; n++)
    if (t <= e[n][0]) {
      const [o, a] = e[n - 1],
        [s, l] = e[n],
        r = Ir(o, s, t);
      return ne(a, l, r);
    }
  return e[e.length - 1][1];
}
function Uc(t) {
  const e = v.alt;
  for (let n = 1; n < e.length; n++) if (t <= e[n][0]) return e[n - 1][1];
  return e.length ? e[e.length - 1][1] : v.y;
}
const th = { x: 0, z: 0, tx: 0, tz: 1, k: 0 };
function Ia(t, e = th) {
  const n = v.route;
  let o = n[n.length - 1];
  for (let s = 0; s < n.length; s++)
    if (t < n[s].s0 + n[s].len) {
      o = n[s];
      break;
    }
  const a = Q(t - o.s0, 0, o.len);
  if (o.kind === "line") {
    const s = o.len > 0 ? a / o.len : 0;
    ((e.x = o.x0 + o.ux * s), (e.z = o.z0 + o.uz * s));
    const l = Math.hypot(o.ux, o.uz) || 1;
    ((e.tx = o.ux / l), (e.tz = o.uz / l), (e.k = 0));
  } else {
    const s = Ho.T,
      l = (a / o.len) * Ho.N,
      r = Math.min(Ho.N - 1, Math.floor(l)),
      u = l - r,
      i = r * 4,
      c = ne(s[i], s[i + 4], u) * o.D,
      m = ne(s[i + 1], s[i + 5], u) * o.D,
      d = ne(s[i + 2], s[i + 6], u),
      h = Math.cos(d),
      y = Math.sin(d);
    ((e.x = o.ix + o.ux * c + o.wx * m),
      (e.z = o.iz + o.uz * c + o.wz * m),
      (e.tx = o.ux * h + o.wx * y),
      (e.tz = o.uz * h + o.wz * y),
      (e.k = (o.side * ne(s[i + 3], s[i + 7], u)) / o.D));
  }
  return ((e.seg = o), e);
}
function Pl(t) {
  for (const e of v.route) if (e.kind === "turn" && e.s0 + e.len > t) return e;
  return null;
}
function Yc(t) {
  const e = Pl(t);
  return e ? Math.max(0, e.s0 - t) : 1e4;
}
const $c = (t) =>
  Q(Math.sqrt((Bt.on ? 22 : 14.5) * t.D * Ho.rMin), 12, Bt.on ? 60 : 40);
function eh(t, e) {
  if (t.kind === "turn") return 3.5;
  let n = Ue(t.ax, t.L) / 2 - 9.5;
  for (const o of Gi(t.ax, t.L))
    Math.abs(o.y - e) < 8.5 && (n = Math.min(n, Math.abs(o.off) - 5.5));
  return Math.max(0, n);
}
const i5 = ["a", "d", "arrowleft", "arrowright"],
  jc = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
function nh() {
  let t = 0,
    e = 0;
  (z.mode !== "drone" &&
    !Ct &&
    ((Ht.has("a") || Ht.has("arrowleft")) && (t -= 1),
    (Ht.has("d") || Ht.has("arrowright")) && (t += 1),
    (Ht.has("w") || Ht.has("arrowup")) && (e += 1),
    (Ht.has("s") || Ht.has("arrowdown")) && (e -= 1),
    Ge && ((t += Ge.x), (e += Ge.y))),
    (Ut.x = Q(t, -1, 1)),
    (Ut.y = Q(e, -1, 1)),
    (Ut.boost = Ht.has("shift") && z.mode !== "drone" && !Ct ? 1 : 0));
}
function oh(t) {
  (v.route.length || Ui(), v.frozen && (t = 0), nh());
  const e = Pl(v.s),
    n = e ? Math.max(0, e.s0 - v.s) : 1e4,
    o = e ? $c(e) : 40;
  let a = Math.min(
    Ut.boost ? 66 : 40,
    Math.sqrt(
      o * o + 2 * (Ut.boost ? 7 : 4.5) * Math.max(0, n - 6 - v.v * 0.25),
    ),
  );
  Bt.on &&
    (a = Math.max(
      a,
      Math.min(150, Math.sqrt(o * o + 76 * Math.max(0, n - 8 - v.v * 0.3))),
    ));
  const s = Vt.on || Vt.door > 0;
  for (
    s && (a = 0),
      v.v +=
        (a - v.v) *
        (1 -
          Math.exp(
            -t *
              (s ? 1.35 : Bt.on ? (a < v.v ? 4 : 0.7) : Ut.boost ? 1.2 : 1.6),
          )),
      s && v.v < 0.05 && (v.v = 0),
      v.s += v.v * t;
    Ll() < 2200;
  )
    zs();
  for (; v.route.length > 3 && v.route[1].s0 + v.route[1].len < v.s - 400;)
    v.route.shift();
  for (; v.alt.length > 3 && v.alt[2][0] < v.s - 400;) v.alt.shift();
  if (Math.abs(Ut.x) > 0.5 && t > 0) {
    Ut.heldT += t;
    const x = Ut.x > 0 ? -1 : 1;
    if (Ut.heldT > 0.3 && x !== Ut.side) {
      const b = v.route,
        V = b.findIndex((A) => v.s < A.s0 + A.len),
        T = b[V];
      if (T && T.kind === "line") {
        const A = $i(T.beg),
          g = T.beg.s + Math.abs(A.cc - T.beg.d * A.D - T.beg.pos) - v.s;
        A.canTurn &&
          g > 22 &&
          g < 175 &&
          Jf(x) &&
          ((Ut.side = x),
          Ut.turned++,
          Ot(
            x > 0
              ? "Turning left at the next crossing"
              : "Turning right at the next crossing",
          ));
      }
    }
  } else ((Ut.heldT = 0), (Ut.side = 0));
  const l = Ia(v.s);
  let r;
  if (
    (Ut.y &&
      t > 0 &&
      (v.man ||
        ((v.man = !0),
        (v.vy = (Sn(v.s + 1) - Sn(v.s)) * v.v),
        (v.y = Sn(v.s)),
        (v.homeY = Uc(v.s))),
      (v.yT = null),
      (v.vy += (Ut.y * 14 - v.vy) * (1 - Math.exp(-t * 2.6)))),
    v.man)
  ) {
    if (!Ut.y) {
      if (v.yT === null) {
        const x = v.y;
        v.yT =
          x >= qi
            ? x
            : v.vy > 0.8
              ? (Ce.find((b) => b > x + 1) ?? Ce[Ce.length - 1])
              : v.vy < -0.8
                ? ([...Ce].reverse().find((b) => b < x - 1) ?? Ce[0])
                : Pa(x);
      }
      ((v.vy += ((v.yT - v.y) * 2.4 - v.vy * 3.1) * t),
        Math.abs(v.yT - v.y) < 0.05 &&
          Math.abs(v.vy) < 0.05 &&
          ((v.man = !1),
          (v.y = v.yT),
          (v.homeY = v.yT),
          (v.alt.length = 0),
          v.alt.push([v.s, v.y])));
    }
    ((v.y = Q(v.y + v.vy * t, 45, Ki)),
      ((v.y <= 45 && v.vy < 0) || (v.y >= Ki && v.vy > 0)) && (v.vy = 0),
      (r = v.y));
  } else
    ((r = Sn(v.s)),
      (v.y = r),
      (v.homeY = Uc(v.s)),
      (v.vy = t > 0 ? (Sn(v.s + v.v * t) - r) / t : 0));
  const u = eh(l.seg, r);
  if (
    (Ut.x
      ? (v.latV += (Ut.x * 15 - v.latV) * (1 - Math.exp(-t * 3.2)))
      : (v.latV += (-v.lat * 1.5 - v.latV * 2.45) * t),
    (v.lat += v.latV * t),
    Math.abs(v.lat) > u)
  ) {
    const x = Math.sign(v.lat) * u;
    ((v.lat = ne(v.lat, x, 1 - Math.exp(-t * 7))),
      v.latV * v.lat > 0 && (v.latV *= Math.exp(-t * 9)));
  }
  const i = -l.tz,
    c = l.tx,
    m = Vt.k * (Math.sin(Dt * 1.25) * 0.055 + Math.sin(Dt * 2.9 + 1) * 0.015);
  (v.pos.set(l.x + i * v.lat, r + m, l.z + c * v.lat),
    (v.pathYaw = Math.atan2(l.tx, l.tz)),
    (v.yaw = v.pathYaw - Math.atan2(v.latV, Math.max(v.v, 5)) * 0.9));
  const d = Math.atan(2.9 * l.k) * 16 + Q((v.yaw - v.pathYaw) * 2.5, -1.6, 1.6);
  v.yoke += (2 * Math.tanh(d / 2) - v.yoke) * (1 - Math.exp(-t * 14));
  const h =
      Q(
        -Math.atan((v.v * v.v * l.k) / 9.81) * 0.8 + v.latV * 0.03 + Ut.x * 0.1,
        -1.15,
        1.15,
      ) +
      Vt.k * Math.sin(Dt * 0.83) * 0.014,
    y =
      Math.atan2(v.vy, Math.max(v.v, 5)) * 0.85 -
      0.035 +
      Vt.k * (Math.sin(Dt * 1.1 + 2) * 0.008 + 0.025);
  ((v.roll += (h - v.roll) * (1 - Math.exp(-t * 3.2))),
    (v.pitch += (y - v.pitch) * (1 - Math.exp(-t * 3))),
    v.fwd.set(
      Math.sin(v.yaw) * Math.cos(v.pitch),
      Math.sin(v.pitch),
      Math.cos(v.yaw) * Math.cos(v.pitch),
    ));
}
const Xc = (() => {
    const t = new Float32Array(Ea),
      e = new f.InstancedInterleavedBuffer(t, Ea);
    e.setUsage(f.DynamicDrawUsage);
    const n = new f.InstancedBufferGeometry(),
      o = he[Ca].geo;
    for (const l of ["position", "normal", "aM", "aD"])
      n.setAttribute(l, o.attributes[l]);
    for (const [l, r] of [
      ["iP", 0],
      ["iQ", 4],
      ["iE", 8],
      ["iF", 12],
      ["iG", 16],
      ["iH", 20],
    ])
      n.setAttribute(l, new f.InterleavedBufferAttribute(e, 4, r));
    ((n.instanceCount = 1),
      (n.boundingSphere = new f.Sphere(new f.Vector3(), 1e5)));
    const a = new f.Mesh(n, Ri);
    ((a.frustumCulled = !1), ze.add(a), zi(a));
    const s = new f.Mesh(n, Hf);
    return (
      (s.frustumCulled = !1),
      ze.add(s),
      { a: t, ib: e, g: n, m: a, mi: s }
    );
  })(),
  Ba = [];
function ah() {
  const t = Xc.a,
    e = v.pos;
  Ba.length || Ba.push(e.x, e.y, e.z, v.yaw, v.pitch, v.roll);
  for (let s = 0; s < 6; s++) t[16 + s] = Ba[s];
  (Ba.splice(0, 6, e.x, e.y, e.z, v.yaw, v.pitch, v.roll),
    (t[0] = e.x),
    (t[1] = e.y),
    (t[2] = e.z),
    (t[3] = v.yaw),
    (t[4] = v.pitch),
    (t[5] = v.roll),
    (t[6] = 0.69),
    (t[7] = v.v < 30 ? 1 : 0),
    (t[8] = 1.25),
    (t[9] = 0.123456),
    (t[10] = Ca),
    (t[11] = 1),
    (t[12] = -1),
    (t[13] = 9),
    (t[14] = Qi()),
    (Xc.ib.needsUpdate = !0));
  const n = v.fwd,
    o = Math.sin(v.yaw),
    a = Math.cos(v.yaw);
  El.push(
    {
      x: e.x - o * 8,
      y: e.y + 0.9,
      z: e.z - a * 8,
      dx: 0,
      dy: -1,
      dz: 0,
      c: [1, 0.05, 0.03],
      i: 1,
      omni: 1,
      r: 26,
      k: 0.9,
      pri: 3,
      ns: 1,
    },
    {
      x: e.x,
      y: e.y - 0.6,
      z: e.z,
      dx: 0,
      dy: -1,
      dz: 0,
      c: [0.3, 0.6, 1],
      i: 0.9,
      omni: 1,
      r: 16,
      k: 2.4,
      pri: 3,
      ns: 1,
    },
    {
      x: e.x + o * 2.7,
      y: e.y + 0.55,
      z: e.z + a * 2.7,
      dx: n.x,
      dy: n.y - 0.06,
      dz: n.z,
      c: [0.95, 0.97, 1],
      i: 1.4,
      r: 110,
      k: 9,
      cut: 0.9,
      pri: 3,
    },
  );
}
const Ss = 8e3,
  Il = new Float32Array(Ss * 3),
  Qc = new Float32Array(Ss),
  Bl = new Float32Array(Ss * 3),
  Oo = new Uint32Array(Ss * 3),
  pn = new f.BufferGeometry();
for (const [t, e, n] of [
  ["position", Il, 3],
  ["rs", Qc, 1],
  ["color", Bl, 3],
]) {
  const o = new f.BufferAttribute(e, n);
  (o.setUsage(f.DynamicDrawUsage), pn.setAttribute(t, o));
}
{
  const t = new f.BufferAttribute(Oo, 1);
  (t.setUsage(f.DynamicDrawUsage), pn.setIndex(t));
}
(pn.setDrawRange(0, 0),
  (pn.boundingSphere = new f.Sphere(new f.Vector3(), 1e6)));
const Fl = new f.Scene(),
  qn = new f.PerspectiveCamera(62, 1, 0.4, 5600),
  Nl = { W: kt(ce), C: kt(Et("color", "vec3")), S: kt(Et("rs", "float")) },
  Zc = (t) => {
    const e = at(t).oneMinus();
    return { glow: Ft(e, 2.2), core: Ft(e, 14) };
  },
  sh = li(
    ce,
    At(() => {
      const t = Nl.W,
        e = oe(t.sub(de)).toVar(),
        { glow: n, core: o } = Zc(Nl.S),
        a = Q(ai(kr).sub(si(t)).div(1.5), 0, 1),
        s = Kt(ds(de, t.sub(de).div(Z(e, 0.001)), e).negate()),
        l = Nl.C.mul(n.add(o.mul(1.6))).add(w(nn(Nl.C)).mul(o).mul(0.5));
      return nt(l.mul(a).mul(s).mul(p.uBlue.oneMinus()), 1);
    })(),
  ),
  Xi = new f.Mesh(pn, sh);
((Xi.frustumCulled = !1), Fl.add(Xi));
const xe = { nv: 0, ni: 0 };
function Rl(t, e, n) {
  const o = t.length / 3;
  if (o < 2 || xe.nv + o * 2 > Ss) return;
  const a = et.position,
    s = xe.nv;
  for (let l = 0; l < o; l++) {
    const r = Math.max(0, l - 1),
      u = Math.min(o - 1, l + 1),
      i = t[u * 3] - t[r * 3],
      c = t[u * 3 + 1] - t[r * 3 + 1],
      m = t[u * 3 + 2] - t[r * 3 + 2],
      d = t[l * 3],
      h = t[l * 3 + 1],
      y = t[l * 3 + 2],
      x = a.x - d,
      b = a.y - h,
      V = a.z - y;
    let T = c * V - m * b,
      A = m * x - i * V,
      g = i * b - c * x;
    const M = Math.hypot(T, A, g) || 1,
      L = e[l] / M;
    ((T *= L), (A *= L), (g *= L));
    for (const C of [1, -1]) {
      const E = xe.nv * 3;
      ((Il[E] = d + T * C),
        (Il[E + 1] = h + A * C),
        (Il[E + 2] = y + g * C),
        (Qc[xe.nv] = C),
        (Bl[E] = n[l * 3]),
        (Bl[E + 1] = n[l * 3 + 1]),
        (Bl[E + 2] = n[l * 3 + 2]),
        xe.nv++);
    }
    if (l > 0) {
      const C = s + l * 2;
      ((Oo[xe.ni++] = C - 2),
        (Oo[xe.ni++] = C - 1),
        (Oo[xe.ni++] = C),
        (Oo[xe.ni++] = C - 1),
        (Oo[xe.ni++] = C + 1),
        (Oo[xe.ni++] = C));
    }
  }
}
const Dl = (t) => (t * 0.0011 * et.fov) / 62,
  Bt = { on: !1, k: 0, trail: [[], []], arcs: [], arcAt: -9 },
  Jc = 1.5,
  co = new f.Euler(),
  ve = new f.Vector3(),
  u5 = new f.Vector3();
function Wo(t, e, n, o) {
  return (
    co.set(-v.pitch, v.yaw, v.roll, "YXZ"),
    o.set(t, e, n).applyEuler(co).add(v.pos)
  );
}
function Fa(t, e) {
  ((Bt.on = t === void 0 ? !Bt.on : !!t),
    tt("#b-turbo").classList.toggle("on", Bt.on),
    tt("#b-turbo").setAttribute("aria-pressed", Bt.on),
    Bt.on && Vt.on && ks(!1, !0),
    Bt.on && Ct && ((Ct = null), (z.cut = !0)),
    !e &&
      (Ot(
        Bt.on
          ? Vt.door > 0.01
            ? "Turbo: the doors come down, then the drive opens wide \xB7 \u21E7T to ease off"
            : "Turbo: the electric drive wide open \xB7 \u21E7T to ease off"
          : "Turbo off",
      ),
      Jo(Bt.on ? "turbo" : "lock")));
}
const Vt = { on: !1, door: 0, k: 0, cam: !1, open: !1 },
  lh = 1.9,
  Qi = () => {
    const t = Vt.door;
    return lh * t * t * (3 - 2 * t);
  };
function ks(t, e) {
  ((Vt.on = t === void 0 ? !Vt.on : !!t),
    tt("#b-hover").classList.toggle("on", Vt.on),
    tt("#b-hover").setAttribute("aria-pressed", Vt.on),
    Vt.on &&
      (Bt.on && Fa(!1, !0),
      Ct && ((Ct = null), (z.cut = !0)),
      z.mode === "chase" &&
        Math.abs(z.orbYaw) < 0.05 &&
        !z.pan.x &&
        !z.pan.y &&
        (Vt.cam = !0)),
    !e &&
      (Ot(
        Vt.on
          ? "Hovering: it stops here and opens its doors \xB7 \u21E7H to fly on"
          : "Doors down, flying on",
      ),
      Jo("lock")));
}
function rh(t) {
  const e = Vt.on && v.v < 1.6 ? 1 : 0;
  ((Vt.door = Q(Vt.door + (e ? t / 2.2 : -t / 1.6), 0, 1)),
    (Vt.k += ((Vt.on ? 1 : 0) - Vt.k) * (1 - Math.exp(-t * 1.2))),
    Vt.k < 0.001 && (Vt.k = 0),
    e && !Vt.open
      ? ((Vt.open = !0), Jo("door", 2.2))
      : !e && Vt.open && Vt.door < 0.999 && ((Vt.open = !1), Jo("door", 1.6)));
}
function ih(t, e, n) {
  let o = [t, e];
  for (let a = 0; a < 3; a++) {
    const s = [o[0]];
    for (let l = 0; l + 1 < o.length; l++) {
      const r = o[l],
        u = o[l + 1];
      s.push(
        [
          (r[0] + u[0]) / 2 + (Math.random() - 0.5) * n,
          (r[1] + u[1]) / 2 + (Math.random() - 0.5) * n * 0.6,
          (r[2] + u[2]) / 2 + (Math.random() - 0.5) * n,
        ],
        u,
      );
    }
    ((o = s), (n *= 0.55));
  }
  return o;
}
const uh = [
  [
    [0.78, 0.21, 1.5],
    [0.8, 0.21, -1.55],
  ],
  [
    [-0.78, 0.21, 1.5],
    [-0.8, 0.21, -1.55],
  ],
  [
    [0.8, 0.2, -1.55],
    [-0.8, 0.2, -1.55],
  ],
  [
    [0.8, 0.22, -1.6],
    [0.45, 0.32, -3.4],
  ],
  [
    [-0.8, 0.22, -1.6],
    [-0.45, 0.32, -3.4],
  ],
  [
    [0.62, 0.3, 1.2],
    [-0.62, 0.3, 1.3],
  ],
  [
    [1.04, 0.5, 1.6],
    [1.05, 0.5, -1.7],
  ],
  [
    [-1.04, 0.5, 1.6],
    [-1.05, 0.5, -1.7],
  ],
  [
    [0.83, 0.86, -2.38],
    [-0.83, 0.86, -2.38],
  ],
  [
    [0.9, 0.9, -2.2],
    [0.3, 1.02, -1.8],
  ],
  [
    [-0.9, 0.9, -2.2],
    [-0.3, 1.02, -1.8],
  ],
];
function ch(t) {
  const e = Bt.on ? 1 : 0;
  ((Bt.k += (e - Bt.k) * (1 - Math.exp(-t * (e ? 2.5 : 1.4)))),
    Bt.k < 0.003 && (Bt.k = 0),
    (p.uTurbo.value = Bt.k));
  for (const [n, o] of [
    [0, 0.8],
    [1, -0.8],
  ]) {
    const a = Bt.trail[n];
    for (
      t > 0 &&
      Bt.k > 0.02 &&
      (Wo(o, 0.86, -2.5, ve),
      a.push({ x: ve.x, y: ve.y, z: ve.z, t: Dt, k: Bt.k }));
      a.length && Dt - a[0].t > Jc;
    )
      a.shift();
    a.length > 260 && a.splice(0, a.length - 260);
  }
  Bt.k > 0.02 &&
    Dt - Bt.arcAt > 0.045 &&
    ((Bt.arcAt = Dt),
    (Bt.arcs = uh
      .filter(() => Math.random() < 0.75)
      .map(([n, o]) => ih(n, o, 0.42))));
}
function dh() {
  xe.nv = xe.ni = 0;
  const t = et.position,
    e = Bt.k;
  for (const n of Bt.trail) {
    const o = n.length;
    if (o < 2) continue;
    const a = [],
      s = [],
      l = [];
    for (let r = 0; r < o; r++) {
      const u = n[r],
        i = (Dt - u.t) / Jc,
        c = (1 - i) ** 1.5 * u.k,
        m = Math.hypot(u.x - t.x, u.y - t.y, u.z - t.z),
        d = c * Q((m - 3) / 16, 0, 1);
      (a.push(u.x, u.y, u.z),
        s.push(Math.max(0.2 * (0.35 + 0.65 * (1 - i)), Dl(m) * 3)),
        l.push(2.8 * d, 0.06 * d, 0.12 * d));
    }
    Rl(a, s, l);
  }
  if (e > 0.02 && !v.frozen) {
    const n = 0.7 + 0.3 * Math.random();
    for (const o of Bt.arcs) {
      const a = [],
        s = [],
        l = [];
      for (const r of o)
        (Wo(r[0], r[1], r[2], ve),
          a.push(ve.x, ve.y, ve.z),
          s.push(Math.max(0.045, Dl(ve.distanceTo(t)) * 3)),
          l.push(1.6 * e * n, 2.6 * e * n, 4.5 * e * n));
      Rl(a, s, l);
    }
    for (const o of [0.42, -0.42])
      for (let a = 0; a < 3; a++) {
        const s = 1.5 + 1.6 * e + Math.random() * 0.8,
          l = [],
          r = [],
          u = [];
        for (let i = 0; i <= 10; i++) {
          const c = i / 10,
            m = -2.42 - c * s,
            d =
              Math.sin(Dt * 31 + a * 2.1 + c * 9) * 0.09 * c +
              (te.on ? 0 : (Math.random() - 0.5) * 0.08 * c);
          (Wo(
            o + d + (a - 1) * 0.05,
            0.41 + Math.cos(Dt * 27 + a + c * 7) * 0.04 * c,
            m,
            ve,
          ),
            l.push(ve.x, ve.y, ve.z));
          const h = (1 - c) ** 1.3 * e;
          (r.push(Math.max(0.14 * (1 - c * 0.6), Dl(ve.distanceTo(t)) * 2.5)),
            u.push(h * (1.2 + 2 * (1 - c)), h * (2 + 2.2 * (1 - c)), h * 5.5));
        }
        Rl(l, r, u);
      }
  }
  (Ze() && Vh(), pn.setDrawRange(0, xe.ni));
  for (const [n, o] of [
    ["position", 3],
    ["rs", 1],
    ["color", 3],
  ]) {
    const a = pn.attributes[n];
    (a.clearUpdateRanges(),
      a.addUpdateRange(0, xe.nv * o),
      (a.needsUpdate = !0));
  }
  (pn.index.clearUpdateRanges(),
    pn.index.addUpdateRange(0, xe.ni),
    (pn.index.needsUpdate = !0),
    (Xi.visible = xe.ni > 0),
    lu && (lu.visible = xe.ni > 0));
}
const yn = [0.42, 1.07, -0.62],
  kn = { x: -0.03, y: 0.913, z: 0.45, w: 0.33, h: 0.088 },
  _l = [0.56, 1.22],
  Gl = new f.Matrix4().compose(
    new f.Vector3(0.42, 0.565, 0.27),
    new f.Quaternion().setFromEuler(new f.Euler(-0.5, Math.PI, 0)),
    new f.Vector3(1, 1, 1),
  ),
  Gt = { MATTE: 0, LEATHER: 1, ALC: 2, METAL: 3, LIGHT: 4, GLOSS: 5, DASH: 6 };
function Zi(t, e) {
  const n = t.attributes.position,
    o = n.count,
    a = Math.cos((e * Math.PI) / 180),
    s = new Float32Array(o * 3),
    l = (d) =>
      `${Math.round(n.getX(d) * 2e3)},${Math.round(n.getY(d) * 2e3)},${Math.round(n.getZ(d) * 2e3)}`,
    r = new f.Vector3(),
    u = new f.Vector3(),
    i = new f.Vector3(),
    c = new Map();
  for (let d = 0; d < o; d += 3) {
    (r.fromBufferAttribute(n, d),
      u.fromBufferAttribute(n, d + 1),
      i.fromBufferAttribute(n, d + 2));
    const h = u.sub(r).cross(i.sub(r));
    for (let y = 0; y < 3; y++) {
      ((s[(d + y) * 3] = h.x),
        (s[(d + y) * 3 + 1] = h.y),
        (s[(d + y) * 3 + 2] = h.z));
      const x = l(d + y);
      let b = c.get(x);
      (b || c.set(x, (b = [])), b.push(d + y));
    }
  }
  const m = new Float32Array(o * 3);
  for (let d = 0; d < o; d++) {
    const h = s[d * 3],
      y = s[d * 3 + 1],
      x = s[d * 3 + 2],
      b = Math.hypot(h, y, x) || 1;
    let V = 0,
      T = 0,
      A = 0;
    for (const M of c.get(l(d))) {
      const L = s[M * 3],
        C = s[M * 3 + 1],
        E = s[M * 3 + 2],
        R = Math.hypot(L, C, E) || 1;
      (h * L + y * C + x * E) / (b * R) >= a && ((V += L), (T += C), (A += E));
    }
    const g = Math.hypot(V, T, A) || 1;
    ((m[d * 3] = V / g), (m[d * 3 + 1] = T / g), (m[d * 3 + 2] = A / g));
  }
  return (t.setAttribute("normal", new f.BufferAttribute(m, 3)), t);
}
function Kn(t, e, n, o = 0.012, a = 8) {
  const s = new f.Shape();
  s.moveTo(t[0][0], t[0][1]);
  for (let r = 1; r < t.length; r++) s.lineTo(t[r][0], t[r][1]);
  s.closePath();
  const l = new f.ExtrudeGeometry(s, {
    depth: Math.max(0.001, n - o * 2),
    bevelEnabled: o > 0,
    bevelThickness: o,
    bevelSize: o,
    bevelSegments: 3,
    curveSegments: a,
  });
  return (
    l.translate(0, 0, -(n - o * 2) / 2),
    l.rotateY(-Math.PI / 2),
    l.translate(e, 0, 0),
    l.index ? l.toNonIndexed() : l
  );
}
const Un = (t, e = 64) =>
    new f.CatmullRomCurve3(
      t.map(([o, a]) => new f.Vector3(o, a, 0)),
      !0,
      "centripetal",
    )
      .getPoints(e)
      .slice(0, -1)
      .map((o) => [o.x, o.y]),
  Cs = (t, e, n) => {
    const o = new f.Shape(),
      a = -t / 2,
      s = -e / 2;
    return (
      o.moveTo(a + n, s),
      o.lineTo(a + t - n, s),
      o.quadraticCurveTo(a + t, s, a + t, s + n),
      o.lineTo(a + t, s + e - n),
      o.quadraticCurveTo(a + t, s + e, a + t - n, s + e),
      o.lineTo(a + n, s + e),
      o.quadraticCurveTo(a, s + e, a, s + e - n),
      o.lineTo(a, s + n),
      o.quadraticCurveTo(a, s, a + n, s),
      o
    );
  },
  mh = (t) =>
    new f.CatmullRomCurve3(
      [
        [0.79, 0.82, 0.78],
        [0.73, 0.93, 0.5],
        [0.645, 1.075, 0.16],
        [0.575, 1.2, -0.16],
        [0.578, 1.185, -0.6],
        [0.62, 1.15, -1.15],
        [0.7, 1.03, -1.62],
      ].map(([e, n, o]) => new f.Vector3(e * t, n, o)),
      !1,
      "centripetal",
    ),
  Ji = (() => {
    const t = {},
      e = new f.Vector3(),
      n = new f.Vector3();
    let o = "main";
    const a = (T, A, g, M, L = null, C = 35) => {
        const E = (t[o] ??= { P: [], N: [], A: [], E: [], K: [] });
        (T.index && (T = T.toNonIndexed()),
          L && T.applyMatrix4(L),
          C ? Zi(T, C) : T.computeVertexNormals());
        const R = T.attributes.position,
          G = T.attributes.normal;
        for (let H = 0; H < R.count; H++)
          (e.fromBufferAttribute(R, H),
            n.fromBufferAttribute(G, H),
            E.P.push(e.x, e.y, e.z),
            E.N.push(n.x, n.y, n.z),
            E.A.push(...A),
            E.E.push(...g),
            E.K.push(M));
      },
      s = (T, A, g, M, L, C) => new f.BoxGeometry(M, L, C).translate(T, A, g),
      l = (T, A, g, M = 0, L = 0, C = 0) =>
        new f.Matrix4().compose(
          new f.Vector3(T, A, g),
          new f.Quaternion().setFromEuler(new f.Euler(M, L, C)),
          new f.Vector3(1, 1, 1),
        ),
      r = [0.034, 0.035, 0.04],
      u = [0.05, 0.051, 0.056],
      i = [0.3, 0.135, 0.06],
      c = [0, 0, 0],
      m = [0.25, 0.95, 1.3],
      d = [1.3, 0.62, 0.18];
    (a(
      s(0, 0.33, -0.3, 1.92, 0.04, 2.3),
      [0.028, 0.028, 0.031],
      c,
      Gt.MATTE,
      null,
      0,
    ),
      a(s(0, 0.6, 0.8, 1.84, 0.5, 0.06), r, c, Gt.MATTE, null, 0));
    {
      const A = new f.Shape(),
        g = Go(1, -1.38) * 0.96;
      (A.moveTo(-g, 0.31), A.lineTo(g, 0.31));
      for (let M = g; M >= -g - 1e-6; M -= g / 24)
        A.lineTo(M, Math.min(1.25, zc(M, -1.38) - 0.03));
      a(
        new f.ExtrudeGeometry(A, { depth: 0.06, bevelEnabled: !1 }).translate(
          0,
          0,
          -1.38 - 0.03,
        ),
        r,
        c,
        Gt.MATTE,
        null,
        0,
      );
    }
    (a(
      new f.BoxGeometry(1.9, 0.45, 1.55, 8, 1, 16).translate(0, 0.675, 1.57),
      r,
      c,
      Gt.MATTE,
      null,
      0,
    ),
      a(
        Kn(
          Un(
            [
              [0.8, 0.8],
              [0.8, 0.835],
              [0.62, 0.85],
              [0.47, 0.842],
              [0.425, 0.822],
              [0.42, 0.8],
              [0.36, 0.63],
              [0.37, 0.55],
              [0.44, 0.47],
              [0.8, 0.45],
            ],
            96,
          ),
          0,
          1.86,
          0.014,
        ),
        u,
        c,
        Gt.DASH,
      ),
      a(s(0, 0.796, 0.415, 1.74, 0.007, 0.012), c, m, Gt.LIGHT, null, 0),
      a(
        new f.BoxGeometry(1.66, 0.2, 0.012),
        [0.012, 0.012, 0.014],
        c,
        Gt.GLOSS,
        l(0, 0.716, 0.377, 0.35, 0, 0),
        0,
      ),
      a(
        Kn(
          Un(
            [
              [0.4, 0.45],
              [0.38, 0.53],
              [0.18, 0.575],
              [-0.3, 0.59],
              [-0.86, 0.59],
              [-0.9, 0.55],
              [-0.88, 0.36],
              [0.4, 0.36],
            ],
            64,
          ),
          0,
          0.27,
          0.018,
        ),
        u,
        c,
        Gt.MATTE,
      ),
      a(
        new f.TorusGeometry(0.048, 0.007, 8, 48),
        c,
        d,
        Gt.LIGHT,
        l(0, 0.594, -0.12, -Math.PI / 2, 0, 0),
        70,
      ),
      a(
        new f.CylinderGeometry(0.038, 0.04, 0.012, 32),
        [0.015, 0.015, 0.017],
        c,
        Gt.GLOSS,
        l(0, 0.598, -0.12),
        50,
      ));
    for (const T of [1, -1])
      a(
        s(T * 0.138, 0.585, -0.25, 0.006, 0.006, 1.1),
        [0.6, 0.6, 0.62],
        c,
        Gt.METAL,
        null,
        0,
      );
    for (const T of [1, -1]) {
      const A = T * 0.93;
      ((o = T > 0 ? "dr" : "dl"),
        a(
          Kn(
            Un(
              [
                [0.6, 0.5],
                [0.6, 0.8],
                [0.5, 0.845],
                [-0.8, 0.845],
                [-0.86, 0.8],
                [-0.86, 0.5],
              ],
              48,
            ),
            A,
            0.06,
            0.012,
          ),
          r,
          c,
          Gt.MATTE,
        ),
        a(
          Kn(
            Un(
              [
                [0.46, 0.7],
                [0.46, 0.8],
                [-0.76, 0.8],
                [-0.76, 0.7],
              ],
              32,
            ),
            A - T * 0.035,
            0.03,
            0.008,
          ),
          i,
          c,
          Gt.LEATHER,
        ),
        a(
          Kn(
            Un(
              [
                [-0.12, 0.655],
                [-0.14, 0.695],
                [-0.78, 0.7],
                [-0.8, 0.66],
                [-0.74, 0.64],
                [-0.2, 0.64],
              ],
              48,
            ),
            A - T * 0.07,
            0.1,
            0.015,
          ),
          i,
          c,
          Gt.LEATHER,
        ),
        a(
          s(A - T * 0.03, 0.852, -0.13, 0.008, 0.008, 1.42),
          c,
          m,
          Gt.LIGHT,
          null,
          0,
        ),
        (o = "main"),
        a(
          Kn(
            Un(
              [
                [-0.9, 0.4],
                [-0.9, 0.845],
                [-1.25, 0.845],
                [-1.34, 0.79],
                [-1.34, 0.4],
              ],
              32,
            ),
            A,
            0.06,
            0.012,
          ),
          r,
          c,
          Gt.MATTE,
        ),
        a(
          Kn(
            Un(
              [
                [0.74, 0.4],
                [0.74, 0.8],
                [0.66, 0.83],
                [0.64, 0.83],
                [0.64, 0.4],
              ],
              24,
            ),
            A,
            0.06,
            0.012,
          ),
          r,
          c,
          Gt.MATTE,
        ),
        a(
          s(A - T * 0.03, 0.852, -1.12, 0.008, 0.008, 0.42),
          c,
          m,
          Gt.LIGHT,
          null,
          0,
        ));
      {
        const g = new f.Shape(),
          M = [
            [0.82, 0.35],
            [0.86, 0.35],
            [0.985, 0.485],
            [0.985, 0.5],
            [0.82, 0.5],
          ];
        g.moveTo(T * M[0][0], M[0][1]);
        for (const [L, C] of M.slice(1)) g.lineTo(T * L, C);
        a(
          new f.ExtrudeGeometry(g, { depth: 1.5, bevelEnabled: !1 }).translate(
            0,
            0,
            -0.88,
          ),
          r,
          c,
          Gt.MATTE,
          null,
          30,
        );
      }
      a(
        s(T * 0.905, 0.503, -0.13, 0.15, 0.005, 1.46),
        [0.6, 0.6, 0.62],
        c,
        Gt.METAL,
        null,
        0,
      );
    }
    const h = [
        [-0.2, 0.47],
        [-0.23, 0.52],
        [-0.4, 0.545],
        [-0.66, 0.53],
        [-0.76, 0.58],
        [-0.84, 0.86],
        [-0.87, 1],
        [-0.89, 1.027],
        [-0.88, 1.072],
        [-0.92, 1.108],
        [-0.99, 1.113],
        [-1.03, 1.081],
        [-1.03, 1],
        [-1, 0.62],
        [-0.9, 0.43],
        [-0.6, 0.38],
        [-0.25, 0.39],
      ],
      y = [
        [-0.22, 0.5],
        [-0.26, 0.57],
        [-0.5, 0.6],
        [-0.68, 0.58],
        [-0.79, 0.66],
        [-0.86, 0.92],
        [-0.9, 1.018],
        [-0.95, 1.027],
        [-1.01, 1],
        [-0.99, 0.62],
        [-0.9, 0.45],
        [-0.5, 0.42],
      ];
    for (const T of [0.42, -0.42]) {
      a(Kn(Un(h, 120), T, 0.4, 0.03), i, c, Gt.LEATHER);
      for (const A of [1, -1])
        a(
          Kn(Un(y, 96), T + A * 0.22, 0.09, 0.03),
          [0.26, 0.115, 0.05],
          c,
          Gt.LEATHER,
        );
    }
    {
      const T = Cs(0.36, 0.17, 0.07);
      T.holes.push(Cs(0.25, 0.075, 0.035));
      const A = new f.ExtrudeGeometry(T, {
        depth: 0.022,
        bevelEnabled: !0,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 3,
        curveSegments: 10,
      });
      ((o = "yoke"),
        A.translate(0, 0, -0.011),
        a(A, [0.03, 0.03, 0.033], c, Gt.LEATHER, Gl.clone()),
        a(
          new f.BoxGeometry(0.1, 0.008, 0.01),
          c,
          [0.1, 0.45, 0.85],
          Gt.LIGHT,
          Gl.clone().multiply(new f.Matrix4().makeTranslation(0, 0.0945, 0)),
          0,
        ),
        (o = "main"),
        a(
          new f.CylinderGeometry(0.024, 0.03, 0.2, 16),
          [0.04, 0.04, 0.045],
          c,
          Gt.METAL,
          l(0.42, 0.6, 0.37, 1.08, 0, 0),
          50,
        ));
    }
    for (const T of [1, -1]) {
      const A = mh(T);
      a(
        new f.ExtrudeGeometry(Cs(0.05, 0.064, 0.022), {
          steps: 64,
          bevelEnabled: !1,
          extrudePath: A,
        }),
        [0.045, 0.046, 0.05],
        c,
        Gt.ALC,
        null,
        50,
      );
      const g = A.getPoints(64).map((M) =>
        M.clone().add(new f.Vector3(-T * 0.03, -0.012, 0)),
      );
      a(
        new f.TubeGeometry(new f.CatmullRomCurve3(g), 64, 0.0035, 6, !1),
        [0.7, 0.7, 0.72],
        c,
        Gt.METAL,
        null,
        60,
      );
    }
    (a(
      new f.CylinderGeometry(0.032, 0.036, 0.008, 32),
      [0.6, 0.6, 0.62],
      c,
      Gt.METAL,
      l(kn.x, 0.842, kn.z + 0.012),
      50,
    ),
      a(
        new f.CylinderGeometry(0.0065, 0.0085, 0.035, 16),
        [0.6, 0.6, 0.62],
        c,
        Gt.METAL,
        l(kn.x, 0.862, kn.z + 0.014, -0.1, 0, 0),
        50,
      ));
    const x = ka[0][0],
      b = ka[ka.length - 1][0];
    for (const T of Object.values(t))
      for (let A = 0; A < T.P.length; A += 3) {
        const g = T.P[A],
          M = T.P[A + 2];
        if (M <= x || M >= b) continue;
        const L = zc(g, M) - 0.015;
        T.P[A + 1] > L && (T.P[A + 1] = L);
        const C = Go(1, M) - 0.015;
        Math.abs(g) > C && (T.P[A] = Math.sign(g) * C);
      }
    const V = {};
    for (const [T, A] of Object.entries(t)) {
      const g = new f.BufferGeometry();
      (g.setAttribute("position", new f.Float32BufferAttribute(A.P, 3)),
        g.setAttribute("normal", new f.Float32BufferAttribute(A.N, 3)),
        g.setAttribute("alb", new f.Float32BufferAttribute(A.A, 3)),
        g.setAttribute("emit", new f.Float32BufferAttribute(A.E, 3)),
        g.setAttribute("ck", new f.Float32BufferAttribute(A.K, 1)),
        (V[T] = g));
    }
    return V;
  })(),
  t1 = W(1),
  e1 = { uScr: W(new f.Vector3()) },
  tu = Se({
    shade: ({ alb: t, out: e, nrm: n }) => {
      const o = vt(os).toVar(),
        a = Et("alb", "vec3").toVar(),
        s = Et("emit", "vec3"),
        l = Jt(Et("ck", "float").add(0.5)).toVar(),
        r = ce,
        u = vt(ua.sub(de)).toVar(),
        i = Tn(u, o).toVar(),
        c = Q(gt(u, o).negate(), 0, 1).toVar(),
        m = k(0.02).toVar(),
        d = k(8).toVar();
      F(l.equal(Gt.LEATHER), () => {
        const T = at(at(r.x).sub(0.42))
            .lessThan(0.15)
            .and(r.y.greaterThan(0.5))
            .and(r.z.lessThan(-0.2)),
          A = rt(r.y.mul(14).add(r.z.mul(6)));
        F(T, () => {
          a.mulAssign(
            _(0, 0.12, A)
              .mul(_(1, 0.86, A))
              .mul(0.35)
              .add(0.65),
          );
        });
        const g = _(0.004, 0, at(at(at(r.x).sub(0.42)).sub(0.15))).mul(
          pt(0.45, rt(r.y.mul(90).add(r.z.mul(90)))),
        );
        (a.assign(B(a, w(0.85, 0.7, 0.48), g.mul(0.8))),
          m.assign(0.06),
          d.assign(24));
      })
        .ElseIf(l.equal(Gt.ALC), () => {
          a.mulAssign(jt(r.yz.mul(260)).mul(0.25).add(0.85));
        })
        .ElseIf(l.equal(Gt.METAL), () => {
          (m.assign(0.55), d.assign(60));
        })
        .ElseIf(l.equal(Gt.GLOSS), () => {
          (m.assign(0.35), d.assign(240));
        })
        .ElseIf(l.equal(Gt.DASH), () => {
          const T = _(0.003, 0, at(r.y.sub(0.826)))
            .mul(pt(0.38, r.z))
            .mul(pt(r.z, 0.47))
            .mul(pt(0.5, rt(r.x.mul(55))));
          (a.assign(B(a, w(0.42, 0.36, 0.3), T)), m.assign(0.04), d.assign(16));
        });
      const h = m.add(m.oneMinus().mul(Ft(c.oneMinus(), 5).mul(0.6))).toVar(),
        y = gn(o)
          .mul(p.uAmb)
          .mul(0.6)
          .add(p.uSunCol.mul(Z(gt(o, p.uSunDir), 0)).mul(0.38))
          .add(p.uCityGlow.mul(1.5))
          .toVar(),
        x = ua.sub(e1.uScr),
        b = w(0.18, 0.5, 0.75)
          .mul(
            Z(gt(o, vt(x.negate())), 0)
              .mul(0.6)
              .add(0.4),
          )
          .div(gt(x, x).mul(14).add(1))
          .mul(0.35),
        V = a
          .mul(y.add(b))
          .add(
            s
              .mul(t1.mul(0.6).add(0.4))
              .mul(ae(p.uTime.mul(2.4)).mul(0.1).add(0.9)),
          )
          .toVar();
      (V.addAssign(
        gn(i)
          .mul(p.uAmb)
          .add(p.uSunCol.mul(Ft(Z(gt(i, p.uSunDir), 0), d)).mul(d.div(8)))
          .mul(h)
          .mul(Y(l.equal(Gt.LIGHT), k(0), k(1))),
      ),
        t.assign(a),
        n.assign(o),
        e.assign(nt(V, 0)));
    },
  }),
  pe = new f.Group();
((pe.visible = !1), ze.add(pe));
const eu = [];
{
  const t = new f.Mesh(Ji.main, tu);
  ((t.frustumCulled = !1), pe.add(t));
  for (const e of [1, -1]) {
    const n = new f.Group(),
      o = new f.Mesh(Ji[e > 0 ? "dr" : "dl"], tu);
    ((o.frustumCulled = !1),
      o.position.set(-e * _l[0], -_l[1], 0),
      n.add(o),
      n.position.set(e * _l[0], _l[1], 0),
      (n.userData.s = e),
      pe.add(n),
      eu.push(n));
  }
}
const nu = new f.Group();
{
  const t = new f.Group(),
    e = new f.Mesh(Ji.yoke, tu);
  ((e.frustumCulled = !1),
    Gl.decompose(t.position, t.quaternion, t.scale),
    e.applyMatrix4(Gl.clone().invert()),
    nu.add(e),
    t.add(nu),
    pe.add(t));
}
const ou = 2048,
  n1 = 230,
  Hl = document.createElement("canvas");
((Hl.width = ou), (Hl.height = n1));
const Na = new f.CanvasTexture(Hl);
((Na.colorSpace = f.SRGBColorSpace),
  (Na.anisotropy = 8),
  (Na.generateMipmaps = !0),
  (Na.minFilter = f.LinearMipmapLinearFilter));
const fh = Ve(Na),
  hh = Se({
    shade: ({ alb: t, out: e, nrm: n }) => {
      const o = fh.sample(re()).rgb;
      (t.assign(w(0.01)),
        n.assign(vt(os)),
        e.assign(nt(o.mul(o).mul(1.15), 0)));
    },
  });
let au = null;
{
  const t = new f.Mesh(new f.PlaneGeometry(1.6, 0.18), hh);
  (t.position.set(0, 0.716, 0.368),
    t.rotation.set(0.35, Math.PI, 0),
    (t.frustumCulled = !1),
    pe.add(t),
    (au = t));
}
const Ol = 640,
  Wl = 170,
  Ra = new f.RenderTarget(Ol, Wl, {
    type: f.HalfFloatType,
    depthBuffer: !0,
    depthTexture: new f.DepthTexture(Ol, Wl),
  });
Ra.texture.name = "output";
const xn = new f.PerspectiveCamera(15, Ol / Wl, 0.3, 3e3),
  gh = Cr({ output: u0 }),
  fe = {
    uF: W(new f.Vector3()),
    uR: W(new f.Vector3()),
    uU: W(new f.Vector3()),
    uT: W(new f.Vector2()),
    uNF: W(new f.Vector2(0.3, 3e3)),
    uOn: W(0),
    uK: W(1),
    at: -9,
    frame: 0,
  },
  o1 = Ve(Ra.texture),
  su = Ve(Ra.depthTexture),
  ph = Se({
    shade: ({ alb: t, out: e, nrm: n }) => {
      const o = re().toVar(),
        a = X(o.x.oneMinus(), o.y.oneMinus()).toVar(),
        s = o1.sample(a).rgb.toVar(),
        l = su.sample(a).r.toVar(),
        r = X(o.x.oneMinus().mul(2).sub(1), o.y.mul(2).sub(1)),
        u = vt(
          fe.uF
            .add(fe.uR.mul(r.x.mul(fe.uT.x)))
            .add(fe.uU.mul(r.y.mul(fe.uT.y))),
        ).toVar();
      F(l.greaterThanEqual(0.99999), () => {
        s.assign(Lo(u));
      }).Else(() => {
        const d = Pr(l, fe.uNF.x, fe.uNF.y).negate();
        s.assign(B(s, p.uFogCol.mul(0.9), Kt(d.mul(-0.0011)).oneMinus()));
      });
      const i = s.mul(fe.uK).toVar();
      s.assign(Ft(i.div(i.add(1)), w(1.12)).mul(w(0.94, 1, 1.06)));
      const c = o.sub(0.5).mul(X(2, 2 / 3.75)),
        m = _(1.2, 0.6, oe(c));
      (s.assign(
        Y(
          fe.uOn.greaterThan(0.5),
          s.mul(m.mul(0.35).add(0.65)).mul(1.1),
          w(0.012, 0.014, 0.018),
        ),
      ),
        t.assign(w(0)),
        n.assign(vt(os)),
        e.assign(nt(s, 0)));
    },
  }),
  yh = (() => {
    const t = new f.Group(),
      e = kn.w,
      n = kn.h,
      o = new f.ExtrudeGeometry(Cs(e, n, 0.011), {
        depth: 0.004,
        bevelEnabled: !0,
        bevelThickness: 0.003,
        bevelSize: 0.003,
        bevelSegments: 3,
        curveSegments: 8,
      });
    o.translate(0, 0, -0.0078);
    const a = new f.Mesh(
      Zi(o.index ? o.toNonIndexed() : o, 40),
      new f.MeshBasicNodeMaterial(),
    );
    a.material = Se({
      shade: ({ alb: u, out: i, nrm: c }) => {
        const m = vt(os);
        (u.assign(w(0.012)),
          c.assign(m),
          i.assign(
            nt(
              gn(Tn(vt(ua.sub(de)), m))
                .mul(p.uAmb)
                .mul(0.08)
                .add(0.004),
              0,
            ),
          ));
      },
    });
    const s = e - 0.006,
      l = n - 0.006,
      r = new f.Mesh(new f.ShapeGeometry(Cs(s, l, 0.009), 12), ph);
    r.position.z = 5e-4;
    {
      const u = r.geometry.attributes.uv;
      for (let i = 0; i < u.count; i++)
        u.setXY(i, u.getX(i) / s + 0.5, u.getY(i) / l + 0.5);
    }
    t.add(a, r);
    for (const u of [a, r]) u.frustumCulled = !1;
    return (
      t.position.set(kn.x, kn.y, kn.z),
      t.lookAt(new f.Vector3(...yn)),
      pe.add(t),
      t
    );
  })(),
  a1 = new f.Scene();
let lu = null;
{
  const t = (lu = new f.Mesh(
    pn,
    (() => {
      const e = new f.MeshBasicNodeMaterial({
        transparent: !0,
        depthWrite: !1,
        blending: f.AdditiveBlending,
        side: f.DoubleSide,
      });
      return (
        (e.colorNode = At(() => {
          const { glow: n, core: o } = Zc(Et("rs", "float")),
            a = Et("color", "vec3");
          return nt(a.mul(n.add(o.mul(1.6))), 1);
        })()),
        (e.fog = !1),
        e
      );
    })(),
  ));
  ((t.frustumCulled = !1), a1.add(t));
}
const xh = new f.Quaternion(),
  bh = new f.Euler();
function wh() {
  (Wo(0, 1, -2.62, xn.position),
    co.set(-v.pitch, v.yaw, v.roll, "YXZ"),
    xn.quaternion
      .setFromEuler(co)
      .multiply(xh.setFromEuler(bh.set(-0.05, 0, 0))),
    xn.updateMatrixWorld());
  const t = pe.visible;
  ((pe.visible = !1),
    zt.setMRT(gh),
    zt.setRenderTarget(Ra),
    zt.setClearColor(0, 0),
    zt.clear(!0, !0, !1),
    zt.render(ze, xn),
    zt.render(a1, xn),
    zt.setMRT(null),
    zt.setRenderTarget(null),
    (pe.visible = t));
  const e = xn.matrixWorld.elements;
  (fe.uR.value.set(e[0], e[1], e[2]),
    fe.uU.value.set(e[4], e[5], e[6]),
    fe.uF.value.set(-e[8], -e[9], -e[10]));
  const n = Math.tan((xn.fov * Math.PI) / 360);
  (fe.uT.value.set(n * xn.aspect, n),
    fe.uNF.value.set(xn.near, xn.far),
    (fe.uK.value = Pt.uExpo.value * 1.15),
    (fe.uOn.value = 1));
}
const s1 = 512,
  l1 = 176,
  ql = 2,
  Kl = document.createElement("canvas");
((Kl.width = s1 * ql), (Kl.height = l1 * ql));
const Es = new f.CanvasTexture(Kl);
((Es.colorSpace = f.SRGBColorSpace),
  (Es.generateMipmaps = !0),
  (Es.minFilter = f.LinearMipmapLinearFilter));
const Da = new f.Group();
((Da.visible = !1), Fl.add(Da));
const ru = W(1);
{
  const t = new f.MeshBasicNodeMaterial({
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: f.AdditiveBlending,
    }),
    e = Ve(Es);
  ((t.colorNode = At(() => {
    const o = e.sample(re()).rgb;
    return nt(o.mul(o).mul(0.74).mul(p.uBlue.oneMinus()).mul(ru), 1);
  })()),
    (t.fog = !1));
  const n = new f.Mesh(new f.PlaneGeometry(0.4, 0.1375), t);
  (n.position.set(yn[0], 0.955, 0.42),
    n.lookAt(new f.Vector3(...yn)),
    (n.frustumCulled = !1),
    Da.add(n));
}
function Mh() {
  const t = Kl.getContext("2d"),
    e = s1,
    n = l1,
    o = (h) => `400 ${h}px "DM Mono", ui-monospace, monospace`,
    a = (h, y) => `${h} ${y}px Outfit, Arial, sans-serif`;
  (t.setTransform(ql, 0, 0, ql, 0, 0), t.clearRect(0, 0, e, n));
  const s = Bt.on,
    l = s ? "#ff9aa0" : "#9eeeff",
    r = "#eafcff",
    u = (h) => {
      try {
        t.letterSpacing = h;
      } catch {}
    };
  ((t.textBaseline = "alphabetic"),
    (t.textAlign = "right"),
    (t.font = a(300, 66)),
    (t.fillStyle = r),
    t.fillText(String(mo(v.v)), 234, 100),
    (t.textAlign = "left"),
    (t.font = a(400, 16)),
    (t.fillStyle = l),
    t.fillText("km/h", 242, 100),
    (t.font = a(500, 12)),
    u("2.5px"),
    t.fillText(
      s
        ? "TURBO"
        : Vt.on
          ? Vt.door > 0.02
            ? "DOORS OPEN"
            : "HOVERING"
          : Ut.x || Ut.y || Ut.boost
            ? "ASSISTED"
            : "AUTOPILOT",
      32,
      140,
    ),
    u("0px"));
  const i = Yc(v.s),
    c = Pl(v.s),
    m = c && c.side > 0,
    d = i > 2500;
  if (
    (t.save(),
    t.translate(388, 70),
    (t.strokeStyle = r),
    (t.lineWidth = 2.4),
    (t.lineCap = "round"),
    (t.lineJoin = "round"),
    t.beginPath(),
    d)
  )
    (t.moveTo(0, 28),
      t.lineTo(0, -28),
      t.moveTo(-11, -17),
      t.lineTo(0, -28),
      t.lineTo(11, -17));
  else {
    const h = m ? -1 : 1;
    (t.moveTo(0, 28),
      t.lineTo(0, 0),
      t.quadraticCurveTo(0, -16, h * 16, -16),
      t.lineTo(h * 28, -16),
      t.moveTo(h * 19, -26),
      t.lineTo(h * 29, -16),
      t.lineTo(h * 19, -6));
  }
  (t.stroke(),
    t.restore(),
    (t.textAlign = "center"),
    (t.font = o(18)),
    (t.fillStyle = r),
    t.fillText(
      d
        ? "> 2 km"
        : i > 999
          ? (i / 1e3).toFixed(1) + " km"
          : Math.round(i) + " m",
      388,
      140,
    ),
    t.setTransform(1, 0, 0, 1, 0, 0),
    (Es.needsUpdate = !0));
}
const iu = { x: 0, z: 0, tx: 0, tz: 1, k: 0 },
  qo = { x: 0, z: 0, tx: 0, tz: 1, k: 0 };
let r1 = -9;
const ke = { p: 0, k: 0, at: 0, nx: 0, nw: 0 },
  i1 = {};
function Th(t) {
  let e = i1[t];
  return (
    e ||
      ((e = i1[t] = new Image()),
      (e.crossOrigin = "anonymous"),
      (e.src = `https://i.ytimg.com/vi/${t}/mqdefault.jpg`)),
    e.complete && e.naturalWidth ? e : null
  );
}
const u1 = (t) => (
  (t = Math.max(0, Math.floor(+t || 0))),
  Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0")
);
function vh(t, e, n) {
  const o = String(e).split(" ");
  let a = "",
    s = 0;
  for (; s < o.length;) {
    const r = a ? a + " " + o[s] : o[s];
    if (a && t.measureText(r).width > n) break;
    ((a = r), s++);
  }
  const l = o.slice(s).join(" ");
  return l ? [a, l] : [a];
}
function Ah() {
  const t = Hl.getContext("2d"),
    e = ou,
    n = 256,
    o = (U) => `500 ${U}px "DM Mono", ui-monospace, monospace`,
    a = (U, J) => `${U} ${J}px Outfit, Arial, sans-serif`;
  (t.setTransform(1, 0, 0, n1 / 256, 0, 0),
    (t.fillStyle = "#04060b"),
    t.fillRect(0, 0, e, n));
  const s = (U, J) => {
      ((t.fillStyle = "#0a0e18"),
        t.beginPath(),
        t.roundRect(U, 10, J, n - 20, 20),
        t.fill());
    },
    l = (U, J) => {
      (t.beginPath(), t.roundRect(U, 10, J, n - 20, 20), t.clip());
    },
    r = ke.k,
    u = 620 * (1 - r),
    i = 16 + u + 16 * (1 - r),
    c = 744 - 60 * r,
    m = i + c + 16,
    d = 616 * r,
    h = m + d + 16 * r,
    y = 2032 - h;
  ((ke.nx = m),
    (ke.nw = d),
    u > 1 && s(16, u),
    s(i, c),
    d > 1 && s(m, d),
    s(h, y));
  const x = Ut.x || Ut.y || Ut.boost,
    b = Bt.on,
    V = b
      ? ["TURBO", "#ff4a52"]
      : Vt.on || Vt.door > 0
        ? [Vt.door > 0.02 ? "HOVERING \xB7 DOORS OPEN" : "HOVERING", "#9be7c4"]
        : x
          ? ["ASSISTED", "#ffb454"]
          : ["SELF-DRIVING", "#5fe4ff"],
    T = String(mo(v.v)),
    A = `ALT ${Math.round(v.pos.y)} m`,
    g = `LEVEL ${Ce.indexOf(Pa(v.y)) + 1}`;
  ((t.textBaseline = "alphabetic"),
    u > 1 &&
      (t.save(),
      l(16, u),
      (t.globalAlpha = 1 - r),
      (t.textAlign = "left"),
      (t.font = a(600, 24)),
      (t.fillStyle = "#8792ad"),
      t.fillText("AUTOPILOT", 50, 54),
      (t.font = a(700, 30)),
      (t.fillStyle = V[1]),
      t.fillText(V[0], 50, 92),
      (t.font = o(132)),
      (t.fillStyle = "#f1f5ff"),
      (t.textAlign = "right"),
      t.fillText(T, 452, 222),
      (t.font = a(600, 28)),
      (t.fillStyle = "#8792ad"),
      (t.textAlign = "left"),
      t.fillText("km/h", 468, 222),
      (t.font = o(28)),
      (t.fillStyle = "#c9d2e6"),
      (t.textAlign = "right"),
      t.fillText(A, 604, 54),
      t.fillText(g, 604, 92),
      t.restore()));
  const M = i + c / 2,
    L = 206,
    C = 0.34,
    E = v.s;
  Ia(E, iu);
  const R = iu.tx,
    G = iu.tz;
  (t.save(), l(i, c));
  const H = (U, J) => {
    const st = U - v.pos.x,
      N = J - v.pos.z,
      O = st * R + N * G,
      $ = st * -G + N * R;
    return [M + $ * C, L - O * C];
  };
  {
    const U = Math.floor(v.pos.x / It),
      J = Math.floor(v.pos.z / It);
    t.fillStyle = "#111827";
    for (let st = -4; st <= 4; st++)
      for (let N = -4; N <= 4; N++) {
        const O = Rn(U + st, J + N),
          $ = [H(O.x0, O.z0), H(O.x1, O.z0), H(O.x1, O.z1), H(O.x0, O.z1)];
        (t.beginPath(), t.moveTo(...$[0]));
        for (let ht = 1; ht < 4; ht++) t.lineTo(...$[ht]);
        (t.closePath(), t.fill());
      }
    for (const st of rn) {
      if (st.d2 > 420 * 420) break;
      const N = H(st.x, st.z);
      ((t.fillStyle = Math.abs(st.y - v.pos.y) < 12 ? "#ffb454" : "#56607a"),
        t.fillRect(N[0] - 3, N[1] - 3, 6, 6));
    }
  }
  ((t.lineWidth = 46 * C), (t.strokeStyle = "#141b2b"), (t.lineCap = "round"));
  for (let U = -120; U <= 760; U += 40) {
    Ia(E + U, qo);
    const J = H(qo.x, qo.z);
    U === -120 ? (t.beginPath(), t.moveTo(J[0], J[1])) : t.lineTo(J[0], J[1]);
  }
  (t.stroke(),
    (t.lineWidth = 5),
    (t.strokeStyle = b ? "#ff4a52" : "#5fe4ff"),
    (t.shadowColor = t.strokeStyle),
    (t.shadowBlur = 12));
  for (let U = 0; U <= 760; U += 10) {
    Ia(E + U, qo);
    const J = H(qo.x, qo.z);
    U ? t.lineTo(J[0], J[1]) : (t.beginPath(), t.moveTo(J[0], J[1]));
  }
  if (
    (t.stroke(),
    (t.shadowBlur = 0),
    (t.fillStyle = "#f1f5ff"),
    t.beginPath(),
    t.moveTo(M, L - 20),
    t.lineTo(M + 13, L + 13),
    t.lineTo(M, L + 6),
    t.lineTo(M - 13, L + 13),
    t.closePath(),
    t.fill(),
    r > 0.001)
  ) {
    t.globalAlpha = r;
    let U = t.createLinearGradient(i, 0, i + 340, 0);
    (U.addColorStop(0, "rgba(10,14,24,.96)"),
      U.addColorStop(1, "rgba(10,14,24,0)"),
      (t.fillStyle = U),
      t.fillRect(i, 10, 340, n - 20),
      (U = t.createLinearGradient(i + c - 260, 0, i + c, 0)),
      U.addColorStop(0, "rgba(10,14,24,0)"),
      U.addColorStop(1, "rgba(10,14,24,.92)"),
      (t.fillStyle = U),
      t.fillRect(i + c - 260, 10, 260, n - 20),
      (t.textAlign = "left"),
      (t.font = a(600, 20)),
      (t.fillStyle = "#8792ad"),
      t.fillText("AUTOPILOT", i + 34, 50),
      (t.font = a(700, 26)),
      (t.fillStyle = V[1]),
      t.fillText(V[0], i + 34, 84, 290),
      (t.font = o(92)),
      (t.fillStyle = "#f1f5ff"),
      t.fillText(T, i + 30, 218));
    const J = t.measureText(T).width;
    ((t.font = a(600, 24)),
      (t.fillStyle = "#8792ad"),
      t.fillText("km/h", i + 30 + J + 10, 218),
      (t.font = o(24)),
      (t.fillStyle = "#c9d2e6"),
      (t.textAlign = "right"),
      t.fillText(A, i + c - 30, 50),
      t.fillText(g, i + c - 30, 84),
      (t.globalAlpha = 1));
  }
  t.restore();
  const I = Ln[ft.i];
  if (d > 1) {
    (t.save(), l(m, d), (t.globalAlpha = r));
    let U = 0,
      J = 0;
    try {
      ((U = ft.yt?.getCurrentTime?.() || 0), (J = ft.yt?.getDuration?.() || 0));
    } catch {}
    const st = yt.f < 0.99 ? Th(I.id) : null,
      N = m + 616 - 34;
    let O = m + 34;
    (st &&
      (t.save(),
      t.beginPath(),
      t.roundRect(m + 22, 38, 320, 180, 12),
      t.clip(),
      t.drawImage(st, m + 22, 38, 320, 180),
      t.restore(),
      (O = m + 22 + 320 + 26)),
      (t.textAlign = "left"),
      (t.font = a(600, 20)),
      (t.fillStyle = "#8792ad"),
      t.fillText(
        ft.state === "wait"
          ? "TUNING IN"
          : ft.ready && !ft.playing
            ? "PAUSED"
            : yt.f >= 1
              ? "NOW PLAYING \xB7 CLICK TO SKIP"
              : "NOW PLAYING",
        O,
        52,
        N - O,
      ),
      (t.font = a(600, st ? 28 : 32)),
      (t.fillStyle = "#f1f5ff"));
    const $ = vh(t, I.title, N - O);
    ($.forEach((ht, ut) => t.fillText(ht, O, 94 + ut * 36, N - O)),
      (t.font = a(500, 24)),
      (t.fillStyle = "#c9d2e6"),
      t.fillText(I.by, O, 94 + $.length * 36, N - O),
      (t.fillStyle = "#1b2335"),
      t.beginPath(),
      t.roundRect(O, 202, N - O, 6, 3),
      t.fill(),
      J > 0 &&
        ((t.fillStyle = "#5fe4ff"),
        t.beginPath(),
        t.roundRect(O, 202, Math.max(6, (N - O) * Q(U / J, 0, 1)), 6, 3),
        t.fill()),
      (t.font = o(20)),
      (t.fillStyle = "#8792ad"),
      t.fillText(u1(U), O, 236),
      (t.textAlign = "right"),
      J && t.fillText(u1(J), N, 236),
      t.restore());
  }
  const P = Yc(E),
    q = Pl(E),
    S = q && q.side > 0,
    K = P > 2500;
  if (
    ((t.textAlign = "left"),
    (t.font = a(600, 24)),
    (t.fillStyle = "#8792ad"),
    t.fillText(K ? "STRAIGHT ON" : "NEXT TURN", h + 38, 54),
    t.save(),
    t.translate(h + 86, 150),
    (t.strokeStyle = "#f1f5ff"),
    (t.lineWidth = 11),
    (t.lineCap = "round"),
    (t.lineJoin = "round"),
    t.beginPath(),
    K)
  )
    (t.moveTo(0, 44),
      t.lineTo(0, -44),
      t.moveTo(-24, -20),
      t.lineTo(0, -44),
      t.lineTo(24, -20));
  else {
    const U = S ? -1 : 1;
    (t.moveTo(0, 44),
      t.lineTo(0, -4),
      t.quadraticCurveTo(0, -26, U * 24, -26),
      t.lineTo(U * 40, -26),
      t.moveTo(U * 27, -44),
      t.lineTo(U * 45, -26),
      t.lineTo(U * 27, -8));
  }
  (t.stroke(),
    t.restore(),
    (t.font = o(62)),
    (t.fillStyle = "#f1f5ff"),
    t.fillText(
      K
        ? "> 2 km"
        : P > 999
          ? (P / 1e3).toFixed(1) + " km"
          : Math.round(P) + " m",
      h + 168,
      166,
    ),
    (t.font = a(600, 26)),
    (t.fillStyle = "#c9d2e6"),
    t.fillText(K ? "" : S ? "turning left" : "turning right", h + 170, 204));
  const ot = rn.filter((U) => U.d2 < 14400).length,
    xt = ft.on && r < 0.5;
  ((t.font = o(22)),
    (t.fillStyle = xt ? "#7fe3ff" : "#8792ad"),
    t.fillText(
      xt ? `\u266A ${I.title} \xB7 ${I.by}` : `${ot} cars within 120 m`,
      h + 170,
      236,
      y - 190,
    ),
    t.setTransform(1, 0, 0, 1, 0, 0),
    (Na.needsUpdate = !0));
}
function Vh() {
  const t = et.position,
    e = v.s,
    n = v.lat,
    o = (Bt.on ? 0.6 : 1) * (1 - Vt.k);
  if (!(o < 0.01))
    for (let a = 0; a < 44; a++) {
      const s = [],
        l = [],
        r = [],
        u = Math.max(0, 1 - a / 44) ** 1.3 * o;
      for (const i of [e + 9 + a * 7, e + 12.4 + a * 7]) {
        const c = Ia(i, qo),
          m = i - e,
          d = n * Math.exp(-m / 45);
        (ve.set(c.x - c.tz * d, (v.man ? v.y : Sn(i)) + 0.35, c.z + c.tx * d),
          s.push(ve.x, ve.y, ve.z),
          l.push(Math.max(0.24, Dl(ve.distanceTo(t)) * 3)),
          r.push(0.14 * u, 0.75 * u, 1.1 * u));
      }
      Rl(s, l, r);
    }
}
function zh() {
  const t = Ze(),
    e = t || Vt.door > 0;
  ((pe.visible = e), (Da.visible = fe.on = t), t || (fe.uOn.value = 0));
  const n = performance.now() / 1e3,
    o = Math.min(0.1, Math.max(0, n - (ke.at || n))),
    a = ft.on && ft.state !== "down" ? 1 : 0,
    s = ke.k;
  if (
    ((ke.at = n),
    (ke.p = e ? Q(ke.p + ((a ? 1 : -1) * o) / 0.7, 0, 1) : a),
    (ke.k = ke.p * ke.p * (3 - 2 * ke.p)),
    !e)
  )
    return;
  const l = Qi();
  for (const r of eu) r.rotation.z = r.userData.s * l;
  ((nu.rotation.z = v.yoke),
    co.set(-v.pitch, v.yaw, v.roll, "YXZ"),
    pe.quaternion.setFromEuler(co),
    pe.position.copy(v.pos),
    Da.quaternion.copy(pe.quaternion),
    Da.position.copy(v.pos),
    ho.quaternion.copy(pe.quaternion),
    ho.position.copy(v.pos),
    Wo(0, 0.716, 0.368, e1.uScr.value),
    (t1.value = Ut.x || Ut.y ? 0.25 : 1),
    (n - r1 > 0.12 || ke.k !== s) && ((r1 = n), Ah(), Mh()));
}
const uu = new f.Vector3(0.95, 0.29, -0.12).normalize(),
  Sh = 3600,
  c1 = 680,
  d1 = { aimed: !1 };
function Ul(t) {
  const e = [],
    n = [],
    o = [],
    a = [],
    s = [],
    l = {
      nv: 0,
      V(u, i, c, m, d) {
        return (
          e.push(u[0], u[1], u[2]),
          n.push(i[0], i[1], i[2]),
          o.push(c, m),
          a.push(d),
          l.nv++
        );
      },
      Q(u, i, c, m) {
        s.push(u, i, c, u, c, m);
      },
      box(
        u,
        i,
        c,
        m = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
      ) {
        for (const [d, h, y] of [
          [0, 1, 2],
          [1, 2, 0],
          [2, 0, 1],
        ])
          for (const x of [1, -1]) {
            const b = m[d].map((g) => g * x),
              V = u.map((g, M) => g + b[M] * i[d]),
              T = (g, M) =>
                V.map((L, C) => L + m[h][C] * i[h] * g + m[y][C] * i[y] * M),
              A = [
                l.V(T(-1, -1), b, 0, 0, c),
                l.V(T(1, -1), b, 1, 0, c),
                l.V(T(1, 1), b, 1, 1, c),
                l.V(T(-1, 1), b, 0, 1, c),
              ];
            x > 0 ? l.Q(A[0], A[1], A[2], A[3]) : l.Q(A[0], A[3], A[2], A[1]);
          }
      },
      tube(u, i, c, m, d = 40, h = m) {
        const y = l.nv;
        for (let x = 0; x <= d; x++) {
          const b = (x / d) * Math.PI * 2,
            V = Math.cos(b),
            T = Math.sin(b);
          (l.V([V * u, T * u, i], [V, T, 0], x / d, 0, m),
            l.V([V * u, T * u, c], [V, T, 0], x / d, 1, m));
        }
        for (let x = 0; x < d; x++) {
          const b = y + x * 2;
          l.Q(b, b + 2, b + 3, b + 1);
        }
        for (const [x, b] of [
          [i, -1],
          [c, 1],
        ]) {
          const V = b > 0 ? h : m,
            T = l.V([0, 0, x], [0, 0, b], 0.5, 0.5, V),
            A = l.nv;
          for (let g = 0; g <= d; g++) {
            const M = (g / d) * Math.PI * 2;
            l.V(
              [Math.cos(M) * u, Math.sin(M) * u, x],
              [0, 0, b],
              0.5 + Math.cos(M) * 0.5,
              0.5 + Math.sin(M) * 0.5,
              V,
            );
          }
          for (let g = 0; g < d; g++)
            b > 0 ? s.push(T, A + g, A + g + 1) : s.push(T, A + g + 1, A + g);
        }
      },
    };
  t(l);
  const r = new f.BufferGeometry();
  return (
    r.setIndex(s),
    r.setAttribute("position", new f.Float32BufferAttribute(e, 3)),
    r.setAttribute("normal", new f.Float32BufferAttribute(n, 3)),
    r.setAttribute("sS", new f.Float32BufferAttribute(o, 2)),
    r.setAttribute("sK", new f.Float32BufferAttribute(a, 1)),
    (r.boundingSphere = new f.Sphere(new f.Vector3(), 3e3)),
    r
  );
}
const kh = Ul((t) => {
    const n = c1 - 36,
      o = c1,
      a = 38;
    for (const [s, l, r] of [
      [o, 1, 0],
      [n, -1, 1],
    ]) {
      const u = t.nv;
      for (let i = 0; i <= 192; i++) {
        const c = (i / 192) * Math.PI * 2,
          m = Math.cos(c),
          d = Math.sin(c);
        (t.V([m * s, d * s, -a], [m * l, d * l, 0], i / 192, 0, r),
          t.V([m * s, d * s, a], [m * l, d * l, 0], i / 192, 1, r));
      }
      for (let i = 0; i < 192; i++) {
        const c = u + i * 2;
        l > 0 ? t.Q(c, c + 2, c + 3, c + 1) : t.Q(c, c + 1, c + 3, c + 2);
      }
    }
    for (const s of [1, -1]) {
      const l = t.nv;
      for (let r = 0; r <= 192; r++) {
        const u = (r / 192) * Math.PI * 2,
          i = Math.cos(u),
          c = Math.sin(u);
        (t.V([i * n, c * n, a * s], [0, 0, s], r / 192, 0, 2),
          t.V([i * o, c * o, a * s], [0, 0, s], r / 192, 1, 2));
      }
      for (let r = 0; r < 192; r++) {
        const u = l + r * 2;
        s > 0 ? t.Q(u, u + 1, u + 3, u + 2) : t.Q(u, u + 2, u + 3, u + 1);
      }
    }
    for (let s = 0; s < 6; s++) {
      const l = (s / 6) * Math.PI * 2 + 0.26,
        r = Math.cos(l),
        u = Math.sin(l),
        i = (n + 64) / 2;
      t.box([r * i, u * i, 0], [(n - 64) / 2, 7, 7], 3, [
        [r, u, 0],
        [-u, r, 0],
        [0, 0, 1],
      ]);
    }
  }),
  Ch = Ul((t) => {
    (t.tube(64, -150, 70, 3, 48, 4),
      t.tube(30, 70, 96, 3, 24, 4),
      t.box([0, 0, -640], [15, 15, 500], 3));
    for (const e of [-330, -560, -790])
      for (const n of [1, -1])
        (t.box([n * 350, 0, e], [290, 1.5, 62], 5),
          t.box([n * 34, 0, e], [22, 5, 5], 3));
    for (const e of [-445, -675])
      for (const n of [1, -1]) t.box([0, n * 170, e], [1.5, 150, 70], 6);
    (t.tube(92, -1260, -1140, 3, 40, 3), t.tube(70, -1300, -1260, 7, 40, 7));
    for (const e of [1, -1]) t.box([e * 120, 0, -1200], [18, 18, 70], 3);
  }),
  Eh = Ul((t) => {
    t.box([0, 0, 0], [1, 1, 1], 9);
  }),
  c5 = { uSpin: W(0), uBlink: W(0) },
  Lh = ({ alb: t, out: e, nrm: n }) => {
    const o = vt(os).toVar(),
      a = vt(ua.sub(de)).toVar(),
      s = Jt(Et("sK", "float").add(0.5)).toVar(),
      l = Et("sS", "vec2").toVar(),
      r = B(p.uSunCol, w(nn(p.uSunCol)).mul(1.1), 0.6).toVar(),
      u = Z(gt(o, p.uSunDir), 0),
      i = Tn(a, o).toVar(),
      c = p.uGroundCol
        .mul(0.5)
        .add(p.uSkyHor.mul(0.12))
        .add(r.mul(0.1))
        .mul(Z(o.y.negate(), 0).mul(0.7).add(0.3))
        .toVar(),
      m = w(0.66, 0.67, 0.69).toVar(),
      d = w(0).toVar(),
      h = k(0.04).toVar(),
      y = k(40).toVar(),
      x = p.uNightK.toVar(),
      b = (M) => _(0.3, 0.9, M);
    F(s.lessThan(0.5), () => {
      const M = l.x.mul(384),
        L = l.y.mul(4),
        C = rt(M),
        E = rt(L),
        R = b(Z(we(M), we(L)));
      (m.mulAssign(
        B(
          pt(0.04, C)
            .mul(pt(0.06, E))
            .mul(0.25)
            .add(0.75)
            .mul(
              ie(Jt(X(M, L)))
                .mul(0.25)
                .add(0.82),
            ),
          k(0.92),
          R,
        ),
      ),
        h.assign(0.12));
    })
      .ElseIf(s.lessThan(1.5), () => {
        (m.assign(w(0.04, 0.05, 0.06)),
          h.assign(0.3),
          y.assign(200),
          d.assign(
            w(0.55, 0.75, 1)
              .mul(B(0.35, 1.6, x))
              .mul(
                pt(0.5, rt(l.x.mul(96)))
                  .mul(0.4)
                  .add(0.6),
              ),
          ));
      })
      .ElseIf(s.lessThan(2.5), () => {
        const M = l.x.mul(1400),
          L = l.y.mul(5),
          C = pt(0.35, rt(M))
            .mul(pt(rt(M), 0.8))
            .mul(pt(0.3, rt(L)))
            .mul(pt(rt(L), 0.7))
            .mul(pt(1, L))
            .mul(pt(L, 4)),
          E = pt(ie(X(Jt(M), Jt(L))), B(0.25, 0.75, x)),
          R = b(Z(we(M), we(L).mul(0.25))).toVar(),
          G = B(C.mul(E), B(0.25, 0.75, x).mul(0.108), R);
        (d.assign(
          w(1, 0.82, 0.6)
            .mul(G)
            .mul(B(0.6, 2.4, x)),
        ),
          m.mulAssign(B(C, k(0.108), R).mul(-0.8).add(1)),
          h.assign(0.1));
      })
      .ElseIf(s.lessThan(3.5), () => {
        h.assign(0.1);
      })
      .ElseIf(s.lessThan(4.5), () => {
        const M = oe(l.sub(0.5)).mul(2);
        d.assign(
          w(0.7, 0.9, 1)
            .mul(_(0.06, 0, at(M.sub(0.82))))
            .mul(6)
            .add(
              w(1, 0.8, 0.5)
                .mul(_(0.2, 0, M))
                .mul(3),
            ),
        );
      })
      .ElseIf(s.lessThan(5.5), () => {
        const M = l.mul(X(48, 6)),
          L = rt(M),
          C = B(pt(0.92, Z(L.x, L.y)), k(0.154), b(Z(we(M.x), we(M.y))));
        (m.assign(B(w(0.02, 0.035, 0.08), w(0.5), C)),
          h.assign(0.5),
          y.assign(300));
      })
      .ElseIf(s.lessThan(6.5), () => {
        (m.assign(w(0.82, 0.82, 0.8)), h.assign(0.05));
      })
      .ElseIf(s.lessThan(7.5), () => {
        (m.assign(w(0.05)), d.assign(w(0.45, 0.7, 1).mul(9)));
      })
      .ElseIf(s.lessThan(8.5), () => {
        (m.assign(w(0.6, 0.6, 0.62)),
          d.assign(w(0.6, 0.75, 1).mul(0.08).mul(x)));
      })
      .Else(() => {
        (m.assign(w(0.1)), d.assign(w(1, 0.9, 0.75).mul(8)));
      });
    const V = Q(gt(a, o).negate(), 0, 1),
      T = h.add(h.oneMinus().mul(Ft(V.oneMinus(), 5)).mul(0.5)),
      A = r
        .mul(Ft(Z(gt(i, p.uSunDir), 0), y))
        .mul(T)
        .mul(y.div(40).sqrt())
        .mul(_(0.05, 0.35, V)),
      g = qt(
        m
          .mul(r.mul(u).add(c))
          .add(qt(A, w(2.5)))
          .add(d),
        w(9),
      ).toVar();
    (F(p.uBlue.greaterThan(0.001), () => {
      g.assign(B(g, w(0.004, 0.008, 0.02), p.uBlue));
    }),
      t.assign(w(0)),
      n.assign(o),
      e.assign(nt(g, 2)));
  },
  Yl = Se({ shade: Lh }),
  un = new f.Group();
(un.scale.setScalar(1.1), ze.add(un));
const m1 = new f.Mesh(kh, Yl),
  Ph = new f.Mesh(Ch, Yl);
for (const t of [m1, Ph]) ((t.frustumCulled = !1), un.add(t));
const cu = new f.Vector3(),
  $l = new f.Vector3(),
  jl = new f.Vector3(),
  Ih = new f.Matrix4();
function Bh() {
  const t = v.pathYaw,
    e = p.uSunDir.value,
    n = Math.sign(Math.cos(t) * e.x - Math.sin(t) * e.z) || 1,
    o = t - n * 0.14,
    a = 0.28;
  (uu.set(Math.sin(o) * Math.cos(a), Math.sin(a), Math.cos(o) * Math.cos(a)),
    (d1.aimed = !0));
}
const Xl = new f.Mesh(
  Ul((t) => {
    t.box([0, -0.5, 0], [3.2, 0.5, 3.2], 8);
  }),
  Yl,
);
((Xl.frustumCulled = !1), ze.add(Xl));
const f1 = [...Array(7)].map(() => {
    const t = new f.Mesh(Eh, Yl);
    return ((t.frustumCulled = !1), ze.add(t), t);
  }),
  Fh = new f.Vector3(),
  h1 = new f.Vector3();
function Nh() {
  !d1.aimed && v.route.length && Bh();
  const t = et.position;
  (un.position.copy(t).addScaledVector(uu, Sh),
    (m1.rotation.z = Dt * 0.035),
    jl
      .copy(uu)
      .negate()
      .addScaledVector(p.uSunDir.value, 0.8)
      .add($l.set(0, 0.15, 0))
      .normalize(),
    cu.crossVectors($l.set(0, 1, 0), jl).normalize(),
    $l.crossVectors(jl, cu),
    un.quaternion.setFromRotationMatrix(Ih.makeBasis(cu, $l, jl)));
  const e = Fh.copy(un.position).y - 70,
    n = e + 80;
  (Xl.position.set(un.position.x, e, un.position.z), Xl.scale.set(1, n, 1));
  for (let o = 0; o < 3; o++) {
    const a = (((Dt / 90 + o / 3) % 1) + 1) % 1,
      s = o === 1 ? 1 - a : a,
      l = f1[o];
    (l.position.set(un.position.x, e - n * 0.92 * s, un.position.z),
      l.scale.set(9, 22, 9));
  }
  for (let o = 0; o < 4; o++) {
    const a = f1[3 + o],
      s = Dt * (0.02 + o * 0.006) + o * 1.7,
      l = 900 + o * 160;
    (h1
      .set(
        Math.cos(s) * l,
        Math.sin(s * 1.3) * 260 + o * 60 - 90,
        Math.sin(s) * l * 0.6 - 400,
      )
      .applyQuaternion(un.quaternion),
      a.position.copy(un.position).add(h1),
      a.scale.setScalar(6));
  }
}
let Ct = null;
const Ze = () =>
    !Ct &&
    (z.mode === "cockpit" || (z.mode === "director" && !!cn[z.shot].seat)),
  z = {
    mode: "chase",
    orbYaw: 0,
    orbPitch: 0,
    dist: 15,
    off: new f.Vector3(0, 4, -15),
    look: new f.Vector3(),
    pos: new f.Vector3(),
    focus: new f.Vector3(),
    roll: 0,
    dYaw: 0,
    dPitch: 0,
    dPos: new f.Vector3(),
    shot: 0,
    shotAt: 0,
    fix: null,
    cut: !0,
    touchedAt: -99,
    pan: new f.Vector2(),
    sway: new f.Vector2(),
    pYaw: null,
    pV: null,
    hYaw: 0,
    hPitch: 0,
  },
  Lt = {
    pos: new f.Vector3(),
    yaw: 0,
    camYaw: 0,
    pitch: 0,
    roll: 0,
    v: 0,
    len: 4.9,
    fwd: new f.Vector3(),
    type: 7,
    name: "car",
  },
  ue = new f.Vector3(),
  Ql = new f.Vector3(),
  _a = new f.Vector3(),
  Rh = new f.Vector3(),
  Dh = new f.Vector3(0, 1, 0),
  g1 = new f.Matrix4(),
  p1 = new f.Quaternion(),
  Zl = new f.Euler();
function _h(t) {
  if (Ct) {
    const e = Ct.L,
      n = Hi(e, Ct.k, t, Ct.c);
    ((Ct.c = e.ax ? n.x : n.z),
      Lt.pos.set(n.x, n.y, n.z),
      (Lt.yaw = Lt.camYaw = n.yaw),
      (Lt.pitch = n.pitch),
      (Lt.roll = n.roll),
      (Lt.v = n.v),
      (Lt.len = n.len),
      (Lt.type = n.type),
      (Lt.name = he[n.type].name),
      (Ct.o = { ...n }));
  } else
    (Lt.pos.copy(v.pos),
      (Lt.yaw = v.yaw),
      (Lt.camYaw = v.pathYaw),
      (Lt.pitch = v.pitch),
      (Lt.roll = v.roll),
      (Lt.v = v.v),
      (Lt.len = Vc),
      (Lt.type = Ca),
      (Lt.name = "car"));
  Lt.fwd.set(
    Math.sin(Lt.yaw) * Math.cos(Lt.pitch),
    Math.sin(Lt.pitch),
    Math.cos(Lt.yaw) * Math.cos(Lt.pitch),
  );
}
function Gh(t) {
  const e = ue.set(Math.sin(t), 0, Math.cos(t)),
    n = Ql.set(-Math.cos(t), 0, Math.sin(t));
  return [e, n];
}
function y1(t, e, n, o, a) {
  const s = Math.sin(t),
    l = Math.cos(t);
  return a.set(-l * e + s * o, n, s * e + l * o);
}
const cn = [
  {
    name: "Chase",
    dur: 9,
    off: [0, 3.2, -12.5],
    look: [0, 0.9, 9],
    roll: 0.35,
  },
  {
    name: "Under",
    dur: 7,
    off: [2.2, -5.5, -12],
    look: [0, 6, 16],
    roll: 0.15,
  },
  {
    name: "Over the drop",
    dur: 7,
    off: [0, 15, -7],
    look: [0, -34, 26],
    roll: 0.1,
    dive: 1,
  },
  {
    name: "Alongside",
    dur: 6,
    off: [9.5, 1.2, -1.5],
    look: [0, 0.6, 4],
    roll: 0.2,
  },
  { name: "Fly-by", dur: 6.5, fixed: 1 },
  {
    name: "Head on",
    dur: 6,
    off: [1.2, 2.2, 17],
    look: [0, 0.6, 0],
    roll: 0.1,
  },
  { name: "Driver", dur: 7, seat: 1 },
  {
    name: "High chase",
    dur: 7,
    off: [-3, 9, -22],
    look: [0, 0, 14],
    roll: 0.3,
  },
];
function Ae(t) {
  (t === z.mode && t !== "director") ||
    ((z.mode = t),
    (z.cut = !0),
    t === "cockpit" && ((Ct = null), (Yt = null), (z.hYaw = z.hPitch = 0)),
    t === "drone" &&
      (et.getWorldDirection(ue),
      z.dPos.copy(et.position),
      (z.dYaw = Math.atan2(-ue.x, -ue.z)),
      (z.dPitch = Math.asin(Q(ue.y, -1, 1)))),
    t === "director" && ((z.shot = 0), (z.shotAt = Dt), (z.fix = null)),
    document
      .querySelectorAll("#seg-cam button")
      .forEach((e) => e.classList.toggle("on", e.dataset.c === t)));
}
function Ko() {
  ((Ct = null),
    (Vt.cam = !1),
    (z.orbYaw = 0),
    (z.orbPitch = 0),
    (z.dist = 15),
    z.pan.set(0, 0),
    Ae("chase"),
    Ot("Back in your car"));
}
function Hh() {
  const t = v.man ? v.y : Sn(v.s);
  v.man = !1;
  const e = Math.max(
      0,
      Ce.indexOf(Pa(t)) - 4 - Math.floor(se(v.s | 0, 3, 7) * 2),
    ),
    n = v.alt.filter((o) => o[0] < v.s);
  ((v.alt.length = 0), v.alt.push(...n, [v.s, t], [v.s + 300, Ce[e]]));
}
function Oh() {
  const t = v.man ? v.y : Sn(v.s);
  v.man = !1;
  const e = Ce.indexOf(Pa(t)),
    n = Math.min(Math.max(Gc, e), e + 4),
    o = v.alt.filter((a) => a[0] < v.s);
  ((v.alt.length = 0), v.alt.push(...o, [v.s, t], [v.s + 320, Ce[n]]));
}
function du(t, e = 1.6) {
  const n = Rn(Math.floor(t.x / It), Math.floor(t.z / It));
  if (t.x < n.x0 - e || t.x > n.x1 + e || t.z < n.z0 - e || t.z > n.z1 + e)
    return !1;
  let o = !1;
  for (const a of n.towers)
    for (const s of a.segs.concat(a.pods)) {
      if (
        t.y < s.y0 - e ||
        t.y > s.y1 + e ||
        t.x < s.x0 - e ||
        t.x > s.x1 + e ||
        t.z < s.z0 - e ||
        t.z > s.z1 + e
      )
        continue;
      const l = t.x - (s.x0 - e),
        r = s.x1 + e - t.x,
        u = t.z - (s.z0 - e),
        i = s.z1 + e - t.z,
        c = s.y1 + e - t.y,
        m = Math.min(l, r, u, i, c);
      (m === l
        ? (t.x = s.x0 - e)
        : m === r
          ? (t.x = s.x1 + e)
          : m === u
            ? (t.z = s.z0 - e)
            : m === i
              ? (t.z = s.z1 + e)
              : (t.y = s.y1 + e),
        (o = !0));
    }
  return (t.y < 4 && (t.y = 4), o);
}
const Ht = new Set();
function Wh(t, e) {
  _h(e);
  let n = 0;
  z.mode === "director" &&
    Dt - z.shotAt > cn[z.shot].dur &&
    ((z.shot = (z.shot + 1) % cn.length),
    cn[z.shot].seat && Ct && (z.shot = (z.shot + 1) % cn.length),
    (z.shotAt = Dt),
    (z.cut = !0),
    (z.fix = null),
    cn[z.shot].dive && !Ct ? Hh() : z.shot === cn.length - 1 && !Ct && Oh());
  const o = Ze();
  if (o) {
    if (
      (z.mode === "cockpit" &&
        (Ht.has("q") && (z.hYaw = Math.min(1.5, z.hYaw + t * 1.6)),
        Ht.has("e") && (z.hYaw = Math.max(-1.5, z.hYaw - t * 1.6))),
      z.cut && z.mode !== "cockpit" && (z.hYaw = z.hPitch = 0),
      !Vt.on && !Xt && !Ht.has("q") && !Ht.has("e") && Nt - z.touchedAt > 0.5)
    ) {
      const r = Math.exp(-t * 2.4);
      ((z.hYaw *= r), (z.hPitch *= r));
    }
    if (t > 0) {
      let r = v.yaw - (z.pYaw ?? v.yaw);
      r = Math.atan2(Math.sin(r), Math.cos(r));
      const u = (v.v - (z.pV ?? v.v)) / t,
        i = 1 - Math.exp(-t * 5);
      ((z.sway.x += (Q((-r / t) * v.v * 0.0016, -0.05, 0.05) - z.sway.x) * i),
        (z.sway.y += (Q(-u * 0.0012, -0.035, 0.035) - z.sway.y) * i));
    }
    ((z.pYaw = v.yaw),
      (z.pV = v.v),
      Wo(yn[0] + z.sway.x, yn[1], yn[2] + z.sway.y, z.pos),
      Wo(
        yn[0] + z.sway.x + Math.sin(z.hYaw) * 20,
        yn[1] + Math.sin(z.hPitch - 0.01) * 20,
        yn[2] + Math.cos(z.hYaw) * 20,
        z.look,
      ));
  } else if (z.mode === "chase" || z.mode === "director") {
    const r = z.mode === "director" ? cn[z.shot] : cn[0],
      u = Lt.len / 6.4,
      i = Math.sqrt(u);
    if (r.fixed) {
      if (!z.fix) {
        const c = Lt.pos.x + Lt.fwd.x * 110,
          m = Lt.pos.z + Lt.fwd.z * 110,
          [, d] = Gh(Lt.yaw),
          h = Math.max(6, Ct ? 6 : Ue(v.end.ax, 0) * 0 + 9);
        ((z.fix = new f.Vector3(c + d.x * h, Lt.pos.y + 5, m + d.z * h)),
          du(z.fix));
      }
      (z.pos.copy(z.fix), z.look.copy(Lt.pos), (n = 0));
    } else {
      const c = z.mode === "chase" && !Ct ? Vt.k : 0,
        m = r.off[0],
        d = r.off[1] * (1 - c * 0.35),
        h =
          r.off[2] * (z.mode === "chase" ? z.dist / 15 : 1) * i * (1 - c * 0.3);
      if (
        (z.mode === "chase" &&
          (Ht.has("q") && (z.orbYaw += t * 1.3),
          Ht.has("e") && (z.orbYaw -= t * 1.3)),
        z.mode === "chase" && Vt.cam)
      )
        if (Ht.has("q") || Ht.has("e") || Ct) Vt.cam = !1;
        else {
          const M = Vt.on ? 2.3 : 0;
          ((z.orbYaw += (M - z.orbYaw) * (1 - Math.exp(-t * 0.9))),
            !Vt.on &&
              Math.abs(z.orbYaw) < 0.01 &&
              ((z.orbYaw = 0), (Vt.cam = !1)));
        }
      const y = Lt.camYaw + (z.mode === "chase" ? z.orbYaw : 0),
        x = z.mode === "chase" ? z.orbPitch : 0;
      let b = m,
        V = d,
        T = h;
      if (x) {
        const M = Math.cos(x),
          L = Math.sin(x),
          C = V * M - T * L,
          E = V * L + T * M;
        ((V = C), (T = E));
      }
      (y1(y, b, V * i, T, _a),
        z.cut ? z.off.copy(_a) : z.off.lerp(_a, 1 - Math.exp(-t * 4.5)));
      const A = Math.sin(Lt.camYaw),
        g = Math.cos(Lt.camYaw);
      if (z.cut) z.focus.copy(Lt.pos);
      else {
        const M = Lt.pos.x - z.focus.x,
          L = Lt.pos.y - z.focus.y,
          C = Lt.pos.z - z.focus.z,
          E = M * A + C * g,
          R = 1 - Math.exp(-t * 2.6),
          G = 1 - Math.exp(-t * 3.4);
        ((z.focus.x += A * E + (M - A * E) * R),
          (z.focus.z += g * E + (C - g * E) * R),
          (z.focus.y += L * G));
      }
      if (
        (z.pos.copy(z.focus).add(z.off),
        z.mode === "chase" && (z.pan.x || z.pan.y))
      ) {
        const M = -Math.cos(Lt.camYaw),
          L = Math.sin(Lt.camYaw);
        ((z.pos.x += M * z.pan.x),
          (z.pos.z += L * z.pan.x),
          (z.pos.y += z.pan.y));
      }
      (du(z.pos, 1.2),
        y1(Lt.camYaw, r.look[0], r.look[1], r.look[2] * (1 - c * 0.9), _a),
        z.look.copy(Lt.pos).add(_a),
        (n = Lt.roll * (r.roll || 0)));
    }
  } else if (z.mode === "drone") {
    const r = (Ht.has("shift") ? 70 : 28) * t,
      u = ue.set(
        -Math.sin(z.dYaw) * Math.cos(z.dPitch),
        Math.sin(z.dPitch),
        -Math.cos(z.dYaw) * Math.cos(z.dPitch),
      ),
      i = Ql.set(Math.cos(z.dYaw), 0, -Math.sin(z.dYaw));
    ((Ht.has("w") || Ht.has("arrowup")) && z.dPos.addScaledVector(u, r),
      (Ht.has("s") || Ht.has("arrowdown")) && z.dPos.addScaledVector(u, -r),
      (Ht.has("d") || Ht.has("arrowright")) && z.dPos.addScaledVector(i, r),
      (Ht.has("a") || Ht.has("arrowleft")) && z.dPos.addScaledVector(i, -r),
      Ht.has("q") && (z.dYaw += t * 1.1),
      Ht.has("e") && (z.dYaw -= t * 1.1),
      du(z.dPos, 1.5),
      (z.dPos.y = Q(z.dPos.y, 4, 1400)),
      z.pos.copy(z.dPos),
      z.look.copy(z.dPos).add(u));
  }
  (Ht.has("=") && (D.fov = Q(D.fov - t * 20, 24, 90)),
    Ht.has("-") && (D.fov = Q(D.fov + t * 20, 24, 90)));
  const a = Ct ? 0 : Bt.k * Q((v.v - 40) / 100, 0, 1);
  if (a > 0 && !o && z.mode !== "drone") {
    const r = a * 0.035;
    ((z.pos.x += Math.sin(Dt * 61) * r),
      (z.pos.y += Math.sin(Dt * 47 + 1) * r),
      (z.pos.z += Math.sin(Dt * 53 + 2) * r));
  }
  const s = D.fov + (et.aspect < 0.8 ? 14 : 0) + (o ? 8 : 0) + a * (o ? 6 : 12),
    l = o ? 0.1 : 0.4;
  if (
    ((Math.abs(et.fov - s) > 0.01 || et.near !== l) &&
      ((et.fov = s), (et.near = l), et.updateProjectionMatrix()),
    (z.roll = z.cut || o ? n : z.roll + (n - z.roll) * (1 - Math.exp(-t * 3))),
    z.cut && (Gs = !0),
    (z.cut = !1),
    et.position.copy(z.pos),
    o)
  ) {
    (co.set(-v.pitch, v.yaw, v.roll, "YXZ"),
      et.quaternion
        .setFromEuler(co)
        .multiply(
          p1.setFromEuler(Zl.set(z.hPitch - 0.01, Math.PI + z.hYaw, 0, "YXZ")),
        ));
    return;
  }
  (g1.lookAt(z.pos, z.look, Dh),
    et.quaternion.setFromRotationMatrix(g1),
    z.roll &&
      et.quaternion.multiply(p1.setFromAxisAngle(_a.set(0, 0, 1), -z.roll)));
}
const x1 = 1.18,
  b1 = 0.2,
  Ga = document.createElement("canvas");
((Ga.width = 1536), (Ga.height = Math.round((1536 * b1) / x1)));
const Jl = new f.CanvasTexture(Ga);
((Jl.colorSpace = f.SRGBColorSpace), (Jl.anisotropy = 8));
let tr = !1;
function mu() {
  const t = Ga.getContext("2d"),
    e = Ga.width,
    n = Ga.height,
    o = "SAEL.NET";
  (t.clearRect(0, 0, e, n),
    (t.fillStyle = "#0b0c10"),
    t.beginPath(),
    t.roundRect(4, 4, e - 8, n - 8, 30),
    t.fill());
  let a = 228;
  ((t.textAlign = "center"), (t.textBaseline = "middle"));
  const s = () => {
    ((t.font = `700 ${a}px Outfit, Arial, sans-serif`),
      (t.letterSpacing = Math.round(a * 0.1) + "px"));
  };
  for (s(); t.measureText(o).width > e - 110 && a > 120;) ((a -= 6), s());
  ((t.fillStyle = "#000"),
    t.fillText(o, e / 2 + a * 0.07, n / 2 + a * 0.06),
    (t.fillStyle = tr ? "#ffe2a0" : "#d2b27a"),
    t.fillText(o, e / 2 + a * 0.06, n / 2 + a * 0.045),
    (Jl.needsUpdate = !0));
}
(mu(), document.fonts?.ready.then(mu));
const w1 = W(0.78),
  qh = Ve(Jl),
  fu = new f.MeshBasicNodeMaterial();
((fu.colorNode = At(() => {
  const t = qh.sample(re()).toVar();
  return (
    F(t.a.lessThan(0.5), () => {
      ns();
    }),
    nt(t.rgb.mul(t.rgb).mul(w1), 0)
  );
})()),
  (fu.fog = !1));
const Uo = new f.Mesh(new f.PlaneGeometry(x1, b1), fu);
ze.add(Uo);
function Kh() {
  const t = v.pos;
  (Zl.set(-v.pitch, v.yaw, v.roll, "YXZ"),
    Uo.quaternion.setFromEuler(Zl),
    Uo.rotateY(Math.PI),
    ue.set(0, 0.66, -2.462).applyEuler(Zl),
    Uo.position.copy(t).add(ue),
    (Uo.visible = !Ct || z.mode === "drone" || !0),
    (w1.value = tr ? 1.05 : 0.78));
}
nm = () => {
  open(Br, "_blank", "noopener");
};
const dn = {
  tow: tt("#s-tow"),
  car: tt("#s-car"),
  lit: tt("#s-lit"),
  why: tt("#why"),
  hud: tt("#hud"),
  tags: tt("#tags"),
  tip: tt("#tip"),
};
function M1() {
  const t = document.createElement("div");
  return (
    (t.className = "pill"),
    (t.innerHTML = "<i></i><span></span>"),
    dn.tags.appendChild(t),
    t
  );
}
const er = { car: M1(), tower: M1() };
let Ls = !0,
  Yt = null,
  T1 = "",
  v1 = "",
  hu = 60,
  gu = 0;
const Cn = new f.Vector3();
function nr(t, e, n, o, a) {
  if (!n || !Ls) {
    t.classList.remove("on");
    return;
  }
  if (
    (Cn.copy(e).project(et),
    Cn.z > 1 || Math.abs(Cn.x) > 1.1 || Math.abs(Cn.y) > 1.1)
  ) {
    t.classList.remove("on");
    return;
  }
  const s = (Cn.x * 0.5 + 0.5) * fn.clientWidth,
    l = (-Cn.y * 0.5 + 0.5) * fn.clientHeight;
  ((t.style.transform = `translate(${s.toFixed(1)}px,${l.toFixed(1)}px) translate(-50%,-100%) translateY(-12px)`),
    t._t !== o && ((t.querySelector("span").innerHTML = o), (t._t = o)),
    (t.querySelector("i").style.background = a),
    (t.querySelector("i").style.color = a),
    t.classList.add("on"));
}
const mo = (t) => Math.round(t * 3.6);
function A1() {
  if ((tn && Nt - P1 > 0.25 && $o(), Ct && Ct.o)) {
    const o = Ct.o;
    (ue.set(o.x, o.y + he[o.type].len * 0.42 + 1.2, o.z),
      nr(
        er.car,
        ue,
        !0,
        `${he[o.type].name.toUpperCase()} <em>\xB7 ${mo(o.v)} km/h \xB7 lane ${Math.round(Ct.L.y)} m</em>`,
        "#ff5a4f",
      ));
  } else nr(er.car, v.pos, !1);
  if (
    (Yt
      ? (ue.set(Yt.cx, Yt.H + 6, Yt.cz),
        nr(
          er.tower,
          ue,
          !0,
          `TOWER ${Yt.id} <em>\xB7 ${Math.round(Yt.H)} m \xB7 ${Math.round(Yt.H / Yt.fh)} floors \xB7 ${x0[Yt.style]}</em>`,
          "#7fe3ff",
        ))
      : nr(er.tower, v.pos, !1),
    Nt - gu < 0.25)
  )
    return;
  ((gu = Nt), sr());
  const t = zt.info.render,
    e = `<span><b>${Math.round(hu)}</b> FPS</span><span><b>${t.drawCalls}</b> DRAWS</span><span><b>${(t.triangles / 1e6).toFixed(2)}M</b> TRIANGLES</span><span>SEED <b>${$e}</b></span><span><b>${_r ? "WEBGPU" : "WEBGL 2"}</b></span>`;
  if ((e !== v1 && ((dn.hud.innerHTML = e), (v1 = e)), me.litAt !== wt.litK)) {
    me.litAt = wt.litK;
    let o = 0;
    for (const a of me.list) o += (a.rooms || 0) * Math.min(1, wt.litK * a.lit);
    me.lit = o;
  }
  ((dn.tow.textContent = Nn(me.towers)),
    (dn.car.textContent = Nn(Wi.aloft)),
    (dn.lit.textContent =
      "~" + (me.lit >= 1e4 ? Math.round(me.lit / 1e3) + "k" : Nn(me.lit))));
  const n = Uh();
  n !== T1 && ((dn.why.innerHTML = n), (T1 = n));
}
function Uh() {
  if (Yn)
    return 'Blueprint: every tower drawn the way the generator sees it, as stacked boxes cut into <b class="c">floors and bays</b>. The windows, rooms and clutter you saw are all worked out from these lines.';
  if (Ct && Ct.o) {
    const t = Ct.o,
      e = Ct.L;
    return `You are chasing a <b class="r">${he[t.type].name}</b> in the <b>${Math.round(e.y)} m</b> lane at <b>${mo(t.v)} km/h</b>. Nothing steers it: its place is <b>s = s\u2080 + v\xB7t</b>, worked out fresh every frame for every car in sight.`;
  }
  if (Vt.on && !Yt)
    return Vt.door < 0.02
      ? `Coming to a hover at <b>${mo(v.v)} km/h</b> and slowing. The doors wait until the car is still, then rise on hinges along the edges of the roof.`
      : `Hovering <b>${Math.round(v.pos.y)} m</b> up with the doors open <b class="c">${Math.round((Qi() * 180) / Math.PI)}\xB0</b>: gull wings, each turning on a hinge along the roof's edge. W S raise and lower it, A D slide it across, \u21E7V takes the seat, \u21E7H flies on.`;
  if (Bt.on && !Yt)
    return `Turbo: the electric drive wide open, <b class="r">${mo(v.v)} km/h</b>. It still brakes for every turn, hard (38 m/s\xB2, from up to 540 km/h), and the tail lights leave <b class="r">red trails</b> that hang in the air for a second and a half.`;
  if (Ze() && !Yt)
    return `From the driver's seat: the autopilot flies the <b class="c">route drawn ahead</b> at <b>${mo(v.v)} km/h</b>, ${Math.round(v.pos.y)} m up, and plans every turn and change of level itself. A D W S only suggest; let go and it takes over again.`;
  if (Yt && Yt.mega) {
    const t = Yt,
      e = t.mega;
    return [
      `<b class="c">The Spire</b> stands ${Nn(nl)} m: a glass needle inside a <b>cage of light</b>, 24 straight struts leaning both ways that make a hyperboloid, pinched to ${Math.round(2 * ol(340) * t.para.h)} m across at 340 m and flaring to ${Math.round(2 * ee.rt * t.para.h)} m at ${Nn(ee.y1)} m, bound by six rings of light, round a <b>glass eye</b> ${Math.round(80 * t.para.h)} m across.`,
      `<b class="c">The Gate</b>: a catenary <b>${is} m</b> high whose feet stand <b>${Math.round(e.span)} m</b> apart in two plazas, vaulting the block between them and two streets. Light runs up its four edges at night.`,
      `<b class="c">The Skyport</b> floats <b>450 m</b> over a low district on three rings of light and the engine in its belly: a saucer ${en * 2} m across with a glass dome, three towers and three landing pads on its deck. The towers under it are kept below 380 m.`,
    ][e.kind];
  }
  if (Yt && Yt.para) {
    const t = Yt,
      e = t.para.T;
    return `Tower <b class="c">${t.id}</b> is parametric: one section (a superellipse, exponent ${e.p}) lofted <b>${Math.round(t.H)} m</b> and turned <b>${Math.round((e.tw * 180) / Math.PI)}\xB0</b> on the way up, with ${e.nf} white fins and a <b>sky lounge ${Math.round(t.para.lounge)} m up</b>, its pool reaching ${Math.round(t.para.cant)} m out from the shaft.`;
  }
  if (Yt) {
    const t = Yt,
      e = Math.round(t.H / t.fh),
      n = 2 * (t.x1 - t.x0 + (t.z1 - t.z0));
    return `Tower <b class="c">${t.id}</b> is <b>${Math.round(t.H)} m</b>: ${t.segs.length} stacked segments, <b>${e} floors</b> of ${t.fh.toFixed(1)} m and about <b>${Nn((n / t.bay) * e * (t.style === ao ? 0.32 : 0.93))} windows</b>, all from one hash of the seed.`;
  }
  return be.style === "90s"
    ? 'Drawn as <b class="a">90s cel animation</b>: ink wherever the depth jumps or a surface turns, the sun in <b>three flat tones</b> with hard shadows, every window a flat cell of paint, a glow round each light and grain over it all. The city under it is the same.'
    : be.style === "modern"
      ? `Drawn as a <b class="c">modern anime feature</b>: finer lines in a darker shade of the colour under them, softer steps of light, a vivid sky and haze, clouds lined with sun, and the lens's own flare and <b>sparkle</b> on the brightest lights.`
      : `Seed <b class="c">${$e}</b> grew <b>${Nn(me.towers)} towers</b> within ${(al / 1e3).toFixed(1)} km of you in <b>${Math.round(me.builtIn)} ms</b>, with about <b>${Nn(Math.round(me.lit / 100) * 100)} rooms lit</b> and <b>${Nn(Wi.aloft)} cars</b> in their lanes. None of it was downloaded.`;
}
const pu = new f.Raycaster(),
  V1 = new f.Vector2(),
  d5 = new f.Vector3();
function Yh(t) {
  const e = { x0: 1e9, x1: -1e9, y0: 0, y1: -1e9, z0: 1e9, z1: -1e9 };
  for (const n of t.segs.concat(t.pods))
    ((e.x0 = Math.min(e.x0, n.x0)),
      (e.x1 = Math.max(e.x1, n.x1)),
      (e.z0 = Math.min(e.z0, n.z0)),
      (e.z1 = Math.max(e.z1, n.z1)),
      (e.y1 = Math.max(e.y1, n.y1)));
  return e;
}
function $h(t) {
  const e = je.getBoundingClientRect();
  return (
    V1.set(
      ((t.clientX - e.left) / e.width) * 2 - 1,
      (-(t.clientY - e.top) / e.height) * 2 + 1,
    ),
    pu.setFromCamera(V1, et),
    pu.ray
  );
}
function yu(t, e) {
  const n = t.origin,
    o = t.direction;
  let a = 0,
    s = 1e9,
    l,
    r,
    u;
  return (
    (l = 1 / o.x),
    (r = (e.x0 - n.x) * l),
    (u = (e.x1 - n.x) * l),
    (a = Math.max(a, Math.min(r, u))),
    (s = Math.min(s, Math.max(r, u))),
    (l = 1 / o.y),
    (r = (e.y0 - n.y) * l),
    (u = (e.y1 - n.y) * l),
    (a = Math.max(a, Math.min(r, u))),
    (s = Math.min(s, Math.max(r, u))),
    (l = 1 / o.z),
    (r = (e.z0 - n.z) * l),
    (u = (e.z1 - n.z) * l),
    (a = Math.max(a, Math.min(r, u))),
    (s = Math.min(s, Math.max(r, u))),
    a <= s ? a : -1
  );
}
function xu(t, e = !0) {
  const n = $h(t);
  let o = null,
    a = 1e9;
  if (ke.k > 0.9 && au && ft.on && Ze()) {
    const r = pu.intersectObject(au, !1)[0];
    if (r && r.uv && r.distance < a) {
      const u = r.uv.x * ou;
      u > ke.nx &&
        u < ke.nx + ke.nw &&
        ((a = r.distance), (o = { kind: "radio" }));
    }
  }
  const s = new f.Vector3().copy(Uo.position);
  if (n.distanceToPoint(s) < 0.6) {
    const r = n.origin.distanceTo(s);
    r < a && ((a = r), (o = { kind: "mark" }));
  }
  for (const r of rn) {
    ue.set(r.x, r.y + 1.2, r.z);
    const u = he[r.type].len * 0.5 + 0.6;
    if (n.distanceToPoint(ue) < u) {
      const i = n.origin.distanceTo(ue);
      i < a && ((a = i), (o = { kind: "car", C: r }));
    }
  }
  if (!Ze() && ((ue.copy(v.pos).y += 0.7), n.distanceToPoint(ue) < 2.8)) {
    const r = n.origin.distanceTo(ue);
    r < a - 1 && ((a = r), (o = { kind: "hero" }));
  }
  for (const r of Hn)
    for (const u of r.detail.boards) {
      const i = n.direction.x * u.nx + n.direction.z * u.nz;
      if (i >= 0) continue;
      const c = ((u.x - n.origin.x) * u.nx + (u.z - n.origin.z) * u.nz) / i;
      if (c <= 0 || c >= a) continue;
      const m = n.origin.x + n.direction.x * c - u.x,
        d = n.origin.y + n.direction.y * c - u.y,
        h = n.origin.z + n.direction.z * c - u.z;
      Math.abs(m * u.tx + h * u.tz) < u.w / 2 &&
        Math.abs(d) < u.h / 2 &&
        ((a = c), (o = { kind: "board", b: u }));
    }
  if (e) {
    for (const r of me.list)
      if (!(r.H < 20 || yu(n, r.bb || (r.bb = Yh(r))) < 0)) {
        for (const u of r.segs) {
          const i = yu(n, u);
          i >= 0 && i < a && ((a = i), (o = { kind: "tower", t: r }));
        }
        for (const u of r.pods) {
          const i = yu(n, u);
          i >= 0 && i < a && ((a = i), (o = { kind: "tower", t: r }));
        }
      }
  }
  return o;
}
function z1(t) {
  if (!t) {
    Yt = null;
    return;
  }
  if (t.kind === "radio") {
    rr();
    const e = Ln[ft.i];
    Ot(`Next on the radio: \u201C${e.title}\u201D by ${e.by}`);
    return;
  }
  if (t.kind === "mark") {
    open(Br, "_blank", "noopener");
    return;
  }
  if (t.kind === "board") {
    open(t.b.url, "_blank", "noopener");
    return;
  }
  if (t.kind === "car") {
    ((Ct = { L: t.C.L, k: t.C.k, c: t.C.L.ax ? t.C.x : t.C.z }),
      (Yt = null),
      z.mode !== "chase" && Ae("chase"),
      (z.cut = !0),
      Ot("Chasing a " + he[t.C.type].name + " \xB7 R to return to your car"),
      Jo("lock"));
    return;
  }
  if (t.kind === "hero") {
    Ko();
    return;
  }
  t.kind === "tower" &&
    ((Yt = Yt === t.t ? null : t.t), (p.uPick.value = Yt ? Yt.seed : -1));
}
let Xt = null,
  fo = null;
const En = new Map(),
  S1 = () => {
    const [t, e] = [...En.values()];
    return Math.hypot(t.x - e.x, t.y - e.y) || 1;
  };
function k1(t) {
  if (((z.touchedAt = Nt), Ze())) {
    D.fov = Q(D.fov * Math.pow(t, 0.5), 40, 80);
    return;
  }
  z.mode === "drone"
    ? (et.getWorldDirection(ue), z.dPos.addScaledVector(ue, (1 - t) * 60))
    : (z.mode === "director" && Ae("chase"), (z.dist = Q(z.dist * t, 6, 70)));
}
je.addEventListener("contextmenu", (t) => t.preventDefault());
let or = !1,
  bu = 0;
function wu() {
  ((bu = 0), or && ((or = !1), z.mode === "director" && Ae("chase")));
}
(addEventListener("pointerdown", wu, !0),
  addEventListener("wheel", wu, !0),
  je.addEventListener("pointerdown", (t) => {
    const e = !Vo;
    ((Vo = !0),
      je.setPointerCapture(t.pointerId),
      En.set(t.pointerId, { x: t.clientX, y: t.clientY }),
      J1(),
      En.size === 1
        ? ((Xt = {
            x: t.clientX,
            y: t.clientY,
            x0: t.clientX,
            y0: t.clientY,
            b: t.button,
            moved: 0,
            id: t.pointerId,
            first: e,
          }),
          (fo = null),
          (Ge =
            t.pointerType === "touch" && z.mode !== "drone" && !Ct
              ? { x0: t.clientX, y0: t.clientY, x: 0, y: 0, id: t.pointerId }
              : null))
        : ((Xt = null), (fo = { d: S1() }), (Ge = null)));
  }));
const C1 = (t, e) =>
  Math.abs(t) < 10 ? 0 : Q((t - Math.sign(t) * 10) / e, -1, 1);
(je.addEventListener("pointermove", (t) => {
  const e = En.get(t.pointerId);
  if ((e && ((e.x = t.clientX), (e.y = t.clientY)), fo && En.size >= 2)) {
    const a = S1();
    (k1(fo.d / a), (fo.d = a));
    return;
  }
  if (Ge && Ge.id === t.pointerId) {
    ((Ge.x = C1(t.clientX - Ge.x0, 60)),
      (Ge.y = C1(Ge.y0 - t.clientY, 80)),
      Xt &&
        ((Xt.moved += Math.abs(t.clientX - Xt.x) + Math.abs(t.clientY - Xt.y)),
        (Xt.x = t.clientX),
        (Xt.y = t.clientY)),
      z.mode === "director" && Xt && Xt.moved > 12 && Ae("chase"));
    return;
  }
  if (!Xt || Xt.id !== t.pointerId) {
    En.size || Xh(t);
    return;
  }
  const n = t.clientX - Xt.x,
    o = t.clientY - Xt.y;
  ((Xt.x = t.clientX),
    (Xt.y = t.clientY),
    (Xt.moved += Math.abs(n) + Math.abs(o)),
    !(Xt.moved < 4) &&
      ((z.touchedAt = Nt),
      z.mode === "director" && Ae(Ze() ? "cockpit" : "chase"),
      z.mode === "cockpit"
        ? ((z.hYaw = Q(z.hYaw - n * 0.004, -1.5, 1.5)),
          (z.hPitch = Q(z.hPitch - o * 0.003, -0.55, 0.5)))
        : z.mode === "chase"
          ? ((Vt.cam = !1),
            Xt.b === 2
              ? z.pan.set(
                  Q(z.pan.x - n * 0.03, -8, 8),
                  Q(z.pan.y + o * 0.03, -5, 5),
                )
              : ((z.orbYaw -= n * 0.006),
                (z.orbPitch = Q(z.orbPitch + o * 0.004, -0.5, 0.95))))
          : Xt.b === 2 || t.shiftKey
            ? (ue.set(Math.cos(z.dYaw), 0, -Math.sin(z.dYaw)),
              z.dPos.addScaledVector(ue, -n * 0.15),
              (z.dPos.y += o * 0.15))
            : ((z.dYaw -= n * 0.004),
              (z.dPitch = Q(z.dPitch - o * 0.004, -1.45, 1.45)))));
}),
  je.addEventListener("pointerup", (t) => {
    (En.delete(t.pointerId),
      Ge && Ge.id === t.pointerId && (Ge = null),
      Xt &&
        Xt.id === t.pointerId &&
        Xt.moved < 6 &&
        !fo &&
        !Xt.first &&
        z1(xu(t)),
      Xt && Xt.id === t.pointerId && (Xt = null),
      En.size || (fo = null));
  }),
  je.addEventListener("pointercancel", (t) => {
    (En.delete(t.pointerId), (Xt = null), (Ge = null), En.size || (fo = null));
  }),
  je.addEventListener(
    "wheel",
    (t) => {
      Vo && (t.preventDefault(), k1(Math.exp(Q(t.deltaY, -400, 400) * 0.0012)));
    },
    { passive: !1 },
  ));
let jh = 0;
function Xh(t) {
  if (++jh % 3) return;
  const e = xu(t, !1);
  fn.classList.toggle("hot", !!e && e.kind !== "tower");
  const n = !!e && e.kind === "mark";
  n !== tr && ((tr = n), mu());
  const o = e && e.kind === "board" ? e.b : null;
  if (
    (p.uHotC.value.set(o ? o.cx : 0, o ? o.cy : -1e4, o ? o.cz : 0),
    e &&
      (e.kind === "car" ||
        e.kind === "mark" ||
        e.kind === "board" ||
        e.kind === "radio"))
  ) {
    const [a, s] =
      e.kind === "mark"
        ? ["Ryan Sael on X", "@RYANSAEL"]
        : e.kind === "board"
          ? [e.b.name, e.b.sub]
          : e.kind === "radio"
            ? ["Next track", Ln[ft.order[(ft.p + 1) % ft.order.length]].title]
            : ["Chase this " + he[e.C.type].name];
    if (((dn.tip.textContent = a), s)) {
      const l = document.createElement("small");
      ((l.textContent = s), dn.tip.appendChild(l));
    }
    ((dn.tip.style.left = t.clientX + "px"),
      (dn.tip.style.top = t.clientY + "px"),
      dn.tip.classList.add("on"));
  } else dn.tip.classList.remove("on");
}
(document.querySelectorAll("#seg-cam button").forEach(
  (t) =>
    (t.onclick = () => {
      t.dataset.c === "chase" ? Ko() : Ae(t.dataset.c);
    }),
),
  document.querySelectorAll("#seg-sky button").forEach(
    (t) =>
      (t.onclick = () => {
        (Sa(t.dataset.s), Ot(t.textContent));
      }),
  ),
  document
    .querySelectorAll("#seg-anime button")
    .forEach((t) => (t.onclick = () => Ds(t.dataset.a))));
const Yo = tt("#traf");
function Ps(t) {
  ((D.traffic = Q(t, 0, 1)),
    (tt("#traf-v").textContent = Math.round(D.traffic * 100) + " %"),
    (tt("#traf-fl").style.width = D.traffic * 100 + "%"),
    (tt("#traf-kn").style.left = D.traffic * 100 + "%"),
    Yo.setAttribute("aria-valuenow", Math.round(D.traffic * 100)));
}
(Yo.addEventListener("pointerdown", (t) => {
  Yo.setPointerCapture(t.pointerId);
  const e = (n) => {
    const o = Yo.getBoundingClientRect();
    Ps((n.clientX - o.left) / o.width);
  };
  (e(t),
    (Yo.onpointermove = (n) => {
      Yo.hasPointerCapture(n.pointerId) && e(n);
    }));
}),
  Yo.addEventListener("keydown", (t) => {
    (t.key === "ArrowLeft" || t.key === "ArrowRight") &&
      (t.preventDefault(),
      t.stopPropagation(),
      Ps(D.traffic + (t.key === "ArrowLeft" ? -0.05 : 0.05)));
  }),
  (tt("#b-new").onclick = () => ir()),
  (tt("#b-blue").onclick = () => Vu()),
  (tt("#b-lanes").onclick = () => zu()));
const Ln = [
  {
    id: "C3fxudvU-UU",
    title: "SLOPCORE: ESCAPE VELOCITY",
    by: "anabology",
    ch: "https://www.youtube.com/@anabology",
  },
  {
    id: "Ns1N1L_qIw0",
    title: "UPPING MY P(DOOM)",
    by: "INXANITY",
    ch: "https://www.youtube.com/@999inxanity",
  },
  {
    id: "MV_3Dpw-BRY",
    title: "Nightcall",
    by: "Kavinsky",
    ch: "https://www.youtube.com/@RecordMakers",
  },
];
function E1(t = -1) {
  const e = Ln.map((n, o) => o);
  for (let n = e.length - 1; n > 0; n--) {
    const o = Math.floor(Math.random() * (n + 1));
    [e[n], e[o]] = [e[o], e[n]];
  }
  return (
    e.length > 1 &&
      e[0] === t &&
      ([e[0], e[e.length - 1]] = [e[e.length - 1], e[0]]),
    e
  );
}
const ft = {
    on: !1,
    order: E1(),
    p: 0,
    i: 0,
    yt: null,
    api: null,
    fail: 0,
    state: "off",
    ready: !1,
  },
  He = tt("#radio"),
  Mu = tt("#radio-host"),
  Qh = tt("#rd-slot");
ft.i = ft.order[0];
function Zh() {
  return (ft.api ??= new Promise((t, e) => {
    if (window.YT && YT.Player) return t(YT);
    const n = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      (n?.(), t(YT));
    };
    const o = document.createElement("script");
    ((o.src = "https://www.youtube.com/iframe_api"),
      (o.async = !0),
      (o.onerror = () => e(new Error("blocked"))),
      document.head.appendChild(o),
      setTimeout(() => e(new Error("timeout")), 15e3));
  }));
}
function L1() {
  const t = Ln[ft.i];
  ((tt("#rd-title").textContent = t.title),
    (tt("#rd-title").href = "https://www.youtube.com/watch?v=" + t.id),
    (tt("#rd-by").textContent = t.by),
    (tt("#rd-by").href = t.ch),
    (tt("#rd-state").textContent =
      ft.state === "down"
        ? ft.err === 100
          ? "Gone from YouTube"
          : ft.err === 101 || ft.err === 150
            ? "YouTube will not play it here"
            : "YouTube could not be reached"
        : ft.state === "wait"
          ? "Tuning in"
          : ""),
    ar());
}
function ar() {
  const t = tt("#rd-mq"),
    e = tt("#rd-mq-in");
  if (!t || He.hidden) return;
  const n = e.scrollWidth - t.clientWidth;
  (t.classList.toggle("go", n > 3),
    n > 3 &&
      (t.style.setProperty("--mq", -n + "px"),
      t.style.setProperty("--mqd", Math.max(5, n / 24 + 3).toFixed(1) + "s")));
}
function Jh() {
  const t = tt("#rd-play"),
    e = !ft.playing;
  (t.classList.toggle("paused", e),
    (t.title = e ? "Play" : "Pause"),
    t.setAttribute("aria-label", t.title));
}
function sr() {
  if (He.hidden) return;
  const t = innerHeight,
    e = He.offsetHeight;
  if (innerWidth <= 900) {
    ((He.style.right = "12px"),
      (He.style.top = tt(".side").getBoundingClientRect().bottom + 8 + "px"));
    return;
  }
  const n = tt(".ctl").getBoundingClientRect();
  (n.bottom + 10 + e <= t - 300
    ? ((He.style.right = "24px"), (He.style.top = n.bottom + 10 + "px"))
    : ((He.style.right = innerWidth - n.left + 10 + "px"),
      (He.style.top = n.top + "px")),
    (yt.slotAt = -9));
}
function lr(t) {
  ((ft.state = t), L1());
}
async function Tu(t = !ft.on) {
  if (tn && t) return;
  ft.on = !!t;
  const e = tt("#b-radio");
  if (
    (e.classList.toggle("on", ft.on),
    e.setAttribute("aria-pressed", ft.on),
    (He.hidden = Mu.hidden = !ft.on),
    !ft.on)
  ) {
    try {
      ft.yt?.pauseVideo?.();
    } catch {}
    ((ft.state = "off"), u2(), Ot("Radio off"));
    return;
  }
  const n = Ln[ft.i];
  if (
    (sa(),
    lr(ft.yt ? "on" : "wait"),
    sr(),
    Ot(`Radio: \u201C${n.title}\u201D by ${n.by}, via YouTube`),
    ft.yt)
  ) {
    try {
      ft.yt.playVideo();
    } catch {}
    return;
  }
  try {
    const o = await Zh();
    if (ft.yt) return;
    (sa(),
      (ft.yt = new o.Player("radio-yt", {
        width: 200,
        height: 200,
        videoId: n.id,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (a) => {
            ((ft.ready = !0),
              sa(),
              a.target.setVolume(70),
              ft.on ? a.target.playVideo() : a.target.pauseVideo());
          },
          onStateChange: (a) => {
            (sa(),
              (a.data === 1 || a.data === 2) &&
                ((ft.playing = a.data === 1), Jh()),
              a.data === 1 ? ((ft.fail = 0), lr("on")) : a.data === 0 && rr());
          },
          onError: (a) => {
            ((ft.err = a.data), ++ft.fail < Ln.length ? rr() : lr("down"));
          },
        },
      })));
  } catch {
    ((ft.api = null), lr("down"));
  }
}
function rr() {
  if (
    (++ft.p >= ft.order.length && ((ft.order = E1(ft.i)), (ft.p = 0)),
    (ft.i = ft.order[ft.p]),
    sa(3),
    L1(),
    ft.yt && ft.on)
  )
    try {
      ft.yt.loadVideoById(Ln[ft.i].id);
    } catch {}
}
if (tn) {
  const t = (a) => tt("#" + a),
    e = ["day", "dusk", "night"];
  ((t("xb-seat").onclick = () => {
    ((Vo = !0),
      z.mode === "cockpit"
        ? Ko()
        : (Ae("cockpit"),
          Ot(
            "The driver's seat \xB7 drag to look round \xB7 \u21E7V to step out",
          )),
      $o());
  }),
    (t("xb-turbo").onclick = () => {
      ((Vo = !0), Fa(), $o());
    }),
    (t("xb-sky").onclick = () => {
      const a = e[(e.indexOf(wt.name) + 1) % 3];
      (Sa(a), Ot(a[0].toUpperCase() + a.slice(1)), $o());
    }),
    (t("xb-anime").onclick = () => {
      Vo = !0;
      const a = Qa.indexOf(be.style);
      (Ds(Qa[(a + 1) % Qa.length]), $o());
    }),
    (t("xb-sound").onclick = () => {
      (Pu(), $o());
    }));
  const n = t("xb-open"),
    o = () => {
      try {
        const a = new URL(Yi());
        (a.searchParams.delete("embed"), (n.href = a.toString()));
      } catch {}
    };
  for (const a of ["pointerenter", "focus", "pointerdown", "click"])
    n.addEventListener(a, o);
}
let P1 = -9;
function $o() {
  if (!tn) return;
  P1 = Nt;
  const t = (n, o) => {
    const a = tt("#" + n);
    (a.classList.toggle("on", o), a.setAttribute("aria-pressed", o));
  };
  (t("xb-seat", z.mode === "cockpit"),
    t("xb-turbo", Bt.on),
    t("xb-sound", !!Oe));
  const e = wt.name;
  ((tt("#xb-sky").textContent = e[0].toUpperCase() + e.slice(1)),
    t("xb-anime", be.style !== "off"),
    (tt("#xb-anime").textContent = {
      off: "Anime",
      "90s": "90s",
      modern: "Modern",
    }[be.style]));
}
((tt("#b-radio").onclick = () => Tu()),
  (tt("#rd-off").onclick = () => Tu(!1)),
  (tt("#rd-next").onclick = () => {
    rr();
    const t = Ln[ft.i];
    Ot(`\u201C${t.title}\u201D by ${t.by}`);
  }),
  addEventListener("resize", sr),
  addEventListener("resize", () => ar()),
  (tt("#rd-play").onclick = () => {
    const t = ft.yt;
    if (!(!t || !ft.ready))
      try {
        ft.playing ? t.pauseVideo() : t.playVideo();
      } catch {}
  }),
  (tt("#rd-holo").onclick = () => vu(!1)),
  (tt("#holo-min").onclick = () => vu(!0)));
const yt = {
    min: (() => {
      try {
        return localStorage.getItem("gigacity-holo") === "min";
      } catch {
        return !1;
      }
    })(),
    k: 0,
    f: 0,
    at: 0,
    h: 0,
    q: [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    p: [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
    size: [200, 200],
    slot: null,
    slotAt: -9,
    ui: [],
    uiAt: -9,
    css: "",
  },
  t2 = (() => {
    const e = Math.round(604.3278688524591),
      n = document.createElement("canvas");
    ((n.width = 1024), (n.height = e));
    const o = n.getContext("2d"),
      a = Math.round((1024 * 0.06) / (16 / 9 + 0.12)),
      s = Math.round((e * 0.06) / 1.12),
      l = 1024 - 2 * a,
      r = e - 2 * s,
      u = Math.round(a * 0.5),
      i = Math.round(e * 0.1);
    for (let m = s + 2; m < e - s; m += 4)
      ((o.fillStyle = "rgba(110,220,255,.10)"), o.fillRect(a, m, l, 1.3));
    (o.save(),
      (o.shadowColor = "rgba(110,225,255,.7)"),
      (o.shadowBlur = 16),
      (o.strokeStyle = "rgba(110,225,255,.14)"),
      (o.lineWidth = 4),
      o.strokeRect(a, s, l, r),
      o.restore(),
      (o.strokeStyle = "rgba(205,248,255,.95)"),
      (o.lineWidth = 1.7),
      o.strokeRect(a + 0.5, s + 0.5, l - 1, r - 1),
      o.save(),
      (o.lineWidth = 3.4),
      (o.strokeStyle = "rgba(228,252,255,1)"),
      (o.shadowColor = "rgba(140,235,255,.95)"),
      (o.shadowBlur = 12));
    for (const [m, d, h, y] of [
      [a - u, s - u, 1, 1],
      [1024 - a + u, s - u, -1, 1],
      [1024 - a + u, e - s + u, -1, -1],
      [a - u, e - s + u, 1, -1],
    ])
      (o.beginPath(),
        o.moveTo(m + h * i, d),
        o.lineTo(m, d),
        o.lineTo(m, d + y * i),
        o.stroke());
    ((o.shadowBlur = 20),
      (o.lineWidth = 2.4),
      o.beginPath(),
      o.moveTo(1024 * 0.38, e - s + u * 1.5),
      o.lineTo(1024 * 0.62, e - s + u * 1.5),
      o.stroke(),
      o.restore());
    const c = new f.CanvasTexture(n);
    return (
      (c.colorSpace = f.SRGBColorSpace),
      (c.generateMipmaps = !0),
      (c.minFilter = f.LinearMipmapLinearFilter),
      (c.anisotropy = 8),
      c
    );
  })(),
  I1 = W(0),
  B1 = W(0),
  ho = new f.Group();
((ho.visible = !1), Fl.add(ho));
const F1 = (t) => {
    const e = new f.MeshBasicNodeMaterial({
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: f.AdditiveBlending,
      side: f.DoubleSide,
    });
    return ((e.colorNode = At(t)()), (e.fog = !1), e);
  },
  N1 = (() => {
    const t = Ve(t2),
      e = new f.Mesh(
        new f.PlaneGeometry(1, 1),
        F1(() => {
          const n = t.sample(re()).rgb;
          return nt(n.mul(n).mul(1.25).mul(I1).mul(p.uBlue.oneMinus()), 1);
        }),
      );
    return ((e.frustumCulled = !1), (e.matrixAutoUpdate = !1), ho.add(e), e);
  })(),
  e2 = (() => {
    const t = new f.BufferGeometry();
    (t.setAttribute(
      "position",
      new f.Float32BufferAttribute(new Float32Array(12), 3),
    ),
      t.setAttribute(
        "uv",
        new f.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2),
      ),
      t.setIndex([0, 1, 2, 0, 2, 3]));
    const e = new f.Mesh(
      t,
      F1(() => {
        const n = re(),
          o = Ft(Z(n.y.oneMinus(), 0), 1.6).mul(
            Ft(Z(ae(n.x.mul(Math.PI)), 0), 0.7),
          );
        return nt(w(0.25, 0.75, 1).mul(o).mul(B1).mul(p.uBlue.oneMinus()), 1);
      }),
    );
    return ((e.frustumCulled = !1), ho.add(e), e);
  })(),
  Ha = new f.Vector3(-0.11, 0.955, kn.z),
  m5 = new f.Vector3(...yn),
  R1 = new f.Vector3(),
  Oa = new f.Vector3(),
  Wa = new f.Vector3(),
  D1 = new f.Vector3(),
  f5 = new f.Vector3(0, 1, 0),
  qa = new f.Vector3(),
  _1 = new f.Vector3(),
  n2 = new f.Vector3(),
  G1 = new f.Matrix4(),
  H1 = new f.Matrix4();
let Ka = 1,
  Ua = 1;
function o2() {
  return (222 * (Ha.z - yn[2])) / (Ua / 2 / Math.tan((et.fov * Math.PI) / 360));
}
(R1.set(0, 0, -1), Oa.set(-1, 0, 0), Wa.set(0, 1, 0));
function a2(t) {
  D1.copy(Ha).addScaledVector(Wa, t * 0.56);
}
function s2(t, e) {
  return (
    pe.localToWorld(qa.copy(t)).applyMatrix4(et.matrixWorldInverse),
    qa.z > -et.near
      ? !1
      : (qa.applyMatrix4(G1),
        (e[0] = (qa.x * 0.5 + 0.5) * Ka),
        (e[1] = (-qa.y * 0.5 + 0.5) * Ua),
        !0)
  );
}
function l2() {
  if (Nt - yt.uiAt < 0.3) return yt.ui;
  yt.uiAt = Nt;
  const t = [];
  if (!Xs.classList.contains("ui-off"))
    for (const a of [".side", ".ctl", "#keys"]) {
      const s = tt(a),
        l = s && getComputedStyle(s);
      if (
        !s ||
        l.display === "none" ||
        l.visibility === "hidden" ||
        +l.opacity == 0
      )
        continue;
      const r = s.getBoundingClientRect();
      r.width && r.height && t.push(r);
    }
  const e = getComputedStyle(document.documentElement),
    n = parseFloat(e.getPropertyValue("--sael-corner-w")) || 0,
    o = parseFloat(e.getPropertyValue("--sael-corner-h")) || 0;
  return (
    n && o && t.push({ left: Ka - n, right: Ka, top: Ua - o, bottom: Ua }),
    (yt.ui = t),
    t
  );
}
function r2(t, e) {
  const o = e ? 212 : 200,
    a = (d, h) => Math.hypot(d[0] - h[0], d[1] - h[1]);
  yt.why = "view";
  for (const d of t)
    if (!(d[0] > 8 && d[0] < Ka - 8 && d[1] > 8 && d[1] < Ua - 8)) return !1;
  if (
    ((yt.why = "size"),
    Math.min(a(t[0], t[3]), a(t[1], t[2])) < o ||
      Math.min(a(t[0], t[1]), a(t[3], t[2])) < o)
  )
    return !1;
  yt.why = "ui";
  const s = 10,
    l = t.map((d) => d[0]),
    r = t.map((d) => d[1]),
    u = Math.min(...l) - s,
    i = Math.max(...l) + s,
    c = Math.min(...r) - s,
    m = Math.max(...r) + s;
  for (const d of l2())
    if (u < d.right && i > d.left && c < d.bottom && m > d.top) return !1;
  return !0;
}
function i2(t, e, n) {
  const [o, a] = n[0],
    [s, l] = n[1],
    [r, u] = n[2],
    [i, c] = n[3],
    m = s - r,
    d = i - r,
    h = l - u,
    y = c - u,
    x = o - s + r - i,
    b = a - l + u - c,
    V = m * y - d * h || 1e-9,
    T = (x * y - d * b) / V,
    A = (m * b - x * h) / V,
    g = s - o + T * s,
    M = i - o + A * i,
    L = l - a + T * l,
    C = c - a + A * c,
    E = (R) => +R.toFixed(6);
  return `matrix3d(${E(g / t)},${E(L / t)},0,${E(T / t)},${E(M / e)},${E(C / e)},0,${E(A / e)},0,0,1,0,${E(o)},${E(a)},0,1)`;
}
function O1(t, e) {
  if (!(yt.size[0] === t && yt.size[1] === e)) {
    yt.size = [t, e];
    try {
      ft.yt.setSize(t, e);
    } catch {}
  }
}
function vu(t) {
  yt.min = t === void 0 ? !yt.min : !!t;
  try {
    localStorage.setItem("gigacity-holo", yt.min ? "min" : "up");
  } catch {}
  Ot(
    yt.min
      ? "The video down on the radio's card \xB7 the dash still shows the track \xB7 \u21E7Y to put it back"
      : "The video back up on the hologram",
  );
}
function u2() {
  ((yt.f = 0),
    He.classList.remove("holo"),
    (tt("#holo-min").hidden = !0),
    (yt.css = ""),
    (Mu.style.transform = ""),
    (yt.slotAt = -9));
}
function c2() {
  const t = performance.now() / 1e3,
    e = Math.min(0.1, Math.max(0, t - yt.at));
  yt.at = t;
  const n =
    ft.on &&
    ft.ready &&
    ft.state !== "down" &&
    !tn &&
    !mr &&
    !yt.off &&
    !yt.min;
  let o = !1;
  if (n && Ze() && pe.visible) {
    ((Ka = fn.clientWidth || innerWidth),
      (Ua = fn.clientHeight || innerHeight),
      pe.updateMatrixWorld());
    const s = et.near * Math.tan((et.fov * Math.PI) / 360),
      l = s * et.aspect;
    G1.makePerspective(-l, l, s, -s, et.near, et.far, et.coordinateSystem);
    const r = o2();
    if (r > 0 && r < 1.2) {
      (a2(r), (yt.h = r));
      const u = (r * 16) / 9,
        i = yt.p,
        c = [
          [-1, 1],
          [1, 1],
          [1, -1],
          [-1, -1],
        ].every(([m, d], h) =>
          s2(
            _1
              .copy(D1)
              .addScaledVector(Oa, (m * u) / 2)
              .addScaledVector(Wa, (d * r) / 2),
            i[h],
          ),
        );
      if (c && r2(i, yt.f <= 0)) {
        ((o = !0), (yt.why = ""));
        for (let m = 0; m < 4; m++)
          ((yt.q[m][0] = i[m][0]), (yt.q[m][1] = i[m][1]));
      } else
        c &&
          yt.why === "ui" &&
          Zt.auto &&
          !Zt.over &&
          !Zt.on &&
          (Xo(!0), (yt.uiAt = -9));
    }
  }
  const a = yt.k;
  (o
    ? ((yt.k = Math.min(1, yt.k + e / 0.55)),
      yt.k > 0.55 && (yt.f = Math.min(1, yt.f + e / 0.5)))
    : ((yt.f = Math.max(0, yt.f - e / 0.4)),
      yt.f < 0.35 && (yt.k = Math.max(0, yt.k - e / 0.45))),
    !a && yt.k && sa(2),
    d2(),
    m2());
}
function d2() {
  const t = yt.k > 0 && yt.h > 0 && Ze() && pe.visible;
  if (((ho.visible = t), !t)) {
    ru.value = 1;
    return;
  }
  const e = yt.h,
    n = (e * 16) / 9,
    o = e * 0.06,
    a = n + 2 * o,
    s = e + 2 * o,
    l = yt.k,
    r = l < 1 ? 1 - Math.pow(1 - l, 3) : 1;
  (H1.makeBasis(Oa, Wa, R1)
    .scale(n2.set(a, Math.max(0.002, s * r), 1))
    .setPosition(_1.copy(Ha).addScaledVector(Wa, (s * r) / 2)),
    N1.matrix.copy(H1),
    (N1.matrixWorldNeedsUpdate = !0),
    (I1.value =
      l < 1
        ? l * (0.65 + 0.35 * Math.random())
        : 0.9 + 0.06 * Math.sin(Dt * 2.1)),
    (ru.value = 1 - l),
    (B1.value = 0));
  const u = e2.geometry.attributes.position,
    i = qa.copy(Ha).addScaledVector(Wa, -0.025),
    c = (m, d, h) => {
      u.setXYZ(m, d.x + Oa.x * h, d.y + Oa.y * h, d.z + Oa.z * h);
    };
  (c(0, i, -0.03),
    c(1, i, 0.03),
    c(2, Ha, a / 2),
    c(3, Ha, -a / 2),
    (u.needsUpdate = !0));
}
function m2() {
  if (!ft.on || !ft.yt) return;
  const t = yt.f;
  let e;
  t < 1 &&
    He.classList.contains("holo") &&
    (He.classList.remove("holo"),
    sr(),
    (yt.slotAt = -9),
    requestAnimationFrame(ar));
  const n = yt.min && Ze() && !mr && !tn,
    o = tt("#rd-holo");
  (o.hidden === n && ((o.hidden = !n), ar()),
    (Nt - yt.slotAt > 0.25 || !yt.slot) &&
      ((yt.slotAt = Nt), (yt.slot = Qh.getBoundingClientRect())));
  const a = yt.slot;
  if (t <= 0)
    (O1(200, 200),
      (e = `translate(${a.left.toFixed(1)}px,${a.top.toFixed(1)}px)`));
  else {
    const r = yt.q,
      u = (b, V) => Math.hypot(b[0] - V[0], b[1] - V[1]),
      i = Math.round((u(r[0], r[1]) + u(r[3], r[2])) / 2),
      c = Math.round((u(r[0], r[3]) + u(r[1], r[2])) / 2);
    (Math.abs(i - yt.size[0]) > 4 || Math.abs(c - yt.size[1]) > 4) && O1(i, c);
    const [m, d] = yt.size,
      h = t < 1 ? t * t * (3 - 2 * t) : 1,
      y = (200 - 1800 / 16) / 2,
      x = [
        [a.left, a.top + y],
        [a.right, a.top + y],
        [a.right, a.bottom - y],
        [a.left, a.bottom - y],
      ];
    ((e = i2(
      m,
      d,
      r.map((b, V) => [
        x[V][0] + (b[0] - x[V][0]) * h,
        x[V][1] + (b[1] - x[V][1]) * h,
      ]),
    )),
      t >= 1 && !He.classList.contains("holo") && He.classList.add("holo"));
  }
  e !== yt.css && ((yt.css = e), (Mu.style.transform = e));
  const s = tt("#holo-min"),
    l = t >= 1 && yt.k >= 1;
  if ((s.hidden === l && (s.hidden = !l), l)) {
    const r = yt.q,
      u = r[1][0] + 8 + 28 <= Ka - 6 ? r[1][0] + 8 : r[0][0] - 36,
      i = `translate(${u.toFixed(0)}px,${r[1][1].toFixed(0)}px)`;
    s.style.transform !== i && (s.style.transform = i);
  }
}
((tt("#b-sound").onclick = () => Pu()),
  (tt("#b-turbo").onclick = () => Fa()),
  (tt("#b-hover").onclick = () => ks()),
  (tt("#b-pause").onclick = () => Su()),
  (tt("#b-pin").onclick = () => q1()),
  (tt("#how").onclick = () => tt("#info").showModal()),
  (tt("#close").onclick = () => tt("#info").close()),
  tt("#info").addEventListener("click", (t) => {
    t.target === t.currentTarget && t.currentTarget.close();
  }));
const Au = () => Yi();
{
  const t = tt("#share");
  t &&
    (t.onclick = async () => {
      const e = Au();
      try {
        navigator.share
          ? await navigator.share({ title: document.title, url: e })
          : (await navigator.clipboard.writeText(e),
            Ot("Link to this city copied"));
      } catch {}
    });
}
tt("#b-link").onclick = async () => {
  try {
    (await navigator.clipboard.writeText(Au()),
      Ot("Link to this spot copied: seed " + $e + ", this sky, this view"));
  } catch {
    Ot(Au());
  }
};
let Ya = 0,
  Yn = 0,
  jo = !1;
function Vu(t) {
  ((Yn = t === void 0 ? (Yn ? 0 : 1) : t ? 1 : 0),
    tt("#b-blue").classList.toggle("on", !!Yn),
    tt("#b-blue").setAttribute("aria-pressed", !!Yn),
    Ot(Yn ? "Blueprint: the generator's own grid" : "Blueprint off"));
}
function zu(t) {
  ((jo = t === void 0 ? !jo : !!t),
    tt("#b-lanes").classList.toggle("on", jo),
    tt("#b-lanes").setAttribute("aria-pressed", jo),
    Ot(jo ? "Sky lanes shown" : "Sky lanes hidden"));
}
function Su(t) {
  const e = t === void 0 ? !te.on : !!t;
  if (e === te.on) return;
  ((te.on = e), e ? (te.at = Nt) : (te.off += Nt - te.at));
  const n = tt("#b-pause");
  (n.classList.toggle("on", e),
    n.setAttribute("aria-pressed", e),
    (n.title = e ? "Play (Space)" : "Pause (Space)"),
    Tt.master &&
      Tt.master.gain.setTargetAtTime(
        e || !Oe ? 0 : 0.9,
        Tt.ctx.currentTime,
        0.12,
      ),
    Ot(
      e
        ? "Paused: the city holds still, the camera is still yours \xB7 Space to play"
        : "Playing",
    ));
}
function Xo(t) {
  if ((t || (Zt.last = Nt), t !== Zt.on)) {
    ((Zt.on = t), Xs.classList.toggle("compact", t));
    for (const e of [tt(".ctl"), tt(".side")])
      e.animate?.(
        [
          { opacity: 0, transform: "translateY(-4px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 280, easing: "ease-out" },
      );
  }
}
function W1() {
  const t = tt("#b-pin");
  (t.classList.toggle("on", !Zt.auto),
    t.setAttribute("aria-pressed", !Zt.auto));
}
function q1(t) {
  Zt.auto = t === void 0 ? !Zt.auto : !!t;
  try {
    localStorage.setItem("gigacity-compact", Zt.auto ? "1" : "0");
  } catch {}
  (W1(),
    Xo(!1),
    Ot(
      Zt.auto
        ? "The panel folds away when you leave it alone \xB7 \u21E7U keeps it open"
        : "The panel stays open \xB7 \u21E7U lets it fold away",
    ));
}
for (const t of [tt(".ctl"), tt(".side")])
  (t.addEventListener("pointerenter", () => {
    ((Zt.over = !0), Xo(!1));
  }),
    t.addEventListener("pointerleave", () => {
      ((Zt.over = !1), (Zt.last = Nt));
    }),
    t.addEventListener("pointerdown", () => {
      ((Zt.last = Nt), Xo(!1));
    }),
    t.addEventListener("focusin", () => {
      ((Zt.last = Nt), Xo(!1));
    }));
(W1(),
  addEventListener("keydown", (t) => {
    if (
      ((Vo = !0),
      (t.metaKey || t.ctrlKey) &&
        !t.altKey &&
        (t.code === "Quote" || t.key === "'"))
    ) {
      (t.preventDefault(), U1());
      return;
    }
    if (
      t.metaKey ||
      t.ctrlKey ||
      t.altKey ||
      /^(INPUT|SELECT|TEXTAREA)$/.test(t.target.tagName) ||
      tt("#info").open
    )
      return;
    if (!tt("#tune").hidden && g2(t)) {
      t.preventDefault();
      return;
    }
    const e = t.key.toLowerCase();
    if (
      (J1(),
      wu(),
      !(
        t.repeat &&
        ![
          "w",
          "a",
          "s",
          "d",
          "q",
          "e",
          "arrowleft",
          "arrowright",
          "arrowup",
          "arrowdown",
          "=",
          "+",
          "-",
          "_",
          "[",
          "]",
        ].includes(e)
      ))
    ) {
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "q",
          "e",
          "arrowleft",
          "arrowright",
          "arrowup",
          "arrowdown",
        ].includes(e)
      ) {
        if (t.target.id === "traf") return;
        (e.startsWith("arrow") && t.preventDefault(),
          z.mode !== "drone" &&
            (Ct &&
              jc.includes(e) &&
              ((Ct = null), (z.cut = !0), Ot("Back in your car")),
            z.mode === "director" && Ae("chase"),
            jc.includes(e) &&
              !Ut.told &&
              ((Ut.told = 1),
              Ot(
                "A D slide and lean \xB7 W S climb and dive \xB7 hold A or D before a crossing to turn \xB7 \u21E7 for speed",
              ))),
          Ht.add(e));
        return;
      }
      if (["=", "+", "-", "_", "shift"].includes(e)) {
        Ht.add(e === "+" ? "=" : e === "_" ? "-" : e);
        return;
      }
      if (e === "1" || e === "2" || e === "3") {
        const n = ["day", "dusk", "night"][+e - 1];
        (Sa(n), Ot(n[0].toUpperCase() + n.slice(1)));
      } else if (e === "[" || e === "]")
        (Ps(D.traffic + (e === "[" ? -0.1 : 0.1)),
          Ot("Traffic " + Math.round(D.traffic * 100) + " %"));
      else if (e === "c")
        z.mode === "director" ? Ko() : (Ae("director"), Ot("Director"));
      else if (e === "r") Ko();
      else if (e === "f")
        z.mode === "drone"
          ? Ko()
          : (Ae("drone"),
            Ot("Drone \xB7 W A S D to fly it \xB7 R to rejoin your car"));
      else if (e === "v")
        z.mode === "cockpit"
          ? Ko()
          : (Ae("cockpit"),
            Ot(
              "The driver's seat: it drives itself, A D W S still suggest \xB7 \u21E7V to step out",
            ));
      else if (e === "t") Fa();
      else if (e === "h") ks();
      else if (e === "o") Tu();
      else if (e === "y") ft.on && vu();
      else if (e === "u") q1();
      else if (e === "g") ir();
      else if (e === "m") Pu();
      else if (e === "b") Vu();
      else if (e === "l") zu();
      else if (e === "n") ((Ls = !Ls), Ot(Ls ? "Labels on" : "Labels off"));
      else if (e === "p") {
        const n = Cu.indexOf(Qo);
        Eu(Cu[(n + 1) % Cu.length]);
      } else if (e === "i") {
        const n = Qa.indexOf(be.style);
        Ds(Qa[(n + 1) % Qa.length]);
      } else
        e === " "
          ? (t.preventDefault(),
            document.activeElement?.tagName === "BUTTON" &&
              document.activeElement.blur(),
            Su())
          : e === "/" &&
            (t.preventDefault(),
            Xs.classList.toggle("ui-off"),
            Ot(
              Xs.classList.contains("ui-off")
                ? "Interface hidden \xB7 / to show"
                : "Interface shown",
            ));
    }
  }),
  addEventListener("keyup", (t) => {
    const e = t.key.toLowerCase();
    Ht.delete(e === "+" ? "=" : e === "_" ? "-" : e);
  }),
  addEventListener("blur", () => Ht.clear()));
const $n = [
  ["pixelRatio", "Pixel ratio", 1, 2, 0.05, (t) => t.toFixed(2)],
  ["exposure", "Exposure", 0.5, 2, 0.02, (t) => t.toFixed(2)],
  ["sat", "Saturation", 0.6, 1.6, 0.02, (t) => t.toFixed(2)],
  ["fog", "Fog", 0, 3, 0.05, (t) => t.toFixed(2)],
  ["lights", "Lamps", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["fov", "Field of view", 30, 90, 1, (t) => t + "\xB0"],
  [
    "ssgi",
    "Global illumination",
    0,
    3,
    1,
    (t) => ["off", "low", "medium", "high"][t],
  ],
  ["giK", "bounce", 0, 3, 0.05, (t) => t.toFixed(2), 1],
  ["aoK", "occlusion", 0, 2, 0.05, (t) => t.toFixed(2), 1],
  ["bloom", "Bloom", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["bloomK", "strength", 0, 0.6, 0.005, (t) => t.toFixed(3), 1],
  ["bloomRadius", "radius", 0.2, 2, 0.02, (t) => t.toFixed(2), 1],
  ["flare", "Lens flare", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["flareK", "strength", 0, 1.5, 0.05, (t) => t.toFixed(2), 1],
  ["shafts", "Sun shafts", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["gi", "Sky and bounce light", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["refl", "City reflections", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["nshadow", "Fine shadows", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["mblur", "Motion blur", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["ae", "Auto exposure", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["detail", "Facade detail", 0.3, 1.5, 0.05, (t) => t.toFixed(2) + "\xD7"],
  ["grain", "Grain", 0, 2, 0.1, (t) => t.toFixed(1)],
  ["auto", "Auto quality", 0, 1, 1, (t) => (t ? "on" : "off")],
];
let bn = 0;
function Is() {
  (po(), K1());
}
const ku = {
    fast: {
      pixelRatio: 1,
      ssgi: 0,
      shafts: 0,
      gi: 1,
      refl: 0,
      nshadow: 0,
      mblur: 0,
      detail: 0.8,
      mirror: 0,
      flare: 0,
    },
    high: {
      pixelRatio: Math.min(z0, 1.5),
      ssgi: 2,
      shafts: 1,
      gi: 1,
      refl: 1,
      nshadow: 0,
      mblur: 1,
      detail: 1,
      mirror: 1,
      flare: 1,
    },
    ultra: {
      pixelRatio: Q(devicePixelRatio, 1, 2),
      ssgi: 3,
      shafts: 1,
      gi: 1,
      refl: 1,
      nshadow: 1,
      mblur: 1,
      ae: 1,
      detail: 1.25,
      mirror: 1,
      flare: 1,
    },
  },
  Cu = ["auto", "fast", "high", "ultra"],
  f2 = {
    auto: "Graphics: auto, tuned to keep the frame smooth",
    fast: "Graphics: fast",
    high: "Graphics: high",
    ultra: "Graphics: ultra, every effect on",
  };
let Qo = "auto";
function K1() {
  const t = D.auto ? "auto" : Qo === "auto" ? "custom" : Qo;
  document
    .querySelectorAll("#seg-gfx button")
    .forEach((e) => e.classList.toggle("on", e.dataset.g === t));
}
function Eu(t, e) {
  if (!(t !== "auto" && !ku[t])) {
    if (((Qo = t), t === "auto")) {
      const n = { traffic: D.traffic, fov: D.fov };
      (Object.assign(D, ll, n, { auto: 1 }),
        (D._ceil = void 0),
        (D._good = 0),
        (D._probe = 0));
    } else Object.assign(D, ku[t], { auto: 0 });
    (po(), K1());
    try {
      localStorage.setItem("gigacity-gfx", t);
    } catch {}
    (e || Ot(f2[t]), tt("#tune").hidden || Pn());
  }
}
document
  .querySelectorAll("#seg-gfx button")
  .forEach((t) => (t.onclick = () => Eu(t.dataset.g)));
function Pn() {
  ((tt("#tune-rows").innerHTML = $n
    .map(([t, e, n, o, , a, s], l) => {
      const r = D[t],
        u = ((r - n) / (o - n)) * 100;
      return `<div class="tr${l === bn ? " sel" : ""}${s ? " sub" : ""}" data-i="${l}"><b>${e}</b><span class="tk"><i style="left:${Q(u, 0, 100)}%"></i></span><u>${a(r)}</u></div>`;
    })
    .join("")),
    tt("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((t) => {
        t.onclick = () => {
          ((bn = +t.dataset.i), Pn());
        };
        const e = t.querySelector(".tk");
        e.onpointerdown = (n) => {
          (n.stopPropagation(),
            (bn = +t.dataset.i),
            e.setPointerCapture(n.pointerId));
          const o = (a) => {
            const s = e.getBoundingClientRect(),
              [l, , r, u, i] = $n[bn],
              c = Q(
                Math.round(
                  (r + ((a.clientX - s.left) / s.width) * (u - r)) / i,
                ) * i,
                r,
                u,
              );
            (c !== D[l] &&
              ((D[l] = +c.toFixed(4)),
              l !== "auto" && (D.auto = 0),
              (Qo = "custom"),
              Is()),
              (e.querySelector("i").style.left =
                Q(((D[l] - r) / (u - r)) * 100, 0, 100) + "%"),
              (t.querySelector("u").textContent = $n[bn][5](D[l])),
              (tt("#tune-json").value = JSON.stringify(D)));
          };
          (o(n),
            (e.onpointermove = (a) => {
              e.hasPointerCapture(a.pointerId) && o(a);
            }),
            (e.onpointerup = () => Pn()));
        };
      }),
    (tt("#tune-json").value = JSON.stringify(D)));
}
function h2(t, e) {
  const [n, , o, a, s] = $n[bn],
    l = Q(+(D[n] + t * s * (e ? 5 : 1)).toFixed(4), o, a);
  l !== D[n] &&
    ((D[n] = l), n !== "auto" && (D.auto = 0), (Qo = "custom"), Is(), Pn());
}
function U1(t) {
  const e = tt("#tune"),
    n = t === void 0 ? e.hidden : t;
  ((e.hidden = !n), n && Pn());
}
function g2(t) {
  const e = t.key;
  if (e === "ArrowUp" || e === "ArrowDown")
    return (
      (bn = (bn + (e === "ArrowUp" ? -1 : 1) + $n.length) % $n.length),
      Pn(),
      tt("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (e === "ArrowLeft" || e === "ArrowRight")
    return (h2(e === "ArrowLeft" ? -1 : 1, t.shiftKey), !0);
  if (e === "Enter" || e === " ") {
    const [n, , o, a, s] = $n[bn];
    return a - o === s
      ? ((D[n] = D[n] ? 0 : 1),
        n !== "auto" && (D.auto = 0),
        (Qo = "custom"),
        Is(),
        Pn(),
        !0)
      : !1;
  }
  return e === "0" || e === ")"
    ? (t.shiftKey ? Object.assign(D, ll) : (D[$n[bn][0]] = ll[$n[bn][0]]),
      (D.auto = 0),
      Is(),
      Pn(),
      !0)
    : e === "c" || e === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(D, null, 1)), !0)
      : e === "Escape"
        ? (U1(!1), !0)
        : !1;
}
(tt("#tune-json").addEventListener("change", (t) => {
  try {
    const e = JSON.parse(t.target.value);
    for (const n in ll)
      typeof e[n] == "number" && isFinite(e[n]) && (D[n] = e[n]);
    ((D.pixelRatio = Q(D.pixelRatio, 1, 2)),
      (D.ssgi = Q(Math.round(D.ssgi), 0, 3)),
      (D.auto = 0),
      Is(),
      Pn());
  } catch {
    Pn();
  }
}),
  setInterval(() => {
    tt("#tune").hidden ||
      (tt("#tune-fps").textContent = Math.round(hu) + " fps");
  }, 500));
const Y1 = { t0: -99 };
function ir(t) {
  $e = t ?? 1e3 + Math.floor(Math.random() * 98999);
  for (const s of [...Hn]) Mi(s);
  (zo.clear(),
    _i.clear(),
    (me.ci = 1e9),
    (Yt = null),
    (p.uPick.value = -1),
    (Ct = null),
    (p.uGrowOn.value = 1),
    (p.uGrowT.value = p.uGrowTP.value = 0),
    (Y1.t0 = Nt),
    p.uGrowO.value.set(et.position.x, et.position.z));
  const e = v.route,
    n = Math.max(
      0,
      e.findIndex((s) => v.s < s.s0 + s.len),
    ),
    o = e[n],
    a = v.alt.find((s) => s[0] > v.s);
  for (
    e.length = n + 1,
      v.end = { ...o.end },
      v.alt = v.alt.filter((s) => s[0] <= Math.max(o.end.s, a ? a[0] : 0));
    Ll() < 2200;
  )
    zs();
  ((tt("#seed-v").textContent = $e),
    Kc(!0),
    Ot("Seed " + $e + ": a new city"),
    Jo("grow"));
}
function p2() {
  p.uGrowOn.value &&
    ((p.uGrowTP.value = p.uGrowT.value),
    (p.uGrowT.value = Nt - Y1.t0),
    (za = ws = !0),
    p.uGrowT.value > al * 0.0011 + 2.5 &&
      ((p.uGrowOn.value = 0), (za = ws = !0)));
}
const $1 = 900,
  Ee = new Float32Array($1 * 12),
  Zo = new f.InstancedInterleavedBuffer(Ee, 12);
Zo.setUsage(f.DynamicDrawUsage);
const jn = new f.InstancedBufferGeometry();
{
  const t = new f.PlaneGeometry(1, 1);
  ((jn.index = t.index), jn.setAttribute("position", t.attributes.position));
}
(jn.setAttribute("iA", new f.InterleavedBufferAttribute(Zo, 4, 0)),
  jn.setAttribute("iB", new f.InterleavedBufferAttribute(Zo, 4, 4)),
  jn.setAttribute("iC", new f.InterleavedBufferAttribute(Zo, 4, 8)),
  (jn.instanceCount = 0),
  (jn.boundingSphere = new f.Sphere(new f.Vector3(), 1e5)));
const j1 = Et("iA", "vec4"),
  X1 = Et("iB", "vec4"),
  y2 = Et("iC", "vec4"),
  Q1 = (() => {
    const t = X1.xyz,
      e = ce.x.add(0.5).mul(j1.w),
      n = j1.xyz.add(t.mul(e)),
      o = vt(Ao(t, vt(de.sub(n)))),
      a = Z(0.35, oe(de.sub(n)).mul(0.0035)),
      s = n.add(o.mul(ce.y).mul(2).mul(a));
    return {
      position: s,
      AB: kt(X(e, ce.y.mul(2))),
      C: kt(y2),
      Sp: kt(X1.w),
      WP: kt(s),
    };
  })(),
  x2 = li(
    Q1.position,
    At(() => {
      const { AB: t, C: e, Sp: n, WP: o } = Q1;
      F(ai(kr).lessThan(si(o).sub(2)), () => {
        ns();
      });
      const a = at(t.y),
        s = rt(t.x.sub(n.mul(p.uTime)).div(9)),
        l = at(s.sub(0.5).add(a.mul(0.32))),
        r = _(0.05, 0.09, l).oneMinus().mul(pt(a, 0.95)),
        u = _(0.08, 0.2, a).oneMinus(),
        i = oe(o.sub(de)).toVar(),
        c = _(650, 250, i).mul(_(22, 80, i)),
        m = Kt(ds(de, vt(o.sub(de)), i).mul(-0.6));
      return nt(
        e.rgb
          .mul(r.mul(1.4).add(u.mul(0.5)))
          .mul(c)
          .mul(m)
          .mul(p.uLaneK),
        1,
      );
    })(),
  ),
  ur = new f.Mesh(jn, x2);
((ur.frustumCulled = !1), Gr.add(ur));
let cr = 0;
function b2(t) {
  if (
    ((cr += ((jo ? 1 : 0) - cr) * (1 - Math.exp(-t * 4))),
    (p.uLaneK.value = cr),
    (ur.visible = cr > 0.01),
    !ur.visible)
  )
    return;
  const e = et.position,
    n = 620;
  let o = 0;
  for (let a = 0; a < 2; a++) {
    const s = a ? e.z : e.x,
      l = Math.floor((s - n) / It),
      r = Math.ceil((s + n) / It);
    for (let u = l; u <= r; u++)
      for (const i of Gi(a, u)) {
        if (o >= $1) break;
        if (Math.abs(i.y - e.y) > 230) continue;
        const c = u * It + i.off,
          m = a ? e.x : e.z,
          d = o * 12,
          h = i.dir;
        (a === 0
          ? ((Ee[d] = c),
            (Ee[d + 2] = m - n * h),
            (Ee[d + 4] = 0),
            (Ee[d + 6] = h))
          : ((Ee[d] = m - n * h),
            (Ee[d + 2] = c),
            (Ee[d + 4] = h),
            (Ee[d + 6] = 0)),
          (Ee[d + 1] = i.y + 0.5),
          (Ee[d + 3] = 2 * n),
          (Ee[d + 5] = 0),
          (Ee[d + 7] = i.v));
        const y = a ? [1, 0.62, 0.2] : [0.3, 0.85, 1];
        ((Ee[d + 8] = y[0]),
          (Ee[d + 9] = y[1]),
          (Ee[d + 10] = y[2]),
          (Ee[d + 11] = 1),
          o++);
      }
  }
  ((jn.instanceCount = o),
    Zo.clearUpdateRanges(),
    Zo.addUpdateRange(0, o * 12),
    (Zo.needsUpdate = !0));
}
const Tt = {
  ctx: null,
  on: !1,
  master: null,
  eng: null,
  engG: null,
  whine: null,
  wind: null,
  windF: null,
  last: 0,
};
let Oe = !1;
try {
  Oe = localStorage.getItem("gigacity-sound") === "1";
} catch {}
function Lu(t, e, n) {
  const o = t.sampleRate * e,
    a = t.createBuffer(1, o, t.sampleRate),
    s = a.getChannelData(0);
  let l = 0;
  for (let r = 0; r < o; r++) {
    const u = Math.random() * 2 - 1;
    n ? ((l = (l + 0.02 * u) / 1.02), (s[r] = l * 3.5)) : (s[r] = u);
  }
  return a;
}
function Z1() {
  if (Tt.ctx) return;
  const t = new (window.AudioContext || window.webkitAudioContext)();
  Tt.ctx = t;
  const e = t.createGain();
  ((e.gain.value = 0), e.connect(t.destination), (Tt.master = e));
  const n = t.createDynamicsCompressor();
  (n.connect(e), (Tt.bus = n));
  const o = t.createBufferSource();
  ((o.buffer = Lu(t, 4, !0)), (o.loop = !0));
  const a = t.createBiquadFilter();
  ((a.type = "lowpass"), (a.frequency.value = 140));
  const s = t.createGain();
  ((s.gain.value = 0.5), o.connect(a).connect(s).connect(n), o.start());
  const l = t.createBufferSource();
  ((l.buffer = Lu(t, 4, !1)), (l.loop = !0));
  const r = t.createBiquadFilter();
  ((r.type = "bandpass"), (r.Q.value = 0.7), (r.frequency.value = 600));
  const u = t.createGain();
  ((u.gain.value = 0.05),
    l.connect(r).connect(u).connect(n),
    l.start(),
    (Tt.windF = r),
    (Tt.windG = u));
  const i = t.createGain();
  i.gain.value = 0;
  const c = t.createBiquadFilter();
  ((c.type = "lowpass"),
    (c.frequency.value = 420),
    i.connect(c).connect(n),
    (Tt.engG = i),
    (Tt.engF = c),
    (Tt.eng = [t.createOscillator(), t.createOscillator()]),
    (Tt.eng[0].type = "sawtooth"),
    (Tt.eng[1].type = "sawtooth"),
    (Tt.eng[1].detune.value = 11));
  for (const h of Tt.eng) ((h.frequency.value = 58), h.connect(i), h.start());
  const m = t.createOscillator();
  ((m.type = "sine"), (m.frequency.value = 900));
  const d = t.createGain();
  ((d.gain.value = 0.012),
    m.connect(d).connect(n),
    m.start(),
    (Tt.whine = m),
    (Tt.whineG = d),
    (Tt.noise = Lu(t, 1.5, !1)));
}
function Pu(t) {
  Oe = t === void 0 ? !Oe : !!t;
  try {
    localStorage.setItem("gigacity-sound", Oe ? "1" : "0");
  } catch {}
  (Oe && (Z1(), Tt.ctx.resume()),
    Tt.master &&
      Tt.master.gain.setTargetAtTime(
        Oe && !te.on ? 0.9 : 0,
        Tt.ctx.currentTime,
        0.25,
      ),
    tt("#b-sound").classList.toggle("on", Oe),
    tt("#b-sound").setAttribute("aria-pressed", Oe),
    Ot(Oe ? "Sound on" : "Sound off"));
}
function J1() {
  Oe &&
    !Tt.ctx &&
    (Z1(),
    Tt.ctx.resume(),
    Tt.master.gain.setTargetAtTime(te.on ? 0 : 0.9, Tt.ctx.currentTime, 0.4));
}
function Jo(t, e) {
  if (!Tt.ctx || !Oe) return;
  const n = Tt.ctx,
    o = n.currentTime;
  if (t === "lock") {
    const a = n.createOscillator(),
      s = n.createGain();
    (a.frequency.setValueAtTime(660, o),
      a.frequency.exponentialRampToValueAtTime(1320, o + 0.12),
      s.gain.setValueAtTime(0.06, o),
      s.gain.exponentialRampToValueAtTime(1e-4, o + 0.3),
      a.connect(s).connect(Tt.bus),
      a.start(o),
      a.stop(o + 0.32));
  }
  if (t === "grow") {
    const a = n.createBufferSource();
    a.buffer = Tt.noise;
    const s = n.createBiquadFilter();
    ((s.type = "lowpass"),
      s.frequency.setValueAtTime(80, o),
      s.frequency.exponentialRampToValueAtTime(900, o + 3.5));
    const l = n.createGain();
    (l.gain.setValueAtTime(1e-4, o),
      l.gain.exponentialRampToValueAtTime(0.5, o + 1.2),
      l.gain.exponentialRampToValueAtTime(1e-4, o + 4.5),
      (a.loop = !0),
      a.connect(s).connect(l).connect(Tt.bus),
      a.start(o),
      a.stop(o + 4.6));
  }
  if (t === "turbo") {
    const a = n.createOscillator(),
      s = n.createBiquadFilter(),
      l = n.createGain();
    ((a.type = "sawtooth"),
      a.frequency.setValueAtTime(90, o),
      a.frequency.exponentialRampToValueAtTime(1400, o + 0.7),
      (s.type = "bandpass"),
      (s.Q.value = 6),
      s.frequency.setValueAtTime(300, o),
      s.frequency.exponentialRampToValueAtTime(3800, o + 0.7),
      l.gain.setValueAtTime(1e-4, o),
      l.gain.exponentialRampToValueAtTime(0.12, o + 0.5),
      l.gain.exponentialRampToValueAtTime(1e-4, o + 1.2),
      a.connect(s).connect(l).connect(Tt.bus),
      a.start(o),
      a.stop(o + 1.25));
    const r = n.createBufferSource();
    r.buffer = Tt.noise;
    const u = n.createBiquadFilter();
    ((u.type = "highpass"), (u.frequency.value = 2500));
    const i = n.createGain();
    (i.gain.setValueAtTime(1e-4, o + 0.45),
      i.gain.exponentialRampToValueAtTime(0.18, o + 0.6),
      i.gain.exponentialRampToValueAtTime(1e-4, o + 1.3),
      r.connect(u).connect(i).connect(Tt.bus),
      r.start(o + 0.4),
      r.stop(o + 1.4));
  }
  if (t === "door") {
    const a = e || 1.5,
      s = n.createBufferSource();
    ((s.buffer = Tt.noise), (s.loop = !0));
    const l = n.createBiquadFilter();
    ((l.type = "bandpass"),
      (l.Q.value = 1.1),
      l.frequency.setValueAtTime(2600, o),
      l.frequency.exponentialRampToValueAtTime(900, o + a));
    const r = n.createGain();
    (r.gain.setValueAtTime(1e-4, o),
      r.gain.exponentialRampToValueAtTime(0.09, o + 0.12),
      r.gain.exponentialRampToValueAtTime(0.03, o + a * 0.8),
      r.gain.exponentialRampToValueAtTime(1e-4, o + a + 0.05),
      s.connect(l).connect(r).connect(Tt.bus),
      s.start(o),
      s.stop(o + a + 0.1));
    const u = n.createOscillator(),
      i = n.createGain();
    ((u.type = "sine"),
      u.frequency.setValueAtTime(120, o + a - 0.03),
      u.frequency.exponentialRampToValueAtTime(52, o + a + 0.2),
      i.gain.setValueAtTime(1e-4, o + a - 0.04),
      i.gain.exponentialRampToValueAtTime(0.16, o + a),
      i.gain.exponentialRampToValueAtTime(1e-4, o + a + 0.3),
      u.connect(i).connect(Tt.bus),
      u.start(o + a - 0.05),
      u.stop(o + a + 0.32));
  }
  if (t === "whoosh") {
    const a = n.createBufferSource();
    a.buffer = Tt.noise;
    const s = n.createBiquadFilter();
    ((s.type = "bandpass"),
      (s.Q.value = 1.4),
      s.frequency.setValueAtTime(1500, o),
      s.frequency.exponentialRampToValueAtTime(320, o + 0.9));
    const l = n.createGain();
    (l.gain.setValueAtTime(1e-4, o),
      l.gain.exponentialRampToValueAtTime(0.32, o + 0.25),
      l.gain.exponentialRampToValueAtTime(1e-4, o + 1.1),
      a.connect(s).connect(l).connect(Tt.bus),
      a.start(o),
      a.stop(o + 1.2));
  }
}
const td = 343,
  Bs = [],
  ge = {
    p: new f.Vector3(),
    v: new f.Vector3(),
    prev: new f.Vector3(),
    ok: !1,
  },
  w2 = [92, 76, 50, 57, 96, 104, 40, 70, 118, 138],
  Fs = new f.Vector3(),
  M2 = new f.Vector3();
function T2() {
  const t = Tt.ctx;
  for (let e = 0; e < 4; e++) {
    const n = t.createOscillator(),
      o = t.createOscillator(),
      a = t.createBiquadFilter(),
      s = t.createGain(),
      l = t.createGain(),
      r = t.createStereoPanner();
    ((n.type = "sawtooth"),
      (o.type = "square"),
      (o.detune.value = -1191),
      (a.type = "lowpass"),
      (a.Q.value = 1.2),
      (a.frequency.value = 700),
      (s.gain.value = 0),
      (l.gain.value = 0.35),
      n.connect(a),
      o.connect(l).connect(a),
      a.connect(s).connect(r).connect(Tt.bus),
      n.start(),
      o.start(),
      Bs.push({ o1: n, o2: o, f: a, g: s, p: r, key: null }));
  }
}
function v2(t, e, n, o, a, s) {
  const l = ge.p.x - t,
    r = ge.p.y - e,
    u = ge.p.z - n,
    i = Math.hypot(l, r, u) || 1,
    c = l / i,
    m = r / i,
    d = u / i,
    h = o * c + a * m + s * d,
    y = ge.v.x * c + ge.v.y * m + ge.v.z * d;
  return { k: Q((td - y) / (td - h), 0.5, 2), d: i };
}
const ed = () =>
    !Ct &&
    (z.mode === "chase" ||
      z.mode === "cockpit" ||
      (z.mode === "director" && !cn[z.shot].fixed)),
  Iu = [];
function A2(t) {
  const e = Tt.ctx.currentTime;
  ((Iu.length = 0),
    ge.p.copy(et.position),
    ge.ok && t > 0
      ? Fs.subVectors(ge.p, ge.prev).divideScalar(t)
      : Fs.set(0, 0, 0),
    (Fs.length() > 150 || z.cut) && Fs.copy(ge.v),
    ge.v.lerp(Fs, ge.ok ? 1 - Math.exp(-t * 8) : 1),
    ge.prev.copy(ge.p),
    (ge.ok = !0));
  const n = M2.setFromMatrixColumn(et.matrixWorld, 0),
    o = [];
  for (const l of rn)
    if (
      l.d2 > 19600 ||
      (o.push({
        key: l.L.seed * 1e3 + l.k,
        x: l.x,
        y: l.y,
        z: l.z,
        yaw: l.yaw,
        v: l.v,
        type: l.type,
        s: (l.L.seed % 97) + l.k,
      }),
      o.length >= 4)
    )
      break;
  !ed() &&
    !Ct &&
    o.push({
      key: "you",
      x: v.pos.x,
      y: v.pos.y,
      z: v.pos.z,
      yaw: v.yaw,
      v: v.v,
      vy: v.vy,
      type: Ca,
      s: 0,
    });
  const a = (l) =>
    (l.x - ge.p.x) ** 2 + (l.y - ge.p.y) ** 2 + (l.z - ge.p.z) ** 2;
  (o.sort((l, r) => a(l) - a(r)), (o.length = Math.min(o.length, 4)));
  const s = new Set(o.map((l) => l.key));
  for (const l of Bs)
    l.key !== null &&
      !s.has(l.key) &&
      ((l.key = null), l.g.gain.setTargetAtTime(0, e, 0.04));
  for (const l of o) {
    let r = Bs.find((b) => b.key === l.key);
    const u = !r;
    if ((r || (r = Bs.find((b) => b.key === null)), !r)) continue;
    r.key = l.key;
    const i = Math.sin(l.yaw),
      c = Math.cos(l.yaw),
      { k: m, d } = v2(l.x, l.y, l.z, i * l.v, l.vy || 0, c * l.v),
      h =
        w2[l.type] *
        (1 + (((l.s * 37) % 17) - 8) * 0.008) *
        (1 + l.v / 400) *
        m,
      y = 0.2 * Math.min(1, (18 / (d + 6)) ** 2) * (l.key === "you" ? 1.5 : 1),
      x =
        Q(
          ((l.x - ge.p.x) * n.x + (l.y - ge.p.y) * n.y + (l.z - ge.p.z) * n.z) /
            Math.max(d, 1),
          -1,
          1,
        ) * 0.85;
    if (u) {
      const b = r.g.gain;
      (b.cancelScheduledValues(e),
        b.setValueAtTime(b.value, e),
        b.linearRampToValueAtTime(0, e + 0.03),
        r.o1.frequency.setValueAtTime(h, e + 0.03),
        r.o2.frequency.setValueAtTime(h, e + 0.03),
        b.setTargetAtTime(y, e + 0.03, 0.08));
    } else
      (r.o1.frequency.setTargetAtTime(h, e, 0.03),
        r.o2.frequency.setTargetAtTime(h, e, 0.03),
        r.g.gain.setTargetAtTime(y, e, 0.05));
    (r.f.frequency.setTargetAtTime(500 + 2600 / (1 + d / 18), e, 0.05),
      r.p.pan.setTargetAtTime(x, e, 0.05),
      Iu.push({ key: l.key, k: m, d, f: h, gain: y, pan: x }));
  }
}
const dr = new Map();
function V2(t) {
  if (!Tt.ctx || !Oe) return;
  const e = Tt.ctx.currentTime,
    n = Lt.v || 30;
  (Bs.length || T2(), A2(t));
  for (const o of Tt.eng) o.frequency.setTargetAtTime(40 + n * 0.9, e, 0.2);
  (Tt.engG.gain.setTargetAtTime(ed() || Ct ? 0.06 : 0, e, 0.3),
    Tt.whine.frequency.setTargetAtTime(500 + n * 16, e, 0.2),
    Tt.whineG.gain.setTargetAtTime(0.012 + 0.03 * Bt.k, e, 0.3),
    Tt.windF.frequency.setTargetAtTime(
      380 + n * 9 + Math.sin(Dt * 0.3) * 120,
      e,
      0.4,
    ),
    Tt.windG.gain.setTargetAtTime(0.04 + n * 0.0012, e, 0.4));
  for (const o of rn) {
    if (o.d2 > 676) continue;
    const a = o.L.seed * 1e3 + o.k;
    Dt - (dr.get(a) || -9) < 3 ||
      (dr.set(a, Dt), Dt - Tt.last > 0.18 && ((Tt.last = Dt), Jo("whoosh")));
  }
  dr.size > 400 && dr.clear();
}
let Dt = 0,
  Nt = 0,
  $a = 0,
  ta = 0,
  nd = 1,
  Bu = 1,
  mr = !1,
  od = !1,
  ad = !1,
  ja = !1;
const ea = Dn.getTextureNode("output"),
  sd = Dn.getTextureNode("diffuseColor"),
  na = Dn.getTextureNode("depth"),
  z2 = Dn.getTextureNode("velocity"),
  Ns = Dn.getTextureNode("normal"),
  S2 = Kd((t) => Lr(Ns.sample(t))),
  Le = Jd(ea, na, S2, et);
((Le.useScreenSpaceSampling.value = !1),
  (Le.radius.value = 7),
  (Le.thickness.value = 3),
  (Le.useLinearThickness.value = !0),
  (Le.expFactor.value = 2),
  (Le.aoIntensity.value = 1),
  (Le.giIntensity.value = 8));
let Fu = 1;
const k2 = Le.setSize.bind(Le);
Le.setSize = (t, e) =>
  k2(Math.max(1, Math.round(t * Fu)), Math.max(1, Math.round(e * Fu)));
const C2 = [null, [1, 12], [2, 8], [3, 16]],
  E2 = Er(Gr, et, { depthBuffer: !1 }),
  L2 = Er(Fl, qn, { depthBuffer: !1 }),
  ld = L2.getTextureNode("output"),
  rd = { uAoK: W(1) },
  Pt = {
    uAirK: W(1),
    uShaftK: W(1),
    uShaftOn: W(0),
    uGiK: W(1),
    uMB: W(0.5),
    uMBMax: W(0.05),
    uPx: W(new f.Vector2(1, 1)),
    uSkyM: W(new f.Matrix4()),
    uExpo: W(1),
    uBloomK: W(0.065),
    uBloomR: W(0.82),
    uBloomT: W(0.55),
    uSat: W(1.1),
    uGrain: W(1),
    uKey: W(-1.2),
    uAE: W(0.5),
  },
  We = {
    uW: W(1.6),
    uK: W(0),
    uNear: W(240),
    uFar: W(1400),
    uTone: W(0.12),
    uCol: W(new f.Color(0.004, 0.003, 0.012)),
    uCrease: W(0.75),
  },
  Ne = {
    uSat: W(1),
    uCA: W(1),
    uBloomM: W(1),
    uStarK: W(0),
    uStarT: W(2.2),
    uLeak: W(new f.Vector3()),
    uGrainK: W(1),
    uFlick: W(matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1),
  },
  id = { uHazeSky: p.uHazeSky },
  ud = (t, e) => Me.uCamWorld.mul(nt(Ud(t, e, Me.uInvProj), 1)).xyz,
  P2 = At(() => {
    const t = re(),
      e = na.sample(t).r.toVar(),
      n = ud(t, qt(e, 0.99999)).sub(Me.uCamPos).toVar(),
      o = vt(n).toVar(),
      a = qt(Y(e.greaterThanEqual(0.99999), k(1400), oe(n)), 1400).toVar(),
      s = rl(no.xy),
      l = k(0).toVar(),
      r = k(0).toVar();
    return (
      Pe(32, ({ i: u }) => {
        const i = k(u).add(s).div(32),
          c = i.mul(i),
          m = Me.uCamPos.add(o.mul(c.mul(a))).toVar(),
          d = Z(m.y, 0),
          h = p.uFogD0
            .mul(Kt(d.div(p.uFogH).negate()))
            .add(p.uFogBase.mul(Kt(d.div(p.uHazeH).negate())))
            .mul(c.mul(2).add(0.15))
            .toVar(),
          y = p.uShadowM.mul(nt(m, 1)),
          x = y.xyz.div(y.w).toVar(),
          b = k(1).toVar();
        (F(
          x.x
            .greaterThan(0)
            .and(x.x.lessThan(1))
            .and(x.y.greaterThan(0))
            .and(x.y.lessThan(1))
            .and(x.z.lessThan(1)),
          () => {
            b.assign(
              pt(x.z.sub(2e-4), p.uShadow.sample(X(x.x, x.y.oneMinus())).x),
            );
          },
        ),
          l.addAssign(h.mul(b)),
          r.addAssign(h));
      }),
      nt(w(l.div(Z(r, 1e-7))), 1)
    );
  }),
  I2 = (t) =>
    At(() => {
      const e = X(1).div(X(t.size())),
        n = re(),
        o = k(0).toVar();
      for (let a = -1; a <= 1; a++)
        for (let s = -1; s <= 1; s++)
          o.addAssign(t.sample(n.add(X(a, s).mul(e).mul(1.25))).r);
      return nt(w(o.div(9)), 1);
    })(),
  cd = (t, e) =>
    k(0.0795775 * (1 - e * e)).div(
      Ft(Z(t.mul(-2 * e).add(1 + e * e), 1e-4), 1.5),
    ),
  dd = At(([t]) => {
    const e = nt(0).toVar();
    return (
      F(t.y.greaterThanEqual(0.004).and(p.uCov.lessThanEqual(0.95)), () => {
        const n = p.uCloudH.sub(Me.uCamPos.y).div(t.y).toVar();
        F(n.lessThanEqual(7e4), () => {
          const o = Me.uCamPos.xz.add(t.xz.mul(n)).toVar(),
            a = Kr(o).toVar();
          F(a.greaterThanEqual(0.002), () => {
            a.assign(
              Q(
                a.add(
                  jt(o.mul(0.011)).sub(0.5).mul(a).mul(a.oneMinus()).mul(1.4),
                ),
                0,
                1,
              ),
            );
            const s = a.mul(5).toVar(),
              l = Kt(s.negate()).oneMinus().toVar(),
              r = vt(p.uSunDir.xz.add(1e-5)).toVar(),
              u = k(0).toVar();
            (Pe(3, ({ i: h }) => {
              u.addAssign(Kr(o.add(r.mul(k(h).add(1).mul(120)))));
            }),
              l.assign(B(l, _(p.uCloudE.x, p.uCloudE.y, l), p.uCloudE.z)));
            const i = Kt(u.mul(-1.2).sub(s.mul(0.3)))
                .mul(_(-0.06, 0.1, p.uSunDir.y))
                .toVar(),
              c = gt(t, p.uSunDir);
            i.assign(
              B(
                i,
                _(0.2, 0.26, i)
                  .mul(0.8)
                  .add(0.1)
                  .mul(_(-0.06, 0.1, p.uSunDir.y)),
                p.uCloudBand,
              ),
            );
            const m = p.uSunCol
              .mul(i)
              .mul(
                cd(c, 0.7)
                  .mul(12.566 * 0.38)
                  .add(0.62),
              )
              .mul(Kt(s.mul(-2)).oneMinus())
              .mul(0.75)
              .add(
                Lo(w(0, 1, 0))
                  .mul(0.75)
                  .add(p.uGroundCol.mul(0.3))
                  .mul(a.mul(-0.45).add(1)),
              )
              .add(p.uGlowSky.mul(2.2).mul(a))
              .toVar();
            m.addAssign(
              p.uSunCol
                .mul(i.mul(0.7).add(0.3))
                .mul(_(0.55, 0.08, a))
                .mul(cd(c, 0.55).mul(4).add(0.25))
                .mul(p.uCloudRim),
            );
            const d = Kt(n.div(-26e3));
            (m.assign(m.mul(d).add(Lo(t).mul(d.oneMinus()))),
              l.mulAssign(_(0.004, 0.05, t.y)),
              e.assign(nt(m.mul(l), l)));
          });
        });
      }),
      e
    );
  }),
  B2 = At(([t]) => {
    const e = Lo(t).toVar(),
      n = gt(t, p.uSunDir).toVar();
    return (
      F(t.y.greaterThan(-0.05), () => {
        const o = p.uSunCol
          .mul(_(0.99955, 0.9998, n))
          .mul(14)
          .mul(p.uNightK.oneMinus())
          .toVar();
        F(p.uNightK.greaterThan(0.5), () => {
          const s = Qd(Q(n, -1, 1))
              .div(0.0095)
              .toVar(),
            l = p.uNightK.sub(0.5).mul(2).toVar();
          (F(s.lessThan(1.1), () => {
            const u = vt(Ao(p.uSunDir, w(0.001, 1, 0))),
              i = Ao(u, p.uSunDir),
              c = X(gt(t, u), gt(t, i)).div(0.0095).toVar(),
              m = _(
                0.45,
                0.62,
                jt(c.mul(2.3).add(4))
                  .mul(0.7)
                  .add(jt(c.mul(5.1)).mul(0.3)),
              );
            o.addAssign(
              w(0.95, 0.96, 1)
                .mul(_(0.95, 1.02, s).oneMinus())
                .mul(m.mul(-0.35).add(1))
                .mul($s(Z(s.mul(s).mul(-0.6).add(1), 0)))
                .mul(3.2)
                .mul(l),
            );
          }),
            o.addAssign(
              w(0.5, 0.6, 0.85)
                .mul(0.05)
                .mul(Kt(s.mul(-0.3)))
                .mul(l),
            ));
          const r = ie(Jt(t.xz.div(t.y.add(0.3)).mul(260)));
          o.addAssign(
            w(0.9, 0.95, 1)
              .mul(pt(0.9965, r))
              .mul(p.uNightK.sub(0.5))
              .mul(1.6)
              .mul(_(0.1, 0.4, t.y)),
          );
        });
        const a = dd(t).toVar();
        e.assign(e.mul(a.a.oneMinus()).add(a.rgb).add(o.mul(a.a.oneMinus())));
      }),
      e
    );
  }),
  F2 = (t, e) =>
    At(() => {
      const n = re(),
        o = na.sample(n).r.toVar(),
        a = ud(n, qt(o, 0.99999)).sub(Me.uCamPos).toVar(),
        s = oe(a).toVar(),
        l = a.div(s).toVar(),
        r = t.toVar(),
        u = r.rgb.toVar(),
        i = o.greaterThanEqual(0.99999).toVar();
      F(i, () => {
        (u.assign(B2(l)),
          u.assign(Z(B(w(nn(u)), u, p.uSkyVib.add(1)), 0)),
          s.assign(3800));
      }).ElseIf(r.a.greaterThan(1.5), () => {
        const P = k(1).div(Z(l.y, 0).add(0.1)),
          q = Kt(dl.mul(8).add(0.01).mul(P).negate()),
          S = dd(l).toVar(),
          K = Lo(l).toVar();
        (u.assign(
          B(
            K,
            u.mul(q).add(K.mul(0.35)),
            Ft(S.a.oneMinus(), 2).mul(_(0.3, 0.04, S.a)),
          )
            .mul(S.a.oneMinus())
            .add(S.rgb),
        ),
          s.assign(3800));
      });
      const c = il(p.uFogD0, p.uFogH, Me.uCamPos, l, s).toVar(),
        m = il(p.uFogBase, p.uHazeH, Me.uCamPos, l, s).toVar(),
        d = Kt(c.negate()),
        h = Kt(m.negate()),
        y = c.add(m),
        x = qt(Me.uCamPos.y, Me.uCamPos.y.add(l.y.mul(qt(s, 1500)))),
        b = B(Z(x, 0), Me.uCamPos.y, 0.35).toVar(),
        V = Z(gt(l, p.uSunDir), 0),
        T = Ft(V, 6).mul(0.5).add(Ft(V, 40).mul(1.4)).add(0.05).toVar(),
        A = _(-40, p.uCityH.mul(1.1), b),
        g = (e ? Y(Pt.uShaftOn.greaterThan(0.5), e.sample(n).r, A) : A).toVar(),
        M = Y(
          p.uSkyLutOn.greaterThan(0.5),
          B(
            p.uFogCol,
            Lo(vt(w(l.x, Z(l.y, 0).mul(0.3).add(0.045), l.z))),
            p.uHazeSky,
          ),
          p.uFogCol,
        ).toVar(),
        L = B(p.uFogLow, M.mul(0.8), _(0, p.uCityH.mul(0.95), b)).add(
          p.uSunCol.mul(T).mul(g).mul(0.11).mul(Pt.uShaftK),
        ),
        C = M.mul(B(0.75, 1, g)).add(
          p.uSunCol
            .mul(T)
            .mul(0.07)
            .mul(Pt.uShaftK)
            .mul(B(0.35, 1, g))
            .mul(p.uHazeSky.mul(-0.6).add(1)),
        ),
        E = p.uFogVib.add(1),
        R = B(
          w(1),
          p.uFogTint,
          Q(at(p.uNightK.sub(0.35)).mul(-2.86).add(1), 0, 1),
        ),
        G = Z(B(w(nn(L)), L, E), 0).mul(R),
        H = Z(B(w(nn(C)), C, E), 0).mul(R);
      u.assign(
        u.mul(d).add(G.mul(d.oneMinus())).mul(h).add(H.mul(h.oneMinus())),
      );
      const I = w(0).toVar();
      return (
        Pe(Eo, ({ i: P }) => {
          const q = so.uLP.element(P),
            S = so.uLC.element(P);
          F(S.r.add(S.g).add(S.b).greaterThan(0), () => {
            const K = q.xyz.sub(Me.uCamPos).toVar(),
              ot = gt(K, l).toVar(),
              xt = $s(Z(gt(K, K).sub(ot.mul(ot)), 0.6)).toVar(),
              U = as(s.sub(ot).div(xt))
                .sub(as(ot.negate().div(xt)))
                .div(xt),
              J = p.uFogD0
                .mul(Kt(q.y.div(p.uFogH).negate()))
                .add(p.uFogBase.mul(6));
            I.addAssign(
              S.rgb
                .mul(U)
                .mul(J)
                .mul(Kt(ds(Me.uCamPos, l, Q(ot, 0, s)).negate())),
            );
          });
        }),
        u.addAssign(I.mul(Pt.uAirK).mul(0.08).mul(p.uBlue.oneMinus())),
        F(p.uBlue.greaterThan(0.001), () => {
          const P = w(0.004, 0.008, 0.02).add(
              w(0.015, 0.05, 0.09).mul(Ft(at(l.y).oneMinus(), 4)),
            ),
            q = Kt(y.mul(-0.45)),
            S = Y(i, P, r.rgb)
              .mul(q)
              .add(w(0.008, 0.022, 0.045).mul(q.oneMinus()));
          u.assign(B(u, S, p.uBlue));
        }),
        nt(Z(u, 0), 1)
      );
    })(),
  Nu = Fn(
    At(() => {
      const t = re(),
        e = z2.sample(t).xy.toVar();
      return (
        F(na.sample(t).r.greaterThanEqual(0.99999), () => {
          const n = X(t.x.mul(2).sub(1), t.y.mul(-2).add(1)),
            o = Me.uInvProj.mul(nt(n, 1, 1)),
            a = Pt.uSkyM.mul(nt(o.xyz.div(o.w), 0));
          e.assign(n.sub(a.xy.div(a.w)));
        }),
        nt(e, 0, 1)
      );
    })(),
    null,
    null,
    { depthBuffer: !1 },
  ),
  md = (t) => Nu.sample(t).xy.mul(X(0.5, -0.5)).mul(Pt.uMB),
  Xa = (t) => Pr(na.sample(t).r, Me.uNF.x, Me.uNF.y).negate(),
  N2 = (t, e) =>
    At(() => {
      const n = re(),
        o = md(n).toVar(),
        a = oe(o).toVar();
      F(a.greaterThan(Pt.uMBMax), () => {
        (o.mulAssign(Pt.uMBMax.div(a)), a.assign(Pt.uMBMax));
      });
      const s = t.sample(n).rgb.toVar();
      return (
        F(a.greaterThanEqual(6e-4), () => {
          const l = Xa(n).toVar(),
            r = rl(no.xy),
            u = s.toVar(),
            i = k(1).toVar(),
            c = Jn(d0(Yd(oe(o.mul(Pt.uPx)).div(3)), 8, 32)).toVar(),
            m = k(c).toVar();
          (Pe(
            { start: Jn(0), end: c, type: "int", condition: "<" },
            ({ i: d }) => {
              const h = k(d).add(r).div(m).sub(0.5).toVar(),
                y = n.add(o.mul(h)).toVar(),
                x = Xa(y)
                  .lessThan(l.mul(0.97))
                  .and(oe(md(y)).lessThan(a.mul(0.5))),
                b = Y(x, k(0), at(h).mul(-0.7).add(1)).toVar();
              (u.addAssign(t.sample(y).rgb.mul(b)), i.addAssign(b));
            },
          ),
            s.assign(u.div(i)));
        }),
        nt(s.add(e.sample(n).rgb), 1)
      );
    })(),
  fd = (t) =>
    At(() => {
      const e = re(),
        n = t.toVar();
      return (
        F(na.sample(e).r.lessThan(0.99999), () => {
          const o = X(We.uW).div(Pt.uPx).toVar(),
            a = Xa(e).toVar(),
            s = Lr(Ns.sample(e).rgb).toVar(),
            l = k(0).toVar(),
            r = k(0).toVar();
          for (const [m, d] of [
            [1, 0],
            [0, 1],
            [0.71, 0.71],
            [0.71, -0.71],
          ]) {
            const h = o.mul(X(m, d)).toVar();
            l.assign(
              Z(
                l,
                a
                  .div(Xa(e.add(h)))
                  .add(a.div(Xa(e.sub(h))))
                  .negate()
                  .add(2),
              ),
            );
          }
          for (const [m, d] of [
            [0.5, 0],
            [-0.5, 0],
            [0, 0.5],
            [0, -0.5],
          ]) {
            const h = e.add(o.mul(X(m, d))).toVar();
            r.assign(
              Z(
                r,
                gt(s, Lr(Ns.sample(h).rgb))
                  .oneMinus()
                  .mul(pt(a.mul(0.97), Xa(h))),
              ),
            );
          }
          const u = Y(ea.a.greaterThan(1.5), k(1), _(We.uFar, We.uNear, a)).mul(
              Ns.sample(e).a,
            ),
            i = Q(
              Z(
                _(a.mul(25e-5).add(0.07), a.mul(4e-4).add(0.18), l),
                _(0.14, 0.32, r).mul(We.uCrease),
              ),
              0,
              1,
            )
              .mul(u)
              .mul(We.uK)
              .toVar(),
            c = Y(ea.a.greaterThan(1.5), B(We.uTone, 1, 0.55), We.uTone);
          n.assign(nt(B(n.rgb, n.rgb.mul(c).add(We.uCol), i), n.a));
        }),
        n
      );
    })(),
  Ru = 6,
  go = { type: f.HalfFloatType, depthBuffer: !1 };
function R2(t) {
  const e = [];
  let n = t;
  for (let a = 0; a < Ru; a++) {
    const s = n,
      l = a === 0,
      r = At(() => {
        const u = X(1).div(X(s.size())),
          i = re(),
          c = (ot, xt) => s.sample(i.add(X(ot, xt).mul(u))).rgb,
          m = c(-2, 2),
          d = c(0, 2),
          h = c(2, 2),
          y = c(-2, 0),
          x = c(0, 0),
          b = c(2, 0),
          V = c(-2, -2),
          T = c(0, -2),
          A = c(2, -2),
          g = c(-1, 1),
          M = c(1, 1),
          L = c(-1, -1),
          C = c(1, -1);
        if (!l)
          return nt(
            x
              .mul(0.125)
              .add(m.add(h).add(V).add(A).mul(0.03125))
              .add(d.add(y).add(b).add(T).mul(0.0625))
              .add(g.add(M).add(L).add(C).mul(0.125)),
            1,
          );
        const E = (ot) => k(1).div(nn(ot).add(1)),
          R = [
            m.add(d).add(y).add(x),
            d.add(h).add(x).add(b),
            y.add(x).add(V).add(T),
            x.add(b).add(T).add(A),
            g.add(M).add(L).add(C),
          ].map((ot) => ot.mul(0.25).toVar()),
          G = R.map(E),
          H = [0.125, 0.125, 0.125, 0.125, 0.5];
        let I = w(0),
          P = k(0);
        R.forEach((ot, xt) => {
          ((I = I.add(ot.mul(G[xt]).mul(H[xt]))),
            (P = P.add(G[xt].mul(H[xt]))));
        });
        const q = I.div(P).toVar(),
          S = Z(q.r, Z(q.g, q.b)),
          K = Q(S.sub(Pt.uBloomT), 0, 1.1);
        return nt(
          q
            .mul(Z(K.mul(K).div(1.1), S.sub(Pt.uBloomT.add(0.55))))
            .div(Z(S, 1e-4)),
          1,
        );
      })();
    ((n = Fn(r, null, null, { ...go, resolutionScale: 1 / 2 ** (a + 1) })),
      e.push(n));
  }
  let o = e[Ru - 1];
  for (let a = Ru - 2; a >= 0; a--) {
    const s = o,
      l = e[a],
      r = At(() => {
        const u = X(1).div(X(s.size())),
          i = re(),
          c = (d, h) => s.sample(i.add(X(d, h).mul(u))).rgb,
          m = c(-1, -1)
            .add(c(1, -1))
            .add(c(-1, 1))
            .add(c(1, 1))
            .add(c(-1, 0).add(c(1, 0)).add(c(0, -1)).add(c(0, 1)).mul(2))
            .add(c(0, 0).mul(4));
        return nt(l.sample(i).rgb.add(m.div(16).mul(Pt.uBloomR)), 1);
      })();
    o = Fn(r, null, null, { ...go, resolutionScale: 1 / 2 ** (a + 1) });
  }
  return { out: o, down: e, nodes: [...e, o] };
}
const In = { uT: W(4), uK: W(0.35), uSun: W(new f.Vector3()), uAsp: W(1.6) },
  D2 = [
    [0.42, 0.022, [1, 0.62, 0.3]],
    [0.78, 0.05, [0.55, 0.85, 1]],
    [1.12, 0.014, [1, 0.85, 0.5]],
    [1.38, 0.085, [0.6, 0.5, 1]],
    [1.7, 0.034, [0.5, 1, 0.75]],
    [2.15, 0.12, [0.35, 0.55, 1]],
  ];
function _2(t, e) {
  const n = Fn(
      At(() => nt(Z(t.sample(re()).rgb.sub(In.uT), 0).mul(0.25), 1))(),
      null,
      null,
      { ...go, resolutionScale: 0.125 },
    ),
    o = Fn(
      At(() => {
        const s = re(),
          l = w(0).toVar();
        for (let r = -10; r <= 10; r++)
          r &&
            l.addAssign(
              n
                .sample(s.add(X(r * 0.018, 0)))
                .rgb.mul(Math.exp(-Math.abs(r) * 0.22)),
            );
        return nt(l.mul(w(0.35, 0.55, 1)).mul(0.12), 1);
      })(),
      null,
      null,
      { ...go, resolutionScale: 1 / 8 },
    ),
    a = At(() => {
      const s = re(),
        l = In.uSun,
        r = X(In.uAsp, 1),
        u = _(0.4, 3, nn(e.sample(l.xy).rgb))
          .mul(l.z)
          .toVar(),
        i = X(0.5).sub(l.xy).mul(2),
        c = w(0).toVar();
      for (const [d, h, y] of D2) {
        const x = oe(s.sub(l.xy.add(i.mul(d))).mul(r)).toVar();
        c.addAssign(
          w(...y).mul(
            _(h, h * 0.6, x)
              .mul(0.7)
              .add(_(h * 0.08, 0, at(x.sub(h * 0.93))).mul(0.5))
              .mul(0.6),
          ),
        );
      }
      const m = s.sub(l.xy).mul(r);
      return (
        c.addAssign(
          w(0.4, 0.65, 1).mul(
            Kt(at(m.y).mul(-260))
              .mul(Kt(at(m.x).mul(-2.6)))
              .mul(0.9),
          ),
        ),
        c.mul(u)
      );
    });
  return { out: { sample: (s) => o.sample(s).rgb.add(a()) }, nodes: [n, o] };
}
function G2(t) {
  const e = Fn(
    At(() => {
      const n = re(),
        o = X(1).div(X(t.size())),
        a = w(0).toVar(),
        s = (l) => Z(t.sample(l).rgb.sub(Ne.uStarT), 0);
      for (let l = 1; l <= 9; l++) {
        const r = Math.exp(-l * 0.33),
          u = o.mul(l * 1.4);
        for (const [i, c] of [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ])
          a.addAssign(s(n.add(u.mul(X(i, c)))).mul(r));
      }
      return nt(a.mul(w(0.85, 0.93, 1)).mul(0.2), 1);
    })(),
    null,
    null,
    { ...go, resolutionScale: 0.25 },
  );
  return { out: e, nodes: [e] };
}
const oa = [0, 1].map(
  () =>
    new f.RenderTarget(1, 1, {
      type: f.HalfFloatType,
      depthBuffer: !1,
      minFilter: f.NearestFilter,
      magFilter: f.NearestFilter,
      generateMipmaps: !1,
    }),
);
let Rs = 0,
  hd = !0;
const gd = Ve(oa[0].texture),
  pd = Ve(oa[1].texture),
  yd = Ve(oa[1].texture),
  fr = { uK: W(0.05), uFirst: W(1) },
  H2 = ei(
    At(() => {
      const t = k(0).toVar(),
        e = k(0).toVar();
      Pe(24, 15, ({ i: o, j: a }) => {
        const s = X(k(o).add(0.5).div(24), k(a).add(0.5).div(15)),
          l = oe(s.sub(0.5)).mul(-0.7).add(1);
        (t.addAssign(jd(Z(nn(pd.sample(s).rgb), 1e-4)).mul(l)), e.addAssign(l));
      });
      const n = t.div(e);
      return nt(
        Y(fr.uFirst.greaterThan(0.5), n, B(yd.sample(X(0.5)).r, n, fr.uK)),
        0,
        0,
        1,
      );
    })(),
  ),
  O2 = (t) =>
    t
      .mul(t.add(0.0245786))
      .sub(90537e-9)
      .div(t.mul(t.mul(0.983729).add(0.432951)).add(0.238081)),
  W2 = r0(
    w(0.59719, 0.076, 0.0284),
    w(0.35458, 0.90834, 0.13383),
    w(0.04823, 0.01566, 0.83777),
  ),
  q2 = r0(
    w(1.60475, -0.10208, -0.00327),
    w(-0.53108, 1.10813, -0.07276),
    w(-0.07367, -0.00605, 1.07602),
  ),
  K2 = (t) => Q(q2.mul(O2(W2.mul(t.mul(1 / 0.6)))), 0, 1),
  aa = (t) =>
    B(
      t.mul(12.92),
      Ft(Z(t, 0), w(1 / 2.4))
        .mul(1.055)
        .sub(0.055),
      pt(0.0031308, t),
    ),
  U2 = (t, e, n, o = "off", a = null) =>
    At(() => {
      const s = re(),
        l = s.sub(0.5).toVar(),
        r = Jt(p.uTime.mul(24)).toVar(),
        u = s,
        i = gt(l, l).mul(p.uTurbo.mul(1.6).add(1).mul(0.0025)).mul(Ne.uCA),
        c = w(
          t.sample(u.sub(l.mul(i))).r,
          t.sample(u).g,
          t.sample(u.add(l.mul(i))).b,
        ).toVar(),
        m = Y(
          Pt.uAE.greaterThan(0),
          Q(Kt(Pt.uKey.sub(gd.sample(X(0.5)).r).mul(Pt.uAE)), 0.62, 1.7),
          k(1),
        );
      if (e) {
        const y = e.sample(u).rgb.mul(Pt.uBloomK).mul(Ne.uBloomM).toVar();
        (o === "90s" &&
          y.assign(Z(B(w(nn(y)), y, 1.35), 0).mul(w(1.12, 0.9, 0.8))),
          c.addAssign(y));
      }
      if (
        (n && c.addAssign(n.sample(u).mul(In.uK)),
        a && c.addAssign(a.sample(u).rgb.mul(Ne.uStarK)),
        o === "modern")
      ) {
        const y = s.sub(Ne.uLeak.xy).mul(X(In.uAsp, 1));
        c.addAssign(
          p.uSunCol
            .mul(w(1, 0.7, 0.92))
            .mul(
              Kt(gt(y, y).mul(-2.4))
                .mul(0.8)
                .add(Kt(gt(y, y).mul(-0.6)).mul(0.2)),
            )
            .mul(Ne.uLeak.z),
        );
      }
      const d = K2(c.mul(Pt.uExpo).mul(m)).toVar(),
        h = nn(d).toVar();
      if (
        (d.assign(
          Z(B(w(h), d, B(Pt.uSat.mul(Ne.uSat), Pt.uSat, _(0.5, 0.95, h))), 0),
        ),
        o === "90s")
      ) {
        (d.mulAssign(B(w(1), w(0.84, 0.8, 1.24), _(0.3, 0.02, h).mul(0.7))),
          d.addAssign(
            w(0.004, -0.004, 0.02)
              .mul(_(0, 0.32, h).oneMinus())
              .add(w(0.03, 0.012, -0.03).mul(_(0.42, 1, h))),
          ),
          d.assign(
            B(
              d,
              Q(d, 0, 1)
                .mul(Q(d, 0, 1))
                .mul(Q(d, 0, 1).mul(-2).add(3)),
              0.2,
            ),
          ),
          d.assign(
            d
              .mul(0.95)
              .add(w(0.012, 0.008, 0.022))
              .mul(ie(X(r, 3.3)).sub(0.5).mul(Ne.uFlick.mul(0.03)).add(1)),
          ),
          d.mulAssign(gt(l, l).mul(p.uTurbo.mul(-0.3).sub(0.95)).add(1)));
        const y = no.xy.div(Z(Pt.uPx.y.div(1080), 1)).toVar(),
          x = jt(y.div(1.35).add(ie(X(r, 5.1)).mul(917)))
            .sub(0.5)
            .add(
              jt(y.div(0.7).add(ie(X(r, 6.1)).mul(733)))
                .sub(0.5)
                .mul(0.6),
            );
        return nt(
          aa(Q(d, 0, 1)).add(
            x
              .mul(at(h.mul(2).sub(1)).oneMinus().mul(0.05).add(0.018))
              .mul(Ne.uGrainK)
              .mul(Pt.uGrain),
          ),
          1,
        );
      }
      return (
        o === "modern"
          ? (d.mulAssign(
              B(w(1), w(0.74, 0.86, 1.32), _(0.45, 0.02, h).mul(0.85)).mul(
                B(w(1), w(1.06, 0.96, 0.92), _(0.5, 1, h)),
              ),
            ),
            d.addAssign(
              w(-0.004, 0.01, 0.03)
                .mul(_(0, 0.4, h).oneMinus())
                .add(w(0.02, 0, -0.006).mul(_(0.5, 1, h))),
            ),
            d.assign(
              B(
                d,
                Q(d, 0, 1)
                  .mul(Q(d, 0, 1))
                  .mul(Q(d, 0, 1).mul(-2).add(3)),
                0.32,
              ),
            ),
            d.mulAssign(gt(l, l).mul(p.uTurbo.mul(-0.3).sub(0.45)).add(1)))
          : (d.addAssign(
              w(-0.006, 0, 0.012)
                .mul(_(0, 0.35, h).oneMinus())
                .add(w(0.012, 0.004, -0.012).mul(_(0.45, 1, h))),
            ),
            d.mulAssign(gt(l, l).mul(p.uTurbo.mul(-0.3).sub(0.62)).add(1))),
        nt(
          aa(Q(d, 0, 1)).add(
            E0(no.xy.add(rt(p.uTime.mul(7)).mul(97)))
              .sub(0.5)
              .div(255)
              .mul(Pt.uGrain.mul(1.5).add(1.5)),
          ),
          1,
        )
      );
    })(),
  hr = {
    off: {
      cel: 0,
      celW: 0.03,
      flat: 0,
      flatWin: 0,
      cloudE: [0, 1, 0],
      cloudBand: 0,
      cloudRim: 0,
      skyVib: 0,
      fogVib: 0,
      fogTint: [1, 1, 1],
      ink: 0,
      sat: 1,
      ca: 1,
      bloomM: 1,
      bloomR: 1,
      bloomT: 0.55,
      flareM: 1,
      star: 0,
      leak: 0,
      grain: 1,
      giM: 1,
    },
    "90s": {
      cel: 1,
      celW: 0.025,
      flat: 0.75,
      flatWin: 1,
      cloudE: [0.3, 0.4, 1],
      cloudBand: 1,
      cloudRim: 0,
      skyVib: 0.12,
      fogVib: 0.15,
      fogTint: [1, 1, 1],
      ink: 1,
      inkPx: 620,
      inkMin: 1.5,
      inkTone: 0.14,
      inkCol: [0.004, 0.003, 0.012],
      inkNear: 140,
      inkFar: 900,
      inkCrease: 0.75,
      sat: 1.2,
      ca: 1.2,
      bloomM: 1.25,
      bloomR: 1.06,
      bloomT: 0.9,
      flareM: 0.7,
      star: 0,
      leak: 0,
      grain: 0.65,
      giM: 0.7,
    },
    modern: {
      cel: 1,
      celW: 0.12,
      flat: 0.45,
      flatWin: 0,
      cloudE: [0.08, 0.5, 1],
      cloudBand: 0,
      cloudRim: 1,
      skyVib: 0.3,
      fogVib: 0.35,
      fogTint: [1, 0.84, 1.14],
      ink: 0.9,
      inkPx: 1050,
      inkMin: 1,
      inkTone: 0.32,
      inkCol: [0.002, 0.002, 0.006],
      inkNear: 70,
      inkFar: 480,
      inkCrease: 0.55,
      sat: 1.32,
      ca: 1.5,
      bloomM: 1.1,
      bloomR: 1.05,
      bloomT: 0.9,
      flareM: 2.2,
      star: 1,
      leak: 0.035,
      grain: 0.5,
      giM: 1,
    },
  },
  be = { style: "off", A: hr.off },
  Qa = ["off", "90s", "modern"],
  Y2 = {
    off: "Anime off: the city as it renders",
    "90s":
      "Anime, the 90s: inked cels shot on film \xB7 \u21E7I for the modern look",
    modern:
      "Anime, modern: soft cel light, a vivid sky, glow and flare \xB7 \u21E7I to turn it off",
  };
function Ds(t, e) {
  if (!hr[t]) return;
  const n = hr[t];
  ((be.style = t),
    (be.A = n),
    (p.uCel.value = n.cel),
    (p.uCelW.value = n.celW),
    (p.uFlat.value = n.flat),
    (p.uFlatWin.value = n.flatWin),
    p.uCloudE.value.set(...n.cloudE),
    (p.uCloudBand.value = n.cloudBand),
    (p.uCloudRim.value = n.cloudRim),
    (p.uSkyVib.value = n.skyVib),
    (p.uFogVib.value = n.fogVib),
    p.uFogTint.value.set(...n.fogTint),
    (We.uK.value = n.ink),
    n.ink &&
      ((We.uTone.value = n.inkTone),
      We.uCol.value.setRGB(...n.inkCol),
      (We.uNear.value = n.inkNear),
      (We.uFar.value = n.inkFar),
      (We.uCrease.value = n.inkCrease)),
    (Ne.uSat.value = n.sat),
    (Ne.uCA.value = n.ca),
    (Ne.uBloomM.value = n.bloomM),
    (Pt.uBloomT.value = n.bloomT),
    (Ne.uStarK.value = n.star),
    (Ne.uGrainK.value = n.grain),
    document.querySelectorAll("#seg-anime button").forEach((o) => {
      const a = o.dataset.a === t;
      (o.classList.toggle("on", a), o.setAttribute("aria-pressed", a));
    }),
    (te.moved = Nt),
    sa(3),
    tn && $o(),
    e || Ot(Y2[t]));
}
const Za = new f.RenderPipeline(zt);
Za.outputColorTransform = !1;
let _s = "",
  Du = [],
  gr = null,
  pr = null;
function _u() {
  return [
    D.ssgi > 0,
    !!D.shafts,
    !!D.mblur,
    !!D.bloom,
    !!(D.flare && D.bloom),
    be.style,
  ].join();
}
function xd() {
  _s = _u();
  for (const b of Du) b.dispose?.();
  Du = [];
  const t = (b) => (Du.push(b), b),
    e = _s.split(","),
    [n, o, a, s, l] = e.slice(0, 5).map((b) => b === "true"),
    r = e[5],
    u = n
      ? At(() => {
          const b = ea.toVar(),
            V = Le.getAONode().r;
          return nt(
            b.rgb
              .mul(B(1, V, Q(b.a, 0, 1).mul(rd.uAoK)))
              .add(
                sd.rgb
                  .mul(Le.getGINode().rgb)
                  .mul(Pt.uGiK)
                  .mul(p.uBlue.oneMinus()),
              ),
            b.a,
          );
        })()
      : ea,
    i = o
      ? t(
          Fn(
            I2(t(Fn(P2(), null, null, { ...go, resolutionScale: 0.5 }))),
            null,
            null,
            { ...go, resolutionScale: 0.5 },
          ),
        )
      : null,
    c = F2(u, i),
    m = (r !== "off" ? fd(c) : c).add(nt(E2.rgb, 0));
  pr = t(tm(m, na, Nu, et));
  const d = pr.getTextureNode();
  gr = t(
    Fn(
      a
        ? N2(d, ld)
        : At(() => nt(d.sample(re()).rgb.add(ld.sample(re()).rgb), 1))(),
      null,
      null,
      go,
    ),
  );
  const h = s ? R2(gr) : null;
  h && h.nodes.forEach(t);
  const y = l && h ? _2(h.down[1], h.down[2]) : null;
  y && y.nodes.forEach(t);
  const x = r === "modern" && h ? G2(h.down[1]) : null;
  (x && x.nodes.forEach(t),
    (Za.outputNode = U2(gr, h && h.out, y && y.out, r, x && x.out)),
    (Za.needsUpdate = !0));
}
function po() {
  const t = fn.clientWidth || innerWidth,
    e = fn.clientHeight || innerHeight;
  ((mr = t < 900),
    (te.moved = Nt),
    zt.setPixelRatio(D.pixelRatio),
    zt.setSize(t, e, !1));
  const n = zt.getDrawingBufferSize(new f.Vector2());
  ((nd = n.x),
    (Bu = n.y),
    Pt.uPx.value.set(nd, Bu),
    (Fu = D.ssgi >= 3 ? 1 : Q(1 / D.pixelRatio, 0.5, 1)));
  const o = C2[D.ssgi];
  (o && ((Le.sliceCount.value = o[0]), (Le.stepCount.value = o[1])),
    (p.uBounceK.value = D.ssgi > 0 ? 0.5 : 1),
    (et.aspect = t / e),
    (et.fov = D.fov + (t / e < 0.8 ? 14 : 0)),
    et.updateProjectionMatrix(),
    _u() !== _s && xd());
}
addEventListener("resize", po);
const bd = new f.Matrix4(),
  Gu = new f.Matrix4(),
  Hu = new f.Matrix4(),
  $2 = new f.Matrix4();
let wd = !0;
function j2() {
  (Me.uCamPos.value.setFromMatrixPosition(et.matrixWorld),
    Me.uNF.value.set(et.near, et.far),
    (p.uGIOn.value = D.gi),
    (p.uReflOn.value = D.refl),
    (p.uFrame.value = (p.uFrame.value + 1) % 1e4),
    (p.uFogD0.value = wt.d0 * D.fog),
    (p.uFogH.value = wt.fh),
    (p.uFogBase.value = wt.base * D.fog),
    (p.uHazeH.value = wt.hh || 650),
    (Pt.uAirK.value = wt.air * D.lights),
    (Pt.uShaftK.value = wt.shaft),
    (Pt.uShaftOn.value =
      D.shafts &&
      wt.shaft > 0.05 &&
      p.uShadowOn.value > 0.5 &&
      p.uBlue.value < 0.99
        ? 1
        : 0),
    (Pt.uGiK.value = D.giK * be.A.giM),
    (rd.uAoK.value = D.aoK),
    be.A.ink && (We.uW.value = Math.max(be.A.inkMin, Bu / be.A.inkPx)),
    bd.extractRotation(et.matrixWorld),
    Hu.copy(et.projectionMatrix).multiply(
      $2.extractRotation(et.matrixWorldInverse),
    ),
    (wd || Gs || ta > 0.2) && (Gu.copy(Hu), (wd = !1)),
    Pt.uSkyM.value.copy(Gu).multiply(bd),
    Gu.copy(Hu),
    (Pt.uMB.value = Gs || ta > 0.2 ? 0 : 0.5 + 0.35 * Bt.k),
    (Pt.uMBMax.value = 0.05 + 0.07 * Bt.k),
    Gs && pr && pr.setSize(1, 1),
    (Gs = !1),
    (Pt.uExpo.value = wt.expo * D.exposure),
    (Pt.uBloomK.value = D.bloom ? D.bloomK : 0),
    (In.uK.value = D.flareK * be.A.flareM),
    X2(),
    Q2(),
    (Pt.uBloomR.value = D.bloomRadius * be.A.bloomR),
    (Pt.uSat.value = D.sat),
    (Pt.uGrain.value = D.grain),
    (Pt.uKey.value = wt.key),
    (Pt.uAE.value = D.ae * 0.5),
    _u() !== _s && !br && xd(),
    fe.on &&
      D.mirror !== 0 &&
      (!br || br.startsWith("mir")) &&
      (fe.frame++ & 1) === 0 &&
      wh(),
    qn.position.copy(et.position),
    qn.quaternion.copy(et.quaternion),
    (qn.fov = et.fov),
    (qn.aspect = et.aspect),
    (qn.near = et.near),
    (qn.far = et.far),
    qn.updateProjectionMatrix(),
    qn.updateMatrixWorld(),
    zt.setRenderTarget(null),
    zt.setClearColor(0, 0),
    Za.render(),
    (pd.value = gr.value),
    (yd.value = oa[Rs].texture),
    (fr.uK.value = 1 - Math.exp(-$a * 1.4)),
    (fr.uFirst.value = hd ? 1 : 0),
    (Rs ^= 1),
    ti(H2, oa[Rs]),
    zt.setRenderTarget(null),
    (hd = !1),
    (gd.value = oa[Rs].texture));
}
let Gs = !0;
const Hs = new f.Vector3(),
  Md = new f.Vector3();
function X2() {
  const t = p.uSunDir.value;
  if (
    (et.getWorldDirection(Md),
    (In.uAsp.value = et.aspect),
    t.y < -0.02 || Md.dot(t) < 0.05 || p.uBlue.value > 0.5)
  ) {
    In.uSun.value.z = 0;
    return;
  }
  Hs.copy(t).multiplyScalar(1e3).add(et.position).project(et);
  const e = Math.max(Math.abs(Hs.x), Math.abs(Hs.y));
  In.uSun.value.set(
    Hs.x * 0.5 + 0.5,
    0.5 - Hs.y * 0.5,
    Q((1.15 - e) / 0.3, 0, 1) * Q(t.y * 12 + 0.6, 0, 1),
  );
}
const wn = new f.Vector3();
function Q2() {
  const t = be.A.leak,
    e = p.uSunDir.value;
  if (!t || e.y < -0.04 || p.uBlue.value > 0.5 || p.uNightK.value > 0.8) {
    Ne.uLeak.value.z = 0;
    return;
  }
  wn.copy(e).transformDirection(et.matrixWorldInverse);
  const n = Math.tan((et.fov * Math.PI) / 360),
    o = et.aspect;
  let a, s;
  if (wn.z < -0.08) ((a = wn.x / -wn.z / (n * o)), (s = wn.y / -wn.z / n));
  else {
    const l = Math.hypot(wn.x, wn.y) || 1;
    ((a = (wn.x / l) * 2.2), (s = (wn.y / l) * 2.2));
  }
  ((a = Q(a, -2.6, 2.6)),
    (s = Q(s, -2.6, 2.6)),
    Ne.uLeak.value.set(
      a * 0.5 + 0.5,
      0.5 - s * 0.5,
      t *
        Ir(0.35, -0.25, wn.z) *
        Q(e.y * 10 + 0.6, 0, 1) *
        (1 - p.uNightK.value),
    ));
}
let Td = performance.now(),
  Ou = 0,
  Wu = 0,
  vd = 0,
  Ad = 0,
  yr = 0,
  Os = 0,
  qu = 0;
function sa(t = 2) {
  qu = Math.max(qu, Nt + t);
}
function Ku(t, e = !0) {
  ((ta = Q((t - Td) / 1e3, 0, 1.5)),
    ($a = Math.min(0.1, ta)),
    (Td = t),
    (Nt = t / 1e3),
    (Dt = (te.on ? te.at : Nt) - te.off),
    (p.uTime.value = Dt),
    ja && !te.on && (bu += Math.min(ta, 0.25)),
    ja && !Zt.from && (Zt.from = Zt.last = Nt || 0.001),
    Zt.over && (Zt.last = Nt),
    Zt.auto && !Zt.on && Zt.from && Nt - Zt.last > Zt.wait && Xo(!0),
    wf(),
    p2(),
    p.uWind.value.set(Dt * 9, Dt * 3.5),
    p.uCityGlow.value
      .setRGB(1, 0.76, 0.5)
      .multiplyScalar(wt.litK * wt.win * 0.045),
    (Ya += (Yn - Ya) * (1 - Math.exp(-$a * 3))),
    (p.uBlue.value = Ya < 0.002 ? 0 : Ya > 0.998 ? 1 : Ya),
    Z2($a),
    et.updateMatrixWorld());
  const n = Math.floor(et.position.x / It),
    o = Math.floor(et.position.z / It);
  ((n !== me.ci || o !== me.cj) && ff(n, o),
    mf(od ? 4 : 1e4),
    vf(),
    (p.uNeonK.value = wt.neon),
    Ei.value.set(
      Math.round(et.position.x / It) * It,
      Math.round(et.position.z / It) * It,
    ),
    Kh(),
    b2($a),
    e &&
      te.on &&
      (te.cam.equals(et.matrixWorld) ||
        (te.cam.copy(et.matrixWorld), (te.moved = Nt)),
      (Ht.size || Xt) && (te.moved = Nt)));
  const a = te.on && ja && Nt - te.moved > 2.5;
  if (e && (a || (Sm(), gf(), pf(), xf(), j2()), A1(), !ja)) {
    ja = !0;
    const s = tt("#loading");
    s && (s.classList.add("out"), setTimeout(() => s.remove(), 1e3));
  }
  if (
    (V2($a),
    !or &&
      z.mode === "chase" &&
      !Ct &&
      !Yt &&
      bu > (tn ? 12 : 30) &&
      ((or = !0), Ae("director")),
    Dt > 2.5 &&
      !ad &&
      ((ad = !0),
      Ot(
        tn
          ? "Drag to look \xB7 click in, then A D W S to steer \xB7 \u21E7T turbo"
          : mr
            ? "Drag to steer your car \xB7 tap another car to chase it"
            : "A D lean \xB7 W S climb \xB7 \u21E7T turbo \xB7 \u21E7H hover \xB7 \u21E7V the driver's seat \xB7 click any car to chase it",
      ),
      (Uu = Nt + 2.5)),
    xr.classList.contains("on") && Nt - Uu > 1.8 && xr.classList.remove("on"),
    te.on || ((Ou += ta), Wu++),
    !te.on && t - vd > 1600)
  ) {
    const s = Wu / Math.max(Ou, 0.001);
    ((Ou = 0), (Wu = 0), (vd = t), (hu = s), yr++);
    const l = Nt < qu;
    if (
      (l ||
        (yr > 2 && (Ad = Math.max(Ad, s)),
        (Os = yr > 3 && s < 50 ? Os + 1 : 0)),
      D._ceil === void 0 &&
        ((D._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (D._good = 0),
        (D._probe = 0)),
      !document.hidden &&
        D.auto &&
        yr > 3 &&
        !l &&
        (D._probe && s < 55
          ? ((D._probe = 0),
            (D._good = 0),
            (D._ceil = Math.max(1, +(D.pixelRatio - 0.25).toFixed(2))),
            (D.pixelRatio = D._ceil),
            po())
          : ((D._probe = 0),
            (D._good = s >= 58 ? Math.min(9, D._good + 1) : 0),
            D._good >= 3 &&
              D.pixelRatio < D._ceil &&
              ((D._good = 0),
              (D._probe = 1),
              (D.pixelRatio = Math.min(
                D._ceil,
                +(D.pixelRatio + 0.25).toFixed(2),
              )),
              po())),
        Os >= 2 || (Os >= 1 && s < 30)))
    ) {
      const r = s < 30 ? 2 : 1;
      Os = 0;
      for (let u = 0; u < r; u++)
        D.pixelRatio > 1
          ? (D.pixelRatio = D._ceil =
              Math.max(1, +(D.pixelRatio - 0.25).toFixed(2)))
          : D.ssgi > 1
            ? D.ssgi--
            : D.nshadow
              ? (D.nshadow = 0)
              : D.mblur
                ? (D.mblur = 0)
                : D.refl
                  ? (D.refl = 0)
                  : D.ssgi
                    ? (D.ssgi = 0)
                    : D.detail > 0.7
                      ? (D.detail = 0.7)
                      : D.shafts
                        ? (D.shafts = 0)
                        : D.gi && (D.gi = 0);
      po();
    }
  }
  (Kc(), (od = !0));
}
function Z2(t) {
  const e = Dt,
    n = te.on ? 0 : t;
  let o = te.on ? 0 : Math.max(t, Math.min(ta, 1));
  do {
    const a = Math.min(o, 0.1);
    (oh(a), (o -= a));
  } while (o > 1e-6);
  (ch(n),
    rh(n),
    Wh(t, e),
    et.updateMatrixWorld(),
    Nh(),
    jf(e),
    ah(),
    zh(),
    c2(),
    dh());
}
const xr = tt("#ui-hint");
let Uu = -9;
function Ot(t) {
  ((xr.textContent = t), xr.classList.add("on"), (Uu = Nt), (te.moved = Nt));
}
let Vd = !0,
  zd = !1;
function J2(t) {
  Vd && !zd && Ku(t ?? performance.now());
}
((zt.onDeviceLost = (t) => {
  ((zd = !0),
    console.warn("GPU device lost:", t?.reason || "", t?.message || ""));
  const e = document.createElement("div");
  ((e.id = "loading"),
    (e.textContent =
      "The graphics device was reset. Reload the page to grow the city again."),
    fn.appendChild(e));
}),
  Sa("day", !0),
  Ps(D.traffic),
  (tt("#seed-v").textContent = $e),
  tt("#b-sound").classList.toggle("on", Oe),
  po());
{
  let t = "auto";
  try {
    t = localStorage.getItem("gigacity-gfx") || "auto";
  } catch {}
  t !== "auto" && ku[t] && Eu(t, !0);
}
((async () => (
  Em(),
  zt.setRenderTarget(null),
  Ku(performance.now(), !1),
  Hc(om),
  zt.setAnimationLoop(J2)
))(),
  (window.__step = (t, e = !0) => {
    (zt._nodes?.nodeFrame?.update?.(), Ku(t, e));
  }),
  (window.__loop = (t) => {
    Vd = t;
  }),
  (window.__capture = (t = 1200, e = 0.85) => {
    const n = document.createElement("canvas");
    return (
      (n.width = t),
      (n.height = Math.round((t * je.height) / je.width)),
      n.getContext("2d").drawImage(je, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", e)
    );
  }));
const Yu = async (t, e, n, o, a) => {
  const s = await zt.readRenderTargetPixelsAsync(t, e, n, o, a);
  return s instanceof Uint16Array
    ? [...s].map(f.DataUtils.fromHalfFloat)
    : [...s];
};
((window.__x = {
  renderer: zt,
  camera: et,
  scene: ze,
  RT: D,
  CITY: me,
  LOOK: wt,
  SU: p,
  block: Rn,
  BLK: zo,
  HERO: v,
  CAM: z,
  SHOTS: cn,
  NEAR_CARS: rn,
  FOG_U: id,
  shadowRT: us,
  shadowCam: Fe,
  plate: Uo,
  STEER: Ut,
  GI: Le,
  FX: Pt,
  GPU: _r,
  TURBO: Bt,
  RIB: xe,
  cockpit: pe,
  HOLO: yt,
  DASHL: ke,
  holoGroup: ho,
  district: Zs,
  PARA_G: ls,
  PARA_MESH: bs,
  MIR: fe,
  mirrorRT: Ra,
  mirCam: xn,
  PARK: Vt,
  PAUSE: te,
  UIC: Zt,
  FL: In,
  CK_DOORS: eu,
  WORKS_AD: Ta,
  mirrorMesh: yh,
  routeAt: Ia,
  TURN: Ho,
  turnSpeed: $c,
  lineW: Ue,
  RADIO: ft,
  RADIO_TRACKS: Ln,
  mirror: async () => {
    const t = await Yu(Ra, 0, 0, Ol, Wl);
    let e = 0,
      n = 0;
    for (let o = 0; o < t.length; o += 4)
      ((e += t[o] + t[o + 1] + t[o + 2]),
        (n = Math.max(n, t[o], t[o + 1], t[o + 2])));
    return {
      mean: e / (t.length / 4) / 3,
      max: n,
      on: fe.uOn.value,
      frame: fe.frame,
    };
  },
  pick: (t, e, n = !0) => {
    const o = xu({ clientX: t, clientY: e }, n);
    return (
      o && {
        kind: o.kind,
        id: o.t?.id,
        para: !!o.t?.para,
        mega: o.t?.mega?.name,
        url: o.b?.url,
        car: o.C ? he[o.C.type].name : void 0,
      }
    );
  },
  voices: () => Iu.map((t) => ({ ...t })),
  adapt: async () => (await Yu(oa[Rs], 0, 0, 1, 1))[0],
  sky: async (t) => {
    const e = await Yu(Wr, 0, 0, 256, 128);
    return t.map(([n, o]) => {
      const a = (Math.floor(o * 127.99) * 256 + Math.floor(n * 255.99)) * 4;
      return [0, 1, 2].map((s) => +(e[a + s] * p.uSkyK.value).toFixed(4));
    });
  },
}),
  (window.__lab = {
    freeze: (t) => {
      v.frozen = !!t;
    },
    restart: () => {
      (Ui(), (Ba.length = 0), (z.cut = !0));
    },
    inspect: (t, e, n = 8, o = 0.6) => {
      ((v.frozen = !0), Ae("drone"));
      const a = v.pos,
        s = v.yaw + t;
      z.dPos.set(
        a.x + Math.sin(s) * Math.cos(e) * n,
        a.y + o + Math.sin(e) * n,
        a.z + Math.cos(s) * Math.cos(e) * n,
      );
      const l = a.x - z.dPos.x,
        r = a.y + o - z.dPos.y,
        u = a.z - z.dPos.z,
        i = Math.hypot(l, r, u);
      ((z.dPitch = Math.asin(r / i)), (z.dYaw = Math.atan2(-l, -u)));
    },
    look: (t, e = !0) => Sa(t, e),
    anime: (t) => Ds(t),
    mode: (t) => Ae(t),
    turbo: (t) => Fa(t),
    hover: (t) => ks(t),
    pause: (t) => Su(t),
    compact: (t) => Xo(t),
    megaCell: (t, e) => v0(t, e),
    megas: () =>
      me.list
        .filter((t) => t.mega)
        .map((t) => ({
          name: t.mega.name,
          id: t.id,
          cx: Math.round(t.cx),
          cz: Math.round(t.cz),
          H: t.H,
          h: +t.para.h.toFixed(2),
          rot: +t.para.rot.toFixed(2),
        })),
    boards: () =>
      [...Hn]
        .flatMap((t) => t.detail?.boards || [])
        .map((t) => ({
          x: +t.x.toFixed(1),
          y: +t.y.toFixed(1),
          z: +t.z.toFixed(1),
          nx: t.nx,
          nz: t.nz,
          w: +t.w.toFixed(1),
          h: +t.h.toFixed(1),
          kind: t.kind,
          name: t.name,
          url: t.url,
        })),
    shot: (t) => {
      (Ae("director"),
        (z.shot = t),
        (z.shotAt = Dt),
        (z.cut = !0),
        (z.fix = null));
    },
    seed: (t) => ir(t),
    blue: (t) => {
      (Vu(t), (Ya = Yn));
    },
    lanes: (t) => zu(t),
    traffic: (t) => Ps(t),
    follow: (t) => {
      const e = rn[t || 0];
      e && z1({ kind: "car", C: e });
    },
    tune: (t) => (Object.assign(D, t), po(), { ...D }),
    orbit: (t, e, n) => {
      ((z.orbYaw = t), (z.orbPitch = e), n && (z.dist = n));
    },
    drone: (t, e, n, o, a) => {
      (Ae("drone"), z.dPos.set(t, e, n), (z.dYaw = o), (z.dPitch = a));
    },
  }),
  (window.__ui = () => {
    ((gu = -9), A1());
  }),
  (window.__dbg = () => ({
    t: +Dt.toFixed(2),
    seed: $e,
    look: wt.name,
    mode: z.mode,
    shot: z.mode === "director" ? cn[z.shot].name : null,
    follow: Ct ? he[Ct.o?.type ?? 0].name : null,
    picked: Yt ? Yt.id : null,
    blue: Yn,
    lanes: jo,
    tags: Ls,
    traffic: +D.traffic.toFixed(2),
    boxes: me.boxes,
    towers: me.towers,
    built: +me.builtIn.toFixed(1),
    calls: zt.info.render.drawCalls,
    tris: zt.info.render.triangles,
    cam: et.position.toArray().map((t) => +t.toFixed(1)),
    backend: _r ? "webgpu" : "webgl2",
    turbo: Bt.on,
    tk: +Bt.k.toFixed(2),
    kmh: mo(v.v),
    seat: Ze(),
    rib: xe.ni / 3,
    hover: Vt.on,
    door: +Vt.door.toFixed(3),
    anime: be.style,
    cabin: pe.visible,
    tex: zt.info.memory.textures,
    geo: zt.info.memory.geometries,
  })));
let br = null;
((window.__view = (t) => {
  if (((br = t || null), !t)) {
    _s = "";
    return;
  }
  const e = re(),
    n = {
      ao: nt(w(Le.getAONode().r), 1),
      gi: nt(aa(Q(Le.getGINode().rgb.mul(Pt.uGiK).mul(Pt.uExpo), 0, 1)), 1),
      occ: nt(w(ea.a), 1),
      alb: nt(aa(sd.rgb), 1),
      ink: nt(aa(Q(fd(nt(1)).rgb, 0, 1)), 1),
      nrm: nt(Ns.rgb, 1),
      vel: nt(Nu.sample(e).xy.mul(20).add(0.5), 0, 1),
      raw: nt(aa(Q(ea.rgb, 0, 1)), 1),
      mirror: nt(aa(Q(o1.sample(e).rgb.mul(2), 0, 1)), 1),
      mirdepth: nt(w(pt(0.99999, su.sample(e).r)), 1),
      mirdepth2: nt(w(su.sample(e).r.mul(-1).add(1).mul(30)), 1),
    }[t];
  return n ? ((Za.outputNode = n), (Za.needsUpdate = !0), !0) : !1;
}),
  (window.__proj = (t) => (
    Cn.set(t[0], t[1], t[2]).project(et),
    [
      (Cn.x * 0.5 + 0.5) * fn.clientWidth,
      (-Cn.y * 0.5 + 0.5) * fn.clientHeight,
      Cn.z,
    ]
  )));
