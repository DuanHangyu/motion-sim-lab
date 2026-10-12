import * as i from "three";
import { EffectComposer as Jn } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass as ea } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass as ta } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as oa } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass as na } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass as aa } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment as ra } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries as sa } from "three/addons/utils/BufferGeometryUtils.js";
const h = (e) => document.querySelector(e),
  bo = (e) => [...document.querySelectorAll(e)],
  xe = Math.PI * 2;
let fe = {};
try {
  fe = JSON.parse(h("#tf-data").textContent);
} catch {}
const Pe = fe.labs || [],
  Re = fe.logos || {},
  Et = fe.rasters || {},
  Ct = fe.marks || {},
  xo = Object.fromEntries(Pe.map((e) => [e.lab, e])),
  So = (e) => Math.min(1, Math.max(0, e)),
  Tt = (e) => (e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4),
  ia = (e) => (e <= 0.0031308 ? e * 12.92 : 1.055 * e ** (1 / 2.4) - 0.055);
function vo(e) {
  const t = parseInt(e.slice(1), 16),
    o = Tt(((t >> 16) & 255) / 255),
    n = Tt(((t >> 8) & 255) / 255),
    a = Tt((t & 255) / 255),
    r = Math.cbrt(0.4122214708 * o + 0.5363325363 * n + 0.0514459929 * a),
    s = Math.cbrt(0.2119034982 * o + 0.6806995451 * n + 0.1073969566 * a),
    l = Math.cbrt(0.0883024619 * o + 0.2817188376 * n + 0.6299787005 * a),
    u = 1.9779984951 * r - 2.428592205 * s + 0.4505937099 * l,
    d = 0.0259040371 * r + 0.7827717662 * s - 0.808675766 * l;
  return {
    L: 0.2104542553 * r + 0.793617785 * s - 0.0040720468 * l,
    C: Math.hypot(u, d),
    H: ((Math.atan2(d, u) * 180) / Math.PI + 360) % 360,
  };
}
function ko(e, t, o) {
  const n = (o * Math.PI) / 180,
    a = Math.cos(n) * t,
    r = Math.sin(n) * t,
    s = (e + 0.3963377774 * a + 0.2158037573 * r) ** 3,
    l = (e - 0.1055613458 * a - 0.0638541728 * r) ** 3,
    u = (e - 0.0894841775 * a - 1.291485548 * r) ** 3;
  return (
    "#" +
    [
      4.0767416621 * s - 3.3077115913 * l + 0.2309699292 * u,
      -1.2684380046 * s + 2.6097574011 * l - 0.3413193965 * u,
      -0.0041960863 * s - 0.7034186147 * l + 1.707614701 * u,
    ]
      .map((d) =>
        Math.round(So(ia(So(d))) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
const Io = 0.8,
  Ao = 0.118,
  ca = 0.76,
  la = 0.85,
  ua = 0.04,
  Eo = 34,
  fa = 0.86,
  da = { color: "#d9e0ea", body: "#343941", token: "#e8edf4", glow: 0.5 },
  Pt = [178, 61, 272, 142, 25, 320],
  pa = {
    Anthropic: "Claude",
    "Z.AI": "Z.ai",
    SpaceXAI: "Grok",
    Google: "Gemini",
    Alibaba: "Qwen",
    "Moonshot AI": "Kimi",
    Xiaomi: "MiMo",
    Meta: "Llama",
    Microsoft: "Phi",
    NVIDIA: "Nemotron",
    Tencent: "Hunyuan",
    Baidu: "ERNIE",
    ByteDance: "Seed",
    OpenBMB: "MiniCPM",
    InclusionAI: "Ling",
    Cohere: "Command",
    AI21: "Jamba",
    LiquidAI: "LFM",
    IBM: "Granite",
    Perplexity: "Sonar",
    Inception: "Mercury",
  },
  ha = [180, 150, 220, 280],
  Co = (e, t) => Math.abs(((e - t + 540) % 360) - 180);
function ma(e, t) {
  const o = (n) => t.every((a) => Co(n, a) >= Eo);
  if (o(e)) return e;
  for (let n = 2; n <= 180; n += 2)
    for (const a of [(e + n) % 360, (e - n + 360) % 360]) if (o(a)) return a;
  return e;
}
function ga(e, t, o) {
  const n = /^#[0-9a-f]{6}$/i.test(e.brand || "") ? vo(e.brand) : null,
    a = !n || n.C < ua;
  if (a && !o.graphite) return ((o.graphite = !0), { ...da });
  const r = a
      ? (Pt.find((l) => o.every((u) => Co(l, u) >= Eo)) ?? Pt[t % Pt.length])
      : n.H,
    s = ma(r, o);
  return (o.push(s), { color: ko(Io, Ao, s), body: ko(Io * ca, Ao * la, s) });
}
function wa() {
  const e = [],
    t = [];
  for (const o of [...Pe]
    .filter((n) => n.intel > 0)
    .sort((n, a) => a.intel - n.intel)) {
    if (t.length === 4) break;
    const n = ga(o, t.length, e),
      a = vo(n.token || n.color).L > fa;
    t.push({
      name: pa[o.lab] || o.lab,
      lab: o.lab,
      ...n,
      ...(a ? { mark: "#23272e", glow: n.glow ?? 0.5 } : {}),
      pace: ha[t.length],
      data: o,
    });
  }
  return t;
}
const B = wa(),
  Xe = Object.fromEntries(B.map((e) => [e.lab, e]));
let Q = 0,
  we = !0,
  J = matchMedia("(prefers-reduced-motion: reduce)").matches,
  ee = !0,
  Se = "score",
  De = 1e3,
  Rt = !1;
const To = { 1e3: "1K", 1e5: "100K", 1e6: "1M" },
  Le = (e) =>
    e == null
      ? "\u2014"
      : "$" +
        (e >= 100
          ? e.toFixed(0)
          : e >= 1
            ? e.toFixed(2)
            : e >= 0.01
              ? e.toFixed(3)
              : e.toPrecision(2)),
  Dt = (e) =>
    e == null
      ? "\u2014"
      : e >= 1e6
        ? `${+(e / 1e6).toFixed(2)}M`
        : `${Math.round(e / 1e3)}K`,
  ya = (e) =>
    e == null
      ? "\u2014"
      : e >= 100
        ? Math.round(e).toLocaleString("en")
        : e >= 10
          ? e.toFixed(1)
          : e.toFixed(2),
  Lt = (e) => (e.blended * De) / 1e6,
  Ma = {
    value: {
      title: () => "Intelligence per dollar",
      note: "Intelligence Index \xF7 blended price per 1M tokens",
      get: (e) => e.value,
      show: (e) => ya(e.value),
    },
    price: {
      title: () => `Cost of ${To[De]} tokens`,
      note: "Blended 3:1 input to output, OpenRouter list price",
      get: (e) => e.blended,
      low: !0,
      show: (e) => Le(Lt(e)),
    },
    speed: {
      title: () => "Output speed",
      note: "Tokens per second, median across OpenRouter providers",
      get: (e) => e.speed,
      show: (e) => (e.speed == null ? "\u2014" : `${e.speed} t/s`),
    },
    context: {
      title: () => "Context window",
      note: "Largest window OpenRouter serves",
      get: (e) => e.ctx,
      show: (e) => Dt(e.ctx),
    },
    score: {
      title: () => "Intelligence Index",
      note: "Artificial Analysis, via OpenRouter",
      get: (e) => e.intel,
      show: (e) => e.intel.toFixed(1),
    },
  };
function Po(e) {
  const t = e.data,
    o = To[De];
  if (!t) return ["\u2014", "NO DATA", ""];
  const n = t.speed == null ? "SPEED \u2014" : `SPEED ${t.speed} t/s`;
  switch (Se) {
    case "speed":
      return [
        t.speed == null ? "\u2014" : `${t.speed} t/s`,
        "TOKENS PER SECOND",
        "FASTER IS BETTER",
      ];
    case "context":
      return [Dt(t.ctx), "CONTEXT WINDOW", "ROOM TO THINK"];
    case "score":
      return [t.intel.toFixed(1), "INTELLIGENCE INDEX", "ARTIFICIAL ANALYSIS"];
    case "price":
      return [Le(Lt(t)), `per ${o} tokens`, "LOWER IS BETTER"];
    default:
      return [Le(Lt(t)), `per ${o} tokens`, n];
  }
}
const Ot = 22,
  Ro = 5.25,
  ba = 0.52,
  Do = 12;
function xa(e, t, o) {
  const n = (((e + t) % Ot) + Ot) % Ot;
  let a, r;
  if (n < 5) {
    const k = n / 5;
    ((a = -52 + (o + 52) * (1 - (1 - k) ** 2)), (r = "arriving"));
  } else if (n < 12) ((a = o), (r = "loading"));
  else if (n < 17) {
    const k = (n - 12) / 5;
    ((a = o + (52 - o) * k * k), (r = "departing"));
  } else ((a = 52), (r = "away"));
  const s = Math.max(0, (n - Ro) / ba),
    l = Math.floor(s),
    u = s - l,
    d = Math.min(Do, l + (u >= 0.7 ? 1 : 0));
  return {
    x: a,
    stage: r,
    loaded: d,
    transferIndex: l,
    transfer: u,
    transferring: n >= Ro && s < Do,
    visible: r !== "away",
  };
}
const Lo = (e) => ({
  x: -1.85 + (e % 3) * 0.86,
  y: 1.17 + Math.floor(e / 6) * 0.68,
  z: Math.floor(e / 3) % 2 ? 0.4 : -0.4,
});
let $t = 427;
const O = () => (($t = ($t * 1664525 + 1013904223) >>> 0), $t / 4294967296),
  f = new i.Scene();
((f.background = new i.Color("#a5cbe8")),
  (f.fog = new i.Fog("#a5cbe8", 75, 190)));
const S = {
    bloom: !0,
    bloomStrength: 0.35,
    bloomRadius: 0.09,
    bloomThreshold: 1.02,
    sat: 1.2,
    gtao: !0,
    gtaoIntensity: 0.95,
    gtaoRadius: 1.1,
    gtaoThickness: 1.4,
    dof: !0,
    dofAperture: 1e-4,
    dofMaxBlur: 0.036,
    dofFocusDistance: 43,
    dofAutoFocus: !0,
    reflect: !0,
    reflectStrength: 0.15,
    fov: 35,
    exposure: 0.7,
    orbitSpeed: 0.32,
  },
  Oe = { ...S };
let P;
try {
  P = new i.WebGLRenderer({
    antialias: !0,
    powerPreference: "high-performance",
  });
} catch (e) {
  throw (
    document.body.classList.remove("booting"),
    (h("#error").hidden = !1),
    (h("#loading").hidden = !0),
    e
  );
}
const Ze = Math.min(2, Math.max(1, devicePixelRatio));
(P.setPixelRatio(Ze),
  P.setSize(innerWidth, innerHeight),
  (P.shadowMap.enabled = !0),
  (P.shadowMap.type = i.PCFSoftShadowMap),
  (P.shadowMap.autoUpdate = !1),
  (P.toneMapping = i.ACESFilmicToneMapping),
  (P.toneMappingExposure = S.exposure),
  h("#world").appendChild(P.domElement));
const A = new i.PerspectiveCamera(35, innerWidth / innerHeight, 0.5, 240),
  Oo = new i.Vector3(17, 20.5, 41),
  $o = new i.Vector3(-4, 2.8, 2);
A.position.copy(Oo);
const Qe = innerWidth < 800,
  _o = new i.Vector3(26, 24, 46),
  Fo = new i.Vector3(-2, 15, 0),
  j = (e, t, o) => Math.min(o, Math.max(t, e)),
  Vo = Math.PI / 2 - Math.PI * (Qe ? 0.49 : 0.47),
  No = Math.PI / 2 - 0.2,
  Go = 22,
  zo = 87,
  b = { t: $o.clone(), yaw: 0, pitch: 0, dist: 0 },
  $e = new i.Vector3(),
  Uo = new i.Vector3(NaN, NaN, NaN);
function Bo(e) {
  $e.subVectors(e, b.t);
  const t = Math.max(1e-4, $e.length());
  ((b.dist = j(t, Go, zo)),
    (b.pitch = j(Math.asin(j($e.y / t, -1, 1)), Vo, No)),
    (b.yaw = Math.atan2($e.x, $e.z)));
}
function qo() {
  const e = Math.cos(b.pitch);
  (A.position.set(
    b.t.x + Math.sin(b.yaw) * e * b.dist,
    b.t.y + Math.sin(b.pitch) * b.dist,
    b.t.z + Math.cos(b.yaw) * e * b.dist,
  ),
    A.lookAt(b.t),
    Uo.copy(A.position));
}
const G = {
  target: b.t,
  enabled: !0,
  enableDamping: !1,
  autoRotate: !1,
  autoRotateSpeed: S.orbitSpeed,
  update(e = 1 / 60) {
    (A.position.equals(Uo) || Bo(A.position),
      this.autoRotate &&
        !K &&
        (b.yaw -= e * ((Math.PI * 2) / 60) * this.autoRotateSpeed),
      qo());
  },
};
(Bo(A.position), qo());
const Je = [
  {
    name: "Overview",
    position: Qe ? _o.clone() : Oo.clone(),
    target: Qe ? Fo.clone() : $o.clone(),
  },
  {
    name: "Line-up",
    position: new i.Vector3(0, 14, 43),
    target: new i.Vector3(0, 3, 1),
  },
  {
    name: "Dispatch",
    position: new i.Vector3(38, 11, 24),
    target: new i.Vector3(5, 3, 9),
  },
  {
    name: "High left",
    position: new i.Vector3(-30, 30, 17),
    target: new i.Vector3(-1, 1.5, 2),
  },
  {
    name: "Close-up",
    position: new i.Vector3(8, 10, 26),
    target: new i.Vector3(6, 3, 3),
  },
];
let de = 0,
  K = null;
f.add(new i.HemisphereLight("#d8edff", "#77745f", 1.15));
const H = new i.DirectionalLight("#fff0d8", 3.8);
(H.position.set(-25, 40, 20),
  (H.castShadow = !0),
  H.shadow.mapSize.set(3072, 3072),
  (H.shadow.camera.left = -40),
  (H.shadow.camera.right = 40),
  (H.shadow.camera.top = 35),
  (H.shadow.camera.bottom = -35),
  (H.shadow.camera.far = 115),
  (H.shadow.normalBias = 0.055),
  (H.shadow.bias = -1e-4),
  (H.shadow.radius = 3),
  f.add(H),
  H.target.position.set(0, 0, 0),
  f.add(H.target));
const Ho = new i.PMREMGenerator(P),
  Wo = new ra();
((f.environment = Ho.fromScene(Wo, 0.08).texture),
  (f.environmentIntensity = 0.9),
  Wo.dispose(),
  Ho.dispose());
let jo = !1;
const Ko = Promise.all([
  document.fonts.load("800 100px Outfit"),
  document.fonts.load("500 100px Outfit"),
])
  .then(() => {
    jo = !0;
  })
  .catch(() => {});
await Promise.race([Ko, new Promise((e) => setTimeout(e, 1200))]);
const _t = new Map();
function w(e, t = 0, o = 0.65, n = 0) {
  const a = [e, t, o, n].join();
  return (
    _t.has(a) ||
      _t.set(
        a,
        new i.MeshStandardMaterial({
          color: e,
          metalness: t,
          roughness: o,
          emissive: e,
          emissiveIntensity: n,
        }),
      ),
    _t.get(a)
  );
}
const M = w("#c5d1d4", 0.87, 0.19),
  E = w("#24353c", 0.4, 0.45),
  Ft = w("#1a2429", 0.1, 0.85),
  $ = w("#e4e5dc", 0.23, 0.35),
  Y = w("#edbb51", 0.4, 0.45),
  ye = w("#c6c7bc", 0.03, 0.9),
  Vt = ka(),
  Yo = new i.BoxGeometry(1, 1, 1),
  Sa = new i.CylinderGeometry(1, 1, 1, 16),
  Xo = new i.SphereGeometry(1, 12, 8),
  Nt = new Map(),
  _e = (e, t) => (Nt.has(e) || Nt.set(e, t()), Nt.get(e)),
  et = (e) => _e("cone" + e, () => new i.ConeGeometry(1, 1, e, 1)),
  va = (e) => _e("circle" + e, () => new i.CircleGeometry(1, e)),
  Gt = (e, t) => _e(`plane${e}:${t}`, () => new i.PlaneGeometry(e, t)),
  oe = new i.Shape();
(oe.moveTo(-0.44, -0.5),
  oe.lineTo(0.44, -0.5),
  oe.quadraticCurveTo(0.5, -0.5, 0.5, -0.44),
  oe.lineTo(0.5, 0.44),
  oe.quadraticCurveTo(0.5, 0.5, 0.44, 0.5),
  oe.lineTo(-0.44, 0.5),
  oe.quadraticCurveTo(-0.5, 0.5, -0.5, 0.44),
  oe.lineTo(-0.5, -0.44),
  oe.quadraticCurveTo(-0.5, -0.5, -0.44, -0.5));
const zt = new i.ExtrudeGeometry(oe, {
  depth: 0.91,
  bevelEnabled: !0,
  bevelSegments: 2,
  steps: 1,
  bevelSize: 0.035,
  bevelThickness: 0.045,
  curveSegments: 3,
});
zt.translate(0, 0, -0.455);
function ka() {
  const e = Fe(256, 256, (t, o, n) => {
    const a = t.createLinearGradient(0, 0, 0, n);
    (a.addColorStop(0, "#3d6a80"),
      a.addColorStop(0.55, "#1d3a4a"),
      a.addColorStop(1, "#132833"),
      (t.fillStyle = a),
      t.fillRect(0, 0, o, n),
      (t.globalCompositeOperation = "lighter"));
    for (const [r, s, l] of [
      [0.18, 0.16, 0.32],
      [0.44, 0.06, 0.22],
      [0.72, 0.1, 0.12],
    ]) {
      const u = t.createLinearGradient(0, 0, o, 0);
      (u.addColorStop(0, "rgba(255,255,255,0)"),
        u.addColorStop(0.5, `rgba(220,240,255,${l})`),
        u.addColorStop(1, "rgba(255,255,255,0)"),
        t.save(),
        t.translate(r * o, 0),
        t.transform(1, 0, -0.55, 1, 0, 0),
        (t.fillStyle = u),
        t.fillRect(0, 0, s * o, n),
        t.restore());
    }
  });
  return (
    (e.wrapS = e.wrapT = i.RepeatWrapping),
    new i.MeshPhysicalMaterial({
      map: e,
      emissive: "#ffffff",
      emissiveMap: e,
      emissiveIntensity: 0.1,
      metalness: 0,
      roughness: 0.12,
      clearcoat: 0.5,
      clearcoatRoughness: 0.05,
      envMapIntensity: 0.22,
    })
  );
}
function q(e, t, o, n, a, r, s = 1, l = 1, u = 1) {
  const d = new i.Mesh(e, t);
  return (
    d.position.set(n, a, r),
    d.scale.set(s, l, u),
    (d.castShadow = !0),
    (d.receiveShadow = !0),
    o.add(d),
    d
  );
}
function c(e, t, o, n, a, r, s, l, u = !1) {
  return q(u ? zt : Yo, l, e, t, o, n, a, r, s);
}
function C(e, t, o, n, a, r, s) {
  return q(Sa, s, e, t, o, n, a, r, a);
}
function U(e, t, o, n, a, r) {
  return q(Xo, r, e, t, o, n, a, a, a);
}
function R(e, t = 0, o = 0, n = 0, a = !1) {
  const r = new i.Group();
  return (r.position.set(t, o, n), (r.userData.dynamic = a), e.add(r), r);
}
const Ut = new i.Vector3(0, 1, 0);
function V(e, t, o, n, a = M) {
  const r = new i.Vector3(...t),
    s = new i.Vector3(...o),
    l = s.clone().sub(r),
    u = C(
      e,
      ...r.clone().add(s).multiplyScalar(0.5).toArray(),
      n,
      l.length(),
      a,
    );
  return (u.quaternion.setFromUnitVectors(Ut, l.normalize()), u);
}
function ve(e, t, o = 0.17, n = M) {
  const a = new i.CatmullRomCurve3(
      t.map((s) => new i.Vector3(...s)),
      !1,
      "centripetal",
    ),
    r = new i.Mesh(new i.TubeGeometry(a, 40, o, 10, !1), n);
  (e.add(r), (r.castShadow = !0), (r.receiveShadow = !0));
  for (let s = 0; s < t.length - 1; s++) {
    const l = new i.Vector3(...t[s]),
      u = new i.Vector3(...t[s + 1]),
      d = u.clone().sub(l);
    if (d.length() > 0.8) {
      const k = l.clone().lerp(u, 0.5);
      C(e, ...k.toArray(), o * 1.35, 0.12, M).quaternion.setFromUnitVectors(
        Ut,
        d.normalize(),
      );
    }
  }
  return r;
}
function Fe(e, t, o) {
  const n = document.createElement("canvas");
  ((n.width = e), (n.height = t));
  const a = n.getContext("2d");
  o(a, e, t);
  const r = new i.CanvasTexture(n);
  return ((r.colorSpace = i.SRGBColorSpace), (r.anisotropy = 4), r);
}
function tt(e, t, o, n, a, r = "#fff") {
  (e.save(),
    e.translate(o - a / 2, n - a / 2),
    e.scale(a / 24, a / 24),
    (e.fillStyle = r));
  const s = Ct[t] || Re[t];
  if (s) e.fill(new Path2D(s));
  else {
    const l = t
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 2)
      .toUpperCase();
    ((e.font = `800 ${l.length > 1 ? 9.5 : 15}px Outfit, Arial`),
      (e.textAlign = "center"),
      (e.textBaseline = "middle"),
      e.fillText(l, 12, 12.5));
  }
  e.restore();
}
const ot = new Map();
function Ia(e, t = "#fff") {
  const o = e + t,
    n = t === "#fff";
  if (!ot.has(o)) {
    const a = new i.MeshStandardMaterial({
      map: Fe(512, 512, (r, s, l) => tt(r, e, s / 2, l / 2, 400, t)),
      transparent: !0,
      side: i.DoubleSide,
      roughness: 0.42,
      emissive: "#ffffff",
      emissiveIntensity: n ? 0.28 : 0,
      depthWrite: !1,
    });
    ((a.userData.mark = { lab: e, color: t }), ot.set(o, a));
  }
  return ot.get(o);
}
const nt = new Map();
function Aa(e) {
  if (nt.has(e)) return nt.get(e);
  const t = Ct[e] || Re[e] ? null : Et[e],
    o = Fe(512, 512, (a, r, s) => {
      t || tt(a, e, r / 2, s / 2, 400);
    }),
    n = new i.MeshStandardMaterial({
      map: o,
      transparent: !0,
      side: i.DoubleSide,
      roughness: 0.42,
      emissive: "#ffffff",
      emissiveMap: o,
      emissiveIntensity: 0.22,
      depthWrite: !1,
    });
  if (t) {
    const a = new Image();
    ((a.onload = () => {
      const r = o.image,
        s = r.getContext("2d"),
        l = Math.min(r.width / a.width, r.height / a.height) * 0.82,
        u = a.width * l,
        d = a.height * l;
      (s.clearRect(0, 0, r.width, r.height),
        s.drawImage(a, (r.width - u) / 2, (r.height - d) / 2, u, d),
        (o.needsUpdate = !0));
    }),
      (a.onerror = () => {
        (tt(o.image.getContext("2d"), e, 256, 256, 400), (o.needsUpdate = !0));
      }),
      (a.src = t));
  }
  return ((n.userData.drawnMark = !t), nt.set(e, n), n);
}
function Ea(e, t, o, n, a, r, s) {
  return q(Gt(a, r), Aa(s), e, t, o, n);
}
function Bt(e, t, o, n, { bg: a, color: r, size: s, bold: l }) {
  (a ? ((e.fillStyle = a), e.fillRect(0, 0, t, o)) : e.clearRect(0, 0, t, o),
    (e.textAlign = "center"),
    (e.textBaseline = "middle"),
    (e.fillStyle = r),
    (e.font = `${l ? 800 : 500} ${s}px Outfit, Arial`));
  const u = s * 1.16;
  n.forEach((d, k) =>
    e.fillText(d, t / 2, o / 2 + (k - (n.length - 1) / 2) * u, t - 50),
  );
}
const at = new Map(),
  Zo = new Map();
function W(
  e,
  t,
  o,
  n,
  a,
  r,
  s,
  {
    bg: l = null,
    color: u = "#202e39",
    size: d = 100,
    bold: k = !0,
    emissive: L = 0,
    unique: T = !1,
  } = {},
) {
  const z = { bg: l, color: u, size: d, bold: k },
    m = JSON.stringify([a, r, s, z]),
    v = () =>
      Fe(1024, Math.round((1024 * r) / a), (ue, kt, It) =>
        Bt(ue, kt, It, s, z),
      );
  let F;
  if (
    (T ? (F = null) : (at.has(m) || at.set(m, v()), (F = Zo.get(m + L))), !F)
  ) {
    const ue = T ? v() : at.get(m);
    ((F = new i.MeshStandardMaterial({
      map: ue,
      transparent: !l,
      roughness: 0.7,
      emissive: "#ffffff",
      emissiveMap: ue,
      emissiveIntensity: L,
      depthWrite: !!l,
    })),
      T || Zo.set(m + L, F));
  }
  const ae = new i.Mesh(T ? new i.PlaneGeometry(a, r) : Gt(a, r), F);
  return (ae.position.set(t, o, n), (ae.userData.label = !0), e.add(ae), ae);
}
function Ca(e, t, o) {
  const n = e.material.map;
  (Bt(n.image.getContext("2d"), n.image.width, n.image.height, t, {
    bg: null,
    bold: !0,
    ...o,
  }),
    (n.needsUpdate = !0));
}
const qt = 0.26,
  Ht = new i.WebGLRenderTarget(1, 1, {
    type: i.HalfFloatType,
    generateMipmaps: !0,
    minFilter: i.LinearMipmapLinearFilter,
  }),
  Wt = {
    tReflect: { value: Ht.texture },
    uReflMatrix: { value: new i.Matrix4() },
    uReflStrength: { value: 0.15 },
  };
function Ta() {
  const e = new i.MeshStandardMaterial({
    color: "#68737e",
    metalness: 0.2,
    roughness: 0.3,
  });
  return (
    (e.onBeforeCompile = (t) => {
      (Object.assign(t.uniforms, Wt),
        (t.vertexShader = t.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
uniform mat4 uReflMatrix;
varying vec4 vReflCoord;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
vReflCoord = uReflMatrix * modelMatrix * vec4( transformed, 1.0 );`,
          )),
        (t.fragmentShader = t.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
uniform sampler2D tReflect;
uniform float uReflStrength;
varying vec4 vReflCoord;`,
          )
          .replace(
            "#include <opaque_fragment>",
            `
        vec3 roadUp = inverseTransformDirection( normal, viewMatrix );
        float facing = saturate( dot( normal, normalize( vViewPosition ) ) );
        vec3 mirrored = texture2D( tReflect, vReflCoord.xy / vReflCoord.w, 2.2 ).rgb;
        outgoingLight = mix( outgoingLight, mirrored, step( .5, roadUp.y ) * uReflStrength * ( .3 + .7 * pow( 1. - facing, 3. ) ) );
        #include <opaque_fragment>`,
          )));
    }),
    e
  );
}
(c(f, 0, -0.7, 0, 220, 1, 220, w("#8ba077", 0, 1)),
  c(f, 0, -0.24, 1, 39, 0.65, 34, ye, !0),
  c(f, 0, 0.12, 1, 38, 0.16, 33, w("#afb8ba", 0.19, 0.38)));
const Pa = c(f, 0, 0.2, 18.8, 110, 0.12, 9, Ta());
for (let e = -50; e < 52; e += 4) c(f, e, 0.275, 17.8, 2, 0.015, 0.1, $);
for (const e of [14.45, 23.15])
  (c(f, 0, 0.27, e, 110, 0.025, 0.1, Y),
    c(f, 0, 0.05, e + (e > 18 ? 0.4 : -0.4), 110, 0.4, 0.32, ye));
for (let e = -17; e < 18; e += 3)
  (c(f, e, 0.23, 12, 1.5, 0.025, 0.07, $),
    c(f, e, 0.23, -9, 1.5, 0.025, 0.08, $));
const Ra = w("#68abc4", 0.48, 0.22);
c(f, -10, -0.15, -35, 135, 0.2, 30, Ra);
for (let e = 0; e < 75; e++)
  c(
    f,
    O() * 100 - 60,
    -0.035,
    -22 - O() * 27,
    1 + O() * 5,
    0.018,
    0.025,
    w("#a7d9e3", 0.3, 0.4),
  );
const Da = w("#8fabad", 0.42, 0.17);
for (const [e, t, o, n] of [
  [-14, 7, 1.1, 2.2],
  [-4, 11, 1.2, 0.5],
  [5, 14, 1.4, 0.5],
  [13, 4, 0.65, 1.8],
  [-10, 20, 2, 0.4],
]) {
  const a = q(va(11), Da, f, e, 0.291, t, o, n, 1);
  ((a.rotation.x = -Math.PI / 2), (a.receiveShadow = !0));
}
for (let e = 0; e < 24; e++) {
  const t = e * 8 - 94,
    o = 8 + O() * 12,
    n = -65 - O() * 18,
    a = 7 + O() * 7;
  (q(
    et(5),
    w(e % 2 ? "#95afc7" : "#809db8", 0, 1),
    f,
    t,
    o / 2 - 1,
    n,
    a,
    o,
    a,
  ),
    q(et(5), w("#cbd7df", 0, 1), f, t, o * 0.865 - 1, n, 2.3, o * 0.27, 2.3));
}
const Qo = ["#689648", "#7da34c", "#477e54", "#93ae56"].map((e) =>
  w(e, 0, 0.95),
);
function Jo(e, t, o = 1) {
  C(f, e, o * 0.65, t, 0.13 * o, 1.6 * o, w("#806e51"));
  for (let n = 0; n < 3; n++) {
    const a = (1.1 - n * 0.2) * o;
    q(
      et(6),
      Qo[Math.floor(O() * 4)],
      f,
      e,
      (1.6 + n * 0.7) * o,
      t,
      a,
      1.75 * o,
      a,
    );
  }
}
const La = (e) => e > 13.5 && e < 24.8;
for (let e = 0; e < 125; e++) {
  const t = O() * 120 - 60,
    o = O() * 100 - 60;
  (Math.abs(t) > 21 || o < -17 || o > 23) &&
    !(o < -20 && o > -49) &&
    !La(o) &&
    Jo(t, o, 0.65 + O() * 1.35);
}
for (const [e, t, o] of [
  [-19, 11, 1.4],
  [19, 11, 1.3],
  [-21, -4, 1.7],
  [21, 0, 1.4],
  [-16, -15, 1.3],
  [17, -15, 1.2],
  [-13, 28, 1.5],
  [6, 27, 1.5],
  [15, 28, 1.3],
])
  Jo(e, t, o);
for (let e = 0; e < 20; e++) {
  const t = R(f, O() * 140 - 70, 19 + O() * 14, -45 - O() * 50);
  for (let o = 0; o < 5; o++) {
    const n = U(
      t,
      (o - 2) * 1.7,
      O() * 0.8,
      O(),
      1.7 + O(),
      w("#f3f5f4", 0, 1),
    );
    ((n.scale.y *= 0.6), (n.castShadow = !1));
  }
}
function Oa(e, t, o, n, a) {
  (V(e, [t - 0.24, o - a / 2, n], [t - 0.24, o + a / 2, n], 0.045),
    V(e, [t + 0.24, o - a / 2, n], [t + 0.24, o + a / 2, n], 0.045));
  for (let r = o - a / 2; r <= o + a / 2; r += 0.36)
    V(e, [t - 0.24, r, n], [t + 0.24, r, n], 0.04);
}
function jt(e, t, o, n, a) {
  const r = R(f, e, 0, t);
  C(r, 0, n / 2 + 0.3, 0, o, n, $);
  const s = U(r, 0, n + 0.3, 0, o, $);
  s.scale.y = 0.2;
  const l = new i.TorusGeometry(o + 0.015, 0.055, 6, 48);
  for (const u of [0.8, n * 0.5, n - 0.1]) {
    const d = new i.Mesh(l, M);
    ((d.rotation.x = Math.PI / 2), (d.position.y = u), r.add(d));
  }
  for (let u = 0; u < 6; u++) {
    const d = (u * xe) / 6;
    C(r, Math.sin(d) * o * 0.7, 0.35, Math.cos(d) * o * 0.7, 0.16, 0.7, M);
  }
  (W(r, 0, n * 0.66, o + 0.02, o * 1.6, n * 0.45, a, { size: 130 }),
    Oa(r, -o * 0.8, n / 2 + 0.5, o * 0.65, n));
  for (let u = 0; u < 12; u++) {
    const d = (u * xe) / 12;
    V(
      r,
      [Math.sin(d) * o * 0.8, n + 0.48, Math.cos(d) * o * 0.8],
      [Math.sin(d) * o * 0.8, n + 1.03, Math.cos(d) * o * 0.8],
      0.035,
      Y,
    );
  }
  return (
    ve(
      r,
      [
        [-o, 2.4, 0],
        [-o - 1, 2.4, 0],
        [-o - 1, 5, 0],
        [-o - 1, n + 1, 0],
        [-o * 0.3, n + 1, 0],
      ],
      0.19,
    ),
    r
  );
}
(jt(-12, -9, 2.7, 8.6, ["PROMPTS", "IN"]),
  jt(6, -10, 2.6, 7.5, ["INTELLIGENCE", "OUT"]),
  jt(17, -7, 2.3, 6.3, ["OPEN", "MODELS", "STRONGER", "TOGETHER"]));
for (let e = 0; e < 4; e++)
  ve(
    f,
    [
      [-17, 0.8 + e * 0.65, -6],
      [-17, 3 + e * 0.65, -7],
      [-17, 3 + e * 0.65, -14],
      [18, 3 + e * 0.65, -14],
      [18, 1, -11],
    ],
    0.14,
    e % 2 ? M : w("#589daa", 0.5, 0.4),
  );
for (let e = -15; e <= 18; e += 6)
  (V(f, [e, 0, -14], [e, 6, -14], 0.14, $),
    V(f, [e - 0.7, 5.5, -14], [e + 0.7, 5.5, -14], 0.1, M));
for (let e = 0; e < 3; e++) {
  const t = R(f, -3 + e * 1.3, 0, -10);
  C(t, 0, 4.8, 0, 0.4, 9.6, M);
  for (let o = 1; o < 10; o += 1.1) C(t, 0, o, 0, 0.45, 0.09, Y);
  C(t, 0, 9.8, 0, 0.56, 0.28, M);
}
const pe = R(f, 10, 0, -17);
for (const e of [-5, 5])
  (c(pe, e, 4.8, 0, 0.42, 9.6, 0.48, $), c(pe, e, 0.25, 0, 1.8, 0.5, 1.5, ye));
(c(pe, 0, 10.5, 0, 15.2, 5.6, 0.5, M, !0),
  c(pe, 0, 10.5, 0.31, 14.8, 5.2, 0.1, E),
  W(
    pe,
    -2.1,
    11.85,
    0.38,
    9.6,
    2.3,
    ["MORE INTELLIGENCE", "A BRIGHTER TOMORROW"],
    { color: "#84d9f4", size: 93, emissive: 0.55 },
  ),
  q(
    new i.IcosahedronGeometry(1.85, 2),
    w("#70c6ef", 0.15, 0.6, 0.2),
    pe,
    5,
    10.7,
    0.65,
  ));
for (let e = 0; e < 38; e++) {
  const t = O() * xe,
    o = Math.acos(O() * 2 - 1),
    n = 1.87;
  c(
    pe,
    5 + Math.sin(o) * Math.cos(t) * n,
    10.7 + Math.cos(o) * n,
    0.65 + Math.sin(o) * Math.sin(t) * n,
    0.42,
    0.37,
    0.28,
    w("#75b75a", 0, 0.9),
  ).lookAt(5, 10.7, 0.65);
}
const en = "https://x.com/RyanSael",
  rt = [];
{
  const e = W(pe, -2.1, 9.45, 0.38, 9.6, 1.9, ["SAEL.NET"], {
    color: "#ffd28a",
    size: 150,
    emissive: 0.85,
    unique: !0,
  });
  ((e.userData.link = "https://sael.net/"),
    (e.userData.glow = [0.85, 1.7]),
    rt.push(e));
}
const tn = [],
  Kt = [],
  on = [],
  nn = [],
  an = [],
  rn = [],
  sn = [],
  Yt = B.map(() => []);
function st(e, t) {
  const o = R(e, 0, 0, 0, !0);
  return (Yt[t].push(o), o);
}
function cn(e, t, o, n, a, r, s, l = "#88e2dd") {
  (c(e, t, o, n, a + 0.13, r + 0.13, 0.14, E, !0),
    W(e, t, o, n + 0.08, a, r, s, {
      bg: "#17353a",
      color: l,
      size: 100,
      emissive: 0.25,
    }));
}
function ln(e, t, o) {
  const n = R(f, e, 0, t);
  (c(n, 0, 0.7, 0, 1.2, 1.4, 1.1, $, !0),
    c(n, 0, 0.65, 0.57, 1.05, 1.17, 0.05, M),
    cn(n, -0.13, 0.99, 0.63, 0.47, 0.34, ["SYSTEM", "ONLINE"]),
    c(n, 0.38, 0.72, 0.69, 0.045, 0.35, 0.06, E));
  for (let a = 0; a < 4; a++)
    c(n, -0.22, 0.23 + a * 0.08, 0.62, 0.45, 0.025, 0.025, E);
  C(n, 0, 1.49, 0, 0.09, 0.18, o);
  for (let a = 0; a < 2; a++)
    ve(
      n,
      [
        [0.4 + a * 0.13, 1.4, 0],
        [0.4 + a * 0.13, 1.7, 0],
        [0.65 + a * 0.2, 1.8, -0.2],
        [0.8 + a * 0.2, 0.1, -0.3],
      ],
      0.035,
      E,
    );
  return n;
}
function un(e, t, o, n) {
  const a = R(f, e, 0, t, !0);
  (c(a, 0, 0.2, 0, 0.95, 0.4, 0.95, E, !0), C(a, 0, 0.55, 0, 0.37, 0.4, M));
  const r = R(a, 0, 0.8, 0),
    s = R(r);
  U(s, 0, 0, 0, 0.27, E);
  const l = R(s);
  (c(l, 0, 0.66, 0, 0.32, 1.32, 0.4, o, !0),
    (C(l, 0, 0.66, 0.23, 0.08, 0.08, M).rotation.x = Math.PI / 2),
    U(l, 0, 1.32, 0, 0.26, $));
  const u = R(l, 0, 1.32, 0);
  (c(u, 0, 0.57, 0, 0.27, 1.14, 0.32, o, !0), U(u, 0, 1.14, 0, 0.2, E));
  const d = R(u, 0, 1.14, 0);
  c(d, 0, 0.18, 0, 0.36, 0.22, 0.35, M, !0);
  for (const k of [-1, 1])
    (c(d, k * 0.2, 0.35, 0, 0.07, 0.3, 0.09, E),
      c(d, k * 0.15, 0.49, 0, 0.16, 0.07, 0.09, M));
  return (on.push({ base: r, upper: l, fore: u, wrist: d, phase: n }), a);
}
const Xt = w("#e3b690", 0, 0.7),
  fn = w("#33485a", 0.05, 0.8),
  dn = w("#4d7290", 0.05, 0.72),
  $a = w("#ff8b21", 0.05, 0.55),
  _a = w("#f2f4ef", 0.55, 0.25, 0.3),
  pn = w("#ffc53a", 0.15, 0.32),
  hn = w("#2a2f33", 0.1, 0.8),
  Fa = w("#8a6a45", 0.1, 0.7),
  Zt = (e, t) =>
    _e(`capsule${e}:${t}`, () => new i.CapsuleGeometry(e, t, 3, 10)),
  Va = _e("dome", () => new i.SphereGeometry(1, 14, 6, 0, xe, 0, Math.PI / 2));
function Qt(e, t, o = 0, n = 0) {
  const a = R(f, e, 0.2, t);
  a.rotation.y = o;
  const r = [],
    s = [];
  for (const l of [-1, 1]) {
    const u = R(a, l * 0.09, 0.62, 0);
    (q(Zt(0.068, 0.4), fn, u, 0, -0.27, 0),
      c(u, 0, -0.57, 0.045, 0.14, 0.1, 0.26, hn, !0),
      r.push(u));
    const d = R(a, l * 0.215, 1.03, 0);
    ((d.rotation.z = l * 0.12),
      q(Zt(0.05, 0.3), dn, d, 0, -0.19, 0),
      U(d, 0, -0.41, 0, 0.058, Xt),
      s.push(d));
  }
  (q(Zt(0.15, 0.22), dn, a, 0, 0.9, 0, 1, 1, 0.74),
    c(a, 0, 0.9, 0, 0.36, 0.38, 0.25, $a, !0));
  for (const l of [0.8, 0.96]) c(a, 0, l, 0, 0.366, 0.032, 0.256, _a);
  (c(a, 0, 0.71, 0, 0.33, 0.06, 0.23, fn),
    C(a, 0, 1.12, 0, 0.05, 0.08, Xt),
    U(a, 0, 1.28, 0, 0.135, Xt));
  for (const l of [-1, 1]) U(a, l * 0.045, 1.29, 0.122, 0.016, hn);
  return (
    q(Va, pn, a, 0, 1.305, 0, 0.158, 0.135, 0.158),
    C(a, 0, 1.305, 0.025, 0.19, 0.02, pn),
    n === 1 &&
      (s[0].rotation.set(-0.95, 0, -0.25),
      c(s[0], 0, -0.42, 0.08, 0.26, 0.02, 0.34, Fa)),
    n === 2 && s[1].rotation.set(0, 0, 2.3),
    (a.userData.legs = r),
    (a.userData.arms = s),
    a
  );
}
function mn(e, t, o, n = 0.65) {
  (c(f, e, t + n / 2, o, n, n, n, w("#cba46c"), !0),
    c(f, e, t + n * 0.5, o + n * 0.506, n * 0.13, n, 0.01, w("#ead3a1")),
    W(f, e, t + n * 0.58, o + n * 0.513, n * 0.6, n * 0.35, ["\u2191\u2191"], {
      size: 180,
      color: "#655743",
    }));
}
const gn = (e) => ({ color: e.color, size: 114, emissive: 0.5 });
for (let e = 0; e < B.length; e++) {
  const t = B[e],
    o = -9 + e * 6,
    n = R(f, o, 0, -1);
  t.x = o;
  const a = new i.MeshPhysicalMaterial({
      color: t.body,
      metalness: 0.35,
      roughness: 0.28,
      clearcoat: 0.6,
      clearcoatRoughness: 0.22,
    }),
    r = w(t.color, 0.4, 0.24),
    s = w(t.color, 0.1, 0.2, 4.2);
  ((t.tokenMat = w(t.token || t.color, 0.22, 0.19, t.glow ?? 1.75)),
    c(n, 0, 0.35, 0, 5.35, 0.6, 5.6, ye, !0));
  const l = c(n, 0, 3.25, 0, 4.9, 5.3, 4.5, a, !0);
  ((l.userData.model = e),
    sn.push(l),
    c(n, 0, 5.94, 0, 4.7, 0.18, 4.3, M, !0),
    c(n, 0, 6.07, -0.2, 4.5, 0.14, 3.8, a));
  for (const m of [-1, 1]) c(n, m * 2.3, 3.2, 2.27, 0.12, 4.9, 0.13, M);
  (W(n, 0.42, 4.75, 2.315, 3.5, 1.08, [t.name], {
    size: 180,
    color: "#ffffff",
  }),
    Ea(n, -1.6, 4.76, 2.335, 1.04, 1.04, t.lab),
    c(n, 0, 2.18, 2.3, 2.92, 3.03, 0.17, M, !0),
    c(n, 0, 2.18, 2.41, 2.6, 2.72, 0.15, r, !0),
    c(n, 0, 2.18, 2.51, 2.28, 2.42, 0.07, Ft));
  for (const m of [-1, 1]) c(n, m * 1.22, 2.2, 2.56, 0.085, 2.55, 0.1, s);
  (c(n, 0, 3.48, 2.56, 2.5, 0.085, 0.1, s),
    c(n, 0, 2.23, 2.57, 1.95, 1.82, 0.025, w("#253c45")),
    W(n, 0, 2.75, 2.6, 1.3, 0.36, ["0101"], {
      color: t.color,
      size: 190,
      emissive: 0.8,
    }));
  for (let m = 0; m < 5; m++)
    c(n, 0, 1.4 + m * 0.21, 2.64, 1.9, 0.025, 0.02, E);
  for (const m of [-1, 1]) {
    for (let v = 0; v < 9; v++)
      c(n, m * 2.47, 3.1 + v * 0.18, -0.5, 0.035, 0.075, 2.4, E);
    for (let v = 0; v < 3; v++)
      ve(
        n,
        [
          [m * 2.48, 0.5, -1.1 + v * 0.55],
          [m * 2.77, 0.6, -1.1 + v * 0.55],
          [m * 2.77, 5.8, -1.1 + v * 0.55],
          [m * 2.5, 6.3, -1.1 + v * 0.55],
          [m * 1.5, 6.3, -1.1 + v * 0.55],
        ],
        0.075,
        M,
      );
    for (let v = 0; v < 6; v++) U(n, m * 2.3, 0.9 + v * 0.82, 2.36, 0.038, M);
  }
  for (let m = 0; m < 3; m++) {
    C(n, -1.1 + m * 0.95, 6.15, -0.9, 0.35, 0.16, E);
    const v = R(n, -1.1 + m * 0.95, 6.26, -0.9, !0);
    for (let F = 0; F < 4; F++) {
      const ae = c(v, 0, 0, 0, 0.59, 0.025, 0.1, M);
      ae.rotation.y = (F * Math.PI) / 4;
    }
    nn.push(v);
  }
  for (const m of [-1, 1]) V(n, [m * 1.6, 6, 1], [m * 1.6, 6.75, 1], 0.075, M);
  const u = R(n, 0, 7.28, 1);
  (c(u, 0, 0, 0, 3.55, 1.65, 0.3, r, !0),
    c(u, 0, 0, 0.17, 3.34, 1.43, 0.03, E, !0),
    (t.boardLabel = W(u, 0, 0, 0.195, 3.23, 1.33, Po(t), {
      ...gn(t),
      unique: !0,
    })),
    C(n, 1.9, 6.25, 1.5, 0.1, 0.3, M));
  const d = U(n, 1.9, 6.51, 1.5, 0.14, w("#ffd073", 0.1, 0.3, 1.6));
  ((d.userData.dynamic = !0), an.push(d));
  const k = new i.PointLight(t.color, 7.5, 7, 2);
  (k.position.set(o, 2.2, 2.1), f.add(k));
  const L = 7.5,
    T = 10.2;
  (c(f, o, 1, L, 2.52, 0.34, T, E, !0), c(f, o, 1.2, L, 2.24, 0.13, T, Ft));
  for (const m of [-1, 1]) {
    (c(f, o + m * 1.28, 1.19, L, 0.14, 0.23, T, M, !0),
      c(f, o + m * 1.31, 0.99, L, 0.06, 0.1, T, Y));
    for (let v = 0; v < 5; v++) {
      const F = 3.2 + v * 2.1;
      (V(f, [o + m * 1.05, 0.15, F], [o + m * 1.05, 1, F], 0.09, M),
        U(f, o + m * 1.38, 1.19, F, 0.055, M));
    }
  }
  for (let m = 0; m < 30; m++) Kt.push({ x: o, lane: e, offset: m * 0.34 });
  for (let m = 0; m < 9; m++) {
    const v = st(f, e);
    (v.position.set(o, 1.74, 2.4 + m * 1.15),
      tn.push({ g: v, lane: e, offset: m * 1.15 }));
  }
  (un(o - 2, 5.8, e === 1 ? Y : $, e * 1.2),
    un(o + 2, 10.2, $, e * 1.2 + 2),
    ln(o - 2.1, 9.1, r),
    ln(o + 2, 12.1, r));
  const z = Qt(o - 2.5, 11.2, -0.3);
  ((z.userData.dynamic = !0),
    rn.push({ g: z, x: o - 2.5, z: 8, phase: e * 1.3 }),
    Qt(o + 2.4, 7.2, -0.5, e % 2 ? 1 : 0),
    c(f, o, 1.8, 12.45, 2.58, 1.3, 0.62, a, !0),
    c(f, o, 1.64, 12.79, 1.75, 0.63, 0.025, E),
    W(f, o, 2.04, 12.79, 1.75, 0.28, ["DISPATCH"], {
      size: 120,
      color: "#ffffff",
    }),
    cn(f, o + 1.85, 2.65, 5.8, 0.42, 0.65, ["TOKENS", "ONLINE"]),
    V(f, [o + 1.85, 0.2, 5.7], [o + 1.85, 2.4, 5.7], 0.07, M),
    e < 3 &&
      (ve(
        f,
        [
          [o + 2.5, 4, 0],
          [o + 3.1, 4, 0],
          [o + 3.7, 4, 0],
        ],
        0.2,
        M,
      ),
      ve(
        f,
        [
          [o + 2.5, 2.6, 0],
          [o + 3, 2.6, 0],
          [o + 3.6, 2.6, 0],
        ],
        0.12,
        M,
      )));
  for (let m = 0; m < 7; m++)
    mn(o - 2 + O() * 3, 0, -5 - O() * 2.2, 0.55 + O() * 0.3);
}
function wn(e, t, o) {
  for (let n = e; n <= t; n += 1.7)
    (C(f, n, 0.6, o, 0.047, 1.2, Y), c(f, n, 0.12, o, 0.2, 0.2, 0.2, M));
  (V(f, [e, 1.12, o], [t, 1.12, o], 0.052, Y),
    V(f, [e, 0.65, o], [t, 0.65, o], 0.042, Y));
}
(wn(-17, 17, 14.2), wn(-17, 17, -16));
for (const e of [-17, 17]) {
  for (let t = -12; t < 13; t += 2) C(f, e, 0.6, t, 0.05, 1.2, Y);
  V(f, [e, 1.15, -12], [e, 1.15, 12], 0.05, Y);
}
for (let e = 0; e < 12; e++)
  mn(14 + O() * 2, Math.floor(e / 4) * 0.7, -10 + (e % 4) * 0.75, 0.7);
function yn(e, t, o, n = 1, a = !1) {
  const r = R(f, e, 0.25, t, !0);
  if (
    (r.scale.setScalar(n),
    (r.userData.wheels = []),
    c(r, 0, 0.55, 0, 5.6, 0.28, 1.95, E),
    a)
  ) {
    (c(r, -0.7, 0.77, 0, 3.85, 0.18, 1.95, M, !0),
      c(r, -0.7, 1.12, -0.98, 3.85, 0.64, 0.09, $, !0),
      c(r, -0.7, 0.92, 1, 3.85, 0.22, 0.09, $, !0));
    for (const s of [-2.57, 1.15]) c(r, s, 1.12, 0, 0.09, 0.64, 1.95, $, !0);
    ((W(r, -0.7, 1.13, -1.032, 3.4, 0.46, o, { size: 120 }).rotation.y =
      Math.PI),
      W(r, -0.7, 0.94, 1.061, 3.4, 0.22, ["TOKEN LOGISTICS"], { size: 58 }));
  } else c(r, -0.7, 1.65, 0, 3.8, 2, 1.95, $, !0);
  (c(r, 2, 1.23, 0, 1.55, 1.85, 1.87, $, !0),
    c(r, 2.65, 0.99, 0, 0.45, 1.1, 1.83, $, !0),
    c(r, 2.905, 0.93, 0, 0.03, 0.34, 1.05, E));
  for (const s of [-1, 1]) {
    (c(r, 2, 1.62, s * 0.951, 0.97, 0.62, 0.045, Vt, !0),
      c(r, 2.06, 1.04, s * 0.96, 0.22, 0.045, 0.035, M),
      c(r, 2.2, 1.58, s * 1.09, 0.18, 0.31, 0.12, M, !0),
      c(r, 2.9, 0.93, s * 0.69, 0.035, 0.22, 0.32, w("#fff8cd", 0, 0.3, 2.5)));
    for (const l of [-1.9, -0.8, 2]) {
      const u = R(r, l, 0.43, s * 1.02);
      ((C(u, 0, 0, 0, 0.45, 0.29, Ft).rotation.x = Math.PI / 2),
        (C(u, 0, 0, s * 0.16, 0.24, 0.04, M).rotation.x = Math.PI / 2));
      for (let d = 0; d < 5; d++) {
        const k = (d * xe) / 5;
        U(u, Math.sin(k) * 0.15, Math.cos(k) * 0.15, s * 0.19, 0.035, E);
      }
      r.userData.wheels.push(u);
    }
    a ||
      (W(r, -0.75, 1.7, s * 1.001, 3.25, 1.4, o, { size: 155 }).rotation.y =
        s === -1 ? Math.PI : 0);
  }
  if (
    (c(r, 2.842, 1.76, 0, 0.02, 0.66, 1.62, E),
    c(r, 2.86, 1.76, 0, 0.03, 0.56, 1.5, Vt),
    c(r, 1.62, 2.2, 0, 0.22, 0.12, 0.65, w("#ffbd4d", 0.1, 0.23, 2)),
    !a)
  ) {
    for (let s = 0; s < 10; s++)
      c(r, -2.5 + s * 0.37, 1.7, 1, 0.014, 1.79, 0.014, w("#bfc7c7"));
    for (const s of [-2.55, 1.15]) c(r, s, 1.65, 1.01, 0.045, 1.9, 0.05, M);
  }
  return r;
}
const Mn = [],
  bn = [],
  Jt = [];
function Na(e, t) {
  const o = R(f, 0, 0, 0, !0);
  (C(o, e, 0.48, t, 0.36, 0.9, E), C(o, e, 1.02, t, 0.29, 0.22, M));
  const n = c(o, 0, 0, 0, 0.24, 1, 0.24, Y, !0),
    a = c(o, 0, 0, 0, 0.18, 1, 0.18, $, !0),
    r = U(o, 0, 0, 0, 0.21, E),
    s = U(o, 0, 0, 0, 0.15, M);
  for (const u of [n, a, r, s]) u.userData.dynamic = !0;
  const l = R(o);
  for (const u of [-1, 1]) c(l, u * 0.23, -0.12, 0, 0.06, 0.33, 0.12, E, !0);
  return { g: o, x: e, z: t, upper: n, fore: a, elbow: r, end: s, grip: l };
}
for (let e = 0; e < 2; e++) {
  const t = e === 0 ? -6 : 7,
    o = e === 0 ? 16.7 : 19.4,
    n = Na(t - 2, 14);
  bn.push(n);
  for (let a = 0; a < 2; a++) {
    const r = e * 2 + a,
      s = B[r];
    c(f, s.x, 1.06, 13.2, 2.3, 0.2, 1.1, E, !0);
    for (const u of [-1, 1])
      c(f, s.x + u * 1.13, 1.27, 13.2, 0.07, 0.35, 1.1, M);
    const l = st(f, r);
    (l.position.set(s.x, 1.55, 13.1), l.scale.setScalar(0.82), (Jt[r] = l));
  }
  for (let a = 0; a < 2; a++) {
    const r = yn(-52, o, ["ANSWERS OUT"], 1, !0),
      s = [];
    for (let u = 0; u < 12; u++) {
      const d = Lo(u),
        k = st(r, e * 2 + (u % 2));
      (k.position.set(d.x, d.y, d.z), k.scale.setScalar(0.82), s.push(k));
    }
    const l = [0, 1].map((u) => {
      const d = st(f, e * 2 + u);
      return (d.scale.setScalar(0.82), (d.visible = !1), d);
    });
    Mn.push({
      vehicle: r,
      cargo: s,
      carried: l,
      offset: a * 11 + e * 3 + 5.5,
      dockX: t,
      roadZ: o,
      bay: e,
      loader: n,
    });
  }
}
const it = yn(0, 22, ["IDEAS", "IN \u2192"], 0.83);
((it.rotation.y = Math.PI), Qt(-15, 12.6, 0.4, 2));
{
  let z = function (y, I, x, p) {
      C(y, I, 0.4, x, 0.27, 0.8, p);
      for (const g of [0.26, 0.56]) C(y, I, g, x, 0.28, 0.035, p);
      C(y, I, 0.805, x, 0.2, 0.02, E);
    },
    m = function (y, I, x) {
      const p = T(y, I, t() * xe);
      for (let g = 0; g < x; g++)
        z(
          p,
          (g % 3) * 0.58 - 0.58,
          Math.floor(g / 3) * 0.58,
          k[Math.floor(t() * 3)],
        );
    },
    v = function (y, I, x = 0, p = 3) {
      const g = T(y, I, x);
      c(g, 0, 0.13, 0, 1, 0.05, 1, r);
      for (const D of [-0.4, 0, 0.4]) c(g, D, 0.05, 0, 0.14, 0.1, 1, r);
      for (let D = 0; D < p; D++) {
        const N = 0.38 + t() * 0.1,
          Ye = (D % 2) * 0.46 - 0.23,
          yo = (Math.floor(D / 2) % 2) * 0.46 - 0.23,
          Mo = 0.16 + (D >= 4 ? 0.45 : 0);
        (c(g, Ye, Mo + N / 2, yo, N, N, N, n, !0),
          c(g, Ye, Mo + N + 0.002, yo, N * 0.2, 0.005, N * 1.01, a));
      }
    },
    F = function (y, I) {
      const x = T(y, I);
      (c(x, 0, 0.02, 0, 0.36, 0.04, 0.36, u),
        q(et(12), s, x, 0, 0.27, 0, 0.15, 0.46, 0.15),
        C(x, 0, 0.3, 0, 0.1, 0.07, $));
    },
    ae = function (y, I, x) {
      const p = T(y, I, x);
      (c(p, 0, 0.5, 0, 0.85, 0.5, 1.2, l, !0),
        c(p, 0, 0.6, -0.62, 0.86, 0.55, 0.22, E, !0),
        c(p, 0, 0.85, -0.05, 0.4, 0.12, 0.4, u, !0),
        c(p, 0, 1.05, -0.2, 0.36, 0.35, 0.08, u, !0));
      for (const g of [-1, 1]) {
        for (const D of [-0.35, 0.3])
          V(p, [g * 0.38, 0.75, D], [g * 0.38, 1.85, D], 0.03, E);
        for (const D of [-0.42, 0.42])
          C(p, g * 0.45, 0.22, D, 0.22, 0.16, u).rotation.z = Math.PI / 2;
        (V(p, [g * 0.25, 0.15, 0.72], [g * 0.25, 2.1, 0.72], 0.045, M),
          c(p, g * 0.18, 0.06, 1.1, 0.1, 0.04, 0.8, M));
      }
      (c(p, 0, 1.87, -0.02, 0.82, 0.05, 0.74, l),
        c(p, 0, 0.75, 0.72, 0.6, 0.06, 0.06, M),
        v(y + Math.sin(x) * 1.1, I + Math.cos(x) * 1.1, x, 2));
    },
    ue = function (y, I, x, p, g) {
      const D = T(y, x, p);
      ((D.position.y += I), c(D, 0, 0.64, 0, 1.25, 1.28, 2.9, g));
      for (let N = 0; N < 12; N++)
        for (const Ye of [-1, 1])
          c(D, Ye * 0.635, 0.64, -1.32 + N * 0.24, 0.03, 1.18, 0.08, g);
      for (const N of [-1, 1])
        (c(D, N * 0.3, 0.64, 1.46, 0.04, 1.2, 0.03, E),
          c(D, 0, 0.64 + N * 0.6, 1.46, 1.25, 0.06, 0.04, M));
    },
    kt = function (y, I, x) {
      const p = T(y, I, x);
      for (const g of [-1, 1])
        C(p, g * 0.28, 0.48, 0, 0.46, 0.06, r).rotation.z = Math.PI / 2;
      C(p, 0, 0.48, 0, 0.24, 0.5, u).rotation.z = Math.PI / 2;
    },
    It = function (y, I, x) {
      const p = T(y, I, x);
      for (let g = 0; g < 4; g++)
        (C(p, -0.45 + g * 0.3, 0.5, 0, 0.12, 1, g % 2 ? k[2] : M),
          q(Xo, g % 2 ? k[2] : M, p, -0.45 + g * 0.3, 1, 0, 0.12, 0.09, 0.12));
      V(p, [-0.65, 0.7, 0.16], [0.65, 0.7, 0.16], 0.025, Y);
      for (const g of [-0.65, 0.65])
        V(p, [g, 0, 0.16], [g, 0.75, 0.16], 0.03, Y);
    },
    Xn = function (y, I, x = 0) {
      const p = T(y, I, x);
      (C(p, 0, 0.1, 0, 0.16, 0.2, ye),
        C(p, 0, 2.2, 0, 0.06, 4.2, E),
        V(p, [0, 4.2, 0], [0, 4.35, -0.9], 0.04, E),
        c(p, 0, 4.3, -1.05, 0.26, 0.1, 0.52, E, !0),
        c(p, 0, 4.24, -1.05, 0.2, 0.03, 0.42, d));
    },
    Zn = function (y, I, x = 0) {
      const p = T(y, I, x);
      (c(p, 0, 0.42, 0, 1.5, 0.06, 0.42, r),
        c(p, 0, 0.72, -0.2, 1.5, 0.3, 0.05, r));
      for (const g of [-0.62, 0.62]) c(p, g, 0.2, 0, 0.06, 0.42, 0.4, E);
    },
    wo = function (y, I, x = 1) {
      for (let p = 0; p < 3; p++) {
        const g = U(
          f,
          y + (p - 1) * 0.35 * x,
          o + 0.25 * x,
          I + (t() - 0.5) * 0.3,
          (0.32 + t() * 0.12) * x,
          Qo[p % 4],
        );
        g.scale.y *= 0.75;
      }
    },
    At = function (y, I, x, p) {
      const g = R(f, y, -0.05, I);
      ((g.rotation.y = x),
        c(g, 0, 0.2, 0, 1.3, 0.45, 3.4, p, !0),
        c(g, 0, 0.45, 0, 1.15, 0.06, 3.1, $),
        c(g, 0, 0.75, -0.3, 0.8, 0.55, 1, $, !0),
        c(g, 0, 0.8, 0.22, 0.72, 0.3, 0.04, Vt),
        V(g, [0, 1, -0.6], [0, 1.9, -0.6], 0.03, M));
    },
    Qn = function (y, I, x) {
      const p = T(y, I, x);
      for (const D of [-1, 1])
        V(p, [D * 0.7, 0, 0], [D * 0.7, 1.55, 0], 0.035, E);
      c(p, 0, 1.2, -0.01, 1.46, 0.56, 0.03, E);
      const g = W(p, 0, 1.2, 0.01, 1.4, 0.5, ["@RYANSAEL", "on X"], {
        bg: "#1c3a48",
        color: "#e9f1f4",
        size: 150,
        emissive: 0.12,
      });
      ((g.userData.link = en), rt.push(g));
    },
    e = 911;
  const t = () => ((e = (e * 1664525 + 1013904223) >>> 0), e / 4294967296),
    o = 0.2,
    n = w("#c99a5d", 0, 0.85),
    a = w("#e7cf9c", 0, 0.6),
    r = w("#a47b4f", 0, 0.9),
    s = w("#ff7a2a", 0.05, 0.5),
    l = w("#f2b632", 0.35, 0.35),
    u = w("#1d2226", 0, 0.9),
    d = w("#fff1c9", 0, 0.4, 0.9),
    k = [
      w("#3f6fa8", 0.45, 0.35),
      w("#c4493c", 0.45, 0.35),
      w("#4e8f64", 0.45, 0.35),
    ],
    L = [
      w("#2f7fa3", 0.3, 0.5),
      w("#c7643b", 0.3, 0.5),
      w("#e0e3de", 0.3, 0.5),
    ],
    T = (y, I, x = 0) => {
      const p = R(f, y, o, I);
      return ((p.rotation.y = x), p);
    };
  (ae(-14.6, 0.8, 0.5),
    v(-15.7, -2.4, 0.2, 5),
    v(-14.3, -2.9, -0.1, 3),
    m(-15.5, 4.2, 5),
    It(-16.2, 8.2, Math.PI / 2),
    F(-13.3, 10.4),
    F(-13.8, 11.1),
    ue(15.3, 0, 1.2, 0, L[0]),
    ue(15.3, 1.28, 1.35, 0.03, L[1]),
    ae(13.5, 6.2, -2.4),
    v(15.4, 5.4, 0.3, 4),
    v(15.3, 7.3, -0.2, 6),
    m(13.6, -3, 4),
    kt(15.6, 9.7, 0.4),
    F(13.2, 11.2),
    m(1.7, -10.4, 3),
    v(-1.8, -12.2, 0.4, 4),
    ue(-8.2, 0, -12.6, Math.PI / 2, L[2]));
  for (const y of [-10.8, -2.5, 3.2, 10.6]) F(y, 13.7);
  for (let y = -45; y <= 45; y += 10) Math.abs(y + 12) > 5 && Xn(y, 24.2);
  for (let y = -38; y <= 40; y += 10)
    Math.abs(y + 12) > 6 &&
      (Zn(y + 1.5, 24.6, Math.PI), wo(y - 1.8, 24.9, 0.9));
  for (const y of [-19.3, 19.3]) for (const I of [-12, -6, 4]) wo(y, I, 1);
  {
    const y = Fe(1024, 128, (p, g, D) => {
        ((p.fillStyle = "#f1f3f0"),
          (p.font = "800 84px Arial"),
          (p.textAlign = "center"),
          (p.textBaseline = "middle"),
          p.fillText("@RYANSAEL on X", g / 2, D / 2 + 4, g - 40),
          (p.globalCompositeOperation = "destination-out"));
        for (let N = 0; N < 1400; N++)
          ((p.fillStyle = `rgba(0,0,0,${0.25 + t() * 0.6})`),
            p.fillRect(t() * g, t() * D, 1 + t() * 5, 1 + t() * 2));
      }),
      I = new i.MeshStandardMaterial({
        map: y,
        transparent: !0,
        opacity: 0.42,
        roughness: 0.6,
        depthWrite: !1,
        polygonOffset: !0,
        polygonOffsetFactor: -2,
      }),
      x = new i.Mesh(new i.PlaneGeometry(6.4, 0.8), I);
    ((x.rotation.x = -Math.PI / 2),
      x.position.set(B[2].x, qt + 0.004, 15.1),
      (x.userData.label = x.userData.roadPaint = !0),
      (x.userData.link = en),
      rt.push(x),
      f.add(x));
  }
  (Qn(16.2, 11.6, -0.35),
    At(-38, -31, 0.4, L[1]),
    At(24, -40, -1.2, L[0]),
    At(-6, -45, 1.9, w("#e25b4b", 0.2, 0.45)));
}
const Ga = new i.Vector3(),
  za = new i.Vector3(),
  Ua = new i.Vector3(),
  eo = new i.Vector3(),
  to = new i.Vector3(),
  ct = new i.Vector3(),
  oo = new i.Vector3(),
  ke = new i.Vector3(),
  no = new i.Vector3(),
  lt = new i.Vector3(),
  xn = new i.Vector3();
function Sn(e, t, o, n) {
  eo.subVectors(o, t);
  const a = eo.length();
  (e.position.addVectors(t, o).multiplyScalar(0.5),
    e.quaternion.setFromUnitVectors(Ut, eo.normalize()),
    e.scale.set(n, a, n));
}
function vn(e, t, o, n) {
  (Sn(e.upper, t, o, 0.26),
    Sn(e.fore, o, n, 0.2),
    e.elbow.position.copy(o),
    e.end.position.copy(n),
    e.grip.position.copy(n));
}
function Ba(e) {
  for (const t of Jt) t.visible = !0;
  for (const t of bn)
    vn(
      t,
      Ga.set(t.x, 1.13, t.z),
      za.set(t.x + 0.5, 2.6, t.z),
      Ua.set(t.x + 1, 1.9, t.z + 0.4),
    );
  for (const t of Mn) {
    const o = xa(e, t.offset, t.dockX);
    ((t.vehicle.visible = o.visible),
      (t.vehicle.position.x = o.x),
      (t.vehicle.position.y =
        0.25 + (o.stage === "loading" ? 0 : Math.sin(e * 22) * 0.008)));
    for (const z of t.vehicle.userData.wheels) z.rotation.z = -o.x / 0.45;
    if (
      (t.cargo.forEach((z, m) => (z.visible = m < o.loaded)),
      t.carried.forEach((z) => (z.visible = !1)),
      !o.transferring)
    )
      continue;
    const n = o.transferIndex,
      a = t.bay * 2 + (n % 2),
      r = o.transfer,
      s = Math.min(1, r / 0.7),
      l = Lo(n);
    (no.set(B[a].x, 1.55, 13.1),
      lt.set(t.dockX + l.x, 0.25 + l.y, t.roadZ + l.z));
    const u = Math.min(1, s / 0.2),
      d = Math.min(1, (1 - s) / 0.2),
      k = i.MathUtils.smoothstep(s, 0.15, 0.82);
    if (
      (ke.copy(no).lerp(lt, k),
      (ke.y = i.MathUtils.lerp(no.y, lt.y, k) + Math.min(u, d) * 1.35),
      r < 0.7)
    )
      Jt[a].visible = !1;
    else {
      const z = i.MathUtils.smoothstep(r, 0.7, 1);
      (xn.set(B[t.bay * 2 + ((n + 1) % 2)].x, 1.55, 13.1),
        ke.copy(lt).lerp(xn, z),
        (ke.y += Math.sin(Math.PI * z) * 1.5));
    }
    const L = t.carried[n % 2];
    ((L.visible = r < 0.7),
      L.position.copy(ke),
      (L.rotation.y = Math.sin(Math.PI * s) * 0.15));
    const T = t.loader;
    (to.set(T.x, 1.13, T.z),
      (ct.copy(ke).y += 0.58),
      oo.copy(to).lerp(ct, 0.47),
      (oo.y = Math.max(3.4, ct.y + 0.7)),
      vn(T, to, oo, ct));
  }
  it.position.x = 52 - ((e * 4.1) % 104);
  for (const t of it.userData.wheels) t.rotation.z = -it.position.x / 0.45;
}
const ut = R(f, -12, 0.1, 25);
(c(ut, 0, 1.7, 0, 6.6, 3.2, 0.5, $, !0),
  W(ut, 0, 1.8, 0.265, 6, 2.6, ["SMALLER COST", "BIGGER IDEAS"], {
    size: 140,
  }));
for (const e of [-3.1, 3.1]) c(ut, e, 1.7, 0, 0.24, 3.7, 0.7, ye);
c(ut, 0, 0.17, 0, 7.4, 0.34, 1.4, ye, !0);
const kn = [],
  qa = new i.MeshStandardMaterial({
    color: "#f3f4ed",
    transparent: !0,
    opacity: 0.28,
    depthWrite: !1,
    roughness: 1,
  });
for (let e = 0; e < 15; e++) {
  const t = U(f, 0, 0, 0, 1, qa);
  ((t.castShadow = !1),
    (t.userData.dynamic = !0),
    kn.push({ p: t, phase: e / 15 }));
}
function In(e, t) {
  const o = e.map((r) => {
      const s = r.geometry.index
        ? r.geometry.toNonIndexed()
        : r.geometry.clone();
      s.applyMatrix4(t(r));
      for (const l of Object.keys(s.attributes))
        ["position", "normal", "uv"].includes(l) || s.deleteAttribute(l);
      return (s.clearGroups(), s);
    }),
    n = sa(o);
  if ((o.forEach((r) => r.dispose()), !n)) return null;
  const a = new i.Mesh(n, e[0].material);
  return (
    (a.castShadow = e[0].castShadow),
    (a.receiveShadow = e[0].receiveShadow),
    a
  );
}
const An = (e) =>
  e.isMesh &&
  !e.userData.dynamic &&
  !e.userData.label &&
  !e.material.transparent &&
  e.userData.model === void 0;
f.updateMatrixWorld(!0);
{
  const e = new Map(),
    t = [];
  f.traverse((n) => {
    if (!n.isMesh || n.userData.model !== void 0 || n.userData.link) return;
    for (let r = n; r; r = r.parent) if (r.userData.dynamic) return;
    const a = n.geometry.uuid + n.material.uuid;
    (e.has(a) || e.set(a, []), e.get(a).push(n));
  });
  const o = new Map();
  for (const n of e.values()) {
    const a = n[0],
      r = a.material.transparent;
    if (n.length >= 3) {
      const s = new i.InstancedMesh(a.geometry, a.material, n.length),
        l = r || n.every((u) => u.userData.label);
      ((s.castShadow = l ? a.castShadow : !0),
        (s.receiveShadow = l ? a.receiveShadow : !0),
        n.forEach((u, d) => {
          (s.setMatrixAt(d, u.matrixWorld), t.push(u));
        }),
        s.computeBoundingSphere(),
        f.add(s));
    } else if (!r && !a.userData.label)
      for (const s of n) {
        const l = `${s.material.uuid}|${s.castShadow}|${s.receiveShadow}`;
        (o.has(l) || o.set(l, []), o.get(l).push(s));
      }
  }
  for (const n of o.values()) {
    if (n.length < 2) continue;
    const a = In(n, (r) => r.matrixWorld);
    a && (f.add(a), n.forEach((r) => t.push(r)));
  }
  t.forEach((n) => n.removeFromParent());
}
{
  const e = new Set();
  f.traverse((t) => {
    An(t) && t.parent !== f && e.add(t.parent);
  });
  for (const t of e) {
    const o = new Map();
    for (const n of t.children)
      if (An(n)) {
        const a = `${n.material.uuid}|${n.castShadow}|${n.receiveShadow}`;
        (o.has(a) || o.set(a, []), o.get(a).push(n));
      }
    for (const n of o.values()) {
      if (n.length < 2) continue;
      const a = In(n, (r) => (r.updateMatrix(), r.matrix));
      a && (t.add(a), n.forEach((r) => r.removeFromParent()));
    }
  }
}
const Ha = new i.Matrix4().makeScale(0.78, 0.78, 0.78),
  En = [0, 1, 2, 3].map((e) =>
    new i.Matrix4().compose(
      new i.Vector3(
        Math.sin((e * Math.PI) / 2) * 0.404,
        0,
        Math.cos((e * Math.PI) / 2) * 0.404,
      ),
      new i.Quaternion().setFromEuler(new i.Euler(0, (e * Math.PI) / 2, 0)),
      new i.Vector3(0.7, 0.7, 1),
    ),
  );
En.push(
  new i.Matrix4().compose(
    new i.Vector3(0, 0.405, 0),
    new i.Quaternion().setFromEuler(new i.Euler(-Math.PI / 2, 0, 0)),
    new i.Vector3(0.66, 0.66, 1),
  ),
);
const Wa = B.map((e, t) => {
    const o = Yt[t].length,
      n = new i.InstancedMesh(zt, e.tokenMat, o),
      a = new i.InstancedMesh(Gt(1, 1), Ia(e.lab, e.mark || "#fff"), o * 5);
    for (const r of [n, a])
      ((r.castShadow = r.receiveShadow = !0),
        (r.frustumCulled = !1),
        r.instanceMatrix.setUsage(i.DynamicDrawUsage),
        f.add(r));
    return { set: Yt[t], cubes: n, faces: a };
  }),
  ao = new i.Matrix4(),
  Me = new i.InstancedMesh(Yo, M, Kt.length);
((Me.castShadow = Me.receiveShadow = !0),
  (Me.frustumCulled = !1),
  Me.instanceMatrix.setUsage(i.DynamicDrawUsage),
  f.add(Me));
const ja = new i.Vector3(),
  Ka = new i.Quaternion(),
  Ya = new i.Vector3(2.2, 0.018, 0.045),
  Xa = (e) => {
    for (; e; e = e.parent) if (!e.visible) return !1;
    return !0;
  };
function Za() {
  for (const { set: e, cubes: t, faces: o } of Wa) {
    let n = 0;
    for (const a of e)
      if (Xa(a)) {
        t.setMatrixAt(n, ao.multiplyMatrices(a.matrixWorld, Ha));
        for (let r = 0; r < 5; r++)
          o.setMatrixAt(n * 5 + r, ao.multiplyMatrices(a.matrixWorld, En[r]));
        n++;
      }
    ((t.count = n),
      (o.count = n * 5),
      (t.instanceMatrix.needsUpdate = o.instanceMatrix.needsUpdate = !0));
  }
}
f.matrixWorldAutoUpdate = !1;
const re = new Jn(P);
re.addPass(new ea(f, A));
const se = new ta(f, A, innerWidth, innerHeight);
((se.blendIntensity = S.gtaoIntensity),
  se.updateGtaoMaterial({
    radius: S.gtaoRadius,
    distanceExponent: 1.45,
    thickness: S.gtaoThickness,
    distanceFallOff: 0.7,
    scale: 1,
    samples: 16,
  }),
  re.addPass(se));
const Ie = new oa(
  new i.Vector2(256, 256),
  S.bloomStrength,
  S.bloomRadius,
  S.bloomThreshold,
);
re.addPass(Ie);
const _ = new na(f, A, {
  focus: S.dofFocusDistance,
  aperture: S.dofAperture,
  maxblur: S.dofMaxBlur,
});
_.materialBokeh.fragmentShader = _.materialBokeh.fragmentShader.replace(
  "float factor = ( focus + viewZ );",
  "float factor = ( focus + viewZ ); float deadBand = 3.0; factor = sign(factor) * max(0.0, abs(factor) - deadBand);",
);
const Qa = _.render.bind(_);
((_.render = (e, t, o, ...n) => {
  const a = se.enabled,
    r = a ? 0 : 1;
  if (
    (_.materialBokeh.defines.DEPTH_PACKING !== r &&
      ((_.materialBokeh.defines.DEPTH_PACKING = r),
      (_.materialBokeh.needsUpdate = !0)),
    (_.uniforms.tDepth.value = a
      ? se.depthTexture
      : _._renderTargetDepth.texture),
    !a)
  )
    return Qa(e, t, o, ...n);
  ((_.uniforms.tColor.value = o.texture),
    (_.uniforms.nearClip.value = A.near),
    (_.uniforms.farClip.value = A.far),
    e.setRenderTarget(_.renderToScreen ? null : t),
    _._fsQuad.render(e));
}),
  re.addPass(_));
const Ve = new aa(),
  Cn = { value: S.sat };
{
  const e = "uniform sampler2D tDiffuse;",
    t = "gl_FragColor = texture2D( tDiffuse, vUv );",
    o = Ve.material.fragmentShader;
  o.includes(e) && o.includes(t)
    ? ((Ve.material.uniforms.uSat = Cn),
      (Ve.material.fragmentShader = o
        .replace(
          e,
          `${e}
uniform float uSat;`,
        )
        .replace(
          t,
          `${t}
gl_FragColor.rgb = max(mix(vec3(dot(gl_FragColor.rgb, vec3(.2126, .7152, .0722))), gl_FragColor.rgb, uSat), 0.);`,
        )),
      (Ve.material.needsUpdate = !0))
    : console.warn(
        "token-factory: OutputPass shader has moved, so the saturation grade is off.",
      );
}
re.addPass(Ve);
const X = new i.PerspectiveCamera(),
  ft = new i.Vector3(0, 1, 0),
  Ne = new i.Vector3(0, qt, 18.8),
  dt = new i.Vector3(),
  Ge = new i.Vector3(),
  ro = new i.Matrix4(),
  ze = new i.Plane(),
  ie = new i.Vector4(),
  Tn = new i.Vector4();
X.layers.set(1);
{
  const e = new i.Sphere();
  f.traverse((t) => {
    if (
      (t.isLight && t.layers.enable(1),
      !t.isMesh || t === Pa || t.userData.roadPaint)
    )
      return;
    t.isInstancedMesh && !t.boundingSphere && t.computeBoundingSphere();
    const o = t.isInstancedMesh
      ? t.boundingSphere
      : t.geometry.boundingSphere ||
        (t.geometry.computeBoundingSphere(), t.geometry.boundingSphere);
    e.copy(o).applyMatrix4(t.matrixWorld);
    const n = (() => {
      for (let a = t; a; a = a.parent) if (a.userData.dynamic) return !0;
      return !1;
    })();
    (t.frustumCulled === !1 || n || e.center.z + e.radius > 6) &&
      t.layers.enable(1);
  });
}
function so() {
  const e = P.getDrawingBufferSize(Ge);
  Ht.setSize(Math.round(e.x * 0.4), Math.round(e.y * 0.4));
}
so();
function Ja() {
  if (!S.reflect || (dt.setFromMatrixPosition(A.matrixWorld), dt.y <= qt))
    return;
  (ro.extractRotation(A.matrixWorld),
    X.position.subVectors(Ne, dt).reflect(ft).negate().add(Ne),
    Ge.set(0, 0, -1).applyMatrix4(ro).add(dt),
    Ge.subVectors(Ne, Ge).reflect(ft).negate().add(Ne),
    X.up.set(0, 1, 0).applyMatrix4(ro).reflect(ft),
    X.lookAt(Ge),
    (X.far = A.far),
    X.updateMatrixWorld(),
    X.projectionMatrix.copy(A.projectionMatrix),
    Wt.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(X.projectionMatrix)
      .multiply(X.matrixWorldInverse),
    ze.setFromNormalAndCoplanarPoint(ft, Ne).applyMatrix4(X.matrixWorldInverse),
    ie.set(ze.normal.x, ze.normal.y, ze.normal.z, ze.constant));
  const e = X.projectionMatrix.elements;
  (Tn.set(
    (Math.sign(ie.x) + e[8]) / e[0],
    (Math.sign(ie.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    ie.multiplyScalar(2 / ie.dot(Tn)),
    (e[2] = ie.x),
    (e[6] = ie.y),
    (e[10] = ie.z + 1),
    (e[14] = ie.w),
    P.setRenderTarget(Ht),
    P.clear(),
    P.render(f, X),
    P.setRenderTarget(null));
}
const Pn = new i.Vector3(),
  Rn = new i.Vector3();
let pt = S.dofFocusDistance;
function er() {
  ((pt = S.dofAutoFocus ? A.position.distanceTo(G.target) : S.dofFocusDistance),
    A.getWorldDirection(Rn),
    Pn.copy(A.position)
      .addScaledVector(Rn, pt)
      .applyMatrix4(A.matrixWorldInverse),
    (_.uniforms.focus.value = -Pn.z));
}
function ht() {
  ((se.enabled = S.gtao),
    (se.blendIntensity = S.gtaoIntensity),
    se.updateGtaoMaterial({
      radius: S.gtaoRadius,
      distanceExponent: 1.45,
      thickness: S.gtaoThickness,
      distanceFallOff: 0.7,
      scale: 1,
      samples: 16,
    }),
    (Ie.enabled = S.bloom),
    (Ie.strength = S.bloomStrength),
    (Ie.radius = S.bloomRadius),
    (Ie.threshold = S.bloomThreshold),
    (Cn.value = S.sat),
    (_.enabled = S.dof),
    (_.uniforms.aperture.value = S.dofAperture),
    (_.uniforms.maxblur.value = S.dofMaxBlur),
    (A.fov = S.fov),
    A.updateProjectionMatrix(),
    (P.toneMappingExposure = S.exposure),
    (G.autoRotateSpeed = S.orbitSpeed),
    (Wt.uReflStrength.value = S.reflect ? S.reflectStrength : 0));
}
const Ae = h("#render-tuning");
let tr = 0,
  te = Ze,
  mt = 0,
  Ue = 0,
  io = 0;
const Dn = {
  auto: 1,
  get dpr() {
    return te;
  },
};
function or(e) {
  if (!Dn.auto || e > 0.25) {
    mt = Ue = 0;
    return;
  }
  if ((mt++, (Ue += e), Ue < 1.5)) return;
  const t = mt / Ue,
    o = performance.now();
  mt = Ue = 0;
  let n = te;
  (t < 45 && te > 1 && o - io > 2500
    ? (n = Math.max(1, te - 0.2))
    : t > 58 && te < Ze && o - io > 8e3 && (n = Math.min(Ze, te + 0.1)),
    n !== te &&
      ((te = n), (io = o), P.setPixelRatio(te), re.setPixelRatio(te), so()));
}
let Ln = !0,
  co = performance.now();
function lo() {
  (Ln && requestAnimationFrame(lo), On(performance.now()));
}
function On(e) {
  const t = Math.max(0, (e - co) / 1e3);
  co = e;
  const o = Math.min(t, 0.05);
  if ((or(t), J || (Q += o * (we ? 2.4 : 1)), Ba(Q), K)) {
    const n = Math.min(1, (performance.now() - K.start) / 900),
      a = n * n * (3 - 2 * n);
    (A.position.lerpVectors(K.fromPos, K.toPos, a),
      G.target.lerpVectors(K.fromTarget, K.toTarget, a),
      n >= 1 && ((K = null), (G.enabled = !0)));
  }
  if (
    (cr(t),
    G.update(o),
    nr(),
    A.updateMatrixWorld(),
    er(),
    f.updateMatrixWorld(),
    Za(),
    (P.shadowMap.needsUpdate = !0),
    ee ? re.render() : P.render(f, A),
    po++,
    S.dofAutoFocus && !Ae.hidden && (tr++ & 7) === 0)
  ) {
    const n = h("#tune-rows .tr.auto u");
    n && (n.textContent = `${Math.round(pt)} m auto`);
  }
  Ja();
}
function nr() {
  for (const { g: e, lane: t, offset: o } of tn) {
    const n = (Q * (B[t].pace / 180) * 0.7 + o) % 10.3;
    ((e.position.z = 2.1 + n),
      (e.position.y = 1.74),
      e.scale.setScalar(Math.min(1, Math.max(0.02, n * 4))),
      (e.visible = n < 10.1));
  }
  (Kt.forEach(({ x: e, lane: t, offset: o }, n) =>
    Me.setMatrixAt(
      n,
      ao.compose(
        ja.set(e, 1.284, 2.3 + ((o + Q * (B[t].pace / 180) * 0.7) % 10.2)),
        Ka,
        Ya,
      ),
    ),
  ),
    (Me.instanceMatrix.needsUpdate = !0));
  for (const e of on) {
    const t = Q * 0.8 + e.phase;
    ((e.base.rotation.y = Math.sin(t) * 0.5),
      (e.upper.rotation.z = 0.45 + Math.sin(t) * 0.3),
      (e.fore.rotation.z = -1.65 + Math.sin(t + 0.8) * 0.35),
      (e.wrist.rotation.z = 0.4 - Math.sin(t) * 0.3));
  }
  for (const e of nn) e.rotation.y = Q * 5;
  an.forEach((e, t) =>
    e.scale.setScalar(0.14 * (1 + Math.sin(Q * 2 + t) * 0.08)),
  );
  for (const { p: e, phase: t } of kn) {
    const o = (Q * 0.06 + t) % 1;
    (e.position.set(
      -1.7 + o * 4 + Math.sin(t * 20) * 0.6,
      10 + o * 6,
      -10 + Math.sin(o * 3 + t) * 0.6,
    ),
      e.scale.setScalar(0.15 + o * 0.85));
  }
  for (const e of rn) {
    const t = Q * 0.85 + e.phase,
      o = Math.sin(t * 5);
    ((e.g.position.z = e.z + Math.sin(t) * 1.3),
      (e.g.position.y = 0.2 + Math.abs(o) * 0.025),
      (e.g.rotation.y = Math.cos(t) > 0 ? 0 : Math.PI));
    const { legs: n, arms: a } = e.g.userData;
    ((n[0].rotation.x = o * 0.5),
      (n[1].rotation.x = -o * 0.5),
      (a[0].rotation.x = -o * 0.4),
      (a[1].rotation.x = o * 0.4));
  }
}
function ar() {
  ((A.aspect = innerWidth / innerHeight),
    A.updateProjectionMatrix(),
    P.setSize(innerWidth, innerHeight),
    re.setSize(innerWidth, innerHeight),
    so());
}
(addEventListener("resize", ar),
  Qe && (A.position.copy(_o), G.target.copy(Fo)),
  G.update(),
  ht());
const gt = (e) =>
    String(e).replace(
      /[&<>"]/g,
      (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[t],
    ),
  $n = (e) => Xe[e]?.color || xo[e]?.brand || "#50657a";
function _n(e) {
  return Et[e]
    ? `<img class="mk" src="${Et[e]}" alt="">`
    : Re[e]
      ? `<svg class="mk" viewBox="0 0 24 24" aria-hidden="true" style="--c:${$n(e)}"><path d="${Re[e]}"/></svg>`
      : `<i class="mk" style="--c:${$n(e)}">${gt(
          e
            .replace(/[^A-Za-z]/g, "")
            .slice(0, 2)
            .toUpperCase(),
        )}</i>`;
}
const Fn = fe.generatedAt
  ? new Date(fe.generatedAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  : null;
let wt = null;
function Be() {
  const e = Ma[Se],
    t = Pe.filter((r) => e.get(r) != null).sort((r, s) =>
      e.low ? e.get(r) - e.get(s) : e.get(s) - e.get(r),
    );
  t.push(...Pe.filter((r) => e.get(r) == null));
  const o = t.map(e.get).filter((r) => r != null),
    n = Math.max(...o),
    a = Math.min(...o);
  ((h("#metric-label").innerHTML = `${e.title()}<small>${e.note}</small>`),
    (h("#ranking").innerHTML = t.length
      ? t
          .map((r, s) => {
            const l = e.get(r),
              u = l == null ? 0 : e.low ? a / l : l / n;
            return `<li><button class="row" data-lab="${gt(r.lab)}" aria-current="${r.lab === wt}">
      <span class="rank num">${l == null ? "" : s + 1}</span>${_n(r.lab)}
      <span class="who"><b>${gt(r.model)}</b><small>${gt(r.lab)}${Xe[r.lab] ? " \xB7 <em>in the factory</em>" : ""}</small></span>
      <span class="val num${l == null ? " none" : ""}">${e.show(r)}</span>
      <span class="bar" style="--w:${u.toFixed(3)}"></span></button></li>`;
          })
          .join("")
      : '<li class="board-foot">No lab data in this build. Run scripts/data.mjs.</li>'),
    (h("#board-foot").innerHTML =
      `Each lab\u2019s highest-scoring model. <b>OpenRouter</b> and <b>Artificial Analysis</b>${Fn ? `, updated ${Fn}` : ""}.`),
    h("#quantity").setAttribute(
      "aria-disabled",
      String(Se !== "price" && Se !== "value"),
    ));
}
function uo() {
  for (const e of B) Ca(e.boardLabel, Po(e), gn(e));
}
function fo(e) {
  const t = xo[e];
  if (!t) return;
  ((wt = e),
    (h("#detail-mark").innerHTML = _n(e)),
    (h("#detail-name").textContent = t.model),
    (h("#detail-sub").textContent =
      `${e} \xB7 released ${new Date(t.released + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`));
  const o = (n, a, r = "") =>
    `<div><dt>${n}</dt><dd class="num">${a}${r ? `<small>${r}</small>` : ""}</dd></div>`;
  ((h("#detail-stats").innerHTML = [
    o("Intelligence", t.intel.toFixed(1)),
    o("Coding", t.coding == null ? "\u2014" : t.coding.toFixed(1)),
    o("Output speed", t.speed ?? "\u2014", t.speed == null ? "" : "t/s"),
    o("Context", Dt(t.ctx)),
    o("Input", Le(t.pin), "/ 1M"),
    o("Output", Le(t.pout), "/ 1M"),
  ].join("")),
    (h("#detail-note").textContent = Xe[e]
      ? `Its line in the factory is signed ${Xe[e].name}. Indices from Artificial Analysis; prices and speed from OpenRouter.`
      : "Indices from Artificial Analysis; prices and speed from OpenRouter."),
    We(!1),
    (h("#detail").hidden = !1),
    Be());
}
function qe() {
  ((h("#detail").hidden = !0), (wt = null), Be());
}
function Vn() {
  const e = Je[de];
  ((h("#camera-switch span").textContent = String(de + 1).padStart(2, "0")),
    (h("#camera-switch").title =
      `Cam ${String(de + 1).padStart(2, "0")} \xB7 ${e.name} (C)`),
    h("#camera-switch").setAttribute(
      "aria-label",
      `Switch camera, current ${e.name}`,
    ));
}
function yt(e) {
  ((Rt = e),
    (G.autoRotate = e),
    h("#orbit").setAttribute("aria-pressed", String(e)));
}
function Mt(e, t = !1) {
  de = (e + Je.length) % Je.length;
  const o = Je[de];
  (yt(!1),
    t
      ? (A.position.copy(o.position),
        G.target.copy(o.target),
        G.update(),
        (K = null),
        (G.enabled = !0))
      : ((K = {
          fromPos: A.position.clone(),
          fromTarget: G.target.clone(),
          toPos: o.position.clone(),
          toTarget: o.target.clone(),
          start: performance.now(),
        }),
        (G.enabled = !1)),
    Vn());
}
function Nn(e, t) {
  for (const o of document.querySelectorAll(`${e} button`))
    o.setAttribute("aria-pressed", String(o === t));
}
(h("#metrics").addEventListener("click", (e) => {
  const t = e.target.closest("button");
  t && ((Se = t.dataset.metric), Nn("#metrics", t), Be(), uo());
}),
  h("#quantity").addEventListener("click", (e) => {
    const t = e.target.closest("button");
    t && ((De = Number(t.dataset.quantity)), Nn("#quantity", t), Be(), uo());
  }),
  h("#ranking").addEventListener("click", (e) => {
    const t = e.target.closest(".row");
    t && (t.dataset.lab === wt ? qe() : fo(t.dataset.lab));
  }));
function bt() {
  ((J = !J),
    h("#pause use").setAttribute("href", J ? "#i-play" : "#i-pause"),
    (h("#pause span").textContent = J ? "Resume" : "Pause"),
    h("#pause").setAttribute(
      "aria-label",
      J ? "Resume production" : "Pause production",
    ),
    (h("#pause").title =
      (J ? "Resume production" : "Pause production") + " (Space)"));
}
((h("#pause").onclick = bt),
  J && ((J = !1), bt()),
  (h("#motion").onclick = () => {
    we = !we;
    const e = we ? "Hyperlapse" : "Real time";
    ((h("#motion span").textContent = e),
      h("#motion").setAttribute("aria-pressed", String(we)),
      h("#motion").setAttribute("aria-label", e),
      (h("#motion").title = we
        ? "Hyperlapse: run the factory fast"
        : "Real time: run the factory at its own pace"));
  }),
  (h("#orbit").onclick = () => yt(!Rt)),
  (h("#reset").onclick = () => {
    (Mt(0, !0), qe());
  }),
  (h("#camera-switch").onclick = () => Mt(de + 1)));
function xt() {
  Ae.hidden || queueMicrotask(ce);
  const e = ee ? "Cinematic" : "Performance";
  ((h("#quality span").textContent = e),
    h("#quality").setAttribute("aria-label", e + " render"),
    (h("#quality").title = e + " render"),
    h("#quality").setAttribute("aria-pressed", String(ee)));
}
((h("#quality").onclick = () => {
  ((ee = !ee), xt());
}),
  (h("#collapse").onclick = () => {
    const e = h("#board").classList.toggle("collapsed");
    (h("#collapse").setAttribute("aria-expanded", String(!e)),
      h("#collapse").setAttribute(
        "aria-label",
        e ? "Expand leaderboard" : "Collapse leaderboard",
      ));
  }),
  innerHeight < 620 && h("#collapse").click());
const Z = (e) => (t) => t.toFixed(e),
  Ee = (e) => (e ? "on" : "off"),
  he = [
    ["cinematic", "Cinematic render", 0, 1, 1, Ee],
    ["bloom", "Bloom", 0, 1, 1, Ee],
    ["bloomStrength", "strength", 0, 1.8, 0.01, Z(2), 1],
    ["bloomThreshold", "threshold", 0.5, 1.5, 0.01, Z(2), 1],
    ["bloomRadius", "radius", 0, 1, 0.01, Z(2), 1],
    ["gtao", "Ambient occlusion", 0, 1, 1, Ee],
    ["gtaoIntensity", "intensity", 0, 2, 0.05, Z(2), 1],
    ["gtaoRadius", "radius", 0.5, 4, 0.1, Z(2), 1],
    ["gtaoThickness", "thickness", 0.5, 3, 0.1, Z(2), 1],
    ["dof", "Depth of field", 0, 1, 1, Ee],
    ["dofAperture", "aperture", 0, 0.0025, 5e-5, Z(5), 1],
    ["dofMaxBlur", "max blur", 0, 0.05, 0.001, Z(3), 1],
    ["dofAutoFocus", "auto focus", 0, 1, 1, Ee, 1],
    [
      "dofFocusDistance",
      "focus distance",
      5,
      100,
      1,
      (e) => `${Math.round(e)} m`,
      1,
    ],
    ["reflect", "Road reflection", 0, 1, 1, Ee],
    ["reflectStrength", "strength", 0, 1, 0.01, Z(2), 1],
    ["fov", "Field of view", 25, 65, 1, (e) => `${Math.round(e)}\xB0`],
    ["exposure", "Exposure", 0.7, 1.4, 0.01, Z(2)],
    ["sat", "Saturation", 0.6, 1.8, 0.01, Z(2)],
    ["orbitSpeed", "Auto-orbit speed", 0, 0.8, 0.01, Z(2)],
  ],
  Gn = ([, , e, t, o]) => t - e === o,
  me = (e) => (e === "cinematic" ? +ee : +S[e]);
function He(e, t) {
  if (e === "cinematic") {
    ((ee = !!t), xt());
    return;
  }
  ((S[e] = typeof Oe[e] == "boolean" ? !!t : t), ht());
}
const zn = ([e, , , , , t]) =>
    e === "dofFocusDistance" && S.dofAutoFocus
      ? `${Math.round(pt)} m auto`
      : t(me(e)),
  Un = () => ({ ...S, cinematic: ee });
let ne = 0;
function ce() {
  const e = h("#tune-rows");
  ((e.innerHTML = he
    .map((t, o) => {
      const [n, a, r, s, , , l] = t,
        u = j(((me(n) - r) / (s - r)) * 100, 0, 100);
      return `<div class="tr${o === ne ? " sel" : ""}${l ? " sub" : ""}${n === "dofFocusDistance" && S.dofAutoFocus ? " auto" : ""}" data-i="${o}"><b>${a}</b><span class="tk"><i style="left:${u}%"></i></span><u>${zn(t)}</u></div>`;
    })
    .join("")),
    e.querySelectorAll(".tr").forEach((t) => {
      t.onclick = () => {
        ne = +t.dataset.i;
        const n = he[ne];
        (Gn(n) && He(n[0], me(n[0]) ? 0 : 1), ce());
      };
      const o = t.querySelector(".tk");
      ((o.onclick = (n) => n.stopPropagation()),
        (o.onpointerdown = (n) => {
          (n.stopPropagation(),
            (ne = +t.dataset.i),
            o.setPointerCapture(n.pointerId));
          const a = (r) => {
            const s = o.getBoundingClientRect(),
              l = he[ne],
              [u, , d, k, L] = l,
              T = j(
                +(
                  Math.round(
                    (d + j((r.clientX - s.left) / s.width, 0, 1) * (k - d)) / L,
                  ) * L
                ).toFixed(6),
                d,
                k,
              );
            (T !== me(u) && He(u, T),
              (o.querySelector("i").style.left =
                j(((me(u) - d) / (k - d)) * 100, 0, 100) + "%"),
              (t.querySelector("u").textContent = zn(l)),
              Bn());
          };
          (a(n),
            (o.onpointermove = a),
            (o.onpointerup = o.onpointercancel =
              () => {
                ((o.onpointermove = null), ce());
              }));
        }));
    }),
    Bn());
}
function Bn() {
  const e = h("#tune-json");
  document.activeElement !== e && (e.value = JSON.stringify(Un()));
}
function rr(e, t) {
  const [o, , n, a, r] = he[ne],
    s = j(+(me(o) + e * r * (t ? 5 : 1)).toFixed(6), n, a);
  s !== me(o) && (He(o, s), ce());
}
function sr(e) {
  if (e) (Object.assign(S, Oe), (ee = !0), xt(), ht());
  else {
    const t = he[ne][0];
    He(t, t === "cinematic" ? 1 : Oe[t]);
  }
  ce();
}
function ir(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (ne = (ne + (t === "ArrowUp" ? -1 : 1) + he.length) % he.length),
      ce(),
      h("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (rr(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const o = he[ne];
    return Gn(o) ? (He(o[0], me(o[0]) ? 0 : 1), ce(), !0) : !1;
  }
  return t === "0" || t === ")"
    ? (sr(e.shiftKey), !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard
          ?.writeText(JSON.stringify(Un(), null, 1))
          .catch(() => {}),
        !0)
      : t === "Escape"
        ? (We(!1), !0)
        : !1;
}
h("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o of Object.keys(Oe))
      typeof t[o] == typeof Oe[o] && (S[o] = t[o]);
    (typeof t.cinematic == "boolean" && (ee = t.cinematic), xt(), ht());
  } catch {}
  (e.target.blur(), ce());
});
function We(e) {
  const t = e === void 0 ? Ae.hidden : e;
  ((Ae.hidden = !t), t && ((h("#detail").hidden = !0), ce()));
}
let po = 0,
  qn = performance.now();
setInterval(() => {
  const e = performance.now();
  (Ae.hidden ||
    (h("#tune-fps").textContent = Math.round((po * 1e3) / (e - qn)) + " fps"),
    (po = 0),
    (qn = e));
}, 500);
function ho() {
  const e = document.body.classList.toggle("ui-hidden");
  (e && We(!1), (h("#show-ui").hidden = !e));
}
((h("#hide").onclick = ho),
  (h("#show-ui").onclick = ho),
  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.code === "Quote") {
      (e.preventDefault(), We());
      return;
    }
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.target?.matches?.("input,textarea,[contenteditable]")
    )
      return;
    if (!Ae.hidden && ir(e)) {
      e.preventDefault();
      return;
    }
    if (e.key === "/") {
      (e.preventDefault(), ho());
      return;
    }
    const t = (e.key || "").toLowerCase();
    if (
      /^(w|a|s|d|q|e|\+|=|-|_|arrowup|arrowdown|arrowleft|arrowright)$/.test(t)
    ) {
      (be.add(t), t.startsWith("arrow") && e.preventDefault());
      return;
    }
    if (t === "c") Mt(de + 1);
    else if (t === "r") h("#reset").click();
    else if (t >= "1" && t <= "5") {
      const o = bo("#metrics button")[+t - 1];
      o && o.click();
    } else if (t === "t") {
      const o = bo("#quantity button"),
        n = o.findIndex((a) => a.getAttribute("aria-pressed") === "true");
      o[(n + 1) % o.length].click();
    } else
      e.code === "Space" && e.target === document.body
        ? (e.preventDefault(), bt())
        : e.key === "Escape" && (qe(), We(!1));
  }));
let je;
const St = new i.Raycaster(),
  Hn = new i.Vector2(),
  Wn = [...sn, ...rt],
  le = P.domElement,
  Ce = new Map();
let ge = null;
const mo = () => {
  Rt && yt(!1);
};
function jn(e, t) {
  const o = le.clientHeight || innerHeight,
    n = (2 * b.dist * Math.tan((A.fov * Math.PI) / 360)) / o,
    a = Math.sin(b.yaw),
    r = Math.cos(b.yaw),
    s = 1 / Math.max(Math.sin(b.pitch), 0.35);
  ((b.t.x += (-e * r - t * s * a) * n),
    (b.t.z += (e * a - t * s * r) * n),
    Kn());
}
function Kn() {
  ((b.t.x = j(b.t.x, -46, 46)),
    (b.t.y = j(b.t.y, -2, 30)),
    (b.t.z = j(b.t.z, -46, 46)));
}
const vt = (e) => {
  b.dist = j(b.dist * e, Go, zo);
};
(le.addEventListener("pointerdown", (e) => {
  if (((je = { x: e.clientX, y: e.clientY }), !!G.enabled)) {
    try {
      le.setPointerCapture(e.pointerId);
    } catch {}
    (Ce.set(e.pointerId, {
      x: e.clientX,
      y: e.clientY,
      pan: e.button === 2 || e.shiftKey,
    }),
      (ge = null));
  }
}),
  le.addEventListener("pointermove", (e) => {
    const t = Ce.get(e.pointerId);
    if (!t) return;
    const o = e.clientX - t.x,
      n = e.clientY - t.y;
    if (
      ((t.x = e.clientX), (t.y = e.clientY), mo(), (K = null), Ce.size >= 2)
    ) {
      const [a, r] = [...Ce.values()],
        s = Math.hypot(a.x - r.x, a.y - r.y),
        l = [(a.x + r.x) / 2, (a.y + r.y) / 2];
      (ge &&
        (s > 1 && ge.gap > 1 && vt(ge.gap / s),
        jn((l[0] - ge.mid[0]) / 2, (l[1] - ge.mid[1]) / 2)),
        (ge = { gap: s, mid: l }));
      return;
    }
    t.pan
      ? jn(o, n)
      : ((b.yaw -= o * 0.004), (b.pitch = j(b.pitch + n * 0.003, Vo, No)));
  }));
const Yn = (e) => {
  (Ce.delete(e.pointerId), Ce.size < 2 && (ge = null));
  try {
    le.releasePointerCapture(e.pointerId);
  } catch {}
};
(le.addEventListener("pointerup", Yn),
  le.addEventListener("pointercancel", (e) => {
    ((je = null), Yn(e));
  }),
  le.addEventListener("contextmenu", (e) => e.preventDefault()),
  le.addEventListener(
    "wheel",
    (e) => {
      G.enabled &&
        (e.preventDefault(),
        mo(),
        (K = null),
        vt(Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 5e-4))));
    },
    { passive: !1 },
  ));
