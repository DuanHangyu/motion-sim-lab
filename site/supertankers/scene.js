import * as s from "three";
import { EffectComposer as ca } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as xo,
  FullScreenQuad as Ot,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as Jo } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as fa } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as ua } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as da } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as ha } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  mergeGeometries as Qo,
  mergeVertices as pa,
} from "three/addons/utils/BufferGeometryUtils.js";
const S = (e) => document.querySelector(e),
  Se = S("#world"),
  en = S("#app"),
  E = (e, t, o) => (e < t ? t : e > o ? o : e),
  Vs = (e, t, o) => e + (t - e) * o,
  tn = (e, t, o) => {
    const n = E((o - e) / (t - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  Hs = (e) => 1 - (1 - e) ** 3,
  $s = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function De(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const Ws = De(7),
  on = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  ma = "https://x.com/ryansael",
  nn = "supertankers",
  z = new s.Scene();
((z.background = new s.Color("#10151f")),
  (z.fog = new s.FogExp2("#1a2130", 0.0065)));
const b = new s.PerspectiveCamera(30, 1, 0.3, 320);
let L;
try {
  L = new s.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (S("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const va = 25e5,
  ga = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return E(Math.min(devicePixelRatio, 2, Math.sqrt(va / (e * t))), 1, 2);
  },
  It = ga();
(L.setPixelRatio(It),
  (L.info.autoReset = !1),
  (L.shadowMap.enabled = !0),
  (L.shadowMap.type = s.PCFShadowMap),
  (L.shadowMap.autoUpdate = !1),
  (L.transmissionResolutionScale = 0.6),
  (L.toneMapping = s.ACESFilmicToneMapping),
  Se.appendChild(L.domElement));
const Gt = new s.HemisphereLight(9414360, 3813414, 0.5);
z.add(Gt);
const B = new s.DirectionalLight(16763279, 2.1);
((B.castShadow = !0),
  B.shadow.mapSize.set(2048, 2048),
  Object.assign(B.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (B.shadow.normalBias = 0.03),
  (B.shadow.bias = -4e-4),
  (B.shadow.radius = 2),
  z.add(B, B.target));
const xa = new s.Vector3(0.62, 0.62, 0.48).normalize();
(B.position.copy(xa).multiplyScalar(30), B.target.position.set(0, 2, 0));
const gt = new s.DirectionalLight(9427199, 0.9);
(gt.position.set(-6, 9, -14), z.add(gt));
const Nt = new s.DirectionalLight(16773600, 0.55);
(Nt.position.set(-8, 12, 10), z.add(Nt));
const xt = new s.Group();
z.add(xt);
const Ce = 10,
  ot = {
    pos: {
      value: Array.from({ length: Ce }, () => new s.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: Ce }, () => new s.Vector3()) },
  },
  wa = `uniform vec4 uFakePos[${Ce}];uniform vec3 uFakeCol[${Ce}];uniform float uSat;`,
  ya = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${Ce};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  ba = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  an = { value: 1.16 };
function re(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: ot.pos,
        uFakeCol: ot.col,
        uSat: an,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + wa,
          )
          .replace("#include <lights_fragment_end>", ya)
          .replace("#include <opaque_fragment>", ba)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => nn + (t ? t.key : "")),
    e
  );
}
const sn = [];
function Ve(e, t, o, n, a, r) {
  const i = { p: new s.Vector3(e, t, o), c: new s.Color(n), r: a, i: r, i0: r };
  return (sn.push(i), i);
}
const Ut = new s.Vector3(),
  W = [],
  nt = new s.Vector3(0, 3, 0);
function Ma(e) {
  W.length = 0;
  for (const t of sn)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        W.length < Ce)
      )
        (W.push(t), W.length === Ce && W.sort((o, n) => o.score - n.score));
      else if (t.score > W[0].score) {
        W[0] = t;
        for (let o = 0; o < Ce - 1 && W[o].score > W[o + 1].score; o++) {
          const n = W[o];
          ((W[o] = W[o + 1]), (W[o + 1] = n));
        }
      }
    }
}
function rn(e, t) {
  Ma(t);
  for (let o = 0; o < Ce; o++) {
    const n = W[o];
    if (!n) {
      (ot.col.value[o].set(0, 0, 0), ot.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (Ut.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      ot.pos.value[o].set(Ut.x, Ut.y, Ut.z, 1 / (n.r * n.r)),
      ot.col.value[o].set(n.c.r * n.i, n.c.g * n.i, n.c.b * n.i));
  }
}
const wo = {};
{
  const e = new s.PMREMGenerator(L),
    t = new s.Scene();
  t.add(
    new s.Mesh(
      new s.SphereGeometry(50, 48, 24),
      new s.ShaderMaterial({
        side: s.BackSide,
        vertexShader:
          "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
        fragmentShader: `varying vec3 d;void main(){vec3 c=mix(vec3(.05,.045,.05),vec3(.07,.09,.14),smoothstep(-.5,.2,d.y));
   float back=smoothstep(.0,-.75,d.z);                                                    // the window wall
   vec3 sky=mix(vec3(1.1,.62,.55),vec3(.22,.3,.62),smoothstep(-.02,.45,d.y));c=mix(c,sky,back*smoothstep(-.12,0.,d.y)*.9);
   c+=vec3(1.4,.9,.5)*back*exp(-pow((d.y+.02)/.05,2.))*.8;                                 // the lit city on the horizon
   c+=vec3(2.2,1.3,.6)*smoothstep(.55,.95,-d.x)*smoothstep(-.2,.15,d.y)*(1.-smoothstep(.25,.6,d.y));   // warm lamps, left
   gl_FragColor=vec4(c,1.);}`,
      }),
    ),
  );
  const o = (n, a, r, i, f, u) => {
    const l = new s.Mesh(
      new s.BoxGeometry(n, a, 0.4),
      new s.MeshBasicMaterial({ color: new s.Color(...r) }),
    );
    (l.position.set(i, f, u), l.lookAt(0, 0, 0), t.add(l));
  };
  (o(14, 2.2, [3.2, 2.6, 2.1], -6, 18, 22),
    o(10, 2, [1.6, 2.4, 3.4], 18, 14, -10),
    o(30, 1, [3.6, 2.2, 1.1], 0, -4, -30),
    o(8, 3, [2.4, 1.7, 1.1], -28, 6, 4),
    (wo.show = e.fromScene(t, 0.03).texture),
    e.dispose());
}
((z.environment = wo.show), (z.environmentIntensity = 0.55));
const ln = 1,
  yo = new s.WebGLRenderTarget(1, 1, {
    type: s.HalfFloatType,
    generateMipmaps: !0,
    minFilter: s.LinearMipmapLinearFilter,
  }),
  wt = {
    tReflect: { value: yo.texture },
    uReflMatrix: { value: new s.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  qs = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, wt),
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
  te = new s.PerspectiveCamera(),
  Vt = new s.Vector3(0, 1, 0),
  yt = new s.Vector3(0, ln, 0),
  bo = new s.Vector3(),
  Ht = new s.Vector3(),
  Mo = new s.Matrix4(),
  bt = new s.Plane(),
  Re = new s.Vector4(),
  cn = new s.Vector4(),
  ie = [];
function Sa() {
  if (
    !g.reflect ||
    wt.uReflStrength.value <= 0 ||
    b.position.y <= ln ||
    !B.shadow.map
  )
    return;
  (bo.setFromMatrixPosition(b.matrixWorld),
    Mo.extractRotation(b.matrixWorld),
    te.position.subVectors(yt, bo).reflect(Vt).negate().add(yt),
    Ht.set(0, 0, -1).applyMatrix4(Mo).add(bo),
    Ht.subVectors(yt, Ht).reflect(Vt).negate().add(yt),
    te.up.set(0, 1, 0).applyMatrix4(Mo).reflect(Vt),
    te.lookAt(Ht),
    (te.far = b.far),
    te.updateMatrixWorld(),
    te.projectionMatrix.copy(b.projectionMatrix),
    wt.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(te.projectionMatrix)
      .multiply(te.matrixWorldInverse),
    bt
      .setFromNormalAndCoplanarPoint(Vt, yt)
      .applyMatrix4(te.matrixWorldInverse),
    Re.set(bt.normal.x, bt.normal.y, bt.normal.z, bt.constant));
  const e = te.projectionMatrix.elements;
  (cn.set(
    (Math.sign(Re.x) + e[8]) / e[0],
    (Math.sign(Re.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    Re.multiplyScalar(2 / Re.dot(cn)),
    (e[2] = Re.x),
    (e[6] = Re.y),
    (e[10] = Re.z + 1),
    (e[14] = Re.w));
  const t = ie.map((n) => n.visible),
    o = L.shadowMap.needsUpdate;
  (ie.forEach((n) => (n.visible = !1)),
    (L.shadowMap.needsUpdate = !1),
    rn(te, nt),
    L.setRenderTarget(yo),
    L.clear(),
    L.render(z, te),
    L.setRenderTarget(null),
    ie.forEach((n, a) => (n.visible = t[a])),
    (L.shadowMap.needsUpdate = o));
}
const Ca =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  $t = (e, t) =>
    new s.ShaderMaterial({
      uniforms: t,
      vertexShader: Ca,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class Ra extends xo {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new s.WebGLRenderTarget(1, 1, {
        type: s.HalfFloatType,
        samples: t,
        depthTexture: new s.DepthTexture(1, 1),
      })),
      (this.quad = new Ot(
        $t(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, n) {
    (rn(b, nt),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(z, b),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const fn = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class Ta extends xo {
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
        near: { value: b.near },
        far: { value: b.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new s.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new s.Vector2() },
        fullTexel: { value: new s.Vector2() },
      }),
      (this.pre = new Ot(
        $t(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${fn}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Ot(
        $t(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=1.05/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Ot(
        $t(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${fn}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   b.rgb=b.rgb*.4+(texture2D(tBlur,vUv+o*vec2(1.5,.6)).rgb+texture2D(tBlur,vUv-o*vec2(1.5,.6)).rgb+texture2D(tBlur,vUv+o*vec2(-.6,1.5)).rgb+texture2D(tBlur,vUv-o*vec2(-.6,1.5)).rgb)*.15;   // a soft tent over the gather: no grain in the bokeh
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
const g = {
    auto: 1,
    pixelRatio: It,
    msaa: It >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 2048,
    exposure: 1,
    fov: 30,
    sun: 1,
    fill: 1,
    rim: 1,
    fog: 1,
    sat: 1.42,
    env: 1,
    reflect: 1,
    bloom: 1,
    bloomStrength: 1,
    bloomRadius: 0.42,
    bloomThreshold: 1,
    ao: 1,
    aoIntensity: 1,
    aoRadius: 0.9,
    aoSamples: 12,
    dof: 1,
    focalBand: 1,
    aperture: 0.32,
    apertureNear: 0.9,
    maxCoc: 4.5,
  },
  So = { ...g },
  oe = new ca(
    L,
    new s.WebGLRenderTarget(1, 1, { type: s.HalfFloatType, depthBuffer: !1 }),
  );
oe.setPixelRatio(It);
const Mt = new Ra(g.msaa);
oe.addPass(Mt);
const F = new Jo(z, b, 1, 1);
((F.output = Jo.OUTPUT.Off),
  (F.needsSwap = !1),
  F.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  F.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const La = F.setSize.bind(F),
  ka = F.render.bind(F);
F.setSize = (e, t) => La(Math.ceil(e / 2), Math.ceil(t / 2));
const at = [],
  un = [];
((F.render = (e, t, o) => {
  (at.forEach((n, a) => {
    ((un[a] = n.visible), (n.visible = !1));
  }),
    ka(e, t, o),
    at.forEach((n, a) => (n.visible = un[a])),
    (F.blendMaterial.uniforms.intensity.value = g.ao ? g.aoIntensity : 0),
    (F.blendMaterial.uniforms.tDiffuse.value = F.pdRenderTarget.texture),
    F._renderPass(e, F.blendMaterial, o));
}),
  oe.addPass(F));
const Te = new fa(new s.Vector2(256, 256), 0.42, 0.55, 1.05),
  _a = Te.setSize.bind(Te);
((Te.setSize = (e, t) => _a(Math.ceil(e / 2), Math.ceil(t / 2))),
  oe.addPass(Te));
const ne = new Ta();
((ne.u.tDepth.value = Mt.rt.depthTexture), oe.addPass(ne));
const Wt = new s.Scene(),
  dn = {
    tSceneDepth: { value: F.depthTexture },
    uRes: { value: new s.Vector2(1, 1) },
    uNF: { value: new s.Vector2(b.near, b.far) },
  };
class Aa extends xo {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, n) {
    const a = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(n),
      t.render(Wt, b),
      (t.autoClear = a));
  }
}
(oe.addPass(new Aa()), oe.addPass(new ua()));
const hn = new da();
oe.addPass(hn);
const Ea = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  Ba = (e, t, o, n = 0.06, a = 2) =>
    new ha(e, t, o, a, Math.min(n, Math.min(e, t, o) / 2.02)),
  Le = new Map();
function _(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    Le.has(o) ||
      Le.set(
        o,
        re(
          new s.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    Le.get(o)
  );
}
function Pa(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    Le.has(o) ||
      Le.set(
        o,
        re(
          new s.MeshPhysicalMaterial({
            color: e,
            roughness: 0.34,
            clearcoat: 1,
            clearcoatRoughness: 0.16,
            envMapIntensity: 1.1,
            ...t,
          }),
        ),
      ),
    Le.get(o)
  );
}
function G(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    Le.has(o) ||
      Le.set(
        o,
        re(
          new s.MeshPhysicalMaterial({
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
    Le.get(o)
  );
}
const He = (e, t = 1) =>
    new s.MeshBasicMaterial({
      color: new s.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  js = (e = {}) =>
    new s.MeshPhysicalMaterial({
      color: "#e6fbff",
      roughness: 0.05,
      metalness: 0,
      transmission: 0.95,
      thickness: 0.12,
      ior: 1.45,
      envMapIntensity: 1.3,
      ...e,
    }),
  Ys = G("#434a55", { roughness: 0.36 }),
  Ks = G("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Xs = G("#15171b", { roughness: 0.46, metalness: 0.55 }),
  Zs = G("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  Js = G("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  Qs = _("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  er = G("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  tr = G("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  Fa = new s.Matrix4(),
  qt = new s.Quaternion(),
  pn = new s.Euler(0, 0, 0, "YXZ"),
  mn = new s.Vector3(1, 1, 1),
  or = new s.Color(),
  nr = new s.Vector3(1, 0, 0),
  vn = new s.Vector3(0, 1, 0),
  ar = new s.Vector3(0, 0, 1),
  Da = new s.Vector3(),
  za = new s.Quaternion();
function K() {
  const e = new Map(),
    t = (o, n, a, r, i, f) => {
      n = n.index ? n.toNonIndexed() : n;
      for (const l of Object.keys(n.attributes))
        ["position", "normal", "uv"].includes(l) || n.deleteAttribute(l);
      (n.attributes.uv ||
        n.setAttribute(
          "uv",
          new s.Float32BufferAttribute(
            new Float32Array(n.attributes.position.count * 2),
            2,
          ),
        ),
        f.dir
          ? (qt.setFromUnitVectors(
              vn,
              Da.set(f.dir[0], f.dir[1], f.dir[2]).normalize(),
            ),
            f.roll && qt.multiply(za.setFromAxisAngle(vn, f.roll)))
          : (pn.set(f.rx || 0, f.ry || 0, f.rz || 0), qt.setFromEuler(pn)),
        n.applyMatrix4(
          Fa.compose(
            { x: a, y: r, z: i },
            qt,
            f.s ? mn.set(f.s[0], f.s[1], f.s[2]) : mn.set(1, 1, 1),
          ),
        ));
      let u = e.get(o);
      (u || e.set(o, (u = { mat: o, list: [] })), u.list.push(n));
    };
  return {
    box(o, n, a, r, i, f, u, l = {}) {
      return (
        t(o, l.r ? Ba(i, f, u, l.r) : new s.BoxGeometry(i, f, u), n, a, r, l),
        this
      );
    },
    cyl(o, n, a, r, i, f, u, l = {}) {
      return (
        t(o, new s.CylinderGeometry(i, f, u, l.seg || 20), n, a, r, l),
        this
      );
    },
    cone(o, n, a, r, i, f, u = {}) {
      return (
        t(
          o,
          new s.ConeGeometry(i, f, u.seg || 6).translate(0, f / 2, 0),
          n,
          a,
          r,
          u,
        ),
        this
      );
    },
    sph(o, n, a, r, i, f = {}) {
      return (
        t(o, new s.SphereGeometry(i, f.seg || 14, f.seg2 || 10), n, a, r, f),
        this
      );
    },
    tor(o, n, a, r, i, f, u = {}) {
      return (
        t(o, new s.TorusGeometry(i, f, u.seg2 || 8, u.seg || 40), n, a, r, u),
        this
      );
    },
    geo(o, n, a = 0, r = 0, i = 0, f = {}) {
      return (t(o, n.clone(), a, r, i, f), this);
    },
    flush(o, n = !0) {
      const a = [];
      for (const { mat: r, list: i } of e.values()) {
        const f = new s.Mesh(Qo(i), r);
        ((f.castShadow = n),
          (f.receiveShadow = !0),
          o.add(f),
          a.push(f),
          i.forEach((u) => u.dispose()));
      }
      return (e.clear(), a);
    },
  };
}
const jt = [];
document.fonts?.ready.then(() => jt.forEach((e) => e()));
function gn(e, t, o, n, a, r = 0.9, i = {}) {
  const f = document.createElement("canvas");
  ((f.width = o), (f.height = n));
  const u = f.getContext("2d"),
    l = new s.CanvasTexture(f);
  ((l.anisotropy = 8), (l.colorSpace = s.SRGBColorSpace));
  const c = new s.Mesh(
    new s.PlaneGeometry(e, t),
    new s.MeshBasicMaterial({
      map: l,
      alphaTest: 0.3,
      fog: !1,
      side: s.DoubleSide,
      color: new s.Color(r, r, r),
      ...i,
    }),
  );
  return (
    (c.userData = {
      c: f,
      g: u,
      t: l,
      redraw(d) {
        (u.clearRect(0, 0, o, n), d(u, o, n), (l.needsUpdate = !0));
      },
    }),
    a && (c.userData.redraw(a), jt.push(() => c.userData.redraw(a))),
    c
  );
}
const Oa = (e, t, o, n, a, r) => {
    (e.beginPath(), e.roundRect(t, o, n, a, r));
  },
  St = (e, t, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), o(a.getContext("2d"), e, t));
    const r = new s.CanvasTexture(a);
    return (n && (r.colorSpace = s.SRGBColorSpace), (r.anisotropy = 8), r);
  },
  xn = St(
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
  sr = (e, t, o = xn) =>
    new s.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: s.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function Ia(e, t = 0.3, o = 1, n = 0) {
  const a = new s.IcosahedronGeometry(e, n),
    r = a.attributes.position,
    i = De(o),
    f = new Map();
  for (let u = 0; u < r.count; u++) {
    const l =
      r.getX(u).toFixed(3) +
      "," +
      r.getY(u).toFixed(3) +
      "," +
      r.getZ(u).toFixed(3);
    f.has(l) ||
      f.set(l, [1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t]);
    const c = f.get(l);
    r.setXYZ(u, r.getX(u) * c[0], r.getY(u) * c[1], r.getZ(u) * c[2]);
  }
  return (a.computeVertexNormals(), a);
}
function rr(e, t, o, n, a, r = 0, i = {}) {
  const f = new s.Group(),
    u = K(),
    l = De(Math.floor(t * 31 + n * 17 + 99));
  u.cyl(_("#5a3f2c"), 0, 0.5 * a, 0, 0.07 * a, 0.1 * a, 1 * a, { seg: 6 });
  const c = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((d) =>
    new s.Color(d).offsetHSL(r, 0, 0).getStyle(),
  );
  for (let d = 0; d < (i.n || 5); d++)
    u.geo(
      _(c[d % 4], { flatShading: !0, roughness: 0.8 }),
      Ia(0.42 * a * (0.75 + l() * 0.5), 0.3, d + t * 7 + n * 3),
      (l() - 0.5) * 0.6 * a,
      (1.15 + l() * 0.7) * a,
      (l() - 0.5) * 0.6 * a,
    );
  return (u.flush(f), f.position.set(t, o, n), e.add(f), f);
}
const Ga = St(
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
function ir(e, t, o, n, a, r, i = 0.5) {
  const f = new s.Mesh(
    new s.PlaneGeometry(a, r),
    new s.MeshBasicMaterial({
      map: Ga,
      transparent: !0,
      opacity: i,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (f.rotation.x = -Math.PI / 2),
    f.position.set(t, o + 0.004, n),
    (f.renderOrder = -1),
    e.add(f),
    at.push(f),
    f
  );
}
class Na {
  constructor(t) {
    this.max = t;
    const o = new s.BufferGeometry();
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
      new s.BufferAttribute(this.pos, 3).setUsage(s.DynamicDrawUsage),
    ),
      o.setAttribute(
        "aSide",
        new s.BufferAttribute(this.side, 1).setUsage(s.DynamicDrawUsage),
      ),
      o.setAttribute(
        "aCol",
        new s.BufferAttribute(this.col, 4).setUsage(s.DynamicDrawUsage),
      ),
      o.setIndex(new s.BufferAttribute(n, 1)),
      (this.mesh = new s.Mesh(
        o,
        new s.ShaderMaterial({
          uniforms: {
            ...dn,
            uSoft: { value: 0.35 },
            uLight: { value: 0 },
            uLightK: { value: 0.62 },
          },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: s.AdditiveBlending,
          side: s.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${Ea}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Wt.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? s.NormalBlending : s.AdditiveBlending));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, n, a, r, i, f) {
    if (this.n >= this.max) return;
    const u = this.n++;
    (wn.subVectors(o, t),
      yn.addVectors(t, o).multiplyScalar(0.5),
      bn.subVectors(b.position, yn),
      X.crossVectors(wn, bn).normalize());
    const l = this.pos,
      c = u * 12;
    ((l[c] = t.x - X.x * n),
      (l[c + 1] = t.y - X.y * n),
      (l[c + 2] = t.z - X.z * n),
      (l[c + 3] = t.x + X.x * n),
      (l[c + 4] = t.y + X.y * n),
      (l[c + 5] = t.z + X.z * n),
      (l[c + 6] = o.x - X.x * a),
      (l[c + 7] = o.y - X.y * a),
      (l[c + 8] = o.z - X.z * a),
      (l[c + 9] = o.x + X.x * a),
      (l[c + 10] = o.y + X.y * a),
      (l[c + 11] = o.z + X.z * a),
      this.side.set([-1, 1, -1, 1], u * 4));
    const d = this.col,
      h = u * 16;
    for (let p = 0; p < 4; p++)
      ((d[h + p * 4] = r.r),
        (d[h + p * 4 + 1] = r.g),
        (d[h + p * 4 + 2] = r.b),
        (d[h + p * 4 + 3] = p < 2 ? i : f));
  }
  line(t, o, n, a) {
    for (let r = 0; r < t.length - 1; r++) {
      const i = r / (t.length - 1),
        f = (r + 1) / (t.length - 1);
      this.seg(
        t[r],
        t[r + 1],
        Ro(t[r], o),
        Ro(t[r + 1], o),
        n,
        a ? a(i) : 1,
        a ? a(f) : 1,
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
const wn = new s.Vector3(),
  yn = new s.Vector3(),
  bn = new s.Vector3(),
  X = new s.Vector3(),
  Co = new Na(6e3),
  Ro = (e, t) =>
    ((b.position.distanceTo(e) *
      Math.tan(s.MathUtils.degToRad(b.fov / 2)) *
      2) /
      Math.max(Se.clientHeight, 1)) *
    t *
    0.5,
  me = JSON.parse(S("#supertankers-data").textContent || "{}"),
  Yt = (me.apps || []).filter((e) => e.r > 0),
  Ua = 2e3,
  Ct = (e) =>
    String(e).replace(/[&<>"']/g, (t) => "&#" + t.charCodeAt(0) + ";"),
  P = (e) => e.t / e.r,
  Rt = (e) => Math.max(1, Math.ceil(P(e) / Ua)),
  Tt = (e) =>
    e >= 1e9
      ? (e / 1e9).toFixed(1) + "B"
      : e >= 1e6
        ? (e / 1e6).toFixed(e >= 1e8 ? 0 : 1) + "M"
        : e >= 1e3
          ? (e / 1e3).toFixed(e >= 1e5 ? 0 : 1) + "K"
          : String(Math.round(e)),
  Va = (e) =>
    e >= 1e12 ? (e / 1e12).toFixed(1) + "T" : (e / 1e9).toFixed(0) + "B",
  st = (e) =>
    e >= 1e5 ? Math.round(e / 1e3) + "K" : (e / 1e3).toFixed(1) + "K",
  Mn = (e) =>
    e == null
      ? "\u2013"
      : e >= 0.01
        ? "$" + e.toFixed(2)
        : e >= 0.001
          ? "$" + e.toFixed(3)
          : "$" + e.toFixed(4),
  Kt = (e) =>
    new Date(e + "T12:00:00Z").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
  Ha = (e) => {
    const t = e.toLowerCase();
    for (const o in me.harbour || {})
      if ((me.harbour[o].name || "").toLowerCase() === t) return o;
    return null;
  },
  Lt = Yt.filter((e) => e.r >= 1e6),
  $e =
    Lt.filter((e) => e.cats.includes("roleplay")).sort(
      (e, t) => t.r - e.r,
    )[0] || Lt[Lt.length - 1],
  We =
    Lt.filter(
      (e) =>
        e !== $e &&
        !e.cats.includes("roleplay") &&
        !e.cats.includes("entertainment") &&
        Math.abs(Math.log(e.r / $e.r)) < Math.log(1.6),
    ).sort((e, t) => P(t) - P(e))[0] || Lt[0];
function Xt() {
  const e = Yt.filter((n) => n.cats.includes("coding") && n !== We && n !== $e)
      .sort((n, a) => a.t - n.t)
      .slice(0, 4),
    t = new Set([$e, We, ...e]),
    o = Yt.filter((n) => n.r >= 3e5 && !t.has(n)).sort(
      (n, a) => P(a) - P(n),
    )[0];
  return [$e, We, ...e, o].filter(Boolean).slice(0, 7);
}
function To(e) {
  return Yt.filter((t) => t.cats.includes(e))
    .sort((t, o) => o.t - t.t)
    .slice(0, 7);
}
function Sn(e) {
  if (e.includes($e) && e.includes(We)) return [$e, We];
  let t = null;
  for (const n of e)
    for (const a of e) {
      if (P(a) <= P(n) || Math.abs(Math.log(n.r / a.r)) > Math.log(1.8))
        continue;
      const i = P(a) / P(n);
      (!t || i > t.k) && (t = { a: n, b: a, k: i });
    }
  if (t) return [t.a, t.b];
  const o = [...e].sort((n, a) => P(n) - P(a));
  return [o[0], o[o.length - 1]];
}
const O = 1,
  ve = 1.16,
  I = 1.2,
  R = 9.4,
  M = -4,
  Z = 4.5,
  rt = 7,
  it = (R * 2) / rt,
  ze = 2.3,
  ke = 0.26,
  qe = 0.11,
  ge = 0.112,
  xe = (e) => -R + (e + 0.5) * it,
  we = new s.Group();
xt.add(we);
const lt = -15.5,
  J = -7.2;
{
  const e = K(),
    t = G("#1b1a1c", { roughness: 0.45, metalness: 0.6 });
  for (let n = -44; n <= 44; n += 6.2) e.box(t, n, 8, lt, 0.24, 40, 0.3);
  (e
    .box(t, 0, -0.2, lt + 0.1, 100, 0.3, 0.5)
    .box(t, 0, 22, lt, 100, 0.5, 0.4)
    .box(
      _("#0d0f14", { roughness: 0.6 }),
      0,
      (J - 0.35) / 2,
      lt + 0.4,
      100,
      -0.35 - J,
      0.3,
    ),
    e.flush(we, !1));
  const o = new s.Mesh(new s.BoxGeometry(100, 0.03, 0.03), He("#ffb36a", 1.1));
  (o.position.set(0, 0, lt + 0.42), we.add(o));
}
function $a(e = {}) {
  return St(4096, 1024, (t, o, n) => {
    const a = De(e.seed || 11),
      r = n * (e.horizon || 0.7),
      i = t.createLinearGradient(0, 0, 0, r);
    (i.addColorStop(0, "#0a1532"),
      i.addColorStop(0.45, "#1d3a78"),
      i.addColorStop(0.7, "#4c62a2"),
      i.addColorStop(0.83, "#c47c84"),
      i.addColorStop(0.93, "#f39c68"),
      i.addColorStop(1, "#ffc078"),
      (t.fillStyle = i),
      t.fillRect(0, 0, o, r + 2));
    for (let c = 0; c < 30; c++) {
      const d = a() * o,
        h = r * (0.3 + a() * 0.5),
        p = 220 + a() * 640,
        m = t.createRadialGradient(d, h, 0, d, h, p);
      (m.addColorStop(
        0,
        `rgba(${a() > 0.5 ? "255,180,170" : "160,150,220"},.09)`,
      ),
        m.addColorStop(1, "rgba(0,0,0,0)"),
        (t.fillStyle = m),
        t.save(),
        t.scale(1, 0.22),
        t.fillRect(d - p, h / 0.22 - p, p * 2, p * 2),
        t.restore());
    }
    if (e.mountains) {
      const c = (d, h, p, m, x, v) => {
        ((t.fillStyle = p), t.beginPath(), t.moveTo(0, r));
        for (let w = 0; w <= o; w += 16) {
          const y = w / o;
          t.lineTo(
            w,
            r -
              n *
                (h +
                  d * Math.abs(Math.sin(y * m + v)) +
                  d * 0.35 * Math.sin(y * x + v * 2)),
          );
        }
        (t.lineTo(o, r), t.fill());
      };
      (c(0.1, 0.05, "#353a6c", 4.2, 17, 1),
        c(0.07, 0.03, "#232650", 6.3, 23, 2.4));
    }
    const f = ["#ffd9a0", "#ffe9c8", "#ffc070", "#ffcf90", "#cfe6ff"],
      u = (c, d, h, p, m, x = 3, v = 3.5, w = 6, y = 7) => {
        if (((t.fillStyle = p), t.fillRect(c, r - h, d, h), !!m)) {
          for (let T = r - h + 4; T < r - 2; T += y)
            for (let D = c + 2; D < c + d - x; D += w)
              a() < m &&
                ((t.fillStyle = f[Math.floor(a() * f.length)]),
                (t.globalAlpha = 0.5 + a() * 0.5),
                t.fillRect(D, T, x, v));
          t.globalAlpha = 1;
        }
      };
    for (let c = 0; c < o;) {
      const d = 14 + a() * 40,
        h = n * (0.02 + a() * 0.06) * (e.low || 1);
      (u(c, d, h, "#56598c", 0.16, 2, 2.5, 5, 6), (c += d + a() * 5));
    }
    for (let c = 0; c < o;) {
      const d = Math.abs(Math.sin((c / o) * 7.3 + 0.4)),
        h = 24 + a() * 62,
        p = n * (0.04 + a() * 0.12 + d * d * 0.3 * a()) * (e.low || 1);
      (u(
        c,
        h,
        p,
        `hsl(${226 + a() * 16},${28 + a() * 14}%,${13 + a() * 8}%)`,
        0.42 + a() * 0.35,
      ),
        p > n * 0.2 &&
          a() < 0.6 &&
          ((t.fillStyle = "#ffe2b0"),
          (t.globalAlpha = 0.85),
          t.fillRect(c + 3, r - p + 2, h - 6, 3),
          (t.globalAlpha = 1)),
        p > n * 0.26 &&
          a() < 0.5 &&
          ((t.fillStyle = "#ff6a5a"),
          t.fillRect(c + h / 2 - 2, r - p - 9, 4, 4)),
        (c += h + a() * 8));
    }
    const l = t.createLinearGradient(0, r, 0, n);
    (l.addColorStop(0, "#3a4268"),
      l.addColorStop(0.25, "#16203a"),
      l.addColorStop(1, "#060a14"),
      (t.fillStyle = l),
      t.fillRect(0, r, o, n - r));
    for (let c = 0; c < 1600; c++) {
      const d = a() * o,
        h = r + 3 + a() ** 1.5 * (n - r) * 0.75,
        p = 8 + a() * 60;
      ((t.fillStyle =
        [
          "rgba(255,200,140,",
          "rgba(255,232,200,",
          "rgba(170,210,255,",
          "rgba(255,170,110,",
        ][c % 4] +
        (0.1 + a() * 0.32) +
        ")"),
        t.fillRect(d, h, 1.5 + a() * 3, p * 0.3));
    }
  });
}
const Wa = $a({ seed: 23, mountains: !0, low: 0.8 }),
  Cn = -118;
{
  const e = new s.Mesh(
    new s.PlaneGeometry(320, 80),
    new s.MeshBasicMaterial({
      map: Wa,
      fog: !1,
      color: new s.Color(0.95, 0.95, 0.95),
    }),
  );
  (e.position.set(0, 3, Cn), we.add(e));
}
const lr = (() => {
  const t = new s.PlaneGeometry(1, 1),
    o = new s.MeshBasicMaterial({
      map: xn,
      transparent: !0,
      blending: s.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    }),
    n = new s.InstancedMesh(t, o, 520),
    a = De(77),
    r = new s.Matrix4(),
    i = new s.Color(),
    f = [
      [1, 0.72, 0.42],
      [1, 0.86, 0.66],
      [0.62, 0.8, 1],
      [1, 0.6, 0.35],
      [1, 0.95, 0.85],
    ];
  for (let u = 0; u < 520; u++) {
    const l = (a() - 0.5) * 300,
      c = Math.abs(Math.sin((l / 300 + 0.5) * 7.3 + 0.4)),
      d = u % 8 === 0,
      h = d ? -4.5 - a() * 5 : -3.4 + a() ** 1.8 * (9 + c * c * 16),
      p = (0.45 + a() * 1.1) * (d ? 0.8 : 1);
    (r.makeScale(p, p, p),
      r.setPosition(l, h - 9, Cn + 2 + a() * 6),
      n.setMatrixAt(u, r));
    const m = f[Math.floor(a() * f.length)],
      x = (1.6 + a() * 2.6) * (d ? 0.55 : 1);
    n.setColorAt(u, i.setRGB(m[0] * x, m[1] * x, m[2] * x));
  }
  return ((n.frustumCulled = !1), we.add(n), at.push(n), n);
})();
{
  const e = K(),
    t = _("#2b2018", { roughness: 0.6 });
  (e.box(_("#1a1716", { roughness: 0.7 }), -27, 8, -4, 0.4, 36, 44),
    e.box(t, -25.6, 3.6, -9, 2.4, 0.12, 5).box(t, -25.6, 6.2, -9, 2.4, 0.12, 5),
    e.flush(we));
  const o = new s.Mesh(new s.BoxGeometry(0.2, 2.2, 0.9), He("#ffbf7a", 3.2));
  (o.position.set(-26.7, 7.5, 2), we.add(o), Ve(-25, 7, 2, "#ffbf7a", 7, 0.8));
}
const Rn = (e, t, o = 3, n = 1024, a = 512) =>
  St(n, a, (r, i, f) => {
    ((r.fillStyle = e), r.fillRect(0, 0, i, f));
    const u = De(o);
    for (let l = 0; l < 260; l++) {
      const c = u() * f,
        d = 0.03 + u() * 0.07;
      ((r.strokeStyle = `rgba(${t},${d})`),
        (r.lineWidth = 0.6 + u() * 2.4),
        r.beginPath(),
        r.moveTo(0, c));
      for (let h = 0; h <= i; h += 32)
        r.lineTo(
          h,
          c +
            Math.sin(h * 0.004 + l) * 6 * u() +
            Math.sin(h * 0.02 + l * 3) * 1.5,
        );
      r.stroke();
    }
    for (let l = 0; l < 14; l++) {
      const c = u() * i,
        d = u() * f,
        h = r.createRadialGradient(c, d, 0, c, d, 30 + u() * 50);
      (h.addColorStop(0, `rgba(${t},.12)`),
        h.addColorStop(1, `rgba(${t},0)`),
        (r.fillStyle = h),
        r.fillRect(c - 90, d - 90, 180, 180));
    }
  });
{
  const e = Rn("#20160f", "6,3,1", 17, 1024, 1024);
  ((e.wrapS = e.wrapT = s.RepeatWrapping), e.repeat.set(10, 10));
  const t = re(
      new s.MeshPhysicalMaterial({
        map: e,
        color: "#9a8070",
        roughness: 0.38,
        clearcoat: 0.5,
        clearcoatRoughness: 0.16,
        envMapIntensity: 0.18,
      }),
    ),
    o = new s.Mesh(new s.PlaneGeometry(240, 80), t);
  ((o.rotation.x = -Math.PI / 2),
    o.position.set(0, J, lt + 40),
    (o.receiveShadow = !0),
    we.add(o),
    ie.push(o));
  const n = new s.Mesh(
    new s.PlaneGeometry(44, 30),
    _("#2a2523", { roughness: 0.95, envMapIntensity: 0.1 }),
  );
  ((n.rotation.x = -Math.PI / 2),
    n.position.set(-2, J + 0.02, 4),
    we.add(n),
    ie.push(n),
    Ve(-10, J + 3, 14, "#ffb878", 16, 0.5),
    Ve(9, J + 3, 16, "#ffc890", 14, 0.35));
}
const Tn = [];
{
  const e = new s.Group(),
    t = K(),
    o = -10.5,
    n = 12.65,
    a = 5.12,
    r = -10.33,
    i = 12.94,
    f = -10.62,
    u = 12.3,
    l = re(
      new s.MeshPhysicalMaterial({
        map: Rn("#3a281c", "14,8,4", 31),
        color: "#b08a6c",
        roughness: 0.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.4,
      }),
    );
  (t
    .box(l, o, (J + a) / 2, n, 1.5, a - J, 1.5, { r: 0.04 })
    .box(
      G("#b08a52", { roughness: 0.3, metalness: 1 }),
      o,
      a + 0.015,
      n,
      1.54,
      0.03,
      1.54,
    ),
    t
      .cyl(G("#a07a44", { roughness: 0.28 }), r, a + 0.05, i, 0.2, 0.24, 0.1, {
        seg: 24,
      })
      .cyl(
        G("#a07a44", { roughness: 0.28 }),
        r,
        a + 0.34,
        i,
        0.028,
        0.028,
        0.6,
        { seg: 8 },
      ),
    t
      .cyl(_("#d9d0c2", { roughness: 0.6 }), f, a + 0.25, u, 0.34, 0.26, 0.5, {
        seg: 24,
      })
      .cyl(_("#2a2018", { roughness: 0.9 }), f, a + 0.49, u, 0.31, 0.31, 0.03, {
        seg: 24,
      }));
  const c = De(808),
    d = _("#3c4a2a", { roughness: 0.7 }),
    h = [
      _("#2e4a28", { roughness: 0.45, envMapIntensity: 0.6 }),
      _("#3a5a2e", { roughness: 0.45, envMapIntensity: 0.6 }),
      _("#25401f", { roughness: 0.5, envMapIntensity: 0.6 }),
    ],
    p = new s.SphereGeometry(1, 12, 6),
    m = a + 0.5;
  for (let T = 0; T < 34; T++) {
    const D = 0.1 + Math.pow(c(), 0.75) * 0.85,
      U = c() * Math.PI * 2,
      Y = (0.25 + c() * 0.7) * Math.min(0.7, 0.2 + D * 0.45),
      Fe = f + Math.cos(U) * Y,
      Ne = u + Math.sin(U) * Y,
      Ue = m + D,
      Dt = Fe - f,
      zt = Ne - u;
    t.box(
      d,
      (f + Fe) / 2,
      (m + Ue) / 2,
      (u + Ne) / 2,
      0.018,
      Math.hypot(Dt, Ue - m, zt),
      0.018,
      { dir: [Dt, Ue - m, zt] },
    );
    const ee = 0.2 + c() * 0.16;
    t.geo(
      h[T % 3],
      p,
      Fe + Math.cos(U) * ee * 0.55,
      Ue - 0.04,
      Ne + Math.sin(U) * ee * 0.55,
      {
        s: [ee * 0.42, 0.02, ee],
        ry: -U + Math.PI / 2,
        rx: 0.3 + c() * 0.45,
        rz: (c() - 0.5) * 0.6,
      },
    );
  }
  const x = t.flush(e),
    v = new s.Mesh(
      new s.CylinderGeometry(0.26, 0.3, 0.36, 32, 1, !0),
      new s.MeshBasicMaterial({
        color: new s.Color(1.75, 0.98, 0.4),
        side: s.DoubleSide,
        fog: !1,
      }),
    );
  (v.position.set(r, a + 0.78, i), e.add(v));
  const w = new s.Mesh(
    new s.CircleGeometry(0.29, 28),
    new s.MeshBasicMaterial({ color: new s.Color(2.3, 1.35, 0.6), fog: !1 }),
  );
  ((w.rotation.x = Math.PI / 2),
    w.position.set(r, a + 0.61, i),
    e.add(w),
    we.add(e),
    ie.push(e));
  const y = Ve(r, a + 0.68, i, "#ffb070", 4.5, 1.1);
  Tn.push({
    g: e,
    c: new s.Vector3(o, a, n),
    r: 2.6,
    lights: [y],
    mats: [...x.map((T) => T.material), v.material, w.material],
  });
}
function qa() {
  for (const e of Tn) {
    const t = b.position.distanceTo(e.c),
      o = E((t - e.r) / 2.5, 0, 1);
    e.g.visible = o > 0.02;
    for (const n of e.lights) n.i = n.i0 * o;
    for (const n of e.mats)
      (o < 1 && !n.transparent && ((n.transparent = !0), (n.needsUpdate = !0)),
        (n.opacity = o));
  }
}
const je = new s.Group();
xt.add(je);
const kt = Pa("#0a0b0e", {
  roughness: 0.22,
  clearcoat: 1,
  clearcoatRoughness: 0.12,
  envMapIntensity: 0.8,
});
{
  const e = K(),
    t = G("#8f8a80", { roughness: 0.3, metalness: 0.9 });
  (e
    .box(kt, 0, ve - 1.6, Z + 0.45, R * 2 + 1.6, 3.2, 0.9)
    .box(kt, -R - 0.45, ve - 1.6, -3.05, 0.9, 3.2, 15.9)
    .box(kt, R + 0.45, ve - 1.6, -3.05, 0.9, 3.2, 15.9),
    e
      .box(t, 0, ve + 0.004, Z + 0.02, R * 2 + 0.4, 0.012, 0.05)
      .box(t, -R - 0.02, ve + 0.004, -2.2, 0.05, 0.012, 14)
      .box(t, R + 0.02, ve + 0.004, -2.2, 0.05, 0.012, 14),
    e.box(
      _("#06171d", { roughness: 0.6 }),
      0,
      O - 0.3,
      (M + Z) / 2,
      R * 2,
      0.1,
      Z - M,
    ),
    e.flush(je));
  const o = new s.Mesh(
    new s.BoxGeometry(R * 2 + 0.3, 0.008, 0.008),
    He("#9fe0ff", 0.9),
  );
  (o.position.set(0, ve + 0.01, Z - 0.02), je.add(o), at.push(o), ie.push(o));
  const n = K(),
    a = ve - 3.2,
    r = a - J - 0.5;
  (n.box(kt, 0, a - r / 2, -3.05 + 0.3, R * 2 + 1.2, r, 15.9),
    n.box(
      _("#050506", { roughness: 0.7 }),
      0,
      J + 0.25,
      -3.05 + 0.1,
      R * 2 + 0.6,
      0.5,
      15.3,
    ),
    n.flush(je));
  const i = new s.Mesh(
    new s.BoxGeometry(R * 2 + 0.5, 0.04, 0.04),
    He("#ffb26a", 2),
  );
  (i.position.set(0, J + 0.46, Z + 0.62),
    je.add(i),
    ie.push(i),
    Ve(-5, J + 1.2, Z + 2, "#ffb070", 6, 0.7),
    Ve(5, J + 1.2, Z + 2, "#ffb070", 6, 0.7));
}
const Ln = { uTime: { value: 0 } },
  ja = re(
    new s.MeshStandardMaterial({
      color: "#021016",
      roughness: 0.3,
      metalness: 0,
      emissive: "#0a4656",
      emissiveIntensity: 1,
      envMapIntensity: 0.24,
    }),
    Object.assign(
      (e) => {
        (Object.assign(e.uniforms, wt, Ln),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
uniform mat4 uReflMatrix;varying vec4 vReflCoord;varying vec3 vWPw;`,
            )
            .replace(
              "#include <project_vertex>",
              `#include <project_vertex>
{vec4 wp=modelMatrix*vec4(transformed,1.);vReflCoord=uReflMatrix*wp;vWPw=wp.xyz;}`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
uniform sampler2D tReflect;uniform float uReflStrength;uniform float uTime;varying vec4 vReflCoord;varying vec3 vWPw;
float wv(vec2 p){return sin(dot(p,vec2(.8,.6))*9.+uTime*1.3)*.42+sin(dot(p,vec2(-.5,.86))*13.+uTime*1.7)*.28+sin(dot(p,vec2(.2,-.98))*27.+uTime*2.6)*.16+sin(dot(p,vec2(.95,.31))*53.-uTime*3.4)*.09;}
float caus(vec2 p){vec2 q=p*5.4;float a=sin(q.x+sin(q.y*1.3+uTime*.6)*1.4)*sin(q.y*1.1+sin(q.x*.9-uTime*.5)*1.4);return pow(max(1.-abs(a),0.),7.);}`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
{float ry=smoothstep(` +
                M.toFixed(1) +
                "," +
                Z.toFixed(1) +
                ",vWPw.z);totalEmissiveRadiance*=(.62+.75*ry)*(.88+.12*wv(vWPw.xz*.6));totalEmissiveRadiance+=vec3(.03,.2,.24)*caus(vWPw.xz)*(.25+.5*ry);}",
            )
            .replace(
              "outgoingLight=max(mix(",
              `{vec2 d=vec2(wv(vWPw.xz)-wv(vWPw.xz+vec2(.05,0.)),wv(vWPw.xz)-wv(vWPw.xz+vec2(0.,.05)));
   float facing=saturate(dot(normal,normalize(vViewPosition)));vec2 uv=vReflCoord.xy/max(vReflCoord.w,1e-4)+vec2(d.x*.006,d.y*.03);
   vec3 mir=texture2D(tReflect,uv,.8).rgb*.34+texture2D(tReflect,uv+vec2(0.,.011),1.).rgb*.26+texture2D(tReflect,uv-vec2(0.,.011),1.).rgb*.22+texture2D(tReflect,uv+vec2(0.,.026),1.4).rgb*.18;   // smeared up and down: streaks of lamplight
   outgoingLight+=mir*uReflStrength*(.4+.6*pow(max(1.-facing,0.),2.));}
  outgoingLight=max(mix(`,
            )));
      },
      { key: "water" },
    ),
  ),
  _t = new s.Mesh(new s.PlaneGeometry(R * 2, Z - M, 1, 1), ja);
((_t.rotation.x = -Math.PI / 2),
  _t.position.set(0, O, (M + Z) / 2),
  (_t.receiveShadow = !0),
  je.add(_t),
  ie.push(_t));
const kn = [];
function Ya(e, t, o, n, a = 128, r = "@RYANSAEL") {
  const i = () => {
    ((e.font = `600 ${a}px Outfit, sans-serif`),
      (e.letterSpacing = Math.round(a * 0.12) + "px"));
  };
  i();
  const f = e.measureText(r).width;
  f > t - 28 && ((a = Math.floor((a * (t - 28)) / f)), i());
  const u = t / 2 + Math.round(a * 0.06),
    l = o / 2 + a * 0.35;
  ((e.textAlign = "center"),
    (e.textBaseline = "alphabetic"),
    (e.fillStyle = "#030303"),
    e.fillText(r, u + a * 0.02, l + a * 0.06));
  const c = e.createLinearGradient(0, l - a * 0.7, 0, l);
  (c.addColorStop(0, n ? "#ffe2a0" : "#efd6a0"),
    c.addColorStop(1, n ? "#e8a040" : "#b89058"),
    (e.fillStyle = c),
    e.fillText(r, u, l));
}
function Ka(e, t = {}) {
  const o = t.k ?? 0.7;
  let n = !1;
  const a = (i, f, u) => Ya(i, f, u, n),
    r = gn(e, e * 0.1375, 1280, 176, a, o, { alphaTest: 0.25 });
  return (
    (r.userData.mark = 1),
    ie.push(r),
    kn.push({
      hit: r,
      over(i) {
        ((n = i),
          r.material.color.setRGB(i ? 3.2 : o, i ? 2.4 : o, i ? 1.4 : o));
      },
    }),
    r
  );
}
{
  const e = Ka(2.4, { k: 0.75 });
  (e.position.set(-2.6, ve - 0.36, Z + 0.904), je.add(e));
}
const le = new s.Group();
xt.add(le);
const V = G("#262a31", { roughness: 0.5, metalness: 0.7 }),
  ct = G("#363c45", { roughness: 0.45, metalness: 0.7 }),
  Xa = _("#1e2024", { roughness: 0.78, envMapIntensity: 0.25 }),
  Lo = -10.6;
{
  const e = K();
  (e.box(Xa, 0, I - 0.7, (M + Lo) / 2, R * 2 + 1.8, 1.4, M - Lo),
    e.box(kt, 0, ve - 1.6, Lo - 0.4, R * 2 + 1.8, 3.2, 0.8),
    e.box(
      _("#4a4b50", { roughness: 0.7 }),
      0,
      I + 0.005,
      M - 0.12,
      R * 2,
      0.012,
      0.24,
    ),
    e
      .box(
        _("#c9a64a", { roughness: 0.6 }),
        0,
        I + 0.008,
        M - 0.5,
        R * 2,
        0.004,
        0.03,
      )
      .box(
        _("#c9a64a", { roughness: 0.6 }),
        0,
        I + 0.008,
        M - 1.6,
        R * 2,
        0.004,
        0.03,
      ));
  for (let n = -R + 0.5; n < R; n += 1.1)
    e.cyl(_("#1e1f22"), n, I + 0.03, M - 0.08, 0.03, 0.035, 0.06, { seg: 8 });
  for (let n = 0; n < 5; n++) {
    const a = -8 + n * 4 + (n % 2) * 0.6;
    e.box(_("#2a2d33", { roughness: 0.6 }), a, I + 0.35, -9.4, 3.2, 0.7, 1.6, {
      r: 0.02,
    });
  }
  e.flush(le);
  const t = K(),
    o = He("#ffc77a", 2.2);
  for (let n = 0; n < 5; n++) {
    const a = -8 + n * 4 + (n % 2) * 0.6;
    for (let r = 0; r < 6; r++)
      t.box(o, a - 1.25 + r * 0.5, I + 0.42, -8.59, 0.3, 0.08, 0.01);
  }
  t.flush(le, !1);
}
{
  const e = K(),
    t = [];
  for (let a = -R + 0.9; a < R; a += 2.4)
    for (const r of [M - 2.4, -7.2])
      (e.cyl(V, a, I + 0.7, r, 0.018, 0.025, 1.4, { seg: 6 }),
        t.push([a, I + 1.42, r]));
  for (let a = 1; a < rt; a++)
    for (let r = M + 0.7; r < ze; r += 1.1) t.push([-R + a * it, O + 0.32, r]);
  for (let a = -R + 0.6; a < R; a += 1.3) t.push([a, I + 0.1, M - 0.22]);
  e.flush(le);
  const o = new s.InstancedMesh(
      new s.SphereGeometry(0.05, 8, 6),
      He("#ffcf8a", 6.5),
      t.length,
    ),
    n = new s.Matrix4();
  (t.forEach(([a, r, i], f) => {
    (n.makeTranslation(a, r, i), o.setMatrixAt(f, n));
  }),
    le.add(o),
    t
      .filter((a, r) => r % 2 === 0)
      .slice(0, 14)
      .forEach(([a, r, i]) => Ve(a, r, i, "#ffc77a", 2.6, 0.75)));
}
const Zt = [
    "#3f8a86",
    "#c8873e",
    "#e2d4b4",
    "#b25a3e",
    "#7fa48a",
    "#d6a556",
    "#58799a",
    "#a8b07a",
    "#cf7a4a",
    "#8fb8b0",
  ],
  cr = (() => {
    const e = De(41),
      t = [];
    for (let r = -R + 0.3; r < R - 0.2; r += 0.62)
      for (let i = -6.2; i > -8.6; i -= 0.32) {
        if (e() < 0.18) continue;
        const f = 1 + Math.floor(e() * 4);
        for (let u = 0; u < f; u++)
          t.push([
            r + (e() - 0.5) * 0.04,
            I + ge * (u + 0.5),
            i,
            Math.floor(e() * Zt.length),
          ]);
      }
    const o = new s.InstancedMesh(
        new s.BoxGeometry(qe * 1.05, ge, ke * 1.05).rotateY(Math.PI / 2),
        _("#ffffff", { roughness: 0.6 }),
        t.length,
      ),
      n = new s.Matrix4(),
      a = new s.Color();
    return (
      t.forEach(([r, i, f, u], l) => {
        (n.makeTranslation(r, i, f),
          o.setMatrixAt(l, n),
          o.setColorAt(l, a.set(Zt[u]).multiplyScalar(0.75)));
      }),
      (o.castShadow = o.receiveShadow = !0),
      le.add(o),
      o
    );
  })(),
  ko = [];
{
  const e = K(),
    t = [],
    o = new s.Vector3(),
    n = new s.Vector3(),
    a = (u, l, c, d, h, p, m, x = 0.026) => {
      o.set(h - l, p - c, m - d);
      const v = o.length();
      e.box(u, (l + h) / 2, (c + p) / 2, (d + m) / 2, x, v, x, {
        dir: [o.x, o.y, o.z],
      });
    },
    r = (u, l, c, d, h, p, m, x) => {
      for (const y of [-h, h])
        for (const T of [c, d]) a(u, l + y, T, p, l + y, T, m, 0.034);
      const v = Math.max(1, Math.round((m - p) / x)),
        w = (m - p) / v;
      for (let y = 0; y < v; y++) {
        const T = p + y * w,
          D = T + w,
          U = y % 2 === 0;
        for (const Y of [-h, h])
          a(u, l + Y, U ? c : d, T, l + Y, U ? d : c, D, 0.018);
        (a(u, l - h, d, T, l + h, d, D, 0.014),
          a(u, l - h, c, D, l + h, c, D, 0.014));
      }
    };
  for (let u = 0; u < rt; u++) {
    const l = xe(u) + (u % 2 ? 0.2 : -0.2),
      c = M - 2,
      d = M - 0.45,
      h = 2.5,
      p = I + h;
    for (const v of [-0.42, 0.42])
      for (const w of [c, d]) e.box(V, l + v, I + h / 2, w, 0.07, h, 0.07);
    for (const v of [-0.42, 0.42]) {
      e.box(V, l + v, I + 0.3, (c + d) / 2, 0.07, 0.09, d - c + 0.07).box(
        V,
        l + v,
        p - 0.04,
        (c + d) / 2,
        0.08,
        0.1,
        d - c + 0.08,
      );
      for (let w = I + 0.42; w < p - 0.5; w += 0.62)
        (a(V, l + v, w, c, l + v, w + 0.62, d, 0.022),
          a(V, l + v, w + 0.62, c, l + v, w, d, 0.022));
    }
    for (const v of [c, d])
      (e.box(V, l, p - 0.04, v, 0.92, 0.1, 0.1),
        a(V, l - 0.42, I + 0.5, v, l + 0.42, p - 0.3, v, 0.02),
        a(V, l + 0.42, I + 0.5, v, l - 0.42, p - 0.3, v, 0.02));
    r(ct, l, p + 0.03, p + 0.22, 0.14, M - 4.1, M + 3.5, 0.3);
    const m = p + 1.32,
      x = (c + d) / 2;
    for (const v of [-0.14, 0.14])
      (a(V, l + v, p + 0.2, c, l + v * 0.6, m, x, 0.045),
        a(V, l + v, p + 0.2, d, l + v * 0.6, m, x, 0.045),
        a(ct, l + v * 0.6, m, x, l + v, p + 0.22, M + 3.45, 0.012),
        a(ct, l + v * 0.6, m, x, l + v, p + 0.22, M + 1.2, 0.012),
        a(ct, l + v * 0.6, m, x, l + v, p + 0.22, M - 4.05, 0.012));
    (e.box(V, l, m, x, 0.2, 0.06, 0.12),
      e.box(
        _("#d9d2c3", { roughness: 0.5 }),
        l,
        p - 0.2,
        M - 2.7,
        0.5,
        0.32,
        0.62,
      ));
    for (let v = M - 3.9; v < M + 3.4; v += 0.6) t.push([l, p + 0.25, v]);
    (t.push([l, m + 0.05, x]), ko.push({ x: l, top: p, i: u, ph: u * 1.7 }));
  }
  e.flush(le);
  const i = new s.InstancedMesh(
      new s.SphereGeometry(0.032, 6, 5),
      He("#ffb050", 5),
      t.length,
    ),
    f = new s.Matrix4();
  (t.forEach(([u, l, c], d) => {
    (f.makeTranslation(u, l, c), i.setMatrixAt(d, f));
  }),
    le.add(i));
  for (const u of ko) {
    const l = new s.Group(),
      c = K();
    (c.box(ct, 0, 0, 0, 0.3, 0.1, 0.26), c.flush(l));
    const d = new s.Mesh(
      new s.BoxGeometry(qe * 1.4, 0.035, ke * 1.15),
      G("#d6a03c", { roughness: 0.4 }),
    );
    (l.add(d), (u.tr = l), (u.sp = d));
    const h = new s.Mesh(new s.BoxGeometry(0.012, 1, 0.012), V);
    (l.add(h), (u.cab = h), le.add(l));
  }
}
{
  const e = K(),
    t = _("#1f2024", { roughness: 0.82 }),
    o = _("#2c2d31", { roughness: 0.7 });
  for (let n = 1; n < rt; n++) {
    const a = -R + n * it;
    e.box(t, a, O + 0.04, (M + ze) / 2, 0.28, 0.14, ze - M)
      .box(o, a, O + 0.115, (M + ze) / 2, 0.3, 0.012, ze - M + 0.02)
      .box(t, a, O + 0.05, ze + 0.12, 0.42, 0.16, 0.3);
    for (let r = M + 0.7; r < ze; r += 1.5)
      e.cyl(V, a, O + 0.22, r, 0.008, 0.01, 0.2, { seg: 5 });
  }
  e.flush(le);
}
const _n = 0.17,
  An = 0.3;
function Za(e) {
  if (e <= 12) {
    const l = Math.max(1, Math.ceil(e / 4)),
      c = 0.27,
      d = c + l * ke * 1.04 + 0.02,
      h = d / (1 - An);
    return {
      kind: "tug",
      n: e,
      w: 2,
      h: 2,
      l,
      L: h,
      B: 2 * qe * 1.1 + 0.14,
      H: 0.15,
      stern: c,
      bow: h - d,
    };
  }
  const t = e <= 50 ? 3 : e <= 130 ? 4 : 5,
    o = e <= 50 ? 3 : 4,
    n = Math.ceil(e / (t * o)),
    a = 0.36,
    r = a + n * ke * 1.03 + 0.04,
    i = r / (1 - _n);
  return {
    kind: "ship",
    n: e,
    w: t,
    h: o,
    l: n,
    L: i,
    B: t * qe * 1.08 + 0.08,
    H: 0.19,
    stern: a,
    bow: i - r,
  };
}
function En(e) {
  const t = e.nz || 22,
    o = 6,
    n = [],
    a = [],
    r = [],
    i = (h, p) => {
      let m = 0.5;
      if (h > e.bow) {
        const x = (h - e.bow) / (1 - e.bow);
        m = 0.5 * (1 - Math.pow(x, e.pow)) * (1 - e.flare * (1 - p) * x);
      }
      if (h < e.aft) {
        const x = 1 - h / e.aft;
        m *= 1 - e.round * x * x;
      }
      if (p < e.bilge) {
        const x = (e.bilge - p) / e.bilge;
        m -= (1 - Math.sqrt(Math.max(0, 1 - x * x))) * e.bilge * 0.9;
      }
      return Math.max(m, 0);
    },
    f = (h) => (h < e.aft ? e.cut * (1 - h / e.aft) ** 2 : 0),
    u = (h) =>
      1 +
      (h > e.sheerAt ? e.sheer * ((h - e.sheerAt) / (1 - e.sheerAt)) ** 2 : 0) +
      (h < 0.08 ? e.sheerAft * (1 - h / 0.08) : 0),
    l = (h, p, m) => {
      const x = h / t,
        v = f(x),
        w = u(x),
        y = p / o,
        T = v + (w - v) * y;
      return [m * i(x, y), T, x];
    },
    c = (h, p, m, x) => h.push(...p, ...m, ...x);
  for (const h of [1, -1])
    for (let p = 0; p < t; p++)
      for (let m = 0; m < o; m++) {
        const x = l(p, m, h),
          v = l(p + 1, m, h),
          w = l(p + 1, m + 1, h),
          y = l(p, m + 1, h);
        h > 0 ? (c(n, x, w, v), c(n, x, y, w)) : (c(n, x, v, w), c(n, x, w, y));
      }
  for (let h = 0; h < t; h++) {
    const p = l(h, o, -1),
      m = l(h, o, 1),
      x = l(h + 1, o, 1),
      v = l(h + 1, o, -1);
    (c(a, p, x, m), c(a, p, v, x));
    const w = l(h, 0, -1),
      y = l(h, 0, 1),
      T = l(h + 1, 0, 1),
      D = l(h + 1, 0, -1);
    (c(r, w, y, T), c(r, w, T, D));
  }
  for (let h = 0; h < o; h++) {
    const p = l(0, h, -1),
      m = l(0, h, 1),
      x = l(0, h + 1, 1),
      v = l(0, h + 1, -1);
    (c(r, p, x, m), c(r, p, v, x));
  }
  const d = (h, p) => {
    let m = new s.BufferGeometry();
    return (
      m.setAttribute("position", new s.Float32BufferAttribute(h, 3)),
      p
        ? ((m = pa(m, 1e-5)), m.computeVertexNormals(), (m = m.toNonIndexed()))
        : m.computeVertexNormals(),
      m.setAttribute(
        "uv",
        new s.Float32BufferAttribute(
          new Float32Array(m.attributes.position.count * 2),
          2,
        ),
      ),
      m
    );
  };
  return Qo([d(n, !0), d(a, !1), d(r, !1)]);
}
const Bn = En({
    bow: 1 - _n,
    pow: 1.7,
    flare: 0.45,
    aft: 0.1,
    round: 0.18,
    bilge: 0.22,
    cut: 0.32,
    sheerAt: 0.72,
    sheer: 0.22,
    sheerAft: 0.06,
  }),
  Ja = En({
    bow: 1 - An,
    pow: 1.5,
    flare: 0.4,
    aft: 0.16,
    round: 0.28,
    bilge: 0.3,
    cut: 0.4,
    sheerAt: 0.55,
    sheer: 0.42,
    sheerAft: 0.1,
    nz: 14,
  }),
  Pn = re(
    new s.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.32,
    }),
    Object.assign(
      (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vHL;varying vec3 vHN;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vHL=position;vHN=normal;`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vHL;varying vec3 vHN;`,
            )
            .replace(
              "#include <color_fragment>",
              `#include <color_fragment>
  {float y=vHL.y;vec3 c=y<.36?vec3(.36,.07,.05):y<.41?vec3(.78,.75,.68):vec3(.016,.018,.022);if(vHN.y>.6)c=vec3(.09,.12,.1);diffuseColor.rgb=c;}`,
            )));
      },
      { key: "hull" },
    ),
  ),
  q = 260,
  Fn = 7e3,
  Jt = new s.InstancedMesh(Bn, Pn, q),
  Qt = new s.InstancedMesh(Ja, Pn, q),
  Qa = re(
    new s.MeshStandardMaterial({ color: "#e8e4da", roughness: 0.45 }),
    Object.assign(
      (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vBL;varying vec3 vBN;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vBL=position;vBN=normal;`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vBL;varying vec3 vBN;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
  {vec3 an=abs(vBN);if(an.y<.5){float band=step(.32,vBL.y)*step(vBL.y,.82);float u=an.x>an.z?vBL.z:vBL.x;float mull=step(.12,fract(u*14.+.5));
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.03,.04,.05),band);totalEmissiveRadiance+=vec3(1.,.8,.55)*band*mull*.9;}}`,
            )));
      },
      { key: "bridge" },
    ),
  ),
  eo = new s.InstancedMesh(
    new s.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
    Qa,
    q,
  ),
  es = (() => {
    const e = new s.Shape(
        [
          [-0.5, 0],
          [0, 0.2],
          [0.5, 0],
          [0.5, -0.05],
          [0, 0.15],
          [-0.5, -0.05],
        ].map(([o, n]) => new s.Vector2(o, n)),
      ),
      t = new s.ExtrudeGeometry(e, { depth: 1, bevelEnabled: !1 });
    return (t.rotateX(-Math.PI / 2), t.computeVertexNormals(), t);
  })(),
  to = new s.InstancedMesh(es, _("#9a9c9e", { roughness: 0.6 }), q),
  oo = new s.InstancedMesh(
    new s.CapsuleGeometry(0.5, 1.2, 3, 10).rotateX(Math.PI / 2),
    _("#e8762c", { roughness: 0.5 }),
    q * 2,
  ),
  no = new s.InstancedMesh(
    new s.BoxGeometry(1, 1, 1),
    _("#d8d4cc", { roughness: 0.5 }),
    q,
  ),
  ts = re(
    new s.MeshStandardMaterial({ color: "#e9e5dc", roughness: 0.5 }),
    Object.assign(
      (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vLoc;varying vec3 vNo;varying vec3 vSz;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vLoc=position;vNo=normal;
#ifdef USE_INSTANCING
vSz=vec3(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz),length(instanceMatrix[2].xyz));
#else
vSz=vec3(1.);
#endif`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vLoc;varying vec3 vNo;varying vec3 vSz;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
   // windows sized to the house's real size (rows of cabins), whatever the house's proportions
   {vec3 an=abs(vNo);if(an.y<.5){bool xf=an.x>an.z;float len=xf?vSz.z:vSz.x,nc=max(2.,floor(len/.032)),nr=max(2.,floor(vSz.y/.03));
    float u=(xf?vLoc.z:vLoc.x)+.5,v=vLoc.y,fu=fract(u*nc),fv=fract(v*nr);vec2 cell=floor(vec2(u*nc,v*nr));float hsh=fract(sin(dot(cell+vNo.xz*7.,vec2(12.9,78.2)))*43758.5);
    float m=step(.24,fu)*step(fu,.76)*step(.38,fv)*step(fv,.78)*step(1.,cell.y)*step(.12,hsh);vec3 wc=mix(vec3(1.,.8,.52),vec3(.8,.9,1.),step(.9,hsh));
    totalEmissiveRadiance+=wc*m*1.5;diffuseColor.rgb*=1.-m*.85;}}`,
            )));
      },
      { key: "super" },
    ),
  ),
  ao = new s.InstancedMesh(
    new s.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
    ts,
    q,
  ),
  os = re(
    new s.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5 }),
    Object.assign(
      (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying float vFY;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vFY=position.y;`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying float vFY;`,
            )
            .replace(
              "#include <color_fragment>",
              `#include <color_fragment>
 diffuseColor.rgb=vFY>.86?vec3(.03):vFY>.6&&vFY<.76?vec3(.62,.42,.16):vec3(.82,.8,.75);`,
            )));
      },
      { key: "funnel" },
    ),
  ),
  so = new s.InstancedMesh(
    new s.CylinderGeometry(0.5, 0.56, 1, 14).translate(0, 0.5, 0),
    os,
    q,
  ),
  ro = new s.InstancedMesh(
    new s.CylinderGeometry(0.006, 0.008, 1, 5).translate(0, 0.5, 0),
    ct,
    q,
  ),
  ns = re(
    new s.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.5,
      metalness: 0.15,
    }),
    Object.assign(
      (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vCL;varying vec3 vCN;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vCL=position;vCN=normal;`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vCL;varying vec3 vCN;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
  {vec3 an=abs(vCN);float rib=an.x>.5?.82+.18*sin(vCL.z*${((2 * Math.PI * 11) / ke).toFixed(2)}):an.z>.5?(.78+.22*step(.12,fract(vCL.x*${(4 / qe).toFixed(2)}+.5)))*(1.-.35*step(${(ge * 0.4).toFixed(4)},abs(vCL.y))):.9+.1*sin(vCL.z*${((2 * Math.PI * 6) / ke).toFixed(2)});
  diffuseColor.rgb*=rib;
  #ifdef USE_COLOR
  totalEmissiveRadiance+=(vColor.rgb*.62+vec3(.36,.26,.14)*.3)*rib*(an.y>.5?.55:1.);
  #endif
  }`,
            )));
      },
      { key: "cont" },
    ),
  ),
  Ye = new s.InstancedMesh(
    new s.BoxGeometry(qe * 0.94, ge * 0.94, ke * 0.97),
    ns,
    Fn,
  ),
  ye = new s.InstancedMesh(
    new s.SphereGeometry(0.02, 6, 5),
    new s.MeshBasicMaterial({ color: 16777215, fog: !1 }),
    q * 3,
  ),
  as = St(
    128,
    256,
    (e, t, o) => {
      e.translate(t / 2, o / 2);
      const n = e.createRadialGradient(0, 0, 0, 0, 0, t / 2);
      (n.addColorStop(0, "rgba(255,255,255,0)"),
        n.addColorStop(0.62, "rgba(255,255,255,0)"),
        n.addColorStop(0.8, "rgba(255,255,255,.75)"),
        n.addColorStop(0.9, "rgba(255,255,255,.25)"),
        n.addColorStop(1, "rgba(255,255,255,0)"),
        e.scale(1, o / t),
        (e.fillStyle = n),
        e.beginPath(),
        e.arc(0, 0, t / 2, 0, Math.PI * 2),
        e.fill());
    },
    !1,
  ),
  Ke = new s.InstancedMesh(
    new s.PlaneGeometry(1, 1).rotateX(-Math.PI / 2).translate(0, 0, 0.5),
    new s.MeshBasicMaterial({
      map: as,
      color: new s.Color(0.5, 0.85, 0.95),
      transparent: !0,
      opacity: 0.55,
      blending: s.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    }),
    q,
  ),
  ft = new s.InstancedMesh(
    Bn,
    new s.MeshBasicMaterial({
      color: new s.Color(0.55, 0.85, 1),
      transparent: !0,
      opacity: 0.22,
      depthWrite: !1,
      fog: !1,
    }),
    40,
  ),
  Dn = new s.Group();
xt.add(Dn);
for (const e of [Jt, Qt, eo, to, oo, no, ao, so, ro, Ye, ye, ft, Ke])
  ((e.count = 0),
    (e.frustumCulled = !1),
    Dn.add(e),
    e !== ye &&
      e !== ft &&
      e !== Ke &&
      ((e.castShadow = !0), (e.receiveShadow = !0)));
(at.push(ft, Ke), ie.push(Ke));
const ss = new s.Quaternion(),
  rs = new s.Color(),
  k = new s.Matrix4(),
  ce = new s.Quaternion(),
  fe = new s.Vector3(),
  ue = new s.Vector3(),
  is = new s.Euler(),
  _o = [
    new s.Color(3.2, 3, 2.6),
    new s.Color(3.4, 0.5, 0.4),
    new s.Color(0.4, 3, 1),
  ],
  ls = ["Same cargo", "Requests", "Per request"];
function cs(e, t, o, n) {
  const a = Rt(e),
    r = Za(a),
    i = [];
  if (t === 0) {
    const f = Math.floor(o / a),
      u = o - f * a;
    for (let l = 0; l < f; l++) i.push({ cont: a });
    u > 0 && i.push({ cont: u });
  } else if (t === 1) {
    const f = e.r / n,
      u = Math.floor(f),
      l = f - u;
    for (let c = 0; c < u; c++) i.push({ cont: a });
    (l > 0.05 && i.push({ cont: 0, ghost: l }),
      i.length || i.push({ cont: 0, ghost: Math.max(l, 0.05) }));
  } else i.push({ cont: a });
  return { spec: r, list: i };
}
function fs(e, t) {
  const o = xe(e) - it / 2 + 0.17,
    n = xe(e) + it / 2 - 0.17,
    a = M + 0.14,
    r = ze + 0.55,
    { L: i, B: f } = t.spec,
    u = t.spec.kind === "tug" ? 0.1 : 0.09,
    l = 0.06,
    c = t.list.length,
    d = Math.max(1, Math.floor((r - a + u) / (i + u))),
    h = Math.max(1, Math.floor((n - o + l) / (f + l))),
    p = Math.min(h, Math.max(1, Math.ceil(c / d))),
    m = (x) =>
      p === 1
        ? t.spec.kind === "tug"
          ? xe(e)
          : o + f / 2 + 0.02
        : o + f / 2 + x * ((n - o - f) / (p - 1));
  return t.list.map((x, v) => {
    const w = Math.floor(v / d) % p,
      y = v % d;
    return { ...x, x: m(w), z: a + y * (i + u), spec: t.spec };
  });
}
let A = Xt(),
  _e = 0,
  H = null;
const $ = [];
let io = 1,
  Ao = 1;
function ut(e) {
  for (let o = $.length - 1; o >= 0; o--) $[o].leave && $.splice(o, 1);
  const t = new Map();
  for (const o of $) o.leave || t.set(o.key, o);
  ((io = Math.max(...A.map(Rt))), (Ao = Math.max(...A.map((o) => o.r)) / 14));
  for (const o of $) o.leave = !0;
  (A.forEach((o, n) => {
    const a = cs(o, _e, io, Ao);
    fs(n, a).forEach((i, f) => {
      const u = o.id + "|" + n + "|" + f + "|" + i.spec.L.toFixed(3),
        l = t.get(u);
      if (l) {
        ((l.leave = !1),
          Object.assign(l, {
            x: i.x,
            z: i.z,
            cont: i.cont,
            ghost: i.ghost,
            spec: i.spec,
          }));
        return;
      }
      $.push({
        key: u,
        app: o,
        i: n,
        k: f,
        x: i.x,
        z: i.z,
        cont: i.cont,
        ghost: i.ghost,
        spec: i.spec,
        p: e ? 1 : 0,
        leave: !1,
        seed: on(o.id * 0.37 + n * 3.1 + f * 0.71),
        born: Ie,
      });
    });
  }),
    vt(!0));
}
function us(e, t) {
  let o = 0,
    n = 0,
    a = 0,
    r = 0,
    i = 0,
    f = 0,
    u = 0,
    l = 0;
  for (let c = $.length - 1; c >= 0; c--) {
    const d = $[c];
    ((d.p +=
      ((d.leave ? 0 : 1) - d.p) * (1 - Math.exp(-e * (d.leave ? 3.2 : 2.4)))),
      d.leave && d.p < 0.01 && $.splice(c, 1));
  }
  for (const c of $) {
    const d = c.spec,
      h = c.p * c.p * (3 - 2 * c.p),
      p = (1 - h) * (c.leave ? 2.6 : 3.4),
      m = Math.sin(t * 1.25 + c.seed * 20) * 0.006,
      x = O - 0.035 + m - (1 - h) * 0.05,
      v = c.z + p,
      w = c.x;
    if (h < 0.02) continue;
    if (c.ghost != null && c.cont === 0) {
      r < 40 &&
        (k.compose(
          ue.set(w, O - 0.03, v),
          ce.identity(),
          fe.set(d.B, d.H * 0.9, d.L),
        ),
        ft.setMatrixAt(r++, k));
      continue;
    }
    if (o >= q) break;
    (ce.setFromEuler(
      is.set(
        Math.sin(t * 0.9 + c.seed * 9) * 0.012,
        0,
        Math.sin(t * 1.1 + c.seed * 7) * 0.018,
      ),
    ),
      k.compose(ue.set(w, x, v), ce, fe.set(d.B, d.H, d.L)),
      d.kind === "tug" ? Qt.setMatrixAt(f++, k) : Jt.setMatrixAt(i++, k),
      k.compose(
        ue.set(w, O + 0.004, v - d.L * 0.05),
        ss,
        fe.set(d.B * 1.75, 1, d.L * 1.12),
      ),
      Ke.setMatrixAt(o, k));
    const y = d.kind === "tug",
      T = x + d.H,
      D = v + (y ? 0.05 : 0.1),
      U = d.stern - (y ? 0.08 : 0.12),
      Y = y ? 0.13 : ge * (d.h + 0.6),
      Fe = D + U * 0.55,
      Ne = T + Y + 0.035;
    if (
      (k.compose(ue.set(w, T, D), ce, fe.set(d.B * (y ? 0.7 : 0.64), Y, U)),
      ao.setMatrixAt(o, k),
      k.compose(
        ue.set(w, T + Y, D + U * 0.35),
        ce,
        fe.set(d.B * (y ? 0.86 : 1.12), 0.035, U * 0.62),
      ),
      eo.setMatrixAt(o, k),
      k.compose(
        ue.set(w, T, v + (y ? 0.015 : 0.035)),
        ce,
        fe.set(d.B * (y ? 0.14 : 0.2), Y * (y ? 1.1 : 0.95), y ? 0.05 : 0.075),
      ),
      so.setMatrixAt(o, k),
      k.compose(ue.set(w, Ne, Fe), ce, fe.set(1.4, y ? 0.16 : 0.2, 1.4)),
      ro.setMatrixAt(o, k),
      k.compose(
        ue.set(w, Ne + (y ? 0.12 : 0.15), Fe),
        ce,
        fe.set(y ? 0.07 : 0.1, 0.008, 0.014),
      ),
      no.setMatrixAt(o, k),
      !y)
    ) {
      for (const ee of [-1, 1])
        (k.compose(
          ue.set(w + ee * d.B * 0.43, T + Y * 0.42, Fe),
          ce,
          fe.set(0.028, 0.024, 0.034),
        ),
          oo.setMatrixAt(u++, k));
      (k.compose(
        ue.set(w, T, v + d.L - d.bow + 0.01),
        ce,
        fe.set(d.B * 0.92, ge * 0.95, d.B * 0.8),
      ),
        to.setMatrixAt(l++, k));
    }
    a < q * 3 - 2 &&
      (k.makeTranslation(w, Ne + (y ? 0.16 : 0.2), Fe),
      ye.setMatrixAt(a, k),
      ye.setColorAt(a++, _o[0]),
      k.makeTranslation(
        w - d.B * (y ? 0.43 : 0.56),
        T + Y + 0.02,
        D + U * 0.35,
      ),
      ye.setMatrixAt(a, k),
      ye.setColorAt(a++, _o[1]),
      k.makeTranslation(
        w + d.B * (y ? 0.43 : 0.56),
        T + Y + 0.02,
        D + U * 0.35,
      ),
      ye.setMatrixAt(a, k),
      ye.setColorAt(a++, _o[2]));
    const Ue = d.w * d.l,
      Dt = v + d.stern + ke * 0.52,
      zt = x + d.H + ge * 0.5;
    for (let ee = 0; ee < c.cont && n < Fn; ee++) {
      const ra = Math.floor(ee / Ue),
        Zo = ee % Ue,
        ia = Math.floor(Zo / d.w),
        la = Zo % d.w;
      (k.compose(
        ue.set(
          w + (la - (d.w - 1) / 2) * qe * 1.02,
          zt + ra * ge,
          Dt + ia * ke * 1.03,
        ),
        ce,
        fe.set(1, 1, 1),
      ),
        Ye.setMatrixAt(n, k),
        Ye.setColorAt(
          n,
          rs.set(Zt[Math.floor(on(c.seed * 91 + ee * 1.37) * Zt.length)]),
        ),
        n++);
    }
    o++;
  }
  for (const c of [eo, ao, so, ro, no]) c.count = o;
  ((Jt.count = i),
    (Qt.count = f),
    (oo.count = u),
    (to.count = l),
    (Ye.count = n),
    (ye.count = a),
    (ft.count = r),
    (Ke.count = Math.min(o, q)));
  for (const c of [Jt, Qt, eo, to, oo, no, ao, so, ro, Ye, ye, ft, Ke])
    ((c.instanceMatrix.needsUpdate = !0),
      c.instanceColor && (c.instanceColor.needsUpdate = !0));
}
function ds(e) {
  for (const t of ko) {
    const o = (e * 0.1 + t.ph * 0.13) % 1,
      n = tn(0.08, 0.3, o) * (1 - tn(0.58, 0.8, o)),
      a = M - 1.4 + n * 3.2,
      r =
        Math.sin(Math.PI * E((o - 0.3) / 0.28, 0, 1)) * 1.1 +
        Math.sin(Math.PI * E((o - 0.82) / 0.16, 0, 1)) * 0.8;
    (t.tr.position.set(t.x, t.top + 0.02, a),
      (t.sp.position.y = -0.2 - r),
      (t.cab.scale.y = 0.2 + r),
      (t.cab.position.y = -(0.2 + r) / 2));
  }
}
const Oe = [];
for (let e = 0; e < rt; e++) {
  const t = new s.Group(),
    o = K();
  (o
    .box(
      G("#b08a52", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
      0,
      0.14,
      0,
      2.2,
      0.46,
      0.06,
      { r: 0.02 },
    )
    .box(V, 0, -0.08, -0.04, 0.06, 0.2, 0.06),
    o.flush(t));
  const n = gn(2.08, 0.36, 1400, 244, null, 0.95, { alphaTest: 0.2 });
  (n.position.set(0, 0.14, 0.032),
    t.add(n),
    t.position.set(xe(e), O + 0.1, 3.75),
    (t.rotation.x = -0.42),
    le.add(t),
    Oe.push({ g: t, txt: n, name: "" }));
}
function Eo(e, t, o) {
  ((e.name = t),
    e.fr || ((e.fr = 1), jt.push(() => Eo(e, e.name, e.hot))),
    e.txt.userData.redraw((n, a, r) => {
      const i = n.createLinearGradient(0, 0, 0, r);
      (i.addColorStop(0, o ? "#5a4630" : "#4a3a28"),
        i.addColorStop(1, o ? "#3a2c1e" : "#2c2218"),
        (n.fillStyle = i),
        n.fillRect(0, 0, a, r));
      let f = Math.round(r * 0.38);
      for (
        n.font = `600 ${f}px Outfit, sans-serif`;
        n.measureText(t).width > a - a * 0.06 && f > r * 0.2;
      )
        ((f -= 2), (n.font = `600 ${f}px Outfit, sans-serif`));
      ((n.textAlign = "center"),
        (n.textBaseline = "middle"),
        (n.fillStyle = "#050505"),
        n.fillText(t, a / 2 + r * 0.013, r / 2 + r * 0.03));
      const u = n.createLinearGradient(0, r * 0.2, 0, r * 0.8);
      (u.addColorStop(0, o ? "#fff0c0" : "#f3dca2"),
        u.addColorStop(1, o ? "#f0b050" : "#c39a5a"),
        (n.fillStyle = u),
        n.fillText(t, a / 2, r / 2 + r * 0.017));
    }));
}
function hs(e = 640, t = 150) {
  const o = document.createElement("canvas");
  ((o.width = e), (o.height = t));
  const n = o.getContext("2d"),
    a = new s.CanvasTexture(o);
  ((a.colorSpace = s.SRGBColorSpace), (a.anisotropy = 4));
  const r = new s.Mesh(
    new s.PlaneGeometry(1, t / e),
    new s.MeshBasicMaterial({
      map: a,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      color: new s.Color(1.25, 1.25, 1.25),
    }),
  );
  return (
    (r.renderOrder = 10),
    (r.frustumCulled = !1),
    Wt.add(r),
    (r.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 0,
      set(i, f = "") {
        const u = i + "|" + f;
        if (u === this.key) return;
        ((this.key = u),
          (this.args = [i, f]),
          n.clearRect(0, 0, e, t),
          (n.font = "600 33px Outfit, sans-serif"));
        const l = n.measureText(i).width;
        n.font = "700 42px Outfit, sans-serif";
        const c = f ? n.measureText(f).width : 0,
          d = Math.min(e - 8, Math.max(l, c) + 44),
          h = f ? t - 10 : Math.round(t * 0.52),
          p = (e - d) / 2,
          m = (t - h) / 2;
        ((n.fillStyle = "rgba(11,14,22,.9)"),
          Oa(n, p, m, d, h, 16),
          n.fill(),
          (n.fillStyle = "#eef2fa"),
          (n.font = "600 33px Outfit, sans-serif"),
          f
            ? (n.fillText(i, p + 22, m + 46),
              (n.fillStyle = "#fff"),
              (n.font = "700 42px Outfit, sans-serif"),
              n.fillText(f, p + 22, m + h - 22))
            : n.fillText(i, p + 22, m + h / 2 + 12),
          (a.needsUpdate = !0));
      },
    }),
    jt.push(() => {
      const i = r.userData;
      i.args && ((i.key = ""), i.set(...i.args));
    }),
    r
  );
}
const ps = new s.Vector3(),
  zn = new s.Vector3();
function On(e, t, o = 24, n = 0) {
  const a = (Ro(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(b.quaternion),
    e.scale.set(a, a, a),
    n &&
      e.position.addScaledVector(
        ps.set(0, 1, 0).applyQuaternion(b.quaternion),
        (n * a * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-fo * 8))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
let At = !0;
const lo = hs(),
  ms = S("#card-a");
function vs(e) {
  const t = A[e];
  if (!t) return "";
  const o = Ha(t.name),
    n = o && me.harbour[o],
    a = Rt(t);
  let r = `<h4>${Ct(t.name)}</h4><p class="tk"><b>${Tt(t.r)}</b> requests</p><p class="tk"><b>${Va(t.t)}</b> tokens this week</p><p class="tk">about <b>${st(P(t))}</b> tokens per request</p><hr>`;
  r += `<div class="lb">One vessel is one request: <b style="color:#fff">${a}</b> container${a > 1 ? "s" : ""} of 2,000 tokens.</div>`;
  const i = n && n.turns[3];
  return (
    i &&
      (r += `<hr><div class="lb">Harbour fee for a 50+ turn session:</div><table><tr><td><b style="color:var(--cyan)">${Mn(i.lo[1])}</b> on ${Ct(i.lo[0])}</td></tr><tr><td><b style="color:var(--amber)">${Mn(i.hi[1])}</b> on ${Ct(i.hi[0])}</td></tr></table>`),
    r
  );
}
const co = new s.Vector3();
function gs(e) {
  const t = ms;
  if (e == null || !A[e]) {
    t.classList.remove("on");
    return;
  }
  const o = vs(e);
  (t._h !== o && ((t.innerHTML = o), (t._h = o)),
    co.set(xe(e), O + 0.5, M + 1.4).project(b));
  const n = Se.clientWidth,
    a = Se.clientHeight;
  if (co.z > 1) {
    t.classList.remove("on");
    return;
  }
  const r = (co.x * 0.5 + 0.5) * n,
    i = (-co.y * 0.5 + 0.5) * a,
    f = t.offsetWidth || 222,
    u = t.offsetHeight || 190;
  let l = r + (r < n * 0.6 ? 40 : -40 - f),
    c = i - u * 0.75;
  const d = Math.min(
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--sael-corner-w",
        ),
      ) || 260,
      320,
    ),
    h = Math.min(
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--sael-corner-h",
        ),
      ) || 260,
      320,
    );
  ((l = E(l, 12, n - f - 12)),
    (c = E(c, be ? 150 : 96, a - u - (be ? 150 : 16))));
  const p = S(".side").getBoundingClientRect(),
    m = S(".ctl").getBoundingClientRect(),
    x = (v) =>
      l < v.right + 10 &&
      l + f > v.left - 10 &&
      c < v.bottom + 10 &&
      c + u > v.top - 10;
  (!be && x(p) && (c = p.bottom + 14),
    !be && x(m) && (c = m.bottom + 14),
    l + f > n - d - 30 && c + u > a - h - 30 && (c = a - h - 30 - u),
    (t.style.transform = `translate(${l.toFixed(0)}px,${c.toFixed(0)}px)`),
    t.classList.add("on"));
}
const Q = { sel: null };
let Bo = 0.016,
  Po = 0.016,
  fo = 0.016,
  Ie = 0,
  N = null;
function xs(e) {
  (Co.begin(), Co.end());
  const t = lo.userData;
  ((t.want = N && N.app && At ? 1 : 0),
    N && N.app
      ? (lo.userData.set(
          N.app.name +
            (N.ghost != null && N.cont === 0 ? " \xB7 part of a vessel" : ""),
          N.cont ? `${N.cont} \xD7 2,000 tokens` : "",
        ),
        On(
          lo,
          zn.set(
            N.x,
            O + N.spec.H + 0.25 + N.spec.h * ge,
            N.z + N.spec.L * 0.5,
          ),
          44,
          0.6,
        ))
      : On(lo, zn.set(0, -99, 0), 44),
    gs(Q.sel),
    A.forEach((o, n) => {
      const a = Q.sel === n || Fo === n;
      (Oe[n].name !== o.name || Oe[n].hot !== a) &&
        ((Oe[n].hot = a), Eo(Oe[n], o.name, a));
    }));
  for (let o = A.length; o < rt; o++) Oe[o].name !== "" && Eo(Oe[o], "", !1);
}
let Fo = null;
const Ae = {
    lab: {
      t: [0.3, 1.35, -1.1],
      yaw: -0.5,
      pitch: 0.34,
      dist: 23.6,
      f: [-1.4, 1.2, 1.2],
      r: 7.4,
      fit: [21.6, 13.2],
    },
    water: {
      t: [-5.6, 1.2, -0.4],
      yaw: -0.3,
      pitch: 0.13,
      dist: 7.6,
      f: [-7.4, 1.2, 1.4],
      r: 2.4,
      fit: [6.6, 4.1],
    },
  },
  In = { t: [0.3, 1.1, 0], yaw: -0.25, pitch: 0.85, dist: 30 },
  C = { t: new s.Vector3(0, 1, 0), yaw: 0, pitch: 0.4, dist: 20 };
let uo = 4,
  de = 1,
  Do = 1,
  be = !1,
  ae = !1,
  zo = [21.6, 13.2],
  Gn = 23.6,
  Xe = "lab";
const se = L.domElement,
  Ze = new Map();
let ho = 0,
  dt = null,
  Me = null,
  Oo = null;
const Ee = new s.Raycaster(),
  Nn = new s.Vector2(),
  Je = new s.Vector3(),
  Io = new s.Box3();
function ht(e) {
  const t = be && b.aspect < 0.8 && e === Ae.lab ? { ...e, ...In } : e;
  (C.t.set(...t.t),
    (C.yaw = t.yaw),
    (C.pitch = t.pitch),
    (C.dist = t.dist),
    nt.set(...t.f),
    (uo = t.r),
    t.fit && ((zo = t.fit), (Gn = t.dist)),
    (de = 1),
    (ae = !1),
    ea());
}
const Un = [],
  Vn = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), Un.push(e));
  };
(kn.forEach((e) => Vn(e.hit, "link", { L: e })),
  Oe.forEach((e, t) =>
    e.g.traverse((o) => {
      o.isMesh && Vn(o, "berth", { i: t });
    }),
  ));
const ws = (e) => {
  let t = e;
  for (; t.parent; t = t.parent) if (!t.visible) return !1;
  return t === z && t.visible;
};
function Go(e) {
  const t = se.getBoundingClientRect();
  (Nn.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Ee.setFromCamera(Nn, b));
  let o = null,
    n = 1e9;
  const a = Ee.intersectObjects(
    Un.filter((r) => r.visible && ws(r)),
    !1,
  )[0];
  a && ((o = { ...a.object.userData.hk }), (n = a.distance));
  for (const r of $) {
    if (r.leave || r.p < 0.5) continue;
    const i = r.spec;
    if (
      (Io.min.set(r.x - i.B / 2, O - 0.04, r.z),
      Io.max.set(r.x + i.B / 2, O + i.H + i.h * ge + 0.05, r.z + i.L),
      Ee.ray.intersectBox(Io, Je))
    ) {
      const f = Je.distanceTo(Ee.ray.origin);
      f < n && ((n = f), (o = { kind: "vessel", v: r, i: r.i }));
    }
  }
  if (!o && Math.abs(Ee.ray.direction.y) > 1e-4) {
    const r = (O - Ee.ray.origin.y) / Ee.ray.direction.y;
    if (
      r > 0 &&
      (Je.copy(Ee.ray.direction).multiplyScalar(r).add(Ee.ray.origin),
      Math.abs(Je.x) < R && Je.z > M && Je.z < Z)
    ) {
      const i = Math.floor((Je.x + R) / it);
      i >= 0 && i < A.length && (o = { kind: "berth", i });
    }
  }
  return o;
}
function Qe(e) {
  ((Q.sel = e), vt(!0));
}
function ys(e) {
  if (!e) {
    Q.sel != null && Qe(null);
    return;
  }
  switch (e.kind) {
    case "vessel":
    case "berth":
      Qe(Q.sel === e.i ? null : e.i);
      break;
    case "link":
      window.open(ma, "_blank", "noopener");
      break;
  }
}
function No(e) {
  e !== _e && ((_e = e), ut(!1));
}
function bs(e) {
  ((H = e === H ? null : e),
    (A = H ? To(H) : Xt()),
    Q.sel != null && Q.sel >= A.length && (Q.sel = null),
    ut(!1));
}
function Uo(e, t) {
  const o =
      (b.position.distanceTo(C.t) *
        2 *
        Math.tan(s.MathUtils.degToRad(b.fov / 2))) /
      Math.max(Se.clientHeight, 1),
    n = Math.cos(C.yaw),
    a = Math.sin(C.yaw);
  ((ae = !0),
    (C.t.x = E(C.t.x - n * e * o, -12, 12)),
    (C.t.z = E(C.t.z + a * e * o, -10, 7)),
    (C.t.y = E(C.t.y + t * o, 0.6, 8)));
}
const Hn = {
    vessel: (e) =>
      `${e.v.app.name} \xB7 one request \xB7 ${st(P(e.v.app))} tokens`,
    berth: (e) =>
      A[e.i] ? A[e.i].name + " \xB7 " + Tt(A[e.i].r) + " requests" : "",
    link: () => "@RYANSAEL on X",
  },
  et = S("#tip");
let Et = null;
function Ms(e) {
  const t = Go(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== Et && (Et?.over(!1), o?.over(!0), (Et = o)),
    (N = t?.kind === "vessel" ? t.v : null),
    (Fo = t && (t.kind === "berth" || t.kind === "vessel") ? t.i : null),
    (se.style.cursor = t ? "pointer" : ""));
  const n = t && Hn[t.kind] ? Hn[t.kind](t) : "";
  n
    ? ((et.textContent = n),
      (et.style.left = e.clientX + "px"),
      (et.style.top = e.clientY + "px"),
      et.classList.add("on"))
    : et.classList.remove("on");
}
(se.addEventListener("contextmenu", (e) => e.preventDefault()),
  se.addEventListener("pointerleave", () => {
    (Et?.over(!1),
      (Et = null),
      (N = null),
      (Fo = null),
      et.classList.remove("on"),
      (se.style.cursor = ""));
  }),
  se.addEventListener("pointerdown", (e) => {
    Ge();
    try {
      se.setPointerCapture(e.pointerId);
    } catch {}
    (et.classList.remove("on"),
      Ze.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (dt = null),
      (Oo = e.button === 0 && !e.shiftKey && Ze.size === 1 ? Go(e) : null),
      (Me =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null));
  }),
  se.addEventListener("pointermove", (e) => {
    const t = Ze.get(e.pointerId);
    if (!t) {
      Ms(e);
      return;
    }
    const o = e.clientX - t[0],
      n = e.clientY - t[1];
    if (
      ((t[0] = e.clientX),
      (t[1] = e.clientY),
      Me && Math.hypot(e.clientX - Me[0], e.clientY - Me[1]) > 6 && (Me = null),
      !Me)
    ) {
      if (((ae = !0), Ze.size === 2)) {
        const [a, r] = [...Ze.values()],
          i = Math.hypot(a[0] - r[0], a[1] - r[1]),
          f = [(a[0] + r[0]) / 2, (a[1] + r[1]) / 2];
        (ho && (de = E((de * ho) / i, 0.25, 2.2)),
          (ho = i),
          dt && Uo(f[0] - dt[0], f[1] - dt[1]),
          (dt = f));
        return;
      }
      t[2]
        ? Uo(o, n)
        : ((C.yaw -= o * 0.004),
          (C.pitch = E(C.pitch + n * 0.003, -0.02, 1.35)));
    }
  }));
const $n = (e) => {
  (Me && Ze.size === 1 && performance.now() - Me[2] < 450 && ys(Oo),
    (Me = null),
    (Oo = null),
    Ze.delete(e.pointerId),
    (ho = 0),
    (dt = null));
};
(se.addEventListener("pointerup", $n),
  se.addEventListener("pointercancel", (e) => {
    ((Me = null), $n(e));
  }),
  se.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        Ge(),
        (ae = !0),
        (de = E(
          de * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.25,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const pt = new Set();
(addEventListener("keyup", (e) => pt.delete(e.key.toLowerCase())),
  addEventListener("blur", () => pt.clear()));
const Ss = new s.Vector3();
function Cs() {
  if (!pt.size) return;
  const e = (pt.has("shift") ? 2.4 : 1) * Bo,
    t = (...a) => a.some((r) => pt.has(r));
  let o = 0,
    n = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (n += 1),
    t("s", "arrowdown") && (n -= 1),
    (o || n) &&
      (Uo(o * e * 420, 0),
      C.t.addScaledVector(
        Ss.set(-Math.sin(C.yaw), 0, -Math.cos(C.yaw)),
        n * e * 6,
      )),
    t("q") && (C.yaw += e * 1.1),
    t("e") && (C.yaw -= e * 1.1),
    t("=", "+") && (de = E(de * Math.exp(-e * 1.3), 0.25, 2.2)),
    t("-", "_") && (de = E(de * Math.exp(e * 1.3), 0.25, 2.2)),
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
    ) && (ae = !0));
}
let mt = !0,
  Bt = -99,
  po = -1,
  j = null,
  Pt = 0;
const mo = (e) => () => No(e),
  Wn = (e) => () => Qe(e),
  fr = () => Math.max(0, A.indexOf(We)),
  Rs = () =>
    Math.max(
      0,
      A.findIndex((e) => e.cats.includes("coding") && e !== We),
    ),
  Ts = () => A.length - 1,
  Vo = [
    {
      ...Ae.lab,
      dy: 0.003,
      hold: 14,
      beats: [
        [0, mo(0)],
        [6, mo(1)],
        [9.6, mo(2)],
        [12.6, mo(0)],
      ],
    },
    {
      ...Ae.water,
      dy: -0.01,
      hold: 9,
      beats: [
        [0.6, () => Qe(Rs())],
        [8.6, Wn(null)],
      ],
    },
    {
      t: [xe(2) + 0.2, 1.6, M - 0.6],
      yaw: -0.9,
      pitch: 0.32,
      dist: 5.2,
      dy: 0.01,
      f: [xe(2), 1.5, M - 0.4],
      r: 1.8,
      hold: 7,
      beats: [],
    },
    {
      t: [xe(6), 1.25, M + 1.5],
      yaw: -0.4,
      pitch: 0.22,
      dist: 6.4,
      dy: -0.012,
      f: [xe(6), 1.2, M + 1.5],
      r: 2.2,
      hold: 8,
      beats: [
        [0.6, () => Qe(Ts())],
        [7.6, Wn(null)],
      ],
    },
  ];
function qn(e, t) {
  ((po = e), (j = Vo[e]), (Pt = 0));
  const o = be && b.aspect < 0.8 && e === 0 ? { ...j, ...In } : j;
  (ht(o), (Bt = t));
}
function Ls(e) {
  (e < Bt - 1 && (Bt = e),
    (!j || e - Bt > j.hold) && qn((po + 1) % Vo.length, e));
  const t = e - Bt;
  if (!(t < 0)) {
    for (; Pt < j.beats.length && t >= j.beats[Pt][0];)
      (j.beats[Pt][1](), Pt++);
    ae ||
      ((C.yaw = j.yaw + t * j.dy),
      (C.dist = j.dist * (1 - t * 0.006)),
      nt.set(...j.f),
      (uo = j.r));
  }
}
function tt(e) {
  ((mt = e),
    S("#cine").classList.toggle("on", e),
    S("#cine").setAttribute("aria-pressed", e),
    e && ((j = null), (po = -1), (ae = !1), (de = 1)));
}
let Ho = null;
const Ge = () => {
  ((Ho = null), mt && tt(!1));
};
function $o() {
  (tt(!1), ht(Ae[Xe]));
}
function ks(e) {
  const t = ae ? 0 : Math.sin(e / 8) * 0.02,
    o = C.dist * de * Do,
    n = C.yaw + t,
    a = Math.asin(E((O + 0.06 - C.t.y) / Math.max(o, 0.1), -1, 1)),
    r = Math.max(C.pitch, a),
    i = Math.cos(r);
  if (
    (b.position.set(
      C.t.x + Math.sin(n) * i * o,
      C.t.y + Math.sin(r) * o,
      C.t.z + Math.cos(n) * i * o,
    ),
    b.lookAt(C.t),
    !mt && !ae)
  ) {
    const c = Ho || Ae[Xe];
    (nt.set(...c.f), (uo = c.r));
  }
  const f = b.position.distanceTo(ae ? C.t : nt),
    u = ae ? Math.min(1, Bo * 5) : 1,
    l = (ae ? Math.max(2.2, f * 0.3) : uo) * g.focalBand;
  ((ne.u.focus.value += (f - ne.u.focus.value) * u),
    (ne.u.range.value += (l - ne.u.range.value) * u),
    ne.u.cocScale.value.set(g.apertureNear, g.aperture));
}
const jn = [...document.querySelectorAll("#seg-mode button")],
  Yn = [...document.querySelectorAll("#chips button")];
(jn.forEach(
  (e) =>
    (e.onclick = () => {
      (Ge(), No(+e.dataset.m));
    }),
),
  Yn.forEach(
    (e) =>
      (e.onclick = () => {
        (Ge(), bs(e.dataset.c));
      }),
  ));
let Kn = 0;
const Xn = (e) => (e < 2 ? e.toFixed(1) : Math.round(e)) + "x";
function _s() {
  const [e, t] = Sn(A),
    o = Ct(e.name),
    n = Ct(t.name),
    a = e.cats.includes("roleplay")
      ? "A roleplay chat"
      : e.cats.includes("creative")
        ? "A creative app"
        : "A chat app",
    r =
      t.cats.includes("coding") || !t.cats.length
        ? "a coding agent"
        : "an agent";
  if (_e === 0) {
    const i = Math.ceil(io / Rt(e)),
      f = Math.ceil(io / Rt(t));
    return `Same freight at every berth: <b>${o}</b> needs <b>${i}</b> trips to carry it, <b>${n}</b> <span class="a">${f}</span>. ${a} carries the story so far; ${r} carries the whole project, every turn.`;
  }
  return _e === 1
    ? `One vessel for every <b>${Tt(Ao)}</b> requests this week. <b>${o}</b> and <b>${n}</b> send about as many, but each of ${n}'s carries <span class="a">${Xn(P(t) / P(e))}</span> the tokens.`
    : `One request each, side by side: from <b>${st(Math.min(...A.map(P)))}</b> tokens in a tug to <span class="a">${st(Math.max(...A.map(P)))}</span> in the biggest hull.`;
}
function vt(e) {
  if (!e && Ie - Kn < 0.1) return;
  Kn = Ie;
  const [t, o] = Sn(A);
  ((S("#s-req").innerHTML = `${Tt(t.r)} <span>vs</span> ${Tt(o.r)}`),
    (S("#s-each").innerHTML = `${st(P(t))} <span>vs</span> ${st(P(o))}`),
    (S("#s-x").textContent = Xn(P(o) / P(t))),
    jn.forEach((a, r) => {
      (a.classList.toggle("on", r === _e),
        a.setAttribute("aria-pressed", r === _e));
    }),
    Yn.forEach((a) => {
      const r = H
        ? a.dataset.c === H
        : a.dataset.c === "coding" || a.dataset.c === "roleplay";
      (a.classList.toggle("on", r), a.setAttribute("aria-pressed", r));
    }));
  const n = _s();
  n !== vt.w && ((S("#why").innerHTML = n), (vt.w = n));
}
{
  const e = me.asOf ? Kt(me.asOf.slice(0, 10)) : "";
  ((S("#src").innerHTML =
    `Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}`),
    (S("#info-src").innerHTML =
      `Apps: OpenRouter's top apps by token usage, ${Kt(me.week[0])} to ${Kt(me.week[1])}, with their marketplace categories. Fee: OpenRouter's cost per session by harness and model, the median over the 30 days to ${Kt(me.feeWindow[1])}, compared across the models in that week's daily top 50. CC BY 4.0. Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}.`));
}
const Be = [
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
let he = 0,
  Zn = 0,
  Wo = 0,
  qo = 0,
  vo = 0;
function pe() {
  (L.setPixelRatio(g.pixelRatio),
    oe.setPixelRatio(g.pixelRatio),
    Mt.rt.samples !== g.msaa && ((Mt.rt.samples = g.msaa), Mt.rt.dispose()),
    (hn.enabled = !!g.smaa),
    B.shadow.mapSize.x !== g.shadow &&
      (B.shadow.mapSize.set(g.shadow, g.shadow),
      B.shadow.map?.dispose(),
      (B.shadow.map = null)),
    (Te.enabled = !!g.bloom),
    (Te.radius = g.bloomRadius),
    (F.enabled = !0),
    F.updateGtaoMaterial({
      radius: g.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: g.ao ? g.aoSamples : 2,
    }),
    (ne.enabled = !!g.dof),
    (ne.u.maxCoc.value = g.maxCoc),
    Ps(),
    ta());
}
function Pe() {
  ((S("#tune-rows").innerHTML = Be.map(([e, t, o, n, , a, r], i) => {
    const f = g[e],
      u = ((f - o) / (n - o)) * 100;
    return `<div class="tr${i === he ? " sel" : ""}${r ? " sub" : ""}" data-i="${i}"><b>${t}</b><span class="tk"><i style="left:${E(u, 0, 100)}%"></i></span><u>${a(f)}</u></div>`;
  }).join("")),
    S("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((he = +e.dataset.i), Pe());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (he = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const n = (a) => {
            const r = t.getBoundingClientRect(),
              [i, , f, u, l] = Be[he],
              c = E(
                Math.round(
                  (f + ((a.clientX - r.left) / r.width) * (u - f)) / l,
                ) * l,
                f,
                u,
              );
            c !== g[i] &&
              ((g[i] = +c.toFixed(4)), i !== "auto" && (g.auto = 0), pe());
            const d = t.querySelector("i");
            ((d.style.left = E(((g[i] - f) / (u - f)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = Be[he][5](g[i])),
              (S("#tune-json").value = JSON.stringify(g)));
          };
          (n(o),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && n(a);
            }),
            (t.onpointerup = () => Pe()));
        };
      }),
    (S("#tune-json").value = JSON.stringify(g)));
}
function As(e, t) {
  const [o, , n, a, r] = Be[he],
    i = E(+(g[o] + e * r * (t ? 5 : 1)).toFixed(4), n, a);
  i !== g[o] && ((g[o] = i), o !== "auto" && (g.auto = 0), pe(), Pe());
}
function Jn(e) {
  const t = S("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && Pe());
}
function Es(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (he = (he + (t === "ArrowUp" ? -1 : 1) + Be.length) % Be.length),
      Pe(),
      S("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (As(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , n, a, r] = Be[he];
    return a - n === r
      ? ((g[o] = g[o] ? 0 : 1), o !== "auto" && (g.auto = 0), pe(), Pe(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(g, So) : (g[Be[he][0]] = So[Be[he][0]]),
      (g.auto = 0),
      pe(),
      Pe(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(g, null, 1)), !0)
      : t === "Escape"
        ? (Jn(!1), !0)
        : !1;
}
S("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in So) typeof t[o] == "number" && (g[o] = t[o]);
    ((g.auto = 0), pe(), Pe());
  } catch {
    Pe();
  }
});
const go = S("#ui-hint");
let Qn = -9;
function Ft(e) {
  ((go.textContent = e), go.classList.add("on"), (Qn = Ie));
}
const jo = ["lab", "water"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Jn());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    S("#info").open
  )
    return;
  if (!S("#tune").hidden && Es(e)) {
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
    (t.startsWith("arrow") && e.preventDefault(),
      t !== "shift" && Ge(),
      pt.add(t));
    return;
  }
  if (t >= "1" && t <= "3") (Ge(), No(+t - 1), Ft("Size by: " + ls[+t - 1]));
  else if (t === "[" || t === "]") {
    Ge();
    const o = [null, "coding", "roleplay", "productivity", "creative"],
      n = (o.indexOf(H) + (t === "[" ? o.length - 1 : 1)) % o.length;
    ((H = o[n]),
      (A = H ? To(H) : Xt()),
      Q.sel != null && Q.sel >= A.length && (Q.sel = null),
      ut(!1),
      Ft(H ? H[0].toUpperCase() + H.slice(1) : "The comparison"));
  } else
    t === "v"
      ? (Ge(),
        (Xe = jo[(jo.indexOf(Xe) + 1) % jo.length]),
        ht(Ae[Xe]),
        Ft(Xe === "lab" ? "Harbour" : "Waterline"))
      : t === "c"
        ? S("#cine").click()
        : t === "r"
          ? $o()
          : t === "escape"
            ? Qe(null)
            : t === "n"
              ? ((At = !At), Ft(At ? "Labels on" : "Labels off"))
              : t === "/" &&
                (e.preventDefault(),
                en.classList.toggle("ui-off"),
                Ft(
                  en.classList.contains("ui-off")
                    ? "Interface hidden \xB7 / to show"
                    : "Interface shown",
                ));
}),
  (S("#cine").onclick = () => {
    mt ? $o() : tt(!0);
  }),
  se.addEventListener("dblclick", (e) => {
    Go(e) || $o();
  }),
  (S("#how").onclick = () => S("#info").showModal()),
  (S("#close").onclick = () => S("#info").close()),
  S("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    S("#tune").hidden || (S("#tune-fps").textContent = Math.round(Zn) + " fps");
  }, 500));
const Bs = {
  bg: "#0d1119",
  fog: "#151b28",
  fogD: 0.0035,
  exp: 1,
  envI: 0.42,
  bloomT: 1.1,
  bloomS: 0.38,
  refl: 0.85,
  hemi: [10137308, 4864554, 0.36],
  sun: [16761482, 0.95],
  sunDir: [-0.5, 0.7, 0.5],
  rim: 0.8,
  key2: 0.26,
};
function Ps() {
  const e = Bs;
  (z.background.set(e.bg),
    z.fog.color.set(e.fog),
    (z.fog.density = e.fogD * g.fog),
    (L.toneMapping = s.ACESFilmicToneMapping),
    (L.toneMappingExposure = g.exposure * e.exp),
    (z.environment = wo.show),
    (z.environmentIntensity = g.env * e.envI),
    (Te.threshold = g.bloomThreshold * e.bloomT),
    (Te.strength = g.bloomStrength * e.bloomS),
    (wt.uReflStrength.value = g.reflect * e.refl),
    Gt.color.set(e.hemi[0]),
    Gt.groundColor.set(e.hemi[1]),
    (Gt.intensity = e.hemi[2] * g.fill),
    B.color.set(e.sun[0]),
    (B.intensity = e.sun[1] * g.sun),
    B.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    B.target.position.set(0, 1, 0),
    (gt.intensity = e.rim * g.rim),
    (Nt.intensity = e.key2 * g.fill),
    (an.value = g.sat));
}
(gt.position.set(3, 24, -11),
  gt.color.set(10274559),
  Nt.position.set(-10, 14, 12),
  Object.assign(B.shadow.camera, {
    left: -13,
    right: 13,
    top: 11,
    bottom: -9,
    near: 1,
    far: 70,
  }),
  B.shadow.camera.updateProjectionMatrix());
function ea() {
  const e = Se.clientWidth,
    t = Se.clientHeight;
  be = e < 900;
  const o = g.fov + (be ? 8 : 0);
  (b.fov !== o && ((b.fov = o), b.updateProjectionMatrix()),
    b.setViewOffset(
      e,
      t,
      be ? 0 : -e * 0.015,
      be ? t * 0.06 : -t * 0.035,
      e,
      t,
    ));
  const n = 2 * Math.tan(s.MathUtils.degToRad(b.fov / 2));
  Do =
    b.aspect < 0.8
      ? E(0.62 / Math.max(b.aspect, 0.4), 1, 1.5)
      : E(Math.max(zo[0] / (n * b.aspect), zo[1] / n) / Gn, 0.85, 2.2);
}
function ta() {
  const e = Se.clientWidth,
    t = Se.clientHeight;
  ((b.aspect = e / t),
    b.updateProjectionMatrix(),
    L.setSize(e, t),
    oe.setSize(e, t));
  const o = L.getDrawingBufferSize(new s.Vector2());
  (yo.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    dn.uRes.value.copy(o),
    ea(),
    b.updateProjectionMatrix());
}
addEventListener("resize", ta);
let oa = performance.now(),
  Yo = 0,
  Ko = 0,
  na = 0;
function Xo(e) {
  ((fo = Math.max(0, (e - oa) / 1e3)),
    (Po = Math.min(1.5, fo)),
    (Bo = Math.min(0.1, Po)),
    (oa = e));
  const t = e / 1e3;
  if (
    ((Ie = t),
    mt && Ls(t),
    Cs(),
    (Ln.uTime.value = t),
    us(fo, t),
    ds(t),
    ks(t),
    b.updateMatrixWorld(),
    qa(),
    (L.shadowMap.needsUpdate = !0),
    xs(t),
    vt(),
    go.classList.contains("on") && Ie - Qn > 1.5 && go.classList.remove("on"),
    (Yo += Po),
    Ko++,
    e - na > 1600)
  ) {
    const o = Ko / Math.max(Yo, 0.001);
    ((Yo = 0),
      (Ko = 0),
      (na = e),
      (Zn = o),
      qo++,
      qo > 2 && (Wo = Math.max(Wo, o)),
      (vo = qo > 3 && o < Wo * 0.74 ? vo + 1 : 0),
      !document.hidden &&
        g.auto &&
        vo >= 2 &&
        o < 50 &&
        ((vo = 0),
        g.pixelRatio > 1
          ? ((g.pixelRatio = Math.max(1, +(g.pixelRatio - 0.25).toFixed(2))),
            pe())
          : g.reflect
            ? ((g.reflect = 0), pe())
            : g.msaa > 0
              ? ((g.msaa = 0), pe())
              : g.ao && ((g.ao = 0), pe())));
  }
  (Sa(), L.info.reset(), oe.render());
}
let aa = !0;
function sa(e) {
  (requestAnimationFrame(sa), aa && Xo(e));
}
(ut(!0),
  pe(),
  ht(Ae.lab),
  tt(!0),
  S("#loading").remove(),
  vt(!0),
  requestAnimationFrame(sa),
  (window.__step = (e) => Xo(e)),
  (window.__loop = (e) => {
    aa = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = L.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = e),
      (n.height = Math.round((e * o.height) / o.width)),
      n.getContext("2d").drawImage(o, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    Xo(o ?? performance.now());
    const n = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + nn + "/_shots/" + e + ".webp",
        { method: "POST", body: n },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (tt(!1), (Ho = e), e && ht({ fit: null, ...e }));
    },
    view: (e) => {
      (tt(!1), (Xe = e), ht(Ae[e]));
    },
    cut: (e) => {
      (tt(!0), qn(e, Ie));
    },
    mode: (e) => {
      ((_e = e), ut(!0));
      for (const t of $) t.p = t.leave ? 0 : 1;
    },
    cat: (e) => {
      ((H = e), (A = e ? To(e) : Xt()), ut(!0));
      for (const t of $) t.p = t.leave ? 0 : 1;
    },
    select: (e) => Qe(e),
    tags: (e) => {
      At = !!e;
    },
    tune: (e) => (Object.assign(g, e), pe(), { ...g }),
    ST: Q,
    HERO: Ae,
    SHOTS: Vo,
    VESS: $,
    BERTHS: () => A,
    DATA: me,
  }),
  (window.__x = {
    dof: ne,
    gtao: F,
    bloom: Te,
    renderer: L,
    camera: b,
    scene: z,
    composer: oe,
    cam: C,
    RT: g,
    overlay: Wt,
    rays: Co,
    CONT: Ye,
  }),
  (window.__dbg = () => ({
    t: +Ie.toFixed(2),
    shot: po,
    cine: mt,
    mode: _e,
    cat: H,
    vessels: $.length,
    containers: Ye.count,
    sel: Q.sel,
    fit: +Do.toFixed(3),
    focus: +ne.u.focus.value.toFixed(2),
    range: +ne.u.range.value.toFixed(2),
    calls: L.info.render.calls,
    tris: L.info.render.triangles,
  })));
