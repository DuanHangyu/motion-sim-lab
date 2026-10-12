import * as i from "three";
import { EffectComposer as Rs } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as To,
  FullScreenQuad as Ht,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as dn } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Fs } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as ks } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as As } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as Ls } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as _s } from "three/addons/utils/BufferGeometryUtils.js";
const z = (e) => document.querySelector(e),
  te = z("#world"),
  Co = z("#app"),
  B = (e, t, o) => (e < t ? t : e > o ? o : e),
  hn = (e, t, o) => e + (t - e) * o,
  Ds = (e, t, o) => {
    const s = B((o - e) / (t - e), 0, 1);
    return s * s * (3 - 2 * s);
  },
  ir = (e) => 1 - (1 - e) ** 3,
  lr = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function re(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const cr = re(7),
  Ct = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Es = "https://x.com/ryansael",
  pn = "mirror-city",
  N = new i.Scene();
((N.background = new i.Color("#10151f")),
  (N.fog = new i.FogExp2("#1a2130", 0.0065)));
const C = new i.PerspectiveCamera(30, 1, 0.3, 320);
let L;
try {
  L = new i.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (z("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const Ps = 25e5,
  Os = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return B(Math.min(devicePixelRatio, 2, Math.sqrt(Ps / (e * t))), 1, 2);
  },
  jt = Os();
(L.setPixelRatio(jt),
  (L.info.autoReset = !1),
  (L.shadowMap.enabled = !0),
  (L.shadowMap.type = i.PCFShadowMap),
  (L.shadowMap.autoUpdate = !1),
  (L.transmissionResolutionScale = 0.6),
  (L.toneMapping = i.ACESFilmicToneMapping),
  te.appendChild(L.domElement));
const qt = new i.HemisphereLight(9414360, 3813414, 0.5);
N.add(qt);
const V = new i.DirectionalLight(16763279, 2.1);
((V.castShadow = !0),
  V.shadow.mapSize.set(2048, 2048),
  Object.assign(V.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (V.shadow.normalBias = 0.03),
  (V.shadow.bias = -4e-4),
  (V.shadow.radius = 2),
  N.add(V, V.target));
const Bs = new i.Vector3(0.62, 0.62, 0.48).normalize();
(V.position.copy(Bs).multiplyScalar(30), V.target.position.set(0, 2, 0));
const zt = new i.DirectionalLight(9427199, 0.9);
(zt.position.set(-6, 9, -14), N.add(zt));
const Kt = new i.DirectionalLight(16773600, 0.55);
(Kt.position.set(-8, 12, 10), N.add(Kt));
const Yt = new i.Group();
N.add(Yt);
const Le = 10,
  st = {
    pos: {
      value: Array.from({ length: Le }, () => new i.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: Le }, () => new i.Vector3()) },
  },
  Vs = `uniform vec4 uFakePos[${Le}];uniform vec3 uFakeCol[${Le}];uniform float uSat;`,
  Gs = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${Le};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  Ns = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  mn = { value: 1.16 };
function Te(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: st.pos,
        uFakeCol: st.col,
        uSat: mn,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + Vs,
          )
          .replace("#include <lights_fragment_end>", Gs)
          .replace("#include <opaque_fragment>", Ns)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => pn + (t ? t.key : "")),
    e
  );
}
const xn = [];
function _e(e, t, o, s, n, a) {
  const c = { p: new i.Vector3(e, t, o), c: new i.Color(s), r: n, i: a, i0: a };
  return (xn.push(c), c);
}
const Xt = new i.Vector3(),
  Y = [],
  at = new i.Vector3(0, 3, 0);
