import * as r from "three";
import { EffectComposer as Is } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as bn,
  FullScreenQuad as Ut,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as ca } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Es } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as Bs } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as Vs } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as zs } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as wn } from "three/addons/utils/BufferGeometryUtils.js";
const A = (e) => document.querySelector(e),
  Mt = A("#world"),
  gn = A("#app"),
  D = (e, t, o) => (e < t ? t : e > o ? o : e),
  Ge = (e, t, o) => e + (t - e) * o,
  Oo = (e, t, o) => {
    const n = D((o - e) / (t - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  Mi = (e) => 1 - (1 - e) ** 3,
  Si = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function Pe(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const Ti = Pe(7),
  Mn = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Us = "https://x.com/ryansael",
  fa = "prism-room",
  J = new r.Scene();
((J.background = new r.Color("#10151f")),
  (J.fog = new r.FogExp2("#1a2130", 0.0065)));
const C = new r.PerspectiveCamera(30, 1, 0.3, 320);
let _;
try {
  _ = new r.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (A("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const Ns = 25e5,
  Os = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return D(Math.min(devicePixelRatio, 2, Math.sqrt(Ns / (e * t))), 1, 2);
  },
  Wo = Os();
(_.setPixelRatio(Wo),
  (_.info.autoReset = !1),
  (_.shadowMap.enabled = !0),
  (_.shadowMap.type = r.PCFShadowMap),
  (_.shadowMap.autoUpdate = !1),
  (_.transmissionResolutionScale = 0.6),
  (_.toneMapping = r.ACESFilmicToneMapping),
  Mt.appendChild(_.domElement));
const Ho = new r.HemisphereLight(9414360, 3813414, 0.5);
J.add(Ho);
const oe = new r.DirectionalLight(16763279, 2.1);
((oe.castShadow = !0),
  oe.shadow.mapSize.set(2048, 2048),
  Object.assign(oe.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (oe.shadow.normalBias = 0.03),
  (oe.shadow.bias = -4e-4),
  (oe.shadow.radius = 2),
  J.add(oe, oe.target));
const Ws = new r.Vector3(0.62, 0.62, 0.48).normalize();
(oe.position.copy(Ws).multiplyScalar(30), oe.target.position.set(0, 2, 0));
const Sn = new r.DirectionalLight(9427199, 0.9);
(Sn.position.set(-6, 9, -14), J.add(Sn));
const Tn = new r.DirectionalLight(16773600, 0.55);
(Tn.position.set(-8, 12, 10), J.add(Tn));
const St = new r.Group();
J.add(St);
const et = 10,
  Nt = {
    pos: {
      value: Array.from({ length: et }, () => new r.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: et }, () => new r.Vector3()) },
  },
  Hs = `uniform vec4 uFakePos[${et}];uniform vec3 uFakeCol[${et}];uniform float uSat;`,
  Ys = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${et};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  Xs = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  da = { value: 1.16 };
function tt(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: Nt.pos,
        uFakeCol: Nt.col,
        uSat: da,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + Hs,
          )
          .replace("#include <lights_fragment_end>", Ys)
          .replace("#include <opaque_fragment>", Xs)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => fa + (t ? t.key : "")),
    e
  );
}
const ua = [];
function ie(e, t, o, n, a, s, l = null) {
  const i = {
    p: new r.Vector3(e, t, o),
    c: new r.Color(n),
    r: a,
    i: s,
    i0: s,
    set: l,
  };
  return (ua.push(i), i);
}
const Yo = new r.Vector3(),
  me = [],
  Ot = new r.Vector3(0, 3, 0);
function $s(e) {
  me.length = 0;
  for (const t of ua)
    if (!(t.i <= 0.001 || (t.set && !t.set.visible))) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        me.length < et)
      )
        (me.push(t), me.length === et && me.sort((o, n) => o.score - n.score));
      else if (t.score > me[0].score) {
        me[0] = t;
        for (let o = 0; o < et - 1 && me[o].score > me[o + 1].score; o++) {
          const n = me[o];
          ((me[o] = me[o + 1]), (me[o + 1] = n));
        }
      }
    }
}
function ha(e, t) {
  $s(t);
  for (let o = 0; o < et; o++) {
    const n = me[o];
    if (!n) {
      (Nt.col.value[o].set(0, 0, 0), Nt.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (Yo.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      Nt.pos.value[o].set(Yo.x, Yo.y, Yo.z, 1 / (n.r * n.r)),
      Nt.col.value[o].set(n.c.r * n.i, n.c.g * n.i, n.c.b * n.i));
  }
}
const Xo = {};
{
  const e = new r.PMREMGenerator(_),
    t = (n) =>
      new r.Mesh(
        new r.SphereGeometry(50, 32, 16),
        new r.ShaderMaterial({
          side: r.BackSide,
          vertexShader:
            "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: n,
        }),
      ),
    o = (n, a, s, l, i, c, f) => {
      const h = new r.Mesh(
        new r.BoxGeometry(a, s, 0.4),
        new r.MeshBasicMaterial({ color: new r.Color(...l) }),
      );
      (h.position.set(i, c, f), h.lookAt(0, 0, 0), n.add(h));
    };
  {
    const n = new r.Scene();
    n.add(
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
    for (let s = 0; s < 6; s++) {
      const l = (s / 6) * Math.PI * 2 + 0.4;
      o(n, 12, 2.4, a[s], Math.sin(l) * 28, 12 + (s % 2) * 9, Math.cos(l) * 28);
    }
    {
      const s = new r.Mesh(
        new r.BoxGeometry(40, 1.2, 1.2),
        new r.MeshBasicMaterial({ color: new r.Color(6, 3.4, 1.2) }),
      );
      (s.position.set(0, -6, -30), n.add(s));
    }
    Xo.show = e.fromScene(n, 0.03).texture;
  }
  {
    const n = new r.Scene();
    (n.add(
      t(
        "varying vec3 d;void main(){vec3 c=mix(vec3(.62,.56,.49),vec3(1.02,.97,.9),smoothstep(-.35,.15,d.y));c=mix(c,vec3(1.1,1.08,1.04),smoothstep(.4,.95,d.y));gl_FragColor=vec4(c,1.);}",
      ),
    ),
      o(n, 26, 12, [7, 6.8, 6.4], -14, 22, 12),
      o(n, 18, 9, [4.2, 4.4, 4.8], 24, 12, 6),
      o(n, 30, 6, [3.2, 3.1, 3], 0, 30, -10),
      o(n, 8, 20, [5, 4.8, 4.6], -26, 8, -6),
      (Xo.studio = e.fromScene(n, 0.03).texture));
  }
  e.dispose();
}
((J.environment = Xo.show), (J.environmentIntensity = 0.7));
const pa = 0,
  kn = new r.WebGLRenderTarget(1, 1, {
    type: r.HalfFloatType,
    generateMipmaps: !0,
    minFilter: r.LinearMipmapLinearFilter,
  }),
  $o = {
    tReflect: { value: kn.texture },
    uReflMatrix: { value: new r.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  ma = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, $o),
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
  Ae = new r.PerspectiveCamera(),
  Ko = new r.Vector3(0, 1, 0),
  fo = new r.Vector3(0, pa, 0),
  Cn = new r.Vector3(),
  qo = new r.Vector3(),
  Pn = new r.Matrix4(),
  uo = new r.Plane(),
  ot = new r.Vector4(),
  va = new r.Vector4(),
  Wt = [];
function Ks() {
  if (
    !x.reflect ||
    $o.uReflStrength.value <= 0 ||
    C.position.y <= pa ||
    !oe.shadow.map
  )
    return;
  (Cn.setFromMatrixPosition(C.matrixWorld),
    Pn.extractRotation(C.matrixWorld),
    Ae.position.subVectors(fo, Cn).reflect(Ko).negate().add(fo),
    qo.set(0, 0, -1).applyMatrix4(Pn).add(Cn),
    qo.subVectors(fo, qo).reflect(Ko).negate().add(fo),
    Ae.up.set(0, 1, 0).applyMatrix4(Pn).reflect(Ko),
    Ae.lookAt(qo),
    (Ae.far = C.far),
    Ae.updateMatrixWorld(),
    Ae.projectionMatrix.copy(C.projectionMatrix),
    $o.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(Ae.projectionMatrix)
      .multiply(Ae.matrixWorldInverse),
    uo
      .setFromNormalAndCoplanarPoint(Ko, fo)
      .applyMatrix4(Ae.matrixWorldInverse),
    ot.set(uo.normal.x, uo.normal.y, uo.normal.z, uo.constant));
  const e = Ae.projectionMatrix.elements;
  (va.set(
    (Math.sign(ot.x) + e[8]) / e[0],
    (Math.sign(ot.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    ot.multiplyScalar(2 / ot.dot(va)),
    (e[2] = ot.x),
    (e[6] = ot.y),
    (e[10] = ot.z + 1),
    (e[14] = ot.w));
  const t = Wt.map((n) => n.visible),
    o = _.shadowMap.needsUpdate;
  (Wt.forEach((n) => (n.visible = !1)),
    (_.shadowMap.needsUpdate = !1),
    ha(Ae, Ot),
    _.setRenderTarget(kn),
    _.clear(),
    _.render(J, Ae),
    _.setRenderTarget(null),
    Wt.forEach((n, a) => (n.visible = t[a])),
    (_.shadowMap.needsUpdate = o));
}
const xa =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  ho = (e, t) =>
    new r.ShaderMaterial({
      uniforms: t,
      vertexShader: xa,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class qs extends bn {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new r.WebGLRenderTarget(1, 1, {
        type: r.HalfFloatType,
        samples: t,
        depthTexture: new r.DepthTexture(1, 1),
      })),
      (this.quad = new Ut(
        ho(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, n) {
    (ha(C, Ot),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(J, C),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const ya = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class js extends bn {
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
        near: { value: C.near },
        far: { value: C.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new r.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new r.Vector2() },
        fullTexel: { value: new r.Vector2() },
      }),
      (this.pre = new Ut(
        ho(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${ya}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Ut(
        ho(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Ut(
        ho(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${ya}
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
const x = {
    auto: 1,
    pixelRatio: Wo,
    msaa: Wo >= 1.5 ? 2 : 4,
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
    glow: 1,
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
  An = { ...x },
  De = new Is(
    _,
    new r.WebGLRenderTarget(1, 1, { type: r.HalfFloatType, depthBuffer: !1 }),
  );
De.setPixelRatio(Wo);
const po = new qs(x.msaa);
De.addPass(po);
const $ = new ca(J, C, 1, 1);
(($.output = ca.OUTPUT.Off),
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
const Qs = $.setSize.bind($),
  Zs = $.render.bind($);
$.setSize = (e, t) => Qs(Math.ceil(e / 2), Math.ceil(t / 2));
const Xe = [],
  ba = [];
(($.render = (e, t, o) => {
  (Xe.forEach((n, a) => {
    ((ba[a] = n.visible), (n.visible = !1));
  }),
    Zs(e, t, o),
    Xe.forEach((n, a) => (n.visible = ba[a])),
    ($.blendMaterial.uniforms.intensity.value = x.ao ? x.aoIntensity : 0),
    ($.blendMaterial.uniforms.tDiffuse.value = $.pdRenderTarget.texture),
    $._renderPass(e, $.blendMaterial, o));
}),
  De.addPass($));
const nt = new Es(new r.Vector2(256, 256), 0.42, 0.55, 1.05),
  Js = nt.setSize.bind(nt);
((nt.setSize = (e, t) => Js(Math.ceil(e / 2), Math.ceil(t / 2))),
  De.addPass(nt));
const Re = new js();
((Re.u.tDepth.value = po.rt.depthTexture), De.addPass(Re));
const Ht = new r.Scene(),
  Yt = {
    tSceneDepth: { value: $.depthTexture },
    uRes: { value: new r.Vector2(1, 1) },
    uNF: { value: new r.Vector2(C.near, C.far) },
  },
  mo = { k: { value: 0.3 } },
  wa = new r.Vector2(),
  ga = new r.Color();
class er extends bn {
  constructor() {
    (super(), (this.needsSwap = !1));
    const t = { type: r.HalfFloatType, depthBuffer: !1 };
    ((this.a = new r.WebGLRenderTarget(1, 1, t)),
      (this.b = new r.WebGLRenderTarget(1, 1, t)),
      (this.qs = new r.Vector2(1, 1)),
      (this.blur = new Ut(
        ho(
          `uniform sampler2D t;uniform vec2 d;varying vec2 vUv;void main(){vec3 c=texture2D(t,vUv).rgb*.2270;
   c+=(texture2D(t,vUv+d*1.3846).rgb+texture2D(t,vUv-d*1.3846).rgb)*.3162;c+=(texture2D(t,vUv+d*3.2308).rgb+texture2D(t,vUv-d*3.2308).rgb)*.0703;gl_FragColor=vec4(c,1.);}`,
          { t: { value: null }, d: { value: new r.Vector2() } },
        ),
      )),
      (this.add = new Ut(
        new r.ShaderMaterial({
          uniforms: { t: { value: this.a.texture }, ...mo },
          vertexShader: xa,
          fragmentShader:
            "uniform sampler2D t;uniform float k;varying vec2 vUv;void main(){gl_FragColor=vec4(max(texture2D(t,vUv).rgb,0.)*k,1.);}",
          depthTest: !1,
          depthWrite: !1,
          transparent: !0,
          blending: r.AdditiveBlending,
        }),
      )));
  }
  setSize(t, o) {
    const n = Math.max(1, Math.ceil(t / 4)),
      a = Math.max(1, Math.ceil(o / 4));
    (this.a.setSize(n, a), this.b.setSize(n, a), this.qs.set(n, a));
  }
  render(t, o, n) {
    const a = t.autoClear;
    if (((t.autoClear = !1), mo.k.value > 0)) {
      (wa.copy(Yt.uRes.value),
        Yt.uRes.value.copy(this.qs),
        C.layers.disable(1),
        t.getClearColor(ga));
      const s = t.getClearAlpha();
      (t.setRenderTarget(this.a),
        t.setClearColor(0, 0),
        t.clear(),
        t.render(Ht, C),
        t.setClearColor(ga, s),
        C.layers.enable(1),
        Yt.uRes.value.copy(wa));
      const l = this.blur.material.uniforms;
      for (let i = 0; i < 2; i++)
        ((l.t.value = this.a.texture),
          l.d.value.set((0.7 + i * 0.4) / this.qs.x, 0),
          t.setRenderTarget(this.b),
          this.blur.render(t),
          (l.t.value = this.b.texture),
          l.d.value.set(0, (0.7 + i * 0.4) / this.qs.y),
          t.setRenderTarget(this.a),
          this.blur.render(t));
    }
    (t.setRenderTarget(n),
      t.render(Ht, C),
      mo.k.value > 0 && this.add.render(t),
      (t.autoClear = a));
  }
}
C.layers.enable(1);
const tr = new er();
(De.addPass(tr), De.addPass(new Bs()));
const Ma = new Vs();
De.addPass(Ma);
const Sa = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  jo = (e, t, o, n = 0.06, a = 2) =>
    new zs(e, t, o, a, Math.min(n, Math.min(e, t, o) / 2.02)),
  at = new Map();
function z(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    at.has(o) ||
      at.set(
        o,
        tt(
          new r.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    at.get(o)
  );
}
function ki(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    at.has(o) ||
      at.set(
        o,
        tt(
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
    at.get(o)
  );
}
function U(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    at.has(o) ||
      at.set(
        o,
        tt(
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
    at.get(o)
  );
}
const K = (e, t = 1) =>
    new r.MeshBasicMaterial({
      color: new r.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  Ci = (e = {}) =>
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
  Tt = U("#434a55", { roughness: 0.36 }),
  $e = U("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Dn = U("#15171b", { roughness: 0.46, metalness: 0.55 }),
  xt = U("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  kt = U("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  Pi = z("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  Ai = U("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  Di = U("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  or = new r.Matrix4(),
  Qo = new r.Quaternion(),
  Ta = new r.Euler(0, 0, 0, "YXZ"),
  ka = new r.Vector3(1, 1, 1),
  Ri = new r.Color(),
  Fi = new r.Vector3(1, 0, 0),
  Rn = new r.Vector3(0, 1, 0),
  Li = new r.Vector3(0, 0, 1),
  nr = new r.Vector3(),
  ar = new r.Quaternion();
function H() {
  const e = new Map(),
    t = (o, n, a, s, l, i) => {
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
        i.dir
          ? (Qo.setFromUnitVectors(
              Rn,
              nr.set(i.dir[0], i.dir[1], i.dir[2]).normalize(),
            ),
            i.roll && Qo.multiply(ar.setFromAxisAngle(Rn, i.roll)))
          : (Ta.set(i.rx || 0, i.ry || 0, i.rz || 0), Qo.setFromEuler(Ta)),
        n.applyMatrix4(
          or.compose(
            { x: a, y: s, z: l },
            Qo,
            i.s ? ka.set(i.s[0], i.s[1], i.s[2]) : ka.set(1, 1, 1),
          ),
        ));
      let c = e.get(o);
      (c || e.set(o, (c = { mat: o, list: [] })), c.list.push(n));
    };
  return {
    box(o, n, a, s, l, i, c, f = {}) {
      return (
        t(o, f.r ? jo(l, i, c, f.r) : new r.BoxGeometry(l, i, c), n, a, s, f),
        this
      );
    },
    cyl(o, n, a, s, l, i, c, f = {}) {
      return (
        t(o, new r.CylinderGeometry(l, i, c, f.seg || 20), n, a, s, f),
        this
      );
    },
    cone(o, n, a, s, l, i, c = {}) {
      return (
        t(
          o,
          new r.ConeGeometry(l, i, c.seg || 6).translate(0, i / 2, 0),
          n,
          a,
          s,
          c,
        ),
        this
      );
    },
    sph(o, n, a, s, l, i = {}) {
      return (
        t(o, new r.SphereGeometry(l, i.seg || 14, i.seg2 || 10), n, a, s, i),
        this
      );
    },
    tor(o, n, a, s, l, i, c = {}) {
      return (
        t(o, new r.TorusGeometry(l, i, c.seg2 || 8, c.seg || 40), n, a, s, c),
        this
      );
    },
    geo(o, n, a = 0, s = 0, l = 0, i = {}) {
      return (t(o, n.clone(), a, s, l, i), this);
    },
    flush(o, n = !0) {
      const a = [];
      for (const { mat: s, list: l } of e.values()) {
        const i = new r.Mesh(wn(l), s);
        ((i.castShadow = n),
          (i.receiveShadow = !0),
          o.add(i),
          a.push(i),
          l.forEach((c) => c.dispose()));
      }
      return (e.clear(), a);
    },
  };
}
const Zo = [];
document.fonts?.ready.then(() => Zo.forEach((e) => e()));
function Fn(e, t, o, n, a, s = 0.9, l = {}) {
  const i = document.createElement("canvas");
  ((i.width = o), (i.height = n));
  const c = i.getContext("2d"),
    f = new r.CanvasTexture(i);
  ((f.anisotropy = 8), (f.colorSpace = r.SRGBColorSpace));
  const h = new r.Mesh(
    new r.PlaneGeometry(e, t),
    new r.MeshBasicMaterial({
      map: f,
      alphaTest: 0.3,
      fog: !1,
      side: r.DoubleSide,
      color: new r.Color(s, s, s),
      ...l,
    }),
  );
  return (
    (h.userData = {
      c: i,
      g: c,
      t: f,
      redraw(d) {
        (c.clearRect(0, 0, o, n), d(c, o, n), (f.needsUpdate = !0));
      },
    }),
    a && (h.userData.redraw(a), Zo.push(() => h.userData.redraw(a))),
    h
  );
}
const sr = (e, t, o, n, a, s) => {
    (e.beginPath(), e.roundRect(t, o, n, a, s));
  },
  yt = (e, t, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), o(a.getContext("2d"), e, t));
    const s = new r.CanvasTexture(a);
    return (n && (s.colorSpace = r.SRGBColorSpace), (s.anisotropy = 8), s);
  },
  rr = yt(
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
  _i = (e, t, o = rr) =>
    new r.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function Gi(e, t = 64, o = [0, Math.PI * 2]) {
  const n = new r.LatheGeometry(
    e.map(([a, s]) => new r.Vector2(s, a)),
    t,
    o[0],
    o[1],
  );
  return (n.rotateZ(-Math.PI / 2), n);
}
function Ii(e, t) {
  return [...e, ...t.slice().reverse(), e[0]];
}
function Ei(e) {
  const t = new r.Shape(e.map(([s, l]) => new r.Vector2(s, l))),
    o = new r.ShapeGeometry(t, 1),
    n = o.clone();
  n.scale(1, -1, 1);
  const a = n.index.array;
  for (let s = 0; s < a.length; s += 3) {
    const l = a[s];
    ((a[s] = a[s + 2]), (a[s + 2] = l));
  }
  return (n.computeVertexNormals(), wn([o.toNonIndexed(), n.toNonIndexed()]));
}
function Ca(e, t, o, n, a = 60, s = 0.07) {
  const l = [],
    i = [],
    c = a * 6,
    f = 0.035,
    h = [
      [e, o],
      [e, n - s],
      [e + f, n],
      [t - f, n],
      [t, n - s],
      [t, o],
    ];
  for (let u = 0; u < h.length; u++)
    for (let v = 0; v <= c; v++) {
      const y = (v / c) * Math.PI * 2,
        b = (v % 6) / 6,
        M = b >= 0.17 && b < 0.67 ? 1 : 0,
        g = u === 2 || u === 3 ? (M ? n : n - s) : h[u][1];
      l.push(h[u][0], -Math.sin(y) * g, Math.cos(y) * g);
    }
  for (let u = 0; u < h.length - 1; u++)
    for (let v = 0; v < c; v++) {
      const y = u * (c + 1) + v,
        b = y + 1,
        M = y + c + 1,
        g = M + 1;
      i.push(y, b, M, b, g, M);
    }
  const d = new r.BufferGeometry();
  (d.setAttribute("position", new r.Float32BufferAttribute(l, 3)),
    d.setIndex(i));
  const m = d.toNonIndexed();
  return (m.computeVertexNormals(), m);
}
function Bi(e, t, o, n, a) {
  const s = new r.Shape(),
    l = n * 4;
  for (let f = 0; f <= l; f++) {
    const h = (f / l) * Math.PI * 2,
      d = f % 4,
      m = d === 1 || d === 2 ? t + o : t,
      u = h + ((d === 1 ? 0.18 : d === 2 ? -0.18 : 0) * Math.PI * 2) / n,
      v = Math.cos(u) * m,
      y = Math.sin(u) * m;
    f ? s.lineTo(v, y) : s.moveTo(v, y);
  }
  const i = new r.Path();
  (i.absarc(0, 0, e, 0, Math.PI * 2, !0), s.holes.push(i));
  const c = new r.ExtrudeGeometry(s, {
    depth: a,
    bevelEnabled: !0,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 1,
    curveSegments: 64,
  });
  return (c.translate(0, 0, -a / 2), c.rotateY(Math.PI / 2), c);
}
function Pa(e, t = 0.3, o = 1, n = 0) {
  const a = new r.IcosahedronGeometry(e, n),
    s = a.attributes.position,
    l = Pe(o),
    i = new Map();
  for (let c = 0; c < s.count; c++) {
    const f =
      s.getX(c).toFixed(3) +
      "," +
      s.getY(c).toFixed(3) +
      "," +
      s.getZ(c).toFixed(3);
    i.has(f) ||
      i.set(f, [1 + (l() - 0.5) * t, 1 + (l() - 0.5) * t, 1 + (l() - 0.5) * t]);
    const h = i.get(f);
    s.setXYZ(c, s.getX(c) * h[0], s.getY(c) * h[1], s.getZ(c) * h[2]);
  }
  return (a.computeVertexNormals(), a);
}
function Vi(e, t, o, n, a, s = 0, l = {}) {
  const i = new r.Group(),
    c = H(),
    f = Pe(Math.floor(t * 31 + n * 17 + 99));
  c.cyl(z("#5a3f2c"), 0, 0.5 * a, 0, 0.07 * a, 0.1 * a, 1 * a, { seg: 6 });
  const h = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((d) =>
    new r.Color(d).offsetHSL(s, 0, 0).getStyle(),
  );
  for (let d = 0; d < (l.n || 5); d++)
    c.geo(
      z(h[d % 4], { flatShading: !0, roughness: 0.8 }),
      Pa(0.42 * a * (0.75 + f() * 0.5), 0.3, d + t * 7 + n * 3),
      (f() - 0.5) * 0.6 * a,
      (1.15 + f() * 0.7) * a,
      (f() - 0.5) * 0.6 * a,
    );
  return (c.flush(i), i.position.set(t, o, n), e.add(i), i);
}
const ir = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
    z(e, { flatShading: !0, roughness: 0.85 }),
  ),
  lr = z("#4a3527", { roughness: 0.9 });
function Aa(e, t, o, n, a, s = 1) {
  const l = Pe(s * 97 + 13);
  e.cyl(lr, t, o + 0.15 * a, n, 0.05 * a, 0.07 * a, 0.3 * a, { seg: 5 });
  for (let i = 0; i < 3; i++) {
    const c = (0.42 - i * 0.1) * a * (0.9 + l() * 0.2);
    e.cone(ir[(i + s) % 3], t, o + (0.22 + i * 0.3) * a, n, c, 0.55 * a, {
      seg: 6 + (s % 2),
      ry: l() * 3,
    });
  }
}
const cr = z("#8d8aa0", { flatShading: !0, roughness: 0.75 }),
  fr = z("#eef1f8", { flatShading: !0, roughness: 0.6 });
function Da(e, t, o, n, a, s, l = 1) {
  const i = new r.ConeGeometry(a, s, 7, 3).translate(0, s / 2, 0),
    c = i.attributes.position,
    f = Pe(l);
  for (let d = 0; d < c.count; d++) {
    const m = c.getY(d);
    m > 0.01 &&
      m < s - 0.01 &&
      (c.setX(d, c.getX(d) * (1 + (f() - 0.5) * 0.35)),
      c.setZ(d, c.getZ(d) * (1 + (f() - 0.5) * 0.35)),
      c.setY(d, m + (f() - 0.5) * s * 0.08));
  }
  (i.computeVertexNormals(), e.geo(cr, i, t, o, n));
  const h = new r.ConeGeometry(a * 0.36, s * 0.34, 7, 1).translate(
    0,
    s * 0.83 + 0.005,
    0,
  );
  e.geo(fr, h, t, o, n, { ry: l });
}
function zi(e, t, o, n, a = 1, s = 1) {
  const l = H(),
    i = Pe(s * 31);
  (l
    .box(
      z("#5b4636", { roughness: 0.9 }),
      t,
      o + 0.09 * a,
      n,
      1.5 * a,
      0.18 * a,
      1 * a,
      { r: 0.02 * a },
    )
    .box(
      z("#5f8a4a", { flatShading: !0 }),
      t,
      o + 0.19 * a,
      n,
      1.46 * a,
      0.04 * a,
      0.96 * a,
    ),
    Da(l, t - 0.25 * a, o + 0.2 * a, n - 0.15 * a, 0.42 * a, 0.9 * a, s),
    Da(l, t + 0.3 * a, o + 0.2 * a, n - 0.2 * a, 0.34 * a, 0.66 * a, s + 3));
  for (let c = 0; c < 5; c++)
    Aa(
      l,
      t + (i() - 0.5) * 1.2 * a,
      o + 0.2 * a,
      n + 0.1 * a + i() * 0.3 * a,
      0.5 * a * (0.8 + i() * 0.4),
      s + c,
    );
  l.flush(e);
}
const dr = yt(
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
function ur(e, t, o, n, a, s, l = 0.5) {
  const i = new r.Mesh(
    new r.PlaneGeometry(a, s),
    new r.MeshBasicMaterial({
      map: dr,
      transparent: !0,
      opacity: l,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (i.rotation.x = -Math.PI / 2),
    i.position.set(t, o + 0.004, n),
    (i.renderOrder = -1),
    e.add(i),
    Xe.push(i),
    i
  );
}
const Ra = yt(1024, 512, (e, t, o) => {
    const n = e.createLinearGradient(0, 0, 0, o);
    (n.addColorStop(0, "#6f8fc4"),
      n.addColorStop(0.52, "#d9b9b4"),
      n.addColorStop(0.72, "#f3c49a"),
      n.addColorStop(1, "#8a7a78"),
      (e.fillStyle = n),
      e.fillRect(0, 0, t, o));
    const a = Pe(9),
      s = (l, i, c, f) => {
        ((e.fillStyle = c), e.beginPath(), e.moveTo(0, o));
        for (let h = 0; h <= t; h += 16) {
          const d = h / t;
          e.lineTo(
            h,
            l -
              i *
                (Math.abs(Math.sin(d * 5.1 + f)) * 0.7 +
                  Math.abs(Math.sin(d * 13.3 + f * 2)) * 0.3),
          );
        }
        (e.lineTo(t, o), e.fill());
      };
    (s(o * 0.6, o * 0.32, "#8d87a8", 1),
      s(o * 0.7, o * 0.2, "#6c6f8e", 2.2),
      (e.fillStyle = "#e9e6f2"));
    for (let l = 0; l < 5; l++) {
      const i = t * (0.12 + l * 0.2),
        c = o * 0.34 + a() * 20;
      (e.beginPath(),
        e.moveTo(i, c),
        e.lineTo(i - 30, c + 34),
        e.lineTo(i + 30, c + 34),
        e.fill());
    }
    for (let l = 0; l < 110; l++) {
      const i = a() * t,
        c = o * (0.72 + a() * 0.25),
        f = 10 + a() * 26;
      ((e.fillStyle = `hsl(${130 + a() * 20},${25 + a() * 15}%,${22 + a() * 12}%)`),
        e.beginPath(),
        e.moveTo(i, c - f * 2.2),
        e.lineTo(i - f * 0.6, c),
        e.lineTo(i + f * 0.6, c),
        e.fill());
    }
  }),
  hr = [1.73759695, 0.313747346, 1.89878101],
  pr = [0.013188707, 0.0623068142, 155.23629];
function Ke(e) {
  const t = (e / 1e3) ** 2;
  let o = 1;
  for (let n = 0; n < 3; n++) o += (hr[n] * t) / (t - pr[n]);
  return Math.sqrt(o);
}
const R = 24,
  Ct = Array.from({ length: R }, (e, t) => 400 + (300 * t) / (R - 1)),
  Fe = Ct.map(Ke),
  mr = Ke(656.27),
  Te = Ke(587.56),
  vr = Ke(486.13),
  Ui = (Te - 1) / (vr - mr),
  Xt = 5,
  vo = 60,
  q = Math.PI / 180,
  Ie = 180 / Math.PI,
  ve = 0.07,
  re = 0.46;
function xr(e) {
  const t = (o, n, a, s) => {
    const l = (o - n) / (o < n ? a : s);
    return Math.exp(-0.5 * l * l);
  };
  return [
    1.056 * t(e, 599.8, 37.9, 31) +
      0.362 * t(e, 442, 16, 26.7) -
      0.065 * t(e, 501.1, 20.4, 26.2),
    0.821 * t(e, 568.8, 46.9, 40.5) + 0.286 * t(e, 530.9, 16.3, 31.1),
    1.217 * t(e, 437, 11.8, 36) + 0.681 * t(e, 459, 26, 13.8),
  ];
}
const Ee = [],
  xo = [];
{
  const e = Ct.map((o) => {
      const [n, a, s] = xr(o),
        l = [
          Math.max(0, 3.2406 * n - 1.5372 * a - 0.4986 * s),
          Math.max(0, -0.9689 * n + 1.8758 * a + 0.0415 * s),
          Math.max(0, 0.0557 * n - 0.204 * a + 1.057 * s),
        ],
        i = Math.max(l[0], l[1], l[2], 1e-6),
        c = 0.5 + 0.5 * Math.sqrt(Math.min(a, 1));
      return l.map((f) => (f / i) * c);
    }),
    t = [0, 1, 2].map((o) => e.reduce((n, a) => n + a[o], 0));
  e.forEach((o) => {
    Ee.push(new r.Color(o[0] / t[0], o[1] / t[1], o[2] / t[2]));
    const n = Math.max(o[0] / t[0], o[1] / t[1], o[2] / t[2]);
    xo.push(new r.Color(o[0] / t[0] / n, o[1] / t[1] / n, o[2] / t[2] / n));
  });
}
const yr = (e) => {
    const t = D(Math.round(((e - 400) / 300) * (R - 1)), 0, R - 1);
    return "#" + xo[t].clone().convertLinearToSRGB().getHexString();
  },
  S = {
    p1: [-0.9, 1.72],
    s1: 1.6,
    len1: 1,
    s2: 1.2,
    len2: 0.85,
    A: [-1.3, 1.95],
    RA: 1.28,
    RARC: 1.84,
    scrX: 1.72,
    scrY0: 0.18,
    scrY1: 3.72,
    scrW: 1.8,
    scrTurn: 48 * q,
    park2: [0.95, 0.36, 0.86],
    park2S: [3.1, 0.36, -1.25],
    gap2: 0.045,
  },
  Fa = (e) => ({ s: e, cx: 0, cy: 0, rot: 0, on: !0, V: new Float64Array(6) }),
  ee = {
    p: [Fa(S.s1), Fa(S.s2)],
    lamp: { x: 0, y: 0, dx: 1, dy: 0 },
    scr: { x: S.scrX, y0: S.scrY0, y1: S.scrY1 },
    tab: { y: 0, x0: -4.2, x1: 3.3 },
    far: 9,
    obs: [
      { x0: S.p1[0] - 0.58, x1: S.p1[0] + 0.58, y: 0.42, on: !0 },
      { x0: 0, x1: 0, y: 0.16, on: !1 },
    ],
  };
function La(e) {
  const t = e.s * 0.8660254,
    o = Math.cos(e.rot),
    n = Math.sin(e.rot),
    a = e.V,
    s = [0, (2 * t) / 3, -e.s / 2, -t / 3, e.s / 2, -t / 3];
  for (let l = 0; l < 3; l++) {
    const i = s[l * 2],
      c = s[l * 2 + 1];
    ((a[l * 2] = e.cx + i * o - c * n), (a[l * 2 + 1] = e.cy + i * n + c * o));
  }
}
const yo = 14,
  Jo = () => ({
    x: new Float64Array(yo),
    y: new Float64Array(yo),
    seg: new Int8Array(yo),
    n: 0,
    I: 1,
    end: 0,
    dx: 1,
    dy: 0,
    th1: NaN,
    tir: 0,
    rfx: 0,
    rfy: 0,
    rdx: 0,
    rdy: 0,
    rR: 0,
    hit: 0,
    face: -1,
  }),
  ne = [Array.from({ length: R }, Jo), Array.from({ length: R }, Jo)],
  st = [Jo(), Jo()];
let rt = 0,
  Ln = 0;
function en(e, t, o, n, a, s, l, i) {
  const c = l - a,
    f = i - s,
    h = o * f - n * c;
  if (h > -1e-12 && h < 1e-12) return !1;
  const d = ((a - e) * f - (s - t) * c) / h,
    m = ((a - e) * n - (s - t) * o) / h;
  return d > 1e-6 && m >= 0 && m <= 1 ? ((rt = d), (Ln = m), !0) : !1;
}
function Pt(e, t, o) {
  const n = ee.lamp;
  let a = n.x,
    s = n.y,
    l = n.dx,
    i = n.dy,
    c = 1,
    f = -1,
    h = 0,
    d = !0;
  ((e.x[0] = a),
    (e.y[0] = s),
    (e.n = 1),
    (e.end = 0),
    (e.th1 = NaN),
    (e.tir = 0),
    (e.rR = 0),
    (e.hit = 0),
    (e.face = -1));
  for (let m = 0; m < yo - 1; m++) {
    let u = 1e9,
      v = -1,
      y = -1,
      b = 0,
      M = 0;
    for (let Se = 0; Se < 2; Se++) {
      const Je = ee.p[Se];
      if (!Je.on || (Se === 1 && !o) || (f >= 0 && f !== Se)) continue;
      const pe = Je.V;
      for (let gt = 0; gt < 3; gt++) {
        const No = gt * 2,
          zt = ((gt + 1) % 3) * 2;
        en(a, s, l, i, pe[No], pe[No + 1], pe[zt], pe[zt + 1]) &&
          rt < u &&
          ((u = rt), (v = Se), (y = gt), (b = 1));
      }
    }
    if (f < 0) {
      const Se = ee.scr;
      en(a, s, l, i, Se.x, Se.y0, Se.x, Se.y1) &&
        rt < u &&
        ((u = rt), (b = 2), (M = Ln));
      const Je = ee.tab;
      en(a, s, l, i, Je.x0, Je.y, Je.x1, Je.y) &&
        rt < u &&
        ((u = rt), (b = 3), (M = Ln));
      for (const pe of ee.obs)
        pe.on &&
          en(a, s, l, i, pe.x0, pe.y, pe.x1, pe.y) &&
          rt < u &&
          ((u = rt), (b = 5));
    }
    if (
      (b || (u = f < 0 ? ee.far : 0.001),
      (a += l * u),
      (s += i * u),
      (e.seg[h] = f),
      h++,
      (e.x[h] = a),
      (e.y[h] = s),
      (e.n = h + 1),
      b === 2)
    ) {
      ((e.end = 1), (e.hit = M));
      break;
    }
    if (b === 3) {
      ((e.end = 2), (e.hit = M));
      break;
    }
    if (b === 5) {
      e.end = 4;
      break;
    }
    if (!b) {
      e.end = 0;
      break;
    }
    const g = ee.p[v].V,
      V = y * 2,
      k = ((y + 1) % 3) * 2;
    let w = -(g[k + 1] - g[V + 1]),
      P = g[k] - g[V];
    const G = Math.hypot(w, P);
    ((w /= G), (P /= G), w * l + P * i > 0 && ((w = -w), (P = -P)));
    const W = f < 0 ? 1 : t,
      N = f < 0 ? t : 1,
      he = W / N,
      Z = -(w * l + P * i),
      Eo = 1 - he * he * (1 - Z * Z);
    if (
      (d && ((e.th1 = Math.acos(D(Z, -1, 1)) * Ie), (e.face = v * 3 + y)),
      Eo < 0)
    ) {
      ((l += 2 * Z * w), (i += 2 * Z * P), e.tir++, (d = !1));
      continue;
    }
    const mt = Math.sqrt(Eo),
      Bo = (W * Z - N * mt) / (W * Z + N * mt),
      Vo = (N * Z - W * mt) / (N * Z + W * mt),
      zo = (Bo * Bo + Vo * Vo) / 2;
    (d &&
      ((e.rfx = a),
      (e.rfy = s),
      (e.rdx = l + 2 * Z * w),
      (e.rdy = i + 2 * Z * P),
      (e.rR = zo)),
      (d = !1),
      (c *= 1 - zo),
      (l = he * l + (he * Z - mt) * w),
      (i = he * i + (he * Z - mt) * P));
    const Uo = Math.hypot(l, i);
    ((l /= Uo), (i /= Uo), (f = f < 0 ? v : -1));
  }
  (e.n >= yo && e.end === 0 && f >= 0 && (e.end = 3),
    (e.I = c),
    (e.dx = l),
    (e.dy = i));
}
function bo(e, t) {
  const o = Math.asin(Math.sin(e * q) / t),
    n = t * Math.sin(vo * q - o);
  return n > 1 || e > 90 ? null : e + Math.asin(n) * Ie - vo;
}
const wo = (e) => Math.asin(e * Math.sin((vo / 2) * q)) * Ie,
  _a = (e) => 2 * wo(e) - vo,
  br = (e) => Math.asin(e * Math.sin((vo - Math.asin(1 / e) * Ie) * q)) * Ie,
  T = {
    th1: 0,
    dev: 0,
    spread: 0,
    devTot: 0,
    spreadTot: 0,
    rMin: 0,
    dMin: _a(Te),
    onScr: 0,
    scrSpread: 0,
    trapped: 0,
    cover: 0,
    lost: 0,
    fanDX: 1,
    fanDY: 0,
  },
  p = {
    r1: 0,
    r1T: 0,
    el: 42,
    elT: 42,
    e2: 0,
    e2T: 0,
    d2: 0,
    d2T: 0,
    r2: 0,
    r2T: 0,
    ex: 0,
    exT: 0,
    hover: -1,
    hoverA: 0,
  },
  _n = ["#56733f", "#6a8a47", "#809d4f", "#475f37", "#9aae5c"].map((e) =>
    z(e, { flatShading: !0, roughness: 0.78, side: r.DoubleSide }),
  );
function wr(e, t, o, n) {
  const a = Pe(n),
    s = [],
    l = 5,
    i = (h, d) => {
      const m =
        Math.sin(Math.PI * Math.pow(h, 0.8)) *
        t *
        (d ? 1 : -1) *
        (0.85 + a() * 0.3);
      return [m, h * e, Math.abs(m) * o];
    },
    c = [];
  for (let h = 0; h <= l; h++) {
    const d = h / l;
    c.push([0, d * e - 0.02 * e * Math.sin(d * 3), 0]);
  }
  for (let h = 0; h < l; h++)
    for (const d of [0, 1]) {
      const m = c[h],
        u = c[h + 1],
        v = i((h + 0.5) / l, d),
        y = h + 1 < l ? i((h + 1.4) / l, d) : c[h + 1];
      (s.push(...m, ...v, ...u), h + 1 < l && s.push(...v, ...y, ...u));
    }
  const f = new r.BufferGeometry();
  return (
    f.setAttribute("position", new r.Float32BufferAttribute(s, 3)),
    f.computeVertexNormals(),
    f
  );
}
function Gn(e, t, o, n, a = 1, s = 1, l = "#e7e2da", i = {}) {
  const c = H(),
    f = Pe(s * 13 + 5),
    h = new r.CylinderGeometry(0.46 * a, 0.36 * a, 0.72 * a, 7, 2, !1),
    d = h.attributes.position;
  for (let u = 0; u < d.count; u++) {
    const v = d.getY(u);
    Math.abs(v) < 0.3 * a &&
      (d.setX(u, d.getX(u) * 1.12), d.setZ(u, d.getZ(u) * 1.12));
  }
  (h.computeVertexNormals(),
    c.geo(z(l, { flatShading: !0, roughness: 0.5 }), h, t, o + 0.36 * a, n, {
      ry: s,
    }),
    c.cyl(
      z("#3b2d22", { roughness: 0.95 }),
      t,
      o + 0.7 * a,
      n,
      0.42 * a,
      0.42 * a,
      0.03 * a,
      { seg: 7 },
    ));
  const m = i.n || 11;
  for (let u = 0; u < m; u++) {
    const v = (u / m) * Math.PI * 2 + f() * 0.5,
      y = 0.35 + f() * 0.55,
      b = (0.75 + f() * 0.55) * a * (i.len || 1),
      M = wr(b, b * 0.3, 0.35, s * 31 + u);
    (M.rotateX(-y),
      M.rotateY(v),
      c.geo(
        _n[(u + s) % _n.length],
        M,
        t + Math.sin(v) * 0.05 * a,
        o + 0.7 * a,
        n + Math.cos(v) * 0.05 * a,
      ),
      c.cyl(
        _n[3],
        t + Math.sin(v) * 0.12 * a * y,
        o + 0.7 * a + 0.1 * a,
        n + Math.cos(v) * 0.12 * a * y,
        0.012 * a,
        0.016 * a,
        0.25 * a,
        {
          seg: 4,
          dir: [
            Math.sin(v) * Math.sin(y),
            Math.cos(y),
            Math.cos(v) * Math.sin(y),
          ],
        },
      ));
  }
  return c.flush(e);
}
const Ga = new r.MeshPhysicalMaterial({
    color: "#e9f6ff",
    roughness: 0.04,
    metalness: 0,
    transmission: 0.9,
    thickness: 0.4,
    ior: 1.5,
    envMapIntensity: 1.6,
    specularIntensity: 1,
    flatShading: !0,
  }),
  gr = z("#dcd8d2", { flatShading: !0, roughness: 0.42 });
function Mr(e, t, o) {
  let n;
  if (e === 0) {
    n = new r.CylinderGeometry(t * 0.72, t * 0.72, t * 0.7, 6, 1);
    const a = new r.ConeGeometry(t * 0.72, t * 0.62, 6).translate(
        0,
        t * 0.66,
        0,
      ),
      s = new r.ConeGeometry(t * 0.72, t * 0.5, 6)
        .rotateX(Math.PI)
        .translate(0, -t * 0.6, 0);
    n = wn([n.toNonIndexed(), a.toNonIndexed(), s.toNonIndexed()]);
  } else
    e === 1
      ? (n = new r.OctahedronGeometry(t, 0).scale(0.85, 1.25, 0.85))
      : (n = Pa(t, 0.22, o, 1));
  return (n.computeVertexNormals(), n);
}
const X = new r.Group();
St.add(X);
const O = -7.6,
  In = 11.2,
  fe = 12,
  Ni = (() => {
    const e = yt(1024, 1024, (n, a, s) => {
      const i = a / 4,
        c = Pe(3);
      for (let f = 0; f < 4; f++)
        for (let h = 0; h < 4; h++) {
          const d = c();
          ((n.fillStyle = `hsl(${34 + d * 6},${9 + d * 4}%,${60 + d * 7}%)`),
            n.fillRect(f * i, h * i, i, i));
          for (let m = 0; m < 70; m++)
            ((n.fillStyle = `rgba(${c() > 0.5 ? 255 : 70},${c() > 0.5 ? 250 : 60},240,${0.025 + c() * 0.03})`),
              n.beginPath(),
              n.ellipse(
                f * i + c() * i,
                h * i + c() * i,
                4 + c() * 40,
                2 + c() * 12,
                c() * 3,
                0,
                7,
              ),
              n.fill());
        }
      ((n.strokeStyle = "#5e564c"), (n.lineWidth = 3));
      for (let f = 0; f <= 4; f++)
        (n.beginPath(),
          n.moveTo(f * i, 0),
          n.lineTo(f * i, s),
          n.stroke(),
          n.beginPath(),
          n.moveTo(0, f * i),
          n.lineTo(a, f * i),
          n.stroke());
    });
    ((e.wrapS = e.wrapT = r.RepeatWrapping), e.repeat.set(9, 6));
    const t = tt(
        new r.MeshStandardMaterial({
          map: e,
          roughness: 0.2,
          metalness: 0.05,
          envMapIntensity: 0.55,
        }),
        ma,
      ),
      o = new r.Mesh(new r.PlaneGeometry(72, 48), t);
    return (
      (o.rotation.x = -Math.PI / 2),
      o.position.set(0, 0, 4),
      (o.receiveShadow = !0),
      X.add(o),
      Wt.push(o),
      o
    );
  })(),
  tn = z("#1c2a47", { roughness: 0.62, envMapIntensity: 0.6 }),
  Ia = z("#15203a", { roughness: 0.7 }),
  qe = U("#3a414c", { roughness: 0.4 });
{
  const e = H();
  e.box(tn, -16.25, fe / 2, O - 0.2, 1.5, fe, 0.4)
    .box(tn, 2.75, fe / 2, O - 0.2, 20.5, fe, 0.4)
    .box(tn, -11.5, 10.5, O - 0.2, 8, 3, 0.4)
    .box(tn, -11.5, 0.6, O - 0.2, 8, 1.2, 0.4);
  for (let s = -5.2; s <= 11; s += 2.6)
    e.box(Ia, s, fe / 2, O + 0.01, 0.05, fe, 0.04);
  (e.box(qe, 2.75, 0.12, O + 0.08, 20.5, 0.24, 0.14),
    e.box(Ia, -2, fe + 0.2, -3, 30, 0.4, 12),
    e
      .box(qe, -11.5, 9.05, O + 0.05, 8.3, 0.16, 0.3)
      .box(qe, -11.5, 1.15, O + 0.05, 8.3, 0.16, 0.3)
      .box(qe, -7.45, 5.1, O + 0.05, 0.16, 8, 0.3)
      .box(qe, -15.55, 5.1, O + 0.05, 0.16, 8, 0.3)
      .box(qe, -11.5, 5.1, O + 0.05, 0.08, 7.9, 0.16));
  for (const s of [-6.5, 6.6]) e.box(qe, s, fe / 2, O + 0.12, 0.34, fe, 0.2);
  (e.box(z("#2c3440", { roughness: 0.5 }), -10.2, 0.55, O + 1.2, 9, 1.1, 1.6, {
    r: 0.04,
  }),
    e.flush(X, !1));
  const t = new r.Mesh(new r.BoxGeometry(30, 0.06, 0.06), K("#ffb86b", 3.2));
  (t.position.set(-2, fe - 0.35, O + 0.3), X.add(t));
  const o = new r.Mesh(new r.BoxGeometry(20.5, 0.04, 0.04), K("#ffae5c", 1.6));
  (o.position.set(2.75, 0.27, O + 0.16), X.add(o));
  const n = new r.Mesh(new r.BoxGeometry(8.8, 0.05, 0.05), K("#ffb468", 3));
  (n.position.set(-10.2, 1.02, O + 2.02),
    X.add(n),
    ie(-8.5, 1.3, O + 2.6, "#ffb468", 3, 0.6, X));
  for (const s of [-6.5, 6.6]) {
    const l = new r.Mesh(
      new r.BoxGeometry(0.05, fe - 1.2, 0.05),
      K("#ffb468", 2.6),
    );
    (l.position.set(s, fe / 2, O + 0.24),
      X.add(l),
      ie(s, 4.5, O + 1.2, "#ffb468", 4, 0.5, X));
  }
  const a = new r.Mesh(
    new r.PlaneGeometry(22, 11),
    new r.MeshBasicMaterial({
      map: Ra,
      fog: !1,
      color: new r.Color(0.85, 0.85, 0.85),
    }),
  );
  (a.position.set(-13, 5.4, -15), X.add(a));
}
function Ea(e, t, o, n, a, s = X) {
  const l = Fn(
    o,
    n,
    768,
    Math.round((768 * n) / o),
    (i, c, f) => {
      ((i.fillStyle = "rgba(20,40,70,.38)"),
        i.fillRect(0, 0, c, f),
        a(i, c, f),
        (i.strokeStyle = "#8fe4ff"),
        (i.lineWidth = 4),
        i.strokeRect(3, 3, c - 6, f - 6));
    },
    1,
    {
      alphaTest: 0,
      transparent: !0,
      depthWrite: !1,
      opacity: 0.95,
      color: new r.Color(0.9, 1, 1.2),
    },
  );
  return (
    l.position.set(e, t, O + 0.14),
    s.add(l),
    Xe.push(l),
    ie(e, t + 0.2, O + 1.6, "#7fd6ff", 5, 0.3, s),
    (l.userData.draw = a),
    l
  );
}
const $t = {};
function Sr(e, t, o) {
  const n = t * 0.47,
    a = o * 0.6,
    s = o * 0.62,
    l = s * 0.866,
    i = p.r1 * q,
    c = [
      [0, (-2 * l) / 3],
      [-s / 2, l / 3],
      [s / 2, l / 3],
    ].map(([m, u]) => [
      n + m * Math.cos(i) + u * Math.sin(i),
      a - m * Math.sin(i) + u * Math.cos(i),
    ]);
  ((e.lineJoin = "round"),
    (e.lineCap = "round"),
    (e.strokeStyle = "#dff2ff"),
    (e.lineWidth = 5),
    e.beginPath(),
    c.forEach((m, u) => (u ? e.lineTo(...m) : e.moveTo(...m))),
    e.closePath(),
    e.stroke());
  const f = p.el * q,
    h = [(c[0][0] + c[1][0]) / 2, (c[0][1] + c[1][1]) / 2];
  ((e.strokeStyle = "#ffffff"),
    (e.lineWidth = 6),
    e.beginPath(),
    e.moveTo(h[0] - Math.cos(f) * t * 0.36, h[1] + Math.sin(f) * t * 0.36),
    e.lineTo(...h),
    e.stroke());
  const d = [(c[0][0] + c[2][0]) / 2, (c[0][1] + c[2][1]) / 2];
  for (const [m, u] of [
    [680, "#ff5a4e"],
    [610, "#ff9a3c"],
    [575, "#ffe14a"],
    [530, "#62e07a"],
    [480, "#3fb4ff"],
    [430, "#8a6bff"],
  ]) {
    const v = Ke(m),
      y = p.el + 30 - p.r1,
      b = bo(y, v);
    if (b == null) continue;
    const M = (p.el - b) * q;
    ((e.strokeStyle = u),
      (e.lineWidth = 4.5),
      e.beginPath(),
      e.moveTo(d[0] - (d[0] - h[0]) * 0.12, d[1] - (d[1] - h[1]) * 0.12),
      e.lineTo(d[0] + Math.cos(M) * t * 0.42, d[1] - Math.sin(M) * t * 0.42),
      e.stroke());
  }
  ((e.fillStyle = "#8fd6ff"),
    (e.font = "500 22px DM Mono, monospace"),
    e.fillText("N-SF11 \xB7 60\xB0", 26, 40));
}
function Tr(e, t, o) {
  const n = o * 0.36,
    a = o * 0.13,
    s = t * 0.1,
    l = t * 0.9;
  ((e.lineWidth = 5),
    (e.lineCap = "round"),
    (e.strokeStyle = "#4f7390"),
    (e.lineWidth = 2),
    e.beginPath(),
    e.moveTo(s, o * 0.08),
    e.lineTo(s, o * 0.56),
    e.lineTo(l, o * 0.56),
    e.stroke());
  let i = 0;
  for (let f = s; f < l; f += 3) {
    const h = (f - s) / (l - s),
      d = 700 - 300 * h,
      m = n - Math.sin(i) * a;
    ((i += 3 / (d * 0.16)),
      (e.strokeStyle = yr(d)),
      (e.lineWidth = 5),
      e.beginPath(),
      e.moveTo(f, m),
      e.lineTo(f + 3, n - Math.sin(i) * a),
      e.stroke());
  }
  const c = (f, h, d) => {
    if (
      ((e.strokeStyle = "#8fb8d8"),
      (e.lineWidth = 5),
      e.beginPath(),
      e.moveTo(t * 0.22, f),
      e.lineTo(t * 0.9, f),
      e.stroke(),
      (e.strokeStyle = "#dff4ff"),
      e.beginPath(),
      e.moveTo(t * 0.22, f),
      e.lineTo(t * (0.22 + 0.68 * h), f),
      e.stroke(),
      (e.fillStyle = "#f4fbff"),
      e.beginPath(),
      e.arc(t * (0.22 + 0.68 * h), f, 15, 0, 7),
      e.fill(),
      (e.strokeStyle = "#bfe6ff"),
      (e.lineWidth = 3),
      e.beginPath(),
      e.arc(t * 0.11, f, 17, 0, 7),
      e.stroke(),
      d)
    )
      for (let m = 0; m < 8; m++) {
        const u = (m / 8) * Math.PI * 2;
        (e.beginPath(),
          e.moveTo(t * 0.11 + Math.cos(u) * 22, f + Math.sin(u) * 22),
          e.lineTo(t * 0.11 + Math.cos(u) * 28, f + Math.sin(u) * 28),
          e.stroke());
      }
    else
      (e.beginPath(),
        e.moveTo(t * 0.11, f - 10),
        e.lineTo(t * 0.11, f + 4),
        e.stroke());
  };
  (c(o * 0.72, (p.el - 28) / 32, 1), c(o * 0.88, (p.r1 + 20) / 44, 0));
}
(($t.prism = Ea(-3.1, 6.75, 3.9, 2.05, Sr)),
  ($t.wave = Ea(2.35, 6.6, 2.9, 2.3, Tr)));
{
  const e = H(),
    t = 8.3,
    o = O + 1,
    n = U("#2a313b", { roughness: 0.45 }),
    a = U("#1c2129", { roughness: 0.5 });
  e.box(a, t - 2.2, 5, o, 0.14, 10, 1.5)
    .box(a, t + 2.2, 5, o, 0.14, 10, 1.5)
    .box(z("#242b36", { roughness: 0.6 }), t, 5, o - 0.7, 4.4, 10, 0.08);
  const s = [1.1, 3.5, 5.9, 8.3];
  for (const i of s) e.box(n, t, i, o, 4.3, 0.12, 1.4, { r: 0.02 });
  (e.flush(X, !1),
    s.forEach((i, c) => {
      if (c === 0) return;
      const f = new r.Mesh(
        new r.BoxGeometry(4.1, 0.04, 0.04),
        K("#ffbf78", 3.2),
      );
      (f.position.set(t, i - 0.09, o + 0.62),
        X.add(f),
        ie(t, i - 0.5, o + 0.9, "#ffbf78", 2.6, 0.55, X));
    }));
  const l = [
    [0, 1, 0.62, t - 1.1, 1.16],
    [2, 1, 0.56, t + 1.2, 1.16],
    [1, 2, 0.58, t - 0.7, 3.56],
    [0, 3, 0.5, t + 1.3, 3.56],
    [1, 4, 0.6, t + 0.2, 5.96],
    [0, 5, 0.45, t - 1.3, 5.96],
    [2, 6, 0.5, t + 1.1, 8.36],
  ];
  for (const [i, c, f, h, d] of l) {
    const m = Mr(i, f, c),
      u = i === 2 ? gr : Ga,
      v = new r.Mesh(m, u);
    (v.position.set(h, d + f * (i === 0 ? 1.05 : i === 1 ? 1.25 : 0.8), o),
      (v.rotation.y = c),
      (v.castShadow = !0),
      X.add(v),
      u === Ga && Xe.push(v));
  }
}
(Gn(X, -7.6, 0, -3.2, 2.1, 3),
  Gn(X, -9.6, 1.1, O + 1.3, 1.4, 7, "#d9d3c8", { n: 9 }));
{
  const e = new r.Mesh(
    new r.PlaneGeometry(30, 15),
    new r.MeshBasicMaterial({ map: Ra, fog: !1, color: new r.Color(1, 1, 1) }),
  );
  ((e.rotation.y = -Math.PI / 2), e.position.set(26, 6.2, -1), X.add(e));
  const t = H();
  for (const n of [-7.4, -3.2, 1, 5.2])
    t.box(qe, In, fe / 2, n, 0.16, fe, 0.16);
  (t.box(qe, In, 0.15, 0, 0.3, 0.3, 16).box(qe, In, fe - 0.2, 0, 0.3, 0.3, 16),
    t.flush(X, !1));
  const o = H();
  for (let n = 0; n < 26; n++) {
    const a = -9 + Mn(n) * 18,
      s = 14 + Mn(n + 0.5) * 9;
    Aa(o, s, 0, a, 2 + Mn(n + 0.2) * 2.4, n);
  }
  o.flush(X);
}
const En = { x0: -3.95, x1: 3.85, top: 1.86 },
  Be = new r.Group();
St.add(Be);
const xe = new r.Group(),
  Le = Math.hypot(0.62, En.top - 0.3);
{
  const { x0: e, x1: t, top: o } = En,
    n = new r.Shape(
      [
        [2.12, 0.26],
        [1.5, o - 0.04],
        [1.42, o],
        [-1.72, o],
        [-1.8, o - 0.05],
        [-1.95, 0.26],
      ].map(([h, d]) => new r.Vector2(h, d)),
    ),
    a = new r.ExtrudeGeometry(n, {
      depth: t - e,
      bevelEnabled: !0,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 2,
    });
  (a.rotateY(-Math.PI / 2), a.translate(t, 0, 0));
  const s = new r.Mesh(a, U("#59616d", { roughness: 0.3, metalness: 0.75 }));
  ((s.castShadow = s.receiveShadow = !0), Be.add(s));
  const l = H();
  (l.box(
    z("#15181d", { roughness: 0.6 }),
    (e + t) / 2,
    0.13,
    0.08,
    t - e - 0.5,
    0.26,
    3.7,
  ),
    l.box(
      U("#5c636e", { roughness: 0.3 }),
      (e + t) / 2,
      o + 0.02,
      -0.15,
      t - e - 0.3,
      0.05,
      2.9,
      { r: 0.02 },
    ));
  for (const h of [-1, 1])
    l.box(
      U("#3a4049", { roughness: 0.38 }),
      h < 0 ? e + 0.05 : t - 0.05,
      o * 0.5 + 0.1,
      0.35,
      0.12,
      o - 0.2,
      2.6,
      { r: 0.03 },
    );
  l.flush(Be);
  const i = new r.Mesh(
    new r.BoxGeometry(t - e - 0.45, 0.06, 0.06),
    K("#ffab55", 5.2),
  );
  (i.position.set((e + t) / 2, 0.24, 2.02), Be.add(i));
  const c = i.clone();
  (c.position.set((e + t) / 2, 0.24, -1.86), Be.add(c));
  const f = new r.Mesh(
    new r.BoxGeometry(t - e - 0.2, 0.035, 0.035),
    K("#ffb468", 3.4),
  );
  (f.position.set((e + t) / 2, o - 0.03, 1.47),
    Be.add(f),
    ie(-2.4, 0.5, 2.8, "#ffab55", 3.2, 1.2, Be),
    ie(2.4, 0.5, 2.8, "#ffab55", 3.2, 1.2, Be),
    ie(0, 2.3, 2.6, "#ffc27a", 2.8, 0.5, Be),
    xe.position.set(0, 0.278, 2.165),
    (xe.rotation.x = -Math.atan2(0.62, o - 0.3)),
    Be.add(xe));
}
const kr = U("#1a1f28", {
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }),
  Cr = U("#2b313b", { roughness: 0.35 });
function Bn(e, t, o = {}) {
  const n = o.h || Le * 0.8,
    a = o.y || Le * 0.5,
    s = H();
  return (
    s
      .box(Cr, e, a, 0.005, t, n, 0.03, { r: 0.05 })
      .box(kr, e, a, 0.02, t - 0.15, n - 0.08 * Le, 0.02, { r: 0.04 }),
    s.flush(xe, !1),
    { x: e, y: a, w: t, h: n }
  );
}
function Ba(e, t, o, n, a, s = {}) {
  const l = s.cw || 1024,
    i = Math.round((l * n) / o),
    c = document.createElement("canvas");
  ((c.width = l), (c.height = i));
  const f = c.getContext("2d"),
    h = new r.CanvasTexture(c);
  ((h.colorSpace = r.SRGBColorSpace), (h.anisotropy = 8));
  const d = new r.Mesh(
    new r.PlaneGeometry(o, n),
    new r.MeshBasicMaterial({
      map: h,
      fog: !1,
      color: new r.Color(s.k || 1.5, s.k || 1.5, s.k || 1.5),
    }),
  );
  return (
    d.position.set(e, t, 0.036),
    (s.parent || xe).add(d),
    (d.userData = {
      c,
      g: f,
      t: h,
      redraw(m = 0) {
        (f.clearRect(0, 0, l, i), a(f, l, i, m), (h.needsUpdate = !0));
      },
    }),
    d.userData.redraw(0),
    Zo.push(() => d.userData.redraw(le)),
    d
  );
}
function Pr(e, t, o, n) {
  const a = new r.MeshBasicMaterial({
      color: new r.Color(o).multiplyScalar(n),
      fog: !1,
    }),
    s = { uA0: { value: 0 }, uLen: { value: Math.PI * 2 } };
  ((a.onBeforeCompile = (i) => {
    (Object.assign(i.uniforms, s),
      (i.vertexShader = i.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
varying vec2 vLp;`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
vLp=position.xy;`,
        )),
      (i.fragmentShader = i.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
varying vec2 vLp;uniform float uA0;uniform float uLen;`,
        )
        .replace(
          "void main() {",
          `void main() {
{float a=mod(atan(vLp.y,vLp.x)-uA0,6.2831853);if(a>uLen)discard;}`,
        )));
  }),
    (a.customProgramCacheKey = () => "arc"));
  const l = new r.Mesh(new r.TorusGeometry(e, t, 8, 128), a);
  return ((l.userData.u = s), l);
}
function Va(e, t, o = {}) {
  const n = o.r || 0.36,
    a = new r.Group();
  (a.position.set(e, t, 0.03), xe.add(a));
  const s = new r.Mesh(Ca(0, 0.14, 0, n * 0.86, 36, 0.02), kt);
  ((s.rotation.y = -Math.PI / 2), a.add(s));
  const l = new r.Mesh(
    new r.CylinderGeometry(n * 0.8, n * 0.84, 0.05, 48),
    U("#6c7481", { roughness: 0.34, metalness: 1, envMapIntensity: 0.7 }),
  );
  ((l.rotation.x = Math.PI / 2), (l.position.z = 0.16), a.add(l));
  const i = new r.Mesh(
    new r.BoxGeometry(0.03, n * 0.4, 0.01),
    K(o.ring || "#ffb454", 3),
  );
  i.position.set(0, n * 0.5, 0.19);
  const c = new r.Group();
  (c.add(i), a.add(c));
  const f = Pr(n * 1.1, 0.024, o.ring || "#ffb454", 2.8);
  ((f.position.z = 0.01), a.add(f));
  const h = new r.Mesh(
    new r.TorusGeometry(n * 1.1, 0.012, 6, 96),
    K("#3a4658", 1),
  );
  return (
    (h.position.z = 0.005),
    a.add(h),
    (a.userData = { ring: f, tick: i, spin: c, cap: l, sk: s }),
    a
  );
}
function za(e, t, o, n = {}) {
  const a = H();
  a.box(
    z("#0b0e13", { roughness: 0.5 }),
    (e + t) / 2,
    o,
    0.04,
    t - e + 0.1,
    0.05,
    0.02,
  );
  for (let m = 0; m <= 24; m++) {
    const u = Ge(e, t, m / 24);
    a.box(
      z("#5a6272"),
      u,
      o + (m % 4 ? 0.1 : 0.12),
      0.04,
      0.012,
      m % 4 ? 0.06 : 0.1,
      0.01,
    );
  }
  a.flush(xe, !1);
  const s = n.color || "#6fdcff",
    l = new r.Mesh(new r.BoxGeometry(1, 0.028, 0.012), K(s, 3));
  (l.position.set(e, o, 0.055), xe.add(l));
  const i = new r.Group(),
    c = H();
  (c
    .cyl(kt, 0, 0, 0, 0.12, 0.12, 0.3, { seg: 28 })
    .cyl(Dn, 0, 0.1, 0, 0.125, 0.125, 0.03, { seg: 28 })
    .cyl(Dn, 0, -0.1, 0, 0.125, 0.125, 0.03, { seg: 28 }),
    c.flush(i));
  const f = new r.Mesh(new r.ConeGeometry(0.045, 0.07, 3), K(s, 3));
  (f.position.set(0, -0.25, 0),
    (f.rotation.z = Math.PI),
    i.add(f),
    i.position.set(e, o, 0.17),
    xe.add(i));
  const h = new r.Mesh(
    new r.PlaneGeometry(t - e + 0.3, 0.4),
    new r.MeshBasicMaterial({ visible: !1 }),
  );
  (h.position.set((e + t) / 2, o, 0.1), xe.add(h));
  const d = {
    a: e,
    b: t,
    y: o,
    fill: l,
    knob: i,
    hit: h,
    t: 0,
    set(m) {
      this.t = D(m, 0, 1);
      const u = Ge(e, t, this.t);
      ((i.position.x = u),
        (l.scale.x = Math.max(0.001, u - e)),
        (l.position.x = e + (u - e) / 2));
    },
    fromRay(m) {
      const u = m.intersectObject(h, !1)[0];
      if (!u) return null;
      const v = xe.worldToLocal(u.point.clone());
      return D((v.x - e) / (t - e), 0, 1);
    },
  };
  return (d.set(0), d);
}
const Ua = [];
function Ar(e, t, o, n, a, s = 128) {
  const l = "@RYANSAEL ON X",
    i = () => {
      ((e.font = `${n ? 700 : 600} ${s}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(s * 0.08) + "px"));
    };
  i();
  const c = e.measureText(l).width;
  c > t - 28 && ((s = Math.floor((s * (t - 28)) / c)), i());
  const f = t / 2 + Math.round(s * 0.04),
    h = o / 2 + s * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), n)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(l, f, h + s * 0.05),
      (e.fillStyle = a ? "#e08a24" : "#38332d"),
      e.fillText(l, f, h));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(l, f + s * 0.02, h + s * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(l, f, h - s * 0.025));
  const d = e.createLinearGradient(0, h - s * 0.7, 0, h);
  (d.addColorStop(0, "#f1d08c"),
    d.addColorStop(1, "#b3833d"),
    (e.fillStyle = d),
    e.fillText(l, f, h));
}
function Na(e, t = {}) {
  const o = !!t.pale,
    n = t.k ?? (o ? 0.92 : 0.6);
  let a = !1;
  const s = (i, c, f) => Ar(i, c, f, o, a),
    l = Fn(e, e * 0.1375, 1280, 176, s, n, { alphaTest: 0.25 });
  return (
    (l.userData.mark = 1),
    Wt.push(l),
    Ua.push({
      hit: l,
      over(i) {
        ((a = i),
          o
            ? l.userData.redraw(s)
            : l.material.color.setRGB(i ? 3.4 : n, i ? 2.5 : n, i ? 1.4 : n));
      },
    }),
    l
  );
}
function Dr(e, t, o = 1.2, n = {}) {
  const a = Na(o, n);
  return (a.position.set(e, t, 0.012), xe.add(a), a);
}
const I = { drawnAt: 0, drawKey: "" };
function Oa(e, t, o) {
  ((e.fillStyle = "#08111d"),
    e.fillRect(0, 0, t, o),
    (e.strokeStyle = "#16304a"),
    (e.lineWidth = 2));
  for (let n = 0; n <= t; n += t / 12)
    (e.beginPath(), e.moveTo(n, 0), e.lineTo(n, o), e.stroke());
  for (let n = 0; n <= o; n += o / 5)
    (e.beginPath(), e.moveTo(0, n), e.lineTo(t, n), e.stroke());
}
const go = -20,
  Mo = 24;
function Rr(e, t, o) {
  Oa(e, t, o);
  const n = p.el,
    a = (b) => t * 0.06 + ((b - go) / (Mo - go)) * t * 0.88,
    s = (b, M) => {
      const g = bo(n + 30 - b, M);
      return g == null ? null : n - g;
    };
  let l = 1e9,
    i = -1e9;
  for (let b = go; b <= Mo; b += 0.5)
    for (const M of [Ke(656), Ke(436)]) {
      const g = s(b, M);
      g != null && ((l = Math.min(l, g)), (i = Math.max(i, g)));
    }
  const c = i + 1.5,
    f = Math.max(l, i - 24) - 1,
    h = (b) => o * 0.14 + ((c - b) / (c - f)) * o * 0.72,
    d = (b, M, g, V) => {
      ((e.strokeStyle = M),
        (e.lineWidth = g),
        (e.shadowColor = M),
        (e.shadowBlur = V),
        e.beginPath());
      let k = !1;
      for (let w = go; w <= Mo; w += 0.25) {
        const P = s(w, b);
        if (P == null || P < f) {
          k = !1;
          continue;
        }
        (k ? e.lineTo(a(w), h(P)) : e.moveTo(a(w), h(P)), (k = !0));
      }
      (e.stroke(), (e.shadowBlur = 0));
    },
    m = n + 30 - br(Te);
  (m < Mo &&
    ((e.fillStyle = "rgba(255,90,110,.10)"),
    e.fillRect(a(m), 0, t - a(m), o),
    (e.fillStyle = "#ff8a9c"),
    (e.font = "500 26px DM Mono, monospace"),
    (e.textAlign = "right"),
    e.fillText("trapped", t - 18, o - 18)),
    d(Ke(656), "rgba(255,110,100,.75)", 3, 6),
    d(Ke(436), "rgba(150,120,255,.85)", 3, 6),
    d(Te, "#eef6ff", 6, 16));
  const u = T.rMin;
  if (u > go && u < Mo) {
    const b = s(u, Te);
    (e.setLineDash([8, 8]),
      (e.strokeStyle = "rgba(143,232,255,.55)"),
      (e.lineWidth = 2),
      e.beginPath(),
      e.moveTo(a(u), h(b) - 26),
      e.lineTo(a(u), o * 0.93),
      e.stroke(),
      e.setLineDash([]),
      (e.fillStyle = "#9fe6ff"),
      (e.font = "500 25px DM Mono, monospace"),
      (e.textAlign = "center"),
      e.fillText(
        "least bend " + T.dMin.toFixed(1) + "\xB0",
        D(a(u), 150, t - 150),
        h(b) - 38,
      ));
  }
  const v = a(p.r1);
  ((e.strokeStyle = "#8fe8ff"),
    (e.lineWidth = 3),
    (e.shadowColor = "#5fd6ff"),
    (e.shadowBlur = 12),
    e.beginPath(),
    e.moveTo(v, o * 0.08),
    e.lineTo(v, o * 0.95),
    e.stroke(),
    (e.shadowBlur = 0));
  const y = s(p.r1, Te);
  (y != null &&
    ((e.fillStyle = "#ffffff"),
    e.beginPath(),
    e.arc(v, h(y), 11, 0, 7),
    e.fill()),
    (e.textAlign = "left"),
    (e.fillStyle = "#7f9bb8"),
    (e.font = "500 24px DM Mono, monospace"),
    e.fillText("WHERE THE FAN POINTS", 18, 32));
}
function Fr(e, t, o) {
  Oa(e, t, o);
  const n = So;
  let a = 1e9,
    s = -1e9,
    l = 0;
  for (let d = 0; d < R; d++)
    n.w[d] <= 0 || ((a = Math.min(a, n.v[d])), (s = Math.max(s, n.v[d])), l++);
  if (
    ((e.textAlign = "left"),
    (e.fillStyle = "#7f9bb8"),
    (e.font = "500 24px DM Mono, monospace"),
    e.fillText("ON THE SCREEN", 18, 32),
    !l)
  ) {
    ((e.fillStyle = "#ff8a9c"),
      (e.textAlign = "center"),
      (e.font = "500 30px DM Mono, monospace"),
      e.fillText("no light on the screen", t / 2, o * 0.55));
    return;
  }
  const i = (a + s) / 2,
    c = Math.max(s - a + ve * 6, 0.9),
    f = (d) => t / 2 + ((d - i) / c) * t * 0.84,
    h = Math.max(((ve * 0.5) / c) * t * 0.84, 5);
  e.globalCompositeOperation = "lighter";
  for (let d = 0; d < R; d++) {
    if (n.w[d] <= 0) continue;
    const m = xo[d],
      u = o * 0.62 * Math.min(1, n.w[d] * 1.15),
      v = f(n.v[d]);
    ((e.strokeStyle = `rgb(${(m.r * 255) | 0},${(m.g * 255) | 0},${(m.b * 255) | 0})`),
      (e.lineWidth = 4),
      e.beginPath());
    for (let y = v - h * 4; y <= v + h * 4; y += 3) {
      const b = o * 0.86 - u * Math.exp(-0.5 * ((y - v) / h) ** 2);
      y === v - h * 4 ? e.moveTo(y, b) : e.lineTo(y, b);
    }
    e.stroke();
  }
  ((e.globalCompositeOperation = "source-over"),
    (e.fillStyle = "#9fe6ff"),
    (e.textAlign = "right"),
    (e.font = "500 25px DM Mono, monospace"),
    e.fillText(
      (T.scrSpread * Xt * 10).toFixed(T.scrSpread * Xt * 10 < 10 ? 1 : 0) +
        " mm red to violet",
      t - 18,
      32,
    ));
}
const So = { v: new Float64Array(R), w: new Float64Array(R) };
{
  (Bn(-3, 1.5),
    Bn(-0.05, 4.3),
    Bn(2.9, 1.5),
    (I.dial = Va(-3, Le * 0.53, { r: 0.4, ring: "#ffb454" })),
    (I.knob2 = Va(2.9, Le * 0.53, { r: 0.34, ring: "#7fe3ff" })),
    (I.fan = Ba(-1.1, Le * 0.635, 1.92, Le * 0.42, Rr, { k: 1.55 })),
    (I.spec = Ba(1, Le * 0.635, 1.92, Le * 0.42, Fr, { k: 1.55 })));
  const e = new r.Mesh(
    new r.BoxGeometry(0.018, Le * 0.56, 0.01),
    K("#9fe6ff", 2.2),
  );
  (e.position.set(-0.05, Le * 0.5, 0.045),
    xe.add(e),
    (I.s1 = za(-1.95, -0.25, 0.44)),
    (I.s2 = za(0.15, 1.85, 0.44)));
  const t = (o, n) => {
    const a = Fn(
      1.2,
      0.11,
      640,
      60,
      (s, l, i) => {
        ((s.textAlign = "center"),
          (s.textBaseline = "middle"),
          (s.font = "600 34px DM Mono, monospace"),
          (s.letterSpacing = "5px"),
          (s.fillStyle = "#8d97ab"),
          s.fillText(n, l / 2, i / 2));
      },
      0.8,
      { alphaTest: 0.25 },
    );
    (a.position.set(o, Le * 0.12, 0.04), xe.add(a));
  };
  (t(-3, "LIGHT"), t(2.9, "2ND PRISM"), Dr(-0.05, 0.085, 0.94));
}
const Y = new r.Group();
St.add(Y);
const To = U("#1b1f26", { roughness: 0.44, metalness: 0.6 }),
  on = new r.Group();
Y.add(on);
const nn = -3.75,
  an = 3.1,
  Vn = [];
{
  const e = an - nn,
    t = (nn + an) / 2,
    o = yt(2048, 568, (a, s, l) => {
      ((a.fillStyle = "#343a44"), a.fillRect(0, 0, s, l));
      const i = Pe(4);
      for (let c = 0; c < 900; c++)
        ((a.fillStyle = `rgba(255,255,255,${i() * 0.025})`),
          a.fillRect(i() * s, i() * l, 1 + i() * 60, 1));
      for (let c = 24; c < s; c += 48)
        for (let f = 26; f < l; f += 48)
          ((a.fillStyle = "#14171c"),
            a.beginPath(),
            a.arc(c, f, 9, 0, 7),
            a.fill(),
            (a.strokeStyle = "#5b636f"),
            (a.lineWidth = 2),
            a.beginPath(),
            a.arc(c, f, 11, 0, 7),
            a.stroke());
    }),
    n = new r.Mesh(new r.BoxGeometry(e, 0.14, 1.9), [
      U("#30363f", { roughness: 0.4 }),
      U("#30363f", { roughness: 0.4 }),
      tt(
        new r.MeshPhysicalMaterial({
          map: o,
          metalness: 0.7,
          roughness: 0.42,
          envMapIntensity: 1,
          clearcoat: 0.2,
        }),
      ),
      U("#30363f"),
      U("#30363f", { roughness: 0.4 }),
      U("#30363f", { roughness: 0.4 }),
    ]);
  (n.position.set(t, -0.07, 0),
    (n.castShadow = n.receiveShadow = !0),
    on.add(n));
  for (const a of [0.98, -0.98]) {
    const s = new r.Mesh(
      new r.BoxGeometry(e - 0.3, 0.035, 0.035),
      K("#ffb160", 3.6),
    );
    (s.position.set(t, -0.115, a), on.add(s));
  }
  (Vn.push(
    ie(-1.6, -0.1, 1.4, "#ffb160", 2.2, 0.7),
    ie(1.6, -0.1, 1.4, "#ffb160", 2.2, 0.7),
  ),
    Vn.forEach((a) => (a.loc = a.p.clone())));
}
function zn(e, t) {
  const a = e - 2 * Math.sqrt(3) * 0.022,
    s = a * 0.8660254,
    l = [
      [0, (2 * s) / 3],
      [-a / 2, -s / 3],
      [a / 2, -s / 3],
    ],
    i = new r.Shape();
  for (let f = 0; f < 3; f++) {
    const h = l[f],
      d = l[(f + 2) % 3],
      m = l[(f + 1) % 3],
      u = Math.hypot(d[0] - h[0], d[1] - h[1]),
      v = Math.hypot(m[0] - h[0], m[1] - h[1]),
      y = [
        h[0] + ((d[0] - h[0]) / u) * 0.055,
        h[1] + ((d[1] - h[1]) / u) * 0.055,
      ],
      b = [
        h[0] + ((m[0] - h[0]) / v) * 0.055,
        h[1] + ((m[1] - h[1]) / v) * 0.055,
      ];
    (f ? i.lineTo(...y) : i.moveTo(...y), i.lineTo(...b));
  }
  i.closePath();
  const c = new r.ExtrudeGeometry(i, {
    depth: t - 2 * 0.022,
    bevelEnabled: !0,
    bevelThickness: 0.022,
    bevelSize: 0.022,
    bevelSegments: 1,
    curveSegments: 1,
  });
  return (c.translate(0, 0, -(t - 2 * 0.022) / 2), c.computeVertexNormals(), c);
}
const Wa = new r.MeshPhysicalMaterial({
  color: "#ffffff",
  roughness: 0.01,
  metalness: 0,
  transmission: 1,
  thickness: 0.85,
  ior: 1.785,
  dispersion: 0.8,
  envMapIntensity: 2.2,
  specularIntensity: 1,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  attenuationColor: new r.Color("#eaf8ff"),
  attenuationDistance: 8,
});
function Ha(e, t) {
  const o = {
      uA: { value: new r.Vector2() },
      uB: { value: new r.Vector2() },
      uK: { value: 0 },
      uS: { value: e },
      uL: { value: t },
      uCol: { value: new r.Color(1, 0.97, 0.92) },
      uInk: { value: 0 },
    },
    n = new r.ShaderMaterial({
      uniforms: o,
      transparent: !0,
      depthWrite: !1,
      blending: r.AdditiveBlending,
      fog: !1,
      vertexShader:
        "varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: `varying vec3 vP;varying vec3 vN;uniform vec2 uA;uniform vec2 uB;uniform float uK;uniform float uS;uniform float uL;uniform vec3 uCol;uniform float uInk;
   float segD(vec2 p,vec2 a,vec2 b){vec2 ab=b-a;float t=clamp(dot(p-a,ab)/max(dot(ab,ab),1e-6),0.,1.);return length(p-a-ab*t);}
   void main(){float rin=uS*.288675;vec2 p=vP.xy;float h=uS*.57735;
    vec2 n0=vec2(0.,-1.),n1=vec2(.8660254,.5),n2=vec2(-.8660254,.5);float din=rin-max(max(dot(p,n0),dot(p,n1)),dot(p,n2));
    vec2 c0=vec2(0.,h),c1=vec2(-uS*.5,-h*.5),c2=vec2(uS*.5,-h*.5);float dc=min(min(length(p-c0),length(p-c1)),length(p-c2));
    bool endF=abs(vN.z)>.7;float ed=max(endF?din:min(dc,uL*.5-abs(vP.z)),0.);
    float edge=exp(-ed/.022)*(endF?1.:.7);
    float d=segD(p,uA,uB),beam=exp(-d*d/.008)*.45+exp(-d*d/.06)*.07;
    float spot=endF?0.:exp(-min(dot(p-uA,p-uA),dot(p-uB,p-uB))/.02);
    if(uInk>.5){float ed2=exp(-ed/.075)*(endF?1.:.8),ed3=exp(-ed/.018);float a=clamp(ed2*.8+ed3*.45+beam*.5+spot*.5+.1,0.,1.);vec3 ink=mix(vec3(.3,.4,.52),vec3(.12,.18,.26),ed3);gl_FragColor=vec4(mix(ink,vec3(1.,.99,.96),clamp(beam*1.6+spot,0.,1.)),a*uK);return;}
    gl_FragColor=vec4(uCol*uK*(beam+edge*.34+spot*.7),1.);}`,
    });
  ((n.polygonOffset = !0),
    (n.polygonOffsetFactor = -2),
    (n.polygonOffsetUnits = -4));
  const a = new r.Mesh(zn(e, t), n);
  return ((a.renderOrder = 3), (a.userData.u = o), Xe.push(a), a);
}
const Lr = yt(
    512,
    512,
    (e, t, o) => {
      (e.clearRect(0, 0, t, o), e.translate(t / 2, o / 2));
      for (let n = 0; n < 72; n++) {
        const a = (n / 72) * Math.PI * 2,
          s = n % 6 === 0;
        ((e.strokeStyle = s ? "#dfe8f4" : "#8793a6"),
          (e.lineWidth = s ? 5 : 3),
          e.beginPath(),
          e.moveTo(
            Math.sin(a) * (s ? 200 : 214),
            -Math.cos(a) * (s ? 200 : 214),
          ),
          e.lineTo(Math.sin(a) * 238, -Math.cos(a) * 238),
          e.stroke());
      }
      ((e.fillStyle = "#ffb454"),
        e.beginPath(),
        e.moveTo(0, -186),
        e.lineTo(-12, -206),
        e.lineTo(12, -206),
        e.fill());
    },
    !0,
  ),
  _r = U("#4a525e", { roughness: 0.38, metalness: 0.9, envMapIntensity: 0.8 });
function Ya(e, t, o) {
  const n = new r.Group();
  e.add(n);
  const a = H();
  (a
    .cyl(_r, 0, 0, o - 0.1, t, t, 0.07, { seg: 64, rx: Math.PI / 2 })
    .cyl(Tt, 0, 0, o - 0.03, t * 0.42, t * 0.42, 0.06, {
      seg: 32,
      rx: Math.PI / 2,
    })
    .tor(To, 0, 0, o - 0.066, t * 0.99, 0.014, { seg: 64, seg2: 6 }),
    a.flush(n));
  const s = new r.Mesh(
    new r.PlaneGeometry(t * 2, t * 2),
    new r.MeshBasicMaterial({
      map: Lr,
      transparent: !1,
      alphaTest: 0.3,
      color: new r.Color(0.45, 0.52, 0.62),
      fog: !1,
    }),
  );
  return ((s.position.z = o - 0.062), n.add(s), n);
}
const Gr = tt(
    new r.MeshStandardMaterial({
      color: "#c69c72",
      roughness: 0.55,
      metalness: 0,
    }),
  ),
  j = {};
{
  const e = new r.Group();
  (Y.add(e), (j.g = e));
  const [t, o] = S.p1,
    n = -0.87,
    a = H(),
    s = new r.Group();
  (e.add(s),
    (j.hw = s),
    a
      .box($e, t, 0.13, -0.45, 1.15, 0.26, 1.25, { r: 0.03 })
      .box(Tt, t, 0.34, -0.55, 0.9, 0.16, 0.9, { r: 0.03 }),
    a
      .box(Tt, t, (0.42 + o + 0.05) / 2, n, 0.24, o + 0.05 - 0.42, 0.24, {
        r: 0.03,
      })
      .box($e, t, o, n, 0.42, 0.42, 0.28, { r: 0.04 })
      .box($e, t, o + 0.3, n + 0.12, 0.08, 0.22, 0.06, { r: 0.015 }),
    a.box(To, t, 0.4, -0.02, 0.5, 0.08, 0.06, { r: 0.02 }));
  for (const [m, u] of [
    [-0.5, -1],
    [0.5, -1],
    [-0.5, 0.1],
    [0.5, 0.1],
  ])
    a.cyl(kt, t + m, 0.27, u, 0.045, 0.045, 0.03, { seg: 6 });
  for (const m of [-0.34, 0.34])
    a.cyl(kt, t + m, 0.43, -0.02, 0.028, 0.028, 0.02, { seg: 6 });
  a.flush(s);
  {
    const m = new r.Mesh(new r.BoxGeometry(1, 0.025, 0.025), K("#ffb468", 3.4));
    (m.position.set(t, 0.03, 0.19), s.add(m));
  }
  const l = H();
  for (const m of [-1, 1])
    l.cyl(xt, t + m * 0.42, 0.14, 0.2, 0.08, 0.08, 0.12, {
      seg: 24,
      rx: Math.PI / 2,
    });
  (l.cyl(xt, t + 0.62, 0.34, -0.55, 0.07, 0.07, 0.1, {
    seg: 24,
    rz: Math.PI / 2,
  }),
    l.flush(s));
  const i = new r.Group();
  (e.add(i), (j.stand = i), (i.visible = !1));
  const c = H();
  (c
    .cyl(xt, t, o / 2, -0.66, 0.03, 0.036, o, { seg: 16 })
    .cyl(xt, t, o, -0.58, 0.032, 0.032, 0.12, { seg: 16, rx: Math.PI / 2 }),
    c.flush(i));
  const f = new r.Mesh(new r.CylinderGeometry(0.42, 0.46, 0.1, 40), Gr);
  (f.position.set(t, 0.05, -0.5),
    (f.castShadow = f.receiveShadow = !0),
    i.add(f));
  const h = new r.Group();
  (h.position.set(t, o, 0),
    e.add(h),
    (j.pivot = h),
    (j.disc = Ya(h, 0.4, -0.5)));
  const d = new r.Mesh(new r.ConeGeometry(0.05, 0.1, 3), K("#ffb454", 3));
  ((d.rotation.z = Math.PI),
    d.position.set(t, o + 0.48, -0.6),
    s.add(d),
    (j.mesh = new r.Mesh(zn(S.s1, S.len1), Wa)),
    (j.mesh.castShadow = !0),
    h.add(j.mesh),
    Xe.push(j.mesh),
    (j.glow = Ha(S.s1, S.len1)),
    h.add(j.glow));
}
const E = {};
{
  const e = new r.Group();
  (Y.add(e), (E.g = e));
  const t = new r.Mesh(new r.BoxGeometry(0.2, 1, 0.2), Tt);
  ((t.castShadow = !0), e.add(t), (E.col = t));
  const o = new r.Mesh(jo(0.62, 0.16, 0.62, 0.03), $e);
  ((o.castShadow = !0), e.add(o), (E.base = o));
  const n = new r.Mesh(new r.CylinderGeometry(0.065, 0.065, 0.1, 24), xt);
  ((n.rotation.x = Math.PI / 2), e.add(n), (E.knob = n));
  const a = new r.Group();
  (e.add(a),
    (E.pivot = a),
    (E.disc = Ya(a, 0.34, -0.45)),
    (E.blk = new r.Mesh(jo(0.36, 0.36, 0.26, 0.04), $e)),
    e.add(E.blk),
    (E.mesh = new r.Mesh(zn(S.s2, S.len2), Wa)),
    (E.mesh.castShadow = !0),
    a.add(E.mesh),
    Xe.push(E.mesh),
    (E.glow = Ha(S.s2, S.len2)),
    a.add(E.glow));
}
const _e = {};
{
  const [e, t] = S.A,
    o = S.RARC,
    n = 26 * q,
    a = 62 * q,
    s = -0.5,
    l = new r.Shape(),
    i = (w, P) => [e - w * Math.cos(P), t - w * Math.sin(P)];
  l.moveTo(...i(o + 0.08, n));
  for (let w = 0; w <= 24; w++) l.lineTo(...i(o + 0.08, Ge(n, a, w / 24)));
  for (let w = 24; w >= 0; w--) l.lineTo(...i(o - 0.08, Ge(n, a, w / 24)));
  const c = new r.ExtrudeGeometry(l, {
    depth: 0.1,
    bevelEnabled: !0,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 1,
  });
  c.translate(0, 0, s - 0.05);
  const f = new r.Mesh(c, To);
  ((f.castShadow = !0), Y.add(f));
  const h = H(),
    d = [K("#9fe6ff", 1.3), K("#9fe6ff", 2.4)];
  for (let w = 26; w <= 62; w += 2) {
    const P = w * q,
      G = w % 10 === 0,
      [W, N] = i(o + 0.04, P);
    h.box(d[G ? 1 : 0], W, N, s + 0.07, G ? 0.1 : 0.055, 0.011, 0.01, {
      rz: P,
    });
  }
  h.flush(Y, !1);
  const m = H();
  for (const w of [n + 0.03, a - 0.03]) {
    const [P, G] = i(o, w);
    m.cyl(kt, P, G / 2, s, 0.045, 0.045, G, { seg: 16 }).box(
      $e,
      P,
      0.07,
      s,
      0.34,
      0.14,
      0.34,
      { r: 0.03 },
    );
    for (const [W, N] of [
      [-0.11, -0.11],
      [0.11, -0.11],
      [-0.11, 0.11],
      [0.11, 0.11],
    ])
      m.cyl(kt, P + W, 0.15, s + N, 0.03, 0.03, 0.02, { seg: 6 });
  }
  m.flush(Y);
  const u = new r.Group();
  (Y.add(u), (_e.g = u));
  const v = o - S.RA,
    y = H();
  y.cyl($e, v - 0.52, 0, 0, 0.31, 0.31, 0.84, {
    seg: 40,
    rz: -Math.PI / 2,
  }).cyl(Dn, v - 0.99, 0, 0, 0.25, 0.29, 0.14, { seg: 40, rz: -Math.PI / 2 });
  for (let w = 0; w < 5; w++)
    y.cyl(To, v - 0.84 + w * 0.1, 0, 0, 0.355, 0.355, 0.035, {
      seg: 40,
      rz: -Math.PI / 2,
    });
  (y
    .cyl(Tt, v - 0.06, 0, 0, 0.35, 0.33, 0.12, { seg: 40, rz: -Math.PI / 2 })
    .tor(xt, v, 0, 0, 0.29, 0.03, { seg: 48, seg2: 8, ry: Math.PI / 2 }),
    y.cyl(kt, v - 0.5, 0.3, 0, 0.05, 0.05, 0.12, { seg: 12 }),
    y.box($e, v - 0.5, 0, -0.4, 0.34, 0.2, 0.12, { r: 0.02 }),
    y.flush(u));
  const b = new r.Mesh(
    new r.CircleGeometry(0.265, 40),
    new r.MeshBasicMaterial({
      color: new r.Color("#ffe2bc").multiplyScalar(3.2),
      fog: !1,
    }),
  );
  ((b.rotation.y = Math.PI / 2), (b.position.x = v - 0.005), u.add(b));
  const M = new r.Mesh(
    new r.PlaneGeometry(re * 0.62, ve * 0.7),
    new r.MeshBasicMaterial({
      color: new r.Color("#fff6ea").multiplyScalar(9),
      fog: !1,
    }),
  );
  ((M.rotation.y = Math.PI / 2), (M.position.x = v + 0.02), u.add(M));
  const g = new r.Group();
  u.add(g);
  const V = H();
  (V.box(Tt, 0, 0, s, 0.36, 0.3, 0.22, { r: 0.03 }).cyl(
    xt,
    0,
    -0.24,
    s,
    0.06,
    0.06,
    0.12,
    { seg: 20 },
  ),
    V.flush(g),
    (_e.car = g));
  const k = new r.Mesh(new r.ConeGeometry(0.04, 0.08, 3), K("#ffb454", 3));
  (k.position.set(0, 0.2, s + 0.08),
    (k.rotation.z = Math.PI),
    g.add(k),
    (_e.lens = b),
    (_e.slit = M),
    (_e.lx = v));
}
const ko = 2 * R,
  Kt = {
    uDim: { value: 0 },
    uHitV: { value: Array.from({ length: ko }, () => new r.Vector3(0, 1, 0)) },
    uHitC: { value: [...Ee, ...Ee].map((e) => new r.Vector3(e.r, e.g, e.b)) },
    uU: { value: new r.Vector2(0, re / 2 / Math.cos(S.scrTurn)) },
    uGain: { value: 7 },
  },
  Xa = `uniform vec3 uHitV[${ko}];uniform vec3 uHitC[${ko}];uniform vec2 uU;uniform float uGain;
 vec3 spotSum(float u,float v){vec3 c=vec3(0.);float du=(u-uU.x)/uU.y;float mu=exp(-pow(du*du,3.));float halo=exp(-du*du*1.2);
  for(int i=0;i<${ko};i++){vec3 h=uHitV[i];if(h.z<=0.)continue;float dv=(v-h.x)/max(h.y,1e-3);c+=uHitC[i]*h.z*(exp(-dv*dv*1.4)*mu+exp(-abs(v-h.x)*7.)*halo*.0035);}
  return max(c,0.)*uGain;}`,
  de = {};
{
  const e = new r.Group();
  (e.position.set(S.scrX, 0, 0),
    (e.rotation.y = S.scrTurn - Math.PI / 2),
    Y.add(e),
    (de.g = e));
  const t = S.scrY1 - S.scrY0,
    o = S.scrW,
    n = -0.42,
    a = n + o / 2,
    s = tt(
      new r.MeshStandardMaterial({
        color: "#5a5f68",
        roughness: 0.7,
        metalness: 0.2,
        envMapIntensity: 0.4,
      }),
      Object.assign(
        (u) => {
          (Object.assign(u.uniforms, Kt),
            (u.vertexShader = u.vertexShader
              .replace(
                "#include <common>",
                `#include <common>
varying vec2 vUV2;`,
              )
              .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
vUV2=position.xy;`,
              )),
            (u.fragmentShader = u.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
varying vec2 vUV2;uniform float uDim;` + Xa,
              )
              .replace(
                "#include <color_fragment>",
                `#include <color_fragment>
 vec3 spS=spotSum(vUV2.x,vUV2.y);diffuseColor.rgb*=1.-uDim*smoothstep(0.,.9,max(spS.r,max(spS.g,spS.b)));`,
              )
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
 totalEmissiveRadiance+=spS;`,
              )));
        },
        { key: "screen" },
      ),
    ),
    l = new r.Mesh(
      new r.BoxGeometry(o, t, 0.06).translate(
        a,
        (S.scrY0 + S.scrY1) / 2,
        -0.03,
      ),
      s,
    );
  ((l.castShadow = l.receiveShadow = !0), e.add(l), (de.board = l));
  const i = H(),
    c = (S.scrY0 + S.scrY1) / 2,
    f = U("#2a3039", { roughness: 0.36 });
  i.box(f, a, S.scrY1 + 0.04, -0.04, o + 0.1, 0.08, 0.12)
    .box(f, a, S.scrY0 - 0.04, -0.04, o + 0.1, 0.08, 0.12)
    .box(f, n - 0.04, c, -0.04, 0.08, t + 0.16, 0.12)
    .box(f, n + o + 0.04, c, -0.04, 0.08, t + 0.16, 0.12);
  const h = n + o + 0.2;
  i.box(Tt, h, (S.scrY1 + 0.1) / 2, -0.1, 0.16, S.scrY1 + 0.1, 0.16, {
    r: 0.03,
  })
    .box($e, h, 0.1, -0.1, 0.6, 0.2, 0.7, { r: 0.03 })
    .box($e, h - 0.1, c - 0.2, -0.1, 0.3, 0.36, 0.24, { r: 0.03 });
  const d = i.flush(e),
    m = new r.Mesh(Ca(-0.07, 0.07, 0, 0.13, 20, 0.02), xt);
  ((m.rotation.y = Math.PI / 2),
    m.position.set(h + 0.1, c - 0.2, -0.1),
    e.add(m),
    (de.hw = [...d.filter((u) => u.material !== f), m]),
    (de.frame = d.filter((u) => u.material === f)),
    (de.u0 = n),
    (de.uc = a),
    (de.W = o),
    (de.px = h));
}
const $a = {
    uHitV: { value: Array.from({ length: ko }, () => new r.Vector3(0, 1, 0)) },
    uHitC: Kt.uHitC,
    uU: { value: new r.Vector2(0, re / 2) },
    uGain: { value: 5 },
  },
  Ir = new r.ShaderMaterial({
    uniforms: $a,
    transparent: !0,
    depthWrite: !1,
    blending: r.AdditiveBlending,
    fog: !1,
    vertexShader:
      "varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: `varying vec2 vP;${Xa}void main(){vec3 c=spotSum(-vP.y,vP.x);gl_FragColor=vec4(c,1.);}`,
  }),
  At = new r.Mesh(
    new r.PlaneGeometry(an - nn, 1.2).translate((nn + an) / 2, 0, 0),
    Ir,
  );
((At.rotation.x = -Math.PI / 2),
  (At.position.y = 0.004),
  (At.renderOrder = 2),
  Y.add(At),
  Xe.push(At),
  (At.visible = !1));
class Er {
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
            ...Yt,
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
          fragmentShader: `${Sa}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*2.6),core=exp(-vS*vS*14.);float a=(k*.55+core*.9)*vC.a*ovVis(uSoft);
     if(uLight>.5){float c2=exp(-vS*vS*9.);float mx=max(vC.r,max(vC.g,vC.b)),sat=(mx-min(vC.r,min(vC.g,vC.b)))/max(mx,1e-4);vec3 rim=vC.rgb*mix(vec3(.5,.56,.68),vec3(1.),sat);gl_FragColor=vec4(mix(rim,vC.rgb*1.04,c2),clamp(exp(-vS*vS*1.6)*vC.a*ovVis(uSoft),0.,1.));}else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Ht.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? r.NormalBlending : r.AdditiveBlending),
      (o.needsUpdate = !0));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, n, a, s, l, i, c, f, h = i) {
    if (this.n >= this.max || c + f <= 0.002) return;
    const d = this.n++;
    (qt.subVectors(o, t),
      Ka.addVectors(t, o).multiplyScalar(0.5),
      qa.subVectors(C.position, Ka),
      ae.crossVectors(qt, qa));
    const m = ae.length();
    if (m < 1e-9) {
      this.n--;
      return;
    }
    ae.divideScalar(m);
    const u = Math.hypot(qt.x, qt.y) || 1,
      v = (-qt.y * ae.x + qt.x * ae.y) / u,
      y = ae.z,
      b = Math.hypot(n * v, a * y) + Un(t, 0.6),
      M = Math.hypot(s * v, l * y) + Un(o, 0.6),
      g = this.pos,
      V = d * 12;
    ((g[V] = t.x - ae.x * b),
      (g[V + 1] = t.y - ae.y * b),
      (g[V + 2] = t.z - ae.z * b),
      (g[V + 3] = t.x + ae.x * b),
      (g[V + 4] = t.y + ae.y * b),
      (g[V + 5] = t.z + ae.z * b),
      (g[V + 6] = o.x - ae.x * M),
      (g[V + 7] = o.y - ae.y * M),
      (g[V + 8] = o.z - ae.z * M),
      (g[V + 9] = o.x + ae.x * M),
      (g[V + 10] = o.y + ae.y * M),
      (g[V + 11] = o.z + ae.z * M),
      this.side.set(Br, d * 4));
    const k = this.col,
      w = d * 16;
    for (let P = 0; P < 4; P++) {
      const G = P < 2 ? i : h;
      ((k[w + P * 4] = G.r),
        (k[w + P * 4 + 1] = G.g),
        (k[w + P * 4 + 2] = G.b),
        (k[w + P * 4 + 3] = P < 2 ? c : f));
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
const Br = [-1, 1, -1, 1],
  qt = new r.Vector3(),
  Ka = new r.Vector3(),
  qa = new r.Vector3(),
  ae = new r.Vector3(),
  it = new Er(1400),
  Un = (e, t) =>
    ((C.position.distanceTo(e) *
      Math.tan(r.MathUtils.degToRad(C.fov / 2)) *
      2) /
      Math.max(Mt.clientHeight, 1)) *
    t *
    0.5;
class Vr {
  constructor(t) {
    this.max = t;
    const o = new r.BufferGeometry();
    ((this.c = new Float32Array(t * 4 * 3)),
      (this.q = new Float32Array(t * 4 * 2)),
      (this.k = new Float32Array(t * 4 * 4)));
    const n = new Uint16Array(t * 6);
    for (let a = 0; a < t; a++) {
      const s = a * 4;
      n.set([s, s + 1, s + 2, s + 1, s + 3, s + 2], a * 6);
      for (let l = 0; l < 4; l++)
        this.q.set([l % 2 ? 1 : -1, l < 2 ? -1 : 1], (s + l) * 2);
    }
    (o.setAttribute(
      "position",
      new r.BufferAttribute(this.c, 3).setUsage(r.DynamicDrawUsage),
    ),
      o.setAttribute("aQ", new r.BufferAttribute(this.q, 2)),
      o.setAttribute(
        "aK",
        new r.BufferAttribute(this.k, 4).setUsage(r.DynamicDrawUsage),
      ),
      o.setIndex(new r.BufferAttribute(n, 1)),
      (this.mesh = new r.Mesh(
        o,
        new r.ShaderMaterial({
          uniforms: { ...Yt, uLight: { value: 0 } },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: r.AdditiveBlending,
          vertexShader:
            "attribute vec2 aQ;attribute vec4 aK;varying vec2 vQ;varying vec4 vK;void main(){vQ=aQ;vK=aK;vec4 mv=modelViewMatrix*vec4(position,1.);float s=aK.a;mv.xy+=aQ*s;gl_Position=projectionMatrix*mv;}",
          fragmentShader: `${Sa}varying vec2 vQ;varying vec4 vK;uniform float uLight;void main(){float r=length(vQ);float core=exp(-r*r*18.)*1.4+exp(-r*r*4.)*.25;
    float st=exp(-abs(vQ.y)*60.)*exp(-abs(vQ.x)*2.6)+exp(-abs(vQ.x)*60.)*exp(-abs(vQ.y)*2.6);float a=(core+st*.8)*ovVis(.4);
    gl_FragColor=uLight>.5?vec4(vK.rgb*.5*a,0.):vec4(vK.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Ht.add(this.mesh));
  }
  begin() {
    this.n = 0;
  }
  add(t, o, n, a = 1) {
    if (this.n >= this.max || a <= 0.001) return;
    const s = this.n++;
    for (let l = 0; l < 4; l++)
      (this.c.set([t.x, t.y, t.z], (s * 4 + l) * 3),
        this.k.set([n.r * a, n.g * a, n.b * a, o], (s * 4 + l) * 4));
  }
  end() {
    const t = this.mesh.geometry;
    (t.setDrawRange(0, this.n * 6),
      (t.attributes.position.needsUpdate = !0),
      (t.attributes.aK.needsUpdate = !0));
  }
}
const Dt = new Vr(16);
function Co(e = 640, t = 104) {
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
      color: new r.Color(1.35, 1.35, 1.35),
    }),
  );
  return (
    (s.renderOrder = 10),
    (s.frustumCulled = !1),
    s.layers.set(1),
    Ht.add(s),
    (s.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 1,
      set(l, i = "", c = "#7fe3ff", f = 0) {
        const h = l + "|" + i + "|" + c + "|" + f;
        if (h === this.key) return;
        ((this.key = h),
          (this.args = [l, i, c, f]),
          n.clearRect(0, 0, e, t),
          (n.font = "600 38px Outfit, sans-serif"));
        const d = n.measureText(l).width;
        n.font = "500 30px DM Mono, monospace";
        const m = i ? n.measureText(i).width + 26 : 0,
          u = Math.min(e - 8, d + m + 84),
          v = f < 0 ? 4 : f > 0 ? e - 4 - u : (e - u) / 2;
        ((n.fillStyle = "rgba(10,14,26,.86)"),
          sr(n, v, 8, u, t - 16, (t - 16) / 2),
          n.fill(),
          (n.fillStyle = c),
          n.beginPath(),
          n.arc(v + 34, t / 2, 9, 0, 7),
          n.fill(),
          (n.fillStyle = "#f2f6ff"),
          (n.font = "600 38px Outfit, sans-serif"),
          (n.textBaseline = "middle"),
          n.fillText(l, v + 56, t / 2 + 1),
          i &&
            ((n.fillStyle = "#9fe6ff"),
            (n.font = "500 30px DM Mono, monospace"),
            n.fillText(i, v + 56 + d + 22, t / 2 + 2)),
          (a.needsUpdate = !0));
      },
    }),
    Zo.push(() => {
      const l = s.userData;
      l.args && ((l.key = ""), l.set(...l.args));
    }),
    s
  );
}
function Po(e, t, o = 24, n = 0) {
  const a = (Un(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(C.quaternion),
    e.scale.set(a, a, a),
    n &&
      e.position.addScaledVector(
        zr.set(0, 1, 0).applyQuaternion(C.quaternion),
        (n * a * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-Qt * 8))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
const zr = new r.Vector3();
let Ao = !0;
const Do = new r.Group();
(St.add(Do), (Do.visible = !1));
{
  const e = new r.Mesh(
    new r.SphereGeometry(140, 48, 24),
    new r.ShaderMaterial({
      side: r.BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: { uC: { value: new r.Vector3(0, 4, -20) } },
      vertexShader:
        "varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "varying vec3 vW;uniform vec3 uC;void main(){vec3 d=normalize(vW-vec3(0.,3.,0.));float glow=exp(-pow(length(vW.xy-uC.xy)/70.,2.));float up=smoothstep(-.1,.7,d.y);vec3 c=mix(vec3(.02,.045,.11),vec3(.05,.11,.26),glow);c=mix(c,vec3(.015,.03,.075),up*.7);gl_FragColor=vec4(c,1.);}",
    }),
  );
  ((e.renderOrder = -10), Do.add(e), Xe.push(e));
  const t = tt(
      new r.MeshStandardMaterial({
        color: "#1b2130",
        roughness: 0.28,
        metalness: 0.5,
        envMapIntensity: 0.55,
      }),
      ma,
    ),
    o = new r.Mesh(new r.CircleGeometry(90, 64), t);
  ((o.rotation.x = -Math.PI / 2),
    (o.receiveShadow = !0),
    Do.add(o),
    Wt.push(o));
}
const sn = 0.9,
  je = new r.Group();
(St.add(je), (je.visible = !1));
{
  const e = H(),
    t = 8.4,
    o = new r.Shape(
      [
        [-t / 2, 0.12],
        [-t / 2 + 0.35, sn],
        [t / 2 - 0.35, sn],
        [t / 2, 0.12],
      ].map(([l, i]) => new r.Vector2(l, i)),
    ),
    n = new r.ExtrudeGeometry(o, {
      depth: 2.6,
      bevelEnabled: !0,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
  n.translate(0, 0, -1.3);
  const a = new r.Mesh(
    n,
    U("#343a44", {
      roughness: 0.5,
      metalness: 0.25,
      envMapIntensity: 0.35,
      clearcoat: 0.2,
    }),
  );
  ((a.castShadow = a.receiveShadow = !0),
    je.add(a),
    e
      .box(z("#14171c", { roughness: 0.6 }), 0, 0.06, 0, t - 0.4, 0.12, 2.3)
      .flush(je));
  for (const l of [1.36, -1.36]) {
    const i = new r.Mesh(
      new r.BoxGeometry(t - 0.9, 0.045, 0.045),
      K("#ffab55", 3.2),
    );
    (i.position.set(0, 0.1, l), je.add(i));
  }
  const s = new r.Mesh(
    new r.BoxGeometry(t - 0.8, 0.03, 0.03),
    K("#ffb468", 2.6),
  );
  (s.position.set(0, sn - 0.02, 1.33),
    je.add(s),
    ie(-2.5, 0.4, 2.2, "#ffab55", 3, 0.35, je),
    ie(2.5, 0.4, 2.2, "#ffab55", 3, 0.35, je));
}
const Rt = new r.Group();
(St.add(Rt), (Rt.visible = !1));
{
  const e = [];
  for (let d = 40; d > -6; d -= 2) e.push([d, 0]);
  for (let d = 0; d <= 16; d++) {
    const m = ((d / 16) * Math.PI) / 2;
    e.push([-6 - Math.sin(m) * 10, 10 - Math.cos(m) * 10]);
  }
  for (let d = 12; d <= 60; d += 4) e.push([-16, d]);
  const t = [],
    o = [],
    n = [],
    a = 70;
  e.forEach(([d, m], u) => {
    const [v, y] = e[Math.min(u + 1, e.length - 1)],
      [b, M] = e[Math.max(u - 1, 0)],
      g = v - b,
      V = y - M,
      k = Math.hypot(g, V) || 1;
    for (const w of [-a, a]) (t.push(w, m, d), o.push(0, -g / k, V / k));
  });
  for (let d = 0; d < e.length - 1; d++) {
    const m = d * 2;
    n.push(m, m + 1, m + 2, m + 1, m + 3, m + 2);
  }
  const s = new r.BufferGeometry();
  (s.setAttribute("position", new r.Float32BufferAttribute(t, 3)),
    s.setAttribute("normal", new r.Float32BufferAttribute(o, 3)),
    s.setIndex(n));
  const l = yt(512, 512, (d, m, u) => {
      ((d.fillStyle = "#d9cabb"), d.fillRect(0, 0, m, u));
      const v = (y, b, M) => {
        const g = d.createLinearGradient(y, 0, y + b, 0);
        (g.addColorStop(0, "rgba(255,248,236,0)"),
          g.addColorStop(0.5, `rgba(255,248,236,${M})`),
          g.addColorStop(1, "rgba(255,248,236,0)"),
          (d.fillStyle = g),
          d.fillRect(y, 0, b, u));
      };
      (d.save(),
        d.translate(m / 2, u / 2),
        d.rotate(-0.62),
        d.translate(-m / 2, -u / 2),
        v(40, 170, 0.95),
        v(250, 90, 0.7),
        v(360, 150, 0.85),
        d.restore());
    }),
    i = z("#ffffff", { roughness: 0.92, envMapIntensity: 0.4, map: l });
  {
    const d = [],
      m = s.attributes.position;
    for (let u = 0; u < m.count; u++)
      d.push(
        D(0.5 + m.getX(u) / 28, 0, 1),
        D(0.3 + m.getY(u) / 16 - m.getZ(u) / 60, 0, 1),
      );
    s.setAttribute("uv", new r.Float32BufferAttribute(d, 2));
  }
  const c = new r.Mesh(s, i);
  ((c.receiveShadow = !0), Rt.add(c));
  const f = H(),
    h = z("#efe9dd", { roughness: 0.7 });
  (f
    .box(z("#5f6f84", { roughness: 0.6 }), -3.3, 0.16, -2.6, 2.3, 0.32, 1.55, {
      r: 0.03,
      ry: 0.08,
    })
    .box(h, -3.24, 0.16, -2.6, 2.18, 0.26, 1.5, { ry: 0.08 }),
    f
      .box(z("#6d7c90", { roughness: 0.6 }), -3.2, 0.48, -2.55, 2, 0.32, 1.4, {
        r: 0.03,
        ry: -0.05,
      })
      .box(h, -3.14, 0.48, -2.55, 1.9, 0.26, 1.36, { ry: -0.05 }),
    f.flush(Rt),
    Gn(Rt, -4.3, 0, -2.9, 1.9, 11, "#f3efe8", { n: 12, len: 1.1 }));
}
const Ur = yt(512, 128, (e, t, o) => {
    ((e.fillStyle = "#caa27a"), e.fillRect(0, 0, t, o));
    const n = Pe(21);
    for (let a = 0; a < 90; a++) {
      ((e.strokeStyle = `rgba(${120 + n() * 40},${80 + n() * 30},50,${0.12 + n() * 0.18})`),
        (e.lineWidth = 1 + n() * 2));
      const s = n() * o;
      (e.beginPath(), e.moveTo(0, s));
      for (let l = 0; l <= t; l += 32)
        e.lineTo(l, s + Math.sin(l * 0.02 + a) * 3);
      e.stroke();
    }
  }),
  Nr = tt(
    new r.MeshStandardMaterial({ map: Ur, roughness: 0.55, metalness: 0 }),
  ),
  Ft = new r.Mesh(jo(2.3, 0.22, 0.62, 0.03), Nr);
((Ft.castShadow = Ft.receiveShadow = !0),
  Ft.position.set(de.uc, 0.11, -0.2),
  de.g.add(Ft));
const Oi = ur(Rt, -0.2, 0, -0.2, 8.5, 3.4, 0.34);
function ja(e, t, o, n, a, s, l) {
  const i = Na(t, { pale: l });
  return (i.position.set(o, n, a), (i.rotation.y = s), e.add(i), i);
}
(ja(je, 0.82, 2.75, 0.5, 1.345, 0, !1), ja(Ft, 0.73, 0, 0.02, 0.315, 0, !0));
const Ve = [-20, 24],
  ze = [28, 60],
  Nn = 1.1,
  jt = 1.15,
  Qa = [
    { r1: 0, el: 42, e2: 0, d2: 0 },
    { r1: "min", el: 42, e2: 0, d2: 0 },
    { r1: 18, el: 42, e2: 0, d2: 0 },
    { r1: 0, el: 42, e2: 1, d2: 0 },
  ],
  Or = ["Split", "Least bend", "Trapped", "Rejoin"];
let Qt = 0.016,
  On = 0.016,
  le = 0,
  rn = 0;
const lt = (e) => {
    p.r1T = D(e, Ve[0], Ve[1]);
  },
  bt = (e) => {
    p.elT = D(e, ze[0], ze[1]);
  },
  Ro = (e) => {
    p.d2T = D(e, 0, Nn);
  },
  Lt = (e) => {
    ((p.e2T = e ? 1 : 0), e || (p.d2T = 0), Io(!0));
  };
function Wn(e) {
  const t = Qa[e];
  (bt(t.el),
    lt(t.r1 === "min" ? t.el + 30 - wo(Te) : t.r1),
    Lt(!!t.e2),
    Ro(t.d2),
    Ze(Or[e]));
}
function Wr(e) {
  rn = Math.min(rn + e, 0.1);
  const t = 1 / 120;
  for (; rn >= t;) {
    rn -= t;
    const o = 1 - Math.exp(-t * (Oe ? 16 : 4.2));
    ((p.r1 += (p.r1T - p.r1) * o),
      (p.el += (p.elT - p.el) * o),
      (p.d2 += (p.d2T - p.d2) * (1 - Math.exp(-t * (Oe ? 14 : 3)))));
    const n = t / 1.9;
    ((p.e2 =
      p.e2T > p.e2 ? Math.min(p.e2T, p.e2 + n) : Math.max(p.e2T, p.e2 - n)),
      (p.ex += (p.exT - p.ex) * (1 - Math.exp(-t * 2.6))),
      (p.hoverA +=
        ((p.hover >= 0 ? 1 : 0) - p.hoverA) * (1 - Math.exp(-t * 10))));
  }
}
const Q = { x: 0, y: 0, z: 0, rot: 0, cover: 0 },
  Zt = [0, 0];
function Hr(e) {
  for (let t = 1; t < e.n; t++)
    if (e.seg[t - 1] >= 0 && e.seg[t] < 0)
      return ((Zt[0] = e.x[t]), (Zt[1] = e.y[t]), !0);
  return !1;
}
function Hn() {
  const e = ee.p[0],
    t = ee.p[1],
    o = ee.lamp;
  ((e.cx = S.p1[0]), (e.cy = S.p1[1]), (e.rot = p.r1 * q), La(e));
  const n = p.el * q;
  ((o.dx = Math.cos(n)),
    (o.dy = Math.sin(n)),
    (o.x = S.A[0] - o.dx * S.RA),
    (o.y = S.A[1] - o.dy * S.RA),
    Pt(st[0], Te, !1));
  const a = st[0];
  let s = Math.cos(30 * q + e.rot),
    l = Math.sin(30 * q + e.rot);
  (Hr(a) && a.seg[a.n - 2] < 0
    ? ((s = a.dx), (l = a.dy))
    : ((Zt[0] = (e.V[0] + e.V[4]) / 2), (Zt[1] = (e.V[1] + e.V[5]) / 2)),
    (T.fanDX = s),
    (T.fanDY = l));
  {
    const k = Math.cos(30 * q + e.rot),
      w = Math.sin(30 * q + e.rot),
      P = S.s2 / (2 * Math.sqrt(3)),
      G = p.d2 + p.ex * jt;
    let W = s,
      N = l;
    {
      const Ye = ne[0][0],
        vt = ne[0][R - 1];
      if (
        (Pt(Ye, Fe[0], !1),
        Pt(vt, Fe[R - 1], !1),
        Ye.seg[Ye.n - 2] < 0 &&
          vt.seg[vt.n - 2] < 0 &&
          Ye.seg[1] === 0 &&
          vt.seg[1] === 0)
      ) {
        ((W = Ye.dx + vt.dx), (N = Ye.dy + vt.dy));
        const la = Math.hypot(W, N);
        ((W /= la), (N /= la));
      }
    }
    const he = Math.max(W * k + N * w, 0.2),
      Z = (S.gap2 + G * he) / he,
      Eo = Zt[0] + W * Z,
      mt = Zt[1] + N * Z,
      Bo = Eo + k * P,
      Vo = mt + w * P,
      zo = e.rot + Math.PI + p.r2 * q,
      [Uo, Se, Je] = F.cur === "studio" ? S.park2S : S.park2,
      pe = p.e2,
      gt = Oo(0, 0.36, pe),
      No = Oo(0.18, 0.62, pe),
      zt = Oo(0.46, 1, pe);
    ((Q.x = Ge(Uo, Bo, zt)),
      (Q.y = Ge(Se, Vo, Math.max(gt, zt))),
      (Q.z = Ge(Je, 0, zt)),
      (Q.rot = Ge(0, zo, No)));
    const _s = Q.z - S.len2 / 2,
      Gs = Q.z + S.len2 / 2;
    ((Q.cover = D((Math.min(Gs, re / 2) - Math.max(_s, -re / 2)) / re, 0, 1)),
      (t.cx = Q.x),
      (t.cy = Q.y),
      (t.rot = Q.rot),
      La(t));
    {
      const Ye = ee.obs[1],
        vt = Q.z - 0.62;
      ((Ye.on = Math.abs(vt) < 0.31 + re / 2),
        (Ye.x0 = Q.x - 0.31),
        (Ye.x1 = Q.x + 0.31));
    }
  }
  const i = Q.cover;
  if (((T.cover = i), i < 0.999))
    for (let k = 0; k < R; k++) Pt(ne[0][k], Fe[k], !1);
  if (i > 0.001) {
    for (let k = 0; k < R; k++) Pt(ne[1][k], Fe[k], !0);
    Pt(st[1], Te, !0);
  }
  const c = i > 0.5 ? 1 : 0,
    f = st[c],
    h = ne[c],
    d = (k, w) => Math.atan2(w, k);
  T.th1 = f.th1;
  const m = (d(o.dx, o.dy) - d(f.dx, f.dy)) * Ie;
  ((T.devTot = ((m + 540) % 360) - 180),
    (T.dev = (((d(o.dx, o.dy) - d(s, l)) * Ie + 540) % 360) - 180));
  const u = (k) => {
    let w = 1e9,
      P = -1e9;
    const G = ne[k],
      W = d(G[R - 1].dx, G[R - 1].dy);
    for (let N = 0; N < R; N++) {
      const he = G[N];
      if (he.tir || he.face !== 0) continue;
      const Z = (((d(he.dx, he.dy) - W) * Ie + 540) % 360) - 180;
      ((w = Math.min(w, Z)), (P = Math.max(P, Z)));
    }
    return P > w ? P - w : 0;
  };
  ((T.spreadTot = u(c)), (T.spread = i < 0.999 ? u(0) : T.spreadTot));
  let v = 1e9,
    y = -1e9,
    b = 0;
  for (let k = 0; k < R; k++) {
    const w = h[k];
    (w.end === 1 &&
      ((v = Math.min(v, w.y[w.n - 1])), (y = Math.max(y, w.y[w.n - 1]))),
      ne[0][k].tir && i < 0.5 && b++);
  }
  ((T.scrSpread = y > v ? y - v : 0),
    (T.onScr = y >= v),
    (T.trapped = b),
    (T.rMin = p.el + 30 - wo(Te)),
    (T.dMin = _a(Te)));
  const M = Kt.uHitV.value,
    g = $a.uHitV.value;
  let V = !1;
  for (let k = 0; k < R; k++) ((So.v[k] = 0), (So.w[k] = 0));
  for (let k = 0; k < 2; k++) {
    const w = k ? i : 1 - i;
    for (let P = 0; P < R; P++) {
      const G = ne[k][P],
        W = k * R + P;
      if ((M[W].set(0, 1, 0), g[W].set(0, 1, 0), !(w <= 0.001))) {
        if (G.end === 1) {
          const N = G.y[G.n - 1];
          (M[W].set(N, ve / 2 / Math.max(Math.abs(G.dx), 0.15), G.I * w),
            w >= 0.5 && ((So.v[P] = N), (So.w[P] = G.I)));
        } else if (G.end === 2) {
          const N = G.x[G.n - 1];
          (g[W].set(N, ve / 2 / Math.max(Math.abs(G.dy), 0.12), G.I * w),
            (V = !0));
        }
      }
    }
  }
  At.visible = V;
}
function Yr() {
  (Hn(), (j.pivot.rotation.z = p.r1 * q));
  const e = p.el * q,
    [t, o] = S.A;
  (_e.g.position.set(t - Math.cos(e) * S.RARC, o - Math.sin(e) * S.RARC, 0),
    (_e.g.rotation.z = e),
    (_e.car.rotation.z = 0));
  const n = Q;
  (E.pivot.position.set(n.x, n.y, n.z), (E.pivot.rotation.z = n.rot));
  const a = n.z - 0.62,
    s = Math.max(n.y, 0.3);
  (E.col.position.set(n.x, s / 2, a),
    (E.col.scale.y = s),
    E.base.position.set(n.x, 0.08, a),
    E.knob.position.set(n.x + 0.33, 0.08, a),
    E.blk.position.set(n.x, n.y, a - 0.02));
  const l = (p.el - ze[0]) / (ze[1] - ze[0]);
  ((I.dial.userData.spin.rotation.z = (0.5 - l) * 4.2),
    (I.dial.userData.ring.userData.u.uA0.value = Math.PI / 2 - 2.1),
    (I.dial.userData.ring.userData.u.uLen.value = 4.2 * l + 0.02),
    (I.knob2.userData.ring.userData.u.uA0.value = Math.PI / 2),
    (I.knob2.userData.ring.userData.u.uLen.value =
      Math.PI * 2 * D(p.e2, 0, 1) + 0.001),
    (I.knob2.userData.spin.rotation.z = -p.e2 * Math.PI),
    I.s1.set((p.r1 - Ve[0]) / (Ve[1] - Ve[0])),
    I.s2.set(p.e2 < 0.02 ? 0 : 0.12 + 0.88 * p.e2 * (1 - p.d2 / Nn)));
  const i = [
    p.r1.toFixed(2),
    p.el.toFixed(2),
    p.e2.toFixed(3),
    p.d2.toFixed(3),
    p.ex.toFixed(3),
  ].join();
  i !== I.drawKey &&
    le - I.drawnAt > 0.066 &&
    ((I.drawKey = i),
    (I.drawnAt = le),
    I.fan.userData.redraw(le),
    I.spec.userData.redraw(le),
    $t.prism.userData.redraw($t.prism.userData.draw),
    $t.wave.userData.redraw($t.wave.userData.draw));
}
const _t = {
    room: X,
    consoleG: Be,
    stage: Do,
    studioSet: Rt,
    exBase: je,
    railG: on,
  },
  Gt = {
    lab: {
      bg: "#10151f",
      fog: "#1a2130",
      fogD: 0.0065,
      tone: r.ACESFilmicToneMapping,
      exp: 1.28,
      far: 0.6,
      env: "show",
      envI: 0.7,
      bloomT: 1.05,
      bloomS: 0.42,
      refl: 0.5,
      hemi: [9414360, 3813414, 0.5],
      sun: [16763279, 2.1],
      sunDir: [0.62, 0.62, 0.48],
      rim: 0.9,
      key2: 0.55,
      satK: 1.3,
      show: {
        room: 1,
        consoleG: 1,
        stage: 0,
        studioSet: 0,
        exBase: 0,
        railG: 1,
      },
      benchY: En.top + 0.14,
      ex: 0,
      light: 0,
      veil: "#0b0f1a",
      glow: 0.32,
      fov: 6,
    },
    exploded: {
      bg: "#081026",
      fog: "#0a1430",
      fogD: 0.006,
      tone: r.ACESFilmicToneMapping,
      exp: 0.9,
      far: 0.8,
      env: "show",
      envI: 0.75,
      bloomT: 1.5,
      bloomS: 0.3,
      refl: 0.45,
      hemi: [8362712, 1844278, 0.5],
      sun: [16769212, 1.5],
      sunDir: [-0.35, 0.85, -0.45],
      rim: 1.5,
      key2: 0.55,
      satK: 1.1,
      show: {
        room: 0,
        consoleG: 0,
        stage: 1,
        studioSet: 0,
        exBase: 1,
        railG: 1,
      },
      benchY: sn + 0.14,
      ex: 1,
      light: 0,
      veil: "#081226",
      glow: 0.36,
    },
    studio: {
      bg: "#f1e5d8",
      fog: "#f1e5d8",
      fogD: 0.0045,
      tone: r.NeutralToneMapping,
      exp: 1,
      env: "studio",
      envI: 1,
      bloomT: 2.6,
      bloomS: 0.18,
      refl: 0,
      hemi: [16774374, 14273723, 0.85],
      sun: [16773340, 2.8],
      sunDir: [-0.45, 0.8, 0.45],
      rim: 0.25,
      key2: 0.45,
      satK: 0.93,
      show: {
        room: 0,
        consoleG: 0,
        stage: 0,
        studioSet: 1,
        exBase: 0,
        railG: 0,
      },
      benchY: 0,
      ex: 0,
      light: 1,
      veil: "#f1e5d8",
      glow: 0,
    },
  },
  F = { cur: "lab", next: null, at: -99, out: -99, cam: null };
function ln() {
  const e = Gt[F.cur];
  (J.background.set(e.bg),
    J.fog.color.set(e.fog),
    (J.fog.density = e.fogD * x.fog),
    (_.toneMapping = e.tone),
    (_.toneMappingExposure = x.exposure * e.exp),
    (J.environment = Xo[e.env]),
    (J.environmentIntensity = x.env * e.envI),
    (nt.threshold = x.bloomThreshold * e.bloomT),
    (nt.strength = x.bloomStrength * e.bloomS),
    ($o.uReflStrength.value = x.reflect * e.refl),
    Ho.color.set(e.hemi[0]),
    Ho.groundColor.set(e.hemi[1]),
    (Ho.intensity = e.hemi[2] * x.fill),
    oe.color.set(e.sun[0]),
    (oe.intensity = e.sun[1] * x.sun),
    oe.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    (Sn.intensity = e.rim * x.rim),
    (Tn.intensity = e.key2 * x.fill),
    (da.value = x.sat * e.satK));
  for (const o in _t) _t[o].visible = !!e.show[o];
  (it.setLight(e.light),
    (Dt.mesh.material.uniforms.uLight.value = e.light),
    gn.classList.toggle("light", !!e.light),
    Y.position.set(0, e.benchY, 0),
    (ee.tab.y = 0),
    Vn.forEach((o) => {
      (o.p.copy(o.loc).add(Y.position), (o.i = e.show.railG ? o.i0 : 0));
    }));
  const t = F.cur === "studio";
  cn = !!e.light;
  for (const o of [j.glow, E.glow])
    ((o.userData.u.uInk.value = t ? 1 : 0),
      (o.material.blending = t ? r.NormalBlending : r.AdditiveBlending),
      (o.material.needsUpdate = !0));
  ((Ft.visible = t),
    de.hw.forEach((o) => (o.visible = !t)),
    de.frame.forEach((o) => (o.visible = !t)),
    (j.hw.visible = !t),
    (j.stand.visible = t),
    (j.disc.visible = !t),
    de.board.material.color.set(t ? "#f2efe9" : "#5a5f68"),
    aa(),
    (mo.k.value = e.glow * x.glow),
    (Kt.uGain.value = F.cur === "studio" ? 7 : 10),
    (Kt.uDim.value = F.cur === "studio" ? 0.86 : 0),
    oa.forEach((o) =>
      o.classList.toggle("on", o.dataset.v === (F.next || F.cur)),
    ));
}
function Jt(e, t = !1, o = null) {
  if (Gt[e]) {
    if (t) {
      ((F.cur = e), (F.next = null), ln(), Za(e), oo(o || ft[e]));
      return;
    }
    if (e === F.cur && !F.next) {
      o && oo(o);
      return;
    }
    ((F.next = e),
      (F.at = le),
      (F.cam = o),
      (A("#veil").style.background = Gt[e].veil),
      oa.forEach((n) => n.classList.toggle("on", n.dataset.v === e)));
  }
}
function Za(e) {
  ((p.exT = Gt[e].ex),
    e === "exploded" && (p.e2T = 1),
    (p.ex = p.exT),
    (p.e2 = p.e2T),
    (p.d2 = p.d2T),
    (p.r1 = p.r1T),
    (p.el = p.elT));
}
function Xr() {
  const e = A("#veil");
  let t = 0;
  if (F.next) {
    const o = le - F.at;
    ((t = D(o / 0.2, 0, 1)),
      o >= 0.2 &&
        ((F.cur = F.next),
        (F.next = null),
        ln(),
        Za(F.cur),
        oo(F.cam || ft[F.cur]),
        (F.cam = null),
        (F.out = le),
        (t = 1)));
  } else t = 1 - D((le - F.out) / 0.4, 0, 1);
  e.style.opacity = t.toFixed(3);
}
const It = { beam: 1.9, glass: 0.3, fan: 0.9, gam: 0.72, refl: 0.8 },
  B = new r.Vector3(),
  ct = new r.Vector3(),
  Ja = new r.Vector3(),
  Ue = new r.Color(),
  ye = new r.Color(),
  Yn = new r.Color(1.25, 1.1, 0.92),
  be = (e, t, o) => e.set(t + Y.position.x, o + Y.position.y, Y.position.z),
  eo = [[0, 0, 0]];
Ee.forEach((e, t) => eo.push([eo[t][0] + e.r, eo[t][1] + e.g, eo[t][2] + e.b]));
function es(e, t, o) {
  const n = D(Math.round(o), 1, R),
    a = D(Math.round(t - (n - 1) / 2), 0, R - n),
    s = a + n - 1,
    l = eo[a],
    i = eo[s + 1],
    c = i[0] - l[0],
    f = i[1] - l[1],
    h = i[2] - l[2],
    d = Math.max(c, f, h, 1e-6);
  return e.setRGB(c / d, f / d, h / d);
}
const ts = new r.Color();
function Xn(e, t) {
  if (t.n !== e.n || t.end !== e.end || t.tir !== e.tir) return !1;
  for (let o = 0; o < e.n - 1; o++) if (t.seg[o] !== e.seg[o]) return !1;
  return !0;
}
function os(e, t, o) {
  const n = e[t],
    a = e[t < R - 1 ? t + 1 : t - 1];
  return Xn(n, a)
    ? Math.min(Math.hypot(n.x[o] - a.x[o], n.y[o] - a.y[o]), 0.24)
    : 0;
}
function ns(e, t, o, n) {
  const a = e[0],
    s = e[R - 1],
    l = e[t];
  let i = n;
  return (
    Xn(a, l) &&
      Xn(s, l) &&
      (i = Math.hypot(a.x[o] - s.x[o], a.y[o] - s.y[o]) / (R - 1)),
    D(ve / Math.max(i, 1e-4), 1, R)
  );
}
let cn = !1;
function as(e, t) {
  if (t < 0.002) return;
  const o = ne[e],
    n = o[0];
  if (n.n > 1) {
    (be(B, n.x[0], n.y[0]), be(ct, n.x[1], n.y[1]));
    const s = t * (cn ? 1 : It.beam);
    (Ue.setRGB(s, s * 0.985, s * 0.955),
      it.seg(
        B,
        ct,
        ve / 2,
        re / 2,
        ve / 2,
        re / 2,
        Ue,
        0.8,
        n.n === 2 && n.end === 0 ? 0 : 1,
      ));
  }
  for (let s = 0; s < R; s++) {
    const l = o[s];
    if (!(p.hoverA > 0.01 && p.hover === s))
      for (let i = 1; i < l.n - 1; i++) {
        const c = os(o, s, i),
          f = os(o, s, i + 1),
          h = Math.max(ve / 2, c * 0.5),
          d = Math.max(ve / 2, f * 0.5),
          m = ns(o, s, i, c),
          u = ns(o, s, i + 1, f),
          v = l.seg[i] >= 0,
          y = i === l.n - 2;
        if ((be(B, l.x[i], l.y[i]), be(ct, l.x[i + 1], l.y[i + 1]), cn)) {
          const g = t * l.I * (1 - 0.75 * p.hoverA) * (v ? 0.45 : 0.9);
          (es(Ue, s, m),
            es(ts, s, u),
            it.seg(
              B,
              ct,
              h * 1.3,
              re / 2,
              d * 1.3,
              re / 2,
              Ue,
              g * 1.9 * Math.pow(m, -0.4),
              y && l.end === 0
                ? 0
                : g * 1.9 * Math.pow(u, -0.4) * (y && l.end === 1 ? 0.85 : 1),
              ts,
            ));
          continue;
        }
        Ue.copy(Ee[s]).multiplyScalar(
          (v ? It.glass : It.fan) * t * l.I * R * (1 - 0.75 * p.hoverA),
        );
        const b = Math.pow(m, -It.gam),
          M =
            y && l.end === 0
              ? 0
              : Math.pow(u, -It.gam) * (y && l.end === 1 ? 0.35 : 1);
        it.seg(B, ct, h, re / 2, d, re / 2, Ue, b, M);
      }
  }
  const a = st[e];
  if (a.rR > 0) {
    (be(B, a.rfx, a.rfy), be(ct, a.rfx + a.rdx * 1.3, a.rfy + a.rdy * 1.3));
    const s = t * (cn ? 0.9 : It.refl * a.rR);
    (Ue.setRGB(s, s, s),
      it.seg(B, ct, ve / 2, re / 2, ve / 2, re / 2, Ue, 1, 0));
  }
}
function $r(e, t) {
  for (let o = 0; o < 2; o++) {
    const n = o ? T.cover : 1 - T.cover;
    if (n < 0.02) continue;
    const a = ne[o][e];
    Ue.copy(xo[e]).multiplyScalar(2.6 * t * n);
    for (let s = 0; s < a.n - 1; s++)
      (be(B, a.x[s], a.y[s]),
        be(ct, a.x[s + 1], a.y[s + 1]),
        it.seg(
          B,
          ct,
          ve * 0.36,
          re * 0.3,
          ve * 0.36,
          re * 0.3,
          Ue,
          1,
          s === a.n - 2 && a.end === 0 ? 0 : 1,
        ));
  }
}
const ue = {
    slit: ie(0, -99, 0, "#ffe2c0", 1.3, 0),
    entry: ie(0, -99, 0, "#ffffff", 1.3, 0),
    exit: ie(0, -99, 0, "#ffffff", 1.7, 0),
    scr: ie(0, -99, 0, "#ffffff", 2.4, 0),
    tab: ie(0, -99, 0, "#ffffff", 1.6, 0),
  },
  ce = { lamp: Co(), prism: Co(), screen: Co(), p2: Co(), hover: Co(720, 96) };
function ss(e, t, o, n, a) {
  const s = e.userData.u;
  let l = -1,
    i = -1;
  for (let v = 1; v < o.n; v++)
    if (l < 0 && o.seg[v] === n && o.seg[v - 1] !== n) l = v;
    else if (l >= 0 && o.seg[v - 1] === n && o.seg[v] !== n) {
      i = v;
      break;
    }
  if (l < 0 || i < 0 || a < 0.002) {
    (s.uA.value.set(9, 9),
      s.uB.value.set(9, 9.1),
      (s.uK.value = s.uInk.value ? 1 : 0));
    return;
  }
  const c = Math.cos(-t.rot),
    f = Math.sin(-t.rot),
    h = o.x[l] - t.cx,
    d = o.y[l] - t.cy,
    m = o.x[i] - t.cx,
    u = o.y[i] - t.cy;
  (s.uA.value.set(h * c - d * f, h * f + d * c),
    s.uB.value.set(m * c - u * f, m * f + u * c),
    (s.uK.value = a));
}
function Kr(e) {
  (it.begin(), Dt.begin());
  const t = T.cover;
  (ss(j.glow, ee.p[0], st[t > 0.5 ? 1 : 0], 0, 1),
    ss(E.glow, ee.p[1], st[1], 1, F.cur === "studio" ? Math.max(t, 0.7) : t),
    as(0, 1 - t),
    as(1, t),
    p.hover >= 0 && p.hoverA > 0.01 && $r(p.hover, p.hoverA),
    it.end());
  const o = t > 0.5 ? 1 : 0,
    n = ne[o],
    a = n[0];
  ((ue.entry.i = ue.exit.i = ue.scr.i = ue.tab.i = 0),
    be(B, ee.lamp.x, ee.lamp.y),
    Dt.add(B, 0.26, Yn, 1),
    ue.slit.p.copy(B).addScaledVector(Rn, 0.05),
    (ue.slit.i = 0.7),
    a.n > 1 &&
      a.seg[1] >= 0 &&
      (be(B, a.x[1], a.y[1]),
      Dt.add(B, 0.34, Yn, 1.25),
      ue.entry.p.copy(B).add(Ja.set(-0.1, 0.05, 0.35)),
      (ue.entry.i = 1)));
  {
    let u = 0,
      v = 0,
      y = 0;
    ye.setRGB(0, 0, 0);
    for (let b = 0; b < R; b++) {
      const M = n[b];
      for (let g = 1; g < M.n; g++)
        if (M.seg[g - 1] === 0 && M.seg[g] < 0) {
          ((v += M.x[g]),
            (y += M.y[g]),
            u++,
            (ye.r += Ee[b].r * M.I),
            (ye.g += Ee[b].g * M.I),
            (ye.b += Ee[b].b * M.I));
          break;
        }
    }
    u &&
      (be(B, v / u, y / u),
      Dt.add(B, 0.2, Ue.copy(ye).multiplyScalar(R / u), 1),
      ue.exit.p.copy(B).add(Ja.set(0.15, -0.05, 0.35)),
      ue.exit.c.copy(ye).multiplyScalar(R / u),
      (ue.exit.i = 0.9));
  }
  if (t > 0.2) {
    const u = st[1];
    for (let v = 1; v < u.n; v++)
      u.seg[v - 1] === 1 &&
        u.seg[v] < 0 &&
        (be(B, u.x[v], u.y[v]), Dt.add(B, 0.2, Yn, t));
  }
  {
    let u = 0,
      v = 0;
    ye.setRGB(0, 0, 0);
    for (let y = 0; y < 2; y++) {
      const b = y ? t : 1 - t;
      if (!(b < 0.01))
        for (let M = 0; M < R; M++) {
          const g = ne[y][M];
          g.end === 1 &&
            ((v += g.y[g.n - 1] * b),
            (u += b),
            (ye.r += Ee[M].r * g.I * b),
            (ye.g += Ee[M].g * g.I * b),
            (ye.b += Ee[M].b * g.I * b));
        }
    }
    u > 0.01 &&
      (be(ue.scr.p, S.scrX - 0.5, v / u),
      (ue.scr.p.z += 0.55),
      ue.scr.c.copy(ye).multiplyScalar(1 / Math.max(ye.r, ye.g, ye.b, 0.001)),
      (ue.scr.i = 0.8 * Math.min(1, (u / R) * 1.4)));
  }
  Dt.end();
  const s = Ao && !qr,
    l = Y.position;
  (ce.lamp.userData.set("Light", p.el.toFixed(0) + "\xB0 up", "#ffd9a0"),
    (ce.lamp.userData.want = s ? 1 : 0),
    Po(
      ce.lamp,
      B.set(l.x + _e.g.position.x - 0.35, l.y + _e.g.position.y + 0.62, 0.1),
      20,
    ));
  const i = ee.p[0];
  let c = -9,
    f = 0;
  for (let u = 0; u < 3; u++)
    i.V[u * 2 + 1] > c && ((c = i.V[u * 2 + 1]), (f = i.V[u * 2]));
  (ce.prism.userData.set(
    "N-SF11 prism",
    T.trapped >= R ? "light trapped" : "bends " + T.dev.toFixed(1) + "\xB0",
    "#9fe8ff",
  ),
    (ce.prism.userData.want = s ? 1 : 0),
    Po(ce.prism, B.set(l.x + f, l.y + c + 0.36, 0), 20));
  const h = T.scrSpread * Xt * 10,
    d = t > 0.5 && h < 3;
  (ce.screen.userData.set(
    "Screen",
    T.onScr
      ? d
        ? "white again"
        : h.toFixed(h < 10 ? 1 : 0) + " mm of colour"
      : "dark",
    d ? "#ffffff" : "#ffb454",
  ),
    (ce.screen.userData.want = s ? 1 : 0));
  {
    let u = 9;
    for (let v = 0; v < R; v++) {
      const y = ne[t > 0.5 ? 1 : 0][v];
      y.end === 1 && (u = Math.min(u, y.y[y.n - 1]));
    }
    (u > 8 && (u = S.scrY0 + 1),
      Po(
        ce.screen,
        B.set(
          l.x + S.scrX + 0.55,
          l.y + Math.max(u - 0.42, S.scrY0 + 0.2),
          0.75,
        ),
        20,
      ));
  }
  const m = p.e2 > 0.5;
  if (
    (ce.p2.userData.set(
      "2nd prism",
      m
        ? p.d2 + p.ex * jt > 0.15
          ? "pulled apart"
          : "upside down"
        : "waiting",
      "#b99cff",
    ),
    (ce.p2.userData.want = s && (m || F.cur !== "studio") ? 1 : 0),
    Po(
      ce.p2,
      B.set(
        l.x + Q.x + (m ? 0.55 : 0.78),
        l.y + Q.y + (m ? 0.95 : -0.12),
        Q.z + (m ? 0 : 0.3),
      ),
      20,
    ),
    p.hover >= 0)
  ) {
    const u = p.hover,
      v = ne[t > 0.5 ? 1 : 0][u],
      y = ee.lamp,
      b =
        (((Math.atan2(y.dy, y.dx) - Math.atan2(v.dy, v.dx)) * Ie + 540) % 360) -
        180;
    ce.hover.userData.set(
      Ct[u].toFixed(0) + " nm",
      "n " +
        Fe[u].toFixed(4) +
        (v.tir || v.face !== 0 ? "" : " \xB7 bent " + b.toFixed(1) + "\xB0"),
      "#" + xo[u].clone().convertLinearToSRGB().getHexString(),
    );
  }
  if (
    ((ce.hover.userData.want = p.hover >= 0 ? 1 : 0),
    p.hover >= 0 || ce.hover.userData.a > 0.02)
  ) {
    const u = ne[t > 0.5 ? 1 : 0][Math.max(p.hover, 0)],
      v = u.n - 1,
      y =
        u.end === 0
          ? Math.min(
              1,
              1.6 /
                Math.max(
                  Math.hypot(u.x[v] - u.x[v - 1], u.y[v] - u.y[v - 1]),
                  0.001,
                ),
            )
          : 1;
    (be(
      B,
      u.x[v - 1] + (u.x[v] - u.x[v - 1]) * y,
      u.y[v - 1] + (u.y[v] - u.y[v - 1]) * y,
    ),
      (B.z += 0.2),
      Po(ce.hover, B, 19, 1.4));
  }
}
let qr = !1;
const ft = {
    lab: {
      t: [0, 2.66, 0.45],
      yaw: 0.02,
      pitch: 0.09,
      dist: 10.3,
      f: [-0.3, 3.2, 0],
      r: 6.2,
      fit: [10.7, 6.7],
    },
    exploded: {
      t: [0, 2.2, 0.3],
      yaw: 0,
      pitch: 0.025,
      dist: 9.8,
      f: [0, 2.8, 0],
      r: 4,
      fit: [8.42, 5.25],
    },
    studio: {
      t: [0.45, 1.75, 0],
      yaw: -0.2,
      pitch: 0.035,
      dist: 7.9,
      f: [-0.4, 1.8, 0],
      r: 3.4,
      fit: [6.78, 4.24],
    },
  },
  rs = {
    lab: { t: [0.15, 3.55, 0.3], yaw: 0, pitch: 0.1, dist: 13.2 },
    exploded: { t: [0.3, 2.75, 0], yaw: 0, pitch: 0.05, dist: 12.2 },
    studio: { t: [0.45, 1.95, 0], yaw: -0.1, pitch: 0.05, dist: 11.4 },
  },
  L = { t: new r.Vector3(0, 3, 0), yaw: 0, pitch: 0.2, dist: 15 };
let fn = 4,
  Ne = 1,
  dn = 1,
  Et = !1,
  ke = !1,
  $n = [11, 7],
  is = 15,
  Oe = null,
  se = null;
const we = _.domElement,
  Bt = new Map();
let un = 0,
  to = null,
  ge = null,
  hn = null;
const Fo = new r.Raycaster(),
  ls = new r.Vector2(),
  cs = new r.Plane(new r.Vector3(0, 0, 1), 0),
  jr = new r.Vector3();
function oo(e) {
  const t =
    Et && C.aspect < 0.8 && e === ft[F.cur] ? { ...e, ...rs[F.cur] } : e;
  (L.t.set(...t.t),
    (L.yaw = t.yaw),
    (L.pitch = t.pitch),
    (L.dist = t.dist),
    Ot.set(...t.f),
    (fn = t.r),
    t.fit && (($n = t.fit), (is = t.dist)),
    (Ne = 1),
    (ke = !1),
    aa());
}
const fs = [],
  Qe = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), fs.push(e));
  },
  Lo = (e, t) =>
    e.traverse((o) => {
      o.isMesh && o.material && o.material.visible !== !1 && Qe(o, t);
    });
(Lo(j.pivot, "p1"),
  Lo(_e.g, "lamp"),
  Lo(E.pivot, "p2"),
  Qe(E.col, "p2"),
  Qe(E.blk, "p2"),
  Y.children
    .filter(
      (e) =>
        e.isMesh && e.geometry.type === "ExtrudeGeometry" && e.material === To,
    )
    .forEach((e) => Qe(e, "lamp")),
  Qe(de.board, "screen"),
  Lo(I.dial, "dial"),
  Lo(I.knob2, "knob2"),
  Qe(I.s1.hit, "slider1"),
  I.s1.knob.children.forEach((e) => Qe(e, "slider1")),
  Qe(I.s2.hit, "slider2"),
  I.s2.knob.children.forEach((e) => Qe(e, "slider2")),
  Ua.forEach((e) => Qe(e.hit, "link", { L: e })));
const Qr = (e) => {
  for (let t = e; t; t = t.parent) if (!t.visible) return !1;
  return !0;
};
function Kn(e) {
  const t = we.getBoundingClientRect();
  (ls.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Fo.setFromCamera(ls, C));
}
function qn(e) {
  Kn(e);
  const t = Fo.intersectObjects(
    fs.filter((o) => Qr(o)),
    !1,
  )[0];
  return t
    ? { ...t.object.userData.hk, point: t.point, d: t.distance, obj: t.object }
    : null;
}
function jn(e) {
  if (
    (Kn(e), (cs.constant = -Y.position.z), Math.abs(Fo.ray.direction.z) < 0.12)
  )
    return null;
  const t = Fo.ray.intersectPlane(cs, jr);
  return t ? [t.x - Y.position.x, t.y - Y.position.y] : null;
}
function Zr(e) {
  const t = Q.x - T.fanDX * (p.d2 + p.ex * jt),
    o = Q.y - T.fanDY * (p.d2 + p.ex * jt);
  return (e[0] - t) * T.fanDX + (e[1] - o) * T.fanDY - p.ex * jt;
}
function ds(e) {
  const t = jn(e);
  if (!t) return -1;
  const o = T.cover > 0.5 ? 1 : 0;
  let n = -1,
    a = 0.07;
  for (let s = 0; s < R; s++) {
    const l = ne[o][s];
    for (let i = 1; i < l.n - 1; i++) {
      if (l.seg[i] >= 0) continue;
      const c = l.x[i],
        f = l.y[i],
        h = l.x[i + 1],
        d = l.y[i + 1],
        m = h - c,
        u = d - f,
        v = m * m + u * u || 1,
        y = D(((t[0] - c) * m + (t[1] - f) * u) / v, 0, 1),
        b = Math.hypot(c + m * y - t[0], f + u * y - t[1]);
      b < a && ((a = b), (n = s));
    }
  }
  return n;
}
function us(e) {
  if (!e || e.kind !== "screen") {
    p.hover = -1;
    return;
  }
  const t = e.point.y - Y.position.y,
    o = T.cover > 0.5 ? 1 : 0;
  let n = -1,
    a = 0.09;
  for (let s = 0; s < R; s++) {
    const l = ne[o][s];
    if (l.end !== 1) continue;
    const i = Math.abs(l.y[l.n - 1] - t);
    i < a && ((a = i), (n = s));
  }
  p.hover = n;
}
function Jr(e, t) {
  const o = jn(t);
  if (
    ((Oe = e.kind),
    (se = {
      r1: p.r1T,
      el: p.elT,
      d2: p.d2T,
      x: t.clientX,
      y: t.clientY,
      q: o,
    }),
    e.kind === "p1" && o && (se.a = Math.atan2(o[1] - S.p1[1], o[0] - S.p1[0])),
    e.kind === "dial")
  ) {
    const n = new r.Vector3();
    I.dial.getWorldPosition(n).project(C);
    const a = we.getBoundingClientRect();
    ((se.cx = ((n.x + 1) / 2) * a.width + a.left),
      (se.cy = ((1 - n.y) / 2) * a.height + a.top),
      (se.a = Math.atan2(t.clientY - se.cy, t.clientX - se.cx)));
  }
  (e.kind === "slider1" || e.kind === "slider2") && hs(e.kind, t);
}
function hs(e, t) {
  Kn(t);
  const o = e === "slider1" ? I.s1 : I.s2,
    n = o.fromRay(Fo);
  n != null &&
    (e === "slider1"
      ? lt(Ge(Ve[0], Ve[1], n))
      : n < 0.08
        ? p.e2T && Lt(!1)
        : (p.e2T || Lt(!0), Ro((1 - D((n - 0.12) / 0.88, 0, 1)) * Nn)));
}
function ei(e) {
  const t = Oe;
  if (t === "slider1" || t === "slider2") {
    hs(t, e);
    return;
  }
  if (t === "dial") {
    const n = Math.atan2(e.clientY - se.cy, e.clientX - se.cx);
    let a = n - se.a;
    ((a = Math.atan2(Math.sin(a), Math.cos(a))),
      (se.a = n),
      bt(p.elT + (a * (ze[1] - ze[0])) / 4.2));
    return;
  }
  const o = jn(e);
  if (!o) {
    t === "p1" && lt(se.r1 - (e.clientX - se.x) * 0.15);
    return;
  }
  if (t === "p1") {
    if (se.a == null) {
      se.a = Math.atan2(o[1] - S.p1[1], o[0] - S.p1[0]);
      return;
    }
    let a = Math.atan2(o[1] - S.p1[1], o[0] - S.p1[0]) - se.a;
    ((a = Math.atan2(Math.sin(a), Math.cos(a))), lt(se.r1 + a * Ie));
  } else if (t === "lamp") {
    const n = Math.atan2(S.A[1] - o[1], S.A[0] - o[0]) * Ie;
    n > 0 && n < 90 && bt(n);
  } else t === "p2" && p.e2T > 0.5 && Ro(Zr(o));
}
const Qn = [32, 42, 55];
function ti(e) {
  if (e)
    switch (e.kind) {
      case "p2":
      case "knob2":
        (Lt(p.e2T < 0.5),
          Ze(p.e2T > 0.5 ? "Second prism: in" : "Second prism: waiting"));
        break;
      case "dial": {
        const t = (Qn.findIndex((o) => o > p.elT + 0.5) + 3) % 3;
        (bt(Qn[t]), Ze("Light " + Qn[t] + "\xB0 up"));
        break;
      }
      case "screen":
        (us(e),
          p.hover >= 0 &&
            Ze(
              Ct[p.hover].toFixed(0) + " nm \xB7 n = " + Fe[p.hover].toFixed(4),
            ));
        break;
      case "link":
        window.open(Us, "_blank", "noopener");
        break;
    }
}
function Zn(e, t) {
  const o =
      (C.position.distanceTo(L.t) *
        2 *
        Math.tan(r.MathUtils.degToRad(C.fov / 2))) /
      Math.max(Mt.clientHeight, 1),
    n = Math.cos(L.yaw),
    a = Math.sin(L.yaw);
  ((ke = !0),
    (L.t.x = D(L.t.x - n * e * o, -8, 8)),
    (L.t.z = D(L.t.z + a * e * o, -4, 6)),
    (L.t.y = D(L.t.y + t * o, 0.5, 8)));
}
const ps = {
    p1: () => "Drag to turn the prism",
    lamp: () => "Drag to tilt the light",
    p2: () =>
      p.e2T > 0.5
        ? "Drag along the beam \xB7 click to take it out"
        : "Click to bring the second prism in",
    dial: () => "Turn to tilt the light \xB7 click for 32\xB0 42\xB0 55\xB0",
    knob2: () =>
      p.e2T > 0.5 ? "Take the second prism out" : "Bring the second prism in",
    slider1: () => "Drag to turn the prism",
    slider2: () => "Slide the second prism in and close",
    screen: () =>
      p.hover >= 0
        ? Ct[p.hover].toFixed(0) +
          " nm lands here \xB7 n = " +
          Fe[p.hover].toFixed(4)
        : "",
    link: () => "@RYANSAEL on X",
  },
  Vt = A("#tip");
let _o = null;
const oi = matchMedia("(hover:hover)").matches;
function ni(e) {
  const t = qn(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== _o && (_o?.over(!1), o?.over(!0), (_o = o)),
    us(t),
    !t && oi && (p.hover = ds(e)),
    (we.style.cursor = t
      ? t.kind === "slider1" || t.kind === "slider2"
        ? "ew-resize"
        : t.kind === "screen"
          ? p.hover >= 0
            ? "crosshair"
            : ""
          : t.kind === "p1" || t.kind === "lamp" || t.kind === "dial"
            ? "grab"
            : "pointer"
      : p.hover >= 0
        ? "crosshair"
        : ""));
  const n = t && ps[t.kind] ? ps[t.kind](t) : "";
  n
    ? ((Vt.textContent = n),
      (Vt.style.left = e.clientX + "px"),
      (Vt.style.top = e.clientY + "px"),
      Vt.classList.add("on"))
    : Vt.classList.remove("on");
}
(we.addEventListener("contextmenu", (e) => e.preventDefault()),
  we.addEventListener("pointerleave", () => {
    (_o?.over(!1),
      (_o = null),
      Vt.classList.remove("on"),
      (we.style.cursor = ""),
      Oe || (p.hover = -1));
  }));
const ai = new Set(["p1", "lamp", "p2", "dial", "slider1", "slider2"]);
(we.addEventListener("pointerdown", (e) => {
  Me();
  try {
    we.setPointerCapture(e.pointerId);
  } catch {}
  (Vt.classList.remove("on"),
    Bt.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
    (to = null));
  const t = e.button === 0 && !e.shiftKey && Bt.size === 1 ? qn(e) : null;
  ((hn = t),
    (ge =
      e.button === 0 && !e.shiftKey
        ? [e.clientX, e.clientY, performance.now()]
        : null),
    t &&
      ai.has(t.kind) &&
      !(t.kind === "p2" && p.e2T < 0.5) &&
      (Jr(t, e),
      (we.style.cursor = t.kind.startsWith("slider")
        ? "ew-resize"
        : "grabbing")));
}),
  we.addEventListener("pointermove", (e) => {
    const t = Bt.get(e.pointerId);
    if (!t) {
      ni(e);
      return;
    }
    const o = e.clientX - t[0],
      n = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), Oe)) {
      (ge &&
        Math.hypot(e.clientX - ge[0], e.clientY - ge[1]) > 5 &&
        (ge = null),
        ei(e));
      return;
    }
    if (
      (ge &&
        Math.hypot(e.clientX - ge[0], e.clientY - ge[1]) > 6 &&
        (ge = null),
      !ge)
    ) {
      if (((ke = !0), Bt.size === 2)) {
        const [a, s] = [...Bt.values()],
          l = Math.hypot(a[0] - s[0], a[1] - s[1]),
          i = [(a[0] + s[0]) / 2, (a[1] + s[1]) / 2];
        (un && (Ne = D((Ne * un) / l, 0.35, 2.2)),
          (un = l),
          to && Zn(i[0] - to[0], i[1] - to[1]),
          (to = i));
        return;
      }
      t[2]
        ? Zn(o, n)
        : ((L.yaw -= o * 0.004),
          (L.pitch = D(L.pitch + n * 0.003, -0.05, 1.3)));
    }
  }));
const ms = (e) => {
  (ge &&
    Bt.size === 1 &&
    performance.now() - ge[2] < 450 &&
    (hn
      ? ti(hn)
      : ((p.hover = ds(e)),
        p.hover >= 0 &&
          Ze(
            Ct[p.hover].toFixed(0) + " nm \xB7 n = " + Fe[p.hover].toFixed(4),
          ))),
    (ge = null),
    (hn = null),
    (Oe = null),
    (se = null),
    Bt.delete(e.pointerId),
    (un = 0),
    (to = null));
};
(we.addEventListener("pointerup", ms),
  we.addEventListener("pointercancel", (e) => {
    ((ge = null), ms(e));
  }),
  we.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        Me(),
        (ke = !0),
        (Ne = D(
          Ne * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.35,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const no = new Set();
(addEventListener("keyup", (e) => no.delete(e.key.toLowerCase())),
  addEventListener("blur", () => no.clear()));
const si = new r.Vector3();
function ri() {
  if (!no.size) return;
  const e = (no.has("shift") ? 2.4 : 1) * Qt,
    t = (...a) => a.some((s) => no.has(s));
  let o = 0,
    n = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (n += 1),
    t("s", "arrowdown") && (n -= 1),
    (o || n) &&
      (Zn(o * e * 420, 0),
      L.t.addScaledVector(
        si.set(-Math.sin(L.yaw), 0, -Math.cos(L.yaw)),
        n * e * 5,
      ),
      (L.t.z = D(L.t.z, -4, 6)),
      (L.t.x = D(L.t.x, -8, 8))),
    t("q") && (L.yaw += e * 1.1),
    t("e") && (L.yaw -= e * 1.1),
    t("=", "+") && (Ne = D(Ne * Math.exp(-e * 1.3), 0.35, 2.2)),
    t("-", "_") && (Ne = D(Ne * Math.exp(e * 1.3), 0.35, 2.2)),
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
    ) && (ke = !0));
}
let wt = !0,
  ao = -99,
  pn = -1,
  te = null,
  dt = 0;
const We = (e) => () => lt(e),
  ut = (e) => () => bt(e),
  so = (e) => () => Lt(e),
  Go = (e) => () => Ro(e),
  mn = (e) => () => {
    p.hover = e;
  },
  vs = () => lt(p.elT + 30 - wo(Te)),
  Jn = [
    {
      view: "lab",
      ...ft.lab,
      dy: 0.004,
      hold: 11,
      wide: 1,
      beats: [
        [0, We(0)],
        [0, ut(42)],
        [0, so(!1)],
        [2.6, vs],
        [5.4, We(17.5)],
        [8.4, We(0)],
      ],
    },
    {
      view: "lab",
      t: [-1.3, 3.35, 0.2],
      yaw: 0.14,
      pitch: 0.12,
      dist: 7.4,
      dy: -0.01,
      f: [-1.2, 3.4, 0],
      r: 1.9,
      hold: 9,
      beats: [
        [0, We(0)],
        [0.8, ut(56)],
        [3.6, ut(31)],
        [6.6, ut(42)],
      ],
    },
    {
      view: "lab",
      t: [0.35, 3.7, 0.4],
      yaw: -0.12,
      pitch: 0.1,
      dist: 9.6,
      dy: 0.008,
      f: [0.2, 3.6, 0],
      r: 2.6,
      hold: 10,
      beats: [
        [0, ut(42)],
        [0, We(0)],
        [0.6, so(!0)],
        [4.6, Go(0.95)],
        [7.2, Go(0)],
      ],
    },
    {
      view: "exploded",
      ...ft.exploded,
      dy: 0.006,
      hold: 9,
      wide: 1,
      beats: [
        [0, We(0)],
        [0, ut(42)],
        [4.5, Go(0.7)],
        [7, Go(0)],
      ],
    },
    {
      view: "studio",
      ...ft.studio,
      dy: -0.008,
      hold: 9,
      wide: 1,
      beats: [
        [0, so(!1)],
        [0, Go(0)],
        [0, ut(42)],
        [0.1, We(0)],
        [3, vs],
        [6, We(0)],
      ],
    },
    {
      view: "lab",
      t: [1.6, 3.05, 0.6],
      yaw: -0.42,
      pitch: 0.08,
      dist: 6.4,
      dy: 0.01,
      f: [1.9, 2.9, 0],
      r: 1.6,
      hold: 8,
      beats: [
        [0, so(!1)],
        [0, We(0)],
        [1, mn(3)],
        [3.2, mn(12)],
        [5.4, mn(21)],
        [7.4, mn(-1)],
      ],
    },
    {
      view: "lab",
      t: [0, 1.15, 1.6],
      yaw: 0.02,
      pitch: 0.16,
      dist: 7.2,
      dy: 0.006,
      f: [0, 1.05, 2.15],
      r: 1.4,
      hold: 8.6,
      beats: [
        [0.5, ut(52)],
        [2.4, We(10)],
        [4.2, so(!0)],
        [6.2, so(!1)],
        [6.4, We(0)],
        [6.4, ut(42)],
      ],
    },
  ];
let xs = null;
function ys(e, t) {
  ((pn = e), (te = Jn[e]), (dt = 0), (p.hover = -1));
  const o = Et && C.aspect < 0.8 && te.wide ? { ...te, ...rs[te.view] } : te;
  if (((xs = o), te.view && te.view !== (F.next || F.cur))) {
    for (; dt < te.beats.length && te.beats[dt][0] <= 0;)
      (te.beats[dt][1](), dt++);
    (Jt(te.view, !1, o), (ao = t + 0.2));
  } else (oo(o), (ao = t));
}
function ii(e) {
  (e < ao - 1 && (ao = e),
    (!te || e - ao > te.hold) && ys((pn + 1) % Jn.length, e));
  const t = e - ao;
  if (t < 0) return;
  for (; dt < te.beats.length && t >= te.beats[dt][0];)
    (te.beats[dt][1](), dt++);
  if (ke) return;
  const o = xs || te;
  ((L.yaw = o.yaw + t * o.dy),
    (L.dist = o.dist * (1 - t * 0.008)),
    Ot.set(...o.f),
    (fn = o.r));
}
function ro(e) {
  ((wt = e),
    A("#cine").classList.toggle("on", e),
    A("#cine").setAttribute("aria-pressed", e),
    e ? ((te = null), (pn = -1), (ke = !1), (Ne = 1)) : (p.hover = -1));
}
let io = null;
const Me = () => {
  ((io = null), wt && ro(!1));
};
function ea() {
  (ro(!1), oo(ft[F.cur]));
}
const lo = new r.Vector3();
let ta = 0;
const li = {
  lab: [-12, 10.4, 0.45, 11, -6.6, 40],
  exploded: [-40, 40, 0.3, 30, -40, 40],
  studio: [-20, 20, 0.3, 20, -4.6, 40],
};
function ci(e) {
  const t = ke ? 0 : Math.sin(e / 8) * 0.025,
    o = wt ? te?.wide : io ? io.wide : !0,
    n = L.dist * Ne * (o ? dn : Ge(1, dn, 0.5)),
    a = L.yaw + t,
    s = Math.asin(D((0.45 - L.t.y) / Math.max(n, 0.1), -1, 1)),
    l = Math.max(L.pitch, s),
    i = Math.cos(l),
    c = !ke && !wt && !io && F.cur === "lab" && !Et ? Oo(0, 1, p.e2) * 0.8 : 0;
  (Oe || (ta += (c - ta) * (1 - Math.exp(-Qt * 3))),
    lo.copy(L.t),
    (lo.y += ta),
    C.position.set(
      lo.x + Math.sin(a) * i * n,
      lo.y + Math.sin(l) * n,
      lo.z + Math.cos(a) * i * n,
    ));
  const f = li[F.cur];
  if (
    (C.position.set(
      D(C.position.x, f[0], f[1]),
      D(C.position.y, f[2], f[3]),
      D(C.position.z, f[4], f[5]),
    ),
    C.lookAt(lo),
    !wt && !ke)
  ) {
    const u = io || ft[F.cur];
    (Ot.set(...u.f), (fn = u.r));
  }
  const h = C.position.distanceTo(ke ? L.t : Ot),
    d = ke ? Math.min(1, Qt * 5) : 1,
    m = (ke ? Math.max(2.2, h * 0.28) : fn) * x.focalBand;
  ((Re.u.focus.value += (h - Re.u.focus.value) * d),
    (Re.u.range.value += (m - Re.u.range.value) * d),
    Re.u.cocScale.value.set(x.apertureNear, x.aperture * (Gt[F.cur].far || 1)));
}
const bs = [...document.querySelectorAll("#seg-p button")],
  oa = [...document.querySelectorAll("#seg-view button")],
  ws = [...document.querySelectorAll("#seg-2 button")];
(bs.forEach(
  (e) =>
    (e.onclick = () => {
      (Me(), Wn(+e.dataset.p));
    }),
),
  oa.forEach(
    (e) =>
      (e.onclick = () => {
        (Me(), Jt(e.dataset.v));
      }),
  ),
  ws.forEach(
    (e) =>
      (e.onclick = () => {
        (Me(), Lt(e.dataset.t === "1"));
      }),
  ));
function gs(e, t, o, n) {
  const a = A(e);
  let s = !1;
  const l = (i) => {
    const c = a.getBoundingClientRect();
    n(Ge(t[0], t[1], D((i.clientX - c.left) / c.width, 0, 1)));
  };
  (a.addEventListener("pointerdown", (i) => {
    (Me(), (s = !0), (Oe = "card"), a.setPointerCapture(i.pointerId), l(i));
  }),
    a.addEventListener("pointermove", (i) => {
      s && l(i);
    }),
    a.addEventListener("pointerup", () => {
      ((s = !1), (Oe = null));
    }),
    a.addEventListener("pointercancel", () => {
      ((s = !1), (Oe = null));
    }),
    a.addEventListener("keydown", (i) => {
      (i.key === "ArrowLeft" || i.key === "ArrowRight") &&
        (i.preventDefault(),
        i.stopPropagation(),
        Me(),
        n(o() + (i.key === "ArrowLeft" ? -1 : 1)));
    }));
}
(gs("#slide", Ve, () => p.r1T, lt), gs("#slide2", ze, () => p.elT, bt));
let Ms = 0;
const co = (e) => e.toFixed(1),
  fi = (e) => e.toFixed(0),
  Ss = (e) => (Math.abs(e) < 0.05 ? "0.0" : e.toFixed(1)) + "\xB0";
function di() {
  const e = T.cover,
    t = T.th1;
  if (e > 0.5) {
    const i = p.d2 + p.ex * jt,
      c = T.scrSpread * Xt * 10;
    return i > 0.15
      ? `Pulled <b>${(i * Xt).toFixed(1)} cm</b> down the beam, the second prism gets the colours after they have drifted apart: they leave parallel again but side by side, <b>${c.toFixed(1)} mm</b> of coloured fringe on the screen.`
      : `The upside-down prism bends each colour back by exactly what the first one did, so they leave <b>parallel</b> (${T.spreadTot.toFixed(2)}\xB0 apart) and land on top of each other: <span class="c">white again</span>. This is Newton's own experiment.`;
  }
  if (!isFinite(t))
    return "The light misses the glass: tilt it back towards the prism.";
  if (st[e > 0.5 ? 1 : 0].face !== 0)
    return "Turned this far, the prism's front face is edge-on to the beam: the light slips in through the <b>base</b> instead and never reaches the screen as a fan. Turn the prism back.";
  if (T.trapped >= R)
    return `At <b>${co(t)}\xB0</b> the light meets the second face too steeply to get out, for every colour: <span class="r">total internal reflection</span> sends it all back into the glass.`;
  const o = Fe[0],
    n = Fe[R - 1],
    a = bo(t, o),
    s = bo(t, n);
  if (T.trapped > 0) {
    const i = Ct[T.trapped - 1],
      c =
        i < 450
          ? "violet"
          : i < 495
            ? "violet and blue"
            : i < 575
              ? "violet, blue and green"
              : "everything but the reds";
    return `At <b>${co(t)}\xB0</b> the second face is too steep for ${c}: everything below <span class="v">${fi(i)} nm</span> is trapped inside by <span class="r">total internal reflection</span> and leaves through the base. Turn the prism back to let it out.`;
  }
  const l = Math.abs(p.r1 - T.rMin) < 1.2;
  return (
    `N-SF11 slows violet more than red (n = <span class="v">${o.toFixed(3)}</span> at 400 nm, <span class="r">${n.toFixed(3)}</span> at 700 nm), so at <b>${co(t)}\xB0</b> violet turns <span class="v">${co(a)}\xB0</span> and red only <span class="r">${co(s)}\xB0</span>: the colours fan out <b>${co(T.spread)}\xB0</b>.` +
    (l
      ? ' This is the least the prism can bend the light: <span class="c">minimum deviation</span>, the beam crossing the glass parallel to its base.'
      : "")
  );
}
function Io(e) {
  if (!e && le - Ms < 0.1) return;
  ((Ms = le),
    (A("#s-a").textContent = isFinite(T.th1) ? Ss(T.th1) : "\u2014"),
    (A("#s-b").textContent = Ss(T.devTot)),
    (A("#s-c").textContent =
      T.spreadTot.toFixed(T.spreadTot < 1 ? 2 : 1) + "\xB0"));
  const t = ((p.r1T - Ve[0]) / (Ve[1] - Ve[0])) * 100,
    o = ((p.elT - ze[0]) / (ze[1] - ze[0])) * 100;
  ((A("#slide-kn").style.left = t + "%"),
    (A("#slide-fl").style.width = t + "%"),
    (A("#slide-v").textContent =
      (p.r1T > 0 ? "+" : "") + p.r1T.toFixed(1) + "\xB0"),
    A("#slide").setAttribute("aria-valuenow", p.r1T.toFixed(1)),
    (A("#slide2-kn").style.left = o + "%"),
    (A("#slide2-fl").style.width = o + "%"),
    (A("#slide2-v").textContent = p.elT.toFixed(0) + "\xB0"),
    A("#slide2").setAttribute("aria-valuenow", p.elT.toFixed(0)));
  const n = Qa.findIndex(
    (s) =>
      Math.abs((s.r1 === "min" ? s.el + 30 - wo(Te) : s.r1) - p.r1T) < 0.3 &&
      Math.abs(s.el - p.elT) < 0.3 &&
      !!s.e2 == p.e2T > 0.5 &&
      p.d2T < 0.05,
  );
  (bs.forEach((s, l) => s.classList.toggle("on", l === n)),
    ws.forEach((s) =>
      s.classList.toggle("on", (s.dataset.t === "1") == p.e2T > 0.5),
    ));
  const a = di();
  a !== Io.w && ((A("#why").innerHTML = a), (Io.w = a));
}
const ht = [
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
  ["glow", "Beam glow", 0, 2, 0.05, (e) => e.toFixed(2) + "\xD7"],
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
let He = 0,
  Ts = 0,
  na = 0,
  vn = 0,
  xn = 0;
function Ce() {
  (_.setPixelRatio(x.pixelRatio),
    De.setPixelRatio(x.pixelRatio),
    po.rt.samples !== x.msaa && ((po.rt.samples = x.msaa), po.rt.dispose()),
    (Ma.enabled = !!x.smaa),
    oe.shadow.mapSize.x !== x.shadow &&
      (oe.shadow.mapSize.set(x.shadow, x.shadow),
      oe.shadow.map?.dispose(),
      (oe.shadow.map = null)),
    (nt.enabled = !!x.bloom),
    (nt.radius = x.bloomRadius),
    ($.enabled = !0),
    $.updateGtaoMaterial({
      radius: x.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: x.ao ? x.aoSamples : 2,
    }),
    (Re.enabled = !!x.dof),
    (Re.u.maxCoc.value = x.maxCoc),
    ln(),
    As());
}
function pt() {
  ((A("#tune-rows").innerHTML = ht
    .map(([e, t, o, n, , a, s], l) => {
      const i = x[e],
        c = ((i - o) / (n - o)) * 100;
      return `<div class="tr${l === He ? " sel" : ""}${s ? " sub" : ""}" data-i="${l}"><b>${t}</b><span class="tk"><i style="left:${D(c, 0, 100)}%"></i></span><u>${a(i)}</u></div>`;
    })
    .join("")),
    A("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((He = +e.dataset.i), pt());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (He = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const n = (a) => {
            const s = t.getBoundingClientRect(),
              [l, , i, c, f] = ht[He],
              h = D(
                Math.round(
                  (i + ((a.clientX - s.left) / s.width) * (c - i)) / f,
                ) * f,
                i,
                c,
              );
            h !== x[l] &&
              ((x[l] = +h.toFixed(4)), l !== "auto" && (x.auto = 0), Ce());
            const d = t.querySelector("i");
            ((d.style.left = D(((x[l] - i) / (c - i)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = ht[He][5](x[l])),
              (A("#tune-json").value = JSON.stringify(x)));
          };
          (n(o),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && n(a);
            }),
            (t.onpointerup = () => pt()));
        };
      }),
    (A("#tune-json").value = JSON.stringify(x)));
}
function ui(e, t) {
  const [o, , n, a, s] = ht[He],
    l = D(+(x[o] + e * s * (t ? 5 : 1)).toFixed(4), n, a);
  l !== x[o] && ((x[o] = l), o !== "auto" && (x.auto = 0), Ce(), pt());
}
function ks(e) {
  const t = A("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && pt());
}
function hi(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (He = (He + (t === "ArrowUp" ? -1 : 1) + ht.length) % ht.length),
      pt(),
      A("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (ui(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , n, a, s] = ht[He];
    return a - n === s
      ? ((x[o] = x[o] ? 0 : 1), o !== "auto" && (x.auto = 0), Ce(), pt(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(x, An) : (x[ht[He][0]] = An[ht[He][0]]),
      (x.auto = 0),
      Ce(),
      pt(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(x, null, 1)), !0)
      : t === "Escape"
        ? (ks(!1), !0)
        : !1;
}
A("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in An) typeof t[o] == "number" && (x[o] = t[o]);
    ((x.auto = 0), Ce(), pt());
  } catch {
    pt();
  }
});
const yn = A("#ui-hint");
let Cs = -9;
function Ze(e) {
  ((yn.textContent = e), yn.classList.add("on"), (Cs = le));
}
const Ps = ["lab", "exploded", "studio"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), ks());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    A("#info").open
  )
    return;
  if (!A("#tune").hidden && hi(e)) {
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
    if (e.target.id === "slide" || e.target.id === "slide2") return;
    (t.startsWith("arrow") && e.preventDefault(),
      t !== "shift" && Me(),
      no.add(t));
    return;
  }
  if (t >= "1" && t <= "4") (Me(), Wn(+t - 1));
  else if (t === "[" || t === "]") (Me(), lt(p.r1T + (t === "[" ? -1.5 : 1.5)));
  else if (t === "," || t === ".") (Me(), bt(p.elT + (t === "," ? -2 : 2)));
  else if (t === "p")
    (Me(),
      Lt(p.e2T < 0.5),
      Ze(p.e2T > 0.5 ? "Second prism: in" : "Second prism: waiting"));
  else if (t === "v") {
    Me();
    const o = Ps[(Ps.indexOf(F.next || F.cur) + 1) % 3];
    (Jt(o), Ze(o[0].toUpperCase() + o.slice(1)));
  } else
    t === "x"
      ? (Me(), Jt((F.next || F.cur) === "exploded" ? "lab" : "exploded"))
      : t === "c"
        ? A("#cine").click()
        : t === "r"
          ? ea()
          : t === "n"
            ? ((Ao = !Ao), Ze(Ao ? "Labels on" : "Labels off"))
            : t === "/" &&
              (e.preventDefault(),
              gn.classList.toggle("ui-off"),
              Ze(
                gn.classList.contains("ui-off")
                  ? "Interface hidden \xB7 / to show"
                  : "Interface shown",
              ));
}),
  (A("#cine").onclick = () => {
    wt ? ea() : ro(!0);
  }),
  we.addEventListener("dblclick", (e) => {
    qn(e) || ea();
  }),
  (A("#how").onclick = () => A("#info").showModal()),
  (A("#close").onclick = () => A("#info").close()),
  A("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    A("#tune").hidden || (A("#tune-fps").textContent = Math.round(Ts) + " fps");
  }, 500),
  (A("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e), Ze("Link copied"));
    } catch {}
  }));
function aa() {
  const e = Mt.clientWidth,
    t = Mt.clientHeight;
  Et = e < 900;
  const o = x.fov + (Gt[F.cur].fov || 0) + (Et ? 8 : 0);
  (C.fov !== o && ((C.fov = o), C.updateProjectionMatrix()),
    C.setViewOffset(
      e,
      t,
      Et ? 0 : -e * 0.035,
      Et ? t * 0.1 : -t * 0.015,
      e,
      t,
    ));
  const n = 2 * Math.tan(r.MathUtils.degToRad(C.fov / 2));
  dn =
    C.aspect < 0.8
      ? D(0.62 / Math.max(C.aspect, 0.4), 1, 1.5)
      : D(Math.max($n[0] / (n * C.aspect), $n[1] / n) / is, 0.85, 2.2);
}
function As() {
  const e = Mt.clientWidth,
    t = Mt.clientHeight;
  ((C.aspect = e / t),
    C.updateProjectionMatrix(),
    _.setSize(e, t),
    De.setSize(e, t));
  const o = _.getDrawingBufferSize(new r.Vector2());
  (kn.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    Yt.uRes.value.copy(o),
    aa(),
    C.updateProjectionMatrix());
}
addEventListener("resize", As);
let Ds = performance.now(),
  sa = 0,
  ra = 0,
  Rs = 0;
function ia(e) {
  ((On = D((e - Ds) / 1e3, 0, 1.5)), (Qt = Math.min(0.1, On)), (Ds = e));
  const t = e / 1e3;
  if (
    ((le = t),
    wt && ii(t),
    ri(),
    Wr(Qt),
    Xr(),
    ci(t),
    C.updateMatrixWorld(),
    Yr(),
    (_.shadowMap.needsUpdate = !0),
    Kr(t),
    Io(),
    yn.classList.contains("on") && le - Cs > 1.5 && yn.classList.remove("on"),
    (sa += On),
    ra++,
    e - Rs > 1600)
  ) {
    const o = ra / Math.max(sa, 0.001);
    ((sa = 0),
      (ra = 0),
      (Rs = e),
      (Ts = o),
      vn++,
      vn > 2 && (na = Math.max(na, o)),
      (xn = vn > 3 && o < na * 0.74 ? xn + 1 : 0),
      x._ceil === void 0 &&
        ((x._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (x._good = 0),
        (x._probe = 0)),
      !document.hidden &&
        x.auto &&
        vn > 3 &&
        (x._probe && o < 55
          ? ((x._probe = 0),
            (x._good = 0),
            (x._ceil = Math.max(1, +(x.pixelRatio - 0.25).toFixed(2))),
            (x.pixelRatio = x._ceil),
            Ce())
          : ((x._probe = 0),
            (x._good = o >= 58 ? Math.min(9, x._good + 1) : 0),
            x._good >= 3 &&
              x.pixelRatio < x._ceil &&
              ((x._good = 0),
              (x._probe = 1),
              (x.pixelRatio = Math.min(
                x._ceil,
                +(x.pixelRatio + 0.25).toFixed(2),
              )),
              Ce()))),
      !document.hidden &&
        x.auto &&
        xn >= 2 &&
        o < 50 &&
        ((xn = 0),
        x.pixelRatio > 1
          ? ((x.pixelRatio = x._ceil =
              Math.max(1, +(x.pixelRatio - 0.25).toFixed(2))),
            Ce())
          : x.reflect
            ? ((x.reflect = 0), Ce())
            : x.msaa > 0
              ? ((x.msaa = 0), Ce())
              : x.ao && ((x.ao = 0), Ce())));
  }
  (Ks(), _.info.reset(), De.render());
}
let Fs = !0;
function Ls(e) {
  (requestAnimationFrame(Ls), Fs && ia(e));
}
((A("#dlg-nv").textContent = Fe[0].toFixed(3)),
  (A("#dlg-nr").textContent = Fe[R - 1].toFixed(3)),
  (A("#dlg-nl").textContent = R),
  Ce(),
  Jt("lab", !0),
  ro(!0),
  Hn(),
  Io(!0));
{
  const e = {};
  for (const t in _t) ((e[t] = _t[t].visible), (_t[t].visible = !0));
  Ft.visible = j.stand.visible = !0;
  try {
    _.compile(J, C);
  } catch {}
  for (const t in _t) _t[t].visible = e[t];
  ln();
}
(A("#loading").remove(),
  requestAnimationFrame(Ls),
  (window.__step = (e) => ia(e)),
  (window.__loop = (e) => {
    Fs = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = _.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = e),
      (n.height = Math.round((e * o.height) / o.width)),
      n.getContext("2d").drawImage(o, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    ia(o ?? performance.now());
    const n = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + fa + "/_shots/" + e + ".webp",
        { method: "POST", body: n },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (ro(!1),
        e && (e = { f: e.t, r: 3, ...e }),
        (io = e),
        e && oo({ fit: null, ...e }));
    },
    view: (e, t = !0) => Jt(e, t),
    cut: (e) => {
      (ro(!0), ys(e, le));
    },
    prism: (e) => {
      (lt(e), (p.r1 = p.r1T));
    },
    light: (e) => {
      (bt(e), (p.el = p.elT));
    },
    second: (e) => {
      ((p.e2T = p.e2 = e ? 1 : 0), e || (p.d2T = p.d2 = 0));
    },
    slide: (e) => {
      (Ro(e), (p.d2 = p.d2T));
    },
    hover: (e) => {
      ((p.hover = e), (p.hoverA = e >= 0 ? 1 : 0));
    },
    preset: (e) => {
      (Wn(e), (p.r1 = p.r1T), (p.el = p.elT), (p.e2 = p.e2T), (p.d2 = p.d2T));
    },
    explode: (e) => {
      p.exT = p.ex = e ? 1 : 0;
    },
    tags: (e) => {
      Ao = !!e;
    },
    tune: (e) => (Object.assign(x, e), Ce(), { ...x }),
    ST: p,
    MS: T,
    VIEW: F,
    VIEWS: Gt,
    HERO: ft,
    SHOTS: Jn,
    LG: It,
    LAY: S,
    RAYS: ne,
    nOf: Ke,
    devOf: bo,
    trace: Pt,
    model: Hn,
  }),
  (window.__x = {
    dof: Re,
    gtao: $,
    bloom: nt,
    renderer: _,
    camera: C,
    scene: J,
    composer: De,
    cam: L,
    RT: x,
    overlay: Ht,
    rays: it,
    P1: j,
    P2: E,
    LAMP: _e,
    SCREEN: de,
    UI: I,
    OPT: ee,
    benchG: Y,
    GLOW_U: mo,
    SCRU: Kt,
  }),
  (window.__dbg = () => ({
    t: +le.toFixed(2),
    view: F.cur,
    shot: pn,
    cine: wt,
    r1: +p.r1.toFixed(2),
    el: +p.el.toFixed(2),
    e2: +p.e2.toFixed(2),
    d2: +p.d2.toFixed(2),
    th1: +(T.th1 || 0).toFixed(2),
    dev: +T.devTot.toFixed(2),
    spread: +T.spreadTot.toFixed(3),
    scr: +(T.scrSpread * Xt * 10).toFixed(2),
    trapped: T.trapped,
    cover: +T.cover.toFixed(2),
    fit: +dn.toFixed(3),
    focus: +Re.u.focus.value.toFixed(2),
    range: +Re.u.range.value.toFixed(2),
    calls: _.info.render.calls,
    tris: _.info.render.triangles,
  })));
