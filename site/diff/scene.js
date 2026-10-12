import * as c from "three";
import { EffectComposer as Ea } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as us,
  FullScreenQuad as Ro,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as on } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as _a } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as Fa } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as Da } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as sn } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as nn } from "three/addons/utils/BufferGeometryUtils.js";
const k = (e) => document.querySelector(e),
  Oe = k("#world"),
  ps = k("#app"),
  S = (e, t, o) => (e < t ? t : e > o ? o : e),
  $e = (e, t, o) => e + (t - e) * o,
  an = (e, t, o) => {
    const s = S((o - e) / (t - e), 0, 1);
    return s * s * (3 - 2 * s);
  },
  ci = (e) => 1 - (1 - e) ** 3,
  hi = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function Se(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const di = Se(7),
  ko = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Ga = "https://x.com/ryansael",
  rn = "diff",
  N = Math.PI * 2,
  J = new c.Scene();
((J.background = new c.Color("#c9b39a")),
  (J.fog = new c.FogExp2("#cdb49a", 0.0042)));
const C = new c.PerspectiveCamera(30, 1, 0.3, 320);
let W;
try {
  W = new c.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (k("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const za = 25e5,
  Oa = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return S(Math.min(devicePixelRatio, 2, Math.sqrt(za / (e * t))), 1, 2);
  },
  Lo = Oa();
(W.setPixelRatio(Lo),
  (W.info.autoReset = !1),
  (W.shadowMap.enabled = !0),
  (W.shadowMap.type = c.PCFShadowMap),
  (W.shadowMap.autoUpdate = !1),
  (W.toneMapping = c.ACESFilmicToneMapping),
  Oe.appendChild(W.domElement));
const Po = new c.HemisphereLight(16772829, 6968903, 0.62);
J.add(Po);
const te = new c.DirectionalLight(16761470, 3.1);
((te.castShadow = !0),
  te.shadow.mapSize.set(2048, 2048),
  Object.assign(te.shadow.camera, {
    left: -17,
    right: 17,
    top: 13,
    bottom: -13,
    near: 1,
    far: 90,
  }),
  (te.shadow.normalBias = 0.028),
  (te.shadow.bias = -3e-4),
  (te.shadow.radius = 2),
  J.add(te, te.target));
const $a = new c.Vector3(0.62, 0.42, -0.66).normalize();
(te.position.copy($a).multiplyScalar(40), te.target.position.set(0, 1, 0));
const ms = new c.DirectionalLight(11126527, 0.55);
(ms.position.set(-14, 8, -6), J.add(ms));
const bs = new c.DirectionalLight(16771538, 0.95);
(bs.position.set(-5, 9, 14), J.add(bs));
const Co = new c.Group();
J.add(Co);
const Xe = 10,
  Dt = {
    pos: {
      value: Array.from({ length: Xe }, () => new c.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: Xe }, () => new c.Vector3()) },
  },
  Ba = `uniform vec4 uFakePos[${Xe}];uniform vec3 uFakeCol[${Xe}];uniform float uSat;`,
  Va = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${Xe};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  Ua = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  ln = { value: 1.12 };
function Ce(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: Dt.pos,
        uFakeCol: Dt.col,
        uSat: ln,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + Ba,
          )
          .replace("#include <lights_fragment_end>", Va)
          .replace("#include <opaque_fragment>", Ua)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => rn + (t ? t.key : "")),
    e
  );
}
const cn = [];
function Gt(e, t, o, s, i, n) {
  const r = { p: new c.Vector3(e, t, o), c: new c.Color(s), r: i, i: n, i0: n };
  return (cn.push(r), r);
}
const Ao = new c.Vector3(),
  he = [],
  eo = new c.Vector3(0, 2, 0);
