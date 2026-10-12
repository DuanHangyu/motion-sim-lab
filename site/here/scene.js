import * as r from "three";
import { EffectComposer as Wo } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as Tt,
  FullScreenQuad as Xa,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as yn } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Yo } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as Xo } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as Jo } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as Zo } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as Qo } from "three/addons/utils/BufferGeometryUtils.js";
const j = (e) => document.querySelector(e),
  B = j("#world"),
  Ja = j("#app"),
  k = (e, a, t) => (e < a ? a : e > t ? t : e),
  D = (e, a, t) => e + (a - e) * t,
  Q = (e, a, t) => {
    const n = k((t - e) / (a - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  Pr = (e) => 1 - (1 - e) ** 3,
  jn = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
let Ie = 0.016,
  At = 0.016,
  F = 0;
const m = Math.PI / 180;
function Za(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let a = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (a = (a + Math.imul(a ^ (a >>> 7), 61 | a)) ^ a),
      ((a ^ (a >>> 14)) >>> 0) / 4294967296
    );
  };
}
const ea = (e) => {
    const a = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return a - Math.floor(a);
  },
  ei = "https://x.com/ryansael",
  Pt = "here",
  aa = 7,
  S = 12.4,
  O = new r.Scene();
((O.background = new r.Color("#080c16")),
  (O.fog = new r.FogExp2("#0d1524", 0.0031)));
const y = new r.PerspectiveCamera(30, 1, 0.5, 460);
let C;
try {
  C = new r.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (j("#loading").textContent =
      "This page needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const ai = 25e5,
  ti = () => {
    const e = innerWidth || 1440,
      a = innerHeight || 840;
    return k(Math.min(devicePixelRatio, 2, Math.sqrt(ai / (e * a))), 1, 2);
  },
  Qa = ti();
(C.setPixelRatio(Qa),
  (C.info.autoReset = !1),
  (C.shadowMap.enabled = !0),
  (C.shadowMap.type = r.PCFShadowMap),
  (C.shadowMap.autoUpdate = !1),
  (C.toneMapping = r.ACESFilmicToneMapping),
  B.appendChild(C.domElement));
const kn = new r.HemisphereLight(8361672, 2761756, 0.3);
O.add(kn);
const E = new r.DirectionalLight(16765862, 0.5);
((E.castShadow = !0),
  E.shadow.mapSize.set(2048, 2048),
  Object.assign(E.shadow.camera, {
    left: -34,
    right: 34,
    top: 26,
    bottom: -10,
    near: 1,
    far: 150,
  }),
  (E.shadow.normalBias = 0.06),
  (E.shadow.bias = -5e-4),
  (E.shadow.radius = 2),
  O.add(E, E.target));
const ni = new r.Vector3(0.62, 0.55, 0.48).normalize();
(E.position.copy(ni).multiplyScalar(70), E.target.position.set(0, 2, 0));
const Rt = new r.DirectionalLight(9427199, 0.55);
(Rt.position.set(-26, 22, -40), O.add(Rt));
const Lt = new r.DirectionalLight(16773600, 0.3);
(Lt.position.set(-30, 30, 26), O.add(Lt));
const de = new r.Group();
O.add(de);
const me = 10,
  ta = {
    pos: {
      value: Array.from({ length: me }, () => new r.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: me }, () => new r.Vector3()) },
  },
  oi = `uniform vec4 uFakePos[${me}];uniform vec3 uFakeCol[${me}];uniform float uSat;`,
  ii = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${me};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  ri = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  xn = { value: 1.2 };
function wa(e, a) {
  return (
    (e.onBeforeCompile = (t) => {
      (Object.assign(t.uniforms, {
        uFakePos: ta.pos,
        uFakeCol: ta.col,
        uSat: xn,
      }),
        (t.fragmentShader = t.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + oi,
          )
          .replace("#include <lights_fragment_end>", ii)
          .replace("#include <opaque_fragment>", ri)),
        a?.(t));
    }),
    (e.customProgramCacheKey = () => Pt + (a ? a.key : "")),
    e
  );
}
const qn = [];
function zn(e, a, t, n, i, o) {
  const s = { p: new r.Vector3(e, a, t), c: new r.Color(n), r: i, i: o, i0: o };
  return (qn.push(s), s);
}
const et = new r.Vector3(),
  $ = [],
  be = new r.Vector3(0, S, 0);
function si(e) {
  $.length = 0;
  for (const a of qn)
    if (!(a.i <= 0.001)) {
      if (
        ((a.score = (a.i * a.r) / (1 + a.p.distanceToSquared(e) * 0.01)),
        $.length < me)
      )
        ($.push(a), $.length === me && $.sort((t, n) => t.score - n.score));
      else if (a.score > $[0].score) {
        $[0] = a;
        for (let t = 0; t < me - 1 && $[t].score > $[t + 1].score; t++) {
          const n = $[t];
          (($[t] = $[t + 1]), ($[t + 1] = n));
        }
      }
    }
}
function Mn(e, a) {
  si(a);
  for (let t = 0; t < me; t++) {
    const n = $[t];
    if (!n) {
      (ta.col.value[t].set(0, 0, 0), ta.pos.value[t].set(0, -999, 0, 1));
      continue;
    }
    (et.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      ta.pos.value[t].set(et.x, et.y, et.z, 1 / (n.r * n.r)),
      ta.col.value[t].set(n.c.r * n.i, n.c.g * n.i, n.c.b * n.i));
  }
}
const Sn = {};
{
  const e = new r.PMREMGenerator(C),
    a = (o) =>
      new r.Mesh(
        new r.SphereGeometry(50, 32, 16),
        new r.ShaderMaterial({
          side: r.BackSide,
          vertexShader:
            "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: o,
        }),
      ),
    t = (o, s, c, l, f, u, g) => {
      const b = new r.Mesh(
        new r.BoxGeometry(s, c, 0.4),
        new r.MeshBasicMaterial({ color: new r.Color(...l) }),
      );
      (b.position.set(f, u, g), b.lookAt(0, 0, 0), o.add(b));
    },
    n = new r.Scene();
  n.add(
    a(
      "varying vec3 d;void main(){vec3 c=mix(vec3(.07,.065,.06),vec3(.11,.14,.22),smoothstep(-.4,.12,d.y));c=mix(c,vec3(.04,.055,.1),smoothstep(.2,.9,d.y));c+=vec3(.40,.21,.095)*smoothstep(.72,.98,d.x)*smoothstep(-.12,.22,d.y)*(1.-smoothstep(.28,.68,d.y));gl_FragColor=vec4(c,1.);}",
    ),
  );
  const i = [
    [2, 1.5, 1],
    [0.7, 1.4, 2.1],
    [1.7, 1.1, 0.55],
    [0.95, 1.1, 1.3],
    [0.55, 1.6, 2.1],
    [1.3, 1.3, 1.3],
  ];
  for (let o = 0; o < 6; o++) {
    const s = (o / 6) * Math.PI * 2 + 0.4;
    t(n, 12, 2.4, i[o], Math.sin(s) * 28, 12 + (o % 2) * 9, Math.cos(s) * 28);
  }
  {
    const o = new r.Mesh(
      new r.BoxGeometry(40, 1.2, 1.2),
      new r.MeshBasicMaterial({ color: new r.Color(5, 2.9, 1) }),
    );
    (o.position.set(0, -6, -30), n.add(o));
  }
  ((Sn.show = e.fromScene(n, 0.03).texture), e.dispose());
}
((O.environment = Sn.show), (O.environmentIntensity = 0.6));
const Cn = 0,
  Dt = new r.WebGLRenderTarget(1, 1, {
    type: r.HalfFloatType,
    generateMipmaps: !0,
    minFilter: r.LinearMipmapLinearFilter,
  }),
  at = {
    tReflect: { value: Dt.texture },
    uReflMatrix: { value: new r.Matrix4() },
    uReflStrength: { value: 0.26 },
  },
  ci = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, at),
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
   vec3 mir=texture2D(tReflect,vReflCoord.xy/max(vReflCoord.w,1e-4),1.6).rgb;outgoingLight=mix(outgoingLight,mir,uReflStrength*gl*(.25+.75*pow(max(1.-facing,0.),2.)));}
  outgoingLight=max(mix(`,
          )));
    },
    { key: "refl" },
  ),
  ee = new r.PerspectiveCamera(),
  tt = new r.Vector3(0, 1, 0),
  va = new r.Vector3(0, Cn, 0),
  Ft = new r.Vector3(),
  nt = new r.Vector3(),
  Gt = new r.Matrix4(),
  ya = new r.Plane(),
  pe = new r.Vector4(),
  Tn = new r.Vector4(),
  we = [];
function li() {
  if (
    !d.reflect ||
    at.uReflStrength.value <= 0 ||
    y.position.y <= Cn ||
    !E.shadow.map
  )
    return;
  (Ft.setFromMatrixPosition(y.matrixWorld),
    Gt.extractRotation(y.matrixWorld),
    ee.position.subVectors(va, Ft).reflect(tt).negate().add(va),
    nt.set(0, 0, -1).applyMatrix4(Gt).add(Ft),
    nt.subVectors(va, nt).reflect(tt).negate().add(va),
    ee.up.set(0, 1, 0).applyMatrix4(Gt).reflect(tt),
    ee.lookAt(nt),
    (ee.far = y.far),
    ee.updateMatrixWorld(),
    ee.projectionMatrix.copy(y.projectionMatrix),
    at.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(ee.projectionMatrix)
      .multiply(ee.matrixWorldInverse),
    ya
      .setFromNormalAndCoplanarPoint(tt, va)
      .applyMatrix4(ee.matrixWorldInverse),
    pe.set(ya.normal.x, ya.normal.y, ya.normal.z, ya.constant));
  const e = ee.projectionMatrix.elements;
  (Tn.set(
    (Math.sign(pe.x) + e[8]) / e[0],
    (Math.sign(pe.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    pe.multiplyScalar(2 / pe.dot(Tn)),
    (e[2] = pe.x),
    (e[6] = pe.y),
    (e[10] = pe.z + 1),
    (e[14] = pe.w));
  const a = we.map((n) => n.visible),
    t = C.shadowMap.needsUpdate;
  (we.forEach((n) => (n.visible = !1)),
    (C.shadowMap.needsUpdate = !1),
    Mn(ee, be),
    C.setRenderTarget(Dt),
    C.clear(),
    C.render(O, ee),
    C.setRenderTarget(null),
    we.forEach((n, i) => (n.visible = a[i])),
    (C.shadowMap.needsUpdate = t));
}
const fi =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  ot = (e, a) =>
    new r.ShaderMaterial({
      uniforms: a,
      vertexShader: fi,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class di extends Tt {
  constructor(a) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new r.WebGLRenderTarget(1, 1, {
        type: r.HalfFloatType,
        samples: a,
        depthTexture: new r.DepthTexture(1, 1),
      })),
      (this.quad = new Xa(
        ot(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(7.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(a, t) {
    this.rt.setSize(a, t);
  }
  render(a, t, n) {
    (Mn(y, be),
      a.setRenderTarget(this.rt),
      a.clear(),
      a.render(O, y),
      a.setRenderTarget(n),
      this.quad.render(a));
  }
}
const An = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class hi extends Tt {
  constructor() {
    super();
    const a = { type: r.HalfFloatType };
    ((this.half = new r.WebGLRenderTarget(1, 1, a)),
      (this.blurRT = new r.WebGLRenderTarget(1, 1, a)),
      (this.u = {
        tColor: { value: null },
        tDepth: { value: null },
        tHalf: { value: this.half.texture },
        tBlur: { value: this.blurRT.texture },
        near: { value: y.near },
        far: { value: y.far },
        focus: { value: 30 },
        range: { value: 9 },
        cocScale: { value: new r.Vector2(0.9, 0.45) },
        maxCoc: { value: 12 },
        stride: { value: 1 },
        texel: { value: new r.Vector2() },
        fullTexel: { value: new r.Vector2() },
      }),
      (this.pre = new Xa(
        ot(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${An}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Xa(
        ot(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;uniform float stride;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r*stride>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r*stride;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc/stride);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Xa(
        ot(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${An}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(a, t) {
    const n = Math.ceil(a / 2),
      i = Math.ceil(t / 2);
    (this.half.setSize(n, i),
      this.blurRT.setSize(n, i),
      this.u.texel.value.set(1 / n, 1 / i),
      this.u.fullTexel.value.set(1 / a, 1 / t));
  }
  render(a, t, n) {
    ((this.u.tColor.value = n.texture),
      a.setRenderTarget(this.half),
      this.pre.render(a),
      a.setRenderTarget(this.blurRT),
      this.blur.render(a),
      a.setRenderTarget(this.renderToScreen ? null : t),
      this.comp.render(a));
  }
}
const d = {
    auto: 1,
    pixelRatio: Qa,
    msaa: Qa >= 1.5 ? 2 : 4,
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
    reflect: 1,
    bloom: 1,
    bloomStrength: 1,
    bloomRadius: 0.6,
    bloomThreshold: 1,
    ao: 1,
    aoIntensity: 1,
    aoRadius: 1.6,
    aoSamples: 12,
    dof: 1,
    focalBand: 1,
    aperture: 1.35,
    apertureNear: 0.8,
    maxCoc: 12,
  },
  _t = { ...d },
  ae = new Wo(
    C,
    new r.WebGLRenderTarget(1, 1, { type: r.HalfFloatType, depthBuffer: !1 }),
  );
ae.setPixelRatio(Qa);
const ja = new di(d.msaa);
ae.addPass(ja);
const P = new yn(O, y, 1, 1);
((P.output = yn.OUTPUT.Off),
  (P.needsSwap = !1),
  P.updateGtaoMaterial({
    radius: d.aoRadius,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  P.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const ui = P.setSize.bind(P),
  gi = P.render.bind(P);
P.setSize = (e, a) => ui(Math.ceil(e / 2), Math.ceil(a / 2));
const te = [],
  Pn = [];
((P.render = (e, a, t) => {
  (te.forEach((n, i) => {
    ((Pn[i] = n.visible), (n.visible = !1));
  }),
    gi(e, a, t),
    te.forEach((n, i) => (n.visible = Pn[i])),
    (P.blendMaterial.uniforms.intensity.value = d.ao ? d.aoIntensity : 0),
    (P.blendMaterial.uniforms.tDiffuse.value = P.pdRenderTarget.texture),
    P._renderPass(e, P.blendMaterial, t));
}),
  ae.addPass(P));
const ve = new Yo(new r.Vector2(256, 256), 0.52, 0.6, 0.98),
  mi = ve.setSize.bind(ve);
((ve.setSize = (e, a) => mi(Math.ceil(e / 2), Math.ceil(a / 2))),
  ae.addPass(ve));
const ne = new hi();
((ne.u.tDepth.value = ja.rt.depthTexture), ae.addPass(ne));
const It = new r.Scene(),
  bi = {
    tSceneDepth: { value: P.depthTexture },
    uRes: { value: new r.Vector2(1, 1) },
    uNF: { value: new r.Vector2(y.near, y.far) },
  };
class pi extends Tt {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(a, t, n) {
    const i = a.autoClear;
    ((a.autoClear = !1),
      a.setRenderTarget(n),
      a.render(It, y),
      (a.autoClear = i));
  }
}
(ae.addPass(new pi()), ae.addPass(new Xo()));
const Rn = new Jo();
ae.addPass(Rn);
const Rr = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  wi = (e, a, t, n = 0.06, i = 2) =>
    new Zo(e, a, t, i, Math.min(n, Math.min(e, a, t) / 2.02)),
  na = new Map();
function oa(e, a = {}) {
  const t = "M" + e + JSON.stringify(a);
  return (
    na.has(t) ||
      na.set(
        t,
        wa(
          new r.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...a,
          }),
        ),
      ),
    na.get(t)
  );
}
function it(e, a = {}) {
  const t = "T" + e + JSON.stringify(a);
  return (
    na.has(t) ||
      na.set(
        t,
        wa(
          new r.MeshPhysicalMaterial({
            color: e,
            metalness: 0.85,
            roughness: 0.32,
            envMapIntensity: 1.25,
            clearcoat: 0.35,
            clearcoatRoughness: 0.3,
            ...a,
          }),
        ),
      ),
    na.get(t)
  );
}
const Et = (e, a = 1) =>
    new r.MeshBasicMaterial({
      color: new r.Color(e).multiplyScalar(a),
      fog: !1,
    }),
  ka = new r.Matrix4(),
  rt = new r.Quaternion(),
  Ln = new r.Euler(0, 0, 0, "YXZ"),
  Dn = new r.Vector3(1, 1, 1),
  xa = new r.Vector3(0, 1, 0),
  vi = new r.Vector3(),
  yi = new r.Quaternion();
function qa() {
  const e = new Map(),
    a = (t, n, i, o, s, c) => {
      n = n.index ? n.toNonIndexed() : n;
      for (const f of Object.keys(n.attributes))
        ["position", "normal", "uv"].includes(f) || n.deleteAttribute(f);
      (n.attributes.uv ||
        n.setAttribute(
          "uv",
          new r.Float32BufferAttribute(
            new Float32Array(n.attributes.position.count * 2),
            2,
          ),
        ),
        c.dir
          ? (rt.setFromUnitVectors(
              xa,
              vi.set(c.dir[0], c.dir[1], c.dir[2]).normalize(),
            ),
            c.roll && rt.multiply(yi.setFromAxisAngle(xa, c.roll)))
          : (Ln.set(c.rx || 0, c.ry || 0, c.rz || 0), rt.setFromEuler(Ln)),
        n.applyMatrix4(
          ka.compose(
            { x: i, y: o, z: s },
            rt,
            c.s ? Dn.set(c.s[0], c.s[1], c.s[2]) : Dn.set(1, 1, 1),
          ),
        ));
      let l = e.get(t);
      (l || e.set(t, (l = { mat: t, list: [] })), l.list.push(n));
    };
  return {
    box(t, n, i, o, s, c, l, f = {}) {
      return (
        a(t, f.r ? wi(s, c, l, f.r) : new r.BoxGeometry(s, c, l), n, i, o, f),
        this
      );
    },
    cyl(t, n, i, o, s, c, l, f = {}) {
      return (
        a(
          t,
          new r.CylinderGeometry(s, c, l, f.seg || 20, 1, !!f.open),
          n,
          i,
          o,
          f,
        ),
        this
      );
    },
    cone(t, n, i, o, s, c, l = {}) {
      return (
        a(
          t,
          new r.ConeGeometry(s, c, l.seg || 6).translate(0, c / 2, 0),
          n,
          i,
          o,
          l,
        ),
        this
      );
    },
    tor(t, n, i, o, s, c, l = {}) {
      return (
        a(t, new r.TorusGeometry(s, c, l.seg2 || 8, l.seg || 48), n, i, o, l),
        this
      );
    },
    geo(t, n, i = 0, o = 0, s = 0, c = {}) {
      return (a(t, n.clone(), i, o, s, c), this);
    },
    flush(t, n = !0) {
      const i = [];
      for (const { mat: o, list: s } of e.values()) {
        const c = new r.Mesh(Qo(s), o);
        ((c.castShadow = n),
          (c.receiveShadow = !0),
          t.add(c),
          i.push(c),
          s.forEach((l) => l.dispose()));
      }
      return (e.clear(), i);
    },
  };
}
const Vt = [];
document.fonts?.ready.then(() => Vt.forEach((e) => e()));
function ji(e, a, t, n, i, o = 0.9, s = {}) {
  const c = document.createElement("canvas");
  ((c.width = t), (c.height = n));
  const l = c.getContext("2d"),
    f = new r.CanvasTexture(c);
  ((f.anisotropy = 8), (f.colorSpace = r.SRGBColorSpace));
  const u = new r.Mesh(
    new r.PlaneGeometry(e, a),
    new r.MeshBasicMaterial({
      map: f,
      alphaTest: 0.3,
      fog: !1,
      side: r.DoubleSide,
      color: new r.Color(o, o, o),
      ...s,
    }),
  );
  return (
    (u.userData = {
      c,
      g: l,
      t: f,
      redraw(g) {
        (l.clearRect(0, 0, t, n), g(l, t, n), (f.needsUpdate = !0));
      },
    }),
    i && (u.userData.redraw(i), Vt.push(() => u.userData.redraw(i))),
    u
  );
}
const ki = (e, a, t, n, i, o) => {
    (e.beginPath(), e.roundRect(a, t, n, i, o));
  },
  Ee = (e, a, t, n = !0) => {
    const i = document.createElement("canvas");
    ((i.width = e), (i.height = a), t(i.getContext("2d"), e, a));
    const o = new r.CanvasTexture(i);
    return (n && (o.colorSpace = r.SRGBColorSpace), (o.anisotropy = 8), o);
  },
  Lr = Ee(
    128,
    128,
    (e) => {
      const a = e.createRadialGradient(64, 64, 0, 64, 64, 64);
      (a.addColorStop(0, "#fff"),
        a.addColorStop(0.35, "#ffffff88"),
        a.addColorStop(1, "#fff0"),
        (e.fillStyle = a),
        e.fillRect(0, 0, 128, 128));
    },
    !1,
  );
function xi(e, a = 0.3, t = 1, n = 0) {
  const i = new r.IcosahedronGeometry(e, n),
    o = i.attributes.position,
    s = Za(t),
    c = new Map();
  for (let l = 0; l < o.count; l++) {
    const f =
      o.getX(l).toFixed(3) +
      "," +
      o.getY(l).toFixed(3) +
      "," +
      o.getZ(l).toFixed(3);
    c.has(f) ||
      c.set(f, [1 + (s() - 0.5) * a, 1 + (s() - 0.5) * a, 1 + (s() - 0.5) * a]);
    const u = c.get(f);
    o.setXYZ(l, o.getX(l) * u[0], o.getY(l) * u[1], o.getZ(l) * u[2]);
  }
  return (i.computeVertexNormals(), i);
}
const qi = Ee(
  128,
  128,
  (e) => {
    const a = e.createRadialGradient(64, 64, 0, 64, 64, 64);
    (a.addColorStop(0, "rgba(0,0,0,1)"),
      a.addColorStop(0.45, "rgba(0,0,0,.55)"),
      a.addColorStop(1, "rgba(0,0,0,0)"),
      (e.fillStyle = a),
      e.fillRect(0, 0, 128, 128));
  },
  !1,
);
function zi(e, a, t, n, i, o, s = 0.5) {
  const c = new r.Mesh(
    new r.PlaneGeometry(i, o),
    new r.MeshBasicMaterial({
      map: qi,
      transparent: !0,
      opacity: s,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (c.rotation.x = -Math.PI / 2),
    c.position.set(a, t + 0.004, n),
    (c.renderOrder = -1),
    e.add(c),
    te.push(c),
    c
  );
}
const Bt = [];
function Mi(e, a, t, n, i, o = 128) {
  const s = "@RYANSAEL ON X",
    c = () => {
      ((e.font = `${n ? 700 : 600} ${o}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(o * 0.08) + "px"));
    };
  c();
  const l = e.measureText(s).width;
  l > a - 28 && ((o = Math.floor((o * (a - 28)) / l)), c());
  const f = a / 2 + Math.round(o * 0.04),
    u = t / 2 + o * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), n)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(s, f, u + o * 0.05),
      (e.fillStyle = i ? "#e08a24" : "#38332d"),
      e.fillText(s, f, u));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(s, f + o * 0.02, u + o * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(s, f, u - o * 0.025));
  const g = e.createLinearGradient(0, u - o * 0.7, 0, u);
  (g.addColorStop(0, "#f1d08c"),
    g.addColorStop(1, "#b3833d"),
    (e.fillStyle = g),
    e.fillText(s, f, u));
}
function Fn(e, a = {}) {
  const t = !!a.pale,
    n = a.k ?? (t ? 0.92 : 0.62);
  let i = !1;
  const o = (c, l, f) => Mi(c, l, f, t, i),
    s = ji(e, e * 0.1375, 1280, 176, o, n, { alphaTest: 0.25 });
  return (
    (s.userData.mark = 1),
    we.push(s),
    Bt.push({
      hit: s,
      over(c) {
        ((i = c),
          t
            ? s.userData.redraw(o)
            : s.material.color.setRGB(c ? 3.4 : n, c ? 2.5 : n, c ? 1.4 : n));
      },
    }),
    s
  );
}
const Si = [
    "9p709n719l729i729i759h759i789j7c9h7e9k7f9o7f9s7f9w7f9x7h9y7k9w7m9r7o9r7p9t7q9x7p9w7r9y7ra07ra37sa47ua67va87wa97yac7zah7zai80ah83ag85ah86al87al86am85ak84ak82ak81am80ao80ar81at80aw81b182b281b481b683b685b787b987bc86bd89bb8abe8bbk8bbo8cbl8dbi8dbe8cba8cb78eb78gb78ibb8lbf8mbd8ob88nb78mb58kb18iaz8hay8eb18cb28bax88ax85at84aq83ap84ao87am8aal8bal8cak8aai89ae88ab8aaa8daa8gad8hag8ial8jam8lap8oat8raw8tb28vb88xbg8ybl8ybq8xbu8vc18uca8sca8pc48oby8pbx8mc38kc98lcf8ocg8tck8qcq8rcz8td68tda8ude8wdo8udt8tdq8ydu92dw93e190e291ee91eh93eu94fa98ft9bg699gb93gk93gw92h193h790hk8zhu92ic8ziq8yiy8vjg8wjs8wk08uk08mjw8lju8hjo8gjg8cj88dj28bj38aj088j384j082iw7yit7yip7uio7xin83iq88iu8dix8fiq8gik8bie8bi28bhv89ho84hn80ht7zhv7wht7sht7ohp7mhm7jhg7ehc7eh97dh77ah378h673h76zh66yh36xh16xh170h173gz74gy77gx78gs76gt79gq7agn78gk76gm74gq74gt73gp70gm6ygq6tgs6qgs6ogr6kgo6hgn6fgk6dgh6bgc69ga68g667g565g367g167fx65fw62fx5zg05wg25sg35og25mfy5lfx5jfu5hfu5lfr5lfp5ofm5pfl5rfk5pfj5lfl5gfl5efn5efo5cfr59fr55fs53fr53fn56fl59fk5bfk5dfh5gfh5kfh5pff5xfc5yfa5wf95wfa60f764f566f469f168ey67eu67eu65es64eo61ek5xeh5veh5qeg5neg5lee5iec5ieb5ge95ie95ke75oe65qe45ue35ye262e166e067dy66du69dw6adu6ads6bdq6edp6fdk6fdf6edc6fd86fd56id16hcx6jcu6mcs6ocq6pco6oco6ncr6ics6hcu6gcv6fcu6dcx6cd16dd36fd46gd56ed96bdc69da65d862d560d05ycw5vcr5tcm5rci5qcf5pce5ucd5xcb61c964c667c56bc26ebz6jby6nbx6lbw6kbv6lbt6obt6qbw6rby6sby6ubz6wc06yc071bx72bt70bp72bn70bj72bh75bg77bg78bj79bm7abq7abv7cby7cc27ac77acb7bcb7cc87fc47hc17jc47mc67mc37mby7lbz7ibv7hbt7jbw7kbs7lbp7lbn7jbl7gbk7ebk7bbm7abk7abh79bd7aba79bb78ba77ba74bc74ba73ba71b971b772b674b775b576b477b379b37cb17day7fau7har7iar7jap7jap7gar7fat7daw7cay7ab178ay79ax77ay76ax75av74aw75av78at7aaq7bao7cam7dal7fak7gai7haf7gac7eab7fa87fa67ea77da47ba27a9z77a0759z759y739w719r719p70",
    "0o8n0z8q0q8t0y8w1a8z1r8x268v2i8v2w8x388v3i8u408s4g8s4o8t4s904y8w528u588t5b8w5h8t5e8p578p558l4z8k4s8e4r8a4v8654845f825g7y5l7v5m805q845q895o8d5o8h5y8g648e6e8d6g886l846q816u7w6w7v6o7s6g7s6a7r667o627m667o6c7q6f7q6e7n6g7k6m7j6o7k6o7j6h7h6c7f6c7h6f7j6c7i6a7i677h647f637d627c647c637b617b5z7a5w795w785u765t765u745s725t6y5r6x5o6w5m6u5k6t5i6s5h6p5j6l5k6i5k6g5j6e5i6e5g6g5f6j5e6m5c6o596n576p546p516o526m4z6m4w6n4s6n4q6m4m6k4m6g4k6c4l694m664o624q614s604w614z644z665467566755645461545y535w585w5c5w5e5u5d5p5d5m5e5k5h5i5k5j5l5j5p5h5q5g5o5e5m5h5k5f5h5g5e5h5b5k585m565p555q515r4y5s4w5t4s5w4q5w4m5w4i5x4g5y4d5z4961476245654567436a406e3x6g3v6j3s6m3p6r3m6s3n6o3q6k3s6g3v6c3w6a3u6d3s6e3o6j3m6l3j6r3i6t3f6w3b6x3871377434773379347c347h347k337p367p367q347s317t2x7v2w7x2s812p832m862h892e8a288b258c208c1v8e1r8c1o8b1k8b1n8e1j8d1g8b1d88198614840z820u81108414851989148a108c0w8d0t8e0u8h0v8i128j128l0x8l0r8m",
    "bt6rbq6rbo6qbk6qbe6rbc6sb96ub46sb26pb06pav6raq6uam6uak6wam6yal71am72ak72ai72ag72aa72a672a1709z6z9w6y9s6y9p709o709n6y9m6w9l6v9i6t9h6p9g6n9d6k9a6k976g946b9369926693639460935w915t925r935p955n975l995j9a5h9d5e9e5d9l599o5a9s5b9w59a05ba25ca55da75da95dab5bac59ae59ah59aj58ak56aj52aj51ai4zak4uam4sao4qap4oar4iar4fap49ao42ap3zat3qau3jax3faz3bb134b133b432b834bf34bk36bo39bq3cbt3fbu3jbz3obz3sby3wc240c743c947c94fc74mc64rc74sca4wcd4zcj54co59cq5ecu5jcv5ocq5nci5lcf5ncd5qca5tc75vc560c263c168bz6cbx6gbw6ibt6o",
    "5q5h5s5j5t5l5u5m5w5n605o615p605n625m645n645o665n685l6a5l6g5l6j5l6l5k6m5h6q5g6s5e6u5c6y5c705b735a76597754785278507b4z7e4z7j4v7o4u7s4u7v4t7y4q824p824m824k814h7y4e7v4a7u467u417r3v7q3s7o3q7m3q7j3p7f3o7b3k7b3h793e763a743871356y326w326s336r336u306v2z6t2w6o2u6j2u6k2r6e2q6e2o6h2n6e2l6d2i692f6c2c682966276625672367226e1z6b1y671y631y60205v235t285t2c5u2f5w2j5w2n5w2o5x2s5x2x5z316136613c613g633l633p643w633z61415y435u455s495q4c5n4h5l4l5i4o5h4r5j4t5k4u5i4w5j4z5k525m535n555p585p5d5o5e5p5g",
    "gc3sgb3nga3kgd3ege3bgf38ge35ge33gk32go34gs34h037h639hb39hf38hk32ho37ho32hp32hr31hr2yhu2whx2vi02vi22wi52ui82wic2xic31ie34ih37ii3bij3fii3hii3lig3nie3ria3ui63xi442i346hz4ahx4fhv4bhv45ht41hr41ho43hk46hm4chk4che4dhc4eha4bh849h746h445h048gx44gs40gq3xgl3vgi3v",
    "0000k000k00ojc0pj40wjg11iw15i21ah81cge1bfk1cew1beg19e014ds18d21bc817bo15au14a01496108m0u820o780o6o0u6k126o1a6u1h6n1g6g1d6a1968145y115k0y500y4g0w3w0v3c0w2i0u1o0q140o0k0n000o",
    "9p7s9s7t9u7t9x7ua17ua37ua27va37xa17ya07z9z819x829x839v849u859w869w879t879u899q899p889p869p849p839q839q829t829u809u7z9r7z9s7y9s7x9p7w9s7v9u7v9s7u9q7t",
    "7k8c7q8g7w8n888s8m8w8t918z96909b8x9f9c9j8w9l8c9n7s9n789l6o9k6e9i649f5z9d669b6c996q986u956y91708w768t718p748k798f7e8d",
    "ha4xhg4yhj4tho4xhu4vi14si44pi74oi84kid4fi64gi44ki04lhy4ihu4ihq4kho4jho4qhi4rhe4shc4u",
    "ha6whd6zhj6zhm73hp73hq74hs78hs7ahu7bhv79hw77hu75hu72hu6zhs6yhq6xhm6xhk6vhi6xhe6xhc6w",
    "g253g354g755gc59gf5bgi5egj5cgm5agk59gk53gm52gj4zgh4vgh4sgd4sg84tg44ug34y",
    "6f8k6d8g628h5u8l5o8l5y8r5q8u5k8w5a8w54935k936090688x6i8r6l8p6k8n",
    "cr4cct45cr42cp3vcn3ocm3mci3lcf3pcf3tch3wcg41cl45co48cp49",
    "9n7w9o7z9p819o839l839j829j819g809h7z9f7w9g7v9j7v9m7w",
    "gn4pgm4ugo51gq53gy53gt4zgv4ygr4wgu4qgs4qgp4vgp4p",
    "5a685f6a5k6a5p675t665w645u645p645o655k675g68",
    "jl33jp30js2zjx2xjw2uju2tjq2pjp2sjo2tjp2xjm32",
    "jl2rjp2pjn2mjm2kji2jjh2gje2fj92gjc2kjh2njk2p",
    "fb5bff5afl54fs4yft4wfw4ufw4oft4ofp4sfl4yfi53",
    "6p7n6w7n727l737n717r6x7s6x7v6u7u6r7q6p7p",
    "fu4mfy4og14ng64ng94mgd4kgd4jg64kg14kfx4l",
    "3i8u3u8t468t4e8w4c923w923g913e8z3h8w",
    "50995o995w9d689h6k9k689m5k9m4w9j529e",
    "hs7bhu7chy7ci37fi27ghw7jhv7ehs7ehs7c",
    "hw7khz7khy7qi17qhy7whz7zhx81hx7whw7p",
    "8r8k8n8n8s8p938p978p998m968l8y8j8u8k",
    "5v615y646264646367616461615z5y60",
    "008u0a8r0g8p0l8o0f8l0a8m038l008m",
    "gp61gs61gt5xgr5ugw5qgv5qgp5sgo5w",
    "cw8zd493d297de98dt9adi97d793d28x",
    "2v7u307t327s357p327p2z7r2v7s",
    "h86vha6whc6uhb6rh96qh86sh76t",
    "3090388z3j913l933c953294",
    "i12ri92qi92oi72li42li22o",
    "gs5ogx5ph05mgy5kgu5jgs5l",
    "gr6fgs6egr69gq68go6ago6c",
    "eg5kei5hek5eej5deh5ceg5e",
    "am9daw9gbi9gb89cax99ao9b",
    "gs5egz5kh15egz5bgv5f",
    "g162g464g663g561g360",
    "hd6vhe6xhh6whg6vhe6u",
    "5k9550964w985k99",
    "4q9050914z944p94",
    "568k5c8o5k8k5c8j",
    "6a616d616d606a60",
    "5n615r605q605n60",
    "6l256t256r236n24",
    "ap74av75au71aq73",
    "ah7aak7aaj76ah76",
    "aj7eaj7cai7bah7c",
    "bt6ybx6zbw6ybt6x",
    "bb6zbh6zbd6y",
  ],
  Ci = ["cm7hcr7lcw7mcy7jcv7hcx7cd079d073cu71cq73cq76cr78cn7d"],
  st =
    "9sfeoca9reekb79nuek899naeme69q8em249okeqo79p9epx99r4eo727tgm2vb8mpm4kc8itm3dd7shm49e7r3m1gc7plm3db7qim2caa5yfzn8a1jg7a6a39g8gfa4zghu89usg8489yqgixa9xagkg99qngocca3ngunaa6qgln5a1zgpkba4eh4659y1h0i99wnh508a2tghe99vigkdaa0mgkp9a2egxo59veh4hb9yogxt5aktf9r8ak4f6s8am3fb78aiqfbz5anmff36ajnfim8an2fgm8af5fonaadffrp9ac5fud7aeufuq9abyfw58adtg0279gmgobcallege1akkef85alneib2aigegf4almels2alqem08aicel22amjejz5akmek12am3ekq3al2ejl4bmdf3h6bh7f784brzf9t2ba0f3b5ai0fpi8akyfs39ahgfno8al2fo28amrfnlbafbfrqaahffvn8aisfuw6akefxaaaftg1pdajjg11880ellyb7h2lp9c4wegb7aa2wd7z7a0ed7k7a5ud7g29y3dee79vlda669x4da179z5dbe29yzd7w5a65dd85a0ldb75a2mdbu5a2yda14a4pdai2b18ee78ayfecgcav9ebsbazwecyaax2e617axkeasbbgeekd5bkferjbbmyeqr5bimeoy6alag5047ltk5na7ddegte7c0ei0h7d9efjd9wznlccak0efv5alwehi1al5egy2bh3eyf2bg4eu93a2wf3w8a5gf0q7ah2egc576jlq3h7zz6zzbabhf4769avga5d9angamc9aygbkf9cfg9ycbhqfpe197hhlcc83g6xyc8gz8fnb8d68h9c8dq8l5bbg4fv339y2fmb7a49fum7bkyfff0bngfrz7bn4fy75bpdfzt7b8remh7b9deu857lrd3td7e8dh4ba5cff03a35fed9a3qfes6a6wfgr3a0sffk2a3mfhe6a2ufhp8a33ffh7a2kfg71a3jfg41a4gfgl1a1wffn1a1rfgj0a1cffz4a5sfgr2a5nffm2a63fel3a62ff20a1yhb83au5e6yaavheau8a0zhbr39dqiusd9saec1c9rze79c9q8e98b9p6e8nc9rbegnb9plefvaa9ufso6aalfok7aaxfxq6as0ec64am0en54amvf5x18jqldkc9n0ghg79mkge267rehjhd9o5ggl47v978vb99cgzhbaa3hcea7unet9easueizdauqez4aathf3xa9sfh7gk9kzh9wc7hmguwbb2zerqa9fsht9babdhu2c8vcn8yc8van8qd8vfn8zh8v8n8jc8urna7c8uzn85d48v9ndcaid4p2a9j658fh9it59ek9v74gdh9gr4uqc9ka4twf9ua4gai9vv4geca0a5svia2a5t2b9yn6l5h9yl6lqc99a6xlg9b76gbc8ys6b5g8ys6cna98e6jpi9gs6eij7lw8gvf7nw8fud7qz8djg7qb8hcc7n58i9ca4187qja5f893ca5q8eyba708aega848f4f93u7kza9407o3e95z7m8f8xp7pfg8yz7p1e9547ipb99s7a2a9n56y0b9n37kfba5d739ia7f70lea6t74efa596wjca6s72rga2a76oba5s78fe9wf79mba5s797c9q07ssf9ox768b9nu6ygf9tf7x0b9sv7zxga9h72xeacz72gda3o85zca5u86oca377owba18801da2s82ah7q98wch7o88wyb7qy8puf7q48qic7rn90db7qk95ac9rgdigd9vsdlx89qddgvaa8adgjba5ee2td9oqgneh9pkgv399rngqw59rhgtgb9ptgprb9svh2ja9rch17b9jagp4h82ghbbd80uhapeak5eme6bm0f2u6bjlf60aakhgcuhax2gayfarafz0gap8fxubar2fpabap3fltcapfg7x9au9g9i9as9g7pdaimg977awcgg9aan5ggmianfgthgao6gtpgapcgs9dajwgq7b8whi5xka0uj02e9wcj4ld9v4j71fa1xjbnea5fj9kda55j98caaxdg9fa91doleb9ddit9b6ids6haveds4gawxdouhauxdqqgb5odbq3b1rdnyaaxfdl1fb6gdnv99v5g1dda51g00a9uxg8tc9zig75d9teg2s79xggwze9uhgqng9s8gk6ia2kgl3da3yh0ke9wzh5g99rsnq6j9tsnree9v7nqte9trnoej9punonf9pknuxc9nunt6kax7dy0iawzdtagb07dsvhb3fdr5hb29drul9zygdbaa4ggekb9szh2ic9udh9i9al7f67aakafeqbal3fb5can9fkccal1eg59ae1fmzaafkg40aai9fj8cakpfkwdah8fr2camcfwyaafgfyhbagag1xfagyfzja4zm9g8h4u19ktg7yd784aa5fd8mja1wdb648sxgtpe8l2h06iawvebagbmwepq4apdfd79aodf8w8bayfzw6b8ufrpbb9efotb8anhalg8r9hhwi8wnhppf8zohqxg9gcjn4h9e4jljg9gijlsf9b7jj3e9e4jiqd94yjbafa8zjp4b9jcjeff9kvjjcl9l0jg4f92vkh1f926kg7ea7bfhnc97ihkedadxgzgcabjhc17acoh8r9acgh7pcabzh6obadyh4jbb5rfkl7c9vggu7c5pggr8ca9ggx3bi7g1z6bjxg95eazxgcq6b2vgje5bbxh2w8bdnh51abaxh938b7wh9ocbaagjd8bdygk07bdsguh6b02guybb92gwabbaigpy9bahgu1ab70gvqcakygyeaal7gw4ealqgzccao9gzt9ampgywab5fgr18b41gudbb41gs79au1gqh7adjgyd7ag9h0q9b46hcs7b0ah6o3b0yh0iaawph4x8b5ai0iaaw8ie1ab15hq4ab1phmodb1khqocb8thxjhbnpjhpbb5ukjdab40kkoa90t5qha8x15wig8n268yb8yg6ayh8o06c8d8fo6b5h8jg62hf8j1640g8ar67md8d167ia8fx68xk8im668c8ed6e7g8g96esh88j6qpd84l6qpa7j7e7mea6pfi9b9j8gm9cb3dfgxdb4ffdwbb0mfap9atvfcjiausf9tbbjri9na9vgnnkfa4bnmud9zinlugaz6dc97az7d504ae1eqcc9ykf7k89xff4q59vvf3gda42ezuea4sf57a9slf0x89gfgnli9f0gn9b9f3goakaeteit9ag9ejyaah9el8eahzewsbagveu0ca0nlfhf9owluoh9zumtni8yvmymd8q4mpsf8rsmvzgahied0aahve7b96x57u2d7dw89eb7hp86vd7pf7evd7pu7e1g8046yrc7zg732d8mo7t8c8i680wa8bx7xhb8by7y9g79z847b7b7815b7sc84bi7nn84ea7r488jfayjejpfax5egpiawveerlawdefxjawxefimaq4ejcgaraek6gawiemefb1leiucb29eg27az5ep6eavleqndagdf377afxf05catneqh8aobeqagarfeqkeaq2f06aav4f1waav7evwfafgfa2aarrf7yabj0fzs79momdea9v7mnhk9ghmfqj9a8mjrh9chly0c8vjlhjb8qwlv9f8vklq3e9usmteha2rmrig9j9morga65n7gea03nawg9pzn3mk9yzmz6f9lin0rk9g0n3rh965n8ge95ln8td9mbo80j9kdnzrea6enn7fa94nvrh9leo8cf9kno9rgancncwbaiwnk4dal5nfdf9ryoh7f9rvogkc9n9odfh9r3ombf9opoo3m9psonhf9rjooji9p2on1i9txopyf8706zkb8fe8g4c8fm8gvc9cejudc951jtyd96kjtye96ajsqf971jqdh961jrhd9aejtbc8fhjj8m8kejqndaosdoa7ajedwx9alwdujdaardrocaaweb5ca8me42caa3dw87ah6e4keaote3featoe3q8al7ecrb4co8fme4ea8d8h44088wf9vffpuh9zdfnra9onfqq9a3qfrs8a3hfvv7a7dh6pda7bha669ctgkrdbpvg484bosfkh998shyqb9r6i4ob9o4hvhd9euhoyc9k8hnke9afhkje9evhcsg9dahgac9lchnpc9rvhmqg9u9hd0i9wwhiqa9o2himf9qmifed9u3ib8d97vi6tc9dkjr2c8zhjnci92ojwtb92jk44c95kk1pb93vjzpc91fjxrf92ejvrf94xjw9d95ujw0e97xjvufbarem45b8letk69iuh8afahzfeoa6jtal0d58aaceb5b2aifb59iaanc5claida5qj9k2e4mw9xui4nh9ucb4z3a57b4yza3ei4zi9x0c54l9x1a4v8a3nf4wga3mb6nrarxc67ob4gc5c3aprd57cahbc56sajbj56oajpj56gak9m56fan8e57uanxca9d7j4cabw7szha9d7mbfaap7oegag48cabacafi4cag2fgo84e58lrb5lo8rwe5vs8tue4df98ob4tn9cnf4hv97ve54baari56cadpb57ra7wd569aarb55ka9sh55kackj56maehd56ta8jh56va7of58ua6zd58k9x9d5baa3ya5cxa52a58ba19d55ea8mf54ha6kb6bhb6qi6bsb77k6azb6pc6c7b63ca2gfe6aa48ffsca3bh9tcavre6aga3dhblaa30hgrfa2qhpve8tdktsda8kfx5aa73fsrfa8dfny9aa1fpg9aa7fyt9amuf559b1mfw9cb85g3z9b4wfyna8v6kz7eacuf9scaunebij9dmglie9nlgib6b4kf4ya8rvn6ua8vdn8qm8vtna5h8sgn78c3rkrdva4k69lodaca6r5aae16p0eagk6mgb8lq1p2caba4vxbam54fcban84gkh9vg4j3i9kw4ruc9qx4okb9yq4i6b9wt4f6e9i74u1i9um4jxf9jk4spp9ju4wbg9n24lgaa2o5s6e9wc5tdaa155rob9fr5neba4j58zg9q66mgca5f6wdea4m6hqa9xq6wlg9y76rjg9nu6dcb9gb6s4a8z26bcc9cg6cjb99l6mma9ia6e7c7r28n3c7om8jsea4t89ija8f8dwja7f8ckfa9g8did9ib74ub8xg7ozc8zw7kab8ym7kte9297ove94l7lve9737juc8ym7pen9kc7gea9h97fpb9g77byd9mt7j5fa1f730ca2g70tba7o740da6172qf9x16y0c9yt77naa5i75fia447bjf9yk7d9i9nd7sve9ow7ipc9qb7p2ea437lki9pl781b9rh75cb9xs7xyb9we7wub9tj7pyda8p743ba0f825ca3285zea8x86mca6y814ba9q831aa9p7sgca107yvda5181uca717pkda4l818c7q58w8i7mp8xid7rg8pzf7mt8oob7sg8ynda7i7fgea7h7a9daa378faa9h7fjfa9c7a1h9sbdp9d9s0djqh9uxdlgb9thdcrc9ycdqtca0rdku9a2vdn79aaidlgda3tdg9ca7ndlsc7h6dxra7mzdz7b9j3equca48dzhb9s1elj89tlendb9raeptb9qiek779nqekj99k6eo2d9lmekeb9p4eo2c9mwgnpc9ptgwec9nngq1h9lzguc79lph1o99o5gzhf9kigq177upgjfd81gh8cc85lh94dakpej0eahsekxaboff5h1bmjf7p8bbff5h5bc0f168biof2aabgsf4y9bbfevq7bixexi9bxxfi75be3fau4ah0gjk6afkggoaag1gpdcaevgiqgajjgekfam3gb16avtgclbaumfwxeao7fw0fapxfsnearmfv2eauzfuddawafso9arbgd3faoqgdmeafzg449aqrg34favjg3l9ay3gh0aam5gjlbas4gsg9apwgurbaoxgx9harpgk1faqcggveak4gmac8xni7ec8tbi6ug9zri30aa0civbaa4zijoca1fixjd9yij1nh9xziysga2mjd2f9vcj9uba0wj7oca1ej4fea3zjavda3hj9cb7j0lkpc7g7lpdc8hbllbb8ctlkcd88rlmjc81wlndc80yln9c80fln4e7zmllaa7ztlnhg8k8m5ic8kgm64b7yklodd7z8loke8bnltfa8acltje8jtm0ma8kqm13d8i9m2eb8l9m0vf8cxm26c7x7m85f7v5m96e7u5maqd81ym7ya843mabe7qsm5ge7sdm8af7qum0uf7pulzxf7r9m3mb7qrm3fb7nsm1oe7nim03g7oom2ef65ogamd5z6g1dd9updra99ugdtadaafdftea94d8aa9y0dcnba7zdp9caacdqig79dg98d81lgfmc88cggud8ck875c8g18a4cb81dj68bcrdq5dbandmg6bavdnocb5mdslgazkdrugawqdphaauudm7baz0dwcbb3bdv3fb6sdbn9b5fdf71at9dgl3b3vdt1cb3jdnjeb6zdm55b4sdut8atzdkge9uvg059a05g1hea1jfxd9a5rfxtba3vg0fba3ag75ha36gbta9xng8vc9uxg4sg9xbg08e9uxgucd9wlgueh9skgkwk9qcgnta9rmgohfa2xgnj9a3wgt7ca0fgqvea5hgnraa0wh2pga0fgxpba0ch7l99vcgzri9xnh3a9ayndz9cb07dzmd7jgk6yb7o4k3ca7guk1wd9minqvf9rlntlb9j3nnggav7dvjhbdndk97axrdsjday4duueav4dt0gb01dvbbb12dsrjb18dpyga53gcac9u7gila9taggab9xgg5qc9s0gr49a0pgh5da2th7q99tnh1699v9h2af9wyh8kg6z8gg8f76eg9ue6y6ge6c74agfdb711gixg6zzgixcai0famdamif8zbaitf9gaamqfd55anmfhqeaihffzdam1fk3eal3fg2a68bghgb6nuggua6ucgcca6kgg69c6cfgn5a6oqgrqj6tvghwbaw1dzm6aj9eeheam6eh3jbfveu66becevy8b9nez95b9oevca9wjduofa11dvvd7x9g2ya6rhg6mead5fq7factfzx9ajaf3hbafufkt9ah4fiyfamnfy2bamefpibajcfs8caemft4cagtfv5faevfwceajefysd6kf7nwc5q18hhb5wq80ic57e9l4a7v5799a7x375zb7xw79ca9t5d8b89sud9z6a1od8ma82qcmwc835ckzf7jwd0xca8ifgfa8z9ha4g92gh3ug9c3h1yd6ttgric70vgl7cb1xec2bb1ueeadc93f5w3ayqea8ibriede7bhhebt7bjyeocabj4epn6bvuery1bdffjw6b8sfiodaoyfd56aqqfc39apdfj1eaq4fj0ab6nfqcgbbdfpv88t4hjff8zfhr6n94zhfoe910hpxe9psjmed9chjmuf9bljk1d9cwjgwf9f5jhvh99ijc8e94mjatd8yxj60ea3qjisea2mji7g9hnjc4i9efjcya910kfrb8zkkmgd795lona7d2lmwj7dpln4g7ezlmtf73nlsxd735ltxd73olv0c75jlr6g7ctlugf7c1n0qa76tmm0c7a8mome4cefcod4ytg16b4vufzab4x1g2ze4z9ga2f4ygg5vc4whg5taazie8vf9nadflf9nsdewb9l2dkud9mpdgj89l7ddqh9hpdauc9eqdjne9k6dgki9ied8ddamog1jcahjg2b8ak5g6cc53pgmbb4c8fuje4hefyoa4xvge6had1h4uba9lhc3gafah8n6addh9w6b6zfks6catg7y2c6pgf77c5tghj5bg8gi68bf3gb35bkhgdu7bjogh38bnqg4c5bjhg7pabh6g6w6b0lgdk8b3vgfa8b77gga7b7dgj97bv3gjc5bcyh4h6bggh3c4ba9h8qeb7oh548bbzgrq7beggpx5ba6gf14bergil4bcfgl67bj6gzf6biagtbfbf9gvudbcvgxg5b5ggorfb49gja6b70gpqaaxlglz4azfgmcaaztgyx7b7ugwfab7ugs9fba2gqq8b97guweb6lgrzbazmgsg7b1ygpj7aj4h3e8anvh1b7amkgzvdapyh086b1ngtw7b3dgtv6at4he4bas9h996apjhcdfat3h828av1h4o6awigt4eaupgvh6athgtu6acjgwiaadtgtq7adzh168af0h29dagqgw66ahdgzi8ajqgua9b4hhdifb1rhac2azqhau6b6mh2z6b4zh4f5b03h3a5b2hh447bakh2tcb8dh4sbb29i7dcb9si2qbb6siixcc67jvccbbchkzfbaqio2dbawi1gabfghy7ab2nhpaiax2hg4day4hd04ax7h7wab6ihxcbb8khvyeb4phpobazxkgmd75phega8qji90aa6uhm4a9uwnu2d9pjnp6j9pyno0e9mpnn4e7sgnejf7jtnf3c850n6yd852n80d837n64f86ln6ac813n90e82pn87o82fn84g7kpnh2h7sqni5c7t9nj8e7mvnkqd95r64rb92b5eof9185fzb96m5e3h8p95z2e8qd5yaa8jg5rod8gt62xi8bw604c8hi5zwd8fy60he8lr5sof8dt6syc8d96die8h26dkc8j562wd8ke62oa8hv69qf8fl677m8h168pe8by6lfd8cc6lqf8j16dce8ek6esd8k86dfa7wfdgta7tgdg8e886dbvd7u0ey1b7c6egfk7bsej5h7mqerkb7n8ecpc7hwe5bi7gye6wd7i5eagg7ixec0k7i0ebje7hpe9ge7j7eaih7ise8oh7jle8og7jte6xj7f9efnh7ugeoba7qnencf7qler1e7edebsf7h3egia7llejob7u0egcd7y3eh4g7vteeie7xsep1a7xreqob7wle7oa7qjewvea40fja99gqezmd9h0evcd9fdew6c9gafhvcb3jfm37b5gfbhfavzf7bib2ef0dgaybf32bazlf6yib2kfc3ab1kfa1gatmfcuoattfbvhavdfhedb1lfoefawdfmpgaszfl4e840m1ya8h8lrqa9vonl7ea3snv8aa3tnnofa08njuca4zns3e782lhmi71vljre779ljde6x6lmsh6a6mumh6usodxab37ded6b40de86b1zd6v9b09dbv3ayld5k1b4rd8g3aeheoocadeetybaeles9badmeriha3nemg79yyelafabgeowdaazeomcaacerj7aaqesza9y2f64aa30f11ka49f0z8a47f6vha56f38ca24fafca2wf9taa2jf7vd9w4f37e9v1euk99szf2hba7yezifa7nex78a6yess8ab4exiaa9reufcagyemvdagteycdaj6erkaai0eqwaag8eqjf7azlg5b9n8lyrg9opm4cd9wylrtc8mzm9qe8lomb2j8umm88q92wmb5ba1qmuri91umyeb8vnmx0g8u4myvp8wnn2mg8zzn09d904n41f9idmsfc9bzmz6i9dzn15l9hemtqc8mpmj1j8timukg8rxmqkf8rumlzi8q1mkdh8uumk6d8oqmm4h8mwmfzl6gem8wb6etm4ye6ckmaul6famgfb6ewmcne6exmb4e6dpmexc6d9me2a6h1m2vc6gqm55o70jmape6ivm0ij6oglxja6bgmrpe6b8mppc6chmmbd6ctmlmh6d9mkbb6ctmhrd6cdmj4e6blmjjb6a2nbha6nhn4dd6o7n2heag7e86eafiebwg6ry7qwa6uh7tme7df887c7e7896a7u289hb8ni7okd8mx7rcb70l7qpc80v6z8e8ii7xsb8im7z4d8k87y9d8d98jid7al81sf7bd81si72h81yb76582rf70b7wba78r7xze79d80bc6z07uzc7sl85rb7nt82me8q07lec82l96ce7qlf2rda8ifa96aawf5rdackf2e99bjga4g9azgdmi9c9gb6i9dagcef9d3fzna9c9g8nh94mg9bc931g9od96sgadh9deg8fd8w9gefa8yngewf8z5gckb8zrgc2i9cgghwd73yg1rc85dgxlc85ugutc83dgvueauwefoiaydeh6eawaeeulaogenscariejjoancehveauiek19at4eixib2rejubaz8eideazhen0jax4enkbavbetjaavhes6ab66em7ab3nepneb4xeo5eatveh4faqtefdjas6ex4caq6etocamxetpaatset47ascenncaphertcaeneyh8ar8f3a7aqrf91baqof65gat0f3saaxteztaazkewbdaytesaeawmeuhhagjfbwaasffaphbiyg288a9akrpi70kly7e9ojmerd9lumc6c9z6mkai9wpml4e9ommlfj9qimm7i9dumooc9c7mjog9a6mhqe98imk8e9bwmoec98kmocd9h5mftb98bmipe8xomlzf928mcob93dmlmo97olz2k99alucf8paloic8qxlxlc8x4lweia3smzlh9wgmwnh9xymsrk9wlmxxb9wymrgc9sdmtca9sxmq2i9p6mrei9pvmpae9kimo6h9jfmqfga7infyfa5fn6iha4mnk7ba08ndke9qkmyub9tumzqb9r7mu5e9ofn3tj9u1mv2g93pmv8e91dmrgh953mzpl97bmxih9g9n52i9ktn1xm9m3n37j951n52c95on9dh96hn27g9l5o49d9ojo5nc9omo8vc9i4nwceafiniqhaafns6dadfnjpcafxnd2babgnprbacmnlkd9k3nzek9h4nz2j9ico1khaqwn7dbajjnoqeajno0vhaline6aaltnolaakfnrpaafznmsbai0nlydakynv5b9oeofwg9mgof8h9qooj9e9n7okfi9mgoilka99oxpca8hot7cabtozqba9zormc9q7oeee9l2obhg9r1oq8f9p1okyd9syordg9u1olqd9wbopse6m0fh9a6hkeubc6jff1ad6fafqkc61cfzpb6j2fyya6zdg5tf6rvmofc81q6vua7ywclqd7o4dtog7f7dred7c7dsjc7exdvac7dodw1d9fnjqce97xjofd97ojttf98gjtte9l0jmjc82zjy9d84yjy1d80ajv9c7zxk0mf853k2ed8cbkbod89bk77f870k5id8a0k2of862k36e8dajzrf8dvjwyg7mqjspg7oejs5c8h2kimd8lnkd9f8nrkfni7wxjtof7yhjx1c80pjpwi871juwe84gjs6f8bsjvcf88ujn6i8fjjt8g8j4jn1i7ufl1mb8uvl1rc8x1kz8garxdrf8aqmdv1damndmn9aofdjicancdwkcal5drlgacsdxr8a6hek97a8mem96a9tecggaafe4x9ab5e6rfabre83cai4e5i6akie4t7amse5x6alhe9zcakse2o9almdxyean2e1adaspdz06arbdz0hapke1x9affe097aoae7c8aqte77davje13aasme2ecamnegfdap8ed8eaqged6g4mt8duc4co8d3aa02ffb69u7fm659szfmb29xafjh99uofjl4a03fmaba07fhx99ynfxr59wlfwm49wufpl9a1vfmi7a45fpf7a4aft479u1ft919shfzt39r8g2e8a74h3r7a5hhd5c9t6h6lb9r2h5xc9m4h9c89h6gl6k9gugm2c9glhaah81ogxna7lpgthb7i0gv7bb4uewe8b47etrdbqyfvjabspg0xabnng2a8blsfvb19exhw2b9kehvae9guhuzg96hi13b9thi59c9sbi3ce9rbhxgd9rjhzie9ori09b9pghtlm9fyhmnf9j0hmbg9jfhgzc9czhdsc9c8hgjh9eghizf9g9hfbf9nahrtc9kohq2h9s5hf0c9x1hcxd9tyhgec9oshe7j9jrhc2f9nuikda9t3ieic99pjm2b9a8js6f8wfjncg8xnjjpd8ynjqjd92pjoqg93ujjpi91ljvbe92jjssf8xwk4gc90bk89c92lk6pd8vvk9de8wpjy8j93gk1zf962jzif94rk0mj90fjzhe9a8jwtj8oqkpcr8zkkstb8n7komd8phkplh8o8kmlc908kpqh8xnkn0d8ykkh6f8ndk88h8l4jrld8qfjqjh8qvjoff8s9jyrf7xwjzvc7w2jzqb7o6jvig7ukk1lc7xnk1gc7m9jvth7kqjv3e7rxjzvd7sfk0jb7qojttb7ssjuti8jxjikc8qjj9jf8mijgdh8qijhsd8rvl1kf8s8kxkd6meev7ab6zepi5b7weoucb83ejh9bdjep94bcfenkb7ikdb1c7f3dfob7e3ddna7b9ddkd7gpdmba9inh9me9g7hbei874953c6ufa6vb5fzah3d5e1afad5fwalwg5o99o8c4nb9hfb4nh9xyj4gz9v8d54z9vrf50o9rie4z49ojg4vaa4sf4sra09c6dxauie5sxauwd5odavgb57gahjh57hak0faq94gacacv7zkbada7qmd7d9eoxf7awem8c797eljdabxfghcaadfkueafpff5e5ooa40f4909f1i4it9etc5c8a2tg57ba8cf562adgg583a53b56ga5fb7bsenmb78keo4d7faepob7aqey0d7icexqea4sfe1ca6vfe8cawae4zcau7e9jaau2e8df9s3j1ud9ptivxd9j8j62b9s1j7be9lojboi8urkv2f8v6ktvc8rmkved5fn8tdd9nrdu8d9mxdsce9sgef6e7sxe46a7oye0od9ipef2c9qhdzoh9ocdwea9pudw9d9msdwec9oadzod9s4ea3g9r6e3vh9r2e6ua9qre3pc9qtei3b9odeikcaaff9ica6ifv09a7ufv6caamfsdba9pfva7a7gfn17ab3g1caaa2g1ifabtfw5daksf2teajiezraao8ezpfaoyexc7amtew8dalcerpcaytfwhbaylg5bab3qg88gb1lg53db5gg8ibb3pfu8ab34fq7fb4ng35c8qdkrse8p2kv1d8r7kx9g406p3khadrfbwcaeyf6eaaeef7qd8sokrxb8uakpfc8xokr8e8lml8zc8bel9yc8enlbua876lfgc87ulfbg8b1l97d88ll77e8iul7ka8l9l85b816lgrc9jcj89a9mcgfrc94ckddd9u6no6j9u0np6k9ulnock8c08qyc8ck8pifb4fdjk67ogheiaac2euk57vn8kpc5dkibsfakxemg69figlxd8d68kfd8svn6rj8r8n6kh8uyn82j8u9n7mc8p0n6oh43nrcvd43trdidal84fvj9ju4ron9yl5ihaa7l4epaa1t59wg9mi6rje9uo6dng99w6sec9eh5zna9k76afa9dn6e5c9ja610d7jy8olb7px8jika618a4ka668dml9j576ul9b873fe9ai75qe9357icja0j6z0b9q77qcga0f7e4j9se80yma9n6zofadp73kda1q84eg7p390jg7r18xqfa8p7d5e9rgdejf9t8dm1g9qddh5dbehezdabtwfc04amyglpj9tfj2vca27jfeja3wjf3ja1xj9eg87mltne8m0m1zh8h2m1wd8iqm30e8dym1ki8akm44d85s76wc85273hi9vidsvg9ppdh99aadd8mga7lda5b8gw8bfeb9fdn2hb6rdrjjb2ddnsjax0dn7ja3cg8iea3ugycj9tinotkb3fdrpm9t9gvrha8ydrfec28ezd3c7yf813c4wf0356f87q8i5qy8h6e64b805b5xe85uc60h7xrj7wk76oc9x1d7aba4bd82lay8e8gkarted1abj1eao6bhtebscbigemo9bazfid9ccdfok18wfhpri8y7ir7c9d9jj3o9jbjizn97njf3h8wxj7pg92zj79g9mjjgzn724lw5j76glptk4xdg2pp4vzg1ok7o17q5dbgigb1dbagg8sabx9gkl1byfgk11bxdgyndaxqgojgb4kgsjhb0hh33fb2zi7geb82ixifbthjq2abpaht6ebuki15ab9xhj9haw9ieveayjhksdbn9jsqebfoj5mbax4k5lcb3qkkve89bi29da9ehjyh8toi9lc8rsidme9q2nvdg9ornv8k9pnnt9o7ylnfrf8axna5bbx4kxfeba3l9vababkveba90o55caboo2qcaufogme9ej4w2e8wm63fj9e15o7l94c5qyb8sr5t9h8xn5h8e8rw68ne8ms5zvj8ex5u8a8c06pyg8ek68cj8j6655k83e6rpd8de72qc9xpnkhla62nwjia2znuwda0vnqajay5d8hda35ejtbaf7ehbm8tkmbxm8vplzdj8yxm29j92ym50j9bmm94m9kbmwbk9d3n0tj9e7mvkm9hjmxxk9aqmx5i8pxmm7k6ydmyea69zms2j6v27oid7fl823h7mc817e7ht88vk8oa7fid8le7vkf8hz833e8k1806f8db7vkb7ac831g74q7z7e7t985wg7k08akj79j87hg8o87pve99dganoapielkpb1gekgjardeqsj9cildyaa5xkjbia5xkaehad2kiziagnkfqea4bk2xi8cqmc6g8hpmegn9i1m5bc9lim5nj9ngmavf9q8mhsj9uoml5ja1cmmqn9b5mmcm9bamh4j9admn4m9cmmrjb99ymrqi93bmmbk8zemi1k95gmk1l96nmi8m985lw5l8zrlqlh9g3m23g968m0qm95xlyhk91wlw4j8tqlsxg8x3lmhca0xn4ak9zsmw4ja3dmr1ka03n0bn9q8mpnj9nsmmmj9mnmpnj9llmt9m9jpmmqj9f9movm9o2mofk9m8mkcma4one6ja1jnhjja2znboja48n8eka6pn9yja4tnfrka6bng3m9ocmvrl9ryn30m9qkmxcm9nvmspl9spn7be938mr9k8y0mrbm98lmu6h9ean59l9fen3rj9eun7wk9bhn7fk9brn5ml99cn6xj96wn4dka96njlha9xnhdhagqnd6g9drnyoh9k1o4tha06m4pda3zmm4eac2mucbatlnq1aah5nzxhaminu2jaljnxyjaopniwaadunvzl9rkofkha7normcabkovig9mcobhm9ofonsqa0bop5fa3foqvfa2poq7ca2jot6e9uuoq7fa0cos1f9vcom8i6vmo0ob895k8gf8c1k12l8fokfkf88sjqbe8frjj5j8d4jspg8f0jnng8hhk0ai8k5jw2j8k2jnph92cl7mc8uwl4zeanmdrddabgeg6kab6e01jahbdzhcaupe4kkaoyehjg3yf8aee9w7fkdca5kh3nc9qiha9kbvbfo87bnffvaabrwg6p7blxfltcb1uisreb22j8ubat3jiocamqj49ab6gj8ae9nqiedc9a6iaki8ucjkth90bkbmi8qlko2f8qykpxc8uwkg4g8m7j9je4it9eza9o94peg9v04gcm9me4rue9ro4hfb9rw4i4cacd4e2ea6l6tec9ta6osda3e6fge9g566zb8y06d6d9fv6jab7tq8igd7uk8gze9mg77fd90b7pgl91y7iri9757myd98d7jbd9007kmd9iy7kae9h37ptga316z6c9vh74sc9w779tk9vp7dae9nt7nhka467nzfa3c7lyea5o7fxha127hhl9nf7b7e9tx7s6aa8h874ja1v7ygh7ki8zcf7qh8o8kabb8gvbaam7etb9mjepsh892h9ta834h7bjadmgiw9avggkmfakugsch82ehohea68iikda5gikgc7jwlhac80um80c7w1mb9g7v2mbec80ambaj87rm6uk7shm4ri7pxm1tk5xjg2wc5xwg3lg5fzg6ud5hbgepe5899nrc5hlanfe59jajjh4nk9qke4rj9ued4uq9tsc4wwa4ck6dzause60aax9b5djarxm6eab74k6dxb4cg586alucasm4o4baa57q9ja7k7hcfair8ahb5ln8s7k42c9bpa4di8rpg4dz8x9c52u8umf5b39zvcawae89k9qej6ud5k28pjea0jg8th9shg9aj9xlgmliaznga4h45up84a4aepj5e3zzp14c9t0gruk8xjks0f8a4lc3f8eal8hb8hyl7ob8wglejb8nel8bea5pditf9mhgq0kbg9f3fabtif0p7c6hfg63bvbfg89bkaf90bajzfpkf7lcllpe7hgln3f85mllza84dlz7e6o37oia6e57tvc66g808c9o2dntc9gpcl4d7k5czec7wzcmrd8e2egja9zxe3dg820gh4f810gmad8avgica8b7giec7ylgeqf7znghcb7zvfufe7slg6ic8cnh62d88zh68absbefy3bntep634q5fstc5gwggze5x2glwa4yrfzoc4y9fv5a4vcfxyd4t6fzla53ng5td569g8oe4swg9jc4nrg8fj9pedfvj9akd5aj53qgm6b4iag3zb4epg03c76oh99bc4kge16bmmg3vbbqtgj95bnnh4y4bvlgts4bcdh1xgbehh1qeb06gy4hb15go7falzh54caungpofae9gsxeb9xh09fb79ihpdbc3iikbbbxhzviaiphata7l7k3ab7owk29e7rjndmk7u7ncza7p3n1uc7zune6j843n6vf80an86g7i2nh5e7lhnidk6y7h6rd6x0h64e90q62ae86icm5d7lle8nj7oqee7f7ssehfj7plekpjaxtfe2jbj2i9oc6k2gf4c64cgn1b6jxgwlea5pdtjibebetah96id41b72vligd768lj6f6zllpqj724nith6cememi6n0nckc6vhn4vib0ad82aaddekti6x8go7gb98fxna7cfldub7bilnse7asloqi7f0lrzh745ls1j78nlv0g9bzn1vj8nwmnhk6wmmxfi79vmzif7e8n03g7emmujh74emiod6xrgkjg5evhinf5jihp8d6fbm9le6dnm8le6frm4jk6ngls3g6xxmboi6s8m2vb6bbmntf6ojmr0d6oy7pwd6mx7rzb6va7nrd6td7tjc772fexd737en5c7nffb3c941g9fh8tzgfjf91nghzc75og0qcavhefbkbg6fy7a9lfm9zl9eymjhk9aum15ma4kn3oj9u6nb6h93cmpsk9imn5tj99in57j6g7fhpe6htew9d6r1g44g6ong4yc6psfvze6ekfp4d63jfyeg69rfthb6tllvth7gldrhm7bqdrafbg5fs36824k27i85zjwrg87dk3hh7z1ju6g827jqwh843jtog863jmziai9dst957n8kkc44b8bpc4b38fie3ta88vc47l8cxd48u8e4b829dkea9swflf99bhfg6c9cpf63b9h0fmwb9f4fqke9o5fttba9ih1y99lognjh7sxgy3d7nwh53c7jcgqbb7lrgx3hc0lfsa4bykfurbawfhuld96cht7c9a9hm4g9w9hm6g9m9htjk9qrhqwh9lihiqj9tmhpvi9hcigif9qmic3e9c6imse97yikzi7mgjx1g7qsjwmdba0eode7oadgcc7tgcxub7secsab7pycw9b7h5de3e6em98lk6da90we6ioa83d65ka5ve5kdaoqa5f2a6te4j09pqa55a9xuh4qca2td6pxanzb66xb25d5vjasob5syavje5g5asra59lap8g6jlb0ad63qb0wi76y9xqlaj67n3c49w8m7a4qx8tad4ob8qbc4su8xhf4tq9c5g53gabbm57za3of5cza8df69bb2ma6b0b42e5zmf72b5znexmd9dtdptc8w8e6fg9jxe40b9hyecub9eteauc9muebxd9mce51c9qieb0e9oted5ea83g0bdb7bg7vf7wllhxe7zfp23babiegl661ih84b8nnmneia83e097953cmvf9sp4h1c8smn9sf8vhn9fq8pwn5wn8p8n8ic41arhbb9ks4u6ma4e88oka9x7wejb2kdprn9fcjm2m9u4nnso7fmebml8txn00o9bim2tn986lztm9homklna37n7no9u9n98n9mwmyln9cyn72m9l8mxin9dqn66mabtnnjo9bcjtak9gvjnwj8b3jquk8h6jp9k8hkjkym9d2jpxj8wqk7cl964jyrj95mjv1l91hjwpm93hjwuj96kjvul8s4kk2l8ysjx5k8nzjjam8nzjcolaeu6pgjah75iiaak86f5cako4emcamf4tufagr4fch9fh5bzj9ll4ngd9s34nbi9xy5sxh9zt4n6f9ni5nskaet4eae9yh6i9b9yn6l7m9qc6hjkaaz6fbc9ga6nje9am6uug9gy6dmm9326dge9a36cil9nv615d9ea5o5j92f67lg7lt8eaf9fw78cd9al7dwd9577lyl9a97l5k9ey7mpd9kg7mxga0f78nm9l37vhc9px7ewi9ub7wvk9wj7l9b9z47z7oa9l80hi7rl954f9pjepjf7zthacjasffqrjaj5g9bkatlg3mfaoogl8kancgt3kaswgopma0iiuzfa7zihme9ynisme9uginrda3bjgyi8jvm4cn86mm8pk5twg31d5z5g2ic5yfg2eg5kefvuc5k0gaef79aemznazsdqoob5ndfjh9wsfzfoa1og4rma4ogoyi9v8ge7k9ssgm4l75qgdoc6slg7ij9v8dirf7zhefqe83eeambacsg3hfc08flk7brcf849al1g0lf7nfljyc8e8liyg83olrmf6jj7o1g5oe8dbj68t7trf6ar84zf6nl88jh60g834g4z49oafa7ad7rgaa5dnvj81bcnae7zdfmcc8u2gxyk94ugpjh7bfgbqa7oigbyc85ege8o7ymg7ygayoe7vlbfjei58ahyf0bfanrf7kgceafpt08w9hv5m99yj26j92kj5hg4ckfe0b4bpfmdc5p3ghab5xyh0la5rygx5g4sbfy9g50gghgb6fbp8bb7lf7j1a9mddqpg9fsd6cfa7zfdjc5kcgqhd4efg1ffaauh96faf5h4mgb5yfgygbeng2pdb1ygjngb66gd1fbpmgjgebbygnpgbihgywfbe2gyrial8gybkab3gydfaf2gwcib1qhd0hb5qgychaxjgwvjb2eifugb78imokbgrhpzhbewiilgairhlhhaxui53haxahfvjb4xhmhib6rjjwlbcqiy1hb3bklzhb7qkj5haacheye7i8k43a7h6k23b9qynpym9npnojm9ninudp7h8nb4j8ckn6zd87nn6xh7eznjpkbf3lt3ab00lwoeb36ky1ccamkp2caxnl66aaxym6ygatnnq9daolobciakgowic9gp4z8j8t25dkd8x15wql8uz5lqj9cy5bud96u5bti93l5bza8nl63gk8xw6d6h92e67hf8ff5vwd8h36wmd89g6fhh8kr61im7uxewkk7bdefhk7jhejpf7iie6xo7kle7sk7dcec0j7r8egomb50fbsjat2ffgj9ysnpzfa1dnhmf6r0gfhh6f2gsme6gugnbd6oogpvfakcegreb8gew6e91fcvcd707npsd6nons4g6ajn1xa6qzoqucabmer9m9u6f1wia8jfith6zgglzf7dfl8sh7d1lmpo9y5ln1e9vdlt4ha1il6yb9m4m28l9r6l7ka8ovmdzl8sem45c8r8mh8g8zwlz7l8v6n1em9ehmxsn9jgmwyn8kwmemm8uwmnij6ujmwjg729mehi5ahhisd5qhhgrc554h9db6d0mfvh6ixm0fj6bumktj65qnfaf6py7skf8hn81eh8g68fpm7c2828g71d7xcg7sg848n6y4faqe7lrf4pc99cgefh9cugdpi97fg9of8sxgfef91jgamg6zgfu2i7y5h6pa7u8h7vkavtey7i9wrjuljabyk5zhamzkosc9yzm4lb9wcmctc9gsmauk9oymgxa97mmm6j90omkrk9delytl93gls6g8vsljfk8qylujc9vpmq0o9rmmq0ma48ndim9y4n9vp9q9n69p9ngn0pn9jbn2rl93un75o990n9nn9jcny9o9eoo12f8ytnqnk9j8o6yf6zjndvgab6nbnja3emi6ma7fn2flai0nb4eaqon4ieak3ny3kao1nnhcajenj8mafunztk9noogbp9rtojtia9dp11da63oqyf9nbod3n9wborbo9y4ooha6otf8ab6hnfm8j6gxfpkl6hjg54d6ydg5cf6tcg56c626giia5q5gl7i8376tsi950jurl9knjnvl87wk3zl7lojtpk7pujrqm8ivkili84ojooj7xujnxj7w7jsyj8a7jteh88ejm6j8fcjuri8jjjtxh8yokyxkaelducjaa9eaxlaridwae877dvvb5im8grd4tz8gnb4my8e3c41w8b1c7zcdemba6ofjjh9fyf1yg9hhetkd9ojhbbi9qzh7ul9ewhb6i7u8grud7onh4aec2qfvg5btafk08boufpzeatoiateb13irdbaegixufakvhw8daxpjp8bazajtrfau3k30fasvk9hf9eoi31h9cwhnck9ashktj91ki8bh9mohmsh9vthgmm9bxjqrm8vyjqnj8z1jitka7kj9cha96je8g90mk4ro999jvfh8qxkh1k8w3klmg8l0k6rj8qek23l8p4jqqn7v5k1re7ufjx6j7s0jylk6kret0i7qvd65b7jkd7hc7jddi1i5c0i61d66b8noe6r1ah1k69p8yif5epai0r5nkai6f5hia5wi5qr9k7j4ht9unf4oy9xvg50ba0of6jval6k67ab4rl5sraqkf60aaf0c5dias3l6hyb64kag8eu9e4id8loh3xt8mye44a8xea5168uah4vj8uuj4xb9eed4i697fh4eh97hl56da9ao54ra85i5b7a75h67yarhe7ekeo7g7nuex7g9ldioph9ryj2eh7yeluoc7z5lwha67if5eb5z2ex9c5slexhb5rtetsb5a88w5c7ye9aed9skehkh7nye3ad7g0e3af9r0eeciayqfpuf8pgkssm5n3p4wc4s0pq9h7t2dk3g8tqkq4j8n1lawl8hyl20d6omg5kf942cp5g7r0hd2e5dzibqi9dlgjph5lb2cjb8ywhsii8t3n78o438rdsg412rexc3ejr1lb87xk3os7t9jqhk8ibkifj8pbkjgl4919jxmab54x5f9tp4hfm9x64ilm9qg505nagg4f8na3a593ka5i6nyga4k6hbj9oj6d4j97q6afm7jl8bbg7qf8n6m9fq6xie9pd7tjla577l2n9ys7dem9qh76yj9nm6xxk9sd804ka9j73sla947swka2b7psn7l9922j7f1dzem9s8eoaoadwgh4g8tzi31i9vfie6ja07j1yj5r7g2kl5kiga8m5dzg3ei6a8nkue81675qk7gw9efe8di8b2nb96dk8l6ywgeim7xihd1k7e89mre9txdfel80cekye7zke1vk8gigreh9x4j71k5wf8c3g5k08gve6bg7sij5ux81ne4zr9fxn7vr78dk7ljcv8j898ei6b7vift5g7jeg1rb84ygp3gcbgfcr7bu6eoycblreasd9jljj0j99wjehm8wij5xm9khjepl930kgzk5toh14e4p4fwvh4ymg2fl67qp8vf7mx7r3l9kmdi4k9kjdd0m9dvd9sjaklg46i5eygkvh4bnfv4k4xxgejmbaxkg2hc9lgfyfbxdh0ngbahha8lapbhbmkb67i7okbbxikclb1shrblb8vhogkbo6jjzgb27kcnib6vkagl73rhe0k8rjie6j7h9k1ud7qong6j7rrncfg7hrnkzlba0lqaeaz8lxoib9ml1ykaymmn7fa9to2fibqbnwee9ga4usm95l5pbj8qi5oeg8ny6c5j88t66gj8fa6gwi88j6p9h8kt76th8k96z2k7fxegui7yaeakjbf4i89kan4m4zj69bggvf57bf7ge6gwgwwg9zpduwjb1eq4md7n5egtm6vclmsj7uzcoog9vxex3j9ergntkb5wfuchbc7fqyja94jn6ja0mlh2c9rqlqpk8w8meck9gnmwym8qxmw3m776myrd6msgy9j4okg0cg5hhhjzm6eomeql6pqlyzm6ormqai6jqn3rlah5e9fm6xf7tym7pl7egl802706m8by7yrk7qw828j743fmec7vof1tk80gfhvc78fekec8xegepi84lgw5iah8f4gjbj3fspg98dkx2da8zl3si9t2k21g9zojr1h9wvm37k92qmo9k9h0nwtgaljngfm6k1fcdi6huexde648furg61kg0cl5v6ghui82m6wjk6z3emai8b4kb6m5jnrnoc6w0ekeb2uc8eyb5dr8h7e54b8ggf4e78d2j3ve88lc43p893j3qt89fc8c9cnmj7x5d9sm913f03a9f8ffqla32fnkj9k3gmnna5xhcfk7x1gs2caw6jeffaskjj4haadjtnl9guhvmm98bhy1l9dwjnzl8wdkakl8rtklml8kxk61k8qljv1m7pkjx0l7skjtrm8bxlt0j6m6f2gl7ohcu0m7gydhcd6pe99cm6klajlb6r99o2e6j5a3kc5d79oaj4tea58k5zzavrhask6e3iau55tecayx5npdavw534kaoj4ddf75u97he6y39y7hag681qlak48e3iae18zcgam69tobaeifgvk7bkmr9f3el8oib4eo8kuk5h48uqe3ye931e40g9g2h4is8xqm4u09krg7a5fbkj7rgezsf78rerzma4tff2ka1mhbnka28hqin9dtiyhj7u3lzfm5ylf3sk5o68mpm5kp90dn9p7duaj7foe2oj9g9e67ba8lforlb3qg0kn51jfvzd480pe9f4ejpllh48zol0l5gjp7pb4trpp3n7wddrrlabtfb2i8gxlb0k8d88sbo7okhafh9pqf0bg79ljk7b9eagltk83gc2ob8vo7x5e9npggpe8ovn63o3rbrdig3l2r7jg8onmout9samzspaey6ozo8l61pijam84g8p9ix58pq9gw4ulp9xc6xcn9996xrj9h16f5r7rt8cyna7l8elr93n7iyoa0z836ra7l7hbqbo12bne8kgm21q7rwm4era0xgfaqalyfd0m84ohasna4ze22radgfwin9qngr9o9j2gouoalmejrk9xkd6lo85bgedr8lsgwyp8ljgymlbkgepvj9dojmjs8v3j23v4n2ga5obkig87r8jf5wzq8ev6b8n7vcejopaz3fidm9yenlbp6f4gx3p77yli1nb27demk7fjd20ka3gezkoagbelkp76qlqhm9q6lwbo8pem8wn8zum4gq985m43s8ygn3eo8q8mmmt8pymnzr6epm6to6dvml7p6ru7q0o7fg822p77g7zio8q97j7n9cog77qat6ek4pb2rensmanpes5lat5f02l97lhlan9l8mahq9v8mkmp9aympft94cmlto8vkltap9mkmnqoa65nexr9rwmwzo9ykmxkt95omtwo9f1n1yq9a1n5tp9ljo3wnabvnk6pa2xmd2nah3nntqa9oosmo8db8hrn7dfdven95njujw8acjy0s8dgjl5r8ktjzpo9hdewmn9f4gklpbl4ft9k9qrihho90sjqlp8zik34p8x7kghn7ydk30t8pzjhmr8kwjicqb8oeuwk7csdkuq6tza5cn5q6a6wq4mj9xsq4zea30p6nlawuq5xzax4pb2r54qkage87lq5nka32n6bmb71qav8e81m8rxkv5v69gewrr9s5e4hp8o1kz0r4h9mtsm88nlb4q9uy4g0pa0e5sdo98m6j5q8xn7p5r9jq7dnra6974ku7r68q4pau4g8ro8w1i5lla4qj8fna28dlrraided2lbisfa7l807ln7s60j7xzt82wcjgo4xbg1vpazfe9nk9jcdaup9udnosu82ln82u8xb65bqazwex8pabpkn9q9b7lx3q9mdocev6lzf2jt95gjugf7y1jvgs9vjfpxp9imhbbr7n4gvip9p3huutaqw4e0oaba7rhr49v9dpv9lwj86panwf5go40yp2pq8vkn9ps43nrdgl9kl4rlv9y27y3qa3486gxax2dvota3yg4hu8ufhhsq4bsfb7pb8vgshu8g068nx7fxe5fua6eeuopa0umvbu6uggq9p6gvm4ru7as867t99hgatv9cqn9bw9p5oo7z8ezjigxapqe2ju4d48frs8opkphw56dajzv54kaahx4bxpk1r71llwhr8nzmp6t",
  Gn = [];