function Us(e) {
  Y.length = 0;
  for (const t of xn)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        Y.length < Le)
      )
        (Y.push(t), Y.length === Le && Y.sort((o, s) => o.score - s.score));
      else if (t.score > Y[0].score) {
        Y[0] = t;
        for (let o = 0; o < Le - 1 && Y[o].score > Y[o + 1].score; o++) {
          const s = Y[o];
          ((Y[o] = Y[o + 1]), (Y[o + 1] = s));
        }
      }
    }
}
function vn(e, t) {
  Us(t);
  for (let o = 0; o < Le; o++) {
    const s = Y[o];
    if (!s) {
      (st.col.value[o].set(0, 0, 0), st.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (Xt.copy(s.p).applyMatrix4(e.matrixWorldInverse),
      st.pos.value[o].set(Xt.x, Xt.y, Xt.z, 1 / (s.r * s.r)),
      st.col.value[o].set(s.c.r * s.i, s.c.g * s.i, s.c.b * s.i));
  }
}
const zo = {};
{
  const e = new i.PMREMGenerator(L),
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
  const o = (s, n, a, c, r, l) => {
    const f = new i.Mesh(
      new i.BoxGeometry(s, n, 0.4),
      new i.MeshBasicMaterial({ color: new i.Color(...a) }),
    );
    (f.position.set(c, r, l), f.lookAt(0, 0, 0), t.add(f));
  };
  (o(14, 2.2, [3.2, 2.6, 2.1], -6, 18, 22),
    o(10, 2, [1.6, 2.4, 3.4], 18, 14, -10),
    o(30, 1, [3.6, 2.2, 1.1], 0, -4, -30),
    o(8, 3, [2.4, 1.7, 1.1], -28, 6, 4),
    (zo.show = e.fromScene(t, 0.03).texture),
    e.dispose());
}
((N.environment = zo.show), (N.environmentIntensity = 0.55));
const gn = 3.4,
  Ro = new i.WebGLRenderTarget(1, 1, {
    type: i.HalfFloatType,
    generateMipmaps: !0,
    minFilter: i.LinearMipmapLinearFilter,
  }),
  Zt = {
    tReflect: { value: Ro.texture },
    uReflMatrix: { value: new i.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  Is = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, Zt),
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
  ie = new i.PerspectiveCamera(),
  Jt = new i.Vector3(0, 1, 0),
  Rt = new i.Vector3(0, gn, 0),
  Fo = new i.Vector3(),
  Qt = new i.Vector3(),
  ko = new i.Matrix4(),
  Ft = new i.Plane(),
  De = new i.Vector4(),
  wn = new i.Vector4(),
  Ce = [];
function $s() {
  if (
    !g.reflect ||
    Zt.uReflStrength.value <= 0 ||
    C.position.y <= gn ||
    !V.shadow.map
  )
    return;
  (Fo.setFromMatrixPosition(C.matrixWorld),
    ko.extractRotation(C.matrixWorld),
    ie.position.subVectors(Rt, Fo).reflect(Jt).negate().add(Rt),
    Qt.set(0, 0, -1).applyMatrix4(ko).add(Fo),
    Qt.subVectors(Rt, Qt).reflect(Jt).negate().add(Rt),
    ie.up.set(0, 1, 0).applyMatrix4(ko).reflect(Jt),
    ie.lookAt(Qt),
    (ie.far = C.far),
    ie.updateMatrixWorld(),
    ie.projectionMatrix.copy(C.projectionMatrix),
    Zt.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(ie.projectionMatrix)
      .multiply(ie.matrixWorldInverse),
    Ft.setFromNormalAndCoplanarPoint(Jt, Rt).applyMatrix4(
      ie.matrixWorldInverse,
    ),
    De.set(Ft.normal.x, Ft.normal.y, Ft.normal.z, Ft.constant));
  const e = ie.projectionMatrix.elements;
  (wn.set(
    (Math.sign(De.x) + e[8]) / e[0],
    (Math.sign(De.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    De.multiplyScalar(2 / De.dot(wn)),
    (e[2] = De.x),
    (e[6] = De.y),
    (e[10] = De.z + 1),
    (e[14] = De.w));
  const t = Ce.map((s) => s.visible),
    o = L.shadowMap.needsUpdate;
  (Ce.forEach((s) => (s.visible = !1)),
    Ao.forEach((s) => (s.visible = !0)),
    (L.shadowMap.needsUpdate = !1),
    vn(ie, at),
    L.setRenderTarget(Ro),
    L.clear(),
    L.render(N, ie),
    L.setRenderTarget(null),
    Ce.forEach((s, n) => (s.visible = t[n])),
    Ao.forEach((s) => (s.visible = !1)),
    (L.shadowMap.needsUpdate = o));
}
const Ao = [],
  Ws =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  eo = (e, t) =>
    new i.ShaderMaterial({
      uniforms: t,
      vertexShader: Ws,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class Hs extends To {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new i.WebGLRenderTarget(1, 1, {
        type: i.HalfFloatType,
        samples: t,
        depthTexture: new i.DepthTexture(1, 1),
      })),
      (this.quad = new Ht(
        eo(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, s) {
    (vn(C, at),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(N, C),
      t.setRenderTarget(s),
      this.quad.render(t));
  }
}
const yn = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class js extends To {
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
        near: { value: C.near },
        far: { value: C.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new i.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new i.Vector2() },
        fullTexel: { value: new i.Vector2() },
      }),
      (this.pre = new Ht(
        eo(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${yn}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Ht(
        eo(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=1.05/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Ht(
        eo(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${yn}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   b.rgb=b.rgb*.4+(texture2D(tBlur,vUv+o*vec2(1.5,.6)).rgb+texture2D(tBlur,vUv-o*vec2(1.5,.6)).rgb+texture2D(tBlur,vUv+o*vec2(-.6,1.5)).rgb+texture2D(tBlur,vUv-o*vec2(-.6,1.5)).rgb)*.15;   // a soft tent over the gather: no grain in the bokeh
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(t, o) {
    const s = Math.ceil(t / 2),
      n = Math.ceil(o / 2);
    (this.half.setSize(s, n),
      this.blurRT.setSize(s, n),
      this.u.texel.value.set(1 / s, 1 / n),
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
    pixelRatio: jt,
    msaa: jt >= 1.5 ? 2 : 4,
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
  Lo = { ...g },
  le = new Rs(
    L,
    new i.WebGLRenderTarget(1, 1, { type: i.HalfFloatType, depthBuffer: !1 }),
  );
le.setPixelRatio(jt);
const kt = new Hs(g.msaa);
le.addPass(kt);
const G = new dn(N, C, 1, 1);
((G.output = dn.OUTPUT.Off),
  (G.needsSwap = !1),
  G.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  G.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const qs = G.setSize.bind(G),
  Ks = G.render.bind(G);
G.setSize = (e, t) => qs(Math.ceil(e / 2), Math.ceil(t / 2));
const ce = [],
  bn = [];
((G.render = (e, t, o) => {
  (ce.forEach((s, n) => {
    ((bn[n] = s.visible), (s.visible = !1));
  }),
    Ks(e, t, o),
    ce.forEach((s, n) => (s.visible = bn[n])),
    (G.blendMaterial.uniforms.intensity.value = g.ao ? g.aoIntensity : 0),
    (G.blendMaterial.uniforms.tDiffuse.value = G.pdRenderTarget.texture),
    G._renderPass(e, G.blendMaterial, o));
}),
  le.addPass(G));
const Ee = new Fs(new i.Vector2(256, 256), 0.42, 0.55, 1.05),
  Ys = Ee.setSize.bind(Ee);
((Ee.setSize = (e, t) => Ys(Math.ceil(e / 2), Math.ceil(t / 2))),
  le.addPass(Ee));
const fe = new js();
((fe.u.tDepth.value = kt.rt.depthTexture), le.addPass(fe));
const to = new i.Scene(),
  Mn = {
    tSceneDepth: { value: G.depthTexture },
    uRes: { value: new i.Vector2(1, 1) },
    uNF: { value: new i.Vector2(C.near, C.far) },
  };
class Xs extends To {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, s) {
    const n = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(s),
      t.render(to, C),
      (t.autoClear = n));
  }
}
(le.addPass(new Xs()), le.addPass(new ks()));
const Sn = new As();
le.addPass(Sn);
const Zs = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  Tn = (e, t, o, s = 0.06, n = 2) =>
    new Ls(e, t, o, n, Math.min(s, Math.min(e, t, o) / 2.02)),
  Pe = new Map();
function E(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    Pe.has(o) ||
      Pe.set(
        o,
        Te(
          new i.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    Pe.get(o)
  );
}
function Js(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    Pe.has(o) ||
      Pe.set(
        o,
        Te(
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
    Pe.get(o)
  );
}
function oe(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    Pe.has(o) ||
      Pe.set(
        o,
        Te(
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
    Pe.get(o)
  );
}
const Oe = (e, t = 1) =>
    new i.MeshBasicMaterial({
      color: new i.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  fr = (e = {}) =>
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
  ur = oe("#434a55", { roughness: 0.36 }),
  _o = oe("#23272e", { roughness: 0.42, metalness: 0.7 }),
  dr = oe("#15171b", { roughness: 0.46, metalness: 0.55 }),
  hr = oe("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  Cn = oe("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  pr = E("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  mr = oe("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  xr = oe("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  Qs = new i.Matrix4(),
  $e = new i.Quaternion(),
  At = new i.Euler(0, 0, 0, "YXZ"),
  rt = new i.Vector3(1, 1, 1),
  vr = new i.Color(),
  gr = new i.Vector3(1, 0, 0),
  zn = new i.Vector3(0, 1, 0),
  wr = new i.Vector3(0, 0, 1),
  ea = new i.Vector3(),
  ta = new i.Quaternion();
function j() {
  const e = new Map(),
    t = (o, s, n, a, c, r) => {
      s = s.index ? s.toNonIndexed() : s;
      for (const f of Object.keys(s.attributes))
        ["position", "normal", "uv"].includes(f) || s.deleteAttribute(f);
      (s.attributes.uv ||
        s.setAttribute(
          "uv",
          new i.Float32BufferAttribute(
            new Float32Array(s.attributes.position.count * 2),
            2,
          ),
        ),
        r.dir
          ? ($e.setFromUnitVectors(
              zn,
              ea.set(r.dir[0], r.dir[1], r.dir[2]).normalize(),
            ),
            r.roll && $e.multiply(ta.setFromAxisAngle(zn, r.roll)))
          : (At.set(r.rx || 0, r.ry || 0, r.rz || 0), $e.setFromEuler(At)),
        s.applyMatrix4(
          Qs.compose(
            { x: n, y: a, z: c },
            $e,
            r.s ? rt.set(r.s[0], r.s[1], r.s[2]) : rt.set(1, 1, 1),
          ),
        ));
      let l = e.get(o);
      (l || e.set(o, (l = { mat: o, list: [] })), l.list.push(s));
    };
  return {
    box(o, s, n, a, c, r, l, f = {}) {
      return (
        t(o, f.r ? Tn(c, r, l, f.r) : new i.BoxGeometry(c, r, l), s, n, a, f),
        this
      );
    },
    cyl(o, s, n, a, c, r, l, f = {}) {
      return (
        t(o, new i.CylinderGeometry(c, r, l, f.seg || 20), s, n, a, f),
        this
      );
    },
    cone(o, s, n, a, c, r, l = {}) {
      return (
        t(
          o,
          new i.ConeGeometry(c, r, l.seg || 6).translate(0, r / 2, 0),
          s,
          n,
          a,
          l,
        ),
        this
      );
    },
    sph(o, s, n, a, c, r = {}) {
      return (
        t(o, new i.SphereGeometry(c, r.seg || 14, r.seg2 || 10), s, n, a, r),
        this
      );
    },
    tor(o, s, n, a, c, r, l = {}) {
      return (
        t(o, new i.TorusGeometry(c, r, l.seg2 || 8, l.seg || 40), s, n, a, l),
        this
      );
    },
    geo(o, s, n = 0, a = 0, c = 0, r = {}) {
      return (t(o, s.clone(), n, a, c, r), this);
    },
    flush(o, s = !0) {
      const n = [];
      for (const { mat: a, list: c } of e.values()) {
        const r = new i.Mesh(_s(c), a);
        ((r.castShadow = s),
          (r.receiveShadow = !0),
          o.add(r),
          n.push(r),
          c.forEach((l) => l.dispose()));
      }
      return (e.clear(), n);
    },
  };
}
const Do = [];
document.fonts?.ready.then(() => Do.forEach((e) => e()));
function Rn(e, t, o, s, n, a = 0.9, c = {}) {
  const r = document.createElement("canvas");
  ((r.width = o), (r.height = s));
  const l = r.getContext("2d"),
    f = new i.CanvasTexture(r);
  ((f.anisotropy = 8), (f.colorSpace = i.SRGBColorSpace));
  const u = new i.Mesh(
    new i.PlaneGeometry(e, t),
    new i.MeshBasicMaterial({
      map: f,
      alphaTest: 0.3,
      fog: !1,
      side: i.DoubleSide,
      color: new i.Color(a, a, a),
      ...c,
    }),
  );
  return (
    (u.userData = {
      c: r,
      g: l,
      t: f,
      redraw(d) {
        (l.clearRect(0, 0, o, s), d(l, o, s), (f.needsUpdate = !0));
      },
    }),
    n && (u.userData.redraw(n), Do.push(() => u.userData.redraw(n))),
    u
  );
}
const Fn = (e, t, o, s, n, a) => {
    (e.beginPath(), e.roundRect(t, o, s, n, a));
  },
  Lt = (e, t, o, s = !0) => {
    const n = document.createElement("canvas");
    ((n.width = e), (n.height = t), o(n.getContext("2d"), e, t));
    const a = new i.CanvasTexture(n);
    return (s && (a.colorSpace = i.SRGBColorSpace), (a.anisotropy = 8), a);
  },
  kn = Lt(
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
  oa = (e, t, o = kn) =>
    new i.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: i.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function An(e, t = 0.3, o = 1, s = 0) {
  const n = new i.IcosahedronGeometry(e, s),
    a = n.attributes.position,
    c = re(o),
    r = new Map();
  for (let l = 0; l < a.count; l++) {
    const f =
      a.getX(l).toFixed(3) +
      "," +
      a.getY(l).toFixed(3) +
      "," +
      a.getZ(l).toFixed(3);
    r.has(f) ||
      r.set(f, [1 + (c() - 0.5) * t, 1 + (c() - 0.5) * t, 1 + (c() - 0.5) * t]);
    const u = r.get(f);
    a.setXYZ(l, a.getX(l) * u[0], a.getY(l) * u[1], a.getZ(l) * u[2]);
  }
  return (n.computeVertexNormals(), n);
}
function na(e, t, o, s, n, a = 0, c = {}) {
  const r = new i.Group(),
    l = j(),
    f = re(Math.floor(t * 31 + s * 17 + 99));
  l.cyl(E("#5a3f2c"), 0, 0.5 * n, 0, 0.07 * n, 0.1 * n, 1 * n, { seg: 6 });
  const u = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((d) =>
    new i.Color(d).offsetHSL(a, 0, 0).getStyle(),
  );
  for (let d = 0; d < (c.n || 5); d++)
    l.geo(
      E(u[d % 4], { flatShading: !0, roughness: 0.8 }),
      An(0.42 * n * (0.75 + f() * 0.5), 0.3, d + t * 7 + s * 3),
      (f() - 0.5) * 0.6 * n,
      (1.15 + f() * 0.7) * n,
      (f() - 0.5) * 0.6 * n,
    );
  return (l.flush(r), r.position.set(t, o, s), e.add(r), r);
}
const sa = Lt(
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
function yr(e, t, o, s, n, a, c = 0.5) {
  const r = new i.Mesh(
    new i.PlaneGeometry(n, a),
    new i.MeshBasicMaterial({
      map: sa,
      transparent: !0,
      opacity: c,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (r.rotation.x = -Math.PI / 2),
    r.position.set(t, o + 0.004, s),
    (r.renderOrder = -1),
    e.add(r),
    ce.push(r),
    r
  );
}
class aa {
  constructor(t) {
    this.max = t;
    const o = new i.BufferGeometry();
    ((this.pos = new Float32Array(t * 12)),
      (this.side = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 16)));
    const s = new Uint32Array(t * 6);
    for (let n = 0; n < t; n++) {
      const a = n * 4;
      s.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], n * 6);
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
      o.setIndex(new i.BufferAttribute(s, 1)),
      (this.mesh = new i.Mesh(
        o,
        new i.ShaderMaterial({
          uniforms: {
            ...Mn,
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
          fragmentShader: `${Zs}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      to.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? i.NormalBlending : i.AdditiveBlending));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, s, n, a, c, r) {
    if (this.n >= this.max) return;
    const l = this.n++;
    (Ln.subVectors(o, t),
      _n.addVectors(t, o).multiplyScalar(0.5),
      Dn.subVectors(C.position, _n),
      ne.crossVectors(Ln, Dn).normalize());
    const f = this.pos,
      u = l * 12;
    ((f[u] = t.x - ne.x * s),
      (f[u + 1] = t.y - ne.y * s),
      (f[u + 2] = t.z - ne.z * s),
      (f[u + 3] = t.x + ne.x * s),
      (f[u + 4] = t.y + ne.y * s),
      (f[u + 5] = t.z + ne.z * s),
      (f[u + 6] = o.x - ne.x * n),
      (f[u + 7] = o.y - ne.y * n),
      (f[u + 8] = o.z - ne.z * n),
      (f[u + 9] = o.x + ne.x * n),
      (f[u + 10] = o.y + ne.y * n),
      (f[u + 11] = o.z + ne.z * n),
      this.side.set([-1, 1, -1, 1], l * 4));
    const d = this.col,
      p = l * 16;
    for (let h = 0; h < 4; h++)
      ((d[p + h * 4] = a.r),
        (d[p + h * 4 + 1] = a.g),
        (d[p + h * 4 + 2] = a.b),
        (d[p + h * 4 + 3] = h < 2 ? c : r));
  }
  line(t, o, s, n) {
    for (let a = 0; a < t.length - 1; a++) {
      const c = a / (t.length - 1),
        r = (a + 1) / (t.length - 1);
      this.seg(
        t[a],
        t[a + 1],
        oo(t[a], o),
        oo(t[a + 1], o),
        s,
        n ? n(c) : 1,
        n ? n(r) : 1,
      );
    }
  }
  end() {
    const t = this.mesh.geometry,
      o = Math.max(this.n, 1);
    t.setDrawRange(0, this.n * 6);
    for (const [s, n] of [
      ["position", 12],
      ["aSide", 4],
      ["aCol", 16],
    ]) {
      const a = t.attributes[s];
      (a.clearUpdateRanges(), a.addUpdateRange(0, o * n), (a.needsUpdate = !0));
    }
  }
}
const Ln = new i.Vector3(),
  _n = new i.Vector3(),
  Dn = new i.Vector3(),
  ne = new i.Vector3(),
  _t = new aa(6e3),
  oo = (e, t) =>
    ((C.position.distanceTo(e) *
      Math.tan(i.MathUtils.degToRad(C.fov / 2)) *
      2) /
      Math.max(te.clientHeight, 1)) *
    t *
    0.5,
  P = JSON.parse(z("#reflection-data").textContent || "{}"),
  it = (P.models || []).slice().sort((e, t) => t.t - e.t),
  ra = ["1 turn", "2-9", "10-49", "50+"],
  Eo = ["1 turn", "2-9 turns", "10-49 turns", "50+ turns"],
  Po = ["one-turn", "2-9 turn", "10-49 turn", "50+ turn"],
  En = ["hermes-agent", "claude-code", "codex", "kilo-code"],
  W = [
    ...En.filter((e) => P.cost?.[e]),
    ...Object.keys(P.cost || {}).filter((e) => !En.includes(e)),
  ],
  Ye = (e) =>
    String(e).replace(/[&<>"']/g, (t) => "&#" + t.charCodeAt(0) + ";"),
  lt = (e) => (P.harness && P.harness[e]) || e,
  Pn = it.length ? it[0].t : 1;
let Be = 0;
for (const e of W)
  for (const t in P.cost[e])
    for (const o of P.cost[e][t]) o != null && o > Be && (Be = o);
const ue = (e, t, o) => {
    const s = P.cost?.[t]?.[e.id];
    return s && s[o] != null ? s[o] : null;
  },
  Dt = (e) =>
    e >= 1e12
      ? (e / 1e12).toFixed(e >= 1e12 ? 1 : 2) + "T"
      : (e / 1e9).toFixed(0) + "B",
  br = (e) =>
    e >= 1e12 ? (e / 1e12).toFixed(1) + "T" : (e / 1e12).toFixed(2) + "T",
  ct = (e) =>
    e == null
      ? "\u2013"
      : e >= 0.01
        ? "$" + e.toFixed(2)
        : e >= 0.001
          ? "$" + e.toFixed(3)
          : e >= 1e-4
            ? "$" + e.toFixed(4)
            : "<$0.0001",
  ft = (e) =>
    new Date(e + "T12:00:00Z").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
  ia = (e) => {
    const t = Math.pow(10, Math.floor(Math.log10(e))),
      o = e / t;
    return (o < 1.5 ? 1 : o < 3.5 ? 2 : o < 7.5 ? 5 : 10) * t;
  },
  de = 0.62,
  F = 3.4,
  ze = 0.14,
  We = F - ze,
  U = 0.05,
  X = { x: 7.85, z: 5.15 },
  R = { x: 7.62, z: 4.92 },
  la = 5.6,
  no = 2.25,
  Z = 0.066,
  On = 0.1,
  He = 1,
  Xe = 1.18,
  ca = (e) => Math.max(Z, (e.t / Pn) * la),
  Bn = (e) => (e == null ? 0 : (e / Be) * no),
  q = new i.Group();
Yt.add(q);
const Oo = (e, t, o = 3, s = 1024, n = 512) =>
    Lt(s, n, (a, c, r) => {
      ((a.fillStyle = e), a.fillRect(0, 0, c, r));
      const l = re(o);
      for (let f = 0; f < 260; f++) {
        const u = l() * r,
          d = 0.03 + l() * 0.07;
        ((a.strokeStyle = `rgba(${t},${d})`),
          (a.lineWidth = 0.6 + l() * 2.4),
          a.beginPath(),
          a.moveTo(0, u));
        for (let p = 0; p <= c; p += 32)
          a.lineTo(
            p,
            u +
              Math.sin(p * 0.004 + f) * 6 * l() +
              Math.sin(p * 0.02 + f * 3) * 1.5,
          );
        a.stroke();
      }
      for (let f = 0; f < 14; f++) {
        const u = l() * c,
          d = l() * r,
          p = a.createRadialGradient(u, d, 0, u, d, 30 + l() * 50);
        (p.addColorStop(0, `rgba(${t},.12)`),
          p.addColorStop(1, `rgba(${t},0)`),
          (a.fillStyle = p),
          a.fillRect(u - 90, d - 90, 180, 180));
      }
    }),
  fa = oe("#c9a15a", { roughness: 0.3, metalness: 1, clearcoat: 0.4 }),
  Et = Oo("#2a1d15", "10,6,3", 5);
((Et.wrapS = Et.wrapT = i.RepeatWrapping), Et.repeat.set(3, 2));
const se = -8.4,
  Bo = 8.3,
  ut = -13.5;
{
  const e = Te(
      new i.MeshPhysicalMaterial({
        map: Et,
        color: "#9a7a62",
        roughness: 0.46,
        clearcoat: 0.4,
        clearcoatRoughness: 0.32,
        metalness: 0,
        envMapIntensity: 0.16,
      }),
    ),
    t = new i.Mesh(Tn(40, 0.6, Bo + 9.5, 0.08, 3), e);
  (t.position.set(-2, -0.3, (Bo - 9.5) / 2),
    (t.receiveShadow = !0),
    q.add(t),
    Ce.push(t));
  const o = Te(
      new i.MeshPhysicalMaterial({
        map: Et,
        color: "#c49e80",
        roughness: 0.48,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.35,
      }),
    ),
    s = j(),
    n = Bo - 1.1,
    a = -se - 0.6 - 0.35;
  s.box(o, -2, -0.6 - a / 2, (n - 8.6) / 2, 37.4, a, n + 8.6);
  for (let r = -20.7 + 37.4 / 6; r < 16.6; r += 37.4 / 6)
    s.box(
      E("#0a0706", { roughness: 0.6 }),
      r,
      -0.6 - a / 2,
      n + 0.005,
      0.06,
      a - 0.4,
      0.02,
    );
  (s.box(fa, -2, se + 0.18, n + 0.02, 37.4, 0.36, 0.04), s.flush(q));
  const c = new i.Mesh(new i.BoxGeometry(37.2, 0.05, 0.05), Oe("#ffb26a", 2.2));
  (c.position.set(-2, -0.66, n + 0.25), q.add(c));
  for (const r of [-15, -2, 11]) _e(r, -3.2, n + 3.4, "#ffb070", 8, 0.75);
}
{
  const e = Oo("#20160f", "6,3,1", 17, 1024, 1024);
  ((e.wrapS = e.wrapT = i.RepeatWrapping), e.repeat.set(10, 10));
  const t = Te(
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
    o.position.set(0, se, ut + 40),
    (o.receiveShadow = !0),
    q.add(o),
    Ce.push(o));
  const s = new i.Mesh(
    new i.PlaneGeometry(52, 30),
    E("#2a2523", { roughness: 0.95, envMapIntensity: 0.1 }),
  );
  ((s.rotation.x = -Math.PI / 2),
    s.position.set(-2, se + 0.02, 4),
    q.add(s),
    Ce.push(s),
    _e(-12, se + 3, 16, "#ffb878", 16, 0.5),
    _e(10, se + 3, 18, "#ffc890", 14, 0.35));
}
{
  const e = j(),
    t = oe("#1b1a1c", { roughness: 0.45, metalness: 0.6 });
  for (let s = -42; s <= 42; s += 5.6) e.box(t, s, 8, ut, 0.24, 40, 0.3);
  (e
    .box(t, 0, 0.55, ut + 0.1, 90, 0.3, 0.5)
    .box(t, 0, 21, ut, 90, 0.5, 0.4)
    .box(
      E("#0d0f14", { roughness: 0.6 }),
      0,
      (se + 0.5) / 2,
      ut + 0.4,
      90,
      0.5 - se,
      0.3,
    ),
    e.flush(q, !1));
  const o = new i.Mesh(new i.BoxGeometry(90, 0.03, 0.03), Oe("#ffb36a", 1.2));
  (o.position.set(0, 0.78, ut + 0.42), q.add(o));
}
function ua(e = {}) {
  return Lt(4096, 1024, (t, o, s) => {
    const n = re(e.seed || 11),
      a = s * (e.horizon || 0.7),
      c = t.createLinearGradient(0, 0, 0, a);
    (c.addColorStop(0, "#08112c"),
      c.addColorStop(0.32, "#152a5c"),
      c.addColorStop(0.58, "#33478a"),
      c.addColorStop(0.76, "#7a649e"),
      c.addColorStop(0.9, "#d88f98"),
      c.addColorStop(1, "#f5b188"),
      (t.fillStyle = c),
      t.fillRect(0, 0, o, a + 2));
    for (let u = 0; u < 30; u++) {
      const d = n() * o,
        p = a * (0.3 + n() * 0.5),
        h = 220 + n() * 640,
        w = t.createRadialGradient(d, p, 0, d, p, h);
      (w.addColorStop(
        0,
        `rgba(${n() > 0.5 ? "255,180,170" : "160,150,220"},.09)`,
      ),
        w.addColorStop(1, "rgba(0,0,0,0)"),
        (t.fillStyle = w),
        t.save(),
        t.scale(1, 0.22),
        t.fillRect(d - h, p / 0.22 - h, h * 2, h * 2),
        t.restore());
    }
    if (e.mountains) {
      ((t.fillStyle = "#3a3b67"), t.beginPath(), t.moveTo(0, a));
      for (let u = 0; u <= o; u += 24) {
        const d = u / o;
        t.lineTo(
          u,
          a -
            s *
              (0.07 +
                0.09 * Math.abs(Math.sin(d * 4.2 + 1)) +
                0.04 * Math.sin(d * 17 + 2)),
        );
      }
      (t.lineTo(o, a), t.fill());
    }
    const r = ["#ffd9a0", "#ffe9c8", "#ffc070", "#ffcf90", "#cfe6ff"],
      l = (u, d, p, h, w, y = 3, b = 3.5, v = 6, x = 7) => {
        if (((t.fillStyle = h), t.fillRect(u, a - p, d, p), !!w)) {
          for (let M = a - p + 4; M < a - 2; M += x)
            for (let T = u + 2; T < u + d - y; T += v)
              n() < w &&
                ((t.fillStyle = r[Math.floor(n() * r.length)]),
                (t.globalAlpha = 0.5 + n() * 0.5),
                t.fillRect(T, M, y, b));
          t.globalAlpha = 1;
        }
      };
    for (let u = 0; u < o;) {
      const d = 14 + n() * 40,
        p = s * (0.025 + n() * 0.08) * (e.low || 1);
      (l(u, d, p, "#56598c", 0.16, 2, 2.5, 5, 6), (u += d + n() * 5));
    }
    for (let u = 0; u < o;) {
      const d = Math.abs(Math.sin((u / o) * 7.3 + 0.4)),
        p = 24 + n() * 62,
        h = s * (0.05 + n() * 0.14 + d * d * 0.36 * n()) * (e.low || 1);
      (l(
        u,
        p,
        h,
        `hsl(${226 + n() * 16},${28 + n() * 14}%,${13 + n() * 8}%)`,
        0.42 + n() * 0.35,
      ),
        h > s * 0.22 &&
          n() < 0.6 &&
          ((t.fillStyle = "#ffe2b0"),
          (t.globalAlpha = 0.85),
          t.fillRect(u + 3, a - h + 2, p - 6, 3),
          (t.globalAlpha = 1)),
        h > s * 0.3 &&
          n() < 0.5 &&
          ((t.fillStyle = "#ff6a5a"),
          t.fillRect(u + p / 2 - 2, a - h - 9, 4, 4)),
        (u += p + n() * 8));
    }
    for (let u = 0; u < o;) {
      const d = 60 + n() * 110,
        p = s * (0.08 + n() * 0.2) * (e.low || 1);
      (n() < 0.55 &&
        l(
          u,
          d,
          p,
          `hsl(${224 + n() * 10},30%,${9 + n() * 5}%)`,
          0.5 + n() * 0.3,
          5,
          6,
          10,
          11,
        ),
        (u += d + 60 + n() * 260));
    }
    const f = t.createLinearGradient(0, a, 0, s);
    (f.addColorStop(0, "#3d3766"),
      f.addColorStop(0.25, "#1c1d3c"),
      f.addColorStop(1, "#090b17"),
      (t.fillStyle = f),
      t.fillRect(0, a, o, s - a));
    for (let u = 0; u < 1600; u++) {
      const d = n() * o,
        p = a + 3 + n() ** 1.5 * (s - a) * 0.75,
        h = 8 + n() * 60;
      ((t.fillStyle =
        [
          "rgba(255,200,140,",
          "rgba(255,232,200,",
          "rgba(170,210,255,",
          "rgba(255,170,110,",
        ][u % 4] +
        (0.1 + n() * 0.32) +
        ")"),
        t.fillRect(d, p, 1.5 + n() * 3, h * 0.3));
    }
  });
}
const da = ua({ seed: 11 }),
  Vn = -118;
{
  const e = new i.Mesh(
    new i.PlaneGeometry(320, 80),
    new i.MeshBasicMaterial({
      map: da,
      fog: !1,
      color: new i.Color(0.95, 0.95, 0.95),
    }),
  );
  (e.position.set(0, 12, Vn), q.add(e));
}
const Mr = (() => {
  const t = new i.PlaneGeometry(1, 1),
    o = new i.MeshBasicMaterial({
      map: kn,
      transparent: !0,
      blending: i.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
      vertexColors: !1,
    }),
    s = new i.InstancedMesh(t, o, 520),
    n = re(77),
    a = new i.Matrix4(),
    c = new i.Color(),
    r = [
      [1, 0.72, 0.42],
      [1, 0.86, 0.66],
      [0.62, 0.8, 1],
      [1, 0.6, 0.35],
      [1, 0.95, 0.85],
    ];
  for (let l = 0; l < 520; l++) {
    const f = (n() - 0.5) * 300,
      u = Math.abs(Math.sin((f / 300 + 0.5) * 7.3 + 0.4)),
      d = l % 9 === 0,
      p = d ? -4.5 - n() * 5 : -3.4 + n() ** 1.8 * (11 + u * u * 20),
      h = (0.45 + n() * 1.1) * (d ? 0.8 : 1);
    (a.makeScale(h, h, h),
      a.setPosition(f, p, Vn + 2 + n() * 6),
      s.setMatrixAt(l, a));
    const w = r[Math.floor(n() * r.length)],
      y = (1.6 + n() * 2.6) * (d ? 0.55 : 1);
    s.setColorAt(l, c.setRGB(w[0] * y, w[1] * y, w[2] * y));
  }
  return ((s.frustumCulled = !1), q.add(s), ce.push(s), s);
})();
{
  const e = j(),
    t = E("#2b2018", { roughness: 0.6 });
  (e.box(E("#1a1716", { roughness: 0.7 }), -26, 8, -4, 0.4, 36, 40),
    e.box(t, -24.6, 2.6, -9, 2.4, 0.12, 5).box(t, -24.6, 5.2, -9, 2.4, 0.12, 5),
    e
      .box(E("#d8d0c4"), -24.6, 3, -10.2, 0.5, 0.7, 0.5)
      .box(E("#5a6b4a"), -24.6, 3.05, -8.2, 0.6, 0.8, 0.6)
      .box(E("#c8a070"), -24.6, 5.5, -9.6, 0.9, 0.5, 0.4),
    e
      .cyl(
        oe("#8a6b3d", { roughness: 0.3 }),
        -19,
        (se + 1.35) / 2,
        -12,
        0.08,
        0.08,
        1.35 - se,
        { seg: 10 },
      )
      .cyl(E("#3a2e25"), -19, se + 0.12, -12, 0.7, 0.8, 0.25),
    e.flush(q));
  const o = new i.Mesh(
    new i.CylinderGeometry(0.75, 1.05, 1.1, 28, 1, !0),
    new i.MeshBasicMaterial({
      color: new i.Color(2.8, 1.7, 0.8),
      side: i.DoubleSide,
      fog: !1,
    }),
  );
  (o.position.set(-19, 1.9, -12), q.add(o));
  const s = new i.Mesh(new i.BoxGeometry(0.2, 2.2, 0.9), Oe("#ffbf7a", 3.2));
  (s.position.set(-25.7, 6.5, 2),
    q.add(s),
    _e(-19, 1.6, -11, "#ffb878", 9, 1.1),
    _e(-24, 6, 2, "#ffbf7a", 7, 0.8));
  const n = E("#cfc6b8", { roughness: 0.55 }),
    a = j();
  (a.cyl(n, -24, se + 1.1, 8, 1.3, 1, 2.2, { seg: 18 }),
    a.flush(q),
    na(q, -24, se + 2.2, 8, 6.2, 0, { n: 10 }));
}
const J = new i.Group();
Yt.add(J);
const ha = Oo("#4a3122", "18,10,6", 8),
  Gn = new i.MeshPhysicalMaterial({
    map: ha,
    color: "#d2ae90",
    roughness: 0.34,
    clearcoat: 0.9,
    clearcoatRoughness: 0.14,
    envMapIntensity: 0.7,
  });
(Te(Gn),
  _e(-3, 1.6, X.z + 3.4, "#ffb878", 8.5, 1.05),
  _e(6, 1.2, X.z + 2.8, "#ffc490", 6, 0.55));
const so = oe("#c9a15a", { roughness: 0.26, metalness: 1, clearcoat: 0.4 });
{
  const e = j();
  (e.box(Gn, 0, de / 2, 0, X.x * 2, de, X.z * 2, { r: 0.05 }),
    e
      .box(so, 0, de + 0.01, X.z - 0.02, X.x * 2 - 0.06, 0.025, 0.03)
      .box(so, 0, de + 0.01, -X.z + 0.02, X.x * 2 - 0.06, 0.025, 0.03)
      .box(so, X.x - 0.02, de + 0.01, 0, 0.03, 0.025, X.z * 2 - 0.06)
      .box(so, -X.x + 0.02, de + 0.01, 0, 0.03, 0.025, X.z * 2 - 0.06),
    e.box(
      E("#08090c", { roughness: 0.8 }),
      0,
      de + 0.02,
      0,
      R.x * 2 - 0.02,
      0.04,
      R.z * 2 - 0.02,
    ),
    e.flush(J));
}
{
  const e = j(),
    t = re(21),
    o = E("#050505", {
      roughness: 0.6,
      flatShading: !0,
      envMapIntensity: 0.18,
    }),
    s = E("#0a0908", {
      roughness: 0.66,
      flatShading: !0,
      envMapIntensity: 0.14,
    });
  for (let n = 0; n < 520; n++) {
    const a = (t() * 2 - 1) * (R.x - 0.25),
      c = (t() * 2 - 1) * (R.z - 0.25),
      r = (R.z - c) / (R.z * 2),
      l = (0.1 + t() ** 2 * 0.42) * (1 + r * 0.5),
      f = de + l * 0.3 + t() * 0.35 * (0.4 + r);
    e.geo(n % 3 ? o : s, An(l, 0.6, n * 7 + 3), a, f, c, {
      s: [1, 0.6 + t() * 0.5, 1],
      ry: t() * 6,
    });
  }
  e.flush(J);
}
const pa = new i.MeshPhysicalMaterial({
  color: "#dcefff",
  roughness: 0.04,
  metalness: 0,
  transparent: !0,
  opacity: 0.07,
  envMapIntensity: 0.55,
  depthWrite: !1,
  side: i.DoubleSide,
});
{
  const e = F - de,
    t = de + e / 2,
    o = (n, a, c, r) => {
      const l = new i.Mesh(new i.PlaneGeometry(n, e), pa);
      return (
        l.position.set(a, t, c),
        (l.rotation.y = r),
        (l.renderOrder = 3),
        J.add(l),
        ce.push(l),
        l
      );
    };
  (o(R.x * 2, 0, R.z, 0),
    o(R.x * 2, 0, -R.z, 0),
    o(R.z * 2, R.x, 0, Math.PI / 2),
    o(R.z * 2, -R.x, 0, Math.PI / 2));
  const s = new i.MeshBasicMaterial({
    color: new i.Color(0.62, 0.7, 0.8),
    transparent: !0,
    opacity: 0.32,
    depthWrite: !1,
    fog: !1,
  });
  for (const [n, a] of [
    [R.x, R.z],
    [-R.x, R.z],
    [R.x, -R.z],
    [-R.x, -R.z],
  ]) {
    const c = new i.Mesh(new i.BoxGeometry(0.035, e, 0.035), s);
    (c.position.set(n, t, a), (c.renderOrder = 3), J.add(c), ce.push(c));
  }
  for (const n of [R.z, -R.z]) {
    const a = new i.Mesh(new i.BoxGeometry(R.x * 2, 0.03, 0.03), s);
    (a.position.set(0, F + 0.005, n), J.add(a), ce.push(a));
  }
  for (const n of [R.x, -R.x]) {
    const a = new i.Mesh(new i.BoxGeometry(0.03, 0.03, R.z * 2), s);
    (a.position.set(n, F + 0.005, 0), J.add(a), ce.push(a));
  }
}
const ma = Te(
    new i.MeshStandardMaterial({
      color: "#010204",
      roughness: 0.06,
      metalness: 0,
      envMapIntensity: 0.3,
    }),
    Is,
  ),
  dt = new i.Mesh(new i.PlaneGeometry(R.x * 2, R.z * 2), ma);
((dt.rotation.x = -Math.PI / 2),
  dt.position.set(0, F, 0),
  (dt.castShadow = !0),
  (dt.receiveShadow = !0),
  J.add(dt),
  Ce.push(dt));
{
  const e = j(),
    t = Js("#05070a", { roughness: 0.12, clearcoat: 1, envMapIntensity: 0.9 });
  (e
    .box(t, 0, F - ze / 2, R.z - 0.01, R.x * 2, ze, 0.02)
    .box(t, 0, F - ze / 2, -R.z + 0.01, R.x * 2, ze, 0.02)
    .box(t, R.x - 0.01, F - ze / 2, 0, 0.02, ze, R.z * 2)
    .box(t, -R.x + 0.01, F - ze / 2, 0, 0.02, ze, R.z * 2),
    e.flush(J));
}
const Sr = (() => {
    const e = [1, 2, 5, 10, 20, 50],
      t = Be,
      o = e.find((l) => t / l <= 6) || 50,
      s = Math.floor(t / o),
      n = no * ((s * o) / Be) + 0.2,
      a = 256,
      c = Math.round((256 * n) / 0.9),
      r = Rn(
        0.9,
        n,
        a,
        c,
        (l, f, u) => {
          const d = u / n;
          ((l.strokeStyle = "rgba(235,225,205,.8)"),
            (l.fillStyle = "rgba(235,225,205,.85)"),
            (l.lineWidth = 3),
            l.beginPath(),
            l.moveTo(f * 0.22, 0),
            l.lineTo(f * 0.22, ((no * s * o) / Be) * d),
            l.stroke());
          for (let p = 0; p <= s * o + 1e-9; p += o / 5) {
            const h = (p / Be) * no * d,
              w = Math.abs(p / o - Math.round(p / o)) < 1e-6;
            ((l.lineWidth = w ? 3 : 2),
              l.beginPath(),
              l.moveTo(f * 0.22, h),
              l.lineTo(f * (w ? 0.42 : 0.32), h),
              l.stroke(),
              w &&
                p > 0 &&
                ((l.font = "600 34px Outfit, sans-serif"),
                (l.textBaseline = "middle"),
                l.fillText("$" + p, f * 0.47, h + 1)));
          }
        },
        0.85,
        { alphaTest: 0.2, transparent: !1 },
      );
    return (
      r.position.set(-R.x + 0.72, We - n / 2 + 0.1, R.z + 0.012),
      J.add(r),
      r
    );
  })(),
  Vo = 10,
  ao = 7,
  Nn = 1.5,
  Go = 1.34,
  xa = (-(Vo - 1) * Nn) / 2,
  No = ((ao - 1) * Go) / 2,
  ht = [];
for (let e = 0; e < ao; e++)
  for (let t = 0; t < Vo; t++)
    ht.push({
      c: t,
      r: e,
      x: xa + t * Nn,
      z: No - e * Go,
      m: null,
      park: !1,
      plaza: (e === 0 && t >= 7) || (e === 1 && t === 9),
    });
const Un = (e, t) => ht[t * Vo + e],
  In = W[0],
  pt = (e) => ue(e, In, 3) ?? ue(e, In, 2);
{
  const e = (r, l, f) => {
      if (!r || r.slot) return;
      const u = Un(l, f);
      u.m || ((u.m = r), (r.slot = u));
    },
    t = it.filter((r) => !r.fresh),
    o = t.filter((r) => pt(r) != null),
    s = o.slice(0, 2),
    n = o
      .filter((r) => !s.includes(r))
      .sort((r, l) => pt(l) - pt(r))
      .slice(0, 3);
  (e(s[0], 1, 0),
    e(s[1], 3, 0),
    e(n[2], 4, 0),
    e(n[0], 5, 0),
    e(n[1], 6, 0),
    e(
      t.find((r) => !r.slot),
      4,
      ao - 2,
    ),
    it
      .filter((r) => r.fresh)
      .slice(0, 5)
      .forEach((r, l) =>
        e(
          r,
          ...[
            [9, 2],
            [9, 4],
            [9, 1],
            [9, 5],
            [9, 3],
          ][l],
        ),
      ));
  const a = it.filter((r) => !r.slot).sort((r, l) => l.t - r.t),
    c = ht
      .filter((r) => !r.m && !r.plaza)
      .map((r) => ({
        s: r,
        k: r.r + Ct(r.c * 7.1 + r.r * 3.3) * 0.9 - (r.r === 0 ? 2.5 : 0),
      }))
      .sort((r, l) => l.k - r.k);
  (a.forEach((r, l) => {
    c[l] && ((c[l].s.m = r), (r.slot = c[l].s));
  }),
    c.slice(a.length).forEach((r) => (r.s.park = !0)));
}
const Pt = it.filter((e) => e.slot),
  va = new Set(
    [
      ...ht.filter((e) => e.r === 0 && e.m).map((e) => e.m),
      Un(4, ao - 2).m,
      ...Pt.filter((e) => e.fresh).slice(0, 2),
    ].filter(Boolean),
  ),
  ga = { value: F + U },
  Uo = { value: new Float32Array(72) },
  wa = { value: 1.2 },
  ro = {
    box: [
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
    ],
    oct: [
      [1, 0.42],
      [1, -0.42],
      [0.42, -1],
      [-0.42, -1],
      [-1, -0.42],
      [-1, 0.42],
      [-0.42, 1],
      [0.42, 1],
    ],
    round: Array.from({ length: 20 }, (e, t) => [
      Math.cos((t / 20) * Math.PI * 2),
      Math.sin((t / 20) * Math.PI * 2),
    ]),
  },
  $n =
    "vec3 tintOf(float c,float hi){return mix(vec3(1.,.7,.42),mix(vec3(.2,.5,1.25),vec3(.62,.88,1.25),hi),c);}",
  ya = Te(
    new i.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0,
      transparent: !0,
      envMapIntensity: 0.9,
      side: i.FrontSide,
    }),
    Object.assign(
      (e) => {
        (Object.assign(e.uniforms, { uBase: ga, uCool: Uo }),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
attribute vec4 aF;varying vec4 vF;varying vec3 vSW;`,
            )
            .replace(
              "#include <worldpos_vertex>",
              `#include <worldpos_vertex>
vF=aF;vSW=(modelMatrix*vec4(transformed,1.)).xyz;`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec4 vF;varying vec3 vSW;uniform float uBase;uniform float uCool[72];
` + $n,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
  {float u=vF.x*vF.y,v=(vSW.y-uBase)/${Z};vec2 fw=fwidth(vec2(u,v));float lod=smoothstep(.25,.6,max(fw.x,fw.y));vec2 aa=min(fw*1.2,vec2(.25));
   float mul=1.-smoothstep(.05-aa.x,.05+aa.x,fract(u))*smoothstep(.95+aa.x,.95-aa.x,fract(u));
   float tr=1.-smoothstep(.07-aa.y,.07+aa.y,fract(v))*smoothstep(.985+aa.y,.985-aa.y,fract(v));
   float fr=mix(max(mul,tr),.14,lod);
   float ew=max(fwidth(vF.x)*1.5,.012),e=vF.w*(1.-smoothstep(0.,ew,min(vF.x,1.-vF.x)));
   float cool=uCool[int(vF.z+.5)];vec3 tint=tintOf(cool,.4);
   float fres=pow(1.-abs(dot(normalize(vViewPosition),normal)),3.);
   diffuseColor.rgb=mix(mix(vec3(.012,.014,.02),vec3(.006,.016,.034),cool),mix(vec3(.5,.48,.45),vec3(.42,.5,.6),cool),fr);
   diffuseColor.a=clamp(mix(.14,.82,fr)+fres*.5+e*.6,0.,1.);roughnessFactor=mix(.05,.38,fr);
   // the rooms behind the glass are lit, floor by floor, some brighter than others: added on top of what shows through (divided by the
   // pane's alpha, so the blend adds it whole), so the tower glows and you still see the city through it
   float fl=fract(sin(floor(v)*12.9898+vF.z*78.233)*43758.5453),lvF=mix(.3,1.,smoothstep(.12,.85,fl));
   float fill=mix((1.-fr)*lvF,.6,lod)*mix(.4,.5,cool);
   totalEmissiveRadiance+=tint*(fr*.09+e*.7+.02)+tintOf(cool,lvF*.6)*fill/max(diffuseColor.a,.12);}`,
            )));
      },
      { key: "shell" },
    ),
  ),
  Wn = (e, t) =>
    Te(
      new i.MeshStandardMaterial({ color: "#0d0e10", roughness: 0.7 }),
      Object.assign(
        (o) => {
          (Object.assign(o.uniforms, { uCool: Uo, uGlow: wa }),
            (o.vertexShader = o.vertexShader
              .replace(
                "#include <common>",
                `#include <common>
attribute float aTi;attribute float aLv;varying float vTi;varying float vLv;varying float vNy;varying float vLy;`,
              )
              .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
vTi=aTi;vLv=aLv;vNy=normal.y;vLy=position.y;`,
              )),
            (o.fragmentShader = o.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
varying float vTi;varying float vLv;varying float vNy;varying float vLy;uniform float uCool[72];uniform float uGlow;
` + $n,
              )
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
{float cool=uCool[int(vTi+.5)];` +
                  (t
                    ? "totalEmissiveRadiance+=tintOf(cool,.2)*(.22+.06*sin(vLy*40.))*vLv*uGlow;"
                    : "float k=vNy<-.5?1.5:vNy>.5?.28:1.1;totalEmissiveRadiance+=tintOf(cool,vNy<-.5?.75:.35)*k*vLv*uGlow;") +
                  "}",
              )));
        },
        { key: e },
      ),
    ),
  ba = Wn("slab", !1),
  Ma = Wn("core", !0),
  Sa = E("#2a2c30", { roughness: 0.55 });
function Hn(e) {
  const t = ro[e],
    o = [],
    s = (...a) => o.push(...a);
  for (let a = 0; a < t.length; a++) {
    const [c, r] = t[a],
      [l, f] = t[(a + 1) % t.length],
      u = [
        [c, 0, r],
        [l, 0, f],
        [l, 1, f],
        [c, 1, r],
      ],
      d = r - f,
      p = l - c,
      h = d * (c + l) + p * (r + f) > 0,
      w = (y, b, v) => s(...u[y], ...u[b], ...u[v]);
    (h ? (w(0, 1, 2), w(0, 2, 3)) : (w(0, 2, 1), w(0, 3, 2)),
      s(0, 1, 0, ...(h ? [c, 1, r, l, 1, f] : [l, 1, f, c, 1, r])),
      s(0, 0, 0, ...(h ? [l, 0, f, c, 0, r] : [c, 0, r, l, 0, f])));
  }
  const n = new i.BufferGeometry();
  return (
    n.setAttribute("position", new i.Float32BufferAttribute(o, 3)),
    n.computeVertexNormals(),
    n
  );
}
function Ta(e, t, o) {
  const s = (c) => Math.min(t, Math.max(Z, Math.round(c / Z) * Z)),
    n = (c, r, l, f, u, d = 0) => ({
      sh: c,
      r0: r,
      r1: l,
      y0: f,
      y1: u,
      rot: d,
    });
  if (e.stealth) {
    const c = [0.56, 0.76, 0.88, 0.95, 1],
      r = [1, 0.9, 0.8, 0.7, 0.6];
    let l = 0;
    return c
      .map((f, u) => {
        const d = u === 4 ? t : s(t * f),
          p = n("box", r[u] / 2, r[u] / 2, l, d);
        return ((l = d), p);
      })
      .filter((f) => f.y1 > f.y0);
  }
  const a = Math.floor(o * 5) % 5;
  if (t >= 2.4) {
    if (a % 2 === 0) {
      const r = s(t * 0.58),
        l = s(t * 0.84);
      return [
        n("box", 0.5, 0.5, 0, r),
        n("box", 0.42, 0.42, r, l),
        n("box", 0.33, 0.33, l, t),
      ];
    }
    const c = s(t * 0.7);
    return [n("oct", 0.5, 0.47, 0, c), n("oct", 0.4, 0.35, c, t)];
  }
  if (t >= 0.6) {
    if (a === 0) return [n("round", 0.5, 0.5, 0, t)];
    if (a === 1) {
      const r = s(t * 0.8);
      return [n("oct", 0.5, 0.5, 0, r), n("oct", 0.4, 0.4, r, t)];
    }
    if (a === 2) return [n("box", 0.5, 0.35, 0, t)];
    if (a === 3) {
      const r = Math.max(2, Math.min(8, Math.round(t / Z / 3))),
        l = [];
      for (let f = 0; f < r; f++) {
        const u = s((t * f) / r),
          d = f === r - 1 ? t : s((t * (f + 1)) / r);
        d > u && l.push(n("box", 0.4, 0.4, u, d, (f / (r - 1)) * 0.7));
      }
      return l;
    }
    const c = s(t * 0.62);
    return [n("box", 0.5, 0.5, 0, c), n("box", 0.38, 0.38, c, t, Math.PI / 4)];
  }
  if (a === 0) return [n("round", 0.46, 0.46, 0, t)];
  if (a === 1) return [n("oct", 0.5, 0.5, 0, t)];
  if (a === 2 && t >= Z * 3) {
    const c = s(t * 0.6);
    return [n("box", 0.5, 0.5, 0, c), n("box", 0.36, 0.36, c, t)];
  }
  return [n("box", 0.5, 0.5, 0, t)];
}
const I = new i.Group();
(Yt.add(I), Ce.push(I));
const O = [],
  Tr = new i.Box3();
{
  const e = [],
    t = [],
    o = [],
    s = F + U,
    n = { box: [], oct: [], round: [] },
    a = [],
    c = (v, x, M) => {
      const T = Math.cos(M),
        k = Math.sin(M);
      return [(v[0] * T - v[1] * k) * x, (v[0] * k + v[1] * T) * x];
    },
    r = (v, x, M, T, k, _, D, xe) => {
      const S = M[2] - x[2],
        $ = -(M[0] - x[0]),
        ae = (x[0] + M[0]) / 2,
        be = (x[2] + M[2]) / 2,
        Ue = S * ae + $ * be > 0,
        H = [x, M, T, k].map((K) => [K[0] + D, K[1], K[2] + xe]),
        Me = [
          [0, _[1]],
          [1, _[1]],
          [1, _[1]],
          [0, _[1]],
        ],
        ve = (K, Se, Ie) => {
          for (const Ae of [K, Se, Ie])
            v.push({ p: H[Ae], f: [Me[Ae][0], _[0], _[2], _[3]] });
        };
      Ue ? (ve(0, 1, 2), ve(0, 2, 3)) : (ve(0, 2, 1), ve(0, 3, 2));
    },
    l = j(),
    f = j(),
    u = E("#cbc2b2", { roughness: 0.62 }),
    d = E("#8e887f", { roughness: 0.85 });
  for (const v of Pt) {
    const x = v.slot,
      M = ca(v),
      T = Ct(x.c * 13.7 + x.r * 7.9 + 1),
      k = O.length;
    l.box(u, x.x, F + U / 2, x.z, Xe, U, Xe, { r: 0.012 });
    const _ = v.fresh ? [] : Ta(v, M, T);
    v.fresh && f.box(d, x.x, s + M / 2, x.z, He, M, He);
    for (const S of _) {
      const $ = ro[S.sh],
        ae = $.length,
        be = S.sh !== "round" ? 1 : 0;
      for (let H = 0; H < ae; H++) {
        const Me = $[H],
          ve = $[(H + 1) % ae],
          K = c(Me, S.r0, S.rot),
          Se = c(ve, S.r0, S.rot),
          Ie = c(Me, S.r1, S.rot),
          Ae = c(ve, S.r1, S.rot),
          So = Math.hypot(Se[0] - K[0], Se[1] - K[1]),
          zs = Math.max(1, Math.round(So / On));
        (r(
          e,
          [K[0], s + S.y0, K[1]],
          [Se[0], s + S.y0, Se[1]],
          [Ae[0], s + S.y1, Ae[1]],
          [Ie[0], s + S.y1, Ie[1]],
          [zs, 0, k, be],
          x.x,
          x.z,
        ),
          t.push(
            [x.x, s + S.y1, x.z],
            [x.x + Ie[0], s + S.y1, x.z + Ie[1]],
            [x.x + Ae[0], s + S.y1, x.z + Ae[1]],
          ));
      }
      const Ue = Math.round((S.y1 - S.y0) / Z);
      for (let H = 1; H <= Ue; H++) {
        const Me = H === Ue ? S.y1 - 0.008 : S.y0 + H * Z,
          ve = (Me - S.y0) / (S.y1 - S.y0),
          K = (S.r0 + (S.r1 - S.r0) * ve) * 0.95,
          Se =
            Ct(k * 7.3 + H * 1.91 + S.y0 * 13) < 0.06
              ? 0.25
              : 0.78 + 0.32 * Ct(k * 3.1 + H * 0.73);
        n[S.sh].push({
          x: x.x,
          y: s + Me - Z * 0.07,
          z: x.z,
          r: K,
          rot: S.rot,
          ti: k,
          lv: Se,
        });
      }
      Ue >= 3 &&
        a.push({
          x: x.x,
          y: s + S.y0,
          z: x.z,
          r: Math.min(S.r0, S.r1) * 0.34,
          h: S.y1 - S.y0,
          rot: S.rot,
          ti: k,
          lv: 0.85 + 0.3 * T,
        });
    }
    const D = _[_.length - 1];
    if (D && M >= 1.2) {
      const S = ro[D.sh];
      for (let $ = 0; $ < S.length; $++) {
        const ae = c(S[$], D.r1 * 1.012, D.rot),
          be = c(S[($ + 1) % S.length], D.r1 * 1.012, D.rot);
        r(
          o,
          [ae[0], s + M - 0.016, ae[1]],
          [be[0], s + M - 0.016, be[1]],
          [be[0], s + M + 0.004, be[1]],
          [ae[0], s + M + 0.004, ae[1]],
          [1, 0, k, 0],
          x.x,
          x.z,
        );
      }
    }
    const xe = {
      m: v,
      i: k,
      x: x.x,
      z: x.z,
      h: M,
      secs: _,
      top: new i.Vector3(x.x, s + M, x.z),
      topW: D ? D.r1 * 2 * (D.sh === "box" ? 1 : 0.72) : He,
      box: new i.Box3(
        new i.Vector3(x.x - Xe / 2, F - 0.02, x.z - Xe / 2),
        new i.Vector3(
          x.x + Xe / 2,
          s + Math.max(M, 0.3) + (v.fresh ? 0.25 : 0),
          x.z + Xe / 2,
        ),
      ),
      seed: T,
      feat: va.has(v),
    };
    ((v.T = xe), O.push(xe));
  }
  const p = (v, x) => {
      const M = new i.BufferGeometry(),
        T = new Float32Array(v.length * 3),
        k = new Float32Array(v.length * 4);
      return (
        v.forEach((_, D) => {
          (T.set(_.p, D * 3), k.set(_.f, D * 4));
        }),
        M.setAttribute("position", new i.BufferAttribute(T, 3)),
        x && M.setAttribute("aF", new i.BufferAttribute(k, 4)),
        M.computeVertexNormals(),
        M
      );
    },
    h = new i.Mesh(p(e, !0), ya);
  ((h.renderOrder = 2), I.add(h), ce.push(h));
  const w = new i.BufferGeometry();
  (w.setAttribute("position", new i.Float32BufferAttribute(t.flat(), 3)),
    w.computeVertexNormals());
  {
    const v = w.attributes.position.array;
    for (let x = 0; x < v.length; x += 9) {
      const M = v[x + 3] - v[x],
        T = v[x + 5] - v[x + 2],
        k = v[x + 6] - v[x],
        _ = v[x + 8] - v[x + 2];
      if (T * k - M * _ < 0)
        for (let D = 0; D < 3; D++) {
          const xe = v[x + 3 + D];
          ((v[x + 3 + D] = v[x + 6 + D]), (v[x + 6 + D] = xe));
        }
    }
    w.computeVertexNormals();
  }
  const y = new i.Mesh(w, Sa);
  ((y.castShadow = y.receiveShadow = !0),
    I.add(y),
    o.length && I.add(new i.Mesh(p(o, !1), Oe("#ffd29a", 2.2))));
  const b = (v, x, M, T) => {
    if (!M.length) return;
    const k = new i.InstancedMesh(v, x, M.length),
      _ = new Float32Array(M.length),
      D = new Float32Array(M.length),
      xe = new i.Matrix4();
    (M.forEach((S, $) => {
      (T(xe, S), k.setMatrixAt($, xe), (_[$] = S.ti), (D[$] = S.lv));
    }),
      v.setAttribute("aTi", new i.InstancedBufferAttribute(_, 1)),
      v.setAttribute("aLv", new i.InstancedBufferAttribute(D, 1)),
      (k.castShadow = k.receiveShadow = !0),
      I.add(k));
  };
  for (const v of ["box", "oct", "round"])
    b(Hn(v), ba, n[v], (x, M) =>
      x.compose(
        rt.set(M.x, M.y, M.z),
        $e.setFromEuler(At.set(0, -M.rot, 0)),
        new i.Vector3(M.r, Z * 0.14, M.r),
      ),
    );
  (b(Hn("box"), Ma, a, (v, x) =>
    v.compose(
      rt.set(x.x, x.y, x.z),
      $e.setFromEuler(At.set(0, -x.rot, 0)),
      new i.Vector3(x.r, x.h, x.r),
    ),
  ),
    l.flush(I),
    f.flush(I));
}
{
  const e = re(31),
    t = [],
    o = [],
    s = (h, w, y) =>
      [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ][y].map((b, v) => b * (Xe / 2 - 0.06) + (v ? w : h));
  for (const h of O) {
    const w = 2 + Math.floor(e() * 3);
    for (let y = 0; y < w; y++) {
      const [b, v] = s(h.x, h.z, (y + Math.floor(h.seed * 4)) % 4);
      t.push([
        b + (e() - 0.5) * 0.06,
        F + U,
        v + (e() - 0.5) * 0.06,
        0.07 + e() * 0.05,
      ]);
    }
    if (!h.m.fresh && !h.m.stealth && e() < 0.55) {
      const y = h.topW,
        b = F + U + h.h;
      for (let v = 0; v < 2 + Math.floor(e() * 2); v++)
        t.push([
          h.x + (e() - 0.5) * y * 0.6,
          b,
          h.z + (e() - 0.5) * y * 0.6,
          0.05 + e() * 0.04,
        ]);
    }
    for (let y = 0; y < 2; y++) {
      const [b, v] = s(h.x, h.z, (y * 2 + 1 + Math.floor(h.seed * 4)) % 4);
      o.push([b * 1, F + U + 0.035, v]);
    }
  }
  const n = j();
  for (const h of ht)
    if (h.park) {
      (n.box(
        E("#2c2a27", { roughness: 0.55 }),
        h.x,
        F + 0.02,
        h.z,
        1.12,
        0.04,
        1.12,
        { r: 0.01 },
      ),
        n
          .box(
            E("#3b4a2f", { roughness: 0.9 }),
            h.x - 0.25,
            F + 0.045,
            h.z + 0.2,
            0.5,
            0.012,
            0.6,
          )
          .box(
            E("#3b4a2f", { roughness: 0.9 }),
            h.x + 0.28,
            F + 0.045,
            h.z - 0.25,
            0.45,
            0.012,
            0.5,
          ));
      for (let w = 0; w < 6; w++)
        t.push([
          h.x + (e() - 0.5) * 0.85,
          F + 0.06,
          h.z + (e() - 0.5) * 0.85,
          0.09 + e() * 0.06,
        ]);
      o.push([h.x + 0.4, F + 0.1, h.z + 0.4], [h.x - 0.4, F + 0.1, h.z - 0.4]);
    }
  n.flush(I);
  {
    const h = j(),
      w = E("#3f5631", { roughness: 0.9 }),
      y = E("#7a6a58", { roughness: 0.7 }),
      b = re(57),
      v = [];
    for (const T of O) {
      if (T.m.fresh || T.m.stealth) continue;
      const k = T.topW,
        _ = F + U + T.h;
      T.h < 1.6
        ? (h.box(
            b() < 0.5 ? w : y,
            T.x + (b() - 0.5) * 0.2,
            _ + 0.008,
            T.z + (b() - 0.5) * 0.2,
            k * 0.55,
            0.016,
            k * 0.45,
          ),
          b() < 0.5 &&
            v.push([
              T.x + (b() - 0.5) * k * 0.5,
              _ + 0.02,
              T.z + (b() - 0.5) * k * 0.5,
              0.14 + b() * 0.1,
            ]))
        : h.box(_o, T.x, _ + 0.05, T.z, k * 0.36, 0.1, k * 0.3);
    }
    h.flush(I);
    const x = Oe("#ffc77a", 2.4),
      M = j();
    for (const T of v)
      T.length === 4
        ? M.box(x, T[0], T[1], T[2], T[3], 0.02, T[3] * 0.7)
        : M.box(x, T[0], T[1], T[2], T[3] + 0.004, 0.018, T[4] + 0.004);
    M.flush(I, !1);
  }
  const a = new i.IcosahedronGeometry(1, 0),
    c = E("#ffffff", { flatShading: !0, roughness: 0.82 }),
    r = new i.InstancedMesh(a, c, t.length),
    l = new i.InstancedMesh(
      new i.CylinderGeometry(0.12, 0.16, 1, 5),
      E("#4f3a2a"),
      t.length,
    ),
    f = new i.Matrix4(),
    u = new i.Color(),
    d = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834", "#7a9a55"];
  (t.forEach(([h, w, y, b], v) => {
    (f.compose(
      rt.set(h, w + b * 1.75, y),
      $e.setFromEuler(At.set(0, v * 1.7, 0)),
      new i.Vector3(b, b * (1 + Ct(v) * 0.35), b),
    ),
      r.setMatrixAt(v, f),
      r.setColorAt(v, u.set(d[v % 5])),
      f.compose(
        rt.set(h, w + b * 0.45, y),
        $e.identity(),
        new i.Vector3(b * 0.4, b * 0.9, b * 0.4),
      ),
      l.setMatrixAt(v, f));
  }),
    (r.castShadow = !0),
    (r.receiveShadow = !0),
    I.add(r, l));
  const p = new i.InstancedMesh(
    new i.SphereGeometry(0.018, 8, 6),
    Oe("#ffcf8a", 5),
    o.length,
  );
  (o.forEach(([h, w, y], b) => {
    (f.makeTranslation(h, w, y), p.setMatrixAt(b, f));
  }),
    I.add(p));
}
const jn = [];
{
  const e = Pt.filter((o) => o.stealth),
    t = Lt(
      256,
      256,
      (o, s, n) => {
        const a = re(5);
        for (let r = 0; r < 70; r++) {
          const l = s / 2 + (a() - 0.5) * s * 0.55,
            f = n / 2 + (a() - 0.5) * n * 0.5,
            u = 20 + a() * 55,
            d = o.createRadialGradient(l, f, 0, l, f, u);
          (d.addColorStop(0, "rgba(255,255,255,.16)"),
            d.addColorStop(1, "rgba(255,255,255,0)"),
            (o.fillStyle = d),
            o.fillRect(0, 0, s, n));
        }
        const c = o.createRadialGradient(
          s / 2,
          n / 2,
          s * 0.18,
          s / 2,
          n / 2,
          s * 0.5,
        );
        (c.addColorStop(0, "rgba(0,0,0,0)"),
          c.addColorStop(1, "rgba(0,0,0,1)"),
          (o.globalCompositeOperation = "destination-out"),
          (o.fillStyle = c),
          o.fillRect(0, 0, s, n));
      },
      !1,
    );
  for (const o of e) {
    const s = o.T,
      n = j();
    (n
      .cyl(Cn, s.x, s.top.y + 0.22, s.z, 0.012, 0.022, 0.44, { seg: 8 })
      .box(_o, s.x, s.top.y + 0.025, s.z, 0.3, 0.05, 0.3),
      n.flush(I));
    const a = new i.Mesh(new i.SphereGeometry(0.03, 10, 8), Oe("#ff6b5a", 4));
    (a.position.set(s.x, s.top.y + 0.46, s.z), I.add(a));
    const c = re(9);
    for (let r = 0; r < 46; r++) {
      const l = new i.Mesh(
        new i.PlaneGeometry(1, 1),
        new i.MeshBasicMaterial({
          map: t,
          transparent: !0,
          depthWrite: !1,
          opacity: 0,
          color: new i.Color(0.74, 0.76, 0.84),
          fog: !1,
        }),
      );
      ((l.renderOrder = 4),
        I.add(l),
        ce.push(l),
        jn.push({
          sp: l,
          T: s,
          a: (r / 46) * Math.PI * 2 * 3 + c(),
          r: 0.55 + c() * 0.75,
          y: 0.1 + c() ** 0.9 * 0.6,
          s: 0.8 + c() * 1.3,
          v: (c() - 0.5) * 0.14,
          ph: c() * 6.3,
          o: 0.12 + c() * 0.16,
        }));
    }
  }
}
const qn = [];
{
  const e = Pt.filter((a) => a.fresh),
    t = j(),
    o = oe("#9a7a48", { roughness: 0.5, metalness: 0.6 }),
    s = oe("#d6a03c", { roughness: 0.42, metalness: 0.5 }),
    n = re(13);
  (e.forEach((a, c) => {
    const r = a.T,
      l = F + U + r.h + 0.16,
      f = He + 0.08;
    for (const [u, d] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ])
      t.box(
        o,
        r.x + (u * f) / 2,
        (F + U + l) / 2,
        r.z + (d * f) / 2,
        0.016,
        l - F - U,
        0.016,
      );
    for (let u = F + U + Z; u <= l + 1e-6; u += Z * 1.5)
      t.box(o, r.x, u, r.z + f / 2, f, 0.012, 0.012)
        .box(o, r.x, u, r.z - f / 2, f, 0.012, 0.012)
        .box(o, r.x + f / 2, u, r.z, 0.012, 0.012, f)
        .box(o, r.x - f / 2, u, r.z, 0.012, 0.012, f);
    if (c < 2) {
      const u = r.x - 0.62,
        d = r.z + 0.55,
        p = 1.9 + n() * 0.7,
        h = F + U,
        w = 1.5;
      for (let y = h; y < h + p; y += 0.11)
        t.box(s, u, y + 0.055, d, 0.11, 0.011, 0.011).box(
          s,
          u,
          y + 0.055,
          d + 0.11,
          0.11,
          0.011,
          0.011,
        );
      for (const [y, b] of [
        [0, 0],
        [0.11, 0],
        [0, 0.11],
        [0.11, 0.11],
      ])
        t.box(s, u - 0.055 + y, h + p / 2, d + b, 0.014, p, 0.014);
      (t
        .box(s, u + w * 0.32, h + p + 0.04, d + 0.055, w, 0.05, 0.05)
        .box(s, u - 0.42, h + p + 0.04, d + 0.055, 0.55, 0.05, 0.05)
        .box(_o, u - 0.6, h + p - 0.02, d + 0.055, 0.18, 0.12, 0.12)
        .box(s, u, h + p + 0.18, d + 0.055, 0.04, 0.28, 0.04),
        t.box(Cn, u + w * 0.62, h + p - 0.25, d + 0.055, 0.004, 0.5, 0.004),
        qn.push({
          m: a,
          x: u + w * 0.32,
          y: h + p + 0.3,
          z: d + 0.055,
          tip: new i.Vector3(u + w * 0.8, h + p + 0.06, d + 0.055),
        }));
    }
    for (let u = 0; u < 3; u++) {
      const d = new i.Mesh(new i.SphereGeometry(0.02, 8, 6), Oe("#ffb050", 5));
      (d.position.set(
        r.x + (n() - 0.5) * 0.8,
        F + U + r.h * n() + 0.04,
        r.z + f / 2 + 0.01,
      ),
        I.add(d));
    }
    _e(r.x, F + 0.8, r.z + 0.6, "#ffb050", 1.6, 0.5);
  }),
    t.flush(I));
  for (const a of qn) {
    const c = new i.Mesh(new i.SphereGeometry(0.026, 8, 6), Oe("#ff6b4a", 4.5));
    (c.position.copy(a.tip), I.add(c));
  }
}
const Re = O.length,
  Io = new Float32Array(72),
  $o = O.map((e) => 0.32 + 0.68 * Ds(-4.5, No, e.z)),
  io = new i.ShaderMaterial({
    uniforms: {
      uCol: { value: new i.Color(1, 0.44, 0.1) },
      uK: { value: 1.05 },
      uTop: { value: We },
      uFlip: { value: 0 },
      uDep: { value: Io },
    },
    transparent: !0,
    depthWrite: !1,
    blending: i.AdditiveBlending,
    fog: !1,
    vertexShader: `attribute float aTi;attribute vec2 aF;attribute float aFade;uniform float uDep[72];uniform float uTop;uniform float uFlip;
  varying vec3 vWP;varying float vT;varying vec3 vN;varying float vSeed;varying float vFade;varying vec3 vView;varying vec2 vF;varying float vD;
  void main(){float d=uDep[int(aTi+.5)];vec3 p=vec3(position.x,uFlip>.5?uTop+position.y*d:uTop-position.y*d,position.z);vec3 nn=normal;if(uFlip<.5)nn.y=-nn.y;
   vec4 wp=modelMatrix*vec4(p,1.);vWP=wp.xyz;vT=position.y;vSeed=aTi*3.7;vFade=aFade;vF=aF;vD=d;vN=normalize(mat3(modelMatrix)*nn);vView=cameraPosition-wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}   // world space, like the normal`,
    fragmentShader: `uniform vec3 uCol;uniform float uK;uniform float uTop;varying vec3 vWP;varying float vT;varying vec3 vN;varying float vSeed;varying float vFade;varying vec3 vView;varying vec2 vF;varying float vD;
  float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  void main(){if(vD<.003)discard;vec3 n=normalize(vN),an=abs(n);if(dot(n,vView)<0.)discard;   // faces turned away (the winding flips with the mirror, so test the true normal)
   float t=clamp(vT,0.,1.),side=step(an.y,.5);
   float u=vF.x*vF.y,v=abs(uTop-vWP.y)/${Z};vec2 cell=floor(vec2(u,v)),f=fract(vec2(u,v));vec2 aa=min(fwidth(vec2(u,v))*1.1,vec2(.25));
   float m=smoothstep(.1-aa.x,.1+aa.x,f.x)*smoothstep(.9+aa.x,.9-aa.x,f.x)*smoothstep(.16-aa.y,.16+aa.y,f.y)*smoothstep(.9+aa.y,.9-aa.y,f.y);
   float lit=step(h21(cell+vSeed),.78);
   float a=side*(.06+.26*m*lit+.05*m)*(1.-.3*t)+side*.6*smoothstep(.86,1.,t)*(.55+.45*m)+(1.-side)*1.25;
   float fres=1.-abs(dot(n,normalize(vView)));a*=.72+.65*fres;
   gl_FragColor=vec4(uCol*max(a,0.)*uK*vFade,1.);}`,
  }),
  Kn = (() => {
    const e = [],
      t = [],
      o = [],
      s = [],
      n = [],
      a = (l, f, u) => {
        const d = Math.cos(u),
          p = Math.sin(u);
        return [(l[0] * d - l[1] * p) * f, (l[0] * p + l[1] * d) * f];
      },
      c = (l, f, u, d) => {
        (e.push(...l), t.push(...f), o.push(u), s.push(...d), n.push($o[u]));
      };
    for (const l of O)
      if (!(!l.secs || !l.secs.length || l.h <= 0))
        for (const f of l.secs) {
          const u = ro[f.sh],
            d = u.length,
            p = f.y0 / l.h,
            h = f.y1 / l.h;
          for (let w = 0; w < d; w++) {
            const y = a(u[w], f.r0, f.rot),
              b = a(u[(w + 1) % d], f.r0, f.rot),
              v = a(u[w], f.r1, f.rot),
              x = a(u[(w + 1) % d], f.r1, f.rot),
              M = Math.hypot(b[0] - y[0], b[1] - y[1]),
              T = Math.max(1, Math.round(M / On)),
              k = b[1] - y[1],
              _ = -(b[0] - y[0]),
              D = Math.hypot(k, _) || 1,
              xe = k * (y[0] + b[0]) + _ * (y[1] + b[1]) > 0,
              S = xe ? 1 : -1,
              $ = [(S * k) / D, 0, (S * _) / D],
              ae = [l.x + y[0], p, l.z + y[1]],
              be = [l.x + b[0], p, l.z + b[1]],
              Ue = [l.x + x[0], h, l.z + x[1]],
              H = [l.x + v[0], h, l.z + v[1]],
              Me = (ve, K, Se, Ie, Ae, So) => {
                (c(ve, $, l.i, [Ie, T]),
                  c(K, $, l.i, [Ae, T]),
                  c(Se, $, l.i, [So, T]));
              };
            (Me(ae, be, Ue, 0, 1, 1),
              Me(ae, Ue, H, 0, 1, 0),
              c([l.x, h, l.z], [0, 1, 0], l.i, [0.5, 1]),
              c([l.x + v[0], h, l.z + v[1]], [0, 1, 0], l.i, [0, 1]),
              c([l.x + x[0], h, l.z + x[1]], [0, 1, 0], l.i, [1, 1]));
          }
        }
    const r = new i.BufferGeometry();
    return (
      r.setAttribute("position", new i.Float32BufferAttribute(e, 3)),
      r.setAttribute("normal", new i.Float32BufferAttribute(t, 3)),
      r.setAttribute("aTi", new i.Float32BufferAttribute(o, 1)),
      r.setAttribute("aF", new i.Float32BufferAttribute(s, 2)),
      r.setAttribute("aFade", new i.Float32BufferAttribute(n, 1)),
      r
    );
  })(),
  mt = new i.Mesh(Kn, io);
((io.side = i.DoubleSide),
  (mt.frustumCulled = !1),
  (mt.renderOrder = 2.5),
  J.add(mt),
  ce.push(mt));
const xt = io.clone();
((xt.uniforms = i.UniformsUtils.clone(io.uniforms)),
  (xt.uniforms.uDep.value = Io),
  (xt.uniforms.uFlip.value = 1),
  (xt.uniforms.uTop.value = F + ze),
  (xt.uniforms.uK.value = 0.5));
const lo = new i.Mesh(Kn, xt);
((lo.frustumCulled = !1),
  (lo.visible = !1),
  J.add(lo),
  Ao.push(lo),
  Ce.push(mt));
const vt = new i.InstancedMesh(
  new i.PlaneGeometry(1, 1),
  oa(new i.Color(2.6, 1.2, 0.32), 0.95),
  Math.max(Re, 1),
);
((vt.frustumCulled = !1), (vt.renderOrder = 2.5), J.add(vt), ce.push(vt));
const Yn = O.map((e) => _e(e.x, We, e.z + 0.5, "#ffa64a", 1.6, 0));
function Wo(e = 600, t = 150) {
  const o = document.createElement("canvas");
  ((o.width = e), (o.height = t));
  const s = o.getContext("2d"),
    n = new i.CanvasTexture(o);
  ((n.colorSpace = i.SRGBColorSpace), (n.anisotropy = 4));
  const a = new i.Mesh(
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
    (a.renderOrder = 10),
    (a.frustumCulled = !1),
    to.add(a),
    (a.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 0,
      set(c, r = "", l = {}) {
        const f = c + "|" + r + "|" + JSON.stringify(l);
        if (f === this.key) return;
        ((this.key = f),
          (this.args = [c, r, l]),
          s.clearRect(0, 0, e, t),
          (s.font = "600 33px Outfit, sans-serif"));
        const u = s.measureText(c).width;
        s.font = `700 ${l.big || 44}px Outfit, sans-serif`;
        const d = r ? s.measureText(r).width : 0,
          p = !!r && !l.one,
          h = Math.min(e - 8, Math.max(u, p ? d : u + (r ? d + 22 : 0)) + 44),
          w = p ? t - 10 : Math.round(t * 0.52),
          y = l.align < 0 ? 4 : l.align > 0 ? e - 4 - h : (e - h) / 2,
          b = (t - w) / 2;
        ((s.fillStyle = l.bg || "rgba(11,14,22,.9)"),
          Fn(s, y, b, h, w, 16),
          s.fill(),
          (this.pw = h),
          (this.ph = w),
          (this.ox = y + h / 2 - e / 2),
          (s.textBaseline = "alphabetic"),
          (s.fillStyle = "#eef2fa"),
          (s.font = "600 33px Outfit, sans-serif"),
          p
            ? (s.fillText(c, y + 22, b + 46),
              (s.fillStyle = l.col || "#ffffff"),
              (s.font = `700 ${l.big || 44}px Outfit, sans-serif`),
              s.fillText(r, y + 22, b + w - 22))
            : (s.fillText(c, y + 22, b + w / 2 + 12),
              r &&
                ((s.fillStyle = l.col || "#fff"),
                (s.font = `700 ${l.big || 44}px Outfit, sans-serif`),
                s.fillText(r, y + 22 + u + 22, b + w / 2 + 14))),
          (n.needsUpdate = !0));
      },
    }),
    Do.push(() => {
      const c = a.userData;
      c.args && ((c.key = ""), c.set(...c.args));
    }),
    a
  );
}
function Ca() {
  return Wo(380, 96);
}
function za(e, t) {
  const o = e.userData;
  if (o.txt === t) return;
  o.txt = t;
  const s = o.c || (o.c = e.material.map.image),
    n = s.getContext("2d"),
    a = s.width,
    c = s.height;
  (n.clearRect(0, 0, a, c), (n.font = "700 46px Outfit, sans-serif"));
  const r = n.measureText(t).width,
    l = r + 40;
  ((n.fillStyle = "rgba(10,12,18,.8)"),
    Fn(n, (a - l) / 2, 10, l, c - 20, (c - 20) / 2),
    n.fill(),
    (o.pw = l),
    (o.ph = c - 20),
    (o.ox = 0),
    (n.fillStyle = "#fff6e6"),
    (n.textAlign = "center"),
    (n.textBaseline = "middle"),
    n.fillText(t, a / 2, c / 2 + 2),
    (n.textAlign = "left"),
    (e.material.map.needsUpdate = !0));
}
const Xn = new i.Vector3(),
  Ot = new i.Vector3();
function Bt(e, t, o = 24, s = 0, n = 0, a = 0) {
  const c = (oo(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(C.quaternion),
    e.scale.set(c, c, c),
    s &&
      e.position.addScaledVector(
        Xn.set(0, 1, 0).applyQuaternion(C.quaternion),
        (s * c * e.userData.h) / e.userData.w,
      ),
    n &&
      e.position.addScaledVector(
        Xn.set(1, 0, 0).applyQuaternion(C.quaternion),
        n * c,
      ),
    (e.userData.px = o),
    (e.userData.pri = a),
    co.push(e));
}
const co = [],
  fo = new i.Vector3();
function Ra() {
  co.sort((n, a) => a.userData.pri - n.userData.pri);
  const e = te.clientWidth,
    t = te.clientHeight,
    o = [],
    s = te.getBoundingClientRect();
  if (!Co.classList.contains("ui-off"))
    for (const n of [...ho, z(".side"), z(".ctl")]) {
      if (!n || (n.classList.contains("tcard") && !n.classList.contains("on")))
        continue;
      const a = n.getBoundingClientRect();
      a.width > 0 &&
        o.push([
          a.left - s.left,
          a.top - s.top,
          a.right - s.left,
          a.bottom - s.top,
        ]);
    }
  for (const n of co) {
    const a = n.userData;
    if (a.want > 0) {
      fo.copy(n.position).project(C);
      const c = a.px / a.h,
        r = (a.pw || a.w) * c,
        l = (a.ph || a.h) * c,
        f = (fo.x * 0.5 + 0.5) * e + (a.ox || 0) * c,
        u = (-fo.y * 0.5 + 0.5) * t,
        d = [f - r / 2 - 5, u - l / 2 - 4, f + r / 2 + 5, u + l / 2 + 4];
      fo.z > 1 ||
      d[0] < 0 ||
      d[1] < 0 ||
      d[2] > e ||
      d[3] > t ||
      o.some((p) => d[0] < p[2] && d[2] > p[0] && d[1] < p[3] && d[3] > p[1])
        ? (a.want = 0)
        : o.push(d);
    }
    ((a.a += (a.want - a.a) * (1 - Math.exp(-po * 8))),
      (n.material.opacity = a.a),
      (n.visible = a.a > 0.02));
  }
  co.length = 0;
}
let Ze = !0;
for (const e of O) {
  if (e.feat) {
    e.tag = Wo(640);
    const t = e.m.fresh;
    (e.tag.userData.set(
      e.m.name + (t ? ", new" : e.m.stealth ? " (stealth)" : ""),
      t ? "" : Dt(e.m.t),
      { one: t },
    ),
      (e.tag.userData.a = e.tag.userData.want = 1));
  }
  ((e.price = Ca()),
    (e.price.userData.txt = ""),
    e.feat && (e.price.userData.a = 1));
}
const uo = Wo(),
  ho = [z("#card-a"), z("#card-b")];
function Fa(e, t) {
  const o = e.m,
    s = W[m.h],
    n = Ye(lt(s)),
    a = m.turn,
    c = ue(o, s, a),
    r = `<h4>${Ye(o.name)}</h4><p class="tk"><b class="${t === "short" && c != null && c < Be * 0.1 ? "c" : ""}">${Dt(o.t)}</b> tokens this week</p><hr>`;
  if (o.fresh)
    return (
      r +
      `<p class="note">Entered the top 50 on ${ft(o.first)}, after the cost window closed (${ft(P.costWindow[1])}). No session measured yet: still under construction.</p>`
    );
  const l = P.cost[s]?.[o.id];
  return !l || l.every((f) => f == null)
    ? r +
        `<p class="note">${o.stealth ? "A stealth model: nobody has said whose it is. " : o.free ? "A free model. " : ""}No sessions measured in ${n}, so no reflection.</p>`
    : t === "short"
      ? r +
        `<div class="lb">${Po[a][0].toUpperCase() + Po[a].slice(1)} session:</div><div class="big${c != null && c >= Be * 0.1 ? " a" : ""}">${ct(c)}</div>`
      : r +
        `<div class="lb">One session in ${n}:</div><table>${l.map((f, u) => `<tr class="${u === a ? "on" : ""}"><td>${Eo[u]}</td><td>${ct(f)}</td></tr>`).join("")}</table>`;
}
const Vt = new i.Vector3();
function Zn(e, t, o) {
  if (!t) {
    e.classList.remove("on");
    return;
  }
  const s = Fa(t, e === ho[1] ? "short" : "full");
  (e._h !== s && ((e.innerHTML = s), (e._h = s)),
    Vt.set(t.x, F + U + t.h * 0.6, t.z).project(C));
  const n = te.clientWidth,
    a = te.clientHeight;
  if (Vt.z > 1) {
    e.classList.remove("on");
    return;
  }
  const c = (Vt.x * 0.5 + 0.5) * n,
    r = (-Vt.y * 0.5 + 0.5) * a,
    l = e.offsetWidth || 222,
    f = e.offsetHeight || 170,
    u = Math.max(26, (oo(Vt.set(t.x, t.top.y, t.z), 1) > 0, 34));
  let d = o > 0 ? c + u : c - u - l,
    p = r - f * 0.55;
  const h = Math.min(
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--sael-corner-w",
        ),
      ) || 260,
      320,
    ),
    w = Math.min(
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--sael-corner-h",
        ),
      ) || 260,
      320,
    );
  ((d = B(d, 12, n - l - 12)),
    (p = B(p, he ? 150 : 96, a - f - (he ? 150 : 16))));
  const y = z(".side").getBoundingClientRect(),
    b = z(".ctl").getBoundingClientRect(),
    v = (x) =>
      d < x.right + 10 &&
      d + l > x.left - 10 &&
      p < x.bottom + 10 &&
      p + f > x.top - 10;
  (!he && v(y) && (p = y.bottom + 14),
    !he && v(b) && (p = b.bottom + 14),
    d + l > n - h - 30 && p + f > a - w - 30 && (p = a - w - 30 - f),
    (e.style.transform = `translate(${d.toFixed(0)}px,${p.toFixed(0)}px)`),
    e.classList.add("on"));
}
const m = {
    turn: 3,
    turnT: 3,
    turnV: 3,
    h: 0,
    hFrom: 0,
    hMix: 1,
    sel: null,
    selB: null,
    scrub: !1,
  },
  je = new Float32Array(Re),
  Jn = new Float32Array(Re);
let Ho = 0.016,
  jo = 0.016,
  po = 0.016,
  Je = 0,
  Cr = null;
function mo(e, t, o) {
  const s = Math.min(3, Math.floor(o)),
    n = o - s,
    a = Bn(ue(e.m, t, s)),
    c = s < 3 ? Bn(ue(e.m, t, s + 1)) : a;
  return hn(a, c, n);
}
function ka(e) {
  ((m.turnV += (m.turnT - m.turnV) * (1 - Math.exp(-e * (m.scrub ? 14 : 4.2)))),
    Math.abs(m.turnT - m.turnV) < 5e-4 && (m.turnV = m.turnT));
  const t = W[m.h];
  for (let a = 0; a < Re; a++)
    ((Jn[a] = mo(O[a], t, m.turnV)),
      (je[a] += (Jn[a] - je[a]) * (1 - Math.exp(-e * (m.scrub ? 14 : 3.6)))));
  const o = sn(t, m.turn),
    s = Uo.value,
    n = Qn ? 1 - Math.exp(-e * 2.6) : 1;
  Qn = !0;
  for (let a = 0; a < Re; a++) {
    const c = O[a].m,
      r = ue(c, t, m.turn),
      l = o && r != null && r > 0 && r < o.X && c.t >= P.total * 0.01 ? 1 : 0;
    s[a] += (l - s[a]) * n;
  }
}
let Qn = !1;
const es = new i.Matrix4(),
  zr = new i.Quaternion(),
  Aa = new i.Vector3(),
  La = new i.Vector3();
function _a() {
  for (let e = 0; e < Re; e++) {
    const t = O[e],
      o = je[e],
      s = o > 0.003;
    Io[e] = s ? o : 0;
    const n = s ? 0.5 + Math.min(o, 1) * 0.4 : 1e-4;
    (es.compose(La.set(t.x, We - o - 0.02, t.z), C.quaternion, Aa.set(n, n, n)),
      vt.setMatrixAt(e, es),
      Yn[e].p.set(t.x, We - o - 0.15, t.z + 0.35),
      (Yn[e].i = s ? Math.min(1.4, 0.25 + o * 0.45) * $o[e] : 0));
  }
  vt.instanceMatrix.needsUpdate = !0;
}
const Da = new i.Color(1.75, 0.6, 0.13),
  Ea = new i.Color(2.2, 1.05, 0.3),
  qo = new i.Vector3(),
  Ko = new i.Vector3();
function Pa(e) {
  _t.begin();
  const t = $o;
  for (let n = 0; n < Re; n++) {
    const a = O[n],
      c = je[n];
    if (c < 0.01) continue;
    const r = t[n];
    (qo.set(a.x, We - 0.01, a.z),
      Ko.set(a.x, We - c, a.z),
      _t.seg(qo, Ko, He * 0.34, He * 0.38, Da, 0.26 * r, 0.42 * r),
      _t.seg(qo, Ko, He * 0.1, He * 0.12, Ea, 0.55 * r, 1 * r));
  }
  _t.end();
  for (const n of jn) {
    const a = n.a + e * n.v,
      c = n.T,
      r = n.r * (1 + 0.08 * Math.sin(e * 0.3 + n.ph));
    (n.sp.position.set(
      c.x + Math.cos(a) * r,
      F + U + c.h * n.y + Math.sin(e * 0.21 + n.ph) * 0.08,
      c.z + Math.sin(a) * r,
    ),
      n.sp.quaternion.copy(C.quaternion));
    const l = n.s * (1 + 0.1 * Math.sin(e * 0.17 + n.ph));
    (n.sp.scale.set(l, l * 0.8, l),
      (n.sp.material.opacity =
        n.o * (0.8 + 0.2 * Math.sin(e * 0.4 + n.ph)) * (Ze || 1)));
  }
  const o = W[m.h];
  for (const n of O) {
    const a = je[n.i];
    if (n.tag) {
      n.tag.userData.want = Ze && m.sel !== n ? 1 : 0;
      const l = he ? 36 : 50,
        f = 1 + n.m.t / Pn;
      n.h > 2.6
        ? Bt(n.tag, Ot.set(n.x, F + U + n.h * 0.8, n.z), l, 0, -0.28, f)
        : Bt(
            n.tag,
            Ot.set(n.x, F + U + n.h + (n.m.fresh ? 0.3 : 0.06), n.z),
            l,
            0.62,
            0,
            f,
          );
    }
    const c =
        Ze &&
        (n.feat || m.sel === n || m.selB === n) &&
        !n.m.fresh &&
        n.z > No - 0.7 * Go,
      r = ue(n.m, o, Math.round(m.turnV));
    (c &&
      r != null &&
      za(
        n.price,
        ct(
          hn(
            ue(n.m, o, Math.floor(m.turnV)) ?? r,
            ue(n.m, o, Math.min(3, Math.floor(m.turnV) + 1)) ?? r,
            m.turnV - Math.floor(m.turnV),
          ),
        ),
      ),
      (n.price.userData.want = c && r != null ? 1 : 0),
      Bt(
        n.price,
        Ot.set(n.x, We - a - 0.12, n.z + 0.3),
        he ? 24 : 32,
        -0.7,
        0,
        5 + (m.sel === n || m.selB === n ? 2 : 0),
      ));
  }
  const s = uo.userData;
  ((s.want = Q && !Q.feat && Q !== m.sel ? 1 : 0),
    Q
      ? Bt(uo, Ot.set(Q.x, F + U + Q.h + 0.06, Q.z), 46, 0.62, 0, 10)
      : Bt(uo, Ot.set(0, -99, 0), 46, 0, 0, 10),
    Ra(),
    Zn(ho[0], m.sel, m.sel && m.sel.x > 2.5 ? -1 : 1),
    Zn(ho[1], m.selB, m.selB && m.selB.x > (m.sel ? m.sel.x : 0) ? 1 : -1));
}
let Q = null;
const ts = [];
function Oa(e, t, o, s, n = 128, a = "@RYANSAEL") {
  const c = () => {
    ((e.font = `600 ${n}px Outfit, sans-serif`),
      (e.letterSpacing = Math.round(n * 0.28) + "px"));
  };
  c();
  const r = e.measureText(a).width;
  r > t - 28 && ((n = Math.floor((n * (t - 28)) / r)), c());
  const l = t / 2 + Math.round(n * 0.14),
    f = o / 2 + n * 0.35;
  ((e.textAlign = "center"),
    (e.textBaseline = "alphabetic"),
    (e.fillStyle = "#050403"),
    e.fillText(a, l + n * 0.02, f + n * 0.06),
    (e.fillStyle = "#fff0cc"),
    e.fillText(a, l, f - n * 0.025));
  const u = e.createLinearGradient(0, f - n * 0.7, 0, f);
  (u.addColorStop(0, s ? "#ffe2a0" : "#f1d08c"),
    u.addColorStop(1, s ? "#e8a040" : "#b3833d"),
    (e.fillStyle = u),
    e.fillText(a, l, f));
}
function Ba(e, t = {}) {
  const o = t.k ?? 0.62;
  let s = !1;
  const n = (c, r, l) => Oa(c, r, l, s),
    a = Rn(e, e * 0.1375, 1280, 176, n, o, { alphaTest: 0.25 });
  return (
    (a.userData.mark = 1),
    Ce.push(a),
    ts.push({
      hit: a,
      over(c) {
        ((s = c),
          a.material.color.setRGB(c ? 3.2 : o, c ? 2.4 : o, c ? 1.4 : o));
      },
    }),
    a
  );
}
{
  const e = Ba(2.2, { k: 0.72 });
  (e.position.set(-X.x + 1.8, de * 0.48, X.z + 0.004), J.add(e));
}
const Ve = {
    lab: {
      t: [-0.7, 3.55, 2.4],
      yaw: -0.27,
      pitch: 0.3,
      dist: 24.2,
      f: [0.4, 3.4, 3.2],
      r: 6.5,
      fit: [20.8, 12.4],
    },
    floor: {
      t: [-1.1, 3.05, 4],
      yaw: 0.2,
      pitch: 0.07,
      dist: 13.2,
      f: [0.75, 2.8, 4.02],
      r: 4,
      fit: [11.3, 7.1],
    },
  },
  os = { t: [-0.8, 4.4, 1.4], yaw: -0.26, pitch: 0.4, dist: 31 },
  A = { t: new i.Vector3(0, 5, 0), yaw: 0, pitch: 0.3, dist: 22 };
let xo = 4,
  ge = 1,
  Yo = 1,
  he = !1,
  pe = !1,
  Xo = [20.8, 12.4],
  ns = 24.2,
  Qe = "lab";
const me = L.domElement,
  et = new Map();
let vo = 0,
  gt = null,
  Fe = null,
  Zo = null,
  ss = 0,
  as = 0;
const qe = new i.Raycaster(),
  rs = new i.Vector2(),
  wt = new i.Vector3();
function yt(e) {
  const t = he && C.aspect < 0.8 && e === Ve.lab ? { ...e, ...os } : e;
  (A.t.set(...t.t),
    (A.yaw = t.yaw),
    (A.pitch = t.pitch),
    (A.dist = t.dist),
    at.set(...t.f),
    (xo = t.r),
    t.fit && ((Xo = t.fit), (ns = t.dist)),
    (ge = 1),
    (pe = !1),
    ys());
}
const is = [],
  Va = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), is.push(e));
  };
ts.forEach((e) => Va(e.hit, "link", { L: e }));
const Ga = (e) => {
  let t = e;
  for (; t.parent; t = t.parent) if (!t.visible) return !1;
  return t === N && t.visible;
};
function Jo(e) {
  const t = me.getBoundingClientRect();
  (rs.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    qe.setFromCamera(rs, C));
  let o = null,
    s = 1e9;
  const n = qe.intersectObjects(
    is.filter((c) => c.visible && Ga(c)),
    !1,
  )[0];
  n && ((o = { ...n.object.userData.hk, point: n.point }), (s = n.distance));
  for (const c of O)
    if (qe.ray.intersectBox(c.box, wt)) {
      const r = wt.distanceTo(qe.ray.origin);
      r < s && ((s = r), (o = { kind: "tower", T: c }));
    }
  const a = qe.ray.direction.z;
  if (Math.abs(a) > 1e-4) {
    const c = (R.z - qe.ray.origin.z) / a;
    c > 0 &&
      c < s &&
      (wt.copy(qe.ray.direction).multiplyScalar(c).add(qe.ray.origin),
      Math.abs(wt.x) < R.x &&
        wt.y > de &&
        wt.y < F - 0.05 &&
        (o = { kind: "glass" }));
  }
  return o;
}
function Gt(e, t = null) {
  ((m.sel = e), (m.selB = t), ke(!0));
}
function Na(e) {
  if (!e) {
    m.sel && Gt(null);
    return;
  }
  switch (e.kind) {
    case "tower":
      Gt(m.sel === e.T && !m.selB ? null : e.T);
      break;
    case "link":
      window.open(Es, "_blank", "noopener");
      break;
  }
}
function go(e, t = !0) {
  ((m.turnT = B(e, 0, 3)),
    t && (m.turnT = Math.round(m.turnT)),
    (m.turn = Math.round(m.turnT)),
    ke(!0));
}
function Qo(e) {
  ((m.h = (e + W.length) % W.length), ke(!0));
}
function en(e, t) {
  const o =
      (C.position.distanceTo(A.t) *
        2 *
        Math.tan(i.MathUtils.degToRad(C.fov / 2))) /
      Math.max(te.clientHeight, 1),
    s = Math.cos(A.yaw),
    n = Math.sin(A.yaw);
  ((pe = !0),
    (A.t.x = B(A.t.x - s * e * o, -12, 12)),
    (A.t.z = B(A.t.z + n * e * o, -8, 9)),
    (A.t.y = B(A.t.y + t * o, 1, 14)));
}
const ls = {
    tower: (e) => {
      const t = e.T.m,
        o = ue(t, W[m.h], m.turn);
      return (
        t.name +
        " \xB7 " +
        Dt(t.t) +
        (t.fresh
          ? " \xB7 new"
          : o != null
            ? " \xB7 " + ct(o) + " a session"
            : " \xB7 no sessions measured")
      );
    },
    glass: () => "Drag up or down: session length",
    link: () => "@RYANSAEL on X",
  },
  tt = z("#tip");
let Nt = null;
function Ua(e) {
  const t = Jo(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== Nt && (Nt?.over(!1), o?.over(!0), (Nt = o)),
    (Q = t?.kind === "tower" ? t.T : null),
    Q && !Q.feat && Q !== m.sel && uo.userData.set(Q.m.name, Dt(Q.m.t)),
    (me.style.cursor = t
      ? t.kind === "glass"
        ? "ns-resize"
        : "pointer"
      : ""));
  const s = t && ls[t.kind] ? ls[t.kind](t) : "";
  s
    ? ((tt.textContent = s),
      (tt.style.left = e.clientX + "px"),
      (tt.style.top = e.clientY + "px"),
      tt.classList.add("on"))
    : tt.classList.remove("on");
}
(me.addEventListener("contextmenu", (e) => e.preventDefault()),
  me.addEventListener("pointerleave", () => {
    (Nt?.over(!1),
      (Nt = null),
      (Q = null),
      tt.classList.remove("on"),
      (me.style.cursor = ""));
  }),
  me.addEventListener("pointerdown", (e) => {
    Ke();
    try {
      me.setPointerCapture(e.pointerId);
    } catch {}
    (tt.classList.remove("on"),
      et.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (gt = null));
    const t = e.button === 0 && !e.shiftKey && et.size === 1 ? Jo(e) : null;
    ((Zo = t),
      (Fe =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null),
      t?.kind === "glass" &&
        ((m.scrub = !0), (ss = e.clientY), (as = m.turnT)));
  }),
  me.addEventListener("pointermove", (e) => {
    const t = et.get(e.pointerId);
    if (!t) {
      Ua(e);
      return;
    }
    const o = e.clientX - t[0],
      s = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), m.scrub)) {
      const n = te.clientHeight;
      m.turnT = B(as + ((e.clientY - ss) / (n * 0.26)) * 3 * 0.5, 0, 3);
      const a = Math.round(m.turnT);
      a !== m.turn && ((m.turn = a), ke(!0));
      return;
    }
    if (
      (Fe &&
        Math.hypot(e.clientX - Fe[0], e.clientY - Fe[1]) > 6 &&
        (Fe = null),
      !Fe)
    ) {
      if (((pe = !0), et.size === 2)) {
        const [n, a] = [...et.values()],
          c = Math.hypot(n[0] - a[0], n[1] - a[1]),
          r = [(n[0] + a[0]) / 2, (n[1] + a[1]) / 2];
        (vo && (ge = B((ge * vo) / c, 0.3, 2.2)),
          (vo = c),
          gt && en(r[0] - gt[0], r[1] - gt[1]),
          (gt = r));
        return;
      }
      t[2]
        ? en(o, s)
        : ((A.yaw -= o * 0.004),
          (A.pitch = B(A.pitch + s * 0.003, -0.02, 1.3)));
    }
  }));
const cs = (e) => {
  (m.scrub
    ? ((m.scrub = !1), go(m.turnT))
    : Fe && et.size === 1 && performance.now() - Fe[2] < 450 && Na(Zo),
    (Fe = null),
    (Zo = null),
    et.delete(e.pointerId),
    (vo = 0),
    (gt = null));
};
(me.addEventListener("pointerup", cs),
  me.addEventListener("pointercancel", (e) => {
    ((Fe = null), cs(e));
  }),
  me.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        Ke(),
        (pe = !0),
        (ge = B(
          ge * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.3,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const bt = new Set();
(addEventListener("keyup", (e) => bt.delete(e.key.toLowerCase())),
  addEventListener("blur", () => bt.clear()));
const Ia = new i.Vector3();
function $a() {
  if (!bt.size) return;
  const e = (bt.has("shift") ? 2.4 : 1) * Ho,
    t = (...n) => n.some((a) => bt.has(a));
  let o = 0,
    s = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (s += 1),
    t("s", "arrowdown") && (s -= 1),
    (o || s) &&
      (en(o * e * 420, 0),
      A.t.addScaledVector(
        Ia.set(-Math.sin(A.yaw), 0, -Math.cos(A.yaw)),
        s * e * 6,
      )),
    t("q") && (A.yaw += e * 1.1),
    t("e") && (A.yaw -= e * 1.1),
    t("=", "+") && (ge = B(ge * Math.exp(-e * 1.3), 0.3, 2.2)),
    t("-", "_") && (ge = B(ge * Math.exp(e * 1.3), 0.3, 2.2)),
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
    ) && (pe = !0));
}
let Mt = !0,
  Ut = -99,
  wo = -1,
  ee = null,
  It = 0;
const Rr = (e) => O.find((t) => e.test(t.m.name)),
  fs = ht.filter((e) => e.r === 0 && e.m).map((e) => e.m.T),
  Wa = fs
    .filter((e) => pt(e.m) != null)
    .sort((e, t) => pt(t.m) - pt(e.m))
    .slice(0, 3),
  Ha = fs.slice().sort((e, t) => t.m.t - e.m.t),
  $t = (e) => () => go(e),
  yo = (e) => () => Qo(e),
  St = (e, t) => () => Gt(e || null, t || null),
  ot = O.find((e) => e.m.stealth) || O[0],
  Tt = O.find((e) => e.m.fresh),
  tn = [
    {
      ...Ve.lab,
      dy: 0.003,
      hold: 13,
      beats: [
        [0, $t(3)],
        [6.2, $t(0)],
        [7.6, $t(1)],
        [9, $t(2)],
        [10.4, $t(3)],
      ],
    },
    {
      ...Ve.floor,
      dy: -0.006,
      hold: 9,
      beats: [
        [0.6, St(Wa[0], Ha[0])],
        [8.6, St()],
      ],
    },
    {
      t: [0.9, 2.3, 4.4],
      yaw: 0.42,
      pitch: 0.14,
      dist: 8.6,
      dy: -0.01,
      f: [0.75, 2.2, 4.02],
      r: 2.6,
      hold: 10,
      beats: [
        [2.6, yo(1)],
        [5.2, yo(2)],
        [7.8, yo(3)],
        [9.6, yo(0)],
      ],
    },
    {
      t: [ot.x, F + ot.h * 0.55, ot.z],
      yaw: -0.25,
      pitch: 0.08,
      dist: 11,
      dy: 0.012,
      f: [ot.x, F + ot.h * 0.5, ot.z],
      r: 2.6,
      hold: 7,
      beats: [
        [0.4, St(ot)],
        [6.6, St()],
      ],
    },
    ...(Tt
      ? [
          {
            t: [Tt.x - 0.6, F + 0.9, Tt.z],
            yaw: -0.6,
            pitch: 0.2,
            dist: 7.5,
            dy: 0.01,
            f: [Tt.x, F + 0.4, Tt.z],
            r: 2,
            hold: 7,
            beats: [
              [0.5, St(Tt)],
              [6.6, St()],
            ],
          },
        ]
      : []),
  ];
function us(e, t) {
  ((wo = e), (ee = tn[e]), (It = 0));
  const o = he && C.aspect < 0.8 && e === 0 ? { ...ee, ...os } : ee;
  (yt(o), (Ut = t));
}
function ja(e) {
  (e < Ut - 1 && (Ut = e),
    (!ee || e - Ut > ee.hold) && us((wo + 1) % tn.length, e));
  const t = e - Ut;
  if (!(t < 0)) {
    for (; It < ee.beats.length && t >= ee.beats[It][0];)
      (ee.beats[It][1](), It++);
    pe ||
      ((A.yaw = ee.yaw + t * ee.dy),
      (A.dist = ee.dist * (1 - t * 0.006)),
      at.set(...ee.f),
      (xo = ee.r));
  }
}
function nt(e) {
  ((Mt = e),
    z("#cine").classList.toggle("on", e),
    z("#cine").setAttribute("aria-pressed", e),
    e && ((ee = null), (wo = -1), (pe = !1), (ge = 1)));
}
let on = null;
const Ke = () => {
  ((on = null), Mt && nt(!1));
};
function nn() {
  (nt(!1), yt(Ve[Qe]));
}
function qa(e) {
  const t = pe ? 0 : Math.sin(e / 8) * 0.02,
    o = A.dist * ge * Yo,
    s = A.yaw + t,
    n = Math.asin(B((0.5 - A.t.y) / Math.max(o, 0.1), -1, 1)),
    a = Math.max(A.pitch, n),
    c = Math.cos(a);
  if (
    (C.position.set(
      A.t.x + Math.sin(s) * c * o,
      A.t.y + Math.sin(a) * o,
      A.t.z + Math.cos(s) * c * o,
    ),
    C.lookAt(A.t),
    !Mt && !pe)
  ) {
    const u = on || Ve[Qe];
    (at.set(...u.f), (xo = u.r));
  }
  const r = C.position.distanceTo(pe ? A.t : at),
    l = pe ? Math.min(1, Ho * 5) : 1,
    f = (pe ? Math.max(2.4, r * 0.3) : xo) * g.focalBand;
  ((fe.u.focus.value += (r - fe.u.focus.value) * l),
    (fe.u.range.value += (f - fe.u.range.value) * l),
    fe.u.cocScale.value.set(g.apertureNear, g.aperture));
}
const ds = z("#seg-turn"),
  hs = z("#seg-h");
((ds.innerHTML = ra
  .map((e, t) => `<button data-i="${t}">${e}</button>`)
  .join("")),
  (hs.innerHTML = W.map(
    (e, t) => `<button data-i="${t}">${Ye(lt(e))}</button>`,
  ).join("")));
const ps = [...ds.children],
  ms = [...hs.children];
(ps.forEach(
  (e) =>
    (e.onclick = () => {
      (Ke(), go(+e.dataset.i));
    }),
),
  ms.forEach(
    (e) =>
      (e.onclick = () => {
        (Ke(), Qo(+e.dataset.i));
      }),
  ));
function sn(e, t) {
  const o = Pt.map((f) => ({ m: f, c: ue(f, e, t) })).filter(
    (f) => f.c != null && f.c > 0,
  );
  if (!o.length) return null;
  const s = o.reduce((f, u) => (u.c > f.c ? u : f)),
    n = o.filter((f) => f.m.t >= P.total * 0.01),
    a = (n.length ? n : o).reduce((f, u) => (u.c < f.c ? u : f)),
    c = o.reduce((f, u) => f + u.m.t, 0),
    r = ia(s.c * 0.05),
    l = o.filter((f) => f.c < r).reduce((f, u) => f + u.m.t, 0);
  return { mx: s, mn: a, gap: s.c / a.c, X: r, share: l / c, n: o.length };
}
let xs = 0;
function Ka() {
  const e = W[m.h],
    t = sn(e, m.turn);
  if (!t)
    return `No sessions of this length were measured in <b>${Ye(lt(e))}</b>.`;
  const o = Math.round(t.share * 100),
    s = ct(t.X).replace(/\.00$/, "");
  if (m.sel) {
    const n = m.sel.m,
      a = ue(n, e, m.turn);
    if (a != null)
      return (
        `<b>${Ye(n.name)}</b> did <b>${((n.t / P.total) * 100).toFixed(n.t / P.total < 0.01 ? 1 : 0)}%</b> of this week's tokens. One ${Po[m.turn]} session on it in ${Ye(lt(e))} costs <span class="a">${ct(a)}</span>` +
        (t.mn.m === n
          ? ", the cheapest of the busy models."
          : a > t.mn.c
            ? `, ${Math.round(a / t.mn.c)}x one on <b>${Ye(t.mn.m.name)}</b>.`
            : ".")
      );
  }
  return t.share >= 0.6
    ? `The models doing most of the work cost the least to run: <b>${o}%</b> of these tokens ran on models under <span class="c">${s}</span> a session.`
    : `At this length, <b>${o}%</b> of these tokens ran on models under <span class="c">${s}</span> a session.`;
}
function ke(e) {
  if (!e && Je - xs < 0.1) return;
  xs = Je;
  const t = W[m.h],
    o = sn(t, m.turn);
  ((z("#s-tok").textContent = Dt(P.total || 0).replace("T", "T")),
    (z("#s-gap").textContent = o ? Math.round(o.gap) + "x" : "\u2013"),
    (z("#s-h").textContent = lt(t) + ","),
    (z("#s-turn").textContent = Eo[m.turn]),
    ps.forEach((n, a) => {
      (n.classList.toggle("on", a === m.turn),
        n.setAttribute("aria-pressed", a === m.turn));
    }),
    ms.forEach((n, a) => {
      (n.classList.toggle("on", a === m.h),
        n.setAttribute("aria-pressed", a === m.h));
    }));
  const s = Ka();
  s !== ke.w && ((z("#why").innerHTML = s), (ke.w = s));
}
{
  const e = P.asOf ? ft(P.asOf.slice(0, 10)) : "";
  ((z("#src").innerHTML =
    `Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}`),
    (z("#s-tok-l").textContent = "tokens in 7 days"),
    (z("#info-src").innerHTML =
      `Tokens: OpenRouter's daily token totals for the top 50 models, ${ft(P.week[0])} to ${ft(P.week[1])}. Costs: OpenRouter's cost per session by harness and model, the median over the ${P.costWindow ? Math.round((new Date(P.costWindow[1]) - new Date(P.costWindow[0])) / 864e5) + 1 : 30} days to ${ft(P.costWindow[1])}. Both CC BY 4.0. Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}.`));
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
let we = 0,
  vs = 0,
  an = 0,
  rn = 0,
  bo = 0;
function ye() {
  (L.setPixelRatio(g.pixelRatio),
    le.setPixelRatio(g.pixelRatio),
    kt.rt.samples !== g.msaa && ((kt.rt.samples = g.msaa), kt.rt.dispose()),
    (Sn.enabled = !!g.smaa),
    V.shadow.mapSize.x !== g.shadow &&
      (V.shadow.mapSize.set(g.shadow, g.shadow),
      V.shadow.map?.dispose(),
      (V.shadow.map = null)),
    (Ee.enabled = !!g.bloom),
    (Ee.radius = g.bloomRadius),
    (G.enabled = !0),
    G.updateGtaoMaterial({
      radius: g.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: g.ao ? g.aoSamples : 2,
    }),
    (fe.enabled = !!g.dof),
    (fe.u.maxCoc.value = g.maxCoc),
    Ja(),
    bs());
}
function Ne() {
  ((z("#tune-rows").innerHTML = Ge.map(([e, t, o, s, , n, a], c) => {
    const r = g[e],
      l = ((r - o) / (s - o)) * 100;
    return `<div class="tr${c === we ? " sel" : ""}${a ? " sub" : ""}" data-i="${c}"><b>${t}</b><span class="tk"><i style="left:${B(l, 0, 100)}%"></i></span><u>${n(r)}</u></div>`;
  }).join("")),
    z("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((we = +e.dataset.i), Ne());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (we = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const s = (n) => {
            const a = t.getBoundingClientRect(),
              [c, , r, l, f] = Ge[we],
              u = B(
                Math.round(
                  (r + ((n.clientX - a.left) / a.width) * (l - r)) / f,
                ) * f,
                r,
                l,
              );
            u !== g[c] &&
              ((g[c] = +u.toFixed(4)), c !== "auto" && (g.auto = 0), ye());
            const d = t.querySelector("i");
            ((d.style.left = B(((g[c] - r) / (l - r)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = Ge[we][5](g[c])),
              (z("#tune-json").value = JSON.stringify(g)));
          };
          (s(o),
            (t.onpointermove = (n) => {
              t.hasPointerCapture(n.pointerId) && s(n);
            }),
            (t.onpointerup = () => Ne()));
        };
      }),
    (z("#tune-json").value = JSON.stringify(g)));
}
function Ya(e, t) {
  const [o, , s, n, a] = Ge[we],
    c = B(+(g[o] + e * a * (t ? 5 : 1)).toFixed(4), s, n);
  c !== g[o] && ((g[o] = c), o !== "auto" && (g.auto = 0), ye(), Ne());
}
function gs(e) {
  const t = z("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && Ne());
}
function Xa(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (we = (we + (t === "ArrowUp" ? -1 : 1) + Ge.length) % Ge.length),
      Ne(),
      z("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (Ya(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , s, n, a] = Ge[we];
    return n - s === a
      ? ((g[o] = g[o] ? 0 : 1), o !== "auto" && (g.auto = 0), ye(), Ne(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(g, Lo) : (g[Ge[we][0]] = Lo[Ge[we][0]]),
      (g.auto = 0),
      ye(),
      Ne(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(g, null, 1)), !0)
      : t === "Escape"
        ? (gs(!1), !0)
        : !1;
}
z("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in Lo) typeof t[o] == "number" && (g[o] = t[o]);
    ((g.auto = 0), ye(), Ne());
  } catch {
    Ne();
  }
});
const Mo = z("#ui-hint");
let ws = -9;
function Wt(e) {
  ((Mo.textContent = e), Mo.classList.add("on"), (ws = Je));
}
const ln = ["lab", "floor"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), gs());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    z("#info").open
  )
    return;
  if (!z("#tune").hidden && Xa(e)) {
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
      t !== "shift" && Ke(),
      bt.add(t));
    return;
  }
  t >= "1" && t <= "4"
    ? (Ke(), go(+t - 1), Wt("Session length: " + Eo[+t - 1]))
    : t === "[" || t === "]"
      ? (Ke(), Qo(m.h + (t === "[" ? -1 : 1)), Wt(lt(W[m.h])))
      : t === "v"
        ? (Ke(),
          (Qe = ln[(ln.indexOf(Qe) + 1) % ln.length]),
          yt(Ve[Qe]),
          Wt(Qe === "lab" ? "Skyline" : "Close-up"))
        : t === "c"
          ? z("#cine").click()
          : t === "r"
            ? nn()
            : t === "escape"
              ? Gt(null)
              : t === "n"
                ? ((Ze = !Ze), Wt(Ze ? "Labels on" : "Labels off"))
                : t === "/" &&
                  (e.preventDefault(),
                  Co.classList.toggle("ui-off"),
                  Wt(
                    Co.classList.contains("ui-off")
                      ? "Interface hidden \xB7 / to show"
                      : "Interface shown",
                  ));
}),
  (z("#cine").onclick = () => {
    Mt ? nn() : nt(!0);
  }),
  me.addEventListener("dblclick", (e) => {
    Jo(e) || nn();
  }),
  (z("#how").onclick = () => z("#info").showModal()),
  (z("#close").onclick = () => z("#info").close()),
  z("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    z("#tune").hidden || (z("#tune-fps").textContent = Math.round(vs) + " fps");
  }, 500));
const Za = {
  bg: "#0d1119",
  fog: "#151b28",
  fogD: 0.0035,
  exp: 0.95,
  envI: 0.4,
  bloomT: 1.15,
  bloomS: 0.3,
  refl: 0.5,
  hemi: [9414360, 3813414, 0.26],
  sun: [16763289, 0.68],
  sunDir: [-0.55, 0.72, 0.42],
  rim: 0.55,
  key2: 0.2,
};
function Ja() {
  const e = Za;
  (N.background.set(e.bg),
    N.fog.color.set(e.fog),
    (N.fog.density = e.fogD * g.fog),
    (L.toneMapping = i.ACESFilmicToneMapping),
    (L.toneMappingExposure = g.exposure * e.exp),
    (N.environment = zo.show),
    (N.environmentIntensity = g.env * e.envI),
    (Ee.threshold = g.bloomThreshold * e.bloomT),
    (Ee.strength = g.bloomStrength * e.bloomS),
    (Zt.uReflStrength.value = g.reflect * e.refl),
    qt.color.set(e.hemi[0]),
    qt.groundColor.set(e.hemi[1]),
    (qt.intensity = e.hemi[2] * g.fill),
    V.color.set(e.sun[0]),
    (V.intensity = e.sun[1] * g.sun),
    V.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    V.target.position.set(0, 5, 0),
    (zt.intensity = e.rim * g.rim),
    (Kt.intensity = e.key2 * g.fill),
    (mn.value = g.sat));
}
(zt.position.set(4, 20, -15),
  zt.color.set(10274559),
  Kt.position.set(-10, 14, 12),
  Object.assign(V.shadow.camera, {
    left: -12,
    right: 12,
    top: 12,
    bottom: -6,
    near: 1,
    far: 70,
  }),
  V.shadow.camera.updateProjectionMatrix());
function ys() {
  const e = te.clientWidth,
    t = te.clientHeight;
  he = e < 900;
  const o = g.fov + (he ? 8 : 0);
  (C.fov !== o && ((C.fov = o), C.updateProjectionMatrix()),
    C.setViewOffset(
      e,
      t,
      he ? 0 : -e * 0.015,
      he ? t * 0.06 : -t * 0.035,
      e,
      t,
    ));
  const s = 2 * Math.tan(i.MathUtils.degToRad(C.fov / 2));
  Yo =
    C.aspect < 0.8
      ? B(0.62 / Math.max(C.aspect, 0.4), 1, 1.5)
      : B(Math.max(Xo[0] / (s * C.aspect), Xo[1] / s) / ns, 0.85, 2.2);
}
function bs() {
  const e = te.clientWidth,
    t = te.clientHeight;
  ((C.aspect = e / t),
    C.updateProjectionMatrix(),
    L.setSize(e, t),
    le.setSize(e, t));
  const o = L.getDrawingBufferSize(new i.Vector2());
  (Ro.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    Mn.uRes.value.copy(o),
    ys(),
    C.updateProjectionMatrix());
}
addEventListener("resize", bs);
let Ms = performance.now(),
  cn = 0,
  fn = 0,
  Ss = 0;
function un(e) {
  ((po = Math.max(0, (e - Ms) / 1e3)),
    (jo = Math.min(1.5, po)),
    (Ho = Math.min(0.1, jo)),
    (Ms = e));
  const t = e / 1e3;
  if (
    ((Je = t),
    Mt && ja(t),
    $a(),
    ka(po),
    _a(),
    qa(t),
    C.updateMatrixWorld(),
    (L.shadowMap.needsUpdate = !0),
    Pa(t),
    ke(),
    Mo.classList.contains("on") && Je - ws > 1.5 && Mo.classList.remove("on"),
    (cn += jo),
    fn++,
    e - Ss > 1600)
  ) {
    const o = fn / Math.max(cn, 0.001);
    ((cn = 0),
      (fn = 0),
      (Ss = e),
      (vs = o),
      rn++,
      rn > 2 && (an = Math.max(an, o)),
      (bo = rn > 3 && o < an * 0.74 ? bo + 1 : 0),
      !document.hidden &&
        g.auto &&
        bo >= 2 &&
        o < 50 &&
        ((bo = 0),
        g.pixelRatio > 1
          ? ((g.pixelRatio = Math.max(1, +(g.pixelRatio - 0.25).toFixed(2))),
            ye())
          : g.reflect
            ? ((g.reflect = 0), ye())
            : g.msaa > 0
              ? ((g.msaa = 0), ye())
              : g.ao && ((g.ao = 0), ye())));
  }
  ($s(), L.info.reset(), le.render());
}
let Ts = !0;
function Cs(e) {
  (requestAnimationFrame(Cs), Ts && un(e));
}
for (let e = 0; e < Re; e++) je[e] = mo(O[e], W[m.h], m.turnV);
(ye(),
  yt(Ve.lab),
  nt(!0),
  z("#loading").remove(),
  ke(!0),
  requestAnimationFrame(Cs),
  (window.__step = (e) => un(e)),
  (window.__loop = (e) => {
    Ts = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = L.domElement,
      s = document.createElement("canvas");
    return (
      (s.width = e),
      (s.height = Math.round((e * o.height) / o.width)),
      s.getContext("2d").drawImage(o, 0, 0, s.width, s.height),
      s.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    un(o ?? performance.now());
    const s = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + pn + "/_shots/" + e + ".webp",
        { method: "POST", body: s },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (nt(!1), (on = e), e && yt({ fit: null, ...e }));
    },
    view: (e) => {
      (nt(!1), (Qe = e), yt(Ve[e]));
    },
    cut: (e) => {
      (nt(!0), us(e, Je));
    },
    turn: (e) => {
      ((m.turnT = m.turnV = e), (m.turn = Math.round(e)));
      for (let t = 0; t < Re; t++) je[t] = mo(O[t], W[m.h], e);
      ke(!0);
    },
    harness: (e) => {
      m.h = e;
      for (let t = 0; t < Re; t++) je[t] = mo(O[t], W[e], m.turnV);
      ke(!0);
    },
    select: (e, t) => {
      const o = (s) =>
        s == null
          ? null
          : O.find((n) => n.m.name === s || n.m.id === s) || null;
      Gt(o(e), o(t));
    },
    tags: (e) => {
      Ze = !!e;
    },
    tune: (e) => (Object.assign(g, e), ye(), { ...g }),
    ST: m,
    HERO: Ve,
    SHOTS: tn,
    TOWERS: O,
    DATA: P,
  }),
  (window.__x = {
    dof: fe,
    gtao: G,
    bloom: Ee,
    renderer: L,
    camera: C,
    scene: N,
    composer: le,
    cam: A,
    RT: g,
    overlay: to,
    rays: _t,
    REFL: mt,
  }),
  (window.__dbg = () => ({
    t: +Je.toFixed(2),
    shot: wo,
    cine: Mt,
    turn: +m.turnV.toFixed(2),
    h: W[m.h],
    sel: m.sel?.m.name || null,
    fit: +Yo.toFixed(3),
    focus: +fe.u.focus.value.toFixed(2),
    range: +fe.u.range.value.toFixed(2),
    calls: L.info.render.calls,
    tris: L.info.render.triangles,
  })));
