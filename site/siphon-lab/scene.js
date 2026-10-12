import * as i from "three";
import { EffectComposer as _s } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as Zo,
  FullScreenQuad as po,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as ea } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Fs } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as As } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as Ds } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as Is } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as Qo } from "three/addons/utils/BufferGeometryUtils.js";
const _ = (e) => document.querySelector(e),
  ht = _("#world"),
  en = _("#app"),
  R = (e, t, n) => (e < t ? t : e > n ? n : e),
  tt = (e, t, n) => e + (t - e) * n,
  Sr = (e, t, n) => {
    const o = R((n - e) / (t - e), 0, 1);
    return o * o * (3 - 2 * o);
  },
  kr = (e) => 1 - (1 - e) ** 3,
  Gs = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
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
const Tr = re(7),
  mo = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Es = "https://x.com/ryansael",
  tn = "siphon-lab",
  Z = new i.Scene();
((Z.background = new i.Color("#10151f")),
  (Z.fog = new i.FogExp2("#1a2130", 0.0065)));
const P = new i.PerspectiveCamera(30, 1, 0.3, 320);
let N;
try {
  N = new i.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (_("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const Ws = 25e5,
  Ns = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return R(Math.min(devicePixelRatio, 2, Math.sqrt(Ws / (e * t))), 1, 2);
  },
  vo = Ns();
(N.setPixelRatio(vo),
  (N.info.autoReset = !1),
  (N.shadowMap.enabled = !0),
  (N.shadowMap.type = i.PCFShadowMap),
  (N.shadowMap.autoUpdate = !1),
  (N.transmissionResolutionScale = 0.6),
  (N.toneMapping = i.ACESFilmicToneMapping),
  ht.appendChild(N.domElement));
const xo = new i.HemisphereLight(9414360, 3813414, 0.5);
Z.add(xo);
const Q = new i.DirectionalLight(16763279, 2.1);
((Q.castShadow = !0),
  Q.shadow.mapSize.set(2048, 2048),
  Object.assign(Q.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (Q.shadow.normalBias = 0.03),
  (Q.shadow.bias = -4e-4),
  (Q.shadow.radius = 2),
  Z.add(Q, Q.target));
const Bs = new i.Vector3(0.62, 0.62, 0.48).normalize();
(Q.position.copy(Bs).multiplyScalar(30), Q.target.position.set(0, 2, 0));
const on = new i.DirectionalLight(9427199, 0.9);
(on.position.set(-15, 8, -5), Z.add(on));
const nn = new i.DirectionalLight(16773600, 0.55);
(nn.position.set(-8, 12, 10), Z.add(nn));
const Re = new i.Group();
Z.add(Re);
const He = 10,
  ot = {
    pos: {
      value: Array.from({ length: He }, () => new i.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: He }, () => new i.Vector3()) },
  },
  ta = `uniform vec4 uFakePos[${He}];uniform vec3 uFakeCol[${He}];uniform float uSat;`,
  oa = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${He};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  na = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  an = { value: 1.16 };
function Oe(e, t) {
  return (
    (e.onBeforeCompile = (n) => {
      (Object.assign(n.uniforms, {
        uFakePos: ot.pos,
        uFakeCol: ot.col,
        uSat: an,
      }),
        (n.fragmentShader = n.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + ta,
          )
          .replace("#include <lights_fragment_end>", oa)
          .replace("#include <opaque_fragment>", na)),
        t?.(n));
    }),
    (e.customProgramCacheKey = () => tn + (t ? t.key : "")),
    e
  );
}
const aa = [];
function dt(e, t, n, o, a, r) {
  const l = { p: new i.Vector3(e, t, n), c: new i.Color(o), r: a, i: r, i0: r };
  return (aa.push(l), l);
}
const wo = new i.Vector3(),
  he = [],
  Tt = new i.Vector3(0, 3, 0);
function Os(e) {
  he.length = 0;
  for (const t of aa)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        he.length < He)
      )
        (he.push(t), he.length === He && he.sort((n, o) => n.score - o.score));
      else if (t.score > he[0].score) {
        he[0] = t;
        for (let n = 0; n < He - 1 && he[n].score > he[n + 1].score; n++) {
          const o = he[n];
          ((he[n] = he[n + 1]), (he[n + 1] = o));
        }
      }
    }
}
function sa(e, t) {
  Os(t);
  for (let n = 0; n < He; n++) {
    const o = he[n];
    if (!o) {
      (ot.col.value[n].set(0, 0, 0), ot.pos.value[n].set(0, -999, 0, 1));
      continue;
    }
    (wo.copy(o.p).applyMatrix4(e.matrixWorldInverse),
      ot.pos.value[n].set(wo.x, wo.y, wo.z, 1 / (o.r * o.r)),
      ot.col.value[n].set(o.c.r * o.i, o.c.g * o.i, o.c.b * o.i));
  }
}
const bo = {};
{
  const e = new i.PMREMGenerator(N),
    t = (o) =>
      new i.Mesh(
        new i.SphereGeometry(50, 32, 16),
        new i.ShaderMaterial({
          side: i.BackSide,
          vertexShader:
            "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: o,
        }),
      ),
    n = (o, a, r, l, s, c, f) => {
      const h = new i.Mesh(
        new i.BoxGeometry(a, r, 0.4),
        new i.MeshBasicMaterial({ color: new i.Color(...l) }),
      );
      (h.position.set(s, c, f), h.lookAt(0, 0, 0), o.add(h));
    };
  {
    const o = new i.Scene();
    o.add(
      t(
        "varying vec3 d;void main(){vec3 c=mix(vec3(.10,.085,.07),vec3(.16,.19,.26),smoothstep(-.4,.1,d.y));c=mix(c,vec3(.06,.08,.13),smoothstep(.2,.9,d.y));c+=vec3(1.4,.8,.42)*smoothstep(.55,.95,d.x)*smoothstep(-.1,.25,d.y)*(1.-smoothstep(.3,.7,d.y));gl_FragColor=vec4(c,1.);}",
      ),
    );
    const a = [
      [5.5, 4.2, 3],
      [1.8, 3.6, 5.2],
      [4.6, 3, 1.5],
      [2.6, 2.9, 3.4],
      [1.5, 4.2, 5.5],
      [3.4, 3.4, 3.4],
    ];
    for (let r = 0; r < 6; r++) {
      const l = (r / 6) * Math.PI * 2 + 0.4;
      n(o, 12, 2.4, a[r], Math.sin(l) * 28, 12 + (r % 2) * 9, Math.cos(l) * 28);
    }
    {
      const r = new i.Mesh(
        new i.BoxGeometry(40, 1.2, 1.2),
        new i.MeshBasicMaterial({ color: new i.Color(6, 3.4, 1.2) }),
      );
      (r.position.set(0, -6, -30), o.add(r));
    }
    bo.show = e.fromScene(o, 0.03).texture;
  }
  {
    const o = new i.Scene();
    (o.add(
      t(
        "varying vec3 d;void main(){vec3 c=mix(vec3(.62,.56,.49),vec3(1.02,.97,.9),smoothstep(-.35,.15,d.y));c=mix(c,vec3(1.1,1.08,1.04),smoothstep(.4,.95,d.y));gl_FragColor=vec4(c,1.);}",
      ),
    ),
      n(o, 26, 12, [7, 6.8, 6.4], -14, 22, 12),
      n(o, 18, 9, [4.2, 4.4, 4.8], 24, 12, 6),
      n(o, 30, 6, [3.2, 3.1, 3], 0, 30, -10),
      n(o, 8, 20, [5, 4.8, 4.6], -26, 8, -6),
      (bo.studio = e.fromScene(o, 0.03).texture));
  }
  e.dispose();
}
((Z.environment = bo.show), (Z.environmentIntensity = 0.7));
const ia = 0,
  sn = new i.WebGLRenderTarget(1, 1, {
    type: i.HalfFloatType,
    generateMipmaps: !0,
    minFilter: i.LinearMipmapLinearFilter,
  }),
  go = {
    tReflect: { value: sn.texture },
    uReflMatrix: { value: new i.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  ra = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, go),
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
  ge = new i.PerspectiveCamera(),
  yo = new i.Vector3(0, 1, 0),
  Ht = new i.Vector3(0, ia, 0),
  rn = new i.Vector3(),
  Mo = new i.Vector3(),
  ln = new i.Matrix4(),
  jt = new i.Plane(),
  je = new i.Vector4(),
  la = new i.Vector4(),
  Lt = [];
function Us() {
  if (
    !T.reflect ||
    go.uReflStrength.value <= 0 ||
    P.position.y <= ia ||
    !Q.shadow.map
  )
    return;
  (rn.setFromMatrixPosition(P.matrixWorld),
    ln.extractRotation(P.matrixWorld),
    ge.position.subVectors(Ht, rn).reflect(yo).negate().add(Ht),
    Mo.set(0, 0, -1).applyMatrix4(ln).add(rn),
    Mo.subVectors(Ht, Mo).reflect(yo).negate().add(Ht),
    ge.up.set(0, 1, 0).applyMatrix4(ln).reflect(yo),
    ge.lookAt(Mo),
    (ge.far = P.far),
    ge.updateMatrixWorld(),
    ge.projectionMatrix.copy(P.projectionMatrix),
    go.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(ge.projectionMatrix)
      .multiply(ge.matrixWorldInverse),
    jt
      .setFromNormalAndCoplanarPoint(yo, Ht)
      .applyMatrix4(ge.matrixWorldInverse),
    je.set(jt.normal.x, jt.normal.y, jt.normal.z, jt.constant));
  const e = ge.projectionMatrix.elements;
  (la.set(
    (Math.sign(je.x) + e[8]) / e[0],
    (Math.sign(je.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    je.multiplyScalar(2 / je.dot(la)),
    (e[2] = je.x),
    (e[6] = je.y),
    (e[10] = je.z + 1),
    (e[14] = je.w));
  const t = Lt.map((o) => o.visible),
    n = N.shadowMap.needsUpdate;
  (Lt.forEach((o) => (o.visible = !1)),
    (N.shadowMap.needsUpdate = !1),
    sa(ge, Tt),
    N.setRenderTarget(sn),
    N.clear(),
    N.render(Z, ge),
    N.setRenderTarget(null),
    Lt.forEach((o, a) => (o.visible = t[a])),
    (N.shadowMap.needsUpdate = n));
}
const qs =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  So = (e, t) =>
    new i.ShaderMaterial({
      uniforms: t,
      vertexShader: qs,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class Hs extends Zo {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new i.WebGLRenderTarget(1, 1, {
        type: i.HalfFloatType,
        samples: t,
        depthTexture: new i.DepthTexture(1, 1),
      })),
      (this.quad = new po(
        So(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, n) {
    this.rt.setSize(t, n);
  }
  render(t, n, o) {
    (sa(P, Tt),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(Z, P),
      t.setRenderTarget(o),
      this.quad.render(t));
  }
}
const ca = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class js extends Zo {
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
        near: { value: P.near },
        far: { value: P.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new i.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new i.Vector2() },
        fullTexel: { value: new i.Vector2() },
      }),
      (this.pre = new po(
        So(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${ca}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new po(
        So(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new po(
        So(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${ca}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(t, n) {
    const o = Math.ceil(t / 2),
      a = Math.ceil(n / 2);
    (this.half.setSize(o, a),
      this.blurRT.setSize(o, a),
      this.u.texel.value.set(1 / o, 1 / a),
      this.u.fullTexel.value.set(1 / t, 1 / n));
  }
  render(t, n, o) {
    ((this.u.tColor.value = o.texture),
      t.setRenderTarget(this.half),
      this.pre.render(t),
      t.setRenderTarget(this.blurRT),
      this.blur.render(t),
      t.setRenderTarget(this.renderToScreen ? null : n),
      this.comp.render(t));
  }
}
const T = {
    auto: 1,
    pixelRatio: vo,
    msaa: vo >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 2048,
    exposure: 1,
    fov: 30,
    sun: 1,
    fill: 1,
    rim: 1,
    fog: 1,
    sat: 1.16,
    env: 1,
    reflect: 1,
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
    aperture: 1.6,
    apertureNear: 0.9,
    maxCoc: 13,
  },
  cn = { ...T },
  ye = new _s(
    N,
    new i.WebGLRenderTarget(1, 1, { type: i.HalfFloatType, depthBuffer: !1 }),
  );
ye.setPixelRatio(vo);
const Kt = new Hs(T.msaa);
ye.addPass(Kt);
const $ = new ea(Z, P, 1, 1);
(($.output = ea.OUTPUT.Off),
  ($.needsSwap = !1),
  $.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  $.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const Ks = $.setSize.bind($),
  $s = $.render.bind($);
$.setSize = (e, t) => Ks(Math.ceil(e / 2), Math.ceil(t / 2));
const Me = [],
  fa = [];
(($.render = (e, t, n) => {
  (Me.forEach((o, a) => {
    ((fa[a] = o.visible), (o.visible = !1));
  }),
    $s(e, t, n),
    Me.forEach((o, a) => (o.visible = fa[a])),
    ($.blendMaterial.uniforms.intensity.value = T.ao
      ? T.aoIntensity * (ut[A.cur].ao ?? 1)
      : 0),
    ($.blendMaterial.uniforms.tDiffuse.value = $.pdRenderTarget.texture),
    $._renderPass(e, $.blendMaterial, n));
}),
  ye.addPass($));
const Ke = new Fs(new i.Vector2(256, 256), 0.42, 0.55, 1.05),
  Xs = Ke.setSize.bind(Ke);
((Ke.setSize = (e, t) => Xs(Math.ceil(e / 2), Math.ceil(t / 2))),
  ye.addPass(Ke));
const Se = new js();
((Se.u.tDepth.value = Kt.rt.depthTexture), ye.addPass(Se));
const ko = new i.Scene(),
  ua = {
    tSceneDepth: { value: $.depthTexture },
    uRes: { value: new i.Vector2(1, 1) },
    uNF: { value: new i.Vector2(P.near, P.far) },
  };
class Ys extends Zo {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, n, o) {
    const a = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(o),
      t.render(ko, P),
      (t.autoClear = a));
  }
}
(ye.addPass(new Ys()), ye.addPass(new As()));
const ha = new Ds();
ye.addPass(ha);
const Js = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  $t = (e, t, n, o = 0.06, a = 2) =>
    new Is(e, t, n, a, Math.min(o, Math.min(e, t, n) / 2.02)),
  $e = new Map();
function D(e, t = {}) {
  const n = "M" + e + JSON.stringify(t);
  return (
    $e.has(n) ||
      $e.set(
        n,
        Oe(
          new i.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    $e.get(n)
  );
}
function Lr(e, t = {}) {
  const n = "P" + e + JSON.stringify(t);
  return (
    $e.has(n) ||
      $e.set(
        n,
        Oe(
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
    $e.get(n)
  );
}
function X(e, t = {}) {
  const n = "T" + e + JSON.stringify(t);
  return (
    $e.has(n) ||
      $e.set(
        n,
        Oe(
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
    $e.get(n)
  );
}
const de = (e, t = 1) =>
    new i.MeshBasicMaterial({
      color: new i.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  zr = (e = {}) =>
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
  _e = X("#434a55", { roughness: 0.36 }),
  ke = X("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Xt = X("#15171b", { roughness: 0.46, metalness: 0.55 }),
  Cr = X("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  To = X("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  Vr = D("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  Zs = X("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  Pr = X("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  Qs = new i.Matrix4(),
  Lo = new i.Quaternion(),
  da = new i.Euler(0, 0, 0, "YXZ"),
  pa = new i.Vector3(1, 1, 1),
  Rr = new i.Color(),
  _r = new i.Vector3(1, 0, 0),
  zo = new i.Vector3(0, 1, 0),
  Fr = new i.Vector3(0, 0, 1),
  ei = new i.Vector3(),
  ti = new i.Quaternion();
function W() {
  const e = new Map(),
    t = (n, o, a, r, l, s) => {
      o = o.index ? o.toNonIndexed() : o;
      for (const f of Object.keys(o.attributes))
        ["position", "normal", "uv"].includes(f) || o.deleteAttribute(f);
      (o.attributes.uv ||
        o.setAttribute(
          "uv",
          new i.Float32BufferAttribute(
            new Float32Array(o.attributes.position.count * 2),
            2,
          ),
        ),
        s.dir
          ? (Lo.setFromUnitVectors(
              zo,
              ei.set(s.dir[0], s.dir[1], s.dir[2]).normalize(),
            ),
            s.roll && Lo.multiply(ti.setFromAxisAngle(zo, s.roll)))
          : (da.set(s.rx || 0, s.ry || 0, s.rz || 0), Lo.setFromEuler(da)),
        o.applyMatrix4(
          Qs.compose(
            { x: a, y: r, z: l },
            Lo,
            s.s ? pa.set(s.s[0], s.s[1], s.s[2]) : pa.set(1, 1, 1),
          ),
        ));
      let c = e.get(n);
      (c || e.set(n, (c = { mat: n, list: [] })), c.list.push(o));
    };
  return {
    box(n, o, a, r, l, s, c, f = {}) {
      return (
        t(n, f.r ? $t(l, s, c, f.r) : new i.BoxGeometry(l, s, c), o, a, r, f),
        this
      );
    },
    cyl(n, o, a, r, l, s, c, f = {}) {
      return (
        t(n, new i.CylinderGeometry(l, s, c, f.seg || 20), o, a, r, f),
        this
      );
    },
    cone(n, o, a, r, l, s, c = {}) {
      return (
        t(
          n,
          new i.ConeGeometry(l, s, c.seg || 6).translate(0, s / 2, 0),
          o,
          a,
          r,
          c,
        ),
        this
      );
    },
    sph(n, o, a, r, l, s = {}) {
      return (
        t(n, new i.SphereGeometry(l, s.seg || 14, s.seg2 || 10), o, a, r, s),
        this
      );
    },
    tor(n, o, a, r, l, s, c = {}) {
      return (
        t(n, new i.TorusGeometry(l, s, c.seg2 || 8, c.seg || 40), o, a, r, c),
        this
      );
    },
    geo(n, o, a = 0, r = 0, l = 0, s = {}) {
      return (t(n, o.clone(), a, r, l, s), this);
    },
    flush(n, o = !0) {
      const a = [];
      for (const { mat: r, list: l } of e.values()) {
        const s = new i.Mesh(Qo(l), r);
        ((s.castShadow = o),
          (s.receiveShadow = !0),
          n.add(s),
          a.push(s),
          l.forEach((c) => c.dispose()));
      }
      return (e.clear(), a);
    },
  };
}
const Yt = [];
document.fonts?.ready.then(() => Yt.forEach((e) => e()));
function fn(e, t, n, o, a, r = 0.9, l = {}) {
  const s = document.createElement("canvas");
  ((s.width = n), (s.height = o));
  const c = s.getContext("2d"),
    f = new i.CanvasTexture(s);
  ((f.anisotropy = 8), (f.colorSpace = i.SRGBColorSpace));
  const h = new i.Mesh(
    new i.PlaneGeometry(e, t),
    new i.MeshBasicMaterial({
      map: f,
      alphaTest: 0.3,
      fog: !1,
      side: i.DoubleSide,
      color: new i.Color(r, r, r),
      ...l,
    }),
  );
  return (
    (h.userData = {
      c: s,
      g: c,
      t: f,
      redraw(u) {
        (c.clearRect(0, 0, n, o), u(c, n, o), (f.needsUpdate = !0));
      },
    }),
    a && (h.userData.redraw(a), Yt.push(() => h.userData.redraw(a))),
    h
  );
}
const zt = (e, t, n, o, a, r) => {
    (e.beginPath(), e.roundRect(t, n, o, a, r));
  },
  Jt = (e, t, n, o = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), n(a.getContext("2d"), e, t));
    const r = new i.CanvasTexture(a);
    return (o && (r.colorSpace = i.SRGBColorSpace), (r.anisotropy = 8), r);
  },
  oi = Jt(
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
  Ar = (e, t, n = oi) =>
    new i.MeshBasicMaterial({
      map: n,
      color: e,
      transparent: !0,
      opacity: t,
      blending: i.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function Dr(e, t = 64, n = [0, Math.PI * 2]) {
  const o = new i.LatheGeometry(
    e.map(([a, r]) => new i.Vector2(r, a)),
    t,
    n[0],
    n[1],
  );
  return (o.rotateZ(-Math.PI / 2), o);
}
function Ir(e, t) {
  return [...e, ...t.slice().reverse(), e[0]];
}
function Gr(e) {
  const t = new i.Shape(e.map(([r, l]) => new i.Vector2(r, l))),
    n = new i.ShapeGeometry(t, 1),
    o = n.clone();
  o.scale(1, -1, 1);
  const a = o.index.array;
  for (let r = 0; r < a.length; r += 3) {
    const l = a[r];
    ((a[r] = a[r + 2]), (a[r + 2] = l));
  }
  return (o.computeVertexNormals(), Qo([n.toNonIndexed(), o.toNonIndexed()]));
}
function Co(e, t, n, o, a = 60, r = 0.07) {
  const l = [],
    s = [],
    c = a * 6,
    f = 0.035,
    h = [
      [e, n],
      [e, o - r],
      [e + f, o],
      [t - f, o],
      [t, o - r],
      [t, n],
    ];
  for (let v = 0; v < h.length; v++)
    for (let d = 0; d <= c; d++) {
      const g = (d / c) * Math.PI * 2,
        S = (d % 6) / 6,
        x = S >= 0.17 && S < 0.67 ? 1 : 0,
        b = v === 2 || v === 3 ? (x ? o : o - r) : h[v][1];
      l.push(h[v][0], -Math.sin(g) * b, Math.cos(g) * b);
    }
  for (let v = 0; v < h.length - 1; v++)
    for (let d = 0; d < c; d++) {
      const g = v * (c + 1) + d,
        S = g + 1,
        x = g + c + 1,
        b = x + 1;
      s.push(g, S, x, S, b, x);
    }
  const u = new i.BufferGeometry();
  (u.setAttribute("position", new i.Float32BufferAttribute(l, 3)),
    u.setIndex(s));
  const m = u.toNonIndexed();
  return (m.computeVertexNormals(), m);
}
function Er(e, t, n, o, a) {
  const r = new i.Shape(),
    l = o * 4;
  for (let f = 0; f <= l; f++) {
    const h = (f / l) * Math.PI * 2,
      u = f % 4,
      m = u === 1 || u === 2 ? t + n : t,
      v = h + ((u === 1 ? 0.18 : u === 2 ? -0.18 : 0) * Math.PI * 2) / o,
      d = Math.cos(v) * m,
      g = Math.sin(v) * m;
    f ? r.lineTo(d, g) : r.moveTo(d, g);
  }
  const s = new i.Path();
  (s.absarc(0, 0, e, 0, Math.PI * 2, !0), r.holes.push(s));
  const c = new i.ExtrudeGeometry(r, {
    depth: a,
    bevelEnabled: !0,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 1,
    curveSegments: 64,
  });
  return (c.translate(0, 0, -a / 2), c.rotateY(Math.PI / 2), c);
}
function un(e, t = 0.3, n = 1, o = 0) {
  const a = new i.IcosahedronGeometry(e, o),
    r = a.attributes.position,
    l = re(n),
    s = new Map();
  for (let c = 0; c < r.count; c++) {
    const f =
      r.getX(c).toFixed(3) +
      "," +
      r.getY(c).toFixed(3) +
      "," +
      r.getZ(c).toFixed(3);
    s.has(f) ||
      s.set(f, [1 + (l() - 0.5) * t, 1 + (l() - 0.5) * t, 1 + (l() - 0.5) * t]);
    const h = s.get(f);
    r.setXYZ(c, r.getX(c) * h[0], r.getY(c) * h[1], r.getZ(c) * h[2]);
  }
  return (a.computeVertexNormals(), a);
}
function Wr(e, t, n, o, a, r = 0, l = {}) {
  const s = new i.Group(),
    c = W(),
    f = re(Math.floor(t * 31 + o * 17 + 99));
  c.cyl(D("#5a3f2c"), 0, 0.5 * a, 0, 0.07 * a, 0.1 * a, 1 * a, { seg: 6 });
  const h = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((u) =>
    new i.Color(u).offsetHSL(r, 0, 0).getStyle(),
  );
  for (let u = 0; u < (l.n || 5); u++)
    c.geo(
      D(h[u % 4], { flatShading: !0, roughness: 0.8 }),
      un(0.42 * a * (0.75 + f() * 0.5), 0.3, u + t * 7 + o * 3),
      (f() - 0.5) * 0.6 * a,
      (1.15 + f() * 0.7) * a,
      (f() - 0.5) * 0.6 * a,
    );
  return (c.flush(s), s.position.set(t, n, o), e.add(s), s);
}
const ni = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
    D(e, { flatShading: !0, roughness: 0.85 }),
  ),
  ai = D("#4a3527", { roughness: 0.9 });
function nt(e, t, n, o, a, r = 1, l = ni) {
  const s = re(r * 97 + 13);
  e.cyl(ai, t, n + 0.15 * a, o, 0.05 * a, 0.07 * a, 0.3 * a, { seg: 5 });
  for (let c = 0; c < 3; c++) {
    const f = (0.42 - c * 0.1) * a * (0.9 + s() * 0.2);
    e.cone(
      l[(((c + r) % 3) + 3) % 3],
      t,
      n + (0.22 + c * 0.3) * a,
      o,
      f,
      0.55 * a,
      { seg: 6 + (r % 2), ry: s() * 3 },
    );
  }
}
const si = D("#8d8aa0", { flatShading: !0, roughness: 0.75 }),
  ii = D("#eef1f8", { flatShading: !0, roughness: 0.6 });
function ma(e, t, n, o, a, r, l = 1) {
  const s = new i.ConeGeometry(a, r, 7, 3).translate(0, r / 2, 0),
    c = s.attributes.position,
    f = re(l);
  for (let u = 0; u < c.count; u++) {
    const m = c.getY(u);
    m > 0.01 &&
      m < r - 0.01 &&
      (c.setX(u, c.getX(u) * (1 + (f() - 0.5) * 0.35)),
      c.setZ(u, c.getZ(u) * (1 + (f() - 0.5) * 0.35)),
      c.setY(u, m + (f() - 0.5) * r * 0.08));
  }
  (s.computeVertexNormals(), e.geo(si, s, t, n, o));
  const h = new i.ConeGeometry(a * 0.36, r * 0.34, 7, 1).translate(
    0,
    r * 0.83 + 0.005,
    0,
  );
  e.geo(ii, h, t, n, o, { ry: l });
}
function Nr(e, t, n, o, a = 1, r = 1) {
  const l = W(),
    s = re(r * 31);
  (l
    .box(
      D("#5b4636", { roughness: 0.9 }),
      t,
      n + 0.09 * a,
      o,
      1.5 * a,
      0.18 * a,
      1 * a,
      { r: 0.02 * a },
    )
    .box(
      D("#5f8a4a", { flatShading: !0 }),
      t,
      n + 0.19 * a,
      o,
      1.46 * a,
      0.04 * a,
      0.96 * a,
    ),
    ma(l, t - 0.25 * a, n + 0.2 * a, o - 0.15 * a, 0.42 * a, 0.9 * a, r),
    ma(l, t + 0.3 * a, n + 0.2 * a, o - 0.2 * a, 0.34 * a, 0.66 * a, r + 3));
  for (let c = 0; c < 5; c++)
    nt(
      l,
      t + (s() - 0.5) * 1.2 * a,
      n + 0.2 * a,
      o + 0.1 * a + s() * 0.3 * a,
      0.5 * a * (0.8 + s() * 0.4),
      r + c,
    );
  l.flush(e);
}
const ri = Jt(
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
function li(e, t, n, o, a, r, l = 0.5) {
  const s = new i.Mesh(
    new i.PlaneGeometry(a, r),
    new i.MeshBasicMaterial({
      map: ri,
      transparent: !0,
      opacity: l,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (s.rotation.x = -Math.PI / 2),
    s.position.set(t, n + 0.004, o),
    (s.renderOrder = -1),
    e.add(s),
    Me.push(s),
    s
  );
}
const hn = Jt(1024, 512, (e, t, n) => {
    const o = e.createLinearGradient(0, 0, 0, n);
    (o.addColorStop(0, "#6f8fc4"),
      o.addColorStop(0.52, "#d9b9b4"),
      o.addColorStop(0.72, "#f3c49a"),
      o.addColorStop(1, "#8a7a78"),
      (e.fillStyle = o),
      e.fillRect(0, 0, t, n));
    const a = re(9),
      r = (l, s, c, f) => {
        ((e.fillStyle = c), e.beginPath(), e.moveTo(0, n));
        for (let h = 0; h <= t; h += 16) {
          const u = h / t;
          e.lineTo(
            h,
            l -
              s *
                (Math.abs(Math.sin(u * 5.1 + f)) * 0.7 +
                  Math.abs(Math.sin(u * 13.3 + f * 2)) * 0.3),
          );
        }
        (e.lineTo(t, n), e.fill());
      };
    (r(n * 0.6, n * 0.32, "#8d87a8", 1),
      r(n * 0.7, n * 0.2, "#6c6f8e", 2.2),
      (e.fillStyle = "#e9e6f2"));
    for (let l = 0; l < 5; l++) {
      const s = t * (0.12 + l * 0.2),
        c = n * 0.34 + a() * 20;
      (e.beginPath(),
        e.moveTo(s, c),
        e.lineTo(s - 30, c + 34),
        e.lineTo(s + 30, c + 34),
        e.fill());
    }
    for (let l = 0; l < 110; l++) {
      const s = a() * t,
        c = n * (0.72 + a() * 0.25),
        f = 10 + a() * 26;
      ((e.fillStyle = `hsl(${130 + a() * 20},${25 + a() * 15}%,${22 + a() * 12}%)`),
        e.beginPath(),
        e.moveTo(s, c - f * 2.2),
        e.lineTo(s - f * 0.6, c),
        e.lineTo(s + f * 0.6, c),
        e.fill());
    }
  }),
  ci = ["#4f7a3e", "#5f8a46", "#41693a", "#6d934f"].map((e) =>
    D(e, { flatShading: !0, roughness: 0.78 }),
  ),
  Zt = ["#7d9a3e", "#8fa845", "#6a8a36", "#9bb152"].map((e) =>
    D(e, { flatShading: !0, roughness: 0.78 }),
  );
function fi(e, t, n = 0.12) {
  const o = t / 2,
    a = 0.004 + e * 0.004,
    r = n * t,
    l = [
      [0, 0, 0],
      [o, e * 0.42, -r],
      [0, e, 0],
      [-o, e * 0.42, -r],
      [0, e * 0.45, r * 0.6],
    ],
    s = [
      [0, 1, 4],
      [4, 1, 2],
      [0, 4, 3],
      [4, 2, 3],
    ],
    c = [];
  for (const [h, u, m] of s) c.push(...l[h], ...l[u], ...l[m]);
  for (const [h, u, m] of s)
    c.push(
      l[h][0],
      l[h][1],
      l[h][2] - a,
      l[m][0],
      l[m][1],
      l[m][2] - a,
      l[u][0],
      l[u][1],
      l[u][2] - a,
    );
  const f = new i.BufferGeometry();
  return (
    f.setAttribute("position", new i.Float32BufferAttribute(c, 3)),
    f.computeVertexNormals(),
    f
  );
}
const dn = new Map(),
  ui = (e, t) => {
    const n = e.toFixed(3) + "|" + t.toFixed(3);
    return (dn.has(n) || dn.set(n, fi(e, t)), dn.get(n));
  };
function Fe(e, t, n, o, a, r = 1, l = {}) {
  const s = re(r * 53 + 7),
    c = l.n || 9,
    f = l.pal || ci;
  for (let h = 0; h < c; h++) {
    const u = (h / c) * Math.PI * 2 + s() * 0.6,
      m = (l.lean || 0.55) + s() * 0.5,
      v = a * (0.65 + s() * 0.55);
    e.geo(
      f[(((h + r) % f.length) + f.length) % f.length],
      ui(+v.toFixed(3), +(v * (l.wide || 0.34)).toFixed(3)),
      t,
      n,
      o,
      {
        dir: [
          Math.sin(m) * Math.cos(u),
          Math.cos(m),
          Math.sin(m) * Math.sin(u),
        ],
        roll: s() * Math.PI * 2,
      },
    );
  }
}
const Vo = D("#8e939e", { flatShading: !0, roughness: 0.8 }),
  hi = D("#6f7480", { flatShading: !0, roughness: 0.85 });
function at(e, t, n, o, a, r = 1, l = Vo, s = 0.72) {
  e.geo(l, un(a, 0.45, r, 0), t, n + a * s * 0.55, o, { s: [1, s, 1], ry: r });
}
const va = Jt(512, 1024, (e, t, n) => {
    const o = re(21);
    ((e.fillStyle = "#bcbdbd"), e.fillRect(0, 0, t, n));
    for (let a = 0; a < 120; a++) {
      const r = o() * t,
        l = o() * n,
        s = 20 + o() * 90,
        c = e.createRadialGradient(r, l, 0, r, l, s),
        f = o() > 0.5;
      (c.addColorStop(0, f ? "rgba(255,250,240,.10)" : "rgba(70,62,52,.10)"),
        c.addColorStop(1, "rgba(0,0,0,0)"),
        (e.fillStyle = c),
        e.fillRect(r - s, l - s, 2 * s, 2 * s));
    }
    for (let a = 0; a < 7e3; a++)
      ((e.fillStyle =
        o() > 0.5 ? "rgba(255,255,255,.08)" : "rgba(40,34,28,.09)"),
        e.fillRect(o() * t, o() * n, 1 + o() * 2, 1 + o() * 2));
    ((e.strokeStyle = "rgba(70,62,54,.42)"), (e.lineWidth = 1.3));
    for (let a = 0; a < 4; a++) {
      let r = o() * t,
        l = o() * n,
        s = 1.2 + o() * 0.8;
      (e.beginPath(), e.moveTo(r, l));
      for (let c = 0; c < 30; c++)
        ((s += (o() - 0.5) * 0.8),
          (r += Math.cos(s) * 10),
          (l += Math.sin(s) * 14),
          e.lineTo(r, l));
      e.stroke();
    }
  }),
  pn = Oe(
    new i.MeshStandardMaterial({
      color: "#e9edf2",
      map: va,
      roughness: 0.8,
      envMapIntensity: 0.5,
    }),
  ),
  xa = Oe(
    new i.MeshStandardMaterial({
      color: "#f2ece2",
      map: va,
      roughness: 0.8,
      envMapIntensity: 0.45,
    }),
  );
function Te(e, t, n, o, a = [0, 0, 1], r = 0.055, l = To) {
  const s = new i.Vector3(...a).normalize();
  e.cyl(
    l,
    t + s.x * 0.012,
    n + s.y * 0.012,
    o + s.z * 0.012,
    r * 1.35,
    r * 1.35,
    0.024,
    { dir: a, seg: 16 },
  ).cyl(l, t + s.x * 0.045, n + s.y * 0.045, o + s.z * 0.045, r, r, 0.045, {
    dir: a,
    seg: 6,
  });
}
const Y = new i.Group();
Re.add(Y);
const O = -7.6,
  Po = 11.2,
  le = 12,
  Br = (() => {
    const e = Jt(1024, 1024, (o, a, r) => {
      const l = re(3);
      ((o.fillStyle = "#978e82"), o.fillRect(0, 0, a, r));
      for (let s = 0; s < 240; s++) {
        const c = l() * a,
          f = l() * r,
          h = 30 + l() * 160,
          u = o.createRadialGradient(c, f, 0, c, f, h),
          m = l() > 0.5;
        (u.addColorStop(0, m ? "rgba(255,248,236,.06)" : "rgba(46,40,34,.07)"),
          u.addColorStop(1, "rgba(0,0,0,0)"),
          (o.fillStyle = u),
          o.fillRect(c - h, f - h, 2 * h, 2 * h));
      }
      for (let s = 0; s < 12e3; s++)
        ((o.fillStyle =
          l() > 0.5 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.055)"),
          o.fillRect(l() * a, l() * r, 1 + l() * 1.6, 1 + l() * 1.6));
      ((o.strokeStyle = "rgba(58,50,44,.34)"), (o.lineWidth = 1.1));
      for (let s = 0; s < 6; s++) {
        let c = l() * a,
          f = l() * r,
          h = l() * 6.28;
        (o.beginPath(), o.moveTo(c, f));
        for (let u = 0; u < 46; u++)
          ((h += (l() - 0.5) * 0.9),
            (c += Math.cos(h) * 8),
            (f += Math.sin(h) * 8),
            o.lineTo(c, f));
        o.stroke();
      }
      ((o.strokeStyle = "rgba(66,58,50,.5)"), (o.lineWidth = 2.2));
      for (let s = 0; s <= 2; s++)
        (o.beginPath(),
          o.moveTo((s * a) / 2, 0),
          o.lineTo((s * a) / 2, r),
          o.stroke(),
          o.beginPath(),
          o.moveTo(0, (s * r) / 2),
          o.lineTo(a, (s * r) / 2),
          o.stroke());
    });
    ((e.wrapS = e.wrapT = i.RepeatWrapping), e.repeat.set(5, 3.4));
    const t = Oe(
        new i.MeshStandardMaterial({
          map: e,
          roughness: 0.26,
          metalness: 0.05,
          envMapIntensity: 0.3,
        }),
        ra,
      ),
      n = new i.Mesh(new i.PlaneGeometry(72, 48), t);
    return (
      (n.rotation.x = -Math.PI / 2),
      n.position.set(0, 0, 4),
      (n.receiveShadow = !0),
      Y.add(n),
      Lt.push(n),
      n
    );
  })(),
  Ct = D("#34405a", { roughness: 0.66, envMapIntensity: 0.7 }),
  wa = D("#1c232e", { roughness: 0.7 }),
  pe = X("#3a414c", { roughness: 0.4 }),
  ba = [-9.6, 8.7];
{
  const e = W();
  e.box(Ct, -0.5, le / 2, O - 0.2, 19.4, le, 0.4)
    .box(Ct, 11.1, 10.3, O - 0.2, 4.8, 3.4, 0.4)
    .box(Ct, 11.1, 0.5, O - 0.2, 4.8, 1, 0.4)
    .box(Ct, -16.8, le / 2, O - 0.2, 1.2, le, 0.4)
    .box(Ct, -13.2, 10.6, O - 0.2, 6.2, 2.8, 0.4)
    .box(Ct, -13.2, 0.6, O - 0.2, 6.2, 1.2, 0.4);
  for (let a = -7.4; a <= 8; a += 2.6)
    e.box(wa, a, le / 2, O + 0.01, 0.05, le, 0.04);
  (e.box(pe, 1.4, 0.12, O + 0.08, 23.2, 0.24, 0.14),
    e.box(wa, -2, le + 0.2, -3, 34, 0.4, 12),
    e
      .box(pe, -13.2, 9.15, O + 0.05, 6.4, 0.16, 0.3)
      .box(pe, -13.2, 1.25, O + 0.05, 6.4, 0.16, 0.3)
      .box(pe, -16.3, 5.2, O + 0.05, 0.16, 8, 0.3)
      .box(pe, -13.2, 5.2, O + 0.05, 0.08, 7.9, 0.16));
  for (const a of ba) e.box(pe, a, le / 2, O + 0.12, 0.42, le, 0.24);
  e.flush(Y, !1);
  const t = new i.Mesh(new i.BoxGeometry(30, 0.06, 0.06), de("#ffb86b", 3));
  (t.position.set(-2, le - 0.35, O + 0.3), Y.add(t));
  const n = new i.Mesh(new i.BoxGeometry(23, 0.04, 0.04), de("#ffae5c", 1.5));
  (n.position.set(1.4, 0.27, O + 0.16), Y.add(n));
  for (const a of ba) {
    const r = new i.Mesh(
      new i.BoxGeometry(0.06, le - 1.2, 0.06),
      de("#ffb468", 2.8),
    );
    (r.position.set(a, le / 2, O + 0.27),
      Y.add(r),
      dt(a, 4.5, O + 1.3, "#ffb468", 4.5, 0.55));
  }
  const o = new i.Mesh(
    new i.PlaneGeometry(22, 11),
    new i.MeshBasicMaterial({
      map: hn,
      fog: !1,
      color: new i.Color(1.05, 0.98, 0.92),
    }),
  );
  (o.position.set(-14, 5.4, -15), Y.add(o));
}
function ga(e, t, n, o, a, r = Y, l = 900) {
  const s = Math.round((l * o) / n),
    c = document.createElement("canvas");
  ((c.width = l), (c.height = s));
  const f = c.getContext("2d"),
    h = new i.CanvasTexture(c);
  ((h.colorSpace = i.SRGBColorSpace), (h.anisotropy = 8));
  const u = new i.Mesh(
    new i.PlaneGeometry(n, o),
    new i.MeshBasicMaterial({
      map: h,
      transparent: !0,
      opacity: 0.97,
      fog: !1,
      color: new i.Color(1, 1.08, 1.22),
    }),
  );
  return (
    u.position.set(e, t, O + 0.16),
    r.add(u),
    dt(e, t + 0.2, O + 1.6, "#7fd6ff", 5.5, 0.32),
    (u.userData = {
      c,
      g: f,
      t: h,
      redraw(m = 0) {
        (f.clearRect(0, 0, l, s),
          (f.fillStyle = "rgba(16,34,60,.5)"),
          zt(f, 2, 2, l - 4, s - 4, 14),
          f.fill(),
          a(f, l, s, m),
          (f.strokeStyle = "rgba(150,225,255,.55)"),
          (f.lineWidth = 5),
          zt(f, 5, 5, l - 10, s - 10, 12),
          f.stroke(),
          (f.strokeStyle = "rgba(150,225,255,.9)"),
          (f.lineWidth = 2),
          zt(f, 5, 5, l - 10, s - 10, 12),
          f.stroke(),
          (h.needsUpdate = !0));
      },
    }),
    u.userData.redraw(0),
    Yt.push(() => u.userData.redraw(U)),
    u
  );
}
{
  const e = W(),
    t = D("#d8d2c7", { roughness: 0.55 }),
    n = D("#3b3530", { roughness: 0.6 });
  e.box(n, -9.7, 2.92, -5.9, 3.4, 0.14, 1.5, { r: 0.03 })
    .box(pe, -8.02, 1.5, -5.9, 0.1, 2.9, 1.4)
    .box(pe, -11.38, 1.5, -5.9, 0.1, 2.9, 1.4);
  for (let r = 0; r < 3; r++)
    (e.box(t, -10.8 + r * 1.1, 3.25, -5.8, 0.56, 0.5, 0.56, { r: 0.05 }),
      nt(e, -10.8 + r * 1.1, 3.5, -5.8, 1.45 + mo(r + 3) * 0.45, r + 4));
  (e
    .geo(xa, $t(1.9, 2, 1.9, 0.03, 2), -9.25, 1, -3.6)
    .box(Xt, -9.25, 2.08, -3.6, 1.1, 0.16, 1.1, { r: 0.03 })
    .cyl(ke, -9.25, 2.3, -3.6, 0.1, 0.14, 0.3, { seg: 12 }),
    e.geo(
      X("#a8aeb8", { roughness: 0.3, metalness: 0.9, flatShading: !0 }),
      new i.DodecahedronGeometry(0.62, 0),
      -9.25,
      2.98,
      -3.6,
      { rx: 0.4, ry: 0.6 },
    ),
    e.flush(Y));
  const o = new i.Mesh(new i.BoxGeometry(3.3, 0.04, 0.04), de("#ffb468", 2.4));
  (o.position.set(-9.7, 2.84, -5.16),
    Y.add(o),
    dt(-9.7, 2.4, -4.8, "#ffb468", 3, 0.5));
  const a = new i.Mesh(
    new i.PlaneGeometry(6, 7.8),
    new i.MeshBasicMaterial({ color: new i.Color(1.45, 1.02, 0.68), fog: !1 }),
  );
  (a.position.set(-13.2, 5.2, O - 0.35), Y.add(a));
}
{
  const e = new i.Mesh(
    new i.PlaneGeometry(30, 15),
    new i.MeshBasicMaterial({ map: hn, fog: !1, color: new i.Color(1, 1, 1) }),
  );
  ((e.rotation.y = -Math.PI / 2), e.position.set(26, 6.2, -1), Y.add(e));
  const t = new i.Mesh(
    new i.PlaneGeometry(16, 9),
    new i.MeshBasicMaterial({
      map: hn,
      fog: !1,
      color: new i.Color(0.95, 0.95, 1),
    }),
  );
  (t.position.set(14, 5.6, -16), Y.add(t));
  const n = W();
  for (const a of [-7.4, -3.2, 1, 5.2])
    n.box(pe, Po, le / 2, a, 0.16, le, 0.16);
  (n.box(pe, Po, 0.15, 0, 0.3, 0.3, 16).box(pe, Po, le - 0.2, 0, 0.3, 0.3, 16),
    n
      .box(pe, 11.1, 1.05, O + 0.05, 4.6, 0.16, 0.3)
      .box(pe, 11.1, 9.35, O + 0.05, 4.6, 0.16, 0.3)
      .box(pe, 11.1, 5.2, O + 0.05, 0.08, 8.3, 0.16),
    n.flush(Y, !1));
  const o = W();
  for (let a = 0; a < 30; a++) {
    const r = -16 + mo(a) * 24,
      l = 12 + mo(a + 0.5) * 12;
    nt(o, l, 0, r, 2 + mo(a + 0.2) * 2.6, a);
  }
  o.flush(Y);
}
{
  const e = W(),
    t = D("#d6d0c5", { roughness: 0.55 }),
    n = D("#3b3530", { roughness: 0.6 });
  e.box(n, 8.7, 2.52, -5.6, 3, 0.14, 1.4, { r: 0.03 });
  for (let l = 0; l < 2; l++)
    e.box(t, 8 + l * 1.4, 2.86, -5.5, 0.6, 0.55, 0.6, { r: 0.05 });
  (nt(e, 8, 3.12, -5.5, 1.7, 11),
    Fe(e, 9.4, 3.12, -5.5, 0.8, 12, { n: 8 }),
    e.geo(xa, $t(1.7, 1.6, 1.7, 0.03, 2), 8.45, 0.8, -2.6),
    e.flush(Y));
  const o = new i.Mesh(new i.BoxGeometry(2.9, 0.04, 0.04), de("#ffb468", 2.4));
  (o.position.set(8.7, 2.44, -4.88),
    Y.add(o),
    dt(8.7, 2.1, -4.5, "#ffb468", 3, 0.5));
  const a = W();
  (nt(a, 8.45, 1.6, -2.6, 2.2, 17),
    Fe(a, 8.1, 1.6, -2.2, 0.8, 4, { n: 7 }),
    a.flush(Y));
  const r = new i.Mesh(new i.BoxGeometry(5, 0.03, 0.05), de("#ffae5c", 2));
  (r.position.set(9.5, 0.02, 0.6), (r.rotation.y = -0.35), Y.add(r));
}
{
  const e = W(),
    t = D("#3a3f47", { roughness: 0.6 });
  (e.box(t, -6.9, 0.45, 5.4, 1.3, 0.9, 1.3, { r: 0.08 }),
    Fe(e, -6.9, 0.9, 5.4, 2.3, 31, {
      n: 13,
      lean: 0.7,
      wide: 0.4,
      pal: ["#2f5530", "#3b6437", "#284a2a", "#44703d"].map((n) =>
        D(n, { flatShading: !0, roughness: 0.8 }),
      ),
    }),
    e.flush(Y));
}
const mn = { x0: -6.2, x1: 6.2, top: 1.86 },
  Xe = new i.Group();
Re.add(Xe);
const ce = new i.Group(),
  vn = Math.hypot(0.62, mn.top - 0.3);
{
  const { x0: e, x1: t, top: n } = mn,
    o = [
      [2.12, 0.26],
      [1.5, n - 0.04],
      [1.42, n],
      [-1.72, n],
      [-1.8, n - 0.05],
      [-1.95, 0.26],
    ],
    a = new i.Shape(o.map(([m, v]) => new i.Vector2(m, v))),
    r = new i.ExtrudeGeometry(a, {
      depth: t - e,
      bevelEnabled: !0,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 2,
    });
  (r.rotateY(-Math.PI / 2), r.translate(t, 0, 0));
  const l = new i.Mesh(
    r,
    X("#30363f", { roughness: 0.4, metalness: 0.66, clearcoat: 0.35 }),
  );
  ((l.castShadow = l.receiveShadow = !0), Xe.add(l));
  const s = new i.Shape(
    [
      [2.34, 0.1],
      [1.62, n + 0.06],
      [1.5, n + 0.12],
      [-1.84, n + 0.12],
      [-1.94, n + 0.02],
      [-2.1, 0.1],
    ].map(([m, v]) => new i.Vector2(m, v)),
  );
  for (const [m, v] of [
    [e - 0.02, -1],
    [t + 0.02, 1],
  ]) {
    const d = new i.ExtrudeGeometry(s, {
      depth: 0.62,
      bevelEnabled: !0,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
    });
    (d.rotateY(-Math.PI / 2), d.translate(v > 0 ? m + 0.62 : m, 0, 0));
    const g = new i.Mesh(d, pn);
    ((g.castShadow = g.receiveShadow = !0), Xe.add(g));
  }
  const c = W();
  (c.box(
    D("#15181d", { roughness: 0.6 }),
    (e + t) / 2,
    0.1,
    0.08,
    t - e + 1.1,
    0.2,
    3.9,
  ),
    c.box(
      X("#59606b", { roughness: 0.3 }),
      (e + t) / 2,
      n + 0.02,
      -0.15,
      t - e - 0.3,
      0.05,
      2.9,
      { r: 0.02 },
    ),
    c.flush(Xe));
  const f = new i.Mesh(
    new i.BoxGeometry(t - e + 0.9, 0.05, 0.05),
    de("#ffab55", 3.2),
  );
  (f.position.set((e + t) / 2, 0.22, 2.3), Xe.add(f));
  const h = f.clone();
  (h.position.set((e + t) / 2, 0.22, -1.98), Xe.add(h));
  const u = new i.Mesh(
    new i.BoxGeometry(t - e - 0.2, 0.03, 0.03),
    de("#ffb468", 2),
  );
  (u.position.set((e + t) / 2, n - 0.03, 1.47),
    Xe.add(u),
    dt(-3.5, 0.35, 3.2, "#ffab55", 3.6, 1.25),
    dt(3.5, 0.35, 3.2, "#ffab55", 3.6, 1.25),
    dt(0, 0.3, 3.4, "#ffb468", 3.2, 0.8),
    ce.position.set(0, 0.278, 2.165),
    (ce.rotation.x = -Math.atan2(0.62, n - 0.3)),
    Xe.add(ce));
}
const ya = X("#1a1f28", {
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }),
  di = X("#2b313b", { roughness: 0.35 });
function xn(e, t, n = {}) {
  const o = n.h || vn * 0.74,
    a = n.y || vn * 0.52,
    r = W();
  (r
    .box(di, e, a, 0.005, t, o, 0.03, { r: 0.05 })
    .box(ya, e, a, 0.02, t - 0.12, o - 0.1, 0.02, { r: 0.04 }),
    r.flush(ce, !1));
  const l = fn(
    t - 0.08,
    o - 0.06,
    512,
    Math.round((512 * (o - 0.06)) / (t - 0.08)),
    (s, c, f) => {
      ((s.strokeStyle = "rgba(160,200,235,.55)"),
        (s.lineWidth = 2.2),
        zt(s, 3, 3, c - 6, f - 6, 14),
        s.stroke());
    },
    1.1,
    { alphaTest: 0.05, transparent: !0, depthWrite: !1 },
  );
  return (l.position.set(e, a, 0.033), ce.add(l), { x: e, y: a, w: t, h: o });
}
function Ma(e, t, n, o, a, r = {}) {
  const l = r.cw || 1024,
    s = Math.round((l * o) / n),
    c = document.createElement("canvas");
  ((c.width = l), (c.height = s));
  const f = c.getContext("2d"),
    h = new i.CanvasTexture(c);
  ((h.colorSpace = i.SRGBColorSpace), (h.anisotropy = 8));
  const u = new i.Mesh(
    r.geo || new i.PlaneGeometry(n, o),
    new i.MeshBasicMaterial({
      map: h,
      fog: !1,
      transparent: !!r.alpha,
      depthWrite: !r.alpha,
      color: new i.Color(r.k || 1.5, r.k || 1.5, r.k || 1.5),
    }),
  );
  return (
    u.position.set(e, t, r.z ?? 0.036),
    (r.parent || ce).add(u),
    (u.userData = {
      c,
      g: f,
      t: h,
      redraw(m = 0) {
        (f.clearRect(0, 0, l, s), a(f, l, s, m), (h.needsUpdate = !0));
      },
    }),
    u.userData.redraw(0),
    Yt.push(() => u.userData.redraw(U)),
    u
  );
}
function Ro(e, t, n, o, a = {}) {
  const r = new i.Group();
  (r.position.set(e, t, 0.03), ce.add(r));
  const l = new i.Mesh(
    new i.TorusGeometry(n * 1.02, n * 0.07, 10, 64),
    X("#9aa3b0", { roughness: 0.26, metalness: 1 }),
  );
  ((l.position.z = 0.03), r.add(l));
  const s = new i.Group();
  r.add(s);
  const c = new i.Mesh(
    new i.CylinderGeometry(n * 0.95, n * 0.97, 0.07, 48),
    ya,
  );
  ((c.rotation.x = Math.PI / 2), (c.position.z = 0.03), s.add(c));
  const f = Ma(0, 0, n * 1.9, n * 1.9, o, {
    parent: s,
    cw: a.cw || 256,
    k: a.k || 1.6,
    z: 0.068,
    alpha: !0,
    geo: new i.CircleGeometry(n * 0.95, 48),
  });
  return ((r.userData = { cap: s, scr: f, press: 0, hit: c }), r);
}
function pi(e, t, n, o = {}) {
  const a = o.color || "#6fdcff",
    r = Ma(
      (e + t) / 2,
      n,
      t - e + 0.5,
      0.62,
      (b, y, p) => {
        for (let w = 0; w < 2; w++)
          for (let z = 0; z < 26; z++) {
            const k = y * (0.03 + (0.94 * z) / 25),
              V = p * (w ? 0.82 : 0.18);
            ((b.fillStyle = "rgba(90,200,255,.22)"),
              b.beginPath(),
              b.arc(k, V, 9, 0, 7),
              b.fill(),
              (b.fillStyle = "#8fe6ff"),
              b.beginPath(),
              b.arc(k, V, 4.2, 0, 7),
              b.fill());
          }
      },
      { cw: 1600, k: 1.5, alpha: !0, z: 0.034 },
    ),
    l = W();
  (l.box(
    D("#0b0e13", { roughness: 0.5 }),
    (e + t) / 2,
    n,
    0.04,
    t - e + 0.1,
    0.07,
    0.02,
  ),
    l.flush(ce, !1));
  const s = new i.Mesh(new i.BoxGeometry(1, 0.036, 0.012), de(a, 3.2));
  (s.position.set(e, n, 0.056), ce.add(s));
  const c = new i.Color("#ff6b86").multiplyScalar(3),
    f = new i.Color(a).multiplyScalar(3.2),
    h = new i.Mesh(new i.BoxGeometry(1, 0.02, 0.01), de("#3a5a78", 1));
  (h.position.set(t, n, 0.052), ce.add(h));
  const u = new i.Mesh(
    new i.BoxGeometry(0.035, 0.26, 0.012),
    de("#ffb454", 3.4),
  );
  (u.position.set(e, n, 0.06), ce.add(u));
  const m = new i.Group(),
    v = W();
  (v
    .cyl(To, 0, 0, 0.09, 0.25, 0.26, 0.18, { rx: Math.PI / 2, seg: 44 })
    .cyl(
      X("#dfe4ec", { roughness: 0.14, metalness: 1 }),
      0,
      0,
      0.19,
      0.22,
      0.25,
      0.05,
      { rx: Math.PI / 2, seg: 44 },
    )
    .cyl(Xt, 0, 0, 0.01, 0.27, 0.27, 0.04, { rx: Math.PI / 2, seg: 44 }),
    v.flush(m));
  const d = new i.Mesh(new i.BoxGeometry(0.03, 0.36, 0.01), de(a, 3.4));
  (d.position.set(0, 0, 0.222), m.add(d));
  const g = new i.Mesh(new i.ConeGeometry(0.04, 0.07, 3), de(a, 3));
  (g.position.set(0, -0.38, 0.02),
    (g.rotation.z = Math.PI),
    m.add(g),
    m.position.set(e, n, 0.02),
    ce.add(m));
  const S = new i.Mesh(
    new i.PlaneGeometry(t - e + 0.4, 0.7),
    new i.MeshBasicMaterial({ visible: !1 }),
  );
  (S.position.set((e + t) / 2, n, 0.1), ce.add(S));
  const x = {
    a: e,
    b: t,
    y: n,
    fill: s,
    knob: m,
    hit: S,
    wl: u,
    rest: h,
    dots: r,
    t: 0,
    set(b) {
      this.t = R(b, 0, 1);
      const y = tt(e, t, this.t);
      ((m.position.x = y),
        (h.scale.x = t - e),
        (h.position.x = (e + t) / 2),
        this.fillTo());
    },
    mark(b) {
      ((this.m = b),
        (u.visible = b >= 0 && b <= 1),
        (u.position.x = tt(e, t, R(b, 0, 1))),
        this.fillTo());
    },
    fillTo() {
      const b = tt(e, t, this.t),
        y = tt(e, t, R(this.m ?? 1, 0, 1)),
        p = Math.min(b, y),
        M = Math.max(b, y);
      ((s.scale.x = Math.max(0.001, M - p)),
        (s.position.x = (p + M) / 2),
        s.material.color.copy(b <= y ? f : c));
    },
    fromRay(b) {
      const y = b.intersectObject(S, !1)[0];
      if (!y) return null;
      const p = ce.worldToLocal(y.point.clone());
      return R((p.x - e) / (t - e), 0, 1);
    },
  };
  return (x.set(0), x);
}
function Sa(e, t, n, o, a, r = 0) {
  const l = Ta(a, { pale: !0 });
  return (
    (l.material.side = i.FrontSide),
    l.position.set(t, n, o),
    (l.rotation.y = r),
    e.add(l),
    l
  );
}
const ka = [];
function mi(e, t, n, o, a, r = 128) {
  const l = "@RYANSAEL ON X",
    s = () => {
      ((e.font = `${o ? 700 : 600} ${r}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(r * 0.08) + "px"));
    };
  s();
  const c = e.measureText(l).width;
  c > t - 28 && ((r = Math.floor((r * (t - 28)) / c)), s());
  const f = t / 2 + Math.round(r * 0.04),
    h = n / 2 + r * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), o)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(l, f, h + r * 0.05),
      (e.fillStyle = a ? "#e08a24" : "#38332d"),
      e.fillText(l, f, h));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(l, f + r * 0.02, h + r * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(l, f, h - r * 0.025));
  const u = e.createLinearGradient(0, h - r * 0.7, 0, h);
  (u.addColorStop(0, "#f1d08c"),
    u.addColorStop(1, "#b3833d"),
    (e.fillStyle = u),
    e.fillText(l, f, h));
}
function Ta(e, t = {}) {
  const n = !!t.pale,
    o = t.k ?? (n ? 0.92 : 0.6);
  let a = !1;
  const r = (s, c, f) => mi(s, c, f, n, a),
    l = fn(e, e * 0.1375, 1280, 176, r, o, { alphaTest: 0.25 });
  return (
    (l.userData.mark = 1),
    Lt.push(l),
    ka.push({
      hit: l,
      over(s) {
        ((a = s),
          n
            ? l.userData.redraw(r)
            : l.material.color.setRGB(s ? 3.4 : o, s ? 2.5 : o, s ? 1.4 : o));
      },
    }),
    l
  );
}
function vi(e, t, n = 1.2, o = {}) {
  const a = Ta(n, o);
  return (a.position.set(e, t, 0.012), ce.add(a), a);
}
class xi {
  constructor(t) {
    this.max = t;
    const n = new i.BufferGeometry();
    ((this.pos = new Float32Array(t * 12)),
      (this.side = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 16)));
    const o = new Uint32Array(t * 6);
    for (let a = 0; a < t; a++) {
      const r = a * 4;
      o.set([r, r + 1, r + 2, r + 1, r + 3, r + 2], a * 6);
    }
    (n.setAttribute(
      "position",
      new i.BufferAttribute(this.pos, 3).setUsage(i.DynamicDrawUsage),
    ),
      n.setAttribute(
        "aSide",
        new i.BufferAttribute(this.side, 1).setUsage(i.DynamicDrawUsage),
      ),
      n.setAttribute(
        "aCol",
        new i.BufferAttribute(this.col, 4).setUsage(i.DynamicDrawUsage),
      ),
      n.setIndex(new i.BufferAttribute(o, 1)),
      (this.mesh = new i.Mesh(
        n,
        new i.ShaderMaterial({
          uniforms: {
            ...ua,
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
          fragmentShader: `${Js}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      ko.add(this.mesh));
  }
  setLight(t) {
    const n = this.mesh.material;
    ((n.uniforms.uLight.value = t ? 1 : 0),
      (n.blending = t ? i.NormalBlending : i.AdditiveBlending));
  }
  begin() {
    this.n = 0;
  }
  seg(t, n, o, a, r, l, s) {
    if (this.n >= this.max) return;
    const c = this.n++;
    (La.subVectors(n, t),
      za.addVectors(t, n).multiplyScalar(0.5),
      Ca.subVectors(P.position, za),
      xe.crossVectors(La, Ca).normalize());
    const f = this.pos,
      h = c * 12;
    ((f[h] = t.x - xe.x * o),
      (f[h + 1] = t.y - xe.y * o),
      (f[h + 2] = t.z - xe.z * o),
      (f[h + 3] = t.x + xe.x * o),
      (f[h + 4] = t.y + xe.y * o),
      (f[h + 5] = t.z + xe.z * o),
      (f[h + 6] = n.x - xe.x * a),
      (f[h + 7] = n.y - xe.y * a),
      (f[h + 8] = n.z - xe.z * a),
      (f[h + 9] = n.x + xe.x * a),
      (f[h + 10] = n.y + xe.y * a),
      (f[h + 11] = n.z + xe.z * a),
      this.side.set([-1, 1, -1, 1], c * 4));
    const u = this.col,
      m = c * 16;
    for (let v = 0; v < 4; v++)
      ((u[m + v * 4] = r.r),
        (u[m + v * 4 + 1] = r.g),
        (u[m + v * 4 + 2] = r.b),
        (u[m + v * 4 + 3] = v < 2 ? l : s));
  }
  line(t, n, o, a) {
    for (let r = 0; r < t.length - 1; r++) {
      const l = r / (t.length - 1),
        s = (r + 1) / (t.length - 1);
      this.seg(
        t[r],
        t[r + 1],
        ne(t[r], n),
        ne(t[r + 1], n),
        o,
        a ? a(l) : 1,
        a ? a(s) : 1,
      );
    }
  }
  end() {
    const t = this.mesh.geometry,
      n = Math.max(this.n, 1);
    t.setDrawRange(0, this.n * 6);
    for (const [o, a] of [
      ["position", 12],
      ["aSide", 4],
      ["aCol", 16],
    ]) {
      const r = t.attributes[o];
      (r.clearUpdateRanges(), r.addUpdateRange(0, n * a), (r.needsUpdate = !0));
    }
  }
}
const La = new i.Vector3(),
  za = new i.Vector3(),
  Ca = new i.Vector3(),
  xe = new i.Vector3(),
  Ae = new xi(6e3),
  ne = (e, t) =>
    ((P.position.distanceTo(e) *
      Math.tan(i.MathUtils.degToRad(P.fov / 2)) *
      2) /
      Math.max(ht.clientHeight, 1)) *
    t *
    0.5;
function wn(e = 640, t = 104) {
  const n = document.createElement("canvas");
  ((n.width = e), (n.height = t));
  const o = n.getContext("2d"),
    a = new i.CanvasTexture(n);
  ((a.colorSpace = i.SRGBColorSpace), (a.anisotropy = 4));
  const r = new i.Mesh(
    new i.PlaneGeometry(1, t / e),
    new i.MeshBasicMaterial({
      map: a,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      color: new i.Color(1.35, 1.35, 1.35),
    }),
  );
  return (
    (r.renderOrder = 10),
    (r.frustumCulled = !1),
    ko.add(r),
    (r.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 1,
      set(l, s = "", c = "#7fe3ff", f = 0) {
        const h = l + "|" + s + "|" + c + "|" + f;
        if (h === this.key) return;
        ((this.key = h),
          (this.args = [l, s, c, f]),
          o.clearRect(0, 0, e, t),
          (o.font = "600 38px Outfit, sans-serif"));
        const u = o.measureText(l).width;
        o.font = "500 30px DM Mono, monospace";
        const m = s ? o.measureText(s).width + 26 : 0,
          v = Math.min(e - 8, u + m + 84),
          d = f < 0 ? 4 : f > 0 ? e - 4 - v : (e - v) / 2;
        ((o.fillStyle = "rgba(10,14,26,.86)"),
          zt(o, d, 8, v, t - 16, (t - 16) / 2),
          o.fill(),
          (o.fillStyle = c),
          o.beginPath(),
          o.arc(d + 34, t / 2, 9, 0, 7),
          o.fill(),
          (o.fillStyle = "#f2f6ff"),
          (o.font = "600 38px Outfit, sans-serif"),
          (o.textBaseline = "middle"),
          o.fillText(l, d + 56, t / 2 + 1),
          s &&
            ((o.fillStyle = "#9fe6ff"),
            (o.font = "500 30px DM Mono, monospace"),
            o.fillText(s, d + 56 + u + 22, t / 2 + 2)),
          (a.needsUpdate = !0));
      },
    }),
    Yt.push(() => {
      const l = r.userData;
      l.args && ((l.key = ""), l.set(...l.args));
    }),
    r
  );
}
function bn(e, t, n = 24, o = 0) {
  const a = (ne(t, n) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(P.quaternion),
    e.scale.set(a, a, a),
    o &&
      e.position.addScaledVector(
        wi.set(0, 1, 0).applyQuaternion(P.quaternion),
        (o * a * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-xt * 8))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
const wi = new i.Vector3();
let Vt = !0;
const st = 9.81,
  Le = 998,
  bi = 1e-6,
  q = 101325,
  _o = 2339,
  Va = 1.2,
  Pt = 0.022,
  ee = (Math.PI * Pt * Pt) / 4,
  gn = 0.5,
  Fo = 0.35 * Math.sqrt(st * Pt),
  Pa = 0.26,
  yn = (0.62 * Math.PI * 0.004 ** 2) / 4,
  gi = 7e-5;
function Ra(e) {
  const t = (Math.abs(e) * Pt) / bi;
  if (t < 1) return 64;
  const n = 64 / t,
    o = 0.316 * t ** -0.25;
  if (t < 2300) return n;
  if (t > 4e3) return o;
  const a = (t - 2300) / 1700;
  return n * (1 - a) + o * a;
}
function Or(e, t, n, o = {}) {
  const a = [0];
  for (let f = 1; f < e.length; f++)
    a.push(a[f - 1] + Math.hypot(e[f][0] - e[f - 1][0], e[f][1] - e[f - 1][1]));
  const r = e.map((f) => f[1]),
    l = a[a.length - 1];
  let s = 0;
  for (let f = 0; f < r.length; f++) r[f] > r[s] && (s = f);
  let c = 0;
  for (let f = 1; f < e.length - 1; f++) {
    const h = e[f][0] - e[f - 1][0],
      u = e[f][1] - e[f - 1][1],
      m = e[f + 1][0] - e[f][0],
      v = e[f + 1][1] - e[f][1],
      d = (h * m + u * v) / Math.max(1e-9, Math.hypot(h, u) * Math.hypot(m, v));
    c += Math.acos(R(d, -1, 1));
  }
  return _a(a, r, t, n, c, o);
}
function _a(e, t, n, o, a, r = {}) {
  const l = e.length,
    s = e[l - 1];
  let c = 0;
  for (let h = 0; h < l; h++) t[h] > t[c] && (c = h);
  return {
    s: e,
    z: t,
    n: l,
    L: s,
    zAt: (h) => {
      if (h <= 0) return t[0];
      if (h >= s) return t[l - 1];
      let u = 0,
        m = l - 1;
      for (; m - u > 1;) {
        const d = (u + m) >> 1;
        e[d] <= h ? (u = d) : (m = d);
      }
      const v = (h - e[u]) / Math.max(1e-9, e[m] - e[u]);
      return t[u] + (t[m] - t[u]) * v;
    },
    sc: e[c],
    zc: t[c],
    Kb: (0.25 * a) / (Math.PI / 2),
    src: n,
    low: o,
    z0: t[0],
    zL: t[l - 1],
    ...r,
  };
}
class yi {
  constructor(t) {
    ((this.rig = t),
      (this.fs = 0.82),
      (this.fl = 0.42),
      (this.slugs = []),
      (this.gaps = []),
      (this.tailN = 0),
      (this.leak = 0),
      (this.leakOpen = !1),
      (this.priming = !1),
      (this.primeT = 0),
      (this.Vbd = 0),
      (this.Vcp = 0),
      (this.qAir = 0),
      (this.qSquirt = 0),
      (this.pc = q),
      (this.t = 0),
      (this.jetV = 0),
      (this.out = 0),
      (this.pumpQ = 0),
      this.fillFull());
  }
  hs() {
    const t = this.rig.src;
    return t.y0 + this.fs * t.H;
  }
  hl() {
    const t = this.rig.low;
    return t.y0 + this.fl * t.H;
  }
  full() {
    const t = this.slugs;
    return t.length === 1 && t[0].la && t[0].ra;
  }
  water() {
    let t = 0;
    for (const n of this.slugs) t += n.b - n.a;
    return t / this.rig.L;
  }
  fillFull() {
    const t = this.rig;
    ((this.slugs = [{ a: 0, b: t.L, v: 0, ph: 0, la: !0, ra: !0 }]),
      (this.gaps = []),
      (this.Vbd = 0),
      (this.Vcp = 0),
      (this.priming = !1));
    const n = this.headNow();
    let o = 0;
    for (let a = 0; a < 30; a++) {
      const r = 1 + gn + (Ra(o || 0.3) * t.L) / Pt + t.Kb;
      o = Math.sign(n) * Math.sqrt((2 * st * Math.abs(n)) / r);
    }
    this.slugs[0].v = o;
  }
  fillEmpty() {
    const t = this.rig,
      n = this.hs();
    let o = 0;
    for (let a = 1; a < t.n; a++)
      if (t.z[a] >= n) {
        const r = (n - t.z[a - 1]) / Math.max(1e-9, t.z[a] - t.z[a - 1]);
        o = t.s[a - 1] + (t.s[a] - t.s[a - 1]) * R(r, 0, 1);
        break;
      }
    ((this.slugs =
      o > 0.003 ? [{ a: 0, b: o, v: 0, ph: 0, la: !0, ra: !1 }] : []),
      (this.gaps = []),
      (this.Vbd = 0),
      (this.Vcp = 0),
      (this.priming = !1));
  }
  headNow() {
    const t = this.rig;
    return this.hs() - Math.max(t.zL, this.hl());
  }
  setRig(t) {
    const n = t.L / this.rig.L;
    for (const o of this.slugs)
      ((o.a *= n), (o.b *= n), o.la && (o.a = 0), o.ra && (o.b = t.L));
    for (const o of this.gaps) o.n *= n;
    ((this.tailN *= n), (this.rig = t));
  }
  prime() {
    if (this.full()) return !1;
    ((this.leakOpen = !1), (this.priming = !0), (this.primeT = 0));
    const t = this.slugs,
      n = this.rig,
      o = t[t.length - 1];
    return ((this.tailN = ee * (n.L - (o ? o.b : 0))), !0);
  }
  step(t) {
    const n = Math.max(1, Math.ceil(t * 480)),
      o = t / n;
    for (let a = 0; a < n; a++) this.sub(o);
  }
  pump() {
    return this.priming
      ? gi * (1 + 0.85 * Math.sin(this.primeT * 2 * Math.PI * 1.4))
      : 0;
  }
  sub(t) {
    const n = this.rig,
      o = n.L,
      a = this.slugs;
    this.t += t;
    const r = this.hs(),
      l = this.hl(),
      s = r > n.z0 + 0.002,
      c = l > n.zL + 0.002;
    (this.priming && (this.primeT += t),
      (this.leakLin = this.leakOpen
        ? Math.min(1, (this.leakLin || 0) + t / 3.6)
        : Math.max(0, (this.leakLin || 0) - t / 0.3)),
      (this.leak = this.leakLin * this.leakLin));
    const f = n.src.A * n.src.H,
      h = n.low.A * n.low.H;
    if (s && (!a.length || !a[0].la)) {
      const p = a.length ? a[0].a : o;
      p > 0.004
        ? (a.length && this.gaps.unshift({ n: ee * (p - 0.002) }),
          a.unshift({ a: 0, b: 0.002, v: 0, ph: 0, la: !0, ra: !1 }))
        : a.length && ((a[0].a = 0), (a[0].la = !0));
    }
    if (c && !this.priming && (!a.length || !a[a.length - 1].ra)) {
      const p = a.length ? a[a.length - 1].b : 0;
      o - p > 0.004
        ? (a.length && this.gaps.push({ n: ee * (o - p - 0.002) }),
          a.push({ a: o - 0.002, b: o, v: 0, ph: 0, la: !1, ra: !0 }))
        : a.length && ((a[a.length - 1].b = o), (a[a.length - 1].ra = !0));
    }
    const u = this.gaps.map((p, M) => {
        const w = ee * Math.max(1e-4, a[M + 1].a - a[M].b);
        return R((q * p.n) / w, _o, 3 * q);
      }),
      m = a[a.length - 1];
    let v = q;
    if (this.priming && (!m || !m.ra)) {
      const p = ee * Math.max(1e-4, o - (m ? m.b : 0));
      ((this.tailN = Math.max(
        0,
        this.tailN - this.pump() * t * Math.max(0.05, (q * this.tailN) / p / q),
      )),
        (v = R((q * this.tailN) / p, _o, q)));
    }
    ((this.qAir = 0), (this.qSquirt = 0));
    let d = -1;
    for (let p = 0; p < a.length; p++)
      a[p].a <= n.sc && a[p].b >= n.sc && (d = p);
    if (d < 0) {
      for (let p = 0; p < this.gaps.length; p++)
        if (a[p].b < n.sc && a[p + 1].a > n.sc) {
          const M = ee * (a[p + 1].a - a[p].b),
            w = u[p];
          if (((this.pc = w), this.leak > 0.02)) {
            const z =
                this.leak * yn * Math.sqrt((2 * Math.abs(q - w)) / Va) * t,
              k = M;
            ((this.gaps[p].n += R(k - this.gaps[p].n, -z, z)),
              w < q && (this.qAir = z / t));
          }
        }
      this.gaps.some((p, M) => a[M].b < n.sc && a[M + 1].a > n.sc) ||
        (this.pc = !m || m.b < n.sc ? v : q);
    }
    for (let p = 0; p < a.length; p++) {
      const M = a[p],
        w = Math.max(M.b - M.a, 1e-4),
        z = Math.max(w, 0.02),
        k = M.v;
      let V, E;
      (M.la
        ? (V = s
            ? q +
              Le * st * (r - n.z0) -
              (k > 0 ? 0.5 * Le * k * k * (1 + gn) : 0)
            : q)
        : (V = p > 0 ? u[p - 1] : q),
        M.ra
          ? (E = this.priming
              ? q
              : c
                ? q +
                  Le * st * (l - n.zL) -
                  (k < 0 ? 0.5 * Le * k * k * (1 + gn) : 0)
                : q)
          : (E = p < a.length - 1 ? u[p] : v));
      let ue = V - E - Le * st * (n.zAt(M.b) - n.zAt(M.a));
      const I = this.alpha(p === d);
      p === d && I > 0 && (ue += Le * st * I * (n.zAt(M.b) - n.zc));
      const oe = 0.5 * Le * ((Ra(k) * w) / Pt + (n.Kb * w) / o);
      let ve =
        (k + (t * ue) / (Le * z)) / (1 + (t * oe * Math.abs(k)) / (Le * z));
      if (
        ((M.la && M.ra) || (ve *= Math.exp(-t * 1.6)),
        this.priming && M.ra && (ve = this.pump() / ee),
        (M.acc = (ve - k) / t),
        (M.v = ve),
        (M.ph += ve * t),
        p === d)
      ) {
        const ho = n.sc - M.a;
        this.pc =
          V -
          Le * st * (n.zc - n.zAt(M.a)) -
          (ho / Math.max(w, 1e-4)) * oe * k * Math.abs(ve) -
          Le * ho * M.acc;
      }
    }
    let g = 0,
      S = 0;
    for (const p of a) {
      const M = p.v * t;
      (p.la && (p.v > 0 && !s ? (p.la = !1) : (g -= ee * M)),
        p.la || (p.a += M),
        p.ra && (p.v < 0 && !c && !this.priming ? (p.ra = !1) : (S += ee * M)),
        p.ra || (p.b += M),
        !p.la && p.a <= 0 && ((p.a = 0), (p.la = !0)),
        !p.ra && p.b >= o && ((p.b = o), (p.ra = !0)),
        p.la && (p.a = 0),
        p.ra && (p.b = o));
    }
    ((this.out = a.length && a[a.length - 1].ra ? a[a.length - 1].v : 0),
      (this.fs = R(this.fs + g / f, 0, 1)),
      (this.fl = R(this.fl + S / h, 0, 1)));
    const x = a[d];
    if (x && this.leak > 0.02) {
      const p = q - this.pc;
      if (p > 0) {
        const M = this.leak * yn * Math.sqrt((2 * p) / Va);
        ((this.qAir = M), x.v > Fo ? (this.Vbd += M * t) : (this.Vcp += M * t));
      } else this.qSquirt = this.leak * yn * Math.sqrt((2 * -p) / Le);
    }
    const b = Math.max(0.05, o - n.sc),
      y = x ? x.v : 0;
    if (x && x.ra)
      if (y > Fo) this.Vbd -= ((this.Vbd * (y - Fo)) / b) * t;
      else {
        const p = ((this.Vbd * (Fo - y)) / b) * t;
        ((this.Vbd -= p), (this.Vcp += p));
      }
    else this.Vbd *= Math.exp(-t / 0.5);
    if (x) {
      if (y > Pa) {
        const p = ((this.Vcp * (y - Pa)) / 0.08) * t;
        ((this.Vcp -= p), (this.Vbd += p));
      }
    } else this.Vcp = 0;
    if (
      ((this.Vbd = Math.max(0, Math.min(this.Vbd, ee * b * 0.6))),
      x && (this.Vcp > ee * 0.05 || this.pc < _o))
    ) {
      const p = Math.max(this.Vcp, ee * 0.01) / ee,
        M = n.sc - p / 2,
        w = n.sc + p / 2;
      if (M > x.a + 0.005 && w < x.b - 0.005) {
        const z = { a: w, b: x.b, v: x.v, ph: x.ph, la: !1, ra: x.ra };
        ((x.b = M),
          (x.ra = !1),
          a.splice(d + 1, 0, z),
          this.gaps.splice(d, 0, { n: (this.Vcp * Math.max(this.pc, _o)) / q }),
          (this.Vcp = 0));
      }
    }
    for (let p = 0; p < this.gaps.length; p++)
      if (a[p + 1].a - a[p].b < 0.0015) {
        const M = a[p],
          w = a[p + 1],
          z = M.b - M.a,
          k = w.b - w.a;
        ((M.v = (M.v * z + w.v * k) / Math.max(z + k, 1e-6)),
          (M.b = w.b),
          (M.ra = w.ra),
          a.splice(p + 1, 1),
          this.gaps.splice(p, 1),
          p--);
      }
    for (let p = 0; p < a.length; p++) {
      const M = a[p];
      if (M.b - M.a < 0.002 && !(M.la && M.ra)) {
        if ((M.la && s && M.v >= 0) || (M.ra && c && M.v <= 0 && !this.priming))
          continue;
        (p > 0 && p < a.length - 1
          ? ((this.gaps[p - 1].n += this.gaps[p].n), this.gaps.splice(p, 1))
          : p === 0 && this.gaps.length
            ? this.gaps.shift()
            : p === a.length - 1 &&
              this.gaps.length &&
              ((this.tailN = this.gaps[this.gaps.length - 1].n),
              this.gaps.pop()),
          a.splice(p, 1),
          p--);
      }
    }
    (this.priming && this.full() && (this.priming = !1),
      this.priming && this.primeT > 14 && (this.priming = !1));
  }
  alpha(t) {
    const n = this.rig;
    return t ? R(this.Vbd / (ee * Math.max(0.05, n.L - n.sc)), 0, 0.6) : 0;
  }
  flowLmin() {
    return this.out * ee * 6e4;
  }
}
const H = 0.1,
  Qt = `float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){float fi=float(i);q=q*1.63+vec2(sin(q.y*.9+t*.62+fi*1.3),cos(q.x*1.1-t*.53+fi*2.1))*.85;
 float d=abs(sin(q.x)*cos(q.y));c+=.05/(d+.05);}return clamp(c/3.-.42,0.,1.6);}`,
  Fa = Object.assign(
    (e) => {
      e.fragmentShader = e.fragmentShader.replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
 {float fr=pow(1.-saturate(abs(dot(normal,normalize(vViewPosition)))),4.);gl_FragColor.a=clamp(gl_FragColor.a+fr*.32,0.,1.);gl_FragColor.rgb+=fr*vec3(.1,.18,.24);}`,
      );
    },
    { key: "glass" },
  ),
  pt = Oe(
    new i.MeshPhysicalMaterial({
      color: "#dff4ff",
      roughness: 0.06,
      metalness: 0,
      transparent: !0,
      opacity: 0.035,
      envMapIntensity: 0.55,
      depthWrite: !1,
    }),
    Fa,
  ),
  Mi = Oe(
    new i.MeshPhysicalMaterial({
      color: "#e2f6ff",
      roughness: 0.08,
      metalness: 0,
      transparent: !0,
      opacity: 0.05,
      envMapIntensity: 1.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.05,
    }),
    Fa,
  ),
  Si = Object.assign(
    (e) => {
      e.fragmentShader = e.fragmentShader.replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
 {float fr=pow(1.-saturate(abs(dot(normal,normalize(vViewPosition)))),2.2);gl_FragColor.a=clamp(gl_FragColor.a+fr*.55,0.,.8);gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(.34,.44,.52),fr*.75);}`,
      );
    },
    { key: "glassS" },
  ),
  Aa = Oe(
    new i.MeshPhysicalMaterial({
      color: "#eef8ff",
      roughness: 0.05,
      metalness: 0,
      transparent: !0,
      opacity: 0.04,
      envMapIntensity: 0.7,
      clearcoat: 0.3,
      clearcoatRoughness: 0.05,
      depthWrite: !1,
    }),
    Si,
  ),
  mt = de("#a9e4f7", 1),
  Ur = D("#cfe8f2", { roughness: 0.15, metalness: 0.1, envMapIntensity: 1.4 }),
  te = X("#c79a4a", { roughness: 0.27, metalness: 1, clearcoat: 0.5 }),
  it = X("#8f6a2e", { roughness: 0.35, metalness: 1 });
function ki(e, t, n) {
  let o;
  if (e === "box")
    o = new i.BoxGeometry(t, 1, n, 22, 1, 13)
      .translate(0, 0.5, 0)
      .toNonIndexed();
  else {
    const l = t / 2,
      s = new i.RingGeometry(0.001, l, 48, 9)
        .rotateX(-Math.PI / 2)
        .translate(0, 1, 0)
        .toNonIndexed(),
      c = new i.CylinderGeometry(l, l, 1, 48, 1, !0)
        .translate(0, 0.5, 0)
        .toNonIndexed(),
      f = new i.CircleGeometry(l, 48).rotateX(Math.PI / 2).toNonIndexed();
    o = Qo([s, c, f]);
  }
  const a = o.attributes.position,
    r = new Float32Array(a.count);
  for (let l = 0; l < a.count; l++) r[l] = a.getY(l) > 0.5 ? 1 : 0;
  return (o.setAttribute("aTop", new i.BufferAttribute(r, 1)), o);
}
const Da = `attribute float aTop;uniform float uLevel,uFloor,uT,uAmp;uniform vec4 uImp;uniform vec2 uCtr;varying vec3 vW;varying float vTop;varying vec3 vNrm;
float wv(vec2 p){vec2 q=p-uCtr;float w=sin(q.x*2.3+uT*1.9)*.5+sin(q.y*3.1-uT*1.4+q.x*.7)*.32+sin((q.x-q.y)*4.7+uT*2.6)*.18;
 float r=length(p-uImp.xy);w+=uImp.z*(sin(r*10.-uT*11.)*exp(-r*1.3)*1.5-exp(-r*r*16.)*1.1);return w*uAmp;}
void main(){vec4 wp=modelMatrix*vec4(position,1.);float top=step(.5,aTop);wp.y=mix(uFloor,uLevel+wv(wp.xz),top);
 vW=wp.xyz;vTop=top*step(.5,normal.y);vNrm=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*wp;}`;
function Ti(e) {
  const t = {
      uLevel: { value: 1 },
      uFloor: { value: 0 },
      uT: { value: 0 },
      uAmp: { value: 0.012 },
      uImp: { value: new i.Vector4(0, 0, 0, 0) },
      uCtr: { value: new i.Vector2() },
      uHalf: { value: new i.Vector2(1, 1) },
      uShape: { value: e.shape === "box" ? 0 : 1 },
      uLight: { value: 0 },
      uDeep: { value: new i.Color(0.012, 0.1, 0.36) },
      uShal: { value: new i.Color(0.03, 0.34, 0.92) },
    },
    n = new i.ShaderMaterial({
      uniforms: t,
      side: i.BackSide,
      vertexShader: Da,
      fragmentShader: `uniform float uLevel,uFloor,uT,uLight;uniform vec3 uDeep,uShal;varying vec3 vW;varying float vTop;varying vec3 vNrm;${Qt}
  void main(){float D=max(uLevel-uFloor,.01),dep=clamp((uLevel-vW.y)/D,0.,1.);vec3 c=mix(uShal*1.25,uDeep,pow(dep,.6));
   float k=caus(vW.xz*1.35+vec2(vW.y*.45,-vW.y*.3),uT*.9);k=k*k*1.4;c+=mix(vec3(.18,.72,1.2),vec3(.3,.6,.9),uLight)*k*(.16+.55*(1.-dep))*(1.-.45*uLight);
   c+=vec3(.2,.65,1.)*smoothstep(.25,0.,uLevel-vW.y)*.35;
   float sx=vW.x+vW.z*.6+vW.y*.18,sh=vn(vec2(sx*2.2+uT*.18,uT*.1))*vn(vec2((sx-vW.z*1.6)*5.1-uT*.25,1.7));c+=vec3(.25,.7,1.15)*smoothstep(.3,.8,sh)*(1.-dep)*(1.-dep)*(1.-.6*uLight)*.24;gl_FragColor=vec4(max(c,0.),1.);}`,
    }),
    o = new i.ShaderMaterial({
      uniforms: t,
      side: i.FrontSide,
      transparent: !0,
      depthWrite: !1,
      vertexShader: Da,
      fragmentShader: `uniform float uLevel,uFloor,uT,uLight,uAmp,uShape;uniform vec3 uDeep,uShal;uniform vec4 uImp;uniform vec2 uCtr,uHalf;
  varying vec3 vW;varying float vTop;varying vec3 vNrm;${Qt}
  float wv(vec2 p){vec2 q=p-uCtr;float w=sin(q.x*2.3+uT*1.9)*.5+sin(q.y*3.1-uT*1.4+q.x*.7)*.32+sin((q.x-q.y)*4.7+uT*2.6)*.18;
   float r=length(p-uImp.xy);w+=uImp.z*(sin(r*10.-uT*11.)*exp(-r*1.3)*1.5-exp(-r*r*16.)*1.1);return w*uAmp;}
  void main(){vec3 V=normalize(cameraPosition-vW);
   if(vTop>.5){float e=.03,h0=wv(vW.xz),hx=wv(vW.xz+vec2(e,0.)),hz=wv(vW.xz+vec2(0.,e));
    vec3 n=normalize(vec3(-(hx-h0)/e,1.,-(hz-h0)/e)+vec3(vn(vW.xz*9.+uT*1.3)-.5,0.,vn(vW.zx*9.-uT*1.1)-.5)*.12);
    float fr=.05+.95*pow(1.-max(dot(n,V),0.),5.);vec3 R=reflect(-V,n);
    vec3 env=mix(vec3(.05,.07,.12),vec3(.2,.26,.38),smoothstep(-.2,.6,R.y));env+=vec3(1.5,.85,.42)*smoothstep(.55,.95,R.x)*smoothstep(.4,0.,abs(R.y-.12));
    env+=vec3(.55,.9,1.3)*pow(max(dot(R,normalize(vec3(-.25,.45,-.85))),0.),24.)*1.3;
    env=mix(env,vec3(.95,.93,.9)+vec3(.15)*smoothstep(0.,.8,R.y),uLight);
    vec2 q=vW.xz-uCtr;float dw=uShape<.5?min(uHalf.x-abs(q.x),uHalf.y-abs(q.y)):uHalf.x-length(q);float men=smoothstep(.07,0.,dw);
    float r=length(vW.xz-uImp.xy),foam=uImp.z*smoothstep(.55,0.,r)*(.45+.55*vn(vW.xz*13.+uT*4.));
    vec3 body=uShal*(.75+.6*caus(vW.xz*1.7,uT));
    vec3 c=mix(body,env,fr*.85)+vec3(.6,.9,1.05)*(men*.6+foam*1.3)+vec3(.5,.85,1.1)*pow(max(dot(reflect(-V,n),normalize(vec3(.35,.55,.75))),0.),60.)*1.6*(1.-uLight*.5);
    gl_FragColor=vec4(max(c,0.),clamp(.42+fr*.5+men*.3+foam*.5,0.,1.));}
   else{float D=max(uLevel-uFloor,.01),dep=clamp((uLevel-vW.y)/D,0.,1.),fr=pow(1.-abs(dot(normalize(vNrm),V)),3.);
    float band=smoothstep(.12,0.,abs(uLevel-vW.y-.04));float spark=smoothstep(.7,1.,vn(vec2(vW.x*9.+uT*2.,vW.y*3.)))*band;
    vec3 c=mix(uShal*.95,uDeep,dep*.8)+vec3(.45,.85,1.1)*band*1.1+vec3(1.)*spark*.8+uShal*caus(vW.xy*1.6,uT*.8)*.3;
    gl_FragColor=vec4(max(c,0.),clamp(.26+.3*dep+band*.4+fr*.2,0.,.95));}}`,
    });
  return { U: t, back: n, front: o };
}
const Mn = new Map();
function Li(e, t) {
  const n = e.uuid + "|" + t.id;
  if (Mn.has(n)) return Mn.get(n);
  const o = e.clone();
  return (
    (o.onBeforeCompile = (a) => {
      (Object.assign(a.uniforms, {
        uFakePos: ot.pos,
        uFakeCol: ot.col,
        uSat: an,
        uWL: t.uLevel,
        uWT: t.uT,
        uWF: t.uFloor,
      }),
        (a.vertexShader = a.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vUwP;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
vUwP=(modelMatrix*vec4(transformed,1.)).xyz;`,
          )),
        (a.fragmentShader = a.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` +
              ta +
              "uniform float uWL,uWT,uWF;varying vec3 vUwP;" +
              Qt,
          )
          .replace("#include <lights_fragment_end>", oa)
          .replace(
            "#include <opaque_fragment>",
            `{float und=smoothstep(uWL+.01,uWL-.03,vUwP.y);float d=clamp((uWL-vUwP.y)/max(uWL-uWF,.2),0.,1.);
    vec3 wc=outgoingLight*vec3(.7,.92,1.08)*(1.-.25*d)+vec3(.0,.07,.22)*(.2+.35*d)+vec3(.15,.55,1.)*caus(vUwP.xz*1.35+vec2(vUwP.y*.45,-vUwP.y*.3),uWT*.9)*.35*(1.-d*.6);
    outgoingLight=mix(outgoingLight,wc,und);}
   ` + na,
          )));
    }),
    (o.customProgramCacheKey = () => tn + "uw"),
    Mn.set(n, o),
    o
  );
}
function rt(e, t) {
  const n = new i.Group();
  (n.position.set(t.cx, 0, t.cz), e.add(n));
  const o = t.t || 0.07,
    a = t.H,
    r = t.y0,
    l = [];
  if (t.shape === "box") {
    const m = t.w,
      v = t.d,
      d = m + 2 * o,
      g = v + 2 * o,
      S = W();
    (S.box(pt, 0, r - o / 2, 0, d, o, g)
      .box(pt, 0, r + a / 2, v / 2 + o / 2, d, a, o)
      .box(pt, 0, r + a / 2, -v / 2 - o / 2, d, a, o)
      .box(pt, m / 2 + o / 2, r + a / 2, 0, o, a, v)
      .box(pt, -m / 2 - o / 2, r + a / 2, 0, o, a, v),
      S.flush(n, !1).forEach((z) => {
        ((z.renderOrder = 3), Me.push(z), l.push(z));
      }));
    const b = W(),
      y = 0.034,
      p = 0.004,
      M = r + a + p,
      w = r - o - p;
    for (const z of [-1, 1])
      for (const k of [-1, 1])
        b.box(
          mt,
          z * (d / 2 - y / 2 + p),
          (M + w) / 2,
          k * (g / 2 - y / 2 + p),
          y,
          M - w,
          y,
        );
    for (const z of [-1, 1])
      b.box(mt, 0, M - y / 2, z * (g / 2 - y / 2 + p), d + 2 * p, y, y).box(
        mt,
        0,
        w + y / 2,
        z * (g / 2 - y / 2 + p),
        d + 2 * p,
        y,
        y,
      );
    for (const z of [-1, 1])
      b.box(mt, z * (d / 2 - y / 2 + p), M - y / 2, 0, y, y, g + 2 * p).box(
        mt,
        z * (d / 2 - y / 2 + p),
        w + y / 2,
        0,
        y,
        y,
        g + 2 * p,
      );
    b.flush(n, !1).forEach((z) => (z.castShadow = !1));
  } else {
    const m = t.w / 2,
      v = m + o,
      d = t.tb || 0.16,
      g = t.glass || pt,
      S = [
        [v, r - d + 0.06],
        [v, r + a - 0.02],
        [v - 0.012, r + a + 0.035],
        [m + 0.012, r + a + 0.035],
        [m, r + a - 0.02],
        [m, r + 0.04],
      ],
      x = new i.Mesh(
        new i.LatheGeometry(
          S.map(([M, w]) => new i.Vector2(M, w)),
          72,
        ),
        g,
      );
    ((x.renderOrder = 3), n.add(x), Me.push(x), l.push(x));
    const b = new i.Mesh(
      new i.CylinderGeometry(v - 0.02, v - 0.05, d, 72, 1),
      g,
    );
    ((b.position.y = r - d / 2),
      (b.renderOrder = 3),
      n.add(b),
      Me.push(b),
      l.push(b));
    const y = new i.Mesh(
      new i.TorusGeometry(m + o / 2, 0.03, 8, 72),
      t.edge || mt,
    );
    ((y.rotation.x = Math.PI / 2), (y.position.y = r + a + 0.03), n.add(y));
    const p = new i.Mesh(
      new i.TorusGeometry(v - 0.03, 0.028, 8, 72),
      t.edge || mt,
    );
    ((p.rotation.x = Math.PI / 2), (p.position.y = r - d + 0.03), n.add(p));
  }
  const s = Ti(t),
    c = ki(t.shape, t.w - 0.012, (t.d || t.w) - 0.012);
  s.U.id = rt.n = (rt.n || 0) + 1;
  const f = new i.Mesh(c, s.back),
    h = new i.Mesh(c, s.front);
  return (
    (f.frustumCulled = h.frustumCulled = !1),
    (h.renderOrder = 2),
    n.add(f, h),
    Me.push(h, f),
    s.U.uHalf.value.set(
      (t.shape === "box", t.w / 2),
      t.shape === "box" ? t.d / 2 : t.w / 2,
    ),
    {
      grp: n,
      o: t,
      U: s.U,
      wb: f,
      wf: h,
      glass: l,
      submerge(m) {
        for (const v of m)
          v.material &&
            !v.material.isShaderMaterial &&
            (v.material = Li(v.material, s.U));
      },
      set(m, v, d, g = 0) {
        const S = n.position.y + g;
        ((this.U.uFloor.value = r + S + 0.012),
          (this.U.uLevel.value = Math.max(r + S + 0.02, m)),
          (this.U.uT.value = v),
          this.U.uCtr.value.set(n.position.x, n.position.z));
        const x = m > r + S + 0.006;
        ((f.visible = h.visible = x), d && this.U.uImp.value.copy(d));
      },
    }
  );
}
class Ia {
  constructor(t, n, o, a, r = {}) {
    ((this.N = t), (this.R = n), (this.r = o));
    const l = t * (n + 1),
      s = new i.BufferGeometry();
    ((this.pos = new Float32Array(l * 3)),
      (this.nor = new Float32Array(l * 3)),
      (this.aS = new Float32Array(l)),
      (this.aUp = new Float32Array(l)),
      (this.aAng = new Float32Array(l)));
    const c = [];
    for (let f = 0; f < t - 1; f++)
      for (let h = 0; h < n; h++) {
        const u = f * (n + 1) + h,
          m = u + 1,
          v = u + n + 1,
          d = v + 1;
        c.push(u, m, v, m, d, v);
      }
    (s.setIndex(c),
      s.setAttribute("position", new i.BufferAttribute(this.pos, 3)),
      s.setAttribute("normal", new i.BufferAttribute(this.nor, 3)),
      s.setAttribute("aS", new i.BufferAttribute(this.aS, 1)),
      s.setAttribute("aUp", new i.BufferAttribute(this.aUp, 1)),
      s.setAttribute("aAng", new i.BufferAttribute(this.aAng, 1)),
      (this.mesh = new i.Mesh(s, a)),
      (this.mesh.frustumCulled = !1),
      (this.geo = s));
  }
  update(t, n) {
    const { N: o, R: a, r } = this,
      l = zi,
      s = Ci,
      c = Vi;
    for (let f = 0; f < o; f++) {
      const h = t[Math.max(0, f - 1)],
        u = t[Math.min(o - 1, f + 1)];
      (l.subVectors(u, h).normalize(),
        f === 0 && (s.set(0, 1, 0), Math.abs(l.y) > 0.9 && s.set(1, 0, 0)),
        s.addScaledVector(l, -s.dot(l)).normalize(),
        c.crossVectors(l, s).normalize());
      for (let m = 0; m <= a; m++) {
        const v = (m / a) * Math.PI * 2,
          d = Math.cos(v),
          g = Math.sin(v),
          S = f * (a + 1) + m,
          x = s.x * d + c.x * g,
          b = s.y * d + c.y * g,
          y = s.z * d + c.z * g;
        ((this.pos[S * 3] = t[f].x + x * r),
          (this.pos[S * 3 + 1] = t[f].y + b * r),
          (this.pos[S * 3 + 2] = t[f].z + y * r),
          (this.nor[S * 3] = x),
          (this.nor[S * 3 + 1] = b),
          (this.nor[S * 3 + 2] = y),
          (this.aS[S] = n[f]),
          (this.aUp[S] = b / Math.max(1e-4, Math.hypot(x, b, y))),
          (this.aAng[S] = m / a));
      }
    }
    for (const f of ["position", "normal", "aS", "aUp", "aAng"])
      this.geo.attributes[f].needsUpdate = !0;
    this.geo.computeBoundingSphere();
  }
}
const zi = new i.Vector3(),
  Ci = new i.Vector3(),
  Vi = new i.Vector3(),
  Pi = () => ({
    uSl0: { value: new i.Vector4() },
    uSl1: { value: new i.Vector4() },
    uSl2: { value: new i.Vector4() },
    uLm: { value: 1 },
    uSc: { value: 0.5 },
    uAlpha: { value: 0 },
    uPk: { value: new i.Vector4() },
    uT: { value: 0 },
    uBubIn: { value: 0 },
    uLight: { value: 0 },
    uPrime: { value: 0 },
  });
function Ri(e) {
  return new i.ShaderMaterial({
    uniforms: e,
    vertexShader: `attribute float aS,aUp,aAng;varying float vS,vUp,vAng;varying vec3 vN,vW;
  void main(){vS=aS;vUp=aUp;vAng=aAng;vN=normalize(mat3(modelMatrix)*normal);vec4 wp=modelMatrix*vec4(position,1.);vW=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader: `uniform vec4 uSl0,uSl1,uSl2,uPk;uniform float uLm,uSc,uAlpha,uT,uBubIn,uLight,uPrime;varying float vS,vUp,vAng;varying vec3 vN,vW;${Qt}
  float inSl(vec4 S,float s){if(S.w<.5)return 0.;float a=S.x<1e-4?-1.:S.x,b=S.y>uLm-1e-4?uLm+1.:S.y;return smoothstep(a-.003,a+.003,s)*(1.-smoothstep(b-.003,b+.003,s));}
  void main(){float s=vS;float w=max(max(inSl(uSl0,s),inSl(uSl1,s)),inSl(uSl2,s));
   if(uPk.z>0.){float inP=smoothstep(uPk.x-.008,uPk.x+.008,s)*(1.-smoothstep(uPk.y-.008,uPk.y+.008,s));if(inP>.5&&vUp>1.-2.*uPk.z)w=0.;}
   if(w<.5)discard;
   float ph=uSl0.z;if(uSl1.w>.5&&s>=uSl1.x-.004)ph=uSl1.z;if(uSl2.w>.5&&s>=uSl2.x-.004)ph=uSl2.z;
   float u=s-ph;
   // streaks: noise stretched along the flow, carried at the water's speed
   float st=vn(vec2(u*34.,vAng*7.))*.6+vn(vec2(u*83.+3.,vAng*13.))*.4;st=smoothstep(.45,.95,st);
   vec3 V=normalize(cameraPosition-vW),N=normalize(vN);float rim=pow(1.-abs(dot(N,V)),2.);
   // a round column of water: deep and saturated through the middle, bright where light bends round its edge, a specular line along the top
   vec3 c=mix(vec3(.05,.42,1.05),vec3(.55,.95,1.4),rim*.95)+vec3(.5,.9,1.2)*st*.8;
   float spec=pow(max(dot(reflect(-V,N),normalize(vec3(-.3,1.,.45))),0.),26.);c+=vec3(.85,.95,1.05)*spec*1.1;
   // bubbles riding the long leg (they lag the water: they try to rise), and the stream breaking off the crest when air leaks in
   float dens=(s>uSc?uAlpha*1.5:0.)+uBubIn*exp(-max(s-uSc,0.)/.07)*step(uSc-.01,s)*1.2;
   // two layers of bubbles on cells that are round in real millimetres (5 mm and 9 mm): a thin bright rim, a highlight, a paler inside
   for(int L=0;L<2;L++){vec2 sc=L==0?vec2(200.,14.):vec2(110.,8.);vec2 cell=vec2((u+uT*.16)*sc.x,vAng*sc.y);vec2 id=floor(cell)+float(L)*37.,f=fract(cell)-.5;
    if(h21(id)<dens*(L==0?.9:.45)){vec2 j=(vec2(h21(id+7.1),h21(id+3.3))-.5)*.4;float rr=.14+.24*h21(id+1.7),d=length(f-j);
     float ring=smoothstep(rr,rr-.05,d)*(1.-smoothstep(rr-.06,rr-.14,d));float fill=smoothstep(rr,rr-.02,d);float hi=smoothstep(.05,0.,length(f-j-vec2(-.3,.3)*rr));
     c=mix(c,c*1.12+vec3(.08,.1,.12),fill*.5);c+=vec3(.75,.9,1.)*(ring*.9+hi*1.2);}}
   c*=mix(1.,.8,uLight);c+=vec3(.3,.6,.9)*uPrime*.25;
   gl_FragColor=vec4(max(c,0.),1.);}`,
  });
}
function _i(e) {
  const t = new i.CylinderGeometry(1, 1, 1, 16, 26, !0).translate(0, -0.5, 0),
    n = {
      uTip: { value: new i.Vector3() },
      uLen: { value: 1 },
      uR0: { value: 0.1 },
      uV0: { value: 0.5 },
      uT: { value: 0 },
      uOn: { value: 0 },
      uLight: { value: 0 },
    },
    o = new i.Mesh(
      t,
      new i.ShaderMaterial({
        uniforms: n,
        transparent: !0,
        depthWrite: !0,
        vertexShader: `uniform vec3 uTip;uniform float uLen,uR0,uV0,uT,uOn;varying float vT;varying vec3 vW,vN;
  void main(){float t=-position.y;float drop=t*uLen*.1;float v=sqrt(uV0*uV0+19.62*drop);float r=uR0*pow(uV0*uV0/max(v*v,1e-4),.25)*uOn;
   vec3 p=uTip+vec3(position.x*r,-t*uLen,position.z*r);p.x+=sin(t*9.+uT*23.)*.012*t;p.z+=cos(t*7.-uT*19.)*.01*t;vT=t;vN=vec3(position.x,0.,position.z);vW=p;
   gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
        fragmentShader: `uniform float uT,uV0,uLen,uOn,uLight;varying float vT;varying vec3 vW,vN;${Qt}
   void main(){if(uOn<.02)discard;vec3 V=normalize(cameraPosition-vW);float rim=pow(1.-abs(dot(normalize(vN),V)),2.);
    float u=vT*uLen*1.2-uT*(uV0*10.+4.);float st=smoothstep(.4,.95,vn(vec2(u*6.,atan(vN.z,vN.x)*2.)));
    float air=smoothstep(.3,1.,vn(vec2(u*11.,atan(vN.z,vN.x)*3.)))*smoothstep(.0,.35,vT);
    vec3 c=mix(vec3(.3,.78,1.3),vec3(.95,1.05,1.35),clamp(rim*.7+st*.5+air*.7,0.,1.))*mix(1.,.72,uLight);
    gl_FragColor=vec4(c,clamp(.68+rim*.3+st*.2+air*.2,0.,1.)*uOn);}`,
      }),
    );
  return (
    (o.frustumCulled = !1),
    (o.renderOrder = 1),
    e.add(o),
    Me.push(o),
    { m: o, U: n }
  );
}
function Ga(e, t, n, o) {
  const a = new i.InstancedMesh(n, o, t);
  return (
    (a.frustumCulled = !1),
    (a.count = 0),
    e.add(a),
    {
      im: a,
      n: t,
      p: new Float32Array(t * 3),
      v: new Float32Array(t * 3),
      life: new Float32Array(t),
      size: new Float32Array(t),
      box: null,
      alive: 0,
      acc: 0,
    }
  );
}
const Ye = Ga(
    Re,
    140,
    new i.IcosahedronGeometry(1, 1),
    new i.ShaderMaterial({
      transparent: !0,
      depthWrite: !1,
      uniforms: {
        uLight: { value: 0 },
        color: { value: new i.Color(0.62, 0.95, 1.25) },
      },
      vertexShader:
        "varying vec3 vN,vW;void main(){vN=normalize(mat3(modelMatrix*instanceMatrix)*normal);vec4 wp=modelMatrix*instanceMatrix*vec4(position,1.);vW=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}",
      fragmentShader: `uniform float uLight;uniform vec3 color;varying vec3 vN,vW;void main(){vec3 V=normalize(cameraPosition-vW),N=normalize(vN);float rim=pow(1.-abs(dot(N,V)),1.5);float sp=pow(max(dot(reflect(-V,N),normalize(vec3(-.3,1.,.5))),0.),20.);
  gl_FragColor=vec4(color*(.45+rim*.9)+vec3(1.)*sp*1.2,.45+rim*.5);}`,
    }),
  ),
  ze = Ga(
    Re,
    190,
    new i.IcosahedronGeometry(1, 1),
    new i.ShaderMaterial({
      transparent: !0,
      depthWrite: !1,
      uniforms: { uLight: { value: 0 } },
      vertexShader:
        "varying vec3 vN,vW;void main(){vN=normalize(mat3(modelMatrix*instanceMatrix)*normal);vec4 wp=modelMatrix*instanceMatrix*vec4(position,1.);vW=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}",
      fragmentShader: `uniform float uLight;varying vec3 vN,vW;void main(){vec3 V=normalize(cameraPosition-vW);float rim=pow(1.-abs(dot(normalize(vN),V)),1.6);
  gl_FragColor=vec4(mix(vec3(.75,.95,1.2),vec3(.95,1.,1.05),uLight)*(.35+rim*1.1),.18+rim*.75);}`,
    }),
  );
((Ye.im.renderOrder = 1), (ze.im.renderOrder = 1), Me.push(ze.im, Ye.im));
const Ao = new i.Matrix4(),
  Ea = new i.Quaternion(),
  Wa = new i.Vector3(),
  Na = new i.Vector3();
function Do(e, t, n, o, a, r, l, s, c) {
  let f = -1;
  for (let h = 0; h < e.n; h++)
    if (e.life[h] <= 0) {
      f = h;
      break;
    }
  f < 0 ||
    ((e.p[f * 3] = t),
    (e.p[f * 3 + 1] = n),
    (e.p[f * 3 + 2] = o),
    (e.v[f * 3] = a),
    (e.v[f * 3 + 1] = r),
    (e.v[f * 3 + 2] = l),
    (e.life[f] = s),
    (e.size[f] = c));
}
function Fi(e, t, n) {
  let o = 0;
  for (let a = 0; a < e.n; a++) {
    if (
      e.life[a] <= 0 ||
      ((e.life[a] -= t),
      (e.v[a * 3 + 1] -= 98.1 * t),
      (e.p[a * 3] += e.v[a * 3] * t),
      (e.p[a * 3 + 1] += e.v[a * 3 + 1] * t),
      (e.p[a * 3 + 2] += e.v[a * 3 + 2] * t),
      e.v[a * 3 + 1] < 0 && e.p[a * 3 + 1] < n && (e.life[a] = 0),
      e.life[a] <= 0)
    )
      continue;
    const r = e.size[a] * Math.min(1, e.life[a] * 8);
    (Ao.compose(
      Na.set(e.p[a * 3], e.p[a * 3 + 1], e.p[a * 3 + 2]),
      Ea,
      Wa.set(r, r * 1.25, r),
    ),
      e.im.setMatrixAt(o++, Ao));
  }
  ((e.im.count = o), (e.im.instanceMatrix.needsUpdate = !0));
}
function Ai(e, t, n, o, a) {
  let r = 0;
  for (let l = 0; l < e.n; l++) {
    if (e.life[l] <= 0) continue;
    e.life[l] -= t;
    const s = 1 - Math.exp(-t * 5);
    if (
      ((e.v[l * 3] += (0 - e.v[l * 3]) * s),
      (e.v[l * 3 + 2] += (0 - e.v[l * 3 + 2]) * s),
      (e.v[l * 3 + 1] +=
        (2.4 * (1 + e.size[l] * 6) - e.v[l * 3 + 1]) * s * 0.9),
      (e.p[l * 3] += (e.v[l * 3] + Math.sin(a * 9 + l) * 0.25) * t),
      (e.p[l * 3 + 1] += e.v[l * 3 + 1] * t),
      (e.p[l * 3 + 2] +=
        (e.v[l * 3 + 2] + Math.cos(a * 8 + l * 1.7) * 0.2) * t),
      o &&
        ((e.p[l * 3] = R(e.p[l * 3], o[0], o[1])),
        (e.p[l * 3 + 2] = R(e.p[l * 3 + 2], o[2], o[3])),
        e.p[l * 3 + 1] < o[4] &&
          ((e.p[l * 3 + 1] = o[4]),
          (e.v[l * 3 + 1] = Math.abs(e.v[l * 3 + 1]) * 0.3))),
      e.p[l * 3 + 1] > n - 0.01 && (e.life[l] = 0),
      e.life[l] <= 0)
    )
      continue;
    const c = e.size[l];
    (Ao.compose(
      Na.set(e.p[l * 3], e.p[l * 3 + 1], e.p[l * 3 + 2]),
      Ea,
      Wa.set(c, c * 0.85, c),
    ),
      e.im.setMatrixAt(r++, Ao));
  }
  ((e.im.count = r), (e.im.instanceMatrix.needsUpdate = !0));
}
const Sn = new i.Vector3();
function kn() {
  const e = [],
    t = (n) => {
      (!e.length || e[e.length - 1].distanceToSquared(n) > 1e-10) &&
        e.push(n.clone());
    };
  return {
    pts: e,
    line(n, o, a = 10) {
      for (let r = 0; r <= a; r++) t(Sn.lerpVectors(n, o, r / a));
      return this;
    },
    bez(n, o, a, r, l = 48) {
      for (let s = 0; s <= l; s++) {
        const c = s / l,
          f = 1 - c;
        t(
          Sn.set(0, 0, 0)
            .addScaledVector(n, f * f * f)
            .addScaledVector(o, 3 * f * f * c)
            .addScaledVector(a, 3 * f * c * c)
            .addScaledVector(r, c * c * c),
        );
      }
      return this;
    },
  };
}
const F = (e, t, n) => new i.Vector3(e, t, n),
  j = 180,
  Di = 18,
  Rt = 0.17,
  Ba = 0.112;
class Tn {
  constructor(t, n) {
    (Object.assign(this, n),
      (this.key = t),
      (this.P = Array.from({ length: j }, () => new i.Vector3())),
      (this.S = new Float32Array(j)),
      (this.u = -1),
      (this.CU = Pi()),
      (this.wall = new Ia(j, Di, Rt, Mi)),
      (this.core = new Ia(j, 14, Ba, Ri(this.CU))),
      (this.wall.mesh.renderOrder = 1),
      this.group.add(this.core.mesh, this.wall.mesh),
      Me.push(this.wall.mesh),
      (this.wall.mesh.castShadow = !1),
      (this.core.mesh.castShadow = !0));
    const o = (a) =>
      a.shape === "box" ? a.w * a.d * H * H : Math.PI * (a.w / 2) ** 2 * H * H;
    ((this.srcM = {
      y0: this.src.o.y0 * H,
      H: this.src.o.H * H,
      A: o(this.src.o),
    }),
      (this.lowM = { y0: 0, H: this.low.o.H * H, A: o(this.low.o) }),
      this.pose(0, !0));
  }
  lift(t) {
    return t * this.liftMax;
  }
  pose(t, n) {
    if (!n && Math.abs(t - this.u) < 1e-5) return !1;
    this.u = t;
    const o = this.lift(t);
    ((this.lowGrp.position.y = o),
      this.jack?.set(this.jackH0 + o),
      this.onPose?.(t, o));
    const a = this.path(t),
      r = a.pts,
      l = [0];
    for (let u = 1; u < r.length; u++)
      l.push(l[u - 1] + r[u].distanceTo(r[u - 1]));
    const s = l[l.length - 1];
    let c = 0;
    for (let u = 0; u < j; u++) {
      const m = (s * u) / (j - 1);
      for (; c < r.length - 2 && l[c + 1] < m;) c++;
      const v = (m - l[c]) / Math.max(1e-9, l[c + 1] - l[c]);
      (this.P[u].lerpVectors(r[c], r[c + 1], R(v, 0, 1)), (this.S[u] = m * H));
    }
    (this.wall.update(this.P, this.S), this.core.update(this.P, this.S));
    let f = 0;
    for (let u = 1; u < j - 1; u++)
      (Oa.subVectors(this.P[u], this.P[u - 1]).normalize(),
        Ua.subVectors(this.P[u + 1], this.P[u]).normalize(),
        (f += Math.acos(R(Oa.dot(Ua), -1, 1))));
    ((this.lowM.y0 = (this.low.o.y0 + o) * H),
      (this.model = _a(
        Array.from(this.S),
        Array.from(this.P, (u) => u.y * H),
        this.srcM,
        this.lowM,
        f,
      )));
    let h = 0;
    for (let u = 0; u < j; u++) this.P[u].y > this.P[h].y && (h = u);
    return ((this.crestI = h), !0);
  }
  at(t, n) {
    const o = R((t / H / (this.S[j - 1] / H)) * (j - 1), 0, j - 1),
      a = Math.min(j - 2, Math.floor(o));
    return n.lerpVectors(this.P[a], this.P[a + 1], o - a);
  }
  dirAt(t, n) {
    const o = R((t / this.S[j - 1]) * (j - 1), 0, j - 1),
      a = Math.min(j - 2, Math.floor(o));
    return n.subVectors(this.P[a + 1], this.P[a]).normalize();
  }
}
const Oa = new i.Vector3(),
  Ua = new i.Vector3();
function Ln(e, t, n, o, a, r, l, s = {}) {
  const c = new i.Group();
  (c.position.set(t, n, o), e.add(c));
  const f = s.plate || ke,
    h = s.link || To,
    u = s.t || 0.07,
    m = W();
  (m.box(f, 0, u / 2, 0, a, u, r, { r: 0.02 }),
    m.box(Xt, 0, u + 0.012, 0, a * 0.8, 0.024, 0.1),
    m.flush(c));
  const v = new i.Group();
  c.add(v);
  {
    const b = W();
    (b.box(f, 0, -u / 2, 0, a, u, r, { r: 0.02 }), b.flush(v));
  }
  const d = [];
  for (const b of [-1, 1])
    for (const y of [-1, 1]) {
      const p = new i.Mesh(new i.BoxGeometry(l, s.lt || 0.12, 0.05), h);
      ((p.castShadow = !0),
        (p.position.z = b * (r / 2 - 0.16) + y * 0.03),
        c.add(p),
        d.push({ m: p, s: y }));
    }
  const g = new i.CylinderGeometry(0.045, 0.045, r - 0.18, 10).rotateX(
      Math.PI / 2,
    ),
    S = [];
  for (let b = 0; b < 5; b++) {
    const y = new i.Mesh(g, Zs);
    (c.add(y), S.push(y));
  }
  const x = new i.Mesh(Co(0, 0.16, 0, 0.17, 24, 0.025), To);
  return (
    (x.rotation.y = Math.PI / 2),
    c.add(x),
    {
      g: c,
      top: v,
      set(b) {
        const y = Math.max(0.1, b - 2 * u),
          p = Math.sqrt(Math.max(0.01, l * l - y * y)),
          M = Math.atan2(y, p),
          w = u + 0.06,
          z = u + y - 0.06 + 0.06;
        for (const k of d)
          (k.m.position.set(0, u + y / 2, k.m.position.z),
            (k.m.rotation.z = k.s * M));
        (S[0].position.set(-p / 2, w, 0),
          S[1].position.set(p / 2, w, 0),
          S[2].position.set(-p / 2, u + y - 0.06, 0),
          S[3].position.set(p / 2, u + y - 0.06, 0),
          S[4].position.set(0, u + y / 2, 0),
          x.position.set(0, u + y / 2, r / 2 - 0.02),
          (x.rotation.z = y * 6),
          (v.position.y = u + y + u));
      },
    }
  );
}
function lt(e, t, n, o = 0.215, a = 0.36, r = te, l = !0) {
  const s = Sn.copy(n).normalize(),
    c = [s.x, s.y, s.z];
  if ((e.cyl(r, t.x, t.y, t.z, o, o, a, { dir: c, seg: 28 }), l))
    for (const f of [-1, 1]) {
      const h = t.clone().addScaledVector(s, f * a * 0.42);
      e.cyl(r, h.x, h.y, h.z, o * 1.28, o * 1.28, 0.05, { dir: c, seg: 28 });
      const u =
          Math.abs(s.y) > 0.9 ? new i.Vector3(1, 0, 0) : new i.Vector3(0, 1, 0),
        m = new i.Vector3().crossVectors(s, u).normalize(),
        v = new i.Vector3().crossVectors(s, m);
      for (let d = 0; d < 4; d++) {
        const g = (d / 4) * Math.PI * 2 + 0.785,
          S = h
            .clone()
            .addScaledVector(m, Math.cos(g) * o * 1.1)
            .addScaledVector(v, Math.sin(g) * o * 1.1)
            .addScaledVector(s, f * 0.035);
        e.cyl(it, S.x, S.y, S.z, 0.028, 0.028, 0.04, {
          dir: [s.x * f, s.y * f, s.z * f],
          seg: 6,
        });
      }
    }
}
function qa(e, t, n, o, a, r, l, s) {
  const c = re(s);
  for (let h = 0; h < 16; h++)
    at(
      e,
      t + (c() - 0.5) * a * 0.9,
      o,
      n + (c() - 0.5) * r * 0.8,
      0.08 + c() * 0.07,
      s * 7 + h,
      hi,
      0.5,
    );
  const f = t + l * a * 0.26;
  (at(e, f, o, n - 0.1, 0.55, s, Vo, 0.72),
    at(e, f + l * 0.55, o, n + 0.35, 0.34, s + 2, Vo, 0.7),
    at(e, f - l * 0.5, o, n + 0.5, 0.24, s + 4, Vo, 0.68),
    nt(e, f - l * 0.05, o + 0.42, n - 0.35, 1.35, s + 1),
    nt(e, f + l * 0.65, o + 0.2, n - 0.5, 1.05, s + 3),
    Fe(e, f - l * 0.75, o, n + 0.25, 0.62, s + 5, { n: 8 }),
    Fe(e, f + l * 0.35, o + 0.25, n + 0.55, 0.5, s + 6, { n: 7 }),
    Fe(e, t - l * a * 0.2, o, n + 0.4, 0.46, s + 8, { n: 7 }));
}
const Ce = new i.Group();
Re.add(Ce);
const De = {};
{
  const e = mn.top,
    t = -0.2,
    n = {
      shape: "box",
      w: 3.8,
      d: 2.3,
      H: 2.9,
      y0: e + 0.64,
      cx: -3.3,
      cz: -0.15,
    },
    o = {
      shape: "box",
      w: 4.2,
      d: 2.3,
      H: 2.2,
      y0: e + 0.33,
      cx: 3.05,
      cz: -0.15,
    },
    a = W();
  {
    const { cx: x, cz: b, w: y, d: p } = n,
      M = y / 2 + 0.07 + 0.1,
      w = p / 2 + 0.07 + 0.1,
      z = e + 0.57;
    for (const k of [-1, 1])
      for (const V of [-1, 1]) {
        (a.box(
          ke,
          x + k * M,
          (e + n.y0 + n.H + 0.14) / 2,
          b + V * w,
          0.18,
          n.y0 + n.H + 0.14 - e,
          0.18,
          { r: 0.02 },
        ),
          a.box(_e, x + k * M, e + 0.068, b + V * w, 0.44, 0.04, 0.44, {
            r: 0.01,
          }));
        for (const E of [-1, 1])
          Te(
            a,
            x + k * M + E * 0.13,
            e + 0.088,
            b + V * w + 0.13 * E * k,
            [0, 1, 0],
            0.035,
          );
        (Te(
          a,
          x + k * M,
          n.y0 + n.H - 0.25,
          b + V * (w + 0.09),
          [0, 0, V],
          0.04,
        ),
          Te(a, x + k * M, e + 0.9, b + V * (w + 0.09), [0, 0, V], 0.04));
      }
    for (const k of [-1, 1])
      a.box(ke, x, z - 0.2, b + k * w, y + 0.3, 0.36, 0.12, { r: 0.02 });
    for (const k of [-1, 1])
      a.box(ke, x + k * M, z - 0.2, b, 0.12, 0.36, p + 0.3, { r: 0.02 });
    a.box(Xt, x, z - 0.02, b, y + 0.2, 0.06, p + 0.2);
  }
  (a
    .geo(pn, $t(0.8, 4.1, 0.8, 0.03, 2), -0.62, e + 2.05, t)
    .geo(pn, $t(0.66, 3.3, 0.66, 0.03, 2), 0.04, e + 1.65, 0.52),
    a.flush(Ce));
  const r = new i.Group();
  Ce.add(r);
  {
    const x = W(),
      { cx: b, cz: y, w: p, d: M } = o,
      w = p / 2 + 0.07 + 0.09,
      z = M / 2 + 0.07 + 0.09,
      k = o.y0 - 0.07;
    for (const V of [-1, 1])
      for (const E of [-1, 1])
        (x.box(
          ke,
          b + V * w,
          (k - 0.16 + o.y0 + o.H + 0.12) / 2,
          y + E * z,
          0.16,
          o.y0 + o.H + 0.12 - k + 0.16,
          0.16,
          { r: 0.02 },
        ),
          Te(
            x,
            b + V * w,
            o.y0 + o.H - 0.2,
            y + E * (z + 0.08),
            [0, 0, E],
            0.035,
          ),
          Te(x, b + V * w, k + 0.1, y + E * (z + 0.08), [0, 0, E], 0.035));
    for (const V of [-1, 1])
      x.box(ke, b, k - 0.08, y + V * z, p + 0.3, 0.16, 0.12, { r: 0.02 });
    for (const V of [-1, 1])
      x.box(ke, b + V * w, k - 0.08, y, 0.12, 0.16, M + 0.3, { r: 0.02 });
    (x.box(Xt, b, k - 0.1, y, p + 0.2, 0.12, M + 0.2), x.flush(r));
  }
  const l = rt(Ce, n),
    s = rt(r, o);
  {
    const x = W();
    (qa(x, n.cx, n.cz, n.y0, n.w, n.d, -1, 11), l.submerge(x.flush(Ce)));
    const b = W();
    (qa(b, o.cx, o.cz, o.y0, o.w, o.d, 1, 23), s.submerge(b.flush(r)));
  }
  const c = Ln(Ce, o.cx, e - 0.06, o.cz, 3.9, 2.3, 3.3, { t: 0.05, lt: 0.1 });
  {
    const x = W();
    (x.box(
      D("#07080b", { roughness: 0.9 }),
      o.cx,
      e + 0.048,
      o.cz,
      4.02,
      0.004,
      2.36,
    ),
      x.flush(Ce, !1));
  }
  const f = W(),
    h = F(-0.62, e + 4.48, t);
  (f
    .cyl(te, -1.78, e + 0.86, t, 0.2, 0.2, 0.2, { seg: 24 })
    .cyl(it, -1.78, e + 0.74, t, 0.17, 0.2, 0.05, { seg: 24 }),
    lt(f, F(-1.78, n.y0 + n.H + 0.12, t), F(0, 1, 0), 0.21, 0.28),
    f
      .box(te, -1.56, n.y0 + n.H + 0.12, t, 0.34, 0.12, 0.12)
      .box(it, -1.37, n.y0 + n.H + 0.02, t, 0.08, 0.3, 0.26),
    lt(f, h, F(1, 0, 0), 0.23, 0.46),
    f
      .box(te, h.x, e + 4.1 + 0.03, t, 0.66, 0.06, 0.66, { r: 0.015 })
      .box(
        it,
        h.x,
        (e + 4.1 + h.y - 0.2) / 2 + 0.02,
        t,
        0.18,
        h.y - 0.2 - e - 4.1,
        0.3,
      ));
  for (const x of [-1, 1])
    for (const b of [-1, 1])
      Te(f, h.x + x * 0.24, e + 4.16, t + b * 0.24, [0, 1, 0], 0.03);
  (f
    .cyl(te, h.x, h.y + 0.3, t, 0.055, 0.055, 0.22, { seg: 14 })
    .cyl(it, h.x, h.y + 0.46, t, 0.09, 0.09, 0.1, { seg: 6 })
    .cyl(te, h.x + 0.12, h.y + 0.46, t, 0.03, 0.03, 0.14, {
      rz: Math.PI / 2,
      seg: 10,
    }),
    f.cyl(te, h.x, h.y, t + 0.32, 0.05, 0.05, 0.24, {
      rx: Math.PI / 2,
      seg: 12,
    }),
    f.flush(Ce));
  const u = new i.Group();
  (u.position.set(h.x, h.y + 0.56, t), Ce.add(u));
  {
    const x = new i.Mesh(Co(0, 0.1, 0, 0.12, 20, 0.02), te);
    ((x.rotation.z = Math.PI / 2), (x.position.y = 0.05), u.add(x));
    const b = new i.Mesh(new i.CylinderGeometry(0.1, 0.11, 0.03, 20), it);
    ((b.position.y = 0.115), u.add(b));
  }
  const m = new i.Group();
  (m.position.set(h.x, h.y, t + 0.47), Ce.add(m));
  {
    const x = new i.Mesh(
      new i.CylinderGeometry(0.25, 0.25, 0.08, 40).rotateX(Math.PI / 2),
      te,
    );
    m.add(x);
    const b = fn(
      0.42,
      0.42,
      256,
      256,
      (w, z, k) => {
        ((w.fillStyle = "#f3efe4"),
          w.beginPath(),
          w.arc(128, 128, 124, 0, 7),
          w.fill(),
          (w.strokeStyle = "#2a2f38"),
          (w.fillStyle = "#2a2f38"));
        for (let V = 0; V <= 10; V++) {
          const E = Math.PI * (0.75 + (1.5 * V) / 10),
            ue = V % 5 ? 100 : 92;
          ((w.lineWidth = V % 5 ? 3 : 5),
            w.beginPath(),
            w.moveTo(128 + Math.cos(E) * ue, 128 + Math.sin(E) * ue),
            w.lineTo(128 + Math.cos(E) * 112, 128 + Math.sin(E) * 112),
            w.stroke());
        }
        ((w.font = "600 22px DM Mono, monospace"),
          (w.textAlign = "center"),
          w.fillText("kPa", 128, 190),
          (w.font = "500 20px DM Mono, monospace"),
          w.fillText("90", 70, 176),
          w.fillText("100", 128, 62),
          w.fillText("110", 190, 176),
          (w.fillStyle = "#c0392b"),
          w.beginPath(),
          w.arc(128, 128, 112, Math.PI * 1.95, Math.PI * 2.25),
          w.arc(128, 128, 100, Math.PI * 2.25, Math.PI * 1.95, !0),
          w.fill());
      },
      0.95,
      { side: i.FrontSide },
    );
    ((b.position.z = 0.045), m.add(b));
    const y = new i.Mesh(
      new i.BoxGeometry(0.012, 0.17, 0.006).translate(0, 0.07, 0),
      D("#b3261e", { roughness: 0.4 }),
    );
    ((y.position.z = 0.052), m.add(y), (m.userData.needle = y));
    const p = new i.Mesh(
      new i.CylinderGeometry(0.02, 0.02, 0.02, 12).rotateX(Math.PI / 2),
      it,
    );
    ((p.position.z = 0.06), m.add(p));
    const M = new i.Mesh(new i.CircleGeometry(0.215, 40), pt);
    ((M.position.z = 0.07), (M.renderOrder = 3), m.add(M), Me.push(M));
  }
  const v = 1.6,
    d = W(),
    g = o.y0 + o.H;
  (lt(d, F(v, g + 0.16, t), F(0, 1, 0), 0.2, 0.26),
    d
      .box(te, v - 0.24, g + 0.16, t, 0.3, 0.12, 0.12)
      .box(it, o.cx - o.w / 2 - 0.04, g + 0.06, t, 0.08, 0.34, 0.26),
    d.cyl(te, v, o.y0 + 1.85 + 0.03, t, 0.185, 0.185, 0.07, { seg: 24 }),
    d.cyl(te, v, g + 0.16, t + 0.3, 0.045, 0.045, 0.26, {
      rx: Math.PI / 2,
      seg: 12,
    }),
    d.flush(r));
  const S = new i.Mesh(
    new i.SphereGeometry(0.2, 20, 14),
    D("#4a2420", { roughness: 0.42, envMapIntensity: 0.8 }),
  );
  (S.position.set(v, g + 0.16, t + 0.62),
    S.scale.set(0.85, 0.85, 1.25),
    (S.castShadow = !0),
    r.add(S),
    (De.lab = new Tn("lab", {
      group: Ce,
      src: l,
      low: s,
      lowGrp: r,
      liftMax: 1.3,
      jack: c,
      jackH0: 0.2,
      crest: h,
      valve: u,
      gauge: m,
      bulb: S,
      tipLocal: F(v, o.y0 + 1.85, t),
      tz: t,
      path(x) {
        const b = x * 1.3,
          y = o.y0 + o.H + b,
          p = F(v, y + 0.2, t),
          M = F(v, o.y0 + 1.85 + b, t),
          w = F(-1.78, n.y0 + n.H + 0.14, t);
        return kn()
          .line(F(-1.78, e + 0.95, t), w, 14)
          .bez(w, F(-1.78, w.y + 0.8, t), F(h.x - 0.6, h.y, t), h, 40)
          .bez(
            h,
            F(h.x + 0.8, h.y, t),
            F(v, Math.min(p.y + 0.95, h.y - 0.12), t),
            p,
            52,
          )
          .line(p, M, 8);
      },
    })));
}
const eo = new i.Group();
(Re.add(eo), (eo.visible = !1));
{
  const e = new i.Mesh(
    new i.SphereGeometry(140, 48, 24),
    new i.ShaderMaterial({
      side: i.BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: { uC: { value: new i.Vector3(2, 6, -20) } },
      vertexShader:
        "varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "varying vec3 vW;uniform vec3 uC;void main(){vec3 d=normalize(vW-vec3(0.,3.,0.));float glow=exp(-pow(length(vW.xy-uC.xy)/62.,2.));float up=smoothstep(-.1,.7,d.y);vec3 c=mix(vec3(.04,.08,.19),vec3(.12,.21,.42),glow);c=mix(c,vec3(.03,.05,.12),up*.55);gl_FragColor=vec4(c,1.);}",
    }),
  );
  ((e.renderOrder = -10), eo.add(e), Me.push(e));
  const t = Oe(
      new i.MeshStandardMaterial({
        color: "#1b2640",
        roughness: 0.3,
        metalness: 0.2,
        envMapIntensity: 0.5,
      }),
      ra,
    ),
    n = new i.Mesh(new i.CircleGeometry(90, 64), t);
  ((n.rotation.x = -Math.PI / 2),
    (n.receiveShadow = !0),
    eo.add(n),
    Lt.push(n));
}
function _t(e, t, n, o = 1, a = 0.12, r = 0.14) {
  const l = re(o * 13 + 5),
    s = new i.Shape(e.map(([m, v]) => new i.Vector2(m, -v))),
    c = new i.ExtrudeGeometry(s, {
      depth: Math.max(0.05, n - t - r * 2),
      bevelEnabled: !0,
      bevelThickness: r,
      bevelSize: r * 0.9,
      bevelSegments: 1,
      curveSegments: 1,
    });
  (c.rotateX(-Math.PI / 2), c.translate(0, t + r, 0));
  const f = c.attributes.position,
    h = new Map();
  for (let m = 0; m < f.count; m++)
    if (f.getY(m) > n - r * 1.2) {
      const v = f.getX(m).toFixed(2) + "," + f.getZ(m).toFixed(2);
      (h.has(v) || h.set(v, (l() - 0.5) * a), f.setY(m, f.getY(m) + h.get(v)));
    }
  const u = c.index ? c.toNonIndexed() : c;
  return (u.computeVertexNormals(), u);
}
const Ft = (e, t, n, o, a = 0, r = 0, l = 0.18) => {
    const s = re(o);
    return Array.from({ length: e }, (c, f) => {
      const h = (f / e) * Math.PI * 2,
        u = 1 + (s() - 0.5) * l * 2;
      return [a + Math.cos(h) * t * u, r + Math.sin(h) * n * u];
    });
  },
  zn = D("#646a78", { flatShading: !0, roughness: 0.84 }),
  Io = D("#737987", { flatShading: !0, roughness: 0.82 }),
  Ha = D("#535866", { flatShading: !0, roughness: 0.86 }),
  ja = D("#8a5a34", { roughness: 0.62 }),
  Ka = D("#6b4428", { roughness: 0.7 }),
  Cn = D("#a06c40", { roughness: 0.6 }),
  $a = D("#6a4327", { roughness: 0.58 }),
  Ii = D("#4e311d", { roughness: 0.66 }),
  Gi = ["#4f7d36", "#5e8c3c", "#6f9a42"].map((e) =>
    D(e, { flatShading: !0, roughness: 0.85 }),
  );
function Xa(e, t, n, o) {
  const a = new i.BoxGeometry(e, t, n, 2, 2, 2),
    r = a.attributes.position,
    l = re(o),
    s = new Map();
  for (let f = 0; f < r.count; f++) {
    const h = r.getX(f),
      u = r.getY(f),
      m = r.getZ(f),
      v = h.toFixed(3) + "," + u.toFixed(3) + "," + m.toFixed(3);
    if (!s.has(v)) {
      const g =
          (Math.abs(h) < 0.001) + (Math.abs(u) < 0.001) + (Math.abs(m) < 0.001),
        S = g === 1 ? 0.05 : g === 2 ? 0.07 : 0,
        x = 0.035;
      s.set(v, [
        h * (1 + S / Math.max(0.3, e)) + (l() - 0.5) * x,
        u * (1 + S / Math.max(0.3, t)) + (l() - 0.5) * x,
        m * (1 + S / Math.max(0.3, n)) + (l() - 0.5) * x,
      ]);
    }
    const d = s.get(v);
    r.setXYZ(f, d[0], d[1], d[2]);
  }
  const c = a.toNonIndexed();
  return (c.computeVertexNormals(), c);
}
const Ie = new i.Group();
(Re.add(Ie), (Ie.visible = !1));
{
  const e = W(),
    t = { shape: "box", w: 3.8, d: 2.4, H: 2.6, y0: 5.7, cx: -5.4, cz: 0 },
    n = { shape: "box", w: 4, d: 2.4, H: 2.1, y0: 2.24, cx: 5.6, cz: 0 };
  (e.geo(Ha, _t(Ft(16, 9.2, 3.7, 3, 0.2, 0.2, 0.08), 0, 0.55, 1, 0.05, 0.12)),
    e.geo(zn, _t(Ft(11, 3.1, 2.8, 5, -5.4, 0.1, 0.16), 0.4, 1.9, 2, 0.14)),
    e.geo(Io, _t(Ft(10, 2.8, 2.5, 7, -5.3, 0, 0.14), 1.7, 3.2, 3, 0.12)),
    e.geo(zn, _t(Ft(10, 3.3, 2.5, 9, -0.2, 0.3, 0.16), 0.4, 1.9, 4, 0.1)),
    e.geo(Io, _t(Ft(11, 3.4, 2.7, 11, 5.6, 0.15, 0.12), 0.4, 1.55, 5, 0.08)));
  const o = re(77);
  for (const [d, g, S, x, b] of [
    [-7.9, 0.5, 1.2, 1.5, 0.95],
    [-6.4, 0.5, 2.3, 1.25, 0.9],
    [-4.2, 0.5, 2.2, 1.35, 0.85],
    [-2.9, 0.5, 1.1, 1.1, 0.9],
    [-8.2, 0.5, -1.2, 1.4, 1],
    [-6.8, 1.7, 1.7, 0.95, 0.8],
    [-4.1, 1.7, 1.9, 0.9, 0.75],
    [-3.1, 0.5, -1.9, 1.2, 0.9],
    [-0.9, 0.4, 2.2, 0.9, 0.7],
    [1.6, 0.4, 2.3, 0.85, 0.7],
    [0.7, 0.4, -2.1, 1, 0.8],
    [3.4, 0.4, 2.4, 0.8, 0.7],
    [7.7, 0.4, 2.3, 0.9, 0.7],
    [8.4, 0.4, -0.2, 1.1, 0.8],
    [6.4, 0.4, -2.2, 1, 0.8],
  ])
    e.geo(
      o() > 0.5 ? zn : Io,
      un(x, 0.42, Math.round(d * 13 + S * 7 + g * 3), 1),
      d,
      g + x * b * 0.55,
      S,
      { s: [1, b, 1], ry: d },
    );
  for (const [d, g, S] of [
    [-8.2, 1.6, 0.9],
    [-7.6, 2.6, 0.6],
    [-2.9, 2.4, 0.7],
    [-3.6, -2.2, 1.1],
    [-7.9, -1.6, 1],
    [-1.2, 2.5, 0.45],
    [1.8, 2.6, 0.55],
    [2.7, -2.3, 0.8],
    [8.4, 1.5, 0.7],
    [8.6, -0.9, 0.9],
    [-6.6, 2.9, 0.4],
    [0.6, 2.9, 0.35],
  ])
    at(e, d, 0.5, g, S, Math.round(d * 7 + g * 3), Io, 0.75);
  for (let d = 0; d < 22; d++) {
    const g = -8.5 + o() * 17,
      S = 2.4 + o() * 1.1;
    at(e, g, 0.52, S, 0.12 + o() * 0.16, d + 40, Ha, 0.6);
  }
  for (const [d, g, S, x] of [
    [-8.3, 0.55, 2.3, 2.2],
    [-7.5, 3.2, 1.8, 1.6],
    [-8.1, 0.55, -0.6, 2.6],
    [-3.3, 1.9, 1.9, 1.7],
    [-2.9, 1.9, -1.6, 2.1],
    [2.6, 1.55, -1.5, 2.2],
    [3.1, 1.55, 1.9, 1.5],
    [8.3, 1.55, -1.4, 2],
  ])
    nt(e, d, g, S, x, Math.round(d * 5 + S), Gi);
  for (const [d, g, S, x] of [
    [-6.9, 0.55, 2.8, 0.9],
    [-4, 1.9, 2.2, 0.8],
    [-1.1, 1.9, 1.9, 0.7],
    [0.9, 1.9, 2.1, 0.75],
    [2.2, 1.55, 2.4, 0.7],
    [7.8, 1.55, 2.1, 0.8],
    [4.1, 1.55, 2.3, 0.6],
    [-4.6, 3.2, 1.9, 0.7],
  ])
    Fe(e, d, g, S, x, Math.round(d * 3 + S * 7 + 60), { pal: Zt, n: 8 });
  {
    const { cx: d, cz: g, w: S, d: x } = t,
      b = t.y0 - 0.07,
      y = S / 2 - 0.05,
      p = x / 2 - 0.1;
    e.box(ja, d, b - 0.14, g, S + 0.5, 0.28, x + 0.4, { r: 0.02 });
    for (let M = 0; M < 5; M++)
      e.box(
        Ka,
        d - S / 2 + 0.2 + (M * (S - 0.4)) / 4,
        b - 0.3,
        g,
        0.12,
        0.06,
        x + 0.35,
      );
    for (const M of [-1, 1])
      for (const w of [-1, 1])
        (e.box(
          ke,
          d + M * y,
          (3.2 + b - 0.28) / 2,
          g + w * p,
          0.2,
          b - 0.28 - 3.2,
          0.2,
          { r: 0.02 },
        ),
          e.box(_e, d + M * y, 3.24, g + w * p, 0.46, 0.06, 0.46, { r: 0.01 }),
          Te(e, d + M * y, b - 0.5, g + w * (p + 0.1), [0, 0, w], 0.04));
    for (const M of [-1, 1]) {
      const w = b - 0.28 - 3.4,
        z = Math.hypot(2 * y, w);
      (e.box(Cn, d, 3.3 + w / 2, g + M * (p + 0.13), z, 0.16, 0.08, {
        rz: Math.atan2(w, 2 * y),
      }),
        e.box(Cn, d, 3.3 + w / 2, g + M * (p + 0.13), z, 0.16, 0.08, {
          rz: -Math.atan2(w, 2 * y),
        }),
        e.box(_e, d, 3.3 + w / 2, g + M * (p + 0.19), 0.3, 0.3, 0.03),
        Te(e, d, 3.3 + w / 2, g + M * (p + 0.21), [0, 0, M], 0.045));
    }
    for (const M of [-1, 1]) {
      const w = b - 0.28 - 3.4,
        z = Math.hypot(2 * p, w);
      e.box(Cn, d + M * (y + 0.13), 3.3 + w / 2, g, 0.08, 0.16, z, {
        rx: Math.atan2(w, 2 * p),
      });
    }
  }
  for (const d of [-1.6, 2.3]) {
    (e.box(ke, d, (1.9 + 7.52) / 2, 0, 0.17, 7.52 - 1.9, 0.17, { r: 0.02 }),
      e.box(_e, d, 1.93, 0, 0.5, 0.06, 0.5, { r: 0.01 }));
    for (const g of [-1, 1])
      Te(e, d + g * 0.17, 1.97, g * 0.17, [0, 1, 0], 0.035);
    e.box(_e, d, 7.5, 0, 0.44, 0.08, 0.38, { r: 0.015 });
    for (const g of [-1, 1]) e.box(_e, d, 7.66, g * 0.2, 0.3, 0.34, 0.06);
    Te(e, d, 7.7, 0.25, [0, 0, 1], 0.045);
  }
  e.flush(Ie);
  const a = new i.Group();
  Ie.add(a);
  const r = W();
  {
    const { cx: d, cz: g, w: S, d: x } = n;
    r.box(ja, d, n.y0 - 0.07 - 0.15, g, S + 0.5, 0.3, x + 0.4, { r: 0.02 });
    for (let b = 0; b < 4; b++)
      r.box(
        Ka,
        d - S / 2 + (b * S) / 3,
        n.y0 - 0.07 - 0.34,
        g,
        0.3,
        0.1,
        x + 0.3,
      );
    (r.box(
      ke,
      3.62,
      (n.y0 - 0.1 + n.y0 + 2.95 + 0.55) / 2,
      -0.45,
      0.15,
      n.y0 + 2.95 + 0.55 - (n.y0 - 0.1),
      0.15,
      { r: 0.02 },
    ),
      r.box(_e, 3.62, n.y0 - 0.05, -0.45, 0.4, 0.06, 0.4),
      r.box(_e, 3.8, n.y0 + 2.95 + 0.42, -0.25, 0.4, 0.08, 0.4));
  }
  (r.flush(a),
    Sa(
      a,
      n.cx + 0.6,
      n.y0 - 0.07 - 0.15,
      n.cz + (n.d + 0.4) / 2 + 0.006,
      2.03,
    ));
  const l = Ln(Ie, n.cx, 1.55, n.cz, 4.2, 2.5, 3.6),
    s = rt(Ie, t),
    c = rt(a, n),
    f = t.y0 + 1,
    h = W();
  (lt(h, F(-3.42, f, 0), F(1, 0, 0), 0.26, 0.12, _e, !1),
    h.cyl(ke, -3.36, f, 0, 0.3, 0.3, 0.06, { rz: Math.PI / 2, seg: 24 }),
    lt(h, F(-2.95, f, 0), F(1, 0, 0), 0.22, 0.3, _e));
  const u = F(0.35, 9.05, 0);
  (lt(h, u, F(1, 0, 0), 0.2, 0.3, te),
    h.cyl(te, u.x, u.y + 0.3, 0, 0.05, 0.05, 0.2, { seg: 12 }),
    h.flush(Ie));
  const m = new i.Group();
  (m.position.set(u.x, u.y + 0.45, 0), Ie.add(m));
  {
    const d = new i.Mesh(Co(0, 0.09, 0, 0.11, 18, 0.02), te);
    ((d.rotation.z = Math.PI / 2), (d.position.y = 0.045), m.add(d));
  }
  const v = W();
  (lt(v, F(3.9, n.y0 + 2.95 + 0.45, 0), F(0.25, -0.97, 0), 0.21, 0.3, _e),
    v.flush(a),
    (De.exploded = new Tn("exploded", {
      group: Ie,
      src: s,
      low: c,
      lowGrp: a,
      liftMax: 3,
      jack: l,
      jackH0: 0.24,
      crest: u,
      valve: m,
      tz: 0,
      path(d) {
        const g = d * 3,
          S = n.y0 + 2.95 + g,
          x = F(3.9, S + 0.45, 0),
          b = F(4.02, S, 0),
          y = F(-1.6, 7.76, 0),
          p = F(2.3, 7.76, 0),
          M = F(-3.58, t.y0 + 1, 0),
          w = F(-2.8, t.y0 + 1, 0);
        return kn()
          .line(M, w, 8)
          .bez(w, F(-2.2, w.y, 0), F(-2.05, 7.6, 0), y, 30)
          .bez(y, F(-1.05, 8.38, 0), F(u.x - 0.95, u.y, 0), u, 34)
          .bez(u, F(u.x + 0.95, u.y, 0), F(1.75, 8.38, 0), p, 34)
          .bez(
            p,
            F(2.85, 7.14 + Math.max(0, g - 1.2) * 0.35, 0),
            F(x.x - 0.3, Math.min(x.y + 0.5, 8.85), 0),
            x,
            34,
          )
          .line(x, b, 6);
      },
    })));
}
const to = new i.Group();
(Re.add(to), (to.visible = !1));
{
  const e = [];
  for (let s = 40; s > -6; s -= 2) e.push([s, 0]);
  for (let s = 0; s <= 16; s++) {
    const c = ((s / 16) * Math.PI) / 2;
    e.push([-6 - Math.sin(c) * 10, 10 - Math.cos(c) * 10]);
  }
  for (let s = 12; s <= 60; s += 4) e.push([-16, s]);
  const t = [],
    n = [],
    o = [],
    a = 70;
  e.forEach(([s, c], f) => {
    const [h, u] = e[Math.min(f + 1, e.length - 1)],
      [m, v] = e[Math.max(f - 1, 0)],
      d = h - m,
      g = u - v,
      S = Math.hypot(d, g) || 1;
    for (const x of [-a, a]) (t.push(x, c, s), n.push(0, -d / S, g / S));
  });
  for (let s = 0; s < e.length - 1; s++) {
    const c = s * 2;
    o.push(c, c + 1, c + 2, c + 1, c + 3, c + 2);
  }
  const r = new i.BufferGeometry();
  (r.setAttribute("position", new i.Float32BufferAttribute(t, 3)),
    r.setAttribute("normal", new i.Float32BufferAttribute(n, 3)),
    r.setIndex(o));
  const l = new i.Mesh(
    r,
    D("#efe6da", { roughness: 0.92, envMapIntensity: 0.4 }),
  );
  ((l.receiveShadow = !0), to.add(l));
}
const Ei = D("#a19584", { flatShading: !0, roughness: 0.86 }),
  Vn = D("#b0a492", { flatShading: !0, roughness: 0.84 }),
  Wi = D("#8c8070", { flatShading: !0, roughness: 0.88 }),
  Ni = D("#c2ad8d", { flatShading: !0, roughness: 0.86 }),
  Ge = new i.Group();
(Re.add(Ge), (Ge.visible = !1));
{
  const e = W(),
    t = D("#d9eef7", { roughness: 0.12, envMapIntensity: 1.2 }),
    n = {
      shape: "cyl",
      w: 2.9,
      H: 2.5,
      y0: 3.87,
      cx: -3,
      cz: -0.9,
      tb: 0.18,
      glass: Aa,
      edge: t,
    },
    o = {
      shape: "cyl",
      w: 2.9,
      H: 2.1,
      y0: 1.29,
      cx: 3.3,
      cz: 1.5,
      tb: 0.16,
      glass: Aa,
      edge: t,
    };
  e.geo(Ni, _t(Ft(14, 7, 3.6, 21, 0.2, 0.4, 0.07), 0, 0.45, 6, 0.03, 0.13));
  const a = re(33);
  let r = -4.7;
  for (let d = 0; d < 2; d++) {
    r = d ? -4.7 : -4.2;
    const g = 0.45 + d * 1.5;
    for (; r < 4.4;) {
      const S = 1.5 + a() * 0.9,
        x = Math.min(S, 4.6 - r);
      if (x < 0.4) break;
      (e.geo(
        a() > 0.5 ? Vn : Ei,
        Xa(x - 0.07, 1.42, 1.3 + a() * 0.1, Math.floor(a() * 999)),
        r + x / 2,
        g + 0.74,
        -1.25 + (a() - 0.5) * 0.08,
        { ry: (a() - 0.5) * 0.03 },
      ),
        (r += x));
    }
  }
  for (let d = 0; d < 4; d++)
    e.geo(Vn, Xa(1.22, 0.34, 1.36, d * 17 + 5), -0.45 + d * 1.3, 3.64, -1.25, {
      ry: (a() - 0.5) * 0.04,
    });
  e.box($a, -3, 3.69 - 0.12, -0.95, 3.8, 0.24, 3.3, { r: 0.03 });
  for (const d of [-1, 1])
    for (const g of [-1, 1])
      Te(
        e,
        -3 + d * 1.65,
        3.7,
        -0.95 + g * 1.4,
        [0, 1, 0],
        0.07,
        X("#9ea4ad", { roughness: 0.3 }),
      );
  for (const [d, g, S] of [
    [-5.3, 0.6, 0.8],
    [-4.4, 1.4, 0.5],
    [-5.9, -0.4, 0.6],
    [0.2, 1.2, 0.35],
    [5.8, 0.3, 0.55],
    [6, 1.4, 0.4],
    [-2, 1.9, 0.3],
    [1.4, 2.2, 0.25],
  ])
    at(e, d, 0.45, g, S, Math.round(d * 11 + g * 5), Vn, 0.8);
  for (let d = 0; d < 18; d++)
    at(
      e,
      -6 + a() * 12,
      0.46,
      0.6 + a() * 2.2,
      0.08 + a() * 0.1,
      d + 90,
      Wi,
      0.6,
    );
  (Fe(e, -5.2, 0.45, 1.3, 1.3, 70, { pal: Zt, n: 8, wide: 0.42, lean: 0.75 }),
    Fe(e, 1.1, 0.45, 0.5, 1, 71, { pal: Zt, n: 7, wide: 0.44, lean: 0.7 }),
    Fe(e, 6.1, 0.45, 0.9, 1.25, 72, { pal: Zt, n: 8, wide: 0.42, lean: 0.72 }),
    e.cyl(
      D("#6a4a30", { roughness: 0.8, flatShading: !0 }),
      -5.1,
      1.6,
      -1.9,
      0.1,
      0.16,
      2.4,
      { seg: 6, rz: 0.1 },
    ),
    Fe(e, -5.25, 2.8, -1.9, 1.5, 73, { pal: Zt, n: 9, wide: 0.3, lean: 1.05 }),
    e.flush(Ge),
    Sa(Ge, -3.2, 3.57, -0.95 + 1.65 + 0.035, 1.96));
  const l = new i.Group();
  Ge.add(l);
  const s = W();
  s.box($a, o.cx, o.y0 - 0.16 - 0.17, o.cz, 3.4, 0.34, 3.3, { r: 0.03 });
  for (const d of [-1, 1])
    s.box(Ii, o.cx, o.y0 - 0.16 - 0.39, o.cz + d * 1.25, 3.3, 0.1, 0.34);
  for (const d of [-1, 1])
    for (const g of [-1, 1])
      Te(
        s,
        o.cx + d * 1.45,
        o.y0 - 0.16 + 0.005,
        o.cz + g * 1.4,
        [0, 1, 0],
        0.06,
        X("#9ea4ad", { roughness: 0.3 }),
      );
  s.flush(l);
  const c = Ln(Ge, o.cx, 0.45, o.cz, 3, 3, 2.9, {
      plate: X("#b8bec8", { roughness: 0.3 }),
      link: X("#8e96a3", { roughness: 0.3 }),
    }),
    f = rt(Ge, n),
    h = rt(l, o),
    u = F(-1.2, 7.45, -0.62),
    m = W();
  (lt(m, u, F(1, 0, 0.22), 0.19, 0.24, te, !1),
    m.cyl(te, u.x, u.y + 0.26, u.z, 0.045, 0.045, 0.18, { seg: 12 }),
    m.flush(Ge));
  const v = new i.Group();
  (v.position.set(u.x, u.y + 0.38, u.z), Ge.add(v));
  {
    const d = new i.Mesh(Co(0, 0.08, 0, 0.1, 18, 0.018), te);
    ((d.rotation.z = Math.PI / 2), (d.position.y = 0.04), v.add(d));
  }
  De.studio = new Tn("studio", {
    group: Ge,
    src: f,
    low: h,
    lowGrp: l,
    liftMax: 3.2,
    jack: c,
    jackH0: 0.24,
    crest: u,
    valve: v,
    tz: 0,
    path(d) {
      const g = d * 3.2,
        S = o.y0 + o.H + g,
        x = F(2.62, S + 0.3, 1.25),
        b = F(3, o.y0 + 0.4 + g, 1.45),
        y = F(-2.25, n.y0 + 1, -0.9),
        p = F(-2.25, 6.62, -0.9);
      return kn()
        .line(y, p, 16)
        .bez(p, F(-2.25, 7.25, -0.9), F(-1.75, 7.45, -0.72), u, 30)
        .bez(
          u,
          F(u.x + 1.15, u.y, u.z + 0.35),
          F(x.x - 0.75, Math.min(x.y + 1.5, 7.2), x.z - 0.45),
          x,
          60,
        )
        .line(x, b, 12);
    },
  });
}
const qr = li(to, 0.2, 0, 0.4, 17, 8.5, 0.34),
  C = {
    lift: 0,
    liftT: 0,
    paused: !1,
    valveRot: 0,
    prime: 0,
    fill: null,
    break: null,
    wasFull: !0,
    jet: 0,
    sq: 0,
  },
  ct = [0.8, 0.5];
let K = De.lab,
  vt = !1;
const L = new yi(K.model);
((L.fs = ct[0]), (L.fl = ct[1]), L.fillFull());
let xt = 0.016,
  Pn = 0.016,
  U = 0,
  Ya = 0;
const ft = (e) => e * ee * 6e4,
  wt = _i(Re);
function Bi(e) {
  if (
    ((C.lift += (C.liftT - C.lift) * (1 - Math.exp(-e * (vt ? 16 : 3.4)))),
    Math.abs(C.liftT - C.lift) < 1e-4 && (C.lift = C.liftT),
    K.pose(C.lift) && L.setRig(K.model),
    C.fill)
  ) {
    const n = R((U - C.fill.t0) / C.fill.dur, 0, 1),
      o = Gs(n);
    ((L.fs = tt(C.fill.a[0], ct[0], o)),
      (L.fl = tt(C.fill.a[1], ct[1], o)),
      n >= 1 && (C.fill = null));
  }
  C.paused || (L.step(e), (Ya += e));
  const t = L.full();
  (C.wasFull &&
    !t &&
    !L.priming &&
    (C.break = L.leakOpen
      ? "leak"
      : L.hs() < K.model.z0 + 0.004
        ? "inlet"
        : L.headNow() < -0.004
          ? "outlet"
          : L.headNow() < 0.006
            ? "level"
            : "air"),
    t && (C.break = null),
    (C.wasFull = t),
    (C.valveRot +=
      ((L.leakOpen ? -2.4 : 0) - C.valveRot) * (1 - Math.exp(-e * 4))),
    (C.prime += ((L.priming ? 1 : 0) - C.prime) * (1 - Math.exp(-e * 6))));
}
function oo() {
  if (L.full()) {
    be("Already primed: the tube is full");
    return;
  }
  (L.leakOpen
    ? be("Air valve shut \xB7 priming")
    : be("Priming: the bulb draws the air out"),
    L.prime(),
    kt(!0));
}
function Go(e) {
  const t = e ?? !L.leakOpen;
  (t && L.priming && (L.priming = !1),
    (L.leakOpen = t),
    be(t ? "Air valve open" : "Air valve shut"),
    kt(!0));
}
function no() {
  ((C.fill = { a: [L.fs, L.fl], t0: U, dur: 1.4 }),
    be("Refilling the tanks"),
    kt(!0));
}
function Eo(e) {
  ((C.paused = e ?? !C.paused),
    _("#pause").classList.toggle("on", C.paused),
    _("#pause").setAttribute("aria-pressed", C.paused),
    be(C.paused ? "Water paused \xB7 Space to run" : "Water running"));
}
const bt = (e) => {
  C.liftT = R(e, 0, 1);
};
function Rn() {
  const e = K,
    t = e.P[j - 1].y - e.lift(e.u);
  return (L.hs() / H - t) / e.liftMax;
}
const fe = new i.Vector3(),
  Ja = new i.Vector4(),
  Hr = new i.Vector3();
function Oi() {
  const e = K,
    t = L,
    n = e.model,
    o = Ya,
    a = C.paused ? 0 : xt,
    r = t.hs() / H,
    l = t.hl() / H;
  fe.copy(e.P[j - 1]);
  const s = l < fe.y - 0.02,
    c = t.out,
    f = s && c > 0.03 && t.slugs.length && t.slugs[t.slugs.length - 1].ra;
  C.jet += ((f ? 1 : 0) - C.jet) * (1 - Math.exp(-(a || 0.016) * 14));
  const h = Math.sqrt(Math.max(0, c) ** 2 + 2 * st * Math.max(0, fe.y - l) * H);
  (Ja.set(fe.x, fe.z, R(C.jet * h * 0.55, 0, 1), 0),
    e.src.set(r, o, null),
    e.low.set(l, o, Ja, e.lowGrp.position.y));
  const u = A.cur === "studio" ? 1 : 0;
  for (const z of [e.src, e.low])
    ((z.U.uLight.value = u),
      z.U.uShal.value.setRGB(...(u ? [0.1, 0.52, 1.05] : [0.03, 0.34, 0.92])),
      z.U.uDeep.value.setRGB(...(u ? [0.03, 0.24, 0.72] : [0.012, 0.1, 0.36])));
  const m = e.CU,
    v = t.slugs;
  for (let z = 0; z < 3; z++) {
    const k = v[z];
    m["uSl" + z].value.set(k ? k.a : 0, k ? k.b : 0, k ? k.ph : 0, k ? 1 : 0);
  }
  ((m.uLm.value = n.L),
    (m.uSc.value = n.sc),
    (m.uT.value = o),
    (m.uLight.value = A.cur === "studio" ? 1 : 0),
    (m.uPrime.value = C.prime));
  const d = R(t.Vbd / (ee * Math.max(0.05, n.L - n.sc)), 0, 0.6);
  m.uAlpha.value = d;
  const g = R(t.Vcp / (ee * 0.05), 0, 1),
    S = 0.015 + 0.07 * g;
  (m.uPk.value.set(n.sc - S / 2, n.sc + S / 2, g * 0.85, 0),
    (m.uBubIn.value = R(t.qAir / 12e-5, 0, 1) * (t.full() ? 1 : 0)),
    wt.U.uTip.value.copy(fe),
    (wt.U.uLen.value = Math.max(0.01, fe.y - l)),
    (wt.U.uV0.value = Math.max(0.05, c)),
    (wt.U.uR0.value = Ba * 0.98),
    (wt.U.uT.value = o),
    (wt.U.uOn.value = C.jet),
    (wt.U.uLight.value = m.uLight.value));
  const x = e.low.o,
    b = x.cx,
    y = x.cz,
    p = (x.shape === "box" ? x.w / 2 : (x.w / 2) * 0.7) - 0.08,
    M = (x.shape === "box" ? x.d / 2 : (x.w / 2) * 0.7) - 0.08,
    w = e.low.U.uFloor.value;
  if (a > 0) {
    if (C.jet > 0.3) {
      const z = ft(c) / 60;
      for (
        Ye.acc += a * z * 320 * C.jet, ze.acc += a * z * 420 * C.jet;
        Ye.acc > 1;
      ) {
        Ye.acc--;
        const k = Math.random() * 6.283,
          V = h * (0.12 + Math.random() * 0.3) * 10,
          E = h * (0.22 + Math.random() * 0.42) * 10;
        Do(
          Ye,
          fe.x + Math.cos(k) * 0.09,
          l + 0.02,
          fe.z + Math.sin(k) * 0.09,
          Math.cos(k) * V,
          E,
          Math.sin(k) * V,
          0.6,
          0.022 + Math.random() * 0.038,
        );
      }
      for (; ze.acc > 1;) {
        ze.acc--;
        const k = Math.random() * 6.283,
          V = Math.random() * 0.16;
        Do(
          ze,
          fe.x + Math.cos(k) * V,
          l - 0.05,
          fe.z + Math.sin(k) * V,
          Math.cos(k) * 0.6,
          -h * (4 + Math.random() * 5),
          Math.sin(k) * 0.6,
          2.2,
          0.016 + Math.random() * 0.035,
        );
      }
    }
    if (!s && t.full() && d > 0.02 && c > 0.05)
      for (ze.acc += a * d * 300; ze.acc > 1;)
        (ze.acc--,
          Do(
            ze,
            fe.x + (Math.random() - 0.5) * 0.1,
            fe.y - 0.05,
            fe.z + (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.8,
            -c * 6,
            (Math.random() - 0.5) * 0.8,
            2.5,
            0.02 + Math.random() * 0.03,
          ));
    if (t.qSquirt > 0 && e.valve)
      for (C.sq += a * 80; C.sq > 1;) {
        C.sq--;
        const z = e.valve.position;
        Do(
          Ye,
          z.x + 0.1,
          z.y - 0.1,
          z.z,
          (Math.random() - 0.2) * 3,
          3 + Math.random() * 3,
          (Math.random() - 0.5) * 2,
          0.8,
          0.02,
        );
      }
  }
  if (
    (Fi(Ye, a, Math.min(l, fe.y) - 0.05),
    Ai(ze, a, l, [b - p, b + p, y - M, y + M, w + 0.04], o),
    e.valve && (e.valve.rotation.y = C.valveRot),
    e.gauge &&
      (e.gauge.userData.needle.rotation.z =
        -R((t.pc / 1e3 - 100) / 10, -1.1, 1.1) * 2.356),
    e.bulb)
  ) {
    const z = t.priming
      ? 0.5 + 0.5 * Math.sin(t.primeT * 2 * Math.PI * 1.4)
      : 0;
    e.bulb.scale.set(0.85 + z * 0.12, 0.85 + z * 0.12, 1.25 - z * 0.35);
  }
  if (A.cur === "lab") {
    (ae.slider.set(C.liftT), ae.slider.mark(Rn()));
    for (const z of ae.btns) {
      const k = z.userData;
      ((k.press += ((k.down > U ? 1 : 0) - k.press) * 0.35),
        (k.cap.position.z = -k.press * 0.03));
    }
    if (U - ae.drawnAt > 0.05) {
      ae.drawnAt = U;
      for (const z of ae.btns) z.userData.scr.userData.redraw(U);
    }
  }
  A.cur === "lab" &&
    U - At.at > 0.066 &&
    ((At.at = U), At.left.userData.redraw(U), At.right.userData.redraw(U));
}
const ae = { drawnAt: 0 };
{
  const e = vn * 0.5;
  (xn(-4.66, 2.4), xn(0.2, 6.6), xn(4.86, 2.05));
  const t = (s, c, f, h, u) => {
      (s.beginPath(),
        s.moveTo(c, f - h),
        s.bezierCurveTo(
          c + h * 0.2,
          f - h * 0.55,
          c + h * 0.62,
          f - h * 0.05,
          c + h * 0.62,
          f + h * 0.3,
        ),
        s.arc(c, f + h * 0.3, h * 0.62, 0, Math.PI, !1),
        s.bezierCurveTo(
          c - h * 0.62,
          f - h * 0.05,
          c - h * 0.2,
          f - h * 0.55,
          c,
          f - h,
        ),
        s.closePath(),
        (s.fillStyle = u),
        s.fill());
    },
    n = Ro(
      -4.66,
      e,
      0.52,
      (s, c, f, h) => {
        const u = c / 2,
          m = L.water(),
          v = 14;
        s.lineCap = "round";
        for (let g = 0; g < v; g++) {
          const S = -Math.PI / 2 + (g / v) * Math.PI * 2 + 0.07,
            x = S + (Math.PI * 2) / v - 0.14,
            b = (g + 0.5) / v <= m + 0.001;
          ((s.strokeStyle = b ? "#ffb454" : "rgba(220,232,245,.55)"),
            (s.lineWidth = b ? 15 : 11),
            s.beginPath(),
            s.arc(u, u, c * 0.42, S, x),
            s.stroke());
        }
        const d = L.priming ? 0.5 + 0.5 * Math.sin(h * 9) : 0;
        (s.save(),
          (s.shadowColor = "#4fc3ff"),
          (s.shadowBlur = 0),
          t(
            s,
            u,
            u + c * 0.02,
            c * 0.27,
            `rgb(${50 + d * 70},${165 + d * 45},255)`,
          ),
          s.restore(),
          (s.fillStyle = "rgba(255,255,255,.6)"),
          s.beginPath(),
          s.ellipse(
            u - c * 0.07,
            u + c * 0.05,
            c * 0.035,
            c * 0.075,
            -0.4,
            0,
            7,
          ),
          s.fill());
      },
      { cw: 256, k: 1.75 },
    );
  ((n.userData.act = oo),
    (n.userData.tip = () =>
      L.full() ? "Primed: the tube is full" : "Prime the tube (1)"),
    (ae.slider = pi(-2.75, 3.1, e)));
  const o = (s, c, f, h) => {
      const u = c / 2,
        m = f === "play" || h;
      if (
        ((s.strokeStyle = m ? "#4fb8ff" : "rgba(150,170,195,.55)"),
        (s.fillStyle = s.strokeStyle),
        (s.lineWidth = m ? 9 : 5),
        s.beginPath(),
        s.arc(u, u, c * 0.4, 0, 7),
        s.stroke(),
        (s.strokeStyle = m ? "#8fdcff" : "rgba(160,180,205,.5)"),
        (s.lineWidth = 7),
        (s.lineJoin = "round"),
        (s.lineCap = "round"),
        f === "play" &&
          (s.beginPath(),
          h
            ? (s.moveTo(u - c * 0.08, u - c * 0.16),
              s.lineTo(u + c * 0.15, u),
              s.lineTo(u - c * 0.08, u + c * 0.16),
              s.closePath(),
              s.stroke())
            : (s.moveTo(u - c * 0.1, u - c * 0.14),
              s.lineTo(u - c * 0.1, u + c * 0.14),
              s.moveTo(u + c * 0.08, u - c * 0.14),
              s.lineTo(u + c * 0.08, u + c * 0.14),
              s.stroke())),
        f === "valve" &&
          (s.beginPath(),
          s.moveTo(u - c * 0.16, u + c * 0.04),
          s.lineTo(u + c * 0.16, u + c * 0.04),
          s.moveTo(u, u + c * 0.04),
          s.lineTo(u, u - c * 0.12),
          s.moveTo(u - c * 0.08, u - c * 0.14),
          s.lineTo(u + c * 0.08, u - c * 0.14),
          s.stroke(),
          h))
      ) {
        s.fillStyle = "#ff8aa0";
        for (let v = 0; v < 3; v++)
          (s.beginPath(),
            s.arc(u + (v - 1) * c * 0.08, u + c * 0.16, c * 0.025, 0, 7),
            s.fill());
      }
      f === "fill" &&
        (s.beginPath(),
        s.arc(u, u, c * 0.16, -0.6, Math.PI * 1.35),
        s.stroke(),
        s.beginPath(),
        s.moveTo(u + c * 0.15, u - c * 0.2),
        s.lineTo(u + c * 0.14, u - c * 0.08),
        s.lineTo(u + c * 0.02, u - c * 0.1),
        s.stroke());
    },
    a = Ro(4.25, e, 0.3, (s, c) => o(s, c, "play", !C.paused), {
      cw: 128,
      k: 1.8,
    });
  ((a.userData.act = () => Eo()),
    (a.userData.tip = () =>
      C.paused ? "Run the water (Space)" : "Pause the water (Space)"));
  const r = Ro(4.87, e, 0.26, (s, c) => o(s, c, "valve", L.leakOpen), {
    cw: 128,
    k: 1.8,
  });
  ((r.userData.act = () => Go()),
    (r.userData.tip = () =>
      L.leakOpen
        ? "Shut the air valve (2)"
        : "Open the air valve at the crest (2)"));
  const l = Ro(5.47, e, 0.26, (s, c) => o(s, c, "fill", !!C.fill), {
    cw: 128,
    k: 1.8,
  });
  ((l.userData.act = no),
    (l.userData.tip = () => "Refill the tanks (3)"),
    (ae.btns = [n, a, r, l]),
    ae.btns.forEach((s) => (s.userData.down = 0)),
    vi(0.2, 0.09, 1.61));
}
const At = { at: 0 };
{
  const e = "#bfe9ff",
    t = "#3aa6e8",
    n = (o, a) => {
      (o.save(),
        (o.strokeStyle = "rgba(120,210,255,.22)"),
        (o.lineWidth += 9),
        a(),
        o.restore(),
        a());
    };
  ((At.left = ga(-5.4, 4.95, 4.7, 2.6, (o, a, r, l) => {
    const s = K,
      c = L,
      f = s.model,
      h = s.src.o,
      u = s.low.o;
    let m = Math.min(h.y0, u.y0 + s.lift(s.u)) - 0.2,
      v = s.P[s.crestI].y + 0.4;
    const d = (w) => r * 0.9 - ((w - m) / (v - m)) * r * 0.78,
      g = s.P.map((w) => w.x),
      S = Math.min(h.cx - h.w / 2, ...g) - 0.3,
      x = Math.max(u.cx + u.w / 2, ...g) + 0.3,
      b = (w) => a * 0.08 + ((w - S) / (x - S)) * a * 0.84,
      y = (w, z, k) => {
        const V = b(w.cx - w.w / 2),
          E = b(w.cx + w.w / 2),
          ue = d(w.y0 + z),
          I = d(w.y0 + w.H + z),
          oe = d(w.y0 + z + k * w.H);
        ((o.fillStyle = t),
          (o.globalAlpha = 0.85),
          o.fillRect(V, oe, E - V, ue - oe),
          (o.globalAlpha = 1),
          (o.strokeStyle = e),
          (o.lineWidth = 4),
          o.beginPath(),
          o.moveTo(V, I),
          o.lineTo(V, ue),
          o.lineTo(E, ue),
          o.lineTo(E, I),
          o.stroke());
      };
    (y(h, 0, c.fs),
      y(u, s.lift(s.u), c.fl),
      s.key === "lab" &&
        ((o.fillStyle = "rgba(190,220,255,.45)"),
        o.fillRect(
          b(-1.02),
          d(m + 0.15),
          b(-0.22) - b(-1.02),
          d(5.96) - d(m + 0.15),
        )),
      (o.lineCap = "round"),
      (o.lineJoin = "round"),
      (o.strokeStyle = "rgba(200,235,255,.9)"),
      (o.lineWidth = 16),
      o.beginPath(),
      s.P.forEach((w, z) =>
        z ? o.lineTo(b(w.x), d(w.y)) : o.moveTo(b(w.x), d(w.y)),
      ),
      o.stroke(),
      (o.strokeStyle = "#0d2240"),
      (o.lineWidth = 10),
      o.stroke(),
      (o.strokeStyle = "#5cc8ff"),
      (o.lineWidth = 9));
    for (const w of c.slugs) {
      o.beginPath();
      let z = !0;
      for (let k = 0; k < j; k++) {
        if (s.S[k] < w.a - 1e-4 || s.S[k] > w.b + 1e-4) continue;
        const V = s.P[k];
        (z ? o.moveTo(b(V.x), d(V.y)) : o.lineTo(b(V.x), d(V.y)), (z = !1));
      }
      o.stroke();
    }
    const p = d(c.hs() / H);
    (o.setLineDash([14, 12]),
      (o.strokeStyle = "#ffc978"),
      (o.lineWidth = 3),
      o.beginPath(),
      o.moveTo(b(h.cx - h.w / 2), p),
      o.lineTo(a * 0.93, p),
      o.stroke(),
      o.setLineDash([]),
      o.beginPath(),
      o.moveTo(a * 0.93, p),
      o.lineTo(a * 0.9, p - 10),
      o.moveTo(a * 0.93, p),
      o.lineTo(a * 0.9, p + 10),
      o.stroke());
    const M = s.P[j - 1];
    ((o.fillStyle = c.headNow() > 0 ? "#7fe3ff" : "#ff8fa3"),
      o.beginPath(),
      o.arc(b(M.x), d(M.y), 9, 0, 7),
      o.fill(),
      (o.font = "500 30px DM Mono, monospace"),
      (o.fillStyle = "#dff6ff"),
      (o.textAlign = "left"),
      o.fillText("SIPHON", a * 0.06, r * 0.13),
      (o.textAlign = "right"),
      (o.fillStyle = "#ffd9a0"),
      o.fillText(
        (c.headNow() >= 0 ? "HEAD " : "HEAD \u2212") +
          Math.abs(c.headNow() * 100).toFixed(1) +
          " cm",
        a * 0.95,
        r * 0.13,
      ));
  })),
    (At.right = ga(4.5, 4.85, 6.7, 2.2, (o, a, r, l) => {
      const s = L,
        c = s.priming ? 1 : s.full() ? 2 : 0,
        f = a * 0.27,
        h = (a - 3 * f) / 4;
      for (let u = 0; u < 3; u++) {
        const m = h + u * (f + h),
          v = r * 0.15,
          d = r * 0.72,
          g = u === c,
          S = g ? 1 : 0.45;
        ((o.globalAlpha = S),
          (o.strokeStyle = g ? "#dff6ff" : "#9ccbe6"),
          (o.lineWidth = g ? 5 : 3),
          zt(o, m, v, f, d, 14),
          o.stroke());
        const x = m + f * 0.12,
          b = f * 0.28,
          y = v + d * 0.9,
          p = v + d * 0.42;
        ((o.strokeStyle = "#cfeeff"),
          (o.lineWidth = 4),
          o.beginPath(),
          o.moveTo(x, p),
          o.lineTo(x, y),
          o.lineTo(x + b, y),
          o.lineTo(x + b, p),
          o.stroke(),
          (o.fillStyle = t),
          o.fillRect(x + 3, p + (y - p) * 0.18, b - 6, (y - p) * 0.82 - 3));
        const M = x + b * 0.65,
          w = m + f * 0.8,
          z = v + d * 0.16,
          k = (w - M) / 2;
        if (
          ((o.lineWidth = 16),
          (o.strokeStyle = "rgba(200,235,255,.85)"),
          o.beginPath(),
          o.moveTo(M, y - (y - p) * 0.2),
          o.lineTo(M, z + k),
          o.arc(M + k, z + k, k, Math.PI, 0),
          o.lineTo(w, v + d * 0.78),
          o.stroke(),
          (o.lineWidth = 9),
          (o.strokeStyle = "#0d2240"),
          o.stroke(),
          u === 0 &&
            ((o.strokeStyle = "#5cc8ff"),
            o.beginPath(),
            o.moveTo(M, y - (y - p) * 0.2),
            o.lineTo(M, p + (y - p) * 0.18),
            o.stroke()),
          u === 1)
        ) {
          const V = g ? s.water() : 0.55;
          (o.setLineDash([16, 12]),
            (o.lineDashOffset = -l * 40),
            (o.strokeStyle = "#5cc8ff"),
            o.beginPath());
          const E =
              (z + k - (y - (y - p) * 0.2)) * -1 +
              Math.PI * k +
              (v + d * 0.78 - z - k),
            ue = V * E;
          o.moveTo(M, y - (y - p) * 0.2);
          let I = ue;
          const oe = Math.min(I, y - (y - p) * 0.2 - z - k);
          if ((o.lineTo(M, y - (y - p) * 0.2 - oe), (I -= oe), I > 0)) {
            const ve = Math.min(I / k, Math.PI);
            (o.arc(M + k, z + k, k, Math.PI, Math.PI + ve), (I -= ve * k));
          }
          (I > 0 && o.lineTo(w, z + k + I), o.stroke(), o.setLineDash([]));
        }
        if (u === 2) {
          ((o.strokeStyle = "#5cc8ff"), o.stroke(), (o.fillStyle = "#8fe6ff"));
          for (let V = 0; V < 4; V++) {
            const E = (l * 1.6 + V / 4) % 1;
            (o.beginPath(),
              o.arc(w, v + d * 0.8 + E * d * 0.14, 4.5, 0, 7),
              o.fill());
          }
          ((o.strokeStyle = "#cfeeff"),
            (o.lineWidth = 4),
            o.beginPath(),
            o.moveTo(w - f * 0.13, v + d * 0.8),
            o.lineTo(w - f * 0.13, y),
            o.lineTo(w + f * 0.13, y),
            o.lineTo(w + f * 0.13, v + d * 0.8),
            o.stroke(),
            (o.fillStyle = t),
            o.fillRect(
              w - f * 0.13 + 3,
              y - d * 0.06,
              f * 0.26 - 6,
              d * 0.06 - 3,
            ));
        }
        if (
          ((o.globalAlpha = 1),
          (o.font = "500 26px DM Mono, monospace"),
          (o.fillStyle = g ? "#ffffff" : "#8fb8d4"),
          (o.textAlign = "center"),
          o.fillText(
            ["1 \xB7 AIR", "2 \xB7 PRIME", "3 \xB7 FLOW"][u],
            m + f / 2,
            v + d + 34,
          ),
          u < 2)
        ) {
          const V = m + f + h / 2,
            E = v + d / 2;
          ((o.strokeStyle = "#bfe9ff"),
            (o.lineWidth = 5),
            o.beginPath(),
            o.moveTo(V - 8, E - 16),
            o.lineTo(V + 8, E),
            o.lineTo(V - 8, E + 16),
            o.stroke());
        }
      }
    })));
}
const Za = {
    room: Y,
    bench: Xe,
    labG: Ce,
    stage: eo,
    exG: Ie,
    studioSet: to,
    stG: Ge,
  },
  ut = {
    lab: {
      bg: "#10151f",
      fog: "#1a2130",
      fogD: 0.0065,
      tone: i.ACESFilmicToneMapping,
      exp: 1,
      env: "show",
      envI: 0.75,
      bloomT: 1.35,
      bloomS: 0.3,
      refl: 0.62,
      hemi: [9414360, 3813414, 0.5],
      sun: [16763279, 2.1],
      sunDir: [0.62, 0.62, 0.48],
      rim: 0.9,
      key2: 0.55,
      satK: 1,
      show: { room: 1, bench: 1, labG: 1 },
      fov: 24,
      ap: [0.75, 0.7],
      light: 0,
      veil: "#0b0f1a",
      wl: [-5.55, 1.12, 5.3, 1.12],
      hb: [0.62, 1.32],
    },
    exploded: {
      bg: "#0a1430",
      fog: "#0c1834",
      fogD: 0.0055,
      tone: i.ACESFilmicToneMapping,
      exp: 1,
      env: "show",
      envI: 0.7,
      bloomT: 1.25,
      bloomS: 0.38,
      refl: 0.35,
      hemi: [8362976, 1449264, 0.5],
      sun: [16763024, 2],
      sunDir: [-0.55, 0.62, 0.55],
      rim: 1.4,
      key2: 0.35,
      satK: 1.08,
      show: { stage: 1, exG: 1 },
      fov: 26,
      light: 0,
      veil: "#081226",
      wl: [-7.5, 1.35, 7.9, 1.35],
      hb: [0.75, 1.4],
    },
    studio: {
      bg: "#efe7dc",
      fog: "#efe7dc",
      fogD: 0.0045,
      tone: i.NeutralToneMapping,
      exp: 0.9,
      env: "studio",
      envI: 0.7,
      bloomT: 2.6,
      bloomS: 0.16,
      refl: 0,
      hemi: [16774374, 12562072, 0.42],
      sun: [16770760, 3.5],
      sunDir: [-0.62, 0.72, 0.42],
      rim: 0.3,
      key2: 0.35,
      satK: 1,
      show: { studioSet: 1, stG: 1 },
      fov: 28,
      ao: 0.45,
      light: 1,
      veil: "#efe7dc",
      wl: [-4.6, 0.75, 4.9, 2.9],
      hb: [0.2, 1.6],
    },
  },
  A = { cur: "lab", next: null, at: -99, out: -99, cam: null };
function Ui(e) {
  ((K = De[e]), K.pose(C.lift, !0), L.setRig(K.model));
}
function _n() {
  const e = ut[A.cur];
  (Z.background.set(e.bg),
    Z.fog.color.set(e.fog),
    (Z.fog.density = e.fogD * T.fog),
    (N.toneMapping = e.tone),
    (N.toneMappingExposure = T.exposure * e.exp),
    (Z.environment = bo[e.env]),
    (Z.environmentIntensity = T.env * e.envI),
    (Ke.threshold = T.bloomThreshold * e.bloomT),
    (Ke.strength = T.bloomStrength * e.bloomS),
    (go.uReflStrength.value = T.reflect * e.refl),
    xo.color.set(e.hemi[0]),
    xo.groundColor.set(e.hemi[1]),
    (xo.intensity = e.hemi[2] * T.fill),
    Q.color.set(e.sun[0]),
    (Q.intensity = e.sun[1] * T.sun),
    Q.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    (on.intensity = e.rim * T.rim),
    (nn.intensity = e.key2 * T.fill),
    (an.value = T.sat * e.satK));
  for (const t in Za) Za[t].visible = !!e.show[t];
  (Ae.setLight(e.light),
    ($.blendMaterial.uniforms.intensity.value = T.ao
      ? T.aoIntensity * (e.ao ?? 1)
      : 0),
    en.classList.toggle("light", !!e.light),
    (ze.im.material.uniforms.uLight.value = e.light),
    Ye.im.material.uniforms.color.value.setRGB(
      ...(e.light ? [0.3, 0.6, 1] : [0.62, 0.95, 1.25]),
    ),
    K !== De[A.cur] && Ui(A.cur),
    $n.forEach((t) =>
      t.classList.toggle("on", t.dataset.v === (A.next || A.cur)),
    ));
}
function Dt(e, t = !1, n = null) {
  if (ut[e]) {
    if (t) {
      ((A.cur = e), (A.next = null), _n(), Nt(n || Ze[e]));
      return;
    }
    if (e === A.cur && !A.next) {
      n && Nt(n);
      return;
    }
    ((A.next = e),
      (A.at = U),
      (A.cam = n),
      (_("#veil").style.background = ut[e].veil),
      $n.forEach((o) => o.classList.toggle("on", o.dataset.v === e)));
  }
}
function qi() {
  const e = _("#veil");
  let t = 0;
  if (A.next) {
    const n = U - A.at;
    ((t = R(n / 0.2, 0, 1)),
      n >= 0.2 &&
        ((A.cur = A.next),
        (A.next = null),
        _n(),
        Nt(A.cam || Ze[A.cur]),
        (A.cam = null),
        (A.out = U),
        (t = 1)));
  } else t = 1 - R((U - A.out) / 0.4, 0, 1);
  e.style.opacity = t.toFixed(3);
}
const Je = { crest: wn(), head: wn(), flow: wn() },
  Hi = new i.Color(0.5, 1.1, 1.6),
  ji = new i.Color(1.75, 1.08, 0.42),
  Fn = new i.Color(1.8, 0.5, 0.62),
  Ki = new i.Color(0.45, 0.9, 1.75),
  $i = new i.Color(1.3, 1.45, 1.6),
  B = new i.Vector3(),
  Ee = new i.Vector3(),
  J = new i.Vector3(),
  Wo = new i.Vector3(),
  Qa = new i.Vector3(),
  jr = new i.Vector3(),
  Kr = [],
  $r = Array.from({ length: 256 }, () => new i.Vector3());
function An(e, t, n, o, a = 1, r = 0.16) {
  Ue.subVectors(t, e);
  const l = Ue.length();
  if (l < 1e-4) return;
  (Ue.divideScalar(l),
    es.subVectors(P.position, t).normalize(),
    Dn.crossVectors(Ue, es).normalize());
  const s = Math.min(r, l * 0.5);
  (ao.copy(t).addScaledVector(Ue, -s),
    Ae.seg(e, ao, ne(e, n), ne(ao, n), o, a, a),
    It.copy(ao).addScaledVector(Dn, s * 0.62),
    Ae.seg(It, t, ne(It, n), ne(t, n), o, a, a),
    It.copy(ao).addScaledVector(Dn, -s * 0.62),
    Ae.seg(It, t, ne(It, n), ne(t, n), o, a, a));
}
const It = new i.Vector3(),
  ao = new i.Vector3(),
  Ue = new i.Vector3(),
  Dn = new i.Vector3(),
  es = new i.Vector3(),
  In = new i.Vector3(),
  Gn = new i.Vector3(),
  Gt = new i.Vector3(),
  so = new i.Vector3(),
  En = new i.Vector3(),
  ts = new i.Vector3();
function Xi(e, t, n, o, a) {
  (ts.subVectors(P.position, e).normalize(),
    En.crossVectors(t, ts).normalize(),
    Gt.copy(e)
      .addScaledVector(t, -n * 0.55)
      .addScaledVector(En, n * 0.62),
    so.copy(e).addScaledVector(t, n * 0.45),
    Ae.seg(Gt, so, ne(Gt, 2.2), ne(so, 2.2), o, a, a),
    Gt.copy(e)
      .addScaledVector(t, -n * 0.55)
      .addScaledVector(En, -n * 0.62),
    Ae.seg(Gt, so, ne(Gt, 2.2), ne(so, 2.2), o, a, a));
}
function Wn(e, t, n, o, a, r = 0.22, l = 0.15) {
  const s = e.distanceTo(t);
  for (let c = 0; c < s; c += r + l) {
    const f = Math.min(s, c + r);
    (In.lerpVectors(e, t, c / s),
      Gn.lerpVectors(e, t, f / s),
      Ae.seg(In, Gn, ne(In, n), ne(Gn, n), o, a, a));
  }
}
const io = new i.Group();
Ie.add(io);
const os = (e) =>
  new i.MeshBasicMaterial({ color: e, fog: !1, transparent: !0, opacity: 1 });
function ns(e) {
  const t = new i.Group(),
    n = os(e),
    o = new i.Mesh(new i.CylinderGeometry(1, 1, 1, 14).translate(0, 0.5, 0), n),
    a = new i.Mesh(new i.ConeGeometry(1, 1, 18).translate(0, 0.5, 0), n);
  return (
    t.add(o, a),
    io.add(t),
    (t.userData = {
      m: n,
      set(r, l, s, c) {
        Ue.subVectors(l, r);
        const f = Ue.length();
        if (f < 0.001) {
          t.visible = !1;
          return;
        }
        ((t.visible = !0), Ue.divideScalar(f));
        const h = Math.min(c, f * 0.6);
        (t.position.copy(r),
          t.quaternion.setFromUnitVectors(zo, Ue),
          o.scale.set(s, f - h, s),
          (a.position.y = f - h),
          a.scale.set(s * 2.6, h, s * 2.6));
      },
    }),
    t
  );
}
const Yi = [0, 1, 2].map(() => ns(new i.Color(1.5, 0.45, 0.5))),
  Ji = [0, 1].map(() => ns(new i.Color(0.45, 0.95, 1.7))),
  Zi = [0, 1, 2, 3].map(() => {
    const e = os(new i.Color(0.4, 1.15, 1.7)),
      t = new i.Mesh(new i.BufferGeometry(), e),
      n = new i.Mesh(
        new i.ConeGeometry(0.2, 0.46, 18).translate(0, 0.23, 0),
        e,
      );
    return (io.add(t, n), { tube: t, hd: n, m: e, key: "" });
  });
function Qi() {
  const e = De.exploded,
    t = L,
    n = e.model;
  if (((io.visible = A.cur === "exploded"), !io.visible)) return;
  const o = (q - t.pc) / 1e3,
    a = R(o / 4, 0, 1.3),
    r = e.P[e.crestI];
  (e.dirAt(n.sc, qe),
    Yi.forEach((m, v) => {
      const d = v - 1;
      J.copy(r).addScaledVector(qe, d * 0.62);
      const g = 0.5 + a * 0.55;
      (B.set(J.x, J.y + Rt + 0.16 + g, J.z),
        Ee.set(J.x, J.y + Rt + 0.14, J.z),
        m.userData.set(B, Ee, 0.055, 0.3),
        (m.userData.m.opacity = o > 0.05 ? 1 : 0),
        (m.visible = o > 0.05));
    }),
    [
      [e.src.o, t.hs() / H],
      [e.low.o, t.hl() / H],
    ].forEach(([m, v], d) => {
      const g = m.cx + (d ? 0.75 : 0);
      (B.set(g, v + 1.25, m.cz + 0.25),
        Ee.set(g, v + 0.1, m.cz + 0.25),
        Ji[d].userData.set(B, Ee, 0.06, 0.34));
    }));
  const l = t.full(),
    s = t.out,
    c = l && Math.abs(s) > 0.03,
    f = R(Math.abs(s) / 1.1, 0.45, 1),
    h = s >= 0 ? 1 : -1,
    u = e.u.toFixed(4) + "|" + h;
  Zi.forEach((m, v) => {
    if (
      ((m.tube.visible = m.hd.visible = c),
      (m.m.opacity = f),
      !c || m.key === u)
    )
      return;
    m.key = u;
    const [d, g] = [
        [0.1, 0.23],
        [0.36, 0.46],
        [0.57, 0.67],
        [0.79, 0.9],
      ][v],
      S = n.L,
      x = [];
    for (let p = 0; p <= 12; p++) {
      const M = tt(d, g, p / 12) * S,
        w = e.at(M, new i.Vector3());
      (e.dirAt(M, qe),
        Wo.set(-qe.y, qe.x, 0).normalize(),
        Wo.y < 0 && Wo.negate(),
        w.addScaledVector(Wo, 0.78),
        x.push(w));
    }
    h < 0 && x.reverse();
    const b = x.pop(),
      y = x[x.length - 1];
    (m.tube.geometry.dispose(),
      (m.tube.geometry = new i.TubeGeometry(
        new i.CatmullRomCurve3(x),
        24,
        0.07,
        10,
      )),
      m.hd.position.copy(y),
      m.hd.quaternion.setFromUnitVectors(zo, Ue.subVectors(b, y).normalize()),
      m.hd.scale.setScalar(1));
  });
}
const as = new i.Vector3(),
  ss = new i.Vector3(),
  No = new i.Vector3(),
  qe = new i.Vector3();
function er(e) {
  Ae.begin();
  const t = K,
    n = L,
    o = t.model,
    a = ut[A.cur],
    r = A.cur === "exploded",
    l = A.cur === "studio",
    s = Vt ? 1 : 0,
    c = n.hs() / H,
    f = n.hl() / H,
    h = t.P[j - 1],
    u = n.headNow(),
    m = n.full(),
    v = n.out;
  (as.set(a.wl[0], c, a.wl[1]),
    ss.set(a.wl[2], c, a.wl[3]),
    Wn(as, ss, 2.1, ji, 0.8 * s + 0.2));
  const d = Math.max(h.y, f),
    g = h.x + a.hb[0],
    S = h.z + a.hb[1],
    x = u >= 0 ? Hi : Fn;
  Math.abs(c - d) > 0.08 &&
    (B.set(g, c, S),
    Ee.set(g, d, S),
    An(u >= 0 ? B : Ee, u >= 0 ? Ee : B, 2.2, x, 0.9 * s + 0.1, 0.14),
    J.set(g - 0.14, d, S),
    B.set(g + 0.14, d, S),
    Ae.seg(J, B, ne(J, 2), ne(B, 2), x, 0.9, 0.9),
    J.set(h.x, d, h.z),
    B.set(g, d, S),
    Wn(J, B, 1.4, x, 0.55, 0.08, 0.07));
  const b = 0.07;
  for (const I of n.slugs) {
    if (Math.abs(I.v) < 0.02) continue;
    const oe = Math.sign(I.v),
      ve = R(Math.abs(I.v) / 0.9, 0.3, 1),
      ho = (((I.ph * 0.4) % b) + b) % b;
    for (let qt = I.a + ho; qt < I.b - 0.01; qt += b)
      qt < 0.02 ||
        (t.at(qt, No),
        t.dirAt(qt, qe).multiplyScalar(oe),
        Qa.subVectors(P.position, No).normalize(),
        No.addScaledVector(Qa, Rt + 0.05),
        Xi(No, qe, r ? 0.12 : 0.09, $i, ve * (0.55 + 0.45 * s)));
  }
  const y = (q - n.pc) / 1e3,
    p = R(y / 4, 0, 1.2),
    M = t.crestI,
    w = t.P[M];
  if (y > 0.05 && !r && Vt) {
    t.dirAt(o.sc, qe);
    for (const I of [-1, 0, 1]) {
      const oe = (r ? 0.45 : 0.32) + p * (r ? 0.55 : 0.42);
      (J.copy(w).addScaledVector(qe, I * (r ? 0.62 : 0.36)),
        B.set(J.x, J.y + Rt + 0.14 + oe, J.z),
        Ee.set(J.x, J.y + Rt + 0.12, J.z),
        !(!r && t.valve && I === 0) &&
          An(B, Ee, r ? 7 : 2.4, Fn, r ? 1 : 0.7, r ? 0.42 : 0.14));
    }
  }
  if (r)
    for (const [I, oe] of [
      [t.src.o, c],
      [t.low.o, f],
    ])
      (J.set(I.cx - I.w / 2 - 0.1, oe + 0.01, I.cz + I.d / 2 + 0.1),
        B.set(I.cx + I.w / 2 + 0.1, oe + 0.01, I.cz + I.d / 2 + 0.1),
        Wn(J, B, 1.8, Ki, 0.8, 0.2, 0.13));
  if (t.valve && n.qAir > 1e-6) {
    const I = t.valve.position,
      oe = R(n.qAir / 15e-5, 0.35, 1),
      ve = (e * 1.6) % 1;
    (B.set(I.x + 0.85 - ve * 0.25, I.y - 0.1, I.z),
      Ee.set(I.x + 0.2, I.y - 0.1, I.z),
      An(B, Ee, 2.4, Fn, oe * (0.6 + 0.4 * Math.sin(e * 9)), 0.14));
  }
  (Ae.end(),
    Qi(),
    Je.crest.userData.set(
      "Crest",
      (n.pc / 1e3).toFixed(1) + " kPa",
      y > 0 ? "#ff8fa3" : "#7fe3ff",
    ),
    (Je.crest.userData.want = s),
    bn(Je.crest, B.set(w.x, w.y + (t.valve ? 0.95 : 0.55), w.z), 25),
    Je.head.userData.set(
      "Head",
      (u >= 0 ? "" : "\u2212") + Math.abs(u * 100).toFixed(1) + " cm",
      u >= 0 ? "#7fe3ff" : "#ff8fa3",
    ),
    (Je.head.userData.want = s * (Math.abs(c - d) > 0.08 ? 1 : 0)),
    bn(Je.head, B.set(g + 0.2, (c + d) / 2, S), 25));
  const z = ft(v);
  let k = "",
    V = "",
    E = "#7fe3ff";
  (n.priming
    ? ((k = "Priming"),
      (V = Math.round(n.water() * 100) + " %"),
      (E = "#ffb454"))
    : m && z > 0.3
      ? ((k = "Flow"), (V = z.toFixed(1) + " L/min"))
      : m && z < -0.3
        ? ((k = "Back"), (V = (-z).toFixed(1) + " L/min"), (E = "#ff8fa3"))
        : !m &&
          C.break &&
          ((k = "Air"),
          (V =
            C.break === "leak"
              ? "column split"
              : C.break === "outlet"
                ? "drained back"
                : C.break === "level"
                  ? "head ran out"
                  : C.break === "inlet"
                    ? "in at the inlet"
                    : "no prime"),
          (E = "#ff8fa3")),
    Je.flow.userData.set(k || "Flow", V || "\u2014", E),
    (Je.flow.userData.want = s * (k ? 1 : 0)));
  const ue = o.sc + (o.L - o.sc) * 0.45;
  (t.at(ue, B),
    t.dirAt(ue, qe),
    bn(Je.flow, B.set(B.x + 0.55, B.y + 0.1, B.z + 0.2), 25));
}
const Ze = {
    lab: {
      t: [-0.34, 3.36, 1.11],
      yaw: 0.033,
      pitch: 0.35,
      dist: 20,
      f: [0, 4, 0],
      r: 8,
      fit: [15.1, 8.5],
    },
    exploded: {
      t: [-0.45, 4.85, 0],
      yaw: 0.03,
      pitch: 0.11,
      dist: 21.5,
      f: [0, 5, 0],
      r: 6.5,
      fit: [19.4, 11.2],
    },
    studio: {
      t: [0.3, 3.35, 0.4],
      yaw: -0.5,
      pitch: 0.36,
      dist: 22,
      f: [0.2, 3, 0.3],
      r: 7,
      fit: [18.4, 10.8],
    },
  },
  is = {
    lab: {
      t: [-0.6, 3.9, -0.1],
      yaw: -0.66,
      pitch: 0.3,
      dist: 27,
      f: [0, 4, 0],
      r: 9,
    },
    exploded: {
      t: [-0.6, 4.9, 0],
      yaw: -0.62,
      pitch: 0.16,
      dist: 31,
      f: [0, 5, 0],
      r: 9,
    },
    studio: {
      t: [-0.5, 3.2, 0.3],
      yaw: -0.82,
      pitch: 0.34,
      dist: 26,
      f: [0, 3, 0],
      r: 8,
    },
  },
  tr = (e, t) => (Et && P.aspect < 0.8 && e === Ze[t] ? { ...e, ...is[t] } : e),
  G = { t: new i.Vector3(0, 3, 0), yaw: 0, pitch: 0.2, dist: 15 };
let Bo = 4,
  We = 1,
  Oo = 1,
  Et = !1,
  Ve = !1,
  Uo = !1,
  Nn = [14.6, 6.4],
  rs = 15;
const Pe = N.domElement,
  gt = new Map();
let qo = 0,
  Wt = null,
  me = null,
  Ho = null,
  yt = null;
const ro = new i.Raycaster(),
  ls = new i.Vector2();
function Nt(e) {
  Kn = !0;
  const t = tr(e, A.cur);
  (G.t.set(...t.t),
    (G.yaw = t.yaw),
    (G.pitch = t.pitch),
    (G.dist = t.dist),
    Tt.set(...t.f),
    (Bo = t.r),
    t.fit && ((Nn = t.fit), (rs = t.dist)),
    (We = 1),
    (Ve = !1),
    Ls());
}
const cs = [],
  Ne = (e, t, n = {}) => {
    e.traverse((o) => {
      o.isMesh &&
        !o.material?.uniforms?.uLevel &&
        ((o.userData.hk = { kind: t, ...n }), cs.push(o));
    });
  };
for (const e in De) {
  const t = De[e];
  (Ne(t.wall.mesh, "tube"),
    t.lowGrp.children.forEach((n) => {
      n !== t.low.grp && Ne(n, "outlet");
    }),
    t.low.glass.forEach((n) => Ne(n, "outlet")),
    t.src.glass.forEach((n) => Ne(n, "source")),
    t.valve && Ne(t.valve, "valve"),
    t.gauge && Ne(t.gauge, "gauge"),
    t.bulb && Ne(t.bulb, "bulb"));
}
(Ne(ae.slider.hit, "slider"),
  Ne(ae.slider.knob, "slider"),
  ae.btns.forEach((e, t) => Ne(e, "btn", { i: t })),
  ka.forEach((e) => Ne(e.hit, "link", { L: e })));
function Bn(e) {
  const t = Pe.getBoundingClientRect();
  (ls.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    ro.setFromCamera(ls, P));
}
function On(e) {
  Bn(e);
  const t = ro.intersectObjects(
    cs.filter((n) => n.visible && or(n)),
    !1,
  )[0];
  return t
    ? { ...t.object.userData.hk, point: t.point, dist: t.distance }
    : null;
}
const or = (e) => {
    let t = e;
    for (; t.parent; t = t.parent) if (!t.visible) return !1;
    return t === Z && t.visible;
  },
  fs = new i.Plane(),
  us = new i.Vector3(),
  hs = new i.Vector3();
function nr(e) {
  const t = K;
  (hs.set(P.position.x - e.point.x, 0, P.position.z - e.point.z).normalize(),
    fs.setFromNormalAndCoplanarPoint(hs, e.point),
    (yt = { y0: e.point.y, l0: C.liftT * t.liftMax }),
    (vt = !0));
}
function ar(e) {
  yt &&
    (Bn(e),
    ro.ray.intersectPlane(fs, us) && bt((yt.l0 + (us.y - yt.y0)) / K.liftMax));
}
function sr(e) {
  if (e)
    switch (e.kind) {
      case "tube":
        L.full()
          ? be(
              ft(L.out) > 0.3
                ? "Flowing: " + ft(L.out).toFixed(1) + " L/min"
                : "Full, but no head: nothing to drive it",
            )
          : oo();
        break;
      case "bulb":
        oo();
        break;
      case "valve":
        Go();
        break;
      case "gauge":
        be(
          "The crest: " +
            (L.pc / 1e3).toFixed(1) +
            " kPa, " +
            ((q - L.pc) / 1e3).toFixed(1) +
            " kPa under the air outside",
        );
        break;
      case "source":
        be("Its surface sets the waterline: the outlet must sit below it");
        break;
      case "btn": {
        const t = ae.btns[e.i];
        ((t.userData.down = U + 0.18), t.userData.act());
        break;
      }
      case "link":
        window.open(Es, "_blank", "noopener");
        break;
    }
}
function Un(e, t) {
  const n =
      (P.position.distanceTo(G.t) *
        2 *
        Math.tan(i.MathUtils.degToRad(P.fov / 2))) /
      Math.max(ht.clientHeight, 1),
    o = Math.cos(G.yaw),
    a = Math.sin(G.yaw);
  ((Ve = !0),
    (G.t.x = R(G.t.x - o * e * n, -12, 12)),
    (G.t.z = R(G.t.z + a * e * n, -6, 8)),
    (G.t.y = R(G.t.y + t * n, 0.5, 10)));
}
const ds = {
    tube: () =>
      L.full() ? "The tube: full, so it siphons" : "Empty tube: click to prime",
    outlet: () => "Drag the lower tank up or down",
    bulb: () => "The priming bulb: click to prime",
    valve: () =>
      L.leakOpen ? "Shut the air valve" : "Open the air valve at the crest",
    gauge: () => "Crest pressure " + (L.pc / 1e3).toFixed(1) + " kPa",
    source: () => "The upper tank",
    slider: () => "Drag to raise or lower the outlet",
    btn: (e) => ae.btns[e.i].userData.tip(),
    link: () => "@RYANSAEL on X",
  },
  Mt = _("#tip");
let lo = null;
function ir(e) {
  const t = On(e),
    n = t?.kind === "link" ? t.L : null;
  (n !== lo && (lo?.over(!1), n?.over(!0), (lo = n)),
    (Pe.style.cursor = t
      ? t.kind === "slider"
        ? "ew-resize"
        : t.kind === "outlet"
          ? "ns-resize"
          : "pointer"
      : ""));
  const o = t && ds[t.kind] ? ds[t.kind](t) : "";
  o
    ? ((Mt.textContent = o),
      (Mt.style.left = e.clientX + "px"),
      (Mt.style.top = e.clientY + "px"),
      Mt.classList.add("on"))
    : Mt.classList.remove("on");
}
(Pe.addEventListener("contextmenu", (e) => e.preventDefault()),
  Pe.addEventListener("pointerleave", () => {
    (lo?.over(!1),
      (lo = null),
      Mt.classList.remove("on"),
      (Pe.style.cursor = ""));
  }),
  Pe.addEventListener("pointerdown", (e) => {
    ie();
    try {
      Pe.setPointerCapture(e.pointerId);
    } catch {}
    (Mt.classList.remove("on"),
      gt.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (Wt = null));
    const t = e.button === 0 && !e.shiftKey && gt.size === 1 ? On(e) : null;
    if (
      ((Ho = t),
      (me =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null),
      t?.kind === "slider")
    ) {
      Uo = vt = !0;
      const n = ae.slider.fromRay(ro);
      n != null && bt(n);
    }
    t?.kind === "outlet" && nr(t);
  }),
  Pe.addEventListener("pointermove", (e) => {
    const t = gt.get(e.pointerId);
    if (!t) {
      ir(e);
      return;
    }
    const n = e.clientX - t[0],
      o = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), Uo)) {
      Bn(e);
      const a = ae.slider.fromRay(ro);
      a != null && bt(a);
      return;
    }
    if (yt) {
      (me &&
        Math.hypot(e.clientX - me[0], e.clientY - me[1]) > 4 &&
        (me = null),
        ar(e));
      return;
    }
    if (
      (me &&
        Math.hypot(e.clientX - me[0], e.clientY - me[1]) > 6 &&
        (me = null),
      !me)
    ) {
      if (((Ve = !0), gt.size === 2)) {
        const [a, r] = [...gt.values()],
          l = Math.hypot(a[0] - r[0], a[1] - r[1]),
          s = [(a[0] + r[0]) / 2, (a[1] + r[1]) / 2];
        (qo && (We = R((We * qo) / l, 0.3, 2.2)),
          (qo = l),
          Wt && Un(s[0] - Wt[0], s[1] - Wt[1]),
          (Wt = s));
        return;
      }
      t[2]
        ? Un(n, o)
        : ((G.yaw -= n * 0.004),
          (G.pitch = R(G.pitch + o * 0.003, -0.05, 1.35)));
    }
  }));
const ps = (e) => {
  (me &&
    gt.size === 1 &&
    performance.now() - me[2] < 450 &&
    !Uo &&
    !(yt && Ho?.kind !== "outlet") &&
    sr(Ho),
    (me = null),
    (Ho = null),
    (Uo = !1),
    (yt = null),
    (vt = !1),
    gt.delete(e.pointerId),
    (qo = 0),
    (Wt = null));
};
(Pe.addEventListener("pointerup", ps),
  Pe.addEventListener("pointercancel", (e) => {
    ((me = null), ps(e));
  }),
  Pe.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        ie(),
        (Ve = !0),
        (We = R(
          We * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.3,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const Bt = new Set();
(addEventListener("keyup", (e) => Bt.delete(e.key.toLowerCase())),
  addEventListener("blur", () => Bt.clear()));
const rr = new i.Vector3();
function lr() {
  if (!Bt.size) return;
  const e = (Bt.has("shift") ? 2.4 : 1) * xt,
    t = (...a) => a.some((r) => Bt.has(r));
  let n = 0,
    o = 0;
  (t("a", "arrowleft") && (n += 1),
    t("d", "arrowright") && (n -= 1),
    t("w", "arrowup") && (o += 1),
    t("s", "arrowdown") && (o -= 1),
    (n || o) &&
      (Un(n * e * 420, 0),
      G.t.addScaledVector(
        rr.set(-Math.sin(G.yaw), 0, -Math.cos(G.yaw)),
        o * e * 5,
      )),
    t("q") && (G.yaw += e * 1.1),
    t("e") && (G.yaw -= e * 1.1),
    t("=", "+") && (We = R(We * Math.exp(-e * 1.3), 0.3, 2.2)),
    t("-", "_") && (We = R(We * Math.exp(e * 1.3), 0.3, 2.2)),
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
    ) && (Ve = !0),
    (G.t.x = R(G.t.x, -12, 12)),
    (G.t.z = R(G.t.z, -5.5, 9)));
}
let St = !0,
  Ot = -99,
  jo = -1,
  se = null,
  ms = null,
  co = 0;
function vs() {
  ((C.fill = null),
    (L.fs = ct[0]),
    (L.fl = ct[1]),
    (L.leakOpen = !1),
    (L.leakLin = 0),
    (L.leak = 0),
    (C.liftT = C.lift = 0),
    K.pose(0),
    L.setRig(K.model),
    L.fillFull(),
    (C.wasFull = !0),
    (C.break = null));
}
const qn = () => {
    L.full() || ((L.leakOpen = !1), (L.leakLin = 0), L.fillFull());
  },
  xs = () => {
    ((C.fill = null),
      (L.fs = ct[0]),
      (L.fl = ct[1]),
      (L.leakOpen = !1),
      (L.leakLin = 0),
      (L.leak = 0),
      L.fillFull(),
      (C.wasFull = !0),
      (C.break = null));
  },
  Ko = (e) => () => bt(e),
  ws = (e) => () => {
    ((L.leakOpen = e), e || (L.leakLin = Math.min(L.leakLin, 0.2)));
  },
  bs = () => {
    L.full() || L.prime();
  },
  Hn = [
    { view: "lab", ...Ze.lab, dy: 0.003, hold: 11, wide: 1, beats: [[0, vs]] },
    {
      view: "lab",
      t: [-0.55, 5.9, -0.2],
      yaw: 0.32,
      pitch: 0.1,
      dist: 6.8,
      dy: 0.01,
      f: [-0.62, 6.2, -0.2],
      r: 2.1,
      hold: 11.5,
      beats: [
        [0, qn],
        [1.4, ws(!0)],
        [7.6, ws(!1)],
        [7.7, bs],
      ],
    },
    {
      view: "lab",
      t: [1.9, 4.1, 0.4],
      yaw: -0.34,
      pitch: 0.14,
      dist: 12.5,
      dy: 0.008,
      f: [2.5, 4.1, 0],
      r: 3.4,
      hold: 11.5,
      beats: [
        [0, qn],
        [0.9, Ko(1)],
        [5.8, Ko(0)],
        [6.9, bs],
      ],
    },
    {
      view: "exploded",
      ...Ze.exploded,
      dy: 0.004,
      hold: 10,
      wide: 1,
      beats: [[0, xs]],
    },
    {
      view: "studio",
      ...Ze.studio,
      dy: -0.006,
      hold: 9,
      wide: 1,
      beats: [[0, xs]],
    },
    {
      view: "lab",
      t: [-1.3, 1.45, 2.1],
      yaw: 0.12,
      pitch: 0.16,
      dist: 9,
      dy: 0.005,
      f: [-1.3, 1.1, 2.1],
      r: 2,
      hold: 8,
      beats: [
        [0, qn],
        [0.6, () => no()],
        [2.6, Ko(0.35)],
        [5.4, Ko(0)],
      ],
    },
  ];
function gs(e, t) {
  ((jo = e), (se = Hn[e]), (co = 0));
  const n = Et && P.aspect < 0.8 && se.wide ? { ...se, ...is[se.view] } : se;
  ((ms = n),
    se.view && se.view !== (A.next || A.cur)
      ? (Dt(se.view, !1, n), (Ot = t + 0.2))
      : (Nt(n), (Ot = t)));
}
function cr(e) {
  (e < Ot - 1 && (Ot = e),
    (!se || e - Ot > se.hold) && gs((jo + 1) % Hn.length, e));
  const t = e - Ot;
  if (t < 0) return;
  for (; co < se.beats.length && t >= se.beats[co][0];)
    (se.beats[co][1](), co++);
  if (Ve) return;
  const n = ms || se;
  ((G.yaw = n.yaw + t * se.dy),
    (G.dist = n.dist * (1 - t * 0.006)),
    Tt.set(...n.f),
    (Bo = n.r));
}
function Ut(e) {
  ((St = e),
    _("#cine").classList.toggle("on", e),
    _("#cine").setAttribute("aria-pressed", e),
    e && ((se = null), (jo = -1), (Ve = !1), (We = 1)));
}
let fo = null;
const ie = () => {
  ((fo = null), St && Ut(!1));
};
function jn() {
  (Ut(!1), Nt(Ze[A.cur]));
}
let $o = 1,
  Kn = !0;
function fr(e) {
  const t = Ve ? 0 : Math.sin(e / 8) * 0.02,
    n = St ? se?.wide : fo ? fo.wide : !0,
    o = n ? Oo : tt(1, Oo, 0.5);
  (($o = Kn ? o : $o + (o - $o) * (1 - Math.exp(-xt * 3))), (Kn = !1));
  const a = G.dist * We * $o,
    r = G.yaw + t,
    l = Math.asin(R((0.35 - G.t.y) / Math.max(a, 0.1), -1, 1));
  let s = Math.max(G.pitch, l);
  const c = Math.cos(s);
  if (
    (P.position.set(
      G.t.x + Math.sin(r) * c * a,
      G.t.y + Math.sin(s) * a,
      G.t.z + Math.cos(r) * c * a,
    ),
    A.cur === "lab" &&
      ((P.position.z = Math.max(P.position.z, O + 1.2)),
      (P.position.y = Math.min(P.position.y, le - 0.6)),
      (P.position.x = R(P.position.x, -16, Po - 0.6))),
    A.cur === "studio" &&
      ((P.position.z = Math.max(P.position.z, -14.5)),
      (P.position.y = Math.min(P.position.y, 45)),
      (P.position.x = R(P.position.x, -60, 60))),
    A.cur === "exploded")
  ) {
    const v = Math.hypot(P.position.x, P.position.z);
    v > 110 && ((P.position.x *= 110 / v), (P.position.z *= 110 / v));
  }
  if ((P.lookAt(G.t), !St && !Ve)) {
    const v = fo || Ze[A.cur];
    (Tt.set(...v.f), (Bo = v.r));
  }
  const f = P.position.distanceTo(Ve ? G.t : Tt),
    h = Ve ? Math.min(1, xt * 5) : 1,
    u = (Ve ? Math.max(2.4, f * 0.3) : Bo) * T.focalBand;
  ((Se.u.focus.value += (f - Se.u.focus.value) * h),
    (Se.u.range.value += (u - Se.u.range.value) * h));
  const m = ut[A.cur].ap || [1, 1];
  Se.u.cocScale.value.set(T.apertureNear * m[0], T.aperture * m[1]);
}
const $n = [...document.querySelectorAll("#seg-view button")];
($n.forEach(
  (e) =>
    (e.onclick = () => {
      (ie(), Dt(e.dataset.v));
    }),
),
  (_("#b-prime").onclick = () => {
    (ie(), oo());
  }),
  (_("#b-leak").onclick = () => {
    (ie(), Go());
  }),
  (_("#b-fill").onclick = () => {
    (ie(), no());
  }),
  (_("#pause").onclick = () => {
    (ie(), Eo());
  }));
{
  const e = _("#slide");
  let t = !1;
  const n = (o) => {
    const a = e.getBoundingClientRect();
    bt((o.clientX - a.left) / a.width);
  };
  (e.addEventListener("pointerdown", (o) => {
    (ie(), (t = !0), (vt = !0), e.setPointerCapture(o.pointerId), n(o));
  }),
    e.addEventListener("pointermove", (o) => {
      t && n(o);
    }),
    e.addEventListener("pointerup", () => {
      ((t = !1), (vt = !1));
    }),
    e.addEventListener("pointercancel", () => {
      ((t = !1), (vt = !1));
    }),
    e.addEventListener("keydown", (o) => {
      (o.key === "ArrowLeft" || o.key === "ArrowRight") &&
        (o.preventDefault(),
        o.stopPropagation(),
        ie(),
        bt(C.liftT + (o.key === "ArrowLeft" ? -0.04 : 0.04)));
    }));
}
let ys = 0;
const uo = (e) => Math.abs(e * 100).toFixed(1) + " cm",
  ur = (e) => (e / 1e3).toFixed(1) + " kPa";
function Xn() {
  const e = K,
    t = e.P[j - 1].y * H,
    n = L.hs();
  return t - n;
}
function hr() {
  const e = L,
    t = K,
    n = e.headNow(),
    o = ft(e.out),
    a = e.out,
    r = (q - e.pc) / 1e3,
    l = e.hl(),
    s = t.P[j - 1].y * H,
    c = l > s + 0.002,
    f = e.full(),
    h = c ? "the lower tank's surface" : "the outlet";
  return e.priming
    ? `<b>Priming</b>: the bulb draws the air out and the water climbs after it, up the short leg and over the crest: the tube is <span class="a">${Math.round(e.water() * 100)} %</span> full.`
    : f && e.leakOpen && e.qAir > 1e-6
      ? `The air valve is open and the crest sits <b>${r.toFixed(1)} kPa</b> below the air outside, so air is sucked <i>in</i>: nothing squirts out. The bubbles make the long leg lighter; the flow is down to <span class="r">${Math.max(0, o).toFixed(1)} L/min</span>.`
      : f && o > 0.3
        ? `${c ? "The lower tank's surface" : "The outlet"} is <b>${uo(n)}</b> below the upper tank's surface, so the long leg outweighs the short one: water climbs the wall at <span class="c">${a.toFixed(2)} m/s</span> (<b>${o.toFixed(1)} L/min</b>). At the crest it is pulled from both sides: <b>${ur(e.pc)}</b>, ${r.toFixed(1)} kPa under the air.`
        : f && o < -0.3
          ? `The lower tank's surface is now <b>${uo(-n)}</b> above the upper one's: with both ends under water the siphon simply runs <span class="r">backwards</span>, ${(-o).toFixed(1)} L/min back over the wall.`
          : f
            ? Math.abs(n) < 0.004
              ? "The two surfaces are level: no head, no flow. The tube is still full, so lower the outlet (or refill) and it runs again."
              : `${c ? "The lower surface" : "The outlet"} is ${uo(n)} ${n > 0 ? "below" : "above"} the waterline: the flow is settling.`
            : C.break === "leak" || (e.leakOpen && !f)
              ? 'Air got in at the crest and split the column: each leg drains back into its own tank. <span class="r">A siphon cannot pull through air.</span> Shut the valve and prime to start again.'
              : C.break === "outlet" || Xn() > 0
                ? `The outlet is <b>${uo(Math.max(0, Xn()))}</b> above the waterline: the long leg is no longer the heavy one, so the column ran back into the upper tank and the tube <span class="r">lost its prime</span>. Lower it and prime.`
                : C.break === "level"
                  ? `The upper tank's surface fell to the outlet: with no head left the column hung, slipped back and the tube <span class="r">lost its prime</span>. Lower the outlet (or refill) and prime.`
                  : C.break === "inlet"
                    ? "The upper tank ran down to its inlet: air got in at the bottom and the tube emptied. Refill and prime."
                    : "The tube is full of air, and a siphon only runs <b>full</b>. Prime it: the water climbs the short leg, crosses the crest and falls down the long one, and then gravity keeps it going.";
}
function kt(e) {
  if (!e && U - ys < 0.1) return;
  ys = U;
  const t = L,
    n = t.headNow(),
    o = ft(t.out);
  ((_("#s-a").innerHTML =
    (n < 0 ? "\u2212" : "") +
    Math.abs(n * 100).toFixed(1) +
    " <small>cm</small>"),
    _("#st-h").classList.toggle("neg", n < 0),
    (_("#s-b").innerHTML =
      (t.full() ? Math.abs(o) : 0).toFixed(1) + " <small>L/min</small>"),
    (_("#s-c").innerHTML = (t.pc / 1e3).toFixed(1) + " <small>kPa</small>"));
  const a = C.liftT * 100,
    r = Xn(),
    l = R(Rn(), 0, 1) * 100;
  ((_("#slide-kn").style.left = a + "%"),
    (_("#slide-fl").style.left = Math.min(a, l) + "%"),
    (_("#slide-fl").style.width = Math.abs(l - a) + "%"),
    _("#slide-fl").classList.toggle("neg", r > 0),
    (_("#slide-v").textContent = uo(r) + (r > 0 ? " above" : " below")),
    _("#slide-v").classList.toggle("neg", r > 0));
  const s = Rn();
  ((_("#slide-wl").style.left = R(s, 0, 1) * 100 + "%"),
    (_("#slide-wl").style.opacity = s >= 0 && s <= 1 ? 1 : 0),
    _("#slide").setAttribute("aria-valuenow", Math.round(a)),
    _("#slide").setAttribute(
      "aria-valuetext",
      _("#slide-v").textContent + " the waterline",
    ));
  const c = _("#b-prime");
  ((c.textContent = t.priming
    ? "Priming\u2026"
    : t.full()
      ? "Primed"
      : "Prime"),
    c.classList.toggle("go", !t.full() && !t.priming));
  const f = _("#b-leak");
  (f.classList.toggle("warn", t.leakOpen),
    f.setAttribute("aria-pressed", t.leakOpen),
    (f.textContent = t.leakOpen ? "Valve open" : "Air valve"));
  const h = hr();
  h !== kt.w && ((_("#why").innerHTML = h), (kt.w = h));
}
const Qe = [
  ["pixelRatio", "Pixel ratio", 0.6, 2, 0.05, (e) => e.toFixed(2)],
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
let Be = 0,
  Ms = 0,
  Yn = 0,
  Xo = 0,
  Yo = 0;
function we() {
  (N.setPixelRatio(T.pixelRatio),
    ye.setPixelRatio(T.pixelRatio),
    Kt.rt.samples !== T.msaa && ((Kt.rt.samples = T.msaa), Kt.rt.dispose()),
    (ha.enabled = !!T.smaa),
    Q.shadow.mapSize.x !== T.shadow &&
      (Q.shadow.mapSize.set(T.shadow, T.shadow),
      Q.shadow.map?.dispose(),
      (Q.shadow.map = null)),
    (Ke.enabled = !!T.bloom),
    (Ke.radius = T.bloomRadius),
    ($.enabled = !0),
    $.updateGtaoMaterial({
      radius: T.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: T.ao ? T.aoSamples : 2,
    }),
    (Se.enabled = !!T.dof),
    (Se.u.maxCoc.value = T.maxCoc),
    _n(),
    zs());
}
function et() {
  ((_("#tune-rows").innerHTML = Qe.map(([e, t, n, o, , a, r], l) => {
    const s = T[e],
      c = ((s - n) / (o - n)) * 100;
    return `<div class="tr${l === Be ? " sel" : ""}${r ? " sub" : ""}" data-i="${l}"><b>${t}</b><span class="tk"><i style="left:${R(c, 0, 100)}%"></i></span><u>${a(s)}</u></div>`;
  }).join("")),
    _("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((Be = +e.dataset.i), et());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (n) => {
          (n.stopPropagation(),
            (Be = +e.dataset.i),
            t.setPointerCapture(n.pointerId));
          const o = (a) => {
            const r = t.getBoundingClientRect(),
              [l, , s, c, f] = Qe[Be],
              h = R(
                Math.round(
                  (s + ((a.clientX - r.left) / r.width) * (c - s)) / f,
                ) * f,
                s,
                c,
              );
            h !== T[l] &&
              ((T[l] = +h.toFixed(4)), l !== "auto" && (T.auto = 0), we());
            const u = t.querySelector("i");
            ((u.style.left = R(((T[l] - s) / (c - s)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = Qe[Be][5](T[l])),
              (_("#tune-json").value = JSON.stringify(T)));
          };
          (o(n),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && o(a);
            }),
            (t.onpointerup = () => et()));
        };
      }),
    (_("#tune-json").value = JSON.stringify(T)));
}
function dr(e, t) {
  const [n, , o, a, r] = Qe[Be],
    l = R(+(T[n] + e * r * (t ? 5 : 1)).toFixed(4), o, a);
  l !== T[n] && ((T[n] = l), n !== "auto" && (T.auto = 0), we(), et());
}
function Ss(e) {
  const t = _("#tune"),
    n = e === void 0 ? t.hidden : e;
  ((t.hidden = !n), n && et());
}
function pr(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (Be = (Be + (t === "ArrowUp" ? -1 : 1) + Qe.length) % Qe.length),
      et(),
      _("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (dr(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [n, , o, a, r] = Qe[Be];
    return a - o === r
      ? ((T[n] = T[n] ? 0 : 1), n !== "auto" && (T.auto = 0), we(), et(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(T, cn) : (T[Qe[Be][0]] = cn[Qe[Be][0]]),
      (T.auto = 0),
      we(),
      et(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(T, null, 1)), !0)
      : t === "Escape"
        ? (Ss(!1), !0)
        : !1;
}
_("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const n in cn) typeof t[n] == "number" && (T[n] = t[n]);
    ((T.auto = 0), we(), et());
  } catch {
    et();
  }
});
const Jo = _("#ui-hint");
let ks = -9;
function be(e) {
  ((Jo.textContent = e), Jo.classList.add("on"), (ks = U));
}
const Ts = ["lab", "exploded", "studio"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Ss());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    _("#info").open
  )
    return;
  if (!_("#tune").hidden && pr(e)) {
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
    if (e.target.id === "slide") return;
    (t.startsWith("arrow") && e.preventDefault(),
      t !== "shift" && ie(),
      Bt.add(t));
    return;
  }
  if (t === "1") (ie(), oo());
  else if (t === "2") (ie(), Go());
  else if (t === "3") (ie(), no());
  else if (t === "[" || t === "]")
    (ie(), bt(C.liftT + (t === "[" ? -0.08 : 0.08)));
  else if (t === " ") {
    if (e.target.tagName === "BUTTON") return;
    (e.preventDefault(), ie(), Eo());
  } else if (t === "v") {
    ie();
    const n = Ts[(Ts.indexOf(A.next || A.cur) + 1) % 3];
    (Dt(n),
      be(
        n === "lab"
          ? "Lab"
          : n === "exploded"
            ? "Exploded: the siphon stretched over a diorama"
            : "Studio",
      ));
  } else
    t === "x"
      ? (ie(), Dt((A.next || A.cur) === "exploded" ? "lab" : "exploded"))
      : t === "c"
        ? _("#cine").click()
        : t === "r"
          ? jn()
          : t === "n"
            ? ((Vt = !Vt), be(Vt ? "Labels on" : "Labels off"))
            : t === "/" &&
              (e.preventDefault(),
              en.classList.toggle("ui-off"),
              be(
                en.classList.contains("ui-off")
                  ? "Interface hidden \xB7 / to show"
                  : "Interface shown",
              ));
}),
  (_("#cine").onclick = () => {
    St ? jn() : Ut(!0);
  }),
  Pe.addEventListener("dblclick", (e) => {
    On(e) || jn();
  }),
  (_("#how").onclick = () => _("#info").showModal()),
  (_("#close").onclick = () => _("#info").close()),
  _("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    _("#tune").hidden || (_("#tune-fps").textContent = Math.round(Ms) + " fps");
  }, 500),
  (_("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e), be("Link copied"));
    } catch {}
  }));
function Ls() {
  const e = ht.clientWidth,
    t = ht.clientHeight;
  Et = e < 900;
  const n = (ut[A.cur].fov || 30) + (T.fov - 30) + (Et ? 8 : 0);
  (P.fov !== n && ((P.fov = n), P.updateProjectionMatrix()),
    P.setViewOffset(e, t, Et ? 0 : e * 0.02, Et ? t * 0.1 : -t * 0.02, e, t));
  const o = 2 * Math.tan(i.MathUtils.degToRad(P.fov / 2));
  Oo =
    P.aspect < 0.8
      ? R(0.62 / Math.max(P.aspect, 0.4), 1, 1.5)
      : R(Math.max(Nn[0] / (o * P.aspect), Nn[1] / o) / rs, 0.85, 2.2);
}
function zs() {
  const e = ht.clientWidth,
    t = ht.clientHeight;
  ((P.aspect = e / t),
    P.updateProjectionMatrix(),
    N.setSize(e, t),
    ye.setSize(e, t));
  const n = N.getDrawingBufferSize(new i.Vector2());
  (sn.setSize(Math.round(n.x * 0.5), Math.round(n.y * 0.5)),
    ua.uRes.value.copy(n),
    Ls(),
    P.updateProjectionMatrix());
}
addEventListener("resize", zs);
let Cs = performance.now(),
  Jn = 0,
  Zn = 0,
  Vs = 0;
function Qn(e) {
  ((Pn = R((e - Cs) / 1e3, 0, 1.5)), (xt = Math.min(0.1, Pn)), (Cs = e));
  const t = e / 1e3;
  if (
    ((U = t),
    St && cr(t),
    lr(),
    Bi(xt),
    qi(),
    Oi(),
    fr(t),
    P.updateMatrixWorld(),
    (N.shadowMap.needsUpdate = !0),
    er(t),
    kt(),
    Jo.classList.contains("on") && U - ks > 1.6 && Jo.classList.remove("on"),
    (Jn += Pn),
    Zn++,
    e - Vs > 1600)
  ) {
    const n = Zn / Math.max(Jn, 0.001);
    ((Jn = 0),
      (Zn = 0),
      (Vs = e),
      (Ms = n),
      Xo++,
      Xo > 2 && (Yn = Math.max(Yn, n)),
      (Yo = Xo > 3 && n < Yn * 0.74 ? Yo + 1 : 0),
      T._ceil === void 0 &&
        ((T._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (T._good = 0),
        (T._probe = 0)),
      !document.hidden &&
        T.auto &&
        Xo > 3 &&
        (T._probe && n < 55
          ? ((T._probe = 0),
            (T._good = 0),
            (T._ceil = Math.max(1, +(T.pixelRatio - 0.25).toFixed(2))),
            (T.pixelRatio = T._ceil),
            we())
          : ((T._probe = 0),
            (T._good = n >= 58 ? Math.min(9, T._good + 1) : 0),
            T._good >= 3 &&
              T.pixelRatio < T._ceil &&
              ((T._good = 0),
              (T._probe = 1),
              (T.pixelRatio = Math.min(
                T._ceil,
                +(T.pixelRatio + 0.25).toFixed(2),
              )),
              we()))),
      !document.hidden &&
        T.auto &&
        Yo >= 2 &&
        n < 50 &&
        ((Yo = 0),
        T.pixelRatio > 1
          ? ((T.pixelRatio = T._ceil =
              Math.max(1, +(T.pixelRatio - 0.25).toFixed(2))),
            we())
          : T.reflect
            ? ((T.reflect = 0), we())
            : T.msaa > 0
              ? ((T.msaa = 0), we())
              : T.ao && ((T.ao = 0), we())));
  }
  (Us(), N.info.reset(), ye.render());
}
let Ps = !0;
function Rs(e) {
  (requestAnimationFrame(Rs), Ps && Qn(e));
}
(we(),
  Dt("lab", !0),
  Ut(!0),
  _("#loading").remove(),
  kt(!0),
  requestAnimationFrame(Rs),
  (window.__step = (e) => Qn(e)),
  (window.__loop = (e) => {
    Ps = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const n = N.domElement,
      o = document.createElement("canvas");
    return (
      (o.width = e),
      (o.height = Math.round((e * n.height) / n.width)),
      o.getContext("2d").drawImage(n, 0, 0, o.width, o.height),
      o.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, n) => {
    Qn(n ?? performance.now());
    const o = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + tn + "/_shots/" + e + ".webp",
        { method: "POST", body: o },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (Ut(!1), (fo = e), e && Nt({ fit: null, ...e }));
    },
    view: (e, t = !0) => Dt(e, t),
    cut: (e) => {
      (Ut(!0), gs(e, U));
    },
    lift: (e, t = !0) => {
      ((C.liftT = e), t && (C.lift = e));
    },
    prime: () => L.prime(),
    leak: (e) => {
      L.leakOpen = !!e;
    },
    refill: () => no(),
    fresh: () => vs(),
    pause: (e) => Eo(!!e),
    full: () => {
      L.fillFull();
    },
    empty: () => {
      L.fillEmpty();
    },
    fill: (e, t) => {
      ((L.fs = e), (L.fl = t));
    },
    tags: (e) => {
      Vt = !!e;
    },
    tune: (e) => (Object.assign(T, e), we(), { ...T }),
    model: () => ({
      fs: +L.fs.toFixed(3),
      fl: +L.fl.toFixed(3),
      hs: +L.hs().toFixed(4),
      hl: +L.hl().toFixed(4),
      head: +L.headNow().toFixed(4),
      v: +L.out.toFixed(3),
      Lmin: +ft(L.out).toFixed(2),
      pc: +(L.pc / 1e3).toFixed(2),
      full: L.full(),
      priming: L.priming,
      leak: +L.leak.toFixed(2),
      slugs: L.slugs.map((e) => [
        +e.a.toFixed(3),
        +e.b.toFixed(3),
        +e.v.toFixed(3),
      ]),
      L: +K.model.L.toFixed(3),
      zc: +K.model.zc.toFixed(3),
      z0: +K.model.z0.toFixed(3),
      zL: +K.model.zL.toFixed(3),
      Kb: +K.model.Kb.toFixed(2),
      break: C.break,
    }),
    ST: C,
    SIM: L,
    VIEW: A,
    VIEWS: ut,
    HERO: Ze,
    SHOTS: Hn,
    RIGS: De,
  }),
  (window.__x = {
    dof: Se,
    gtao: $,
    bloom: Ke,
    renderer: N,
    camera: P,
    scene: Z,
    composer: ye,
    cam: G,
    RT: T,
    overlay: ko,
    rays: Ae,
    UI: ae,
    RIGS: De,
    SIM: L,
  }),
  (window.__dbg = () => ({
    t: +U.toFixed(2),
    view: A.cur,
    shot: jo,
    cine: St,
    lift: +C.lift.toFixed(3),
    full: L.full(),
    Lmin: +ft(L.out).toFixed(1),
    pc: +(L.pc / 1e3).toFixed(2),
    fit: +Oo.toFixed(3),
    focus: +Se.u.focus.value.toFixed(2),
    range: +Se.u.range.value.toFixed(2),
    calls: N.info.render.calls,
    tris: N.info.render.triangles,
  })));