for (let e = 0; e + 7 <= st.length; e += 7)
  Gn.push([
    parseInt(st.substr(e, 3), 36) / 100 - 90,
    parseInt(st.substr(e + 3, 3), 36) / 100 - 180,
    Math.pow(10, 4 + parseInt(st[e + 6], 36) / 10),
  ]);
const Ti =
    "AD42.55,1.58,Andorra|AE24.18,54.28,United Arab Emirates|AF34.13,66.59,Afghanistan|AG17.07,-61.79,Antigua & Barbuda|AI18.22,-63.06,Anguilla|AL41.14,20.06,Albania|AM40.18,45.05,Armenia|AO-12.17,17.65,Angola|AQ-77.17,-177.56,Antarctica|AR-35.7,-64.53,Argentina|AS-14.31,-170.7,American Samoa|AT47.63,13.8,Austria|AU-25.7,134.02,Australia|AW12.52,-69.98,Aruba|AX60.2,20,\xC5land Islands|AZ40.39,48.63,Azerbaijan|BA44.14,17.83,Bosnia & Herzegovina|BB13.18,-59.56,Barbados|BD23.67,90.43,Bangladesh|BE50.62,4.68,Belgium|BF12.11,-1.69,Burkina Faso|BG42.82,25.25,Bulgaria|BH26.05,50.54,Bahrain|BI-3.26,29.89,Burundi|BJ9.5,2.31,Benin|BL17.91,-62.83,Saint Barthelemy|BM32.32,-64.75,Bermuda|BN4.54,114.64,Brunei|BO-16.73,-64.45,Bolivia|BQ12.18,-68.29,Bonaire|BR-11.52,-54.36,Brazil|BS24.72,-78.07,Bahamas|BT27.42,90.47,Bhutan|BV-54.42,3.41,Bouvet Island|BW-22.24,23.86,Botswana|BY53.47,27.96,Belarus|BZ17.24,-88.68,Belize|CA57.55,-98.42,Canada|CC-12.17,96.84,Cocos Islands|CD-3.34,23.42,DR Congo|CF6.33,20.52,Central African Rep.|CG-0.73,14.88,Congo|CH46.74,8.29,Switzerland|CI7.54,-5.57,C\xF4te d\u2019Ivoire|CK-21.22,-159.79,Cook Islands|CL-37.83,-70.77,Chile|CM6.29,12.95,Cameroon|CN38.07,104.69,China|CO4.19,-72.64,Colombia|CR9.86,-84.15,Costa Rica|CU21.48,-79.7,Cuba|CV15.08,-23.63,Cabo Verde|CW12.2,-68.97,Curacao|CX-10.45,105.7,Christmas Island|CY35.12,33.38,Cyprus|CZ49.75,15.38,Czechia|DE51.08,10.43,Germany|DJ11.75,42.61,Djibouti|DK56,9.38,Denmark|DM15.43,-61.36,Dominica|DO18.78,-70.43,Dominican Republic|DZ28.35,2.66,Algeria|EC-1.56,-78.46,Ecuador|EE58.65,25.92,Estonia|EG26.61,30.24,Egypt|EH24.3,-13.1,Western Sahara|ER15.01,39.27,Eritrea|ES40.37,-3.65,Spain|ET8.73,39.91,Ethiopia|FI65.02,25.66,Finland|FJ-17.82,177.98,Fiji|FK-51.76,-58.75,Falkland Islands|FM6.88,158.23,Micronesia|FO62.13,-6.98,Faroe Islands|FR46.64,2.19,France|GA-0.63,11.84,Gabon|GB53.98,-2.85,United Kingdom|GD12.11,-61.68,Grenada|GE42.18,43.38,Georgia|GF3.86,-53.32,French Guiana|GG49.46,-2.58,Guernsey|GH7.95,-1.22,Ghana|GI36.14,-5.35,Gibraltar|GL74.17,-42.08,Greenland|GM13.43,-15.38,Gambia|GN10.26,-10.99,Guinea|GP16.24,-61.54,Guadeloupe|GQ1.6,10.43,Equatorial Guinea|GR39.42,23.11,Greece|GS-54.38,-36.78,South Georgia|GT15.82,-90.31,Guatemala|GU13.45,144.78,Guam|GW11.98,-14.98,Guinea-Bissau|GY4.68,-58.91,Guyana|HK22.35,114.13,Hong Kong|HM-53.08,73.49,Heard & McDonald Is.|HN14.74,-86.49,Honduras|HR44.91,16.63,Croatia|HT18.88,-72.89,Haiti|HU47.23,19.4,Hungary|ID0.16,113.97,Indonesia|IE53.3,-8.24,Ireland|IL31.51,35.03,Israel|IM54.23,-4.53,Isle of Man|IN23.59,81.17,India|IO-7.32,72.44,British Indian Ocean Terr.|IQ33.11,43.83,Iraq|IR32.91,54.24,Iran|IS65.12,-19.06,Iceland|IT42.98,12.76,Italy|JE49.22,-2.13,Jersey|JM18.12,-77.3,Jamaica|JO31.39,36.96,Jordan|JP36.77,137.47,Japan|KE0.69,37.95,Kenya|KG41.36,74.18,Kyrgyzstan|KH12.7,105.04,Cambodia|KI1.87,-157.39,Kiribati|KM-11.66,43.35,Comoros|KN17.31,-62.75,Saint Kitts & Nevis|KP40.19,127.34,North Korea|KR36.4,127.76,South Korea|KW29.28,47.56,Kuwait|KY19.31,-81.25,Cayman Islands|KZ47.64,66.38,Kazakhstan|LA18.12,103.76,Laos|LB33.91,35.9,Lebanon|LC13.9,-60.97,Saint Lucia|LI47.15,9.55,Liechtenstein|LK7.7,80.67,Sri Lanka|LR6.52,-9.26,Liberia|LS-29.6,28.24,Lesotho|LT55.29,23.95,Lithuania|LU49.78,6.1,Luxembourg|LV56.81,24.69,Latvia|LY27.2,17.91,Libya|MA28.69,-8.82,Morocco|MC43.75,7.41,Monaco|MD47.07,28.39,Moldova|ME42.74,19.3,Montenegro|MF18.08,-63.07,Saint Martin|MG-19.04,46.68,Madagascar|MH7.31,168.72,Marshall Islands|MK41.59,21.71,North Macedonia|ML17.17,-4.35,Mali|MM19.9,97.09,Myanmar|MN47.09,103.4,Mongolia|MO22.17,113.55,Macao|MP15.18,145.74,Northern Mariana Is.|MQ14.64,-61.01,Martinique|MR20.47,-10.5,Mauritania|MS16.74,-62.19,Montserrat|MT35.89,14.44,Malta|MU-20.28,57.56,Mauritius|MV-0.61,73.1,Maldives|MW-13.13,34.23,Malawi|MX23.87,-101.55,Mexico|MY3.67,114.63,Malaysia|MZ-17.53,35.21,Mozambique|NA-21.91,18.16,Namibia|NC-21.33,165.51,New Caledonia|NE17.08,8.87,Niger|NF-29.04,167.95,Norfolk Island|NG9.61,8.15,Nigeria|NI12.89,-85.02,Nicaragua|NL52.13,5.55,Netherlands|NO64.98,16.67,Norway|NP28.3,84.13,Nepal|NR-0.52,166.93,Nauru|NU-19.05,-169.87,Niue|NZ-43.83,170.69,New Zealand|OM20.72,55.84,Oman|PA8.44,-80.14,Panama|PE-8.52,-74.11,Peru|PF-17.67,-149.4,French Polynesia|PG-7.16,144.83,Papua New Guinea|PH15.59,121.82,Philippines|PK30.12,69.09,Pakistan|PL52.07,19.44,Poland|PM46.95,-56.32,Saint Pierre & Miquelon|PN-24.37,-128.31,Pitcairn|PR18.22,-66.49,Puerto Rico|PS31.93,35.24,Palestine|PT39.68,-7.93,Portugal|PW7.53,134.58,Palau|PY-23.42,-58.39,Paraguay|QA25.32,51.2,Qatar|RE-21.12,55.54,R\xE9union|RO45.82,25.09,Romania|RS44.03,20.86,Serbia|RU59.04,98.67,Russia|RW-2.01,29.92,Rwanda|SA24.14,44.6,Saudi Arabia|SB-9.61,160.16,Solomon Islands|SC-4.66,55.47,Seychelles|SD15.67,29.95,Sudan|SE62.73,17.06,Sweden|SG1.35,103.81,Singapore|SH-15.96,-5.72,Saint Helena|SI46.14,14.89,Slovenia|SJ78.57,16.04,Svalbard & Jan Mayen|SK48.7,19.58,Slovakia|SL8.56,-11.79,Sierra Leone|SM43.94,12.46,San Marino|SN14.23,-14.61,Senegal|SO6.52,45.4,Somalia|SR4.1,-55.86,Suriname|SS7.66,30.39,South Sudan|ST0.23,6.61,Sao Tome & Principe|SV13.76,-88.86,El Salvador|SX18.04,-63.07,Sint Maarten|SY35.1,38.51,Syria|SZ-26.56,31.51,Eswatini|TC21.8,-71.74,Turks & Caicos|TD15.28,18.43,Chad|TF-49.26,69.55,French Southern Terr.|TG8.66,0.9,Togo|TH13.66,101.09,Thailand|TJ38.57,70.94,Tajikistan|TK-9.2,-171.85,Tokelau|TL-8.81,125.95,Timor-Leste|TM39.06,58.46,Turkmenistan|TN34.09,9.66,Tunisia|TO-21.16,-175.2,Tonga|TR38.93,35.57,Turkey|TT10.42,-61.37,Trinidad and Tobago|TV-8.51,179.22,Tuvalu|TW23.7,121,Taiwan|TZ-6.36,34.82,Tanzania|UA48.66,31.27,Ukraine|UG1.28,32.34,Uganda|UM19.3,166.64,U.S. Minor Outlying Is.|US38.82,-96.33,United States|UY-32.78,-56.02,Uruguay|UZ41.49,63.85,Uzbekistan|VA41.9,12.45,Vatican City|VC13.25,-61.19,Saint Vincent|VE7.15,-66.36,Venezuela|VG18.42,-64.62,British Virgin Islands|VI17.74,-64.76,U.S. Virgin Islands|VN16.52,105.91,Vietnam|VU-15.19,166.85,Vanuatu|WF-14.28,-178.13,Wallis & Futuna|WS-13.63,-172.44,Samoa|XK42.6,20.9,Kosovo|YE16,47.47,Yemen|YT-12.82,45.13,Mayotte|ZA-28.55,24.75,South Africa|ZM-13.16,27.76,Zambia|ZW-18.93,29.72,Zimbabwe",
  W = new Map();