const be = new Set(),
  Te = (...e) => e.some((t) => be.has(t));
(addEventListener("keyup", (e) => be.delete((e.key || "").toLowerCase())),
  addEventListener("blur", () => be.clear()));
function cr(e) {
  if (!be.size || !G.enabled) return;
  const t = e * b.dist * 0.9,
    o = e * 1.1;
  let n = !1;
  const a = (r, s) => {
    const l = Math.sin(b.yaw),
      u = Math.cos(b.yaw);
    ((b.t.x -= (r * l - s * u) * t), (b.t.z -= (r * u + s * l) * t), (n = !0));
  };
  (Te("w", "arrowup") && a(1, 0),
    Te("s", "arrowdown") && a(-1, 0),
    Te("a", "arrowleft") && a(0, -1),
    Te("d", "arrowright") && a(0, 1),
    be.has("q") && ((b.yaw += o), (n = !0)),
    be.has("e") && ((b.yaw -= o), (n = !0)),
    Te("=", "+") && (vt(Math.exp(-o)), (n = !0)),
    Te("-", "_") && (vt(Math.exp(o)), (n = !0)),
    n && (Kn(), mo(), (K = null)));
}
P.domElement.addEventListener("pointerup", (e) => {
  if (!je || Math.hypot(e.clientX - je.x, e.clientY - je.y) > 6) return;
  St.setFromCamera(
    Hn.set(
      (e.clientX / innerWidth) * 2 - 1,
      (-e.clientY / innerHeight) * 2 + 1,
    ),
    A,
  );
  const t = St.intersectObjects(Wn)[0];
  t &&
    (t.object.userData.link
      ? window.open(t.object.userData.link, "_blank", "noopener")
      : fo(B[t.object.userData.model].lab));
});
let go = !1,
  Ke = null;
