import * as i from "three";
import { EffectComposer as Gn } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as So,
  FullScreenQuad as Bt,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as va } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as In } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as Wn } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as $n } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as Nn } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as ga } from "three/addons/utils/BufferGeometryUtils.js";
const b = (e) => document.querySelector(e),
  xe = b("#world"),
  ko = b("#app"),
  k = (e, t, o) => (e < t ? t : e > o ? o : e),
  Re = (e, t, o) => e + (t - e) * o,
  W = (e, t, o) => {
    const a = k((o - e) / (t - e), 0, 1);
    return a * a * (3 - 2 * a);
  },
  kr = (e) => 1 - (1 - e) ** 3,
  Cr = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function be(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const Tr = be(7),
  Ar = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Hn = "https://x.com/ryansael",
  ya = "token-delta",
  U = new i.Scene();
((U.background = new i.Color("#10151f")),
  (U.fog = new i.FogExp2("#1a2130", 0.0065)));
const M = new i.PerspectiveCamera(30, 1, 0.3, 320);
let A;
try {
  A = new i.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (b("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const jn = 25e5,
  Zn = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return k(Math.min(devicePixelRatio, 2, Math.sqrt(jn / (e * t))), 1, 2);
  },
  zt = Zn();
(A.setPixelRatio(zt),
  (A.info.autoReset = !1),
  (A.shadowMap.enabled = !0),
  (A.shadowMap.type = i.PCFShadowMap),
  (A.shadowMap.autoUpdate = !1),
  (A.transmissionResolutionScale = 0.6),
  (A.toneMapping = i.ACESFilmicToneMapping),
  xe.appendChild(A.domElement));
const Gt = new i.HemisphereLight(9414360, 3813414, 0.5);
U.add(Gt);
const E = new i.DirectionalLight(16763279, 2.1);
((E.castShadow = !0),
  E.shadow.mapSize.set(2048, 2048),
  Object.assign(E.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (E.shadow.normalBias = 0.03),
  (E.shadow.bias = -4e-4),
  (E.shadow.radius = 2),
  U.add(E, E.target));
const qn = new i.Vector3(0.62, 0.62, 0.48).normalize();
(E.position.copy(qn).multiplyScalar(30), E.target.position.set(0, 2, 0));
const gt = new i.DirectionalLight(9427199, 0.9);
(gt.position.set(-6, 9, -14), U.add(gt));
const It = new i.DirectionalLight(16773600, 0.55);
(It.position.set(-8, 12, 10), U.add(It));
const Co = new i.Group();
U.add(Co);
const De = 10,
  tt = {
    pos: {
      value: Array.from({ length: De }, () => new i.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: De }, () => new i.Vector3()) },
  },
  Kn = `uniform vec4 uFakePos[${De}];uniform vec3 uFakeCol[${De}];uniform float uSat;`,
  Xn = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${De};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  Yn = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  xa = { value: 1.16 };
function fe(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: tt.pos,
        uFakeCol: tt.col,
        uSat: xa,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + Kn,
          )
          .replace("#include <lights_fragment_end>", Xn)
          .replace("#include <opaque_fragment>", Yn)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => ya + (t ? t.key : "")),
    e
  );
}
const ba = [];
function ot(e, t, o, a, n, s) {
  const r = { p: new i.Vector3(e, t, o), c: new i.Color(a), r: n, i: s, i0: s };
  return (ba.push(r), r);
}
const Wt = new i.Vector3(),
  q = [],
  at = new i.Vector3(0, 3, 0);
