import * as r from "three";
import { EffectComposer as ei } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as yn,
  FullScreenQuad as Ba,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as Ss } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as ti } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as oi } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as ai } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as ni } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as wn } from "three/addons/utils/BufferGeometryUtils.js";
const E = (e) => document.querySelector(e),
  Lt = E("#world"),
  Ha = E("#app"),
  W = (e, t, o) => (e < t ? t : e > o ? o : e),
  te = (e, t, o) => e + (t - e) * o,
  Zt = (e, t, o) => {
    const a = W((o - e) / (t - e), 0, 1);
    return a * a * (3 - 2 * a);
  },
  dc = (e) => 1 - (1 - e) ** 3,
  fc = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function xt(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const uc = xt(7),
  Et = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  si = "https://x.com/ryansael",
  Ro = "mearim-flood",
  ke = new r.Scene();
((ke.background = new r.Color("#10151f")),
  (ke.fog = new r.FogExp2("#1a2130", 0.0065)));
const I = new r.PerspectiveCamera(30, 1, 0.3, 320);
let Y;
try {
  Y = new r.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (E("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const ri = 25e5,
  ii = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return W(Math.min(devicePixelRatio, 2, Math.sqrt(ri / (e * t))), 0.75, 2);
  },
  Ia = ii();
(Y.setPixelRatio(Ia),
  (Y.info.autoReset = !1),
  (Y.shadowMap.enabled = !0),
  (Y.shadowMap.type = r.PCFShadowMap),
  (Y.shadowMap.autoUpdate = !1),
  (Y.transmissionResolutionScale = 0.6),
  (Y.toneMapping = r.ACESFilmicToneMapping),
  Lt.appendChild(Y.domElement));
const Ga = new r.HemisphereLight(9414360, 3813414, 0.5);
ke.add(Ga);
const De = new r.DirectionalLight(16763279, 2.1);
((De.castShadow = !0),
  De.shadow.mapSize.set(2048, 2048),
  Object.assign(De.shadow.camera, {
    left: -12.5,
    right: 12.5,
    top: 11,
    bottom: -9,
    near: 1,
    far: 70,
  }),
  (De.shadow.normalBias = 0.03),
  (De.shadow.bias = -4e-4),
  (De.shadow.radius = 2),
  ke.add(De, De.target));
const li = new r.Vector3(0.62, 0.62, 0.48).normalize();
(De.position.copy(li).multiplyScalar(30), De.target.position.set(0, 2, 0));
const Mn = new r.DirectionalLight(9427199, 0.9);
(Mn.position.set(-6, 9, -14), ke.add(Mn));
const Sn = new r.DirectionalLight(16773600, 0.55);
(Sn.position.set(-8, 12, 10), ke.add(Sn));
const Jt = new r.Group();
ke.add(Jt);
const Ot = 10,
  Po = {
    pos: {
      value: Array.from({ length: Ot }, () => new r.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: Ot }, () => new r.Vector3()) },
  },
  ci = `uniform vec4 uFakePos[${Ot}];uniform vec3 uFakeCol[${Ot}];uniform float uSat;`,
  di = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${Ot};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  fi = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  ks = { value: 1.16 };
function lt(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: Po.pos,
        uFakeCol: Po.col,
        uSat: ks,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + ci,
          )
          .replace("#include <lights_fragment_end>", di)
          .replace("#include <opaque_fragment>", fi)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => Ro + (t ? t.key : "")),
    e
  );
}
const Cs = [];
function Qt(e, t, o, a, n, s) {
  const l = { p: new r.Vector3(e, t, o), c: new r.Color(a), r: n, i: s, i0: s };
  return (Cs.push(l), l);
}
const _a = new r.Vector3(),
  We = [],
  zo = new r.Vector3(0, 3, 0);
