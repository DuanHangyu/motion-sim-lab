import * as s from "three";
import { EffectComposer as nn } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as da,
  FullScreenQuad as qe,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as ha } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as on } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as sn } from "three/addons/postprocessing/OutputPass.js";
import { RoundedBoxGeometry as rn } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as de } from "three/addons/utils/BufferGeometryUtils.js";
const h = (e) => document.querySelector(e),
  he = h("#world"),
  ue = h("#app"),
  bt = "RLUDFB",
  ua = ["right", "left", "up", "down", "front", "back"],
  xt = ["#f07a26", "#d8383a", "#f6c334", "#f2efe6", "#23935a", "#2860c9"],
  cn = ["orange", "red", "yellow", "white", "green", "blue"],
  b = [];
for (let e = 0; e < 6; e++) {
  const t = e >> 1,
    a = e & 1 ? -1 : 1;
  for (const n of [-1, 0, 1])
    for (const o of [-1, 0, 1]) {
      const r = [0, 0, 0];
      ((r[t] = a),
        (r[(t + 1) % 3] = n),
        (r[(t + 2) % 3] = o),
        b.push({ p: r, a: t, s: a, f: e, centre: !n && !o }));
    }
}
const ma = (e, t, a) => e.join() + (a > 0 ? "+" : "-") + t,
  ln = new Map(b.map((e, t) => [ma(e.p, e.a, e.s), t])),
  St = [0, 1, 2, 3, 4, 5].map((e) => b.findIndex((t) => t.f === e && t.centre));
function $e(e, t, a) {
  const n = e.slice(),
    o = (t + 1) % 3,
    r = (t + 2) % 3;
  for (let i = 0; i < ((a % 4) + 4) % 4; i++) {
    const c = n[o];
    ((n[o] = -n[r]), (n[r] = c));
  }
  return n;
}
function pa(e, t, a) {
  const n = new Int16Array(54);
  return (
    b.forEach((o, r) => {
      if (o.p[e] !== t) {
        n[r] = r;
        return;
      }
      const i = [0, 0, 0];
      i[o.a] = o.s;
      const c = $e(i, e, a),
        l = c.findIndex((u) => u);
      n[r] = ln.get(ma($e(o.p, e, a), l, c[l]));
    }),
    n
  );
}
const fn = {
    R: [0, 1, -1],
    L: [0, -1, 1],
    M: [0, 0, 1],
    U: [1, 1, -1],
    D: [1, -1, 1],
    E: [1, 0, 1],
    F: [2, 1, -1],
    B: [2, -1, 1],
    S: [2, 0, -1],
  },
  va = [
    ["L", "M", "R"],
    ["D", "E", "U"],
    ["B", "S", "F"],
  ];
function At(e) {
  const t = fn[e[0]],
    a = e[1] === "'" ? -1 : e[1] === "2" ? 2 : 1;
  return {
    name: e,
    a: t[0],
    layer: t[1],
    q: t[2] * a,
    to: pa(t[0], t[1], t[2] * a),
  };
}
const dn = (e) => (e[1] === "2" ? e : e[1] === "'" ? e[0] : e + "'"),
  kt = Math.sqrt(3) / 2,
  Pt = [-0.5, kt / 3],
  Ct = [0.5, kt / 3],
  Tt = [0, (-2 * kt) / 3],
  Et = (e, t) => [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2],
  F = [Et(Ct, Tt), Pt, Et(Pt, Ct), Tt, Et(Tt, Pt), Ct],
  It = [F[0], F[2], F[4]],
  hn = 0.125,
  Ut = (e, t) => 0.5 - t * hn;
function un(e, t, a, n, o) {
  const r = a[0] - e[0],
    i = a[1] - e[1],
    c = Math.hypot(r, i),
    l = (t * t - n * n + c * c) / (2 * c),
    u = Math.sqrt(Math.max(0, t * t - l * l)),
    g = e[0] + (l * r) / c,
    d = e[1] + (l * i) / c,
    m = [g + (u * i) / c, d - (u * r) / c],
    y = [g - (u * i) / c, d + (u * r) / c];
  return Math.hypot(m[0] - o[0], m[1] - o[1]) <
    Math.hypot(y[0] - o[0], y[1] - o[1])
    ? m
    : y;
}
const U = b.map((e) => {
    const [t, a] = [0, 1, 2].filter((n) => n !== e.a);
    return un(It[t], Ut(t, e.p[t]), It[a], Ut(a, e.p[a]), F[e.f]);
  }),
  me = (e, t) => Math.atan2(e[1] - t[1], e[0] - t[0]);
function ga(e, t) {
  const a = e.slice().sort((n, o) => me(U[n], t) - me(U[o], t));
  return { c: t, slots: a, at: new Map(a.map((n, o) => [n, o])) };
}
const B = [];
for (let e = 0; e < 3; e++)
  for (const t of [-1, 0, 1]) {
    const a = ga(
      b.map((n, o) => o).filter((n) => b[n].a !== e && b[n].p[e] === t),
      It[e],
    );
    B.push(Object.assign(a, { a: e, v: t, r: Ut(e, t), move: va[e][t + 1] }));
  }
const mn = (e, t) => B[e * 3 + t + 1],
  pn = [0, 1, 2, 3, 4, 5].map((e) =>
    ga(
      b.map((t, a) => a).filter((t) => b[t].f === e && !b[t].centre),
      F[e],
    ),
  );
function vn(e) {
  const t = [],
    a = pa(e.a, e.layer, Math.sign(e.q));
  return (
    b.forEach((n, o) => {
      if (n.p[e.a] !== e.layer || (n.centre && n.a === e.a)) return;
      const r = e.to[o],
        i = n.a === e.a ? pn[n.f] : mn(e.a, e.layer),
        c = i.slots.length,
        l = (((i.at.get(a[o]) - i.at.get(o)) % c) + c) % c,
        u = l < c / 2 ? 1 : -1;
      let g = me(U[r], i.c) - me(U[o], i.c);
      if (u > 0) for (; g <= 1e-6;) g += Math.PI * 2;
      else for (; g >= -1e-6;) g -= Math.PI * 2;
      const d = Math.hypot(U[o][0] - i.c[0], U[o][1] - i.c[1]),
        m = Math.hypot(U[r][0] - i.c[0], U[r][1] - i.c[1]);
      t.push({ from: o, to: r, c: i.c, th: me(U[o], i.c), d: g, r0: d, r1: m });
    }),
    t
  );
}
const L = new Uint8Array(54).map((e, t) => b[t].f),
  Ma = (e, t) => {
    const a = e.slice();
    for (let n = 0; n < 54; n++) a[t[n]] = e[n];
    return a;
  },
  W = (e) =>
    [0, 1, 2, 3, 4, 5].every((t) =>
      b.every((a, n) => a.f !== t || e[n] === e[St[t]]),
    ),
  He = [];
for (const e of bt) for (const t of ["", "2", "'"]) He.push(e + t);
const gn = He.map((e) => {
    const t = At(e).to,
      a = new Int16Array(54);
    for (let n = 0; n < 54; n++) a[t[n]] = n;
    return a;
  }),
  Mn = `let P;onmessage=e=>{if(e.data.perms){P=e.data.perms;return;}postMessage(search(e.data.start,e.data.goal,e.data.budget));};
function hash(b,o){let x=2166136261,y=1540483477;for(let i=0;i<54;i++){const v=b[o+i];x=Math.imul(x^v,16777619);y=Math.imul(y^(v+i*11),1540483477);y^=y>>>15;}return (x>>>0)*2097152+((y>>>0)&2097151);}
const inv=m=>m-m%3+2-m%3;
function apply(s,g){const n=new Uint8Array(54);for(let i=0;i<54;i++)n[i]=s[g[i]];return n;}
function walk(map,s){const seq=[];for(;;){const m=map.get(hash(s,0));if(m===255)return seq;seq.push(m);s=apply(s,P[inv(m)]);}}
function search(start,goal,budget){const t0=performance.now();
 const side=s=>({map:new Map([[hash(s,0),255]]),buf:s,last:new Uint8Array([255]),n:1,sizes:[1]}),A=side(start),B=side(goal);
 if(hash(start,0)===hash(goal,0))return {path:[],visited:1,sizes:[[1],[1]],ms:0};let visited=2;
 for(;;){const fromA=A.n<=B.n,S=fromA?A:B,O=fromA?B:A;if(visited+S.n*13.4>budget)break;const out=new Uint8Array(S.n*18*54),last=new Uint8Array(S.n*18);let m=0;
  for(let j=0;j<S.n;j++){const lf=S.last[j],base=j*54;
   for(let mv=0;mv<18;mv++){const f=(mv/3)|0;if(lf!==255&&(f===lf||(f>>1)===(lf>>1)&&f<lf))continue;const g=P[mv],o=m*54;
    for(let i=0;i<54;i++)out[o+i]=S.buf[base+g[i]];const h=hash(out,o);if(S.map.has(h))continue;S.map.set(h,mv);visited++;last[m]=f;m++;
    if(O.map.has(h)){S.sizes.push(m);const meet=out.slice(o,o+54),a=walk(A.map,meet).reverse(),b=walk(B.map,meet).map(inv);
     return {path:a.concat(b),visited,sizes:[A.sizes,B.sizes],ms:performance.now()-t0};}}}
  S.buf=out;S.last=last;S.n=m;S.sizes.push(m);if(!m)break;}
 return {path:null,visited,sizes:[A.sizes,B.sizes],ms:performance.now()-t0};}`;
let J = null;
function wn() {
  return (
    J ||
      ((J = new Worker(
        URL.createObjectURL(new Blob([Mn], { type: "text/javascript" })),
      )),
      J.postMessage({ perms: gn })),
    J
  );
}
function wa(e) {
  const t = new Uint8Array(6);
  for (let o = 0; o < 6; o++) t[e[St[o]]] = o;
  const a = e.map((o) => t[o]),
    n = new Uint8Array(54).map((o, r) => b[r].f);
  return new Promise((o) => {
    const r = wn();
    ((r.onerror = () => {
      (J.terminate(),
        (J = null),
        o({ path: null, visited: 0, sizes: [[1], [1]] }));
    }),
      (r.onmessage = (i) => {
        const c = i.data;
        if (c.path) {
          let l = a;
          (c.path.forEach((u) => (l = Ma(l, At(He[u]).to))),
            W(l) || (c.path = null));
        }
        o({ ...c, moves: c.path?.map((l) => He[l]) });
      }),
      r.postMessage({ start: a, goal: n, budget: 14e5 }));
  });
}
const q = new s.Scene();
((q.background = new s.Color("#333b49")),
  (q.fog = new s.FogExp2("#454d5d", 0.017)));