(P.domElement.addEventListener("pointermove", (e) => {
  go ||
    e.buttons ||
    ((go = !0),
    requestAnimationFrame(() => {
      ((go = !1),
        St.setFromCamera(
          Hn.set(
            (e.clientX / innerWidth) * 2 - 1,
            (-e.clientY / innerHeight) * 2 + 1,
          ),
          A,
        ));
      const t = St.intersectObjects(Wn)[0];
      P.domElement.style.cursor = t ? "pointer" : "";
      const o = t?.object.userData.glow ? t.object : null;
      o !== Ke &&
        (Ke && (Ke.material.emissiveIntensity = Ke.userData.glow[0]),
        o && (o.material.emissiveIntensity = o.userData.glow[1]),
        (Ke = o));
    }));
}),
  (h("#close-detail").onclick = qe),
  jo ||
    Ko.then(() => {
      for (const [t, o] of at) {
        const [n, a, r, s] = JSON.parse(t);
        (Bt(o.image.getContext("2d"), o.image.width, o.image.height, r, s),
          (o.needsUpdate = !0));
      }
      uo();
      const e = (t, o, n) => {
        const a = t.image,
          r = a.getContext("2d");
        (r.clearRect(0, 0, a.width, a.height),
          tt(r, o, a.width / 2, a.height / 2, 400, n),
          (t.needsUpdate = !0));
      };
      for (const [t, o] of nt) o.userData.drawnMark && e(o.map, t);
      for (const t of ot.values()) {
        const { lab: o, color: n } = t.userData.mark;
        !Ct[o] && !Re[o] && e(t.map, o, n);
      }
    }).catch(() => {}),
  Vn(),
  Be(),
  lo(),
  document.body.classList.remove("booting"));
{
  const e = h("#loading");
  e && ((e.style.opacity = 0), setTimeout(() => e.remove(), 900));
}
((window.__step = (e) => On(e)),
  (window.__loop = (e) => {
    ((Ln = e), e && ((co = performance.now()), requestAnimationFrame(lo)));
  }),
  (window.__x = {
    renderer: P,
    camera: A,
    scene: f,
    composer: re,
    controls: G,
    RT: Dn,
    models: B,
    bloom: Ie,
    gtao: se,
    bokeh: _,
    renderTuning: S,
  }),
  (window.__tf = {
    view: (e) => Mt(e, !0),
    metric: (e) => {
      const t = document.querySelector(`#metrics [data-metric="${e}"]`);
      t && t.click();
    },
    quantity: (e) => {
      const t = document.querySelector(`#quantity [data-quantity="${e}"]`);
      t && t.click();
    },
    detail: (e) => (e ? fo(e) : qe()),
    orbit: yt,
    paused: (e) => {
      e !== J && bt();
    },
    hyperlapse: (e) => {
      e !== we && h("#motion").click();
    },
    ui: (e) => document.body.classList.toggle("ui-hidden", !e),
    time: (e) => {
      Q = e;
    },
  }),
  (window.__dbg = () => ({
    t: +Q.toFixed(2),
    cam: de,
    metric: Se,
    quantity: De,
    dpr: +te.toFixed(2),
    cine: ee,
    paused: J,
    labs: Pe.length,
    at: fe.generatedAt,
    factories: B.map(
      (e) => `${e.lab}:${e.name}:${e.color}/${e.body}${e.mark ? "/pale" : ""}`,
    ),
    cam3: {
      yaw: +b.yaw.toFixed(3),
      pitch: +b.pitch.toFixed(3),
      dist: +b.dist.toFixed(2),
      t: b.t.toArray().map((e) => +e.toFixed(2)),
    },
  })));