function ui(e) {
  We.length = 0;
  for (const t of Cs)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        We.length < Ot)
      )
        (We.push(t), We.length === Ot && We.sort((o, a) => o.score - a.score));
      else if (t.score > We[0].score) {
        We[0] = t;
        for (let o = 0; o < Ot - 1 && We[o].score > We[o + 1].score; o++) {
          const a = We[o];
          ((We[o] = We[o + 1]), (We[o + 1] = a));
        }
      }
    }
}
function Ts(e, t) {
  ui(t);
  for (let o = 0; o < Ot; o++) {
    const a = We[o];
    if (!a) {
      (Po.col.value[o].set(0, 0, 0), Po.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (_a.copy(a.p).applyMatrix4(e.matrixWorldInverse),
      Po.pos.value[o].set(_a.x, _a.y, _a.z, 1 / (a.r * a.r)),
      Po.col.value[o].set(a.c.r * a.i, a.c.g * a.i, a.c.b * a.i));
  }
}
const Ua = {};
{
  const e = new r.PMREMGenerator(Y),
    t = (a) =>
      new r.Mesh(
        new r.SphereGeometry(50, 32, 16),
        new r.ShaderMaterial({
          side: r.BackSide,
          vertexShader:
            "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: a,
        }),
      ),
    o = (a, n, s, l, i, c, d) => {
      const f = new r.Mesh(
        new r.BoxGeometry(n, s, 0.4),
        new r.MeshBasicMaterial({ color: new r.Color(...l) }),
      );
      (f.position.set(i, c, d), f.lookAt(0, 0, 0), a.add(f));
    };
  {
    const a = new r.Scene();
    a.add(
      t(
        "varying vec3 d;void main(){vec3 c=mix(vec3(.10,.085,.07),vec3(.16,.19,.26),smoothstep(-.4,.1,d.y));c=mix(c,vec3(.06,.08,.13),smoothstep(.2,.9,d.y));c+=vec3(1.4,.8,.42)*smoothstep(.55,.95,d.x)*smoothstep(-.1,.25,d.y)*(1.-smoothstep(.3,.7,d.y));gl_FragColor=vec4(c,1.);}",
      ),
    );
    const n = [
      [5.5, 4.2, 3],
      [1.8, 3.6, 5.2],
      [4.6, 3, 1.5],
      [2.6, 2.9, 3.4],
      [1.5, 4.2, 5.5],
      [3.4, 3.4, 3.4],
    ];
    for (let s = 0; s < 6; s++) {
      const l = (s / 6) * Math.PI * 2 + 0.4;
      o(a, 12, 2.4, n[s], Math.sin(l) * 28, 12 + (s % 2) * 9, Math.cos(l) * 28);
    }
    {
      const s = new r.Mesh(
        new r.BoxGeometry(40, 1.2, 1.2),
        new r.MeshBasicMaterial({ color: new r.Color(6, 3.4, 1.2) }),
      );
      (s.position.set(0, -6, -30), a.add(s));
    }
    Ua.show = e.fromScene(a, 0.03).texture;
  }
  {
    const a = new r.Scene();
    (a.add(
      t(
        "varying vec3 d;void main(){vec3 c=mix(vec3(.62,.56,.49),vec3(1.02,.97,.9),smoothstep(-.35,.15,d.y));c=mix(c,vec3(1.1,1.08,1.04),smoothstep(.4,.95,d.y));gl_FragColor=vec4(c,1.);}",
      ),
    ),
      o(a, 26, 12, [7, 6.8, 6.4], -14, 22, 12),
      o(a, 18, 9, [4.2, 4.4, 4.8], 24, 12, 6),
      o(a, 30, 6, [3.2, 3.1, 3], 0, 30, -10),
      o(a, 8, 20, [5, 4.8, 4.6], -26, 8, -6),
      (Ua.studio = e.fromScene(a, 0.03).texture));
  }
  e.dispose();
}
((ke.environment = Ua.show), (ke.environmentIntensity = 0.7));
const As = 0,
  kn = new r.WebGLRenderTarget(1, 1, {
    type: r.HalfFloatType,
    generateMipmaps: !0,
    minFilter: r.LinearMipmapLinearFilter,
  }),
  Na = {
    tReflect: { value: kn.texture },
    uReflMatrix: { value: new r.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  Ds = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, Na),
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
  Qe = new r.PerspectiveCamera(),
  $a = new r.Vector3(0, 1, 0),
  ra = new r.Vector3(0, As, 0),
  Cn = new r.Vector3(),
  Va = new r.Vector3(),
  Tn = new r.Matrix4(),
  ia = new r.Plane(),
  Bt = new r.Vector4(),
  Rs = new r.Vector4(),
  _e = [];
function hi() {
  if (
    !D.reflect ||
    Na.uReflStrength.value <= 0 ||
    I.position.y <= As ||
    !De.shadow.map
  )
    return;
  (Cn.setFromMatrixPosition(I.matrixWorld),
    Tn.extractRotation(I.matrixWorld),
    Qe.position.subVectors(ra, Cn).reflect($a).negate().add(ra),
    Va.set(0, 0, -1).applyMatrix4(Tn).add(Cn),
    Va.subVectors(ra, Va).reflect($a).negate().add(ra),
    Qe.up.set(0, 1, 0).applyMatrix4(Tn).reflect($a),
    Qe.lookAt(Va),
    (Qe.far = I.far),
    Qe.updateMatrixWorld(),
    Qe.projectionMatrix.copy(I.projectionMatrix),
    Na.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(Qe.projectionMatrix)
      .multiply(Qe.matrixWorldInverse),
    ia
      .setFromNormalAndCoplanarPoint($a, ra)
      .applyMatrix4(Qe.matrixWorldInverse),
    Bt.set(ia.normal.x, ia.normal.y, ia.normal.z, ia.constant));
  const e = Qe.projectionMatrix.elements;
  (Rs.set(
    (Math.sign(Bt.x) + e[8]) / e[0],
    (Math.sign(Bt.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    Bt.multiplyScalar(2 / Bt.dot(Rs)),
    (e[2] = Bt.x),
    (e[6] = Bt.y),
    (e[10] = Bt.z + 1),
    (e[14] = Bt.w));
  const t = _e.map((a) => a.visible),
    o = Y.shadowMap.needsUpdate;
  (_e.forEach((a) => (a.visible = !1)),
    (Y.shadowMap.needsUpdate = !1),
    Ts(Qe, zo),
    Y.setRenderTarget(kn),
    Y.clear(),
    Y.render(ke, Qe),
    Y.setRenderTarget(null),
    _e.forEach((a, n) => (a.visible = t[n])),
    (Y.shadowMap.needsUpdate = o));
}
const pi =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  Wa = (e, t) =>
    new r.ShaderMaterial({
      uniforms: t,
      vertexShader: pi,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class mi extends yn {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new r.WebGLRenderTarget(1, 1, {
        type: r.HalfFloatType,
        samples: t,
        depthTexture: new r.DepthTexture(1, 1),
      })),
      (this.quad = new Ba(
        Wa(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, a) {
    (Ts(I, zo),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(ke, I),
      t.setRenderTarget(a),
      this.quad.render(t));
  }
}
const Ps = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class vi extends yn {
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
        near: { value: I.near },
        far: { value: I.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new r.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new r.Vector2() },
        fullTexel: { value: new r.Vector2() },
      }),
      (this.pre = new Ba(
        Wa(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Ps}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new Ba(
        Wa(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new Ba(
        Wa(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${Ps}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
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
const D = {
    auto: 1,
    pixelRatio: Ia,
    msaa: Ia >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 2048,
    exposure: 1,
    fov: 30,
    sun: 1,
    fill: 1,
    rim: 1,
    fog: 1,
    sat: 1.26,
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
  An = { ...D },
  et = new ei(
    Y,
    new r.WebGLRenderTarget(1, 1, { type: r.HalfFloatType, depthBuffer: !1 }),
  );
et.setPixelRatio(Ia);
const la = new mi(D.msaa);
et.addPass(la);
const de = new Ss(ke, I, 1, 1);
((de.output = Ss.OUTPUT.Off),
  (de.needsSwap = !1),
  de.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  de.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const bi = de.setSize.bind(de),
  xi = de.render.bind(de);
de.setSize = (e, t) => bi(Math.ceil(e / 2), Math.ceil(t / 2));
const Be = [],
  zs = [];
((de.render = (e, t, o) => {
  (Be.forEach((a, n) => {
    ((zs[n] = a.visible), (a.visible = !1));
  }),
    xi(e, t, o),
    Be.forEach((a, n) => (a.visible = zs[n])),
    (de.blendMaterial.uniforms.intensity.value = D.ao ? D.aoIntensity : 0),
    (de.blendMaterial.uniforms.tDiffuse.value = de.pdRenderTarget.texture),
    de._renderPass(e, de.blendMaterial, o));
}),
  et.addPass(de));
const Ht = new ti(new r.Vector2(256, 256), 0.42, 0.55, 1.05),
  gi = Ht.setSize.bind(Ht);
((Ht.setSize = (e, t) => gi(Math.ceil(e / 2), Math.ceil(t / 2))),
  et.addPass(Ht));
const tt = new vi();
((tt.u.tDepth.value = la.rt.depthTexture), et.addPass(tt));
const qa = new r.Scene(),
  Fs = {
    tSceneDepth: { value: de.depthTexture },
    uRes: { value: new r.Vector2(1, 1) },
    uNF: { value: new r.Vector2(I.near, I.far) },
  };
class yi extends yn {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, a) {
    const n = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(a),
      t.render(qa, I),
      (t.autoClear = n));
  }
}
(et.addPass(new yi()), et.addPass(new oi()));
const Ls = new ai();
et.addPass(Ls);
const wi = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}
float ovVisAt(vec2 o,float soft){float sd=ovLin(texture2D(tSceneDepth,(gl_FragCoord.xy+o)/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  Es = (e, t, o, a = 0.06, n = 2) =>
    new ni(e, t, o, n, Math.min(a, Math.min(e, t, o) / 2.02)),
  It = new Map();
function K(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    It.has(o) ||
      It.set(
        o,
        lt(
          new r.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    It.get(o)
  );
}
function hc(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    It.has(o) ||
      It.set(
        o,
        lt(
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
    It.get(o)
  );
}
function me(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    It.has(o) ||
      It.set(
        o,
        lt(
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
    It.get(o)
  );
}
const Re = (e, t = 1) =>
    new r.MeshBasicMaterial({
      color: new r.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  pc = (e = {}) =>
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
  mc = me("#434a55", { roughness: 0.36 }),
  vc = me("#23272e", { roughness: 0.42, metalness: 0.7 }),
  ca = me("#15171b", { roughness: 0.46, metalness: 0.55 }),
  bc = me("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  ja = me("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  xc = K("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  gc = me("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  yc = me("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  Fo = new r.Matrix4(),
  Lo = new r.Quaternion(),
  Os = new r.Euler(0, 0, 0, "YXZ"),
  Bs = new r.Vector3(1, 1, 1),
  wc = new r.Color(),
  Mc = new r.Vector3(1, 0, 0),
  Hs = new r.Vector3(0, 1, 0),
  Sc = new r.Vector3(0, 0, 1),
  ct = new r.Vector3(),
  Mi = new r.Quaternion();
function ve() {
  const e = new Map(),
    t = (o, a, n, s, l, i) => {
      a = a.index ? a.toNonIndexed() : a;
      for (const d of Object.keys(a.attributes))
        ["position", "normal", "uv"].includes(d) || a.deleteAttribute(d);
      (a.attributes.uv ||
        a.setAttribute(
          "uv",
          new r.Float32BufferAttribute(
            new Float32Array(a.attributes.position.count * 2),
            2,
          ),
        ),
        i.dir
          ? (Lo.setFromUnitVectors(
              Hs,
              ct.set(i.dir[0], i.dir[1], i.dir[2]).normalize(),
            ),
            i.roll && Lo.multiply(Mi.setFromAxisAngle(Hs, i.roll)))
          : (Os.set(i.rx || 0, i.ry || 0, i.rz || 0), Lo.setFromEuler(Os)),
        a.applyMatrix4(
          Fo.compose(
            { x: n, y: s, z: l },
            Lo,
            i.s ? Bs.set(i.s[0], i.s[1], i.s[2]) : Bs.set(1, 1, 1),
          ),
        ));
      let c = e.get(o);
      (c || e.set(o, (c = { mat: o, list: [] })), c.list.push(a));
    };
  return {
    box(o, a, n, s, l, i, c, d = {}) {
      return (
        t(o, d.r ? Es(l, i, c, d.r) : new r.BoxGeometry(l, i, c), a, n, s, d),
        this
      );
    },
    cyl(o, a, n, s, l, i, c, d = {}) {
      return (
        t(o, new r.CylinderGeometry(l, i, c, d.seg || 20), a, n, s, d),
        this
      );
    },
    cone(o, a, n, s, l, i, c = {}) {
      return (
        t(
          o,
          new r.ConeGeometry(l, i, c.seg || 6).translate(0, i / 2, 0),
          a,
          n,
          s,
          c,
        ),
        this
      );
    },
    sph(o, a, n, s, l, i = {}) {
      return (
        t(o, new r.SphereGeometry(l, i.seg || 14, i.seg2 || 10), a, n, s, i),
        this
      );
    },
    tor(o, a, n, s, l, i, c = {}) {
      return (
        t(o, new r.TorusGeometry(l, i, c.seg2 || 8, c.seg || 40), a, n, s, c),
        this
      );
    },
    geo(o, a, n = 0, s = 0, l = 0, i = {}) {
      return (t(o, a.clone(), n, s, l, i), this);
    },
    flush(o, a = !0) {
      const n = [];
      for (const { mat: s, list: l } of e.values()) {
        const i = new r.Mesh(wn(l), s);
        ((i.castShadow = a),
          (i.receiveShadow = !0),
          o.add(i),
          n.push(i),
          l.forEach((c) => c.dispose()));
      }
      return (e.clear(), n);
    },
  };
}
const da = [];
document.fonts?.ready.then(() => da.forEach((e) => e()));
function fa(e, t, o, a, n, s = 0.9, l = {}) {
  const i = document.createElement("canvas");
  ((i.width = o), (i.height = a));
  const c = i.getContext("2d"),
    d = new r.CanvasTexture(i);
  ((d.anisotropy = 8), (d.colorSpace = r.SRGBColorSpace));
  const f = new r.Mesh(
    new r.PlaneGeometry(e, t),
    new r.MeshBasicMaterial({
      map: d,
      alphaTest: 0.3,
      fog: !1,
      side: r.DoubleSide,
      color: new r.Color(s, s, s),
      ...l,
    }),
  );
  return (
    (f.userData = {
      c: i,
      g: c,
      t: d,
      redraw(h) {
        (c.clearRect(0, 0, o, a), h(c, o, a), (d.needsUpdate = !0));
      },
    }),
    n && (f.userData.redraw(n), da.push(() => f.userData.redraw(n))),
    f
  );
}
const Xa = (e, t, o, a, n, s) => {
    (e.beginPath(), e.roundRect(t, o, a, n, s));
  },
  ua = (e, t, o, a = !0) => {
    const n = document.createElement("canvas");
    ((n.width = e), (n.height = t), o(n.getContext("2d"), e, t));
    const s = new r.CanvasTexture(n);
    return (a && (s.colorSpace = r.SRGBColorSpace), (s.anisotropy = 8), s);
  },
  Si = ua(
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
  kc = (e, t, o = Si) =>
    new r.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function Cc(e, t = 64, o = [0, Math.PI * 2]) {
  const a = new r.LatheGeometry(
    e.map(([n, s]) => new r.Vector2(s, n)),
    t,
    o[0],
    o[1],
  );
  return (a.rotateZ(-Math.PI / 2), a);
}
function Tc(e, t) {
  return [...e, ...t.slice().reverse(), e[0]];
}
function Ac(e) {
  const t = new r.Shape(e.map(([s, l]) => new r.Vector2(s, l))),
    o = new r.ShapeGeometry(t, 1),
    a = o.clone();
  a.scale(1, -1, 1);
  const n = a.index.array;
  for (let s = 0; s < n.length; s += 3) {
    const l = n[s];
    ((n[s] = n[s + 2]), (n[s + 2] = l));
  }
  return (a.computeVertexNormals(), wn([o.toNonIndexed(), a.toNonIndexed()]));
}
function ki(e, t, o, a, n = 60, s = 0.07) {
  const l = [],
    i = [],
    c = n * 6,
    d = 0.035,
    f = [
      [e, o],
      [e, a - s],
      [e + d, a],
      [t - d, a],
      [t, a - s],
      [t, o],
    ];
  for (let m = 0; m < f.length; m++)
    for (let x = 0; x <= c; x++) {
      const g = (x / c) * Math.PI * 2,
        w = (x % 6) / 6,
        y = w >= 0.17 && w < 0.67 ? 1 : 0,
        F = m === 2 || m === 3 ? (y ? a : a - s) : f[m][1];
      l.push(f[m][0], -Math.sin(g) * F, Math.cos(g) * F);
    }
  for (let m = 0; m < f.length - 1; m++)
    for (let x = 0; x < c; x++) {
      const g = m * (c + 1) + x,
        w = g + 1,
        y = g + c + 1,
        F = y + 1;
      i.push(g, w, y, w, F, y);
    }
  const h = new r.BufferGeometry();
  (h.setAttribute("position", new r.Float32BufferAttribute(l, 3)),
    h.setIndex(i));
  const p = h.toNonIndexed();
  return (p.computeVertexNormals(), p);
}
function Dc(e, t, o, a, n) {
  const s = new r.Shape(),
    l = a * 4;
  for (let d = 0; d <= l; d++) {
    const f = (d / l) * Math.PI * 2,
      h = d % 4,
      p = h === 1 || h === 2 ? t + o : t,
      m = f + ((h === 1 ? 0.18 : h === 2 ? -0.18 : 0) * Math.PI * 2) / a,
      x = Math.cos(m) * p,
      g = Math.sin(m) * p;
    d ? s.lineTo(x, g) : s.moveTo(x, g);
  }
  const i = new r.Path();
  (i.absarc(0, 0, e, 0, Math.PI * 2, !0), s.holes.push(i));
  const c = new r.ExtrudeGeometry(s, {
    depth: n,
    bevelEnabled: !0,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 1,
    curveSegments: 64,
  });
  return (c.translate(0, 0, -n / 2), c.rotateY(Math.PI / 2), c);
}
function Is(e, t = 0.3, o = 1, a = 0) {
  const n = new r.IcosahedronGeometry(e, a),
    s = n.attributes.position,
    l = xt(o),
    i = new Map();
  for (let c = 0; c < s.count; c++) {
    const d =
      s.getX(c).toFixed(3) +
      "," +
      s.getY(c).toFixed(3) +
      "," +
      s.getZ(c).toFixed(3);
    i.has(d) ||
      i.set(d, [1 + (l() - 0.5) * t, 1 + (l() - 0.5) * t, 1 + (l() - 0.5) * t]);
    const f = i.get(d);
    s.setXYZ(c, s.getX(c) * f[0], s.getY(c) * f[1], s.getZ(c) * f[2]);
  }
  return (n.computeVertexNormals(), n);
}
function Ka(e, t, o, a, n, s = 0, l = {}) {
  const i = new r.Group(),
    c = ve(),
    d = xt(Math.floor(t * 31 + a * 17 + 99));
  c.cyl(K("#5a3f2c"), 0, 0.5 * n, 0, 0.07 * n, 0.1 * n, 1 * n, { seg: 6 });
  const f = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((h) =>
    new r.Color(h).offsetHSL(s, 0, 0).getStyle(),
  );
  for (let h = 0; h < (l.n || 5); h++)
    c.geo(
      K(f[h % 4], { flatShading: !0, roughness: 0.8 }),
      Is(0.42 * n * (0.75 + d() * 0.5), 0.3, h + t * 7 + a * 3),
      (d() - 0.5) * 0.6 * n,
      (1.15 + d() * 0.7) * n,
      (d() - 0.5) * 0.6 * n,
    );
  return (c.flush(i), i.position.set(t, o, a), e.add(i), i);
}
const Ci = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
    K(e, { flatShading: !0, roughness: 0.85 }),
  ),
  Ti = K("#4a3527", { roughness: 0.9 });
function Gs(e, t, o, a, n, s = 1) {
  const l = xt(s * 97 + 13);
  e.cyl(Ti, t, o + 0.15 * n, a, 0.05 * n, 0.07 * n, 0.3 * n, { seg: 5 });
  for (let i = 0; i < 3; i++) {
    const c = (0.42 - i * 0.1) * n * (0.9 + l() * 0.2);
    e.cone(Ci[(i + s) % 3], t, o + (0.22 + i * 0.3) * n, a, c, 0.55 * n, {
      seg: 6 + (s % 2),
      ry: l() * 3,
    });
  }
}
const Ai = K("#8d8aa0", { flatShading: !0, roughness: 0.75 }),
  Di = K("#eef1f8", { flatShading: !0, roughness: 0.6 });
function _s(e, t, o, a, n, s, l = 1) {
  const i = new r.ConeGeometry(n, s, 7, 3).translate(0, s / 2, 0),
    c = i.attributes.position,
    d = xt(l);
  for (let h = 0; h < c.count; h++) {
    const p = c.getY(h);
    p > 0.01 &&
      p < s - 0.01 &&
      (c.setX(h, c.getX(h) * (1 + (d() - 0.5) * 0.35)),
      c.setZ(h, c.getZ(h) * (1 + (d() - 0.5) * 0.35)),
      c.setY(h, p + (d() - 0.5) * s * 0.08));
  }
  (i.computeVertexNormals(), e.geo(Ai, i, t, o, a));
  const f = new r.ConeGeometry(n * 0.36, s * 0.34, 7, 1).translate(
    0,
    s * 0.83 + 0.005,
    0,
  );
  e.geo(Di, f, t, o, a, { ry: l });
}
function Us(e, t, o, a, n = 1, s = 1) {
  const l = ve(),
    i = xt(s * 31);
  (l
    .box(
      K("#5b4636", { roughness: 0.9 }),
      t,
      o + 0.09 * n,
      a,
      1.5 * n,
      0.18 * n,
      1 * n,
      { r: 0.02 * n },
    )
    .box(
      K("#5f8a4a", { flatShading: !0 }),
      t,
      o + 0.19 * n,
      a,
      1.46 * n,
      0.04 * n,
      0.96 * n,
    ),
    _s(l, t - 0.25 * n, o + 0.2 * n, a - 0.15 * n, 0.42 * n, 0.9 * n, s),
    _s(l, t + 0.3 * n, o + 0.2 * n, a - 0.2 * n, 0.34 * n, 0.66 * n, s + 3));
  for (let c = 0; c < 5; c++)
    Gs(
      l,
      t + (i() - 0.5) * 1.2 * n,
      o + 0.2 * n,
      a + 0.1 * n + i() * 0.3 * n,
      0.5 * n * (0.8 + i() * 0.4),
      s + c,
    );
  l.flush(e);
}
const Ri = ua(
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
function Pi(e, t, o, a, n, s, l = 0.5) {
  const i = new r.Mesh(
    new r.PlaneGeometry(n, s),
    new r.MeshBasicMaterial({
      map: Ri,
      transparent: !0,
      opacity: l,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (i.rotation.x = -Math.PI / 2),
    i.position.set(t, o + 0.004, a),
    (i.renderOrder = -1),
    e.add(i),
    Be.push(i),
    i
  );
}
const zi = ua(1024, 512, (e, t, o) => {
    const a = e.createLinearGradient(0, 0, 0, o);
    (a.addColorStop(0, "#6f8fc4"),
      a.addColorStop(0.52, "#d9b9b4"),
      a.addColorStop(0.72, "#f3c49a"),
      a.addColorStop(1, "#8a7a78"),
      (e.fillStyle = a),
      e.fillRect(0, 0, t, o));
    const n = xt(9),
      s = (l, i, c, d) => {
        ((e.fillStyle = c), e.beginPath(), e.moveTo(0, o));
        for (let f = 0; f <= t; f += 16) {
          const h = f / t;
          e.lineTo(
            f,
            l -
              i *
                (Math.abs(Math.sin(h * 5.1 + d)) * 0.7 +
                  Math.abs(Math.sin(h * 13.3 + d * 2)) * 0.3),
          );
        }
        (e.lineTo(t, o), e.fill());
      };
    (s(o * 0.6, o * 0.32, "#8d87a8", 1),
      s(o * 0.7, o * 0.2, "#6c6f8e", 2.2),
      (e.fillStyle = "#e9e6f2"));
    for (let l = 0; l < 5; l++) {
      const i = t * (0.12 + l * 0.2),
        c = o * 0.34 + n() * 20;
      (e.beginPath(),
        e.moveTo(i, c),
        e.lineTo(i - 30, c + 34),
        e.lineTo(i + 30, c + 34),
        e.fill());
    }
    for (let l = 0; l < 110; l++) {
      const i = n() * t,
        c = o * (0.72 + n() * 0.25),
        d = 10 + n() * 26;
      ((e.fillStyle = `hsl(${130 + n() * 20},${25 + n() * 15}%,${22 + n() * 12}%)`),
        e.beginPath(),
        e.moveTo(i, c - d * 2.2),
        e.lineTo(i - d * 0.6, c),
        e.lineTo(i + d * 0.6, c),
        e.fill());
    }
  }),
  J = new r.Group();
Jt.add(J);
const X = -10.2,
  Ya = 11.6,
  He = 12,
  Rc = (() => {
    const e = ua(1024, 1024, (a, n, s) => {
      const i = n / 4,
        c = xt(3);
      for (let d = 0; d < 4; d++)
        for (let f = 0; f < 4; f++) {
          const h = c();
          ((a.fillStyle = `hsl(${28 + h * 6},${17 + h * 5}%,${50 + h * 6}%)`),
            a.fillRect(d * i, f * i, i, i));
          for (let p = 0; p < 70; p++)
            ((a.fillStyle = `rgba(${c() > 0.5 ? 255 : 70},${c() > 0.5 ? 250 : 60},240,${0.025 + c() * 0.03})`),
              a.beginPath(),
              a.ellipse(
                d * i + c() * i,
                f * i + c() * i,
                4 + c() * 40,
                2 + c() * 12,
                c() * 3,
                0,
                7,
              ),
              a.fill());
        }
      ((a.strokeStyle = "#5e564c"), (a.lineWidth = 3));
      for (let d = 0; d <= 4; d++)
        (a.beginPath(),
          a.moveTo(d * i, 0),
          a.lineTo(d * i, s),
          a.stroke(),
          a.beginPath(),
          a.moveTo(0, d * i),
          a.lineTo(n, d * i),
          a.stroke());
    });
    ((e.wrapS = e.wrapT = r.RepeatWrapping), e.repeat.set(9, 6));
    const t = lt(
        new r.MeshStandardMaterial({
          map: e,
          roughness: 0.2,
          metalness: 0.05,
          envMapIntensity: 0.55,
        }),
        Ds,
      ),
      o = new r.Mesh(new r.PlaneGeometry(72, 48), t);
    return (
      (o.rotation.x = -Math.PI / 2),
      o.position.set(0, 0, 4),
      (o.receiveShadow = !0),
      J.add(o),
      _e.push(o),
      o
    );
  })(),
  Za = K("#1f2c45", { roughness: 0.62, envMapIntensity: 0.6 }),
  Ja = K("#172238", { roughness: 0.7 }),
  Ue = me("#3a414c", { roughness: 0.4 });
{
  const e = ve();
  e.box(Za, -16.25, He / 2, X - 0.2, 1.5, He, 0.4)
    .box(Za, 2.75, He / 2, X - 0.2, 20.5, He, 0.4)
    .box(Za, -11.5, 10.5, X - 0.2, 8, 3, 0.4)
    .box(Za, -11.5, 0.6, X - 0.2, 8, 1.2, 0.4);
  for (let n = -5.2; n <= 11; n += 2.6)
    e.box(Ja, n, He / 2, X + 0.01, 0.05, He, 0.04);
  (e.box(Ue, 2.75, 0.12, X + 0.08, 20.5, 0.24, 0.14),
    e.box(Ja, -2, He + 0.2, X + 4.6, 30, 0.4, 12),
    e
      .box(Ue, -11.5, 9.05, X + 0.05, 8.3, 0.16, 0.3)
      .box(Ue, -11.5, 1.15, X + 0.05, 8.3, 0.16, 0.3)
      .box(Ue, -7.45, 5.1, X + 0.05, 0.16, 8, 0.3)
      .box(Ue, -15.55, 5.1, X + 0.05, 0.16, 8, 0.3)
      .box(Ue, -11.5, 5.1, X + 0.05, 0.08, 7.9, 0.16));
  for (const n of [-6.5, 6.6]) e.box(Ue, n, He / 2, X + 0.12, 0.34, He, 0.2);
  e.flush(J, !1);
  const t = new r.Mesh(new r.BoxGeometry(30, 0.06, 0.06), Re("#ffb86b", 3.2));
  (t.position.set(-2, He - 0.35, X + 0.3), J.add(t));
  const o = new r.Mesh(new r.BoxGeometry(20.5, 0.04, 0.04), Re("#ffae5c", 1.6));
  (o.position.set(2.75, 0.27, X + 0.16), J.add(o));
  for (const n of [-6.5, 6.6]) {
    const s = new r.Mesh(
      new r.BoxGeometry(0.05, He - 1.2, 0.05),
      Re("#ffb468", 2.6),
    );
    (s.position.set(n, He / 2, X + 0.24),
      J.add(s),
      Qt(n, 4.5, X + 1.2, "#ffb468", 4, 0.5));
  }
  const a = ve();
  (a.box(Ja, -11.5, 5.1, X - 0.35, 8.1, 7.9, 0.2), a.flush(J, !1));
}
{
  const e = ve(),
    t = me("#3a4150", { roughness: 0.45 }),
    o = K("#d9d2c6", { roughness: 0.6, flatShading: !0 }),
    a = K("#8a7a6a", { roughness: 0.7, flatShading: !0 }),
    n = K("#e4ded4", { roughness: 0.5 });
  for (const s of [2.3, 4.4, 6.5]) {
    e.box(t, -11.5, s, X + 0.55, 7.8, 0.1, 1.1, { r: 0.02 });
    const l = new r.Mesh(
      new r.BoxGeometry(7.6, 0.035, 0.035),
      Re("#ffb86b", 2.6),
    );
    (l.position.set(-11.5, s - 0.07, X + 1.02),
      J.add(l),
      Qt(-11.5, s - 0.3, X + 1.2, "#ffb86b", 3, 0.45));
  }
  for (let s = 0; s < 9; s++) {
    const l = -14.6 + s * 0.78,
      i = [2.35, 4.45, 6.55][s % 3],
      c = xt(s * 7 + 3),
      d = s % 3;
    if (d === 0) {
      const f = 0.34 + c() * 0.2,
        h = 0.3 + c() * 0.25;
      e.box(o, l, i + 0.05 + h / 2, X + 0.55, f, h, 0.34).geo(
        a,
        new r.ConeGeometry(f * 0.78, 0.24, 4)
          .rotateY(Math.PI / 4)
          .scale(1, 1, 0.68),
        l,
        i + 0.05 + h + 0.12,
        X + 0.55,
      );
    } else if (d === 1)
      for (let f = 0; f < 3; f++)
        e.geo(
          K(["#cbbfe6", "#e8e2f4", "#f1c9a0"][f], {
            roughness: 0.25,
            flatShading: !0,
          }),
          new r.CylinderGeometry(0, 0.07, 0.55 - f * 0.12, 6).translate(
            0,
            0.28 - f * 0.06,
            0,
          ),
          l + (f - 1) * 0.1,
          i + 0.05,
          X + 0.55 + (f % 2) * 0.08,
          { rz: (f - 1) * 0.25 },
        );
    else e.cyl(n, l, i + 0.19, X + 0.55, 0.13, 0.1, 0.28, { seg: 14 });
  }
  e.flush(J);
  for (let s = 2; s < 9; s += 3) {
    const l = -14.6 + s * 0.78,
      i = [2.35, 4.45, 6.55][s % 3];
    Ka(J, l, i + 0.33, X + 0.55, 0.34, 0.01, { n: 4 });
  }
}
function Fi(e, t, o, a, n, s = J) {
  const l = fa(
    o,
    a,
    640,
    Math.round((640 * a) / o),
    (i, c, d) => {
      ((i.fillStyle = "rgba(20,40,70,.38)"),
        i.fillRect(0, 0, c, d),
        n(i, c, d),
        (i.strokeStyle = "#8fe4ff"),
        (i.lineWidth = 4),
        i.strokeRect(3, 3, c - 6, d - 6));
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
    l.position.set(e, t, X + 0.14),
    s.add(l),
    Be.push(l),
    Qt(e, t + 0.2, X + 1.6, "#7fd6ff", 5, 0.3),
    l
  );
}
{
  const e = ve();
  (e
    .box(me("#8b6b3d", { roughness: 0.35 }), 8.4, 9.3, X + 0.06, 2.4, 1.6, 0.08)
    .box(K("#1a1f29"), 8.4, 9.3, X + 0.11, 2.14, 1.34, 0.04),
    e.flush(J, !1));
  const t = new r.Mesh(
    new r.PlaneGeometry(1.9, 1.1),
    new r.MeshBasicMaterial({
      map: ua(256, 150, (o, a, n) => {
        ((o.fillStyle = "#1b2230"),
          o.fillRect(0, 0, a, n),
          (o.strokeStyle = "#8f7a55"),
          (o.lineWidth = 3),
          o.beginPath(),
          o.moveTo(128, 20),
          o.lineTo(170, 75),
          o.lineTo(128, 130),
          o.lineTo(86, 75),
          o.closePath(),
          o.stroke());
      }),
      fog: !1,
    }),
  );
  (t.position.set(8.4, 9.3, X + 0.14), J.add(t));
}
const Li = new r.MeshPhysicalMaterial({
  color: "#dff4ff",
  roughness: 0.06,
  metalness: 0,
  transmission: 0.92,
  thickness: 0.05,
  ior: 1.45,
  transparent: !0,
  opacity: 0.35,
  envMapIntensity: 1.2,
  depthWrite: !1,
});
{
  const e = ve(),
    t = 7.9,
    o = X + 1.1;
  (e
    .box(Ja, t, 1.55, o, 4.6, 3.1, 1.9, { r: 0.05 })
    .box(Ue, t, 3.14, o, 4.7, 0.08, 2)
    .box(K("#2f3847", { roughness: 0.5 }), t, 5.1, o - 0.5, 4.4, 4, 0.1),
    e
      .box(Ue, t, 6.95, o, 4.7, 0.1, 2)
      .box(Ue, t - 2.3, 5.05, o + 0.9, 0.06, 3.8, 0.06)
      .box(Ue, t + 2.3, 5.05, o + 0.9, 0.06, 3.8, 0.06)
      .box(Ue, t, 5.05, o, 4.5, 0.06, 1.8),
    e.flush(J, !1));
  const a = new r.Mesh(new r.BoxGeometry(4.5, 3.7, 0.04), Li);
  (a.position.set(t, 5.05, o + 0.93), J.add(a), Be.push(a));
  const n = new r.Mesh(new r.BoxGeometry(4.3, 0.05, 0.05), Re("#ffc07a", 3));
  (n.position.set(t, 6.85, o + 0.6),
    J.add(n),
    Qt(t, 6.4, o + 0.6, "#ffc07a", 3.5, 0.8),
    Us(J, t + 1.1, 5.08, o, 0.72, 8));
  {
    const s = ve(),
      l = [
        K("#d9d2ea", { roughness: 0.2, flatShading: !0 }),
        K("#f2eee6", { roughness: 0.2, flatShading: !0 }),
        K("#e8b98a", { roughness: 0.3, flatShading: !0 }),
        K("#9fb8c9", { roughness: 0.25, flatShading: !0 }),
      ];
    for (const [i, c, d] of [
      [t - 1.3, 3.18, 1],
      [t, 3.18, 0.8],
      [t + 1.3, 3.18, 0.9],
      [t - 1, 5.08, 0.7],
    ]) {
      s.geo(
        K("#6f6258", { flatShading: !0 }),
        Is(0.28 * d, 0.4, i * 3, 0).scale(1, 0.55, 1),
        i,
        c + 0.1 * d,
        o,
      );
      for (let f = 0; f < 6; f++) {
        const h = f * 1.05 + i,
          p = (0.3 + Et(f + i) * 0.35) * d;
        s.geo(
          l[(f + Math.round(i * 3)) % 4],
          new r.CylinderGeometry(0, 0.06 * d, p, 6).translate(0, p / 2, 0),
          i + Math.cos(h) * 0.12 * d,
          c + 0.12 * d,
          o + Math.sin(h) * 0.1 * d,
          { rz: Math.cos(h) * 0.4, rx: Math.sin(h) * 0.4 },
        );
      }
    }
    s.flush(J);
  }
}
{
  const e = ve();
  (e.box(K("#e7e3dc", { roughness: 0.5 }), 9.4, 1.4, -1.4, 1.9, 2.8, 1.9, {
    r: 0.05,
  }),
    e.flush(J),
    Us(J, 9.4, 2.8, -1.4, 1, 11));
}
{
  const e = new r.Mesh(
    new r.PlaneGeometry(30, 15),
    new r.MeshBasicMaterial({ map: zi, fog: !1, color: new r.Color(1, 1, 1) }),
  );
  ((e.rotation.y = -Math.PI / 2), e.position.set(26, 6.2, -1), J.add(e));
  const t = ve();
  for (const a of [-7.4, -3.2, 1, 5.2])
    t.box(Ue, Ya, He / 2, a, 0.16, He, 0.16);
  (t.box(Ue, Ya, 0.15, 0, 0.3, 0.3, 16).box(Ue, Ya, He - 0.2, 0, 0.3, 0.3, 16),
    t.flush(J, !1));
  const o = ve();
  for (let a = 0; a < 26; a++) {
    const n = -9 + Et(a) * 18,
      s = 14 + Et(a + 0.5) * 9;
    Gs(o, s, 0, n, 2 + Et(a + 0.2) * 2.4, a);
  }
  o.flush(J);
}
{
  const e = ve(),
    t = K("#d9d3c8", { roughness: 0.55 });
  (e
    .box(t, 10.1, 0.45, 2.8, 1.1, 0.9, 1.1, { r: 0.06 })
    .box(t, -9.2, 0.45, -5.8, 1.1, 0.9, 1.1, { r: 0.06 })
    .box(t, -8.2, 0.4, 5.4, 1.2, 0.8, 1.2, { r: 0.06 }),
    e.flush(J),
    Ka(J, 10.1, 0.9, 2.8, 1.35),
    Ka(J, -9.2, 0.9, -5.8, 1.3, 0.02),
    Ka(J, -8.2, 0.8, 5.4, 1.1, -0.02, { n: 7 }));
}
const Qa = { x0: -7.9, x1: 7.9, top: 1.86, zf: 1, zb: -6.35 },
  gt = new r.Group();
Jt.add(gt);
const Le = new r.Group(),
  ho = Math.hypot(0.62, Qa.top - 0.3);
{
  const { x0: e, x1: t, top: o, zf: a, zb: n } = Qa,
    s = [
      [2.12 + a, 0.26],
      [1.5 + a, o - 0.04],
      [1.42 + a, o],
      [n, o],
      [n - 0.08, o - 0.05],
      [n - 0.2, 0.26],
    ],
    l = new r.Shape(s.map(([x, g]) => new r.Vector2(x, g))),
    i = new r.ExtrudeGeometry(l, {
      depth: t - e - 0.5,
      bevelEnabled: !0,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 2,
    });
  (i.rotateY(-Math.PI / 2), i.translate(t - 0.25, 0, 0));
  const c = new r.Mesh(i, me("#454c57", { roughness: 0.34, metalness: 0.75 }));
  ((c.castShadow = c.receiveShadow = !0), gt.add(c));
  const d = new r.ExtrudeGeometry(
    new r.Shape(
      s.map(([x, g]) => new r.Vector2(x + 0.07, g + (g > 1 ? 0.05 : -0.1))),
    ),
    {
      depth: 0.34,
      bevelEnabled: !0,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    },
  );
  d.rotateY(-Math.PI / 2);
  for (const x of [e + 0.3, t + 0.04]) {
    const g = new r.Mesh(
      d,
      me("#8d949e", { roughness: 0.26, metalness: 0.95 }),
    );
    ((g.position.x = x), (g.castShadow = g.receiveShadow = !0), gt.add(g));
  }
  const f = ve();
  (f.box(
    K("#15181d", { roughness: 0.6 }),
    (e + t) / 2,
    0.13,
    (2.12 + a + n - 0.2) / 2,
    t - e - 0.5,
    0.26,
    2.12 + a - n - 0.1,
  ),
    f.box(
      me("#4a5059", { roughness: 0.5, metalness: 0.6 }),
      (e + t) / 2,
      o + 0.02,
      (1.42 + a + n) / 2,
      t - e - 0.6,
      0.05,
      1.42 + a - n - 0.1,
      { r: 0.02 },
    ),
    f.flush(gt));
  const h = new r.Mesh(
    new r.BoxGeometry(t - e - 0.9, 0.05, 0.05),
    Re("#ffab55", 4.2),
  );
  (h.position.set((e + t) / 2, 0.24, 2.02 + a), gt.add(h));
  const p = h.clone();
  (p.position.set((e + t) / 2, 0.24, n - 0.3), gt.add(p));
  const m = new r.Mesh(
    new r.BoxGeometry(t - e - 0.7, 0.035, 0.035),
    Re("#ffb468", 3.4),
  );
  (m.position.set((e + t) / 2, o - 0.03, 1.47 + a),
    gt.add(m),
    Qt(-4, 0.5, 3.8, "#ffab55", 3, 0.9),
    Qt(4, 0.5, 3.8, "#ffab55", 3, 0.9),
    Le.position.set(0, 0.278, 2.165 + a),
    (Le.rotation.x = -Math.atan2(0.62, o - 0.3)),
    gt.add(Le));
}
const Ns = me("#1a1f28", {
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }),
  $s = me("#2b313b", { roughness: 0.35 });
function ha(e, t, o = {}) {
  const a = o.h || ho * 0.8,
    n = o.y || ho * 0.5,
    s = ve();
  return (
    s
      .box($s, e, n, 0.005, t, a, 0.03, { r: 0.05 })
      .box(Ns, e, n, 0.02, t - 0.15, a - 0.08 * ho, 0.02, { r: 0.04 }),
    s.flush(Le, !1),
    { x: e, y: n, w: t, h: a }
  );
}
function Vs(e, t, o, a, n, s = {}) {
  const l = s.cw || 1024,
    i = Math.round((l * a) / o),
    c = document.createElement("canvas");
  ((c.width = l), (c.height = i));
  const d = c.getContext("2d"),
    f = new r.CanvasTexture(c);
  ((f.colorSpace = r.SRGBColorSpace), (f.anisotropy = 8));
  const h = new r.Mesh(
    new r.PlaneGeometry(o, a),
    new r.MeshBasicMaterial({
      map: f,
      fog: !1,
      color: new r.Color(s.k || 1.5, s.k || 1.5, s.k || 1.5),
    }),
  );
  return (
    h.position.set(e, t, 0.036),
    (s.parent || Le).add(h),
    (h.userData = {
      c,
      g: d,
      t: f,
      redraw(p = 0) {
        (d.clearRect(0, 0, l, i), n(d, l, i, p), (f.needsUpdate = !0));
      },
    }),
    h.userData.redraw(0),
    da.push(() => h.userData.redraw(le)),
    h
  );
}
function Pc(e, t, o = {}) {
  return Ei(Le, e, t, 0.03, o);
}
function Ei(e, t, o, a, n = {}) {
  const s = n.r || 0.36,
    l = new r.Group();
  (l.position.set(t, o, a), e.add(l));
  const i = new r.Mesh(ki(0, 0.14, 0, s * 0.86, 36, 0.02), ja);
  ((i.rotation.y = -Math.PI / 2), l.add(i));
  const c = new r.Mesh(
    new r.CylinderGeometry(s * 0.8, s * 0.84, 0.05, 48),
    me("#d7dde6", { roughness: 0.18, metalness: 1 }),
  );
  ((c.rotation.x = Math.PI / 2), (c.position.z = 0.16), l.add(c));
  const d = new r.Mesh(
    new r.BoxGeometry(0.03, s * 0.4, 0.01),
    Re(n.ring || "#ffb454", 3),
  );
  (d.position.set(0, s * 0.5, 0.19), l.add(d));
  const f = new r.Mesh(
    new r.TorusGeometry(s * 1.08, 0.022, 8, 64),
    Re(n.ring || "#ffb454", 2.6),
  );
  return (
    (f.position.z = 0.01),
    l.add(f),
    (l.userData = { ring: f, tick: d, spin: 0 }),
    l
  );
}
function Oi(e, t, o, a = {}) {
  const n = ve();
  n.box(
    K("#0b0e13", { roughness: 0.5 }),
    (e + t) / 2,
    o,
    0.04,
    t - e + 0.1,
    0.05,
    0.02,
  );
  for (let p = 0; p <= (a.ring ? 8 : 40); p++) {
    const m = te(e, t, p / (a.ring ? 8 : 40));
    a.ring
      ? n.box(K("#5a6272"), m, o - 0.2, 0.04, 0.012, 0.07, 0.01)
      : n.box(
          K("#5a6272"),
          m,
          o + (p % 5 ? 0.1 : 0.12),
          0.04,
          0.012,
          p % 5 ? 0.06 : 0.1,
          0.01,
        );
  }
  n.flush(Le, !1);
  const s = a.color || "#6fdcff",
    l = new r.Mesh(new r.BoxGeometry(1, 0.028, 0.012), Re(s, a.ring ? 1.9 : 3));
  (l.position.set(e, o, 0.055), Le.add(l));
  const i = new r.Group(),
    c = ve();
  if (a.ring) {
    (c
      .cyl(ca, 0, 0, 0, 0.125, 0.13, 0.07, { rx: Math.PI / 2, seg: 32 })
      .tor(
        me("#e9eef5", { roughness: 0.2, metalness: 0.9 }),
        0,
        0,
        0.035,
        0.125,
        0.022,
        { seg: 40, seg2: 8 },
      ),
      c.flush(i));
    const p = new r.Mesh(new r.TorusGeometry(0.155, 0.012, 6, 48), Re(s, 2.6));
    ((p.position.z = 0.03), i.add(p), i.position.set(e, o, 0.07), Le.add(i));
  } else {
    (c
      .cyl(ja, 0, 0, 0, 0.12, 0.12, 0.3, { seg: 28 })
      .cyl(ca, 0, 0.1, 0, 0.125, 0.125, 0.03, { seg: 28 })
      .cyl(ca, 0, -0.1, 0, 0.125, 0.125, 0.03, { seg: 28 }),
      c.flush(i));
    const p = new r.Mesh(new r.ConeGeometry(0.045, 0.07, 3), Re(s, 3));
    (p.position.set(0, -0.25, 0),
      (p.rotation.z = Math.PI),
      i.add(p),
      i.position.set(e, o, 0.17),
      Le.add(i));
  }
  const d = new r.Mesh(
    new r.PlaneGeometry(t - e + 0.3, 0.36),
    new r.MeshBasicMaterial({ visible: !1 }),
  );
  (d.position.set((e + t) / 2, o, 0.1), Le.add(d));
  const f = (p, m) => {
      const x = new r.Group(),
        g = Re(s, 2.6);
      for (const y of [1, -1]) {
        const F = new r.Mesh(new r.BoxGeometry(0.2, 0.035, 0.012), g);
        (F.position.set(-m * 0.05, y * 0.06, 0),
          (F.rotation.z = y * m * -0.85),
          x.add(F));
      }
      const w = new r.Mesh(
        new r.PlaneGeometry(0.4, 0.5),
        new r.MeshBasicMaterial({ visible: !1 }),
      );
      return (
        x.add(w),
        (x.userData.hit = w),
        x.position.set(p, o + 0.02, 0.05),
        Le.add(x),
        x
      );
    },
    h = {
      a: e,
      b: t,
      y: o,
      fill: l,
      knob: i,
      hit: d,
      chevL: a.chev === !1 ? null : f(e - (a.ring ? 0.28 : 0.36), -1),
      chevR: a.chev === !1 ? null : f(t + (a.ring ? 0.28 : 0.36), 1),
      t: 0,
      set(p) {
        this.t = W(p, 0, 1);
        const m = te(e, t, this.t);
        ((i.position.x = m),
          (l.scale.x = Math.max(0.001, m - e)),
          (l.position.x = e + (m - e) / 2));
      },
      fromRay(p) {
        const m = p.intersectObject(d, !1)[0];
        if (!m) return null;
        const x = Le.worldToLocal(m.point.clone());
        return W((x.x - e) / (t - e), 0, 1);
      },
    };
  return (h.set(0), h);
}
const Dn = [];
function Bi(e, t, o, a, n, s = 128) {
  const l = "@RYANSAEL ON X",
    i = () => {
      ((e.font = `${a ? 700 : 600} ${s}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(s * 0.08) + "px"));
    };
  i();
  const c = e.measureText(l).width;
  c > t - 28 && ((s = Math.floor((s * (t - 28)) / c)), i());
  const d = t / 2 + Math.round(s * 0.04),
    f = o / 2 + s * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), a)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(l, d, f + s * 0.05),
      (e.fillStyle = n ? "#e08a24" : "#38332d"),
      e.fillText(l, d, f));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(l, d + s * 0.02, f + s * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(l, d, f - s * 0.025));
  const h = e.createLinearGradient(0, f - s * 0.7, 0, f);
  (h.addColorStop(0, "#f1d08c"),
    h.addColorStop(1, "#b3833d"),
    (e.fillStyle = h),
    e.fillText(l, d, f));
}
function Ws(e, t = {}) {
  const o = !!t.pale,
    a = t.k ?? (o ? 0.92 : 0.6);
  let n = !1;
  const s = (i, c, d) => Bi(i, c, d, o, n),
    l = fa(e, e * 0.1375, 1280, 176, s, a, { alphaTest: 0.25 });
  return (
    (l.userData.mark = 1),
    _e.push(l),
    Dn.push({
      hit: l,
      over(i) {
        ((n = i),
          o
            ? l.userData.redraw(s)
            : l.material.color.setRGB(i ? 3.4 : a, i ? 2.5 : a, i ? 1.4 : a));
      },
    }),
    l
  );
}
function Hi(e, t, o = 1.2, a = {}) {
  const n = Ws(o, a);
  return (n.position.set(e, t, 0.012), Le.add(n), n);
}
const pa = new r.Group();
(Jt.add(pa), (pa.visible = !1));
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
        "varying vec3 vW;uniform vec3 uC;void main(){vec3 d=normalize(vW-vec3(0.,3.,0.));float glow=exp(-pow(length(vW.xy-uC.xy)/70.,2.));float up=smoothstep(-.1,.7,d.y);vec3 c=mix(vec3(.008,.022,.07),vec3(.02,.06,.19),glow);c=mix(c,vec3(.006,.014,.05),up*.6);gl_FragColor=vec4(c,1.);}",
    }),
  );
  ((e.renderOrder = -10), pa.add(e), Be.push(e));
  const t = lt(
      new r.MeshStandardMaterial({
        color: "#101a2e",
        roughness: 0.32,
        metalness: 0.2,
        envMapIntensity: 0.4,
      }),
      Ds,
    ),
    o = new r.Mesh(new r.CircleGeometry(90, 64), t);
  ((o.rotation.x = -Math.PI / 2),
    (o.receiveShadow = !0),
    pa.add(o),
    _e.push(o));
}
const ma = new r.Group();
(Jt.add(ma), (ma.visible = !1));
{
  const e = [];
  for (let i = 40; i > -6; i -= 2) e.push([i, 0]);
  for (let i = 0; i <= 16; i++) {
    const c = ((i / 16) * Math.PI) / 2;
    e.push([-6 - Math.sin(c) * 10, 10 - Math.cos(c) * 10]);
  }
  for (let i = 12; i <= 60; i += 4) e.push([-16, i]);
  const t = [],
    o = [],
    a = [],
    n = 70;
  e.forEach(([i, c], d) => {
    const [f, h] = e[Math.min(d + 1, e.length - 1)],
      [p, m] = e[Math.max(d - 1, 0)],
      x = f - p,
      g = h - m,
      w = Math.hypot(x, g) || 1;
    for (const y of [-n, n]) (t.push(y, c, i), o.push(0, -x / w, g / w));
  });
  for (let i = 0; i < e.length - 1; i++) {
    const c = i * 2;
    a.push(c, c + 1, c + 2, c + 1, c + 3, c + 2);
  }
  const s = new r.BufferGeometry();
  (s.setAttribute("position", new r.Float32BufferAttribute(t, 3)),
    s.setAttribute("normal", new r.Float32BufferAttribute(o, 3)),
    s.setIndex(a));
  const l = new r.Mesh(
    s,
    K("#efe6da", { roughness: 0.92, envMapIntensity: 0.4 }),
  );
  ((l.receiveShadow = !0), ma.add(l));
}
class qs {
  constructor(t) {
    this.max = t;
    const o = new r.BufferGeometry();
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
      o.setIndex(new r.BufferAttribute(a, 1)),
      (this.mesh = new r.Mesh(
        o,
        new r.ShaderMaterial({
          uniforms: {
            ...Fs,
            uSoft: { value: 0.35 },
            uLight: { value: 0 },
            uLightK: { value: 0.62 },
            uDil: { value: 0 },
          },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: r.AdditiveBlending,
          side: r.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${wi}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;uniform float uDil;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float vis=ovVis(uSoft);
     if(uDil>0.)vis=min(vis,min(min(ovVisAt(vec2(uDil,0.),uSoft),ovVisAt(vec2(-uDil,0.),uSoft)),min(ovVisAt(vec2(0.,uDil),uSoft),ovVisAt(vec2(0.,-uDil),uSoft))));   // a blurred occluder is wider than its depth
     float a=(k*.5+core*1.5)*vC.a*vis;
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      qa.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? r.NormalBlending : r.AdditiveBlending));
  }
  begin() {
    this.n = 0;
  }
  seg(t, o, a, n, s, l, i) {
    if (this.n >= this.max) return;
    const c = this.n++;
    (js.subVectors(o, t),
      Xs.addVectors(t, o).multiplyScalar(0.5),
      Ks.subVectors(I.position, Xs),
      Xe.crossVectors(js, Ks).normalize());
    const d = this.pos,
      f = c * 12;
    ((d[f] = t.x - Xe.x * a),
      (d[f + 1] = t.y - Xe.y * a),
      (d[f + 2] = t.z - Xe.z * a),
      (d[f + 3] = t.x + Xe.x * a),
      (d[f + 4] = t.y + Xe.y * a),
      (d[f + 5] = t.z + Xe.z * a),
      (d[f + 6] = o.x - Xe.x * n),
      (d[f + 7] = o.y - Xe.y * n),
      (d[f + 8] = o.z - Xe.z * n),
      (d[f + 9] = o.x + Xe.x * n),
      (d[f + 10] = o.y + Xe.y * n),
      (d[f + 11] = o.z + Xe.z * n),
      this.side.set([-1, 1, -1, 1], c * 4));
    const h = this.col,
      p = c * 16;
    for (let m = 0; m < 4; m++)
      ((h[p + m * 4] = s.r),
        (h[p + m * 4 + 1] = s.g),
        (h[p + m * 4 + 2] = s.b),
        (h[p + m * 4 + 3] = m < 2 ? l : i));
  }
  line(t, o, a, n) {
    for (let s = 0; s < t.length - 1; s++) {
      const l = s / (t.length - 1),
        i = (s + 1) / (t.length - 1);
      this.seg(
        t[s],
        t[s + 1],
        Ke(t[s], o),
        Ke(t[s + 1], o),
        a,
        n ? n(l) : 1,
        n ? n(i) : 1,
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
const js = new r.Vector3(),
  Xs = new r.Vector3(),
  Ks = new r.Vector3(),
  Xe = new r.Vector3(),
  Eo = new qs(6e3),
  dt = new qs(4e3);
(dt.setLight(!0),
  (dt.mesh.material.uniforms.uSoft.value = 0.12),
  (dt.mesh.material.uniforms.uDil.value = 10),
  (dt.mesh.renderOrder = 5));
const Ke = (e, t) =>
  ((I.position.distanceTo(e) * Math.tan(r.MathUtils.degToRad(I.fov / 2)) * 2) /
    Math.max(Lt.clientHeight, 1)) *
  t *
  0.5;
function Ie(e = 640, t = 104) {
  const o = document.createElement("canvas");
  ((o.width = e), (o.height = t));
  const a = o.getContext("2d"),
    n = new r.CanvasTexture(o);
  ((n.colorSpace = r.SRGBColorSpace), (n.anisotropy = 4));
  const s = new r.Mesh(
    new r.PlaneGeometry(1, t / e),
    new r.MeshBasicMaterial({
      map: n,
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
    qa.add(s),
    (s.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 1,
      set(l, i = "", c = "#7fe3ff", d = 0) {
        const f = l + "|" + i + "|" + c + "|" + d;
        if (f === this.key) return;
        ((this.key = f),
          (this.args = [l, i, c, d]),
          a.clearRect(0, 0, e, t),
          (a.font = "600 38px Outfit, sans-serif"));
        const h = a.measureText(l).width;
        a.font = "500 30px DM Mono, monospace";
        const p = i ? a.measureText(i).width + 26 : 0,
          m = Math.min(e - 8, h + p + 84),
          x = d < 0 ? 4 : d > 0 ? e - 4 - m : (e - m) / 2;
        ((this.pw = m),
          (a.fillStyle = "rgba(10,14,26,.86)"),
          Xa(a, x, 8, m, t - 16, (t - 16) / 2),
          a.fill(),
          (a.fillStyle = c),
          a.beginPath(),
          a.arc(x + 34, t / 2, 9, 0, 7),
          a.fill(),
          (a.fillStyle = "#f2f6ff"),
          (a.font = "600 38px Outfit, sans-serif"),
          (a.textBaseline = "middle"),
          a.fillText(l, x + 56, t / 2 + 1),
          i &&
            ((a.fillStyle = "#9fe6ff"),
            (a.font = "500 30px DM Mono, monospace"),
            a.fillText(i, x + 56 + h + 22, t / 2 + 2)),
          (n.needsUpdate = !0));
      },
    }),
    da.push(() => {
      const l = s.userData;
      l.args && ((l.key = ""), l.set(...l.args));
    }),
    s
  );
}
let Rn = 0;
const zc = { l: [], acc: [], init: 0 };
function va(e, t, o = 24, a = 0) {
  ((e.userData.fr = Rn), (e.userData.px = o));
  const n = (Ke(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(I.quaternion),
    e.scale.set(n, n, n),
    a &&
      e.position.addScaledVector(
        Ii.set(0, 1, 0).applyQuaternion(I.quaternion),
        (a * n * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-qo * 8))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
const Ii = new r.Vector3();
let ba = !0;
const Oo = window.MF_DATA,
  O = Oo.meta,
  Gi = await (async () => {
    const e = Uint8Array.from(atob(Oo.bin), (t) => t.charCodeAt(0));
    if (typeof DecompressionStream > "u")
      throw (
        (E("#loading").textContent =
          "This model needs a current browser (Chrome, Edge, Safari 16.4+ or Firefox 113+)."),
        new Error("no DecompressionStream")
      );
    return new Response(
      new Blob([e]).stream().pipeThrough(new DecompressionStream("gzip")),
    ).arrayBuffer();
  })(),
  Gt = (e) => {
    const [t, o, a] = O.sec[e],
      n = {
        uint8: Uint8Array,
        int16: Int16Array,
        int32: Int32Array,
        uint16: Uint16Array,
        uint32: Uint32Array,
      }[a];
    return new n(Gi.slice(t, t + o));
  },
  H = 640,
  _i = 5,
  ot = H / _i,
  ue = O.half[0] / H,
  be = O.half[1] / H,
  C = {
    nx: O.nx,
    nz: O.nz,
    cx: O.cell[0],
    cz: O.cell[1],
    x0: O.g0[0],
    z0: O.g0[1],
    raw: Gt("grid"),
  };
{
  const e = C.nx * C.nz,
    t = C.raw;
  ((C.E = new Float32Array(e)),
    (C.F = new Float32Array(e)),
    (C.HM = new Float32Array(e)),
    (C.HA = new Float32Array(e)));
  for (let o = 0; o < e; o++)
    ((C.E[o] = O.eMin + t[o * 4] * O.eStep),
      (C.F[o] = t[o * 4 + 1] * O.hStep),
      (C.HM[o] = t[o * 4 + 2] === 255 ? 99 : t[o * 4 + 2] * O.hStep),
      (C.HA[o] = t[o * 4 + 3] === 255 ? 99 : t[o * 4 + 3] * O.hStep));
}
function Ce(e, t, o) {
  let a = (t - C.x0) / C.cx,
    n = (o - C.z0) / C.cz;
  ((a = a < 0 ? 0 : a > C.nx - 1.001 ? C.nx - 1.001 : a),
    (n = n < 0 ? 0 : n > C.nz - 1.001 ? C.nz - 1.001 : n));
  const s = a | 0,
    l = n | 0,
    i = a - s,
    c = n - l,
    d = l * C.nx + s;
  return (
    (e[d] * (1 - i) + e[d + 1] * i) * (1 - c) +
    (e[d + C.nx] * (1 - i) + e[d + C.nx + 1] * i) * c
  );
}
const Pn = (e, t) => [e[t * 2] * O.xyStep, e[t * 2 + 1] * O.xyStep],
  zn = Gt("verts"),
  eo = Gt("rmeta"),
  Ui = Gt("ridx"),
  Ys = Gt("river"),
  Fn = Gt("smeta"),
  Ni = Gt("spts"),
  xa = Gt("wmeta"),
  $i = Gt("wpts"),
  _t = zn.length / 2,
  N = new Float32Array(_t),
  $ = new Float32Array(_t);
for (let e = 0; e < _t; e++)
  ((N[e] = zn[e * 2] * O.xyStep), ($[e] = zn[e * 2 + 1] * O.xyStep));
const ga = [];
for (let e = 0; e < eo.length; e += 5)
  ga.push({
    t: eo[e],
    br: eo[e + 1],
    nm: eo[e + 2] ? Oo.names[eo[e + 2] - 1] : "",
    v: Array.from(Ui.subarray(eo[e + 3], eo[e + 3] + eo[e + 4])),
  });
const ya = [];
for (let e = 0; e < Ys.length / 2; e++) ya.push(Pn(Ys, e));
const Vi = [];
for (let e = 0; e < Fn.length; e += 2) {
  const t = [];
  for (let o = 0; o < Fn[e + 1]; o++) t.push(Pn(Ni, Fn[e] + o));
  Vi.push(t);
}
const Ln = [];
for (let e = 0; e < xa.length; e += 4) {
  const t = [];
  for (let o = 0; o < xa[e + 3]; o++) t.push(Pn($i, xa[e + 2] + o));
  Ln.push({ outer: xa[e], river: xa[e + 1], P: t });
}
const Bo = {
    alert: 6,
    mobil: 7,
    crit: 7.5,
    extreme: 8.5,
    s0: 4.6,
    stabDrop: 0.25,
    roadCut: 0.3,
    nogo: 1,
    nogoDam: 0.5,
    ppl: 3,
    cap: 150,
    seasonPeak: 9.2,
    damBase: 5.5,
    damArrive: 14,
    damRise: 6,
    damPeak: 11.5,
    damFall: 30,
  },
  En = Object.keys(Bo),
  On = [{ y: 2024, s: 7.46, src: "O Imparcial, 22 Apr 2024" }],
  b = { ...Bo };
function Wi() {
  let e = null;
  try {
    const t = location.hash.match(/cfg=([^&]+)/);
    t && (e = JSON.parse(decodeURIComponent(escape(atob(t[1])))));
  } catch {}
  if (!e)
    try {
      e = JSON.parse(localStorage.getItem(Ro + ":cfg") || "null");
    } catch {}
  if (e)
    for (const t of En)
      typeof e[t] == "number" && isFinite(e[t]) && (b[t] = e[t]);
  Bn();
}
function Bn() {
  ((b.mobil = Math.max(b.mobil, b.alert)),
    (b.crit = Math.max(b.crit, b.mobil)),
    (b.extreme = Math.max(b.extreme, b.crit)),
    (b.ppl = Math.max(0, b.ppl)),
    (b.cap = Math.max(1, b.cap)),
    (b.damArrive = Math.max(0, b.damArrive)),
    (b.damRise = Math.max(0.5, b.damRise)),
    (b.damFall = Math.max(1, b.damFall)));
}
function Zs() {
  try {
    localStorage.setItem(Ro + ":cfg", JSON.stringify(b));
  } catch {}
}
function Js() {
  const e = {};
  for (const t of En) b[t] !== Bo[t] && (e[t] = b[t]);
  return (
    location.href.split("#")[0] +
    (Object.keys(e).length
      ? "#cfg=" + btoa(unescape(encodeURIComponent(JSON.stringify(e))))
      : "")
  );
}
Wi();
const S = {
    h: 0,
    S: 0,
    houses: 0,
    people: 0,
    wet: 0,
    roadsKm: 0,
    cutKm: 0,
    iso: 0,
    isoPeople: 0,
    shOpen: 0,
    shAll: 0,
    phase: 0,
    hoods: [],
    routes: [],
    nogoArea: 0,
    area: 0,
    bridge: null,
    hosp: null,
    sub: null,
    lastH: -99,
    dirty: !0,
  },
  qi = (e, t, o) => {
    const a = Ce(C.HM, e, t);
    return a < o ? o - a + Ce(C.F, e, t) : o - a;
  },
  Hn = new Float32Array(C.nx * C.nz);
{
  const e = new Float32Array(C.nx * C.nz);
  for (const o of ga)
    if (!(o.t > 2))
      for (let a = 0; a < o.v.length - 1; a++) {
        const n = o.v[a],
          s = o.v[a + 1],
          l = Math.hypot(N[s] - N[n], $[s] - $[n]),
          i = Math.max(1, Math.ceil(l / 10));
        for (let c = 0; c < i; c++) {
          const d = (c + 0.5) / i,
            f = N[n] + (N[s] - N[n]) * d,
            h = $[n] + ($[s] - $[n]) * d,
            p = Math.round((f - C.x0) / C.cx),
            m = Math.round((h - C.z0) / C.cz);
          p >= 0 &&
            m >= 0 &&
            p < C.nx &&
            m < C.nz &&
            (e[m * C.nx + p] += l / i);
        }
      }
  const t = new Float32Array(e.length);
  for (let o = 0; o < 2; o++) {
    const a = o ? t : e,
      n = o ? Hn : t;
    for (let s = 0; s < C.nz; s++)
      for (let l = 0; l < C.nx; l++) {
        let i = 0,
          c = 0;
        for (let d = -2; d <= 2; d++)
          for (let f = -2; f <= 2; f++) {
            const h = l + f,
              p = s + d;
            h < 0 ||
              p < 0 ||
              h >= C.nx ||
              p >= C.nz ||
              ((i += a[p * C.nx + h]), c++);
          }
        n[s * C.nx + l] = i / c;
      }
  }
}
const yt = [],
  Ho = Array.from({ length: _t }, () => []),
  Qs = [];
for (const e of ga) e.br && Qs.push(e.v[0], e.v[e.v.length - 1]);
const ji = (e, t) => Qs.some((o) => (N[o] - e) ** 2 + ($[o] - t) ** 2 < 2025),
  er = (e, t) => Math.abs(e) > O.half[0] - 15 || Math.abs(t) > O.half[1] - 15;
for (const e of ga)
  for (let t = 0; t < e.v.length - 1; t++) {
    const o = e.v[t],
      a = e.v[t + 1],
      n = Math.hypot(N[a] - N[o], $[a] - $[o]);
    if (n < 0.01) continue;
    const s = Math.max(1, Math.ceil(n / 9)),
      l = [];
    for (let c = 0; c <= s; c++) {
      const d = c / s,
        f = N[o] + (N[a] - N[o]) * d,
        h = $[o] + ($[a] - $[o]) * d;
      l.push(e.br || ji(f, h) || er(f, h) ? 99 : Ce(C.HM, f, h), Ce(C.F, f, h));
    }
    const i = {
      a: o,
      b: a,
      w: e,
      len: n,
      t: e.t,
      br: e.br,
      s: Float32Array.from(l),
      st: 0,
      dmax: -99,
      id: yt.length,
      inM: !er((N[o] + N[a]) / 2, ($[o] + $[a]) / 2),
    };
    (yt.push(i), Ho[o].push(i), Ho[a].push(i));
  }
const we =
    yt.find((e) => e.br && /Francisco S/.test(e.w.nm)) ||
    yt.find((e) => e.br && e.t === 0),
  Io = 60,
  In = new Map();
for (let e = 0; e < _t; e++) {
  if (!Ho[e].length) continue;
  const t = Math.floor(N[e] / Io) + "," + Math.floor($[e] / Io);
  (In.get(t) || In.set(t, []).get(t)).push(e);
}
function en(e, t, o = 1e9, a) {
  const n = Math.floor(e / Io),
    s = Math.floor(t / Io),
    l = Math.min(80, Math.ceil(o / Io) + 1);
  let i = -1,
    c = o * o;
  for (let d = 0; d <= l; d++) {
    for (let f = n - d; f <= n + d; f++)
      for (let h = s - d; h <= s + d; h++) {
        if (Math.max(Math.abs(f - n), Math.abs(h - s)) !== d) continue;
        const p = In.get(f + "," + h);
        if (p)
          for (const m of p) {
            if (a && !a(m)) continue;
            const x = (N[m] - e) ** 2 + ($[m] - t) ** 2;
            x < c && ((c = x), (i = m));
          }
      }
    if (i >= 0 && Math.sqrt(c) < d * Io) break;
  }
  return i;
}
const he = (() => {
    const e = [],
      o = new Map(),
      a = (c, d) => Math.floor(c / 24) + "," + Math.floor(d / 24),
      n = new Map();
    for (const c of yt) {
      if (c.t > 4) continue;
      const d = Math.min(N[c.a], N[c.b]),
        f = Math.max(N[c.a], N[c.b]),
        h = Math.min($[c.a], $[c.b]),
        p = Math.max($[c.a], $[c.b]);
      for (
        let m = Math.floor((d - 14) / 24);
        m <= Math.floor((f + 14) / 24);
        m++
      )
        for (
          let x = Math.floor((h - 14) / 24);
          x <= Math.floor((p + 14) / 24);
          x++
        ) {
          const g = m + "," + x;
          (n.get(g) || n.set(g, []).get(g)).push(c);
        }
    }
    const s = (c, d, f) => {
        const h = N[f.a],
          p = $[f.a],
          m = N[f.b] - h,
          x = $[f.b] - p,
          g = W(((c - h) * m + (d - p) * x) / (m * m + x * x || 1), 0, 1);
        return Math.hypot(c - h - m * g, d - p - x * g);
      },
      l = (c, d) => {
        for (const f of Ln) {
          if (!f.outer) continue;
          let h = !1;
          const p = f.P;
          for (let m = 0, x = p.length - 1; m < p.length; x = m++)
            p[m][1] > d != p[x][1] > d &&
              c <
                ((p[x][0] - p[m][0]) * (d - p[m][1])) / (p[x][1] - p[m][1]) +
                  p[m][0] &&
              (h = !h);
          if (h) return !0;
        }
        return !1;
      },
      i = xt(41);
    for (const c of ga)
      if (!(c.t > 2 || c.br))
        for (let d = 0; d < c.v.length - 1; d++) {
          const f = c.v[d],
            h = c.v[d + 1],
            p = N[h] - N[f],
            m = $[h] - $[f],
            x = Math.hypot(p, m);
          if (x < 6) continue;
          const g = p / x,
            w = m / x,
            y = -w,
            F = g;
          for (let B = 5 + i() * 5; B < x - 4; B += 11 + i() * 3)
            for (const v of [1, -1]) {
              const R = 13 + i() * 4,
                M = N[f] + g * B + y * R * v,
                A = $[f] + w * B + F * R * v;
              if (
                Math.abs(M) > O.half[0] - 25 ||
                Math.abs(A) > O.half[1] - 25 ||
                Ce(Hn, M, A) < 7.5
              )
                continue;
              let P = !1;
              const L = n.get(a(M, A));
              if (L) {
                for (const Ee of L)
                  if (s(M, A, Ee) < 10) {
                    P = !0;
                    break;
                  }
              }
              if (P) continue;
              const _ = Math.floor(M / 24),
                z = Math.floor(A / 24);
              for (let Ee = _ - 1; Ee <= _ + 1 && !P; Ee++)
                for (let bt = z - 1; bt <= z + 1 && !P; bt++) {
                  const Oe = o.get(Ee + "," + bt);
                  if (Oe) {
                    for (const Je of Oe)
                      if (
                        (e[Je * 6] - M) ** 2 + (e[Je * 6 + 1] - A) ** 2 <
                        100
                      ) {
                        P = !0;
                        break;
                      }
                  }
                }
              if (P || l(M, A)) continue;
              const V = e.length / 6;
              e.push(
                M,
                A,
                Math.atan2(w, g),
                0.85 + 0.3 * i(),
                Ce(C.HM, M, A),
                Ce(C.F, M, A),
              );
              const Ve = a(M, A);
              (o.get(Ve) || o.set(Ve, []).get(Ve)).push(V);
            }
        }
    return Float32Array.from(e);
  })(),
  Te = he.length / 6;
function tn(e, t) {
  let o = 1e18,
    a = 1;
  for (let n = 0; n < ya.length - 1; n++) {
    const [s, l] = ya[n],
      [i, c] = ya[n + 1],
      d = i - s,
      f = c - l,
      h = W(((e - s) * d + (t - l) * f) / (d * d + f * f || 1), 0, 1),
      p = s + d * h - e,
      m = l + f * h - t,
      x = p * p + m * m;
    x < o && ((o = x), (a = d * (t - l) - f * (e - s) > 0 ? 1 : -1));
  }
  return a;
}
const Gn = Oo.towns,
  Fc = tn(
    Gn.find((e) => /Pedreiras/.test(e.n)).x,
    Gn.find((e) => /Pedreiras/.test(e.n)).z,
  ),
  to = Oo.hood.map((e) => ({
    ...e,
    bank: tn(e.x, e.z),
    houses: 0,
    wet: 0,
    iso: 0,
    cx: 0,
    cz: 0,
    label:
      e.n === "Centro"
        ? /Pedreiras/.test(e.town)
          ? "Centro, Pedreiras"
          : "Centro, Trizidela"
        : e.n,
  })),
  tr = new Int16Array(Te),
  Xi = new Int8Array(Te);
for (let e = 0; e < Te; e++) {
  const t = he[e * 6],
    o = he[e * 6 + 1],
    a = tn(t, o);
  Xi[e] = a;
  let n = -1,
    s = 1400 * 1400;
  (to.forEach((l, i) => {
    if (l.bank !== a) return;
    const c = (l.x - t) ** 2 + (l.z - o) ** 2;
    c < s && ((s = c), (n = i));
  }),
    (tr[e] = n),
    n >= 0 && to[n].houses++);
}
const on = new Int32Array(Te);
for (let e = 0; e < Te; e++) on[e] = en(he[e * 6], he[e * 6 + 1], 120);
const _n = Oo.fac.map((e) => ({
    ...e,
    hm: Ce(C.HM, e.x, e.z),
    f: Ce(C.F, e.x, e.z),
    node: en(e.x, e.z, 180),
    st: 0,
  })),
  po = _n.filter(
    (e) =>
      ((e.k === "school" || e.k === "kindergarten") && e.pub) ||
      (e.k === "college" && /IFMA/.test(e.n)) ||
      e.k === "sports",
  ),
  oo = _n.find((e) => e.k === "hospital"),
  Un = _n.find((e) => e.k === "substation"),
  Lc = Gn.map((e) => en(e.x, e.z, 400)),
  Go = new Float64Array(_t),
  Nn = new Int32Array(_t),
  at = new Int32Array(_t),
  Ec = [];
function Ki() {
  at.fill(-1);
  let e = 0;
  for (let t = 0; t < _t; t++) {
    if (at[t] >= 0 || !Ho[t].length) continue;
    const o = [t];
    for (at[t] = e; o.length;) {
      const a = o.pop();
      for (const n of Ho[a]) {
        if (n.st >= 2) continue;
        const s = n.a === a ? n.b : n.a;
        at[s] < 0 && ((at[s] = e), o.push(s));
      }
    }
    e++;
  }
  return e;
}
function Yi(e) {
  (Go.fill(1 / 0), Nn.fill(-1), (Go[e] = 0));
  const t = [0, e],
    o = (n, s) => {
      t.push(n, s);
      let l = t.length / 2 - 1;
      for (; l > 0;) {
        const i = (l - 1) >> 1;
        if (t[i * 2] <= t[l * 2]) break;
        (([t[i * 2], t[l * 2]] = [t[l * 2], t[i * 2]]),
          ([t[i * 2 + 1], t[l * 2 + 1]] = [t[l * 2 + 1], t[i * 2 + 1]]),
          (l = i));
      }
    },
    a = () => {
      const n = t[0],
        s = t[1],
        l = t.length / 2 - 1;
      ((t[0] = t[l * 2]), (t[1] = t[l * 2 + 1]), (t.length -= 2));
      let i = 0;
      for (;;) {
        const c = i * 2 + 1,
          d = c + 1;
        let f = i;
        if (
          (c < l && t[c * 2] < t[f * 2] && (f = c),
          d < l && t[d * 2] < t[f * 2] && (f = d),
          f === i)
        )
          break;
        (([t[f * 2], t[i * 2]] = [t[i * 2], t[f * 2]]),
          ([t[f * 2 + 1], t[i * 2 + 1]] = [t[i * 2 + 1], t[f * 2 + 1]]),
          (i = f));
      }
      return [n, s];
    };
  for (; t.length;) {
    const [n, s] = a();
    if (!(n > Go[s]))
      for (const l of Ho[s]) {
        if (l.st >= 2) continue;
        const i = l.a === s ? l.b : l.a,
          c =
            n +
            l.len * (l.st === 1 ? 2.5 : 1) * (l.t >= 3 ? 1.6 : 1) +
            (l.br && l.t <= 1 ? 1500 : 0);
        c < Go[i] && ((Go[i] = c), (Nn[i] = s), o(c, i));
      }
  }
}
function $n(e, t, o) {
  const a = e - b.s0;
  if (((S.S = e), !t && Math.abs(a - S.lastH) < 0.01 && o === S.dam)) return !1;
  ((S.h = a), (S.lastH = a), (S.dam = o));
  let n = 0,
    s = 0;
  for (const v of yt) {
    let R = -99,
      M = 0;
    const A = v.s,
      P = A.length / 2;
    for (let L = 0; L < A.length; L += 2) {
      const _ = A[L] < a ? a - A[L] + A[L + 1] : a - A[L];
      (_ > R && (R = _), _ > b.roadCut && M++);
    }
    ((v.dmax = R),
      (v.st = R > b.roadCut ? 2 : R > -0.35 ? 1 : 0),
      v.t <= 2 && !v.br && v.inM && ((s += v.len), (n += (v.len * M) / P)));
  }
  for (const v of yt)
    if (v.br) {
      const R = (N[v.a] + N[v.b]) / 2,
        M = ($[v.a] + $[v.b]) / 2;
      let A = 0;
      for (const P of yt) {
        if (P.br || P.t > 2) continue;
        const L = (N[P.a] + N[P.b]) / 2,
          _ = ($[P.a] + $[P.b]) / 2;
        (L - R) ** 2 + (_ - M) ** 2 < 22500 && (A = Math.max(A, P.st));
      }
      v.st = A;
    }
  ((S.cutKm = n / 1e3), (S.roadsKm = s / 1e3));
  const l = Ki();
  let i = 0;
  for (const v of po) {
    const R = v.hm < a ? a - v.hm + v.f : a - v.hm;
    ((v.depth = R),
      (v.st = R > 0 || v.node < 0 ? 2 : R > -1 ? 1 : 0),
      (v.load = 0),
      v.st < 2 && i++);
  }
  ((S.shOpen = i), (S.shAll = po.length));
  const c = new Set(
    po.filter((v) => v.st < 2 && v.node >= 0).map((v) => at[v.node]),
  );
  for (const v of to)
    ((v.wet = 0), (v.iso = 0), (v.cx = 0), (v.cz = 0), (v.deep = 0));
  let d = 0,
    f = 0,
    h = 0,
    p = 0;
  for (let v = 0; v < Te; v++) {
    const R = he[v * 6 + 4],
      M = R < a ? a - R + he[v * 6 + 5] : -1,
      A = to[tr[v]];
    if (M > 0)
      (d++,
        A &&
          (A.wet++,
          (A.cx += he[v * 6]),
          (A.cz += he[v * 6 + 1]),
          (A.deep = Math.max(A.deep, M))));
    else {
      const P = on[v];
      P >= 0 &&
        !c.has(at[P]) &&
        (f++, (h += he[v * 6]), (p += he[v * 6 + 1]), A && A.iso++);
    }
  }
  ((S.wet = d),
    (S.houses = Te),
    (S.people = Math.round(d * b.ppl)),
    (S.iso = f),
    (S.isoPeople = Math.round(f * b.ppl)),
    (S.isoAt = f ? [h / f, p / f] : null));
  for (const v of to) v.wet && ((v.cx /= v.wet), (v.cz /= v.wet));
  S.hoods = to.filter((v) => v.wet > 0).sort((v, R) => R.wet - v.wet);
  const m = new Int32Array(l);
  for (let v = 0; v < Te; v++) {
    const R = on[v];
    R >= 0 && !(he[v * 6 + 4] < a) && m[at[R]]++;
  }
  let x = 0;
  for (let v = 1; v < l; v++) m[v] > m[x] && (x = v);
  S.routes = [];
  for (const v of S.hoods.slice(0, 6)) {
    if (v.wet < 8) break;
    const R = en(
      v.cx,
      v.cz,
      900,
      (L) => c.has(at[L]) && qi(N[L], $[L], a) < -0.2,
    );
    if (R < 0) continue;
    Yi(R);
    let M = null,
      A = 1 / 0;
    for (const L of po) {
      if (L.st >= 2 || L.node < 0) continue;
      const _ = Go[L.node] * (1 + Math.max(0, L.load - b.cap) / b.cap);
      _ < A && ((A = _), (M = L));
    }
    if (!M) continue;
    const P = [];
    for (let L = M.node; L >= 0; L = Nn[L]) P.push([N[L], $[L]]);
    (P.reverse(),
      (M.load += v.wet * b.ppl),
      S.routes.push({
        hood: v,
        shelter: M,
        path: P,
        len: A,
        from: [v.cx, v.cz],
        start: [N[R], $[R]],
      }));
  }
  const g = (v) => {
    if (!v) return null;
    const R = v.hm < a ? a - v.hm + v.f : a - v.hm,
      M = v.node < 0 || at[v.node] !== x;
    return { d: R, cut: M, st: R > 0 ? 2 : M || R > -1 ? 1 : 0 };
  };
  ((S.hosp = g(oo)),
    (S.sub = g(Un)),
    (S.bridge = we ? { st: we.st, nm: we.w.nm } : null));
  let w = 0,
    y = 0;
  const F = C.cx * C.cz,
    B = o ? b.nogoDam : b.nogo;
  for (let v = 0; v < C.HM.length; v++) {
    const R = C.HM[v];
    R < a && R > 0.15 && ((w += F), a - R + C.F[v] > B && (y += F));
  }
  return ((S.area = w / 1e6), (S.nogoArea = y / 1e6), (S.dirty = !0), !0);
}
const Oc = ["vig", "alert", "mobil", "resp", "stab"];
function or(e) {
  return e >= b.crit ? 3 : e >= b.mobil ? 2 : e >= b.alert ? 1 : 0;
}
const _o = 64;
function Uo(e) {
  const o = b.seasonPeak,
    a =
      e < 6 ? 0 : e < 32 ? Zt(6, 32, e) : e < 36 ? 1 : Math.exp(-(e - 36) / 13);
  return 3 + (o - 3) * a;
}
const wt = [-6, 72];
function ar(e) {
  const t = b.damBase,
    o = Math.max(b.damPeak, t),
    a = b.damArrive,
    n = b.damRise;
  return e < a
    ? t
    : e < a + n
      ? t + (o - t) * (0.5 - 0.5 * Math.cos((Math.PI * (e - a)) / n))
      : t + (o - t) * Math.exp(-(e - a - n) / b.damFall);
}
const No = new r.DataTexture(
  C.raw,
  C.nx,
  C.nz,
  r.RGBAFormat,
  r.UnsignedByteType,
);
((No.magFilter = No.minFilter = r.LinearFilter),
  (No.wrapS = No.wrapT = r.ClampToEdgeWrapping),
  (No.needsUpdate = !0));
const xe = 1024,
  qe = Math.round((1024 * be) / ue),
  nr = {},
  Zi = (() => {
    const e = document.createElement("canvas");
    ((e.width = xe), (e.height = qe));
    const t = e.getContext("2d", { willReadFrequently: !0 }),
      o = xe / (2 * O.half[0]),
      a = qe / (2 * O.half[1]),
      n = (w, y) => [(w + O.half[0]) * o, (y + O.half[1]) * a],
      s = (w) => {
        ((t.fillStyle = "#000"),
          t.fillRect(0, 0, xe, qe),
          (t.fillStyle = t.strokeStyle = "#fff"));
        for (const y of Ln) {
          if (!y.outer || !!y.river !== w) continue;
          const F = y.P[0],
            B = y.P[y.P.length - 1];
          Math.hypot(F[0] - B[0], F[1] - B[1]) > 5 ||
            (t.beginPath(),
            y.P.forEach((v, R) => {
              const [M, A] = n(v[0], v[1]);
              R ? t.lineTo(M, A) : t.moveTo(M, A);
            }),
            t.closePath(),
            t.fill());
        }
        return (
          w &&
            ((t.lineWidth = 40 * o),
            (t.lineCap = t.lineJoin = "round"),
            t.beginPath(),
            ya.forEach((y, F) => {
              const [B, v] = n(y[0], y[1]);
              F ? t.lineTo(B, v) : t.moveTo(B, v);
            }),
            t.stroke()),
          t.getImageData(0, 0, xe, qe).data
        );
      },
      l = s(!0),
      i = s(!1),
      c = xe * qe,
      d = new Uint8Array(c);
    for (let w = 0; w < c; w++) d[w] = l[w * 4] > 127 ? 1 : 0;
    const f = (w) => {
        const F = new Float64Array(Math.max(xe, qe)),
          B = new Float64Array(c),
          v = new Int32Array(Math.max(xe, qe)),
          R = new Float64Array(Math.max(xe, qe) + 1),
          M = new Float64Array(Math.max(xe, qe));
        for (let P = 0; P < c; P++) B[P] = w[P] ? 0 : 1e12;
        const A = (P, L, _) => {
          for (let V = 0; V < P; V++) F[V] = L(V);
          let z = 0;
          ((v[0] = 0), (R[0] = -1e12), (R[1] = 1e12));
          for (let V = 1; V < P; V++) {
            let Ve =
              (F[V] + V * V - (F[v[z]] + v[z] * v[z])) / (2 * V - 2 * v[z]);
            for (; Ve <= R[z];)
              (z--,
                (Ve =
                  (F[V] + V * V - (F[v[z]] + v[z] * v[z])) /
                  (2 * V - 2 * v[z])));
            (z++, (v[z] = V), (R[z] = Ve), (R[z + 1] = 1e12));
          }
          z = 0;
          for (let V = 0; V < P; V++) {
            for (; R[z + 1] < V;) z++;
            M[V] = (V - v[z]) ** 2 + F[v[z]];
          }
          for (let V = 0; V < P; V++) _(V, M[V]);
        };
        for (let P = 0; P < xe; P++)
          A(
            qe,
            (L) => B[L * xe + P],
            (L, _) => {
              B[L * xe + P] = _;
            },
          );
        for (let P = 0; P < qe; P++)
          A(
            xe,
            (L) => B[P * xe + L],
            (L, _) => {
              B[P * xe + L] = _;
            },
          );
        return B;
      },
      h = f(d),
      p = f(d.map((w) => 1 - w)),
      m = 1 / o,
      x = new Uint8Array(c * 4);
    for (let w = 0; w < c; w++) {
      const y = d[w] ? -Math.sqrt(p[w]) * m : Math.sqrt(h[w]) * m;
      ((x[w * 4] = W(Math.round(y + 64), 0, 255)),
        (x[w * 4 + 1] = i[w * 4] > 127 ? 255 : 0),
        (x[w * 4 + 3] = 255));
    }
    nr.data = x;
    const g = new r.DataTexture(x, xe, qe, r.RGBAFormat, r.UnsignedByteType);
    return (
      (g.magFilter = g.minFilter = r.LinearFilter),
      (g.needsUpdate = !0),
      g
    );
  })(),
  Ji = (() => {
    const e = new Uint8Array(C.nx * C.nz * 4);
    for (let o = 0; o < C.nx * C.nz; o++)
      ((e[o * 4] = W(Math.round(Hn[o] * 7), 0, 255)), (e[o * 4 + 3] = 255));
    const t = new r.DataTexture(
      e,
      C.nx,
      C.nz,
      r.RGBAFormat,
      r.UnsignedByteType,
    );
    return (
      (t.magFilter = t.minFilter = r.LinearFilter),
      (t.needsUpdate = !0),
      t
    );
  })();
function sr(e, t) {
  const o = W(((e + O.half[0]) / (2 * O.half[0])) * xe - 0.5, 0, xe - 1.001),
    a = W(((t + O.half[1]) / (2 * O.half[1])) * qe - 0.5, 0, qe - 1.001),
    n = o | 0,
    s = a | 0,
    l = o - n,
    i = a - s,
    c = nr.data,
    d = (s * xe + n) * 4;
  return (
    (c[d] * (1 - l) + c[d + 4] * l) * (1 - i) +
    (c[d + xe * 4] * (1 - l) + c[d + xe * 4 + 4] * l) * i -
    64
  );
}
function Ye(e, t) {
  let o = Ce(C.E, e, t);
  const a = sr(e, t);
  if (a < 4) {
    const n = o + Ce(C.F, e, t) - Ce(C.HM, e, t),
      s = W(-a / 16, 0, 1);
    o = Math.min(o, te(n + 0.2, n - 4.2, Math.sqrt(s)));
  }
  return o;
}
const mo = (e, t) => Ce(C.E, e, t) + Ce(C.F, e, t) - Ce(C.HM, e, t),
  Ae = {
    tG: { value: No },
    tS: { value: Zi },
    tU: { value: Ji },
    uGrid: { value: new r.Vector4(C.x0, C.z0, C.cx, C.cz) },
    uGridN: { value: new r.Vector2(C.nx, C.nz) },
    uHalf: { value: new r.Vector2(O.half[0], O.half[1]) },
    uEMin: { value: O.eMin },
    uH: { value: 2 },
    uTime: { value: 0 },
    uNogo: { value: 1 },
    uCut: { value: 0.3 },
    uEnv: { value: -99 },
    uPhase: { value: 0 },
    uWarm: { value: 0 },
    uMode: { value: 2 },
    uAlertH: { value: 1.3 },
    uSec: { value: 0 },
    uSecZ: { value: 0 },
    uEx: { value: 0 },
    uPxK: { value: 0.001 },
  },
  Ut = `uniform sampler2D tG;uniform sampler2D tS;uniform sampler2D tU;uniform vec4 uGrid;uniform vec2 uGridN;uniform vec2 uHalf;uniform float uEMin;uniform float uH;uniform float uTime;
uniform float uNogo;uniform float uCut;uniform float uEnv;uniform float uPhase;uniform float uWarm;uniform int uMode;uniform float uAlertH;uniform float uSec;uniform float uSecZ;uniform float uEx;uniform float uPxK;
uniform float uLift;uniform float uRelief;
#define HXU ${H.toFixed(1)}
#define VZU ${ot.toFixed(1)}
#define C(r,g,b) pow(vec3(r,g,b),vec3(2.2))
vec2 gUV(vec2 pm){return vec2(((pm.x-uGrid.x)/uGrid.z+.5)/uGridN.x,((pm.y-uGrid.y)/uGrid.w+.5)/uGridN.y);}
vec2 sUV(vec2 pm){return pm/(2.*uHalf)+.5;}
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+1.),f.x),f.y);}
// the grid at pm (metres): x elevation, y fill, z HAND to the Mearim, w HAND to any drainage (metres)
vec4 grid(vec2 pm){vec4 t=texture(tG,gUV(pm));return vec4(uEMin+t.r*127.5,t.g*25.5,t.b*25.5,t.a*25.5);}
// the land in metres: the DEM, with the river's low-water channel cut 4 m under its surface inside the mapped banks
float landM(vec2 pm,vec4 g,float sd){float e=g.x;if(sd<4.){float zr=g.x+g.y-g.z,k=clamp(-sd/16.,0.,1.);e=min(e,mix(zr+.2,zr-4.2,sqrt(k)));}return e;}
float sdAt(vec2 pm){return texture(tS,sUV(pm)).r*255.-64.;}
float landY(vec2 p){vec2 pm=p*HXU;vec4 g=grid(pm);return uLift+landM(pm,g,sdAt(pm))/VZU*uRelief;}
// the water: its surface (metres) where this point drains, and whether the flood reaches it (by HAND) or it is the river itself
float waterM(vec4 g){return g.x+g.y-g.z+uH;}
float wetK(vec4 g,float sd){return max(1.-step(uH,g.z),1.-step(0.,sd));}
`,
  Qi = `varying vec3 vP;varying vec3 vN;vec3 tLift=vec3(0.);
vec3 handCol(float ha){return ha<1.?C(.80,.32,.27):ha<5.?C(.91,.58,.29):ha<10.?C(.93,.82,.50):ha<25.?C(.58,.71,.45):C(.37,.52,.66);}
float caust(vec2 p){p+=vec2(uTime*.05,uTime*.03);float a=vn(p*31.+vec2(uTime*.35,0.)),b=vn(p*37.-vec2(0.,uTime*.3)+4.);return pow(max(1.-abs(a-b)*3.2,0.),6.);}`,
  el = `#include <normal_fragment_maps>
 {vec3 P=vP;vec2 pm=P.xz*HXU;vec4 g=grid(pm);vec4 ts=texture(tS,sUV(pm));float sd=ts.r*255.-64.,pond=ts.g;float e=landM(pm,g,sd);
  vec3 sn=normalize(vN);float slope=1.-sn.y,n=h21(floor(pm/12.)),nz=vn(pm/90.)*.6+vn(pm/23.)*.4;float urb=clamp(texture(tU,gUV(pm)).r*255./7./22.,0.,1.);
  vec3 col;int md=uMode;
  if(md==0||md==5){ // City: wet meadows low in the valley, babassu and pasture greens, golden dry grass on the open slopes, darker scrub up the hills, the built-up ground in linen and clay
   vec3 meadow=mix(C(.45,.54,.37),C(.50,.58,.40),n),pasture=mix(C(.57,.60,.44),C(.62,.64,.47),n),dry=mix(C(.71,.66,.52),C(.75,.70,.56),n),scrub=mix(C(.37,.44,.32),C(.41,.48,.35),n);
   col=mix(meadow,pasture,smoothstep(1.5,6.,g.w));col=mix(col,dry,smoothstep(.55,.75,nz)*smoothstep(4.,12.,g.w)*.75);col=mix(col,scrub,clamp(smoothstep(.12,.3,slope)*.7+smoothstep(.62,.8,vn(pm/160.+7.))*.35,0.,1.));
   vec3 town=mix(C(.74,.68,.59),C(.79,.72,.62),n);col=mix(col,town,smoothstep(.25,.8,urb)*.85);
   if(md==5)col=mix(C(.80,.79,.76),C(.86,.83,.78),urb)*(.94+.06*n);}
  else if(md==1){col=handCol(g.w)*(.92+.08*n);}                                             // Risk: HAND classes (< 1, 1\u20135, 5\u201310, 10\u201325, > 25 m)
  else if(md==3){col=mix(C(.17,.20,.26),C(.21,.24,.31),nz);float dr=1.-smoothstep(.05,.9,g.w);col=mix(col,vec3(.25,.75,1.3),dr);}   // Drainage: the channels glow
  else if(md==4){float wk=step(g.z,uH);float d=uH-g.z+g.y;col=mix(C(.86,.87,.88),mix(C(.62,.82,.95),C(.15,.38,.70),smoothstep(.3,3.,d)),wk);}   // the flood's footprint
  else if(md==6){col=mix(C(.20,.23,.29),C(.24,.27,.33),nz);}                                 // the response sheet: dark, the marks light it
  else{col=mix(C(.50,.60,.48),C(.55,.64,.52),nz)*(.96+.04*n);col=mix(col,mix(C(.80,.75,.67),C(.84,.79,.71),n),smoothstep(.25,.75,urb)*.9);}  // Response: a sage planning base, the built-up ground in linen
  if(pond>.5&&md!=4)col=mix(col,C(.22,.40,.42),.85);
  // ten-metre contours on the Risk layer and the planning base
  if(md==1||md==2){float c=abs(fract(e/10.)-.5)*2.,w=fwidth(e/10.)*1.2;col*=1.-.14*(1.-smoothstep(1.-w*2.,1.,c));}
  // the dam scenario's predicted reach: a dashed coral line where HAND equals the crest's height, from the breach until the water gets there
  if(uEnv>-50.&&md!=3){float d=abs(g.z-uEnv),w=fwidth(g.z)*1.6+.04;float dash=step(.45,fract((pm.x+pm.y)/60.-uTime*.3));col=mix(col,vec3(1.,.42,.5),(1.-smoothstep(w*.5,w,d))*dash*step(uH,uEnv-.05));}
  // the bridge's cross-section (the first hologram panel) as a faint line across the valley
  if(uSec>.01){float w=fwidth(pm.y)*1.5;col=mix(col,C(.62,.88,.98),uSec*(1.-smoothstep(w,w*2.,abs(pm.y-uSecZ)))*.5);}
  // under water: darker, cooler, caustics; a dark wet band just above the shoreline
  float wM=waterM(g),wd=wM-e,wk=wetK(g,sd);
  if(uEx<.5)col*=1.-.25*smoothstep(.6,0.,g.z-uH)*step(uH,g.z)*step(0.,sd);
  if(wk>.5&&wd>0.&&uEx<.5){float k=1.-exp(-wd*.5);col=mix(col,col*vec3(.45,.55,.58),k);col+=vec3(.25,.4,.45)*caust(pm/HXU)*.12*exp(-wd*.6);}
  float steep=smoothstep(.45,.85,slope);col=mix(col,col*vec3(.92,.85,.78),steep*.5);
  col=mix(col,col*vec3(1.06,.86,.5)+vec3(.045,.028,0.),uWarm*.6*smoothstep(.1,.35,col.g-col.b));
  diffuseColor.rgb=col;tLift=col*(md==3||md==6?0.:.11);}`,
  tl = `#include <begin_vertex>
 {vec2 pm=transformed.xz*HXU;vec4 g=grid(pm);float sd=sdAt(pm);float e=landM(pm,g,sd);transformed.y=uLift+e/VZU*uRelief;vP=vec3(transformed.x,e,transformed.z);
  float d=.035;vN=normalize(vec3(landY(transformed.xz-vec2(d,0.))-landY(transformed.xz+vec2(d,0.)),2.*d,landY(transformed.xz-vec2(0.,d))-landY(transformed.xz+vec2(0.,d))));}`;
function rr(e, t = 0, o = 1, a = "t") {
  const n = {
      ...Ae,
      uMode: e == null ? Ae.uMode : { value: e },
      uLift: { value: t },
      uRelief: { value: o },
    },
    s = lt(
      new r.MeshStandardMaterial({
        color: 16777215,
        roughness: 0.93,
        metalness: 0,
        flatShading: !0,
        envMapIntensity: 0.16,
      }),
      Object.assign(
        (l) => {
          (Object.assign(l.uniforms, n),
            (l.vertexShader = l.vertexShader
              .replace(
                "#include <common>",
                `#include <common>
` +
                  Ut +
                  "varying vec3 vP;varying vec3 vN;",
              )
              .replace("#include <begin_vertex>", tl)),
            (l.fragmentShader = l.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
` +
                  Ut +
                  Qi,
              )
              .replace("#include <normal_fragment_maps>", el)
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
totalEmissiveRadiance+=tLift;`,
              )));
        },
        { key: "terr" },
      ),
    );
  return ((s.userData.U = n), s);
}
const ol = `#include <begin_vertex>
 transformed.y=landY(transformed.xz);`;
function Vn(e, t = ol, o = "", a = "t") {
  const n = (i) => {
      (Object.assign(i.uniforms, e),
        (i.vertexShader = i.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
` +
              Ut +
              o,
          )
          .replace("#include <begin_vertex>", t)));
    },
    s = new r.MeshDepthMaterial({ depthPacking: r.RGBADepthPacking });
  ((s.onBeforeCompile = n), (s.customProgramCacheKey = () => "dep" + a));
  const l = new r.MeshNormalMaterial({ flatShading: !0 });
  return (
    (l.blending = r.NoBlending),
    (l.onBeforeCompile = n),
    (l.customProgramCacheKey = () => "nrm" + a),
    { dep: s, nrm: l }
  );
}
const Wn = new r.Scene(),
  ir = [];
Wn.matrixWorldAutoUpdate = !1;
function qn(e, t) {
  const o = e.isInstancedMesh
    ? new r.InstancedMesh(e.geometry, t, e.count)
    : new r.Mesh(e.geometry, t);
  return (
    e.isInstancedMesh && (o.instanceMatrix = e.instanceMatrix),
    (o.matrixAutoUpdate = !1),
    (o.frustumCulled = !1),
    Wn.add(o),
    ir.push([e, o]),
    Be.push(e),
    o
  );
}
const lr = (e, t) => {
  let o = t ? e.parent : e;
  for (; o && o.parent; o = o.parent) if (!o.visible) return !1;
  return !!o && o === ke && o.visible;
};
{
  const e = de._renderOverride.bind(de);
  de._renderOverride = (t, o, a, n, s) => {
    if ((e(t, o, a, n, s), o !== de.normalMaterial)) return;
    for (const [i, c] of ir)
      ((c.visible = lr(i, !0) && i.userData.aoOn !== !1),
        c.matrixWorld.copy(i.matrixWorld),
        i.isInstancedMesh && (c.count = i.count));
    const l = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(a),
      t.render(Wn, I),
      (t.autoClear = l));
  };
}
const Mt = new r.Group();
Jt.add(Mt);
const ft = new r.Group();
Mt.add(ft);
function cr(e, t, o = 0.7) {
  const a = new r.PlaneGeometry(2 * ue, 2 * be, e, t);
  a.rotateX(-Math.PI / 2);
  const n = a.attributes.position,
    s = (2 * ue) / e,
    l = (2 * be) / t;
  for (let i = 0; i < n.count; i++) {
    const c = n.getX(i),
      d = n.getZ(i);
    Math.abs(Math.abs(c) - ue) < 1e-4 ||
      Math.abs(Math.abs(d) - be) < 1e-4 ||
      (n.setX(i, c + (Et(i * 1.37) - 0.5) * s * o),
      n.setZ(i, d + (Et(i * 2.11 + 5) - 0.5) * l * o));
  }
  return (a.computeBoundingSphere(), (a.boundingSphere.radius = 9), a);
}
const al = (() => {
  const e = new r.Mesh(
    cr(Math.round((2 * O.half[0]) / 20), Math.round((2 * O.half[1]) / 20)),
    rr(null),
  );
  ((e.castShadow = e.receiveShadow = !0), (e.frustumCulled = !1));
  const { dep: t, nrm: o } = Vn(e.material.userData.U);
  return ((e.customDepthMaterial = t), ft.add(e), qn(e, o), _e.push(e), e);
})();
var dr = { value: 0.06 };
const nl = `#include <normal_fragment_maps>
 {vec3 P=vTP;vec2 pm=P.xz*HXU;vec4 g=grid(pm);float y=P.y*VZU,u=(P.x+P.z)*HXU,sd=sdAt(pm),e=vSurf,wM=waterM(g);vec3 c;
  float alu=smoothstep(8.,3.,g.w)*smoothstep(e-14.,e-3.,y);
  if(y>e+.05){float k=vn(vec2(u/40.-uTime*.6,y*3.))*.6+vn(vec2(u/14.-uTime*.9,y*7.))*.4;c=mix(vec3(.10,.30,.40),vec3(.24,.52,.58),k)*(.8+.2*smoothstep(e,wM,y));
   totalEmissiveRadiance+=c*.45+vec3(.4,.7,.8)*smoothstep(.62,.8,k)*.18;}
  else if(y<12.){vec2 q=vec2(u/22.+vn(vec2(y*.6,u/40.))*.6,y*.55);q.x+=floor(q.y)*.47;vec2 f=fract(q);float mo=clamp(step(f.x,.03)+step(f.y,.06),0.,1.);
   c=mix(vec3(.38,.37,.38),vec3(.52,.50,.48),h21(floor(q)))*(1.-.4*mo);}
  else{float w=y*.42+(vn(vec2(u/60.,y*.1))-.5)*1.4,i=floor(w),r=h21(vec2(i,7.1));
   c=r<.3?vec3(.66,.42,.28):r<.55?vec3(.78,.62,.46):r<.8?vec3(.72,.54,.40):vec3(.58,.36,.25);
   c=mix(c,mix(vec3(.46,.44,.40),vec3(.58,.55,.50),h21(floor(vec2(u,y)*.5))),alu*.85);
   c*=.9+.14*h21(floor(vec2(u/3.,y*2.)));}
  if(y<=e+.05){c=mix(c,vec3(.33,.25,.18),smoothstep(e-2.5,e-1.,y));c=mix(c,vec3(.42,.52,.28),smoothstep(e-.7,e-.2,y)*step(wM+.4,e));}
  diffuseColor.rgb=c;}`,
  Bc = (() => {
    const e = [],
      t = [],
      o = [],
      a = Math.round((2 * O.half[0]) / 20),
      n = Math.round((2 * O.half[1]) / 20),
      s = (g, w, y, F, B) => {
        const v = e.length / 3;
        for (let R = 0; R <= B; R++) {
          const M = te(g, y, R / B),
            A = te(w, F, R / B);
          (e.push(M, 0, A, M, 0, A), t.push(0, 1));
        }
        for (let R = 0; R < B; R++) {
          const M = v + R * 2;
          o.push(M, M + 2, M + 3, M, M + 3, M + 1);
        }
      };
    (s(-ue, be, ue, be, a),
      s(ue, be, ue, -be, n),
      s(ue, -be, -ue, -be, a),
      s(-ue, -be, -ue, be, n));
    const l = new r.BufferGeometry();
    (l.setAttribute("position", new r.Float32BufferAttribute(e, 3)),
      l.setAttribute("aTop", new r.Float32BufferAttribute(t, 1)),
      l.setIndex(o),
      l.computeBoundingSphere(),
      (l.boundingSphere.radius = 9));
    const i = { ...Ae, uLift: { value: 0 }, uRelief: { value: 1 } },
      c =
        "varying vec3 vTP;varying float vSurf;attribute float aTop;uniform float uSkBot;",
      d = `#include <begin_vertex>
 {vec2 pm=transformed.xz*HXU;vec4 g=grid(pm);float sd=sdAt(pm),e=landM(pm,g,sd);vSurf=e;float top=max(e,wetK(g,sd)>.5?waterM(g):e);transformed.y=aTop>.5?top/VZU:uSkBot;vTP=transformed;}`,
      f = lt(
        new r.MeshStandardMaterial({
          color: 16777215,
          roughness: 0.9,
          metalness: 0,
          flatShading: !0,
          envMapIntensity: 0.4,
        }),
        Object.assign(
          (g) => {
            (Object.assign(g.uniforms, i, { uSkBot: dr }),
              (g.vertexShader = g.vertexShader
                .replace(
                  "#include <common>",
                  `#include <common>
` +
                    Ut +
                    c,
                )
                .replace("#include <begin_vertex>", d)),
              (g.fragmentShader = g.fragmentShader
                .replace(
                  "#include <common>",
                  `#include <common>
` +
                    Ut +
                    "varying vec3 vTP;varying float vSurf;",
                )
                .replace("#include <normal_fragment_maps>", nl)));
          },
          { key: "skirt" },
        ),
      ),
      h = new r.Mesh(l, f);
    ((h.castShadow = h.receiveShadow = !0), (h.frustumCulled = !1));
    const p = `#include <begin_vertex>
 {vec2 pm=transformed.xz*HXU;vec4 g=grid(pm);float sd=sdAt(pm),e=landM(pm,g,sd);float top=max(e,wetK(g,sd)>.5?waterM(g):e);transformed.y=aTop>.5?top/VZU:uSkBot;}`,
      { dep: m, nrm: x } = Vn(
        i,
        p,
        "attribute float aTop;uniform float uSkBot;",
        "sk",
      );
    for (const g of [m, x]) {
      const w = g.onBeforeCompile;
      g.onBeforeCompile = (y) => {
        (w(y), (y.uniforms.uSkBot = dr));
      };
    }
    return ((h.customDepthMaterial = m), ft.add(h), qn(h, x), _e.push(h), h);
  })();
{
  const e = new r.Mesh(
    new r.PlaneGeometry(2 * ue, 2 * be).rotateX(Math.PI / 2),
    K("#3a3530", { roughness: 0.9 }),
  );
  ((e.position.y = 0.06), ft.add(e));
}
const sl = `#include <normal_fragment_maps>
 vec3 wEm=vec3(0.);{vec2 pm=vWP.xz*HXU;vec4 g=grid(pm);float sd=sdAt(pm);if(wetK(g,sd)<.5)discard;float e=landM(pm,g,sd),wM=waterM(g),d=wM-e;if(d<=0.)discard;
  float land=step(0.,sd),dm=land>.5?uH-g.z+g.y:d;   // the model's depth over land; the channel's own depth in the river
  float k=1.-exp(-d*.55);vec3 wc;
  if(uMode==1){wc=mix(C(.62,.86,.98),C(.10,.36,.70),smoothstep(.2,3.,d));}
  else{wc=mix(C(.42,.62,.62),C(.14,.38,.46),smoothstep(.3,3.5,d));wc=mix(wc,C(.55,.50,.38),.2*(.4+.6*smoothstep(.5,4.,uH)));}
  // the current in the channel: streaks along the river (its direction from the banks' distance field), drifting downstream (north) faster as it rises
  float flow=0.;if(sd<6.){float sx=sdAt(pm+vec2(9.,0.))-sdAt(pm-vec2(9.,0.)),sz=sdAt(pm+vec2(0.,9.))-sdAt(pm-vec2(0.,9.));vec2 ac=normalize(vec2(sx,sz)+1e-5),al=vec2(-ac.y,ac.x);if(al.y>0.)al=-al;
   float s=dot(pm,al),c=dot(pm,ac),sp=.9+.35*max(uH,0.);flow=smoothstep(.6,.9,vn(vec2(s/38.-uTime*sp,c/5.)))*.8+smoothstep(.72,.95,vn(vec2(s/16.-uTime*sp*1.3,c/2.5+7.)))*.5;flow*=1.-land;}
  float edge=land*(1.-smoothstep(0.,fwidth(dm)*2.5+.02,dm));                 // the shoreline: a line a couple of pixels wide
  float nogo=uMode==2?land*step(uNogo,dm):0.;float hatch=step(.5,fract((pm.x-pm.y)/26.));
  diffuseColor.rgb=wc;diffuseColor.a=clamp(mix(.55,.93,k),0.,1.)*smoothstep(0.,.06,d);
  diffuseColor.a=max(diffuseColor.a,edge*step(.5,uPhase)*.9);
  wEm=(wc*(.5+.35*k)+vec3(.45,.75,.85)*flow*.22+vec3(.75,.95,1.)*edge*.75*step(.5,uPhase)+vec3(1.,.36,.46)*nogo*hatch*.5)*diffuseColor.a;
  diffuseColor.rgb=mix(diffuseColor.rgb,C(.95,.42,.48),nogo*hatch*.5);
  vec2 gr=(vec2(vn(pm/9.+uTime*.5),vn(pm/11.-uTime*.4))-.5)*.12;normal=normalize(normal+(viewMatrix*vec4(gr.x,0.,gr.y,0.)).xyz);}`,
  rl = lt(
    new r.MeshPhysicalMaterial({
      color: 16777215,
      transparent: !0,
      roughness: 0.12,
      metalness: 0,
      envMapIntensity: 0.55,
      ior: 1.33,
      depthWrite: !1,
      blending: r.CustomBlending,
      blendSrc: r.OneFactor,
      blendDst: r.OneMinusSrcAlphaFactor,
      specularIntensity: 0.9,
    }),
    Object.assign(
      (e) => {
        (Object.assign(e.uniforms, Ae, {
          uLift: { value: 0 },
          uRelief: { value: 1 },
        }),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` +
                Ut +
                "varying vec3 vWP;",
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
 {vec2 pm=transformed.xz*HXU;vec4 g=grid(pm);transformed.y=waterM(g)/VZU+.0025;vWP=transformed;}`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
` +
                Ut +
                "varying vec3 vWP;",
            )
            .replace("#include <normal_fragment_maps>", sl)
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
totalEmissiveRadiance+=wEm;`,
            )
            .replace(
              "outgoingLight=max(mix(",
              `outgoingLight=(reflectedLight.directDiffuse+reflectedLight.indirectDiffuse)*diffuseColor.a*.3+min((reflectedLight.directSpecular+reflectedLight.indirectSpecular)*.22,vec3(.35))+totalEmissiveRadiance;
 outgoingLight=max(mix(`,
            )));
      },
      { key: "water" },
    ),
  ),
  fr = (() => {
    const e = new r.PlaneGeometry(
      2 * ue - 0.004,
      2 * be - 0.004,
      Math.round(O.half[0] / 15),
      Math.round(O.half[1] / 15),
    );
    e.rotateX(-Math.PI / 2);
    const t = new r.Mesh(e, rl);
    return (
      (t.renderOrder = 2),
      (t.frustumCulled = !1),
      ft.add(t),
      Be.push(t),
      _e.push(t),
      t
    );
  })(),
  wa = (() => {
    const e = new r.BoxGeometry(1, 1, 1).translate(0, 0.5, 0).toNonIndexed(),
      t = e.attributes.position.array,
      o = e.attributes.normal.array,
      a = [];
    for (let y = 0; y < 36; y++) (y >= 18 && y < 24) || a.push(y);
    const n = new r.BufferGeometry();
    (n.setAttribute(
      "position",
      new r.Float32BufferAttribute(
        a.flatMap((y) => [t[y * 3], t[y * 3 + 1], t[y * 3 + 2]]),
        3,
      ),
    ),
      n.setAttribute(
        "normal",
        new r.Float32BufferAttribute(
          a.flatMap((y) => [o[y * 3], o[y * 3 + 1], o[y * 3 + 2]]),
          3,
        ),
      ));
    const s = new r.ConeGeometry(0.78, 0.5, 4, 1, !0)
        .rotateY(Math.PI / 4)
        .scale(1, 1, 1.1)
        .translate(0, 1.25, 0)
        .toNonIndexed(),
      l = (y, F) => {
        for (const B of Object.keys(y.attributes))
          ["position", "normal"].includes(B) || y.deleteAttribute(B);
        return (
          y.setAttribute(
            "aPart",
            new r.Float32BufferAttribute(
              new Float32Array(y.attributes.position.count).fill(F),
              1,
            ),
          ),
          y
        );
      },
      i = new r.InstancedBufferGeometry().copy(wn([l(n, 0), l(s, 1)])),
      c = new Float32Array(Te * 4),
      d = new Float32Array(Te * 4);
    for (let y = 0; y < Te; y++)
      (c.set(
        [he[y * 6] / H, he[y * 6 + 1] / H, he[y * 6 + 2], he[y * 6 + 3]],
        y * 4,
      ),
        d.set([Et(y * 7.13 + 0.3), he[y * 6 + 4], he[y * 6 + 5], 0], y * 4));
    i.setAttribute("aI", new r.InstancedBufferAttribute(c, 4));
    const f = new r.InstancedBufferAttribute(d, 4);
    (f.setUsage(r.DynamicDrawUsage),
      i.setAttribute("aJ", f),
      (i.instanceCount = Te));
    const h = {
        ...Ae,
        uLift: { value: 0 },
        uRelief: { value: 1 },
        uHMode: { value: 2 },
      },
      p =
        "attribute vec4 aI;attribute vec4 aJ;attribute float aPart;varying float vPart;varying float vD;varying float vSeed;varying float vIso;",
      m = `#include <begin_vertex>
 {vec2 P=aI.xy;vec2 pm=P*HXU;vec4 g=grid(pm);float sd=sdAt(pm);float e=landM(pm,g,sd);float y0=uLift+e/VZU*uRelief;
  float d=uH>aJ.y?uH-aJ.y+aJ.z:uH-aJ.y;vD=d;vSeed=aJ.x;vIso=aJ.w;vPart=aPart;
  float wallH=.011,roofH=.0065,fw=.0141*aI.w,fd=.0172*aI.w,yw=uLift+waterM(g)/VZU*uRelief;
  float top=max(y0+wallH,d>0.?yw+wallH*.4:0.);
  vec3 q=transformed;float yy=q.y<=1.001?mix(y0-.004,top,q.y):top+(q.y-1.)*2.*roofH;
  float c=cos(aI.z),s=sin(aI.z);vec2 xz=vec2(q.x*fw,q.z*fd);xz=vec2(c*xz.x-s*xz.y,s*xz.x+c*xz.y);transformed=vec3(P.x+xz.x,yy,P.y+xz.y);}`,
      x = (y) => {
        (Object.assign(y.uniforms, h),
          (y.vertexShader = y.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` +
                Ut +
                p,
            )
            .replace("#include <begin_vertex>", m)));
      },
      g = lt(
        new r.MeshStandardMaterial({
          color: 16777215,
          roughness: 0.75,
          metalness: 0,
          flatShading: !0,
          envMapIntensity: 0.35,
        }),
        Object.assign(
          (y) => {
            (x(y),
              (y.uniforms.uHMode = h.uHMode),
              (y.fragmentShader = y.fragmentShader
                .replace(
                  "#include <common>",
                  `#include <common>
#define C(r,g,b) pow(vec3(r,g,b),vec3(2.2))
varying float vPart;varying float vD;varying float vSeed;varying float vIso;uniform int uMode;uniform int uHMode;uniform float uWarm;`,
                )
                .replace(
                  "#include <color_fragment>",
                  `#include <color_fragment>
 vec3 hEm=vec3(0.);{vec3 wall,roof;float s=vSeed;
  if(uHMode==0){wall=s<.3?C(.95,.93,.88):s<.5?C(.94,.86,.66):s<.65?C(.80,.87,.89):s<.8?C(.90,.82,.74):C(.80,.86,.74);
   float r=fract(s*7.3);roof=r<.58?mix(C(.66,.40,.31),C(.72,.47,.36),r/.58):r<.86?mix(C(.58,.60,.61),C(.66,.67,.68),(r-.58)/.28):C(.82,.80,.76);}   // clay tile, fibre-cement, a few light roofs
  else if(uHMode==1){wall=C(.90,.90,.89);roof=C(.83,.83,.83);}
  else{wall=C(.86,.87,.88);roof=C(.78,.80,.82);
   if(vD>0.){roof=mix(C(.99,.55,.56),C(.93,.25,.36),smoothstep(.3,1.5,vD));wall=roof*.8;hEm=roof*.32;}
   else if(vIso>.5){roof=C(1.,.74,.32);wall=roof*.85;hEm=roof*.22;}}
  diffuseColor.rgb=vPart<.5?wall:roof;diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.1,.94,.7),uWarm*.6);}`,
                )
                .replace(
                  "#include <emissivemap_fragment>",
                  `#include <emissivemap_fragment>
totalEmissiveRadiance+=hEm;`,
                )));
          },
          { key: "house" },
        ),
      ),
      w = new r.InstancedMesh(i, g, Te);
    for (let y = 0; y < Te; y++) w.setMatrixAt(y, Fo.identity());
    return (
      (w.frustumCulled = !1),
      (w.castShadow = !1),
      (w.receiveShadow = !0),
      ft.add(w),
      Be.push(w),
      _e.push(w),
      (w.userData.U = h),
      (w.userData.j = f),
      w
    );
  })(),
  il = [7, 5.5, 4.2, 3, 2.2, 3.5],
  jn = (() => {
    const e = [],
      t = [],
      o = [],
      a = [],
      n = [],
      s = [],
      l = [],
      i = [];
    for (const x of yt) {
      if (x.t === 5) continue;
      const g = N[x.a],
        w = $[x.a],
        y = N[x.b],
        F = $[x.b],
        B = x.len,
        v = (y - g) / B,
        R = (F - w) / B,
        M = Math.max(1, Math.ceil(B / 12));
      {
        const _ = -O.half[0] + 4,
          z = O.half[0] - 4,
          V = -O.half[1] + 4,
          Ve = O.half[1] - 4,
          Ee = y - g,
          bt = F - w;
        let Oe = 0,
          Je = 1;
        for (const [sa, Fa] of [
          [-Ee, g - _],
          [Ee, z - g],
          [-bt, w - V],
          [bt, Ve - w],
        ]) {
          if (Math.abs(sa) < 1e-9) {
            if (Fa < 0) {
              Oe = 2;
              break;
            }
            continue;
          }
          const Pt = Fa / sa;
          if (sa < 0) {
            if (Pt > Je) {
              Oe = 2;
              break;
            }
            Pt > Oe && (Oe = Pt);
          } else {
            if (Pt < Oe) {
              Oe = 2;
              break;
            }
            Pt < Je && (Je = Pt);
          }
        }
        if (Oe >= Je) continue;
        var c = g + Ee * Oe,
          d = w + bt * Oe,
          f = g + Ee * Je,
          h = w + bt * Je;
      }
      const A = x.br
          ? Math.max(
              Ye(g, w),
              Ye(y, F),
              mo((g + y) / 2, (w + F) / 2) + Bo.extreme - Bo.s0,
            ) + 1.2
          : -999,
        P = Math.max(1, Math.ceil(Math.hypot(f - c, h - d) / 12)),
        L = e.length / 3;
      for (let _ = 0; _ <= P; _++) {
        const z = _ / P,
          V = te(c, f, z),
          Ve = te(d, h, z);
        for (const Ee of [-1, 1])
          (e.push(V / H, 0, Ve / H),
            t.push(Ee),
            o.push(v, R),
            a.push(il[x.t] * (x.br ? 1.3 : 1)),
            n.push(x.t + (x.br ? 10 : 0)),
            s.push(A),
            i.push(x.id));
      }
      for (let _ = 0; _ < P; _++) {
        const z = L + _ * 2;
        l.push(z, z + 2, z + 1, z + 1, z + 2, z + 3);
      }
    }
    const p = new r.BufferGeometry();
    (p.setAttribute("position", new r.Float32BufferAttribute(e, 3)),
      p.setAttribute("aSide", new r.Float32BufferAttribute(t, 1)),
      p.setAttribute("aDir", new r.Float32BufferAttribute(o, 2)),
      p.setAttribute("aW", new r.Float32BufferAttribute(a, 1)),
      p.setAttribute("aT", new r.Float32BufferAttribute(n, 1)),
      p.setAttribute("aDeck", new r.Float32BufferAttribute(s, 1)));
    const m = new r.Float32BufferAttribute(new Float32Array(t.length), 1);
    return (
      m.setUsage(r.DynamicDrawUsage),
      p.setAttribute("aS", m),
      p.setIndex(l),
      (p.userData.segOf = Int32Array.from(i)),
      p
    );
  })();
function ur(e) {
  const t = {
    ...Ae,
    uLift: { value: 0 },
    uRelief: { value: 1 },
    uRMode: { value: e },
  };
  return new r.ShaderMaterial({
    uniforms: t,
    polygonOffset: !0,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -4,
    vertexShader: `${Ut}attribute float aSide;attribute vec2 aDir;attribute float aW;attribute float aT;attribute float aDeck;attribute float aS;uniform int uRMode;
   varying float vS;varying float vT;varying float vSide;varying float vD;varying float vFog;
   void main(){vec2 P=position.xz,nr=vec2(-aDir.y,aDir.x);vec4 wp=modelMatrix*vec4(P.x,.8,P.y,1.);float dist=length(cameraPosition-wp.xyz);
    float t=mod(aT,10.),px=uRMode==2?(aS>1.5?3.4:aS>.5?2.6:1.5):(t<.5?1.6:1.2);
    float hw=max(aW*1.6/HXU,dist*uPxK*px*.5);vec2 Q=P+nr*aSide*hw;vec2 pm=Q*HXU;vec4 g=grid(pm);float sd=sdAt(pm);float e=landM(pm,g,sd);
    float y=aDeck>-900.?aDeck:e;vS=aS;vT=aT;vSide=aSide;vD=uH-g.z+g.y;
    vec4 mv=modelViewMatrix*vec4(Q.x,uLift+y/VZU*uRelief+.0022,Q.y,1.);vFog=-mv.z;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform int uRMode;uniform float uPhase;varying float vS;varying float vT;varying float vSide;varying float vD;varying float vFog;
   void main(){float t=mod(vT,10.),br=step(9.5,vT);vec3 c;float edge=1.-smoothstep(.55,1.,abs(vSide));
    if(uRMode==0){c=t<.5?vec3(.09,.09,.1):t<1.5?vec3(.14,.14,.14):t<2.5?vec3(.2,.19,.18):t<3.5?vec3(.24,.22,.2):vec3(.36,.27,.17);if(br>.5)c=vec3(.42,.41,.4);}
    else if(uRMode==1){c=vec3(.82,.81,.79)*(t<1.5?1.:.8);}
    else{c=vS>1.5?vec3(1.7,.34,.46):vS>.5?vec3(1.55,.9,.3):(uRMode==3?vec3(.42,.55,.66):vec3(.12,.19,.26)*(t<1.5?.8:1.));if(br>.5&&vS<.5)c=vec3(.5,1.05,1.35);}
    gl_FragColor=vec4(c*(.82+.18*edge),1.);}`,
  });
}
const St = new r.Mesh(jn, ur(2));
((St.frustumCulled = !1),
  (St.renderOrder = 1),
  ft.add(St),
  Be.push(St),
  _e.push(St));
const ao = new r.Mesh(jn, ur(0));
((ao.frustumCulled = !1),
  (ao.visible = !1),
  ft.add(ao),
  Be.push(ao),
  _e.push(ao));
function Xn() {
  const e = jn,
    t = e.userData.segOf,
    o = e.attributes.aS.array;
  for (let a = 0; a < t.length; a++) o[a] = yt[t[a]].st;
  e.attributes.aS.needsUpdate = !0;
}
const an = [
    ...po.map((e) => ({ f: e, kind: "shelter" })),
    ...(oo ? [{ f: oo, kind: "hosp" }] : []),
    ...(Un ? [{ f: Un, kind: "sub" }] : []),
  ],
  Ma = new r.InstancedMesh(
    new r.CylinderGeometry(0.0045, 0.0045, 1, 6).translate(0, 0.5, 0),
    K("#c9ced8", { roughness: 0.4 }),
    an.length,
  ),
  Nt = new r.InstancedMesh(
    new r.OctahedronGeometry(0.026, 0),
    new r.MeshBasicMaterial({ color: 16777215, fog: !1 }),
    an.length,
  );
((Ma.frustumCulled = Nt.frustumCulled = !1),
  ft.add(Ma, Nt),
  _e.push(Ma, Nt),
  Be.push(Nt),
  an.forEach((e) => {
    e.e = Ye(e.f.x, e.f.z);
  }));
const ll = {
  open: new r.Color(0.2, 0.95, 0.5),
  risk: new r.Color(1.25, 0.75, 0.12),
  lost: new r.Color(1.2, 0.16, 0.26),
  hosp: new r.Color(1.3, 1.3, 1.35),
  sub: new r.Color(1.2, 1, 0.15),
};
function cl(e, t, o) {
  let n = 0;
  for (const s of an) {
    const l = e + (s.e / ot) * t,
      i = s.f.x / H,
      c = s.f.z / H,
      d = o ? 1 : 0;
    (Fo.compose(hr.set(i, l, c), Lo.identity(), pr.set(d, 0.15 * d, d)),
      Ma.setMatrixAt(n, Fo));
    const f =
      s.kind === "shelter"
        ? s.f.st === 2
          ? "lost"
          : s.f.st === 1
            ? "risk"
            : "open"
        : s.kind;
    (Fo.compose(
      hr.set(i, l + 0.15 * d, c),
      Lo.identity(),
      pr.set(d, d * 1.25, d),
    ),
      Nt.setMatrixAt(n, Fo),
      Nt.setColorAt(n, ll[f]),
      n++);
  }
  ((Ma.instanceMatrix.needsUpdate = Nt.instanceMatrix.needsUpdate = !0),
    Nt.instanceColor && (Nt.instanceColor.needsUpdate = !0));
}
const hr = new r.Vector3(),
  pr = new r.Vector3(),
  Hc = Pi(ma, 0, 0, 0, 2 * ue + 1.6, 2 * be + 1.6, 0.5),
  $o = { z: -1.84, base: 0.16, H: 0.78 },
  no = new r.Group();
(Jt.add(no), no.position.set(0, Qa.top, $o.z));
const mr = lt(
    new r.MeshStandardMaterial({
      color: "#e9f7ff",
      transparent: !0,
      roughness: 0.05,
      metalness: 0,
      envMapIntensity: 1.25,
      depthWrite: !1,
      blending: r.CustomBlending,
      blendSrc: r.OneFactor,
      blendDst: r.OneMinusSrcAlphaFactor,
    }),
    Object.assign(
      (e) => {
        e.fragmentShader = e.fragmentShader
          .replace(
            "#include <normal_fragment_maps>",
            `#include <normal_fragment_maps>
{float fr=pow(1.-abs(dot(normalize(normal),normalize(vViewPosition))),3.);diffuseColor.a=.035+.3*fr;}`,
          )
          .replace(
            "outgoingLight=max(mix(",
            `outgoingLight=(reflectedLight.directDiffuse+reflectedLight.indirectDiffuse)*diffuseColor.a+(reflectedLight.directSpecular+reflectedLight.indirectSpecular)*.8;
 outgoingLight=max(mix(`,
          );
      },
      { key: "pane" },
    ),
  ),
  Kn = Re("#d8f3ff", 0.8);
{
  const e = $o.base,
    t = $o.H,
    o = ue + 0.035,
    a = be + 0.035,
    n = ve(),
    s = me("#2a2f37", { roughness: 0.38 });
  n.box(s, 0, e / 2, 0, 2 * o + 0.34, e, 2 * a + 0.34, { r: 0.04 }).box(
    me("#5d646f", { roughness: 0.3 }),
    0,
    e - 0.012,
    0,
    2 * o + 0.1,
    0.03,
    2 * a + 0.1,
    { r: 0.01 },
  );
  for (const [d, f] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ])
    n.box(
      ca,
      d * (o + 0.03),
      e + t / 2 + 0.03,
      f * (a + 0.03),
      0.1,
      t + 0.06,
      0.1,
      { r: 0.015 },
    );
  n.flush(no);
  const l = (d, f, h, p, m, x) => {
    const g = new r.Mesh(new r.PlaneGeometry(d, f), mr);
    return (
      g.position.set(h, p, m),
      (g.rotation.y = x),
      (g.renderOrder = 3),
      no.add(g),
      Be.push(g),
      g
    );
  };
  (l(2 * o, t, 0, e + t / 2, a, 0),
    l(2 * o, t, 0, e + t / 2, -a, Math.PI),
    l(2 * a, t, -o, e + t / 2, 0, -Math.PI / 2),
    l(2 * a, t, o, e + t / 2, 0, Math.PI / 2));
  const i = ve();
  for (const d of [-a, a]) i.box(Kn, 0, e + t, d, 2 * o, 0.008, 0.008);
  for (const d of [-o, o]) i.box(Kn, d, e + t, 0, 0.008, 0.008, 2 * a);
  for (const [d, f] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ])
    i.box(Kn, d * o, e + t / 2, f * a, 0.01, t, 0.01);
  i.flush(no, !1);
  const c = new r.Mesh(
    new r.BoxGeometry(2 * o + 0.2, 0.04, 0.04),
    Re("#ffab55", 3.6),
  );
  (c.position.set(0, 0.05, a + 0.18),
    no.add(c),
    Qt(0, 0.4, a + 1, "#ffab55", 4, 0.6));
}
const Pe = { x: -ue - 0.66, z: 0.55, y0: 0.24, mPerU: 1 / 0.125, max: 12 },
  kt = new r.Group();
(kt.position.set(Pe.x, $o.base, Pe.z), no.add(kt));
const dl = (e) => Pe.y0 + W(e, 0, Pe.max) / Pe.mPerU;
let Sa;
{
  const e = ve(),
    t = Pe.y0 + Pe.max / Pe.mPerU + 0.12;
  (e
    .box(
      me("#7d858f", { roughness: 0.3, metalness: 0.9 }),
      0,
      0.05,
      0,
      0.5,
      0.1,
      0.42,
      { r: 0.03 },
    )
    .box(ca, 0, t / 2, -0.09, 0.2, t, 0.06, { r: 0.02 }),
    e
      .cyl(ja, 0, t + 0.02, 0.03, 0.075, 0.075, 0.04, { seg: 24 })
      .cyl(ja, 0, 0.13, 0.03, 0.075, 0.075, 0.06, { seg: 24 }),
    e.flush(kt));
  const o = new r.Mesh(
    new r.CylinderGeometry(0.06, 0.06, t - 0.1, 32, 1, !0),
    mr,
  );
  (o.position.set(0, 0.1 + (t - 0.1) / 2, 0.03),
    kt.add(o),
    Be.push(o),
    (Sa = fa(
      0.32,
      t - 0.06,
      192,
      Math.round((192 * (t - 0.06)) / 0.32),
      null,
      1.15,
      { alphaTest: 0.1 },
    )),
    Sa.position.set(0, (t - 0.06) / 2 + 0.03, -0.055),
    kt.add(Sa),
    _e.push(Sa),
    (Pe.H = t));
}
const Vo = new r.Mesh(
  new r.CylinderGeometry(0.052, 0.052, 1, 24),
  new r.MeshStandardMaterial({
    color: "#2e8fd8",
    emissive: "#1d5fa8",
    emissiveIntensity: 0.9,
    transparent: !0,
    opacity: 0.8,
    roughness: 0.1,
    depthWrite: !1,
  }),
);
(Vo.position.set(0, 0, 0.03), kt.add(Vo), Be.push(Vo));
const ut = new r.Group();
kt.add(ut);
{
  const e = new r.Mesh(
    new r.TorusGeometry(0.085, 0.014, 10, 40),
    Re("#ffffff", 2.4),
  );
  ((e.rotation.x = Math.PI / 2), ut.add(e), (ut.userData.ring = e));
  const t = new r.Mesh(
    new r.CylinderGeometry(0.065, 0.065, 0.035, 24),
    me("#e9eef5", { roughness: 0.2, metalness: 0.9 }),
  );
  ut.add(t);
  const o = new r.Mesh(
    new r.CylinderGeometry(0.16, 0.16, 0.16, 12),
    new r.MeshBasicMaterial({ visible: !1 }),
  );
  (ut.add(o), (ut.userData.hit = o), (ut.position.z = 0.03));
}
function nn() {
  const e = Pe.H - 0.06,
    t = 192,
    o = Math.round((192 * e) / 0.32),
    a = o / e / Pe.mPerU,
    n = o - ((Pe.y0 - 0.03) / e) * o;
  Sa.userData.redraw((s, l, i) => {
    ((s.fillStyle = "#e9e4d8"), Xa(s, 4, 4, l - 8, i - 8, 10), s.fill());
    const c = (d, f, h) => {
      ((s.fillStyle = h), s.fillRect(l - 46, n - f * a, 30, (f - d) * a));
    };
    (c(0, b.alert, "#5fbf8c"),
      c(b.alert, b.mobil, "#f2c14e"),
      c(b.mobil, b.crit, "#f39a4a"),
      c(b.crit, b.extreme, "#e85d75"),
      c(b.extreme, Pe.max, "#a970e0"),
      (s.fillStyle = "#1b2030"));
    for (let d = 0; d <= Pe.max * 10; d++) {
      const f = n - (d / 10) * a,
        h = d % 10 ? (d % 5 ? 16 : 26) : 40;
      s.fillRect(14, f - 1.5, h, 3);
    }
    ((s.font = "600 30px DM Mono, monospace"), (s.textAlign = "left"));
    for (let d = 0; d <= Pe.max; d += 1)
      d % 2 || s.fillText(String(d), 62, n - d * a + 10);
    for (const d of On) {
      const f = n - d.s * a;
      ((s.fillStyle = "#8a5a1c"),
        s.fillRect(10, f - 2, l - 60, 4),
        (s.font = "600 20px DM Mono, monospace"),
        s.fillText(String(d.y), 96, f - 7));
    }
    (s.save(),
      s.translate(l - 8, i * 0.5),
      s.rotate(-Math.PI / 2),
      (s.font = "700 22px Outfit, sans-serif"),
      (s.textAlign = "center"),
      (s.fillStyle = "#4a4f5c"),
      s.fillText("PEDREIRAS \xB7 M", 0, 0),
      s.restore());
  });
}
(nn(), da.push(nn));
function fl(e) {
  const t = dl(e);
  ((Vo.scale.y = Math.max(0.001, t - 0.1)),
    (Vo.position.y = 0.1 + (t - 0.1) / 2),
    (ut.position.y = t));
  const o = xr(S.phase);
  ut.userData.ring.material.color.setRGB(o.r * 2.4, o.g * 2.4, o.b * 2.4);
}
const vo = [
    { k: "terrain", lift: 0, mode: 0 },
    { k: "drain", lift: 1.9, mode: 3 },
    { k: "hand", lift: 2.85, mode: 1 },
    { k: "flood", lift: 3.8, mode: 4 },
    { k: "city", lift: 4.75, mode: 5 },
    { k: "resp", lift: 5.7, mode: 6 },
  ],
  sn = 0.32,
  ka = new r.Group();
(Mt.add(ka), (ka.visible = !1));
const ul = cr(Math.round(O.half[0] / 15), Math.round(O.half[1] / 15), 0.5);
vo.forEach((e, t) => {
  if (!t) return;
  const o = new r.Mesh(ul, rr(e.mode, 0, sn, "ex"));
  ((o.castShadow = !1),
    (o.receiveShadow = !0),
    (o.frustumCulled = !1),
    ka.add(o),
    (e.mesh = o));
  const { nrm: a } = Vn(o.material.userData.U);
  qn(o, a);
  const n = new r.Mesh(
    new r.BoxGeometry(2 * ue, 0.04, 2 * be),
    K(t === 5 ? "#121722" : "#2a2f38", { roughness: 0.6 }),
  );
  (ka.add(n), (e.slab = n));
});
function hl(e) {
  ka.visible = e > 0.02;
  const t = Zt(0, 1, e);
  vo.forEach((s, l) => {
    if (!l) return;
    const i = s.lift * t,
      c = s.mesh.material.userData.U;
    ((c.uLift.value = i),
      (s.slab.position.y = i + 0.018),
      (s.mesh.visible = s.slab.visible = e > 0.02));
  });
  const o = vo[4].lift * t,
    a = te(1, sn, t),
    n = vo[5].lift * t;
  ((wa.userData.U.uLift.value = e > 0.02 ? o : 0),
    (wa.userData.U.uRelief.value = e > 0.02 ? a : 1));
  for (const s of [St, ao])
    s.material.uniforms.uRelief.value = e > 0.02 ? a : 1;
  ((St.material.uniforms.uLift.value = e > 0.02 ? n : 0),
    (ao.material.uniforms.uLift.value = e > 0.02 ? o : 0),
    (ao.visible = e > 0.02),
    (fr.visible = e < 0.02 && u.layer !== "none"));
}
const se = {
    txt: "VISUAL BY RYAN SAEL",
    x: -1842,
    z: -2124,
    cap: 0.14,
    depth: 0.016,
    yaw: 0.26,
    font: "800 128px Outfit, Arial, sans-serif",
    condense: 0.76,
    track: 0.1,
    space: 0.42,
    stroke: 7,
  },
  $t = new r.Group();
(($t.name = "sign"), ft.add($t), _e.push($t), Be.push($t));
const Ct = lt(
    new r.MeshStandardMaterial({
      color: 16777215,
      roughness: 0.6,
      metalness: 0,
      envMapIntensity: 0.3,
      alphaTest: 0.04,
      alphaToCoverage: !0,
      emissive: 2895411,
    }),
  ),
  rn = new r.Mesh(
    new r.BufferGeometry(),
    new r.MeshBasicMaterial({ visible: !1, side: r.DoubleSide }),
  );
($t.add(rn),
  Dn.push({
    hit: rn,
    over(e) {
      (e ? Ct.emissive.setRGB(1, 0.66, 0.3) : Ct.emissive.set(2895411),
        (Ct.emissiveIntensity = e ? 0.85 : 1));
    },
  }));
let Wo = null;
function Yn() {
  const e = [...new Set(se.txt.replace(/ /g, ""))],
    t = 128,
    o = 4,
    a = se.stroke,
    n = se.condense,
    s = document.createElement("canvas").getContext("2d");
  s.font = se.font;
  const l = e.map((T) => {
      const re = s.measureText(T);
      return {
        ch: T,
        l: re.actualBoundingBoxLeft,
        r: re.actualBoundingBoxRight,
        a: re.actualBoundingBoxAscent,
      };
    }),
    i = Math.ceil(Math.max(...l.map((T) => T.a)) + a),
    c = i + 2 * o;
  let d = 12;
  l.forEach((T) => {
    ((T.w = Math.ceil((T.l + T.r + a) * n) + 2 * o), (T.x = d), (d += T.w + 2));
  });
  const f = document.createElement("canvas");
  ((f.width = d), (f.height = c));
  const h = f.getContext("2d");
  ((h.fillStyle = "#fff"),
    h.fillRect(0, 0, 8, 8),
    (h.fillStyle = "#34373d"),
    h.fillRect(0, 10, 8, 8),
    (h.fillStyle = "#fff"),
    (h.font = se.font),
    (h.textBaseline = "alphabetic"),
    (h.lineWidth = a),
    (h.lineJoin = "miter"),
    (h.strokeStyle = "#fff"),
    l.forEach((T) => {
      (h.save(),
        h.translate(T.x + o, o + i - a / 2),
        h.scale(n, 1),
        h.fillText(T.ch, T.l + a / 2, 0),
        h.strokeText(T.ch, T.l + a / 2, 0),
        h.restore());
    }));
  const p = h.getImageData(0, 0, d, c).data,
    m = (T, re, ie) =>
      T >= 0 &&
      T < ie.w &&
      re >= 0 &&
      re < c &&
      p[(re * d + ie.x + T) * 4 + 3] > 127,
    x = new r.CanvasTexture(f);
  ((x.colorSpace = r.SRGBColorSpace), (x.anisotropy = 8));
  const g = se.cap / i,
    w = se.depth,
    y = d,
    F = 4 / y,
    B = 1 - 4 / c,
    v = 1 - 14 / c,
    R = [],
    M = [],
    A = [],
    P = [],
    L = (T, re, ie, ge, Z, G) => {
      const U = R.length / 3;
      R.push(...T, ...re, ...ie, ...ge);
      for (let Se = 0; Se < 4; Se++) M.push(...Z);
      (A.push(...G), P.push(U, U + 1, U + 2, U, U + 2, U + 3));
    },
    _ = (T, re, ie, ge, Z) => {
      const G = T.w * g,
        U = -G / 2,
        Se = -o * g,
        ee = (c - o) * g,
        fo = T.x / y,
        Do = (T.x + T.w) / y,
        oe = (ae, ye, Yt) => [
          re + Z[0] * ae - Z[1] * Yt,
          ie + ye,
          ge + Z[1] * ae + Z[0] * Yt,
        ],
        Ea = (ae, ye) => [Z[0] * ae - Z[1] * ye, 0, Z[1] * ae + Z[0] * ye],
        Ms = (ae) => [0, ae, 0];
      (L(oe(U, Se, 0), oe(-U, Se, 0), oe(-U, ee, 0), oe(U, ee, 0), Ea(0, 1), [
        fo,
        0,
        Do,
        0,
        Do,
        1,
        fo,
        1,
      ]),
        L(
          oe(-U, Se, -w),
          oe(U, Se, -w),
          oe(U, ee, -w),
          oe(-U, ee, -w),
          Ea(0, -1),
          [Do, 0, fo, 0, fo, 1, Do, 1],
        ));
      const Oa = [F, B, F, B, F, B, F, B],
        xn = (ae) => U + ae * g,
        gn = (ae) => ee - ae * g;
      for (let ae = 0; ae <= T.w; ae++) {
        let ye = 0;
        for (; ye < c;) {
          const Yt = m(ae - 1, ye, T),
            uo = m(ae, ye, T);
          if (Yt === uo) {
            ye++;
            continue;
          }
          let je = ye;
          for (; je < c && m(ae - 1, je, T) === Yt && m(ae, je, T) === uo;)
            je++;
          const Fe = xn(ae),
            zt = gn(ye),
            Ft = gn(je);
          (uo
            ? L(
                oe(Fe, zt, 0),
                oe(Fe, zt, -w),
                oe(Fe, Ft, -w),
                oe(Fe, Ft, 0),
                Ea(-1, 0),
                Oa,
              )
            : L(
                oe(Fe, Ft, 0),
                oe(Fe, Ft, -w),
                oe(Fe, zt, -w),
                oe(Fe, zt, 0),
                Ea(1, 0),
                Oa,
              ),
            (ye = je));
        }
      }
      for (let ae = 0; ae <= c; ae++) {
        let ye = 0;
        for (; ye < T.w;) {
          const Yt = m(ye, ae - 1, T),
            uo = m(ye, ae, T);
          if (Yt === uo) {
            ye++;
            continue;
          }
          let je = ye;
          for (; je < T.w && m(je, ae - 1, T) === Yt && m(je, ae, T) === uo;)
            je++;
          const Fe = gn(ae),
            zt = xn(ye),
            Ft = xn(je);
          (uo
            ? L(
                oe(zt, Fe, 0),
                oe(Ft, Fe, 0),
                oe(Ft, Fe, -w),
                oe(zt, Fe, -w),
                Ms(1),
                Oa,
              )
            : L(
                oe(Ft, Fe, 0),
                oe(zt, Fe, 0),
                oe(zt, Fe, -w),
                oe(Ft, Fe, -w),
                Ms(-1),
                Oa,
              ),
            (ye = je));
        }
      }
    },
    z = [Math.cos(se.yaw), -Math.sin(se.yaw)],
    V = [...se.txt],
    Ve = Object.fromEntries(l.map((T) => [T.ch, T])),
    Ee = V.map((T) =>
      T === " " ? se.cap * se.space : (Ve[T].w - 2 * o) * g + se.cap * se.track,
    ),
    bt = Ee.reduce((T, re) => T + re, 0),
    Oe = [];
  let Je = -bt / 2;
  const sa = se.x / H,
    Fa = se.z / H,
    Pt = (T, re, ie) => Ye((T + z[0] * ie) * H, (re + z[1] * ie) * H);
  V.forEach((T, re) => {
    const ie = Je + Ee[re] / 2;
    if (((Je += Ee[re]), T === " ")) return;
    const ge = Ve[T],
      Z = ge.w * g,
      G = sa + z[0] * ie,
      U = Fa + z[1] * ie;
    let Se = -1e9;
    for (let ee = -2; ee <= 2; ee++)
      Se = Math.max(Se, Pt(G, U, ((ge.w - 2 * o) * g * ee) / 4));
    Oe.push({ m: ge, w: Z, px: G, pz: U, top: Se });
  });
  let To = Oe.map((T) => T.top);
  for (let T = 0; T < 3; T++)
    To = To.map(
      (re, ie) =>
        (To[Math.max(0, ie - 1)] +
          2 * re +
          To[Math.min(To.length - 1, ie + 1)]) /
        4,
    );
  const bn = [],
    ys = [];
  se.letters = [];
  const ws = (T, re, ie, ge) => {
    const Z = Pt(T, re, ie) / ot - 0.004;
    if (ge - Z < 0.004) return;
    const G = 0.0045,
      U = (fo, Do, oe) => [
        T + z[0] * (ie + fo) - z[1] * oe,
        Do,
        re + z[1] * (ie + fo) + z[0] * oe,
      ],
      Se = [F, v, F, v, F, v, F, v],
      ee = -w * 0.5;
    (L(
      U(-G, Z, ee + G),
      U(G, Z, ee + G),
      U(G, ge, ee + G),
      U(-G, ge, ee + G),
      [-z[1], 0, z[0]],
      Se,
    ),
      L(
        U(G, Z, ee - G),
        U(-G, Z, ee - G),
        U(-G, ge, ee - G),
        U(G, ge, ee - G),
        [z[1], 0, -z[0]],
        Se,
      ),
      L(
        U(G, Z, ee + G),
        U(G, Z, ee - G),
        U(G, ge, ee - G),
        U(G, ge, ee + G),
        [z[0], 0, z[1]],
        Se,
      ),
      L(
        U(-G, Z, ee - G),
        U(-G, Z, ee + G),
        U(-G, ge, ee + G),
        U(-G, ge, ee - G),
        [-z[0], 0, -z[1]],
        Se,
      ));
  };
  Oe.forEach((T, re) => {
    const ie = (Math.max(To[re], T.top) + 0.3) / ot;
    (_(T.m, T.px, ie, T.pz, z), se.letters.push([T.px, ie, T.pz, T.w]));
    const ge = (T.m.w - 2 * o) * g;
    (ws(T.px, T.pz, -ge * 0.32, ie + 0.01),
      ws(T.px, T.pz, ge * 0.32, ie + 0.01));
    const Z = bn.length / 3,
      G = T.w / 2,
      U = (Se, ee) => [
        T.px + z[0] * Se - z[1] * 0.004,
        ie + ee,
        T.pz + z[1] * Se + z[0] * 0.004,
      ];
    (bn.push(
      ...U(-G, -o * g),
      ...U(G, -o * g),
      ...U(G, (c - o) * g),
      ...U(-G, (c - o) * g),
    ),
      ys.push(Z, Z + 1, Z + 2, Z, Z + 2, Z + 3));
  });
  const Ao = new r.BufferGeometry();
  (Ao.setAttribute("position", new r.Float32BufferAttribute(R, 3)),
    Ao.setAttribute("normal", new r.Float32BufferAttribute(M, 3)),
    Ao.setAttribute("uv", new r.Float32BufferAttribute(A, 2)),
    Ao.setIndex(P),
    Ao.computeBoundingSphere(),
    Wo && ($t.remove(Wo), Wo.geometry.dispose(), Ct.map?.dispose()),
    (Ct.map = x),
    (Ct.needsUpdate = !0),
    (Wo = new r.Mesh(Ao, Ct)),
    (Wo.receiveShadow = !0),
    $t.add(Wo));
  const La = new r.BufferGeometry();
  (La.setAttribute("position", new r.Float32BufferAttribute(bn, 3)),
    La.setIndex(ys),
    La.computeBoundingSphere(),
    rn.geometry.dispose(),
    (rn.geometry = La),
    (se.tris = P.length / 3));
}
(Yn(), document.fonts?.load(se.font).then(Yn, () => {}));
const vr = {
  en: {
    kicker: "Pedreiras \xB7 Trizidela do Vale",
    title: "When the Mearim rises",
    lede: "Raise the river and the water finds the low ground first. Every street, house and shelter answers one question: at this level, what is under water, and what should the response do?",
    ph: ["Vigilance", "Alert", "Mobilization", "Response", "Stabilization"],
    stLevel: "Mearim",
    stHouses: "In water",
    stRoads: "Streets cut",
    stHours: "After breach",
    scenario: "Scenario",
    scSeason: "Seasonal flood",
    scDam: "Flores dam breach",
    layer: "Layer",
    lyCity: "City",
    lyRisk: "Risk",
    lyResp: "Response",
    view: "View",
    vLab: "Lab",
    vEx: "Exploded",
    vSt: "Studio",
    mLevel: "River level at Pedreiras",
    mTime: "Hours since the breach",
    run: "Run the scenario (Space)",
    pause: "Pause (Space)",
    act: [
      "watch the Pedreiras gauge and the rain; check shelters, boats and contacts.",
      "warn the riverside streets, inspect shelters and routes, put boats and teams on standby.",
      "open the command post, move boats and teams in, start moving people out of the lowest streets.",
      "evacuate the flooded streets to the open shelters by the routes shown, close the cut streets, boats only in NO-GO water.",
      "keep the NO-GO areas closed until the water leaves; then assess the damage, clean, and plan the return home.",
    ],
    actDam:
      "evacuate everything inside the dashed line before the wave arrives.",
    whyLow: (e, t, o, a) =>
      `At <b>${e} m</b> the Mearim stays in its channel, <b>${t} m</b> under the alert mark. <span class="p">${o}</span>: ${a}`,
    whyHigh: (e, t, o, a, n, s, l) =>
      `At <b>${e} m</b> the river is <b>${t} m</b> over the alert mark: <span class="r">${o} houses</span> (about ${a} people) are in water and <b>${n} km</b> of street are cut. <span class="p">${s}</span>: ${l}`,
    whyDam: (e, t, o, a) =>
      `The Flores dam has failed. The wave reaches Pedreiras in <b>${e} h</b>, cresting near <b>${t} m</b>. <span class="p">${o}</span>: ${a}`,
    whyDamOn: (e, t, o, a, n, s) =>
      `<b>${e} h</b> after the breach the Mearim stands at <b>${t} m</b>: <span class="r">${o} houses</span> (about ${a} people) are in water. <span class="p">${n}</span>: ${s}`,
    tagLevel: "Mearim",
    houses: "houses",
    shelter: "Shelter",
    shOpen: "open",
    shRisk: "water close",
    shLost: "lost",
    hosp: "Hospital Regional",
    accOk: "open",
    accCut: "access cut",
    flooded: "flooded",
    bridge: "Ponte Francisco S\xE1",
    brOpen: "open",
    brCaution: "water close",
    brClosed: "closed",
    nogo: "NO-GO",
    deep: "over",
    cutoff: "Cut off",
    sub: "Substation",
    ex: [
      "Terrain \xB7 Copernicus 30 m",
      "Drainage",
      "HAND \xB7 susceptibility",
      "Flood \xB7 ",
      "City \xB7 streets and houses",
      "Response",
    ],
    legRisk: "Height above the nearest drainage (HAND)",
    legResp: "Streets and shelters",
    lgOpen: "open",
    lgCaution: "water close",
    lgCut: "closed",
    lgRoute: "to shelter",
    lgSh: "shelter",
    lgNogo: "NO-GO",
    lgIso: "cut off",
    lgWet: "in water",
    hist: "April 2024 crest",
    breach: "breach",
    arrive: "wave",
    day: "day",
    h: "h",
    calH: "Thresholds and calibration",
    calP: "The research is still calibrating its thresholds, so none of them is built into the model. Change them here: the water, the streets, the shelters and the phases follow at once. They stay in this browser; <b>Copy link</b> shares them.",
    calApply: "Apply",
    calReset: "Defaults",
    calLink: "Copy link",
    calJson: "Copy JSON",
    calSaved: "Applied and kept in this browser.",
    calCopied: "Copied.",
    calF: {
      alert: ["Alert", "m on the Pedreiras gauge"],
      mobil: ["Mobilization", "m (not in the draft)"],
      crit: ["Critical: response", "m"],
      extreme: ["Extreme", "m"],
      s0: ["Gauge reading at HAND 0", "m: the river surface in the DEM"],
      stabDrop: ["Stabilization after the crest falls", "m"],
      roadCut: ["Street closes above", "m of water"],
      nogo: ["NO-GO above", "m of water"],
      nogoDam: ["NO-GO in the dam scenario", "m"],
      ppl: ["People per house", ""],
      cap: ["People per shelter", ""],
      seasonPeak: ["Seasonal crest", "m"],
      damBase: ["River when the dam fails", "m"],
      damArrive: ["Wave arrives after", "h"],
      damRise: ["Rise to the crest", "h"],
      damPeak: ["Dam crest at Pedreiras", "m"],
      damFall: ["Recession time", "h"],
    },
    calG: [
      "Phases (gauge levels)",
      "Calibration",
      "Streets and safety",
      "People",
      "Seasonal scenario",
      "Flores dam scenario (illustrative)",
    ],
    flashLayer: ["City", "Risk: HAND", "Response"],
    flashScen: ["Seasonal flood", "Flores dam breach (hypothetical)"],
    tipFloat: "Drag to raise or lower the river",
    tipFloatDam: "The wave sets the level: drag the hours",
    tipSlider: "Drag the river level",
    tipSliderDam: "Drag through the hours",
    tipScen: "Scenario",
    tipLayer: "Layer",
    tipLink: "@RYANSAEL on X",
    tipPin: "Shelter",
    tipRiver: "Tap to read the depth here",
    depthHere: (e, t) =>
      e > 0 ? `${e} m of water here` : `dry, ${t} m above the water`,
  },
  pt: {
    kicker: "Pedreiras \xB7 Trizidela do Vale",
    title: "Quando o Mearim sobe",
    lede: "Suba o rio e a \xE1gua encontra primeiro o terreno baixo. Cada rua, casa e abrigo responde a uma pergunta: neste n\xEDvel, o que est\xE1 debaixo d\u2019\xE1gua e o que a resposta deve fazer?",
    ph: [
      "Vigil\xE2ncia",
      "Alerta",
      "Mobiliza\xE7\xE3o",
      "Resposta",
      "Estabiliza\xE7\xE3o",
    ],
    stLevel: "Mearim",
    stHouses: "Na \xE1gua",
    stRoads: "Ruas cortadas",
    stHours: "Ap\xF3s a ruptura",
    scenario: "Cen\xE1rio",
    scSeason: "Cheia sazonal",
    scDam: "Ruptura da barragem do Flores",
    layer: "Camada",
    lyCity: "Cidade",
    lyRisk: "Risco",
    lyResp: "Resposta",
    view: "Vista",
    vLab: "Lab",
    vEx: "Explodida",
    vSt: "Est\xFAdio",
    mLevel: "N\xEDvel do rio em Pedreiras",
    mTime: "Horas desde a ruptura",
    run: "Rodar o cen\xE1rio (Espa\xE7o)",
    pause: "Pausar (Espa\xE7o)",
    act: [
      "acompanhar a r\xE9gua de Pedreiras e a chuva; conferir abrigos, barcos e contatos.",
      "avisar as ruas ribeirinhas, vistoriar abrigos e rotas, barcos e equipes de prontid\xE3o.",
      "ativar o posto de comando, deslocar barcos e equipes, come\xE7ar a retirar as fam\xEDlias das ruas mais baixas.",
      "evacuar as ruas alagadas para os abrigos abertos pelas rotas indicadas, interditar as ruas cortadas, s\xF3 barcos na \xE1gua NO-GO.",
      "manter as \xE1reas NO-GO fechadas at\xE9 a \xE1gua baixar; depois avaliar danos, limpar e planejar o retorno.",
    ],
    actDam:
      "retirar todos de dentro da linha tracejada antes da chegada da onda.",
    whyLow: (e, t, o, a) =>
      `Com <b>${e} m</b> o Mearim fica na calha, <b>${t} m</b> abaixo da cota de alerta. <span class="p">${o}</span>: ${a}`,
    whyHigh: (e, t, o, a, n, s, l) =>
      `Com <b>${e} m</b> o rio est\xE1 <b>${t} m</b> acima da cota de alerta: <span class="r">${o} casas</span> (cerca de ${a} pessoas) est\xE3o na \xE1gua e <b>${n} km</b> de ruas est\xE3o cortados. <span class="p">${s}</span>: ${l}`,
    whyDam: (e, t, o, a) =>
      `A barragem do Flores rompeu. A onda chega a Pedreiras em <b>${e} h</b>, com pico perto de <b>${t} m</b>. <span class="p">${o}</span>: ${a}`,
    whyDamOn: (e, t, o, a, n, s) =>
      `<b>${e} h</b> ap\xF3s a ruptura o Mearim est\xE1 em <b>${t} m</b>: <span class="r">${o} casas</span> (cerca de ${a} pessoas) est\xE3o na \xE1gua. <span class="p">${n}</span>: ${s}`,
    tagLevel: "Mearim",
    houses: "casas",
    shelter: "Abrigo",
    shOpen: "aberto",
    shRisk: "\xE1gua perto",
    shLost: "perdido",
    hosp: "Hospital Regional",
    accOk: "acesso livre",
    accCut: "acesso cortado",
    flooded: "alagado",
    bridge: "Ponte Francisco S\xE1",
    brOpen: "aberta",
    brCaution: "\xE1gua perto",
    brClosed: "fechada",
    nogo: "NO-GO",
    deep: "acima de",
    cutoff: "Isolados",
    sub: "Subesta\xE7\xE3o",
    ex: [
      "Terreno \xB7 Copernicus 30 m",
      "Drenagem",
      "HAND \xB7 suscetibilidade",
      "Inunda\xE7\xE3o \xB7 ",
      "Cidade \xB7 ruas e casas",
      "Resposta",
    ],
    legRisk: "Altura acima da drenagem mais pr\xF3xima (HAND)",
    legResp: "Ruas e abrigos",
    lgOpen: "livre",
    lgCaution: "\xE1gua perto",
    lgCut: "fechada",
    lgRoute: "at\xE9 o abrigo",
    lgSh: "abrigo",
    lgNogo: "NO-GO",
    lgIso: "isolados",
    lgWet: "na \xE1gua",
    hist: "pico de abril de 2024",
    breach: "ruptura",
    arrive: "onda",
    day: "dia",
    h: "h",
    calH: "Cotas e calibra\xE7\xE3o",
    calP: "A pesquisa ainda est\xE1 calibrando as cotas, por isso nenhuma est\xE1 fixa no modelo. Mude aqui: a \xE1gua, as ruas, os abrigos e as fases acompanham na hora. Ficam salvas neste navegador; <b>Copiar link</b> compartilha.",
    calApply: "Aplicar",
    calReset: "Padr\xF5es",
    calLink: "Copiar link",
    calJson: "Copiar JSON",
    calSaved: "Aplicado e salvo neste navegador.",
    calCopied: "Copiado.",
    calF: {
      alert: ["Alerta", "m na r\xE9gua de Pedreiras"],
      mobil: ["Mobiliza\xE7\xE3o", "m (n\xE3o est\xE1 no rascunho)"],
      crit: ["Cr\xEDtica: resposta", "m"],
      extreme: ["Extrema", "m"],
      s0: ["Leitura da r\xE9gua no HAND 0", "m: a superf\xEDcie do rio no MDE"],
      stabDrop: ["Estabiliza\xE7\xE3o ap\xF3s o pico baixar", "m"],
      roadCut: ["Rua fecha acima de", "m de \xE1gua"],
      nogo: ["NO-GO acima de", "m de \xE1gua"],
      nogoDam: ["NO-GO no cen\xE1rio da barragem", "m"],
      ppl: ["Pessoas por casa", ""],
      cap: ["Pessoas por abrigo", ""],
      seasonPeak: ["Pico da cheia sazonal", "m"],
      damBase: ["Rio quando a barragem rompe", "m"],
      damArrive: ["A onda chega ap\xF3s", "h"],
      damRise: ["Subida at\xE9 o pico", "h"],
      damPeak: ["Pico em Pedreiras (barragem)", "m"],
      damFall: ["Tempo de recess\xE3o", "h"],
    },
    calG: [
      "Fases (cotas na r\xE9gua)",
      "Calibra\xE7\xE3o",
      "Ruas e seguran\xE7a",
      "Pessoas",
      "Cen\xE1rio sazonal",
      "Cen\xE1rio da barragem do Flores (ilustrativo)",
    ],
    flashLayer: ["Cidade", "Risco: HAND", "Resposta"],
    flashScen: [
      "Cheia sazonal",
      "Ruptura da barragem do Flores (hipot\xE9tica)",
    ],
    tipFloat: "Arraste para subir ou baixar o rio",
    tipFloatDam: "A onda define o n\xEDvel: arraste as horas",
    tipSlider: "Arraste o n\xEDvel do rio",
    tipSliderDam: "Arraste as horas",
    tipScen: "Cen\xE1rio",
    tipLayer: "Camada",
    tipLink: "@RYANSAEL no X",
    tipPin: "Abrigo",
    tipRiver: "Toque para ler a profundidade aqui",
    depthHere: (e, t) =>
      e > 0 ? `${e} m de \xE1gua aqui` : `seco, ${t} m acima da \xE1gua`,
  },
};
let ne = (() => {
  const e = new URLSearchParams(location.search).get("lang");
  if (e === "pt" || e === "en") return e;
  try {
    const t = localStorage.getItem(Ro + ":lang");
    if (t === "pt" || t === "en") return t;
  } catch {}
  return /^pt/i.test(navigator.language || "") ? "pt" : "en";
})();
const k = (e) => vr[ne][e] ?? vr.en[e],
  ze = (e, t = 0) =>
    e.toLocaleString(ne === "pt" ? "pt-BR" : "en-US", {
      minimumFractionDigits: t,
      maximumFractionDigits: t,
    }),
  u = {
    scen: "seasonal",
    layer: "response",
    S: 7.9,
    ST: 7.9,
    day: 30,
    play: !1,
    hrs: 6,
    hrsT: 6,
    ex: 0,
    exT: 0,
    crest: 7.9,
    low: 7.9,
    phase: 3,
    phaseAt: -9,
    lastModel: -9,
    vis: 1,
  },
  br = { seasonal: 2.2, dam: 2.6 },
  pe = ["#6fd6a0", "#ffd36a", "#ffa552", "#ff6b86", "#8fb8ff"],
  xr = (e) => pl.set(pe[e]),
  pl = new r.Color(),
  bo = { seasonal: [2, 12], dam: wt };
let qo = 0.016,
  Ca = 0.016,
  le = 0;
function ml() {
  return u.scen === "dam" ? ar(u.hrs) : u.ST;
}
function vl(e) {
  const t = or(e);
  if (u.scen === "dam") {
    const o = u.hrs,
      a = b.damArrive;
    return o < 0
      ? t
      : o < a
        ? Math.max(2, t)
        : o < a + b.damRise + 0.5
          ? 3
          : e >= b.alert - 0.05
            ? 4
            : 0;
  }
  return u.crest >= b.crit && u.crest - e >= b.stabDrop && e >= b.alert - 0.5
    ? 4
    : t;
}
function bl(e) {
  u.play &&
    (u.scen === "seasonal"
      ? ((u.day += br.seasonal * Ca),
        u.day >= _o && ((u.day = _o), nt(!1)),
        (u.ST = Uo(u.day)))
      : ((u.hrsT = Math.min(wt[1], u.hrsT + br.dam * Ca)),
        u.hrsT >= wt[1] && nt(!1)));
  const t = 1 - Math.exp(-e * (Zo || u.play ? 14 : 4));
  ((u.hrs += (u.hrsT - u.hrs) * t),
    Math.abs(u.hrs - u.hrsT) < 0.01 && (u.hrs = u.hrsT));
  const o = ml();
  ((u.S += (o - u.S) * t),
    Math.abs(u.S - o) < 0.002 && (u.S = o),
    u.S > u.crest ? (u.crest = u.low = u.S) : u.S < u.low && (u.low = u.S),
    (u.S < b.alert - 0.5 || u.S > u.low + 0.1) && (u.crest = u.low = u.S));
  const a = vl(u.S);
  (a !== u.phase && ((u.phase = a), (u.phaseAt = le)),
    (S.phase = u.phase),
    (le - u.lastModel > 0.1 || Math.abs(u.S - S.S) > 0.25) &&
      $n(u.S, !1, u.scen === "dam") &&
      (Xn(), Zn(), (u.lastModel = le)));
}
function Zn() {
  const e = wa.userData.j,
    t = e.array,
    o = new Set(
      po.filter((n) => n.st < 2 && n.node >= 0).map((n) => at[n.node]),
    );
  let a = !1;
  for (let n = 0; n < Te; n++) {
    const s = on[n],
      l = he[n * 6 + 4] >= S.h && s >= 0 && !o.has(at[s]) ? 1 : 0;
    t[n * 4 + 3] !== l && ((t[n * 4 + 3] = l), (a = !0));
  }
  a && (e.needsUpdate = !0);
}
function nt(e) {
  u.play = e;
  const t = E("#play");
  (t.setAttribute("aria-pressed", e),
    (t.title = k(e ? "pause" : "run")),
    (t.innerHTML = e
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>'),
    e &&
      (u.scen === "seasonal"
        ? ((u.day >= _o - 0.01 || !u.playedFrom) &&
            (u.day = u.day >= _o - 0.01 ? 0 : gr(u.S)),
          (u.playedFrom = 1))
        : u.hrsT >= wt[1] - 0.01 && (u.hrsT = u.hrs = wt[0])));
}
function gr(e) {
  let t = 0,
    o = 1e9;
  for (let a = 0; a <= 36; a += 0.25) {
    const n = Math.abs(Uo(a) - e);
    n < o && ((o = n), (t = a));
  }
  return t;
}
function so(e) {
  (u.scen === "dam" && Tt("seasonal"),
    (u.ST = W(e, bo.seasonal[0], bo.seasonal[1])),
    u.play && nt(!1),
    (u.playedFrom = 0));
}
function xo(e) {
  ((u.hrsT = W(e, wt[0], wt[1])), u.play && nt(!1));
}
function Tt(e) {
  e !== u.scen &&
    ((u.scen = e),
    nt(!1),
    e === "dam"
      ? ((u.hrsT = u.hrs = -2), (u.crest = u.low = b.damBase))
      : ((u.ST = u.S), (u.crest = u.low = u.S)),
    Gr.forEach((t) => t.classList.toggle("on", t.dataset.s === e)),
    E("#seg-scen").classList.toggle("dam", e === "dam"),
    fs(),
    jt(!0));
}
function jo(e) {
  ((u.layer = e),
    _r.forEach((t) => t.classList.toggle("on", t.dataset.l === e)),
    Ur(),
    jt(!0));
}
const Jn = ["city", "risk", "response"],
  xl = { city: 0, risk: 1, response: 2 },
  yr = {
    lab: () => [0, Qa.top + $o.base, $o.z],
    exploded: () => [0, 0.32, 0],
    studio: () => [0, 0.01, 0],
  },
  wr = (e, t, o, a) => {
    const n = yr[e]();
    return new r.Vector3(t + n[0], o + n[1], a + n[2]);
  };
function gl() {
  const e = Q.cur,
    t = e === "exploded" ? u.ex : 0,
    o = xl[u.layer];
  (Mt.position.set(...yr[e]()),
    (Ae.uH.value = u.S - b.s0),
    (Ae.uTime.value = le),
    (Ae.uMode.value = e === "exploded" && t > 0.5 ? 0 : o),
    (Ae.uPhase.value = u.phase),
    (Ae.uNogo.value = u.scen === "dam" ? b.nogoDam : b.nogo),
    (Ae.uCut.value = b.roadCut),
    (Ae.uEnv.value =
      u.scen === "dam" && u.hrs >= 0
        ? Math.max(b.damPeak, b.damBase) - b.s0
        : -99),
    (Ae.uSec.value = e === "lab" && u.layer !== "city" ? 1 : 0),
    (Ae.uSecZ.value = go),
    (wa.userData.U.uHMode.value = e === "exploded" && t > 0.5 ? 0 : o),
    (St.material.uniforms.uRMode.value = e === "exploded" && t > 0.5 ? 3 : o),
    (Ae.uEx.value = t),
    (St.visible = !0),
    hl(t),
    ($t.visible = t < 0.02),
    cl(
      t > 0.02 ? vo[5].lift * Zt(0, 1, t) : 0,
      t > 0.02 ? te(1, sn, Zt(0, 1, t)) : 1,
      u.layer === "response" || t > 0.5,
    ),
    e === "lab" && fl(u.S),
    Sl());
}
const j = { drawnAt: 0 },
  At = ho * 0.5,
  yl = (e, t, o, a, n = 1.6, s = Le) => {
    const l = fa(o, o, 256, 256, a, n, { alphaTest: 0.2 }),
      i = l.material.map;
    return (
      (i.generateMipmaps = !1),
      (i.minFilter = r.LinearFilter),
      (i.needsUpdate = !0),
      l.position.set(e, t, 0.03),
      s.add(l),
      l
    );
  };
function Ta(e, t, o, a, n = "#7fe3ff") {
  const s = new r.Group();
  (s.position.set(e, t, 0.02), Le.add(s));
  const l = ve();
  (l
    .box($s, 0, 0, 0.03, o, o, 0.06, { r: 0.08 })
    .box(Ns, 0, 0, 0.08, o - 0.12, o - 0.12, 0.05, { r: 0.07 }),
    l.flush(s, !1));
  const i = fa(o * 0.7, o * 0.7, 256, 256, a, 2.2, { alphaTest: 0.2 });
  ((i.position.z = 0.112), s.add(i));
  const c = new r.Mesh(Es(o - 0.06, o - 0.06, 0.02, 0.08), Re(n, 2.2));
  return (
    (c.position.z = 0.07),
    c.scale.set(1, 1, 0.5),
    s.add(c),
    (s.userData = { ring: c, col: new r.Color(n) }),
    s
  );
}
(ha(-6.1, 3),
  ha(-3.4, 2.1),
  ha(0.3, 5),
  ha(4.1, 2.3),
  ha(6.5, 2.2),
  yl(-7.25, At + 0.02, 0.5, (e, t, o) => {
    ((e.fillStyle = "#bfefff"),
      e.fillRect(t * 0.42, o * 0.1, t * 0.16, o * 0.8));
    for (let a = 0; a < 5; a++)
      e.fillRect(t * 0.25, o * (0.18 + a * 0.15), t * 0.17, o * 0.05);
    e.fillRect(t * 0.58, o * 0.62, t * 0.22, o * 0.07);
  }),
  (j.lv = Oi(-6.8, -4.75, At, { color: "#ffa552", ring: 1 })),
  (j.kSeason = Ta(-3.9, At, 0.82, (e, t, o) => {
    ((e.strokeStyle = "#bff1ff"), (e.lineWidth = 13), (e.lineCap = "round"));
    for (let a = 0; a < 3; a++) {
      const n = o * (0.34 + a * 0.16);
      e.beginPath();
      for (let s = 0; s <= 1; s += 0.05) {
        const l = t * (0.2 + 0.6 * s),
          i = n + Math.sin(s * Math.PI * 2) * o * 0.045;
        s ? e.lineTo(l, i) : e.moveTo(l, i);
      }
      e.stroke();
    }
  })),
  (j.kDam = Ta(
    -2.9,
    At,
    0.82,
    (e, t, o) => {
      ((e.fillStyle = "#ffd2bf"),
        e.beginPath(),
        e.moveTo(t * 0.18, o * 0.22),
        e.lineTo(t * 0.5, o * 0.22),
        e.lineTo(t * 0.62, o * 0.78),
        e.lineTo(t * 0.18, o * 0.78),
        e.closePath(),
        e.fill(),
        (e.strokeStyle = "#ffd2bf"),
        (e.lineWidth = 11),
        (e.lineCap = "round"));
      for (let a = 0; a < 3; a++)
        (e.beginPath(),
          e.moveTo(t * 0.68, o * (0.45 + a * 0.12)),
          e.quadraticCurveTo(
            t * 0.76,
            o * (0.4 + a * 0.12),
            t * 0.84,
            o * (0.45 + a * 0.12),
          ),
          e.stroke());
      ((e.strokeStyle = "#0b0f1a"),
        (e.lineWidth = 8),
        e.beginPath(),
        e.moveTo(t * 0.36, o * 0.3),
        e.lineTo(t * 0.42, o * 0.48),
        e.lineTo(t * 0.34, o * 0.6),
        e.stroke());
    },
    "#ffb39a",
  )),
  (j.hydro = Vs(0.3, At, 4.7, ho * 0.66, (e, t, o) => wl(e, t, o), {
    cw: 1024,
    k: 1.5,
  })),
  (j.kCity = Ta(
    3.35,
    At,
    0.66,
    (e, t, o) => {
      e.fillStyle = "#e8eef8";
      for (const [a, n, s, l] of [
        [0.16, 0.48, 0.18, 0.34],
        [0.38, 0.3, 0.2, 0.52],
        [0.62, 0.42, 0.2, 0.4],
      ])
        e.fillRect(t * a, o * n, t * s, o * l);
      e.fillRect(t * 0.12, o * 0.82, t * 0.76, o * 0.06);
    },
    "#dfe8f5",
  )),
  (j.kRisk = Ta(
    4.1,
    At,
    0.66,
    (e, t, o) => {
      ["#c84a3a", "#e8954a", "#f0d07a", "#8cb36b"].forEach((n, s) => {
        ((e.fillStyle = n),
          e.beginPath(),
          e.ellipse(
            t * 0.5,
            o * 0.62,
            t * (0.4 - s * 0.09),
            o * (0.24 - s * 0.05),
            0,
            0,
            7,
          ),
          e.fill());
      });
    },
    "#ffa552",
  )),
  (j.kResp = Ta(
    4.85,
    At,
    0.66,
    (e, t, o) => {
      ((e.strokeStyle = "#ff8ea0"),
        (e.lineWidth = 14),
        (e.lineCap = e.lineJoin = "round"),
        e.beginPath(),
        e.moveTo(t * 0.18, o * 0.75),
        e.lineTo(t * 0.45, o * 0.5),
        e.lineTo(t * 0.62, o * 0.6),
        e.lineTo(t * 0.82, o * 0.3),
        e.stroke(),
        (e.fillStyle = "#ff8ea0"),
        e.beginPath(),
        e.moveTo(t * 0.86, o * 0.2),
        e.lineTo(t * 0.68, o * 0.26),
        e.lineTo(t * 0.84, o * 0.4),
        e.fill());
    },
    "#ff6b86",
  )),
  (j.phase = Vs(6.5, At, 2.05, ho * 0.66, (e, t, o) => Ml(e, t, o), {
    cw: 640,
    k: 1.5,
  })),
  Hi(0.3, At - ho * 0.405, 1.05, { k: 0.8 }));
function wl(e, t, o) {
  ((e.fillStyle = "#08111c"), e.fillRect(0, 0, t, o));
  const a = u.scen === "dam",
    [n, s] = a ? wt : [0, _o],
    [l, i] = [2, 12.5],
    c = 70,
    d = t - 24,
    f = 56,
    h = o - 56,
    p = (M) => c + ((M - n) / (s - n)) * (d - c),
    m = (M) => h - ((M - l) / (i - l)) * (h - f),
    x = [
      [l, b.alert, pe[0]],
      [b.alert, b.mobil, pe[1]],
      [b.mobil, b.crit, pe[2]],
      [b.crit, b.extreme, pe[3]],
      [b.extreme, i, "#c77dff"],
    ];
  for (const [M, A, P] of x)
    ((e.fillStyle = P + "22"), e.fillRect(c, m(A), d - c, m(M) - m(A)));
  ((e.font = "500 22px DM Mono, monospace"), (e.textAlign = "right"));
  for (const [M, A] of [
    [b.alert, pe[1]],
    [b.crit, pe[3]],
    [b.extreme, "#c77dff"],
  ])
    ((e.strokeStyle = A),
      (e.globalAlpha = 0.8),
      e.setLineDash([10, 8]),
      (e.lineWidth = 2),
      e.beginPath(),
      e.moveTo(c, m(M)),
      e.lineTo(d, m(M)),
      e.stroke(),
      e.setLineDash([]),
      (e.globalAlpha = 1),
      (e.fillStyle = A),
      e.fillText(M.toFixed(1), c - 8, m(M) + 8));
  ((e.strokeStyle = "#2a3a50"),
    (e.lineWidth = 2),
    e.beginPath(),
    e.moveTo(c, f - 10),
    e.lineTo(c, h),
    e.lineTo(d, h),
    e.stroke(),
    (e.fillStyle = "#7f93ad"),
    (e.textAlign = "center"));
  const g = a ? 12 : 8;
  for (let M = Math.ceil(n / g) * g; M <= s; M += g)
    e.fillText(String(M), p(M), h + 30);
  ((e.textAlign = "left"), e.fillText(k(a ? "h" : "day"), d - 40, h + 30));
  const w = a ? ar : Uo;
  ((e.lineWidth = 5), (e.lineCap = "round"));
  let y = null,
    F = null;
  for (let M = 0; M <= 160; M++) {
    const A = n + ((s - n) * M) / 160,
      P = w(A),
      L = p(A),
      _ = m(Math.min(P, i));
    (y !== null &&
      ((e.strokeStyle = pe[or(P)]),
      e.beginPath(),
      e.moveTo(y, F),
      e.lineTo(L, _),
      e.stroke()),
      (y = L),
      (F = _));
  }
  if (a) {
    ((e.strokeStyle = "#ff9db0"), e.setLineDash([6, 8]), (e.lineWidth = 2));
    for (const [M, A] of [
      [0, k("breach")],
      [b.damArrive, k("arrive")],
    ])
      (e.beginPath(),
        e.moveTo(p(M), f),
        e.lineTo(p(M), h),
        e.stroke(),
        (e.fillStyle = "#ffb8c6"),
        e.fillText(A, p(M) + 6, f + 18));
    e.setLineDash([]);
  }
  for (const M of On)
    ((e.fillStyle = "#e9eef7"), e.fillRect(d - 6, m(M.s) - 1, 12, 3));
  const B = a ? u.hrs : u.play || u.playedFrom ? u.day : gr(u.S),
    v = p(B),
    R = m(Math.min(u.S, i));
  ((e.strokeStyle = "#ffffff55"),
    (e.lineWidth = 2),
    e.beginPath(),
    e.moveTo(v, f),
    e.lineTo(v, h),
    e.stroke(),
    (e.fillStyle = pe[u.phase]),
    (e.shadowColor = pe[u.phase]),
    (e.shadowBlur = 24),
    e.beginPath(),
    e.arc(v, R, 13, 0, 7),
    e.fill(),
    (e.shadowBlur = 0),
    (e.font = "500 30px DM Mono, monospace"),
    (e.textAlign = "left"),
    (e.fillStyle = "#e9f3ff"),
    e.fillText(`${k("stLevel").toUpperCase()} ${u.S.toFixed(2)} m`, c, 38),
    (e.textAlign = "right"),
    (e.fillStyle = pe[u.phase]),
    e.fillText(k("ph")[u.phase].toUpperCase(), d, 38));
}
function Ml(e, t, o) {
  ((e.fillStyle = "#08111c"), e.fillRect(0, 0, t, o));
  const a = k("ph"),
    n = 5,
    s = 16,
    l = (t - s * 2) / n;
  for (let c = 0; c < n; c++) {
    const d = c === u.phase,
      f = s + c * l;
    ((e.fillStyle = d ? pe[c] : "#16202e"),
      Xa(e, f + 3, s, l - 6, 62, 10),
      e.fill(),
      (e.fillStyle = d ? "#0b0f1a" : "#6f7d93"),
      (e.font = `600 ${d ? 19 : 17}px Outfit, sans-serif`),
      (e.textAlign = "center"),
      e.fillText(a[c].slice(0, d ? 13 : 5).toUpperCase(), f + l / 2, s + 40));
  }
  ((e.textAlign = "left"),
    (e.font = "500 24px DM Mono, monospace"),
    [
      [ze(S.wet), k("stHouses")],
      [ze(S.people), ne === "pt" ? "pessoas" : "people"],
      [ze(S.cutKm, 1) + " km", k("stRoads")],
      [
        `${S.shOpen}/${S.shAll}`,
        ne === "pt" ? "abrigos abertos" : "shelters open",
      ],
    ].forEach(([c, d], f) => {
      const h = s + 110 + f * 44;
      ((e.fillStyle = f === 0 && S.wet ? "#ff8ea0" : "#e9f3ff"),
        e.fillText(c, s + 8, h),
        (e.fillStyle = "#7f93ad"),
        (e.font = "400 20px DM Mono, monospace"),
        e.fillText(d, s + 150, h),
        (e.font = "500 24px DM Mono, monospace"));
    }));
}
function Sl() {
  const e = u.scen === "dam",
    t = bo[u.scen];
  j.lv.set(e ? (u.hrs - t[0]) / (t[1] - t[0]) : (u.S - t[0]) / (t[1] - t[0]));
  const o = xr(u.phase);
  j.lv.fill.material.color.setRGB(o.r * 1.9, o.g * 1.9, o.b * 1.9);
  for (const [a, n] of [
    [j.kSeason, !e],
    [j.kDam, e],
    [j.kCity, u.layer === "city"],
    [j.kRisk, u.layer === "risk"],
    [j.kResp, u.layer === "response"],
  ]) {
    const s = a.userData.col,
      l = n ? 2.2 : 0.25;
    a.userData.ring.material.color.setRGB(s.r * l, s.g * l, s.b * l);
  }
  le - j.drawnAt > 0.08 &&
    gt.visible &&
    (j.hydro.userData.redraw(le),
    j.phase.userData.redraw(le),
    (j.drawnAt = le));
}
const go = we ? ($[we.a] + $[we.b]) / 2 : 0,
  Vt = (() => {
    const e = [];
    for (let t = 0; t <= 220; t++) {
      const o = -O.half[0] + (t / 220) * 2 * O.half[0];
      e.push([o, Ye(o, go), mo(o, go), Ce(C.HM, o, go), tn(o, go)]);
    }
    return e;
  })(),
  Mr = [];
for (let e = 0; e < Te; e++) Math.abs(he[e * 6 + 1] - go) < 70 && Mr.push(e);
const Ic = (e, t, o, a, n, s) => {
  (e.save(),
    e.translate(t, o),
    e.rotate(a),
    (e.fillStyle = s),
    e.beginPath(),
    e.moveTo(n, 0),
    e.lineTo(-n * 0.7, n * 0.62),
    e.lineTo(-n * 0.35, 0),
    e.lineTo(-n * 0.7, -n * 0.62),
    e.closePath(),
    e.fill(),
    e.restore());
};
function kl(e, t, o) {
  const a = Vt.map((f) => f[1]),
    n = Math.min(...a) - 2,
    s = n + 48,
    l = (f) => t * 0.04 + ((f + O.half[0]) / (2 * O.half[0])) * t * 0.92,
    i = (f) => o * 0.9 - ((f - n) / (s - n)) * o * 0.72,
    c = u.S - b.s0;
  ((e.fillStyle = "rgba(120,150,190,.16)"),
    e.beginPath(),
    e.moveTo(l(Vt[0][0]), o * 0.95),
    Vt.forEach((f) => e.lineTo(l(f[0]), i(Math.min(f[1], s)))),
    e.lineTo(l(Vt[Vt.length - 1][0]), o * 0.95),
    e.closePath(),
    e.fill(),
    (e.fillStyle = "rgba(90,190,255,.45)"));
  for (let f = 0; f < Vt.length - 1; f++) {
    const [h, p, m, x] = Vt[f];
    if (!(x < c || p < m - 0.1)) continue;
    const w = m + c;
    w <= p || e.fillRect(l(h), i(w), l(Vt[f + 1][0]) - l(h) + 1, i(p) - i(w));
  }
  ((e.strokeStyle = "#bfeaff"),
    (e.lineWidth = 4),
    e.beginPath(),
    Vt.forEach((f, h) =>
      h
        ? e.lineTo(l(f[0]), i(Math.min(f[1], s)))
        : e.moveTo(l(f[0]), i(Math.min(f[1], s))),
    ),
    e.stroke());
  const d = mo(we ? N[we.a] : 0, go);
  (e.setLineDash([12, 10]),
    (e.lineWidth = 2),
    (e.font = "500 20px DM Mono, monospace"));
  for (const [f, h] of [
    [b.alert, pe[1]],
    [b.crit, pe[3]],
    [b.extreme, "#c77dff"],
  ]) {
    const p = i(d + f - b.s0);
    ((e.strokeStyle = h),
      e.beginPath(),
      e.moveTo(t * 0.04, p),
      e.lineTo(t * 0.96, p),
      e.stroke(),
      (e.fillStyle = h),
      (e.textAlign = "right"),
      e.fillText(f.toFixed(1) + " m", t * 0.955, p - 6));
  }
  e.setLineDash([]);
  for (const f of Mr) {
    const h = he[f * 6],
      p = Ye(h, he[f * 6 + 1]),
      m = he[f * 6 + 4] < c;
    ((e.fillStyle = m ? "#ff8ea0" : "#e8f4ff"),
      e.fillRect(l(h) - 3, i(p) - 12, 6, 12));
  }
  ((e.font = "600 24px Outfit, sans-serif"),
    (e.fillStyle = "#cfefff"),
    (e.textAlign = "left"),
    e.fillText("TRIZIDELA DO VALE", t * 0.05, o * 0.1),
    (e.textAlign = "right"),
    e.fillText("PEDREIRAS", t * 0.95, o * 0.1),
    (e.textAlign = "center"),
    (e.fillStyle = "#8fe4ff"),
    e.fillText("MEARIM", l(we ? N[we.a] : 0), o * 0.97));
}
function Cl(e, t, o) {
  const a = u.scen === "dam",
    n = u.hrs,
    s = [t * 0.12, o * 0.78],
    l = [t * 0.42, o * 0.62],
    i = [t * 0.64, o * 0.36],
    c = [t * 0.9, o * 0.14],
    d = [t * 0.1, o * 0.4];
  if (
    ((e.lineCap = "round"),
    (e.strokeStyle = "#8fe4ff"),
    (e.lineWidth = 7),
    e.beginPath(),
    e.moveTo(...d),
    e.quadraticCurveTo(t * 0.3, o * 0.5, ...l),
    e.quadraticCurveTo(t * 0.55, o * 0.5, ...i),
    e.quadraticCurveTo(t * 0.78, o * 0.22, ...c),
    e.stroke(),
    (e.lineWidth = 4),
    (e.strokeStyle = "#bfeaff"),
    e.beginPath(),
    e.moveTo(...s),
    e.quadraticCurveTo(t * 0.3, o * 0.75, ...l),
    e.stroke(),
    (e.fillStyle = "#ffd2bf"),
    e.fillRect(s[0] - 14, s[1] - 18, 28, 36),
    (e.font = "600 22px Outfit, sans-serif"),
    (e.fillStyle = "#cfefff"),
    (e.textAlign = "left"),
    e.fillText(
      ne === "pt" ? "BARRAGEM DO FLORES" : "FLORES DAM",
      s[0] + 22,
      s[1] + 8,
    ),
    e.fillText("MEARIM", d[0], d[1] - 16),
    e.fillText("BACABAL", c[0] - 110, c[1] + 34),
    (e.fillStyle = "#ffffff"),
    e.beginPath(),
    e.arc(...i, 11, 0, 7),
    e.fill(),
    e.fillText("PEDREIRAS \xB7 TRIZIDELA", i[0] + 18, i[1] + 6),
    a && n >= 0)
  ) {
    const f = W(n / b.damArrive, 0, 1),
      h =
        f < 0.5
          ? [te(s[0], l[0], f * 2), te(s[1], l[1], f * 2)]
          : [te(l[0], i[0], (f - 0.5) * 2), te(l[1], i[1], (f - 0.5) * 2)];
    ((e.fillStyle = "#ff6b86"),
      (e.shadowColor = "#ff6b86"),
      (e.shadowBlur = 20),
      e.beginPath(),
      e.arc(h[0], h[1], 14 + 4 * Math.sin(le * 6), 0, 7),
      e.fill(),
      (e.shadowBlur = 0),
      (e.font = "500 26px DM Mono, monospace"),
      (e.fillStyle = "#ffb8c6"),
      (e.textAlign = "left"),
      e.fillText(
        f < 1
          ? `${ne === "pt" ? "chega em" : "arrives in"} ${Math.max(0, b.damArrive - n).toFixed(1)} h`
          : ne === "pt"
            ? "a onda chegou"
            : "the wave is here",
        t * 0.06,
        o * 0.12,
      ));
  } else if (
    ((e.font = "500 24px DM Mono, monospace"),
    (e.fillStyle = "#9fe6ff"),
    (e.textAlign = "left"),
    e.fillText(
      a
        ? ne === "pt"
          ? "barragem \xEDntegra"
          : "dam intact"
        : ne === "pt"
          ? "chuvas de fevereiro a maio"
          : "rains February to May",
      t * 0.06,
      o * 0.12,
    ),
    !a)
  )
    for (let f = 0; f < 18; f++) {
      const h = t * (0.15 + 0.5 * Et(f * 3.7)),
        p = ((le * 60 + Et(f) * o) % (o * 0.5)) + o * 0.15;
      ((e.fillStyle = "rgba(159,230,255,.6)"), e.fillRect(h, p, 3, 14));
    }
}
function Tl(e, t, o) {
  const a = k("ph");
  ((e.font = "600 25px Outfit, sans-serif"), (e.textAlign = "left"));
  for (let c = 0; c < 5; c++) {
    const d = c === u.phase,
      f = o * (0.13 + c * 0.165);
    ((e.fillStyle = d ? pe[c] : "rgba(143,228,255,.25)"),
      Xa(e, t * 0.05, f - 24, t * 0.06, 34, 8),
      e.fill(),
      (e.fillStyle = d ? "#ffffff" : "rgba(191,234,255,.6)"),
      e.fillText(a[c].toUpperCase(), t * 0.15, f),
      c < 4 &&
        ((e.strokeStyle = "rgba(143,228,255,.35)"),
        (e.lineWidth = 3),
        e.beginPath(),
        e.moveTo(t * 0.08, f + 14),
        e.lineTo(t * 0.08, f + o * 0.165 - 28),
        e.stroke()));
  }
  const n = u.scen === "dam" && u.phase === 2 ? k("actDam") : k("act")[u.phase];
  ((e.font = "400 20px Outfit, sans-serif"), (e.fillStyle = "#e8f6ff"));
  const s = n.split(" ");
  let l = "",
    i = o * 0.18;
  for (const c of s) {
    const d = l ? l + " " + c : c;
    e.measureText(d).width > t * 0.42
      ? (e.fillText(l, t * 0.54, i), (l = c), (i += 28))
      : (l = d);
  }
  e.fillText(l, t * 0.54, i);
}
const Sr = [kl, Cl, Tl],
  Al = Sr.map((e, t) =>
    Fi(-4.4 + t * 4.4, 6.3, 3.9, 2.2, (o, a, n) => e(o, a, n)),
  );
let Qn = 0;
function Dl() {
  le - Qn < 0.1 ||
    !J.visible ||
    ((Qn = le),
    Al.forEach((e, t) =>
      e.userData.redraw((o, a, n) => {
        ((o.fillStyle = "rgba(20,40,70,.38)"),
          o.fillRect(0, 0, a, n),
          Sr[t](o, a, n),
          (o.strokeStyle = "#8fe4ff"),
          (o.lineWidth = 4),
          o.strokeRect(3, 3, a - 6, n - 6));
      }),
    ));
}
const Xo = new r.Group();
(Jt.add(Xo), (Xo.visible = !1));
{
  const e = ve(),
    t = 2 * ue + 0.9,
    o = 2 * be + 0.9;
  (e
    .box(me("#1d232c", { roughness: 0.3 }), 0, 0.2, 0, t, 0.16, o, { r: 0.04 })
    .box(K("#0e1117"), 0, 0.07, 0, t - 0.3, 0.14, o - 0.3),
    e.flush(Xo));
  const a = Re("#ffab55", 2.4);
  for (const [s, l, i, c] of [
    [0, o / 2 + 0.005, t - 0.2, 0.035],
    [0, -o / 2 - 0.005, t - 0.2, 0.035],
    [t / 2 + 0.005, 0, 0.035, o - 0.2],
    [-t / 2 - 0.005, 0, 0.035, o - 0.2],
  ]) {
    const d = new r.Mesh(new r.BoxGeometry(i, 0.035, c), a);
    (d.position.set(s, 0.21, l), Xo.add(d));
  }
  Qt(0, 0.5, o / 2 + 1.2, "#ffab55", 5, 0.7);
  const n = Ws(1.5, { k: 0.8 });
  (n.position.set(ue - 1.6, 0.2, o / 2 + 0.012), Xo.add(n));
}
const kr = {
    room: J,
    bench: gt,
    stage: pa,
    studioSet: ma,
    exBase: Xo,
    tank: no,
  },
  Ko = {
    lab: {
      bg: "#10151f",
      fog: "#1a2130",
      fogD: 0.0036,
      tone: r.ACESFilmicToneMapping,
      exp: 0.88,
      env: "show",
      envI: 0.7,
      bloomT: 1.05,
      bloomS: 0.42,
      refl: 0.5,
      hemi: [11843258, 3813414, 0.5],
      sun: [16768180, 1.95],
      sunDir: [0.55, 0.8, 0.42],
      rim: 0.9,
      key2: 0.55,
      satK: 1,
      show: { room: 1, bench: 1, stage: 0, studioSet: 0, exBase: 0, tank: 1 },
      ex: 0,
      light: 0,
      veil: "#0b0f1a",
    },
    exploded: {
      bg: "#07112a",
      fog: "#0a1530",
      fogD: 0.003,
      tone: r.ACESFilmicToneMapping,
      exp: 1,
      env: "show",
      envI: 0.7,
      bloomT: 1.2,
      bloomS: 0.3,
      refl: 0.3,
      hemi: [8362712, 1317936, 0.5],
      sun: [16766632, 2],
      sunDir: [-0.55, 0.72, 0.5],
      rim: 1.1,
      key2: 0.45,
      satK: 1.08,
      show: { room: 0, bench: 0, stage: 1, studioSet: 0, exBase: 1, tank: 0 },
      ex: 1,
      light: 0,
      veil: "#081226",
    },
    studio: {
      bg: "#efe7dc",
      fog: "#efe7dc",
      fogD: 0.0025,
      tone: r.NeutralToneMapping,
      exp: 0.8,
      env: "studio",
      envI: 0.9,
      bloomT: 2.6,
      bloomS: 0.16,
      refl: 0,
      hemi: [16773600, 13483946, 0.62],
      sun: [16773340, 2.55],
      sunDir: [0.2, 0.85, -0.55],
      rim: 0.25,
      key2: 0.4,
      satK: 0.95,
      show: { room: 0, bench: 0, stage: 0, studioSet: 1, exBase: 0, tank: 0 },
      ex: 0,
      light: 1,
      veil: "#efe7dc",
    },
  },
  Q = { cur: "lab", next: null, at: -99, out: -99, cam: null };
function es() {
  const e = Ko[Q.cur];
  (ke.background.set(e.bg),
    ke.fog.color.set(e.fog),
    (ke.fog.density = e.fogD * D.fog),
    (Y.toneMapping = e.tone),
    (Y.toneMappingExposure = D.exposure * e.exp),
    (ke.environment = Ua[e.env]),
    (ke.environmentIntensity = D.env * e.envI),
    (Ht.threshold = D.bloomThreshold * e.bloomT),
    (Ht.strength = D.bloomStrength * e.bloomS),
    (Na.uReflStrength.value = D.reflect * e.refl),
    Ga.color.set(e.hemi[0]),
    Ga.groundColor.set(e.hemi[1]),
    (Ga.intensity = e.hemi[2] * D.fill),
    De.color.set(e.sun[0]),
    (De.intensity = e.sun[1] * D.sun),
    De.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    (Mn.intensity = e.rim * D.rim),
    (Sn.intensity = e.key2 * D.fill),
    (ks.value = D.sat * e.satK));
  for (const t in kr) kr[t].visible = !!e.show[t];
  (Eo.setLight(e.light),
    (Ae.uWarm.value = e.light ? 1 : 0),
    Ha.classList.toggle("light", !!e.light),
    ds.forEach((t) =>
      t.classList.toggle("on", t.dataset.v === (Q.next || Q.cur)),
    ));
}
function Aa(e, t = !1, o = null) {
  if (Ko[e]) {
    if (t) {
      ((Q.cur = e),
        (Q.next = null),
        es(),
        (u.exT = u.ex = Ko[e].ex),
        Qo(o || Dt[e]));
      return;
    }
    if (e === Q.cur && !Q.next) {
      o && Qo(o);
      return;
    }
    ((Q.next = e),
      (Q.at = le),
      (Q.cam = o),
      (E("#veil").style.background = Ko[e].veil),
      ds.forEach((a) => a.classList.toggle("on", a.dataset.v === e)));
  }
}
function Rl() {
  const e = E("#veil");
  let t = 0;
  if (Q.next) {
    const o = le - Q.at;
    ((t = W(o / 0.2, 0, 1)),
      o >= 0.2 &&
        ((Q.cur = Q.next),
        (Q.next = null),
        es(),
        (u.exT = Ko[Q.cur].ex),
        u.exT || (u.ex = 0),
        Qo(Q.cam || Dt[Q.cur]),
        (Q.cam = null),
        (Q.out = le),
        (t = 1)));
  } else t = 1 - W((le - Q.out) / 0.4, 0, 1);
  ((e.style.opacity = t.toFixed(3)),
    (u.ex += (u.exT - u.ex) * (1 - Math.exp(-qo * 2.4))),
    Math.abs(u.ex - u.exT) < 0.001 && (u.ex = u.exT));
}
const Cr = new r.Color(1.5, 1.75, 1.85),
  Tr = new r.Color(0.35, 0.95, 1.25),
  Pl = new r.Color(0.6, 1.2, 1.6),
  zl = [
    new r.Color(0.6, 1.4, 1.7),
    new r.Color(1.7, 1.05, 0.35),
    new r.Color(1.8, 0.38, 0.5),
  ],
  st = new r.Vector3(),
  Ne = new r.Vector3(),
  fe = new r.Vector3(),
  Da = [],
  Ar = Array.from({ length: 1400 }, () => new r.Vector3()),
  Ge = (e, t, o, a) =>
    e.set(t + Mt.position.x, o + Mt.position.y, a + Mt.position.z),
  Dr = new r.Vector3(),
  Me = {
    level: Ie(),
    bridge: Ie(),
    hosp: Ie(),
    nogo: Ie(),
    iso: Ie(),
    h0: Ie(),
    h1: Ie(),
    h2: Ie(),
    s0: Ie(),
    s1: Ie(),
    ex0: Ie(),
    ex1: Ie(),
    ex2: Ie(),
    ex3: Ie(),
    ex4: Ie(),
    ex5: Ie(),
  };
function Fl(e, t, o, a, n, s, l, i = dt) {
  st.set(e.x + t * a * 0.5, e.y, e.z + o * a * 0.5);
  const c = -o,
    d = t;
  for (const f of [1, -1])
    (Ne.set(
      e.x - t * a * 0.5 + c * a * 0.55 * f,
      e.y,
      e.z - o * a * 0.5 + d * a * 0.55 * f,
    ),
      i.seg(Ne, st, Ke(Ne, n), Ke(st, n), s, l * 0.3, l));
}
const Ll = (e) => (
  (e = e
    .replace(/^Unidade de Ensino /, "UE ")
    .replace(/^Centro de Educação Infantil /, "CEI ")
    .replace(/^Centro de Ensino /, "CE ")
    .replace(/^Centro Educa Mais /, "CEM ")
    .replace(/ - Campus Pedreiras$/, "")),
  e.length > 34 ? e.slice(0, 33) + "\u2026" : e
);
let Rr = 0;
const Pr = () => Ar[Rr++ % Ar.length];
function El(e) {
  (Eo.begin(), dt.begin(), (Rr = 0));
  const t = Q.cur,
    o = t === "exploded",
    a = o ? Zt(0, 1, u.ex) : 0,
    n = ba ? 1 : 0,
    s = u.layer,
    l = s === "response" || (o && a > 0.5),
    i = o ? vo[5].lift * a : 0,
    c = o ? te(1, sn, a) : 1,
    d = (f, h, p = 0.012) => i + (Ye(f, h) / ot) * c + p;
  for (const f of Object.values(Me)) f.userData.want = 0;
  if (l && S.routes.length)
    for (const f of S.routes) {
      const h = f.path;
      if (h.length < 2) continue;
      Da.length = 0;
      let p = 0;
      const m = [];
      for (let F = 0; F < h.length - 1; F++) {
        const [B, v] = h[F],
          [R, M] = h[F + 1],
          A = Math.hypot(R - B, M - v),
          P = Math.max(1, Math.ceil(A / 18));
        for (let L = 0; L < P; L++) {
          const _ = te(B, R, L / P),
            z = te(v, M, L / P);
          Da.push(Ge(Pr(), _ / H, d(_, z), z / H));
        }
        (m.push(A), (p += A));
      }
      const [x, g] = h[h.length - 1];
      (Da.push(Ge(Pr(), x / H, d(x, g), g / H)),
        Eo.line(Da, 11, Tr, (F) => 0.26 * Zt(0, 0.05, F)),
        dt.line(Da, 3.4, Cr, (F) => 0.9 * Zt(0, 0.04, F)));
      const w = 110,
        y = (e * 70) % w;
      for (let F = y; F < p - 10; F += w) {
        let B = 0,
          v = 0;
        for (; v < m.length - 1 && B + m[v] < F;) ((B += m[v]), v++);
        const R = W((F - B) / m[v], 0, 1),
          [M, A] = h[v],
          [P, L] = h[v + 1],
          _ = te(M, P, R),
          z = te(A, L, R),
          V = m[v] || 1;
        (Ge(fe, _ / H, d(_, z, 0.022), z / H),
          Fl(fe, (P - M) / V, (L - A) / V, 0.075, 3.4, Cr, 1));
      }
      if (!o) {
        const [F, B] = f.from,
          [v, R] = f.start,
          M = 8;
        for (let A = 0; A < M; A += 2) {
          const P = te(F, v, A / M),
            L = te(B, R, A / M),
            _ = te(F, v, (A + 1) / M),
            z = te(B, R, (A + 1) / M);
          (Ge(
            st,
            P / H,
            Math.max(Ye(P, L), mo(P, L) + S.h) / ot + 0.012,
            L / H,
          ),
            Ge(
              Ne,
              _ / H,
              Math.max(Ye(_, z), mo(_, z) + S.h) / ot + 0.012,
              z / H,
            ),
            dt.seg(st, Ne, Ke(st, 1.8), Ke(Ne, 1.8), Pl, 0.8, 0.8));
        }
      }
    }
  if (we && !o) {
    const f = S.bridge ? S.bridge.st : 0,
      h = N[we.a],
      p = $[we.a],
      m = N[we.b],
      x = $[we.b],
      g = (Math.max(Ye(h, p), Ye(m, x)) + 1.6) / ot;
    (Ge(st, h / H, g, p / H),
      Ge(Ne, m / H, g, x / H),
      l && dt.seg(st, Ne, Ke(st, 3.2), Ke(Ne, 3.2), zl[f], 0.95, 0.95));
    const w = (h + m) / 2,
      y = (p + x) / 2;
    (Ge(fe, w / H, g + 0.2, y / H + 0.05),
      Me.bridge.userData.set(
        k("bridge"),
        [k("brOpen"), k("brCaution"), k("brClosed")][f],
        ["#7fe3ff", "#ffb454", "#ff6b86"][f],
      ),
      (Me.bridge.userData.want =
        n * (s === "city" || (l && f > 0) ? 1 : 0) * (t === "lab" ? 1 : 0)),
      yo(Me.bridge, fe, 25, -1.3, f > 0 ? 2 : 6),
      Ge(fe, w / H - 0.18, (mo(w, y) + S.h) / ot + 0.42, y / H - 0.1));
    const F =
      u.scen === "dam"
        ? u.hrs < b.damArrive + b.damRise
          ? "\u25B2"
          : "\u25BC"
        : u.phase === 4
          ? "\u25BC"
          : "\u25B2";
    (Me.level.userData.set(
      `${k("tagLevel")} ${u.S.toFixed(2)} m ${u.S > b.alert - 0.6 ? F : ""}`,
      k("ph")[u.phase],
      pe[u.phase],
    ),
      (Me.level.userData.want = n * (t === "lab" || t === "studio" ? 1 : 0)),
      yo(Me.level, fe, 31, 1.2, 0));
  }
  if (
    (o ||
      S.hoods.slice(0, 3).forEach((f, h) => {
        const p = Me["h" + h];
        (Ge(fe, f.cx / H, d(f.cx, f.cz, 0.16), f.cz / H),
          p.userData.set(f.label, `${ze(f.wet)} ${k("houses")}`, "#ff6b86"),
          (p.userData.want =
            n * (f.wet >= 10 ? 1 : 0) * (s === "city" || h < 2 ? 1 : 0)),
          yo(p, fe, 27, h === 1 ? -1 : 1, 1 + h * 3));
      }),
    l && !o)
  ) {
    const f = new Set();
    let h = 0;
    for (const p of S.routes) {
      if (h > 0) break;
      const m = p.shelter;
      if (f.has(m)) continue;
      f.add(m);
      const x = Me["s" + h];
      (Ge(fe, m.x / H, d(m.x, m.z, 0.2) + 0.15, m.z / H),
        x.userData.set(
          Ll(m.n),
          `${k("shelter").toLowerCase()} \xB7 ${ze(Math.round(m.load))} ${ne === "pt" ? "pessoas" : "people"}`,
          m.st === 1 || m.load > b.cap ? "#ffb454" : "#6fd6a0",
        ),
        (x.userData.want = n * 0.95),
        yo(x, fe, 24, 1, 4 + h * 4),
        h++);
    }
    if (oo && S.hosp) {
      Ge(fe, oo.x / H, d(oo.x, oo.z, 0.2) + 0.15, oo.z / H);
      const p = S.hosp;
      (Me.hosp.userData.set(
        k("hosp"),
        p.st === 2 ? k("flooded") : p.cut ? k("accCut") : k("accOk"),
        p.st === 2 ? "#ff6b86" : p.cut ? "#ffb454" : "#f2f6ff",
      ),
        (Me.hosp.userData.want =
          n *
          0.9 *
          (p.st > 0 || p.cut || I.position.distanceTo(fe) < 6 ? 1 : 0)),
        yo(Me.hosp, fe, 24, 1, p.st > 0 || p.cut ? 3 : 9));
    }
    if (S.nogoArea > 0.05 && S.hoods[0]) {
      const p = S.hoods[0];
      (Ge(fe, p.cx / H + 0.06, d(p.cx, p.cz, 0.04), p.cz / H + 0.12),
        Me.nogo.userData.set(
          k("nogo"),
          `${k("deep")} ${(u.scen === "dam" ? b.nogoDam : b.nogo).toFixed(1)} m \xB7 ${ze(S.nogoArea, 1)} km\xB2`,
          "#ff6b86",
        ),
        (Me.nogo.userData.want = n * 0.9),
        yo(Me.nogo, fe, 24, -1.4, 2));
    }
    if (S.iso >= 15 && S.isoAt) {
      const [p, m] = S.isoAt;
      (Ge(fe, p / H, d(p, m, 0.2), m / H),
        Me.iso.userData.set(
          k("cutoff"),
          `${ze(S.iso)} ${k("houses")}`,
          "#ffb454",
        ),
        (Me.iso.userData.want = n * 0.9),
        yo(Me.iso, fe, 24, 1, 5));
    }
  }
  (o &&
    a > 0.3 &&
    (Dr.set(1, 0, 0).applyQuaternion(I.quaternion),
    vo.forEach((f, h) => {
      const p = Me["ex" + h],
        m = f.lift * a + (h ? 0.16 : 0.9),
        x = 23;
      (Ge(st, -ue, m, be * 0.55),
        Ge(Ne, -ue - 0.55, m + 0.12, be * 0.55),
        Eo.seg(st, Ne, Ke(st, 1.6), Ke(Ne, 1.6), Tr, 0.25, 0.6));
      const g = (Ke(Ne, x) * 2 * 640) / 104;
      fe.copy(Ne).addScaledVector(Dr, -g / 2 - Ke(Ne, 4));
      const w = k("ex")[h] + (h === 3 ? u.S.toFixed(2) + " m" : "");
      (p.userData.set(
        `${h + 1}  ${w}`,
        "",
        ["#c9a77a", "#7fe3ff", "#ffa552", "#3aa6e8", "#f2f6ff", "#ff6b86"][h],
        1,
      ),
        (p.userData.want = n * Zt(0.3, 0.7, a)),
        va(p, fe, x));
    })),
    Bl());
  for (const f of Object.values(Me))
    f.userData.fr !== Rn &&
      ((f.userData.want = 0), va(f, fe.copy(f.position), f.userData.px || 22));
  (Rn++, Eo.end(), dt.end());
}
const Ra = [],
  Ol = Array.from({ length: 24 }, () => new r.Vector3()),
  ts = [];
function yo(e, t, o, a, n) {
  Ra.push([e, Ol[Ra.length % 24].copy(t), o, a, n]);
}
function Bl() {
  (Ra.sort((o, a) => o[4] - a[4]), (ts.length = 0));
  const e = Lt.clientWidth,
    t = Lt.clientHeight;
  for (const [o, a, n, s] of Ra) {
    if (o.userData.want <= 0) {
      va(o, a, n, s);
      continue;
    }
    fe.copy(a).project(I);
    const l = (fe.x * 0.5 + 0.5) * e,
      i = (-fe.y * 0.5 + 0.5) * t,
      c = n * 0.92,
      d = (n * (o.userData.pw || 420)) / 104 + 6;
    let f = !1;
    if (fe.z < 1)
      for (const h of [s, s + 1.3, s - 1.3, s + 2.6, s - 2.6]) {
        const p = i - h * n,
          m = [l - d / 2, p - c / 2, l + d / 2, p + c / 2];
        if (
          ts.every(
            (x) => m[2] < x[0] || m[0] > x[2] || m[3] < x[1] || m[1] > x[3],
          )
        ) {
          (ts.push(m), va(o, a, n, h), (f = !0));
          break;
        }
      }
    f || ((o.userData.want = 0), va(o, a, n, s));
  }
  Ra.length = 0;
}
const Dt = {
    lab: {
      t: [-0.05, 2.2, -2.1],
      yaw: 0.26,
      pitch: 0.66,
      dist: 10.6,
      f: [-0.05, 2.2, -2.1],
      r: 4.6,
      fit: [8.6, 5.2],
    },
    exploded: {
      t: [-1.9, 3.25, 0],
      yaw: -0.42,
      pitch: 0.28,
      dist: 24,
      f: [0, 3.2, 0],
      r: 10,
      fit: [17, 10.4],
    },
    studio: {
      t: [0.1, 0.55, 0],
      yaw: 0.55,
      pitch: 0.66,
      dist: 17.5,
      f: [0, 0.5, 0],
      r: 7,
      fit: [14.4, 9.2],
    },
  },
  os = {
    lab: { t: [-0.15, 2.22, -1.6], yaw: 0.06, pitch: 0.86, dist: 15 },
    exploded: { t: [0, 3.3, 0], yaw: -0.5, pitch: 0.36, dist: 25 },
    studio: { t: [0, 0.5, 0], yaw: 0.2, pitch: 0.85, dist: 17 },
  },
  q = { t: new r.Vector3(0, 3, 0), yaw: 0, pitch: 0.2, dist: 15 };
let ln = 4,
  ht = 1,
  cn = 1,
  Yo = !1,
  rt = !1,
  Zo = !1,
  as = [14.6, 6.4],
  zr = 15;
const Ze = Y.domElement,
  wo = new Map();
let dn = 0,
  Jo = null,
  pt = null,
  ns = null;
const Wt = new r.Raycaster(),
  fn = new r.Vector2();
function Qo(e) {
  const t =
    Yo && I.aspect < 0.8 ? Object.keys(Dt).find((a) => Dt[a] === e) : null;
  if (e.aim) {
    const a = e.aim();
    e = { ...e, t: [a.x, a.y, a.z], f: [a.x, a.y, a.z] };
  }
  const o = t ? { ...e, ...os[t] } : e;
  (q.t.set(...o.t),
    (q.yaw = o.yaw),
    (q.pitch = o.pitch),
    (q.dist = o.dist),
    zo.set(...(o.f || o.t)),
    (ln = o.r),
    o.fit && ((as = o.fit), (zr = o.dist)),
    (ht = 1),
    (rt = !1),
    Xr());
}
const Fr = [],
  ro = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), Fr.push(e));
  },
  Mo = (e, t, o) =>
    e.traverse((a) => {
      a.isMesh && ro(a, t, o);
    });
(ro(j.lv.hit, "lv"),
  Mo(j.lv.knob, "lv"),
  ro(j.lv.chevL.userData.hit, "chev", { d: -1 }),
  ro(j.lv.chevR.userData.hit, "chev", { d: 1 }),
  Mo(j.kSeason, "scen", { s: "seasonal" }),
  Mo(j.kDam, "scen", { s: "dam" }),
  Mo(j.kCity, "layer", { l: "city" }),
  Mo(j.kRisk, "layer", { l: "risk" }),
  Mo(j.kResp, "layer", { l: "response" }),
  ro(j.hydro, "hydro"),
  ro(ut.userData.hit, "float"),
  Mo(Vo.parent, "colm"),
  Dn.forEach((e) => ro(e.hit, "link", { L: e })));
const un = new r.Mesh(
  new r.PlaneGeometry(2 * ue, 2 * be).rotateX(-Math.PI / 2),
  new r.MeshBasicMaterial({ visible: !1 }),
);
((un.position.y = 1.6), ft.add(un), ro(un, "land"));
const Lr = new r.Mesh(
  new r.PlaneGeometry(40, 8),
  new r.MeshBasicMaterial({ visible: !1 }),
);
((Lr.position.z = 0.06), Le.add(Lr));
function ss(e) {
  const t = Ze.getBoundingClientRect();
  (fn.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Wt.setFromCamera(fn, I));
  const o = Wt.intersectObjects(
    Fr.filter(
      (s) =>
        (s.visible ||
          s === un ||
          s === j.lv.hit ||
          s === ut.userData.hit ||
          s.userData.hk.kind === "chev") &&
        lr(s, !0),
    ),
    !1,
  );
  let a = o[0];
  if (
    (a &&
      a.object.userData.hk.kind === "lv" &&
      (a = o.find((s) => s.object.userData.hk.kind === "chev") || a),
    a && a.object.userData.hk.kind === "land")
  ) {
    const s = o.find((l) => l.object.userData.hk.kind === "link");
    if (s) {
      const l = Er(Wt);
      (!l || l.distanceTo(Wt.ray.origin) > s.distance - 0.02) && (a = s);
    }
  }
  if (!a) return null;
  const n = a.object.userData.hk;
  if (n.kind === "land") {
    const s = Er(Wt);
    return s ? { ...n, point: s, dist: a.distance } : null;
  }
  return { ...n, point: a.point, dist: a.distance };
}
function Er(e) {
  const t = e.ray.origin,
    o = e.ray.direction,
    a = Mt.position;
  let n = 0;
  for (let s = 0.5; s < 80; s += 0.05) {
    const l = (t.x + o.x * s - a.x) * H,
      i = (t.z + o.z * s - a.z) * H,
      c = t.y + o.y * s - a.y;
    if (Math.abs(l) > O.half[0] || Math.abs(i) > O.half[1]) {
      if (s > 40) break;
      continue;
    }
    const d = Ye(l, i) / ot,
      f = Ce(C.HM, l, i) < S.h || sr(l, i) < 0 ? (mo(l, i) + S.h) / ot : -1;
    if (c <= Math.max(d, f))
      return new r.Vector3(t.x + o.x * s, t.y + o.y * s, t.z + o.z * s);
    n = s;
  }
  return null;
}
const ea = new r.Vector3();
function Hl() {
  const e = Wt.intersectObject(j.hydro, !1)[0];
  if (!e) return null;
  j.hydro.worldToLocal(ea.copy(e.point));
  const t = 4.7,
    o = (ea.x / t + 0.5) * 1024,
    a = 70;
  return W((o - a) / (1e3 - a), 0, 1);
}
function Il() {
  const e = new r.Plane().setFromNormalAndCoplanarPoint(
      ea.set(0, 0, 1).applyQuaternion(I.quaternion).setY(0).normalize(),
      kt.getWorldPosition(new r.Vector3()),
    ),
    t = Wt.ray.intersectPlane(e, new r.Vector3());
  return t
    ? (kt.worldToLocal(t), W((t.y - Pe.y0) * Pe.mPerU, 0, Pe.max))
    : null;
}
let Pa = null;
function Gl(e) {
  if (e)
    switch (e.kind) {
      case "chev":
        u.scen === "dam" ? xo(u.hrsT + e.d * 2) : so(u.ST + e.d * 0.25);
        break;
      case "scen":
        (Tt(e.s), it(k("flashScen")[e.s === "dam" ? 1 : 0]));
        break;
      case "layer":
        (jo(e.l), it(k("flashLayer")[Jn.indexOf(e.l)]));
        break;
      case "hydro": {
        const t = Hl();
        if (t == null) break;
        u.scen === "dam"
          ? xo(te(wt[0], wt[1], t))
          : ((u.day = t * _o),
            (u.playedFrom = 1),
            (u.ST = Uo(u.day)),
            u.play && nt(!1));
        break;
      }
      case "land": {
        Mt.worldToLocal(ea.copy(e.point));
        const t = ea.x * H,
          o = ea.z * H,
          a = Ce(C.HM, t, o),
          n = a < S.h ? S.h - a + Ce(C.F, t, o) : 0;
        it(k("depthHere")(n > 0 ? n.toFixed(1) : 0, (a - S.h).toFixed(1)));
        break;
      }
      case "link":
        window.open(si, "_blank", "noopener");
        break;
    }
}
function Or() {
  if (Pa)
    switch (Pa.kind) {
      case "lv": {
        const e = j.lv.fromRay(Wt);
        if (e == null) break;
        const t = bo[u.scen];
        u.scen === "dam" ? xo(te(t[0], t[1], e)) : so(te(t[0], t[1], e));
        break;
      }
      case "float": {
        if (u.scen === "dam") break;
        const e = Il();
        e != null && so(e);
        break;
      }
    }
}
function rs(e, t) {
  const o =
      (I.position.distanceTo(q.t) *
        2 *
        Math.tan(r.MathUtils.degToRad(I.fov / 2))) /
      Math.max(Lt.clientHeight, 1),
    a = Math.cos(q.yaw),
    n = Math.sin(q.yaw);
  ((rt = !0),
    (q.t.x = W(q.t.x - a * e * o, -12, 12)),
    (q.t.z = W(q.t.z + n * e * o, -8.5, 8)),
    (q.t.y = W(q.t.y + t * o, 0.4, 9)));
}
const Br = {
    lv: () => (u.scen === "dam" ? k("tipSliderDam") : k("tipSlider")),
    chev: (e) =>
      u.scen === "dam"
        ? e.d < 0
          ? "\u22122 h"
          : "+2 h"
        : e.d < 0
          ? "\u22120.25 m"
          : "+0.25 m",
    scen: (e) => k("flashScen")[e.s === "dam" ? 1 : 0],
    layer: (e) => k("flashLayer")[Jn.indexOf(e.l)],
    hydro: () =>
      u.scen === "dam"
        ? k("tipSliderDam")
        : ne === "pt"
          ? "Toque um dia da cheia"
          : "Tap a day of the event",
    float: () => (u.scen === "dam" ? k("tipFloatDam") : k("tipFloat")),
    colm: () => (u.scen === "dam" ? k("tipFloatDam") : k("tipFloat")),
    land: () => k("tipRiver"),
    link: () => k("tipLink"),
  },
  So = E("#tip");
let za = null;
function _l(e) {
  const t = ss(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== za && (za?.over(!1), o?.over(!0), (za = o)),
    (Ze.style.cursor = t
      ? t.kind === "lv"
        ? "ew-resize"
        : t.kind === "float" || t.kind === "colm"
          ? "ns-resize"
          : t.kind === "land"
            ? "crosshair"
            : "pointer"
      : ""));
  const a = t && Br[t.kind] ? Br[t.kind](t) : "";
  a
    ? ((So.textContent = a),
      (So.style.left = e.clientX + "px"),
      (So.style.top = e.clientY + "px"),
      So.classList.add("on"))
    : So.classList.remove("on");
}
(Ze.addEventListener("contextmenu", (e) => e.preventDefault()),
  Ze.addEventListener("pointerleave", () => {
    (za?.over(!1),
      (za = null),
      So.classList.remove("on"),
      (Ze.style.cursor = ""));
  }),
  Ze.addEventListener("pointerdown", (e) => {
    $e();
    try {
      Ze.setPointerCapture(e.pointerId);
    } catch {}
    (So.classList.remove("on"),
      wo.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (Jo = null));
    const t = e.button === 0 && !e.shiftKey && wo.size === 1 ? ss(e) : null;
    ((ns = t),
      (pt =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null),
      t &&
        (t.kind === "lv" || t.kind === "float" || t.kind === "colm") &&
        ((Pa = { kind: t.kind === "colm" ? "float" : t.kind }),
        (Zo = !0),
        (pt = null),
        Or()));
  }),
  Ze.addEventListener("pointermove", (e) => {
    const t = wo.get(e.pointerId);
    if (!t) {
      _l(e);
      return;
    }
    const o = e.clientX - t[0],
      a = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), Pa)) {
      const n = Ze.getBoundingClientRect();
      (fn.set(
        ((e.clientX - n.left) / n.width) * 2 - 1,
        -(((e.clientY - n.top) / n.height) * 2 - 1),
      ),
        Wt.setFromCamera(fn, I),
        Or());
      return;
    }
    if (
      (pt &&
        Math.hypot(e.clientX - pt[0], e.clientY - pt[1]) > 6 &&
        (pt = null),
      !pt)
    ) {
      if (((rt = !0), wo.size === 2)) {
        const [n, s] = [...wo.values()],
          l = Math.hypot(n[0] - s[0], n[1] - s[1]),
          i = [(n[0] + s[0]) / 2, (n[1] + s[1]) / 2];
        (dn && (ht = W((ht * dn) / l, 0.25, 2.2)),
          (dn = l),
          Jo && rs(i[0] - Jo[0], i[1] - Jo[1]),
          (Jo = i));
        return;
      }
      t[2]
        ? rs(o, a)
        : ((q.yaw -= o * 0.004),
          (q.pitch = W(q.pitch + a * 0.003, -0.05, 1.4)));
    }
  }));
const Hr = (e) => {
  (pt && wo.size === 1 && performance.now() - pt[2] < 450 && !Zo && Gl(ns),
    (pt = null),
    (ns = null),
    (Zo = !1),
    (Pa = null),
    wo.delete(e.pointerId),
    (dn = 0),
    (Jo = null));
};
(Ze.addEventListener("pointerup", Hr),
  Ze.addEventListener("pointercancel", (e) => {
    ((pt = null), Hr(e));
  }),
  Ze.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        $e(),
        (rt = !0),
        (ht = W(
          ht * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.25,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const ta = new Set();
(addEventListener("keyup", (e) => ta.delete(e.key.toLowerCase())),
  addEventListener("blur", () => ta.clear()));
const Ul = new r.Vector3();
function Nl() {
  if (!ta.size) return;
  const e = (ta.has("shift") ? 2.4 : 1) * qo,
    t = (...n) => n.some((s) => ta.has(s));
  let o = 0,
    a = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (a += 1),
    t("s", "arrowdown") && (a -= 1),
    (o || a) &&
      (rs(o * e * 420, 0),
      q.t.addScaledVector(
        Ul.set(-Math.sin(q.yaw), 0, -Math.cos(q.yaw)),
        a * e * 5,
      )),
    t("q") && (q.yaw += e * 1.1),
    t("e") && (q.yaw -= e * 1.1),
    t("=", "+") && (ht = W(ht * Math.exp(-e * 1.3), 0.25, 2.2)),
    t("-", "_") && (ht = W(ht * Math.exp(e * 1.3), 0.25, 2.2)),
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
    ) && (rt = !0));
}
let ko = !0,
  oa = -99,
  hn = -1,
  ce = null,
  aa = 0;
const qt = (e) => () => {
    (u.scen !== "seasonal" && Tt("seasonal"), (u.ST = e), (u.playedFrom = 0));
  },
  Co = (e) => () => jo(e),
  $l = (e) => () => Tt(e),
  Vl = (e) => () => {
    u.hrsT = u.hrs = e;
  },
  pn = (e) => () => nt(e),
  Wl = (e) => () => {
    (u.scen !== "seasonal" && Tt("seasonal"),
      (u.day = e),
      (u.playedFrom = 1),
      (u.ST = Uo(e)));
  },
  ql = () => {
    (Tt("seasonal"),
      jo("response"),
      nt(!1),
      (u.ST = u.S = 7.9),
      (u.crest = u.low = 7.9),
      (u.playedFrom = 0));
  },
  Ir = (e, t, o = 0) => wr("lab", e / H, Ye(e, t) / ot + o, t / H),
  jl = () =>
    we
      ? Ir((N[we.a] + N[we.b]) / 2, ($[we.a] + $[we.b]) / 2, 0.05)
      : wr("lab", 0, 0.4, 0),
  Xl = () => {
    const e = S.hoods[0] || to[0];
    return Ir(e.wet ? e.cx : e.x, e.wet ? e.cz : e.z, 0.02);
  },
  is = [
    {
      view: "lab",
      ...Dt.lab,
      dy: 0.004,
      hold: 14,
      wide: 1,
      beats: [
        [0, ql],
        [1.2, qt(8.7)],
        [9.5, qt(8.25)],
      ],
    },
    {
      view: "lab",
      aim: jl,
      yaw: -0.62,
      pitch: 0.46,
      dist: 4.6,
      dy: 0.01,
      r: 2,
      hold: 10,
      beats: [
        [0, Co("city")],
        [0, qt(6.6)],
        [1, qt(8.6)],
      ],
    },
    {
      view: "lab",
      t: [0.45, 2.2, -1.15],
      yaw: 0.04,
      pitch: 1.12,
      dist: 12.4,
      dy: 0.002,
      f: [0.45, 2.2, -1.15],
      r: 5,
      hold: 10,
      wide: 1,
      beats: [
        [0, Co("risk")],
        [0, qt(5.6)],
        [0.6, qt(10.4)],
      ],
    },
    {
      view: "lab",
      aim: Xl,
      yaw: 0.72,
      pitch: 0.52,
      dist: 5.2,
      dy: -0.01,
      r: 2.2,
      hold: 10,
      beats: [
        [0, Co("response")],
        [0, qt(8.6)],
      ],
    },
    {
      view: "lab",
      ...Dt.lab,
      t: [-1.05, 2.2, -2],
      f: [-1.05, 2.2, -2],
      yaw: -0.1,
      pitch: 0.72,
      dist: 14.5,
      dy: 0.004,
      hold: 14,
      wide: 1,
      beats: [
        [0, Co("response")],
        [0, $l("dam")],
        [0, Vl(-3)],
        [0.8, pn(!0)],
        [13.5, pn(!1)],
      ],
    },
    {
      view: "exploded",
      ...Dt.exploded,
      dy: 0.008,
      hold: 11,
      wide: 1,
      beats: [
        [0, Co("response")],
        [0, qt(8.6)],
      ],
    },
    {
      view: "studio",
      ...Dt.studio,
      dy: -0.006,
      hold: 9,
      wide: 1,
      beats: [
        [0, Co("response")],
        [0, qt(8.3)],
      ],
    },
    {
      view: "lab",
      t: [0, 3.4, -3.4],
      yaw: 0.12,
      pitch: 0.3,
      dist: 25.5,
      dy: 0.003,
      f: [0, 2.6, -2],
      r: 8,
      fit: [19, 10.5],
      hold: 14,
      wide: 1,
      beats: [
        [0, Co("response")],
        [0, Wl(0)],
        [0.5, pn(!0)],
        [13.8, pn(!1)],
      ],
    },
  ];
function ls(e, t) {
  ((hn = e), (ce = is[e]), (aa = 0));
  let o =
    Yo && I.aspect < 0.8 && ce.wide && os[ce.view]
      ? { ...ce, ...os[ce.view] }
      : ce;
  if (o.aim) {
    const a = o.aim();
    o = { ...o, t: [a.x, a.y, a.z], f: [a.x, a.y, a.z] };
  }
  ((ce = o),
    ce.view && ce.view !== (Q.next || Q.cur)
      ? (Aa(ce.view, !1, o), (oa = t + 0.2))
      : (Qo(o), (oa = t)));
}
function Kl(e) {
  (e < oa - 1 && (oa = e),
    (!ce || e - oa > ce.hold) && ls((hn + 1) % is.length, e));
  const t = e - oa;
  if (!(t < 0)) {
    for (; aa < ce.beats.length && t >= ce.beats[aa][0];)
      (ce.beats[aa][1](), aa++);
    rt ||
      ((q.yaw = ce.yaw + t * ce.dy),
      (q.dist = ce.dist * (1 - t * 0.006)),
      zo.set(...(ce.f || ce.t)),
      (ln = ce.r));
  }
}
function io(e) {
  ((ko = e),
    E("#cine").classList.toggle("on", e),
    E("#cine").setAttribute("aria-pressed", e),
    e && ((ce = null), (hn = -1), (rt = !1), (ht = 1)));
}
let lo = null;
const $e = () => {
  ((lo = null), ko && io(!1));
};
function cs() {
  (io(!1), Qo(Dt[Q.cur]));
}
function Yl(e) {
  const t = rt ? 0 : Math.sin(e / 8) * 0.02,
    o = ko ? ce?.wide : lo ? lo.wide : !0,
    a = q.dist * ht * (o ? cn : te(1, cn, 0.5)),
    n = q.yaw + t,
    s = Math.asin(W((0.35 - q.t.y) / Math.max(a, 0.1), -1, 1)),
    l = Math.max(q.pitch, s),
    i = Math.cos(l);
  ct.set(Math.sin(n) * i, Math.sin(l), Math.cos(n) * i);
  let c = a;
  if (Q.cur === "lab") {
    const p = [
        [-15.2, Ya - 0.4],
        [0.35, 40],
        [X + 0.5, 26],
      ],
      m = [q.t.x, q.t.y, q.t.z],
      x = [ct.x, ct.y, ct.z];
    for (let g = 0; g < 3; g++) {
      if (Math.abs(x[g]) < 1e-6) continue;
      const w = x[g] > 0 ? p[g][1] : p[g][0],
        y = (w - m[g]) / x[g];
      y > 0 && y < c && (c = Math.max(1.5, y));
    }
    if (q.t.z + ct.z * c < X + 10.6 && ct.y > 1e-4) {
      const g = (He - 0.7 - q.t.y) / ct.y;
      g > 0 && g < c && (c = Math.max(1.5, g));
    }
  }
  (I.position.set(q.t.x + ct.x * c, q.t.y + ct.y * c, q.t.z + ct.z * c),
    I.lookAt(q.t),
    !ko && !rt && lo && (zo.set(...(lo.f || lo.t)), (ln = lo.r)));
  const d = I.position.distanceTo(rt ? q.t : zo),
    f = rt ? Math.min(1, qo * 5) : 1,
    h = (rt ? Math.max(2.4, d * 0.3) : ln) * D.focalBand;
  ((tt.u.focus.value += (d - tt.u.focus.value) * f),
    (tt.u.range.value += (h - tt.u.range.value) * f),
    tt.u.cocScale.value.set(D.apertureNear, D.aperture));
}
const ds = [...document.querySelectorAll("#seg-view button")],
  Gr = [...document.querySelectorAll("#seg-scen button")],
  _r = [...document.querySelectorAll("#seg-layer button")];
(ds.forEach(
  (e) =>
    (e.onclick = () => {
      ($e(), Aa(e.dataset.v));
    }),
),
  Gr.forEach(
    (e) =>
      (e.onclick = () => {
        ($e(), Tt(e.dataset.s));
      }),
  ),
  _r.forEach(
    (e) =>
      (e.onclick = () => {
        ($e(), jo(e.dataset.l));
      }),
  ),
  (E("#play").onclick = () => {
    ($e(), nt(!u.play));
  }));
const Rt = E("#slide-m");
{
  const e = Rt;
  let t = !1;
  const o = (n) => {
    const s = e.getBoundingClientRect(),
      l = W((n.clientX - s.left) / s.width, 0, 1),
      i = bo[u.scen];
    u.scen === "dam" ? xo(te(i[0], i[1], l)) : so(te(i[0], i[1], l));
  };
  (e.addEventListener("pointerdown", (n) => {
    ($e(), (t = !0), (Zo = !0), e.setPointerCapture(n.pointerId), o(n));
  }),
    e.addEventListener("pointermove", (n) => {
      t && o(n);
    }));
  const a = () => {
    ((t = !1), (Zo = !1));
  };
  (e.addEventListener("pointerup", a),
    e.addEventListener("pointercancel", a),
    e.addEventListener("keydown", (n) => {
      if (n.key === "ArrowLeft" || n.key === "ArrowRight") {
        (n.preventDefault(), n.stopPropagation(), $e());
        const s = n.key === "ArrowLeft" ? -1 : 1;
        u.scen === "dam" ? xo(u.hrsT + s) : so(u.ST + s * 0.1);
      }
    }));
}
function fs() {
  Rt.querySelectorAll(".tk,.band,.hist").forEach((n) => n.remove());
  const e = bo[u.scen],
    t = (n) => ((n - e[0]) / (e[1] - e[0])) * 100,
    o = document.createDocumentFragment(),
    a = (n, s, l, i) => {
      const c = document.createElement("div");
      if (
        ((c.className = n),
        (c.style.left = s + "%"),
        Object.assign(c.style, l || {}),
        i)
      ) {
        const d = document.createElement("b");
        ((d.textContent = i), c.appendChild(d));
      }
      return (o.appendChild(c), c);
    };
  if (u.scen === "seasonal") {
    const n = [
      [b.alert, b.mobil, pe[1]],
      [b.mobil, b.crit, pe[2]],
      [b.crit, b.extreme, pe[3]],
      [b.extreme, e[1], "#c77dff"],
    ];
    for (const [s, l, i] of n) {
      const c = a("band", t(s), { width: t(l) - t(s) + "%", background: i });
    }
    for (const [s, l] of [
      [b.alert, pe[1]],
      [b.crit, pe[3]],
      [b.extreme, "#c77dff"],
    ])
      a("tk", t(s), { background: l }, s.toFixed(1));
    for (const s of On) {
      const l = a("hist", t(s.s));
      l.title = `${k("hist")}: ${s.s.toFixed(2)} m (${s.src})`;
    }
  } else
    for (const [n, s] of [
      [0, k("breach")],
      [b.damArrive, k("arrive")],
    ])
      a("tk", t(n), { background: "#ff9db0" }, s);
  (Rt.insertBefore(o, Rt.querySelector(".fl")),
    (E("#m-l").textContent = u.scen === "dam" ? k("mTime") : k("mLevel")),
    Rt.setAttribute("aria-label", u.scen === "dam" ? k("mTime") : k("mLevel")),
    Rt.setAttribute("aria-valuemin", e[0]),
    Rt.setAttribute("aria-valuemax", e[1]));
}
function Ur() {
  const e = E("#legend"),
    t = u.layer;
  if (t === "risk") {
    const o = ["#c73a33", "#e5843a", "#eccd73", "#8cb36b", "#5577a0"],
      a =
        ne === "pt"
          ? [
              "< 1 m muito alta",
              "1\u20135 alta",
              "5\u201310 m\xE9dia",
              "10\u201325 baixa",
              "> 25 muito baixa",
            ]
          : [
              "< 1 m very high",
              "1\u20135 high",
              "5\u201310 medium",
              "10\u201325 low",
              "> 25 very low",
            ];
    ((e.innerHTML =
      `<em>${k("legRisk")}</em>` +
      o
        .map((n, s) => `<span><s style="background:${n}"></s>${a[s]}</span>`)
        .join("")),
      (e.hidden = !1));
  } else if (t === "response") {
    const o = [
      ["#8cc6eb", k("lgOpen")],
      ["#ffb454", k("lgCaution")],
      ["#ff6b86", k("lgCut")],
      ["#e6f7ff", k("lgRoute")],
      ["#6fd6a0", k("lgSh")],
      [
        "repeating-linear-gradient(45deg,#ff6b86 0 3px,#3a1f2a 3px 6px)",
        k("lgNogo"),
      ],
      ["#ff8ea0", k("lgWet")],
      ["#ffc054", k("lgIso")],
    ];
    ((e.innerHTML =
      `<em>${k("legResp")}</em>` +
      o
        .map(([a, n]) => `<span><s style="background:${a}"></s>${n}</span>`)
        .join("")),
      (e.hidden = !1));
  } else e.hidden = !0;
}
const co = (e) => e.toFixed(1),
  na = (e) => e.toFixed(2);
function Zl() {
  const e = u.S,
    t = k("ph")[u.phase],
    o = u.scen === "dam",
    a = o && u.phase === 2 ? k("actDam") : k("act")[u.phase];
  return o && u.hrs >= 0 && u.hrs < b.damArrive
    ? k("whyDam")(
        co(b.damArrive - u.hrs),
        co(Math.max(b.damPeak, b.damBase)),
        t,
        a,
      )
    : o && u.hrs >= b.damArrive
      ? k("whyDamOn")(co(u.hrs), na(e), ze(S.wet), ze(S.people), t, a)
      : e < b.alert
        ? k("whyLow")(na(e), co(b.alert - e), t, a)
        : k("whyHigh")(
            na(e),
            co(e - b.alert),
            ze(S.wet),
            ze(S.people),
            ze(S.cutKm, 1),
            t,
            a,
          );
}
let Nr = 0;
function jt(e) {
  if (!e && le - Nr < 0.12) return;
  Nr = le;
  const t = u.scen === "dam",
    o = bo[u.scen],
    a = t ? (u.hrs - o[0]) / (o[1] - o[0]) : (u.S - o[0]) / (o[1] - o[0]);
  (Ha.style.setProperty("--ph", pe[u.phase]),
    (E("#s-a").innerHTML = na(u.S) + "<small>m</small>"),
    (E("#s-b").innerHTML = ze(S.wet) + "<small>" + k("houses") + "</small>"),
    (E("#s-c").innerHTML = ze(S.cutKm, 1) + "<small>km</small>"),
    (Rt.querySelector(".kn").style.left = W(a * 100, 0, 100) + "%"),
    (Rt.querySelector(".fl").style.width = W(a * 100, 0, 100) + "%"),
    (E("#m-v").innerHTML = t
      ? `${u.hrs >= 0 ? "+" : ""}${co(u.hrs)} h \xB7 <b>${na(u.S)} m</b>`
      : `<b>${na(u.S)} m</b>`),
    Rt.setAttribute("aria-valuenow", t ? u.hrs.toFixed(1) : u.S.toFixed(2)),
    document.querySelectorAll("#phases i").forEach((s, l) => {
      (s.classList.toggle("on", l === u.phase),
        s.classList.toggle("past", l < u.phase),
        s.style.setProperty("--c", pe[l]));
    }));
  const n = Zl();
  n !== jt.w && ((E("#why").innerHTML = n), (jt.w = n));
}
function us() {
  ((document.documentElement.lang = ne === "pt" ? "pt-BR" : "en"),
    document.querySelectorAll("[data-t]").forEach((e) => {
      const t = k(e.dataset.t);
      typeof t == "string" && (e.textContent = t);
    }),
    document
      .querySelectorAll("#phases i")
      .forEach((e, t) => (e.textContent = k("ph")[t])),
    (E("#lang").textContent = ne === "pt" ? "EN" : "PT"),
    (E("#info-body").innerHTML = Vr[ne]()),
    fs(),
    Ur(),
    hs(),
    nt(u.play),
    (jt.w = ""),
    jt(!0),
    (j.drawnAt = -9),
    (Qn = -9),
    nn());
}
E("#lang").onclick = () => {
  ne = ne === "pt" ? "en" : "pt";
  try {
    localStorage.setItem(Ro + ":lang", ne);
  } catch {}
  us();
};
const Jl = [
  ["alert", "mobil", "crit", "extreme", "stabDrop"],
  ["s0"],
  ["roadCut", "nogo", "nogoDam"],
  ["ppl", "cap"],
  ["seasonPeak"],
  ["damBase", "damArrive", "damRise", "damPeak", "damFall"],
];
function hs() {
  const e = k("calF");
  ((E("#cal-h").textContent = k("calH")),
    (E("#cal-p").innerHTML = k("calP")),
    (E("#cal-form").innerHTML = Jl.map(
      (t, o) =>
        `<div class="h">${k("calG")[o]}</div>` +
        t
          .map(
            (a) =>
              `<label for="cf-${a}">${e[a][0]}<small>${e[a][1]}</small></label><input id="cf-${a}" type="number" step="${["ppl", "cap"].includes(a) ? 1 : a.startsWith("dam") && a !== "damBase" && a !== "damPeak" ? 0.5 : 0.05}" value="${b[a]}">`,
          )
          .join(""),
    ).join("")));
  for (const [t, o] of [
    ["cal-apply", "calApply"],
    ["cal-reset", "calReset"],
    ["cal-link", "calLink"],
    ["cal-json", "calJson"],
  ])
    E("#" + t).textContent = k(o);
}
function $r() {
  for (const e of En) {
    const t = E("#cf-" + e);
    if (!t) continue;
    const o = parseFloat(t.value);
    isFinite(o) && (b[e] = o);
  }
  (Bn(), Zs(), ps(), (E("#cal-msg").textContent = k("calSaved")));
}
function ps() {
  ($n(u.S, !0, u.scen === "dam"),
    Xn(),
    Zn(),
    (u.crest = Math.min(u.crest, Math.max(u.S, u.crest))),
    nn(),
    fs(),
    hs(),
    (j.drawnAt = -9),
    jt(!0));
}
((E("#calb").onclick = () => {
  (hs(), (E("#cal-msg").textContent = ""), E("#cal").showModal());
}),
  (E("#cal-apply").onclick = $r),
  E("#cal-form").addEventListener("keydown", (e) => {
    e.key === "Enter" && (e.preventDefault(), $r());
  }),
  (E("#cal-reset").onclick = () => {
    (Object.assign(b, Bo),
      Zs(),
      ps(),
      (E("#cal-msg").textContent = k("calSaved")));
  }),
  (E("#cal-link").onclick = async () => {
    try {
      (await navigator.clipboard.writeText(Js()),
        (E("#cal-msg").textContent = k("calCopied")));
    } catch {
      E("#cal-msg").textContent = Js();
    }
  }),
  (E("#cal-json").onclick = async () => {
    const e = JSON.stringify(b, null, 1);
    try {
      (await navigator.clipboard.writeText(e),
        (E("#cal-msg").textContent = k("calCopied")));
    } catch {
      E("#cal-msg").textContent = e;
    }
  }),
  document
    .querySelectorAll("dialog [data-close]")
    .forEach((e) => (e.onclick = () => e.closest("dialog").close())),
  document.querySelectorAll("dialog").forEach((e) =>
    e.addEventListener("click", (t) => {
      t.target === e && e.close();
    }),
  ));
const Vr = {
    en: () => `<h2>How the Mearim floods Pedreiras and Trizidela do Vale</h2>
<p>Two towns face each other across the Mearim in Maranh\xE3o: <b>Trizidela do Vale</b> on the west bank, <b>Pedreiras</b> on the east, joined by the Ponte Francisco S\xE1. Every rainy season, February to May, the river rises. This model asks one question: <b>if the Mearim reaches this level at the Pedreiras gauge, what is under water, and what should the response do?</b></p>
<h3>What you are looking at</h3>
<p>The relief is the real ground: the Copernicus 30 m elevation model of a ${co((O.half[0] * 2) / 1e3)} by ${co((O.half[1] * 2) / 1e3)} km window, heights stretched 8\xD7. The streets, the river's banks, the creeks, the schools and the hospital come from OpenStreetMap. Few buildings are mapped here, so the houses are placed along the mapped streets at the towns' density (${ze(Math.round(Te / 100) * 100)} of them, close to the two towns' urban population at three people a house): they stand for where people live, not for individual buildings. The column on the left of the tank is the gauge, magnified, with the thresholds as coloured bands. Drag its float, the slider on the console, or the one in the card.</p>
<h3>Why the water goes where it goes</h3>
<p>For every point the model knows its <b>height above the nearest drainage</b> (HAND): how far it sits above the river it drains to. When the river rises by h, every point whose HAND to the Mearim is lower than h is under water, and its depth is h minus that height. The water always arrives along a path that is already wet, so a hollow behind a ridge waits until the ridge is overtopped. The same depth closes a street (over ${b.roadCut} m), makes an area NO-GO for teams on foot (over ${b.nogo} m: boats only), floods a house, cuts a school out of the shelter list and sets the hospital's access.</p>
<h3>The layers</h3>
<p><b>City</b>: the towns as they look. <b>Risk</b>: the research's five HAND classes (under 1 m very high, 1 to 5 high, 5 to 10 medium, 10 to 25 low, over 25 very low) with the water's depth in blues. <b>Response</b>: streets open, close to the water or closed; the routes from the flooded neighbourhoods to the nearest open shelter by streets that are still open (crossing the bridge only as a last resort); shelters open, at risk or lost; NO-GO water hatched; houses in water and houses cut off from every shelter. <b>Exploded</b> pulls the model apart into the research's stack: terrain, drainage, HAND, the flood, the city, the response.</p>
<h3>The phases</h3>
<p><b>Vigilance \u2192 Alert \u2192 Mobilization \u2192 Response \u2192 Stabilization.</b> The level against the thresholds sets the first four (alert ${b.alert} m, mobilization ${b.mobil} m, critical ${b.crit} m, extreme ${b.extreme} m by default); once the river has fallen ${b.stabDrop} m from a crest at or over the critical level, the response stabilizes, for as long as it keeps falling. The thresholds are provisional, so none is built in: the sliders button opens them, with the calibration and the dam scenario's numbers, and a link that carries your values.</p>
<h3>The dam scenario</h3>
<p>A separate, hypothetical event: the Flores dam (DNOCS, Josel\xE2ndia, about a billion cubic metres) fails upstream. The slider becomes the hours since the breach. From the first hour the response mobilizes and the dashed line shows how far the crest will reach, so the evacuation can finish before the water arrives. The arrival time, the rise and the crest are illustrative placeholders until the breach study sets them.</p>
<h3>What is exact and what is not</h3>
<p>This is a flood-scenario and decision-support visualization, not a hydrodynamic model. HAND has no velocities, no channel and floodplain exchange, no rain falling on the towns themselves, and a 30 m grid misses embankments, walls and culverts. The elevation model sees roofs and canopy as ground. One constant ties the gauge to the terrain: the reading at HAND 0 (${b.s0} m), set so that the April 2024 crest (7.46 m) puts about as many houses in water as the families reported out of their homes in 2024 and 2026. Schools stand in for shelters; the official list and the protocol's own wording for the actions replace them. The LSTM forecast, once validated, can drive the level in place of the slider.</p>
<h3>Keys</h3>
<p><code>[</code> <code>]</code> level down or up (hours in the dam scenario) \xB7 <code>4</code> <code>5</code> <code>6</code> alert, critical, extreme \xB7 <code>Space</code> run the scenario \xB7 <code>0</code> switch scenario \xB7 <code>1</code> <code>2</code> <code>3</code> City, Risk, Response \xB7 <code>7</code> <code>8</code> <code>9</code> Lab, Exploded, Studio \xB7 <code>C</code> cinematic cameras \xB7 <code>Home</code> reset the view \xB7 <code>.</code> labels \xB7 <code>/</code> hide the interface \xB7 drag to orbit \xB7 right-drag to pan \xB7 scroll to zoom \xB7 <code>W</code><code>A</code><code>S</code><code>D</code> to move, <code>Q</code> <code>E</code> to turn \xB7 <code>\u2318'</code> render tuning.</p>
<h3>Sources</h3>
<p>Elevation: Copernicus GLO-30 (\xA9 DLR e.V. 2010\u20132014 and \xA9 Airbus Defence and Space GmbH 2014\u20132018, provided under COPERNICUS by the European Union and ESA). Streets, river, creeks, schools, hospital: \xA9 OpenStreetMap contributors (ODbL). Populations: IBGE, 2022 census. Flood reports: O Imparcial (April 2024, April 2026). Thresholds, phases and scenarios: the master's research <i>An\xE1lise de Risco com Uso de Modelagem e Protocolo para Resposta Operacional a Inunda\xE7\xF5es em Pedreiras e Trizidela do Vale no Maranh\xE3o</i>, for the Corpo de Bombeiros Militar do Maranh\xE3o.</p>`,
    pt: () => `<h2>Como o Mearim inunda Pedreiras e Trizidela do Vale</h2>
<p>Duas cidades se olham atrav\xE9s do Mearim, no Maranh\xE3o: <b>Trizidela do Vale</b> na margem oeste, <b>Pedreiras</b> na leste, ligadas pela Ponte Francisco S\xE1. A cada esta\xE7\xE3o chuvosa, de fevereiro a maio, o rio sobe. Este modelo faz uma pergunta: <b>se o Mearim chegar a este n\xEDvel na r\xE9gua de Pedreiras, o que fica debaixo d\u2019\xE1gua e o que a resposta deve fazer?</b></p>
<h3>O que voc\xEA est\xE1 vendo</h3>
<p>O relevo \xE9 o terreno real: o modelo de eleva\xE7\xE3o Copernicus de 30 m de uma janela de ${ze((O.half[0] * 2) / 1e3, 1)} por ${ze((O.half[1] * 2) / 1e3, 1)} km, com alturas exageradas 8\xD7. As ruas, as margens do rio, os riachos, as escolas e o hospital v\xEAm do OpenStreetMap. Poucas edifica\xE7\xF5es est\xE3o mapeadas aqui, por isso as casas s\xE3o distribu\xEDdas ao longo das ruas mapeadas na densidade das cidades (${ze(Math.round(Te / 100) * 100)}, perto da popula\xE7\xE3o urbana das duas cidades com tr\xEAs pessoas por casa): representam onde as pessoas moram, n\xE3o edifica\xE7\xF5es individuais. A coluna \xE0 esquerda do tanque \xE9 a r\xE9gua, ampliada, com as cotas como faixas coloridas. Arraste a boia, o controle do console ou o do cart\xE3o.</p>
<h3>Por que a \xE1gua vai para onde vai</h3>
<p>Para cada ponto o modelo conhece a sua <b>altura acima da drenagem mais pr\xF3xima</b> (HAND): quanto ele est\xE1 acima do rio para onde drena. Quando o rio sobe h, todo ponto cujo HAND at\xE9 o Mearim \xE9 menor que h fica debaixo d\u2019\xE1gua, com profundidade igual a h menos essa altura. A \xE1gua sempre chega por um caminho que j\xE1 est\xE1 molhado, ent\xE3o uma baixada atr\xE1s de uma eleva\xE7\xE3o espera at\xE9 a eleva\xE7\xE3o ser vencida. A mesma profundidade fecha uma rua (acima de ${b.roadCut} m), torna uma \xE1rea NO-GO para equipes a p\xE9 (acima de ${b.nogo} m: s\xF3 barcos), alaga uma casa, tira uma escola da lista de abrigos e define o acesso ao hospital.</p>
<h3>As camadas</h3>
<p><b>Cidade</b>: as cidades como s\xE3o. <b>Risco</b>: as cinco classes de HAND da pesquisa (abaixo de 1 m muito alta, 1 a 5 alta, 5 a 10 m\xE9dia, 10 a 25 baixa, acima de 25 muito baixa) com a profundidade da \xE1gua em azuis. <b>Resposta</b>: ruas livres, com \xE1gua perto ou fechadas; as rotas dos bairros alagados at\xE9 o abrigo aberto mais pr\xF3ximo por ruas ainda livres (atravessando a ponte s\xF3 em \xFAltimo caso); abrigos abertos, em risco ou perdidos; \xE1gua NO-GO hachurada; casas na \xE1gua e casas isoladas de qualquer abrigo. <b>Explodida</b> separa o modelo na pilha da pesquisa: terreno, drenagem, HAND, a inunda\xE7\xE3o, a cidade, a resposta.</p>
<h3>As fases</h3>
<p><b>Vigil\xE2ncia \u2192 Alerta \u2192 Mobiliza\xE7\xE3o \u2192 Resposta \u2192 Estabiliza\xE7\xE3o.</b> O n\xEDvel contra as cotas define as quatro primeiras (alerta ${b.alert.toFixed(1).replace(".", ",")} m, mobiliza\xE7\xE3o ${b.mobil.toFixed(1).replace(".", ",")} m, cr\xEDtica ${b.crit.toFixed(1).replace(".", ",")} m, extrema ${b.extreme.toFixed(1).replace(".", ",")} m por padr\xE3o); quando o rio baixa ${String(b.stabDrop).replace(".", ",")} m de um pico igual ou acima da cota cr\xEDtica, a resposta se estabiliza, enquanto ele continuar baixando. As cotas s\xE3o provis\xF3rias, por isso nenhuma est\xE1 fixa: o bot\xE3o de controles as abre, com a calibra\xE7\xE3o e os n\xFAmeros do cen\xE1rio da barragem, e um link que leva os seus valores.</p>
<h3>O cen\xE1rio da barragem</h3>
<p>Um evento separado e hipot\xE9tico: a barragem do Flores (DNOCS, Josel\xE2ndia, cerca de um bilh\xE3o de metros c\xFAbicos) rompe rio acima. O controle passa a ser as horas desde a ruptura. Desde a primeira hora a resposta se mobiliza e a linha tracejada mostra at\xE9 onde o pico vai chegar, para a evacua\xE7\xE3o terminar antes da \xE1gua. O tempo de chegada, a subida e o pico s\xE3o valores ilustrativos at\xE9 o estudo de ruptura defini-los.</p>
<h3>O que \xE9 exato e o que n\xE3o \xE9</h3>
<p>\xC9 uma visualiza\xE7\xE3o de cen\xE1rios de inunda\xE7\xE3o e de apoio \xE0 decis\xE3o, n\xE3o um modelo hidrodin\xE2mico. O HAND n\xE3o tem velocidades, nem troca entre calha e plan\xEDcie, nem chuva caindo sobre as pr\xF3prias cidades, e uma grade de 30 m n\xE3o v\xEA aterros, muros e bueiros. O modelo de eleva\xE7\xE3o enxerga telhados e copas como ch\xE3o. Uma constante liga a r\xE9gua ao terreno: a leitura no HAND 0 (${String(b.s0).replace(".", ",")} m), ajustada para que o pico de abril de 2024 (7,46 m) coloque na \xE1gua tantas casas quanto as fam\xEDlias que sa\xEDram de casa em 2024 e 2026. As escolas fazem o papel de abrigos; a lista oficial e o texto do protocolo para as a\xE7\xF5es as substituem. A previs\xE3o por LSTM, quando validada, pode conduzir o n\xEDvel no lugar do controle.</p>
<h3>Teclas</h3>
<p><code>[</code> <code>]</code> baixar ou subir o n\xEDvel (horas no cen\xE1rio da barragem) \xB7 <code>4</code> <code>5</code> <code>6</code> alerta, cr\xEDtica, extrema \xB7 <code>Espa\xE7o</code> rodar o cen\xE1rio \xB7 <code>0</code> trocar de cen\xE1rio \xB7 <code>1</code> <code>2</code> <code>3</code> Cidade, Risco, Resposta \xB7 <code>7</code> <code>8</code> <code>9</code> Lab, Explodida, Est\xFAdio \xB7 <code>C</code> c\xE2meras cinematogr\xE1ficas \xB7 <code>Home</code> recentrar \xB7 <code>.</code> r\xF3tulos \xB7 <code>/</code> esconder a interface \xB7 arraste para orbitar \xB7 bot\xE3o direito para mover \xB7 role para aproximar \xB7 <code>W</code><code>A</code><code>S</code><code>D</code> para andar, <code>Q</code> <code>E</code> para girar \xB7 <code>\u2318'</code> ajustes de render.</p>
<h3>Fontes</h3>
<p>Eleva\xE7\xE3o: Copernicus GLO-30 (\xA9 DLR e.V. 2010\u20132014 e \xA9 Airbus Defence and Space GmbH 2014\u20132018, fornecido no \xE2mbito do COPERNICUS pela Uni\xE3o Europeia e pela ESA). Ruas, rio, riachos, escolas, hospital: \xA9 colaboradores do OpenStreetMap (ODbL). Popula\xE7\xF5es: IBGE, Censo 2022. Relatos das cheias: O Imparcial (abril de 2024, abril de 2026). Cotas, fases e cen\xE1rios: a pesquisa de mestrado <i>An\xE1lise de Risco com Uso de Modelagem e Protocolo para Resposta Operacional a Inunda\xE7\xF5es em Pedreiras e Trizidela do Vale no Maranh\xE3o</i>, para o Corpo de Bombeiros Militar do Maranh\xE3o.</p>`,
  },
  Xt = [
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
    [
      "bloomThreshold",
      "threshold",
      0,
      3,
      0.05,
      (e) => e.toFixed(2) + "\xD7",
      1,
    ],
    ["ao", "Ambient occlusion", 0, 1, 1, (e) => (e ? "on" : "off")],
    ["aoIntensity", "intensity", 0, 1.5, 0.02, (e) => e.toFixed(2), 1],
    ["aoRadius", "radius", 0.1, 4, 0.05, (e) => e.toFixed(2), 1],
    ["aoSamples", "samples", 2, 16, 1, (e) => e, 1],
    ["auto", "Auto quality", 0, 1, 1, (e) => (e ? "on" : "off")],
  ];
let mt = 0,
  Wr = 0,
  ms = 0,
  vs = 0,
  mn = 0;
function vt() {
  (Y.setPixelRatio(D.pixelRatio),
    et.setPixelRatio(D.pixelRatio),
    la.rt.samples !== D.msaa && ((la.rt.samples = D.msaa), la.rt.dispose()),
    (Ls.enabled = !!D.smaa),
    Ct.alphaToCoverage !== D.msaa > 0 &&
      ((Ct.alphaToCoverage = D.msaa > 0), (Ct.needsUpdate = !0)),
    De.shadow.mapSize.x !== D.shadow &&
      (De.shadow.mapSize.set(D.shadow, D.shadow),
      De.shadow.map?.dispose(),
      (De.shadow.map = null)),
    (Ht.enabled = !!D.bloom),
    (Ht.radius = D.bloomRadius),
    (de.enabled = !0),
    de.updateGtaoMaterial({
      radius: D.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: D.ao ? D.aoSamples : 2,
    }),
    (tt.enabled = !!D.dof),
    (tt.u.maxCoc.value = D.maxCoc),
    es(),
    Kr());
}
function Kt() {
  ((E("#tune-rows").innerHTML = Xt.map(([e, t, o, a, , n, s], l) => {
    const i = D[e],
      c = ((i - o) / (a - o)) * 100;
    return `<div class="tr${l === mt ? " sel" : ""}${s ? " sub" : ""}" data-i="${l}"><b>${t}</b><span class="tk"><i style="left:${W(c, 0, 100)}%"></i></span><u>${n(i)}</u></div>`;
  }).join("")),
    E("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((mt = +e.dataset.i), Kt());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (mt = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const a = (n) => {
            const s = t.getBoundingClientRect(),
              [l, , i, c, d] = Xt[mt],
              f = W(
                Math.round(
                  (i + ((n.clientX - s.left) / s.width) * (c - i)) / d,
                ) * d,
                i,
                c,
              );
            f !== D[l] &&
              ((D[l] = +f.toFixed(4)), l !== "auto" && (D.auto = 0), vt());
            const h = t.querySelector("i");
            ((h.style.left = W(((D[l] - i) / (c - i)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = Xt[mt][5](D[l])),
              (E("#tune-json").value = JSON.stringify(D)));
          };
          (a(o),
            (t.onpointermove = (n) => {
              t.hasPointerCapture(n.pointerId) && a(n);
            }),
            (t.onpointerup = () => Kt()));
        };
      }),
    (E("#tune-json").value = JSON.stringify(D)));
}
function Ql(e, t) {
  const [o, , a, n, s] = Xt[mt],
    l = W(+(D[o] + e * s * (t ? 5 : 1)).toFixed(4), a, n);
  l !== D[o] && ((D[o] = l), o !== "auto" && (D.auto = 0), vt(), Kt());
}
function qr(e) {
  const t = E("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && Kt());
}
function ec(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (mt = (mt + (t === "ArrowUp" ? -1 : 1) + Xt.length) % Xt.length),
      Kt(),
      E("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (Ql(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , a, n, s] = Xt[mt];
    return n - a === s
      ? ((D[o] = D[o] ? 0 : 1), o !== "auto" && (D.auto = 0), vt(), Kt(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(D, An) : (D[Xt[mt][0]] = An[Xt[mt][0]]),
      (D.auto = 0),
      vt(),
      Kt(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(D, null, 1)), !0)
      : t === "Escape"
        ? (qr(!1), !0)
        : !1;
}
E("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in An) typeof t[o] == "number" && (D[o] = t[o]);
    ((D.auto = 0), vt(), Kt());
  } catch {
    Kt();
  }
});
const vn = E("#ui-hint");
let jr = -9;
function it(e) {
  ((vn.textContent = e), vn.classList.add("on"), (jr = le));
}
const tc = ["lab", "exploded", "studio"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), qr());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    E("#info").open ||
    E("#cal").open
  )
    return;
  if (!E("#tune").hidden && ec(e)) {
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
    if (e.target.id === "slide-m") return;
    (t.startsWith("arrow") && e.preventDefault(),
      t !== "shift" && $e(),
      ta.add(t));
    return;
  }
  if (t === "1" || t === "2" || t === "3")
    ($e(), jo(Jn[+t - 1]), it(k("flashLayer")[+t - 1]));
  else if (t === "4" || t === "5" || t === "6") {
    $e();
    const o = [b.alert, b.crit, b.extreme][+t - 4];
    (so(o),
      it(
        `${[k("ph")[1], ne === "pt" ? "Cr\xEDtica" : "Critical", ne === "pt" ? "Extrema" : "Extreme"][+t - 4]} \xB7 ${o.toFixed(1)} m`,
      ));
  } else if (t === "[" || t === "]") {
    $e();
    const o = t === "[" ? -1 : 1;
    u.scen === "dam"
      ? (xo(u.hrsT + o * 2),
        it(`${u.hrsT >= 0 ? "+" : ""}${u.hrsT.toFixed(0)} h`))
      : (so(u.ST + o * 0.25), it(u.ST.toFixed(2) + " m"));
  } else if (t === "0")
    ($e(),
      Tt(u.scen === "dam" ? "seasonal" : "dam"),
      it(k("flashScen")[u.scen === "dam" ? 1 : 0]));
  else if (t === " ") (e.preventDefault(), $e(), nt(!u.play));
  else if (t === "7" || t === "8" || t === "9") {
    $e();
    const o = tc[+t - 7];
    (Aa(o), it(k({ lab: "vLab", exploded: "vEx", studio: "vSt" }[o])));
  } else
    t === "c"
      ? E("#cine").click()
      : t === "home"
        ? (e.preventDefault(), cs())
        : t === "."
          ? ((ba = !ba),
            it(
              ba
                ? ne === "pt"
                  ? "R\xF3tulos ligados"
                  : "Labels on"
                : ne === "pt"
                  ? "R\xF3tulos desligados"
                  : "Labels off",
            ))
          : t === "/" &&
            (e.preventDefault(),
            Ha.classList.toggle("ui-off"),
            it(
              Ha.classList.contains("ui-off")
                ? ne === "pt"
                  ? "Interface oculta \xB7 / para mostrar"
                  : "Interface hidden \xB7 / to show"
                : ne === "pt"
                  ? "Interface vis\xEDvel"
                  : "Interface shown",
            ));
}),
  (E("#cine").onclick = () => {
    ko ? cs() : io(!0);
  }),
  Ze.addEventListener("dblclick", (e) => {
    ss(e) || cs();
  }),
  (E("#how").onclick = () => {
    ((E("#info-body").innerHTML = Vr[ne]()), E("#info").showModal());
  }),
  setInterval(() => {
    E("#tune").hidden || (E("#tune-fps").textContent = Math.round(Wr) + " fps");
  }, 500),
  (E("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e),
          it(ne === "pt" ? "Link copiado" : "Link copied"));
    } catch {}
  }));
function Xr() {
  const e = Lt.clientWidth,
    t = Lt.clientHeight;
  Yo = e < 900;
  const o = D.fov + (Yo ? 8 : 0);
  (I.fov !== o && ((I.fov = o), I.updateProjectionMatrix()),
    I.setViewOffset(e, t, Yo ? 0 : -e * 0.02, Yo ? t * 0.1 : -t * 0.02, e, t));
  const a = 2 * Math.tan(r.MathUtils.degToRad(I.fov / 2));
  ((Ae.uPxK.value = a / Math.max(t, 1)),
    (cn =
      I.aspect < 0.8
        ? W(0.62 / Math.max(I.aspect, 0.4), 1, 1.5)
        : W(Math.max(as[0] / (a * I.aspect), as[1] / a) / zr, 0.85, 2.2)));
}
function Kr() {
  const e = Lt.clientWidth,
    t = Lt.clientHeight;
  ((I.aspect = e / t),
    I.updateProjectionMatrix(),
    Y.setSize(e, t),
    et.setSize(e, t));
  const o = Y.getDrawingBufferSize(new r.Vector2());
  (kn.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    Fs.uRes.value.copy(o),
    Xr(),
    I.updateProjectionMatrix());
}
addEventListener("resize", Kr);
let Yr = performance.now(),
  bs = 0,
  xs = 0,
  Zr = 0;
function gs(e) {
  ((Ca = W((e - Yr) / 1e3, 0, 1.5)), (qo = Math.min(0.1, Ca)), (Yr = e));
  const t = e / 1e3;
  if (
    ((le = t),
    ko && Kl(t),
    Nl(),
    bl(qo),
    Rl(),
    gl(),
    Yl(t),
    I.updateMatrixWorld(),
    (Y.shadowMap.needsUpdate = !0),
    El(t),
    Dl(),
    jt(S.dirty),
    (S.dirty = !1),
    vn.classList.contains("on") && le - jr > 1.6 && vn.classList.remove("on"),
    (bs += Ca),
    xs++,
    e - Zr > 1600)
  ) {
    const o = xs / Math.max(bs, 0.001);
    ((bs = 0),
      (xs = 0),
      (Zr = e),
      (Wr = o),
      vs++,
      vs > 2 && (ms = Math.max(ms, o)),
      (mn = vs > 3 && o < ms * 0.74 ? mn + 1 : 0),
      !document.hidden &&
        D.auto &&
        mn >= 2 &&
        o < 50 &&
        ((mn = 0),
        D.pixelRatio > 0.75
          ? ((D.pixelRatio = Math.max(0.75, +(D.pixelRatio - 0.25).toFixed(2))),
            vt())
          : D.reflect
            ? ((D.reflect = 0), vt())
            : D.msaa > 0
              ? ((D.msaa = 0), vt())
              : D.ao && ((D.ao = 0), vt())));
  }
  (hi(), Y.info.reset(), et.render());
}
let Jr = !0;
function Qr(e) {
  (requestAnimationFrame(Qr), Jr && gs(e));
}
($n(u.S, !0, !1),
  Xn(),
  Zn(),
  vt(),
  Aa("lab", !0),
  io(!0),
  E("#loading").remove(),
  us(),
  jt(!0),
  requestAnimationFrame(Qr),
  (window.__step = (e) => gs(e)),
  (window.__loop = (e) => {
    Jr = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = Y.domElement,
      a = document.createElement("canvas");
    return (
      (a.width = e),
      (a.height = Math.round((e * o.height) / o.width)),
      a.getContext("2d").drawImage(o, 0, 0, a.width, a.height),
      a.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    gs(o ?? performance.now());
    const a = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + Ro + "/_shots/" + e + ".webp",
        { method: "POST", body: a },
      )
    ).text();
  }),
  (window.__lab = {
    hero: (e = 8.3) => {
      (io(!0),
        ls(0, le),
        ce.beats[0][1](),
        (aa = ce.beats.length),
        (u.ST = u.S = e),
        (u.crest = u.low = e));
    },
    script: (e) => {
      if ((io(!1), e && e.aim)) {
        const t = e.aim();
        e = { ...e, t: [t.x, t.y, t.z], f: [t.x, t.y, t.z], aim: null };
      }
      ((lo = e), e && Qo({ fit: null, ...e }));
    },
    view: (e, t = !0) => {
      (io(!1), Aa(e, t));
    },
    cut: (e) => {
      (io(!0), ls(e, le));
    },
    level: (e, t) => {
      (so(e), t && ((u.S = u.ST), u.S > u.crest && (u.crest = u.low = u.S)));
    },
    hours: (e, t) => {
      (u.scen !== "dam" && Tt("dam"), xo(e), t && (u.hrs = u.hrsT));
    },
    scen: (e) => Tt(e),
    layer: (e) => jo(e),
    play: (e) => nt(!!e),
    day: (e) => {
      ((u.day = e), (u.playedFrom = 1), (u.ST = Uo(e)));
    },
    crest: (e) => {
      ((u.crest = e), (u.low = u.S));
    },
    explode: (e) => {
      u.exT = u.ex = e ? 1 : 0;
    },
    tags: (e) => {
      ba = !!e;
    },
    lang: (e) => {
      ((ne = e), us());
    },
    tune: (e) => (Object.assign(D, e), vt(), { ...D }),
    sign: (e) => {
      e && (Object.assign(se, e), Yn());
      const { letters: t, ...o } = se;
      return { ...o, letters: t.length };
    },
    signAt: (e = 0.5) => {
      const t = se.letters;
      if (!t?.length) return null;
      const o = Math.max(
          0,
          Math.min(t.length - 1, Math.round(e * (t.length - 1))),
        ),
        [a, n, s] = t[o],
        l = [Math.cos(se.yaw), -Math.sin(se.yaw)];
      return $t.localToWorld(
        new r.Vector3(a - l[1] * 0.01, n + se.cap * 0.5, s + l[0] * 0.01),
      );
    },
    cfg: (e) => (e && (Object.assign(b, e), Bn(), ps()), { ...b }),
    model: () => ({
      S: +u.S.toFixed(3),
      h: +S.h.toFixed(3),
      phase: k("ph")[u.phase],
      houses: Te,
      wet: S.wet,
      people: S.people,
      iso: S.iso,
      cutKm: +S.cutKm.toFixed(2),
      shelters: `${S.shOpen}/${S.shAll}`,
      area: +S.area.toFixed(2),
      nogo: +S.nogoArea.toFixed(2),
      bridge: S.bridge && S.bridge.st,
      hosp: S.hosp && S.hosp.st,
      hoods: S.hoods.slice(0, 6).map((e) => e.label + " " + e.wet),
      routes: S.routes.map(
        (e) => `${e.hood.label} \u2192 ${e.shelter.n} ${Math.round(e.len)} m`,
      ),
    }),
    ST: u,
    MD: S,
    CFG: b,
    VIEW: Q,
    VIEWS: Ko,
    HERO: Dt,
    SHOTS: is,
    HOODS: to,
    SHELTERS: po,
  }),
  (window.__x = {
    dof: tt,
    gtao: de,
    bloom: Ht,
    renderer: Y,
    camera: I,
    scene: ke,
    composer: et,
    cam: q,
    RT: D,
    overlay: qa,
    rays: Eo,
    marks: dt,
    UI: j,
    TU: Ae,
    blk: Mt,
    houses: wa,
    roads: St,
    water: fr,
    terrain: al,
    colG: kt,
  }),
  (window.__dbg = () => ({
    t: +le.toFixed(2),
    view: Q.cur,
    shot: hn,
    cine: ko,
    S: +u.S.toFixed(2),
    phase: u.phase,
    layer: u.layer,
    scen: u.scen,
    ex: +u.ex.toFixed(2),
    fit: +cn.toFixed(3),
    focus: +tt.u.focus.value.toFixed(2),
    range: +tt.u.range.value.toFixed(2),
    calls: Y.info.render.calls,
    tris: Y.info.render.triangles,
  })));
