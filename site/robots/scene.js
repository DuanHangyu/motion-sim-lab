import * as f from "three";
import { EffectComposer as Hh } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as jr,
  FullScreenQuad as ni,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as Cc } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Yh } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as Kh } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as Xh } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as Jh } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as ls } from "three/addons/utils/BufferGeometryUtils.js";
const v = (t) => document.querySelector(t),
  Xo = v("#world"),
  bo = v("#app"),
  D = (t, e, o) => (t < e ? e : t > o ? o : t),
  cs = (t, e, o) => t + (e - t) * o,
  Bo = (t, e, o) => {
    const n = D((o - t) / (e - t), 0, 1);
    return n * n * (3 - 2 * n);
  },
  Lc = (t) => 1 - (1 - t) ** 3,
  Ec = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
function yo(t) {
  return () => {
    ((t |= 0), (t = (t + 1831565813) | 0));
    let e = Math.imul(t ^ (t >>> 15), 1 | t);
    return (
      (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
const ce = Math.random,
  Kt = (t) => {
    const e = Math.sin(t * 127.1 + 311.7) * 43758.5453;
    return e - Math.floor(e);
  },
  mn = "https://x.com/ryansael",
  Nr = "robots",
  si = new URLSearchParams(location.search),
  Zt = new f.Scene();
((Zt.background = new f.Color("#121a2c")),
  (Zt.fog = new f.FogExp2("#26304a", 0.004)));
const H = new f.PerspectiveCamera(30, 1, 0.5, 1400);
let ht;
try {
  ht = new f.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
    preserveDrawingBuffer: !1,
  });
} catch (t) {
  throw (
    (v("#loading").textContent =
      "This game needs WebGL. Try a browser with graphics acceleration on."),
    t
  );
}
const Ic = 25e5,
  Qh = () => {
    const t = innerWidth || 1440,
      e = innerHeight || 840;
    return D(Math.min(devicePixelRatio, 2, Math.sqrt(Ic / (t * e))), 1, 2);
  },
  ai = Qh();
(ht.setPixelRatio(ai),
  (ht.info.autoReset = !1),
  (ht.shadowMap.enabled = !0),
  (ht.shadowMap.type = f.PCFShadowMap),
  (ht.shadowMap.autoUpdate = !1),
  (ht.toneMapping = f.ACESFilmicToneMapping),
  Xo.appendChild(ht.domElement));
const ii = new f.HemisphereLight(9414360, 3155999, 0.55);
Zt.add(ii);
const zt = new f.DirectionalLight(16761994, 1.9);
((zt.castShadow = !0),
  zt.shadow.mapSize.set(2048, 2048),
  (zt.shadow.normalBias = 0.04),
  (zt.shadow.bias = -4e-4),
  (zt.shadow.radius = 2),
  Zt.add(zt, zt.target));
const fs = new f.Vector3(0.72, 0.42, -0.55).normalize(),
  Ur = new f.DirectionalLight(9427199, 0.75);
(Ur.position.set(-30, 24, -40), Zt.add(Ur));
const Vr = new f.DirectionalLight(16773600, 0.42);
(Vr.position.set(-20, 30, 30), Zt.add(Vr));
const Gt = new f.Group();
Zt.add(Gt);
const Jo = 10,
  hs = {
    pos: {
      value: Array.from({ length: Jo }, () => new f.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: Jo }, () => new f.Vector3()) },
  },
  Zh = `uniform vec4 uFakePos[${Jo}];uniform vec3 uFakeCol[${Jo}];uniform float uSat;`,
  td = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${Jo};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  ed = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  Bc = { value: 1.18 };
function _o(t, e) {
  return (
    (t.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: hs.pos,
        uFakeCol: hs.col,
        uSat: Bc,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + Zh,
          )
          .replace("#include <lights_fragment_end>", td)
          .replace("#include <opaque_fragment>", ed)),
        e?.(o));
    }),
    (t.customProgramCacheKey = () => Nr + (e ? e.key : "")),
    t
  );
}
const ri = [];
function _n(t, e, o, n, a, i) {
  const l = { p: new f.Vector3(t, e, o), c: new f.Color(n), r: a, i, i0: i };
  return (ri.push(l), l);
}
const X = {
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
  fe = { lamps: [], tint: [] },
  ea = (t, e) => (fe.tint.push([t, t.color.clone(), new f.Color(e)]), t);
try {
  const t = localStorage.getItem(Nr + "-tod");
  (t === "day" || t === "night") && (X.mode = t);
} catch {}
{
  const t = si.get("tod");
  (t === "day" || t === "night" || t === "cycle") && (X.mode = t);
}
const li = (...t) => {
    const e = _n(...t);
    return ((e.inside = 1), e);
  },
  ci = new f.Vector3(),
  Be = [],
  qr = new f.Vector3(2, 1, -1.5);
function od(t) {
  Be.length = 0;
  for (const e of ri) {
    const o = e.i * (e.inside ? X.inL : X.outL);
    if (!(o <= 0.001)) {
      if (
        ((e.score = (o * e.r) / (1 + e.p.distanceToSquared(t) * 0.01)),
        Be.length < Jo)
      )
        (Be.push(e), Be.length === Jo && Be.sort((n, a) => n.score - a.score));
      else if (e.score > Be[0].score) {
        Be[0] = e;
        for (let n = 0; n < Jo - 1 && Be[n].score > Be[n + 1].score; n++) {
          const a = Be[n];
          ((Be[n] = Be[n + 1]), (Be[n + 1] = a));
        }
      }
    }
  }
}
function _c(t, e) {
  od(e);
  for (let o = 0; o < Jo; o++) {
    const n = Be[o];
    if (!n) {
      (hs.col.value[o].set(0, 0, 0), hs.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (ci.copy(n.p).applyMatrix4(t.matrixWorldInverse),
      hs.pos.value[o].set(ci.x, ci.y, ci.z, 1 / (n.r * n.r)));
    {
      const a = n.i * (n.inside ? X.inL : X.outL);
      hs.col.value[o].set(n.c.r * a, n.c.g * a, n.c.b * a);
    }
  }
}
const ds = {
    uDay: { value: 0 },
    uWarm: { value: 0 },
    uSun: { value: new f.Vector3(0.72, 0.12, -0.55).normalize() },
  },
  Wr = new f.Scene(),
  nd = new f.PMREMGenerator(ht),
  Dc = [];
Wr.add(
  new f.Mesh(
    new f.SphereGeometry(50, 32, 16),
    new f.ShaderMaterial({
      side: f.BackSide,
      uniforms: ds,
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
for (let t = 0; t < 5; t++) {
  const e = (t / 5) * Math.PI * 2 + 0.6,
    o = new f.Mesh(
      new f.BoxGeometry(10, 1.6, 0.4),
      new f.MeshBasicMaterial({ color: new f.Color(2.2, 1.9, 1.6) }),
    );
  (o.position.set(Math.sin(e) * 30, 16 + (t % 2) * 6, Math.cos(e) * 30),
    o.lookAt(0, 0, 0),
    Wr.add(o),
    Dc.push(o));
}
let Pc = null;
function Fc() {
  for (const e of Dc) e.visible = ds.uDay.value < 0.6;
  const t = nd.fromScene(Wr, 0.03);
  (Pc?.dispose(), (Pc = t), (Zt.environment = t.texture));
}
(Fc(), (Zt.environmentIntensity = 0.45));
const kt = 0.08,
  Hr = new f.WebGLRenderTarget(1, 1, {
    type: f.HalfFloatType,
    generateMipmaps: !0,
    minFilter: f.LinearMipmapLinearFilter,
  }),
  fi = {
    tReflect: { value: Hr.texture },
    uReflMatrix: { value: new f.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  sd = Object.assign(
    (t) => {
      (Object.assign(t.uniforms, fi),
        (t.vertexShader = t.vertexShader
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
        (t.fragmentShader = t.fragmentShader
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
  He = new f.PerspectiveCamera(),
  hi = new f.Vector3(0, 1, 0),
  oa = new f.Vector3(0, kt, 0),
  Yr = new f.Vector3(),
  di = new f.Vector3(),
  Kr = new f.Matrix4(),
  na = new f.Plane(),
  Qo = new f.Vector4(),
  Oc = new f.Vector4(),
  eo = [];
function zc() {
  if (
    !E.reflect ||
    fi.uReflStrength.value <= 0 ||
    H.position.y <= kt ||
    !zt.shadow.map
  )
    return;
  (Yr.setFromMatrixPosition(H.matrixWorld),
    Kr.extractRotation(H.matrixWorld),
    He.position.subVectors(oa, Yr).reflect(hi).negate().add(oa),
    di.set(0, 0, -1).applyMatrix4(Kr).add(Yr),
    di.subVectors(oa, di).reflect(hi).negate().add(oa),
    He.up.set(0, 1, 0).applyMatrix4(Kr).reflect(hi),
    He.lookAt(di),
    (He.far = H.far),
    (He.near = H.near),
    He.updateMatrixWorld(),
    He.projectionMatrix.copy(H.projectionMatrix),
    fi.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(He.projectionMatrix)
      .multiply(He.matrixWorldInverse),
    na
      .setFromNormalAndCoplanarPoint(hi, oa)
      .applyMatrix4(He.matrixWorldInverse),
    Qo.set(na.normal.x, na.normal.y, na.normal.z, na.constant));
  const t = He.projectionMatrix.elements;
  (Oc.set(
    (Math.sign(Qo.x) + t[8]) / t[0],
    (Math.sign(Qo.y) + t[9]) / t[5],
    -1,
    (1 + t[10]) / t[14],
  ),
    Qo.multiplyScalar(2 / Qo.dot(Oc)),
    (t[2] = Qo.x),
    (t[6] = Qo.y),
    (t[10] = Qo.z + 1),
    (t[14] = Qo.w));
  const e = eo.map((n) => n.visible),
    o = ht.shadowMap.needsUpdate;
  (eo.forEach((n) => (n.visible = !1)),
    (ht.shadowMap.needsUpdate = !1),
    _c(He, qr),
    ht.setRenderTarget(Hr),
    ht.clear(),
    ht.render(Zt, He),
    ht.setRenderTarget(null),
    eo.forEach((n, a) => (n.visible = e[a])),
    (ht.shadowMap.needsUpdate = o));
}
const ad =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  ui = (t, e) =>
    new f.ShaderMaterial({
      uniforms: e,
      vertexShader: ad,
      fragmentShader: t,
      depthTest: !1,
      depthWrite: !1,
    });
class id extends jr {
  constructor(e) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new f.WebGLRenderTarget(1, 1, {
        type: f.HalfFloatType,
        samples: e,
        depthTexture: new f.DepthTexture(1, 1),
      })),
      (this.quad = new ni(
        ui(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(e, o) {
    this.rt.setSize(e, o);
  }
  render(e, o, n) {
    (_c(H, qr),
      e.setRenderTarget(this.rt),
      e.clear(),
      e.render(Zt, H),
      e.setRenderTarget(n),
      this.quad.render(e));
  }
}
const Gc = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?.75:1.3),0.)/max(focus,1.)*12.*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class rd extends jr {
  constructor() {
    super();
    const e = { type: f.HalfFloatType };
    ((this.half = new f.WebGLRenderTarget(1, 1, e)),
      (this.blurRT = new f.WebGLRenderTarget(1, 1, e)),
      (this.u = {
        tColor: { value: null },
        tDepth: { value: null },
        tHalf: { value: this.half.texture },
        tBlur: { value: this.blurRT.texture },
        near: { value: H.near },
        far: { value: H.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new f.Vector2(1, 0.5) },
        maxCoc: { value: 11 },
        texel: { value: new f.Vector2() },
        fullTexel: { value: new f.Vector2() },
      }),
      (this.pre = new ni(
        ui(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Gc}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new ni(
        ui(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<64;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new ni(
        ui(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${Gc}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(e, o) {
    const n = Math.ceil(e / 2),
      a = Math.ceil(o / 2);
    (this.half.setSize(n, a),
      this.blurRT.setSize(n, a),
      this.u.texel.value.set(1 / n, 1 / a),
      this.u.fullTexel.value.set(1 / e, 1 / o));
  }
  render(e, o, n) {
    ((this.u.tColor.value = n.texture),
      e.setRenderTarget(this.half),
      this.pre.render(e),
      e.setRenderTarget(this.blurRT),
      this.blur.render(e),
      e.setRenderTarget(this.renderToScreen ? null : o),
      this.comp.render(e));
  }
}
const E = {
    auto: 1,
    pixelRatio: ai,
    msaa: ai >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 4096,
    shadowMin: 2048,
    exposure: 1.12,
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
  Xr = { ...E },
  Ye = new Hh(
    ht,
    new f.WebGLRenderTarget(1, 1, { type: f.HalfFloatType, depthBuffer: !1 }),
  );
Ye.setPixelRatio(ai);
const sa = new id(E.msaa);
Ye.addPass(sa);
const It = new Cc(Zt, H, 1, 1);
((It.output = Cc.OUTPUT.Off),
  (It.needsSwap = !1),
  It.updateGtaoMaterial({
    radius: 1,
    thickness: 1.2,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  It.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const ld = It.setSize.bind(It),
  cd = It.render.bind(It);
It.setSize = (t, e) => ld(Math.ceil(t / 2), Math.ceil(e / 2));
const oo = [],
  jc = [];
((It.render = (t, e, o) => {
  (oo.forEach((n, a) => {
    ((jc[a] = n.visible), (n.visible = !1));
  }),
    E.ao
      ? cd(t, e, o)
      : (It._overrideVisibility(),
        It._renderOverride(
          t,
          It.normalMaterial,
          It.normalRenderTarget,
          7829503,
          1,
        ),
        It._restoreVisibility()),
    oo.forEach((n, a) => (n.visible = jc[a])),
    E.ao &&
      ((It.blendMaterial.uniforms.intensity.value = E.aoIntensity),
      (It.blendMaterial.uniforms.tDiffuse.value = It.pdRenderTarget.texture),
      It._renderPass(t, It.blendMaterial, o)));
}),
  Ye.addPass(It));
const Zo = new Yh(new f.Vector2(256, 256), 0.5, 0.55, 1),
  fd = Zo.setSize.bind(Zo);
((Zo.setSize = (t, e) => fd(Math.ceil(t / 2), Math.ceil(e / 2))),
  Ye.addPass(Zo));
const bn = new rd();
((bn.u.tDepth.value = sa.rt.depthTexture), Ye.addPass(bn));
const Jr = new f.Scene(),
  Nc = {
    tSceneDepth: { value: It.depthTexture },
    uRes: { value: new f.Vector2(1, 1) },
    uNF: { value: new f.Vector2(H.near, H.far) },
  };
class hd extends jr {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(e, o, n) {
    const a = e.autoClear;
    ((e.autoClear = !1),
      e.setRenderTarget(n),
      e.render(Jr, H),
      (e.autoClear = a));
  }
}
(Ye.addPass(new hd()), Ye.addPass(new Kh()));
const Uc = new Xh();
Ye.addPass(Uc);
const dd = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  ud = (t, e, o, n = 0.06, a = 2) =>
    new Jh(t, e, o, a, Math.min(n, Math.min(t, e, o) / 2.02)),
  no = new Map();
function B(t, e = {}) {
  const o = "M" + t + JSON.stringify(e);
  return (
    no.has(o) ||
      no.set(
        o,
        _o(
          new f.MeshStandardMaterial({
            color: t,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...e,
          }),
        ),
      ),
    no.get(o)
  );
}
function Vc(t, e = {}) {
  const o = "P" + t + JSON.stringify(e);
  return (
    no.has(o) ||
      no.set(
        o,
        _o(
          new f.MeshPhysicalMaterial({
            color: t,
            roughness: 0.34,
            clearcoat: 1,
            clearcoatRoughness: 0.16,
            envMapIntensity: 1.1,
            ...e,
          }),
        ),
      ),
    no.get(o)
  );
}
function Rt(t, e = {}) {
  const o = "T" + t + JSON.stringify(e);
  return (
    no.has(o) ||
      no.set(
        o,
        _o(
          new f.MeshPhysicalMaterial({
            color: t,
            metalness: 0.85,
            roughness: 0.32,
            envMapIntensity: 1.25,
            clearcoat: 0.35,
            clearcoatRoughness: 0.3,
            ...e,
          }),
        ),
      ),
    no.get(o)
  );
}
const be = (t, e = 1) => {
    const o = "G" + t + e;
    return (
      no.has(o) ||
        no.set(
          o,
          new f.MeshBasicMaterial({
            color: new f.Color(t).multiplyScalar(e),
            fog: !1,
          }),
        ),
      no.get(o)
    );
  },
  Bp = Rt("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  Qr = Rt("#434a55", { roughness: 0.36 }),
  _p = Rt("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Dp = Rt("#15171b", { roughness: 0.46, metalness: 0.55 }),
  pd = Rt("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  Pp = Rt("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  us = B("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  Do = new f.Matrix4(),
  yn = new f.Quaternion(),
  pi = new f.Euler(0, 0, 0, "YXZ"),
  qc = new f.Vector3(1, 1, 1),
  gd = new f.Color(),
  Fp = new f.Vector3(1, 0, 0),
  ps = new f.Vector3(0, 1, 0),
  Op = new f.Vector3(0, 0, 1),
  md = new f.Vector3(),
  bd = new f.Quaternion();
function bt() {
  const t = new Map(),
    e = (o, n, a, i, l, r) => {
      n = n.index ? n.toNonIndexed() : n;
      for (const h of Object.keys(n.attributes))
        ["position", "normal", "uv"].includes(h) || n.deleteAttribute(h);
      (n.attributes.uv ||
        n.setAttribute(
          "uv",
          new f.Float32BufferAttribute(
            new Float32Array(n.attributes.position.count * 2),
            2,
          ),
        ),
        r.dir
          ? (yn.setFromUnitVectors(
              ps,
              md.set(r.dir[0], r.dir[1], r.dir[2]).normalize(),
            ),
            r.roll && yn.multiply(bd.setFromAxisAngle(ps, r.roll)))
          : (pi.set(r.rx || 0, r.ry || 0, r.rz || 0), yn.setFromEuler(pi)),
        n.applyMatrix4(
          Do.compose(
            { x: a, y: i, z: l },
            yn,
            r.s ? qc.set(r.s[0], r.s[1], r.s[2]) : qc.set(1, 1, 1),
          ),
        ));
      let c = t.get(o);
      (c || t.set(o, (c = { mat: o, list: [] })), c.list.push(n));
    };
  return {
    box(o, n, a, i, l, r, c, h = {}) {
      return (
        e(o, h.r ? ud(l, r, c, h.r) : new f.BoxGeometry(l, r, c), n, a, i, h),
        this
      );
    },
    cyl(o, n, a, i, l, r, c, h = {}) {
      return (
        e(
          o,
          new f.CylinderGeometry(l, r, c, h.seg || 20, 1, !!h.open),
          n,
          a,
          i,
          h,
        ),
        this
      );
    },
    cone(o, n, a, i, l, r, c = {}) {
      return (
        e(
          o,
          new f.ConeGeometry(l, r, c.seg || 6).translate(0, r / 2, 0),
          n,
          a,
          i,
          c,
        ),
        this
      );
    },
    sph(o, n, a, i, l, r = {}) {
      return (
        e(o, new f.SphereGeometry(l, r.seg || 14, r.seg2 || 10), n, a, i, r),
        this
      );
    },
    tor(o, n, a, i, l, r, c = {}) {
      return (
        e(
          o,
          new f.TorusGeometry(
            l,
            r,
            c.seg2 || 8,
            c.seg || 40,
            c.arc || Math.PI * 2,
          ),
          n,
          a,
          i,
          c,
        ),
        this
      );
    },
    geo(o, n, a = 0, i = 0, l = 0, r = {}) {
      return (e(o, n.clone(), a, i, l, r), this);
    },
    geos() {
      const o = [];
      for (const { mat: n, list: a } of t.values())
        (o.push([n, ls(a)]), a.forEach((i) => i.dispose()));
      return (t.clear(), o);
    },
    flush(o, n = !0) {
      const a = [];
      for (const { mat: i, list: l } of t.values()) {
        const r = new f.Mesh(ls(l), i);
        ((r.castShadow = n),
          (r.receiveShadow = !0),
          o.add(r),
          a.push(r),
          l.forEach((c) => c.dispose()));
      }
      return (t.clear(), a);
    },
  };
}
const gi = [];
document.fonts?.ready.then(() => gi.forEach((t) => t()));
function aa(t, e, o, n, a, i = 0.9, l = {}) {
  const r = document.createElement("canvas");
  ((r.width = o), (r.height = n));
  const c = r.getContext("2d"),
    h = new f.CanvasTexture(r);
  ((h.anisotropy = 8), (h.colorSpace = f.SRGBColorSpace));
  const d = new f.Mesh(
    new f.PlaneGeometry(t, e),
    new f.MeshBasicMaterial({
      map: h,
      alphaTest: 0.3,
      fog: !1,
      side: f.DoubleSide,
      color: new f.Color(i, i, i),
      ...l,
    }),
  );
  return (
    (d.userData = {
      c: r,
      g: c,
      t: h,
      redraw(m) {
        (c.clearRect(0, 0, o, n), m(c, o, n), (h.needsUpdate = !0));
      },
    }),
    a && (d.userData.redraw(a), gi.push(() => d.userData.redraw(a))),
    d
  );
}
const gs = (t, e, o, n, a, i) => {
    (t.beginPath(), t.roundRect(e, o, n, a, i));
  },
  ms = (t, e, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = t), (a.height = e), o(a.getContext("2d"), t, e));
    const i = new f.CanvasTexture(a);
    return (n && (i.colorSpace = f.SRGBColorSpace), (i.anisotropy = 8), i);
  },
  yd = ms(
    128,
    128,
    (t) => {
      const e = t.createRadialGradient(64, 64, 0, 64, 64, 64);
      (e.addColorStop(0, "#fff"),
        e.addColorStop(0.35, "#ffffff88"),
        e.addColorStop(1, "#fff0"),
        (t.fillStyle = e),
        t.fillRect(0, 0, 128, 128));
    },
    !1,
  ),
  xd = (t, e, o = yd) =>
    new f.MeshBasicMaterial({
      map: o,
      color: t,
      transparent: !0,
      opacity: e,
      blending: f.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function Wc(t, e = 0.3, o = 1, n = 0) {
  const a = new f.IcosahedronGeometry(t, n),
    i = a.attributes.position,
    l = yo(o),
    r = new Map();
  for (let c = 0; c < i.count; c++) {
    const h =
      i.getX(c).toFixed(3) +
      "," +
      i.getY(c).toFixed(3) +
      "," +
      i.getZ(c).toFixed(3);
    r.has(h) ||
      r.set(h, [1 + (l() - 0.5) * e, 1 + (l() - 0.5) * e, 1 + (l() - 0.5) * e]);
    const d = r.get(h);
    i.setXYZ(c, i.getX(c) * d[0], i.getY(c) * d[1], i.getZ(c) * d[2]);
  }
  return (a.computeVertexNormals(), a);
}
const wd = ms(
  128,
  128,
  (t) => {
    const e = t.createRadialGradient(64, 64, 0, 64, 64, 64);
    (e.addColorStop(0, "rgba(0,0,0,1)"),
      e.addColorStop(0.45, "rgba(0,0,0,.55)"),
      e.addColorStop(1, "rgba(0,0,0,0)"),
      (t.fillStyle = e),
      t.fillRect(0, 0, 128, 128));
  },
  !1,
);
function zp(t, e, o, n, a, i, l = 0.5) {
  const r = new f.Mesh(
    new f.PlaneGeometry(a, i),
    new f.MeshBasicMaterial({
      map: wd,
      transparent: !0,
      opacity: l,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (r.rotation.x = -Math.PI / 2),
    r.position.set(e, o + 0.004, n),
    (r.renderOrder = -1),
    t.add(r),
    oo.push(r),
    r
  );
}
const mi = [];
function vd(t, e, o, n, a, i = 128, l = "@RYANSAEL ON X") {
  const r = () => {
    ((t.font = `${n ? 700 : 600} ${i}px Outfit, sans-serif`),
      (t.letterSpacing = Math.round(i * 0.08) + "px"));
  };
  r();
  const c = t.measureText(l).width;
  c > e - 28 && ((i = Math.floor((i * (e - 28)) / c)), r());
  const h = e / 2 + Math.round(i * 0.04),
    d = o / 2 + i * 0.35;
  if (((t.textAlign = "center"), (t.textBaseline = "alphabetic"), n)) {
    ((t.fillStyle = "#fbf8f2"),
      t.fillText(l, h, d + i * 0.05),
      (t.fillStyle = a ? "#e08a24" : "#38332d"),
      t.fillText(l, h, d));
    return;
  }
  ((t.fillStyle = "#040506"),
    t.fillText(l, h + i * 0.02, d + i * 0.065),
    (t.fillStyle = "#fff0cc"),
    t.fillText(l, h, d - i * 0.025));
  const m = t.createLinearGradient(0, d - i * 0.7, 0, d);
  (m.addColorStop(0, "#f1d08c"),
    m.addColorStop(1, "#b3833d"),
    (t.fillStyle = m),
    t.fillText(l, h, d));
}
function kd(t, e = {}) {
  const o = !!e.pale,
    n = e.k ?? (o ? 0.92 : 0.6);
  let a = !1;
  const i = (r, c, h) => vd(r, c, h, o, a, 128, e.text),
    l = aa(t, t * 0.1375, 1280, 176, i, n, { alphaTest: 0.25 });
  return (
    (l.userData.mark = 1),
    eo.push(l),
    mi.push({
      hit: l,
      over(r) {
        ((a = r),
          o
            ? l.userData.redraw(i)
            : l.material.color.setRGB(r ? 3.4 : n, r ? 2.5 : n, r ? 1.4 : n));
      },
    }),
    l
  );
}
class Md {
  constructor(e) {
    this.max = e;
    const o = new f.BufferGeometry();
    ((this.pos = new Float32Array(e * 12)),
      (this.side = new Float32Array(e * 4)),
      (this.col = new Float32Array(e * 16)));
    const n = new Uint32Array(e * 6);
    for (let a = 0; a < e; a++) {
      const i = a * 4;
      n.set([i, i + 1, i + 2, i + 1, i + 3, i + 2], a * 6);
    }
    (o.setAttribute(
      "position",
      new f.BufferAttribute(this.pos, 3).setUsage(f.DynamicDrawUsage),
    ),
      o.setAttribute(
        "aSide",
        new f.BufferAttribute(this.side, 1).setUsage(f.DynamicDrawUsage),
      ),
      o.setAttribute(
        "aCol",
        new f.BufferAttribute(this.col, 4).setUsage(f.DynamicDrawUsage),
      ),
      o.setIndex(new f.BufferAttribute(n, 1)),
      (this.mesh = new f.Mesh(
        o,
        new f.ShaderMaterial({
          uniforms: { ...Nc, uSoft: { value: 0.6 } },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: f.AdditiveBlending,
          side: f.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${dd}varying float vS;varying vec4 vC;uniform float uSoft;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Jr.add(this.mesh));
  }
  begin() {
    this.n = 0;
  }
  seg(e, o, n, a, i, l, r) {
    if (this.n >= this.max) return;
    const c = this.n++;
    (Hc.subVectors(o, e),
      Yc.addVectors(e, o).multiplyScalar(0.5),
      Kc.subVectors(H.position, Yc),
      ye.crossVectors(Hc, Kc));
    const h = ye.length();
    h < 1e-9 ? ye.set(0, n ? 1 : 0, 0) : ye.multiplyScalar(1 / h);
    const d = this.pos,
      m = c * 12;
    ((d[m] = e.x - ye.x * n),
      (d[m + 1] = e.y - ye.y * n),
      (d[m + 2] = e.z - ye.z * n),
      (d[m + 3] = e.x + ye.x * n),
      (d[m + 4] = e.y + ye.y * n),
      (d[m + 5] = e.z + ye.z * n),
      (d[m + 6] = o.x - ye.x * a),
      (d[m + 7] = o.y - ye.y * a),
      (d[m + 8] = o.z - ye.z * a),
      (d[m + 9] = o.x + ye.x * a),
      (d[m + 10] = o.y + ye.y * a),
      (d[m + 11] = o.z + ye.z * a),
      this.side.set(Sd, c * 4));
    const u = this.col,
      g = c * 16;
    for (let b = 0; b < 4; b++)
      ((u[g + b * 4] = i.r),
        (u[g + b * 4 + 1] = i.g),
        (u[g + b * 4 + 2] = i.b),
        (u[g + b * 4 + 3] = b < 2 ? l : r));
  }
  dot(e, o, n, a) {
    (Zr.set(1, 0, 0)
      .applyQuaternion(H.quaternion)
      .multiplyScalar(xo(e, o) * 0.9),
      Xc.copy(e).sub(Zr),
      Jc.copy(e).add(Zr),
      this.seg(Xc, Jc, xo(e, o), xo(e, o), n, a, a));
  }
  line(e, o, n, a) {
    for (let i = 0; i < e.length - 1; i++) {
      const l = i / (e.length - 1),
        r = (i + 1) / (e.length - 1);
      this.seg(
        e[i],
        e[i + 1],
        xo(e[i], o),
        xo(e[i + 1], o),
        n,
        a ? a(l) : 1,
        a ? a(r) : 1,
      );
    }
  }
  end() {
    const e = this.mesh.geometry,
      o = Math.max(this.n, 1);
    e.setDrawRange(0, this.n * 6);
    for (const [n, a] of [
      ["position", 12],
      ["aSide", 4],
      ["aCol", 16],
    ]) {
      const i = e.attributes[n];
      (i.clearUpdateRanges(), i.addUpdateRange(0, o * a), (i.needsUpdate = !0));
    }
  }
}
const Sd = [-1, 1, -1, 1],
  Hc = new f.Vector3(),
  Yc = new f.Vector3(),
  Kc = new f.Vector3(),
  ye = new f.Vector3(),
  Zr = new f.Vector3(),
  Xc = new f.Vector3(),
  Jc = new f.Vector3(),
  _e = new Md(9e3),
  xo = (t, e) =>
    ((H.position.distanceTo(t) *
      Math.tan(f.MathUtils.degToRad(H.fov / 2)) *
      2) /
      Math.max(Xo.clientHeight, 1)) *
    e *
    0.5,
  j = 40,
  Qc = 28,
  Bt = j * Qc,
  wo = 40,
  $d = 0.3,
  ia = 1e7,
  Rd = 24,
  Td = 10,
  bi = 4,
  ra = 45,
  la = 25,
  Zc = 0.06,
  Ad = 0.0025,
  Cd = 60,
  tf = {
    bench: 2,
    cell: 6,
    line: 12,
    giga: 20,
    auto: 30,
    wind: 1.5,
    act: 4,
    aline: 10,
    aplant: 20,
  },
  Ld = {
    outlet: 0,
    panel: 3,
    xfmr: 8,
    sub: 16,
    solar: 25,
    smr: 40,
    fusion: 60,
  },
  tl = [0, 5, 10, 16, 24, 32, 40, 50],
  Tt = {
    gate: { gen: 2, wage: 150, bots: 2 },
    dock: { gen: 3, wage: 150, bots: 2 },
    fix: { gen: 5, wage: 400, bots: 4 },
    build: { gen: 4, bots: 6 },
  };
let el = 300;
const yi = 4,
  xi = [5e3, 8e4, 15e5, 3e7, 5e8, 8e9],
  Q = [
    null,
    {
      id: "bench",
      kind: "station",
      name: "Workbench",
      crew: 2,
      rate: 0.034,
      kw: 0.4,
      cost: 2500,
      gen: 0,
      cls: 0,
      desc: "A bench, a lamp and a tray of parts. You build here by hand, and one robot can help.",
    },
    {
      id: "cell",
      kind: "station",
      name: "Assembly cell",
      crew: 3,
      rate: 0.6,
      kw: 12,
      cost: 6e5,
      gen: 1,
      cls: 1,
      desc: "A frame holds the robot upright while three robots build it.",
    },
    {
      id: "line",
      kind: "station",
      name: "Robot line",
      crew: 4,
      rate: 2.2,
      kw: 150,
      cost: 18e6,
      gen: 3,
      cls: 2,
      desc: "Legs, torso, arms and head go on at four stations as the line moves.",
    },
    {
      id: "giga",
      kind: "station",
      name: "Gigaline",
      crew: 6,
      rate: 5.5,
      kw: 1100,
      cost: 14e7,
      gen: 5,
      cls: 2,
      desc: "Cast frames, a turntable of robots and six robots building round it.",
    },
    {
      id: "auto",
      kind: "station",
      name: "Self-building line",
      crew: 8,
      rate: 12,
      kw: 6e3,
      cost: 5e8,
      gen: 6,
      cls: 3,
      desc: "Speculative: robots building and repairing robots, with nobody else on the floor.",
    },
    {
      id: "wind",
      kind: "parts",
      name: "Winding bench",
      supply: 12,
      range: 1,
      kw: 0.2,
      cost: 1500,
      gen: 0,
      cls: 0,
      desc: "Copper wound into motors by hand, a dozen a day. Feeds the eight tiles around it.",
    },
    {
      id: "act",
      kind: "parts",
      name: "Actuator cell",
      supply: 160,
      range: 1,
      kw: 6,
      cost: 3e5,
      gen: 1,
      cls: 1,
      desc: "Motors, gearboxes and encoders put together and tested. Feeds the eight tiles around it.",
    },
    {
      id: "aline",
      kind: "parts",
      name: "Actuator line",
      supply: 900,
      range: 1,
      kw: 80,
      cost: 12e6,
      gen: 3,
      cls: 2,
      desc: "Roller screws, magnets and motors on an automated line. Feeds the eight tiles around it.",
    },
    {
      id: "aplant",
      kind: "parts",
      name: "Actuator plant",
      supply: 12e3,
      range: 2,
      kw: 1500,
      cost: 35e7,
      gen: 5,
      cls: 3,
      desc: "A whole plant, magnets to finished joints. Feeds every tile two out.",
    },
  ];
Q.forEach((t, e) => {
  t && (t.ix = e);
});
const Gp = Q.filter((t) => t?.kind === "station").map((t) => t.ix),
  jp = Q.filter((t) => t?.kind === "parts").map((t) => t.ix),
  At = Object.fromEntries(Q.filter(Boolean).map((t) => [t.id, t])),
  wi = [
    "hand-wound motors",
    "an actuator cell",
    "an actuator line",
    "an actuator plant",
  ],
  Po = [
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
      cost: 4e3,
      gen: 0,
      max: 1,
      desc: "An electrician runs a 200 amp panel into the garage.",
    },
    {
      id: "xfmr",
      name: "Transformer",
      kw: 2500,
      cost: 4e5,
      gen: 1,
      max: 4,
      desc: "A pad-mounted transformer straight off the utility line.",
    },
    {
      id: "sub",
      name: "Substation",
      kw: 5e4,
      cost: 6e7,
      gen: 3,
      max: 4,
      desc: "Your own substation on the high-voltage grid.",
    },
    {
      id: "solar",
      name: "Solar and batteries",
      kw: 15e4,
      cost: 8e8,
      gen: 4,
      max: 6,
      desc: "A solar farm and a battery park, so the line runs through the night.",
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
      cost: 45e9,
      gen: 6,
      max: 3,
      desc: "Speculative. Two gigawatts from a ring of plasma.",
    },
  ],
  tn = Object.fromEntries(Po.map((t) => [t.id, t])),
  pt = [
    [4, 3, 0, "Garage"],
    [6, 4, 8e3, "Double garage"],
    [8, 6, 15e5, "Workshop"],
    [12, 8, 25e6, "Machine shop"],
    [16, 11, 35e7, "Factory"],
    [22, 15, 25e8, "Big factory"],
    [30, 20, 18e9, "Megafactory"],
    [40, 28, 12e10, "Gigafactory"],
  ],
  yt = [
    {
      cls: "Teleoperated",
      what: "A person in a VR headset drives it",
      who: "research labs",
      skill: 1,
      price: 2e4,
      D: 0.1,
      T: 165,
    },
    {
      cls: "Walks",
      what: "It walks and keeps its balance on its own",
      who: "labs and trade shows",
      skill: 1.15,
      price: 24e3,
      D: 2,
      T: 234e3,
      round: "Pre-seed",
    },
    {
      cls: "Pick and place",
      what: "It moves boxes from one place to another",
      who: "warehouses",
      skill: 1.3,
      price: 29e3,
      D: 16,
      T: 55e5,
      round: "Seed",
    },
    {
      cls: "Factory hand",
      what: "It fastens, routes cables and fits parts",
      who: "factories",
      skill: 1.45,
      price: 34e3,
      D: 60,
      T: 385e5,
      round: "Series A",
    },
    {
      cls: "Robot builder",
      what: "It builds other robots",
      who: "factories and other robot makers",
      skill: 1.65,
      price: 4e4,
      D: 200,
      T: 27e7,
      round: "Series B",
    },
    {
      cls: "Robot mechanic",
      what: "It finds what is broken in a robot and fixes it",
      who: "every kind of business",
      skill: 1.85,
      price: 47e3,
      D: 550,
      T: 128e7,
      round: "Series C",
    },
    {
      cls: "Household",
      what: "It tidies, cooks and does the laundry",
      who: "homes",
      skill: 2.05,
      price: 55e3,
      D: 1600,
      T: 6e9,
      round: "Series D",
    },
    {
      cls: "Generalist",
      what: "It learns a new job from one demonstration",
      who: "everyone",
      skill: 2.6,
      price: 65e3,
      D: 4e4,
      T: 0,
      round: "IPO",
    },
  ],
  he = yt.length - 1,
  so = [
    {
      id: "teleop",
      name: "Teleoperation rigs",
      fx: { learn: 1.5 },
      cost: 5e3,
      gen: 0,
      desc: "People in VR headsets show the robots how. Every session is training data.",
    },
    {
      id: "qdd",
      name: "Quasi-direct-drive motors",
      fx: { parts: 1.25 },
      cost: 3e5,
      gen: 1,
      desc: "Big flat motors with little gearing: cheap, strong joints you can push back.",
    },
    {
      id: "sim",
      name: "Sim-to-real",
      fx: { train: 0.7 },
      cost: 8e5,
      gen: 1,
      desc: "Practise a million times in simulation before trying once for real.",
    },
    {
      id: "swap",
      name: "Battery swap",
      fx: { rkw: 0.5 },
      cost: 2e6,
      gen: 2,
      desc: "Robots change their own packs instead of waiting on a charger.",
    },
    {
      id: "harm",
      name: "Harmonic drives",
      fx: { parts: 1.25 },
      cost: 3e6,
      gen: 2,
      desc: "Flexible gears with no backlash, for precise arms and hands.",
    },
    {
      id: "cast",
      name: "One-piece castings",
      fx: { rate: 1.25 },
      cost: 6e6,
      gen: 2,
      desc: "Cast the pelvis and torso frames in one piece instead of forty.",
    },
    {
      id: "model",
      name: "Licensed foundation model",
      fx: { learn: 1.4 },
      cost: 1e7,
      gen: 2,
      spons: "brain",
      desc: "Start each brain from a big pretrained model instead of from scratch.",
    },
    {
      id: "hands",
      name: "22-joint hands",
      fx: { demand: 1.3 },
      cost: 4e7,
      gen: 3,
      desc: "Hands as nimble as yours. A robot that can do more, more people want.",
    },
    {
      id: "prs",
      name: "Planetary roller screws",
      fx: { parts: 1.3 },
      cost: 6e7,
      gen: 3,
      desc: "The linear actuators in the legs: strong, compact and hard to make.",
    },
    {
      id: "vla",
      name: "Vision-language-action models",
      fx: { train: 0.7 },
      cost: 1e8,
      gen: 3,
      desc: "One model that sees, reads an instruction and moves.",
    },
    {
      id: "lease",
      name: "Robots by the hour",
      fx: { demand: 1.3 },
      cost: 4e8,
      gen: 4,
      desc: "Lease robots by the hour as well as selling them: customers who could not buy one can rent one.",
    },
    {
      id: "fleet",
      name: "Fleet learning",
      fx: { fleet: 0.002 },
      cost: 8e8,
      gen: 4,
      desc: "Every robot you have shipped sends its experience home, and it trains the next brain.",
    },
    {
      id: "wbc",
      name: "Whole-body control",
      fx: { rate: 1.2 },
      cost: 15e8,
      gen: 4,
      desc: "Balance, reach and grip planned together, so robots work faster.",
    },
    {
      id: "magnet",
      name: "Rare-earth-free motors",
      fx: { parts: 1.3, magnet: 1 },
      cost: 4e9,
      gen: 5,
      desc: "Motors without rare-earth magnets: shortages stop mattering.",
    },
    {
      id: "tactile",
      name: "Tactile skin",
      fx: { price: 1.3 },
      cost: 8e9,
      gen: 5,
      desc: "Fingertips that feel slip and pressure, so nothing gets dropped.",
    },
    {
      id: "dark",
      name: "Lights-out factory",
      fx: { kw: 0.7 },
      cost: 15e9,
      gen: 5,
      desc: "No people on the floor, so no lights and no air conditioning.",
    },
    {
      id: "repair",
      name: "Robots repair robots",
      fx: { rate: 1.25 },
      cost: 6e10,
      gen: 6,
      desc: "Robots fix each other on the line, so nothing waits for a technician.",
    },
    {
      id: "world",
      name: "World models",
      fx: { train: 0.7 },
      cost: 12e10,
      gen: 6,
      desc: "Robots imagine what an action will do before they try it.",
    },
  ],
  ol = Object.fromEntries(so.map((t) => [t.id, t])),
  Np = "utm_source=sael.net&utm_medium=game&utm_campaign=nation-of-robots",
  Up = mn,
  Ed = {
    id: "game",
    kind: "game",
    name: "A Nation of Robots",
    url: null,
    hold: 11,
  },
  Id = {
    id: "goal",
    kind: "goal",
    name: "Ten million a year",
    url: null,
    hold: 8,
  },
  Bd = { id: "rent", kind: "rent", name: "This billboard", url: mn, hold: 4.5 },
  ef = {
    billboard: [Ed, Id, Bd],
    truck: {
      name: "ROBOT FREIGHT",
      sub: "Your logo on every robot we ship",
      c1: "#e9ebf0",
      c2: "#1d2433",
      url: mn,
    },
    badge: null,
    brain: null,
    presented: null,
  },
  of =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#13203d"/><path d="M18 40 32 18l14 22z" fill="none" stroke="#7fe3ff" stroke-width="5" stroke-linejoin="round"/><circle cx="32" cy="34" r="4" fill="#ffb454"/></svg>',
  _d = {
    ...ef,
    truck: {
      name: "YOURBRAND",
      sub: "Robots, delivered overnight",
      c1: "#13203d",
      c2: "#7fe3ff",
      url: mn,
    },
    badge: { name: "YourBrand", mark: of, url: mn },
    brain: {
      name: "License the YourBrand model",
      brand: "YourBrand",
      url: mn,
      glyph: of,
      desc: "Start every brain from the YourBrand foundation model. Every robot wears its badge.",
    },
    presented: { name: "YourBrand", url: mn },
  },
  de = si.get("sponsor") === "demo" ? _d : ef,
  vi = [
    "Garage Robotics",
    "Bench Dynamics",
    "Humanoid & Sons",
    "Actuator Works",
    "Two Hands Robotics",
    "Spare Parts Labs",
    "Cul-de-sac Robotics",
    "Midnight Machines",
    "Driveway Dynamics",
    "Backyard Humanoids",
    "Torque & Co.",
    "First Step Robotics",
  ],
  ki = [
    [800, "Vatican City"],
    [1e4, "Tuvalu"],
    [39e3, "Monaco"],
    [8e4, "Andorra"],
    [39e4, "Iceland"],
    [55e4, "Malta"],
    [67e4, "Luxembourg"],
    [137e4, "Estonia"],
    [21e5, "Slovenia"],
    [53e5, "Ireland"],
    [6e6, "Denmark"],
    [89e5, "Switzerland"],
    [106e5, "Sweden"],
    [18e6, "the Netherlands"],
    [27e6, "Australia"],
    [41e6, "Canada"],
    [84e6, "Germany"],
  ],
  nl = "sael-robots-v1",
  Dd = 6e3,
  xn = (t = 0) => ({
    v: 1,
    lab: vi[Math.floor(ce() * vi.length)],
    cash: Dd,
    gen: 0,
    train: 0,
    since: 0,
    viral: 0,
    lvl: 0,
    cells: new Uint8Array(Bt),
    plants: { outlet: 1 },
    res: {},
    earned: 0,
    played: 0,
    start: Date.now(),
    last: Date.now(),
    launches: [],
    kept: 0,
    built: 0,
    shipped: 0,
    acc: 0.62,
    keepAcc: 0,
    split: 1,
    chose: !1,
    ready: 0,
    readyT: 0,
    trucks: [],
    dem: 1,
    tid: 0,
    rep: 1,
    sites: [],
    proj: [],
    jams: [],
    staff: { gate: 0, dock: 0, fix: 0, build: 0, crews: 0 },
    ng: t,
    ends: 0,
    best: null,
    done: !1,
    doneAt: 0,
    seen: {},
    miles: {},
    tut: 0,
    named: !1,
    short: 0,
    stats: {
      deliveries: 0,
      virals: 0,
      shortOk: 0,
      shortBad: !1,
      shares: 0,
      missions: 0,
      fedStreak: 0,
      bestFed: 0,
      clicks: 0,
      peakYr: 0,
      trucks: 0,
      missed: 0,
      streak: 0,
      bestStreak: 0,
      nights: 0,
      jams: 0,
      fixed: 0,
    },
    missions: [],
    mseq: 0,
  });
let s = xn();
const _t = (t, e) => e * j + t,
  gt = () => pt[s.lvl][0],
  vt = () => pt[s.lvl][1];
function Mi() {
  ((s.cells[_t(1, 1)] = At.bench.ix), (s.cells[_t(2, 1)] = At.wind.ix));
}
function nf() {
  let t = "";
  for (let e = 0; e < Bt; e++) t += s.cells[e].toString(36);
  return t;
}
function Xt() {
  s.last = Date.now();
  try {
    localStorage.setItem(nl, JSON.stringify({ ...s, cells: nf() }));
  } catch {}
}
function sf(t) {
  if (t == null)
    try {
      t = localStorage.getItem(nl);
    } catch {}
  if (!t) return !1;
  try {
    const e = JSON.parse(t);
    if (!e || e.v !== 1) return !1;
    const o = new Uint8Array(Bt);
    for (let n = 0; n < Bt && n < (e.cells || "").length; n++) {
      const a = parseInt(e.cells[n], 36);
      o[n] = a > 0 && a < Q.length ? a : 0;
    }
    ((s = { ...xn(e.ng || 0), ...e, cells: o }),
      (s.stats = { ...xn().stats, ...(e.stats || {}) }),
      (s.missions = Array.isArray(e.missions) ? e.missions : []),
      (s.staff = { ...xn().staff, ...(e.staff || {}) }));
    for (const n of ["trucks", "sites", "proj", "jams"])
      Array.isArray(s[n]) || (s[n] = []);
    return (
      (s.sites = s.sites.filter((n) => n && Q[n.ix] && n.k >= 0 && n.k < Bt)),
      e.hold && (s.ready = (s.ready || 0) + e.hold),
      e.backlog != null && e.trucks == null && (s.dem = e.backlog),
      delete s.hold,
      delete s.backlog,
      s.seen || (s.seen = {}),
      !s.seen.tourDone && (s.ng || s.mseq > go.length) && (s.seen.tourDone = 1),
      !0
    );
  } catch {
    return !1;
  }
}
let Ct = {};
function Dn() {
  const t = {
    rate: 1,
    parts: 1,
    price: 1,
    demand: 1,
    train: 1,
    learn: 1,
    kw: 1,
    rkw: 1,
    plant: 1,
    power: 1,
    fleet: 0,
    magnet: 0,
  };
  for (const o in s.res) {
    const n = ol[o];
    if (n)
      for (const [a, i] of Object.entries(n.fx))
        a === "fleet"
          ? (t.fleet = Math.max(t.fleet, i))
          : a === "magnet"
            ? (t.magnet = 1)
            : (t[a] *= i);
  }
  const e = 1 + 0.5 * s.ng;
  ((t.rate *= e),
    (t.price *= 1 + 0.25 * s.ng),
    (t.sh = s.short > 0 && !t.magnet),
    t.sh && (t.parts *= 0.75),
    (Ct = t));
}
const Pd = (t) => s.proj.filter((e) => e.kind === "plant" && e.id === t).length,
  sl = (t) => (s.plants[t] || 0) + Pd(t),
  wn = (t) => Math.round(t.cost * Ct.plant * (1 + 0.18 * sl(t.id))),
  al = () =>
    Po.reduce((t, e) => t + (s.plants[e.id] || 0) * e.kw, 0) * Ct.power,
  ao = new Float32Array(Bt),
  Pn = new Float32Array(Bt),
  io = new Float32Array(Bt),
  Fn = new Float32Array(Bt),
  Fo = new Float32Array(Bt),
  On = new Float32Array(Bt),
  bs = new Float32Array(Bt),
  p = {
    D: 0,
    fill: 1,
    wantShip: 0,
    posts: 0,
    crewed: 0,
    stations: 0,
    cells: 0,
    starved: 0,
    starvedCls: -1,
    wrongCls: 0,
    under: 0,
    R: 0,
    Rfull: 0,
    kwS: 0,
    kwC: 0,
    robotsKW: 0,
    draw: 0,
    cap: 0,
    brown: 1,
    made: 0,
    gym: 0,
    learn: 0,
    ship: 0,
    keep: 0,
    price: 0,
    rev: 0,
    dirty: !0,
    crewKey: -1,
    you: -1,
    jobs: 0,
    makes: 0,
    lineCap: 4,
    lineFull: !1,
  };
let se = [],
  il = [];
const rl = new Map(),
  Si = (t) => (t % j) + Math.floor(t / j);
function ke() {
  Vd();
  const t = gt(),
    e = vt(),
    o = Ct,
    n = yt[s.gen];
  (ao.fill(0),
    Pn.fill(0),
    io.fill(1),
    Fn.fill(0),
    Fo.fill(0),
    On.fill(0),
    bs.fill(0));
  const a = [];
  let i = 0;
  for (let k = 0; k < e; k++)
    for (let S = 0; S < t; S++) {
      const C = _t(S, k),
        R = Q[s.cells[C]];
      R &&
        (R.kind === "station"
          ? a.push(C)
          : ((Fn[C] = R.supply * o.parts), i++));
    }
  a.sort((k, S) => s.cells[S] - s.cells[k] || Si(k) - Si(S));
  let l = -1;
  for (const k of a)
    Q[s.cells[k]].id === "bench" && (l < 0 || Si(k) < Si(l)) && (l = k);
  const r = Gd();
  let c = Math.max(0, Math.floor(s.kept + 1e-9) - r),
    h = 0,
    d = 0,
    m = 0;
  for (const k of a) {
    const S = Q[s.cells[k]],
      C = k === l ? 1 : 0,
      R = S.crew - C,
      $ = Math.min(R, c);
    ((h += R),
      (c -= $),
      (d += $),
      (bs[k] = $),
      (On[k] = pe[k] ? 0 : ($ + C) / S.crew),
      $ < R && m++,
      (ao[k] = S.rate * n.skill * o.rate * On[k] * wo));
  }
  const u = [];
  for (let k = 0; k < 3; k++)
    for (let S = 0; S < e; S++)
      for (let C = 0; C < t; C++) {
        const R = _t(C, S);
        if (Fn[R] <= 1e-9) continue;
        const $ = Q[s.cells[R]],
          L = $.range;
        u.length = 0;
        let _ = 0;
        for (let P = -L; P <= L; P++)
          for (let lt = -L; lt <= L; lt++) {
            if (!lt && !P) continue;
            const wt = C + lt,
              it = S + P;
            if (wt < 0 || it < 0 || wt >= t || it >= e) continue;
            const Ft = _t(wt, it),
              U = Q[s.cells[Ft]];
            if (!U || U.kind !== "station" || U.cls > $.cls) continue;
            const V = ao[Ft] - Pn[Ft];
            V > 1e-9 && (u.push(Ft), (_ += V));
          }
        if (!_) continue;
        const I = Math.min(Fn[R], _);
        for (const P of u) Pn[P] += ((ao[P] - Pn[P]) / _) * I;
        ((Fn[R] -= I), (Fo[R] += I));
      }
  let g = 0,
    b = -1,
    y = 0,
    w = 0,
    x = 0,
    M = 0,
    T = 0;
  for (const k of a) {
    const S = Q[s.cells[k]],
      C = k % j,
      R = Math.floor(k / j);
    if (
      ((io[k] = ao[k] > 1e-12 ? D(Pn[k] / ao[k], 0, 1) : 1),
      (w += (ao[k] / wo) * io[k]),
      (x += S.rate * n.skill * o.rate),
      (M += S.kw * o.kw * (0.2 + 0.8 * On[k])),
      io[k] < 0.98)
    ) {
      (g++, (b = Math.max(b, S.cls)));
      let $ = !1,
        L = !1;
      for (let _ = -2; _ <= 2; _++)
        for (let I = -2; I <= 2; I++) {
          const P = C + I,
            lt = R + _;
          if (P < 0 || lt < 0 || P >= t || lt >= e) continue;
          const wt = Q[s.cells[_t(P, lt)]];
          wt?.kind === "parts" &&
            Math.max(Math.abs(I), Math.abs(_)) <= wt.range &&
            (($ = !0), wt.cls >= S.cls && (L = !0));
        }
      $ && !L && y++;
    }
  }
  for (let k = 0; k < e; k++)
    for (let S = 0; S < t; S++) {
      const C = _t(S, k),
        R = Q[s.cells[C]];
      R?.kind === "parts" &&
        (T +=
          R.kw * o.kw * (0.2 + 0.8 * D(Fo[C] / (R.supply * o.parts), 0, 1)));
    }
  rl.clear();
  for (let k = 0; k < e; k++)
    for (let S = 0; S < t; S++) {
      const C = _t(S, k),
        R = Q[s.cells[C]];
      if (R?.kind !== "parts" || Fo[C] <= 1e-9) continue;
      const $ = [],
        L = R.range;
      for (let _ = -L; _ <= L; _++)
        for (let I = -L; I <= L; I++) {
          const P = S + I,
            lt = k + _;
          if (P < 0 || lt < 0 || P >= t || lt >= e) continue;
          const wt = _t(P, lt),
            it = Q[s.cells[wt]];
          it?.kind === "station" &&
            it.cls <= R.cls &&
            Pn[wt] > 1e-9 &&
            $.push(wt);
        }
      rl.set(C, $);
    }
  ((se = a),
    Object.assign(p, {
      posts: h,
      crewed: d,
      stations: a.length,
      cells: i,
      starved: g,
      starvedCls: b,
      wrongCls: y,
      under: m,
      R: w,
      Rfull: x,
      kwS: M,
      kwC: T,
      dirty: !1,
      crewKey: Math.min(Math.floor(s.kept + 1e-9) - r, h),
      jobs: r,
      you: l,
    }),
    (Ke = !0),
    (xe = !0));
}
const ro = () => yt[s.gen].T * Ct.train,
  lo = () => s.gen < he && s.train >= ro() - 1e-6,
  Pt = () => p.makes * 365,
  Fd = (t) => 0.5 + 0.5 * (1 - Math.exp(-t / 70));
let ue = !1;
const ll = (t) => {
    if (!(t > 12)) return Math.max(1, Math.round(t || 0));
    const e = 10 ** Math.floor(Math.log10(t)),
      o = t / e;
    let n = 1;
    for (const a of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10])
      Math.abs(a - o) < Math.abs(n - o) && (n = a);
    return Math.round(n * e);
  },
  Od = () => Math.max(4, ll(p.Rfull * Rd)),
  zd = () => ll(Math.min(p.D, Math.max(p.wantShip, p.makes * 0.25)) * Td);
function ca() {
  let t = 0;
  for (const e of s.trucks) t += e.n - e.got;
  return t;
}
function af(t) {
  for (const e of [1, 0])
    for (const o of s.trucks) {
      if (t <= 0) return;
      if (!o.rush != !e) continue;
      const n = Math.min(t, o.n - o.got);
      ((o.got += n), (t -= n));
    }
}
const Gd = () =>
    (s.staff.gate === 2 ? Tt.gate.bots : 0) +
    (s.staff.dock === 2 ? Tt.dock.bots : 0) +
    (s.staff.fix === 2 ? Tt.fix.bots : 0) +
    (s.staff.build ? Tt.build.bots : 0),
  Me = () =>
    2 +
    s.lvl +
    (s.staff.crews || 0) +
    (s.staff.build ? 4 + Math.floor(p.stations / 6) : 0),
  ys = () => (s.staff.build ? 2 : 1),
  jd = () =>
    (s.staff.gate === 1 ? Tt.gate.wage : 0) +
    (s.staff.dock === 1 ? Tt.dock.wage : 0) +
    (s.staff.fix === 1 ? Tt.fix.wage : 0),
  rf = () => Cd * (s.gen >= 5 ? 3 : 1);
function Nd(t) {
  const e = yt[s.gen],
    o = Ct;
  ((s.viral *= Math.exp(-t / 14)),
    (p.robotsKW = Math.floor(s.kept + 1e-9) * $d * o.rkw),
    (p.draw = p.kwS + p.kwC + p.robotsKW),
    (p.cap = al()),
    (p.brown = p.draw > 0 ? Math.min(1, p.cap / p.draw) : 1),
    (p.lineCap = Od()),
    (p.lineFull = s.ready >= p.lineCap),
    (p.makes = p.R * p.brown),
    (p.made = p.lineFull ? 0 : p.makes),
    (p.gym = Math.max(0, Math.floor(s.kept + 1e-9) - p.posts - p.jobs)),
    (p.learn = (p.gym * p.brown + s.shipped * o.fleet) * o.learn),
    (s.rep = Math.min(1, (s.rep ?? 1) + Ad * t)),
    (p.D = e.D * o.demand * (Fd(s.since) + s.viral) * s.rep));
  const n = s.chose ? s.split : 1;
  ((p.wantShip = p.makes * (1 - n)), (s.dem += p.D * t));
  for (let a = 0; a < 8; a++) {
    const i = zd();
    if (s.dem < i) break;
    if (s.trucks.filter((l) => !l.rush).length >= bi) {
      s.dem = i;
      break;
    }
    (s.trucks.push({ id: ++s.tid, n: i, got: 0, wait: 0 }), (s.dem -= i));
  }
  if (
    ((p.ship = Math.min(p.wantShip, p.D + (ca() > p.D * 2 ? p.D : 0))),
    (p.keep = p.makes - p.ship),
    (p.fill = p.D > 1e-9 ? D(p.wantShip / p.D, 0, 1) : 1),
    (p.price = e.price * o.price),
    (p.rev = p.ship * p.price),
    (s.acc += p.made * t),
    s.gen < he && (s.train = Math.min(ro(), s.train + p.learn * t)),
    (s.since += t),
    s.short > 0 && (s.short = Math.max(0, s.short - t)),
    Wd(t),
    cl(t),
    qd(t),
    !ue)
  ) {
    const a = jd();
    a && (s.cash = Math.max(0, s.cash - a * t));
  }
  {
    const a = s.stats;
    (p.stations && !p.under && !p.starved && p.brown > 0.995
      ? (a.fedStreak += t)
      : (a.fedStreak = 0),
      a.fedStreak > a.bestFed && (a.bestFed = a.fedStreak));
    const i = Pt();
    i > a.peakYr && (a.peakYr = i);
  }
}
const pe = new Uint8Array(Bt),
  Ud = () => s.chose && yr() && !s.done;
function Vd() {
  ((s.jams = (s.jams || []).filter(
    (t) => t && Q[s.cells[t.k]]?.kind === "station",
  )),
    pe.fill(0));
  for (const t of s.jams) pe[t.k] = 1;
}
function qd(t) {
  if (!Ud() || p.lineFull) return;
  const e = t / el;
  let o = 0;
  for (const n of se)
    pe[n] ||
      On[n] <= 0 ||
      ce() >= e ||
      (s.jams.push({ k: n, t: s.played }), (pe[n] = 1), o++);
  o &&
    ((s.stats.jams += o),
    (p.dirty = !0),
    (Ke = !0),
    (xe = !0),
    !ue &&
      (O.jam?.(),
      !s.seen.jam &&
        s.staff.fix !== 2 &&
        ((s.seen.jam = 1),
        Et(
          "A station jammed",
          "It stops until someone fixes it: click it, the bubble over it, or press Enter. A technician (Staff) can do it for you.",
          "r",
          ["Fix it", () => zn("you")],
          { icon: "wrench", kick: "Breakdown", life: 9 },
        ))));
}
function lf(t, e = "you") {
  const o = s.jams.findIndex((n) => n.k === t);
  return o < 0
    ? !1
    : (s.jams.splice(o, 1),
      (pe[t] = 0),
      s.stats.fixed++,
      (p.dirty = !0),
      (Ke = !0),
      (xe = !0),
      ue || (e === "you" && (s.stats.clicks++, O.fix?.()), Us(t, "Fixed", "c")),
      !0);
}
function zn(t = "you", e = 0) {
  const o = s.jams.filter((n) => s.played - n.t >= e);
  if (!o.length) return 0;
  for (const n of o) pe[n.k] = 0;
  if (
    ((s.jams = s.jams.filter((n) => pe[n.k])),
    (s.stats.fixed += o.length),
    (p.dirty = !0),
    (Ke = !0),
    (xe = !0),
    !ue && (t === "you" && (s.stats.clicks++, O.fix?.()), o.length <= 6))
  )
    for (const n of o) Us(n.k, "Fixed", "c");
  return o.length;
}
function Wd(t) {
  if (ue && s.staff.dock !== 2) return;
  let e = null;
  for (const o of s.trucks) {
    const n = o.got >= o.n;
    ((n || o.rush) && (o.wait += t),
      (o.rush ? o.wait > la : n && o.wait > ra) && (e || (e = [])).push(o));
  }
  if (e) for (const o of e) Hd(o);
}
function Hd(t) {
  s.trucks = s.trucks.filter((n) => n !== t);
  const e = t.got >= t.n,
    o = Math.min(t.got, ca());
  (af(o),
    t.got > o && ((s.kept += t.got - o), (p.dirty = !0)),
    e &&
      ((s.rep = Math.max(0.7, s.rep - Zc)),
      s.stats.missed++,
      (s.stats.streak = 0)),
    rt.missed(t, e));
}
function Gn(t = "you", e = 0) {
  let o = 0,
    n = 0,
    a = 0,
    i = 0;
  const l = p.price || yt[s.gen].price * Ct.price;
  if (
    ((s.trucks = s.trucks.filter((c) => {
      if (c.got < c.n || c.wait < e) return !0;
      const h = c.n * l * (c.rush ? 2 : 1);
      return ((o += h), (n += c.n), a++, c.rush && i++, rt.signed(c, h, t), !1);
    })),
    !a)
  )
    return 0;
  ((s.cash += o), (s.earned += o), (s.shipped += n));
  const r = s.stats;
  return (
    (r.trucks += a),
    (r.deliveries += i),
    (r.streak += a),
    (r.bestStreak = Math.max(r.bestStreak, r.streak)),
    t === "you" ? (r.clicks++, O.coin(3), O.horn?.()) : ue || O.coin(1),
    a
  );
}
function jn(t = "you") {
  const e = Math.floor(s.ready + 1e-9);
  return e < 1 || !s.chose
    ? 0
    : ((s.ready -= e), uf(e), t === "you" && (s.stats.clicks++, O.gate?.()), e);
}
function cl(t) {
  const e = Me(),
    o = ys() * t;
  let n = null;
  for (let a = 0; a < s.sites.length && a < e; a++) {
    const i = s.sites[a];
    ((i.left -= o), i.left <= 0 && (n || (n = [])).push(i));
  }
  if (n) for (const a of n) $i(a);
  if (s.proj.length) {
    for (const i of s.proj) i.left -= t * ys();
    const a = s.proj.filter((i) => i.left <= 0);
    if (a.length) {
      s.proj = s.proj.filter((i) => i.left > 0);
      for (const i of a) Yd(i);
    }
  }
}
function $i(t) {
  if (
    ((s.sites = s.sites.filter((e) => e !== t)),
    (ie[t.k] = 0),
    (s.cells[t.k] = t.ix),
    (kn[t.k] = z),
    (p.dirty = !0),
    (Ke = !0),
    (As = !0),
    !ue)
  ) {
    (O.built?.(), Ri++, z - cf > 0.35 && ((cf = z), (ff = t.k), (Ri = 1)));
    const e = dn.find((o) => o.k === ff && z - o.t < 0.35);
    e && Ri > 1
      ? (e.e.textContent = `Built \xD7 ${Ri}`)
      : (Us(t.k, "Built", "c"), (dn[(oc - 1) % dn.length].k = t.k));
  }
}
let cf = -9,
  ff = -1,
  Ri = 0;
function Yd(t) {
  if (t.kind === "floor") {
    g1();
    return;
  }
  if (((s.plants[t.id] = (s.plants[t.id] || 0) + 1), Ul(), (Jt = !0), !ue)) {
    const e = tn[t.id];
    (O.big(),
      Et(e.name, `You can now draw ${Yt(al())}.`, "a", null, {
        icon: "bolt",
        kick: "Power online",
        big: "+" + Yt(e.kw * Ct.power),
      }));
  }
}
function Kd() {
  const t = s.staff.gate,
    e = s.staff.dock,
    o = s.staff.fix;
  (s.jams.length &&
    (o === 2 || (o === 1 && !ue)) &&
    zn(o === 2 ? "robots" : "help", o === 2 ? 0.3 : yi),
    s.chose &&
      s.ready >= 1 &&
      (t === 2 || (t === 1 && !ue)) &&
      (t === 2 || s.ready >= p.lineCap * 0.4 || s.played - s.readyT > 5) &&
      jn(t === 2 ? "robots" : "help"),
    s.trucks.length &&
      (e === 2 || (e === 1 && !ue)) &&
      Gn(e === 2 ? "robots" : "help", e === 2 ? 0.4 : 5));
}
const hf = () => Math.min(Math.floor(s.kept + 1e-9) - p.jobs, p.posts);
function df(t) {
  for (; t > 1e-9;) {
    const e = Math.min(t, 2);
    ((s.played += e),
      Nd(e),
      Xd(),
      Kd(),
      (p.dirty || hf() !== p.crewKey) && ke(),
      (t -= e));
  }
}
function fl(t) {
  const e = Math.min(t, rf());
  if (!(e > 0)) return null;
  const o = {
    built: s.built,
    cash: s.cash,
    trucks: s.stats.trucks,
    fixed: s.stats.fixed,
    sites: s.sites.length,
    proj: s.proj.length,
    lvl: s.lvl,
    gen: s.gen,
    f0: s.gen < he ? s.train / ro() : 1,
    rd: lo(),
  };
  ue = !0;
  try {
    df(e);
  } finally {
    ue = !1;
  }
  return { ...o, t: e, cut: t > e + 0.5 };
}
function Xd() {
  if (s.acc < 1) return;
  const t = Math.floor(s.acc);
  ((s.acc -= t),
    (s.built += t),
    s.ready < 1 && (s.readyT = s.played),
    (s.ready += t));
}
function uf(t, e) {
  const o = e == null ? s.split : e ? 1 : 0;
  s.keepAcc += o * t;
  let n = Math.min(t, Math.floor(s.keepAcc + 1e-9));
  s.keepAcc -= n;
  const a = Math.min(t - n, Math.floor(ca() + 1e-9));
  ((n = t - a),
    af(a),
    n &&
      ((s.kept += n),
      (p.dirty = p.dirty || Math.floor(s.kept + 1e-9) <= p.posts + p.jobs + n)),
    rt.out(t, n, a));
}
function fa(t) {
  if (s.chose) return;
  ((s.chose = !0), (s.split = t ? 1 : 0));
  const e = Math.floor(s.ready + 1e-9);
  (!t &&
    ca() < e &&
    s.trucks.push({ id: ++s.tid, n: e - ca(), got: 0, wait: 0 }),
    (s.ready -= e),
    e > 0 && uf(e, t),
    t
      ? Et(
          "Robots building robots",
          "It joins you at the bench, and the next one comes twice as fast. From now on the gate keeps every robot until you change it.",
          "c",
          null,
          { icon: "robot", kick: "Kept" },
        )
      : Et(
          "Your first customer",
          `It walks out to the truck. Click the truck to sign for it, and they pay ${K(yt[s.gen].price * Ct.price)}. From now on the gate ships every robot until you change it.`,
          "a",
          null,
          { icon: "coin", kick: "Shipped" },
        ),
    (p.dirty = !0),
    (Jt = !0),
    gr(),
    Xt());
}
const en = 4.6,
  vo = 8.8,
  pf = (t, e) => {
    const o = new f.MeshBasicMaterial({
      color: new f.Color(t).multiplyScalar(e),
      fog: !1,
    });
    return (fe.lamps.push([o, o.color.clone()]), o);
  },
  ha = {
    uSun: { value: new f.Vector3(0.72, 0.08, -0.55).normalize() },
    uTime: { value: 0 },
    uDay: { value: 0 },
    uWarm: { value: 0 },
  },
  da = new f.Mesh(
    new f.SphereGeometry(900, 48, 24),
    new f.ShaderMaterial({
      side: f.BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: ha,
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
((da.renderOrder = -10), (da.frustumCulled = !1), Zt.add(da), oo.push(da));
const Ti = ms(512, 512, (t, e, o) => {
  ((t.fillStyle = "#2f3b2c"), t.fillRect(0, 0, e, o));
  const n = yo(4);
  for (let a = 0; a < 2600; a++) {
    const i = n();
    ((t.fillStyle = `hsla(${78 + i * 40},${18 + n() * 14}%,${16 + n() * 14}%,.5)`),
      t.fillRect(n() * e, n() * o, 2 + n() * 5, 1 + n() * 3));
  }
});
((Ti.wrapS = Ti.wrapT = f.RepeatWrapping), Ti.repeat.set(220, 220));
const ua = new f.Mesh(
  new f.PlaneGeometry(2200, 2200),
  _o(
    new f.MeshStandardMaterial({
      map: Ti,
      roughness: 0.96,
      envMapIntensity: 0.25,
    }),
  ),
);
((ua.rotation.x = -Math.PI / 2),
  (ua.position.y = -0.02),
  (ua.receiveShadow = !0),
  Gt.add(ua),
  (fe.ground = ua.material));
const gf = B("#26292f", { roughness: 0.82 }),
  hl = B("#7d7a73", { roughness: 0.9 }),
  dl = B("#8e8a82", { roughness: 0.8 }),
  Jd = B("#cdb878", { roughness: 0.6 });
((fe.asph = gf), ea(hl, "#aeaba3"), ea(dl, "#c6c2ba"));
{
  const t = bt(),
    e = 900,
    o = -300;
  t.box(gf, o + e / 2, 0.005, (en + vo) / 2, e, 0.03, vo - en);
  for (let l = o; l < o + e; l += 4)
    t.box(Jd, l + 1, 0.025, (en + vo) / 2, 2, 0.01, 0.12);
  (t
    .box(dl, o + e / 2, 0.06, en - 0.06, e, 0.12, 0.12)
    .box(dl, o + e / 2, 0.06, vo + 0.06, e, 0.12, 0.12),
    t
      .box(hl, o + e / 2, 0.03, en - 0.7, e, 0.06, 1.2)
      .box(hl, o + e / 2, 0.03, vo + 0.75, e, 0.06, 1.3),
    t.flush(Gt));
  const n = bt(),
    a = B("#3a3f48", { roughness: 0.5, metalness: 0.4 }),
    i = pf("#ffd29a", 3.2);
  for (let l = -118; l <= 150; l += 14) {
    n.cyl(a, l, 2.1, vo + 1, 0.06, 0.08, 4.2, { seg: 8 }).box(
      a,
      l,
      4.15,
      vo + 0.45,
      0.08,
      0.08,
      1.2,
    );
    const r = new f.Mesh(new f.BoxGeometry(0.42, 0.08, 0.22), i);
    (r.position.set(l, 4.08, vo - 0.1),
      Gt.add(r),
      _n(l, 3.6, vo - 0.4, "#ffc884", 7, 1.1));
  }
  n.flush(Gt);
}
const mf = ["#3f6232", "#4b6e39", "#577a40", "#365a2f"].map((t) =>
    B(t, { flatShading: !0, roughness: 0.85 }),
  ),
  bf = B("#4a3527", { roughness: 0.9 }),
  Qd = ["#2f5a3a", "#3a6b43", "#44784a"].map((t) =>
    B(t, { flatShading: !0, roughness: 0.85 }),
  );
function ul(t, e, o, n, a) {
  const i = yo(a);
  t.cyl(bf, e, 0.5 * n, o, 0.07 * n, 0.11 * n, 1 * n, { seg: 6 });
  for (let l = 0; l < 4; l++)
    t.geo(
      mf[(l + a) % 4],
      Wc(0.5 * n * (0.75 + i() * 0.5), 0.32, a * 7 + l),
      e + (i() - 0.5) * 0.6 * n,
      (1.25 + i() * 0.7) * n,
      o + (i() - 0.5) * 0.6 * n,
    );
}
function Zd(t, e, o, n, a) {
  const i = yo(a * 97 + 13);
  t.cyl(bf, e, 0.15 * n, o, 0.05 * n, 0.07 * n, 0.3 * n, { seg: 5 });
  for (let l = 0; l < 3; l++) {
    const r = (0.42 - l * 0.1) * n * (0.9 + i() * 0.2);
    t.cone(Qd[(l + a) % 3], e, (0.22 + l * 0.3) * n, o, r, 0.55 * n, {
      seg: 6 + (a % 2),
      ry: i() * 3,
    });
  }
}
const tu = (t, e) =>
  (t > -19 && t < j + 16 && e < vo + 3 && e > -Qc - 70) ||
  (e > en - 2.2 && e < vo + 2.6);
{
  const t = bt(),
    e = yo(77);
  let o = 0;
  for (let n = 0; n < 2600 && o < 520; n++) {
    const a = e() * Math.PI * 2,
      i = 14 + Math.pow(e(), 0.8) * 210,
      l = 12 + Math.cos(a) * i * 1.25,
      r = -10 + Math.sin(a) * i;
    if (tu(l, r)) continue;
    const c = 1.4 + e() * 1.6;
    (e() < 0.45 ? Zd(t, l, r, c * 1.6, o) : ul(t, l, r, c, o), o++);
  }
  for (let n = 0; n < 5; n++)
    ul(t, -13.5 + n * 1.9, -9.5 - e() * 1.5, 1.5 + e() * 0.6, 200 + n);
  (ul(t, -14.5, -2.5, 1.7, 302), t.flush(Gt));
}
const yf = B("#5d5a72", { flatShading: !0, roughness: 0.85 }),
  xf = B("#4b4a60", { flatShading: !0, roughness: 0.85 });
fe.rock = [yf, xf];
{
  const t = bt(),
    e = yo(12);
  for (let o = 0; o < 46; o++) {
    const n = (o / 46) * Math.PI * 2 + e() * 0.1,
      a = 520 + e() * 160,
      i = 40 + e() * 90,
      l = 60 + e() * 70,
      r = new f.ConeGeometry(l, i, 7, 3).translate(0, i / 2 - 4, 0),
      c = r.attributes.position;
    for (let h = 0; h < c.count; h++) {
      const d = c.getY(h);
      d > -3 &&
        d < i - 5 &&
        (c.setX(h, c.getX(h) * (1 + (e() - 0.5) * 0.4)),
        c.setZ(h, c.getZ(h) * (1 + (e() - 0.5) * 0.4)));
    }
    (r.computeVertexNormals(),
      t.geo(
        o % 2 ? yf : xf,
        r,
        12 + Math.cos(n) * a,
        0,
        -10 + Math.sin(n) * a,
        { ry: e() * 3 },
      ));
  }
  t.flush(Gt, !1);
}
const Ai = { x: 330, z: -150 };
{
  const t = ms(256, 512, (i, l, r) => {
    ((i.fillStyle = "#0b0f18"), i.fillRect(0, 0, l, r));
    const c = yo(31);
    for (let h = 6; h < r; h += 12)
      for (let d = 6; d < l; d += 10) {
        const m = c();
        m < 0.42 &&
          ((i.fillStyle =
            m < 0.08 ? "#bfe6ff" : m < 0.3 ? "#ffd59a" : "#ffb870"),
          i.fillRect(d, h, 6, 7));
      }
  });
  t.wrapS = t.wrapT = f.RepeatWrapping;
  const e = new f.MeshBasicMaterial({
    map: t,
    color: new f.Color(1.9, 1.8, 1.7),
  });
  fe.city = e;
  const o = bt(),
    n = yo(5);
  for (let i = 0; i < 70; i++) {
    const l = Ai.x + (n() - 0.5) * 150,
      r = Ai.z + (n() - 0.5) * 110,
      c = 6 + n() * 10,
      h = 14 + Math.pow(n(), 2.2) * 90,
      d = new f.BoxGeometry(c, h, c * (0.8 + n() * 0.5)),
      m = d.attributes.uv;
    for (let u = 0; u < m.count; u++)
      m.setXY(u, (m.getX(u) * c) / 12, (m.getY(u) * h) / 24);
    o.geo(e, d, l, h / 2, r);
  }
  o.flush(Gt, !1);
  const a = new f.Mesh(new f.PlaneGeometry(320, 90), xd("#ffb27a", 0.16));
  (a.position.set(Ai.x, 30, Ai.z - 40),
    a.lookAt(0, 30, 0),
    Gt.add(a),
    oo.push(a),
    (fe.cityGlow = a.material));
}
const Nn = new f.Group();
Gt.add(Nn);
const wf = B("#d8cfbd", { roughness: 0.8 }),
  vf = B("#4a4e57", { roughness: 0.7 }),
  pa = B("#efebe3", { roughness: 0.6 }),
  eu = B("#4c5d6e", { roughness: 0.5 }),
  kf = new f.MeshBasicMaterial({ color: new f.Color(1.55, 1.18, 0.72) }),
  ou = B("#7a5446", { roughness: 0.9 });
fe.win = kf;
{
  const t = bt(),
    e = -8.6,
    o = -2.4,
    n = -6.2,
    a = -1,
    i = 2.5,
    l = (e + o) / 2,
    r = (n + a) / 2;
  (t.box(B("#6f6a62"), l, 0.15, r, o - e + 0.3, 0.3, a - n + 0.3),
    t.box(wf, l, 0.3 + i / 2, r, o - e, i, a - n));
  for (let w = 0.55; w < i; w += 0.24)
    t.box(
      B("#cbc2b0", { roughness: 0.8 }),
      l,
      0.3 + w,
      a + 0.006,
      o - e,
      0.03,
      0.012,
    );
  const c = (a - n) / 2 + 0.35,
    h = 1.7,
    d = Math.hypot(c, h),
    m = Math.atan2(h, c);
  t.box(vf, l, 0.3 + i + h / 2, r + c / 2 - 0.17, o - e + 0.5, 0.14, d, {
    rx: m,
  }).box(vf, l, 0.3 + i + h / 2, r - c / 2 + 0.17, o - e + 0.5, 0.14, d, {
    rx: -m,
  });
  const u = new f.Shape(
    [
      [-c + 0.35, 0],
      [c - 0.35, 0],
      [0, h - 0.05],
    ].map((w) => new f.Vector2(...w)),
  );
  for (const w of [e + 0.02, o - 0.02]) {
    const x = new f.ExtrudeGeometry(u, { depth: 0.04, bevelEnabled: !1 });
    (x.rotateY(Math.PI / 2), t.geo(wf, x, w - 0.02, 0.3 + i, r));
  }
  t.box(ou, e + 1.2, 0.3 + i + 1.4, r - 1.2, 0.7, 1.6, 0.7);
  for (const w of [e + 1.2, o - 1])
    (t.box(pa, w, 1.75, a + 0.03, 1.1, 1.05, 0.06),
      t.geo(kf, new f.BoxGeometry(0.9, 0.85, 0.02), w, 1.75, a + 0.07),
      t
        .box(pa, w, 1.75, a + 0.085, 0.05, 0.85, 0.02)
        .box(pa, w, 1.75, a + 0.085, 0.9, 0.05, 0.02));
  (t
    .box(pa, o - 2.6, 1.3, a + 0.03, 1, 2.05, 0.06)
    .box(eu, o - 2.6, 1.28, a + 0.07, 0.82, 1.9, 0.04)
    .box(pd, o - 2.3, 1.25, a + 0.1, 0.05, 0.05, 0.05),
    t.box(B("#8f8a80"), o - 2.6, 0.2, a + 0.6, 1.6, 0.12, 1.1),
    t.box(pa, o - 2.6, 2.55, a + 0.12, 0.25, 0.18, 0.12),
    t.flush(Nn));
  const g = new f.Mesh(new f.SphereGeometry(0.07, 10, 8), pf("#ffd9a0", 4));
  (g.position.set(o - 2.6, 2.5, a + 0.24),
    Nn.add(g),
    _n(o - 2.6, 2.2, a + 0.9, "#ffcf8a", 4, 1.2));
  for (const w of [e + 1.2, o - 1]) _n(w, 1.7, a + 1.2, "#ffcf8a", 3, 0.5);
  const b = new f.Mesh(
    new f.BoxGeometry(1.5, 0.03, 0.62),
    B("#2e261e", { roughness: 1 }),
  );
  (b.position.set(o - 2.6, 0.27, a + 0.62), Nn.add(b));
  const y = aa(
    1.2,
    0.36,
    512,
    154,
    (w, x, M) => {
      ((w.font = "600 70px Outfit, sans-serif"),
        (w.letterSpacing = "10px"),
        (w.textAlign = "center"),
        (w.textBaseline = "middle"),
        (w.fillStyle = "#b99a6a"),
        w.fillText("WELCOME", x / 2, M / 2 + 4));
    },
    0.7,
  );
  ((y.rotation.x = -Math.PI / 2),
    y.position.set(o - 2.6, 0.29, a + 0.62),
    Nn.add(y));
  {
    const w = bt();
    w.box(
      B("#2f4a3a", { roughness: 0.6 }),
      o + 0.45,
      0.5,
      a - 1.2,
      0.55,
      0.95,
      0.55,
      { r: 0.04 },
    ).box(
      B("#3a4150", { roughness: 0.6 }),
      o + 0.45,
      0.5,
      a - 1.9,
      0.55,
      0.95,
      0.55,
      { r: 0.04 },
    );
    for (let x = 0; x < 9; x++)
      w.geo(
        mf[x % 4],
        Wc(0.32 + Kt(x) * 0.12, 0.3, 40 + x),
        e + 0.6 + x * 0.62,
        0.28,
        a + 0.55,
      );
    w.flush(Nn);
  }
  Nn.scale.setScalar(0.75);
}
const ga = (t) => {
    const e = [0];
    for (let o = 1; o < t.length; o++)
      e.push(e[o - 1] + t[o].distanceTo(t[o - 1]));
    return e;
  },
  Ci = 4.3,
  Mt = 1.9,
  dt = 1.6,
  F = { x0: 3.15, x1: 5.65, z0: 1.5, z1: 3.1, y: 0.3 },
  xs = (F.x0 + F.x1) / 2 - 0.4,
  ma = 4.6 + 1.05,
  pl = ma - 0.785 * 0.82,
  on = F.z1 - 0.3,
  vn = F.x0 + 0.4,
  ae = F.x0 + 1.45,
  Mf = 0.42,
  Li = 3.62,
  ba = -0.62,
  Ei = () => -4 - Math.min(s.lvl, 7) * 1.5,
  ya = new f.Group();
(Gt.add(ya), _n(Mt + 0.4, 2.8, dt + 0.2, "#ffe2b8", 4.6, 1.15));
const Sf = _n(-2, 2.6, 2, "#d6ebff", 4.2, 0.8),
  $f = ea(B("#9b978f", { roughness: 0.85 }), "#b9b6ae"),
  ws = new f.Group();
(ws.position.set(Mt, 0, dt), ya.add(ws));
const Rf = Rt("#3d434c", { roughness: 0.45 });
{
  const t = bt();
  (t
    .box(B("#6d6a64", { roughness: 0.9 }), 0, 0.035, 0, 0.34, 0.07, 0.34)
    .cyl(Rf, 0, 0.95, 0, 0.045, 0.055, 1.84, { seg: 10 })
    .box(Rf, 0, 1.86, 0, 0.08, 0.08, 0.12)
    .box(B("#2a2e35", { roughness: 0.5 }), 0, 0.86, 0, 0.16, 0.2, 0.16, {
      r: 0.02,
    }),
    ws.add(...t.flush(ws)));
}
const vs = new f.Group();
(vs.position.set(0, 0.86, 0), ws.add(vs));
{
  const t = bt(),
    e = B("#ece7dc", { roughness: 0.5 }),
    o = B("#d9733a", { roughness: 0.5 });
  for (let a = 0; a < 5; a++)
    t.box(a % 2 ? o : e, 0.11 + a * 0.16, 0, 0, 0.16, 0.045, 0.045);
  t.flush(vs);
  const n = new f.Mesh(new f.SphereGeometry(0.035, 10, 8), be("#ffd9a0", 3.4));
  (n.position.set(0.92, 0, 0), vs.add(n), (vs.userData.tip = n));
}
const gl = aa(1.9, 0.475, 1024, 256, null, 1.15, { alphaTest: 0.04 });
(gl.position.set(0, 2.1, 0.02), ws.add(gl));
let ks = !1;
function Ii() {
  gl.userData.redraw((t, e, o) => {
    const n = s.chose ? s.split : -1;
    ((t.fillStyle = "#10151f"), gs(t, 4, 4, e - 8, o - 8, 40), t.fill());
    const a = n < 0 ? "?" : Math.round((1 - n) * 100) + "%",
      i = n < 0 ? "?" : Math.round(n * 100) + "%";
    ((t.textBaseline = "middle"),
      (t.font = "800 92px Outfit, sans-serif"),
      (t.letterSpacing = "4px"),
      (t.fillStyle = ks ? "#c9f6ff" : "#7fe3ff"),
      (t.textAlign = "left"),
      t.fillText("KEEP", 40, o / 2 + 4),
      (t.fillStyle = ks ? "#ffd08a" : "#ffb454"),
      (t.textAlign = "right"),
      t.fillText("SHIP", e - 40, o / 2 + 4),
      (t.letterSpacing = "0px"),
      (t.font = "600 64px DM Mono, monospace"),
      (t.fillStyle = "#c9f3ff"),
      (t.textAlign = "left"),
      t.fillText(i, 330, o / 2 + 6),
      (t.fillStyle = "#ffe2b0"),
      (t.textAlign = "right"),
      t.fillText(a, e - 330, o / 2 + 6),
      (t.fillStyle = "#ffffff26"),
      t.fillRect(e / 2 - 2, 40, 4, o - 80));
  });
}
const Bi = new f.Group();
ya.add(Bi);
function ml(t, e, o, n = 0.42, a = 0.14) {
  const i = ga(o),
    l = i[i.length - 1],
    r = new f.Vector3(),
    c = new f.Vector3();
  for (let h = n * 0.6; h < l - 0.1; h += n) {
    (nn(o, i, h, r), nn(o, i, Math.min(l, h + 0.05), c));
    const d = Math.atan2(c.x - r.x, c.z - r.z);
    for (const m of [-1, 1]) {
      const u = d + m * 2.4;
      t.box(
        e,
        r.x + Math.sin(u) * a * 0.5,
        0.036,
        r.z + Math.cos(u) * a * 0.5,
        0.035,
        0.004,
        a * 1.05,
        { ry: u },
      );
    }
  }
}
function nn(t, e, o, n) {
  let a = 1;
  for (; a < e.length - 1 && e[a] < o;) a++;
  const i = D((o - e[a - 1]) / Math.max(e[a] - e[a - 1], 1e-6), 0, 1);
  return n.lerpVectors(t[a - 1], t[a], i);
}
const ut = (t, e, o = 0) => new f.Vector3(t, o, e),
  ko = {
    out: [ut(Mt, -0.45), ut(Mt, 0.4), ut(Mt, dt - 0.32)],
    ship: [
      ut(Mt, dt - 0.32),
      ut(Mt + 0.55, dt + 0.12),
      ut(F.x0 - 0.55, dt + 0.3),
      ut(F.x0 + 0.15, dt + 0.3, F.y),
      ut(vn, F.z0 + 0.26, F.y),
    ],
    back: [
      ut(Mt, dt - 0.32),
      ut(Mt - 0.42, dt - 0.72),
      ut(Mt - 0.36, 0.2),
      ut(Mt - 0.32, -0.5),
    ],
    yard: [
      ut(Mt, dt - 0.32),
      ut(Mt - 0.6, dt + 0.05),
      ut(-0.1, dt + 0.1),
      ut(ba - 0.35, dt + 0.1),
    ],
  };
for (const t in ko) ko[t].dd = ga(ko[t]);
{
  const t = bt(),
    e = be("#ffb454", 0.75),
    o = be("#7fe3ff", 0.7);
  (ml(t, e, ko.ship.slice(0, 3)),
    ml(t, o, ko.back.slice(0, 3)),
    ml(t, o, ko.yard.slice(0, 4)),
    Bi.add(...t.flush(Bi, !1)),
    Bi.traverse((n) => {
      n.isMesh && (oo.push(n), eo.push(n));
    }));
}
const _i = new f.Group();
ya.add(_i);
{
  const t = bt(),
    e = (F.x0 + F.x1) / 2,
    o = (F.z0 + F.z1) / 2,
    n = F.x1 - F.x0,
    a = F.z1 - F.z0,
    i = Rt("#4a5059", { roughness: 0.45 });
  t.box($f, e, F.y / 2, o, n, F.y, a)
    .box(
      B("#e0b04a", { roughness: 0.55 }),
      e,
      F.y + 0.004,
      F.z1 - 0.06,
      n,
      0.008,
      0.1,
    )
    .box(
      B("#e0b04a", { roughness: 0.55 }),
      F.x0 + 0.06,
      F.y + 0.004,
      o,
      0.1,
      0.008,
      a,
    );
  const l = 1.1,
    r = Math.atan2(F.y, l);
  t.box(
    $f,
    F.x0 - l / 2 + 0.02,
    F.y / 2 - 0.01,
    dt + 0.3,
    Math.hypot(l, F.y),
    0.05,
    0.86,
    { rz: r },
  );
  for (const x of [F.x0 + 0.45, F.x1 - 0.15])
    t.box(us, x, F.y * 0.55, F.z1 + 0.05, 0.34, 0.22, 0.1);
  const c = Rt("#a9b0b8", { roughness: 0.35, metalness: 0.7 }),
    h = Rt("#3b414a", { roughness: 0.5 }),
    d = B("#e0b04a", { roughness: 0.55 }),
    m = F.y - 0.008,
    u = (x, M, T) => {
      for (let k = M + 0.06; k < T - 0.03; k += 0.105)
        t.cyl(c, x, m, k, 0.022, 0.022, 0.5, { rz: Math.PI / 2, seg: 8 });
      t.box(h, x - 0.27, F.y + 0.012, (M + T) / 2, 0.035, 0.05, T - M).box(
        h,
        x + 0.27,
        F.y + 0.012,
        (M + T) / 2,
        0.035,
        0.05,
        T - M,
      );
    };
  u(vn, F.z0 + 0.02, on - 0.27);
  for (let x = vn - 0.24; x < ae + 0.27; x += 0.105)
    t.cyl(c, x, m, on, 0.022, 0.022, 0.5, { rx: Math.PI / 2, seg: 8 });
  t.box(
    h,
    (vn + ae) / 2 + 0.27,
    F.y + 0.012,
    on - 0.27,
    ae - vn,
    0.05,
    0.035,
  ).box(h, vn - 0.27, F.y + 0.012, on, 0.035, 0.05, 0.54);
  const g = F.z1,
    b = pl - 0.03,
    y = (g + b) / 2,
    w = b - g;
  (u(ae, g, b),
    t
      .box(h, ae + 0.13, F.y - 0.07, y, 0.84, 0.06, w)
      .box(
        Rt("#5a616b", { roughness: 0.6 }),
        ae + 0.45,
        F.y - 0.012,
        y,
        0.34,
        0.024,
        w,
      )
      .box(d, ae + 0.61, F.y + 0.002, y, 0.03, 0.006, w));
  for (const x of [g + 0.25, b - 0.2])
    for (const M of [ae - 0.24, ae + 0.58])
      t.cyl(h, M, (F.y - 0.1) / 2, x, 0.025, 0.03, F.y - 0.1, { seg: 8 });
  for (const x of [F.x0 + 0.12, F.x1 - 0.12])
    t.cyl(i, x, F.y + 0.8, F.z0 + 0.1, 0.03, 0.035, 1.6, { seg: 8 }).box(
      i,
      x,
      F.y + 1.6,
      F.z0 + 0.24,
      0.05,
      0.05,
      0.32,
    );
  _i.add(...t.flush(_i));
  for (const x of [F.x0 + 0.12, F.x1 - 0.12]) {
    const M = new f.Mesh(
      new f.BoxGeometry(0.16, 0.03, 0.1),
      be("#fff1d8", 2.8),
    );
    (M.position.set(x, F.y + 1.58, F.z0 + 0.38), _i.add(M));
  }
  _n(e, 1.5, o, "#ffe2b8", 2.8, 1);
}
const Tf = new f.Group();
Gt.add(Tf);
const Di = new f.Mesh(
  new f.BoxGeometry(1, 1, 1),
  new f.MeshBasicMaterial({ visible: !1 }),
);
Gt.add(Di);
let bl = [],
  Un = [];
function Af() {
  for (const x of bl) (x.parent?.remove(x), x.geometry?.dispose());
  ((bl = []), (Un = []));
  const t = Ei(),
    e = ba,
    o = Mf,
    n = Li,
    a = e - t,
    i = n - o,
    l = (t + e) / 2,
    r = (o + n) / 2,
    c = bt(),
    h = B("#2c3d43", { roughness: 0.88 }),
    d = B("#cfd8d4", { roughness: 0.7 }),
    m = Rt("#8d939b", { roughness: 0.5, metalness: 0.6 }),
    u = B("#a8865c", { roughness: 0.75 }),
    g = B("#b08a5c", { roughness: 0.85 }),
    b = B("#8f6d48", { roughness: 0.85 });
  c.box(h, l, 0.014, r, a, 0.028, i);
  for (let x = t + 1.2; x < e - 0.2; x += 1.2)
    c.box(d, x, 0.03, r, 0.025, 0.004, i - 0.3);
  c.box(d, l, 0.03, o + 0.18, a - 0.3, 0.004, 0.025).box(
    d,
    l,
    0.03,
    n - 0.18,
    a - 0.3,
    0.004,
    0.025,
  );
  const y = (x, M) => c.cyl(m, x, 0.32, M, 0.025, 0.025, 0.64, { seg: 6 });
  for (let x = t; x <= e + 0.01; x += 0.9) (y(x, o), y(x, n));
  for (let x = o; x <= n + 0.01; x += 0.8)
    (y(t, x), Math.abs(x - dt - 0.1) > 0.5 && y(e, x));
  for (const x of [0.28, 0.6])
    (c
      .box(m, l, x, o, a, 0.025, 0.025)
      .box(m, l, x, n, a, 0.025, 0.025)
      .box(m, t, x, r, 0.025, 0.025, i),
      c
        .box(m, e, x, (o + dt - 0.45) / 2, 0.025, 0.025, dt - 0.45 - o)
        .box(m, e, x, (dt + 0.65 + n) / 2, 0.025, 0.025, n - dt - 0.65));
  const w = t + 0.42;
  c.box(u, w, 0.16, o + 0.95, 0.12, 0.06, 1.1)
    .box(B("#3a3f47"), w, 0.07, o + 0.52, 0.28, 0.14, 0.08)
    .box(B("#3a3f47"), w, 0.07, o + 1.38, 0.28, 0.14, 0.08);
  for (let x = 0; x < 3; x++)
    c.box(
      B("#6f7680", { roughness: 0.7 }),
      w,
      0.07 + x * 0.07,
      n - 0.75 + x * 0.16,
      0.5,
      0.14 + x * 0.14,
      0.16,
    );
  for (let x = 0; x < 5; x++)
    c.box(
      x % 2 ? g : b,
      t + 1.08 + (x % 2) * 0.26,
      0.1 + Math.floor(x / 2) * 0.2,
      n - 0.42,
      0.24,
      0.2,
      0.24,
    );
  c.box(u, t + 1.18, 0.42, o + 0.5, 0.62, 0.04, 0.42)
    .box(B("#3a3f47"), t + 0.93, 0.2, o + 0.5, 0.04, 0.4, 0.34)
    .box(B("#3a3f47"), t + 1.43, 0.2, o + 0.5, 0.04, 0.4, 0.34);
  for (let x = 0; x < 3; x++)
    c.box(
      B(["#7a8aa0", "#c9b79a", "#8aa08a"][x]),
      t + 1.02 + x * 0.16,
      0.455 + x * 0.012,
      o + 0.46,
      0.13,
      0.025,
      0.15,
    );
  (bl.push(...c.flush(Tf)),
    Di.scale.set(a, 1.3, i),
    Di.position.set(l, 0.65, r),
    Sf.p.set(e - Math.min(a * 0.4, 3), 2.6, r),
    (Sf.r = Math.max(4.2, a * 0.45)));
  for (let x = e - 0.5; x > t + 1.85; x -= 0.74)
    for (let M = o + 0.5; M < n - 0.3; M += 0.74) Un.push([x, M]);
  (Un.sort(
    (x, M) =>
      Math.abs(x[0] - e) +
      Math.abs(x[1] - dt) * 0.6 -
      (Math.abs(M[0] - e) + Math.abs(M[1] - dt) * 0.6),
  ),
    (xe = !0));
}
const nu = 40,
  yl = (() => {
    const t = bt(),
      e = B("#b8925e", { roughness: 0.82 }),
      o = B("#9a764a", { roughness: 0.85 }),
      n = 0.46,
      a = 1.14;
    t.box(e, 0, a / 2, 0, n, a, n);
    for (const c of [0.06, a / 2, a - 0.06])
      for (const h of [-1, 1])
        t.box(o, 0, c, h * (n / 2 + 0.006), n + 0.02, 0.07, 0.02).box(
          o,
          h * (n / 2 + 0.006),
          c,
          0,
          0.02,
          0.07,
          n + 0.02,
        );
    {
      const c = a / 2 - 0.13,
        h = n - 0.04,
        d = Math.atan2(h, c),
        m = 0.53;
      for (const u of [0.06 + 0.035 + c / 2, a / 2 + 0.035 + c / 2])
        for (const g of [-1, 1])
          t.box(o, 0, u, g * (n / 2 + 0.007), 0.07, m, 0.016, {
            rz: g * d,
          }).box(o, g * (n / 2 + 0.007), u, 0, 0.016, m, 0.07, { rx: -g * d });
    }
    const i = t.geos(),
      l = ls(
        i.map((c) => c[1]),
        !0,
      ),
      r = new f.InstancedMesh(
        l,
        i.map((c) => c[0]),
        nu,
      );
    return (
      (r.count = 0),
      (r.castShadow = r.receiveShadow = !0),
      (r.frustumCulled = !1),
      ya.add(r),
      r
    );
  })(),
  co = new f.Group();
Gt.add(co);
const Oo = [];
let Ms = [];
const su = (t) => (t <= 1 ? "garage" : t <= 3 ? "shed" : "hall");
function xl(t) {
  return ms(256, 256, (e, o, n) => {
    const a = yo(t.length * 7);
    if (t === "garage") {
      ((e.fillStyle = "#8f8b84"), e.fillRect(0, 0, o, n));
      for (let i = 0; i < 220; i++)
        ((e.fillStyle = `rgba(${a() > 0.5 ? 30 : 240},${a() > 0.5 ? 28 : 236},${a() > 0.5 ? 26 : 230},${0.03 + a() * 0.04})`),
          e.beginPath(),
          e.ellipse(
            a() * o,
            a() * n,
            3 + a() * 28,
            2 + a() * 10,
            a() * 3,
            0,
            7,
          ),
          e.fill());
      ((e.strokeStyle = "#6b6760"),
        (e.lineWidth = 2),
        e.strokeRect(1, 1, o - 2, n - 2));
    } else if (t === "shed") {
      ((e.fillStyle = "#7f8489"), e.fillRect(0, 0, o, n));
      for (let i = 0; i < 160; i++)
        ((e.fillStyle = `rgba(255,255,255,${0.02 + a() * 0.03})`),
          e.fillRect(a() * o, a() * n, 2 + a() * 20, 1 + a() * 3));
      ((e.strokeStyle = "#5f6469"),
        (e.lineWidth = 3),
        e.strokeRect(1.5, 1.5, o - 3, n - 3));
    } else {
      ((e.fillStyle = "#8f949b"),
        e.fillRect(0, 0, o, n),
        (e.fillStyle = "#858a91"),
        e.fillRect(10, 10, o - 20, n - 20),
        (e.strokeStyle = "#5d626a"),
        (e.lineWidth = 5),
        e.strokeRect(2.5, 2.5, o - 5, n - 5),
        (e.fillStyle = "#9ca1a8"));
      for (const [i, l] of [
        [24, 24],
        [o - 24, 24],
        [24, n - 24],
        [o - 24, n - 24],
      ])
        (e.beginPath(), e.arc(i, l, 5, 0, 7), e.fill());
    }
  });
}
const wl = { garage: xl("garage"), shed: xl("shed"), hall: xl("hall") };
for (const t of Object.values(wl)) t.wrapS = t.wrapT = f.RepeatWrapping;
const xa = _o(
    new f.MeshStandardMaterial({
      map: wl.garage,
      roughness: 0.28,
      metalness: 0.05,
      envMapIntensity: 0.5,
    }),
    sd,
  ),
  Ss = new f.Mesh(new f.PlaneGeometry(1, 1), xa);
((Ss.rotation.x = -Math.PI / 2),
  (Ss.receiveShadow = !0),
  co.add(Ss),
  eo.push(Ss));
const au = {
    garage: B("#cdbfa6", { roughness: 0.82 }),
    shed: Rt("#8c939b", { roughness: 0.45, metalness: 0.55, clearcoat: 0 }),
    hall: B("#d2d0cb", { roughness: 0.7 }),
  },
  iu = {
    garage: B("#b9ab92", { roughness: 0.85 }),
    shed: B("#9aa0a6", { roughness: 0.6 }),
    hall: B("#3a4150", { roughness: 0.6 }),
  },
  ru = B("#1c2029", { roughness: 0.7 }),
  lu = ea(B("#7d7a74", { roughness: 0.85 }), "#bebbb3"),
  Cf = ea(B("#5f5e5a", { roughness: 0.92 }), "#a3a199");
let Pi = [];
function zo() {
  const t = s.lvl;
  return [1.75, 1.85, 2.1, 2.5, 2.9, 3.2, 3.5, 3.8][t];
}
function Lf() {
  for (const m of Pi) (m.parent?.remove(m), m.geometry?.dispose());
  ((Pi = []), (Oo.length = 0));
  for (const m of Ms) {
    const u = ri.indexOf(m);
    u >= 0 && ri.splice(u, 1);
  }
  Ms = [];
  const t = gt(),
    e = vt(),
    o = su(s.lvl),
    n = zo();
  (Ss.scale.set(t, e, 1),
    Ss.position.set(t / 2, kt, -e / 2),
    (xa.map = wl[o]),
    xa.map.repeat.set(t, e),
    (xa.roughness = o === "hall" ? 0.22 : o === "shed" ? 0.3 : 0.34),
    (xa.needsUpdate = !0));
  const a = bt();
  (a.box(lu, t / 2, -0.05, -e / 2, t + 0.5, 0.2, e + 0.5),
    a.box(Cf, t / 2 + 1, -0.005, -e / 2 + 0.5, t + 8, 0.03, e + 7),
    a.box(Cf, 1.9, 0.012, en / 2, 3.4, 0.036, en + 0.2),
    Pi.push(...a.flush(co)));
  const i = 0.18,
    l = au[o],
    r = iu[o];
  [
    { n: [0, 1], len: t, cx: t / 2, cz: i / 2, ry: 0 },
    { n: [1, 0], len: e, cx: t + i / 2, cz: -e / 2, ry: Math.PI / 2 },
    { n: [0, -1], len: t, cx: t / 2, cz: -e - i / 2, ry: 0 },
    { n: [-1, 0], len: e, cx: -i / 2, cz: -e / 2, ry: Math.PI / 2 },
  ].forEach((m, u) => {
    const g = new f.Group();
    (g.position.set(m.cx, kt, m.cz),
      (g.rotation.y = m.ry),
      co.add(g),
      Pi.push(g));
    const b = new f.Group();
    g.add(b);
    const y = bt(),
      w = m.len + (u % 2 ? 0 : i * 2),
      x = u === 0 || u === 1 ? -1 : 1,
      M = u === 0,
      T = Mt - t / 2,
      k = 0.62,
      S = Math.min(1.5, n - 0.25),
      C = M
        ? [
            [-w / 2, T - k],
            [T + k, w / 2],
          ]
        : [[-w / 2, w / 2]];
    for (const [$, L] of C)
      L - $ < 0.01 ||
        (y.box(l, ($ + L) / 2, n / 2, 0, L - $, n, i),
        y.box(
          r,
          ($ + L) / 2,
          n / 2,
          x * (i / 2 + 0.004),
          Math.max(0.01, L - $ - 0.02),
          n - 0.02,
          0.01,
        ));
    if (
      (M &&
        (y.box(l, T, (S + n) / 2, 0, k * 2, n - S, i),
        y.box(
          r,
          T,
          (S + n) / 2,
          x * (i / 2 + 0.004),
          k * 2,
          n - S - 0.02,
          0.01,
        ),
        y.box(
          B("#2a2e35", { roughness: 0.5 }),
          T,
          S + 0.03,
          -x * (i / 2 + 0.01),
          k * 2 + 0.1,
          0.06,
          0.03,
        )),
      y.box(
        o === "hall" ? Rt("#5b636e", { roughness: 0.4 }) : B("#e9e4da"),
        0,
        n + 0.03,
        0,
        w + 0.02,
        0.06,
        i + 0.04,
      ),
      o === "garage" && !M)
    )
      for (let $ = 0.2; $ < n; $ += 0.22)
        y.box(
          B("#bfb197", { roughness: 0.85 }),
          0,
          $,
          -x * (i / 2 + 0.006),
          w,
          0.025,
          0.012,
        );
    else if (o === "shed") {
      for (let $ = -w / 2 + 0.15; $ < w / 2; $ += 0.3)
        y.box(
          Rt("#7d848c", { roughness: 0.5, metalness: 0.5, clearcoat: 0 }),
          $,
          n / 2,
          -x * (i / 2 + 0.01),
          0.06,
          n - 0.06,
          0.03,
        );
      for (let $ = -w / 2 + 1.5; $ < w / 2 - 1; $ += 3)
        y.geo(
          be("#9cc7ff", 0.9),
          new f.BoxGeometry(1.6, 0.36, 0.02),
          $,
          n - 0.42,
          -x * (i / 2 + 0.025),
        );
    } else {
      for (let $ = -w / 2 + 2; $ < w / 2 - 0.5; $ += 2)
        y.box(
          B("#b9b7b1", { roughness: 0.7 }),
          $,
          n / 2,
          -x * (i / 2 + 0.004),
          0.04,
          n,
          0.012,
        );
      (y.box(B("#a6a49e"), 0, n * 0.62, -x * (i / 2 + 0.005), w, 0.04, 0.012),
        y.geo(
          be("#7fe3ff", 2.2),
          new f.BoxGeometry(w - 0.4, 0.035, 0.035),
          0,
          n - 0.25,
          x * (i / 2 + 0.03),
        ));
    }
    b.add(...y.flush(b, !0));
    const R = new f.Group();
    g.add(R);
    for (const [$, L] of C) {
      if (L - $ < 0.01) continue;
      const _ = new f.Mesh(new f.BoxGeometry(L - $, 0.28, i + 0.02), l);
      (_.position.set(($ + L) / 2, 0.14, 0),
        (_.castShadow = _.receiveShadow = !0),
        g.add(_));
      const I = new f.Mesh(
        new f.BoxGeometry(L - $ + 0.005, 0.02, i + 0.025),
        ru,
      );
      (I.position.set(($ + L) / 2, 0.285, 0), R.add(I));
    }
    if (M) {
      const $ = new f.Mesh(
        new f.BoxGeometry(0.5, 0.03, 0.05),
        be("#fff1d8", 2.4),
      );
      ($.position.set(T, S + 0.12, -x * (i / 2 + 0.04)), b.add($));
    }
    Oo.push({ g, tall: b, n: m.n, k: 1, kT: 1, cut: R });
  });
  const h = -e + 0.1,
    d = t - 0.1;
  if (o === "garage") {
    const m = bt();
    m.box(B("#a8865c", { roughness: 0.8 }), 1.4, 1.55, 0, 1.7, 0.95, 0.03).box(
      B("#6b5a44"),
      1.4,
      2.12,
      0.05,
      1.9,
      0.04,
      0.22,
    );
    for (let y = 0; y < 6; y++)
      m.box(
        y % 2 ? Rt("#9aa3ad") : B("#b54a3a"),
        0.75 + y * 0.26,
        1.4 + (y % 3) * 0.12,
        0.04,
        0.04,
        0.34 + (y % 2) * 0.1,
        0.03,
      );
    m.box(
      B("#3b3f47", { roughness: 0.6 }),
      t - 1.05,
      1.9,
      -0.01,
      1.12,
      0.4,
      0.03,
    );
    const u = new f.Group();
    (u.position.set(-t / 2, 0, 0.1),
      u.add(...m.flush(u, !1)),
      Oo[2].tall.add(u));
    const g = new f.Mesh(new f.BoxGeometry(1.2, 0.05, 0.05), be("#f2f6ff", 3));
    (g.position.set(t / 2, zo() - 0.2, h + 0.2),
      Oo[2].tall.add(g),
      g.position.set(0, zo() - 0.25, 0.15),
      Ms.push(li(t / 2, zo() - 0.5, -e / 2, "#ffe9cc", 5, 0.6)));
    {
      const y = bt(),
        w = B("#a77f52", { roughness: 0.85 }),
        x = B("#8c6a46", { roughness: 0.85 });
      y.box(B("#6b5a44"), 0, 1.95, -0.16, e - 0.6, 0.04, 0.32);
      for (let k = 0; k < 4; k++)
        y.box(
          k % 2 ? w : x,
          -e / 2 + 0.6 + k * 0.62,
          2.12,
          -0.17,
          0.42 + (k % 2) * 0.1,
          0.3 - (k % 3) * 0.05,
          0.28,
        );
      const M = Rt("#2f4f6b", { roughness: 0.35 });
      y.tor(us, -0.55, 1.25, -0.1, 0.28, 0.035, { seg: 24 })
        .tor(us, 0.45, 1.25, -0.1, 0.28, 0.035, { seg: 24 })
        .box(M, -0.05, 1.38, -0.1, 0.95, 0.04, 0.04, { rz: 0.12 })
        .box(M, 0.2, 1.5, -0.1, 0.04, 0.4, 0.04, { rz: -0.3 })
        .box(us, 0.32, 1.72, -0.1, 0.16, 0.04, 0.06);
      const T = new f.Group();
      (T.add(...y.flush(T, !1)), Oo[1].tall.add(T));
    }
    const b = new f.Mesh(
      new f.CylinderGeometry(0.16, 0.16, 0.03, 24),
      B("#efe9dc"),
    );
    ((b.rotation.x = Math.PI / 2),
      b.position.set(-t / 2 + 0.35, 1.95, 0.12),
      Oo[2].tall.add(b));
  }
  if ((fu(o), o === "hall")) {
    const m = Math.min(4, Math.floor(t / 5));
    for (let u = 0; u < m; u++) {
      const g = new f.Mesh(
        new f.PlaneGeometry(1.6, 0.9),
        new f.MeshBasicMaterial({ map: hu, color: new f.Color(1.4, 1.4, 1.4) }),
      );
      (g.position.set(-t / 2 + ((u + 0.5) * t) / m, zo() * 0.62, 0.12),
        Oo[2].tall.add(g));
    }
  }
  for (let m = 0; m < Math.max(1, Math.round(e / 6)); m++)
    for (let u = 0; u < Math.max(1, Math.round(t / 7)); u++)
      Ms.push(
        li(
          ((u + 0.5) * t) / Math.max(1, Math.round(t / 7)),
          zo() * 0.8,
          (-(m + 0.5) * e) / Math.max(1, Math.round(e / 6)),
          o === "hall" ? "#9fdcff" : "#f4f0e6",
          Math.max(t, e) * 0.5,
          0.35,
        ),
      );
  (cu(), vu(), i0());
}
let wa = [],
  vl = [];
function cu() {
  for (const h of wa) (h.parent?.remove(h), h.geometry?.dispose());
  wa = [];
  const t = gt(),
    e = vt(),
    o = bt(),
    n = (h, d, m, u, g, b = 0.5, y = 0.4, w = 0.07) => {
      const x = Math.hypot(u - d, g - m);
      if (x < 0.5) return;
      const M = Math.floor(x / (b + y)),
        T = (u - d) / x,
        k = (g - m) / x;
      for (let S = 0; S < M; S++) {
        const C = S * (b + y) + b / 2;
        o.box(
          h,
          d + T * C,
          0.035,
          m + k * C,
          Math.abs(T) > 0.5 ? b : w,
          0.012,
          Math.abs(T) > 0.5 ? w : b,
        );
      }
    },
    a = pt[s.lvl + 1],
    i = pt[pt.length - 1],
    l = be("#cfe6ff", 0.6),
    r = be("#9fdcff", 0.45),
    c = (h, d, m, u, g, b) => {
      (n(m, t + 0.3, 0.12, h, 0.12, u, g, b),
        n(m, h, 0.12, h, -d, u, g, b),
        n(m, h, -d, -0.12, -d, u, g, b),
        n(m, -0.12, -d, -0.12, -e - 0.3, u, g, b));
    };
  if (
    (a && c(a[0], a[1], l, 0.42, 0.3, 0.06),
    s.lvl < pt.length - 2 && c(i[0], i[1], r, 0.14, 0.55, 0.14),
    wa.push(...o.flush(co, !1)),
    (vl = []),
    a)
  ) {
    const h = new f.MeshBasicMaterial({
      color: "#9fdcff",
      transparent: !0,
      opacity: 0.16,
      depthWrite: !1,
    });
    for (const [d, m, u, g] of [
      [t, 0, a[0], -a[1]],
      [0, -e, t, -a[1]],
    ]) {
      if (u - d < 0.05 || m - g < 0.05) continue;
      const b = new f.Mesh(new f.PlaneGeometry(u - d, m - g), h);
      ((b.rotation.x = -Math.PI / 2),
        b.position.set((d + u) / 2, 0.03, (m + g) / 2),
        (b.visible = !1),
        (b.renderOrder = 2),
        co.add(b),
        wa.push(b),
        vl.push(b));
    }
  }
  for (const h of wa) (oo.push(h), eo.push(h));
}
let kl = !1;
const Vn = aa(0.92, 0.24, 768, 200, null, 1.7, { alphaTest: 0.06 });
function Ml() {
  Vn.userData.redraw((t, e, o) => {
    ((t.textAlign = "center"),
      (t.textBaseline = "middle"),
      (t.font = "600 104px Outfit, sans-serif"),
      (t.letterSpacing = "8px"),
      (t.shadowColor = kl ? "#ffd27a" : "#ff7ad9"),
      (t.shadowBlur = 26),
      (t.fillStyle = kl ? "#ffe6b0" : "#ffc4ec"),
      t.fillText("@RYANSAEL", e / 2, o / 2 + 4),
      (t.shadowBlur = 0),
      (t.fillStyle = "#fff6fb"),
      t.fillText("@RYANSAEL", e / 2, o / 2 + 4));
  });
}
(Ml(),
  gi.push(Ml),
  eo.push(Vn),
  mi.push({
    hit: Vn,
    over(t) {
      ((kl = t), Ml());
    },
  }));
const va = kd(1.5, { k: 0.85 });
function fu(t) {
  const e = gt(),
    o = Oo[2].tall;
  (Vn.parent?.remove(Vn),
    va.parent?.remove(va),
    t === "garage"
      ? (Vn.position.set(e / 2 - 1.05, 1.9, 0.13), o.add(Vn))
      : (va.scale.setScalar(D(e / 12, 1, 2.6)),
        va.position.set(-e * 0.28, zo() * 0.8, 0.13),
        o.add(va)));
}
const hu = ms(512, 288, (t, e, o) => {
  ((t.fillStyle = "#08111c"),
    t.fillRect(0, 0, e, o),
    (t.strokeStyle = "#1c3a52"),
    (t.lineWidth = 2));
  for (let n = 0; n < e; n += 32)
    (t.beginPath(), t.moveTo(n, 0), t.lineTo(n, o), t.stroke());
  ((t.strokeStyle = "#7fe3ff"), (t.lineWidth = 4), t.beginPath());
  for (let n = 0; n <= e; n += 8) {
    const a =
      o * 0.85 - Math.pow(n / e, 2.2) * o * 0.62 - Math.sin(n * 0.05) * 4;
    n ? t.lineTo(n, a) : t.moveTo(n, a);
  }
  (t.stroke(),
    (t.fillStyle = "#ffb454"),
    (t.font = "600 26px DM Mono, monospace"),
    t.fillText("ROBOTS / DAY", 18, 36));
});
function du(t) {
  const e = gt() / 2,
    o = -vt() / 2,
    n = H.position.x - e,
    a = H.position.z - o,
    i = Math.hypot(n, a) || 1;
  for (const l of Oo) {
    const r = (l.n[0] * n + l.n[1] * a) / i;
    ((l.kT = r > 0.12 ? 0 : 1), (l.k += (l.kT - l.k) * (1 - Math.exp(-t * 7))));
    const c = Math.max(0.001, l.k);
    ((l.tall.scale.y = c),
      (l.tall.visible = c > 0.02),
      (l.cut.visible = c < 0.5));
  }
  Mo.visible = (Oo[2]?.k ?? 1) > 0.55;
}
const Mo = new f.Group();
Gt.add(Mo);
const ka = 18,
  qn = 0.45,
  Ma = [0, 1, 2].map(() => {
    const t = document.createElement("canvas");
    ((t.width = 1600), (t.height = 720));
    const e = new f.CanvasTexture(t);
    return (
      (e.colorSpace = f.SRGBColorSpace),
      (e.anisotropy = 8),
      { c: t, g: t.getContext("2d"), t: e }
    );
  }),
  Sa = {
    t0: { value: Ma[0].t },
    t1: { value: Ma[1].t },
    t2: { value: Ma[2].t },
    uBase: { value: 0 },
    uProg: { value: 0 },
    uN: { value: ka },
    uHot: { value: 0 },
    uSheen: { value: -2 },
  },
  Fi = new f.Mesh(
    (() => {
      const t = [],
        e = [],
        o = [],
        n = [],
        a = [],
        i = 1 / ka,
        l = i / Math.sqrt(3);
      for (let c = 0; c < ka; c++) {
        const h = -0.5 + (c + 0.5) * i;
        for (let d = 0; d < 3; d++) {
          const m = Math.PI / 2 + (d * 2 * Math.PI) / 3,
            u = [l * Math.cos(m + Math.PI / 3), l * Math.sin(m + Math.PI / 3)],
            g = [l * Math.cos(m - Math.PI / 3), l * Math.sin(m - Math.PI / 3)],
            b = c / ka,
            y = (c + 1) / ka;
          for (const [w, x, M, T] of [
            [u, -qn / 2, b, 0],
            [g, -qn / 2, y, 0],
            [g, qn / 2, y, 1],
            [u, -qn / 2, b, 0],
            [g, qn / 2, y, 1],
            [u, qn / 2, b, 1],
          ])
            (t.push(w[0], x, w[1]),
              e.push(Math.cos(m), 0, Math.sin(m)),
              o.push(M, T),
              n.push(h, c),
              a.push(d));
        }
      }
      const r = new f.BufferGeometry();
      return (
        r.setAttribute("position", new f.Float32BufferAttribute(t, 3)),
        r.setAttribute("normal", new f.Float32BufferAttribute(e, 3)),
        r.setAttribute("uv", new f.Float32BufferAttribute(o, 2)),
        r.setAttribute("aSlat", new f.Float32BufferAttribute(n, 2)),
        r.setAttribute("aFace", new f.Float32BufferAttribute(a, 1)),
        r
      );
    })(),
    new f.ShaderMaterial({
      uniforms: Sa,
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
((Fi.position.y = 0.225), (Fi.frustumCulled = !1), Mo.add(Fi), eo.push(Fi));
const Oi = new f.Mesh(
  new f.PlaneGeometry(1, qn),
  new f.MeshBasicMaterial({ visible: !1 }),
);
(Oi.position.set(0, 0.225, 0.035), Mo.add(Oi));
{
  const t = bt(),
    e = B("#3d434c", { roughness: 0.5, metalness: 0.4 });
  t.box(B("#07080c", { roughness: 0.9 }), 0, 0.225, -0.062, 1.02, 0.47, 0.03)
    .box(e, 0, 0.225, -0.09, 1.06, 0.5, 0.03)
    .box(e, -0.32, -0.45, -0.11, 0.05, 1, 0.05)
    .box(e, 0.32, -0.45, -0.11, 0.05, 1, 0.05)
    .box(e, 0, -0.03, -0.11, 0.9, 0.03, 0.08)
    .box(e, 0, 0.466, -0.035, 1.09, 0.032, 0.1)
    .box(e, 0, -0.016, -0.035, 1.09, 0.032, 0.1)
    .box(e, -0.528, 0.225, -0.035, 0.026, 0.51, 0.1)
    .box(e, 0.528, 0.225, -0.035, 0.026, 0.51, 0.1);
  for (const o of [-0.35, 0, 0.35]) t.box(e, o, 0.52, 0.06, 0.02, 0.02, 0.16);
  Mo.add(...t.flush(Mo));
  for (const o of [-0.35, 0, 0.35]) {
    const n = new f.Mesh(
      new f.BoxGeometry(0.08, 0.015, 0.03),
      be("#fff2d6", 3),
    );
    (n.position.set(o, 0.535, 0.14), Mo.add(n));
  }
}
const tt = {
  face: 0,
  base: 0,
  prog: 0,
  turning: !1,
  at: 0,
  sheen: -9,
  hot: 0,
  hotT: 0,
  pin: si.has("board") ? D(+si.get("board") | 0, 0, 2) : -1,
};
tt.pin >= 0 && (tt.face = tt.base = tt.pin);
const Ef = () => (tt.turning && tt.prog > 0.5 ? (tt.face + 1) % 3 : tt.face);
function uu(t, e) {
  const o = de.billboard;
  (tt.at === 0 && (tt.at = t),
    tt.pin < 0 &&
      !tt.turning &&
      t - tt.at > (o[tt.face].hold || 8) &&
      ((tt.turning = !0), (tt.at = t)),
    tt.turning &&
      ((tt.prog = D((t - tt.at) / 1.8, 0, 1)),
      tt.prog >= 1 &&
        ((tt.turning = !1),
        (tt.prog = 0),
        (tt.base = (tt.base + 1) % 3),
        (tt.face = (tt.face + 1) % 3),
        (tt.at = t),
        (tt.sheen = t))),
    (tt.hot += (tt.hotT - tt.hot) * (1 - Math.exp(-e * 10))),
    (Sa.uBase.value = tt.base),
    (Sa.uProg.value = tt.prog),
    (Sa.uHot.value = tt.hot),
    (Sa.uSheen.value = (t - tt.sheen) * 1.5 - 0.4));
}
const $s = new Map();
function If(t, e) {
  if (!t.logo) return null;
  let o = $s.get(t.id);
  return (
    o ||
      ((o = new Image()),
      (o.onload = e),
      (o.src =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t.logo)),
      $s.set(t.id, o)),
    o.complete && o.naturalWidth ? o : null
  );
}
function zi(t) {
  const e = de.billboard[t],
    { g: o, c: n, t: a } = Ma[t],
    i = n.width,
    l = n.height;
  if (
    (o.clearRect(0, 0, i, l),
    (o.textAlign = "center"),
    (o.textBaseline = "alphabetic"),
    (o.letterSpacing = "0px"),
    e.img)
  ) {
    let r = $s.get(e.id + ":img");
    if (
      (r ||
        ((r = new Image()),
        (r.onload = () => zi(t)),
        (r.src = e.img),
        $s.set(e.id + ":img", r)),
      r.complete && r.naturalWidth)
    ) {
      (o.drawImage(r, 0, 0, i, l), (a.needsUpdate = !0));
      return;
    }
  }
  if (e.kind === "brand") {
    const r = o.createLinearGradient(0, 0, 0, l);
    (r.addColorStop(0, e.bg[0]),
      r.addColorStop(1, e.bg[1]),
      (o.fillStyle = r),
      o.fillRect(0, 0, i, l),
      o.save(),
      (o.globalAlpha = 0.09),
      (o.strokeStyle = e.accent),
      (o.lineWidth = 2.5));
    const c = 212;
    for (let b = 0; b < 12; b++) {
      const y = 30 + b * 60;
      (o.beginPath(),
        o.moveTo(-10, y),
        o.bezierCurveTo(200, y, 180, c, 300, c),
        o.stroke());
    }
    ((o.globalAlpha = 0.16),
      (o.lineWidth = 5),
      o.beginPath(),
      o.moveTo(1340, c),
      o.bezierCurveTo(1300, c, 1300, c, i + 10, c),
      o.stroke(),
      o.restore());
    const h = If(e, () => {
        zi(t);
      }),
      d = 176,
      m = d * e.logoAspect;
    (h
      ? o.drawImage(h, (i - m) / 2, c - d / 2, m, d)
      : ((o.fillStyle = e.ink),
        (o.font = "800 130px Outfit, sans-serif"),
        o.fillText(e.name, i / 2, c + 46)),
      (o.fillStyle = e.ink),
      (o.font = "700 88px Outfit, sans-serif"),
      o.fillText(e.head, i / 2, 448, i - 160),
      (o.font = "600 46px DM Mono, monospace"));
    const u = e.cta + "  \u2197",
      g = o.measureText(u).width;
    ((o.fillStyle = e.accent),
      gs(o, i / 2 - g / 2 - 40, 526, g + 80, 92, 46),
      o.fill(),
      (o.fillStyle = "#0b0b0f"),
      o.fillText(u, i / 2, 587));
  } else if (e.kind === "game") {
    const r = o.createLinearGradient(0, 0, i, l);
    (r.addColorStop(0, "#13213f"),
      r.addColorStop(1, "#060a14"),
      (o.fillStyle = r),
      o.fillRect(0, 0, i, l),
      (o.fillStyle = "#dfe6f5"),
      (o.font = "600 58px Outfit, sans-serif"),
      (o.letterSpacing = "12px"),
      o.fillText("A NATION OF", i / 2 + 6, 150),
      (o.letterSpacing = "4px"),
      (o.fillStyle = "#7fe3ff"),
      (o.font = "800 190px Outfit, sans-serif"),
      o.fillText("ROBOTS", i / 2 + 2, 326),
      (o.letterSpacing = "0px"),
      (o.fillStyle = "#b9c3d8"),
      (o.font = "500 42px Outfit, sans-serif"),
      o.fillText("One built by hand, then ten million a year", i / 2, 398),
      (o.strokeStyle = "#7fe3ff"),
      (o.lineWidth = 5),
      (o.lineJoin = "round"),
      (o.lineCap = "round"));
    const c = 604;
    (o.beginPath(),
      o.moveTo(230, c),
      o.lineTo(230, c - 46),
      o.moveTo(400, c),
      o.lineTo(400, c - 46),
      o.moveTo(210, c - 46),
      o.lineTo(420, c - 46),
      o.stroke(),
      o.beginPath(),
      o.moveTo(255, c - 62),
      o.lineTo(350, c - 62),
      o.stroke(),
      o.beginPath(),
      o.arc(372, c - 64, 13, 0, 7),
      o.stroke(),
      o.setLineDash([4, 18]),
      o.beginPath(),
      o.moveTo(470, c - 34),
      o.lineTo(1e3, c - 34),
      o.stroke(),
      o.setLineDash([]),
      o.beginPath(),
      o.moveTo(980, c - 50),
      o.lineTo(1004, c - 34),
      o.lineTo(980, c - 18),
      o.stroke());
    for (let h = 0; h < 7; h++) {
      const d = 1070 + h * 52,
        m = c - (h % 2) * 10;
      (o.beginPath(),
        o.arc(d, m - 86, 11, 0, 7),
        o.moveTo(d, m - 74),
        o.lineTo(d, m - 34),
        o.moveTo(d - 16, m - 60),
        o.lineTo(d + 16, m - 60),
        o.moveTo(d, m - 34),
        o.lineTo(d - 11, m),
        o.moveTo(d, m - 34),
        o.lineTo(d + 11, m),
        o.stroke());
    }
    ((o.fillStyle = "#ffb454"),
      (o.font = "600 36px DM Mono, monospace"),
      o.fillText("sael.net/robots", i / 2, 676));
  } else if (e.kind === "goal") {
    const r = o.createLinearGradient(0, 0, i, l);
    (r.addColorStop(0, "#1d1a12"),
      r.addColorStop(1, "#07090f"),
      (o.fillStyle = r),
      o.fillRect(0, 0, i, l),
      (o.fillStyle = "#ffb454"),
      (o.font = "800 210px DM Mono, monospace"),
      (o.letterSpacing = "-4px"),
      o.fillText("10,000,000", i / 2, 300, i - 120),
      (o.letterSpacing = "8px"),
      (o.fillStyle = "#f4f6fb"),
      (o.font = "700 66px Outfit, sans-serif"),
      o.fillText("ROBOTS A YEAR", i / 2 + 4, 402),
      (o.letterSpacing = "0px"),
      (o.fillStyle = "#c9d1e4"),
      (o.font = "500 42px Outfit, sans-serif"),
      o.fillText(
        "Robots building robots. Start with one.",
        i / 2,
        494,
        i - 200,
      ));
    for (let c = 0; c < 26; c++) {
      const h = 180 + c * 48.5,
        d = 10 + Math.pow(c / 25, 2.6) * 86;
      ((o.fillStyle = c > 22 ? "#ffb454" : "#7fe3ff"),
        o.fillRect(h, 628 - d, 30, d));
    }
  } else
    ((o.fillStyle = "#0d1424"),
      o.fillRect(0, 0, i, l),
      (o.strokeStyle = "#ffb454"),
      (o.lineWidth = 7),
      o.setLineDash([30, 20]),
      o.strokeRect(48, 48, i - 96, l - 96),
      o.setLineDash([]),
      (o.fillStyle = "#f4f6fb"),
      (o.font = "800 128px Outfit, sans-serif"),
      (o.letterSpacing = "3px"),
      o.fillText("YOUR BRAND HERE", i / 2, 330, i - 180),
      (o.letterSpacing = "0px"),
      (o.fillStyle = "#c9d1e4"),
      (o.font = "500 44px Outfit, sans-serif"),
      o.fillText(
        "Seen by every player, from the first garage to the gigafactory",
        i / 2,
        412,
        i - 200,
      ),
      (o.fillStyle = "#ffb454"),
      (o.font = "600 38px DM Mono, monospace"),
      o.fillText("1600 \xD7 720  \xB7  DM @RYANSAEL", i / 2, 520));
  a.needsUpdate = !0;
}
function Rs(t, e, o) {
  const n = v("#brandcard");
  if (!t) {
    n.classList.remove("on");
    return;
  }
  n.dataset.id !== t.id &&
    ((n.dataset.id = t.id),
    n.style.setProperty("--acc", t.accent || "#ffb454"),
    (n.innerHTML =
      t.kind === "brand"
        ? `${t.thanks ? `<span class="bc-kick" style="margin-bottom:11px">${t.thanks}</span>` : ""}<div class="bc-logo">${t.logo}</div><b>${t.head}.</b><p>${t.about} ${t.sub}</p><div class="bc-stats">${(t.stats || []).map(([i, l]) => `<div><i>${i}</i><span>${l}</span></div>`).join("")}</div><span class="bc-cta">Click the billboard \xB7 ${t.cta} \u2197</span>`
        : '<span class="bc-kick">Sponsor slot</span><b>This billboard is for rent</b><p>It stands on the back wall in every frame, from the first garage to the gigafactory, it turns with two other faces, and it is a link. Creative: 1600 \xD7 720.</p><span class="bc-cta">DM @RYANSAEL on X \u2197</span>'));
  const a = n.getBoundingClientRect();
  ((n.style.left = D(e + 18, 12, innerWidth - a.width - 12) + "px"),
    (n.style.top = D(o + 22, 12, innerHeight - a.height - 12) + "px"),
    n.classList.add("on"));
}
function pu() {
  const t = gt(),
    e = vt(),
    o = D(1.2 + t * 0.3, 2.3, 14),
    n = t * 0.7,
    a = -e - 0.35;
  (Mo.scale.setScalar(o),
    Mo.position.set(n, kt + zo() + o * 0.5, a),
    (Mo.rotation.y = Lt.yaw * 0.35),
    Ms.push(
      li(n, kt + zo() + o * 0.55, a + o * 0.45, "#fff0d8", o * 0.8, 0.9),
    ));
}
const sn = new f.Group();
Gt.add(sn);
const Gi = document.createElement("canvas");
((Gi.width = 2048), (Gi.height = 512));
const ji = new f.CanvasTexture(Gi);
((ji.colorSpace = f.SRGBColorSpace), (ji.anisotropy = 8));
let Bf = !1;
function Sl() {
  const t = Gi.getContext("2d"),
    e = 2048,
    o = 512;
  ((t.fillStyle = "#d9d6cf"),
    t.fillRect(0, 0, e, o),
    (t.fillStyle = "#c9c5bd"));
  for (let n = 0; n < e; n += 128) t.fillRect(n, 0, 3, o);
  ((t.fillStyle = "#bdb8ae"),
    t.fillRect(0, 0, e, 26),
    t.fillRect(0, o - 26, e, 26),
    (t.font = "700 150px Outfit, sans-serif"),
    (t.letterSpacing = "14px"),
    (t.textAlign = "center"),
    (t.textBaseline = "middle"),
    (t.fillStyle = Bf ? "#e08a24" : "#2f3540"),
    t.fillText("@RYANSAEL", e / 2, o / 2 + 8),
    (ji.needsUpdate = !0));
}
const gu = _o(
  new f.MeshStandardMaterial({
    map: ji,
    roughness: 0.55,
    metalness: 0.15,
    envMapIntensity: 0.6,
  }),
);
{
  const t = bt(),
    e = Rt("#7d838c", { roughness: 0.45, metalness: 0.6 });
  for (let a = 0; a < 4; a++) {
    const i = (a / 4) * Math.PI * 2 + Math.PI / 4,
      l = Math.cos(i) * 1.25,
      r = Math.sin(i) * 1.25;
    t.cyl(e, l * 0.85, 3, r * 0.85, 0.07, 0.09, 6.2, {
      seg: 6,
      rz: -l * 0.05,
      rx: r * 0.05,
    });
  }
  (t
    .tor(e, 0, 2.2, 0, 1.08, 0.04, { rx: Math.PI / 2, seg: 24 })
    .tor(e, 0, 4.2, 0, 1.02, 0.04, { rx: Math.PI / 2, seg: 24 })
    .cyl(e, 0, 3.4, 0, 0.12, 0.12, 6.8, { seg: 8 }),
    t
      .cone(B("#9aa0a8", { roughness: 0.5 }), 0, 8.15, 0, 1.75, 0.9, {
        seg: 24,
      })
      .cyl(B("#bdb8ae", { roughness: 0.6 }), 0, 6.35, 0, 1.62, 1.2, 0.5, {
        seg: 24,
      }),
    sn.add(...t.flush(sn)));
  const o = new f.Mesh(new f.CylinderGeometry(1.7, 1.7, 1.6, 48, 1, !0), gu);
  ((o.position.y = 7.35),
    (o.castShadow = !0),
    sn.add(o),
    (sn.userData.tank = o));
  const n = new f.Mesh(new f.CircleGeometry(1.7, 48), B("#9aa0a8"));
  ((n.rotation.x = -Math.PI / 2),
    (n.position.y = 8.15),
    sn.add(n),
    mi.push({
      hit: o,
      over(a) {
        ((Bf = a), Sl());
      },
    }),
    Sl());
}
function mu() {
  const t = gt(),
    e = vt();
  sn.position.set(-3.4 - t * 0.05, 0, -e - 3.2 - e * 0.15);
  const o = D(0.75 + t * 0.012, 0.75, 1.25);
  (sn.scale.setScalar(o), (sn.userData.tank.rotation.y = Lt.yaw + Math.PI));
}
const Wn = new f.Group();
Gt.add(Wn);
const Ni = document.createElement("canvas");
((Ni.width = 1024), (Ni.height = 384));
const $a = new f.CanvasTexture(Ni);
(($a.colorSpace = f.SRGBColorSpace), ($a.anisotropy = 8));
const bu = _o(
    new f.MeshStandardMaterial({
      map: $a,
      roughness: 0.82,
      envMapIntensity: 0.3,
    }),
  ),
  yu = new f.MeshBasicMaterial({
    map: $a,
    color: new f.Color(1.08, 1.08, 1.08),
  });
let $l = -1,
  Ra = [],
  _f = 0;
const xu = (t) => (t <= 1 ? 0 : t <= 3 ? 1 : t <= 5 ? 2 : 3),
  Df = (t) =>
    t
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((e) => e[0])
      .join("")
      .toUpperCase() || "AI";
function wu() {
  for (const m of Ra) (m.parent?.remove(m), m.geometry?.dispose());
  Ra = [];
  const t = xu(s.lvl),
    e = gt(),
    o = [1.5, 1.9, 3, 6.4][t],
    n = (o * 384) / 1024,
    a = bt(),
    i = B("#6b5640", { roughness: 0.9 });
  $l = t;
  let l,
    r,
    c,
    h = 0;
  (t === 0
    ? ((l = 7.25),
      (r = 2.7),
      (c = 0.5),
      a
        .box(i, -o * 0.33, 0.45, -0.05, 0.06, 0.9, 0.05)
        .box(i, o * 0.33, 0.45, -0.05, 0.06, 0.9, 0.05)
        .box(
          B("#2f4a3a", { roughness: 0.85 }),
          0,
          c + n / 2,
          -0.03,
          o + 0.07,
          n + 0.07,
          0.04,
        ))
    : t === 1
      ? ((l = Math.max(e * 0.6, 7.7)),
        (r = 2.6),
        (c = 0.95),
        a
          .box(Qr, -o * 0.42, (c + n) / 2, -0.05, 0.07, c + n, 0.07)
          .box(Qr, o * 0.42, (c + n) / 2, -0.05, 0.07, c + n, 0.07)
          .box(
            B("#1a2234", { roughness: 0.5 }),
            0,
            c + n / 2,
            -0.035,
            o + 0.09,
            n + 0.09,
            0.045,
          )
          .box(Qr, 0, c + n + 0.075, -0.035, o * 0.7, 0.05, 0.06))
      : t === 2
        ? ((l = Math.max(e * 0.55, 9.5)),
          (r = 2.7),
          (c = 0.24),
          (h = 0.112),
          a
            .box(
              B("#8a867e", { roughness: 0.85 }),
              0,
              (c + n + 0.12) / 2,
              -0.1,
              o + 0.5,
              c + n + 0.12,
              0.42,
            )
            .box(
              Rt("#5b636e", { roughness: 0.35 }),
              0,
              c + n + 0.145,
              -0.1,
              o + 0.56,
              0.05,
              0.46,
            ))
        : ((l = Math.max(e * 0.55, 13)),
          (r = 2.62),
          (c = 0.36),
          (h = 0.112),
          a
            .box(
              B("#5f5e5a", { roughness: 0.9 }),
              0,
              0.12,
              -0.14,
              o + 1.3,
              0.24,
              0.7,
            )
            .box(
              Rt("#262b34", { roughness: 0.4 }),
              0,
              (c + n + 0.16) / 2 + 0.1,
              -0.14,
              o + 0.5,
              c + n + 0.16,
              0.5,
            )
            .box(be("#7fe3ff", 1.8), 0, 0.255, 0.215, o + 1.1, 0.025, 0.025)),
    Ra.push(...a.flush(Wn)));
  const d = new f.Mesh(new f.PlaneGeometry(o, n), t === 0 ? bu : yu);
  if ((d.position.set(0, c + n / 2, h), Wn.add(d), Ra.push(d), t === 1)) {
    const m = new f.Mesh(
      new f.BoxGeometry(o * 0.66, 0.018, 0.03),
      be("#fff1d8", 2.6),
    );
    (m.position.set(0, c + n + 0.052, -0.005), Wn.add(m), Ra.push(m));
  }
  (Wn.position.set(l, 0, r),
    (Wn.rotation.y = Lt.yaw * (t < 2 ? 0.75 : 0.45)),
    t >= 1 &&
      Ms.push(
        li(
          l,
          c + n * 0.6,
          r + 1.4,
          t === 1 ? "#fff0d8" : "#bfe9ff",
          o * 1.1,
          0.75,
        ),
      ),
    Ta());
}
function Ta() {
  const t = Ni.getContext("2d"),
    e = 1024,
    o = 384,
    n = $l,
    a = s.lab.toUpperCase(),
    i = "BRAIN V" + (s.gen + 1),
    l = yt[s.gen].cls.toUpperCase();
  if (
    (t.clearRect(0, 0, e, o),
    (t.textAlign = "center"),
    (t.textBaseline = "alphabetic"),
    (t.letterSpacing = "0px"),
    n === 0)
  ) {
    ((t.fillStyle = "#2f4a3a"), t.fillRect(0, 0, e, o));
    for (let r = 1; r < 9; r++)
      ((t.fillStyle = `rgba(0,0,0,${0.07 + (r % 3) * 0.03})`),
        t.fillRect(0, r * 43, e, 3));
    (t.save(),
      t.translate(e / 2, 176),
      t.rotate(-0.014),
      (t.fillStyle = "#f1e7cf"),
      (t.font = "800 112px Outfit, sans-serif"),
      (t.letterSpacing = "3px"),
      t.fillText(a, 0, 0, e - 80),
      t.restore(),
      (t.fillStyle = "#e3d3ad"),
      (t.font = "600 50px DM Mono, monospace"),
      (t.letterSpacing = "2px"),
      t.fillText(
        `EST. 2026 \xB7 ${s.built.toLocaleString("en-US")} BUILT`,
        e / 2,
        300,
        e - 80,
      ));
  } else
    n === 1
      ? ((t.fillStyle = "#1a2234"),
        t.fillRect(0, 0, e, o),
        (t.fillStyle = "#7fe3ff"),
        t.fillRect(80, 224, e - 160, 6),
        (t.fillStyle = "#f4f6fb"),
        (t.font = "800 112px Outfit, sans-serif"),
        (t.letterSpacing = "2px"),
        t.fillText(a, e / 2, 184, e - 110),
        (t.fillStyle = "#a9b8d3"),
        (t.font = "500 38px DM Mono, monospace"),
        (t.letterSpacing = "1px"),
        t.fillText(`${i} \xB7 ${l}`, e / 2, 300, e - 110))
      : n === 2
        ? ((t.fillStyle = "#14181f"),
          t.fillRect(0, 0, e, o),
          (t.shadowColor = "#bfe9ff"),
          (t.shadowBlur = 28),
          (t.fillStyle = "#ffffff"),
          (t.font = "700 118px Outfit, sans-serif"),
          (t.letterSpacing = "4px"),
          t.fillText(a, e / 2, 196, e - 100),
          (t.shadowBlur = 0),
          (t.fillStyle = "#ffb454"),
          (t.font = "500 38px DM Mono, monospace"),
          (t.letterSpacing = "1px"),
          t.fillText(
            `${G(Pt())} A YEAR \xB7 ${i} \xB7 ${l}`,
            e / 2,
            304,
            e - 100,
          ))
        : ((t.fillStyle = "#0b0f18"),
          t.fillRect(0, 0, e, o),
          (t.fillStyle = "#7fe3ff"),
          gs(t, 54, 58, 176, 176, 30),
          t.fill(),
          (t.fillStyle = "#06222e"),
          (t.font = "800 80px Outfit, sans-serif"),
          t.fillText(Df(s.lab), 142, 174, 150),
          (t.textAlign = "left"),
          (t.fillStyle = "#ffffff"),
          (t.font = "700 96px Outfit, sans-serif"),
          (t.letterSpacing = "2px"),
          t.fillText(a, 268, 158, e - 300),
          (t.fillStyle = "#8fa0bd"),
          (t.font = "600 32px Outfit, sans-serif"),
          (t.letterSpacing = "8px"),
          t.fillText("ROBOTICS", 270, 214),
          (t.fillStyle = "#ffb454"),
          (t.font = "500 38px DM Mono, monospace"),
          (t.letterSpacing = "1px"),
          t.fillText(
            `${G(Pt())} ROBOTS A YEAR \xB7 ${G(s.built)} BUILT \xB7 ${i}`,
            58,
            322,
            e - 110,
          ));
  (($a.needsUpdate = !0), (_f = z));
}
function vu() {
  (pu(), mu(), [0, 1, 2].forEach(zi), Ul(), wu());
}
const Rl = { value: 0 },
  Pf = { value: 1 },
  Ff = { value: 0 },
  Of =
    "attribute vec4 aSt;varying vec4 vSt;varying vec3 vLoc;uniform float uTime;",
  ku = `#include <begin_vertex>
vSt=aSt;vLoc=position;{float age=uTime-aSt.w;float k=clamp(age/.42,0.,1.);float s=age<0.?1.:1.+(sin(k*3.14159*1.15)*.28)*(1.-k)-(1.-k)*(1.-k)*.55;transformed*=max(s,.02);}`,
  Tl = new Map();
function Ts(t, e, o = {}) {
  const n = "inst-" + e + (o.key || "");
  if (Tl.has(n)) return (t.dispose(), Tl.get(n));
  const a = t,
    i = Object.assign(
      (l) => {
        (Object.assign(l.uniforms, {
          uTime: Rl,
          uAct: Pf,
          uBrown: Ff,
          uLed: { value: new f.Color(o.led || "#7fe3ff") },
        }),
          (l.vertexShader = l.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` + Of,
            )
            .replace("#include <begin_vertex>", ku)),
          (l.fragmentShader = l.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec4 vSt;varying vec3 vLoc;uniform float uTime;uniform float uAct;uniform float uBrown;uniform vec3 uLed;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
   {float jam=step(1.5,vSt.x),heat=vSt.x*(1.-jam),seed=vSt.y,sel=vSt.z>1.5?0.:vSt.z;float fl=1.-uBrown*(.5+.5*step(.5,fract(uTime*7.3+seed)));float strobe=step(.5,fract(uTime*2.2+seed));
   if(vSt.z>1.5){float cut=(vSt.z-2.)*1.85;if(vLoc.y>cut)discard;totalEmissiveRadiance+=vec3(.35,.95,1.5)*smoothstep(cut-.05,cut,vLoc.y)*2.6;}
   ${
     e === "led"
       ? `vec3 id=floor(vLoc*vec3(28.,46.,28.));float h=fract(sin(dot(id+seed*3.1,vec3(12.9898,78.233,37.719)))*43758.5453);
    float blink=step(.3,fract(h*7.1+uTime*(.4+uAct*2.6)*(.55+h)));vec3 lc=mix(uLed,vec3(1.8,.55,.12),smoothstep(.15,.6,heat));lc=mix(lc,vec3(2.2,.18,.1),smoothstep(.6,.95,heat));
    lc=mix(lc,vec3(2.6,.16,.1)*strobe,jam);totalEmissiveRadiance+=lc*mix((.35+.65*blink)*(.35+.65*uAct),1.,jam)*2.2*fl;`
       : ""
   }
   ${e === "rgb" ? "vec3 hc=.5+.5*cos(6.2832*(fract(uTime*.12+vLoc.y*.9+seed)+vec3(0.,.33,.67)));totalEmissiveRadiance+=mix(hc*1.6*fl*(1.-heat*.5)+vec3(1.6,.3,.08)*heat,vec3(2.2,.2,.12)*strobe,jam);" : ""}
   ${e === "body" ? "totalEmissiveRadiance+=vec3(1.5,.32,.07)*heat*heat*(.55+.45*sin(uTime*5.+seed*6.))*smoothstep(.0,.25,vLoc.y)*.55;" : ""}
   ${e === "glow" ? "totalEmissiveRadiance+=mix(uLed*(.6+.4*uAct),vec3(1.9,.22,.12)*(.25+.75*strobe),jam)*1.8*fl;" : ""}
   totalEmissiveRadiance+=vec3(.25,.75,1.)*sel*.35;}`,
            )));
      },
      { key: n },
    );
  return (Tl.set(n, a), _o(a, i));
}
const De = (t, e = {}) =>
    Ts(
      new f.MeshStandardMaterial({
        color: t,
        roughness: 0.5,
        metalness: 0.35,
        envMapIntensity: 0.6,
        ...e,
      }),
      "body",
      { key: t + JSON.stringify(e) },
    ),
  Go = (t, e = {}) =>
    Ts(
      new f.MeshPhysicalMaterial({
        color: t,
        roughness: 0.35,
        metalness: 0.55,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        envMapIntensity: 0.9,
        ...e,
      }),
      "body",
      { key: "p" + t + JSON.stringify(e) },
    ),
  So = (t, e = "") =>
    Ts(
      new f.MeshStandardMaterial({
        color: "#05070a",
        roughness: 0.4,
        emissive: "#000000",
      }),
      "led",
      { led: t, key: "L" + t + e },
    ),
  $o = (t) =>
    Ts(
      new f.MeshStandardMaterial({
        color: "#05070a",
        roughness: 0.4,
        emissive: "#000000",
      }),
      "glow",
      { led: t, key: "G" + t },
    ),
  Vp = Ts(
    new f.MeshStandardMaterial({
      color: "#05070a",
      roughness: 0.3,
      emissive: "#000000",
    }),
    "rgb",
    { key: "rgb" },
  ),
  Se = De("#1a1d23", { roughness: 0.45 }),
  Pe = Go("#3b414b", { roughness: 0.38 }),
  qp = Go("#121418", { roughness: 0.42 }),
  Fe = Go("#aeb5bf", { roughness: 0.3, metalness: 0.9 }),
  Wp = De("#c7ccd3", { roughness: 0.35, metalness: 0.8 }),
  Hp = Go("#b98a45", { roughness: 0.3, metalness: 1 }),
  Aa = De("#d4d8dd", { roughness: 0.55, metalness: 0.2 }),
  zf = Go("#2f7fc1", { roughness: 0.3, metalness: 0.3 }),
  Mu = Go("#d9733a", { roughness: 0.3, metalness: 0.3 }),
  Su = De("#8d8b86", { roughness: 0.85, metalness: 0 }),
  Al = Ts(
    new f.MeshPhysicalMaterial({
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
  Gf = De("#a8865c", { roughness: 0.7, metalness: 0 }),
  Ui = Go("#c46a3a", { roughness: 0.28, metalness: 1 }),
  Ca = Go("#e0b04a", { roughness: 0.4, metalness: 0.2 }),
  Vi = De("#16181c", { roughness: 0.8, metalness: 0 }),
  Cl = {
    bench(t) {
      t.box(Gf, 0, 0.48, -0.08, 0.98, 0.04, 0.44);
      for (const e of [-0.44, 0.44])
        for (const o of [-0.27, 0.11])
          t.box(Pe, e, 0.24, o, 0.035, 0.46, 0.035);
      t.box(Pe, 0, 0.11, -0.08, 0.92, 0.022, 0.38);
      for (let e = 0; e < 4; e++)
        t.box(
          e % 2 ? zf : Mu,
          -0.33 + e * 0.22,
          0.16,
          -0.08,
          0.17,
          0.075,
          0.22,
          { r: 0.012 },
        );
      (t
        .box(Se, 0.38, 0.51, -0.27, 0.08, 0.02, 0.08)
        .box(Se, 0.38, 0.66, -0.27, 0.02, 0.3, 0.02)
        .box(Se, 0.31, 0.8, -0.25, 0.17, 0.02, 0.02, { rz: -0.32 })
        .geo(
          $o("#ffd9a0"),
          new f.ConeGeometry(0.045, 0.06, 10),
          0.23,
          0.775,
          -0.23,
        ),
        t.box(Fe, 0, 0.57, -0.31, 0.92, 0.012, 0.012));
      for (let e = 0; e < 5; e++)
        t.box(
          e % 2 ? Se : Fe,
          -0.3 + e * 0.13,
          0.535,
          -0.315,
          0.012,
          0.06,
          0.012,
        );
      t.geo(
        So("#7fe3ff", "bench"),
        new f.BoxGeometry(0.1, 0.012, 0.006),
        -0.38,
        0.47,
        0.15,
      );
    },
    cell(t) {
      t.box(Se, 0, 0.015, -0.05, 0.9, 0.03, 0.66);
      for (const e of [-0.43, 0.43])
        (t.box(Fe, e, 0.72, -0.05, 0.045, 1.44, 0.045),
          t.box(Pe, e, 0.03, -0.05, 0.1, 0.06, 0.3));
      (t
        .box(Fe, 0, 1.44, -0.05, 0.9, 0.05, 0.05)
        .box(Ca, 0, 1.36, -0.13, 0.07, 0.1, 0.07)
        .box(Pe, 0, 1.25, -0.13, 0.02, 0.14, 0.02),
        t.box(Pe, 0.38, 0.36, -0.36, 0.14, 0.72, 0.12));
      for (let e = 0; e < 3; e++)
        t.box(e % 2 ? Aa : zf, 0.38, 0.2 + e * 0.2, -0.29, 0.12, 0.12, 0.03);
      (t
        .box(Se, -0.43, 1, 0.07, 0.03, 0.2, 0.28)
        .geo(
          $o("#7fe3ff"),
          new f.PlaneGeometry(0.24, 0.16).rotateY(-Math.PI / 2),
          -0.448,
          1,
          0.07,
        ),
        t.geo(
          So("#7fe3ff", "cell"),
          new f.BoxGeometry(0.8, 0.012, 0.012),
          0,
          1.41,
          -0.02,
        ));
    },
    line(t) {
      (t.box(Pe, 0, 0.05, -0.02, 0.94, 0.1, 0.52, { r: 0.02 }),
        t.box(Vi, 0, 0.102, -0.02, 0.9, 0.006, 0.46));
      for (let e = 0; e < 9; e++)
        t.box(Fe, -0.4 + e * 0.1, 0.106, 0.23, 0.04, 0.006, 0.006);
      for (const e of [-0.45, 0.45])
        t.box(Fe, e, 0.72, -0.02, 0.045, 1.44, 0.045);
      t.box(Fe, 0, 1.44, -0.02, 0.95, 0.05, 0.06);
      for (const e of [-0.22, 0.22])
        t.box(Ca, e, 1.37, -0.1, 0.06, 0.09, 0.06).box(
          Pe,
          e,
          1.27,
          -0.1,
          0.018,
          0.12,
          0.018,
        );
      for (const e of [-0.46, 0.46])
        t.geo(
          So("#7ff0b8", "line"),
          new f.BoxGeometry(0.012, 0.9, 0.012),
          e,
          0.6,
          0.24,
        );
      t.geo(
        So("#7ff0b8", "line2"),
        new f.BoxGeometry(0.85, 0.012, 0.012),
        0,
        1.41,
        0.02,
      );
    },
    giga(t) {
      (t.cyl(Pe, 0, 0.05, -0.03, 0.44, 0.46, 0.1, { seg: 32 }),
        t.cyl(Vi, 0, 0.104, -0.03, 0.4, 0.4, 0.006, { seg: 32 }),
        t.geo(
          $o("#7fe3ff"),
          new f.TorusGeometry(0.42, 0.008, 6, 48).rotateX(Math.PI / 2),
          0,
          0.105,
          -0.03,
        ));
      for (const e of [-0.46, 0.46])
        t.box(
          Go("#3b414b", { roughness: 0.35 }),
          e,
          0.78,
          -0.03,
          0.07,
          1.56,
          0.1,
        );
      t.box(Go("#3b414b", { roughness: 0.35 }), 0, 1.56, -0.03, 1, 0.09, 0.12);
      for (const e of [-0.2, 0.2])
        t.box(Ca, e, 1.47, -0.11, 0.07, 0.1, 0.07).box(
          Pe,
          e,
          1.36,
          -0.11,
          0.02,
          0.14,
          0.02,
        );
      for (let e = 0; e < 3; e++)
        t.box(Aa, 0.36, 0.08 + e * 0.06, -0.4, 0.16, 0.05, 0.1);
      (t.cyl(Se, -0.4, 0.42, -0.4, 0.03, 0.03, 0.84, { seg: 8 }),
        t
          .geo(
            So("#7fe3ff", "giga"),
            new f.BoxGeometry(0.03, 0.3, 0.03),
            -0.4,
            0.7,
            -0.4,
          )
          .geo(
            So("#ffb454", "giga2"),
            new f.BoxGeometry(0.9, 0.012, 0.012),
            0,
            1.52,
            0.04,
          ));
    },
    auto(t) {
      (t.box(Se, 0, 0.02, 0, 0.94, 0.04, 0.9),
        t
          .box(Al, 0, 0.8, -0.45, 0.92, 1.52, 0.012)
          .box(Al, -0.46, 0.8, 0, 0.012, 1.52, 0.9)
          .box(Al, 0.46, 0.8, 0, 0.012, 1.52, 0.9));
      for (const e of [-0.46, 0.46])
        for (const o of [-0.45, 0.45])
          t.geo(
            $o("#b9a2ff"),
            new f.BoxGeometry(0.022, 1.56, 0.022),
            e,
            0.8,
            o,
          );
      (t
        .geo(
          $o("#b9a2ff"),
          new f.BoxGeometry(0.94, 0.022, 0.022),
          0,
          1.58,
          -0.45,
        )
        .geo(
          $o("#b9a2ff"),
          new f.BoxGeometry(0.94, 0.022, 0.022),
          0,
          1.58,
          0.45,
        )
        .geo(
          $o("#b9a2ff"),
          new f.BoxGeometry(0.022, 0.022, 0.9),
          -0.46,
          1.58,
          0,
        )
        .geo(
          $o("#b9a2ff"),
          new f.BoxGeometry(0.022, 0.022, 0.9),
          0.46,
          1.58,
          0,
        ),
        t
          .box(Fe, 0, 1.5, 0, 0.9, 0.03, 0.04)
          .geo(
            So("#e6dcff", "auto"),
            new f.BoxGeometry(0.8, 0.012, 0.012),
            0,
            0.05,
            0.44,
          ));
    },
    wind(t) {
      t.box(Gf, 0, 0.42, 0, 0.7, 0.035, 0.4);
      for (const e of [-0.31, 0.31])
        for (const o of [-0.16, 0.16]) t.box(Pe, e, 0.21, o, 0.03, 0.42, 0.03);
      (t
        .box(Se, -0.18, 0.5, 0, 0.16, 0.13, 0.18, { r: 0.015 })
        .box(Pe, -0.03, 0.5, 0, 0.1, 0.04, 0.04),
        t
          .cyl(Ui, 0.12, 0.5, -0.08, 0.07, 0.07, 0.06, {
            seg: 18,
            rx: Math.PI / 2,
          })
          .cyl(Fe, 0.12, 0.5, -0.08, 0.03, 0.03, 0.08, {
            seg: 10,
            rx: Math.PI / 2,
          }));
      for (let e = 0; e < 6; e++)
        t.cyl(
          e % 2 ? Ui : Fe,
          0.18 + (e % 3) * 0.07,
          0.47,
          0.08 + Math.floor(e / 3) * 0.07,
          0.028,
          0.028,
          0.06,
          { seg: 10 },
        );
      t.box(Se, 0, 0.1, 0, 0.6, 0.02, 0.34).box(
        De("#8f6d48", { roughness: 0.85, metalness: 0 }),
        0.1,
        0.15,
        0,
        0.24,
        0.1,
        0.22,
      );
    },
    act(t) {
      (t.box(Aa, 0, 0.48, 0, 0.78, 0.96, 0.62, { r: 0.025 }),
        t.box(Se, 0, 0.62, 0.312, 0.5, 0.34, 0.01),
        t.geo($o("#7fe3ff"), new f.PlaneGeometry(0.46, 0.3), 0, 0.62, 0.318),
        t
          .box(Se, 0, 0.98, 0, 0.6, 0.04, 0.5)
          .cyl(De("#9aa0a8"), 0.22, 1.03, -0.1, 0.07, 0.07, 0.06, { seg: 14 }),
        t
          .box(Pe, -0.25, 0.2, 0.312, 0.18, 0.12, 0.01)
          .geo(
            So("#7ff0b8", "act"),
            new f.BoxGeometry(0.14, 0.014, 0.006),
            -0.25,
            0.2,
            0.32,
          )
          .geo(
            So("#ffb454", "act2"),
            new f.BoxGeometry(0.05, 0.014, 0.006),
            0.2,
            0.2,
            0.32,
          ));
    },
    aline(t) {
      (t
        .box(Aa, -0.33, 0.45, 0, 0.28, 0.9, 0.6, { r: 0.02 })
        .box(Aa, 0.33, 0.45, 0, 0.28, 0.9, 0.6, { r: 0.02 }),
        t
          .box(Pe, 0, 0.32, 0, 0.42, 0.06, 0.3)
          .box(Vi, 0, 0.352, 0, 0.42, 0.006, 0.24));
      for (let e = 0; e < 4; e++)
        t.cyl(e % 2 ? Ui : Fe, -0.15 + e * 0.1, 0.4, 0, 0.035, 0.035, 0.09, {
          seg: 12,
          rx: Math.PI / 2,
        });
      for (const e of [-0.2, 0.2]) t.box(Fe, e, 0.75, -0.27, 0.03, 0.8, 0.03);
      t.box(Fe, 0, 1.15, -0.27, 0.44, 0.04, 0.04).box(
        Ca,
        0.05,
        1.08,
        -0.2,
        0.06,
        0.1,
        0.08,
      );
      for (const e of [-0.33, 0.33])
        t.box(Se, e, 0.66, 0.302, 0.18, 0.2, 0.01).geo(
          $o("#7fe3ff"),
          new f.PlaneGeometry(0.15, 0.16),
          e,
          0.66,
          0.308,
        );
      t.geo(
        So("#7ff0b8", "aline"),
        new f.BoxGeometry(0.44, 0.012, 0.006),
        0,
        0.29,
        0.152,
      );
    },
    aplant(t) {
      (t.box(Su, 0, 0.05, 0, 0.96, 0.1, 0.96),
        t.box(
          De("#c9c5bd", { roughness: 0.7, metalness: 0 }),
          0,
          0.62,
          -0.04,
          0.86,
          1.04,
          0.8,
        ),
        t.box(Se, 0, 1.16, -0.04, 0.9, 0.05, 0.84),
        t
          .geo(
            $o("#ffb070"),
            new f.PlaneGeometry(0.32, 0.4),
            -0.18,
            0.42,
            0.362,
          )
          .box(Se, -0.18, 0.42, 0.359, 0.36, 0.44, 0.005));
      for (let e = 0; e < 3; e++)
        t.cyl(De("#9aa0a8"), -0.25 + e * 0.25, 1.24, -0.18, 0.1, 0.11, 0.12, {
          seg: 14,
        });
      (t
        .box(Pe, 0.3, 0.26, 0.42, 0.24, 0.06, 0.14)
        .box(Vi, 0.3, 0.292, 0.42, 0.22, 0.006, 0.1),
        t.cyl(De("#7d848c"), 0.32, 1.5, 0.2, 0.05, 0.06, 0.62, { seg: 10 }),
        t.geo(
          So("#ffb454", "aplant"),
          new f.BoxGeometry(0.6, 0.012, 0.006),
          0.1,
          0.95,
          0.362,
        ));
    },
  },
  jf = {
    wind: {
      geo: () => {
        const t = bt();
        for (let e = 0; e < 4; e++)
          t.box(
            De("#cfd4db", { roughness: 0.4 }),
            0,
            0,
            0,
            0.012,
            0.11,
            0.012,
            { rz: (e * Math.PI) / 4 },
          );
        return (
          t.cyl(Ui, 0, 0, 0, 0.05, 0.05, 0.03, { rx: Math.PI / 2, seg: 12 }),
          t.geos()
        );
      },
      pivot: [0.12, 0.5, -0.12],
      axis: [0, 0, 1],
      speed: 9,
    },
    act: {
      geo: () => {
        const t = bt();
        for (let e = 0; e < 3; e++)
          t.box(De("#cfd4db", { roughness: 0.4 }), 0, 0, 0, 0.02, 0.012, 0.13, {
            ry: (e * Math.PI) / 3,
          });
        return t.geos();
      },
      pivot: [0.22, 1.07, -0.1],
      axis: [0, 1, 0],
      speed: 6,
    },
    aplant: {
      geo: () => {
        const t = bt();
        for (let e = 0; e < 4; e++)
          t.box(De("#6c737c"), 0, 0, 0, 0.035, 0.008, 0.18, {
            ry: (e * Math.PI) / 4,
          });
        return t.geos();
      },
      pivot: [0, 1.31, -0.18],
      axis: [0, 1, 0],
      speed: 4,
    },
  },
  jo = {},
  La = Bt;
function Ll(t, e, o) {
  const n = t.map((c) => c[1]),
    a = t.map((c) => c[0]),
    i = ls(n, !0),
    l = new f.InstancedBufferAttribute(new Float32Array(e * 4), 4);
  (l.setUsage(f.DynamicDrawUsage), i.setAttribute("aSt", l));
  const r = new f.InstancedMesh(i, a, e);
  return (
    (r.count = 0),
    (r.castShadow = r.receiveShadow = !0),
    (r.frustumCulled = !1),
    (r.userData.st = l),
    r
  );
}
const $u = (t, e, o) => {
  const n = new f.MeshStandardMaterial({
      color: "#cfd4db",
      roughness: 0.4,
      metalness: 0.5,
      envMapIntensity: 0.7,
    }),
    a = `normalize(vec3(${t.join(",")}))`,
    i = `(uTime*${o.toFixed(2)}*(.8+.4*fract(aSt.y*7.))+aSt.y*6.)`;
  return _o(
    n,
    Object.assign(
      (l) => {
        (Object.assign(l.uniforms, { uTime: Rl }),
          (l.vertexShader = l.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` +
                Of +
                `
  vec3 rotA(vec3 p,vec3 a,float t){return p*cos(t)+cross(a,p)*sin(t)+a*dot(a,p)*(1.-cos(t));}`,
            )
            .replace(
              "#include <beginnormal_vertex>",
              `#include <beginnormal_vertex>
  objectNormal=rotA(objectNormal,${a},${i});`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
  {transformed=rotA(transformed,${a},${i})+vec3(${e.join(",")});
   float age=uTime-aSt.w;float k=clamp(age/.42,0.,1.);transformed*=age<0.?1.:max(.02,1.+(sin(k*3.14159*1.15)*.28)*(1.-k)-(1.-k)*(1.-k)*.55);}`,
            )));
      },
      { key: "spin" + t.join() + o },
    ),
  );
};
for (const t of Q) {
  if (!t) continue;
  const e = bt();
  Cl[t.id](e);
  const o = e.geos(),
    n = Ll(o, La);
  if ((co.add(n), (jo[t.id] = { mesh: n, list: [] }), jf[t.id])) {
    const a = jf[t.id],
      i = ls(a.geo().map((c) => c[1])),
      l = new f.InstancedBufferAttribute(new Float32Array(La * 4), 4);
    (l.setUsage(f.DynamicDrawUsage), i.setAttribute("aSt", l));
    const r = new f.InstancedMesh(i, $u(a.axis, a.pivot, a.speed), La);
    ((r.count = 0),
      (r.castShadow = !1),
      oo.push(r),
      (r.frustumCulled = !1),
      (r.userData.st = l),
      co.add(r),
      (jo[t.id].spin = r));
  }
}
const kn = new Float32Array(Bt).fill(-99),
  ie = new Uint8Array(Bt),
  Nf = new Float32Array(Bt).fill(-99);
let As = !0;
function Ru() {
  ie.fill(0);
  for (const t of s.sites) ie[t.k] = t.ix;
  As = !0;
}
let Ke = !0,
  No = -1,
  fo = -1;
const J = new f.Vector3(),
  Uf = new f.Vector3(1, 1, 1);
function Vf(t, e, o) {
  let n = 0,
    a = 0;
  const i = o.range;
  for (let l = -i; l <= i; l++)
    for (let r = -i; r <= i; r++) {
      const c = t + r,
        h = e + l;
      if (c < 0 || h < 0 || c >= gt() || h >= vt()) continue;
      Q[s.cells[_t(c, h)]]?.kind === "station" && ((n += r), (a += l));
    }
  return !n && !a
    ? 0
    : Math.abs(n) > Math.abs(a)
      ? n > 0
        ? Math.PI / 2
        : -Math.PI / 2
      : a > 0
        ? Math.PI
        : 0;
}
function Ro() {
  Ke = !1;
  for (const o in jo) jo[o].list.length = 0;
  const t = gt(),
    e = vt();
  for (let o = 0; o < e; o++)
    for (let n = 0; n < t; n++) {
      const a = _t(n, o),
        i = Q[s.cells[a]];
      i && jo[i.id].list.push(a);
    }
  for (const o in jo) {
    const n = jo[o],
      a = At[o],
      i = n.mesh,
      l = i.userData.st;
    ((i.count = n.list.length),
      n.spin && (n.spin.count = n.list.length),
      n.list.forEach((r, c) => {
        const h = r % j,
          d = Math.floor(r / j),
          m = a.kind === "parts" ? Vf(h, d, a) : 0;
        (yn.setFromAxisAngle(ps, m),
          Do.compose(J.set(h + 0.5, kt, -(d + 0.5)), yn, Uf),
          i.setMatrixAt(c, Do));
        const u = a.kind === "station" ? (pe[r] ? 2 : 1 - io[r]) : 0;
        (l.setXYZW(
          c,
          u,
          Kt(r * 0.37 + 1),
          r === No ? 1 : r === fo ? 0.45 : 0,
          kn[r],
        ),
          n.spin &&
            (n.spin.setMatrixAt(c, Do),
            n.spin.userData.st.setXYZW(c, 0, Kt(r * 0.37 + 1), 0, kn[r])));
      }),
      (i.instanceMatrix.needsUpdate = !0),
      (l.needsUpdate = !0),
      n.spin &&
        ((n.spin.instanceMatrix.needsUpdate = !0),
        (n.spin.userData.st.needsUpdate = !0)));
  }
}
const Tu = new f.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2),
  $e = new f.InstancedMesh(
    Tu,
    new f.MeshBasicMaterial({
      color: "#ffffff",
      transparent: !0,
      opacity: 0.55,
      depthWrite: !1,
      fog: !1,
      blending: f.AdditiveBlending,
    }),
    Bt,
  );
(($e.count = 0),
  ($e.frustumCulled = !1),
  ($e.renderOrder = 2),
  ($e.instanceColor = new f.InstancedBufferAttribute(
    new Float32Array(Bt * 3),
    3,
  )),
  co.add($e),
  oo.push($e),
  eo.push($e));
let Cs = 0;
function Au() {
  Cs = 0;
}
function Ea(t, e, o, n = 1) {
  Cs >= Bt ||
    (Do.makeTranslation(t + 0.5, kt + 0.012, -(e + 0.5)),
    $e.setMatrixAt(Cs, Do),
    $e.instanceColor.setXYZ(Cs, o.r * n, o.g * n, o.b * n),
    Cs++);
}
function Cu() {
  (($e.count = Cs),
    ($e.instanceMatrix.needsUpdate = !0),
    ($e.instanceColor.needsUpdate = !0));
}
const Hn = {},
  qi = new f.MeshBasicMaterial({
    color: "#7fe3ff",
    transparent: !0,
    opacity: 0.35,
    depthWrite: !1,
    fog: !1,
  });
function Lu(t) {
  if (Hn[t]) return Hn[t];
  const e = bt();
  Cl[t](e);
  const o = ls(e.geos().map((a) => a[1])),
    n = new f.Mesh(o, qi);
  return (
    (n.visible = !1),
    (n.renderOrder = 3),
    co.add(n),
    oo.push(n),
    eo.push(n),
    (Hn[t] = n),
    n
  );
}
const El = (() => {
    const t = (g, b, y) => {
      const w = Math.max(y - Math.abs(g - b), 0) / y;
      return Math.min(g, b) - w * w * y * 0.25;
    };
    function e(g, b, y) {
      const w = Math.cos(g),
        x = Math.sin(g),
        M = Math.cos(b),
        T = Math.sin(b),
        k = Math.cos(y),
        S = Math.sin(y),
        C = [
          [M, T * x, T * w],
          [0, w, -x],
          [-T, M * x, M * w],
        ],
        R = C.map(($) => [$[0] * k + $[1] * S, -$[0] * S + $[1] * k, $[2]]);
      return [
        R[0][0],
        R[1][0],
        R[2][0],
        R[0][1],
        R[1][1],
        R[2][1],
        R[0][2],
        R[1][2],
        R[2][2],
      ];
    }
    function o(g, b) {
      const y = {
        t: g,
        col: b.col ?? 0,
        m: !!b.m,
        paint: !!b.paint,
        sub: !!b.sub,
        k: b.k,
        R: b.rot ? e(b.rot[0], b.rot[1], b.rot[2]) : null,
      };
      if (g === 0)
        ((y.c = b.c),
          (y.r = b.r),
          (y.ir = b.r.map((w) => 1 / w)),
          (y.rmin = Math.min(...b.r)),
          (y.bs = [...b.c, Math.max(...b.r)]));
      else if (g === 1) {
        const w = b.a,
          x = b.b;
        ((y.a = w),
          (y.r1 = b.r1),
          (y.r2 = b.r2),
          (y.ba = [x[0] - w[0], x[1] - w[1], x[2] - w[2]]),
          (y.l2 = y.ba[0] ** 2 + y.ba[1] ** 2 + y.ba[2] ** 2),
          (y.rr = b.r1 - b.r2),
          (y.a2 = y.l2 - y.rr * y.rr),
          (y.il2 = 1 / y.l2),
          (y.bs = [
            (w[0] + x[0]) / 2,
            (w[1] + x[1]) / 2,
            (w[2] + x[2]) / 2,
            Math.sqrt(y.l2) / 2 + Math.max(b.r1, b.r2),
          ]));
      } else
        ((y.c = b.c),
          (y.h = b.h),
          (y.rad = b.rad || 0),
          (y.bs = [...b.c, Math.hypot(...b.h)]));
      return y;
    }
    function n(g, b, y, w) {
      if (g.t === 1) {
        const k = b - g.a[0],
          S = y - g.a[1],
          C = w - g.a[2],
          R = g.ba[0],
          $ = g.ba[1],
          L = g.ba[2],
          _ = g.l2,
          I = k * R + S * $ + C * L,
          P = I - _,
          lt = k * _ - R * I,
          wt = S * _ - $ * I,
          it = C * _ - L * I,
          Ft = lt * lt + wt * wt + it * it,
          U = I * I * _,
          V = P * P * _,
          Z = Math.sign(g.rr) * g.rr * g.rr * Ft;
        return Math.sign(P) * g.a2 * V > Z
          ? Math.sqrt(Ft + V) * g.il2 - g.r2
          : Math.sign(I) * g.a2 * U < Z
            ? Math.sqrt(Ft + U) * g.il2 - g.r1
            : (Math.sqrt(Ft * g.a2 * g.il2) + I * g.rr) * g.il2 - g.r1;
      }
      if (((b -= g.c[0]), (y -= g.c[1]), (w -= g.c[2]), g.R)) {
        const k = g.R,
          S = k[0] * b + k[1] * y + k[2] * w,
          C = k[3] * b + k[4] * y + k[5] * w,
          R = k[6] * b + k[7] * y + k[8] * w;
        ((b = S), (y = C), (w = R));
      }
      if (g.t === 0) {
        const k = b * g.ir[0],
          S = y * g.ir[1],
          C = w * g.ir[2],
          R = Math.sqrt(k * k + S * S + C * C),
          $ = k * g.ir[0],
          L = S * g.ir[1],
          _ = C * g.ir[2],
          I = Math.sqrt($ * $ + L * L + _ * _);
        return I < 1e-9 ? -g.rmin : (R * (R - 1)) / I;
      }
      const x = Math.abs(b) - g.h[0] + g.rad,
        M = Math.abs(y) - g.h[1] + g.rad,
        T = Math.abs(w) - g.h[2] + g.rad;
      return (
        Math.hypot(Math.max(x, 0), Math.max(M, 0), Math.max(T, 0)) +
        Math.min(Math.max(x, M, T), 0) -
        g.rad
      );
    }
    function a(g, b) {
      const y = g.filter((x) => !x.paint),
        w = y.length;
      return (x, M, T) => {
        let k = 1e9;
        for (let S = 0; S < w; S++) {
          const C = y[S],
            R = C.m ? Math.abs(x) : x;
          if (C.sub) {
            const _ = n(C, R, M, T),
              I = C.k || 0;
            k = I > 0 ? -t(-k, _, I) : Math.max(k, -_);
            continue;
          }
          const $ = C.k ?? b;
          if (k < 1e8) {
            const _ = R - C.bs[0],
              I = M - C.bs[1],
              P = T - C.bs[2];
            if (Math.sqrt(_ * _ + I * I + P * P) - C.bs[3] >= k + $) continue;
          }
          const L = n(C, R, M, T);
          k = k >= 1e8 ? L : $ > 0 ? t(k, L, $) : Math.min(k, L);
        }
        return k;
      };
    }
    function i(g) {
      const b = [1e9, 1e9, 1e9],
        y = [-1e9, -1e9, -1e9];
      for (const w of g) {
        if (w.paint || w.sub) continue;
        const [x, M, T, k] = w.bs,
          S = w.m ? [Math.abs(x), -Math.abs(x)] : [x];
        for (const C of S)
          ((b[0] = Math.min(b[0], C - k)), (y[0] = Math.max(y[0], C + k)));
        ((b[1] = Math.min(b[1], M - k)),
          (y[1] = Math.max(y[1], M + k)),
          (b[2] = Math.min(b[2], T - k)),
          (y[2] = Math.max(y[2], T + k)));
      }
      return [b, y];
    }
    const l = [0, 2, 4, 6, 0, 1, 4, 5, 0, 1, 2, 3],
      r = [1, 3, 5, 7, 2, 3, 6, 7, 4, 5, 6, 7];
    function c(g, b, y, w) {
      const x = b[0] - w * 1.5,
        M = b[1] - w * 1.5,
        T = b[2] - w * 1.5,
        k = Math.ceil((y[0] - b[0]) / w) + 4,
        S = Math.ceil((y[1] - b[1]) / w) + 4,
        C = Math.ceil((y[2] - b[2]) / w) + 4,
        R = new Float32Array(k * S * C);
      for (let U = 0, V = 0; U < C; U++)
        for (let Z = 0; Z < S; Z++)
          for (let mt = 0; mt < k; mt++, V++)
            R[V] = g(x + mt * w, M + Z * w, T + U * w);
      const $ = k - 1,
        L = S - 1,
        _ = C - 1,
        I = new Int32Array($ * L * _).fill(-1),
        P = [],
        lt = new Float32Array(8);
      for (let U = 0; U < _; U++)
        for (let V = 0; V < L; V++)
          for (let Z = 0; Z < $; Z++) {
            let mt = 0;
            for (let et = 0; et < 8; et++) {
              const W =
                R[
                  Z +
                    (et & 1) +
                    k * (V + ((et >> 1) & 1) + S * (U + ((et >> 2) & 1)))
                ];
              ((lt[et] = W), W < 0 && (mt |= 1 << et));
            }
            if (mt === 0 || mt === 255) continue;
            let gn = 0,
              Y = 0,
              N = 0,
              q = 0;
            for (let et = 0; et < 12; et++) {
              const W = l[et],
                nt = r[et],
                ot = lt[W],
                St = lt[nt];
              if (ot < 0 == St < 0) continue;
              const ct = ot / (ot - St);
              ((gn += (W & 1) + ((nt & 1) - (W & 1)) * ct),
                (Y += ((W >> 1) & 1) + (((nt >> 1) & 1) - ((W >> 1) & 1)) * ct),
                (N += ((W >> 2) & 1) + (((nt >> 2) & 1) - ((W >> 2) & 1)) * ct),
                q++);
            }
            ((I[Z + $ * (V + L * U)] = P.length / 3),
              P.push(
                x + (Z + gn / q) * w,
                M + (V + Y / q) * w,
                T + (U + N / q) * w,
              ));
          }
      const wt = [],
        it = (U, V, Z) =>
          U < 0 || V < 0 || Z < 0 || U >= $ || V >= L || Z >= _
            ? -1
            : I[U + $ * (V + L * Z)],
        Ft = (U, V, Z, mt, gn, Y) => {
          if (U < 0 || V < 0 || Z < 0 || mt < 0) return;
          const N = P[3 * Z] - P[3 * U],
            q = P[3 * Z + 1] - P[3 * U + 1],
            et = P[3 * Z + 2] - P[3 * U + 2],
            W = P[3 * mt] - P[3 * V],
            nt = P[3 * mt + 1] - P[3 * V + 1],
            ot = P[3 * mt + 2] - P[3 * V + 2];
          if (
            (gn === 0
              ? q * ot - et * nt
              : gn === 1
                ? et * W - N * ot
                : N * nt - q * W) >
              0 !=
            Y > 0
          ) {
            const me = V;
            ((V = mt), (mt = me));
          }
          const ct =
              (P[3 * U] - P[3 * Z]) ** 2 +
              (P[3 * U + 1] - P[3 * Z + 1]) ** 2 +
              (P[3 * U + 2] - P[3 * Z + 2]) ** 2,
            ft =
              (P[3 * V] - P[3 * mt]) ** 2 +
              (P[3 * V + 1] - P[3 * mt + 1]) ** 2 +
              (P[3 * V + 2] - P[3 * mt + 2]) ** 2;
          ct < ft ? wt.push(U, V, Z, U, Z, mt) : wt.push(U, V, mt, V, Z, mt);
        };
      for (let U = 0; U < C; U++)
        for (let V = 0; V < S; V++)
          for (let Z = 0; Z < k; Z++) {
            const mt = R[Z + k * (V + S * U)] < 0;
            (Z + 1 < k &&
              mt !== R[Z + 1 + k * (V + S * U)] < 0 &&
              Ft(
                it(Z, V - 1, U - 1),
                it(Z, V, U - 1),
                it(Z, V, U),
                it(Z, V - 1, U),
                0,
                mt ? 1 : -1,
              ),
              V + 1 < S &&
                mt !== R[Z + k * (V + 1 + S * U)] < 0 &&
                Ft(
                  it(Z - 1, V, U - 1),
                  it(Z, V, U - 1),
                  it(Z, V, U),
                  it(Z - 1, V, U),
                  1,
                  mt ? 1 : -1,
                ),
              U + 1 < C &&
                mt !== R[Z + k * (V + S * (U + 1))] < 0 &&
                Ft(
                  it(Z - 1, V - 1, U),
                  it(Z, V - 1, U),
                  it(Z, V, U),
                  it(Z - 1, V, U),
                  2,
                  mt ? 1 : -1,
                ));
          }
      return { pos: P, idx: wt };
    }
    function h(g, b, y) {
      const w = y * 0.1,
        x = y * 0.8;
      for (let M = 0; M < b.length; M += 3) {
        let T = b[M],
          k = b[M + 1],
          S = b[M + 2];
        const C = T,
          R = k,
          $ = S;
        for (let lt = 0; lt < 3; lt++) {
          const wt = g(T, k, S);
          if (Math.abs(wt) < y * 0.002) break;
          const it = (g(T + w, k, S) - g(T - w, k, S)) / (2 * w),
            Ft = (g(T, k + w, S) - g(T, k - w, S)) / (2 * w),
            U = (g(T, k, S + w) - g(T, k, S - w)) / (2 * w),
            V = it * it + Ft * Ft + U * U;
          if (V < 1e-12) break;
          ((T -= (it * wt) / V), (k -= (Ft * wt) / V), (S -= (U * wt) / V));
        }
        const L = T - C,
          _ = k - R,
          I = S - $,
          P = Math.sqrt(L * L + _ * _ + I * I);
        if (P > x) {
          const lt = x / P;
          ((T = C + L * lt), (k = R + _ * lt), (S = $ + I * lt));
        }
        ((b[M] = T), (b[M + 1] = k), (b[M + 2] = S));
      }
    }
    function d(g, b, y) {
      const w = g.length / 3,
        x = b.length / 3;
      if (x <= y) return { pos: g.slice(), idx: b.slice() };
      const M = Float64Array.from(g),
        T = Int32Array.from(b),
        k = new Uint8Array(x).fill(1),
        S = new Float64Array(w * 10),
        C = new Int32Array(w),
        R = new Uint8Array(w),
        $ = new Int32Array(w),
        L = Array.from({ length: w }, () => []);
      let _ = 1;
      for (let Y = 0; Y < x; Y++) {
        const N = T[3 * Y],
          q = T[3 * Y + 1],
          et = T[3 * Y + 2];
        (L[N].push(Y), L[q].push(Y), L[et].push(Y));
        const W = M[3 * N],
          nt = M[3 * N + 1],
          ot = M[3 * N + 2],
          St = M[3 * q] - W,
          ct = M[3 * q + 1] - nt,
          ft = M[3 * q + 2] - ot,
          me = M[3 * et] - W,
          Le = M[3 * et + 1] - nt,
          Ho = M[3 * et + 2] - ot;
        let we = ct * Ho - ft * Le,
          re = ft * me - St * Ho,
          le = St * Le - ct * me;
        const Ne = Math.sqrt(we * we + re * re + le * le);
        if (Ne < 1e-14) continue;
        ((we /= Ne), (re /= Ne), (le /= Ne));
        const Ue = -(we * W + re * nt + le * ot),
          oe = Ne * 0.5,
          Yo = we * we * oe,
          Ee = we * re * oe,
          Ve = we * le * oe,
          qe = we * Ue * oe,
          We = re * re * oe,
          ne = re * le * oe,
          Ie = re * Ue * oe,
          Eo = le * le * oe,
          Io = le * Ue * oe,
          Ze = Ue * Ue * oe;
        for (const Bn of [N, q, et]) {
          const Ot = 10 * Bn;
          ((S[Ot] += Yo),
            (S[Ot + 1] += Ee),
            (S[Ot + 2] += Ve),
            (S[Ot + 3] += qe),
            (S[Ot + 4] += We),
            (S[Ot + 5] += ne),
            (S[Ot + 6] += Ie),
            (S[Ot + 7] += Eo),
            (S[Ot + 8] += Io),
            (S[Ot + 9] += Ze));
        }
      }
      const I = [],
        P = [],
        lt = (Y) => {
          let N = I.length;
          for (I.push(Y.c), P.push(Y); N > 0;) {
            const q = (N - 1) >> 1;
            if (I[q] <= Y.c) break;
            ((I[N] = I[q]), (P[N] = P[q]), (N = q));
          }
          ((I[N] = Y.c), (P[N] = Y));
        },
        wt = () => {
          const Y = P[0],
            N = I.pop(),
            q = P.pop(),
            et = I.length;
          if (et) {
            let W = 0;
            for (;;) {
              const nt = 2 * W + 1,
                ot = nt + 1;
              let St = W,
                ct = N;
              if (
                (nt < et && I[nt] < ct && ((St = nt), (ct = I[nt])),
                ot < et && I[ot] < ct && (St = ot),
                St === W)
              )
                break;
              ((I[W] = I[St]), (P[W] = P[St]), (W = St));
            }
            ((I[W] = N), (P[W] = q));
          }
          return Y;
        };
      function it(Y, N) {
        const q = 10 * Y,
          et = 10 * N,
          W = S[q] + S[et],
          nt = S[q + 1] + S[et + 1],
          ot = S[q + 2] + S[et + 2],
          St = S[q + 3] + S[et + 3],
          ct = S[q + 4] + S[et + 4],
          ft = S[q + 5] + S[et + 5],
          me = S[q + 6] + S[et + 6],
          Le = S[q + 7] + S[et + 7],
          Ho = S[q + 8] + S[et + 8],
          we = S[q + 9] + S[et + 9],
          re = (Ot, to, ve) =>
            W * Ot * Ot +
            2 * nt * Ot * to +
            2 * ot * Ot * ve +
            2 * St * Ot +
            ct * to * to +
            2 * ft * to * ve +
            2 * me * to +
            Le * ve * ve +
            2 * Ho * ve +
            we,
          le = M[3 * Y],
          Ne = M[3 * Y + 1],
          Ue = M[3 * Y + 2],
          oe = M[3 * N],
          Yo = M[3 * N + 1],
          Ee = M[3 * N + 2],
          Ve = (le + oe) / 2,
          qe = (Ne + Yo) / 2,
          We = (Ue + Ee) / 2;
        let ne = re(Ve, qe, We),
          Ie = Ve,
          Eo = qe,
          Io = We,
          Ze;
        ((Ze = re(le, Ne, Ue)) < ne &&
          ((ne = Ze), (Ie = le), (Eo = Ne), (Io = Ue)),
          (Ze = re(oe, Yo, Ee)) < ne &&
            ((ne = Ze), (Ie = oe), (Eo = Yo), (Io = Ee)));
        const Bn =
          W * (ct * Le - ft * ft) -
          nt * (nt * Le - ft * ot) +
          ot * (nt * ft - ct * ot);
        if (Math.abs(Bn) > 1e-12) {
          const Ot = 1 / Bn,
            to = -St,
            ve = -me,
            Ko = -Ho,
            as =
              (to * (ct * Le - ft * ft) -
                nt * (ve * Le - ft * Ko) +
                ot * (ve * ft - ct * Ko)) *
              Ot,
            is =
              (W * (ve * Le - ft * Ko) -
                to * (nt * Le - ft * ot) +
                ot * (nt * Ko - ve * ot)) *
              Ot,
            rs =
              (W * (ct * Ko - ve * ft) -
                nt * (nt * Ko - ve * ot) +
                to * (nt * ft - ct * ot)) *
              Ot;
          (as - Ve) ** 2 + (is - qe) ** 2 + (rs - We) ** 2 <
            (le - oe) ** 2 + (Ne - Yo) ** 2 + (Ue - Ee) ** 2 &&
            (Ze = re(as, is, rs)) < ne &&
            ((ne = Ze), (Ie = as), (Eo = is), (Io = rs));
        }
        return {
          c: ne > 0 ? ne : 0,
          a: Y,
          b: N,
          sa: C[Y],
          sb: C[N],
          x: Ie,
          y: Eo,
          z: Io,
        };
      }
      function Ft(Y) {
        const N = Y.a,
          q = Y.b;
        _++;
        for (const ot of L[N])
          if (k[ot]) for (let St = 0; St < 3; St++) $[T[3 * ot + St]] = _;
        let et = 0,
          W = 0;
        const nt = ++_;
        for (const ot of L[q])
          if (k[ot]) {
            let St = !1;
            for (let ct = 0; ct < 3; ct++) {
              const ft = T[3 * ot + ct];
              (ft === N && (St = !0),
                ft !== N &&
                  ft !== q &&
                  $[ft] === nt - 1 &&
                  (et++, ($[ft] = nt)));
            }
            St && W++;
          }
        if (W !== 2 || et !== 2) return !1;
        for (const ot of [N, q])
          for (const St of L[ot]) {
            if (!k[St]) continue;
            const ct = T[3 * St],
              ft = T[3 * St + 1],
              me = T[3 * St + 2];
            if (
              (ct === N || ft === N || me === N) &&
              (ct === q || ft === q || me === q)
            )
              continue;
            const Le = M[3 * ct],
              Ho = M[3 * ct + 1],
              we = M[3 * ct + 2],
              re = M[3 * ft],
              le = M[3 * ft + 1],
              Ne = M[3 * ft + 2],
              Ue = M[3 * me],
              oe = M[3 * me + 1],
              Yo = M[3 * me + 2];
            let Ee = re - Le,
              Ve = le - Ho,
              qe = Ne - we,
              We = Ue - Le,
              ne = oe - Ho,
              Ie = Yo - we;
            const Eo = Ve * Ie - qe * ne,
              Io = qe * We - Ee * Ie,
              Ze = Ee * ne - Ve * We,
              Bn = ct === ot ? Y.x : Le,
              Ot = ct === ot ? Y.y : Ho,
              to = ct === ot ? Y.z : we,
              ve = ft === ot ? Y.x : re,
              Ko = ft === ot ? Y.y : le,
              as = ft === ot ? Y.z : Ne,
              is = me === ot ? Y.x : Ue,
              rs = me === ot ? Y.y : oe,
              Tc = me === ot ? Y.z : Yo;
            ((Ee = ve - Bn),
              (Ve = Ko - Ot),
              (qe = as - to),
              (We = is - Bn),
              (ne = rs - Ot),
              (Ie = Tc - to));
            const Fr = Ve * Ie - qe * ne,
              Or = qe * We - Ee * Ie,
              zr = Ee * ne - Ve * We,
              Ac = Math.sqrt(Eo * Eo + Io * Io + Ze * Ze),
              Gr = Math.sqrt(Fr * Fr + Or * Or + zr * zr);
            if (Gr < 1e-14) return !1;
            if (Ac < 1e-14) continue;
            if ((Eo * Fr + Io * Or + Ze * zr) / (Ac * Gr) < 0.3) return !1;
            const Wh =
              Ee * Ee +
              Ve * Ve +
              qe * qe +
              We * We +
              ne * ne +
              Ie * Ie +
              (is - ve) ** 2 +
              (rs - Ko) ** 2 +
              (Tc - as) ** 2;
            if ((3.4641 * Gr) / Wh < 0.12) return !1;
          }
        return !0;
      }
      let U = x;
      {
        const Y = new Set();
        for (let N = 0; N < x; N++)
          for (let q = 0; q < 3; q++) {
            const et = T[3 * N + q],
              W = T[3 * N + ((q + 1) % 3)],
              nt = et < W ? et * w + W : W * w + et;
            Y.has(nt) || (Y.add(nt), lt(it(et, W)));
          }
      }
      const V = [];
      for (; U > y && I.length;) {
        const Y = wt(),
          N = Y.a,
          q = Y.b;
        if (R[N] || R[q] || C[N] !== Y.sa || C[q] !== Y.sb || !Ft(Y)) continue;
        ((M[3 * N] = Y.x), (M[3 * N + 1] = Y.y), (M[3 * N + 2] = Y.z));
        for (let W = 0; W < 10; W++) S[10 * N + W] += S[10 * q + W];
        for (const W of L[q])
          if (k[W]) {
            if (T[3 * W] === N || T[3 * W + 1] === N || T[3 * W + 2] === N) {
              ((k[W] = 0), U--);
              continue;
            }
            for (let nt = 0; nt < 3; nt++)
              T[3 * W + nt] === q && (T[3 * W + nt] = N);
            L[N].push(W);
          }
        ((L[q] = []), (R[q] = 1), C[N]++, C[q]++);
        const et = L[N].filter((W) => k[W]);
        ((L[N] = et), (V.length = 0), _++);
        for (const W of et)
          for (let nt = 0; nt < 3; nt++) {
            const ot = T[3 * W + nt];
            ot !== N && $[ot] !== _ && (($[ot] = _), V.push(ot));
          }
        for (const W of V) lt(it(N, W));
      }
      const Z = new Int32Array(w).fill(-1),
        mt = [],
        gn = [];
      for (let Y = 0; Y < x; Y++)
        if (k[Y])
          for (let N = 0; N < 3; N++) {
            const q = T[3 * Y + N];
            (Z[q] < 0 &&
              ((Z[q] = mt.length / 3),
              mt.push(M[3 * q], M[3 * q + 1], M[3 * q + 2])),
              gn.push(Z[q]));
          }
      return { pos: mt, idx: gn };
    }
    function m(g, b, y, w) {
      let x = null,
        M = 1e9;
      for (const k of g) {
        if (k.paint || k.sub) continue;
        const S = n(k, k.m ? Math.abs(b) : b, y, w);
        S < M && ((M = S), (x = k));
      }
      let T = x ? x.col : 0;
      for (const k of g)
        k.paint && n(k, k.m ? Math.abs(b) : b, y, w) < 0 && (T = k.col);
      return T;
    }
    function u(g, b, y, w) {
      if (!g.filter(($) => !$.paint && !$.sub).length) return null;
      const M = a(g, b),
        [T, k] = i(g),
        { pos: S, idx: C } = c(M, T, k, y);
      h(M, S, y);
      const R = d(S, C, w);
      return { f: M, pos: R.pos, idx: R.idx, raw: C.length / 3 };
    }
    return {
      prim: o,
      dist: n,
      field: a,
      nets: c,
      project: h,
      decimate: d,
      colorIndex: m,
      mesh: u,
      rot: e,
    };
  })(),
  Ut = 1 / 1.6,
  qf = ["#e6e2da", "#2b2f36", "#0a0c10", "#8a9098", "#3a3f47"].map(
    (t) => new f.Color(t),
  ),
  te = {
    root: [0, 0.95, 0],
    spine: [0, 1.06, 0],
    neck: [0, 1.48, 0],
    shR: [0.235, 1.39, 0],
    elR: [0.255, 1.135, 0.005],
    hipR: [0.1, 0.9, 0],
    knR: [0.105, 0.5, 0.01],
  };
function Eu() {
  const t = (a, i) => El.prim(a, i),
    e = (a, i, l, r = {}) => t(0, { ...r, c: a, r: i, col: l }),
    o = (a, i, l, r, c, h = {}) =>
      t(1, { ...h, a, b: i, r1: l, r2: r, col: c }),
    n = (a, i, l, r, c = {}) => t(2, { ...c, c: a, h: i, rad: l, col: r });
  return [
    [
      0,
      [
        n([0, 0.958, -0.002], [0.118, 0.07, 0.088], 0.05, 0),
        e([0.1, 0.9, 0], [0.066, 0.066, 0.07], 1, { m: 1 }),
        n([0, 0.915, 0], [0.068, 0.045, 0.066], 0.03, 1),
        n([0.118, 0.93, 0], [0.03, 0.05, 0.1], 0, 1, { paint: 1, m: 1 }),
      ],
      0.03,
      0.0105,
      70,
    ],
    [
      1,
      [
        e([0, 1.085, 0], [0.102, 0.074, 0.08], 1),
        n([0, 1.168, 0.004], [0.116, 0.055, 0.082], 0.05, 0),
        n([0, 1.312, -0.004], [0.17, 0.116, 0.098], 0.068, 0),
        e([0, 1.298, 0.034], [0.146, 0.104, 0.078], 0),
        e([0.204, 1.404, 0], [0.073, 0.067, 0.073], 0, { m: 1 }),
        e([0.237, 1.39, 0], [0.053, 0.053, 0.053], 1, { m: 1 }),
        o([0, 1.418, -0.006], [0, 1.5, -0.002], 0.05, 0.043, 1),
        n([0, 1.27, -0.086], [0.116, 0.124, 0.04], 0.03, 3),
        n([0.176, 1.255, 0], [0.022, 0.1, 0.13], 0, 1, { paint: 1, m: 1 }),
      ],
      0.045,
      0.0115,
      180,
    ],
    [
      2,
      [
        e([0, 1.603, -0.006], [0.092, 0.114, 0.108], 0),
        n([0, 1.53, 0.014], [0.058, 0.032, 0.058], 0.032, 0),
        e([0.086, 1.598, -0.012], [0.02, 0.042, 0.036], 3, { m: 1 }),
        e([0, 1.585, 0.08], [0.1, 0.088, 0.07], 2, { paint: 1 }),
      ],
      0.04,
      0.0078,
      110,
    ],
    [
      3,
      [
        o([0.24, 1.39, 0], [0.255, 1.15, 0.005], 0.052, 0.044, 0),
        e([0.246, 1.29, 0.01], [0.055, 0.085, 0.055], 0),
        e([0.255, 1.135, 0.005], [0.046, 0.046, 0.049], 1),
      ],
      0.03,
      0.0088,
      48,
      5,
    ],
    [
      4,
      [
        o([0.255, 1.135, 0.005], [0.262, 0.912, 0.025], 0.043, 0.034, 0),
        e([0.258, 1.03, 0.015], [0.047, 0.08, 0.047], 0),
        e([0.262, 0.9, 0.025], [0.031, 0.029, 0.031], 1),
        n([0.266, 0.836, 0.03], [0.022, 0.048, 0.042], 0.018, 1),
        n([0.266, 0.775, 0.036], [0.018, 0.03, 0.038], 0.015, 1),
        o([0.254, 0.862, 0.066], [0.249, 0.822, 0.08], 0.013, 0.011, 1),
      ],
      0.022,
      0.0078,
      62,
      6,
    ],
    [
      7,
      [
        o([0.1, 0.91, 0], [0.105, 0.52, 0.01], 0.077, 0.058, 0),
        e([0.103, 0.74, 0.016], [0.072, 0.14, 0.075], 0),
        e([0.105, 0.5, 0.01], [0.057, 0.054, 0.059], 1),
      ],
      0.04,
      0.0105,
      52,
      9,
    ],
    [
      8,
      [
        o([0.105, 0.5, 0.01], [0.1, 0.11, -0.005], 0.055, 0.042, 0),
        e([0.103, 0.36, -0.016], [0.055, 0.1, 0.06], 0),
        e([0.1, 0.09, -0.005], [0.04, 0.035, 0.04], 1),
        n([0.1, 0.035, 0.035], [0.048, 0.033, 0.115], 0.025, 4),
      ],
      0.03,
      0.0098,
      62,
      10,
    ],
  ];
}
function Wf(t = 1) {
  const e = [],
    o = [],
    n = [],
    a = [],
    i = new f.Color(),
    l = yo(7),
    r = (u, g, b, y, w, x = 0, M = 0.035) => {
      i.copy(y).multiplyScalar(1 + (l() - 0.5) * 2 * M);
      for (const T of [u, g, b])
        (e.push(T[0] * Ut, T[1] * Ut, T[2] * Ut),
          o.push(i.r, i.g, i.b),
          n.push(w),
          a.push(x));
    };
  let c = null,
    h = null;
  for (const [u, g, b, y, w, x] of Eu()) {
    const M = El.mesh(
      g,
      b,
      y / Math.sqrt(t > 0.6 ? 1 : 0.8),
      Math.max(24, Math.round(w * t)),
    );
    if (!M) continue;
    const T = [];
    for (let k = 0; k < M.idx.length; k += 3) {
      const S = M.pos,
        C = M.idx[k] * 3,
        R = M.idx[k + 1] * 3,
        $ = M.idx[k + 2] * 3,
        L = [S[C], S[C + 1], S[C + 2]],
        _ = [S[R], S[R + 1], S[R + 2]],
        I = [S[$], S[$ + 1], S[$ + 2]],
        P = (L[0] + _[0] + I[0]) / 3,
        lt = (L[1] + _[1] + I[1]) / 3,
        wt = (L[2] + _[2] + I[2]) / 3,
        it = qf[El.colorIndex(g, P, lt, wt)] || qf[0];
      (T.push([L, _, I, it]), r(L, _, I, it, u));
    }
    if (x != null)
      for (const [k, S, C, R] of T)
        r([-k[0], k[1], k[2]], [-C[0], C[1], C[2]], [-S[0], S[1], S[2]], R, x);
    if (u === 1 || u === 2) {
      const k = new f.BufferGeometry(),
        S = [];
      for (const R of T) S.push(...R[0], ...R[1], ...R[2]);
      k.setAttribute("position", new f.Float32BufferAttribute(S, 3));
      const C = new f.Mesh(k);
      (C.updateMatrixWorld(!0), u === 1 ? (c = C) : (h = C));
    }
  }
  {
    const T = new f.Color(1, 1, 1);
    for (let k = 0; k < 9; k++) {
      const S = -0.8 + (k / 9) * 1.6,
        C = -0.8 + ((k + 1) / 9) * 1.6,
        R = [
          Math.sin(S) * 0.092 * 1.045,
          1.598 - 0.0065,
          -0.006 + Math.cos(S) * 0.108 * 1.045,
        ],
        $ = [
          Math.sin(C) * 0.092 * 1.045,
          1.598 - 0.0065,
          -0.006 + Math.cos(C) * 0.108 * 1.045,
        ],
        L = [R[0], 1.598 + 0.0065, R[2]],
        _ = [$[0], 1.598 + 0.0065, $[2]];
      (r(R, $, _, T, 2, 1, 0), r(R, _, L, T, 2, 1, 0));
    }
  }
  {
    const u = new f.Raycaster(
        new f.Vector3(0.045, 1.235, 0.4),
        new f.Vector3(0, 0, -1),
      ),
      g = c ? u.intersectObject(c)[0] : null,
      b = (g ? g.point.z : 0.1) + 0.003,
      y = new f.Color(1, 1, 1),
      w = [0.045, 1.235, b],
      x = 0.009;
    for (let M = 0; M < 6; M++) {
      const T = (M / 6) * Math.PI * 2,
        k = ((M + 1) / 6) * Math.PI * 2;
      r(
        w,
        [w[0] + Math.cos(T) * x, w[1] + Math.sin(T) * x, b],
        [w[0] + Math.cos(k) * x, w[1] + Math.sin(k) * x, b],
        y,
        1,
        1,
        0,
      );
    }
  }
  const d = new f.BufferGeometry();
  (d.setAttribute("position", new f.Float32BufferAttribute(e, 3)),
    d.setAttribute("color", new f.Float32BufferAttribute(o, 3)),
    d.setAttribute("aLink", new f.Float32BufferAttribute(n, 1)),
    d.setAttribute("aGlow", new f.Float32BufferAttribute(a, 1)),
    d.computeVertexNormals());
  const m = e.length / 3;
  {
    const u = new f.Raycaster(
        new f.Vector3(0, 1.31, 0.4),
        new f.Vector3(0, 0, -1),
      ),
      g = c ? u.intersectObject(c)[0] : null,
      b = (g ? g.point.z : 0.11) + 0.004,
      y = 0.042,
      w = 1.312,
      x = [
        [-y, w - y, b],
        [y, w - y, b],
        [y, w + y, b],
        [-y, w - y, b],
        [y, w + y, b],
        [-y, w + y, b],
      ],
      M = [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
      T = d.attributes.position.array,
      k = new Float32Array(T.length + 18),
      S = new Float32Array(d.attributes.color.array.length + 18),
      C = new Float32Array(n.length + 6),
      R = new Float32Array(a.length + 6),
      $ = new Float32Array((m + 6) * 2);
    (k.set(T),
      S.set(d.attributes.color.array),
      C.set(n),
      R.set(a),
      x.forEach((L, _) => {
        (k.set([L[0] * Ut, L[1] * Ut, L[2] * Ut], T.length + _ * 3),
          S.set([1, 1, 1], d.attributes.color.array.length + _ * 3),
          (C[n.length + _] = 1),
          $.set([M[_ * 2], M[_ * 2 + 1]], (m + _) * 2));
      }),
      d.setAttribute("position", new f.BufferAttribute(k, 3)),
      d.setAttribute("color", new f.BufferAttribute(S, 3)),
      d.setAttribute("aLink", new f.BufferAttribute(C, 1)),
      d.setAttribute("aGlow", new f.BufferAttribute(R, 1)),
      d.setAttribute("uv", new f.BufferAttribute($, 2)),
      d.deleteAttribute("normal"),
      d.computeVertexNormals(),
      d.addGroup(0, m, 0),
      d.addGroup(m, 6, 1));
  }
  return ((d.userData.tris = m / 3), d);
}
const Iu = `attribute float aLink;attribute float aGlow;attribute vec4 aRob;attribute vec4 aRob2;uniform float uTime;uniform vec4 uWave;uniform vec3 uWaveC;
varying float vGlow;varying vec3 vVisor;varying float vFlash;varying float vShell;varying float vMotor;
const vec3 RJ_ROOT=vec3(${te.root.map((t) => (t * Ut).toFixed(5))}),RJ_SP=vec3(${te.spine.map((t) => (t * Ut).toFixed(5))}),RJ_NK=vec3(${te.neck.map((t) => (t * Ut).toFixed(5))}),
 RJ_SHR=vec3(${te.shR.map((t) => (t * Ut).toFixed(5))}),RJ_SHL=vec3(${[-te.shR[0], te.shR[1], te.shR[2]].map((t) => (t * Ut).toFixed(5))}),
 RJ_ELR=vec3(${te.elR.map((t) => (t * Ut).toFixed(5))}),RJ_ELL=vec3(${[-te.elR[0], te.elR[1], te.elR[2]].map((t) => (t * Ut).toFixed(5))}),
 RJ_HPR=vec3(${te.hipR.map((t) => (t * Ut).toFixed(5))}),RJ_HPL=vec3(${[-te.hipR[0], te.hipR[1], te.hipR[2]].map((t) => (t * Ut).toFixed(5))}),
 RJ_KNR=vec3(${te.knR.map((t) => (t * Ut).toFixed(5))}),RJ_KNL=vec3(${[-te.knR[0], te.knR[1], te.knR[2]].map((t) => (t * Ut).toFixed(5))});
mat3 rbX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 rbY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rbZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
mat3 rbR(vec3 a){return rbY(a.y)*rbX(a.x)*rbZ(a.z);}
float rbRank(int L){return L==8?0.:L==10?1.:L==7?2.:L==9?3.:L==0?4.:L==1?5.:L==3?6.:L==5?7.:L==4?8.:L==6?9.:10.;}
void rbFK(inout vec3 p,inout vec3 n){
 float ph=aRob.x*6.2832,md=aRob.y,pr=aRob.z,t=uTime;int L=int(aLink+.5);
 vec3 sp=vec3(0.),nk=vec3(0.),shR=vec3(.02,0.,.09),shL=vec3(.02,0.,-.09),hpR=vec3(-.03,0.,.015),hpL=vec3(-.03,0.,-.015),rr=vec3(0.),rt=vec3(0.);
 float elR=-.2,elL=-.2,knR=.07,knL=.07,br=sin(t*1.9+ph);sp.x+=.012*br;vFlash=0.;
 if(md<.5){float lk=smoothstep(.5,.92,sin(t*.31+ph*1.7));nk.y=.5*sin(t*.47+ph)*lk;nk.x=.04*sin(t*.7+ph);shR.x+=.035*sin(t*.8+ph);shL.x-=.035*sin(t*.8+ph);}
 else if(md<1.5){float w=t*2.5+ph,s=sin(w),c=sin(w+2.2);sp.x=.3+.05*sin(w*.5);sp.y=.08*sin(w*.21+ph);nk.x=.3+.05*s;nk.y=.1*sin(w*.27);
  shR=vec3(-1.02-.32*s,.1,-.06);elR=-1.0+.38*s;shL=vec3(-1.02-.32*c,-.1,.06);elL=-1.0+.38*c;hpR.x=-.24;hpL.x=-.24;knR=.36;knL=.36;rt.y=-.03*${Ut.toFixed(4)};}
 else if(md<3.5){float g=t*pr+ph,s=sin(g),c=cos(g);hpR.x=-.4*s;hpL.x=.4*s;knR=.07+.62*max(0.,c);knL=.07+.62*max(0.,-c);
  if(md<2.5){shR.x=.34*s;shL.x=-.34*s;elR=-.28-.2*max(0.,-s);elL=-.28-.2*max(0.,s);}else{shR=vec3(-.55,0.,-.18);shL=vec3(-.55,0.,.18);elR=-1.15;elL=-1.15;}
  sp.y=.07*s;sp.x=.06;rt.y=(.02*abs(c)-.01)*${Ut.toFixed(4)};nk.y=-.05*s;}
 else if(md<4.5){float w=t*.9+ph;shR=vec3(-.1,0.,1.3+.1*sin(w*1.3));shL=vec3(-.1,0.,-1.3-.1*sin(w*1.1));elR=-.12;elL=-.12;
  hpL=vec3(-.6+.15*sin(w),0.,-.1);knL=1.15;hpR.z=.03;sp.z=.05*sin(w*1.7);rr.z=.035*sin(w*1.7);nk.z=-.05*sin(w*1.7);}
 else if(md<5.5){float s=.5-.5*cos(t*1.7+ph);hpR=vec3(-1.15*s,0.,.12*s);hpL=vec3(-1.15*s,0.,-.12*s);knR=1.95*s;knL=1.95*s;sp.x=.42*s;shR.x=-1.35*s;shL.x=-1.35*s;elR=-.15;elL=-.15;
  rt.y=-.36*s*${Ut.toFixed(4)};rt.z=-.07*s*${Ut.toFixed(4)};}
 else if(md<6.5){float w=t*1.3+ph,s=sin(w),c=cos(w);shR=vec3(-1.45-.45*s,0.,.35+.45*c);shL=vec3(-1.45+.45*s,0.,-.35-.45*c);elR=-.55+.45*c;elL=-.55-.45*c;sp.y=.3*s;nk.y=.35*s;}
 else if(md<7.5){float k=clamp(pr,0.,1.);rr.x=-1.5708*(1.-smoothstep(.15,.85,k));float tk=sin(k*3.1416);knR=.07+1.6*tk;knL=.07+1.6*tk;hpR.x=-.03-1.2*tk;hpL.x=-.03-1.2*tk;
  sp.x=.5*tk;shR.x=-.9*tk;shL.x=-.9*tk;elR=-.2-.8*tk;elL=-.2-.8*tk;nk.x=-.25*(1.-k)+.1*tk;}
 else if(md<8.5){nk.x=.42;sp.x=.07;shR=vec3(.05,0.,.0);shL=vec3(.05,0.,.0);elR=-.07;elL=-.07;knR=.1;knL=.1;hpR.x=-.05;hpL.x=-.05;}
 else if(md<9.5){float w=t*7.+ph;shR=vec3(-.2,0.,2.5);elR=-.6-.45*sin(w);nk.z=-.12;nk.y=.15;sp.z=.04;}
 else{nk.x=.42;sp.x=.05;shR=vec3(.08,0.,.32);shL=vec3(.08,0.,-.32);elR=-.12;elL=-.12;knR=.06;knL=.06;}
 // the over-the-air update: a ring of light runs out from the gym; every robot it crosses flashes and looks up
 {vec3 wp=(instanceMatrix*vec4(0.,0.,0.,1.)).xyz;float r=(t-uWave.x)*uWave.y,d=length(wp.xz-uWaveC.xz);float f=uWave.x>0.?exp(-pow((d-r)/max(uWave.z,.01),2.)):0.;
  f*=step(0.,t-uWave.x)*(1.-smoothstep(uWave.w*.9,uWave.w,r));vFlash=f;nk.x-=.45*f;sp.x-=.08*f;}
 // being built, in four stages: the frame (graphite links arrive feet first, the newest one lit), the motors (a copper glow runs up through the
 // joints), the shell (each link turns from graphite to white, feet first) and power-on (the visor flickers on). aRob2.z > 0: cycles at that rate
 // a second; < 0: a set progress
 float hide=0.,asmK=-1.;vShell=1.;vMotor=0.;
 if(abs(aRob2.z)>1e-6){float k=aRob2.z>0.?fract(t*aRob2.z+aRob.x):-aRob2.z,rk=rbRank(L);asmK=k;
  float fr=k/.34*11.6;hide=step(fr,rk);vFlash=max(vFlash,(1.-smoothstep(0.,.6,fr-rk))*(1.-hide)*.8*step(k,.34));
  float jt=.35;
  #ifdef USE_COLOR
  jt=1.-.65*step(.3,dot(color.rgb,vec3(.333)));
  #endif
  vMotor=k>.34&&k<.62?exp(-pow(((k-.34)/.28*12.6-1.-rk)*.85,2.))*jt:0.;
  vShell=clamp((k-.62)/.27*11.6-rk,0.,1.);}
 // only the joints on this vertex's own chain are built (a hand needs elbow, shoulder, spine; a foot knee and hip): a third of the trigonometry
 bool up=L>=1&&L<=6;
 if(L==4){mat3 R=rbX(elR);p=R*(p-RJ_ELR)+RJ_ELR;n=R*n;}
 else if(L==6){mat3 R=rbX(elL);p=R*(p-RJ_ELL)+RJ_ELL;n=R*n;}
 if(L==3||L==4){mat3 R=rbR(shR);p=R*(p-RJ_SHR)+RJ_SHR;n=R*n;}
 else if(L==5||L==6){mat3 R=rbR(shL);p=R*(p-RJ_SHL)+RJ_SHL;n=R*n;}
 else if(L==2){mat3 R=rbR(nk);p=R*(p-RJ_NK)+RJ_NK;n=R*n;}
 if(up){mat3 R=rbR(sp);p=R*(p-RJ_SP)+RJ_SP;n=R*n;}
 if(L==8){mat3 R=rbX(knR);p=R*(p-RJ_KNR)+RJ_KNR;n=R*n;}
 else if(L==10){mat3 R=rbX(knL);p=R*(p-RJ_KNL)+RJ_KNL;n=R*n;}
 if(L==7||L==8){mat3 R=rbR(hpR);p=R*(p-RJ_HPR)+RJ_HPR;n=R*n;}
 else if(L==9||L==10){mat3 R=rbR(hpL);p=R*(p-RJ_HPL)+RJ_HPL;n=R*n;}
 if(dot(rr,rr)>1e-8){mat3 R=rbR(rr);p=R*(p-RJ_ROOT)+RJ_ROOT;n=R*n;}
 p+=rt;
 if(hide>.5)p=RJ_ROOT;
 // the pop when a robot arrives: a quick swell from nothing, from the feet
 {float age=t-aRob2.x,k=clamp(age/.45,0.,1.);float s=age<0.?1.:1.+(sin(k*3.1416*1.15)*.22)*(1.-k)-(1.-k)*(1.-k)*.6;p*=max(s,.02);}
 vGlow=aGlow;vVisor=aRob2.y<.5?vec3(.42,1.25,1.7):aRob2.y<1.5?vec3(1.7,.95,.3):aRob2.y<2.5?vec3(.05,.06,.07):vec3(1.5,.35,.3);
 if(asmK>=0.){float on=smoothstep(.9,.95,asmK)*(asmK<.95?step(.4,fract(t*11.+aRob.x*7.)):1.);vVisor=mix(vec3(.05,.06,.07),vec3(.42,1.25,1.7),on);}}`,
  Bu = `#include <emissivemap_fragment>
 totalEmissiveRadiance+=vVisor*vGlow*(1.6+3.5*vFlash)+vec3(.35,.8,1.)*vFlash*.55+vec3(2.1,.95,.35)*vMotor*.9;`;
function Wi(t, e) {
  return _o(
    t,
    Object.assign(
      (o) => {
        (Object.assign(o.uniforms, {
          uTime: an.time,
          uWave: an.wave,
          uWaveC: an.waveC,
        }),
          (o.vertexShader = o.vertexShader.replace(
            "#include <common>",
            `#include <common>
` + Iu,
          )),
          e === "depth"
            ? (o.vertexShader = o.vertexShader.replace(
                "#include <begin_vertex>",
                "vec3 transformed=vec3(position);{vec3 rbn=vec3(0.,1.,0.);rbFK(transformed,rbn);}",
              ))
            : (o.vertexShader = o.vertexShader
                .replace(
                  "#include <beginnormal_vertex>",
                  "vec3 objectNormal=vec3(normal);vec3 rbP=vec3(position);rbFK(rbP,objectNormal);",
                )
                .replace("#include <begin_vertex>", "vec3 transformed=rbP;")),
          e !== "depth" &&
            (o.fragmentShader = o.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
varying float vGlow;varying vec3 vVisor;varying float vFlash;varying float vShell;varying float vMotor;`,
              )
              .replace(
                "#include <color_fragment>",
                `#include <color_fragment>
` +
                  (e === "badge"
                    ? "if(vShell<.5)discard;"
                    : "diffuseColor.rgb=mix(vec3(.15,.16,.18),diffuseColor.rgb,vShell);"),
              )
              .replace("#include <emissivemap_fragment>", Bu)));
      },
      { key: "robot-" + e },
    ),
  );
}
const an = {
    time: { value: 0 },
    wave: { value: new f.Vector4(-99, 6, 1.6, 60) },
    waveC: { value: new f.Vector3() },
  },
  Hi = document.createElement("canvas");
Hi.width = Hi.height = 256;
const Ia = new f.CanvasTexture(Hi);
((Ia.colorSpace = f.SRGBColorSpace), (Ia.anisotropy = 4));
function Ba() {
  const t = Hi.getContext("2d"),
    e = 256;
  t.clearRect(0, 0, e, e);
  const o =
    de.badge ||
    (s.res.model && de.brain?.glyph
      ? { name: de.brain.brand, mark: de.brain.glyph }
      : null);
  if (o?.mark) {
    const n = If({ id: "badge-" + o.name, logo: o.mark }, Ba);
    if (n) {
      (t.drawImage(n, 10, 10, e - 20, e - 20), (Ia.needsUpdate = !0));
      return;
    }
  }
  ((t.fillStyle = "#161b24"),
    t.beginPath(),
    t.arc(e / 2, e / 2, e / 2 - 8, 0, 7),
    t.fill(),
    (t.lineWidth = 12),
    (t.strokeStyle = "#7fe3ff"),
    t.beginPath(),
    t.arc(e / 2, e / 2, e / 2 - 32, 0, 7),
    t.stroke(),
    (t.fillStyle = "#f1ede4"),
    (t.font = "800 96px Outfit, sans-serif"),
    (t.textAlign = "center"),
    (t.textBaseline = "middle"),
    t.fillText(Df(s.lab).slice(0, 2), e / 2, e / 2 + 7, e - 96),
    (Ia.needsUpdate = !0));
}
const Hf = Wf(0.82),
  _u = Wf(0.34),
  Yf = [
    Wi(
      new f.MeshPhysicalMaterial({
        vertexColors: !0,
        flatShading: !0,
        roughness: 0.42,
        metalness: 0.05,
        clearcoat: 0.55,
        clearcoatRoughness: 0.3,
        envMapIntensity: 1,
      }),
      "body",
    ),
    Wi(
      new f.MeshStandardMaterial({
        map: Ia,
        alphaTest: 0.4,
        roughness: 0.45,
        envMapIntensity: 0.6,
      }),
      "badge",
    ),
  ],
  Du = Wi(
    new f.MeshDepthMaterial({ depthPacking: f.RGBADepthPacking }),
    "depth",
  ),
  _a = 2400,
  Ls = 80,
  Pu = [
    Wi(
      new f.MeshStandardMaterial({
        vertexColors: !0,
        flatShading: !0,
        roughness: 0.42,
        metalness: 0.05,
        envMapIntensity: 1.1,
      }),
      "body-lo",
    ),
    Yf[1],
  ];
function Il(t, e, o = Yf) {
  const n = new f.InstancedMesh(t, o, e),
    a = new f.InstancedBufferAttribute(new Float32Array(e * 4), 4),
    i = new f.InstancedBufferAttribute(new Float32Array(e * 4), 4);
  return (
    a.setUsage(f.DynamicDrawUsage),
    i.setUsage(f.DynamicDrawUsage),
    n.instanceMatrix.setUsage(f.DynamicDrawUsage),
    t.setAttribute("aRob", a),
    t.setAttribute("aRob2", i),
    (n.count = 0),
    (n.castShadow = n.receiveShadow = !0),
    (n.customDepthMaterial = Du),
    (n.frustumCulled = !1),
    Gt.add(n),
    oo.push(n),
    n
  );
}
const Mn = Il(Hf, _a),
  Sn = Il(_u, _a, Pu),
  Bl = Il(Hf.clone(), Ls);
((Sn.castShadow = !1), (Sn.receiveShadow = !1), eo.push(Sn));
const Yi = new f.Quaternion(),
  Ki = new f.Matrix4(),
  Kf = new f.Vector3(),
  Xf = new f.Vector3(1, 1, 1),
  Yp = new f.Matrix4().makeScale(0, 0, 0);
function rn(t, e, o, n, a, i, l, r, c, h, d = -9, m = 0, u = 1) {
  (Yi.setFromAxisAngle(ps, i),
    Ki.compose(Kf.set(o, n, a), Yi, Xf.set(u, u, u)),
    t.setMatrixAt(e, Ki),
    t.geometry.attributes.aRob.setXYZW(e, c, l, r, 0),
    t.geometry.attributes.aRob2.setXYZW(e, d, h, m, 0));
}
function _l(t, e, o) {
  if (!(o <= e))
    for (const n of [
      t.instanceMatrix,
      t.geometry.attributes.aRob,
      t.geometry.attributes.aRob2,
    ])
      (n.addUpdateRange(e * n.itemSize, (o - e) * n.itemSize),
        (n.needsUpdate = !0));
}
const Jf = {
    bench: {
      fix: [[-0.02, -0.08, "lie"]],
      crew: [
        [-0.24, 0.37, Math.PI],
        [0.24, 0.37, Math.PI],
      ],
      show: 2,
    },
    cell: {
      fix: [[0, -0.06, "up", 0.03]],
      crew: [
        [-0.31, 0.29, Math.PI * 0.8],
        [0.31, 0.29, -Math.PI * 0.8],
        [0.02, -0.42, 0],
      ],
      show: 3,
    },
    line: {
      fix: [
        [-0.22, -0.03, "up", 0.105],
        [0.22, -0.03, "up", 0.105],
      ],
      crew: [
        [-0.25, 0.39, Math.PI],
        [0.25, 0.39, Math.PI],
        [-0.25, -0.41, 0],
        [0.25, -0.41, 0],
      ],
      show: 4,
    },
    giga: {
      fix: [
        [-0.19, -0.03, "up", 0.105],
        [0.19, -0.03, "up", 0.105],
      ],
      crew: [
        [-0.3, 0.39, Math.PI * 0.92],
        [0.3, 0.39, -Math.PI * 0.92],
        [-0.3, -0.42, Math.PI * 0.08],
        [0.3, -0.42, -Math.PI * 0.08],
        [-0.44, -0.03, Math.PI / 2],
        [0.44, -0.03, -Math.PI / 2],
      ],
      show: 4,
    },
    auto: {
      fix: [
        [-0.19, -0.02, "up", 0.04],
        [0.19, -0.02, "up", 0.04],
      ],
      crew: [
        [-0.28, 0.33, Math.PI * 0.9],
        [0.28, 0.33, -Math.PI * 0.9],
        [-0.28, -0.36, Math.PI * 0.1],
        [0.28, -0.36, -Math.PI * 0.1],
        [0, 0.36, Math.PI],
        [0, -0.38, 0],
        [-0.4, -0.02, Math.PI / 2],
        [0.4, -0.02, -Math.PI / 2],
      ],
      show: 4,
    },
  },
  Fu = 0.5,
  Xi = Fu - 0.83 * Ut,
  Ou = 0.2,
  Es = new Float32Array(Bt * 2),
  Ji = new Float32Array(Bt * 2);
let xe = !0,
  zu = 0,
  Gu = 0,
  Dl = -9,
  Qf = new f.Vector3(1e9, 0, 0);
const Is = () => p.you >= 0 && (s.built < 14 || p.stations <= 2),
  Zf = 72;
function ju() {
  ((xe = !1), (Dl = z), Qf.copy(H.position));
  const t =
      (1.08 * Math.max(Xo.clientHeight, 1)) /
      (2 * Math.tan(f.MathUtils.degToRad(H.fov / 2)) * 48),
    e = H.position,
    o = [],
    n = (u, g, b, y, w, x, M, T, k, S) =>
      o.push([u, g, b, y, w, x, M, T, k, S]),
    a = se.length,
    i = a > 360 ? 1 : a > 160 ? 2 : a > 80 ? 3 : 9,
    l = a > 200,
    r = Is() ? p.you : -1,
    c = z;
  for (const u of se) {
    const g = Q[s.cells[u]],
      b = Jf[g.id],
      y = u % j,
      w = Math.floor(u / j),
      x = y + 0.5,
      M = -(w + 0.5),
      T = p.lineFull ? 0 : (ao[u] / wo) * io[u] * p.brown,
      k = b.fix.length;
    b.fix.forEach(([R, $, L], _) => {
      if (u === r || (l && _ > 0)) return;
      const I = u * 2 + _,
        P = T > 1e-6 ? D(T / k, 0.012, Ou) : 0,
        lt = Ji[I],
        wt = Es[I],
        it = lt > 0 ? (((c * lt + wt) % 1) + 1) % 1 : wt;
      let Ft;
      P > 0
        ? ((Es[I] = (((it - c * P) % 1) + 1) % 1), (Ji[I] = P), (Ft = P))
        : ((Es[I] = it || 0.45 + Kt(u) * 0.3),
          (Ji[I] = 0),
          (Ft = -Math.max(0.05, Es[I])));
      const U = L === "lie";
      n(
        x + R,
        U ? Xi : kt + (b.fix[_][3] || 0),
        M + $,
        U ? Math.PI / 2 : 0,
        U ? 7 : 10,
        0,
        Es[I],
        2,
        Ft,
        -9,
      );
    });
    const S = u === p.you ? 1 : 0,
      C = Math.min(bs[u], i, b.show - S);
    for (let R = 0; R < C; R++) {
      const [$, L, _] = b.crew[R + S];
      n(
        x + $,
        kt,
        M + L,
        _,
        p.lineFull || pe[u] ? 0 : 1,
        0,
        Kt(u * 7.3 + R),
        0,
        0,
        Nu[u * 8 + R] || -9,
      );
    }
  }
  const h = Math.min(p.gym, Un.length, Zf);
  for (let u = 0; u < h; u++) {
    const [g, b] = Un[u],
      y = Kt(u * 3.1 + 0.7),
      w = [4, 5, 6, 2, 5, 4][Math.floor(y * 6)];
    n(g, 0, b, (y - 0.5) * 0.5, w, w === 2 ? 4.2 : 0, Kt(u * 1.7), 1, 0, -9);
  }
  let d = 0,
    m = 0;
  for (const u of o) {
    const b =
      Math.hypot(u[0] - e.x, u[1] - e.y, u[2] - e.z) < t && d < _a
        ? Mn
        : m < _a
          ? Sn
          : d < _a
            ? Mn
            : null;
    if (!b) break;
    const y = b === Mn ? d++ : m++;
    rn(b, y, u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[9], u[8]);
  }
  (_l(Mn, 0, d),
    _l(Sn, 0, m),
    (zu = d),
    (Gu = m),
    (Mn.count = d),
    (Sn.count = m));
}
const Nu = new Float32Array(Bt * 8),
  rt = {
    W: [],
    pend: { keep: 0, ship: 0, back: 0 },
    gap: 0,
    qgap: 0,
    arm: 0,
    armT: 0,
    armHold: 0,
    lift: 0,
    crates: [],
    riser: null,
    walkGap: 0.6,
    loadAt: 0,
  },
  t0 = 1.15,
  Uu = (t0 * Math.PI * 2) / 1.05,
  Vu = 10,
  e0 = (t) => ({
    s: ko.out.dd[ko.out.dd.length - 1] - 0.04 - Math.floor(t / 2) * 0.4,
    x: t % 2 ? 0.2 : -0.2,
  });
((rt.out = function (t, e, o) {
  const n = this.pend;
  ((n.keep += e),
    (n.ship += o),
    (n.back += Math.max(
      0,
      Math.min(e, p.posts - Math.floor(s.kept - e + 1e-9)),
    )));
  const a = this.W.filter((l) => l.dest === "queue").sort((l, r) => l.q - r.q);
  if (
    (this.riser && this.riser.dest === "queue" && a.push(this.riser), !a.length)
  )
    return;
  const i = Math.max(1, Math.floor((n.keep + n.ship) / a.length));
  a.forEach((l, r) => {
    const c = n.keep + n.ship;
    if (c <= 0) ((l.dest = "back"), (l.n = 0));
    else {
      const h = n.ship > 0 && (n.keep <= 0 || ce() * c < n.ship),
        d = Math.min(i, h ? n.ship : n.keep);
      h ? (n.ship -= d) : (n.keep -= d);
      const m = !h && n.back > 0;
      (m && (n.back = Math.max(0, n.back - d)),
        (l.dest = h ? "ship" : m ? "back" : "yard"),
        (l.n = d));
    }
    l.state === "wait" &&
      ((l.state = "out"), (l.hold = z + r * 0.18), (rt.lcue = z));
  });
}),
  (rt.spawn = function (t, e, o, n) {
    if (this.W.length >= Ls - 16) return null;
    const a = {
      dest: t,
      n: e,
      amt: o,
      path: ko.out,
      s: 0,
      phase: ce(),
      t0: z,
      x: Mt,
      z: -0.45,
      yaw: 0,
      y: 0,
      ox: 0,
      mode: 2,
      state: "out",
      go(i) {
        ((this.path = i), (this.s = 0), (this.state = "go"));
      },
    };
    return (n && ((a.path = n), (a.state = "in")), this.W.push(a), a);
  }),
  (rt.tick = function (t) {
    const e = z,
      o = this.pend;
    if (((this.gap -= t), (this.qgap -= t), this.qgap <= 0)) {
      const r = this.riser && this.riser.dest === "queue" ? 1 : 0,
        c = this.W.filter((d) => d.dest === "queue").length + r,
        h = Math.min(Vu, Math.floor(s.ready + 1e-9));
      if (c < h) {
        if (Is() && !this.riser && s.built < 14) this.rise("queue", 1, 0);
        else {
          const d = this.spawn("queue", 1, 0);
          d && (d.q = c);
        }
        this.qgap = 0.5;
      }
    }
    if (this.gap <= 0 && o.keep + o.ship > 0 && !this.riser) {
      const r = o.keep + o.ship,
        c = Math.max(1, Math.ceil(r / 5)),
        h = o.ship > 0 && (o.keep <= 0 || ce() * r < o.ship),
        d = Math.min(c, h ? o.ship : o.keep);
      h ? (o.ship -= d) : (o.keep -= d);
      const m = !h && o.back > 0;
      (m && (o.back = Math.max(0, o.back - d)),
        Is() && r <= 2
          ? this.rise(h ? "ship" : m ? "back" : "yard", d, 0)
          : this.spawn(h ? "ship" : m ? "back" : "yard", d, 0),
        (this.gap = this.walkGap * (r > 40 ? 0.55 : 1)));
    }
    const n = this.riser;
    if (n && e - n.t0 > 1.7) {
      this.riser = null;
      const c = this.spawn(n.dest, n.n, n.amt, n.path);
      c &&
        n.dest === "queue" &&
        (c.q = this.W.filter((h) => h.dest === "queue" && h !== c).length);
    }
    for (const r of this.W) {
      if (r.state === "wait") {
        const g = r.q === 0,
          b = e0(r.q);
        ((r.mode = g && Math.sin(e * 0.9 + r.phase * 9) > 0.86 ? 9 : 0),
          (r.yaw = Yn(r.yaw, g ? -0.55 : 0, 1 - Math.exp(-t * 3))),
          (r.ox += (b.x - r.ox) * (1 - Math.exp(-t * 6))),
          nn(r.path, r.path.dd, r.s, st),
          (r.x = st.x + r.ox));
        continue;
      }
      if (r.hold && e < r.hold) {
        r.mode = 0;
        continue;
      }
      const c = r.path.dd,
        h = c[c.length - 1],
        d = r.dest === "queue" && r.state === "out" ? e0(r.q) : null,
        m = d ? Math.min(h, d.s) : h;
      if (((r.s += t0 * t), r.s >= m)) {
        if (((r.s = m), d)) {
          ((r.state = "wait"), (r.mode = 0));
          continue;
        }
        r.state === "in"
          ? ((r.path = ko.out), (r.s = 0), (r.state = "out"))
          : r.state === "out"
            ? (qu(r.dest), r.go(ko[r.dest]))
            : (this.arrive(r), (r.done = !0));
      }
      if (r.done) continue;
      (nn(r.path, c, r.s, st), nn(r.path, c, Math.min(h, r.s + 0.12), Nt));
      const u = d && r.s > d.s - 0.6 ? d.x : 0;
      ((r.ox += (u - r.ox) * (1 - Math.exp(-t * 6))),
        (r.x = st.x + r.ox),
        (r.z = st.z),
        (r.y = st.y),
        Nt.distanceToSquared(st) > 1e-6 &&
          (r.yaw = Yn(
            r.yaw,
            Math.atan2(Nt.x - st.x, Nt.z - st.z),
            1 - Math.exp(-t * 10),
          )),
        (r.mode = 2));
    }
    this.W = this.W.filter((r) => !r.done);
    let i = -Math.PI * (s.chose ? s.split : 0.5);
    (e < this.armHold && (i = this.armT),
      (this.arm +=
        (i - this.arm) * (1 - Math.exp(-t * (e < this.armHold ? 16 : 5)))));
    const l =
      e < this.armHold ||
      this.W.some(
        (r) => r.state === "go" && r.dest !== "back" && Wu(r, this.arm),
      );
    ((this.lift +=
      ((l ? 1.32 : 0) - this.lift) * (1 - Math.exp(-t * (l ? 12 : 3)))),
      vs.rotation.set(0, this.arm, this.lift),
      this.cratesTick(t),
      this.draw());
  }));
function qu(t) {
  ((rt.armT = t === "ship" ? 0 : -Math.PI),
    (rt.armHold = z + 0.5),
    (rt.gcue = { t: z, dest: t }),
    O.gate?.());
}
function Wu(t, e) {
  const o = Math.cos(e),
    n = -Math.sin(e),
    a = t.x - Mt,
    i = t.z - dt;
  if (a * a + i * i > 2.4) return !1;
  const l = D(a * o + i * n, 0.05, 0.95),
    r = a - o * l,
    c = i - n * l;
  return r * r + c * c < 0.36;
}
const Yn = (t, e, o) => {
  let n =
    ((((e - t + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) -
    Math.PI;
  return t + n * o;
};
((rt.rise = function (t, e, o) {
  const n = p.you;
  if (n < 0) {
    const h = this.spawn(t, e, o);
    h &&
      t === "queue" &&
      (h.q = this.W.filter((d) => d.dest === "queue" && d !== h).length);
    return;
  }
  const a = n % j,
    i = Math.floor(n / j),
    l = a + 0.5,
    r = -(i + 0.5),
    c = [
      ut(l - 0.24, r + 0.44),
      ut(l - 0.12, r + 0.76),
      ut(Mt, Math.min(-0.45, r + 0.9)),
      ut(Mt, -0.45),
    ];
  ((c.dd = ga(c)),
    (this.riser = { t0: z, dest: t, n: e, amt: o, path: c, cx: l, cz: r }),
    O.rise?.());
}),
  (rt.arrive = function (t) {
    t.dest === "ship"
      ? this.crate()
      : (t.dest === "back" || t.dest === "yard") && (xe = !0);
  }));
const Pl = (t) => (t * Math.PI * 2) / 1.05;
function Fl(t, e, o) {
  const n = t.path.dd,
    a = n[n.length - 1];
  return (
    (t.s = Math.min(a, t.s + e * o)),
    nn(t.path, n, t.s, st),
    nn(t.path, n, Math.min(a, t.s + 0.1), Nt),
    Nt.distanceToSquared(st) > 1e-6 &&
      (t.yaw = Yn(
        t.yaw,
        Math.atan2(Nt.x - st.x, Nt.z - st.z) + (t.back ? Math.PI : 0),
        1 - Math.exp(-o * 9),
      )),
    (t.x = st.x),
    (t.y = st.y),
    (t.z = st.z),
    t.s >= a
  );
}
const Qi = (...t) => ((t.dd = ga(t)), t),
  Hu = [
    [Mt + 0.5, dt - 0.48, -Math.PI / 2],
    [Mt + 0.5, dt - 1, -Math.PI / 2],
  ];
((rt.gcue = { t: -9, dest: "ship" }),
  (rt.lcue = -9),
  (rt.gateBots = function (t) {
    const e = z;
    (this.gb ||
      (this.gb = Hu.map(([o, n, a]) => ({
        x: o,
        z: n,
        hx: o,
        hz: n,
        ox: 0,
        oz: 0,
        yaw: a,
        mode: 0,
        v: 0,
      }))),
      this.gb.forEach((o, n) => {
        let a = -Math.PI / 2,
          i = 0;
        if (((o.v = 0), n === 0)) {
          const d = this.gcue;
          e - d.t < 0.9
            ? ((i = 9),
              (a =
                d.dest === "ship"
                  ? Math.atan2(F.x0 - o.hx, dt + 0.3 - o.hz)
                  : Math.atan2(Mt - 0.9 - o.hx, dt - o.hz)))
            : (a = -Math.PI / 2 + 0.3 * Math.sin(e * 0.37));
        } else if (e - this.lcue < 1.1)
          ((i = 9), (a = Math.atan2(Mt - o.hx, dt - o.hz)));
        else {
          const d = dt - [1, 0.8, 1.3][Math.floor(e / 5) % 3],
            m = d - o.hz,
            u = Math.min(Math.abs(m), t * 0.5);
          Math.abs(m) > 0.01 &&
            ((o.hz += Math.sign(m) * u),
            (i = 2),
            (o.v = 0.5),
            (a = m > 0 ? 0 : Math.PI));
        }
        let l = 0,
          r = 0;
        for (const d of this.W) {
          const m = o.hx - d.x,
            u = o.hz - d.z,
            g = Math.hypot(m, u);
          g < 0.55 &&
            g > 0.001 &&
            ((l += (m / g) * (0.55 - g)), (r += (u / g) * (0.55 - g)));
        }
        const c = Math.hypot(l, r);
        c > 0.32 && ((l *= 0.32 / c), (r *= 0.32 / c));
        const h = 1 - Math.exp(-t * 6);
        ((o.ox += (l - o.ox) * h),
          (o.oz += (r - o.oz) * h),
          (o.x = o.hx + o.ox),
          (o.z = o.hz + o.oz),
          (o.yaw = Yn(o.yaw, a, 1 - Math.exp(-t * (i === 2 ? 9 : 5)))),
          (o.mode = i));
      }));
  }));
const Zi = Qi(
    ut(vn, F.z0 + 0.26, F.y),
    ut(vn, on, F.y),
    ut(ae, on, F.y),
    ut(ae, ma - 0.15, F.y),
  ),
  Bs = Zi.dd[2],
  Ol = Zi.dd[3],
  zl = 0.53,
  Yu = 1 + Math.floor(Bs / zl + 0.05),
  o0 = 0.9,
  n0 = 0.8,
  Da = ut(ae, on - 0.36, F.y),
  tr = ut(ae + 0.45, on - 0.62, F.y),
  Ku = ut(ae, pl + 0.13, F.y);
((rt.dockBots = function (t, e) {
  const o = z;
  if (s.staff.dock !== 2) {
    if (this.db) {
      for (const a of this.crates)
        a.state === "carry" && ((a.state = "go"), (a.s = Math.max(a.s, Bs)));
      this.db = null;
    }
    return;
  }
  this.db ||
    (this.db = [
      { state: "wait", x: Da.x, y: Da.y, z: Da.z, yaw: 0 },
      { state: "idle", x: tr.x, y: tr.y, z: tr.z, yaw: -Math.PI / 2 },
    ].map((a) => ({
      ...a,
      s: 0,
      path: null,
      t0: 0,
      c: null,
      mode: 0,
      v: 0,
      lift: 0,
    })));
  const n = this.crates.find((a) => a.state === "q" && a.s >= Bs - 0.01);
  this.db.forEach((a, i) => {
    const l = this.db[1 - i];
    ((a.v = 0),
      a.state === "idle"
        ? ((a.mode = 0),
          (a.yaw = Yn(a.yaw, -Math.PI / 2, 1 - Math.exp(-t * 4))),
          ["toP", "wait", "grip"].includes(l.state) ||
            ((a.path = Qi(
              ut(a.x, a.z, a.y),
              ut(ae + 0.12, Da.z - 0.12, F.y),
              Da,
            )),
            (a.s = 0),
            (a.back = !1),
            (a.state = "toP")))
        : a.state === "toP"
          ? ((a.mode = 2), (a.v = 0.7), Fl(a, 0.7, t) && (a.state = "wait"))
          : a.state === "wait"
            ? ((a.mode = 0),
              (a.yaw = Yn(a.yaw, 0, 1 - Math.exp(-t * 6))),
              n &&
                e &&
                Math.abs(Yn(a.yaw, 0, 1) - a.yaw) < 0.15 &&
                ((n.state = "carry"),
                (a.c = n),
                (a.state = "grip"),
                (a.t0 = o)))
            : a.state === "grip"
              ? ((a.mode = 3),
                (a.lift = 0.05 * Bo(0.1, 0.9, (o - a.t0) / 0.35)),
                o - a.t0 > 0.35 &&
                  ((a.path = Qi(ut(a.x, a.z, a.y), Ku)),
                  (a.s = 0),
                  (a.state = "carry")))
              : a.state === "carry"
                ? ((a.mode = 3),
                  a.s < a.path.dd[1]
                    ? ((a.v = n0), Fl(a, n0, t))
                    : e && ((a.state = "drop"), (a.t0 = o)))
                : a.state === "drop"
                  ? ((a.mode = 3),
                    (a.lift = 0.05 * (1 - Bo(0, 1, (o - a.t0) / 0.3))),
                    o - a.t0 > 0.3 &&
                      (a.c && (a.c.done = !0),
                      (a.c = null),
                      (a.lift = 0),
                      (a.back = !1),
                      (a.path = Qi(
                        ut(a.x, a.z, a.y),
                        ut(ae + 0.45, pl - 0.05, F.y),
                        ut(ae + 0.45, on - 0.1, F.y),
                        tr,
                      )),
                      (a.s = 0),
                      (a.state = "back")))
                  : a.state === "back" &&
                    ((a.mode = 2),
                    (a.v = 0.75),
                    Fl(a, 0.75, t) && (a.state = "idle")));
  });
}),
  (rt.draw = function () {
    let t = 0;
    const e = Bl,
      o = Is() ? p.you : -1;
    if (o >= 0) {
      const n = o % j,
        a = Math.floor(o / j),
        i = n + 0.5,
        l = -(a + 0.5),
        [r, c] = Jf.bench.fix[0];
      if (this.riser) {
        const h = D((z - this.riser.t0) / 1.6, 0, 1),
          d = Ec(h),
          m = cs(i + r, i - 0.24, d),
          u = cs(l + c, l + 0.44, d),
          g = cs(Xi, kt, d) + Math.sin(d * Math.PI) * 0.18;
        (rn(
          e,
          t++,
          m,
          g,
          u,
          cs(Math.PI / 2, 0, Bo(0.1, 0.9, h)),
          7,
          h,
          0.1,
          h > 0.75 ? 0 : 2,
          -9,
          0,
        ),
          (this.benchBorn = this.riser.t0 + 1.5),
          z >= this.benchBorn &&
            rn(
              e,
              t++,
              i + r,
              Xi,
              l + c,
              Math.PI / 2,
              7,
              0,
              0.2,
              2,
              this.benchBorn,
              -0.02,
            ));
      } else
        rn(
          e,
          t++,
          i + r,
          Xi,
          l + c,
          Math.PI / 2,
          7,
          0,
          0.2,
          2,
          this.benchBorn || -9,
          -D(s.acc, 0.02, 0.999),
        );
    }
    for (const n of this.W) {
      if (t >= Ls) break;
      rn(
        e,
        t++,
        n.x,
        n.y,
        n.z,
        n.yaw,
        n.mode,
        n.mode === 2 ? Uu : 0,
        n.phase,
        0,
        n.t0,
        0,
      );
    }
    if (
      (s.staff.gate === 2 &&
        this.gb &&
        this.gb.forEach((n, a) => {
          t < Ls &&
            rn(
              e,
              t++,
              n.x,
              0,
              n.z,
              n.yaw,
              n.mode,
              n.mode === 2 ? Pl(n.v) : 0,
              a * 0.37 + 0.1,
              0,
              -9,
              0,
            );
        }),
      this.db &&
        this.db.forEach((n, a) => {
          t < Ls &&
            rn(
              e,
              t++,
              n.x,
              n.y,
              n.z,
              n.yaw,
              n.mode,
              n.v ? Pl(n.v) : 0,
              a * 0.41 + 0.2,
              0,
              -9,
              0,
            );
        }),
      s.staff.build)
    ) {
      const n = Me();
      for (let a = 0; a < s.sites.length && a < n && t < Ls; a++) {
        const i = s.sites[a].k,
          l = i % j,
          r = Math.floor(i / j),
          c = Kt(i),
          h = z / 3.6 + c * 7,
          d = Math.floor(h),
          m = h - d,
          u = l + 0.5 + (d % 2 ? 0.22 : -0.22),
          g = l + 0.5 + (d % 2 ? -0.22 : 0.22),
          b = -(r + 0.5) + 0.42;
        m < 0.22
          ? rn(
              e,
              t++,
              cs(g, u, m / 0.22),
              kt,
              b,
              u > g ? Math.PI / 2 : -Math.PI / 2,
              2,
              Pl(0.44 / (0.22 * 3.6)),
              c,
              0,
              -9,
              0,
            )
          : rn(
              e,
              t++,
              u,
              kt,
              b,
              Math.PI + (d % 3 === 1 ? 0 : (c - 0.5) * 0.4),
              d % 3 === 1 ? 6 : 1,
              0,
              Kt(i * 3.1),
              0,
              -9,
              0,
            );
      }
    }
    (_l(e, 0, t), (e.count = t));
  }),
  (rt.crate = function () {
    this.crates.filter((t) => t.state === "q").length >= Yu ||
      (this.crates.push({ s: 0, state: "q", t: z }), O.crate?.());
  }),
  (rt.cratesTick = function (t) {
    const e = z,
      o = Qe.find(
        (l) => l.state === "go" && l.slot === 0 && Math.abs(l.x - xs) < 0.3,
      );
    (s.staff.gate === 2 ? this.gateBots(t) : (this.gb = null),
      this.dockBots(t, o));
    const n = this.crates
      .filter((l) => l.state === "q")
      .sort((l, r) => r.s - l.s);
    let a = Bs + zl;
    for (const l of n) {
      const r = Math.min(Bs, a - zl);
      (l.s < r && (l.s = Math.min(r, l.s + o0 * t)), (a = l.s));
    }
    !this.db &&
      o &&
      e >= this.loadAt &&
      n[0] &&
      n[0].s >= Bs - 0.01 &&
      ((n[0].state = "go"), (this.loadAt = e + 0.8));
    for (const l of this.crates)
      l.state === "go" &&
        ((l.s = Math.min(l.s + o0 * t, o ? Ol : Ol - 0.55)),
        l.s >= Ol && (l.done = !0));
    let i = 0;
    for (const l of this.crates) {
      if (l.done) continue;
      let r = 1,
        c = 0,
        h = 0;
      if (l.state === "carry") {
        const d = this.db?.find((m) => m.c === l);
        if (!d) {
          l.state = "go";
          continue;
        }
        ((c = d.yaw),
          (h = -0.06 * (d.lift / 0.05)),
          st.set(
            d.x + Math.sin(d.yaw) * 0.36,
            d.y + d.lift,
            d.z + Math.cos(d.yaw) * 0.36,
          ));
      } else {
        nn(Zi, Zi.dd, l.s, st);
        const d = D((e - l.t) / 0.35, 0, 1);
        r = d < 1 ? 0.4 + 0.6 * Lc(d) + 0.12 * Math.sin(d * Math.PI) : 1;
      }
      (pi.set(h, c, 0, "YXZ"),
        Yi.setFromEuler(pi),
        Ki.compose(Kf.copy(st), Yi, Xf.set(r, r, r)),
        yl.setMatrixAt(i++, Ki));
    }
    ((this.crates = this.crates.filter((l) => !l.done)),
      (yl.count = i),
      (yl.instanceMatrix.needsUpdate = !0),
      W1(t));
  }));
const $n = {},
  Pa = (() => {
    const t = bt(),
      e = Fe,
      o = Ca,
      n = 1.62,
      a = 0.46,
      i = Math.hypot(a * 2, n);
    for (const r of [-a, a])
      for (const c of [-a, a]) t.box(e, r, n / 2, c, 0.026, n, 0.026);
    for (const r of [0.55, 1.1, n])
      for (const c of [-1, 1])
        t.box(e, 0, r, c * a, a * 2, 0.02, 0.02).box(
          e,
          c * a,
          r,
          0,
          0.02,
          0.02,
          a * 2,
        );
    for (const r of [-1, 1])
      t.box(e, 0, n / 2, r * a, 0.014, i, 0.014, {
        rz: r * Math.atan2(a * 2, n),
      }).box(e, r * a, n / 2, 0, 0.014, i, 0.014, {
        rx: r * Math.atan2(a * 2, n),
      });
    t.box(o, 0, 0.565, -a + 0.12, a * 1.9, 0.028, 0.2).box(
      o,
      0,
      1.115,
      a - 0.12,
      a * 1.9,
      0.028,
      0.2,
    );
    const l = Ll(t.geos(), La);
    return ((l.visible = !1), co.add(l), l);
  })();
for (const t of Q) {
  if (!t) continue;
  const e = bt();
  Cl[t.id](e);
  const o = Ll(e.geos(), La);
  ((o.castShadow = !1),
    (o.visible = !1),
    co.add(o),
    oo.push(o),
    ($n[t.id] = { mesh: o, list: [] }));
}
function Xu() {
  if (As) {
    As = !1;
    for (const a in $n) $n[a].list.length = 0;
    let o = 0;
    const n = Pa.userData.st;
    for (const a of s.sites) {
      $n[Q[a.ix].id].list.push(a);
      const i = a.k % j,
        l = Math.floor(a.k / j);
      (Do.makeTranslation(i + 0.5, kt, -(l + 0.5)),
        Pa.setMatrixAt(o, Do),
        n.setXYZW(o, 0, Kt(a.k * 0.37 + 1), 0, Nf[a.k]),
        o++);
    }
    ((Pa.count = o),
      (Pa.visible = o > 0),
      (Pa.instanceMatrix.needsUpdate = !0),
      (n.needsUpdate = !0));
    for (const a in $n) {
      const i = $n[a],
        l = i.mesh,
        r = At[a];
      ((l.count = i.list.length),
        (l.visible = l.count > 0),
        i.list.forEach((c, h) => {
          const d = c.k % j,
            m = Math.floor(c.k / j),
            u = r.kind === "parts" ? Vf(d, m, r) : 0;
          (yn.setFromAxisAngle(ps, u),
            Do.compose(J.set(d + 0.5, kt, -(m + 0.5)), yn, Uf),
            l.setMatrixAt(h, Do));
        }),
        (l.instanceMatrix.needsUpdate = !0));
    }
  }
  const t = Me(),
    e = new Set(s.sites.slice(0, t));
  for (const o in $n) {
    const n = $n[o];
    if (!n.list.length) continue;
    const a = n.mesh.userData.st;
    (n.list.forEach((i, l) => {
      a.setXYZW(
        l,
        0,
        Kt(i.k * 0.37 + 1),
        e.has(i) ? 2 + D(1 - i.left / i.T, 0.02, 1) : 2,
        -99,
      );
    }),
      (a.needsUpdate = !0));
  }
}
const er = new f.Group();
Gt.add(er);
let Fa = [],
  Oa = [];
const or = B("#6b6964", { roughness: 0.92 }),
  Gl = Vc("#4f6b55", { roughness: 0.5, clearcoat: 0.3 }),
  jl = B("#9a9a96", { roughness: 0.6, metalness: 0.3 }),
  nr = Rt("#3b4048", { roughness: 0.45 }),
  s0 = B("#d9d6cf", { roughness: 0.6 }),
  a0 = B("#8a5a3c", { roughness: 0.5 }),
  Uo = Rt("#8d939b", { roughness: 0.5, metalness: 0.6 }),
  Nl = {
    panel(t, e, o) {
      t.box(jl, e, 1.05, o, 0.12, 0.75, 0.55, { r: 0.02 })
        .box(nr, e + 0.07, 1.05, o, 0.02, 0.6, 0.4)
        .cyl(jl, e, 0.5, o + 0.18, 0.03, 0.03, 0.9, { seg: 6 });
    },
    xfmr(t, e, o) {
      t.box(or, e, 0.06, o, 1.6, 0.12, 1.5).box(Gl, e, 0.62, o, 1.15, 1, 1, {
        r: 0.03,
      });
      for (let n = 0; n < 6; n++)
        t.box(Gl, e - 0.45 + n * 0.18, 0.6, o + 0.55, 0.03, 0.7, 0.12);
      t.box(Gl, e, 1.14, o, 1.2, 0.05, 1.05);
    },
    sub(t, e, o) {
      t.box(B("#7c7a74", { roughness: 1 }), e, 0.04, o, 6, 0.08, 6);
      for (let n = 0; n <= 12; n++) {
        const a = (n / 12) * 6 - 3;
        t.cyl(Uo, e + a, 0.8, o - 3, 0.03, 0.03, 1.6, { seg: 5 })
          .cyl(Uo, e + a, 0.8, o + 3, 0.03, 0.03, 1.6, { seg: 5 })
          .cyl(Uo, e - 3, 0.8, o + a, 0.03, 0.03, 1.6, { seg: 5 })
          .cyl(Uo, e + 3, 0.8, o + a, 0.03, 0.03, 1.6, { seg: 5 });
      }
      for (const n of [0.4, 1.55])
        t.box(Uo, e, n, o - 3, 6, 0.03, 0.03)
          .box(Uo, e, n, o + 3, 6, 0.03, 0.03)
          .box(Uo, e - 3, n, o, 0.03, 0.03, 6)
          .box(Uo, e + 3, n, o, 0.03, 0.03, 6);
      for (let n = 0; n < 3; n++) {
        const a = e - 1.8 + n * 1.8;
        t.box(nr, a, 0.95, o + 0.6, 1.3, 1.7, 1.2, { r: 0.03 });
        for (let i = 0; i < 5; i++)
          t.box(nr, a - 0.5 + i * 0.25, 0.9, o + 1.35, 0.04, 1.3, 0.3);
        for (let i = 0; i < 3; i++) {
          const l = a - 0.4 + i * 0.4;
          t.cyl(a0, l, 2.15, o + 0.5, 0.07, 0.1, 0.7, { seg: 8 });
          for (let r = 0; r < 4; r++)
            t.cyl(a0, l, 1.9 + r * 0.15, o + 0.5, 0.14, 0.14, 0.04, {
              seg: 10,
            });
        }
      }
      for (const n of [-2.6, 2.6])
        t.box(Uo, e + n, 2.2, o - 1.6, 0.18, 4.4, 0.18);
      t.box(Uo, e, 4.3, o - 1.6, 5.4, 0.16, 0.16);
    },
    solar(t, e, o) {
      t.box(or, e, 0.04, o, 10.5, 0.08, 5.2);
      const n = Rt("#1d2a44", {
          roughness: 0.25,
          metalness: 0.4,
          clearcoat: 0.8,
        }),
        a = Rt("#9aa3ad", { roughness: 0.4 });
      for (let i = 0; i < 3; i++)
        for (let l = 0; l < 4; l++) {
          const r = e - 3.9 + l * 1.75,
            c = o - 1.7 + i * 1.3;
          t.box(a, r, 0.38, c, 0.05, 0.6, 0.05).box(
            n,
            r,
            0.66,
            c,
            1.6,
            0.04,
            0.95,
            { rx: -0.5 },
          );
        }
      for (let i = 0; i < 3; i++)
        t.box(
          B("#e9e6df", { roughness: 0.6 }),
          e + 3.6,
          0.55,
          o - 1.6 + i * 1.6,
          1.9,
          1,
          1,
        ).box(
          B("#3a3f47"),
          e + 3.6,
          0.58,
          o - 1.6 + i * 1.6 + 0.51,
          1.6,
          0.7,
          0.02,
        );
    },
    smr(t, e, o) {
      (t
        .box(or, e, 0.05, o, 12, 0.1, 11)
        .cyl(s0, e - 2.2, 2.3, o + 1, 2.4, 2.4, 4.6, { seg: 36 })
        .sph(s0, e - 2.2, 4.6, o + 1, 2.4, {
          seg: 36,
          seg2: 12,
          s: [1, 0.55, 1],
        }),
        t.box(B("#bdb8ae"), e + 2, 1.6, o + 2.6, 4.4, 3.2, 3));
      const n = [];
      for (let a = 0; a <= 14; a++) {
        const i = a / 14;
        n.push(
          new f.Vector2(3.2 - 1.4 * Math.sin(i * Math.PI * 0.82), i * 9.5),
        );
      }
      t.geo(
        B("#cfcac0", { roughness: 0.8, side: f.DoubleSide }),
        new f.LatheGeometry(n, 40),
        e + 2.5,
        0,
        o - 2.4,
      );
    },
    fusion(t, e, o) {
      (t
        .box(or, e, 0.05, o, 17, 0.1, 17)
        .cyl(Rt("#5b636e", { roughness: 0.4 }), e, 0.6, o, 7.2, 7.4, 1.2, {
          seg: 48,
        }),
        t.tor(
          Rt("#c8ced6", { roughness: 0.25, metalness: 1 }),
          e,
          2.4,
          o,
          4.4,
          1.1,
          { rx: Math.PI / 2, seg: 48, seg2: 16 },
        ));
      for (let n = 0; n < 16; n++) {
        const a = (n / 16) * Math.PI * 2;
        t.box(
          nr,
          e + Math.cos(a) * 4.4,
          2.4,
          o + Math.sin(a) * 4.4,
          0.5,
          2.8,
          1.1,
          { ry: -a },
        );
      }
      t.geo(
        be("#c4a8ff", 3.2),
        new f.TorusGeometry(4.4, 0.28, 10, 64).rotateX(Math.PI / 2),
        e,
        2.4,
        o,
      );
    },
  };
function Ju(t, e) {
  const o = gt(),
    n = vt(),
    a = Math.max(1.2, o * 0.08);
  return {
    xfmr: [a + e * 1.95, -n - 1.7],
    sub: [a + 2.5 + e * 7.4, -n - 7.2],
    solar: [a + 5 + (e % 3) * 11.5, -n - 14.5 - Math.floor(e / 3) * 6.2],
    smr: [a + 5 + (e % 3) * 14.5, -n - 30 - Math.floor(e / 3) * 13.5],
    fusion: [a + 8 + e * 19, -n - 56],
  }[t];
}
function Ul() {
  for (const a of Fa) (a.parent?.remove(a), a.geometry?.dispose());
  ((Fa = []), (Oa = []));
  const t = gt(),
    e = vt(),
    o = bt(),
    n = new f.Vector3(t + 0.12, 1.4, -Math.min(e, 4) / 2);
  if (!s.plants.panel && s.lvl <= 1) {
    const a = [
        new f.Vector3(-1.79, 0.42, -1.65),
        new f.Vector3(-1.62, 0.04, -1.55),
        new f.Vector3(-1, 0.04, -1.5),
        new f.Vector3(-0.4, 0.05, -1.45),
        new f.Vector3(-0.12, 0.32, -1.4),
        new f.Vector3(0.25, 0.12, -1.35),
        new f.Vector3(0.9, 0.1, -1.2),
      ],
      i = new f.Mesh(
        new f.TubeGeometry(new f.CatmullRomCurve3(a), 40, 0.03, 6),
        B("#e2731f", { roughness: 0.5 }),
      );
    ((i.castShadow = !0),
      er.add(i),
      Fa.push(i),
      Oa.push({ pts: a, kw: 1.8, c: "cord" }));
  } else {
    const a = t + 1.3,
      i = 1.4,
      l = new f.Vector3(a, Ci - 0.4, i),
      r = new f.Vector3(t + 0.14, 2, -0.6);
    o.cyl(B("#5b4a3a", { roughness: 0.9 }), a, Ci / 2, i, 0.08, 0.11, Ci, {
      seg: 7,
    })
      .box(B("#5b4a3a"), a, Ci - 0.3, i, 0.08, 0.08, 0.9)
      .box(jl, t + 0.2, 1.7, -0.6, 0.12, 0.4, 0.3);
    const c = [];
    for (let d = 0; d <= 10; d++) {
      const m = d / 10;
      c.push(
        new f.Vector3()
          .lerpVectors(l, r, m)
          .add(J.set(0, -Math.sin(m * Math.PI) * 0.25, 0)),
      );
    }
    const h = new f.Mesh(
      new f.TubeGeometry(new f.CatmullRomCurve3(c), 16, 0.02, 5),
      B("#15171b"),
    );
    (er.add(h), Fa.push(h), Oa.push({ pts: c, kw: 48, c: "street" }));
  }
  s.plants.panel && Nl.panel(o, t + 0.1, -1.1);
  for (const a of Po) {
    const i = s.plants[a.id] || 0;
    if (!(!Nl[a.id] || a.id === "panel"))
      for (let l = 0; l < i; l++) {
        const [r, c] = Ju(a.id, l);
        Nl[a.id](o, r, c);
        const h = D(r, 0.6, t - 0.6),
          d = new f.Vector3(
            r,
            { xfmr: 1.1, sub: 2.3, solar: 1.4, smr: 3.2, fusion: 3.6 }[a.id],
            c,
          ),
          m = [
            d,
            new f.Vector3(r, d.y + 0.5, c),
            new f.Vector3((r + h) / 2, Math.max(d.y, 1.6) + 0.9, (c - e) / 2),
            new f.Vector3(h, 1.3, -e - 0.12),
          ];
        Oa.push({ pts: m, kw: a.kw, c: a.id });
      }
  }
  Fa.push(...o.flush(er));
}
function i0() {
  const t = gt(),
    e = vt(),
    o = Math.max(t, e) * 0.85 + 14,
    n = t / 2 + 4,
    a = -e / 2 - 2;
  (Object.assign(zt.shadow.camera, {
    left: -o,
    right: o,
    top: o,
    bottom: -o,
    near: 1,
    far: o * 4 + 60,
  }),
    zt.shadow.camera.updateProjectionMatrix(),
    zt.target.position.set(n, 0, a),
    (X.sunR = o * 1.6 + 30),
    zt.position.copy(fs).multiplyScalar(X.sunR).add(zt.target.position));
  const i = D(Math.round((o * 90) / 512) * 512, E.shadowMin, E.shadow);
  zt.shadow.mapSize.x !== i &&
    (zt.shadow.mapSize.set(i, i),
    zt.shadow.map?.dispose(),
    (zt.shadow.map = null));
}
const Lt = { yaw: -0.58, pitch: 0.64 },
  A = {
    t: new f.Vector3(2, 0, -1.5),
    yaw: Lt.yaw,
    pitch: Lt.pitch,
    dist: 12,
    fit: 12,
    tGoal: new f.Vector3(2, 0, -1.5),
    fitGoal: 12,
  };
let Re = 1,
  ee = !1,
  Oe = !1,
  ge = !1,
  Vt = null;
const Kp = { on: !1 },
  Dt = ht.domElement,
  Kn = new Map();
let sr = 0,
  _s = null;
const Ds = new f.Raycaster(),
  r0 = new f.Vector2(),
  Xn = new f.Vector3(),
  ar = new f.Vector3(),
  l0 = new f.Vector3(),
  c0 = new f.Vector3();
function Ps(t) {
  const e = gt(),
    o = vt(),
    n = zo(),
    a = [
      [0, 0, 0],
      [e, 0, 0],
      [0, 0, -o],
      [e, 0, -o],
      [0, n, -o],
      [e, n, -o],
      [e, n, 0],
      [0, n, 0],
      [ba - 0.9 - s.lvl * 0.9, 0, Li - 0.4],
      [F.x0 + 0.9 + s.lvl * 0.5, 0, F.z1 - 0.3],
      [Mt, 2.3, dt],
    ],
    i = H.clone(),
    l = new f.Vector3(e / 2, n * 0.3, -o / 2);
  let r = 12;
  const c = Math.max(1, Xo.clientWidth),
    h = ee ? 0.84 : D((c - 2 * 370) / c, 0.26, 0.5),
    d = ee ? 0.26 : 0.5,
    m = 0,
    u = ee ? 0.3 : -0.1,
    g = Math.tan(f.MathUtils.degToRad(H.fov / 2));
  for (let b = 0; b < 12; b++) {
    const y = Math.cos(Lt.pitch);
    (i.position.set(
      l.x + Math.sin(Lt.yaw) * y * r,
      l.y + Math.sin(Lt.pitch) * r,
      l.z + Math.cos(Lt.yaw) * y * r,
    ),
      i.lookAt(l),
      i.updateMatrixWorld());
    let w = 9,
      x = -9,
      M = 9,
      T = -9;
    for (const S of a)
      (Xn.set(...S).project(i),
        (w = Math.min(w, Xn.x)),
        (x = Math.max(x, Xn.x)),
        (M = Math.min(M, Xn.y)),
        (T = Math.max(T, Xn.y)));
    (l0.setFromMatrixColumn(i.matrixWorld, 0),
      c0.setFromMatrixColumn(i.matrixWorld, 1));
    const k = i.position.distanceTo(l);
    (l
      .addScaledVector(l0, ((w + x) / 2 - m) * k * g * H.aspect)
      .addScaledVector(c0, ((M + T) / 2 - u) * k * g),
      (l.y = Math.max(l.y, 0)),
      (r *= D(Math.max((x - w) / 2 / h, (T - M) / 2 / d), 0.55, 1.8)));
  }
  if (!(!isFinite(r) || !isFinite(l.x + l.y + l.z))) {
    {
      const b = Math.cos(Lt.pitch),
        y = ar.set(
          l.x + Math.sin(Lt.yaw) * b * r,
          l.y + Math.sin(Lt.pitch) * r,
          l.z + Math.cos(Lt.yaw) * b * r,
        ),
        w = Xn.subVectors(l, y).normalize(),
        x = n * 0.25;
      if (w.y < -0.001) {
        const M = (x - y.y) / w.y;
        (l.copy(y).addScaledVector(w, M), (r = M));
      }
    }
    (A.tGoal.copy(l),
      (A.fitGoal = Math.max(5, r)),
      t && ((A.fit = A.fitGoal), A.t.copy(A.tGoal)));
  }
}
function ir() {
  (Qs(!1), (Oe = !1), (Re = 1), (A.yaw = Lt.yaw), (A.pitch = Lt.pitch), Ps(!1));
}
function Vl(t, e) {
  const o =
      (H.position.distanceTo(A.t) *
        2 *
        Math.tan(f.MathUtils.degToRad(H.fov / 2))) /
      Math.max(Xo.clientHeight, 1),
    n = Math.cos(A.yaw),
    a = Math.sin(A.yaw);
  ((Oe = !0),
    (A.tGoal.x -= n * t * o),
    (A.tGoal.z += a * t * o),
    (A.tGoal.x -= (a * e * o) / Math.max(Math.sin(A.pitch), 0.3)),
    (A.tGoal.z -= (n * e * o) / Math.max(Math.sin(A.pitch), 0.3)));
  const i = gt(),
    l = vt(),
    r = 8 + Math.max(i, l) * 0.6;
  ((A.tGoal.x = D(A.tGoal.x, -r * 0.6, i + r)),
    (A.tGoal.z = D(A.tGoal.z, -l - r, r * 0.5)),
    A.t.copy(A.tGoal));
}
const Xp = new f.Vector3();
function ql(t, e) {
  const o = Oe || ge ? 0 : Math.sin(t / 9) * 0.02;
  if (
    (isFinite(A.fit) || (A.fit = isFinite(A.fitGoal) ? A.fitGoal : 12),
    isFinite(A.t.x + A.t.y + A.t.z) ||
      A.t.copy(
        isFinite(A.tGoal.x + A.tGoal.y + A.tGoal.z)
          ? A.tGoal
          : Xn.set(2, 0.4, -1.5),
      ),
    Vt && !Oe && !ge)
  ) {
    Vt.at == null && (Vt.at = t);
    const h = Ec(Bo(1.1, 3.9, t - Vt.at));
    ((A.fit = cs(Vt.d0, A.fitGoal, h)),
      A.t.lerpVectors(Vt.p0, A.tGoal, h),
      Ge(
        Ar,
        ar.set(pt[pt.length - 1][0] * 0.62, 0.4, -pt[pt.length - 1][1] * 0.55),
        "Your gigafactory",
        "7 million sq ft",
        "#7fe3ff",
        h < 0.35,
      ),
      h >= 1 && ((Vt = null), Ge(Ar, ar, "", "", "", !1)));
  } else
    (Vt && ((Vt = null), Ge(Ar, ar, "", "", "", !1)),
      (A.fit += (A.fitGoal - A.fit) * (1 - Math.exp(-e * 2.2))),
      Oe || A.t.lerp(A.tGoal, 1 - Math.exp(-e * 2.2)));
  const n = A.fit * Re,
    a = A.yaw + o,
    i = D(A.pitch, 0.18, 1.42),
    l = Math.cos(i);
  (H.position.set(
    A.t.x + Math.sin(a) * l * n,
    Math.max(1.2, A.t.y + Math.sin(i) * n),
    A.t.z + Math.cos(a) * l * n,
  ),
    H.lookAt(A.t),
    da.position.copy(H.position));
  const r = H.position.distanceTo(A.t),
    c =
      Math.max(4, Math.hypot(gt(), vt()) * 0.42) *
      E.focalBand *
      (ge && je?.r ? je.r : 1);
  ((bn.u.focus.value = r),
    (bn.u.range.value = c),
    bn.u.cocScale.value.set(E.apertureNear, E.aperture),
    qr.copy(A.t),
    (Zt.fog.density =
      0.0016 * E.fog * X.fogK * D(30 / Math.max(r, 8), 0.25, 1.6)));
}
const Fs = new Set();
(addEventListener("keyup", (t) => Fs.delete(t.key.toLowerCase())),
  addEventListener("blur", () => Fs.clear()));
function Qu(t) {
  if (!Fs.size) return;
  const e = (Fs.has("shift") ? 2.4 : 1) * t,
    o = (...i) => i.some((l) => Fs.has(l));
  let n = 0,
    a = 0;
  (o("a", "arrowleft") && (n += 1),
    o("d", "arrowright") && (n -= 1),
    o("w", "arrowup") && (a += 1),
    o("s", "arrowdown") && (a -= 1),
    (n || a) && Vl(n * e * 520, a * e * 520),
    o("q") && (A.yaw += e * 1.1),
    o("e") && (A.yaw -= e * 1.1),
    o("=", "+") && (Re = D(Re * Math.exp(-e * 1.3), 0.25, 2.4)),
    o("-", "_") && (Re = D(Re * Math.exp(e * 1.3), 0.25, 2.4)),
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
    ) && ((Oe = !0), ge && Qs(!1)));
}
let Ht = null,
  jt = null;
const f0 = [],
  Jn = (t, e, o = {}) => {
    ((t.userData.hk = { kind: e, ...o }), f0.push(t));
  },
  Zu = (t) => {
    let e = t;
    for (; e.parent; e = e.parent) if (!e.visible) return !1;
    return e === Zt;
  };
function rr(t) {
  const e = Dt.getBoundingClientRect();
  (r0.set(
    ((t.clientX - e.left) / e.width) * 2 - 1,
    -(((t.clientY - e.top) / e.height) * 2 - 1),
  ),
    Ds.setFromCamera(r0, H));
}
const za = new f.Mesh(
  new f.BoxGeometry(1.05, 0.42, 0.5),
  new f.MeshBasicMaterial({ visible: !1 }),
);
Gt.add(za);
const Wl = new f.Mesh(
  new f.BoxGeometry(1.9, 2.4, 0.5),
  new f.MeshBasicMaterial({ visible: !1 }),
);
(Wl.position.set(Mt, 1.2, dt), Gt.add(Wl));
function h0() {
  const t = Ds.intersectObjects(
    f0.filter((e) => e.visible && Zu(e)),
    !1,
  )[0];
  return t
    ? { ...t.object.userData.hk, point: t.point, dist: t.distance }
    : null;
}
function d0() {
  const t = pt[s.lvl + 1];
  if (!t || fn() || Ht) return null;
  const e = Ds.ray.origin,
    o = Ds.ray.direction;
  if (o.y > -1e-5) return null;
  const n = -e.y / o.y,
    a = e.x + o.x * n,
    i = e.z + o.z * n;
  return a < 0 || a > t[0] || i > 0 || i < -t[1] || (a < gt() && i > -vt())
    ? null
    : t;
}
const lr = (t) => {
  for (const e of vl) e.visible = t;
};
function Ga() {
  const t = Ds.ray.origin,
    e = Ds.ray.direction;
  if (Math.abs(e.y) < 1e-5) return null;
  const o = (kt - t.y) / e.y;
  if (o < 0) return null;
  const n = t.x + e.x * o,
    a = t.z + e.z * o,
    i = Math.floor(n),
    l = Math.floor(-a);
  return i < 0 || l < 0 || i >= gt() || l >= vt()
    ? null
    : { i, j: l, k: _t(i, l) };
}
let cr = 0.06;
function t1(t) {
  let e = 0;
  for (let o = 0; o < Bt; o++) s.cells[o] === t.ix && e++;
  for (const o of s.sites) o.ix === t.ix && e++;
  return e;
}
const To = (t) =>
  t.kind === "station" ? Math.round(t.cost * (1 + cr * t1(t))) : t.cost;
function Os(t, e) {
  if (ie[e]) return null;
  const o = Q[s.cells[e]];
  return o
    ? o.kind !== t.kind || o.ix >= t.ix
      ? null
      : Math.max(0, To(t) - Math.round(o.cost * 0.5))
    : To(t);
}
const $t = (t) => t.gen <= s.gen;
function Qn(t, e, o) {
  const n = Os(t, e);
  if (n == null || !$t(t)) return "no";
  if (s.cash < n) return "cash";
  const a = s.cells[e];
  ((s.cash -= n), (s.cells[e] = 0), (kn[e] = -99));
  const i = tf[t.id] || 5;
  return (
    s.sites.push({ k: e, ix: t.ix, was: a, left: i, T: i, paid: n }),
    (ie[e] = t.ix),
    (Nf[e] = z),
    (As = !0),
    a || (s.seen["placed_" + t.id] = 1),
    (p.dirty = !0),
    o || O.place(t.kind),
    "ok"
  );
}
function u0(t) {
  const e = s.sites.find((o) => o.k === t);
  e &&
    ((s.sites = s.sites.filter((o) => o !== e)),
    (ie[t] = 0),
    (s.cells[t] = e.was || 0),
    e.was && (kn[t] = z),
    (s.cash += e.paid),
    (As = !0),
    (Ke = !0),
    (p.dirty = !0),
    O.sell(),
    Us(t, "+" + K(e.paid), "a"),
    No === t && ze(-1));
}
const fr = () => gt() * vt() - p.stations - p.cells - s.sites.length,
  p0 = 0.5,
  hr = (t) =>
    Math.max(
      100,
      Math.round(
        Math.max(t.paid || 0, Q[t.ix].cost) * p0 * D(t.left / t.T, 0, 1),
      ),
    );
function e1(t) {
  const e = s.sites.find((n) => n.k === t);
  if (!e) return;
  const o = hr(e);
  if (s.cash < o) {
    (xt("Not enough money to finish it now"), O.no());
    return;
  }
  ((s.cash -= o), (s.stats.rushed = (s.stats.rushed || 0) + 1), $i(e), uo());
}
function o1() {
  if (!s.sites.length) return;
  const t = s.sites.reduce((e, o) => e + hr(o), 0);
  if (s.cash < t) {
    (xt(`Finishing all of them takes ${K(t)}`), O.no());
    return;
  }
  ((s.cash -= t), (s.stats.rushed = (s.stats.rushed || 0) + s.sites.length));
  for (const e of [...s.sites]) $i(e);
  uo();
}
const g0 = (t) =>
  Math.max(100, Math.round(pt[t.n][2] * p0 * D(t.left / t.T, 0, 1)));
function n1() {
  const t = s.proj.find((o) => o.kind === "floor");
  if (!t) return;
  const e = g0(t);
  if (s.cash < e) {
    (xt("Not enough money to finish it now"), O.no());
    return;
  }
  ((s.cash -= e),
    (s.stats.rushed = (s.stats.rushed || 0) + 1),
    (t.left = 0),
    cl(0),
    (Jt = !0));
}
function Hl(t) {
  if (ie[t]) {
    u0(t);
    return;
  }
  const e = Q[s.cells[t]];
  e &&
    ((s.cash += Math.round(e.cost * 0.5)),
    (s.cells[t] = 0),
    (kn[t] = -99),
    (p.dirty = !0),
    O.sell(),
    Us(t, "+" + K(Math.round(e.cost * 0.5)), "a"),
    No === t && ze(-1));
}
function dr(t, e = 0) {
  return Q.filter((o) => o && o.kind === t && $t(o) && o.cls >= e).at(-1);
}
function zs(t) {
  if (!t) return -1;
  const e = gt(),
    o = vt();
  let n = -1,
    a = -1e9;
  for (let i = 0; i < o; i++)
    for (let l = 0; l < e; l++) {
      const r = _t(l, i);
      if (s.cells[r] || ie[r]) continue;
      let c = 0;
      if (t.kind === "station") {
        const h = Gs(t) * wo;
        let d = 0;
        for (let m = -2; m <= 2; m++)
          for (let u = -2; u <= 2; u++) {
            const g = l + u,
              b = i + m;
            if (g < 0 || b < 0 || g >= e || b >= o) continue;
            const y = _t(g, b),
              w = Q[s.cells[y]];
            w?.kind === "parts" &&
              w.cls >= t.cls &&
              Math.max(Math.abs(u), Math.abs(m)) <= w.range &&
              (d += Fn[y]);
          }
        c =
          (d >= h ? 100 : (d / h) * 60) -
          i * 0.6 -
          Math.abs(l + 0.5 - Mt) * 0.2;
      } else {
        let h = 0;
        for (let d = -t.range; d <= t.range; d++)
          for (let m = -t.range; m <= t.range; m++) {
            const u = l + m,
              g = i + d;
            if (u < 0 || g < 0 || u >= e || g >= o) continue;
            const b = _t(u, g),
              y = Q[s.cells[b]];
            y?.kind === "station" &&
              y.cls <= t.cls &&
              (h +=
                (ao[b] - Pn[b]) * (1 + y.cls) +
                (ao[b] < 1e-9 ? Gs(y) * wo * 0.25 : 0));
          }
        c = h - i * 0.01 - l * 0.005;
      }
      c > a && ((a = c), (n = r));
    }
  return a > 0 || t.kind === "station" ? n : -1;
}
function ur(t, e) {
  const o = e % j,
    n = Math.floor(e / j),
    a = gt(),
    i = vt();
  let l = 0,
    r = !1;
  for (let c = -2; c <= 2; c++)
    for (let h = -2; h <= 2; h++) {
      if (!h && !c) continue;
      const d = o + h,
        m = n + c;
      if (d < 0 || m < 0 || d >= a || m >= i) continue;
      const u = _t(d, m),
        g = Q[s.cells[u]];
      g?.kind !== "parts" ||
        Math.max(Math.abs(h), Math.abs(c)) > g.range ||
        (g.cls >= t.cls ? (l += Fn[u]) : (r = !0));
    }
  return { f: D(l / (Gs(t) * wo), 0, 1), wrong: r };
}
const ja = v("#tip");
let Na = null,
  ho = null,
  Zn = null,
  ln = null,
  Rn = null;
function ts(t, e, o) {
  ((ja.innerHTML = o),
    (ja.style.left = t + "px"),
    (ja.style.top = e + "px"),
    ja.classList.add("on"));
}
function es() {
  ja.classList.remove("on");
}
function m0(t) {
  const e = Qe[t],
    o = e && e.m && s.trucks.includes(e.m) ? e.m : null;
  if (!o) return "<b>A truck</b> \xB7 on its way";
  const n = o.n * p.price * (o.rush ? 2 : 1);
  return o.got >= o.n
    ? `<b>${o.rush ? "Rush order" : "Truck"} loaded</b> \xB7 ${G(o.n)} robots \xB7 click to sign for it \xB7 +${K(n)}`
    : `<b>${o.rush ? "Rush order" : "An order"}</b> \xB7 ${G(o.got)} of ${G(o.n)} robots aboard \xB7 pays ${K(n)}`;
}
function b0(t) {
  const e = s.sites.find((a) => a.k === t);
  if (!e) return "";
  const o = s.sites.indexOf(e),
    n = Me();
  return (
    `<b>${Q[e.ix].name}</b> \xB7 ` +
    (o < n
      ? `being built \xB7 ${Math.round((1 - e.left / e.T) * 100)}% \xB7 ${Math.max(1, Math.ceil(e.left / ys()))} days to go`
      : `waiting for a crew (${o - n + 1} in line)`)
  );
}
function s1(t) {
  if (ie[t]) return b0(t);
  const e = Q[s.cells[t]];
  if (!e) return "";
  if (e.kind === "station") {
    const n = io[t],
      a = t === p.you ? 1 : 0;
    return pe[t]
      ? `<b>${e.name}</b> \xB7 <span class="r">jammed</span> \xB7 click to fix it`
      : `<b>${e.name}</b> \xB7 crew ${bs[t] + a}/${e.crew} \xB7 ${Xe((ao[t] / wo) * n * p.brown)}` +
          (n < 0.98
            ? ` \xB7 <span class="r">${Math.round(n * 100)}% of its actuators</span>`
            : bs[t] + a < e.crew
              ? ' \xB7 <span class="r">short of crew</span>'
              : ' \xB7 <span class="g">running</span>');
  }
  const o = e.supply * Ct.parts;
  return `<b>${e.name}</b> \xB7 ${G(Fo[t])} of ${G(o)} actuators a day used`;
}
const y0 = () => {
  const t = h0();
  return Ht && t && t.kind !== "link" && Ga() ? null : t;
};
function x0(t) {
  (rr(t), (Rn = t), lr(!1));
  const e = y0(),
    o = e?.kind === "link" ? e.L : null;
  if (
    (o !== Na && (Na?.over(!1), o?.over(!0), (Na = o)),
    (tt.hotT = e?.kind === "board" ? 1 : 0),
    ks !== (e?.kind === "gate") && ((ks = e?.kind === "gate"), Ii()),
    e?.kind === "board")
  ) {
    const i = de.billboard[Ef()];
    (es(),
      i.kind === "game" || i.kind === "goal"
        ? (Rs(null),
          ts(
            t.clientX,
            t.clientY,
            "<b>A Nation of Robots</b> \xB7 the game you are playing",
          ))
        : Rs(i, t.clientX, t.clientY),
      (Dt.style.cursor = i.url ? "pointer" : ""));
    return;
  }
  Rs(null);
  const n = e && e.kind !== "bench" ? null : Ga(),
    a = n ? n.k : -1;
  if ((a !== fo && ((fo = a), (Ke = !0)), e && !(e.kind === "bench" && Ht))) {
    ((Dt.style.cursor = "pointer"),
      ts(
        t.clientX,
        t.clientY,
        e.kind === "link"
          ? "<b>@RYANSAEL</b> on X"
          : e.kind === "truck"
            ? m0(e.ti)
            : e.kind === "bench"
              ? s.built < 1
                ? `<b>Your first robot</b> \xB7 click to fit a part \xB7 ${Math.floor(D(s.acc, 0, 1) * 100)}%`
                : pe[p.you]
                  ? '<b>Workbench</b> \xB7 <span class="r">jammed</span> \xB7 click to fix it'
                  : "<b>Workbench</b> \xB7 click to help build the next one"
              : e.kind === "gate"
                ? s.ready >= 1 && s.chose && s.staff.gate !== 2
                  ? `<b>The gate</b> \xB7 ${G(Math.floor(s.ready))} waiting \xB7 click to send them through`
                  : `<b>The gate</b> \xB7 keep ${br()}%, ship ${100 - br()}% \xB7 click to change`
                : e.kind === "yard"
                  ? `<b>The yard</b> \xB7 ${G(p.gym)} robots practising for brain v${Math.min(s.gen + 2, 8)}`
                  : "",
      ));
    return;
  }
  if (!n) {
    const i = e ? null : d0();
    if ((lr(!!i), i)) {
      ((Dt.style.cursor = "pointer"),
        ts(
          t.clientX,
          t.clientY,
          `<b>Expand to ${po(i[3]) + " " + i[3].toLowerCase()}</b> \xB7 ${i[0]} by ${i[1]} tiles \xB7 ${K(i[2])}${s.cash < i[2] ? ' \xB7 <span class="r">not enough money</span>' : " \xB7 click"}`,
        ));
      return;
    }
    ((Dt.style.cursor = ""), es());
    return;
  }
  if (Ht) {
    const i = At[Ht],
      l = Os(i, n.k);
    if (
      ((Dt.style.cursor =
        l == null ? (s.cells[n.k] ? "pointer" : "") : "crosshair"),
      l == null)
    )
      ts(
        t.clientX,
        t.clientY,
        ie[n.k]
          ? b0(n.k)
          : s.cells[n.k]
            ? "Occupied \xB7 click it to upgrade or sell"
            : "",
      );
    else {
      let r = `<b>${i.name}</b> \xB7 ${K(l)}`;
      if ((s.cells[n.k] && (r += " (trade-in)"), i.kind === "station")) {
        const c = ur(i, n.k);
        ((r +=
          c.f >= 0.98
            ? ' \xB7 <span class="g">fed here</span>'
            : c.wrong
              ? ` \xB7 <span class="r">needs ${wi[i.cls]}</span>`
              : ` \xB7 <span class="r">${Math.round(c.f * 100)}% fed here</span>`),
          (r += ` \xB7 crew of ${i.crew}`));
      } else
        r += ` \xB7 ${G(i.supply * Ct.parts)} actuators a day ${i.range > 1 ? "two tiles out" : "round it"}`;
      (!s.cells[n.k] &&
        p.draw + i.kw > p.cap &&
        (r += ` \xB7 <span class="r">over your ${Yt(p.cap)} of power</span>`),
        s.cash < l && (r += ' \xB7 <span class="r">not enough money</span>'),
        ts(t.clientX, t.clientY, r));
    }
  } else {
    Dt.style.cursor = s.cells[n.k] || ie[n.k] ? "pointer" : "";
    const i = s1(n.k);
    i ? ts(t.clientX, t.clientY, i) : es();
  }
}
(Dt.addEventListener("contextmenu", (t) => t.preventDefault()),
  Dt.addEventListener("pointerleave", () => lr(!1)),
  Dt.addEventListener("pointerleave", () => {
    (Na?.over(!1),
      (Na = null),
      es(),
      Rs(null),
      (tt.hotT = 0),
      (fo = -1),
      (Ke = !0),
      (Rn = null),
      ks && ((ks = !1), Ii()));
  }),
  Dt.addEventListener("pointerdown", (t) => {
    O.wake();
    try {
      Dt.setPointerCapture(t.pointerId);
    } catch {}
    if (
      (es(),
      Kn.set(t.pointerId, [t.clientX, t.clientY, t.button === 2 || t.shiftKey]),
      (_s = null),
      t.button !== 0 || t.shiftKey || Kn.size !== 1)
    ) {
      ((ho = null), (jt = null));
      return;
    }
    (rr(t),
      (Zn = y0()),
      Zn?.kind === "bench" && Ht && (Zn = null),
      (ln = Zn ? null : Ga()),
      (Yl = Zn || ln ? null : d0()),
      (ho = [t.clientX, t.clientY, performance.now()]),
      Ht && ln && (jt = { i0: ln.i, j0: ln.j, i1: ln.i, j1: ln.j }));
  }),
  Dt.addEventListener("pointermove", (t) => {
    const e = Kn.get(t.pointerId);
    if (!e) {
      x0(t);
      return;
    }
    const o = t.clientX - e[0],
      n = t.clientY - e[1];
    if (((e[0] = t.clientX), (e[1] = t.clientY), jt)) {
      rr(t);
      const a = Ga();
      (a && ((jt.i1 = a.i), (jt.j1 = a.j)), (Rn = t));
      return;
    }
    if (
      (ho &&
        Math.hypot(t.clientX - ho[0], t.clientY - ho[1]) > 6 &&
        (ho = null),
      !ho)
    ) {
      if (((Oe = !0), ge && Qs(!1), Kn.size === 2)) {
        const [a, i] = [...Kn.values()],
          l = Math.hypot(a[0] - i[0], a[1] - i[1]),
          r = [(a[0] + i[0]) / 2, (a[1] + i[1]) / 2];
        (sr && (Re = D((Re * sr) / l, 0.25, 2.4)),
          (sr = l),
          _s && Vl(r[0] - _s[0], r[1] - _s[1]),
          (_s = r));
        return;
      }
      e[2]
        ? Vl(o, n)
        : ((A.yaw -= o * 0.004),
          (A.pitch = D(A.pitch + n * 0.003, 0.18, 1.42)));
    }
  }));
let Yl = null;
const w0 = (t) => {
  const e = jt;
  (e && (e.i0 !== e.i1 || e.j0 !== e.j1 || !ho)
    ? (i1(e), (jt = null))
    : ho && Kn.size === 1 && performance.now() - ho[2] < 500
      ? ((jt = null), a1(Zn, ln))
      : (jt = null),
    (ho = null),
    (Zn = null),
    (ln = null),
    Kn.delete(t.pointerId),
    (sr = 0),
    (_s = null));
};
(Dt.addEventListener("pointerup", w0),
  Dt.addEventListener("pointercancel", (t) => {
    ((ho = null), (jt = null), w0(t));
  }),
  Dt.addEventListener(
    "wheel",
    (t) => {
      (t.preventDefault(),
        (Oe = !0),
        ge && Qs(!1),
        (Re = D(
          Re * Math.exp(t.deltaY * (t.ctrlKey ? 0.01 : 0.0015)),
          0.25,
          2.4,
        )));
    },
    { passive: !1 },
  ),
  Dt.addEventListener("dblclick", (t) => {
    (rr(t), !h0() && !Ga() && ir());
  }));
const v0 = [0, 0.25, 0.5, 0.75, 1];
function a1(t, e) {
  if (t) {
    if (t.kind === "link") window.open(mn, "_blank", "noopener");
    else if (t.kind === "bench") pe[p.you] ? lf(p.you, "you") : qa();
    else if (t.kind === "gate") {
      if (!s.chose && s.built > 0) {
        xt(
          "Your first robot is waiting: keep it or ship it, in the box top left",
        );
        return;
      }
      if (s.ready >= 1 && s.staff.gate !== 2) {
        jn("you");
        return;
      }
      const o = v0.findIndex((n) => n > s.split + 0.01);
      (qo(o < 0 ? 0 : v0[o], "gate"), O.tick());
    } else if (t.kind === "board") {
      const o = de.billboard[Ef()];
      if (
        matchMedia("(pointer:coarse)").matches &&
        o.kind === "rent" &&
        (tt.tapId !== o.id || z - tt.tapAt > 5)
      ) {
        ((tt.tapId = o.id),
          (tt.tapAt = z),
          Rs(o, innerWidth / 2 - 170, 90),
          setTimeout(() => {
            z - tt.tapAt > 4.5 && Rs(null);
          }, 5200));
        return;
      }
      if (o.url && (window.open(o.url, "_blank", "noopener"), window.umami))
        try {
          umami.track("robots-billboard", { face: o.id });
        } catch {}
    } else
      t.kind === "truck" && (Gn("you") || xt(m0(t.ti).replace(/<[^>]+>/g, "")));
    return;
  }
  if (!e) {
    Ht ? Vo(null) : Yl ? p1(Yl) : ze(-1);
    return;
  }
  if (Ht) {
    const o = At[Ht],
      n = Qn(o, e.k);
    n === "cash"
      ? (xt(`Not enough money for ${po(o.name)} ${o.name.toLowerCase()}`),
        O.no())
      : n === "no"
        ? (s.cells[e.k] || ie[e.k]) && (Vo(null), ze(e.k))
        : uo();
    return;
  }
  if (pe[e.k]) {
    lf(e.k, "you");
    return;
  }
  if (e.k === p.you && Is()) {
    qa();
    return;
  }
  ze(s.cells[e.k] || ie[e.k] ? e.k : -1);
}
function i1(t) {
  const e = At[Ht];
  if (!e) return;
  let o = 0,
    n = !1;
  const a = Math.min(t.i0, t.i1),
    i = Math.max(t.i0, t.i1),
    l = Math.min(t.j0, t.j1),
    r = Math.max(t.j0, t.j1);
  for (let c = l; c <= r; c++)
    for (let h = a; h <= i; h++) {
      const d = _t(h, c);
      if (Os(e, d) == null) continue;
      const m = Qn(e, d, !0);
      m === "ok" ? o++ : m === "cash" && (n = !0);
    }
  (o && (O.place(e.kind, o), uo()),
    n &&
      xt(
        o
          ? `Placed ${o}: the money ran out`
          : `Not enough money for ${po(e.name)} ${e.name.toLowerCase()}`,
      ));
}
function uo() {
  (ke(), Ro(), Xt(), hh(), (Jt = !0));
}
function ze(t) {
  ((No = t), (Ke = !0));
  const e = v("#pop");
  if (t < 0) {
    e.hidden = !0;
    return;
  }
  ((e.hidden = !1), Kl());
}
function Kl() {
  const t = No;
  if (ie[t]) {
    const i = s.sites.find((m) => m.k === t);
    if (!i) {
      ze(-1);
      return;
    }
    const l = Q[i.ix],
      r = s.sites.indexOf(i),
      c = Me();
    ((v("#pop-n").textContent = l.name),
      (v("#pop-k").textContent = "being built"),
      (v("#pop-s").innerHTML =
        r < c
          ? `<b>${Math.round((1 - i.left / i.T) * 100)}%</b> built \xB7 <b>${Math.max(1, Math.ceil(i.left / ys()))} days</b> to go.<br>${l.kind === "station" ? "It starts building robots the moment it is done." : "It starts making actuators the moment it is done."} Or pay to finish it now.`
          : `Waiting for a crew: <b>${r - c + 1}</b> in line. You have ${qt(c, "building crew")}${Je() ? ", and can hire more in Staff" : ""}.`));
    const h = v("#pop-up"),
      d = hr(i);
    ((h.disabled = !1),
      (h.textContent = `Finish \xB7 ${K(d)}`),
      (h.title = "Pay to finish it now"),
      h.classList.toggle("poor", s.cash < d),
      (h.onclick = () => e1(t)),
      (v("#pop-sell").textContent = "Cancel \xB7 " + K(i.paid)),
      (v("#pop-sell").onclick = () => {
        (u0(t), uo());
      }));
    return;
  }
  const e = Q[s.cells[t]];
  if (!e) {
    ze(-1);
    return;
  }
  ((v("#pop-n").textContent = e.name),
    (v("#pop-k").textContent =
      e.kind === "station" ? `crew of ${e.crew}` : "actuators"));
  let o;
  if (e.kind === "station") {
    const i = io[t],
      l = t === p.you ? 1 : 0,
      r = bs[t] + l,
      c = (ao[t] / wo) * i * p.brown;
    o =
      `Makes <b>${Xe(c)}</b> \xB7 draws <b>${Yt(e.kw * Ct.kw)}</b><br>Crew <b>${r} of ${e.crew}</b>${l ? " (you are one of them)" : ""}. ` +
      (r < e.crew
        ? '<span class="r">Short of crew: keep more robots.</span> '
        : "") +
      (i < 0.98
        ? `<span class="r">Only ${Math.round(i * 100)}% of the actuators it needs.</span> ` +
          (ur(e, t).wrong
            ? `It takes ${wi[e.cls]} or better.`
            : "Put an actuator cell next to it.")
        : r >= e.crew
          ? '<span class="g">Running at full speed.</span>'
          : "");
  } else {
    const i = e.supply * Ct.parts;
    o = `Makes <b>${G(i)}</b> actuators a day for the stations ${e.range > 1 ? "two tiles out" : "round it"}.<br>Using <b>${G(Fo[t])}</b> (${Math.round((Fo[t] / i) * 100)}%), enough for ${Xe(Fo[t] / wo)}.`;
  }
  v("#pop-s").innerHTML = o;
  const n = dr(e.kind, 0),
    a = v("#pop-up");
  if ((a.classList.remove("poor"), n && n.ix > e.ix)) {
    const i = Os(n, t) ?? To(n);
    ((a.disabled = !1),
      (a.textContent = `${n.name} \xB7 ${K(i)}`),
      (a.title = `Swap for ${po(n.name)} ${n.name.toLowerCase()}`),
      (a.onclick = () => {
        const l = Qn(n, t);
        l === "cash"
          ? (xt("Not enough money"), O.no())
          : l === "ok" && (uo(), Kl());
      }));
  } else
    ((a.disabled = !0),
      (a.textContent =
        e.kind === "station" ? "Best station yet" : "Best actuators yet"),
      (a.onclick = null));
  ((v("#pop-sell").textContent = "Sell \xB7 " + K(Math.round(e.cost * 0.5))),
    (v("#pop-sell").onclick = () => {
      (Hl(No), uo());
    }));
}
let k0 = 0;
function r1() {
  if (No < 0) return;
  const t = No,
    e = t % j,
    o = Math.floor(t / j),
    n = Q[s.cells[t] || ie[t]];
  if (!n) {
    ze(-1);
    return;
  }
  (ie[t] && z - k0 > 0.25 && ((k0 = z), Kl()),
    J.set(e + 0.5, kt + (n.kind === "station" ? 1.7 : 1.3), -(o + 0.5)).project(
      H,
    ));
  const a = v("#pop"),
    i = Dt.getBoundingClientRect();
  if (J.z > 1) {
    a.style.opacity = 0;
    return;
  }
  ((a.style.opacity = 1),
    (a.style.left = D((J.x * 0.5 + 0.5) * i.width, 130, i.width - 130) + "px"),
    (a.style.top = D((-J.y * 0.5 + 0.5) * i.height, 150, i.height) + "px"));
}
function Vo(t) {
  ((Ht = t), t && ze(-1), (jt = null), (Jt = !0));
  for (const e of Object.values(Hn)) e.visible = !1;
  (Rn && x0(Rn), t || es());
}
(mi.forEach((t) => Jn(t.hit, "link", { L: t })),
  Jn(Oi, "board"),
  Jn(za, "bench"),
  Jn(Wl, "gate"),
  Jn(Di, "yard"));
const M0 = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
function S0(t) {
  if (!isFinite(t)) return "\u221E";
  const e = Math.abs(t);
  if (e < 1e3)
    return e < 100 && e % 1 ? t.toFixed(e < 10 ? 2 : 1) : String(Math.round(t));
  let o = 0,
    n = e;
  for (; n >= 999.5 && o < M0.length - 1;) ((n /= 1e3), o++);
  return (
    (t < 0 ? "-" : "") +
    (n < 9.995 ? n.toFixed(2) : n < 99.95 ? n.toFixed(1) : Math.round(n)) +
    M0[o]
  );
}
const K = (t) =>
    (t < 0 ? "-$" : "$") +
    (Math.abs(t) < 100 && Math.abs(t) % 1
      ? Math.abs(t).toFixed(2)
      : S0(Math.abs(t))),
  G = (t) => S0(t),
  Yt = (t) =>
    t < 1
      ? Math.round(t * 1e3) + " W"
      : t < 1e3
        ? (t < 10 ? t.toFixed(1) : Math.round(t)) + " kW"
        : t < 1e6
          ? ((t /= 1e3) < 10
              ? t.toFixed(2)
              : t < 100
                ? t.toFixed(1)
                : Math.round(t)) + " MW"
          : (t / 1e6).toFixed(2) + " GW",
  $0 = (t) => (
    (t = Math.max(0, Math.round(t))),
    t < 60
      ? t + " s"
      : t < 3600
        ? Math.floor(t / 60) + " min " + String(t % 60).padStart(2, "0") + " s"
        : Math.floor(t / 3600) +
          " h " +
          String(Math.floor((t % 3600) / 60)).padStart(2, "0") +
          " min"
  ),
  l1 = (t) => {
    t = Math.max(0, Math.round(t));
    const e = Math.floor(t / 3600),
      o = Math.floor((t % 3600) / 60),
      n = t % 60;
    return e
      ? `${e}:${String(o).padStart(2, "0")}:${String(n).padStart(2, "0")}`
      : `${o}:${String(n).padStart(2, "0")}`;
  },
  qt = (t, e) => `${t} ${e}${t === 1 ? "" : "s"}`,
  Jp = (t) => {
    const e = s.lab
      .replace(/[^\w\s-]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    let o = e[0] || "Model";
    return (
      o.length < 4 &&
        e.length > 1 &&
        (o = e
          .map((n) => n[0])
          .join("")
          .toUpperCase()),
      `${o}-${t + 1}`
    );
  },
  Xe = (t) =>
    t <= 0
      ? "none a day"
      : t < 0.95
        ? `one every ${Math.round(1 / t)} days`
        : t < 10
          ? `${(Math.round(t * 10) / 10).toFixed(1).replace(/\.0$/, "")} a day`
          : `${G(t)} a day`,
  c1 = Date.UTC(2026, 9, 4),
  f1 = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  h1 = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  cn = (t) => {
    const e = new Date(c1 + Math.max(0, t || 0) * 864e5);
    return {
      short: `${f1[e.getUTCMonth()]} ${e.getUTCFullYear()}`,
      long: `${h1[e.getUTCMonth()]} ${e.getUTCFullYear()}`,
      y: e.getUTCFullYear(),
    };
  },
  Ao = {
    bench:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 18h24M7 18v9M25 18v9"/><path d="M8 15.5h12.5" stroke="#7fe3ff" stroke-linecap="round"/><circle cx="23.4" cy="15.2" r="2.2" stroke="#7fe3ff"/></svg>',
    cell: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 28V5h20v23M4 28h24"/><circle cx="16" cy="10.5" r="2.4" stroke="#7fe3ff"/><path d="M16 13v8M12.5 16h7M16 21l-2.5 5M16 21l2.5 5" stroke="#7fe3ff" stroke-linecap="round"/></svg>',
    line: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 27h26M5 27v-2h22v2M4 4h24"/><g stroke="#7ff0b8" stroke-linecap="round"><circle cx="11" cy="9" r="2"/><path d="M11 11v7M8.5 14h5M11 18l-2 5M11 18l2 5"/><circle cx="21" cy="9" r="2"/><path d="M21 11v7M18.5 14h5M21 18l-2 5M21 18l2 5"/></g></svg>',
    giga: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 27V5M27 27V5M5 5h22"/><ellipse cx="16" cy="25" rx="9" ry="2.6" stroke="#7fe3ff"/><circle cx="12.5" cy="11" r="1.8"/><path d="M12.5 13v8"/><circle cx="19.5" cy="11" r="1.8"/><path d="M19.5 13v8"/></svg>',
    auto: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="5" width="22" height="22" rx="1.5" stroke="#b9a2ff"/><circle cx="16" cy="12" r="2.4"/><path d="M16 14.5v6M12.5 17h7M16 20.5l-2.5 4M16 20.5l2.5 4"/><path d="M23 8v3M21.5 9.5h3" stroke="#b9a2ff"/></svg>',
    wind: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 22h22M8 22v6M24 22v6"/><ellipse cx="12" cy="15" rx="4.5" ry="5" stroke="#e08a4a"/><path d="M9 12h6M8.6 15h6.8M9 18h6" stroke="#e08a4a"/><rect x="19" y="11" width="6" height="8" rx="1"/></svg>',
    act: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="5" width="20" height="22" rx="2"/><circle cx="16" cy="14" r="4.5" stroke="#7fe3ff"/><circle cx="16" cy="14" r="1.4" stroke="#7fe3ff"/><path d="M10 23h4M18 23h4"/></svg>',
    aline:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="9" width="7" height="16" rx="1"/><rect x="22" y="9" width="7" height="16" rx="1"/><path d="M10 19h12"/><circle cx="13.5" cy="16.5" r="1.8" stroke="#e08a4a"/><circle cx="18.5" cy="16.5" r="1.8" stroke="#7fe3ff"/></svg>',
    aplant:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 27V14l6 3v-3l6 3v-3l6 3V7h4v20zM4 27h24"/><rect x="8" y="20" width="5" height="4" stroke="#ffb454"/></svg>',
    plug: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v6M20 4v6M9 10h14v5a7 7 0 0 1-14 0zM16 22v6" stroke="#ffb454"/></svg>',
    bolt: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 3 8 18h7l-2 11 11-16h-7z" stroke="#ffb454"/></svg>',
    xfmr: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="10" width="20" height="16" rx="1.5"/><path d="M9 14v8M12 14v8M15 14v8" stroke="#7ff0b8"/><path d="M20 10V6M24 10V7" /></svg>',
    sub: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 27h22M8 27V9M24 27V9M6 9h20M10 9l6-5 6 5"/><path d="M12 15h8v8h-8z" stroke="#ffb454"/></svg>',
    solar:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 19l4-9h12l-4 9z" stroke="#7fe3ff"/><path d="M5.2 14.5h12M11 19l4-9"/><rect x="21" y="15" width="8" height="11" rx="1"/><path d="M23.5 13.5h3"/><path d="M25.5 18l-1.5 3h2.2l-1.5 3" stroke="#ffb454"/></svg>',
    smr: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 27V17a6 6 0 0 1 12 0v10"/><path d="M18 27c1.6-5 1.6-10 0-15h9c-1.6 5-1.6 10 0 15z"/><path d="M20 8c1-2 3-2 4 0" stroke="#bfefff"/><path d="M3 27h26"/></svg>',
    fusion:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="16" cy="16" rx="12" ry="6"/><ellipse cx="16" cy="16" rx="6" ry="2.4" stroke="#c4a8ff"/></svg>',
    res: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4h8M14 4v8l-7 12a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-7-12V4"/><path d="M10 21h12" stroke="#7fe3ff"/></svg>',
    grow: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="9" width="14" height="14" rx="1"/><path d="M19 9h8v18H5v-4" stroke="#7fe3ff" stroke-dasharray="2.4 2"/></svg>',
    lock: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="14" width="14" height="12" rx="2"/><path d="M12 14v-3a4 4 0 0 1 8 0v3"/></svg>',
    bot: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9.5" y="5" width="13" height="10.5" rx="4"/><path d="M13 10.5h6" stroke="#7fe3ff" stroke-linecap="round"/><path d="M11.5 18.5h9v4.5h-9zM13 23v5M19 23v5M11.5 19.5l-3.5 4M20.5 19.5l3.5 4"/></svg>',
    person:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="13" cy="10" r="4.2"/><path d="M5 27c.7-5.3 3.6-8.2 8-8.2 2.3 0 4.2.8 5.5 2.2"/><rect x="18.5" y="17.5" width="8" height="10" rx="1.2" stroke="#ffb454"/><path d="M20.5 21h4M20.5 24h4" stroke="#ffb454"/></svg>',
    wrench:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 4.5a6 6 0 0 0-5.7 7.9L5 22.7a2.5 2.5 0 0 0 3.5 3.5l10.3-10.3a6 6 0 0 0 7.9-5.7l-3.5 3.5-3.6-.8-.8-3.6z" stroke="#ff8f7a"/></svg>',
    crane:
      '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 28V5M9 7l17 3H9M9 11l4-6M24 10v6"/><path d="M21.5 16h5v4h-5z" stroke="#e0b04a"/><path d="M4 28h12"/></svg>',
  };
let Jt = !0,
  Te = "build",
  Xl = null;
const Co = [...document.querySelectorAll(".tabs button")];
Co.forEach(
  (t) =>
    (t.onclick = () => {
      ((Te = t.dataset.tab),
        Co.forEach((e) => e.classList.toggle("on", e === t)));
      for (const e of ["build", "power", "research", "staff"])
        v("#pane-" + e).hidden = e !== Te;
      ((Jt = !0), O.tick());
    }),
);
const d1 = {
    bench: "Bench",
    cell: "Cell",
    line: "Line",
    giga: "Gigaline",
    auto: "Self-build",
    wind: "Winding",
    act: "Actuator",
    aline: "Act. line",
    aplant: "Act. plant",
  },
  R0 = ["bench", "cell", "line", "giga", "auto"],
  T0 = ["wind", "act", "aline", "aplant"],
  A0 = [...R0, ...T0],
  C0 = (t) => {
    const e = t.filter((n) => $t(At[n])),
      o = t.find((n) => !$t(At[n]));
    return o ? [...e, o] : e;
  };
function u1() {
  const t = v("#pane-build"),
    e = (n) => {
      const a = At[n],
        i = !$t(a),
        l = A0.indexOf(n) + 1;
      return `<button class="item${Ht === n ? " on" : ""}${i ? " lock" : ""}${!i && !s.seen["tool_" + n] && a.gen > 0 ? " new" : ""}" data-id="${n}" title="${i ? `Unlocks with brain v${a.gen + 1}` : a.name}"><kbd>${l}</kbd>${i ? Ao.lock : Ao[n]}<b>${d1[n]}</b><span data-cost="${n}">${i ? "at v" + (a.gen + 1) : K(To(a))}</span></button>`;
    },
    o = pt[s.lvl + 1];
  ((t.innerHTML = `<div class="sec"><span class="lab">Stations</span><em>robots build robots</em></div><div class="grid">${C0(R0).map(e).join("")}</div>
  <div class="sec"><span class="lab">Actuators</span><em>40 in every robot</em></div><div class="grid">${C0(T0).map(e).join("")}</div>
  <div class="crewrow" id="crewrow" hidden><button class="crewl" id="crewl"></button><button class="rushall" id="rushall" hidden></button></div>
  <div class="detail" id="detail"></div>
  ${fn() ? `<button class="wide" id="expand" title="Pay to finish it now">${Ao.crane.replace("<svg", '<svg style="width:22px;height:22px;flex:none"')}<b style="flex:1;text-align:left;margin-left:8px;font-weight:600">Building ${po(o[3])} ${o[3].toLowerCase()}<small id="exp-p"></small></b><span id="exp-r"></span></button>` : o ? `<button class="wide" id="expand" title="More floor: ${o[0]}\xD7${o[1]} tiles">${Ao.grow.replace("<svg", '<svg style="width:22px;height:22px;flex:none"')}<b style="flex:1;text-align:left;margin-left:8px;font-weight:600">Expand to ${po(o[3].toLowerCase())} ${o[3].toLowerCase()} \xB7 ${o[0]}\xD7${o[1]}</b><span>${K(o[2])}</span></button>` : '<button class="wide" disabled><b>The floor is as big as it gets</b></button>'}`),
    t.querySelectorAll(".item").forEach((n) => {
      ((n.onclick = () => {
        const a = n.dataset.id,
          i = At[a];
        if (!$t(i)) {
          xt(`${i.name}: unlocks with brain v${i.gen + 1}`);
          return;
        }
        ((s.seen["tool_" + a] = 1), Vo(Ht === a ? null : a), O.tick());
      }),
        (n.onmouseenter = () => {
          ((Xl = n.dataset.id), Jl());
        }),
        (n.onmouseleave = () => {
          ((Xl = null), Jl());
        }));
    }),
    v("#expand")?.addEventListener("click", () => {
      fn() ? n1() : Ua();
    }),
    (v("#crewl").onclick = () => {
      Je() && Tn("staff");
    }),
    (v("#rushall").onclick = () => wr("rushall")),
    Jl(),
    L0());
}
function L0() {
  const t = v("#crewl"),
    e = v("#crewrow");
  if (!t || !e) return;
  const o = s.sites.length,
    n = Me();
  if (((e.hidden = !o), !o)) return;
  {
    const i = v("#rushall"),
      l = o >= 2 ? s.sites.reduce((r, c) => r + hr(c), 0) : 0;
    if (((i.hidden = o < 2), o >= 2)) {
      const r = `Finish all \xB7 ${K(l)}`;
      (i.textContent !== r && (i.textContent = r),
        i.classList.toggle("poor", s.cash < l));
    }
  }
  const a = `<span>${Math.min(o, n)} of ${n} crews busy${o > n ? ` \xB7 ${o - n} waiting` : ""}</span><em>${Je() ? "Staff" : ""}</em>`;
  t.innerHTML !== a && (t.innerHTML = a);
}
const Gs = (t) => t.rate * yt[s.gen].skill * Ct.rate;
function Jl() {
  const t = v("#detail");
  if (!t) return;
  const o = At[Xl || Ht];
  if (!o) {
    t.innerHTML =
      "Pick a station or an actuator cell, then click a tile on the floor. Drag to fill a row.";
    return;
  }
  o.kind === "station"
    ? (t.innerHTML = `<b>${o.name}</b> \xB7 crew of ${o.crew} \xB7 <span class="c">${Xe(Gs(o))}</span> \xB7 <span class="a">${Yt(o.kw)}</span><br>${o.desc} Takes <b>${wi[o.cls]}</b>${o.cls ? " or better" : ""}. Each one you have adds ${Math.round(cr * 100)}% to the next one's price.`)
    : (t.innerHTML = `<b>${o.name}</b> \xB7 <span class="c">${G(o.supply * Ct.parts)} actuators a day</span>${o.range > 1 ? " two tiles out" : ""} \xB7 enough for ${Xe((o.supply * Ct.parts) / wo)}<br>${o.desc}`);
}
const fn = () => s.proj.find((t) => t.kind === "floor");
function p1(t) {
  if (t !== pt[s.lvl + 1] || fn()) return;
  const e = s.cash < t[2];
  (lr(!1),
    es(),
    (v("#dx-h").textContent =
      `Expand to ${po(t[3]) + " " + t[3].toLowerCase()}?`),
    (v("#dx-p").innerHTML =
      `${t[0]} by ${t[1]} tiles, up from ${gt()} by ${vt()}. The builders take ${qt(tl[s.lvl + 1] || 30, "day")}. <b>Pay ${K(t[2])}</b>` +
      (e ? `<br><span class="r">You have ${K(s.cash)}.</span>` : "")));
  const o = v("#dx-yes");
  ((o.disabled = e),
    (o.style.opacity = e ? 0.45 : 1),
    (o.onclick = () => {
      (v("#d-expand").close(), Ua());
    }),
    v("#d-expand").showModal());
}
function Ua() {
  const t = pt[s.lvl + 1];
  if (!t || fn()) return;
  if (s.cash < t[2]) {
    (xt("Not enough money to expand"), O.no());
    return;
  }
  s.cash -= t[2];
  const e = tl[s.lvl + 1] || 30;
  (s.proj.push({ kind: "floor", n: s.lvl + 1, left: e, T: e }),
    Xt(),
    (Jt = !0),
    O.place("station"),
    xt(
      `The builders are on it: ${po(t[3])} ${t[3].toLowerCase()} in ${e} days`,
    ));
}
function g1() {
  const t = pt[s.lvl + 1];
  t &&
    (s.lvl++,
    Lf(),
    Af(),
    ke(),
    Ro(),
    Oe || Ps(!1),
    Xt(),
    (Jt = !0),
    !ue &&
      (O.big(),
      Et(
        t[3],
        `The floor is now ${t[0]} by ${t[1]} tiles: room for ${t[0] * t[1] - pt[s.lvl - 1][0] * pt[s.lvl - 1][1]} more stations and cells, and the yard grows too.`,
        "c",
        null,
        { icon: "grow", kick: "Floor expanded" },
      )));
}
function E0() {
  const t = v("#pane-power"),
    e = al(),
    o = p.draw;
  ((t.innerHTML =
    `<div class="detail">Supply <b>${Yt(e)}</b> \xB7 drawing <b class="${o > e ? "r" : ""}">${Yt(o)}</b> (stations ${Yt(p.kwS)}, actuators ${Yt(p.kwC)}, robots charging ${Yt(p.robotsKW)})<br>${o > e ? `<span class="r">Over the limit: everything runs at ${Math.round(p.brown * 100)}%.</span>` : `${Math.round((o / Math.max(e, 1e-9)) * 100)}% of what you can supply.`}</div>` +
    (() => {
      const n = Po.filter((l) => l.id !== "outlet"),
        a = n.filter((l) => $t(l)),
        i = n.find((l) => !$t(l));
      return i ? [...a, i] : a;
    })()
      .map((n) => {
        const a = s.plants[n.id] || 0,
          i = !$t(n),
          l = s.proj.filter((d) => d.kind === "plant" && d.id === n.id),
          r = a + l.length >= n.max,
          c = wn(n),
          h = l.length
            ? Math.floor(Math.max(...l.map((d) => 1 - d.left / d.T)) * 100)
            : 0;
        return `<button class="row${i ? " lock" : ""}${r ? " done" : ""}" data-p="${n.id}">${i ? Ao.lock : Ao[n.id] || Ao.bolt}<span class="t"><b>${n.name}</b><small>${i ? `Unlocks with brain v${n.gen + 1}.` : `+${Yt(n.kw * Ct.power)} \xB7 ${n.desc}`}</small></span><span class="p">${i ? "" : r ? (l.length ? "building" : "built") : K(c)}<small>${i ? "" : `${a} of ${n.max}${l.length ? ` \xB7 building ${h}%` : ""}`}</small></span></button>`;
      })
      .join("")),
    t
      .querySelectorAll(".row")
      .forEach((n) => (n.onclick = () => I0(n.dataset.p))));
}
function I0(t) {
  const e = tn[t];
  if (!$t(e) || sl(t) >= e.max) return;
  const o = wn(e);
  if (s.cash < o) {
    (xt("Not enough money"), O.no());
    return;
  }
  s.cash -= o;
  const n = Ld[t] || 10;
  (s.proj.push({ kind: "plant", id: t, left: n, T: n }),
    Xt(),
    (Jt = !0),
    O.place("parts"),
    xt(`${e.name}: online in ${n} days`));
}
const Ql = (t) => (t.spons && de[t.spons]?.brand ? de[t.spons].name : t.name);
function m1() {
  const t = v("#pane-research"),
    e = so.filter((i) => $t(i) && !s.res[i.id]),
    o = so.filter((i) => s.res[i.id]),
    n = so.filter((i) => !$t(i)),
    a = (i, l) => {
      const r = i.spons && de[i.spons];
      return `<button class="row${l === "done" ? " done" : ""}${r?.brand ? " spons" : ""}" data-r="${i.id}">${r?.glyph ? `<span class="rg">${r.glyph}</span>` : Ao.res}<span class="t"><b>${Ql(i)}${r?.brand ? "<span>FEATURED</span>" : ""}</b><small>${pr(i)} \xB7 ${r?.desc || i.desc}</small></span><span class="p">${l === "done" ? "done" : K(i.cost)}</span></button>`;
    };
  ((t.innerHTML =
    (e.length
      ? e.map((i) => a(i)).join("")
      : '<div class="detail">Nothing left to research until your next brain.</div>') +
    (n.length
      ? `<div class="sec"><span class="lab">Next brain</span><em>${qt(n.filter((i) => i.gen === s.gen + 1).length, "idea")} unlock with v${s.gen + 2}</em></div>`
      : "") +
    (o.length
      ? `<div class="sec"><span class="lab">Done</span><em>${o.length}</em></div>` +
        o.map((i) => a(i, "done")).join("")
      : "")),
    t
      .querySelectorAll(".row")
      .forEach((i) => (i.onclick = () => B0(i.dataset.r))));
}
function pr(t) {
  const e = t.fx,
    o = Object.keys(e)[0],
    n = e[o],
    a = (i) => Math.round((i - 1) * 100);
  return {
    rate: `+${a(n)}% robots a day`,
    parts: `actuators +${a(n)}%`,
    price: `+${a(n)}% a robot`,
    train: `brains need ${Math.round((1 - n) * 100)}% less practice`,
    learn: `practice +${a(n)}%`,
    kw: `station power \u2212${Math.round((1 - n) * 100)}%`,
    rkw: `charging \u2212${Math.round((1 - n) * 100)}%`,
    fleet: "shipped robots teach",
    plant: `plants \u2212${Math.round((1 - n) * 100)}%`,
    power: `+${a(n)}% power`,
  }[o];
}
function B0(t) {
  const e = ol[t];
  if (!(!e || s.res[t] || !$t(e))) {
    if (s.cash < e.cost) {
      (xt("Not enough money"), O.no());
      return;
    }
    if (
      ((s.cash -= e.cost),
      (s.res[t] = 1),
      Dn(),
      ke(),
      Ro(),
      Xt(),
      (Jt = !0),
      O.big(),
      e.spons && de[e.spons]?.brand)
    ) {
      const o = de[e.spons];
      (Ba(),
        Et(o.name, `${o.desc}`, "or", null, {
          svg: o.glyph,
          kick: "Research done",
          big: pr(e),
        }));
      return;
    }
    Et(e.name, e.desc, "g", null, {
      icon: "flask",
      kick: "Research done",
      big: pr(e),
    });
  }
}
function _0() {
  ((Jt = !1),
    Te === "build"
      ? u1()
      : Te === "power"
        ? E0()
        : Te === "staff"
          ? xr()
          : m1());
}
function Va() {
  document.querySelectorAll("[data-cost]").forEach((i) => {
    const l = At[i.dataset.cost];
    if (!$t(l)) return;
    const r = To(l),
      c = K(r);
    (i.textContent !== c && (i.textContent = c),
      i.parentElement.classList.toggle("poor", s.cash < r));
  });
  const t = v("#expand");
  if (t) {
    const i = pt[s.lvl + 1];
    t.classList.toggle("poor", i && s.cash < i[2]);
  }
  (document.querySelectorAll("#pane-power .row[data-p]").forEach((i) => {
    const l = tn[i.dataset.p];
    i.classList.toggle(
      "poor",
      $t(l) && (s.plants[l.id] || 0) < l.max && s.cash < wn(l),
    );
  }),
    document.querySelectorAll("#pane-research .row[data-r]").forEach((i) => {
      const l = ol[i.dataset.r];
      i.classList.toggle("poor", !s.res[l.id] && s.cash < l.cost);
    }));
  const e = so.some((i) => $t(i) && !s.res[i.id] && s.cash >= i.cost),
    o =
      p.brown < 0.995 && Po.some((i) => $t(i) && (s.plants[i.id] || 0) < i.max),
    n = Q.some((i) => i && $t(i) && i.gen > 0 && !s.seen["tool_" + i.id]),
    a =
      Je() &&
      (["gate", "dock", "fix"].some(
        (i) => s.gen >= Tt[i].gen && s.staff[i] !== 2,
      ) ||
        (s.gen >= Tt.build.gen && !s.staff.build) ||
        !s.seen.staffTab);
  (Co[0].classList.toggle("dot", n && Te !== "build"),
    Co[1].classList.toggle("dot", o && Te !== "power"),
    Co[2].classList.toggle("dot", e && Te !== "research"),
    Co[3].classList.toggle("dot", a && Te !== "staff"),
    Te === "staff" && ((s.seen.staffTab = 1), xr()),
    document
      .querySelectorAll("#pane-staff .row[data-crew]")
      .forEach((i) => i.classList.toggle("poor", s.cash < +i.dataset.crew)),
    Te === "power" &&
      (Math.abs(p.draw - (Va.dr || 0)) > p.draw * 0.01 + 0.01 ||
        (s.proj.some((i) => i.kind === "plant") && z - (Va.pt || 0) > 0.5)) &&
      ((Va.dr = p.draw), (Va.pt = z), E0()));
}
const Lo = v("#sl");
function gr() {
  const t = s.chose ? s.split : 0.5,
    e = Math.round(t * 100);
  ((v("#sl-k").style.width = `calc((100% - 6px)*${t})`),
    (v("#sl-f").style.width = `calc((100% - 6px)*${1 - t})`),
    (v("#sl-th").style.left = `calc(3px + (100% - 6px)*${t})`),
    (v("#sl-l").textContent = s.chose ? `Keep ${e}%` : "Keep"),
    (v("#sl-r").textContent = s.chose ? `Ship ${100 - e}%` : "Ship"),
    Lo.setAttribute("aria-valuenow", e),
    Lo.setAttribute(
      "aria-valuetext",
      `Keep ${e} percent, ship ${100 - e} percent`,
    ),
    Ii());
}
function qo(t, e) {
  if (
    ((t = D(Math.round(t * 20) / 20, 0, 1)),
    s.chose ||
      (s.built > 0 && fa(t >= 0.5), (s.split = t), (s.chose = s.built > 0)),
    t === s.split && e !== "force")
  ) {
    gr();
    return;
  }
  ((s.split = t),
    gr(),
    Xt(),
    e &&
      xt(
        `Keep ${Math.round(t * 100)}% \xB7 ship ${100 - Math.round(t * 100)}%`,
      ));
  const o = v("#split");
  (o.classList.remove("flash"), o.offsetWidth, o.classList.add("flash"));
}
{
  let t = !1;
  const e = (n) => {
    const a = Lo.getBoundingClientRect();
    return D((n.clientX - a.left - 3) / (a.width - 6), 0, 1);
  };
  (Lo.addEventListener("pointerdown", (n) => {
    ((t = !0), Lo.classList.add("drag"));
    try {
      Lo.setPointerCapture(n.pointerId);
    } catch {}
    (qo(e(n)), O.tick());
  }),
    Lo.addEventListener("pointermove", (n) => {
      t && qo(e(n));
    }));
  const o = () => {
    t &&
      ((t = !1),
      Lo.classList.remove("drag"),
      xt(
        `Keep ${Math.round(s.split * 100)}% \xB7 ship ${100 - Math.round(s.split * 100)}%`,
      ));
  };
  (Lo.addEventListener("pointerup", o),
    Lo.addEventListener("pointercancel", o),
    Lo.addEventListener("keydown", (n) => {
      (n.key === "ArrowLeft" || n.key === "ArrowRight") &&
        (n.preventDefault(),
        n.stopPropagation(),
        qo(s.split + (n.key === "ArrowRight" ? 0.05 : -0.05), "key"));
    }));
}
let D0 = 0;
const po = (t) => (/^[AEIOU]/i.test(t) ? "an" : "a"),
  Qp = (t) => t.name,
  mr = () => {
    const t = Q.filter((e) => e && e.kind === "station" && $t(e));
    return t.filter((e) => To(e) <= s.cash).at(-1) || t[0];
  },
  P0 = (t) =>
    Q.find((e) => e && e.kind === "parts" && $t(e) && e.cls >= Math.max(0, t)),
  br = () => Math.round((s.chose ? s.split : 1) * 100),
  F0 = () => s.chose && (s.mseq > 3 || s.ng > 0);
function js(t) {
  let e = 0;
  for (; e < ki.length && ki[e][0] <= t;) e++;
  return { past: e > 0 ? ki[e - 1] : null, next: ki[e] || null, i: e };
}
const yr = () =>
    s.ng > 0 ||
    (s.mseq >= go.length && !s.missions.some((t) => Ns(t) && !t.claimed)),
  Je = () => yr(),
  b1 = {
    gate: {
      name: "The gate",
      chore: "send the line through",
      you: "Robots wait at the gate until you send them through.",
      aide: "an assistant",
      Aide: "An assistant",
    },
    dock: {
      name: "The dock",
      chore: "sign for loaded trucks",
      you: "Loaded trucks wait for your signature.",
      aide: "an assistant",
      Aide: "An assistant",
    },
    fix: {
      name: "Repairs",
      chore: "fix jammed stations",
      you: "Jammed stations stop until you fix them.",
      aide: "a technician",
      Aide: "A technician",
    },
  };
function xr() {
  const t = v("#pane-staff"),
    e = s.gen,
    o = Me(),
    n = Math.min(o, s.sites.length),
    a = Math.max(0, s.sites.length - o),
    i = xi[s.staff.crews || 0],
    l = e >= Tt.build.gen,
    r = [
      s.staff.gate,
      s.staff.dock,
      s.staff.fix,
      s.staff.build,
      s.staff.crews,
      e,
      n,
      a,
      Je(),
    ].join();
  if (xr.sig === r && t.innerHTML) return;
  xr.sig = r;
  const c = (d, m, u, g, b, y = "") =>
      `<button class="row${y}"${d ? ` data-a="${d}"` : ""}>${Ao[m]}<span class="t"><b>${u}</b><small>${g}</small></span><span class="p">${b}</span></button>`,
    h = (d) => {
      const m = s.staff[d],
        u = Tt[d],
        g = b1[d],
        b = e >= u.gen;
      return m === 2
        ? c(
            "",
            "bot",
            `${g.name} \xB7 robots`,
            `${u.bots} kept robots ${g.chore}, day and night, even while you are away.`,
            "done",
            " done",
          )
        : m === 1
          ? b
            ? c(
                "bots:" + d,
                "bot",
                `${g.name} \xB7 ${g.aide}`,
                "Robots can take over now, free, and they keep working while you are away.",
                "robots<small>free</small>",
              )
            : c(
                "",
                "person",
                `${g.name} \xB7 ${g.aide}`,
                `${K(u.wage)} a day, while you are here${d === "fix" ? `, and it takes ${g.aide.slice(2)} ${yi} days to get to a jam` : ""}. Robots take over once they learn ${yt[u.gen].cls.toLowerCase()}.`,
                `v${u.gen + 1}<small>robots</small>`,
                " lock",
              )
          : b
            ? c(
                "bots:" + d,
                "bot",
                `${g.name} \xB7 you`,
                `${g.you} Robots can do it now, around the clock.`,
                "robots<small>free</small>",
              )
            : c(
                "hire:" + d,
                "person",
                `${g.name} \xB7 you`,
                `${g.you} ${g.Aide} does it while you are here.`,
                `${K(u.wage)}<small>a day</small>`,
              );
    };
  ((t.innerHTML =
    h("gate") +
    h("dock") +
    (s.stats.jams || s.staff.fix ? h("fix") : "") +
    `<div class="sec"><span class="lab">Building</span><em>${qt(o, "crew")} \xB7 ${n} building${a ? `, ${a} waiting` : ""}</em></div>` +
    (i != null
      ? c(
          "crew",
          "crane",
          "Hire a building crew",
          "Each crew builds one thing at a time.",
          `${K(i)}<small>once</small>`,
        ).replace("<button", '<button data-crew="' + i + '"')
      : "") +
    (s.staff.build
      ? c(
          "",
          "bot",
          "Robots build",
          "A crew for every six stations, twice as fast.",
          "done",
          " done",
        )
      : c(
          l ? "bots:build" : "",
          "bot",
          "Robot builders",
          l
            ? "Put robots on the sites: a crew for every six stations, twice as fast."
            : "Once robots can build robots: a crew for every six stations, twice as fast.",
          l ? "free" : `v${Tt.build.gen + 1}`,
          l ? "" : " lock",
        )) +
    `<p class="note">Away, robots on these jobs work one night shift of <b>${rf()} days</b>${e < 5 ? " (three times as long from v6)" : ""}, then everything waits for you. Assistants go home.</p>`),
    t
      .querySelectorAll(".row[data-a]")
      .forEach((d) => (d.onclick = () => wr(d.dataset.a))));
}
function O0(t) {
  !Je() ||
    !Tt[t] ||
    s.staff[t] !== 0 ||
    ((s.staff[t] = 1),
    O.chime(),
    (Jt = !0),
    Xt(),
    Et(
      t === "fix" ? "A technician" : "An assistant",
      t === "gate"
        ? "Sends the line through the gate for you while you are here, and goes home when you leave."
        : t === "dock"
          ? "Signs for loaded trucks for you while you are here, and goes home when you leave."
          : `Fixes jammed stations for you while you are here, ${yi} days or so after they jam, and goes home when you leave.`,
      "c",
      null,
      {
        icon: t === "fix" ? "wrench" : "robot",
        kick: "Hired",
        big: `${K(Tt[t].wage)} a day`,
      },
    ));
}
function Zl(t) {
  const e = Tt[t];
  if (!(!e || s.gen < e.gen)) {
    if (t === "build") {
      if (s.staff.build) return;
      s.staff.build = 1;
    } else {
      if (s.staff[t] === 2) return;
      s.staff[t] = 2;
    }
    ((p.dirty = !0),
      (xe = !0),
      (Jt = !0),
      O.big(),
      Xt(),
      Et(
        t === "build"
          ? "Robots build"
          : t === "fix"
            ? "Robots fix robots"
            : `Robots run the ${t}`,
        t === "gate"
          ? "Every finished robot goes through the gate as it arrives, day and night."
          : t === "dock"
            ? "Every loaded truck is signed for and on its way, day and night."
            : t === "fix"
              ? "A jammed station is fixed as soon as it jams, day and night."
              : "A crew for every six stations, and everything goes up twice as fast.",
        "c",
        null,
        {
          icon: t === "fix" ? "wrench" : "robot",
          kick: "Robots on the job",
          big: t === "build" ? "2\xD7 faster" : "around the clock",
        },
      ));
  }
}
function z0() {
  const t = xi[s.staff.crews || 0];
  if (t != null) {
    if (s.cash < t) {
      (xt("Not enough money for another crew"), O.no());
      return;
    }
    ((s.cash -= t),
      (s.staff.crews = (s.staff.crews || 0) + 1),
      O.place("station"),
      (Jt = !0),
      Xt(),
      Et(
        "A building crew",
        `${qt(Me(), "crew")} now: ${Me()} things go up at once.`,
        "c",
        null,
        { icon: "gear", kick: "Hired" },
      ));
  }
}
const Ns = (t) => !!t.ob || (!s.ng && t.id <= go.length),
  tc = () => s.missions.find((t) => Ns(t) && !t.claimed),
  y1 = {
    built: () =>
      `Every robot starts by hand. Click the one on the workbench to fit its last parts, or watch it finish. <b>${Math.floor(D(s.acc, 0, 1) * 100)}%</b>`,
    crew: () =>
      s.ready >= 1 && s.chose
        ? s.split < 0.5
          ? "Your next robot is waiting at the gate. Set the gate to <b>Keep</b>, then send it through: kept, it joins you at the bench."
          : "Your next robot is waiting at the gate. <b>Click the bubble over it</b>, or press Enter, to send it through: kept, it joins you at the bench."
        : "A robot working at your bench doubles its speed: robots building robots. Keep the next one.",
    stations: () =>
      "Every station needs its crew. Kept robots staff them first. Pick <b>Workbench</b> and click the glowing tile.",
    ship: () =>
      s.trucks.some((t) => t.got >= t.n)
        ? "A truck is loaded. <b>Click it</b>, or press Enter, to sign for it: it pays when it leaves."
        : s.split <= 0.6 && s.ready >= 1
          ? "Send the robots at the gate through: the ones you ship walk out to the truck."
          : "Money only comes from robots you ship. Move the gate toward <b>Ship</b>, send robots through, and sign for the truck at the dock.",
    launch: () =>
      p.gym > 0
        ? `Kept robots with no station practise in the yard, and practice trains the next brain. ${G(p.gym)} practising now.`
        : "Kept robots with no station practise in the yard, and practice trains the next brain. Nobody is practising yet: keep more than your stations need.",
  };
function x1(t) {
  const e = go.findIndex((c) => c.k === t.k),
    o = Ws[t.k],
    n = t.done ? 1 : Rr(t),
    a = t.done
      ? "done"
      : o.p
        ? Math.floor(n * 100) + "%"
        : `${(o.f || G)(Math.max(0, Math.min(o.v(t), t.n)))}/${(o.f || G)(t.n)}`,
    i = s.trucks.some((c) => c.got >= c.n),
    l = s.ready >= 1 && s.chose,
    r =
      {
        built: [["Fit a part", "fit"]],
        crew:
          s.chose && s.split < 0.5
            ? [["Keep half", "split:.5"]]
            : l
              ? [["Send it through", "collect"]]
              : [],
        stations: [["Pick workbench", "tool:bench"]],
        ship: i
          ? [["Sign for it", "sign"]]
          : s.split > 0.6
            ? [["Ship half", "split:.5"]]
            : l
              ? [["Send them through", "collect"]]
              : [],
        launch: p.gym < 1 ? [["Keep more", "keepmore"]] : [],
      }[t.k] || [];
  return {
    t: "ob" + (t.done ? " done" : ""),
    k: e < 0 ? "" : `First steps \xB7 ${e + 1} of ${go.length}`,
    h: o.t(t) + ".",
    b: (y1[t.k] || (() => ""))(t),
    a: t.done ? [] : r,
    r: `<small>${a}</small>+${K(t.r)}`,
  };
}
function G0() {
  const t = yt[s.gen],
    e = fr(),
    o = tc(),
    n = pt[s.lvl + 1];
  if (s.done)
    return {
      h: "Ten million a year.",
      b: `${s.lab} got there in <b>${cn(s.doneAt).long}</b>, from one robot built by hand. Keep building, or start a new company: every finished run makes the next one faster.`,
      a: [["Share your run", "share"]],
    };
  if (!s.chose && s.built > 0) {
    const r = t.price * Ct.price;
    return {
      t: "go",
      k: "Your first robot",
      h: "It works. Keep it, or ship it?",
      b: `Keep it and it builds the next one with you, twice as fast. Ship it and someone pays <b>${K(r)}</b> for it.`,
      a: [
        ["Keep it", "keep1"],
        [`Ship it \xB7 ${K(r)}`, "ship1"],
      ],
    };
  }
  if (lo())
    return {
      t: "go",
      h: `Brain v${s.gen + 2} has practised enough.`,
      b: `Update every robot at once: ${yt[s.gen + 1].cls.toLowerCase()}, ${Math.round((yt[s.gen + 1].skill / t.skill - 1) * 100)}% faster at the bench, and ${po(yt[s.gen + 1].round)} ${yt[s.gen + 1].round} round.`,
      a: [[`Update to v${s.gen + 2}`, "launch"]],
    };
  if (p.lineFull && s.chose && s.staff.gate !== 2) {
    const r = Je() && !s.staff.gate;
    return {
      t: "bad",
      h: "The line at the gate is full.",
      b: `${G(Math.floor(s.ready))} robots are waiting to go through, and the stations stop until they do.${r ? " An assistant can do it for you." : ""}`,
      a: [
        ["Send them through", "collect"],
        ...(r ? [[`Hire help \xB7 ${K(Tt.gate.wage)}/day`, "hire:gate"]] : []),
      ],
    };
  }
  {
    const r = s.trucks.filter((c) => c.got >= c.n);
    if (r.length && s.staff.dock !== 2) {
      const c = Math.min(...r.map((h) => (h.rush ? la : ra) - h.wait));
      if (c < 15) {
        const h = r.reduce((m, u) => m + u.n * p.price * (u.rush ? 2 : 1), 0),
          d = Je() && !s.staff.dock;
        return {
          t: "bad",
          h:
            r.length > 1
              ? `${r.length} loaded trucks are about to leave.`
              : "A loaded truck is about to leave.",
          b: `Sign for ${r.length > 1 ? "them" : "it"} in the next ${qt(Math.max(1, Math.ceil(c)), "day")}, or the driver goes without the robots.`,
          a: [
            [`Sign \xB7 +${K(h)}`, "sign"],
            ...(d
              ? [[`Hire help \xB7 ${K(Tt.dock.wage)}/day`, "hire:dock"]]
              : []),
          ],
        };
      }
    }
  }
  {
    const r = s.jams,
      c = s.staff.fix;
    if (
      r.length &&
      c !== 2 &&
      (c === 0 || r.some((h) => s.played - h.t > yi + 3))
    ) {
      const h = r.length,
        d = Je() && !c;
      return {
        t: "bad",
        h: h === 1 ? "A station has jammed." : `${h} stations have jammed.`,
        b: `${h === 1 ? "It builds" : "They build"} nothing until someone fixes ${h === 1 ? "it" : "them"}: click ${h === 1 ? "it" : "one"}, the bubble, or press Enter.${d ? " A technician can do it for you." : ""}`,
        a: [
          [h === 1 ? "Fix it" : "Fix all", "fixall"],
          ...(d
            ? [[`Hire a technician \xB7 ${K(Tt.fix.wage)}/day`, "hire:fix"]]
            : []),
        ],
      };
    }
  }
  if (p.brown < 0.98 && o?.k !== "built")
    return {
      t: "bad",
      h: "Out of power.",
      b: `You draw <b>${Yt(p.draw)}</b> and can supply <b>${Yt(p.cap)}</b>, so everything runs at <span class="r">${Math.round(p.brown * 100)}%</span>. Every robot you keep charges from it too.`,
      a: [["Buy power", "power"]],
    };
  if (p.under && s.chose && o?.k !== "stations") {
    const r = p.posts - p.crewed;
    return {
      t: "bad",
      h: `${qt(p.under, "station")} ${p.under === 1 ? "needs" : "need"} a crew.`,
      b: `${qt(r, "post")} ${r === 1 ? "is" : "are"} empty. Kept robots staff stations first, and you keep <b>${br()}%</b> of new ones.`,
      a: [["Keep more", "keepmore"]],
    };
  }
  if (p.starved) {
    const r = p.starved,
      c = P0(p.starvedCls),
      h = c ? [[`Pick ${c.name.toLowerCase()}`, "tool:" + c.id]] : [];
    return p.wrongCls
      ? {
          t: "bad",
          h: `${qt(p.wrongCls, "station")} need${p.wrongCls === 1 ? "s" : ""} better actuators.`,
          b: `${po(j0[p.starvedCls]).replace(/^./, (d) => d.toUpperCase())} ${j0[p.starvedCls]} takes <b>${wi[p.starvedCls]}</b>. The cell next to it is not good enough.`,
          a: h,
        }
      : {
          t: "bad",
          h: `${qt(r, "station")} ${r === 1 ? "is" : "are"} short of actuators.`,
          b: `Every robot takes ${wo}. Put an actuator cell next to ${r === 1 ? "it" : "them"}: amber tiles show where.`,
          a: h,
        };
  }
  if (o) return x1(o);
  if (Je()) {
    for (const h of ["gate", "dock", "fix"])
      if (s.gen >= Tt[h].gen && s.staff[h] !== 2)
        return {
          t: "go",
          h:
            h === "fix"
              ? "Robots can fix robots now."
              : `Robots can run the ${h} now.`,
          b:
            h === "gate"
              ? "They send every finished robot through as it arrives, and keep at it while you are away."
              : h === "dock"
                ? "They sign for every loaded truck, and keep at it while you are away."
                : "They fix a jammed station the moment it jams, and keep at it while you are away.",
          a: [
            [
              h === "fix" ? "Put robots on repairs" : `Put robots on the ${h}`,
              "bots:" + h,
            ],
          ],
        };
    if (s.gen >= Tt.build.gen && !s.staff.build)
      return {
        t: "go",
        h: "Robots can build factories now.",
        b: "Put them on the building sites: a crew for every six stations, and everything goes up twice as fast.",
        a: [["Robot builders", "bots:build"]],
      };
    const r = s.sites.length - Me(),
      c = xi[s.staff.crews || 0];
    if (r >= 2 && c != null)
      return {
        h: `${qt(r, "build")} waiting for a crew.`,
        b: `You have ${qt(Me(), "building crew")}, and each builds one thing at a time.`,
        a: [[`Hire a crew \xB7 ${K(c)}`, "crew"]],
      };
  }
  if (p.fill < 0.97 && F0()) {
    const r = mr(),
      c = fr();
    return p.makes >= p.D * 0.97
      ? {
          t: "bad",
          h: "Customers are waiting.",
          b: `${yt[s.gen].who.replace(/^./, (h) => h.toUpperCase())} order <b>${Xe(p.D)}</b> and the gate ships ${Xe(p.wantShip)}: you keep <b>${br()}%</b>. Ship more.`,
          a: [["Ship more", "shipmore"]],
        }
      : {
          t: "bad",
          h: "Customers are waiting.",
          b: `${yt[s.gen].who.replace(/^./, (h) => h.toUpperCase())} order <b>${Xe(p.D)}</b> and you make ${Xe(p.makes)}. More stations, crewed and fed.`,
          a:
            c > 0
              ? [[`Pick ${r.name.toLowerCase()}`, "tool:" + r.id]]
              : n
                ? [[`Expand \xB7 ${K(n[2])}`, "expand"]]
                : [],
        };
  }
  if (s.gen < he && p.learn <= 0)
    return {
      t: "bad",
      h: "Nobody is practising.",
      b: `Brain v${s.gen + 2} learns from kept robots that have no station to work at. Keep a few more than your stations need.`,
      a: [["Keep more", "keepmore"]],
    };
  if (n && !fn() && e <= Math.max(0, Math.floor(gt() * vt() * 0.12)))
    return {
      h: `Making ${G(Pt())} a year.`,
      b:
        e <= 0
          ? "The floor is full: expand it for more stations."
          : `The floor is nearly full, and expanding it takes the builders ${tl[s.lvl + 1]} days.`,
      a: [[`Expand \xB7 ${K(n[2])}`, "expand"]],
    };
  if (s.gen >= he)
    return {
      h: `Making ${G(Pt())} a year.`,
      b: `Ten million is the goal: ${Math.floor((Pt() / ia) * 100)}% of the way.`,
    };
  const a = (ro() - s.train) / Math.max(p.learn, 1e-9),
    i = `${G(p.gym)} robots practising: brain v${s.gen + 2} in <b>${a > 3e5 ? "a long time" : $0(a)}</b>.`,
    l = so.find((r) => $t(r) && !s.res[r.id] && s.cash >= r.cost);
  if (l && s.tut >= 2)
    return {
      h: `Making ${G(Pt())} a year.`,
      b: i + ` You can afford <b>${Ql(l)}</b>: ${pr(l)}.`,
      a: [["Open Research", "research"]],
    };
  if (e > 0 && s.cash >= To(mr()) * 1.5 && s.tut >= 2) {
    const r = mr();
    return {
      h: `Making ${G(Pt())} a year.`,
      b: i + ` Room for ${qt(e, "more station")}.`,
      a: [[`Pick ${r.name.toLowerCase()}`, "tool:" + r.id]],
    };
  }
  return {
    h: `Making ${G(Pt())} a year.`,
    b:
      i +
      (s.split > 0.85
        ? " Ship more to grow faster."
        : s.split < 0.15
          ? " Keep more to train faster."
          : ""),
  };
}
const j0 = ["workbench", "assembly cell", "robot line", "self-building line"],
  w1 = (t) =>
    (t.t || "") +
    "|" +
    (t.k || "") +
    "|" +
    t.h +
    "|" +
    (t.a || []).map((e) => e.join(":")).join(",");
function hn(t) {
  const e = v("#why"),
    o = w1(t);
  if (o !== hn.sig) {
    ((hn.sig = o),
      (hn.b = t.b),
      (hn.r = t.r),
      (e.className = "why " + (t.t || "")),
      (e.innerHTML = `${t.k ? `<i class="wk">${t.k}</i>` : ""}<b class="wh">${t.h}</b><span class="wb">${t.b}</span><span class="wa">${(t.a || []).map(([n, a]) => `<button class="go" data-act="${a}">${n}</button>`).join("")}${t.r ? `<em class="rw">${t.r}</em>` : ""}</span>`));
    return;
  }
  if (
    (t.b !== hn.b && ((hn.b = t.b), (e.querySelector(".wb").innerHTML = t.b)),
    t.r !== hn.r)
  ) {
    hn.r = t.r;
    const n = e.querySelector(".rw");
    n && (n.innerHTML = t.r);
  }
}
function Tn(t) {
  const e = Co.find((o) => o.dataset.tab === t);
  e && Te !== t && e.click();
}
function ec(t) {
  const e = At[t];
  !e ||
    !$t(e) ||
    (Tn("build"),
    (s.seen["tool_" + t] = 1),
    Vo(t),
    xt(`${e.name}: click a glowing tile, or drag across the floor`));
}
function v1() {
  const t = p.under ? 0.75 : 0.5;
  qo(Math.max(s.split + 0.25, t), "coach");
}
function N0() {
  const t = p.makes > 0 ? D(1 - p.D / p.makes, 0, 1) : 0;
  qo(Math.min(s.split - 0.25, Math.floor(t * 20) / 20), "coach");
}
function wr(t) {
  if ((O.tick(), t === "launch")) return Xa();
  if (t === "share") return Qa();
  if (t === "expand") return (Tn("build"), Ua());
  if (t === "keep1") return fa(!0);
  if (t === "ship1") return fa(!1);
  if (t === "fit") return qa();
  if (t === "keepmore") return v1();
  if (t === "shipmore") return N0();
  if (t === "collect") {
    jn("you") || xt("Nobody is waiting at the gate");
    return;
  }
  if (t === "sign") {
    Gn("you") || xt("No truck is loaded yet");
    return;
  }
  if (t === "crew") return z0();
  if (t.startsWith("hire:")) return O0(t.slice(5));
  if (t.startsWith("bots:")) return Zl(t.slice(5));
  if (t === "rushall") return o1();
  if (t === "fixall") {
    zn("you") || xt("Nothing has jammed");
    return;
  }
  if (t === "tourhello") {
    ((s.seen.tourHello = 1), Xt());
    return;
  }
  if (t === "tourdone" || t === "tourskip") {
    ((s.seen.tourDone = 1),
      Xt(),
      t === "tourskip" &&
        xt("Tour skipped \xB7 How to play is under the ? button"));
    return;
  }
  if (t.startsWith("split:")) return qo(+t.slice(6), "coach");
  if (t.startsWith("tool:")) return ec(t.slice(5));
  Tn(t);
}
v("#why").addEventListener("click", (t) => {
  const e = t.target.closest("[data-act]")?.dataset.act;
  e && wr(e);
});
function qa() {
  if (s.done) return;
  ((s.acc += s.built < 1 ? 0.075 : 0.025), s.stats.clicks++, O.fit?.());
  const t = p.you;
  t >= 0 &&
    Us(
      t,
      s.built < 1 ? `${Math.floor(D(s.acc, 0, 1) * 100)}%` : "+1 part",
      "c",
    );
}
function U0(t) {
  ((Js = t),
    Za(),
    v("#st-parts").classList.toggle("on", t),
    xt(
      t
        ? "Parts map on: green stations have their actuators, amber and red ones wait for them"
        : "Parts map off",
    ));
}
(document.querySelectorAll(".stat[data-meter]").forEach(
  (t) =>
    (t.onclick = () => {
      const e = t.dataset.meter;
      if ((O.tick(), e === "orders"))
        p.fill >= 0.97
          ? xt(
              `Every order filled: ${Xe(p.D)}. The rest of your robots are kept.`,
            )
          : p.makes >= p.D * 0.97
            ? N0()
            : fr() > 0
              ? ec(mr().id)
              : (Tn("build"),
                xt(
                  pt[s.lvl + 1]
                    ? "The floor is full: expand it, or swap old stations for better ones"
                    : "The floor is full: swap old stations for better ones",
                ));
      else if (e === "parts")
        if (p.starved) {
          const o = P0(p.starvedCls);
          o && ec(o.id);
        } else U0(!Js);
      else Tn("power");
    }),
),
  (v("#nation").onclick = () => {
    const t = js(s.built);
    xt(
      t.next
        ? `${G(t.next[0] - s.built)} more robots and you outnumber the people of ${t.next[1]}`
        : "More robots than the people of every country on the list",
    );
  }));
const Wa = (t, e) => {
  t.title !== e && (t.title = e);
};
function vr(t) {
  if (!t && z - D0 < 0.12) return;
  ((D0 = z),
    (v("#cash").textContent = K(s.cash)),
    (v("#rate").textContent = "+" + K(p.rev) + "/day"));
  {
    const h = js(s.built),
      d = Pt();
    ((v("#n-built").textContent =
      s.built === 1 ? "1 robot" : s.built.toLocaleString("en-US") + " robots"),
      (v("#n-cmp").innerHTML = h.past
        ? `more than the people of <em>${h.past[1]}</em>`
        : s.built
          ? "built so far"
          : "built so far: none yet"));
    const m = h.past ? h.past[0] : 0,
      u = h.next ? h.next[0] : m * 2 || 1;
    ((v("#n-bar").style.width =
      (D((s.built - m) / Math.max(u - m, 1), 0, 1) * 100).toFixed(1) + "%"),
      (v("#n-yr").textContent = G(d)),
      Wa(
        v("#nation"),
        h.next
          ? `${s.built.toLocaleString("en-US")} robots built. ${G(h.next[0] - s.built)} more to outnumber ${h.next[1]}. Making ${G(d)} a year.`
          : `${s.built.toLocaleString("en-US")} robots built.`,
      ));
  }
  const e = s.chose ? p.fill : 1,
    o = v("#st-orders"),
    n = e >= 0.97;
  ((v("#s-orders").textContent = Math.floor(e * 100) + "%"),
    (v("#b-orders").style.width = Math.round(e * 100) + "%"),
    o.classList.toggle("warn", !n && F0()),
    o.classList.toggle("ok", n),
    Wa(
      o,
      `${yt[s.gen].who.replace(/^./, (h) => h.toUpperCase())} order ${Xe(p.D)}; the gate ships ${Xe(Math.min(p.wantShip, p.D))}.${n ? " The rest is kept." : p.makes >= p.D ? " Click to ship more." : " Click to build more."}${s.rep < 0.995 ? ` A missed truck has orders at ${Math.round(s.rep * 100)}% for now.` : ""}`,
    ));
  const a = p.stations ? (p.stations - p.starved) / p.stations : 1,
    i = v("#st-parts");
  ((v("#s-parts").textContent = Math.floor(a * 100) + "%"),
    (v("#b-parts").style.width = Math.round(a * 100) + "%"),
    i.classList.toggle("warn", p.starved > 0),
    i.classList.toggle("ok", !p.starved),
    Wa(
      i,
      p.starved
        ? `${qt(p.starved, "station")} of ${p.stations} short of actuators. Click to pick an actuator cell.`
        : "Every station has its actuators. Click for the parts map.",
    ));
  const l = p.draw / Math.max(p.cap, 1e-9),
    r = v("#st-power");
  ((v("#s-power").innerHTML = `${Yt(p.draw).replace(" ", "<small>")}</small>`),
    (v("#b-power").style.width = Math.round(D(l, 0, 1) * 100) + "%"),
    r.classList.toggle("warn", p.brown < 0.995),
    r.classList.toggle("hot", p.brown >= 0.995 && l > 0.85),
    Wa(
      r,
      `Drawing ${Yt(p.draw)} of the ${Yt(p.cap)} you can supply.${p.brown < 0.995 ? " Click to buy power." : l > 0.85 ? " Nearly full: buy power soon." : ""}`,
    ));
  const c = yt[s.gen];
  if (
    ((v("#m-name").textContent = `v${s.gen + 1} \xB7 ${c.cls}`),
    Wa(v("#m-name"), c.what + "."),
    (v("#m-date").textContent = cn(s.played).short),
    s.gen < he)
  ) {
    const h = s.train / ro(),
      d = lo();
    ((v("#t-fill").style.width = (h * 100).toFixed(1) + "%"),
      v("#tbar").classList.toggle("done", d),
      (v("#t-l").innerHTML = d
        ? `<b>v${s.gen + 2}</b> is ready`
        : `Practising for <b>v${s.gen + 2}</b> \xB7 ${yt[s.gen + 1].cls}`));
    const m = (ro() - s.train) / Math.max(p.learn, 1e-9);
    v("#t-r").textContent = d
      ? "100%"
      : `${Math.floor(h * 100)}% \xB7 ${m > 36e3 ? "stalled" : l1(m)}`;
    const u = v("#launch");
    (u.classList.toggle("on", d),
      (u.textContent = `Update every robot to v${s.gen + 2}`));
  } else
    ((v("#t-fill").style.width = "100%"),
      (v("#t-l").innerHTML = "<b>The last brain</b>"),
      (v("#t-r").textContent =
        `${Math.floor(D(Pt() / ia, 0, 1) * 100)}% of 10M a year`),
      v("#launch").classList.remove("on"));
  v("#sp-made").textContent = `orders ${Xe(p.D)}`;
  {
    const h = v("#sx-keep");
    ((h.innerHTML = p.posts
      ? `<i>crews ${p.crewed}/${p.posts}</i>${p.gym ? ` \xB7 ${G(p.gym)} practising` : ""}`
      : `<i>${G(p.gym)} practising</i>`),
      (h.style.color = p.under && s.chose ? "#ff8fa3" : ""));
  }
  ((v("#sx-ship").innerHTML = `<b>+${K(p.rev)}</b>/day`),
    (v("#labname-t").textContent = s.lab),
    (v("#labname-n").textContent =
      Math.floor(s.kept) === 1
        ? "1 robot"
        : Math.floor(s.kept).toLocaleString("en-US") + " robots"),
    hn(G0()));
  {
    const h = Je();
    (Co[3].hidden === h && (Co[3].hidden = !h),
      h &&
        !s.seen.staff &&
        s.chose &&
        ((s.seen.staff = 1),
        Et(
          "Staff",
          "Hire an assistant for the gate or the dock, and more building crews. Robots take the jobs over once a brain can do them.",
          "c",
          ["Open Staff", () => Tn("staff")],
          { icon: "robot", kick: "New" },
        )));
  }
  L0();
  {
    const h = fn(),
      d = v("#exp-p"),
      m = v("#exp-r");
    if (h && d) {
      d.textContent = Math.floor((1 - h.left / h.T) * 100) + "%";
      const u = g0(h);
      ((m.textContent = `finish \xB7 ${K(u)}`),
        (m.style.color = s.cash < u ? "#ff8fa3" : ""));
    }
  }
  Va();
}
const kr = () => !s.seen.tourDone && !s.ng,
  V0 = ["nation", "split", "build", "parts", "orders", "power", "brain"],
  Ha = new f.Vector3(),
  q0 = () => {
    const t = p.you >= 0 ? p.you : _t(1, 1);
    return Ha.set((t % j) + 0.5, 0.62, -(Math.floor(t / j) + 0.5));
  },
  W0 = (t, e = 0.55) => Ha.set((t % j) + 0.5, e, -(Math.floor(t / j) + 0.5));
function k1() {
  if (!kr() || Vt || ge || bo.classList.contains("ui-off")) return null;
  const t = tc(),
    e =
      t && (t.done || Rr(t) >= 1)
        ? go[go.findIndex((r) => r.k === t.k) + 1]?.k || "over"
        : t?.k,
    o = { k: e },
    n = K(yt[s.gen].price * Ct.price),
    a = s.trucks.some((r) => r.got >= r.n),
    i = s.ready >= 1 && s.chose;
  if (!s.seen.tourHello)
    return {
      id: "hello",
      h: "A nation of robots",
      b: "You start with one workbench in a garage. Ship robots to pay for a factory, keep robots to build more of them, and grow it to <b>ten million robots a year</b>.",
      a: [["Let's start", "tourhello"]],
      tgt: {
        w3: Ha.set(gt() * 0.5, 0.7, -vt() * 0.5),
        r: Math.max(gt(), vt()) * 0.6,
        max: 300,
      },
    };
  if (p.brown < 0.98 && s.built >= 1) {
    const r = Te === "power",
      c = s.proj.find((h) => h.kind === "plant");
    return c
      ? {
          id: "powerwait",
          rv: ["power", "build"],
          h: "Power on the way",
          b: `The ${/^[A-Z][a-z]/.test(tn[c.id].name) ? tn[c.id].name.toLowerCase() : tn[c.id].name} goes in over ${qt(Math.max(1, Math.ceil(c.left / ys())), "day")}. Until then everything runs at <b>${Math.round(p.brown * 100)}%</b>.`,
          tgt: { dom: "#st-power" },
        }
      : {
          id: "power",
          rv: ["power", "build"],
          h: "Out of power",
          b: `You draw <b>${Yt(p.draw)}</b> and can supply ${Yt(p.cap)}, so everything slows down. Every robot you keep charges from it too. ${r ? "Buy the 200 A service." : "Open Power."}`,
          tgt: {
            dom: r
              ? '#pane-power .row[data-p="panel"]'
              : '.tabs button[data-tab="power"]',
          },
        };
  }
  if (s.built < 1)
    return {
      id: "bench",
      h: "Your first robot",
      b: `It is nearly done. Click it to fit its last parts. <b>${Math.floor(D(s.acc, 0, 1) * 100)}%</b>`,
      a: [["Fit a part", "fit"]],
      tgt: { w3: q0(), r: 0.6 },
    };
  if (!s.chose)
    return {
      id: "choice",
      h: "Keep it, or ship it?",
      b: `Every robot you finish walks out to this gate. Ship it and a customer pays <b>${n}</b>. Keep it and it works beside you, so the next one comes twice as fast.`,
      a: [
        ["Keep it", "keep1"],
        [`Ship it \xB7 ${n}`, "ship1"],
      ],
      tgt: { w3: Ha.set(Mt, 1, dt - 0.45), r: 0.9 },
    };
  const l = {
    id: "sign",
    rv: ["split", "orders"],
    h: "Sign for the truck",
    b: "The truck takes your robots to the customer. Click it, or press Enter, to sign: they pay when it leaves.",
    tgt: { tag: Ks },
  };
  if (s.stats.trucks < 1 && a) return l;
  if (p.lineFull && i)
    return {
      id: "full",
      rv: ["split"],
      h: "The line is full",
      b: "The stations stop until the robots at the gate go through. Click the bubble, or press Enter.",
      tgt: { tag: ns },
    };
  if (p.under && s.split < 0.5 && o?.k !== "stations")
    return {
      id: "crew",
      rv: ["split"],
      h: "A station needs its crew",
      b: "Every station needs robots to work it, and kept robots staff the stations first. Keep more of the next ones.",
      a: [["Keep more", "keepmore"]],
      tgt: { dom: "#sl" },
    };
  if (o?.k === "crew")
    return s.split < 0.5
      ? {
          id: "keep",
          rv: ["split"],
          h: "Keep the next one",
          b: "Drag the gate toward <b>Keep</b>: a kept robot walks back in and works beside you.",
          a: [["Keep it", "split:1"]],
          tgt: { dom: "#sl" },
        }
      : i
        ? {
            id: "line",
            rv: ["split"],
            h: "Send it through",
            b: "Finished robots wait at the gate until you send them through. Click the bubble over it, or press Enter.",
            tgt: { tag: ns },
          }
        : {
            id: "wait1",
            rv: ["split"],
            h: "The next one is on the bench",
            b: "Frame, motors, shell, power on: when it is done it walks out and waits at the gate. Click it to fit parts and speed it up.",
            tgt: { w3: q0(), r: 0.6 },
          };
  if (o?.k === "stations") {
    const r = ["split", "build", "parts"],
      c = s.sites[0];
    if (c)
      return {
        id: "site",
        rv: r,
        h: "Going up",
        b: `Building takes time: a workbench takes ${tf.bench} days. You have ${qt(Me(), "building crew")}, and each builds one thing at a time.`,
        tgt: { w3: W0(c.k, 1.05), r: 0.95 },
      };
    if (Ht === "bench") {
      const h = zs(At.bench);
      return {
        id: "tile",
        rv: r,
        h: "Put it here",
        b: "Click the glowing tile. The winding bench next to it makes the motors it needs.",
        tgt: h >= 0 ? { w3: W0(h, kt + 0.02), r: 0.5 } : null,
      };
    }
    return Te === "build"
      ? {
          id: "build",
          rv: r,
          h: "Build a second workbench",
          b: "More stations make more robots. Pick the workbench in Build.",
          tgt: { dom: '#pane-build .item[data-id="bench"]' },
        }
      : {
          id: "build",
          rv: r,
          h: "Build a second workbench",
          b: "More stations make more robots. Open Build, then pick the workbench.",
          tgt: { dom: '.tabs button[data-tab="build"]' },
        };
  }
  if (o?.k === "ship") {
    const r = ["split", "build", "parts", "orders"];
    return a
      ? { ...l, rv: r }
      : s.split > 0.6
        ? {
            id: "ship",
            rv: r,
            h: "Ship some",
            b: "Money only comes from robots you ship. Drag the gate toward <b>Ship</b>.",
            a: [["Ship half", "split:.5"]],
            tgt: { dom: "#sl" },
          }
        : i
          ? {
              id: "line2",
              rv: r,
              h: "Send them through",
              b: "The robots you ship walk out to the truck at the dock.",
              tgt: { tag: ns },
            }
          : {
              id: "wait2",
              rv: r,
              h: "Ship three robots",
              b: `Send them through the gate, then sign for the truck. <b>${G(s.shipped)} of 3</b> so far.`,
              tgt: {
                w3: Ha.set((F.x0 + F.x1) / 2, 0.6, (F.z0 + F.z1) / 2),
                r: 1.3,
              },
            };
  }
  if (o.k === "launch" || (o.k !== "over" && lo())) {
    const r = ["split", "build", "parts", "orders", "brain"];
    return lo()
      ? {
          id: "launch",
          rv: r,
          h: "Update every robot",
          b: `Brain v${s.gen + 2} has practised enough. One click updates every robot you have ever built, at once.`,
          tgt: { dom: "#launch" },
        }
      : s.trucks.some((c) => c.got >= c.n && (c.rush ? la : ra) - c.wait < 15)
        ? {
            ...l,
            rv: r,
            h: "Sign before it leaves",
            b: "A loaded truck is about to leave without your robots. Click it, or press Enter, to sign: they pay when it leaves.",
          }
        : p.gym < 1
          ? i
            ? {
                id: "line3",
                rv: r,
                h: "Send them through",
                b: "Kept robots with no station to work at walk on to the yard and practise there. The more of them, the faster the next brain.",
                tgt: { tag: ns },
              }
            : {
                id: "yard",
                rv: r,
                h: "Keep a few more",
                b: "Kept robots with no station to work at practise in the yard, and practice trains the next brain. Nobody is practising yet.",
                a: [["Keep more", "keepmore"]],
                tgt: { dom: "#sl" },
              }
          : {
              id: "practise",
              rv: r,
              h: "Practice trains the next brain",
              b: `${G(p.gym)} ${p.gym === 1 ? "robot is" : "robots are"} practising in the yard. Send robots through the gate as they finish: the kept ones join them. When the bar fills, update every robot at once.`,
              tgt: { dom: "#tbar" },
            };
  }
  return yr() || o.k === "over"
    ? {
        id: "done",
        rv: V0,
        h: "Over to you",
        b: "Missions are top left. When the chores pile up, hire help in <b>Staff</b>. Ten million robots a year is the goal.",
        a: [["Let me build", "tourdone"]],
        tgt: null,
      }
    : null;
}
function M1(t) {
  if (!t) return null;
  const e = Dt.getBoundingClientRect();
  if (t.dom) {
    const o = v(t.dom);
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
  if (t.tag) {
    if (!t.tag.on) return null;
    const o = t.tag.e.getBoundingClientRect();
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
  if (t.w3) {
    if ((J.copy(t.w3).project(H), J.z > 1)) return null;
    const o = (J.x * 0.5 + 0.5) * e.width,
      n = (-J.y * 0.5 + 0.5) * e.height,
      a = H.position.distanceTo(t.w3),
      i =
        e.height /
        (2 * Math.tan(f.MathUtils.degToRad(H.fov / 2)) * Math.max(a, 0.1)),
      l = D(t.r * i, 30, t.max || 170);
    return { x: o - l, y: n - l, w: l * 2, h: l * 2, rr: l };
  }
  return null;
}
const at = {
  el: v("#guide"),
  path: v("#guide .gdim path"),
  ring: v("#guide .gring"),
  call: v("#guide .gcall"),
  sig: "",
  id: "",
  h: null,
  cw: 0,
  ch: 0,
  mob: null,
};
at.call.addEventListener("click", (t) => {
  const e = t.target.closest("[data-act]")?.dataset.act;
  e && wr(e);
});
function S1(t) {
  const e = kr(),
    o = k1();
  if (e && (s.built >= 1 && (s.seen.rv_nation = 1), o?.rv))
    for (const R of o.rv) s.seen["rv_" + R] = 1;
  bo.classList.contains("tour") !== e && bo.classList.toggle("tour", e);
  for (const R of V0) {
    const $ = !e || !!s.seen["rv_" + R];
    bo.classList.contains("rv-" + R) !== $ && bo.classList.toggle("rv-" + R, $);
  }
  const n = !!o && !document.querySelector("dialog[open]");
  if (
    (at.el.classList.contains("on") !== n && at.el.classList.toggle("on", n),
    !n)
  ) {
    at.id = "";
    return;
  }
  const a = ["wait1", "site", "wait2", "practise", "powerwait"].includes(o.id);
  at.el.classList.contains("soft") !== a && at.el.classList.toggle("soft", a);
  const i = tc(),
    l = i && Ns(i) ? go.findIndex((R) => R.k === i.k) + 1 : 0,
    r =
      o.id +
      "|" +
      o.h +
      "|" +
      o.b +
      "|" +
      (o.a || []).map((R) => R.join(":")).join(",") +
      "|" +
      l;
  if (r !== at.sig) {
    at.sig = r;
    const R = o.id === "hello" || o.id === "done";
    ((at.call.innerHTML = `<i class="gk"><span>${R ? (o.id === "hello" ? "Welcome" : "The tour") : l ? `First steps \xB7 ${l} of ${go.length}` : "The tour"}</span>${l && !R ? `<em>+${K(i.r)}</em>` : ""}</i><b class="gh">${o.h}</b><p class="gb">${o.b}</p><span class="ga">${(o.a || []).map(([$, L]) => `<button data-act="${L}">${$}</button>`).join("")}${o.id === "done" ? "" : '<button class="gskip" data-act="tourskip">Skip the tour</button>'}</span>`),
      (at.cw = 0));
  }
  const c = Dt.getBoundingClientRect(),
    h = c.width,
    d = c.height;
  (at.mob !== ee &&
    ((at.mob = ee),
    (at.call.style.width = ee ? `${Math.max(200, h - 24)}px` : ""),
    (at.cw = 0)),
    at.cw || ((at.cw = at.call.offsetWidth), (at.ch = at.call.offsetHeight)));
  const m = M1(o.tgt),
    u = at.id !== o.id;
  if (((at.id = o.id), m))
    if (!at.h || u) at.h = { ...m };
    else {
      const R = 1 - Math.exp(-t * 14);
      for (const $ of ["x", "y", "w", "h", "rr"])
        at.h[$] += (m[$] - at.h[$]) * R;
    }
  else at.h = null;
  const g = at.h;
  if (g) {
    const { x: R, y: $, w: L } = g,
      _ = g.h,
      I = Math.min(g.rr, L / 2, _ / 2);
    at.path.setAttribute(
      "d",
      `M0 0H${h}V${d}H0Z M${R + I} ${$}H${R + L - I}A${I} ${I} 0 0 1 ${R + L} ${$ + I}V${$ + _ - I}A${I} ${I} 0 0 1 ${R + L - I} ${$ + _}H${R + I}A${I} ${I} 0 0 1 ${R} ${$ + _ - I}V${$ + I}A${I} ${I} 0 0 1 ${R + I} ${$}Z`,
    );
    const P = at.ring.style;
    ((P.display = ""),
      (P.left = R + "px"),
      (P.top = $ + "px"),
      (P.width = L + "px"),
      (P.height = _ + "px"),
      (P.borderRadius = I + "px"));
  } else (at.path.setAttribute("d", ""), (at.ring.style.display = "none"));
  const b = at.cw,
    y = at.ch,
    w = [];
  for (const R of [".ctl", ".side"]) {
    const $ = v(R);
    if ($) {
      const L = $.getBoundingClientRect();
      L.width > 2 && L.height > 2 && w.push(L);
    }
  }
  {
    const R = getComputedStyle(document.documentElement),
      $ = parseFloat(R.getPropertyValue("--sael-corner-w")) || 0,
      L = parseFloat(R.getPropertyValue("--sael-corner-h")) || 0;
    $ &&
      L &&
      w.push({ left: h - $ - 24, top: d - L - 24, right: h, bottom: d });
  }
  const x = g
      ? { left: g.x, top: g.y, right: g.x + g.w, bottom: g.y + g.h }
      : null,
    M = (R, $, L) =>
      R < L.right + 8 &&
      R + b > L.left - 8 &&
      $ < L.bottom + 8 &&
      $ + y > L.top - 8,
    T = [];
  if (x) {
    const R = (x.left + x.right) / 2,
      $ = (x.top + x.bottom) / 2;
    T.push(
      [R - b / 2, x.bottom + 18],
      [R - b / 2, x.top - 18 - y],
      [x.left - 18 - b, $ - y / 2],
      [x.right + 18, $ - y / 2],
      [x.left - 18 - b, x.bottom + 18],
      [x.right + 18, x.bottom + 18],
    );
  } else T.push([h / 2 - b / 2, d * 0.6 - y / 2], [h / 2 - b / 2, d * 0.25]);
  let k = 0,
    S = 0,
    C = 1e9;
  (T.forEach(([R, $], L) => {
    ((R = D(R, 12, Math.max(12, h - b - 12))),
      ($ = D($, 12, Math.max(12, d - y - 12))));
    let _ = L;
    x && M(R, $, x) && (_ += 1e3);
    for (const I of w) M(R, $, I) && (_ += 100);
    _ < C && ((C = _), (k = R), (S = $));
  }),
    (at.call.style.transform = `translate(${k.toFixed(1)}px,${S.toFixed(1)}px)`),
    u &&
      ((at.call.style.transition = "none"),
      at.call.offsetWidth,
      (at.call.style.transition = "")));
}
const Ya = [];
for (let t = 0; t < 12; t++) {
  const e = document.createElement("button");
  ((e.className = "tim3"),
    (e.k = -1),
    (e.innerHTML =
      '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><circle class="f" cx="10" cy="10" r="7.5"/></svg><span></span>'),
    (e.onclick = () => {
      e.k >= 0 && ie[e.k] && (Vo(null), ze(e.k), O.tick());
    }),
    v("#float").appendChild(e),
    Ya.push(e));
}
const Mr = [];
function $1() {
  let t = 0;
  if (Xs && !ge && s.sites.length && !bo.classList.contains("ui-off")) {
    const e = Dt.getBoundingClientRect(),
      o = Me(),
      n = e.height / (2 * Math.tan(f.MathUtils.degToRad(H.fov / 2)));
    ((Mr.length = 0),
      s.sites.forEach((a, i) => {
        if (i > 60) return;
        const l = a.k % j,
          r = Math.floor(a.k / j);
        (J.set(l + 0.5, kt + 1.9, -(r + 0.5)),
          Mr.push([a, i, H.position.distanceTo(J)]));
      }),
      Mr.sort((a, i) => a[2] - i[2]));
    for (const [a, i, l] of Mr) {
      if (t >= Ya.length) break;
      const r = n / Math.max(l, 0.1);
      if (r < 26) continue;
      const c = a.k % j,
        h = Math.floor(a.k / j);
      if ((J.set(c + 0.5, kt + 1.9, -(h + 0.5)).project(H), J.z > 1)) continue;
      const d = Ya[t++],
        m = i < o,
        u = m ? D(1 - a.left / a.T, 0, 1) : 0,
        g = Math.max(1, Math.ceil(a.left / ys())),
        b = r >= 70;
      ((d.k = a.k),
        d.classList.contains("on") || d.classList.add("on"),
        d.classList.toggle("wait", !m),
        d.classList.toggle("big", b),
        (d.style.transform = `translate(${((J.x * 0.5 + 0.5) * e.width).toFixed(1)}px,${((-J.y * 0.5 + 0.5) * e.height).toFixed(1)}px) translate(-50%,-100%)`),
        (d.children[0].children[1].style.strokeDashoffset = (
          47.12 *
          (1 - u)
        ).toFixed(2)));
      const y = b ? (m ? `${g} ${g === 1 ? "day" : "days"}` : "waiting") : "";
      (d.t !== y && ((d.children[1].textContent = y), (d.t = y)),
        (d.title = m
          ? `${Q[a.ix].name}: ${g} ${g === 1 ? "day" : "days"} to go \xB7 click to finish it now`
          : `${Q[a.ix].name}: waiting for a crew`));
    }
  }
  for (let e = t; e < Ya.length; e++) {
    const o = Ya[e];
    o.classList.contains("on") && (o.classList.remove("on"), (o.k = -1));
  }
}
const Ka = [],
  R1 = ["frame", "motors", "shell", "power on"],
  T1 = (t) => (t < 0.34 ? 0 : t < 0.62 ? 1 : t < 0.9 ? 2 : 3);
for (let t = 0; t < 10; t++) {
  const e = document.createElement("div");
  ((e.className = "prod3"),
    (e.innerHTML =
      '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><circle class="f" cx="10" cy="10" r="7.5"/></svg><span></span>'),
    v("#float").appendChild(e),
    Ka.push(e));
}
function A1() {
  let t = 0;
  if (
    Xs &&
    !ge &&
    !Vt &&
    s.chose &&
    se.length <= 16 &&
    !bo.classList.contains("ui-off")
  ) {
    const e = Dt.getBoundingClientRect(),
      o = e.height / (2 * Math.tan(f.MathUtils.degToRad(H.fov / 2))),
      n = Is() ? p.you : -1;
    for (const a of se) {
      if (t >= Ka.length) break;
      if (pe[a] || ie[a]) continue;
      const i = a % j,
        l = Math.floor(a / j),
        r = Q[s.cells[a]].id === "bench";
      J.set(i + 0.5, kt + (r ? 0.98 : 1.62), -(l + 0.5));
      const c = H.position.distanceTo(J),
        h = o / Math.max(c, 0.1);
      if (
        h < 40 ||
        (J.project(H),
        J.z > 1 || Math.abs(J.x) > 0.97 || J.y > 0.9 || J.y < -0.97) ||
        ((J.x * 0.5 + 0.5) * e.width > e.width - Vs[0] - 30 &&
          (-J.y * 0.5 + 0.5) * e.height > e.height - Vs[1])
      )
        continue;
      let d;
      if (a === n) d = D(s.acc, 0, 1);
      else {
        const x = Ji[a * 2],
          M = Es[a * 2];
        d = x > 0 ? (((z * x + M) % 1) + 1) % 1 : Math.max(0.05, M);
      }
      const m = Ka[t++],
        u = T1(d),
        g = h >= 70;
      (m.classList.contains("on") || m.classList.add("on"),
        m.classList.toggle("big", g),
        m.st !== u &&
          ((m.className = "prod3 on" + (g ? " big" : "") + " s" + u),
          (m.st = u)));
      const b = (J.x * 0.5 + 0.5) * e.width,
        y = (-J.y * 0.5 + 0.5) * e.height;
      ((m.style.transform = `translate(${b.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-100%)`),
        (m.children[0].children[1].style.strokeDashoffset = (
          47.12 *
          (1 - d)
        ).toFixed(2)));
      const w = g ? R1[u] : "";
      m.t !== w && ((m.children[1].textContent = w), (m.t = w));
    }
  }
  for (let e = t; e < Ka.length; e++) {
    const o = Ka[e];
    o.classList.contains("on") && o.classList.remove("on");
  }
}
const Sr = {
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
  robot:
    '<path d="M7 10a5 5 0 0 1 10 0v2.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9.5 11h5"/><path d="M8 18h8M9.5 14.5V21M14.5 14.5V21"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  wrench:
    '<path d="M15.5 3.5a4.5 4.5 0 0 0-4.3 5.9L3.8 16.8a1.9 1.9 0 0 0 2.7 2.7l7.4-7.4a4.5 4.5 0 0 0 5.9-4.3l-2.6 2.6-2.7-.6-.6-2.7z"/>',
};
function C1(t, e, o, n = 850) {
  const a = performance.now(),
    i = () => {
      const l = Math.min(1, (performance.now() - a) / n),
        r = 1 - Math.pow(1 - l, 3);
      ((t.textContent = o(e * r)), l < 1 && requestAnimationFrame(i));
    };
  i();
}
function Et(t, e, o = "c", n, a = {}) {
  const i = document.createElement("div");
  ((i.className = "toast k-" + o + (a.gold ? " gold" : "")),
    i.style.setProperty("--life", (a.life || (n ? 8 : 5.2)) + "s"),
    (i.innerHTML = `<span class="ic">${a.svg ? `<span class="brandmark">${a.svg}</span>` : `<svg viewBox="0 0 24 24" aria-hidden="true">${Sr[a.icon || "spark"]}</svg>`}</span><div class="tx">${a.kick ? `<i class="kick">${a.kick}</i>` : ""}<b>${t}</b>${a.big || a.count ? `<span class="big">${a.big || ""}</span>` : ""}${e ? `<p>${e}</p>` : ""}${a.items ? `<span class="chips">${a.items.map((c) => `<span title="${At[c]?.name || tn[c]?.name || ""}">${Ao[c] || Ao.bolt}</span>`).join("")}</span>` : ""}${n ? `<button>${n[0]}</button>` : ""}</div><u class="tm"></u>`),
    n && (i.querySelector("button").onclick = n[1]));
  const l = v("#toasts");
  if (
    (l.appendChild(i),
    requestAnimationFrame(() =>
      requestAnimationFrame(() => i.classList.add("in")),
    ),
    a.count)
  ) {
    const [c, h] = a.count;
    C1(i.querySelector(".big"), c, h);
  }
  const r = [...l.children].filter((c) => !c.classList.contains("out"));
  if (r.length > (ee ? 1 : 2)) {
    const c = r[0];
    (c.classList.add("out"), setTimeout(() => c.remove(), 380));
  }
  i.querySelector(".tm").addEventListener("animationend", () => {
    (i.classList.add("out"), setTimeout(() => i.remove(), 380));
  });
}
const $r = v("#ui-hint");
let H0 = -9;
function xt(t) {
  (($r.textContent = t), $r.classList.add("on"), (H0 = z));
}
let Y0 = -99;
function K0(t, e, o, n) {
  ((v("#bn-k").textContent = t),
    (v("#bn-t").textContent = e),
    (v("#bn-p").innerHTML = o),
    (v("#bn-share").style.display = n ? "" : "none"),
    v("#banner").classList.add("on"),
    (Y0 = z));
}
v("#bn-share").onclick = () => Qa();
const X0 = v("#float"),
  dn = [];
for (let t = 0; t < 28; t++) {
  const e = document.createElement("div");
  ((e.className = "fl"),
    X0.appendChild(e),
    dn.push({ e, t: -9, p: new f.Vector3() }));
}
let oc = 0;
function Us(t, e, o = "", n) {
  const a = dn[oc++ % dn.length],
    i = t % j,
    l = Math.floor(t / j);
  (a.p.set(
    i + 0.2 + ce() * 0.6,
    kt + 1.25 + ce() * 0.3,
    -(l + 0.2 + ce() * 0.6),
  ),
    (a.t = z),
    (a.e.textContent = e),
    (a.e.className = "fl" + (o ? " " + o : "") + (n ? " big" : "")));
}
function J0(t, e, o = "", n) {
  const a = dn[oc++ % dn.length];
  (a.p.copy(t),
    (a.t = z),
    (a.e.textContent = e),
    (a.e.className = "fl" + (o ? " " + o : "") + (n ? " big" : "")));
}
function L1() {
  const t = Dt.getBoundingClientRect();
  for (const e of dn) {
    const o = z - e.t;
    if (o > 1.6) {
      e.e.style.opacity !== "0" && (e.e.style.opacity = "0");
      continue;
    }
    if ((J.copy(e.p).project(H), J.z > 1)) {
      e.e.style.opacity = "0";
      continue;
    }
    const n = (J.x * 0.5 + 0.5) * t.width,
      a = (-J.y * 0.5 + 0.5) * t.height - o * 34;
    ((e.e.style.transform = `translate(${n.toFixed(1)}px,${a.toFixed(1)}px) translate(-50%,-100%)`),
      (e.e.style.opacity = (o < 0.15 ? o / 0.15 : 1 - Bo(1, 1.6, o)).toFixed(
        2,
      )));
  }
}
function An(t = "") {
  const e = document.createElement("div");
  return (
    (e.className = "tag3 " + t),
    (e.innerHTML = "<i></i><span></span><small></small>"),
    X0.appendChild(e),
    { e, on: !1, p: new f.Vector3() }
  );
}
let nc = null,
  Q0 = null,
  Z0 = -1;
const sc = [];
let Vs = [300, 300];
function E1(t) {
  const e = getComputedStyle(document.documentElement),
    o = parseFloat(e.getPropertyValue("--sael-corner-w")),
    n = parseFloat(e.getPropertyValue("--sael-corner-h")),
    a = t.width < 900;
  return [
    D(o > 0 ? o + 24 : a ? 220 : 300, 0, 320),
    D(n > 0 ? n + 24 : a ? 40 : 300, 0, 320),
  ];
}
function Ge(t, e, o, n, a, i) {
  if (((t.on = i), t.e.classList.toggle("on", i), !i)) return;
  const l = Dt.getBoundingClientRect();
  if ((J.copy(e).project(H), J.z > 1)) {
    t.e.classList.remove("on");
    return;
  }
  (t.txt !== o && ((t.e.children[1].textContent = o), (t.txt = o), (t.w = 0)),
    t.sub !== n && ((t.e.children[2].textContent = n), (t.sub = n), (t.w = 0)),
    a && t.dot !== a && ((t.e.children[0].style.background = a), (t.dot = a)));
  let r = (J.x * 0.5 + 0.5) * l.width,
    c = (-J.y * 0.5 + 0.5) * l.height;
  if (t.e.classList.contains("click")) {
    if (Z0 !== z) {
      ((Z0 = z), (sc.length = 0));
      const u = v(".ctl");
      nc =
        u && !bo.classList.contains("ui-off")
          ? u.getBoundingClientRect()
          : null;
      const g = v(".side");
      ((Q0 = g && nc ? g.getBoundingClientRect() : null), (Vs = E1(l)));
    }
    t.w || ((t.w = t.e.offsetWidth), (t.h = t.e.offsetHeight));
    const h = nc,
      d = t.w / 2 + 10,
      m = t.h + 10;
    if (
      h &&
      r + d > h.left &&
      r - d < h.right &&
      c > h.top &&
      c - m < h.bottom
    ) {
      const u = h.left - d - r,
        g = h.top - c;
      Math.abs(u) <= Math.abs(g) && h.left - d * 2 > 0 ? (r += u) : (c += g);
    }
    {
      const u = Q0;
      u &&
        r + d > u.left &&
        r - d < u.right &&
        c > u.top &&
        c - m < u.bottom &&
        (ee ? (c = u.bottom + m) : (r = u.right + d));
    }
    ((r = D(r, t.w / 2 + 8, Math.max(t.w / 2 + 8, l.width - t.w / 2 - 8))),
      r + t.w / 2 > l.width - Vs[0] &&
        c > l.height - Vs[1] - 6 &&
        (c = l.height - Vs[1] - 6));
    for (const u of sc)
      Math.abs(r - u[0]) < (t.w + u[2]) / 2 + 6 &&
        Math.abs(c - u[1]) < (t.h + u[3]) / 2 + 4 &&
        (c = u[1] + (c >= u[1] ? 1 : -1) * ((t.h + u[3]) / 2 + 4));
    sc.push([r, c, t.w, t.h]);
  }
  t.e.style.transform = `translate(${r.toFixed(1)}px,${c.toFixed(1)}px) translate(-50%,-100%)`;
}
let th = -99,
  I1 = 0;
function eh(t) {
  if (t < 100) return Math.round(t);
  const e = 10 ** (Math.floor(Math.log10(t)) - 1);
  return Math.round(t / e) * e;
}
function ac() {
  const t = Lr(gh),
    e = Math.hypot(gt(), vt()) + Math.max(16, -Ei() + 8);
  (an.wave.value.set(z, e / 2.6, 1.4, e), an.waveC.value.set(t.x, 0, t.z));
}
function Xa() {
  if (!lo()) return;
  const t = p.rev,
    e = s.gen;
  (s.gen++, (s.train = 0), (s.since = 0), (th = z), (I1 = e));
  const o = Q.filter((h) => h && h.gen === s.gen),
    n = o.reduce((h, d) => h + d.cost, 0),
    a = eh(Math.max(90 * t, 1.5 * n, 5e3));
  ((s.cash += a),
    s.launches.push({ gen: s.gen, at: Math.round(s.played) }),
    Dn(),
    ke(),
    Ro(),
    (Jt = !0),
    O.launch(),
    Ta(),
    ac());
  const i = yt[s.gen],
    l = yt[e];
  (setTimeout(
    () =>
      Et(
        `${i.round} round closed`,
        `Investors watched v${s.gen + 1} ${i.what.toLowerCase().replace(/^it /, "")}.`,
        "a",
        null,
        { icon: "coin", kick: "Funding", count: [a, (h) => "+" + K(h)] },
      ),
    700,
  ),
    K0(
      `${i.round} \xB7 ${K(a)} raised`,
      `Brain v${s.gen + 1} is out`,
      `${i.what} \xB7 every robot updated at once \xB7 <em>${Math.round((i.skill / l.skill - 1) * 100)}% faster</em>, sells for ${K(i.price * Ct.price)}`,
      !0,
    ));
  const r = [
    ...o.map((h) => h.name),
    ...Po.filter((h) => h.gen === s.gen).map((h) => h.name),
  ];
  r.length &&
    setTimeout(
      () =>
        Et(
          r.length > 1 ? "New hardware to build" : "New hardware",
          r.join(", ") + ".",
          "c",
          null,
          {
            icon: "chip",
            kick: "Unlocked with v" + (s.gen + 1),
            items: [
              ...o.map((h) => h.id),
              ...Po.filter((h) => h.gen === s.gen).map((h) => h.id),
            ],
          },
        ),
      1400,
    );
  const c = so.filter((h) => h.gen === s.gen).length;
  (c &&
    setTimeout(
      () =>
        Et(
          `${qt(c, "new technique")} to try`,
          so
            .filter((h) => h.gen === s.gen)
            .map((h) => Ql(h))
            .join(", ") + ".",
          "g",
          null,
          { icon: "flask", kick: "Research unlocked" },
        ),
      2600,
    ),
    Xt());
}
function B1() {
  ((s.done = !0), (s.doneAt = s.played), (s.ends = (s.ends || 0) + 1));
  const t = s.played;
  ((!s.best || t < s.best) && (s.best = t), Xt());
  const e = js(s.built);
  (O.launch(),
    ac(),
    K0(
      "Ten million a year",
      "A nation of robots",
      `${s.lab} makes ten million robots a year, by <em>${cn(t).long}</em>`,
      !0,
    ),
    setTimeout(() => {
      ((v("#end-h").textContent = `${s.lab} makes ten million a year`),
        (v("#end-p").innerHTML =
          `From one robot built by hand in a garage to a gigafactory, by <b>${cn(t).long}</b>. You have built <b>${s.built.toLocaleString("en-US")}</b> robots${e.past ? `, more than the people of ${e.past[1]}` : ""}${s.best === t && s.ends > 1 ? ". Your fastest run yet" : ""}.`),
        (v("#end-kv").innerHTML = [
          ["Reached", cn(t).long],
          ["Robots built", G(s.built)],
          ["A year", G(Pt())],
          ["Kept, working", G(Math.floor(s.kept))],
          ["Earned", K(s.earned)],
          ["Runs finished", s.ends],
        ]
          .map(([o, n]) => `<div><i>${o}</i><b>${n}</b></div>`)
          .join("")),
        v("#d-end").showModal());
    }, 2600));
}
function _1() {
  const t = { ends: s.ends, best: s.best, lab: s.lab, named: s.named };
  ((s = xn((s.ng || 0) + 1)),
    Object.assign(s, t),
    (s.tut = 2),
    Mi(),
    ta(),
    Et("A new garage", "Everything you learned comes with you.", "a", null, {
      icon: "garage",
      kick: "New company",
      big: `+${s.ng * 50}% robots a day`,
    }));
}
const D1 = [
    "Getting started",
    "Brains",
    "Floors",
    "A nation",
    "Production",
    "Workforce and power",
    "Money",
    "Events",
    "Mastery",
  ],
  P1 = [
    [800, "Vatican City"],
    [1e4, "Tuvalu"],
    [39e3, "Monaco"],
    [39e4, "Iceland"],
    [67e4, "Luxembourg"],
    [137e4, "Estonia"],
    [53e5, "Ireland"],
    [89e5, "Switzerland"],
    [106e5, "Sweden"],
    [27e6, "Australia"],
  ],
  os = [
    {
      id: "first",
      cat: 0,
      ic: "robot",
      test: () => s.built >= 1,
      t: "Built by hand",
      b: "Finish your first robot.",
    },
    {
      id: "kept",
      cat: 0,
      ic: "robot",
      test: () => s.kept >= 1,
      t: "Robots building robots",
      b: "Keep a robot to work at your bench.",
    },
    {
      id: "shipped",
      cat: 0,
      ic: "truck",
      test: () => s.shipped >= 1,
      t: "First customer",
      b: "Ship a robot.",
    },
    {
      id: "truck1",
      cat: 0,
      ic: "truck",
      test: () => s.stats.trucks >= 1,
      t: "Signed for",
      b: "Sign for your first truck.",
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
      b: "Rename your company.",
    },
    {
      id: "brag",
      cat: 0,
      ic: "spark",
      test: () => s.stats.shares > 0,
      t: "Bragging rights",
      b: "Share your factory.",
    },
    ...yt
      .slice(1)
      .map((t, e) => ({
        id: "gen" + (e + 1),
        cat: 1,
        ic: e + 1 === he ? "trophy" : "rocket",
        test: () => s.gen >= e + 1,
        t: e + 1 === he ? "A generalist" : t.cls,
        b: `Update every robot to v${e + 2}: ${t.what.toLowerCase()}.`,
        share: e + 1 >= 4,
      })),
    ...pt
      .slice(2)
      .map((t, e) => ({
        id: "lvl" + (e + 2),
        cat: 2,
        ic: "grow",
        test: () => s.lvl >= e + 2,
        t: e === 0 ? "Out of the garage" : t[3],
        b: `Expand to ${po(t[3])} ${t[3].toLowerCase()}, ${t[0]} by ${t[1]} tiles.`,
        share: e + 2 === pt.length - 1,
      })),
    ...P1.map(([t, e], o) => ({
      id: "nat" + o,
      cat: 3,
      ic: "globe",
      test: () => s.built >= t,
      t: `More than ${e}`,
      b: `Build more robots than ${e} has people (about ${G(t)}).`,
      share: t >= 39e4,
    })),
    {
      id: "yr100",
      cat: 4,
      ic: "spark",
      test: () => Pt() >= 100,
      t: "A hundred a year",
      b: "Make robots at a hundred a year.",
    },
    {
      id: "yr10k",
      cat: 4,
      ic: "spark",
      test: () => Pt() >= 1e4,
      t: "Ten thousand a year",
      b: "A real production line, running every day.",
    },
    {
      id: "yr1m",
      cat: 4,
      ic: "spark",
      test: () => Pt() >= 1e6,
      t: "A million a year",
      b: "As big as the first humanoid lines being planned.",
      share: 1,
    },
    {
      id: "yr10m",
      cat: 4,
      ic: "trophy",
      test: () => Pt() >= ia,
      t: "Ten million a year",
      b: "A nation of robots, every year.",
      share: 1,
    },
    {
      id: "k10",
      cat: 5,
      ic: "robot",
      test: () => s.kept >= 10,
      t: "A crew",
      b: "Keep ten robots working for you.",
    },
    {
      id: "k100",
      cat: 5,
      ic: "robot",
      test: () => s.kept >= 100,
      t: "A workforce",
      b: "Keep a hundred robots working for you.",
    },
    {
      id: "k1k",
      cat: 5,
      ic: "robot",
      test: () => s.kept >= 1e3,
      t: "A town of robots",
      b: "Keep a thousand robots working for you.",
    },
    {
      id: "help",
      cat: 5,
      ic: "robot",
      test: () => s.staff.gate >= 1 || s.staff.dock >= 1 || s.staff.fix >= 1,
      t: "An extra pair of hands",
      b: "Hire an assistant or a technician.",
    },
    {
      id: "botgate",
      cat: 5,
      ic: "robot",
      test: () => s.staff.gate === 2,
      t: "Robots at the gate",
      b: "Put robots on the gate.",
    },
    {
      id: "botdock",
      cat: 5,
      ic: "truck",
      test: () => s.staff.dock === 2,
      t: "Robots at the dock",
      b: "Put robots on the dock.",
    },
    {
      id: "botbuild",
      cat: 5,
      ic: "gear",
      test: () => !!s.staff.build,
      t: "Robots building factories",
      b: "Put robots on the building sites.",
    },
    {
      id: "botfix",
      cat: 5,
      ic: "wrench",
      test: () => s.staff.fix === 2,
      t: "Robots fixing robots",
      b: "Put robots on repairs.",
    },
    {
      id: "w1",
      cat: 5,
      ic: "bolt",
      test: () => p.draw >= 1e3,
      t: "One megawatt",
      b: "As much power as about 800 American homes.",
    },
    {
      id: "w100",
      cat: 5,
      ic: "bolt",
      test: () => p.draw >= 1e5,
      t: "100 megawatts",
      b: "About 80,000 American homes: a small city.",
    },
    {
      id: "w1g",
      cat: 5,
      ic: "bolt",
      test: () => p.draw >= 1e6,
      t: "One gigawatt",
      b: "About 800,000 homes.",
      share: 1,
    },
    {
      id: "m1",
      cat: 6,
      ic: "coin",
      test: () => s.earned >= 1e6,
      t: "Your first million",
      b: "Earned one robot at a time.",
    },
    {
      id: "m1b",
      cat: 6,
      ic: "coin",
      test: () => s.earned >= 1e9,
      t: "A billion dollars",
      b: "Earned, not raised.",
    },
    {
      id: "m1t",
      cat: 6,
      ic: "coin",
      test: () => s.earned >= 1e12,
      t: "A trillion dollars",
      b: "Earned, not raised.",
      share: 1,
    },
    {
      id: "deliv10",
      cat: 7,
      ic: "truck",
      test: () => s.stats.deliveries >= 10,
      t: "Signed, sealed, delivered",
      b: "Sign for ten rush orders.",
    },
    {
      id: "t100",
      cat: 7,
      ic: "truck",
      test: () => s.stats.trucks >= 100,
      t: "A hundred trucks",
      b: "Sign for a hundred trucks.",
    },
    {
      id: "viral5",
      cat: 7,
      ic: "spark",
      test: () => s.stats.virals >= 5,
      t: "Main character",
      b: "Catch five viral videos.",
    },
    {
      id: "short",
      cat: 7,
      ic: "flame",
      test: () => s.stats.shortOk >= 1,
      t: "Magnet-proof",
      b: "Ride out a magnet shortage with every station fed.",
    },
    {
      id: "fix1",
      cat: 7,
      ic: "wrench",
      test: () => s.stats.fixed >= 1,
      t: "Back up and running",
      b: "Fix a jammed station.",
    },
    {
      id: "fix100",
      cat: 7,
      ic: "wrench",
      test: () => s.stats.fixed >= 100,
      t: "Good with a wrench",
      b: "Fix a hundred jammed stations.",
    },
    {
      id: "clock",
      cat: 8,
      ic: "trophy",
      test: () => s.stats.bestFed >= 300,
      t: "Like clockwork",
      b: "Every station crewed and fed for five minutes straight.",
    },
    {
      id: "allres",
      cat: 8,
      ic: "flask",
      test: () => so.every((t) => s.res[t.id]),
      t: "Read every paper",
      b: "Finish every research.",
    },
    {
      id: "mi10",
      cat: 8,
      ic: "trophy",
      test: () => s.stats.missions >= 10,
      t: "On a mission",
      b: "Complete ten missions.",
    },
    {
      id: "mi50",
      cat: 8,
      ic: "trophy",
      test: () => s.stats.missions >= 50,
      t: "Mission control",
      b: "Complete fifty missions.",
    },
    {
      id: "itself",
      cat: 8,
      ic: "trophy",
      test: () =>
        s.staff.gate === 2 &&
        s.staff.dock === 2 &&
        s.staff.fix === 2 &&
        !!s.staff.build,
      t: "It runs itself",
      b: "Robots run the gate, the dock, the repairs and the building sites.",
      share: 1,
    },
    {
      id: "night",
      cat: 8,
      ic: "spark",
      test: () => s.stats.nights >= 1,
      t: "Night shift",
      b: "Come back to trucks your robots signed for while you were away.",
    },
    {
      id: "ontime",
      cat: 8,
      ic: "truck",
      test: () => s.stats.bestStreak >= 50,
      t: "Always on time",
      b: "Sign for fifty trucks in a row without missing one.",
    },
    {
      id: "hand",
      cat: 8,
      ic: "garage",
      secret: 1,
      test: () =>
        s.built >= 150 &&
        p.stations > 0 &&
        se.every((t) => Q[s.cells[t]].id === "bench"),
      t: "Handmade",
      b: "Build 150 robots with nothing but workbenches.",
      share: 1,
    },
    {
      id: "speed",
      cat: 8,
      ic: "rocket",
      secret: 1,
      test: () => s.done && cn(s.doneAt).y < 2044,
      t: "Beat the roadmap",
      b: "Ten million a year before 2044.",
      share: 1,
    },
    {
      id: "again",
      cat: 8,
      ic: "garage",
      secret: 1,
      test: () => (s.ng || 0) > 0,
      t: "Again, faster",
      b: "Start a new company after reaching ten million a year.",
    },
  ],
  ic = () => os.filter((t) => s.miles[t.id]).length;
let oh = 0;
function F1() {
  if (!(z - oh < 0.5)) {
    oh = z;
    for (const t of os)
      if (!(s.miles[t.id] || !t.test())) {
        ((s.miles[t.id] = Math.round(s.played) || 1),
          O.chime(),
          lh(),
          Et(t.t, t.b, "a", t.share ? ["Share it", () => Qa()] : null, {
            icon: "trophy",
            kick: "Milestone",
            gold: !!t.share,
          }));
        break;
      }
  }
}
const qs = (t) => {
    if (t <= 12) return Math.ceil(t);
    const e = 10 ** (Math.floor(Math.log10(t)) - 1);
    return Math.ceil(t / e) * e;
  },
  rc = () => Object.keys(s.res).length,
  nh = (t) => {
    let e = 0;
    for (let o = 0; o < Bt; o++) s.cells[o] === At[t].ix && e++;
    return e;
  },
  O1 = {
    panel: "the 200 A panel",
    xfmr: "a transformer",
    sub: "a substation",
    solar: "a solar and battery farm",
    smr: "a small reactor",
    fusion: "a fusion plant",
  },
  Ws = {
    built: {
      ic: "robot",
      t: (t) =>
        t.n === 1 && !t.base
          ? "Build your first robot"
          : `Build ${G(t.n)} robots`,
      v: (t) => s.built - (t.base || 0),
      f: G,
    },
    crew: { ic: "robot", t: () => "Put a robot to work", v: () => p.crewed },
    stations: {
      ic: "gear",
      t: (t) => (t.n === 2 ? "Add a second workbench" : `Run ${t.n} stations`),
      v: () => p.stations,
    },
    ship: {
      ic: "truck",
      t: (t) => `Ship ${G(t.n)} robots`,
      v: (t) => s.shipped - (t.base || 0),
      f: G,
    },
    kept: {
      ic: "robot",
      t: (t) => `Keep ${G(t.n)} robots`,
      v: () => Math.floor(s.kept),
      f: G,
    },
    yr: { ic: "spark", t: (t) => `Make ${G(t.n)} a year`, v: () => Pt(), f: G },
    fed: {
      ic: "gear",
      t: (t) => `Every station crewed and fed for ${t.n} s`,
      v: () => s.stats.fedStreak,
      f: (t) => Math.floor(t) + " s",
    },
    draw: { ic: "bolt", t: (t) => `Draw ${Yt(t.n)}`, v: () => p.draw, f: Yt },
    res: {
      ic: "flask",
      t: (t) => (t.n > 1 ? `Finish ${t.n} research` : "Finish a research"),
      v: (t) => rc() - t.base,
    },
    expand: {
      ic: "grow",
      t: (t) => `Expand to ${po(pt[t.n][3])} ${pt[t.n][3].toLowerCase()}`,
      v: () => s.lvl,
      p: (t) => (s.lvl >= t.n ? 1 : D(s.cash / pt[t.n][2], 0, 0.97)),
    },
    launch: {
      ic: "rocket",
      t: (t) => `Update to brain v${t.n + 1}`,
      v: () => s.gen,
      p: (t) => (s.gen >= t.n ? 1 : D(s.train / Math.max(ro(), 1e-9), 0, 0.99)),
    },
    earn: {
      ic: "coin",
      t: (t) => `Earn ${K(t.n)}`,
      v: (t) => s.earned - t.base,
      f: K,
    },
    deliv: {
      ic: "truck",
      t: (t) =>
        t.n > 1 ? `Sign for ${t.n} rush orders` : "Sign for a rush order",
      v: (t) => s.stats.deliveries - t.base,
    },
    viral: {
      ic: "spark",
      t: () => "Catch a viral video",
      v: (t) => s.stats.virals - t.base,
    },
    plant: {
      ic: "bolt",
      t: (t) => `Build ${O1[t.p]}`,
      v: (t) => s.plants[t.p] || 0,
      p: (t) =>
        (s.plants[t.p] || 0) >= t.n ? 1 : D(s.cash / wn(tn[t.p]), 0, 0.97),
    },
    tier: {
      ic: "gear",
      t: (t) => `Run ${t.n} ${At[t.p].name.toLowerCase()}${t.n > 1 ? "s" : ""}`,
      v: (t) => nh(t.p),
    },
    nation: {
      ic: "globe",
      t: (t) => `Outnumber ${t.p}`,
      v: () => s.built,
      f: G,
    },
    sign: {
      ic: "truck",
      t: (t) => (t.n > 1 ? `Sign for ${t.n} trucks` : "Sign for a truck"),
      v: (t) => s.stats.trucks - t.base,
    },
    job: {
      ic: "robot",
      t: (t) =>
        t.p === "build"
          ? "Put robots on the building sites"
          : t.p === "fix"
            ? "Put robots on repairs"
            : `Put robots on the ${t.p}`,
      v: (t) =>
        (t.p === "build" ? s.staff.build : s.staff[t.p] === 2) ? 1 : 0,
    },
    fix: {
      ic: "wrench",
      t: (t) =>
        t.n > 1 ? `Fix ${t.n} jammed stations` : "Fix a jammed station",
      v: (t) => s.stats.fixed - t.base,
    },
  },
  go = [
    { k: "built", n: 1, r: 500 },
    { k: "crew", n: 1, r: 1e3 },
    { k: "stations", n: 2, r: 1500 },
    { k: "ship", n: 3, r: 2500 },
    { k: "launch", n: 1, r: 4e3 },
  ],
  Rr = (t) => {
    const e = Ws[t.k];
    return e.p ? e.p(t) : D(e.v(t) / t.n, 0, 1);
  };
function z1() {
  const t = new Set(s.missions.map((u) => u.k)),
    e = Math.max(p.rev, 10),
    o = [],
    n = (u) => eh(Math.max(u, 200)),
    a = (u, g) => {
      t.has(g.k) || o.push([u, g]);
    };
  s.gen < he && !s.done && a(4, { k: "launch", n: s.gen + 1, r: n(e * 90) });
  const i = pt[s.lvl + 1];
  (i && a(2, { k: "expand", n: s.lvl + 1, r: n(i[2] * 0.3) }),
    a(3, { k: "yr", n: qs(Math.max(Pt() * 1.6, Pt() + 40)), r: n(e * 80) }),
    a(2, {
      k: "built",
      n: qs(Math.max(s.built * 0.6, 20)),
      base: s.built,
      r: n(e * 60),
    }),
    a(1.5, {
      k: "ship",
      n: qs(Math.max(p.ship * 80, 10)),
      base: s.shipped,
      r: n(e * 50),
    }),
    a(1.5, { k: "kept", n: qs(Math.floor(s.kept) * 1.5 + 3), r: n(e * 60) }),
    a(1.2, {
      k: "draw",
      n: qs(Math.max(p.draw * 1.6, p.draw + 1)),
      r: n(e * 60),
    }),
    a(1.5, {
      k: "earn",
      n: qs(Math.max(e * 150, 1500)),
      base: s.earned,
      r: n(e * 45),
    }),
    p.stations >= 3 &&
      a(2, {
        k: "fed",
        n: [30, 45, 60, 90, 90, 120, 120, 120][s.gen],
        r: n(e * 90),
      }));
  const l = so.filter((u) => $t(u) && !s.res[u.id]).length;
  (l && a(2, { k: "res", n: Math.min(2, l), base: rc(), r: n(e * 60) }),
    s.tut >= 2 &&
      a(1.5, {
        k: "deliv",
        n: s.stats.deliveries > 4 ? 2 : 1,
        base: s.stats.deliveries,
        r: n(e * 40),
      }),
    s.gen >= 1 &&
      a(1.2, { k: "viral", n: 1, base: s.stats.virals, r: n(e * 40) }));
  const r = Po.filter(
    (u) => u.id !== "outlet" && $t(u) && (s.plants[u.id] || 0) < u.max,
  ).at(-1);
  r &&
    a(1.5, {
      k: "plant",
      p: r.id,
      n: (s.plants[r.id] || 0) + 1,
      r: n(wn(r) * 0.25),
    });
  const c = Q.filter((u) => u && u.kind === "station" && $t(u)).at(-1);
  c &&
    c.gen > 0 &&
    a(2, {
      k: "tier",
      p: c.id,
      n: nh(c.id) + (s.gen < 3 ? 2 : 4),
      r: n(Math.max(c.cost * 1.5, e * 60)),
    });
  const h = js(s.built);
  (h.next &&
    h.next[0] < s.built * 4 + 200 &&
    a(2, { k: "nation", n: h.next[0], p: h.next[1], r: n(e * 70) }),
    yr() &&
      s.staff.dock !== 2 &&
      a(1.5, {
        k: "sign",
        n: s.stats.trucks > 8 ? 5 : 3,
        base: s.stats.trucks,
        r: n(e * 40),
      }),
    s.stats.jams > 0 &&
      s.staff.fix !== 2 &&
      a(1.5, {
        k: "fix",
        n: s.stats.fixed > 10 ? 6 : 3,
        base: s.stats.fixed,
        r: n(e * 40),
      }));
  for (const u of ["gate", "dock", "fix", "build"])
    if (
      s.gen >= Tt[u].gen &&
      !(u === "build" ? s.staff.build : s.staff[u] === 2)
    ) {
      a(3, { k: "job", p: u, n: 1, r: n(e * 50) });
      break;
    }
  if (!o.length) return null;
  let d = ce() * o.reduce((u, g) => u + g[0], 0),
    m = 0;
  for (; m < o.length - 1 && (d -= o[m][0]) > 0;) m++;
  return o[m][1];
}
function G1() {
  const t = s.mseq < go.length && !s.ng ? { ...go[s.mseq], ob: 1 } : z1();
  return t
    ? (s.mseq++,
      (t.id = s.mseq),
      (t.done = !1),
      t.k === "res" && t.base == null && (t.base = rc()),
      ["deliv", "viral"].includes(t.k) &&
        t.base == null &&
        (t.base = t.k === "deliv" ? s.stats.deliveries : s.stats.virals),
      t)
    : null;
}
let lc = 0,
  Hs = !0;
const j1 = () =>
  s.missions.some((t) => Ns(t) && !t.claimed) || (s.mseq < go.length && !s.ng)
    ? 1
    : 3;
function sh() {
  for (; s.missions.filter((t) => !t.claimed).length < j1();) {
    const t = G1();
    if (!t) break;
    ((t.fresh = !0), s.missions.push(t), (Hs = !0));
  }
}
function ah() {
  if (!(z - lc < 0.25)) {
    ((lc = z), sh());
    for (const t of s.missions)
      t.done ||
        t.claimed ||
        ((Rr(t) >= 1 || (Ws[t.k].v(t) >= t.n && !Ws[t.k].p)) &&
          ((t.done = !0), (t.doneAt = z), (Hs = !0), O.chime()));
    for (const t of s.missions)
      t.done &&
        !t.claimed &&
        (t.doneAt <= z || (t.doneAt = z),
        z - t.doneAt > (Ns(t) ? 1.3 : 2.4) && rh(t));
    (sh(), Hs ? N1() : ih());
  }
}
function N1() {
  Hs = !1;
  const t = v("#mlist"),
    e = s.missions.filter((a) => !Ns(a)),
    o = v("#missions"),
    n = o.hidden;
  ((o.hidden = !e.length),
    n &&
      e.length &&
      !s.seen.board &&
      ((s.seen.board = 1),
      Et(
        "Missions unlocked",
        "Three goals at a time, top left. Each one pays as soon as it is done.",
        "a",
        null,
        { icon: "trophy", kick: "New" },
      )),
    (t.innerHTML = e
      .map((a) => {
        const i = Ws[a.k];
        return `<div class="mi${a.done ? " done" : ""}${a.fresh ? " new" : ""}${a.claimed ? " gone" : ""}" data-id="${a.id}"><span class="mic"><svg viewBox="0 0 24 24" aria-hidden="true">${Sr[i.ic]}</svg></span><div class="mt"><b><span>${i.t(a)}</span><em data-n></em></b><u><i data-f></i></u></div><span class="mr">${a.done ? "\u2713 " : ""}+${K(a.r)}</span></div>`;
      })
      .join("")),
    (v("#mdone").textContent = s.stats.missions
      ? `${s.stats.missions} done`
      : ""),
    ih(),
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        (t
          .querySelectorAll(".mi.new")
          .forEach((a) => a.classList.remove("new")),
          s.missions.forEach((a) => (a.fresh = !1)));
      }),
    ));
}
function ih() {
  for (const t of v("#mlist").children) {
    const e = s.missions.find((i) => i.id == t.dataset.id);
    if (!e) continue;
    const o = Ws[e.k],
      n = e.done ? 1 : Rr(e);
    t.querySelector("[data-f]").style.width = (n * 100).toFixed(1) + "%";
    const a = t.querySelector("[data-n]");
    a.textContent = e.done
      ? ""
      : o.p
        ? Math.floor(n * 100) + "%"
        : `${(o.f || G)(Math.max(0, Math.min(o.v(e), e.n)))}/${(o.f || G)(e.n)}`;
  }
}
v("#mlist").addEventListener("click", (t) => {
  const e = t.target.closest(".mi.done");
  if (!e) return;
  const o = s.missions.find((n) => n.id == e.dataset.id);
  o && rh(o, e);
});
function rh(t, e) {
  if (t.claimed) return;
  ((t.claimed = !0), (s.cash += t.r), s.stats.missions++, O.coin(3));
  const o = v("#mlist").querySelector(`[data-id="${t.id}"]`);
  (U1(e || o || (at.el.classList.contains("on") ? at.call : v("#why"))),
    o && o.classList.add("gone"),
    setTimeout(() => {
      ((s.missions = s.missions.filter((n) => n !== t)), (Hs = !0), Xt());
    }, 430));
}
function U1(t) {
  const e = t.getBoundingClientRect(),
    o = v("#cash").getBoundingClientRect(),
    n = e.left + e.width * 0.6,
    a = e.top + e.height / 2,
    i = o.left + o.width * 0.4,
    l = o.top + o.height * 0.55;
  for (let r = 0; r < 11; r++) {
    const c = document.createElement("i");
    ((c.className = "coinfly"), bo.appendChild(c));
    const h = (n + i) / 2 + (ce() - 0.5) * 110,
      d = Math.min(a, l) - 30 - ce() * 60,
      m = c.animate(
        [
          {
            transform: `translate(${n + (ce() - 0.5) * 20}px,${a}px) scale(.5)`,
            opacity: 0,
          },
          {
            transform: `translate(${h}px,${d}px) scale(1.15)`,
            opacity: 1,
            offset: 0.45,
          },
          { transform: `translate(${i}px,${l}px) scale(.55)`, opacity: 0.95 },
        ],
        {
          duration: 620 + r * 30,
          delay: r * 38,
          easing: "cubic-bezier(.3,.1,.3,1)",
          fill: "backwards",
        },
      );
    m.onfinish = () => {
      if ((c.remove(), r === 10)) {
        const u = v("#cashbox");
        (u.classList.remove("up"), u.offsetWidth, u.classList.add("up"));
      }
    };
  }
}
function lh() {
  v("#tcount").textContent = ic();
}
function V1() {
  const t = ic();
  ((v("#miles-p").innerHTML =
    `<b>${t}</b> of ${os.length} earned. The gold ones are worth sharing.`),
    (v("#miles-bar").style.width = ((t / os.length) * 100).toFixed(1) + "%"),
    (v("#miles-grid").innerHTML = D1.map((e, o) => {
      const n = os.filter((a) => a.cat === o);
      return (
        `<h3>${e}<em>${n.filter((a) => s.miles[a.id]).length} of ${n.length}</em></h3><div class="mgrid">` +
        n
          .map((a) => {
            const i = !!s.miles[a.id],
              l = a.secret && !i;
            return `<div class="mcard${i ? " on" : ""}${a.share ? " gold" : ""}"><span class="mi2"><svg viewBox="0 0 24 24" aria-hidden="true">${Sr[l ? "spark" : a.ic]}</svg></span><div><b>${l ? "Secret" : a.t}</b><small>${l ? "Keep playing." : a.b}</small></div></div>`;
          })
          .join("") +
        "</div>"
      );
    }).join("")),
    v("#d-miles").showModal(),
    O.tick());
}
v("#trophy").onclick = () => V1();
const Ae = new f.Group();
(Gt.add(Ae), (Ae.visible = !1));
const Tr = { top: 0, h: 1 },
  Ys = aa(3.3, 1.32, 1200, 480, null, 1, { alphaTest: 0, side: f.FrontSide });
{
  const t = bt();
  t.box(B("#e8e9ec", { roughness: 0.5 }), -0.2, 1.25, 0, 3.4, 1.75, 1.55, {
    r: 0.05,
  })
    .box(Vc("#2a3140", { roughness: 0.3 }), 2.05, 0.95, 0, 1, 1.25, 1.5, {
      r: 0.12,
    })
    .box(be("#cfe8ff", 0.9), 2.5, 1.25, 0, 0.06, 0.45, 1.2)
    .box(us, 0, 0.28, 0, 4.6, 0.3, 1.3);
  for (const o of [-1.2, 0.6, 2.1])
    for (const n of [-0.66, 0.66])
      t.cyl(us, o, 0.32, n, 0.32, 0.32, 0.22, { rx: Math.PI / 2, seg: 14 });
  (Ae.add(...t.flush(Ae)), Ys.position.set(-0.2, 1.3, 0.785), Ae.add(Ys));
  const e = Ys.clone();
  ((e.material = Ys.material),
    (e.rotation.y = Math.PI),
    (e.position.z = -0.785),
    Ae.add(e));
  for (const o of [-0.5, 0.5]) {
    const n = new f.Mesh(new f.BoxGeometry(0.04, 0.12, 0.22), be("#fff6e0", 3));
    (n.position.set(2.56, 0.7, o), Ae.add(n));
  }
  {
    const o = -(ae + 0.22 - xs) / 0.82,
      n = 1.34,
      a = 1.6,
      i = 0.375,
      l = bt(),
      r = Rt("#9aa0a8", { roughness: 0.4 });
    (l
      .box(B("#17130f", { roughness: 0.9 }), o, i + a / 2, 0.79, n, a, 0.012)
      .box(r, o, i + a + 0.03, 0.795, n + 0.1, 0.06, 0.03)
      .box(r, o - n / 2 - 0.03, i + a / 2, 0.795, 0.06, a, 0.03)
      .box(r, o + n / 2 + 0.03, i + a / 2, 0.795, 0.06, a, 0.03),
      Ae.add(...l.flush(Ae, !1)));
    const c = new f.Mesh(
      new f.BoxGeometry(n, a, 0.02),
      B("#cfd2d7", { roughness: 0.45 }),
    );
    ((c.name = "shutter"),
      c.position.set(o, i + a / 2, 0.805),
      (Tr.top = i + a),
      (Tr.h = a),
      Ae.add(c));
  }
  (Ae.scale.setScalar(0.82),
    Ae.traverse((o) => {
      o.isMesh && Jn(o, "truck");
    }));
}
function cc() {
  const t = de.truck;
  if (t.img) {
    let e = $s.get("truck:img");
    if (
      (e ||
        ((e = new Image()),
        (e.onload = cc),
        (e.src = t.img),
        $s.set("truck:img", e)),
      e.complete && e.naturalWidth)
    ) {
      Ys.userData.redraw((o, n, a) => o.drawImage(e, 0, 0, n, a));
      return;
    }
  }
  Ys.userData.redraw((e, o, n) => {
    ((e.fillStyle = t.c1),
      e.fillRect(0, 0, o, n),
      (e.fillStyle = t.c2),
      e.fillRect(0, n - 46, o, 46),
      (e.fillStyle = t.c2),
      (e.font = "800 140px Outfit, sans-serif"),
      (e.textAlign = "center"),
      (e.textBaseline = "middle"),
      (e.letterSpacing = "6px"),
      e.fillText(t.name, o / 2, n / 2 - 36, o - 80),
      (e.font = "500 52px Outfit, sans-serif"),
      (e.letterSpacing = "0px"),
      (e.fillStyle = t.c1 === "#e9ebf0" ? "#4a5266" : "#c9d1e4"),
      e.fillText(t.sub, o / 2, n / 2 + 72, o - 100));
  });
}
const Ja = {
    delivery: { next: 80 },
    viral: { state: "off", t: 0, next: 150 },
    short: { next: 400 },
  },
  Ks = An("click"),
  ch = An(),
  ns = An("click"),
  fc = An("click"),
  Ar = An(),
  fh = An(),
  Cr = An("click");
((Ks.e.onclick = () => Gn("you")),
  (ns.e.onclick = () => jn("you")),
  (fc.e.onclick = () => K1()),
  (Cr.e.onclick = () => zn("you")));
const hc = 4.5,
  q1 = en + 2.7,
  Qe = (() => {
    const t = [];
    Ae.traverse((o) => {
      (t.push([o, o.userData]), (o.userData = {}));
    });
    const e = [Ae];
    for (let o = 0; o < bi + 2; o++) {
      const n = Ae.clone();
      ((n.visible = !1), Gt.add(n), e.push(n));
    }
    for (const [o, n] of t) o.userData = n;
    return e.map(
      (o, n) => (
        n
          ? o.traverse((a) => {
              a.isMesh && Jn(a, "truck", { ti: n });
            })
          : o.traverse((a) => {
              a.isMesh && a.userData.hk && (a.userData.hk.ti = 0);
            }),
        { g: o, id: -1, m: null, x: -150, z: ma, state: "off", slot: 0, t: 0 }
      ),
    );
  })();
function W1(t) {
  const e = z,
    o = new Set(s.trucks.map((n) => n.id));
  for (const n of Qe)
    n.id >= 0 &&
      n.state === "go" &&
      !o.has(n.id) &&
      ((n.state = "out"), (n.t = e));
  s.trucks.forEach((n, a) => {
    let i = Qe.find((l) => l.id === n.id && l.state === "go");
    if (!i) {
      if (((i = Qe.find((l) => l.state === "off")), !i)) return;
      (Object.assign(i, {
        id: n.id,
        state: "go",
        x: Math.max(xs + hc * (bi + 2) + 26, xs + hc * a + 30),
        z: ma,
        t: e,
      }),
        (i.g.visible = !0));
    }
    ((i.slot = a), (i.m = n));
  });
  for (const n of Qe) {
    if (n.state === "off") continue;
    if (n.state === "go") {
      const l = xs + hc * n.slot - n.x;
      ((n.x +=
        Math.sign(l) *
        Math.min(Math.abs(l), t * D(Math.abs(l) * 1.6, 1.2, 18))),
        (n.g.rotation.y = Math.PI),
        (n.lane = null));
    } else {
      n.lane == null &&
        (n.lane = Qe.some(
          (c) => c.state === "go" && c.slot < n.slot && c.x < n.x,
        )
          ? q1
          : ma);
      const l = e - n.t,
        r = n.lane - n.z;
      ((n.z += r * (1 - Math.exp(-t * 2.4))),
        (n.x -= t * Math.min(22, 1.2 + l * 6)),
        (n.g.rotation.y = Math.PI + D(r * 0.3, -0.28, 0.28)),
        n.x < -70 &&
          ((n.state = "off"), (n.id = -1), (n.m = null), (n.g.visible = !1)));
    }
    n.g.position.set(n.x, 0, n.z);
    const a = n.sh || (n.sh = n.g.getObjectByName("shutter")),
      i = n.state === "go" && n.slot === 0 && Math.abs(n.x - xs) < 0.3 ? 1 : 0;
    if (
      ((n.open =
        (n.open || 0) + (i - (n.open || 0)) * (1 - Math.exp(-t * (i ? 3 : 6)))),
      a)
    ) {
      const l = 1 - 0.9 * n.open;
      ((a.scale.y = l), (a.position.y = Tr.top - (Tr.h * l) / 2));
    }
  }
  H1();
}
function H1() {
  const t = Xs && !ge,
    e = Math.floor(s.ready + 1e-9),
    o = t && s.chose && e >= 1 && s.staff.gate !== 2;
  (ns.e.classList.toggle("hot", o && p.lineFull),
    Ge(
      ns,
      J.set(Mt, 2.62, dt),
      p.lineFull
        ? `Line full \xB7 ${G(e)}`
        : ee
          ? `${G(e)}/${G(p.lineCap)} ready`
          : `${G(e)} of ${G(p.lineCap)} ready`,
      ee ? "" : p.lineFull ? "the stations have stopped" : "send them through",
      "#1d1406",
      o,
    ));
  const n = s.trucks.filter((d) => d.got >= d.n),
    a = n.length ? Qe.find((d) => d.id === n[0].id && d.state === "go") : null;
  if (a && t && s.staff.dock !== 2) {
    const d = n.reduce((g, b) => g + b.n * p.price * (b.rush ? 2 : 1), 0),
      m = Math.min(...n.map((g) => (g.rush ? la : ra) - g.wait)),
      u = m < 15;
    (Ks.e.classList.toggle("hot", u),
      Ge(
        Ks,
        J.set(a.x + 0.2, 2.95, a.z),
        n.length > 1
          ? `Sign for ${n.length} trucks`
          : n[0].rush
            ? "Rush order loaded"
            : "Truck loaded",
        u
          ? `+${K(d)} \xB7 ${ee ? "" : "leaves in "}${Math.max(1, Math.ceil(m))} days`
          : ee
            ? `+${K(d)}`
            : `sign \xB7 +${K(d)}`,
        "#1d1406",
        !0,
      ));
  } else Ge(Ks, J, "", "", "", !1);
  const i = s.trucks.find((d) => d.rush && d.got < d.n),
    l = i ? Qe.find((d) => d.id === i.id && d.state === "go") : null;
  l && t
    ? Ge(
        ch,
        J.set(l.x + 0.2, 2.95, l.z),
        "Rush order \xB7 double pay",
        `${G(i.got)} of ${G(i.n)} \xB7 ${Math.max(1, Math.ceil(la - i.wait))} days`,
        "#ffb454",
        !0,
      )
    : Ge(ch, J, "", "", "", !1);
  const r = s.jams,
    c = r.length,
    h = t && c > 0 && s.staff.fix !== 2;
  if ((Cr.e.classList.toggle("hot", h), h)) {
    const d = r[0].k;
    Ge(
      Cr,
      J.set((d % j) + 0.5, kt + 1.95, -(Math.floor(d / j) + 0.5)),
      c > 1 ? `${G(c)} jammed` : "Jammed",
      ee ? "" : c > 1 ? "fix them all" : "fix it",
      "#ff8f7a",
      !0,
    );
  } else Ge(Cr, J, "", "", "", !1);
}
function Y1() {
  if (!s.chose || s.trucks.some((e) => e.rush) || s.trucks.length > bi) return;
  const t = ll(Math.min(p.D, Math.max(p.makes * 0.5, 0.05)) * 4);
  (s.trucks.push({ id: ++s.tid, n: t, got: 0, wait: 0, rush: 1 }),
    ue ||
      Et(
        "Rush order",
        `A customer needs ${qt(t, "robot")} fast and pays double. Ship them: they board first.`,
        "a",
        null,
        { icon: "truck", kick: "Rush order", big: "2\xD7 pay" },
      ));
}
((rt.signed = function (t, e, o) {
  if (ue) return;
  const n = Qe.find((a) => a.id === t.id && a.state === "go");
  n && J0(J.set(n.x, 2.6, n.z), "+" + K(e), "a", o === "you");
}),
  (rt.missed = function (t, e) {
    if (ue) return;
    const o = Qe.find((n) => n.id === t.id && n.state === "go");
    (o && J0(J.set(o.x, 2.7, o.z), e ? "Missed" : "Gone", "r", !0),
      e
        ? (O.no(),
          Et(
            "Missed shipment",
            `The driver waited ${ra} days and left without the robots. They are still yours, but orders dip ${Math.round(Zc * 100)}% for a while.`,
            "r",
            s.staff.dock !== 2 && Je()
              ? ["Get help at the dock", () => Tn("staff")]
              : null,
            { icon: "truck", kick: "Missed" },
          ))
        : Et(
            "The rush order went elsewhere",
            "The customer could not wait for a full load.",
            "c",
            null,
            { icon: "truck", kick: "Rush order" },
          ));
  }));
function K1() {
  const t = Ja.viral;
  t.state === "on" &&
    (s.stats.virals++,
    (t.state = "off"),
    (s.viral = 2.2),
    O.chime(),
    Et(
      "Your robot went viral",
      "A video of it folding laundry is everywhere, and orders triple for a few seconds. Ship them now.",
      "v",
      null,
      { icon: "spark", kick: "Viral", big: "3\xD7 orders" },
    ));
}
function X1(t) {
  if (
    (Ct.sh &&
      s.short <= 0 &&
      ((s.short = 0),
      s.stats.shortBad || s.stats.shortOk++,
      Dn(),
      ke(),
      Et(
        "Magnets are flowing again",
        "Actuator cells are back to full output.",
        "c",
        null,
        { icon: "snow", kick: "All clear" },
      )),
    s.tut < 2 || s.done)
  )
    return;
  const e = Ja.delivery;
  ((e.next -= t), e.next <= 0 && ((e.next = 110 + ce() * 120), Y1()));
  const o = Ja.viral;
  (s.gen >= 1 &&
    ((o.next -= t),
    o.state === "off" &&
      o.next <= 0 &&
      ((o.state = "on"), (o.t = z), (o.next = 160 + ce() * 160)),
    o.state === "on" && z - o.t > 12 && (o.state = "off")),
    Ge(
      fc,
      J.set(
        (F.x0 + F.x1) / 2,
        2.95 + Math.sin(z * 3) * 0.08,
        (F.z0 + F.z1) / 2,
      ),
      "Your robot went viral",
      "catch it",
      "#1d1406",
      o.state === "on",
    ));
  const n = Ja.short;
  (s.gen >= 2 &&
    !Ct.magnet &&
    ((n.next -= t),
    n.next <= 8 &&
      n.next + t > 8 &&
      Et(
        "Magnet shortage coming",
        "Export limits on rare-earth magnets: actuator cells lose a quarter of their output for 40 seconds. Spare actuators keep you running.",
        "r",
        null,
        { icon: "flame", kick: "In 8 seconds" },
      ),
    n.next <= 0 &&
      ((s.short = 40),
      (s.stats.shortBad = !1),
      (n.next = 420 + ce() * 300),
      Dn(),
      ke())),
    s.short > 0 && p.starved > 0 && (s.stats.shortBad = !0));
}
function J1() {
  const t = (Date.now() - (s.last || Date.now())) / 1e3;
  if (t < 5) return;
  const e = fl(t);
  e && t >= 60 && dc(e, t);
}
function dc(t, e) {
  const o = [],
    n = s.built - t.built,
    a = s.stats.trucks - t.trucks,
    i = s.cash - t.cash,
    l = t.sites - s.sites.length,
    r = s.trucks.filter((d) => d.got >= d.n).length,
    c = Math.floor(s.ready + 1e-9);
  if (
    (a > 0 && s.staff.dock === 2 && s.stats.nights++,
    n > 0
      ? o.push(
          `<b>${G(n)}</b> ${n === 1 ? "robot" : "robots"} built` +
            (c ? `, <b>${G(c)}</b> waiting at the gate` : ""),
        )
      : c &&
        o.push(
          `<b>${G(c)}</b> ${c === 1 ? "robot is" : "robots are"} waiting at the gate`,
        ),
    a > 0 && o.push(`Robots at the dock signed for <b>${qt(a, "truck")}</b>`),
    r &&
      o.push(
        `<b>${qt(r, "loaded truck")}</b> ${r === 1 ? "is" : "are"} waiting for your signature`,
      ),
    l > 0 && o.push(`<b>${G(l)}</b> ${l === 1 ? "build" : "builds"} finished`),
    s.lvl > t.lvl &&
      o.push(`The building grew: <b>${pt[s.lvl][3].toLowerCase()}</b>`),
    s.gen < he && t.gen === s.gen)
  ) {
    const d = s.train / ro();
    lo() && !t.rd
      ? o.push(`Brain <b>v${s.gen + 2}</b> has practised enough`)
      : d - t.f0 > 0.005 &&
        o.push(
          `Brain v${s.gen + 2}: ${Math.floor(t.f0 * 100)}% \u2192 <b>${Math.floor(d * 100)}%</b> practised`,
        );
  }
  p.lineFull &&
    s.staff.gate !== 2 &&
    o.push("The line at the gate filled up and the stations stopped");
  {
    const d = s.stats.fixed - (t.fixed || 0),
      m = s.jams.length;
    (d > 0 &&
      s.staff.fix === 2 &&
      o.push(`Robot mechanics fixed <b>${qt(d, "jam")}</b>`),
      m &&
        o.push(
          `<b>${qt(m, "station")}</b> jammed and ${m === 1 ? "is" : "are"} waiting for you to fix ${m === 1 ? "it" : "them"}`,
        ));
  }
  const h = s.staff.gate === 2 && s.staff.dock === 2 && s.staff.fix === 2;
  ((v("#back-p").innerHTML =
    `You were away for <b>${$0(e)}</b>. ` +
    (t.cut
      ? `${s.lab} worked one night shift, <b>${Math.round(t.t)} days</b>, then waited for you.`
      : `${s.lab} kept working while you were gone.`)),
    (v("#back-l").innerHTML = o.map((d) => `<li>${d}</li>`).join("")),
    (v("#back-n").innerHTML = i > 0 ? "+" + K(i) : ""),
    (v("#back-n").hidden = !(i > 0)),
    (v("#back-f").innerHTML = h
      ? ""
      : s.gen >= Tt.gate.gen || s.gen >= Tt.dock.gen
        ? "Robots on the gate, the dock and repairs keep working while you are away. Put them there in <b>Staff</b>."
        : "Once a brain can do the job, robots run the gate (v3), the dock (v4) and repairs (v6), and keep working while you are away."),
    setTimeout(() => {
      v("#d-back").open || v("#d-back").showModal();
    }, 600));
}
function hh() {
  (s.tut === 0 && p.stations >= 2 && (s.tut = 1),
    s.tut === 1 && (p.stations >= 3 || s.played > 150) && (s.tut = 2));
}
(cc(),
  gi.push(
    cc,
    () => [0, 1, 2].forEach(zi),
    Sl,
    () => Ta(),
    () => Ii(),
    () => Ba(),
  ));
const Q1 = new f.Color(2.1, 1, 0.38),
  dh = new f.Color(0.5, 1.35, 1.9),
  Z1 = new f.Color(2, 1.15, 0.35),
  uh = new f.Color(2.1, 1.25, 0.42),
  ph = new f.Color(2.3, 1.9, 1),
  tp = new f.Color(2, 0.5, 0.25),
  ep = new f.Color(2.4, 0.28, 0.2),
  st = new f.Vector3(),
  Nt = new f.Vector3(),
  gh = new f.Vector3(),
  uc = [],
  op = Array.from({ length: 128 }, () => new f.Vector3());
function np(t, e, o, n) {
  return nn(t, e, o, n);
}
const Qt = { N: 72, nodes: [], edges: [] };
{
  const t = yo(9);
  for (let o = 0; o < Qt.N; o++) {
    const n = 1 - (2 * (o + 0.5)) / Qt.N,
      a = Math.sqrt(1 - n * n),
      i = o * 2.39996;
    Qt.nodes.push(new f.Vector3(Math.cos(i) * a, n, Math.sin(i) * a));
  }
  const e = new Set();
  (Qt.nodes.forEach((o, n) => {
    Qt.nodes
      .map((a, i) => [i, o.distanceTo(a)])
      .filter((a) => a[0] !== n)
      .sort((a, i) => a[1] - i[1])
      .slice(0, 3)
      .forEach(([a]) => {
        const i = n < a ? n + "-" + a : a + "-" + n;
        e.has(i) || (e.add(i), Qt.edges.push([n, a, t()]));
      });
  }),
    Qt.edges.sort((o, n) => o[2] - n[2]));
}
const mh = An(),
  pc = () => D(0.42 + s.gen * 0.1 + s.lvl * 0.08, 0.42, 2.2);
function Lr(t) {
  const e = Ei(),
    o = pc();
  return t.set((e + ba) / 2 + 0.6, 2 + o * 1.25, (Mf + Li) / 2 - 0.2);
}
const Cn = new f.Quaternion(),
  bh = new f.Vector3();
function sp(t) {
  const e = pc(),
    o = Lr(gh),
    n = s.gen >= he ? 1 : s.train / ro(),
    a = lo() || s.gen >= he;
  Cn.setFromAxisAngle(ps, t * 0.25);
  const i = a ? ph : uh,
    l = a ? 0.75 + 0.25 * Math.sin(t * 4) : 1,
    r = Qt.edges.length,
    c = Math.floor(n * r);
  for (let u = c; u < r; u++) {
    const [g, b] = Qt.edges[u];
    (st.copy(Qt.nodes[g]).applyQuaternion(Cn).multiplyScalar(e).add(o),
      Nt.copy(Qt.nodes[b]).applyQuaternion(Cn).multiplyScalar(e).add(o),
      _e.seg(st, Nt, xo(st, 0.8), xo(Nt, 0.8), i, 0.08, 0.08));
  }
  for (let u = 0; u < c; u++) {
    const [g, b] = Qt.edges[u];
    (st.copy(Qt.nodes[g]).applyQuaternion(Cn).multiplyScalar(e).add(o),
      Nt.copy(Qt.nodes[b]).applyQuaternion(Cn).multiplyScalar(e).add(o));
    const y = u > c - 4 ? 1.6 : 1;
    _e.seg(st, Nt, xo(st, 1.1), xo(Nt, 1.1), i, 0.5 * l * y, 0.5 * l * y);
  }
  for (let u = 0; u < Qt.N; u++)
    (st.copy(Qt.nodes[u]).applyQuaternion(Cn).multiplyScalar(e).add(o),
      _e.dot(st, 2.6, i, (u / Qt.N < n ? 0.9 : 0.16) * l));
  const h = t - th;
  if (h >= 0 && h < 2.6) {
    const u = Lc(h / 2.6),
      g = e * (1 + u * 2.2),
      b = bh.copy(o).add(Nt.set(0, u * e * 4, 0));
    for (let y = 0; y < r; y += 2) {
      const [w, x] = Qt.edges[y];
      (st.copy(Qt.nodes[w]).applyQuaternion(Cn).multiplyScalar(g).add(b),
        Nt.copy(Qt.nodes[x]).applyQuaternion(Cn).multiplyScalar(g).add(b),
        _e.seg(
          st,
          Nt,
          xo(st, 1.6),
          xo(Nt, 1.6),
          ph,
          (1 - u) * 1.2,
          (1 - u) * 1.2,
        ));
    }
  }
  const d = an.wave.value,
    m = (t - d.x) * d.y;
  if (d.x > 0 && m >= 0 && m < d.w) {
    uc.length = 0;
    const u = an.waveC.value.x,
      g = an.waveC.value.z;
    for (let b = 0; b <= 64; b++) {
      const y = (b / 64) * Math.PI * 2;
      uc.push(op[b % 128].set(u + Math.cos(y) * m, 0.22, g + Math.sin(y) * m));
    }
    _e.line(uc, 3.2, dh, () => (1 - m / d.w) * 1.1);
  }
  Ge(
    mh,
    st.copy(o).add(Nt.set(0, e * 1.25 + 0.3, 0)),
    s.gen >= he
      ? "The last brain"
      : a
        ? `Brain v${s.gen + 2} is ready`
        : `Brain v${s.gen + 2}`,
    s.gen >= he
      ? ""
      : a
        ? "update every robot"
        : `${Math.floor(n * 100)}% practised`,
    a ? "#ffb454" : "#ffd08a",
    Xs && !ge && !ee && s.chose && (!kr() || !!s.seen.rv_brain),
  );
}
let Xs = !0,
  Zp = 0,
  yh = 0;
function xh(t, e) {
  (_e.begin(), (yh += e * 0.55));
  let o = 0;
  for (const [l, r] of rl) {
    if (!r.length || o > 420) continue;
    const c = Q[s.cells[l]],
      h = l % j,
      d = Math.floor(l / j),
      m = Math.round(2 + D(Fo[l] / (c.supply * Ct.parts), 0.15, 1) * 4);
    for (let u = 0; u < m; u++) {
      const g = yh + Kt(l * 1.3 + u * 0.71),
        b = g % 1,
        y =
          r[
            Math.floor(Kt(l * 0.37 + u * 3.1 + Math.floor(g) * 0.13) * r.length)
          ];
      (st.set(h + 0.5, kt + 0.5, -(d + 0.5)),
        Nt.set((y % j) + 0.5, kt + 0.55, -(Math.floor(y / j) + 0.5)));
      const w = J.lerpVectors(st, Nt, b);
      ((w.y += Math.sin(b * Math.PI) * 0.35),
        _e.dot(w, 2.4, Q1, 0.8 * Math.sin(b * Math.PI)),
        o++);
    }
  }
  if (se.length && p.made > 0) {
    const l = Math.round(D(2 + 3 * Math.log10(1 + p.made), 2, 26));
    for (let r = 0; r < l; r++) {
      const c = (t * 0.42 + r / l) % 1,
        h =
          se[
            Math.floor(Kt(r * 13.1 + Math.floor(t * 0.42 + r / l)) * se.length)
          ];
      if (On[h] <= 0) continue;
      const d = h % j,
        m = Math.floor(h / j);
      (st.set(d + 0.5, 0.95, -(m + 0.5)), Nt.set(Mt, 0.95, -0.3));
      const u = J.lerpVectors(st, Nt, c);
      ((u.y += Math.sin(c * Math.PI) * 0.5),
        _e.dot(u, 3.2, dh, 0.8 * (1 - Bo(0.9, 1, c)) * Bo(0, 0.1, c)));
    }
  }
  const n = Lr(bh),
    a = Math.min(p.gym, Un.length, Zf);
  if (s.gen < he && a > 0 && !lo()) {
    const l = Math.round(D(a * 0.6, 2, 36));
    for (let r = 0; r < l; r++) {
      const c = Math.floor(Kt(r * 7.7 + 3) * a),
        [h, d] = Un[c];
      st.set(h, 1.05, d);
      const m = (t * 0.45 + Kt(r * 1.3)) % 1,
        u = J.lerpVectors(st, n, m);
      ((u.y += Math.sin(m * Math.PI) * 0.6),
        _e.dot(u, 2.2, uh, 0.7 * Math.sin(m * Math.PI)));
    }
  }
  sp(t);
  for (const l of Oa) {
    l.dd || (l.dd = ga(l.pts));
    const r = l.dd[l.dd.length - 1],
      c = Math.round(D(r / 2.5, 3, 24)),
      h = D(p.draw / Math.max(p.cap, 1e-9), 0.15, 1);
    for (let d = 0; d < c; d++) {
      const m = (t * 0.45 * (0.6 + h) + d / c) % 1;
      _e.dot(np(l.pts, l.dd, m * r, st), 2.4, Z1, 0.6 * h);
    }
  }
  {
    let l = 0;
    for (const r of s.jams) {
      if (l++ > 240) break;
      const c = r.k,
        h = 0.5 + 0.5 * Math.sin(t * 7 + Kt(c) * 6);
      (st.set((c % j) + 0.5, kt + 1.62, -(Math.floor(c / j) + 0.5)),
        _e.dot(st, 5.2, ep, 0.35 + 0.75 * h));
    }
  }
  let i = 0;
  for (const l of se) {
    if (io[l] > 0.97 || On[l] <= 0 || i > 120) continue;
    const r = l % j,
      c = Math.floor(l / j),
      h = 1 - io[l],
      d = (t * 0.5 + Kt(l)) % 1;
    (st.set(
      r + 0.5 + (Kt(l * 3) - 0.5) * 0.5,
      kt + 1.2 + d * 0.9,
      -(c + 0.5) + (Kt(l * 5) - 0.5) * 0.4,
    ),
      _e.dot(st, 2.6, tp, h * Math.sin(d * Math.PI) * 0.9),
      i++);
  }
  (_e.end(),
    Ge(
      fh,
      st.set((Ei() + ba) / 2, 1.75, Li - 0.1),
      p.gym ? `${G(p.gym)} practising` : "The yard",
      p.gym
        ? "they teach the next brain"
        : "kept robots with no station come here",
      "#ffd08a",
      Xs &&
        !ge &&
        !ee &&
        s.chose &&
        (p.gym > 0 || s.tut < 2) &&
        !lo() &&
        (!kr() || !!s.seen.rv_brain),
    ));
}
let Js = !1,
  gc = { key: "", k: -1 };
const wh = new f.Color(0.25, 0.95, 0.6),
  mc = new f.Color(1.1, 0.25, 0.3),
  vh = new f.Color(1, 0.62, 0.18),
  Er = new f.Color(0.35, 0.85, 1.1),
  ap = new f.Color(1, 1, 1);
function ip(t) {
  Au();
  const e = Ht ? At[Ht] : null;
  if (Js || e) {
    for (const n of se) {
      const a = io[n];
      Ea(
        n % j,
        Math.floor(n / j),
        a > 0.98 ? wh : gd.copy(mc).lerp(vh, a),
        a > 0.98 ? 0.28 : 0.75,
      );
    }
    for (const n of il) {
      const a = Q[s.cells[n]];
      Ea(
        n % j,
        Math.floor(n / j),
        Er,
        0.2 + 0.5 * D(Fo[n] / (a.supply * Ct.parts), 0, 1),
      );
    }
  }
  const o = e || (s.tut < 1 && s.chose && p.stations < 2 ? At.bench : null);
  if (o && !jt) {
    const n =
      o.id + "|" + p.stations + "|" + p.cells + "|" + s.lvl + "|" + s.gen;
    gc.key !== n && (gc = { key: n, k: zs(o) });
    const a = gc.k;
    a >= 0 &&
      (s.tut < 2 || p.stations < 6 || e) &&
      Ea(a % j, Math.floor(a / j), ap, 0.35 + 0.3 * Math.sin(t * 5));
  }
  if (e && e.kind === "parts" && fo >= 0 && !jt) {
    const n = fo % j,
      a = Math.floor(fo / j);
    for (let i = -e.range; i <= e.range; i++)
      for (let l = -e.range; l <= e.range; l++) {
        if (!l && !i) continue;
        const r = n + l,
          c = a + i;
        r >= 0 && c >= 0 && r < gt() && c < vt() && Ea(r, c, Er, 0.32);
      }
  }
  if (jt && e) {
    let n = 0;
    const a = Math.min(jt.i0, jt.i1),
      i = Math.max(jt.i0, jt.i1),
      l = Math.min(jt.j0, jt.j1),
      r = Math.max(jt.j0, jt.j1);
    for (let c = l; c <= r; c++)
      for (let h = a; h <= i; h++) {
        const d = Os(e, _t(h, c));
        d != null && ((n += d), Ea(h, c, n <= s.cash ? Er : mc, 0.75));
      }
    Rn &&
      ts(
        Rn.clientX,
        Rn.clientY,
        `<b>${e.name}</b> \xD7 ${(i - a + 1) * (r - l + 1)} \xB7 ${K(n)}` +
          (n > s.cash ? ' \xB7 <span class="r">more than you have</span>' : ""),
      );
  }
  Cu();
  for (const n in Hn) Hn[n].visible = !1;
  if (e && fo >= 0 && !jt && Os(e, fo) != null) {
    const n = Lu(e.id),
      a = fo % j,
      i = Math.floor(fo / j);
    if (
      (n.position.set(a + 0.5, kt, -(i + 0.5)),
      (n.visible = !0),
      e.kind === "station")
    ) {
      const l = ur(e, fo);
      qi.color.copy(l.f > 0.98 ? wh : l.wrong ? mc : vh);
    } else qi.color.copy(Er);
    qi.opacity = 0.32 + 0.08 * Math.sin(t * 6);
  }
}
const O = (() => {
  let t = null,
    e = null,
    o = null,
    n = null,
    a = !0,
    i = {},
    l = null,
    r = !1;
  try {
    const y = localStorage.getItem("robots-sound");
    ((a = y !== "0"), (r = y != null));
  } catch {}
  const c = () => l ?? t.currentTime;
  function h(y) {
    if (t) return;
    try {
      t = y || new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return;
    }
    ((e = t.createGain()),
      (e.gain.value = y ? d : 0),
      e.connect(t.destination));
    const w = t.createBuffer(1, t.sampleRate * 2, t.sampleRate),
      x = w.getChannelData(0);
    let M = 0;
    for (let C = 0; C < x.length; C++)
      ((M = (M + 0.02 * (Math.random() * 2 - 1)) / 1.02), (x[C] = M * 3.2));
    const T = t.createBufferSource();
    ((T.buffer = w),
      (T.loop = !0),
      (n = t.createBiquadFilter()),
      (n.type = "lowpass"),
      (n.frequency.value = 380),
      (o = t.createGain()),
      (o.gain.value = 0),
      T.connect(n).connect(o).connect(e),
      T.start(0));
    const k = t.createOscillator();
    ((k.type = "sine"), (k.frequency.value = 58));
    const S = t.createGain();
    ((S.gain.value = 0.12), k.connect(S).connect(o), k.start(0));
  }
  const d = 0.55;
  function m(y, w) {
    if (!e || l != null) return;
    const x = t.currentTime;
    (e.gain.cancelScheduledValues(x),
      e.gain.setValueAtTime(e.gain.value, x),
      e.gain.linearRampToValueAtTime(y, x + w));
  }
  const u = (y, w) => {
    if (!a || !t) return !1;
    const x = c();
    return i[y] != null && x - i[y] < w ? !1 : ((i[y] = x), !0);
  };
  function g(y, w, x = "sine", M = 0.18, T = 1, k = 0) {
    const S = c() + k,
      C = t.createOscillator(),
      R = t.createGain();
    ((C.type = x),
      C.frequency.setValueAtTime(y, S),
      C.frequency.exponentialRampToValueAtTime(Math.max(20, y * T), S + w),
      R.gain.setValueAtTime(0, S),
      R.gain.linearRampToValueAtTime(M, S + 0.008),
      R.gain.exponentialRampToValueAtTime(8e-4, S + w),
      C.connect(R).connect(e),
      C.start(S),
      C.stop(S + w + 0.05));
  }
  function b(y = 0.3, w = 140) {
    const x = c(),
      M = t.createOscillator(),
      T = t.createGain();
    (M.frequency.setValueAtTime(w, x),
      M.frequency.exponentialRampToValueAtTime(45, x + 0.18),
      T.gain.setValueAtTime(y, x),
      T.gain.exponentialRampToValueAtTime(0.001, x + 0.22),
      M.connect(T).connect(e),
      M.start(x),
      M.stop(x + 0.25));
  }
  return {
    get on() {
      return a;
    },
    wake() {
      if (l != null || !a) return;
      const y = !t;
      if ((h(), t?.state === "suspended" && t.resume(), y && (m(d, 5), !r))) {
        r = !0;
        try {
          localStorage.setItem("robots-sound", "1");
        } catch {}
        rp();
      }
    },
    toggle() {
      ((a = !a), (r = !0));
      try {
        localStorage.setItem("robots-sound", a ? "1" : "0");
      } catch {}
      return (
        a
          ? (h(), t?.resume(), m(d, 1.5), g(660, 0.12, "sine", 0.12))
          : m(0, 0.2),
        a
      );
    },
    place(y, w = 1) {
      u("place", 0.05) &&
        (b(0.32, y === "station" ? 150 : 110),
        g(y === "station" ? 880 : 620, 0.09, "triangle", 0.07, 1.3),
        w > 1 && g(1100, 0.16, "sine", 0.05, 1.5, 0.06));
    },
    sell() {
      u("sell", 0.05) && g(500, 0.14, "triangle", 0.1, 0.6);
    },
    no() {
      u("no", 0.15) && g(180, 0.16, "square", 0.05, 0.8);
    },
    tick() {
      u("tick", 0.03) && g(1800, 0.025, "sine", 0.04);
    },
    coin(y = 1) {
      if (u("coin", 0.09))
        for (let w = 0; w < y; w++)
          g(1320 * (1 + w * 0.26), 0.11, "sine", 0.05, 1.02, w * 0.05);
    },
    chime() {
      u("chime", 0.3) &&
        [784, 988, 1175].forEach((y, w) =>
          g(y, 0.5, "sine", 0.07, 1, w * 0.07),
        );
    },
    big() {
      u("big", 0.2) &&
        (b(0.36, 120),
        [523, 659, 784].forEach((y, w) =>
          g(y, 0.35, "triangle", 0.07, 1, w * 0.05),
        ));
    },
    launch() {
      u("launch", 0.5) &&
        (b(0.45, 90),
        [392, 523, 659, 784, 1047].forEach((y, w) =>
          g(y, 0.9, "sine", 0.08, 1, w * 0.09),
        ),
        g(200, 1.4, "sawtooth", 0.03, 4));
    },
    gate() {
      u("gate", 0.12) &&
        (g(430, 0.05, "square", 0.025, 0.8),
        g(300, 0.08, "triangle", 0.04, 1, 0.035));
    },
    rise() {
      u("rise", 0.6) &&
        (g(170, 0.95, "sawtooth", 0.022, 2.3),
        g(340, 0.9, "sine", 0.03, 1.9, 0.06));
    },
    fit() {
      u("fit", 0.05) && (g(2300, 0.03, "square", 0.028, 0.6), b(0.12, 240));
    },
    crate() {
      u("crate", 0.12) && b(0.2, 92);
    },
    jam() {
      u("jam", 0.8) &&
        (g(220, 0.12, "square", 0.03, 0.7),
        g(165, 0.2, "square", 0.028, 0.8, 0.13));
    },
    fix() {
      u("fix", 0.08) &&
        (g(1500, 0.04, "square", 0.03, 0.7),
        g(1900, 0.06, "triangle", 0.04, 1.05, 0.05));
    },
    horn() {
      u("horn", 0.4) &&
        (g(311, 0.22, "sawtooth", 0.035, 1),
        g(392, 0.22, "sawtooth", 0.03, 1, 0.02),
        g(311, 0.3, "sawtooth", 0.03, 1, 0.28),
        g(392, 0.3, "sawtooth", 0.026, 1, 0.3));
    },
    built() {
      u("built", 0.15) &&
        (b(0.22, 180),
        g(1046, 0.18, "triangle", 0.06, 1.02),
        g(1568, 0.22, "sine", 0.04, 1, 0.06));
    },
    hum(y) {
      !a ||
        !t ||
        !o ||
        (o.gain.setTargetAtTime(0.04 + 0.14 * y, c(), 0.4),
        n.frequency.setTargetAtTime(240 + 600 * y, c(), 0.4));
    },
    film(y) {
      ((a = !0),
        (l = 0),
        (t = null),
        (i = {}),
        h(new OfflineAudioContext(2, Math.ceil(48e3 * y), 48e3)));
    },
    filmT(y) {
      l = y;
    },
    async render() {
      const y = await t.startRendering(),
        w = y.length,
        x = y.numberOfChannels,
        M = new DataView(new ArrayBuffer(44 + w * x * 2)),
        T = ($, L) => {
          for (let _ = 0; _ < L.length; _++) M.setUint8($ + _, L.charCodeAt(_));
        };
      (T(0, "RIFF"),
        M.setUint32(4, 36 + w * x * 2, !0),
        T(8, "WAVE"),
        T(12, "fmt "),
        M.setUint32(16, 16, !0),
        M.setUint16(20, 1, !0),
        M.setUint16(22, x, !0),
        M.setUint32(24, y.sampleRate, !0),
        M.setUint32(28, y.sampleRate * x * 2, !0),
        M.setUint16(32, x * 2, !0),
        M.setUint16(34, 16, !0),
        T(36, "data"),
        M.setUint32(40, w * x * 2, !0));
      const k = [...Array(x)].map(($, L) => y.getChannelData(L));
      let S = 44;
      for (let $ = 0; $ < w; $++)
        for (let L = 0; L < x; L++)
          (M.setInt16(S, D(k[L][$], -1, 1) * 32767, !0), (S += 2));
      const C = new Uint8Array(M.buffer);
      let R = "";
      for (let $ = 0; $ < C.length; $ += 32768)
        R += String.fromCharCode.apply(null, C.subarray($, $ + 32768));
      return btoa(R);
    },
  };
})();
function bc() {
  const t = v("#sound");
  (t.classList.toggle("on", O.on),
    t.setAttribute("aria-pressed", O.on),
    (v("#snd-w").style.display = O.on ? "" : "none"),
    (v("#snd-x").style.display = O.on ? "none" : ""));
}
((v("#sound").onclick = () => {
  (O.toggle(), bc());
}),
  bc(),
  addEventListener("pointerdown", () => O.wake(), !0),
  addEventListener(
    "keydown",
    (t) => {
      t.key.toLowerCase() !== "m" && O.wake();
    },
    !0,
  ));
function rp() {
  const t = v("#sound"),
    e = t.getBoundingClientRect(),
    o = document.createElement("div");
  ((o.id = "snd-hello"),
    (o.innerHTML = "Sound is on \xB7 <b>M</b> mutes it"),
    (o.style.top = e.bottom + 8 + "px"),
    (o.style.right = innerWidth - e.right + "px"),
    document.body.appendChild(o),
    t.classList.add("hello"),
    setTimeout(() => o.classList.add("on"), 30),
    setTimeout(() => {
      (o.classList.remove("on"),
        t.classList.remove("hello"),
        setTimeout(() => o.remove(), 500));
    }, 6500));
}
let Ir = -99,
  Br = -1,
  je = null;
function kh() {
  const t = gt(),
    e = vt(),
    o = Math.max(t, e),
    n = Lr(new f.Vector3()),
    a = se.length ? se[Math.floor(se.length * 0.5)] : _t(1, 1),
    i = a % j,
    l = Math.floor(a / j);
  return [
    {
      t: [t / 2, 0.4, -e / 2],
      yaw: Lt.yaw,
      pitch: Lt.pitch,
      dist: A.fitGoal,
      dy: 0.012,
      hold: 9,
    },
    {
      t: [i + 0.5, 0.7, -(l + 0.5)],
      yaw: Lt.yaw + 0.9,
      pitch: 0.3,
      dist: 3 + o * 0.07,
      dy: -0.02,
      hold: 7,
      r: 0.35,
    },
    {
      t: [Mt + 0.9, 0.6, dt],
      yaw: Lt.yaw + 0.3,
      pitch: 0.52,
      dist: 7.2,
      dy: 0.02,
      hold: 7,
      r: 0.4,
    },
    {
      t: [n.x, n.y - 1, n.z],
      yaw: Lt.yaw - 0.45,
      pitch: 0.4,
      dist: pc() * 4 + 6,
      dy: 0.03,
      hold: 7,
      r: 0.5,
    },
    {
      t: [t / 2, 0, -e / 2],
      yaw: Lt.yaw + 0.25,
      pitch: 1.36,
      dist: A.fitGoal * 1.05,
      dy: 0.006,
      hold: 7,
    },
    {
      t: [t + 8, 1, -e / 2 - 4],
      yaw: Lt.yaw + 1.4,
      pitch: 0.5,
      dist: o * 0.9 + 14,
      dy: -0.012,
      hold: 7,
    },
  ];
}
function lp(t, e) {
  const o = kh();
  ((Br = t % o.length),
    (je = o[Br]),
    (Ir = e),
    A.t.set(...je.t),
    A.tGoal.copy(A.t),
    (A.yaw = je.yaw),
    (A.pitch = je.pitch),
    (A.fit = je.dist),
    (A.fitGoal = je.dist),
    (Re = 1));
}
function cp(t) {
  if (
    ((!je || t - Ir > je.hold) &&
      (lp(Br + 1, t), (v("#veil").style.opacity = 0.6)),
    (v("#veil").style.opacity = Math.max(0, 0.6 - (t - Ir) * 2.4).toFixed(2)),
    Oe)
  )
    return;
  const e = t - Ir;
  ((A.yaw = je.yaw + e * je.dy),
    (A.fit = A.fitGoal = je.dist * (1 - e * 0.006)));
}
function Qs(t) {
  ((ge = t),
    t
      ? ((je = null), (Br = -1), (Oe = !1), Vo(null), ze(-1))
      : (v("#veil").style.opacity = 0),
    Za());
}
function Mh() {
  ge ? ir() : Qs(!0);
}
const fp = () => {
  const t = Pt();
  return s.done
    ? "A nation of robots"
    : t < 10
      ? "Garage tinkerer"
      : t < 100
        ? "Hardware startup"
        : t < 1e3
          ? "Pilot line"
          : t < 1e4
            ? "Low-rate production"
            : t < 1e5
              ? "Volume production"
              : t < 1e6
                ? "Mass production"
                : t < ia
                  ? "Gigafactory"
                  : "Ten million club";
};
function hp() {
  const t = {
      t: A.t.clone(),
      tg: A.tGoal.clone(),
      yaw: A.yaw,
      pitch: A.pitch,
      fit: A.fit,
      fg: A.fitGoal,
      zoom: Re,
      intro: Vt,
    },
    e = $e.visible,
    o = [mh, Ks, fc, fh];
  ((Vt = null),
    Ps(!1),
    A.t.copy(A.tGoal),
    (A.yaw = Lt.yaw),
    (A.pitch = Lt.pitch),
    (A.fit = A.fitGoal),
    (Re = 1),
    ($e.visible = !1));
  for (const a of Object.values(Hn)) a.visible = !1;
  (ql(z, 0),
    H.updateMatrixWorld(),
    (ht.shadowMap.needsUpdate = !0),
    xh(z, 0),
    zc(),
    Ye.render());
  const n = document.createElement("canvas");
  return (
    (n.width = ht.domElement.width),
    (n.height = ht.domElement.height),
    n.getContext("2d").drawImage(ht.domElement, 0, 0),
    A.t.copy(t.t),
    A.tGoal.copy(t.tg),
    (A.yaw = t.yaw),
    (A.pitch = t.pitch),
    (A.fit = t.fit),
    (A.fitGoal = t.fg),
    (Re = t.zoom),
    (Vt = t.intro),
    ($e.visible = e),
    ql(z, 0),
    H.updateMatrixWorld(),
    n
  );
}
const dp = (t, e) =>
  new Promise((o) => {
    const n = new Image();
    ((n.onload = () => o(n)),
      (n.onerror = () => o(null)),
      (n.src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" fill="none" stroke="${e}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${Sr[t]}</svg>`,
        )));
  });
async function up() {
  const t = hp(),
    e = document.createElement("canvas");
  ((e.width = 1200), (e.height = 630));
  const o = e.getContext("2d"),
    n = yt[s.gen],
    a = js(s.built);
  ((o.fillStyle = "#0b0f1a"), o.fillRect(0, 0, 1200, 630));
  const i = Math.max(1200 / t.width, 630 / t.height) * 1.1,
    l = t.width * i,
    r = t.height * i;
  o.drawImage(
    t,
    0,
    0,
    t.width,
    t.height,
    1200 * 0.67 - l / 2,
    630 * 0.5 - r * 0.5,
    l,
    r,
  );
  let c = o.createLinearGradient(0, 0, 760, 0);
  (c.addColorStop(0, "rgba(7,10,19,.97)"),
    c.addColorStop(0.6, "rgba(7,10,19,.78)"),
    c.addColorStop(1, "rgba(7,10,19,0)"),
    (o.fillStyle = c),
    o.fillRect(0, 0, 860, 630),
    (c = o.createLinearGradient(0, 500, 0, 630)),
    c.addColorStop(0, "rgba(7,10,19,0)"),
    c.addColorStop(1, "rgba(7,10,19,.88)"),
    (o.fillStyle = c),
    o.fillRect(0, 500, 1200, 130),
    (o.textBaseline = "alphabetic"),
    (o.textAlign = "left"),
    (o.fillStyle = "#7fe3ff"),
    (o.font = "600 19px DM Mono, monospace"),
    (o.letterSpacing = "4px"),
    o.fillText("A NATION OF ROBOTS", 50, 62),
    (o.letterSpacing = "0px"),
    (o.fillStyle = "#ffffff"),
    (o.font = "800 52px Outfit, sans-serif"),
    o.fillText(s.lab, 50, 118, 640));
  const h = fp().toUpperCase();
  ((o.font = "700 17px DM Mono, monospace"), (o.letterSpacing = "2px"));
  const d = o.measureText(h).width + 30;
  ((o.fillStyle = "#ffb454"),
    gs(o, 50, 138, d, 34, 10),
    o.fill(),
    (o.fillStyle = "#1b1206"),
    o.fillText(h, 65, 161),
    (o.letterSpacing = "0px"),
    (o.fillStyle = "#c9d1e4"),
    (o.font = "500 21px Outfit, sans-serif"),
    o.fillText(
      s.done
        ? `Ten million a year by ${cn(s.doneAt).long}`
        : `Brain v${s.gen + 1} \xB7 ${n.cls} \xB7 ${cn(s.played).long}`,
      50 + d + 16,
      162,
      600 - d,
    ),
    [
      ["ROBOTS BUILT", G(s.built)],
      ["A YEAR", G(Pt())],
      ["WORKING", G(Math.floor(s.kept))],
      ["POWER", Yt(p.draw)],
      ["EARNING", K(p.rev) + "/day"],
      ["EARNED", K(s.earned)],
    ].forEach(([b, y], w) => {
      const x = 50 + (w % 3) * 206,
        M = 196 + Math.floor(w / 3) * 98;
      ((o.fillStyle = "rgba(255,255,255,.075)"),
        gs(o, x, M, 194, 86, 15),
        o.fill(),
        (o.fillStyle = "#8d97b3"),
        (o.font = "500 14px DM Mono, monospace"),
        (o.letterSpacing = "2.5px"),
        o.fillText(b, x + 16, M + 30),
        (o.letterSpacing = "0px"),
        (o.fillStyle = "#ffffff"),
        (o.font = "500 30px DM Mono, monospace"),
        o.fillText(y, x + 16, M + 68, 166));
    }),
    (o.fillStyle = "#8d97b3"),
    (o.font = "500 14px DM Mono, monospace"),
    (o.letterSpacing = "2.5px"),
    o.fillText(
      a.past
        ? `MORE ROBOTS THAN ${a.past[1].replace(/^the /, "").toUpperCase()} HAS PEOPLE`
        : "THE BRAINS",
      50,
      424,
    ),
    (o.letterSpacing = "0px"));
  for (let b = 0; b < yt.length; b++) {
    const y = 58 + b * 38,
      w = 446,
      x = b <= s.gen;
    (o.beginPath(),
      o.arc(y, w, b === yt.length - 1 ? 11 : 9, 0, 7),
      x
        ? ((o.fillStyle = b === yt.length - 1 ? "#ffb454" : "#7fe3ff"),
          o.fill())
        : ((o.strokeStyle = "#ffffff40"), (o.lineWidth = 2.5), o.stroke()),
      b < yt.length - 1 &&
        ((o.fillStyle = b < s.gen ? "#7fe3ff88" : "#ffffff22"),
        o.fillRect(y + 11, w - 1.5, 16, 3)));
  }
  ((o.fillStyle = "#c9d1e4"),
    (o.font = "500 17px Outfit, sans-serif"),
    o.fillText(`Brain ${s.gen + 1} of ${yt.length}`, 58 + yt.length * 38, 452));
  const u = os
    .filter((b) => s.miles[b.id])
    .sort((b, y) => (s.miles[y.id] || 0) - (s.miles[b.id] || 0))
    .slice(0, 6);
  ((o.fillStyle = "#8d97b3"),
    (o.font = "500 14px DM Mono, monospace"),
    (o.letterSpacing = "2.5px"),
    o.fillText(`MILESTONES ${ic()} OF ${os.length}`, 50, 500),
    (o.letterSpacing = "0px"));
  const g = await Promise.all(u.map((b) => dp(b.ic, "#1b1206")));
  return (
    u.forEach((b, y) => {
      const w = 50 + y * 50,
        x = 514,
        M = o.createLinearGradient(w, x, w + 40, x + 40);
      (M.addColorStop(0, "#ffc067"),
        M.addColorStop(1, "#e07a2a"),
        (o.fillStyle = M),
        gs(o, w, x, 40, 40, 11),
        o.fill(),
        g[y] && o.drawImage(g[y], w + 9, x + 9, 22, 22));
    }),
    (o.fillStyle = "#c9d1e4"),
    (o.font = "500 20px Outfit, sans-serif"),
    (o.textAlign = "right"),
    o.fillText("Build one robot by hand. Build yours at", 1150, 566),
    (o.fillStyle = "#7fe3ff"),
    (o.font = "600 22px DM Mono, monospace"),
    o.fillText("sael.net/robots", 1150, 596),
    (o.textAlign = "left"),
    e
  );
}
let Zs = null;
function Sh() {
  const t = js(s.built);
  return s.done
    ? `${s.lab} went from one robot built by hand in a garage to ten million a year by ${cn(s.doneAt).long}: ${G(s.built)} robots built${t.past ? `, more than ${t.past[1]} has people` : ""}. Beat it:`
    : `My robot company, ${s.lab}, makes ${G(Pt())} humanoids a year now: ${G(s.built)} built${t.past ? `, more robots than ${t.past[1]} has people` : ""}. It started with one robot built by hand in a garage. Can you get to ten million a year?`;
}
async function Qa() {
  ((v("#share-note").textContent = ""),
    v("#share-img").removeAttribute("src"),
    v("#d-share").showModal(),
    O.tick());
  const t = await up();
  ((v("#share-img").src = t.toDataURL("image/png")),
    (Zs = null),
    t.toBlob((e) => {
      Zs = e;
    }, "image/png"));
}
const $h = "https://sael.net/robots/";
async function Rh() {
  try {
    return Zs
      ? (await navigator.clipboard.write([
          new ClipboardItem({ "image/png": Zs }),
        ]),
        !0)
      : !1;
  } catch {
    return !1;
  }
}
((v("#sh-x").onclick = async () => {
  s.stats.shares++;
  const t = Zs && new File([Zs], "robots.png", { type: "image/png" });
  if (
    t &&
    navigator.canShare?.({ files: [t] }) &&
    matchMedia("(pointer:coarse)").matches
  )
    try {
      await navigator.share({ files: [t], text: Sh(), url: $h });
      return;
    } catch {}
  const e = await Rh();
  (window.open(
    "https://x.com/intent/post?text=" +
      encodeURIComponent(Sh()) +
      "&url=" +
      encodeURIComponent($h),
    "_blank",
    "noopener",
  ),
    (v("#share-note").textContent = e
      ? "The picture is on your clipboard: paste it into the post."
      : "Download the picture to attach it to the post."));
}),
  (v("#sh-dl").onclick = () => {
    s.stats.shares++;
    const t = document.createElement("a");
    ((t.href = v("#share-img").src),
      (t.download = `${s.lab.replace(/\W+/g, "-").toLowerCase()}-robots.png`),
      t.click());
  }),
  (v("#sh-copy").onclick = async () => {
    (s.stats.shares++,
      (v("#share-note").textContent = (await Rh())
        ? "Copied."
        : "Your browser would not copy the picture: download it instead."));
  }),
  (v("#brag").onclick = () => Qa()),
  (v("#end-share").onclick = () => {
    (v("#d-end").close(), Qa());
  }),
  (v("#end-new").onclick = () => {
    (v("#d-end").close(), _1());
  }),
  document
    .querySelectorAll("dialog [data-close]")
    .forEach((t) => (t.onclick = () => t.closest("dialog").close())),
  document.querySelectorAll("dialog").forEach((t) =>
    t.addEventListener("click", (e) => {
      e.target === t && t.close();
    }),
  ),
  (v("#labname").onclick = () => {
    ((v("#lab-input").value = s.lab),
      v("#d-name").showModal(),
      setTimeout(() => v("#lab-input").select(), 30));
  }));
const Th = (t) => {
  ((t = String(t || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24)),
    t &&
      ((s.lab = t),
      (s.named = !0),
      Xt(),
      vr(!0),
      Ta(),
      Ba(),
      v("#d-name").close()));
};
((v("#name-ok").onclick = () => Th(v("#lab-input").value)),
  v("#lab-input").addEventListener("keydown", (t) => {
    t.key === "Enter" && Th(t.target.value);
  }),
  (v("#name-rnd").onclick = () => {
    v("#lab-input").value = vi[Math.floor(ce() * vi.length)];
  }),
  (v("#how").onclick = () => v("#d-help").showModal()),
  (v("#reset-open").onclick = () => {
    (v("#d-help").close(), v("#d-reset").showModal());
  }),
  (v("#reset-yes").onclick = () => {
    try {
      localStorage.removeItem(nl);
    } catch {}
    (v("#d-reset").close(),
      (s = xn()),
      Mi(),
      (rt.W.length = 0),
      (rt.crates.length = 0),
      (rt.riser = null),
      ta(),
      ir(),
      Et(
        "A fresh garage",
        "One workbench, one winding bench, six thousand dollars.",
        "c",
        null,
        { icon: "garage", kick: "Start over" },
      ));
  }),
  (v("#launch").onclick = () => Xa()));
function Za() {
  const t = v("#gfx");
  if (!t) return;
  t.querySelectorAll("[data-tod]").forEach((o) => {
    const n = o.dataset.tod === X.mode;
    (o.classList.toggle("on", n), o.setAttribute("aria-pressed", n));
  });
  const e = v("#tod-now");
  (e && (e.textContent = Ih(X.th)),
    t.querySelectorAll("[data-q]").forEach((o) => {
      const n = o.dataset.q === Ce;
      (o.classList.toggle("on", n), o.setAttribute("aria-pressed", n));
    }),
    (v("#gfx-note").textContent = yp[Ce]));
  for (const [o, n] of [
    ["g-cine", ge],
    ["g-map", Js],
  ]) {
    const a = v("#" + o);
    (a.classList.toggle("on", n), a.setAttribute("aria-pressed", n));
  }
}
function yc(t) {
  const e = v("#gfx"),
    o = v("#gear");
  ((e.hidden = !t),
    v(".ctl").classList.toggle("gfx-on", t),
    o.classList.toggle("on", t),
    o.setAttribute("aria-expanded", t),
    t &&
      (Za(),
      (v("#gfx-fps").textContent = ss > 2 ? Math.round(Ah) + " fps" : "")));
}
if (
  ((v("#gear").onclick = () => {
    (yc(v("#gfx").hidden), O.tick());
  }),
  v("#gfx")
    .querySelectorAll("[data-q]")
    .forEach(
      (t) =>
        (t.onclick = () => {
          (vc(t.dataset.q), O.tick());
        }),
    ),
  v("#gfx")
    .querySelectorAll("[data-tod]")
    .forEach(
      (t) =>
        (t.onclick = () => {
          X.mode = t.dataset.tod;
          try {
            localStorage.setItem(Nr + "-tod", X.mode);
          } catch {}
          (Za(), O.tick());
        }),
    ),
  (v("#g-cine").onclick = () => {
    (Mh(), O.tick());
  }),
  (v("#g-map").onclick = () => {
    (U0(!Js), O.tick());
  }),
  Co.forEach((t) => t.addEventListener("click", () => yc(!1))),
  de.presented)
) {
  const t = v("#presented");
  ((t.innerHTML = `Presented by <a href="${de.presented.url}" target="_blank" rel="noopener">${de.presented.name}</a>`),
    t.classList.add("on"));
}
const un = [
  ["pixelRatio", "Pixel ratio", 1, 2, 0.05, (t) => t.toFixed(2)],
  ["msaa", "MSAA", 0, 4, 2, (t) => (t ? t + "\xD7" : "off")],
  ["smaa", "SMAA", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["exposure", "Exposure", 0.6, 1.8, 0.02, (t) => t.toFixed(2)],
  ["fov", "Field of view", 18, 55, 1, (t) => t + "\xB0"],
  ["sun", "Key light", 0, 3, 0.05, (t) => t.toFixed(2)],
  ["fill", "Fill light", 0, 2, 0.05, (t) => t.toFixed(2)],
  ["rim", "Rim light", 0, 3, 0.05, (t) => t.toFixed(2)],
  ["fog", "Haze", 0, 3, 0.05, (t) => t.toFixed(2)],
  ["sat", "Saturation", 0.6, 1.8, 0.02, (t) => t.toFixed(2)],
  ["env", "Environment", 0, 2, 0.05, (t) => t.toFixed(2)],
  ["reflect", "Floor mirror", 0, 2, 0.05, (t) => t.toFixed(2)],
  ["dof", "Depth of field", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["focalBand", "focal band", 0.3, 5, 0.05, (t) => t.toFixed(2) + "\xD7", 1],
  ["aperture", "far blur", 0.05, 3, 0.05, (t) => t.toFixed(2), 1],
  ["apertureNear", "near blur", 0.05, 3, 0.05, (t) => t.toFixed(2), 1],
  ["maxCoc", "max bokeh", 3, 24, 1, (t) => t + "px", 1],
  ["bloom", "Bloom", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["bloomStrength", "strength", 0, 3, 0.02, (t) => t.toFixed(2) + "\xD7", 1],
  ["bloomRadius", "radius", 0, 1.5, 0.02, (t) => t.toFixed(2), 1],
  ["bloomThreshold", "threshold", 0, 3, 0.05, (t) => t.toFixed(2) + "\xD7", 1],
  ["ao", "Ambient occlusion", 0, 1, 1, (t) => (t ? "on" : "off")],
  ["aoIntensity", "intensity", 0, 1.5, 0.02, (t) => t.toFixed(2), 1],
  ["aoRadius", "radius", 0.1, 4, 0.05, (t) => t.toFixed(2), 1],
  ["aoSamples", "samples", 2, 16, 1, (t) => t, 1],
  ["auto", "Auto quality", 0, 1, 1, (t) => (t ? "on" : "off")],
];
let Wo = 0,
  Ah = 0,
  _r = 0,
  ss = 0,
  ti = 0;
function pp() {
  ((Zo.radius = E.bloomRadius),
    (fi.uReflStrength.value = 0.55 * E.reflect),
    (Bc.value = E.sat),
    Bh());
}
const gp = 360,
  ei = 0.86,
  mp = 0.5,
  Ch = 1.08,
  xc = fs.clone(),
  Lh = new f.Vector3(fs.x, 0, fs.z)
    .normalize()
    .multiplyScalar(Math.cos(Ch))
    .setY(Math.sin(Ch)),
  Wt = {
    bg: new f.Color("#121a2c"),
    bgD: new f.Color("#a9c9e3"),
    fog: new f.Color("#26304a"),
    fogD: new f.Color("#c3d6e6"),
    hs: new f.Color(9414360),
    hsD: new f.Color("#d6e8f7"),
    hg: new f.Color(3155999),
    hgD: new f.Color("#7a7462"),
    sun: new f.Color(16761994),
    sunD: new f.Color("#fff2e0"),
    sunW: new f.Color("#ffb070"),
    asph: new f.Color("#26292f"),
    asphD: new f.Color("#70747b"),
    rock: [new f.Color("#5d5a72"), new f.Color("#4b4a60")],
    rockD: [new f.Color("#a7b6c6"), new f.Color("#93a6b9")],
    win: new f.Color(1.55, 1.18, 0.72),
    winD: new f.Color(0.33, 0.42, 0.52),
    city: new f.Color(1.9, 1.8, 1.7),
    cityD: new f.Color(0.62, 0.68, 0.78),
    lampD: new f.Color("#cfcac0").multiplyScalar(0.85),
    gnd: new f.Color(1, 1, 1),
    gndD: new f.Color(3.7, 3.8, 3.2),
  },
  Eh = new f.Color(),
  Dr = new f.Vector3(),
  Ih = (t) =>
    t < Math.PI
      ? t < 0.3
        ? "Sunrise"
        : t < 1.15
          ? "Morning"
          : t < 2
            ? "Midday"
            : t < 2.85
              ? "Afternoon"
              : "Sunset"
      : t < Math.PI * 1.2
        ? "Dusk"
        : t < Math.PI * 1.8
          ? "Night"
          : "Dawn";
function Bh() {
  const t = X.d,
    e = (o, n) => o + (n - o) * t;
  ((ht.toneMappingExposure = E.exposure * e(1, 0.8)),
    (Zt.environmentIntensity = E.env * e(0.45, 0.55)),
    (Zo.threshold = E.bloomThreshold * e(1, 1.6)),
    (Zo.strength = 0.5 * E.bloomStrength * e(1, 0.55)),
    (ii.intensity = 0.55 * E.fill * e(1, 2.1)),
    (Vr.intensity = 0.42 * E.fill * e(1, 0.6)),
    (zt.intensity = 1.9 * E.sun * e(1, 1.8)),
    (Ur.intensity = 0.75 * E.rim * e(1, 0.15)),
    ii.color.copy(Wt.hs).lerp(Wt.hsD, t),
    ii.groundColor.copy(Wt.hg).lerp(Wt.hgD, t),
    Eh.copy(Wt.sunD).lerp(Wt.sunW, X.warm),
    zt.color.copy(Wt.sun).lerp(Eh, t),
    Zt.background.copy(Wt.bg).lerp(Wt.bgD, t),
    Zt.fog.color.copy(Wt.fog).lerp(Wt.fogD, t),
    (X.fogK = e(1, 0.7)),
    (X.outL = 1 - t),
    (X.inL = e(1, 0.55)),
    fe.ground?.color.copy(Wt.gnd).lerp(Wt.gndD, t),
    fe.asph?.color.copy(Wt.asph).lerp(Wt.asphD, t),
    fe.rock?.forEach((o, n) => o.color.copy(Wt.rock[n]).lerp(Wt.rockD[n], t)),
    fe.win?.color.copy(Wt.win).lerp(Wt.winD, t),
    fe.city?.color.copy(Wt.city).lerp(Wt.cityD, t),
    fe.cityGlow && (fe.cityGlow.opacity = 0.16 * (1 - t)));
  for (const [o, n] of fe.lamps) o.color.copy(n).lerp(Wt.lampD, t);
  for (const [o, n, a] of fe.tint) o.color.copy(n).lerp(a, t);
  ((ha.uDay.value = t), (ha.uWarm.value = X.warm));
}
function bp(t, e) {
  X.t0 === null && (X.t0 = t);
  let o;
  if (X.mode === "pin") o = X.pin;
  else if (X.mode === "day") o = 0.95;
  else if (X.mode === "night") o = Math.PI + 0.06;
  else {
    const c = ((((mp / Math.PI) * ei + (t - X.t0) / gp) % 1) + 1) % 1;
    o = c < ei ? (Math.PI * c) / ei : Math.PI * (1 + (c - ei) / (1 - ei));
  }
  const n = Math.PI * 2,
    a = (((o - X.th) % n) + n) % n;
  ((X.th =
    !X.first || e > 1 || a < 5e-4 || a > n - 5e-4
      ? o
      : (X.th + a * Math.min(1, e * 3)) % n),
    (X.first = 1));
  const i = X.th,
    l = Math.sin(i),
    r = i < Math.PI;
  if (
    ((X.d = r ? Bo(0, 0.22, l) : 0),
    (X.warm = r ? Bo(0, 0.06, l) * (1 - Bo(0.16, 0.5, l)) : 0),
    fs.copy(xc).lerp(Lh, X.d).normalize(),
    zt.position.copy(fs).multiplyScalar(X.sunR).add(zt.target.position),
    Dr.set(xc.x, 0.08, xc.z).normalize().lerp(Lh, X.d).normalize(),
    ha.uSun.value.copy(Dr),
    (zt.shadow.radius = 2 + 1.5 * X.d),
    (zt.shadow.intensity = 1 - 0.28 * X.d),
    Bh(),
    (Math.abs(X.d - X.envD) > 0.05 ||
      Math.abs(X.warm - X.envW) > 0.08 ||
      Dr.dot(ds.uSun.value) < 0.9945) &&
      ((X.envD = X.d),
      (X.envW = X.warm),
      (ds.uDay.value = X.d),
      (ds.uWarm.value = X.warm),
      ds.uSun.value.copy(Dr),
      Fc()),
    t - X.wordAt > 1 && !v("#gfx").hidden)
  ) {
    X.wordAt = t;
    const c = v("#tod-now");
    c && (c.textContent = Ih(i));
  }
}
function mo() {
  ((E.pixelRatio = Math.max(1, E.pixelRatio || 1)),
    ht.setPixelRatio(E.pixelRatio),
    Ye.setPixelRatio(E.pixelRatio),
    sa.rt.samples !== E.msaa && ((sa.rt.samples = E.msaa), sa.rt.dispose()),
    (Uc.enabled = !!E.smaa),
    (Zo.enabled = !!E.bloom),
    (It.enabled = !0),
    It.updateGtaoMaterial({
      radius: E.aoRadius * _h(),
      thickness: 1.2 * _h(),
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: E.ao ? E.aoSamples : 2,
    }),
    (bn.enabled = !!E.dof),
    (bn.u.maxCoc.value = E.maxCoc),
    pp(),
    Gh());
}
const _h = () => D(0.7 + Math.max(gt(), vt()) * 0.05, 0.7, 2.6),
  wc = {
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
      px: Ic,
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
  yp = {
    auto: "Picks a level for this device, and steps down if the game starts to stutter.",
    low: "For older laptops and phones: no floor reflections, contact shadows or background blur.",
    mid: "Contact shadows and background blur, without the floor reflections.",
    high: "Everything on, and sharper on high-resolution screens.",
    ultra: "Full resolution on every screen. Wants a fast graphics card.",
  },
  xp = () =>
    Math.min(innerWidth, innerHeight) < 600 ||
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 8) <= 4;
let Ce = "auto";
try {
  Ce =
    new URLSearchParams(location.search).get("gfx") ||
    localStorage.getItem("robots-gfx") ||
    "auto";
} catch {}
Ce !== "auto" && !wc[Ce] && (Ce = "auto");
function vc(t, e) {
  if (((Ce = wc[t] ? t : "auto"), !e))
    try {
      localStorage.setItem("robots-gfx", Ce);
    } catch {}
  const o = wc[Ce === "auto" ? (xp() ? "mid" : "high") : Ce],
    n = innerWidth || 1440,
    a = innerHeight || 840,
    i = D(
      Math.min(
        devicePixelRatio || 1,
        o.cap,
        o.px ? Math.sqrt(o.px / (n * a)) : 1,
      ),
      1,
      2,
    );
  (Object.assign(E, {
    pixelRatio: +i.toFixed(2),
    msaa: Ce === "ultra" ? 4 : Math.min(o.msaa, i >= 1.5 ? 2 : 4),
    ao: o.ao,
    aoSamples: o.aoSamples,
    dof: o.dof,
    reflect: o.reflect,
    shadowMin: o.shadow[0],
    shadow: o.shadow[1],
    auto: Ce === "auto" ? 1 : 0,
  }),
    (E._ceil = void 0),
    (ti = 0),
    (ss = 0),
    (_r = 0),
    mo(),
    i0(),
    (ht.shadowMap.needsUpdate = !0),
    Za(),
    e ||
      xt(
        Ce === "auto"
          ? "Graphics: Auto"
          : `Graphics: ${v('#gfx [data-q="' + Ce + '"]').textContent}`,
      ));
}
function Ln() {
  ((v("#tune-rows").innerHTML = un
    .map(([t, e, o, n, , a, i], l) => {
      const r = E[t],
        c = ((r - o) / (n - o)) * 100;
      return `<div class="tr${l === Wo ? " sel" : ""}${i ? " sub" : ""}" data-i="${l}"><b>${e}</b><span class="tk"><i style="left:${D(c, 0, 100)}%"></i></span><u>${a(r)}</u></div>`;
    })
    .join("")),
    v("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((t) => {
        t.onclick = () => {
          ((Wo = +t.dataset.i), Ln());
        };
        const e = t.querySelector(".tk");
        e.onpointerdown = (o) => {
          (o.stopPropagation(),
            (Wo = +t.dataset.i),
            e.setPointerCapture(o.pointerId));
          const n = (a) => {
            const i = e.getBoundingClientRect(),
              [l, , r, c, h] = un[Wo],
              d = D(
                Math.round(
                  (r + ((a.clientX - i.left) / i.width) * (c - r)) / h,
                ) * h,
                r,
                c,
              );
            d !== E[l] &&
              ((E[l] = +d.toFixed(4)), l !== "auto" && (E.auto = 0), mo());
            const m = e.querySelector("i");
            ((m.style.left = D(((E[l] - r) / (c - r)) * 100, 0, 100) + "%"),
              (t.querySelector("u").textContent = un[Wo][5](E[l])),
              (v("#tune-json").value = JSON.stringify(E)));
          };
          (n(o),
            (e.onpointermove = (a) => {
              e.hasPointerCapture(a.pointerId) && n(a);
            }),
            (e.onpointerup = () => Ln()));
        };
      }),
    (v("#tune-json").value = JSON.stringify(E)));
}
function wp(t, e) {
  const [o, , n, a, i] = un[Wo],
    l = D(+(E[o] + t * i * (e ? 5 : 1)).toFixed(4), n, a);
  l !== E[o] && ((E[o] = l), o !== "auto" && (E.auto = 0), mo(), Ln());
}
function Dh(t) {
  const e = v("#tune"),
    o = t === void 0 ? e.hidden : t;
  ((e.hidden = !o), o && Ln());
}
function vp(t) {
  const e = t.key;
  return e === "ArrowUp" || e === "ArrowDown"
    ? ((Wo = (Wo + (e === "ArrowUp" ? -1 : 1) + un.length) % un.length),
      Ln(),
      v("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0)
    : e === "ArrowLeft" || e === "ArrowRight"
      ? (wp(e === "ArrowLeft" ? -1 : 1, t.shiftKey), !0)
      : e === "0" || e === ")"
        ? (t.shiftKey ? Object.assign(E, Xr) : (E[un[Wo][0]] = Xr[un[Wo][0]]),
          (E.auto = 0),
          mo(),
          Ln(),
          !0)
        : e === "c" || e === "C"
          ? (navigator.clipboard?.writeText(JSON.stringify(E, null, 1)), !0)
          : e === "Escape"
            ? (Dh(!1), !0)
            : !1;
}
(v("#tune-json").addEventListener("change", (t) => {
  try {
    const e = JSON.parse(t.target.value);
    for (const o in Xr)
      if (typeof e[o] == "number" && isFinite(e[o])) {
        const n = un.find((a) => a[0] === o);
        E[o] = n ? D(e[o], n[2], n[3]) : e[o];
      }
    ((E.auto = 0), mo(), Ln());
  } catch {
    Ln();
  }
}),
  addEventListener("keydown", (t) => {
    if (
      (t.metaKey || t.ctrlKey) &&
      !t.altKey &&
      (t.code === "Quote" || t.key === "'")
    ) {
      (t.preventDefault(), Dh());
      return;
    }
    if (
      t.metaKey ||
      t.ctrlKey ||
      t.altKey ||
      /^(INPUT|SELECT|TEXTAREA)$/.test(t.target.tagName) ||
      document.querySelector("dialog[open]")
    )
      return;
    if (!v("#tune").hidden && vp(t)) {
      t.preventDefault();
      return;
    }
    const e = t.key.toLowerCase();
    if (
      (O.wake(),
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
      ].includes(e))
    ) {
      (e.startsWith("arrow") && t.preventDefault(), Fs.add(e));
      return;
    }
    if (e === "[" || e === "]") {
      s.chose && qo(s.split + (e === "]" ? 0.05 : -0.05), "key");
      return;
    }
    if (/^[1-9]$/.test(e)) {
      const o = A0[+e - 1],
        n = At[o];
      if (!$t(n)) {
        xt(`${n.name}: unlocks with brain v${n.gen + 1}`);
        return;
      }
      (Te !== "build" && Co[0].click(),
        (s.seen["tool_" + o] = 1),
        Vo(Ht === o ? null : o),
        O.tick());
      return;
    }
    if (e === "escape") {
      v("#gfx").hidden ? (Ht ? Vo(null) : ze(-1)) : yc(!1);
      return;
    }
    if (e === " ") {
      (t.preventDefault(), lo() && Xa());
      return;
    }
    if (e === "enter" && t.target.tagName !== "BUTTON") {
      t.preventDefault();
      const o = jn("you"),
        n = Gn("you"),
        a = zn("you");
      !o &&
        !n &&
        !a &&
        xt(
          "Nobody is waiting at the gate, no truck is loaded, and nothing has jammed",
        );
      return;
    }
    if ((e === "delete" || e === "backspace") && No >= 0) {
      (Hl(No), uo());
      return;
    }
    if (e === "c") {
      Mh();
      return;
    }
    if (e === "r") {
      ir();
      return;
    }
    if (e === "m") {
      (O.toggle(), bc(), xt(O.on ? "Sound on" : "Sound off"));
      return;
    }
    e === "/" &&
      (t.preventDefault(),
      bo.classList.toggle("ui-off"),
      xt(
        bo.classList.contains("ui-off")
          ? "Interface hidden \xB7 / to show"
          : "Interface shown",
      ));
  }));
let z = 0,
  pn = 0.016,
  En = 0.016,
  oi = 1,
  Ph = 0,
  Fh = 0,
  Oh = !1;
const kp = 3;
function zh() {
  const t = Math.max(1, Xo.clientWidth),
    e = Math.max(1, Xo.clientHeight);
  ee = t < 900;
  const o = E.fov + (ee ? 10 : 0);
  (H.fov !== o && ((H.fov = o), H.updateProjectionMatrix()),
    H.setViewOffset(t, e, ee ? 0 : t * 0.015, ee ? e * 0.14 : e * 0.035, t, e));
}
function Gh() {
  const t = Math.max(1, Xo.clientWidth),
    e = Math.max(1, Xo.clientHeight);
  ((H.aspect = t / e),
    H.updateProjectionMatrix(),
    ht.setSize(t, e),
    Ye.setSize(t, e));
  const o = ht.getDrawingBufferSize(new f.Vector2());
  (Hr.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    Nc.uRes.value.copy(o),
    zh(),
    H.updateProjectionMatrix(),
    Oe || Ps(!1));
}
addEventListener("resize", Gh);
let jh = performance.now(),
  kc = 0,
  Mc = 0,
  Nh = 0;
function Sc(t) {
  ((En = D((t - jh) / 1e3, 0, 8 * 3600)), (pn = Math.min(0.1, En)), (jh = t));
  const e = t / 1e3;
  ((z = e), (Rl.value = e), (ha.uTime.value = e), (an.time.value = e));
  const o = En * oi;
  if (En > kp) {
    const n = fl(o);
    n && En >= 60 && dc(n, En);
  } else df(o);
  ((p.dirty || hf() !== p.crewKey) && ke(),
    Ke && Ro(),
    p.lineFull !== Oh && ((Oh = p.lineFull), (xe = !0)),
    X1(pn * oi),
    F1(),
    ah(),
    hh(),
    !s.done && Pt() >= ia && B1(),
    ge && cp(e),
    Qu(pn),
    du(pn),
    ql(e, pn),
    H.updateMatrixWorld(),
    (xe ||
      z - Dl > 2 ||
      (z - Dl > 0.4 &&
        H.position.distanceTo(Qf) > Math.max(1.5, A.fitGoal * 0.12))) &&
      ju(),
    rt.tick(pn),
    Xu());
  {
    const n = p.you;
    n >= 0
      ? ((za.visible = !0),
        za.position.set((n % j) + 0.5, 0.55, -(Math.floor(n / j) + 0.5) - 0.08))
      : (za.visible = !1);
  }
  if (
    ((Pf.value = p.posts > 0 ? D(p.made / Math.max(p.Rfull, 1e-9), 0, 1) : 0),
    (Ff.value = p.brown < 0.995 ? D((1 - p.brown) * 3, 0.3, 1) : 0),
    (t - Fh > 50 || Ke) && ((ht.shadowMap.needsUpdate = !0), (Fh = t)),
    ip(e),
    xh(e, pn),
    L1(),
    r1(),
    vr(),
    Jt && _0(),
    S1(pn),
    $1(),
    A1(),
    z - Y0 > 6.5 && v("#banner").classList.remove("on"),
    $r.classList.contains("on") && z - H0 > 1.8 && $r.classList.remove("on"),
    uu(e, pn),
    $l >= 2 && z - _f > 1 && Ta(),
    O.hum(D(p.draw / Math.max(p.cap, 1e-9), 0, 1)),
    z - Ph > 10 && ((Ph = z), Xt()),
    (kc += En),
    Mc++,
    t - Nh > 1600)
  ) {
    const n = Mc / Math.max(kc, 0.001);
    ((kc = 0),
      (Mc = 0),
      (Nh = t),
      (Ah = n),
      ss++,
      v("#tune").hidden ||
        (v("#tune-fps").textContent = Math.round(n) + " fps"),
      !v("#gfx").hidden &&
        ss > 1 &&
        (v("#gfx-fps").textContent = Math.round(n) + " fps"),
      ss > 2 && (_r = Math.max(_r, n)),
      (ti = ss > 3 && n < _r * 0.74 ? ti + 1 : 0),
      E._ceil === void 0 &&
        ((E._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (E._good = 0),
        (E._probe = 0)),
      !document.hidden &&
        E.auto &&
        ss > 3 &&
        (E._probe && n < 55
          ? ((E._probe = 0),
            (E._good = 0),
            (E._ceil = Math.max(1, +(E.pixelRatio - 0.25).toFixed(2))),
            (E.pixelRatio = E._ceil),
            mo())
          : ((E._probe = 0),
            (E._good = n >= 58 ? Math.min(9, E._good + 1) : 0),
            E._good >= 3 &&
              E.pixelRatio < E._ceil &&
              ((E._good = 0),
              (E._probe = 1),
              (E.pixelRatio = Math.min(
                E._ceil,
                +(E.pixelRatio + 0.25).toFixed(2),
              )),
              mo()))),
      !document.hidden &&
        E.auto &&
        ti >= 2 &&
        n < 50 &&
        ((ti = 0),
        E.pixelRatio > 1
          ? ((E.pixelRatio = E._ceil =
              Math.max(1, +(E.pixelRatio - 0.25).toFixed(2))),
            mo())
          : E.reflect
            ? ((E.reflect = 0), mo())
            : E.msaa > 0
              ? ((E.msaa = 0), mo())
              : E.ao && ((E.ao = 0), mo())));
  }
  (bp(e, En), zc(), ht.info.reset(), Ye.render());
}
let $c = !0;
function Uh(t) {
  (requestAnimationFrame(Uh), $c && Sc(t));
}
(addEventListener("visibilitychange", () => {
  document.hidden && Xt();
}),
  addEventListener("pagehide", Xt));
function ta() {
  (Dn(),
    Ru(),
    Lf(),
    Af(),
    ke(),
    Ro(),
    Ps(!0),
    (Jt = !0),
    _0(),
    gr(),
    Ba(),
    vr(!0),
    (Hs = !0),
    lh(),
    (xe = !0));
}
const Mp = Ro;
Ro = function () {
  (Mp(), (il = []));
  for (const t in jo) At[t].kind === "parts" && il.push(...jo[t].list);
  xe = !0;
};
const Pr = sf();
(Pr || ((s = xn()), Mi()),
  zh(),
  vc(Ce, !0),
  ta(),
  Pr && J1(),
  v("#loading").remove(),
  requestAnimationFrame(Uh),
  Pr ||
    ((Jt = !0),
    (Vt = { at: null, d0: A.fitGoal * 5.2, p0: new f.Vector3(18, 0, -12) }),
    (A.fit = Vt.d0),
    A.t.copy(Vt.p0)),
  Pr ||
    setTimeout(
      () =>
        Et(
          "It starts in a garage",
          "One workbench and one robot, nearly finished by hand. Every robot after it is up to you.",
          "c",
          null,
          { icon: "garage", kick: "Day one" },
        ),
      900,
    ),
  (window.__step = (t) => Sc(t)),
  (window.__loop = (t) => {
    $c = t;
  }),
  (window.__capture = (t = 1200, e = 0.85) => {
    const o = ht.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = t),
      (n.height = Math.round((t * o.height) / o.width)),
      n.getContext("2d").drawImage(o, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", e)
    );
  }));
let Rc = !1,
  Vh = 0;
const In = { period: 0, staff: !0, last: 0, full: 0, days: 0 };
function qh() {
  if (!Rc || z - Vh < 0.25 / oi) return;
  if (((Vh = z), s.built < 1)) {
    qa();
    return;
  }
  if (!s.chose) {
    s.ready >= 1 && fa(!0);
    return;
  }
  if (
    (In.days++,
    p.lineFull && In.full++,
    (!In.period || s.played - In.last >= In.period) &&
      ((In.last = s.played),
      s.ready >= 1 && jn("bot"),
      s.trucks.length && Gn("bot"),
      s.jams.length && zn("bot")),
    lo())
  ) {
    Xa();
    return;
  }
  if (Je() && In.staff) {
    for (const h of ["gate", "dock", "fix"])
      s.gen >= Tt[h].gen && s.staff[h] !== 2
        ? Zl(h)
        : !s.staff[h] &&
          s.cash > Tt[h].wage * 40 &&
          (h !== "fix" || s.stats.jams > 0) &&
          O0(h);
    s.gen >= Tt.build.gen && !s.staff.build && Zl("build");
    const c = xi[s.staff.crews || 0];
    c != null && s.sites.length > Me() && s.cash >= c * 3 && z0();
  }
  for (const c of so)
    $t(c) &&
      !s.res[c.id] &&
      s.cash >= c.cost &&
      c.cost < Math.max(p.rev, 1) * 45 &&
      B0(c.id);
  const t = s.gen < he ? ro() / (90 * Ct.learn) : 0,
    e = p.under ? 0.85 : p.gym < t ? 0.35 : 0;
  Math.abs(e - s.split) > 0.01 && qo(e);
  const o = s.proj
    .filter((c) => c.kind === "plant")
    .reduce((c, h) => c + tn[h.id].kw * Ct.power, 0);
  if (p.draw > (p.cap + o) * 0.8) {
    const c = Po.filter((h) => $t(h) && sl(h.id) < h.max).sort(
      (h, d) => d.kw / wn(d) - h.kw / wn(h),
    )[0];
    c && s.cash >= wn(c) && I0(c.id);
  }
  if (p.brown < 0.999 || s.sites.length >= Me() + 2) return;
  const n = dr("station"),
    a = fr();
  {
    const c = pt[s.lvl + 1];
    if (c && !fn() && a <= gt() * vt() * 0.15 && s.cash >= c[2] * 1.2) {
      Ua();
      return;
    }
  }
  if (p.starved) {
    if (s.sites.some((m) => Q[m.ix].kind === "parts")) return;
    const c = se.filter((m) => io[m] < 0.98),
      h = Math.max(...c.map((m) => Q[s.cells[m]].cls)),
      d = dr("parts", h);
    if (d && s.cash >= d.cost) {
      let m = zs(d);
      (m < 0 && ((m = c[Math.floor(c.length / 2)]), Hl(m)), Qn(d, m, !0), uo());
    }
    return;
  }
  if (p.under && s.cash < To(n) * 2) return;
  if (a <= 1) {
    const c = pt[s.lvl + 1];
    if (c && !fn() && s.cash >= c[2]) {
      Ua();
      return;
    }
    const h = se.find((d) => Q[s.cells[d]].ix < n.ix);
    h != null &&
      s.cash >= To(n) * 1.3 &&
      Gs(n) > Gs(Q[s.cells[h]]) * 3 &&
      (Qn(n, h, !0), uo());
    return;
  }
  const i = zs(n),
    l = i >= 0 ? ur(n, i) : { f: 0 };
  if (i >= 0 && l.f >= 0.98 && s.cash >= To(n)) {
    (Qn(n, i, !0), uo());
    return;
  }
  const r = dr("parts", n.cls);
  if (r && s.cash >= r.cost + To(n)) {
    const c = zs(r);
    (Qn(r, c >= 0 ? c : i, !0), uo());
  }
}
const Sp = Sc;
((window.__step = (t) => {
  (Sp(t), qh());
}),
  (function t() {
    (requestAnimationFrame(t), $c && qh());
  })(),
  (window.__lab = {
    S: () => s,
    SIM: p,
    tod: (t) => {
      ((X.mode = t == null ? "cycle" : "pin"), (X.pin = t), (X.first = 0));
    },
    tileXY: (t, e) => {
      J.set(t + 0.5, kt, -(e + 0.5)).project(H);
      const o = Dt.getBoundingClientRect();
      return [
        o.left + (J.x * 0.5 + 0.5) * o.width,
        o.top + (-J.y * 0.5 + 0.5) * o.height,
      ];
    },
    sug: (t) => {
      const e = zs(At[t || Ht || "bench"]);
      return e < 0 ? null : [e % j, Math.floor(e / j)];
    },
    cash: (t) => {
      s.cash = t;
    },
    gen: (t) => {
      ((s.gen = D(t, 0, he)), Dn(), ke(), (Jt = !0));
    },
    lvl: (t) => {
      ((s.lvl = D(t, 0, pt.length - 1)), ta());
    },
    speed: (t) => {
      oi = t;
    },
    bot: (t) => {
      Rc = !!t;
    },
    botMode: (t) => Object.assign(In, t),
    kept: (t) => {
      ((s.kept = t), ke(), (xe = !0));
    },
    put: (t, e, o) => {
      ((s.cells[_t(e, o)] = t ? At[t].ix : 0),
        (kn[_t(e, o)] = -99),
        ke(),
        Ro());
    },
    split: (t) => qo(t),
    choose: (t) => fa(t !== !1),
    fit: () => qa(),
    plant: (t, e) => {
      ((s.plants[t] = e), Ul());
    },
    res: (t) => {
      ((s.res[t] = 1), Dn(), ke());
    },
    launch: Xa,
    save: Xt,
    reset: () => {
      ((s = xn()),
        Mi(),
        (rt.W.length = 0),
        (rt.crates.length = 0),
        (rt.riser = null),
        ta());
    },
    tool: Vo,
    select: ze,
    cine: Qs,
    tune: (t) => (Object.assign(E, t), mo(), { ...E }),
    toast: (...t) => Et(...t),
    money: K,
    board: (t) => {
      if (t == null || t < 0) {
        tt.pin = -1;
        return;
      }
      ((tt.pin = t), (tt.face = tt.base = t), (tt.turning = !1), (tt.prog = 0));
    },
    faces: () => Ma.map((t) => t.c.toDataURL("image/png")),
    intro: () => {
      ((Oe = !1),
        (Vt = { at: null, d0: A.fitGoal * 5.2, p0: new f.Vector3(18, 0, -12) }),
        (A.fit = Vt.d0),
        A.t.copy(Vt.p0));
    },
    wave: () => ac(),
    layout: (t, e, o = 3) => {
      const n = At[t],
        a = At[e];
      for (let i = 0; i < vt(); i++)
        for (let l = 0; l < gt(); l++) {
          const r = _t(l, i);
          s.cells[r] || (s.cells[r] = l % o === 1 && i % o === 1 ? a.ix : n.ix);
        }
      return (ke(), Ro(), { starved: p.starved, stations: p.stations });
    },
    fill: (t) => {
      const e = At[t];
      for (let o = 0; o < vt(); o++)
        for (let n = 0; n < gt(); n++)
          s.cells[_t(n, o)] || (s.cells[_t(n, o)] = e.ix);
      (ke(), Ro());
    },
    heat: (t) => {
      Js = !!t;
    },
    gfx: (t) => vc(t),
    coach: () => G0(),
    tags: (t) => {
      Xs = !!t;
    },
    flow: () => ({
      walkers: rt.W.length,
      pend: { ...rt.pend },
      crates: rt.crates.length,
      trucks: Qe.filter((t) => t.state !== "off").length,
    }),
    collect: () => jn("you"),
    sign: () => Gn("you"),
    staff: (t, e) => {
      (t === "crews" ? (s.staff.crews = e) : (s.staff[t] = e),
        (p.dirty = !0),
        (xe = !0),
        (Jt = !0));
    },
    away: (t) => {
      const e = fl(t);
      return (e && dc(e, t), e && { t: e.t, cut: e.cut });
    },
    sites: () =>
      s.sites.map((t) => ({
        k: t.k,
        id: Q[t.ix].id,
        left: +t.left.toFixed(1),
        T: t.T,
      })),
    trucks: () => s.trucks.map((t) => ({ ...t })),
    finishSites: () => {
      for (const t of [...s.sites]) $i(t);
      for (const t of [...s.proj]) t.left = 0;
      cl(0);
    },
    jam: (t = 1) => {
      const e = se.filter((o) => !pe[o]);
      for (let o = 0; o < t && e.length; o++) {
        const n = e.splice(Math.floor(ce() * e.length), 1)[0];
        (s.jams.push({ k: n, t: s.played }), (pe[n] = 1), s.stats.jams++);
      }
      return ((p.dirty = !0), (Ke = !0), (xe = !0), s.jams.length);
    },
    jams: () => s.jams.map((t) => t.k),
    fixAll: () => zn("you"),
    tables: () => ({
      GENS: yt,
      ITEMS: Q,
      FLOORS: pt,
      PLANTS: Po,
      RESEARCH: so,
      JOBS: Tt,
    }),
    knob: (t) => (
      t.rise != null && (cr = t.rise),
      t.jam != null && (el = t.jam),
      { rise: cr, jam: el }
    ),
  }),
  (window.__film = {
    cam(t) {
      ((Oe = !0),
        Vt && ((Vt = null), Ge(Ar, J, "", "", "", !1)),
        (ge = !1),
        (Re = 1),
        A.t.set(t.t[0], t.t[1], t.t[2]),
        A.tGoal.copy(A.t),
        (A.yaw = t.yaw),
        (A.pitch = t.pitch),
        (A.fit = A.fitGoal = t.dist));
    },
    hero() {
      const t = A.tGoal.clone(),
        e = A.fitGoal;
      Ps(!1);
      const o = {
        t: A.tGoal.toArray(),
        yaw: Lt.yaw,
        pitch: Lt.pitch,
        dist: A.fitGoal,
      };
      return (A.tGoal.copy(t), (A.fitGoal = e), o);
    },
    shots: () =>
      kh().map((t) => ({ t: t.t, yaw: t.yaw, pitch: t.pitch, dist: t.dist })),
    dump() {
      return ((s.last = Date.now()), JSON.stringify({ ...s, cells: nf() }));
    },
    load(t) {
      if (!sf(t)) return !1;
      ((s.last = Date.now()),
        (s.short = 0),
        (s.viral = 0),
        (s.seen.tourDone = 1));
      for (const e of Qe)
        ((e.state = "off"), (e.id = -1), (e.m = null), (e.g.visible = !1));
      return (
        (Ja.viral.state = "off"),
        (rt.W.length = 0),
        (rt.crates.length = 0),
        (rt.riser = null),
        kn.fill(-99),
        ze(-1),
        Vo(null),
        document.querySelectorAll("dialog[open]").forEach((e) => e.close()),
        (v("#toasts").innerHTML = ""),
        v("#banner").classList.remove("on"),
        ta(),
        (lc = -99),
        ah(),
        vr(!0),
        !0
      );
    },
    ready() {
      s.train = ro();
    },
    bot: (t) => {
      Rc = !!t;
    },
    speed: (t) => {
      oi = t;
    },
    sfx: O,
  }),
  (window.__x = {
    dof: bn,
    gtao: It,
    bloom: Zo,
    renderer: ht,
    camera: H,
    scene: Zt,
    composer: Ye,
    cam: A,
    RT: E,
    overlay: Jr,
    rays: _e,
    INST: jo,
    board: Mo,
    boardHit: Oi,
    labSign: Wn,
    RB_HI: Mn,
    RB_LO: Sn,
    RB_DYN: Bl,
    FLOW: rt,
  }),
  (window.__dbg = () => ({
    t: +z.toFixed(2),
    gen: s.gen,
    cash: Math.round(s.cash),
    rev: Math.round(p.rev),
    made: +p.made.toFixed(3),
    yr: Math.round(Pt()),
    built: s.built,
    kept: Math.floor(s.kept),
    shipped: s.shipped,
    posts: p.posts,
    crewed: p.crewed,
    gym: p.gym,
    jobs: p.jobs,
    ready: s.ready,
    line: p.lineCap,
    full: p.lineFull,
    trucks: s.trucks.length,
    loaded: s.trucks.filter((t) => t.got >= t.n).length,
    sites: s.sites.length,
    proj: s.proj.length,
    rep: +s.rep.toFixed(3),
    makes: +p.makes.toFixed(3),
    train: +(s.train / Math.max(ro(), 1e-9)).toFixed(3),
    stations: p.stations,
    cells: p.cells,
    starved: p.starved,
    brown: +p.brown.toFixed(3),
    draw: Math.round(p.draw),
    lvl: s.lvl,
    split: s.split,
    played: Math.round(s.played),
    robots: Mn.count + Sn.count + Bl.count,
    hiN: Mn.count,
    calls: ht.info.render.calls,
    tris: ht.info.render.triangles,
  })));