function Jn(e) {
  q.length = 0;
  for (const t of ba)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        q.length < De)
      )
        (q.push(t), q.length === De && q.sort((o, a) => o.score - a.score));
      else if (t.score > q[0].score) {
        q[0] = t;
        for (let o = 0; o < De - 1 && q[o].score > q[o + 1].score; o++) {
          const a = q[o];
          ((q[o] = q[o + 1]), (q[o + 1] = a));
        }
      }
    }
}
function Ma(e, t) {
  Jn(t);
  for (let o = 0; o < De; o++) {
    const a = q[o];
    if (!a) {
      (tt.col.value[o].set(0, 0, 0), tt.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (Wt.copy(a.p).applyMatrix4(e.matrixWorldInverse),
      tt.pos.value[o].set(Wt.x, Wt.y, Wt.z, 1 / (a.r * a.r)),
      tt.col.value[o].set(a.c.r * a.i, a.c.g * a.i, a.c.b * a.i));
  }
}
const To = {};
{
  const e = new i.PMREMGenerator(A),
    t = new i.Scene();
  t.add(
    new i.Mesh(
      new i.SphereGeometry(50, 48, 24),
      new i.ShaderMaterial({
        side: i.BackSide,
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
  const o = (a, n, s, r, l, c) => {
    const f = new i.Mesh(
      new i.BoxGeometry(a, n, 0.4),
      new i.MeshBasicMaterial({ color: new i.Color(...s) }),
    );
    (f.position.set(r, l, c), f.lookAt(0, 0, 0), t.add(f));
  };
  (o(14, 2.2, [3.2, 2.6, 2.1], -6, 18, 22),
    o(10, 2, [1.6, 2.4, 3.4], 18, 14, -10),
    o(30, 1, [3.6, 2.2, 1.1], 0, -4, -30),
    o(8, 3, [2.4, 1.7, 1.1], -28, 6, 4),
    (To.show = e.fromScene(t, 0.03).texture),
    e.dispose());
}
((U.environment = To.show), (U.environmentIntensity = 0.55));
const Sa = 0,
  Ao = new i.WebGLRenderTarget(1, 1, {
    type: i.HalfFloatType,
    generateMipmaps: !0,
    minFilter: i.LinearMipmapLinearFilter,
  }),
  $t = {
    tReflect: { value: Ao.texture },
    uReflMatrix: { value: new i.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  Qn = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, $t),
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
   vec3 mir=texture2D(tReflect,vReflCoord.xy/max(vReflCoord.w,1e-4),.5).rgb;outgoingLight=mix(outgoingLight,mir,uReflStrength*gl*(.25+.75*pow(max(1.-facing,0.),2.)));}
  outgoingLight=max(mix(`,
          )));
    },
    { key: "refl" },
  ),
  ne = new i.PerspectiveCamera(),
  Nt = new i.Vector3(0, 1, 0),
  yt = new i.Vector3(0, Sa, 0),
  Ro = new i.Vector3(),
  Ht = new i.Vector3(),
  Do = new i.Matrix4(),
  xt = new i.Plane(),
  Pe = new i.Vector4(),
  ka = new i.Vector4(),
  ue = [];
function es() {
  if (
    !w.reflect ||
    $t.uReflStrength.value <= 0 ||
    M.position.y <= Sa ||
    !E.shadow.map
  )
    return;
  (Ro.setFromMatrixPosition(M.matrixWorld),
    Do.extractRotation(M.matrixWorld),
    ne.position.subVectors(yt, Ro).reflect(Nt).negate().add(yt),
    Ht.set(0, 0, -1).applyMatrix4(Do).add(Ro),
    Ht.subVectors(yt, Ht).reflect(Nt).negate().add(yt),
    ne.up.set(0, 1, 0).applyMatrix4(Do).reflect(Nt),
    ne.lookAt(Ht),
    (ne.far = M.far),
    ne.updateMatrixWorld(),
    ne.projectionMatrix.copy(M.projectionMatrix),
    $t.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(ne.projectionMatrix)
      .multiply(ne.matrixWorldInverse),
    xt
      .setFromNormalAndCoplanarPoint(Nt, yt)
      .applyMatrix4(ne.matrixWorldInverse),
    Pe.set(xt.normal.x, xt.normal.y, xt.normal.z, xt.constant));
  const e = ne.projectionMatrix.elements;
  (ka.set(
    (Math.sign(Pe.x) + e[8]) / e[0],
    (Math.sign(Pe.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    Pe.multiplyScalar(2 / Pe.dot(ka)),
    (e[2] = Pe.x),
    (e[6] = Pe.y),
    (e[10] = Pe.z + 1),
    (e[14] = Pe.w));
  const t = ue.map((a) => a.visible),
    o = A.shadowMap.needsUpdate;
  (ue.forEach((a) => (a.visible = !1)),
    Ca.forEach((a) => (a.visible = !0)),
    (A.shadowMap.needsUpdate = !1),
    Ma(ne, at),
    A.setRenderTarget(Ao),
    A.clear(),
    A.render(U, ne),
    A.setRenderTarget(null),
    ue.forEach((a, n) => (a.visible = t[n])),
    Ca.forEach((a) => (a.visible = !1)),
    (A.shadowMap.needsUpdate = o));
}
const Ca = [],
  ts =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  jt = (e, t) =>
    new i.ShaderMaterial({
      uniforms: t,
      vertexShader: ts,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class os extends So {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new i.WebGLRenderTarget(1, 1, {
        type: i.HalfFloatType,
        samples: t,
        depthTexture: new i.DepthTexture(1, 1),
      })),
      (this.quad = new Bt(
        jt(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, a) {
    (Ma(M, at),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(U, M),
      t.setRenderTarget(a),
      this.quad.render(t));
  }
}
const Ta = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class as extends So {
  constructor() {
    super();
    const t = { type: i.HalfFloatType };
    ((this.half = new i.WebGLRenderTarget(1, 1, t)),
      (this.blurRT = new i.WebGLRenderTarget(1, 1, t)),
      (this.u = {
        tColor: { value: null },
        tDepth: { value: null },
        tHalf: { value: this.half.texture },
        tBlur: { value: this.blurRT.texture },
        near: { value: M.near },
        far: { value: M.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new i.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new i.Vector2() },
        fullTexel: { value: new i.Vector2() },
      }),
      (this.pre = new Bt(
        jt(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Ta}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Bt(
        jt(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=1.05/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Bt(
        jt(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${Ta}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   b.rgb=b.rgb*.4+(texture2D(tBlur,vUv+o*vec2(1.5,.6)).rgb+texture2D(tBlur,vUv-o*vec2(1.5,.6)).rgb+texture2D(tBlur,vUv+o*vec2(-.6,1.5)).rgb+texture2D(tBlur,vUv-o*vec2(-.6,1.5)).rgb)*.15;   // a soft tent over the gather: no grain in the bokeh
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(t, o) {
    const a = Math.ceil(t / 2),
      n = Math.ceil(o / 2);
    (this.half.setSize(a, n),
      this.blurRT.setSize(a, n),
      this.u.texel.value.set(1 / a, 1 / n),
      this.u.fullTexel.value.set(1 / t, 1 / o));
  }
  render(t, o, a) {
    ((this.u.tColor.value = a.texture),
      t.setRenderTarget(this.half),
      this.pre.render(t),
      t.setRenderTarget(this.blurRT),
      this.blur.render(t),
      t.setRenderTarget(this.renderToScreen ? null : o),
      this.comp.render(t));
  }
}
const w = {
    auto: 1,
    pixelRatio: zt,
    msaa: zt >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 2048,
    exposure: 1,
    fov: 30,
    sun: 1,
    fill: 1,
    rim: 1,
    fog: 1,
    sat: 1.36,
    env: 1,
    reflect: 1,
    bloom: 1,
    bloomStrength: 1,
    bloomRadius: 0.4,
    bloomThreshold: 1,
    ao: 1,
    aoIntensity: 1,
    aoRadius: 0.9,
    aoSamples: 12,
    dof: 1,
    focalBand: 1,
    aperture: 0.42,
    apertureNear: 0.9,
    maxCoc: 5.5,
  },
  Po = { ...w },
  se = new Gn(
    A,
    new i.WebGLRenderTarget(1, 1, { type: i.HalfFloatType, depthBuffer: !1 }),
  );
se.setPixelRatio(zt);
const bt = new os(w.msaa);
se.addPass(bt);
const V = new va(U, M, 1, 1);
((V.output = va.OUTPUT.Off),
  (V.needsSwap = !1),
  V.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  V.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const ns = V.setSize.bind(V),
  ss = V.render.bind(V);
V.setSize = (e, t) => ns(Math.ceil(e / 2), Math.ceil(t / 2));
const je = [],
  Aa = [];
((V.render = (e, t, o) => {
  (je.forEach((a, n) => {
    ((Aa[n] = a.visible), (a.visible = !1));
  }),
    ss(e, t, o),
    je.forEach((a, n) => (a.visible = Aa[n])),
    (V.blendMaterial.uniforms.intensity.value = w.ao ? w.aoIntensity : 0),
    (V.blendMaterial.uniforms.tDiffuse.value = V.pdRenderTarget.texture),
    V._renderPass(e, V.blendMaterial, o));
}),
  se.addPass(V));
const Fe = new In(new i.Vector2(256, 256), 0.42, 0.55, 1.05),
  rs = Fe.setSize.bind(Fe);
((Fe.setSize = (e, t) => rs(Math.ceil(e / 2), Math.ceil(t / 2))),
  se.addPass(Fe));
const re = new as();
((re.u.tDepth.value = bt.rt.depthTexture), se.addPass(re));
const Zt = new i.Scene(),
  Ra = {
    tSceneDepth: { value: V.depthTexture },
    uRes: { value: new i.Vector2(1, 1) },
    uNF: { value: new i.Vector2(M.near, M.far) },
  };
class is extends So {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, a) {
    const n = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(a),
      t.render(Zt, M),
      (t.autoClear = n));
  }
}
(se.addPass(new is()), se.addPass(new Wn()));
const Da = new $n();
se.addPass(Da);
const ls = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  Pa = (e, t, o, a = 0.06, n = 2) =>
    new Nn(e, t, o, n, Math.min(a, Math.min(e, t, o) / 2.02)),
  Le = new Map();
function K(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    Le.has(o) ||
      Le.set(
        o,
        fe(
          new i.MeshStandardMaterial({
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
function Rr(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    Le.has(o) ||
      Le.set(
        o,
        fe(
          new i.MeshPhysicalMaterial({
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
function de(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    Le.has(o) ||
      Le.set(
        o,
        fe(
          new i.MeshPhysicalMaterial({
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
const qt = (e, t = 1) =>
    new i.MeshBasicMaterial({
      color: new i.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  Dr = (e = {}) =>
    new i.MeshPhysicalMaterial({
      color: "#e6fbff",
      roughness: 0.05,
      metalness: 0,
      transmission: 0.95,
      thickness: 0.12,
      ior: 1.45,
      envMapIntensity: 1.3,
      ...e,
    }),
  Pr = de("#434a55", { roughness: 0.36 }),
  Fr = de("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Lr = de("#15171b", { roughness: 0.46, metalness: 0.55 }),
  _r = de("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  Er = de("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  Vr = K("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  Ur = de("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  Or = de("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  cs = new i.Matrix4(),
  Kt = new i.Quaternion(),
  Fa = new i.Euler(0, 0, 0, "YXZ"),
  La = new i.Vector3(1, 1, 1),
  Br = new i.Color(),
  zr = new i.Vector3(1, 0, 0),
  Fo = new i.Vector3(0, 1, 0),
  Gr = new i.Vector3(0, 0, 1),
  fs = new i.Vector3(),
  us = new i.Quaternion();
function We() {
  const e = new Map(),
    t = (o, a, n, s, r, l) => {
      a = a.index ? a.toNonIndexed() : a;
      for (const f of Object.keys(a.attributes))
        ["position", "normal", "uv"].includes(f) || a.deleteAttribute(f);
      (a.attributes.uv ||
        a.setAttribute(
          "uv",
          new i.Float32BufferAttribute(
            new Float32Array(a.attributes.position.count * 2),
            2,
          ),
        ),
        l.dir
          ? (Kt.setFromUnitVectors(
              Fo,
              fs.set(l.dir[0], l.dir[1], l.dir[2]).normalize(),
            ),
            l.roll && Kt.multiply(us.setFromAxisAngle(Fo, l.roll)))
          : (Fa.set(l.rx || 0, l.ry || 0, l.rz || 0), Kt.setFromEuler(Fa)),
        a.applyMatrix4(
          cs.compose(
            { x: n, y: s, z: r },
            Kt,
            l.s ? La.set(l.s[0], l.s[1], l.s[2]) : La.set(1, 1, 1),
          ),
        ));
      let c = e.get(o);
      (c || e.set(o, (c = { mat: o, list: [] })), c.list.push(a));
    };
  return {
    box(o, a, n, s, r, l, c, f = {}) {
      return (
        t(o, f.r ? Pa(r, l, c, f.r) : new i.BoxGeometry(r, l, c), a, n, s, f),
        this
      );
    },
    cyl(o, a, n, s, r, l, c, f = {}) {
      return (
        t(o, new i.CylinderGeometry(r, l, c, f.seg || 20), a, n, s, f),
        this
      );
    },
    cone(o, a, n, s, r, l, c = {}) {
      return (
        t(
          o,
          new i.ConeGeometry(r, l, c.seg || 6).translate(0, l / 2, 0),
          a,
          n,
          s,
          c,
        ),
        this
      );
    },
    sph(o, a, n, s, r, l = {}) {
      return (
        t(o, new i.SphereGeometry(r, l.seg || 14, l.seg2 || 10), a, n, s, l),
        this
      );
    },
    tor(o, a, n, s, r, l, c = {}) {
      return (
        t(o, new i.TorusGeometry(r, l, c.seg2 || 8, c.seg || 40), a, n, s, c),
        this
      );
    },
    geo(o, a, n = 0, s = 0, r = 0, l = {}) {
      return (t(o, a.clone(), n, s, r, l), this);
    },
    flush(o, a = !0) {
      const n = [];
      for (const { mat: s, list: r } of e.values()) {
        const l = new i.Mesh(ga(r), s);
        ((l.castShadow = a),
          (l.receiveShadow = !0),
          o.add(l),
          n.push(l),
          r.forEach((c) => c.dispose()));
      }
      return (e.clear(), n);
    },
  };
}
const Lo = [];
document.fonts?.ready.then(() => Lo.forEach((e) => e()));
function Xt(e, t, o, a, n, s = 0.9, r = {}) {
  const l = document.createElement("canvas");
  ((l.width = o), (l.height = a));
  const c = l.getContext("2d"),
    f = new i.CanvasTexture(l);
  ((f.anisotropy = 8), (f.colorSpace = i.SRGBColorSpace));
  const u = new i.Mesh(
    new i.PlaneGeometry(e, t),
    new i.MeshBasicMaterial({
      map: f,
      alphaTest: 0.3,
      fog: !1,
      side: i.DoubleSide,
      color: new i.Color(s, s, s),
      ...r,
    }),
  );
  return (
    (u.userData = {
      c: l,
      g: c,
      t: f,
      redraw(h) {
        (c.clearRect(0, 0, o, a), h(c, o, a), (f.needsUpdate = !0));
      },
    }),
    n && (u.userData.redraw(n), Lo.push(() => u.userData.redraw(n))),
    u
  );
}
const _a = (e, t, o, a, n, s) => {
    (e.beginPath(), e.roundRect(t, o, a, n, s));
  },
  nt = (e, t, o, a = !0) => {
    const n = document.createElement("canvas");
    ((n.width = e), (n.height = t), o(n.getContext("2d"), e, t));
    const s = new i.CanvasTexture(n);
    return (a && (s.colorSpace = i.SRGBColorSpace), (s.anisotropy = 8), s);
  },
  _o = nt(
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
  ds = (e, t, o = _o) =>
    new i.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: i.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function Eo(e, t = 0.3, o = 1, a = 0) {
  const n = new i.IcosahedronGeometry(e, a),
    s = n.attributes.position,
    r = be(o),
    l = new Map();
  for (let c = 0; c < s.count; c++) {
    const f =
      s.getX(c).toFixed(3) +
      "," +
      s.getY(c).toFixed(3) +
      "," +
      s.getZ(c).toFixed(3);
    l.has(f) ||
      l.set(f, [1 + (r() - 0.5) * t, 1 + (r() - 0.5) * t, 1 + (r() - 0.5) * t]);
    const u = l.get(f);
    s.setXYZ(c, s.getX(c) * u[0], s.getY(c) * u[1], s.getZ(c) * u[2]);
  }
  return (n.computeVertexNormals(), n);
}
function hs(e, t, o, a, n, s = 0, r = {}) {
  const l = new i.Group(),
    c = We(),
    f = be(Math.floor(t * 31 + a * 17 + 99));
  c.cyl(K("#5a3f2c"), 0, 0.5 * n, 0, 0.07 * n, 0.1 * n, 1 * n, { seg: 6 });
  const u = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((h) =>
    new i.Color(h).offsetHSL(s, 0, 0).getStyle(),
  );
  for (let h = 0; h < (r.n || 5); h++)
    c.geo(
      K(u[h % 4], { flatShading: !0, roughness: 0.8 }),
      Eo(0.42 * n * (0.75 + f() * 0.5), 0.3, h + t * 7 + a * 3),
      (f() - 0.5) * 0.6 * n,
      (1.15 + f() * 0.7) * n,
      (f() - 0.5) * 0.6 * n,
    );
  return (c.flush(l), l.position.set(t, o, a), e.add(l), l);
}
const ps = nt(
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
function Ir(e, t, o, a, n, s, r = 0.5) {
  const l = new i.Mesh(
    new i.PlaneGeometry(n, s),
    new i.MeshBasicMaterial({
      map: ps,
      transparent: !0,
      opacity: r,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (l.rotation.x = -Math.PI / 2),
    l.position.set(t, o + 0.004, a),
    (l.renderOrder = -1),
    e.add(l),
    je.push(l),
    l
  );
}
class ms {
  constructor(t) {
    this.max = t;
    const o = new i.BufferGeometry();
    ((this.pos = new Float32Array(t * 12)),
      (this.side = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 16)));
    const a = new Uint32Array(t * 6);
    for (let n = 0; n < t; n++) {
      const s = n * 4;
      a.set([s, s + 1, s + 2, s + 1, s + 3, s + 2], n * 6);
    }
    (o.setAttribute(
      "position",
      new i.BufferAttribute(this.pos, 3).setUsage(i.DynamicDrawUsage),
    ),
      o.setAttribute(
        "aSide",
        new i.BufferAttribute(this.side, 1).setUsage(i.DynamicDrawUsage),
      ),
      o.setAttribute(
        "aCol",
        new i.BufferAttribute(this.col, 4).setUsage(i.DynamicDrawUsage),
      ),
      o.setIndex(new i.BufferAttribute(a, 1)),
      (this.mesh = new i.Mesh(
        o,
        new i.ShaderMaterial({
          uniforms: {
            ...Ra,
            uSoft: { value: 0.35 },
            uLight: { value: 0 },
            uLightK: { value: 0.62 },
          },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: i.AdditiveBlending,
          side: i.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${ls}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Zt.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? i.NormalBlending : i.AdditiveBlending));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, a, n, s, r, l) {
    if (this.n >= this.max) return;
    const c = this.n++;
    (Ea.subVectors(o, t),
      Va.addVectors(t, o).multiplyScalar(0.5),
      Ua.subVectors(M.position, Va),
      Q.crossVectors(Ea, Ua).normalize());
    const f = this.pos,
      u = c * 12;
    ((f[u] = t.x - Q.x * a),
      (f[u + 1] = t.y - Q.y * a),
      (f[u + 2] = t.z - Q.z * a),
      (f[u + 3] = t.x + Q.x * a),
      (f[u + 4] = t.y + Q.y * a),
      (f[u + 5] = t.z + Q.z * a),
      (f[u + 6] = o.x - Q.x * n),
      (f[u + 7] = o.y - Q.y * n),
      (f[u + 8] = o.z - Q.z * n),
      (f[u + 9] = o.x + Q.x * n),
      (f[u + 10] = o.y + Q.y * n),
      (f[u + 11] = o.z + Q.z * n),
      this.side.set([-1, 1, -1, 1], c * 4));
    const h = this.col,
      p = c * 16;
    for (let d = 0; d < 4; d++)
      ((h[p + d * 4] = s.r),
        (h[p + d * 4 + 1] = s.g),
        (h[p + d * 4 + 2] = s.b),
        (h[p + d * 4 + 3] = d < 2 ? r : l));
  }
  line(t, o, a, n) {
    for (let s = 0; s < t.length - 1; s++) {
      const r = s / (t.length - 1),
        l = (s + 1) / (t.length - 1);
      this.seg(
        t[s],
        t[s + 1],
        N(t[s], o),
        N(t[s + 1], o),
        a,
        n ? n(r) : 1,
        n ? n(l) : 1,
      );
    }
  }
  end() {
    const t = this.mesh.geometry,
      o = Math.max(this.n, 1);
    t.setDrawRange(0, this.n * 6);
    for (const [a, n] of [
      ["position", 12],
      ["aSide", 4],
      ["aCol", 16],
    ]) {
      const s = t.attributes[a];
      (s.clearUpdateRanges(), s.addUpdateRange(0, o * n), (s.needsUpdate = !0));
    }
  }
}
const Ea = new i.Vector3(),
  Va = new i.Vector3(),
  Ua = new i.Vector3(),
  Q = new i.Vector3(),
  _e = new ms(6e3),
  N = (e, t) =>
    ((M.position.distanceTo(e) *
      Math.tan(i.MathUtils.degToRad(M.fov / 2)) *
      2) /
      Math.max(xe.clientHeight, 1)) *
    t *
    0.5,
  S = JSON.parse(
    document.getElementById("token-delta-data").textContent || "{}",
  ),
  Yt = (e) =>
    String(e).replace(/[&<>"']/g, (t) => "&#" + t.charCodeAt(0) + ";"),
  Me = (e) =>
    new Date(e + "T12:00:00Z").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
  Vo = (e) =>
    new Date(e + "T12:00:00Z").toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
  ws = (e, t) => {
    const o = new Date(e + "T00:00:00Z");
    return (o.setUTCDate(o.getUTCDate() + t), o.toISOString().slice(0, 10));
  },
  Uo = S.weeks.length,
  y = Uo - 1,
  Se = S.total,
  he = (e) =>
    e >= 1e4
      ? (e / 1e3).toFixed(1) + "T"
      : e >= 100
        ? (e / 1e3).toFixed(2) + "T"
        : (e / 1e3).toFixed(3) + "T",
  Mt = (e) =>
    e >= 0.1
      ? (e * 100).toFixed(0) + "%"
      : e >= 0.01
        ? (e * 100).toFixed(1) + "%"
        : (e * 100).toFixed(2) + "%",
  Oo = (e) => ws(S.weeks[e], 6),
  L = [
    ...S.channels.map((e) => ({ ...e })),
    {
      id: "rest",
      name: `${Math.max(0, (S.models || 0) - S.channels.length)} other models`,
      lab: "rest",
      labName: "every other model",
      tok: S.rest,
      rest: !0,
    },
  ],
  R = L.length;
function Oa(e) {
  const t = e.length,
    o = (a) => e[k(a, 0, t - 1)];
  return e.map((a, n) =>
    n >= t - 1
      ? a
      : n === t - 2
        ? (o(n - 1) + 2 * a + o(n + 1)) / 4
        : (o(n - 2) + 4 * o(n - 1) + 6 * a + 4 * o(n + 1) + o(n + 2)) / 16,
  );
}
L.forEach((e, t) => {
  ((e.i = t),
    (e.born = Math.max(
      0,
      e.tok.findIndex((n) => n > 0),
    )));
  let o = 0,
    a = 0;
  (e.tok.forEach((n, s) => {
    n > o && ((o = n), (a = s));
  }),
    (e.peak = o),
    (e.peakW = a),
    (e.share = e.tok.map((n, s) => n / Math.max(Se[s], 1e-9))),
    (e.lead = S.lead.reduce((n, s) => n + (s === t ? 1 : 0), 0)),
    (e.tokS = Oa(e.tok)),
    (e.shareS = Oa(e.share)));
});
const vs = (e, t) =>
    S.labs?.[e]
      ? S.labs[e].tok[t] / Math.max(Se[t], 1e-9)
      : L.filter((o) => o.lab === e).reduce((o, a) => o + a.share[t], 0),
  Ba = {
    anthropic: [1, 0.5, 0.2],
    google: [0.3, 0.58, 1],
    openai: [0.45, 1, 0.76],
    deepseek: [0.16, 0.82, 1],
    "x-ai": [0.66, 0.42, 1],
    "z-ai": [0.6, 1, 0.3],
    xiaomi: [1, 0.36, 0.16],
    tencent: [0.2, 1, 0.58],
    minimax: [1, 0.32, 0.52],
    moonshotai: [0.78, 0.58, 1],
    qwen: [0.86, 0.4, 1],
    nvidia: [0.5, 1, 0.18],
    "meta-llama": [0.28, 0.44, 1],
    mistralai: [1, 0.62, 0.16],
    stealth: [1, 0.56, 0.94],
    openrouter: [1, 0.56, 0.94],
    rest: [0.13, 0.16, 0.25],
  };
function gs(e) {
  if (Ba[e]) return Ba[e];
  let t = 0;
  for (const a of e) t = (t * 31 + a.charCodeAt(0)) % 997;
  const o = new i.Color().setHSL(t / 997, 0.8, 0.55);
  return [o.r, o.g, o.b];
}
const st = {};
for (const e of L) (st[e.lab] ||= []).push(e);
for (const [e, t] of Object.entries(st)) {
  t.sort((a, n) => a.born - n.born || n.peak - a.peak);
  const o = gs(e);
  t.forEach((a, n) => {
    const s = t.length > 1 ? n / (t.length - 1) : 0.5,
      r = 0.8 + s * 0.35,
      l = s * 0.08;
    ((a.col = o.map((c) => (c * (1 - l) + l) * r)), (a.k = n));
  });
}
const za = (e) => {
    let t = 0,
      o = 0;
    for (const a of st[e])
      a.tok.forEach((n, s) => {
        ((t += n * s), (o += n));
      });
    return t / Math.max(o, 1e-9);
  },
  $e = [];
(Object.keys(st)
  .filter((e) => e !== "rest")
  .sort((e, t) => za(e) - za(t))
  .forEach((e, t) => {
    const o = [...st[e]];
    t % 2 === 0 ? $e.push(...o) : $e.unshift(...o.reverse());
  }),
  $e.unshift(...(st.rest || [])),
  $e.forEach((e, t) => (e.o = t)));
const O = 0.42,
  Bo = 0.84,
  B = Bo + 0.035,
  T = 11.2,
  z = -8.6,
  F = 7,
  ke = -7.4,
  rt = 6.2,
  Ga = 0.5,
  ys = 0.95,
  Ce = (e) => ke + (e / y) * (rt - ke),
  Jt = (e) => ((e - ke) / (rt - ke)) * y;
function Ia(e, t) {
  t = k(t, 0, y);
  const o = Math.min(Math.floor(t), y - 1),
    a = t - o,
    n = e[Math.max(o - 1, 0)],
    s = e[o],
    r = e[o + 1],
    l = e[Math.min(o + 2, y)],
    c = a * a,
    f = c * a;
  return s <= 0 && r <= 0
    ? 0
    : Math.max(
        0,
        0.5 *
          (2 * s +
            (-n + r) * a +
            (2 * n - 5 * s + 4 * r - l) * c +
            (-n + 3 * s - 3 * r + l) * f),
      );
}
const Qt = [1, 1],
  xs = 0.025,
  bs = 0.5,
  Ms = 1.15,
  Ze = new Float32Array(R),
  it = (e, t) => {
    const o = k(e / y, 0, 1);
    return (t ? 0.9 : 2.3) * Math.pow(1 - o, 1.25) * Math.sin(e * 0.075 + 0.6);
  },
  Wa = (e, t) =>
    Math.min(
      Ms,
      ($e[e].lab === $e[t].lab ? xs : bs) *
        Math.pow(Math.min(Ze[e], Ze[t]), 0.75),
    );
function zo(e, t, o) {
  let a = 0,
    n = -1;
  for (let r = 0; r < R; r++) {
    const l = $e[r];
    Ze[r] = Ia(t ? l.shareS : l.tokS, e) * Qt[t];
  }
  for (let r = 0; r < R; r++)
    Ze[r] <= 1e-5 || (n >= 0 && (a += Wa(n, r)), (a += Ze[r]), (n = r));
  let s = it(e, t) - a / 2;
  n = -1;
  for (let r = 0; r < R; r++) {
    const l = $e[r].i;
    if (Ze[r] <= 1e-5) {
      o[l * 2] = o[l * 2 + 1] = s;
      continue;
    }
    (n >= 0 && (s += Wa(n, r)),
      (o[l * 2] = s),
      (s += Ze[r]),
      (o[l * 2 + 1] = s),
      (n = r));
  }
  return a;
}
{
  const e = new Float32Array(R * 2),
    t = Math.max(...Se);
  ((Qt[0] = 17 / t), (Qt[1] = 14));
  for (const o of [0, 1]) {
    const a = o ? 15.8 : 19.8;
    for (let n = 0; n < 5; n++) {
      let s = 0;
      for (let r = 0; r <= y; r++) s = Math.max(s, zo(r, o, e));
      Qt[o] *= a / s;
    }
  }
}
const $a = [];
{
  let e = 0;
  for (let t = 1; t <= Uo; t++)
    (t === Uo || S.lead[t] !== S.lead[e]) &&
      ($a.push({ c: L[S.lead[e]], w0: e, w1: t - 1 }), (e = t));
}
const Go = [];
{
  const e = new Set();
  for (const t of $a)
    (t.w1 - t.w0 + 1 >= 3 || t.c.stealth || t.w1 === y) &&
      !e.has(t.c.id) &&
      (e.add(t.c.id), Go.push(t));
}
const H = new i.Group();
Co.add(H);
const Io = (e, t, o = 3, a = 1024, n = 512) =>
    nt(a, n, (s, r, l) => {
      ((s.fillStyle = e), s.fillRect(0, 0, r, l));
      const c = be(o);
      for (let f = 0; f < 260; f++) {
        const u = c() * l,
          h = 0.03 + c() * 0.07;
        ((s.strokeStyle = `rgba(${t},${h})`),
          (s.lineWidth = 0.6 + c() * 2.4),
          s.beginPath(),
          s.moveTo(0, u));
        for (let p = 0; p <= r; p += 32)
          s.lineTo(
            p,
            u +
              Math.sin(p * 0.004 + f) * 6 * c() +
              Math.sin(p * 0.02 + f * 3) * 1.5,
          );
        s.stroke();
      }
      for (let f = 0; f < 14; f++) {
        const u = c() * r,
          h = c() * l,
          p = s.createRadialGradient(u, h, 0, u, h, 30 + c() * 50);
        (p.addColorStop(0, `rgba(${t},.12)`),
          p.addColorStop(1, `rgba(${t},0)`),
          (s.fillStyle = p),
          s.fillRect(u - 90, h - 90, 180, 180));
      }
    }),
  Ss = de("#c9a15a", { roughness: 0.3, metalness: 1, clearcoat: 0.4 }),
  St = Io("#2a1d15", "10,6,3", 5);
((St.wrapS = St.wrapT = i.RepeatWrapping), St.repeat.set(3, 2));
const ee = -8.4,
  Wo = 8.3,
  lt = -13.5;
{
  const e = fe(
      new i.MeshPhysicalMaterial({
        map: St,
        color: "#8a6c56",
        roughness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        metalness: 0,
        envMapIntensity: 0.16,
      }),
      Qn,
    ),
    t = new i.Mesh(Pa(40, 0.6, Wo + 9.5, 0.08, 3), e);
  (t.position.set(-2, -0.3, (Wo - 9.5) / 2),
    (t.receiveShadow = !0),
    H.add(t),
    ue.push(t));
  const o = fe(
      new i.MeshPhysicalMaterial({
        map: St,
        color: "#c49e80",
        roughness: 0.48,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.35,
      }),
    ),
    a = We(),
    n = Wo - 1.1,
    s = -ee - 0.6 - 0.35;
  a.box(o, -2, -0.6 - s / 2, (n - 8.6) / 2, 37.4, s, n + 8.6);
  for (let l = -20.7 + 37.4 / 6; l < 16.6; l += 37.4 / 6)
    a.box(
      K("#0a0706", { roughness: 0.6 }),
      l,
      -0.6 - s / 2,
      n + 0.005,
      0.06,
      s - 0.4,
      0.02,
    );
  (a.box(Ss, -2, ee + 0.18, n + 0.02, 37.4, 0.36, 0.04), a.flush(H));
  const r = new i.Mesh(new i.BoxGeometry(37.2, 0.05, 0.05), qt("#ffb26a", 2.2));
  (r.position.set(-2, -0.66, n + 0.25), H.add(r));
  for (const l of [-15, -2, 11]) ot(l, -3.2, n + 3.4, "#ffb070", 8, 0.75);
}
{
  const e = Io("#20160f", "6,3,1", 17, 1024, 1024);
  ((e.wrapS = e.wrapT = i.RepeatWrapping), e.repeat.set(10, 10));
  const t = fe(
      new i.MeshPhysicalMaterial({
        map: e,
        color: "#9a8070",
        roughness: 0.38,
        clearcoat: 0.5,
        clearcoatRoughness: 0.16,
        envMapIntensity: 0.18,
      }),
    ),
    o = new i.Mesh(new i.PlaneGeometry(240, 80), t);
  ((o.rotation.x = -Math.PI / 2),
    o.position.set(0, ee, lt + 40),
    (o.receiveShadow = !0),
    H.add(o),
    ue.push(o));
  const a = new i.Mesh(
    new i.PlaneGeometry(52, 30),
    K("#2a2523", { roughness: 0.95, envMapIntensity: 0.1 }),
  );
  ((a.rotation.x = -Math.PI / 2),
    a.position.set(-2, ee + 0.02, 4),
    H.add(a),
    ue.push(a),
    ot(-12, ee + 3, 16, "#ffb878", 16, 0.5),
    ot(10, ee + 3, 18, "#ffc890", 14, 0.35));
}
{
  const e = We(),
    t = de("#1b1a1c", { roughness: 0.45, metalness: 0.6 });
  for (let a = -42; a <= 42; a += 5.6) e.box(t, a, 8, lt, 0.24, 40, 0.3);
  (e
    .box(t, 0, 0.55, lt + 0.1, 90, 0.3, 0.5)
    .box(t, 0, 21, lt, 90, 0.5, 0.4)
    .box(
      K("#0d0f14", { roughness: 0.6 }),
      0,
      (ee + 0.5) / 2,
      lt + 0.4,
      90,
      0.5 - ee,
      0.3,
    ),
    e.flush(H, !1));
  const o = new i.Mesh(new i.BoxGeometry(90, 0.03, 0.03), qt("#ffb36a", 1.2));
  (o.position.set(0, 0.78, lt + 0.42), H.add(o));
}
function ks(e = {}) {
  return nt(4096, 1024, (t, o, a) => {
    const n = be(e.seed || 11),
      s = a * (e.horizon || 0.7),
      r = t.createLinearGradient(0, 0, 0, s);
    (r.addColorStop(0, "#08112c"),
      r.addColorStop(0.32, "#152a5c"),
      r.addColorStop(0.58, "#33478a"),
      r.addColorStop(0.76, "#7a649e"),
      r.addColorStop(0.9, "#d88f98"),
      r.addColorStop(1, "#f5b188"),
      (t.fillStyle = r),
      t.fillRect(0, 0, o, s + 2));
    for (let u = 0; u < 30; u++) {
      const h = n() * o,
        p = s * (0.3 + n() * 0.5),
        d = 220 + n() * 640,
        v = t.createRadialGradient(h, p, 0, h, p, d);
      (v.addColorStop(
        0,
        `rgba(${n() > 0.5 ? "255,180,170" : "160,150,220"},.09)`,
      ),
        v.addColorStop(1, "rgba(0,0,0,0)"),
        (t.fillStyle = v),
        t.save(),
        t.scale(1, 0.22),
        t.fillRect(h - d, p / 0.22 - d, d * 2, d * 2),
        t.restore());
    }
    if (e.mountains) {
      ((t.fillStyle = "#3a3b67"), t.beginPath(), t.moveTo(0, s));
      for (let u = 0; u <= o; u += 24) {
        const h = u / o;
        t.lineTo(
          u,
          s -
            a *
              (0.07 +
                0.09 * Math.abs(Math.sin(h * 4.2 + 1)) +
                0.04 * Math.sin(h * 17 + 2)),
        );
      }
      (t.lineTo(o, s), t.fill());
    }
    const l = ["#ffd9a0", "#ffe9c8", "#ffc070", "#ffcf90", "#cfe6ff"],
      c = (u, h, p, d, v, g = 3, x = 3.5, D = 6, ae = 7) => {
        if (((t.fillStyle = d), t.fillRect(u, s - p, h, p), !!v)) {
          for (let $ = s - p + 4; $ < s - 2; $ += ae)
            for (let et = u + 2; et < u + h - g; et += D)
              n() < v &&
                ((t.fillStyle = l[Math.floor(n() * l.length)]),
                (t.globalAlpha = 0.5 + n() * 0.5),
                t.fillRect(et, $, g, x));
          t.globalAlpha = 1;
        }
      };
    for (let u = 0; u < o;) {
      const h = 14 + n() * 40,
        p = a * (0.025 + n() * 0.08) * (e.low || 1);
      (c(u, h, p, "#56598c", 0.16, 2, 2.5, 5, 6), (u += h + n() * 5));
    }
    for (let u = 0; u < o;) {
      const h = Math.abs(Math.sin((u / o) * 7.3 + 0.4)),
        p = 24 + n() * 62,
        d = a * (0.05 + n() * 0.14 + h * h * 0.36 * n()) * (e.low || 1);
      (c(
        u,
        p,
        d,
        `hsl(${226 + n() * 16},${28 + n() * 14}%,${13 + n() * 8}%)`,
        0.42 + n() * 0.35,
      ),
        d > a * 0.22 &&
          n() < 0.6 &&
          ((t.fillStyle = "#ffe2b0"),
          (t.globalAlpha = 0.85),
          t.fillRect(u + 3, s - d + 2, p - 6, 3),
          (t.globalAlpha = 1)),
        d > a * 0.3 &&
          n() < 0.5 &&
          ((t.fillStyle = "#ff6a5a"),
          t.fillRect(u + p / 2 - 2, s - d - 9, 4, 4)),
        (u += p + n() * 8));
    }
    for (let u = 0; u < o;) {
      const h = 60 + n() * 110,
        p = a * (0.08 + n() * 0.2) * (e.low || 1);
      (n() < 0.55 &&
        c(
          u,
          h,
          p,
          `hsl(${224 + n() * 10},30%,${9 + n() * 5}%)`,
          0.5 + n() * 0.3,
          5,
          6,
          10,
          11,
        ),
        (u += h + 60 + n() * 260));
    }
    const f = t.createLinearGradient(0, s, 0, a);
    (f.addColorStop(0, "#3d3766"),
      f.addColorStop(0.25, "#1c1d3c"),
      f.addColorStop(1, "#090b17"),
      (t.fillStyle = f),
      t.fillRect(0, s, o, a - s));
    for (let u = 0; u < 1600; u++) {
      const h = n() * o,
        p = s + 3 + n() ** 1.5 * (a - s) * 0.75,
        d = 8 + n() * 60;
      ((t.fillStyle =
        [
          "rgba(255,200,140,",
          "rgba(255,232,200,",
          "rgba(170,210,255,",
          "rgba(255,170,110,",
        ][u % 4] +
        (0.1 + n() * 0.32) +
        ")"),
        t.fillRect(h, p, 1.5 + n() * 3, d * 0.3));
    }
  });
}
const Cs = ks({ seed: 11 }),
  Na = -118;
{
  const e = new i.Mesh(
    new i.PlaneGeometry(320, 80),
    new i.MeshBasicMaterial({
      map: Cs,
      fog: !1,
      color: new i.Color(0.95, 0.95, 0.95),
    }),
  );
  (e.position.set(0, 12, Na), H.add(e));
}
const Wr = (() => {
  const t = new i.PlaneGeometry(1, 1),
    o = new i.MeshBasicMaterial({
      map: _o,
      transparent: !0,
      blending: i.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
      vertexColors: !1,
    }),
    a = new i.InstancedMesh(t, o, 520),
    n = be(77),
    s = new i.Matrix4(),
    r = new i.Color(),
    l = [
      [1, 0.72, 0.42],
      [1, 0.86, 0.66],
      [0.62, 0.8, 1],
      [1, 0.6, 0.35],
      [1, 0.95, 0.85],
    ];
  for (let c = 0; c < 520; c++) {
    const f = (n() - 0.5) * 300,
      u = Math.abs(Math.sin((f / 300 + 0.5) * 7.3 + 0.4)),
      h = c % 9 === 0,
      p = h ? -4.5 - n() * 5 : -3.4 + n() ** 1.8 * (11 + u * u * 20),
      d = (0.45 + n() * 1.1) * (h ? 0.8 : 1);
    (s.makeScale(d, d, d),
      s.setPosition(f, p, Na + 2 + n() * 6),
      a.setMatrixAt(c, s));
    const v = l[Math.floor(n() * l.length)],
      g = (1.6 + n() * 2.6) * (h ? 0.55 : 1);
    a.setColorAt(c, r.setRGB(v[0] * g, v[1] * g, v[2] * g));
  }
  return ((a.frustumCulled = !1), H.add(a), je.push(a), a);
})();
{
  const e = We(),
    t = K("#2b2018", { roughness: 0.6 });
  (e.box(K("#1a1716", { roughness: 0.7 }), -26, 8, -4, 0.4, 36, 40),
    e.box(t, -24.6, 2.6, -9, 2.4, 0.12, 5).box(t, -24.6, 5.2, -9, 2.4, 0.12, 5),
    e
      .box(K("#d8d0c4"), -24.6, 3, -10.2, 0.5, 0.7, 0.5)
      .box(K("#5a6b4a"), -24.6, 3.05, -8.2, 0.6, 0.8, 0.6)
      .box(K("#c8a070"), -24.6, 5.5, -9.6, 0.9, 0.5, 0.4),
    e
      .cyl(
        de("#8a6b3d", { roughness: 0.3 }),
        -19,
        (ee + 1.35) / 2,
        -12,
        0.08,
        0.08,
        1.35 - ee,
        { seg: 10 },
      )
      .cyl(K("#3a2e25"), -19, ee + 0.12, -12, 0.7, 0.8, 0.25),
    e.flush(H));
  const o = new i.Mesh(
    new i.CylinderGeometry(0.75, 1.05, 1.1, 28, 1, !0),
    new i.MeshBasicMaterial({
      color: new i.Color(2.8, 1.7, 0.8),
      side: i.DoubleSide,
      fog: !1,
    }),
  );
  (o.position.set(-19, 1.9, -12), H.add(o));
  const a = new i.Mesh(new i.BoxGeometry(0.2, 2.2, 0.9), qt("#ffbf7a", 3.2));
  (a.position.set(-25.7, 6.5, 2),
    H.add(a),
    ot(-19, 1.6, -11, "#ffb878", 9, 1.1),
    ot(-24, 6, 2, "#ffbf7a", 7, 0.8));
  const n = K("#cfc6b8", { roughness: 0.55 }),
    s = We();
  (s.cyl(n, -24, ee + 1.1, 8, 1.3, 1, 2.2, { seg: 18 }),
    s.flush(H),
    hs(H, -24, ee + 2.2, 8, 6.2, 0, { n: 10 }));
}
const X = new i.Group();
Co.add(X);
const Ha = Io("#4a3122", "18,10,6", 8),
  Ts = fe(
    new i.MeshPhysicalMaterial({
      map: Ha,
      color: "#c9a688",
      roughness: 0.34,
      clearcoat: 0.9,
      clearcoatRoughness: 0.14,
      envMapIntensity: 0.7,
    }),
  ),
  Ee = de("#c9a15a", { roughness: 0.26, metalness: 1, clearcoat: 0.4 }),
  $o = -T - 1.15,
  ja = T + Ga,
  Za = z - Ga,
  eo = F + ys;
{
  const e = We(),
    t = (Za + eo) / 2;
  (e.box(Ts, ($o + ja) / 2, O / 2, t, ja - $o, O, eo - Za, { r: 0.04 }),
    e
      .box(Ee, 0, O + 0.006, z - 0.012, 2 * T + 0.05, 0.012, 0.024)
      .box(Ee, -T - 0.012, O + 0.006, (z + F) / 2, 0.024, 0.012, F - z)
      .box(Ee, T + 0.012, O + 0.006, (z + F) / 2, 0.024, 0.012, F - z),
    e.box(
      K("#06070a", { roughness: 0.1, metalness: 0.2, envMapIntensity: 1.2 }),
      0,
      O + 0.004,
      F + 0.37,
      2 * T,
      0.012,
      0.7,
    ),
    e.box(Ee, 0, O + 0.022, F + 0.75, 2 * T + 0.1, 0.044, 0.035),
    e.flush(X));
}
const to = (e, t) => {
    let o = (e * 374761393 + t * 668265263) | 0;
    return (
      (o = Math.imul(o ^ (o >>> 13), 1274126177)),
      ((o ^ (o >>> 16)) >>> 0) / 4294967296
    );
  },
  qe = (e, t) => {
    const o = Math.floor(e),
      a = Math.floor(t),
      n = e - o,
      s = t - a,
      r = n * n * (3 - 2 * n),
      l = s * s * (3 - 2 * s),
      c = to(o, a),
      f = to(o + 1, a),
      u = to(o, a + 1),
      h = to(o + 1, a + 1);
    return c + (f - c) * r + (u - c) * l + (c - f - u + h) * r * l;
  },
  As = (e, t) =>
    qe(e, t) * 0.55 +
    qe(e * 2.1 + 5.2, t * 2.1 - 1.3) * 0.3 +
    qe(e * 4.3 - 2.7, t * 4.3 + 3.9) * 0.15,
  Ve = new Float32Array(R * 2);
function Rs(e, t) {
  let o = Jt(e),
    a = 1;
  if (
    (o < 0 && ((a = k(1 + (e - ke) / 0.6, 0, 1)), (o = 0)),
    o > y && (o = y),
    zo(o, t, Ve),
    a < 1)
  ) {
    const s = it(0, t);
    for (let r = 0; r < R * 2; r++) Ve[r] = s + (Ve[r] - s) * a;
  }
  const n = [];
  for (let s = 0; s < R; s++) {
    const r = Ve[s * 2],
      l = Ve[s * 2 + 1];
    l - r > 1e-4 && n.push([r, l, s]);
  }
  return (n.sort((s, r) => s[0] - r[0]), n);
}
const _ = 300,
  pe = 214,
  Ue = _ * pe,
  te = [new Float32Array(Ue * 3), new Float32Array(Ue * 3)],
  oo = [null, null],
  ao = [new Float32Array(Ue * 3), new Float32Array(Ue * 3)],
  no = [new Float32Array(Ue * 3), new Float32Array(Ue * 3)],
  Ke = [new Float32Array(Ue), new Float32Array(Ue)],
  Ds = new i.Color("#6a5844"),
  Ps = new i.Color("#8a7660"),
  Fs = new i.Color("#222c19"),
  Ls = new i.Color("#3a4a29"),
  _s = new i.Color("#4a3c2c"),
  Es = new i.Color("#5a4c3a"),
  Vs = new i.Color("#4e6638"),
  kt = new i.Color();
{
  const e = [];
  for (let o = 0; o < pe - 1; o++)
    for (let a = 0; a < _ - 1; a++) {
      const n = o * _ + a;
      e.push(n, n + _, n + 1, n + 1, n + _, n + _ + 1);
    }
  const t = new i.BufferGeometry();
  t.setIndex(e);
  for (const o of [0, 1]) {
    const a = te[o],
      n = ao[o],
      s = no[o],
      r = Ke[o];
    for (let l = 0; l < pe; l++) {
      const c = z + ((F - z) * l) / (pe - 1),
        f = Rs(c, o);
      let u = -1;
      for (let h = 0; h < _; h++) {
        const p = -T + (2 * T * h) / (_ - 1),
          d = l * _ + h;
        for (; u < f.length - 1 && f[u + 1][0] <= p;) u++;
        let v = 1e9,
          g = -1,
          x = !1;
        (u >= 0 &&
          (p <= f[u][1]
            ? ((v = 0), (g = f[u][2]), (x = !0))
            : ((v = p - f[u][1]), (g = f[u][2]))),
          !x &&
            u + 1 < f.length &&
            f[u + 1][0] - p < v &&
            ((v = f[u + 1][0] - p), (g = f[u + 1][2])));
        const D = As(p * 0.17 + 3.1, c * 0.17 - 1.7),
          ae =
            D *
            D *
            1.15 *
            W(0.45, 2.6, v) *
            (1 - 0.5 * W(T - 1.2, T, Math.abs(p))),
          $ = W(-2.8, z + 0.4, c),
          et = 1 - Math.abs(2 * qe(p * 0.42 + 7.3, c * 0.42 - 2.1) - 1),
          xo =
            $ *
            (1.05 * et * et + 0.35 * D) *
            W(0.5, 2.4, v) *
            (1 - 0.35 * W(T - 0.9, T, Math.abs(p))),
          Bn = x ? Bo - 0.07 : Bo + 0.2 * W(0, 0.6, v) + 0.62 * ae + xo;
        ((a[d * 3] = p),
          (a[d * 3 + 1] = Bn),
          (a[d * 3 + 2] = c),
          (r[d] = x ? 0 : v));
        const zn = qe(p * 0.9 + 11, c * 0.9 - 4),
          wa = qe(p * 2.6 - 7, c * 2.6 + 2);
        (kt
          .copy(Fs)
          .lerp(Ls, zn)
          .lerp(_s, W(0.5, 0.8, wa) * 0.75)
          .lerp(Vs, W(0.12, 0.5, ae))
          .lerp(Ds, W(0.12, 0.55, xo))
          .lerp(Ps, W(0.5, 0.95, xo) * W(0.4, 0.7, wa)),
          x || kt.lerp(Es, (1 - W(0.02, 0.16, v)) * 0.8),
          (n[d * 3] = kt.r),
          (n[d * 3 + 1] = kt.g),
          (n[d * 3 + 2] = kt.b));
        const bo = g >= 0 && !x ? 0.42 * Math.exp(-v / 0.2) : 0,
          Mo = g >= 0 ? L[g].col : [0, 0, 0];
        ((s[d * 3] = Mo[0] * bo),
          (s[d * 3 + 1] = Mo[1] * bo),
          (s[d * 3 + 2] = Mo[2] * bo));
      }
    }
    (t.setAttribute("position", new i.BufferAttribute(a, 3)),
      t.computeVertexNormals(),
      (oo[o] = t.attributes.normal.array.slice()));
  }
  t.dispose();
  var Oe = new i.BufferGeometry();
  Oe.setIndex(e);
  for (const [o, a, n] of [
    ["position", te[0], 3],
    ["normal", oo[0], 3],
    ["color", ao[0], 3],
    ["aGlow", no[0], 3],
  ])
    Oe.setAttribute(
      o,
      new i.BufferAttribute(a.slice(), n).setUsage(i.DynamicDrawUsage),
    );
}
const Ct = { value: F + 2 },
  Us = { value: 1 },
  Os = fe(
    new i.MeshStandardMaterial({
      vertexColors: !0,
      roughness: 0.88,
      metalness: 0,
      envMapIntensity: 0.3,
    }),
    Object.assign(
      (e) => {
        (Object.assign(e.uniforms, { uPlayZ: Ct, uTGlow: Us }),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
attribute vec3 aGlow;varying vec3 vGlow;varying float vWZ;`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
vGlow=aGlow;vWZ=(modelMatrix*vec4(position,1.)).z;`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vGlow;varying float vWZ;uniform float uPlayZ;uniform float uTGlow;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
totalEmissiveRadiance+=vGlow*uTGlow*(1.-.85*smoothstep(uPlayZ,uPlayZ+.3,vWZ));`,
            )));
      },
      { key: "terr" },
    ),
  ),
  Tt = new i.Mesh(Oe, Os);
((Tt.receiveShadow = !0), (Tt.castShadow = !0), X.add(Tt));
const qa = nt(512, 256, (e, t, o) => {
  const a = be(21),
    n = [
      "#2b2119",
      "#3a2c20",
      "#4a3828",
      "#33271d",
      "#56432e",
      "#2a2018",
      "#3e3023",
      "#221a14",
    ];
  let s = 0;
  for (; s < o;) {
    const l = 8 + a() * 34;
    ((e.fillStyle = n[Math.floor(a() * n.length)]),
      e.fillRect(0, s, t, l),
      (s += l));
  }
  for (let l = 0; l < 900; l++) {
    e.fillStyle = `rgba(${a() < 0.5 ? "20,14,10" : "120,100,80"},${0.15 + a() * 0.35})`;
    const c = 1 + a() * 4;
    (e.beginPath(), e.ellipse(a() * t, a() * o, c * 1.4, c, 0, 0, 7), e.fill());
  }
  const r = e.createLinearGradient(0, 0, 0, o);
  (r.addColorStop(0, "rgba(0,0,0,0)"),
    r.addColorStop(1, "rgba(0,0,0,.45)"),
    (e.fillStyle = r),
    e.fillRect(0, 0, t, o));
});
qa.wrapS = i.RepeatWrapping;
const Bs = (() => {
  const e = [];
  for (let c = 0; c < _; c++) e.push((pe - 1) * _ + c);
  for (let c = pe - 1; c >= 0; c--) e.push(c * _ + _ - 1);
  for (let c = _ - 1; c >= 0; c--) e.push(c);
  for (let c = 0; c < pe; c++) e.push(c * _);
  const t = e.length,
    o = new Float32Array(t * 6),
    a = new Float32Array(t * 4),
    n = [];
  let s = 0;
  for (let c = 0; c < t; c++) {
    const f = e[c];
    if (c) {
      const u = e[c - 1];
      s += Math.hypot(
        te[0][f * 3] - te[0][u * 3],
        te[0][f * 3 + 2] - te[0][u * 3 + 2],
      );
    }
    if (
      ((a[c * 4] = s * 0.35),
      (a[c * 4 + 1] = 1),
      (a[c * 4 + 2] = s * 0.35),
      (a[c * 4 + 3] = 0),
      c)
    ) {
      const u = (c - 1) * 2;
      n.push(u, u + 1, u + 2, u + 1, u + 3, u + 2);
    }
  }
  const r = new i.BufferGeometry();
  (r.setAttribute(
    "position",
    new i.BufferAttribute(o, 3).setUsage(i.DynamicDrawUsage),
  ),
    r.setAttribute("uv", new i.BufferAttribute(a, 2)),
    r.setIndex(n));
  const l = new i.Mesh(
    r,
    fe(
      new i.MeshStandardMaterial({
        map: qa,
        roughness: 0.92,
        envMapIntensity: 0.2,
        side: i.DoubleSide,
      }),
    ),
  );
  return (
    (l.receiveShadow = !0),
    (l.castShadow = !0),
    X.add(l),
    (l.userData.update = (c) => {
      for (let f = 0; f < t; f++) {
        const u = e[f];
        ((o[f * 6] = c[u * 3]),
          (o[f * 6 + 1] = c[u * 3 + 1]),
          (o[f * 6 + 2] = c[u * 3 + 2]),
          (o[f * 6 + 3] = c[u * 3]),
          (o[f * 6 + 4] = O),
          (o[f * 6 + 5] = c[u * 3 + 2]));
      }
      for (let f = 0; f < t; f++) a[f * 4 + 1] = (o[f * 6 + 1] - O) / 0.9;
      ((r.attributes.uv.needsUpdate = !0),
        (r.attributes.position.needsUpdate = !0),
        r.computeVertexNormals());
    }),
    l.userData.update(te[0]),
    l
  );
})();
function Ka(e, t) {
  const o = Oe.attributes.position.array,
    a = k(((e + T) / (2 * T)) * (_ - 1), 0, _ - 1.001),
    n = k(((t - z) / (F - z)) * (pe - 1), 0, pe - 1.001),
    s = Math.floor(a),
    r = Math.floor(n),
    l = a - s,
    c = n - r,
    f = (u, h) => o[(h * _ + u) * 3 + 1];
  return Re(
    Re(f(s, r), f(s + 1, r), l),
    Re(f(s, r + 1), f(s + 1, r + 1), l),
    c,
  );
}
const j = [];
for (let e = 0; e < 3; e++) {
  const t = e / 3;
  j.push({ wf: 0, s: t, z: ke - 0.6 + 0.6 * t, y: B, f: 0 });
}
for (let e = 0; e <= y * 3; e++)
  j.push({ wf: e / 3, s: 1, z: Ce(e / 3), y: B, f: 0 });
for (let e = 1; e <= 3; e++)
  j.push({ wf: y, s: 1, z: rt + ((F - rt) * e) / 3, y: B, f: 0 });
for (let e = 1; e <= 10; e++) {
  const t = e / 10;
  j.push({
    wf: y,
    s: 1,
    z: F + 0.012 + 0.36 * t,
    y: B - (B - O - 0.03) * t * t,
    f: 1,
  });
}
const oe = j.length;
{
  let e = j[0].z;
  j.forEach((t, o) => {
    (o && (e += Math.hypot(t.z - j[o - 1].z, t.y - j[o - 1].y)), (t.v = e));
  });
}
const me = [new Float32Array(oe * R * 2), new Float32Array(oe * R * 2)];
for (const e of [0, 1])
  j.forEach((t, o) => {
    if ((zo(t.wf, e, Ve), t.s < 1)) {
      const a = it(0, e);
      for (let n = 0; n < R * 2; n++) Ve[n] = a + (Ve[n] - a) * t.s;
    }
    me[e].set(Ve, o * R * 2);
  });
const At = (() => {
    const e = R * oe * 2,
      t = new Float32Array(e * 3),
      o = new Float32Array(e * 3),
      a = new Float32Array(e * 2),
      n = new Float32Array(e * 3),
      s = new Float32Array(e),
      r = new Float32Array(e),
      l = new Float32Array(e),
      c = [];
    for (let u = 0; u < R; u++) {
      const h = L[u].col;
      for (let p = 0; p < oe; p++) {
        const d = j[p];
        for (let v = 0; v < 2; v++) {
          const g = (u * oe + p) * 2 + v;
          ((o[g * 3 + 1] = d.y),
            (o[g * 3 + 2] = d.z),
            (t[g * 3 + 1] = d.f ? 0.35 : 1),
            (t[g * 3 + 2] = d.f ? 0.94 : 0),
            (a[g * 2] = v),
            (a[g * 2 + 1] = d.v),
            n.set(h, g * 3),
            (r[g] = d.f),
            (l[g] = u));
        }
        if (p < oe - 1) {
          const v = me[0][(p * R + u) * 2 + 1] - me[0][(p * R + u) * 2],
            g = me[0][((p + 1) * R + u) * 2 + 1] - me[0][((p + 1) * R + u) * 2];
          if (v > 1e-5 || g > 1e-5) {
            const x = (u * oe + p) * 2;
            c.push(x, x + 2, x + 1, x + 1, x + 2, x + 3);
          }
        }
      }
    }
    const f = new i.BufferGeometry();
    return (
      f.setAttribute(
        "position",
        new i.BufferAttribute(o, 3).setUsage(i.DynamicDrawUsage),
      ),
      f.setAttribute("normal", new i.BufferAttribute(t, 3)),
      f.setAttribute("aUV", new i.BufferAttribute(a, 2)),
      f.setAttribute("aCol", new i.BufferAttribute(n, 3)),
      f.setAttribute(
        "aW",
        new i.BufferAttribute(s, 1).setUsage(i.DynamicDrawUsage),
      ),
      f.setAttribute("aFall", new i.BufferAttribute(r, 1)),
      f.setAttribute("aCh", new i.BufferAttribute(l, 1)),
      f.setIndex(c),
      f
    );
  })(),
  No = nt(
    256,
    256,
    (e, t, o) => {
      ((e.fillStyle = "#000"), e.fillRect(0, 0, t, o));
      const a = be(5);
      for (let n = 0; n < 520; n++) {
        const s = a() * t,
          r = a() * o,
          l = 10 + a() * 46,
          c = 0.12 + a() * 0.5;
        e.fillStyle = `rgba(255,255,255,${c})`;
        for (const f of [-t, 0, t])
          for (const u of [-o, 0, o])
            (e.beginPath(),
              e.ellipse(s + f, r + u, 1.2 + a() * 2.4, l, 0, 0, 7),
              e.fill());
      }
    },
    !1,
  );
No.wrapS = No.wrapT = i.RepeatWrapping;
const Ho = {
    uTime: { value: 0 },
    uPlayZ: Ct,
    uSel: { value: -1 },
    uGlow: { value: 0.64 },
    tFlow: { value: No },
  },
  zs = new i.ShaderMaterial({
    uniforms: Ho,
    vertexShader: `attribute vec2 aUV;attribute vec3 aCol;attribute float aW;attribute float aFall;attribute float aCh;varying vec2 vUV;varying vec3 vCol;varying float vW;varying float vFall;varying float vCh;varying vec3 vWP;
  void main(){vUV=aUV;vCol=aCol;vW=aW;vFall=aFall;vCh=aCh;vec4 wp=modelMatrix*vec4(position,1.);vWP=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader: `uniform float uTime;uniform float uPlayZ;uniform float uSel;uniform float uGlow;uniform sampler2D tFlow;varying vec2 vUV;varying vec3 vCol;varying float vW;varying float vFall;varying float vCh;varying vec3 vWP;
  void main(){
   // MSAA shades a sliver of a ribbon at the pixel's centre, which can lie outside it: the varyings are clamped, or the bank line would blow up to white
   float W=max(vW,0.),u=clamp(vUV.x,0.,1.),fall=clamp(vFall,0.,1.),edge=min(u,1.-u)*W,t=uTime*(.22+fall*1.9);
   vec2 fp=vec2(u*max(W,.05)*.9+vCh*.37,vUV.y*.42-t);
   float n=texture2D(tFlow,fp).r*.6+texture2D(tFlow,fp*vec2(2.2,1.3)+vec2(.31,-t*.6)).r*.4;
   float core=.6+.4*(1.-pow(abs(u*2.-1.),3.));
   // deep colour in the body of the channel, brighter where the flow catches the light, and slow pulses running downstream: the tokens going by
   float pulse=.5+.5*sin(vUV.y*5.5-uTime*1.6+vCh*1.7);
   vec3 c=vCol*core*(.36+.95*n+.16*pulse);
   float ew=min(.012,W*.12);c+=vCol*.55*exp(-edge/max(ew,1e-4));                     // a bright line where the water meets the bank (thin channels keep their colour)
   float gl=texture2D(tFlow,fp*vec2(3.1,2.3)+vec2(.17,-t*1.3)).r*texture2D(tFlow,fp*vec2(-2.3,1.7)+vec2(.61,t*.7)).r;c+=(vCol*.6+vec3(.5))*pow(gl,3.)*1.6;   // glints where two scrolls of the flow cross
   c=mix(c,vCol*(.06+1.4*n*n*n)+vec3(.1)*n*n,fall);                                // white water over the lip
   vec3 V=normalize(cameraPosition-vWP);c+=vec3(.22,.28,.42)*pow(1.-max(V.y,0.),5.)*.6;  // the dusk sky in the water at a glance
   c=max(mix(vec3(dot(c,vec3(.2126,.7152,.0722))),c,1.3),0.);                         // a little more colour than the light alone gives (the tone curve washes bright water out)
   float isSel=uSel<0.?0.:1.-step(.5,abs(vCh-uSel));
   float fut=smoothstep(uPlayZ,uPlayZ+.25,vWP.z)*(1.-isSel);c*=mix(1.,.1,fut);        // the weeks still to come: dark water (a followed channel stays lit all the way)
   c*=(uSel<0.?1.:isSel>.5?1.6:.2)*uGlow;
   gl_FragColor=vec4(max(c,0.),1.);}`,
  }),
  so = new i.Mesh(At, zs);
((so.frustumCulled = !1), X.add(so), ue.push(Tt, so));
const ro = (() => {
    const e = [],
      t = (u, h) => {
        u = u.index ? u.toNonIndexed() : u;
        const p = u.attributes.position.count,
          d = new Float32Array(p * 3);
        for (let v = 0; v < p; v++) d.set(h, v * 3);
        u.setAttribute("color", new i.BufferAttribute(d, 3));
        for (const v of Object.keys(u.attributes))
          ["position", "normal", "color"].includes(v) || u.deleteAttribute(v);
        return u;
      },
      o = new i.Color("#4a3424"),
      a = new i.Color("#ffffff");
    (e.push(
      t(
        new i.CylinderGeometry(0.014, 0.022, 0.12, 5, 1, !0).translate(
          0,
          0.06,
          0,
        ),
        [o.r, o.g, o.b],
      ),
    ),
      e.push(t(Eo(0.1, 0.35, 3).translate(0, 0.18, 0), [a.r, a.g, a.b])),
      e.push(
        t(Eo(0.075, 0.35, 7).translate(0.03, 0.27, 0.01), [a.r, a.g, a.b]),
      ));
    const n = ga(e);
    n.computeVertexNormals();
    const s = [],
      r = be(31);
    for (let u = z + 0.25; u < F - 0.3; u += 0.23)
      for (let h = -T + 0.25; h < T - 0.25; h += 0.23) {
        const p = h + (r() - 0.5) * 0.18,
          d = u + (r() - 0.5) * 0.18,
          v = qe(p * 0.45 + 20, d * 0.45 - 9);
        if (v < 0.5 || r() > (v - 0.5) * 2.4) continue;
        const g = Math.round(((p + T) / (2 * T)) * (_ - 1)),
          x = Math.round(((d - z) / (F - z)) * (pe - 1)),
          D = x * _ + g;
        (Ke[0][D] < 0.17 && Ke[1][D] < 0.17) ||
          s.push({
            x: p,
            z: d,
            v: D,
            s: 0.75 + r() * 0.75,
            ry: r() * 6.3,
            k: [W(0.17, 0.4, Ke[0][D]), W(0.17, 0.4, Ke[1][D])],
            tint: r(),
          });
      }
    const l = s.length,
      c = new i.InstancedMesh(
        n,
        fe(
          new i.MeshStandardMaterial({
            vertexColors: !0,
            roughness: 0.82,
            flatShading: !0,
            envMapIntensity: 0.3,
          }),
        ),
        l,
      ),
      f = [
        "#2f5a2a",
        "#3c6b31",
        "#47783a",
        "#2a4d27",
        "#56813f",
        "#5f7a34",
      ].map((u) => new i.Color(u));
    return (
      s.forEach((u, h) => c.setColorAt(h, f[Math.floor(u.tint * f.length)])),
      (c.castShadow = !0),
      (c.receiveShadow = !0),
      (c.frustumCulled = !1),
      X.add(c),
      ue.push(c),
      (c.userData.cand = s),
      c
    );
  })(),
  jo = (() => {
    const e = be(77),
      t = [];
    for (let a = 0; a < 6e3 && t.length < 150; a++) {
      const n = (e() * 2 - 1) * (T - 0.4),
        s = z + 0.6 + e() * (F - z - 1.1),
        r = Math.round(((n + T) / (2 * T)) * (_ - 1)),
        l = Math.round(((s - z) / (F - z)) * (pe - 1)),
        c = l * _ + r,
        f = Ke[0][c],
        u = Ke[1][c];
      f < 0.14 ||
        u < 0.14 ||
        Math.min(f, u) > 0.7 ||
        t.push({ x: n, z: s, v: c, s: 0.7 + e() * 0.6 });
    }
    const o = new i.InstancedMesh(
      new i.SphereGeometry(0.03, 8, 6),
      qt(new i.Color(2.2, 1.05, 0.38), 1),
      t.length,
    );
    return (
      (o.frustumCulled = !1),
      (o.userData.pts = t),
      X.add(o),
      ue.push(o),
      je.push(o),
      o
    );
  })(),
  Xa = (() => {
    const e = (t, o, a) => {
      const n = new i.BufferGeometry(),
        s = new Float32Array(t * 3),
        r = new Float32Array(t * 3);
      (n.setAttribute(
        "position",
        new i.BufferAttribute(s, 3).setUsage(i.DynamicDrawUsage),
      ),
        n.setAttribute(
          "color",
          new i.BufferAttribute(r, 3).setUsage(i.DynamicDrawUsage),
        ));
      const l = new i.Points(
        n,
        new i.PointsMaterial({
          size: o,
          map: _o,
          vertexColors: !0,
          transparent: !0,
          depthWrite: !1,
          blending: i.AdditiveBlending,
          fog: !1,
          sizeAttenuation: !0,
        }),
      );
      return (
        (l.frustumCulled = !1),
        X.add(l),
        je.push(l),
        {
          pts: l,
          p: s,
          c: r,
          n: t,
          col: a,
          life: new Float32Array(t),
          age: new Float32Array(t),
          home: new Float32Array(t * 3),
          vel: new Float32Array(t * 3),
          c0: new Float32Array(t * 3),
        }
      );
    };
    return {
      stealth: e(260, 1.45, [1, 0.78, 1]),
      falls: e(160, 0.6, [0.8, 0.95, 1]),
    };
  })(),
  Gs = L.filter((e) => e.stealth).map((e) => e.i),
  ct = new i.Mesh(
    new i.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    ds(new i.Color(1.5, 1.05, 0.7), 0.55),
  );
((ct.renderOrder = 3), X.add(ct), je.push(ct), ue.push(ct));
const Is = fe(
  new i.MeshPhysicalMaterial({
    map: Ha,
    color: "#7a5a44",
    roughness: 0.42,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    envMapIntensity: 0.5,
  }),
);
function Ya(e, t, o) {
  const a = new i.Group(),
    n = We(),
    s = 1.3,
    r = 0.4;
  (n
    .box(Is, 0, 0.22 + r / 2, 0, s, r, 0.04, { r: 0.012 })
    .box(Ee, 0, 0.22 + r / 2, -0.024, s + 0.03, r + 0.03, 0.01),
    n
      .cyl(Ee, -s * 0.36, 0.12, 0, 0.012, 0.014, 0.24, { seg: 8 })
      .cyl(Ee, s * 0.36, 0.12, 0, 0.012, 0.014, 0.24, { seg: 8 }),
    n.flush(a));
  const l = Xt(
    s * 0.94,
    r * 0.86,
    1024,
    264,
    (c, f, u) => {
      ((c.textAlign = "center"), (c.textBaseline = "alphabetic"));
      let h = 104;
      c.font = `600 ${h}px Outfit, sans-serif`;
      const p = c.measureText(e).width;
      p > f - 40 &&
        ((h = Math.floor((h * (f - 40)) / p)),
        (c.font = `600 ${h}px Outfit, sans-serif`));
      const d = c.createLinearGradient(0, 20, 0, 140);
      (d.addColorStop(0, "#ffe7b0"),
        d.addColorStop(1, "#d7a259"),
        (c.fillStyle = "#050302"),
        c.fillText(e, f / 2 + 3, 128),
        (c.fillStyle = d),
        c.fillText(e, f / 2, 125),
        (c.font = "500 66px Outfit, sans-serif"),
        (c.fillStyle = o ? "#f3c8ff" : "#d9c39a"),
        c.fillText(t, f / 2, 222));
    },
    1,
    { alphaTest: 0.2 },
  );
  return (
    l.position.set(0, 0.22 + r / 2, 0.022),
    a.add(l),
    X.add(a),
    ue.push(a),
    a
  );
}
const Zo = Go.map((e, t) => {
    const o = e.c,
      a = Vo(S.weeks[e.w0]) + (o.stealth ? " \xB7 stealth" : ""),
      n = Ya(o.name, a, o.stealth);
    return ((n.userData = { st: e, k: t }), n);
  }),
  qo = Ya(he(Se[0]) + " a week", "Jan 2025", !1);
{
  const e = We(),
    t = -T - 0.62;
  for (let o = 0; o <= y; o++) {
    const a = new Date(S.weeks[o] + "T12:00:00Z"),
      n = o ? new Date(S.weeks[o - 1] + "T12:00:00Z") : null;
    if (n && a.getUTCMonth() === n.getUTCMonth()) continue;
    const s = a.getUTCMonth() % 3 === 0;
    e.box(
      Ee,
      t + (s ? 0.18 : 0.28),
      O + 0.006,
      Ce(o),
      s ? 0.5 : 0.3,
      0.01,
      0.022,
    );
  }
  (e.box(Ee, t, O + 0.006, (Ce(0) + rt) / 2, 0.02, 0.01, rt - Ce(0)),
    e.flush(X));
  for (const [o, a] of [
    ["2025", 0],
    ["2026", S.weeks.findIndex((n) => n >= "2026-01-01")],
    ["now", y],
  ]) {
    if (a < 0) continue;
    const n = Xt(
      0.8,
      0.34,
      512,
      216,
      (s, r, l) => {
        ((s.textAlign = "center"),
          (s.textBaseline = "middle"),
          (s.font = "600 150px Outfit, sans-serif"));
        const c = s.createLinearGradient(0, 30, 0, 190);
        (c.addColorStop(0, "#f6dfa8"),
          c.addColorStop(1, "#b98f52"),
          (s.fillStyle = c),
          s.fillText(o, r / 2, l / 2 + 8));
      },
      0.9,
      { alphaTest: 0.25 },
    );
    ((n.rotation.x = -Math.PI / 2),
      n.position.set(t - 0.12, O + 0.008, Ce(a) + 0.32),
      X.add(n));
  }
}
const Ja = [];
function Ws(e, t, o, a, n = 128, s = "@RYANSAEL") {
  const r = () => {
    ((e.font = `600 ${n}px Outfit, sans-serif`),
      (e.letterSpacing = Math.round(n * 0.18) + "px"));
  };
  r();
  const l = e.measureText(s).width;
  l > t - 28 && ((n = Math.floor((n * (t - 28)) / l)), r());
  const c = t / 2 + Math.round(n * 0.09),
    f = o / 2 + n * 0.35;
  ((e.textAlign = "center"),
    (e.textBaseline = "alphabetic"),
    (e.fillStyle = "#030303"),
    e.fillText(s, c + n * 0.02, f + n * 0.06));
  const u = e.createLinearGradient(0, f - n * 0.7, 0, f);
  (u.addColorStop(0, a ? "#ffe2a0" : "#efd6a0"),
    u.addColorStop(1, a ? "#e8a040" : "#b89058"),
    (e.fillStyle = u),
    e.fillText(s, c, f));
}
function $s(e, t = {}) {
  const o = t.k ?? 0.7;
  let a = !1;
  const n = (r, l, c) => Ws(r, l, c, a),
    s = Xt(e, e * 0.1375, 1280, 176, n, o, { alphaTest: 0.25 });
  return (
    (s.userData.mark = 1),
    Ja.push({
      hit: s,
      over(r) {
        ((a = r),
          s.material.color.setRGB(r ? 3.2 : o, r ? 2.4 : o, r ? 1.4 : o),
          s.userData.redraw(n));
      },
    }),
    s
  );
}
{
  const e = $s(1.9, { k: 0.75 });
  (e.position.set(-7.4, O * 0.5, eo + 0.006), X.add(e));
  const t = Xt(
    5.2,
    0.24,
    2048,
    96,
    (o, a, n) => {
      ((o.textAlign = "center"),
        (o.textBaseline = "middle"),
        (o.font = "600 62px Outfit, sans-serif"),
        (o.letterSpacing = "4px"));
      const s = `THE WEEK TO ${Me(Oo(y)).toUpperCase()}:  ${he(Se[y])} TOKENS`;
      ((o.fillStyle = "#030303"), o.fillText(s, a / 2 + 2, n / 2 + 4));
      const r = o.createLinearGradient(0, 10, 0, 86);
      (r.addColorStop(0, "#f2dba6"),
        r.addColorStop(1, "#b88f52"),
        (o.fillStyle = r),
        o.fillText(s, a / 2, n / 2 + 2));
    },
    0.85,
    { alphaTest: 0.25 },
  );
  (t.position.set(2.2, O * 0.5, eo + 0.006), X.add(t));
}
const Qa = [];
for (let e = 0; e < 6; e++) Qa.push(ot(0, B + 0.5, F - 0.4, "#ffffff", 3.2, 0));
function Ko(e = 600, t = 150) {
  const o = document.createElement("canvas");
  ((o.width = e), (o.height = t));
  const a = o.getContext("2d"),
    n = new i.CanvasTexture(o);
  ((n.colorSpace = i.SRGBColorSpace), (n.anisotropy = 4));
  const s = new i.Mesh(
    new i.PlaneGeometry(1, t / e),
    new i.MeshBasicMaterial({
      map: n,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      color: new i.Color(1.25, 1.25, 1.25),
    }),
  );
  return (
    (s.renderOrder = 10),
    (s.frustumCulled = !1),
    Zt.add(s),
    (s.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 0,
      set(r, l = "", c = {}) {
        const f = r + "|" + l + "|" + JSON.stringify(c);
        if (f === this.key) return;
        ((this.key = f),
          (this.args = [r, l, c]),
          a.clearRect(0, 0, e, t),
          (a.font = "600 33px Outfit, sans-serif"));
        const u = a.measureText(r).width;
        a.font = `700 ${c.big || 44}px Outfit, sans-serif`;
        const h = l ? a.measureText(l).width : 0,
          p = !!l && !c.one,
          d = Math.min(e - 8, Math.max(u, p ? h : u + (l ? h + 22 : 0)) + 44),
          v = p ? t - 10 : Math.round(t * 0.52),
          g = c.align < 0 ? 4 : c.align > 0 ? e - 4 - d : (e - d) / 2,
          x = (t - v) / 2;
        ((a.fillStyle = c.bg || "rgba(11,14,22,.9)"),
          _a(a, g, x, d, v, 16),
          a.fill(),
          (this.pw = d),
          (this.ph = v),
          (this.ox = g + d / 2 - e / 2),
          (a.textBaseline = "alphabetic"),
          (a.fillStyle = "#eef2fa"),
          (a.font = "600 33px Outfit, sans-serif"),
          p
            ? (a.fillText(r, g + 22, x + 46),
              (a.fillStyle = c.col || "#ffffff"),
              (a.font = `700 ${c.big || 44}px Outfit, sans-serif`),
              a.fillText(l, g + 22, x + v - 22))
            : (a.fillText(r, g + 22, x + v / 2 + 12),
              l &&
                ((a.fillStyle = c.col || "#fff"),
                (a.font = `700 ${c.big || 44}px Outfit, sans-serif`),
                a.fillText(l, g + 22 + u + 22, x + v / 2 + 14))),
          (n.needsUpdate = !0));
      },
    }),
    Lo.push(() => {
      const r = s.userData;
      r.args && ((r.key = ""), r.set(...r.args));
    }),
    s
  );
}
function $r() {
  return Ko(380, 96);
}
function Nr(e, t) {
  const o = e.userData;
  if (o.txt === t) return;
  o.txt = t;
  const a = o.c || (o.c = e.material.map.image),
    n = a.getContext("2d"),
    s = a.width,
    r = a.height;
  (n.clearRect(0, 0, s, r), (n.font = "700 46px Outfit, sans-serif"));
  const l = n.measureText(t).width,
    c = l + 40;
  ((n.fillStyle = "rgba(10,12,18,.8)"),
    _a(n, (s - c) / 2, 10, c, r - 20, (r - 20) / 2),
    n.fill(),
    (o.pw = c),
    (o.ph = r - 20),
    (o.ox = 0),
    (n.fillStyle = "#fff6e6"),
    (n.textAlign = "center"),
    (n.textBaseline = "middle"),
    n.fillText(t, s / 2, r / 2 + 2),
    (n.textAlign = "left"),
    (e.material.map.needsUpdate = !0));
}
const en = new i.Vector3(),
  G = new i.Vector3();
function io(e, t, o = 24, a = 0, n = 0, s = 0) {
  const r = (N(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(M.quaternion),
    e.scale.set(r, r, r),
    a &&
      e.position.addScaledVector(
        en.set(0, 1, 0).applyQuaternion(M.quaternion),
        (a * r * e.userData.h) / e.userData.w,
      ),
    n &&
      e.position.addScaledVector(
        en.set(1, 0, 0).applyQuaternion(M.quaternion),
        n * r,
      ),
    (e.userData.px = o),
    (e.userData.pri = s),
    lo.push(e));
}
const lo = [],
  co = new i.Vector3();
function Ns() {
  lo.sort((n, s) => s.userData.pri - n.userData.pri);
  const e = xe.clientWidth,
    t = xe.clientHeight,
    o = [],
    a = xe.getBoundingClientRect();
  if (!ko.classList.contains("ui-off"))
    for (const n of [...Xs, b(".side"), b(".ctl")]) {
      if (!n || (n.classList.contains("tcard") && !n.classList.contains("on")))
        continue;
      const s = n.getBoundingClientRect();
      s.width > 0 &&
        o.push([
          s.left - a.left,
          s.top - a.top,
          s.right - a.left,
          s.bottom - a.top,
        ]);
    }
  for (const n of lo) {
    const s = n.userData;
    if (s.want > 0) {
      co.copy(n.position).project(M);
      const r = s.px / s.h,
        l = (s.pw || s.w) * r,
        c = (s.ph || s.h) * r,
        f = (co.x * 0.5 + 0.5) * e + (s.ox || 0) * r,
        u = (-co.y * 0.5 + 0.5) * t,
        h = [f - l / 2 - 5, u - c / 2 - 4, f + l / 2 + 5, u + c / 2 + 4];
      co.z > 1 ||
      h[0] < 0 ||
      h[1] < 0 ||
      h[2] > e ||
      h[3] > t ||
      o.some((p) => h[0] < p[2] && h[2] > p[0] && h[1] < p[3] && h[3] > p[1])
        ? (s.want = 0)
        : o.push(h);
    }
    ((s.a += (s.want - s.a) * (1 - Math.exp(-Rt * 8))),
      (n.material.opacity = s.a),
      (n.visible = s.a > 0.02));
  }
  lo.length = 0;
}
let ft = !0;
const m = {
  w: y,
  wV: y,
  play: !1,
  playAt: 0,
  mode: 0,
  mV: 0,
  mA: -1,
  sel: -1,
  scrub: !1,
};
let Xo = 0.016,
  Yo = 0.016,
  Rt = 0.016,
  ie = 0;
const Hs = 0.26,
  tn = Oe.attributes.position.array,
  js = Oe.attributes.normal.array,
  Zs = Oe.attributes.color.array,
  qs = Oe.attributes.aGlow.array,
  on = At.attributes.position.array,
  an = At.attributes.aW.array,
  fo = [new Float32Array(oe * 2), new Float32Array(oe * 2)];
for (const e of [0, 1])
  for (let t = 0; t < oe; t++) {
    let o = 1e9,
      a = -1e9;
    for (let n = 0; n < R; n++) {
      const s = me[e][(t * R + n) * 2],
        r = me[e][(t * R + n) * 2 + 1];
      r - s > 1e-4 && ((o = Math.min(o, s)), (a = Math.max(a, r)));
    }
    (o > a && (o = a = it(j[t].wf, e)),
      (fo[e][t * 2] = o),
      (fo[e][t * 2 + 1] = a));
  }
const uo = 3,
  Y = oe - 11,
  ut = (e) => uo + Math.round(k(e, 0, y) * 3),
  dt = (e) => e * e * (3 - 2 * e),
  P = (e, t, o, a) =>
    Re(me[0][(e * R + t) * 2 + o], me[1][(e * R + t) * 2 + o], a),
  ht = (e, t, o) => Re(fo[0][e * 2 + t], fo[1][e * 2 + t], o),
  ho = new i.Matrix4(),
  nn = new i.Quaternion(),
  sn = new i.Vector3(),
  Jo = new i.Vector3();
function Ks(e) {
  const t = te[0],
    o = te[1],
    a = oo[0],
    n = oo[1],
    s = ao[0],
    r = ao[1],
    l = no[0],
    c = no[1],
    f = 1 - e;
  for (let d = 0, v = Ue * 3; d < v; d++)
    ((tn[d] = t[d] * f + o[d] * e),
      (js[d] = a[d] * f + n[d] * e),
      (Zs[d] = s[d] * f + r[d] * e),
      (qs[d] = l[d] * f + c[d] * e));
  for (const d of ["position", "normal", "color", "aGlow"])
    Oe.attributes[d].needsUpdate = !0;
  Bs.userData.update(tn);
  const u = me[0],
    h = me[1];
  for (let d = 0; d < R; d++)
    for (let v = 0; v < oe; v++) {
      const g = (v * R + d) * 2,
        x = u[g] * f + h[g] * e,
        D = u[g + 1] * f + h[g + 1] * e,
        ae = (d * oe + v) * 2;
      ((on[ae * 3] = x), (on[ae * 3 + 3] = D), (an[ae] = an[ae + 1] = D - x));
    }
  ((At.attributes.position.needsUpdate = !0),
    (At.attributes.aW.needsUpdate = !0),
    ro.userData.cand.forEach((d, v) => {
      const g = d.k[0] * f + d.k[1] * e,
        x = d.s * dt(k(g, 0, 1)),
        D = te[0][d.v * 3 + 1] * f + te[1][d.v * 3 + 1] * e;
      (ho.compose(
        Jo.set(d.x, D - 0.012, d.z),
        nn.setFromAxisAngle(Fo, d.ry),
        sn.set(x, x, x),
      ),
        ro.setMatrixAt(v, ho));
    }),
    (ro.instanceMatrix.needsUpdate = !0),
    jo.userData.pts.forEach((d, v) => {
      const g = te[0][d.v * 3 + 1] * f + te[1][d.v * 3 + 1] * e;
      (ho.compose(Jo.set(d.x, g + 0.03, d.z), nn.identity(), sn.setScalar(d.s)),
        jo.setMatrixAt(v, ho));
    }),
    (jo.instanceMatrix.needsUpdate = !0),
    rn(e));
  const p = [];
  for (let d = 0; d < R; d++) p.push([P(Y, d, 1, e) - P(Y, d, 0, e), d]);
  (p.sort((d, v) => v[0] - d[0]),
    Qa.forEach((d, v) => {
      const [g, x] = p[v];
      (d.p.set((P(Y, x, 0, e) + P(Y, x, 1, e)) / 2, B + 0.35, F - 0.2),
        d.c.setRGB(...L[x].col),
        (d.i = g > 0.05 ? 0.9 : 0),
        (d.r = 2.2 + g * 0.4));
    }),
    (m.mA = e));
}
function rn(e) {
  const t = { "-1": -99, 1: -99 };
  Zo.forEach((n, s) => {
    const { st: r } = n.userData,
      l = r.w0,
      c = ut(l);
    let f = c,
      u = Ce(l);
    const h = (P(f, r.c.i, 0, e) + P(f, r.c.i, 1, e)) / 2,
      p = (ht(f, 0, e) + ht(f, 1, e)) / 2,
      d = h >= p ? 1 : -1,
      v = ($) => k(M.position.distanceTo(Jo.set($, B, u)) / 17, 0.42, 1.9);
    let g = ht(f, d < 0 ? 0 : 1, e),
      x = v(g),
      D = g + d * (0.3 + 0.66 * x);
    const ae = ($) => {
      ((f = $),
        (u = j[f].z),
        (g = ht(f, d < 0 ? 0 : 1, e)),
        (x = v(g)),
        (D = g + d * (0.3 + 0.66 * x)));
    };
    for (let $ = 0; $ < 14 && f < Y - 2 && u - t[d] < 0.75 * x; $++) ae(f + 2);
    for (
      let $ = 0;
      $ < 24 &&
      f > uo &&
      (Math.abs(D) > T - 0.7 * x ||
        (u - t[d] < 0.75 * x && Math.abs(D) > T - 0.7 * x));
      $++
    )
      ae(Math.max(uo, f - 2));
    (Math.abs(u - t[d]) < 0.75 * x && (D += d * 1.4 * x),
      (D = k(D, -T + 0.7 * x, T - 0.7 * x)),
      (t[d] = u),
      n.position.set(D, Ka(D, u) - 0.03, u),
      n.scale.setScalar(x),
      (n.rotation.y = -D * 0.018),
      (n.userData.cx = (P(c, r.c.i, 0, e) + P(c, r.c.i, 1, e)) / 2),
      (n.userData.z = Ce(l)));
  });
  const o = ke - 1.05,
    a = Re(it(0, 0), it(0, 1), e);
  (ct.position.set(a, B + 0.012, ke - 0.62),
    ct.scale.setScalar(0.9 + 0.06 * Math.sin(ie * 1.7)),
    qo.position.set(a, Ka(a, o) - 0.03, o),
    qo.scale.setScalar(k(M.position.distanceTo(qo.position) / 15, 0.45, 2)));
}
function ln(e) {
  m.play &&
    ie - m.playAt > Hs &&
    ((m.playAt = ie), m.w < y ? Be(m.w + 1, !1) : He(!1));
  const t = 1 - Math.exp(-e * (m.scrub ? 16 : m.play ? 9 : 6));
  ((m.wV += (m.w - m.wV) * t), Math.abs(m.w - m.wV) < 0.002 && (m.wV = m.w));
  const o = 1 - Math.exp(-e * 2.4);
  ((m.mV += (m.mode - m.mV) * o),
    Math.abs(m.mode - m.mV) < 0.001 && (m.mV = m.mode));
  const a = dt(m.mV);
  (Math.abs(a - m.mA) > 1e-4 && Ks(a),
    (Ho.uTime.value = ie % 1e3),
    (Ho.uSel.value = m.sel),
    (Ct.value = Re(Ce(m.wV) + 0.12, F + 6, W(y - 1, y, m.wV))));
}
function cn(e, t) {
  let o = Math.random() * t;
  for (let a = 0; a < e.length; a++)
    if (((o -= e[a][0]), o <= 0)) return e[a][1];
  return e[e.length - 1][1];
}
function fn(e) {
  const t = dt(m.mV),
    o = Ct.value;
  {
    const a = Xa.stealth,
      n = [];
    let s = 0;
    for (const r of Gs) {
      let l = 0;
      for (let c = ut(L[r].born); c <= Y; c += 3)
        l += P(c, r, 1, t) - P(c, r, 0, t);
      (n.push([l, r]), (s += l));
    }
    for (let r = 0; r < a.n; r++) {
      const l = r * 3;
      if (((a.age[r] += e), a.age[r] >= a.life[r] && s > 0)) {
        const h = cn(n, s),
          p = L[h].born + Math.random() * (y - L[h].born + 1),
          d = Math.min(ut(p), Y),
          v = Re(P(d, h, 0, t), P(d, h, 1, t), 0.1 + Math.random() * 0.8);
        ((a.home[l] = v),
          (a.home[l + 1] = B + 0.02),
          (a.home[l + 2] = j[d].z),
          (a.vel[l] = (Math.random() - 0.5) * 0.06),
          (a.vel[l + 1] = 0.03 + Math.random() * 0.07),
          (a.vel[l + 2] = 0.02 + Math.random() * 0.05),
          (a.life[r] = 5 + Math.random() * 5),
          (a.age[r] = 0));
      }
      const c = a.age[r],
        f = Math.max(a.life[r], 0.001);
      for (let h = 0; h < 3; h++) a.p[l + h] = a.home[l + h] + a.vel[l + h] * c;
      const u =
        Math.max(0, Math.sin((Math.PI * c) / f)) *
        0.11 *
        (a.p[l + 2] < o ? 1 : 0);
      ((a.c[l] = a.col[0] * u),
        (a.c[l + 1] = a.col[1] * u),
        (a.c[l + 2] = a.col[2] * u));
    }
    ((a.pts.geometry.attributes.position.needsUpdate = !0),
      (a.pts.geometry.attributes.color.needsUpdate = !0));
  }
  {
    const a = Xa.falls,
      n = [];
    let s = 0;
    for (let r = 0; r < R; r++) {
      const l = P(Y, r, 1, t) - P(Y, r, 0, t);
      l > 0.001 && (n.push([l, r]), (s += l));
    }
    for (let r = 0; r < a.n; r++) {
      const l = r * 3;
      if (((a.age[r] += e), a.age[r] >= a.life[r] && s > 0)) {
        const p = cn(n, s),
          d = Re(P(Y, p, 0, t), P(Y, p, 1, t), Math.random());
        ((a.home[l] = d),
          (a.home[l + 1] = O + 0.05),
          (a.home[l + 2] = F + 0.3 + Math.random() * 0.16),
          (a.vel[l] = (Math.random() - 0.5) * 0.08),
          (a.vel[l + 1] = 0.1 + Math.random() * 0.22),
          (a.vel[l + 2] = 0.03 + Math.random() * 0.08),
          (a.life[r] = 1.6 + Math.random() * 1.8),
          (a.age[r] = 0),
          a.c0.set(L[p].col, l));
      }
      const c = a.age[r],
        f = Math.max(a.life[r], 0.001);
      for (let p = 0; p < 3; p++) a.p[l + p] = a.home[l + p] + a.vel[l + p] * c;
      const u =
          Math.max(0, Math.sin((Math.PI * c) / f)) * 0.035 * (o > F ? 1 : 0),
        h = a.c0.subarray(l, l + 3);
      for (let p = 0; p < 3; p++)
        a.c[l + p] = (a.col[p] * 0.5 + h[p] * 0.5) * u;
    }
    ((a.pts.geometry.attributes.position.needsUpdate = !0),
      (a.pts.geometry.attributes.color.needsUpdate = !0));
  }
}
const Xs = [],
  I = new i.Vector3(),
  Ys = new i.Color(),
  Qo = new i.Vector3(),
  po = new i.Vector3(),
  Js = [0, 1, 2, 3].map(() => Ko(640, 150)),
  ea = Ko(700, 150),
  ta = new i.Color(1.5, 1.25, 0.9),
  un = new i.Color(1.7, 1.45, 1.05),
  dn = (e) =>
    "#" + new i.Color(...e.map((t) => Math.min(1, t * 1.1))).getHexString();
function Qs(e) {
  (rn(dt(m.mV)), _e.begin());
  const t = dt(m.mV),
    o = m.wV,
    a = Math.round(o),
    n = ut(o),
    s = Ce(o),
    r = 1 - W(y - 1, y, o);
  (r > 0.01 &&
    (G.set(ht(n, 0, t) - 0.5, B + 0.03, s),
    I.set(ht(n, 1, t) + 0.5, B + 0.03, s),
    _e.seg(G, I, N(G, 1.3), N(I, 1.3), un, 0.75 * r, 0.75 * r)),
    G.set(-T - 0.86, O + 0.03, s),
    I.set(-T - 0.3, O + 0.03, s),
    _e.seg(G, I, N(G, 2.4), N(I, 2.4), un, 0.9, 0.9));
  const l = L.filter((f) => !f.rest && f.tok[a] > 0)
    .sort((f, u) => u.tok[a] - f.tok[a])
    .slice(0, 4);
  Js.forEach((f, u) => {
    const h = l[u],
      p = f.userData;
    if (((p.want = ft && h && m.sel < 0 ? 1 : 0), !h)) {
      io(f, G.set(0, -99, 0), 30, 0, 0, 0);
      return;
    }
    const d = (P(n, h.i, 0, t) + P(n, h.i, 1, t)) / 2;
    (p.set(h.name, he(h.tok[a]) + "  \xB7  " + Mt(h.share[a]), {
      big: 38,
      col: dn(h.col),
    }),
      G.set(d, B + 0.02, s),
      I.set(d, B + 0.5 + u * 0.34, s),
      p.a > 0.05 && _e.seg(G, I, N(G, 1), N(I, 1), ta, 0.1 * p.a, 0.65 * p.a),
      io(f, I, Ne ? 22 : 28, 0.5, 0, 8 - u));
  });
  for (const f of Zo) {
    const { cx: u, z: h } = f.userData;
    h > Ct.value ||
      !f.visible ||
      (G.set(f.position.x, f.position.y + 0.08, f.position.z),
      I.set(u, B + 0.02, h),
      _e.seg(G, I, N(G, 0.9), N(I, 0.9), ta, 0.3, 0.55));
  }
  const c = ea.userData;
  if (((c.want = ft && m.sel >= 0 ? 1 : 0), m.sel >= 0)) {
    const f = L[m.sel],
      u = ut(f.peakW),
      h = Ce(f.peakW),
      p = (P(u, f.i, 0, t) + P(u, f.i, 1, t)) / 2;
    (c.set(f.name, "widest: " + he(f.peak) + " \xB7 " + Vo(S.weeks[f.peakW]), {
      big: 34,
      col: dn(f.col),
    }),
      G.set(p, B + 0.02, h),
      I.set(p, B + 0.9, h),
      c.a > 0.05 &&
        _e.seg(G, I, N(G, 1.1), N(I, 1.1), ta, 0.15 * c.a, 0.8 * c.a),
      io(ea, I, Ne ? 24 : 30, 0.5, 0, 20));
  } else io(ea, G.set(0, -99, 0), 30, 0, 0, 0);
  if (m.sel >= 0) {
    const f = L[m.sel],
      u = Ys.setRGB(...f.col).multiplyScalar(1.4);
    let h = !1;
    for (let p = uo; p <= Y; p += 2) {
      const d = P(p, f.i, 0, t),
        v = P(p, f.i, 1, t);
      if (v - d < 0.001) {
        h = !1;
        continue;
      }
      (po.set((d + v) / 2, B + 0.03, j[p].z),
        h && _e.seg(Qo, po, N(Qo, 1.6), N(po, 1.6), u, 0.8, 0.8),
        Qo.copy(po),
        (h = !0));
    }
  }
  (_e.end(), Ns());
}
const hn = L[S.lead[y]].i,
  pn = (P(Y, hn, 0, 0) + P(Y, hn, 1, 0)) / 2,
  Te = {
    lab: {
      t: [0.7, 0.7, 1.1],
      yaw: -0.1,
      pitch: 0.66,
      dist: 32.5,
      f: [0.4, 0.9, 1.6],
      r: 18,
      fit: [25, 16],
    },
    mouth: {
      t: [pn - 0.8, 0.75, F - 1],
      yaw: 0.48,
      pitch: 0.2,
      dist: 7.4,
      f: [pn - 0.4, 0.8, F - 0.6],
      r: 4,
      fit: [8, 4.6],
    },
    spring: {
      t: [1.1, 0.85, -5.9],
      yaw: 0.38,
      pitch: 0.5,
      dist: 7,
      f: [1.2, 0.85, -6.3],
      r: 3.6,
      fit: [8, 5],
    },
  },
  mn = {
    t: [0, 1, 0.6],
    yaw: -0.08,
    pitch: 0.86,
    dist: 30,
    f: [0, 1, 1],
    r: 18,
  },
  C = { t: new i.Vector3(0, 1, 0), yaw: 0, pitch: 0.5, dist: 27 };
let mo = 4,
  we = 1,
  oa = 1,
  Ne = !1,
  le = !1,
  aa = [24, 14],
  wn = 27,
  Xe = "lab";
const ce = A.domElement,
  Ye = new Map();
let wo = 0,
  pt = null,
  Ae = null,
  na = null;
const Dt = new i.Raycaster(),
  vn = new i.Vector2(),
  Z = new i.Vector3(),
  er = new i.Plane(new i.Vector3(0, 1, 0), -B),
  gn = new i.Plane(new i.Vector3(0, 1, 0), -O);
function mt(e) {
  const t = Ne && M.aspect < 0.8 && e === Te.lab ? { ...e, ...mn } : e;
  (C.t.set(...t.t),
    (C.yaw = t.yaw),
    (C.pitch = t.pitch),
    (C.dist = t.dist),
    at.set(...t.f),
    (mo = t.r),
    t.fit && ((aa = t.fit), (wn = t.dist)),
    (we = 1),
    (le = !1),
    Ln());
}
const yn = [],
  xn = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), yn.push(e));
  };
(Ja.forEach((e) => xn(e.hit, "link", { L: e })),
  Zo.forEach((e) =>
    e.traverse((t) => {
      t.isMesh &&
        xn(t, "plaque", { c: e.userData.st.c.i, w: e.userData.st.w0 });
    }),
  ));
const tr = (e) => {
  let t = e;
  for (; t.parent; t = t.parent) if (!t.visible) return !1;
  return t === U && t.visible;
};
function bn(e) {
  const t = ce.getBoundingClientRect();
  (vn.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Dt.setFromCamera(vn, M));
}
function sa(e) {
  bn(e);
  const t = Dt.intersectObjects(
    yn.filter((s) => s.visible && tr(s)),
    !1,
  )[0];
  if (t) return { ...t.object.userData.hk, point: t.point };
  if (
    Dt.ray.intersectPlane(gn, Z) &&
    Z.x < -T &&
    Z.x > $o &&
    Z.z > ke - 0.4 &&
    Z.z < F
  )
    return { kind: "ruler", w: k(Math.round(Jt(Z.z)), 0, y) };
  if (
    !Dt.ray.intersectPlane(er, Z) ||
    Math.abs(Z.x) > T ||
    Z.z < ke - 0.3 ||
    Z.z > F
  )
    return null;
  const o = dt(m.mV),
    a = k(Jt(Z.z), 0, y),
    n = ut(a);
  for (let s = 0; s < R; s++) {
    const r = P(n, s, 0, o),
      l = P(n, s, 1, o);
    if (l - r > 1e-4 && Z.x >= r - 0.03 && Z.x <= l + 0.03)
      return { kind: "chan", c: s, w: Math.round(a) };
  }
  return { kind: "land", w: Math.round(a) };
}
function or(e) {
  return (
    bn(e),
    Dt.ray.intersectPlane(gn, Z) ? k(Math.round(Jt(Z.z)), 0, y) : null
  );
}
function Be(e, t = !0) {
  ((m.w = k(Math.round(e), 0, y)), t && m.play && He(!1), ze(!0));
}
function Pt(e) {
  ((m.mode = e ? 1 : 0), ze(!0));
}
function Ft(e) {
  ((m.sel = e == null || e === m.sel ? -1 : e), ze(!0));
}
function He(e) {
  ((m.play = e),
    e && (m.w >= y && ((m.w = 0), (m.wV = 0)), (m.playAt = ie)),
    b("#play-ic").setAttribute(
      "d",
      e ? "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" : "M8 5.5v13l11-6.5z",
    ),
    b("#play").setAttribute("aria-label", e ? "Pause" : "Play"),
    ze(!0));
}
function ar(e) {
  if (!e || e.kind === "land") {
    m.sel >= 0 && Ft(-1);
    return;
  }
  switch (e.kind) {
    case "chan":
      Ft(e.c);
      break;
    case "plaque":
      ((m.sel = -1), Ft(e.c), Be(e.w));
      break;
    case "ruler":
      Be(e.w);
      break;
    case "link":
      window.open(Hn, "_blank", "noopener");
      break;
  }
}
function ra(e, t) {
  const o =
      (M.position.distanceTo(C.t) *
        2 *
        Math.tan(i.MathUtils.degToRad(M.fov / 2))) /
      Math.max(xe.clientHeight, 1),
    a = Math.cos(C.yaw),
    n = Math.sin(C.yaw);
  ((le = !0),
    (C.t.x = k(C.t.x - a * e * o, -14, 14)),
    (C.t.z = k(C.t.z + n * e * o, -10, 10)),
    (C.t.y = k(C.t.y + t * o, 0.4, 8)));
}
const Mn = {
    chan: (e) => {
      const t = L[e.c],
        o = e.w;
      return `${t.name} \xB7 ${t.labName} \xB7 ${o === y ? "last 7 days" : "week of " + Me(S.weeks[o])}: ${he(t.tok[o])} tokens, ${Mt(t.share[o])} of the river`;
    },
    plaque: (e) =>
      `${L[e.c].name}: number one from the week of ${Me(S.weeks[e.w])}. Click to follow it`,
    ruler: (e) =>
      (e.w === y ? "Last 7 days" : "Week of " + Me(S.weeks[e.w])) +
      ": click or drag along the timeline",
    link: () => "@RYANSAEL on X",
  },
  Je = b("#tip");
let Lt = null;
function nr(e) {
  const t = sa(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== Lt && (Lt?.over(!1), o?.over(!0), (Lt = o)),
    (ce.style.cursor =
      t && t.kind !== "land"
        ? t.kind === "ruler"
          ? "ns-resize"
          : "pointer"
        : ""));
  const a = t && Mn[t.kind] ? Mn[t.kind](t) : "";
  a
    ? ((Je.textContent = a),
      (Je.style.left = e.clientX + "px"),
      (Je.style.top = e.clientY + "px"),
      Je.classList.add("on"))
    : Je.classList.remove("on");
}
(ce.addEventListener("contextmenu", (e) => e.preventDefault()),
  ce.addEventListener("pointerleave", () => {
    (Lt?.over(!1),
      (Lt = null),
      Je.classList.remove("on"),
      (ce.style.cursor = ""));
  }),
  ce.addEventListener("pointerdown", (e) => {
    ve();
    try {
      ce.setPointerCapture(e.pointerId);
    } catch {}
    (Je.classList.remove("on"),
      Ye.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (pt = null));
    const t = e.button === 0 && !e.shiftKey && Ye.size === 1 ? sa(e) : null;
    ((na = t),
      (Ae =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null),
      t?.kind === "ruler" && ((m.scrub = !0), m.play && He(!1), Be(t.w)));
  }),
  ce.addEventListener("pointermove", (e) => {
    const t = Ye.get(e.pointerId);
    if (!t) {
      nr(e);
      return;
    }
    const o = e.clientX - t[0],
      a = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), m.scrub)) {
      const n = or(e);
      n != null && n !== m.w && Be(n);
      return;
    }
    if (
      (Ae &&
        Math.hypot(e.clientX - Ae[0], e.clientY - Ae[1]) > 6 &&
        (Ae = null),
      !Ae)
    ) {
      if (((le = !0), Ye.size === 2)) {
        const [n, s] = [...Ye.values()],
          r = Math.hypot(n[0] - s[0], n[1] - s[1]),
          l = [(n[0] + s[0]) / 2, (n[1] + s[1]) / 2];
        (wo && (we = k((we * wo) / r, 0.25, 2.2)),
          (wo = r),
          pt && ra(l[0] - pt[0], l[1] - pt[1]),
          (pt = l));
        return;
      }
      t[2]
        ? ra(o, a)
        : ((C.yaw -= o * 0.004),
          (C.pitch = k(C.pitch + a * 0.003, 0.02, 1.45)));
    }
  }));
const Sn = (e) => {
  (m.scrub
    ? (m.scrub = !1)
    : Ae && Ye.size === 1 && performance.now() - Ae[2] < 450 && ar(na),
    (Ae = null),
    (na = null),
    Ye.delete(e.pointerId),
    (wo = 0),
    (pt = null));
};
(ce.addEventListener("pointerup", Sn),
  ce.addEventListener("pointercancel", (e) => {
    ((Ae = null), Sn(e));
  }),
  ce.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        ve(),
        (le = !0),
        (we = k(
          we * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.25,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const wt = new Set();
(addEventListener("keyup", (e) => wt.delete(e.key.toLowerCase())),
  addEventListener("blur", () => wt.clear()));
const sr = new i.Vector3();
function rr() {
  if (!wt.size) return;
  const e = (wt.has("shift") ? 2.4 : 1) * Xo,
    t = (...n) => n.some((s) => wt.has(s));
  let o = 0,
    a = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (a += 1),
    t("s", "arrowdown") && (a -= 1),
    (o || a) &&
      (ra(o * e * 420, 0),
      C.t.addScaledVector(
        sr.set(-Math.sin(C.yaw), 0, -Math.cos(C.yaw)),
        a * e * 6,
      )),
    t("q") && (C.yaw += e * 1.1),
    t("e") && (C.yaw -= e * 1.1),
    t("=", "+") && (we = k(we * Math.exp(-e * 1.3), 0.25, 2.2)),
    t("-", "_") && (we = k(we * Math.exp(e * 1.3), 0.25, 2.2)),
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
    ) && (le = !0));
}
let vt = !0,
  _t = -99,
  Et = -1,
  J = null,
  Vt = 0;
const Ut = (e) => () => {
    ((m.wV = Math.min(m.wV, e)), Be(e, !1));
  },
  kn = (e) => () => He(e),
  Cn = (e) => () => Pt(e),
  ia = [
    {
      ...Te.lab,
      dy: 0.002,
      hold: 33,
      beats: [
        [0, Ut(y)],
        [4.5, Ut(0)],
        [5.3, kn(!0)],
        [31, kn(!1)],
      ],
    },
    { ...Te.mouth, dy: 0.012, hold: 10, beats: [[0, Ut(y)]] },
    { ...Te.spring, dy: 0.01, hold: 8, beats: [[0, Ut(y)]] },
    {
      t: [0, 1, 0.2],
      yaw: -0.06,
      pitch: 1.05,
      dist: 27,
      dy: -0.004,
      f: [0, 1, 0.2],
      r: 20,
      hold: 11,
      beats: [
        [0, Ut(y)],
        [0.6, Cn(1)],
        [8, Cn(0)],
      ],
    },
  ];
function Tn(e, t) {
  ((Et = e), (J = ia[e]), (Vt = 0));
  const o = Ne && M.aspect < 0.8 && e === 0 ? { ...J, ...mn } : J;
  (mt(o), (_t = t));
}
function ir(e) {
  (e < _t - 1 && (_t = e),
    (!J || e - _t > J.hold) && Tn((Et + 1) % ia.length, e));
  const t = e - _t;
  if (!(t < 0)) {
    for (; Vt < J.beats.length && t >= J.beats[Vt][0];)
      (J.beats[Vt][1](), Vt++);
    le ||
      ((C.yaw = J.yaw + t * J.dy),
      (C.dist = J.dist * (1 - t * 0.004)),
      at.set(...J.f),
      (mo = J.r));
  }
}
function Qe(e) {
  ((vt = e),
    b("#cine").classList.toggle("on", e),
    b("#cine").setAttribute("aria-pressed", e),
    e
      ? ((J = null), (Et = -1), (le = !1), (we = 1))
      : m.mode && Et === 3 && Pt(0));
}
let la = null;
const ve = () => {
  ((la = null), vt && Qe(!1));
};
function ca() {
  (Qe(!1), mt(Te[Xe]));
}
function lr(e) {
  const t = le ? 0 : Math.sin(e / 8) * 0.015,
    o = C.dist * we * oa,
    a = C.yaw + t,
    n = Math.asin(k((0.3 - C.t.y) / Math.max(o, 0.1), -1, 1)),
    s = Math.max(C.pitch, n),
    r = Math.cos(s);
  if (
    (M.position.set(
      C.t.x + Math.sin(a) * r * o,
      C.t.y + Math.sin(s) * o,
      C.t.z + Math.cos(a) * r * o,
    ),
    M.lookAt(C.t),
    !vt && !le)
  ) {
    const u = la || Te[Xe];
    (at.set(...u.f), (mo = u.r));
  }
  const l = M.position.distanceTo(le ? C.t : at),
    c = le ? Math.min(1, Xo * 5) : 1,
    f = (le ? Math.max(2.4, l * 0.35) : mo) * w.focalBand;
  ((re.u.focus.value += (l - re.u.focus.value) * c),
    (re.u.range.value += (f - re.u.range.value) * c),
    re.u.cocScale.value.set(w.apertureNear, w.aperture));
}
const Ot = b("#week"),
  An = b("#seg-w");
((Ot.max = y),
  [...An.children].forEach(
    (e) =>
      (e.onclick = () => {
        (ve(), Pt(+e.dataset.i));
      }),
  ),
  (b("#play").onclick = () => {
    (ve(), He(!m.play));
  }),
  (Ot.oninput = () => {
    (ve(), Be(+Ot.value));
  }));
const cr = (e) => (e === y ? "Last 7 days" : Me(S.weeks[e]));
let Rn = 0;
function fr() {
  const e = m.w,
    t = L[S.lead[e]],
    o = (n) => Mt(vs("anthropic", n));
  if (m.sel >= 0) {
    const n = L[m.sel],
      s =
        n.tok[e] > 0
          ? `${e === y ? "In the last 7 days" : "That week"}: <span class="a">${he(n.tok[e])}</span>, ${Mt(n.share[e])} of the river.`
          : e < n.born
            ? "Not in the river yet that week."
            : "Dry that week.";
    return n.rest
      ? `<b>${Yt(n.name)}</b>, together: every model that never made a week's top ten. At its widest ${he(n.peak)} a week. ${s}`
      : `<b>${Yt(n.name)}</b> (${Yt(n.labName)}): in the river from the week of ${Me(S.weeks[n.born])}, at its widest <span class="a">${he(n.peak)}</span> a week in ${Vo(S.weeks[n.peakW])}${n.lead ? `, number one for ${n.lead} week${n.lead > 1 ? "s" : ""}` : ""}. ${s}`;
  }
  const a = `<b>${Yt(t.name)}</b>${t.stealth ? ", a stealth model," : ""}`;
  return e === y
    ? `Last 7 days: ${a} takes number one with <span class="a">${he(t.tok[e])}</span> tokens. Anthropic's share of the river: <span class="a">${o(0)}</span> in Jan 2025, <span class="a">${o(e)}</span> now.`
    : `Week of ${Me(S.weeks[e])}: ${a} leads with <span class="a">${he(t.tok[e])}</span> of ${he(Se[e])} tokens, ${Mt(t.share[e])} of the river. Anthropic's share: <span class="a">${o(e)}</span>.`;
}
function ze(e) {
  if (!e && ie - Rn < 0.1) return;
  ((Rn = ie),
    [...An.children].forEach((o, a) => {
      (o.classList.toggle("on", a === m.mode),
        o.setAttribute("aria-pressed", a === m.mode));
    }),
    (Ot.value = m.w),
    Ot.style.setProperty("--p", (m.w / y) * 100 + "%"),
    (b("#week-v").textContent = cr(m.w)));
  const t = fr();
  t !== ze.w && ((b("#why").innerHTML = t), (ze.w = t));
}
{
  const e = S.asOf ? Me(S.asOf.slice(0, 10)) : "",
    t = Math.round(
      (Date.parse(Oo(y)) - Date.parse(S.weeks[0])) / 864e5 / 30.44,
    );
  ((b("#s-x").textContent = Math.round(Se[y] / Se[0]) + "x"),
    (b("#s-x-l").textContent = `in ${t} months`),
    (b("#s-m").textContent = S.models),
    (b("#s-c").textContent = S.changes),
    (b("#sub").textContent = `${t} months of AI usage as one river.`),
    (b("#src").innerHTML =
      `Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}`));
  const o = S.channels.length;
  ((b("#info-exact").innerHTML =
    `<b>Exact</b>: a channel's width is proportional to that model's tokens over one week (Tokens), or to its share of all the tokens that week (Share). The weeks are sums of OpenRouter's daily totals, from the week of ${Me(S.weeks[0])} to the week to ${Me(Oo(y))}; the last one ends on the most recent complete day. The tiles: the last week's tokens over the first week's (${Math.round(Se[y] / Se[0])}x), every model that appeared in a day's top 50 (${S.models}), and how often the number one changed from one week to the next (${S.changes}). The plaques mark every stint at number one of three weeks or more, every stealth model that took the top, and the model on top now.<br><b>Drawn</b>: between two weekly sums the width follows a smooth curve, and each week is averaged lightly with the two either side so a channel bends instead of jittering (the last week is drawn as measured); every number on screen is the week's own. The islands, the bends of the river, the hills and the trees are not data: they keep the labs apart and make it a landscape. The ${o} channels are the models that were in some week's top ten; every other model runs in one grey channel along the far left bank. OpenRouter lists free variants as separate models, so they run as their own channels, named "(free)". Colours are by lab, each model a shade of its lab's colour.`),
    (b("#info-src").innerHTML =
      `OpenRouter's daily token totals for the top 50 models and everything else (rankings-daily), summed by week. CC BY 4.0. Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}.`));
}
const Ge = [
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
let ge = 0,
  Dn = 0,
  fa = 0,
  ua = 0,
  vo = 0;
function ye() {
  (A.setPixelRatio(w.pixelRatio),
    se.setPixelRatio(w.pixelRatio),
    bt.rt.samples !== w.msaa && ((bt.rt.samples = w.msaa), bt.rt.dispose()),
    (Da.enabled = !!w.smaa),
    E.shadow.mapSize.x !== w.shadow &&
      (E.shadow.mapSize.set(w.shadow, w.shadow),
      E.shadow.map?.dispose(),
      (E.shadow.map = null)),
    (Fe.enabled = !!w.bloom),
    (Fe.radius = w.bloomRadius),
    (V.enabled = !0),
    V.updateGtaoMaterial({
      radius: w.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: w.ao ? w.aoSamples : 2,
    }),
    (re.enabled = !!w.dof),
    (re.u.maxCoc.value = w.maxCoc),
    mr(),
    _n());
}
function Ie() {
  ((b("#tune-rows").innerHTML = Ge.map(([e, t, o, a, , n, s], r) => {
    const l = w[e],
      c = ((l - o) / (a - o)) * 100;
    return `<div class="tr${r === ge ? " sel" : ""}${s ? " sub" : ""}" data-i="${r}"><b>${t}</b><span class="tk"><i style="left:${k(c, 0, 100)}%"></i></span><u>${n(l)}</u></div>`;
  }).join("")),
    b("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((ge = +e.dataset.i), Ie());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (ge = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const a = (n) => {
            const s = t.getBoundingClientRect(),
              [r, , l, c, f] = Ge[ge],
              u = k(
                Math.round(
                  (l + ((n.clientX - s.left) / s.width) * (c - l)) / f,
                ) * f,
                l,
                c,
              );
            u !== w[r] &&
              ((w[r] = +u.toFixed(4)), r !== "auto" && (w.auto = 0), ye());
            const h = t.querySelector("i");
            ((h.style.left = k(((w[r] - l) / (c - l)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = Ge[ge][5](w[r])),
              (b("#tune-json").value = JSON.stringify(w)));
          };
          (a(o),
            (t.onpointermove = (n) => {
              t.hasPointerCapture(n.pointerId) && a(n);
            }),
            (t.onpointerup = () => Ie()));
        };
      }),
    (b("#tune-json").value = JSON.stringify(w)));
}
function ur(e, t) {
  const [o, , a, n, s] = Ge[ge],
    r = k(+(w[o] + e * s * (t ? 5 : 1)).toFixed(4), a, n);
  r !== w[o] && ((w[o] = r), o !== "auto" && (w.auto = 0), ye(), Ie());
}
function Pn(e) {
  const t = b("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && Ie());
}
function dr(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (ge = (ge + (t === "ArrowUp" ? -1 : 1) + Ge.length) % Ge.length),
      Ie(),
      b("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (ur(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , a, n, s] = Ge[ge];
    return n - a === s
      ? ((w[o] = w[o] ? 0 : 1), o !== "auto" && (w.auto = 0), ye(), Ie(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(w, Po) : (w[Ge[ge][0]] = Po[Ge[ge][0]]),
      (w.auto = 0),
      ye(),
      Ie(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(w, null, 1)), !0)
      : t === "Escape"
        ? (Pn(!1), !0)
        : !1;
}
b("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in Po) typeof t[o] == "number" && (w[o] = t[o]);
    ((w.auto = 0), ye(), Ie());
  } catch {
    Ie();
  }
});
const go = b("#ui-hint");
let Fn = -9;
function yo(e) {
  ((go.textContent = e), go.classList.add("on"), (Fn = ie));
}
const da = ["lab", "mouth", "spring"],
  hr = {
    lab: "The whole river",
    mouth: "The edge: the last weeks",
    spring: "The spring: January 2025",
  };
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Pn());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) &&
      e.target.type !== "range") ||
    b("#info").open
  )
    return;
  if (!b("#tune").hidden && dr(e)) {
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
    if (e.target.type === "range") return;
    (t.startsWith("arrow") && e.preventDefault(),
      t !== "shift" && ve(),
      wt.add(t));
    return;
  }
  t === "1" || t === "2"
    ? (ve(),
      Pt(+t - 1),
      yo(t === "1" ? "Width: tokens" : "Width: share of the week"))
    : t === " "
      ? (e.preventDefault(), ve(), He(!m.play))
      : t === "." || t === ">"
        ? (ve(), Be(m.w + 1))
        : t === "," || t === "<"
          ? (ve(), Be(m.w - 1))
          : t === "escape"
            ? m.sel >= 0 && Ft(-1)
            : t === "v"
              ? (ve(),
                (Xe = da[(da.indexOf(Xe) + 1) % da.length]),
                mt(Te[Xe]),
                yo(hr[Xe]))
              : t === "c"
                ? b("#cine").click()
                : t === "r"
                  ? ca()
                  : t === "n"
                    ? ((ft = !ft), yo(ft ? "Labels on" : "Labels off"))
                    : t === "/" &&
                      (e.preventDefault(),
                      ko.classList.toggle("ui-off"),
                      yo(
                        ko.classList.contains("ui-off")
                          ? "Interface hidden \xB7 / to show"
                          : "Interface shown",
                      ));
}),
  (b("#cine").onclick = () => {
    vt ? ca() : Qe(!0);
  }),
  ce.addEventListener("dblclick", (e) => {
    const t = sa(e);
    (!t || t.kind === "land") && ca();
  }),
  (b("#how").onclick = () => b("#info").showModal()),
  (b("#close").onclick = () => b("#info").close()),
  b("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    b("#tune").hidden || (b("#tune-fps").textContent = Math.round(Dn) + " fps");
  }, 500));