for (const e of Ti.split("|")) {
  const a = e.slice(2).split(",");
  W.set(e.slice(0, 2), { lat: +a[0], lon: +a[1], name: a.slice(2).join(",") });
}
const ct = (e) =>
    /^[A-Z]{2}$/.test(e)
      ? String.fromCodePoint(
          127462 + e.charCodeAt(0) - 65,
          127462 + e.charCodeAt(1) - 65,
        )
      : "\u{1F3F3}",
  Ai = (e) => W.get(e)?.name || e,
  M = 2048,
  G = 1024,
  lt = (() => {
    const e = document.createElement("canvas");
    ((e.width = M), (e.height = G));
    const a = e.getContext("2d", { willReadFrequently: !0 });
    ((a.fillStyle = "#000"), a.fillRect(0, 0, M, G));
    const t = (o, s) => {
      ((a.fillStyle = s), a.beginPath());
      for (let c = 0; c < o.length; c += 4) {
        const l = (parseInt(o.substr(c, 2), 36) / 2 / 360) * M,
          f = ((180 - parseInt(o.substr(c + 2, 2), 36) / 2) / 180) * G;
        c ? a.lineTo(l, f) : a.moveTo(l, f);
      }
      (a.closePath(), a.fill());
    };
    (Si.forEach((o) => t(o, "#fff")), Ci.forEach((o) => t(o, "#000")));
    const n = a.getImageData(0, 0, M, G).data,
      i = new Uint8Array(M * G);
    for (let o = 0; o < i.length; o++) i[o] = n[o * 4] > 127 ? 1 : 0;
    return i;
  })(),
  za = (e, a) => {
    const t = ((((e + 360) % 360) / 360) * M) | 0,
      n = k((((90 - a) / 180) * G) | 0, 0, G - 1);
    return lt[n * M + (t % M)];
  };
