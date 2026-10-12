import * as r from "three";
import { EffectComposer as Un } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as Zt,
  FullScreenQuad as Mt,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as Uo } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Hn } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as $n } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as Wn } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as Kn } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as jn } from "three/addons/utils/BufferGeometryUtils.js";
const v = (e) => document.querySelector(e),
  Z = v("#world"),
  Jt = v("#app"),
  R = (e, t, o) => (e < t ? t : e > o ? o : e),
  as = (e, t, o) => e + (t - e) * o,
  Qt = (e, t, o) => {
    const n = R((o - e) / (t - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  ss = (e) => 1 - (1 - e) ** 3,
  rs = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function Te(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const is = Te(7),
  ls = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  qn = "https://x.com/ryansael",
  Ho = "long-session",
  L = new r.Scene();
((L.background = new r.Color("#10151f")),
  (L.fog = new r.FogExp2("#1a2130", 0.0065)));
const x = new r.PerspectiveCamera(30, 1, 0.3, 320);
let M;
try {
  M = new r.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (v("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const Xn = 25e5,
  Yn = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return R(Math.min(devicePixelRatio, 2, Math.sqrt(Xn / (e * t))), 1, 2);
  },
  St = Yn();
(M.setPixelRatio(St),
  (M.info.autoReset = !1),
  (M.shadowMap.enabled = !0),
  (M.shadowMap.type = r.PCFShadowMap),
  (M.shadowMap.autoUpdate = !1),
  (M.transmissionResolutionScale = 0.6),
  (M.toneMapping = r.ACESFilmicToneMapping),
  Z.appendChild(M.domElement));
const Ct = new r.HemisphereLight(9414360, 3813414, 0.5);
L.add(Ct);
const k = new r.DirectionalLight(16763279, 2.1);
((k.castShadow = !0),
  k.shadow.mapSize.set(2048, 2048),
  Object.assign(k.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (k.shadow.normalBias = 0.03),
  (k.shadow.bias = -4e-4),
  (k.shadow.radius = 2),
  L.add(k, k.target));
const Zn = new r.Vector3(0.62, 0.62, 0.48).normalize();
(k.position.copy(Zn).multiplyScalar(30), k.target.position.set(0, 2, 0));
const at = new r.DirectionalLight(9427199, 0.9);
(at.position.set(-6, 9, -14), L.add(at));
const Tt = new r.DirectionalLight(16773600, 0.55);
(Tt.position.set(-8, 12, 10), L.add(Tt));
const eo = new r.Group();
L.add(eo);
const se = 10,
  Ge = {
    pos: {
      value: Array.from({ length: se }, () => new r.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: se }, () => new r.Vector3()) },
  },
  Jn = `uniform vec4 uFakePos[${se}];uniform vec3 uFakeCol[${se}];uniform float uSat;`,
  Qn = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${se};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  ea = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  $o = { value: 1.16 };
function re(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: Ge.pos,
        uFakeCol: Ge.col,
        uSat: $o,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + Jn,
          )
          .replace("#include <lights_fragment_end>", Qn)
          .replace("#include <opaque_fragment>", ea)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => Ho + (t ? t.key : "")),
    e
  );
}
const Wo = [];
function Re(e, t, o, n, a, s) {
  const i = { p: new r.Vector3(e, t, o), c: new r.Color(n), r: a, i: s, i0: s };
  return (Wo.push(i), i);
}
const Rt = new r.Vector3(),
  B = [],
  Ie = new r.Vector3(0, 3, 0);
function ta(e) {
  B.length = 0;
  for (const t of Wo)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        B.length < se)
      )
        (B.push(t), B.length === se && B.sort((o, n) => o.score - n.score));
      else if (t.score > B[0].score) {
        B[0] = t;
        for (let o = 0; o < se - 1 && B[o].score > B[o + 1].score; o++) {
          const n = B[o];
          ((B[o] = B[o + 1]), (B[o + 1] = n));
        }
      }
    }
}
function Ko(e, t) {
  ta(t);
  for (let o = 0; o < se; o++) {
    const n = B[o];
    if (!n) {
      (Ge.col.value[o].set(0, 0, 0), Ge.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (Rt.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      Ge.pos.value[o].set(Rt.x, Rt.y, Rt.z, 1 / (n.r * n.r)),
      Ge.col.value[o].set(n.c.r * n.i, n.c.g * n.i, n.c.b * n.i));
  }
}
const to = {};
{
  const e = new r.PMREMGenerator(M),
    t = new r.Scene();
  t.add(
    new r.Mesh(
      new r.SphereGeometry(50, 48, 24),
      new r.ShaderMaterial({
        side: r.BackSide,
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
  const o = (n, a, s, i, l, c) => {
    const u = new r.Mesh(
      new r.BoxGeometry(n, a, 0.4),
      new r.MeshBasicMaterial({ color: new r.Color(...s) }),
    );
    (u.position.set(i, l, c), u.lookAt(0, 0, 0), t.add(u));
  };
  (o(14, 2.2, [3.2, 2.6, 2.1], -6, 18, 22),
    o(10, 2, [1.6, 2.4, 3.4], 18, 14, -10),
    o(30, 1, [3.6, 2.2, 1.1], 0, -4, -30),
    o(8, 3, [2.4, 1.7, 1.1], -28, 6, 4),
    (to.show = e.fromScene(t, 0.03).texture),
    e.dispose());
}
((L.environment = to.show), (L.environmentIntensity = 0.55));
const jo = 0,
  oo = new r.WebGLRenderTarget(1, 1, {
    type: r.HalfFloatType,
    generateMipmaps: !0,
    minFilter: r.LinearMipmapLinearFilter,
  }),
  kt = {
    tReflect: { value: oo.texture },
    uReflMatrix: { value: new r.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  oa = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, kt),
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
  z = new r.PerspectiveCamera(),
  At = new r.Vector3(0, 1, 0),
  st = new r.Vector3(0, jo, 0),
  no = new r.Vector3(),
  Lt = new r.Vector3(),
  ao = new r.Matrix4(),
  rt = new r.Plane(),
  ie = new r.Vector4(),
  qo = new r.Vector4(),
  ze = [];
function na() {
  if (
    !p.reflect ||
    kt.uReflStrength.value <= 0 ||
    x.position.y <= jo ||
    !k.shadow.map
  )
    return;
  (no.setFromMatrixPosition(x.matrixWorld),
    ao.extractRotation(x.matrixWorld),
    z.position.subVectors(st, no).reflect(At).negate().add(st),
    Lt.set(0, 0, -1).applyMatrix4(ao).add(no),
    Lt.subVectors(st, Lt).reflect(At).negate().add(st),
    z.up.set(0, 1, 0).applyMatrix4(ao).reflect(At),
    z.lookAt(Lt),
    (z.far = x.far),
    z.updateMatrixWorld(),
    z.projectionMatrix.copy(x.projectionMatrix),
    kt.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(z.projectionMatrix)
      .multiply(z.matrixWorldInverse),
    rt.setFromNormalAndCoplanarPoint(At, st).applyMatrix4(z.matrixWorldInverse),
    ie.set(rt.normal.x, rt.normal.y, rt.normal.z, rt.constant));
  const e = z.projectionMatrix.elements;
  (qo.set(
    (Math.sign(ie.x) + e[8]) / e[0],
    (Math.sign(ie.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    ie.multiplyScalar(2 / ie.dot(qo)),
    (e[2] = ie.x),
    (e[6] = ie.y),
    (e[10] = ie.z + 1),
    (e[14] = ie.w));
  const t = ze.map((n) => n.visible),
    o = M.shadowMap.needsUpdate;
  (ze.forEach((n) => (n.visible = !1)),
    Xo.forEach((n) => (n.visible = !0)),
    (M.shadowMap.needsUpdate = !1),
    Ko(z, Ie),
    M.setRenderTarget(oo),
    M.clear(),
    M.render(L, z),
    M.setRenderTarget(null),
    ze.forEach((n, a) => (n.visible = t[a])),
    Xo.forEach((n) => (n.visible = !1)),
    (M.shadowMap.needsUpdate = o));
}
const Xo = [],
  aa =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  Pt = (e, t) =>
    new r.ShaderMaterial({
      uniforms: t,
      vertexShader: aa,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class sa extends Zt {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new r.WebGLRenderTarget(1, 1, {
        type: r.HalfFloatType,
        samples: t,
        depthTexture: new r.DepthTexture(1, 1),
      })),
      (this.quad = new Mt(
        Pt(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, n) {
    (Ko(x, Ie),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(L, x),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const Yo = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class ra extends Zt {
  constructor() {
    super();
    const t = { type: r.HalfFloatType };
    ((this.half = new r.WebGLRenderTarget(1, 1, t)),
      (this.blurRT = new r.WebGLRenderTarget(1, 1, t)),
      (this.u = {
        tColor: { value: null },
        tDepth: { value: null },
        tHalf: { value: this.half.texture },
        tBlur: { value: this.blurRT.texture },
        near: { value: x.near },
        far: { value: x.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new r.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new r.Vector2() },
        fullTexel: { value: new r.Vector2() },
      }),
      (this.pre = new Mt(
        Pt(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Yo}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Mt(
        Pt(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=1.05/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Mt(
        Pt(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${Yo}
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
const p = {
    auto: 1,
    pixelRatio: St,
    msaa: St >= 1.5 ? 2 : 4,
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
  so = { ...p },
  N = new Un(
    M,
    new r.WebGLRenderTarget(1, 1, { type: r.HalfFloatType, depthBuffer: !1 }),
  );
N.setPixelRatio(St);
const it = new sa(p.msaa);
N.addPass(it);
const A = new Uo(L, x, 1, 1);
((A.output = Uo.OUTPUT.Off),
  (A.needsSwap = !1),
  A.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
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
const ia = A.setSize.bind(A),
  la = A.render.bind(A);
A.setSize = (e, t) => ia(Math.ceil(e / 2), Math.ceil(t / 2));
const ke = [],
  Zo = [];
((A.render = (e, t, o) => {
  (ke.forEach((n, a) => {
    ((Zo[a] = n.visible), (n.visible = !1));
  }),
    la(e, t, o),
    ke.forEach((n, a) => (n.visible = Zo[a])),
    (A.blendMaterial.uniforms.intensity.value = p.ao ? p.aoIntensity : 0),
    (A.blendMaterial.uniforms.tDiffuse.value = A.pdRenderTarget.texture),
    A._renderPass(e, A.blendMaterial, o));
}),
  N.addPass(A));
const le = new Hn(new r.Vector2(256, 256), 0.42, 0.55, 1.05),
  ca = le.setSize.bind(le);
((le.setSize = (e, t) => ca(Math.ceil(e / 2), Math.ceil(t / 2))),
  N.addPass(le));
const U = new ra();
((U.u.tDepth.value = it.rt.depthTexture), N.addPass(U));
const lt = new r.Scene(),
  ro = {
    tSceneDepth: { value: A.depthTexture },
    uRes: { value: new r.Vector2(1, 1) },
    uNF: { value: new r.Vector2(x.near, x.far) },
  };
class fa extends Zt {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, n) {
    const a = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(n),
      t.render(lt, x),
      (t.autoClear = a));
  }
}
(N.addPass(new fa()), N.addPass(new $n()));
const Jo = new Wn();
N.addPass(Jo);
const Qo = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  en = (e, t, o, n = 0.06, a = 2) =>
    new Kn(e, t, o, a, Math.min(n, Math.min(e, t, o) / 2.02)),
  ce = new Map();
function C(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    ce.has(o) ||
      ce.set(
        o,
        re(
          new r.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    ce.get(o)
  );
}
function cs(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    ce.has(o) ||
      ce.set(
        o,
        re(
          new r.MeshPhysicalMaterial({
            color: e,
            roughness: 0.34,
            clearcoat: 1,
            clearcoatRoughness: 0.16,
            envMapIntensity: 1.1,
            ...t,
          }),
        ),
      ),
    ce.get(o)
  );
}
function W(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    ce.has(o) ||
      ce.set(
        o,
        re(
          new r.MeshPhysicalMaterial({
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
    ce.get(o)
  );
}
const io = (e, t = 1) =>
    new r.MeshBasicMaterial({
      color: new r.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  fs = (e = {}) =>
    new r.MeshPhysicalMaterial({
      color: "#e6fbff",
      roughness: 0.05,
      metalness: 0,
      transmission: 0.95,
      thickness: 0.12,
      ior: 1.45,
      envMapIntensity: 1.3,
      ...e,
    }),
  us = W("#434a55", { roughness: 0.36 }),
  ds = W("#23272e", { roughness: 0.42, metalness: 0.7 }),
  hs = W("#15171b", { roughness: 0.46, metalness: 0.55 }),
  ps = W("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  ms = W("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  gs = C("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  vs = W("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  xs = W("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  ua = new r.Matrix4(),
  Dt = new r.Quaternion(),
  tn = new r.Euler(0, 0, 0, "YXZ"),
  on = new r.Vector3(1, 1, 1),
  ys = new r.Color(),
  ws = new r.Vector3(1, 0, 0),
  nn = new r.Vector3(0, 1, 0),
  bs = new r.Vector3(0, 0, 1),
  da = new r.Vector3(),
  ha = new r.Quaternion();
function ye() {
  const e = new Map(),
    t = (o, n, a, s, i, l) => {
      n = n.index ? n.toNonIndexed() : n;
      for (const u of Object.keys(n.attributes))
        ["position", "normal", "uv"].includes(u) || n.deleteAttribute(u);
      (n.attributes.uv ||
        n.setAttribute(
          "uv",
          new r.Float32BufferAttribute(
            new Float32Array(n.attributes.position.count * 2),
            2,
          ),
        ),
        l.dir
          ? (Dt.setFromUnitVectors(
              nn,
              da.set(l.dir[0], l.dir[1], l.dir[2]).normalize(),
            ),
            l.roll && Dt.multiply(ha.setFromAxisAngle(nn, l.roll)))
          : (tn.set(l.rx || 0, l.ry || 0, l.rz || 0), Dt.setFromEuler(tn)),
        n.applyMatrix4(
          ua.compose(
            { x: a, y: s, z: i },
            Dt,
            l.s ? on.set(l.s[0], l.s[1], l.s[2]) : on.set(1, 1, 1),
          ),
        ));
      let c = e.get(o);
      (c || e.set(o, (c = { mat: o, list: [] })), c.list.push(n));
    };
  return {
    box(o, n, a, s, i, l, c, u = {}) {
      return (
        t(o, u.r ? en(i, l, c, u.r) : new r.BoxGeometry(i, l, c), n, a, s, u),
        this
      );
    },
    cyl(o, n, a, s, i, l, c, u = {}) {
      return (
        t(o, new r.CylinderGeometry(i, l, c, u.seg || 20), n, a, s, u),
        this
      );
    },
    cone(o, n, a, s, i, l, c = {}) {
      return (
        t(
          o,
          new r.ConeGeometry(i, l, c.seg || 6).translate(0, l / 2, 0),
          n,
          a,
          s,
          c,
        ),
        this
      );
    },
    sph(o, n, a, s, i, l = {}) {
      return (
        t(o, new r.SphereGeometry(i, l.seg || 14, l.seg2 || 10), n, a, s, l),
        this
      );
    },
    tor(o, n, a, s, i, l, c = {}) {
      return (
        t(o, new r.TorusGeometry(i, l, c.seg2 || 8, c.seg || 40), n, a, s, c),
        this
      );
    },
    geo(o, n, a = 0, s = 0, i = 0, l = {}) {
      return (t(o, n.clone(), a, s, i, l), this);
    },
    flush(o, n = !0) {
      const a = [];
      for (const { mat: s, list: i } of e.values()) {
        const l = new r.Mesh(jn(i), s);
        ((l.castShadow = n),
          (l.receiveShadow = !0),
          o.add(l),
          a.push(l),
          i.forEach((c) => c.dispose()));
      }
      return (e.clear(), a);
    },
  };
}
const _t = [];
document.fonts?.ready.then(() => _t.forEach((e) => e()));
function lo(e, t, o, n, a, s = 0.9, i = {}) {
  const l = document.createElement("canvas");
  ((l.width = o), (l.height = n));
  const c = l.getContext("2d"),
    u = new r.CanvasTexture(l);
  ((u.anisotropy = 8), (u.colorSpace = r.SRGBColorSpace));
  const f = new r.Mesh(
    new r.PlaneGeometry(e, t),
    new r.MeshBasicMaterial({
      map: u,
      alphaTest: 0.3,
      fog: !1,
      side: r.DoubleSide,
      color: new r.Color(s, s, s),
      ...i,
    }),
  );
  return (
    (f.userData = {
      c: l,
      g: c,
      t: u,
      redraw(d) {
        (c.clearRect(0, 0, o, n), d(c, o, n), (u.needsUpdate = !0));
      },
    }),
    a && (f.userData.redraw(a), _t.push(() => f.userData.redraw(a))),
    f
  );
}
const an = (e, t, o, n, a, s) => {
    (e.beginPath(), e.roundRect(t, o, n, a, s));
  },
  ct = (e, t, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), o(a.getContext("2d"), e, t));
    const s = new r.CanvasTexture(a);
    return (n && (s.colorSpace = r.SRGBColorSpace), (s.anisotropy = 8), s);
  },
  sn = ct(
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
  pa = (e, t, o = sn) =>
    new r.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function ma(e, t = 0.3, o = 1, n = 0) {
  const a = new r.IcosahedronGeometry(e, n),
    s = a.attributes.position,
    i = Te(o),
    l = new Map();
  for (let c = 0; c < s.count; c++) {
    const u =
      s.getX(c).toFixed(3) +
      "," +
      s.getY(c).toFixed(3) +
      "," +
      s.getZ(c).toFixed(3);
    l.has(u) ||
      l.set(u, [1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t]);
    const f = l.get(u);
    s.setXYZ(c, s.getX(c) * f[0], s.getY(c) * f[1], s.getZ(c) * f[2]);
  }
  return (a.computeVertexNormals(), a);
}
function ga(e, t, o, n, a, s = 0, i = {}) {
  const l = new r.Group(),
    c = ye(),
    u = Te(Math.floor(t * 31 + n * 17 + 99));
  c.cyl(C("#5a3f2c"), 0, 0.5 * a, 0, 0.07 * a, 0.1 * a, 1 * a, { seg: 6 });
  const f = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((d) =>
    new r.Color(d).offsetHSL(s, 0, 0).getStyle(),
  );
  for (let d = 0; d < (i.n || 5); d++)
    c.geo(
      C(f[d % 4], { flatShading: !0, roughness: 0.8 }),
      ma(0.42 * a * (0.75 + u() * 0.5), 0.3, d + t * 7 + n * 3),
      (u() - 0.5) * 0.6 * a,
      (1.15 + u() * 0.7) * a,
      (u() - 0.5) * 0.6 * a,
    );
  return (c.flush(l), l.position.set(t, o, n), e.add(l), l);
}
const va = ct(
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
function Ms(e, t, o, n, a, s, i = 0.5) {
  const l = new r.Mesh(
    new r.PlaneGeometry(a, s),
    new r.MeshBasicMaterial({
      map: va,
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
    ke.push(l),
    l
  );
}
class xa {
  constructor(t) {
    this.max = t;
    const o = new r.BufferGeometry();
    ((this.pos = new Float32Array(t * 12)),
      (this.side = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 16)));
    const n = new Uint32Array(t * 6);
    for (let a = 0; a < t; a++) {
      const s = a * 4;
      n.set([s, s + 1, s + 2, s + 1, s + 3, s + 2], a * 6);
    }
    (o.setAttribute(
      "position",
      new r.BufferAttribute(this.pos, 3).setUsage(r.DynamicDrawUsage),
    ),
      o.setAttribute(
        "aSide",
        new r.BufferAttribute(this.side, 1).setUsage(r.DynamicDrawUsage),
      ),
      o.setAttribute(
        "aCol",
        new r.BufferAttribute(this.col, 4).setUsage(r.DynamicDrawUsage),
      ),
      o.setIndex(new r.BufferAttribute(n, 1)),
      (this.mesh = new r.Mesh(
        o,
        new r.ShaderMaterial({
          uniforms: {
            ...ro,
            uSoft: { value: 0.35 },
            uLight: { value: 0 },
            uLightK: { value: 0.62 },
          },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: r.AdditiveBlending,
          side: r.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${Qo}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      lt.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? r.NormalBlending : r.AdditiveBlending));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, n, a, s, i, l) {
    if (this.n >= this.max) return;
    const c = this.n++;
    (rn.subVectors(o, t),
      ln.addVectors(t, o).multiplyScalar(0.5),
      cn.subVectors(x.position, ln),
      O.crossVectors(rn, cn).normalize());
    const u = this.pos,
      f = c * 12;
    ((u[f] = t.x - O.x * n),
      (u[f + 1] = t.y - O.y * n),
      (u[f + 2] = t.z - O.z * n),
      (u[f + 3] = t.x + O.x * n),
      (u[f + 4] = t.y + O.y * n),
      (u[f + 5] = t.z + O.z * n),
      (u[f + 6] = o.x - O.x * a),
      (u[f + 7] = o.y - O.y * a),
      (u[f + 8] = o.z - O.z * a),
      (u[f + 9] = o.x + O.x * a),
      (u[f + 10] = o.y + O.y * a),
      (u[f + 11] = o.z + O.z * a),
      this.side.set([-1, 1, -1, 1], c * 4));
    const d = this.col,
      m = c * 16;
    for (let g = 0; g < 4; g++)
      ((d[m + g * 4] = s.r),
        (d[m + g * 4 + 1] = s.g),
        (d[m + g * 4 + 2] = s.b),
        (d[m + g * 4 + 3] = g < 2 ? i : l));
  }
  line(t, o, n, a) {
    for (let s = 0; s < t.length - 1; s++) {
      const i = s / (t.length - 1),
        l = (s + 1) / (t.length - 1);
      this.seg(
        t[s],
        t[s + 1],
        co(t[s], o),
        co(t[s + 1], o),
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
      const s = t.attributes[n];
      (s.clearUpdateRanges(), s.addUpdateRange(0, o * a), (s.needsUpdate = !0));
    }
  }
}
const rn = new r.Vector3(),
  ln = new r.Vector3(),
  cn = new r.Vector3(),
  O = new r.Vector3(),
  ft = new xa(6e3),
  co = (e, t) =>
    ((x.position.distanceTo(e) *
      Math.tan(r.MathUtils.degToRad(x.fov / 2)) *
      2) /
      Math.max(Z.clientHeight, 1)) *
    t *
    0.5,
  D = JSON.parse(
    document.getElementById("long-session-data").textContent || "{}",
  ),
  fo = (e) =>
    String(e).replace(/[&<>"']/g, (t) => "&#" + t.charCodeAt(0) + ";"),
  K = (e) =>
    e == null
      ? "\u2013"
      : e >= 100
        ? "$" + e.toFixed(0)
        : e >= 0.01
          ? "$" + e.toFixed(2)
          : e >= 0.001
            ? "$" + e.toFixed(3)
            : "$" + e.toFixed(4),
  ut = (e) =>
    new Date(e + "T12:00:00Z").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
  fn = ["claude-code", "codex", "hermes-agent", "kilo-code"],
  J = [
    ...fn.filter((e) => D.cost?.[e]),
    ...Object.keys(D.cost || {}).filter((e) => !fn.includes(e)),
  ],
  uo = (e) => (D.harness && D.harness[e]) || e,
  un = D.models || {},
  Ne = (e) => un[e]?.name || e,
  ya = [1, Math.sqrt(18), Math.sqrt(490), 50],
  b = 50;
function wa(e) {
  const t = [Math.log(e[0])];
  for (let i = 1; i < 4; i++) t.push(Math.max(Math.log(e[i]), t[i - 1] + 1e-4));
  const o = ya.map(Math.log),
    n = [0, 1, 2].map((i) => o[i + 1] - o[i]),
    a = [0, 1, 2].map((i) => (t[i + 1] - t[i]) / n[i]),
    s = [a[0], 0, 0, a[2]];
  for (let i = 1; i < 3; i++)
    s[i] =
      a[i - 1] * a[i] <= 0
        ? 0
        : (3 * (n[i - 1] + n[i])) /
          ((2 * n[i] + n[i - 1]) / a[i - 1] + (n[i] + 2 * n[i - 1]) / a[i]);
  return (i) => {
    if (i <= 0) return 0;
    const l = Math.log(R(i, 1, b));
    let c = 0;
    for (; c < 2 && l > o[c + 1];) c++;
    const u = (l - o[c]) / n[c],
      f = u * u,
      d = f * u;
    return Math.exp(
      (2 * d - 3 * f + 1) * t[c] +
        (d - 2 * f + u) * n[c] * s[c] +
        (-2 * d + 3 * f) * t[c + 1] +
        (d - f) * n[c] * s[c + 1],
    );
  };
}
function ba(e) {
  const t = Object.entries(D.cost[e] || {})
    .map(([l, c]) => ({ id: l, c, m: un[l] }))
    .filter((l) => l.m && l.c.every((c) => c > 0));
  if (!t.length) return [];
  const o = t.filter((l) => l.m.t >= (D.total7 || 1) * 0.01),
    n = (l, c) => l.c[3] - c.c[3],
    a = [],
    s = (l) => {
      l && !a.includes(l) && a.push(l);
    };
  (s([...(o.length ? o : t)].sort(n)[0]),
    s([...t].sort(n).at(-1)),
    s([...t].sort((l, c) => c.m.t - l.m.t)[0]));
  const i = a[1].c[3];
  s(
    t
      .filter((l) => !a.includes(l) && l.c[3] >= i * 0.15 && l.c[3] <= i * 0.7)
      .sort((l, c) => c.m.t - l.m.t)[0],
  );
  for (const l of [...t].sort(n)) a.length < 4 && s(l);
  return a
    .sort(n)
    .slice(0, 4)
    .map((l) => ({ ...l, C: wa(l.c) }));
}
const ho = Object.fromEntries(J.map((e) => [e, ba(e)])),
  T = 0.55,
  we = 2.05,
  Ue = 0.42,
  He = 0.385,
  $e = 1.22,
  fe = (-(b - 1) * Ue) / 2,
  Q = (e) => fe + (e - 1) * Ue,
  Ma = 6.1,
  Sa = 0.07,
  Ae = fe - 3.1,
  dt = Q(b) + 0.75,
  _ = new r.Group();
eo.add(_);
const po = (e, t, o = 3, n = 1024, a = 512) =>
    ct(n, a, (s, i, l) => {
      ((s.fillStyle = e), s.fillRect(0, 0, i, l));
      const c = Te(o);
      for (let u = 0; u < 260; u++) {
        const f = c() * l,
          d = 0.03 + c() * 0.07;
        ((s.strokeStyle = `rgba(${t},${d})`),
          (s.lineWidth = 0.6 + c() * 2.4),
          s.beginPath(),
          s.moveTo(0, f));
        for (let m = 0; m <= i; m += 32)
          s.lineTo(
            m,
            f +
              Math.sin(m * 0.004 + u) * 6 * c() +
              Math.sin(m * 0.02 + u * 3) * 1.5,
          );
        s.stroke();
      }
      for (let u = 0; u < 14; u++) {
        const f = c() * i,
          d = c() * l,
          m = s.createRadialGradient(f, d, 0, f, d, 30 + c() * 50);
        (m.addColorStop(0, `rgba(${t},.12)`),
          m.addColorStop(1, `rgba(${t},0)`),
          (s.fillStyle = m),
          s.fillRect(f - 90, d - 90, 180, 180));
      }
    }),
  Ca = W("#c9a15a", { roughness: 0.3, metalness: 1, clearcoat: 0.4 }),
  ht = po("#2a1d15", "10,6,3", 5);
((ht.wrapS = ht.wrapT = r.RepeatWrapping), ht.repeat.set(3, 2));
const V = -8.4,
  mo = 8.3,
  We = -13.5;
{
  const e = re(
      new r.MeshPhysicalMaterial({
        map: ht,
        color: "#8a6c56",
        roughness: 0.3,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        metalness: 0,
        envMapIntensity: 0.16,
      }),
      oa,
    ),
    t = new r.Mesh(en(40, 0.6, mo + 9.5, 0.08, 3), e);
  (t.position.set(-2, -0.3, (mo - 9.5) / 2),
    (t.receiveShadow = !0),
    _.add(t),
    ze.push(t));
  const o = re(
      new r.MeshPhysicalMaterial({
        map: ht,
        color: "#c49e80",
        roughness: 0.48,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.35,
      }),
    ),
    n = ye(),
    a = mo - 1.1,
    s = -V - 0.6 - 0.35;
  n.box(o, -2, -0.6 - s / 2, (a - 8.6) / 2, 37.4, s, a + 8.6);
  for (let l = -20.7 + 37.4 / 6; l < 16.6; l += 37.4 / 6)
    n.box(
      C("#0a0706", { roughness: 0.6 }),
      l,
      -0.6 - s / 2,
      a + 0.005,
      0.06,
      s - 0.4,
      0.02,
    );
  (n.box(Ca, -2, V + 0.18, a + 0.02, 37.4, 0.36, 0.04), n.flush(_));
  const i = new r.Mesh(new r.BoxGeometry(37.2, 0.05, 0.05), io("#ffb26a", 2.2));
  (i.position.set(-2, -0.66, a + 0.25), _.add(i));
  for (const l of [-15, -2, 11]) Re(l, -3.2, a + 3.4, "#ffb070", 8, 0.75);
}
{
  const e = po("#20160f", "6,3,1", 17, 1024, 1024);
  ((e.wrapS = e.wrapT = r.RepeatWrapping), e.repeat.set(10, 10));
  const t = re(
      new r.MeshPhysicalMaterial({
        map: e,
        color: "#9a8070",
        roughness: 0.38,
        clearcoat: 0.5,
        clearcoatRoughness: 0.16,
        envMapIntensity: 0.18,
      }),
    ),
    o = new r.Mesh(new r.PlaneGeometry(240, 80), t);
  ((o.rotation.x = -Math.PI / 2),
    o.position.set(0, V, We + 40),
    (o.receiveShadow = !0),
    _.add(o),
    ze.push(o));
  const n = new r.Mesh(
    new r.PlaneGeometry(52, 30),
    C("#2a2523", { roughness: 0.95, envMapIntensity: 0.1 }),
  );
  ((n.rotation.x = -Math.PI / 2),
    n.position.set(-2, V + 0.02, 4),
    _.add(n),
    ze.push(n),
    Re(-12, V + 3, 16, "#ffb878", 16, 0.5),
    Re(10, V + 3, 18, "#ffc890", 14, 0.35));
}
{
  const e = ye(),
    t = W("#1b1a1c", { roughness: 0.45, metalness: 0.6 });
  for (let n = -42; n <= 42; n += 5.6) e.box(t, n, 8, We, 0.24, 40, 0.3);
  (e
    .box(t, 0, 0.55, We + 0.1, 90, 0.3, 0.5)
    .box(t, 0, 21, We, 90, 0.5, 0.4)
    .box(
      C("#0d0f14", { roughness: 0.6 }),
      0,
      (V + 0.5) / 2,
      We + 0.4,
      90,
      0.5 - V,
      0.3,
    ),
    e.flush(_, !1));
  const o = new r.Mesh(new r.BoxGeometry(90, 0.03, 0.03), io("#ffb36a", 1.2));
  (o.position.set(0, 0.78, We + 0.42), _.add(o));
}
function Ta(e = {}) {
  return ct(4096, 1024, (t, o, n) => {
    const a = Te(e.seed || 11),
      s = n * (e.horizon || 0.7),
      i = t.createLinearGradient(0, 0, 0, s);
    (i.addColorStop(0, "#08112c"),
      i.addColorStop(0.32, "#152a5c"),
      i.addColorStop(0.58, "#33478a"),
      i.addColorStop(0.76, "#7a649e"),
      i.addColorStop(0.9, "#d88f98"),
      i.addColorStop(1, "#f5b188"),
      (t.fillStyle = i),
      t.fillRect(0, 0, o, s + 2));
    for (let f = 0; f < 30; f++) {
      const d = a() * o,
        m = s * (0.3 + a() * 0.5),
        g = 220 + a() * 640,
        y = t.createRadialGradient(d, m, 0, d, m, g);
      (y.addColorStop(
        0,
        `rgba(${a() > 0.5 ? "255,180,170" : "160,150,220"},.09)`,
      ),
        y.addColorStop(1, "rgba(0,0,0,0)"),
        (t.fillStyle = y),
        t.save(),
        t.scale(1, 0.22),
        t.fillRect(d - g, m / 0.22 - g, g * 2, g * 2),
        t.restore());
    }
    if (e.mountains) {
      ((t.fillStyle = "#3a3b67"), t.beginPath(), t.moveTo(0, s));
      for (let f = 0; f <= o; f += 24) {
        const d = f / o;
        t.lineTo(
          f,
          s -
            n *
              (0.07 +
                0.09 * Math.abs(Math.sin(d * 4.2 + 1)) +
                0.04 * Math.sin(d * 17 + 2)),
        );
      }
      (t.lineTo(o, s), t.fill());
    }
    const l = ["#ffd9a0", "#ffe9c8", "#ffc070", "#ffcf90", "#cfe6ff"],
      c = (f, d, m, g, y, S = 3, P = 3.5, oe = 6, ne = 7) => {
        if (((t.fillStyle = g), t.fillRect(f, s - m, d, m), !!y)) {
          for (let ae = s - m + 4; ae < s - 2; ae += ne)
            for (let Ve = f + 2; Ve < f + d - S; Ve += oe)
              a() < y &&
                ((t.fillStyle = l[Math.floor(a() * l.length)]),
                (t.globalAlpha = 0.5 + a() * 0.5),
                t.fillRect(Ve, ae, S, P));
          t.globalAlpha = 1;
        }
      };
    for (let f = 0; f < o;) {
      const d = 14 + a() * 40,
        m = n * (0.025 + a() * 0.08) * (e.low || 1);
      (c(f, d, m, "#56598c", 0.16, 2, 2.5, 5, 6), (f += d + a() * 5));
    }
    for (let f = 0; f < o;) {
      const d = Math.abs(Math.sin((f / o) * 7.3 + 0.4)),
        m = 24 + a() * 62,
        g = n * (0.05 + a() * 0.14 + d * d * 0.36 * a()) * (e.low || 1);
      (c(
        f,
        m,
        g,
        `hsl(${226 + a() * 16},${28 + a() * 14}%,${13 + a() * 8}%)`,
        0.42 + a() * 0.35,
      ),
        g > n * 0.22 &&
          a() < 0.6 &&
          ((t.fillStyle = "#ffe2b0"),
          (t.globalAlpha = 0.85),
          t.fillRect(f + 3, s - g + 2, m - 6, 3),
          (t.globalAlpha = 1)),
        g > n * 0.3 &&
          a() < 0.5 &&
          ((t.fillStyle = "#ff6a5a"),
          t.fillRect(f + m / 2 - 2, s - g - 9, 4, 4)),
        (f += m + a() * 8));
    }
    for (let f = 0; f < o;) {
      const d = 60 + a() * 110,
        m = n * (0.08 + a() * 0.2) * (e.low || 1);
      (a() < 0.55 &&
        c(
          f,
          d,
          m,
          `hsl(${224 + a() * 10},30%,${9 + a() * 5}%)`,
          0.5 + a() * 0.3,
          5,
          6,
          10,
          11,
        ),
        (f += d + 60 + a() * 260));
    }
    const u = t.createLinearGradient(0, s, 0, n);
    (u.addColorStop(0, "#3d3766"),
      u.addColorStop(0.25, "#1c1d3c"),
      u.addColorStop(1, "#090b17"),
      (t.fillStyle = u),
      t.fillRect(0, s, o, n - s));
    for (let f = 0; f < 1600; f++) {
      const d = a() * o,
        m = s + 3 + a() ** 1.5 * (n - s) * 0.75,
        g = 8 + a() * 60;
      ((t.fillStyle =
        [
          "rgba(255,200,140,",
          "rgba(255,232,200,",
          "rgba(170,210,255,",
          "rgba(255,170,110,",
        ][f % 4] +
        (0.1 + a() * 0.32) +
        ")"),
        t.fillRect(d, m, 1.5 + a() * 3, g * 0.3));
    }
  });
}
const Ra = Ta({ seed: 11 }),
  dn = -118;
{
  const e = new r.Mesh(
    new r.PlaneGeometry(320, 80),
    new r.MeshBasicMaterial({
      map: Ra,
      fog: !1,
      color: new r.Color(0.95, 0.95, 0.95),
    }),
  );
  (e.position.set(0, 12, dn), _.add(e));
}
const Ss = (() => {
  const t = new r.PlaneGeometry(1, 1),
    o = new r.MeshBasicMaterial({
      map: sn,
      transparent: !0,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
      vertexColors: !1,
    }),
    n = new r.InstancedMesh(t, o, 520),
    a = Te(77),
    s = new r.Matrix4(),
    i = new r.Color(),
    l = [
      [1, 0.72, 0.42],
      [1, 0.86, 0.66],
      [0.62, 0.8, 1],
      [1, 0.6, 0.35],
      [1, 0.95, 0.85],
    ];
  for (let c = 0; c < 520; c++) {
    const u = (a() - 0.5) * 300,
      f = Math.abs(Math.sin((u / 300 + 0.5) * 7.3 + 0.4)),
      d = c % 9 === 0,
      m = d ? -4.5 - a() * 5 : -3.4 + a() ** 1.8 * (11 + f * f * 20),
      g = (0.45 + a() * 1.1) * (d ? 0.8 : 1);
    (s.makeScale(g, g, g),
      s.setPosition(u, m, dn + 2 + a() * 6),
      n.setMatrixAt(c, s));
    const y = l[Math.floor(a() * l.length)],
      S = (1.6 + a() * 2.6) * (d ? 0.55 : 1);
    n.setColorAt(c, i.setRGB(y[0] * S, y[1] * S, y[2] * S));
  }
  return ((n.frustumCulled = !1), _.add(n), ke.push(n), n);
})();
{
  const e = ye(),
    t = C("#2b2018", { roughness: 0.6 });
  (e.box(C("#1a1716", { roughness: 0.7 }), -26, 8, -4, 0.4, 36, 40),
    e.box(t, -24.6, 2.6, -9, 2.4, 0.12, 5).box(t, -24.6, 5.2, -9, 2.4, 0.12, 5),
    e
      .box(C("#d8d0c4"), -24.6, 3, -10.2, 0.5, 0.7, 0.5)
      .box(C("#5a6b4a"), -24.6, 3.05, -8.2, 0.6, 0.8, 0.6)
      .box(C("#c8a070"), -24.6, 5.5, -9.6, 0.9, 0.5, 0.4),
    e
      .cyl(
        W("#8a6b3d", { roughness: 0.3 }),
        -19,
        (V + 1.35) / 2,
        -12,
        0.08,
        0.08,
        1.35 - V,
        { seg: 10 },
      )
      .cyl(C("#3a2e25"), -19, V + 0.12, -12, 0.7, 0.8, 0.25),
    e.flush(_));
  const o = new r.Mesh(
    new r.CylinderGeometry(0.75, 1.05, 1.1, 28, 1, !0),
    new r.MeshBasicMaterial({
      color: new r.Color(2.8, 1.7, 0.8),
      side: r.DoubleSide,
      fog: !1,
    }),
  );
  (o.position.set(-19, 1.9, -12), _.add(o));
  const n = new r.Mesh(new r.BoxGeometry(0.2, 2.2, 0.9), io("#ffbf7a", 3.2));
  (n.position.set(-25.7, 6.5, 2),
    _.add(n),
    Re(-19, 1.6, -11, "#ffb878", 9, 1.1),
    Re(-24, 6, 2, "#ffbf7a", 7, 0.8));
  const a = C("#cfc6b8", { roughness: 0.55 }),
    s = ye();
  (s.cyl(a, -24, V + 1.1, 8, 1.3, 1, 2.2, { seg: 18 }),
    s.flush(_),
    ga(_, -24, V + 2.2, 8, 6.2, 0, { n: 10 }));
}
const ue = new r.Group();
eo.add(ue);
const hn = po("#4a3122", "18,10,6", 8),
  ka = re(
    new r.MeshPhysicalMaterial({
      map: hn,
      color: "#c9a688",
      roughness: 0.34,
      clearcoat: 0.9,
      clearcoatRoughness: 0.14,
      envMapIntensity: 0.7,
    }),
  ),
  Le = W("#c9a15a", { roughness: 0.26, metalness: 1, clearcoat: 0.4 });
{
  const e = ye(),
    t = (Ae + dt) / 2,
    o = dt - Ae;
  (e.box(ka, t, T / 2, 0, o, T, we, { r: 0.04 }),
    e
      .box(Le, t, T + 0.004, we / 2 - 0.03, o - 0.08, 0.012, 0.022)
      .box(Le, t, T + 0.004, -we / 2 + 0.03, o - 0.08, 0.012, 0.022),
    e.box(
      C("#0b0c0f", { roughness: 0.5 }),
      t,
      T + 0.006,
      0,
      o - 0.3,
      0.004,
      we - 0.3,
    ),
    e.flush(ue));
}
const Cs = (() => {
    const e = dt - Ae,
      t = 4096,
      o = Math.round((4096 * (T * 0.62)) / e),
      n = lo(
        e,
        T * 0.62,
        t,
        o,
        (a, s, i) => {
          ((a.font = `600 ${Math.round(i * 0.52)}px Outfit, sans-serif`),
            (a.textAlign = "center"),
            (a.textBaseline = "middle"));
          for (const l of [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]) {
            const c = ((Q(l) - Ae) / e) * s;
            ((a.fillStyle = "#050403"),
              a.fillText(String(l), c + 2, i * 0.56 + 2));
            const u = a.createLinearGradient(0, i * 0.25, 0, i * 0.8);
            (u.addColorStop(0, "#f2dba6"),
              u.addColorStop(1, "#b88f52"),
              (a.fillStyle = u),
              a.fillText(String(l), c, i * 0.56));
          }
        },
        0.85,
        { alphaTest: 0.25 },
      );
    return (
      n.position.set((Ae + dt) / 2, T * 0.46, we / 2 + 0.004),
      ue.add(n),
      n
    );
  })(),
  go = new Float32Array(b * 2),
  be = new Float32Array(b),
  pn = { value: b - 1 },
  Aa = { value: 1 },
  La = re(
    new r.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.08,
      metalness: 0,
      transparent: !0,
      envMapIntensity: 0.8,
      depthWrite: !1,
    }),
    Object.assign(
      (e) => {
        (Object.assign(e.uniforms, { uNew: pn, uGlow: Aa }),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
attribute vec2 aBand;attribute float aRise;varying vec2 vBand;varying float vRise;varying vec3 vLP;varying vec3 vLN;varying float vHgt;varying float vIdx;`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
vBand=aBand;vRise=aRise;vLP=position;vLN=normal;vHgt=length(instanceMatrix[1].xyz);vIdx=float(gl_InstanceID);`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec2 vBand;varying float vRise;varying vec3 vLP;varying vec3 vLN;varying float vHgt;varying float vIdx;uniform float uNew;uniform float uGlow;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
  {float f=vLP.y;vec3 an=abs(vLN);bool top=vLN.y>.5;
   vec3 cBase=mix(vec3(.22,.82,1.3),vec3(.42,1.12,.62),smoothstep(0.,max(vBand.x,1e-3),f));   // the first turn: cyan below (the system prompt) to green (the files read)
   vec3 cHist=vec3(.9,.95,1.06),cTop=vec3(1.4,.78,.28);
   vec3 band=f>vBand.y?cTop:f<vBand.x?cBase:cHist;if(top)band=cTop*1.15;
   float gk=f>vBand.y?1.35:f<vBand.x?.8:.12;if(top)gk=1.5;
   // sheets of glass, one every few millimetres of height, and the bright edges of the stack
   float sh=f*vHgt/.1,line=smoothstep(.6,1.,abs(fract(sh)-.5)*2.)*(1.-smoothstep(.2,.5,fwidth(sh)));
   float ex=an.x>.5?abs(vLP.z):abs(vLP.x),edge=an.y>.5?0.:smoothstep(.43,.5,ex);
   float isNew=1.-step(.5,abs(vIdx-uNew)),fres=pow(1.-abs(dot(normalize(vViewPosition),normal)),3.);
   float inH=step(vBand.x,f)*step(f,vBand.y);float a=clamp(.22-inH*.08+fres*.35+edge*.45+line*(.3-inH*.1),0.,1.)*vRise;
   diffuseColor.rgb=mix(vec3(.02,.025,.03),band*.35,.4);diffuseColor.a=a;roughnessFactor=.06;
   totalEmissiveRadiance+=band*(gk*(.55+.35*isNew)*(1.-line*.7)+edge*.5)*uGlow*vRise/max(a,.12)*.4;}`,
            )));
      },
      { key: "stack" },
    ),
  ),
  G = new r.InstancedMesh(
    new r.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
    La,
    b,
  );
(G.geometry.setAttribute("aBand", new r.InstancedBufferAttribute(go, 2)),
  G.geometry.setAttribute("aRise", new r.InstancedBufferAttribute(be, 1)),
  (G.frustumCulled = !1),
  (G.renderOrder = 2),
  ue.add(G),
  ke.push(G));
const pt = new r.InstancedMesh(
  G.geometry,
  new r.MeshBasicMaterial({ colorWrite: !1, transparent: !0, opacity: 1 }),
  b,
);
((pt.instanceMatrix = G.instanceMatrix),
  (pt.frustumCulled = !1),
  (pt.renderOrder = 3),
  ue.add(pt),
  ke.push(pt));
const Ke = new r.InstancedMesh(
  new r.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
  pa(new r.Color(1.6, 0.8, 0.3), 0.55),
  b,
);
((Ke.frustumCulled = !1), (Ke.renderOrder = 2), ue.add(Ke), ke.push(Ke));
const Bt = {
    uA: { value: 0 },
    uCol: { value: new r.Color(1.25, 1.1, 0.95) },
    uSW: { value: He },
    uSD: { value: $e },
  },
  je = new r.InstancedMesh(
    new r.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
    new r.ShaderMaterial({
      uniforms: { ...ro, uSoft: { value: 0.3 }, ...Bt },
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: r.AdditiveBlending,
      vertexShader:
        "varying vec3 vLP;varying vec3 vN;varying float vH;void main(){vLP=position;vN=normal;vH=length(instanceMatrix[1].xyz);gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}",
      fragmentShader: `${Qo}uniform float uSoft;uniform float uA;uniform vec3 uCol;uniform float uSW;uniform float uSD;varying vec3 vLP;varying vec3 vN;varying float vH;
  void main(){vec3 a=abs(vN);float dx=(.5-abs(vLP.x))*uSW,dy=(.5-abs(vLP.y-.5))*vH,dz=(.5-abs(vLP.z))*uSD;   // distance to the box's edges, in world units
   float d=a.y>.5?min(dx,dz):a.x>.5?min(dy,dz):min(dx,dy);float e=1.-smoothstep(.004,.014,d),top=step(.5,vN.y)*.18;
   gl_FragColor=vec4(uCol*(e*.9+top)*uA*ovVis(uSoft),1.);}`,
    }),
    b,
  );
((je.frustumCulled = !1), (je.renderOrder = 4), lt.add(je));
const de = (() => {
  const e = new r.Group(),
    t = ye(),
    o = 0.86;
  (t
    .cyl(Le, 0, -o - 0.16, 0, 0.05, 0.07, 0.32, { seg: 14 })
    .cyl(Le, 0, -o - 0.33, 0, 0.2, 0.24, 0.06, { seg: 24 })
    .tor(Le, 0, 0, 0, o, 0.055, { seg: 56, seg2: 12 })
    .cyl(C("#08090b", { roughness: 0.5 }), 0, 0, -0.04, o, o, 0.06, {
      seg: 48,
      rx: Math.PI / 2,
    }),
    t.flush(e));
  let n = "",
    a = 0;
  const s = lo(o * 1.9, o * 1.9, 512, 512, null, 1, { alphaTest: 0.05 });
  ((s.position.z = 0.005), e.add(s));
  const i = new r.Mesh(
    new r.CircleGeometry(o, 48),
    new r.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.04,
      transparent: !0,
      opacity: 0.12,
      envMapIntensity: 1.4,
      depthWrite: !1,
    }),
  );
  ((i.position.z = 0.03), e.add(i));
  const l = (c, u) => {
    s.userData.redraw((f, d, m) => {
      const g = d / 2,
        y = m / 2;
      f.clearRect(0, 0, d, m);
      const S = f.createRadialGradient(g, y * 0.8, 10, g, y, d * 0.5);
      (S.addColorStop(0, "#1c1a17"),
        S.addColorStop(1, "#070708"),
        (f.fillStyle = S),
        f.beginPath(),
        f.arc(g, y, d * 0.47, 0, Math.PI * 2),
        f.fill());
      for (let oe = 0; oe <= 40; oe++) {
        const ne = -Math.PI * 1.25 + (oe / 40) * Math.PI * 1.5,
          ae = oe % 5 === 0,
          Ve = d * (ae ? 0.37 : 0.4),
          No = d * 0.44;
        ((f.strokeStyle = oe / 40 <= u ? "#ffc56a" : "#5a4a33"),
          (f.lineWidth = ae ? 5 : 3),
          f.beginPath(),
          f.moveTo(g + Math.cos(ne) * Ve, y + Math.sin(ne) * Ve),
          f.lineTo(g + Math.cos(ne) * No, y + Math.sin(ne) * No),
          f.stroke());
      }
      ((f.textAlign = "center"),
        (f.textBaseline = "middle"),
        (f.font = `700 ${c.length > 6 ? 96 : 118}px Outfit, sans-serif`));
      const P = f.createLinearGradient(0, y - 60, 0, y + 60);
      (P.addColorStop(0, "#ffe2a6"),
        P.addColorStop(1, "#f0a348"),
        (f.fillStyle = P),
        f.fillText(c, g, y + 6),
        (f.font = "500 30px Outfit, sans-serif"),
        (f.fillStyle = "#a99a82"),
        f.fillText("this session", g, y + 92));
    });
  };
  return (
    (e.userData = {
      set(c, u) {
        const f = c + "|" + u.toFixed(2);
        f !== n &&
          ((n = f),
          l(c, u),
          a ||
            ((a = 1),
            _t.push(() => l(...n.split("|").map((d, m) => (m ? +d : d))))));
      },
      R: o,
    }),
    ue.add(e),
    e
  );
})();
{
  const e = new r.Group(),
    t = ye(),
    o = fe - 1.75,
    n = T + 0.008,
    a = re(
      new r.MeshPhysicalMaterial({
        map: hn,
        color: "#a07a5c",
        roughness: 0.4,
        clearcoat: 0.6,
      }),
    ),
    s = C("#b88a72", { roughness: 0.6 }),
    i = C("#26324a", { roughness: 0.8 }),
    l = C("#141518", { roughness: 0.6 }),
    c = C("#2a1d16", { roughness: 0.7 });
  t.box(a, o + 0.18, n + 0.5, 0, 0.9, 0.035, 0.62);
  for (const [d, m] of [
    [-0.24, -0.27],
    [0.6, -0.27],
    [-0.24, 0.27],
    [0.6, 0.27],
  ])
    t.box(l, o + 0.18 + d - 0.18, n + 0.25, m, 0.025, 0.5, 0.025);
  (t
    .box(
      C("#9aa0a8", { roughness: 0.3, metalness: 0.6 }),
      o + 0.3,
      n + 0.53,
      0,
      0.32,
      0.012,
      0.22,
    )
    .box(
      C("#9aa0a8", { roughness: 0.3, metalness: 0.6 }),
      o + 0.45,
      n + 0.64,
      0,
      0.012,
      0.22,
      0.3,
      { rz: 0.18 },
    ),
    t
      .box(
        C("#7a3b2a", { roughness: 0.7 }),
        o + 0.52,
        n + 0.535,
        0.2,
        0.16,
        0.035,
        0.12,
      )
      .box(
        C("#2d4a5e", { roughness: 0.7 }),
        o + 0.52,
        n + 0.57,
        0.2,
        0.15,
        0.032,
        0.11,
      )
      .box(
        C("#c9b48a", { roughness: 0.7 }),
        o + 0.53,
        n + 0.6,
        0.2,
        0.14,
        0.03,
        0.1,
      ),
    t
      .cyl(Le, o - 0.18, n + 0.53, -0.2, 0.05, 0.06, 0.02, { seg: 12 })
      .cyl(Le, o - 0.15, n + 0.62, -0.2, 0.008, 0.008, 0.18, {
        seg: 6,
        rz: -0.25,
      }),
    t
      .box(l, o - 0.42, n + 0.3, 0, 0.3, 0.04, 0.3)
      .box(l, o - 0.58, n + 0.5, 0, 0.04, 0.36, 0.28, { rz: 0.12 })
      .cyl(l, o - 0.42, n + 0.15, 0, 0.02, 0.02, 0.28, { seg: 8 })
      .cyl(l, o - 0.42, n + 0.02, 0, 0.16, 0.16, 0.02, { seg: 5 }),
    t
      .box(i, o - 0.4, n + 0.48, 0, 0.17, 0.32, 0.24, { rz: -0.18, r: 0.04 })
      .box(i, o - 0.25, n + 0.33, -0.06, 0.26, 0.08, 0.08)
      .box(i, o - 0.25, n + 0.33, 0.06, 0.26, 0.08, 0.08)
      .box(i, o - 0.12, n + 0.17, -0.06, 0.07, 0.3, 0.07)
      .box(i, o - 0.12, n + 0.17, 0.06, 0.07, 0.3, 0.07)
      .box(l, o - 0.08, n + 0.02, -0.06, 0.12, 0.04, 0.07)
      .box(l, o - 0.08, n + 0.02, 0.06, 0.12, 0.04, 0.07)
      .box(i, o - 0.24, n + 0.53, -0.13, 0.26, 0.06, 0.06, { rz: -0.3 })
      .box(i, o - 0.24, n + 0.53, 0.13, 0.26, 0.06, 0.06, { rz: -0.3 })
      .sph(s, o - 0.1, n + 0.55, -0.1, 0.03)
      .sph(s, o - 0.1, n + 0.55, 0.1, 0.03)
      .sph(s, o - 0.38, n + 0.73, 0, 0.085, { seg: 16, seg2: 12 })
      .sph(c, o - 0.4, n + 0.765, 0, 0.083, {
        seg: 16,
        seg2: 10,
        s: [1, 0.7, 1],
      }),
    t.flush(e));
  const u = new r.Mesh(
    new r.PlaneGeometry(0.2, 0.28),
    new r.MeshBasicMaterial({
      map: ct(128, 180, (d, m, g) => {
        ((d.fillStyle = "#0d1626"), d.fillRect(0, 0, m, g));
        const y = Te(4);
        for (let S = 10; S < g - 8; S += 9) {
          let P = 8 + Math.floor(y() * 3) * 8;
          const oe = 2 + Math.floor(y() * 4);
          for (let ne = 0; ne < oe; ne++) {
            const ae = 8 + y() * 26;
            ((d.fillStyle = ["#6fd8ff", "#ffbe62", "#9fe6a0", "#c9d4ff"][
              Math.floor(y() * 4)
            ]),
              (d.globalAlpha = 0.85),
              d.fillRect(P, S, ae, 4),
              (P += ae + 5));
          }
        }
      }),
      color: new r.Color(1.5, 1.5, 1.6),
      fog: !1,
    }),
  );
  (u.position.set(o + 0.437, n + 0.645, 0),
    u.rotation.set(0, -Math.PI / 2, 0),
    u.rotateX(-0.18),
    e.add(u));
  const f = new r.Mesh(
    new r.ConeGeometry(0.06, 0.07, 16, 1, !0),
    new r.MeshBasicMaterial({
      color: new r.Color(2.4, 1.5, 0.7),
      side: r.DoubleSide,
      fog: !1,
    }),
  );
  (f.position.set(o - 0.12, n + 0.72, -0.2),
    (f.rotation.z = 0.6),
    e.add(f),
    Re(o - 0.1, n + 0.68, -0.2, "#ffb878", 1.6, 1.1),
    Re(o + 0.45, n + 0.7, 0.05, "#9fc8ff", 0.9, 0.6),
    ue.add(e));
}
const mn = [];
function Pa(e, t, o, n, a = 128, s = "@RYANSAEL") {
  const i = () => {
    ((e.font = `600 ${a}px Outfit, sans-serif`),
      (e.letterSpacing = Math.round(a * 0.18) + "px"));
  };
  i();
  const l = e.measureText(s).width;
  l > t - 28 && ((a = Math.floor((a * (t - 28)) / l)), i());
  const c = t / 2 + Math.round(a * 0.09),
    u = o / 2 + a * 0.35;
  ((e.textAlign = "center"),
    (e.textBaseline = "alphabetic"),
    (e.fillStyle = "#030303"),
    e.fillText(s, c + a * 0.02, u + a * 0.06));
  const f = e.createLinearGradient(0, u - a * 0.7, 0, u);
  (f.addColorStop(0, n ? "#ffe2a0" : "#efd6a0"),
    f.addColorStop(1, n ? "#e8a040" : "#b89058"),
    (e.fillStyle = f),
    e.fillText(s, c, u));
}
function Da(e, t = {}) {
  const o = t.k ?? 0.7;
  let n = !1;
  const a = (i, l, c) => Pa(i, l, c, n),
    s = lo(e, e * 0.1375, 1280, 176, a, o, { alphaTest: 0.25 });
  return (
    (s.userData.mark = 1),
    mn.push({
      hit: s,
      over(i) {
        ((n = i),
          s.material.color.setRGB(i ? 3.2 : o, i ? 2.4 : o, i ? 1.4 : o),
          s.userData.redraw(a));
      },
    }),
    s
  );
}
{
  const e = Da(1.9, { k: 0.75 });
  (e.position.set(Ae + 1.25, T * 0.47, we / 2 + 0.006), ue.add(e));
}
function qe(e = 600, t = 150) {
  const o = document.createElement("canvas");
  ((o.width = e), (o.height = t));
  const n = o.getContext("2d"),
    a = new r.CanvasTexture(o);
  ((a.colorSpace = r.SRGBColorSpace), (a.anisotropy = 4));
  const s = new r.Mesh(
    new r.PlaneGeometry(1, t / e),
    new r.MeshBasicMaterial({
      map: a,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      color: new r.Color(1.25, 1.25, 1.25),
    }),
  );
  return (
    (s.renderOrder = 10),
    (s.frustumCulled = !1),
    lt.add(s),
    (s.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 0,
      set(i, l = "", c = {}) {
        const u = i + "|" + l + "|" + JSON.stringify(c);
        if (u === this.key) return;
        ((this.key = u),
          (this.args = [i, l, c]),
          n.clearRect(0, 0, e, t),
          (n.font = "600 33px Outfit, sans-serif"));
        const f = n.measureText(i).width;
        n.font = `700 ${c.big || 44}px Outfit, sans-serif`;
        const d = l ? n.measureText(l).width : 0,
          m = !!l && !c.one,
          g = Math.min(e - 8, Math.max(f, m ? d : f + (l ? d + 22 : 0)) + 44),
          y = m ? t - 10 : Math.round(t * 0.52),
          S = c.align < 0 ? 4 : c.align > 0 ? e - 4 - g : (e - g) / 2,
          P = (t - y) / 2;
        ((n.fillStyle = c.bg || "rgba(11,14,22,.9)"),
          an(n, S, P, g, y, 16),
          n.fill(),
          (this.pw = g),
          (this.ph = y),
          (this.ox = S + g / 2 - e / 2),
          (n.textBaseline = "alphabetic"),
          (n.fillStyle = "#eef2fa"),
          (n.font = "600 33px Outfit, sans-serif"),
          m
            ? (n.fillText(i, S + 22, P + 46),
              (n.fillStyle = c.col || "#ffffff"),
              (n.font = `700 ${c.big || 44}px Outfit, sans-serif`),
              n.fillText(l, S + 22, P + y - 22))
            : (n.fillText(i, S + 22, P + y / 2 + 12),
              l &&
                ((n.fillStyle = c.col || "#fff"),
                (n.font = `700 ${c.big || 44}px Outfit, sans-serif`),
                n.fillText(l, S + 22 + f + 22, P + y / 2 + 14))),
          (a.needsUpdate = !0));
      },
    }),
    _t.push(() => {
      const i = s.userData;
      i.args && ((i.key = ""), i.set(...i.args));
    }),
    s
  );
}
function Ts() {
  return qe(380, 96);
}
function Rs(e, t) {
  const o = e.userData;
  if (o.txt === t) return;
  o.txt = t;
  const n = o.c || (o.c = e.material.map.image),
    a = n.getContext("2d"),
    s = n.width,
    i = n.height;
  (a.clearRect(0, 0, s, i), (a.font = "700 46px Outfit, sans-serif"));
  const l = a.measureText(t).width,
    c = l + 40;
  ((a.fillStyle = "rgba(10,12,18,.8)"),
    an(a, (s - c) / 2, 10, c, i - 20, (i - 20) / 2),
    a.fill(),
    (o.pw = c),
    (o.ph = i - 20),
    (o.ox = 0),
    (a.fillStyle = "#fff6e6"),
    (a.textAlign = "center"),
    (a.textBaseline = "middle"),
    a.fillText(t, s / 2, i / 2 + 2),
    (a.textAlign = "left"),
    (e.material.map.needsUpdate = !0));
}
const gn = new r.Vector3(),
  he = new r.Vector3();
function mt(e, t, o = 24, n = 0, a = 0, s = 0) {
  const i = (co(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(x.quaternion),
    e.scale.set(i, i, i),
    n &&
      e.position.addScaledVector(
        gn.set(0, 1, 0).applyQuaternion(x.quaternion),
        (n * i * e.userData.h) / e.userData.w,
      ),
    a &&
      e.position.addScaledVector(
        gn.set(1, 0, 0).applyQuaternion(x.quaternion),
        a * i,
      ),
    (e.userData.px = o),
    (e.userData.pri = s),
    Ft.push(e));
}
const Ft = [],
  Et = new r.Vector3();
function _a() {
  Ft.sort((a, s) => s.userData.pri - a.userData.pri);
  const e = Z.clientWidth,
    t = Z.clientHeight,
    o = [],
    n = Z.getBoundingClientRect();
  if (!Jt.classList.contains("ui-off"))
    for (const a of [...Fa, v(".side"), v(".ctl")]) {
      if (!a || (a.classList.contains("tcard") && !a.classList.contains("on")))
        continue;
      const s = a.getBoundingClientRect();
      s.width > 0 &&
        o.push([
          s.left - n.left,
          s.top - n.top,
          s.right - n.left,
          s.bottom - n.top,
        ]);
    }
  for (const a of Ft) {
    const s = a.userData;
    if (s.want > 0) {
      Et.copy(a.position).project(x);
      const i = s.px / s.h,
        l = (s.pw || s.w) * i,
        c = (s.ph || s.h) * i,
        u = (Et.x * 0.5 + 0.5) * e + (s.ox || 0) * i,
        f = (-Et.y * 0.5 + 0.5) * t,
        d = [u - l / 2 - 5, f - c / 2 - 4, u + l / 2 + 5, f + c / 2 + 4];
      Et.z > 1 ||
      d[0] < 0 ||
      d[1] < 0 ||
      d[2] > e ||
      d[3] > t ||
      o.some((m) => d[0] < m[2] && d[2] > m[0] && d[1] < m[3] && d[3] > m[1])
        ? (s.want = 0)
        : o.push(d);
    }
    ((s.a += (s.want - s.a) * (1 - Math.exp(-Ye * 8))),
      (a.material.opacity = s.a),
      (a.visible = s.a > 0.02));
  }
  Ft.length = 0;
}
let Xe = !0;
const h = { h: 0, m: 3, n: b, nV: b, play: !1, playAt: 0, scrub: !1, hov: 0 };
let vo = 0.016,
  xo = 0.016,
  Ye = 0.016,
  ee = 0;
const Pe = () => ho[J[h.h]] || [],
  j = () => Pe()[Math.min(h.m, Pe().length - 1)],
  gt = (e, t) => (t <= 1 ? e.C(1) : e.C(t) - e.C(t - 1)),
  vn = (e) => {
    const t = ho[e] || [];
    let o = 1e-9;
    for (const n of t) for (let a = 1; a <= b; a++) o = Math.max(o, gt(n, a));
    return Ma / o;
  },
  Ot = new Float32Array(b),
  De = new Float32Array(b),
  te = new Float32Array(b * 2),
  Ze = new r.Matrix4(),
  yo = new r.Quaternion(),
  wo = new r.Vector3(),
  bo = new r.Vector3();
let Vt = vn(J[0]),
  vt = Vt,
  Gt = !0;
function xn(e) {
  const t = j();
  if (!t) return;
  h.play &&
    ee - h.playAt > 0.5 &&
    ((h.playAt = ee), h.n < b ? me(h.n + 1, !1) : Ce(!1));
  const o = 1 - Math.exp(-e * (h.scrub ? 18 : h.play ? 9 : 5));
  ((h.nV += (h.n - h.nV) * o),
    Math.abs(h.n - h.nV) < 0.002 && (h.nV = h.n),
    (vt += (Vt - vt) * (1 - Math.exp(-e * 3.2))));
  const n = Gt ? 1 : 1 - Math.exp(-e * 4);
  Gt = !1;
  for (let a = 0; a < b; a++) {
    const s = a + 1,
      i = gt(t, s),
      l = Math.max(i * vt, 0.03),
      c = R(1 - Sa / l, 0.2, 1),
      u = s === 1 ? c : Math.min((t.C(1) / i) * 0.999, 0.85) * c;
    ((De[a] += (l - De[a]) * n),
      (te[a * 2] += (u - te[a * 2]) * n),
      (te[a * 2 + 1] += (c - te[a * 2 + 1]) * n),
      (be[a] = R(h.nV - a, 0, 1)));
    const f = Je();
    Ot[a] += ((f ? Math.max(gt(f, s) * vt, 0.03) : 0) - Ot[a]) * n;
  }
  Bt.uA.value += ((Mo() ? 1 : 0) - Bt.uA.value) * (1 - Math.exp(-e * 5));
}
const Je = () => Pe().at(-1),
  Mo = () => !!j() && j() !== Je();
function Ba() {
  for (let a = 0; a < b; a++) {
    const s = be[a],
      i = s * s * (3 - 2 * s),
      l = Math.max(De[a] * i, 1e-4);
    (Ze.compose(
      bo.set(Q(a + 1), T + 0.01, 0),
      yo.identity(),
      wo.set(He, l, $e),
    ),
      G.setMatrixAt(a, Ze),
      (go[a * 2] = te[a * 2]),
      (go[a * 2 + 1] = te[a * 2 + 1]));
    const c = s > 0.01 ? 1 : 1e-4;
    (Ze.compose(
      bo.set(Q(a + 1), T + 0.012, 0),
      yo.identity(),
      wo.set(He * 2.2 * c, 1, $e * 1.5 * c),
    ),
      Ke.setMatrixAt(a, Ze));
  }
  for (let a = 0; a < b; a++) {
    const s = be[a],
      i = s * s * (3 - 2 * s);
    (Ze.compose(
      bo.set(Q(a + 1), T + 0.01, 0),
      yo.identity(),
      wo.set(He * 1.04, Math.max(Ot[a] * i, 1e-4), $e * 1.04),
    ),
      je.setMatrixAt(a, Ze));
  }
  ((je.instanceMatrix.needsUpdate = !0),
    (je.visible = Bt.uA.value > 0.01),
    (G.instanceMatrix.needsUpdate = !0),
    (G.geometry.attributes.aBand.needsUpdate = !0),
    (G.geometry.attributes.aRise.needsUpdate = !0),
    (Ke.instanceMatrix.needsUpdate = !0));
  const e = Math.max(1, Math.round(h.nV)),
    t = e - 1,
    o = j();
  pn.value = t;
  const n = T + De[t] * Qt(0, 1, be[t]) + de.userData.R + 0.55;
  if (
    ((de.position.x += (Q(e) - de.position.x) * Math.min(1, Ye * 10)),
    (de.position.y += (n - de.position.y) * Math.min(1, Ye * 10)),
    (de.rotation.y = Math.atan2(
      x.position.x - de.position.x,
      x.position.z - de.position.z,
    )),
    o)
  ) {
    const a = o.C(e),
      s = Math.max(...Pe().map((i) => i.C(b)));
    de.userData.set(K(a), a / s);
  }
}
const yn = new r.Vector3(),
  So = new r.Vector3(),
  Fa = [v("#card-a")],
  It = [qe(560, 96), qe(560, 96), qe(760, 96)];
(It[0].userData.set("your new message", "", {
  align: -1,
  bg: "rgba(9,12,20,.5)",
}),
  It[1].userData.set("history", "", { align: -1, bg: "rgba(9,12,20,.5)" }),
  It[2].userData.set("system prompt, tools, files", "", {
    align: -1,
    bg: "rgba(9,12,20,.5)",
  }));
const Co = qe(),
  To = qe(700, 150),
  wn = new r.Color(1.6, 1.2, 0.7);
function Ea(e) {
  ft.begin();
  const t = Math.max(1, Math.round(h.nV)),
    o = t - 1,
    n = De[o] * Qt(0, 1, be[o]),
    a = Q(t) + He / 2 + 0.1,
    s = T + 0.01,
    i = j();
  [
    [te[o * 2 + 1], 1],
    [te[o * 2], te[o * 2 + 1]],
    [0, te[o * 2]],
  ].forEach(([u, f], d) => {
    const m = It[d],
      g = s + n * u,
      y = s + n * f,
      S = (g + y) / 2,
      P = Xe && n > 0.05 && (f - u) * n > 0.012;
    ((m.userData.want = P ? 1 : 0),
      P &&
        (he.set(a, g + 0.004, 0),
        yn.set(a, y - 0.004, 0),
        ft.seg(he, yn, 0.012, 0.012, wn, 0.5, 0.8),
        So.set(a + 0.16, S, 0),
        he.set(a, S, 0),
        ft.seg(he, So, 0.01, 0.01, wn, 0.45, 0.7)),
      mt(m, So.set(a + 0.2, S, 0), Me ? 24 : 32, 0, 0.5, 3 - d));
  });
  {
    const u = To.userData,
      f = Je();
    if (((u.want = Xe && Mo() ? 1 : 0), f && u.want)) {
      u.set(Ne(f.id), K(f.C(t)) + " the same session", {
        big: 36,
        col: "#ffe6c4",
      });
      const d = Ot[o] * Qt(0, 1, be[o]);
      (he.set(Q(t) - He / 2 - 0.1, T + d + 0.05, 0),
        mt(To, he, Me ? 22 : 28, 0.6, -0.55, 6));
    } else mt(To, he.set(0, -99, 0), 30, 0, 0, 0);
  }
  const c = Co.userData;
  if (((c.want = h.hov && h.hov !== t ? 1 : 0), h.hov && i)) {
    const u = h.hov;
    (c.set("Turn " + u, K(gt(i, u)) + " this turn"),
      mt(Co, he.set(Q(u), T + De[u - 1] + 0.08, 0), 40, 0.62, 0, 10));
  } else mt(Co, he.set(0, -99, 0), 40, 0, 0, 10);
  (ft.end(), _a());
}
const pe = {
    lab: {
      t: [-0.7, 2.2, 0],
      yaw: -0.46,
      pitch: 0.24,
      dist: 21,
      f: [5, 2.4, 0],
      r: 17,
      fit: [27.6, 12.9],
    },
    top: {
      t: [6.6, 4.1, 0],
      yaw: -0.42,
      pitch: 0.13,
      dist: 15.5,
      f: [8.8, 4, 0],
      r: 5,
      fit: [14, 11.2],
    },
  },
  bn = {
    t: [3.3, 3.3, 0],
    yaw: -0.9,
    pitch: 0.47,
    dist: 27,
    f: [1, 1.8, 0],
    r: 14,
  },
  w = { t: new r.Vector3(0, 2, 0), yaw: 0, pitch: 0.3, dist: 22 };
let zt = 4,
  q = 1,
  Ro = 1,
  Me = !1,
  H = !1,
  ko = [24, 12.5],
  Mn = 23,
  _e = "lab";
const I = M.domElement,
  Be = new Map();
let Nt = 0,
  Qe = null,
  $ = null,
  Ut = null;
const Se = new r.Raycaster(),
  Ht = new r.Vector2(),
  Fe = new r.Vector3(),
  $t = new r.Box3(),
  Sn = new r.Vector3(),
  Cn = new r.Vector3(),
  Oa = new r.Plane(new r.Vector3(0, 0, 1), 0);
function et(e) {
  const t = Me && x.aspect < 0.8 && e === pe.lab ? { ...e, ...bn } : e;
  (w.t.set(...t.t),
    (w.yaw = t.yaw),
    (w.pitch = t.pitch),
    (w.dist = t.dist),
    Ie.set(...t.f),
    (zt = t.r),
    t.fit && ((ko = t.fit), (Mn = t.dist)),
    (q = 1),
    (H = !1),
    On());
}
const Tn = [],
  Va = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), Tn.push(e));
  };
mn.forEach((e) => Va(e.hit, "link", { L: e }));
const Ga = (e) => {
  let t = e;
  for (; t.parent; t = t.parent) if (!t.visible) return !1;
  return t === L && t.visible;
};
function Ao(e) {
  const t = I.getBoundingClientRect();
  (Ht.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Se.setFromCamera(Ht, x));
  let o = null,
    n = 1e9;
  const a = Se.intersectObjects(
    Tn.filter((s) => s.visible && Ga(s)),
    !1,
  )[0];
  a && ((o = { ...a.object.userData.hk, point: a.point }), (n = a.distance));
  for (let s = 0; s < b; s++) {
    if (be[s] < 0.5) continue;
    const i = Q(s + 1);
    if (
      ($t.set(
        Sn.set(i - Ue / 2, T, -$e / 2),
        Cn.set(i + Ue / 2, T + Math.max(De[s], 0.15), $e / 2),
      ),
      Se.ray.intersectBox($t, Fe))
    ) {
      const l = Fe.distanceTo(Se.ray.origin);
      l < n && ((n = l), (o = { kind: "stack", k: s + 1 }));
    }
  }
  return (
    $t.set(Sn.set(Ae, 0, -we / 2), Cn.set(dt, T + 0.02, we / 2)),
    Se.ray.intersectBox($t, Fe) &&
      Fe.distanceTo(Se.ray.origin) < n &&
      (o = { kind: "plinth", x: Fe.x }),
    o
  );
}
function Ia(e) {
  const t = I.getBoundingClientRect();
  return (
    Ht.set(
      ((e.clientX - t.left) / t.width) * 2 - 1,
      -(((e.clientY - t.top) / t.height) * 2 - 1),
    ),
    Se.setFromCamera(Ht, x),
    Se.ray.intersectPlane(Oa, Fe)
      ? R(Math.round((Fe.x - fe) / Ue) + 1, 1, b)
      : null
  );
}
function me(e, t = !0) {
  ((h.n = R(Math.round(e), 1, b)), t && h.play && Ce(!1), ge(!0));
}
function Wt(e) {
  const t = Pe().length;
  t && ((h.m = (e + t) % t), ge(!0));
}
function Lo(e) {
  ((h.h = (e + J.length) % J.length),
    (Vt = vn(J[h.h])),
    (h.m = Math.min(h.m, Pe().length - 1)),
    Dn(),
    ge(!0));
}
function Ce(e) {
  ((h.play = e),
    e && (h.n >= b && ((h.n = 1), (h.nV = Math.min(h.nV, 1))), (h.playAt = ee)),
    v("#play-ic").setAttribute(
      "d",
      e ? "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" : "M8 5.5v13l11-6.5z",
    ),
    v("#play").setAttribute("aria-label", e ? "Pause" : "Play"),
    ge(!0));
}
function Rn(e) {
  if (e)
    switch (e.kind) {
      case "stack":
        me(e.k);
        break;
      case "plinth":
        me(Math.round((e.x - fe) / Ue) + 1);
        break;
      case "link":
        window.open(qn, "_blank", "noopener");
        break;
    }
}
function Po(e, t) {
  const o =
      (x.position.distanceTo(w.t) *
        2 *
        Math.tan(r.MathUtils.degToRad(x.fov / 2))) /
      Math.max(Z.clientHeight, 1),
    n = Math.cos(w.yaw),
    a = Math.sin(w.yaw);
  ((H = !0),
    (w.t.x = R(w.t.x - n * e * o, -14, 14)),
    (w.t.z = R(w.t.z + a * e * o, -8, 9)),
    (w.t.y = R(w.t.y + t * o, 0.5, 10)));
}
const kn = {
    stack: (e) => {
      const t = j();
      return t
        ? `Turn ${e.k} \xB7 this turn ${K(gt(t, e.k))} \xB7 the session so far ${K(t.C(e.k))}`
        : "";
    },
    plinth: () => "Click or drag along the plinth: turns",
    link: () => "@RYANSAEL on X",
  },
  Ee = v("#tip");
let xt = null;
function za(e) {
  const t = Ao(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== xt && (xt?.over(!1), o?.over(!0), (xt = o)),
    (h.hov = t?.kind === "stack" ? t.k : 0),
    (I.style.cursor = t
      ? t.kind === "plinth" || t.kind === "stack"
        ? "ew-resize"
        : "pointer"
      : ""));
  const n = t && kn[t.kind] ? kn[t.kind](t) : "";
  n
    ? ((Ee.textContent = n),
      (Ee.style.left = e.clientX + "px"),
      (Ee.style.top = e.clientY + "px"),
      Ee.classList.add("on"))
    : Ee.classList.remove("on");
}
(I.addEventListener("contextmenu", (e) => e.preventDefault()),
  I.addEventListener("pointerleave", () => {
    (xt?.over(!1),
      (xt = null),
      (h.hov = 0),
      Ee.classList.remove("on"),
      (I.style.cursor = ""));
  }),
  I.addEventListener("pointerdown", (e) => {
    E();
    try {
      I.setPointerCapture(e.pointerId);
    } catch {}
    (Ee.classList.remove("on"),
      Be.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (Qe = null));
    const t = e.button === 0 && !e.shiftKey && Be.size === 1 ? Ao(e) : null;
    ((Ut = t),
      ($ =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null),
      t &&
        (t.kind === "stack" || t.kind === "plinth") &&
        ((h.scrub = !0), h.play && Ce(!1)));
  }),
  I.addEventListener("pointermove", (e) => {
    const t = Be.get(e.pointerId);
    if (!t) {
      za(e);
      return;
    }
    const o = e.clientX - t[0],
      n = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), h.scrub)) {
      const a = Ia(e);
      a && a !== h.n && me(a);
      return;
    }
    if (
      ($ && Math.hypot(e.clientX - $[0], e.clientY - $[1]) > 6 && ($ = null),
      !$)
    ) {
      if (((H = !0), Be.size === 2)) {
        const [a, s] = [...Be.values()],
          i = Math.hypot(a[0] - s[0], a[1] - s[1]),
          l = [(a[0] + s[0]) / 2, (a[1] + s[1]) / 2];
        (Nt && (q = R((q * Nt) / i, 0.3, 2.2)),
          (Nt = i),
          Qe && Po(l[0] - Qe[0], l[1] - Qe[1]),
          (Qe = l));
        return;
      }
      t[2]
        ? Po(o, n)
        : ((w.yaw -= o * 0.004),
          (w.pitch = R(w.pitch + n * 0.003, -0.02, 1.3)));
    }
  }));
const An = (e) => {
  (h.scrub
    ? ((h.scrub = !1), $ && performance.now() - $[2] < 450 && Rn(Ut))
    : $ && Be.size === 1 && performance.now() - $[2] < 450 && Rn(Ut),
    ($ = null),
    (Ut = null),
    Be.delete(e.pointerId),
    (Nt = 0),
    (Qe = null));
};
(I.addEventListener("pointerup", An),
  I.addEventListener("pointercancel", (e) => {
    (($ = null), An(e));
  }),
  I.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        E(),
        (H = !0),
        (q = R(
          q * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.3,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const tt = new Set();
(addEventListener("keyup", (e) => tt.delete(e.key.toLowerCase())),
  addEventListener("blur", () => tt.clear()));
const Na = new r.Vector3();
function Ua() {
  if (!tt.size) return;
  const e = (tt.has("shift") ? 2.4 : 1) * vo,
    t = (...a) => a.some((s) => tt.has(s));
  let o = 0,
    n = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (n += 1),
    t("s", "arrowdown") && (n -= 1),
    (o || n) &&
      (Po(o * e * 420, 0),
      w.t.addScaledVector(
        Na.set(-Math.sin(w.yaw), 0, -Math.cos(w.yaw)),
        n * e * 6,
      )),
    t("q") && (w.yaw += e * 1.1),
    t("e") && (w.yaw -= e * 1.1),
    t("=", "+") && (q = R(q * Math.exp(-e * 1.3), 0.3, 2.2)),
    t("-", "_") && (q = R(q * Math.exp(e * 1.3), 0.3, 2.2)),
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
    ) && (H = !0));
}
let ot = !0,
  yt = -99,
  Kt = -1,
  F = null,
  wt = 0;
const jt = (e) => () => {
    ((h.nV = Math.min(h.nV, e)), me(e, !1));
  },
  Ln = (e) => () => Ce(e),
  bt = (e) => () => Wt(e),
  Do = [
    {
      ...pe.lab,
      dy: 0.003,
      hold: 35,
      beats: [
        [0, jt(b)],
        [4.5, jt(1)],
        [5.5, Ln(!0)],
        [32, Ln(!1)],
      ],
    },
    {
      ...pe.top,
      dy: -0.008,
      hold: 12,
      beats: [
        [0, jt(b)],
        [0.2, bt(3)],
        [3, bt(2)],
        [6, bt(1)],
        [9, bt(0)],
        [11.6, bt(2)],
      ],
    },
    {
      t: [fe - 1.6, T + 0.5, 0],
      yaw: -1.1,
      pitch: 0.22,
      dist: 3.4,
      dy: 0.01,
      f: [fe - 1.7, T + 0.55, 0],
      r: 1.1,
      hold: 7,
      beats: [],
    },
    {
      t: [fe + 3, T + 0.9, 0.2],
      yaw: -1.32,
      pitch: 0.08,
      dist: 7.4,
      dy: 0.016,
      f: [fe + 5, T + 0.8, 0],
      r: 3.4,
      hold: 9,
      beats: [[0, jt(b)]],
    },
  ];
function Pn(e, t) {
  ((Kt = e), (F = Do[e]), (wt = 0));
  const o = Me && x.aspect < 0.8 && e === 0 ? { ...F, ...bn } : F;
  (et(o), (yt = t));
}
function Ha(e) {
  (e < yt - 1 && (yt = e),
    (!F || e - yt > F.hold) && Pn((Kt + 1) % Do.length, e));
  const t = e - yt;
  if (!(t < 0)) {
    for (; wt < F.beats.length && t >= F.beats[wt][0];)
      (F.beats[wt][1](), wt++);
    H ||
      ((w.yaw = F.yaw + t * F.dy),
      (w.dist = F.dist * (1 - t * 0.004)),
      Ie.set(...F.f),
      (zt = F.r));
  }
}
function Oe(e) {
  ((ot = e),
    v("#cine").classList.toggle("on", e),
    v("#cine").setAttribute("aria-pressed", e),
    e && ((F = null), (Kt = -1), (H = !1), (q = 1)));
}
let _o = null;
const E = () => {
  ((_o = null), ot && Oe(!1));
};
function Bo() {
  (Oe(!1), et(pe[_e]));
}
function $a(e) {
  const t = H ? 0 : Math.sin(e / 8) * 0.02,
    o = w.dist * q * Ro,
    n = w.yaw + t,
    a = Math.asin(R((0.25 - w.t.y) / Math.max(o, 0.1), -1, 1)),
    s = Math.max(w.pitch, a),
    i = Math.cos(s);
  if (
    (x.position.set(
      w.t.x + Math.sin(n) * i * o,
      w.t.y + Math.sin(s) * o,
      w.t.z + Math.cos(n) * i * o,
    ),
    x.lookAt(w.t),
    !ot && !H)
  ) {
    const f = _o || pe[_e];
    (Ie.set(...f.f), (zt = f.r));
  }
  const l = x.position.distanceTo(H ? w.t : Ie),
    c = H ? Math.min(1, vo * 5) : 1,
    u = (H ? Math.max(2.4, l * 0.3) : zt) * p.focalBand;
  ((U.u.focus.value += (l - U.u.focus.value) * c),
    (U.u.range.value += (u - U.u.range.value) * c),
    U.u.cocScale.value.set(p.apertureNear, p.aperture));
}
const Fo = v("#seg-m"),
  qt = v("#turns");
function Dn() {
  ((Fo.innerHTML = Pe()
    .map((e, t) => `<button data-i="${t}">${fo(Ne(e.id))}</button>`)
    .join("")),
    [...Fo.children].forEach(
      (e) =>
        (e.onclick = () => {
          (E(), Wt(+e.dataset.i));
        }),
    ));
}
(Dn(),
  (v("#harn").onclick = () => {
    (E(), Lo(h.h + 1), nt(uo(J[h.h])));
  }),
  (v("#play").onclick = () => {
    (E(), Ce(!h.play));
  }),
  (v("#stepb").onclick = () => {
    (E(), me(h.n >= b ? 1 : h.n + 1));
  }),
  (qt.oninput = () => {
    (E(), me(+qt.value));
  }));
let _n = 0;
function Wa() {
  const e = j();
  if (!e) return "No sessions were measured in this agent.";
  const t = h.n,
    o = e.C,
    n = o(t) - o(t - 1),
    a = fo(Ne(e.id));
  if (t === 1)
    return `You type one line. The model reads everything again. On <b>${a}</b>, a one-turn session costs <span class="a">${K(o(1))}</span>.`;
  const s = n / Math.max(o(1), 1e-9),
    i =
      s >= 1.05
        ? `${s >= 10 ? Math.round(s) : s.toFixed(1)}x the first`
        : s >= 0.95
          ? "as much as the first"
          : `${Math.round(s * 100)}% of the first (re-read history can be cached)`,
    l = Mo()
      ? ` The same session on <b>${fo(Ne(Je().id))}</b>: <span class="a">${K(Je().C(t))}</span>, ${Math.round(Je().C(t) / Math.max(o(t), 1e-9))}x as much.`
      : "";
  return `You type one line. The model reads everything again. On <b>${a}</b>, turn ${t} alone costs <span class="a">${K(n)}</span>, ${i}; the session so far, <span class="a">${K(o(t))}</span>.${l}`;
}
function ge(e) {
  if (!e && ee - _n < 0.1) return;
  _n = ee;
  const t = j();
  if (t) {
    ((v("#s-one").textContent = K(t.c[0])),
      (v("#s-fifty").textContent = K(t.c[3])));
    const n = t.c[3] / t.c[0];
    v("#s-x").textContent = (n >= 10 ? Math.round(n) : n.toFixed(1)) + "x";
  }
  ([...Fo.children].forEach((n, a) => {
    (n.classList.toggle("on", a === h.m),
      n.setAttribute("aria-pressed", a === h.m));
  }),
    (v("#harn").textContent = uo(J[h.h])),
    (qt.value = h.n),
    qt.style.setProperty("--p", ((h.n - 1) / (b - 1)) * 100 + "%"),
    (v("#turns-v").textContent = h.n));
  const o = Wa();
  o !== ge.w && ((v("#why").innerHTML = o), (ge.w = o));
}
{
  const e = D.asOf ? ut(D.asOf.slice(0, 10)) : "";
  ((v("#src").innerHTML =
    `Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}`),
    (v("#info-src").innerHTML =
      `OpenRouter's cost per session by harness and model: the median cost of one session, by length, over the 30 days ${D.costWindow ? ut(D.costWindow[0]) + " to " + ut(D.costWindow[1]) : ""}. Which models are offered comes from OpenRouter's daily token totals for the top 50 models, ${D.week ? ut(D.week[0]) + " to " + ut(D.week[1]) : ""}. CC BY 4.0. Source: <a href="https://openrouter.ai/apps" target="_blank" rel="noopener">OpenRouter (openrouter.ai/apps)</a>, as of ${e}.`));
}
const ve = [
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
let X = 0,
  Bn = 0,
  Eo = 0,
  Oo = 0,
  Xt = 0;
function Y() {
  (M.setPixelRatio(p.pixelRatio),
    N.setPixelRatio(p.pixelRatio),
    it.rt.samples !== p.msaa && ((it.rt.samples = p.msaa), it.rt.dispose()),
    (Jo.enabled = !!p.smaa),
    k.shadow.mapSize.x !== p.shadow &&
      (k.shadow.mapSize.set(p.shadow, p.shadow),
      k.shadow.map?.dispose(),
      (k.shadow.map = null)),
    (le.enabled = !!p.bloom),
    (le.radius = p.bloomRadius),
    (A.enabled = !0),
    A.updateGtaoMaterial({
      radius: p.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: p.ao ? p.aoSamples : 2,
    }),
    (U.enabled = !!p.dof),
    (U.u.maxCoc.value = p.maxCoc),
    Xa(),
    Vn());
}
function xe() {
  ((v("#tune-rows").innerHTML = ve
    .map(([e, t, o, n, , a, s], i) => {
      const l = p[e],
        c = ((l - o) / (n - o)) * 100;
      return `<div class="tr${i === X ? " sel" : ""}${s ? " sub" : ""}" data-i="${i}"><b>${t}</b><span class="tk"><i style="left:${R(c, 0, 100)}%"></i></span><u>${a(l)}</u></div>`;
    })
    .join("")),
    v("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((X = +e.dataset.i), xe());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (X = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const n = (a) => {
            const s = t.getBoundingClientRect(),
              [i, , l, c, u] = ve[X],
              f = R(
                Math.round(
                  (l + ((a.clientX - s.left) / s.width) * (c - l)) / u,
                ) * u,
                l,
                c,
              );
            f !== p[i] &&
              ((p[i] = +f.toFixed(4)), i !== "auto" && (p.auto = 0), Y());
            const d = t.querySelector("i");
            ((d.style.left = R(((p[i] - l) / (c - l)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = ve[X][5](p[i])),
              (v("#tune-json").value = JSON.stringify(p)));
          };
          (n(o),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && n(a);
            }),
            (t.onpointerup = () => xe()));
        };
      }),
    (v("#tune-json").value = JSON.stringify(p)));
}
function Ka(e, t) {
  const [o, , n, a, s] = ve[X],
    i = R(+(p[o] + e * s * (t ? 5 : 1)).toFixed(4), n, a);
  i !== p[o] && ((p[o] = i), o !== "auto" && (p.auto = 0), Y(), xe());
}
function Fn(e) {
  const t = v("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && xe());
}
function ja(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (X = (X + (t === "ArrowUp" ? -1 : 1) + ve.length) % ve.length),
      xe(),
      v("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (Ka(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , n, a, s] = ve[X];
    return a - n === s
      ? ((p[o] = p[o] ? 0 : 1), o !== "auto" && (p.auto = 0), Y(), xe(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(p, so) : (p[ve[X][0]] = so[ve[X][0]]),
      (p.auto = 0),
      Y(),
      xe(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(p, null, 1)), !0)
      : t === "Escape"
        ? (Fn(!1), !0)
        : !1;
}
v("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in so) typeof t[o] == "number" && (p[o] = t[o]);
    ((p.auto = 0), Y(), xe());
  } catch {
    xe();
  }
});
const Yt = v("#ui-hint");
let En = -9;
function nt(e) {
  ((Yt.textContent = e), Yt.classList.add("on"), (En = ee));
}
const Vo = ["lab", "top"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Fn());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) &&
      e.target.type !== "range") ||
    v("#info").open
  )
    return;
  if (!v("#tune").hidden && ja(e)) {
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
      t !== "shift" && E(),
      tt.add(t));
    return;
  }
  t >= "1" && t <= "4"
    ? (E(), Wt(+t - 1), nt(Ne(j()?.id || "")))
    : t === "[" || t === "]"
      ? (E(), Lo(h.h + (t === "[" ? -1 : 1)), nt(uo(J[h.h])))
      : t === " "
        ? (e.preventDefault(), E(), Ce(!h.play))
        : t === "." || t === ">"
          ? (E(), me(h.n + 1))
          : t === "," || t === "<"
            ? (E(), me(h.n - 1))
            : t === "v"
              ? (E(),
                (_e = Vo[(Vo.indexOf(_e) + 1) % Vo.length]),
                et(pe[_e]),
                nt(_e === "lab" ? "The whole session" : "The newest turn"))
              : t === "c"
                ? v("#cine").click()
                : t === "r"
                  ? Bo()
                  : t === "n"
                    ? ((Xe = !Xe), nt(Xe ? "Labels on" : "Labels off"))
                    : t === "/" &&
                      (e.preventDefault(),
                      Jt.classList.toggle("ui-off"),
                      nt(
                        Jt.classList.contains("ui-off")
                          ? "Interface hidden \xB7 / to show"
                          : "Interface shown",
                      ));
}),
  (v("#cine").onclick = () => {
    ot ? Bo() : Oe(!0);
  }),
  I.addEventListener("dblclick", (e) => {
    Ao(e) || Bo();
  }),
  (v("#how").onclick = () => v("#info").showModal()),
  (v("#close").onclick = () => v("#info").close()),
  v("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    v("#tune").hidden || (v("#tune-fps").textContent = Math.round(Bn) + " fps");
  }, 500));
const qa = {
  bg: "#0d1119",
  fog: "#151b28",
  fogD: 0.0032,
  exp: 0.95,
  envI: 0.4,
  bloomT: 1.1,
  bloomS: 0.34,
  refl: 0.42,
  hemi: [9414360, 3813414, 0.26],
  sun: [16763289, 0.62],
  sunDir: [-0.5, 0.74, 0.45],
  rim: 0.5,
  key2: 0.22,
};
function Xa() {
  const e = qa;
  (L.background.set(e.bg),
    L.fog.color.set(e.fog),
    (L.fog.density = e.fogD * p.fog),
    (M.toneMapping = r.ACESFilmicToneMapping),
    (M.toneMappingExposure = p.exposure * e.exp),
    (L.environment = to.show),
    (L.environmentIntensity = p.env * e.envI),
    (le.threshold = p.bloomThreshold * e.bloomT),
    (le.strength = p.bloomStrength * e.bloomS),
    (kt.uReflStrength.value = p.reflect * e.refl),
    Ct.color.set(e.hemi[0]),
    Ct.groundColor.set(e.hemi[1]),
    (Ct.intensity = e.hemi[2] * p.fill),
    k.color.set(e.sun[0]),
    (k.intensity = e.sun[1] * p.sun),
    k.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    k.target.position.set(0, 1, 0),
    (at.intensity = e.rim * p.rim),
    (Tt.intensity = e.key2 * p.fill),
    ($o.value = p.sat));
}
(at.position.set(4, 20, -15),
  at.color.set(10274559),
  Tt.position.set(-10, 14, 12),
  Object.assign(k.shadow.camera, {
    left: -15,
    right: 15,
    top: 10,
    bottom: -8,
    near: 1,
    far: 70,
  }),
  k.shadow.camera.updateProjectionMatrix());
function On() {
  const e = Z.clientWidth,
    t = Z.clientHeight;
  Me = e < 900;
  const o = p.fov + (Me ? 8 : 0);
  (x.fov !== o && ((x.fov = o), x.updateProjectionMatrix()),
    x.setViewOffset(
      e,
      t,
      Me ? 0 : -e * 0.015,
      Me ? t * 0.06 : -t * 0.035,
      e,
      t,
    ));
  const n = 2 * Math.tan(r.MathUtils.degToRad(x.fov / 2));
  Ro =
    x.aspect < 0.8
      ? R(0.62 / Math.max(x.aspect, 0.4), 1, 1.5)
      : R(Math.max(ko[0] / (n * x.aspect), ko[1] / n) / Mn, 0.85, 2.2);
}
function Vn() {
  const e = Z.clientWidth,
    t = Z.clientHeight;
  ((x.aspect = e / t),
    x.updateProjectionMatrix(),
    M.setSize(e, t),
    N.setSize(e, t));
  const o = M.getDrawingBufferSize(new r.Vector2());
  (oo.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    ro.uRes.value.copy(o),
    On(),
    x.updateProjectionMatrix());
}
addEventListener("resize", Vn);
let Gn = performance.now(),
  Go = 0,
  Io = 0,
  In = 0;
function zo(e) {
  ((Ye = Math.max(0, (e - Gn) / 1e3)),
    (xo = Math.min(1.5, Ye)),
    (vo = Math.min(0.1, xo)),
    (Gn = e));
  const t = e / 1e3;
  if (
    ((ee = t),
    ot && Ha(t),
    Ua(),
    xn(Ye),
    $a(t),
    x.updateMatrixWorld(),
    Ba(),
    (M.shadowMap.needsUpdate = !0),
    Ea(t),
    ge(),
    Yt.classList.contains("on") && ee - En > 1.5 && Yt.classList.remove("on"),
    (Go += xo),
    Io++,
    e - In > 1600)
  ) {
    const o = Io / Math.max(Go, 0.001);
    ((Go = 0),
      (Io = 0),
      (In = e),
      (Bn = o),
      Oo++,
      Oo > 2 && (Eo = Math.max(Eo, o)),
      (Xt = Oo > 3 && o < Eo * 0.74 ? Xt + 1 : 0),
      !document.hidden &&
        p.auto &&
        Xt >= 2 &&
        o < 50 &&
        ((Xt = 0),
        p.pixelRatio > 1
          ? ((p.pixelRatio = Math.max(1, +(p.pixelRatio - 0.25).toFixed(2))),
            Y())
          : p.reflect
            ? ((p.reflect = 0), Y())
            : p.msaa > 0
              ? ((p.msaa = 0), Y())
              : p.ao && ((p.ao = 0), Y())));
  }
  (na(), M.info.reset(), N.render());
}
let zn = !0;
function Nn(e) {
  (requestAnimationFrame(Nn), zn && zo(e));
}
(xn(0),
  Y(),
  et(pe.lab),
  Oe(!0),
  v("#loading").remove(),
  ge(!0),
  requestAnimationFrame(Nn),
  (window.__step = (e) => zo(e)),
  (window.__loop = (e) => {
    zn = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = M.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = e),
      (n.height = Math.round((e * o.height) / o.width)),
      n.getContext("2d").drawImage(o, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    zo(o ?? performance.now());
    const n = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + Ho + "/_shots/" + e + ".webp",
        { method: "POST", body: n },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (Oe(!1), (_o = e), e && et({ fit: null, ...e }));
    },
    view: (e) => {
      (Oe(!1), (_e = e), et(pe[e]));
    },
    cut: (e) => {
      (Oe(!0), Pn(e, ee));
    },
    turn: (e) => {
      (Ce(!1), (h.n = h.nV = R(Math.round(e), 1, b)), ge(!0));
    },
    model: (e) => {
      (Wt(e), (Gt = !0));
    },
    harness: (e) => {
      (Lo(e), (vt = Vt), (Gt = !0));
    },
    play: (e) => Ce(!!e),
    tags: (e) => {
      Xe = !!e;
    },
    tune: (e) => (Object.assign(p, e), Y(), { ...p }),
    ST: h,
    HERO: pe,
    SHOTS: Do,
    CHIPS: ho,
    DATA: D,
  }),
  (window.__x = {
    dof: U,
    gtao: A,
    bloom: le,
    renderer: M,
    camera: x,
    scene: L,
    composer: N,
    cam: w,
    RT: p,
    overlay: lt,
    rays: ft,
    STACKS: G,
  }),
  (window.__dbg = () => ({
    t: +ee.toFixed(2),
    shot: Kt,
    cine: ot,
    n: h.n,
    nV: +h.nV.toFixed(2),
    h: J[h.h],
    model: j() ? Ne(j().id) : null,
    play: h.play,
    fit: +Ro.toFixed(3),
    focus: +U.u.focus.value.toFixed(2),
    range: +U.u.range.value.toFixed(2),
    calls: M.info.render.calls,
    tris: M.info.render.triangles,
  })));