const pr = {
  bg: "#0d1119",
  fog: "#151b28",
  fogD: 0.003,
  exp: 0.95,
  envI: 0.4,
  bloomT: 1.1,
  bloomS: 0.3,
  refl: 0.4,
  hemi: [9414360, 4864554, 0.42],
  sun: [16763289, 1.15],
  sunDir: [-0.5, 0.62, 0.42],
  rim: 0.6,
  key2: 0.3,
};
function mr() {
  const e = pr;
  (U.background.set(e.bg),
    U.fog.color.set(e.fog),
    (U.fog.density = e.fogD * w.fog),
    (A.toneMapping = i.ACESFilmicToneMapping),
    (A.toneMappingExposure = w.exposure * e.exp),
    (U.environment = To.show),
    (U.environmentIntensity = w.env * e.envI),
    (Fe.threshold = w.bloomThreshold * e.bloomT),
    (Fe.strength = w.bloomStrength * e.bloomS),
    ($t.uReflStrength.value = w.reflect * e.refl),
    Gt.color.set(e.hemi[0]),
    Gt.groundColor.set(e.hemi[1]),
    (Gt.intensity = e.hemi[2] * w.fill),
    E.color.set(e.sun[0]),
    (E.intensity = e.sun[1] * w.sun),
    E.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    E.target.position.set(0, 1, 0),
    (gt.intensity = e.rim * w.rim),
    (It.intensity = e.key2 * w.fill),
    (xa.value = w.sat));
}
(gt.position.set(4, 20, -15),
  gt.color.set(10274559),
  It.position.set(-10, 14, 12),
  Object.assign(E.shadow.camera, {
    left: -17,
    right: 17,
    top: 13,
    bottom: -13,
    near: 1,
    far: 70,
  }),
  E.shadow.camera.updateProjectionMatrix());