function Dr(e, a, t) {
  const n = Math.max(1, (((t / 180) * G) / 2) | 0),
    i = ((((e + 360) % 360) / 360) * M) | 0,
    o = (((90 - a) / 180) * G) | 0;
  let s = 0,
    c = 0;
  for (let l = -n; l <= n; l++) {
    const f = o + l;
    if (f < 0 || f >= G) continue;
    const u = Math.max(1, Math.round(n / Math.max(0.18, Math.cos(a * m))));
    for (let g = -u; g <= u; g += 1)
      ((s += lt[f * M + ((((i + g) % M) + M) % M)]), c++);
  }
  return c ? s / c : 0;
}
function _n(e, a) {
  if (za(a, e)) return [e, a];
  for (let t = 0.6; t <= 9; t += 0.6)
    for (let n = 0; n < Math.ceil(t * 9); n++) {
      const i = (n / Math.ceil(t * 9)) * Math.PI * 2 + t,
        o = k(e + Math.sin(i) * t, -89, 89),
        s = a + (Math.cos(i) * t) / Math.max(0.2, Math.cos(o * m));
      if (za(s, o)) return [o, ((s + 540) % 360) - 180];
    }
  return [e, a];
}
function Ot(e = new Date()) {
  const a = Date.UTC(e.getUTCFullYear(), 0, 1),
    t = (e.getTime() - a) / 864e5,
    n =
      Math.asin(
        0.39779 *
          Math.cos(
            (0.98565 * (t + 10) + 1.914 * Math.sin(0.98565 * (t - 2) * m)) * m,
          ),
      ) / m,
    i = (360 / 365.24) * (t - 81) * m,
    o = 9.87 * Math.sin(2 * i) - 7.53 * Math.cos(i) - 1.5 * Math.sin(i),
    s = e.getUTCHours() + e.getUTCMinutes() / 60 + e.getUTCSeconds() / 3600;
  return { lat: n, lon: ((-15 * (s + o / 60 - 12) + 540) % 360) - 180 };
}
const Se = (e, a, t = new r.Vector3()) => {
    const n = Math.cos(e * m);
    return t.set(n * Math.sin(a * m), Math.sin(e * m), n * Math.cos(a * m));
  },
  Pi = (e, a, t) => Se(e, a, Nt).dot(Se(t.lat, t.lon, Ve)) > 0,
  Nt = new r.Vector3(),
  Ve = new r.Vector3(),
  Ce = [1.340264, -0.081106, 893e-6, 0.003796],
  In = Math.sqrt(3) / 2,
  Ut = 0.55,
  En = 0.55,
  Vn = 2.6;