const k = new s.PerspectiveCamera(30, 1, 0.5, 220);
let x;
try {
  x = new s.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (h("#loading").textContent =
      "This miniature needs WebGL. Please try a browser with graphics acceleration enabled."),
    e
  );
}
const ya = Math.min(devicePixelRatio, 1.5);
let $ = ya;
(x.setPixelRatio($),
  (x.info.autoReset = !1),
  (x.shadowMap.enabled = !0),
  (x.shadowMap.type = s.PCFShadowMap),
  (x.toneMapping = s.ACESFilmicToneMapping),
  (x.toneMappingExposure = 1.12),
  he.appendChild(x.domElement));
const yn = new s.HemisphereLight(10729178, 5654592, 0.82);
q.add(yn);
const R = new s.DirectionalLight(16765606, 1.25);
((R.castShadow = !0),
  R.shadow.mapSize.set(2048, 2048),
  Object.assign(R.shadow.camera, {
    left: -19,
    right: 19,
    top: 19,
    bottom: -19,
    near: 1,
    far: 100,
  }),
  (R.shadow.normalBias = 0.03),
  (R.shadow.bias = -2e-4),
  (R.shadow.radius = 2),
  R.position.set(
    Math.sin(-0.5) * Math.cos(0.92) * 40,
    Math.sin(0.92) * 40,
    Math.cos(-0.5) * Math.cos(0.92) * 40,
  ),
  q.add(R, R.target));
const T = new s.Group();
q.add(T);
const ee = 8,
  te = {
    pos: {
      value: Array.from({ length: ee }, () => new s.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: ee }, () => new s.Vector3()) },
  },
  bn = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${ee};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`;
function pe(e, t) {
  return (
    (e.onBeforeCompile = (a) => {
      (Object.assign(a.uniforms, { uFakePos: te.pos, uFakeCol: te.col }),
        (a.fragmentShader = a.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
uniform vec4 uFakePos[${ee}];uniform vec3 uFakeCol[${ee}];`,
          )
          .replace("#include <lights_fragment_end>", bn)),
        t?.(a));
    }),
    (e.customProgramCacheKey = () => "cg" + (t ? t.key : "")),
    e
  );
}
const Lt = new Map();
function C(e, t = {}) {
  const a =
    e +
    Object.entries(t)
      .map(([n, o]) => n + ":" + (o?.uuid ?? o))
      .join();
  return (
    Lt.has(a) ||
      Lt.set(
        a,
        pe(new s.MeshStandardMaterial({ color: e, roughness: 0.82, ...t })),
      ),
    Lt.get(a)
  );
}
const ba = (e, t) =>
    new s.MeshBasicMaterial({
      color: new s.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  xa = [];
function Sa(e, t, a, n) {
  const o = { p: e.clone(), c: new s.Color(t), r: a, i: n };
  return (xa.push(o), o);
}
const Ve = new s.Vector3();
function xn() {
  const e = xa
    .map(
      (t) => (
        (t.score = t.i / (1 + t.p.distanceToSquared(k.position) * 0.004)),
        t
      ),
    )
    .sort((t, a) => a.score - t.score);
  for (let t = 0; t < ee; t++) {
    const a = e[t];
    if (!a || a.i <= 0) {
      (te.col.value[t].set(0, 0, 0), te.pos.value[t].set(0, -999, 0, 1));
      continue;
    }
    (Ve.copy(a.p).applyMatrix4(k.matrixWorldInverse),
      te.pos.value[t].set(Ve.x, Ve.y, Ve.z, 1 / (a.r * a.r)),
      te.col.value[t].set(a.c.r * a.i, a.c.g * a.i, a.c.b * a.i));
  }
}
const p = new s.Matrix4(),
  D = new s.Quaternion(),
  Aa = new s.Euler(),
  z = new s.Vector3(),
  _ = new s.Vector3(),
  ae = new s.Color(),
  je = (e) => (e.index ? e.toNonIndexed() : e),
  ka = new s.BoxGeometry(1, 1, 1).toNonIndexed(),
  Sn = new s.CylinderGeometry(1, 1, 1, 16).toNonIndexed(),
  An = new s.CylinderGeometry(1, 1, 1, 6).toNonIndexed(),
  kn = new s.IcosahedronGeometry(1, 0),
  ve = () => new s.PlaneGeometry(1, 1).toNonIndexed();
class Pn {
  constructor() {
    this.map = new Map();
  }
  add(t, a, n, o, r, i = 1, c = 1, l = 1, u = 0, g = 0, d = 0) {
    p.compose(
      z.set(n, o, r),
      D.setFromEuler(Aa.set(u, g, d, "YXZ")),
      _.set(i, c, l),
    );
    const m = je(a).clone().applyMatrix4(p);
    return (
      this.map.has(t) || this.map.set(t, []),
      this.map.get(t).push(m),
      this
    );
  }
  box(t, a, n, o, r, i, c, l = 0) {
    return this.add(t, ka, a, n, o, r, i, c, 0, l, 0);
  }
  cyl(t, a, n, o, r, i) {
    return this.add(t, Sn, a, n, o, r, i, r);
  }
  build(t, { cast: a = !0 } = {}) {
    for (const [n, o] of this.map) {
      const r = new s.Mesh(
        de(
          o.map((i) => {
            for (const c of Object.keys(i.attributes))
              ["position", "normal", "uv"].includes(c) || i.deleteAttribute(c);
            return i;
          }),
          !1,
        ),
        n,
      );
      (o.forEach((i) => i.dispose()),
        (r.castShadow = a),
        (r.receiveShadow = !0),
        (r.matrixAutoUpdate = !1),
        r.updateMatrix(),
        t.add(r));
    }
    this.map.clear();
  }
}
let Gt = 31;
function v() {
  return ((Gt = (Gt * 1664525 + 1013904223) >>> 0), Gt / 4294967296);
}
const Ft = (e, t, a, n = !0) => {
    const o = document.createElement("canvas");
    ((o.width = e), (o.height = t), a(o.getContext("2d"), e, t));
    const r = new s.CanvasTexture(o);
    return (n && (r.colorSpace = s.SRGBColorSpace), (r.anisotropy = 8), r);
  },
  Ne = Ft(256, 256, (e) => {
    const t = e.createImageData(256, 256);
    for (let a = 0; a < t.data.length; a += 4) {
      const n = 200 + v() * 55;
      ((t.data[a] = t.data[a + 1] = t.data[a + 2] = n), (t.data[a + 3] = 255));
    }
    e.putImageData(t, 0, 0);
  });
((Ne.wrapS = Ne.wrapT = s.RepeatWrapping), Ne.repeat.set(40, 40));
const ge = Ft(
    128,
    128,
    (e) => {
      const t = e.createRadialGradient(64, 64, 0, 64, 64, 64);
      (t.addColorStop(0, "#fff"),
        t.addColorStop(0.35, "#ffffff88"),
        t.addColorStop(1, "#fff0"),
        (e.fillStyle = t),
        e.fillRect(0, 0, 128, 128));
    },
    !1,
  ),
  ne = 12.75,
  Rt = 9.95,
  Cn = Ft(2048, 2048, (e, t) => {
    const a = t / 2 / ne;
    ((e.fillStyle = "#a79d93"),
      e.fillRect(0, 0, t, t),
      e.translate(t / 2, t / 2));
    for (let n = Rt - 0.3; n < ne; n += 0.82) {
      const o = Math.min(n + 0.82, ne),
        r = Math.max(8, Math.round((Math.PI * 2 * n) / 1.05)),
        i = v();
      for (let c = 0; c < r; c++) {
        const l = ((c + i) / r) * Math.PI * 2,
          u = ((c + 1 + i) / r) * Math.PI * 2,
          g = v() * 16 - 8;
        ((e.fillStyle = `rgb(${222 + g},${211 + g},${199 + g})`),
          e.beginPath(),
          e.arc(0, 0, o * a - 2.5, l + 0.0035, u - 0.0035),
          e.arc(0, 0, n * a + 2.5, u - 0.0035, l + 0.0035, !0),
          e.fill());
      }
    }
  }),
  w = {
    asphalt: C("#40444c", { map: Ne, roughness: 0.5, metalness: 0.15 }),
    mark: C("#d8d4ca", { roughness: 0.7 }),
    curb: C("#9d958d"),
    stone: C("#d4ccc4"),
    dark: C("#23272c", { roughness: 0.6 }),
    trunk: C("#6b4a33"),
    plaza: C("#ffffff", { map: Cn, roughness: 0.9 }),
    slate: C("#252a32", { roughness: 0.46, metalness: 0.12 }),
    brass: C("#c89b5e", { roughness: 0.34, metalness: 0.7 }),
    grass: C("#5d7c43", { roughness: 0.95 }),
    wood: C("#8a5f3f", { roughness: 0.7 }),
    roofBox: C("#8b8f95"),
  },
  Xe = (e, t, a, n = 128) => {
    const o = new s.Shape();
    o.absarc(0, 0, t, 0, Math.PI * 2, !1);
    const r = new s.Path();
    (r.absarc(0, 0, e, 0, Math.PI * 2, !0), o.holes.push(r));
    const i = new s.ExtrudeGeometry(o, {
      depth: a,
      bevelEnabled: !1,
      curveSegments: n,
    });
    return (i.rotateX(-Math.PI / 2), i);
  },
  Bt = (e, t, a = 128) => new s.CylinderGeometry(e, e, t, a, 1),
  S = new Pn();
(S.box(w.asphalt, 0, -0.05, 0, 260, 0.1, 260),
  S.add(w.curb, Bt(ne + 0.18, 0.17), 0, 0.085, 0),
  S.add(w.plaza, Bt(ne, 0.02), 0, 0.18, 0),
  S.add(w.slate, Bt(Rt, 0.03), 0, 0.2, 0),
  S.add(
    w.brass,
    new s.TorusGeometry(Rt + 0.02, 0.055, 8, 200),
    0,
    0.205,
    0,
    1,
    1,
    1,
    Math.PI / 2,
  ),
  S.add(w.grass, Xe(ne + 0.18, 14.15, 0.12), 0, 0, 0),
  S.add(w.curb, Xe(14.15, 14.3, 0.16), 0, 0, 0),
  S.add(w.curb, Xe(18.1, 18.26, 0.17), 0, 0, 0),
  S.add(w.stone, Xe(18.26, 21, 0.17), 0, 0, 0));
for (let e = 0; e < 96; e++) {
  const t = (e / 96) * Math.PI * 2;
  Math.abs(Math.cos(2 * t)) < 0.2 ||
    S.box(
      w.mark,
      Math.sin(t) * 16.2,
      0.006,
      Math.cos(t) * 16.2,
      0.62,
      0.012,
      0.09,
      t,
    );
}
for (const e of [14.55, 17.85])
  for (let t = 0; t < 160; t++) {
    const a = ((t + 0.5) / 160) * Math.PI * 2;
    S.box(
      w.mark,
      Math.sin(a) * e,
      0.005,
      Math.cos(a) * e,
      (Math.PI * 2 * e) / 160 + 0.02,
      0.01,
      0.06,
      a,
    );
  }
for (let e = 0; e < 4; e++) {
  const t = (e * Math.PI) / 2 + Math.PI / 4;
  for (let a = 0; a < 8; a++) {
    const n = -1.4 + a * 0.4;
    S.box(
      w.mark,
      Math.sin(t) * 16.2 + Math.cos(t) * n,
      0.008,
      Math.cos(t) * 16.2 - Math.sin(t) * n,
      0.22,
      0.014,
      2.9,
      t,
    );
  }
}
const Me = [],
  we = [],
  Pa = [];
for (let e = 0; e < 12; e++) {
  const t = ((e + 0.5) / 12) * Math.PI * 2;
  Me.push([Math.sin(t) * 12.3, Math.cos(t) * 12.3]);
}
for (let e = 0; e < 8; e++) {
  const t = ((e + 0.25) / 8) * Math.PI * 2;
  Pa.push(t);
  const a = Math.sin(t) * 11.35,
    n = Math.cos(t) * 11.35;
  (S.box(w.wood, a, 0.52, n, 1.5, 0.07, 0.46, t),
    S.box(
      w.wood,
      a + Math.sin(t) * 0.24,
      0.78,
      n + Math.cos(t) * 0.24,
      1.5,
      0.3,
      0.06,
      t,
    ));
  for (const o of [-0.6, 0.6])
    S.box(
      w.dark,
      a + Math.cos(t) * o,
      0.35,
      n - Math.sin(t) * o,
      0.07,
      0.34,
      0.4,
      t,
    );
}
for (let e = 0; e < 18; e++) {
  const t = ((e + 0.5) / 18) * Math.PI * 2;
  Math.abs(Math.cos(2 * t)) < 0.2 ||
    we.push([Math.sin(t) * 13.5, Math.cos(t) * 13.5, 0.95 + v() * 0.25, 0.12]);
}
for (let e = 0; e < 30; e++) {
  const t = ((e + 0.5) / 30) * Math.PI * 2;
  Math.abs(Math.cos(2 * t)) < 0.14 ||
    we.push([Math.sin(t) * 20.2, Math.cos(t) * 20.2, 0.8 + v() * 0.3, 0.17]);
}
const Dt = [];
for (const [e, t, a] of [
  [24.5, 3, 4],
  [31.5, 4.5, 6],
  [39, 6, 8],
  [48, 8, 10],
  [60, 10, 12],
]) {
  const n = Math.round((Math.PI * 2 * e) / (e < 30 ? 6.2 : 7.5));
  for (let o = 0; o < n; o++) {
    const r = ((o + v() * 0.3) / n) * Math.PI * 2;
    if (Math.abs(Math.cos(2 * r)) < 0.13) continue;
    const i = ((Math.PI * 2 * e) / n) * (0.62 + v() * 0.2),
      c = 4 + v() * 2.5,
      l = t + v() * a,
      u = e + (v() - 0.5) * 1.5;
    (Dt.push([Math.sin(r) * u, l / 2 + 0.17, Math.cos(r) * u, i, l, c, r]),
      v() < 0.5 &&
        S.box(
          w.roofBox,
          Math.sin(r) * u,
          l + 0.42,
          Math.cos(r) * u,
          0.8,
          0.5,
          0.6,
          r,
        ));
  }
}
S.build(T);
const Tn = pe(
    new s.MeshStandardMaterial({ color: "#9ba1a9", roughness: 0.85 }),
    Object.assign(
      (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWP;varying vec3 vWN;varying vec2 vSpan;varying float vAng;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
 vec4 wp=modelMatrix*instanceMatrix*vec4(transformed,1.);vWP=wp.xyz;vWN=normalize(mat3(instanceMatrix)*objectNormal);vSpan=vec2((instanceMatrix*vec4(0,-.5,0,1)).y,(instanceMatrix*vec4(0,.5,0,1)).y);vec3 ix=normalize(mat3(instanceMatrix)*vec3(1,0,0));vAng=atan(ix.z,ix.x);`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vWP;varying vec3 vWN;varying vec2 vSpan;varying float vAng;float hh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
 if(abs(vWN.y)<.5){vec2 lp=mat2(cos(vAng),-sin(vAng),sin(vAng),cos(vAng))*vWP.xz;float u=abs(dot(vWN.xz,vec2(cos(vAng),sin(vAng))))>.5?lp.y:lp.x;vec2 cell=vec2(floor(u/.62),floor((vWP.y-vSpan.x)/.78));vec2 f=vec2(fract(u/.62),fract((vWP.y-vSpan.x)/.78));
  float inside=step(.22,f.x)*step(f.x,.78)*step(.28,f.y)*step(f.y,.8)*step(1.,cell.y)*step(vWP.y,vSpan.y-.35);
  float r=hh(cell+floor(vWP.xz*.37));float lit=step(.5,r)*inside;
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.16,.18,.22),inside);
  totalEmissiveRadiance+=lit*mix(vec3(1.,.62,.3),vec3(1.,.85,.6),hh(cell.yx))*(.5+r*1.1);
  float shop=step(vWP.y-vSpan.x,.62)*step(.1,f.x)*step(f.x,.9)*step(.2,vWP.y-vSpan.x);totalEmissiveRadiance+=shop*vec3(1.,.7,.4)*.9*step(.25,hh(vec2(cell.x,7.)));}
 else diffuseColor.rgb*=.62;`,
            )));
      },
      { key: "city" },
    ),
  ),
  Ke = new s.InstancedMesh(ka, Tn, Dt.length);
