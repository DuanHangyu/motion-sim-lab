import * as c from "three";
import { EffectComposer as Nf } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as ur,
  FullScreenQuad as Us,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as Yi } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Hf } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as Wf } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as zf } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as qf } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as Ko } from "three/addons/utils/BufferGeometryUtils.js";
const b = (e) => document.querySelector(e),
  fo = b("#world"),
  mt = b("#app"),
  A = (e, t, o) => (e < t ? t : e > o ? o : e),
  Pn = (e, t, o) => e + (t - e) * o,
  uo = (e, t, o) => {
    const n = A((o - e) / (t - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  hr = (e) => 1 - (1 - e) ** 3,
  Ki = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function Et(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const Be = Math.random,
  ve = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Xo = "https://x.com/ryansael",
  pr = "gigawatt",
  Vs = new URLSearchParams(location.search),
  Pe = new c.Scene();
((Pe.background = new c.Color("#121a2c")),
  (Pe.fog = new c.FogExp2("#26304a", 0.004)));
const O = new c.PerspectiveCamera(30, 1, 0.5, 1400);
let Y;
try {
  Y = new c.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
    preserveDrawingBuffer: !1,
  });
} catch (e) {
  throw (
    (b("#loading").textContent =
      "This game needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const Xi = 25e5,
  Yf = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return A(Math.min(devicePixelRatio, 2, Math.sqrt(Xi / (e * t))), 1, 2);
  },
  js = Yf();
(Y.setPixelRatio(js),
  (Y.info.autoReset = !1),
  (Y.shadowMap.enabled = !0),
  (Y.shadowMap.type = c.PCFShadowMap),
  (Y.shadowMap.autoUpdate = !1),
  (Y.toneMapping = c.ACESFilmicToneMapping),
  fo.appendChild(Y.domElement));
const Ns = new c.HemisphereLight(9414360, 3155999, 0.55);
Pe.add(Ns);
const me = new c.DirectionalLight(16761994, 1.9);
((me.castShadow = !0),
  me.shadow.mapSize.set(2048, 2048),
  (me.shadow.normalBias = 0.04),
  (me.shadow.bias = -4e-4),
  (me.shadow.radius = 2),
  Pe.add(me, me.target));
const Zo = new c.Vector3(0.72, 0.42, -0.55).normalize(),
  gr = new c.DirectionalLight(9427199, 0.75);
(gr.position.set(-30, 24, -40), Pe.add(gr));
const mr = new c.DirectionalLight(16773600, 0.42);
(mr.position.set(-20, 30, 30), Pe.add(mr));
const Ee = new c.Group();
Pe.add(Ee);
const Kt = 10,
  Qo = {
    pos: {
      value: Array.from({ length: Kt }, () => new c.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: Kt }, () => new c.Vector3()) },
  },
  Kf = `uniform vec4 uFakePos[${Kt}];uniform vec3 uFakeCol[${Kt}];uniform float uSat;`,
  Xf = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${Kt};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  Zf = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  Zi = { value: 1.18 };
function Xt(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: Qo.pos,
        uFakeCol: Qo.col,
        uSat: Zi,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + Kf,
          )
          .replace("#include <lights_fragment_end>", Xf)
          .replace("#include <opaque_fragment>", Zf)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => pr + (t ? t.key : "")),
    e
  );
}
const Hs = [];
function Ws(e, t, o, n, a, r) {
  const i = { p: new c.Vector3(e, t, o), c: new c.Color(n), r: a, i: r, i0: r };
  return (Hs.push(i), i);
}
const D = {
    mode: "cycle",
    th: 0,
    t0: null,
    first: 0,
    d: 0,
    warm: 0,
    outL: 1,
    inL: 1,
    fogK: 1,
    sunR: 60,
    envD: -1,
    envW: -1,
    wordAt: 0,
  },
  Ie = { lamps: [], tint: [] },
  En = (e, t) => (Ie.tint.push([e, e.color.clone(), new c.Color(t)]), e);
try {
  const e = localStorage.getItem(pr + "-tod");
  (e === "day" || e === "night") && (D.mode = e);
} catch {}
{
  const e = Vs.get("tod");
  (e === "day" || e === "night" || e === "cycle") && (D.mode = e);
}
const zs = (...e) => {
    const t = Ws(...e);
    return ((t.inside = 1), t);
  },
  qs = new c.Vector3(),
  Xe = [],
  br = new c.Vector3(2, 1, -1.5);
function Qf(e) {
  Xe.length = 0;
  for (const t of Hs) {
    const o = t.i * (t.inside ? D.inL : D.outL);
    if (!(o <= 0.001)) {
      if (
        ((t.score = (o * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        Xe.length < Kt)
      )
        (Xe.push(t), Xe.length === Kt && Xe.sort((n, a) => n.score - a.score));
      else if (t.score > Xe[0].score) {
        Xe[0] = t;
        for (let n = 0; n < Kt - 1 && Xe[n].score > Xe[n + 1].score; n++) {
          const a = Xe[n];
          ((Xe[n] = Xe[n + 1]), (Xe[n + 1] = a));
        }
      }
    }
  }
}
function Qi(e, t) {
  Qf(t);
  for (let o = 0; o < Kt; o++) {
    const n = Xe[o];
    if (!n) {
      (Qo.col.value[o].set(0, 0, 0), Qo.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (qs.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      Qo.pos.value[o].set(qs.x, qs.y, qs.z, 1 / (n.r * n.r)));
    {
      const a = n.i * (n.inside ? D.inL : D.outL);
      Qo.col.value[o].set(n.c.r * a, n.c.g * a, n.c.b * a);
    }
  }
}
const Jo = {
    uDay: { value: 0 },
    uWarm: { value: 0 },
    uSun: { value: new c.Vector3(0.72, 0.12, -0.55).normalize() },
  },
  wr = new c.Scene(),
  Jf = new c.PMREMGenerator(Y),
  Ji = [];
wr.add(
  new c.Mesh(
    new c.SphereGeometry(50, 32, 16),
    new c.ShaderMaterial({
      side: c.BackSide,
      uniforms: Jo,
      vertexShader:
        "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: `varying vec3 d;uniform float uDay;uniform float uWarm;uniform vec3 uSun;void main(){vec3 c=mix(vec3(.07,.06,.06),vec3(.20,.22,.32),smoothstep(-.3,.05,d.y));c=mix(c,vec3(.07,.10,.20),smoothstep(.15,.85,d.y));
  vec3 sd=normalize(vec3(.72,.12,-.55));float s=max(dot(d,sd),0.);c+=vec3(1.5,.7,.32)*pow(s,6.)*smoothstep(-.12,.2,d.y)*(1.-smoothstep(.25,.6,d.y));
  c+=vec3(1.2,.75,.4)*.25*smoothstep(.02,-.04,abs(d.y-.02))*.6;
  vec3 dc=mix(vec3(.24,.25,.2),vec3(.86,.9,.94),smoothstep(-.3,.05,d.y));dc=mix(dc,vec3(.5,.68,.92),smoothstep(.15,.85,d.y));
  dc+=mix(vec3(1.,.9,.75),vec3(1.6,.8,.4),uWarm)*pow(max(dot(d,uSun),0.),6.)*.8;
  gl_FragColor=vec4(mix(c,dc,uDay),1.);}`,
    }),
  ),
);
for (let e = 0; e < 5; e++) {
  const t = (e / 5) * Math.PI * 2 + 0.6,
    o = new c.Mesh(
      new c.BoxGeometry(10, 1.6, 0.4),
      new c.MeshBasicMaterial({ color: new c.Color(2.2, 1.9, 1.6) }),
    );
  (o.position.set(Math.sin(t) * 30, 16 + (e % 2) * 6, Math.cos(t) * 30),
    o.lookAt(0, 0, 0),
    wr.add(o),
    Ji.push(o));
}
let el = null;
function tl() {
  for (const t of Ji) t.visible = Jo.uDay.value < 0.6;
  const e = Jf.fromScene(wr, 0.03);
  (el?.dispose(), (el = e), (Pe.environment = e.texture));
}
(tl(), (Pe.environmentIntensity = 0.45));
const le = 0.08,
  xr = new c.WebGLRenderTarget(1, 1, {
    type: c.HalfFloatType,
    generateMipmaps: !0,
    minFilter: c.LinearMipmapLinearFilter,
  }),
  Ys = {
    tReflect: { value: xr.texture },
    uReflMatrix: { value: new c.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  ed = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, Ys),
        (e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
uniform mat4 uReflMatrix;varying vec4 vReflCoord;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
{vec4 wp=modelMatrix*vec4(transformed,1.);vReflCoord=uReflMatrix*wp;}`,
          )),
        (e.fragmentShader = e.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
uniform sampler2D tReflect;uniform float uReflStrength;varying vec4 vReflCoord;`,
          )
          .replace(
            "outgoingLight=max(mix(",
            `{float facing=saturate(dot(normal,normalize(vViewPosition)));float gl=1.-roughnessFactor;
   vec3 mir=texture2D(tReflect,vReflCoord.xy/max(vReflCoord.w,1e-4),1.4).rgb;outgoingLight=mix(outgoingLight,mir,uReflStrength*gl*(.3+.7*pow(max(1.-facing,0.),2.)));}
  outgoingLight=max(mix(`,
          )));
    },
    { key: "refl" },
  ),
  tt = new c.PerspectiveCamera(),
  Ks = new c.Vector3(0, 1, 0),
  Dn = new c.Vector3(0, le, 0),
  vr = new c.Vector3(),
  Xs = new c.Vector3(),
  yr = new c.Matrix4(),
  Gn = new c.Plane(),
  Zt = new c.Vector4(),
  ol = new c.Vector4(),
  Dt = [];
function nl() {
  if (
    !M.reflect ||
    Ys.uReflStrength.value <= 0 ||
    O.position.y <= le ||
    !me.shadow.map
  )
    return;
  (vr.setFromMatrixPosition(O.matrixWorld),
    yr.extractRotation(O.matrixWorld),
    tt.position.subVectors(Dn, vr).reflect(Ks).negate().add(Dn),
    Xs.set(0, 0, -1).applyMatrix4(yr).add(vr),
    Xs.subVectors(Dn, Xs).reflect(Ks).negate().add(Dn),
    tt.up.set(0, 1, 0).applyMatrix4(yr).reflect(Ks),
    tt.lookAt(Xs),
    (tt.far = O.far),
    (tt.near = O.near),
    tt.updateMatrixWorld(),
    tt.projectionMatrix.copy(O.projectionMatrix),
    Ys.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(tt.projectionMatrix)
      .multiply(tt.matrixWorldInverse),
    Gn.setFromNormalAndCoplanarPoint(Ks, Dn).applyMatrix4(
      tt.matrixWorldInverse,
    ),
    Zt.set(Gn.normal.x, Gn.normal.y, Gn.normal.z, Gn.constant));
  const e = tt.projectionMatrix.elements;
  (ol.set(
    (Math.sign(Zt.x) + e[8]) / e[0],
    (Math.sign(Zt.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    Zt.multiplyScalar(2 / Zt.dot(ol)),
    (e[2] = Zt.x),
    (e[6] = Zt.y),
    (e[10] = Zt.z + 1),
    (e[14] = Zt.w));
  const t = Dt.map((n) => n.visible),
    o = Y.shadowMap.needsUpdate;
  (Dt.forEach((n) => (n.visible = !1)),
    (Y.shadowMap.needsUpdate = !1),
    Qi(tt, br),
    Y.setRenderTarget(xr),
    Y.clear(),
    Y.render(Pe, tt),
    Y.setRenderTarget(null),
    Dt.forEach((n, a) => (n.visible = t[a])),
    (Y.shadowMap.needsUpdate = o));
}
const td =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  Zs = (e, t) =>
    new c.ShaderMaterial({
      uniforms: t,
      vertexShader: td,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class od extends ur {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new c.WebGLRenderTarget(1, 1, {
        type: c.HalfFloatType,
        samples: t,
        depthTexture: new c.DepthTexture(1, 1),
      })),
      (this.quad = new Us(
        Zs(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, n) {
    (Qi(O, br),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(Pe, O),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const sl = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?.75:1.3),0.)/max(focus,1.)*12.*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class nd extends ur {
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
        near: { value: O.near },
        far: { value: O.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new c.Vector2(1, 0.5) },
        maxCoc: { value: 11 },
        texel: { value: new c.Vector2() },
        fullTexel: { value: new c.Vector2() },
      }),
      (this.pre = new Us(
        Zs(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${sl}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Us(
        Zs(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<64;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Us(
        Zs(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${sl}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(t, o) {
    const n = Math.ceil(t / 2),
      a = Math.ceil(o / 2);
    (this.half.setSize(n, a),
      this.blurRT.setSize(n, a),
      this.u.texel.value.set(1 / n, 1 / a),
      this.u.fullTexel.value.set(1 / t, 1 / o));
  }
  render(t, o, n) {
    ((this.u.tColor.value = n.texture),
      t.setRenderTarget(this.half),
      this.pre.render(t),
      t.setRenderTarget(this.blurRT),
      this.blur.render(t),
      t.setRenderTarget(this.renderToScreen ? null : o),
      this.comp.render(t));
  }
}
const M = {
    auto: 1,
    pixelRatio: js,
    msaa: js >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 4096,
    shadowMin: 2048,
    exposure: 1,
    fov: 30,
    sun: 1,
    fill: 1,
    rim: 1,
    fog: 1,
    sat: 1.18,
    env: 1,
    reflect: 1,
    bloom: 1,
    bloomStrength: 1,
    bloomRadius: 0.55,
    bloomThreshold: 1,
    ao: 1,
    aoIntensity: 1,
    aoRadius: 1,
    aoSamples: 12,
    dof: 1,
    focalBand: 3,
    aperture: 1,
    apertureNear: 0.8,
    maxCoc: 11,
  },
  kr = { ...M },
  ot = new Nf(
    Y,
    new c.WebGLRenderTarget(1, 1, { type: c.HalfFloatType, depthBuffer: !1 }),
  );
ot.setPixelRatio(js);
const Bn = new od(M.msaa);
ot.addPass(Bn);
const ce = new Yi(Pe, O, 1, 1);
((ce.output = Yi.OUTPUT.Off),
  (ce.needsSwap = !1),
  ce.updateGtaoMaterial({
    radius: 1,
    thickness: 1.2,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  ce.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const sd = ce.setSize.bind(ce),
  ad = ce.render.bind(ce);
ce.setSize = (e, t) => sd(Math.ceil(e / 2), Math.ceil(t / 2));
const bt = [],
  al = [];
((ce.render = (e, t, o) => {
  (bt.forEach((n, a) => {
    ((al[a] = n.visible), (n.visible = !1));
  }),
    M.ao
      ? ad(e, t, o)
      : (ce._overrideVisibility(),
        ce._renderOverride(
          e,
          ce.normalMaterial,
          ce.normalRenderTarget,
          7829503,
          1,
        ),
        ce._restoreVisibility()),
    bt.forEach((n, a) => (n.visible = al[a])),
    M.ao &&
      ((ce.blendMaterial.uniforms.intensity.value = M.aoIntensity),
      (ce.blendMaterial.uniforms.tDiffuse.value = ce.pdRenderTarget.texture),
      ce._renderPass(e, ce.blendMaterial, o)));
}),
  ot.addPass(ce));
const Qt = new Hf(new c.Vector2(256, 256), 0.5, 0.55, 1),
  rd = Qt.setSize.bind(Qt);
((Qt.setSize = (e, t) => rd(Math.ceil(e / 2), Math.ceil(t / 2))),
  ot.addPass(Qt));
const ho = new nd();
((ho.u.tDepth.value = Bn.rt.depthTexture), ot.addPass(ho));
const Mr = new c.Scene(),
  rl = {
    tSceneDepth: { value: ce.depthTexture },
    uRes: { value: new c.Vector2(1, 1) },
    uNF: { value: new c.Vector2(O.near, O.far) },
  };
class id extends ur {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, n) {
    const a = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(n),
      t.render(Mr, O),
      (t.autoClear = a));
  }
}
(ot.addPass(new id()), ot.addPass(new Wf()));
const il = new zf();
ot.addPass(il);
const ld = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  cd = (e, t, o, n = 0.06, a = 2) =>
    new qf(e, t, o, a, Math.min(n, Math.min(e, t, o) / 2.02)),
  lt = new Map();
function C(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    lt.has(o) ||
      lt.set(
        o,
        Xt(
          new c.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    lt.get(o)
  );
}
function ll(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    lt.has(o) ||
      lt.set(
        o,
        Xt(
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
    lt.get(o)
  );
}
function Ge(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    lt.has(o) ||
      lt.set(
        o,
        Xt(
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
    lt.get(o)
  );
}
const Ze = (e, t = 1) => {
    const o = "G" + e + t;
    return (
      lt.has(o) ||
        lt.set(
          o,
          new c.MeshBasicMaterial({
            color: new c.Color(e).multiplyScalar(t),
            fog: !1,
          }),
        ),
      lt.get(o)
    );
  },
  fd = Ge("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  Sr = Ge("#434a55", { roughness: 0.36 }),
  c1 = Ge("#23272e", { roughness: 0.42, metalness: 0.7 }),
  f1 = Ge("#15171b", { roughness: 0.46, metalness: 0.55 }),
  dd = Ge("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  d1 = Ge("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  In = C("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  ct = new c.Matrix4(),
  Gt = new c.Quaternion(),
  Qs = new c.Euler(0, 0, 0, "YXZ"),
  cl = new c.Vector3(1, 1, 1),
  fl = new c.Color(),
  u1 = new c.Vector3(1, 0, 0),
  On = new c.Vector3(0, 1, 0),
  h1 = new c.Vector3(0, 0, 1),
  ud = new c.Vector3(),
  hd = new c.Quaternion();
function oe() {
  const e = new Map(),
    t = (o, n, a, r, i, l) => {
      n = n.index ? n.toNonIndexed() : n;
      for (const u of Object.keys(n.attributes))
        ["position", "normal", "uv"].includes(u) || n.deleteAttribute(u);
      (n.attributes.uv ||
        n.setAttribute(
          "uv",
          new c.Float32BufferAttribute(
            new Float32Array(n.attributes.position.count * 2),
            2,
          ),
        ),
        l.dir
          ? (Gt.setFromUnitVectors(
              On,
              ud.set(l.dir[0], l.dir[1], l.dir[2]).normalize(),
            ),
            l.roll && Gt.multiply(hd.setFromAxisAngle(On, l.roll)))
          : (Qs.set(l.rx || 0, l.ry || 0, l.rz || 0), Gt.setFromEuler(Qs)),
        n.applyMatrix4(
          ct.compose(
            { x: a, y: r, z: i },
            Gt,
            l.s ? cl.set(l.s[0], l.s[1], l.s[2]) : cl.set(1, 1, 1),
          ),
        ));
      let f = e.get(o);
      (f || e.set(o, (f = { mat: o, list: [] })), f.list.push(n));
    };
  return {
    box(o, n, a, r, i, l, f, u = {}) {
      return (
        t(o, u.r ? cd(i, l, f, u.r) : new c.BoxGeometry(i, l, f), n, a, r, u),
        this
      );
    },
    cyl(o, n, a, r, i, l, f, u = {}) {
      return (
        t(
          o,
          new c.CylinderGeometry(i, l, f, u.seg || 20, 1, !!u.open),
          n,
          a,
          r,
          u,
        ),
        this
      );
    },
    cone(o, n, a, r, i, l, f = {}) {
      return (
        t(
          o,
          new c.ConeGeometry(i, l, f.seg || 6).translate(0, l / 2, 0),
          n,
          a,
          r,
          f,
        ),
        this
      );
    },
    sph(o, n, a, r, i, l = {}) {
      return (
        t(o, new c.SphereGeometry(i, l.seg || 14, l.seg2 || 10), n, a, r, l),
        this
      );
    },
    tor(o, n, a, r, i, l, f = {}) {
      return (
        t(
          o,
          new c.TorusGeometry(
            i,
            l,
            f.seg2 || 8,
            f.seg || 40,
            f.arc || Math.PI * 2,
          ),
          n,
          a,
          r,
          f,
        ),
        this
      );
    },
    geo(o, n, a = 0, r = 0, i = 0, l = {}) {
      return (t(o, n.clone(), a, r, i, l), this);
    },
    geos() {
      const o = [];
      for (const { mat: n, list: a } of e.values())
        (o.push([n, Ko(a)]), a.forEach((r) => r.dispose()));
      return (e.clear(), o);
    },
    flush(o, n = !0) {
      const a = [];
      for (const { mat: r, list: i } of e.values()) {
        const l = new c.Mesh(Ko(i), r);
        ((l.castShadow = n),
          (l.receiveShadow = !0),
          o.add(l),
          a.push(l),
          i.forEach((f) => f.dispose()));
      }
      return (e.clear(), a);
    },
  };
}
const Js = [];
document.fonts?.ready.then(() => Js.forEach((e) => e()));
function Fn(e, t, o, n, a, r = 0.9, i = {}) {
  const l = document.createElement("canvas");
  ((l.width = o), (l.height = n));
  const f = l.getContext("2d"),
    u = new c.CanvasTexture(l);
  ((u.anisotropy = 8), (u.colorSpace = c.SRGBColorSpace));
  const g = new c.Mesh(
    new c.PlaneGeometry(e, t),
    new c.MeshBasicMaterial({
      map: u,
      alphaTest: 0.3,
      fog: !1,
      side: c.DoubleSide,
      color: new c.Color(r, r, r),
      ...i,
    }),
  );
  return (
    (g.userData = {
      c: l,
      g: f,
      t: u,
      redraw(d) {
        (f.clearRect(0, 0, o, n), d(f, o, n), (u.needsUpdate = !0));
      },
    }),
    a && (g.userData.redraw(a), Js.push(() => g.userData.redraw(a))),
    g
  );
}
const en = (e, t, o, n, a, r) => {
    (e.beginPath(), e.roundRect(t, o, n, a, r));
  },
  tn = (e, t, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), o(a.getContext("2d"), e, t));
    const r = new c.CanvasTexture(a);
    return (n && (r.colorSpace = c.SRGBColorSpace), (r.anisotropy = 8), r);
  },
  pd = tn(
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
  gd = (e, t, o = pd) =>
    new c.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: c.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function dl(e, t = 0.3, o = 1, n = 0) {
  const a = new c.IcosahedronGeometry(e, n),
    r = a.attributes.position,
    i = Et(o),
    l = new Map();
  for (let f = 0; f < r.count; f++) {
    const u =
      r.getX(f).toFixed(3) +
      "," +
      r.getY(f).toFixed(3) +
      "," +
      r.getZ(f).toFixed(3);
    l.has(u) ||
      l.set(u, [1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t]);
    const g = l.get(u);
    r.setXYZ(f, r.getX(f) * g[0], r.getY(f) * g[1], r.getZ(f) * g[2]);
  }
  return (a.computeVertexNormals(), a);
}
const md = tn(
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
function p1(e, t, o, n, a, r, i = 0.5) {
  const l = new c.Mesh(
    new c.PlaneGeometry(a, r),
    new c.MeshBasicMaterial({
      map: md,
      transparent: !0,
      opacity: i,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (l.rotation.x = -Math.PI / 2),
    l.position.set(t, o + 0.004, n),
    (l.renderOrder = -1),
    e.add(l),
    bt.push(l),
    l
  );
}
const ea = [];
function bd(e, t, o, n, a, r = 128, i = "@RYANSAEL ON X") {
  const l = () => {
    ((e.font = `${n ? 700 : 600} ${r}px Outfit, sans-serif`),
      (e.letterSpacing = Math.round(r * 0.08) + "px"));
  };
  l();
  const f = e.measureText(i).width;
  f > t - 28 && ((r = Math.floor((r * (t - 28)) / f)), l());
  const u = t / 2 + Math.round(r * 0.04),
    g = o / 2 + r * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), n)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(i, u, g + r * 0.05),
      (e.fillStyle = a ? "#e08a24" : "#38332d"),
      e.fillText(i, u, g));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(i, u + r * 0.02, g + r * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(i, u, g - r * 0.025));
  const d = e.createLinearGradient(0, g - r * 0.7, 0, g);
  (d.addColorStop(0, "#f1d08c"),
    d.addColorStop(1, "#b3833d"),
    (e.fillStyle = d),
    e.fillText(i, u, g));
}
function wd(e, t = {}) {
  const o = !!t.pale,
    n = t.k ?? (o ? 0.92 : 0.6);
  let a = !1;
  const r = (l, f, u) => bd(l, f, u, o, a, 128, t.text),
    i = Fn(e, e * 0.1375, 1280, 176, r, n, { alphaTest: 0.25 });
  return (
    (i.userData.mark = 1),
    Dt.push(i),
    ea.push({
      hit: i,
      over(l) {
        ((a = l),
          o
            ? i.userData.redraw(r)
            : i.material.color.setRGB(l ? 3.4 : n, l ? 2.5 : n, l ? 1.4 : n));
      },
    }),
    i
  );
}
class xd {
  constructor(t) {
    this.max = t;
    const o = new c.BufferGeometry();
    ((this.pos = new Float32Array(t * 12)),
      (this.side = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 16)));
    const n = new Uint32Array(t * 6);
    for (let a = 0; a < t; a++) {
      const r = a * 4;
      n.set([r, r + 1, r + 2, r + 1, r + 3, r + 2], a * 6);
    }
    (o.setAttribute(
      "position",
      new c.BufferAttribute(this.pos, 3).setUsage(c.DynamicDrawUsage),
    ),
      o.setAttribute(
        "aSide",
        new c.BufferAttribute(this.side, 1).setUsage(c.DynamicDrawUsage),
      ),
      o.setAttribute(
        "aCol",
        new c.BufferAttribute(this.col, 4).setUsage(c.DynamicDrawUsage),
      ),
      o.setIndex(new c.BufferAttribute(n, 1)),
      (this.mesh = new c.Mesh(
        o,
        new c.ShaderMaterial({
          uniforms: { ...rl, uSoft: { value: 0.6 } },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: c.AdditiveBlending,
          side: c.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${ld}varying float vS;varying vec4 vC;uniform float uSoft;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Mr.add(this.mesh));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, n, a, r, i, l) {
    if (this.n >= this.max) return;
    const f = this.n++;
    (ul.subVectors(o, t),
      hl.addVectors(t, o).multiplyScalar(0.5),
      pl.subVectors(O.position, hl),
      _e.crossVectors(ul, pl));
    const u = _e.length();
    u < 1e-9 ? _e.set(0, n ? 1 : 0, 0) : _e.multiplyScalar(1 / u);
    const g = this.pos,
      d = f * 12;
    ((g[d] = t.x - _e.x * n),
      (g[d + 1] = t.y - _e.y * n),
      (g[d + 2] = t.z - _e.z * n),
      (g[d + 3] = t.x + _e.x * n),
      (g[d + 4] = t.y + _e.y * n),
      (g[d + 5] = t.z + _e.z * n),
      (g[d + 6] = o.x - _e.x * a),
      (g[d + 7] = o.y - _e.y * a),
      (g[d + 8] = o.z - _e.z * a),
      (g[d + 9] = o.x + _e.x * a),
      (g[d + 10] = o.y + _e.y * a),
      (g[d + 11] = o.z + _e.z * a),
      this.side.set(vd, f * 4));
    const p = this.col,
      h = f * 16;
    for (let w = 0; w < 4; w++)
      ((p[h + w * 4] = r.r),
        (p[h + w * 4 + 1] = r.g),
        (p[h + w * 4 + 2] = r.b),
        (p[h + w * 4 + 3] = w < 2 ? i : l));
  }
  dot(t, o, n, a) {
    (Cr.set(1, 0, 0)
      .applyQuaternion(O.quaternion)
      .multiplyScalar(wt(t, o) * 0.9),
      gl.copy(t).sub(Cr),
      ml.copy(t).add(Cr),
      this.seg(gl, ml, wt(t, o), wt(t, o), n, a, a));
  }
  line(t, o, n, a) {
    for (let r = 0; r < t.length - 1; r++) {
      const i = r / (t.length - 1),
        l = (r + 1) / (t.length - 1);
      this.seg(
        t[r],
        t[r + 1],
        wt(t[r], o),
        wt(t[r + 1], o),
        n,
        a ? a(i) : 1,
        a ? a(l) : 1,
      );
    }
  }
  end() {
    const t = this.mesh.geometry,
      o = Math.max(this.n, 1);
    t.setDrawRange(0, this.n * 6);
    for (const [n, a] of [
      ["position", 12],
      ["aSide", 4],
      ["aCol", 16],
    ]) {
      const r = t.attributes[n];
      (r.clearUpdateRanges(), r.addUpdateRange(0, o * a), (r.needsUpdate = !0));
    }
  }
}
const vd = [-1, 1, -1, 1],
  ul = new c.Vector3(),
  hl = new c.Vector3(),
  pl = new c.Vector3(),
  _e = new c.Vector3(),
  Cr = new c.Vector3(),
  gl = new c.Vector3(),
  ml = new c.Vector3(),
  Oe = new xd(9e3),
  wt = (e, t) =>
    ((O.position.distanceTo(e) *
      Math.tan(c.MathUtils.degToRad(O.fov / 2)) *
      2) /
      Math.max(fo.clientHeight, 1)) *
    t *
    0.5,
  B = 40,
  bl = 28,
  fe = B * bl,
  P = [
    null,
    {
      id: "pc",
      kind: "rack",
      name: "Gaming PC",
      gpus: 1,
      kw: 0.45,
      tps: 30,
      cost: 50,
      gen: 0,
      cls: 0,
      desc: "One graphics card on a wire shelf. Where every lab starts.",
    },
    {
      id: "srv",
      kind: "rack",
      name: "8-GPU server",
      gpus: 8,
      kw: 10.2,
      tps: 1100,
      cost: 2500,
      gen: 1,
      cls: 1,
      desc: "Eight datacenter GPUs in one box, about 10 kW. Too much heat for a fan.",
    },
    {
      id: "nvl",
      kind: "rack",
      name: "72-GPU rack",
      gpus: 72,
      kw: 132,
      tps: 26e3,
      cost: 3e5,
      gen: 3,
      cls: 2,
      desc: "72 GPUs wired into one machine, about 130 kW. Air cannot carry that much heat away.",
    },
    {
      id: "kyb",
      kind: "rack",
      name: "576-GPU rack",
      gpus: 576,
      kw: 600,
      tps: 26e4,
      cost: 17e6,
      gen: 5,
      cls: 2,
      desc: "The racks planned for 2027: 576 GPUs and about 600 kW in one cabinet.",
    },
    {
      id: "pho",
      kind: "rack",
      name: "Photonic rack",
      gpus: 2048,
      kw: 3e3,
      tps: 24e5,
      cost: 33e7,
      gen: 6,
      cls: 3,
      desc: "Speculative: chips wired together with light. 3 MW a cabinet.",
    },
    {
      id: "fan",
      kind: "cool",
      name: "Box fan",
      kw: 1,
      cost: 15,
      gen: 0,
      cls: 0,
      range: 1,
      draw: 0.08,
      desc: "Blows on whatever is next to it. Cools 1 kW across the eight tiles around it.",
    },
    {
      id: "crah",
      kind: "cool",
      name: "Air handler",
      kw: 45,
      cost: 1e3,
      gen: 1,
      cls: 1,
      range: 1,
      draw: 0.1,
      desc: "Chilled-water coils and big fans. Cools 45 kW across the eight tiles around it.",
    },
    {
      id: "cdu",
      kind: "cool",
      name: "Liquid loop",
      kw: 900,
      cost: 2e5,
      gen: 3,
      cls: 2,
      range: 1,
      draw: 0.04,
      desc: "Pumps coolant to cold plates on the chips. Cools 900 kW across the eight tiles around it.",
    },
    {
      id: "chill",
      kind: "cool",
      name: "Chiller plant",
      kw: 9e3,
      cost: 25e6,
      gen: 5,
      cls: 3,
      range: 2,
      draw: 0.05,
      desc: "Chillers and a cooling tower on one pad. Cools 9 MW, two tiles out in every direction.",
    },
  ];
P.forEach((e, t) => {
  e && (e.ix = t);
});
const g1 = P.filter((e) => e?.kind === "rack").map((e) => e.ix),
  m1 = P.filter((e) => e?.kind === "cool").map((e) => e.ix),
  K = Object.fromEntries(P.filter(Boolean).map((e) => [e.id, e])),
  _n = ["a fan", "an air handler", "liquid cooling", "a chiller plant"],
  Jt = [
    {
      id: "outlet",
      name: "Wall outlet",
      kw: 1.8,
      cost: 0,
      gen: 0,
      max: 1,
      desc: "15 amps at 120 volts. What a garage gets.",
    },
    {
      id: "panel",
      name: "200 A service",
      kw: 48,
      cost: 200,
      gen: 0,
      max: 1,
      desc: "An electrician runs a 200 amp panel into the garage.",
    },
    {
      id: "xfmr",
      name: "Transformer",
      kw: 2500,
      cost: 25e3,
      gen: 1,
      max: 4,
      desc: "A pad-mounted transformer straight off the utility line.",
    },
    {
      id: "sub",
      name: "Substation",
      kw: 5e4,
      cost: 3e6,
      gen: 3,
      max: 4,
      desc: "Your own substation on the high-voltage grid.",
    },
    {
      id: "gas",
      name: "Gas turbines",
      kw: 1e5,
      cost: 15e7,
      gen: 4,
      max: 6,
      desc: "Turbines on site, because the grid queue is years long.",
    },
    {
      id: "smr",
      name: "Small reactor",
      kw: 3e5,
      cost: 3e9,
      gen: 5,
      max: 6,
      desc: "A small modular nuclear reactor, about 300 MW.",
    },
    {
      id: "fusion",
      name: "Fusion plant",
      kw: 2e6,
      cost: 15e10,
      gen: 6,
      max: 3,
      desc: "Speculative. Two gigawatts from a ring of plasma.",
    },
  ],
  ft = Object.fromEntries(Jt.map((e) => [e.id, e])),
  _ = [
    [4, 3, 0, "Garage"],
    [6, 4, 250, "Double garage"],
    [8, 6, 8e3, "Workshop"],
    [12, 8, 4e5, "Warehouse"],
    [16, 11, 1e7, "Data hall"],
    [22, 15, 3e8, "Hyperscale hall"],
    [30, 20, 14e9, "Campus"],
    [40, 28, 5e11, "Gigawatt campus"],
  ],
  ee = [
    { cls: "Autocomplete", bench: 9, D: 120, T: 175 },
    { cls: "Chatbot", bench: 24, D: 1500, T: 900, round: "Pre-seed" },
    { cls: "Assistant", bench: 38, D: 18e3, T: 1520, round: "Seed" },
    { cls: "Coder", bench: 53, D: 22e4, T: 1840, round: "Series A" },
    { cls: "Agent", bench: 67, D: 26e5, T: 2400, round: "Series B" },
    { cls: "Researcher", bench: 80, D: 45e6, T: 1600, round: "Series C" },
    { cls: "Scientist", bench: 91, D: 7e8, T: 1400, round: "Series D" },
    { cls: "AGI", bench: 100, D: 3e10, T: 0, round: "IPO" },
  ];
ee.forEach((e, t) => {
  ((e.p = 0.05 * 1.15 ** t), (e.TN = e.D * e.T));
});
const Me = ee.length - 1,
  $r = 1e6,
  Un = () => s.gen === Me - 1 && m.draw < $r,
  xt = [
    {
      id: "batch",
      name: "Continuous batching",
      fx: { tps: 1.3 },
      cost: 150,
      gen: 0,
      desc: "Answer many requests in the same pass over the weights.",
    },
    {
      id: "aisle",
      name: "Hot and cold aisles",
      fx: { cool: 1.25 },
      cost: 1500,
      gen: 1,
      desc: "Stop hot exhaust mixing back into the cold intake.",
    },
    {
      id: "live",
      name: "Launch livestreams",
      fx: { hype: 2 },
      cost: 6e3,
      gen: 1,
      desc: "Every launch draws twice the crowd.",
    },
    {
      id: "kern",
      name: "Fused kernels",
      fx: { tps: 1.25 },
      cost: 15e3,
      gen: 1,
      desc: "Do attention in one pass on the chip instead of waiting on memory.",
    },
    {
      id: "fp8",
      name: "FP8 inference",
      fx: { tps: 1.4 },
      cost: 12e4,
      gen: 2,
      desc: "Half the bits per weight, nearly the same answers.",
    },
    {
      id: "resv",
      name: "Research division",
      fx: { reserve: 0.2 },
      cost: 15e4,
      gen: 2,
      desc: "A fifth of your compute keeps training however busy you are.",
    },
    {
      id: "ent",
      name: "Enterprise plans",
      fx: { price: 1.3 },
      cost: 25e4,
      gen: 2,
      desc: "Companies pay more for uptime, privacy and a contract.",
    },
    {
      id: "market",
      name: "Token marketplace",
      fx: { demand: 1.2 },
      cost: 3e5,
      gen: 2,
      spons: "market",
      desc: "List your model on a router that sends you its traffic.",
    },
    {
      id: "spec",
      name: "Speculative decoding",
      fx: { tps: 1.35 },
      cost: 3e6,
      gen: 3,
      desc: "A small model drafts, the big one checks the draft in one pass.",
    },
    {
      id: "moe",
      name: "Mixture of experts",
      fx: { train: 0.7 },
      cost: 5e6,
      gen: 3,
      desc: "Only part of the model runs for each token. Training needs 30% less.",
    },
    {
      id: "free",
      name: "Free cooling",
      fx: { draw: 0.5 },
      cost: 6e6,
      gen: 3,
      desc: "Use the outside air when it is cold. Cooling draws half the power.",
    },
    {
      id: "ppa",
      name: "Power purchase deal",
      fx: { plant: 0.75 },
      cost: 8e6,
      gen: 3,
      desc: "Sign for twenty years of power. Plants cost a quarter less.",
    },
    {
      id: "kv",
      name: "Prompt caching",
      fx: { tps: 1.3 },
      cost: 6e7,
      gen: 4,
      desc: "Keep what the model already read instead of reading it again.",
    },
    {
      id: "reason",
      name: "Reasoning models",
      fx: { demand: 1.5 },
      cost: 1e8,
      gen: 4,
      desc: "Models that think before they answer use many more tokens.",
    },
    {
      id: "twoph",
      name: "Two-phase cooling",
      fx: { cool: 1.3 },
      cost: 15e7,
      gen: 4,
      desc: "Boil a fluid on the chip and condense it somewhere else.",
    },
    {
      id: "btm",
      name: "Behind the meter",
      fx: { power: 1.2 },
      cost: 2e8,
      gen: 4,
      desc: "Generate on site and skip the grid queue. A fifth more power.",
    },
    {
      id: "agents",
      name: "Agents",
      fx: { demand: 1.4 },
      cost: 2e9,
      gen: 5,
      desc: "Models that work for hours on their own. They never stop asking.",
    },
    {
      id: "fp4",
      name: "FP4 inference",
      fx: { tps: 1.5 },
      cost: 3e9,
      gen: 5,
      desc: "Four bits per weight, trained for it from the start.",
    },
    {
      id: "synth",
      name: "Synthetic data",
      fx: { train: 0.7 },
      cost: 4e9,
      gen: 5,
      desc: "Models write and grade their own training data.",
    },
    {
      id: "distill",
      name: "Distillation",
      fx: { price: 1.4 },
      cost: 5e10,
      gen: 6,
      desc: "Teach a small model what the big one knows, and keep the margin.",
    },
    {
      id: "sparse",
      name: "Sparse attention",
      fx: { tps: 1.4 },
      cost: 8e10,
      gen: 6,
      desc: "Read only the parts of a long context that matter.",
    },
  ],
  Tr = Object.fromEntries(xt.map((e) => [e.id, e])),
  wl = {
    pc: 2,
    fan: 1.5,
    srv: 5,
    crah: 4,
    nvl: 9,
    cdu: 7,
    kyb: 14,
    chill: 12,
    pho: 22,
  },
  yd = { outlet: 0, panel: 4, xfmr: 8, sub: 15, gas: 22, smr: 32, fusion: 45 },
  ta = [0, 4, 8, 12, 18, 24, 32, 40],
  kd = 60,
  xl = 1,
  on = 2.5,
  Ar = 60,
  Md = 20,
  Sd = 0.05,
  Cd = 60,
  $d = 3,
  vl = 0.5,
  ne = {
    books: { gen: 2, wage: 2 },
    curb: { gen: 4, wage: 2 },
    fix: { gen: 3, wage: 3 },
    build: { gen: 5 },
  };
let Lr = 300;
const oa = 6,
  na = [500, 15e3, 5e5, 15e6, 5e8, 15e9],
  yl = (e) => e.gen > 0,
  kl =
    '<svg width="1024" height="169" viewBox="0 0 1024 169" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M185.44 0C213.372 0 236.014 22.6431 236.014 50.5745C236.014 78.506 213.372 101.149 185.44 101.149L235.605 151.314C241.977 157.686 237.464 168.582 228.453 168.582H84.2908C37.7383 168.582 0 130.843 0 84.2908C0 37.7383 37.7383 0 84.2908 0H185.44ZM84.2908 33.7164C56.3593 33.7164 33.7163 56.3593 33.7163 84.2908C33.7163 112.222 56.3593 134.865 84.2908 134.865C112.222 134.865 134.865 112.222 134.865 84.2908C134.865 56.3593 112.222 33.7164 84.2908 33.7164Z" fill="#C8FF00"/><path d="M345.418 53.8457C367.142 53.8457 385.176 70.6013 385.176 92.8946C385.176 115.33 367.569 132.512 345.276 132.512C323.408 132.512 305.232 115.614 305.232 93.1788C305.232 70.7437 323.408 53.8457 345.418 53.8457ZM345.418 117.176C359.191 117.176 367.995 106.243 367.995 93.1788C367.995 80.1151 359.049 69.1812 345.276 69.1812C331.644 69.1812 322.556 79.8308 322.556 92.8946C322.556 105.817 331.644 117.176 345.418 117.176Z" fill="#FCFCFE"/><path d="M433.226 132.372C427.405 132.372 414.625 129.39 408.661 120.16V168.581H391.763V55.4101H408.235V67.1957C414.625 56.8303 426.979 53.9901 433.653 53.9901C456.94 53.9901 470.856 74.0119 470.856 93.039C470.856 113.629 455.662 132.372 433.226 132.372ZM431.096 117.037C444.729 117.037 453.816 106.245 453.816 93.1814C453.816 80.1177 444.87 69.1837 431.096 69.1837C417.323 69.1837 408.377 80.1177 408.377 93.1814C408.377 106.245 417.323 117.037 431.096 117.037Z" fill="#FCFCFE"/><path d="M494.157 98.2906C494.442 109.934 505.233 118.028 516.308 118.028C525.538 118.028 532.354 114.62 536.757 106.243L548.968 114.336C542.436 126.405 529.799 132.654 516.593 132.654C494.157 132.654 476.833 115.756 476.833 93.1788C476.833 71.7371 493.021 53.8457 515.031 53.8457C538.602 53.8457 551.95 70.1752 551.95 93.0365C551.95 93.7468 551.95 96.4445 551.665 98.2906H494.157ZM495.009 85.5106H534.769C534.2 74.7191 525.538 68.329 515.031 68.329C504.665 68.329 496.571 75.1451 495.009 85.5106Z" fill="#FCFCFE"/><path d="M611.623 88.7767C611.623 77.9852 606.512 69.8915 594.867 69.8915C584.218 69.8915 577.402 77.5592 577.402 89.0605V131.234H560.504V55.4076H576.977V65.6313C584.218 55.8338 594.158 53.8457 600.121 53.8457C619.434 53.8457 628.521 67.335 628.521 84.5165V131.234H611.623V88.7767Z" fill="#FCFCFE"/><path d="M680.819 72.4488C679.4 72.1646 676.843 72.0227 675.992 72.0227C663.07 72.0227 656.254 79.6904 656.254 92.7542V131.235H639.356V55.4092H655.829V67.4789C660.514 58.959 668.466 54.6989 676.701 54.6989C677.695 54.6989 679.825 54.8413 680.819 55.125V72.4488Z" fill="#FCFCFE"/><path d="M722.992 53.8457C744.717 53.8457 762.751 70.6013 762.751 92.8946C762.751 115.33 745.144 132.512 722.851 132.512C700.983 132.512 682.807 115.614 682.807 93.1788C682.807 70.7437 700.983 53.8457 722.992 53.8457ZM722.992 117.176C736.765 117.176 745.569 106.243 745.569 93.1788C745.569 80.1151 736.624 69.1812 722.851 69.1812C709.218 69.1812 700.131 79.8308 700.131 92.8946C700.131 105.817 709.218 117.176 722.992 117.176Z" fill="#FCFCFE"/><path d="M787.639 97.8671C787.639 108.659 792.751 116.752 804.395 116.752C815.044 116.752 821.86 109.085 821.86 97.5828V55.4103H838.758V131.236H822.286V121.013C815.044 130.81 805.104 132.798 799.142 132.798C780.114 132.798 770.741 119.308 770.741 101.985V55.4102H787.639V97.8671Z" fill="#FCFCFE"/><path d="M878.805 104.113C878.805 113.485 883.491 116.75 891.869 116.75C893.431 116.75 895.135 116.609 897.265 116.183V130.524C894.283 131.66 890.307 132.086 888.177 132.086C871.847 132.086 861.908 123.566 861.908 106.811V70.6018H847.992V55.4082H861.908V31.9785H878.805V55.4082H897.407V70.6018H878.805V104.113Z" fill="#FCFCFE"/><path d="M917.316 98.2906C917.601 109.934 928.392 118.028 939.468 118.028C948.697 118.028 955.513 114.62 959.916 106.243L972.127 114.336C965.595 126.405 952.958 132.654 939.752 132.654C917.316 132.654 899.993 115.756 899.993 93.1788C899.993 71.7371 916.18 53.8457 938.19 53.8457C961.761 53.8457 975.109 70.1752 975.109 93.0365C975.109 93.7468 975.109 96.4445 974.825 98.2906H917.316ZM918.168 85.5106H957.928C957.359 74.7191 948.697 68.329 938.19 68.329C927.824 68.329 919.731 75.1451 918.168 85.5106Z" fill="#FCFCFE"/><path d="M1024 72.4488C1022.58 72.1646 1020.02 72.0227 1019.17 72.0227C1006.25 72.0227 999.434 79.6904 999.434 92.7542V131.235H982.536V55.4092H999.008V67.4789C1003.69 58.959 1011.65 54.6989 1019.88 54.6989C1020.88 54.6989 1023 54.8413 1024 55.125V72.4488Z" fill="#FCFCFE"/></svg>',
  Ml =
    '<svg width="1024" height="730" viewBox="0 0 1024 730" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M795.893 0C915.776 0 1012.95 97.9963 1012.95 218.88C1012.95 339.764 915.776 437.76 795.893 437.76L1011.2 654.869C1038.55 682.447 1019.18 729.6 980.504 729.6H361.77C161.97 729.6 0 566.273 0 364.8C0 163.327 161.97 0 361.77 0L795.893 0ZM361.77 145.92C241.89 145.92 144.708 243.916 144.708 364.8C144.708 485.684 241.89 583.68 361.77 583.68C481.649 583.68 578.831 485.684 578.831 364.8C578.831 243.916 481.649 145.92 361.77 145.92Z" fill="#C8FF00"/></svg>',
  Sl = "utm_source=sael.net&utm_medium=game&utm_campaign=garage-to-gigawatt",
  Td = {
    openrouter: {
      id: "openrouter",
      kind: "brand",
      name: "OpenRouter",
      url: "https://openrouter.ai/?" + Sl + "&utm_content=billboard",
      logo: kl,
      glyph: Ml,
      logoAspect: 1024 / 169,
      bg: ["#16161c", "#050507"],
      accent: "#C8FF00",
      ink: "#FCFCFE",
      thanks: "With thanks to OpenRouter",
      head: "The unified interface for every model",
      sub: "Better prices, better uptime, no subscriptions.",
      cta: "openrouter.ai",
      about:
        "One API for 500+ AI models from 80+ providers. When a provider goes down, requests fall back to another one, so apps stay up.",
      stats: [
        ["500+", "models"],
        ["80+", "providers"],
        ["500T+", "tokens a month"],
      ],
    },
  },
  Ad = {
    id: "game",
    kind: "game",
    name: "Garage to Gigawatt",
    url: null,
    hold: 10,
  },
  Ld = { id: "rent", kind: "rent", name: "This billboard", url: Xo, hold: 4.5 },
  Cl = {
    billboard: [{ ...Td.openrouter, hold: 12 }, Ad, Ld],
    truck: {
      name: "GPU FREIGHT",
      sub: "Your logo on every delivery",
      c1: "#e9ebf0",
      c2: "#1d2433",
      url: Xo,
    },
    market: {
      name: "List on OpenRouter",
      brand: "OpenRouter",
      url: "https://openrouter.ai/?" + Sl + "&utm_content=marketplace",
      glyph: Ml,
      lockup: kl,
      logoAspect: 1024 / 169,
      accent: "#C8FF00",
      desc: "Put your model on OpenRouter, where developers choose from 500+ models through one API. Their requests start reaching you.",
    },
    presented: null,
  },
  Rd = {
    ...Cl,
    truck: {
      name: "YOURBRAND",
      sub: "GPUs, delivered overnight",
      c1: "#13203d",
      c2: "#7fe3ff",
      url: Xo,
    },
    market: { name: "List on YourBrand", brand: "YourBrand", url: Xo },
    presented: { name: "YourBrand", url: Xo },
  },
  we = Vs.get("sponsor") === "demo" ? Rd : Cl,
  sa = [
    "Garage Labs",
    "Basement AI",
    "Tensor & Sons",
    "Halcyon Compute",
    "Driveway Intelligence",
    "Box Fan AI",
    "Cul-de-sac Labs",
    "Midnight Tensors",
    "Spare Room Systems",
    "Backyard Superintelligence",
    "Laundry Room AI",
    "Extension Cord AI",
  ],
  Rr = "sael-gigawatt-v1",
  po = (e = 0) => ({
    v: 1,
    lab: sa[Math.floor(Be() * sa.length)],
    cash: 60,
    gen: 0,
    train: 0,
    since: 0,
    hype: 0,
    viral: 0,
    lvl: 0,
    cells: new Uint8Array(fe),
    plants: { outlet: 1 },
    res: {},
    earned: 0,
    servedTok: 0,
    played: 0,
    start: Date.now(),
    last: Date.now(),
    launches: [],
    ng: e,
    agi: 0,
    best: null,
    done: !1,
    seen: {},
    miles: {},
    tut: 0,
    named: !1,
    heatwave: 0,
    bill: 0,
    billT: 0,
    sites: [],
    trucks: [],
    tid: 0,
    proj: [],
    down: [],
    staff: { books: 0, curb: 0, fix: 0, build: 0, crews: 0 },
    stats: {
      deliveries: 0,
      virals: 0,
      heatOk: 0,
      hwBad: !1,
      shares: 0,
      missions: 0,
      streak: 0,
      bestStreak: 0,
      bills: 0,
      myBills: 0,
      unbilled: 0,
      built: 0,
      missed: 0,
      onTime: 0,
      bestOnTime: 0,
      rushed: 0,
      nights: 0,
      downs: 0,
      fixed: 0,
    },
    missions: [],
    mseq: 0,
  });
let s = po();
const Z = (e, t) => t * B + e,
  U = () => _[s.lvl][0],
  W = () => _[s.lvl][1];
function aa() {
  ((s.cells[Z(1, 1)] = K.pc.ix), (s.cells[Z(2, 1)] = K.fan.ix));
}
function $l() {
  let e = "";
  for (let t = 0; t < fe; t++) e += s.cells[t].toString(36);
  return e;
}
function De() {
  s.last = Date.now();
  try {
    localStorage.setItem(Rr, JSON.stringify({ ...s, cells: $l() }));
  } catch {}
}
function Tl(e) {
  if (e == null)
    try {
      e = localStorage.getItem(Rr);
    } catch {}
  if (!e) return !1;
  try {
    const t = JSON.parse(e);
    if (!t || t.v !== 1) return !1;
    const o = new Uint8Array(fe);
    for (let n = 0; n < fe && n < (t.cells || "").length; n++) {
      const a = parseInt(t.cells[n], 36);
      o[n] = a > 0 && a < P.length ? a : 0;
    }
    ((s = { ...po(t.ng || 0), ...t, cells: o }),
      (s.stats = { ...po().stats, ...(t.stats || {}) }),
      (s.missions = Array.isArray(t.missions) ? t.missions : []),
      (s.staff = { ...po().staff, ...(t.staff || {}) }));
    for (const n of ["trucks", "sites", "proj", "down"])
      Array.isArray(s[n]) || (s[n] = []);
    (s.bill >= 0 || (s.bill = 0),
      (s.trucks = s.trucks.filter(
        (n) => n && n.id > 0 && ["load", "road", "curb"].includes(n.st),
      )),
      (s.sites = s.sites.filter(
        (n) => n && P[n.ix] && n.k >= 0 && n.k < fe && n.T > 0,
      )));
    for (const n of s.sites)
      n.tr &&
        !s.trucks.some((a) => a.id === n.tr) &&
        ((n.tr = 0), (s.cells[n.k] = 0));
    return (
      (s.proj = s.proj.filter(
        (n) => n && (n.kind === "floor" ? _[n.n] : ft[n.id]) && n.T > 0,
      )),
      s.seen || (s.seen = {}),
      t.sites == null && s.played > 20 && (s.seen.tourHello = 1),
      !s.seen.tourDone &&
        (s.ng || s.gen > 0 || s.mseq > Pt.length) &&
        (s.seen.tourDone = 1),
      !0
    );
  } catch {
    return !1;
  }
}
let de = {};
function Ao() {
  const e = {
    tps: 1,
    cool: 1,
    price: 1,
    demand: 1,
    train: 1,
    hype: 1,
    reserve: 0.1,
    draw: 1,
    plant: 1,
    power: 1,
  };
  for (const o in s.res) {
    const n = Tr[o];
    if (n)
      for (const [a, r] of Object.entries(n.fx))
        a === "reserve" ? (e.reserve = Math.max(e.reserve, r)) : (e[a] *= r);
  }
  const t = 1 + 0.5 * s.ng;
  ((e.tps *= t),
    (e.price *= 1 + 0.25 * s.ng),
    s.heatwave > 0 && (e.cool *= 0.75),
    (e.hw = s.heatwave > 0),
    (de = e));
}
const Pr = (e) => s.proj.filter((t) => t.kind === "plant" && t.id === e).length,
  Vn = (e) => (s.plants[e] || 0) + Pr(e),
  Bt = (e) => Math.round(e.cost * de.plant * (1 + 0.18 * Vn(e.id))),
  nn = () =>
    Jt.reduce((e, t) => e + (s.plants[t.id] || 0) * t.kw, 0) * de.power,
  Pd = new Float32Array(fe),
  Ed = new Float32Array(fe),
  It = new Float32Array(fe),
  Dd = new Float32Array(fe),
  Lo = new Float32Array(fe),
  eo = new Uint8Array(fe),
  Al = new Float32Array(fe),
  Ll = new Float32Array(fe),
  Rl = new Float32Array(fe),
  Er = new Float32Array(fe),
  Gd = new Float32Array(fe),
  m = {
    tpsBase: 0,
    heat: 0,
    coolDraw: 0,
    gpus: 0,
    racks: 0,
    coolers: 0,
    starved: 0,
    starvedCls: -1,
    wrongCls: 0,
    draw: 0,
    cap: 0,
    brown: 1,
    C: 0,
    D: 0,
    served: 0,
    rev: 0,
    trainRate: 0,
    util: 1,
    dirty: !0,
  },
  ra = { starved: 0, racks: 0 };
function Pl(e, t, o, n, a, r, i) {
  const l = U(),
    f = W(),
    u = de;
  (t.fill(0), o.fill(0), n.fill(1), a.fill(0), r.fill(0));
  let g = 0,
    d = 0,
    p = 0,
    h = 0,
    w = 0;
  for (let I = 0; I < f; I++)
    for (let q = 0; q < l; q++) {
      const H = Z(q, I),
        T = P[e[H]];
      T &&
        (T.kind === "rack"
          ? ((t[H] = T.kw), (d += T.kw), (p += T.gpus), h++)
          : ((a[H] = T.kw * u.cool), w++));
    }
  const x = [];
  for (let I = 0; I < 3; I++)
    for (let q = 0; q < f; q++)
      for (let H = 0; H < l; H++) {
        const T = Z(H, q);
        if (a[T] <= 1e-9) continue;
        const E = P[e[T]],
          j = E.range;
        x.length = 0;
        let ie = 0;
        for (let Re = -j; Re <= j; Re++)
          for (let co = -j; co <= j; co++) {
            if (!co && !Re) continue;
            const To = H + co,
              fr = q + Re;
            if (To < 0 || fr < 0 || To >= l || fr >= f) continue;
            const _s = Z(To, fr),
              dr = P[e[_s]];
            if (!dr || dr.kind !== "rack" || dr.cls > E.cls) continue;
            const qi = t[_s] - o[_s];
            qi > 1e-9 && (x.push(_s), (ie += qi));
          }
        if (!ie) continue;
        const J = Math.min(a[T], ie);
        for (const Re of x) o[Re] += ((t[Re] - o[Re]) / ie) * J;
        ((a[T] -= J), (r[T] += J));
      }
  let y = 0,
    v = -1,
    S = 0,
    F = 0;
  for (let I = 0; I < f; I++)
    for (let q = 0; q < l; q++) {
      const H = Z(q, I),
        T = P[e[H]];
      if (T)
        if (T.kind === "rack") {
          if (
            ((n[H] = A(o[H] / t[H], 0, 1)),
            (i && i[H]) || (g += T.tps * (0.25 + 0.75 * n[H])),
            n[H] < 0.98)
          ) {
            (y++, (v = Math.max(v, T.cls)));
            let E = !1,
              j = !1;
            for (let ie = -2; ie <= 2; ie++)
              for (let J = -2; J <= 2; J++) {
                const Re = q + J,
                  co = I + ie;
                if (Re < 0 || co < 0 || Re >= l || co >= f) continue;
                const To = P[e[Z(Re, co)]];
                To?.kind === "cool" &&
                  Math.max(Math.abs(J), Math.abs(ie)) <= To.range &&
                  ((E = !0), To.cls >= T.cls && (j = !0));
              }
            E && !j && S++;
          }
        } else F += r[H] * T.draw * de.draw;
    }
  return {
    tps: g,
    heat: d,
    gpus: p,
    racks: h,
    coolers: w,
    starved: y,
    starvedCls: v,
    wrong: S,
    coolDraw: F,
  };
}
function Ne() {
  Hd();
  const e = Pl(s.cells, Pd, Ed, It, Dd, Lo, st);
  (Object.assign(m, {
    tpsBase: e.tps * de.tps,
    heat: e.heat,
    coolDraw: e.coolDraw,
    gpus: e.gpus,
    racks: e.racks,
    coolers: e.coolers,
    starved: e.starved,
    starvedCls: e.starvedCls,
    wrongCls: e.wrong,
    dirty: !1,
  }),
    Bd(),
    (He = !0));
}
function Bd() {
  eo.set(s.cells);
  for (const t of s.sites) eo[t.k] = t.ix;
  const e = Pl(eo, Al, Ll, Rl, Er, Gd);
  ((ra.starved = e.starved), (ra.racks = e.racks));
}
const Id = (e) => 0.5 + 0.5 * (1 - Math.exp(-e / 70));
function Od(e) {
  const t = ee[s.gen],
    o = de;
  ((s.hype *= Math.exp(-e / 30)),
    (s.viral *= Math.exp(-e / 14)),
    (m.draw = m.heat + m.coolDraw),
    (m.cap = nn()),
    (m.brown = m.draw > 0 ? Math.min(1, m.cap / m.draw) : 1),
    (m.C = m.tpsBase * m.brown),
    (m.D = t.D * o.demand * (Id(s.since) + s.hype + s.viral)),
    (m.served = Math.min(m.D, m.C * (1 - o.reserve))),
    (m.rev = m.served * t.p * o.price),
    (m.trainRate = s.gen < Me && !Un() ? m.C - m.served : 0));
  const n = m.rev * e;
  if (s.staff.books === 2) ((s.cash += n), (s.earned += n));
  else {
    const a = Math.min(n, Math.max(0, sn() - s.bill));
    (s.bill < 0.01 && a > 0 && (s.billT = s.played),
      (s.bill += a),
      (s.stats.unbilled += n - a));
  }
  ((s.servedTok += m.served * e), (s.since += e));
  {
    const a = s.stats;
    (m.D > 0 && m.served >= m.D * 0.97 ? (a.streak += e) : (a.streak = 0),
      a.streak > a.bestStreak && (a.bestStreak = a.streak));
  }
  if (
    (s.gen < Me && (s.train = Math.min(dt(), s.train + m.trainRate * e)),
    s.heatwave > 0 && (s.heatwave = Math.max(0, s.heatwave - e)),
    Ud(e),
    Dr(e),
    Wd(e),
    !Se)
  ) {
    const a = Fd();
    a && (s.cash = Math.max(0, s.cash - a * e));
  }
}
const dt = () => ee[s.gen].TN * de.train,
  vt = () => s.gen < Me && s.train >= dt() - 1e-6;
let Se = !1;
const sn = () => Math.max(kd * m.rev, 25),
  Ro = () => s.staff.books !== 2 && s.bill >= sn() * 0.98,
  nt = () =>
    2 +
    s.lvl +
    (s.staff.crews || 0) +
    (s.staff.build ? 4 + Math.floor((m.racks + m.coolers) / 8) : 0),
  ue = () => (s.staff.build ? 2 : 1),
  Fd = () =>
    (s.staff.books === 1 ? ne.books.wage : 0) +
    (s.staff.curb === 1 ? ne.curb.wage : 0) +
    (s.staff.fix === 1 ? ne.fix.wage : 0),
  El = () => Cd * (s.gen >= ne.curb.gen ? 3 : 1),
  Ot = (e) => s.sites.filter((t) => t.tr === e.id),
  an = () => s.trucks.filter((e) => e.st === "curb"),
  Ft = () => s.sites.filter((e) => !e.tr);
function _d() {
  let e = s.trucks.find((t) => t.st === "load");
  return (
    e ||
      ((e = { id: ++s.tid, st: "load", t: 0, wait: 0, miss: 0 }),
      s.trucks.push(e)),
    e
  );
}
function Ud(e) {
  let t = null,
    o = 0;
  for (const n of s.trucks)
    ((n.t += e),
      n.st === "load" && n.t >= xl
        ? ((n.st = "road"), (n.t = 0))
        : n.st === "road" && n.t >= on
          ? ((n.st = "curb"), (n.t = 0), (n.wait = 0), o++)
          : n.st === "curb" &&
            ((!Se || s.staff.curb === 2) && (n.wait += e),
            n.wait > Ar && (t || (t = [])).push(n)));
  if (
    (s.trucks.length &&
      (s.trucks = s.trucks.filter((n) => (Ot(n).length ? !0 : (vi(n.id), !1)))),
    t)
  )
    for (const n of t) Vd(n);
  o && !Se && M0();
}
function Vd(e) {
  const t = Ot(e);
  if (((s.trucks = s.trucks.filter((a) => a !== e)), vi(e.id), !t.length))
    return;
  const o = Math.min(
    s.cash,
    Math.max(10, Math.round(t.reduce((a, r) => a + r.paid, 0) * Sd)),
  );
  s.cash -= o;
  const n = {
    id: ++s.tid,
    st: "road",
    t: -Md,
    wait: 0,
    miss: (e.miss || 0) + 1,
  };
  s.trucks.push(n);
  for (const a of t) a.tr = n.id;
  (s.stats.missed++, (s.stats.onTime = 0), Se || S0(t.length, o));
}
function go(e = "you", t = 0) {
  const o = s.trucks.filter((a) => a.st === "curb" && a.wait >= t);
  if (!o.length) return 0;
  let n = 0;
  for (const a of o) {
    const r = Ot(a);
    for (const i of r)
      ((i.tr = 0), i.was && ((s.cells[i.k] = 0), (mo[i.k] = -99)), v0(i, a));
    ((n += r.length),
      (s.trucks = s.trucks.filter((i) => i !== a)),
      vi(a.id, !0),
      s.stats.deliveries++,
      a.miss ||
        (s.stats.onTime++,
        (s.stats.bestOnTime = Math.max(s.stats.bestOnTime, s.stats.onTime))));
  }
  return (
    (m.dirty = !0),
    (oo = !0),
    (He = !0),
    e === "auto" &&
      Se &&
      (s.stats.nightSigned = (s.stats.nightSigned || 0) + o.length),
    Se || C0(o.length, n, e),
    o.length
  );
}
function _t(e = "you") {
  const t = s.bill;
  return t >= 0.01
    ? ((s.cash += t),
      (s.earned += t),
      (s.bill = 0),
      (s.billT = s.played),
      s.stats.bills++,
      e === "you" && s.stats.myBills++,
      Se || $0(t, e),
      t)
    : 0;
}
function Dr(e) {
  const t = nt(),
    o = ue() * e;
  let n = 0,
    a = null;
  for (const r of s.sites)
    if (!r.tr) {
      if (n++ >= t) break;
      ((r.left -= o), r.left <= 0 && (a || (a = [])).push(r));
    }
  if (a) for (const r of a) ia(r);
  if (s.proj.length) {
    for (const i of s.proj) i.left -= e * ue();
    const r = s.proj.filter((i) => i.left <= 0);
    if (r.length) {
      s.proj = s.proj.filter((i) => i.left > 0);
      for (const i of r) jd(i);
    }
  }
}
function ia(e) {
  ((s.sites = s.sites.filter((t) => t !== e)),
    (he[e.k] = 0),
    (s.cells[e.k] = e.ix),
    (mo[e.k] = L),
    (m.dirty = !0),
    (He = !0),
    (oo = !0),
    s.stats.built++,
    yl(P[e.ix]) && (s.seen.freight = 1),
    Se || T0(e.k));
}
function jd(e) {
  if (e.kind === "floor") {
    Hu();
    return;
  }
  if (((s.plants[e.id] = (s.plants[e.id] || 0) + 1), ti(), (Ae = !0), !Se)) {
    const t = ft[e.id];
    (R.big(),
      be(t.name, `You can now draw ${N(nn())}.`, "a", null, {
        icon: "bolt",
        kick: "Power online",
        big: "+" + N(t.kw * de.power),
      }));
  }
}
const st = new Uint8Array(fe),
  Nd = () => Rt() && !s.done;
function Hd() {
  ((s.down = (s.down || []).filter(
    (e) => e && P[s.cells[e.k]]?.kind === "rack",
  )),
    st.fill(0));
  for (const e of s.down) st[e.k] = 1;
}
function Wd(e) {
  if (!Nd()) return;
  const t = e / Lr,
    o = U(),
    n = W();
  let a = 0;
  for (let r = 0; r < n; r++)
    for (let i = 0; i < o; i++) {
      const l = Z(i, r);
      st[l] ||
        P[s.cells[l]]?.kind !== "rack" ||
        Be() >= t ||
        (s.down.push({ k: l, t: s.played }), (st[l] = 1), a++);
    }
  a &&
    ((s.stats.downs += a),
    (m.dirty = !0),
    (He = !0),
    !Se &&
      (R.down?.(),
      !s.seen.down &&
        s.staff.fix !== 2 &&
        ((s.seen.down = 1),
        be(
          "A rack went down",
          "It serves and trains nothing until someone brings it back: click it, the bubble over it, or press Enter. An engineer (Staff) can do it for you.",
          "r",
          ["Fix it", () => Po("you")],
          { icon: "wrench", kick: "Rack down", life: 9 },
        ))));
}
function zd(e, t = "you") {
  const o = s.down.findIndex((n) => n.k === e);
  return o < 0
    ? !1
    : (s.down.splice(o, 1),
      (st[e] = 0),
      s.stats.fixed++,
      (m.dirty = !0),
      (He = !0),
      Se || (t === "you" && R.fix?.(), vn(e, "Back up", "c")),
      !0);
}
function Po(e = "you", t = 0) {
  const o = s.down.filter((n) => s.played - n.t >= t);
  if (!o.length) return 0;
  for (const n of o) st[n.k] = 0;
  if (
    ((s.down = s.down.filter((n) => st[n.k])),
    (s.stats.fixed += o.length),
    (m.dirty = !0),
    (He = !0),
    !Se && (e === "you" && R.fix?.(), o.length <= 6))
  )
    for (const n of o) vn(n.k, "Back up", "c");
  return o.length;
}
function qd() {
  const e = s.staff.books,
    t = s.staff.curb,
    o = s.staff.fix;
  (s.down.length &&
    (o === 2 || (o === 1 && !Se)) &&
    Po(o === 2 ? "auto" : "help", o === 2 ? 0 : oa),
    e === 1 &&
      !Se &&
      s.bill >= 0.01 &&
      (s.bill >= sn() * 0.4 || s.played - s.billT > 8) &&
      _t("help"),
    (t === 2 || (t === 1 && !Se)) &&
      s.trucks.some((n) => n.st === "curb") &&
      go(t === 2 ? "auto" : "help", t === 2 ? 0 : 3));
}
function Dl(e) {
  for (; e > 1e-9;) {
    const t = Math.min(e, 1);
    ((s.played += t), Od(t), qd(), m.dirty && Ne(), (e -= t));
  }
}
function Gr(e) {
  const t = Math.min(e, El());
  if (!(t > 0)) return null;
  const o = {
    bill: s.bill,
    cash: s.cash,
    earned: s.earned,
    deliv: s.stats.deliveries,
    built: s.stats.built,
    fixed: s.stats.fixed,
    lvl: s.lvl,
    gen: s.gen,
    f0: s.gen < Me ? s.train / dt() : 1,
    rd: vt(),
    cap: nn(),
    unbilled: s.stats.unbilled,
  };
  Se = !0;
  try {
    Dl(t);
  } finally {
    Se = !1;
  }
  return { ...o, t, cut: e > t + 0.5 };
}
const Ut = 4.6,
  yt = 8.8,
  Gl = (e, t) => {
    const o = new c.MeshBasicMaterial({
      color: new c.Color(e).multiplyScalar(t),
      fog: !1,
    });
    return (Ie.lamps.push([o, o.color.clone()]), o);
  },
  jn = {
    uSun: { value: new c.Vector3(0.72, 0.08, -0.55).normalize() },
    uTime: { value: 0 },
    uDay: { value: 0 },
    uWarm: { value: 0 },
  },
  Nn = new c.Mesh(
    new c.SphereGeometry(900, 48, 24),
    new c.ShaderMaterial({
      side: c.BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: jn,
      vertexShader:
        "varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: `varying vec3 vD;uniform vec3 uSun;uniform float uTime;uniform float uDay;uniform float uWarm;
 float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
 void main(){vec3 d=normalize(vD);float y=d.y;
  vec3 c=mix(vec3(.30,.27,.36),vec3(.17,.21,.36),smoothstep(0.,.18,y));c=mix(c,vec3(.05,.08,.17),smoothstep(.15,.7,y));
  float s=max(dot(normalize(vec3(d.x,0.,d.z)),normalize(vec3(uSun.x,1e-4,uSun.z))),0.);
  c+=vec3(1.05,.48,.2)*pow(s,5.)*(1.-smoothstep(0.,.3,y))*.9+vec3(.5,.22,.18)*pow(s,2.)*(1.-smoothstep(0.,.45,y))*.35;
  c+=vec3(1.4,.8,.45)*pow(max(dot(d,uSun),0.),400.)*1.5;
  if(y<0.)c=mix(c,vec3(.06,.06,.08),smoothstep(0.,-.08,y));
  vec2 g=vec2(atan(d.z,d.x)*80.,y*160.);vec2 id=floor(g);float st=h21(id);float tw=.6+.4*sin(uTime*1.3+st*40.);
  c+=vec3(.9,.95,1.)*step(.996,st)*smoothstep(.12,.5,y)*(1.-smoothstep(.04,.18,length(fract(g)-.5)))*tw*.9;
  // the day: a pale horizon under a clear blue, a soft glow round the sun, warmer and lower at either end of the day
  vec3 dc=mix(vec3(.62,.70,.76),vec3(.50,.64,.80),smoothstep(0.,.12,y));dc=mix(dc,vec3(.27,.45,.72),smoothstep(.12,.8,y));
  float sd=max(dot(d,uSun),0.);dc+=vec3(1.,.92,.78)*(pow(sd,8.)*.22+pow(sd,900.)*4.);
  dc=mix(dc,dc*vec3(1.18,.92,.76)+vec3(.55,.24,.06)*pow(s,4.)*(1.-smoothstep(0.,.4,y)),uWarm);
  if(y<0.)dc=mix(dc,vec3(.42,.47,.44),smoothstep(0.,-.1,y));
  gl_FragColor=vec4(mix(c,dc,uDay),1.);}`,
    }),
  );
((Nn.renderOrder = -10), (Nn.frustumCulled = !1), Pe.add(Nn), bt.push(Nn));
const la = tn(512, 512, (e, t, o) => {
  ((e.fillStyle = "#2f3b2c"), e.fillRect(0, 0, t, o));
  const n = Et(4);
  for (let a = 0; a < 2600; a++) {
    const r = n();
    ((e.fillStyle = `hsla(${78 + r * 40},${18 + n() * 14}%,${16 + n() * 14}%,.5)`),
      e.fillRect(n() * t, n() * o, 2 + n() * 5, 1 + n() * 3));
  }
});
((la.wrapS = la.wrapT = c.RepeatWrapping), la.repeat.set(220, 220));
const Hn = new c.Mesh(
  new c.PlaneGeometry(2200, 2200),
  Xt(
    new c.MeshStandardMaterial({
      map: la,
      roughness: 0.96,
      envMapIntensity: 0.25,
    }),
  ),
);
((Hn.rotation.x = -Math.PI / 2),
  (Hn.position.y = -0.02),
  (Hn.receiveShadow = !0),
  Ee.add(Hn),
  (Ie.ground = Hn.material));
const Bl = C("#26292f", { roughness: 0.82 }),
  Br = C("#7d7a73", { roughness: 0.9 }),
  Ir = C("#8e8a82", { roughness: 0.8 }),
  Yd = C("#cdb878", { roughness: 0.6 });
((Ie.asph = Bl), En(Br, "#aeaba3"), En(Ir, "#c6c2ba"));
{
  const e = oe(),
    t = 900,
    o = -300;
  e.box(Bl, o + t / 2, 0.005, (Ut + yt) / 2, t, 0.03, yt - Ut);
  for (let i = o; i < o + t; i += 4)
    e.box(Yd, i + 1, 0.025, (Ut + yt) / 2, 2, 0.01, 0.12);
  (e
    .box(Ir, o + t / 2, 0.06, Ut - 0.06, t, 0.12, 0.12)
    .box(Ir, o + t / 2, 0.06, yt + 0.06, t, 0.12, 0.12),
    e
      .box(Br, o + t / 2, 0.03, Ut - 0.7, t, 0.06, 1.2)
      .box(Br, o + t / 2, 0.03, yt + 0.75, t, 0.06, 1.3),
    e.flush(Ee));
  const n = oe(),
    a = C("#3a3f48", { roughness: 0.5, metalness: 0.4 }),
    r = Gl("#ffd29a", 3.2);
  for (let i = -118; i <= 150; i += 14) {
    n.cyl(a, i, 2.1, yt + 1, 0.06, 0.08, 4.2, { seg: 8 }).box(
      a,
      i,
      4.15,
      yt + 0.45,
      0.08,
      0.08,
      1.2,
    );
    const l = new c.Mesh(new c.BoxGeometry(0.42, 0.08, 0.22), r);
    (l.position.set(i, 4.08, yt - 0.1),
      Ee.add(l),
      Ws(i, 3.6, yt - 0.4, "#ffc884", 7, 1.1));
  }
  n.flush(Ee);
}
const Il = ["#3f6232", "#4b6e39", "#577a40", "#365a2f"].map((e) =>
    C(e, { flatShading: !0, roughness: 0.85 }),
  ),
  Ol = C("#4a3527", { roughness: 0.9 }),
  Kd = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
    C(e, { flatShading: !0, roughness: 0.85 }),
  );
function ca(e, t, o, n, a) {
  const r = Et(a);
  e.cyl(Ol, t, 0.5 * n, o, 0.07 * n, 0.11 * n, 1 * n, { seg: 6 });
  for (let i = 0; i < 4; i++)
    e.geo(
      Il[(i + a) % 4],
      dl(0.5 * n * (0.75 + r() * 0.5), 0.32, a * 7 + i),
      t + (r() - 0.5) * 0.6 * n,
      (1.25 + r() * 0.7) * n,
      o + (r() - 0.5) * 0.6 * n,
    );
}
function Xd(e, t, o, n, a) {
  const r = Et(a * 97 + 13);
  e.cyl(Ol, t, 0.15 * n, o, 0.05 * n, 0.07 * n, 0.3 * n, { seg: 5 });
  for (let i = 0; i < 3; i++) {
    const l = (0.42 - i * 0.1) * n * (0.9 + r() * 0.2);
    e.cone(Kd[(i + a) % 3], t, (0.22 + i * 0.3) * n, o, l, 0.55 * n, {
      seg: 6 + (a % 2),
      ry: r() * 3,
    });
  }
}
const Zd = (e, t) =>
  (e > -12 && e < B + 16 && t < yt + 3 && t > -bl - 70) ||
  (t > Ut - 2.2 && t < yt + 2.6);
{
  const e = oe(),
    t = Et(77);
  let o = 0;
  for (let n = 0; n < 2600 && o < 520; n++) {
    const a = t() * Math.PI * 2,
      r = 14 + Math.pow(t(), 0.8) * 210,
      i = 12 + Math.cos(a) * r * 1.25,
      l = -10 + Math.sin(a) * r;
    if (Zd(i, l)) continue;
    const f = 1.4 + t() * 1.6;
    (t() < 0.45 ? Xd(e, i, l, f * 1.6, o) : ca(e, i, l, f, o), o++);
  }
  for (let n = 0; n < 5; n++)
    ca(e, -13.5 + n * 1.9, -9.5 - t() * 1.5, 1.5 + t() * 0.6, 200 + n);
  (ca(e, -11.8, 1.8, 1.4, 301), ca(e, -14.5, -2.5, 1.7, 302), e.flush(Ee));
}
const Fl = C("#5d5a72", { flatShading: !0, roughness: 0.85 }),
  _l = C("#4b4a60", { flatShading: !0, roughness: 0.85 });
Ie.rock = [Fl, _l];
{
  const e = oe(),
    t = Et(12);
  for (let o = 0; o < 46; o++) {
    const n = (o / 46) * Math.PI * 2 + t() * 0.1,
      a = 520 + t() * 160,
      r = 40 + t() * 90,
      i = 60 + t() * 70,
      l = new c.ConeGeometry(i, r, 7, 3).translate(0, r / 2 - 4, 0),
      f = l.attributes.position;
    for (let u = 0; u < f.count; u++) {
      const g = f.getY(u);
      g > -3 &&
        g < r - 5 &&
        (f.setX(u, f.getX(u) * (1 + (t() - 0.5) * 0.4)),
        f.setZ(u, f.getZ(u) * (1 + (t() - 0.5) * 0.4)));
    }
    (l.computeVertexNormals(),
      e.geo(
        o % 2 ? Fl : _l,
        l,
        12 + Math.cos(n) * a,
        0,
        -10 + Math.sin(n) * a,
        { ry: t() * 3 },
      ));
  }
  e.flush(Ee, !1);
}
const fa = { x: 330, z: -150 };
{
  const e = tn(256, 512, (r, i, l) => {
    ((r.fillStyle = "#0b0f18"), r.fillRect(0, 0, i, l));
    const f = Et(31);
    for (let u = 6; u < l; u += 12)
      for (let g = 6; g < i; g += 10) {
        const d = f();
        d < 0.42 &&
          ((r.fillStyle =
            d < 0.08 ? "#bfe6ff" : d < 0.3 ? "#ffd59a" : "#ffb870"),
          r.fillRect(g, u, 6, 7));
      }
  });
  e.wrapS = e.wrapT = c.RepeatWrapping;
  const t = new c.MeshBasicMaterial({
    map: e,
    color: new c.Color(1.9, 1.8, 1.7),
  });
  Ie.city = t;
  const o = oe(),
    n = Et(5);
  for (let r = 0; r < 70; r++) {
    const i = fa.x + (n() - 0.5) * 150,
      l = fa.z + (n() - 0.5) * 110,
      f = 6 + n() * 10,
      u = 14 + Math.pow(n(), 2.2) * 90,
      g = new c.BoxGeometry(f, u, f * (0.8 + n() * 0.5)),
      d = g.attributes.uv;
    for (let p = 0; p < d.count; p++)
      d.setXY(p, (d.getX(p) * f) / 12, (d.getY(p) * u) / 24);
    o.geo(t, g, i, u / 2, l);
  }
  o.flush(Ee, !1);
  const a = new c.Mesh(new c.PlaneGeometry(320, 90), gd("#ffb27a", 0.16));
  (a.position.set(fa.x, 30, fa.z - 40),
    a.lookAt(0, 30, 0),
    Ee.add(a),
    bt.push(a),
    (Ie.cityGlow = a.material));
}
const Eo = new c.Group();
Ee.add(Eo);
const Ul = C("#d8cfbd", { roughness: 0.8 }),
  Vl = C("#4a4e57", { roughness: 0.7 }),
  Wn = C("#efebe3", { roughness: 0.6 }),
  Qd = C("#4c5d6e", { roughness: 0.5 }),
  jl = new c.MeshBasicMaterial({ color: new c.Color(1.55, 1.18, 0.72) }),
  Jd = C("#7a5446", { roughness: 0.9 });
Ie.win = jl;
{
  const e = oe(),
    t = -8.6,
    o = -2.4,
    n = -6.2,
    a = -1,
    r = 2.5,
    i = (t + o) / 2,
    l = (n + a) / 2;
  (e.box(C("#6f6a62"), i, 0.15, l, o - t + 0.3, 0.3, a - n + 0.3),
    e.box(Ul, i, 0.3 + r / 2, l, o - t, r, a - n));
  for (let v = 0.55; v < r; v += 0.24)
    e.box(
      C("#cbc2b0", { roughness: 0.8 }),
      i,
      0.3 + v,
      a + 0.006,
      o - t,
      0.03,
      0.012,
    );
  const f = (a - n) / 2 + 0.35,
    u = 1.7,
    g = Math.hypot(f, u),
    d = Math.atan2(u, f);
  e.box(Vl, i, 0.3 + r + u / 2, l + f / 2 - 0.17, o - t + 0.5, 0.14, g, {
    rx: d,
  }).box(Vl, i, 0.3 + r + u / 2, l - f / 2 + 0.17, o - t + 0.5, 0.14, g, {
    rx: -d,
  });
  const p = new c.Shape(
    [
      [-f + 0.35, 0],
      [f - 0.35, 0],
      [0, u - 0.05],
    ].map((v) => new c.Vector2(...v)),
  );
  for (const v of [t + 0.02, o - 0.02]) {
    const S = new c.ExtrudeGeometry(p, { depth: 0.04, bevelEnabled: !1 });
    (S.rotateY(Math.PI / 2), e.geo(Ul, S, v - 0.02, 0.3 + r, l));
  }
  e.box(Jd, t + 1.2, 0.3 + r + 1.4, l - 1.2, 0.7, 1.6, 0.7);
  for (const v of [t + 1.2, o - 1])
    (e.box(Wn, v, 1.75, a + 0.03, 1.1, 1.05, 0.06),
      e.geo(jl, new c.BoxGeometry(0.9, 0.85, 0.02), v, 1.75, a + 0.07),
      e
        .box(Wn, v, 1.75, a + 0.085, 0.05, 0.85, 0.02)
        .box(Wn, v, 1.75, a + 0.085, 0.9, 0.05, 0.02));
  (e
    .box(Wn, o - 2.6, 1.3, a + 0.03, 1, 2.05, 0.06)
    .box(Qd, o - 2.6, 1.28, a + 0.07, 0.82, 1.9, 0.04)
    .box(dd, o - 2.3, 1.25, a + 0.1, 0.05, 0.05, 0.05),
    e.box(C("#8f8a80"), o - 2.6, 0.2, a + 0.6, 1.6, 0.12, 1.1),
    e.box(Wn, o - 2.6, 2.55, a + 0.12, 0.25, 0.18, 0.12),
    e.flush(Eo));
  const h = new c.Mesh(new c.SphereGeometry(0.07, 10, 8), Gl("#ffd9a0", 4));
  (h.position.set(o - 2.6, 2.5, a + 0.24),
    Eo.add(h),
    Ws(o - 2.6, 2.2, a + 0.9, "#ffcf8a", 4, 1.2));
  for (const v of [t + 1.2, o - 1]) Ws(v, 1.7, a + 1.2, "#ffcf8a", 3, 0.5);
  const w = new c.Mesh(
    new c.BoxGeometry(1.5, 0.03, 0.62),
    C("#2e261e", { roughness: 1 }),
  );
  (w.position.set(o - 2.6, 0.27, a + 0.62), Eo.add(w));
  const x = Fn(
    1.2,
    0.36,
    512,
    154,
    (v, S, F) => {
      ((v.font = "600 70px Outfit, sans-serif"),
        (v.letterSpacing = "10px"),
        (v.textAlign = "center"),
        (v.textBaseline = "middle"),
        (v.fillStyle = "#b99a6a"),
        v.fillText("WELCOME", S / 2, F / 2 + 4));
    },
    0.7,
  );
  ((x.rotation.x = -Math.PI / 2),
    x.position.set(o - 2.6, 0.29, a + 0.62),
    Eo.add(x));
  {
    const v = oe();
    v.box(
      C("#2f4a3a", { roughness: 0.6 }),
      o + 0.45,
      0.5,
      a - 1.2,
      0.55,
      0.95,
      0.55,
      { r: 0.04 },
    ).box(
      C("#3a4150", { roughness: 0.6 }),
      o + 0.45,
      0.5,
      a - 1.9,
      0.55,
      0.95,
      0.55,
      { r: 0.04 },
    );
    for (let S = 0; S < 9; S++)
      v.geo(
        Il[S % 4],
        dl(0.32 + ve(S) * 0.12, 0.3, 40 + S),
        t + 0.6 + S * 0.62,
        0.28,
        a + 0.55,
      );
    v.flush(Eo);
  }
  const y = oe();
  (y
    .cyl(C("#4a4f58"), o - 0.9, 0.55, 3.2, 0.04, 0.04, 1.1, { seg: 6 })
    .box(
      C("#2c3442", { roughness: 0.4, metalness: 0.3 }),
      o - 0.9,
      1.15,
      3.2,
      0.28,
      0.3,
      0.5,
      { r: 0.06 },
    )
    .box(Ze("#ff6b5a", 1), o - 0.74, 1.28, 3, 0.03, 0.14, 0.03),
    y.flush(Eo));
}
const Nl = (e) => {
    const t = [0];
    for (let o = 1; o < e.length; o++)
      t.push(t[o - 1] + e[o].distanceTo(e[o - 1]));
    return t;
  },
  X = { x: -1.2, z: 2 },
  zn = new c.Group();
Ee.add(zn);
const eu = En(C("#9b978f", { roughness: 0.85 }), "#b9b6ae");
{
  const e = oe();
  (e
    .box(eu, X.x, 0.62, X.z, 1.25, 1.24, 1.1, { r: 0.04 })
    .box(
      C("#4a4f58", { roughness: 0.5, metalness: 0.4 }),
      X.x + 0.18,
      0.55,
      X.z + 0.56,
      0.5,
      0.9,
      0.04,
    )
    .box(C("#8e8a82"), X.x, 1.27, X.z, 1.38, 0.07, 1.22)
    .cyl(fd, X.x - 0.4, 1.75, X.z - 0.3, 0.025, 0.025, 0.95, { seg: 6 })
    .box(C("#6d6a64"), X.x, 0.04, X.z, 1.7, 0.08, 1.5),
    e.flush(zn));
  const t = new c.Mesh(new c.BoxGeometry(0.06, 0.06, 0.02), Ze("#7fe3ff", 4));
  (t.position.set(X.x - 0.36, 1, X.z + 0.56), zn.add(t), (X.led = t));
}
const Or = Fn(1.05, 0.26, 512, 128, null, 1.1, { alphaTest: 0.05 });
(Or.position.set(X.x - 0.14, 1.12, X.z + 0.565), zn.add(Or));
function da() {
  Or.userData.redraw((e, t, o) => {
    const n = we.market,
      a = !!s.res.market;
    ((e.fillStyle = a ? "#0b0b10" : "#55524c"),
      en(e, 2, 2, t - 4, o - 4, 14),
      e.fill());
    const r =
      a && n.lockup ? ql({ id: "hut-" + n.brand, logo: n.lockup }, da) : null;
    if (r) {
      const l = 62 * n.logoAspect;
      e.drawImage(r, (t - l) / 2, (o - 62) / 2, l, 62);
      return;
    }
    ((e.fillStyle = a ? "#7fe3ff" : "#8c8880"),
      (e.font = "700 46px Outfit, sans-serif"),
      (e.textAlign = "center"),
      (e.textBaseline = "middle"),
      (e.letterSpacing = "4px"),
      e.fillText(
        a ? (n.brand || "TOKEN EXCHANGE").toUpperCase() : "FIBER",
        t / 2,
        o / 2 + 2,
      ));
  });
}
const qn = Ut - 1.45,
  tu = [],
  ua = 4.3;
{
  const e = oe(),
    t = C("#e07a2a", { roughness: 0.5 }),
    o = C("#e9e4da");
  e.box(C("#4b4945", { roughness: 0.95 }), 110, 0.012, qn, 240, 0.02, 0.16);
  for (let n = X.x + 6; n < 240; n += 9)
    (e
      .cyl(t, n, 0.35, qn - 0.12, 0.035, 0.035, 0.7, { seg: 6 })
      .box(o, n, 0.6, qn - 0.12, 0.075, 0.08, 0.075),
      tu.push(n));
  e.flush(Ee);
}
const rn = [];
{
  const e = [];
  for (let t = 240; t > X.x + 0.9; t -= 6) e.push(new c.Vector3(t, 0.09, qn));
  (e.push(
    new c.Vector3(X.x + 0.9, 0.09, qn),
    new c.Vector3(X.x + 0.4, 0.09, X.z + 0.2),
    new c.Vector3(X.x + 0.2, 0.5, X.z + 0.1),
  ),
    rn.push(...e),
    (rn.len = Nl(e)));
}
const ut = new c.Group();
Ee.add(ut);
const Vt = [];
let ln = [];
const ou = (e) => (e <= 1 ? "garage" : e <= 3 ? "shed" : "hall");
function Fr(e) {
  return tn(256, 256, (t, o, n) => {
    const a = Et(e.length * 7);
    if (e === "garage") {
      ((t.fillStyle = "#8f8b84"), t.fillRect(0, 0, o, n));
      for (let r = 0; r < 220; r++)
        ((t.fillStyle = `rgba(${a() > 0.5 ? 30 : 240},${a() > 0.5 ? 28 : 236},${a() > 0.5 ? 26 : 230},${0.03 + a() * 0.04})`),
          t.beginPath(),
          t.ellipse(
            a() * o,
            a() * n,
            3 + a() * 28,
            2 + a() * 10,
            a() * 3,
            0,
            7,
          ),
          t.fill());
      ((t.strokeStyle = "#6b6760"),
        (t.lineWidth = 2),
        t.strokeRect(1, 1, o - 2, n - 2));
    } else if (e === "shed") {
      ((t.fillStyle = "#7f8489"), t.fillRect(0, 0, o, n));
      for (let r = 0; r < 160; r++)
        ((t.fillStyle = `rgba(255,255,255,${0.02 + a() * 0.03})`),
          t.fillRect(a() * o, a() * n, 2 + a() * 20, 1 + a() * 3));
      ((t.strokeStyle = "#5f6469"),
        (t.lineWidth = 3),
        t.strokeRect(1.5, 1.5, o - 3, n - 3));
    } else {
      ((t.fillStyle = "#8f949b"),
        t.fillRect(0, 0, o, n),
        (t.fillStyle = "#858a91"),
        t.fillRect(10, 10, o - 20, n - 20),
        (t.strokeStyle = "#5d626a"),
        (t.lineWidth = 5),
        t.strokeRect(2.5, 2.5, o - 5, n - 5),
        (t.fillStyle = "#9ca1a8"));
      for (const [r, i] of [
        [24, 24],
        [o - 24, 24],
        [24, n - 24],
        [o - 24, n - 24],
      ])
        (t.beginPath(), t.arc(r, i, 5, 0, 7), t.fill());
    }
  });
}
const _r = { garage: Fr("garage"), shed: Fr("shed"), hall: Fr("hall") };
for (const e of Object.values(_r)) e.wrapS = e.wrapT = c.RepeatWrapping;
const Yn = Xt(
    new c.MeshStandardMaterial({
      map: _r.garage,
      roughness: 0.28,
      metalness: 0.05,
      envMapIntensity: 0.5,
    }),
    ed,
  ),
  cn = new c.Mesh(new c.PlaneGeometry(1, 1), Yn);
((cn.rotation.x = -Math.PI / 2),
  (cn.receiveShadow = !0),
  ut.add(cn),
  Dt.push(cn));
const nu = {
    garage: C("#cdbfa6", { roughness: 0.82 }),
    shed: Ge("#8c939b", { roughness: 0.45, metalness: 0.55, clearcoat: 0 }),
    hall: C("#d2d0cb", { roughness: 0.7 }),
  },
  su = {
    garage: C("#b9ab92", { roughness: 0.85 }),
    shed: C("#9aa0a6", { roughness: 0.6 }),
    hall: C("#3a4150", { roughness: 0.6 }),
  },
  au = C("#1c2029", { roughness: 0.7 }),
  ru = En(C("#7d7a74", { roughness: 0.85 }), "#bebbb3"),
  Hl = En(C("#5f5e5a", { roughness: 0.92 }), "#a3a199");
let ha = [];
function kt() {
  const e = s.lvl;
  return [2.3, 2.4, 2.9, 3.3, 3.8, 4.2, 4.6, 5][e];
}
function Wl() {
  for (const d of ha) (d.parent?.remove(d), d.geometry?.dispose());
  ((ha = []), (Vt.length = 0));
  for (const d of ln) {
    const p = Hs.indexOf(d);
    p >= 0 && Hs.splice(p, 1);
  }
  ln = [];
  const e = U(),
    t = W(),
    o = ou(s.lvl),
    n = kt();
  (cn.scale.set(e, t, 1),
    cn.position.set(e / 2, le, -t / 2),
    (Yn.map = _r[o]),
    Yn.map.repeat.set(e, t),
    (Yn.roughness = o === "hall" ? 0.22 : o === "shed" ? 0.3 : 0.34),
    (Yn.needsUpdate = !0));
  const a = oe();
  (a.box(ru, e / 2, -0.05, -t / 2, e + 0.5, 0.2, t + 0.5),
    a.box(Hl, e / 2 + 1, -0.005, -t / 2 + 0.5, e + 8, 0.03, t + 7),
    a.box(Hl, 1.9, 0.012, Ut / 2, 3.4, 0.036, Ut + 0.2),
    ha.push(...a.flush(ut)));
  const r = 0.18,
    i = nu[o],
    l = su[o];
  [
    { n: [0, 1], len: e, cx: e / 2, cz: r / 2, ry: 0 },
    { n: [1, 0], len: t, cx: e + r / 2, cz: -t / 2, ry: Math.PI / 2 },
    { n: [0, -1], len: e, cx: e / 2, cz: -t - r / 2, ry: 0 },
    { n: [-1, 0], len: t, cx: -r / 2, cz: -t / 2, ry: Math.PI / 2 },
  ].forEach((d, p) => {
    const h = new c.Group();
    (h.position.set(d.cx, le, d.cz),
      (h.rotation.y = d.ry),
      ut.add(h),
      ha.push(h));
    const w = new c.Group();
    h.add(w);
    const x = oe(),
      y = d.len + (p % 2 ? 0 : r * 2);
    x.box(i, 0, n / 2, 0, y, n, r);
    const v = p === 0 || p === 1 ? -1 : 1;
    if (
      (x.box(l, 0, n / 2, v * (r / 2 + 0.004), y - 0.02, n - 0.02, 0.01),
      x.box(
        o === "hall" ? Ge("#5b636e", { roughness: 0.4 }) : C("#e9e4da"),
        0,
        n + 0.03,
        0,
        y + 0.02,
        0.06,
        r + 0.04,
      ),
      o === "garage")
    )
      for (let I = 0.2; I < n; I += 0.22)
        x.box(
          C("#bfb197", { roughness: 0.85 }),
          0,
          I,
          -v * (r / 2 + 0.006),
          y,
          0.025,
          0.012,
        );
    else if (o === "shed") {
      for (let I = -y / 2 + 0.15; I < y / 2; I += 0.3)
        x.box(
          Ge("#7d848c", { roughness: 0.5, metalness: 0.5, clearcoat: 0 }),
          I,
          n / 2,
          -v * (r / 2 + 0.01),
          0.06,
          n - 0.06,
          0.03,
        );
      for (let I = -y / 2 + 1.5; I < y / 2 - 1; I += 3)
        x.geo(
          Ze("#9cc7ff", 0.9),
          new c.BoxGeometry(1.6, 0.36, 0.02),
          I,
          n - 0.42,
          -v * (r / 2 + 0.025),
        );
    } else {
      for (let I = -y / 2 + 2; I < y / 2 - 0.5; I += 2)
        x.box(
          C("#b9b7b1", { roughness: 0.7 }),
          I,
          n / 2,
          -v * (r / 2 + 0.004),
          0.04,
          n,
          0.012,
        );
      (x.box(C("#a6a49e"), 0, n * 0.62, -v * (r / 2 + 0.005), y, 0.04, 0.012),
        x.geo(
          Ze("#7fe3ff", 2.2),
          new c.BoxGeometry(y - 0.4, 0.035, 0.035),
          0,
          n - 0.25,
          v * (r / 2 + 0.03),
        ));
    }
    w.add(...x.flush(w, !0));
    const S = new c.Mesh(new c.BoxGeometry(y, 0.28, r + 0.02), i);
    ((S.position.y = 0.14), (S.castShadow = S.receiveShadow = !0), h.add(S));
    const F = new c.Mesh(new c.BoxGeometry(y + 0.005, 0.02, r + 0.025), au);
    ((F.position.y = 0.285),
      h.add(F),
      Vt.push({ g: h, tall: w, n: d.n, k: 1, kT: 1, cut: F }));
  });
  const u = -t + 0.1,
    g = e - 0.1;
  if (o === "garage") {
    const d = oe();
    d.box(C("#a8865c", { roughness: 0.8 }), 1.4, 1.55, 0, 1.7, 0.95, 0.03).box(
      C("#6b5a44"),
      1.4,
      2.12,
      0.05,
      1.9,
      0.04,
      0.22,
    );
    for (let x = 0; x < 6; x++)
      d.box(
        x % 2 ? Ge("#9aa3ad") : C("#b54a3a"),
        0.75 + x * 0.26,
        1.4 + (x % 3) * 0.12,
        0.04,
        0.04,
        0.34 + (x % 2) * 0.1,
        0.03,
      );
    d.box(
      C("#3b3f47", { roughness: 0.6 }),
      e - 1.05,
      1.9,
      -0.01,
      1.12,
      0.4,
      0.03,
    );
    const p = new c.Group();
    (p.position.set(-e / 2, 0, 0.1),
      p.add(...d.flush(p, !1)),
      Vt[2].tall.add(p));
    const h = new c.Mesh(new c.BoxGeometry(1.2, 0.05, 0.05), Ze("#f2f6ff", 3));
    (h.position.set(e / 2, kt() - 0.2, u + 0.2),
      Vt[2].tall.add(h),
      h.position.set(0, kt() - 0.25, 0.15),
      ln.push(zs(e / 2, kt() - 0.5, -t / 2, "#ffe9cc", 5, 0.6)));
    {
      const x = oe(),
        y = C("#a77f52", { roughness: 0.85 }),
        v = C("#8c6a46", { roughness: 0.85 });
      x.box(C("#6b5a44"), 0, 1.95, -0.16, t - 0.6, 0.04, 0.32);
      for (let I = 0; I < 4; I++)
        x.box(
          I % 2 ? y : v,
          -t / 2 + 0.6 + I * 0.62,
          2.12,
          -0.17,
          0.42 + (I % 2) * 0.1,
          0.3 - (I % 3) * 0.05,
          0.28,
        );
      const S = Ge("#2f4f6b", { roughness: 0.35 });
      x.tor(In, -0.55, 1.25, -0.1, 0.28, 0.035, { seg: 24 })
        .tor(In, 0.45, 1.25, -0.1, 0.28, 0.035, { seg: 24 })
        .box(S, -0.05, 1.38, -0.1, 0.95, 0.04, 0.04, { rz: 0.12 })
        .box(S, 0.2, 1.5, -0.1, 0.04, 0.4, 0.04, { rz: -0.3 })
        .box(In, 0.32, 1.72, -0.1, 0.16, 0.04, 0.06);
      const F = new c.Group();
      (F.add(...x.flush(F, !1)), Vt[1].tall.add(F));
    }
    const w = new c.Mesh(
      new c.CylinderGeometry(0.16, 0.16, 0.03, 24),
      C("#efe9dc"),
    );
    ((w.rotation.x = Math.PI / 2),
      w.position.set(-e / 2 + 0.35, 1.95, 0.12),
      Vt[2].tall.add(w));
  }
  if ((lu(o), o === "hall")) {
    const d = Math.min(4, Math.floor(e / 5));
    for (let p = 0; p < d; p++) {
      const h = new c.Mesh(
        new c.PlaneGeometry(1.6, 0.9),
        new c.MeshBasicMaterial({ map: cu, color: new c.Color(1.4, 1.4, 1.4) }),
      );
      (h.position.set(-e / 2 + ((p + 0.5) * e) / d, kt() * 0.62, 0.12),
        Vt[2].tall.add(h));
    }
  }
  for (let d = 0; d < Math.max(1, Math.round(t / 6)); d++)
    for (let p = 0; p < Math.max(1, Math.round(e / 7)); p++)
      ln.push(
        zs(
          ((p + 0.5) * e) / Math.max(1, Math.round(e / 7)),
          kt() * 0.8,
          (-(d + 0.5) * t) / Math.max(1, Math.round(t / 6)),
          o === "hall" ? "#9fdcff" : "#f4f0e6",
          Math.max(e, t) * 0.5,
          0.35,
        ),
      );
  (iu(), vu(), ac());
}
let Kn = [],
  Ur = [];
function iu() {
  for (const u of Kn) (u.parent?.remove(u), u.geometry?.dispose());
  Kn = [];
  const e = U(),
    t = W(),
    o = oe(),
    n = (u, g, d, p, h, w = 0.5, x = 0.4, y = 0.07) => {
      const v = Math.hypot(p - g, h - d);
      if (v < 0.5) return;
      const S = Math.floor(v / (w + x)),
        F = (p - g) / v,
        I = (h - d) / v;
      for (let q = 0; q < S; q++) {
        const H = q * (w + x) + w / 2;
        o.box(
          u,
          g + F * H,
          0.035,
          d + I * H,
          Math.abs(F) > 0.5 ? w : y,
          0.012,
          Math.abs(F) > 0.5 ? y : w,
        );
      }
    },
    a = _[s.lvl + 1],
    r = _[_.length - 1],
    i = Ze("#cfe6ff", 0.6),
    l = Ze("#9fdcff", 0.45),
    f = (u, g, d, p, h, w) => {
      (n(d, e + 0.3, 0.12, u, 0.12, p, h, w),
        n(d, u, 0.12, u, -g, p, h, w),
        n(d, u, -g, -0.12, -g, p, h, w),
        n(d, -0.12, -g, -0.12, -t - 0.3, p, h, w));
    };
  if (
    (a && f(a[0], a[1], i, 0.42, 0.3, 0.06),
    s.lvl < _.length - 2 && f(r[0], r[1], l, 0.14, 0.55, 0.14),
    Kn.push(...o.flush(ut, !1)),
    (Ur = []),
    a)
  ) {
    const u = new c.MeshBasicMaterial({
      color: "#9fdcff",
      transparent: !0,
      opacity: 0.16,
      depthWrite: !1,
    });
    for (const [g, d, p, h] of [
      [e, 0, a[0], -a[1]],
      [0, -t, e, -a[1]],
    ]) {
      if (p - g < 0.05 || d - h < 0.05) continue;
      const w = new c.Mesh(new c.PlaneGeometry(p - g, d - h), u);
      ((w.rotation.x = -Math.PI / 2),
        w.position.set((g + p) / 2, 0.03, (d + h) / 2),
        (w.visible = !1),
        (w.renderOrder = 2),
        ut.add(w),
        Kn.push(w),
        Ur.push(w));
    }
  }
  for (const u of Kn) (bt.push(u), Dt.push(u));
}
let Vr = !1;
const Do = Fn(0.92, 0.24, 768, 200, null, 1.7, { alphaTest: 0.06 });
function jr() {
  Do.userData.redraw((e, t, o) => {
    ((e.textAlign = "center"),
      (e.textBaseline = "middle"),
      (e.font = "600 104px Outfit, sans-serif"),
      (e.letterSpacing = "8px"),
      (e.shadowColor = Vr ? "#ffd27a" : "#ff7ad9"),
      (e.shadowBlur = 26),
      (e.fillStyle = Vr ? "#ffe6b0" : "#ffc4ec"),
      e.fillText("@RYANSAEL", t / 2, o / 2 + 4),
      (e.shadowBlur = 0),
      (e.fillStyle = "#fff6fb"),
      e.fillText("@RYANSAEL", t / 2, o / 2 + 4));
  });
}
(jr(),
  Js.push(jr),
  Dt.push(Do),
  ea.push({
    hit: Do,
    over(e) {
      ((Vr = e), jr());
    },
  }));
const Xn = wd(1.5, { k: 0.85 });
function lu(e) {
  const t = U(),
    o = Vt[2].tall;
  (Do.parent?.remove(Do),
    Xn.parent?.remove(Xn),
    e === "garage"
      ? (Do.position.set(t / 2 - 1.05, 1.9, 0.13), o.add(Do))
      : (Xn.scale.setScalar(A(t / 12, 1, 2.6)),
        Xn.position.set(-t * 0.28, kt() * 0.8, 0.13),
        o.add(Xn)));
}
const cu = tn(512, 288, (e, t, o) => {
  ((e.fillStyle = "#08111c"),
    e.fillRect(0, 0, t, o),
    (e.strokeStyle = "#1c3a52"),
    (e.lineWidth = 2));
  for (let n = 0; n < t; n += 32)
    (e.beginPath(), e.moveTo(n, 0), e.lineTo(n, o), e.stroke());
  ((e.strokeStyle = "#7fe3ff"), (e.lineWidth = 4), e.beginPath());
  for (let n = 0; n <= t; n += 8) {
    const a = o * 0.7 - Math.log(1 + n) * 24 - Math.sin(n * 0.05) * 6;
    n ? e.lineTo(n, a) : e.moveTo(n, a);
  }
  (e.stroke(),
    (e.fillStyle = "#ffb454"),
    (e.font = "600 26px DM Mono, monospace"),
    e.fillText("LOSS", 18, 36));
});
function fu(e) {
  const t = U() / 2,
    o = -W() / 2,
    n = O.position.x - t,
    a = O.position.z - o,
    r = Math.hypot(n, a) || 1;
  for (const i of Vt) {
    const l = (i.n[0] * n + i.n[1] * a) / r;
    ((i.kT = l > 0.12 ? 0 : 1), (i.k += (i.kT - i.k) * (1 - Math.exp(-e * 7))));
    const f = Math.max(0.001, i.k);
    ((i.tall.scale.y = f),
      (i.tall.visible = f > 0.02),
      (i.cut.visible = f < 0.5));
  }
  Mt.visible = (Vt[2]?.k ?? 1) > 0.55;
}
const Mt = new c.Group();
Ee.add(Mt);
const Zn = 18,
  Go = 0.45,
  Qn = [0, 1, 2].map(() => {
    const e = document.createElement("canvas");
    ((e.width = 1600), (e.height = 720));
    const t = new c.CanvasTexture(e);
    return (
      (t.colorSpace = c.SRGBColorSpace),
      (t.anisotropy = 8),
      { c: e, g: e.getContext("2d"), t }
    );
  }),
  Jn = {
    t0: { value: Qn[0].t },
    t1: { value: Qn[1].t },
    t2: { value: Qn[2].t },
    uBase: { value: 0 },
    uProg: { value: 0 },
    uN: { value: Zn },
    uHot: { value: 0 },
    uSheen: { value: -2 },
  },
  pa = new c.Mesh(
    (() => {
      const e = [],
        t = [],
        o = [],
        n = [],
        a = [],
        r = 1 / Zn,
        i = r / Math.sqrt(3);
      for (let f = 0; f < Zn; f++) {
        const u = -0.5 + (f + 0.5) * r;
        for (let g = 0; g < 3; g++) {
          const d = Math.PI / 2 + (g * 2 * Math.PI) / 3,
            p = [i * Math.cos(d + Math.PI / 3), i * Math.sin(d + Math.PI / 3)],
            h = [i * Math.cos(d - Math.PI / 3), i * Math.sin(d - Math.PI / 3)],
            w = f / Zn,
            x = (f + 1) / Zn;
          for (const [y, v, S, F] of [
            [p, -Go / 2, w, 0],
            [h, -Go / 2, x, 0],
            [h, Go / 2, x, 1],
            [p, -Go / 2, w, 0],
            [h, Go / 2, x, 1],
            [p, Go / 2, w, 1],
          ])
            (e.push(y[0], v, y[1]),
              t.push(Math.cos(d), 0, Math.sin(d)),
              o.push(S, F),
              n.push(u, f),
              a.push(g));
        }
      }
      const l = new c.BufferGeometry();
      return (
        l.setAttribute("position", new c.Float32BufferAttribute(e, 3)),
        l.setAttribute("normal", new c.Float32BufferAttribute(t, 3)),
        l.setAttribute("uv", new c.Float32BufferAttribute(o, 2)),
        l.setAttribute("aSlat", new c.Float32BufferAttribute(n, 2)),
        l.setAttribute("aFace", new c.Float32BufferAttribute(a, 1)),
        l
      );
    })(),
    new c.ShaderMaterial({
      uniforms: Jn,
      vertexShader: `attribute vec2 aSlat;attribute float aFace;uniform float uBase;uniform float uProg;uniform float uN;varying vec2 vUv;varying float vLit;varying float vFace;
   void main(){float s=clamp(uProg*1.75-aSlat.y/uN*.75,0.,1.);s=s*s*(3.-2.*s);float a=-2.0943951*(uBase+s),c=cos(a),sn=sin(a);
    vec3 p=position;p.xz=vec2(p.x*c-p.z*sn,p.x*sn+p.z*c);p.x+=aSlat.x;float nz=normal.x*sn+normal.z*c;
    vLit=.16+.84*pow(max(nz,0.),.7);vFace=aFace;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader: `uniform sampler2D t0;uniform sampler2D t1;uniform sampler2D t2;uniform float uHot;uniform float uSheen;varying vec2 vUv;varying float vLit;varying float vFace;
   void main(){vec3 c=vFace<.5?texture2D(t0,vUv).rgb:vFace<1.5?texture2D(t1,vUv).rgb:texture2D(t2,vUv).rgb;
    float sh=exp(-pow((vUv.x*1.3+vUv.y*.35-uSheen)*7.,2.))*.2;
    gl_FragColor=vec4((c*(.94+.14*uHot)+sh)*vLit,1.);}`,
    }),
  );
((pa.position.y = 0.225), (pa.frustumCulled = !1), Mt.add(pa), Dt.push(pa));
const ga = new c.Mesh(
  new c.PlaneGeometry(1, Go),
  new c.MeshBasicMaterial({ visible: !1 }),
);
(ga.position.set(0, 0.225, 0.035), Mt.add(ga));
{
  const e = oe(),
    t = C("#3d434c", { roughness: 0.5, metalness: 0.4 });
  e.box(C("#07080c", { roughness: 0.9 }), 0, 0.225, -0.062, 1.02, 0.47, 0.03)
    .box(t, 0, 0.225, -0.09, 1.06, 0.5, 0.03)
    .box(t, -0.32, -0.45, -0.11, 0.05, 1, 0.05)
    .box(t, 0.32, -0.45, -0.11, 0.05, 1, 0.05)
    .box(t, 0, -0.03, -0.11, 0.9, 0.03, 0.08)
    .box(t, 0, 0.466, -0.035, 1.09, 0.032, 0.1)
    .box(t, 0, -0.016, -0.035, 1.09, 0.032, 0.1)
    .box(t, -0.528, 0.225, -0.035, 0.026, 0.51, 0.1)
    .box(t, 0.528, 0.225, -0.035, 0.026, 0.51, 0.1);
  for (const o of [-0.35, 0, 0.35]) e.box(t, o, 0.52, 0.06, 0.02, 0.02, 0.16);
  Mt.add(...e.flush(Mt));
  for (const o of [-0.35, 0, 0.35]) {
    const n = new c.Mesh(
      new c.BoxGeometry(0.08, 0.015, 0.03),
      Ze("#fff2d6", 3),
    );
    (n.position.set(o, 0.535, 0.14), Mt.add(n));
  }
}
const G = {
  face: 0,
  base: 0,
  prog: 0,
  turning: !1,
  at: 0,
  sheen: -9,
  hot: 0,
  hotT: 0,
  pin: Vs.has("board") ? A(+Vs.get("board") | 0, 0, 2) : -1,
};
G.pin >= 0 && (G.face = G.base = G.pin);
const zl = () => (G.turning && G.prog > 0.5 ? (G.face + 1) % 3 : G.face);
function du(e, t) {
  const o = we.billboard;
  (G.at === 0 && (G.at = e),
    G.pin < 0 &&
      !G.turning &&
      e - G.at > (o[G.face].hold || 8) &&
      ((G.turning = !0), (G.at = e)),
    G.turning &&
      ((G.prog = A((e - G.at) / 1.8, 0, 1)),
      G.prog >= 1 &&
        ((G.turning = !1),
        (G.prog = 0),
        (G.base = (G.base + 1) % 3),
        (G.face = (G.face + 1) % 3),
        (G.at = e),
        (G.sheen = e))),
    (G.hot += (G.hotT - G.hot) * (1 - Math.exp(-t * 10))),
    (Jn.uBase.value = G.base),
    (Jn.uProg.value = G.prog),
    (Jn.uHot.value = G.hot),
    (Jn.uSheen.value = (e - G.sheen) * 1.5 - 0.4));
}
const fn = new Map();
function ql(e, t) {
  if (!e.logo) return null;
  let o = fn.get(e.id);
  return (
    o ||
      ((o = new Image()),
      (o.onload = t),
      (o.src =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(e.logo)),
      fn.set(e.id, o)),
    o.complete && o.naturalWidth ? o : null
  );
}
function ma(e) {
  const t = we.billboard[e],
    { g: o, c: n, t: a } = Qn[e],
    r = n.width,
    i = n.height;
  if (
    (o.clearRect(0, 0, r, i),
    (o.textAlign = "center"),
    (o.textBaseline = "alphabetic"),
    (o.letterSpacing = "0px"),
    t.img)
  ) {
    let l = fn.get(t.id + ":img");
    if (
      (l ||
        ((l = new Image()),
        (l.onload = () => ma(e)),
        (l.src = t.img),
        fn.set(t.id + ":img", l)),
      l.complete && l.naturalWidth)
    ) {
      (o.drawImage(l, 0, 0, r, i), (a.needsUpdate = !0));
      return;
    }
  }
  if (t.kind === "brand") {
    const l = o.createLinearGradient(0, 0, 0, i);
    (l.addColorStop(0, t.bg[0]),
      l.addColorStop(1, t.bg[1]),
      (o.fillStyle = l),
      o.fillRect(0, 0, r, i),
      o.save(),
      (o.globalAlpha = 0.09),
      (o.strokeStyle = t.accent),
      (o.lineWidth = 2.5));
    const f = 212;
    for (let w = 0; w < 12; w++) {
      const x = 30 + w * 60;
      (o.beginPath(),
        o.moveTo(-10, x),
        o.bezierCurveTo(200, x, 180, f, 300, f),
        o.stroke());
    }
    ((o.globalAlpha = 0.16),
      (o.lineWidth = 5),
      o.beginPath(),
      o.moveTo(1340, f),
      o.bezierCurveTo(1300, f, 1300, f, r + 10, f),
      o.stroke(),
      o.restore());
    const u = ql(t, () => {
        ma(e);
      }),
      g = 176,
      d = g * t.logoAspect;
    (u
      ? o.drawImage(u, (r - d) / 2, f - g / 2, d, g)
      : ((o.fillStyle = t.ink),
        (o.font = "800 130px Outfit, sans-serif"),
        o.fillText(t.name, r / 2, f + 46)),
      (o.fillStyle = t.ink),
      (o.font = "700 88px Outfit, sans-serif"),
      o.fillText(t.head, r / 2, 448, r - 160),
      (o.font = "600 46px DM Mono, monospace"));
    const p = t.cta + "  \u2197",
      h = o.measureText(p).width;
    ((o.fillStyle = t.accent),
      en(o, r / 2 - h / 2 - 40, 526, h + 80, 92, 46),
      o.fill(),
      (o.fillStyle = "#0b0b0f"),
      o.fillText(p, r / 2, 587));
  } else if (t.kind === "game") {
    const l = o.createLinearGradient(0, 0, r, i);
    (l.addColorStop(0, "#13213f"),
      l.addColorStop(1, "#060a14"),
      (o.fillStyle = l),
      o.fillRect(0, 0, r, i),
      (o.fillStyle = "#dfe6f5"),
      (o.font = "600 58px Outfit, sans-serif"),
      (o.letterSpacing = "12px"),
      o.fillText("GARAGE TO", r / 2 + 6, 150),
      (o.letterSpacing = "4px"),
      (o.fillStyle = "#7fe3ff"),
      (o.font = "800 176px Outfit, sans-serif"),
      o.fillText("GIGAWATT", r / 2 + 2, 318),
      (o.letterSpacing = "0px"),
      (o.fillStyle = "#b9c3d8"),
      (o.font = "500 42px Outfit, sans-serif"),
      o.fillText("Every gigawatt starts in a garage", r / 2, 392),
      (o.strokeStyle = "#7fe3ff"),
      (o.lineWidth = 5),
      (o.lineJoin = "round"),
      (o.lineCap = "round"));
    const f = 600;
    (o.beginPath(),
      o.moveTo(260, f),
      o.lineTo(260, f - 70),
      o.lineTo(320, f - 112),
      o.lineTo(380, f - 70),
      o.lineTo(380, f),
      o.closePath(),
      o.stroke(),
      o.strokeRect(290, f - 50, 60, 50),
      (o.fillStyle = "#ffb454"),
      o.beginPath(),
      o.arc(320, f - 82, 9, 0, 7),
      o.fill(),
      o.setLineDash([4, 18]),
      o.beginPath(),
      o.moveTo(430, f - 30),
      o.lineTo(1080, f - 30),
      o.stroke(),
      o.setLineDash([]),
      o.beginPath(),
      o.moveTo(1060, f - 46),
      o.lineTo(1084, f - 30),
      o.lineTo(1060, f - 14),
      o.stroke(),
      o.strokeRect(1130, f - 78, 250, 78));
    for (let u = 0; u < 6; u++)
      (o.beginPath(),
        o.moveTo(1150 + u * 38, f - 60),
        o.lineTo(1150 + u * 38, f - 18),
        o.stroke());
    for (const u of [1415, 1490])
      (o.beginPath(),
        o.moveTo(u - 26, f),
        o.quadraticCurveTo(u - 8, f - 60, u - 22, f - 118),
        o.lineTo(u + 22, f - 118),
        o.quadraticCurveTo(u + 8, f - 60, u + 26, f),
        o.stroke());
    ((o.fillStyle = "#ffb454"),
      (o.font = "600 36px DM Mono, monospace"),
      o.fillText("sael.net/gigawatt", r / 2, 672));
  } else
    ((o.fillStyle = "#0d1424"),
      o.fillRect(0, 0, r, i),
      (o.strokeStyle = "#ffb454"),
      (o.lineWidth = 7),
      o.setLineDash([30, 20]),
      o.strokeRect(48, 48, r - 96, i - 96),
      o.setLineDash([]),
      (o.fillStyle = "#f4f6fb"),
      (o.font = "800 128px Outfit, sans-serif"),
      (o.letterSpacing = "3px"),
      o.fillText("YOUR BRAND HERE", r / 2, 330, r - 180),
      (o.letterSpacing = "0px"),
      (o.fillStyle = "#c9d1e4"),
      (o.font = "500 44px Outfit, sans-serif"),
      o.fillText(
        "Seen by every player, from the first garage to the gigawatt campus",
        r / 2,
        412,
        r - 200,
      ),
      (o.fillStyle = "#ffb454"),
      (o.font = "600 38px DM Mono, monospace"),
      o.fillText("1600 \xD7 720  \xB7  DM @RYANSAEL", r / 2, 520));
  a.needsUpdate = !0;
}
function dn(e, t, o) {
  const n = b("#brandcard");
  if (!e) {
    n.classList.remove("on");
    return;
  }
  n.dataset.id !== e.id &&
    ((n.dataset.id = e.id),
    n.style.setProperty("--acc", e.accent || "#ffb454"),
    (n.innerHTML =
      e.kind === "brand"
        ? `${e.thanks ? `<span class="bc-kick" style="margin-bottom:11px">${e.thanks}</span>` : ""}<div class="bc-logo">${e.logo}</div><b>${e.head}.</b><p>${e.about} ${e.sub}</p><div class="bc-stats">${(e.stats || []).map(([r, i]) => `<div><i>${r}</i><span>${i}</span></div>`).join("")}</div><span class="bc-cta">Click the billboard \xB7 ${e.cta} \u2197</span>`
        : '<span class="bc-kick">Sponsor slot</span><b>This billboard is for rent</b><p>It stands on the back wall in every frame, from the first garage to the gigawatt campus, it turns with two other faces, and it is a link. Creative: 1600 \xD7 720.</p><span class="bc-cta">DM @RYANSAEL on X \u2197</span>'));
  const a = n.getBoundingClientRect();
  ((n.style.left = A(t + 18, 12, innerWidth - a.width - 12) + "px"),
    (n.style.top = A(o + 22, 12, innerHeight - a.height - 12) + "px"),
    n.classList.add("on"));
}
function uu() {
  const e = U(),
    t = W(),
    o = A(1.2 + e * 0.3, 2.3, 14),
    n = e * 0.7,
    a = -t - 0.35;
  (Mt.scale.setScalar(o),
    Mt.position.set(n, le + kt() + o * 0.5, a),
    (Mt.rotation.y = ae.yaw * 0.35),
    ln.push(
      zs(n, le + kt() + o * 0.55, a + o * 0.45, "#fff0d8", o * 0.8, 0.9),
    ));
}
const to = new c.Group();
Ee.add(to);
const ba = document.createElement("canvas");
((ba.width = 2048), (ba.height = 512));
const wa = new c.CanvasTexture(ba);
((wa.colorSpace = c.SRGBColorSpace), (wa.anisotropy = 8));
let Yl = !1;
function Nr() {
  const e = ba.getContext("2d"),
    t = 2048,
    o = 512;
  ((e.fillStyle = "#d9d6cf"),
    e.fillRect(0, 0, t, o),
    (e.fillStyle = "#c9c5bd"));
  for (let n = 0; n < t; n += 128) e.fillRect(n, 0, 3, o);
  ((e.fillStyle = "#bdb8ae"),
    e.fillRect(0, 0, t, 26),
    e.fillRect(0, o - 26, t, 26),
    (e.font = "700 150px Outfit, sans-serif"),
    (e.letterSpacing = "14px"),
    (e.textAlign = "center"),
    (e.textBaseline = "middle"),
    (e.fillStyle = Yl ? "#e08a24" : "#2f3540"),
    e.fillText("@RYANSAEL", t / 2, o / 2 + 8),
    (wa.needsUpdate = !0));
}
const hu = Xt(
  new c.MeshStandardMaterial({
    map: wa,
    roughness: 0.55,
    metalness: 0.15,
    envMapIntensity: 0.6,
  }),
);
{
  const e = oe(),
    t = Ge("#7d838c", { roughness: 0.45, metalness: 0.6 });
  for (let a = 0; a < 4; a++) {
    const r = (a / 4) * Math.PI * 2 + Math.PI / 4,
      i = Math.cos(r) * 1.25,
      l = Math.sin(r) * 1.25;
    e.cyl(t, i * 0.85, 3, l * 0.85, 0.07, 0.09, 6.2, {
      seg: 6,
      rz: -i * 0.05,
      rx: l * 0.05,
    });
  }
  (e
    .tor(t, 0, 2.2, 0, 1.08, 0.04, { rx: Math.PI / 2, seg: 24 })
    .tor(t, 0, 4.2, 0, 1.02, 0.04, { rx: Math.PI / 2, seg: 24 })
    .cyl(t, 0, 3.4, 0, 0.12, 0.12, 6.8, { seg: 8 }),
    e
      .cone(C("#9aa0a8", { roughness: 0.5 }), 0, 8.15, 0, 1.75, 0.9, {
        seg: 24,
      })
      .cyl(C("#bdb8ae", { roughness: 0.6 }), 0, 6.35, 0, 1.62, 1.2, 0.5, {
        seg: 24,
      }),
    to.add(...e.flush(to)));
  const o = new c.Mesh(new c.CylinderGeometry(1.7, 1.7, 1.6, 48, 1, !0), hu);
  ((o.position.y = 7.35),
    (o.castShadow = !0),
    to.add(o),
    (to.userData.tank = o));
  const n = new c.Mesh(new c.CircleGeometry(1.7, 48), C("#9aa0a8"));
  ((n.rotation.x = -Math.PI / 2),
    (n.position.y = 8.15),
    to.add(n),
    ea.push({
      hit: o,
      over(a) {
        ((Yl = a), Nr());
      },
    }),
    Nr());
}
function pu() {
  const e = U(),
    t = W();
  to.position.set(-3.4 - e * 0.05, 0, -t - 3.2 - t * 0.15);
  const o = A(0.75 + e * 0.012, 0.75, 1.25);
  (to.scale.setScalar(o), (to.userData.tank.rotation.y = ae.yaw + Math.PI));
}
const Bo = new c.Group();
Ee.add(Bo);
const xa = document.createElement("canvas");
((xa.width = 1024), (xa.height = 384));
const es = new c.CanvasTexture(xa);
((es.colorSpace = c.SRGBColorSpace), (es.anisotropy = 8));
const gu = Xt(
    new c.MeshStandardMaterial({
      map: es,
      roughness: 0.82,
      envMapIntensity: 0.3,
    }),
  ),
  mu = new c.MeshBasicMaterial({
    map: es,
    color: new c.Color(1.08, 1.08, 1.08),
  });
let Hr = -1,
  ts = [],
  Kl = 0;
const bu = (e) => (e <= 1 ? 0 : e <= 3 ? 1 : e <= 5 ? 2 : 3),
  wu = (e) =>
    e
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((t) => t[0])
      .join("")
      .toUpperCase() || "AI";
function xu() {
  for (const d of ts) (d.parent?.remove(d), d.geometry?.dispose());
  ts = [];
  const e = bu(s.lvl),
    t = U(),
    o = [1.8, 2.2, 3.4, 7.2][e],
    n = (o * 384) / 1024,
    a = oe(),
    r = C("#6b5640", { roughness: 0.9 });
  Hr = e;
  let i,
    l,
    f,
    u = 0;
  (e === 0
    ? ((i = 3.95),
      (l = 2.6),
      (f = 0.5),
      a
        .box(r, -o * 0.33, 0.45, -0.05, 0.06, 0.9, 0.05)
        .box(r, o * 0.33, 0.45, -0.05, 0.06, 0.9, 0.05)
        .box(
          C("#2f4a3a", { roughness: 0.85 }),
          0,
          f + n / 2,
          -0.03,
          o + 0.07,
          n + 0.07,
          0.04,
        ))
    : e === 1
      ? ((i = Math.max(t * 0.6, 4.8)),
        (l = 2.55),
        (f = 0.95),
        a
          .box(Sr, -o * 0.42, (f + n) / 2, -0.05, 0.07, f + n, 0.07)
          .box(Sr, o * 0.42, (f + n) / 2, -0.05, 0.07, f + n, 0.07)
          .box(
            C("#1a2234", { roughness: 0.5 }),
            0,
            f + n / 2,
            -0.035,
            o + 0.09,
            n + 0.09,
            0.045,
          )
          .box(Sr, 0, f + n + 0.075, -0.035, o * 0.7, 0.05, 0.06))
      : e === 2
        ? ((i = t * 0.5),
          (l = 2.7),
          (f = 0.24),
          (u = 0.112),
          a
            .box(
              C("#8a867e", { roughness: 0.85 }),
              0,
              (f + n + 0.12) / 2,
              -0.1,
              o + 0.5,
              f + n + 0.12,
              0.42,
            )
            .box(
              Ge("#5b636e", { roughness: 0.35 }),
              0,
              f + n + 0.145,
              -0.1,
              o + 0.56,
              0.05,
              0.46,
            ))
        : ((i = t * 0.5),
          (l = 2.62),
          (f = 0.36),
          (u = 0.112),
          a
            .box(
              C("#5f5e5a", { roughness: 0.9 }),
              0,
              0.12,
              -0.14,
              o + 1.3,
              0.24,
              0.7,
            )
            .box(
              Ge("#262b34", { roughness: 0.4 }),
              0,
              (f + n + 0.16) / 2 + 0.1,
              -0.14,
              o + 0.5,
              f + n + 0.16,
              0.5,
            )
            .box(Ze("#7fe3ff", 1.8), 0, 0.255, 0.215, o + 1.1, 0.025, 0.025)),
    ts.push(...a.flush(Bo)));
  const g = new c.Mesh(new c.PlaneGeometry(o, n), e === 0 ? gu : mu);
  if ((g.position.set(0, f + n / 2, u), Bo.add(g), ts.push(g), e === 1)) {
    const d = new c.Mesh(
      new c.BoxGeometry(o * 0.66, 0.018, 0.03),
      Ze("#fff1d8", 2.6),
    );
    (d.position.set(0, f + n + 0.052, -0.005), Bo.add(d), ts.push(d));
  }
  (Bo.position.set(i, 0, l),
    (Bo.rotation.y = ae.yaw * (e < 2 ? 0.75 : 0.45)),
    e >= 1 &&
      ln.push(
        zs(
          i,
          f + n * 0.6,
          l + 1.4,
          e === 1 ? "#fff0d8" : "#bfe9ff",
          o * 1.1,
          0.75,
        ),
      ),
    os());
}
function os() {
  const e = xa.getContext("2d"),
    t = 1024,
    o = 384,
    n = Hr,
    a = s.lab.toUpperCase(),
    r = ge(s.gen).toUpperCase(),
    i = ee[s.gen].cls.toUpperCase();
  if (
    (e.clearRect(0, 0, t, o),
    (e.textAlign = "center"),
    (e.textBaseline = "alphabetic"),
    (e.letterSpacing = "0px"),
    n === 0)
  ) {
    ((e.fillStyle = "#2f4a3a"), e.fillRect(0, 0, t, o));
    for (let l = 1; l < 9; l++)
      ((e.fillStyle = `rgba(0,0,0,${0.07 + (l % 3) * 0.03})`),
        e.fillRect(0, l * 43, t, 3));
    (e.save(),
      e.translate(t / 2, 176),
      e.rotate(-0.014),
      (e.fillStyle = "#f1e7cf"),
      (e.font = "800 112px Outfit, sans-serif"),
      (e.letterSpacing = "3px"),
      e.fillText(a, 0, 0, t - 80),
      e.restore(),
      (e.fillStyle = "#e3d3ad"),
      (e.font = "600 50px DM Mono, monospace"),
      (e.letterSpacing = "2px"),
      e.fillText(
        `EST. ${new Date().getFullYear()} \xB7 SERVING ${r}`,
        t / 2,
        300,
        t - 80,
      ));
  } else
    n === 1
      ? ((e.fillStyle = "#1a2234"),
        e.fillRect(0, 0, t, o),
        (e.fillStyle = "#7fe3ff"),
        e.fillRect(80, 224, t - 160, 6),
        (e.fillStyle = "#f4f6fb"),
        (e.font = "800 112px Outfit, sans-serif"),
        (e.letterSpacing = "2px"),
        e.fillText(a, t / 2, 184, t - 110),
        (e.fillStyle = "#a9b8d3"),
        (e.font = "500 38px DM Mono, monospace"),
        (e.letterSpacing = "1px"),
        e.fillText(`NOW SERVING ${r} \xB7 ${i}`, t / 2, 300, t - 110))
      : n === 2
        ? ((e.fillStyle = "#14181f"),
          e.fillRect(0, 0, t, o),
          (e.shadowColor = "#bfe9ff"),
          (e.shadowBlur = 28),
          (e.fillStyle = "#ffffff"),
          (e.font = "700 118px Outfit, sans-serif"),
          (e.letterSpacing = "4px"),
          e.fillText(a, t / 2, 196, t - 100),
          (e.shadowBlur = 0),
          (e.fillStyle = "#ffb454"),
          (e.font = "500 38px DM Mono, monospace"),
          (e.letterSpacing = "1px"),
          e.fillText(
            `${r} \xB7 ${i} CLASS \xB7 ${N(m.draw || 0).toUpperCase()}`,
            t / 2,
            304,
            t - 100,
          ))
        : ((e.fillStyle = "#0b0f18"),
          e.fillRect(0, 0, t, o),
          (e.fillStyle = "#7fe3ff"),
          en(e, 54, 58, 176, 176, 30),
          e.fill(),
          (e.fillStyle = "#06222e"),
          (e.font = "800 80px Outfit, sans-serif"),
          e.fillText(wu(s.lab), 142, 174, 150),
          (e.textAlign = "left"),
          (e.fillStyle = "#ffffff"),
          (e.font = "700 96px Outfit, sans-serif"),
          (e.letterSpacing = "2px"),
          e.fillText(a, 268, 158, t - 300),
          (e.fillStyle = "#8fa0bd"),
          (e.font = "600 32px Outfit, sans-serif"),
          (e.letterSpacing = "8px"),
          e.fillText("AI CAMPUS", 270, 214),
          (e.fillStyle = "#ffb454"),
          (e.font = "500 38px DM Mono, monospace"),
          (e.letterSpacing = "1px"),
          e.fillText(
            `${Te(m.served)} TOKENS/S \xB7 ${r} \xB7 ${N(m.draw || 0).toUpperCase()}`,
            58,
            322,
            t - 110,
          ));
  ((es.needsUpdate = !0), (Kl = L));
}
function vu() {
  (uu(), pu(), [0, 1, 2].forEach(ma), ti(), xu());
}
const Wr = { value: 0 },
  Xl = { value: 1 },
  Zl = { value: 0 },
  Ql =
    "attribute vec4 aSt;varying vec4 vSt;varying vec3 vLoc;uniform float uTime;",
  yu = `#include <begin_vertex>
vSt=aSt;vLoc=position;{float age=uTime-aSt.w;float k=clamp(age/.42,0.,1.);float s=age<0.?1.:1.+(sin(k*3.14159*1.15)*.28)*(1.-k)-(1.-k)*(1.-k)*.55;transformed*=max(s,.02);}`,
  zr = new Map();
function un(e, t, o = {}) {
  const n = "inst-" + t + (o.key || "");
  if (zr.has(n)) return (e.dispose(), zr.get(n));
  const a = e,
    r = Object.assign(
      (i) => {
        (Object.assign(i.uniforms, {
          uTime: Wr,
          uAct: Xl,
          uBrown: Zl,
          uLed: { value: new c.Color(o.led || "#7fe3ff") },
        }),
          (i.vertexShader = i.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` + Ql,
            )
            .replace("#include <begin_vertex>", yu)),
          (i.fragmentShader = i.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec4 vSt;varying vec3 vLoc;uniform float uTime;uniform float uAct;uniform float uBrown;uniform vec3 uLed;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
   {float jam=step(1.5,vSt.x),heat=vSt.x*(1.-jam),seed=vSt.y,bld=step(1.5,vSt.z),sel=vSt.z*(1.-bld);float fl=(1.-uBrown*(.5+.5*step(.5,fract(uTime*7.3+seed))))*(1.-bld);float strobe=step(.5,fract(uTime*2.2+seed));
   // a machine being built (z = 2 + how far the work has got): nothing above the cut, a lit seam at it, its lights still dark
   if(bld>.5){float cut=(vSt.z-2.)*1.95;if(vLoc.y>cut)discard;totalEmissiveRadiance+=vec3(.35,.95,1.5)*smoothstep(cut-.06,cut,vLoc.y)*2.6;}
   ${
     t === "led"
       ? `vec3 id=floor(vLoc*vec3(28.,46.,28.));float h=fract(sin(dot(id+seed*3.1,vec3(12.9898,78.233,37.719)))*43758.5453);
    float blink=step(.3,fract(h*7.1+uTime*(.4+uAct*2.6)*(.55+h)));vec3 lc=mix(uLed,vec3(1.8,.55,.12),smoothstep(.15,.6,heat));lc=mix(lc,vec3(2.2,.18,.1),smoothstep(.6,.95,heat));
    lc=mix(lc,vec3(2.6,.16,.1)*strobe,jam);totalEmissiveRadiance+=lc*mix((.35+.65*blink)*(.35+.65*uAct),1.,jam)*2.2*fl;`
       : ""
   }
   ${t === "rgb" ? "vec3 hc=.5+.5*cos(6.2832*(fract(uTime*.12+vLoc.y*.9+seed)+vec3(0.,.33,.67)));totalEmissiveRadiance+=mix(hc*1.6*fl*(1.-heat*.5)+vec3(1.6,.3,.08)*heat,vec3(2.2,.2,.12)*strobe*fl,jam);" : ""}
   ${t === "body" ? "totalEmissiveRadiance+=vec3(1.5,.32,.07)*heat*heat*(.55+.45*sin(uTime*5.+seed*6.))*smoothstep(.0,.25,vLoc.y)*.55;" : ""}
   ${t === "glow" ? "totalEmissiveRadiance+=mix(uLed*(.6+.4*uAct),vec3(1.9,.22,.12)*(.25+.75*strobe),jam)*1.8*fl;" : ""}
   totalEmissiveRadiance+=vec3(.25,.75,1.)*sel*.35;}`,
            )));
      },
      { key: n },
    );
  return (zr.set(n, a), Xt(a, r));
}
const Ue = (e, t = {}) =>
    un(
      new c.MeshStandardMaterial({
        color: e,
        roughness: 0.5,
        metalness: 0.35,
        envMapIntensity: 0.6,
        ...t,
      }),
      "body",
      { key: e + JSON.stringify(t) },
    ),
  jt = (e, t = {}) =>
    un(
      new c.MeshPhysicalMaterial({
        color: e,
        roughness: 0.35,
        metalness: 0.55,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        envMapIntensity: 0.9,
        ...t,
      }),
      "body",
      { key: "p" + e + JSON.stringify(t) },
    ),
  St = (e, t = "") =>
    un(
      new c.MeshStandardMaterial({
        color: "#05070a",
        roughness: 0.4,
        emissive: "#000000",
      }),
      "led",
      { led: e, key: "L" + e + t },
    ),
  ns = (e) =>
    un(
      new c.MeshStandardMaterial({
        color: "#05070a",
        roughness: 0.4,
        emissive: "#000000",
      }),
      "glow",
      { led: e, key: "G" + e },
    ),
  va = un(
    new c.MeshStandardMaterial({
      color: "#05070a",
      roughness: 0.3,
      emissive: "#000000",
    }),
    "rgb",
    { key: "rgb" },
  ),
  Io = Ue("#1a1d23", { roughness: 0.45 }),
  qr = jt("#3b414b", { roughness: 0.38 }),
  ya = jt("#121418", { roughness: 0.42 }),
  ss = jt("#aeb5bf", { roughness: 0.3, metalness: 0.9 }),
  Yr = Ue("#c7ccd3", { roughness: 0.35, metalness: 0.8 }),
  as = jt("#b98a45", { roughness: 0.3, metalness: 1 }),
  rs = Ue("#d4d8dd", { roughness: 0.55, metalness: 0.2 }),
  is = jt("#2f7fc1", { roughness: 0.3, metalness: 0.3 }),
  ls = jt("#d9733a", { roughness: 0.3, metalness: 0.3 }),
  ku = Ue("#8d8b86", { roughness: 0.85, metalness: 0 }),
  Jl = un(
    new c.MeshPhysicalMaterial({
      color: "#1b2433",
      roughness: 0.08,
      metalness: 0.2,
      clearcoat: 1,
      transparent: !0,
      opacity: 0.55,
      envMapIntensity: 1.4,
    }),
    "body",
    { key: "glass" },
  ),
  Kr = {
    pc(e) {
      for (const o of [-0.38, 0.38])
        for (const n of [-0.2, 0.2]) e.box(Yr, o, 0.6, n, 0.016, 1.2, 0.016);
      for (const o of [0.08, 0.55, 1.02]) e.box(Yr, 0, o, 0, 0.78, 0.02, 0.42);
      for (let o = 0; o < 9; o++)
        e.box(Yr, -0.36 + o * 0.09, 0.565, 0, 0.006, 0.012, 0.42);
      (e
        .box(ya, -0.12, 0.79, 0, 0.26, 0.46, 0.38, { r: 0.02 })
        .box(Jl, -0.12, 0.8, 0.192, 0.22, 0.4, 0.01)
        .geo(va, new c.BoxGeometry(0.012, 0.36, 0.01), -0.235, 0.8, 0.195)
        .geo(va, new c.BoxGeometry(0.2, 0.012, 0.01), -0.12, 0.6, 0.195),
        e
          .geo(va, new c.TorusGeometry(0.055, 0.008, 6, 20), -0.12, 0.88, 0.198)
          .geo(
            va,
            new c.TorusGeometry(0.055, 0.008, 6, 20),
            -0.12,
            0.72,
            0.198,
          ),
        e
          .box(Io, 0.2, 0.62, 0.02, 0.28, 0.1, 0.26)
          .box(qr, 0.2, 1.1, 0, 0.3, 0.14, 0.24)
          .geo(
            St("#9fe8ff", "pc"),
            new c.BoxGeometry(0.24, 0.02, 0.01),
            0.2,
            1.1,
            0.125,
          ),
        e
          .box(Io, 0.18, 0.2, 0, 0.3, 0.22, 0.3)
          .box(rs, -0.18, 0.17, 0.02, 0.24, 0.16, 0.3));
    },
    srv(e) {
      (e.box(qr, 0, 0.73, 0, 0.6, 1.46, 0.92, { r: 0.025 }),
        e.box(ya, 0, 0.73, 0.462, 0.54, 1.38, 0.01));
      for (let t = 0; t < 14; t++) {
        const o = 0.12 + t * 0.09;
        e.box(
          t >= 4 && t <= 8 ? Io : Ue("#20242b"),
          0,
          o,
          0.466,
          0.5,
          0.075,
          0.012,
        );
      }
      for (let t = 4; t <= 8; t++)
        e.geo(
          St("#7fe3ff", "srv"),
          new c.BoxGeometry(0.3, 0.014, 0.006),
          -0.06,
          0.12 + t * 0.09,
          0.475,
        );
      (e
        .geo(
          St("#ffb454", "srv2"),
          new c.BoxGeometry(0.05, 0.014, 0.006),
          0.17,
          1.27,
          0.475,
        )
        .geo(
          St("#7ff0b8", "srv3"),
          new c.BoxGeometry(0.05, 0.014, 0.006),
          0.17,
          1.18,
          0.475,
        ),
        e.box(Io, 0, 1.47, 0, 0.62, 0.03, 0.94));
      for (let t = 0; t < 3; t++)
        e.geo(
          St("#7fe3ff", "srvtop"),
          new c.BoxGeometry(0.44, 0.006, 0.02),
          0,
          1.487,
          -0.3 + t * 0.3,
        );
    },
    nvl(e) {
      e.box(ya, 0, 0.81, 0, 0.66, 1.62, 0.96, { r: 0.02 });
      for (let t = 0; t < 18; t++) {
        const o = 0.2 + t * 0.072;
        (e.box(
          t === 8 || t === 9 ? qr : Ue("#1c2026"),
          0,
          o,
          0.482,
          0.58,
          0.058,
          0.01,
        ),
          t !== 8 &&
            t !== 9 &&
            e.geo(
              St("#7ff0b8", "nvl"),
              new c.BoxGeometry(0.4, 0.01, 0.004),
              0.03,
              o,
              0.489,
            ));
      }
      (e
        .box(as, -0.325, 0.81, 0.47, 0.016, 1.6, 0.03)
        .box(as, 0.325, 0.81, 0.47, 0.016, 1.6, 0.03)
        .box(as, 0, 1.61, 0.47, 0.66, 0.02, 0.03),
        e
          .cyl(is, -0.18, 0.85, -0.5, 0.035, 0.035, 1.5, { seg: 10 })
          .cyl(ls, 0.18, 0.85, -0.5, 0.035, 0.035, 1.5, { seg: 10 })
          .box(Io, 0, 1.68, 0, 0.5, 0.12, 0.6));
      for (let t = 0; t < 4; t++)
        e.geo(
          St("#7ff0b8", "nvltop"),
          new c.BoxGeometry(0.4, 0.006, 0.03),
          0,
          1.742,
          -0.22 + t * 0.15,
        );
    },
    kyb(e) {
      (e.box(jt("#2b3038", { roughness: 0.4 }), 0, 0.9, 0, 0.86, 1.8, 1, {
        r: 0.025,
      }),
        e
          .box(as, 0, 1.79, 0.48, 0.84, 0.02, 0.04)
          .box(as, 0, 0.04, 0.48, 0.84, 0.02, 0.04),
        e.box(ya, 0, 0.92, 0.502, 0.78, 1.62, 0.01));
      for (let t = 0; t < 14; t++) {
        const o = -0.36 + t * 0.055;
        (e.box(Ue("#2a2f38"), o, 0.92, 0.508, 0.04, 1.54, 0.01),
          e.geo(
            St("#d8f6ff", "kyb"),
            new c.BoxGeometry(0.008, 1.4, 0.004),
            o + 0.022,
            0.92,
            0.512,
          ));
      }
      e.geo(ns("#7fe3ff"), new c.BoxGeometry(0.8, 0.02, 0.02), 0, 1.72, 0.51)
        .cyl(is, -0.3, 0.9, -0.52, 0.05, 0.05, 1.6, { seg: 10 })
        .cyl(ls, 0.3, 0.9, -0.52, 0.05, 0.05, 1.6, { seg: 10 });
      for (let t = 0; t < 6; t++)
        e.geo(
          St("#d8f6ff", "kybtop"),
          new c.BoxGeometry(0.012, 0.006, 0.86),
          -0.3 + t * 0.12,
          1.803,
          0,
        );
    },
    pho(e) {
      e.box(
        jt("#4a4238", { roughness: 0.3, metalness: 0.6 }),
        0,
        0.06,
        0,
        0.88,
        0.12,
        0.98,
        { r: 0.02 },
      ).box(
        jt("#4a4238", { roughness: 0.3, metalness: 0.6 }),
        0,
        1.82,
        0,
        0.88,
        0.1,
        0.98,
        { r: 0.02 },
      );
      for (const t of [-0.42, 0.42])
        for (const o of [-0.46, 0.46]) e.box(ss, t, 0.94, o, 0.04, 1.76, 0.04);
      e.box(Jl, 0, 0.94, 0, 0.8, 1.66, 0.9);
      for (let t = 0; t < 5; t++)
        e.geo(
          ns("#b9a2ff"),
          new c.CylinderGeometry(0.018, 0.018, 1.6, 6),
          -0.3 + t * 0.15,
          0.94,
          0.1 * (t % 2 ? 1 : -1),
        );
      e.geo(ns("#7fe3ff"), new c.OctahedronGeometry(0.16, 0), 0, 0.94, 0).geo(
        St("#e6dcff", "pho"),
        new c.BoxGeometry(0.8, 0.012, 0.012),
        0,
        1.74,
        0.47,
      );
      for (let t = 0; t < 4; t++)
        e.geo(
          St("#c9b6ff", "photop"),
          new c.BoxGeometry(0.6, 0.006, 0.018),
          0,
          1.873,
          -0.27 + t * 0.18,
        );
    },
    fan(e) {
      (e
        .box(rs, 0, 0.04, 0, 0.36, 0.06, 0.3)
        .box(rs, 0, 0.22, -0.02, 0.04, 0.34, 0.04),
        e
          .box(
            Ue("#e2e5ea", { roughness: 0.5 }),
            0,
            0.62,
            0,
            0.56,
            0.56,
            0.14,
            { r: 0.03 },
          )
          .tor(ss, 0, 0.62, 0.075, 0.24, 0.008, { seg: 28 })
          .tor(ss, 0, 0.62, -0.075, 0.24, 0.008, { seg: 28 }));
    },
    crah(e) {
      e.box(rs, 0, 0.72, 0, 0.86, 1.44, 0.78, { r: 0.03 });
      for (let t = 0; t < 9; t++)
        e.box(Ue("#b9bec5"), 0, 0.25 + t * 0.09, 0.392, 0.74, 0.04, 0.01);
      e.box(Io, 0.22, 1.2, 0.395, 0.22, 0.13, 0.01)
        .geo(ns("#7fe3ff"), new c.PlaneGeometry(0.18, 0.09), 0.22, 1.2, 0.402)
        .cyl(Ue("#9aa0a8"), 0, 1.46, 0, 0.3, 0.32, 0.04, { seg: 20 });
    },
    cdu(e) {
      (e.box(rs, 0, 0.52, 0, 0.82, 1.04, 0.72, { r: 0.03 }),
        e
          .box(Io, -0.18, 0.78, 0.362, 0.3, 0.2, 0.01)
          .geo(
            ns("#7fe3ff"),
            new c.PlaneGeometry(0.26, 0.16),
            -0.18,
            0.78,
            0.369,
          ),
        e
          .cyl(is, 0.2, 0.62, 0.39, 0.06, 0.06, 0.5, {
            seg: 12,
            rx: Math.PI / 2,
          })
          .cyl(ls, 0.32, 0.42, 0.39, 0.06, 0.06, 0.5, {
            seg: 12,
            rx: Math.PI / 2,
          }),
        e
          .cyl(is, -0.3, 1.25, 0, 0.045, 0.045, 0.5, { seg: 10 })
          .cyl(ls, 0.3, 1.25, 0, 0.045, 0.045, 0.5, { seg: 10 })
          .cyl(ss, 0.15, 0.2, 0.25, 0.11, 0.11, 0.22, { seg: 14 }));
    },
    chill(e) {
      e.box(ku, 0, 0.06, 0, 0.94, 0.12, 0.94);
      const t = [];
      for (let o = 0; o <= 10; o++) {
        const n = o / 10;
        t.push(
          new c.Vector2(
            0.42 - 0.16 * Math.sin(n * Math.PI) * 0.9,
            0.12 + n * 1.25,
          ),
        );
      }
      (e
        .geo(
          jt("#d9dde2", { roughness: 0.5, metalness: 0.2 }),
          new c.LatheGeometry(t, 24),
          0,
          0,
          0,
        )
        .cyl(Ue("#5f6670"), 0, 1.39, 0, 0.4, 0.4, 0.06, { seg: 24, open: !0 }),
        e
          .box(is, -0.36, 0.3, 0.36, 0.08, 0.36, 0.08)
          .box(ls, 0.36, 0.3, 0.36, 0.08, 0.36, 0.08));
    },
  },
  ec = {
    fan: {
      geo: () => {
        const e = oe();
        for (let t = 0; t < 5; t++) {
          const o = Math.cos(t * 1.2566),
            n = Math.sin(t * 1.2566);
          e.box(
            Ue("#cfd4db", { roughness: 0.4 }),
            o * 0.115,
            n * 0.115,
            0,
            0.085,
            0.2,
            0.01,
            { dir: [o, n, 0], roll: 0.5 },
          );
        }
        return (
          e.cyl(Ue("#9aa0a8"), 0, 0, 0, 0.04, 0.04, 0.03, { rx: Math.PI / 2 }),
          e.geos()
        );
      },
      pivot: [0, 0.62, 0],
      axis: [0, 0, 1],
      speed: 9,
    },
    crah: {
      geo: () => {
        const e = oe();
        for (let t = 0; t < 6; t++)
          e.box(Ue("#7d848c"), 0, 0, 0, 0.05, 0.012, 0.52, {
            ry: (t * Math.PI) / 6,
          });
        return e.geos();
      },
      pivot: [0, 1.49, 0],
      axis: [0, 1, 0],
      speed: 6,
    },
    chill: {
      geo: () => {
        const e = oe();
        for (let t = 0; t < 4; t++)
          e.box(Ue("#6c737c"), 0, 0, 0, 0.06, 0.012, 0.7, {
            ry: (t * Math.PI) / 4,
          });
        return e.geos();
      },
      pivot: [0, 1.4, 0],
      axis: [0, 1, 0],
      speed: 4,
    },
  },
  Nt = {},
  cs = fe;
function Xr(e, t, o) {
  const n = e.map((f) => f[1]),
    a = e.map((f) => f[0]),
    r = Ko(n, !0),
    i = new c.InstancedBufferAttribute(new Float32Array(t * 4), 4);
  (i.setUsage(c.DynamicDrawUsage), r.setAttribute("aSt", i));
  const l = new c.InstancedMesh(r, a, t);
  return (
    (l.count = 0),
    (l.castShadow = l.receiveShadow = !0),
    (l.frustumCulled = !1),
    (l.userData.st = i),
    l
  );
}
const Mu = (e, t, o) => {
  const n = new c.MeshStandardMaterial({
      color: "#cfd4db",
      roughness: 0.4,
      metalness: 0.5,
      envMapIntensity: 0.7,
    }),
    a = `normalize(vec3(${e.join(",")}))`,
    r = `(uTime*${o.toFixed(2)}*(.8+.4*fract(aSt.y*7.))+aSt.y*6.)`;
  return Xt(
    n,
    Object.assign(
      (i) => {
        (Object.assign(i.uniforms, { uTime: Wr }),
          (i.vertexShader = i.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` +
                Ql +
                `
  vec3 rotA(vec3 p,vec3 a,float t){return p*cos(t)+cross(a,p)*sin(t)+a*dot(a,p)*(1.-cos(t));}`,
            )
            .replace(
              "#include <beginnormal_vertex>",
              `#include <beginnormal_vertex>
  objectNormal=rotA(objectNormal,${a},${r});`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
  {transformed=rotA(transformed,${a},${r})+vec3(${t.join(",")});
   float age=uTime-aSt.w;float k=clamp(age/.42,0.,1.);transformed*=age<0.?1.:max(.02,1.+(sin(k*3.14159*1.15)*.28)*(1.-k)-(1.-k)*(1.-k)*.55);}`,
            )));
      },
      { key: "spin" + e.join() + o },
    ),
  );
};
for (const e of P) {
  if (!e) continue;
  const t = oe();
  Kr[e.id](t);
  const o = t.geos(),
    n = Xr(o, cs);
  if ((ut.add(n), (Nt[e.id] = { mesh: n, list: [] }), ec[e.id])) {
    const a = ec[e.id],
      r = Ko(a.geo().map((f) => f[1])),
      i = new c.InstancedBufferAttribute(new Float32Array(cs * 4), 4);
    (i.setUsage(c.DynamicDrawUsage), r.setAttribute("aSt", i));
    const l = new c.InstancedMesh(r, Mu(a.axis, a.pivot, a.speed), cs);
    ((l.count = 0),
      (l.castShadow = !1),
      bt.push(l),
      (l.frustumCulled = !1),
      (l.userData.st = i),
      ut.add(l),
      (Nt[e.id].spin = l));
  }
}
const mo = new Float32Array(fe).fill(-99);
let He = !0,
  Ct = -1,
  ht = -1;
const V = new c.Vector3(),
  ka = new c.Vector3(1, 1, 1);
function tc(e, t, o, n = s.cells) {
  let a = 0,
    r = 0;
  const i = o.range;
  for (let l = -i; l <= i; l++)
    for (let f = -i; f <= i; f++) {
      const u = e + f,
        g = t + l;
      if (u < 0 || g < 0 || u >= U() || g >= W()) continue;
      P[n[Z(u, g)]]?.kind === "rack" && ((a += f), (r += l));
    }
  return !a && !r
    ? 0
    : Math.abs(a) > Math.abs(r)
      ? a > 0
        ? Math.PI / 2
        : -Math.PI / 2
      : r > 0
        ? Math.PI
        : 0;
}
function pt() {
  He = !1;
  for (const o in Nt) Nt[o].list.length = 0;
  const e = U(),
    t = W();
  for (let o = 0; o < t; o++)
    for (let n = 0; n < e; n++) {
      const a = Z(n, o),
        r = P[s.cells[a]];
      r && Nt[r.id].list.push(a);
    }
  for (const o in Nt) {
    const n = Nt[o],
      a = K[o],
      r = n.mesh,
      i = r.userData.st;
    ((r.count = n.list.length),
      n.spin && (n.spin.count = n.list.length),
      n.list.forEach((l, f) => {
        const u = l % B,
          g = Math.floor(l / B),
          d = a.kind === "cool" ? tc(u, g, a) : 0;
        (Gt.setFromAxisAngle(On, d),
          ct.compose(V.set(u + 0.5, le, -(g + 0.5)), Gt, ka),
          r.setMatrixAt(f, ct));
        const p = a.kind === "rack" ? (st[l] ? 2 : 1 - It[l]) : 0;
        (i.setXYZW(
          f,
          p,
          ve(l * 0.37 + 1),
          l === Ct ? 1 : l === ht ? 0.45 : 0,
          mo[l],
        ),
          n.spin &&
            (n.spin.setMatrixAt(f, ct),
            n.spin.userData.st.setXYZW(f, 0, ve(l * 0.37 + 1), 0, mo[l])));
      }),
      (r.instanceMatrix.needsUpdate = !0),
      (i.needsUpdate = !0),
      n.spin &&
        ((n.spin.instanceMatrix.needsUpdate = !0),
        (n.spin.userData.st.needsUpdate = !0)));
  }
}
const bo = {},
  he = new Uint8Array(fe),
  fs = new Float32Array(fe).fill(-99);
let oo = !0,
  Ma = 1 / 0;
const oc = Ue("#e2b23c", { roughness: 0.6, metalness: 0.1 }),
  ds = (() => {
    const e = oe(),
      t = ss,
      o = 1.98,
      n = 0.46,
      a = Math.hypot(n * 2, o);
    for (const i of [-n, n])
      for (const l of [-n, n]) e.box(t, i, o / 2, l, 0.024, o, 0.024);
    for (const i of [0.66, 1.32, o])
      for (const l of [-1, 1])
        e.box(t, 0, i, l * n, n * 2, 0.018, 0.018).box(
          t,
          l * n,
          i,
          0,
          0.018,
          0.018,
          n * 2,
        );
    for (const i of [-1, 1])
      e.box(t, 0, o / 2, i * n, 0.012, a, 0.012, {
        rz: i * Math.atan2(n * 2, o),
      }).box(t, i * n, o / 2, 0, 0.012, a, 0.012, {
        rx: i * Math.atan2(n * 2, o),
      });
    e.box(oc, 0, 0.675, -n + 0.11, n * 1.9, 0.026, 0.18).box(
      oc,
      0,
      1.335,
      n - 0.11,
      n * 1.9,
      0.026,
      0.18,
    );
    const r = Xr(e.geos(), cs);
    return ((r.visible = !1), ut.add(r), r);
  })();
for (const e of P) {
  if (!e) continue;
  const t = oe();
  Kr[e.id](t);
  const o = Xr(t.geos(), cs);
  ((o.castShadow = !1),
    (o.visible = !1),
    ut.add(o),
    bt.push(o),
    (bo[e.id] = { mesh: o, list: [] }));
}
function Su() {
  he.fill(0);
  for (const e of s.sites) he[e.k] = e.ix;
  oo = !0;
}
const nc = () => {
  const e = nt(),
    t = new Set();
  for (const o of s.sites)
    if (!o.tr) {
      if (t.size >= e) break;
      t.add(o);
    }
  return t;
};
function Cu() {
  if ((L >= Ma && (oo = !0), oo)) {
    ((oo = !1), (Ma = 1 / 0));
    for (const n in bo) bo[n].list.length = 0;
    let t = 0;
    const o = ds.userData.st;
    for (const n of s.sites) {
      if (n.tr) continue;
      const a = fs[n.k];
      if (a > L) {
        Ma = Math.min(Ma, a);
        continue;
      }
      bo[P[n.ix].id].list.push(n);
      const r = n.k % B,
        i = Math.floor(n.k / B);
      (ct.makeTranslation(r + 0.5, le, -(i + 0.5)),
        ds.setMatrixAt(t, ct),
        o.setXYZW(t, 0, ve(n.k * 0.37 + 1), 0, a),
        t++);
    }
    ((ds.count = t),
      (ds.visible = t > 0),
      (ds.instanceMatrix.needsUpdate = !0),
      (o.needsUpdate = !0));
    for (const n in bo) {
      const a = bo[n],
        r = a.mesh,
        i = K[n];
      ((r.count = a.list.length),
        (r.visible = r.count > 0),
        a.list.forEach((l, f) => {
          const u = l.k % B,
            g = Math.floor(l.k / B),
            d = i.kind === "cool" ? tc(u, g, i, eo) : 0;
          (Gt.setFromAxisAngle(On, d),
            ct.compose(V.set(u + 0.5, le, -(g + 0.5)), Gt, ka),
            r.setMatrixAt(f, ct));
        }),
        (r.instanceMatrix.needsUpdate = !0));
    }
  }
  const e = nc();
  for (const t in bo) {
    const o = bo[t];
    if (!o.list.length) continue;
    const n = o.mesh.userData.st;
    (o.list.forEach((a, r) => {
      n.setXYZW(
        r,
        0,
        ve(a.k * 0.37 + 1),
        e.has(a) ? 2 + A(1 - a.left / a.T, 0.02, 1) : 2,
        -99,
      );
    }),
      (n.needsUpdate = !0));
  }
}
const $u = new c.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2),
  We = new c.InstancedMesh(
    $u,
    new c.MeshBasicMaterial({
      color: "#ffffff",
      transparent: !0,
      opacity: 0.55,
      depthWrite: !1,
      fog: !1,
      blending: c.AdditiveBlending,
    }),
    fe,
  );
((We.count = 0),
  (We.frustumCulled = !1),
  (We.renderOrder = 2),
  (We.instanceColor = new c.InstancedBufferAttribute(
    new Float32Array(fe * 3),
    3,
  )),
  ut.add(We),
  bt.push(We),
  Dt.push(We));
let hn = 0;
function Tu() {
  hn = 0;
}
function pn(e, t, o, n = 1) {
  hn >= fe ||
    (ct.makeTranslation(e + 0.5, le + 0.012, -(t + 0.5)),
    We.setMatrixAt(hn, ct),
    We.instanceColor.setXYZ(hn, o.r * n, o.g * n, o.b * n),
    hn++);
}
function Au() {
  ((We.count = hn),
    (We.instanceMatrix.needsUpdate = !0),
    (We.instanceColor.needsUpdate = !0));
}
const Oo = {},
  Sa = new c.MeshBasicMaterial({
    color: "#7fe3ff",
    transparent: !0,
    opacity: 0.35,
    depthWrite: !1,
    fog: !1,
  });
function Lu(e) {
  if (Oo[e]) return Oo[e];
  const t = oe();
  Kr[e](t);
  const o = Ko(t.geos().map((a) => a[1])),
    n = new c.Mesh(o, Sa);
  return (
    (n.visible = !1),
    (n.renderOrder = 3),
    ut.add(n),
    bt.push(n),
    Dt.push(n),
    (Oo[e] = n),
    n
  );
}
const Ca = new c.Group();
Ee.add(Ca);
let us = [],
  hs = [];
const $a = C("#6b6964", { roughness: 0.92 }),
  Zr = ll("#4f6b55", { roughness: 0.5, clearcoat: 0.3 }),
  Qr = C("#9a9a96", { roughness: 0.6, metalness: 0.3 }),
  Ta = Ge("#3b4048", { roughness: 0.45 }),
  Jr = C("#d9d6cf", { roughness: 0.6 }),
  sc = C("#8a5a3c", { roughness: 0.5 }),
  Ht = Ge("#8d939b", { roughness: 0.5, metalness: 0.6 }),
  ei = {
    panel(e, t, o) {
      e.box(Qr, t, 1.05, o, 0.12, 0.75, 0.55, { r: 0.02 })
        .box(Ta, t + 0.07, 1.05, o, 0.02, 0.6, 0.4)
        .cyl(Qr, t, 0.5, o + 0.18, 0.03, 0.03, 0.9, { seg: 6 });
    },
    xfmr(e, t, o) {
      e.box($a, t, 0.06, o, 1.6, 0.12, 1.5).box(Zr, t, 0.62, o, 1.15, 1, 1, {
        r: 0.03,
      });
      for (let n = 0; n < 6; n++)
        e.box(Zr, t - 0.45 + n * 0.18, 0.6, o + 0.55, 0.03, 0.7, 0.12);
      e.box(Zr, t, 1.14, o, 1.2, 0.05, 1.05);
    },
    sub(e, t, o) {
      e.box(C("#7c7a74", { roughness: 1 }), t, 0.04, o, 6, 0.08, 6);
      for (let n = 0; n <= 12; n++) {
        const a = (n / 12) * 6 - 3;
        e.cyl(Ht, t + a, 0.8, o - 3, 0.03, 0.03, 1.6, { seg: 5 })
          .cyl(Ht, t + a, 0.8, o + 3, 0.03, 0.03, 1.6, { seg: 5 })
          .cyl(Ht, t - 3, 0.8, o + a, 0.03, 0.03, 1.6, { seg: 5 })
          .cyl(Ht, t + 3, 0.8, o + a, 0.03, 0.03, 1.6, { seg: 5 });
      }
      for (const n of [0.4, 1.55])
        e.box(Ht, t, n, o - 3, 6, 0.03, 0.03)
          .box(Ht, t, n, o + 3, 6, 0.03, 0.03)
          .box(Ht, t - 3, n, o, 0.03, 0.03, 6)
          .box(Ht, t + 3, n, o, 0.03, 0.03, 6);
      for (let n = 0; n < 3; n++) {
        const a = t - 1.8 + n * 1.8;
        e.box(Ta, a, 0.95, o + 0.6, 1.3, 1.7, 1.2, { r: 0.03 });
        for (let r = 0; r < 5; r++)
          e.box(Ta, a - 0.5 + r * 0.25, 0.9, o + 1.35, 0.04, 1.3, 0.3);
        for (let r = 0; r < 3; r++) {
          const i = a - 0.4 + r * 0.4;
          e.cyl(sc, i, 2.15, o + 0.5, 0.07, 0.1, 0.7, { seg: 8 });
          for (let l = 0; l < 4; l++)
            e.cyl(sc, i, 1.9 + l * 0.15, o + 0.5, 0.14, 0.14, 0.04, {
              seg: 10,
            });
        }
      }
      for (const n of [-2.6, 2.6])
        e.box(Ht, t + n, 2.2, o - 1.6, 0.18, 4.4, 0.18);
      e.box(Ht, t, 4.3, o - 1.6, 5.4, 0.16, 0.16);
    },
    gas(e, t, o) {
      e.box($a, t, 0.06, o, 9.5, 0.12, 4.4).box(
        Jr,
        t - 0.6,
        1.45,
        o,
        6.6,
        2.7,
        2.6,
        { r: 0.05 },
      );
      for (let n = 0; n < 10; n++)
        e.box(
          C("#c6c2ba"),
          t - 3.6 + n * 0.66,
          1.45,
          o + 1.31,
          0.04,
          2.5,
          0.02,
        );
      e.box(C("#8f8c86"), t + 3.5, 1.75, o, 1.6, 3.3, 2.8).cyl(
        C("#9aa0a8", { roughness: 0.5, metalness: 0.4 }),
        t - 3.4,
        3.6,
        o,
        0.55,
        0.6,
        4.4,
        { seg: 16 },
      );
    },
    smr(e, t, o) {
      (e
        .box($a, t, 0.05, o, 12, 0.1, 11)
        .cyl(Jr, t - 2.2, 2.3, o + 1, 2.4, 2.4, 4.6, { seg: 36 })
        .sph(Jr, t - 2.2, 4.6, o + 1, 2.4, {
          seg: 36,
          seg2: 12,
          s: [1, 0.55, 1],
        }),
        e.box(C("#bdb8ae"), t + 2, 1.6, o + 2.6, 4.4, 3.2, 3));
      const n = [];
      for (let a = 0; a <= 14; a++) {
        const r = a / 14;
        n.push(
          new c.Vector2(3.2 - 1.4 * Math.sin(r * Math.PI * 0.82), r * 9.5),
        );
      }
      e.geo(
        C("#cfcac0", { roughness: 0.8, side: c.DoubleSide }),
        new c.LatheGeometry(n, 40),
        t + 2.5,
        0,
        o - 2.4,
      );
    },
    fusion(e, t, o) {
      (e
        .box($a, t, 0.05, o, 17, 0.1, 17)
        .cyl(Ge("#5b636e", { roughness: 0.4 }), t, 0.6, o, 7.2, 7.4, 1.2, {
          seg: 48,
        }),
        e.tor(
          Ge("#c8ced6", { roughness: 0.25, metalness: 1 }),
          t,
          2.4,
          o,
          4.4,
          1.1,
          { rx: Math.PI / 2, seg: 48, seg2: 16 },
        ));
      for (let n = 0; n < 16; n++) {
        const a = (n / 16) * Math.PI * 2;
        e.box(
          Ta,
          t + Math.cos(a) * 4.4,
          2.4,
          o + Math.sin(a) * 4.4,
          0.5,
          2.8,
          1.1,
          { ry: -a },
        );
      }
      e.geo(
        Ze("#c4a8ff", 3.2),
        new c.TorusGeometry(4.4, 0.28, 10, 64).rotateX(Math.PI / 2),
        t,
        2.4,
        o,
      );
    },
  };
function Ru(e, t) {
  const o = U(),
    n = W(),
    a = Math.max(1.2, o * 0.08);
  return {
    xfmr: [a + t * 1.95, -n - 1.7],
    sub: [a + 2.5 + t * 7.4, -n - 7.2],
    gas: [a + 4 + (t % 3) * 10.5, -n - 14.5 - Math.floor(t / 3) * 5.6],
    smr: [a + 5 + (t % 3) * 14.5, -n - 30 - Math.floor(t / 3) * 13.5],
    fusion: [a + 8 + t * 19, -n - 56],
  }[e];
}
function ti() {
  for (const a of us) (a.parent?.remove(a), a.geometry?.dispose());
  ((us = []), (hs = []));
  const e = U(),
    t = W(),
    o = oe(),
    n = new c.Vector3(e + 0.12, 1.4, -Math.min(t, 4) / 2);
  if (!s.plants.panel && s.lvl <= 1) {
    const a = [
        new c.Vector3(-2.38, 0.55, -2.2),
        new c.Vector3(-2.2, 0.04, -2),
        new c.Vector3(-1.2, 0.04, -1.75),
        new c.Vector3(-0.4, 0.05, -1.6),
        new c.Vector3(-0.12, 0.36, -1.55),
        new c.Vector3(0.25, 0.12, -1.5),
        new c.Vector3(0.9, 0.1, -1.35),
      ],
      r = new c.Mesh(
        new c.TubeGeometry(new c.CatmullRomCurve3(a), 40, 0.03, 6),
        C("#e2731f", { roughness: 0.5 }),
      );
    ((r.castShadow = !0),
      Ca.add(r),
      us.push(r),
      hs.push({ pts: a, kw: 1.8, c: "cord" }));
  } else {
    const a = e + 1.3,
      r = 1.4,
      i = new c.Vector3(a, ua - 0.4, r),
      l = new c.Vector3(e + 0.14, 2, -0.6);
    o.cyl(C("#5b4a3a", { roughness: 0.9 }), a, ua / 2, r, 0.08, 0.11, ua, {
      seg: 7,
    })
      .box(C("#5b4a3a"), a, ua - 0.3, r, 0.08, 0.08, 0.9)
      .box(Qr, e + 0.2, 1.7, -0.6, 0.12, 0.4, 0.3);
    const f = [];
    for (let g = 0; g <= 10; g++) {
      const d = g / 10;
      f.push(
        new c.Vector3()
          .lerpVectors(i, l, d)
          .add(V.set(0, -Math.sin(d * Math.PI) * 0.25, 0)),
      );
    }
    const u = new c.Mesh(
      new c.TubeGeometry(new c.CatmullRomCurve3(f), 16, 0.02, 5),
      C("#15171b"),
    );
    (Ca.add(u), us.push(u), hs.push({ pts: f, kw: 48, c: "street" }));
  }
  s.plants.panel && ei.panel(o, e + 0.1, -1.1);
  for (const a of Jt) {
    const r = s.plants[a.id] || 0;
    if (!(!ei[a.id] || a.id === "panel"))
      for (let i = 0; i < r; i++) {
        const [l, f] = Ru(a.id, i);
        ei[a.id](o, l, f);
        const u = A(l, 0.6, e - 0.6),
          g = new c.Vector3(
            l,
            { xfmr: 1.1, sub: 2.3, gas: 2.8, smr: 3.2, fusion: 3.6 }[a.id],
            f,
          ),
          d = [
            g,
            new c.Vector3(l, g.y + 0.5, f),
            new c.Vector3((l + u) / 2, Math.max(g.y, 1.6) + 0.9, (f - t) / 2),
            new c.Vector3(u, 1.5, -t - 0.12),
          ];
        hs.push({ pts: d, kw: a.kw, c: a.id });
      }
  }
  (us.push(...o.flush(Ca)), da());
}
function ac() {
  const e = U(),
    t = W(),
    o = Math.max(e, t) * 0.85 + 14,
    n = e / 2 + 4,
    a = -t / 2 - 2;
  (Object.assign(me.shadow.camera, {
    left: -o,
    right: o,
    top: o,
    bottom: -o,
    near: 1,
    far: o * 4 + 60,
  }),
    me.shadow.camera.updateProjectionMatrix(),
    me.target.position.set(n, 0, a),
    (D.sunR = o * 1.6 + 30),
    me.position.copy(Zo).multiplyScalar(D.sunR).add(me.target.position));
  const r = A(Math.round((o * 90) / 512) * 512, M.shadowMin, M.shadow);
  me.shadow.mapSize.x !== r &&
    (me.shadow.mapSize.set(r, r),
    me.shadow.map?.dispose(),
    (me.shadow.map = null));
}
const ae = { yaw: -0.62, pitch: 0.8 },
  k = {
    t: new c.Vector3(2, 0, -1.5),
    yaw: ae.yaw,
    pitch: ae.pitch,
    dist: 12,
    fit: 12,
    tGoal: new c.Vector3(2, 0, -1.5),
    fitGoal: 12,
  };
let ze = 1,
  qe = !1,
  Qe = !1,
  Ve = !1,
  Ce = null;
const b1 = { on: !1 },
  pe = Y.domElement,
  Fo = new Map();
let Aa = 0,
  gn = null;
const mn = new c.Raycaster(),
  rc = new c.Vector2(),
  _o = new c.Vector3(),
  La = new c.Vector3(),
  ic = new c.Vector3(),
  lc = new c.Vector3();
function bn(e) {
  const t = U(),
    o = W(),
    n = kt(),
    a = [
      [0, 0, 0],
      [t, 0, 0],
      [0, 0, -o],
      [t, 0, -o],
      [0, n, -o],
      [t, n, -o],
      [t, n, 0],
      [0, n, 0],
    ],
    r = O.clone(),
    i = new c.Vector3(t / 2, n * 0.3, -o / 2);
  let l = 12;
  const f = Math.max(1, fo.clientWidth),
    u = qe ? 0.84 : A((f - 2 * 370) / f, 0.26, 0.5),
    g = qe ? 0.26 : 0.5,
    d = 0,
    p = qe ? 0.3 : -0.1,
    h = Math.tan(c.MathUtils.degToRad(O.fov / 2));
  for (let w = 0; w < 12; w++) {
    const x = Math.cos(ae.pitch);
    (r.position.set(
      i.x + Math.sin(ae.yaw) * x * l,
      i.y + Math.sin(ae.pitch) * l,
      i.z + Math.cos(ae.yaw) * x * l,
    ),
      r.lookAt(i),
      r.updateMatrixWorld());
    let y = 9,
      v = -9,
      S = 9,
      F = -9;
    for (const q of a)
      (_o.set(...q).project(r),
        (y = Math.min(y, _o.x)),
        (v = Math.max(v, _o.x)),
        (S = Math.min(S, _o.y)),
        (F = Math.max(F, _o.y)));
    (ic.setFromMatrixColumn(r.matrixWorld, 0),
      lc.setFromMatrixColumn(r.matrixWorld, 1));
    const I = r.position.distanceTo(i);
    (i
      .addScaledVector(ic, ((y + v) / 2 - d) * I * h * O.aspect)
      .addScaledVector(lc, ((S + F) / 2 - p) * I * h),
      (i.y = Math.max(i.y, 0)),
      (l *= A(Math.max((v - y) / 2 / u, (F - S) / 2 / g), 0.55, 1.8)));
  }
  if (!(!isFinite(l) || !isFinite(i.x + i.y + i.z))) {
    {
      const w = Math.cos(ae.pitch),
        x = La.set(
          i.x + Math.sin(ae.yaw) * w * l,
          i.y + Math.sin(ae.pitch) * l,
          i.z + Math.cos(ae.yaw) * w * l,
        ),
        y = _o.subVectors(i, x).normalize(),
        v = n * 0.25;
      if (y.y < -0.001) {
        const S = (v - x.y) / y.y;
        (i.copy(x).addScaledVector(y, S), (l = S));
      }
    }
    (k.tGoal.copy(i),
      (k.fitGoal = Math.max(5, l)),
      e && ((k.fit = k.fitGoal), k.t.copy(k.tGoal)));
  }
}
function Ra() {
  (Tn(!1), (Qe = !1), (ze = 1), (k.yaw = ae.yaw), (k.pitch = ae.pitch), bn(!1));
}
function oi(e, t) {
  const o =
      (O.position.distanceTo(k.t) *
        2 *
        Math.tan(c.MathUtils.degToRad(O.fov / 2))) /
      Math.max(fo.clientHeight, 1),
    n = Math.cos(k.yaw),
    a = Math.sin(k.yaw);
  ((Qe = !0),
    (k.tGoal.x -= n * e * o),
    (k.tGoal.z += a * e * o),
    (k.tGoal.x -= (a * t * o) / Math.max(Math.sin(k.pitch), 0.3)),
    (k.tGoal.z -= (n * t * o) / Math.max(Math.sin(k.pitch), 0.3)));
  const r = U(),
    i = W(),
    l = 8 + Math.max(r, i) * 0.6;
  ((k.tGoal.x = A(k.tGoal.x, -l * 0.6, r + l)),
    (k.tGoal.z = A(k.tGoal.z, -i - l, l * 0.5)),
    k.t.copy(k.tGoal));
}
const w1 = new c.Vector3();
function ni(e, t) {
  const o = Qe || Ve ? 0 : Math.sin(e / 9) * 0.02;
  if (
    (isFinite(k.fit) || (k.fit = isFinite(k.fitGoal) ? k.fitGoal : 12),
    isFinite(k.t.x + k.t.y + k.t.z) ||
      k.t.copy(
        isFinite(k.tGoal.x + k.tGoal.y + k.tGoal.z)
          ? k.tGoal
          : _o.set(2, 0.4, -1.5),
      ),
    Ce && !Qe && !Ve)
  ) {
    Ce.at == null && (Ce.at = e);
    const u = Ki(uo(1.1, 3.9, e - Ce.at));
    ((k.fit = Pn(Ce.d0, k.fitGoal, u)),
      k.t.lerpVectors(Ce.p0, k.tGoal, u),
      zt(
        Mi,
        La.set(_[_.length - 1][0] * 0.62, 0.4, -_[_.length - 1][1] * 0.55),
        "Your gigawatt campus",
        "40 \xD7 28",
        "#7fe3ff",
        u < 0.35,
      ),
      u >= 1 && ((Ce = null), zt(Mi, La, "", "", "", !1)));
  } else
    (Ce && ((Ce = null), zt(Mi, La, "", "", "", !1)),
      (k.fit += (k.fitGoal - k.fit) * (1 - Math.exp(-t * 2.2))),
      Qe || k.t.lerp(k.tGoal, 1 - Math.exp(-t * 2.2)));
  const n = k.fit * ze,
    a = k.yaw + o,
    r = A(k.pitch, 0.18, 1.42),
    i = Math.cos(r);
  (O.position.set(
    k.t.x + Math.sin(a) * i * n,
    Math.max(1.2, k.t.y + Math.sin(r) * n),
    k.t.z + Math.cos(a) * i * n,
  ),
    O.lookAt(k.t),
    Nn.position.copy(O.position));
  const l = O.position.distanceTo(k.t),
    f =
      Math.max(4, Math.hypot(U(), W()) * 0.42) *
      M.focalBand *
      (Ve && et?.r ? et.r : 1);
  ((ho.u.focus.value = l),
    (ho.u.range.value = f),
    ho.u.cocScale.value.set(M.apertureNear, M.aperture),
    br.copy(k.t),
    (Pe.fog.density =
      0.0016 * M.fog * D.fogK * A(30 / Math.max(l, 8), 0.25, 1.6)));
}
const wn = new Set();
(addEventListener("keyup", (e) => wn.delete(e.key.toLowerCase())),
  addEventListener("blur", () => wn.clear()));
function Pu(e) {
  if (!wn.size) return;
  const t = (wn.has("shift") ? 2.4 : 1) * e,
    o = (...r) => r.some((i) => wn.has(i));
  let n = 0,
    a = 0;
  (o("a", "arrowleft") && (n += 1),
    o("d", "arrowright") && (n -= 1),
    o("w", "arrowup") && (a += 1),
    o("s", "arrowdown") && (a -= 1),
    (n || a) && oi(n * t * 520, a * t * 520),
    o("q") && (k.yaw += t * 1.1),
    o("e") && (k.yaw -= t * 1.1),
    o("=", "+") && (ze = A(ze * Math.exp(-t * 1.3), 0.25, 2.4)),
    o("-", "_") && (ze = A(ze * Math.exp(t * 1.3), 0.25, 2.4)),
    o(
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
    ) && ((Qe = !0), Ve && Tn(!1)));
}
let $e = null,
  ye = null;
const cc = [],
  Pa = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), cc.push(e));
  };
(ea.forEach((e) => Pa(e.hit, "link", { L: e })),
  Pa(ga, "board"),
  zn.traverse((e) => {
    e.isMesh && Pa(e, "hut");
  }));
const Eu = (e) => {
  let t = e;
  for (; t.parent; t = t.parent) if (!t.visible) return !1;
  return t === Pe;
};
function Ea(e) {
  const t = pe.getBoundingClientRect();
  (rc.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    mn.setFromCamera(rc, O));
}
function fc() {
  const e = mn.intersectObjects(
    cc.filter((t) => t.visible && Eu(t)),
    !1,
  )[0];
  return e
    ? { ...e.object.userData.hk, point: e.point, dist: e.distance }
    : null;
}
function dc() {
  const e = _[s.lvl + 1];
  if (!e || rt() || $e) return null;
  const t = mn.ray.origin,
    o = mn.ray.direction;
  if (o.y > -1e-5) return null;
  const n = -t.y / o.y,
    a = t.x + o.x * n,
    r = t.z + o.z * n;
  return a < 0 || a > e[0] || r > 0 || r < -e[1] || (a < U() && r > -W())
    ? null
    : e;
}
const Da = (e) => {
  for (const t of Ur) t.visible = e;
};
function ps() {
  const e = mn.ray.origin,
    t = mn.ray.direction;
  if (Math.abs(t.y) < 1e-5) return null;
  const o = (le - e.y) / t.y;
  if (o < 0) return null;
  const n = e.x + t.x * o,
    a = e.z + t.z * o,
    r = Math.floor(n),
    i = Math.floor(-a);
  return r < 0 || i < 0 || r >= U() || i >= W()
    ? null
    : { i: r, j: i, k: Z(r, i) };
}
let Ga = 0.02;
function Du(e) {
  let t = 0;
  for (let o = 0; o < fe; o++) s.cells[o] === e.ix && t++;
  for (const o of s.sites) o.ix === e.ix && t++;
  return t;
}
const $t = (e) =>
  e.kind === "rack" ? Math.round(e.cost * (1 + Ga * Du(e))) : e.cost;
function Uo(e, t) {
  if (he[t]) return null;
  const o = P[s.cells[t]];
  return o
    ? o.kind !== e.kind || o.ix >= e.ix
      ? null
      : Math.max(0, $t(e) - Math.round(o.cost * 0.5))
    : $t(e);
}
const se = (e) => e.gen <= s.gen;
function wo(e, t, o) {
  const n = Uo(e, t);
  if (n == null || !se(e)) return "no";
  if (s.cash < n) return "cash";
  const a = s.cells[t],
    r = wl[e.id] || 5,
    i = { k: t, ix: e.ix, was: a, left: r, T: r, paid: n, tr: 0 };
  return (
    (s.cash -= n),
    yl(e) ? (i.tr = _d().id) : ((s.cells[t] = 0), (mo[t] = -99), (fs[t] = L)),
    s.sites.push(i),
    (he[t] = e.ix),
    (oo = !0),
    a || (s.seen["placed_" + e.id] = 1),
    (m.dirty = !0),
    o || R.place(e.kind),
    "ok"
  );
}
function uc(e) {
  const t = s.sites.find((o) => o.k === e);
  t &&
    ((s.sites = s.sites.filter((o) => o !== t)),
    (he[e] = 0),
    t.tr || ((s.cells[e] = t.was || 0), (mo[e] = t.was ? L : -99)),
    (s.cash += t.paid),
    (oo = !0),
    (He = !0),
    (m.dirty = !0),
    R.sell(),
    vn(e, "+" + $(t.paid), "a"),
    Ct === e && Je(-1));
}
const Ba = (e) =>
  Math.max(
    25,
    Math.round(
      Math.max(e.paid || 0, P[e.ix].cost) *
        vl *
        (e.tr ? 1 : A(e.left / e.T, 0, 1)),
    ),
  );
function Gu(e) {
  const t = s.sites.find((n) => n.k === e);
  if (!t) return;
  const o = Ba(t);
  if (s.cash < o) {
    (Q("Not enough money to finish it now"), R.no());
    return;
  }
  ((s.cash -= o), s.stats.rushed++, ia(t), at());
}
function Bu() {
  if (!s.sites.length) return;
  const e = s.sites.reduce((t, o) => t + Ba(o), 0);
  if (s.cash < e) {
    (Q(`Finishing all of them takes ${$(e)}`), R.no());
    return;
  }
  ((s.cash -= e), (s.stats.rushed += s.sites.length));
  for (const t of [...s.sites]) ia(t);
  at();
}
const gs = (e) =>
  Math.max(
    25,
    Math.round(
      (e.kind === "floor" ? _[e.n][2] : Bt(ft[e.id])) *
        vl *
        A(e.left / e.T, 0, 1),
    ),
  );
function si(e) {
  const t = s.proj.filter((n) => n.kind === e);
  if (!t.length) return;
  const o = t.reduce((n, a) => n + gs(a), 0);
  if (s.cash < o) {
    (Q("Not enough money to finish it now"), R.no());
    return;
  }
  ((s.cash -= o), (s.stats.rushed += t.length));
  for (const n of t) n.left = 0;
  (Dr(0), (Ae = !0));
}
const ms = () => {
  let e = 0;
  const t = U(),
    o = W();
  for (let n = 0; n < o; n++)
    for (let a = 0; a < t; a++) {
      const r = Z(a, n);
      !s.cells[r] && !he[r] && e++;
    }
  return e;
};
function ai(e) {
  if (he[e]) {
    uc(e);
    return;
  }
  const t = P[s.cells[e]];
  t &&
    ((s.cash += Math.round(t.cost * 0.5)),
    (s.cells[e] = 0),
    (mo[e] = -99),
    (m.dirty = !0),
    R.sell(),
    vn(e, "+" + $(Math.round(t.cost * 0.5)), "a"),
    Ct === e && Je(-1));
}
function bs(e, t = 0) {
  return P.filter((o) => o && o.kind === e && se(o) && o.cls >= t).at(-1);
}
function xo(e) {
  if (!e) return -1;
  const t = U(),
    o = W();
  let n = -1,
    a = -1e9;
  for (let r = 0; r < o; r++)
    for (let i = 0; i < t; i++) {
      const l = Z(i, r);
      if (s.cells[l] || he[l]) continue;
      let f = 0;
      if (e.kind === "rack") {
        let u = 0;
        for (let g = -2; g <= 2; g++)
          for (let d = -2; d <= 2; d++) {
            const p = i + d,
              h = r + g;
            if (p < 0 || h < 0 || p >= t || h >= o) continue;
            const w = Z(p, h),
              x = P[eo[w]];
            x?.kind === "cool" &&
              x.cls >= e.cls &&
              Math.max(Math.abs(d), Math.abs(g)) <= x.range &&
              (u += Er[w]);
          }
        f = (u >= e.kw ? 100 : (u / e.kw) * 60) - r * 0.6 - i * 0.2;
      } else {
        let u = 0;
        for (let g = -e.range; g <= e.range; g++)
          for (let d = -e.range; d <= e.range; d++) {
            const p = i + d,
              h = r + g;
            if (p < 0 || h < 0 || p >= t || h >= o) continue;
            const w = Z(p, h),
              x = P[eo[w]];
            x?.kind === "rack" &&
              x.cls <= e.cls &&
              (u += (Al[w] - Ll[w]) * (1 + x.cls));
          }
        f = u - r * 0.01 - i * 0.005;
      }
      f > a && ((a = f), (n = l));
    }
  return a > 0 || e.kind === "rack" ? n : -1;
}
function hc(e) {
  const t = xo(e);
  if (t >= 0 || !e) return t;
  const o = U(),
    n = W();
  let a = -1,
    r = -1e9;
  if (ms() <= 0) {
    for (let i = 0; i < n; i++)
      for (let l = 0; l < o; l++) {
        const f = Z(l, i);
        if (Uo(e, f) == null) continue;
        let u = -P[s.cells[f]].ix * 100 - i * 0.6 - l * 0.2;
        if (e.kind === "cool")
          for (let g = -1; g <= 1; g++)
            for (let d = -1; d <= 1; d++) {
              const p = l + d,
                h = i + g;
              p >= 0 &&
                h >= 0 &&
                p < o &&
                h < n &&
                P[s.cells[Z(p, h)]]?.kind === "rack" &&
                (u += 10);
            }
        u > r && ((r = u), (a = f));
      }
    return a;
  }
  if (e.kind !== "cool") return t;
  for (let i = 0; i < n; i++)
    for (let l = 0; l < o; l++) {
      const f = Z(l, i);
      if (s.cells[f] || he[f]) continue;
      let u = 0;
      for (let d = -1; d <= 1; d++)
        for (let p = -1; p <= 1; p++) {
          const h = l + p,
            w = i + d;
          (p || d) &&
            h >= 0 &&
            w >= 0 &&
            h < o &&
            w < n &&
            !s.cells[Z(h, w)] &&
            !he[Z(h, w)] &&
            u++;
        }
      const g = u * 10 - i * 0.6 - l * 0.2;
      g > r && ((r = g), (a = f));
    }
  return a;
}
function ws(e, t) {
  const o = t % B,
    n = Math.floor(t / B),
    a = U(),
    r = W();
  let i = 0,
    l = !1;
  for (let f = -2; f <= 2; f++)
    for (let u = -2; u <= 2; u++) {
      if (!u && !f) continue;
      const g = o + u,
        d = n + f;
      if (g < 0 || d < 0 || g >= a || d >= r) continue;
      const p = Z(g, d),
        h = P[eo[p]];
      h?.kind !== "cool" ||
        Math.max(Math.abs(u), Math.abs(f)) > h.range ||
        (h.cls >= e.cls ? (i += Er[p]) : (l = !0));
    }
  return { f: A(i / e.kw, 0, 1), wrong: l };
}
const xs = b("#tip");
let vs = null,
  Tt = null,
  ys = null,
  no = null,
  vo = null;
function Vo(e, t, o) {
  ((xs.innerHTML = o),
    (xs.style.left = e + "px"),
    (xs.style.top = t + "px"),
    xs.classList.add("on"));
}
function jo() {
  xs.classList.remove("on");
}
const Ia = (e) =>
  e.st === "load" ? xl - e.t + on : e.st === "road" ? on - e.t : 0;
function No(e) {
  let t = 0,
    o = 0;
  for (const n of e) P[n.ix].kind === "rack" ? t++ : o++;
  return (
    [t ? je(t, "rack") : "", o ? je(o, "cooler") : ""]
      .filter(Boolean)
      .join(", ") || "nothing"
  );
}
function pc(e) {
  const t = Rs[e],
    o = t && s.trucks.find((n) => n.id === t.id);
  return o
    ? o.st === "curb"
      ? `<b>Delivery</b> \xB7 ${No(Ot(o))} \xB7 <span class="g">click to sign for it</span>`
      : `<b>Delivery</b> \xB7 ${No(Ot(o))} \xB7 here in ${te(Ia(o))}`
    : "<b>A truck</b> \xB7 on its way out";
}
function gc(e) {
  const t = s.sites.find((r) => r.k === e);
  if (!t) return "";
  const o = P[t.ix];
  if (t.tr) {
    const r = s.trucks.find((i) => i.id === t.tr);
    return (
      `<b>${o.name}</b> \xB7 ` +
      (r?.st === "curb"
        ? 'on the truck at the curb \xB7 <span class="g">sign for it</span>'
        : `on its way \xB7 here in ${te(r ? Ia(r) : on)}`)
    );
  }
  const n = Ft().indexOf(t),
    a = nt();
  return (
    `<b>${o.name}</b> \xB7 ` +
    (n < a
      ? `being built \xB7 ${Math.round((1 - t.left / t.T) * 100)}% \xB7 ${te(t.left / ue())} to go`
      : `waiting for a crew (${n - a + 1} in line)`)
  );
}
function Iu(e) {
  if (he[e]) return gc(e);
  const t = P[s.cells[e]];
  if (!t) return "";
  if (t.kind === "rack") {
    const n = It[e];
    return st[e]
      ? `<b>${t.name}</b> \xB7 <span class="r">down</span> \xB7 click to bring it back`
      : `<b>${t.name}</b> \xB7 ${Te(t.tps * de.tps * (0.25 + 0.75 * n))} tok/s \xB7 ` +
          (n < 0.98
            ? `<span class="r">${Math.round(n * 100)}% cooled, throttling</span>`
            : '<span class="g">cooled</span>');
  }
  const o = t.kw * de.cool;
  return `<b>${t.name}</b> \xB7 ${N(Lo[e])} of ${N(o)} used`;
}
function Ou() {
  return s.staff.books !== 2 && s.bill >= 0.01
    ? `<b>Fiber hut</b> \xB7 your users owe you ${$(s.bill)} \xB7 <span class="g">click to bill them</span>`
    : s.res.market && we.market.brand
      ? `<b>Fiber hut</b> \xB7 every request comes in here; the green ones come through ${we.market.brand}`
      : "<b>Fiber hut</b> \xB7 every request your users send comes in here";
}
const mc = () => {
  const e = fc();
  return $e && e && e.kind !== "link" && ps() ? null : e;
};
function bc(e) {
  (Ea(e), (vo = e), Da(!1));
  const t = mc(),
    o = t?.kind === "link" ? t.L : null;
  if (
    (o !== vs && (vs?.over(!1), o?.over(!0), (vs = o)),
    (G.hotT = t?.kind === "board" ? 1 : 0),
    t?.kind === "board")
  ) {
    const r = we.billboard[zl()];
    (jo(),
      r.kind === "game"
        ? (dn(null),
          Vo(
            e.clientX,
            e.clientY,
            "<b>Garage to Gigawatt</b> \xB7 the game you are playing",
          ))
        : dn(r, e.clientX, e.clientY),
      (pe.style.cursor = r.url ? "pointer" : ""));
    return;
  }
  dn(null);
  const n = t ? null : ps(),
    a = n ? n.k : -1;
  if ((a !== ht && ((ht = a), (He = !0)), t)) {
    ((pe.style.cursor = "pointer"),
      Vo(
        e.clientX,
        e.clientY,
        t.kind === "link"
          ? "<b>@RYANSAEL</b> on X"
          : t.kind === "truck"
            ? pc(t.ti)
            : t.kind === "hut"
              ? Ou()
              : "",
      ));
    return;
  }
  if (!n) {
    const r = t ? null : dc();
    if ((Da(!!r), r)) {
      ((pe.style.cursor = "pointer"),
        Vo(
          e.clientX,
          e.clientY,
          `<b>Expand to ${"the " + r[3].toLowerCase()}</b> \xB7 ${r[0]} by ${r[1]} tiles \xB7 ${$(r[2])}${s.cash < r[2] ? ' \xB7 <span class="r">not enough money</span>' : " \xB7 click"}`,
        ));
      return;
    }
    ((pe.style.cursor = ""), jo());
    return;
  }
  if ($e) {
    const r = K[$e],
      i = Uo(r, n.k);
    if (
      ((pe.style.cursor =
        i == null ? (s.cells[n.k] || he[n.k] ? "pointer" : "") : "crosshair"),
      i == null)
    )
      Vo(
        e.clientX,
        e.clientY,
        he[n.k]
          ? gc(n.k)
          : s.cells[n.k]
            ? "Occupied \xB7 click it to upgrade or sell"
            : "",
      );
    else {
      let l = `<b>${r.name}</b> \xB7 ${$(i)}`;
      if ((s.cells[n.k] && (l += " (trade-in)"), r.kind === "rack")) {
        const f = ws(r, n.k);
        l +=
          f.f >= 0.98
            ? ' \xB7 <span class="g">cooled here</span>'
            : f.wrong
              ? ` \xB7 <span class="r">needs ${_n[r.cls]}</span>`
              : ` \xB7 <span class="r">${Math.round(f.f * 100)}% cooled here</span>`;
      } else
        l += ` \xB7 cools ${N(r.kw * de.cool)} ${r.range > 1 ? "two tiles out" : "round it"}`;
      (r.kind === "rack" &&
        !s.cells[n.k] &&
        m.draw + r.kw > m.cap &&
        (l += ` \xB7 <span class="r">over your ${N(m.cap)} of power</span>`),
        s.cash < i && (l += ' \xB7 <span class="r">not enough money</span>'),
        Vo(e.clientX, e.clientY, l));
    }
  } else {
    pe.style.cursor = s.cells[n.k] || he[n.k] ? "pointer" : "";
    const r = Iu(n.k);
    r ? Vo(e.clientX, e.clientY, r) : jo();
  }
}
(pe.addEventListener("contextmenu", (e) => e.preventDefault()),
  pe.addEventListener("pointerleave", () => Da(!1)),
  pe.addEventListener("pointerleave", () => {
    (vs?.over(!1),
      (vs = null),
      jo(),
      dn(null),
      (G.hotT = 0),
      (ht = -1),
      (He = !0),
      (vo = null));
  }),
  pe.addEventListener("pointerdown", (e) => {
    R.wake();
    try {
      pe.setPointerCapture(e.pointerId);
    } catch {}
    if (
      (jo(),
      Fo.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (gn = null),
      e.button !== 0 || e.shiftKey || Fo.size !== 1)
    ) {
      ((Tt = null), (ye = null));
      return;
    }
    (Ea(e),
      (ys = mc()),
      (no = ys ? null : ps()),
      (ri = ys || no ? null : dc()),
      (Tt = [e.clientX, e.clientY, performance.now()]),
      $e && no && (ye = { i0: no.i, j0: no.j, i1: no.i, j1: no.j }));
  }),
  pe.addEventListener("pointermove", (e) => {
    const t = Fo.get(e.pointerId);
    if (!t) {
      bc(e);
      return;
    }
    const o = e.clientX - t[0],
      n = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), ye)) {
      Ea(e);
      const a = ps();
      (a && ((ye.i1 = a.i), (ye.j1 = a.j)), (vo = e));
      return;
    }
    if (
      (Tt &&
        Math.hypot(e.clientX - Tt[0], e.clientY - Tt[1]) > 6 &&
        (Tt = null),
      !Tt)
    ) {
      if (((Qe = !0), Ve && Tn(!1), Fo.size === 2)) {
        const [a, r] = [...Fo.values()],
          i = Math.hypot(a[0] - r[0], a[1] - r[1]),
          l = [(a[0] + r[0]) / 2, (a[1] + r[1]) / 2];
        (Aa && (ze = A((ze * Aa) / i, 0.25, 2.4)),
          (Aa = i),
          gn && oi(l[0] - gn[0], l[1] - gn[1]),
          (gn = l));
        return;
      }
      t[2]
        ? oi(o, n)
        : ((k.yaw -= o * 0.004),
          (k.pitch = A(k.pitch + n * 0.003, 0.18, 1.42)));
    }
  }));
let ri = null;
const wc = (e) => {
  const t = ye;
  (t
    ? (_u(t), (ye = null))
    : Tt && Fo.size === 1 && performance.now() - Tt[2] < 500 && Fu(ys, no),
    (Tt = null),
    (ys = null),
    (no = null),
    Fo.delete(e.pointerId),
    (Aa = 0),
    (gn = null));
};
(pe.addEventListener("pointerup", wc),
  pe.addEventListener("pointercancel", (e) => {
    ((Tt = null), (ye = null), wc(e));
  }),
  pe.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        (Qe = !0),
        Ve && Tn(!1),
        (ze = A(
          ze * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.25,
          2.4,
        )));
    },
    { passive: !1 },
  ),
  pe.addEventListener("dblclick", (e) => {
    (Ea(e), !fc() && !ps() && Ra());
  }));
function Fu(e, t) {
  if (e) {
    if (e.kind === "link") window.open(Xo, "_blank", "noopener");
    else if (e.kind === "hut") {
      if (s.staff.books !== 2 && _t("you")) return;
      s.res.market &&
        we.market.url &&
        window.open(we.market.url, "_blank", "noopener");
    } else if (e.kind === "board") {
      const o = we.billboard[zl()];
      if (
        matchMedia("(pointer:coarse)").matches &&
        o.kind !== "game" &&
        (G.tapId !== o.id || L - G.tapAt > 5)
      ) {
        ((G.tapId = o.id),
          (G.tapAt = L),
          dn(o, innerWidth / 2 - 170, 90),
          setTimeout(() => {
            L - G.tapAt > 4.5 && dn(null);
          }, 5200));
        return;
      }
      if (o.url && (window.open(o.url, "_blank", "noopener"), window.umami))
        try {
          umami.track("gigawatt-billboard", { face: o.id });
        } catch {}
    } else
      e.kind === "truck" && (go("you") || Q(pc(e.ti).replace(/<[^>]+>/g, "")));
    return;
  }
  if (!t) {
    $e ? Wt(null) : ri ? Nu(ri) : Je(-1);
    return;
  }
  if ($e) {
    const o = K[$e],
      n = wo(o, t.k);
    n === "cash"
      ? (Q(`Not enough money for a ${o.name.toLowerCase()}`), R.no())
      : n === "no"
        ? (s.cells[t.k] || he[t.k]) && (Wt(null), Je(t.k))
        : at();
    return;
  }
  if (st[t.k]) {
    zd(t.k, "you");
    return;
  }
  Je(s.cells[t.k] || he[t.k] ? t.k : -1);
}
function _u(e) {
  const t = K[$e];
  if (!t) return;
  let o = 0,
    n = !1;
  const a = Math.min(e.i0, e.i1),
    r = Math.max(e.i0, e.i1),
    i = Math.min(e.j0, e.j1),
    l = Math.max(e.j0, e.j1);
  for (let f = i; f <= l; f++)
    for (let u = a; u <= r; u++) {
      const g = Z(u, f);
      if (Uo(t, g) == null) continue;
      const d = wo(t, g, !0);
      d === "ok" ? o++ : d === "cash" && (n = !0);
    }
  (o && (R.place(t.kind, o), at()),
    n &&
      Q(
        o
          ? `Placed ${o}: the money ran out`
          : `Not enough money for a ${t.name.toLowerCase()}`,
      ));
}
function at() {
  (Ne(), pt(), De(), ff(), (Ae = !0));
}
function Je(e) {
  ((Ct = e), (He = !0));
  const t = b("#pop");
  if (e < 0) {
    t.hidden = !0;
    return;
  }
  ((t.hidden = !1), ks());
}
function ks() {
  const e = Ct;
  if (he[e]) {
    const r = s.sites.find((p) => p.k === e);
    if (!r) {
      Je(-1);
      return;
    }
    const i = P[r.ix],
      l = nt(),
      f = Ft().indexOf(r),
      u = r.tr ? s.trucks.find((p) => p.id === r.tr) : null,
      g = b("#pop-up"),
      d = Ba(r);
    ((b("#pop-n").textContent = i.name),
      (b("#pop-k").textContent = r.tr ? "on order" : "being built"),
      (g.disabled = !1),
      u?.st === "curb"
        ? ((b("#pop-s").innerHTML =
            `On the truck at the curb. Sign for it, and a crew puts it up in <b>${te(r.T / ue())}</b>.`),
          g.classList.remove("poor"),
          (g.textContent = "Sign for it"),
          (g.title = "Sign for every delivery at the curb"),
          (g.onclick = () => {
            (go("you"), ks());
          }))
        : ((b("#pop-s").innerHTML = r.tr
            ? `On its way: the truck is here in <b>${te(u ? Ia(u) : on)}</b>, then a crew puts it up in <b>${te(r.T / ue())}</b>. Or pay to finish it now.`
            : f < l
              ? `<b>${Math.round((1 - r.left / r.T) * 100)}%</b> built \xB7 <b>${te(r.left / ue())}</b> to go.<br>It starts ${i.kind === "rack" ? "serving" : "cooling"} the moment it is done. Or pay to finish it now.`
              : `Waiting for a crew: <b>${f - l + 1}</b> in line. You have ${je(l, "building crew")}${Rt() ? ", and can hire more in Staff" : ""}.`),
          (g.textContent = `Finish \xB7 ${$(d)}`),
          (g.title = "Pay to finish it now"),
          g.classList.toggle("poor", s.cash < d),
          (g.onclick = () => Gu(e))),
      (b("#pop-sell").textContent = "Cancel \xB7 " + $(r.paid)),
      (b("#pop-sell").onclick = () => {
        (uc(e), at());
      }));
    return;
  }
  const t = P[s.cells[e]];
  if (!t) {
    Je(-1);
    return;
  }
  (b("#pop-up").classList.remove("poor"),
    (b("#pop-n").textContent = t.name),
    (b("#pop-k").textContent =
      t.kind === "rack"
        ? t.gpus > 1
          ? t.gpus + " GPUs"
          : "1 GPU"
        : "cooling"));
  let o;
  if (t.kind === "rack") {
    const r = It[e],
      i = t.tps * de.tps * (0.25 + 0.75 * r);
    o =
      `<b>${Te(i)}</b> tokens a second \xB7 draws <b>${N(t.kw)}</b><br>` +
      (r < 0.98
        ? `<span class="r">Only ${Math.round(r * 100)}% cooled: running at ${Math.round((0.25 + 0.75 * r) * 100)}%.</span> ` +
          (ws(t, e).wrong
            ? `It needs ${_n[t.cls]} or better.`
            : "Put a cooler next to it.")
        : '<span class="g">Fully cooled.</span>');
  } else {
    const r = t.kw * de.cool;
    o =
      `Cools <b>${N(r)}</b> ${t.range > 1 ? "two tiles out" : "across the 8 tiles round it"}.<br>Using <b>${N(Lo[e])}</b> (${Math.round((Lo[e] / r) * 100)}%)` +
      (t.cls < 3
        ? `, enough for racks up to ${["PCs", "servers", "576-GPU racks"][t.cls]}.`
        : ".");
  }
  b("#pop-s").innerHTML = o;
  const n = bs(t.kind, 0),
    a = b("#pop-up");
  if (n && n.ix > t.ix) {
    const r = Uo(n, e) ?? $t(n);
    ((a.disabled = !1),
      (a.textContent = `${(n.name.split(" ")[0] === "Gaming", n.name)} \xB7 ${$(r)}`),
      (a.title = `Swap for a ${n.name}`),
      (a.onclick = () => {
        const i = wo(n, e);
        i === "cash"
          ? (Q("Not enough money"), R.no())
          : i === "ok" && (at(), ks());
      }));
  } else
    ((a.disabled = !0),
      (a.textContent = t.kind === "rack" ? "Best rack yet" : "Best cooler yet"),
      (a.onclick = null));
  ((b("#pop-sell").textContent = "Sell \xB7 " + $(Math.round(t.cost * 0.5))),
    (b("#pop-sell").onclick = () => {
      (ai(Ct), at());
    }));
}
let xc = 0;
function Uu() {
  if (Ct < 0) return;
  const e = Ct,
    t = e % B,
    o = Math.floor(e / B),
    n = P[he[e] || s.cells[e]];
  if (!n) {
    Je(-1);
    return;
  }
  (he[e] && L - xc > 0.25 && ((xc = L), ks()),
    V.set(t + 0.5, le + (n.kind === "rack" ? 1.9 : 1.6), -(o + 0.5)).project(
      O,
    ));
  const a = b("#pop"),
    r = pe.getBoundingClientRect();
  if (V.z > 1) {
    a.style.opacity = 0;
    return;
  }
  ((a.style.opacity = 1),
    (a.style.left = A((V.x * 0.5 + 0.5) * r.width, 130, r.width - 130) + "px"),
    (a.style.top = A((-V.y * 0.5 + 0.5) * r.height, 150, r.height) + "px"));
}
function Wt(e) {
  (($e = e), e && Je(-1), (ye = null), (Ae = !0));
  for (const t of Object.values(Oo)) t.visible = !1;
  (vo && bc(vo), e || jo());
}
const vc = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
function yc(e) {
  if (!isFinite(e)) return "\u221E";
  const t = Math.abs(e);
  if (t < 1e3)
    return t < 100 && t % 1 ? e.toFixed(t < 10 ? 2 : 1) : String(Math.round(e));
  let o = 0,
    n = t;
  for (; n >= 999.5 && o < vc.length - 1;) ((n /= 1e3), o++);
  return (
    (e < 0 ? "-" : "") +
    (n < 9.995 ? n.toFixed(2) : n < 99.95 ? n.toFixed(1) : Math.round(n)) +
    vc[o]
  );
}
const $ = (e) =>
    (e < 0 ? "-$" : "$") +
    (Math.abs(e) < 100 && Math.abs(e) % 1
      ? Math.abs(e).toFixed(2)
      : yc(Math.abs(e))),
  Te = (e) => yc(e),
  N = (e) =>
    e < 1
      ? Math.round(e * 1e3) + " W"
      : e < 1e3
        ? (e < 10 ? e.toFixed(1) : Math.round(e)) + " kW"
        : e < 1e6
          ? ((e /= 1e3) < 10
              ? e.toFixed(2)
              : e < 100
                ? e.toFixed(1)
                : Math.round(e)) + " MW"
          : (e / 1e6).toFixed(2) + " GW",
  Oa = (e) => (
    (e = Math.max(0, Math.round(e))),
    e < 60
      ? e + " s"
      : e < 3600
        ? Math.floor(e / 60) + " min " + String(e % 60).padStart(2, "0") + " s"
        : Math.floor(e / 3600) +
          " h " +
          String(Math.floor((e % 3600) / 60)).padStart(2, "0") +
          " min"
  ),
  yo = (e) => {
    e = Math.max(0, Math.round(e));
    const t = Math.floor(e / 3600),
      o = Math.floor((e % 3600) / 60),
      n = e % 60;
    return t
      ? `${t}:${String(o).padStart(2, "0")}:${String(n).padStart(2, "0")}`
      : `${o}:${String(n).padStart(2, "0")}`;
  },
  je = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`,
  te = (e) => (e < 59.5 ? Math.max(1, Math.ceil(e - 0.05)) + " s" : yo(e)),
  ge = (e) => {
    const t = s.lab
      .replace(/[^\w\s-]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    let o = t[0] || "Model";
    return (
      o.length < 4 &&
        t.length > 1 &&
        (o = t
          .map((n) => n[0])
          .join("")
          .toUpperCase()),
      `${o}-${e + 1}`
    );
  },
  At = {
    pc: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 5v22M25 5v22M7 11h18M7 20h18"/><rect x="10" y="12.5" width="6" height="7" rx="1" stroke="#ff9ad5"/><rect x="18" y="14" width="5" height="4" rx=".8"/></svg>',
    srv: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="4" width="14" height="24" rx="1.5"/><path d="M11 13h10M11 16h10M11 19h10" stroke="#7fe3ff"/></svg>',
    nvl: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="3" width="16" height="26" rx="1.2"/><path d="M11 7h10M11 10h10M11 13h10M11 19h10M11 22h10M11 25h10" stroke="#7ff0b8"/><path d="M8 3v26M24 3v26" stroke="#d9a75a"/></svg>',
    kyb: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="3" width="20" height="26" rx="1.2"/><path d="M10 7v18M13 7v18M16 7v18M19 7v18M22 7v18" stroke="#bfefff"/></svg>',
    pho: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="3" width="18" height="26" rx="1.5"/><path d="M12 6v20M16 6v20M20 6v20" stroke="#b9a2ff"/><path d="m16 12 3 4-3 4-3-4z" stroke="#7fe3ff"/></svg>',
    fan: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="5" width="20" height="20" rx="3"/><circle cx="16" cy="15" r="1.6"/><path d="M16 13.4c0-3 2-5 4-4M17.6 15c3 0 5 2 4 4M16 16.6c0 3-2 5-4 4M14.4 15c-3 0-5-2-4-4" stroke="#7fe3ff"/><path d="M13 25l-2 3h10l-2-3"/></svg>',
    crah: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="4" width="18" height="24" rx="1.5"/><path d="M10 12h12M10 15h12M10 18h12M10 21h12" stroke="#7fe3ff"/><circle cx="16" cy="8" r="2"/></svg>',
    cdu: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="9" width="20" height="18" rx="1.5"/><path d="M11 9V4M21 9V4" /><path d="M11 4h-3" stroke="#5aa8ff"/><path d="M21 4h3" stroke="#ff9a5a"/><rect x="9" y="13" width="7" height="4" rx=".6" stroke="#7fe3ff"/><circle cx="20" cy="21" r="2.5"/></svg>',
    chill:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 28c2-6 2-12 0-18h14c-2 6-2 12 0 18z"/><path d="M8 10h16"/><path d="M12 6c1-2 3-2 4 0s3 2 4 0" stroke="#bfefff"/></svg>',
    plug: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v6M20 4v6M9 10h14v5a7 7 0 0 1-14 0zM16 22v6" stroke="#ffb454"/></svg>',
    bolt: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 3 8 18h7l-2 11 11-16h-7z" stroke="#ffb454"/></svg>',
    xfmr: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="10" width="20" height="16" rx="1.5"/><path d="M9 14v8M12 14v8M15 14v8" stroke="#7ff0b8"/><path d="M20 10V6M24 10V7" /></svg>',
    sub: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 27h22M8 27V9M24 27V9M6 9h20M10 9l6-5 6 5"/><path d="M12 15h8v8h-8z" stroke="#ffb454"/></svg>',
    gas: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="14" width="18" height="12" rx="1.2"/><path d="M22 18h6v8h-6M8 14V5h4v9"/><path d="M9 3c1-1 2 0 2-1" stroke="#ffb454"/></svg>',
    smr: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 27V17a6 6 0 0 1 12 0v10"/><path d="M18 27c1.6-5 1.6-10 0-15h9c-1.6 5-1.6 10 0 15z"/><path d="M20 8c1-2 3-2 4 0" stroke="#bfefff"/><path d="M3 27h26"/></svg>',
    fusion:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="16" cy="16" rx="12" ry="6"/><ellipse cx="16" cy="16" rx="6" ry="2.4" stroke="#c4a8ff"/></svg>',
    res: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4h8M14 4v8l-7 12a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-7-12V4"/><path d="M10 21h12" stroke="#7fe3ff"/></svg>',
    grow: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="9" width="14" height="14" rx="1"/><path d="M19 9h8v18H5v-4" stroke="#7fe3ff" stroke-dasharray="2.4 2"/></svg>',
    lock: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="14" width="14" height="12" rx="2"/><path d="M12 14v-3a4 4 0 0 1 8 0v3"/></svg>',
    person:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="16" cy="10" r="4.5"/><path d="M7 27c1-6 4.5-9 9-9s8 3 9 9" stroke="#7fe3ff"/></svg>',
    model:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="8" width="16" height="16" rx="2.5"/><path d="M12 4v4M20 4v4M12 24v4M20 24v4M4 12h4M4 20h4M24 12h4M24 20h4"/><path d="m16 11 1.4 3.6L21 16l-3.6 1.4L16 21l-1.4-3.6L11 16l3.6-1.4z" stroke="#ffb454"/></svg>',
    wrench:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 4.5a6 6 0 0 0-5.7 7.9L5 22.7a2.5 2.5 0 0 0 3.5 3.5l10.3-10.3a6 6 0 0 0 7.9-5.7l-3.5 3.5-3.6-.8-.8-3.6z" stroke="#ff8f7a"/></svg>',
    crane:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 28V6l16 4M8 10h18M22 10v6M5 28h8"/><rect x="19" y="16" width="6" height="5" rx="1" stroke="#ffb454"/></svg>',
    robot:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="8" width="14" height="11" rx="3"/><path d="M13 13.5h.01M19 13.5h.01" stroke="#7fe3ff" stroke-width="2.8" stroke-linecap="round"/><path d="M16 4v4M11 19v5M21 19v5M7 13H5M27 13h-2"/></svg>',
    truck:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9h15v12H3zM18 13h6l4 4v4H18z"/><circle cx="8" cy="23" r="2.4" stroke="#ffb454"/><circle cx="23" cy="23" r="2.4" stroke="#ffb454"/></svg>',
    bill: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 4h16v24l-4-2.5-4 2.5-4-2.5L8 28z"/><path d="M12 10h8M12 14h8M12 18h5" stroke="#ffb454"/></svg>',
  };
let Ae = !0,
  Fe = "build",
  ii = null;
const Lt = [...document.querySelectorAll(".tabs button")];
Lt.forEach(
  (e) =>
    (e.onclick = () => {
      ((Fe = e.dataset.tab),
        Lt.forEach((t) => t.classList.toggle("on", t === e)));
      for (const t of ["build", "power", "research", "staff"])
        b("#pane-" + t).hidden = t !== Fe;
      ((Ae = !0), R.tick());
    }),
);
const Vu = {
    pc: "PC",
    srv: "Server",
    nvl: "72-GPU",
    kyb: "576-GPU",
    pho: "Photonic",
    fan: "Box fan",
    crah: "Air handler",
    cdu: "Liquid",
    chill: "Chiller",
  },
  kc = ["pc", "srv", "nvl", "kyb", "pho"],
  Mc = ["fan", "crah", "cdu", "chill"],
  Sc = [...kc, ...Mc],
  Cc = (e) => {
    const t = e.filter((n) => se(K[n])),
      o = e.find((n) => !se(K[n]));
    return o ? [...t, o] : t;
  };
function ju() {
  const e = b("#pane-build"),
    t = (a) => {
      const r = K[a],
        i = !se(r),
        l = Sc.indexOf(a) + 1;
      return `<button class="item${$e === a ? " on" : ""}${i ? " lock" : ""}${!i && !s.seen["tool_" + a] && r.gen > 0 ? " new" : ""}" data-id="${a}" title="${i ? `Unlocks with v${r.gen + 1}` : r.name}"><kbd>${l}</kbd>${i ? At.lock : At[a]}<b>${Vu[a]}</b><span data-cost="${a}">${i ? "at v" + (r.gen + 1) : $($t(r))}</span></button>`;
    },
    o = _[s.lvl + 1],
    n = rt();
  ((e.innerHTML = `<div class="sec"><span class="lab">Racks</span></div><div class="grid">${Cc(kc).map(t).join("")}</div>
  <div class="sec"><span class="lab">Cooling</span></div><div class="grid">${Cc(Mc).map(t).join("")}</div>
  <div class="crewrow" id="crewrow" hidden><button class="crewl" id="crewl"></button><button class="rushall" id="rushall" hidden></button></div>
  <div class="detail" id="detail"></div>
  ${n ? `<button class="wide" id="expand" title="Pay to finish it now">${At.crane.replace("<svg", '<svg style="width:22px;height:22px;flex:none"')}<b style="flex:1;text-align:left;margin-left:8px;font-weight:600">Building the ${_[n.n][3].toLowerCase()}<small id="exp-p"></small></b><span id="exp-r"></span></button>` : o ? `<button class="wide" id="expand" title="More floor: ${o[0]}\xD7${o[1]} tiles">${At.grow.replace("<svg", '<svg style="width:22px;height:22px;flex:none"')}<b style="flex:1;text-align:left;margin-left:8px;font-weight:600">Expand to ${o[3].toLowerCase()} \xB7 ${o[0]}\xD7${o[1]}</b><span>${$(o[2])}</span></button>` : '<button class="wide" disabled><b>The floor is as big as it gets</b></button>'}`),
    e.querySelectorAll(".item").forEach((a) => {
      ((a.onclick = () => {
        const r = a.dataset.id,
          i = K[r];
        if (!se(i)) {
          Q(`${i.name}: unlocks when you launch v${i.gen + 1}`);
          return;
        }
        ((s.seen["tool_" + r] = 1), Wt($e === r ? null : r), R.tick());
      }),
        (a.onmouseenter = () => {
          ((ii = a.dataset.id), li());
        }),
        (a.onmouseleave = () => {
          ((ii = null), li());
        }));
    }),
    b("#expand")?.addEventListener("click", () => {
      rt() ? si("floor") : Ms();
    }),
    (b("#crewl").onclick = () => {
      Rt() && ko("staff");
    }),
    (b("#rushall").onclick = () => ja("rushall")),
    li(),
    $c(),
    Tc());
}
function $c() {
  const e = b("#crewl"),
    t = b("#crewrow");
  if (!e || !t) return;
  const o = Ft().length,
    n = s.sites.length,
    a = nt();
  if ((t.hidden === !!n && (t.hidden = !n), !n)) return;
  {
    const l = b("#rushall"),
      f = n >= 2 ? s.sites.reduce((u, g) => u + Ba(g), 0) : 0;
    if ((l.hidden !== n < 2 && (l.hidden = n < 2), n >= 2)) {
      const u = `Finish all \xB7 ${$(f)}`;
      (l.textContent !== u && (l.textContent = u),
        l.classList.toggle("poor", s.cash < f));
    }
  }
  const r = `<span>crews ${Math.min(o, a)}/${a}${o > a ? ` \xB7 ${o - a} waiting` : ""}${n > o ? ` \xB7 ${n - o} on order` : ""}</span>`;
  e.innerHTML !== r && (e.innerHTML = r);
  const i = Rt()
    ? "Building crews: each builds one thing at a time. Click to hire more in Staff"
    : "Building crews: each builds one thing at a time";
  e.title !== i && (e.title = i);
}
function Tc() {
  const e = rt(),
    t = b("#exp-p"),
    o = b("#exp-r");
  if (!e || !t || !o) return;
  const n = gs(e),
    a = ` ${Math.floor((1 - e.left / e.T) * 100)}% \xB7 ${te(e.left / ue())} to go`,
    r = `finish \xB7 ${$(n)}`;
  (t.textContent !== a && (t.textContent = a),
    o.textContent !== r && (o.textContent = r),
    (o.style.color = s.cash < n ? "#ff8fa3" : ""));
}
function li() {
  const e = b("#detail");
  if (!e) return;
  const o = K[ii || $e];
  if (!o) {
    e.innerHTML =
      "Pick a rack or a cooler, then click a tile on the floor. Drag to fill a row.";
    return;
  }
  o.kind === "rack"
    ? (e.innerHTML = `<b>${o.name}</b> \xB7 ${o.gpus > 1 ? o.gpus + " GPUs" : "1 GPU"} \xB7 <span class="c">${Te(o.tps * de.tps)} tok/s</span> \xB7 <span class="a">${N(o.kw)}</span> of heat<br>${o.desc}${o.cls ? ` Needs <b>${_n[o.cls]}</b>.` : ""} Each one you have adds ${Math.round(Ga * 100)}% to the next one's price.`)
    : (e.innerHTML = `<b>${o.name}</b> \xB7 cools <span class="c">${N(o.kw * de.cool)}</span>${o.range > 1 ? " two tiles out" : ""}<br>${o.desc}`);
}
const rt = () => s.proj.find((e) => e.kind === "floor");
function Nu(e) {
  if (e !== _[s.lvl + 1] || rt()) return;
  const t = s.cash < e[2];
  (Da(!1),
    jo(),
    (b("#dx-h").textContent = `Expand to ${"the " + e[3].toLowerCase()}?`),
    (b("#dx-p").innerHTML =
      `${e[0]} by ${e[1]} tiles, up from ${U()} by ${W()}. The builders take ${te((ta[s.lvl + 1] || 30) / ue())}. <b>Pay ${$(e[2])}</b>` +
      (t ? `<br><span class="r">You have ${$(s.cash)}.</span>` : "")));
  const o = b("#dx-yes");
  ((o.disabled = t),
    (o.style.opacity = t ? 0.45 : 1),
    (o.onclick = () => {
      (b("#d-expand").close(), Ms());
    }),
    b("#d-expand").showModal());
}
function Ms() {
  const e = _[s.lvl + 1];
  if (!e || rt()) return;
  if (s.cash < e[2]) {
    (Q("Not enough money to expand"), R.no());
    return;
  }
  s.cash -= e[2];
  const t = ta[s.lvl + 1] || 30;
  (s.proj.push({ kind: "floor", n: s.lvl + 1, left: t, T: t }),
    De(),
    (Ae = !0),
    R.place("rack"),
    Q(
      `The builders are on it: the ${e[3].toLowerCase()} is ready in ${te(t / ue())}`,
    ));
}
function Hu() {
  const e = _[s.lvl + 1];
  e &&
    (s.lvl++,
    Wl(),
    Ne(),
    pt(),
    Qe || bn(!1),
    De(),
    (Ae = !0),
    !Se &&
      (R.big(),
      be(
        e[3],
        `The floor is now ${e[0]} by ${e[1]} tiles: room for ${e[0] * e[1] - _[s.lvl - 1][0] * _[s.lvl - 1][1]} more racks and coolers, and one more building crew.`,
        "c",
        null,
        { icon: "grow", kick: "Floor expanded" },
      )));
}
function Ac() {
  const e = b("#pane-power"),
    t = nn(),
    o = m.draw,
    n = s.proj.filter((r) => r.kind === "plant"),
    a = n.length
      ? `<div class="crewrow"><span class="crewl"><span>${n.length > 1 ? `${n.length} plants going in` : `The ${ft[n[0].id].name.toLowerCase().replace("200 a", "200 A")} going in`} \xB7 ${te(Math.max(...n.map((r) => r.left)) / ue())}</span></span><button class="rushall${s.cash < n.reduce((r, i) => r + gs(i), 0) ? " poor" : ""}" id="rushpow">Finish \xB7 ${$(n.reduce((r, i) => r + gs(i), 0))}</button></div>`
      : "";
  ((e.innerHTML =
    `<div class="detail">Supply <b>${N(t)}</b> \xB7 drawing <b class="${o > t ? "r" : ""}">${N(o)}</b> (racks ${N(m.heat)}, cooling ${N(m.coolDraw)})<br>${o > t ? `<span class="r">Over the limit: everything runs at ${Math.round(m.brown * 100)}%.</span>` : `${Math.round((o / Math.max(t, 1e-9)) * 100)}% of what you can supply.`}</div>` +
    a +
    (() => {
      const r = Jt.filter((f) => f.id !== "outlet"),
        i = r.filter((f) => se(f)),
        l = r.find((f) => !se(f));
      return l ? [...i, l] : i;
    })()
      .map((r) => {
        const i = s.plants[r.id] || 0,
          l = Pr(r.id),
          f = !se(r),
          u = i + l >= r.max,
          g = Bt(r);
        return `<button class="row${f ? " lock" : ""}${u ? " done" : ""}" data-p="${r.id}">${f ? At.lock : At[r.id] || At.bolt}<span class="t"><b>${r.name}</b><small>${f ? `Unlocks with v${r.gen + 1}.` : `+${N(r.kw * de.power)} \xB7 ${r.desc}`}</small></span><span class="p">${f ? "" : u ? (l ? "going in" : "built") : $(g)}<small>${f ? "" : `${i} of ${r.max}${l ? ` \xB7 ${l} going in` : ""}`}</small></span></button>`;
      })
      .join("")),
    e
      .querySelectorAll(".row")
      .forEach((r) => (r.onclick = () => Lc(r.dataset.p))),
    b("#rushpow")?.addEventListener("click", () => si("plant")));
}
function Lc(e) {
  const t = ft[e];
  if (!se(t) || Vn(e) >= t.max) return;
  const o = Bt(t);
  if (s.cash < o) {
    (Q("Not enough money"), R.no());
    return;
  }
  s.cash -= o;
  const n = yd[e] || 10;
  (s.proj.push({ kind: "plant", id: e, left: n, T: n }),
    De(),
    (Ae = !0),
    R.place("cool"),
    Q(`${t.name}: online in ${te(n / ue())}`));
}
const Rt = () => !Wa() && (s.ng > 0 || s.gen >= 1),
  Wu = {
    books: {
      name: "Billing",
      you: "What your users owe waits at the fiber hut until you bill them.",
      help: "Bills your users while you are here.",
      models:
        "Your models bill your users as they go, day and night, even while you are away.",
      can: "bill your users as they go, free and around the clock",
    },
    curb: {
      name: "The curb",
      you: "Deliveries wait at the curb for your signature.",
      help: "Signs for deliveries while you are here.",
      models:
        "Agents sign for every delivery the moment it pulls up, day and night, even while you are away.",
      can: "sign for every delivery the moment it pulls up, free and around the clock",
    },
    fix: {
      name: "Repairs",
      you: "A rack that goes down stays down until you bring it back.",
      help: `Brings racks back while you are here, ${oa} seconds or so after they go down.`,
      aide: "an engineer",
      Aide: "An engineer",
      models:
        "Your models bring every rack back the moment it goes down, day and night, even while you are away.",
      can: "bring every rack back the moment it goes down, free and around the clock",
    },
  };
function Fa() {
  const e = b("#pane-staff"),
    t = s.gen,
    o = nt(),
    n = Ft().length,
    a = Math.min(o, n),
    r = Math.max(0, n - o),
    i = na[s.staff.crews || 0],
    l = t >= ne.build.gen,
    f = [
      s.staff.books,
      s.staff.curb,
      s.staff.fix,
      s.staff.build,
      s.staff.crews,
      t,
      a,
      r,
      Rt(),
      i != null && s.cash >= i,
      s.stats.downs > 0,
    ].join();
  if (Fa.sig === f && e.innerHTML) return;
  Fa.sig = f;
  const u = (d, p, h, w, x, y = "") =>
      `<button class="row${y}"${d ? ` data-a="${d}"` : ""}>${At[p]}<span class="t"><b>${h}</b><small>${w}</small></span><span class="p">${x}</span></button>`,
    g = (d) => {
      const p = s.staff[d],
        h = ne[d],
        w = Wu[d],
        x = t >= h.gen,
        y = d === "curb" ? "your agents" : "your models",
        v = "v" + (h.gen + 1),
        S = w.aide || "an assistant",
        F = w.Aide || "An assistant";
      return p === 2
        ? u("", "model", `${w.name} \xB7 ${y}`, w.models, "done", " done")
        : x
          ? u(
              "models:" + d,
              "model",
              `${w.name} \xB7 ${p === 1 ? S : "you"}`,
              `${y[0].toUpperCase() + y.slice(1)} can ${w.can}.`,
              "models<small>free</small>",
            )
          : p === 1
            ? u(
                "",
                "person",
                `${w.name} \xB7 ${S}`,
                `${w.help} ${$(h.wage)} a second. ${y[0].toUpperCase() + y.slice(1)} take over from ${v}.`,
                `${v}<small>models</small>`,
                " lock",
              )
            : u(
                "hire:" + d,
                "person",
                `${w.name} \xB7 you`,
                `${w.you} ${F} does it while you are here.`,
                `${$(h.wage)}<small>a second</small>`,
              );
    };
  ((e.innerHTML =
    g("books") +
    g("curb") +
    (s.stats.downs || s.staff.fix ? g("fix") : "") +
    `<div class="sec"><span class="lab">Building</span><em>${je(o, "crew")} \xB7 ${a} building${r ? `, ${r} waiting` : ""}</em></div>` +
    (i != null
      ? u(
          "crew",
          "crane",
          "Hire a building crew",
          "Each crew builds one thing at a time. Every bigger floor brings one more.",
          `${$(i)}<small>once</small>`,
        ).replace("<button", '<button data-crew="' + i + '"')
      : "") +
    (s.staff.build
      ? u(
          "",
          "robot",
          "Robots build",
          "A crew for every eight things on the floor, and everything goes up twice as fast.",
          "done",
          " done",
        )
      : u(
          l ? "models:build" : "",
          "robot",
          "Robots build",
          l
            ? "Your models can drive robots now: a crew for every eight things on the floor, twice as fast."
            : `Once your models can drive robots (the ${ee[ne.build.gen].cls}, v${ne.build.gen + 1}): a crew for every eight things on the floor, twice as fast.`,
          l ? "free" : `v${ne.build.gen + 1}`,
          l ? "" : " lock",
        )) +
    `<p class="note">Away, your lab works one night shift of <b>${cf(El())}</b>${t < ne.curb.gen ? ` (three times as long from v${ne.curb.gen + 1})` : ""}, then everything waits for you. Assistants go home; your models keep working.</p>`),
    e
      .querySelectorAll(".row[data-a]")
      .forEach((d) => (d.onclick = () => ja(d.dataset.a))));
}
function Rc(e) {
  !Rt() ||
    !ne[e] ||
    s.staff[e] !== 0 ||
    ((s.staff[e] = 1),
    R.chime(),
    (Ae = !0),
    De(),
    be(
      e === "fix" ? "An engineer" : "An assistant",
      e === "books"
        ? "Bills your users while you are here, and goes home when you leave."
        : e === "fix"
          ? `Brings racks back for you while you are here, ${oa} seconds or so after they go down, and goes home when you leave.`
          : "Signs for deliveries while you are here, and goes home when you leave.",
      "c",
      null,
      { icon: "person", kick: "Hired", big: `${$(ne[e].wage)} a second` },
    ));
}
function ci(e) {
  const t = ne[e];
  if (!(!t || s.gen < t.gen)) {
    if (e === "build") {
      if (s.staff.build) return;
      s.staff.build = 1;
    } else {
      if (s.staff[e] === 2) return;
      ((s.staff[e] = 2), e === "books" && _t("help"));
    }
    ((Ae = !0),
      R.big(),
      De(),
      be(
        e === "build"
          ? "Robots build"
          : e === "books"
            ? "Your models do the billing"
            : e === "fix"
              ? "Your models fix the racks"
              : "Agents run the curb",
        e === "books"
          ? "They bill your users as they go, day and night."
          : e === "curb"
            ? "Every delivery is signed for the moment it pulls up, day and night."
            : e === "fix"
              ? "A rack that goes down is back the moment it fails, day and night."
              : "A crew for every eight things on the floor, and everything goes up twice as fast.",
        "c",
        null,
        {
          icon: e === "build" ? "robot" : "chip",
          kick: "Your models take over",
          big: e === "build" ? "2\xD7 faster" : "around the clock",
        },
      ));
  }
}
function Pc() {
  const e = na[s.staff.crews || 0];
  if (e != null) {
    if (s.cash < e) {
      (Q("Not enough money for another crew"), R.no());
      return;
    }
    ((s.cash -= e),
      (s.staff.crews = (s.staff.crews || 0) + 1),
      R.place("rack"),
      (Ae = !0),
      De(),
      be(
        "A building crew",
        `${je(nt(), "crew")} now: ${nt()} things go up at once.`,
        "c",
        null,
        { icon: "crane", kick: "Hired" },
      ));
  }
}
function zu() {
  const e = b("#pane-research"),
    t = xt.filter((r) => se(r) && !s.res[r.id]),
    o = xt.filter((r) => s.res[r.id]),
    n = xt.filter((r) => !se(r)),
    a = (r, i) => {
      const l = r.spons && we[r.spons],
        f = l?.brand ? l.name : r.name;
      return `<button class="row${i === "done" ? " done" : ""}${l?.brand ? " spons" : ""}" data-r="${r.id}">${l?.glyph ? `<span class="rg">${l.glyph}</span>` : At.res}<span class="t"><b>${f}${l?.brand ? "<span>FEATURED</span>" : ""}</b><small>${_a(r)} \xB7 ${l?.desc || r.desc}</small></span><span class="p">${i === "done" ? "done" : $(r.cost)}</span></button>`;
    };
  ((e.innerHTML =
    (t.length
      ? t.map((r) => a(r)).join("")
      : '<div class="detail">Nothing left to research until your next model.</div>') +
    (n.length
      ? `<div class="sec"><span class="lab">Next model</span><em>${je(n.filter((r) => r.gen === s.gen + 1).length, "idea")} unlock with v${s.gen + 2}</em></div>`
      : "") +
    (o.length
      ? `<div class="sec"><span class="lab">Done</span><em>${o.length}</em></div>` +
        o.map((r) => a(r, "done")).join("")
      : "")),
    e
      .querySelectorAll(".row")
      .forEach((r) => (r.onclick = () => Ec(r.dataset.r))));
}
function _a(e) {
  const t = e.fx,
    o = Object.keys(t)[0],
    n = t[o],
    a = (r) => Math.round((r - 1) * 100);
  return {
    tps: `+${a(n)}% tokens/s`,
    cool: `coolers +${a(n)}%`,
    price: `+${a(n)}% per token`,
    demand: `+${a(n)}% users`,
    train: `training needs ${Math.round((1 - n) * 100)}% less`,
    hype: `launch hype \xD7${n}`,
    reserve: `${Math.round(n * 100)}% always trains`,
    draw: `cooling power \u2212${Math.round((1 - n) * 100)}%`,
    plant: `plants \u2212${Math.round((1 - n) * 100)}%`,
    power: `+${a(n)}% power`,
  }[o];
}
function Ec(e) {
  const t = Tr[e];
  if (!(!t || s.res[e] || !se(t))) {
    if (s.cash < t.cost) {
      (Q("Not enough money"), R.no());
      return;
    }
    if (
      ((s.cash -= t.cost),
      (s.res[e] = 1),
      Ao(),
      Ne(),
      pt(),
      De(),
      (Ae = !0),
      R.big(),
      e === "market")
    ) {
      da();
      const o = we.market;
      if (o.brand) {
        be(
          `Listed on ${o.brand}`,
          `Developers there can call your model now. Watch the fiber: the green requests come through ${o.brand}.`,
          "or",
          null,
          { svg: o.glyph, kick: "Research done", big: _a(t) },
        );
        return;
      }
    }
    be(
      t.spons && we[t.spons]?.brand ? we[t.spons].name : t.name,
      t.desc,
      "g",
      null,
      { icon: "flask", kick: "Research done", big: _a(t) },
    );
  }
}
function Dc() {
  ((Ae = !1),
    Fe === "build"
      ? ju()
      : Fe === "power"
        ? Ac()
        : Fe === "staff"
          ? Fa()
          : zu());
}
let x1 = "";
function Ho() {
  let e = "";
  document.querySelectorAll("[data-cost]").forEach((i) => {
    const l = K[i.dataset.cost];
    let f = !1;
    if (se(l)) {
      const u = $t(l),
        g = $(u);
      (i.textContent !== g && (i.textContent = g), (f = s.cash < u));
    }
    (i.parentElement.classList.toggle("poor", f), (e += f ? 1 : 0));
  });
  const t = b("#expand");
  if (t) {
    const i = _[s.lvl + 1];
    t.classList.toggle("poor", i && s.cash < i[2]);
  }
  (document.querySelectorAll("#pane-power .row[data-p]").forEach((i) => {
    const l = ft[i.dataset.p];
    i.classList.toggle("poor", se(l) && Vn(l.id) < l.max && s.cash < Bt(l));
  }),
    document.querySelectorAll("#pane-research .row[data-r]").forEach((i) => {
      const l = Tr[i.dataset.r];
      i.classList.toggle("poor", !s.res[l.id] && s.cash < l.cost);
    }));
  const o = xt.some((i) => se(i) && !s.res[i.id] && s.cash >= i.cost),
    n = m.brown < 0.995 && Jt.some((i) => se(i) && Vn(i.id) < i.max),
    a = P.some((i) => i && se(i) && i.gen > 0 && !s.seen["tool_" + i.id]),
    r =
      Rt() &&
      (["books", "curb"].some((i) => s.gen >= ne[i].gen && s.staff[i] !== 2) ||
        (s.gen >= ne.build.gen && !s.staff.build) ||
        !s.seen.staffTab);
  (Lt[0].classList.toggle("dot", a && Fe !== "build"),
    Lt[1].classList.toggle("dot", n && Fe !== "power"),
    Lt[2].classList.toggle("dot", o && Fe !== "research"),
    Lt[3].classList.toggle("dot", r && Fe !== "staff"),
    Fe === "staff" && ((s.seen.staffTab = 1), Fa()),
    document
      .querySelectorAll("#pane-staff .row[data-crew]")
      .forEach((i) => i.classList.toggle("poor", s.cash < +i.dataset.crew)),
    Fe === "power" &&
      (Math.abs(m.draw - (Ho.dr || 0)) > m.draw * 0.01 + 0.01 ||
        (s.proj.some((i) => i.kind === "plant") && L - (Ho.pt || 0) > 0.5) ||
        s.proj.length !== Ho.pn) &&
      ((Ho.dr = m.draw), (Ho.pt = L), (Ho.pn = s.proj.length), Ac()));
}
let Gc = 0,
  v1 = 0;
const Bc = (e) => (/^[AEIOU]/.test(e) ? "an" : "a"),
  qu = (e) => (e.spons && we[e.spons]?.brand ? we[e.spons].name : e.name),
  Ic = (e) =>
    e.name.replace("Gaming PC", "PC").replace("8-GPU server", "server"),
  Oc = () => {
    const e = P.filter((t) => t && t.kind === "rack" && se(t));
    return e.filter((t) => $t(t) <= s.cash).at(-1) || e[0];
  },
  Ua = (e) =>
    P.find((t) => t && t.kind === "cool" && se(t) && t.cls >= Math.max(0, e)),
  Ss = (e) => !!e.ob || (!s.ng && e.id <= Pt.length),
  fi = () => s.missions.find((e) => Ss(e) && !e.claimed),
  Yu = {
    racks: () =>
      "Every request a PC answers earns money, and one PC cannot keep up. Pick <b>PC</b> and click the glowing tile.",
    cooled: (e) =>
      "A rack turns its power into heat, and a hot rack slows down. A box fan cools the eight tiles around it.",
    plant: () =>
      "The wall outlet gives 1.8 kW, and your racks will soon want more. The panel is in <b>Power</b>.",
    streak: () =>
      `Build until no request gets a <span class="r">429</span>, then hold it. You answer <b>${Va()}%</b> now.`,
    launch: () =>
      "Compute your users do not need trains your next model. When the bar at the top right fills, launch it.",
  },
  Va = () => Math.min(100, Math.round((m.served / Math.max(m.D, 1e-9)) * 100));
function Ku(e) {
  const t = Pt.findIndex((l) => l.k === e.k && (l.p || "") === (e.p || "")),
    o = Mn[e.k],
    n = e.done ? 1 : Ka(e),
    a = ["Pick PC", "tool:pc"],
    r = e.done
      ? "done"
      : o.p
        ? Math.floor(n * 100) + "%"
        : `${(o.f || Te)(Math.max(0, Math.min(o.v(e), e.n)))}/${(o.f || Te)(e.n)}`,
    i =
      {
        racks: [a],
        cooled: [m.racks < e.n ? a : ["Pick box fan", "tool:fan"]],
        plant: [["Open Power", "power"]],
        streak: m.served < m.D * 0.97 ? [a] : [],
        launch: [],
      }[e.k] || [];
  return {
    t: "ob" + (e.done ? " done" : ""),
    k: t < 0 ? "" : `First steps \xB7 ${t + 1} of ${Pt.length}`,
    h: o.t(e) + ".",
    b: (Yu[e.k] || (() => ""))(e),
    a: e.done ? [] : i,
    r: `<small>${r}</small>+${$(e.r)}`,
  };
}
function Fc() {
  const e = ee[s.gen],
    t = ms(),
    o = fi(),
    n = Oc(),
    a = _[s.lvl + 1],
    r = rt(),
    i = Rt();
  if (s.done)
    return {
      h: "You reached AGI.",
      b: `${s.lab} got there in <b>${Oa(s.agiAt || s.played)}</b>. Keep building, or start a new lab: every AGI makes the next run faster.`,
      a: [["Share your run", "share"]],
    };
  if (vt())
    return {
      t: "go",
      h: `${ge(s.gen + 1)} is trained.`,
      b: `Launch it for ${Bc(ee[s.gen + 1].round)} ${ee[s.gen + 1].round} round and about <b>${Te(ee[s.gen + 1].D / e.D)}\xD7</b> the users.`,
      a: [[`Launch ${ge(s.gen + 1)}`, "launch"]],
    };
  if (Ro())
    return {
      t: "bad",
      h: "Billing is full.",
      b: `Your users owe you <b>${$(s.bill)}</b>, and what they use now goes unbilled. Bill them, or press Enter.${i && !s.staff.books ? " An assistant can do it for you." : ""}`,
      a: [
        [`Bill \xB7 +${$(s.bill)}`, "bill"],
        ...(i && !s.staff.books
          ? [[`Hire help \xB7 ${$(ne.books.wage)}/s`, "hire:books"]]
          : []),
      ],
    };
  {
    const d = s.staff.curb !== 2 ? an() : [];
    if (d.length) {
      const p = Math.min(...d.map((h) => Ar - h.wait));
      if (p < 20) {
        const h = d.flatMap(Ot);
        return {
          t: "bad",
          h:
            d.length > 1
              ? `${d.length} deliveries are about to leave.`
              : "A delivery is about to leave.",
          b: `Sign for ${d.length > 1 ? "them" : "it"} in the next ${te(p)}, or the driver takes ${No(h)} back, and bringing ${h.length > 1 ? "them" : "it"} again costs a little.`,
          a: [
            ["Sign for it", "sign"],
            ...(i && !s.staff.curb
              ? [[`Hire help \xB7 ${$(ne.curb.wage)}/s`, "hire:curb"]]
              : []),
          ],
        };
      }
    }
  }
  {
    const d = s.down,
      p = s.staff.fix;
    if (
      d.length &&
      p !== 2 &&
      (p === 0 || d.some((h) => s.played - h.t > oa + 4))
    ) {
      const h = d.length,
        w = i && !p;
      return {
        t: "bad",
        h: h === 1 ? "A rack is down." : `${h} racks are down.`,
        b: `${h === 1 ? "It serves" : "They serve"} and ${h === 1 ? "trains" : "train"} nothing until someone brings ${h === 1 ? "it" : "them"} back: click ${h === 1 ? "it" : "one"}, the bubble, or press Enter.${w ? " An engineer can do it for you." : ""}`,
        a: [
          [h === 1 ? "Fix it" : "Fix all", "fixall"],
          ...(w
            ? [[`Hire an engineer \xB7 ${$(ne.fix.wage)}/s`, "hire:fix"]]
            : []),
        ],
      };
    }
  }
  if (m.brown < 0.98 && o?.k !== "plant") {
    const d = s.proj.filter((p) => p.kind === "plant");
    if (
      d.length &&
      d.reduce((p, h) => p + ft[h.id].kw * de.power, 0) + m.cap >= m.draw * 0.98
    ) {
      const p = d.reduce((h, w) => h + gs(w), 0);
      return {
        t: "bad",
        h: "Short of power for now.",
        b: `You draw <b>${N(m.draw)}</b> and can supply <b>${N(m.cap)}</b>, so everything runs at <span class="r">${Math.round(m.brown * 100)}%</span> until the new power is in, in ${te(Math.max(...d.map((h) => h.left)) / ue())}.`,
        a: [[`Finish it now \xB7 ${$(p)}`, "rushpow"]],
      };
    }
    return {
      t: "bad",
      h: "Out of power.",
      b: `You draw <b>${N(m.draw)}</b> and can supply <b>${N(m.cap)}</b>, so everything runs at <span class="r">${Math.round(m.brown * 100)}%</span>.`,
      a: [["Buy power", "power"]],
    };
  }
  if (m.starved && o?.k !== "cooled") {
    const d = m.starved,
      p = Ua(m.starvedCls),
      h = p ? [[`Pick ${p.name.toLowerCase()}`, "tool:" + p.id]] : [];
    return ra.starved === 0
      ? {
          t: "bad",
          h: `${je(d, "rack")} ${d === 1 ? "is" : "are"} overheating.`,
          b: `The cooler going up next to ${d === 1 ? "it" : "them"} fixes that the moment it is done.`,
        }
      : m.wrongCls
        ? {
            t: "bad",
            h: `${je(m.wrongCls, "rack")} need${m.wrongCls === 1 ? "s" : ""} stronger cooling.`,
            b: `${["A PC", "A server", "A 72-GPU rack", "That rack"][m.starvedCls]} needs <b>${_n[m.starvedCls]}</b>. The cooler next to it is too weak.`,
            a: h,
          }
        : {
            t: "bad",
            h: `${je(d, "rack")} ${d === 1 ? "is" : "are"} overheating.`,
            b: `A hot rack slows down. Put a cooler next to ${d === 1 ? "it" : "them"}: red tiles show where.`,
            a: h,
          };
  }
  if (o) return Ku(o);
  {
    const d = s.staff.curb !== 2 ? an() : [];
    if (d.length) {
      const p = d.flatMap(Ot),
        h = No(p);
      return {
        h:
          d.length > 1
            ? `${d.length} deliveries are at the curb.`
            : "A delivery is at the curb.",
        b: `${h[0].toUpperCase() + h.slice(1)}. Sign for ${d.length > 1 ? "them" : "it"}, or press Enter, and the crews put ${p.length > 1 ? "them" : "it"} up.`,
        a: [["Sign for it", "sign"]],
      };
    }
  }
  if (s.staff.books !== 2 && s.bill >= sn() * 0.75)
    return {
      h: `Your users owe you ${$(s.bill)}.`,
      b: "Billing holds about a minute of what they use. Bill them before it fills, or press Enter.",
      a: [[`Bill \xB7 +${$(s.bill)}`, "bill"]],
    };
  if (i) {
    for (const h of ["books", "fix", "curb"])
      if (
        s.gen >= ne[h].gen &&
        s.staff[h] !== 2 &&
        (h !== "fix" || s.stats.downs > 0)
      )
        return {
          t: "go",
          h:
            h === "books"
              ? "Your models can do the billing now."
              : h === "fix"
                ? "Your Coder can fix racks now."
                : "Agents can run the curb now.",
          b:
            h === "books"
              ? "They bill your users as they go, free, and keep at it while you are away."
              : h === "fix"
                ? "It drains a rack that goes down, swaps the part and brings it back at once, free, and keeps at it while you are away."
                : "They sign for every delivery the moment it pulls up, free, and keep at it while you are away.",
          a: [
            [
              h === "books"
                ? "Put them on billing"
                : h === "fix"
                  ? "Put it on repairs"
                  : "Put agents on the curb",
              "models:" + h,
            ],
          ],
        };
    if (s.gen >= ne.build.gen && !s.staff.build)
      return {
        t: "go",
        h: "Robots can build now.",
        b: "Your models can drive them: a crew for every eight things on the floor, and everything goes up twice as fast.",
        a: [["Robots build", "models:build"]],
      };
    const d = Ft().length - nt(),
      p = na[s.staff.crews || 0];
    if (d >= 2 && p != null && s.cash >= p)
      return {
        h: `${je(d, "build")} waiting for a crew.`,
        b: `You have ${je(nt(), "building crew")}, and each builds one thing at a time.`,
        a: [[`Hire a crew \xB7 ${$(p)}`, "crew"]],
      };
  }
  if (Un()) {
    const d = s.sites.filter((p) => P[p.ix].kind === "rack").length;
    return {
      t: "go",
      h: "AGI needs a gigawatt.",
      b: `The last training run takes a gigawatt of compute. You draw <b>${N(m.draw)}</b>, ${Math.floor((m.draw / $r) * 100)}% of the way: build until your campus draws 1 GW, and AGI starts training.${d ? ` ${je(d, "more rack")} on the way.` : ""}`,
      a:
        t > 0
          ? [[`Pick ${Ic(n)}`, "tool:" + n.id]]
          : a && !r
            ? [[`Expand \xB7 ${$(a[2])}`, "expand"]]
            : [],
    };
  }
  if (m.served < m.D * 0.97) {
    const d = (m.D - m.served) * e.p * de.price,
      p = s.sites.filter((h) => P[h.ix].kind === "rack").length;
    return {
      t: "bad",
      h: "Users are waiting.",
      b: `You answer <b>${Va()}%</b> of what they ask. The rest get <span class="r">429 Too Many Requests</span>${d > 1 ? `: about ${$(d)} a second lost` : ""}.${p ? ` ${je(p, "more rack")} on the way.` : ""}`,
      a:
        t > 0
          ? [[`Pick ${Ic(n)}`, "tool:" + n.id]]
          : a && !r
            ? [[`Expand \xB7 ${$(a[2])}`, "expand"]]
            : [],
    };
  }
  if (s.gen >= Me)
    return { h: "Every user is served.", b: "There is nothing left to train." };
  const l = Math.round((m.trainRate / Math.max(m.C, 1e-9)) * 100),
    f = (dt() - s.train) / Math.max(m.trainRate, 1e-9),
    u = `The spare <b>${l}%</b> of your compute trains ${ge(s.gen + 1)}: <b>${Oa(f)}</b> to go.`;
  if (a && !r && t <= Math.max(0, Math.floor(U() * W() * 0.12)))
    return {
      h: "Every user is served.",
      b:
        u +
        (t <= 0
          ? " The floor is full: expand it to train faster."
          : ` The floor is nearly full, and a bigger one takes the builders ${te(ta[s.lvl + 1] / ue())}.`),
      a: [[`Expand \xB7 ${$(a[2])}`, "expand"]],
    };
  if (r && t <= 0)
    return {
      h: "Every user is served.",
      b:
        u +
        ` The ${_[r.n][3].toLowerCase()} is going up: ${te(r.left / ue())} to go.`,
    };
  const g = xt.find((d) => se(d) && !s.res[d.id] && s.cash >= d.cost);
  return g && s.tut >= 2
    ? {
        h: "Every user is served.",
        b: u + ` You can afford <b>${qu(g)}</b>: ${_a(g)}.`,
        a: [["Open Research", "research"]],
      }
    : { h: "Every user is served.", b: u + " More racks train it sooner." };
}
const Xu = (e) =>
  (e.t || "") +
  "|" +
  (e.k || "") +
  "|" +
  e.h +
  "|" +
  (e.a || []).map((t) => t.join(":")).join(",");
function so(e) {
  const t = b("#why"),
    o = Xu(e);
  if (o !== so.sig) {
    ((so.sig = o),
      (so.b = e.b),
      (so.r = e.r),
      (t.className = "why " + (e.t || "")),
      (t.innerHTML = `${e.k ? `<i class="wk">${e.k}</i>` : ""}<b class="wh">${e.h}</b><span class="wb">${e.b}</span><span class="wa">${(e.a || []).map(([n, a]) => `<button class="go" data-act="${a}">${n}</button>`).join("")}${e.r ? `<em class="rw">${e.r}</em>` : ""}</span>`));
    return;
  }
  if (
    (e.b !== so.b && ((so.b = e.b), (t.querySelector(".wb").innerHTML = e.b)),
    e.r !== so.r)
  ) {
    so.r = e.r;
    const n = t.querySelector(".rw");
    n && (n.innerHTML = e.r);
  }
}
function ko(e) {
  const t = Lt.find((o) => o.dataset.tab === e);
  t && Fe !== e && t.click();
}
function di(e) {
  const t = K[e];
  !t ||
    !se(t) ||
    (ko("build"),
    (s.seen["tool_" + e] = 1),
    Wt(e),
    Q(`${t.name}: click a glowing tile, or drag across the floor`));
}
function ja(e) {
  if ((R.tick(), e === "launch")) return As();
  if (e === "share") return Bs();
  if (e === "expand") return (ko("build"), Ms());
  if (e === "bill") {
    _t("you") || Q("Your users owe you nothing yet");
    return;
  }
  if (e === "sign") {
    go("you") || Q("No delivery is at the curb");
    return;
  }
  if (e === "fixall") {
    Po("you") || Q("Every rack is up");
    return;
  }
  if (e === "crew") return Pc();
  if (e.startsWith("hire:")) return Rc(e.slice(5));
  if (e.startsWith("models:")) return ci(e.slice(7));
  if (e === "rushall") return Bu();
  if (e === "rushpow") return si("plant");
  if (e === "tourhello") {
    ((s.seen.tourHello = 1), De());
    return;
  }
  if (e === "tourdone" || e === "tourskip") {
    ((s.seen.tourDone = 1),
      De(),
      (Ae = !0),
      e === "tourskip" &&
        Q("Tour skipped \xB7 How to play is under the ? button"));
    return;
  }
  if (e.startsWith("tool:")) return di(e.slice(5));
  ko(e);
}
b("#why").addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]")?.dataset.act;
  t && ja(t);
});
function _c(e) {
  (($n = e),
    Is(),
    b("#st-cool").classList.toggle("on", e),
    Q(
      e
        ? "Cooling map on: green racks are cooled, red ones throttle"
        : "Cooling map off",
    ));
}
document.querySelectorAll(".stat[data-meter]").forEach(
  (e) =>
    (e.onclick = () => {
      const t = e.dataset.meter;
      if ((R.tick(), t === "serve"))
        ms() > 0
          ? di(Oc().id)
          : (ko("build"),
            Q(
              _[s.lvl + 1]
                ? "The floor is full: expand it, or swap old racks for better ones"
                : "The floor is full: swap old racks for better ones",
            ));
      else if (t === "cool")
        if (m.starved) {
          const o = Ua(m.starvedCls);
          o && di(o.id);
        } else _c(!$n);
      else ko("power");
    }),
);
const Na = (e, t) => {
  e.title !== t && (e.title = t);
};
function Ha(e) {
  if (!e && L - Gc < 0.12) return;
  ((Gc = L),
    (b("#cash").textContent = $(s.cash)),
    (b("#rate").textContent = "+" + $(m.rev) + "/s"));
  {
    const u = b("#billchip"),
      g = s.staff.books !== 2 && s.bill >= 0.5,
      d = Ro();
    if ((u.hidden === g && (u.hidden = !g), g)) {
      const p = d ? `${$(s.bill)} \xB7 billing full` : `${$(s.bill)} to bill`,
        h = b("#billamt");
      (h.textContent !== p && (h.textContent = p),
        u.classList.toggle("full", d));
    }
  }
  const t = m.D > 0 ? A(m.served / m.D, 0, 1) : 1,
    o = t >= 0.97,
    n = b("#st-serve");
  ((b("#s-serve").textContent = Va() + "%"),
    (b("#b-serve").style.width = Math.round(t * 100) + "%"),
    n.classList.toggle("warn", !o),
    n.classList.toggle("ok", o),
    Na(
      n,
      `Users ask for ${Te(m.D)} tokens a second and you answer ${Te(m.served)}.${o ? "" : " Click to pick a rack."}`,
    ));
  const a = m.racks ? (m.racks - m.starved) / m.racks : 1,
    r = b("#st-cool");
  ((b("#s-cool").textContent = Math.floor(a * 100) + "%"),
    (b("#b-cool").style.width = Math.round(a * 100) + "%"),
    r.classList.toggle("warn", m.starved > 0),
    r.classList.toggle("ok", !m.starved),
    Na(
      r,
      m.starved
        ? `${je(m.starved, "rack")} of ${m.racks} short of cooling. Click to pick a cooler.`
        : `All ${je(m.racks, "rack")} cooled. Click for the cooling map.`,
    ));
  const i = m.draw / Math.max(m.cap, 1e-9),
    l = b("#st-power");
  ((b("#s-power").innerHTML = `${N(m.draw).replace(" ", "<small>")}</small>`),
    (b("#b-power").style.width = Math.round(A(i, 0, 1) * 100) + "%"),
    l.classList.toggle("warn", m.brown < 0.995),
    l.classList.toggle("hot", m.brown >= 0.995 && i > 0.85),
    Na(
      l,
      `Drawing ${N(m.draw)} of the ${N(m.cap)} you can supply.${m.brown < 0.995 ? " Click to buy power." : i > 0.85 ? " Nearly full: buy power soon." : ""}`,
    ));
  const f = ee[s.gen];
  if (
    ((b("#m-name").textContent = `${ge(s.gen)} \xB7 ${f.cls}`),
    Na(b("#m-name"), `Benchmark score ${f.bench} of 100`),
    s.gen < Me)
  ) {
    const u = s.train / dt(),
      g = vt();
    ((b("#t-fill").style.width = (u * 100).toFixed(1) + "%"),
      b("#tbar").classList.toggle("done", g));
    const d = Un();
    b("#t-l").innerHTML = g
      ? `<b>${ge(s.gen + 1)}</b> is ready`
      : d
        ? "<b>AGI</b> needs a gigawatt"
        : `Training <b>${ge(s.gen + 1)}</b> \xB7 ${ee[s.gen + 1].cls}`;
    const p = (dt() - s.train) / Math.max(m.trainRate, 1e-9);
    b("#t-r").textContent = g
      ? "100%"
      : d
        ? `${N(m.draw)} of 1 GW`
        : `${Math.floor(u * 100)}% \xB7 ${p > 36e3 ? "stalled" : yo(p)}`;
    const h = b("#launch");
    (h.classList.toggle("on", g), (h.textContent = `Launch ${ge(s.gen + 1)}`));
  } else
    ((b("#t-fill").style.width = "100%"),
      (b("#t-l").innerHTML = "<b>AGI</b>"),
      (b("#t-r").textContent = yo(s.agiAt || s.played)),
      b("#launch").classList.remove("on"));
  ((b("#labname-t").textContent = s.lab),
    (b("#labname-gpu").textContent =
      m.gpus === 1 ? "1 GPU" : m.gpus.toLocaleString("en-US") + " GPUs"),
    so(Fc()));
  {
    const u = Rt();
    (Lt[3].hidden === u && (Lt[3].hidden = !u),
      u &&
        !s.seen.staff &&
        ((s.seen.staff = 1),
        be(
          "Staff",
          "Hire an assistant for billing or the curb, and more building crews. Your own models take the jobs over as they get smarter.",
          "c",
          ["Open Staff", () => ko("staff")],
          { icon: "person", kick: "New" },
        )));
  }
  ($c(), Tc(), Ho());
}
b("#billchip").onclick = () => {
  (R.tick(), _t("you") || Q("Your users owe you nothing yet"));
};
const Wa = () => !s.seen.tourDone && !s.ng,
  it = ["build", "bill", "cool", "power", "serve", "model"],
  Uc = new c.Vector3(),
  Cs = (e, t = le + 0.02) =>
    Uc.set((e % B) + 0.5, t, -(Math.floor(e / B) + 0.5));
function $s() {
  const e = K.pc,
    t = ms(),
    o = _[s.lvl + 1],
    n = t > 0 ? xo(e) : -1;
  return n >= 0 && ws(e, n).f >= 0.98
    ? { what: "pc", cost: $t(e) }
    : t > 0
      ? { what: "fan", cost: K.fan.cost }
      : rt()
        ? { what: "wait", cost: 0 }
        : o
          ? { what: "floor", cost: o[2] }
          : { what: "none", cost: 0 };
}
function Zu() {
  const e = Ua(m.starvedCls);
  if (e && xo(e) >= 0) return e.cost;
  const t = _[s.lvl + 1];
  return rt() || !t ? 0 : t[2];
}
function Qu(e) {
  return Ft().length
    ? 0
    : e === "racks"
      ? m.racks < 2
        ? $t(K.pc)
        : 0
      : m.starved
        ? Zu()
        : e === "cooled"
          ? m.racks < 3
            ? $s().cost
            : 0
          : e === "plant"
            ? s.plants.panel || Pr("panel")
              ? 0
              : Bt(ft.panel)
            : e === "streak"
              ? m.served < m.D * 0.97
                ? $s().cost
                : 0
              : e === "launch"
                ? vt()
                  ? 0
                  : $s().cost
                : e === "over" && s.gen >= 1 && !s.seen.freight
                  ? K.crah.cost
                  : 0;
}
function xn(e, t, o, n, a) {
  const r =
    Fe === "build"
      ? { dom: `#pane-build .item[data-id="${a}"]` }
      : { dom: '.tabs button[data-tab="build"]' };
  if ($e === a) {
    const i = hc(K[a]),
      l = i >= 0 && P[s.cells[i]];
    return l
      ? {
          id: e + "-swap",
          rv: t,
          h: "Put it here",
          b: `The floor is full: click the glowing ${l.name.toLowerCase().replace("gaming pc", "PC")}, and the ${K[a].name.toLowerCase()} takes its place. You get half its price back.`,
          tgt: { w3: Cs(i), r: 0.5 },
        }
      : {
          id: e + "-tile",
          rv: t,
          h: "Put it here",
          b:
            a === "pc"
              ? "Click the glowing tile: the box fan beside it keeps it cool."
              : a === "fan"
                ? "Click the glowing tile, next to the racks that run hot."
                : a === "crah"
                  ? "Click the glowing tile. Servers go round it, up to two tiles out."
                  : "Click the glowing tile.",
          tgt: i >= 0 ? { w3: Cs(i), r: 0.5 } : null,
        };
  }
  return {
    id: e,
    rv: t,
    h: o,
    b: n + (Fe === "build" ? "" : " Open Build."),
    a: [
      [
        `Pick ${K[a].name.toLowerCase().replace("gaming pc", "PC")}`,
        "tool:" + a,
      ],
    ],
    tgt: r,
  };
}
function Vc() {
  if (!Wa() || Ce || Ve || mt.classList.contains("ui-off")) return null;
  const e = fi(),
    t = e
      ? e.done || Ka(e) >= 1
        ? Pt[Pt.findIndex((d) => d.k === e.k) + 1]?.k || "over"
        : e.k
      : "over";
  if (!s.seen.tourHello)
    return {
      id: "hello",
      h: "Garage to Gigawatt",
      b: "One gaming PC in a garage, and every request it answers earns money. Grow it into a gigawatt AI campus, and train your way to <b>AGI</b>.",
      a: [["Let's start", "tourhello"]],
      tgt: {
        w3: Uc.set(U() * 0.5, 0.6, -W() * 0.5),
        r: Math.max(U(), W()) * 0.6,
        max: 260,
      },
    };
  const o =
      {
        racks: ["build"],
        cooled: ["build", "cool"],
        plant: ["build", "cool", "power"],
        streak: ["build", "cool", "power", "serve"],
        launch: it,
        over: it,
      }[t] || it,
    n = s.bill,
    a = Ro(),
    r = Qu(t);
  if (
    a ||
    (s.stats.myBills < 1 && n >= 10 && m.racks >= 2) ||
    (r > s.cash && n >= 3 && n >= Math.min(r - s.cash, sn() * 0.5))
  )
    return {
      id: "bill",
      rv: [...o, "bill"],
      h: a ? "Billing is full" : "Bill your users",
      b: a
        ? `Your users owe you <b>${$(n)}</b>, and what they use now goes unbilled. Click the bubble over the fiber hut, or press Enter.`
        : s.stats.myBills < 1
          ? `Every answer your PCs give is billed. What users owe waits at the fiber hut, about a minute of it, until you collect it: <b>${$(n)}</b> so far. Click the bubble, or press Enter.`
          : `You need ${$(r)}, and your users owe you <b>${$(n)}</b>. Bill them: the bubble over the fiber hut, or Enter.`,
      tgt: { tag: io },
    };
  if (r > s.cash + n && m.rev > 0)
    return {
      id: "save",
      rv: [...o, "bill"],
      h: "Saving up",
      b: `The next thing costs ${$(r)}. Your racks earn <b>${$(m.rev)}</b> a second, and it waits at the fiber hut: bill your users when there is enough.`,
      tgt: io.on ? { tag: io } : { dom: "#cashbox" },
    };
  if (an().length)
    return {
      id: "sign",
      rv: it,
      h: "Sign for the delivery",
      b: "Datacenter hardware comes by truck. Click it, or press Enter, and the crates go in for the crews to put up. A driver waits a minute, then takes it back for a small fee.",
      tgt: { tag: zo },
    };
  if (m.brown < 0.98 && m.racks >= 2) {
    const d = s.proj.find((h) => h.kind === "plant"),
      p = Fe === "power";
    return d
      ? {
          id: "powerwait",
          rv: [...o, "power"],
          h: "Power on the way",
          b: `An electrician is putting the ${ft[d.id].name.toLowerCase().replace("200 a", "200 A")} in: ${te(d.left / ue())}. Until then everything runs at <b>${Math.round(m.brown * 100)}%</b>.`,
          tgt: { dom: "#st-power" },
        }
      : {
          id: "power",
          rv: [...o, "power"],
          h: "Out of power",
          b: `Your racks draw <b>${N(m.draw)}</b> and the wall outlet gives ${N(m.cap)}, so everything slows down. ${p ? "Get the 200 A service." : "Open Power."}`,
          tgt: {
            dom: p
              ? '#pane-power .row[data-p="panel"]'
              : '.tabs button[data-tab="power"]',
          },
        };
  }
  const i = Ft()[0],
    l = (d, p) => ({
      id: d,
      rv: o,
      h: "Going up",
      b: p || `${P[i.ix].name}: ${te(i.left / ue())} to go.`,
      tgt: { w3: Cs(i.k, 1.15), r: 1.2 },
    }),
    f = (d) => {
      const p = Ua(m.starvedCls),
        h = p ? xo(p) : -1;
      if (p && h >= 0)
        return xn(
          d,
          o,
          m.wrongCls
            ? "It needs stronger cooling"
            : `${m.starved === 1 ? "A rack is" : `${m.starved} racks are`} running hot`,
          m.wrongCls
            ? `A box fan is too weak for it: it needs ${_n[m.starvedCls]}.`
            : "A rack turns its power into heat, and a hot rack slows down. A box fan cools the eight tiles around it.",
          p.id,
        );
      const w = _[s.lvl + 1],
        x = rt(),
        y = ke.find((v) => It[v] < 0.98);
      return x
        ? {
            id: "grow",
            rv: o,
            h: "More room on the way",
            b: `The builders are on the ${_[x.n][3].toLowerCase()}: ${te(x.left / ue())}. Then the hot rack gets a cooler.`,
            tgt: { dom: "#expand" },
          }
        : w
          ? {
              id: "expand-c",
              rv: o,
              h: "Make room",
              b: `There is no room beside the hot rack for ${Bc(p?.name || "cooler")} ${(p?.name || "cooler").toLowerCase()}. A bigger floor makes room.`,
              a: [[`Expand \xB7 ${$(w[2])}`, "expand"]],
              tgt: { dom: "#expand" },
            }
          : {
              id: "sellhot",
              rv: o,
              h: "Make room",
              b: "There is no room to cool this rack. Click it and sell it, then put a cooler in its place.",
              tgt: y != null ? { w3: Cs(y), r: 0.5 } : null,
            };
    },
    u = (d, p, h) => {
      const w = $s(),
        x = _[s.lvl + 1],
        y = rt();
      return w.what === "pc"
        ? xn(
            d,
            o,
            p || "Another PC",
            h ||
              "Every PC you add answers more users, and trains the next model sooner.",
            "pc",
          )
        : w.what === "fan"
          ? xn(
              d + "-fan",
              o,
              "More cooling first",
              "A box fan cools about two PCs. Put one down where the next PCs can go round it.",
              "fan",
            )
          : w.what === "wait"
            ? {
                id: "grow",
                rv: o,
                h: "More room on the way",
                b: `The builders are on the ${_[y.n][3].toLowerCase()}: ${te(y.left / ue())}.`,
                tgt: { dom: "#expand" },
              }
            : w.what === "floor"
              ? {
                  id: "expand",
                  rv: o,
                  h: "Make room",
                  b: `The ${_[s.lvl][3].toLowerCase()} is full. A bigger floor fits more racks and coolers, and the builders put it up in ${te(_[s.lvl + 1] && ta[s.lvl + 1] / ue())}.`,
                  a: [[`Expand \xB7 ${$(x[2])}`, "expand"]],
                  tgt: { dom: "#expand" },
                }
              : null;
    };
  if (t === "racks")
    return i
      ? l(
          "site",
          `Setting up a PC takes ${wl.pc} seconds; bigger hardware takes longer, and each building crew puts up one thing at a time. ${te(i.left / ue())} to go.`,
        )
      : xn(
          "pc1",
          o,
          "Build a second PC",
          "One PC cannot keep up with your users, and every request it misses is money lost.",
          "pc",
        );
  if (t === "cooled")
    return i
      ? l("site-c")
      : m.starved
        ? f("fan")
        : u(
            "pc3",
            "Keep three racks cooled",
            "Build a third PC. A box fan cools about two PCs, so watch the glow on the tiles.",
          );
  if (t === "plant") {
    const d = s.proj.find((p) => p.kind === "plant");
    return d
      ? {
          id: "panelwait",
          rv: o,
          h: "An electrician is on it",
          b: `The 200 A panel goes in over ${te(d.left / ue())}. Power takes time too: buy it before you run short.`,
          tgt: { dom: "#st-power" },
        }
      : Fe === "power"
        ? {
            id: "panel",
            rv: o,
            h: "Get the 200 A panel",
            b: "The wall outlet gives 1.8 kW, and your racks will soon want more.",
            tgt: { dom: '#pane-power .row[data-p="panel"]' },
          }
        : {
            id: "powertab",
            rv: o,
            h: "Get the 200 A panel",
            b: "The wall outlet gives 1.8 kW, and your racks will soon want more. Open Power.",
            tgt: { dom: '.tabs button[data-tab="power"]' },
          };
  }
  if (t === "streak")
    return i
      ? l("site-s")
      : m.starved
        ? f("fan2")
        : m.served < m.D * 0.97
          ? u(
              "pc5",
              "Users are waiting",
              `You answer <b>${Va()}%</b> of what they ask; the rest get a <span class="r">429</span>. Build PCs until every request is answered.`,
            )
          : {
              id: "hold",
              rv: o,
              h: "Hold it",
              b: `Every user is served. Keep it that way for 20 seconds: <b>${Math.floor(Math.min(s.stats.streak, 20))} s</b>.`,
              tgt: { dom: "#st-serve" },
            };
  if (t === "launch") {
    if (vt())
      return {
        id: "launch",
        rv: it,
        h: "Launch it",
        b: `${ge(s.gen + 1)} is trained. Launch it: a better model brings about ten times the users, a funding round and new hardware.`,
        tgt: { dom: "#launch" },
      };
    const d = Math.floor((s.train / dt()) * 100);
    if (i)
      return l(
        "site-l",
        `${P[i.ix].name}: ${te(i.left / ue())} to go. Then it trains ${ge(s.gen + 1)} with the rest.`,
      );
    if (m.starved) return f("fan3");
    const p = $s();
    return p.what !== "none" && s.cash >= p.cost
      ? u(
          "pc6",
          "Train it faster",
          `Compute your users do not need trains ${ge(s.gen + 1)}: <b>${d}%</b> so far. Every PC you add trains it sooner.`,
        )
      : p.what === "wait"
        ? u("pc6")
        : {
            id: "train",
            rv: it,
            h: "Spare compute trains the next model",
            b: `Compute your users do not need trains ${ge(s.gen + 1)}: <b>${d}%</b>. When the bar fills, launch it.`,
            tgt: { dom: "#tbar" },
          };
  }
  if (s.seen.freight)
    return {
      id: "done",
      rv: it,
      h: "Over to you",
      b: "Missions are top left, and the coach under the meters always says what matters most. When billing and deliveries pile up, hire help in <b>Staff</b>: your own models take the jobs over as they get smarter.",
      a: [["Let me build", "tourdone"]],
      tgt: null,
    };
  const g = s.trucks.find((d) => d.st !== "curb");
  return g
    ? {
        id: "road",
        rv: it,
        h: "On its way",
        b: `Datacenter hardware ships by truck. This one is here in ${te(Ia(g))}.`,
        tgt: null,
      }
    : i
      ? {
          id: "site2",
          rv: it,
          h: "Going up",
          b: `${P[i.ix].name}: ${te(i.left / ue())} to go.`,
          tgt: { w3: Cs(i.k, 1.15), r: 1.2 },
        }
      : m.starved
        ? f("cool2")
        : qo.some((d) => P[s.cells[d]]?.id === "crah")
          ? xn(
              "srv",
              it,
              "Now a server",
              "One server answers as much as 36 PCs. Put it next to the air handler.",
              "srv",
            )
          : xn(
              "crah",
              it,
              "New hardware",
              "Servers answer as much as 36 PCs, and run too hot for a fan. Put an air handler down first.",
              "crah",
            );
}
function Ju(e) {
  if (!e) return null;
  const t = pe.getBoundingClientRect();
  if (e.dom) {
    const o = b(e.dom);
    if (!o) return null;
    const n = o.getBoundingClientRect();
    return n.width < 2 || n.height < 2
      ? null
      : {
          x: n.left - 7,
          y: n.top - 7,
          w: n.width + 14,
          h: n.height + 14,
          rr: 12,
        };
  }
  if (e.tag) {
    if (!e.tag.on) return null;
    const o = e.tag.e.getBoundingClientRect();
    return o.width < 2
      ? null
      : {
          x: o.left - 8,
          y: o.top - 8,
          w: o.width + 16,
          h: o.height + 16,
          rr: 22,
        };
  }
  if (e.w3) {
    if ((V.copy(e.w3).project(O), V.z > 1)) return null;
    const o = (V.x * 0.5 + 0.5) * t.width,
      n = (-V.y * 0.5 + 0.5) * t.height,
      a = O.position.distanceTo(e.w3),
      r =
        t.height /
        (2 * Math.tan(c.MathUtils.degToRad(O.fov / 2)) * Math.max(a, 0.1)),
      i = A(e.r * r, 30, e.max || 170);
    return { x: o - i, y: n - i, w: i * 2, h: i * 2, rr: i };
  }
  return null;
}
const z = {
  el: b("#guide"),
  path: b("#guide .gdim path"),
  ring: b("#guide .gring"),
  call: b("#guide .gcall"),
  sig: "",
  id: "",
  h: null,
  cw: 0,
  ch: 0,
  mob: null,
};
z.call.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]")?.dataset.act;
  t && ja(t);
});
function e0(e) {
  const t = Wa(),
    o = Vc();
  if (t && o?.rv) for (const T of o.rv) s.seen["rv_" + T] = 1;
  mt.classList.contains("tour") !== t && mt.classList.toggle("tour", t);
  for (const T of it) {
    const E = !t || !!s.seen["rv_" + T];
    mt.classList.contains("rv-" + T) !== E && mt.classList.toggle("rv-" + T, E);
  }
  const n = !!o && !document.querySelector("dialog[open]");
  if (
    (z.el.classList.contains("on") !== n && z.el.classList.toggle("on", n), !n)
  ) {
    z.id = "";
    return;
  }
  const a = /^(site|save|hold|train|road|grow|powerwait|panelwait)/.test(o.id);
  z.el.classList.contains("soft") !== a && z.el.classList.toggle("soft", a);
  const r = fi(),
    i = r && Ss(r) ? Pt.findIndex((T) => T.k === r.k) + 1 : 0,
    l =
      o.id +
      "|" +
      o.h +
      "|" +
      o.b +
      "|" +
      (o.a || []).map((T) => T.join(":")).join(",") +
      "|" +
      i;
  if (l !== z.sig) {
    z.sig = l;
    const T = o.id === "hello" || o.id === "done";
    ((z.call.innerHTML = `<i class="gk"><span>${T ? (o.id === "hello" ? "Welcome" : "The tour") : i ? `First steps \xB7 ${i} of ${Pt.length}` : "The tour"}</span>${i && !T ? `<em>+${$(r.r)}</em>` : ""}</i><b class="gh">${o.h}</b><p class="gb">${o.b}</p><span class="ga">${(o.a || []).map(([E, j]) => `<button data-act="${j}">${E}</button>`).join("")}${o.id === "done" ? "" : '<button class="gskip" data-act="tourskip">Skip the tour</button>'}</span>`),
      (z.cw = 0));
  }
  const f = pe.getBoundingClientRect(),
    u = f.width,
    g = f.height;
  (z.mob !== qe &&
    ((z.mob = qe),
    (z.call.style.width = qe ? `${Math.max(200, u - 24)}px` : ""),
    (z.cw = 0)),
    z.cw || ((z.cw = z.call.offsetWidth), (z.ch = z.call.offsetHeight)));
  const d = Ju(o.tgt),
    p = z.id !== o.id;
  if (((z.id = o.id), d))
    if (!z.h || p) z.h = { ...d };
    else {
      const T = 1 - Math.exp(-e * 14);
      for (const E of ["x", "y", "w", "h", "rr"]) z.h[E] += (d[E] - z.h[E]) * T;
    }
  else z.h = null;
  const h = z.h;
  if (h) {
    const { x: T, y: E, w: j } = h,
      ie = h.h,
      J = Math.min(h.rr, j / 2, ie / 2);
    z.path.setAttribute(
      "d",
      `M0 0H${u}V${g}H0Z M${T + J} ${E}H${T + j - J}A${J} ${J} 0 0 1 ${T + j} ${E + J}V${E + ie - J}A${J} ${J} 0 0 1 ${T + j - J} ${E + ie}H${T + J}A${J} ${J} 0 0 1 ${T} ${E + ie - J}V${E + J}A${J} ${J} 0 0 1 ${T + J} ${E}Z`,
    );
    const Re = z.ring.style;
    ((Re.display = ""),
      (Re.left = T + "px"),
      (Re.top = E + "px"),
      (Re.width = j + "px"),
      (Re.height = ie + "px"),
      (Re.borderRadius = J + "px"));
  } else (z.path.setAttribute("d", ""), (z.ring.style.display = "none"));
  const w = z.cw,
    x = z.ch,
    y = [];
  for (const T of [".ctl", ".side"]) {
    const E = b(T);
    if (E) {
      const j = E.getBoundingClientRect();
      j.width > 2 && j.height > 2 && y.push(j);
    }
  }
  for (const T of [io, zo, Ja])
    if (T.on) {
      const E = T.e.getBoundingClientRect();
      E.width > 2 && y.push(E);
    }
  {
    const T = getComputedStyle(document.documentElement),
      E = parseFloat(T.getPropertyValue("--sael-corner-w")) || 0,
      j = parseFloat(T.getPropertyValue("--sael-corner-h")) || 0;
    E &&
      j &&
      y.push({ left: u - E - 24, top: g - j - 24, right: u, bottom: g });
  }
  const v = h
      ? { left: h.x, top: h.y, right: h.x + h.w, bottom: h.y + h.h }
      : null,
    S = (T, E, j) =>
      T < j.right + 8 &&
      T + w > j.left - 8 &&
      E < j.bottom + 8 &&
      E + x > j.top - 8,
    F = [];
  if (v) {
    const T = (v.left + v.right) / 2,
      E = (v.top + v.bottom) / 2;
    F.push(
      [T - w / 2, v.bottom + 18],
      [T - w / 2, v.top - 18 - x],
      [v.left - 18 - w, E - x / 2],
      [v.right + 18, E - x / 2],
      [v.left - 18 - w, v.bottom + 18],
      [v.right + 18, v.bottom + 18],
    );
  } else F.push([u / 2 - w / 2, g * 0.62 - x / 2], [u / 2 - w / 2, g * 0.25]);
  let I = 0,
    q = 0,
    H = 1e9;
  (F.forEach(([T, E], j) => {
    ((T = A(T, 12, Math.max(12, u - w - 12))),
      (E = A(E, 12, Math.max(12, g - x - 12))));
    let ie = j;
    v && S(T, E, v) && (ie += 1e3);
    for (const J of y) S(T, E, J) && (ie += 100);
    ie < H && ((H = ie), (I = T), (q = E));
  }),
    (z.call.style.transform = `translate(${I.toFixed(1)}px,${q.toFixed(1)}px)`),
    p &&
      ((z.call.style.transition = "none"),
      z.call.offsetWidth,
      (z.call.style.transition = "")));
}
const za = {
  trophy:
    '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3"/>',
  flask:
    '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
  bolt: '<path d="M13 2.5 4.5 14H11l-1 7.5L18.5 10H12z"/>',
  truck:
    '<path d="M2.5 6h10.5v10H2.5zM13 9.5h4l3.5 3.5v3H13z"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  flame:
    '<path d="M12 21.5c3.9 0 6.8-2.8 6.8-6.6 0-4.6-4.4-6.5-4.6-11.4-2.9 1.9-4 4.6-4 6.6-1-.8-1.8-2-2-3.6-2 2-3 4.8-3 8.4 0 3.8 2.9 6.6 6.8 6.6z"/>',
  spark:
    '<path d="M12 2.5v4.5M12 17v4.5M2.5 12H7M17 12h4.5M5.3 5.3l3.2 3.2M15.5 15.5l3.2 3.2M18.7 5.3l-3.2 3.2M8.5 15.5l-3.2 3.2"/>',
  snow: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="m9 4.2 3 2 3-2M9 19.8l3-2 3 2"/>',
  grow: '<path d="M3.5 9V3.5H9M20.5 15v5.5H15M3.5 3.5l6.5 6.5M20.5 20.5 14 14"/>',
  garage:
    '<path d="M3 21V10l9-6.5 9 6.5v11"/><path d="M7 21v-7.5h10V21M7 17h10"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.4c-.5-1-1.5-1.5-2.6-1.5-1.4 0-2.6.8-2.6 2s1.1 1.8 2.6 2.1 2.6.8 2.6 2.1-1.2 2-2.6 2c-1.1 0-2.1-.5-2.6-1.5M12 6.2v1.7M12 16.1v1.7"/>',
  rocket:
    '<path d="M5 15c-1.1 1.1-1.6 3.1-1.6 5.6 2.5 0 4.5-.5 5.6-1.6M9 11a16 16 0 0 1 11-8c0 4-2 8.2-8 11.2"/><circle cx="14.5" cy="9.5" r="1.6"/><path d="M9 11 6 10.2l-2 2 4 1.3M13 15l.8 3-2 2-1.3-4"/>',
  person:
    '<circle cx="12" cy="8" r="3.5"/><path d="M5 20.5c.8-4.2 3.4-6.5 7-6.5s6.2 2.3 7 6.5"/>',
  robot:
    '<path d="M7 10a5 5 0 0 1 10 0v2.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9.5 11h5"/><path d="M8 18h8M9.5 14.5V21M14.5 14.5V21"/>',
  crane:
    '<path d="M6 21V4l11 3M6 7h13M16 7v4M3 21h7"/><path d="M14 11h5v4h-5z"/>',
  bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
  wrench:
    '<path d="M15.5 3.5a4.5 4.5 0 0 0-4.3 5.9L3.8 16.8a1.9 1.9 0 0 0 2.7 2.7l7.4-7.4a4.5 4.5 0 0 0 5.9-4.3l-2.6 2.6-2.7-.6-.6-2.7z"/>',
};
function t0(e, t, o, n = 850) {
  const a = performance.now(),
    r = () => {
      const i = Math.min(1, (performance.now() - a) / n),
        l = 1 - Math.pow(1 - i, 3);
      ((e.textContent = o(t * l)), i < 1 && requestAnimationFrame(r));
    };
  r();
}
function be(e, t, o = "c", n, a = {}) {
  const r = document.createElement("div");
  ((r.className = "toast k-" + o + (a.gold ? " gold" : "")),
    r.style.setProperty("--life", (a.life || (n ? 8 : 5.2)) + "s"),
    (r.innerHTML = `<span class="ic">${a.svg ? `<span class="brandmark">${a.svg}</span>` : `<svg viewBox="0 0 24 24" aria-hidden="true">${za[a.icon || "spark"]}</svg>`}</span><div class="tx">${a.kick ? `<i class="kick">${a.kick}</i>` : ""}<b>${e}</b>${a.big || a.count ? `<span class="big">${a.big || ""}</span>` : ""}${t ? `<p>${t}</p>` : ""}${a.items ? `<span class="chips">${a.items.map((f) => `<span title="${K[f]?.name || ft[f]?.name || ""}">${At[f] || At.bolt}</span>`).join("")}</span>` : ""}${n ? `<button>${n[0]}</button>` : ""}</div><u class="tm"></u>`),
    n && (r.querySelector("button").onclick = n[1]));
  const i = b("#toasts");
  if (
    (i.appendChild(r),
    requestAnimationFrame(() =>
      requestAnimationFrame(() => r.classList.add("in")),
    ),
    a.count)
  ) {
    const [f, u] = a.count;
    t0(r.querySelector(".big"), f, u);
  }
  const l = [...i.children].filter((f) => !f.classList.contains("out"));
  if (l.length > (qe ? 1 : 2)) {
    const f = l[0];
    (f.classList.add("out"), setTimeout(() => f.remove(), 380));
  }
  r.querySelector(".tm").addEventListener("animationend", () => {
    (r.classList.add("out"), setTimeout(() => r.remove(), 380));
  });
}
const qa = b("#ui-hint");
let jc = -9;
function Q(e) {
  ((qa.textContent = e), qa.classList.add("on"), (jc = L));
}
let Nc = -99;
function Hc(e, t, o, n) {
  ((b("#bn-k").textContent = e),
    (b("#bn-t").textContent = t),
    (b("#bn-p").innerHTML = o),
    (b("#bn-share").style.display = n ? "" : "none"),
    b("#banner").classList.add("on"),
    (Nc = L));
}
b("#bn-share").onclick = () => Bs();
const ui = b("#float"),
  ao = [];
for (let e = 0; e < 28; e++) {
  const t = document.createElement("div");
  ((t.className = "fl"),
    ui.appendChild(t),
    ao.push({ e: t, t: -9, p: new c.Vector3() }));
}
let hi = 0;
function vn(e, t, o = "", n) {
  const a = ao[hi++ % ao.length],
    r = e % B,
    i = Math.floor(e / B);
  (a.p.set(
    r + 0.2 + Be() * 0.6,
    le + 1.5 + Be() * 0.4,
    -(i + 0.2 + Be() * 0.6),
  ),
    (a.t = L),
    (a.e.textContent = t),
    (a.e.className = "fl" + (o ? " " + o : "") + (n ? " big" : "")));
}
function Wc(e, t, o = "", n) {
  const a = ao[hi++ % ao.length];
  (a.p.copy(e),
    (a.t = L),
    (a.e.textContent = t),
    (a.e.className = "fl" + (o ? " " + o : "") + (n ? " big" : "")));
}
function o0() {
  const e = pe.getBoundingClientRect();
  for (const t of ao) {
    const o = L - t.t;
    if (o > 1.6) {
      t.e.style.opacity !== "0" && (t.e.style.opacity = "0");
      continue;
    }
    if ((V.copy(t.p).project(O), V.z > 1)) {
      t.e.style.opacity = "0";
      continue;
    }
    const n = (V.x * 0.5 + 0.5) * e.width,
      a = (-V.y * 0.5 + 0.5) * e.height - o * 34;
    ((t.e.style.transform = `translate(${n.toFixed(1)}px,${a.toFixed(1)}px) translate(-50%,-100%)`),
      (t.e.style.opacity = (o < 0.15 ? o / 0.15 : 1 - uo(1, 1.6, o)).toFixed(
        2,
      )));
  }
}
function yn(e = "") {
  const t = document.createElement("div");
  return (
    (t.className = "tag3 " + e),
    (t.innerHTML = "<i></i><span></span><small></small>"),
    ui.appendChild(t),
    { e: t, on: !1, p: new c.Vector3() }
  );
}
let zc = null,
  qc = -1,
  Yc = -9;
const pi = [],
  kn = { w: 0, h: 0 };
function zt(e, t, o, n, a, r) {
  if (((e.on = r), e.e.classList.toggle("on", r), !r)) return;
  const i = pe.getBoundingClientRect();
  if ((V.copy(t).project(O), V.z > 1)) {
    (e.e.classList.remove("on"), (e.on = !1));
    return;
  }
  (e.txt !== o && ((e.e.children[1].textContent = o), (e.txt = o), (e.w = 0)),
    e.sub !== n && ((e.e.children[2].textContent = n), (e.sub = n), (e.w = 0)),
    a && e.dot !== a && ((e.e.children[0].style.background = a), (e.dot = a)));
  let l = (V.x * 0.5 + 0.5) * i.width,
    f = (-V.y * 0.5 + 0.5) * i.height;
  if (e.e.classList.contains("click")) {
    if (qc !== L) {
      ((qc = L), (pi.length = 0));
      const p = b(".ctl");
      if (
        ((zc =
          p && !mt.classList.contains("ui-off")
            ? p.getBoundingClientRect()
            : null),
        L - Yc > 0.5)
      ) {
        Yc = L;
        const h = getComputedStyle(document.documentElement);
        ((kn.w = parseFloat(h.getPropertyValue("--sael-corner-w")) || 0),
          (kn.h = parseFloat(h.getPropertyValue("--sael-corner-h")) || 0));
      }
    }
    e.w || ((e.w = e.e.offsetWidth), (e.h = e.e.offsetHeight));
    const u = zc,
      g = e.w / 2 + 10,
      d = e.h + 10;
    if (
      u &&
      l + g > u.left &&
      l - g < u.right &&
      f > u.top &&
      f - d < u.bottom
    ) {
      const p = u.left - g - l,
        h = u.top - f;
      Math.abs(p) <= Math.abs(h) && u.left - g * 2 > 0 ? (l += p) : (f += h);
    }
    ((l = A(l, e.w / 2 + 8, Math.max(e.w / 2 + 8, i.width - e.w / 2 - 8))),
      (f = A(f, e.h + 8, Math.max(e.h + 8, i.height - 8))),
      kn.w &&
        l + e.w / 2 > i.width - kn.w - 14 &&
        f > i.height - kn.h - 14 &&
        (f = i.height - kn.h - 14));
    for (const p of pi)
      Math.abs(l - p[0]) < (e.w + p[2]) / 2 + 6 &&
        Math.abs(f - p[1]) < (e.h + p[3]) / 2 + 4 &&
        (f = p[1] + (f >= p[1] ? 1 : -1) * ((e.h + p[3]) / 2 + 4));
    pi.push([l, f, e.w, e.h]);
  }
  e.e.style.transform = `translate(${l.toFixed(1)}px,${f.toFixed(1)}px) translate(-50%,-100%)`;
}
const Ts = [];
for (let e = 0; e < 14; e++) {
  const t = document.createElement("button");
  ((t.className = "tim3"),
    (t.k = -1),
    (t.innerHTML =
      '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><circle class="f" cx="10" cy="10" r="7.5"/></svg><span></span>'),
    (t.onclick = () => {
      t.k >= 0 && he[t.k] && (Wt(null), Je(t.k), R.tick());
    }),
    ui.appendChild(t),
    Ts.push(t));
}
const Ya = [],
  gi = [];
function n0() {
  let e = 0;
  if (Gs && !Ve && !mt.classList.contains("ui-off") && s.sites.length) {
    const t = pe.getBoundingClientRect(),
      o = nc(),
      n = t.height / (2 * Math.tan(c.MathUtils.degToRad(O.fov / 2)));
    ((Ya.length = 0), (gi.length = 0));
    let a = 0;
    for (const r of s.sites)
      if (!(r.tr || fs[r.k] > L)) {
        if (a++ > 80) break;
        (V.set((r.k % B) + 0.5, le + 2.15, -(Math.floor(r.k / B) + 0.5)),
          Ya.push([r, O.position.distanceTo(V)]));
      }
    Ya.sort((r, i) => r[1] - i[1]);
    for (const [r, i] of Ya) {
      if (e >= Ts.length) break;
      const l = n / Math.max(i, 0.1);
      if (
        l < 18 ||
        (V.set(
          (r.k % B) + 0.5,
          le + 2.15,
          -(Math.floor(r.k / B) + 0.5),
        ).project(O),
        V.z > 1)
      )
        continue;
      const f = (V.x * 0.5 + 0.5) * t.width,
        u = (-V.y * 0.5 + 0.5) * t.height,
        g = o.has(r),
        d = (v) =>
          gi.some(
            (S) =>
              Math.abs(f - S[0]) < (v + S[2]) / 2 + 3 &&
              Math.abs(u - S[1]) < 26,
          );
      let p = l >= 50;
      if ((p && d(58) && (p = !1), !p && d(24))) continue;
      gi.push([f, u, p ? 58 : 24]);
      const h = Ts[e++],
        w = g ? A(1 - r.left / r.T, 0, 1) : 0;
      ((h.k = r.k),
        h.classList.contains("on") || h.classList.add("on"),
        h.classList.toggle("wait", !g),
        h.classList.toggle("big", p),
        (h.style.transform = `translate(${f.toFixed(1)}px,${u.toFixed(1)}px) translate(-50%,-100%)`),
        (h.children[0].children[1].style.strokeDashoffset = (
          47.12 *
          (1 - w)
        ).toFixed(2)));
      const x = p ? (g ? te(r.left / ue()) : "waiting") : "";
      h.t !== x && ((h.children[1].textContent = x), (h.t = x));
      const y = g
        ? `${P[r.ix].name}: ${te(r.left / ue())} to go \xB7 click to finish it now`
        : `${P[r.ix].name}: waiting for a crew`;
      h.title !== y && (h.title = y);
    }
  }
  for (let t = e; t < Ts.length; t++) {
    const o = Ts[t];
    o.classList.contains("on") && (o.classList.remove("on"), (o.k = -1));
  }
}
let Kc = -99,
  s0 = 0;
function Xc(e) {
  if (e < 100) return Math.round(e);
  const t = 10 ** (Math.floor(Math.log10(e)) - 1);
  return Math.round(e / t) * t;
}
function As() {
  if (!vt()) return;
  const e = m.rev,
    t = s.gen;
  (s.gen++,
    (s.train = 0),
    (s.since = 0),
    (s.hype = 1 * de.hype),
    (Kc = L),
    (s0 = t));
  const o = P.filter((u) => u && u.gen === s.gen),
    n = o.reduce((u, g) => u + g.cost, 0),
    a = Xc(Math.max(90 * e, 1.5 * n, 50));
  ((s.cash += a),
    s.launches.push({ gen: s.gen, at: Math.round(s.played) }),
    Ao(),
    Ne(),
    pt(),
    (Ae = !0),
    R.launch(),
    os());
  const r = ee[s.gen],
    i = ee[t];
  if (s.gen >= Me) {
    a0(a);
    return;
  }
  (setTimeout(
    () =>
      be(
        `${r.round} round closed`,
        `Investors liked ${ge(s.gen)}.`,
        "a",
        null,
        { icon: "coin", kick: "Funding", count: [a, (u) => "+" + $(u)] },
      ),
    700,
  ),
    Hc(
      `${r.round} \xB7 ${$(a)} raised`,
      `${ge(s.gen)} launched`,
      `${r.cls} class \xB7 bench ${i.bench} \u2192 <em>${r.bench}</em> \xB7 about ${Te(r.D / i.D)}\xD7 the users`,
      !0,
    ));
  const l = [
    ...o.map((u) => u.name),
    ...Jt.filter((u) => u.gen === s.gen).map((u) => u.name),
  ];
  (l.length &&
    setTimeout(
      () =>
        be(
          l.length > 1 ? "New hardware to build" : "New hardware",
          l.join(", ") + ".",
          "c",
          null,
          {
            icon: "chip",
            kick: "Unlocked with " + ge(s.gen),
            items: [
              ...o.map((u) => u.id),
              ...Jt.filter((u) => u.gen === s.gen).map((u) => u.id),
            ],
          },
        ),
      1400,
    ),
    s.gen === Me - 1 &&
      setTimeout(
        () =>
          be(
            "AGI needs a gigawatt",
            "The last training run takes a gigawatt of compute. It starts once your campus draws 1 GW.",
            "v",
            null,
            {
              icon: "bolt",
              kick: "The last model",
              big: `${N(m.draw)} of 1 GW`,
            },
          ),
        3600,
      ));
  const f = xt.filter((u) => u.gen === s.gen).length;
  (f &&
    setTimeout(
      () =>
        be(
          `${je(f, "new technique")} to try`,
          xt
            .filter((u) => u.gen === s.gen)
            .map((u) => u.name)
            .join(", ") + ".",
          "g",
          null,
          { icon: "flask", kick: "Research unlocked" },
        ),
      2600,
    ),
    De());
}
function a0(e) {
  ((s.done = !0), (s.agiAt = s.played), (s.agi = (s.agi || 0) + 1));
  const t = s.played;
  ((!s.best || t < s.best) && (s.best = t),
    De(),
    Hc(
      `IPO \xB7 ${$(e)}`,
      "AGI",
      `${s.lab} reached AGI in <em>${yo(t)}</em>`,
      !0,
    ),
    setTimeout(() => {
      ((b("#agi-h").textContent = `${s.lab} reached AGI`),
        (b("#agi-p").innerHTML =
          `From one gaming PC in a garage to <b>${N(m.draw)}</b> and <b>${m.gpus.toLocaleString("en-US")}</b> GPUs, in <b>${Oa(t)}</b>${s.best === t && s.agi > 1 ? ", your fastest run yet" : ""}.`),
        (b("#agi-kv").innerHTML = [
          ["Time", yo(t)],
          ["Power", N(m.draw)],
          ["GPUs", m.gpus.toLocaleString("en-US")],
          ["Earned", $(s.earned)],
          ["Tokens served", Te(s.servedTok)],
          ["Runs to AGI", s.agi],
        ]
          .map(([o, n]) => `<div><i>${o}</i><b>${n}</b></div>`)
          .join("")),
        b("#d-agi").showModal());
    }, 2600));
}
function r0() {
  const e = { agi: s.agi, best: s.best, lab: s.lab, named: s.named };
  ((s = po((s.ng || 0) + 1)),
    Object.assign(s, e),
    (s.tut = 2),
    aa(),
    Rn(),
    be("A new garage", "Everything you learned comes with you.", "a", null, {
      icon: "garage",
      kick: "New lab",
      big: `+${s.ng * 50}% tokens/s`,
    }));
}
const i0 = [
    "Getting started",
    "Models",
    "Floors",
    "Scale",
    "Power",
    "Money",
    "Events",
    "Mastery",
    "Operations",
  ],
  Wo = [
    {
      id: "two",
      cat: 0,
      ic: "chip",
      test: () => m.racks >= 2,
      t: "Two GPUs",
      b: "Build a second PC.",
    },
    {
      id: "cool5",
      cat: 0,
      ic: "snow",
      test: () => m.racks >= 5 && !m.starved,
      t: "Cool customer",
      b: "Five racks, none of them throttling.",
    },
    {
      id: "panel",
      cat: 0,
      ic: "bolt",
      test: () => !!s.plants.panel,
      t: "Off the extension cord",
      b: "Get a 200 A panel put in.",
    },
    {
      id: "named",
      cat: 0,
      ic: "garage",
      test: () => s.named,
      t: "Name on the door",
      b: "Rename your lab.",
    },
    {
      id: "brag",
      cat: 0,
      ic: "spark",
      test: () => s.stats.shares > 0,
      t: "Bragging rights",
      b: "Share your datacenter.",
    },
    ...ee
      .slice(1)
      .map((e, t) => ({
        id: "gen" + (t + 1),
        cat: 1,
        ic: t + 1 === Me ? "trophy" : "rocket",
        test: () => s.gen >= t + 1,
        t: t + 1 === Me ? "AGI" : e.cls + " shipped",
        b:
          t + 1 === Me
            ? "Train the last model of all."
            : `Launch your first ${e.cls.toLowerCase()}-class model.`,
        share: t + 1 >= 4,
      })),
    ..._.slice(2).map((e, t) => ({
      id: "lvl" + (t + 2),
      cat: 2,
      ic: "grow",
      test: () => s.lvl >= t + 2,
      t: t === 0 ? "Out of the garage" : e[3],
      b: `Expand to the ${e[3].toLowerCase()}, ${e[0]} by ${e[1]} tiles.`,
      share: t + 2 === _.length - 1,
    })),
    {
      id: "g8",
      cat: 3,
      ic: "chip",
      test: () => m.gpus >= 8,
      t: "8 GPUs",
      b: "As many as one datacenter server holds.",
    },
    {
      id: "g100",
      cat: 3,
      ic: "chip",
      test: () => m.gpus >= 100,
      t: "100 GPUs",
      b: "A small research cluster.",
    },
    {
      id: "g1k",
      cat: 3,
      ic: "chip",
      test: () => m.gpus >= 1e3,
      t: "1,000 GPUs",
      b: "Bigger than most university clusters.",
    },
    {
      id: "g10k",
      cat: 3,
      ic: "chip",
      test: () => m.gpus >= 1e4,
      t: "10,000 GPUs",
      b: "About what trained GPT-3 in 2020.",
    },
    {
      id: "g100k",
      cat: 3,
      ic: "chip",
      test: () => m.gpus >= 1e5,
      t: "100,000 GPUs",
      b: "As big as the largest training clusters of 2024.",
      share: 1,
    },
    {
      id: "g1m",
      cat: 3,
      ic: "chip",
      test: () => m.gpus >= 1e6,
      t: "A million GPUs",
      b: "Labs started announcing plans this big in 2025.",
      share: 1,
    },
    {
      id: "t1b",
      cat: 3,
      ic: "spark",
      test: () => s.servedTok >= 1e9,
      t: "A billion tokens",
      b: "Served. Roughly ten thousand novels of answers.",
    },
    {
      id: "t1t",
      cat: 3,
      ic: "spark",
      test: () => s.servedTok >= 1e12,
      t: "A trillion tokens",
      b: "Served, one request at a time.",
    },
    {
      id: "w1",
      cat: 4,
      ic: "bolt",
      test: () => m.draw >= 1e3,
      t: "One megawatt",
      b: "As much power as about 800 American homes.",
    },
    {
      id: "w100",
      cat: 4,
      ic: "bolt",
      test: () => m.draw >= 1e5,
      t: "100 megawatts",
      b: "About 80,000 American homes: a small city.",
    },
    {
      id: "w1g",
      cat: 4,
      ic: "bolt",
      test: () => m.draw >= 1e6,
      t: "One gigawatt",
      b: "From a garage to a gigawatt: about 800,000 homes.",
      share: 1,
    },
    {
      id: "liquid",
      cat: 4,
      ic: "snow",
      test: () => qo.some((e) => P[s.cells[e]]?.id === "cdu"),
      t: "Liquid assets",
      b: "Your first liquid cooling loop.",
    },
    {
      id: "nuke",
      cat: 4,
      ic: "bolt",
      test: () => (s.plants.smr || 0) > 0,
      t: "Going nuclear",
      b: "Your first small reactor.",
      share: 1,
    },
    {
      id: "fusion",
      cat: 4,
      ic: "spark",
      test: () => (s.plants.fusion || 0) > 0,
      t: "A star in a box",
      b: "Your first fusion plant.",
      share: 1,
    },
    {
      id: "m1",
      cat: 5,
      ic: "coin",
      test: () => s.earned >= 1e6,
      t: "Your first million",
      b: "Earned one answer at a time.",
    },
    {
      id: "m1b",
      cat: 5,
      ic: "coin",
      test: () => s.earned >= 1e9,
      t: "A billion dollars",
      b: "Earned, not raised.",
    },
    {
      id: "m1t",
      cat: 5,
      ic: "coin",
      test: () => s.earned >= 1e12,
      t: "A trillion dollars",
      b: "Earned, not raised.",
      share: 1,
    },
    {
      id: "deliv10",
      cat: 8,
      ic: "truck",
      test: () => s.stats.deliveries >= 10,
      t: "Signed, sealed, delivered",
      b: "Sign for ten deliveries.",
    },
    {
      id: "ontime",
      cat: 8,
      ic: "truck",
      test: () => s.stats.bestOnTime >= 50,
      t: "Always on time",
      b: "Fifty deliveries in a row, none of them missed.",
    },
    {
      id: "rush",
      cat: 8,
      ic: "rocket",
      test: () => s.stats.rushed > 0,
      t: "In a hurry",
      b: "Pay to finish a build now.",
    },
    {
      id: "hired",
      cat: 8,
      ic: "person",
      test: () => s.staff.books >= 1 || s.staff.curb >= 1 || s.staff.fix >= 1,
      t: "Hired help",
      b: "Hire an assistant or an engineer.",
    },
    {
      id: "books",
      cat: 8,
      ic: "chip",
      test: () => s.staff.books === 2,
      t: "It does the billing",
      b: "Put your own models on billing.",
    },
    {
      id: "agents",
      cat: 8,
      ic: "truck",
      test: () => s.staff.curb === 2,
      t: "Agents at the curb",
      b: "Let agents sign for every delivery.",
    },
    {
      id: "robots",
      cat: 8,
      ic: "robot",
      test: () => !!s.staff.build,
      t: "Robots build",
      b: "Put robots on the building sites.",
    },
    {
      id: "selfheal",
      cat: 8,
      ic: "wrench",
      test: () => s.staff.fix === 2,
      t: "Self-healing",
      b: "Put your models on repairs.",
    },
    {
      id: "fix1",
      cat: 8,
      ic: "wrench",
      test: () => s.stats.fixed >= 1,
      t: "Back up",
      b: "Bring a rack back up after it goes down.",
    },
    {
      id: "fix100",
      cat: 8,
      ic: "wrench",
      test: () => s.stats.fixed >= 100,
      t: "Five nines",
      b: "Bring a hundred racks back up.",
    },
    {
      id: "auto",
      cat: 8,
      ic: "trophy",
      test: () =>
        s.staff.books === 2 &&
        s.staff.curb === 2 &&
        s.staff.fix === 2 &&
        !!s.staff.build,
      t: "It runs itself",
      b: "Billing, the curb, repairs and the building sites, all run by your models.",
      share: 1,
    },
    {
      id: "night",
      cat: 8,
      ic: "spark",
      test: () => s.stats.nights > 0,
      t: "Night shift",
      b: "Come back to deliveries your agents signed for.",
    },
    {
      id: "viral5",
      cat: 6,
      ic: "spark",
      test: () => s.stats.virals >= 5,
      t: "Main character",
      b: "Catch five viral posts.",
    },
    {
      id: "heat",
      cat: 6,
      ic: "flame",
      test: () => s.stats.heatOk >= 1,
      t: "Heat-proof",
      b: "Ride out a heat wave with no rack throttling.",
    },
    {
      id: "or",
      cat: 6,
      ic: "spark",
      test: () => !!(s.res.market && we.market.brand),
      t: "On OpenRouter",
      b: "List your model where developers choose their models.",
    },
    {
      id: "no429",
      cat: 7,
      ic: "trophy",
      test: () => s.stats.bestStreak >= 300,
      t: "Zero 429s",
      b: "Serve every user for five minutes straight.",
    },
    {
      id: "perfect",
      cat: 7,
      ic: "snow",
      test: () => m.racks >= 200 && !m.starved,
      t: "Perfect hall",
      b: "Two hundred racks, none of them throttling.",
      share: 1,
    },
    {
      id: "allres",
      cat: 7,
      ic: "flask",
      test: () => xt.every((e) => s.res[e.id]),
      t: "Read every paper",
      b: "Finish every research.",
    },
    {
      id: "m10",
      cat: 7,
      ic: "trophy",
      test: () => s.stats.missions >= 10,
      t: "On a mission",
      b: "Complete ten missions.",
    },
    {
      id: "m50",
      cat: 7,
      ic: "trophy",
      test: () => s.stats.missions >= 50,
      t: "Mission control",
      b: "Complete fifty missions.",
    },
    {
      id: "garage",
      cat: 7,
      ic: "garage",
      secret: 1,
      test: () => s.gen >= 2 && s.lvl <= 1,
      t: "Garage forever",
      b: "Ship an assistant without leaving the double garage.",
      share: 1,
    },
    {
      id: "speed",
      cat: 7,
      ic: "rocket",
      secret: 1,
      test: () => s.done && (s.agiAt || 1e9) < 6e3,
      t: "Speedrun",
      b: "Reach AGI in under a hundred minutes.",
      share: 1,
    },
    {
      id: "again",
      cat: 7,
      ic: "garage",
      secret: 1,
      test: () => (s.ng || 0) > 0,
      t: "Again, faster",
      b: "Start a new lab after reaching AGI.",
    },
  ],
  mi = () => Wo.filter((e) => s.miles[e.id]).length;
let Zc = 0;
function l0() {
  if (!(L - Zc < 0.5)) {
    Zc = L;
    for (const e of Wo)
      if (!(s.miles[e.id] || !e.test())) {
        ((s.miles[e.id] = Math.round(s.played) || 1),
          R.chime(),
          sf(),
          be(e.t, e.b, "a", e.share ? ["Share it", () => Bs()] : null, {
            icon: "trophy",
            kick: "Milestone",
            gold: !!e.share,
          }));
        break;
      }
  }
}
const Ls = (e) => {
    if (e <= 12) return Math.ceil(e);
    const t = 10 ** (Math.floor(Math.log10(e)) - 1);
    return Math.ceil(e / t) * t;
  },
  bi = () => Object.keys(s.res).length,
  Qc = (e) => {
    let t = 0;
    for (const o of K[e].kind === "rack" ? ke : qo)
      P[s.cells[o]]?.id === e && t++;
    return t;
  },
  c0 = {
    panel: "the 200 A panel",
    xfmr: "a transformer",
    sub: "a substation",
    gas: "a gas turbine bank",
    smr: "a small reactor",
    fusion: "a fusion plant",
  },
  Mn = {
    racks: {
      ic: "chip",
      t: (e) => (e.n === 2 ? "Build a second PC" : `Run ${e.n} racks`),
      v: () => m.racks,
    },
    cooled: {
      ic: "snow",
      t: (e) => `Keep ${e.n} racks cooled`,
      v: () => ke.filter((e) => It[e] >= 0.98).length,
    },
    plant: {
      ic: "bolt",
      t: (e) => `Build ${c0[e.p]}`,
      v: (e) => s.plants[e.p] || 0,
      p: (e) =>
        (s.plants[e.p] || 0) >= e.n ? 1 : A(s.cash / Bt(ft[e.p]), 0, 0.97),
    },
    streak: {
      ic: "spark",
      t: (e) => `Serve everyone for ${e.n} s`,
      v: () => s.stats.streak,
      f: (e) => Math.floor(e) + " s",
    },
    tps: {
      ic: "spark",
      t: (e) => `Serve ${Te(e.n)} tokens/s`,
      v: () => m.served,
      f: Te,
    },
    gpus: {
      ic: "chip",
      t: (e) => `Own ${Te(e.n)} GPUs`,
      v: () => m.gpus,
      f: Te,
    },
    draw: { ic: "bolt", t: (e) => `Draw ${N(e.n)}`, v: () => m.draw, f: N },
    res: {
      ic: "flask",
      t: (e) => (e.n > 1 ? `Finish ${e.n} research` : "Finish a research"),
      v: (e) => bi() - e.base,
    },
    expand: {
      ic: "grow",
      t: (e) => `Expand to the ${_[e.n][3].toLowerCase()}`,
      v: () => s.lvl,
      p: (e) => (s.lvl >= e.n ? 1 : A(s.cash / _[e.n][2], 0, 0.97)),
    },
    launch: {
      ic: "rocket",
      t: (e) => `Launch ${ge(e.n)}`,
      v: () => s.gen,
      p: (e) => (s.gen >= e.n ? 1 : A(s.train / Math.max(dt(), 1e-9), 0, 0.99)),
    },
    earn: {
      ic: "coin",
      t: (e) => `Earn ${$(e.n)}`,
      v: (e) => s.earned - e.base,
      f: $,
    },
    deliv: {
      ic: "truck",
      t: (e) =>
        e.n > 1 ? `Sign for ${e.n} deliveries` : "Sign for a delivery",
      v: (e) => s.stats.deliveries - e.base,
    },
    viral: {
      ic: "spark",
      t: () => "Catch a viral post",
      v: (e) => s.stats.virals - e.base,
    },
    tier: {
      ic: "chip",
      t: (e) => `Run ${e.n} ${K[e.p].name.replace("Gaming PC", "PC")}s`,
      v: (e) => Qc(e.p),
    },
    fix: {
      ic: "wrench",
      t: (e) =>
        e.n > 1 ? `Bring ${e.n} racks back up` : "Bring a rack back up",
      v: (e) => s.stats.fixed - e.base,
    },
  },
  Pt = [
    { k: "racks", n: 2, r: 30 },
    { k: "cooled", n: 3, r: 50 },
    { k: "plant", p: "panel", n: 1, r: 80 },
    { k: "streak", n: 20, r: 120 },
    { k: "launch", n: 1, r: 150 },
  ],
  Ka = (e) => {
    const t = Mn[e.k];
    return t.p ? t.p(e) : A(t.v(e) / e.n, 0, 1);
  };
function f0() {
  const e = new Set(s.missions.map((h) => h.k)),
    t = ee[s.gen],
    o = Math.max(m.rev, 0.5),
    n = [],
    a = (h) => Xc(Math.max(h, 25)),
    r = (h, w) => {
      e.has(w.k) || n.push([h, w]);
    };
  s.gen < Me && !s.done && r(4, { k: "launch", n: s.gen + 1, r: a(o * 90) });
  const i = _[s.lvl + 1];
  i && r(2, { k: "expand", n: s.lvl + 1, r: a(i[2] * 0.3) });
  const l = t.D * de.demand;
  (l > m.served * 1.25 &&
    r(3, {
      k: "tps",
      n: Ls(Math.min(l * 0.95, Math.max(m.served * 1.5, m.served + 40))),
      r: a(o * 80),
    }),
    r(2, { k: "gpus", n: Ls(m.gpus * 1.6 + 4), r: a(o * 70) }),
    r(1.5, {
      k: "draw",
      n: Ls(Math.max(m.draw * 1.6, m.draw + 1)),
      r: a(o * 60),
    }),
    r(1.5, {
      k: "earn",
      n: Ls(Math.max(o * 150, 150)),
      base: s.earned,
      r: a(o * 45),
    }),
    r(2, {
      k: "streak",
      n: [30, 45, 60, 90, 90, 120, 120, 120][s.gen],
      r: a(o * 90),
    }));
  const f = xt.filter((h) => se(h) && !s.res[h.id]).length;
  (f && r(2, { k: "res", n: Math.min(2, f), base: bi(), r: a(o * 60) }),
    s.gen >= 1 &&
      s.staff.curb !== 2 &&
      r(1.5, {
        k: "deliv",
        n: s.stats.deliveries > 4 ? 3 : 1,
        base: s.stats.deliveries,
        r: a(o * 40),
      }),
    s.gen >= 1 &&
      r(1.2, { k: "viral", n: 1, base: s.stats.virals, r: a(o * 40) }));
  const u = Jt.filter(
    (h) => h.id !== "outlet" && se(h) && (s.plants[h.id] || 0) < h.max,
  ).at(-1);
  u &&
    r(1.5, {
      k: "plant",
      p: u.id,
      n: (s.plants[u.id] || 0) + 1,
      r: a(Bt(u) * 0.25),
    });
  const g = bs("rack");
  if (
    (g &&
      g.gen > 0 &&
      r(2, {
        k: "tier",
        p: g.id,
        n: Qc(g.id) + (s.gen < 3 ? 3 : 4),
        r: a(Math.max(g.cost * 1.5, o * 60)),
      }),
    m.racks >= 3 &&
      r(1, { k: "cooled", n: Ls(m.racks * 1.25 + 1), r: a(o * 50) }),
    s.stats.downs > 0 &&
      s.staff.fix !== 2 &&
      r(1.5, {
        k: "fix",
        n: s.stats.fixed > 10 ? 6 : 3,
        base: s.stats.fixed,
        r: a(o * 40),
      }),
    !n.length)
  )
    return null;
  let d = Be() * n.reduce((h, w) => h + w[0], 0),
    p = 0;
  for (; p < n.length - 1 && (d -= n[p][0]) > 0;) p++;
  return n[p][1];
}
function d0() {
  const e = s.mseq < Pt.length && !s.ng ? { ...Pt[s.mseq], ob: 1 } : f0();
  return e
    ? (s.mseq++,
      (e.id = s.mseq),
      (e.done = !1),
      e.k === "res" && e.base == null && (e.base = bi()),
      ["deliv", "viral"].includes(e.k) &&
        e.base == null &&
        (e.base = e.k === "deliv" ? s.stats.deliveries : s.stats.virals),
      e)
    : null;
}
let wi = 0,
  Sn = !0;
const u0 = () =>
  s.missions.some((e) => Ss(e) && !e.claimed) || (s.mseq < Pt.length && !s.ng)
    ? 1
    : 3;
function Jc() {
  for (; s.missions.filter((e) => !e.claimed).length < u0();) {
    const e = d0();
    if (!e) break;
    ((e.fresh = !0), s.missions.push(e), (Sn = !0));
  }
}
function ef() {
  if (!(L - wi < 0.25)) {
    ((wi = L), Jc());
    for (const e of s.missions)
      e.done ||
        e.claimed ||
        ((Ka(e) >= 1 || (Mn[e.k].v(e) >= e.n && !Mn[e.k].p)) &&
          ((e.done = !0), (e.doneAt = L), (Sn = !0), R.chime()));
    for (const e of s.missions)
      e.done &&
        !e.claimed &&
        (e.doneAt <= L || (e.doneAt = L),
        L - e.doneAt > (Ss(e) ? 1.3 : 2.4) && of(e));
    (Jc(), Sn ? h0() : tf());
  }
}
function h0() {
  Sn = !1;
  const e = b("#mlist"),
    t = s.missions.filter((a) => !Ss(a)),
    o = b("#missions"),
    n = o.hidden;
  ((o.hidden = !t.length),
    n &&
      t.length &&
      !s.seen.board &&
      ((s.seen.board = 1),
      be(
        "Missions unlocked",
        "Three goals at a time, top left. Each one pays as soon as it is done.",
        "a",
        null,
        { icon: "trophy", kick: "New" },
      )),
    (e.innerHTML = t
      .map((a) => {
        const r = Mn[a.k];
        return `<div class="mi${a.done ? " done" : ""}${a.fresh ? " new" : ""}${a.claimed ? " gone" : ""}" data-id="${a.id}"><span class="mic"><svg viewBox="0 0 24 24" aria-hidden="true">${za[r.ic]}</svg></span><div class="mt"><b><span>${r.t(a)}</span><em data-n></em></b><u><i data-f></i></u></div><span class="mr">${a.done ? "\u2713 " : ""}+${$(a.r)}</span></div>`;
      })
      .join("")),
    (b("#mdone").textContent = s.stats.missions
      ? `${s.stats.missions} done`
      : ""),
    tf(),
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        (e
          .querySelectorAll(".mi.new")
          .forEach((a) => a.classList.remove("new")),
          s.missions.forEach((a) => (a.fresh = !1)));
      }),
    ));
}
function tf() {
  for (const e of b("#mlist").children) {
    const t = s.missions.find((r) => r.id == e.dataset.id);
    if (!t) continue;
    const o = Mn[t.k],
      n = t.done ? 1 : Ka(t);
    e.querySelector("[data-f]").style.width = (n * 100).toFixed(1) + "%";
    const a = e.querySelector("[data-n]");
    a.textContent = t.done
      ? ""
      : o.p
        ? Math.floor(n * 100) + "%"
        : `${(o.f || Te)(Math.max(0, Math.min(o.v(t), t.n)))}/${(o.f || Te)(t.n)}`;
  }
}
b("#mlist").addEventListener("click", (e) => {
  const t = e.target.closest(".mi.done");
  if (!t) return;
  const o = s.missions.find((n) => n.id == t.dataset.id);
  o && of(o, t);
});
function of(e, t) {
  if (e.claimed) return;
  ((e.claimed = !0), (s.cash += e.r), s.stats.missions++, R.coin(3));
  const o = b("#mlist").querySelector(`[data-id="${e.id}"]`);
  (nf(t || o || b("#why")),
    o && o.classList.add("gone"),
    setTimeout(() => {
      ((s.missions = s.missions.filter((n) => n !== e)), (Sn = !0), De());
    }, 430));
}
function nf(e) {
  const t = e.getBoundingClientRect(),
    o = b("#cash").getBoundingClientRect(),
    n = t.left + t.width * 0.6,
    a = t.top + t.height / 2,
    r = o.left + o.width * 0.4,
    i = o.top + o.height * 0.55;
  for (let l = 0; l < 11; l++) {
    const f = document.createElement("i");
    ((f.className = "coinfly"), mt.appendChild(f));
    const u = (n + r) / 2 + (Be() - 0.5) * 110,
      g = Math.min(a, i) - 30 - Be() * 60,
      d = f.animate(
        [
          {
            transform: `translate(${n + (Be() - 0.5) * 20}px,${a}px) scale(.5)`,
            opacity: 0,
          },
          {
            transform: `translate(${u}px,${g}px) scale(1.15)`,
            opacity: 1,
            offset: 0.45,
          },
          { transform: `translate(${r}px,${i}px) scale(.55)`, opacity: 0.95 },
        ],
        {
          duration: 620 + l * 30,
          delay: l * 38,
          easing: "cubic-bezier(.3,.1,.3,1)",
          fill: "backwards",
        },
      );
    d.onfinish = () => {
      if ((f.remove(), l === 10)) {
        const p = b("#cashbox");
        (p.classList.remove("up"), p.offsetWidth, p.classList.add("up"));
      }
    };
  }
}
function sf() {
  b("#tcount").textContent = mi();
}
function p0() {
  const e = mi();
  ((b("#miles-p").innerHTML =
    `<b>${e}</b> of ${Wo.length} earned. The gold ones are worth sharing.`),
    (b("#miles-bar").style.width = ((e / Wo.length) * 100).toFixed(1) + "%"),
    (b("#miles-grid").innerHTML = i0
      .map((t, o) => {
        const n = Wo.filter((a) => a.cat === o);
        return (
          `<h3>${t}<em>${n.filter((a) => s.miles[a.id]).length} of ${n.length}</em></h3><div class="mgrid">` +
          n
            .map((a) => {
              const r = !!s.miles[a.id],
                i = a.secret && !r;
              return `<div class="mcard${r ? " on" : ""}${a.share ? " gold" : ""}"><span class="mi2"><svg viewBox="0 0 24 24" aria-hidden="true">${za[i ? "spark" : a.ic]}</svg></span><div><b>${i ? "Secret" : a.t}</b><small>${i ? "Keep playing." : a.b}</small></div></div>`;
            })
            .join("") +
          "</div>"
        );
      })
      .join("")),
    b("#d-miles").showModal(),
    R.tick());
}
b("#trophy").onclick = () => p0();
const Xa = Fn(3.3, 1.32, 1200, 480, null, 1, {
    alphaTest: 0,
    side: c.FrontSide,
  }),
  g0 = (() => {
    const e = oe();
    e.box(C("#e8e9ec", { roughness: 0.5 }), -0.2, 1.25, 0, 3.4, 1.75, 1.55, {
      r: 0.05,
    })
      .box(ll("#2a3140", { roughness: 0.3 }), 2.05, 0.95, 0, 1, 1.25, 1.5, {
        r: 0.12,
      })
      .box(Ze("#cfe8ff", 0.9), 2.5, 1.25, 0, 0.06, 0.45, 1.2)
      .box(In, 0, 0.28, 0, 4.6, 0.3, 1.3);
    for (const t of [-1.2, 0.6, 2.1])
      for (const o of [-0.66, 0.66])
        e.cyl(In, t, 0.32, o, 0.32, 0.32, 0.22, { rx: Math.PI / 2, seg: 14 });
    return e.geos();
  })(),
  m0 = new c.BoxGeometry(0.04, 0.12, 0.22);
function b0(e) {
  const t = new c.Group();
  for (const [o, n] of g0) {
    const a = new c.Mesh(n, o);
    ((a.castShadow = a.receiveShadow = !0), t.add(a));
  }
  for (const o of [1, -1]) {
    const n = new c.Mesh(Xa.geometry, Xa.material);
    (n.position.set(-0.2, 1.3, 0.785 * o),
      o < 0 && (n.rotation.y = Math.PI),
      t.add(n));
  }
  for (const o of [-0.5, 0.5]) {
    const n = new c.Mesh(m0, Ze("#fff6e0", 3));
    (n.position.set(2.56, 0.7, o), t.add(n));
  }
  return (
    (t.rotation.y = Math.PI),
    (t.visible = !1),
    Ee.add(t),
    t.traverse((o) => {
      o.isMesh && Pa(o, "truck", { ti: e });
    }),
    t
  );
}
const Rs = Array.from({ length: 8 }, (e, t) => ({
    g: b0(t),
    id: -1,
    state: "off",
    x: 0,
    t: 0,
  })),
  xi = 2.6,
  Ps = 5.4,
  Za = Ut + 1.05,
  Qa = (e) =>
    Rs.find((t) => t.id === e && t.state !== "off" && t.state !== "out");
function vi(e) {
  const t = Qa(e);
  t && ((t.state = "out"), (t.t = L));
}
function w0() {
  for (const e of Rs) ((e.state = "off"), (e.id = -1), (e.g.visible = !1));
  ro.length = 0;
}
function x0(e) {
  const t = Math.max(34, U() + 26);
  let o = 0;
  for (const n of ["curb", "road"])
    for (const a of s.trucks) {
      if (a.st !== n || (n === "road" && a.t < 0)) continue;
      const r = o < 2 ? xi + o * Ps : t + (o - 1) * Ps;
      o++;
      let i = Qa(a.id);
      if (!i) {
        if (((i = Rs.find((f) => f.state === "off")), !i)) continue;
        ((i.id = a.id), (i.x = n === "road" ? t + Ps : r), (i.g.visible = !0));
      }
      i.state = a.st;
      const l = a.st === "road" ? Pn(t + Ps, r, hr(A(a.t / on, 0, 1))) : r;
      ((i.x += (l - i.x) * (1 - Math.exp(-e * (a.st === "road" ? 14 : 3)))),
        i.g.position.set(i.x, 0, Za));
    }
  for (const n of Rs) {
    if (n.state !== "out") continue;
    const a = L - n.t;
    ((n.x -= e * Math.min(24, 2 + a * 9)),
      n.g.position.set(n.x, 0, Za),
      n.x < -80 && ((n.state = "off"), (n.id = -1), (n.g.visible = !1)));
  }
}
function yi() {
  const e = we.truck;
  if (e.img) {
    let t = fn.get("truck:img");
    if (
      (t ||
        ((t = new Image()),
        (t.onload = yi),
        (t.src = e.img),
        fn.set("truck:img", t)),
      t.complete && t.naturalWidth)
    ) {
      Xa.userData.redraw((o, n, a) => o.drawImage(t, 0, 0, n, a));
      return;
    }
  }
  Xa.userData.redraw((t, o, n) => {
    ((t.fillStyle = e.c1),
      t.fillRect(0, 0, o, n),
      (t.fillStyle = e.c2),
      t.fillRect(0, n - 46, o, 46),
      (t.fillStyle = e.c2),
      (t.font = "800 140px Outfit, sans-serif"),
      (t.textAlign = "center"),
      (t.textBaseline = "middle"),
      (t.letterSpacing = "6px"),
      t.fillText(e.name, o / 2, n / 2 - 36, o - 80),
      (t.font = "500 52px Outfit, sans-serif"),
      (t.letterSpacing = "0px"),
      (t.fillStyle = e.c1 === "#e9ebf0" ? "#4a5266" : "#c9d1e4"),
      t.fillText(e.sub, o / 2, n / 2 + 72, o - 100));
  });
}
(yi(),
  Js.push(
    yi,
    () => [0, 1, 2].forEach(ma),
    () => da(),
    Nr,
    () => os(),
  ));
const ki = (() => {
    const e = oe(),
      t = C("#b8935e", { roughness: 0.85 }),
      o = C("#2c3442", { roughness: 0.6 });
    e.box(t, 0, 0, 0, 0.5, 0.44, 0.5, { r: 0.03 })
      .box(o, 0, 0, 0, 0.52, 0.06, 0.52)
      .box(Ze("#7fe3ff", 1.4), 0, 0.12, 0.252, 0.2, 0.04, 0.01);
    const n = e.geos(),
      a = new c.InstancedMesh(
        Ko(
          n.map((r) => r[1]),
          !0,
        ),
        n.map((r) => r[0]),
        96,
      );
    return (
      (a.count = 0),
      (a.castShadow = !0),
      (a.frustumCulled = !1),
      Ee.add(a),
      bt.push(a),
      a
    );
  })(),
  ro = [];
let af = 0;
function v0(e, t) {
  const o = Qa(t.id),
    n = e.k % B,
    a = Math.floor(e.k / B),
    r = Math.max(1, Ln / 3),
    i = A(0.75 / r, 0.15, 0.75),
    l = L + Math.min(ro.length * 0.05, 1.4) / r;
  if (((fs[e.k] = Se ? L : l + i), (oo = !0), Se || ro.length >= 96)) return;
  const f = o && o.x < xi + Ps * 1.5 ? o.x : xi;
  ro.push({
    x0: f + 1.1 - Be() * 1.4,
    z0: Za - 0.2,
    x1: n + 0.5,
    z1: -(a + 0.5),
    t0: l,
    dur: i,
    r: Be() * 6,
  });
}
function y0() {
  let e = 0;
  for (let t = ro.length - 1; t >= 0; t--)
    L >= ro[t].t0 + ro[t].dur && ro.splice(t, 1);
  for (const t of ro) {
    const o = (L - t.t0) / t.dur;
    if (o < 0) continue;
    const n = Ki(o),
      a = o < 0.12 ? 0.4 + 5 * o : 1;
    (V.set(
      Pn(t.x0, t.x1, n),
      Pn(1.35, le + 0.24, o) + Math.sin(o * Math.PI) * 2.2,
      Pn(t.z0, t.z1, n),
    ),
      Qs.set(0, t.r + o * 2.4, Math.sin(o * Math.PI) * 0.4),
      Gt.setFromEuler(Qs),
      ct.compose(V, Gt, ka.set(a, a, a)),
      ki.setMatrixAt(e++, ct));
  }
  (ka.set(1, 1, 1),
    (ki.count = e),
    (e || af) && (ki.instanceMatrix.needsUpdate = !0),
    (af = e));
}
const Es = { viral: { state: "off", t: 0, next: 150 }, heat: { next: 420 } },
  io = yn("click"),
  zo = yn("click"),
  Ja = yn("click"),
  Mi = yn(),
  er = yn("click");
((er.e.onclick = () => {
  Po("you") || Q("Every rack is up");
}),
  (io.e.onclick = () => {
    _t("you") || Q("Your users owe you nothing yet");
  }),
  (zo.e.onclick = () => {
    go("you") || Q("No delivery is at the curb");
  }),
  (Ja.e.onclick = () => A0()));
function k0() {
  const e = Gs && !Ve && !mt.classList.contains("ui-off"),
    t =
      e &&
      s.staff.books !== 2 &&
      (s.bill >= Math.max(1, sn() * 0.08) || (Wa() && s.bill >= 1)),
    o = Ro();
  (io.e.classList.toggle("hot", t && o),
    zt(
      io,
      V.set(X.x, 2.65, X.z),
      o ? `Billing full \xB7 ${$(s.bill)}` : `${$(s.bill)} to bill`,
      qe ? "" : o ? "users go unbilled" : "bill your users",
      "#1d1406",
      t,
    ));
  const n = s.staff.curb !== 2 ? an() : [],
    a = n.length ? Qa(n[0].id) : null;
  if (a && e) {
    const l = n.flatMap(Ot),
      f = Math.min(...n.map((g) => Ar - g.wait)),
      u = f < 20;
    (zo.e.classList.toggle("hot", u),
      zt(
        zo,
        V.set(a.x + 0.3, 3.05, Za),
        n.length > 1
          ? `Delivery \xD7 ${n.length} \xB7 ${No(l)}`
          : `Delivery \xB7 ${No(l)}`,
        u ? `leaves in ${te(f)}` : qe ? "" : "sign for it",
        "#1d1406",
        !0,
      ));
  } else zt(zo, V, "", "", "", !1);
  const r = s.down.length,
    i = e && r > 0 && s.staff.fix !== 2;
  if ((er.e.classList.toggle("hot", i), i)) {
    const l = s.down[0].k;
    zt(
      er,
      V.set((l % B) + 0.5, le + 2.05, -(Math.floor(l / B) + 0.5)),
      r > 1 ? `${Te(r)} racks down` : "Rack down",
      qe ? "" : r > 1 ? "fix them all" : "fix it",
      "#ff8f7a",
      !0,
    );
  } else zt(er, V, "", "", "", !1);
}
function M0() {
  R.chime();
}
function S0(e, t) {
  (R.no(),
    be(
      "Missed delivery",
      `The driver waited a minute and took ${e === 1 ? "it" : "them"} back. ${e === 1 ? "It comes" : "They come"} again on a later truck, with a ${$(t)} redelivery fee.`,
      "r",
      Rt() && !s.staff.curb
        ? ["Get help at the curb", () => ko("staff")]
        : null,
      { icon: "truck", kick: "Missed" },
    ));
}
function C0(e, t, o) {
  o === "you" && (R.coin(2), R.place("rack", Math.max(2, t)));
}
function $0(e, t) {
  const o = t === "you";
  (o &&
    (R.coin(3),
    nf(io.on ? io.e : b("#billchip").hidden ? b("#cash") : b("#billchip"))),
    Wc(V.set(X.x, 2.1, X.z), "+" + $(e), "a", o));
}
const tr = [];
let rf = -9,
  lf = -1,
  Si = 0;
function T0(e) {
  if ((tr.push({ k: e, t: L }), tr.length > 48 && tr.shift(), L - rf > 0.4))
    ((rf = L),
      (lf = e),
      (Si = 1),
      R.built(),
      vn(e, "Online", "c"),
      (ao[(hi - 1) % ao.length].k = e));
  else {
    Si++;
    const t = ao.find((o) => o.k === lf && L - o.t < 0.6);
    t && (t.e.textContent = `Online \xD7 ${Si}`);
  }
  Ct === e && ks();
}
function A0() {
  const e = Es.viral;
  e.state === "on" &&
    (s.stats.virals++,
    (e.state = "off"),
    (s.viral = 2.2),
    R.chime(),
    be(
      "You went viral",
      "Someone posted your model. Serve the crowd while it lasts.",
      "v",
      null,
      { icon: "spark", kick: "Viral", big: "3\xD7 users" },
    ));
}
function L0(e) {
  if (
    (de.hw &&
      s.heatwave <= 0 &&
      ((s.heatwave = 0),
      s.stats.hwBad || s.stats.heatOk++,
      Ao(),
      Ne(),
      be(
        "The heat wave broke",
        "Coolers are back to full strength.",
        "c",
        null,
        { icon: "snow", kick: "All clear" },
      )),
    s.tut < 2 || s.done)
  )
    return;
  const t = Es.viral;
  (s.gen >= 1 &&
    ((t.next -= e),
    t.state === "off" &&
      t.next <= 0 &&
      ((t.state = "on"), (t.t = L), (t.next = 160 + Be() * 160)),
    t.state === "on" && L - t.t > 12 && (t.state = "off")),
    zt(
      Ja,
      V.set(X.x, 3.3 + Math.sin(L * 3) * 0.1, X.z),
      "Someone posted your model",
      "catch it",
      "#1d1406",
      t.state === "on" && Gs && !Ve,
    ));
  const o = Es.heat;
  (s.gen >= 2 &&
    ((o.next -= e),
    o.next <= 8 &&
      o.next + e > 8 &&
      be(
        "Heat wave coming",
        "Coolers lose a quarter of their capacity for 40 seconds. Spare cooling keeps you running.",
        "r",
        null,
        { icon: "flame", kick: "In 8 seconds" },
      ),
    o.next <= 0 &&
      ((s.heatwave = 40),
      (s.stats.hwBad = !1),
      (o.next = 420 + Be() * 300),
      Ao(),
      Ne())),
    s.heatwave > 0 && m.starved > 0 && (s.stats.hwBad = !0));
}
function R0() {
  const e = (Date.now() - (s.last || Date.now())) / 1e3;
  if (e < 5) return;
  const t = Gr(e);
  t && e >= 60 && Ci(t, e);
}
const Ds = (e, t, o) => `${e} ${e === 1 ? t : o}`,
  cf = (e) => (e < 90 ? "a minute" : Math.round(e / 60) + " minutes");
function Ci(e, t) {
  const o = [],
    n = s.staff.books === 2,
    a = s.earned - e.earned,
    r = s.bill,
    i = s.stats.built - e.built,
    l = s.stats.deliveries - e.deliv,
    f = an(),
    u = f.flatMap(Ot);
  (n && a > 0.5 && o.push(`Your models billed <b>${$(a)}</b>`),
    !n &&
      r >= 0.01 &&
      o.push(
        `Your users owe you <b>${$(r)}</b>` +
          (s.stats.unbilled - e.unbilled > 0.5
            ? ". Billing filled up, and what they used after that went unbilled"
            : ""),
      ),
    l > 0 &&
      s.staff.curb === 2 &&
      (o.push(`Agents signed for <b>${Ds(l, "delivery", "deliveries")}</b>`),
      s.stats.nights++));
  {
    const p = s.stats.fixed - (e.fixed || 0),
      h = s.down.length;
    (p > 0 &&
      s.staff.fix === 2 &&
      o.push(`Your models brought <b>${Ds(p, "rack", "racks")}</b> back up`),
      h &&
        o.push(
          `<b>${Ds(h, "rack is", "racks are")}</b> down, waiting for you`,
        ));
  }
  if (
    (f.length &&
      o.push(
        `<b>${Ds(f.length, "delivery is", "deliveries are")}</b> waiting at the curb: ${No(u)}`,
      ),
    i > 0 &&
      o.push(
        `<b>${Ds(i, "build", "builds")}</b> finished` +
          (s.sites.length ? `, ${s.sites.length} still to go` : ""),
      ),
    s.lvl > e.lvl && o.push(`The <b>${_[s.lvl][3].toLowerCase()}</b> is built`),
    nn() > e.cap + 1e-6 &&
      o.push(`New power came online: <b>${N(nn())}</b> now`),
    s.gen < Me && e.gen === s.gen)
  ) {
    const p = s.train / dt();
    vt() && !e.rd
      ? o.push(`<b>${ge(s.gen + 1)}</b> finished training: launch it`)
      : Math.floor(p * 100) > Math.floor(e.f0 * 100) &&
        o.push(
          `${ge(s.gen + 1)}: ${Math.floor(e.f0 * 100)}% \u2192 <b>${Math.floor(p * 100)}%</b> trained`,
        );
  }
  ((b("#back-p").innerHTML =
    `You were away for <b>${Oa(t)}</b>. ` +
    (e.cut
      ? `${s.lab} worked one night shift, <b>${cf(e.t)}</b>, then waited for you.`
      : `${s.lab} kept working while you were gone.`)),
    (b("#back-l").innerHTML = o.map((p) => `<li>${p}</li>`).join("")));
  const g = b("#back-n");
  ((g.hidden = !(n ? a > 0.5 : r >= 0.01)),
    (g.innerHTML = n ? "+" + $(a) : `${$(r)} <small>to bill</small>`),
    (b("#back-f").innerHTML =
      n && s.staff.curb === 2
        ? ""
        : s.gen >= ne.books.gen
          ? "Your models can do the billing" +
            (s.gen >= ne.curb.gen ? " and run the curb" : "") +
            ", and keep working while you are away. Put them on it in <b>Staff</b>."
          : `From ${ge(ne.books.gen)} on, your own models can do the billing, and from ${ge(ne.curb.gen)} on, run the curb, even while you are away.`));
  const d = b("#back-bill");
  ((d.hidden = n || r < 0.01),
    (d.textContent = `Bill them \xB7 +${$(r)}`),
    setTimeout(() => {
      b("#d-back").open || b("#d-back").showModal();
    }, 600));
}
b("#back-bill").onclick = () => {
  (b("#d-back").close(), _t("you"));
};
function ff() {
  (s.tut === 0 && m.racks >= 2 && (s.tut = 1),
    s.tut === 1 && (m.racks >= 3 || s.played > 90) && (s.tut = 2));
}
const P0 = new c.Color(1.3, 2.1, 0.05),
  df = new c.Color(0.5, 1.35, 1.9),
  E0 = new c.Color(2.2, 0.35, 0.42),
  D0 = new c.Color(2, 1.15, 0.35),
  $i = new c.Color(0.75, 1.25, 2.2),
  or = new c.Color(2.2, 1.3, 0.35),
  G0 = new c.Color(1.9, 0.55, 0.12),
  uf = new c.Color(0.45, 1.05, 1.8),
  B0 = new c.Color(2.4, 0.28, 0.2),
  re = new c.Vector3(),
  Ye = new c.Vector3(),
  Ti = new c.Vector3(),
  Cn = [],
  hf = Array.from({ length: 128 }, () => new c.Vector3());
function pf(e, t, o, n) {
  let a = 1;
  for (; a < t.length - 1 && t[a] < o;) a++;
  const r = A((o - t[a - 1]) / Math.max(t[a] - t[a - 1], 1e-6), 0, 1);
  return n.lerpVectors(e[a - 1], e[a], r);
}
let ke = [],
  qo = [];
const Le = { N: 72, nodes: [], edges: [] };
{
  const e = Et(9);
  for (let o = 0; o < Le.N; o++) {
    const n = 1 - (2 * (o + 0.5)) / Le.N,
      a = Math.sqrt(1 - n * n),
      r = o * 2.39996;
    Le.nodes.push(new c.Vector3(Math.cos(r) * a, n, Math.sin(r) * a));
  }
  const t = new Set();
  (Le.nodes.forEach((o, n) => {
    Le.nodes
      .map((a, r) => [r, o.distanceTo(a)])
      .filter((a) => a[0] !== n)
      .sort((a, r) => a[1] - r[1])
      .slice(0, 3)
      .forEach(([a]) => {
        const r = n < a ? n + "-" + a : a + "-" + n;
        t.has(r) || (t.add(r), Le.edges.push([n, a, e()]));
      });
  }),
    Le.edges.sort((o, n) => o[2] - n[2]));
}
const gf = yn();
function Ai(e) {
  const t = U(),
    o = W(),
    n = Li();
  return e.set(t * 0.17, kt() + 0.75 + n * 1.15, -o * 0.62);
}
const Li = () => A(0.4 + s.gen * 0.12 + Math.max(U(), W()) * 0.04, 0.4, 4),
  Mo = new c.Quaternion(),
  mf = new c.Vector3();
function I0(e) {
  const t = Li(),
    o = Ai(Ti),
    n = s.gen >= Me ? 1 : s.train / dt(),
    a = vt() || s.gen >= Me;
  Mo.setFromAxisAngle(On, e * 0.25);
  const r = a ? or : $i,
    i = a ? 0.75 + 0.25 * Math.sin(e * 4) : 1,
    l = Le.edges.length,
    f = Math.floor(n * l);
  for (let g = f; g < l; g++) {
    const [d, p] = Le.edges[g];
    (re.copy(Le.nodes[d]).applyQuaternion(Mo).multiplyScalar(t).add(o),
      Ye.copy(Le.nodes[p]).applyQuaternion(Mo).multiplyScalar(t).add(o),
      Oe.seg(re, Ye, wt(re, 0.8), wt(Ye, 0.8), r, 0.09, 0.09));
  }
  for (let g = 0; g < f; g++) {
    const [d, p] = Le.edges[g];
    (re.copy(Le.nodes[d]).applyQuaternion(Mo).multiplyScalar(t).add(o),
      Ye.copy(Le.nodes[p]).applyQuaternion(Mo).multiplyScalar(t).add(o));
    const h = g > f - 4 ? 1.6 : 1;
    Oe.seg(re, Ye, wt(re, 1.1), wt(Ye, 1.1), r, 0.55 * i * h, 0.55 * i * h);
  }
  for (let g = 0; g < Le.N; g++)
    (re.copy(Le.nodes[g]).applyQuaternion(Mo).multiplyScalar(t).add(o),
      Oe.dot(re, 2.6, r, (g / Le.N < n ? 0.9 : 0.18) * i));
  const u = e - Kc;
  if (u >= 0 && u < 2.6) {
    const g = hr(u / 2.6),
      d = t * (1 + g * 2.2),
      p = mf.copy(o).add(Ye.set(0, g * t * 5, 0));
    for (let w = 0; w < l; w += 2) {
      const [x, y] = Le.edges[w];
      (re.copy(Le.nodes[x]).applyQuaternion(Mo).multiplyScalar(d).add(p),
        Ye.copy(Le.nodes[y]).applyQuaternion(Mo).multiplyScalar(d).add(p),
        Oe.seg(
          re,
          Ye,
          wt(re, 1.6),
          wt(Ye, 1.6),
          or,
          (1 - g) * 1.2,
          (1 - g) * 1.2,
        ));
    }
    const h = g * Math.max(U(), W()) * 1.4 + 2;
    Cn.length = 0;
    for (let w = 0; w <= 64; w++) {
      const x = (w / 64) * Math.PI * 2;
      Cn.push(
        hf[w % 128].set(
          U() / 2 + Math.cos(x) * h,
          0.25,
          -W() / 2 + Math.sin(x) * h,
        ),
      );
    }
    Oe.line(Cn, 3, or, () => (1 - g) * 0.9);
  }
  if (u >= 0 && u < 2.2)
    for (let g = 0; g < 140; g++) {
      const d = ve(g * 1.7) * Math.PI * 2,
        p = ve(g * 2.3) * 1.2 - 0.2,
        h = (3 + ve(g * 3.1) * 7) * (0.6 + t * 0.4),
        w = u;
      (re.set(
        o.x + Math.cos(d) * Math.cos(p) * h * w,
        o.y + Math.sin(p) * h * w - 4.9 * w * w * 0.6,
        o.z + Math.sin(d) * Math.cos(p) * h * w,
      ),
        Oe.dot(re, 3.2, g % 3 ? or : $i, (1 - w / 2.2) * 1.3));
    }
  zt(
    gf,
    re.copy(o).add(Ye.set(0, t * 1.25 + 0.3, 0)),
    s.gen >= Me
      ? "AGI"
      : a
        ? `${ge(s.gen + 1)} is ready`
        : Un()
          ? "AGI needs a gigawatt"
          : `Training ${ge(s.gen + 1)}`,
    s.gen >= Me
      ? ""
      : a
        ? "launch it"
        : Un()
          ? `${Math.floor((m.draw / $r) * 100)}% there`
          : `${Math.floor(n * 100)}%`,
    a ? "#ffb454" : "#7fe3ff",
    Gs && !Ve && !qe,
  );
}
let Gs = !0,
  Ri = 0,
  Pi = 0,
  bf = 0,
  wf = 0;
function xf(e, t) {
  Oe.begin();
  const o = ee[s.gen],
    n = !!(s.res.market && we.market.brand),
    a = rn.len[rn.len.length - 1],
    r = Math.round(A(8 + 9 * Math.log10(Math.max(m.D, 1)), 8, 110)),
    i = m.D > 0 ? A(1 - m.served / m.D, 0, 1) : 0,
    l = 12 + s.gen * 2.5;
  Pi += (t * l) / a;
  for (let d = 0; d < r; d++) {
    const p = (Pi + d / r + ve(d) * 0.013) % 1,
      h = p * a,
      w = pf(rn, rn.len, h, re),
      x = ve(d * 3.7 + Math.floor(Pi + d / r)) < i,
      y = uo(a - 14, a - 2, h),
      v = n && ve(d * 5.31 + 0.7) < 0.17,
      S = v ? P0 : df;
    (Oe.dot(
      w,
      v ? 5.2 : 4.6,
      x ? fl.copy(S).lerp(E0, y) : S,
      (0.7 + 0.3 * y) * (1 - uo(a - 1.2, a, h)),
    ),
      x &&
        y > 0.98 &&
        L - wf > 0.8 &&
        ((wf = L), Wc(Ye.set(X.x + 0.75, 0.75, X.z + 0.55), "429", "r")));
  }
  if (
    (X.led.material.color
      .setRGB(0.5, 1.4, 1.9)
      .multiplyScalar(
        0.6 + 0.4 * Math.sin(e * 20 * (0.3 + Math.min(1, m.served / 2e3))),
      ),
    ke.length)
  ) {
    const d = Math.round(A(4 + 6 * Math.log10(Math.max(m.served, 1)), 4, 70));
    for (let p = 0; p < d; p++) {
      const h = (e * 0.55 + p / d) % 1,
        w =
          ke[
            Math.floor(ve(p * 13.1 + Math.floor(e * 0.55 + p / d)) * ke.length)
          ],
        x = w % B,
        y = Math.floor(w / B);
      (re.set(X.x + 0.4, 0.35, X.z - 0.3),
        Ye.set(0.25, 0.3, -0.25),
        Ti.set(x + 0.5, 0.28, -(y + 0.5)));
      const v =
        h < 0.35
          ? V.lerpVectors(re, Ye, h / 0.35)
          : V.lerpVectors(Ye, Ti, (h - 0.35) / 0.65);
      Oe.dot(v, 3.6, df, 0.85 * (1 - uo(0.9, 1, h)));
    }
  }
  const f = Ai(mf);
  if (s.gen < Me && m.trainRate > 0 && ke.length && !vt()) {
    bf += t * 0.5;
    const d = m.trainRate / Math.max(m.C, 1e-9),
      p = Math.round(A(d * 40, 2, 40));
    for (let h = 0; h < p; h++) {
      const w = ke[Math.floor(ve(h * 7.7 + 3) * ke.length)],
        x = w % B,
        y = Math.floor(w / B),
        v = P[s.cells[w]];
      re.set(
        x + 0.5,
        le + (v.kind === "rack" ? (v.id === "pc" ? 1.2 : 1.7) : 1.4),
        -(y + 0.5),
      );
      const S = (bf + ve(h * 1.3)) % 1,
        F = V.lerpVectors(re, f, S);
      ((F.y += Math.sin(S * Math.PI) * 1.2),
        Oe.dot(F, 2.2, $i, 0.7 * Math.sin(S * Math.PI)));
    }
  }
  I0(e);
  for (const d of hs) {
    d.dd || (d.dd = Nl(d.pts));
    const p = d.dd[d.dd.length - 1],
      h = Math.round(A(p / 2.5, 3, 24)),
      w = A(m.draw / Math.max(m.cap, 1e-9), 0.15, 1);
    for (let x = 0; x < h; x++) {
      const y = (e * 0.45 * (0.6 + w) + x / h) % 1;
      Oe.dot(pf(d.pts, d.dd, y * p, re), 2.4, D0, 0.6 * w);
    }
  }
  let u = 0;
  for (const d of ke) {
    if (It[d] > 0.97 || u > 140) continue;
    const p = d % B,
      h = Math.floor(d / B),
      w = 1 - It[d];
    for (let x = 0; x < 2; x++) {
      const y = (e * 0.6 + ve(d + x * 0.5)) % 1;
      (re.set(
        p + 0.5 + (ve(d * 3 + x) - 0.5) * 0.6,
        le + 1.2 + y * 1.6,
        -(h + 0.5) + (ve(d * 5 + x) - 0.5) * 0.5,
      ),
        Oe.dot(re, 2.6, G0, w * Math.sin(y * Math.PI) * 0.9),
        u++);
    }
  }
  let g = 0;
  for (const d of qo) {
    if (Lo[d] < 1e-6 || g > 120) continue;
    const p = d % B,
      h = Math.floor(d / B),
      w = P[s.cells[d]],
      x = (e * 0.5 + ve(d)) % 1,
      y = ve(d * 1.7 + Math.floor(e * 0.5 + ve(d))) * Math.PI * 2,
      v = x * w.range * 0.9;
    (re.set(
      p + 0.5 + Math.cos(y) * v,
      le + 0.5 + x * 0.3,
      -(h + 0.5) + Math.sin(y) * v,
    ),
      Oe.dot(
        re,
        2.2,
        uf,
        0.55 * Math.sin(x * Math.PI) * A(Lo[d] / (w.kw * de.cool), 0.3, 1),
      ),
      g++);
  }
  {
    let d = 0;
    for (const p of s.down) {
      if (d++ > 240) break;
      const h = p.k,
        w = 0.5 + 0.5 * Math.sin(e * 7 + ve(h) * 6);
      (re.set((h % B) + 0.5, le + 1.7, -(Math.floor(h / B) + 0.5)),
        Oe.dot(re, 5.2, B0, 0.35 + 0.75 * w));
    }
  }
  for (const d of tr) {
    const p = L - d.t;
    if (p > 0.9 || p < 0) continue;
    const h = hr(p / 0.9),
      w = d.k % B,
      x = Math.floor(d.k / B),
      y = 0.32 + h * 0.5;
    Cn.length = 0;
    for (let v = 0; v <= 28; v++) {
      const S = (v / 28) * Math.PI * 2;
      Cn.push(
        hf[v].set(
          w + 0.5 + Math.cos(S) * y,
          le + 0.04,
          -(x + 0.5) + Math.sin(S) * y,
        ),
      );
    }
    Oe.line(Cn, 2.4, uf, () => (1 - h) * 1.4);
  }
  if ((Oe.end(), ke.length && m.rev > 0 && e - Ri > 0.42 && !document.hidden)) {
    const d = m.rev * (e - Ri);
    Ri = e;
    const p = ke[Math.floor(Be() * ke.length)];
    (It[p] > 0.5 && !Ro() && vn(p, "+" + $(d)),
      Be() < 0.25 && !Ro() && R.coin(1));
  }
}
let $n = !1,
  Ei = { key: "", k: -1 };
const vf = new c.Color(0.25, 0.95, 0.6),
  Di = new c.Color(1.1, 0.25, 0.3),
  Gi = new c.Color(1, 0.62, 0.18),
  nr = new c.Color(0.35, 0.85, 1.1),
  O0 = new c.Color(1, 1, 1);
function F0(e) {
  Tu();
  const t = $e ? K[$e] : null;
  if ($n || t) {
    for (const n of ke) {
      const a = It[n];
      pn(
        n % B,
        Math.floor(n / B),
        a > 0.98 ? vf : fl.copy(Di).lerp(Gi, a),
        a > 0.98 ? 0.28 : 0.75,
      );
    }
    for (const n of qo) {
      const a = P[s.cells[n]];
      pn(
        n % B,
        Math.floor(n / B),
        nr,
        0.2 + 0.5 * A(Lo[n] / (a.kw * de.cool), 0, 1),
      );
    }
  }
  for (const n of s.sites)
    n.tr &&
      pn(n.k % B, Math.floor(n.k / B), Gi, 0.3 + 0.12 * Math.sin(e * 4 + n.k));
  const o = t || (s.tut < 2 ? K.pc : null);
  if (o && !ye) {
    const n =
      o.id +
      "|" +
      m.racks +
      "|" +
      m.coolers +
      "|" +
      s.lvl +
      "|" +
      s.gen +
      "|" +
      s.sites.length;
    Ei.key !== n && (Ei = { key: n, k: hc(o) });
    const a = Ei.k;
    a >= 0 &&
      (s.tut < 2 || m.racks < 8 || t) &&
      pn(a % B, Math.floor(a / B), O0, 0.35 + 0.3 * Math.sin(e * 5));
  }
  if (t && t.kind === "cool" && ht >= 0 && !ye) {
    const n = ht % B,
      a = Math.floor(ht / B);
    for (let r = -t.range; r <= t.range; r++)
      for (let i = -t.range; i <= t.range; i++) {
        if (!i && !r) continue;
        const l = n + i,
          f = a + r;
        l >= 0 && f >= 0 && l < U() && f < W() && pn(l, f, nr, 0.32);
      }
  }
  if (ye && t) {
    let n = 0;
    const a = Math.min(ye.i0, ye.i1),
      r = Math.max(ye.i0, ye.i1),
      i = Math.min(ye.j0, ye.j1),
      l = Math.max(ye.j0, ye.j1);
    for (let f = i; f <= l; f++)
      for (let u = a; u <= r; u++) {
        const g = Uo(t, Z(u, f));
        g != null && ((n += g), pn(u, f, n <= s.cash ? nr : Di, 0.75));
      }
    vo &&
      Vo(
        vo.clientX,
        vo.clientY,
        `<b>${t.name}</b> \xD7 ${(r - a + 1) * (l - i + 1)} \xB7 ${$(n)}` +
          (n > s.cash ? ' \xB7 <span class="r">more than you have</span>' : ""),
      );
  }
  Au();
  for (const n in Oo) Oo[n].visible = !1;
  if (t && ht >= 0 && !ye && Uo(t, ht) != null) {
    const n = Lu(t.id),
      a = ht % B,
      r = Math.floor(ht / B);
    if (
      (n.position.set(a + 0.5, le, -(r + 0.5)),
      (n.visible = !0),
      t.kind === "rack")
    ) {
      const i = ws(t, ht);
      Sa.color.copy(i.f > 0.98 ? vf : i.wrong ? Di : Gi);
    } else Sa.color.copy(nr);
    Sa.opacity = 0.32 + 0.08 * Math.sin(e * 6);
  }
}
const R = (() => {
  let e = null,
    t = null,
    o = null,
    n = null,
    a = !0,
    r = {},
    i = null,
    l = !1;
  try {
    const x = localStorage.getItem("gigawatt-sound");
    ((a = x !== "0"), (l = x != null));
  } catch {}
  const f = () => i ?? e.currentTime;
  function u(x) {
    if (e) return;
    try {
      e = x || new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return;
    }
    ((t = e.createGain()),
      (t.gain.value = x ? g : 0),
      t.connect(e.destination));
    const y = e.createBuffer(1, e.sampleRate * 2, e.sampleRate),
      v = y.getChannelData(0);
    let S = 0;
    for (let H = 0; H < v.length; H++)
      ((S = (S + 0.02 * (Math.random() * 2 - 1)) / 1.02), (v[H] = S * 3.2));
    const F = e.createBufferSource();
    ((F.buffer = y),
      (F.loop = !0),
      (n = e.createBiquadFilter()),
      (n.type = "lowpass"),
      (n.frequency.value = 380),
      (o = e.createGain()),
      (o.gain.value = 0),
      F.connect(n).connect(o).connect(t),
      F.start(0));
    const I = e.createOscillator();
    ((I.type = "sine"), (I.frequency.value = 58));
    const q = e.createGain();
    ((q.gain.value = 0.12), I.connect(q).connect(o), I.start(0));
  }
  const g = 0.55;
  function d(x, y) {
    if (!t || i != null) return;
    const v = e.currentTime;
    (t.gain.cancelScheduledValues(v),
      t.gain.setValueAtTime(t.gain.value, v),
      t.gain.linearRampToValueAtTime(x, v + y));
  }
  const p = (x, y) => {
    if (!a || !e) return !1;
    const v = f();
    return r[x] != null && v - r[x] < y ? !1 : ((r[x] = v), !0);
  };
  function h(x, y, v = "sine", S = 0.18, F = 1, I = 0) {
    const q = f() + I,
      H = e.createOscillator(),
      T = e.createGain();
    ((H.type = v),
      H.frequency.setValueAtTime(x, q),
      H.frequency.exponentialRampToValueAtTime(Math.max(20, x * F), q + y),
      T.gain.setValueAtTime(0, q),
      T.gain.linearRampToValueAtTime(S, q + 0.008),
      T.gain.exponentialRampToValueAtTime(8e-4, q + y),
      H.connect(T).connect(t),
      H.start(q),
      H.stop(q + y + 0.05));
  }
  function w(x = 0.3, y = 140) {
    const v = f(),
      S = e.createOscillator(),
      F = e.createGain();
    (S.frequency.setValueAtTime(y, v),
      S.frequency.exponentialRampToValueAtTime(45, v + 0.18),
      F.gain.setValueAtTime(x, v),
      F.gain.exponentialRampToValueAtTime(0.001, v + 0.22),
      S.connect(F).connect(t),
      S.start(v),
      S.stop(v + 0.25));
  }
  return {
    get on() {
      return a;
    },
    wake() {
      if (i != null || !a) return;
      const x = !e;
      if ((u(), e?.state === "suspended" && e.resume(), x && (d(g, 5), !l))) {
        l = !0;
        try {
          localStorage.setItem("gigawatt-sound", "1");
        } catch {}
        _0();
      }
    },
    toggle() {
      ((a = !a), (l = !0));
      try {
        localStorage.setItem("gigawatt-sound", a ? "1" : "0");
      } catch {}
      return (
        a
          ? (u(), e?.resume(), d(g, 1.5), h(660, 0.12, "sine", 0.12))
          : d(0, 0.2),
        a
      );
    },
    place(x, y = 1) {
      p("place", 0.05) &&
        (w(0.32, x === "rack" ? 150 : 110),
        h(x === "rack" ? 880 : 620, 0.09, "triangle", 0.07, 1.3),
        y > 1 && h(1100, 0.16, "sine", 0.05, 1.5, 0.06));
    },
    sell() {
      p("sell", 0.05) && h(500, 0.14, "triangle", 0.1, 0.6);
    },
    no() {
      p("no", 0.15) && h(180, 0.16, "square", 0.05, 0.8);
    },
    tick() {
      p("tick", 0.03) && h(1800, 0.025, "sine", 0.04);
    },
    coin(x = 1) {
      if (p("coin", 0.09))
        for (let y = 0; y < x; y++)
          h(1320 * (1 + y * 0.26), 0.11, "sine", 0.05, 1.02, y * 0.05);
    },
    chime() {
      p("chime", 0.3) &&
        [784, 988, 1175].forEach((x, y) =>
          h(x, 0.5, "sine", 0.07, 1, y * 0.07),
        );
    },
    big() {
      p("big", 0.2) &&
        (w(0.36, 120),
        [523, 659, 784].forEach((x, y) =>
          h(x, 0.35, "triangle", 0.07, 1, y * 0.05),
        ));
    },
    down() {
      p("down", 0.8) &&
        (h(220, 0.12, "square", 0.03, 0.7),
        h(165, 0.2, "square", 0.028, 0.8, 0.13));
    },
    fix() {
      p("fix", 0.08) &&
        (h(1500, 0.04, "square", 0.03, 0.7),
        h(1900, 0.06, "triangle", 0.04, 1.05, 0.05));
    },
    built() {
      p("built", 0.12) &&
        (h(392, 0.16, "triangle", 0.06, 2, 0),
        h(988, 0.24, "sine", 0.05, 1.12, 0.09));
    },
    launch() {
      p("launch", 0.5) &&
        (w(0.45, 90),
        [392, 523, 659, 784, 1047].forEach((x, y) =>
          h(x, 0.9, "sine", 0.08, 1, y * 0.09),
        ),
        h(200, 1.4, "sawtooth", 0.03, 4));
    },
    hum(x) {
      !a ||
        !e ||
        !o ||
        (o.gain.setTargetAtTime(0.04 + 0.14 * x, f(), 0.4),
        n.frequency.setTargetAtTime(240 + 600 * x, f(), 0.4));
    },
    film(x) {
      ((a = !0),
        (i = 0),
        (e = null),
        (r = {}),
        u(new OfflineAudioContext(2, Math.ceil(48e3 * x), 48e3)));
    },
    filmT(x) {
      i = x;
    },
    async render() {
      const x = await e.startRendering(),
        y = x.length,
        v = x.numberOfChannels,
        S = new DataView(new ArrayBuffer(44 + y * v * 2)),
        F = (E, j) => {
          for (let ie = 0; ie < j.length; ie++)
            S.setUint8(E + ie, j.charCodeAt(ie));
        };
      (F(0, "RIFF"),
        S.setUint32(4, 36 + y * v * 2, !0),
        F(8, "WAVE"),
        F(12, "fmt "),
        S.setUint32(16, 16, !0),
        S.setUint16(20, 1, !0),
        S.setUint16(22, v, !0),
        S.setUint32(24, x.sampleRate, !0),
        S.setUint32(28, x.sampleRate * v * 2, !0),
        S.setUint16(32, v * 2, !0),
        S.setUint16(34, 16, !0),
        F(36, "data"),
        S.setUint32(40, y * v * 2, !0));
      const I = [...Array(v)].map((E, j) => x.getChannelData(j));
      let q = 44;
      for (let E = 0; E < y; E++)
        for (let j = 0; j < v; j++)
          (S.setInt16(q, A(I[j][E], -1, 1) * 32767, !0), (q += 2));
      const H = new Uint8Array(S.buffer);
      let T = "";
      for (let E = 0; E < H.length; E += 32768)
        T += String.fromCharCode.apply(null, H.subarray(E, E + 32768));
      return btoa(T);
    },
  };
})();
function Bi() {
  const e = b("#sound");
  (e.classList.toggle("on", R.on),
    e.setAttribute("aria-pressed", R.on),
    (b("#snd-w").style.display = R.on ? "" : "none"),
    (b("#snd-x").style.display = R.on ? "none" : ""));
}
((b("#sound").onclick = () => {
  (R.toggle(), Bi());
}),
  Bi(),
  addEventListener("pointerdown", () => R.wake(), !0),
  addEventListener(
    "keydown",
    (e) => {
      e.key.toLowerCase() !== "m" && R.wake();
    },
    !0,
  ));
function _0() {
  const e = b("#sound"),
    t = e.getBoundingClientRect(),
    o = document.createElement("div");
  ((o.id = "snd-hello"),
    (o.innerHTML = "Sound is on \xB7 <b>M</b> mutes it"),
    (o.style.top = t.bottom + 8 + "px"),
    (o.style.right = innerWidth - t.right + "px"),
    document.body.appendChild(o),
    e.classList.add("hello"),
    setTimeout(() => o.classList.add("on"), 30),
    setTimeout(() => {
      (o.classList.remove("on"),
        e.classList.remove("hello"),
        setTimeout(() => o.remove(), 500));
    }, 6500));
}
let sr = -99,
  ar = -1,
  et = null;
function yf() {
  const e = U(),
    t = W(),
    o = Math.max(e, t),
    n = Ai(new c.Vector3()),
    a = ke.length ? ke[Math.floor(ke.length * 0.5)] : Z(1, 1),
    r = a % B,
    i = Math.floor(a / B);
  return [
    {
      t: [e / 2, 0.4, -t / 2],
      yaw: ae.yaw,
      pitch: ae.pitch,
      dist: k.fitGoal,
      dy: 0.012,
      hold: 9,
    },
    {
      t: [r + 0.5, 1, -(i + 0.5)],
      yaw: ae.yaw + 0.9,
      pitch: 0.32,
      dist: 4.5 + o * 0.12,
      dy: -0.02,
      hold: 7,
      r: 0.35,
    },
    {
      t: [e / 2, 0, -t / 2],
      yaw: ae.yaw + 0.25,
      pitch: 1.36,
      dist: k.fitGoal * 1.05,
      dy: 0.006,
      hold: 7,
    },
    {
      t: [n.x, n.y - 0.5, n.z],
      yaw: ae.yaw - 0.5,
      pitch: 0.42,
      dist: Li() * 5 + 4,
      dy: 0.03,
      hold: 7,
      r: 0.5,
    },
    {
      t: [e + 8, 1, -t / 2 - 4],
      yaw: ae.yaw + 1.4,
      pitch: 0.5,
      dist: o * 0.9 + 14,
      dy: -0.012,
      hold: 7,
    },
    {
      t: [e / 2, 1.5, 2],
      yaw: ae.yaw * 0.4,
      pitch: 0.22,
      dist: o * 0.6 + 9,
      dy: 0.01,
      hold: 8,
    },
  ];
}
function U0(e, t) {
  const o = yf();
  ((ar = e % o.length),
    (et = o[ar]),
    (sr = t),
    k.t.set(...et.t),
    k.tGoal.copy(k.t),
    (k.yaw = et.yaw),
    (k.pitch = et.pitch),
    (k.fit = et.dist),
    (k.fitGoal = et.dist),
    (ze = 1));
}
function V0(e) {
  if (
    ((!et || e - sr > et.hold) &&
      (U0(ar + 1, e), (b("#veil").style.opacity = 0.6)),
    (b("#veil").style.opacity = Math.max(0, 0.6 - (e - sr) * 2.4).toFixed(2)),
    Qe)
  )
    return;
  const t = e - sr;
  ((k.yaw = et.yaw + t * et.dy),
    (k.fit = k.fitGoal = et.dist * (1 - t * 0.006)));
}
function Tn(e) {
  ((Ve = e),
    e
      ? ((et = null), (ar = -1), (Qe = !1), Wt(null), Je(-1))
      : (b("#veil").style.opacity = 0),
    Is());
}
function kf() {
  Ve ? Ra() : Tn(!0);
}
const Mf = () =>
  s.done
    ? "Reached AGI"
    : m.draw < 5
      ? "Garage tinkerer"
      : m.draw < 100
        ? "Basement startup"
        : m.draw < 2e3
          ? "Seed-stage lab"
          : m.draw < 2e4
            ? "Scale-up"
            : m.draw < 2e5
              ? "Frontier lab"
              : m.draw < 1e6
                ? "Hyperscaler"
                : "Gigawatt club";
function j0() {
  const e = {
      t: k.t.clone(),
      tg: k.tGoal.clone(),
      yaw: k.yaw,
      pitch: k.pitch,
      fit: k.fit,
      fg: k.fitGoal,
      zoom: ze,
      intro: Ce,
    },
    t = We.visible,
    o = [gf, zo, Ja];
  ((Ce = null),
    bn(!1),
    k.t.copy(k.tGoal),
    (k.yaw = ae.yaw),
    (k.pitch = ae.pitch),
    (k.fit = k.fitGoal),
    (ze = 1),
    (We.visible = !1));
  for (const a of Object.values(Oo)) a.visible = !1;
  (ni(L, 0),
    O.updateMatrixWorld(),
    (Y.shadowMap.needsUpdate = !0),
    xf(L, 0),
    nl(),
    ot.render());
  const n = document.createElement("canvas");
  return (
    (n.width = Y.domElement.width),
    (n.height = Y.domElement.height),
    n.getContext("2d").drawImage(Y.domElement, 0, 0),
    k.t.copy(e.t),
    k.tGoal.copy(e.tg),
    (k.yaw = e.yaw),
    (k.pitch = e.pitch),
    (k.fit = e.fit),
    (k.fitGoal = e.fg),
    (ze = e.zoom),
    (Ce = e.intro),
    (We.visible = t),
    ni(L, 0),
    O.updateMatrixWorld(),
    n
  );
}
const N0 = (e, t) =>
  new Promise((o) => {
    const n = new Image();
    ((n.onload = () => o(n)),
      (n.onerror = () => o(null)),
      (n.src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" fill="none" stroke="${t}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${za[e]}</svg>`,
        )));
  });
async function H0() {
  const e = j0(),
    t = document.createElement("canvas");
  ((t.width = 1200), (t.height = 630));
  const o = t.getContext("2d"),
    n = ee[s.gen];
  ((o.fillStyle = "#0b0f1a"), o.fillRect(0, 0, 1200, 630));
  const a = Math.max(1200 / e.width, 630 / e.height) * 1.1,
    r = e.width * a,
    i = e.height * a;
  o.drawImage(
    e,
    0,
    0,
    e.width,
    e.height,
    1200 * 0.67 - r / 2,
    630 * 0.5 - i * 0.5,
    r,
    i,
  );
  let l = o.createLinearGradient(0, 0, 760, 0);
  (l.addColorStop(0, "rgba(7,10,19,.97)"),
    l.addColorStop(0.6, "rgba(7,10,19,.78)"),
    l.addColorStop(1, "rgba(7,10,19,0)"),
    (o.fillStyle = l),
    o.fillRect(0, 0, 860, 630),
    (l = o.createLinearGradient(0, 500, 0, 630)),
    l.addColorStop(0, "rgba(7,10,19,0)"),
    l.addColorStop(1, "rgba(7,10,19,.88)"),
    (o.fillStyle = l),
    o.fillRect(0, 500, 1200, 130),
    (o.textBaseline = "alphabetic"),
    (o.textAlign = "left"),
    (o.fillStyle = "#7fe3ff"),
    (o.font = "600 19px DM Mono, monospace"),
    (o.letterSpacing = "4px"),
    o.fillText("GARAGE TO GIGAWATT", 50, 62),
    (o.letterSpacing = "0px"),
    (o.fillStyle = "#ffffff"),
    (o.font = "800 52px Outfit, sans-serif"),
    o.fillText(s.lab, 50, 118, 640));
  const f = Mf().toUpperCase();
  ((o.font = "700 17px DM Mono, monospace"), (o.letterSpacing = "2px"));
  const u = o.measureText(f).width + 30;
  ((o.fillStyle = "#ffb454"),
    en(o, 50, 138, u, 34, 10),
    o.fill(),
    (o.fillStyle = "#1b1206"),
    o.fillText(f, 65, 161),
    (o.letterSpacing = "0px"),
    (o.fillStyle = "#c9d1e4"),
    (o.font = "500 21px Outfit, sans-serif"),
    o.fillText(
      s.done
        ? `AGI in ${yo(s.agiAt || s.played)}`
        : `Shipping ${ge(s.gen)} \xB7 ${n.cls} class`,
      50 + u + 16,
      162,
      600 - u,
    ),
    [
      ["POWER", N(m.draw)],
      ["GPUS", m.gpus.toLocaleString("en-US")],
      ["TOKENS/S", Te(m.served)],
      ["EARNING", $(m.rev) + "/s"],
      ["EARNED", $(s.earned)],
      ["PLAYED", yo(s.played)],
    ].forEach(([h, w], x) => {
      const y = 50 + (x % 3) * 206,
        v = 196 + Math.floor(x / 3) * 98;
      ((o.fillStyle = "rgba(255,255,255,.075)"),
        en(o, y, v, 194, 86, 15),
        o.fill(),
        (o.fillStyle = "#8d97b3"),
        (o.font = "500 14px DM Mono, monospace"),
        (o.letterSpacing = "2.5px"),
        o.fillText(h, y + 16, v + 30),
        (o.letterSpacing = "0px"),
        (o.fillStyle = "#ffffff"),
        (o.font = "500 30px DM Mono, monospace"),
        o.fillText(w, y + 16, v + 68, 166));
    }),
    (o.fillStyle = "#8d97b3"),
    (o.font = "500 14px DM Mono, monospace"),
    (o.letterSpacing = "2.5px"),
    o.fillText("ROAD TO AGI", 50, 424),
    (o.letterSpacing = "0px"));
  for (let h = 0; h < ee.length; h++) {
    const w = 58 + h * 38,
      x = 446,
      y = h <= s.gen;
    (o.beginPath(),
      o.arc(w, x, h === ee.length - 1 ? 11 : 9, 0, 7),
      y
        ? ((o.fillStyle = h === ee.length - 1 ? "#ffb454" : "#7fe3ff"),
          o.fill())
        : ((o.strokeStyle = "#ffffff40"), (o.lineWidth = 2.5), o.stroke()),
      h < ee.length - 1 &&
        ((o.fillStyle = h < s.gen ? "#7fe3ff88" : "#ffffff22"),
        o.fillRect(w + 11, x - 1.5, 16, 3)));
  }
  ((o.fillStyle = "#c9d1e4"),
    (o.font = "500 17px Outfit, sans-serif"),
    o.fillText(
      s.done ? "Done" : `Model ${s.gen + 1} of ${ee.length}`,
      58 + ee.length * 38,
      452,
    ));
  const d = Wo.filter((h) => s.miles[h.id])
    .sort((h, w) => (s.miles[w.id] || 0) - (s.miles[h.id] || 0))
    .slice(0, 6);
  ((o.fillStyle = "#8d97b3"),
    (o.font = "500 14px DM Mono, monospace"),
    (o.letterSpacing = "2.5px"),
    o.fillText(`MILESTONES ${mi()} OF ${Wo.length}`, 50, 500),
    (o.letterSpacing = "0px"));
  const p = await Promise.all(d.map((h) => N0(h.ic, "#1b1206")));
  return (
    d.forEach((h, w) => {
      const x = 50 + w * 50,
        y = 514,
        v = o.createLinearGradient(x, y, x + 40, y + 40);
      (v.addColorStop(0, "#ffc067"),
        v.addColorStop(1, "#e07a2a"),
        (o.fillStyle = v),
        en(o, x, y, 40, 40, 11),
        o.fill(),
        p[w] && o.drawImage(p[w], x + 9, y + 9, 22, 22));
    }),
    (o.fillStyle = "#c9d1e4"),
    (o.font = "500 20px Outfit, sans-serif"),
    (o.textAlign = "right"),
    o.fillText("Start in a garage. Build yours at", 1150, 566),
    (o.fillStyle = "#7fe3ff"),
    (o.font = "600 22px DM Mono, monospace"),
    o.fillText("sael.net/gigawatt", 1150, 596),
    (o.textAlign = "left"),
    t
  );
}
let An = null;
function Sf() {
  return s.done
    ? `${s.lab} went from one gaming PC in a garage to AGI in ${yo(s.agiAt)}, on ${N(m.draw)} and ${m.gpus.toLocaleString("en-US")} GPUs. Beat it:`
    : `My AI lab, ${s.lab}, is a ${Mf().toLowerCase()} now: ${N(m.draw)}, ${m.gpus.toLocaleString("en-US")} GPUs, ${Te(m.served)} tokens a second, and ${ge(s.gen)} just shipped. It started as one PC in a garage. Can you get to a gigawatt?`;
}
async function Bs() {
  ((b("#share-note").textContent = ""),
    b("#share-img").removeAttribute("src"),
    b("#d-share").showModal(),
    R.tick());
  const e = await H0();
  ((b("#share-img").src = e.toDataURL("image/png")),
    (An = null),
    e.toBlob((t) => {
      An = t;
    }, "image/png"));
}
const Cf = "https://sael.net/gigawatt/";
async function $f() {
  try {
    return An
      ? (await navigator.clipboard.write([
          new ClipboardItem({ "image/png": An }),
        ]),
        !0)
      : !1;
  } catch {
    return !1;
  }
}
((b("#sh-x").onclick = async () => {
  s.stats.shares++;
  const e = An && new File([An], "gigawatt.png", { type: "image/png" });
  if (
    e &&
    navigator.canShare?.({ files: [e] }) &&
    matchMedia("(pointer:coarse)").matches
  )
    try {
      await navigator.share({ files: [e], text: Sf(), url: Cf });
      return;
    } catch {}
  const t = await $f();
  (window.open(
    "https://x.com/intent/post?text=" +
      encodeURIComponent(Sf()) +
      "&url=" +
      encodeURIComponent(Cf),
    "_blank",
    "noopener",
  ),
    (b("#share-note").textContent = t
      ? "The picture is on your clipboard: paste it into the post."
      : "Download the picture to attach it to the post."));
}),
  (b("#sh-dl").onclick = () => {
    s.stats.shares++;
    const e = document.createElement("a");
    ((e.href = b("#share-img").src),
      (e.download = `${s.lab.replace(/\W+/g, "-").toLowerCase()}-gigawatt.png`),
      e.click());
  }),
  (b("#sh-copy").onclick = async () => {
    (s.stats.shares++,
      (b("#share-note").textContent = (await $f())
        ? "Copied."
        : "Your browser would not copy the picture: download it instead."));
  }),
  (b("#brag").onclick = () => Bs()),
  (b("#agi-share").onclick = () => {
    (b("#d-agi").close(), Bs());
  }),
  (b("#agi-new").onclick = () => {
    (b("#d-agi").close(), r0());
  }),
  document
    .querySelectorAll("dialog [data-close]")
    .forEach((e) => (e.onclick = () => e.closest("dialog").close())),
  document.querySelectorAll("dialog").forEach((e) =>
    e.addEventListener("click", (t) => {
      t.target === e && e.close();
    }),
  ),
  (b("#labname").onclick = () => {
    ((b("#lab-input").value = s.lab),
      b("#d-name").showModal(),
      setTimeout(() => b("#lab-input").select(), 30));
  }));
const Tf = (e) => {
  ((e = String(e || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24)),
    e &&
      ((s.lab = e), (s.named = !0), De(), Ha(!0), os(), b("#d-name").close()));
};
((b("#name-ok").onclick = () => Tf(b("#lab-input").value)),
  b("#lab-input").addEventListener("keydown", (e) => {
    e.key === "Enter" && Tf(e.target.value);
  }),
  (b("#name-rnd").onclick = () => {
    b("#lab-input").value = sa[Math.floor(Be() * sa.length)];
  }),
  (b("#how").onclick = () => b("#d-help").showModal()),
  (b("#reset-open").onclick = () => {
    (b("#d-help").close(), b("#d-reset").showModal());
  }),
  (b("#reset-yes").onclick = () => {
    try {
      localStorage.removeItem(Rr);
    } catch {}
    (b("#d-reset").close(),
      (s = po()),
      aa(),
      Rn(),
      Ra(),
      be("A fresh garage", "One PC, one fan, sixty dollars.", "c", null, {
        icon: "garage",
        kick: "Start over",
      }));
  }),
  (b("#launch").onclick = () => As()));
function Is() {
  const e = b("#gfx");
  if (!e) return;
  e.querySelectorAll("[data-tod]").forEach((o) => {
    const n = o.dataset.tod === D.mode;
    (o.classList.toggle("on", n), o.setAttribute("aria-pressed", n));
  });
  const t = b("#tod-now");
  (t && (t.textContent = Ef(D.th)),
    e.querySelectorAll("[data-q]").forEach((o) => {
      const n = o.dataset.q === Ke;
      (o.classList.toggle("on", n), o.setAttribute("aria-pressed", n));
    }),
    (b("#gfx-note").textContent = K0[Ke]));
  for (const [o, n] of [
    ["g-cine", Ve],
    ["g-map", $n],
  ]) {
    const a = b("#" + o);
    (a.classList.toggle("on", n), a.setAttribute("aria-pressed", n));
  }
}
function Ii(e) {
  const t = b("#gfx"),
    o = b("#gear");
  ((t.hidden = !e),
    b(".ctl").classList.toggle("gfx-on", e),
    o.classList.toggle("on", e),
    o.setAttribute("aria-expanded", e),
    e &&
      (Is(),
      (b("#gfx-fps").textContent = Yo > 2 ? Math.round(Af) + " fps" : "")));
}
if (
  ((b("#gear").onclick = () => {
    (Ii(b("#gfx").hidden), R.tick());
  }),
  b("#gfx")
    .querySelectorAll("[data-q]")
    .forEach(
      (e) =>
        (e.onclick = () => {
          (_i(e.dataset.q), R.tick());
        }),
    ),
  b("#gfx")
    .querySelectorAll("[data-tod]")
    .forEach(
      (e) =>
        (e.onclick = () => {
          D.mode = e.dataset.tod;
          try {
            localStorage.setItem(pr + "-tod", D.mode);
          } catch {}
          (Is(), R.tick());
        }),
    ),
  (b("#g-cine").onclick = () => {
    (kf(), R.tick());
  }),
  (b("#g-map").onclick = () => {
    (_c(!$n), R.tick());
  }),
  Lt.forEach((e) => e.addEventListener("click", () => Ii(!1))),
  we.presented)
) {
  const e = b("#presented");
  ((e.innerHTML = `Presented by <a href="${we.presented.url}" target="_blank" rel="noopener">${we.presented.name}</a>`),
    e.classList.add("on"));
}
const So = [
  ["pixelRatio", "Pixel ratio", 1, 2, 0.05, (e) => e.toFixed(2)],
  ["msaa", "MSAA", 0, 4, 2, (e) => (e ? e + "\xD7" : "off")],
  ["smaa", "SMAA", 0, 1, 1, (e) => (e ? "on" : "off")],
  ["exposure", "Exposure", 0.6, 1.8, 0.02, (e) => e.toFixed(2)],
  ["fov", "Field of view", 18, 55, 1, (e) => e + "\xB0"],
  ["sun", "Key light", 0, 3, 0.05, (e) => e.toFixed(2)],
  ["fill", "Fill light", 0, 2, 0.05, (e) => e.toFixed(2)],
  ["rim", "Rim light", 0, 3, 0.05, (e) => e.toFixed(2)],
  ["fog", "Haze", 0, 3, 0.05, (e) => e.toFixed(2)],
  ["sat", "Saturation", 0.6, 1.8, 0.02, (e) => e.toFixed(2)],
  ["env", "Environment", 0, 2, 0.05, (e) => e.toFixed(2)],
  ["reflect", "Floor mirror", 0, 2, 0.05, (e) => e.toFixed(2)],
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
let qt = 0,
  Af = 0,
  rr = 0,
  Yo = 0,
  Os = 0;
function W0() {
  ((Qt.radius = M.bloomRadius),
    (Ys.uReflStrength.value = 0.55 * M.reflect),
    (Zi.value = M.sat),
    Df());
}
const z0 = 360,
  Fs = 0.86,
  q0 = 0.5,
  Lf = 1.08,
  Oi = Zo.clone(),
  Rf = new c.Vector3(Zo.x, 0, Zo.z)
    .normalize()
    .multiplyScalar(Math.cos(Lf))
    .setY(Math.sin(Lf)),
  xe = {
    bg: new c.Color("#121a2c"),
    bgD: new c.Color("#a9c9e3"),
    fog: new c.Color("#26304a"),
    fogD: new c.Color("#c3d6e6"),
    hs: new c.Color(9414360),
    hsD: new c.Color("#d6e8f7"),
    hg: new c.Color(3155999),
    hgD: new c.Color("#7a7462"),
    sun: new c.Color(16761994),
    sunD: new c.Color("#fff2e0"),
    sunW: new c.Color("#ffb070"),
    asph: new c.Color("#26292f"),
    asphD: new c.Color("#70747b"),
    rock: [new c.Color("#5d5a72"), new c.Color("#4b4a60")],
    rockD: [new c.Color("#a7b6c6"), new c.Color("#93a6b9")],
    win: new c.Color(1.55, 1.18, 0.72),
    winD: new c.Color(0.33, 0.42, 0.52),
    city: new c.Color(1.9, 1.8, 1.7),
    cityD: new c.Color(0.62, 0.68, 0.78),
    lampD: new c.Color("#cfcac0").multiplyScalar(0.85),
    gnd: new c.Color(1, 1, 1),
    gndD: new c.Color(3.7, 3.8, 3.2),
  },
  Pf = new c.Color(),
  ir = new c.Vector3(),
  Ef = (e) =>
    e < Math.PI
      ? e < 0.3
        ? "Sunrise"
        : e < 1.15
          ? "Morning"
          : e < 2
            ? "Midday"
            : e < 2.85
              ? "Afternoon"
              : "Sunset"
      : e < Math.PI * 1.2
        ? "Dusk"
        : e < Math.PI * 1.8
          ? "Night"
          : "Dawn";
function Df() {
  const e = D.d,
    t = (o, n) => o + (n - o) * e;
  ((Y.toneMappingExposure = M.exposure * t(1, 0.8)),
    (Pe.environmentIntensity = M.env * t(0.45, 0.55)),
    (Qt.threshold = M.bloomThreshold * t(1, 1.6)),
    (Qt.strength = 0.5 * M.bloomStrength * t(1, 0.55)),
    (Ns.intensity = 0.55 * M.fill * t(1, 2.1)),
    (mr.intensity = 0.42 * M.fill * t(1, 0.6)),
    (me.intensity = 1.9 * M.sun * t(1, 1.8)),
    (gr.intensity = 0.75 * M.rim * t(1, 0.15)),
    Ns.color.copy(xe.hs).lerp(xe.hsD, e),
    Ns.groundColor.copy(xe.hg).lerp(xe.hgD, e),
    Pf.copy(xe.sunD).lerp(xe.sunW, D.warm),
    me.color.copy(xe.sun).lerp(Pf, e),
    Pe.background.copy(xe.bg).lerp(xe.bgD, e),
    Pe.fog.color.copy(xe.fog).lerp(xe.fogD, e),
    (D.fogK = t(1, 0.7)),
    (D.outL = 1 - e),
    (D.inL = t(1, 0.55)),
    Ie.ground?.color.copy(xe.gnd).lerp(xe.gndD, e),
    Ie.asph?.color.copy(xe.asph).lerp(xe.asphD, e),
    Ie.rock?.forEach((o, n) => o.color.copy(xe.rock[n]).lerp(xe.rockD[n], e)),
    Ie.win?.color.copy(xe.win).lerp(xe.winD, e),
    Ie.city?.color.copy(xe.city).lerp(xe.cityD, e),
    Ie.cityGlow && (Ie.cityGlow.opacity = 0.16 * (1 - e)));
  for (const [o, n] of Ie.lamps) o.color.copy(n).lerp(xe.lampD, e);
  for (const [o, n, a] of Ie.tint) o.color.copy(n).lerp(a, e);
  ((jn.uDay.value = e), (jn.uWarm.value = D.warm));
}
function Y0(e, t) {
  D.t0 === null && (D.t0 = e);
  let o;
  if (D.mode === "pin") o = D.pin;
  else if (D.mode === "day") o = 0.95;
  else if (D.mode === "night") o = Math.PI + 0.06;
  else {
    const f = ((((q0 / Math.PI) * Fs + (e - D.t0) / z0) % 1) + 1) % 1;
    o = f < Fs ? (Math.PI * f) / Fs : Math.PI * (1 + (f - Fs) / (1 - Fs));
  }
  const n = Math.PI * 2,
    a = (((o - D.th) % n) + n) % n;
  ((D.th =
    !D.first || t > 1 || a < 5e-4 || a > n - 5e-4
      ? o
      : (D.th + a * Math.min(1, t * 3)) % n),
    (D.first = 1));
  const r = D.th,
    i = Math.sin(r),
    l = r < Math.PI;
  if (
    ((D.d = l ? uo(0, 0.22, i) : 0),
    (D.warm = l ? uo(0, 0.06, i) * (1 - uo(0.16, 0.5, i)) : 0),
    Zo.copy(Oi).lerp(Rf, D.d).normalize(),
    me.position.copy(Zo).multiplyScalar(D.sunR).add(me.target.position),
    ir.set(Oi.x, 0.08, Oi.z).normalize().lerp(Rf, D.d).normalize(),
    jn.uSun.value.copy(ir),
    (me.shadow.radius = 2 + 1.5 * D.d),
    (me.shadow.intensity = 1 - 0.28 * D.d),
    Df(),
    (Math.abs(D.d - D.envD) > 0.05 ||
      Math.abs(D.warm - D.envW) > 0.08 ||
      ir.dot(Jo.uSun.value) < 0.9945) &&
      ((D.envD = D.d),
      (D.envW = D.warm),
      (Jo.uDay.value = D.d),
      (Jo.uWarm.value = D.warm),
      Jo.uSun.value.copy(ir),
      tl()),
    e - D.wordAt > 1 && !b("#gfx").hidden)
  ) {
    D.wordAt = e;
    const f = b("#tod-now");
    f && (f.textContent = Ef(r));
  }
}
function gt() {
  (Y.setPixelRatio(M.pixelRatio),
    ot.setPixelRatio(M.pixelRatio),
    Bn.rt.samples !== M.msaa && ((Bn.rt.samples = M.msaa), Bn.rt.dispose()),
    (il.enabled = !!M.smaa),
    (Qt.enabled = !!M.bloom),
    (ce.enabled = !0),
    ce.updateGtaoMaterial({
      radius: M.aoRadius * Gf(),
      thickness: 1.2 * Gf(),
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: M.ao ? M.aoSamples : 2,
    }),
    (ho.enabled = !!M.dof),
    (ho.u.maxCoc.value = M.maxCoc),
    W0(),
    _f());
}
const Gf = () => A(0.7 + Math.max(U(), W()) * 0.05, 0.7, 2.6),
  Fi = {
    low: {
      cap: 1,
      px: 0,
      msaa: 0,
      ao: 0,
      aoSamples: 6,
      dof: 0,
      reflect: 0,
      shadow: [1024, 2048],
    },
    mid: {
      cap: 1.5,
      px: 16e5,
      msaa: 2,
      ao: 1,
      aoSamples: 8,
      dof: 1,
      reflect: 0,
      shadow: [2048, 2048],
    },
    high: {
      cap: 2,
      px: Xi,
      msaa: 4,
      ao: 1,
      aoSamples: 12,
      dof: 1,
      reflect: 1,
      shadow: [2048, 4096],
    },
    ultra: {
      cap: 2,
      px: 83e5,
      msaa: 4,
      ao: 1,
      aoSamples: 16,
      dof: 1,
      reflect: 1,
      shadow: [4096, 4096],
    },
  },
  K0 = {
    auto: "Picks a level for this device, and steps down if the game starts to stutter.",
    low: "For older laptops and phones: no floor reflections, contact shadows or background blur.",
    mid: "Contact shadows and background blur, without the floor reflections.",
    high: "Everything on, and sharper on high-resolution screens.",
    ultra: "Full resolution on every screen. Wants a fast graphics card.",
  },
  X0 = () =>
    Math.min(innerWidth, innerHeight) < 600 ||
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 8) <= 4;
let Ke = "auto";
try {
  Ke =
    new URLSearchParams(location.search).get("gfx") ||
    localStorage.getItem("gigawatt-gfx") ||
    "auto";
} catch {}
Ke !== "auto" && !Fi[Ke] && (Ke = "auto");
function _i(e, t) {
  if (((Ke = Fi[e] ? e : "auto"), !t))
    try {
      localStorage.setItem("gigawatt-gfx", Ke);
    } catch {}
  const o = Fi[Ke === "auto" ? (X0() ? "mid" : "high") : Ke],
    n = innerWidth || 1440,
    a = innerHeight || 840,
    r = A(
      Math.min(
        devicePixelRatio || 1,
        o.cap,
        o.px ? Math.sqrt(o.px / (n * a)) : 1,
      ),
      1,
      2,
    );
  (Object.assign(M, {
    pixelRatio: +r.toFixed(2),
    msaa: Ke === "ultra" ? 4 : Math.min(o.msaa, r >= 1.5 ? 2 : 4),
    ao: o.ao,
    aoSamples: o.aoSamples,
    dof: o.dof,
    reflect: o.reflect,
    shadowMin: o.shadow[0],
    shadow: o.shadow[1],
    auto: Ke === "auto" ? 1 : 0,
  }),
    (M._ceil = void 0),
    (Os = 0),
    (Yo = 0),
    (rr = 0),
    gt(),
    ac(),
    (Y.shadowMap.needsUpdate = !0),
    Is(),
    t ||
      Q(
        Ke === "auto"
          ? "Graphics: Auto"
          : `Graphics: ${b('#gfx [data-q="' + Ke + '"]').textContent}`,
      ));
}
function Co() {
  ((b("#tune-rows").innerHTML = So.map(([e, t, o, n, , a, r], i) => {
    const l = M[e],
      f = ((l - o) / (n - o)) * 100;
    return `<div class="tr${i === qt ? " sel" : ""}${r ? " sub" : ""}" data-i="${i}"><b>${t}</b><span class="tk"><i style="left:${A(f, 0, 100)}%"></i></span><u>${a(l)}</u></div>`;
  }).join("")),
    b("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((qt = +e.dataset.i), Co());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (qt = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const n = (a) => {
            const r = t.getBoundingClientRect(),
              [i, , l, f, u] = So[qt],
              g = A(
                Math.round(
                  (l + ((a.clientX - r.left) / r.width) * (f - l)) / u,
                ) * u,
                l,
                f,
              );
            g !== M[i] &&
              ((M[i] = +g.toFixed(4)), i !== "auto" && (M.auto = 0), gt());
            const d = t.querySelector("i");
            ((d.style.left = A(((M[i] - l) / (f - l)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = So[qt][5](M[i])),
              (b("#tune-json").value = JSON.stringify(M)));
          };
          (n(o),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && n(a);
            }),
            (t.onpointerup = () => Co()));
        };
      }),
    (b("#tune-json").value = JSON.stringify(M)));
}
function Z0(e, t) {
  const [o, , n, a, r] = So[qt],
    i = A(+(M[o] + e * r * (t ? 5 : 1)).toFixed(4), n, a);
  i !== M[o] && ((M[o] = i), o !== "auto" && (M.auto = 0), gt(), Co());
}
function Bf(e) {
  const t = b("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && Co());
}
function Q0(e) {
  const t = e.key;
  return t === "ArrowUp" || t === "ArrowDown"
    ? ((qt = (qt + (t === "ArrowUp" ? -1 : 1) + So.length) % So.length),
      Co(),
      b("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0)
    : t === "ArrowLeft" || t === "ArrowRight"
      ? (Z0(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0)
      : t === "0" || t === ")"
        ? (e.shiftKey ? Object.assign(M, kr) : (M[So[qt][0]] = kr[So[qt][0]]),
          (M.auto = 0),
          gt(),
          Co(),
          !0)
        : t === "c" || t === "C"
          ? (navigator.clipboard?.writeText(JSON.stringify(M, null, 1)), !0)
          : t === "Escape"
            ? (Bf(!1), !0)
            : !1;
}
(b("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in kr) typeof t[o] == "number" && (M[o] = t[o]);
    ((M.auto = 0), gt(), Co());
  } catch {
    Co();
  }
}),
  addEventListener("keydown", (e) => {
    if (
      (e.metaKey || e.ctrlKey) &&
      !e.altKey &&
      (e.code === "Quote" || e.key === "'")
    ) {
      (e.preventDefault(), Bf());
      return;
    }
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
      document.querySelector("dialog[open]")
    )
      return;
    if (!b("#tune").hidden && Q0(e)) {
      e.preventDefault();
      return;
    }
    const t = e.key.toLowerCase();
    if (
      (R.wake(),
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
      ].includes(t))
    ) {
      (t.startsWith("arrow") && e.preventDefault(), wn.add(t));
      return;
    }
    if (/^[1-9]$/.test(t)) {
      const o = Sc[+t - 1],
        n = K[o];
      if (!se(n)) {
        Q(`${n.name}: unlocks when you launch v${n.gen + 1}`);
        return;
      }
      (Fe !== "build" && Lt[0].click(),
        (s.seen["tool_" + o] = 1),
        Wt($e === o ? null : o),
        R.tick());
      return;
    }
    if (t === "escape") {
      b("#gfx").hidden ? ($e ? Wt(null) : Je(-1)) : Ii(!1);
      return;
    }
    if (t === " ") {
      (e.preventDefault(), vt() && As());
      return;
    }
    if (t === "enter" && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      const o = s.staff.books !== 2 ? _t("you") : 0,
        n = go("you"),
        a = Po("you");
      !o &&
        !n &&
        !a &&
        Q("Nothing is waiting: no bill, no delivery, no rack down");
      return;
    }
    if ((t === "delete" || t === "backspace") && Ct >= 0) {
      (ai(Ct), at());
      return;
    }
    if (t === "c") {
      kf();
      return;
    }
    if (t === "r") {
      Ra();
      return;
    }
    if (t === "m") {
      (R.toggle(), Bi(), Q(R.on ? "Sound on" : "Sound off"));
      return;
    }
    t === "/" &&
      (e.preventDefault(),
      mt.classList.toggle("ui-off"),
      Q(
        mt.classList.contains("ui-off")
          ? "Interface hidden \xB7 / to show"
          : "Interface shown",
      ));
  }));
let L = 0,
  lo = 0.016,
  $o = 0.016,
  Ln = 1,
  lr = 0,
  If = 0,
  Of = !1;
function Ff() {
  const e = Math.max(1, fo.clientWidth),
    t = Math.max(1, fo.clientHeight);
  qe = e < 900;
  const o = M.fov + (qe ? 10 : 0);
  (O.fov !== o && ((O.fov = o), O.updateProjectionMatrix()),
    O.setViewOffset(e, t, qe ? 0 : e * 0.015, qe ? t * 0.14 : t * 0.035, e, t));
}
function _f() {
  const e = Math.max(1, fo.clientWidth),
    t = Math.max(1, fo.clientHeight);
  ((O.aspect = e / t),
    O.updateProjectionMatrix(),
    Y.setSize(e, t),
    ot.setSize(e, t));
  const o = Y.getDrawingBufferSize(new c.Vector2());
  (xr.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    rl.uRes.value.copy(o),
    Ff(),
    O.updateProjectionMatrix(),
    Qe || bn(!1));
}
addEventListener("resize", _f);
let Ui = performance.now(),
  Vi = 0,
  ji = 0,
  Uf = 0;
function Ni(e) {
  (($o = A((e - Ui) / 1e3, 0, 8 * 3600)), (lo = Math.min(0.1, $o)), (Ui = e));
  const t = e / 1e3;
  ((L = t), (Wr.value = t), (jn.uTime.value = t));
  const o = $o * Ln;
  if ($o > $d) {
    const n = Gr(o);
    n && $o >= 60 && Ci(n, $o);
  } else Dl(o);
  if ((m.dirty && Ne(), He && pt(), L0(lo * Ln), l0(), ef(), ff(), Of)) {
    L - lr > 10 && ((lr = L), De());
    return;
  }
  if (
    (Ve && V0(t),
    Pu(lo),
    fu(lo),
    ni(t, lo),
    O.updateMatrixWorld(),
    (Xl.value = m.C > 0 ? A((m.served + m.trainRate) / m.C, 0, 1) : 0),
    (Zl.value = m.brown < 0.995 ? A((1 - m.brown) * 3, 0.3, 1) : 0),
    (e - If > 66 || He) && ((Y.shadowMap.needsUpdate = !0), (If = e)),
    x0(lo),
    y0(),
    Cu(),
    k0(),
    F0(t),
    xf(t, lo),
    o0(),
    Uu(),
    Ha(),
    Ae && Dc(),
    e0(lo),
    n0(),
    L - Nc > 6.5 && b("#banner").classList.remove("on"),
    qa.classList.contains("on") && L - jc > 1.8 && qa.classList.remove("on"),
    du(t, lo),
    Hr >= 2 && L - Kl > 1 && os(),
    R.hum(A(m.draw / Math.max(m.cap, 1e-9), 0, 1)),
    L - lr > 10 && ((lr = L), De()),
    (Vi += $o),
    ji++,
    e - Uf > 1600)
  ) {
    const n = ji / Math.max(Vi, 0.001);
    ((Vi = 0),
      (ji = 0),
      (Uf = e),
      (Af = n),
      Yo++,
      b("#tune").hidden ||
        (b("#tune-fps").textContent = Math.round(n) + " fps"),
      !b("#gfx").hidden &&
        Yo > 1 &&
        (b("#gfx-fps").textContent = Math.round(n) + " fps"),
      Yo > 2 && (rr = Math.max(rr, n)),
      (Os = Yo > 3 && n < rr * 0.74 ? Os + 1 : 0),
      M._ceil === void 0 &&
        ((M._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (M._good = 0),
        (M._probe = 0)),
      !document.hidden &&
        M.auto &&
        Yo > 3 &&
        (M._probe && n < 55
          ? ((M._probe = 0),
            (M._good = 0),
            (M._ceil = Math.max(1, +(M.pixelRatio - 0.25).toFixed(2))),
            (M.pixelRatio = M._ceil),
            gt())
          : ((M._probe = 0),
            (M._good = n >= 58 ? Math.min(9, M._good + 1) : 0),
            M._good >= 3 &&
              M.pixelRatio < M._ceil &&
              ((M._good = 0),
              (M._probe = 1),
              (M.pixelRatio = Math.min(
                M._ceil,
                +(M.pixelRatio + 0.25).toFixed(2),
              )),
              gt()))),
      !document.hidden &&
        M.auto &&
        Os >= 2 &&
        n < 50 &&
        ((Os = 0),
        M.pixelRatio > 1
          ? ((M.pixelRatio = M._ceil =
              Math.max(1, +(M.pixelRatio - 0.25).toFixed(2))),
            gt())
          : M.reflect
            ? ((M.reflect = 0), gt())
            : M.msaa > 0
              ? ((M.msaa = 0), gt())
              : M.ao && ((M.ao = 0), gt())));
  }
  (Y0(t, $o), nl(), Y.info.reset(), ot.render());
}
let Hi = !0;
function Wi(e) {
  (requestAnimationFrame(Wi), Hi && Ni(e));
}
(addEventListener("visibilitychange", () => {
  document.hidden && De();
}),
  addEventListener("pagehide", De));
function Rn() {
  (Ao(),
    Su(),
    fs.fill(-99),
    w0(),
    Wl(),
    Ne(),
    pt(),
    bn(!0),
    (Ae = !0),
    Dc(),
    Ha(!0),
    (Sn = !0),
    sf());
}
const J0 = pt;
pt = function () {
  (J0(), (ke = []), (qo = []));
  for (const e in Nt) (K[e].kind === "rack" ? ke : qo).push(...Nt[e].list);
};
const cr = Tl();
(cr || ((s = po()), aa()),
  Ff(),
  _i(Ke, !0),
  Rn(),
  cr && R0(),
  b("#loading").remove(),
  (Ui = performance.now()),
  requestAnimationFrame(Wi),
  cr ||
    (($e = "pc"),
    (Ae = !0),
    (Ce = { at: null, d0: k.fitGoal * 5.6, p0: new c.Vector3(17, 0, -13) }),
    (k.fit = Ce.d0),
    k.t.copy(Ce.p0)),
  cr ||
    setTimeout(
      () =>
        be(
          "It starts in a garage",
          "One gaming PC and a box fan. Every request it answers earns money.",
          "c",
          null,
          { icon: "garage", kick: "Day one" },
        ),
      900,
    ),
  (window.__step = (e) => Ni(e)),
  (window.__loop = (e) => {
    Hi = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = Y.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = e),
      (n.height = Math.round((e * o.height) / o.width)),
      n.getContext("2d").drawImage(o, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", t)
    );
  }));
let zi = !1,
  Vf = 0;
const Yt = { period: 0, staff: !0, chores: !0, last: -1e9, full: 0, steps: 0 };
function jf() {
  if (!zi || L - Vf < 0.25 / Ln) return;
  if (
    ((Vf = L),
    m.dirty && Ne(),
    He && pt(),
    Yt.steps++,
    Ro() && Yt.full++,
    Yt.chores &&
      (!Yt.period || s.played - Yt.last >= Yt.period) &&
      ((Yt.last = s.played),
      s.staff.books !== 2 && _t("bot"),
      go("bot"),
      s.down.length && Po("bot")),
    vt())
  ) {
    As();
    return;
  }
  if (Rt() && Yt.staff) {
    for (const f of ["books", "curb", "fix"])
      s.gen >= ne[f].gen && s.staff[f] !== 2
        ? ci(f)
        : !s.staff[f] &&
          s.cash > ne[f].wage * 60 &&
          (f !== "fix" || s.stats.downs > 0) &&
          Rc(f);
    s.gen >= ne.build.gen && !s.staff.build && ci("build");
    const l = na[s.staff.crews || 0];
    l != null && Ft().length > nt() && s.cash >= l * 3 && Pc();
  }
  for (const l of xt)
    se(l) &&
      !s.res[l.id] &&
      s.cash >= l.cost &&
      l.cost < Math.max(m.rev, 1) * 45 &&
      Ec(l.id);
  const e = s.proj
    .filter((l) => l.kind === "plant")
    .reduce((l, f) => l + ft[f.id].kw * de.power, 0);
  if (
    m.draw +
      s.sites.reduce(
        (l, f) => l + (P[f.ix].kind === "rack" ? P[f.ix].kw : 0),
        0,
      ) >
    (m.cap + e) * 0.85
  ) {
    const l = Jt.filter((f) => se(f) && Vn(f.id) < f.max).sort(
      (f, u) => u.kw / Bt(u) - f.kw / Bt(f),
    )[0];
    l && s.cash >= Bt(l) && Lc(l.id);
  }
  if (m.brown < 0.999 || Ft().length >= nt() + 2) return;
  const o = bs("rack"),
    n = ms();
  {
    const l = _[s.lvl + 1];
    if (l && !rt() && n <= U() * W() * 0.15 && s.cash >= l[2] * 1.1) {
      Ms();
      return;
    }
  }
  if (ra.starved) {
    const l = [];
    for (let g = 0; g < W(); g++)
      for (let d = 0; d < U(); d++) {
        const p = Z(d, g);
        P[eo[p]]?.kind === "rack" && Rl[p] < 0.98 && l.push(p);
      }
    const f = Math.max(...l.map((g) => P[eo[g]].cls)),
      u = bs("cool", f);
    if (u && s.cash >= u.cost) {
      let g = xo(u);
      if (g < 0) {
        const d = l.filter((p) => P[s.cells[p]]?.kind === "rack" && !he[p]);
        if (!d.length) return;
        ((g = d[Math.floor(d.length / 2)]), ai(g));
      }
      (wo(u, g, !0), at());
    }
    return;
  }
  if (n <= 1) {
    const l = _[s.lvl + 1];
    if (l && !rt() && s.cash >= l[2]) {
      Ms();
      return;
    }
    const f = ke.find((u) => P[s.cells[u]]?.ix < o.ix && !he[u]);
    f != null &&
      s.cash >= $t(o) * 1.3 &&
      o.tps > P[s.cells[f]].tps * 3 &&
      (wo(o, f, !0), at());
    return;
  }
  const a = xo(o),
    r = a >= 0 ? ws(o, a) : { f: 0 };
  if (a >= 0 && r.f >= 0.98 && s.cash >= $t(o)) {
    (wo(o, a, !0), at());
    return;
  }
  const i = bs("cool", o.cls);
  if (i && s.cash >= i.cost + $t(o)) {
    const l = xo(i);
    (wo(i, l >= 0 ? l : a, !0), at());
  }
}
const e1 = Ni;
window.__step = (e) => {
  (e1(e), jf());
};
const y1 = Wi;
((function e() {
  (requestAnimationFrame(e), Hi && jf());
})(),
  (window.__lab = {
    S: () => s,
    SIM: m,
    tod: (e) => {
      ((D.mode = e == null ? "cycle" : "pin"), (D.pin = e), (D.first = 0));
    },
    tileXY: (e, t) => {
      V.set(e + 0.5, le, -(t + 0.5)).project(O);
      const o = pe.getBoundingClientRect();
      return [
        o.left + (V.x * 0.5 + 0.5) * o.width,
        o.top + (-V.y * 0.5 + 0.5) * o.height,
      ];
    },
    sug: (e) => {
      const t = xo(K[e || $e || "pc"]);
      return t < 0 ? null : [t % B, Math.floor(t / B)];
    },
    cash: (e) => {
      s.cash = e;
    },
    gen: (e) => {
      ((s.gen = A(e, 0, Me)), Ao(), Ne(), (Ae = !0));
    },
    lvl: (e) => {
      ((s.lvl = A(e, 0, _.length - 1)), Rn());
    },
    speed: (e) => {
      Ln = e;
    },
    bot: (e) => {
      zi = !!e;
    },
    plant: (e, t) => {
      ((s.plants[e] = t), ti());
    },
    res: (e) => {
      ((s.res[e] = 1), Ao(), Ne());
    },
    launch: As,
    save: De,
    reset: () => {
      ((s = po()), aa(), Rn());
    },
    tool: Wt,
    select: Je,
    cine: Tn,
    tune: (e) => (Object.assign(M, e), gt(), { ...M }),
    toast: (...e) => be(...e),
    money: $,
    board: (e) => {
      if (e == null || e < 0) {
        G.pin = -1;
        return;
      }
      ((G.pin = e), (G.face = G.base = e), (G.turning = !1), (G.prog = 0));
    },
    faces: () => Qn.map((e) => e.c.toDataURL("image/png")),
    intro: () => {
      ((Qe = !1),
        (Ce = { at: null, d0: k.fitGoal * 5.6, p0: new c.Vector3(17, 0, -13) }),
        (k.fit = Ce.d0),
        k.t.copy(Ce.p0));
    },
    layout: (e, t, o = 3) => {
      const n = K[e],
        a = K[t];
      for (let r = 0; r < W(); r++)
        for (let i = 0; i < U(); i++) {
          const l = Z(i, r);
          s.cells[l] || (s.cells[l] = i % o === 1 && r % o === 1 ? a.ix : n.ix);
        }
      return (Ne(), pt(), { starved: m.starved, racks: m.racks });
    },
    fill: (e, t) => {
      const o = K[e];
      for (let n = 0; n < W(); n++)
        for (let a = 0; a < U(); a++)
          s.cells[Z(a, n)] || (s.cells[Z(a, n)] = o.ix);
      (Ne(), pt());
    },
    heat: (e) => {
      $n = !!e;
    },
    gfx: (e) => _i(e),
    coach: () => Fc(),
    tags: (e) => {
      Gs = !!e;
    },
    bill: () => _t("you"),
    sign: () => go("you"),
    staff: (e, t) => {
      (e === "crews" ? (s.staff.crews = t) : (s.staff[e] = t), (Ae = !0));
    },
    away: (e) => {
      const t = Gr(e);
      return (t && Ci(t, e), t && { t: t.t, cut: t.cut });
    },
    sites: () =>
      s.sites.map((e) => ({
        k: e.k,
        id: P[e.ix].id,
        left: +e.left.toFixed(2),
        T: e.T,
        tr: e.tr,
      })),
    trucks: () => s.trucks.map((e) => ({ ...e, n: Ot(e).length })),
    finishSites: () => {
      for (const e of [...s.sites]) ia(e);
      for (const e of s.proj) e.left = 0;
      (Dr(0), Ne(), pt());
    },
    down: (e = 1) => {
      const t = ke.filter((o) => !st[o] && P[s.cells[o]]?.kind === "rack");
      for (let o = 0; o < e && t.length; o++) {
        const n = t.splice(Math.floor(Be() * t.length), 1)[0];
        (s.down.push({ k: n, t: s.played }), (st[n] = 1), s.stats.downs++);
      }
      return ((m.dirty = !0), (He = !0), s.down.length);
    },
    downs: () => s.down.map((e) => e.k),
    fixAll: () => Po("you"),
    knob: (e) => (
      e.rise != null && (Ga = e.rise),
      e.down != null && (Lr = e.down),
      { rise: Ga, down: Lr }
    ),
    arrive: () => {
      for (const e of s.trucks)
        e.st !== "curb" && ((e.st = "curb"), (e.t = 0), (e.wait = 0));
    },
    order: (e, t, o) => {
      const n = wo(K[e], Z(t, o), !0);
      return (n === "ok" && at(), n);
    },
    free: () => {
      const e = [];
      for (let t = 0; t < W(); t++)
        for (let o = 0; o < U(); o++) {
          const n = Z(o, t);
          !s.cells[n] && !he[n] && e.push([o, t]);
        }
      return e;
    },
    botMode: (e) => Object.assign(Yt, e),
    botStats: () => ({ ...Yt }),
    gensT: (e) => (
      e.forEach((t, o) => {
        ee[o] && t != null && ((ee[o].T = t), (ee[o].TN = ee[o].D * t));
      }),
      ee.map((t) => t.T)
    ),
    fast: (e) => {
      Of = !!e;
    },
    tour: (e) => {
      if (((s.seen.tourDone = e ? 0 : 1), e)) {
        s.seen.tourHello = 0;
        for (const t of it) delete s.seen["rv_" + t];
      }
    },
    guide: () => Vc(),
  }),
  (window.__film = {
    cam(e) {
      ((Qe = !0),
        (Ce = null),
        (Ve = !1),
        (ze = 1),
        k.t.set(e.t[0], e.t[1], e.t[2]),
        k.tGoal.copy(k.t),
        (k.yaw = e.yaw),
        (k.pitch = e.pitch),
        (k.fit = k.fitGoal = e.dist));
    },
    hero() {
      const e = k.tGoal.clone(),
        t = k.fitGoal;
      bn(!1);
      const o = {
        t: k.tGoal.toArray(),
        yaw: ae.yaw,
        pitch: ae.pitch,
        dist: k.fitGoal,
      };
      return (k.tGoal.copy(e), (k.fitGoal = t), o);
    },
    shots: () =>
      yf().map((e) => ({ t: e.t, yaw: e.yaw, pitch: e.pitch, dist: e.dist })),
    dump() {
      return ((s.last = Date.now()), JSON.stringify({ ...s, cells: $l() }));
    },
    load(e) {
      return Tl(e)
        ? ((s.last = Date.now()),
          (s.heatwave = 0),
          (s.viral = 0),
          (s.seen.tourDone = 1),
          (Es.viral.state = "off"),
          mo.fill(-99),
          Je(-1),
          Wt(null),
          document.querySelectorAll("dialog[open]").forEach((t) => t.close()),
          (b("#toasts").innerHTML = ""),
          b("#banner").classList.remove("on"),
          Rn(),
          (wi = -99),
          ef(),
          Ha(!0),
          !0)
        : !1;
    },
    truck(e) {
      if (e == null)
        for (const t of s.trucks)
          t.st !== "curb" && ((t.st = "curb"), (t.t = 0), (t.wait = 0));
    },
    viral() {
      const e = Es.viral;
      ((e.state = "on"), (e.t = L));
    },
    ready() {
      s.train = dt();
    },
    turn(e, t) {
      ((G.pin = -1),
        (G.face = G.base = e),
        (G.turning = !1),
        (G.prog = 0),
        (G.at = L - ((we.billboard[e].hold || 8) - t)));
    },
    bot: (e) => {
      zi = !!e;
    },
    speed: (e) => {
      Ln = e;
    },
    sfx: R,
  }),
  (window.__x = {
    dof: ho,
    gtao: ce,
    bloom: Qt,
    renderer: Y,
    camera: O,
    scene: Pe,
    composer: ot,
    cam: k,
    RT: M,
    overlay: Mr,
    rays: Oe,
    INST: Nt,
    board: Mt,
    boardHit: ga,
    labSign: Bo,
  }),
  (window.__dbg = () => ({
    t: +L.toFixed(2),
    gen: s.gen,
    cash: Math.round(s.cash),
    rev: +m.rev.toFixed(2),
    C: Math.round(m.C),
    D: Math.round(m.D),
    served: Math.round(m.served),
    train: +(s.train / Math.max(dt(), 1e-9)).toFixed(3),
    racks: m.racks,
    coolers: m.coolers,
    starved: m.starved,
    brown: +m.brown.toFixed(3),
    draw: Math.round(m.draw),
    lvl: s.lvl,
    played: Math.round(s.played),
    bill: Math.round(s.bill),
    sites: s.sites.length,
    building: Ft().length,
    crews: nt(),
    trucks: s.trucks.length,
    curb: an().length,
    proj: s.proj.length,
    staff: Object.values(s.staff).join(""),
    calls: Y.info.render.calls,
    tris: Y.info.render.triangles,
  })));