function Ri(e) {
  const a = e * e,
    t = a * a * a;
  return In * (Ce[0] + 3 * Ce[1] * a + t * (7 * Ce[2] + 9 * Ce[3] * a));
}
function Te(e, a, t, n = new r.Vector3()) {
  const i = Math.cos(e);
  return n
    .set(i * Math.sin(a), Math.sin(e), i * Math.cos(a))
    .multiplyScalar(aa + t)
    .setY(n.y + S);
}
function Ma(e, a, t, n = new r.Vector3()) {
  const i = Math.asin(In * Math.sin(e)),
    o = i * i,
    s = o * o * o;
  return n.set(
    (aa * a * Math.cos(i)) / Ri(i),
    S + t * Vn,
    -aa * i * (Ce[0] + Ce[1] * o + s * (Ce[2] + Ce[3] * o)),
  );
}
const Bn = (e, a) => {
    const t = k(a * (1 + Ut) - (Ut * Math.abs(e)) / Math.PI, 0, 1);
    return t * t * (3 - 2 * t);
  },
  Sa = new r.Vector3(),
  On = new r.Vector3();
function Ca(e, a, t, n, i = new r.Vector3()) {
  const o = Bn(a, n);
  return (
    Te(e, a, t, Sa),
    Ma(e, a, t, On),
    i.lerpVectors(Sa, On, o),
    o > 0 &&
      o < 1 &&
      ((Sa.y -= S),
      Sa.normalize(),
      i.addScaledVector(Sa, En * Math.sin(Math.PI * o))),
    i
  );
}
function Ta(e, a, t, n = new r.Vector3()) {
  const i = Bn(a, t);
  return (
    Te(e, a, 0, n),
    (n.y -= S),
    n.normalize(),
    n.set(D(n.x, 0, i), D(n.y, 1, i), D(n.z, 0, i)).normalize()
  );
}
const $t = `attribute vec4 aGeo;attribute vec3 aNormP;attribute float aOn;
uniform float uMorph;uniform float uR;uniform float uY0;uniform float uSpread;uniform float uLift;uniform float uPlaneH;
varying vec4 vGeo;varying float vM;
float eeDen(float th){float t2=th*th,t6=t2*t2*t2;return .8660254*(1.340264+3.*-.081106*t2+t6*(7.*.000893+9.*.003796*t2));}
vec3 geoSphere(vec4 g){float cl=cos(g.x);return vec3(cl*sin(g.y),sin(g.x),cl*cos(g.y))*(uR+g.z)+vec3(0.,uY0,0.);}
vec3 geoPlane(vec4 g){float th=asin(.8660254*sin(g.x));float t2=th*th,t6=t2*t2*t2;
 return vec3(uR*g.y*cos(th)/eeDen(th),uY0+g.z*uPlaneH,-uR*th*(1.340264+-.081106*t2+t6*(.000893+.003796*t2)));}
float morphOf(vec4 g){float t=clamp(uMorph*(1.+uSpread)-uSpread*abs(g.y)*0.31830989,0.,1.);return t*t*(3.-2.*t);}
vec3 geoPos(vec4 g){float k=morphOf(g);vec3 a=geoSphere(g),b=geoPlane(g);vec3 p=mix(a,b,k);
 vec3 up=normalize(a-vec3(0.,uY0,0.));return p+up*(uLift*sin(3.14159265*k));}
vec3 geoNormal(vec3 nS,vec3 nP,float k){return normalize(mix(nS,nP,k)+vec3(0.,1e-5,0.));}`,
  Aa = {
    uMorph: { value: 0 },
    uR: { value: aa },
    uY0: { value: S },
    uSpread: { value: Ut },
    uLift: { value: En },
    uPlaneH: { value: Vn },
  },
  Li = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, Aa),
        (e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
` + $t,
          )
          .replace(
            "#include <beginnormal_vertex>",
            `#include <beginnormal_vertex>
vGeo=aGeo;vM=morphOf(aGeo);if(aOn>.5)objectNormal=geoNormal(normal,aNormP,vM);`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
if(aOn>.5)transformed=geoPos(aGeo);`,
          )));
    },
    { key: "geo" },
  );
((P.normalMaterial.onBeforeCompile = Li),
  (P.normalMaterial.customProgramCacheKey = () => Pt + "geoN"));
const he = 1.25,
  Di = 0.38,
  ia = 0.108,
  Nn = 0.42,
  oe = Math.round(360 / he),
  Pa = Math.round(178 / he),
  Un = -89,
  ft = (() => {
    const e = new Int32Array((M + 1) * (G + 1));
    for (let a = 0; a < G; a++) {
      let t = 0;
      for (let n = 0; n < M; n++)
        ((t += lt[a * M + n]),
          (e[(a + 1) * (M + 1) + n + 1] = e[a * (M + 1) + n + 1] + t));
    }
    return e;
  })(),
  Ht = (e, a, t, n) => {
    const i = M + 1;
    return ft[n * i + a] - ft[t * i + a] - ft[n * i + e] + ft[t * i + e];
  };