(Dt.forEach(([e, t, a, n, o, r, i], c) => {
  (p.compose(
    z.set(e, t, a),
    D.setFromAxisAngle(_.set(0, 1, 0), i),
    _.set(n, o, r),
  ),
    Ke.setMatrixAt(c, p));
}),
  (Ke.castShadow = Ke.receiveShadow = !0),
  T.add(Ke));
const En = [
    [0, 1.75, 0, 0.62],
    [-0.3, 1.42, 0.2, 0.46],
    [0.28, 1.5, -0.18, 0.5],
    [0.05, 2.18, 0.05, 0.44],
  ],
  ye = new s.InstancedMesh(
    kn,
    C("#ffffff", { flatShading: !0 }),
    we.length * 4,
  ),
  zt = new s.InstancedMesh(An, w.trunk, we.length);
(we.forEach(([e, t, a, n], o) => {
  (p.compose(
    z.set(e, n + 0.65 * a, t),
    D.identity(),
    _.set(0.08 * a, 1.3 * a, 0.08 * a),
  ),
    zt.setMatrixAt(o, p),
    En.forEach(([r, i, c, l], u) => {
      (p.compose(
        z.set(e + r * a, n + i * a, t + c * a),
        D.setFromEuler(Aa.set(0, o + u, 0)),
        _.set(l * a, l * a * 1.05, l * a),
      ),
        ye.setMatrixAt(o * 4 + u, p),
        ye.setColorAt(o * 4 + u, ae.set(u % 2 ? "#5b8a3c" : "#6f9a47")));
    }));
}),
  (ye.castShadow = zt.castShadow = !0),
  (ye.receiveShadow = !0),
  T.add(ye, zt));
const In = de(
    [
      new s.CylinderGeometry(0.07, 0.1, 0.22, 8).translate(0, 0.28, 0),
      new s.CylinderGeometry(0.035, 0.045, 2.3, 6).translate(0, 1.5, 0),
      new s.CylinderGeometry(0.05, 0.18, 0.16, 6).translate(0, 2.93, 0),
      new s.BoxGeometry(0.2, 0.04, 0.2).translate(0, 2.52, 0),
    ].map(je),
  ),
  _t = new s.InstancedMesh(In, w.dark, Me.length),
  Ca = new s.InstancedMesh(
    new s.CylinderGeometry(0.12, 0.09, 0.34, 6).translate(0, 2.7, 0),
    ba("#ffd9a0", 3.2),
    Me.length,
  ),
  Ye = new s.InstancedMesh(
    ve().rotateX(-Math.PI / 2),
    new s.MeshBasicMaterial({
      map: ge,
      color: "#ffb36b",
      transparent: !0,
      opacity: 0.46,
      blending: s.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    }),
    Me.length,
  );
(Me.forEach(([e, t], a) => {
  (p.makeTranslation(e, 0.17, t),
    _t.setMatrixAt(a, p),
    Ca.setMatrixAt(a, p),
    p.compose(z.set(e, 0.21, t), D.identity(), _.set(4.4, 1, 4.4)),
    Ye.setMatrixAt(a, p),
    Sa(new s.Vector3(e, 2.6, t), "#ffbf7a", 3.9, 1.9));
}),
  (_t.castShadow = !0),
  (Ye.renderOrder = 1),
  T.add(_t, Ca, Ye));
const oe = [Ye],
  Un = new s.PMREMGenerator(x),
  Qe = new s.Scene();