function Ln() {
  const e = xe.clientWidth,
    t = xe.clientHeight;
  Ne = e < 900;
  const o = w.fov + (Ne ? 8 : 0);
  (M.fov !== o && ((M.fov = o), M.updateProjectionMatrix()),
    M.setViewOffset(
      e,
      t,
      Ne ? 0 : -e * 0.015,
      Ne ? t * 0.06 : -t * 0.035,
      e,
      t,
    ));
  const a = 2 * Math.tan(i.MathUtils.degToRad(M.fov / 2));
  oa =
    M.aspect < 0.8
      ? k(0.62 / Math.max(M.aspect, 0.4), 1, 1.5)
      : k(Math.max(aa[0] / (a * M.aspect), aa[1] / a) / wn, 0.85, 2.2);
}
function _n() {
  const e = xe.clientWidth,
    t = xe.clientHeight;
  ((M.aspect = e / t),
    M.updateProjectionMatrix(),
    A.setSize(e, t),
    se.setSize(e, t));
  const o = A.getDrawingBufferSize(new i.Vector2());
  (Ao.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    Ra.uRes.value.copy(o),
    Ln(),
    M.updateProjectionMatrix());
}
addEventListener("resize", _n);
let En = performance.now(),
  ha = 0,
  pa = 0,
  Vn = 0;