function Fi(e, a) {
  const t = ((he / 180) * G) / 2,
    n = ((he / 360) * M) / 2 / Math.max(0.13, Math.cos(a * m)),
    i = k(Math.round(((90 - a) / 180) * G - t), 0, G),
    o = k(Math.round(((90 - a) / 180) * G + t), 0, G);
  if (o <= i || n <= 0) return za(e, a);
  const s = (((e + 180) / 360) * M + M) % M;
  let c = Math.round(s - n),
    l = Math.round(s + n),
    f = 0,
    u = (o - i) * (l - c);
  return u <= 0
    ? za(e, a)
    : (c < 0 && ((f += Ht(c + M, M, i, o)), (c = 0)),
      l > M && ((f += Ht(0, l - M, i, o)), (l = M)),
      (f += Ht(Math.max(c, 0), Math.min(l, M), i, o)),
      f / u);
}
const $n = Ee(2048, 1024, (t) => {
  ((t.fillStyle = "#000"),
    t.fillRect(0, 0, 2048, 1024),
    (t.globalCompositeOperation = "lighter"));
  for (const [n, i, o] of Gn) {
    const s = ((i + 180) / 360) * 2048,
      c = ((90 - n) / 180) * 1024,
      l = k((Math.log10(o) - 3.9) / 2.6, 0, 1),
      f = 1.1 + l * l * 9.5,
      u = t.createRadialGradient(s, c, 0, s, c, f);
    (u.addColorStop(0, `rgba(255,214,150,${(0.44 + l * 0.44).toFixed(3)})`),
      u.addColorStop(0.35, `rgba(255,170,90,${(0.11 + l * 0.17).toFixed(3)})`),
      u.addColorStop(1, "rgba(255,150,70,0)"),
      (t.fillStyle = u),
      t.beginPath(),
      t.arc(s, c, f, 0, 7),
      t.fill(),
      (t.fillStyle = `rgba(255,240,215,${(0.55 + l * 0.45).toFixed(3)})`),
      t.beginPath(),
      t.arc(s, c, 0.5 + l * 1.5, 0, 7),
      t.fill());
  }
  t.globalCompositeOperation = "source-over";
});
$n.wrapS = r.RepeatWrapping;
const Ae = {
    uSunDir: { value: new r.Vector3(1, 0, 0) },
    uSunView: { value: new r.Vector3(1, 0, 0) },
    uSunCol: { value: new r.Color("#ffe6c4").multiplyScalar(2.45) },
    uLights: { value: $n },
    uNightK: { value: 0.56 },
    uDawn: { value: 1 },
    uGlint: { value: 0 },
    uIsLand: { value: 1 },
    uFlat: { value: 0 },
  },
  Hn = (e = {}) =>
    Object.assign(
      (a) => {
        (Object.assign(a.uniforms, Aa, Ae, {
          uIsLand: { value: e.land ? 1 : 0 },
          uGlint: { value: e.glint || 0 },
        }),
          (a.vertexShader = a.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` + $t,
            )
            .replace(
              "#include <beginnormal_vertex>",
              `#include <beginnormal_vertex>
vGeo=aGeo;vM=morphOf(aGeo);if(aOn>.5)objectNormal=geoNormal(normal,aNormP,vM);`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
if(aOn>.5)transformed=geoPos(aGeo);`,
            )),
          (a.fragmentShader = a.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
  varying vec4 vGeo;varying float vM;uniform vec3 uSunDir;uniform vec3 uSunView;uniform vec3 uSunCol;uniform sampler2D uLights;
  uniform float uNightK;uniform float uDawn;uniform float uGlint;uniform float uIsLand;`,
            )
            .replace(
              "#include <aomap_fragment>",
              `#include <aomap_fragment>
  {vec3 gn=vec3(cos(vGeo.x)*sin(vGeo.y),sin(vGeo.x),cos(vGeo.x)*cos(vGeo.y));
   float sl=dot(gn,uSunDir);
   float day=smoothstep(-.09*uDawn,.15*uDawn,sl);
   reflectedLight.directDiffuse=diffuseColor.rgb*uSunCol*(day*(.5+.5*max(sl,0.)))*mix(.78,1.2,uIsLand);
   reflectedLight.directSpecular*=day;
   if(uGlint>.001){vec3 H=normalize(uSunView+normalize(vViewPosition));
    reflectedLight.directSpecular+=uSunCol*(uGlint*(1.-vM)*day*pow(max(dot(normal,H),0.),140.));}
   float night=1.-day;
   reflectedLight.indirectDiffuse+=diffuseColor.rgb*vec3(.20,.25,.36)*night*uIsLand;
   reflectedLight.indirectDiffuse+=vec3(.05,.12,.19)*uIsLand*pow(1.-abs(dot(normal,normalize(vViewPosition))),3.)*(.35+.65*night);
   vec3 lg=texture2D(uLights,vec2(vGeo.y*.15915494+.5,vGeo.x*.31830989+.5)).rgb;
   totalEmissiveRadiance+=lg*(uNightK*night*mix(.3,1.,uIsLand));}`,
            )));
      },
      { key: "world" + (e.land ? "L" : "O") + (e.glint ? "G" : "") },
    ),
  Ra = new r.Group();
de.add(Ra);
const Kn = wa(
    new r.MeshStandardMaterial({
      color: "#77876f",
      roughness: 0.74,
      metalness: 0.04,
      envMapIntensity: 0.95,
      flatShading: !0,
      vertexColors: !0,
      side: r.DoubleSide,
    }),
    Hn({ land: 1 }),
  ),
  Wn = wa(
    new r.MeshStandardMaterial({
      color: "#ffffff",
      vertexColors: !0,
      roughness: 0.46,
      metalness: 0.08,
      envMapIntensity: 0.12,
      side: r.DoubleSide,
    }),
    Hn({ glint: 1.1 }),
  ),
  ye = (e) => new r.Color(e).convertSRGBToLinear(),
  A = 720,
  ce = 360,
  Yn = 1e9,
  [Gi, _i] = (() => {
    const e = new Float32Array(A * ce),
      a = new Float32Array(A * ce);
    for (let i = 0; i < ce; i++) {
      const o = ((i * G) / ce) | 0;
      for (let s = 0; s < A; s++) {
        const c = lt[o * M + ((((s * M) / A) | 0) % M)];
        ((e[i * A + s] = c ? Yn : 0), (a[i * A + s] = c ? 0 : Yn));
      }
    }
    const t = 180 / ce,
      n = (i, o) => {
        for (let s = 0; s < ce; s++) {
          const c = o > 0 ? s : ce - 1 - s,
            l =
              (360 / A) *
              Math.max(0.12, Math.cos((90 - ((c + 0.5) * 180) / ce) * m)),
            f = Math.hypot(l, t),
            u = c - o;
          for (let g = 0; g < A; g++) {
            const b = o > 0 ? g : A - 1 - g,
              v = c * A + b,
              z = (b - o + A) % A;
            let T = Math.min(i[v], i[c * A + z] + l);
            (u >= 0 &&
              u < ce &&
              (T = Math.min(
                T,
                i[u * A + b] + t,
                i[u * A + z] + f,
                i[u * A + ((b + o + A) % A)] + f,
              )),
              (i[v] = T));
          }
        }
      };
    for (const i of [e, a]) (n(i, 1), n(i, -1));
    return [e, a];
  })(),
  Xn = (e, a, t) =>
    e[
      k((((90 - t) / 180) * ce) | 0, 0, ce - 1) * A +
        (((((((a + 180) / 360) * A) | 0) % A) + A) % A)
    ],
  Ii = ye("#43753f"),
  Ei = ye("#6d8a5a"),
  Vi = ye("#425f4a"),
  Bi = ye("#87907c"),
  Oi = ye("#dde6ee"),
  Ni = ye("#b39b69"),
  Ui = ye("#9a9a63"),
  Kt = new r.Color();
function $i(e, a) {
  const t = Math.abs(e);
  Kt.copy(Ii)
    .lerp(Ei, Q(14, 34, t))
    .lerp(Vi, Q(42, 56, t))
    .lerp(Bi, Q(58, 68, t));
  const n = Xn(Gi, a, e),
    i = Math.exp(-(((t - 24) / 13) ** 2)) * Q(1.4, 8.5, n),
    o = Q(6, 15, n) * Q(62, 44, t) * (1 - Q(0, 0.5, i));
  return (
    Kt.lerp(Ni, i * 0.88).lerp(Ui, o * 0.5),
    Kt.lerp(Oi, Math.max(Q(-57, -67, e), Q(67, 75, t)))
  );
}
const Be = new Float32Array((oe + 1) * (Pa + 1)),
  Oe = new Float32Array((oe + 1) * (Pa + 1));
for (let e = 0; e <= Pa; e++) {
  const a = Un + e * he;
  for (let t = 0; t <= oe; t++) {
    const n = -180 + t * he,
      i = e * (oe + 1) + t;
    Be[i] = Fi(n, a) - Di;
    const o =
      ea(t * 1.7 + e * 4.3) +
      ea(t * 0.37 + e * 0.11) * 0.7 +
      ea(t * 0.09 + e * 0.23) * 0.5;
    Oe[i] = ia * (1 - Nn * 0.5 + Nn * (o / 2.2));
  }
}
for (let e = 0; e <= Pa; e++) {
  const a = e * (oe + 1),
    t = a + oe;
  ((Be[t] = Be[a]), (Oe[t] = Oe[a]));
}
const Y = new r.Vector3(),
  Ne = new r.Vector3(),
  ra = new r.Vector3(),
  Pe = new r.Vector3(),
  Ue = new r.Vector3(),
  sa = new r.Vector3(),
  Jn = new r.Vector3(),
  La = [],
  Zn = [],
  Qn = [],
  eo = [],
  ao = [];
function Re(e, a, t, n, i) {
  if (
    (Te(e[0] * m, e[1] * m, e[2], Y),
    Te(a[0] * m, a[1] * m, a[2], Ne),
    Te(t[0] * m, t[1] * m, t[2], ra),
    Pe.crossVectors(sa.subVectors(Ne, Y), Jn.subVectors(ra, Y)),
    !(Pe.lengthSq() < 1e-12))
  ) {
    if ((Pe.normalize(), Pe.dot(i) < 0)) {
      const o = a;
      ((a = t), (t = o), Pe.negate());
    }
    (Ma(e[0] * m, e[1] * m, e[2], Y),
      Ma(a[0] * m, a[1] * m, a[2], Ne),
      Ma(t[0] * m, t[1] * m, t[2], ra),
      Ue.crossVectors(sa.subVectors(Ne, Y), Jn.subVectors(ra, Y)),
      Ue.lengthSq() < 1e-12 ? Ue.set(0, 1, 0) : Ue.normalize());
    for (const o of [e, a, t])
      (La.push(0, 0, 0),
        Zn.push(Pe.x, Pe.y, Pe.z),
        Qn.push(Ue.x, Ue.y, Ue.z),
        eo.push(o[0] * m, o[1] * m, o[2], 0),
        ao.push(n.r, n.g, n.b));
  }
}
const Da = new r.Vector3(),
  to = (e, a) => Se(e, a, Da),
  dt = [];
function no(e, a, t, n) {
  const i = [e, a, t],
    o = i.filter((v) => v[3] >= 0);
  if (!o.length) return;
  const s = (v, z) => {
      const T = v[3] / (v[3] - z[3]);
      return [D(v[0], z[0], T), D(v[1], z[1], T), D(v[2], z[2], T), 0];
    },
    c = to((e[0] + a[0] + t[0]) / 3, (e[1] + a[1] + t[1]) / 3).clone();
  if (o.length === 3) {
    Re(e, a, t, n, c);
    return;
  }
  if (o.length === 1) {
    const v = o[0],
      [z, T] = i.filter((Ct) => Ct[3] < 0),
      K = s(v, z),
      U = s(v, T);
    (Re(v, K, U, n, c), dt.push([K, U, v, n]));
    return;
  }
  const [l, f] = o,
    u = i.find((v) => v[3] < 0),
    g = s(f, u),
    b = s(l, u);
  (Re(l, f, g, n, c), Re(l, g, b, n, c), dt.push([g, b, l, n]));
}
{
  const e = performance.now();
  for (let i = 0; i < Pa; i++) {
    const o = Un + i * he,
      s = o + he;
    for (let c = 0; c < oe; c++) {
      const l = -180 + c * he,
        f = l + he,
        u = i * (oe + 1) + c,
        g = Be[u],
        b = Be[u + 1],
        v = Be[u + oe + 1],
        z = Be[u + oe + 2];
      if (g < 0 && b < 0 && v < 0 && z < 0) continue;
      const T = Oe[u],
        K = Oe[u + 1],
        U = Oe[u + oe + 1],
        Ct = Oe[u + oe + 2],
        Ka = $i((o + s) / 2, (l + f) / 2)
          .clone()
          .multiplyScalar(0.93 + ea(c * 2.37 + i * 5.11) * 0.15),
        Wa = [o, l, T, g],
        pn = [o, f, K, b],
        Ya = [s, f, Ct, z],
        wn = [s, l, U, v];
      if (g >= 0 && b >= 0 && v >= 0 && z >= 0) {
        const vn = to((o + s) / 2, (l + f) / 2).clone();
        (Re(Wa, pn, Ya, Ka, vn), Re(Wa, Ya, wn, Ka, vn));
      } else (no(Wa, pn, Ya, Ka), no(Wa, Ya, wn, Ka));
    }
  }
  const a = new r.Color();
  for (const [i, o, s, c] of dt) {
    const l = [i[0], i[1], -0.016, 0],
      f = [o[0], o[1], -0.016, 0];
    (Te(i[0] * m, i[1] * m, 0, Y),
      Te(o[0] * m, o[1] * m, 0, Ne),
      Te(s[0] * m, s[1] * m, 0, ra),
      sa.subVectors(Ne, Y),
      Da.addVectors(Y, Ne).multiplyScalar(0.5).sub(ra),
      Da.addScaledVector(
        sa,
        -Da.dot(sa) / Math.max(sa.lengthSq(), 1e-9),
      ).normalize());
    const u = Da.clone();
    (a.copy(c).multiplyScalar(0.5), Re(i, o, f, a, u), Re(i, f, l, a, u));
  }
  const t = new r.BufferGeometry();
  (t.setAttribute("position", new r.Float32BufferAttribute(La, 3)),
    t.setAttribute("normal", new r.Float32BufferAttribute(Zn, 3)),
    t.setAttribute("aNormP", new r.Float32BufferAttribute(Qn, 3)),
    t.setAttribute("aGeo", new r.Float32BufferAttribute(eo, 4)),
    t.setAttribute("color", new r.Float32BufferAttribute(ao, 3)),
    t.setAttribute(
      "aOn",
      new r.Float32BufferAttribute(new Float32Array(La.length / 3).fill(1), 1),
    ),
    t.setAttribute(
      "uv",
      new r.Float32BufferAttribute(new Float32Array((La.length / 3) * 2), 2),
    ));
  const n = new r.Mesh(t, Kn);
  ((n.frustumCulled = !1),
    (n.castShadow = !1),
    (n.receiveShadow = !1),
    Ra.add(n),
    (window.__landStats = {
      tris: La.length / 9,
      wall: dt.length,
      ms: +(performance.now() - e).toFixed(1),
    }));
}
{
  const e = Math.round(120),
    a = Math.round(180 / 3),
    t = [],
    n = [],
    i = [],
    o = [],
    s = [],
    c = [],
    l = ye("#13395e"),
    f = ye("#081426"),
    u = new r.Color();
  for (let v = 0; v <= a; v++) {
    const z = k(-90 + v * 3, -89.96, 89.96);
    for (let T = 0; T <= e; T++) {
      const K = -180 + T * 3;
      (Se(z, K, Y),
        t.push(0, 0, 0),
        n.push(Y.x, Y.y, Y.z),
        i.push(0, 1, 0),
        o.push(z * m, K * m, 0, 0),
        u.copy(l).lerp(f, Q(0.4, 4.5, Xn(_i, K, z))),
        c.push(u.r, u.g, u.b));
    }
  }
  for (let v = 0; v < a; v++)
    for (let z = 0; z < e; z++) {
      const T = v * (e + 1) + z;
      s.push(T, T + e + 1, T + 1, T + 1, T + e + 1, T + e + 2);
    }
  const g = new r.BufferGeometry();
  (g.setAttribute("position", new r.Float32BufferAttribute(t, 3)),
    g.setAttribute("normal", new r.Float32BufferAttribute(n, 3)),
    g.setAttribute("aNormP", new r.Float32BufferAttribute(i, 3)),
    g.setAttribute("aGeo", new r.Float32BufferAttribute(o, 4)),
    g.setAttribute(
      "aOn",
      new r.Float32BufferAttribute(new Float32Array(t.length / 3).fill(1), 1),
    ),
    g.setAttribute("color", new r.Float32BufferAttribute(c, 3)),
    g.setAttribute(
      "uv",
      new r.Float32BufferAttribute(new Float32Array((t.length / 3) * 2), 2),
    ),
    g.setIndex(s));
  const b = new r.Mesh(g, Wn);
  ((b.frustumCulled = !1),
    (b.castShadow = !1),
    (b.receiveShadow = !1),
    Ra.add(b));
}
let ht;
{
  const e = [],
    a = [],
    t = (o, s, c, l) => {
      (e.push(0, 0, 0, 0, 0, 0),
        a.push(o * m, s * m, 0.012, 0, c * m, l * m, 0.012, 0));
    };
  for (let o = -180; o < 180; o += 30)
    for (let s = -88; s < 88; s += 2) t(s, o, Math.min(s + 2, 88), o);
  for (let o = -60; o <= 60; o += 30)
    for (let s = -180; s < 180; s += 2) t(o, s, o, s + 2);
  for (const o of [-88, 88])
    for (let s = -180; s < 180; s += 2) t(o, s, o, s + 2);
  const n = new r.BufferGeometry();
  (n.setAttribute("position", new r.Float32BufferAttribute(e, 3)),
    n.setAttribute("aGeo", new r.Float32BufferAttribute(a, 4)),
    n.setAttribute(
      "aOn",
      new r.Float32BufferAttribute(new Float32Array(e.length / 3).fill(1), 1),
    ));
  const i = new r.ShaderMaterial({
    uniforms: { ...Aa, uK: { value: 0.3 }, uSunDir: Ae.uSunDir },
    transparent: !0,
    depthWrite: !1,
    blending: r.AdditiveBlending,
    vertexShader: `${$t}
void main(){vec3 p=geoPos(aGeo);vGeo=aGeo;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec4 vGeo;uniform float uK;uniform vec3 uSunDir;
   void main(){vec3 gn=vec3(cos(vGeo.x)*sin(vGeo.y),sin(vGeo.x),cos(vGeo.x)*cos(vGeo.y));
   float day=smoothstep(-.09,.15,dot(gn,uSunDir));
   gl_FragColor=vec4(vec3(.42,.72,.92)*uK*(.45+.55*day),1.);}`,
  });
  ((ht = new r.LineSegments(n, i)), (ht.frustumCulled = !1), Ra.add(ht));
}
const oo = (() => {
    const e = new r.ShaderMaterial({
        side: r.BackSide,
        transparent: !0,
        depthWrite: !1,
        blending: r.AdditiveBlending,
        fog: !1,
        uniforms: {
          uSunDir: Ae.uSunDir,
          uK: { value: 0.62 },
          uR: { value: aa },
        },
        vertexShader:
          "varying vec3 vP;varying vec3 vV;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;vV=cameraPosition-w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",
        fragmentShader: `varying vec3 vP;varying vec3 vV;uniform vec3 uSunDir;uniform float uK;uniform float uR;
   void main(){vec3 c=vec3(0.,${S.toFixed(2)},0.);vec3 n=normalize(vP-c);vec3 v=normalize(vV);
   float graze=pow(max(1.-abs(dot(n,v)),0.),6.5);
   float day=smoothstep(-.42,.30,dot(n,uSunDir));
   vec3 col=mix(vec3(.07,.20,.52),vec3(.30,.52,.92),day)+vec3(.55,.24,.05)*pow(1.-abs(dot(n,uSunDir)),11.);
   gl_FragColor=vec4(col*graze*uK*(.14+.86*day),1.);}`,
      }),
      a = new r.Mesh(new r.SphereGeometry(aa * 1.035, 64, 32), e);
    return (
      (a.position.y = S),
      (a.frustumCulled = !1),
      (a.renderOrder = -2),
      de.add(a),
      te.push(a),
      we.push(a),
      a
    );
  })(),
  Wt = 260,
  ut = 420,
  io = 12,
  Hi = new r.Color("#7fe3ff"),
  ro = new r.Color("#ffb454"),
  Ki = new r.Color("#dff3ff");
function Wi(e, a) {
  const t = [];
  for (let n = 0; n < 8; n++) {
    const i = (n / 8) * Math.PI * 2;
    let o = 0.3;
    for (; o < 9; o += 0.3) {
      const s = k(e + Math.sin(i) * o, -89, 89),
        c = a + (Math.cos(i) * o) / Math.max(0.2, Math.cos(s * m));
      if (!za(c, s)) break;
    }
    t.push(o);
  }
  return (t.sort((n, i) => n - i), k(t[3] * 0.7, 0.3, 6.5));
}
for (const [e, a] of W) {
  const [t, n] = _n(a.lat, a.lon);
  ((a.lat = t), (a.lon = n), (a.sp = Wi(t, n)), (a.iso = e));
}
function Yi(e) {
  if (e.pip) return e.pip;
  const a = e.iso;
  return (
    (e.pip = Array.from({ length: io }, (t, n) => {
      const i = ea(a.charCodeAt(0) * 13.7 + a.charCodeAt(1) * 3.1 + n * 7.77),
        o = ea(n * 2.3 + a.charCodeAt(1) * 0.7 + a.charCodeAt(0) * 0.13),
        s = i * Math.PI * 2,
        c = Math.sqrt(o) * e.sp,
        l = k(e.lat + Math.sin(s) * c, -88, 88),
        f = e.lon + (Math.cos(s) * c) / Math.max(0.25, Math.cos(l * m));
      return _n(l, ((f + 540) % 360) - 180);
    })),
    e.pip
  );
}
const so = Ee(
    8,
    128,
    (e, a, t) => {
      const n = e.createLinearGradient(0, t, 0, 0);
      (n.addColorStop(0, "rgba(255,255,255,.95)"),
        n.addColorStop(0.35, "rgba(255,255,255,.42)"),
        n.addColorStop(1, "rgba(255,255,255,0)"),
        (e.fillStyle = n),
        e.fillRect(0, 0, a, t));
    },
    !1,
  ),
  co = Ee(
    128,
    128,
    (e, a, t) => {
      const n = e.createRadialGradient(64, 64, 0, 64, 64, 64);
      (n.addColorStop(0, "rgba(255,255,255,0)"),
        n.addColorStop(0.62, "rgba(255,255,255,.08)"),
        n.addColorStop(0.86, "rgba(255,255,255,.85)"),
        n.addColorStop(1, "rgba(255,255,255,0)"),
        (e.fillStyle = n),
        e.fillRect(0, 0, a, t));
    },
    !1,
  ),
  Fa = (e, a = 1) =>
    new r.MeshBasicMaterial({
      map: e || null,
      transparent: !0,
      opacity: 1,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
      side: r.DoubleSide,
      color: new r.Color(a, a, a),
    }),
  gt = (e, a, t) => {
    const n = new r.InstancedMesh(e, a, t);
    return (
      (n.frustumCulled = !1),
      (n.count = 0),
      (n.instanceColor = new r.InstancedBufferAttribute(
        new Float32Array(t * 3),
        3,
      )),
      n.instanceMatrix.setUsage(r.DynamicDrawUsage),
      n.instanceColor.setUsage(r.DynamicDrawUsage),
      de.add(n),
      te.push(n),
      n
    );
  },
  $e = gt(
    new r.CylinderGeometry(0.72, 0.42, 1, 10, 1, !0).translate(0, 0.5, 0),
    Fa(so, 0.4),
    Wt,
  ),
  Ga = gt(new r.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), Fa(co, 0.4), Wt),
  ca = gt(
    new r.CylinderGeometry(0.06, 0.3, 1, 7, 1, !0).translate(0, 0.5, 0),
    Fa(so, 0.62),
    ut,
  ),
  la = gt(new r.IcosahedronGeometry(1, 0), Fa(null, 1.05), ut);
for (const e of [$e, ca, la])
  ((e.material.depthWrite = !0), (e.material.alphaTest = 0.12));
const _a = (() => {
  const e = new r.Mesh(
    new r.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    Fa(co, 1.5),
  );
  return (
    e.material.color.copy(ro).multiplyScalar(1.1),
    (e.frustumCulled = !1),
    (e.visible = !1),
    (e.matrixAutoUpdate = !1),
    de.add(e),
    te.push(e),
    e
  );
})();
function Xi(e = 720, a = 104) {
  const t = document.createElement("canvas");
  ((t.width = e), (t.height = a));
  const n = t.getContext("2d"),
    i = new r.CanvasTexture(t);
  ((i.colorSpace = r.SRGBColorSpace), (i.anisotropy = 4));
  const o = new r.Mesh(
    new r.PlaneGeometry(1, a / e),
    new r.MeshBasicMaterial({
      map: i,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      color: new r.Color(1.3, 1.3, 1.3),
    }),
  );
  return (
    (o.renderOrder = 10),
    (o.frustumCulled = !1),
    It.add(o),
    (o.userData = {
      key: "",
      w: e,
      h: a,
      a: 0,
      want: 0,
      pw: 0,
      set(s, c = "", l = "#7fe3ff") {
        const f = s + "|" + c + "|" + l;
        if (f === this.key) return;
        ((this.key = f),
          (this.args = [s, c, l]),
          n.clearRect(0, 0, e, a),
          (n.font = "600 38px Outfit, sans-serif"));
        const u = n.measureText(s).width;
        n.font = "500 30px DM Mono, monospace";
        const g = c ? n.measureText(c).width + 24 : 0,
          b = Math.min(e - 8, u + g + 84),
          v = (e - b) / 2;
        ((this.pw = b / e),
          (n.fillStyle = "rgba(10,14,26,.84)"),
          ki(n, v, 8, b, a - 16, (a - 16) / 2),
          n.fill(),
          (n.fillStyle = l),
          n.beginPath(),
          n.arc(v + 34, a / 2, 9, 0, 7),
          n.fill(),
          (n.fillStyle = "#f2f6ff"),
          (n.font = "600 38px Outfit, sans-serif"),
          (n.textBaseline = "middle"),
          n.fillText(s, v + 56, a / 2 + 1),
          c &&
            ((n.fillStyle = "#9fe6ff"),
            (n.font = "500 30px DM Mono, monospace"),
            n.fillText(c, v + 56 + u + 20, a / 2 + 2)),
          (i.needsUpdate = !0));
      },
    }),
    Vt.push(() => {
      const s = o.userData;
      s.args && ((s.key = ""), s.set(...s.args));
    }),
    o
  );
}
const Ji = (e, a) =>
    ((y.position.distanceTo(e) *
      Math.tan(r.MathUtils.degToRad(y.fov / 2)) *
      2) /
      Math.max(B.clientHeight, 1)) *
    a *
    0.5,
  Zi = new r.Vector3();
function Yt(e, a, t = 22, n = 0) {
  const i = (Ji(a, t) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(a),
    e.quaternion.copy(y.quaternion),
    e.scale.set(i, i, i),
    n &&
      e.position.addScaledVector(
        Zi.set(0, 1, 0).applyQuaternion(y.quaternion),
        (n * i * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-Ie * 9))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
const fa = Array.from({ length: 9 }, () => Xi());
let le = !0;
const w = {
    n: null,
    by: {},
    link: !1,
    heard: !1,
    cached: !1,
    at: 0,
    joined: 0,
    rooms: 0,
  },
  N = [],
  lo = location.origin.startsWith("http")
    ? location.origin
    : "https://sael.net",
  Xt = (e) => lo + "/" + (e ? e + "/" : ""),
  fo = (e) =>
    e.live +
    (/^(viewing|watching|playing|exploring|reading)$/.test(e.live)
      ? " it"
      : ""),
  ho = (e) =>
    e.poster ||
    (e.slug ? "https://sael.net/p/" + e.slug + "/poster.webp" : null),
  uo = "sael-here-last",
  go = () => {
    try {
      return sessionStorage.getItem("sael-cc") || null;
    } catch {
      return null;
    }
  };
let L = go();
function Jt() {
  const e = go();
  e !== L && ((L = e), (V = !0));
}
{
  const e = setInterval(() => {
    (Jt(), L && clearInterval(e));
  }, 400);
  setTimeout(() => clearInterval(e), 3e4);
}
try {
  const e = JSON.parse(localStorage.getItem(uo) || "null");
  e &&
    e.by &&
    Date.now() - e.at < 36e5 &&
    ((w.by = e.by),
    (w.n = Object.values(e.by).reduce((a, t) => a + t, 0)),
    (w.cached = !0),
    (w.at = e.at));
} catch {}
function Qi() {
  try {
    localStorage.setItem(uo, JSON.stringify({ by: w.by, at: Date.now() }));
  } catch {}
}
const Zt = (e) => Object.values(e).reduce((a, t) => a + t, 0);
function er(e) {
  ((w.heard = !0),
    (w.by = e || {}),
    (w.cached = !1),
    (w.at = Date.now()),
    Qi(),
    (V = !0));
}
function ar(e, a) {
  const t = N.find((n) => n.slug === e);
  t && ((t.by = a || {}), (t.n = Zt(t.by)), (V = !0));
}
let V = !0;
function mo() {
  const e = window.__saelHere,
    a = window.__saelWho;
  return e
    ? (e(
        "all",
        (t) => {
          ((w.heard = !0), (w.n = t), Jt(), (V = !0));
        },
        !0,
      ),
      a && a("all", er),
      window.__saelLink?.((t) => {
        ((w.link = t), Jt(), (V = !0));
      }),
      fetch(lo + "/works.json", { mode: "cors" })
        .then((t) => (t.ok ? t.json() : null))
        .then((t) => {
          const n = (t && t.works) || [];
          N.push({
            slug: "",
            room: "home",
            title: "The gallery",
            live: "browsing",
            n: 0,
            by: {},
          });
          for (const i of n)
            N.push({
              slug: i.slug,
              room: "w:" + i.slug,
              title: i.title,
              live: i.live || "viewing",
              n: 0,
              by: {},
              poster: i.poster,
              views: i.views || 0,
            });
          w.rooms = N.length;
          for (const i of N)
            (e(
              i.room,
              (o) => {
                ((i.n = o), w.joined++, (V = !0));
              },
              !0,
            ),
              a && a(i.room, (o) => ar(i.slug, o)));
        })
        .catch(() => {
          w.rooms = 0;
        }),
      !0)
    : !1;
}
if (!mo()) {
  const e = setInterval(() => {
    mo() && clearInterval(e);
  }, 250);
  setTimeout(() => clearInterval(e), 25e3);
}
const h = {
  rows: [],
  placed: 0,
  unplaced: 0,
  countries: 0,
  day: 0,
  night: 0,
  top: null,
  sel: null,
  selPage: null,
  mode: "cc",
};
function bo() {
  const e = w.by || {},
    a = Ot();
  ((h.rows = []), (h.unplaced = 0), (h.day = 0), (h.night = 0));
  for (const i in e) {
    const o = e[i];
    if (!o) continue;
    const s = W.get(i);
    if (!s || !i) {
      h.unplaced += o;
      continue;
    }
    const c = Pi(s.lat, s.lon, a);
    (c ? (h.day += o) : (h.night += o),
      h.rows.push({
        cc: i,
        n: o,
        c: s,
        day: c,
        pages: N.filter((l) => l.by[i])
          .map((l) => ({ p: l, n: l.by[i] }))
          .sort((l, f) => f.n - l.n),
      }));
  }
  (h.rows.sort((i, o) => o.n - i.n || i.c.name.localeCompare(o.c.name)),
    (h.placed = h.rows.reduce((i, o) => i + o.n, 0)),
    (h.countries = h.rows.length),
    (h.top = h.rows[0] || null),
    !h.aimed && h.rows.length && ((h.aimed = 1), (h.reaim = !0)),
    h.sel && !h.rows.some((i) => i.cc === h.sel) && (h.sel = null),
    h.selPage &&
      !N.some((i) => i.slug === h.selPage && i.n) &&
      (h.selPage = null));
  let t = 0,
    n = 0;
  for (const i of h.rows) {
    if (t >= Wt) break;
    ((i.i = t++),
      (i.pn = Math.min(i.n, io)),
      (i.p0 = n),
      (n = Math.min(n + i.pn, ut)));
  }
  (($e.count = t),
    (Ga.count = t),
    (ca.count = n),
    (la.count = n),
    (_a.visible = !!(L && W.get(L))));
}
const mt = () => (w.heard ? (w.n ?? 0) : h.placed + h.unplaced),
  je = new r.Vector3(),
  po = new r.Vector3(),
  ie = new r.Vector3(),
  Le = new r.Quaternion(),
  Ia = new r.Vector3(),
  He = new r.Color(),
  Qt = (e) => 0.34 + Math.log2(1 + e) * 0.3;
function tr(e) {
  for (const a of h.rows) {
    if (a.i === void 0 || a.i >= $e.count) continue;
    const t = a.c,
      n = t.lat * m,
      i = t.lon * m,
      o =
        h.sel === a.cc ||
        (h.selPage && a.pages.some((u) => u.p.slug === h.selPage));
    (Ca(n, i, ia, e, je), Ta(n, i, e, ie));
    const s = Qt(a.n) * (o ? 1.3 : 1),
      c = (0.052 + Math.sqrt(a.n) * 0.012) * (o ? 1.35 : 1);
    (Le.setFromUnitVectors(xa, ie),
      $e.setMatrixAt(a.i, ka.compose(je, Le, Ia.set(c, s, c))));
    const l = (0.3 + Math.sqrt(a.n) * 0.09) * (o ? 1.25 : 1);
    (Ga.setMatrixAt(
      a.i,
      ka.compose(po.copy(je).addScaledVector(ie, 0.012), Le, Ia.set(l, 1, l)),
    ),
      He.copy(a.cc === L ? ro : Hi).lerp(Ki, Math.min(0.22, a.n * 0.016)),
      (h.sel || h.selPage) && He.multiplyScalar(o ? 1.5 : 0.34),
      w.cached && He.multiplyScalar(0.42),
      $e.setColorAt(a.i, He),
      Ga.setColorAt(a.i, He));
    const f = Yi(t);
    for (let u = 0; u < a.pn; u++) {
      const g = a.p0 + u;
      if (g >= ut) break;
      const [b, v] = f[u];
      (Ca(b * m, v * m, ia, e, je),
        Ta(b * m, v * m, e, ie),
        Le.setFromUnitVectors(xa, ie),
        ca.setMatrixAt(g, ka.compose(je, Le, Ia.set(0.04, 0.2, 0.04))),
        la.setMatrixAt(
          g,
          ka.compose(
            po.copy(je).addScaledVector(ie, 0.2),
            Le,
            Ia.set(0.034, 0.034, 0.034),
          ),
        ),
        ca.setColorAt(g, He),
        la.setColorAt(g, He));
    }
  }
  if (_a.visible) {
    const a = W.get(L);
    (Ca(a.lat * m, a.lon * m, ia + 0.02, e, je),
      Ta(a.lat * m, a.lon * m, e, ie),
      Le.setFromUnitVectors(xa, ie),
      _a.matrix.compose(je, Le, Ia.set(1.05, 1, 1.05)),
      (_a.matrixWorldNeedsUpdate = !0));
  }
  for (const a of [$e, Ga, ca, la])
    ((a.instanceMatrix.needsUpdate = !0),
      a.instanceColor && (a.instanceColor.needsUpdate = !0));
}
const da = new r.Vector3(),
  en = [],
  bt = [],
  nr = [".side", ".ctl"];
function or() {
  bt.length = 0;
  for (const n of nr) {
    const i = document.querySelector(n);
    if (!i) continue;
    const o = i.getBoundingClientRect();
    o.width > 0 &&
      getComputedStyle(i).visibility !== "hidden" &&
      bt.push([o.left - 8, o.top - 8, o.right + 8, o.bottom + 8]);
  }
  const e = getComputedStyle(document.documentElement),
    a = Math.min(parseFloat(e.getPropertyValue("--sael-corner-w")) || 260, 340),
    t = Math.min(parseFloat(e.getPropertyValue("--sael-corner-h")) || 260, 340);
  a > 0 &&
    t > 0 &&
    bt.push([
      B.clientWidth - a - 8,
      B.clientHeight - t - 8,
      B.clientWidth,
      B.clientHeight,
    ]);
}
const Ea = 22,
  ha = (e) => {
    const a = e.split(":")[0];
    return a.length > 26 ? a.slice(0, 25) + "\u2026" : a;
  };
function ir(e) {
  ((en.length = 0), or());
  let a = 0;
  const t = Nt.copy(y.position)
    .sub(Ve.set(0, S, 0))
    .normalize();
  if (!h.rows.length) {
    for (const s of fa)
      ((s.userData.want = 0), Yt(s, da.copy(s.position), Ea, 0));
    return;
  }
  const n = h.rows.slice(0, fa.length),
    i = h.sel ? h.rows.find((s) => s.cc === h.sel) : null,
    o = i ? [i, ...n.filter((s) => s !== i)] : n;
  for (const s of o) {
    if (a >= fa.length) break;
    const c = fa[a],
      l = s.c,
      f = l.lat * m,
      u = l.lon * m;
    if (
      (Ca(f, u, ia, e, da),
      da.addScaledVector(Ta(f, u, e, ie), Qt(s.n) + 0.3),
      (e < 0.55 && Se(l.lat, l.lon, ie).dot(t) < 0.12 && i !== s) ||
        (Ve.copy(da).project(y), Ve.z > 1))
    )
      continue;
    const g = (Ve.x * 0.5 + 0.5) * B.clientWidth,
      b = (-Ve.y * 0.5 + 0.5) * B.clientHeight;
    if (g < 96 || g > B.clientWidth - 26 || b < 26 || b > B.clientHeight - 26)
      continue;
    const v =
      s.pages.length && h.sel === s.cc
        ? `${s.n} \xB7 ${s.pages[0].p.live} ${ha(s.pages[0].p.title)}`
        : String(s.n);
    c.userData.set(s.c.name, v, s.cc === L ? "#ffb454" : "#7fe3ff");
    const z = c.userData.pw * Ea * (c.userData.w / c.userData.h) * 0.5 + 5,
      T = Ea * 0.5 + 3;
    let K = !1;
    for (const U of en)
      if (Math.abs(g - U[0]) < z + U[2] && Math.abs(b - U[1]) < T + U[3]) {
        K = !0;
        break;
      }
    if (!K) {
      for (const U of bt)
        if (g + z > U[0] && g - z < U[2] && b + T > U[1] && b - T < U[3]) {
          K = !0;
          break;
        }
    }
    K ||
      (en.push([g, b, z, T]),
      (c.userData.want = le ? 1 : 0),
      Yt(c, da, Ea, 0.5),
      a++);
  }
  for (let s = a; s < fa.length; s++) {
    const c = fa[s];
    ((c.userData.want = 0), Yt(c, da.copy(c.position), Ea, 0));
  }
}
const ke = new r.Group();
de.add(ke);
{
  const e = Ee(1024, 1024, (n, i, o) => {
    ((n.fillStyle = "#0e1117"), n.fillRect(0, 0, i, o));
    const s = Za(5);
    for (let c = 0; c < 420; c++) {
      const l = s();
      ((n.fillStyle = `rgba(${150 + l * 60},${158 + l * 60},${180 + l * 55},${(0.01 + l * 0.016).toFixed(3)})`),
        n.beginPath(),
        n.ellipse(
          s() * i,
          s() * o,
          20 + s() * 300,
          3 + s() * 22,
          s() * 3,
          0,
          7,
        ),
        n.fill());
    }
    ((n.strokeStyle = "rgba(78,84,98,.45)"), (n.lineWidth = 2));
    for (let c = 0; c <= 2; c++)
      (n.beginPath(),
        n.moveTo((c * i) / 2, 0),
        n.lineTo((c * i) / 2, o),
        n.stroke(),
        n.beginPath(),
        n.moveTo(0, (c * o) / 2),
        n.lineTo(i, (c * o) / 2),
        n.stroke());
  });
  ((e.wrapS = e.wrapT = r.RepeatWrapping), e.repeat.set(11.2, 11.2));
  const a = wa(
      new r.MeshStandardMaterial({
        map: e,
        color: "#0f1319",
        roughness: 0.3,
        metalness: 0.12,
        envMapIntensity: 0.05,
      }),
      ci,
    ),
    t = new r.Mesh(new r.PlaneGeometry(420, 420), a);
  ((t.rotation.x = -Math.PI / 2),
    (t.receiveShadow = !0),
    ke.add(t),
    we.push(t));
}
{
  const e = new r.Mesh(
    new r.SphereGeometry(300, 48, 28),
    new r.ShaderMaterial({
      side: r.BackSide,
      depthWrite: !1,
      fog: !1,
      vertexShader:
        "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: `varying vec3 d;
  float h21(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453);}
  void main(){
   float up=d.y;
   vec3 c=mix(vec3(.022,.034,.068),vec3(.008,.013,.030),smoothstep(-.02,.5,up));
   c=mix(vec3(.010,.013,.024),c,smoothstep(-.4,-.02,up));
   c+=vec3(.028,.0105,.0028)*smoothstep(.84,.999,d.x)*(1.-smoothstep(-.004,.030,abs(up-.010)));
   c+=vec3(.40,.175,.048)*smoothstep(.90,.9995,d.x)*(1.-smoothstep(0.,.0042,abs(up-.009)));
   c+=vec3(.013,.032,.068)*smoothstep(.60,.99,-d.x)*(1.-smoothstep(0.,.14,abs(up+.005)));
   // the skyline: small warm lights in a thin band just above the floor line
   float band=1.-smoothstep(.0,.042,abs(up-.013));
   vec2 q=floor(vec2(atan(d.z,d.x)*46.,up*760.));
   float lit=step(.982-.014*smoothstep(-.6,1.,d.x),h21(q));
   c+=vec3(.72,.39,.18)*lit*band*(.36+.64*smoothstep(-.9,1.,d.x));
   gl_FragColor=vec4(c,1.);}`,
    }),
  );
  ((e.renderOrder = -20),
    (e.frustumCulled = !1),
    ke.add(e),
    te.push(e),
    we.push(e));
}
const re = new r.Group();
de.add(re);
{
  ((l, f, u, g = 0.11) => {
    const b = new r.Mesh(new r.TorusGeometry(l, g, 6, 160), Et(f, u));
    return (
      (b.rotation.x = -Math.PI / 2),
      (b.position.y = 0.3),
      ke.add(b),
      te.push(b),
      b
    );
  })(74, "#ffab55", 0.3, 0.045);
  for (let l = 0; l < 8; l++) {
    const f = (l / 8) * Math.PI * 2;
    zn(Math.sin(f) * 74, 0.9, Math.cos(f) * 74, "#ffab55", 11, 0.1);
  }
  const a = oa("#202835", { roughness: 0.6, envMapIntensity: 0.5 }),
    t = it("#343b46", { roughness: 0.38 }),
    n = qa(),
    i = -26,
    o = -64;
  (n
    .box(a, i, 2.3, o, 26, 4.6, 3.4, { r: 0.1 })
    .box(t, i, 4.7, o, 26.3, 0.18, 3.6)
    .box(oa("#161b23", { roughness: 0.5 }), i, 2.7, o + 1.74, 22, 2.6, 0.08),
    n.box(a, i + 23, 5.6, o - 1, 7, 11.2, 3.2, { r: 0.1 }),
    n.flush(re, !0));
  const s = new r.Mesh(
    new r.PlaneGeometry(21.4, 2.3),
    new r.MeshBasicMaterial({
      map: Ee(1024, 120, (l, f, u) => {
        ((l.fillStyle = "#0b111b"), l.fillRect(0, 0, f, u));
        const g = Za(21);
        for (let b = 0; b < 64; b++) {
          const v = b * 16 + 4,
            z = g();
          ((l.fillStyle = `rgba(${110 + z * 120},${170 + z * 70},255,${(0.16 + z * 0.45).toFixed(3)})`),
            l.fillRect(v, u - 8 - z * u * 0.8, 7, z * u * 0.8));
        }
        ((l.fillStyle = "rgba(255,180,100,.8)"), l.fillRect(0, u - 4, f, 3));
      }),
      fog: !1,
      color: new r.Color(0.82, 0.82, 0.82),
    }),
  );
  (s.position.set(i, 2.7, o + 1.82), re.add(s), te.push(s));
  const c = new r.Mesh(
    new r.BoxGeometry(25.6, 0.24, 0.16),
    Et("#ffc07a", 1.25),
  );
  (c.position.set(i, 0.36, o + 1.8), re.add(c));
}
{
  const e = oa("#9a958c", { roughness: 0.6 }),
    a = oa("#7d5244", { roughness: 0.65 }),
    t = qa(),
    n = qa(),
    i = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834", "#577f42"].map((s) =>
      oa(s, { flatShading: !0, roughness: 0.8 }),
    ),
    o = (s, c, l, f, u = 7) => {
      const g = Za(f * 31 + 7);
      t.box(f % 2 ? e : a, s, 1.5 * l, c, 3.6 * l, 3 * l, 3.6 * l, { r: 0.2 });
      for (let b = 0; b < u; b++)
        n.geo(
          i[b % 5],
          xi(1.2 * l * (0.6 + g() * 0.7), 0.34, b + f),
          s + (g() - 0.5) * 2.6 * l,
          (3 + (0.6 + g() * 2.4)) * l,
          c + (g() - 0.5) * 2.4 * l,
        );
    };
  (o(44, -46, 1.5, 3),
    o(-52, -38, 1.3, 8, 6),
    o(62, -72, 1.2, 14, 5),
    o(-34, -78, 1.4, 21, 6),
    t.flush(re),
    n.flush(re));
}
(re.scale.setScalar(1.7), (re.rotation.y = 0.35));
{
  const e = re.clone();
  ((e.rotation.y = re.rotation.y + Math.PI), de.add(e));
  const a = [],
    t = [];
  (re.traverse((n) => a.push(n)),
    e.traverse((n) => t.push(n)),
    a.forEach((n, i) => {
      (te.includes(n) && te.push(t[i]), we.includes(n) && we.push(t[i]));
    }));
}
const Ke = 2.6;
{
  const e = qa();
  (e.cyl(
    it("#262c36", { roughness: 0.5, metalness: 0.28 }),
    0,
    Ke - 0.22,
    0,
    5.3,
    5.3,
    0.44,
    { seg: 72 },
  ),
    e.cyl(oa("#0c0f14", { roughness: 0.7 }), 0, Ke - 0.62, 0, 4.35, 4.35, 0.9, {
      seg: 64,
    }),
    e.cyl(
      it("#161b22", { roughness: 0.56, metalness: 0.3 }),
      0,
      (Ke - 0.44) / 2 - 0.03,
      0,
      4.9,
      5.1,
      Ke - 0.44 + 0.06,
      { seg: 48 },
    ),
    e.flush(ke, !0));
  const a = new r.Mesh(
    new r.TorusGeometry(5.33, 0.035, 6, 96),
    Et("#ffab55", 0.9),
  );
  ((a.rotation.x = -Math.PI / 2),
    (a.position.y = Ke - 0.06),
    ke.add(a),
    te.push(a),
    zn(0, Ke + 0.5, 0, "#ffab55", 5, 0.13));
}
zi(ke, 0, 0.02, 0, 30, 30, 0.3);
const pt = new r.Group();
de.add(pt);
const rr = (() => {
    const e = new r.Group(),
      a = new r.Group();
    ((a.rotation.x = -Math.PI / 2 + 0.92), e.add(a));
    const t = qa();
    (t.box(
      it("#171c24", { roughness: 0.42, metalness: 0.5 }),
      0,
      0,
      -0.06,
      4.3,
      0.62,
      0.12,
      { r: 0.03 },
    ),
      t.flush(a));
    const n = Fn(3.9, { k: 1.05 });
    return (
      (n.position.z = 0.012),
      a.add(n),
      e.position.set(0, Ke + 0.24, 5.16),
      pt.add(e),
      e
    );
  })(),
  sr = (() => {
    const e = new r.Group(),
      a = Fn(5.4, { k: 0.7 });
    ((a.rotation.x = -Math.PI / 2), (a.position.y = 0.02), e.add(a));
    const t = 0.4;
    return (
      ke.add(e),
      (e.rotation.y = t),
      e.position.set(-17, 0, 47).applyAxisAngle(new r.Vector3(0, 1, 0), t),
      e
    );
  })(),
  x = { m: 0, mT: 0, from: 0, at: -9 },
  wt = 1.75;
function De(e, a = !1) {
  ((e = e ? 1 : 0),
    !(x.mT === e && !a) &&
      ((x.from = a ? e : x.m),
      (x.mT = e),
      (x.at = a ? -9 : F),
      Ao.forEach((t) =>
        t.classList.toggle("on", (t.dataset.m === "map") == !!e),
      ),
      a && (x.m = e),
      !H && !I && wo(_[e ? "map" : "globe"], a)));
}
const q = { on: !1, at: 0, dur: wt, from: null, to: null };
function an(e, a) {
  const t = e.peopleYaw ? yo() : e.yaw;
  q.from = {
    yaw: p.yaw + X,
    pitch: p.pitch,
    dist: p.dist,
    t: p.t.clone(),
    fit: Ye,
    hd: Va,
    r: We,
    f: be.clone(),
  };
  const n = e.t.isVector3 ? e.t.clone() : new r.Vector3(...e.t);
  ((q.to = {
    yaw:
      q.from.yaw + ((t - q.from.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI,
    pitch: e.pitch,
    dist: e.dist,
    t: n,
    fit: e.fit || Ye,
    hd: e.hd || e.dist,
    r: e.r || We,
    f: e.f ? new r.Vector3(...e.f) : n.clone(),
  }),
    (q.on = !0),
    (q.at = F),
    (q.dur = a || wt),
    (p.yaw += X),
    (X = 0),
    (nn = F),
    (Xe = 0),
    (se = 1),
    (I = !1));
}
function wo(e, a) {
  const t =
    xe && y.aspect < 0.8 ? { ...e, ...jo[e === _.map ? "map" : "globe"] } : e;
  if (a) {
    Ba(e);
    return;
  }
  an({ ...t, fit: t.fit || e.fit, hd: t.dist, r: t.r || e.r }, wt);
}
function cr() {
  if (!q.on) return;
  const e = k((F - q.at) / q.dur, 0, 1),
    a = jn(e);
  ((p.yaw = D(q.from.yaw, q.to.yaw, a)),
    (p.pitch = D(q.from.pitch, q.to.pitch, a)),
    (p.dist = D(q.from.dist, q.to.dist, a)),
    p.t.lerpVectors(q.from.t, q.to.t, a),
    (We = D(q.from.r, q.to.r, a)),
    be.lerpVectors(q.from.f, q.to.f, a),
    (Ye = [D(q.from.fit[0], q.to.fit[0], a), D(q.from.fit[1], q.to.fit[1], a)]),
    (Va = D(q.from.hd, q.to.hd, a)),
    St(),
    e >= 1 && (q.on = !1));
}
function lr() {
  const e = k((F - x.at) / wt, 0, 1);
  return (
    (x.m = D(x.from, x.mT, jn(e))),
    (Aa.uMorph.value = x.m),
    (oo.material.uniforms.uK.value = (1 - Q(0, 0.45, x.m)) * 0.62),
    (ht.material.uniforms.uK.value = 0.3 + 0.22 * x.m),
    e < 1
  );
}
let tn = -9,
  ue = { lat: 0, lon: 0 };
function vo(e) {
  (!e && F - tn < 5) ||
    ((tn = F), (ue = Ot()), Se(ue.lat, ue.lon, Ae.uSunDir.value), (V = !0));
}
function yo() {
  let e = 0,
    a = 0;
  for (const o of h.rows) {
    const s = o.c.lon * m;
    ((e += Math.cos(s) * o.n), (a += Math.sin(s) * o.n));
  }
  if (e * e + a * a < 1e-9) return (ue.lon - 46) * m;
  const t = Math.atan2(a, e),
    n = ue.lon * m,
    i = ((t - n + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return Math.abs(i) < 0.84 ? n + (i < 0 ? -0.84 : 0.84) : t;
}
const _ = {
    globe: {
      t: [0, S, 0],
      peopleYaw: 1,
      pitch: 0.11,
      dist: 44,
      f: [0, S, 0],
      r: 12,
      fit: [27, 25],
    },
    map: {
      t: [0, S, -0.4],
      yaw: 0.4,
      pitch: 0.8,
      dist: 76,
      f: [0, S, 0],
      r: 26,
      fit: [40, 17],
    },
  },
  jo = {
    globe: { t: [0, S, 0], pitch: 0.09, dist: 52, fit: [17, 20] },
    map: { t: [0, S, 0], yaw: 0.06, pitch: 0.95, dist: 64, fit: [41, 21] },
  },
  p = { t: new r.Vector3(0, S, 0), yaw: 0.26, pitch: 0.11, dist: 44 },
  fr = new r.Vector3(0, S, 0);
let We = 12,
  se = 1,
  vt = 1,
  xe = !1,
  I = !1,
  Ye = [27, 25],
  Va = 44,
  X = 0,
  nn = 0,
  Xe = 0,
  ko = 0;
const dr = 0.082,
  J = C.domElement,
  Je = new Map();
let yt = 0,
  ua = null,
  ge = null,
  on = null;
const xo = new r.Raycaster(),
  qo = new r.Vector2();
function Ba(e) {
  q.on = !1;
  const a = xe && y.aspect < 0.8 ? { ...e, ...jo[x.mT ? "map" : "globe"] } : e;
  (p.t.set(...a.t),
    (p.yaw = a.peopleYaw ? yo() : a.yaw),
    (p.pitch = a.pitch),
    (p.dist = a.dist),
    be.set(...(a.f || e.f)),
    (We = a.r || e.r),
    a.fit && ((Ye = a.fit), (Va = a.dist)),
    (se = 1),
    (I = !1),
    (X = 0),
    (nn = F),
    (Xe = 0),
    St());
}
const zo = 1.25;
function rn(e, a, t) {
  if (x.mT > 0.5) {
    const n = Ma(e * m, a * m, 0, je);
    an(
      {
        yaw: _.map.yaw,
        pitch: _.map.pitch,
        t: new r.Vector3(k(n.x, -15, 15), S, k(n.z, -8, 8)),
        dist: t || _.map.dist * 0.62,
        fit: _.map.fit,
        hd: _.map.dist,
        r: 15,
      },
      zo,
    );
  } else
    an(
      {
        yaw: a * m,
        pitch: k(e * m * 0.78, -0.25, 1.15),
        t: new r.Vector3(0, S, 0),
        dist: t || 34,
        fit: _.globe.fit,
        hd: _.globe.dist,
        r: 8,
      },
      zo,
    );
}
const ga = new r.Vector3();
function sn(e, a) {
  const t = J.getBoundingClientRect(),
    n = e - t.left,
    i = a - t.top;
  let o = null,
    s = 784;
  const c = Nt.copy(y.position)
    .sub(Ve.set(0, S, 0))
    .normalize();
  for (const l of h.rows) {
    const f = l.c;
    if (
      (x.m < 0.55 && Se(f.lat, f.lon, ie).dot(c) < 0.02) ||
      (Ca(f.lat * m, f.lon * m, ia, x.m, ga),
      ga.addScaledVector(Ta(f.lat * m, f.lon * m, x.m, ie), Qt(l.n) * 0.6),
      ga.project(y),
      ga.z > 1)
    )
      continue;
    const u = (ga.x * 0.5 + 0.5) * t.width,
      g = (-ga.y * 0.5 + 0.5) * t.height,
      b = (u - n) ** 2 + (g - i) ** 2;
    b < s && ((s = b), (o = l));
  }
  return o;
}
function Mo(e) {
  const a = J.getBoundingClientRect();
  (qo.set(
    ((e.clientX - a.left) / a.width) * 2 - 1,
    -(((e.clientY - a.top) / a.height) * 2 - 1),
  ),
    xo.setFromCamera(qo, y));
  const t = xo.intersectObjects(
    Bt.map((n) => n.hit).filter((n) => n.visible),
    !1,
  )[0];
  return t ? Bt.find((n) => n.hit === t.object) : null;
}
const cn = (e, a) => {
    ((p.yaw -= e * 0.004),
      (p.pitch = k(p.pitch + a * 0.003, -0.5, 1.38)),
      (I = !0));
  },
  jt = () => x.mT === 0;
function ln(e, a) {
  if (jt()) {
    cn(e, a);
    return;
  }
  const t =
      (y.position.distanceTo(p.t) *
        2 *
        Math.tan(r.MathUtils.degToRad(y.fov / 2))) /
      Math.max(B.clientHeight, 1),
    n = p.yaw + X,
    i = Math.cos(n),
    o = Math.sin(n);
  I = !0;
  const s = (a * t) / Math.max(Math.sin(Math.max(p.pitch, 0.2)), 0.35);
  ((p.t.x = k(p.t.x - i * e * t - o * s, -17, 17)),
    (p.t.z = k(p.t.z + o * e * t - i * s, -9, 9)),
    (p.t.y = S));
}
const Ze = j("#tip");
let Oa = null,
  hr = null;
function ur(e) {
  const a = Mo(e);
  a !== Oa && (Oa?.over(!1), a?.over(!0), (Oa = a));
  const t = a ? null : sn(e.clientX, e.clientY);
  ((hr = t), (J.style.cursor = a || t ? "pointer" : ""));
  let n = "";
  if (a) n = "@RYANSAEL on X";
  else if (t) {
    const i = t.pages[0];
    n =
      `${ct(t.cc)} ${t.c.name} \xB7 ${t.n}` +
      (i ? ` \xB7 ${i.p.live} ${ha(i.p.title)}` : "");
  }
  n
    ? ((Ze.textContent = n),
      (Ze.style.left = e.clientX + "px"),
      (Ze.style.top = e.clientY + "px"),
      Ze.classList.add("on"))
    : Ze.classList.remove("on");
}
(J.addEventListener("contextmenu", (e) => e.preventDefault()),
  J.addEventListener("pointerleave", () => {
    (Oa?.over(!1),
      (Oa = null),
      Ze.classList.remove("on"),
      (J.style.cursor = ""));
  }),
  J.addEventListener("pointerdown", (e) => {
    Fe();
    try {
      J.setPointerCapture(e.pointerId);
    } catch {}
    (Ze.classList.remove("on"),
      Je.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (ua = null),
      (on =
        e.button === 0 && !e.shiftKey && Je.size === 1
          ? Mo(e) || sn(e.clientX, e.clientY)
          : null),
      (ge =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null));
  }),
  J.addEventListener("pointermove", (e) => {
    const a = Je.get(e.pointerId);
    if (!a) {
      ur(e);
      return;
    }
    const t = e.clientX - a[0],
      n = e.clientY - a[1];
    if (
      ((a[0] = e.clientX),
      (a[1] = e.clientY),
      ge && Math.hypot(e.clientX - ge[0], e.clientY - ge[1]) > 6 && (ge = null),
      !ge)
    ) {
      if (((I = !0), Je.size === 2)) {
        const [i, o] = [...Je.values()],
          s = Math.hypot(i[0] - o[0], i[1] - o[1]),
          c = [(i[0] + o[0]) / 2, (i[1] + o[1]) / 2];
        (yt && (se = k((se * yt) / s, 0.32, 2.4)),
          (yt = s),
          ua && !jt() && ln(c[0] - ua[0], c[1] - ua[1]),
          (ua = c));
        return;
      }
      a[2] ? ln(t, n) : cn(t, n);
    }
  }));
const So = (e) => {
  (ge && Je.size === 1 && performance.now() - ge[2] < 450 && gr(on),
    (ge = null),
    (on = null),
    Je.delete(e.pointerId),
    (yt = 0),
    (ua = null));
};
(J.addEventListener("pointerup", So),
  J.addEventListener("pointercancel", (e) => {
    ((ge = null), So(e));
  }),
  J.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        Fe(),
        (I = !0),
        (se = k(
          se * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.32,
          2.4,
        )));
    },
    { passive: !1 },
  ));
function gr(e) {
  if (e) {
    if (e.over) {
      window.open(ei, "_blank", "noopener");
      return;
    }
    Ge(h.sel === e.cc ? null : e.cc, null);
  }
}
J.addEventListener("dblclick", (e) => {
  sn(e.clientX, e.clientY) || dn();
});
const ma = new Set();
(addEventListener("keyup", (e) => ma.delete(e.key.toLowerCase())),
  addEventListener("blur", () => ma.clear()));
const mr = new r.Vector3();
function br() {
  if (!ma.size) return;
  const e = (ma.has("shift") ? 2.4 : 1) * Ie,
    a = (...i) => i.some((o) => ma.has(o));
  let t = 0,
    n = 0;
  (a("a", "arrowleft") && (t += 1),
    a("d", "arrowright") && (t -= 1),
    a("w", "arrowup") && (n += 1),
    a("s", "arrowdown") && (n -= 1),
    (t || n) &&
      (jt()
        ? cn(t * e * 275, n * e * 230)
        : (ln(t * e * 420, 0),
          p.t.addScaledVector(
            mr.set(-Math.sin(p.yaw + X), 0, -Math.cos(p.yaw + X)),
            n * e * 12,
          ),
          (p.t.x = k(p.t.x, -17, 17)),
          (p.t.z = k(p.t.z, -9, 9)))),
    a("q") && (p.yaw += e * 1.1),
    a("e") && (p.yaw -= e * 1.1),
    a("=", "+") && (se = k(se * Math.exp(-e * 1.3), 0.32, 2.4)),
    a("-", "_") && (se = k(se * Math.exp(e * 1.3), 0.32, 2.4)),
    a(
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
    ) && (I = !0));
}
let H = !0,
  Na = -99,
  kt = -1,
  R = null,
  Ua = 0,
  Co = 0;
const fn = [
  { mode: 0, ..._.globe, hold: 11, wide: 1, spin: 1, beats: [] },
  { mode: 0, busiest: 1, dist: 26, hold: 9, f: [0, S, 0], r: 7.5, beats: [] },
  {
    mode: 1,
    t: [0, S, 0],
    yaw: 0.34,
    pitch: 0.3,
    dist: 52,
    f: [0, S, 0],
    r: 18,
    hold: 7,
    wide: 1,
    beats: [[0.4, () => De(1)]],
  },
  { mode: 1, ..._.map, hold: 9, wide: 1, beats: [] },
  {
    mode: 1,
    t: [-8, S, 2],
    yaw: -0.5,
    pitch: 0.19,
    dist: 30,
    f: [-8, S, 0],
    r: 10,
    hold: 8,
    beats: [],
  },
  {
    mode: 0,
    t: [0, S, 0],
    yaw: 0.9,
    pitch: 0.34,
    dist: 48,
    f: [0, S, 0],
    r: 16,
    hold: 7,
    wide: 1,
    beats: [[0.5, () => De(0)]],
  },
];
function To(e, a) {
  ((kt = e),
    (R = fn[e]),
    (Ua = 0),
    R.mode !== void 0 && R.mode !== x.mT && !R.beats.length && De(R.mode));
  let t = R;
  if (R.busiest) {
    const n = h.top;
    n
      ? (t = {
          ...R,
          t: [0, S, 0],
          yaw: n.c.lon * m,
          pitch: k(n.c.lat * m * 0.8, -0.2, 1.1),
        })
      : (t = { ...R, ..._.globe, dist: 22 });
  }
  (Ba({ fit: null, ...t }), (Na = a), (Co = p.yaw));
}
function pr(e) {
  (e < Na - 1 && (Na = e),
    (!R || e - Na > R.hold) && To((kt + 1) % fn.length, e));
  const a = e - Na;
  if (!(a < 0)) {
    for (; Ua < R.beats.length && a >= R.beats[Ua][0];)
      (R.beats[Ua][1](), Ua++);
    I ||
      (R.spin || ((p.yaw = Co + a * 0.006), (X = 0)),
      (p.dist = (R.dist || p.dist) * (1 - a * 0.006)),
      be.set(...(R.f || [0, S, 0])),
      (We = R.r || 10));
  }
}
function qe(e) {
  ((H = e),
    j("#cine").classList.toggle("on", e),
    j("#cine").setAttribute("aria-pressed", e),
    e && ((R = null), (kt = -1), (I = !1), (se = 1)));
}
const Fe = () => {
  ((ko = F),
    (q.on = !1),
    X && ((p.yaw += X), (X = 0)),
    (nn = F),
    (Xe = 0),
    H && qe(!1));
};
function dn() {
  (qe(!1), Ge(null, null), Ba(_[x.mT ? "map" : "globe"]));
}
function wr(e) {
  const a = (!I && !H) || (H && R?.spin),
    t = dr * (1 - Q(0.1, 0.75, x.m));
  (a && F - ko > (H ? 0 : 9)
    ? ((Xe = Math.min(1, Xe + Ie / 1.6)), (X += t * Xe * Ie))
    : a || (Xe = 0),
    cr(),
    St(),
    jt() && !H && !q.on && p.t.lerp(fr, 1 - Math.exp(-Ie * 5)));
  const n = I ? 0 : Math.sin(e / 9) * 0.02,
    i = H ? R?.wide : !0,
    o = p.dist * se * (i ? vt : D(1, vt, 0.5)),
    s = p.yaw + X + n,
    c = Math.asin(k((1.6 - p.t.y) / Math.max(o, 0.1), -1, 1)),
    l = Math.max(p.pitch, c),
    f = Math.cos(l);
  if (
    (y.position.set(
      p.t.x + Math.sin(s) * f * o,
      p.t.y + Math.sin(l) * o,
      p.t.z + Math.cos(s) * f * o,
    ),
    y.lookAt(p.t),
    (pt.rotation.y = s),
    (rr.visible = x.m < 0.5 || xe),
    (sr.visible = x.m >= 0.5 && !xe),
    !H && !I && !q.on)
  ) {
    const v = _[x.mT ? "map" : "globe"];
    (be.set(...v.f), (We = v.r));
  }
  const u = y.position.distanceTo(I ? p.t : be),
    g = I ? Math.min(1, Ie * 6) : 1,
    b = (I ? Math.max(7, u * 0.3) : We) * d.focalBand;
  ((ne.u.focus.value += (u - ne.u.focus.value) * g),
    (ne.u.range.value += (b - ne.u.range.value) * g),
    ne.u.cocScale.value.set(d.apertureNear, d.aperture));
}
const Ao = [...document.querySelectorAll("#seg-mode button")];
Ao.forEach(
  (e) =>
    (e.onclick = () => {
      (Fe(),
        De(e.dataset.m === "map"),
        Qe(e.dataset.m === "map" ? "Flat map" : "Globe"));
    }),
);
const xt = j("#list-ol"),
  Po = j("#list-foot"),
  Ro =
    '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2.5h5.5V8M9.3 2.7 2.5 9.5"/></svg>';
function Ge(e, a) {
  if (
    ((h.sel = e || null),
    (h.selPage = a || null),
    (V = !0),
    (_e = !0),
    e && W.get(e) && !H)
  ) {
    const t = W.get(e);
    rn(t.lat, t.lon);
  }
}
[...document.querySelectorAll("#list .lh button")].forEach(
  (e) =>
    (e.onclick = () => {
      ((h.mode = e.dataset.l),
        [...document.querySelectorAll("#list .lh button")].forEach((a) =>
          a.classList.toggle("on", a === e),
        ),
        Ge(null, null),
        ba());
    }),
);
let Lo = "";
function ba() {
  const e = h.mode === "pg";
  let a,
    t = h.mode + "|" + h.sel + "|" + h.selPage + "|" + w.cached + "|" + L;
  if (
    (e
      ? (a = N.filter((o) => o.n > 0)
          .sort((o, s) => s.n - o.n)
          .map((o) => ({
            k: o.slug,
            n: o.n,
            nm: ha(o.title),
            fl: Object.keys(o.by)
              .filter((s) => W.get(s))
              .slice(0, 3)
              .map(ct)
              .join(""),
            on: h.selPage === o.slug,
            go: Xt(o.slug),
          })))
      : (a = h.rows.map((o) => ({
          k: o.cc,
          n: o.n,
          nm: o.c.name,
          fl: ct(o.cc),
          on: h.sel === o.cc,
          me: o.cc === L,
        }))),
    (t += "|" + a.map((o) => o.k + o.n).join(",")),
    t === Lo)
  )
    return;
  Lo = t;
  const n = Math.max(1, ...a.map((o) => o.n));
  ([...document.querySelectorAll("#list .lh button")].forEach((o) =>
    o.classList.toggle("on", o.dataset.l === h.mode),
  ),
    (xt.innerHTML = a
      .map(
        (o) =>
          `<li data-k="${o.k}" class="${o.on ? "on" : ""}${o.me ? " me" : ""}" title="${o.nm.replace(/"/g, "")}"><i class="bar" style="width:${((o.n / n) * 100).toFixed(1)}%"></i><span class="fl">${o.fl}</span><span class="nm">${o.nm}</span><span class="n">${o.n}</span>` +
          (o.go
            ? `<a class="go" href="${o.go}" target="_blank" rel="noopener" title="Open ${o.nm.replace(/"/g, "")}" aria-label="Open ${o.nm.replace(/"/g, "")}">${Ro}</a>`
            : "") +
          "</li>",
      )
      .join("")),
    [...xt.children].forEach(
      (o) =>
        (o.onclick = (s) => {
          if (s.target.closest("a")) return;
          Fe();
          const c = o.dataset.k;
          (e
            ? Ge(null, h.selPage === c ? null : c)
            : Ge(h.sel === c ? null : c, null),
            ba());
        }),
    ));
  const i = [];
  if (
    (!e && h.unplaced && i.push(`<b>${h.unplaced}</b> not placed`),
    e && !w.rooms && i.push("the page breakdown needs the site to be online"),
    e && w.rooms)
  ) {
    const o = mt() - N.reduce((s, c) => s + c.n, 0);
    o > 0 && i.push(`${o} elsewhere on the site`);
  }
  ((Po.innerHTML = a.length
    ? i.join(" \xB7 ")
    : w.heard
      ? "nobody else is here at this second"
      : "listening\u2026"),
    (Po.className = a.length ? "" : "none"),
    hn());
}
function hn() {
  const e = xt;
  e.classList.toggle("more", e.scrollTop + e.clientHeight < e.scrollHeight - 2);
}
(xt.addEventListener("scroll", hn, { passive: !0 }),
  addEventListener("resize", hn));