Qe.add(
  new s.Mesh(
    new s.SphereGeometry(50, 32, 16),
    new s.ShaderMaterial({
      side: s.BackSide,
      vertexShader:
        "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "varying vec3 d;void main(){vec3 c=mix(vec3(.22,.2,.21),vec3(.95,.62,.44),smoothstep(-.3,.04,d.y));c=mix(c,vec3(.3,.38,.58),smoothstep(.04,.7,d.y));gl_FragColor=vec4(c,1.);}",
    }),
  ),
);
for (let e = 0; e < 10; e++) {
  const t = (e / 10) * Math.PI * 2,
    a = new s.Mesh(
      new s.SphereGeometry(1.6, 12, 8),
      new s.MeshBasicMaterial({ color: new s.Color(7, 4.6, 2.6) }),
    );
  (a.position.set(Math.sin(t) * 30, 3 + (e % 3), Math.cos(t) * 30), Qe.add(a));
}
{
  const e = new s.Mesh(
    new s.SphereGeometry(7, 16, 8),
    new s.MeshBasicMaterial({ color: new s.Color(5, 3.8, 2.8) }),
  );
  (e.position.copy(R.position).setLength(40), Qe.add(e));
}
const Ot = Un.fromScene(Qe, 0.03).texture;
function Ta(e, t) {
  const a = { value: t };
  return (
    pe(
      e,
      Object.assign(
        (n) => {
          ((n.uniforms.uGlow = a),
            (n.vertexShader = n.vertexShader
              .replace(
                "#include <common>",
                `#include <common>
attribute float iGlow;varying float vGlow;`,
              )
              .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
vGlow=iGlow;`,
              )),
            (n.fragmentShader = n.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
uniform float uGlow;varying float vGlow;`,
              )
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
totalEmissiveRadiance+=diffuseColor.rgb*(uGlow+vGlow);`,
              )));
        },
        { key: "glow" },
      ),
    ),
    (e.userData.glow = a),
    e
  );
}
const Ea = (e, t) => {
    const a = new s.InstancedBufferAttribute(new Float32Array(t), 1).setUsage(
      s.DynamicDrawUsage,
    );
    return (e.setAttribute("iGlow", a), a);
  },
  Wt = 4.7,
  qt = 1.05,
  Ze = 10,
  Ia = (e, t, a) => (
    (a.x = Ze * 0.7071 * (e - t)),
    (a.z = -Ze * 0.7071 * (e + t)),
    a
  ),
  Ln = B.map((e) => {
    const t = new s.RingGeometry(
        Ze * e.r - 0.032,
        Ze * e.r + 0.032,
        320,
        1,
      ).rotateX(-Math.PI / 2),
      a = new s.Mesh(t, new s.MeshBasicMaterial({ color: "#ffe0c0" }));
    return (
      Ia(e.c[0], e.c[1], a.position),
      (a.position.y = 0.217),
      (a.userData.level = 0.5),
      T.add(a),
      a
    );
  }),
  Ua = new s.CylinderGeometry(0.26, 0.28, 0.09, 32),
  La = Ea(Ua, 54),
  se = new s.InstancedMesh(
    Ua,
    Ta(
      new s.MeshStandardMaterial({
        roughness: 0.3,
        envMap: Ot,
        envMapIntensity: 0.5,
      }),
      0.42,
    ),
    54,
  ),
  re = new s.InstancedMesh(
    ve().rotateX(-Math.PI / 2),
    new s.MeshBasicMaterial({
      map: ge,
      transparent: !0,
      opacity: 0.34,
      blending: s.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    }),
    54,
  );
for (const e of [se, re])
  (e.instanceMatrix.setUsage(s.DynamicDrawUsage),
    (e.frustumCulled = !1),
    T.add(e));
((se.castShadow = !0),
  (se.receiveShadow = !0),
  (re.renderOrder = 1),
  oe.push(re));
const be = new s.Mesh(
  ve().rotateX(-Math.PI / 2),
  new s.MeshBasicMaterial({
    map: ge,
    color: "#ffcf9e",
    transparent: !0,
    opacity: 0.22,
    blending: s.AdditiveBlending,
    depthWrite: !1,
    fog: !1,
  }),
);
(be.scale.set(9, 1, 9),
  (be.position.y = 0.22),
  (be.renderOrder = 1),
  T.add(be),
  oe.push(be),
  Sa(new s.Vector3(0, 2.4, 0), "#ffd8b0", 7.5, 0.75));
{
  const e = new s.Mesh(new s.CylinderGeometry(0.6, 0.68, 0.1, 48), w.brass),
    t = new s.Mesh(
      new s.CylinderGeometry(0.44, 0.44, 0.02, 48),
      ba("#ffd9b0", 1.5),
    );
  ((e.position.y = 0.25),
    (t.position.y = 0.305),
    (e.castShadow = e.receiveShadow = !0),
    T.add(e, t));
  const a = new s.Mesh(
    new s.CylinderGeometry(1.5, 0.44, 1, 40, 1, !0).translate(0, 0.5, 0),
    new s.ShaderMaterial({
      transparent: !0,
      depthWrite: !1,
      blending: s.AdditiveBlending,
      side: s.DoubleSide,
      vertexShader:
        "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "varying vec2 vUv;void main(){float a=pow(max(1.-vUv.y,0.),2.2)*.1;gl_FragColor=vec4(vec3(1.,.82,.62)*a,1.);}",
    }),
  );
  ((a.position.y = 0.31),
    (a.scale.y = Wt - 1.9),
    (a.renderOrder = 2),
    T.add(a),
    oe.push(a));
}
const ie = new s.Group();
((ie.position.y = Wt), ie.scale.setScalar(1.14), T.add(ie));
const xe = [];
for (const e of [-1, 0, 1])
  for (const t of [-1, 0, 1])
    for (const a of [-1, 0, 1])
      (e || t || a) &&
        xe.push({
          pos: [e, t, a],
          basis: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ],
          m: new s.Matrix4(),
        });
const Gn = (e) => xe.findIndex((t) => t.pos.join() === e.join()),
  $t = new s.InstancedMesh(
    new rn(1, 1, 1, 3, 0.09),
    new s.MeshStandardMaterial({
      color: "#15171c",
      roughness: 0.36,
      metalness: 0.08,
      envMap: Ot,
      envMapIntensity: 0.8,
    }),
    26,
  ),
  Fn = (() => {
    const e = new s.Shape(),
      t = 0.39,
      a = 0.14;
    return (
      e.moveTo(-t + a, -t),
      e.lineTo(t - a, -t),
      e.quadraticCurveTo(t, -t, t, -t + a),
      e.lineTo(t, t - a),
      e.quadraticCurveTo(t, t, t - a, t),
      e.lineTo(-t + a, t),
      e.quadraticCurveTo(-t, t, -t, t - a),
      e.lineTo(-t, -t + a),
      e.quadraticCurveTo(-t, -t, -t + a, -t),
      e
    );
  })(),
  Ga = new s.ExtrudeGeometry(Fn, {
    depth: 0.015,
    bevelEnabled: !0,
    bevelThickness: 0.014,
    bevelSize: 0.014,
    bevelSegments: 2,
    curveSegments: 6,
  }),
  Fa = Ea(Ga, 54),
  Je = new s.InstancedMesh(
    Ga,
    Ta(
      new s.MeshStandardMaterial({
        roughness: 0.24,
        envMap: Ot,
        envMapIntensity: 0.65,
      }),
      0.1,
    ),
    54,
  );
for (const e of [$t, Je])
  (e.instanceMatrix.setUsage(s.DynamicDrawUsage),
    (e.castShadow = e.receiveShadow = !0),
    (e.frustumCulled = !1),
    ie.add(e));
const N = b.map((e, t) => {
  const a = new s.Vector3(...[0, 1, 2].map((n) => (n === e.a ? e.s : 0)));
  return {
    colour: e.f,
    slot: t,
    cubie: Gn(e.p),
    local: new s.Matrix4().compose(
      a.clone().multiplyScalar(0.497),
      new s.Quaternion().setFromUnitVectors(new s.Vector3(0, 0, 1), a),
      new s.Vector3(1, 1, 1),
    ),
  };
});
N.forEach((e, t) => {
  (Je.setColorAt(t, ae.set(xt[e.colour])),
    se.setColorAt(t, ae),
    re.setColorAt(
      t,
      ae.set(xt[e.colour]).multiplyScalar(e.colour === 3 ? 0.35 : 0.55),
    ));
});
const Se = new Int16Array(54).map((e, t) => t),
  Ra = new s.Matrix4(),
  Rn = [new s.Vector3(1, 0, 0), new s.Vector3(0, 1, 0), new s.Vector3(0, 0, 1)],
  Bn = [new s.Vector3(), new s.Vector3(), new s.Vector3()];
function Dn(e, t) {
  (e && Ra.makeRotationAxis(Rn[e.a], t),
    xe.forEach((a, n) => {
      (a.m
        .makeBasis(...Bn.map((o, r) => o.fromArray(a.basis[r])))
        .setPosition(a.pos[0] * qt, a.pos[1] * qt, a.pos[2] * qt),
        e && a.pos[e.a] === e.layer && a.m.premultiply(Ra),
        $t.setMatrixAt(n, a.m));
    }),
    N.forEach((a, n) => {
      (p.multiplyMatrices(xe[a.cubie].m, a.local), Je.setMatrixAt(n, p));
    }),
    ($t.instanceMatrix.needsUpdate = Je.instanceMatrix.needsUpdate = !0));
}
function zn(e) {
  xe.forEach((a) => {
    a.pos[e.a] === e.layer &&
      ((a.pos = $e(a.pos, e.a, e.q)),
      (a.basis = a.basis.map((n) => $e(n, e.a, e.q))));
  });
  const t = Se.slice();
  for (let a = 0; a < 54; a++) Se[e.to[a]] = t[a];
  Se.forEach((a, n) => (N[a].slot = n));
}
function P(e, t, a, n, o, r, i, c = 0, l = 0) {
  const u = je(new s.BoxGeometry(e, t, a)).translate(n, o, r),
    g = u.attributes.position.count;
  for (const [d, m] of [
    ["aPart", i],
    ["aSwing", c],
    ["aPivot", l],
  ])
    u.setAttribute(d, new s.BufferAttribute(new Float32Array(g).fill(m), 1));
  return u;
}
const Ht = de([
    P(0.12, 0.34, 0.11, 0, 0.21, 0.07, 0, 1, 0.4),
    P(0.12, 0.34, 0.11, 0, 0.21, -0.07, 0, -1, 0.4),
    P(0.17, 0.06, 0.12, 0.025, 0.03, 0.07, 4, 1, 0.4),
    P(0.17, 0.06, 0.12, 0.025, 0.03, -0.07, 4, -1, 0.4),
    P(0.2, 0.36, 0.3, 0, 0.56, 0, 1),
    P(0.09, 0.3, 0.08, 0, 0.57, 0.19, 1, -1, 0.72),
    P(0.09, 0.3, 0.08, 0, 0.57, -0.19, 1, 1, 0.72),
    P(0.08, 0.08, 0.08, 0, 0.39, 0.19, 2, -1, 0.72),
    P(0.08, 0.08, 0.08, 0, 0.39, -0.19, 2, 1, 0.72),
    P(0.3, 0.28, 0.3, 0, 0.89, 0, 2),
    P(0.32, 0.08, 0.32, -0.01, 1.05, 0, 3),
    P(0.07, 0.2, 0.32, -0.13, 0.95, 0, 3),
    P(0.02, 0.05, 0.04, 0.141, 0.9, 0.065, 5),
    P(0.02, 0.05, 0.04, 0.141, 0.9, -0.065, 5),
  ]),
  Vt = { value: 0 },
  _n = pe(
    new s.MeshStandardMaterial({ roughness: 0.8 }),
    Object.assign(
      (e) => {
        ((e.uniforms.uTime = Vt),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
attribute float aPart;attribute float aSwing;attribute float aPivot;attribute vec3 iShirt;attribute vec3 iPants;attribute vec3 iHair;attribute vec3 iSkin;attribute vec2 iAnim;uniform float uTime;varying vec3 vPCol;`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
float ph=uTime*9.+iAnim.x*6.2832;float sw=sin(ph)*.55*iAnim.y*aSwing;
transformed.y-=aPivot;float cs=cos(sw),sn=sin(sw);transformed.xy=vec2(cs*transformed.x-sn*transformed.y,sn*transformed.x+cs*transformed.y);transformed.y+=aPivot+abs(cos(ph))*.028*iAnim.y;
vPCol=aPart<.5?iPants:aPart<1.5?iShirt:aPart<2.5?iSkin:aPart<3.5?iHair:aPart<4.5?vec3(.05):vec3(.01);`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vPCol;`,
            )
            .replace(
              "#include <color_fragment>",
              `#include <color_fragment>
diffuseColor.rgb=vPCol;`,
            )));
      },
      { key: "people" },
    ),
  ),
  On = [
    "#f1ede6",
    "#d0463b",
    "#3f6cb0",
    "#4f9a6a",
    "#e7c24a",
    "#e58fb0",
    "#8f98a3",
    "#2c3036",
    "#e3793d",
    "#7bb7d8",
    "#a4d06a",
  ],
  Wn = ["#2f3a55", "#26282c", "#5d6570", "#a58e6b", "#3b4d3f"],
  qn = [
    "#3a2a20",
    "#1d1b1a",
    "#d9b36a",
    "#f4f2ee",
    "#4a3327",
    "#6d4a33",
    "#2a2422",
    "#9a9ea4",
  ],
  $n = ["#f0c9a8", "#d6a27c", "#a8714c", "#f6d8bf"],
  et = (e) => e[Math.floor(v() * e.length)],
  Ae = [],
  tt = (e) => (
    Object.assign(e, {
      phase: v(),
      scale: 0.7 + v() * 0.12,
      shirt: et(On),
      pants: et(Wn),
      hair: et(qn),
      skin: et($n),
    }),
    Ae.push(e),
    e
  );