function Wa(e) {
  he.length = 0;
  for (const t of cn)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        he.length < Xe)
      )
        (he.push(t), he.length === Xe && he.sort((o, s) => o.score - s.score));
      else if (t.score > he[0].score) {
        he[0] = t;
        for (let o = 0; o < Xe - 1 && he[o].score > he[o + 1].score; o++) {
          const s = he[o];
          ((he[o] = he[o + 1]), (he[o + 1] = s));
        }
      }
    }
}
function Ha(e, t) {
  Wa(t);
  for (let o = 0; o < Xe; o++) {
    const s = he[o];
    if (!s) {
      (Dt.col.value[o].set(0, 0, 0), Dt.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (Ao.copy(s.p).applyMatrix4(e.matrixWorldInverse),
      Dt.pos.value[o].set(Ao.x, Ao.y, Ao.z, 1 / (s.r * s.r)),
      Dt.col.value[o].set(s.c.r * s.i, s.c.g * s.i, s.c.b * s.i));
  }
}
const Io = {};
{
  const e = new c.PMREMGenerator(W),
    t = (s) =>
      new c.Mesh(
        new c.SphereGeometry(50, 32, 16),
        new c.ShaderMaterial({
          side: c.BackSide,
          vertexShader:
            "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: s,
        }),
      ),
    o = (s, i, n, r, a, l, d) => {
      const u = new c.Mesh(
        new c.BoxGeometry(i, n, 0.4),
        new c.MeshBasicMaterial({ color: new c.Color(...r) }),
      );
      (u.position.set(a, l, d), u.lookAt(0, 0, 0), s.add(u));
    };
  {
    const s = new c.Scene();
    (s.add(
      t(`varying vec3 d;void main(){vec3 c=mix(vec3(.30,.22,.16),vec3(.62,.52,.42),smoothstep(-.35,.12,d.y));c=mix(c,vec3(.72,.66,.6),smoothstep(.25,.9,d.y));
   float w=dot(d,normalize(vec3(.55,.18,-.8)));c+=vec3(2.2,1.45,.8)*smoothstep(.55,.97,w);c+=vec3(.5,.62,.8)*smoothstep(.3,.8,dot(d,normalize(vec3(-.2,.3,-1.))))*.5;gl_FragColor=vec4(c,1.);}`),
    ),
      o(s, 22, 14, [3.6, 2.6, 1.7], 16, 10, -26),
      o(s, 14, 12, [2.2, 2.2, 2.4], -6, 9, -28),
      o(s, 30, 3, [1.6, 1.5, 1.4], 0, 30, 0),
      o(s, 10, 8, [1.4, 1.1, 0.85], -26, 6, 10),
      (Io.study = e.fromScene(s, 0.03).texture));
  }
  {
    const s = new c.Scene();
    (s.add(
      t(
        "varying vec3 d;void main(){vec3 c=mix(vec3(.62,.58,.54),vec3(1.02,.99,.95),smoothstep(-.35,.15,d.y));c=mix(c,vec3(1.1,1.09,1.06),smoothstep(.4,.95,d.y));gl_FragColor=vec4(c,1.);}",
      ),
    ),
      o(s, 26, 12, [7, 6.9, 6.6], -14, 22, 12),
      o(s, 18, 9, [4.4, 4.5, 4.8], 24, 12, 6),
      o(s, 30, 6, [3.2, 3.15, 3.1], 0, 30, -10),
      o(s, 8, 20, [5, 4.9, 4.7], -26, 8, -6),
      (Io.studio = e.fromScene(s, 0.03).texture));
  }
  e.dispose();
}
((J.environment = Io.study), (J.environmentIntensity = 0.8));
const qa =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  Eo = (e, t) =>
    new c.ShaderMaterial({
      uniforms: t,
      vertexShader: qa,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class Ya extends us {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new c.WebGLRenderTarget(1, 1, {
        type: c.HalfFloatType,
        samples: t,
        depthTexture: new c.DepthTexture(1, 1),
      })),
      (this.quad = new Ro(
        Eo(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, s) {
    (Ha(C, eo),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(J, C),
      t.setRenderTarget(s),
      this.quad.render(t));
  }
}
const hn = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class Xa extends us {
  constructor() {
    super();
    const t = { type: c.HalfFloatType };
    ((this.half = new c.WebGLRenderTarget(1, 1, t)),
      (this.blurRT = new c.WebGLRenderTarget(1, 1, t)),
      (this.u = {
        tColor: { value: null },
        tDepth: { value: null },
        tHalf: { value: this.half.texture },
        tBlur: { value: this.blurRT.texture },
        near: { value: C.near },
        far: { value: C.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new c.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new c.Vector2() },
        fullTexel: { value: new c.Vector2() },
      }),
      (this.pre = new Ro(
        Eo(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${hn}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Ro(
        Eo(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Ro(
        Eo(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${hn}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(t, o) {
    const s = Math.ceil(t / 2),
      i = Math.ceil(o / 2);
    (this.half.setSize(s, i),
      this.blurRT.setSize(s, i),
      this.u.texel.value.set(1 / s, 1 / i),
      this.u.fullTexel.value.set(1 / t, 1 / o));
  }
  render(t, o, s) {
    ((this.u.tColor.value = s.texture),
      t.setRenderTarget(this.half),
      this.pre.render(t),
      t.setRenderTarget(this.blurRT),
      this.blur.render(t),
      t.setRenderTarget(this.renderToScreen ? null : o),
      this.comp.render(t));
  }
}
const g = {
    auto: 1,
    pixelRatio: Lo,
    msaa: Lo >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 2048,
    exposure: 1,
    fov: 30,
    sun: 1,
    fill: 1,
    rim: 1,
    fog: 1,
    sat: 1.2,
    env: 1,
    bloom: 1,
    bloomStrength: 1,
    bloomRadius: 0.55,
    bloomThreshold: 1,
    ao: 1,
    aoIntensity: 1,
    aoRadius: 0.9,
    aoSamples: 12,
    dof: 1,
    focalBand: 1,
    aperture: 1.4,
    apertureNear: 0.8,
    maxCoc: 13,
  },
  ws = { ...g },
  Te = new Ea(
    W,
    new c.WebGLRenderTarget(1, 1, { type: c.HalfFloatType, depthBuffer: !1 }),
  );
Te.setPixelRatio(Lo);
const to = new Ya(g.msaa);
Te.addPass(to);
const K = new on(J, C, 1, 1);
((K.output = on.OUTPUT.Off),
  (K.needsSwap = !1),
  K.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  K.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const Ka = K.setSize.bind(K),
  ja = K.render.bind(K);
K.setSize = (e, t) => Ka(Math.ceil(e / 2), Math.ceil(t / 2));
const zt = [],
  dn = [];
((K.render = (e, t, o) => {
  (zt.forEach((s, i) => {
    ((dn[i] = s.visible), (s.visible = !1));
  }),
    ja(e, t, o),
    zt.forEach((s, i) => (s.visible = dn[i])),
    (K.blendMaterial.uniforms.intensity.value = g.ao ? g.aoIntensity : 0),
    (K.blendMaterial.uniforms.tDiffuse.value = K.pdRenderTarget.texture),
    K._renderPass(e, K.blendMaterial, o));
}),
  Te.addPass(K));
const Ke = new _a(new c.Vector2(256, 256), 0.42, 0.55, 1.05),
  Na = Ke.setSize.bind(Ke);
((Ke.setSize = (e, t) => Na(Math.ceil(e / 2), Math.ceil(t / 2))),
  Te.addPass(Ke));
const Re = new Xa();
((Re.u.tDepth.value = to.rt.depthTexture), Te.addPass(Re));
const _o = new c.Scene(),
  gs = {
    tSceneDepth: { value: K.depthTexture },
    uRes: { value: new c.Vector2(1, 1) },
    uNF: { value: new c.Vector2(C.near, C.far) },
  };
class Za extends us {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, s) {
    const i = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(s),
      t.render(_o, C),
      (t.autoClear = i));
  }
}
(Te.addPass(new Za()), Te.addPass(new Fa()));
const fn = new Da();
Te.addPass(fn);
const un = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  xs = (e, t, o, s = 0.06, i = 2) =>
    new sn(e, t, o, i, Math.min(s, Math.min(e, t, o) / 2.02)),
  je = new Map();
function z(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    je.has(o) ||
      je.set(
        o,
        Ce(
          new c.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.6,
            ...t,
          }),
        ),
      ),
    je.get(o)
  );
}
function Be(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    je.has(o) ||
      je.set(
        o,
        Ce(
          new c.MeshPhysicalMaterial({
            color: e,
            roughness: 0.34,
            clearcoat: 1,
            clearcoatRoughness: 0.16,
            envMapIntensity: 1.1,
            ...t,
          }),
        ),
      ),
    je.get(o)
  );
}
function B(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    je.has(o) ||
      je.set(
        o,
        Ce(
          new c.MeshPhysicalMaterial({
            color: e,
            metalness: 0.85,
            roughness: 0.32,
            envMapIntensity: 1.25,
            clearcoat: 0.35,
            clearcoatRoughness: 0.3,
            ...t,
          }),
        ),
      ),
    je.get(o)
  );
}
const mt = (e, t = 1) =>
    new c.MeshBasicMaterial({
      color: new c.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  fi = B("#434a55", { roughness: 0.36 }),
  ui = B("#262a31", { roughness: 0.42, metalness: 0.7 }),
  pn = B("#16181c", { roughness: 0.46, metalness: 0.55 }),
  we = B("#c3c9d2", { roughness: 0.25, metalness: 1, clearcoat: 0.1 }),
  Ve = B("#9aa2ae", { roughness: 0.26, metalness: 1 }),
  pi = z("#1d1e21", { roughness: 0.78, envMapIntensity: 0.45 }),
  Ja = B("#d99e45", {
    roughness: 0.26,
    metalness: 1,
    clearcoat: 0.55,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.35,
  }),
  mi = B("#b98a4a", { roughness: 0.3, metalness: 1 }),
  vs = new c.Matrix4(),
  Fo = new c.Quaternion(),
  mn = new c.Euler(0, 0, 0, "YXZ"),
  bn = new c.Vector3(1, 1, 1),
  bi = new c.Color(),
  wi = new c.Vector3(1, 0, 0),
  wn = new c.Vector3(0, 1, 0),
  gi = new c.Vector3(0, 0, 1),
  Qa = new c.Vector3(),
  er = new c.Quaternion();
function D() {
  const e = new Map(),
    t = (o, s, i, n, r, a) => {
      s = s.index ? s.toNonIndexed() : s;
      for (const d of Object.keys(s.attributes))
        !["position", "normal", "uv"].includes(d) &&
          !(d === "color" && o.vertexColors) &&
          s.deleteAttribute(d);
      (s.attributes.uv ||
        s.setAttribute(
          "uv",
          new c.Float32BufferAttribute(
            new Float32Array(s.attributes.position.count * 2),
            2,
          ),
        ),
        s.attributes.normal || s.computeVertexNormals(),
        a.dir
          ? (Fo.setFromUnitVectors(
              wn,
              Qa.set(a.dir[0], a.dir[1], a.dir[2]).normalize(),
            ),
            a.roll && Fo.multiply(er.setFromAxisAngle(wn, a.roll)))
          : (mn.set(a.rx || 0, a.ry || 0, a.rz || 0), Fo.setFromEuler(mn)),
        s.applyMatrix4(
          vs.compose(
            { x: i, y: n, z: r },
            Fo,
            a.s ? bn.set(a.s[0], a.s[1], a.s[2]) : bn.set(1, 1, 1),
          ),
        ));
      let l = e.get(o);
      (l || e.set(o, (l = { mat: o, list: [] })), l.list.push(s));
    };
  return {
    box(o, s, i, n, r, a, l, d = {}) {
      return (
        t(o, d.r ? xs(r, a, l, d.r) : new c.BoxGeometry(r, a, l), s, i, n, d),
        this
      );
    },
    cyl(o, s, i, n, r, a, l, d = {}) {
      return (
        t(
          o,
          new c.CylinderGeometry(r, a, l, d.seg || 20, 1, !!d.open),
          s,
          i,
          n,
          d,
        ),
        this
      );
    },
    cone(o, s, i, n, r, a, l = {}) {
      return (
        t(
          o,
          new c.ConeGeometry(r, a, l.seg || 6).translate(0, a / 2, 0),
          s,
          i,
          n,
          l,
        ),
        this
      );
    },
    sph(o, s, i, n, r, a = {}) {
      return (
        t(o, new c.SphereGeometry(r, a.seg || 14, a.seg2 || 10), s, i, n, a),
        this
      );
    },
    tor(o, s, i, n, r, a, l = {}) {
      return (
        t(o, new c.TorusGeometry(r, a, l.seg2 || 8, l.seg || 40), s, i, n, l),
        this
      );
    },
    geo(o, s, i = 0, n = 0, r = 0, a = {}) {
      return (t(o, s.clone(), i, n, r, a), this);
    },
    flush(o, s = !0) {
      const i = [];
      for (const { mat: n, list: r } of e.values()) {
        const a = new c.Mesh(nn(r), n);
        ((a.castShadow = s),
          (a.receiveShadow = !0),
          o.add(a),
          i.push(a),
          r.forEach((l) => l.dispose()));
      }
      return (e.clear(), i);
    },
  };
}
const ys = [];
document.fonts?.ready.then(() => ys.forEach((e) => e()));
function st(e, t, o, s, i, n = 0.9, r = {}) {
  const a = document.createElement("canvas");
  ((a.width = o), (a.height = s));
  const l = a.getContext("2d"),
    d = new c.CanvasTexture(a);
  ((d.anisotropy = 8), (d.colorSpace = c.SRGBColorSpace));
  const u = new c.Mesh(
    new c.PlaneGeometry(e, t),
    new c.MeshBasicMaterial({
      map: d,
      alphaTest: 0.3,
      fog: !1,
      side: c.DoubleSide,
      color: new c.Color(n, n, n),
      ...r,
    }),
  );
  return (
    (u.userData = {
      c: a,
      g: l,
      t: d,
      redraw(m) {
        (l.clearRect(0, 0, o, s), m(l, o, s), (d.needsUpdate = !0));
      },
    }),
    i && (u.userData.redraw(i), ys.push(() => u.userData.redraw(i))),
    u
  );
}
const xi = (e, t, o, s, i, n) => {
    (e.beginPath(), e.roundRect(t, o, s, i, n));
  },
  nt = (e, t, o, s = !0) => {
    const i = document.createElement("canvas");
    ((i.width = e), (i.height = t), o(i.getContext("2d"), e, t));
    const n = new c.CanvasTexture(i);
    return (s && (n.colorSpace = c.SRGBColorSpace), (n.anisotropy = 8), n);
  },
  Ms = (e, t, o) => {
    const s = document.createElement("canvas");
    ((s.width = e), (s.height = t));
    const i = s.getContext("2d"),
      n = new c.CanvasTexture(s);
    ((n.colorSpace = c.SRGBColorSpace), (n.anisotropy = 8));
    const r = () => {
      (i.clearRect(0, 0, e, t), o(i, e, t), (n.needsUpdate = !0));
    };
    return (r(), ys.push(r), n);
  },
  tr = nt(
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
  vi = (e, t, o = tr) =>
    new c.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: c.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function ge(e, t = 64, o = [0, N]) {
  const s = new c.LatheGeometry(
    e.map(([i, n]) => new c.Vector2(n, i)),
    t,
    o[0],
    o[1],
  );
  return (s.rotateZ(-Math.PI / 2), s);
}
function Ne(e, t = 48) {
  return new c.LatheGeometry(
    e.map(([o, s]) => new c.Vector2(o, s)),
    t,
  );
}
function yi(e, t = 0.3, o = 1, s = 0) {
  const i = new c.IcosahedronGeometry(e, s),
    n = i.attributes.position,
    r = Se(o),
    a = new Map();
  for (let l = 0; l < n.count; l++) {
    const d =
      n.getX(l).toFixed(3) +
      "," +
      n.getY(l).toFixed(3) +
      "," +
      n.getZ(l).toFixed(3);
    a.has(d) ||
      a.set(d, [1 + (r() - 0.5) * t, 1 + (r() - 0.5) * t, 1 + (r() - 0.5) * t]);
    const u = a.get(d);
    n.setXYZ(l, n.getX(l) * u[0], n.getY(l) * u[1], n.getZ(l) * u[2]);
  }
  return (i.computeVertexNormals(), i);
}
const or = nt(
  128,
  128,
  (e) => {
    const t = e.createRadialGradient(64, 64, 0, 64, 64, 64);
    (t.addColorStop(0, "rgba(0,0,0,1)"),
      t.addColorStop(0.45, "rgba(0,0,0,.55)"),
      t.addColorStop(1, "rgba(0,0,0,0)"),
      (e.fillStyle = t),
      e.fillRect(0, 0, 128, 128));
  },
  !1,
);
function sr(e, t, o, s, i, n, r = 0.5) {
  const a = new c.Mesh(
    new c.PlaneGeometry(i, n),
    new c.MeshBasicMaterial({
      map: or,
      transparent: !0,
      opacity: r,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (a.rotation.x = -Math.PI / 2),
    a.position.set(t, o + 0.004, s),
    (a.renderOrder = -1),
    e.add(a),
    zt.push(a),
    a
  );
}
function gn(
  e,
  t,
  { fold: o = 0.25, curl: s = 0.18, shape: i = "oval", seg: n = 8 } = {},
) {
  const r = [],
    a = [],
    l = [];
  for (let b = 0; b <= n; b++) {
    const p = b / n;
    let f =
      i === "heart"
        ? Math.sin(Math.PI * Math.pow(p, 0.6)) * (1.1 - 0.3 * p)
        : i === "paddle"
          ? Math.pow(Math.sin(Math.PI * p), 0.55)
          : i === "blade"
            ? Math.sin(Math.PI * Math.pow(p, 0.8)) * 0.5
            : Math.sin(Math.PI * p) * (1 - 0.2 * p);
    f = Math.max((f * t) / 2, 0.015);
    for (let w = -3; w <= 3; w++) {
      const x = w / 3;
      r.push(x * f, p * e, -Math.abs(x) * f * o - s * e * p * p);
      const T = 1 - Math.abs(x);
      a.push(0.82 + 0.3 * T ** 3, 0.86 + 0.22 * T ** 3, 0.8 + 0.2 * T ** 3);
    }
  }
  const u = 7;
  for (let b = 0; b < n; b++)
    for (let p = 0; p < u - 1; p++) {
      const f = b * u + p,
        w = f + 1,
        x = f + u,
        T = x + 1;
      l.push(f, x, w, w, x, T);
    }
  const m = new c.BufferGeometry();
  return (
    m.setAttribute("position", new c.Float32BufferAttribute(r, 3)),
    m.setAttribute("color", new c.Float32BufferAttribute(a, 3)),
    m.setIndex(l),
    m.computeVertexNormals(),
    m.toNonIndexed()
  );
}
const xn = new c.Vector3(),
  Ot = new c.Vector3(),
  $t = new c.Vector3();
function vn(e, t, o, s, i) {
  (Ot.copy(o).normalize(),
    $t.set(0, 1, 0).addScaledVector(Ot, -Ot.y),
    $t.lengthSq() < 1e-4 && $t.set(0, 0, 1),
    $t.normalize(),
    xn.crossVectors(Ot, $t),
    vs.makeBasis(xn, Ot, $t),
    e.applyMatrix4(vs.premultiply(new c.Matrix4().makeRotationAxis(Ot, s))),
    e.translate(t.x, t.y, t.z));
  const n = e.attributes.color;
  for (let r = 0; r < n.count; r++)
    n.setXYZ(r, n.getX(r) * i.r, n.getY(r) * i.g, n.getZ(r) * i.b);
  return e;
}
const yn = ["#3a6431", "#467238", "#51803f", "#335a33", "#5e8a44"].map(
    (e) => new c.Color(e),
  ),
  Mn = (e) =>
    yn[Math.floor(e() * yn.length)].clone().multiplyScalar(0.9 + e() * 0.25),
  Sn = z("#ffffff", {
    vertexColors: !0,
    side: c.DoubleSide,
    roughness: 0.5,
    envMapIntensity: 0.7,
  }),
  nr = z("#2e241b"),
  ar = z("#5c4b35", { roughness: 0.8 });
function Bt(e, t, o, s, i, n, r, a = "bush", l = 14) {
  const d = Se(n);
  (e.geo(
    r,
    Ne(
      [
        [0, 0],
        [0.52, 0],
        [0.6, 0.08],
        [0.66, 0.9],
        [0.7, 0.98],
        [0.64, 1],
        [0.6, 0.93],
        [0, 0.93],
      ].map(([u, m]) => [u * i, m * i]),
      28,
    ),
    t,
    o,
    s,
  ),
    e.cyl(nr, t, o + 0.9 * i, s, 0.6 * i, 0.6 * i, 0.04, { seg: 20 }));
  for (let u = 0; u < l; u++) {
    const m = u * 2.4 + d() * 0.6,
      b = u / l;
    if (a === "blade") {
      const y = new c.Vector3(Math.cos(m) * 0.25, 1, Math.sin(m) * 0.25);
      e.geo(
        Sn,
        vn(
          gn((1.6 + d() * 1.1) * i, 0.36 * i, {
            shape: "blade",
            fold: 0.18,
            curl: 0.04,
            seg: 8,
          }),
          new c.Vector3(
            t + Math.cos(m) * 0.2 * i,
            o + 0.9 * i,
            s + Math.sin(m) * 0.2 * i,
          ),
          y,
          m,
          Mn(d),
        ),
        0,
        0,
        0,
      );
      continue;
    }
    const p = a === "tall" ? 0.7 + d() * 0.5 : 0.15 + d() * 0.9,
      f = (a === "tall" ? 0.5 : 0.35 + d() * 0.9) * i,
      w = new c.Vector3(
        Math.cos(m) * Math.cos(p),
        Math.sin(p),
        Math.sin(m) * Math.cos(p),
      ),
      x = new c.Vector3(
        t + w.x * f,
        o + 0.95 * i + w.y * f * (a === "tall" ? 1.8 : 0.8),
        s + w.z * f,
      );
    a === "tall" &&
      e.cyl(
        ar,
        (t + x.x) / 2,
        (o + 0.95 * i + x.y) / 2,
        (s + x.z) / 2,
        0.025 * i,
        0.035 * i,
        x.distanceTo(new c.Vector3(t, o + 0.95 * i, s)),
        { dir: [x.x - t, x.y - o - 0.95 * i, x.z - s], seg: 5 },
      );
    const T = (a === "tall" ? 0.95 : 0.62) * i * (0.8 + d() * 0.4);
    e.geo(
      Sn,
      vn(
        gn(T, T * (a === "tall" ? 0.5 : 0.8), {
          shape: a === "tall" ? "paddle" : "heart",
          fold: 0.25,
          curl: 0.2,
          seg: 7,
        }),
        x,
        w.clone().setY(w.y * 0.6 + 0.25),
        d() - 0.5,
        Mn(d),
      ),
      0,
      0,
      0,
    );
  }
}
function Do({
  N: e,
  A: t,
  gam: o,
  F: s,
  spiral: i = 0,
  back: n = 0.15,
  bore: r = 0,
  sections: a,
}) {
  a = a || (i ? 6 : 2);
  const l = Math.sin(o),
    d = Math.cos(o),
    u = t * l,
    m = (2 * u) / e,
    b = m * 0.9,
    p = m * 1.15,
    f = N / e,
    w = Math.tan(0.349),
    x = (v) => Math.max(f * 0.05, f / 4 - (v * w) / u),
    T = [
      [-x(-p), -p],
      [-x(b), b],
      [x(b), b],
      [x(-p), -p],
    ],
    y = [],
    M = (v, R, F) => {
      const G = v / t;
      return [
        v * l * Math.cos(R) + F * G * d * Math.cos(R),
        v * d - F * G * l,
        v * l * Math.sin(R) + F * G * d * Math.sin(R),
      ];
    },
    P = (v, R, F) => y.push(...v, ...R, ...F),
    X = (v, R, F, G) => {
      (P(v, R, F), P(v, F, G));
    },
    V = [];
  for (let v = 0; v < a; v++) {
    const R = t - s + (s * v) / (a - 1),
      F = (i * ((R - (t - s / 2)) / s)) / l,
      G = [];
    for (let I = 0; I < e; I++)
      for (const [To, hs] of T) G.push(M(R, I * f + F + To, hs));
    V.push(G);
  }
  const Me = e * 4,
    Ct = [],
    At = (v, R) => [v[0] - R[0], v[1] - R[1], v[2] - R[2]],
    en = (v, R) => [
      v[1] * R[2] - v[2] * R[1],
      v[2] * R[0] - v[0] * R[2],
      v[0] * R[1] - v[1] * R[0],
    ],
    ls = (v) => {
      const R = Math.hypot(...v) || 1;
      return [v[0] / R, v[1] / R, v[2] / R];
    };
  for (let v = 0; v < Me; v++) {
    const R = (v + 1) % Me,
      F = [];
    for (let I = 0; I < a - 1; I++)
      F.push(ls(en(At(V[I + 1][v], V[I][v]), At(V[I][R], V[I][v]))));
    const G = (I) =>
      ls(
        I === 0
          ? F[0]
          : I === a - 1
            ? F[a - 2]
            : [
                F[I - 1][0] + F[I][0],
                F[I - 1][1] + F[I][1],
                F[I - 1][2] + F[I][2],
              ],
      );
    for (let I = 0; I < a - 1; I++) {
      const To = V[I][v],
        hs = V[I + 1][v],
        tn = V[I + 1][R],
        Ia = V[I][R],
        ds = G(I),
        fs = G(I + 1);
      (y.push(...To, ...hs, ...tn, ...To, ...tn, ...Ia),
        Ct.push(...ds, ...fs, ...fs, ...ds, ...fs, ...ds));
    }
  }
  const Aa = y.length,
    It = V[a - 1],
    Et = V[0];
  for (let v = 0; v < e; v++) {
    const R = v * 4;
    (X(It[R], It[R + 3], It[R + 2], It[R + 1]),
      X(Et[R], Et[R + 1], Et[R + 2], Et[R + 3]));
  }
  const ze = [],
    pt = [];
  for (let v = 0; v < e; v++)
    (ze.push(It[v * 4], It[v * 4 + 3]), pt.push(Et[v * 4], Et[v * 4 + 3]));
  const _t = ze.length,
    yo = ze[0][1] + n,
    Mo = pt[0][1],
    cs = (v, R, F) =>
      v.map((G) => {
        const I = Math.atan2(G[2], G[0]);
        return [Math.cos(I) * R, F, Math.sin(I) * R];
      }),
    Ft = ze.map((v) => [v[0], yo, v[2]]);
  for (let v = 0; v < _t; v++) {
    const R = (v + 1) % _t;
    X(ze[v], Ft[v], Ft[R], ze[R]);
  }
  if (r > 0) {
    const v = cs(ze, r, yo),
      R = cs(ze, r, Mo),
      F = cs(pt, r, Mo);
    for (let G = 0; G < _t; G++) {
      const I = (G + 1) % _t;
      (X(Ft[G], v[G], v[I], Ft[I]),
        X(v[G], R[G], R[I], v[I]),
        X(F[G], pt[G], pt[I], F[I]));
    }
  } else {
    const v = [0, yo, 0],
      R = [0, Mo, 0];
    for (let F = 0; F < _t; F++) {
      const G = (F + 1) % _t;
      (P(Ft[F], v, Ft[G]), P(R, pt[F], pt[G]));
    }
  }
  for (let v = Aa; v < y.length; v += 9) {
    const R = ls(
      en(
        At(y.slice(v + 3, v + 6), y.slice(v, v + 3)),
        At(y.slice(v + 6, v + 9), y.slice(v, v + 3)),
      ),
    );
    Ct.push(...R, ...R, ...R);
  }
  const So = new c.BufferGeometry();
  return (
    So.setAttribute("position", new c.Float32BufferAttribute(y, 3)),
    So.setAttribute("normal", new c.Float32BufferAttribute(Ct, 3)),
    (So.userData = {
      rp: u,
      mod: m,
      ad: b,
      de: p,
      A: t,
      gam: o,
      heelY: t * d,
      backY: yo,
      frontY: Mo,
      rootHeel: Math.hypot(ze[0][0], ze[0][2]),
    }),
    So
  );
}
function rr(e, t, o, s = 1) {
  const i = [],
    n = e - 0.15,
    r = N / o;
  i.push(
    ge(
      [
        [-t / 2 + 0.06, e * 0.66],
        [-t / 2 + 0.01, e * 0.7],
        [-t / 2 - 0.03, e * 0.78],
        [-t / 2 - 0.04, n - 0.16],
        [-t / 2 - 0.01, n - 0.05],
        [-t / 2 + 0.06, n],
        [t / 2 - 0.06, n],
        [t / 2 + 0.01, n - 0.05],
        [t / 2 + 0.04, n - 0.16],
        [t / 2 + 0.03, e * 0.78],
        [t / 2 - 0.01, e * 0.7],
        [t / 2 - 0.06, e * 0.66],
      ],
      o * 2,
    ),
  );
  for (let a = 0; a < o; a++)
    for (const l of [-1, 1]) {
      const d = a * r + (l > 0 ? r / 2 : 0),
        u = 2 * Math.sin(r / 2) * (n + 0.08) * 0.9,
        m = xs(t / 2 - 0.05, 0.17, u, 0.05, 2);
      (m.translate(l * (t / 4 + 0.005), 0, 0),
        m.rotateX(d),
        m.translate(0, Math.cos(d) * (n + 0.075), Math.sin(d) * (n + 0.075)),
        i.push(m));
      const b = xs(0.14, 0.36, u * 0.86, 0.05, 1);
      (b.translate(l * (t / 2 - 0.01), 0, 0),
        b.rotateX(d),
        b.translate(0, Math.cos(d) * (n - 0.1), Math.sin(d) * (n - 0.1)),
        i.push(b));
    }
  return nn(
    i.map((a) => {
      a = a.index ? a.toNonIndexed() : a;
      for (const l of Object.keys(a.attributes))
        ["position", "normal", "uv"].includes(l) || a.deleteAttribute(l);
      return (
        a.attributes.uv ||
          a.setAttribute(
            "uv",
            new c.Float32BufferAttribute(
              new Float32Array(a.attributes.position.count * 2),
              2,
            ),
          ),
        a
      );
    }),
  );
}
const ie = new c.Group();
Co.add(ie);
const ae = -7.4,
  H = -12.6,
  Ae = -21,
  Ie = 25,
  Ue = 34,
  ke = 21.8,
  oo = [-7.2, 3.6],
  so = [6.2, 24],
  no = 1.9,
  Go = 19.4,
  zo = nt(1024, 1024, (e, t, o) => {
    const s = Se(12);
    ((e.fillStyle = "#c09366"), e.fillRect(0, 0, t, o));
    const i = 5,
      n = t / i;
    for (let r = 0; r < i; r++) {
      const a = s();
      ((e.fillStyle = `hsl(${28 + a * 6},${40 + a * 8}%,${52 + a * 9}%)`),
        e.fillRect(r * n, 0, n, o));
      for (let l = 0; l < 150; l++) {
        const d = r * n + s() * n,
          u = 0.03 + s() * 0.07;
        ((e.strokeStyle =
          s() > 0.5 ? `rgba(120,74,40,${u})` : `rgba(255,226,180,${u * 0.8})`),
          (e.lineWidth = 0.6 + s() * 2.2),
          e.beginPath(),
          e.moveTo(d, 0));
        for (let m = 0; m <= o; m += 32)
          e.lineTo(
            d + Math.sin(m * 0.004 + l) * 4 + Math.sin(m * 0.02 + l * 3) * 1.2,
            m,
          );
        e.stroke();
      }
      for (let l = 0; l < 3; l++) {
        const d = r * n + n * (0.3 + s() * 0.4),
          u = s() * o;
        for (let m = 0; m < 7; m++)
          ((e.strokeStyle = `rgba(110,66,34,${0.05 + m * 0.012})`),
            (e.lineWidth = 1.4),
            e.beginPath(),
            e.ellipse(d, u, 5 + m * 5, 40 + m * 26, 0, 0, 7),
            e.stroke());
      }
      ((e.fillStyle = "rgba(60,36,20,.35)"), e.fillRect(r * n, 0, 2, o));
    }
  });
((zo.wrapS = zo.wrapT = c.RepeatWrapping), zo.repeat.set(2.2, 1.4));
const Vt = nt(
  512,
  512,
  (e, t, o) => {
    const s = Se(4);
    ((e.fillStyle = "#808080"), e.fillRect(0, 0, t, o));
    for (let i = 0; i < 5200; i++) {
      const n = 100 + s() * 55;
      ((e.fillStyle = `rgba(${n},${n},${n},.13)`),
        e.beginPath(),
        e.ellipse(s() * t, s() * o, 2 + s() * 14, 1 + s() * 6, s() * 3, 0, 7),
        e.fill());
    }
  },
  !1,
);
((Vt.wrapS = Vt.wrapT = c.RepeatWrapping), Vt.repeat.set(4, 4));
const Oo = nt(1024, 1024, (e, t, o) => {
  const s = Se(21),
    i = 8,
    n = t / i;
  for (let r = 0; r < i; r++) {
    let a = -s() * 400;
    for (; a < o;) {
      const l = 260 + s() * 380,
        d = s();
      ((e.fillStyle = `hsl(${26 + d * 6},${34 + d * 8}%,${34 + d * 10}%)`),
        e.fillRect(r * n, a, n, l));
      for (let u = 0; u < 26; u++) {
        ((e.strokeStyle = `rgba(40,22,10,${0.04 + s() * 0.05})`),
          (e.lineWidth = 1 + s() * 2));
        const m = r * n + s() * n;
        (e.beginPath(),
          e.moveTo(m, a),
          e.lineTo(m + (s() - 0.5) * 6, a + l),
          e.stroke());
      }
      ((e.fillStyle = "rgba(20,12,6,.5)"),
        e.fillRect(r * n, a, n, 2),
        (a += l));
    }
    ((e.fillStyle = "rgba(20,12,6,.45)"), e.fillRect(r * n, 0, 2, o));
  }
});
((Oo.wrapS = Oo.wrapT = c.RepeatWrapping), Oo.repeat.set(5, 5));
const ir = Ce(
    new c.MeshStandardMaterial({
      map: zo,
      roughness: 0.46,
      envMapIntensity: 0.7,
    }),
  ),
  lr = z("#9c7148", { roughness: 0.5 }),
  cr = Ce(
    new c.MeshStandardMaterial({
      color: "#ecd9c2",
      roughnessMap: Vt,
      roughness: 1,
      bumpMap: Vt,
      bumpScale: 0.6,
      envMapIntensity: 0.5,
    }),
  ),
  $o = Ce(
    new c.MeshStandardMaterial({
      color: "#d4c3b0",
      roughness: 0.95,
      bumpMap: Vt,
      bumpScale: 0.6,
      envMapIntensity: 0.45,
    }),
  ),
  hr = Ce(
    new c.MeshStandardMaterial({
      map: Oo,
      roughness: 0.55,
      envMapIntensity: 0.6,
    }),
  ),
  Bo = B("#2c2926", { roughness: 0.5, metalness: 0.45, clearcoat: 0.2 }),
  Ss = B("#2a2d33", { roughness: 0.45, metalness: 0.6 });
{
  const e = D();
  e.box(ir, 1, -0.26, -2.6, 36, 0.52, 19.2, { r: 0.1 });
  for (const [t, o] of [
    [-16.3, -11.6],
    [18.3, -11.6],
    [-16.3, 5.8],
    [18.3, 5.8],
  ])
    e.box(Ss, t, (ae - 0.5) / 2, o, 0.7, -ae - 0.5, 0.7, { r: 0.04 });
  (e
    .box(Ss, 1, ae + 1.4, -11.6, 34.6, 0.5, 0.5)
    .box(Ss, 1, ae + 1.4, 5.8, 34.6, 0.5, 0.5),
    e.flush(ie));
}
{
  const e = new c.Mesh(new c.PlaneGeometry(Ie - Ae, Ue - H), hr);
  ((e.rotation.x = -Math.PI / 2),
    e.position.set((Ae + Ie) / 2, ae, (H + Ue) / 2),
    (e.receiveShadow = !0),
    ie.add(e));
  const t = D(),
    o = 0.6,
    s = H - o / 2,
    i = (a, l, d, u) => t.box(cr, (a + l) / 2, (d + u) / 2, s, l - a, u - d, o);
  (i(Ae, oo[0], ae, ke), i(oo[1], so[0], ae, ke), i(so[1], Ie, ae, ke));
  for (const [a, l] of [oo, so]) (i(a, l, ae, no), i(a, l, Go, ke));
  (t.box($o, Ae - o / 2, (ae + ke) / 2, (H + Ue) / 2, o, ke - ae, Ue - H),
    t.box($o, Ie + o / 2, (ae + ke) / 2, (H + Ue) / 2, o, ke - ae, Ue - H),
    t.box($o, (Ae + Ie) / 2, (ae + ke) / 2, Ue + o / 2, Ie - Ae, ke - ae, o),
    t.box($o, (Ae + Ie) / 2, ke + o / 2, (H + Ue) / 2, Ie - Ae, o, Ue - H),
    t.box(
      z("#efe6da", { roughness: 0.6 }),
      (Ae + Ie) / 2,
      ae + 0.45,
      H + 0.05,
      Ie - Ae,
      0.9,
      0.12,
    ),
    t.flush(ie, !0));
  const n = D(),
    r = 0.32;
  for (const [a, l] of [oo, so]) {
    const d = Math.round((l - a) / 5.2);
    for (let u = 0; u <= d; u++) {
      const m = $e(a, l, u / d);
      n.box(Bo, m, (no + Go) / 2, H - 0.18, u % d ? 0.26 : 0.4, Go - no, r);
    }
    (n
      .box(Bo, (a + l) / 2, no + 0.15, H - 0.18, l - a, 0.36, r + 0.1)
      .box(Bo, (a + l) / 2, Go - 0.15, H - 0.18, l - a, 0.32, r)
      .box(Bo, (a + l) / 2, 13.6, H - 0.18, l - a, 0.22, r),
      n.box(
        z("#eadfce", { roughness: 0.7 }),
        (a + l) / 2,
        no - 0.08,
        H + 0.12,
        l - a + 0.4,
        0.18,
        0.9,
        { r: 0.04 },
      ));
  }
  n.flush(ie, !0);
}
const Tn = nt(4096, 1024, (e, t, o) => {
  const s = Se(41),
    i = t * 0.74,
    n = (l) => (o * (85 - l)) / 150,
    r = e.createLinearGradient(0, 0, 0, n(4));
  (r.addColorStop(0, "#6f93c4"),
    r.addColorStop(0.5, "#a8bfd9"),
    r.addColorStop(0.82, "#e9d6c2"),
    r.addColorStop(1, "#f7d5ad"),
    (e.fillStyle = r),
    e.fillRect(0, 0, t, n(4) + 2));
  {
    const l = e.createRadialGradient(i, n(18), 0, i, n(18), t * 0.3);
    (l.addColorStop(0, "rgba(255,236,196,.95)"),
      l.addColorStop(0.2, "rgba(255,214,160,.5)"),
      l.addColorStop(1, "rgba(255,200,150,0)"),
      (e.fillStyle = l),
      e.fillRect(0, 0, t, n(-10)));
  }
  for (let l = 0; l < 40; l++) {
    const d = s() * t,
      u = n(40 + s() * 40),
      m = 50 + s() * 130,
      b = 1 - Math.min(1, (Math.abs(d - i) / t) * 2.4);
    for (let p = 0; p < 6; p++) {
      const f = d + (s() - 0.5) * m * 2.2,
        w = u + (s() - 0.5) * m * 0.25,
        x = m * (0.5 + s() * 0.6),
        T = m * (0.12 + s() * 0.1),
        y = e.createRadialGradient(f, w - T * 0.3, 0, f, w, x);
      (y.addColorStop(
        0,
        `rgba(255,${240 - b * 26},${226 - b * 50},${0.42 + b * 0.25})`,
      ),
        y.addColorStop(1, "rgba(255,240,235,0)"),
        (e.fillStyle = y),
        e.beginPath(),
        e.ellipse(f, w, x, T, 0, 0, 7),
        e.fill());
    }
  }
  const a = (l, d, u, m, b, p, f, w) => {
    const x = [];
    for (let y = 0; y <= t; y += 5) {
      const M = y / t,
        P = n(
          l +
            d *
              (Math.pow(Math.abs(Math.sin(M * u + b)), 1.5) * 0.72 +
                Math.abs(Math.sin(M * m + b * 1.9)) * 0.28) *
              (0.55 + 0.45 * Math.sin(M * 2.1 + b)),
        );
      x.push([y, P]);
    }
    (e.beginPath(), e.moveTo(0, o));
    for (const [y, M] of x) e.lineTo(y, M);
    (e.lineTo(t, o), e.closePath());
    const T = e.createLinearGradient(0, n(l + d), 0, n(l - 6));
    if (
      (T.addColorStop(0, p),
      T.addColorStop(1, f),
      (e.fillStyle = T),
      e.fill(),
      w)
    ) {
      (e.save(), e.clip());
      for (let y = 1; y < x.length; y++) {
        const [M, P] = x[y - 1],
          [X, V] = x[y];
        if (V < P - 0.4) {
          const Me = 1 - Math.min(1, (Math.abs(X - i) / t) * 1.6);
          ((e.fillStyle = `rgba(255,${196 + Me * 30},${150 + Me * 40},${0.16 + Me * 0.3})`),
            e.fillRect(X - 5, V, 6, (n(l - 8) - V) * 0.55));
        }
      }
      for (let y = 0; y < 260; y++) {
        const M = s() * t,
          P = n(l) + (s() - 0.4) * n(-d * 0.2) * 0.1;
        ((e.fillStyle = `rgba(40,48,70,${0.05 + s() * 0.07})`),
          e.fillRect(M, P - 40 * s(), 2 + s() * 3, 30 + s() * 80));
      }
      e.restore();
    }
  };
  (a(6, 22, 8.3, 21.7, 1.3, "#98a1bb", "#8792ad", !0),
    a(2, 14, 12.9, 29.3, 4.1, "#7d879f", "#6b7690", !0),
    a(-4, 7, 17.1, 37.9, 2.6, "#62705f", "#546250", !1));
  {
    const l = e.createLinearGradient(0, n(4), 0, n(-8));
    (l.addColorStop(0, "rgba(255,220,180,.35)"),
      l.addColorStop(1, "rgba(255,220,180,0)"),
      (e.fillStyle = l),
      e.fillRect(0, n(4), t, n(-8) - n(4)));
  }
  ((e.fillStyle = "#7c8a62"), e.fillRect(0, n(-6), t, o - n(-6)));
  for (let l = 0; l < 520; l++) {
    const d = s() * t,
      u = n(-6 - s() * 9),
      m = 10 + s() * 22,
      b = 8 + s() * 14,
      p = s() > 0.3;
    ((e.fillStyle = p
      ? `hsl(${30 + s() * 15},${20 + s() * 20}%,${72 + s() * 12}%)`
      : `hsl(220,10%,${50 + s() * 10}%)`),
      e.fillRect(d, u - b, m, b),
      (e.fillStyle =
        s() > 0.4
          ? `hsl(${12 + s() * 10},${45 + s() * 15}%,${42 + s() * 10}%)`
          : "#5a6072"),
      e.beginPath(),
      e.moveTo(d - 2, u - b),
      e.lineTo(d + m / 2, u - b - 6 - s() * 6),
      e.lineTo(d + m + 2, u - b),
      e.fill(),
      s() > 0.6 &&
        ((e.fillStyle = "rgba(255,220,160,.8)"),
        e.fillRect(d + 3, u - b * 0.6, 3, 3)));
  }
  for (let l = 0; l < 8; l++) {
    const d = s() * t;
    ((e.fillStyle = "#d9d2c4"),
      e.fillRect(d, n(-3) - 60, 9, 60),
      e.beginPath(),
      e.moveTo(d - 3, n(-3) - 60),
      e.lineTo(d + 4.5, n(-3) - 86),
      e.lineTo(d + 12, n(-3) - 60),
      e.fill());
  }
  for (let l = 0; l < 700; l++) {
    const d = s() * t,
      u = n(-16 - s() * 26),
      m = 14 + s() * 34,
      b = `hsl(${95 + s() * 35},${26 + s() * 16}%,${22 + s() * 12}%)`;
    ((e.fillStyle = b),
      s() > 0.75
        ? (e.beginPath(),
          e.moveTo(d, u - m * 2.4),
          e.lineTo(d - m * 0.6, u),
          e.lineTo(d + m * 0.6, u),
          e.fill())
        : (e.beginPath(),
          e.ellipse(d, u - m * 0.6, m, m * 0.8, 0, 0, 7),
          e.fill()),
      (e.fillStyle = `rgba(255,${200 + s() * 30},140,${0.1 + s() * 0.12})`),
      e.beginPath(),
      e.ellipse(d + m * 0.35, u - m * 0.8, m * 0.5, m * 0.45, 0, 0, 7),
      e.fill());
  }
  ((e.fillStyle = "#3d5230"), e.fillRect(0, n(-44), t, o));
});
Tn.wrapS = c.RepeatWrapping;
{
  const e = new c.Mesh(
    new c.CylinderGeometry(170, 170, 150, 72, 1, !0, 0.5 * Math.PI, Math.PI),
    new c.MeshBasicMaterial({
      map: Tn,
      side: c.BackSide,
      fog: !1,
      color: new c.Color(1.22, 1.14, 1.05),
    }),
  );
  (e.position.set(0, -24, 0), (e.scale.x = -1), ie.add(e), zt.push(e));
}
const Vo = "#2a3a5c";
function bt(e, t, o = 4, s = 1.2, i = Math.random) {
  ((e.lineWidth = o),
    (e.lineCap = "round"),
    (e.lineJoin = "round"),
    e.beginPath(),
    t.forEach(([n, r], a) => {
      ((n += (i() - 0.5) * s),
        (r += (i() - 0.5) * s),
        a ? e.lineTo(n, r) : e.moveTo(n, r));
    }),
    e.stroke());
}
{
  const e = D();
  (e.box(lr, -13.2, 5.2, H + 1.25, 12, 0.36, 2.4, { r: 0.05 }), e.flush(ie));
  const t = new c.Group(),
    o = D(),
    s = Be("#d9dde2", { roughness: 0.25 }),
    i = Be("#2a3340", { roughness: 0.1 }),
    n = z("#18191c");
  o.box(s, 0, 0.42, 0, 3.4, 0.5, 1.4, { r: 0.2 })
    .box(s, -0.15, 0.82, 0, 1.9, 0.46, 1.26, { r: 0.2 })
    .box(i, -0.15, 0.84, 0, 1.7, 0.3, 1.3, { r: 0.12 })
    .box(i, -0.15, 0.84, 0, 1.96, 0.3, 1.1, { r: 0.12 });
  for (const [d, u] of [
    [-1.05, 0.62],
    [1.05, 0.62],
    [-1.05, -0.62],
    [1.05, -0.62],
  ])
    o.cyl(n, d, 0.24, u, 0.26, 0.26, 0.2, { rx: Math.PI / 2, seg: 16 });
  (o.flush(t),
    t.position.set(-9.4, 5.38, H + 1.3),
    (t.rotation.y = 0.35),
    t.scale.setScalar(0.95),
    ie.add(t));
  const r = D(),
    a = ["#3d4a63", "#c9bda8", "#7a4d34", "#50604c", "#2b2e33", "#a58d6a"];
  let l = -15.6;
  for (let d = 0; d < 9; d++) {
    const u = 0.22 + ko(d) * 0.18,
      m = 2.1 + ko(d + 0.3) * 0.9,
      b = z(a[d % a.length], { roughness: 0.7 });
    (r.box(b, l, 5.38 + m / 2, H + 1.2, u, m, 1.7, { r: 0.02 }),
      (l += u + 0.03));
  }
  (r.box(
    z(a[2], { roughness: 0.7 }),
    l + 0.5,
    5.38 + 1.1,
    H + 1.2,
    0.24,
    2.2,
    1.6,
    { rz: -0.35 },
  ),
    Bt(
      r,
      -12.3,
      5.38,
      H + 1.3,
      1.25,
      5,
      Be("#e9e3d8", { roughness: 0.45, clearcoat: 0.3 }),
      "bush",
      16,
    ),
    r.flush(ie));
}
{
  const o = new c.Group();
  (o.position.set(-8.9, 0, -6.2),
    o.rotation.set(-0.2, 0.36, 0, "YXZ"),
    ie.add(o));
  const s = D();
  (s
    .box(
      B("#b9bec6", { roughness: 0.3 }),
      0,
      4.6 / 2 + 0.15,
      0,
      6.6 + 0.2,
      4.6 + 0.2,
      0.14,
      { r: 0.04 },
    )
    .box(B("#9aa0a9"), 0, 0.22, 0.22, 6.6 * 0.8, 0.1, 0.34),
    s.flush(o));
  const i = new c.Mesh(
    new c.PlaneGeometry(6.6, 4.6),
    Ce(
      new c.MeshStandardMaterial({
        roughness: 0.3,
        envMapIntensity: 0.6,
        map: Ms(1024, 714, (r, a, l) => {
          const d = Se(3);
          ((r.fillStyle = "#f4f3ef"),
            r.fillRect(0, 0, a, l),
            (r.strokeStyle = "rgba(120,130,150,.08)"));
          for (let u = 0; u < 30; u++)
            ((r.lineWidth = 20 + d() * 50),
              r.beginPath(),
              r.moveTo(d() * a, d() * l),
              r.lineTo(d() * a, d() * l),
              r.stroke());
          ((r.fillStyle = Vo),
            (r.font = '58px "Architects Daughter", cursive'),
            r.fillText("EVERY CORNER,", 60, 110),
            r.fillText("TWO PATHS", 60, 180),
            (r.strokeStyle = Vo),
            bt(
              r,
              [
                [70, 215],
                [380, 210],
              ],
              5,
              2,
              d,
            ),
            (r.strokeStyle = "#c2532f"),
            (r.lineWidth = 5),
            r.setLineDash([16, 12]),
            r.beginPath(),
            r.arc(420, 690, 190, -Math.PI * 0.95, -Math.PI * 0.35),
            r.stroke(),
            (r.strokeStyle = "#2c7fb8"),
            r.beginPath(),
            r.arc(420, 690, 330, -Math.PI * 0.95, -Math.PI * 0.35),
            r.stroke(),
            r.setLineDash([]),
            (r.strokeStyle = Vo),
            bt(
              r,
              [
                [420 - 190 * Math.cos(0.6), 690 - 190 * Math.sin(0.6) * 1],
                [420 - 330 * Math.cos(0.6), 690 - 330 * Math.sin(0.6)],
              ],
              6,
              1,
              d,
            ),
            (r.fillStyle = Vo),
            (r.font = '40px "Architects Daughter", cursive'),
            r.fillText("inner: short", 470, 470),
            r.fillText("outer: long", 650, 380),
            (r.font = '50px "Architects Daughter", cursive'),
            r.fillText("\u03C9L + \u03C9R = 2 \u03C9ring", 560, 610),
            (r.font = '40px "Architects Daughter", cursive'),
            r.fillText("torque  50 : 50", 600, 670));
        }),
        bumpScale: 0,
      }),
    ),
  );
  (i.position.set(0, 4.6 / 2 + 0.15, 0.08), o.add(i), (i.receiveShadow = !0));
  const n = D();
  (Bt(
    n,
    4.4,
    0,
    1.4,
    0.9,
    11,
    Be("#dcd6cb", { roughness: 0.45, clearcoat: 0.3 }),
    "bush",
    12,
  ),
    Bt(
      n,
      6.1,
      0,
      0.9,
      0.75,
      23,
      Be("#b9ad9b", { roughness: 0.5, clearcoat: 0.3 }),
      "bush",
      10,
    ),
    n
      .box(z("#566150", { roughness: 0.7 }), 0.4, 0.22, 1.6, 4.2, 0.44, 2.8, {
        r: 0.03,
      })
      .box(z("#c9bba2", { roughness: 0.7 }), 0.5, 0.62, 1.5, 3.8, 0.36, 2.5, {
        r: 0.03,
        ry: 0.08,
      }),
    n.flush(o));
}
{
  const o = (oo[1] + so[0]) / 2,
    s = 9.6,
    i = new c.Group();
  (i.position.set(o, s, H + 0.12), ie.add(i));
  const n = D();
  (n.box(
    B("#8a6a45", { roughness: 0.4, metalness: 0.7 }),
    0,
    0,
    0,
    4.2 + 0.24,
    5.4 + 0.24,
    0.16,
    { r: 0.03 },
  ),
    n.flush(i, !1));
  const r = new c.Mesh(
    new c.PlaneGeometry(4.2, 5.4),
    Ce(
      new c.MeshStandardMaterial({
        roughness: 0.7,
        envMapIntensity: 0.3,
        map: Ms(600, 772, (a, l, d) => {
          const u = Se(8);
          ((a.fillStyle = "#f1ece2"),
            a.fillRect(0, 0, l, d),
            (a.fillStyle = "#2e3442"),
            (a.font = '52px "Architects Daughter", cursive'),
            ["SAME", "POWER,", "DIFFERENT", "PATHS"].forEach((m, b) =>
              a.fillText(m, 58, 120 + b * 66),
            ),
            (a.strokeStyle = "#2e3442"),
            (a.lineWidth = 4),
            bt(
              a,
              [
                [60, 410],
                [250, 405],
              ],
              4,
              1,
              u,
            ),
            (a.lineWidth = 3),
            a.beginPath(),
            a.moveTo(110, 690),
            a.lineTo(250, 480),
            a.lineTo(330, 590),
            a.lineTo(400, 520),
            a.lineTo(520, 690),
            a.stroke(),
            (a.strokeStyle = "#c2532f"),
            (a.lineWidth = 3),
            a.setLineDash([10, 8]),
            a.beginPath(),
            a.moveTo(150, 740),
            a.bezierCurveTo(260, 700, 380, 690, 470, 600),
            a.stroke(),
            (a.strokeStyle = "#2c7fb8"),
            a.beginPath(),
            a.moveTo(150, 760),
            a.bezierCurveTo(290, 720, 420, 700, 500, 610),
            a.stroke(),
            a.setLineDash([]));
        }),
      }),
    ),
  );
  ((r.position.z = 0.09), i.add(r));
}
const dr = Ms(1024, 1400, (e, t, o) => {
  const s = Se(19);
  ((e.fillStyle = "#f6f3ec"),
    e.fillRect(0, 0, t, o),
    (e.strokeStyle = "rgba(120,150,190,.35)"),
    (e.lineWidth = 2));
  for (let r = 150; r < o; r += 56)
    (e.beginPath(), e.moveTo(40, r), e.lineTo(t - 30, r), e.stroke());
  e.strokeStyle = "#39465f";
  const i = 440,
    n = 520;
  for (let r = 0; r < 3; r++)
    ((e.lineWidth = 2.4),
      e.beginPath(),
      e.ellipse(i, n, 120 + r * 2, 260 + r * 3, 0, 0, 7),
      e.stroke());
  for (let r = 0; r < 44; r++) {
    const a = (r / 44) * N;
    ((e.lineWidth = 2),
      e.beginPath(),
      e.moveTo(i + Math.cos(a) * 120, n + Math.sin(a) * 260),
      e.lineTo(i + Math.cos(a) * 150, n + Math.sin(a) * 292),
      e.stroke());
  }
  ((e.lineWidth = 2.6), e.strokeRect(i + 20, n - 140, 210, 280));
  for (const r of [-1, 1])
    (e.beginPath(),
      e.ellipse(i + 125, n + r * 110, 60, 24, 0, 0, 7),
      e.stroke());
  (bt(
    e,
    [
      [60, n - 22],
      [330, n - 22],
    ],
    2.6,
    1.5,
    s,
  ),
    bt(
      e,
      [
        [60, n + 22],
        [330, n + 22],
      ],
      2.6,
      1.5,
      s,
    ),
    bt(
      e,
      [
        [560, n - 22],
        [900, n - 22],
      ],
      2.6,
      1.5,
      s,
    ),
    bt(
      e,
      [
        [560, n + 22],
        [900, n + 22],
      ],
      2.6,
      1.5,
      s,
    ));
  for (const r of [70, 900])
    ((e.lineWidth = 3),
      e.beginPath(),
      e.ellipse(r, n, 40, 190, 0, 0, 7),
      e.stroke());
  for (let r = 0; r < 40; r++) {
    ((e.lineWidth = 1), e.beginPath());
    const a = 330 + s() * 300,
      l = n + (s() - 0.5) * 500;
    (e.moveTo(a, l), e.lineTo(a + 18, l + 18), e.stroke());
  }
  ((e.fillStyle = "#39465f"),
    (e.font = '64px "Architects Daughter", cursive'),
    e.fillText("SAME POWER", 520, 990),
    e.fillText("DIFFERENT", 520, 1070),
    e.fillText("PATHS", 520, 1150),
    (e.font = '40px "Architects Daughter", cursive'),
    e.fillText("ring = (L + R) / 2", 90, 1300));
});
{
  const e = new c.Group();
  (e.position.set(-7.3, 0, 4.3), (e.rotation.y = 0.42), ie.add(e));
  const t = D(),
    o = 2.8,
    s = 3.8;
  t.box(
    z("#2f3542", { roughness: 0.6 }),
    0,
    0.03,
    0,
    o + 0.08,
    0.06,
    s + 0.06,
    { r: 0.02 },
  ).box(z("#e9e4da", { roughness: 0.9 }), 0, 0.075, 0, o, 0.04, s);
  for (let l = 0; l < 22; l++)
    t.tor(
      B("#9aa1ab", { roughness: 0.3 }),
      -o / 2 - 0.02,
      0.1,
      -s / 2 + 0.1 + (l * (s - 0.2)) / 21,
      0.07,
      0.012,
      { ry: Math.PI / 2, seg: 12, seg2: 4 },
    );
  t.flush(e);
  const i = new c.Mesh(
    new c.PlaneGeometry(o - 0.1, s - 0.1),
    Ce(
      new c.MeshStandardMaterial({
        map: dr,
        roughness: 0.9,
        envMapIntensity: 0.3,
      }),
    ),
  );
  ((i.rotation.x = -Math.PI / 2),
    (i.position.y = 0.098),
    (i.receiveShadow = !0),
    e.add(i));
  const n = new c.Group(),
    r = D(),
    a = Be("#16171b", { roughness: 0.2 });
  (r
    .geo(
      a,
      ge(
        [
          [-1.9, 0],
          [-1.9, 0.09],
          [-1.2, 0.11],
          [0.9, 0.11],
          [1.25, 0.09],
          [1.55, 0.04],
          [1.62, 0],
        ],
        24,
      ),
    )
    .cyl(we, -0.2, 0, 0, 0.117, 0.117, 0.14, { rz: Math.PI / 2, seg: 24 })
    .box(we, -1.3, 0.12, 0, 0.7, 0.03, 0.05),
    r.flush(n),
    n.position.set(3.5, 0.12, 0.9),
    (n.rotation.y = -0.9),
    e.add(n));
}
const Rn = [];
{
  const e = new c.Group();
  (e.position.set(8.6, 0, 4.2), (e.rotation.y = -0.34), ie.add(e));
  const t = [
    ["#2f3a4f", "#e8e2d6", "CURIOSITY", 0.42, -0.1],
    ["#3e4d45", "#ece6d8", "ENGINEERING", 0.38, 0.06],
    ["#1f2127", "#d9b377", "@RYANSAEL", 0.34, -0.04],
  ];
  let o = 0;
  t.forEach(([i, n, r, a, l], d) => {
    const u = 3.4 - d * 0.25,
      m = 2.4 - d * 0.12,
      b = new c.Group();
    (b.position.set(0, o + a / 2, 0), (b.rotation.y = l), e.add(b));
    const p = D();
    (p
      .box(z(i, { roughness: 0.6 }), 0, 0, 0, u, a, m, { r: 0.03 })
      .box(
        z("#efe9dc", { roughness: 0.9 }),
        0.04,
        0,
        -0.06,
        u - 0.12,
        a - 0.08,
        m - 0.02,
      ),
      p.flush(b));
    const f = st(
      u * 0.8,
      a * 0.62,
      1024,
      Math.round((1024 * a * 0.62) / (u * 0.8)),
      (w, x, T) => {
        ((w.fillStyle = n),
          (w.font = `600 ${Math.round(T * 0.62)}px Outfit, sans-serif`),
          (w.textAlign = "center"),
          (w.textBaseline = "middle"),
          (w.letterSpacing = `${Math.round(T * 0.12)}px`),
          w.fillText(r, x / 2, T / 2 + 2));
      },
      0.95,
    );
    (f.position.set(0, 0, m / 2 + 0.012),
      b.add(f),
      Rn.push({ g: b, sp: f, title: r }),
      (o += a));
  });
  const s = D();
  (Bt(
    s,
    2.4,
    0,
    -2.6,
    1.45,
    31,
    Be("#cfc8bb", { roughness: 0.45, clearcoat: 0.3 }),
    "bush",
    18,
  ),
    s.flush(e));
}
{
  const e = D();
  (Bt(
    e,
    15.2,
    0,
    -6.2,
    2.4,
    44,
    Be("#2f3238", { roughness: 0.5, clearcoat: 0.3 }),
    "tall",
    14,
  ),
    Bt(
      e,
      -5.8,
      0,
      -9.8,
      1.3,
      52,
      Be("#e4ddd1", { roughness: 0.45, clearcoat: 0.3 }),
      "blade",
      11,
    ),
    e.flush(ie));
}
const Ee = new c.Group();
Co.add(Ee);
const le = 0.7,
  xe = 1.5,
  Ut = 1.45,
  kn = 1.42,
  A = xe + Ut,
  _e = 1.1,
  de = 4.02,
  fr = 2.84,
  ao = 5.55,
  L = 1.36,
  Q = 0.15,
  Y = Q - 0.12 * L,
  wt = { x0: Q - 1.42, x1: Q + 1.72, H: 1.74, D: 1.74, r: 0.34 },
  gt = B("#2d3036", {
    roughness: 0.46,
    metalness: 0.35,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
    envMapIntensity: 0.62,
  }),
  Wt = B("#1f2227", { roughness: 0.52, metalness: 0.4, envMapIntensity: 0.6 }),
  ur = B("#e9e7e3", {
    roughness: 0.45,
    metalness: 0.05,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    envMapIntensity: 0.8,
  }),
  pr = z("#c8c6c2", { roughness: 0.6 }),
  ro = new c.Group();
Ee.add(ro);
const fe = { z0: 2.27, y0: 0.66, z1: 2.66, y1: 0.1 },
  Ln = Math.hypot(fe.z1 - fe.z0, fe.y0 - fe.y1),
  mr = [];
{
  const e = (i, n, r) => {
      const a = new c.Shape(i.map(([d, u]) => new c.Vector2(d, u))),
        l = new c.ExtrudeGeometry(a, {
          depth: r - n - 0.1,
          bevelEnabled: !0,
          bevelThickness: 0.05,
          bevelSize: 0.045,
          bevelSegments: 3,
          curveSegments: 1,
        });
      return (l.rotateY(-Math.PI / 2), l.translate(r - 0.05, 0, 0), l);
    },
    t = new c.Mesh(
      e(
        [
          [2.62, 0.05],
          [fe.z1, fe.y1],
          [fe.z0, fe.y0],
          [2.2, le - 0.005],
          [-2.29, le - 0.005],
          [-2.35, le - 0.06],
          [-2.35, 0.05],
        ],
        -ao,
        ao,
      ),
      gt,
    ),
    o = new c.Mesh(
      e(
        [
          [1.98, le - 0.02],
          [1.6, _e - 0.04],
          [1.55, _e],
          [-2.05, _e],
          [-2.1, _e - 0.05],
          [-2.1, le - 0.02],
        ],
        -2.7,
        2.7,
      ),
      gt,
    );
  for (const i of [t, o])
    ((i.castShadow = i.receiveShadow = !0), ro.add(i), mr.push(i));
  const s = D();
  s.box(
    z("#121315", { roughness: 0.8 }),
    0,
    0.025,
    0.15,
    ao * 2 - 0.4,
    0.05,
    4.6,
  );
  for (const i of [-ao + 0.5, ao - 0.5])
    for (const n of [-1.9, 1.9])
      s.cyl(z("#101113"), i, 0.02, n, 0.2, 0.22, 0.04, { seg: 16 });
  s.flush(ro);
}
const Ht = new c.Group();
((Ht.rotation.x = -Math.atan2(1.98 - 1.6, _e - 0.04 - (le - 0.02))),
  Ht.position
    .set(0, le - 0.02, 1.98)
    .addScaledVector(
      new c.Vector3(0, -Math.sin(Ht.rotation.x), Math.cos(Ht.rotation.x)),
      0.052,
    ),
  ro.add(Ht));
const Ts = Math.hypot(1.98 - 1.6, _e - 0.04 - (le - 0.02)),
  Pn = st(
    4.6,
    Ts * 0.86,
    2048,
    Math.round((2048 * Ts * 0.86) / 4.6),
    (e, t, o) => {
      ((e.textAlign = "center"), (e.textBaseline = "middle"));
      const s = "DIFFERENTIAL",
        i = "TWO WHEELS  \xB7  ONE ENGINE";
      ((e.font = `700 ${Math.round(o * 0.46)}px Outfit, sans-serif`),
        (e.letterSpacing = `${Math.round(o * 0.07)}px`),
        (e.fillStyle = "#8b919c"),
        e.fillText(s, t / 2, o * 0.36 + 3),
        (e.fillStyle = "#1b1d22"),
        e.fillText(s, t / 2, o * 0.36),
        (e.font = `500 ${Math.round(o * 0.17)}px Outfit, sans-serif`),
        (e.letterSpacing = `${Math.round(o * 0.05)}px`),
        (e.fillStyle = "#7d838e"),
        e.fillText(i, t / 2, o * 0.8 + 2),
        (e.fillStyle = "#1d2025"),
        e.fillText(i, t / 2, o * 0.8));
    },
    0.62,
    { alphaTest: 0.15 },
  );
(Pn.position.set(0, Ts * 0.5, 0.006), Ht.add(Pn));
const Rs = nt(256, 1024, (e, t, o) => {
  const s = Se(33);
  ((e.fillStyle = "#3c3d41"), e.fillRect(0, 0, t, o));
  for (let i = 0; i < 9e3; i++) {
    const n = 40 + s() * 90;
    ((e.fillStyle = `rgba(${n},${n},${n + 4},${0.35 + s() * 0.4})`),
      e.fillRect(s() * t, s() * o, 1 + s() * 2.5, 1 + s() * 2.5));
  }
  for (let i = 0; i < o; i += 128)
    ((e.fillStyle = "#e8e4d8"), e.fillRect(t / 2 - 7, i + 20, 14, 64));
  ((e.fillStyle = "rgba(230,226,214,.85)"),
    e.fillRect(10, 0, 5, o),
    e.fillRect(t - 15, 0, 5, o));
});
Rs.wrapS = Rs.wrapT = c.RepeatWrapping;
const ks = nt(256, 1024, (e, t, o) => {
  const s = Se(34),
    i = e.createLinearGradient(0, 0, t, 0);
  (i.addColorStop(0, "#bcd6e6"),
    i.addColorStop(0.5, "#e4f1f8"),
    i.addColorStop(1, "#bcd6e6"),
    (e.fillStyle = i),
    e.fillRect(0, 0, t, o));
  for (let n = 0; n < 90; n++) {
    ((e.strokeStyle = `rgba(255,255,255,${0.3 + s() * 0.5})`),
      (e.lineWidth = 0.8 + s() * 1.6),
      e.beginPath());
    let r = s() * t,
      a = s() * o;
    e.moveTo(r, a);
    for (let l = 0; l < 5; l++)
      ((r += (s() - 0.5) * 60), (a += (s() - 0.5) * 80), e.lineTo(r, a));
    e.stroke();
  }
  for (let n = 0; n < 500; n++)
    ((e.fillStyle = `rgba(255,255,255,${s() * 0.8})`),
      e.fillRect(s() * t, s() * o, 1.5, 1.5));
  for (let n = 0; n < o; n += 128)
    ((e.fillStyle = "rgba(120,160,190,.55)"),
      e.fillRect(t / 2 - 7, n + 20, 14, 64));
});
ks.wrapS = ks.wrapT = c.RepeatWrapping;
function br() {
  const e = { uOff: { value: 0 }, uIce: { value: 0 }, tIce: { value: ks } },
    t = Ce(
      new c.MeshStandardMaterial({
        map: Rs,
        roughness: 0.82,
        envMapIntensity: 0.5,
      }),
      Object.assign(
        (o) => {
          (Object.assign(o.uniforms, e),
            (o.fragmentShader = o.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
uniform float uOff;uniform float uIce;uniform sampler2D tIce;`,
              )
              .replace(
                "#include <map_fragment>",
                "vec2 buv=vMapUv+vec2(0.,uOff);vec4 sa=texture2D(map,buv);vec4 si=texture2D(tIce,buv);diffuseColor*=mix(sa,si,uIce);",
              )
              .replace(
                "#include <roughnessmap_fragment>",
                `#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.14,uIce);`,
              )));
        },
        { key: "belt" },
      ),
    );
  return ((t.userData.u = e), t);
}
const Uo = [];
for (const e of [-1, 1]) {
  const t = new c.Group();
  (t.position.set(e * de, 0, 0), Ee.add(t));
  const o = D(),
    s = 4.1;
  (o.box(Wt, 0, (le + xe - 0.1) / 2, 0, 2.06, xe - 0.1 - le + 0.02, s, {
    r: 0.05,
  }),
    o.box(gt, 0, xe - 0.075, 0, 2.1, 0.05, s + 0.04, { r: 0.02 }));
  for (const l of [-s / 2 + 0.28, s / 2 - 0.28])
    o.cyl(Ve, 0, xe - 0.2, l, 0.19, 0.19, 1.72, { rz: Math.PI / 2, seg: 24 });
  for (const l of [-s / 2 + 0.28, s / 2 - 0.28])
    for (const d of [-0.9, 0.9])
      o.cyl(we, d, xe - 0.2, l, 0.08, 0.08, 0.08, { rz: Math.PI / 2, seg: 12 });
  o.flush(t);
  const i = br(),
    n = new c.Mesh(new c.BoxGeometry(1.66, 0.035, s - 0.12), i);
  ((n.position.y = xe - 0.016), (n.receiveShadow = !0), t.add(n));
  const r = n.geometry.attributes.uv;
  for (let l = 0; l < r.count; l++) r.setY(l, r.getY(l) * 2.2);
  const a = [];
  for (const l of [-s / 2 + 0.28, s / 2 - 0.28]) {
    const d = new c.Mesh(
      new c.CylinderGeometry(0.205, 0.205, 1.66, 24, 1, !0),
      z("#2a2b2f", { roughness: 0.8 }),
    );
    ((d.rotation.z = Math.PI / 2),
      d.position.set(0, xe - 0.2, l),
      t.add(d),
      a.push(d));
  }
  Uo.push({
    g: t,
    mat: i,
    u: i.userData.u,
    belt: n,
    off: 0,
    ice: 0,
    drop: 0,
    side: e,
  });
}
{
  const e = D();
  for (const t of [-1, 1]) {
    const o = t * fr;
    (e
      .box(Wt, o, (le + A - 0.3) / 2, 0, 0.5, A - 0.3 - le, 0.8, { r: 0.05 })
      .box(gt, o, le + 0.06, 0, 0.9, 0.12, 1.3, { r: 0.04 }),
      e.geo(
        Ve,
        ge(
          [
            [-0.2, 0.16],
            [-0.2, 0.36],
            [-0.16, 0.4],
            [0.16, 0.4],
            [0.2, 0.36],
            [0.2, 0.16],
          ],
          40,
        ),
        o,
        A,
        0,
      ));
    for (const s of [-0.46, 0.46])
      e.cyl(we, o, le + 0.14, s, 0.07, 0.07, 0.06, { seg: 6 });
  }
  {
    const t = A - wt.H;
    for (const o of [wt.x0 + 0.6, wt.x1 - 0.6])
      for (const s of [-0.95, 0.95])
        e.box(Wt, o, (_e + t) / 2 + 0.01, s, 0.46, t - _e + 0.02, 0.46, {
          r: 0.03,
        });
  }
  e.flush(Ee);
}
const wr = 1,
  Ls = (75 * Math.PI) / 180,
  Cn = wr / Math.sin(Ls),
  An = Math.atan2(16, 10),
  In = 0.55,
  gr = Do({
    N: 41,
    A: Cn,
    gam: Ls,
    F: 0.3,
    spiral: 0.32,
    back: 0.2,
    bore: 0.6,
  }),
  En = Do({
    N: 11,
    A: Cn,
    gam: Math.PI / 2 - Ls,
    F: 0.3,
    spiral: -0.32,
    back: 0.1,
    bore: 0,
  }),
  xr = Do({ N: 16, A: In, gam: An, F: 0.19, back: 0.12, bore: 0.13 }),
  _n = Do({
    N: 10,
    A: In,
    gam: Math.PI / 2 - An,
    F: 0.19,
    back: 0.035,
    bore: 0.075,
  }),
  qt = _n.userData.backY,
  Ps = B("#cfd5dd", {
    roughness: 0.26,
    metalness: 1,
    clearcoat: 0,
    envMapIntensity: 1.35,
  }),
  vr = B("#a9b0ba", { roughness: 0.3, metalness: 1, clearcoat: 0 }),
  yr = z("#1f2228", { roughness: 0.6, flatShading: !0, envMapIntensity: 0.6 }),
  at = {},
  ue = new c.Group();
(ue.position.set(Q, A, 0),
  ue.scale.setScalar(L),
  Ee.add(ue),
  (at.carrier = ue));
const io = B("#30343b", {
  roughness: 0.42,
  metalness: 0.7,
  envMapIntensity: 0.9,
});
{
  const e = D(),
    t = qt + 0.06;
  (e.geo(
    io,
    ge(
      [
        [-0.74, 0.5],
        [-0.74, 0.76],
        [-0.6, 0.76],
        [-0.6, 0.5],
        [-0.74, 0.5],
      ],
      56,
    ),
  ),
    e.geo(
      io,
      ge(
        [
          [0.6, 0.22],
          [0.6, 0.46],
          [0.72, 0.46],
          [0.72, 0.22],
          [0.6, 0.22],
        ],
        48,
      ),
    ));
  for (const o of [-1, 1])
    (e.cyl(io, 0.16, o * t, 0, 0.042, 0.042, 0.88, {
      rz: Math.PI / 2,
      seg: 12,
    }),
      e.cyl(io, 0, o * t, 0, 0.075, 0.075, 0.1, { seg: 16 }),
      e.box(io, 0.66, (o * (t + 0.23)) / 2, 0, 0.1, t - 0.23, 0.09));
  for (let o = 0; o < 10; o++) {
    const s = (o / 10) * N;
    e.cyl(
      we,
      -0.76,
      Math.cos(s) * 0.68,
      Math.sin(s) * 0.68,
      0.045,
      0.045,
      0.06,
      { rz: Math.PI / 2, seg: 6 },
    );
  }
  (e.cyl(we, 0, 0, 0, 0.065, 0.065, 2 * (qt + 0.1), { seg: 16 }), e.flush(ue));
}
const lo = new c.Group();
((lo.position.x = (Y - Q) / L), (lo.rotation.z = Math.PI / 2), ue.add(lo));
const Cs = new c.Mesh(gr, Ja);
((Cs.castShadow = Cs.receiveShadow = !0), lo.add(Cs), (at.ring = lo));
const Fn = Math.PI / 10,
  co = [];
for (const e of [1, -1]) {
  const t = new c.Group();
  (e < 0 && (t.rotation.x = Math.PI), ue.add(t));
  const o = new c.Mesh(_n, Ps);
  ((o.castShadow = o.receiveShadow = !0), (o.rotation.y = Fn), t.add(o));
  const s = new c.Mesh(
    Ne(
      [
        [0.075, qt],
        [0.3, qt],
        [0.3, qt + 0.02],
        [0.075, qt + 0.02],
      ],
      32,
    ),
    Ve,
  );
  (o.add(s), co.push({ hold: t, m: o }));
}
at.spiders = co;
function Dn(e) {
  const t = new c.Group();
  (t.position.set(Q, A, 0), Ee.add(t));
  const o = new c.Group();
  ((o.rotation.z = e < 0 ? Math.PI / 2 : -Math.PI / 2),
    o.scale.setScalar(L),
    t.add(o));
  const s = new c.Mesh(xr, Ps);
  ((s.castShadow = s.receiveShadow = !0),
    o.add(s),
    s.add(
      new c.Mesh(
        Ne(
          [
            [0.13, 0.4],
            [0.2, 0.4],
            [0.2, 0.72],
            [0.13, 0.72],
          ],
          32,
        ),
        vr,
      ),
    ));
  const i = e * 0.72 * L,
    n = e * (de - 0.24) - Q,
    r = D(),
    a = 0.155;
  r.geo(
    we,
    ge(
      e < 0
        ? [
            [n, 0],
            [n, a],
            [i, a],
            [i, 0],
          ]
        : [
            [i, 0],
            [i, a],
            [n, a],
            [n, 0],
          ],
      32,
    ),
  );
  const l = n;
  (r.geo(
    Ve,
    ge(
      e < 0
        ? [
            [l - 0.06, 0],
            [l - 0.06, 0.46],
            [l + 0.1, 0.46],
            [l + 0.1, a],
          ]
        : [
            [l - 0.1, a],
            [l - 0.1, 0.46],
            [l + 0.06, 0.46],
            [l + 0.06, 0],
          ],
      40,
    ),
  ),
    r.flush(t));
  const d = new c.Mesh(
    new c.BoxGeometry(1, 0.03, 0.055),
    mt(e < 0 ? "#ffae3a" : "#62dcff", 1.25),
  );
  (d.position.set((i + n) / 2, a + 0.002, 0),
    (d.scale.x = Math.abs(n - i) - 0.3),
    t.add(d));
  const u = d.clone();
  ((u.position.y = -a - 0.002), t.add(u));
  const m = new c.Group();
  ((m.position.x = e * de - Q), t.add(m));
  const b = new c.Mesh(rr(Ut, kn, 18, e < 0 ? 1 : 2), yr);
  ((b.castShadow = b.receiveShadow = !0), m.add(b));
  const p = D(),
    f = B("#2d3138", { roughness: 0.34, metalness: 0.85 }),
    w = B("#5d646e", { roughness: 0.3, metalness: 0.9 });
  p.geo(
    f,
    ge(
      [
        [-0.62, 0.9],
        [-0.62, 0.99],
        [-0.56, 0.97],
        [0.56, 0.97],
        [0.62, 0.99],
        [0.62, 0.9],
        [0.56, 0.9],
        [-0.56, 0.9],
      ],
      48,
    ),
  );
  for (let T = 0; T < 6; T++) {
    const y = (T / 6) * N;
    p.box(w, 0, Math.cos(y) * 0.56, Math.sin(y) * 0.56, 0.18, 0.72, 0.16, {
      rx: y,
      r: 0.05,
    });
  }
  p.geo(
    f,
    ge(
      [
        [-0.22, 0.1],
        [-0.22, 0.3],
        [-0.12, 0.32],
        [0.12, 0.32],
        [0.22, 0.3],
        [0.22, 0.1],
      ],
      32,
    ),
  );
  for (let T = 0; T < 5; T++) {
    const y = (T / 5) * N;
    p.cyl(
      we,
      -e * 0.25,
      Math.cos(y) * 0.22,
      Math.sin(y) * 0.22,
      0.04,
      0.04,
      0.1,
      { rz: Math.PI / 2, seg: 6 },
    );
  }
  (p.geo(
    we,
    ge(
      e > 0
        ? [
            [0.23, 0],
            [0.23, 0.15],
            [0.3, 0.1],
            [0.31, 0],
          ]
        : [
            [-0.31, 0],
            [-0.3, 0.1],
            [-0.23, 0.15],
            [-0.23, 0],
          ],
      24,
    ),
  ),
    p.flush(m));
  const x = new c.Mesh(
    new c.TorusGeometry(0.905, 0.018, 6, 72),
    mt(e < 0 ? "#ffae3a" : "#62dcff", 2.4),
  );
  return (
    (x.rotation.y = Math.PI / 2),
    (x.position.x = -e * 0.59),
    m.add(x),
    {
      g: t,
      side: s,
      sideHold: o,
      wheel: m,
      tyre: b,
      glow: x,
      stripe: d,
      stripe2: u,
      s: e,
      x0: i,
      x1: n,
    }
  );
}
const re = { L: Dn(-1), R: Dn(1) },
  ho = new c.Group();
(ho.scale.setScalar(L), re.R.g.add(ho));
{
  const e = D();
  e.geo(
    Ve,
    ge(
      [
        [0.85, 0.14],
        [0.85, 0.34],
        [1.03, 0.34],
        [1.03, 0.14],
        [0.85, 0.14],
      ],
      40,
    ),
  );
  for (let t = 0; t < 6; t++) {
    const o = (t / 6) * N;
    e.box(we, 0.82, Math.cos(o) * 0.26, Math.sin(o) * 0.26, 0.06, 0.1, 0.12, {
      rx: o,
    });
  }
  e.flush(ho);
}
const Wo = new c.Mesh(
  new c.TorusGeometry(0.345, 0.02, 6, 48),
  mt("#ff9a5a", 1.2),
);
((Wo.rotation.y = Math.PI / 2), (Wo.position.x = 1.04), ho.add(Wo));
{
  const e = D();
  for (let t = 0; t < 6; t++) {
    const o = ((t + 0.5) / 6) * N;
    e.box(Ve, 0.75, Math.cos(o) * 0.26, Math.sin(o) * 0.26, 0.06, 0.1, 0.12, {
      rx: o,
    });
  }
  e.flush(ue);
}
const rt = new c.Group();
(rt.position.set(Y, A, 0), Ee.add(rt), (at.pinion = rt));
const Ho = new c.Mesh(En, Ps);
(Ho.scale.setScalar(L), (Ho.castShadow = Ho.receiveShadow = !0), rt.add(Ho));
const Gn = En.userData.backY * L,
  oe = 10.8;
{
  const e = D(),
    t = Be("#1a1c20", { roughness: 0.3 }),
    o = wt.H + 0.55;
  (e.geo(
    we,
    Ne(
      [
        [0, Gn - 0.02],
        [0.17, Gn - 0.02],
        [0.17, o],
        [0.23, o],
        [0.23, o + 0.1],
        [0, o + 0.1],
      ],
      28,
    ),
  ),
    e.geo(
      we,
      Ne(
        [
          [0, o + 0.1],
          [0.42, o + 0.1],
          [0.42, o + 0.36],
          [0.22, o + 0.36],
          [0.22, o + 0.44],
          [0, o + 0.44],
        ],
        40,
      ),
    ));
  for (let s = 0; s < 6; s++) {
    const i = (s / 6) * N;
    e.cyl(
      Ve,
      Math.cos(i) * 0.33,
      o + 0.38,
      Math.sin(i) * 0.33,
      0.05,
      0.05,
      0.1,
      { seg: 6 },
    );
  }
  (e.geo(
    t,
    Ne(
      [
        [0, o + 0.44],
        [0.22, o + 0.44],
        [0.22, oe - A - 0.5],
        [0, oe - A - 0.5],
      ],
      28,
    ),
  ),
    e.flush(rt));
}
const fo = new c.Group();
Ee.add(fo);
{
  const e = D(),
    t = B("#30343b", { roughness: 0.36, metalness: 0.8 }),
    o = B("#3c4149", { roughness: 0.4, metalness: 0.7 }),
    s = Y - 0.3,
    i = -1.9,
    n = oe + 2.1;
  (e
    .cyl(Wt, s, (_e + n) / 2, i, 0.15, 0.17, n - _e, { seg: 20 })
    .box(gt, s, _e + 0.08, i, 0.7, 0.16, 0.7, { r: 0.04 }),
    e.box(Wt, (s + Y) / 2, n - 0.05, (i + 0.1) / 2, 0.5, 0.4, 2.4, { r: 0.06 }),
    e.geo(
      t,
      Ne(
        [
          [0, oe - 0.5],
          [0.52, oe - 0.5],
          [0.62, oe - 0.35],
          [0.62, oe + 1.3],
          [0.5, oe + 1.45],
          [0, oe + 1.45],
        ],
        40,
      ),
      Y,
      0,
      0,
    ));
  for (let l = 0; l < 16; l++) {
    const d = (l / 16) * N;
    e.box(
      o,
      Y + Math.cos(d) * 0.66,
      oe + 0.45,
      Math.sin(d) * 0.66,
      0.08,
      1.4,
      0.16,
      { ry: -d },
    );
  }
  (e.geo(
    Ve,
    Ne(
      [
        [0, oe + 1.45],
        [0.44, oe + 1.45],
        [0.44, oe + 1.62],
        [0, oe + 1.62],
      ],
      32,
    ),
    Y,
    0,
    0,
  ),
    e.flush(fo));
  const r = new c.Mesh(
    new c.TorusGeometry(0.64, 0.025, 6, 64),
    mt("#ffb454", 2.6),
  );
  ((r.rotation.x = Math.PI / 2),
    r.position.set(Y, oe - 0.36, 0),
    fo.add(r),
    (at.motorRing = r));
  const a = st(
    1.1,
    0.26,
    512,
    122,
    (l, d, u) => {
      ((l.textAlign = "center"),
        (l.textBaseline = "middle"),
        (l.font = "600 70px Outfit, sans-serif"),
        (l.letterSpacing = "14px"),
        (l.fillStyle = "#d9dde5"),
        l.fillText("ENGINE", d / 2, u / 2 + 2));
    },
    0.8,
  );
  (a.position.set(Y, oe + 0.6, 0.69), fo.add(a));
}
const qo = new c.MeshPhysicalMaterial({
  color: "#f6fbff",
  roughness: 0.01,
  metalness: 0,
  transmission: 0.97,
  thickness: 0.05,
  ior: 1.45,
  envMapIntensity: 0.7,
  specularIntensity: 1,
  side: c.FrontSide,
  attenuationColor: "#e6f6ff",
  attenuationDistance: 12,
  depthWrite: !1,
});
((qo.onBeforeCompile = (e) => {
  e.fragmentShader = e.fragmentShader.replace(
    "#include <opaque_fragment>",
    `{float f=1.-abs(dot(normalize(normal),normalize(vViewPosition)));outgoingLight+=vec3(1.,.94,.84)*pow(max(f,0.),2.4)*.85;}
#include <opaque_fragment>`,
  );
}),
  (qo.customProgramCacheKey = () => "hglass"));
const Ze = { front: new c.Group(), back: new c.Group() };
Ee.add(Ze.front, Ze.back);
{
  const { x0: e, x1: t, H: o, D: s, r: i } = wt,
    n = (e + t) / 2;
  for (const a of ["front", "back"]) {
    const l = a === "front" ? 1 : -1,
      d = [],
      u = new c.Mesh(new sn(t - e, o * 2, s, 5, i), qo);
    (u.position.set(n, A, (l * s) / 2), d.push(u));
    const m = a === "front" ? [-Math.PI / 2, Math.PI] : [Math.PI / 2, Math.PI];
    for (const f of [-1, 1]) {
      const w = f < 0 ? e + 0.02 : t - 0.02,
        x = w + f * 0.5;
      d.push(
        new c.Mesh(
          ge(
            f < 0
              ? [
                  [x, 0.34],
                  [w, 0.78],
                ]
              : [
                  [w, 0.78],
                  [x, 0.34],
                ],
            40,
            m,
          ),
          qo,
        ),
      );
    }
    for (const f of d) ((f.renderOrder = 2), Ze[a].add(f), zt.push(f));
    const b = D(),
      p = B("#5a616b", { roughness: 0.3, metalness: 0.9 });
    for (const f of [e + 0.34, t - 0.34])
      for (const w of [-1, 1])
        b.cyl(p, f, A + w * (o - 0.3), l * (s - 0.02), 0.075, 0.075, 0.08, {
          rx: Math.PI / 2,
          seg: 6,
        });
    b.flush(Ze[a]);
  }
  const r = D();
  for (const a of [-1, 1]) {
    const l = (a < 0 ? e : t) + a * 0.5;
    r.geo(
      Ve,
      ge(
        [
          [l - 0.14, 0.16],
          [l - 0.14, 0.42],
          [l + 0.14, 0.42],
          [l + 0.14, 0.16],
          [l - 0.14, 0.16],
        ],
        40,
      ),
    );
  }
  (r.geo(
    Ve,
    Ne(
      [
        [0.19, 0],
        [0.5, 0],
        [0.5, 0.16],
        [0.19, 0.16],
        [0.19, 0],
      ],
      40,
    ),
    Y,
    A + o - 0.02,
    0,
  ),
    r.flush(Ee));
}
at.housing = Ze;
const pe = new c.Group();
((pe.rotation.x = -Math.atan2(fe.z1 - fe.z0, fe.y0 - fe.y1)),
  pe.position
    .set(0, fe.y1, fe.z1)
    .addScaledVector(
      new c.Vector3(0, -Math.sin(pe.rotation.x), Math.cos(pe.rotation.x)),
      0.05,
    ),
  ro.add(pe));
const me = {},
  As = [];
{
  const e = Ln * 0.5,
    t = new c.Group();
  (t.position.set(-2.95, e, 0), pe.add(t));
  const o = D();
  (o
    .cyl(pn, 0, 0, 0.03, 0.27, 0.29, 0.06, { rx: Math.PI / 2, seg: 40 })
    .cyl(z("#15171b", { roughness: 0.5 }), 0, 0, 0.07, 0.24, 0.24, 0.02, {
      rx: Math.PI / 2,
      seg: 40,
    }),
    o.flush(t, !1));
  const s = new c.Mesh(
    new c.TorusGeometry(0.265, 0.022, 6, 56),
    mt("#6fe0ff", 3),
  );
  ((s.position.z = 0.07), t.add(s));
  const i = st(0.3, 0.3, 128, 128, null, 2.2, { alphaTest: 0.2 });
  ((i.position.z = 0.085),
    t.add(i),
    (me.pause = {
      g: t,
      ring: s,
      icon: i,
      drawn: null,
      draw(M) {
        this.drawn !== M &&
          ((this.drawn = M),
          i.userData.redraw((P, X, V) => {
            ((P.fillStyle = "#bff3ff"),
              M
                ? (P.beginPath(),
                  P.moveTo(44, 30),
                  P.lineTo(100, 64),
                  P.lineTo(44, 98),
                  P.fill())
                : (P.fillRect(36, 30, 20, 68), P.fillRect(72, 30, 20, 68)));
          }));
      },
    }),
    me.pause.draw(!1));
  const n = -2,
    r = 1.75,
    a = D();
  (a.box(
    z("#0d0f13", { roughness: 0.5 }),
    (n + r) / 2,
    e,
    0.012,
    r - n + 0.12,
    0.07,
    0.02,
    { r: 0.02 },
  ),
    a.flush(pe, !1));
  const l = new c.Mesh(new c.BoxGeometry(1, 0.034, 0.012), mt("#6fe0ff", 3));
  (l.position.set(n, e, 0.028), pe.add(l));
  const d = new c.Group(),
    u = D();
  (u
    .cyl(we, 0, 0, 0.06, 0.13, 0.13, 0.1, { rx: Math.PI / 2, seg: 28 })
    .cyl(z("#dfe6ee", { roughness: 0.3 }), 0, 0, 0.115, 0.1, 0.1, 0.012, {
      rx: Math.PI / 2,
      seg: 28,
    }),
    u.flush(d));
  const m = new c.Mesh(
    new c.TorusGeometry(0.14, 0.014, 6, 40),
    mt("#6fe0ff", 2.2),
  );
  ((m.position.z = 0.06), d.add(m), d.position.set(n, e, 0), pe.add(d));
  const b = new c.Mesh(
    new c.PlaneGeometry(r - n + 0.4, 0.5),
    new c.MeshBasicMaterial({ visible: !1 }),
  );
  (b.position.set((n + r) / 2, e, 0.06), pe.add(b));
  const p = (M, P, X) => {
    const V = st(
      0.8,
      0.2,
      320,
      80,
      (Me, Ct, At) => {
        ((Me.textAlign = X),
          (Me.textBaseline = "middle"),
          (Me.font = "500 46px Outfit, sans-serif"),
          (Me.fillStyle = "#e8edf4"),
          Me.fillText(
            M,
            X === "left" ? 4 : X === "right" ? Ct - 4 : Ct / 2,
            At / 2 + 2,
          ));
      },
      1.05,
    );
    return (V.position.set(P, e, 0.02), pe.add(V), V);
  };
  (p("Slow", n - 0.52, "right"),
    p("Fast", r + 0.5, "left"),
    (me.slider = {
      a: n,
      b: r,
      y: e,
      fill: l,
      knob: d,
      hit: b,
      set(M) {
        const P = $e(n, r, S(M, 0, 1));
        ((d.position.x = P),
          (l.scale.x = Math.max(0.001, P - n)),
          (l.position.x = n + (P - n) / 2));
      },
      fromRay(M) {
        const P = M.intersectObject(b, !1)[0];
        if (!P) return null;
        const X = pe.worldToLocal(P.point.clone());
        return S((X.x - n) / (r - n), 0, 1);
      },
    }));
  const f = new c.Group();
  (f.position.set(2.7, e, 0), pe.add(f));
  const w = D();
  (w
    .cyl(pn, 0, 0, 0.03, 0.25, 0.27, 0.06, { rx: Math.PI / 2, seg: 40 })
    .cyl(z("#1d2026", { roughness: 0.45 }), 0, 0, 0.07, 0.22, 0.22, 0.02, {
      rx: Math.PI / 2,
      seg: 40,
    }),
    w.flush(f, !1));
  const x = st(
    0.34,
    0.34,
    128,
    128,
    (M, P, X) => {
      ((M.strokeStyle = "#e8edf4"),
        (M.lineWidth = 9),
        (M.lineCap = "round"),
        M.beginPath(),
        M.arc(64, 66, 34, -Math.PI * 0.35, Math.PI * 1.45),
        M.stroke(),
        (M.fillStyle = "#e8edf4"),
        M.beginPath(),
        M.moveTo(92, 14),
        M.lineTo(100, 50),
        M.lineTo(66, 42),
        M.fill());
    },
    1.1,
    { alphaTest: 0.2 },
  );
  ((x.position.z = 0.085), f.add(x));
  const T = p("Reset", 3.4, "left");
  me.reset = { g: f, label: T };
  const y = st(
    1.5,
    0.1,
    1536,
    102,
    (M, P, X) => {
      ((M.textAlign = "center"),
        (M.textBaseline = "middle"),
        (M.font = "600 62px DM Mono, monospace"),
        (M.letterSpacing = "6px"));
      const V = "@RYANSAEL ON X";
      ((M.fillStyle = "#8c929c"),
        M.fillText(V, P / 2, X / 2 + 3),
        (M.fillStyle = "#16181c"),
        M.fillText(V, P / 2, X / 2));
    },
    0.6,
    { alphaTest: 0.2 },
  );
  (y.position.set(-3.9, Ln * 0.24, 0.004),
    pe.add(y),
    As.push({
      hit: y,
      over(M) {
        y.material.color.setRGB(M ? 0.9 : 0.6, M ? 0.78 : 0.6, M ? 0.5 : 0.6);
      },
    }));
}
{
  const e = Rn.find((t) => t.title === "@RYANSAEL");
  As.push({
    hit: e.sp,
    over(t) {
      e.sp.material.color.setRGB(
        t ? 1.35 : 0.95,
        t ? 1.12 : 0.95,
        t ? 0.7 : 0.95,
      );
    },
  });
}
const q = {
  m: 1500,
  g: 9.81,
  r: 0.33,
  t: 1.6,
  i: 41 / 11,
  crr: 0.012,
  k: 3e4,
  muDry: 0.9,
  muIce: 0.1,
  rpm: 150,
  rMin: 4,
};
((q.N = (q.m * q.g) / 4), (q.wSet = (q.rpm * N) / 60));
const uo = (e) => (e * 60) / N,
  Is = (e) => e * 0.2;
function Mr(e) {
  const t = Math.atan(Is(e));
  return q.m * q.g * (Math.sin(t) + q.crr * Math.cos(t));
}
const Yo = (e, t) => S(e, -t, t);
function Xo(e, t, o, s, i) {
  const { r: n, t: r, N: a, k: l, wSet: d } = q,
    u = e / q.rMin,
    m = Mr(i),
    b = 1 - (u * r) / 2,
    p = 1 + (u * r) / 2,
    f = {
      F: m,
      kap: u,
      wL: 0,
      wR: 0,
      TL: 0,
      TR: 0,
      v: 0,
      vL: 0,
      vR: 0,
      sL: 0,
      sR: 0,
      stuck: 0,
      spin: 0,
      scrub: 0,
      capL: t * a,
      capR: o * a,
    };
  if (s) {
    const w = d,
      x = (T) =>
        Yo(l * (w * n - T * b), f.capL) + Yo(l * (w * n - T * p), f.capR);
    if (((f.wL = f.wR = w), x(0) < m)) ((f.stuck = 1), (f.v = 0));
    else {
      let T = 0,
        y = w * n * 1.6;
      for (let M = 0; M < 48; M++) {
        const P = (T + y) / 2;
        x(P) > m ? (T = P) : (y = P);
      }
      f.v = (T + y) / 2;
    }
    ((f.vL = f.v * b),
      (f.vR = f.v * p),
      (f.sL = w * n - f.vL),
      (f.sR = w * n - f.vR),
      (f.TL = Yo(l * f.sL, f.capL) * n),
      (f.TR = Yo(l * f.sR, f.capR) * n));
  } else {
    const w = Math.min(f.capL, f.capR);
    m / 2 <= w
      ? ((f.v = d * n),
        (f.vL = f.v * b),
        (f.vR = f.v * p),
        (f.wL = f.vL / n),
        (f.wR = f.vR / n),
        (f.TL = f.TR = (m * n) / 2))
      : ((f.stuck = 1),
        (f.TL = f.TR = w * n),
        Math.abs(f.capL - f.capR) < 1
          ? (f.wL = f.wR = d)
          : f.capL < f.capR
            ? ((f.wL = 2 * d), (f.spin = -1))
            : ((f.wR = 2 * d), (f.spin = 1)),
        (f.sL = f.wL * n),
        (f.sR = f.wR * n));
  }
  return (
    (f.scrub = Math.abs((f.TL / n) * f.sL) + Math.abs((f.TR / n) * f.sR)),
    f
  );
}
const h = {
  steer: 1,
  steerT: 1,
  iceL: 0,
  iceR: 0,
  ice: [0, 0],
  lock: !1,
  lockOn: !1,
  lockSlide: 0,
  load: 0.715,
  loadT: 0.715,
  speedT: 0.7,
  paused: !1,
  ex: 0,
  exT: 0,
  aL: 0,
  aR: 0,
  wL: 0,
  wR: 0,
  TL: 0,
  TR: 0,
  v: 0,
  vL: 0,
  vR: 0,
  sL: 0,
  sR: 0,
  scrub: 0,
  stuck: 0,
  visL: 0,
  visR: 0,
  hand: null,
  handSide: -1,
  handW: 0,
  handT: -9,
  wob: 0,
  engine: 1,
  drop: 0,
  off: [0, 0],
  sol: null,
};
{
  const e = (h.sol = Xo(h.steer, q.muDry, q.muDry, !1, h.load));
  for (const t of [
    "wL",
    "wR",
    "TL",
    "TR",
    "v",
    "vL",
    "vR",
    "sL",
    "sR",
    "scrub",
  ])
    h[t] = e[t];
}
const Es = (e) => 0.02 * Math.pow(10, e),
  _s = () => (h.paused ? 0 : Es(h.speedT));
let xt = 0.016,
  Fs = 0.016,
  $ = 0,
  zn = !1,
  On = !1,
  Ko = !1;
const po = (e) => $e(q.muDry, q.muIce, e),
  $n = (e) => ((e = (e + Math.PI) % N), (e < 0 ? e + N : e) - Math.PI),
  Sr = ["TL", "TR", "v", "vL", "vR", "sL", "sR", "scrub", "stuck"];
function Tr(e) {
  const t = _s(),
    o = e * t;
  ((h.steer += (h.steerT - h.steer) * (1 - Math.exp(-e * (zn ? 14 : 3.2)))),
    (h.load += (h.loadT - h.load) * (1 - Math.exp(-e * (On ? 14 : 4)))));
  for (let p = 0; p < 2; p++) {
    const f = p ? h.iceR : h.iceL;
    h.ice[p] += (f - h.ice[p]) * (1 - Math.exp(-e * 4));
  }
  h.ex += (h.exT - h.ex) * (1 - Math.exp(-e * 2.6));
  const s = $n(((h.aR - h.aL) / 2) * 6) / 6;
  if (h.lock && !h.lockOn) {
    const p =
      h.relPrev != null &&
      Math.sign(s) !== Math.sign(h.relPrev) &&
      Math.abs(s - h.relPrev) < 0.3;
    if (Math.abs(s) < 0.02 || p)
      ((h.aR -= s), (h.aL += s), (h.lockOn = !0), Pt.clunk(!0));
    else if (!h.hand && Math.abs(h.visR - h.visL) < 0.05) {
      const f = S(-s, -e * 1.5, e * 1.5);
      ((h.aR += f), (h.aL -= f));
    }
  }
  ((h.relPrev = $n(((h.aR - h.aL) / 2) * 6) / 6),
    !h.lock && h.lockSlide < 0.05 && (h.lockOn = !1),
    (h.lockSlide +=
      ((h.lock && h.lockOn ? 1 : 0) - h.lockSlide) * (1 - Math.exp(-e * 9))));
  const i = h.lockOn,
    n = !!h.hand,
    r = n || $ < h.handT;
  ((h.drop += ((r ? 1 : 0) - h.drop) * (1 - Math.exp(-e * (r ? 9 : 4)))),
    (h.engine +=
      ((r ? 0 : 1) - h.engine) * (1 - Math.exp(-e * (r ? 10 : 2.4)))));
  const a = (h.sol = Xo(h.steer, po(h.ice[0]), po(h.ice[1]), i, h.load)),
    l = h.engine,
    d = 1 - Math.exp(-(t > 0 ? Math.max(o / 0.32, e / 0.9) : e / 0.3));
  for (const p of Sr) h[p] += (a[p] * (p === "stuck" ? 1 : l) - h[p]) * d;
  if (((h.wL += (a.wL - h.wL) * d), (h.wR += (a.wR - h.wR) * d), i)) {
    const p = (h.wL + h.wR) / 2;
    h.wL = h.wR = p;
  }
  n || (h.handW *= Math.exp(-e * 1.3));
  const u = h.lockOn ? 0 : h.handW,
    m = h.handSide < 0 ? u : -u,
    b = -m;
  ((h.visL = $e(m, h.wL * t, l)),
    (h.visR = $e(b, h.wR * t, l)),
    n || ((h.aL += h.visL * e), (h.aR += h.visR * e)),
    (h.wob *= Math.exp(-e * 9)));
  for (let p = 0; p < 2; p++) {
    const f = (p ? h.vR : h.vL) * l;
    h.off[p] += ((f / q.r) * Ut * o) / 1.81;
  }
}
function Ds(e, t) {
  const o = h.hand;
  if (o) {
    if (h.lockOn) {
      ((h.wob = S(h.wob + e, -0.06, 0.06)), (h.handW = 0));
      return;
    }
    (o.s < 0 ? ((h.aL += e), (h.aR -= e)) : ((h.aR += e), (h.aL -= e)),
      (h.handW += (e / Math.max(t, 1 / 240) - h.handW) * 0.4));
  }
}
function mo() {
  const e = h.engine,
    t = h.lockOn ? 0 : h.handW,
    o = h.handSide < 0 ? t : -t,
    s = $e(o, h.wL, e),
    i = $e(-o, h.wR, e),
    { TL: n, TR: r } = h,
    a = n + r,
    l = h.sol;
  return {
    rpmL: uo(s),
    rpmR: uo(i),
    rpmC: uo((s + i) / 2),
    rpmP: uo((s + i) / 2) * q.i,
    spider: uo((i - s) / 2) * 1.6,
    Tin: a / q.i,
    T: a,
    TL: n,
    TR: r,
    shL: a > 5 ? (n / a) * 100 : 50,
    shR: a > 5 ? (r / a) * 100 : 50,
    kmh: h.v * 3.6,
    F: l.F,
    pull: a / q.r,
    grade: Is(h.load) * 100,
    R: Math.abs(h.steer) > 0.02 ? q.rMin / Math.abs(h.steer) : 1 / 0,
    left: h.steer >= 0,
    slipL: h.sL,
    slipR: h.sR,
    scrub: h.scrub,
    stuck: h.stuck > 0.5,
    e,
    locked: h.lockOn,
    air: h.engine < 0.5,
  };
}
const Yt = new c.Group();
(Co.add(Yt), (Yt.visible = !1));
{
  const e = [];
  for (let a = 60; a > -10; a -= 2) e.push([a, 0]);
  for (let a = 0; a <= 16; a++) {
    const l = ((a / 16) * Math.PI) / 2;
    e.push([-10 - Math.sin(l) * 14, 14 - Math.cos(l) * 14]);
  }
  for (let a = 16; a <= 90; a += 6) e.push([-24, a]);
  const t = [],
    o = [],
    s = [],
    i = 110;
  e.forEach(([a, l], d) => {
    const [u, m] = e[Math.min(d + 1, e.length - 1)],
      [b, p] = e[Math.max(d - 1, 0)],
      f = u - b,
      w = m - p,
      x = Math.hypot(f, w) || 1;
    for (const T of [-i, i]) (t.push(T, l - 0.02, a), o.push(0, -f / x, w / x));
  });
  for (let a = 0; a < e.length - 1; a++) {
    const l = a * 2;
    s.push(l, l + 1, l + 2, l + 1, l + 3, l + 2);
  }
  const n = new c.BufferGeometry();
  (n.setAttribute("position", new c.Float32BufferAttribute(t, 3)),
    n.setAttribute("normal", new c.Float32BufferAttribute(o, 3)),
    n.setIndex(s));
  const r = new c.Mesh(
    n,
    z("#eeeae4", { roughness: 0.92, envMapIntensity: 0.4 }),
  );
  ((r.receiveShadow = !0), Yt.add(r), sr(Yt, 0, 0, 0, 14, 6.4, 0.34));
}
const Bn = [];
for (const e of [-1, 1]) {
  const t = new c.Group();
  (t.position.set(e * de, le, 2.95), (t.rotation.x = -0.12), Yt.add(t));
  const o = D();
  (o.box(z("#dcdad6", { roughness: 0.5 }), 0, 0.09, -0.05, 1.5, 0.18, 0.5, {
    r: 0.05,
  }),
    o.flush(t));
  const s = new c.Mesh(
    new c.BoxGeometry(1.4, 1.05, 0.06),
    new c.MeshPhysicalMaterial({
      color: "#f2fbff",
      roughness: 0.06,
      transmission: 1,
      thickness: 0.06,
      ior: 1.45,
      envMapIntensity: 1.2,
    }),
  );
  (s.position.set(0, 0.18 + 0.52, -0.05), t.add(s), zt.push(s));
  const i = st(1.24, 0.9, 384, 280, null, 1.05, {
    alphaTest: 0,
    transparent: !0,
    depthWrite: !1,
  });
  (i.position.set(0, 0.7, -0.01),
    t.add(i),
    Bn.push({ g: t, face: i, s: e, drawn: -1 }));
}
function Rr(e, t, o) {
  const s = e.s,
    i = s < 0 ? "#e08a14" : "#1597c7";
  e.face.userData.redraw((n, r, a) => {
    n.clearRect(0, 0, r, a);
    const l = 110,
      d = a / 2;
    ((n.strokeStyle = "#3a4150"),
      (n.lineWidth = 7),
      n.beginPath(),
      n.arc(l, d, 56, 0, N),
      n.stroke(),
      (n.lineWidth = 4),
      n.beginPath(),
      n.arc(l, d, 20, 0, N),
      n.stroke());
    for (let T = 0; T < 6; T++) {
      const y = o + (T / 6) * N;
      (n.beginPath(),
        n.moveTo(l + Math.cos(y) * 22, d + Math.sin(y) * 22),
        n.lineTo(l + Math.cos(y) * 52, d + Math.sin(y) * 52),
        n.stroke());
    }
    const u = t >= 0 ? -1 : 1,
      m = -Math.PI * 0.95,
      b = -Math.PI * 0.2;
    ((n.strokeStyle = i),
      (n.lineWidth = 9),
      (n.lineCap = "round"),
      n.beginPath(),
      n.arc(l, d, 82, m, b),
      n.stroke());
    const p = u < 0 ? b : m,
      f = l + Math.cos(p) * 82,
      w = d + Math.sin(p) * 82,
      x = u < 0 ? p + Math.PI / 2 : p - Math.PI / 2;
    ((n.fillStyle = i),
      n.beginPath(),
      n.moveTo(f + Math.cos(x) * 22, w + Math.sin(x) * 22),
      n.lineTo(f + Math.cos(x + 2.4) * 18, w + Math.sin(x + 2.4) * 18),
      n.lineTo(f + Math.cos(x - 2.4) * 18, w + Math.sin(x - 2.4) * 18),
      n.fill(),
      (n.fillStyle = "#262c38"),
      (n.font = "600 60px Outfit, sans-serif"),
      (n.textAlign = "left"),
      (n.textBaseline = "alphabetic"),
      n.fillText(Math.round(Math.abs(t)), 212, d + 10),
      (n.fillStyle = "#6b7385"),
      (n.font = "500 26px Outfit, sans-serif"),
      n.fillText("RPM", 214, d + 48),
      n.fillText(s < 0 ? "LEFT" : "RIGHT", 214, d - 52));
  });
}
class Vn {
  constructor(t, o = 0) {
    this.max = t;
    const s = new c.BufferGeometry();
    ((this.pos = new Float32Array(t * 12)),
      (this.side = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 16)));
    const i = new Uint32Array(t * 6);
    for (let n = 0; n < t; n++) {
      const r = n * 4;
      i.set([r, r + 1, r + 2, r + 1, r + 3, r + 2], n * 6);
    }
    (s.setAttribute(
      "position",
      new c.BufferAttribute(this.pos, 3).setUsage(c.DynamicDrawUsage),
    ),
      s.setAttribute(
        "aSide",
        new c.BufferAttribute(this.side, 1).setUsage(c.DynamicDrawUsage),
      ),
      s.setAttribute(
        "aCol",
        new c.BufferAttribute(this.col, 4).setUsage(c.DynamicDrawUsage),
      ),
      s.setIndex(new c.BufferAttribute(i, 1)),
      (this.mesh = new c.Mesh(
        s,
        new c.ShaderMaterial({
          uniforms: {
            ...gs,
            uSoft: { value: 0.3 },
            uLight: { value: 0 },
            uLightK: { value: 0.7 },
            uXray: { value: o },
          },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: c.AdditiveBlending,
          side: c.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${un}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;uniform float uXray;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*mix(uXray,1.,ovVis(uSoft));
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.8,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      _o.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? c.NormalBlending : c.AdditiveBlending));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, s, i, n, r, a) {
    if (this.n >= this.max) return;
    const l = this.n++;
    (Un.subVectors(o, t),
      Wn.addVectors(t, o).multiplyScalar(0.5),
      Hn.subVectors(C.position, Wn),
      se.crossVectors(Un, Hn).normalize());
    const d = this.pos,
      u = l * 12;
    ((d[u] = t.x - se.x * s),
      (d[u + 1] = t.y - se.y * s),
      (d[u + 2] = t.z - se.z * s),
      (d[u + 3] = t.x + se.x * s),
      (d[u + 4] = t.y + se.y * s),
      (d[u + 5] = t.z + se.z * s),
      (d[u + 6] = o.x - se.x * i),
      (d[u + 7] = o.y - se.y * i),
      (d[u + 8] = o.z - se.z * i),
      (d[u + 9] = o.x + se.x * i),
      (d[u + 10] = o.y + se.y * i),
      (d[u + 11] = o.z + se.z * i),
      this.side.set([-1, 1, -1, 1], l * 4));
    const m = this.col,
      b = l * 16;
    for (let p = 0; p < 4; p++)
      ((m[b + p * 4] = n.r),
        (m[b + p * 4 + 1] = n.g),
        (m[b + p * 4 + 2] = n.b),
        (m[b + p * 4 + 3] = p < 2 ? r : a));
  }
  line(t, o, s, i) {
    for (let n = 0; n < t.length - 1; n++) {
      const r = n / (t.length - 1),
        a = (n + 1) / (t.length - 1);
      this.seg(
        t[n],
        t[n + 1],
        We(t[n], o),
        We(t[n + 1], o),
        s,
        i ? i(r) : 1,
        i ? i(a) : 1,
      );
    }
  }
  end() {
    const t = this.mesh.geometry,
      o = Math.max(this.n, 1);
    t.setDrawRange(0, this.n * 6);
    for (const [s, i] of [
      ["position", 12],
      ["aSide", 4],
      ["aCol", 16],
    ]) {
      const n = t.attributes[s];
      (n.clearUpdateRanges(), n.addUpdateRange(0, o * i), (n.needsUpdate = !0));
    }
  }
}
const Un = new c.Vector3(),
  Wn = new c.Vector3(),
  Hn = new c.Vector3(),
  se = new c.Vector3(),
  vt = new Vn(3e3, 0.3),
  it = new Vn(3e3, 0),
  We = (e, t) =>
    ((C.position.distanceTo(e) *
      Math.tan(c.MathUtils.degToRad(C.fov / 2)) *
      2) /
      Math.max(Oe.clientHeight, 1)) *
    t *
    0.5;
class qn {
  constructor(t, o) {
    ((this.n = t),
      (this.p = Array.from({ length: t }, () => ({
        x: 0,
        y: -99,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        age: 9,
        life: 1,
        s: 0.1,
        g: 0,
      }))),
      (this.i = 0));
    const s = new c.PlaneGeometry(1, 1),
      i = new c.InstancedBufferGeometry();
    ((i.index = s.index),
      (i.attributes.position = s.attributes.position),
      (i.attributes.uv = s.attributes.uv),
      (this.ofs = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 4)),
      i.setAttribute(
        "aOfs",
        new c.InstancedBufferAttribute(this.ofs, 4).setUsage(
          c.DynamicDrawUsage,
        ),
      ),
      i.setAttribute(
        "aCol",
        new c.InstancedBufferAttribute(this.col, 4).setUsage(
          c.DynamicDrawUsage,
        ),
      ),
      (i.instanceCount = t),
      (this.mesh = new c.Mesh(
        i,
        new c.ShaderMaterial({
          uniforms: { ...gs, uAdd: { value: o ? 1 : 0 } },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: o ? c.AdditiveBlending : c.NormalBlending,
          vertexShader:
            "attribute vec4 aOfs;attribute vec4 aCol;varying vec2 vUv;varying vec4 vC;void main(){vUv=uv;vC=aCol;vec4 mv=modelViewMatrix*vec4(aOfs.xyz,1.);mv.xy+=position.xy*aOfs.w;gl_Position=projectionMatrix*mv;}",
          fragmentShader: `${un}uniform float uAdd;varying vec2 vUv;varying vec4 vC;void main(){float d=length(vUv-.5)*2.;float a=smoothstep(1.,.1,d)*vC.a*ovVis(.4);if(a<.003)discard;
    gl_FragColor=uAdd>.5?vec4(vC.rgb*a,1.):vec4(vC.rgb,a);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 5),
      _o.add(this.mesh));
  }
  emit(t, o, s, i, n, r, a, l, d) {
    const u = this.p[this.i];
    ((this.i = (this.i + 1) % this.n),
      Object.assign(u, {
        x: t,
        y: o,
        z: s,
        vx: i,
        vy: n,
        vz: r,
        age: 0,
        life: a,
        s: l,
        g: d,
      }));
  }
  step(t, o, s) {
    for (let n = 0; n < this.n; n++) {
      const r = this.p[n],
        a = n * 4;
      if (((r.age += t), r.age >= r.life)) {
        ((this.ofs[a + 3] = 0), (this.col[a + 3] = 0));
        continue;
      }
      ((r.vy -= r.g * t),
        (r.vx *= Math.exp(-t * 1.2)),
        (r.vz *= Math.exp(-t * 1.2)),
        (r.vy *= Math.exp(-t * 0.6)),
        (r.x += r.vx * t),
        (r.y += r.vy * t),
        (r.z += r.vz * t),
        r.g && r.y < xe && ((r.y = xe), (r.vy *= -0.3)));
      const l = r.age / r.life;
      ((this.ofs[a] = r.x),
        (this.ofs[a + 1] = r.y),
        (this.ofs[a + 2] = r.z),
        (this.ofs[a + 3] = r.s * (1 + l * s)),
        (this.col[a] = o.r),
        (this.col[a + 1] = o.g),
        (this.col[a + 2] = o.b),
        (this.col[a + 3] =
          Math.sin(Math.PI * Math.min(1, l * 1.4 + 0.05)) *
          (1 - l) *
          (r.g ? 0.9 : 0.42)));
    }
    const i = this.mesh.geometry;
    ((i.attributes.aOfs.needsUpdate = !0),
      (i.attributes.aCol.needsUpdate = !0));
  }
}
const Yn = new qn(90, !1),
  Xn = new qn(140, !0),
  kr = new c.Color(0.74, 0.73, 0.72),
  Lr = new c.Color(1.3, 1.6, 1.9),
  Kn = [
    {
      id: "ring",
      t: "Ring gear",
      cls: "g",
      p: () => lt.set(Y - 0.24 * L, A + 0.66 * L, 0.66 * L),
      o: [-210, -120],
    },
    {
      id: "pinion",
      t: "Pinion",
      cls: "g",
      p: () => lt.set(Y + 0.24 * L, A + 0.95 * L, 0.12),
      o: [130, -110],
    },
    {
      id: "spider",
      t: "Spider gears",
      cls: "r",
      p: () => lt.set(Q, A - 0.3 * L, 0.34 * L),
      o: [70, 112],
    },
    {
      id: "axL",
      t: "Left axle shaft",
      cls: "l",
      p: () => lt.set(-2.25, A - 0.06, 0.12),
      o: [-130, 105],
    },
    {
      id: "axR",
      t: "Right axle shaft",
      cls: "r",
      p: () => lt.set(2.35, A - 0.06, 0.12),
      o: [130, 110],
    },
    {
      id: "lock",
      t: "Diff lock",
      cls: "x",
      p: () => lt.set(Q + 1 * L, A + 0.34 * L, 0.1),
      o: [160, -50],
    },
    {
      id: "ice",
      t: "Ice",
      cls: "r",
      p: () => lt.set((h.iceL > h.iceR ? -1 : 1) * de, xe, 1.5),
      o: [0, 110],
    },
  ],
  lt = new c.Vector3(),
  jo = new c.Vector3();
{
  const e = k("#callouts"),
    t = k("#leads");
  for (const o of Kn) {
    const s = document.createElement("div");
    ((s.className = "co " + o.cls),
      (s.innerHTML = `<b>${o.t}</b><span></span>`),
      e.appendChild(s),
      (o.el = s),
      (o.sub = s.querySelector("span")),
      (o.a = 0),
      (o.want = 0));
    const i = document.createElementNS("http://www.w3.org/2000/svg", "line"),
      n = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    (n.setAttribute("r", "3"), t.append(i, n), (o.ln = i), (o.dot = n));
  }
}
let yt = !0,
  jn = 0;
const He = { brand: { r: 0, b: 0 }, right: { l: 1e4, b: 0 }, at: -9 };
function Pr(e) {
  const t = Oe.clientWidth,
    o = Oe.clientHeight,
    s = t < 900;
  if ($ - He.at > 0.5) {
    He.at = $;
    const r = k(".brand").getBoundingClientRect(),
      a = k(".right").getBoundingClientRect();
    ((He.brand = { r: r.right, b: r.bottom }),
      (He.right = { l: a.left, b: a.bottom }));
  }
  const i = {
      ring: 1,
      pinion: 1,
      spider: 1,
      axL: 1,
      axR: 1,
      lock: h.lock ? 1 : 0,
      ice: (h.iceL || h.iceR) && _.cur === "desk" ? 1 : 0,
    },
    n = $ - jn > 0.12;
  n && (jn = $);
  for (const r of Kn) {
    ((r.want = yt && !s && i[r.id] && !Gs ? 1 : 0),
      (r.a += (r.want - r.a) * (1 - Math.exp(-xt * 7))));
    const a = r.a > 0.02;
    if (
      ((r.el.style.opacity = r.a.toFixed(3)),
      (r.ln.style.opacity = r.dot.style.opacity = (r.a * 0.9).toFixed(3)),
      !a)
    ) {
      ((r.el.style.visibility = "hidden"),
        r.ln.setAttribute("x1", -99),
        r.ln.setAttribute("x2", -99),
        r.dot.setAttribute("cx", -99));
      continue;
    }
    ((r.el.style.visibility = "visible"), r.p(), jo.copy(lt).project(C));
    const l = (jo.x * 0.5 + 0.5) * t,
      d = (-jo.y * 0.5 + 0.5) * o;
    if (jo.z > 1 || l < 20 || l > t - 20 || d < 20 || d > o - 20) {
      ((r.el.style.visibility = "hidden"),
        r.ln.setAttribute("x1", -99),
        r.ln.setAttribute("x2", -99),
        r.dot.setAttribute("cx", -99));
      continue;
    }
    n && (r.sub.innerHTML = Cr(r.id, e));
    const u = r.el.offsetWidth,
      m = r.el.offsetHeight,
      b = S(Math.min(t / 1440, o / 900), 0.7, 1.15);
    let p = S(l + r.o[0] * b - u / 2, 12, t - u - 12),
      f = S(d + r.o[1] * b - m / 2, 12, o - m - 12);
    (p < He.brand.r + 8 && f < He.brand.b + 8 && (f = He.brand.b + 10),
      p + u > He.right.l - 8 && f < He.right.b && (p = He.right.l - u - 10),
      (r.el.style.transform = `translate(${p.toFixed(1)}px,${f.toFixed(1)}px)`));
    const w = S(l, p, p + u),
      x = S(d, f, f + m),
      T = w === l && x === d ? p : w;
    (r.ln.setAttribute("x1", l.toFixed(1)),
      r.ln.setAttribute("y1", d.toFixed(1)),
      r.ln.setAttribute("x2", T.toFixed(1)),
      r.ln.setAttribute("y2", x.toFixed(1)),
      r.dot.setAttribute("cx", l.toFixed(1)),
      r.dot.setAttribute("cy", d.toFixed(1)));
  }
}
const O = (e) => Math.round(e).toLocaleString("en-US");
function Cr(e, t) {
  switch (e) {
    case "ring":
      return t.air
        ? "held still by the engine"
        : `turns with the carrier \xB7 <em>${O(t.rpmC)} rpm</em>`;
    case "pinion":
      return t.air
        ? "the engine has let go"
        : `drives the ring gear \xB7 <em>${O(t.rpmP)} rpm \xB7 ${O(t.Tin)} N\xB7m</em>`;
    case "spider":
      return t.locked
        ? "locked: they cannot turn"
        : Math.abs(t.spider) < 1
          ? "not turning: they carry both sides"
          : `spinning on their pin \xB7 <em>${O(Math.abs(t.spider))} rpm</em>`;
    case "axL":
      return `to the left wheel \xB7 <em>${O(t.rpmL)} rpm \xB7 ${O(t.TL)} N\xB7m</em>`;
    case "axR":
      return `to the right wheel \xB7 <em>${O(t.rpmR)} rpm \xB7 ${O(t.TR)} N\xB7m</em>`;
    case "lock":
      return t.locked ? "both wheels turn as one" : "engaging\u2026";
    case "ice":
      return `grip ${po(Math.max(h.ice[0], h.ice[1])).toFixed(1)} \xB7 the wheel on it can push ${O(Math.min(h.sol.capL, h.sol.capR))} N`;
  }
  return "";
}
let Gs = !1;
const Nn = { room: ie, studioSet: Yt },
  No = {
    desk: {
      bg: "#c9b39a",
      fog: "#d6b48f",
      fogD: 0.0042,
      tone: c.ACESFilmicToneMapping,
      exp: 1.14,
      env: "study",
      envI: 0.9,
      bloomT: 1.65,
      bloomS: 0.45,
      hemi: [16771279, 6967360, 0.74],
      sun: [16758630, 3.5],
      sunDir: [0.62, 0.42, -0.66],
      rim: 0.5,
      key2: 1,
      satK: 1.1,
      show: { room: 1, studioSet: 0 },
      pale: 0,
      light: 0,
      veil: "#1a1d24",
    },
    studio: {
      bg: "#eeeae4",
      fog: "#eeeae4",
      fogD: 0.0035,
      tone: c.NeutralToneMapping,
      exp: 1,
      env: "studio",
      envI: 1,
      bloomT: 2.6,
      bloomS: 0.16,
      hemi: [16774890, 14471876, 0.9],
      sun: [16774114, 2.6],
      sunDir: [-0.4, 0.85, 0.4],
      rim: 0.3,
      key2: 0.5,
      satK: 0.95,
      show: { room: 0, studioSet: 1 },
      pale: 1,
      light: 1,
      veil: "#eeeae4",
    },
  },
  _ = { cur: "desk", next: null, at: -99, out: -99, cam: null };
function zs() {
  const e = No[_.cur];
  (J.background.set(e.bg),
    J.fog.color.set(e.fog),
    (J.fog.density = e.fogD * g.fog),
    (W.toneMapping = e.tone),
    (W.toneMappingExposure = g.exposure * e.exp),
    (J.environment = Io[e.env]),
    (J.environmentIntensity = g.env * e.envI),
    (Ke.threshold = g.bloomThreshold * e.bloomT),
    (Ke.strength = g.bloomStrength * e.bloomS),
    Po.color.set(e.hemi[0]),
    Po.groundColor.set(e.hemi[1]),
    (Po.intensity = e.hemi[2] * g.fill),
    te.color.set(e.sun[0]),
    (te.intensity = e.sun[1] * g.sun),
    te.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(40),
    (ms.intensity = e.rim * g.rim),
    (bs.intensity = e.key2 * g.fill),
    (ln.value = g.sat * e.satK));
  for (const t in Nn) Nn[t].visible = !!e.show[t];
  for (const t of Zn) t.m.material = e.pale ? t.pale : t.dark;
  (vt.setLight(e.light),
    it.setLight(e.light),
    ps.classList.toggle("light", !!e.light),
    js.forEach((t) =>
      t.classList.toggle("on", t.dataset.v === (_.next || _.cur)),
    ));
}
function bo(e, t = !1, o = null) {
  if (No[e]) {
    if (t) {
      ((_.cur = e), (_.next = null), zs(), jt(o || dt[e]));
      return;
    }
    if (e === _.cur && !_.next) {
      o && jt(o);
      return;
    }
    ((_.next = e),
      (_.at = $),
      (_.cam = o),
      (k("#veil").style.background = No[e].veil),
      js.forEach((s) => s.classList.toggle("on", s.dataset.v === e)));
  }
}
function Ar() {
  const e = k("#veil");
  let t = 0;
  if (_.next) {
    const o = $ - _.at;
    ((t = S(o / 0.2, 0, 1)),
      o >= 0.2 &&
        ((_.cur = _.next),
        (_.next = null),
        zs(),
        jt(_.cam || dt[_.cur]),
        (_.cam = null),
        (_.out = $),
        (t = 1)));
  } else t = 1 - S(($ - _.out) / 0.4, 0, 1);
  e.style.opacity = t.toFixed(3);
}
const Zn = [];
Ee.traverse((e) => {
  e.isMesh &&
    (e.material === gt || e.material === Wt) &&
    Zn.push({ m: e, dark: e.material, pale: e.material === gt ? ur : pr });
});
const Ir = Gt(-2.3, A + 0.3, 0.9, "#ffa640", 2.6, 0),
  Er = Gt(2.4, A + 0.3, 0.9, "#5fd6ff", 2.6, 0),
  _r = Gt(Y - 0.3 * L, A + 1.2 * L, 0.6 * L, "#ffc76a", 2.2, 0),
  Fr = Gt(-2.95, 0.55, 2.6, "#6fe0ff", 1.4, 0.35),
  Dr = Gt(Q + 1.1 * L, A + 0.4 * L, 0.5 * L, "#ff9a5a", 1.6, 0),
  Gr = Gt(Y, oe - 0.4, 0.9, "#ffb454", 2.2, 0.5);
let Jn = 0;
function zr(e) {
  const t = (h.aL + h.aR) / 2;
  ((ue.rotation.x = -t),
    (re.L.g.rotation.x = -h.aL),
    (re.R.g.rotation.x = -h.aR),
    h.hand && Math.abs(h.wob) > 1e-4
      ? (re[h.hand.s < 0 ? "L" : "R"].wheel.rotation.x = -h.wob * 3)
      : ((re.L.wheel.rotation.x = 0), (re.R.wheel.rotation.x = 0)));
  const o = Fn + (h.aR - t) * 1.6;
  for (const a of co) a.m.rotation.y = o;
  ((rt.rotation.y = -t * q.i),
    (ho.position.x = -0.12 * h.lockSlide),
    Wo.material.color
      .setRGB(1, 0.5, 0.25)
      .multiplyScalar(0.35 + 1.5 * h.lockSlide),
    (Dr.i = 1.3 * h.lockSlide));
  {
    const a = an(0, 0.45, h.ex),
      l = an(0.3, 1, h.ex);
    (Ze.front.position.set(0, l * 2.9, a * 1.05 + l * 0.35),
      (Ze.front.rotation.x = -l * 0.22),
      Ze.back.position.set(0, l * 0.2, -a * 1.7));
  }
  Uo.forEach((a, l) => {
    ((a.u.uOff.value = h.off[l] % 64),
      (a.u.uIce.value = h.ice[l]),
      (a.g.position.y = -h.drop * 0.16));
  });
  const s = S(Math.abs(e.rpmL) / 150, 0, 1.4),
    i = S(Math.abs(e.rpmR) / 150, 0, 1.4);
  (re.L.glow.material.color.setRGB(1, 0.62, 0.2).multiplyScalar(0.5 + 1.9 * s),
    re.R.glow.material.color
      .setRGB(0.35, 0.85, 1)
      .multiplyScalar(0.5 + 1.9 * i));
  const n = S(Math.abs(e.TL) / 400, 0, 2),
    r = S(Math.abs(e.TR) / 400, 0, 2);
  for (const [a, l, d] of [
    [re.L, n, e.TL < -5],
    [re.R, r, e.TR < -5],
  ]) {
    const u = d ? [1, 0.35, 0.45] : a.s < 0 ? [1, 0.62, 0.2] : [0.35, 0.85, 1];
    for (const m of [a.stripe, a.stripe2])
      m.material.color
        .setRGB(...u)
        .multiplyScalar(0.45 + 1.1 * Math.min(l, 1.3));
  }
  ((Ir.i = 0.9 * Math.min(n, 1.5)),
    (Er.i = 0.9 * Math.min(r, 1.5)),
    (_r.i = 0.7 * S(Math.abs(e.Tin) / 220, 0, 1.4)),
    at.motorRing.material.color
      .setRGB(1, 0.7, 0.33)
      .multiplyScalar(
        0.5 + 2.4 * h.engine * S(Math.abs(e.Tin) / 200, 0.25, 1.5),
      ),
    (Gr.i = 0.5 * h.engine),
    me.slider.set(h.speedT),
    me.pause.draw(h.paused),
    (Fr.i = h.paused ? 0.15 : 0.35),
    _.cur === "studio" &&
      $ - Jn > 1 / 15 &&
      ((Jn = $),
      Bn.forEach((a) =>
        Rr(a, a.s < 0 ? e.rpmL : e.rpmR, -(a.s < 0 ? h.aL : h.aR)),
      )));
}
const Os = new c.Color(1.75, 1.2, 0.45),
  $s = new c.Color(1.8, 0.95, 0.22),
  Bs = new c.Color(0.32, 1.25, 1.8),
  Or = new c.Color(1.8, 0.36, 0.46),
  $r = new c.Color(0.8, 1.5, 1.9),
  Mi = new c.Color(),
  qe = new c.Vector3(),
  Qn = new c.Vector3(),
  ea = new c.Vector3(),
  ee = new c.Vector3(),
  Je = [],
  ta = Array.from({ length: 400 }, () => new c.Vector3());
let oa = 0;
const j = (e, t, o) => ta[oa++ % ta.length].set(e, t, o);
function Vs(e, t, o, s, i, n, r = !1) {
  if (s < 0.01) return;
  let a = 0;
  const l = [0];
  for (let p = 1; p < e.length; p++)
    ((a += e[p].distanceTo(e[p - 1])), l.push(a));
  vt.line(e, t * 0.55, o, () => s * 0.34);
  const d = (p, f) => {
      p = S(p, 0, a);
      let w = 1;
      for (; w < l.length - 1 && l[w] < p;) w++;
      const x = (p - l[w - 1]) / Math.max(l[w] - l[w - 1], 1e-6);
      return f.lerpVectors(e[w - 1], e[w], x);
    },
    u = r ? 0.62 : 0.55,
    m = r ? 0.001 : 0.26;
  let b = (((n * i) % u) + u) % u;
  for (let p = b; p < a; p += u) {
    const f = Math.min(1, p / 0.3, (a - p) / 0.3);
    if (!(f <= 0))
      if (r) {
        (d(p, qe),
          d(p + i * 0.05, Qn),
          ee.subVectors(Qn, qe).normalize(),
          ea.subVectors(C.position, qe).normalize(),
          se.crossVectors(ee, ea).normalize());
        const w = We(qe, t * 3 + 9),
          x = j(
            qe.x + ee.x * w * 0.5,
            qe.y + ee.y * w * 0.5,
            qe.z + ee.z * w * 0.5,
          );
        for (const T of [1, -1]) {
          const y = j(
            qe.x - ee.x * w * 0.5 + se.x * w * 0.75 * T,
            qe.y - ee.y * w * 0.5 + se.y * w * 0.75 * T,
            qe.z - ee.z * w * 0.5 + se.z * w * 0.75 * T,
          );
          vt.seg(
            y,
            x,
            We(y, t * 0.85 + 2.4),
            We(x, t * 0.85 + 2.4),
            o,
            s * f * 1.25,
            s * f * 1.25,
          );
        }
      } else {
        const w = p + m * i;
        vt.seg(
          d(w, j(0, 0, 0)),
          d(p, j(0, 0, 0)),
          We(e[0], t * 0.9),
          We(e[0], t * 0.25),
          o,
          s * f * 1.4,
          s * f * 0.15,
        );
      }
  }
}
function Zo(e, t, o, s, i, n, r, a, l, d, u, m) {
  if (d < 0.01) return;
  Je.length = 0;
  const b = 22;
  for (let M = 0; M <= b; M++) {
    const P = $e(n, r, M / b);
    Je.push(
      j(
        t.x + (o.x * Math.cos(P) + s.x * Math.sin(P)) * i,
        t.y + (o.y * Math.cos(P) + s.y * Math.sin(P)) * i,
        t.z + (o.z * Math.cos(P) + s.z * Math.sin(P)) * i,
      ),
    );
  }
  e.line(
    Je,
    a,
    l,
    (M) => d * (0.35 + 0.65 * Math.min(1, u > 0 ? M * 1.6 : (1 - M) * 1.6)),
  );
  const p = ((m % 1) + 1) % 1,
    f = Math.floor((u > 0 ? p : 1 - p) * (b - 2));
  e.seg(
    Je[f],
    Je[f + 2],
    We(Je[f], a * 1.1),
    We(Je[f], a * 1.1),
    l,
    d * 0.8,
    d * 0.8,
  );
  const w = u > 0 ? b : 0,
    x = Je[w],
    T = Je[u > 0 ? b - 1 : 1];
  ee.subVectors(x, T).normalize();
  const y = We(x, a * 2.3);
  e.seg(
    j(x.x - ee.x * y * 0.2, x.y - ee.y * y * 0.2, x.z - ee.z * y * 0.2),
    j(x.x + ee.x * y * 1.2, x.y + ee.y * y * 1.2, x.z + ee.z * y * 1.2),
    y,
    0,
    l,
    d,
    d,
  );
}
const ct = new c.Vector3(),
  Mt = new c.Vector3(),
  sa = new c.Vector3(),
  ht = new c.Vector3();
let Jo = 0,
  Us = [0, 0],
  na = 0,
  aa = 0;
function Br(e, t) {
  ((oa = 0), vt.begin(), it.begin());
  const o = _s(),
    s = yt ? 1 : 0,
    i = _.cur === "studio" ? 0.8 : 1;
  Jo += e * S(o * 10, 0, 1.6) * 1.1;
  const n = Math.abs(t.Tin),
    r = 2 + 6 * S(n / 230, 0, 1.5),
    a = S(n / 60, 0, 1) * t.e * i;
  Vs(
    [j(Y, A + wt.H + 2.6, 0), j(Y, A + wt.H + 0.62, 0), j(Y, A + 1.2 * L, 0)],
    r,
    Os,
    a,
    1,
    Jo * 1.6,
    !0,
  );
  const l = [j(Y, A + 1.2 * L, 0), j(Y - 0.22 * L, A + 1 * L, 0.05)];
  for (let p = 0; p <= 8; p++) {
    const f = $e(Math.PI / 2, 0.3, p / 8);
    l.push(j(Y - 0.15 * L, A + 0.9 * L * Math.sin(f), 0.9 * L * Math.cos(f)));
  }
  (l.push(j(Q - 0.1 * L, A + 0.08 * L, 0.3 * L), j(Q, A, 0.3 * L)),
    Vs(l, r, Os, a, 1, Jo * 1.6));
  const d = j(Q, A, 0.3 * L);
  for (const [p, f] of [
    [-1, t.TL],
    [1, t.TR],
  ]) {
    const w = f < -5,
      x = w ? Or : p < 0 ? $s : Bs,
      T = 2 + 6 * S(Math.abs(f) / 420, 0, 1.6),
      y = S(Math.abs(f) / 60, 0, 1) * t.e * i,
      M = [
        d,
        j(Q + p * 0.42 * L, A, 0.3 * L),
        j(Q + p * 0.95 * L, A, 0.25),
        j(p * (de - 0.72), A, 0.25),
        j(p * (de - 0.2), A, 0.32),
      ];
    Vs(M, T, x, y, w ? -1 : 1, Jo * 1.4, !0);
  }
  vt.end();
  for (const [p, f, w] of [
    [0, -1, t.rpmL],
    [1, 1, t.rpmR],
  ]) {
    const x = S(Math.abs(w) / 35, 0, 1) * s * i;
    if (x < 0.01) continue;
    ((Us[p] += e * (f < 0 ? h.visL : h.visR) * 0.9),
      ee
        .set(C.position.x - f * de, C.position.y - A, C.position.z)
        .normalize());
    const T = ee.x > 0 ? 1 : -1;
    (ct.set(0, 0, 1),
      Mt.set(0, 1, 0),
      Math.abs(ee.x) > 0.28
        ? (ht.set(f * de + T * (kn / 2 + 0.06), A, 0),
          Zo(
            it,
            ht,
            ct,
            Mt,
            Ut - 0.32,
            -1.05,
            1,
            17,
            f < 0 ? $s : Bs,
            x * 1.15,
            w >= 0 ? 1 : -1,
            Us[p],
          ))
        : (ht.set(f * de, A, 0),
          Zo(
            it,
            ht,
            ct,
            Mt,
            Ut + 0.18,
            -0.75,
            0.85,
            15,
            f < 0 ? $s : Bs,
            x * 1.15,
            w >= 0 ? 1 : -1,
            Us[p],
          )));
  }
  const u = S(Math.abs(t.spider) / 12, 0, 1) * s * i * (1 - h.lockSlide);
  if (u > 0.01) {
    ((na += ((e * Math.abs(t.spider)) / 60) * o * 6 + e * 0.2),
      ue.updateMatrixWorld());
    for (const p of co) {
      const f = p.hold.rotation.x ? -1 : 1;
      (sa.set(0, f, 0).transformDirection(ue.matrixWorld),
        ht.set(0, f * 0.36, 0).applyMatrix4(ue.matrixWorld),
        ct.set(1, 0, 0),
        Mt.crossVectors(sa, ct).normalize(),
        Zo(
          it,
          ht,
          ct,
          Mt,
          0.43 * L,
          0.3,
          4.9,
          6,
          $r,
          u,
          t.spider >= 0 ? 1 : -1,
          na,
        ));
    }
  }
  const m = S(Math.abs(t.rpmC) / 60, 0, 1) * s * i * 0.9;
  (m > 0.01 &&
    ((aa += ((e * t.rpmC) / 60) * o * 2),
    ht.set(Y - 0.3 * L, A, 0),
    ct.set(0, 0, 1),
    Mt.set(0, 1, 0),
    Zo(
      it,
      ht,
      ct,
      Mt,
      1.18 * L,
      -0.95,
      0.55,
      8,
      Os,
      m,
      t.rpmC >= 0 ? 1 : -1,
      aa,
    )),
    it.end());
  const b = e * S(o * 7, 0.1, 1) * (h.paused ? 0 : 1);
  for (const [p, f, w] of [
    [-1, t.slipL, h.ice[0]],
    [1, t.slipR, h.ice[1]],
  ]) {
    const x = Math.abs(f) * t.e * (1 - h.drop);
    if (x < 0.25 || h.paused) continue;
    const T = p * de,
      y = S(x / 1.5, 0.2, 1.6) * b;
    if (w > 0.5)
      for (let M = 0; M < Math.floor(y * 90 + ko($ * 97 + p) * 1.2); M++)
        Xn.emit(
          T + (Math.random() - 0.5) * 0.9,
          xe + 0.06,
          0.25 + Math.random() * 0.3,
          (Math.random() - 0.5) * 0.6,
          0.9 + Math.random() * 1.4,
          1.6 + Math.random() * 2.2,
          0.7 + Math.random() * 0.5,
          0.035 + Math.random() * 0.05,
          5.5,
        );
    else
      for (let M = 0; M < Math.floor(y * 40 + ko($ * 89 + p) * 1.2); M++)
        Yn.emit(
          T + (Math.random() - 0.5) * 1.1,
          xe + 0.08,
          0.35 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.3,
          0.22 + Math.random() * 0.35,
          0.7 + Math.random() * 0.6,
          1.4 + Math.random() * 1.1,
          0.14 + Math.random() * 0.12,
          0,
        );
  }
  (Yn.step(b, kr, 3.2), Xn.step(b, Lr, 0.2), Pr(t));
}
const dt = {
    desk: {
      t: [1.25, 2.7, 0.4],
      yaw: 0.25,
      pitch: 0.3,
      dist: 17,
      f: [0.2, 2.8, 0.3],
      r: 4.8,
      fit: [15.4, 8.7],
    },
    studio: {
      t: [0.6, 2.2, 0.3],
      yaw: -0.55,
      pitch: 0.4,
      dist: 21,
      f: [0, 2.3, 0],
      r: 5,
      fit: [16.5, 8.6],
    },
  },
  ra = { t: [0, 2.9, 0], yaw: 0.08, pitch: 0.3, dist: 25 },
  E = { t: new c.Vector3(0, 3, 0), yaw: 0, pitch: 0.2, dist: 15 };
let Qo = 4,
  Fe = 1,
  es = 1,
  Xt = !1,
  Le = !1,
  Ws = [14.4, 6.8],
  ia = 14.6;
const ve = W.domElement,
  Qe = new Map();
let ts = 0,
  Kt = null,
  Ye = null,
  Hs = null;
const wo = new c.Raycaster(),
  os = new c.Vector2();
function jt(e) {
  const t = Xt && C.aspect < 0.8 && e === dt[_.cur] ? { ...e, ...ra } : e;
  (E.t.set(...t.t),
    (E.yaw = t.yaw),
    (E.pitch = t.pitch),
    (E.dist = t.dist),
    eo.set(...t.f),
    (Qo = t.r),
    t.fit && ((Ws = t.fit), (ia = t.dist)),
    (Fe = 1),
    (Le = !1),
    Ta());
}
const la = [],
  ye = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), la.push(e));
  };
for (const e of [re.L, re.R])
  e.wheel.traverse((t) => {
    t.isMesh && t !== e.glow && ye(t, "tyre", { s: e.s });
  });
Uo.forEach((e, t) =>
  e.g.traverse((o) => {
    o.isMesh && ye(o, "belt", { i: t });
  }),
);
{
  const e = new c.Mesh(
    new c.CylinderGeometry(0.5 * L, 0.5 * L, 0.5 * L, 16).rotateZ(Math.PI / 2),
    new c.MeshBasicMaterial({ visible: !1 }),
  );
  (e.position.set(0.92 * L, 0, 0), re.R.g.add(e), ye(e, "lock"));
}
([ue, rt].forEach((e) =>
  e.traverse((t) => {
    t.isMesh && ye(t, "gear");
  }),
),
  re.L.side.traverse((e) => {
    e.isMesh && ye(e, "gear");
  }),
  re.R.side.traverse((e) => {
    e.isMesh && ye(e, "gear");
  }),
  fo.traverse((e) => {
    e.isMesh && ye(e, "motor");
  }),
  me.pause.g.traverse((e) => {
    e.isMesh && ye(e, "pause");
  }),
  me.reset.g.traverse((e) => {
    e.isMesh && ye(e, "reset");
  }),
  ye(me.reset.label, "reset"),
  ye(me.slider.hit, "slider"),
  me.slider.knob.traverse((e) => {
    e.isMesh && ye(e, "slider");
  }),
  As.forEach((e) => ye(e.hit, "link", { L: e })));
const Vr = (e) => {
  let t = e;
  for (; t.parent; t = t.parent) if (!t.visible) return !1;
  return t === J && t.visible;
};
function ca(e) {
  const t = ve.getBoundingClientRect();
  (os.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    wo.setFromCamera(os, C));
  const o = wo.intersectObjects(
    la.filter((n) => Vr(n)),
    !1,
  );
  if (!o.length) return null;
  const s = o.find((n) => n.object.userData.hk.kind === "lock"),
    i = s && s.distance - o[0].distance < 1.2 ? s : o[0];
  return { ...i.object.userData.hk, point: i.point, dist: i.distance };
}
function Ur(e) {
  if (e)
    switch (e.kind) {
      case "belt":
        wa(e.i, !(e.i ? h.iceR : h.iceL));
        break;
      case "lock":
        Rt(!h.lock);
        break;
      case "gear":
        kt(h.exT < 0.5);
        break;
      case "pause":
        Qt(!h.paused);
        break;
      case "reset":
        Nr();
        break;
      case "motor":
        ft("The engine holds the ring gear at 150 rpm");
        break;
      case "link":
        window.open(Ga, "_blank", "noopener");
        break;
    }
}
const ha = {
  tyre: () =>
    h.lockOn
      ? "Locked: the wheels cannot turn against each other"
      : "Drag to turn this wheel by hand",
  belt: (e) =>
    (e.i ? h.iceR : h.iceL) ? "Back to dry road" : "Put this wheel on ice",
  lock: () => (h.lock ? "Unlock the differential" : "Lock the differential"),
  gear: () => (h.exT > 0.5 ? "Close the housing" : "Open the housing"),
  pause: () => (h.paused ? "Play" : "Pause"),
  reset: () => "Start again",
  slider: () => "Drag: slow motion \u2026 faster",
  motor: () => "The engine",
  link: () => "@RYANSAEL on X",
};
function qs(e, t) {
  const o =
      (C.position.distanceTo(E.t) *
        2 *
        Math.tan(c.MathUtils.degToRad(C.fov / 2))) /
      Math.max(Oe.clientHeight, 1),
    s = Math.cos(E.yaw),
    i = Math.sin(E.yaw);
  ((Le = !0),
    (E.t.x = S(E.t.x - s * e * o, -14, 16)),
    (E.t.z = S(E.t.z + i * e * o, -9, 10)),
    (E.t.y = S(E.t.y + t * o, 0.4, 12)));
}
const St = k("#tip");
let go = null;
function Wr(e) {
  const t = ca(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== go && (go?.over(!1), o?.over(!0), (go = o)),
    (ve.style.cursor = t
      ? t.kind === "slider"
        ? "ew-resize"
        : t.kind === "tyre"
          ? h.lockOn
            ? "not-allowed"
            : "ns-resize"
          : "pointer"
      : ""));
  const s = t && ha[t.kind] ? ha[t.kind](t) : "";
  s
    ? ((St.textContent = s),
      (St.style.left = e.clientX + "px"),
      (St.style.top = e.clientY + "px"),
      St.classList.add("on"))
    : St.classList.remove("on");
}
(ve.addEventListener("contextmenu", (e) => e.preventDefault()),
  ve.addEventListener("pointerleave", () => {
    (go?.over(!1),
      (go = null),
      St.classList.remove("on"),
      (ve.style.cursor = ""));
  }));
const Hr = (e) =>
  (C.position.distanceTo(e) * 2 * Math.tan(c.MathUtils.degToRad(C.fov / 2))) /
  Math.max(Oe.clientHeight, 1);
(ve.addEventListener("pointerdown", (e) => {
  ne();
  try {
    ve.setPointerCapture(e.pointerId);
  } catch {}
  (St.classList.remove("on"),
    Qe.set(e.pointerId, [
      e.clientX,
      e.clientY,
      e.button === 2 || e.shiftKey,
      performance.now(),
    ]),
    (Kt = null));
  const t = e.button === 0 && !e.shiftKey && Qe.size === 1 ? ca(e) : null;
  if (
    ((Hs = t),
    (Ye =
      e.button === 0 && !e.shiftKey
        ? [e.clientX, e.clientY, performance.now()]
        : null),
    t?.kind === "slider")
  ) {
    Ko = !0;
    const o = me.slider.fromRay(wo);
    o != null && Lt(o);
  }
  t?.kind === "tyre" &&
    ((h.hand = { s: t.s, k: Hr(t.point) / Ut }),
    (h.handSide = t.s),
    (h.handW = 0),
    (ve.style.cursor = h.lockOn ? "not-allowed" : "grabbing"));
}),
  ve.addEventListener("pointermove", (e) => {
    const t = Qe.get(e.pointerId);
    if (!t) {
      Wr(e);
      return;
    }
    const o = e.clientX - t[0],
      s = e.clientY - t[1],
      i = performance.now(),
      n = (i - t[3]) / 1e3;
    if (((t[0] = e.clientX), (t[1] = e.clientY), (t[3] = i), Ko)) {
      const r = ve.getBoundingClientRect();
      (os.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -(((e.clientY - r.top) / r.height) * 2 - 1),
      ),
        wo.setFromCamera(os, C));
      const a = me.slider.fromRay(wo);
      a != null && Lt(a);
      return;
    }
    if (h.hand) {
      Ds(-s * h.hand.k, n);
      return;
    }
    if (
      (Ye &&
        Math.hypot(e.clientX - Ye[0], e.clientY - Ye[1]) > 6 &&
        (Ye = null),
      !Ye)
    ) {
      if (((Le = !0), Qe.size === 2)) {
        const [r, a] = [...Qe.values()],
          l = Math.hypot(r[0] - a[0], r[1] - a[1]),
          d = [(r[0] + a[0]) / 2, (r[1] + a[1]) / 2];
        (ts && (Fe = S((Fe * ts) / l, 0.3, 2.2)),
          (ts = l),
          Kt && qs(d[0] - Kt[0], d[1] - Kt[1]),
          (Kt = d));
        return;
      }
      t[2]
        ? qs(o, s)
        : ((E.yaw -= o * 0.004),
          (E.pitch = S(E.pitch + s * 0.003, -0.05, 1.35)));
    }
  }));
const da = (e) => {
  (h.hand
    ? ((h.hand = null), (h.handT = $ + 1.1))
    : Ye && Qe.size === 1 && performance.now() - Ye[2] < 450 && !Ko && Ur(Hs),
    (Ye = null),
    (Hs = null),
    (Ko = !1),
    Qe.delete(e.pointerId),
    (ts = 0),
    (Kt = null));
};
(ve.addEventListener("pointerup", da),
  ve.addEventListener("pointercancel", (e) => {
    ((Ye = null), da(e));
  }),
  ve.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        ne(),
        (Le = !0),
        (Fe = S(
          Fe * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.3,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const Nt = new Set();
(addEventListener("keyup", (e) => Nt.delete(e.key.toLowerCase())),
  addEventListener("blur", () => Nt.clear()));
const qr = new c.Vector3();
function Yr() {
  if (!Nt.size) return;
  const e = (Nt.has("shift") ? 2.4 : 1) * xt,
    t = (...i) => i.some((n) => Nt.has(n));
  let o = 0,
    s = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (s += 1),
    t("s", "arrowdown") && (s -= 1),
    (o || s) &&
      (qs(o * e * 420, 0),
      E.t.addScaledVector(
        qr.set(-Math.sin(E.yaw), 0, -Math.cos(E.yaw)),
        s * e * 5,
      )),
    t("q") && (E.yaw += e * 1.1),
    t("e") && (E.yaw -= e * 1.1),
    t("=", "+") && (Fe = S(Fe * Math.exp(-e * 1.3), 0.3, 2.2)),
    t("-", "_") && (Fe = S(Fe * Math.exp(e * 1.3), 0.3, 2.2)),
    t(
      "q",
      "e",
      "=",
      "+",
      "-",
      "_",
      "w",
      "s",
      "a",
      "d",
      "arrowleft",
      "arrowright",
      "arrowup",
      "arrowdown",
    ) && (Le = !0));
}
let Tt = !0,
  Zt = -99,
  ss = -1,
  Z = null,
  xo = 0;
const U = {
    turn: () => ut("turn"),
    straight: () => ut("straight"),
    ice: () => ut("ice"),
    right: () => as(-1),
    left: () => as(1),
    lock: () => Rt(!0),
    open: () => Rt(!1),
    openH: () => kt(!0),
    closeH: () => kt(!1),
    slow: () => Lt(0.55),
    norm: () => Lt(0.7),
  },
  Ys = [
    {
      view: "desk",
      ...dt.desk,
      dy: 0.004,
      hold: 12,
      wide: 1,
      beats: [
        [0, U.turn],
        [0, U.open],
        [0, U.norm],
        [6.2, U.straight],
        [9.2, U.turn],
      ],
    },
    {
      view: "desk",
      t: [Q + 0.35, A + 0.05, 0],
      yaw: 0.62,
      pitch: 0.18,
      dist: 6.6,
      dy: 0.006,
      f: [Q + 0.1, A, 0.3],
      r: 1.7,
      hold: 9,
      close: 1,
      beats: [
        [0, U.turn],
        [4.2, U.right],
        [8.2, U.left],
      ],
    },
    {
      view: "desk",
      t: [1.9, 2.1, 0.3],
      yaw: 0.5,
      pitch: 0.24,
      dist: 11.5,
      dy: -0.004,
      f: [2.2, 2, 0.5],
      r: 3.2,
      hold: 12,
      beats: [
        [0, U.ice],
        [0, U.open],
        [6.2, U.lock],
        [11.4, U.open],
      ],
    },
    {
      view: "desk",
      t: [de - 0.2, 1.65, 0.9],
      yaw: 0.34,
      pitch: 0.2,
      dist: 6.4,
      dy: 0.005,
      f: [de, 1.5, 0.8],
      r: 1.6,
      hold: 6.5,
      close: 1,
      beats: [
        [0, U.ice],
        [0, U.open],
      ],
    },
    {
      view: "desk",
      t: [-2.9, 1.9, 0.7],
      yaw: -0.32,
      pitch: 0.17,
      dist: 8.6,
      dy: 0.004,
      f: [-de + 0.3, 1.4, 0.8],
      r: 2.2,
      hold: 10,
      beats: [
        [0, U.turn],
        [0.2, U.lock],
        [7.4, U.open],
      ],
    },
    {
      view: "desk",
      t: [0.3, 2.45, 0],
      yaw: 0.02,
      pitch: 0.32,
      dist: 12.5,
      dy: 0.003,
      f: [0, 2.5, 0.3],
      r: 3.6,
      hold: 8.5,
      hand: [0.8, 6.4, -1],
      beats: [
        [0, U.straight],
        [0, U.open],
      ],
    },
    {
      view: "studio",
      ...dt.studio,
      dy: -0.006,
      hold: 9,
      wide: 1,
      beats: [
        [0, U.turn],
        [0, U.open],
      ],
    },
    {
      view: "studio",
      t: [0.2, 2.5, 0],
      yaw: -0.28,
      pitch: 0.3,
      dist: 9.2,
      dy: 0.006,
      f: [0.2, 2.6, 0.2],
      r: 2.4,
      hold: 8.5,
      beats: [
        [0.4, U.openH],
        [6.6, U.closeH],
      ],
    },
  ];
let fa = null;
function ua(e, t) {
  (h.hand && !Qe.size && ((h.hand = null), (h.handT = $ + 0.5)),
    (ss = e),
    (Z = Ys[e]),
    (xo = 0),
    (Gs = !!Z.close));
  const o = (fa = Xt && C.aspect < 0.8 && Z.wide ? { ...Z, ...ra } : Z);
  Z.view && Z.view !== (_.next || _.cur)
    ? (bo(Z.view, !1, o), (Zt = t + 0.2))
    : (jt(o), (Zt = t));
}
function Xr(e, t) {
  (e < Zt - 1 && (Zt = e),
    (!Z || e - Zt > Z.hold) && ua((ss + 1) % Ys.length, e));
  const o = e - Zt;
  if (o < 0) return;
  for (; xo < Z.beats.length && o >= Z.beats[xo][0];) (Z.beats[xo][1](), xo++);
  if (Z.hand) {
    const [i, n, r] = Z.hand;
    if (o >= i && o < n) {
      h.hand || ((h.hand = { s: r, k: 0 }), (h.handSide = r));
      const a = (o - i) / (n - i);
      Ds(Math.sin(a * N) * 2.4 * t, t);
    } else h.hand && o >= n && ((h.hand = null), (h.handT = $ + 0.8));
  }
  if (Le) return;
  const s = fa || Z;
  ((E.yaw = s.yaw + o * Z.dy),
    (E.dist = s.dist * (1 - o * 0.006)),
    eo.set(...s.f),
    (Qo = s.r));
}
function Jt(e) {
  ((Tt = e),
    k("#cine").classList.toggle("on", e),
    k("#cine").setAttribute("aria-pressed", e),
    (Gs = !1),
    e
      ? ((Z = null), (ss = -1), (Le = !1), (Fe = 1))
      : h.hand && !Qe.size && ((h.hand = null), (h.handT = $ + 0.6)));
}
let vo = null;
const ne = () => {
  ((vo = null), Tt && Jt(!1));
};
function Xs() {
  (Jt(!1), jt(dt[_.cur]));
}
const Si = new c.Vector3(),
  Ks = new c.Vector3();
function Kr(e, t) {
  if (_.cur !== "desk") {
    t.y = Math.max(t.y, 0.35);
    return;
  }
  const o = [Ae + 0.8, 0.45, H + 0.8],
    s = [Ie - 0.8, ke - 0.8, Ue - 0.8];
  Ks.subVectors(t, e);
  let i = 1;
  for (let n = 0; n < 3; n++) {
    const r = ["x", "y", "z"][n],
      a = Ks[r];
    (e[r] + a * i > s[n] && (i = Math.min(i, (s[n] - e[r]) / a)),
      e[r] + a * i < o[n] && (i = Math.min(i, (o[n] - e[r]) / a)));
  }
  t.copy(e).addScaledVector(Ks, S(i, 0.05, 1));
}
function jr(e) {
  const t = Le ? 0 : Math.sin(e / 8) * 0.02,
    o = Tt ? Z?.wide : vo ? vo.wide : !0,
    s = E.dist * Fe * (o ? es : $e(1, es, 0.5)),
    i = E.yaw + t,
    n = Math.asin(S((0.45 - E.t.y) / Math.max(s, 0.1), -1, 1)),
    r = Math.max(E.pitch, n),
    a = Math.cos(r);
  if (
    (C.position.set(
      E.t.x + Math.sin(i) * a * s,
      E.t.y + Math.sin(r) * s,
      E.t.z + Math.cos(i) * a * s,
    ),
    Kr(E.t, C.position),
    C.lookAt(E.t),
    !Tt && !Le)
  ) {
    const m = vo || dt[_.cur];
    (eo.set(...m.f), (Qo = m.r));
  }
  const l = C.position.distanceTo(Le ? E.t : eo),
    d = Le ? Math.min(1, xt * 5) : 1,
    u = (Le ? Math.max(2.2, l * 0.28) : Qo) * g.focalBand;
  ((Re.u.focus.value += (l - Re.u.focus.value) * d),
    (Re.u.range.value += (u - Re.u.range.value) * d),
    Re.u.cocScale.value.set(g.apertureNear, g.aperture));
}
const ns = k("#ui-hint");
let pa = -9;
function ft(e) {
  ((ns.textContent = e), ns.classList.add("on"), (pa = $));
}
function ut(e) {
  (e === "straight"
    ? ((h.steerT = 0), (h.iceL = h.iceR = 0))
    : e === "turn"
      ? ((h.steerT = h.steerT < -0.02 ? -1 : 1), (h.iceL = h.iceR = 0))
      : e === "ice" && ((h.steerT = 0), (h.iceL = 0), (h.iceR = 1)),
    De(!0));
}
const ma = () =>
    h.iceL || h.iceR ? "ice" : Math.abs(h.steerT) > 0.02 ? "turn" : "straight",
  as = (e) => {
    ((h.steerT = S(e, -1, 1)), De(!0));
  },
  ba = (e) => {
    ((h.loadT = S(e, 0, 1)), De(!0));
  },
  Rt = (e) => {
    h.lock !== !!e && ((h.lock = !!e), e || Pt.clunk(!1), De(!0));
  },
  wa = (e, t) => {
    (e ? (h.iceR = t ? 1 : 0) : (h.iceL = t ? 1 : 0), De(!0));
  },
  kt = (e) => {
    ((h.exT = e ? 1 : 0),
      k("#b-open").classList.toggle("on", !!e),
      k("#b-open").setAttribute("aria-pressed", !!e));
  },
  Qt = (e) => {
    h.paused = !!e;
    const t = k("#b-play");
    ((t.innerHTML = e
      ? '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>'),
      t.setAttribute("aria-label", e ? "Play" : "Pause"),
      t.classList.toggle("on", e));
  },
  Lt = (e) => {
    ((h.speedT = S(e, 0, 1)), h.paused && Qt(!1));
  };
function Nr() {
  (ut("turn"),
    (h.steerT = 1),
    Rt(!1),
    ba(0.715),
    Lt(0.7),
    Qt(!1),
    kt(!1),
    (h.hand = null),
    Xs(),
    ft("Back to the start"));
}
const js = [...document.querySelectorAll("#seg-view button")],
  ga = [...document.querySelectorAll("#modes .mode")],
  xa = [...document.querySelectorAll("#seg-lock button")];
(ga.forEach(
  (e) =>
    (e.onclick = () => {
      (ne(), ut(e.dataset.m));
    }),
),
  xa.forEach(
    (e) =>
      (e.onclick = () => {
        (ne(), Rt(e.dataset.l === "1"));
      }),
  ),
  js.forEach(
    (e) =>
      (e.onclick = () => {
        (ne(), bo(e.dataset.v));
      }),
  ),
  document.querySelectorAll("[data-min]").forEach(
    (e) =>
      (e.onclick = () => {
        const t = k("#" + e.dataset.min);
        (t.classList.toggle("min"),
          e.setAttribute(
            "aria-label",
            t.classList.contains("min") ? "Expand" : "Collapse",
          ));
      }),
  ));
function va(e, t, o, s) {
  let i = !1;
  const n = (a) => {
    const l = e.getBoundingClientRect();
    return S((a.clientX - l.left) / l.width, 0, 1);
  };
  (e.addEventListener("pointerdown", (a) => {
    (ne(), (i = !0), s(!0), e.setPointerCapture(a.pointerId), o(n(a)));
  }),
    e.addEventListener("pointermove", (a) => {
      i && o(n(a));
    }));
  const r = () => {
    ((i = !1), s(!1));
  };
  (e.addEventListener("pointerup", r),
    e.addEventListener("pointercancel", r),
    e.addEventListener("keydown", (a) => {
      (a.key === "ArrowLeft" || a.key === "ArrowRight") &&
        (a.preventDefault(),
        a.stopPropagation(),
        ne(),
        o(t() + (a.key === "ArrowLeft" ? -0.04 : 0.04)));
    }));
}
(va(
  k("#sl-steer"),
  () => (1 - h.steerT) / 2,
  (e) => as(1 - e * 2),
  (e) => {
    zn = e;
  },
),
  va(
    k("#sl-load"),
    () => h.loadT,
    (e) => ba(e),
    (e) => {
      On = e;
    },
  ),
  (k("#b-play").onclick = () => {
    (ne(), Qt(!h.paused));
  }),
  (k("#b-open").onclick = () => {
    (ne(), kt(h.exT < 0.5));
  }),
  (k("#b-tags").onclick = () => {
    ((yt = !yt),
      k("#b-tags").classList.toggle("on", yt),
      k("#b-tags").setAttribute("aria-pressed", yt));
  }),
  (k("#cine").onclick = () => {
    Tt ? Xs() : Jt(!0);
  }),
  (k("#how").onclick = () => k("#info").showModal()),
  (k("#close").onclick = () => k("#info").close()),
  k("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  (k("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e), ft("Link copied"));
    } catch {}
  }));
let ya = 0;
const be = (e) => document.getElementById(e),
  ce = {
    l: be("m-l"),
    r: be("m-r"),
    t: be("m-t"),
    sl: be("m-sl"),
    sr: be("m-sr"),
    bl: be("b-l"),
    br: be("b-r"),
    bt: be("b-t"),
    bsl: be("b-sl"),
    bsr: be("b-sr"),
    wide: be("m-wide"),
    why: be("why"),
    vs: be("v-steer"),
    vl: be("v-load"),
  },
  et = (e) => (e / 1e3).toFixed(1) + " kN";
function Zr(e) {
  const t = `<span class="l">${O(e.rpmL)}</span>`,
    o = `<span class="r">${O(e.rpmR)}</span>`,
    s = h.iceR ? "right" : "left",
    i = h.iceR ? "left" : "right",
    n = h.paused ? "<b>Paused.</b> " : "";
  if (e.air)
    return (
      n +
      (e.locked
        ? "Wheels in the air, the engine holding the ring gear, and <b>locked</b>: the two sides are one piece, so the wheel will not turn at all."
        : `Wheels in the air, the engine holding the ring gear still: turn one wheel and the other turns <b>the opposite way</b> (${t} and ${o} rpm), because the ring gear always turns at the average of the two, and here that is <b>0</b>.`)
    );
  const r = h.iceL || h.iceR,
    a = Math.abs(h.steer) > 0.05,
    l = e.R.toFixed(1),
    d = e.left ? "left" : "right",
    u = e.left ? "right" : "left";
  return r && h.iceL && h.iceR
    ? n +
        `Both wheels on ice: together they can push only <b>${et(e.pull)}</b> of the <b>${et(e.F)}</b> the road asks for. Nothing can help that, not even the lock.`
    : r && !e.locked
      ? n +
        (e.stuck
          ? `The ${s} wheel is on ice and can push only <b>${O(h.sol.capR < h.sol.capL ? h.sol.capR : h.sol.capL)} N</b>. The torque is split 50 / 50, so the ${i} wheel gets no more than that either: the ice wheel spins at <span class="${h.iceR ? "r" : "l"}">${O(Math.max(e.rpmL, e.rpmR))} rpm</span>, twice the ring gear's speed, the other stands still, and the car goes nowhere (<b>${et(e.pull)}</b> of the <b>${et(e.F)}</b> the hill asks for).`
          : `The ${s} wheel is on ice, but the road asks for only <b>${et(e.F)}</b> and even ice can give each wheel half of that: the car keeps going. Raise the road load and watch the ice wheel break loose.`)
      : r && e.locked
        ? n +
          (e.stuck
            ? `Locked, but the road asks for <b>${et(e.F)}</b>, more than both tyres can give together: they both spin.`
            : `Locked, both wheels must turn at <b>${O(e.rpmC)} rpm</b>, so the wheel on dry road takes the torque the ice cannot: <span class="l">${O(e.TL)}</span> and <span class="r">${O(e.TR)} N\xB7m</span>. The car climbs away at <b>${e.kmh.toFixed(1)} km/h</b>.`)
        : a && !e.locked
          ? n +
            `In a <b>${l} m</b> ${e.left ? "left" : "right"} turn the ${u} wheel runs the longer arc: ${e.left ? o : t} rpm against ${e.left ? t : o}. The spider gears spin at <b>${O(Math.abs(e.spider))} rpm</b> to make the difference, the ring gear keeps the average (${O(e.rpmC)}), and each wheel still gets half the torque: <b>${O(e.TL)} N\xB7m</b>.`
          : a && e.locked
            ? n +
              `Locked in a <b>${l} m</b> turn, both wheels turn at <b>${O(e.rpmC)} rpm</b>, but the ${d} wheel has less road to cover: it scrubs at <b>${Math.abs(d === "left" ? e.slipL : e.slipR).toFixed(1)} m/s</b>, the ${u} wheel pushes back (<span class="x">${O(d === "left" ? e.TR : e.TL)} N\xB7m</span>), and <b>${(e.scrub / 1e3).toFixed(1)} kW</b> goes into heat and tyre wear.`
            : n +
              `Straight ahead both wheels cover the same ground, so they turn together at <b>${O(e.rpmC)} rpm</b>. The spider gears ride round with the carrier without turning on their pin, and each wheel gets half the torque: <b>${O(e.TL)} N\xB7m</b>${e.locked ? " (locked or not, it makes no difference here)" : ""}.`;
}
function De(e) {
  if (!e && $ - ya < 0.1) return;
  ya = $;
  const t = mo(),
    o = (b) =>
      Math.abs(b) < 0.5 ? "0" : (b < 0 ? "\u2212" : "") + O(Math.abs(b));
  ((ce.l.textContent = o(t.rpmL)),
    (ce.r.textContent = o(t.rpmR)),
    (ce.bl.style.width = S((Math.abs(t.rpmL) / 320) * 100, 0, 100) + "%"),
    (ce.br.style.width = S((Math.abs(t.rpmR) / 320) * 100, 0, 100) + "%"),
    (ce.bt.style.width = S((t.Tin / 300) * 100, 0, 100) + "%"),
    (ce.bsl.style.width = S(t.shL, 0, 100) + "%"),
    (ce.bsr.style.width = S(t.shR, 0, 100) + "%"),
    ce.bsl.parentNode.classList.toggle("x", t.shL < 0),
    ce.bsr.parentNode.classList.toggle("x", t.shR < 0),
    (ce.sl.style.color = t.shL < 0 ? "var(--coral)" : ""),
    (ce.sr.style.color = t.shR < 0 ? "var(--coral)" : ""));
  const s = t.air
    ? "<span>Ring gear <b>held</b></span><span>Wheels <b>in the air</b></span>"
    : `<span>Ring gear <b>${O(t.rpmC)} rpm</b></span><span>Spiders <b>${t.locked ? "locked" : O(Math.abs(t.spider)) + " rpm"}</b></span><span>Car <b>${t.kmh.toFixed(1)} km/h</b></span>` +
      (t.stuck
        ? `<span class="warn">Stuck: ${et(t.pull)} of ${et(t.F)}</span>`
        : t.scrub > 400
          ? `<span class="warn">Scrub ${(t.scrub / 1e3).toFixed(1)} kW</span>`
          : `<span>Pull <b>${et(t.F)}</b></span>`);
  s !== De.w && ((ce.wide.innerHTML = s), (De.w = s));
  const i = ma();
  (ga.forEach((b) => b.classList.toggle("on", b.dataset.m === i)),
    xa.forEach((b) =>
      b.classList.toggle("on", (b.dataset.l === "1") === h.lock),
    ));
  const n = h.steerT,
    r = k("#sl-steer"),
    a = r.querySelector(".kn"),
    l = r.querySelector(".fl"),
    d = (1 - n) / 2;
  ((a.style.left = d * 100 + "%"),
    (l.style.left = Math.min(d, 0.5) * 100 + "%"),
    (l.style.width = Math.abs(d - 0.5) * 100 + "%"),
    (ce.vs.textContent =
      Math.abs(n) < 0.02
        ? "straight"
        : (n > 0 ? "L " : "R ") + (q.rMin / Math.abs(n)).toFixed(1) + " m"),
    r.setAttribute("aria-valuenow", Math.round(n * 100)));
  const u = k("#sl-load");
  ((u.querySelector(".kn").style.left = h.loadT * 100 + "%"),
    (u.querySelector(".fl").style.width = h.loadT * 100 + "%"),
    (u.querySelector(".fl").style.left = "0"),
    (ce.vl.textContent = Math.round(Is(h.loadT) * 100) + " % hill"),
    u.setAttribute("aria-valuenow", Math.round(h.loadT * 100)));
  const m = Zr(t);
  m !== De.wt && ((ce.why.innerHTML = m), (De.wt = m));
}
const Pt = {
  on: !1,
  ctx: null,
  init() {
    const e = (this.ctx = new (
        window.AudioContext || window.webkitAudioContext
      )()),
      t = (this.master = e.createGain());
    ((t.gain.value = 0), t.connect(e.destination));
    const o = e.createBuffer(1, e.sampleRate * 2, e.sampleRate),
      s = o.getChannelData(0);
    for (let d = 0; d < s.length; d++) s[d] = Math.random() * 2 - 1;
    const i = () => {
        const d = e.createBufferSource();
        return ((d.buffer = o), (d.loop = !0), d.start(), d);
      },
      n = (d, u) => {
        const m = e.createOscillator();
        return ((m.type = d), (m.frequency.value = u), m.start(), m);
      };
    ((this.hum = e.createGain()), (this.hum.gain.value = 0));
    const r = e.createBiquadFilter();
    ((r.type = "lowpass"),
      (r.frequency.value = 420),
      r.connect(this.hum),
      this.hum.connect(t),
      (this.h1 = n("sawtooth", 55)),
      (this.h2 = n("sine", 110)),
      this.h1.connect(r),
      this.h2.connect(r),
      (this.whine = e.createGain()),
      (this.whine.gain.value = 0),
      (this.w1 = n("sine", 300)),
      this.w1.connect(this.whine),
      this.whine.connect(t));
    const a = e.createBiquadFilter();
    ((a.type = "bandpass"),
      (a.frequency.value = 2300),
      (a.Q.value = 6),
      (this.sq = e.createGain()),
      (this.sq.gain.value = 0),
      i().connect(a),
      a.connect(this.sq),
      this.sq.connect(t));
    const l = e.createBiquadFilter();
    ((l.type = "bandpass"),
      (l.frequency.value = 900),
      (l.Q.value = 1.2),
      (this.hs = e.createGain()),
      (this.hs.gain.value = 0),
      i().connect(l),
      l.connect(this.hs),
      this.hs.connect(t));
  },
  set(e) {
    this.on = e;
    try {
      localStorage.setItem("diff-sound", e ? "1" : "0");
    } catch {}
    (e && !this.ctx && this.init(),
      this.ctx &&
        (e && this.ctx.resume(),
        this.master.gain.setTargetAtTime(
          e ? 0.5 : 0,
          this.ctx.currentTime,
          0.1,
        )));
    const t = k("#b-snd");
    (t.classList.toggle("on", e),
      t.setAttribute("aria-pressed", e),
      k("#snd-w").setAttribute("opacity", e ? "1" : ".35"));
  },
  tick(e) {
    if (!this.on || !this.ctx) return;
    const t = this.ctx.currentTime,
      o = _s() / Es(0.7),
      s = e.e;
    (this.hum.gain.setTargetAtTime(
      0.05 + 0.12 * s * S(e.Tin / 250, 0.2, 1.4),
      t,
      0.08,
    ),
      this.h1.frequency.setTargetAtTime(38 + 22 * s * S(o, 0, 2), t, 0.1),
      this.h2.frequency.setTargetAtTime(76 + 44 * s * S(o, 0, 2), t, 0.1),
      this.w1.frequency.setTargetAtTime(
        160 + 900 * S((Math.abs(e.rpmP) / 560) * o, 0, 2),
        t,
        0.08,
      ),
      this.whine.gain.setTargetAtTime(0.018 * s * S(o, 0, 1.5), t, 0.1));
    const i = Math.max(
        h.ice[0] * Math.abs(e.slipL),
        h.ice[1] * Math.abs(e.slipR),
      ),
      n = Math.max(
        (1 - h.ice[0]) * Math.abs(e.slipL),
        (1 - h.ice[1]) * Math.abs(e.slipR),
      );
    (this.sq.gain.setTargetAtTime(
      h.paused ? 0 : 0.1 * S((n - 0.3) / 1.5, 0, 1),
      t,
      0.06,
    ),
      this.hs.gain.setTargetAtTime(
        h.paused ? 0 : 0.14 * S((i - 0.3) / 3, 0, 1),
        t,
        0.06,
      ));
  },
  clunk(e) {
    if (!this.on || !this.ctx) return;
    const t = this.ctx,
      o = t.createOscillator(),
      s = t.createGain();
    ((o.type = "triangle"),
      o.frequency.setValueAtTime(e ? 120 : 90, t.currentTime),
      o.frequency.exponentialRampToValueAtTime(40, t.currentTime + 0.18),
      s.gain.setValueAtTime(0.35, t.currentTime),
      s.gain.exponentialRampToValueAtTime(0.001, t.currentTime + 0.25),
      o.connect(s),
      s.connect(this.master),
      o.start(),
      o.stop(t.currentTime + 0.3));
  },
};
k("#b-snd").onclick = () => Pt.set(!Pt.on);
try {
  localStorage.getItem("diff-sound") === "1" &&
    (k("#b-snd").title = "Sound (M): on next time you press it");
} catch {}
const tt = [
  ["pixelRatio", "Pixel ratio", 0.6, 2, 0.05, (e) => e.toFixed(2)],
  ["msaa", "MSAA", 0, 4, 2, (e) => (e ? e + "\xD7" : "off")],
  ["smaa", "SMAA", 0, 1, 1, (e) => (e ? "on" : "off")],
  ["shadow", "Shadow map", 512, 4096, 512, (e) => e + "px"],
  ["exposure", "Exposure", 0.6, 1.8, 0.02, (e) => e.toFixed(2)],
  ["fov", "Field of view", 18, 55, 1, (e) => e + "\xB0"],
  ["sun", "Sun", 0, 3, 0.05, (e) => e.toFixed(2)],
  ["fill", "Fill light", 0, 2, 0.05, (e) => e.toFixed(2)],
  ["rim", "Bounce light", 0, 3, 0.05, (e) => e.toFixed(2)],
  ["fog", "Haze", 0, 2.5, 0.05, (e) => e.toFixed(2)],
  ["sat", "Saturation", 0.6, 1.8, 0.02, (e) => e.toFixed(2)],
  ["env", "Environment", 0, 2, 0.05, (e) => e.toFixed(2)],
  ["dof", "Depth of field", 0, 1, 1, (e) => (e ? "on" : "off")],
  ["focalBand", "focal band", 0.3, 5, 0.05, (e) => e.toFixed(2) + "\xD7", 1],
  ["aperture", "far blur", 0.05, 3, 0.05, (e) => e.toFixed(2), 1],
  ["apertureNear", "near blur", 0.05, 3, 0.05, (e) => e.toFixed(2), 1],
  ["maxCoc", "max bokeh", 3, 24, 1, (e) => e + "px", 1],
  ["bloom", "Bloom", 0, 1, 1, (e) => (e ? "on" : "off")],
  ["bloomStrength", "strength", 0, 3, 0.02, (e) => e.toFixed(2) + "\xD7", 1],
  ["bloomRadius", "radius", 0, 1.5, 0.02, (e) => e.toFixed(2), 1],
  ["bloomThreshold", "threshold", 0, 3, 0.05, (e) => e.toFixed(2) + "\xD7", 1],
  ["ao", "Ambient occlusion", 0, 1, 1, (e) => (e ? "on" : "off")],
  ["aoIntensity", "intensity", 0, 1.5, 0.02, (e) => e.toFixed(2), 1],
  ["aoRadius", "radius", 0.1, 4, 0.05, (e) => e.toFixed(2), 1],
  ["aoSamples", "samples", 2, 16, 1, (e) => e, 1],
  ["auto", "Auto quality", 0, 1, 1, (e) => (e ? "on" : "off")],
];
let Ge = 0,
  Ma = 0,
  Ns = 0,
  rs = 0,
  is = 0;
function Pe() {
  (W.setPixelRatio(g.pixelRatio),
    Te.setPixelRatio(g.pixelRatio),
    to.rt.samples !== g.msaa && ((to.rt.samples = g.msaa), to.rt.dispose()),
    (fn.enabled = !!g.smaa),
    te.shadow.mapSize.x !== g.shadow &&
      (te.shadow.mapSize.set(g.shadow, g.shadow),
      te.shadow.map?.dispose(),
      (te.shadow.map = null)),
    (Ke.enabled = !!g.bloom),
    (Ke.radius = g.bloomRadius),
    (K.enabled = !0),
    K.updateGtaoMaterial({
      radius: g.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: g.ao ? g.aoSamples : 2,
    }),
    (Re.enabled = !!g.dof),
    (Re.u.maxCoc.value = g.maxCoc),
    zs(),
    Ra());
}
function ot() {
  ((k("#tune-rows").innerHTML = tt
    .map(([e, t, o, s, , i, n], r) => {
      const a = g[e],
        l = ((a - o) / (s - o)) * 100;
      return `<div class="tr${r === Ge ? " sel" : ""}${n ? " sub" : ""}" data-i="${r}"><b>${t}</b><span class="tk"><i style="left:${S(l, 0, 100)}%"></i></span><u>${i(a)}</u></div>`;
    })
    .join("")),
    k("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((Ge = +e.dataset.i), ot());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (Ge = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const s = (i) => {
            const n = t.getBoundingClientRect(),
              [r, , a, l, d] = tt[Ge],
              u = S(
                Math.round(
                  (a + ((i.clientX - n.left) / n.width) * (l - a)) / d,
                ) * d,
                a,
                l,
              );
            u !== g[r] &&
              ((g[r] = +u.toFixed(4)), r !== "auto" && (g.auto = 0), Pe());
            const m = t.querySelector("i");
            ((m.style.left = S(((g[r] - a) / (l - a)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = tt[Ge][5](g[r])),
              (k("#tune-json").value = JSON.stringify(g)));
          };
          (s(o),
            (t.onpointermove = (i) => {
              t.hasPointerCapture(i.pointerId) && s(i);
            }),
            (t.onpointerup = () => ot()));
        };
      }),
    (k("#tune-json").value = JSON.stringify(g)));
}
function Jr(e, t) {
  const [o, , s, i, n] = tt[Ge],
    r = S(+(g[o] + e * n * (t ? 5 : 1)).toFixed(4), s, i);
  r !== g[o] && ((g[o] = r), o !== "auto" && (g.auto = 0), Pe(), ot());
}
function Sa(e) {
  const t = k("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && ot());
}
function Qr(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (Ge = (Ge + (t === "ArrowUp" ? -1 : 1) + tt.length) % tt.length),
      ot(),
      k("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (Jr(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , s, i, n] = tt[Ge];
    return i - s === n
      ? ((g[o] = g[o] ? 0 : 1), o !== "auto" && (g.auto = 0), Pe(), ot(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(g, ws) : (g[tt[Ge][0]] = ws[tt[Ge][0]]),
      (g.auto = 0),
      Pe(),
      ot(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(g, null, 1)), !0)
      : t === "Escape"
        ? (Sa(!1), !0)
        : !1;
}
(k("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in ws) typeof t[o] == "number" && (g[o] = t[o]);
    ((g.auto = 0), Pe(), ot());
  } catch {
    ot();
  }
}),
  setInterval(() => {
    k("#tune").hidden || (k("#tune-fps").textContent = Math.round(Ma) + " fps");
  }, 500),
  addEventListener("keydown", (e) => {
    if (
      (e.metaKey || e.ctrlKey) &&
      !e.altKey &&
      (e.code === "Quote" || e.key === "'")
    ) {
      (e.preventDefault(), Sa());
      return;
    }
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
      k("#info").open
    )
      return;
    if (!k("#tune").hidden && Qr(e)) {
      e.preventDefault();
      return;
    }
    const t = e.key.toLowerCase();
    if (
      [
        "w",
        "a",
        "s",
        "d",
        "q",
        "e",
        "=",
        "+",
        "-",
        "_",
        "arrowleft",
        "arrowright",
        "arrowup",
        "arrowdown",
        "shift",
      ].includes(t)
    ) {
      if (e.target.classList?.contains("slide")) return;
      (t.startsWith("arrow") && e.preventDefault(),
        t !== "shift" && ne(),
        Nt.add(t));
      return;
    }
    if (t === "1" || t === "2" || t === "3") {
      ne();
      const o = ["straight", "turn", "ice"][+t - 1];
      (ut(o), ft(["Straight line", "Cornering", "One wheel on ice"][+t - 1]));
    } else if (t === "l")
      (ne(), Rt(!h.lock), ft(h.lock ? "Diff locked" : "Diff open"));
    else if (t === "[" || t === "]")
      (ne(), as(h.steerT + (t === "[" ? 0.1 : -0.1)));
    else if (t === "," || t === ".")
      (ne(), Lt(h.speedT + (t === "," ? -0.1 : 0.1)), ft("Playback " + ei()));
    else if (t === " ") (e.preventDefault(), ne(), Qt(!h.paused));
    else if (t === "x") (ne(), kt(h.exT < 0.5));
    else if (t === "v") {
      ne();
      const o = _.cur === "desk" && !_.next ? "studio" : "desk";
      (bo(o), ft(o === "desk" ? "Desk" : "Studio"));
    } else
      t === "c"
        ? k("#cine").click()
        : t === "r"
          ? Xs()
          : t === "n"
            ? k("#b-tags").click()
            : t === "m"
              ? Pt.set(!Pt.on)
              : t === "/" &&
                (e.preventDefault(),
                ps.classList.toggle("ui-off"),
                ft(
                  ps.classList.contains("ui-off")
                    ? "Interface hidden \xB7 / to show"
                    : "Interface shown",
                ));
  }));
const ei = () => {
  const e = Es(h.speedT);
  return "1/" + Math.round(1 / e) + " speed";
};
function Ta() {
  const e = Oe.clientWidth,
    t = Oe.clientHeight;
  Xt = e < 900;
  const o = g.fov + (Xt ? 8 : 0);
  (C.fov !== o && ((C.fov = o), C.updateProjectionMatrix()),
    C.setViewOffset(e, t, Xt ? 0 : e * 0, Xt ? t * 0.12 : -t * 0.01, e, t));
  const s = 2 * Math.tan(c.MathUtils.degToRad(C.fov / 2));
  es =
    C.aspect < 0.8
      ? S(0.62 / Math.max(C.aspect, 0.4), 1, 1.5)
      : S(Math.max(Ws[0] / (s * C.aspect), Ws[1] / s) / ia, 0.85, 2.2);
}
function Ra() {
  const e = Oe.clientWidth,
    t = Oe.clientHeight;
  ((C.aspect = e / t),
    C.updateProjectionMatrix(),
    W.setSize(e, t),
    Te.setSize(e, t));
  const o = W.getDrawingBufferSize(new c.Vector2());
  (gs.uRes.value.copy(o), Ta(), C.updateProjectionMatrix());
}
addEventListener("resize", Ra);
let ka = performance.now(),
  Zs = 0,
  Js = 0,
  La = 0;
function Qs(e) {
  ((Fs = S((e - ka) / 1e3, 0, 1.5)), (xt = Math.min(0.1, Fs)), (ka = e));
  const t = e / 1e3;
  (($ = t), Tt && Xr(t, xt), Yr(), Tr(xt), Ar());
  const o = mo();
  if (
    (zr(o),
    jr(t),
    C.updateMatrixWorld(),
    (W.shadowMap.needsUpdate = !0),
    Br(xt, o),
    De(),
    Pt.tick(o),
    ns.classList.contains("on") && $ - pa > 1.6 && ns.classList.remove("on"),
    (Zs += Fs),
    Js++,
    e - La > 1600)
  ) {
    const s = Js / Math.max(Zs, 0.001);
    ((Zs = 0),
      (Js = 0),
      (La = e),
      (Ma = s),
      rs++,
      rs > 2 && (Ns = Math.max(Ns, s)),
      (is = rs > 3 && s < Ns * 0.74 ? is + 1 : 0),
      g._ceil === void 0 &&
        ((g._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (g._good = 0),
        (g._probe = 0)),
      !document.hidden &&
        g.auto &&
        rs > 3 &&
        (g._probe && s < 55
          ? ((g._probe = 0),
            (g._good = 0),
            (g._ceil = Math.max(1, +(g.pixelRatio - 0.25).toFixed(2))),
            (g.pixelRatio = g._ceil),
            Pe())
          : ((g._probe = 0),
            (g._good = s >= 58 ? Math.min(9, g._good + 1) : 0),
            g._good >= 3 &&
              g.pixelRatio < g._ceil &&
              ((g._good = 0),
              (g._probe = 1),
              (g.pixelRatio = Math.min(
                g._ceil,
                +(g.pixelRatio + 0.25).toFixed(2),
              )),
              Pe()))),
      !document.hidden &&
        g.auto &&
        is >= 2 &&
        s < 50 &&
        ((is = 0),
        g.pixelRatio > 1
          ? ((g.pixelRatio = g._ceil =
              Math.max(1, +(g.pixelRatio - 0.25).toFixed(2))),
            Pe())
          : g.msaa > 0
            ? ((g.msaa = 0), Pe())
            : g.ao && ((g.ao = 0), Pe())));
  }
  (W.info.reset(), Te.render());
}
let Pa = !0;
function Ca(e) {
  (requestAnimationFrame(Ca), Pa && Qs(e));
}
(Pe(),
  bo("desk", !0),
  ut("turn"),
  Jt(!0),
  k("#loading").remove(),
  De(!0),
  requestAnimationFrame(Ca),
  (window.__step = (e) => Qs(e)),
  (window.__loop = (e) => {
    Pa = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = W.domElement,
      s = document.createElement("canvas");
    return (
      (s.width = e),
      (s.height = Math.round((e * o.height) / o.width)),
      s.getContext("2d").drawImage(o, 0, 0, s.width, s.height),
      s.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    Qs(o ?? performance.now());
    const s = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + rn + "/_shots/" + e + ".webp",
        { method: "POST", body: s },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (Jt(!1), (vo = e), e && jt({ fit: null, ...e }));
    },
    view: (e, t = !0) => bo(e, t),
    cut: (e) => {
      (Jt(!0), ua(e, $));
    },
    mode: (e) => ut(e),
    lock: (e) => Rt(e),
    steer: (e) => {
      h.steerT = h.steer = e;
    },
    load: (e) => {
      h.loadT = h.load = e;
    },
    speed: (e) => Lt(e),
    pause: (e) => Qt(e),
    open: (e) => {
      (kt(e), (h.ex = h.exT));
    },
    ice: (e, t) => wa(e, t),
    settle: () => {
      const e = Xo(h.steer, po(h.ice[0]), po(h.ice[1]), h.lockOn, h.load);
      Object.assign(h, {
        wL: e.wL,
        wR: e.wR,
        TL: e.TL,
        TR: e.TR,
        v: e.v,
        vL: e.vL,
        vR: e.vR,
        sL: e.sL,
        sR: e.sR,
        scrub: e.scrub,
        stuck: e.stuck,
      });
    },
    hand: (e, t) => {
      if (e === null) {
        ((h.hand = null), (h.handT = $ + 1));
        return;
      }
      ((h.hand = { s: e, k: 0 }), (h.handSide = e), Ds(t || 0, 1 / 60));
    },
    tags: (e) => {
      yt = !!e;
    },
    tune: (e) => (Object.assign(g, e), Pe(), { ...g }),
    solve: Xo,
    nums: mo,
    ST: h,
    VIEW: _,
    VIEWS: No,
    HERO: dt,
    SHOTS: Ys,
    CAR: q,
  }),
  (window.__x = {
    dof: Re,
    gtao: K,
    bloom: Ke,
    renderer: W,
    camera: C,
    scene: J,
    composer: Te,
    cam: E,
    RT: g,
    overlay: _o,
    flow: vt,
    marks: it,
    PART: at,
    UI: me,
    AX: re,
    BELTS: Uo,
    housing: Ze,
    carrierG: ue,
    pinionG: rt,
    spiders: co,
  }),
  (window.__dbg = () => ({
    t: +$.toFixed(2),
    view: _.cur,
    shot: ss,
    cine: Tt,
    mode: ma(),
    lock: h.lockOn,
    ex: +h.ex.toFixed(2),
    fit: +es.toFixed(3),
    focus: +Re.u.focus.value.toFixed(2),
    range: +Re.u.range.value.toFixed(2),
    rpm: [Math.round(mo().rpmL), Math.round(mo().rpmR)],
    calls: W.info.render.calls,
    tris: W.info.render.triangles,
  })));