function vr() {
  if (h.sel) {
    const t = h.rows.find((n) => n.cc === h.sel);
    if (t) {
      const n = t.pages
        .slice(0, 2)
        .map((i) => `${i.n} ${i.p.live} <b>${ha(i.p.title)}</b>`)
        .join(", ");
      return (
        `<b>${t.c.name}</b>: ${t.n} ${t.n === 1 ? "person" : "people"} here, ${t.day ? "in daylight" : "up at night"}.` +
        (n
          ? ` ${n[0].toUpperCase() + n.slice(1)}.`
          : " Which page they are on is not in yet.")
      );
    }
  }
  if (h.selPage) {
    const t = N.find((n) => n.slug === h.selPage);
    if (t) {
      const n = Object.entries(t.by)
        .filter(([i]) => W.get(i))
        .sort((i, o) => o[1] - i[1])
        .slice(0, 3)
        .map(([i, o]) => `${o} in <b>${Ai(i)}</b>`)
        .join(", ");
      return `<b>${ha(t.title)}</b>: ${t.n} ${t.n === 1 ? "person" : "people"} ${fo(t)}${n ? `, ${n}` : ""}. <a href="${Xt(t.slug)}" target="_blank" rel="noopener">Open it \u2197</a>`;
    }
  }
  const e = mt();
  if (w.cached && !w.heard) {
    const t = Math.max(1, Math.round((Date.now() - w.at) / 6e4));
    return `Waiting for the live count. This is the shape the site had <b>${t} minute${t === 1 ? "" : "s"}</b> ago.`;
  }
  if (!w.heard) return "Asking the site who is here\u2026";
  if (!e)
    return "Nobody is interacting with anything at this second. The lit half of the world is still the lit half.";
  const a = h.top;
  return (
    `<b>${e}</b> ${e === 1 ? "person is" : "people are"} interacting with sael.net right now, in <b>${h.countries}</b> ${h.countries === 1 ? "country" : "countries"}. <span class="c">${h.day}</span> of them ${h.day === 1 ? "is" : "are"} in daylight, ${h.night} up at night.` +
    (a ? ` The busiest is <span class="a">${a.c.name}</span>.` : "")
  );
}
const pa = j("#feat"),
  Do = j("#feat-r");