for (let e = 0; e < 17; e++) {
  const t = ((e + v() * 0.6) / 17) * Math.PI * 2,
    a = 2 + Math.floor(v() * 5);
  for (let n = 0; n < a; n++) {
    const o = t + (n - a / 2) * 0.055 + (v() - 0.5) * 0.03,
      r = 10.3 + v() * 0.7;
    tt({
      kind: "idle",
      x: Math.sin(o) * r,
      z: Math.cos(o) * r,
      y: 0.19,
      h: Math.atan2(Math.cos(o) * r, -Math.sin(o) * r) + (v() - 0.5) * 0.5,
    });
  }
}
Pa.forEach((e) => {
  for (const t of [-0.36, 0.34])
    tt({
      kind: "idle",
      x: Math.sin(e) * 11.3 + Math.cos(e) * t,
      z: Math.cos(e) * 11.3 - Math.sin(e) * t,
      y: 0.38,
      h: Math.atan2(Math.cos(e), -Math.sin(e)),
      sit: !0,
    });
});
for (let e = 0; e < 34; e++) {
  const t = e % 2 ? 1 : -1;
  tt({
    kind: "walk",
    r: t > 0 ? 11.8 : 12.02,
    a0: (e / 34) * Math.PI * 2 + v() * 0.1,
    dir: t,
    speed: 0.36 + v() * 0.12,
    y: 0.19,
  });
}
for (let e = 0; e < 30; e++) {
  const t = e % 2 ? 1 : -1;
  tt({
    kind: "walk",
    r: t > 0 ? 19.1 : 19.7,
    a0: (e / 30) * Math.PI * 2 + v() * 0.15,
    dir: t,
    speed: 0.38 + v() * 0.1,
    y: 0.17,
  });
}
const ke = Ae.length,
  Pe = new s.InstancedMesh(Ht, _n, ke),
  Hn = (e) => {
    const t = new Float32Array(ke * 3);
    return (
      Ae.forEach((a, n) => ae.set(a[e]).toArray(t, n * 3)),
      new s.InstancedBufferAttribute(t, 3)
    );
  };
for (const e of ["shirt", "pants", "hair", "skin"])
  Ht.setAttribute("i" + e[0].toUpperCase() + e.slice(1), Hn(e));
const Vn = new s.InstancedBufferAttribute(
  new Float32Array(Ae.flatMap((e) => [e.phase, e.kind === "walk" ? 1 : 0])),
  2,
);
(Ht.setAttribute("iAnim", Vn), (Pe.castShadow = !0), (Pe.receiveShadow = !0));
const Ba = (e, t) => {
    e = je(e);
    const a = new s.Color(t),
      n = e.attributes.position.count,
      o = new Float32Array(n * 3);
    for (let r = 0; r < n; r++) a.toArray(o, r * 3);
    return (e.setAttribute("color", new s.BufferAttribute(o, 3)), e);
  },
  H = (e, t, a, n, o, r, i) =>
    Ba(new s.BoxGeometry(e, t, a).translate(n, o, r), i),
  at = (e, t) =>
    Ba(
      new s.CylinderGeometry(0.13, 0.13, 0.1, 10)
        .rotateX(Math.PI / 2)
        .translate(e, 0.15, t),
      "#1a1c1f",
    ),
  jn = de([
    H(1.3, 0.34, 0.62, 0, 0.34, 0, "#fff"),
    H(0.72, 0.3, 0.56, -0.06, 0.64, 0, "#fff"),
    H(0.5, 0.24, 0.58, 0.02, 0.64, 0, "#2a3038"),
    H(0.74, 0.24, 0.5, -0.06, 0.64, 0, "#2a3038"),
    at(-0.4, -0.3),
    at(0.4, -0.3),
    at(-0.4, 0.3),
    at(0.4, 0.3),
  ]),
  Nn = de([
    H(0.04, 0.07, 0.12, 0.66, 0.38, -0.2, "#fff"),
    H(0.04, 0.07, 0.12, 0.66, 0.38, 0.2, "#fff"),
    H(0.03, 0.06, 0.14, -0.66, 0.38, -0.2, "#ff2b1a"),
    H(0.03, 0.06, 0.14, -0.66, 0.38, 0.2, "#ff2b1a"),
  ]),
  Da = [
    "#e9b73c",
    "#f2efe8",
    "#8aa396",
    "#a8b3c0",
    "#d98e72",
    "#4f5968",
    "#c9cbd0",
    "#7b8fb0",
    "#b54a3a",
  ],
  V = [];
for (const [e, t, a] of [
  [15.25, 1, 8],
  [17.05, -1, 9],
])
  for (let n = 0; n < a; n++)
    V.push({
      r: e,
      dir: t,
      a0: ((n + v() * 0.35) / a) * Math.PI * 2,
      speed: 2.1,
      color: Da[V.length % Da.length],
    });
const Ce = new s.InstancedMesh(
    jn,
    pe(
      new s.MeshStandardMaterial({
        vertexColors: !0,
        roughness: 0.4,
        metalness: 0.2,
      }),
    ),
    V.length,
  ),
  jt = new s.InstancedMesh(
    Nn,
    new s.MeshBasicMaterial({
      vertexColors: !0,
      color: new s.Color(5, 4.4, 3.4),
      fog: !1,
    }),
    V.length,
  );
(V.forEach((e, t) => Ce.setColorAt(t, ae.set(e.color))), (Ce.castShadow = !0));
const Te = new s.InstancedMesh(
    ve().rotateX(-Math.PI / 2),
    new s.MeshBasicMaterial({
      map: ge,
      color: "#ffe2b0",
      transparent: !0,
      opacity: 0.3,
      blending: s.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    }),
    V.length,
  ),
  Ee = new s.InstancedMesh(
    ve().rotateX(-Math.PI / 2),
    new s.MeshBasicMaterial({
      map: ge,
      color: "#000",
      transparent: !0,
      opacity: 0.42,
      depthWrite: !1,
    }),
    ke + V.length,
  );
for (const e of [Pe, Ce, jt, Te, Ee])
  (e.instanceMatrix.setUsage(s.DynamicDrawUsage),
    (e.frustumCulled = !1),
    T.add(e));
((Te.renderOrder = Ee.renderOrder = 1), oe.push(Te, Ee));
const Xn = Pe.instanceMatrix.array,
  za = Ee.instanceMatrix.array;
