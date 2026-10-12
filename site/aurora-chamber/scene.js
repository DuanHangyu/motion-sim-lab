import * as r from "three";
import { EffectComposer as Qs } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as Vn,
  FullScreenQuad as jo,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as Va } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as Js } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as er } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as tr } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as or } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as Fa } from "three/addons/utils/BufferGeometryUtils.js";
const L = (e) => document.querySelector(e),
  Lt = L("#world"),
  Fn = L("#app"),
  V = (e, t, o) => (e < t ? t : e > o ? o : e),
  Dn = (e, t, o) => e + (t - e) * o,
  zt = (e, t, o) => {
    const n = V((o - e) / (t - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  fl = (e) => 1 - (1 - e) ** 3,
  dl = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
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
const Y = Te(7),
  He = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  nr = "https://x.com/ryansael",
  Da = "aurora-chamber",
  ae = new r.Scene();
((ae.background = new r.Color("#10151f")),
  (ae.fog = new r.FogExp2("#1a2130", 0.0065)));
const P = new r.PerspectiveCamera(30, 1, 0.3, 320);
let O;
try {
  O = new r.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (L("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const ar = 25e5,
  sr = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return V(Math.min(devicePixelRatio, 2, Math.sqrt(ar / (e * t))), 1, 2);
  },
  Xo = sr();
(O.setPixelRatio(Xo),
  (O.info.autoReset = !1),
  (O.shadowMap.enabled = !0),
  (O.shadowMap.type = r.PCFShadowMap),
  (O.shadowMap.autoUpdate = !1),
  (O.transmissionResolutionScale = 0.6),
  (O.toneMapping = r.ACESFilmicToneMapping),
  Lt.appendChild(O.domElement));
const Zo = new r.HemisphereLight(9414360, 3813414, 0.5);
ae.add(Zo);
const ce = new r.DirectionalLight(16763279, 2.1);
((ce.castShadow = !0),
  ce.shadow.mapSize.set(2048, 2048),
  Object.assign(ce.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (ce.shadow.normalBias = 0.03),
  (ce.shadow.bias = -4e-4),
  (ce.shadow.radius = 2),
  ae.add(ce, ce.target));
const rr = new r.Vector3(0.62, 0.62, 0.48).normalize();
(ce.position.copy(rr).multiplyScalar(30), ce.target.position.set(0, 2, 0));
const _n = new r.DirectionalLight(9427199, 0.9);
(_n.position.set(-6, 9, -14), ae.add(_n));
const Bn = new r.DirectionalLight(16773600, 0.55);
(Bn.position.set(-8, 12, 10), ae.add(Bn));
const ot = new r.Group();
ae.add(ot);
const nt = 10,
  Xt = {
    pos: {
      value: Array.from({ length: nt }, () => new r.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: nt }, () => new r.Vector3()) },
  },
  ir = `uniform vec4 uFakePos[${nt}];uniform vec3 uFakeCol[${nt}];uniform float uSat;`,
  lr = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${nt};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  cr = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  _a = { value: 1.16 };
function Vt(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: Xt.pos,
        uFakeCol: Xt.col,
        uSat: _a,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + ir,
          )
          .replace("#include <lights_fragment_end>", lr)
          .replace("#include <opaque_fragment>", cr)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => Da + (t ? t.key : "")),
    e
  );
}
const Ba = [];
function xe(e, t, o, n, a, s) {
  const i = { p: new r.Vector3(e, t, o), c: new r.Color(n), r: a, i: s, i0: s };
  return (Ba.push(i), i);
}
const Qo = new r.Vector3(),
  Re = [],
  Zt = new r.Vector3(0, 3, 0);
function fr(e) {
  Re.length = 0;
  for (const t of Ba)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        Re.length < nt)
      )
        (Re.push(t), Re.length === nt && Re.sort((o, n) => o.score - n.score));
      else if (t.score > Re[0].score) {
        Re[0] = t;
        for (let o = 0; o < nt - 1 && Re[o].score > Re[o + 1].score; o++) {
          const n = Re[o];
          ((Re[o] = Re[o + 1]), (Re[o + 1] = n));
        }
      }
    }
}
function Ga(e, t) {
  fr(t);
  for (let o = 0; o < nt; o++) {
    const n = Re[o];
    if (!n) {
      (Xt.col.value[o].set(0, 0, 0), Xt.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (Qo.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      Xt.pos.value[o].set(Qo.x, Qo.y, Qo.z, 1 / (n.r * n.r)),
      Xt.col.value[o].set(n.c.r * n.i, n.c.g * n.i, n.c.b * n.i));
  }
}
const Jo = {};
{
  const e = new r.PMREMGenerator(O),
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
    o = (n, a, s, i, l, c, f) => {
      const d = new r.Mesh(
        new r.BoxGeometry(a, s, 0.4),
        new r.MeshBasicMaterial({ color: new r.Color(...i) }),
      );
      (d.position.set(l, c, f), d.lookAt(0, 0, 0), n.add(d));
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
      const i = (s / 6) * Math.PI * 2 + 0.4;
      o(n, 12, 2.4, a[s], Math.sin(i) * 28, 12 + (s % 2) * 9, Math.cos(i) * 28);
    }
    {
      const s = new r.Mesh(
        new r.BoxGeometry(40, 1.2, 1.2),
        new r.MeshBasicMaterial({ color: new r.Color(6, 3.4, 1.2) }),
      );
      (s.position.set(0, -6, -30), n.add(s));
    }
    Jo.show = e.fromScene(n, 0.03).texture;
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
      (Jo.studio = e.fromScene(n, 0.03).texture));
  }
  e.dispose();
}
((ae.environment = Jo.show), (ae.environmentIntensity = 0.7));
const Ua = 0,
  Gn = new r.WebGLRenderTarget(1, 1, {
    type: r.HalfFloatType,
    generateMipmaps: !0,
    minFilter: r.LinearMipmapLinearFilter,
  }),
  en = {
    tReflect: { value: Gn.texture },
    uReflMatrix: { value: new r.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  Na = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, en),
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
  _e = new r.PerspectiveCamera(),
  tn = new r.Vector3(0, 1, 0),
  Eo = new r.Vector3(0, Ua, 0),
  Un = new r.Vector3(),
  on = new r.Vector3(),
  Nn = new r.Matrix4(),
  Po = new r.Plane(),
  at = new r.Vector4(),
  Oa = new r.Vector4(),
  Qt = [];
function dr() {
  if (
    !M.reflect ||
    en.uReflStrength.value <= 0 ||
    P.position.y <= Ua ||
    !ce.shadow.map
  )
    return;
  (Un.setFromMatrixPosition(P.matrixWorld),
    Nn.extractRotation(P.matrixWorld),
    _e.position.subVectors(Eo, Un).reflect(tn).negate().add(Eo),
    on.set(0, 0, -1).applyMatrix4(Nn).add(Un),
    on.subVectors(Eo, on).reflect(tn).negate().add(Eo),
    _e.up.set(0, 1, 0).applyMatrix4(Nn).reflect(tn),
    _e.lookAt(on),
    (_e.far = P.far),
    _e.updateMatrixWorld(),
    _e.projectionMatrix.copy(P.projectionMatrix),
    en.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(_e.projectionMatrix)
      .multiply(_e.matrixWorldInverse),
    Po.setFromNormalAndCoplanarPoint(tn, Eo).applyMatrix4(
      _e.matrixWorldInverse,
    ),
    at.set(Po.normal.x, Po.normal.y, Po.normal.z, Po.constant));
  const e = _e.projectionMatrix.elements;
  (Oa.set(
    (Math.sign(at.x) + e[8]) / e[0],
    (Math.sign(at.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    at.multiplyScalar(2 / at.dot(Oa)),
    (e[2] = at.x),
    (e[6] = at.y),
    (e[10] = at.z + 1),
    (e[14] = at.w));
  const t = Qt.map((n) => n.visible),
    o = O.shadowMap.needsUpdate;
  (Qt.forEach((n) => (n.visible = !1)),
    (O.shadowMap.needsUpdate = !1),
    Ga(_e, Zt),
    O.setRenderTarget(Gn),
    O.clear(),
    O.render(ae, _e),
    O.setRenderTarget(null),
    Qt.forEach((n, a) => (n.visible = t[a])),
    (O.shadowMap.needsUpdate = o));
}
const ur =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  nn = (e, t) =>
    new r.ShaderMaterial({
      uniforms: t,
      vertexShader: ur,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class hr extends Vn {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new r.WebGLRenderTarget(1, 1, {
        type: r.HalfFloatType,
        samples: t,
        depthTexture: new r.DepthTexture(1, 1),
      })),
      (this.quad = new jo(
        nn(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, n) {
    (Ga(P, Zt),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(ae, P),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const Ia = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class pr extends Vn {
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
        near: { value: P.near },
        far: { value: P.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new r.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new r.Vector2() },
        fullTexel: { value: new r.Vector2() },
      }),
      (this.pre = new jo(
        nn(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Ia}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new jo(
        nn(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new jo(
        nn(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${Ia}
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
    pixelRatio: Xo,
    msaa: Xo >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 2048,
    exposure: 1,
    fov: 42,
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
    aperture: 1.2,
    apertureNear: 0.9,
    maxCoc: 13,
  },
  On = { ...M },
  Be = new Qs(
    O,
    new r.WebGLRenderTarget(1, 1, { type: r.HalfFloatType, depthBuffer: !1 }),
  );
Be.setPixelRatio(Xo);
const ko = new hr(M.msaa);
Be.addPass(ko);
const se = new Va(ae, P, 1, 1);
((se.output = Va.OUTPUT.Off),
  (se.needsSwap = !1),
  se.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  se.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const mr = se.setSize.bind(se),
  vr = se.render.bind(se);
se.setSize = (e, t) => mr(Math.ceil(e / 2), Math.ceil(t / 2));
const Jt = [],
  Wa = [];
((se.render = (e, t, o) => {
  (Jt.forEach((n, a) => {
    ((Wa[a] = n.visible), (n.visible = !1));
  }),
    vr(e, t, o),
    Jt.forEach((n, a) => (n.visible = Wa[a])),
    (se.blendMaterial.uniforms.intensity.value = M.ao ? M.aoIntensity : 0),
    (se.blendMaterial.uniforms.tDiffuse.value = se.pdRenderTarget.texture),
    se._renderPass(e, se.blendMaterial, o));
}),
  Be.addPass(se));
const st = new Js(new r.Vector2(256, 256), 0.42, 0.55, 1.05),
  yr = st.setSize.bind(st);
((st.setSize = (e, t) => yr(Math.ceil(e / 2), Math.ceil(t / 2))),
  Be.addPass(st));
const Ge = new pr();
((Ge.u.tDepth.value = ko.rt.depthTexture), Be.addPass(Ge));
const Ee = new r.Scene(),
  rt = {
    tSceneDepth: { value: se.depthTexture },
    uRes: { value: new r.Vector2(1, 1) },
    uNF: { value: new r.Vector2(P.near, P.far) },
  };
class xr extends Vn {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, n) {
    const a = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(n),
      t.render(Ee, P),
      (t.autoClear = a));
  }
}
(Be.addPass(new xr()), Be.addPass(new er()));
const Ka = new tr();
Be.addPass(Ka);
const vt = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  gr = (e, t, o, n = 0.06, a = 2) =>
    new or(e, t, o, a, Math.min(n, Math.min(e, t, o) / 2.02)),
  it = new Map();
function re(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    it.has(o) ||
      it.set(
        o,
        Vt(
          new r.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    it.get(o)
  );
}
function ul(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    it.has(o) ||
      it.set(
        o,
        Vt(
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
    it.get(o)
  );
}
function U(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    it.has(o) ||
      it.set(
        o,
        Vt(
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
    it.get(o)
  );
}
const Z = (e, t = 1) =>
    new r.MeshBasicMaterial({
      color: new r.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  hl = (e = {}) =>
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
  an = U("#434a55", { roughness: 0.36 }),
  qe = U("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Ha = U("#15171b", { roughness: 0.46, metalness: 0.55 }),
  pl = U("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  Ao = U("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  ml = re("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  vl = U("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  yl = U("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  wr = new r.Matrix4(),
  sn = new r.Quaternion(),
  qa = new r.Euler(0, 0, 0, "YXZ"),
  $a = new r.Vector3(1, 1, 1),
  xl = new r.Color(),
  gl = new r.Vector3(1, 0, 0),
  In = new r.Vector3(0, 1, 0),
  wl = new r.Vector3(0, 0, 1),
  Mr = new r.Vector3(),
  br = new r.Quaternion();
function te() {
  const e = new Map(),
    t = (o, n, a, s, i, l) => {
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
        l.dir
          ? (sn.setFromUnitVectors(
              In,
              Mr.set(l.dir[0], l.dir[1], l.dir[2]).normalize(),
            ),
            l.roll && sn.multiply(br.setFromAxisAngle(In, l.roll)))
          : (qa.set(l.rx || 0, l.ry || 0, l.rz || 0), sn.setFromEuler(qa)),
        n.applyMatrix4(
          wr.compose(
            { x: a, y: s, z: i },
            sn,
            l.s ? $a.set(l.s[0], l.s[1], l.s[2]) : $a.set(1, 1, 1),
          ),
        ));
      let c = e.get(o);
      (c || e.set(o, (c = { mat: o, list: [] })), c.list.push(n));
    };
  return {
    box(o, n, a, s, i, l, c, f = {}) {
      return (
        t(o, f.r ? gr(i, l, c, f.r) : new r.BoxGeometry(i, l, c), n, a, s, f),
        this
      );
    },
    cyl(o, n, a, s, i, l, c, f = {}) {
      return (
        t(o, new r.CylinderGeometry(i, l, c, f.seg || 20), n, a, s, f),
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
        const l = new r.Mesh(Fa(i), s);
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
const rn = [];
document.fonts?.ready.then(() => rn.forEach((e) => e()));
function Wn(e, t, o, n, a, s = 0.9, i = {}) {
  const l = document.createElement("canvas");
  ((l.width = o), (l.height = n));
  const c = l.getContext("2d"),
    f = new r.CanvasTexture(l);
  ((f.anisotropy = 8), (f.colorSpace = r.SRGBColorSpace));
  const d = new r.Mesh(
    new r.PlaneGeometry(e, t),
    new r.MeshBasicMaterial({
      map: f,
      alphaTest: 0.3,
      fog: !1,
      side: r.DoubleSide,
      color: new r.Color(s, s, s),
      ...i,
    }),
  );
  return (
    (d.userData = {
      c: l,
      g: c,
      t: f,
      redraw(u) {
        (c.clearRect(0, 0, o, n), u(c, o, n), (f.needsUpdate = !0));
      },
    }),
    a && (d.userData.redraw(a), rn.push(() => d.userData.redraw(a))),
    d
  );
}
const Sr = (e, t, o, n, a, s) => {
    (e.beginPath(), e.roundRect(t, o, n, a, s));
  },
  eo = (e, t, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), o(a.getContext("2d"), e, t));
    const s = new r.CanvasTexture(a);
    return (n && (s.colorSpace = r.SRGBColorSpace), (s.anisotropy = 8), s);
  },
  Tr = eo(
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
  Ml = (e, t, o = Tr) =>
    new r.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function to(e, t = 64, o = [0, Math.PI * 2]) {
  const n = new r.LatheGeometry(
    e.map(([a, s]) => new r.Vector2(s, a)),
    t,
    o[0],
    o[1],
  );
  return (n.rotateZ(-Math.PI / 2), n);
}
function bl(e, t) {
  return [...e, ...t.slice().reverse(), e[0]];
}
function Sl(e) {
  const t = new r.Shape(e.map(([s, i]) => new r.Vector2(s, i))),
    o = new r.ShapeGeometry(t, 1),
    n = o.clone();
  n.scale(1, -1, 1);
  const a = n.index.array;
  for (let s = 0; s < a.length; s += 3) {
    const i = a[s];
    ((a[s] = a[s + 2]), (a[s + 2] = i));
  }
  return (n.computeVertexNormals(), Fa([o.toNonIndexed(), n.toNonIndexed()]));
}
function Rr(e, t, o, n, a = 60, s = 0.07) {
  const i = [],
    l = [],
    c = a * 6,
    f = 0.035,
    d = [
      [e, o],
      [e, n - s],
      [e + f, n],
      [t - f, n],
      [t, n - s],
      [t, o],
    ];
  for (let h = 0; h < d.length; h++)
    for (let m = 0; m <= c; m++) {
      const g = (m / c) * Math.PI * 2,
        T = (m % 6) / 6,
        b = T >= 0.17 && T < 0.67 ? 1 : 0,
        E = h === 2 || h === 3 ? (b ? n : n - s) : d[h][1];
      i.push(d[h][0], -Math.sin(g) * E, Math.cos(g) * E);
    }
  for (let h = 0; h < d.length - 1; h++)
    for (let m = 0; m < c; m++) {
      const g = h * (c + 1) + m,
        T = g + 1,
        b = g + c + 1,
        E = b + 1;
      l.push(g, T, b, T, E, b);
    }
  const u = new r.BufferGeometry();
  (u.setAttribute("position", new r.Float32BufferAttribute(i, 3)),
    u.setIndex(l));
  const p = u.toNonIndexed();
  return (p.computeVertexNormals(), p);
}
function Tl(e, t, o, n, a) {
  const s = new r.Shape(),
    i = n * 4;
  for (let f = 0; f <= i; f++) {
    const d = (f / i) * Math.PI * 2,
      u = f % 4,
      p = u === 1 || u === 2 ? t + o : t,
      h = d + ((u === 1 ? 0.18 : u === 2 ? -0.18 : 0) * Math.PI * 2) / n,
      m = Math.cos(h) * p,
      g = Math.sin(h) * p;
    f ? s.lineTo(m, g) : s.moveTo(m, g);
  }
  const l = new r.Path();
  (l.absarc(0, 0, e, 0, Math.PI * 2, !0), s.holes.push(l));
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
function ln(e, t = 0.3, o = 1, n = 0) {
  const a = new r.IcosahedronGeometry(e, n),
    s = a.attributes.position,
    i = Te(o),
    l = new Map();
  for (let c = 0; c < s.count; c++) {
    const f =
      s.getX(c).toFixed(3) +
      "," +
      s.getY(c).toFixed(3) +
      "," +
      s.getZ(c).toFixed(3);
    l.has(f) ||
      l.set(f, [1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t, 1 + (i() - 0.5) * t]);
    const d = l.get(f);
    s.setXYZ(c, s.getX(c) * d[0], s.getY(c) * d[1], s.getZ(c) * d[2]);
  }
  return (a.computeVertexNormals(), a);
}
function Ya(e, t, o, n, a, s = 0, i = {}) {
  const l = new r.Group(),
    c = te(),
    f = Te(Math.floor(t * 31 + n * 17 + 99));
  c.cyl(re("#5a3f2c"), 0, 0.5 * a, 0, 0.07 * a, 0.1 * a, 1 * a, { seg: 6 });
  const d = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((u) =>
    new r.Color(u).offsetHSL(s, 0, 0).getStyle(),
  );
  for (let u = 0; u < (i.n || 5); u++)
    c.geo(
      re(d[u % 4], { flatShading: !0, roughness: 0.8 }),
      ln(0.42 * a * (0.75 + f() * 0.5), 0.3, u + t * 7 + n * 3),
      (f() - 0.5) * 0.6 * a,
      (1.15 + f() * 0.7) * a,
      (f() - 0.5) * 0.6 * a,
    );
  return (c.flush(l), l.position.set(t, o, n), e.add(l), l);
}
const Cr = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
    re(e, { flatShading: !0, roughness: 0.85 }),
  ),
  Er = re("#4a3527", { roughness: 0.9 });
function Kn(e, t, o, n, a, s = 1) {
  const i = Te(s * 97 + 13);
  e.cyl(Er, t, o + 0.15 * a, n, 0.05 * a, 0.07 * a, 0.3 * a, { seg: 5 });
  for (let l = 0; l < 3; l++) {
    const c = (0.42 - l * 0.1) * a * (0.9 + i() * 0.2);
    e.cone(Cr[(l + s) % 3], t, o + (0.22 + l * 0.3) * a, n, c, 0.55 * a, {
      seg: 6 + (s % 2),
      ry: i() * 3,
    });
  }
}
const Pr = re("#8d8aa0", { flatShading: !0, roughness: 0.75 }),
  kr = re("#eef1f8", { flatShading: !0, roughness: 0.6 });
function yt(e, t, o, n, a, s, i = 1) {
  const l = new r.ConeGeometry(a, s, 7, 3).translate(0, s / 2, 0),
    c = l.attributes.position,
    f = Te(i);
  for (let u = 0; u < c.count; u++) {
    const p = c.getY(u);
    p > 0.01 &&
      p < s - 0.01 &&
      (c.setX(u, c.getX(u) * (1 + (f() - 0.5) * 0.35)),
      c.setZ(u, c.getZ(u) * (1 + (f() - 0.5) * 0.35)),
      c.setY(u, p + (f() - 0.5) * s * 0.08));
  }
  (l.computeVertexNormals(), e.geo(Pr, l, t, o, n));
  const d = new r.ConeGeometry(a * 0.36, s * 0.34, 7, 1).translate(
    0,
    s * 0.83 + 0.005,
    0,
  );
  e.geo(kr, d, t, o, n, { ry: i });
}
function Rl(e, t, o, n, a = 1, s = 1) {
  const i = te(),
    l = Te(s * 31);
  (i
    .box(
      re("#5b4636", { roughness: 0.9 }),
      t,
      o + 0.09 * a,
      n,
      1.5 * a,
      0.18 * a,
      1 * a,
      { r: 0.02 * a },
    )
    .box(
      re("#5f8a4a", { flatShading: !0 }),
      t,
      o + 0.19 * a,
      n,
      1.46 * a,
      0.04 * a,
      0.96 * a,
    ),
    yt(i, t - 0.25 * a, o + 0.2 * a, n - 0.15 * a, 0.42 * a, 0.9 * a, s),
    yt(i, t + 0.3 * a, o + 0.2 * a, n - 0.2 * a, 0.34 * a, 0.66 * a, s + 3));
  for (let c = 0; c < 5; c++)
    Kn(
      i,
      t + (l() - 0.5) * 1.2 * a,
      o + 0.2 * a,
      n + 0.1 * a + l() * 0.3 * a,
      0.5 * a * (0.8 + l() * 0.4),
      s + c,
    );
  i.flush(e);
}
const Ar = eo(
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
function Lr(e, t, o, n, a, s, i = 0.5) {
  const l = new r.Mesh(
    new r.PlaneGeometry(a, s),
    new r.MeshBasicMaterial({
      map: Ar,
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
    Jt.push(l),
    l
  );
}
const Cl = eo(1024, 512, (e, t, o) => {
    const n = e.createLinearGradient(0, 0, 0, o);
    (n.addColorStop(0, "#6f8fc4"),
      n.addColorStop(0.52, "#d9b9b4"),
      n.addColorStop(0.72, "#f3c49a"),
      n.addColorStop(1, "#8a7a78"),
      (e.fillStyle = n),
      e.fillRect(0, 0, t, o));
    const a = Te(9),
      s = (i, l, c, f) => {
        ((e.fillStyle = c), e.beginPath(), e.moveTo(0, o));
        for (let d = 0; d <= t; d += 16) {
          const u = d / t;
          e.lineTo(
            d,
            i -
              l *
                (Math.abs(Math.sin(u * 5.1 + f)) * 0.7 +
                  Math.abs(Math.sin(u * 13.3 + f * 2)) * 0.3),
          );
        }
        (e.lineTo(t, o), e.fill());
      };
    (s(o * 0.6, o * 0.32, "#8d87a8", 1),
      s(o * 0.7, o * 0.2, "#6c6f8e", 2.2),
      (e.fillStyle = "#e9e6f2"));
    for (let i = 0; i < 5; i++) {
      const l = t * (0.12 + i * 0.2),
        c = o * 0.34 + a() * 20;
      (e.beginPath(),
        e.moveTo(l, c),
        e.lineTo(l - 30, c + 34),
        e.lineTo(l + 30, c + 34),
        e.fill());
    }
    for (let i = 0; i < 110; i++) {
      const l = a() * t,
        c = o * (0.72 + a() * 0.25),
        f = 10 + a() * 26;
      ((e.fillStyle = `hsl(${130 + a() * 20},${25 + a() * 15}%,${22 + a() * 12}%)`),
        e.beginPath(),
        e.moveTo(l, c - f * 2.2),
        e.lineTo(l - f * 0.6, c),
        e.lineTo(l + f * 0.6, c),
        e.fill());
    }
  }),
  me = new r.Group();
ot.add(me);
const le = -7.6,
  El = 11.2,
  Me = 12,
  Pl = (() => {
    const e = eo(1024, 1024, (n, a, s) => {
      const l = a / 4,
        c = Te(3);
      for (let f = 0; f < 4; f++)
        for (let d = 0; d < 4; d++) {
          const u = c();
          ((n.fillStyle = `hsl(${222 + u * 8},${10 + u * 5}%,${24 + u * 6}%)`),
            n.fillRect(f * l, d * l, l, l));
          for (let p = 0; p < 70; p++)
            ((n.fillStyle = `rgba(${c() > 0.5 ? 255 : 70},${c() > 0.5 ? 250 : 60},240,${0.025 + c() * 0.03})`),
              n.beginPath(),
              n.ellipse(
                f * l + c() * l,
                d * l + c() * l,
                4 + c() * 40,
                2 + c() * 12,
                c() * 3,
                0,
                7,
              ),
              n.fill());
        }
      ((n.strokeStyle = "#111723"), (n.lineWidth = 3));
      for (let f = 0; f <= 4; f++)
        (n.beginPath(),
          n.moveTo(f * l, 0),
          n.lineTo(f * l, s),
          n.stroke(),
          n.beginPath(),
          n.moveTo(0, f * l),
          n.lineTo(a, f * l),
          n.stroke());
    });
    ((e.wrapS = e.wrapT = r.RepeatWrapping), e.repeat.set(9, 6));
    const t = Vt(
        new r.MeshStandardMaterial({
          map: e,
          roughness: 0.2,
          metalness: 0.05,
          envMapIntensity: 0.55,
        }),
        Na,
      ),
      o = new r.Mesh(new r.PlaneGeometry(72, 48), t);
    return (
      (o.rotation.x = -Math.PI / 2),
      o.position.set(0, 0, 4),
      (o.receiveShadow = !0),
      me.add(o),
      Qt.push(o),
      o
    );
  })(),
  cn = re("#18223a", { roughness: 0.62, envMapIntensity: 0.5 }),
  ja = re("#111a2c", { roughness: 0.7 }),
  Ft = U("#2f3746", { roughness: 0.4 });
{
  const e = te();
  e.box(cn, -2.5, Me / 2, le - 0.2, 24, Me, 0.4)
    .box(cn, 12.2, Me - 1.2, le - 0.2, 5.4, 2.4, 0.4)
    .box(cn, 12.2, 0.45, le - 0.2, 5.4, 0.9, 0.4)
    .box(cn, 16.4, Me / 2, le - 0.2, 3, Me, 0.4);
  for (let n = -13.4; n <= 9; n += 2.7)
    e.box(ja, n, Me / 2, le + 0.01, 0.05, Me, 0.04);
  (e
    .box(Ft, -2.5, 0.12, le + 0.08, 24, 0.24, 0.14)
    .box(ja, 0, Me + 0.2, -3, 34, 0.4, 12),
    e
      .box(Ft, 12.2, Me - 2.45, le + 0.05, 5.6, 0.16, 0.3)
      .box(Ft, 12.2, 0.95, le + 0.05, 5.6, 0.16, 0.3)
      .box(Ft, 9.45, 5.2, le + 0.05, 0.16, 8.6, 0.3)
      .box(Ft, 14.95, 5.2, le + 0.05, 0.16, 8.6, 0.3)
      .box(Ft, 12.2, 5.2, le + 0.05, 0.08, 8.5, 0.16));
  for (const n of [-8.1, 8.6]) e.box(Ft, n, Me / 2, le + 0.12, 0.34, Me, 0.2);
  e.flush(me, !1);
  const t = new r.Mesh(new r.BoxGeometry(34, 0.06, 0.06), Z("#ffb86b", 2.2));
  (t.position.set(0, Me - 0.35, le + 0.3), me.add(t));
  const o = new r.Mesh(new r.BoxGeometry(24, 0.04, 0.04), Z("#ffae5c", 1.6));
  (o.position.set(-2.5, 0.27, le + 0.16), me.add(o));
  for (const n of [-8.1, 8.6]) {
    const a = new r.Mesh(
      new r.BoxGeometry(0.05, Me - 1.2, 0.05),
      Z("#ffb468", 2.4),
    );
    (a.position.set(n, Me / 2, le + 0.24),
      me.add(a),
      xe(n, 4.5, le + 1.2, "#ffb468", 4, 0.45));
  }
}
const zr = eo(512, 1024, (e, t, o) => {
  ((e.fillStyle = "#03050c"), e.fillRect(0, 0, t, o));
  const n = Te(41);
  for (let f = 0; f < 520; f++) {
    const d = n();
    ((e.fillStyle = `rgba(${200 + 55 * n()},${210 + 45 * n()},255,${0.25 + 0.75 * d * d})`),
      e.fillRect(n() * t, n() * o, d > 0.93 ? 2.2 : 1.2, d > 0.93 ? 2.2 : 1.2));
  }
  const a = t * 0.95,
    s = o * 0.62,
    i = t * 0.72,
    l = e.createRadialGradient(a, s, i * 0.96, a, s, i * 1.12);
  (l.addColorStop(0, "rgba(90,170,255,.9)"),
    l.addColorStop(1, "rgba(40,90,255,0)"),
    (e.fillStyle = l),
    e.beginPath(),
    e.arc(a, s, i * 1.12, 0, 7),
    e.fill());
  const c = e.createRadialGradient(a - i * 0.35, s - i * 0.4, i * 0.1, a, s, i);
  (c.addColorStop(0, "#3f8fe0"),
    c.addColorStop(0.7, "#1d4f9e"),
    c.addColorStop(1, "#0e2a5c"),
    (e.fillStyle = c),
    e.beginPath(),
    e.arc(a, s, i, 0, 7),
    e.fill(),
    e.save(),
    e.beginPath(),
    e.arc(a, s, i, 0, 7),
    e.clip(),
    (e.fillStyle = "rgba(98,160,90,.85)"));
  for (let f = 0; f < 9; f++)
    (e.beginPath(),
      e.ellipse(
        a - i * (0.2 + n() * 0.7),
        s - i * (0.6 - n() * 1.1),
        i * (0.08 + n() * 0.16),
        i * (0.05 + n() * 0.1),
        n() * 3,
        0,
        7,
      ),
      e.fill());
  e.fillStyle = "rgba(255,255,255,.55)";
  for (let f = 0; f < 26; f++)
    (e.beginPath(),
      e.ellipse(
        a - i * n() * 0.95,
        s - i * (0.9 - n() * 1.8),
        i * (0.04 + n() * 0.12),
        i * (0.012 + n() * 0.03),
        n() * 3,
        0,
        7,
      ),
      e.fill());
  e.restore();
});
{
  const e = new r.Mesh(
    new r.PlaneGeometry(9, 17),
    new r.MeshBasicMaterial({
      map: zr,
      fog: !1,
      color: new r.Color(0.72, 0.72, 0.8),
    }),
  );
  (e.position.set(13.2, 5.6, -13), me.add(e));
}
function Hn(e, t, o, n, a, s = me, i = "#8fe4ff") {
  const l = Wn(
    o,
    n,
    640,
    Math.round((640 * n) / o),
    (c, f, d) => {
      ((c.fillStyle = "rgba(16,30,58,.55)"),
        c.fillRect(0, 0, f, d),
        a(c, f, d, 0));
    },
    1,
    {
      alphaTest: 0,
      transparent: !0,
      depthWrite: !1,
      opacity: 0.95,
      color: new r.Color(0.95, 1, 1.15),
    },
  );
  return (
    l.position.set(e, t, le + 0.14),
    s.add(l),
    Jt.push(l),
    xe(e, t + 0.2, le + 1.6, i, 5, 0.25),
    (l.userData.draw = a),
    l
  );
}
{
  const e = te(),
    t = re("#7c7f8f", { flatShading: !0, roughness: 0.8 }),
    o = re("#d8d2c7", { roughness: 0.55 });
  (e.box(re("#2b3140", { roughness: 0.5 }), 5.6, 0.2, -4.2, 3.4, 0.4, 1.8, {
    r: 0.04,
  }),
    [
      [4.9, 0.4, -4.3, 0.95, 3],
      [6.1, 0.4, -4.1, 0.75, 7],
      [5.7, 0.4, -4.7, 0.6, 11],
    ].forEach(([s, i, l, c, f]) =>
      e.geo(t, ln(c, 0.45, f, 0), s, i + c * 0.55, l, { s: [1, 0.8, 1] }),
    ),
    e
      .box(o, 9.6, 0.55, -3.4, 1.2, 1.1, 1.2, { r: 0.05 })
      .box(o, -9.8, 0.45, -2.6, 1.1, 0.9, 1.1, { r: 0.05 }),
    e.flush(me),
    ((s, i, l) => {
      const c = new r.Mesh(new r.BoxGeometry(l, 0.04, 0.05), Z("#ffae5c", 3));
      (c.position.set(s, 0.44, i), me.add(c));
    })(5.6, -3.28, 3.2),
    xe(5.6, 0.8, -3, "#ffae5c", 2.5, 0.8),
    xe(9.6, 1.6, -2.6, "#ffb468", 2.2, 0.9),
    Ya(me, 9.6, 1.1, -3.4, 1.4),
    Ya(me, -9.8, 0.9, -2.6, 1.2, 0.02, { n: 6 }));
  const a = te();
  (yt(a, -11.2, 0, -6, 1.8, 4.6, 5),
    yt(a, -9.6, 0, -6.3, 1.4, 3.4, 9),
    yt(a, -12.8, 0, -5.6, 1.3, 3, 13));
  for (let s = 0; s < 7; s++)
    Kn(
      a,
      -13 + He(s) * 5,
      0,
      -4.6 + He(s + 0.3) * 1.6,
      1.1 + He(s + 0.7) * 0.8,
      s + 3,
    );
  a.flush(me);
}
const qn = { x0: -5.55, x1: 5.75, top: 1.86 },
  xt = new r.Group();
ot.add(xt);
const Pe = new r.Group(),
  Dt = Math.hypot(0.62, qn.top - 0.3);
{
  const { x0: e, x1: t, top: o } = qn,
    n = new r.Shape(
      [
        [2.12, 0.26],
        [1.5, o - 0.04],
        [1.42, o],
        [-1.72, o],
        [-1.8, o - 0.05],
        [-1.95, 0.26],
      ].map(([d, u]) => new r.Vector2(d, u)),
    ),
    a = new r.ExtrudeGeometry(n, {
      depth: t - e,
      bevelEnabled: !0,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 2,
    });
  (a.rotateY(-Math.PI / 2), a.translate(t, 0, 0));
  const s = new r.Mesh(a, U("#434a55", { roughness: 0.5, metalness: 0.75 }));
  ((s.castShadow = s.receiveShadow = !0), xt.add(s));
  const i = te();
  (i.box(
    re("#15181d", { roughness: 0.6 }),
    (e + t) / 2,
    0.13,
    0.08,
    t - e - 0.5,
    0.26,
    3.7,
  ),
    i.box(
      U("#4c535e", { roughness: 0.78, envMapIntensity: 0.5 }),
      (e + t) / 2,
      o + 0.02,
      -0.15,
      t - e - 0.3,
      0.05,
      2.9,
      { r: 0.02 },
    ),
    i.flush(xt));
  const l = new r.Mesh(
    new r.BoxGeometry(t - e - 0.45, 0.05, 0.05),
    Z("#ffab55", 4.2),
  );
  (l.position.set((e + t) / 2, 0.24, 2.02), xt.add(l));
  const c = l.clone();
  (c.position.set((e + t) / 2, 0.24, -1.86), xt.add(c));
  const f = new r.Mesh(
    new r.BoxGeometry(t - e - 0.2, 0.035, 0.035),
    Z("#ffb468", 3.4),
  );
  (f.position.set((e + t) / 2, o - 0.03, 1.47),
    xt.add(f),
    xe(-3, 0.5, 2.8, "#ffab55", 3, 0.9),
    xe(3, 0.5, 2.8, "#ffab55", 3, 0.9),
    Pe.position.set(0, 0.278, 2.165),
    (Pe.rotation.x = -Math.atan2(0.62, o - 0.3)),
    xt.add(Pe));
}
const Vr = U("#1a1f28", {
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }),
  Fr = U("#2b313b", { roughness: 0.35 });
function Dr(e, t, o = {}) {
  const n = o.h || Dt * 0.8,
    a = o.y || Dt * 0.5,
    s = te();
  return (
    s
      .box(Fr, e, a, 0.005, t, n, 0.03, { r: 0.05 })
      .box(Vr, e, a, 0.02, t - 0.15, n - 0.08 * Dt, 0.02, { r: 0.04 }),
    s.flush(Pe, !1),
    { x: e, y: a, w: t, h: n }
  );
}
function _r(e, t, o, n, a, s = {}) {
  const i = s.cw || 1024,
    l = Math.round((i * n) / o),
    c = document.createElement("canvas");
  ((c.width = i), (c.height = l));
  const f = c.getContext("2d"),
    d = new r.CanvasTexture(c);
  ((d.colorSpace = r.SRGBColorSpace), (d.anisotropy = 8));
  const u = new r.Mesh(
    new r.PlaneGeometry(o, n),
    new r.MeshBasicMaterial({
      map: d,
      fog: !1,
      color: new r.Color(s.k || 1.5, s.k || 1.5, s.k || 1.5),
    }),
  );
  return (
    u.position.set(e, t, 0.036),
    (s.parent || Pe).add(u),
    (u.userData = {
      c,
      g: f,
      t: d,
      redraw(p = 0) {
        (f.clearRect(0, 0, i, l), a(f, i, l, p), (d.needsUpdate = !0));
      },
    }),
    u.userData.redraw(0),
    rn.push(() => u.userData.redraw(ee)),
    u
  );
}
function kl(e, t, o = {}) {
  const n = o.r || 0.36,
    a = new r.Group();
  (a.position.set(e, t, 0.03), Pe.add(a));
  const s = new r.Mesh(Rr(0, 0.14, 0, n * 0.86, 36, 0.02), Ao);
  ((s.rotation.y = -Math.PI / 2), a.add(s));
  const i = new r.Mesh(
    new r.CylinderGeometry(n * 0.8, n * 0.84, 0.05, 48),
    U("#d7dde6", { roughness: 0.18, metalness: 1 }),
  );
  ((i.rotation.x = Math.PI / 2), (i.position.z = 0.16), a.add(i));
  const l = new r.Mesh(
    new r.BoxGeometry(0.03, n * 0.4, 0.01),
    Z(o.ring || "#ffb454", 3),
  );
  (l.position.set(0, n * 0.5, 0.19), a.add(l));
  const c = new r.Mesh(
    new r.TorusGeometry(n * 1.08, 0.022, 8, 64),
    Z(o.ring || "#ffb454", 2.6),
  );
  return (
    (c.position.z = 0.01),
    a.add(c),
    (a.userData = { ring: c, tick: l, spin: 0 }),
    a
  );
}
function Br(e, t, o, n = {}) {
  const a = te();
  a.box(
    re("#0b0e13", { roughness: 0.5 }),
    (e + t) / 2,
    o,
    0.04,
    t - e + 0.1,
    0.05,
    0.02,
  );
  for (let h = 0; h <= 40; h++) {
    const m = Dn(e, t, h / 40);
    a.box(
      re("#5a6272"),
      m,
      o + (h % 5 ? 0.1 : 0.12),
      0.04,
      0.012,
      h % 5 ? 0.06 : 0.1,
      0.01,
    );
  }
  a.flush(Pe, !1);
  const s = n.color || "#6fdcff",
    i = new r.Mesh(new r.BoxGeometry(1, 0.028, 0.012), Z(s, 3));
  (i.position.set(e, o, 0.055), Pe.add(i));
  const l = new r.Group(),
    c = te();
  (c
    .cyl(Ao, 0, 0, 0, 0.12, 0.12, 0.3, { seg: 28 })
    .cyl(Ha, 0, 0.1, 0, 0.125, 0.125, 0.03, { seg: 28 })
    .cyl(Ha, 0, -0.1, 0, 0.125, 0.125, 0.03, { seg: 28 }),
    c.flush(l));
  const f = new r.Mesh(new r.ConeGeometry(0.045, 0.07, 3), Z(s, 3));
  (f.position.set(0, -0.25, 0),
    (f.rotation.z = Math.PI),
    l.add(f),
    l.position.set(e, o, 0.17),
    Pe.add(l));
  const d = new r.Mesh(
    new r.PlaneGeometry(t - e + 0.3, 0.36),
    new r.MeshBasicMaterial({ visible: !1 }),
  );
  (d.position.set((e + t) / 2, o, 0.1), Pe.add(d));
  const u = (h, m) => {
      const g = new r.Group(),
        T = Z(s, 2.6);
      for (const E of [1, -1]) {
        const F = new r.Mesh(new r.BoxGeometry(0.2, 0.035, 0.012), T);
        (F.position.set(-m * 0.05, E * 0.06, 0),
          (F.rotation.z = E * m * -0.85),
          g.add(F));
      }
      const b = new r.Mesh(
        new r.PlaneGeometry(0.4, 0.5),
        new r.MeshBasicMaterial({ visible: !1 }),
      );
      return (
        g.add(b),
        (g.userData.hit = b),
        g.position.set(h, o + 0.02, 0.05),
        Pe.add(g),
        g
      );
    },
    p = {
      a: e,
      b: t,
      y: o,
      fill: i,
      knob: l,
      hit: d,
      chevL: n.chev === !1 ? null : u(e - 0.36, -1),
      chevR: n.chev === !1 ? null : u(t + 0.36, 1),
      t: 0,
      set(h) {
        this.t = V(h, 0, 1);
        const m = Dn(e, t, this.t);
        ((l.position.x = m),
          (i.scale.x = Math.max(0.001, m - e)),
          (i.position.x = e + (m - e) / 2));
      },
      fromRay(h) {
        const m = h.intersectObject(d, !1)[0];
        if (!m) return null;
        const g = Pe.worldToLocal(m.point.clone());
        return V((g.x - e) / (t - e), 0, 1);
      },
    };
  return (p.set(0), p);
}
const Xa = [];
function Gr(e, t, o, n, a, s = 128) {
  const i = "@RYANSAEL ON X",
    l = () => {
      ((e.font = `${n ? 700 : 600} ${s}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(s * 0.08) + "px"));
    };
  l();
  const c = e.measureText(i).width;
  c > t - 28 && ((s = Math.floor((s * (t - 28)) / c)), l());
  const f = t / 2 + Math.round(s * 0.04),
    d = o / 2 + s * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), n)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(i, f, d + s * 0.05),
      (e.fillStyle = a ? "#e08a24" : "#38332d"),
      e.fillText(i, f, d));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(i, f + s * 0.02, d + s * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(i, f, d - s * 0.025));
  const u = e.createLinearGradient(0, d - s * 0.7, 0, d);
  (u.addColorStop(0, "#f1d08c"),
    u.addColorStop(1, "#b3833d"),
    (e.fillStyle = u),
    e.fillText(i, f, d));
}
function Za(e, t = {}) {
  const o = !!t.pale,
    n = t.k ?? (o ? 0.92 : 0.6);
  let a = !1;
  const s = (l, c, f) => Gr(l, c, f, o, a),
    i = Wn(e, e * 0.1375, 1280, 176, s, n, { alphaTest: 0.25 });
  return (
    (i.userData.mark = 1),
    Qt.push(i),
    Xa.push({
      hit: i,
      over(l) {
        ((a = l),
          o
            ? i.userData.redraw(s)
            : i.material.color.setRGB(l ? 3.4 : n, l ? 2.5 : n, l ? 1.4 : n));
      },
    }),
    i
  );
}
function Ur(e, t, o = 1.2, n = {}) {
  const a = Za(o, n);
  return (a.position.set(e, t, 0.012), Pe.add(a), a);
}
const Lo = new r.Group();
(ot.add(Lo), (Lo.visible = !1));
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
        "varying vec3 vW;uniform vec3 uC;void main(){vec3 d=normalize(vW-vec3(0.,3.,0.));float glow=exp(-pow(length(vW.xy-uC.xy)/70.,2.));float up=smoothstep(-.1,.7,d.y);vec3 c=mix(vec3(.035,.07,.16),vec3(.07,.15,.33),glow);c=mix(c,vec3(.03,.05,.11),up*.6);gl_FragColor=vec4(c,1.);}",
    }),
  );
  ((e.renderOrder = -10), Lo.add(e), Jt.push(e));
  const t = Vt(
      new r.MeshStandardMaterial({
        color: "#1a2438",
        roughness: 0.32,
        metalness: 0.2,
        envMapIntensity: 0.5,
      }),
      Na,
    ),
    o = new r.Mesh(new r.CircleGeometry(90, 64), t);
  ((o.rotation.x = -Math.PI / 2),
    (o.receiveShadow = !0),
    Lo.add(o),
    Qt.push(o));
}
const zo = new r.Group();
(ot.add(zo), (zo.visible = !1));
{
  const e = [];
  for (let l = 40; l > -6; l -= 2) e.push([l, 0]);
  for (let l = 0; l <= 16; l++) {
    const c = ((l / 16) * Math.PI) / 2;
    e.push([-6 - Math.sin(c) * 10, 10 - Math.cos(c) * 10]);
  }
  for (let l = 12; l <= 60; l += 4) e.push([-16, l]);
  const t = [],
    o = [],
    n = [],
    a = 70;
  e.forEach(([l, c], f) => {
    const [d, u] = e[Math.min(f + 1, e.length - 1)],
      [p, h] = e[Math.max(f - 1, 0)],
      m = d - p,
      g = u - h,
      T = Math.hypot(m, g) || 1;
    for (const b of [-a, a]) (t.push(b, c, l), o.push(0, -m / T, g / T));
  });
  for (let l = 0; l < e.length - 1; l++) {
    const c = l * 2;
    n.push(c, c + 1, c + 2, c + 1, c + 3, c + 2);
  }
  const s = new r.BufferGeometry();
  (s.setAttribute("position", new r.Float32BufferAttribute(t, 3)),
    s.setAttribute("normal", new r.Float32BufferAttribute(o, 3)),
    s.setIndex(n));
  const i = new r.Mesh(
    s,
    re("#efe6da", { roughness: 0.92, envMapIntensity: 0.4 }),
  );
  ((i.receiveShadow = !0), zo.add(i));
}
class $n {
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
            ...rt,
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
          fragmentShader: `${vt}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);vec3 cc=mix(vC.rgb,vec3(dot(vC.rgb,vec3(.34,.46,.2))),core*.25);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.5),clamp(a*1.1,0.,1.));else gl_FragColor=vec4(cc*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Ee.add(this.mesh));
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
    (Qa.subVectors(o, t),
      Ja.addVectors(t, o).multiplyScalar(0.5),
      es.subVectors(P.position, Ja),
      ke.crossVectors(Qa, es).normalize());
    const f = this.pos,
      d = c * 12;
    ((f[d] = t.x - ke.x * n),
      (f[d + 1] = t.y - ke.y * n),
      (f[d + 2] = t.z - ke.z * n),
      (f[d + 3] = t.x + ke.x * n),
      (f[d + 4] = t.y + ke.y * n),
      (f[d + 5] = t.z + ke.z * n),
      (f[d + 6] = o.x - ke.x * a),
      (f[d + 7] = o.y - ke.y * a),
      (f[d + 8] = o.z - ke.z * a),
      (f[d + 9] = o.x + ke.x * a),
      (f[d + 10] = o.y + ke.y * a),
      (f[d + 11] = o.z + ke.z * a),
      this.side.set([-1, 1, -1, 1], c * 4));
    const u = this.col,
      p = c * 16;
    for (let h = 0; h < 4; h++)
      ((u[p + h * 4] = s.r),
        (u[p + h * 4 + 1] = s.g),
        (u[p + h * 4 + 2] = s.b),
        (u[p + h * 4 + 3] = h < 2 ? i : l));
  }
  line(t, o, n, a) {
    for (let s = 0; s < t.length - 1; s++) {
      const i = s / (t.length - 1),
        l = (s + 1) / (t.length - 1);
      this.seg(
        t[s],
        t[s + 1],
        W(t[s], o),
        W(t[s + 1], o),
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
const Qa = new r.Vector3(),
  Ja = new r.Vector3(),
  es = new r.Vector3(),
  ke = new r.Vector3(),
  ts = new $n(6e3);
class Nr {
  constructor(t) {
    this.max = t;
    const o = new r.BufferGeometry();
    ((this.pos = new Float32Array(t * 3)),
      (this.col = new Float32Array(t * 4)),
      (this.size = new Float32Array(t)),
      o.setAttribute(
        "position",
        new r.BufferAttribute(this.pos, 3).setUsage(r.DynamicDrawUsage),
      ),
      o.setAttribute(
        "aCol",
        new r.BufferAttribute(this.col, 4).setUsage(r.DynamicDrawUsage),
      ),
      o.setAttribute(
        "aSize",
        new r.BufferAttribute(this.size, 1).setUsage(r.DynamicDrawUsage),
      ),
      (this.mesh = new r.Points(
        o,
        new r.ShaderMaterial({
          uniforms: { ...rt, uPR: { value: 1 }, uLight: { value: 0 } },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: r.AdditiveBlending,
          vertexShader:
            "attribute vec4 aCol;attribute float aSize;uniform float uPR;varying vec4 vC;void main(){vC=aCol;gl_PointSize=aSize*uPR;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${vt}uniform float uLight;varying vec4 vC;void main(){vec2 q=gl_PointCoord*2.-1.;float r2=dot(q,q);if(r2>1.)discard;float core=exp(-r2*9.),halo=exp(-r2*3.2)*.5;float a=(core*1.4+halo)*vC.a*ovVis(.35);
    if(uLight>.5)gl_FragColor=vec4(vC.rgb*(.5+core*.3),clamp(a*1.2,0.,1.));else gl_FragColor=vec4(mix(vC.rgb,vec3(dot(vC.rgb,vec3(.34,.46,.2))),core*.35)*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 7),
      (this.n = 0),
      Ee.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? r.NormalBlending : r.AdditiveBlending));
  }
  begin() {
    ((this.n = 0), (this.mesh.material.uniforms.uPR.value = O.getPixelRatio()));
  }
  add(t, o, n, a) {
    if (this.n >= this.max) return;
    const s = this.n++;
    ((this.pos[s * 3] = t.x),
      (this.pos[s * 3 + 1] = t.y),
      (this.pos[s * 3 + 2] = t.z),
      (this.col[s * 4] = n.r),
      (this.col[s * 4 + 1] = n.g),
      (this.col[s * 4 + 2] = n.b),
      (this.col[s * 4 + 3] = a),
      (this.size[s] = o * 2.4));
  }
  end() {
    const t = this.mesh.geometry,
      o = Math.max(this.n, 1);
    t.setDrawRange(0, this.n);
    for (const [n, a] of [
      ["position", 3],
      ["aCol", 4],
      ["aSize", 1],
    ]) {
      const s = t.attributes[n];
      (s.clearUpdateRanges(), s.addUpdateRange(0, o * a), (s.needsUpdate = !0));
    }
  }
}
const gt = new Nr(2400),
  W = (e, t) =>
    ((P.position.distanceTo(e) *
      Math.tan(r.MathUtils.degToRad(P.fov / 2)) *
      2) /
      Math.max(Lt.clientHeight, 1)) *
    t *
    0.5;
function Yn(e = 640, t = 104) {
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
    Ee.add(s),
    (s.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 1,
      set(i, l = "", c = "#7fe3ff", f = 0) {
        const d = i + "|" + l + "|" + c + "|" + f;
        if (d === this.key) return;
        ((this.key = d),
          (this.args = [i, l, c, f]),
          n.clearRect(0, 0, e, t),
          (n.font = "600 38px Outfit, sans-serif"));
        const u = n.measureText(i).width;
        n.font = "500 30px DM Mono, monospace";
        const p = l ? n.measureText(l).width + 26 : 0,
          h = Math.min(e - 8, u + p + 84),
          m = f < 0 ? 4 : f > 0 ? e - 4 - h : (e - h) / 2;
        ((n.fillStyle = "rgba(10,14,26,.86)"),
          Sr(n, m, 8, h, t - 16, (t - 16) / 2),
          n.fill(),
          (n.fillStyle = c),
          n.beginPath(),
          n.arc(m + 34, t / 2, 9, 0, 7),
          n.fill(),
          (n.fillStyle = "#f2f6ff"),
          (n.font = "600 38px Outfit, sans-serif"),
          (n.textBaseline = "middle"),
          n.fillText(i, m + 56, t / 2 + 1),
          l &&
            ((n.fillStyle = "#9fe6ff"),
            (n.font = "500 30px DM Mono, monospace"),
            n.fillText(l, m + 56 + u + 22, t / 2 + 2)),
          (a.needsUpdate = !0));
      },
    }),
    rn.push(() => {
      const i = s.userData;
      i.args && ((i.key = ""), i.set(...i.args));
    }),
    s
  );
}
function jn(e, t, o = 24, n = 0) {
  const a = (W(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(P.quaternion),
    e.scale.set(a, a, a),
    n &&
      e.position.addScaledVector(
        Or.set(0, 1, 0).applyQuaternion(P.quaternion),
        (n * a * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-St * 8))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
const Or = new r.Vector3();
let _t = !0;
const Ir = 6371,
  Xn = 312e-7,
  Wr = 16726e-31,
  Kr = 4e-7 * Math.PI,
  Q = {
    O0: 9e4,
    v0: 20,
    W0: 0.25,
    pow: 0.39,
    K: 0.88,
    fcap: 0.42,
    accR0: 1.6,
    accR1: 2.9,
    maxAge: 7,
    atmA: 1.5,
    atmP: 0.7,
  },
  Zn = (e) => 300 + 600 * e,
  os = (e) => 3 + 27 * e * e,
  ns = (e) => os(e) * 1e6 * Wr * (Zn(e) * 1e3) ** 2,
  Hr = (e, t) =>
    V(
      Math.pow(
        (4 * (Xn * Math.max(t, 0.03)) ** 2) / (2 * Kr * Q.K * ns(e)),
        1 / 6,
      ),
      3,
      14,
    ),
  qr = (e) => Math.acos(Math.sqrt(1 / e)),
  oo = (e, t) => e * Math.pow(2 / Math.max(1 + t, 0.08), 0.58),
  Bt = (e) => Math.pow(Math.max(e, 1), Q.pow),
  $r = (e) => Math.pow(Math.max(e, 1), 1 / Q.pow),
  Vo = (e) => 1 + Q.atmA * Math.pow(V((e - 70) / 450, 0, 1), Q.atmP),
  wt = [
    [80, 0.0093],
    [90, 0.00193],
    [100, 337e-6],
    [110, 75e-6],
    [120, 265e-7],
    [130, 132e-7],
    [140, 77e-7],
    [150, 48e-7],
    [160, 32e-7],
    [180, 16e-7],
    [200, 93e-8],
    [250, 27e-8],
    [300, 96e-9],
    [350, 37e-9],
    [400, 16e-9],
    [500, 33e-10],
    [600, 8e-10],
  ];
function fn(e) {
  if (e <= wt[0][0]) return wt[0][1];
  for (let t = 1; t < wt.length; t++)
    if (e <= wt[t][0]) {
      const [o, n] = wt[t - 1],
        [a, s] = wt[t];
      return Math.exp(
        Math.log(n) + ((Math.log(s) - Math.log(n)) * (e - o)) / (a - o),
      );
    }
  return wt[wt.length - 1][1];
}
const as = (e) => 43e-8 + 536e-8 * Math.pow(e, 1.67);
function Al(e) {
  const t = as(e);
  let o = 70,
    n = 600;
  for (let a = 0; a < 36; a++) {
    const s = (o + n) / 2;
    fn(s) > t ? (o = s) : (n = s);
  }
  return (o + n) / 2;
}
const dn = 0.2,
  ss = 30,
  un = (e) => dn * Math.pow(ss / dn, e),
  $e = (e) => Math.log(e / dn) / Math.log(ss / dn),
  no = 70,
  Qn = 520,
  Ae = 128,
  Yr = (e) => 0.9 / (1 + Math.exp(-(e - 175) / 35)),
  Ue = {
    g: [0.1, 1, 0.34],
    r: [1, 0.04, 0.13],
    b: [0.46, 0.16, 1],
    p: [1, 0.16, 0.66],
  },
  ao = new Float32Array(Ae * 4),
  Gt = new Float32Array(Ae * 4),
  jr = (e) => (e >= 1 ? 0 : ((0.8 + 6 * e) * (1 - e) * (1 - e)) / 0.767);
function rs(e, t) {
  const o = as(e),
    n = fn(t) / o;
  if (n >= 1) return 0;
  const a = (fn(t - 1) - fn(t + 1)) / 2;
  return ((jr(n) * a) / o) * e;
}
function is(e) {
  let t = 1e-30;
  const o = 0.3;
  for (let n = 0; n < Ae; n++) {
    const a = no + ((Qn - no) * n) / (Ae - 1),
      s = 0.75 * rs(e, a) + 0.25 * rs(o, a) * (e / o) * 0.35,
      i = Yr(a),
      l = 1 / (1 + Math.exp(-(a - 98) / 4)),
      c = 1 / (1 + Math.exp(-(a - 215) / 16)),
      f = 0.85 / (1 + Math.exp(-(a - 215) / 24)),
      d = s * l * (1 - 0.7 * i),
      u = s * i * c * 1.5,
      p = s * ((1 - i) * 0.28 + f * 1.1),
      h = s * (1 - i) * 0.14 * (1.3 - l);
    Gt.set([d, u, p, h], n * 4);
  }
  for (let n = 0; n < Ae; n++) {
    const [a, s, i, l] = Gt.subarray(n * 4, n * 4 + 4),
      c = a * Ue.g[0] + s * Ue.r[0] + i * Ue.b[0] + l * Ue.p[0],
      f = a * Ue.g[1] + s * Ue.r[1] + i * Ue.b[1] + l * Ue.p[1],
      d = a * Ue.g[2] + s * Ue.r[2] + i * Ue.b[2] + l * Ue.p[2];
    (ao.set([c, f, d, 0.2126 * c + 0.7152 * f + 0.0722 * d], n * 4),
      (t = Math.max(t, ao[n * 4 + 3])));
  }
  for (let n = 0; n < Ae * 4; n++) ((ao[n] /= t), (Gt[n] /= t));
}
function Xr() {
  let e = 0,
    t = 0,
    o = 0,
    n = 0,
    a = 0,
    s = 0;
  for (let i = 0; i < Ae; i++) {
    const l = ao[i * 4 + 3],
      c = no + ((Qn - no) * i) / (Ae - 1);
    (l > e && ((e = l), (t = c)),
      (n += Gt[i * 4]),
      (a += Gt[i * 4 + 1]),
      (s += Gt[i * 4 + 2] + Gt[i * 4 + 3]));
  }
  for (let i = 0; i < Ae; i++)
    if (ao[i * 4 + 3] > 0.2 * e) {
      o = no + ((Qn - no) * i) / (Ae - 1);
      break;
    }
  return {
    peak: t,
    low: o,
    green: n / (n + a + s),
    red: a / (n + a + s),
    blue: s / (n + a + s),
  };
}
const Ut = new r.DataTexture(new Uint8Array(Ae * 4), Ae, 1, r.RGBAFormat);
((Ut.magFilter = Ut.minFilter = r.LinearFilter),
  (Ut.wrapS = r.ClampToEdgeWrapping));
function ls() {
  const e = Ut.image.data;
  for (let t = 0; t < Ae * 4; t++) e[t] = Math.round(V(ao[t], 0, 1) * 255);
  Ut.needsUpdate = !0;
}
const J = 1500,
  fe = 9,
  v = {
    s: new Uint8Array(J),
    acc: new Uint8Array(J),
    src: new Uint8Array(J),
    leg: new Uint8Array(J),
    fib: new Uint8Array(J),
    age: new Float32Array(J),
    gp: new Float32Array(J),
    x: new Float64Array(J),
    y: new Float64Array(J),
    z: new Float64Array(J),
    vx: new Float64Array(J),
    vy: new Float64Array(J),
    vz: new Float64Array(J),
    ly: new Float64Array(J),
    d: new Float32Array(J * 3),
    tr: new Float32Array(J * fe * 3),
    th: new Uint8Array(J),
    tn: new Uint8Array(J),
    free: [],
  };
for (let e = J - 1; e >= 0; e--) v.free.push(e);
const cs = 1,
  so = 2,
  Jn = 3,
  oe = 64,
  Mt = new Float32Array(oe),
  ro = new Float32Array(oe),
  Nt = 96,
  q = {
    x: new Float32Array(Nt * 3),
    t: new Float32Array(Nt).fill(-9),
    h: new Uint8Array(Nt),
    n: 0,
  },
  y = {
    capRate: 0,
    capEMA: 0,
    tailAcc: 0,
    windAcc: 0,
    landRate: 0,
    landEMA: 0,
    steps: 0,
    splash: 0,
    splashEMA: 0,
    hits: 0,
    rmp: 10.4,
    oval: 1.26,
    fk: 1,
    u: 0.25,
    E: 5,
    hLow: 110,
    src: new r.Vector3(),
    foc: new r.Vector3(),
    aim: new r.Vector3(1, 0, 0),
    eN: new r.Vector3(1, 0, 0),
    eR: 0.8,
    sphere: 0,
  },
  Ll = [0, 0, 0];
function fs() {
  if (!v.free.length) return -1;
  const e = v.free.pop();
  return (
    (v.th[e] = 0),
    (v.tn[e] = 0),
    (v.age[e] = 0),
    (v.acc[e] = 0),
    (v.leg[e] = 0),
    e
  );
}
function Ot(e) {
  v.s[e] && ((v.s[e] = 0), v.free.push(e));
}
function ds(e, t, o, n, a, s, i) {
  ((v.x[e] = t), (v.y[e] = o), (v.z[e] = n));
  const l = t * t + o * o + n * n,
    c = Math.sqrt(l),
    f = 1 / (l * l * c),
    d = -o;
  let u = 3 * d * t * f,
    p = (3 * d * o + l) * f,
    h = 3 * d * n * f;
  const m = Math.hypot(u, p, h);
  ((u /= m), (p /= m), (h /= m));
  const g = (p >= 0 ? 1 : -1) * s;
  let T = -h,
    b = u,
    E = Math.hypot(T, b);
  (E < 1e-6 && ((T = 1), (b = 0), (E = 1)), (T /= E), (b /= E));
  const F = p * b,
    B = h * T - u * b,
    w = -p * T,
    S = Y() * 6.2832,
    C = Math.cos(S),
    R = Math.sin(S),
    k = i * Math.cos(a) * g,
    z = i * Math.sin(a);
  ((v.vx[e] = u * k + (T * C + F * R) * z),
    (v.vy[e] = p * k + B * R * z),
    (v.vz[e] = h * k + (b * C + w * R) * z),
    (v.s[e] = so),
    (v.ly[e] = o),
    (v.acc[e] = 0));
}
function us(e, t, o, n, a) {
  const s = Math.sqrt(t * t + o * o + n * n),
    i = Math.asin(o / s),
    l = Math.atan2(n, t),
    c = ((l / 6.2832 + 1) % 1) * oe,
    f = Math.sqrt(y.E / 5) * (v.src[e] === 2 ? 0.8 : 1),
    d = Math.floor(c),
    u = c - d,
    p = o > 0 ? Mt : ro;
  ((p[d % oe] += f * (1 - u)), (p[(d + 1) % oe] += f * u), (y.landRate += 1));
  const h = q.n++ % Nt,
    m = Vo(y.hLow + 8),
    g = Math.cos(i);
  ((q.x[h * 3] = g * Math.cos(l) * m),
    (q.x[h * 3 + 1] = Math.sin(i) * m),
    (q.x[h * 3 + 2] = g * Math.sin(l) * m),
    (q.t[h] = ee),
    (q.h[h] = o > 0 ? 1 : 0),
    Ot(e));
}
function Zr(e, t) {
  const o = Q.O0 * y.fk,
    n = 1 + y.hLow / Ir,
    a = Q.v0 * Math.sqrt(1 + y.E / Q.W0),
    s = (a * a - Q.v0 * Q.v0) / (2 * (Q.accR1 - Q.accR0) * 1.15),
    i = y.rmp * 0.78,
    l = y.rmp * 1.35;
  let c = t,
    f = v.x[e],
    d = v.y[e],
    u = v.z[e],
    p = v.vx[e],
    h = v.vy[e],
    m = v.vz[e],
    g = 0;
  for (; c > 0 && g < 600;) {
    g++;
    const T = f * f + d * d + u * u,
      b = Math.sqrt(T),
      E = 1 / (T * T * b),
      F = -d,
      B = 3 * F * f * E,
      w = (3 * F * d + T) * E,
      S = 3 * F * u * E,
      C = Math.sqrt(B * B + w * w + S * S);
    if (b < Q.accR0 && v.acc[e]) {
      const tt = Math.sqrt(p * p + h * h + m * m),
        Qe = B / C,
        Ke = w / C,
        kt = S / C,
        To = Qe * f + Ke * d + kt * u <= 0 ? 1 : -1,
        At = Math.min(c, 0.05 / tt);
      if (
        ((c -= At),
        (p = Qe * To * tt),
        (h = Ke * To * tt),
        (m = kt * To * tt),
        (f += p * At),
        (d += h * At),
        (u += m * At),
        Math.sqrt(f * f + d * d + u * u) < n)
      ) {
        ((y.steps += g), us(e, f, d, u, tt));
        return;
      }
      continue;
    }
    const R = Math.min(c, 0.5 / (o * C + 1e-9));
    c -= R;
    let k = 0,
      z = 0,
      G = 0;
    if (
      b > Q.accR0 &&
      b < Q.accR1 &&
      (b * T) / Math.max(f * f + u * u, 1e-9) >= i
    ) {
      const Qe = s / C,
        Ke = B * f + w * d + S * u <= 0 ? Qe : -Qe;
      ((k = B * Ke), (z = w * Ke), (G = S * Ke), (v.acc[e] = 1));
    }
    ((p += k * R * 0.5), (h += z * R * 0.5), (m += G * R * 0.5));
    const I = -o * R * 0.5,
      X = B * I,
      H = w * I,
      ne = S * I,
      pe = 2 / (1 + X * X + H * H + ne * ne),
      Se = p + (h * ne - m * H),
      We = h + (m * X - p * ne),
      De = m + (p * H - h * X);
    if (
      ((p += (We * ne - De * H) * pe + k * R * 0.5),
      (h += (De * X - Se * ne) * pe + z * R * 0.5),
      (m += (Se * H - We * X) * pe + G * R * 0.5),
      (f += p * R),
      (d += h * R),
      (u += m * R),
      d * v.ly[e] < 0 && Y() < 0.3)
    ) {
      const tt = Math.sqrt(p * p + h * h + m * m),
        Qe = B / C,
        Ke = w / C,
        kt = S / C,
        To = p * Qe + h * Ke + m * kt >= 0 ? 1 : -1,
        At = Math.abs(Y() + Y() - 1) * 0.45;
      let Ro = -kt,
        Co = Qe,
        Aa = Math.hypot(Ro, Co) || 1;
      ((Ro /= Aa), (Co /= Aa));
      const js = Ke * Co,
        Xs = kt * Ro - Qe * Co,
        Zs = -Ke * Ro,
        La = Y() * 6.2832,
        za = Math.cos(La),
        An = Math.sin(La),
        Ln = Math.cos(At) * tt * To,
        zn = Math.sin(At) * tt;
      ((p = Qe * Ln + (Ro * za + js * An) * zn),
        (h = Ke * Ln + Xs * An * zn),
        (m = kt * Ln + (Co * za + Zs * An) * zn));
    }
    v.ly[e] = d;
    const So = Math.sqrt(f * f + d * d + u * u);
    if (So < n) {
      ((y.steps += g), us(e, f, d, u, 0));
      return;
    }
    if (So > l) {
      ((y.steps += g), Ot(e));
      return;
    }
  }
  ((y.steps += g),
    (v.x[e] = f),
    (v.y[e] = d),
    (v.z[e] = u),
    (v.vx[e] = p),
    (v.vy[e] = h),
    (v.vz[e] = m));
}
function Qr(e, t) {
  const o = e * 3,
    n = v.x[e],
    a = v.y[e],
    s = v.z[e],
    i = n * n + a * a + s * s,
    l = Math.sqrt(i),
    c = 1 / (i * i * l),
    f = -a;
  let d = 3 * f * n * c,
    u = (3 * f * a + i) * c,
    p = 3 * f * s * c;
  const h = Math.sqrt(d * d + u * u + p * p);
  ((d /= h), (u /= h), (p /= h));
  const m = v.vx[e],
    g = v.vy[e],
    T = v.vz[e],
    b = m * d + g * u + T * p,
    E = m - b * d,
    F = g - b * u,
    B = T - b * p,
    w = Q.O0 * Math.max(y.fk, 0.05) * h,
    S = Math.sqrt(E * E + F * F + B * B) / w,
    C = n - (u * T - p * g) / w,
    R = a - (p * m - d * T) / w,
    k = s - (d * g - u * m) / w;
  v.gp[e] += Math.min(w, 19) * t;
  const z = Math.cos(v.gp[e]),
    G = Math.sin(v.gp[e]),
    I = Math.hypot(C, k) || 1,
    X = k / I,
    H = -C / I,
    ne = C + S * (z * X + G * u * H),
    pe = R + S * G * (p * X - d * H),
    Se = k + S * (z * H - G * u * X),
    We = Math.sqrt(ne * ne + pe * pe + Se * Se);
  let De = Bt(We);
  (v.acc[e] && We < 3 && (De = Math.max(De, Vo(y.hLow) + (De - 1) * 0.25)),
    (v.d[o] = (ne / We) * De),
    (v.d[o + 1] = (pe / We) * De),
    (v.d[o + 2] = (Se / We) * De));
}
function Jr(e, t, o) {
  const n = Math.hypot(e, t, o);
  if (n < 1e-6) return !1;
  const a = $r(n),
    s = -e / n;
  return s > -0.25 && a < oo(y.rmp, s);
}
const ea = new r.Vector3(),
  ta = new r.Vector3(),
  hn = new r.Vector3(),
  pn = 26,
  hs = Array.from({ length: pn }, (e, t) => {
    const o = Math.sqrt((t + 0.5) / pn),
      n = t * 2.39996;
    return { u: Math.cos(n) * o, v: Math.sin(n) * o };
  }),
  Le = new r.Vector3();
function ps() {
  (ea.copy(y.eN),
    hn.set(0, 1, 0).cross(ea).normalize(),
    ta.crossVectors(ea, hn));
}
function mn(e, t) {
  const o = hs[e];
  return (
    ps(),
    t
      .copy(y.aim)
      .addScaledVector(hn, o.u * 0.13)
      .addScaledVector(ta, o.v * 0.13)
      .normalize()
  );
}
function ms(e, t) {
  const o = hs[e];
  return (
    ps(),
    t
      .copy(y.src)
      .addScaledVector(hn, o.u * y.eR)
      .addScaledVector(ta, o.v * y.eR)
  );
}
function ei() {
  const e = fs();
  if (e < 0) return;
  ((v.s[e] = cs), (v.src[e] = 0), (v.leg[e] = y.sphere ? 0 : 1));
  const t = e * 3,
    o = Math.floor(Y() * pn);
  ((v.fib[e] = o),
    ms(o, Le),
    (v.d[t] = Le.x + (Y() - 0.5) * 0.03),
    (v.d[t + 1] = Le.y + (Y() - 0.5) * 0.03),
    (v.d[t + 2] = Le.z + (Y() - 0.5) * 0.03));
  const n = (2.6 + 2 * y.u) * y.vw;
  (v.leg[e] === 0
    ? Le.set(
        y.foc.x - v.d[t],
        y.foc.y - v.d[t + 1],
        y.foc.z - v.d[t + 2],
      ).normalize()
    : mn(o, Le),
    (v.vx[e] = Le.x * n),
    (v.vy[e] = Le.y * n),
    (v.vz[e] = Le.z * n),
    (v.x[e] = n));
}
function ti(e, t) {
  const o = e * 3;
  let n = v.d[o],
    a = v.d[o + 1],
    s = v.d[o + 2];
  if (v.leg[e] === 0) {
    const l = y.foc.x - n,
      c = y.foc.y - a,
      f = y.foc.z - s,
      d = Math.hypot(l, c, f),
      u = v.x[e];
    d < u * t
      ? ((v.leg[e] = 1),
        mn(v.fib[e], Le),
        (v.vx[e] = Le.x * u),
        (v.vy[e] = Le.y * u),
        (v.vz[e] = Le.z * u),
        (n = y.foc.x),
        (a = y.foc.y),
        (s = y.foc.z))
      : ((v.vx[e] = (l / d) * u),
        (v.vy[e] = (c / d) * u),
        (v.vz[e] = (f / d) * u));
  }
  ((n += v.vx[e] * t),
    (a += v.vy[e] * t),
    (s += v.vz[e] * t),
    (v.d[o] = n),
    (v.d[o + 1] = a),
    (v.d[o + 2] = s));
  const i = Math.hypot(n, a, s);
  if (v.leg[e] === 1 && y.fk > 0.08 && Jr(n, a, s)) {
    if ((y.hits++, Y() < Q.fcap * Math.min(1, y.fk))) {
      const l = oo(y.rmp, -n / i) * 0.985,
        c = Math.asin(a / i),
        f = Math.abs(c) < 0.05 ? (Y() < 0.5 ? 1 : -1) : Math.sign(c);
      ((v.src[e] = 1),
        ds(
          e,
          (n / i) * l,
          (a / i) * l,
          (s / i) * l,
          Math.abs(Y() + Y() + Y() - 1.5) * 0.12,
          f,
          Q.v0,
        ),
        (y.capRate += 1));
      return;
    }
    ((v.s[e] = Jn), (v.ly[e] = 0));
    return;
  }
  if (y.fk <= 0.08 && i < Vo(120)) {
    ((y.splash += 1),
      (y.sx += (n / i - y.sx) * 0.05),
      (y.sy += (a / i - y.sy) * 0.05),
      (y.sz += (s / i - y.sz) * 0.05));
    const l = q.n++ % Nt;
    ((q.x[l * 3] = n),
      (q.x[l * 3 + 1] = a),
      (q.x[l * 3 + 2] = s),
      (q.t[l] = ee),
      (q.h[l] = 2),
      Ot(e));
    return;
  }
  (i < 1.02 ||
    (v.leg[e] === 1 &&
      i > (y.sphere ? y.sphere + 0.2 : 5.6) &&
      v.vx[e] * n + v.vy[e] * a + v.vz[e] * s > 0) ||
    v.age[e] > 5) &&
    Ot(e);
}
function oi(e, t) {
  const o = e * 3;
  let n = v.d[o],
    a = v.d[o + 1],
    s = v.d[o + 2];
  const i = Math.hypot(n, a, s),
    l = n / i,
    c = a / i,
    f = s / i;
  let d = v.vx[e],
    u = v.vy[e],
    p = v.vz[e];
  const h = d * l + u * c + p * f;
  (h < 0 && ((d -= h * l), (u -= h * c), (p -= h * f)), (d += t * 4));
  const m = v.x[e],
    g = Math.hypot(d, u, p) || 1;
  ((d *= m / g),
    (u *= m / g),
    (p *= m / g),
    (v.vx[e] = d),
    (v.vy[e] = u),
    (v.vz[e] = p),
    (n += d * t),
    (a += u * t),
    (s += p * t));
  const T = Math.hypot(n, a, s),
    b = -n / T;
  if (y.fk > 0.08 && b > -0.1) {
    const E = Bt(oo(y.rmp, b)) * 1.01;
    T < E && ((n *= E / T), (a *= E / T), (s *= E / T));
  } else v.ly[e] || (v.ly[e] = v.age[e]);
  ((v.d[o] = n),
    (v.d[o + 1] = a),
    (v.d[o + 2] = s),
    v.ly[e] && (v.x[e] *= Math.exp(-t * 2.5)),
    (T > (y.sphere ? y.sphere + 0.2 : 5.2) ||
      v.age[e] > 5 ||
      (v.ly[e] && v.age[e] - v.ly[e] > 0.25)) &&
      Ot(e));
}
function ni() {
  const e = fs();
  if (e < 0) return;
  const t = y.rmp * (0.97 + Y() * 0.28),
    o = (Y() - 0.5) * 1.7,
    n = (Y() - 0.5) * 0.08,
    a = Y() < 0.8 ? Math.abs(Y() + Y() + Y() - 1.5) * 0.12 : 0.1 + Y() * 0.5;
  (ds(
    e,
    t * Math.cos(n) * Math.cos(o),
    t * Math.sin(n),
    t * Math.cos(n) * Math.sin(o),
    a,
    Y() < 0.5 ? 1 : -1,
    Q.v0,
  ),
    (v.src[e] = 2));
}
function oa(e) {
  for (
    y.u = x.wind + x.gustK * 0.55,
      y.E = un(x.energy),
      y.fk = x.fieldK,
      y.rmp = Hr(y.u, Math.max(y.fk, 0.03)),
      y.oval = qr(y.rmp),
      Math.abs(y.E - y.Eprof) > 0.004 * y.E &&
        (is(y.E),
        ls(),
        (y.Eprof = y.E),
        (y.stats = Xr()),
        (y.hLow = y.stats.low)),
      y.windAcc += (x.stream ? 1 : 0) * (55 + 150 * y.u) * y.rate * e;
    y.windAcc >= 1;
  )
    (y.windAcc--, ei());
  for (
    y.capEMA +=
      (y.capRate / Math.max(e, 1e-4) - y.capEMA) * (1 - Math.exp(-e / 2.2)),
      y.capRate = 0,
      y.tailAcc += y.capEMA * 0.7 * (y.fk > 0.08 ? 1 : 0) * e;
    y.tailAcc >= 1;
  )
    (y.tailAcc--, ni());
  y.steps = 0;
  for (let o = 0; o < J; o++) {
    const n = v.s[o];
    if (n) {
      if (((v.age[o] += e), n === cs)) ti(o, e);
      else if (n === Jn) oi(o, e);
      else {
        if (v.age[o] > Q.maxAge || y.fk <= 0.02) {
          Ot(o);
          continue;
        }
        (Zr(o, e), v.s[o] && Qr(o, e));
      }
      if (v.s[o]) {
        const a = o * 3,
          s = (o * fe + v.th[o]) * 3;
        ((v.tr[s] = v.d[a]),
          (v.tr[s + 1] = v.d[a + 1]),
          (v.tr[s + 2] = v.d[a + 2]),
          (v.th[o] = (v.th[o] + 1) % fe),
          v.tn[o] < fe && v.tn[o]++);
      }
    }
  }
  const t = Math.exp(-e / 1.3);
  for (let o = 0; o < oe; o++) ((Mt[o] *= t), (ro[o] *= t));
  ((y.landEMA +=
    (y.landRate / Math.max(e, 1e-4) - y.landEMA) * (1 - Math.exp(-e / 1.5))),
    (y.landRate = 0),
    (y.splashEMA +=
      (y.splash / Math.max(e, 1e-4) - y.splashEMA) * (1 - Math.exp(-e / 0.8))),
    (y.splash = 0));
}
Object.assign(y, {
  Eprof: -1,
  stats: null,
  vw: 1,
  rate: 1,
  sx: -1,
  sy: 0,
  sz: 0,
});
const ai = [
    [
      -168, 66, -162, 70, -150, 71, -140, 70, -128, 70, -115, 69, -95, 72, -85,
      70, -80, 63, -94, 59, -92, 57, -82, 55, -78, 52, -72, 56, -64, 60, -56,
      53, -60, 47, -66, 45, -70, 43, -70, 41, -74, 40, -76, 35, -81, 31, -80,
      26, -82, 26, -83, 29, -89, 30, -94, 29, -97, 26, -97, 22, -94, 18, -90,
      21, -87, 21, -88, 16, -84, 15, -83, 11, -80, 9, -78, 8, -81, 7, -85, 10,
      -87, 13, -92, 14, -96, 16, -105, 20, -106, 23, -112, 29, -114, 31, -110,
      24, -112, 25, -117, 32, -121, 35, -124, 40, -124, 46, -123, 49, -130, 55,
      -135, 58, -142, 60, -150, 59, -154, 57, -162, 55, -160, 58, -164, 60,
      -166, 62, -164, 64, -168, 66,
    ],
    [
      -80, 9, -77, 8, -72, 12, -64, 10, -60, 8, -52, 5, -50, 1, -44, -2, -38,
      -4, -35, -7, -35, -10, -39, -14, -39, -18, -41, -22, -45, -23, -48, -26,
      -49, -29, -52, -32, -54, -34, -57, -36, -57, -38, -62, -39, -63, -42, -65,
      -45, -67, -46, -66, -48, -69, -51, -68, -53, -72, -54, -75, -51, -74, -45,
      -73, -40, -72, -33, -71, -28, -70, -20, -70, -18, -76, -14, -79, -8, -81,
      -5, -80, -1, -78, 2, -77, 5, -78, 8,
    ],
    [
      -73, 78, -60, 82, -35, 83, -20, 82, -18, 77, -22, 70, -32, 68, -40, 65,
      -44, 60, -50, 62, -53, 67, -55, 70, -60, 76,
    ],
    [-80, 63, -72, 62, -63, 65, -68, 70, -80, 73, -90, 72, -85, 68],
    [-90, 76, -80, 77, -65, 82, -80, 83, -98, 80, -100, 76],
    [-120, 70, -105, 68, -100, 72, -110, 75, -122, 74],
    [
      -10, 36, -9, 43, -2, 44, -5, 48, -1, 49, 2, 51, 5, 53, 8, 54, 9, 57, 5,
      58, 5, 62, 10, 64, 14, 68, 20, 70, 28, 71, 33, 69, 40, 67, 44, 68, 50, 69,
      60, 70, 69, 73, 80, 73, 90, 76, 100, 78, 113, 74, 120, 73, 130, 71, 140,
      72, 150, 71, 160, 70, 170, 70, 180, 66, 178, 64, 172, 61, 163, 60, 162,
      56, 156, 51, 157, 58, 152, 59, 143, 59, 137, 54, 141, 52, 140, 48, 135,
      43, 129, 41, 129, 35, 126, 35, 126, 38, 122, 39, 121, 41, 118, 39, 121,
      37, 122, 31, 121, 28, 118, 24, 113, 22, 108, 21, 106, 17, 109, 12, 105, 9,
      103, 10, 100, 13, 100, 8, 103, 1, 100, 3, 98, 8, 98, 15, 94, 17, 92, 21,
      90, 22, 86, 20, 80, 15, 80, 10, 77, 8, 73, 17, 72, 21, 67, 24, 61, 25, 57,
      26, 56, 24, 59, 22, 58, 18, 52, 16, 45, 13, 43, 15, 39, 21, 35, 28, 34,
      31, 35, 34, 36, 36, 30, 36, 27, 37, 26, 40, 29, 41, 28, 43, 25, 44, 28,
      45, 33, 45, 35, 47, 38, 47, 40, 44, 41, 41, 36, 41, 32, 42, 28, 41, 24,
      40, 23, 37, 22, 39, 20, 40, 19, 42, 16, 44, 13, 45, 12, 44, 16, 41, 18,
      40, 16, 38, 12, 38, 10, 44, 7, 44, 3, 43, 0, 39, -2, 37, -6, 36,
    ],
    [
      -17, 21, -16, 15, -17, 13, -12, 8, -8, 5, -2, 5, 4, 6, 9, 4, 10, 1, 9, -2,
      12, -6, 13, -12, 12, -17, 15, -27, 18, -34, 20, -35, 25, -34, 31, -29, 33,
      -25, 35, -22, 35, -17, 40, -15, 40, -10, 39, -5, 41, -1, 44, 1, 48, 5, 51,
      11, 44, 11, 43, 13, 39, 16, 37, 21, 34, 27, 32, 31, 29, 31, 25, 32, 20,
      31, 20, 33, 15, 32, 11, 33, 10, 37, 3, 37, -2, 35, -6, 36, -9, 33, -10,
      29, -13, 28,
    ],
    [
      114, -22, 114, -26, 115, -34, 118, -35, 123, -34, 129, -32, 132, -32, 135,
      -35, 138, -35, 140, -38, 145, -38, 150, -37, 153, -32, 153, -26, 150, -22,
      146, -19, 145, -15, 142, -11, 141, -13, 137, -12, 136, -15, 132, -11, 129,
      -15, 126, -14, 122, -18,
    ],
    [
      -180, -90, 180, -90, 180, -78, 160, -77, 165, -71, 140, -66, 120, -66, 90,
      -66, 60, -67, 30, -69, 0, -70, -30, -76, -60, -75, -58, -64, -65, -68,
      -75, -72, -100, -73, -130, -74, -160, -78, -180, -78,
    ],
    [
      -6, 50, -3, 51, 1, 51, 2, 53, 0, 54, -2, 56, -3, 58, -6, 58, -5, 55, -3,
      54, -5, 52,
    ],
    [-10, 52, -6, 52, -6, 55, -8, 55, -10, 54],
    [-24, 64, -22, 66, -15, 66, -14, 65, -18, 63, -22, 63],
    [
      130, 31, 132, 34, 135, 34, 138, 35, 141, 37, 142, 40, 141, 43, 145, 44,
      142, 46, 140, 42, 139, 38, 136, 36, 132, 35, 130, 33,
    ],
    [44, -25, 47, -25, 50, -15, 49, -12, 45, -16, 43, -22],
    [95, 5, 98, 4, 104, -2, 106, -6, 103, -5, 100, 0, 96, 3],
    [109, 1, 111, -3, 116, -4, 119, 1, 117, 6, 113, 3],
    [131, -1, 138, -2, 145, -5, 150, -10, 146, -8, 141, -9, 137, -5, 132, -3],
    [105, -6, 110, -7, 114, -8, 106, -7],
    [
      172, -35, 175, -37, 178, -38, 176, -41, 174, -41, 172, -41, 171, -44, 168,
      -46, 167, -45, 170, -43, 173, -40, 174, -37,
    ],
    [122, 18, 124, 12, 126, 7, 123, 7, 120, 14],
    [-85, 22, -80, 23, -74, 20, -78, 20, -82, 22],
    [-74, 19, -69, 19, -68, 18, -72, 18],
    [10, 78, 20, 80, 28, 80, 24, 77, 15, 76],
    [52, 71, 58, 75, 68, 77, 60, 73, 54, 70],
    [140, 74, 150, 75, 145, 76],
    [-120, 56, -128, 52, -124, 49],
  ],
  si = [
    [
      -95, 59, -92, 57, -82, 55, -79, 52, -78, 58, -77, 62, -82, 64, -88, 64,
      -94, 61,
    ],
    [28, 41, 28, 46, 33, 46, 38, 47, 41, 42, 36, 41],
    [47, 37, 54, 37, 53, 42, 52, 45, 49, 47, 47, 44],
  ],
  ri = [
    [-15, 15, 35, 31],
    [35, 15, 58, 31],
    [118, -31, 140, -19],
    [-117, 26, -104, 37],
    [-72, -28, -68, -18],
    [90, 38, 112, 46],
    [55, 28, 72, 40],
    [12, -28, 24, -18],
  ],
  ii = (() => {
    const o = document.createElement("canvas");
    ((o.width = 720), (o.height = 360));
    const n = o.getContext("2d");
    ((n.fillStyle = "#000"), n.fillRect(0, 0, 720, 360));
    const a = (s, i) => {
      ((n.fillStyle = i), n.beginPath());
      for (let l = 0; l < s.length; l += 2) {
        const c = ((s[l] + 180) / 360) * 720,
          f = ((90 - s[l + 1]) / 180) * 360;
        l ? n.lineTo(c, f) : n.moveTo(c, f);
      }
      (n.closePath(), n.fill());
    };
    return (
      ai.forEach((s) => a(s, "#fff")),
      si.forEach((s) => a(s, "#000")),
      n.getImageData(0, 0, 720, 360).data
    );
  })(),
  li = (e, t) => {
    const o = V(Math.floor(((e + 180) / 360) * 720), 0, 719),
      n = V(Math.floor(((90 - t) / 180) * 360), 0, 359);
    return ii[(n * 720 + o) * 4] > 127;
  };
function ci(e = 4) {
  let t = new r.IcosahedronGeometry(1, e);
  t.index && (t = t.toNonIndexed());
  const o = t.attributes.position,
    n = o.count,
    a = new Float32Array(n * 3),
    s = Te(21),
    i = new r.Color();
  for (let l = 0; l < n; l += 3) {
    let c = 0,
      f = 0,
      d = 0;
    for (let b = 0; b < 3; b++)
      ((c += o.getX(l + b)), (f += o.getY(l + b)), (d += o.getZ(l + b)));
    const u = Math.hypot(c, f, d);
    ((c /= u), (f /= u), (d /= u));
    const p = (Math.asin(f) * 180) / Math.PI,
      h = (Math.atan2(-d, c) * 180) / Math.PI,
      m = s(),
      g = li(h, p),
      T = Math.abs(p);
    g
      ? T > 70 || (h < -15 && h > -75 && p > 60)
        ? i.setHSL(0.58, 0.12, 0.86 + m * 0.1)
        : ri.some(([b, E, F, B]) => h >= b && h <= F && p >= E && p <= B)
          ? i.setHSL(0.09 + m * 0.03, 0.42 + m * 0.12, 0.55 + m * 0.1)
          : T > 55
            ? i.setHSL(0.24 + m * 0.05, 0.3 + m * 0.1, 0.36 + m * 0.08)
            : i.setHSL(0.24 + m * 0.08, 0.55 + m * 0.15, 0.32 + m * 0.1)
      : (i.setHSL(
          0.605 + m * 0.02,
          0.72 + m * 0.1,
          0.24 + m * 0.06 - (T > 60 ? 0.03 : 0),
        ),
        T > 74 && i.setHSL(0.58, 0.25, 0.84 + m * 0.08));
    for (let b = 0; b < 3; b++) a.set([i.r, i.g, i.b], (l + b) * 3);
  }
  return (
    t.setAttribute("color", new r.Float32BufferAttribute(a, 3)),
    t.computeVertexNormals(),
    t
  );
}
const de = { E: new r.Vector3(0.25, 4.96, -0.1), S: 1, R: 2.95 },
  bt = new r.Group();
ot.add(bt);
const j = {},
  fi = Z("#ffb060", 5.2),
  vn = U("#b98a4a", { roughness: 0.28, metalness: 1, clearcoat: 0.5 }),
  na = U("#6d7581", { roughness: 0.3, metalness: 0.95 }),
  di = U("#8d96a2", { roughness: 0.24, metalness: 0.9 });
{
  const e = de.E,
    t = de.R,
    o = te(),
    n = qn.top,
    a = to(
      [
        [0, 2.05],
        [0.08, 2.05],
        [0.1, 1.98],
        [0.2, 1.96],
        [0.22, 1.84],
        [0.3, 1.82],
        [0.3, 1.36],
        [0.24, 1.32],
        [0.24, 1.2],
        [0, 1.2],
      ],
      96,
    );
  (o.geo(vn, a, e.x, n, e.z, { rz: Math.PI / 2 }),
    o
      .cyl(qe, e.x, n + 0.05, e.z, 2.25, 2.3, 0.1, { seg: 64 })
      .cyl(
        re("#0c0f14", { roughness: 0.5 }),
        e.x,
        n + 0.2,
        e.z,
        1.2,
        1.2,
        0.1,
        { seg: 64 },
      ));
  const s = (h, m, g, T) => {
      const b = new r.Shape();
      return (
        b.absarc(0, 0, T, h, m, !1),
        b.absarc(0, 0, g, m, h, !0),
        b.closePath(),
        b
      );
    },
    i = t + 0.1,
    l = t + 0.46,
    c = 1.05;
  for (const h of [-1, 1]) {
    const m = h < 0 ? Math.PI : 0,
      g = new r.ExtrudeGeometry(s(m - c, m + c, i, l), {
        depth: 0.5,
        bevelEnabled: !0,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 2,
        curveSegments: 48,
      });
    (g.translate(0, 0, -0.25), o.geo(di, g, e.x, e.y, e.z));
    const T = new r.ExtrudeGeometry(
      s(m - c + 0.03, m + c - 0.03, l + 0.02, l + 0.16),
      {
        depth: 0.3,
        bevelEnabled: !0,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 1,
        curveSegments: 48,
      },
    );
    (T.translate(0, 0, -0.15), o.geo(qe, T, e.x, e.y, e.z));
    for (const B of [-1, 1]) {
      const w = m + B * (c - 0.1),
        S = Math.cos(w),
        C = Math.sin(w),
        R = -C,
        k = S;
      (o.box(
        U("#7a828e", { roughness: 0.26 }),
        e.x + S * (i + 0.2),
        e.y + C * (i + 0.2),
        e.z,
        0.72,
        0.5,
        0.74,
        { r: 0.05, rz: w },
      ),
        o.box(
          U("#6a727e", { roughness: 0.3 }),
          e.x + S * (i - 0.02),
          e.y + C * (i - 0.02),
          e.z,
          0.14,
          0.36,
          0.5,
          { r: 0.03, rz: w },
        ));
      for (const z of [-0.13, 0.13])
        for (const G of [-0.2, 0.2])
          o.cyl(
            Ao,
            e.x + S * (i + 0.47) + R * z,
            e.y + C * (i + 0.47) + k * z,
            e.z + G,
            0.045,
            0.045,
            0.06,
            { seg: 6, dir: [S, C, 0] },
          );
    }
    const b = h < 0 ? Math.PI + c : -c,
      E = e.x + Math.cos(b) * (i + 0.18);
    o.box(
      U("#4c535e", { roughness: 0.34 }),
      E,
      n + 0.36,
      e.z,
      0.84,
      0.72,
      0.92,
      { r: 0.05 },
    ).box(qe, E, n + 0.05, e.z, 1.04, 0.1, 1.1, { r: 0.02 });
    const F = e.x + h * (i + 0.28);
    o.cyl(
      U("#7c8490", { roughness: 0.24 }),
      F + h * 0.14,
      e.y,
      e.z,
      0.46,
      0.46,
      0.4,
      { seg: 40, dir: [1, 0, 0] },
    ).cyl(vn, F + h * 0.38, e.y, e.z, 0.38, 0.42, 0.12, {
      seg: 40,
      dir: [1, 0, 0],
    });
    for (let B = 0; B < 8; B++) {
      const w = (B / 8) * 6.2832;
      o.cyl(
        Ao,
        F + h * 0.45,
        e.y + Math.cos(w) * 0.31,
        e.z + Math.sin(w) * 0.31,
        0.035,
        0.035,
        0.06,
        { seg: 6, dir: [1, 0, 0] },
      );
    }
  }
  o.flush(bt);
  const f = [],
    d = (h, m, g) => {
      for (let b = 0; b < 26; b++) {
        const E = h + m + ((g - m) * b) / 26,
          F = h + m + ((g - m) * (b + 1)) / 26;
        for (const [B, w] of [
          [E, i + 0.05],
          [F, i + 0.05],
          [F, i + 0.17],
          [E, i + 0.05],
          [F, i + 0.17],
          [E, i + 0.17],
        ])
          f.push(Math.cos(B) * w, Math.sin(B) * w, 0.296);
      }
    };
  for (const h of [0, Math.PI])
    (d(h, 0.17, c - 0.24), d(h, -(c - 0.24), -0.17));
  for (const h of [0, Math.PI])
    for (let g = 0; g < 30; g++) {
      const T = h - c + 0.3 + ((2 * c - 0.6) * g) / 30,
        b = h - c + 0.3 + ((2 * c - 0.6) * (g + 1)) / 30;
      for (const [E, F] of [
        [T, l - 0.02],
        [b, l - 0.02],
        [b, l + 0.05],
        [T, l - 0.02],
        [b, l + 0.05],
        [T, l + 0.05],
      ])
        f.push(Math.cos(E) * F, Math.sin(E) * F, 0.296);
    }
  const u = new r.BufferGeometry();
  u.setAttribute("position", new r.Float32BufferAttribute(f, 3));
  const p = new r.Mesh(u, fi);
  (p.position.copy(e), bt.add(p));
  {
    const h = new r.Mesh(
      new r.TorusGeometry(1.9, 0.03, 8, 96),
      Z("#ffb468", 3.6),
    );
    ((h.rotation.x = Math.PI / 2),
      h.position.set(e.x, n + 0.31, e.z),
      bt.add(h));
  }
  (xe(e.x - 3.2, e.y + 1.4, e.z + 0.9, "#ffb468", 3, 0.6),
    xe(e.x + 3.2, e.y + 1.4, e.z + 0.9, "#ffb468", 3, 0.6),
    xe(e.x, n + 0.6, e.z + 1.2, "#ffb468", 2.6, 0.5));
  for (const h of [-1, 1]) {
    const m = new r.Mesh(new r.BoxGeometry(0.9, 0.04, 0.05), Z("#ffae5c", 3.6));
    (m.position.set(e.x + h * 2.45, n + 0.05, e.z + 0.74), bt.add(m));
  }
}
const ui =
  `${vt}uniform float uK;uniform float uBack;varying vec3 vN;varying vec3 vV;varying vec3vL;
 void main(){vec3 n=normalize(vN),v=normalize(vV);float c=abs(dot(n,v)),f=pow(1.-c,9.);
  vec3 col=vec3(.62,.78,1.)*f*1.1+vec3(1.,.9,.74)*pow(1.-c,26.)*2.6;
  // soft window streaks: two tall bands high on the left and a small one low right (in the sphere's own frame)
  float s1=smoothstep(.09,.0,abs(vL.x+.56+.08*vL.y))*smoothstep(.1,.5,vL.y)*smoothstep(.95,.7,vL.y);
  float s2=smoothstep(.05,.0,abs(vL.x+.43+.08*vL.y))*smoothstep(.2,.55,vL.y)*smoothstep(.9,.72,vL.y);
  float s3=smoothstep(.08,.0,abs(vL.x-.62-.1*vL.y))*smoothstep(-.7,-.45,vL.y)*smoothstep(-.1,-.35,vL.y);
  col+=vec3(.85,.9,1.)*(s1*.34+s2*.22+s3*.18)*step(.5,1.-uBack)*smoothstep(.0,.3,vL.z);
  gl_FragColor=vec4(col*uK*ovVis(.25),1.);}`.replace("vec3vL", "vec3 vL");
function vs(e, t) {
  return new r.ShaderMaterial({
    uniforms: {
      ...rt,
      uK: { value: t },
      uBack: { value: e === r.BackSide ? 1 : 0 },
    },
    transparent: !0,
    depthTest: !1,
    depthWrite: !1,
    blending: r.AdditiveBlending,
    side: e,
    vertexShader:
      "varying vec3 vN;varying vec3 vV;varying vec3 vL;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;vL=normalize(position);gl_Position=projectionMatrix*mv;}",
    fragmentShader: ui,
  });
}
const Fo = new r.Mesh(new r.SphereGeometry(de.R, 96, 64), vs(r.FrontSide, 1));
(Fo.position.copy(de.E), (Fo.renderOrder = 1), Ee.add(Fo));
const yn = new r.Mesh(Fo.geometry, vs(r.BackSide, 0.35));
(yn.position.copy(de.E),
  (yn.renderOrder = 0),
  Ee.add(yn),
  (j.glass = [Fo, yn]));
function ys(e, t = 2, o = 3, n = 1.2) {
  let a = ln(e, 0.16, o, t);
  a.index && (a = a.toNonIndexed());
  const s = a.attributes.position,
    i = new Float32Array(s.count * 3),
    l = Te(o * 7),
    c = new r.Color();
  for (let f = 0; f < s.count; f += 3) {
    const d = l();
    c.setHSL(0.035 + d * 0.075, 1, 0.4 + d * 0.2);
    for (let u = 0; u < 3; u++) i.set([c.r * n, c.g * n, c.b * n], (f + u) * 3);
  }
  return (
    a.setAttribute("color", new r.Float32BufferAttribute(i, 3)),
    a.computeVertexNormals(),
    new r.Mesh(a, new r.MeshBasicMaterial({ vertexColors: !0, fog: !1 }))
  );
}
function hi(e, t, o, n, a = {}) {
  const s = new r.Group();
  (s.position.set(t, o, n), e.add(s));
  const i = new r.Group();
  s.add(i);
  const l = new r.Group();
  i.add(l);
  const c = te(),
    f = a.r || 1.42,
    d = U("#5e6672", { roughness: 0.3, metalness: 0.9 }),
    u = to(
      [
        [-0.46, f * 0.72],
        [-0.4, f * 0.92],
        [-0.36, f],
        [0.3, f],
        [0.36, f * 0.95],
        [0.38, f * 0.74],
        [0.3, f * 0.72],
        [-0.3, f * 0.72],
      ],
      8,
    );
  (u.rotateX(Math.PI / 8),
    c.geo(d, u),
    c.geo(
      na,
      to(
        [
          [0.3, f * 0.74],
          [0.42, f * 0.76],
          [0.46, f * 0.7],
          [0.4, f * 0.68],
        ],
        64,
      ),
    ),
    c.geo(
      qe,
      to(
        [
          [-0.6, 0],
          [-0.6, f * 0.5],
          [-0.5, f * 0.66],
          [-0.4, f * 0.72],
          [-0.4, 0],
        ],
        32,
      ),
    ),
    c.flush(l));
  const p = te();
  for (const E of [-1, 1])
    (p
      .cyl(
        U("#747c88", { roughness: 0.26 }),
        0,
        0,
        E * (f + 0.1),
        0.3,
        0.3,
        0.24,
        { seg: 32, dir: [0, 0, 1] },
      )
      .cyl(vn, 0, 0, E * (f + 0.24), 0.2, 0.22, 0.06, {
        seg: 32,
        dir: [0, 0, 1],
      }),
      p.box(d, -0.05, -(f * 0.6), E * (f + 0.2), 0.5, f * 1.2, 0.2, {
        r: 0.03,
      }));
  (p.box(d, -0.05, -f * 1.2, 0, 0.56, 0.2, 2 * f + 0.6, { r: 0.04 }),
    p.flush(i));
  const h = ys(f * 0.7, 2, a.seed || 3);
  ((h.position.x = 0.08), l.add(h));
  const m = new r.Mesh(new r.CircleGeometry(f * 0.72, 48), Z("#ff7a1e", 0.9));
  ((m.rotation.y = Math.PI / 2), (m.position.x = 0.02), l.add(m));
  const g = te(),
    T = -f * 1.28,
    b = -o + (a.noPlinth ? 0 : 0.68);
  if (
    (g.box(
      U("#4a515c", { roughness: 0.34 }),
      0,
      (T + b) / 2,
      0,
      0.62,
      T - b,
      0.62,
      { r: 0.04 },
    ),
    a.noPlinth ||
      g
        .box(U("#3b424c", { roughness: 0.36 }), 0, -o + 0.3, 0, 1.9, 0.6, 1.9, {
          r: 0.05,
        })
        .box(qe, 0, -o + 0.64, 0, 1.5, 0.08, 1.5, { r: 0.02 }),
    g.flush(s),
    !a.noPlinth)
  ) {
    const E = new r.Mesh(new r.BoxGeometry(1.7, 0.04, 0.04), Z("#ffae5c", 3.2));
    (E.position.set(0, -o + 0.1, 0.97), s.add(E));
  }
  return (
    (i.rotation.y = a.face || 0),
    xe(
      t + Math.cos(a.face || 0) * 0.9,
      o,
      n - Math.sin(a.face || 0) * 0.9,
      "#ffa040",
      5,
      1.6,
    ),
    (s.userData = { head: i, hd: l, sun: h, glow: m, R: f }),
    s
  );
}
const pi = hi(bt, -6.25, de.E.y - 0.55, 0.7, { face: -0.5, r: 1.55 });
j.lamp = pi;
const Do = new r.Group();
(Do.position.set(de.E.x - de.R - 0.9, de.E.y, de.E.z), bt.add(Do));
{
  const e = te();
  (e.sph(na, 0, 0, 0, 0.3, { seg: 24, seg2: 16 }),
    e.geo(
      vn,
      to(
        [
          [-0.28, 0.18],
          [-0.2, 0.24],
          [0.05, 0.24],
          [0.1, 0.2],
          [0.1, 0.14],
          [-0.28, 0.14],
        ],
        32,
      ),
      0,
      0,
      0,
    ),
    e.flush(Do));
  const t = new r.Mesh(
    new r.TorusGeometry(0.17, 0.025, 8, 32),
    Z("#ffb454", 3),
  );
  ((t.rotation.y = Math.PI / 2),
    (t.position.x = -0.29),
    Do.add(t),
    (j.portRing = t));
}
j.port = Do;
const _o = new r.Group();
ot.add(_o);
const io = new r.Mesh(
  ci(11),
  Vt(
    new r.MeshStandardMaterial({
      vertexColors: !0,
      flatShading: !0,
      roughness: 0.5,
      metalness: 0,
      envMapIntensity: 0.7,
      emissive: "#ffffff",
      emissiveIntensity: 0,
    }),
  ),
);
((io.castShadow = !0), (io.receiveShadow = !0), _o.add(io), (j.globe = io));
const xs = xe(0, 0, 0, "#fff4e8", 3.2, 1.3),
  gs = xe(0, 0, 0, "#9fc4ff", 3, 0.6),
  aa = new r.Mesh(
    new r.SphereGeometry(1.045, 64, 48),
    new r.ShaderMaterial({
      uniforms: { ...rt, uK: { value: 1 } },
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: r.AdditiveBlending,
      side: r.FrontSide,
      vertexShader:
        "varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",
      fragmentShader: `${vt}uniform float uK;varying vec3 vN;varying vec3 vV;void main(){float f=1.-abs(dot(normalize(vN),normalize(vV)));float a=pow(f,6.)*.9+pow(f,14.)*1.8;gl_FragColor=vec4(vec3(.3,.62,1.)*a*uK*ovVis(.4),1.);}`,
    }),
  );
((aa.renderOrder = 2), Ee.add(aa), (j.limb = aa));
const x = {
    wind: 0.25,
    windT: 0.25,
    field: 1,
    fieldT: 1,
    fieldOn: !0,
    fieldK: 1,
    energy: $e(5),
    energyT: $e(5),
    aimY: 0,
    aimYT: 0,
    aimP: 0,
    aimPT: 0,
    gustAt: -99,
    gustK: 0,
    stream: !0,
    ex: 0,
    exT: 0,
  },
  sa = [
    { wind: 0.08, energy: $e(0.7) },
    { wind: 0.25, energy: $e(5) },
    { wind: 0.72, energy: $e(12) },
  ],
  mi = ["Quiet", "Active", "Storm"];
let St = 0.016,
  ra = 0.016,
  ee = 0;
const It = (e, t, o, n) => e + (t - e) * (1 - Math.exp(-n * o));
function vi(e) {
  const t = Ct ? 16 : 4;
  ((x.wind = It(x.wind, x.windT, t, e)),
    (x.field = It(x.field, x.fieldT, t, e)),
    (x.energy = It(x.energy, x.energyT, t, e)),
    (x.fieldK = It(x.fieldK, x.fieldOn ? x.field : 0, x.fieldOn ? 2.2 : 3, e)),
    x.fieldK < 0.004 && (x.fieldK = 0),
    (x.aimY = It(x.aimY, x.aimYT, we ? 18 : 5, e)),
    (x.aimP = It(x.aimP, x.aimPT, we ? 18 : 5, e)));
  const o = ee - x.gustAt;
  ((x.gustK = o < 0 || o > 7 ? 0 : zt(0, 0.8, o) * (1 - zt(3.5, 7, o))),
    (x.ex = It(x.ex, x.exT, 2.8, e)));
}
const ue = {};
function ws() {
  const e = y.u;
  ((ue.v = Zn(e)),
    (ue.n = os(e)),
    (ue.P = ns(e) * 1e9),
    (ue.rmp = y.rmp),
    (ue.oval = (y.oval * 180) / Math.PI),
    (ue.E = y.E),
    (ue.B = Xn * 1e6 * x.fieldK));
  const t = y.stats || { peak: 115, low: 110, green: 0.7, red: 0.1, blue: 0.2 };
  ((ue.low = t.low),
    (ue.peak = t.peak),
    (ue.col = t.red > 0.45 ? "red" : t.green > 0.5 ? "green" : "mixed"),
    (ue.st = t));
}
const Ne = { drawnAt: 0, dials: [], sliders: [] },
  Ms = ["#ffb454", "#6fb8ff", "#b27bff"];
function yi(e, t, o, n, a) {
  const s = o / 2,
    i = n / 2,
    l = o * 0.42;
  ((t.fillStyle = "#070a10"),
    t.beginPath(),
    t.arc(s, i, o * 0.49, 0, 7),
    t.fill());
  const c = [x.wind, x.fieldOn ? x.field / 1.5 : 0, x.energy][e],
    f = Ms[e],
    d = Math.PI * 0.75,
    u = Math.PI * 2.25;
  ((t.lineCap = "round"),
    (t.lineWidth = o * 0.045),
    (t.strokeStyle = "#1c2330"),
    t.beginPath(),
    t.arc(s, i, l, d, u),
    t.stroke(),
    (t.strokeStyle = f),
    (t.shadowColor = f),
    (t.shadowBlur = o * 0.05),
    t.beginPath(),
    t.arc(s, i, l, d, d + (u - d) * V(c, 0, 1) + 0.001),
    t.stroke(),
    (t.shadowBlur = 0),
    t.save(),
    t.translate(s, i));
  const p = o * 0.24;
  if (((t.shadowColor = f), (t.shadowBlur = o * 0.06), e === 0)) {
    const h = 1 + 0.06 * Math.sin(a * 4 * (1 + x.wind));
    ((t.fillStyle = "#ffb14a"),
      t.beginPath(),
      t.arc(0, 0, p * 0.52 * h, 0, 7),
      t.fill(),
      (t.strokeStyle = "#ffc46e"),
      (t.lineWidth = o * 0.03));
    for (let m = 0; m < 8; m++) {
      const g = (m / 8) * 6.2832 + a * 0.2;
      (t.beginPath(),
        t.moveTo(Math.cos(g) * p * 0.72, Math.sin(g) * p * 0.72),
        t.lineTo(
          Math.cos(g) * p * (0.98 + 0.08 * x.wind),
          Math.sin(g) * p * (0.98 + 0.08 * x.wind),
        ),
        t.stroke());
    }
  } else if (e === 1) {
    if (
      ((t.fillStyle = "#2f6fd0"),
      t.beginPath(),
      t.arc(0, 0, p * 0.72, 0, 7),
      t.fill(),
      (t.fillStyle = "#8fd07a"),
      t.beginPath(),
      t.ellipse(-p * 0.2, -p * 0.18, p * 0.2, p * 0.3, 0.4, 0, 7),
      t.fill(),
      t.beginPath(),
      t.ellipse(p * 0.12, p * 0.28, p * 0.14, p * 0.22, -0.2, 0, 7),
      t.fill(),
      x.fieldK > 0.05)
    ) {
      ((t.strokeStyle = `rgba(150,210,255,${Math.min(1, x.fieldK)})`),
        (t.lineWidth = o * 0.018));
      for (const h of [1.25, 1.6])
        for (const m of [-1, 1])
          (t.beginPath(),
            t.ellipse(m * p * h * 0.62, 0, p * h * 0.62, p * h * 0.8, 0, 0, 7),
            t.stroke());
    }
  } else {
    const h = ue.st || { green: 0.7, red: 0.1 };
    for (let m = 0; m < 5; m++) {
      const g = (m - 2) * p * 0.34,
        T = p * (0.9 + 0.35 * Math.sin(a * 1.3 + m * 1.7)),
        b = -T * 0.62,
        E = t.createLinearGradient(0, b, 0, p * 0.6);
      (E.addColorStop(
        0,
        `rgba(${Math.round(150 + 100 * h.red)},${Math.round(80 + 60 * h.green)},255,.95)`,
      ),
        E.addColorStop(
          0.55,
          `rgba(${Math.round(90 + 160 * h.red)},${Math.round(120 + 135 * h.green)},${Math.round(150 - 60 * h.green)},.95)`,
        ),
        E.addColorStop(1, "rgba(40,255,140,0)"),
        (t.fillStyle = E),
        t.fillRect(g - p * 0.12, b, p * 0.24, p * 0.6 - b));
    }
  }
  t.restore();
}
{
  const e = [-3.62, 0.1, 3.82],
    t = 3.45;
  (e.forEach((o, n) => {
    Dr(o, t, { h: Dt * 0.84, y: Dt * 0.5 });
    const a = _r(o, Dt * 0.63, 0.94, 0.94, (i, l, c, f) => yi(n, i, l, c, f), {
      cw: 256,
      k: 1.7,
    });
    (a.geometry.dispose(),
      (a.geometry = new r.CircleGeometry(0.47, 56)),
      Ne.dials.push(a));
    const s = Br(o - 1.32, o + 1.32, Dt * 0.24, { color: Ms[n], chev: !1 });
    ((s.fill.scale.y = 2.1), (s.k = n), Ne.sliders.push(s));
  }),
    Ur(0.1, 0.085, 1.3));
}
const Ye = {};
{
  const e = (t, o, n, a, s = "#bfeaff") => {
    ((t.fillStyle = s),
      (t.font = "500 22px DM Mono, monospace"),
      t.fillText(o, n, a));
  };
  ((Ye.wind = Hn(
    -4.9,
    9.3,
    3.7,
    2.3,
    (t, o, n, a) => {
      const s = ue,
        i = y.u || 0.25,
        l = -o * 0.05,
        c = n * 0.56,
        f = n * 0.36;
      ((t.strokeStyle = "#ffb454"),
        (t.lineWidth = 5),
        (t.shadowColor = "#ffb454"),
        (t.shadowBlur = 14),
        t.beginPath(),
        t.arc(l, c, f, -1.2, 1.2),
        t.stroke());
      for (let u = 0; u < 9; u++) {
        const p = -1 + (u / 8) * 2;
        (t.beginPath(),
          t.moveTo(l + Math.cos(p) * f * 1.12, c + Math.sin(p) * f * 1.12),
          t.lineTo(l + Math.cos(p) * f * 1.32, c + Math.sin(p) * f * 1.32),
          t.stroke());
      }
      ((t.lineWidth = 2.5), t.setLineDash([3, 11]));
      const d = 7;
      for (let u = 0; u < d; u++) {
        const p = c + (u - (d - 1) / 2) * n * 0.085;
        (t.beginPath(),
          t.moveTo(l + f * 1.45, p),
          t.lineTo(o * 0.95, p + (u - (d - 1) / 2) * 4),
          t.stroke());
      }
      (t.setLineDash([]), (t.fillStyle = "#ffd08a"));
      for (let u = 0; u < d; u++) {
        const p = c + (u - (d - 1) / 2) * n * 0.085,
          h = 0.12 + 0.2 * i;
        for (let m = 0; m < 3; m++) {
          const g = (a * h + m / 3 + u * 0.137) % 1,
            T = l + f * 1.45 + (o * 0.95 - l - f * 1.45) * g;
          (t.beginPath(),
            t.arc(T, p + (u - (d - 1) / 2) * 4 * g, 5, 0, 7),
            t.fill());
        }
      }
      ((t.shadowBlur = 0),
        e(t, "SOLAR WIND", 24, 40, "#ffd9a4"),
        e(
          t,
          (s.v ? Math.round(s.v) : 450) +
            " km/s \xB7 " +
            (s.n ? s.n.toFixed(0) : 5) +
            " /cm\xB3",
          24,
          n - 22,
          "#ffd9a4",
        ));
    },
    me,
    "#ffb454",
  )),
    (Ye.field = Hn(
      7.5,
      6.6,
      3.1,
      2.5,
      (t, o, n) => {
        const a = o / 2,
          s = n * 0.54,
          i = n * 0.1,
          l = y.rmp || 10,
          c = Math.min(1, x.fieldK),
          f = (u) => i * Math.pow(u, 0.62);
        ((t.lineWidth = 3),
          (t.shadowColor = "#8fe4ff"),
          (t.shadowBlur = 10),
          (t.strokeStyle = `rgba(191,234,255,${0.25 + 0.75 * c})`));
        for (const u of [1.7, 2.6, 4, 6.2, l * 0.985].filter((p) => p <= l))
          for (const p of [-1, 1]) {
            t.beginPath();
            const h = Math.acos(Math.sqrt(1 / u));
            for (let m = 0; m <= 40; m++) {
              const g = -h + (2 * h * m) / 40,
                T = f(u * Math.cos(g) ** 2),
                b = a + p * Math.cos(g) * T,
                E = s - Math.sin(g) * T;
              m ? t.lineTo(b, E) : t.moveTo(b, E);
            }
            t.stroke();
          }
        (t.setLineDash([8, 8]),
          (t.strokeStyle = "rgba(255,208,138,.8)"),
          t.beginPath());
        for (let u = 0; u <= 40; u++) {
          const p = -1.4 + (2.8 * u) / 40,
            h = f(oo(l, Math.cos(p))),
            m = a - Math.cos(p) * h,
            g = s - Math.sin(p) * h;
          u ? t.lineTo(m, g) : t.moveTo(m, g);
        }
        (t.stroke(),
          t.setLineDash([]),
          (t.shadowBlur = 0),
          (t.fillStyle = "#3f86e0"),
          t.beginPath(),
          t.arc(a, s, i, 0, 7),
          t.fill(),
          (t.fillStyle = "#8fd07a"),
          t.beginPath(),
          t.ellipse(a - i * 0.2, s - i * 0.1, i * 0.35, i * 0.5, 0.4, 0, 7),
          t.fill());
        const d = y.oval || 1.25;
        ((t.strokeStyle = "#5dffa0"), (t.lineWidth = 5));
        for (const u of [-1, 1])
          for (const p of [-1, 1])
            (t.beginPath(),
              t.arc(
                a,
                s,
                i * 1.25,
                -(p * d) + (u < 0 ? Math.PI : 0) - 0.08,
                -(p * d) + (u < 0 ? Math.PI : 0) + 0.08,
              ),
              t.stroke());
        (e(t, "MAGNETOSPHERE", 22, 36),
          e(
            t,
            "r_mp " +
              (y.rmp || 10).toFixed(1) +
              " R\u2091 \xB7 oval " +
              Math.round((y.oval || 1.25) * 57.3) +
              "\xB0",
            22,
            n - 18,
          ));
      },
      me,
    )),
    (Ye.graph = Hn(
      7.5,
      4.2,
      3.1,
      1.55,
      (t, o, n, a) => {
        const l = o - 22,
          c = n - 34,
          f = 46,
          d = ue.st || { green: 0.7, red: 0.1 };
        for (let u = 0; u < 48; u++) {
          const p = Math.floor(((u / 48 + 0.5) % 1) * oe),
            h = Math.min(1, (Mt[p] + Mt[(p + 1) % oe]) * 0.35 + 0.04),
            m = (c - f) * h * (0.75 + 0.25 * Math.sin(a * 3 + u * 1.7)),
            g = 22 + ((l - 22) * u) / 48,
            T = ((l - 22) / 48) * 0.7,
            b = t.createLinearGradient(0, c, 0, c - m);
          (b.addColorStop(0, "rgba(60,255,150,.95)"),
            b.addColorStop(
              0.55,
              `rgba(${Math.round(90 + 160 * d.red)},${Math.round(210 - 80 * d.red)},170,.95)`,
            ),
            b.addColorStop(1, "rgba(190,110,255,.95)"),
            (t.fillStyle = b),
            t.fillRect(g, c - m, T, m));
        }
        (e(t, "AURORAL OVAL", 22, 34),
          (t.fillStyle = "#8fb7cf"),
          (t.font = "500 18px DM Mono, monospace"),
          ["12", "18", "00", "06"].forEach((u, p) =>
            t.fillText(u, 22 + ((l - 22) * p) / 4, n - 10),
          ));
      },
      me,
    )),
    (Ye.list = [Ye.wind, Ye.field, Ye.graph]),
    (Ye.at = 0));
}
function xi(e) {
  if (!(e - Ye.at < 0.12 || A.cur !== "lab")) {
    Ye.at = e;
    for (const t of Ye.list) {
      const o = t.userData.draw;
      t.userData.redraw((n, a, s) => {
        ((n.fillStyle = "rgba(16,30,58,.55)"),
          n.fillRect(0, 0, a, s),
          o(n, a, s, e));
      });
    }
  }
}
const Bo = {
  lab: {
    E: de.E.clone(),
    S: 1,
    src: new r.Vector3(-5.88, de.E.y - 0.55, 0.9),
    eR: 1,
    foc: new r.Vector3(de.E.x - de.R - 1.2, de.E.y, de.E.z),
    sphere: de.R,
    vw: 1,
    rate: 1.25,
  },
  exploded: null,
  studio: null,
};
function gi() {
  const e = ge.sun.clone().add(new r.Vector3(ge.sunR * 0.9, 0, 0));
  Bo.studio = {
    E: ge.E,
    S: ge.S,
    src: e,
    eR: 0.85,
    foc: e.clone().add(new r.Vector3(0.5, 0, 0)),
    sphere: 0,
    vw: 1.2,
    rate: 1.9,
  };
}
function wi() {
  const e = $.sun.clone().add(new r.Vector3($.sunR * 0.93, 0, 0.25));
  Bo.exploded = {
    E: $.E,
    S: $.S,
    src: e,
    eR: 1.25,
    foc: e.clone().add(new r.Vector3(0.6, 0, 0)),
    sphere: 0,
    vw: 1.5,
    rate: 1.7,
  };
}
const lo = () => Bo[A.cur] || Bo.lab,
  zl = new r.Vector3(),
  bs = new r.Euler(0, 0, 0, "YXZ");
function Mi(e, t) {
  e.copy(t.foc).sub(t.E).multiplyScalar(-1).normalize();
  const o = Math.atan2(-e.z, e.x);
  return (
    bs.set(0, 0, 0),
    e
      .set(1, 0, 0)
      .applyEuler(
        bs.set(x.aimP + Math.asin(V(e.y, -1, 1)), o + x.aimY, 0, "YXZ"),
      ),
    e
  );
}
function ia() {
  const e = lo();
  (y.src.copy(e.src).sub(e.E).divideScalar(e.S),
    y.foc.copy(e.foc).sub(e.E).divideScalar(e.S),
    (y.eR = e.eR / e.S),
    (y.sphere = e.sphere ? e.sphere / e.S : 0),
    (y.vw = e.vw),
    (y.rate = e.rate),
    y.eN.copy(y.foc).sub(y.src).normalize(),
    Mi(y.aim, e),
    _o.position.copy(e.E),
    _o.scale.setScalar(e.S),
    xs.p.set(e.E.x - 0.9 * e.S, e.E.y + 1.1 * e.S, e.E.z + 2.2 * e.S),
    gs.p.set(e.E.x + 1.8 * e.S, e.E.y - 0.6 * e.S, e.E.z + 1.6 * e.S),
    (xs.r = 3.2 * e.S),
    (gs.r = 3 * e.S),
    (io.rotation.y = ee * 0.05),
    j.limb.position.copy(e.E),
    j.limb.scale.setScalar(e.S));
  const t = A.cur === "lab";
  (j.glass.forEach((o) => (o.visible = t)),
    (j.lamp.userData.hd.rotation.z = x.aimP * 0.8),
    (j.lamp.userData.head.rotation.y = -0.5 + x.aimY * 0.8),
    j.port.rotation.set(0, x.aimY, x.aimP, "YXZ"),
    j.portRing.material.color.setRGB(
      3 * (x.stream ? 1 : 0.2),
      1.9 * (x.stream ? 1 : 0.2),
      0.9 * (x.stream ? 1 : 0.2),
    ),
    Ne.sliders[0].set(x.wind),
    Ne.sliders[1].set(x.field / 1.5),
    Ne.sliders[2].set(x.energy),
    ee - Ne.drawnAt > 0.05 &&
      (Ne.dials.forEach((o) => o.userData.redraw(ee)), (Ne.drawnAt = ee)));
}
const lt = new r.Group();
(ot.add(lt), (lt.visible = !1));
const Tt = new r.Group();
(ot.add(Tt), (Tt.visible = !1));
const Ss = {
    room: me,
    bench: xt,
    chamber: bt,
    stage: Lo,
    studioSet: zo,
    exSet: lt,
    stSet: Tt,
  },
  co = {
    lab: {
      bg: "#0a0f1c",
      fog: "#101830",
      fogD: 0.004,
      tone: r.ACESFilmicToneMapping,
      exp: 1,
      env: "show",
      envI: 0.5,
      bloomT: 1.05,
      bloomS: 0.5,
      refl: 0.45,
      hemi: [7901400, 1841690, 0.34],
      sun: [16763024, 0.9],
      sunDir: [0.62, 0.62, 0.48],
      rim: 0.55,
      key2: 0.85,
      satK: 1.28,
      show: {
        room: 1,
        bench: 1,
        chamber: 1,
        stage: 0,
        studioSet: 0,
        exSet: 0,
        stSet: 0,
      },
      ex: 0,
      light: 0,
      veil: "#0b0f1a",
    },
    exploded: {
      bg: "#081230",
      fog: "#0a1432",
      fogD: 0.004,
      tone: r.ACESFilmicToneMapping,
      exp: 1,
      env: "show",
      envI: 0.6,
      bloomT: 1,
      bloomS: 0.55,
      refl: 0.4,
      hemi: [7310032, 1317418, 0.4],
      sun: [16765600, 1.2],
      sunDir: [0.5, 0.7, 0.5],
      rim: 1.2,
      key2: 0.75,
      satK: 1.12,
      show: {
        room: 0,
        bench: 0,
        chamber: 0,
        stage: 1,
        studioSet: 0,
        exSet: 1,
        stSet: 0,
      },
      ex: 1,
      light: 0,
      veil: "#081226",
    },
    studio: {
      bg: "#efe7dc",
      fog: "#efe7dc",
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
        bench: 0,
        chamber: 0,
        stage: 0,
        studioSet: 1,
        exSet: 0,
        stSet: 1,
      },
      ex: 0,
      light: 1,
      veil: "#efe7dc",
    },
  },
  A = { cur: "lab", next: null, at: -99, out: -99, cam: null };
function la() {
  const e = co[A.cur];
  (ae.background.set(e.bg),
    ae.fog.color.set(e.fog),
    (ae.fog.density = e.fogD * M.fog),
    (O.toneMapping = e.tone),
    (O.toneMappingExposure = M.exposure * e.exp),
    (ae.environment = Jo[e.env]),
    (ae.environmentIntensity = M.env * e.envI),
    (st.threshold = M.bloomThreshold * e.bloomT),
    (st.strength = M.bloomStrength * e.bloomS),
    (en.uReflStrength.value = M.reflect * e.refl),
    Zo.color.set(e.hemi[0]),
    Zo.groundColor.set(e.hemi[1]),
    (Zo.intensity = e.hemi[2] * M.fill),
    ce.color.set(e.sun[0]),
    (ce.intensity = e.sun[1] * M.sun),
    ce.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    (_n.intensity = e.rim * M.rim),
    (Bn.intensity = e.key2 * M.fill),
    (_a.value = M.sat * e.satK));
  for (const t in Ss) Ss[t].visible = !!e.show[t];
  (ts.setLight(e.light),
    ct.setLight(e.light),
    Oe.setLight(e.light),
    gt.setLight(e.light),
    Vi(e.light),
    Ei(e.light),
    Fn.classList.toggle("light", !!e.light),
    (_.key = ""));
  for (const t in je) je[t].userData.a = 0;
  Ta.forEach((t) =>
    t.classList.toggle("on", t.dataset.v === (A.next || A.cur)),
  );
}
function fo(e, t = !1, o = null) {
  if (co[e]) {
    if (t) {
      ((A.cur = e),
        (A.next = null),
        la(),
        (x.exT = x.ex = co[e].ex),
        xo(o || ft[e]));
      return;
    }
    if (e === A.cur && !A.next) {
      o && xo(o);
      return;
    }
    ((A.next = e),
      (A.at = ee),
      (A.cam = o),
      (L("#veil").style.background = co[e].veil),
      Ta.forEach((n) => n.classList.toggle("on", n.dataset.v === e)));
  }
}
function bi() {
  const e = L("#veil");
  let t = 0;
  if (A.next) {
    const o = ee - A.at;
    ((t = V(o / 0.2, 0, 1)),
      o >= 0.2 &&
        ((A.cur = A.next),
        (A.next = null),
        la(),
        (x.exT = co[A.cur].ex),
        (x.ex = 0),
        xo(A.cam || ft[A.cur]),
        (A.cam = null),
        (A.out = ee),
        (t = 1),
        ca()));
  } else t = 1 - V((ee - A.out) / 0.4, 0, 1);
  e.style.opacity = t.toFixed(3);
}
function ca() {
  for (let e = 0; e < J; e++) Ot(e);
  (Mt.fill(0), ro.fill(0), q.t.fill(-9), ia());
  for (let e = 0; e < 150; e++) oa(1 / 30);
  q.t.fill(-9);
}
const N = new r.Vector3(),
  be = new r.Vector3(),
  K = new r.Vector3(),
  uo = new r.Vector3(),
  Rt = new r.Color(),
  Vl = [],
  xn = Array.from({ length: 256 }, () => new r.Vector3()),
  ct = new $n(5200),
  Oe = new $n(9e3);
((Oe.mesh.renderOrder = 6), (ct.mesh.renderOrder = 3));
const ho = 48,
  po = 96,
  _ = {
    key: "",
    n: 0,
    pts: new Float32Array(ho * po * 3),
    cnt: new Uint16Array(ho),
    kind: new Uint8Array(ho),
    alpha: new Float32Array(ho),
  };
function Si() {
  const e = lo(),
    t = y.rmp,
    o = y.sphere;
  Go.copy(P.position).sub(e.E);
  const n = Math.atan2(Go.x, -Go.z),
    a = Math.round(n / 0.015) * 0.015,
    s =
      A.cur + "|" + t.toFixed(1) + "|" + y.oval.toFixed(2) + "|" + a.toFixed(3);
  if (s === _.key) return;
  ((_.key = s), (_.n = 0));
  const i = (f, d) => {
      const u = _.n++;
      return ((_.cnt[u] = 0), (_.kind[u] = f), (_.alpha[u] = d), u);
    },
    l = (f, d, u, p) => {
      if (_.cnt[f] >= po) return;
      const h = (f * po + _.cnt[f]++) * 3;
      ((_.pts[h] = e.E.x + d * e.S),
        (_.pts[h + 1] = e.E.y + u * e.S),
        (_.pts[h + 2] = e.E.z + p * e.S));
    },
    c = [1.7, 2.6, 4, 6.2].filter((f) => f < t * 0.88);
  c.push(t * 0.985);
  for (const [f, d] of [
    [0, 1],
    [0.7, 0.13],
    [-0.7, 0.13],
  ])
    for (const u of [0, Math.PI]) {
      const p = a + f + u,
        h = Math.cos(p),
        m = Math.sin(p);
      c.forEach((g, T) => {
        if (_.n >= ho) return;
        const b = T === c.length - 1,
          E = i(b ? 1 : 0, d * (b ? 1 : 0.72 + 0.07 * T) * 1),
          F = Math.acos(Math.sqrt(1 / g)),
          B = Math.min(po - 1, Math.round(34 + g * 5));
        for (let w = 0; w <= B; w++) {
          const S = -F + (2 * F * w) / B,
            C = g * Math.cos(S) ** 2,
            R = Bt(C);
          (o && R > o * 0.985) ||
            l(E, Math.cos(S) * h * R, Math.sin(S) * R, Math.cos(S) * m * R);
        }
      });
    }
  for (const f of [0, Math.PI])
    for (const d of [1, -1])
      for (const u of [0.05, 0.13]) {
        if (_.n >= ho) break;
        const p = Math.cos(f),
          h = Math.sin(f),
          m = y.oval + u,
          g = 1 / Math.cos(m) ** 2,
          T = i(2, 0.5);
        let b = 0,
          E = 0,
          F = 0,
          B = !1;
        for (let w = 0; w <= 40; w++) {
          const S = d * (m - ((m - 0.25) * w) / 40),
            C = g * Math.cos(S) ** 2,
            R = Bt(C),
            k = Math.cos(S) * p * R,
            z = Math.sin(S) * R,
            G = Math.cos(S) * h * R;
          if (C > oo(t, -k / Math.max(R, 1e-6)) * 0.97 || (o && R > o * 0.97))
            break;
          (l(T, k, z, G), (b = k), (E = z), (F = G), (B = !0));
        }
        if (B)
          for (
            let w = 1;
            w <= 7 &&
            ((b += 0.19 * (0.6 + w * 0.1)),
            (E += d * 0.056),
            (F *= 0.97),
            !(o && Math.hypot(b, E, F) > o * 0.985));
            w++
          )
            l(T, b, E, F);
        _.cnt[T] < 3 && _.n--;
      }
}
const Ti = new r.Color(0.24, 0.58, 3.1),
  fa = new r.Color(0.34, 0.76, 3.4),
  Ri = new r.Color(0.2, 0.44, 2.1),
  Go = new r.Vector3();
function gn(e, t, o, n, a, s) {
  const i = o - t;
  for (let l = t; l < o - 1; l++) {
    const c = (e * po + l) * 3;
    (N.set(_.pts[c], _.pts[c + 1], _.pts[c + 2]),
      be.set(_.pts[c + 3], _.pts[c + 4], _.pts[c + 5]));
    const f = (l - t) / (i - 1),
      d = (l + 1 - t) / (i - 1);
    ct.seg(N, be, W(N, n), W(be, n), a, s(f), s(d));
  }
}
function Ci(e) {
  Si();
  const t = Math.min(1, x.fieldK);
  if (t < 0.01) return;
  const o = zt(0, 0.9, t);
  for (let n = 0; n < _.n; n++) {
    const a = _.cnt[n],
      s = _.kind[n],
      i = _.alpha[n] * t;
    if (a < 2 || i < 0.02) continue;
    const l = Math.max(2, Math.round(a * o)),
      c = Rt.copy(s === 1 ? fa : s === 2 ? Ri : Ti).multiplyScalar(
        A.cur === "exploded" ? 0.62 : 1,
      ),
      f =
        (s === 1 ? 5.6 : s === 2 ? 3 : 5) *
        (_.alpha[n] < 0.6 ? 0.7 : 1) *
        (A.cur === "studio" ? 1.35 : 1);
    if (s === 2) gn(n, 0, l, f, c, (d) => i * (1 - d * 0.85));
    else if (l >= a)
      gn(n, 0, a, f, c, (d) => i * (0.6 + 0.4 * Math.sin(d * Math.PI)));
    else {
      const d = Math.max(2, l >> 1);
      (gn(
        n,
        0,
        d,
        f,
        c,
        (u) => i * (0.6 + 0.4 * Math.sin(((u * d) / a) * Math.PI)),
      ),
        gn(
          n,
          a - d,
          a,
          f,
          c,
          (u) =>
            i * (0.6 + 0.4 * Math.sin((1 - d / a + (u * d) / a) * Math.PI)),
        ));
    }
  }
  if (t > 0.5)
    for (let n = 0; n < _.n; n++) {
      if (_.kind[n] === 2 || _.alpha[n] < 0.6) continue;
      const a = _.cnt[n];
      if (!(a < 12))
        for (const s of [0.3, 0.7]) {
          const i = (s + e * 0.03) % 1,
            l = Math.floor(i * (a - 2)),
            c = (n * po + l) * 3;
          (K.set(_.pts[c], _.pts[c + 1], _.pts[c + 2]),
            N.set(_.pts[c + 3], _.pts[c + 4], _.pts[c + 5])
              .sub(K)
              .normalize());
          const f = W(K, 6);
          (be.copy(K).addScaledVector(N, -f * 1.4),
            uo.crossVectors(N, Go.subVectors(P.position, K)).normalize());
          const d = xn[250].copy(be).addScaledVector(uo, f * 1.1),
            u = xn[251].copy(be).addScaledVector(uo, -f * 1.1);
          (ct.seg(d, K, W(K, 1.3), W(K, 1.3), fa, 0.85 * t, 0.85 * t),
            ct.seg(u, K, W(K, 1.3), W(K, 1.3), fa, 0.85 * t, 0.85 * t));
        }
    }
}
const da = (() => {
    const o = new r.BufferGeometry(),
      n = new Float32Array(1189 * 3),
      a = [];
    for (let s = 0; s < 40; s++)
      for (let i = 0; i < 28; i++) {
        const l = s * 29 + i,
          c = l + 28 + 1;
        a.push(l, c, l + 1, c, c + 1, l + 1);
      }
    return (
      o.setAttribute(
        "position",
        new r.BufferAttribute(n, 3).setUsage(r.DynamicDrawUsage),
      ),
      o.setIndex(a),
      (o.userData = { NU: 40, NV: 28 }),
      o
    );
  })(),
  Wt = new r.Mesh(
    da,
    new r.ShaderMaterial({
      uniforms: {
        ...rt,
        uK: { value: 0 },
        uC: { value: new r.Vector3() },
        uR: { value: 9 },
      },
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: r.AdditiveBlending,
      side: r.DoubleSide,
      vertexShader:
        "varying vec3 vW;void main(){vW=position;gl_Position=projectionMatrix*viewMatrix*vec4(position,1.);}",
      fragmentShader: `${vt}uniform float uK;uniform vec3 uC;uniform float uR;varying vec3 vW;void main(){vec3 n=normalize(cross(dFdx(vW),dFdy(vW)));vec3 v=normalize(cameraPosition-vW);float f=1.-abs(dot(n,v));
  float edge=pow(f,7.)*.8;float r=length(vW-uC);float fade=1.-smoothstep(uR*.9,uR,r);gl_FragColor=vec4(vec3(.45,.75,1.)*edge*uK*fade*ovVis(.3),1.);}`,
    }),
  );
((Wt.frustumCulled = !1), (Wt.renderOrder = 2), Ee.add(Wt));
function Ei(e) {
  const t = Wt.material;
  ((t.blending = e ? r.NormalBlending : r.AdditiveBlending),
    (t.fragmentShader = t.fragmentShader.replace(
      /gl_FragColor=vec4\(.*\);}$/,
      e
        ? "gl_FragColor=vec4(vec3(1.),clamp(edge*uK*fade*ovVis(.3)*1.6,0.,.6));}"
        : "gl_FragColor=vec4(vec3(.45,.75,1.)*edge*uK*fade*ovVis(.3),1.);}",
    )),
    (t.needsUpdate = !0));
}
function Pi() {
  const e = lo(),
    { NU: t, NV: o } = da.userData,
    n = da.attributes.position,
    a = n.array,
    s = Math.min(1, x.fieldK);
  if (((Wt.visible = s > 0.05), !Wt.visible)) return;
  for (let l = 0; l <= t; l++) {
    const c = (l / t) * 1.95,
      f = Bt(oo(y.rmp, Math.cos(c)));
    for (let d = 0; d <= o; d++) {
      const u = (d / o) * Math.PI * 2,
        p = (l * (o + 1) + d) * 3;
      ((a[p] = e.E.x - Math.cos(c) * f * e.S),
        (a[p + 1] = e.E.y + Math.sin(c) * Math.cos(u) * f * e.S),
        (a[p + 2] = e.E.z + Math.sin(c) * Math.sin(u) * f * e.S));
    }
  }
  n.needsUpdate = !0;
  const i = Wt.material.uniforms;
  ((i.uK.value =
    0.4 * s * (A.cur === "studio" ? 1.2 : A.cur === "exploded" ? 0.35 : 1)),
    i.uC.value.copy(e.E),
    (i.uR.value = (y.sphere ? y.sphere * 0.99 : 3.6) * e.S));
}
const ua = new r.Color(2.2, 1.3, 0.4),
  ki = new r.Color(2.1, 1.35, 0.5),
  Ai = new r.Color(2.6, 2.2, 1.3),
  Li = [
    new r.Color(1.1, 2.4, 1.3),
    new r.Color(1.1, 2.4, 1.3),
    new r.Color(2.2, 1.6, 0.9),
  ],
  ve = new r.Vector3(),
  ze = new r.Vector3(),
  ha = new r.Color(1.5, 0.95, 0.32);
function zi(e) {
  const t = lo(),
    o = t.E,
    n = t.S,
    a = y.sphere;
  if (x.stream) {
    const s = (0.16 + 0.1 * y.u) * (A.cur === "studio" ? 2.2 : 1);
    for (let i = 0; i < pn; i++)
      if ((ms(i, ve), ve.multiplyScalar(n).add(o), a))
        (ze.copy(y.foc).multiplyScalar(n).add(o),
          Oe.seg(ve, ze, W(ve, 1.1), W(ze, 0.7), ha, s, s * 0.8),
          mn(i, K).multiplyScalar(0.55 * n),
          ve.copy(ze).add(K),
          Oe.seg(ze, ve, W(ze, 0.7), W(ve, 0.5), ha, s * 0.8, 0));
      else if (
        (mn(i, K),
        ze.copy(ve).addScaledVector(K, 3.2 * n),
        Oe.seg(ve, ze, W(ve, 1.3), W(ze, 0.9), ha, s * 1.3, s * 0.3),
        i % 3 === 0)
      )
        for (let l = 0; l < 2; l++) {
          const c = ((e * 0.35 + l * 0.5 + i * 0.137) % 1) * 0.85,
            f = W(ve, 7);
          (N.copy(ve).addScaledVector(K, c * 3.2 * n),
            be.copy(N).addScaledVector(K, -f * 1.3),
            uo.crossVectors(K, Go.subVectors(P.position, N)).normalize(),
            Rt.setRGB(2.2, 1.4, 0.45));
          const d = Math.sin((c / 0.85) * Math.PI) * 0.9;
          (Oe.seg(
            xn[252].copy(be).addScaledVector(uo, f),
            N,
            W(N, 1.6),
            W(N, 1.6),
            Rt,
            d,
            d,
          ),
            Oe.seg(
              xn[253].copy(be).addScaledVector(uo, -f),
              N,
              W(N, 1.6),
              W(N, 1.6),
              Rt,
              d,
              d,
            ));
        }
  }
  for (let s = 0; s < J; s++) {
    const i = v.s[s];
    if (!i) continue;
    const l = v.tn[s];
    if (l < 1) continue;
    const c = i === so ? (v.acc[s] ? Ai : ki) : ua;
    let f =
      Math.min(1, v.age[s] * 6) *
      (i === Jn
        ? Math.max(0, 1 - v.age[s] * 0.12) *
          (v.ly[s] ? Math.max(0, 1 - (v.age[s] - v.ly[s]) / 0.25) : 1) *
          0.6
        : 1);
    if (
      (i === so &&
        v.src[s] === 2 &&
        (f *= Math.min(1, v.age[s] * 2.5) * (y.sphere ? 0.45 : 1)),
      i === so)
    ) {
      const h = Math.hypot(v.x[s], v.y[s], v.z[s]);
      f *= 1 - zt(y.rmp * 1.05, y.rmp * 1.35, h);
    }
    const d = s * 3;
    if (a) {
      const h = Math.hypot(v.d[d], v.d[d + 1], v.d[d + 2]);
      i !== so && v.leg[s] === 1 && (f *= 1 - zt(a - 0.25, a + 0.1, h));
    }
    if (f < 0.02) continue;
    let u = (v.th[s] + fe - 1) % fe;
    ve.set(
      v.tr[(s * fe + u) * 3],
      v.tr[(s * fe + u) * 3 + 1],
      v.tr[(s * fe + u) * 3 + 2],
    )
      .multiplyScalar(n)
      .add(o);
    const p = K.copy(ve);
    for (let h = 1; h < l; h++) {
      ((u = (u + fe - 1) % fe),
        ze
          .set(
            v.tr[(s * fe + u) * 3],
            v.tr[(s * fe + u) * 3 + 1],
            v.tr[(s * fe + u) * 3 + 2],
          )
          .multiplyScalar(n)
          .add(o));
      const m = f * (1 - (h - 1) / fe) * 0.75,
        g = f * (1 - h / fe) * 0.75;
      (Oe.seg(
        ve,
        ze,
        W(ve, 2 * (1 - (h - 1) / fe) + 0.4),
        W(ze, 2 * (1 - h / fe) + 0.4),
        c,
        m,
        g,
      ),
        ve.copy(ze));
    }
    gt.add(p, i === so ? (v.acc[s] ? 4.2 : 3.7) : 5.2, c, f);
  }
  if (y.splashEMA > 2) {
    const s = Math.min(1, y.splashEMA / 60);
    (K.set(y.sx, y.sy, y.sz)
      .normalize()
      .multiplyScalar(Vo(150))
      .multiplyScalar(n)
      .add(o),
      Rt.setRGB(1.5, 1.2, 0.75),
      gt.add(K, 26 + 34 * s, Rt, 0.45 * s),
      Rt.setRGB(0.7, 1.1, 0.8),
      gt.add(K, 60 + 40 * s, Rt, 0.18 * s));
  }
  for (let s = 0; s < Nt; s++) {
    const i = ee - q.t[s];
    if (i < 0 || i > 0.45) continue;
    K.set(q.x[s * 3], q.x[s * 3 + 1], q.x[s * 3 + 2])
      .multiplyScalar(n)
      .add(o);
    const l = (1 - i / 0.45) ** 2;
    gt.add(K, 5 + i * 14, Li[q.h[s]], l * 0.9);
  }
}
const mo = new r.DataTexture(new Uint8Array(oe * 2 * 4), oe, 2, r.RGBAFormat);
((mo.magFilter = mo.minFilter = r.LinearFilter), (mo.wrapS = r.RepeatWrapping));
const Je = {
  uProf: { value: Ut },
  uRing: { value: mo },
  uColat: { value: 0.33 },
  uT: { value: 0 },
  uE: { value: new r.Vector3() },
  uS: { value: 1 },
  uK: { value: Q.atmA },
  uBright: { value: 1 },
  uLight: { value: 0 },
};
function Kt(e, t, o) {
  const s = [],
    i = [],
    l = [];
  for (let u = 0; u <= 240; u++)
    for (let p = 0; p <= 14; p++) (s.push(0, 0, 0), i.push(u / 240, p / 14));
  for (let u = 0; u < 240; u++)
    for (let p = 0; p < 14; p++) {
      const h = u * 15 + p,
        m = h + 14 + 1;
      l.push(h, m, h + 1, m, m + 1, h + 1);
    }
  const c = new r.BufferGeometry();
  (c.setAttribute("position", new r.Float32BufferAttribute(s, 3)),
    c.setAttribute("aUV", new r.Float32BufferAttribute(i, 2)),
    c.setIndex(l));
  const f = new r.ShaderMaterial({
      uniforms: {
        ...rt,
        ...Je,
        uHem: { value: e },
        uLayer: { value: t },
        uGain: { value: o },
      },
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: r.AdditiveBlending,
      side: r.DoubleSide,
      vertexShader: `attribute vec2 aUV;uniform float uColat,uT,uS,uK,uHem,uLayer;uniform vec3 uE;varying vec2 vUV;varying float vZ;varying float vFace;
   vec3 at(float u,float v){float ph=u*6.2831853;
    float fold=.05*sin(3.*ph+uT*.16+uLayer*40.)+.03*sin(7.*ph-uT*.29+uLayer*23.)+.014*sin(17.*ph+uT*.7)+.006*sin(41.*ph-uT*1.3);
    float ct=uColat+fold+uLayer+v*.05;float rho=1.+uK*pow(v,.7);
    return uE+vec3(sin(ct)*cos(ph),uHem*cos(ct),sin(ct)*sin(ph))*rho*uS;}
   void main(){vUV=aUV;vZ=70.+450.*aUV.y;vec3 p=at(aUV.x,aUV.y),pu=at(aUV.x+.002,aUV.y),pv=at(aUV.x,aUV.y+.05);
    vec3 n=normalize(cross(pu-p,pv-p));vFace=abs(dot(n,normalize(cameraPosition-p)));gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
      fragmentShader: `${vt}uniform sampler2D uProf,uRing;uniform float uT,uHem,uBright,uGain,uLight;varying vec2 vUV;varying float vZ;varying float vFace;
   float h1(float x){return fract(sin(x*127.1)*43758.5453);}
   float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h1(i),h1(i+1.),f);}
   void main(){float x=vUV.x*64.;
    float ray=.5*n1(x+uT*.5)+.32*n1(x*2.4-uT*.9)+.18*n1(x*6.1+uT*1.6);ray=.4+1.2*pow(ray,1.6);
    float lift=ray*38.;vec4 pr=texture2D(uProf,vec2(clamp((vZ-lift-70.)/450.,0.,1.),.5));
    float ring=texture2D(uRing,vec2(vUV.x,uHem>0.?.25:.75)).r;
    float along=.55+.45*n1(vUV.x*23.+uT*.35);
    float edge=.6+.5/(vFace+.5);
    vec3 c=pr.rgb*pow(max(pr.a,.004),-.38)*ray*ring*along*edge*uBright*uGain;
    c=max(mix(vec3(dot(c,vec3(.25,.6,.15))),c,1.45),0.);float top=1.-smoothstep(430.,520.,vZ);
    c*=top*ovVis(.35);
    if(uLight>.5)gl_FragColor=vec4(c/(1.+dot(c,vec3(.2)))*1.25,clamp(dot(c,vec3(.33))*3.2,0.,.95));else gl_FragColor=vec4(c,1.);}`,
    }),
    d = new r.Mesh(c, f);
  return ((d.frustumCulled = !1), (d.renderOrder = 4), Ee.add(d), d);
}
const Ts = [
    Kt(1, 0, 1),
    Kt(1, 0.028, 0.55),
    Kt(1, -0.024, 0.45),
    Kt(-1, 0, 1),
    Kt(-1, 0.026, 0.55),
    Kt(-1, -0.022, 0.45),
  ],
  Fl = [1, -1].map((e) => {
    const t = Kt(e, 0, 0.55);
    return (
      Ee.remove(t),
      (t.material = t.material.clone()),
      (t.material.uniforms = {
        ...t.material.uniforms,
        ...Je,
        uHem: { value: e },
        uLayer: { value: 0 },
        uGain: { value: 1 },
      }),
      (t.material.fragmentShader = t.material.fragmentShader.replace(
        "*ovVis(.35)",
        "*1.2",
      )),
      (t.renderOrder = 3),
      ae.add(t),
      Jt.push(t),
      t
    );
  });
function Vi(e) {
  Ts.forEach((t) => {
    ((t.material.uniforms.uLight.value = e ? 1 : 0),
      (t.material.blending = e ? r.NormalBlending : r.AdditiveBlending),
      (t.material.needsUpdate = !0));
  });
}
const Rs = new Float32Array(oe);
function Fi() {
  const e = mo.image.data,
    t = Math.min(1, x.fieldK);
  for (const [o, n] of [
    [0, Mt],
    [1, ro],
  ]) {
    let a = 0;
    for (let s = 0; s < oe; s++) a += n[s] / oe;
    for (let s = 0; s < oe; s++) {
      let i = 0;
      for (let l = -3; l <= 3; l++)
        i += n[(s + l + oe) % oe] * Math.exp((-l * l) / 5);
      Rs[s] = i * 0.45 + a * (1.6 + 0.9 * Math.cos((s / oe) * 6.2832));
    }
    for (let s = 0; s < oe; s++) {
      const i = (1 - Math.exp(-Rs[s] * 0.5)) * t;
      e[(o * oe + s) * 4] = Math.round(V(i, 0, 1) * 255);
    }
  }
  mo.needsUpdate = !0;
}
const Di = [xe(0, 0, 0, "#5dffa0", 3, 0), xe(0, 0, 0, "#5dffa0", 3, 0)];
function _i(e) {
  const t = lo();
  {
    const o = y.stats || { green: 0.7, red: 0.1 },
      n = Math.min(1, y.landEMA / 60) * Math.min(1, x.fieldK);
    Di.forEach((a, s) => {
      const i = s ? -1 : 1;
      (a.p.set(t.E.x, t.E.y + i * 1.55 * t.S, t.E.z),
        (a.r = 3.2 * t.S),
        a.c.setRGB(0.15 + 0.9 * o.red, 1 - 0.55 * o.red, 0.45 + 0.35 * o.red),
        (a.i = A.cur === "studio" ? 0 : 0.45 * n));
    });
  }
  ((Je.uColat.value = Math.PI / 2 - y.oval),
    (Je.uT.value = e),
    Je.uE.value.copy(t.E),
    (Je.uS.value = t.S),
    (Je.uBright.value =
      (A.cur === "studio" ? 2.8 : 1.45) *
      (0.6 + 0.4 * Math.sqrt(V(y.E / 5, 0.2, 4)))),
    Fi());
}
const $ = {
  E: new r.Vector3(1.6, 3.95, 0),
  S: 1.27,
  sun: new r.Vector3(-7.1, 4.6, -0.4),
  sunR: 2.5,
  top: 0.6,
  inN: new r.Vector3(6.85, 4.85, 0.55),
  inS: new r.Vector3(6.85, 1.95, 0.75),
  inW: 3.5,
  inH: 2.55,
  inD: 1.1,
};
{
  const e = te(),
    t = $.top,
    o = U("#3a414c", { roughness: 0.34 }),
    n = U("#262b33", { roughness: 0.4 });
  e.box(o, -2.6, t / 2, 0, 13.8, t, 2.8, { r: 0.06 })
    .box(o, 6.3, t * 0.42, 0.1, 5.6, t * 0.84, 3.2, { r: 0.06 })
    .box(n, -0.2, t + 0.03, 0, 18, 0.06, 2.2, { r: 0.02 });
  for (const f of [-9.3, 4.3, 9])
    e.box(n, f, t / 2, 1.43, 0.18, t * 0.8, 0.1, { r: 0.02 });
  const a = $.sun,
    s = a.y - $.sunR * 0.72;
  for (const f of [-1, 1]) {
    (e.box(
      an,
      a.x + f * 0.75,
      (t + s) / 2,
      a.z + 0.4,
      0.34,
      s - t + 0.2,
      0.34,
      { r: 0.03, rz: f * 0.2 },
    ),
      e.box(an, a.x + f * 0.75, (t + s) / 2, a.z - 0.9, 0.3, s - t + 0.2, 0.3, {
        r: 0.03,
        rz: f * 0.2,
      }),
      e.box(qe, a.x + f * 1.1, t + 0.2, a.z - 0.25, 0.9, 0.4, 2, { r: 0.03 }));
    for (const d of [0.4, -0.9])
      e.cyl(
        Ao,
        a.x + f * 0.72,
        s - 0.25,
        a.z + d + (d > 0 ? 0.19 : -0.17),
        0.06,
        0.06,
        0.05,
        { seg: 6, dir: [0, 0, 1] },
      );
  }
  (e
    .box(qe, a.x, t + 1.3, a.z - 0.25, 1.9, 0.16, 0.16, { r: 0.02 })
    .box(qe, a.x, t + 1.3, a.z + 0.4, 1.9, 0.12, 0.12, { r: 0.02 }),
    e.cyl(an, a.x, s, a.z - 0.25, 0.95, 1.15, 0.34, { seg: 8 }));
  const i = $.E,
    l = i.y - $.S * 1.62;
  (e
    .box(o, i.x, t + 0.25, i.z, 2.2, 0.5, 1.9, { r: 0.05 })
    .box(n, i.x, t + 0.6, i.z, 1.3, 0.2, 1.2, { r: 0.04 })
    .box(an, i.x, (t + 0.7 + l) / 2, i.z, 0.5, l - t - 0.7, 0.5, { r: 0.04 }),
    e.box(qe, i.x, l - 0.05, i.z, 0.8, 0.14, 0.8, { r: 0.03 }),
    e.flush(lt));
  const c = new r.Mesh(
    new r.CylinderGeometry(0.28, 0.3, 0.05, 24),
    Z("#9fe8ff", 3),
  );
  (c.position.set(i.x, l + 0.05, i.z), lt.add(c));
  {
    const f = Za(1.94);
    (f.position.set($.E.x, t * 0.5, 1.415), lt.add(f));
  }
  for (const [f, d, u] of [
    [-9.3, -1.2, "#ffab55"],
    [4.2, 8.9, "#6fb8ff"],
  ]) {
    const p = new r.Mesh(new r.BoxGeometry(d - f, 0.05, 0.05), Z(u, 4));
    (p.position.set((f + d) / 2, 0.09, 1.44),
      lt.add(p),
      xe((f + d) / 2, 0.4, 2.2, u, 4, 0.6));
  }
}
const Ht = new r.Group();
(Ht.position.copy($.sun), lt.add(Ht));
{
  const e = $.sunR,
    t = new r.IcosahedronGeometry(e, 5),
    o = t.attributes.position,
    n = [],
    a = [],
    s = Te(77),
    i = new r.Color(),
    l = new Map();
  for (let w = 0; w < o.count; w++) {
    const S =
      o.getX(w).toFixed(3) +
      "," +
      o.getY(w).toFixed(3) +
      "," +
      o.getZ(w).toFixed(3);
    l.has(S) || l.set(S, 1 + (s() - 0.5) * 0.07);
    const C = l.get(S);
    o.setXYZ(w, o.getX(w) * C, o.getY(w) * C, o.getZ(w) * C);
  }
  const c = [];
  for (let w = 0; w < o.count; w += 3) {
    let S = 0,
      C = 0;
    for (let R = 0; R < 3; R++) ((S += o.getX(w + R)), (C += o.getZ(w + R)));
    (S > 0 && C > 0 ? a : n).push(w);
  }
  const f = (w) => {
      const S = new Float32Array(w.length * 9),
        C = new Float32Array(w.length * 9);
      w.forEach((k, z) => {
        const G = s();
        i.setHSL(0.045 + G * 0.06, 1, 0.4 + G * 0.16);
        for (let I = 0; I < 3; I++)
          (S.set([o.getX(k + I), o.getY(k + I), o.getZ(k + I)], z * 9 + I * 3),
            C.set([i.r * 0.95, i.g * 0.95, i.b * 0.95], z * 9 + I * 3));
      });
      const R = new r.BufferGeometry();
      return (
        R.setAttribute("position", new r.BufferAttribute(S, 3)),
        R.setAttribute("color", new r.BufferAttribute(C, 3)),
        R.computeVertexNormals(),
        R
      );
    },
    d = new r.MeshBasicMaterial({
      vertexColors: !0,
      fog: !1,
      side: r.DoubleSide,
    }),
    u = new r.Mesh(f(n), d);
  Ht.add(u);
  const p = new r.Mesh(f(a), d);
  (Ht.add(p), (j.sunLid = p));
  const h = eo(512, 512, (w, S, C) => {
      const R = S / 2,
        k = C / 2,
        z = S / 2 - 2;
      ((w.fillStyle = "#000"), w.fillRect(0, 0, S, C));
      const G = w.createRadialGradient(R, k, z * 0.66, R, k, z);
      (G.addColorStop(0, "#c2360c"),
        G.addColorStop(1, "#ff7a1a"),
        (w.fillStyle = G),
        w.beginPath(),
        w.arc(R, k, z * 0.99, -Math.PI / 2, Math.PI / 2),
        w.fill());
      const I = Te(5);
      for (let ne = 0; ne < 260; ne++) {
        const pe = (I() - 0.5) * Math.PI,
          Se = z * (0.7 + I() * 0.28);
        ((w.fillStyle = `hsla(${14 + I() * 20},100%,${40 + I() * 22}%,.8)`),
          w.beginPath(),
          w.moveTo(R + Math.cos(pe) * Se, k + Math.sin(pe) * Se));
        for (let We = 0; We < 3; We++) {
          const De = pe + (I() - 0.5) * 0.14,
            So = Se + (I() - 0.5) * z * 0.08;
          w.lineTo(R + Math.cos(De) * So, k + Math.sin(De) * So);
        }
        w.fill();
      }
      const X = w.createRadialGradient(R, k, z * 0.24, R, k, z * 0.68);
      (X.addColorStop(0, "#ffb347"),
        X.addColorStop(1, "#f06a14"),
        (w.fillStyle = X),
        w.beginPath(),
        w.arc(R, k, z * 0.68, -Math.PI / 2, Math.PI / 2),
        w.fill());
      const H = w.createRadialGradient(R, k, 0, R, k, z * 0.26);
      (H.addColorStop(0, "#fffdf0"),
        H.addColorStop(0.6, "#fff0b0"),
        H.addColorStop(1, "#ffc257"),
        (w.fillStyle = H),
        w.beginPath(),
        w.arc(R, k, z * 0.26, -Math.PI / 2, Math.PI / 2),
        w.fill());
    }),
    m = new r.CircleGeometry(e * 0.985, 48, -Math.PI / 2, Math.PI),
    g = new r.MeshBasicMaterial({
      map: h,
      color: new r.Color(1.05, 1.05, 1.05),
      fog: !1,
      side: r.DoubleSide,
    }),
    T = new r.Mesh(m, g);
  ((T.rotation.y = -Math.PI / 2), Ht.add(T));
  const b = new r.Mesh(m, g);
  (Ht.add(b), (j.sunCut = [T, b]));
  const E = new r.MeshBasicMaterial({
      color: new r.Color(1.9, 0.78, 0.18),
      fog: !1,
    }),
    F = te(),
    B = (w, S) => {
      const C = new r.CatmullRomCurve3(w),
        R = new r.TubeGeometry(C, 18, 1, 6, !1),
        k = R.attributes.position,
        z = C.computeFrenetFrames(18, !1);
      for (let G = 0; G <= 18; G++) {
        const I = C.getPointAt(G / 18),
          X = S * (1 - (0.8 * G) / 18);
        for (let H = 0; H <= 6; H++) {
          const ne = G * 7 + H,
            pe = new r.Vector3(k.getX(ne), k.getY(ne), k.getZ(ne))
              .sub(I)
              .multiplyScalar(X)
              .add(I);
          k.setXYZ(ne, pe.x, pe.y, pe.z);
        }
      }
      return (R.computeVertexNormals(), R);
    };
  for (let w = 0; w < 10; w++) {
    const S = (w / 10) * Math.PI * 2 + 0.3 + (s() - 0.5) * 0.3;
    if (Math.cos(S) > 0.55 && Math.abs(Math.sin(S)) < 0.6) continue;
    const C = 0.45 + s() * 0.8,
      R = 0.18 + s() * 0.22,
      k = s() < 0.5 ? 1 : -1,
      z = [];
    for (let G = 0; G <= 8; G++) {
      const I = G / 8,
        X = S + k * R * I,
        H =
          e * 0.97 +
          Math.sin(Math.min(I * 1.25, 1) * Math.PI * 0.9) * C * (1 - I * 0.35);
      z.push(
        new r.Vector3(
          Math.cos(X) * H,
          Math.sin(X) * H,
          (s() - 0.5) * 0.25 - 0.2,
        ),
      );
    }
    F.geo(E, B(z, 0.26 + s() * 0.12));
  }
  for (let w = 0; w < 12; w++) {
    const S = s() * 6.2832,
      C = e * (1.15 + s() * 0.5),
      R = (s() - 0.5) * e;
    F.geo(
      E,
      ln(0.08 + s() * 0.14, 0.4, w + 3, 0),
      Math.cos(S) * C,
      Math.sin(S) * C,
      R,
    );
  }
  (F.flush(Ht, !1),
    xe($.sun.x + 2.2, $.sun.y, $.sun.z + 1.5, "#ff9a40", 6, 1.6));
}
const vo = [];
function Cs(e, t) {
  const o = new r.Group();
  (o.position.copy(e), lt.add(o));
  const n = $.inW,
    a = $.inH,
    s = $.inD,
    i = te(),
    l = Te(t > 0 ? 5 : 9),
    c = a * 0.2;
  i.box(
    re("#3c4150", { roughness: 0.8 }),
    0,
    -a / 2 + c * 0.35,
    0,
    n,
    c * 0.7,
    s,
    { r: 0.03 },
  );
  const f = 18,
    d = 6,
    u = [],
    p = [],
    h = new r.Color(),
    m = (S, C) =>
      c * 0.72 +
      (He(S * 7.3 + C * 3.1 + t) * 0.14 +
        Math.max(0, Math.sin(S * 0.9 + t) * 0.12)) *
        c;
  for (let S = 0; S < f; S++)
    for (let C = 0; C < d; C++) {
      const R = -n / 2 + (n * S) / f,
        k = -n / 2 + (n * (S + 1)) / f,
        z = -s / 2 + (s * C) / d,
        G = -s / 2 + (s * (C + 1)) / d,
        I = m(S, C),
        X = m(S + 1, C),
        H = m(S, C + 1),
        ne = m(S + 1, C + 1);
      for (const pe of [
        [
          [R, I, z],
          [R, H, G],
          [k, X, z],
        ],
        [
          [k, X, z],
          [R, H, G],
          [k, ne, G],
        ],
      ]) {
        h.setHSL(0.58, 0.25 + l() * 0.2, 0.78 + l() * 0.16);
        for (const Se of pe)
          (u.push(Se[0], Se[1] - a / 2, Se[2]), p.push(h.r, h.g, h.b));
      }
    }
  const g = new r.BufferGeometry();
  (g.setAttribute("position", new r.Float32BufferAttribute(u, 3)),
    g.setAttribute("color", new r.Float32BufferAttribute(p, 3)),
    g.computeVertexNormals());
  const T = new r.Mesh(
    g,
    Vt(
      new r.MeshStandardMaterial({
        vertexColors: !0,
        flatShading: !0,
        roughness: 0.6,
      }),
    ),
  );
  ((T.receiveShadow = !0), o.add(T));
  const b = U("#8a93a0", { roughness: 0.3 });
  for (const [S, C] of [
    [-n / 2, -a / 2],
    [n / 2, -a / 2],
    [-n / 2, a / 2],
    [n / 2, a / 2],
  ])
    for (const R of [-s / 2, s / 2])
      i.box(b, S, 0, R, 0.05, a, 0.05).box(b, 0, C, R, n, 0.05, 0.05);
  for (const [S, C] of [
    [-n / 2, -a / 2],
    [n / 2, -a / 2],
    [-n / 2, a / 2],
    [n / 2, a / 2],
  ])
    i.box(b, S, C, 0, 0.05, 0.05, s);
  i.flush(o);
  const E = Wn(
    0.62,
    a,
    128,
    Math.round((128 * a) / 0.62),
    (S, C, R) => {
      ((S.strokeStyle = "#bfe6ff"),
        (S.fillStyle = "#bfe6ff"),
        (S.lineWidth = 3),
        (S.font = "500 22px DM Mono, monospace"),
        (S.textAlign = "right"));
      for (let k = 1; k <= 4; k++) {
        const z = R * (1 - (0.172 + (0.828 * k) / 5));
        (S.beginPath(),
          S.moveTo(C - 4, z),
          S.lineTo(C - 26, z),
          S.stroke(),
          S.fillText(k * 100 + "", C - 32, z + 8));
      }
      S.fillText("km", C - 32, 22);
    },
    1.1,
  );
  (E.position.set(-n / 2 - 0.34, 0, s / 2), o.add(E));
  const F = new r.Mesh(new r.BoxGeometry(n, 0.018, 0.018), Z("#5dffa0", 3));
  ((F.position.z = s / 2 + 0.01), o.add(F));
  const B = new r.Mesh(
    new r.BoxGeometry(n, a, s),
    new r.ShaderMaterial({
      uniforms: { ...rt },
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: r.AdditiveBlending,
      side: r.DoubleSide,
      vertexShader:
        "varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}",
      fragmentShader: `${vt}varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),3.);gl_FragColor=vec4(vec3(.35,.55,.9)*(.035+f*.3)*ovVis(.3),1.);}`,
    }),
  );
  (B.position.copy(e), Ee.add(B));
  const w = { g: o, hem: t, W: n, H: a, D: s, mark: F, sheen: B, C: e.clone() };
  return (vo.push(w), w);
}
(Cs($.inN, 1), Cs($.inS, -1));
function Bi(e) {
  const n = [],
    a = [],
    s = [];
  for (let f = 0; f <= 90; f++)
    for (let d = 0; d <= 24; d++) (n.push(0, 0, 0), a.push(f / 90, d / 24));
  for (let f = 0; f < 90; f++)
    for (let d = 0; d < 24; d++) {
      const u = f * 25 + d,
        p = u + 24 + 1;
      s.push(u, p, u + 1, p, p + 1, u + 1);
    }
  const i = new r.BufferGeometry();
  (i.setAttribute("position", new r.Float32BufferAttribute(n, 3)),
    i.setAttribute("aUV", new r.Float32BufferAttribute(a, 2)),
    i.setIndex(s));
  const l = new r.ShaderMaterial({
      uniforms: {
        ...rt,
        uProf: { value: Ut },
        uT: Je.uT,
        uBright: { value: 1 },
        uC: { value: e.C.clone() },
        uW: { value: e.W },
        uH: { value: e.H },
        uD: { value: e.D },
        uK: { value: 0 },
        uSeed: { value: e.hem },
        uLight: Je.uLight,
      },
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      blending: r.AdditiveBlending,
      side: r.DoubleSide,
      vertexShader: `attribute vec2 aUV;uniform vec3 uC;uniform float uW,uH,uD,uT,uK,uSeed;varying vec2 vUV;varying float vZ;
   void main(){vUV=aUV;float yg=-uH/2.+.172*uH;float x=(aUV.x-.5)*(uW-.26),z=(.28*sin(aUV.x*8.+uT*.3+uSeed*2.)+.12*sin(aUV.x*21.-uT*.5))*uD*.8;float y=yg+aUV.y*(uH/2.-yg);
    vZ=aUV.y*500.;vec3 p=uC+vec3(x,y,z)*uK;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
      fragmentShader: `${vt}uniform sampler2D uProf;uniform float uT,uBright,uSeed;varying vec2 vUV;varying float vZ;
   float h1(float x){return fract(sin(x*127.1)*43758.5453);}float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h1(i),h1(i+1.),f);}
   void main(){float x=vUV.x*38.+uSeed*9.;float ray=.5*n1(x+uT*.5)+.32*n1(x*2.4-uT*.9)+.18*n1(x*6.1+uT*1.6);ray=.4+1.2*pow(ray,1.6);
    vec4 pr=texture2D(uProf,vec2(clamp((vZ-ray*20.-70.)/450.,0.,1.),.5));vec3 c=pr.rgb*pow(max(pr.a,.004),-.38)*ray*uBright;
    c=max(mix(vec3(dot(c,vec3(.25,.6,.15))),c,1.45),0.);c*=smoothstep(0.,.06,vUV.x)*smoothstep(1.,.94,vUV.x)*(1.-smoothstep(470.,500.,vZ));
    gl_FragColor=vec4(c*ovVis(.3),1.);}`,
    }),
    c = new r.Mesh(i, l);
  ((c.frustumCulled = !1), (c.renderOrder = 4), Ee.add(c), (e.cur = c));
}
vo.forEach(Bi);
const Gi = vo.map(() =>
    Array.from({ length: 16 }, (e, t) => ({
      x: (He(t * 3.1) - 0.5) * 0.86,
      z: (He(t * 7.7) - 0.5) * 0.5,
      y: He(t * 1.3),
      v: 0.6 + He(t * 5.3) * 0.4,
    })),
  ),
  Ui = new r.Color(1.3, 1.35, 1.6),
  Ni = new r.Vector3(),
  pa = new r.Vector3();
function Oi(e, t) {
  const o = zt(0, 1, x.ex),
    n = A.cur === "exploded";
  (j.sunLid.position.set(1.2 * o, 0.25 * o, 1.9 * o),
    (j.sunLid.rotation.y = -0.9 * o),
    (j.sunLid.visible = o < 0.98),
    j.sunCut.forEach((i) => (i.visible = o > 0.02)));
  const a = y.stats || { low: 110 },
    s = (i) => {
      const l = vo[0],
        c = -l.H / 2 + 0.172 * l.H;
      return c + V(i / 500, 0, 1) * (l.H / 2 - c);
    };
  vo.forEach((i, l) => {
    const c = zt(0.25, 1, x.ex);
    (i.g.scale.setScalar(Math.max(c, 0.001)),
      K.copy($.E).addScaledVector(In, i.hem * 1.5 * $.S),
      i.g.position.lerpVectors(K, i.C, c),
      (i.g.visible = n && c > 0.01),
      (i.sheen.visible = i.cur.visible = i.g.visible),
      i.sheen.position.copy(i.g.position),
      i.sheen.scale.setScalar(Math.max(c, 0.001)));
    const f = l ? ro : Mt;
    let d = 0;
    for (let u = 0; u < oe; u++) d += f[u];
    ((d = Math.min(1, (d / oe) * 1.6) * Math.min(1, x.fieldK)),
      (i.cur.material.uniforms.uK.value = c),
      i.cur.material.uniforms.uC.value.copy(i.g.position),
      (i.cur.material.uniforms.uBright.value =
        2.4 * (0.35 + 0.65 * d) * (0.6 + 0.4 * Math.sqrt(V(y.E / 5, 0.2, 4)))),
      (i.lvl = d),
      (i.mark.position.y = s(a.low)));
  });
}
const ge = {
  E: new r.Vector3(1.3, 2.75, 0),
  S: 1.02,
  top: 0.9,
  sun: new r.Vector3(-4.05, 2.85, 0),
  sunR: 0.95,
};
{
  const e = te(),
    t = ge.top,
    o = U("#4a525e", { roughness: 0.34 }),
    n = U("#a8793f", { roughness: 0.3, metalness: 1, clearcoat: 0.4 });
  e.box(o, 0, t * 0.55, 0, 11.6, t * 0.5, 2.7, { r: 0.08 })
    .box(o, 0, t * 0.88, -0.05, 11.1, t * 0.24, 2.3, { r: 0.06 })
    .box(qe, -2.2, t + 0.02, 0, 6.2, 0.05, 1.2, { r: 0.02 });
  for (const h of [-5.55, 5.55])
    for (const m of [-1.2, 1.2])
      e.box(n, h, 0.18, m, 0.55, 0.36, 0.5, { r: 0.04 });
  e.box(o, 4.3, t + 0.12, 0, 2.6, 0.24, 2.2, { r: 0.05 });
  const a = ge.sun,
    s = U("#5a626e", { roughness: 0.3 });
  e.box(o, a.x - 0.55, t + 0.35, -0.2, 1.9, 0.7, 2, { r: 0.06 })
    .box(s, a.x - 0.55, (t + 0.7 + a.y) / 2, -1.05, 0.62, a.y - t - 0.7, 0.5, {
      r: 0.06,
    })
    .box(s, a.x - 0.55, a.y + 0.05, -1.05, 0.9, 0.9, 0.56, { r: 0.1 })
    .cyl(
      U("#747c88", { roughness: 0.26 }),
      a.x - 0.55,
      a.y + 0.05,
      -0.75,
      0.34,
      0.34,
      0.2,
      { seg: 32, dir: [0, 0, 1] },
    )
    .cyl(n, a.x - 0.55, a.y + 0.05, -0.62, 0.22, 0.24, 0.06, {
      seg: 32,
      dir: [0, 0, 1],
    });
  const i = ge.E;
  (e
    .cyl(o, i.x, t + 0.2, i.z, 1.05, 1.12, 0.4, { seg: 48 })
    .cyl(qe, i.x, t + 0.44, i.z, 0.8, 0.85, 0.1, { seg: 48 })
    .cyl(
      na,
      i.x,
      (t + 0.5 + i.y - ge.S * 1.5) / 2,
      i.z,
      0.12,
      0.14,
      i.y - ge.S * 1.5 - t - 0.5,
      { seg: 16 },
    ),
    e.flush(Tt));
  const l = new r.Mesh(
    new r.TorusGeometry(0.93, 0.035, 8, 64),
    Z("#ffb050", 3.4),
  );
  ((l.rotation.x = Math.PI / 2), l.position.set(i.x, t + 0.41, i.z), Tt.add(l));
  for (const [h, m] of [
    [-5.2, -1.2],
    [1.6, 5.2],
  ]) {
    const g = new r.Mesh(
      new r.BoxGeometry(m - h, 0.05, 0.05),
      Z("#ffab55", 3.4),
    );
    (g.position.set((h + m) / 2, 0.24, 1.36), Tt.add(g));
  }
  const c = new r.Group();
  (c.position.copy(a),
    (c.rotation.y = -0.5),
    Tt.add(c),
    c.add(ys(ge.sunR, 2, 11, 1.25)));
  const f = te();
  (f.geo(
    U("#5e6672", { roughness: 0.3, metalness: 0.9 }),
    to(
      [
        [-0.35, ge.sunR * 1.04],
        [-0.3, ge.sunR * 1.2],
        [0.1, ge.sunR * 1.2],
        [0.16, ge.sunR * 1.07],
      ],
      10,
    ),
    -0.2,
    0,
    0,
  ),
    f.flush(c));
  const d = new r.MeshBasicMaterial({
      color: new r.Color(1.5, 0.85, 0.25),
      fog: !1,
    }),
    u = te();
  for (let h = 0; h < 18; h++) {
    const m = (h / 18) * 6.2832;
    u.cone(
      d,
      0.15,
      Math.cos(m) * ge.sunR * 1.02,
      Math.sin(m) * ge.sunR * 1.02,
      0.2,
      0.34,
      { seg: 4, dir: [0, Math.cos(m), Math.sin(m)] },
    );
  }
  (u.flush(c, !1), (j.stSun = c));
  const p = te();
  (yt(p, 4.1, t + 0.24, -0.3, 0.95, 2.1, 21),
    yt(p, 4.9, t + 0.24, -0.5, 0.7, 1.5, 25),
    yt(p, 3.5, t + 0.24, -0.6, 0.6, 1.2, 29));
  for (let h = 0; h < 5; h++)
    Kn(
      p,
      3.4 + h * 0.5,
      t + 0.24,
      0.45 + He(h) * 0.35,
      0.62 + He(h + 0.4) * 0.3,
      h + 11,
    );
  p.flush(Tt);
}
const Dl = Lr(zo, 0, 0, 0, 13, 4.2, 0.4);
function Ii(e, t) {
  if (A.cur !== "exploded") return;
  const o = $.E,
    n = $.S;
  vo.forEach((a, s) => {
    if (!a.g.visible) return;
    const i = a.g.scale.x,
      l = Ni.set(o.x + 0.35 * n, o.y + a.hem * 1.85 * n, o.z);
    for (const p of [0.34, -0.1]) {
      pa.set(
        a.g.position.x - (a.W / 2) * i,
        a.g.position.y + (a.hem > 0 ? -1 : 1) * a.H * p * i,
        a.g.position.z,
      );
      const h = 22;
      for (let m = 0; m < h; m += 2)
        (N.lerpVectors(l, pa, m / h),
          be.lerpVectors(l, pa, (m + 0.9) / h),
          ct.seg(N, be, W(N, 1.4), W(be, 1.4), Ui, 0.55 * i, 0.55 * i));
    }
    const c = -a.H / 2 + 0.172 * a.H,
      f = a.H / 2,
      d = c + V((y.stats?.low || 110) / 500, 0, 1) * (f - c),
      u = (1.1 + 0.7 * Math.sqrt(y.E / 5)) * (0.4 + 0.6 * a.lvl);
    for (const p of Gi[s]) {
      p.y -= ((t * u * p.v) / (f - d + 0.001)) * 1.4;
      const h = d + (f - d) * Math.max(p.y, 0);
      (N.set((p.x * a.W) / 2, h, (p.z * a.D) / 2)
        .multiplyScalar(i)
        .add(a.g.position),
        be
          .set((p.x * a.W) / 2, h + 0.28, (p.z * a.D) / 2)
          .multiplyScalar(i)
          .add(a.g.position));
      const m = a.lvl * Math.min(1, (1 - p.y) * 6);
      if (
        (Oe.seg(N, be, W(N, 2.2), W(be, 0.6), ua, m, 0),
        gt.add(N, 4.2, ua, m),
        p.y <= 0)
      ) {
        p.y = 1 + He(e * 13.1 + p.x) * 0.3;
        const g = q.n++ % Nt;
        ((q.x[g * 3] = (N.x - o.x) / n),
          (q.x[g * 3 + 1] = (N.y - o.y) / n),
          (q.x[g * 3 + 2] = (N.z - o.z) / n),
          (q.t[g] = ee),
          (q.h[g] = 0));
      }
    }
  });
}
const je = { mp: Yn(), oval: Yn(), wind: Yn() };
function Wi(e) {
  const t = lo(),
    o = Math.min(1, x.fieldK);
  (ct.begin(),
    Oe.begin(),
    gt.begin(),
    Ci(e),
    Pi(),
    zi(e),
    _i(e),
    Oi(e, St),
    Ii(e, St),
    ct.end(),
    Oe.end(),
    gt.end());
  const n = ue;
  (je.mp.userData.set("Magnetopause", n.rmp.toFixed(1) + " R\u2091", "#8fd0ff"),
    (je.mp.userData.want = _t && o > 0.3 ? 1 : 0),
    N.set(-Bt(y.rmp) * 0.97, 0.42, 0)
      .multiplyScalar(t.S)
      .add(t.E),
    jn(je.mp, N, 19),
    je.oval.userData.set(
      "Aurora",
      Math.round(n.oval) + "\xB0 \xB7 " + Math.round(n.low) + " km",
      n.col === "red" ? "#ff6b86" : "#5dffa0",
    ),
    (je.oval.userData.want = _t && o > 0.3 ? 1 : 0));
  const a = Math.PI / 2 - y.oval;
  (N.set(-Math.sin(a) * 0.6, Math.cos(a), Math.sin(a) * 0.75)
    .multiplyScalar(Vo(420) * t.S)
    .add(t.E),
    jn(je.oval, N, 19, -1.2),
    je.wind.userData.set("Solar wind", Math.round(n.v) + " km/s", "#ffb454"),
    (je.wind.userData.want = _t && x.stream ? 1 : 0),
    N.copy(t.src).lerp(t.foc, 0.6),
    (N.y -= t.eR * 1.15),
    jn(je.wind, N, 19));
}
const ft = {
    lab: {
      t: [-0.12, 3.46, 0],
      yaw: 0.022,
      pitch: -0.119,
      dist: 11.65,
      f: [0.25, 4.6, 0.4],
      r: 3.6,
      fit: [15.4, 8.2],
    },
    exploded: {
      t: [0.2, 4.05, 0],
      yaw: 0,
      pitch: 0.07,
      dist: 17.5,
      f: [1.2, 4, 0],
      r: 7.5,
      fit: [19, 9.6],
    },
    studio: {
      t: [0.35, 2.3, 0],
      yaw: -0.36,
      pitch: 0.15,
      dist: 11.6,
      f: [0.4, 2.5, 0],
      r: 6,
      fit: [12.4, 6.6],
    },
  },
  Es = { t: [0.2, 4.35, 0], yaw: 0.02, pitch: 0.06, dist: 16.5 },
  D = { t: new r.Vector3(0, 3, 0), yaw: 0, pitch: 0.2, dist: 15 };
let wn = 4,
  Xe = 1,
  Mn = 1,
  Uo = !1,
  Ie = !1,
  Ct = !1,
  ma = [14.6, 6.4],
  Ps = 15;
const Ve = O.domElement,
  qt = new Map();
let bn = 0,
  yo = null,
  et = null,
  va = null;
const Sn = new r.Raycaster(),
  Tn = new r.Vector2();
function xo(e) {
  const t = Uo && P.aspect < 0.8 && e === ft.lab ? { ...e, ...Es } : e;
  (D.t.set(...t.t),
    (D.yaw = t.yaw),
    (D.pitch = t.pitch),
    (D.dist = t.dist),
    Zt.set(...t.f),
    (wn = t.r),
    t.fit && ((ma = t.fit), (Ps = t.dist)),
    (Xe = 1),
    (Ie = !1),
    Ws());
}
const ks = [],
  Et = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), ks.push(e));
  };
(j.lamp.traverse((e) => {
  e.isMesh && Et(e, "aim");
}),
  j.port.traverse((e) => {
    e.isMesh && Et(e, "aim");
  }),
  Et(io, "globe"));
const _l = [1, -1].map((e) => {
  const t = new r.Mesh(
    new r.CylinderGeometry(0.62, 0.42, 0.5, 24, 1, !0),
    new r.MeshBasicMaterial({ visible: !1, side: r.DoubleSide }),
  );
  return (
    (t.userData.hem = e),
    (t.position.y = e * 1.27),
    e < 0 && (t.rotation.x = Math.PI),
    _o.add(t),
    Et(t, "oval"),
    t
  );
});
(Ne.sliders.forEach((e, t) => {
  (Et(e.hit, "slider", { k: t }),
    e.knob.children.forEach((o) => Et(o, "slider", { k: t })));
}),
  Ne.dials.forEach((e, t) => Et(e, "dial", { k: t })),
  Xa.forEach((e) => Et(e.hit, "link", { L: e })));
function ya(e) {
  const t = Ve.getBoundingClientRect();
  (Tn.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Sn.setFromCamera(Tn, P));
  const o = Sn.intersectObjects(
    ks.filter((n) => n.visible && Ki(n)),
    !1,
  )[0];
  return o
    ? { ...o.object.userData.hk, point: o.point, dist: o.distance }
    : null;
}
const Ki = (e) => {
    let t = e;
    for (; t.parent; t = t.parent) if (!t.visible) return !1;
    return t === ae && t.visible;
  },
  go = (e) => {
    x.windT = V(e, 0, 1);
  },
  xa = (e) => {
    ((x.fieldT = V(e, 0, 1.5)),
      x.fieldT < 0.02
        ? ((x.fieldOn = !1), (x.fieldT = Math.max(x.field, 0.3)))
        : (x.fieldOn = !0),
      he(!0));
  },
  Rn = (e) => {
    ((x.fieldOn = e),
      e && x.fieldT < 0.1 && (x.fieldT = 1),
      mt(
        e
          ? "Field on: the paths bend to the poles"
          : "Field off: the wind hits the day side head-on",
      ),
      he(!0));
  },
  $t = (e) => {
    x.energyT = V(e, 0, 1);
  },
  No = (e, t) => {
    ((x.aimYT = V(e, -0.5, 0.5)), (x.aimPT = V(t, -0.45, 0.45)));
  },
  Oo = () => {
    ((x.gustAt = ee),
      mt("A gust: fast, dense wind squeezes the field"),
      he(!0));
  },
  As = (e) => {
    const t = sa[e];
    (go(t.wind), $t(t.energy), mt("Solar activity: " + mi[e]));
  },
  Io = [$e(0.5), $e(2), $e(5), $e(15)];
function Ls() {
  const e = (Io.findIndex((t) => t > x.energyT + 0.01) + Io.length) % Io.length;
  ($t(Io[e]), mt("Electrons at " + ga(un(Io[e])) + " keV"));
}
const ga = (e) => (e < 1 ? e.toFixed(2) : e < 10 ? e.toFixed(1) : e.toFixed(0));
let we = null,
  wa = -1;
function Hi(e) {
  if (e)
    switch (e.kind) {
      case "globe":
        Rn(!x.fieldOn);
        break;
      case "oval":
        Ls();
        break;
      case "dial":
        e.k === 0 ? Oo() : e.k === 1 ? Rn(!x.fieldOn) : Ls();
        break;
      case "link":
        window.open(nr, "_blank", "noopener");
        break;
    }
}
function Ma(e, t) {
  const o =
      (P.position.distanceTo(D.t) *
        2 *
        Math.tan(r.MathUtils.degToRad(P.fov / 2))) /
      Math.max(Lt.clientHeight, 1),
    n = Math.cos(D.yaw),
    a = Math.sin(D.yaw);
  ((Ie = !0),
    (D.t.x = V(D.t.x - n * e * o, -12, 12)),
    (D.t.z = V(D.t.z + a * e * o, -6, 8)),
    (D.t.y = V(D.t.y + t * o, 0.5, 9)));
}
const zs = {
    aim: () => "Drag to aim the stream",
    globe: () => (x.fieldOn ? "Switch the field off" : "Switch the field on"),
    oval: () => "Next energy",
    slider: (e) =>
      ["Solar wind", "Field strength", "Electron energy"][e.k] + ": drag",
    dial: (e) => ["A gust of wind", "Field on or off", "Next energy"][e.k],
    link: () => "@RYANSAEL on X",
  },
  Yt = L("#tip");
let Wo = null;
function qi(e) {
  const t = ya(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== Wo && (Wo?.over(!1), o?.over(!0), (Wo = o)),
    (Ve.style.cursor = t
      ? t.kind === "slider"
        ? "ew-resize"
        : t.kind === "aim"
          ? "move"
          : "pointer"
      : ""));
  const n = t && zs[t.kind] ? zs[t.kind](t) : "";
  n
    ? ((Yt.textContent = n),
      (Yt.style.left = e.clientX + "px"),
      (Yt.style.top = e.clientY + "px"),
      Yt.classList.add("on"))
    : Yt.classList.remove("on");
}
function Vs(e, t) {
  const o = Ve.getBoundingClientRect();
  (Tn.set(
    ((e.clientX - o.left) / o.width) * 2 - 1,
    -(((e.clientY - o.top) / o.height) * 2 - 1),
  ),
    Sn.setFromCamera(Tn, P));
  const n = Ne.sliders[t].fromRay(Sn);
  n != null && (t === 0 ? go(n) : t === 1 ? xa(n * 1.5) : $t(n));
}
(Ve.addEventListener("contextmenu", (e) => e.preventDefault()),
  Ve.addEventListener("pointerleave", () => {
    (Wo?.over(!1),
      (Wo = null),
      Yt.classList.remove("on"),
      (Ve.style.cursor = ""));
  }),
  Ve.addEventListener("pointerdown", (e) => {
    ie();
    try {
      Ve.setPointerCapture(e.pointerId);
    } catch {}
    (Yt.classList.remove("on"),
      qt.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (yo = null));
    const t = e.button === 0 && !e.shiftKey && qt.size === 1 ? ya(e) : null;
    ((va = t),
      (et =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null),
      t?.kind === "slider" && ((Ct = !0), (wa = t.k), Vs(e, t.k)),
      t?.kind === "aim" &&
        (we = { x: e.clientX, y: e.clientY, yaw: x.aimYT, p: x.aimPT }));
  }),
  Ve.addEventListener("pointermove", (e) => {
    const t = qt.get(e.pointerId);
    if (!t) {
      qi(e);
      return;
    }
    const o = e.clientX - t[0],
      n = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), Ct)) {
      Vs(e, wa);
      return;
    }
    if (we) {
      (No(
        we.yaw + (e.clientX - we.x) * 0.004,
        we.p - (e.clientY - we.y) * 0.004,
      ),
        he(!0));
      return;
    }
    if (
      (et &&
        Math.hypot(e.clientX - et[0], e.clientY - et[1]) > 6 &&
        (et = null),
      !et)
    ) {
      if (((Ie = !0), qt.size === 2)) {
        const [a, s] = [...qt.values()],
          i = Math.hypot(a[0] - s[0], a[1] - s[1]),
          l = [(a[0] + s[0]) / 2, (a[1] + s[1]) / 2];
        (bn && (Xe = V((Xe * bn) / i, 0.3, 2.2)),
          (bn = i),
          yo && Ma(l[0] - yo[0], l[1] - yo[1]),
          (yo = l));
        return;
      }
      t[2]
        ? Ma(o, n)
        : ((D.yaw -= o * 0.004),
          (D.pitch = V(D.pitch + n * 0.003, -0.05, 1.35)));
    }
  }));
const Fs = (e) => {
  (et &&
    qt.size === 1 &&
    performance.now() - et[2] < 450 &&
    !Ct &&
    !(we && Math.hypot(e.clientX - we.x, e.clientY - we.y) > 4) &&
    Hi(va),
    (et = null),
    (va = null),
    (Ct = !1),
    (wa = -1),
    (we = null),
    qt.delete(e.pointerId),
    (bn = 0),
    (yo = null));
};
(Ve.addEventListener("pointerup", Fs),
  Ve.addEventListener("pointercancel", (e) => {
    ((et = null), Fs(e));
  }),
  Ve.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        ie(),
        (Ie = !0),
        (Xe = V(
          Xe * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.3,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const wo = new Set();
(addEventListener("keyup", (e) => wo.delete(e.key.toLowerCase())),
  addEventListener("blur", () => wo.clear()));
const $i = new r.Vector3();
function Yi() {
  if (!wo.size) return;
  const e = (wo.has("shift") ? 2.4 : 1) * St,
    t = (...a) => a.some((s) => wo.has(s));
  let o = 0,
    n = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (n += 1),
    t("s", "arrowdown") && (n -= 1),
    (o || n) &&
      (Ma(o * e * 420, 0),
      D.t.addScaledVector(
        $i.set(-Math.sin(D.yaw), 0, -Math.cos(D.yaw)),
        n * e * 5,
      )),
    t("q") && (D.yaw += e * 1.1),
    t("e") && (D.yaw -= e * 1.1),
    t("=", "+") && (Xe = V(Xe * Math.exp(-e * 1.3), 0.3, 2.2)),
    t("-", "_") && (Xe = V(Xe * Math.exp(e * 1.3), 0.3, 2.2)),
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
    ) && (Ie = !0));
}
let jt = !0,
  Mo = -99,
  Cn = -1,
  ye = null,
  Ko = 0;
const dt = (e) => () => $t($e(e)),
  Bl = (e) => () => go(e),
  Ds = (e) => () => {
    ((x.fieldOn = e), e && (x.fieldT = Math.max(x.fieldT, 1)), he(!0));
  },
  Ho = (e, t) => () => No(e, t),
  Pt = (e) => () => {
    const t = sa[e];
    (go(t.wind), $t(t.energy));
  },
  Ce = de.E,
  ut = Ds(!0),
  ba = [
    {
      view: "lab",
      ...ft.lab,
      dy: 0.003,
      hold: 12,
      wide: 1,
      beats: [
        [0, ut],
        [0, Pt(1)],
        [0, Ho(0, 0)],
        [4.5, dt(0.45)],
        [8.5, dt(12)],
      ],
    },
    {
      view: "lab",
      t: [Ce.x - 0.15, Ce.y + 1.3, Ce.z + 0.2],
      yaw: 0.34,
      pitch: 0.2,
      dist: 6.4,
      dy: -0.012,
      f: [Ce.x, Ce.y + 1.45, Ce.z + 0.3],
      r: 1.8,
      hold: 9,
      beats: [
        [0, ut],
        [0, dt(5)],
        [1.2, dt(0.6)],
        [5, dt(15)],
      ],
    },
    {
      view: "lab",
      t: [Ce.x - 1.2, Ce.y - 0.2, Ce.z],
      yaw: -0.18,
      pitch: 0.1,
      dist: 12,
      dy: 0.004,
      f: [Ce.x - 0.8, Ce.y, Ce.z],
      r: 2.6,
      hold: 9,
      beats: [
        [0, ut],
        [0, dt(5)],
        [1.4, Ds(!1)],
        [5.6, ut],
      ],
    },
    {
      view: "lab",
      t: [-4.2, Ce.y - 0.2, -0.3],
      yaw: -0.78,
      pitch: 0.12,
      dist: 8.6,
      dy: 0.01,
      f: [-3.6, Ce.y, -0.2],
      r: 3,
      hold: 9,
      beats: [
        [0, ut],
        [0, Ho(0, 0)],
        [1, Ho(0.05, 0.3)],
        [4.2, Ho(-0.05, -0.3)],
        [7.4, Ho(0, 0)],
      ],
    },
    {
      view: "exploded",
      ...ft.exploded,
      dy: 0.004,
      hold: 11,
      wide: 1,
      beats: [
        [0, ut],
        [0, Pt(1)],
        [4, Pt(2)],
        [8, Pt(1)],
      ],
    },
    {
      view: "exploded",
      t: [6.85, 3.4, 0.6],
      yaw: -0.3,
      pitch: 0.1,
      dist: 7.6,
      dy: 0.006,
      f: [6.85, 3.4, 0.7],
      r: 2.2,
      hold: 8,
      beats: [
        [0, ut],
        [0, dt(5)],
        [1, dt(0.5)],
        [4.5, dt(14)],
      ],
    },
    {
      view: "studio",
      ...ft.studio,
      dy: -0.006,
      hold: 9,
      wide: 1,
      beats: [
        [0, ut],
        [0, Pt(1)],
        [2.5, () => Oo()],
      ],
    },
    {
      view: "lab",
      t: [0, 1.75, 1.6],
      yaw: 0.02,
      pitch: 0.16,
      dist: 9,
      dy: 0.004,
      f: [0, 1.15, 2.1],
      r: 2.4,
      hold: 8,
      beats: [
        [0, ut],
        [1, Pt(2)],
        [4, Pt(0)],
        [6.5, Pt(1)],
      ],
    },
  ];
function _s(e, t) {
  ((Cn = e), (ye = ba[e]), (Ko = 0));
  const o =
    Uo && P.aspect < 0.8
      ? { ...ye, ...(e === 0 ? Es : {}), dist: ye.dist * (e === 0 ? 1 : 1.35) }
      : ye;
  ((ye._S = o),
    ye.view && ye.view !== (A.next || A.cur)
      ? (fo(ye.view, !1, o), (Mo = t + 0.2))
      : (xo(o), (Mo = t)));
}
function ji(e) {
  (e < Mo - 1 && (Mo = e),
    (!ye || e - Mo > ye.hold) && _s((Cn + 1) % ba.length, e));
  const t = e - Mo;
  if (t < 0) return;
  for (; Ko < ye.beats.length && t >= ye.beats[Ko][0];)
    (ye.beats[Ko][1](), Ko++);
  if (Ie) return;
  const o = ye._S || ye;
  ((D.yaw = o.yaw + t * o.dy),
    (D.dist = o.dist * (1 - t * 0.006)),
    Zt.set(...o.f),
    (wn = o.r));
}
function bo(e) {
  ((jt = e),
    L("#cine").classList.toggle("on", e),
    L("#cine").setAttribute("aria-pressed", e),
    e && ((ye = null), (Cn = -1), (Ie = !1), (Xe = 1)));
}
let qo = null;
const ie = () => {
  ((qo = null), jt && bo(!1));
};
function Sa() {
  (bo(!1), xo(ft[A.cur]));
}
function Xi(e) {
  const t = Ie ? 0 : Math.sin(e / 8) * 0.025,
    o = jt ? ye?.wide : qo ? qo.wide : !0,
    n = D.dist * Xe * (o ? Mn : Dn(1, Mn, 0.5)),
    a = D.yaw + t,
    s = Math.asin(V((0.35 - D.t.y) / Math.max(n, 0.1), -1, 1)),
    i = Math.max(D.pitch, s),
    l = Math.cos(i);
  P.position.set(
    D.t.x + Math.sin(a) * l * n,
    D.t.y + Math.sin(i) * n,
    D.t.z + Math.cos(a) * l * n,
  );
  {
    const u = A.cur === "lab" ? le + 0.9 : A.cur === "studio" ? -12 : -60,
      p = A.cur === "lab" ? Me - 0.6 : 60;
    if (P.position.z < u) {
      const h = (D.t.z - u) / Math.max(D.t.z - P.position.z, 0.001);
      P.position.lerpVectors(D.t, P.position, V(h, 0, 1));
    }
    if (P.position.y > p) {
      const h = (p - D.t.y) / Math.max(P.position.y - D.t.y, 0.001);
      P.position.lerpVectors(D.t, P.position, V(h, 0, 1));
    }
  }
  if ((P.lookAt(D.t), !jt && !Ie)) {
    const u = qo || ft[A.cur];
    (Zt.set(...u.f), (wn = u.r));
  }
  const c = P.position.distanceTo(Ie ? D.t : Zt),
    f = Ie ? Math.min(1, St * 5) : 1,
    d = (Ie ? Math.max(2.2, c * 0.28) : wn) * M.focalBand;
  ((Ge.u.focus.value += (c - Ge.u.focus.value) * f),
    (Ge.u.range.value += (d - Ge.u.range.value) * f),
    Ge.u.cocScale.value.set(M.apertureNear, M.aperture));
}
const Bs = [...document.querySelectorAll("#seg-p button")],
  Ta = [...document.querySelectorAll("#seg-view button")];
(Bs.forEach(
  (e) =>
    (e.onclick = () => {
      (ie(), As(+e.dataset.p));
    }),
),
  Ta.forEach(
    (e) =>
      (e.onclick = () => {
        (ie(), fo(e.dataset.v));
      }),
  ),
  (L("#fld").onclick = () => {
    (ie(), Rn(!x.fieldOn));
  }),
  (L("#gust").onclick = () => {
    (ie(), Oo());
  }));
const $o = {
  wind: { get: () => x.windT, set: go, step: 0.04 },
  field: {
    get: () => (x.fieldOn ? x.fieldT / 1.5 : 0),
    set: (e) => xa(e * 1.5),
    step: 0.04,
  },
  energy: { get: () => x.energyT, set: $t, step: 0.04 },
};
for (const e in $o) {
  const t = L("#sl-" + e);
  let o = !1;
  const n = (a) => {
    const s = t.getBoundingClientRect();
    ($o[e].set((a.clientX - s.left) / s.width), he(!0));
  };
  (t.addEventListener("pointerdown", (a) => {
    (ie(), (o = !0), (Ct = !0), t.setPointerCapture(a.pointerId), n(a));
  }),
    t.addEventListener("pointermove", (a) => {
      o && n(a);
    }),
    t.addEventListener("pointerup", () => {
      ((o = !1), (Ct = !1));
    }),
    t.addEventListener("pointercancel", () => {
      ((o = !1), (Ct = !1));
    }),
    t.addEventListener("keydown", (a) => {
      (a.key === "ArrowLeft" || a.key === "ArrowRight") &&
        (a.preventDefault(),
        a.stopPropagation(),
        ie(),
        $o[e].set($o[e].get() + (a.key === "ArrowLeft" ? -1 : 1) * $o[e].step),
        he(!0));
    }));
}
const Ra = L("#pad-c"),
  Zi = Ra.getContext("2d");
function Qi() {
  const e = Ra.width,
    t = Ra.height,
    o = Zi,
    n = e / 2,
    a = t / 2,
    s = (e * 0.42) / 0.5,
    i = (t * 0.42) / 0.45;
  o.clearRect(0, 0, e, t);
  const l = y.foc.length() || 3.7,
    c = Math.atan(1 / l) * s,
    f = Math.atan(Bt(y.rmp) / l) * s;
  ((o.strokeStyle = "#ffffff14"),
    (o.lineWidth = 2),
    o.beginPath(),
    o.moveTo(n, 6),
    o.lineTo(n, t - 6),
    o.moveTo(6, a),
    o.lineTo(e - 6, a),
    o.stroke(),
    x.fieldK > 0.05 &&
      ((o.strokeStyle = `rgba(143,208,255,${0.5 * Math.min(1, x.fieldK)})`),
      o.setLineDash([6, 6]),
      o.beginPath(),
      o.arc(n, a, f, 0, 7),
      o.stroke(),
      o.setLineDash([])),
    (o.fillStyle = "#2f6fd0"),
    o.beginPath(),
    o.arc(n, a, c, 0, 7),
    o.fill(),
    (o.fillStyle = "#8fd07a"),
    o.beginPath(),
    o.ellipse(n - c * 0.25, a - c * 0.2, c * 0.28, c * 0.4, 0.4, 0, 7),
    o.fill());
  const d = n + x.aimY * s,
    u = a - x.aimP * i;
  ((o.fillStyle = "#ffb45455"),
    o.beginPath(),
    o.arc(d, u, 0.1 * s, 0, 7),
    o.fill(),
    (o.fillStyle = "#ffc56e"),
    o.beginPath(),
    o.arc(d, u, 7, 0, 7),
    o.fill());
}
{
  const e = L("#pad");
  let t = !1;
  const o = (a) => {
    const s = e.getBoundingClientRect(),
      i = (a.clientX - s.left) / s.width - 0.5,
      l = (a.clientY - s.top) / s.height - 0.5;
    (No((i / 0.42) * 0.5, (-l / 0.42) * 0.45), (we = we || { pad: 1 }), he(!0));
  };
  (e.addEventListener("pointerdown", (a) => {
    (ie(), (t = !0), e.setPointerCapture(a.pointerId), o(a));
  }),
    e.addEventListener("pointermove", (a) => {
      t && o(a);
    }));
  const n = () => {
    ((t = !1), we?.pad && (we = null));
  };
  (e.addEventListener("pointerup", n),
    e.addEventListener("pointercancel", n),
    e.addEventListener("keydown", (a) => {
      const s = {
        ArrowLeft: [-0.05, 0],
        ArrowRight: [0.05, 0],
        ArrowUp: [0, 0.05],
        ArrowDown: [0, -0.05],
      }[a.key];
      s &&
        (a.preventDefault(),
        a.stopPropagation(),
        ie(),
        No(x.aimYT + s[0], x.aimPT + s[1]),
        he(!0));
    }));
}
let Gs = 0;
const Yo = (e) => `<b>${e}</b>`;
function Ji() {
  const e = ue;
  if (!e.v) return "";
  if (x.fieldK < 0.08)
    return `Field off: the wind strikes the day side head-on at ${Yo(Math.round(e.v) + " km/s")}. Nothing steers the electrons to the poles, so <span class="r">no curtains form</span>.`;
  const t =
    e.col === "red"
      ? `oxygen's slow <span class="r">red line (630.0 nm)</span> is all that survives`
      : e.col === "green"
        ? 'oxygen glows <span class="g">green (557.7 nm)</span>'
        : 'oxygen glows <span class="g">green</span> below and <span class="r">red</span> above';
  return `Electrons at ${Yo(ga(e.E) + " keV")} stop ${Yo(Math.round(e.low) + " km")} up, where ${t}. The wind at ${Yo(Math.round(e.v) + " km/s")} holds the magnetopause at ${Yo(e.rmp.toFixed(1) + " R\u2091")}, so the ovals ring the poles at <span class="c">${Math.round(e.oval)}\xB0</span>.`;
}
function he(e) {
  if (!e && ee - Gs < 0.1) return;
  Gs = ee;
  const t = ue;
  if (!t.v) return;
  ((L("#s-a").textContent =
    x.fieldK < 0.08 ? "\u2014" : Math.round(t.oval) + "\xB0"),
    (L("#s-b").innerHTML = Math.round(t.low) + " <small>km</small>"),
    (L("#s-c").innerHTML =
      x.fieldK < 0.08
        ? "\u2014 <small>R\u2091</small>"
        : t.rmp.toFixed(1) + " <small>R\u2091</small>"));
  const o = {
    wind: x.windT,
    field: x.fieldOn ? x.fieldT / 1.5 : 0,
    energy: x.energyT,
  };
  for (const s in o) {
    const i = L("#sl-" + s),
      l = V(o[s], 0, 1) * 100;
    ((i.querySelector(".kn").style.left = l + "%"),
      (i.querySelector(".fl").style.width = l + "%"),
      i.setAttribute("aria-valuenow", Math.round(s === "field" ? l * 1.5 : l)));
  }
  ((L("#v-wind").textContent =
    Math.round(Zn(x.windT + x.gustK * 0.55)) + " km/s"),
    (L("#v-field").textContent = x.fieldOn
      ? Math.round(Xn * 1e6 * x.fieldT) + " \xB5T"
      : "off"),
    (L("#v-energy").textContent = ga(un(x.energyT)) + " keV"));
  const n = sa.findIndex(
    (s) =>
      Math.abs(s.wind - x.windT) < 0.02 &&
      Math.abs(s.energy - x.energyT) < 0.02,
  );
  (Bs.forEach((s, i) => s.classList.toggle("on", i === n)),
    L("#fld").classList.toggle("on", x.fieldOn),
    L("#fld").setAttribute("aria-pressed", x.fieldOn),
    L("#gust").classList.toggle("on", x.gustK > 0.05),
    Qi());
  const a = Ji();
  a !== he.w && ((L("#why").innerHTML = a), (he.w = a));
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
let Ze = 0,
  Us = 0,
  Ca = 0,
  En = 0,
  Pn = 0;
function Fe() {
  (O.setPixelRatio(M.pixelRatio),
    Be.setPixelRatio(M.pixelRatio),
    ko.rt.samples !== M.msaa && ((ko.rt.samples = M.msaa), ko.rt.dispose()),
    (Ka.enabled = !!M.smaa),
    ce.shadow.mapSize.x !== M.shadow &&
      (ce.shadow.mapSize.set(M.shadow, M.shadow),
      ce.shadow.map?.dispose(),
      (ce.shadow.map = null)),
    (st.enabled = !!M.bloom),
    (st.radius = M.bloomRadius),
    (se.enabled = !0),
    se.updateGtaoMaterial({
      radius: M.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: M.ao ? M.aoSamples : 2,
    }),
    (Ge.enabled = !!M.dof),
    (Ge.u.maxCoc.value = M.maxCoc),
    la(),
    Ks());
}
function pt() {
  ((L("#tune-rows").innerHTML = ht
    .map(([e, t, o, n, , a, s], i) => {
      const l = M[e],
        c = ((l - o) / (n - o)) * 100;
      return `<div class="tr${i === Ze ? " sel" : ""}${s ? " sub" : ""}" data-i="${i}"><b>${t}</b><span class="tk"><i style="left:${V(c, 0, 100)}%"></i></span><u>${a(l)}</u></div>`;
    })
    .join("")),
    L("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((Ze = +e.dataset.i), pt());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (Ze = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const n = (a) => {
            const s = t.getBoundingClientRect(),
              [i, , l, c, f] = ht[Ze],
              d = V(
                Math.round(
                  (l + ((a.clientX - s.left) / s.width) * (c - l)) / f,
                ) * f,
                l,
                c,
              );
            d !== M[i] &&
              ((M[i] = +d.toFixed(4)), i !== "auto" && (M.auto = 0), Fe());
            const u = t.querySelector("i");
            ((u.style.left = V(((M[i] - l) / (c - l)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = ht[Ze][5](M[i])),
              (L("#tune-json").value = JSON.stringify(M)));
          };
          (n(o),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && n(a);
            }),
            (t.onpointerup = () => pt()));
        };
      }),
    (L("#tune-json").value = JSON.stringify(M)));
}
function el(e, t) {
  const [o, , n, a, s] = ht[Ze],
    i = V(+(M[o] + e * s * (t ? 5 : 1)).toFixed(4), n, a);
  i !== M[o] && ((M[o] = i), o !== "auto" && (M.auto = 0), Fe(), pt());
}
function Ns(e) {
  const t = L("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && pt());
}
function tl(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (Ze = (Ze + (t === "ArrowUp" ? -1 : 1) + ht.length) % ht.length),
      pt(),
      L("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (el(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , n, a, s] = ht[Ze];
    return a - n === s
      ? ((M[o] = M[o] ? 0 : 1), o !== "auto" && (M.auto = 0), Fe(), pt(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(M, On) : (M[ht[Ze][0]] = On[ht[Ze][0]]),
      (M.auto = 0),
      Fe(),
      pt(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(M, null, 1)), !0)
      : t === "Escape"
        ? (Ns(!1), !0)
        : !1;
}
L("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in On) typeof t[o] == "number" && (M[o] = t[o]);
    ((M.auto = 0), Fe(), pt());
  } catch {
    pt();
  }
});
const kn = L("#ui-hint");
let Os = -9;
function mt(e) {
  ((kn.textContent = e), kn.classList.add("on"), (Os = ee));
}
const Is = ["lab", "exploded", "studio"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Ns());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    L("#info").open
  )
    return;
  if (!L("#tune").hidden && tl(e)) {
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
      wo.add(t));
    return;
  }
  if (t === "1" || t === "2" || t === "3") (ie(), As(+t - 1), he(!0));
  else if (t === "[" || t === "]")
    (ie(), $t(x.energyT + (t === "[" ? -0.05 : 0.05)), he(!0));
  else if (t === "," || t === ".")
    (ie(), go(x.windT + (t === "," ? -0.05 : 0.05)), he(!0));
  else if (t === ";" || t === "'")
    (ie(), xa((x.fieldOn ? x.fieldT : 0) + (t === ";" ? -0.1 : 0.1)), he(!0));
  else if (t === "f") (ie(), Rn(!x.fieldOn));
  else if (t === " ") (e.preventDefault(), ie(), Oo());
  else if (t === "i" || t === "k" || t === "j" || t === "l")
    (ie(),
      No(
        x.aimYT + (t === "l" ? 0.06 : t === "j" ? -0.06 : 0),
        x.aimPT + (t === "i" ? 0.06 : t === "k" ? -0.06 : 0),
      ),
      he(!0));
  else if (t === "v") {
    ie();
    const o = Is[(Is.indexOf(A.next || A.cur) + 1) % 3];
    (fo(o), mt(o[0].toUpperCase() + o.slice(1)));
  } else
    t === "x"
      ? (ie(),
        fo(A.cur === "exploded" ? "lab" : "exploded"),
        mt(A.cur === "exploded" ? "Lab" : "Exploded"))
      : t === "c"
        ? L("#cine").click()
        : t === "r"
          ? Sa()
          : t === "n"
            ? ((_t = !_t), mt(_t ? "Labels on" : "Labels off"))
            : t === "/" &&
              (e.preventDefault(),
              Fn.classList.toggle("ui-off"),
              mt(
                Fn.classList.contains("ui-off")
                  ? "Interface hidden \xB7 / to show"
                  : "Interface shown",
              ));
}),
  (L("#cine").onclick = () => {
    jt ? Sa() : bo(!0);
  }),
  Ve.addEventListener("dblclick", (e) => {
    ya(e) || Sa();
  }),
  (L("#how").onclick = () => L("#info").showModal()),
  (L("#close").onclick = () => L("#info").close()),
  L("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    L("#tune").hidden || (L("#tune-fps").textContent = Math.round(Us) + " fps");
  }, 500),
  (L("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e), mt("Link copied"));
    } catch {}
  }));
function Ws() {
  const e = Lt.clientWidth,
    t = Lt.clientHeight;
  Uo = e < 900;
  const o = M.fov + (Uo ? 8 : 0);
  (P.fov !== o && ((P.fov = o), P.updateProjectionMatrix()),
    P.setViewOffset(e, t, 0, Uo ? t * 0.1 : -t * 0.015, e, t));
  const n = 2 * Math.tan(r.MathUtils.degToRad(P.fov / 2));
  Mn =
    P.aspect < 0.8
      ? V(0.62 / Math.max(P.aspect, 0.4), 1, 1.5)
      : V(Math.max(ma[0] / (n * P.aspect), ma[1] / n) / Ps, 0.85, 2.2);
}
function Ks() {
  const e = Lt.clientWidth,
    t = Lt.clientHeight;
  ((P.aspect = e / t),
    P.updateProjectionMatrix(),
    O.setSize(e, t),
    Be.setSize(e, t));
  const o = O.getDrawingBufferSize(new r.Vector2());
  (Gn.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    rt.uRes.value.copy(o),
    Ws(),
    P.updateProjectionMatrix());
}
addEventListener("resize", Ks);
let Hs = performance.now(),
  Ea = 0,
  Pa = 0,
  qs = 0;
function ka(e) {
  ((ra = V((e - Hs) / 1e3, 0, 1.5)), (St = Math.min(0.1, ra)), (Hs = e));
  const t = e / 1e3;
  if (
    ((ee = t),
    jt && ji(t),
    Yi(),
    vi(St),
    bi(),
    ia(),
    oa(Math.min(St, 0.05)),
    ws(),
    Xi(t),
    P.updateMatrixWorld(),
    (O.shadowMap.needsUpdate = !0),
    Wi(t),
    xi(t),
    he(),
    kn.classList.contains("on") && ee - Os > 1.5 && kn.classList.remove("on"),
    (Ea += ra),
    Pa++,
    e - qs > 1600)
  ) {
    const o = Pa / Math.max(Ea, 0.001);
    ((Ea = 0),
      (Pa = 0),
      (qs = e),
      (Us = o),
      En++,
      En > 2 && (Ca = Math.max(Ca, o)),
      (Pn = En > 3 && o < Ca * 0.74 ? Pn + 1 : 0),
      M._ceil === void 0 &&
        ((M._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (M._good = 0),
        (M._probe = 0)),
      !document.hidden &&
        M.auto &&
        En > 3 &&
        (M._probe && o < 55
          ? ((M._probe = 0),
            (M._good = 0),
            (M._ceil = Math.max(1, +(M.pixelRatio - 0.25).toFixed(2))),
            (M.pixelRatio = M._ceil),
            Fe())
          : ((M._probe = 0),
            (M._good = o >= 58 ? Math.min(9, M._good + 1) : 0),
            M._good >= 3 &&
              M.pixelRatio < M._ceil &&
              ((M._good = 0),
              (M._probe = 1),
              (M.pixelRatio = Math.min(
                M._ceil,
                +(M.pixelRatio + 0.25).toFixed(2),
              )),
              Fe()))),
      !document.hidden &&
        M.auto &&
        Pn >= 2 &&
        o < 50 &&
        ((Pn = 0),
        M.pixelRatio > 1
          ? ((M.pixelRatio = M._ceil =
              Math.max(1, +(M.pixelRatio - 0.25).toFixed(2))),
            Fe())
          : M.reflect
            ? ((M.reflect = 0), Fe())
            : M.msaa > 0
              ? ((M.msaa = 0), Fe())
              : M.ao && ((M.ao = 0), Fe())));
  }
  (dr(), O.info.reset(), Be.render());
}
let $s = !0;
function Ys(e) {
  (requestAnimationFrame(Ys), $s && ka(e));
}
(wi(),
  gi(),
  Fe(),
  fo("lab", !0),
  is(un(x.energy)),
  ls(),
  ca(),
  ws(),
  bo(!0),
  L("#loading").remove(),
  he(!0),
  requestAnimationFrame(Ys),
  (window.__step = (e) => ka(e)),
  (window.__loop = (e) => {
    $s = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = O.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = e),
      (n.height = Math.round((e * o.height) / o.width)),
      n.getContext("2d").drawImage(o, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    ka(o ?? performance.now());
    const n = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + Da + "/_shots/" + e + ".webp",
        { method: "POST", body: n },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (bo(!1), (qo = e), e && xo({ fit: null, ...e }));
    },
    view: (e, t = !0) => {
      (fo(e, t), t && ca());
    },
    cut: (e) => {
      (bo(!0), _s(e, ee));
    },
    wind: (e) => {
      x.windT = x.wind = e;
    },
    field: (e) => {
      ((x.fieldT = x.field = e), (x.fieldOn = e > 0), (x.fieldK = e));
    },
    fieldOn: (e) => {
      x.fieldOn = !!e;
    },
    energy: (e) => {
      x.energyT = x.energy = $e(e);
    },
    aim: (e, t) => {
      ((x.aimYT = x.aimY = e), (x.aimPT = x.aimP = t));
    },
    gust: () => Oo(),
    warm: (e = 150) => {
      for (let t = 0; t < e; t++) (ia(), oa(1 / 30));
    },
    tags: (e) => {
      _t = !!e;
    },
    tune: (e) => (Object.assign(M, e), Fe(), { ...M }),
    ST: x,
    SIM: y,
    LIVE: ue,
    VIEW: A,
    VIEWS: co,
    HERO: ft,
    SHOTS: ba,
    RIG: Bo,
    MODEL: Q,
  }),
  (window.__x = {
    dof: Ge,
    gtao: se,
    bloom: st,
    renderer: O,
    camera: P,
    scene: ae,
    composer: Be,
    cam: D,
    RT: M,
    overlay: Ee,
    rays: ts,
    flines: ct,
    prt: Oe,
    PART: j,
    UI: Ne,
    PP: v,
    CUR_U: Je,
    CURTAINS: Ts,
    ringN: Mt,
    ringS: ro,
  }),
  (window.__dbg = () => ({
    t: +ee.toFixed(2),
    view: A.cur,
    shot: Cn,
    cine: jt,
    live: v.s.reduce((e, t) => e + (t ? 1 : 0), 0),
    steps: y.steps,
    land: +y.landEMA.toFixed(1),
    cap: +y.capEMA.toFixed(1),
    rmp: +y.rmp.toFixed(2),
    oval: +(y.oval * 57.3).toFixed(1),
    E: +y.E.toFixed(2),
    low: Math.round(y.hLow),
    fit: +Mn.toFixed(3),
    focus: +Ge.u.focus.value.toFixed(2),
    range: +Ge.u.range.value.toFixed(2),
    calls: O.info.render.calls,
    tris: O.info.render.triangles,
  })));