function ma(e) {
  ((Rt = Math.max(0, (e - En) / 1e3)),
    (Yo = Math.min(1.5, Rt)),
    (Xo = Math.min(0.1, Yo)),
    (En = e));
  const t = e / 1e3;
  if (
    ((ie = t),
    vt && ir(t),
    rr(),
    ln(Rt),
    fn(Math.min(Rt, 0.25)),
    lr(t),
    M.updateMatrixWorld(),
    (A.shadowMap.needsUpdate = !0),
    Qs(t),
    ze(),
    go.classList.contains("on") && ie - Fn > 1.5 && go.classList.remove("on"),
    (ha += Yo),
    pa++,
    e - Vn > 1600)
  ) {
    const o = pa / Math.max(ha, 0.001);
    ((ha = 0),
      (pa = 0),
      (Vn = e),
      (Dn = o),
      ua++,
      ua > 2 && (fa = Math.max(fa, o)),
      (vo = ua > 3 && o < fa * 0.74 ? vo + 1 : 0),
      !document.hidden &&
        w.auto &&
        vo >= 2 &&
        o < 50 &&
        ((vo = 0),
        w.pixelRatio > 1
          ? ((w.pixelRatio = Math.max(1, +(w.pixelRatio - 0.25).toFixed(2))),
            ye())
          : w.reflect
            ? ((w.reflect = 0), ye())
            : w.msaa > 0
              ? ((w.msaa = 0), ye())
              : w.ao && ((w.ao = 0), ye())));
  }
  (es(), A.info.reset(), se.render());
}
let Un = !0;
function On(e) {
  (requestAnimationFrame(On), Un && ma(e));
}
ln(0);
for (let e = 0; e < 40; e++) fn(0.2);
(ye(),
  mt(Te.lab),
  Qe(!0),
  b("#loading").remove(),
  ze(!0),
  requestAnimationFrame(On),
  (window.__step = (e) => ma(e)),
  (window.__loop = (e) => {
    Un = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = A.domElement,
      a = document.createElement("canvas");
    return (
      (a.width = e),
      (a.height = Math.round((e * o.height) / o.width)),
      a.getContext("2d").drawImage(o, 0, 0, a.width, a.height),
      a.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    ma(o ?? performance.now());
    const a = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + ya + "/_shots/" + e + ".webp",
        { method: "POST", body: a },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (Qe(!1), (la = e), e && mt({ fit: null, ...e }));
    },
    view: (e) => {
      (Qe(!1), (Xe = e), mt(Te[e]));
    },
    cut: (e) => {
      (Qe(!0), Tn(e, ie));
    },
    week: (e) => {
      (He(!1), (m.w = m.wV = k(Math.round(e), 0, y)), ze(!0));
    },
    mode: (e) => {
      (Pt(e), (m.mV = m.mode));
    },
    sel: (e) => {
      ((m.sel = -1),
        Ft(typeof e == "string" ? L.findIndex((t) => t.name === e) : e));
    },
    play: (e) => He(!!e),
    tags: (e) => {
      ft = !!e;
    },
    tune: (e) => (Object.assign(w, e), ye(), { ...w }),
    ST: m,
    HERO: Te,
    SHOTS: ia,
    CH: L,
    DATA: S,
    PLAQUES: Go,
  }),
  (window.__x = {
    dof: re,
    gtao: V,
    bloom: Fe,
    renderer: A,
    camera: M,
    scene: U,
    composer: se,
    cam: C,
    RT: w,
    overlay: Zt,
    rays: _e,
    RIVER: so,
    TERR: Tt,
  }),
  (window.__dbg = () => ({
    t: +ie.toFixed(2),
    shot: Et,
    cine: vt,
    w: m.w,
    wV: +m.wV.toFixed(2),
    mode: m.mode,
    mV: +m.mV.toFixed(2),
    sel: m.sel >= 0 ? L[m.sel].name : null,
    play: m.play,
    fit: +oa.toFixed(3),
    focus: +re.u.focus.value.toFixed(2),
    range: +re.u.range.value.toFixed(2),
    calls: A.info.render.calls,
    tris: A.info.render.triangles,
    trees: ro.count,
  })));