function Nt(e, t, a, n, o, r, i, c, l) {
  const u = Math.cos(r),
    g = Math.sin(r),
    d = t * 16;
  ((e[d] = u * i),
    (e[d + 1] = 0),
    (e[d + 2] = -g * i),
    (e[d + 3] = 0),
    (e[d + 4] = 0),
    (e[d + 5] = c),
    (e[d + 6] = 0),
    (e[d + 7] = 0),
    (e[d + 8] = g * l),
    (e[d + 9] = 0),
    (e[d + 10] = u * l),
    (e[d + 11] = 0),
    (e[d + 12] = a),
    (e[d + 13] = n),
    (e[d + 14] = o),
    (e[d + 15] = 1));
}
function Kn(e) {
  (Ae.forEach((t, a) => {
    let n = t.x,
      o = t.z,
      r = t.h;
    const i = t.scale,
      c = t.sit ? i * 0.78 : i;
    if (t.kind === "walk") {
      const l = t.a0 + (t.dir * t.speed * e) / t.r;
      ((n = Math.sin(l) * t.r),
        (o = Math.cos(l) * t.r),
        (r = l + (t.dir > 0 ? 0 : Math.PI)));
    } else t.sit || (r += Math.sin(e * 0.3 + t.phase * 30) * 0.18);
    (Nt(Xn, a, n, t.y, o, r, i, c, i),
      Nt(za, a, n, t.y + 0.006, o, 0, 0.62, 1, 0.62));
  }),
    V.forEach((t, a) => {
      const n = t.a0 + (t.dir * t.speed * e) / t.r,
        o = Math.sin(n) * t.r,
        r = Math.cos(n) * t.r,
        i = n + (t.dir > 0 ? 0 : Math.PI);
      (D.setFromAxisAngle(z.set(0, 1, 0), i),
        p.compose(_.set(o, 0.02, r), D, z.set(1, 1, 1)),
        Ce.setMatrixAt(a, p),
        jt.setMatrixAt(a, p),
        p.compose(
          _.set(o + Math.cos(i) * 2.2, 0.03, r - Math.sin(i) * 2.2),
          D,
          z.set(3.2, 1, 1.7),
        ),
        Te.setMatrixAt(a, p),
        Nt(za, ke + a, o, 0.012, r, i, 1.9, 1, 1.1));
    }));
  for (const t of [Pe, Ce, jt, Te, Ee]) t.instanceMatrix.needsUpdate = !0;
}
const Yn =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  nt = (e, t) =>
    new s.ShaderMaterial({
      uniforms: t,
      vertexShader: Yn,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class Qn extends da {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new s.WebGLRenderTarget(1, 1, {
        type: s.HalfFloatType,
        samples: t,
      })),
      (this.quad = new qe(
        nt(
          "uniform sampler2D t;varying vec2 vUv;void main(){gl_FragColor=texture2D(t,vUv);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, a) {
    this.rt.setSize(t, a);
  }
  render(t, a, n) {
    (t.setRenderTarget(this.rt),
      t.clear(),
      t.render(q, k),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const Zn = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float viewDist(vec2 uv){float d=texture2D(tDepth,uv).x;return near*far/((far-near)*d-far)*-1.;}
float coc(vec2 uv){float z=viewDist(uv)-focus;float c=max(abs(z)-range,0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}`;
class Jn extends da {
  constructor() {
    super();
    const t = { type: s.HalfFloatType };
    ((this.half = new s.WebGLRenderTarget(1, 1, t)),
      (this.blurRT = new s.WebGLRenderTarget(1, 1, t)),
      (this.u = {
        tColor: { value: null },
        tDepth: { value: null },
        tHalf: { value: this.half.texture },
        tBlur: { value: this.blurRT.texture },
        near: { value: k.near },
        far: { value: k.far },
        focus: { value: 20 },
        range: { value: 3.2 },
        cocScale: { value: new s.Vector2(2.2, 0.85) },
        maxCoc: { value: 13 },
        texel: { value: new s.Vector2() },
        fullTexel: { value: new s.Vector2() },
      }),
      (this.pre = new qe(
        nt(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Zn}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   gl_FragColor=vec4(min(c,vec3(24.)),coc(vUv));}`,
          this.u,
        ),
      )),
      (this.blur = new qe(
        nt(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;float r=1.6;float ang=0.;
   for(int i=0;i<64;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.2/r;}
   gl_FragColor=vec4(col/tot,max(cc,near));}`,
          this.u,
        ),
      )),
      (this.comp = new qe(
        nt(
          `uniform sampler2D tColor;uniform sampler2D tBlur;varying vec2 vUv;
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,b.a)),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(t, a) {
    const n = Math.ceil(t / 2),
      o = Math.ceil(a / 2);
    (this.half.setSize(n, o),
      this.blurRT.setSize(n, o),
      this.u.texel.value.set(1 / n, 1 / o),
      this.u.fullTexel.value.set(1 / t, 1 / a));
  }
  render(t, a, n) {
    ((this.u.tColor.value = n.texture),
      t.setRenderTarget(this.half),
      this.pre.render(t),
      t.setRenderTarget(this.blurRT),
      this.blur.render(t),
      t.setRenderTarget(this.renderToScreen ? null : a),
      this.comp.render(t));
  }
}
const eo = ya >= 1.5 ? 2 : 4,
  O = new nn(
    x,
    new s.WebGLRenderTarget(1, 1, { type: s.HalfFloatType, depthBuffer: !1 }),
  );
(O.setPixelRatio($), O.addPass(new Qn(eo)));
const A = new ha(q, k, 1, 1);
((A.output = ha.OUTPUT.Off),
  (A.needsSwap = !1),
  A.updateGtaoMaterial({
    radius: 0.5,
    thickness: 0.9,
    distanceExponent: 1.5,
    distanceFallOff: 0.9,
    scale: 1.1,
    samples: 12,
  }),
  A.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const to = A.setSize.bind(A),
  ao = A.render.bind(A);
((A.setSize = (e, t) => to(Math.ceil(e / 2), Math.ceil(t / 2))),
  (A.render = (e, t, a) => {
    (oe.forEach((n) => (n.visible = !1)),
      ao(e, t, a),
      oe.forEach((n) => (n.visible = !0)),
      (A.blendMaterial.uniforms.intensity.value = 0.8),
      (A.blendMaterial.uniforms.tDiffuse.value = A.pdRenderTarget.texture),
      A._renderPass(e, A.blendMaterial, a));
  }),
  O.addPass(A));
const ot = new on(new s.Vector2(256, 256), 0.55, 0.6, 0.95),
  no = ot.setSize.bind(ot);
((ot.setSize = (e, t) => no(Math.ceil(e / 2), Math.ceil(t / 2))),
  O.addPass(ot));
const Ie = new Jn();
((Ie.u.tDepth.value = A.depthTexture), O.addPass(Ie), O.addPass(new sn()));
const st = new s.Vector3(0, 2.7, 0),
  oo = new s.Vector3(0, 3.2, 0),
  _a = Math.PI / 4 - 0.2,
  Oa = 0.6;
let Ue = _a,
  X = Oa,
  K = 1,
  Wa = 27,
  Le = !1,
  j = 0;
const ce = new Map();
let rt = 0;
const Y = x.domElement;
(Y.addEventListener("pointerdown", (e) => {
  (Y.setPointerCapture(e.pointerId),
    ce.set(e.pointerId, [e.clientX, e.clientY]),
    (Le = !0),
    (j = performance.now()));
}),
  Y.addEventListener("pointermove", (e) => {
    const t = ce.get(e.pointerId);
    if (!t) return;
    const a = e.clientX - t[0],
      n = e.clientY - t[1];
    if (
      ((t[0] = e.clientX),
      (t[1] = e.clientY),
      (j = performance.now()),
      ce.size === 2)
    ) {
      const [o, r] = [...ce.values()],
        i = Math.hypot(o[0] - r[0], o[1] - r[1]);
      (rt && (K = s.MathUtils.clamp((K * rt) / i, 0.55, 1.7)), (rt = i));
      return;
    }
    ((Ue -= a * 0.005), (X = s.MathUtils.clamp(X + n * 0.004, 0.2, 1.2)));
  }));
const qa = (e) => {
  (ce.delete(e.pointerId), (rt = 0), (Le = ce.size > 0));
};
(Y.addEventListener("pointerup", qa),
  Y.addEventListener("pointercancel", qa),
  Y.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        (K = s.MathUtils.clamp(K * Math.exp(e.deltaY * 0.0012), 0.55, 1.7)),
        (j = performance.now()));
    },
    { passive: !1 },
  ),
  Y.addEventListener("dblclick", () => {
    ((Ue = _a), (X = Oa), (K = 1), (j = performance.now()));
  }));
function $a() {
  const e = he.clientWidth,
    t = he.clientHeight,
    a = ue.classList.contains("ui-off"),
    n = e < 760,
    o = (I) => h(I).getBoundingClientRect();
  let r = 0,
    i = e,
    c = 0,
    l = t;
  a ||
    (n
      ? ((c = o(".status").bottom + 4), (l = o(".graph-card").top - 4))
      : ((c = o("header").bottom - 20),
        (i = o(".graph-card").left - 12),
        (l = t - 30)));
  const u = Math.max(200, i - r),
    g = Math.max(200, l - c),
    d = 2 * Math.tan(s.MathUtils.degToRad(k.fov / 2));
  k.setViewOffset(e, t, e / 2 - (r + i) / 2, t / 2 - (c + l) / 2, e, t);
  const m = n ? 10.5 : 16,
    y = n ? 12 : 21;
  Wa = Math.max((m * t) / g / d, (y * e) / u / (d * k.aspect), n ? 24 : 26);
}
function Xt() {
  const e = he.clientWidth,
    t = he.clientHeight;
  ((k.aspect = e / t),
    k.updateProjectionMatrix(),
    x.setSize(e, t),
    O.setSize(e, t),
    $a(),
    (j = performance.now()));
}
addEventListener("resize", Xt);
const Ha = h("#graph"),
  so = "http://www.w3.org/2000/svg",
  E = (e, t, a = Ha) => {
    const n = document.createElementNS(so, e);
    for (const o in t) n.setAttribute(o, t[o]);
    return (a.appendChild(n), n);
  };
{
  let e = 1,
    t = -1,
    a = 1,
    n = -1;
  for (const r of B)
    ((e = Math.min(e, r.c[0] - r.r)),
      (t = Math.max(t, r.c[0] + r.r)),
      (a = Math.min(a, -r.c[1] - r.r)),
      (n = Math.max(n, -r.c[1] + r.r)));
  const o = 0.03;
  Ha.setAttribute(
    "viewBox",
    `${e - o} ${a - o} ${t - e + 2 * o} ${n - a + 2 * o}`,
  );
}
const ro = E("g", {}),
  Kt = E("circle", { class: "glow", r: 0, opacity: 0 }),
  Yt = E("circle", { class: "hl", r: 0, opacity: 0 }),
  it = E("circle", { class: "flow", r: 0, opacity: 0 }),
  le = E("circle", { class: "spin", r: 0.2, opacity: 0 }),
  io = E("g", {}),
  co = E("g", {}),
  lo = E("g", {}),
  Va = B.map((e) =>
    E("circle", { class: "ring", cx: e.c[0], cy: -e.c[1], r: e.r }, ro),
  ),
  ja = N.map((e) =>
    E("circle", { class: "node", r: 0.037, fill: xt[e.colour] }, io),
  );
F.forEach((e, t) => {
  const a = Math.hypot(e[0], e[1]),
    n = (a + 0.235) / a;
  E("text", { class: "lbl", x: e[0] * n, y: -e[1] * n }, co).textContent =
    bt[t];
});
const Ge = h("#tip"),
  fo = h(".graph-card");
let Qt = -1;
B.forEach((e, t) => {
  const a = E(
    "circle",
    {
      class: "hit",
      cx: e.c[0],
      cy: -e.c[1],
      r: e.r,
      role: "button",
      "aria-label": `Turn ${e.move}`,
    },
    lo,
  );
  (a.addEventListener("pointerenter", () => {
    ((Qt = t), Va[t].classList.add("hot"));
  }),
    a.addEventListener("pointerleave", () => {
      ((Qt = -1), Va[t].classList.remove("hot"), Ge.classList.remove("on"));
    }),
    a.addEventListener("pointermove", (n) => {
      const o = fo.getBoundingClientRect();
      ((Ge.style.left = n.clientX - o.left + "px"),
        (Ge.style.top = n.clientY - o.top + "px"),
        (Ge.innerHTML = `<b>${e.move}</b>${Zt[e.move]} \xB7 click to turn, Shift-click for ${e.move}\u2032`),
        Ge.classList.add("on"));
    }),
    a.addEventListener("click", (n) => {
      ta(e.move + (n.shiftKey ? "'" : ""));
    }));
});
const Zt = {
    R: "right face",
    L: "left face",
    U: "up face",
    D: "down face",
    F: "front face",
    B: "back face",
    M: "middle slice",
    E: "equator slice",
    S: "standing slice",
  },
  Q = [];
let f = null,
  M = null,
  Fe = !1,
  ct = [],
  lt = 1,
  G = matchMedia("(prefers-reduced-motion: reduce)").matches,
  Re = !G,
  Be = 0,
  fe = 0,
  Jt = !0;
const ho = (e) => {
  const t = e ** 1.7 - 1,
    a = 1.15;
  return 1 + (a + 1) * t * t * t + a * t * t;
};
function ea(e, t, a) {
  const n = At(e);
  (L.set(Ma(L, n.to)),
    ct.push(e),
    W(L) && (ct = []),
    Q.push({ m: n, run: t, i: a }),
    na());
}
function Na() {
  const e = Q.shift();
  if (!e) return;
  const t = e.m,
    a = Math.abs(t.q) === 2,
    n = e.run?.kind === "scramble";
  ((f = {
    m: t,
    run: e.run,
    i: e.i,
    t: 0,
    dur: (a ? 0.62 : 0.44) * (n ? 0.72 : 1),
    paths: vn(t),
    moving: new Set(),
  }),
    f.paths.forEach((o) => f.moving.add(Se[o.from])),
    (f.byFrom = new Map(f.paths.map((o) => [o.from, o]))),
    mo());
}
function uo() {
  zn(f.m);
  const e = f.run;
  ((f = null),
    e && e.kind !== "free" && Q.length === 0 && (e.done = !0),
    !Q.length && W(L) && Ka(),
    ze());
}
function ta(e) {
  (sa(!1),
    (!M || M.kind !== "free") && (M = { kind: "free", moves: [] }),
    M.moves.push(e),
    ea(e, M, M.moves.length - 1),
    De("free", "Free play"),
    ze(),
    Z());
}
const aa = { R: 0, L: 1, U: 2, D: 3, F: 4, B: 5 };
function ft() {
  const e = [];
  let t = -1;
  for (; e.length < 8;) {
    const a = Math.floor(Math.random() * 6);
    a === t ||
      (a >> 1 === t >> 1 && a < t) ||
      (e.push(bt[a] + ["", "2", "'"][Math.floor(Math.random() * 3)]), (t = a));
  }
  ((M = { kind: "scramble", moves: e }),
    e.forEach((a, n) => ea(a, M, n)),
    De("scramble", "Scramble"),
    ze(),
    Ya(null),
    Z());
}
async function dt() {
  if (Fe || W(L)) return;
  ((Fe = !0),
    na(),
    De("search", "Searching"),
    (h("#search-text").innerHTML =
      "Searching the state graph from both ends\u2026"));
  const e = await wa(L);
  Fe = !1;
  let t = e.moves;
  if (!t) {
    t = [];
    for (const a of ct.slice().reverse().map(dn)) {
      const n = t[t.length - 1];
      if (n && n[0] === a[0]) {
        const o = (Xa(n) + Xa(a)) % 4;
        (t.pop(), o && t.push(a[0] + ["", "", "2", "'"][o]));
      } else t.push(a);
    }
  }
  ((M = { kind: "solve", moves: t, search: e }),
    t.forEach((a, n) => ea(a, M, n)),
    De("solve", "Solve"),
    ze(),
    Ya(e, t.length),
    Z());
}
const Xa = (e) => (e[1] === "'" ? 3 : e[1] === "2" ? 2 : 1),
  ht = (e) => e.toLocaleString("en-US");
function De(e, t) {
  const a = h("#mode");
  ((a.className = "eyebrow mode " + e), (a.lastChild.textContent = t));
}
function mo() {
  const e = f.m,
    t = e.name,
    a = t[0],
    n = "MES".includes(a),
    o =
      Math.abs(e.q) === 2
        ? "half turn"
        : t[1] === "'"
          ? "anticlockwise"
          : "clockwise";
  h("#move").textContent = t.replace("'", "\u2032");
  const r = va[e.a][e.layer + 1],
    i = Math.abs(e.q) * 3,
    c = n ? "" : ` \xB7 8 spin in the ${cn[N[Se[St[aa[a]]]].colour]} cluster`;
  ((h("#move-desc").innerHTML =
    `${n ? Zt[a][0].toUpperCase() + Zt[a].slice(1) + ", with " + { M: "L", E: "D", S: "F" }[a] : ua[aa[a]][0].toUpperCase() + ua[aa[a]].slice(1) + " face"}, ${o}<small>12 stickers slide ${i} places round the ${r} loop${c}</small>`),
    f.run && f.run.kind !== "free"
      ? (h("#count").textContent = `${f.i + 1} / ${f.run.moves.length}`)
      : (h("#count").textContent = ""),
    ze());
}
function Ka() {
  (De("done", "Solved"),
    (h("#move").textContent = "\u2713"),
    (h("#move-desc").innerHTML =
      `Solved.<small>Every face one colour again${M?.kind === "solve" ? `, in ${M.moves.length} turns` : ""}.</small>`),
    (h("#count").textContent = ""),
    na());
}
function ze() {
  const e = h("#seq");
  if (!M) {
    e.innerHTML = "";
    return;
  }
  const t = f && f.run === M ? f.i : -1,
    a = Q.filter((o) => o.run === M).map((o) => o.i),
    n = M.kind === "free" ? Math.max(0, M.moves.length - 14) : 0;
  e.innerHTML = M.moves
    .map((o, r) =>
      r < n
        ? ""
        : `<span class="${r === t ? "now" : a.includes(r) || (r > t && t >= 0) ? "" : "done"}">${o.replace("'", "\u2032")}</span>`,
    )
    .join("");
}
function Ya(e, t) {
  const a = h("#bars"),
    n = h("#search-text");
  if (!e) {
    ((a.innerHTML = ""),
      (n.innerHTML =
        "The <b>state graph</b> has 43 quintillion vertices, one per arrangement, and 18 edges at each. Solve searches it from both ends."));
    return;
  }
  if (!e.moves) {
    ((a.innerHTML = ""),
      (n.innerHTML = `Deeper than the search budget (<b>${ht(e.visited)}</b> states), so it retraces the <b>${t}</b> turns made since solved.`));
    return;
  }
  const [o, r] = e.sizes,
    i = Math.log10(Math.max(...o, ...r) + 1),
    c = (l) => Math.max(3, Math.round((34 * Math.log10(l + 1)) / i));
  ((a.innerHTML =
    o.map((l) => `<i style="height:${c(l)}px" title="${ht(l)}"></i>`).join("") +
    '<i class="meet"></i>' +
    r
      .slice()
      .reverse()
      .map((l) => `<i class="b" style="height:${c(l)}px" title="${ht(l)}"></i>`)
      .join("")),
    (n.innerHTML = t
      ? `<b>${t} turns</b>, a shortest path. Searched <b>${ht(e.visited)}</b> states breadth-first <i class="k" style="background:#ffb18b"></i>from the scramble and <i class="k" style="background:#8fb5ff"></i>from solved until they met.`
      : "Already solved."));
}
function na() {
  h("#solve").disabled = Fe || W(L);
}
const oa = h("#ui-hint");
let Qa;
function ut(e) {
  _e ||
    ((oa.textContent = e),
    oa.classList.add("on"),
    clearTimeout(Qa),
    (Qa = setTimeout(() => oa.classList.remove("on"), 1400)));
}
const Z = () => (j = performance.now());
function sa(e) {
  ((Re = e), (h("#auto").checked = e), (Be = 0));
}
function ra(e) {
  ((G = e),
    (h("#pause").textContent = e ? "\u25B6" : "\u2161"),
    h("#pause").setAttribute(
      "aria-label",
      e ? "Play (Space)" : "Pause (Space)",
    ),
    Z());
}
function Za(e) {
  ((Jt = e), (Ie.enabled = e), (h("#dof").checked = e), Z());
}
let _e = !1;
try {
  _e = localStorage.getItem("cg:controls") === "1";
} catch {}
function Ja(e) {
  ((_e = e),
    ue.classList.toggle("controls-on", e),
    !e &&
      h(".playback").contains(document.activeElement) &&
      document.activeElement.blur());
  try {
    localStorage.setItem("cg:controls", e ? "1" : "0");
  } catch {}
}
Ja(_e);
const en = [1, 2, 0.5];
((h("#speed").onclick = () => {
  ((lt = en[(en.indexOf(lt) + 1) % 3]),
    (h("#speed").textContent = lt + "\xD7"));
}),
  (h("#pause").onclick = () => ra(!G)),
  (h("#auto").onchange = (e) => sa(e.target.checked)),
  (h("#dof").onchange = (e) => Za(e.target.checked)),
  (h("#scramble").onclick = () => ft()),
  (h("#solve").onclick = () => dt()),
  (h("#about").onclick = () => h("#info").showModal()),
  (h("#close").onclick = () => h("#info").close()),
  h("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }));
function po() {
  (ue.classList.toggle("ui-off"),
    ue.contains(document.activeElement) && document.activeElement.blur(),
    $a(),
    ut(
      ue.classList.contains("ui-off")
        ? "Interface hidden \xB7 / to show"
        : "Interface shown",
    ));
}
addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Ja(!_e));
    return;
  }
  if (e.metaKey || e.ctrlKey || e.altKey || h("#info").open) return;
  const t = e.key.toUpperCase();
  "UDLRFBMES".includes(t) && t.length === 1
    ? (e.preventDefault(), ta(t + (e.shiftKey ? "'" : "")))
    : e.key === " "
      ? (e.preventDefault(), ra(!G), ut(G ? "Paused" : "Playing"))
      : t === "N"
        ? ft()
        : e.key === "Enter" && e.target.tagName !== "BUTTON"
          ? (e.preventDefault(), dt())
          : t === "T"
            ? (Za(!Jt), ut(Jt ? "Tilt-shift on" : "Tilt-shift off"))
            : t === "A"
              ? (sa(!Re), ut(Re ? "Auto on" : "Auto off"))
              : e.key === "/"
                ? (e.preventDefault(), po())
                : e.key === "ArrowLeft" || e.key === "ArrowRight"
                  ? ((Ue += e.key === "ArrowLeft" ? 0.35 : -0.35), Z())
                  : (e.key === "ArrowUp" || e.key === "ArrowDown") &&
                    ((X = s.MathUtils.clamp(
                      X + (e.key === "ArrowUp" ? 0.1 : -0.1),
                      0.2,
                      1.2,
                    )),
                    Z());
});
const mt = new Float32Array(108),
  pt = new Float32Array(108).fill(9),
  Oe = new s.Vector3(),
  ia = new Float32Array(9).fill(0.2);