let Fo = "",
  Go = null,
  $a = null;
const yr = (e) =>
  e >= 1e6
    ? (e / 1e6).toFixed(e >= 1e7 ? 0 : 1) + "M"
    : e >= 1e3
      ? (e / 1e3).toFixed(e >= 1e4 ? 0 : 1) + "k"
      : String(e);
[...pa.querySelectorAll(".fh button")].forEach(
  (e) =>
    (e.onclick = () => {
      ((Go = e.dataset.f), _o());
    }),
);
function _o() {
  const e = N.filter((o) => o.slug && ho(o)),
    a = e.filter((o) => o.n > 0);
  if (!e.length) {
    pa.hidden = !0;
    return;
  }
  const t = Go || (a.length ? "now" : "all"),
    n =
      t === "now"
        ? a.sort((o, s) => s.n - o.n || s.views - o.views).slice(0, 3)
        : e
            .filter((o) => o.views)
            .sort((o, s) => s.views - o.views)
            .slice(0, 3),
    i = t + "|" + n.map((o) => o.slug + (t === "now" ? o.n : "")).join(",");
  i !== Fo &&
    ((Fo = i),
    (pa.hidden = !1),
    [...pa.querySelectorAll(".fh button")].forEach((o) =>
      o.classList.toggle("on", o.dataset.f === t),
    ),
    (Do.innerHTML = n.length
      ? n
          .map((o) => {
            const s = o.title.replace(/[<>&"]/g, ""),
              c = ha(s),
              l =
                t === "now"
                  ? `<i class="now" title="${o.n} ${o.n === 1 ? "person" : "people"} ${fo(o)} now">${o.n} here</i>`
                  : `<i title="visits and X views">${yr(o.views)} views</i>`;
            return `<a class="fc" data-s="${o.slug}" href="${Xt(o.slug)}" target="_blank" rel="noopener" title="Open ${s}"><img src="${ho(o)}" alt="" loading="lazy" decoding="async">${l}<u>${Ro}</u><b>${c}</b></a>`;
          })
          .join("")
      : `<p>${w.heard ? "nobody is on a work at this second" : "listening\u2026"}</p>`),
    [...Do.querySelectorAll(".fc")].forEach((o) => {
      ((o.onpointerenter = () => {
        t !== "now" ||
          h.selPage ||
          (($a = o.dataset.s), (h.selPage = $a), (V = !0), (_e = !0));
      }),
        (o.onpointerleave = () => {
          ($a && h.selPage === $a && ((h.selPage = null), (V = !0), (_e = !0)),
            ($a = null));
        }));
    }),
    Ja.style.setProperty("--feat-h", pa.offsetHeight + "px"));
}
addEventListener("resize", () =>
  Ja.style.setProperty("--feat-h", pa.offsetHeight + "px"),
);
let Io = 0;
function Ha(e) {
  if (!e && F - Io < 0.25) return;
  Io = F;
  const a = mt();
  ((j("#s-n").textContent = w.heard || w.cached ? String(a) : "\u2014"),
    (j("#s-c").textContent =
      w.heard || w.cached ? String(h.countries) : "\u2014"),
    (j("#s-u").textContent =
      w.heard || w.cached ? String(h.unplaced) : "\u2014"),
    document.querySelector(".stat.live").classList.toggle("cold", !w.link),
    (j("#me").hidden = !(L && W.get(L))));
  const t = vr();
  (t !== Ha.w && ((j("#why").innerHTML = t), (Ha.w = t)), ba(), _o());
}
const ze = [
  ["pixelRatio", "Pixel ratio", 1, 2, 0.05, (e) => e.toFixed(2)],
  ["msaa", "MSAA", 0, 4, 2, (e) => (e ? e + "\xD7" : "off")],
  ["smaa", "SMAA", 0, 1, 1, (e) => (e ? "on" : "off")],
  ["shadow", "Shadow map", 512, 4096, 512, (e) => e + "px"],
  ["exposure", "Exposure", 0.6, 1.8, 0.02, (e) => e.toFixed(2)],
  ["fov", "Field of view", 18, 55, 1, (e) => e + "\xB0"],
  ["sun", "Key light", 0, 3, 0.05, (e) => e.toFixed(2)],
  ["fill", "Fill light", 0, 2, 0.05, (e) => e.toFixed(2)],
  ["rim", "Rim light", 0, 3, 0.05, (e) => e.toFixed(2)],
  ["fog", "Haze", 0, 2.5, 0.05, (e) => e.toFixed(2)],
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
let fe = 0,
  Eo = 0,
  un = 0,
  qt = 0,
  zt = 0;
function Z() {
  (C.setPixelRatio(d.pixelRatio),
    ae.setPixelRatio(d.pixelRatio),
    ja.rt.samples !== d.msaa && ((ja.rt.samples = d.msaa), ja.rt.dispose()),
    (Rn.enabled = !!d.smaa),
    E.shadow.mapSize.x !== d.shadow &&
      (E.shadow.mapSize.set(d.shadow, d.shadow),
      E.shadow.map?.dispose(),
      (E.shadow.map = null)),
    (ve.enabled = !!d.bloom),
    (ve.radius = d.bloomRadius),
    (ve.threshold = d.bloomThreshold * 0.98),
    (ve.strength = d.bloomStrength * 0.52),
    P.updateGtaoMaterial({
      radius: d.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: d.ao ? d.aoSamples : 2,
    }),
    (ne.enabled = !!d.dof),
    (ne.u.maxCoc.value = d.maxCoc),
    (C.toneMappingExposure = d.exposure),
    (O.fog.density = 0.0031 * d.fog),
    (xn.value = d.sat),
    (kn.intensity = 0.3 * d.fill),
    (Lt.intensity = 0.3 * d.fill),
    (E.intensity = 0.5 * d.sun),
    (Rt.intensity = 0.55 * d.rim),
    (O.environmentIntensity = 0.6 * d.env),
    (at.uReflStrength.value = 0.26 * d.reflect),
    No());
}
function Me() {
  ((j("#tune-rows").innerHTML = ze
    .map(([e, a, t, n, , i, o], s) => {
      const c = d[e],
        l = ((c - t) / (n - t)) * 100;
      return `<div class="tr${s === fe ? " sel" : ""}${o ? " sub" : ""}" data-i="${s}"><b>${a}</b><span class="tk"><i style="left:${k(l, 0, 100)}%"></i></span><u>${i(c)}</u></div>`;
    })
    .join("")),
    j("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((fe = +e.dataset.i), Me());
        };
        const a = e.querySelector(".tk");
        a.onpointerdown = (t) => {
          (t.stopPropagation(),
            (fe = +e.dataset.i),
            a.setPointerCapture(t.pointerId));
          const n = (i) => {
            const o = a.getBoundingClientRect(),
              [s, , c, l, f] = ze[fe],
              u = k(
                Math.round(
                  (c + ((i.clientX - o.left) / o.width) * (l - c)) / f,
                ) * f,
                c,
                l,
              );
            u !== d[s] &&
              ((d[s] = +u.toFixed(4)), s !== "auto" && (d.auto = 0), Z());
            const g = a.querySelector("i");
            ((g.style.left = k(((d[s] - c) / (l - c)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = ze[fe][5](d[s])),
              (j("#tune-json").value = JSON.stringify(d)));
          };
          (n(t),
            (a.onpointermove = (i) => {
              a.hasPointerCapture(i.pointerId) && n(i);
            }),
            (a.onpointerup = () => Me()));
        };
      }),
    (j("#tune-json").value = JSON.stringify(d)));
}
function jr(e, a) {
  const [t, , n, i, o] = ze[fe],
    s = k(+(d[t] + e * o * (a ? 5 : 1)).toFixed(4), n, i);
  s !== d[t] && ((d[t] = s), t !== "auto" && (d.auto = 0), Z(), Me());
}
function Vo(e) {
  const a = j("#tune"),
    t = e === void 0 ? a.hidden : e;
  ((a.hidden = !t), t && Me());
}
function kr(e) {
  const a = e.key;
  if (a === "ArrowUp" || a === "ArrowDown")
    return (
      (fe = (fe + (a === "ArrowUp" ? -1 : 1) + ze.length) % ze.length),
      Me(),
      j("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (a === "ArrowLeft" || a === "ArrowRight")
    return (jr(a === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (a === "Enter" || a === " ") {
    const [t, , n, i, o] = ze[fe];
    return i - n === o
      ? ((d[t] = d[t] ? 0 : 1), t !== "auto" && (d.auto = 0), Z(), Me(), !0)
      : !1;
  }
  return a === "0" || a === ")"
    ? (e.shiftKey ? Object.assign(d, _t) : (d[ze[fe][0]] = _t[ze[fe][0]]),
      (d.auto = 0),
      Z(),
      Me(),
      !0)
    : a === "c" || a === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(d, null, 1)), !0)
      : a === "Escape"
        ? (Vo(!1), !0)
        : !1;
}
j("#tune-json").addEventListener("change", (e) => {
  try {
    const a = JSON.parse(e.target.value);
    for (const t in _t) typeof a[t] == "number" && (d[t] = a[t]);
    ((d.auto = 0), Z(), Me());
  } catch {
    Me();
  }
});
const Mt = j("#ui-hint");
let Bo = -9;
function Qe(e) {
  ((Mt.textContent = e), Mt.classList.add("on"), (Bo = F));
}
function Oo() {
  if (!(L && W.get(L))) return;
  const e = W.get(L);
  (qe(!1),
    h.rows.some((a) => a.cc === L) ? Ge(L, null) : rn(e.lat, e.lon),
    Qe(
      `${ct(L)} ${e.name} \u2014 you are not in the count: this page only watches`,
    ));
}
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Vo());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    j("#info").open
  )
    return;
  if (!j("#tune").hidden && kr(e)) {
    e.preventDefault();
    return;
  }
  const a = e.key.toLowerCase();
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
    ].includes(a)
  ) {
    (a.startsWith("arrow") && e.preventDefault(),
      a !== "shift" && Fe(),
      ma.add(a));
    return;
  }
  e.repeat ||
    (a === "1"
      ? (Fe(), De(0), Qe("Globe"))
      : a === "2"
        ? (Fe(), De(1), Qe("Flat map"))
        : a === "3"
          ? Oo()
          : a === "4"
            ? ((le = !le),
              j("#labels").classList.toggle("on", le),
              j("#labels").setAttribute("aria-pressed", le),
              Qe(le ? "Labels on" : "Labels off"))
            : a === "c"
              ? j("#cine").click()
              : a === "0"
                ? dn()
                : a === "escape" && (h.sel || h.selPage)
                  ? (Ge(null, null), ba())
                  : a === "/" &&
                    (e.preventDefault(),
                    Ja.classList.toggle("ui-off"),
                    Qe(
                      Ja.classList.contains("ui-off")
                        ? "Interface hidden \xB7 / to show"
                        : "Interface shown",
                    )));
}),
  (j("#cine").onclick = () => {
    H ? dn() : (qe(!0), Qe("Cinematic cameras"));
  }),
  (j("#labels").onclick = () => {
    ((le = !le),
      j("#labels").classList.toggle("on", le),
      j("#labels").setAttribute("aria-pressed", le));
  }),
  (j("#me").onclick = () => {
    (Fe(), Oo());
  }),
  (j("#how").onclick = () => j("#info").showModal()),
  (j("#close").onclick = () => j("#info").close()),
  j("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    j("#tune").hidden || (j("#tune-fps").textContent = Math.round(Eo) + " fps");
  }, 500));
function St() {
  const e = B.clientWidth,
    a = B.clientHeight;
  xe = e < 900;
  const t = (d.fov + (xe ? 8 : 0)) * D(1, 0.6, x.m);
  (Math.abs(y.fov - t) > 1e-4 && ((y.fov = t), y.updateProjectionMatrix()),
    y.setViewOffset(
      e,
      a,
      xe ? 0 : e * D(0.055, 0.022, x.m),
      xe ? a * D(0.07, -0.02, x.m) : -a * 0.012,
      e,
      a,
    ));
  const n = 2 * Math.tan(r.MathUtils.degToRad(y.fov / 2));
  vt = k(
    Math.max(Ye[0] / (n * y.aspect), Ye[1] / n) / Va,
    0.8,
    y.aspect < 0.8 ? 4.5 : 2.4,
  );
}
function No() {
  const e = B.clientWidth,
    a = B.clientHeight;
  ((y.aspect = e / a),
    y.updateProjectionMatrix(),
    C.setSize(e, a),
    ae.setSize(e, a));
  const t = C.getDrawingBufferSize(new r.Vector2());
  (Dt.setSize(Math.round(t.x * 0.5), Math.round(t.y * 0.5)),
    bi.uRes.value.copy(t),
    St(),
    y.updateProjectionMatrix());
}
addEventListener("resize", No);
let Uo = performance.now(),
  gn = 0,
  mn = 0,
  $o = 0,
  _e = !0;
function bn(e) {
  ((At = k((e - Uo) / 1e3, 0, 1.5)), (Ie = Math.min(0.1, At)), (Uo = e));
  const a = e / 1e3;
  ((F = a), vo());
  const t = lr();
  if (
    (H && pr(a),
    br(),
    wr(a),
    y.updateMatrixWorld(),
    Ae.uSunView.value
      .copy(Ae.uSunDir.value)
      .transformDirection(y.matrixWorldInverse),
    V &&
      (bo(),
      (_e = !0),
      h.reaim &&
        ((h.reaim = !1), !I && !H && wo(_[x.mT ? "map" : "globe"], !1))),
    (t || _e) && (tr(x.m), (_e = t)),
    ir(x.m),
    V ? (Ha(!0), (V = !1)) : Ha(),
    Mt.classList.contains("on") && F - Bo > 2.6 && Mt.classList.remove("on"),
    (C.shadowMap.needsUpdate = !0),
    (gn += At),
    mn++,
    e - $o > 1600)
  ) {
    const n = mn / Math.max(gn, 0.001);
    ((gn = 0),
      (mn = 0),
      ($o = e),
      (Eo = n),
      qt++,
      qt > 2 && (un = Math.max(un, n)),
      (zt = qt > 3 && n < un * 0.74 ? zt + 1 : 0),
      d._ceil === void 0 &&
        ((d._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (d._good = 0),
        (d._probe = 0)),
      !document.hidden &&
        d.auto &&
        qt > 3 &&
        (d._probe && n < 55
          ? ((d._probe = 0),
            (d._good = 0),
            (d._ceil = Math.max(1, +(d.pixelRatio - 0.25).toFixed(2))),
            (d.pixelRatio = d._ceil),
            Z())
          : ((d._probe = 0),
            (d._good = n >= 58 ? Math.min(9, d._good + 1) : 0),
            d._good >= 3 &&
              d.pixelRatio < d._ceil &&
              ((d._good = 0),
              (d._probe = 1),
              (d.pixelRatio = Math.min(
                d._ceil,
                +(d.pixelRatio + 0.25).toFixed(2),
              )),
              Z()))),
      !document.hidden &&
        d.auto &&
        zt >= 2 &&
        n < 50 &&
        ((zt = 0),
        d.pixelRatio > 1
          ? ((d.pixelRatio = d._ceil =
              Math.max(1, +(d.pixelRatio - 0.25).toFixed(2))),
            Z())
          : d.reflect
            ? ((d.reflect = 0), Z())
            : d.msaa > 0
              ? ((d.msaa = 0), Z())
              : d.ao && ((d.ao = 0), Z())));
  }
  (li(), C.info.reset(), ae.render());
}
let Ho = !0;
function Ko(e) {
  (requestAnimationFrame(Ko), Ho && bn(e));
}
(vo(!0),
  bo(),
  Z(),
  De(0, !0),
  Ba(_.globe),
  qe(!0),
  Ha(!0),
  j("#loading").remove(),
  requestAnimationFrame(Ko),
  (window.__step = (e) => bn(e)),
  (window.__loop = (e) => {
    Ho = e;
  }),
  (window.__capture = (e = 1200, a = 0.85) => {
    const t = C.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = e),
      (n.height = Math.round((e * t.height) / t.width)),
      n.getContext("2d").drawImage(t, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", a)
    );
  }),
  (window.__shot = async (e, a = 1600, t) => {
    bn(t ?? performance.now());
    const n = window.__capture(a, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + Pt + "/_shots/" + e + ".webp",
        { method: "POST", body: n },
      )
    ).text();
  }),
  (window.__lab = {
    mode: (e, a = !0) => De(e, a),
    cut: (e) => {
      (qe(!0), To(e, F));
    },
    cine: (e) => qe(!!e),
    script: (e) => {
      (qe(!1), e && Ba({ fit: null, ...e }));
    },
    tags: (e) => {
      le = !!e;
    },
    pick: (e, a) => {
      (Ge(e, a), ba());
    },
    look: (e, a, t) => {
      (qe(!1), rn(e, a, t));
    },
    list: (e) => {
      ((h.mode = e), ba());
    },
    feed: (e, a) => {
      if (
        ((w.by = e || {}), (w.heard = !0), (w.cached = !1), (w.n = Zt(w.by)), a)
      ) {
        N.length = 0;
        for (const t of a)
          N.push({
            slug: t.slug,
            room: "w:" + t.slug,
            title: t.title,
            live: t.live || "viewing",
            n: Zt(t.by || {}),
            by: t.by || {},
            poster: t.poster,
            views: t.views || 0,
          });
        w.rooms = N.length;
      }
      return ((V = !0), (_e = !0), w.n);
    },
    me: (e) => {
      ((L = e), (V = !0), (_e = !0));
    },
    sun: (e) => {
      ((ue = Ot(new Date(e))),
        Se(ue.lat, ue.lon, Ae.uSunDir.value),
        (tn = 1e9),
        (V = !0));
    },
    tune: (e) => (Object.assign(d, e), Z(), { ...d }),
    ST: x,
    SH: h,
    LIVE: w,
    PAGES: N,
    HERO: _,
    SHOTS: fn,
  }),
  (window.__x = {
    dof: ne,
    gtao: P,
    bloom: ve,
    renderer: C,
    camera: y,
    scene: O,
    composer: ae,
    cam: p,
    RT: d,
    overlay: It,
    world: de,
    worldG: Ra,
    room: ke,
    markRig: pt,
    backRig: re,
    AIR: oo,
    COLS: $e,
    DISCS: Ga,
    PIPS: ca,
    HEADS: la,
    MERING: _a,
    GEO_U: Aa,
    SUN_U: Ae,
    LAND_MAT: Kn,
    SEA_MAT: Wn,
    focPt: be,
    CT: q,
    ST: x,
  }),
  (window.__dbg = () => ({
    t: +F.toFixed(2),
    mode: x.mT ? "map" : "globe",
    m: +x.m.toFixed(3),
    shot: kt,
    cine: H,
    n: mt(),
    cc: h.countries,
    unplaced: h.unplaced,
    day: h.day,
    rooms: w.rooms,
    link: w.link,
    sun: [+ue.lat.toFixed(2), +ue.lon.toFixed(2)],
    fit: +vt.toFixed(3),
    mob: xe,
    fov: +y.fov.toFixed(1),
    cam: [+p.yaw.toFixed(2), +p.pitch.toFixed(2), +p.dist.toFixed(1)],
    FIT: Ye,
    HD: Va,
    focus: +ne.u.focus.value.toFixed(2),
    range: +ne.u.range.value.toFixed(2),
    land: window.__landStats,
    calls: C.info.render.calls,
    tris: C.info.render.triangles,
  })));