function vo(e) {
  N.forEach((t, a) => {
    const n = f && f.byFrom.get(t.slot);
    let o, r;
    if (n) {
      const i = n.th + n.d * e,
        c = n.r0 + (n.r1 - n.r0) * Math.min(1, Math.max(0, e));
      ((o = n.c[0] + Math.cos(i) * c), (r = n.c[1] + Math.sin(i) * c));
    } else [o, r] = U[t.slot];
    ((mt[a * 2] = o), (mt[a * 2 + 1] = r));
  });
}
let vt = performance.now(),
  gt = Ue,
  We = X,
  ca = K,
  Mt = 0,
  wt = vt,
  la = 60,
  fa = 0;
const yt = (e, t, a, n) => e + (t - e) * (1 - Math.exp(-a * n));
function tn(e, t) {
  const a = s.MathUtils.clamp((e - vt) / 1e3, 0, 0.05);
  ((vt = Math.max(vt, e)),
    G ||
      ((fe += a),
      f || Na(),
      f && ((f.t += (a * lt) / f.dur), f.t >= 1 && (uo(), Na()))),
    Re &&
      !G &&
      !f &&
      !Q.length &&
      !Fe &&
      (Be
        ? fe >= Be && ((Be = 0), W(L) ? ft() : dt())
        : (Be = fe + (W(L) ? 2.4 : 1.3))));
  const n = f ? Math.min(f.t, 1) : 0,
    o = f ? ho(n) : 0,
    r = f ? Math.sin(Math.PI * n) : 0,
    i = f
      ? s.MathUtils.smoothstep(n, 0, 0.12) *
        (1 - s.MathUtils.smoothstep(n, 0.86, 1))
      : 0;
  ((ie.position.y = Wt + Math.sin(fe * 0.9) * 0.06),
    (ie.rotation.y = Math.sin(fe * 0.23) * 0.015),
    Dn(f?.m, f ? ((f.m.q * Math.PI) / 2) * o : 0),
    N.forEach((d, m) => {
      ((Fa.array[m] = f && f.moving.has(m) ? 0.22 * i : 0),
        (La.array[m] = f && f.moving.has(m) ? 0.75 * i : 0));
    }),
    (Fa.needsUpdate = La.needsUpdate = !0),
    vo(o));
  for (let d = 0; d < 54; d++) {
    const m = mt[d * 2],
      y = mt[d * 2 + 1];
    (Math.abs(m - pt[d * 2]) + Math.abs(y - pt[d * 2 + 1]) > 1e-4 &&
      (ja[d].setAttribute("cx", m.toFixed(4)),
      ja[d].setAttribute("cy", (-y).toFixed(4)),
      (pt[d * 2] = m),
      (pt[d * 2 + 1] = y)),
      Ia(m, y, Oe));
    const I = f && f.moving.has(d) ? 0.07 * r : 0;
    (p.makeTranslation(Oe.x, 0.26 + I, Oe.z),
      se.setMatrixAt(d, p),
      p.compose(_.set(Oe.x, 0.225, Oe.z), D.identity(), z.set(1.45, 1, 1.45)),
      re.setMatrixAt(d, p));
  }
  se.instanceMatrix.needsUpdate = re.instanceMatrix.needsUpdate = !0;
  const c = f ? f.m.a * 3 + f.m.layer + 1 : -1;
  if (
    (B.forEach((d, m) => {
      const y = m === c ? 0.2 + 2.2 * i : m === Qt ? 0.7 : 0.2;
      ((ia[m] = m === c ? y : yt(ia[m], y, 8, a)),
        Ln[m].material.color.set("#ffe0c0").multiplyScalar(ia[m]));
    }),
    f)
  ) {
    const d = B[c];
    for (const I of [Kt, Yt, it])
      (I.setAttribute("cx", d.c[0]),
        I.setAttribute("cy", -d.c[1]),
        I.setAttribute("r", d.r));
    (Yt.setAttribute("opacity", i.toFixed(3)),
      Kt.setAttribute("opacity", i.toFixed(3)),
      it.setAttribute("opacity", (i * 0.9).toFixed(3)),
      (it.style.strokeDashoffset = (
        (f.paths.find((I) => b[I.from].a !== f.m.a)?.d || 0) *
        o *
        d.r
      ).toFixed(4)));
    const m = Math.abs(f.m.layer) === 1,
      y = f.m.a * 2 + (f.m.layer < 0 ? 1 : 0);
    (le.setAttribute("opacity", m ? (i * 0.8).toFixed(3) : 0),
      m &&
        (le.setAttribute("cx", F[y][0]),
        le.setAttribute("cy", -F[y][1]),
        (le.style.transform = `rotate(${(-(f.paths.find((I) => b[I.from].a === f.m.a)?.d || 0) * o * 57.3).toFixed(1)}deg)`),
        (le.style.transformOrigin = `${F[y][0]}px ${-F[y][1]}px`)));
  } else
    (Yt.setAttribute("opacity", 0),
      Kt.setAttribute("opacity", 0),
      it.setAttribute("opacity", 0),
      le.setAttribute("opacity", 0));
  (G || (Vt.value += a), Kn(Vt.value));
  const l = performance.now() - j > 6e3 ? Math.sin(fe * 0.05) * 0.18 : 0;
  ((gt = yt(gt, Ue + l, Le ? 14 : 3, a)),
    (We = yt(We, X, Le ? 14 : 3, a)),
    (ca = yt(ca, K, 6, a)));
  const u = Wa * ca;
  (k.position.set(
    st.x + Math.sin(gt) * Math.cos(We) * u,
    st.y + Math.sin(We) * u,
    st.z + Math.cos(gt) * Math.cos(We) * u,
  ),
    k.lookAt(st),
    k.updateMatrixWorld(),
    (Ie.u.focus.value = k.position.distanceTo(oo)),
    (Ie.u.range.value = 3.3 + u * 0.02),
    xn(),
    (fa = G && !Le && e - j > 400 ? fa + 1 : 0),
    !(fa > 3 && !t) &&
      (x.info.reset(),
      O.render(a),
      Mt++,
      e - wt > 2e3 &&
        ((la = Math.round((Mt * 1e3) / (e - wt))),
        (Mt = 0),
        (wt = e),
        la < 40 &&
          $ > 1 &&
          !document.hidden &&
          !t &&
          (($ = Math.max(1, $ - 0.25)),
          x.setPixelRatio($),
          O.setPixelRatio($),
          Xt()))));
}
((window.__cube = {
  render: () => tn(performance.now(), !0),
  scramble: ft,
  solve: dt,
  turn: (e) => ta(e),
  findPath: () => wa(L),
  NODE: U,
  RINGS: B,
  get state() {
    return {
      solved: W(L),
      queue: Q.length,
      turn: f?.m.name ?? null,
      run: M && { kind: M.kind, moves: M.moves },
      history: ct,
      fps: la,
      pixelRatio: $,
      drawCalls: x.info.render.calls,
      triangles: x.info.render.triangles,
      people: ke,
      auto: Re,
      paused: G,
    };
  },
}),
  document.addEventListener("visibilitychange", () => {
    ((Mt = 0), (wt = performance.now()));
  }),
  Xt(),
  Ka(),
  ra(G),
  await x.compileAsync(q, k).catch(() => {}),
  h("#loading").remove());
function an(e) {
  (requestAnimationFrame(an), tn(e));
}
requestAnimationFrame(an);
