import * as r from "three";
import { EffectComposer as dr } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as Kn,
  FullScreenQuad as fn,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as Xa } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as hr } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as pr } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as mr } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as xr } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as Ua } from "three/addons/utils/BufferGeometryUtils.js";
const T = (e) => document.querySelector(e),
  It = T("#world"),
  dn = T("#app"),
  B = (e, t, o) => (e < t ? t : e > o ? o : e),
  qt = (e, t, o) => e + (t - e) * o,
  Ye = (e, t, o) => {
    const n = B((o - e) / (t - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  hl = (e) => 1 - (1 - e) ** 3,
  pl = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
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
const ml = De(7),
  hn = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  vr = "https://x.com/ryansael",
  qa = "speaker-cone",
  Ao = { ready: !1 },
  Io = 1.3,
  se = new r.Scene();
((se.background = new r.Color("#10151f")),
  (se.fog = new r.FogExp2("#1a2130", 0.0065)));
const D = new r.PerspectiveCamera(30, 1, 0.3, 320);
let N;
try {
  N = new r.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (T("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const gr = 25e5,
  wr = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return B(Math.min(devicePixelRatio, 2, Math.sqrt(gr / (e * t))), 1, 2);
  },
  pn = wr();
(N.setPixelRatio(pn),
  (N.info.autoReset = !1),
  (N.shadowMap.enabled = !0),
  (N.shadowMap.type = r.PCFShadowMap),
  (N.shadowMap.autoUpdate = !1),
  (N.transmissionResolutionScale = 0.6),
  (N.toneMapping = r.ACESFilmicToneMapping),
  It.appendChild(N.domElement));
const mn = new r.HemisphereLight(9414360, 3813414, 0.5);
se.add(mn);
const re = new r.DirectionalLight(16763279, 2.1);
((re.castShadow = !0),
  re.shadow.mapSize.set(2048, 2048),
  Object.assign(re.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (re.shadow.normalBias = 0.03),
  (re.shadow.bias = -4e-4),
  (re.shadow.radius = 2),
  se.add(re, re.target));
const Mr = new r.Vector3(0.62, 0.62, 0.48).normalize();
(re.position.copy(Mr).multiplyScalar(30), re.target.position.set(0, 2, 0));
const Yn = new r.DirectionalLight(9427199, 0.9);
(Yn.position.set(-6, 9, -14), se.add(Yn));
const Qn = new r.DirectionalLight(16773600, 0.55);
(Qn.position.set(-8, 12, 10), se.add(Qn));
const Bt = new r.Group();
se.add(Bt);
const ot = 10,
  jt = {
    pos: {
      value: Array.from({ length: ot }, () => new r.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: ot }, () => new r.Vector3()) },
  },
  br = `uniform vec4 uFakePos[${ot}];uniform vec3 uFakeCol[${ot}];uniform float uSat;`,
  yr = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${ot};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  Tr = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  ja = { value: 1.16 };
function nt(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: jt.pos,
        uFakeCol: jt.col,
        uSat: ja,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + br,
          )
          .replace("#include <lights_fragment_end>", yr)
          .replace("#include <opaque_fragment>", Tr)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => qa + (t ? t.key : "")),
    e
  );
}
const $a = [];
function Qe(e, t, o, n, a, s) {
  const i = { p: new r.Vector3(e, t, o), c: new r.Color(n), r: a, i: s, i0: s };
  return ($a.push(i), i);
}
const xn = new r.Vector3(),
  Me = [],
  $t = new r.Vector3(0, 3, 0);
function Sr(e) {
  Me.length = 0;
  for (const t of $a)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        Me.length < ot)
      )
        (Me.push(t), Me.length === ot && Me.sort((o, n) => o.score - n.score));
      else if (t.score > Me[0].score) {
        Me[0] = t;
        for (let o = 0; o < ot - 1 && Me[o].score > Me[o + 1].score; o++) {
          const n = Me[o];
          ((Me[o] = Me[o + 1]), (Me[o + 1] = n));
        }
      }
    }
}
function Ha(e, t) {
  Sr(t);
  for (let o = 0; o < ot; o++) {
    const n = Me[o];
    if (!n) {
      (jt.col.value[o].set(0, 0, 0), jt.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (xn.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      jt.pos.value[o].set(xn.x, xn.y, xn.z, 1 / (n.r * n.r)),
      jt.col.value[o].set(n.c.r * n.i, n.c.g * n.i, n.c.b * n.i));
  }
}
const vn = {};
{
  const e = new r.PMREMGenerator(N),
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
    o = (n, a, s, i, l, c, u) => {
      const f = new r.Mesh(
        new r.BoxGeometry(a, s, 0.4),
        new r.MeshBasicMaterial({ color: new r.Color(...i) }),
      );
      (f.position.set(l, c, u), f.lookAt(0, 0, 0), n.add(f));
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
    vn.show = e.fromScene(n, 0.03).texture;
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
      (vn.studio = e.fromScene(n, 0.03).texture));
  }
  e.dispose();
}
((se.environment = vn.show), (se.environmentIntensity = 0.7));
const Ka = 0,
  Zn = new r.WebGLRenderTarget(1, 1, {
    type: r.HalfFloatType,
    generateMipmaps: !0,
    minFilter: r.LinearMipmapLinearFilter,
  }),
  gn = {
    tReflect: { value: Zn.texture },
    uReflMatrix: { value: new r.Matrix4() },
    uReflStrength: { value: 0.5 },
  },
  Ya = Object.assign(
    (e) => {
      (Object.assign(e.uniforms, gn),
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
  wn = new r.Vector3(0, 1, 0),
  Bo = new r.Vector3(0, Ka, 0),
  Jn = new r.Vector3(),
  Mn = new r.Vector3(),
  ea = new r.Matrix4(),
  Lo = new r.Plane(),
  at = new r.Vector4(),
  Qa = new r.Vector4(),
  Ht = [];
function kr() {
  if (
    !v.reflect ||
    gn.uReflStrength.value <= 0 ||
    D.position.y <= Ka ||
    !re.shadow.map
  )
    return;
  (Jn.setFromMatrixPosition(D.matrixWorld),
    ea.extractRotation(D.matrixWorld),
    Ae.position.subVectors(Bo, Jn).reflect(wn).negate().add(Bo),
    Mn.set(0, 0, -1).applyMatrix4(ea).add(Jn),
    Mn.subVectors(Bo, Mn).reflect(wn).negate().add(Bo),
    Ae.up.set(0, 1, 0).applyMatrix4(ea).reflect(wn),
    Ae.lookAt(Mn),
    (Ae.far = D.far),
    Ae.updateMatrixWorld(),
    Ae.projectionMatrix.copy(D.projectionMatrix),
    gn.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(Ae.projectionMatrix)
      .multiply(Ae.matrixWorldInverse),
    Lo.setFromNormalAndCoplanarPoint(wn, Bo).applyMatrix4(
      Ae.matrixWorldInverse,
    ),
    at.set(Lo.normal.x, Lo.normal.y, Lo.normal.z, Lo.constant));
  const e = Ae.projectionMatrix.elements;
  (Qa.set(
    (Math.sign(at.x) + e[8]) / e[0],
    (Math.sign(at.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    at.multiplyScalar(2 / at.dot(Qa)),
    (e[2] = at.x),
    (e[6] = at.y),
    (e[10] = at.z + 1),
    (e[14] = at.w));
  const t = Ht.map((n) => n.visible),
    o = N.shadowMap.needsUpdate;
  (Ht.forEach((n) => (n.visible = !1)),
    (N.shadowMap.needsUpdate = !1),
    Ha(Ae, $t),
    N.setRenderTarget(Zn),
    N.clear(),
    N.render(se, Ae),
    N.setRenderTarget(null),
    Ht.forEach((n, a) => (n.visible = t[a])),
    (N.shadowMap.needsUpdate = o));
}
const Pr =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  bn = (e, t) =>
    new r.ShaderMaterial({
      uniforms: t,
      vertexShader: Pr,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class Cr extends Kn {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new r.WebGLRenderTarget(1, 1, {
        type: r.HalfFloatType,
        samples: t,
        depthTexture: new r.DepthTexture(1, 1),
      })),
      (this.quad = new fn(
        bn(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, n) {
    (Ha(D, $t),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(se, D),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const Za = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class Rr extends Kn {
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
        near: { value: D.near },
        far: { value: D.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new r.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new r.Vector2() },
        fullTexel: { value: new r.Vector2() },
      }),
      (this.pre = new fn(
        bn(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Za}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new fn(
        bn(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new fn(
        bn(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${Za}
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
const v = {
    auto: 1,
    pixelRatio: pn,
    msaa: pn >= 1.5 ? 2 : 4,
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
  ta = { ...v },
  Ie = new dr(
    N,
    new r.WebGLRenderTarget(1, 1, { type: r.HalfFloatType, depthBuffer: !1 }),
  );
Ie.setPixelRatio(pn);
const Fo = new Cr(v.msaa);
Ie.addPass(Fo);
const J = new Xa(se, D, 1, 1);
((J.output = Xa.OUTPUT.Off),
  (J.needsSwap = !1),
  J.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  J.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const Dr = J.setSize.bind(J),
  Ar = J.render.bind(J);
J.setSize = (e, t) => Dr(Math.ceil(e / 2), Math.ceil(t / 2));
const Lt = [],
  Ja = [];
((J.render = (e, t, o) => {
  (Lt.forEach((n, a) => {
    ((Ja[a] = n.visible), (n.visible = !1));
  }),
    Ar(e, t, o),
    Lt.forEach((n, a) => (n.visible = Ja[a])),
    (J.blendMaterial.uniforms.intensity.value = v.ao ? v.aoIntensity : 0),
    (J.blendMaterial.uniforms.tDiffuse.value = J.pdRenderTarget.texture),
    J._renderPass(e, J.blendMaterial, o));
}),
  Ie.addPass(J));
const st = new hr(new r.Vector2(256, 256), 0.42, 0.55, 1.05),
  Ir = st.setSize.bind(st);
((st.setSize = (e, t) => Ir(Math.ceil(e / 2), Math.ceil(t / 2))),
  Ie.addPass(st));
const Be = new Rr();
((Be.u.tDepth.value = Fo.rt.depthTexture), Ie.addPass(Be));
const Kt = new r.Scene(),
  yn = {
    tSceneDepth: { value: J.depthTexture },
    uRes: { value: new r.Vector2(1, 1) },
    uNF: { value: new r.Vector2(D.near, D.far) },
  };
class Br extends Kn {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, n) {
    const a = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(n),
      t.render(Kt, D),
      (t.autoClear = a));
  }
}
(Ie.addPass(new Br()), Ie.addPass(new pr()));
const es = new mr();
Ie.addPass(es);
const oa = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  ts = (e, t, o, n = 0.06, a = 2) =>
    new xr(e, t, o, a, Math.min(n, Math.min(e, t, o) / 2.02)),
  rt = new Map();
function _(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    rt.has(o) ||
      rt.set(
        o,
        nt(
          new r.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    rt.get(o)
  );
}
function Tn(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    rt.has(o) ||
      rt.set(
        o,
        nt(
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
    rt.get(o)
  );
}
function E(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    rt.has(o) ||
      rt.set(
        o,
        nt(
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
    rt.get(o)
  );
}
const K = (e, t = 1) =>
    new r.MeshBasicMaterial({
      color: new r.Color(e).multiplyScalar(t),
      fog: !1,
    }),
  xl = (e = {}) =>
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
  Yt = E("#434a55", { roughness: 0.36 }),
  gt = E("#23272e", { roughness: 0.42, metalness: 0.7 }),
  he = E("#15171b", { roughness: 0.46, metalness: 0.55 }),
  Lr = E("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  Go = E("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  Fr = _("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  vl = E("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  gl = E("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  Gr = new r.Matrix4(),
  Sn = new r.Quaternion(),
  os = new r.Euler(0, 0, 0, "YXZ"),
  ns = new r.Vector3(1, 1, 1),
  wl = new r.Color(),
  Ml = new r.Vector3(1, 0, 0),
  as = new r.Vector3(0, 1, 0),
  bl = new r.Vector3(0, 0, 1),
  _r = new r.Vector3(),
  Er = new r.Quaternion();
function F() {
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
          ? (Sn.setFromUnitVectors(
              as,
              _r.set(l.dir[0], l.dir[1], l.dir[2]).normalize(),
            ),
            l.roll && Sn.multiply(Er.setFromAxisAngle(as, l.roll)))
          : (os.set(l.rx || 0, l.ry || 0, l.rz || 0), Sn.setFromEuler(os)),
        n.applyMatrix4(
          Gr.compose(
            { x: a, y: s, z: i },
            Sn,
            l.s ? ns.set(l.s[0], l.s[1], l.s[2]) : ns.set(1, 1, 1),
          ),
        ));
      let c = e.get(o);
      (c || e.set(o, (c = { mat: o, list: [] })), c.list.push(n));
    };
  return {
    box(o, n, a, s, i, l, c, u = {}) {
      return (
        t(o, u.r ? ts(i, l, c, u.r) : new r.BoxGeometry(i, l, c), n, a, s, u),
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
        const l = new r.Mesh(Ua(i), s);
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
const kn = [];
document.fonts?.ready.then(() => kn.forEach((e) => e()));
function Qt(e, t, o, n, a, s = 0.9, i = {}) {
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
      redraw(h) {
        (c.clearRect(0, 0, o, n), h(c, o, n), (u.needsUpdate = !0));
      },
    }),
    a && (f.userData.redraw(a), kn.push(() => f.userData.redraw(a))),
    f
  );
}
const na = (e, t, o, n, a, s) => {
    (e.beginPath(), e.roundRect(t, o, n, a, s));
  },
  ze = (e, t, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), o(a.getContext("2d"), e, t));
    const s = new r.CanvasTexture(a);
    return (n && (s.colorSpace = r.SRGBColorSpace), (s.anisotropy = 8), s);
  },
  zr = ze(
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
  Vr = (e, t, o = zr) =>
    new r.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function U(e, t = 64, o = [0, Math.PI * 2]) {
  const n = new r.LatheGeometry(
    e.map(([a, s]) => new r.Vector2(s, a)),
    t,
    o[0],
    o[1],
  );
  return (n.rotateZ(-Math.PI / 2), n);
}
function it(e, t) {
  return [...e, ...t.slice().reverse(), e[0]];
}
function Zt(e) {
  const t = new r.Shape(e.map(([s, i]) => new r.Vector2(s, i))),
    o = new r.ShapeGeometry(t, 1),
    n = o.clone();
  n.scale(1, -1, 1);
  const a = n.index.array;
  for (let s = 0; s < a.length; s += 3) {
    const i = a[s];
    ((a[s] = a[s + 2]), (a[s + 2] = i));
  }
  return (n.computeVertexNormals(), Ua([o.toNonIndexed(), n.toNonIndexed()]));
}
function Or(e, t, o, n, a = 60, s = 0.07) {
  const i = [],
    l = [],
    c = a * 6,
    u = 0.035,
    f = [
      [e, o],
      [e, n - s],
      [e + u, n],
      [t - u, n],
      [t, n - s],
      [t, o],
    ];
  for (let m = 0; m < f.length; m++)
    for (let x = 0; x <= c; x++) {
      const g = (x / c) * Math.PI * 2,
        M = (x % 6) / 6,
        b = M >= 0.17 && M < 0.67 ? 1 : 0,
        S = m === 2 || m === 3 ? (b ? n : n - s) : f[m][1];
      i.push(f[m][0], -Math.sin(g) * S, Math.cos(g) * S);
    }
  for (let m = 0; m < f.length - 1; m++)
    for (let x = 0; x < c; x++) {
      const g = m * (c + 1) + x,
        M = g + 1,
        b = g + c + 1,
        S = b + 1;
      l.push(g, M, b, M, S, b);
    }
  const h = new r.BufferGeometry();
  (h.setAttribute("position", new r.Float32BufferAttribute(i, 3)),
    h.setIndex(l));
  const p = h.toNonIndexed();
  return (p.computeVertexNormals(), p);
}
function yl(e, t, o, n, a) {
  const s = new r.Shape(),
    i = n * 4;
  for (let u = 0; u <= i; u++) {
    const f = (u / i) * Math.PI * 2,
      h = u % 4,
      p = h === 1 || h === 2 ? t + o : t,
      m = f + ((h === 1 ? 0.18 : h === 2 ? -0.18 : 0) * Math.PI * 2) / n,
      x = Math.cos(m) * p,
      g = Math.sin(m) * p;
    u ? s.lineTo(x, g) : s.moveTo(x, g);
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
function Nr(e, t = 0.3, o = 1, n = 0) {
  const a = new r.IcosahedronGeometry(e, n),
    s = a.attributes.position,
    i = De(o),
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
function Wr(e, t, o, n, a, s = 0, i = {}) {
  const l = new r.Group(),
    c = F(),
    u = De(Math.floor(t * 31 + n * 17 + 99));
  c.cyl(_("#5a3f2c"), 0, 0.5 * a, 0, 0.07 * a, 0.1 * a, 1 * a, { seg: 6 });
  const f = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((h) =>
    new r.Color(h).offsetHSL(s, 0, 0).getStyle(),
  );
  for (let h = 0; h < (i.n || 5); h++)
    c.geo(
      _(f[h % 4], { flatShading: !0, roughness: 0.8 }),
      Nr(0.42 * a * (0.75 + u() * 0.5), 0.3, h + t * 7 + n * 3),
      (u() - 0.5) * 0.6 * a,
      (1.15 + u() * 0.7) * a,
      (u() - 0.5) * 0.6 * a,
    );
  return (c.flush(l), l.position.set(t, o, n), e.add(l), l);
}
const Xr = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
    _(e, { flatShading: !0, roughness: 0.85 }),
  ),
  Ur = _("#4a3527", { roughness: 0.9 });
function ss(e, t, o, n, a, s = 1) {
  const i = De(s * 97 + 13);
  e.cyl(Ur, t, o + 0.15 * a, n, 0.05 * a, 0.07 * a, 0.3 * a, { seg: 5 });
  for (let l = 0; l < 3; l++) {
    const c = (0.42 - l * 0.1) * a * (0.9 + i() * 0.2);
    e.cone(Xr[(l + s) % 3], t, o + (0.22 + l * 0.3) * a, n, c, 0.55 * a, {
      seg: 6 + (s % 2),
      ry: i() * 3,
    });
  }
}
const qr = _("#8d8aa0", { flatShading: !0, roughness: 0.75 }),
  jr = _("#eef1f8", { flatShading: !0, roughness: 0.6 });
function _o(e, t, o, n, a, s, i = 1) {
  const l = new r.ConeGeometry(a, s, 7, 3).translate(0, s / 2, 0),
    c = l.attributes.position,
    u = De(i);
  for (let h = 0; h < c.count; h++) {
    const p = c.getY(h);
    p > 0.01 &&
      p < s - 0.01 &&
      (c.setX(h, c.getX(h) * (1 + (u() - 0.5) * 0.35)),
      c.setZ(h, c.getZ(h) * (1 + (u() - 0.5) * 0.35)),
      c.setY(h, p + (u() - 0.5) * s * 0.08));
  }
  (l.computeVertexNormals(), e.geo(qr, l, t, o, n));
  const f = new r.ConeGeometry(a * 0.36, s * 0.34, 7, 1).translate(
    0,
    s * 0.83 + 0.005,
    0,
  );
  e.geo(jr, f, t, o, n, { ry: i });
}
function Tl(e, t, o, n, a = 1, s = 1) {
  const i = F(),
    l = De(s * 31);
  (i
    .box(
      _("#5b4636", { roughness: 0.9 }),
      t,
      o + 0.09 * a,
      n,
      1.5 * a,
      0.18 * a,
      1 * a,
      { r: 0.02 * a },
    )
    .box(
      _("#5f8a4a", { flatShading: !0 }),
      t,
      o + 0.19 * a,
      n,
      1.46 * a,
      0.04 * a,
      0.96 * a,
    ),
    _o(i, t - 0.25 * a, o + 0.2 * a, n - 0.15 * a, 0.42 * a, 0.9 * a, s),
    _o(i, t + 0.3 * a, o + 0.2 * a, n - 0.2 * a, 0.34 * a, 0.66 * a, s + 3));
  for (let c = 0; c < 5; c++)
    ss(
      i,
      t + (l() - 0.5) * 1.2 * a,
      o + 0.2 * a,
      n + 0.1 * a + l() * 0.3 * a,
      0.5 * a * (0.8 + l() * 0.4),
      s + c,
    );
  i.flush(e);
}
const $r = ze(
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
function Hr(e, t, o, n, a, s, i = 0.5) {
  const l = new r.Mesh(
    new r.PlaneGeometry(a, s),
    new r.MeshBasicMaterial({
      map: $r,
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
    Lt.push(l),
    l
  );
}
const Kr = ze(1024, 512, (e, t, o) => {
    const n = e.createLinearGradient(0, 0, 0, o);
    (n.addColorStop(0, "#6f8fc4"),
      n.addColorStop(0.52, "#d9b9b4"),
      n.addColorStop(0.72, "#f3c49a"),
      n.addColorStop(1, "#8a7a78"),
      (e.fillStyle = n),
      e.fillRect(0, 0, t, o));
    const a = De(9),
      s = (i, l, c, u) => {
        ((e.fillStyle = c), e.beginPath(), e.moveTo(0, o));
        for (let f = 0; f <= t; f += 16) {
          const h = f / t;
          e.lineTo(
            f,
            i -
              l *
                (Math.abs(Math.sin(h * 5.1 + u)) * 0.7 +
                  Math.abs(Math.sin(h * 13.3 + u * 2)) * 0.3),
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
        u = 10 + a() * 26;
      ((e.fillStyle = `hsl(${130 + a() * 20},${25 + a() * 15}%,${22 + a() * 12}%)`),
        e.beginPath(),
        e.moveTo(l, c - u * 2.2),
        e.lineTo(l - u * 0.6, c),
        e.lineTo(l + u * 0.6, c),
        e.fill());
    }
  }),
  ee = new r.Group();
Bt.add(ee);
const ce = -7.6,
  ne = 12,
  Le = 6.9,
  wt = 18,
  Jt = -15,
  Sl = (() => {
    const e = ze(1024, 1024, (n, a, s) => {
      const l = a / 4,
        c = De(3);
      for (let u = 0; u < 4; u++)
        for (let f = 0; f < 4; f++) {
          const h = c();
          ((n.fillStyle = `hsl(${215 + h * 12},${6 + h * 4}%,${46 + h * 6}%)`),
            n.fillRect(u * l, f * l, l, l));
          for (let p = 0; p < 70; p++)
            ((n.fillStyle = `rgba(${c() > 0.5 ? 255 : 70},${c() > 0.5 ? 250 : 60},240,${0.025 + c() * 0.03})`),
              n.beginPath(),
              n.ellipse(
                u * l + c() * l,
                f * l + c() * l,
                4 + c() * 40,
                2 + c() * 12,
                c() * 3,
                0,
                7,
              ),
              n.fill());
        }
      ((n.strokeStyle = "#5e564c"), (n.lineWidth = 3));
      for (let u = 0; u <= 4; u++)
        (n.beginPath(),
          n.moveTo(u * l, 0),
          n.lineTo(u * l, s),
          n.stroke(),
          n.beginPath(),
          n.moveTo(0, u * l),
          n.lineTo(a, u * l),
          n.stroke());
    });
    ((e.wrapS = e.wrapT = r.RepeatWrapping), e.repeat.set(9, 6));
    const t = nt(
        new r.MeshStandardMaterial({
          map: e,
          roughness: 0.2,
          metalness: 0.05,
          envMapIntensity: 0.55,
        }),
        Ya,
      ),
      o = new r.Mesh(new r.PlaneGeometry(72, 48), t);
    return (
      (o.rotation.x = -Math.PI / 2),
      o.position.set(0, 0, 4),
      (o.receiveShadow = !0),
      ee.add(o),
      Ht.push(o),
      o
    );
  })(),
  aa = _("#33405a", { roughness: 0.62, envMapIntensity: 0.6 }),
  Pn = _("#222b3a", { roughness: 0.7 }),
  Eo = E("#3a414c", { roughness: 0.4 }),
  Yr = _("#9a7550", { roughness: 0.62, envMapIntensity: 0.5 }),
  Qr = _("#4a3525", { roughness: 0.6, envMapIntensity: 0.45 }),
  Zr = ze(64, 256, (e, t, o) => {
    const n = e.createLinearGradient(0, 0, 0, o);
    (n.addColorStop(0, "#2a1c10"),
      n.addColorStop(0.25, "#b86f2c"),
      n.addColorStop(0.55, "#ffb25e"),
      n.addColorStop(0.85, "#a8622a"),
      n.addColorStop(1, "#2a1c10"),
      (e.fillStyle = n),
      e.fillRect(0, 0, t, o));
  });
function rs(e, t, o, n, a, s, i, l = 1.6, c = 0.3, u = 0.15, f = ee) {
  const h = Math.floor((o - t) / c);
  for (let m = 0; m <= h; m++)
    e.box(i, t + (m * (o - t)) / h, (n + a) / 2, s + 0.1, u, a - n, 0.14);
  e.box(Pn, (t + o) / 2, n - 0.06, s + 0.1, o - t + 0.3, 0.12, 0.3).box(
    Pn,
    (t + o) / 2,
    a + 0.06,
    s + 0.1,
    o - t + 0.3,
    0.12,
    0.3,
  );
  const p = new r.Mesh(
    new r.PlaneGeometry(o - t, a - n),
    new r.MeshBasicMaterial({ map: Zr, color: new r.Color(l, l, l), fog: !1 }),
  );
  return (
    p.position.set((t + o) / 2, (n + a) / 2, s + 0.012),
    f.add(p),
    Qe(
      (t + o) / 2,
      (n + a) / 2,
      s + 1.4,
      "#ffae5c",
      Math.max(3, (o - t) * 0.6),
      0.12 * l,
    ),
    p
  );
}
{
  const e = F();
  e.box(aa, (Jt + Le) / 2, ne / 2, ce - 0.2, Le - Jt, ne, 0.4);
  for (let n = -4.9; n < Le - 0.4; n += 2.6)
    e.box(Pn, n, ne / 2, ce + 0.01, 0.05, ne, 0.04);
  (e.box(Eo, (Jt + Le) / 2, 0.12, ce + 0.08, Le - Jt, 0.24, 0.14),
    e.box(aa, (Le + wt) / 2, ne - 0.5, ce - 0.2, wt - Le, 1, 0.4),
    e.box(Pn, 1, ne + 0.2, 0, 40, 0.4, 20),
    e.box(aa, Jt - 0.2, ne / 2, 2, 0.4, ne, 20));
  for (const n of [Le + 0.09, 10.6, 14.3, wt])
    e.box(Eo, n, ne / 2, ce - 0.05, 0.18, ne, 0.3);
  (e
    .box(Eo, (Le + wt) / 2, 0.16, ce - 0.05, wt - Le, 0.32, 0.4)
    .box(Eo, (Le + wt) / 2, ne - 1.05, ce - 0.05, wt - Le, 0.14, 0.34),
    rs(e, -14.6, -8.1, 0.6, ne - 0.9, ce, Yr, 0.82, 0.3, 0.16),
    rs(e, 2.6, 5.8, 5.6, ne - 0.9, ce, Qr, 0.5, 0.28, 0.16),
    e.flush(ee, !1));
  const t = new r.Mesh(new r.BoxGeometry(22, 0.04, 0.04), K("#ffb86b", 1.25));
  (t.position.set(-4, ne - 0.35, ce + 0.3), ee.add(t));
  const o = new r.Mesh(new r.BoxGeometry(21, 0.04, 0.04), K("#ffae5c", 1.6));
  (o.position.set(-4, 0.27, ce + 0.16), ee.add(o));
  for (const n of [-7.75, -1.35, 6.45]) {
    const a = new r.Mesh(ts(0.34, ne, 0.2, 0.03), Eo);
    (a.position.set(n, ne / 2, ce + 0.12), ee.add(a));
    const s = new r.Mesh(
      new r.BoxGeometry(0.06, ne - 1.4, 0.05),
      K("#ffb468", 2.3),
    );
    (s.position.set(n, ne / 2, ce + 0.25),
      ee.add(s),
      Qe(n, 4.5, ce + 1.2, "#ffb468", 3, 0.22));
  }
}
{
  const e = new r.Mesh(
    new r.PlaneGeometry(40, 18),
    new r.MeshBasicMaterial({
      map: Kr,
      fog: !1,
      color: new r.Color(1.22, 1.16, 1.1),
    }),
  );
  (e.position.set(13, 7, -23), ee.add(e));
  const t = F();
  for (let o = 0; o < 30; o++) {
    const n = -10 - hn(o) * 16,
      a = 6.5 + hn(o + 0.5) * 17;
    ss(t, a, 0, n, 2.2 + hn(o + 0.2) * 2.8, o);
  }
  (t.box(_("#5d6b48", { roughness: 0.95 }), 13, -0.02, -18, 30, 0.04, 22),
    _o(t, 15.5, 0, -20, 5.2, 9.6, 4),
    _o(t, 10.2, 0, -21.5, 3.8, 6.6, 9),
    _o(t, 19.5, 0, -19, 3.4, 5.8, 12),
    t.flush(ee));
}
function Jr(e, t, o, n, a, s = ee) {
  const i = (c, u, f) => {
      ((c.fillStyle = "rgba(20,40,70,.42)"),
        c.fillRect(0, 0, u, f),
        a(c, u, f),
        (c.strokeStyle = "#b4efff"),
        (c.lineWidth = 15),
        na(c, 9, 9, u - 18, f - 18, 16),
        c.stroke());
    },
    l = Qt(o, n, 640, Math.round((640 * n) / o), i, 1, {
      alphaTest: 0,
      transparent: !0,
      depthWrite: !1,
      opacity: 0.95,
      color: new r.Color(0.9, 1, 1.2),
    });
  return (
    (l.userData.full = i),
    l.position.set(e, t, ce + 0.14),
    s.add(l),
    Lt.push(l),
    Qe(e, t + 0.2, ce + 1.6, "#7fd6ff", 5, 0.3),
    l
  );
}
const sa = [1, 1, 1, 1],
  ei = (e, t, o) => {
    ((e.lineCap = "round"), (e.lineJoin = "round"));
    const n = t * 0.27,
      a = o / 2,
      s = o * 0.34;
    ((e.fillStyle = "rgba(200,236,255,.75)"),
      (e.strokeStyle = "#d6f1ff"),
      (e.lineWidth = 7),
      e.beginPath(),
      e.rect(n - s * 0.62, a - s * 0.3, s * 0.36, s * 0.6),
      e.fill(),
      e.beginPath(),
      e.moveTo(n - s * 0.2, a - s * 0.3),
      e.lineTo(n + s * 0.42, a - s * 0.86),
      e.lineTo(n + s * 0.42, a + s * 0.86),
      e.lineTo(n - s * 0.2, a + s * 0.3),
      e.closePath(),
      e.fill());
    for (let i = 0; i < 4; i++) {
      const l = s * (0.78 + i * 0.5),
        c = 0.55 + i * 0.04,
        u = sa[i];
      ((e.strokeStyle = `rgba(214,241,255,${(0.25 + 0.75 * u).toFixed(3)})`),
        (e.lineWidth = 7 + u * 5),
        e.beginPath(),
        e.arc(n + s * 0.3, a, l, -c, c),
        e.stroke());
    }
  },
  Cn = Jr(-4.1, 8.55, 4.6, 2.7, ei);
function ti(e, t, o) {
  const n = [
      [0, 0, 0],
      [-t * 0.7, 0.3 * e, 0.02],
      [-t, 0.64 * e, -0.02 - o * 0.3],
      [0, e * 0.98, -o],
      [t, 0.64 * e, -0.02 - o * 0.3],
      [t * 0.7, 0.3 * e, 0.02],
      [0, 0.52 * e, -0.07 * t - o * 0.2],
    ],
    a = [
      [0, 1, 6],
      [1, 2, 6],
      [2, 3, 6],
      [0, 6, 5],
      [5, 6, 4],
      [4, 6, 3],
    ],
    s = [];
  for (const l of a) for (const c of l) s.push(...n[c]);
  const i = new r.BufferGeometry();
  return (
    i.setAttribute("position", new r.Float32BufferAttribute(s, 3)),
    i.computeVertexNormals(),
    i
  );
}
const oi = ["#3e6a3c", "#4b7a45", "#5a894c", "#34593a"].map((e) =>
  _(e, {
    flatShading: !0,
    roughness: 0.5,
    envMapIntensity: 0.7,
    side: r.DoubleSide,
  }),
);
function is(e, t, o, n, a = 1, s = 3, i = 26) {
  const l = F(),
    c = De(s);
  (l.cyl(
    _("#d8d2c6", { roughness: 0.6, flatShading: !0 }),
    t,
    o + 0.5 * a,
    n,
    0.62 * a,
    0.46 * a,
    1 * a,
    { seg: 4, ry: Math.PI / 4 },
  ),
    l.cyl(
      _("#2d241c", { roughness: 1 }),
      t,
      o + 0.99 * a,
      n,
      0.52 * a,
      0.52 * a,
      0.02,
      { seg: 4, ry: Math.PI / 4 },
    ));
  for (let u = 0; u < i; u++) {
    const f = u / i,
      h = u * 2.4 + c() * 0.5,
      p = (1.1 + f * 1.6) * a,
      m = 0.35 + (1 - f) * 0.85 + c() * 0.2,
      x = (0.62 + c() * 0.3) * a,
      g = x * 0.36;
    l.cyl(
      _("#5b6b3c", { roughness: 0.8 }),
      t + Math.sin(h) * 0.08 * a,
      o + 0.9 * a + (p - 0.9 * a) / 2,
      n + Math.cos(h) * 0.08 * a,
      0.018 * a,
      0.024 * a,
      p - 0.9 * a,
      { seg: 4 },
    );
    const M = ti(x, g, x * 0.18);
    (M.rotateX(-m),
      M.rotateY(h),
      l.geo(
        oi[u % 4],
        M,
        t + Math.sin(h) * 0.09 * a,
        o + p,
        n + Math.cos(h) * 0.09 * a,
      ));
  }
  l.flush(e);
}
{
  const e = F(),
    t = _("#6c6e72", { roughness: 0.55, envMapIntensity: 0.6 });
  (e.box(t, -11.2, 1.9, -5.9, 2.2, 3.8, 1.9, { r: 0.05 }), e.flush(ee));
  const o = new r.Mesh(new r.BoxGeometry(2.1, 0.04, 0.04), K("#ffae5c", 2.2));
  (o.position.set(-11.2, 0.12, -4.93),
    ee.add(o),
    is(ee, -11.2, 3.8, -5.9, 1.35, 5, 30),
    is(ee, 6.6, 0, -5.6, 1.55, 11, 30),
    Wr(ee, -12.6, 0, 3.2, 1.25, 0.02, { n: 6 }));
  {
    const n = F();
    (n.box(_("#d9d3c8", { roughness: 0.55 }), -12.6, 0.45, 3.2, 1.1, 0.9, 1.1, {
      r: 0.06,
    }),
      n.flush(ee));
  }
}
const ni = {};
{
  const e = new r.Group();
  (e.position.set(9.6, 0, -3.3), (e.rotation.y = -0.3), ee.add(e));
  const t = F(),
    o = _("#707378", { roughness: 0.5, envMapIntensity: 0.6 }),
    n = Tn("#18191d", { roughness: 0.5, clearcoat: 0.4 }),
    a = E("#2a2d33", { roughness: 0.3 });
  (t.box(o, 0, 1.55, 0, 2.4, 3.1, 2.2, { r: 0.04 }),
    t.box(n, 0, 3.1 + 1.2, 0, 1.62, 2.4, 1.5, { r: 0.07 }));
  const s = 0.75,
    i = U(
      [
        [0, 0.62],
        [0.04, 0.6],
        [0.05, 0.5],
        [0.02, 0.46],
        [-0.14, 0.22],
        [-0.12, 0.2],
        [-0.02, 0.18],
        [0.02, 0],
      ],
      48,
    ).rotateY(-Math.PI / 2);
  (t.geo(
    E("#c79a3d", { roughness: 0.42, metalness: 0.55, clearcoat: 0.4 }),
    i,
    0,
    3.1 + 0.78,
    s,
  ),
    t.tor(Fr, 0, 3.1 + 0.78, s + 0.03, 0.57, 0.05, { seg: 48, seg2: 8 }),
    t.tor(a, 0, 3.1 + 0.78, s + 0.01, 0.66, 0.035, { seg: 48, seg2: 6 }),
    t.sph(Tn("#101114", { roughness: 0.3 }), 0, 3.1 + 0.78, s + 0.02, 0.18, {
      s: [1, 1, 0.55],
    }),
    t.tor(a, 0, 3.1 + 1.86, s + 0.01, 0.2, 0.035, { seg: 32, seg2: 6 }),
    t.sph(Tn("#0d0e10", { roughness: 0.2 }), 0, 3.1 + 1.86, s, 0.14, {
      s: [1, 1, 0.5],
    }),
    t.flush(e));
  const l = new r.Mesh(new r.BoxGeometry(2.3, 0.04, 0.04), K("#ffae5c", 2.6));
  (l.position.set(0, 0.13, 1.12),
    e.add(l),
    Qe(9.9, 0.4, -2, "#ffae5c", 3, 0.7),
    (ni.g = e));
}
const Mt = { x0: -6.75, x1: 6.75, top: 1.86 },
  xe = Mt.top + 0.34,
  lt = [-0.66, 0.5],
  ai = [-5.95, 5.75],
  ue = new r.Group();
Bt.add(ue);
const ie = new r.Group(),
  Ve = Math.hypot(0.62, Mt.top - 0.3);
{
  const { x0: e, x1: t, top: o } = Mt,
    n = new r.Shape(
      [
        [2.12, 0.26],
        [1.5, o - 0.04],
        [1.42, o],
        [-1.72, o],
        [-1.8, o - 0.05],
        [-1.95, 0.26],
      ].map(([f, h]) => new r.Vector2(f, h)),
    ),
    a = new r.ExtrudeGeometry(n, {
      depth: t - e,
      bevelEnabled: !0,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 2,
    });
  (a.rotateY(-Math.PI / 2), a.translate(t, 0, 0));
  {
    const f = a.attributes.position,
      h = (e + t) / 2;
    for (let p = 0; p < f.count; p++) {
      const m = f.getX(p),
        x =
          (o - f.getY(p)) *
          0.26 *
          Math.sign(m - h) *
          Ye(1, 2.5, Math.abs(m - h) - (t - e) / 2 + 3);
      f.setX(p, m + x);
    }
    a.computeVertexNormals();
  }
  const s = new r.Mesh(
    a,
    E("#646c78", { roughness: 0.4, metalness: 0.7, envMapIntensity: 1.2 }),
  );
  ((s.castShadow = s.receiveShadow = !0), ue.add(s));
  const i = F();
  (i.box(
    _("#15181d", { roughness: 0.6 }),
    (e + t) / 2,
    0.13,
    0.08,
    t - e - 0.5,
    0.26,
    3.7,
  ),
    i.box(
      E("#5c636e", { roughness: 0.3 }),
      (e + t) / 2,
      o + 0.02,
      -0.15,
      t - e - 0.3,
      0.05,
      2.9,
      { r: 0.02 },
    ),
    i.flush(ue));
  const l = new r.Mesh(
    new r.BoxGeometry(t - e - 0.45, 0.05, 0.05),
    K("#ffab55", 4.2),
  );
  (l.position.set((e + t) / 2, 0.24, 2.02), ue.add(l));
  const c = l.clone();
  (c.position.set((e + t) / 2, 0.24, -1.86), ue.add(c));
  const u = new r.Mesh(
    new r.BoxGeometry(t - e - 0.2, 0.035, 0.035),
    K("#ffb468", 3.4),
  );
  (u.position.set((e + t) / 2, o - 0.03, 1.47),
    ue.add(u),
    Qe(-3, 0.5, 2.8, "#ffab55", 3, 0.9),
    Qe(3, 0.5, 2.8, "#ffab55", 3, 0.9),
    ie.position.set(0, 0.278, 2.165),
    (ie.rotation.x = -Math.atan2(0.62, o - 0.3)),
    ue.add(ie));
}
{
  const e = F(),
    [t, o] = ai,
    n = (t + o) / 2,
    a = o - t;
  for (const i of lt)
    e.cyl(Go, n, xe, i, 0.08, 0.08, a, { rz: Math.PI / 2, seg: 28 });
  for (const i of [t, o]) {
    e.box(Yt, i, xe - 0.1, (lt[0] + lt[1]) / 2, 0.44, 0.36, 1.66, { r: 0.035 });
    for (const l of lt)
      (e.cyl(he, i, xe + 0.086, l, 0.055, 0.055, 0.03, { seg: 12 }),
        e.box(gt, i, xe + 0.02, l, 0.46, 0.1, 0.26, { r: 0.02 }));
    e.cyl(he, i, xe - 0.1, 0.84, 0.055, 0.055, 0.03, {
      rx: Math.PI / 2,
      seg: 12,
    })
      .cyl(he, i - 0.13, xe - 0.1, 0.84, 0.04, 0.04, 0.03, {
        rx: Math.PI / 2,
        seg: 12,
      })
      .cyl(he, i + 0.13, xe - 0.1, 0.84, 0.04, 0.04, 0.03, {
        rx: Math.PI / 2,
        seg: 12,
      });
  }
  (e.box(gt, n, Mt.top + 0.07, -0.08, a + 0.2, 0.06, 1.5, { r: 0.02 }),
    e.box(Yt, 3.05, xe + 0.02, -0.08, 0.62, 0.3, 1.5, { r: 0.04 }));
  for (const i of [-0.5, 0.34])
    e.cyl(he, 3.05, xe + 0.175, i, 0.05, 0.05, 0.02, { seg: 12 });
  e.flush(ue);
  const s = new r.Mesh(
    new r.BoxGeometry(a - 0.2, 0.025, 0.025),
    K("#ffc27a", 2.6),
  );
  (s.position.set(n, Mt.top + 0.11, 0.7), ue.add(s));
}
const ls = E("#1a1f28", {
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }),
  cs = E("#2b313b", { roughness: 0.35 });
function Rn(e, t, o = {}) {
  const n = o.h || Ve * 0.8,
    a = o.y || Ve * 0.5,
    s = F();
  return (
    s
      .box(cs, e, a, 0.005, t, n, 0.03, { r: 0.05 })
      .box(ls, e, a, 0.02, t - 0.15, n - 0.08 * Ve, 0.02, { r: 0.04 }),
    s.flush(o.parent || ie, !1),
    { x: e, y: a, w: t, h: n }
  );
}
function kl(e, t, o, n, a, s = {}) {
  const i = s.cw || 1024,
    l = Math.round((i * n) / o),
    c = document.createElement("canvas");
  ((c.width = i), (c.height = l));
  const u = c.getContext("2d"),
    f = new r.CanvasTexture(c);
  ((f.colorSpace = r.SRGBColorSpace), (f.anisotropy = 8));
  const h = new r.Mesh(
    new r.PlaneGeometry(o, n),
    new r.MeshBasicMaterial({
      map: f,
      fog: !1,
      color: new r.Color(s.k || 1.5, s.k || 1.5, s.k || 1.5),
    }),
  );
  return (
    h.position.set(e, t, s.z ?? 0.036),
    (s.parent || ie).add(h),
    (h.userData = {
      c,
      g: u,
      t: f,
      cw: i,
      ch: l,
      redraw(p = 0) {
        (u.clearRect(0, 0, i, l), a(u, i, l, p), (f.needsUpdate = !0));
      },
    }),
    h.userData.redraw(0),
    kn.push(() => h.userData.redraw($)),
    h
  );
}
function us(e, t, o = {}) {
  const n = o.r || 0.36,
    a = new r.Group();
  (a.position.set(e, t, 0.03), (o.parent || ie).add(a));
  const s = new r.Mesh(Or(0, 0.14, 0, n * 0.86, 36, 0.02), Go);
  ((s.rotation.y = -Math.PI / 2), a.add(s));
  const i = new r.Group();
  a.add(i);
  const l = new r.Mesh(
    new r.CylinderGeometry(n * 0.8, n * 0.84, 0.05, 48),
    E("#d7dde6", { roughness: 0.18, metalness: 1 }),
  );
  ((l.rotation.x = Math.PI / 2), (l.position.z = 0.16), i.add(l));
  const c = new r.Mesh(
    new r.CircleGeometry(n * 0.78, 48),
    new r.MeshStandardMaterial({
      map: ra,
      roughness: 0.25,
      metalness: 1,
      envMapIntensity: 1.3,
    }),
  );
  ((c.position.z = 0.187), i.add(c));
  const u = new r.Mesh(
    new r.BoxGeometry(0.035, n * 0.42, 0.012),
    K(o.ring || "#ffb454", 3),
  );
  (u.position.set(0, n * 0.5, 0.196), i.add(u));
  const f = new r.Mesh(
    new r.TorusGeometry(n * 1.1, 0.02, 8, 72),
    K(o.ring || "#ffb454", 0.9),
  );
  ((f.position.z = 0.012), a.add(f));
  const h = new r.Mesh(
    new r.TorusGeometry(n * 1.1, 0.028, 8, 48, Math.PI * 0.55),
    K(o.ring || "#ffb454", 3.2),
  );
  return (
    (h.position.z = 0.016),
    a.add(h),
    (a.userData = { ring: f, tick: u, cap: i, arc: h, spin: 0 }),
    a
  );
}
const ra = ze(256, 256, (e, t, o) => {
  ((e.fillStyle = "#9aa3ae"), e.fillRect(0, 0, t, o));
  for (let n = 2; n < 128; n += 1.3)
    ((e.strokeStyle = `rgba(${n % 3 < 1.3 ? 255 : 40},${n % 3 < 1.3 ? 255 : 48},${n % 3 < 1.3 ? 255 : 60},${0.08 + hn(n) * 0.1})`),
      (e.lineWidth = 1),
      e.beginPath(),
      e.arc(128, 128, n, 0, 7),
      e.stroke());
});
function si(e, t, o, n = {}) {
  const a = F();
  a.box(
    _("#0b0e13", { roughness: 0.5 }),
    (e + t) / 2,
    o,
    0.04,
    t - e + 0.1,
    0.07,
    0.02,
  );
  for (let M = 0; M <= 8; M++) {
    const b = qt(e, t, M / 8);
    a.box(_("#8a93a3"), b, o - 0.24, 0.04, 0.018, M % 2 ? 0.06 : 0.1, 0.01);
  }
  a.flush(ie, !1);
  const s = n.color || "#6fdcff",
    i = new r.Mesh(new r.BoxGeometry(1, 0.04, 0.012), K(s, 3));
  (i.position.set(e, o, 0.055), ie.add(i));
  const l = new r.Mesh(new r.BoxGeometry(1, 0.028, 0.012), K("#c9d3e6", 0.55));
  (l.position.set(e, o, 0.052), ie.add(l));
  const c = new r.Group(),
    u = F();
  (u
    .cyl(Go, 0, 0, 0.11, 0.17, 0.18, 0.2, { seg: 32, rx: Math.PI / 2 })
    .cyl(he, 0, 0, 0.025, 0.19, 0.19, 0.05, { seg: 32, rx: Math.PI / 2 }),
    u.flush(c));
  const f = new r.Mesh(
    new r.CircleGeometry(0.165, 32),
    new r.MeshStandardMaterial({
      map: ra,
      roughness: 0.22,
      metalness: 1,
      envMapIntensity: 1.3,
    }),
  );
  ((f.position.z = 0.212), c.add(f));
  const h = new r.Mesh(new r.TorusGeometry(0.19, 0.012, 6, 40), K(s, 2.2));
  ((h.position.z = 0.03), c.add(h), c.position.set(e, o, 0.04), ie.add(c));
  const p = new r.Mesh(new r.ConeGeometry(0.05, 0.08, 3), K(s, 3));
  ((p.rotation.z = 0), p.position.set(e, o - 0.36, 0.05), ie.add(p));
  const m = new r.Mesh(
    new r.PlaneGeometry(t - e + 0.3, 0.5),
    new r.MeshBasicMaterial({ visible: !1 }),
  );
  (m.position.set((e + t) / 2, o, 0.1), ie.add(m));
  const x = (M, b) => {
      const S = new r.Group(),
        Z = K(s, 2.6);
      for (const O of [1, -1]) {
        const H = new r.Mesh(new r.BoxGeometry(0.2, 0.035, 0.012), Z);
        (H.position.set(-b * 0.05, O * 0.06, 0),
          (H.rotation.z = O * b * -0.85),
          S.add(H));
      }
      const I = new r.Mesh(
        new r.PlaneGeometry(0.4, 0.5),
        new r.MeshBasicMaterial({ visible: !1 }),
      );
      return (
        S.add(I),
        (S.userData.hit = I),
        S.position.set(M, o + 0.02, 0.05),
        ie.add(S),
        S
      );
    },
    g = {
      a: e,
      b: t,
      y: o,
      fill: i,
      knob: c,
      hit: m,
      tri: p,
      chevL: n.chev === !1 ? null : x(e - 0.34, -1),
      chevR: n.chev === !1 ? null : x(t + 0.34, 1),
      t: 0,
      set(M) {
        this.t = B(M, 0, 1);
        const b = qt(e, t, this.t);
        ((c.position.x = b),
          (p.position.x = b),
          (i.scale.x = Math.max(0.001, b - e)),
          (i.position.x = e + (b - e) / 2),
          (l.scale.x = Math.max(0.001, t - b)),
          (l.position.x = b + (t - b) / 2));
      },
      fromRay(M) {
        const b = M.intersectObject(m, !1)[0];
        if (!b) return null;
        const S = ie.worldToLocal(b.point.clone());
        return B((S.x - e) / (t - e), 0, 1);
      },
    };
  return (g.set(0), g);
}
const ia = [];
function ri(e, t, o, n, a, s = 128) {
  const i = "@RYANSAEL ON X",
    l = () => {
      ((e.font = `${n ? 700 : 600} ${s}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(s * 0.08) + "px"));
    };
  l();
  const c = e.measureText(i).width;
  c > t - 28 && ((s = Math.floor((s * (t - 28)) / c)), l());
  const u = t / 2 + Math.round(s * 0.04),
    f = o / 2 + s * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), n)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(i, u, f + s * 0.05),
      (e.fillStyle = a ? "#e08a24" : "#38332d"),
      e.fillText(i, u, f));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(i, u + s * 0.02, f + s * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(i, u, f - s * 0.025));
  const h = e.createLinearGradient(0, f - s * 0.7, 0, f);
  (h.addColorStop(0, "#f1d08c"),
    h.addColorStop(1, "#b3833d"),
    (e.fillStyle = h),
    e.fillText(i, u, f));
}
function fs(e, t = {}) {
  const o = !!t.pale,
    n = t.k ?? (o ? 0.92 : 0.6);
  let a = !1;
  const s = (l, c, u) => ri(l, c, u, o, a),
    i = Qt(e, e * 0.1375, 1280, 176, s, n, { alphaTest: 0.25 });
  return (
    (i.userData.mark = 1),
    Ht.push(i),
    ia.push({
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
function ii(e, t, o = 1.2, n = {}) {
  const a = fs(o, n);
  return (a.position.set(e, t, 0.012), ie.add(a), a);
}
const W = { x: -6.9, y: 3.05, z: -2.1, w: 4.4, h: 2.6, d: 1.5 },
  Fe = new r.Group();
(Fe.position.set(W.x, W.y, W.z), ue.add(Fe));
{
  const e = F(),
    { w: t, h: o, d: n } = W,
    a = E("#3b414b", { roughness: 0.36, metalness: 0.8 }),
    s = E("#23272e", { roughness: 0.42, metalness: 0.7 }),
    i = F();
  (i
    .box(
      E("#41474f", { roughness: 0.4, metalness: 0.7 }),
      W.x + 0.3,
      (W.y - 0.02) / 2,
      W.z - 0.25,
      6.4,
      W.y - 0.02,
      2.9,
      { r: 0.04 },
    )
    .box(
      _("#b9b5ad", { roughness: 0.45 }),
      W.x + 0.3,
      W.y - 0.03,
      W.z - 0.25,
      6.5,
      0.06,
      3,
      { r: 0.02 },
    ),
    i.flush(ue));
  const l = new r.Mesh(new r.BoxGeometry(6.2, 0.04, 0.04), K("#ffae5c", 3));
  (l.position.set(W.x + 0.3, 0.14, W.z + 1.22),
    ue.add(l),
    Qe(W.x, 0.5, W.z + 1.8, "#ffae5c", 3, 0.6),
    e.box(a, 0, o / 2 + 0.14, 0, t, o, n, { r: 0.13 }),
    e
      .box(s, -t / 2 + 0.12, o / 2 + 0.14, 0, 0.3, o - 0.2, n + 0.12, {
        r: 0.06,
      })
      .box(s, t / 2 - 0.12, o / 2 + 0.14, 0, 0.3, o - 0.2, n + 0.12, {
        r: 0.06,
      }));
  for (const c of [-1, 1])
    for (const u of [0.45, o - 0.2])
      e.cyl(
        he,
        c * (t / 2 - 0.12),
        u + 0.14,
        n / 2 + 0.07,
        0.045,
        0.045,
        0.03,
        { rx: Math.PI / 2, seg: 12 },
      );
  (e
    .box(cs, -0.32, o / 2 + 0.18, n / 2 + 0.005, 3.42, 2.06, 0.05, { r: 0.06 })
    .box(ls, -0.32, o / 2 + 0.18, n / 2 + 0.02, 3.27, 1.92, 0.04, { r: 0.05 }),
    e
      .box(s, -t / 2 + 0.55, 0.07, 0, 0.7, 0.14, n * 0.8, { r: 0.03 })
      .box(s, t / 2 - 0.55, 0.07, 0, 0.7, 0.14, n * 0.8, { r: 0.03 }));
  for (const c of [0.18, -0.2])
    e.cyl(Go, t / 2 + 0.08, o / 2 + 0.62, c, 0.1, 0.1, 0.16, {
      rz: Math.PI / 2,
      seg: 20,
    }).cyl(Lr, t / 2 + 0.2, o / 2 + 0.62, c, 0.075, 0.075, 0.1, {
      rz: Math.PI / 2,
      seg: 16,
    });
  e.flush(Fe);
}
const ds = ks(Fe, -0.32, W.h / 2 + 0.18, W.d / 2 + 0.045, 3.12, 1.8, 960, {
    gen: 1,
  }),
  la = ds.scr,
  zo = us(1.74, 0.66, { r: 0.27, ring: "#ffb454", parent: Fe });
zo.position.z = W.d / 2 + 0.02;
{
  const e = Qt(
    0.9,
    0.2,
    360,
    80,
    (n, a, s) => {
      ((n.fillStyle = "#b8c0cc"),
        (n.font = "600 34px DM Mono, monospace"),
        (n.textAlign = "center"),
        (n.textBaseline = "middle"),
        n.fillText("SIGNAL", a / 2, s / 2));
    },
    0.55,
    { alphaTest: 0.3 },
  );
  (e.position.set(1.74, 0.22, W.d / 2 + 0.012), Fe.add(e));
  const t = Qt(
    0.9,
    0.2,
    360,
    80,
    (n, a, s) => {
      ((n.fillStyle = "#b8c0cc"),
        (n.font = "600 34px DM Mono, monospace"),
        (n.textAlign = "center"),
        (n.textBaseline = "middle"),
        n.fillText("OUT", a / 2, s / 2));
    },
    0.55,
    { alphaTest: 0.3 },
  );
  (t.position.set(1.74, W.h - 0.12, W.d / 2 + 0.012), Fe.add(t));
  const o = new r.Mesh(new r.SphereGeometry(0.05, 12, 8), K("#7fe3ff", 3));
  (o.position.set(1.74, W.h - 0.42, W.d / 2 + 0.03),
    Fe.add(o),
    (Fe.userData.led = o));
}
const Vo = new r.Group();
(Bt.add(Vo), (Vo.visible = !1));
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
  ((e.renderOrder = -10), Vo.add(e), Lt.push(e));
  const t = nt(
      new r.MeshStandardMaterial({
        color: "#1a2438",
        roughness: 0.32,
        metalness: 0.2,
        envMapIntensity: 0.5,
      }),
      Ya,
    ),
    o = new r.Mesh(new r.CircleGeometry(90, 64), t);
  ((o.rotation.x = -Math.PI / 2),
    (o.receiveShadow = !0),
    Vo.add(o),
    Ht.push(o));
}
const Oo = new r.Group();
(Bt.add(Oo), (Oo.visible = !1));
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
  e.forEach(([l, c], u) => {
    const [f, h] = e[Math.min(u + 1, e.length - 1)],
      [p, m] = e[Math.max(u - 1, 0)],
      x = f - p,
      g = h - m,
      M = Math.hypot(x, g) || 1;
    for (const b of [-a, a]) (t.push(b, c, l), o.push(0, -x / M, g / M));
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
    _("#efe6da", { roughness: 0.92, envMapIntensity: 0.4 }),
  );
  ((i.receiveShadow = !0), Oo.add(i));
}
class li {
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
            ...yn,
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
          fragmentShader: `${oa}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Kt.add(this.mesh));
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
    (hs.subVectors(o, t),
      ps.addVectors(t, o).multiplyScalar(0.5),
      ms.subVectors(D.position, ps),
      Se.crossVectors(hs, ms).normalize());
    const u = this.pos,
      f = c * 12;
    ((u[f] = t.x - Se.x * n),
      (u[f + 1] = t.y - Se.y * n),
      (u[f + 2] = t.z - Se.z * n),
      (u[f + 3] = t.x + Se.x * n),
      (u[f + 4] = t.y + Se.y * n),
      (u[f + 5] = t.z + Se.z * n),
      (u[f + 6] = o.x - Se.x * a),
      (u[f + 7] = o.y - Se.y * a),
      (u[f + 8] = o.z - Se.z * a),
      (u[f + 9] = o.x + Se.x * a),
      (u[f + 10] = o.y + Se.y * a),
      (u[f + 11] = o.z + Se.z * a),
      this.side.set([-1, 1, -1, 1], c * 4));
    const h = this.col,
      p = c * 16;
    for (let m = 0; m < 4; m++)
      ((h[p + m * 4] = s.r),
        (h[p + m * 4 + 1] = s.g),
        (h[p + m * 4 + 2] = s.b),
        (h[p + m * 4 + 3] = m < 2 ? i : l));
  }
  line(t, o, n, a) {
    for (let s = 0; s < t.length - 1; s++) {
      const i = s / (t.length - 1),
        l = (s + 1) / (t.length - 1);
      this.seg(
        t[s],
        t[s + 1],
        bt(t[s], o),
        bt(t[s + 1], o),
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
const hs = new r.Vector3(),
  ps = new r.Vector3(),
  ms = new r.Vector3(),
  Se = new r.Vector3(),
  Oe = new li(6e3),
  bt = (e, t) =>
    ((D.position.distanceTo(e) *
      Math.tan(r.MathUtils.degToRad(D.fov / 2)) *
      2) /
      Math.max(It.clientHeight, 1)) *
    t *
    0.5;
function No(e = 640, t = 104) {
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
    Kt.add(s),
    (s.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 1,
      set(i, l = "", c = "#7fe3ff", u = 0) {
        const f = i + "|" + l + "|" + c + "|" + u;
        if (f === this.key) return;
        ((this.key = f),
          (this.args = [i, l, c, u]),
          n.clearRect(0, 0, e, t),
          (n.font = "600 38px Outfit, sans-serif"));
        const h = n.measureText(i).width;
        n.font = "500 30px DM Mono, monospace";
        const p = l ? n.measureText(l).width + 26 : 0,
          m = Math.min(e - 8, h + p + 84),
          x = u < 0 ? 4 : u > 0 ? e - 4 - m : (e - m) / 2;
        ((n.fillStyle = "rgba(10,14,26,.86)"),
          na(n, x, 8, m, t - 16, (t - 16) / 2),
          n.fill(),
          (n.fillStyle = c),
          n.beginPath(),
          n.arc(x + 34, t / 2, 9, 0, 7),
          n.fill(),
          (n.fillStyle = "#f2f6ff"),
          (n.font = "600 38px Outfit, sans-serif"),
          (n.textBaseline = "middle"),
          n.fillText(i, x + 56, t / 2 + 1),
          l &&
            ((n.fillStyle = "#9fe6ff"),
            (n.font = "500 30px DM Mono, monospace"),
            n.fillText(l, x + 56 + h + 22, t / 2 + 2)),
          (a.needsUpdate = !0));
      },
    }),
    kn.push(() => {
      const i = s.userData;
      i.args && ((i.key = ""), i.set(...i.args));
    }),
    s
  );
}
function Wo(e, t, o = 24, n = 0) {
  o *= 1.45;
  const a = (bt(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(D.quaternion),
    e.scale.set(a, a, a),
    n &&
      e.position.addScaledVector(
        ci.set(0, 1, 0).applyQuaternion(D.quaternion),
        (n * a * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-_t * 8))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
const ci = new r.Vector3();
let eo = !0;
const X = {
  Sd: 0.022,
  Mms: 0.025,
  fs: 38,
  Bl: 9,
  Re: 6,
  Qms: 5,
  Xmax: 0.006,
  rho: 1.18,
  c: 343,
};
{
  const e = X;
  ((e.ws = 2 * Math.PI * e.fs),
    (e.k = e.ws * e.ws * e.Mms),
    (e.Cms = 1 / e.k),
    (e.Rms = (e.ws * e.Mms) / e.Qms),
    (e.Qes = (e.ws * e.Mms * e.Re) / e.Bl ** 2),
    (e.Qts = (e.Qms * e.Qes) / (e.Qms + e.Qes)),
    (e.Vas = e.rho * e.c * e.c * e.Sd * e.Sd * e.Cms),
    (e.a = Math.sqrt(e.Sd / Math.PI)),
    (e.eta =
      (e.rho * e.Bl ** 2 * e.Sd ** 2) /
      (2 * Math.PI * e.c * e.Mms ** 2 * e.Re)),
    (e.sens = 112.1 + 10 * Math.log10(e.eta)));
}
const q = 200,
  xs = 15,
  to = 0.046,
  ca = X.c / xs / to / q,
  Xo = 1.2;
function ui(e) {
  const t = 2 * Math.PI * e,
    o = X,
    n = o.Rms,
    a = t * o.Mms - o.k / t,
    s = -t * o.Re * a,
    i = t * (o.Re * n + o.Bl * o.Bl),
    l = s * s + i * i;
  return { xr: (o.Bl * s) / l, xi: (-o.Bl * i) / l, w: t };
}
const Y = [
    {
      key: "bass",
      name: "Bass",
      f0: 55,
      note: "A1",
      exag: 10,
      h: [[1, Math.SQRT2, -Math.PI / 2]],
    },
    {
      key: "tone",
      name: "Tone",
      f0: 440,
      note: "A4",
      exag: 400,
      h: [[1, Math.SQRT2, -Math.PI / 2]],
    },
    { key: "voice", name: "Voice", f0: 147, note: "D3", exag: 150, h: null },
  ],
  Ze = [
    { v: "ah", F: [730, 1090, 2440] },
    { v: "eh", F: [530, 1840, 2480] },
    { v: "ee", F: [270, 2290, 3010] },
    { v: "oh", F: [570, 840, 2410] },
    { v: "oo", F: [300, 870, 2240] },
  ],
  fi = [80, 90, 120];
function di(e, t, o = 27) {
  const n = [];
  let a = 0;
  for (let i = 1; i <= o; i++) {
    const l = i * t;
    let c = 1,
      u = 0;
    for (let p = 0; p < 3; p++) {
      const m = e[p] * e[p],
        x = m - l * l,
        g = l * fi[p],
        M = x * x + g * g,
        b = (m * x) / M,
        S = (-m * g) / M,
        Z = c * b - u * S;
      ((u = c * S + u * b), (c = Z));
    }
    const f = -u / i,
      h = c / i;
    (n.push([i, Math.hypot(f, h), Math.atan2(h, f)]), (a += f * f + h * h));
  }
  const s = Math.sqrt(2 / a);
  for (const i of n) i[1] *= s;
  return n;
}
(Ze.forEach((e) => (e.h = di(e.F, Y[2].f0))), (Y[2].h = Ze[0].h));
const vs = 1.7,
  hi = 0.45,
  ua = vs + hi,
  Dn = { i: 0, j: 1, w: 0 };
function oo(e) {
  const t = Ze.length,
    o = (((e / ua) % t) + t) % t,
    n = Math.floor(o),
    a = (o - n) * ua;
  return ((Dn.i = n), (Dn.j = (n + 1) % t), (Dn.w = Ye(vs, ua, a)), Dn);
}
function fa(e, t, o) {
  let n = 0;
  const a = 2 * Math.PI * t * o;
  for (let s = 0; s < e.length; s++) {
    const i = e[s];
    n += i[1] * Math.cos(i[0] * a + i[2]);
  }
  return n;
}
function gs(e, t) {
  const o = t / q,
    n = Y[e];
  if (e !== 2) return fa(n.h, n.f0, o);
  const a = oo(t),
    s = fa(Ze[a.i].h, n.f0, o);
  return a.w > 1e-4 ? s + (fa(Ze[a.j].h, n.f0, o) - s) * a.w : s;
}
const P = {
  ev: [{ at: -1e9, s: 1 }],
  XF: 0.3,
  vRms: Math.sqrt(1 * X.Re),
  gain: 1,
  gainT: 1,
  quiet: !1,
};
function da(e) {
  const t = P.ev;
  let o = t.length - 1;
  for (; o > 0 && t[o].at > e;) o--;
  return o;
}
function no(e) {
  const t = P.ev,
    o = da(e),
    n = t[o],
    a = gs(n.s, e),
    s = o > 0 ? Ye(n.at, n.at + P.XF, e) : 1;
  if (s >= 1) return a * P.vRms;
  const i = gs(t[o - 1].s, e);
  return (i + (a - i) * s) * P.vRms;
}
function pi(e) {
  const t = P.ev,
    o = da(e),
    n = t[o];
  return o > 0 && e < n.at + P.XF * 0.5 ? t[o - 1].s : n.s;
}
const ct = () => P.ev[P.ev.length - 1].s,
  w = { DT: 0.002, N: 32768, kN: 0, kLo: 0 };
for (const e of ["x", "u", "a", "v", "i", "g"]) w[e] = new Float32Array(w.N);
const j = { x: 0, u: 0 },
  C = { on: !1, tgt: 0, x: 0, w: 0, om: 26, script: null, relAt: -99 },
  Uo = (e, t, o) =>
    ((X.Bl * (o - X.Bl * t)) / X.Re - X.Rms * t - X.k * e) / X.Mms;
function ws(e, t, o, n, a) {
  const s = e & (w.N - 1);
  ((w.x[s] = t),
    (w.u[s] = o),
    (w.a[s] = n),
    (w.v[s] = a),
    (w.i[s] = (a - X.Bl * o) / X.Re),
    (w.g[s] = P.gain));
}
function mi() {
  const e = w.kN,
    t = e * w.DT,
    o = w.DT / q;
  P.gain +=
    (P.gainT - P.gain) *
    (1 - Math.exp(-w.DT / (P.gainT > P.gain ? 0.18 : 0.05)));
  const n = C.script;
  if (n) {
    const M = (t - n.T0) / n.dur;
    ((C.tgt = M > 0 && M < 1 ? n.amp * Math.sin(Math.PI * M) ** 2 : 0),
      M > 1.6 && ((C.script = null), (C.on = !1), (C.relAt = t)));
  }
  if (C.on) {
    const M = C.om * C.om * (C.tgt - C.x) - 2 * C.om * C.w;
    ((C.w += M * w.DT),
      (C.x += C.w * w.DT),
      (j.x = C.x),
      (j.u = C.w * q),
      (w.kN = e + 1),
      ws(w.kN, j.x, j.u, M * q * q, 0));
    return;
  }
  const a = no(t) * P.gain,
    s = no(t + w.DT * 0.5) * P.gain,
    i = no(t + w.DT) * P.gain,
    l = j.x,
    c = j.u,
    u = Uo(l, c, a),
    f = Uo(l + (c * o) / 2, c + (u * o) / 2, s),
    h = c + (u * o) / 2,
    p = Uo(l + (h * o) / 2, c + (f * o) / 2, s),
    m = c + (f * o) / 2,
    x = Uo(l + m * o, c + p * o, i),
    g = c + p * o;
  ((j.x = l + (o / 6) * (c + 2 * h + 2 * m + g)),
    (j.u = c + (o / 6) * (u + 2 * f + 2 * p + x)),
    (w.kN = e + 1),
    ws(w.kN, j.x, j.u, Uo(j.x, j.u, i), i));
}
function An(e) {
  let t = 0;
  for (; w.kN * w.DT < e + w.DT && t < 2e5;) (mi(), t++);
  w.kLo = Math.max(w.kLo, w.kN - w.N + 2);
}
function qo(e) {
  const t = B(Math.ceil(e / w.DT), w.kLo + 1, w.kN);
  if (t >= w.kN) return !1;
  const o = t & (w.N - 1);
  ((w.kN = t), (j.x = w.x[o]), (j.u = w.u[o]), (P.gain = w.g[o]));
  const n = P.ev;
  for (; n.length > 1 && n[n.length - 1].at > t * w.DT;) n.pop();
  return (C.on && !C.script && ((C.x = j.x), (C.w = j.u / q)), !0);
}
const be = { x: 0, u: 0, a: 0, v: 0, i: 0, g: 1 };
function Ne(e) {
  const t = e / w.DT,
    o = Math.floor(t);
  if (o < w.kLo)
    return ((be.x = be.u = be.a = be.v = be.i = 0), (be.g = 1), be);
  const n = Math.min(o, w.kN),
    a = Math.min(o + 1, w.kN),
    s = o >= w.kN ? 0 : t - o,
    i = n & (w.N - 1),
    l = a & (w.N - 1);
  return (
    (be.x = w.x[i] + (w.x[l] - w.x[i]) * s),
    (be.u = w.u[i] + (w.u[l] - w.u[i]) * s),
    (be.a = w.a[i] + (w.a[l] - w.a[i]) * s),
    (be.v = w.v[i] + (w.v[l] - w.v[i]) * s),
    (be.i = w.i[i] + (w.i[l] - w.i[i]) * s),
    (be.g = w.g[i]),
    be
  );
}
const ut = {
  xPk: 0,
  iPk: 0,
  fPk: 0,
  vPk: 1,
  pRms: 0,
  spl: 0,
  f0: 440,
  lam: 0.78,
};
function Ft(e, t) {
  const o = Y[e],
    n = e === 2 ? Ze[0].h : o.h,
    a = 96;
  let s = 0,
    i = 0,
    l = 0,
    c = 0;
  const u = n.map(([h, p, m]) => {
    const x = ui(h * o.f0),
      g = x.w,
      M = X,
      b = M.Rms,
      S = g * M.Mms - M.k / g,
      Z = M.Re * b + M.Bl * M.Bl,
      I = M.Re * S,
      O = Z * Z + I * I,
      H = (b * Z + S * I) / O,
      me = (S * Z - b * I) / O;
    return { k: h, A: p, ph: m, xr: x.xr, xi: x.xi, ir: H, ii: me, w: g };
  });
  for (let h = 0; h < a; h++) {
    const p = (h / a) * 2 * Math.PI;
    let m = 0,
      x = 0,
      g = 0,
      M = 0;
    for (const S of u) {
      const Z = Math.cos(S.k * p + S.ph),
        I = Math.sin(S.k * p + S.ph),
        O = S.A * t * (S.xr * Z - S.xi * I);
      ((m += O),
        (x -= S.w * S.w * O),
        (g += S.A * t * (S.ir * Z - S.ii * I)),
        (M += S.A * t * Z));
    }
    ((s = Math.max(s, Math.abs(m))),
      (i = Math.max(i, Math.abs(g))),
      (c = Math.max(c, Math.abs(M))));
    const b = (X.rho * X.Sd * x) / (2 * Math.PI);
    l += b * b;
  }
  const f = Math.sqrt(l / a);
  return {
    xPk: s,
    iPk: i,
    fPk: i * X.Bl,
    vPk: c,
    pRms: f,
    spl: 20 * Math.log10(Math.max(f, 1e-9) / 2e-5),
    f0: o.f0,
    lam: X.c / o.f0,
  };
}
const We = 384,
  ft = new Float32Array(We * 4),
  ha = new r.DataTexture(ft, We, 1, r.RGBAFormat, r.FloatType);
ha.needsUpdate = !0;
const te = { dMax: 8.5, T: 0, crests: [], nC: 0 };
for (let e = 0; e < 20; e++) te.crests.push({ d: 0, a: 0 });
function xi(e) {
  const t = te.dMax;
  te.T = e;
  for (let n = 0; n < We; n++) {
    const a = (n / (We - 1)) * t,
      s = Ne(e - a / ca);
    ((ft[n * 4] = (X.rho * X.Sd * s.a) / (2 * Math.PI)),
      (ft[n * 4 + 1] = s.u),
      (ft[n * 4 + 2] = 0),
      (ft[n * 4 + 3] = 1));
  }
  ((ha.needsUpdate = !0), (te.nC = 0));
  const o = 0.03 * Xo;
  for (let n = 1; n < We - 1 && te.nC < te.crests.length; n++) {
    const a = ft[(n - 1) * 4],
      s = ft[n * 4],
      i = ft[(n + 1) * 4];
    if (s > o && s >= a && s > i) {
      const l = a - 2 * s + i,
        c = l < 0 ? B((0.5 * (a - i)) / l, -0.5, 0.5) : 0,
        u = te.crests[te.nC++];
      ((u.d = ((n + c) / (We - 1)) * t), (u.a = s - 0.25 * (a - i) * c));
    }
  }
}
const G = new r.Group();
(G.scale.setScalar(1.1), Bt.add(G));
const z = {},
  y = {
    xBack: -1.62,
    xBP: -1.34,
    xMid: -0.82,
    xTP: -0.3,
    pole: 0.55,
    vent: 0.14,
    gap: 0.665,
    magIn: 0.8,
    magOut: 1.42,
    coilR: 0.612,
    wire: 0.024,
    coil0: -0.28,
    coil1: 0.46,
    form0: -0.38,
    form1: 0.74,
    coneIn: 0.6,
    coneX0: 0.72,
    coneOut: 1.93,
    coneX1: 1.96,
    spX: 0.58,
    spOut: 1.66,
    rimX0: 1.93,
    rimX1: 2.09,
    rimIn: 1.98,
    rimOut: 2.42,
    mouth: 2.02,
    scale: 1.1,
  };
function ao(e) {
  let t = 0;
  for (let o = 0; o < e.length - 1; o++) {
    const [n, a] = e[o],
      [s, i] = e[o + 1];
    t += a * s - i * n;
  }
  return t < 0 ? e.slice().reverse() : e;
}
function pa(e, t) {
  const o = [],
    n = [];
  for (let a = 0; a < e.length; a++) {
    const s = e[Math.max(a - 1, 0)],
      i = e[Math.min(a + 1, e.length - 1)],
      l = i[0] - s[0],
      c = i[1] - s[1],
      u = Math.hypot(l, c) || 1,
      f = -c / u,
      h = l / u;
    (o.push([e[a][0] + (f * t) / 2, e[a][1] + (h * t) / 2]),
      n.push([e[a][0] - (f * t) / 2, e[a][1] - (h * t) / 2]));
  }
  return ao([...o, ...n.reverse(), o[0]]);
}
const so = [Math.PI / 2, Math.PI],
  jo = [-Math.PI / 2, Math.PI],
  $o = ze(512, 512, (e, t, o) => {
    ((e.fillStyle = "#d9dde3"), e.fillRect(0, 0, t, o));
    const n = De(21);
    for (let a = 0; a < 14e3; a++) {
      const s = n();
      ((e.fillStyle =
        s > 0.5
          ? `rgba(255,255,255,${0.03 + n() * 0.07})`
          : `rgba(0,0,0,${0.05 + n() * 0.09})`),
        e.fillRect(n() * t, n() * o, 1 + n() * 2.2, 1 + n() * 2.2));
    }
    for (let a = 0; a < 260; a++) {
      ((e.strokeStyle = `rgba(${n() > 0.5 ? 255 : 0},${n() > 0.5 ? 255 : 0},${n() > 0.5 ? 255 : 0},.045)`),
        (e.lineWidth = 1 + n()));
      const s = n() * t;
      (e.beginPath(),
        e.moveTo(s, 0),
        e.lineTo(s + (n() - 0.5) * 24, o),
        e.stroke());
    }
  });
(($o.wrapS = $o.wrapT = r.RepeatWrapping), $o.repeat.set(6, 3));
const Ho = ze(256, 256, (e, t, o) => {
  ((e.fillStyle = "#d6b27c"), e.fillRect(0, 0, t, o));
  for (let n = 0; n < t; n += 4)
    ((e.fillStyle = "rgba(255,236,190,.12)"),
      e.fillRect(n, 0, 2, o),
      (e.fillStyle = "rgba(70,40,10,.12)"),
      e.fillRect(0, n, t, 2));
});
((Ho.wrapS = Ho.wrapT = r.RepeatWrapping), Ho.repeat.set(18, 3));
const Ko = ze(256, 256, (e, t, o) => {
  ((e.fillStyle = "#8a8e96"), e.fillRect(0, 0, t, o));
  const n = De(5);
  for (let a = 0; a < 9e3; a++)
    ((e.fillStyle = `rgba(${n() > 0.5 ? 255 : 0},${n() > 0.5 ? 255 : 0},${n() > 0.5 ? 255 : 0},${0.05 + n() * 0.1})`),
      e.fillRect(n() * t, n() * o, 1.5, 1.5));
});
((Ko.wrapS = Ko.wrapT = r.RepeatWrapping), Ko.repeat.set(8, 2));
const A = {
  steel: E("#c9cfd8", {
    roughness: 0.3,
    metalness: 1,
    clearcoat: 0.3,
    envMapIntensity: 1.5,
  }),
  ferrite: nt(
    new r.MeshStandardMaterial({
      color: "#6a6e76",
      map: Ko,
      bumpMap: Ko,
      bumpScale: 1.2,
      roughness: 0.62,
      metalness: 0.55,
      envMapIntensity: 0.9,
    }),
  ),
  basket: E("#30353d", { roughness: 0.42, metalness: 0.72 }),
  cut: E("#cdb68c", { roughness: 0.46, metalness: 0.45, clearcoat: 0.25 }),
  cutSteel: E("#e1e5eb", {
    roughness: 0.3,
    metalness: 0.8,
    clearcoat: 0.3,
    envMapIntensity: 1.5,
  }),
  cutFerrite: E("#7f858e", {
    roughness: 0.62,
    metalness: 0.45,
    envMapIntensity: 0.9,
  }),
  pole: E("#8e959f", { roughness: 0.42, metalness: 1, envMapIntensity: 0.75 }),
  cone: nt(
    new r.MeshStandardMaterial({
      color: "#8f959f",
      map: $o,
      bumpMap: $o,
      bumpScale: 1.4,
      roughness: 0.7,
      metalness: 0.1,
      envMapIntensity: 0.9,
    }),
  ),
  cap: Tn("#0e0f12", {
    roughness: 0.42,
    clearcoat: 0.7,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.7,
  }),
  rubber: _("#16171a", { roughness: 0.62, envMapIntensity: 0.45 }),
  spider: nt(
    new r.MeshStandardMaterial({
      color: "#eed3a2",
      map: Ho,
      bumpMap: Ho,
      bumpScale: 0.8,
      roughness: 0.86,
      envMapIntensity: 0.5,
    }),
  ),
  former: _("#d8c49a", { roughness: 0.6 }),
  coil: E("#d0763f", {
    roughness: 0.24,
    metalness: 1,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.4,
  }),
  gold: E("#d6a64a", { roughness: 0.25, metalness: 1, clearcoat: 0.5 }),
  hole: _("#07080a", { roughness: 0.9 }),
};
function yt(e, t, o, n, a, s = 96, i = A.cut) {
  ((n = ao(n)), e.geo(a, U(n, s, so)), t.geo(i, Zt(n)), o.geo(a, U(n, s, jo)));
}
const Gt = new r.Group();
(G.add(Gt), (z.motor = Gt));
const Xe = {
  back: new r.Group(),
  cut: new r.Group(),
  front: new r.Group(),
  cage: new r.Group(),
};
Gt.add(Xe.back, Xe.cut, Xe.front, Xe.cage);
const Yo = new r.Group();
(G.add(Yo), (z.basket = Yo));
const ke = { back: new r.Group(), cut: new r.Group(), front: new r.Group() };
Yo.add(ke.back, ke.cut, ke.front);
const Tt = { back: new r.Group(), cut: new r.Group(), front: new r.Group() };
Xe.cage.add(Tt.back, Tt.cut, Tt.front);
{
  const e = y,
    t = F(),
    o = F(),
    n = F(),
    a = F(),
    s = F(),
    i = F(),
    l = F(),
    c = F(),
    u = F(),
    f = F();
  yt(
    t,
    o,
    n,
    [
      [e.xBack, e.pole],
      [e.xBack, 1.37],
      [e.xBack + 0.08, 1.45],
      [e.xBP, 1.45],
      [e.xBP, e.pole],
    ],
    A.steel,
    96,
    A.cutSteel,
  );
  for (const [m, x] of [
    [e.xBP, e.xMid],
    [e.xMid, e.xTP],
  ])
    yt(
      t,
      o,
      n,
      [
        [m, e.magIn],
        [m, e.magOut - 0.03],
        [m + 0.03, e.magOut],
        [x - 0.03, e.magOut],
        [x, e.magOut - 0.03],
        [x, e.magIn],
      ],
      A.ferrite,
      96,
      A.cutFerrite,
    );
  yt(
    t,
    o,
    n,
    [
      [e.xTP, e.gap + 0.02],
      [e.xTP, e.magOut],
      [-0.03, e.magOut],
      [0, e.magOut - 0.03],
      [0, e.gap + 0.05],
      [-0.04, e.gap],
    ],
    A.steel,
    96,
    A.cutSteel,
  );
  {
    const m = ao(
        it(
          [
            [e.xBack - 0.04, 1.56],
            [e.xBack + 0.05, 1.72],
            [-0.1, 1.72],
            [-0.01, 1.6],
          ],
          [
            [e.xBack - 0.04, 1.47],
            [-0.01, 1.47],
          ],
        ),
      ),
      x = Math.PI / 8;
    for (const g of [0, 0.5, 1, 1.5].map((M) => M * Math.PI))
      if (
        Math.abs(g - 0.5 * Math.PI) < 0.01 ||
        Math.abs(g - 1.5 * Math.PI) < 0.01
      ) {
        const b = g < Math.PI ? [g, x] : [g - x, x],
          S = g < Math.PI ? [g - x, x] : [g, x];
        (c.geo(A.basket, U(m, 1, b)), f.geo(A.basket, U(m, 1, S)));
      } else
        (Math.abs(g - Math.PI) < 0.01 ? c : f).geo(
          A.basket,
          U(m, 2, [g - x, 2 * x]),
        );
    u.geo(A.cut, Zt(m));
    for (const g of [Math.PI * 0.5, Math.PI, Math.PI * 1.5])
      for (const M of [e.xBack + 0.3, -0.5]) {
        const b = -Math.sin(g) * 1.73,
          S = Math.cos(g) * 1.73;
        (S > 0.01 ? f : c).geo(
          he,
          new r.CylinderGeometry(0.06, 0.06, 0.04, 12),
          M,
          b,
          S,
          { dir: [0, -Math.sin(g), Math.cos(g)] },
        );
      }
  }
  (yt(
    t,
    o,
    n,
    [
      [e.xBack, e.vent],
      [e.xBack, e.pole],
      [0.05, e.pole],
      [0.09, e.pole - 0.04],
      [0.09, e.vent],
    ],
    A.pole,
    96,
    A.cutSteel,
  ),
    t.geo(
      A.hole,
      U(
        ao([
          [e.xBack + 0.01, e.vent - 0.004],
          [0.08, e.vent - 0.004],
          [0.08, e.vent - 0.012],
          [e.xBack + 0.01, e.vent - 0.012],
        ]),
        32,
        so,
      ),
    ),
    yt(
      s,
      i,
      l,
      it(
        [
          [0, 1.56],
          [0.1, 1.56],
        ],
        [
          [0, 0.95],
          [0.1, 0.95],
        ],
      ),
      A.basket,
    ));
  const h = ao(
      it(
        [
          [0.02, 1.57],
          [0.5, 1.71],
          [e.rimX0 + 0.01, 2.27],
        ],
        [
          [0.02, 1.47],
          [0.5, 1.61],
          [e.rimX0 + 0.01, 2.17],
        ],
      ),
    ),
    p = 0.19;
  (s.geo(A.basket, U(h, 10, [1.5 * Math.PI - p, p])),
    l.geo(A.basket, U(h, 10, [1.5 * Math.PI, p])),
    s.geo(A.basket, U(h, 10, [0.5 * Math.PI, p])),
    l.geo(A.basket, U(h, 10, [0.5 * Math.PI - p, p])),
    s.geo(A.basket, U(h, 20, [Math.PI - p, 2 * p])),
    l.geo(A.basket, U(h, 20, [-p, 2 * p])),
    i.geo(A.cut, Zt(h)),
    yt(
      s,
      i,
      l,
      it(
        [
          [e.spX - 0.07, 1.72],
          [e.spX + 0.07, 1.72],
        ],
        [
          [e.spX - 0.07, 1.55],
          [e.spX + 0.07, 1.55],
        ],
      ),
      A.basket,
    ),
    yt(
      s,
      i,
      l,
      it(
        [
          [e.rimX0, e.rimOut],
          [e.rimX1, e.rimOut],
        ],
        [
          [e.rimX0, e.rimIn],
          [e.rimX1, e.rimIn],
        ],
      ),
      A.basket,
      96,
    ),
    yt(
      s,
      i,
      l,
      it(
        [
          [e.rimX1, 2.16],
          [e.rimX1 + 0.05, 2.16],
        ],
        [
          [e.rimX1, 2],
          [e.rimX1 + 0.05, 2],
        ],
      ),
      A.rubber,
      96,
    ));
  for (let m = 0; m < 16; m++) {
    const x = ((m + 0.5) / 16) * Math.PI * 2,
      g = -Math.sin(x) * 2.29,
      M = Math.cos(x) * 2.29,
      b = new r.CylinderGeometry(0.052, 0.052, 0.012, 16);
    (M > 0.01 ? l : s).geo(A.hole, b, e.rimX1 + 0.004, g, M, {
      rz: Math.PI / 2,
    });
  }
  a.box(A.basket, e.xBack - 0.17, 0, 0, 0.34, 0.62, 0.92, { r: 0.04 });
  for (const m of [-0.22, 0.22])
    a.cyl(A.gold, e.xBack - 0.4, 0, m, 0.07, 0.07, 0.14, {
      rz: Math.PI / 2,
      seg: 16,
    }).cyl(
      m < 0
        ? _("#b8322c", { roughness: 0.5 })
        : _("#1a1b1f", { roughness: 0.5 }),
      e.xBack - 0.36,
      0,
      m,
      0.1,
      0.1,
      0.06,
      { rz: Math.PI / 2, seg: 20 },
    );
  (t.flush(Xe.back),
    o.flush(Xe.cut, !1),
    n.flush(Xe.front),
    a.flush(Gt),
    s.flush(ke.back),
    i.flush(ke.cut, !1),
    l.flush(ke.front),
    c.flush(Tt.back),
    u.flush(Tt.cut, !1),
    f.flush(Tt.front));
}
{
  const e = F();
  for (const t of [-1, 1]) {
    const o = 0.3 + t * 0.14;
    e.box(A.gold, o, -0.25 + t * 0.02, 1.55, 0.18, 0.2, 0.05, { r: 0.01 }).cyl(
      Go,
      o,
      -0.25 + t * 0.02,
      1.585,
      0.035,
      0.035,
      0.03,
      { rx: Math.PI / 2, seg: 12 },
    );
    const n = [
      new r.Vector3(o, -0.25, 1.55),
      new r.Vector3(o + 0.1, -0.3 + t * 0.05, 1.2),
      new r.Vector3(0.45, -0.2 + t * 0.08, 0.85),
      new r.Vector3(0.4, -0.1 + t * 0.06, 0.64),
    ];
    e.geo(
      E("#c77a45", { roughness: 0.45, metalness: 0.9 }),
      new r.TubeGeometry(new r.CatmullRomCurve3(n), 24, 0.018, 5, !1),
    );
  }
  ((ke.leads = new r.Group()), ke.front.add(ke.leads), e.flush(ke.leads));
}
const ro = new r.Group();
(G.add(ro), (z.coil = ro));
{
  const e = y,
    t = F(),
    o = (e.coil1 - e.coil0) / (2 * e.wire),
    n = Math.round(o * 28),
    a = [];
  for (let s = 0; s <= n; s++) {
    const i = s / n,
      l = i * o * Math.PI * 2;
    a.push(
      new r.Vector3(
        qt(e.coil0, e.coil1, i),
        -Math.sin(l) * e.coilR,
        Math.cos(l) * e.coilR,
      ),
    );
  }
  (t.geo(
    A.coil,
    new r.TubeGeometry(new r.CatmullRomCurve3(a), n, e.wire, 7, !1),
  ),
    t.geo(
      A.former,
      U(
        it(
          [
            [e.form0, 0.588],
            [e.form1, 0.588],
          ],
          [
            [e.form0, 0.566],
            [e.form1, 0.566],
          ],
        ),
        72,
      ),
    ));
  for (const s of [e.coil0 - 0.03, e.coil1 + 0.03])
    t.geo(
      E("#b9c0cb", { roughness: 0.3 }),
      U(
        it(
          [
            [s - 0.02, 0.6],
            [s + 0.02, 0.6],
          ],
          [
            [s - 0.02, 0.586],
            [s + 0.02, 0.586],
          ],
        ),
        64,
      ),
    );
  t.flush(ro);
}
const Ge = new r.Group();
(G.add(Ge), (z.cone = Ge));
const St = { back: new r.Group(), cut: new r.Group(), front: new r.Group() };
Ge.add(St.back, St.cut, St.front);
const io = [];
for (let e = 0; e <= 26; e++) {
  const t = e / 26;
  io.push([
    y.coneX0 + (y.coneX1 - y.coneX0) * (1 - (1 - t) ** 1.45),
    y.coneIn + (y.coneOut - y.coneIn) * t,
  ]);
}
const Ms = (e) => {
  for (let t = 1; t < io.length; t++)
    if (io[t][1] >= e) {
      const [o, n] = io[t - 1],
        [a, s] = io[t];
      return o + ((a - o) * (e - n)) / (s - n);
    }
  return y.coneX1;
};
{
  const e = F(),
    t = F(),
    o = F(),
    n = F(),
    a = pa(io, 0.03);
  (e.geo(A.cone, U(a, 80, so)),
    t.geo(A.cut, Zt(a)),
    o.geo(A.cone, U(a, 80, jo)),
    n.tor(A.former, y.coneX0, 0, 0, 0.6, 0.03, {
      ry: Math.PI / 2,
      seg: 64,
      seg2: 8,
    }));
  const s = 0.76,
    i = Ms(s) + 0.012,
    l = 0.38,
    c = (s * s + l * l) / (2 * l),
    u = Math.asin(s / c),
    f = [[i, 0]];
  for (let h = 0; h <= 24; h++) {
    const p = u * (1 - h / 24);
    f.push([i + l - c * (1 - Math.cos(p)), c * Math.sin(p)]);
  }
  (f.push([i, 0]),
    n.geo(A.cap, U(ao(f.map(([h, p]) => [h, p])), 72)),
    e.flush(St.back),
    t.flush(St.cut, !1),
    o.flush(St.front),
    n.flush(Ge),
    (z.capX = i + l));
}
function lo(e, t, o, n) {
  const a = e.attributes.position,
    s = e.attributes.normal,
    i = a.count,
    l = Float32Array.from(a.array),
    c = Float32Array.from(s.array),
    u = new Float32Array(i),
    f = new Float32Array(i);
  for (let p = 0; p < i; p++) {
    const m = Math.hypot(l[p * 3 + 1], l[p * 3 + 2]);
    ((u[p] = n(m)), (f[p] = (n(m + 0.002) - n(m - 0.002)) / 0.004));
  }
  const h = new r.Mesh(e, t);
  return (
    (h.castShadow = h.receiveShadow = !0),
    (h.frustumCulled = !1),
    o.add(h),
    (h.userData.flex = { P0: l, N0: c, W: u, dW: f, s: 0 }),
    h
  );
}
function vi(e, t) {
  const o = e.userData.flex;
  if (Math.abs(t - o.s) < 1e-6 || !e.visible) return;
  o.s = t;
  const n = e.geometry.attributes.position.array,
    a = e.geometry.attributes.normal.array,
    s = o.P0,
    i = o.N0;
  for (let l = 0, c = 0; l < o.W.length; l++, c += 3) {
    n[c] = s[c] + t * o.W[l];
    const u = i[c],
      f = s[c + 1],
      h = s[c + 2],
      p = Math.hypot(f, h) || 1,
      m = (t * o.dW[l] * u) / p,
      x = i[c + 1] - m * f,
      g = i[c + 2] - m * h,
      M = Math.hypot(u, x, g) || 1;
    ((a[c] = u / M), (a[c + 1] = x / M), (a[c + 2] = g / M));
  }
  ((e.geometry.attributes.position.needsUpdate = !0),
    (e.geometry.attributes.normal.needsUpdate = !0));
}
const ma = [],
  xa = Qe(0, 0, 0, "#6fb8ff", 3.2, 0.9),
  va = Qe(0, 0, 0, "#fff0dc", 6.5, 1.1),
  dt = new r.Group();
(G.add(dt), (z.spider = dt));
{
  const e = y,
    t = [];
  for (let i = 0; i <= 90; i++) {
    const l = 0.588 + ((e.spOut - 0.588) * i) / 90,
      c = (l - 0.588) / (e.spOut - 0.588),
      u = Ye(0, 0.06, c) * (1 - Ye(0.93, 1, c));
    t.push([e.spX + 0.05 * u * Math.sin(c * Math.PI * 2 * 5.5), l]);
  }
  const o = pa(t, 0.022),
    n = (i) => 1 - Ye(0.6, e.spOut - 0.02, i);
  ((z.spB = lo(U(o, 64, so), A.spider, dt, n)),
    (z.spF = lo(U(o, 64, jo), A.spider, dt, n)),
    (z.spC = lo(Zt(o), A.cut, dt, n)),
    ma.push([z.spB, 1], [z.spF, 1], [z.spC, 1]));
  const a = it(
      [
        [e.spX - 0.035, e.spOut + 0.02],
        [e.spX + 0.035, e.spOut + 0.02],
      ],
      [
        [e.spX - 0.035, e.spOut - 0.09],
        [e.spX + 0.035, e.spOut - 0.09],
      ],
    ),
    s = _("#1b1c20", { roughness: 0.5 });
  ((z.spRingB = new r.Mesh(U(a, 64, so), s)),
    (z.spRingF = new r.Mesh(U(a, 64, jo), s)),
    dt.add(z.spRingB, z.spRingF));
}
{
  const e = [y.coneX1, y.coneOut],
    t = [y.rimX1 + 0.002, 2.12],
    o = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2],
    n = [t[0] - e[0], t[1] - e[1]],
    a = Math.hypot(...n),
    s = [n[0] / a, n[1] / a],
    i = [s[1], -s[0]],
    l = a / 2,
    c = [];
  for (let h = 0; h <= 20; h++) {
    const p = (h / 20) * Math.PI;
    c.push([
      o[0] - Math.cos(p) * l * s[0] + Math.sin(p) * l * i[0],
      o[1] - Math.cos(p) * l * s[1] + Math.sin(p) * l * i[1],
    ]);
  }
  const u = pa(c, 0.024),
    f = (h) => Ye(y.coneOut, 2.12, h);
  ((z.suB = lo(U(u, 80, so), A.rubber, Ge, f)),
    (z.suF = lo(U(u, 80, jo), A.rubber, Ge, f)),
    (z.suC = lo(Zt(u), A.cut, Ge, f)),
    ma.push([z.suB, -1], [z.suF, -1], [z.suC, -1]));
}
const ga = 5.24,
  bs = 0.455,
  In = [-1, ga, -0.45],
  Bn = xe + 0.44;
{
  const e = new r.Group();
  (G.add(e), (z.saddle = e));
  const t = F(),
    o = (Bn - ga) / y.scale,
    n = y.xMid;
  t.box(Yt, n, (o + -1.74) / 2, 0, 0.56, -1.74 - o, 1, { r: 0.04 }).box(
    gt,
    n,
    -1.78,
    0,
    1.1,
    0.1,
    1.2,
    { r: 0.03 },
  );
  for (const s of [-0.44, 0.44])
    t.cyl(he, n - 0.38, -1.72, s, 0.05, 0.05, 0.03, { seg: 12 }).cyl(
      he,
      n + 0.38,
      -1.72,
      s,
      0.05,
      0.05,
      0.03,
      { seg: 12 },
    );
  t.box(gt, n, o + 0.08, 0, 0.9, 0.16, 1.3, { r: 0.03 });
  for (const s of [-0.46, 0.46])
    t.cyl(he, n, o + 0.17, s, 0.06, 0.06, 0.03, { seg: 12 });
  const a = (xe + 0.31 - ga) / y.scale;
  t.box(Yt, (y.rimX0 + y.rimX1) / 2, a + 0.09, 0, 0.62, 0.18, 0.9, { r: 0.03 });
  for (const s of [y.rimX0 - 0.07, y.rimX1 + 0.07])
    t.box(
      gt,
      s,
      (a + 0.18 + (-y.rimOut + 0.2)) / 2,
      0,
      0.1,
      -y.rimOut + 0.2 - (a + 0.18),
      0.5,
      { r: 0.02 },
    );
  (t
    .cyl(he, y.rimX1 + 0.12, -y.rimOut + 0.12, 0.12, 0.05, 0.05, 0.2, {
      rz: Math.PI / 2,
      seg: 12,
    })
    .cyl(he, y.rimX1 + 0.12, -y.rimOut + 0.12, -0.12, 0.05, 0.05, 0.2, {
      rz: Math.PI / 2,
      seg: 12,
    }),
    t.flush(e));
}
{
  const e = F(),
    t = In[0],
    o = In[2];
  for (const a of [-1.15, 1.15])
    for (const s of lt)
      e.box(gt, t + a, xe + 0.02, s, 0.62, 0.3, 0.34, { r: 0.03 });
  (e.box(Yt, t, xe + 0.24, (lt[0] + lt[1]) / 2, 3.5, 0.14, 1.9, { r: 0.03 }),
    e
      .cyl(E("#5a616c", { roughness: 0.3 }), t, Bn - 0.07, o, 1.25, 1.3, 0.14, {
        seg: 72,
      })
      .cyl(he, t, Bn - 0.155, o, 1.1, 1.1, 0.04, { seg: 64 }));
  for (const a of [-1.5, 1.5])
    for (const s of [-0.7, 0.7])
      e.cyl(he, t + a, xe + 0.315, (lt[0] + lt[1]) / 2 + s, 0.05, 0.05, 0.02, {
        seg: 12,
      });
  e.flush(ue);
  const n = new r.Mesh(
    new r.CylinderGeometry(1.305, 1.305, 0.05, 120, 1, !0),
    new r.MeshStandardMaterial({
      map: ze(1024, 32, (a, s, i) => {
        ((a.fillStyle = "#2a2f36"),
          a.fillRect(0, 0, s, i),
          (a.fillStyle = "#d9dde4"));
        for (let l = 0; l < 120; l++) {
          const c = (l / 120) * s;
          a.fillRect(c, 0, l % 10 ? 1.5 : 3, l % 10 ? 10 : 22);
        }
      }),
      roughness: 0.5,
      metalness: 0.4,
    }),
  );
  (n.position.set(t, Bn - 0.05, o), ue.add(n));
}
const kt = new r.Group();
(Bt.add(kt), (kt.visible = !1));
const oe = {
  x: -0.2,
  y: 3.15,
  off: { motor: -4.35, coil: -1.35, spider: -0.35, cone: 1.25 },
  x0: -7,
  x1: 7.4,
};
{
  const e = F(),
    t = (oe.x0 + oe.x1) / 2,
    o = oe.x1 - oe.x0;
  e.box(E("#2a3039", { roughness: 0.34 }), t, 0.18, 0, o, 0.36, 2.6, {
    r: 0.05,
  }).box(_("#11151b"), t, 0.03, 0, o - 0.3, 0.06, 2.3);
  const n = y.scale,
    a = oe.x + (oe.off.motor + y.xBack - 0.2) * n,
    s = 1.95 * n;
  {
    const f = [];
    for (let x = 0; x < 8; x++) {
      const g = ((x + 0.5) / 8) * Math.PI * 2;
      f.push([Math.cos(g) * s, Math.sin(g) * s]);
    }
    const h = new r.Shape(f.map(([x, g]) => new r.Vector2(x, g))),
      p = new r.Path(
        f.map(([x, g]) => new r.Vector2(x * 0.8, g * 0.8)).reverse(),
      );
    h.holes.push(p);
    const m = new r.ExtrudeGeometry(h, {
      depth: 0.34,
      bevelEnabled: !0,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 1,
    });
    (m.rotateY(Math.PI / 2),
      e.geo(E("#3a4049", { roughness: 0.34 }), m, a - 0.17, oe.y, 0));
    for (let x = 0; x < 8; x++) {
      const g = ((x + 0.5) / 8) * Math.PI * 2;
      e.cyl(
        A.hole,
        a + 0.19,
        oe.y + Math.sin(g) * s * 0.9,
        Math.cos(g) * s * 0.9,
        0.07,
        0.07,
        0.02,
        { rz: Math.PI / 2, seg: 14 },
      );
    }
    for (const x of [-1, 1])
      e.box(
        Yt,
        a,
        (0.36 + oe.y - s * 0.85) / 2,
        x * s * 0.55,
        0.34,
        oe.y - s * 0.85 - 0.36,
        0.3,
        { r: 0.03 },
      );
    e.box(gt, a, 0.42, 0, 0.9, 0.12, s * 1.6, { r: 0.03 });
  }
  for (const [f, h] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ])
    e.box(gt, a + 0.4, oe.y + f * 1.2 * n, h * 1.2 * n, 0.5, 0.12, 0.12, {
      r: 0.02,
    });
  for (const f of ["coil", "spider", "cone"])
    e.box(
      E("#4a515c", { roughness: 0.3 }),
      oe.x +
        (oe.off[f] +
          (f === "cone"
            ? y.rimX0 + 0.03
            : f === "spider"
              ? y.spX
              : (y.coil0 + y.coil1) / 2)) *
          y.scale,
      0.46,
      0,
      f === "cone" ? 1.1 : 0.75,
      0.2,
      0.75,
      { r: 0.03 },
    );
  e.flush(kt);
  const i = new r.Mesh(new r.BoxGeometry(o - 0.2, 0.04, 0.04), K("#ffab55", 4));
  (i.position.set(t, 0.34, 1.32), kt.add(i));
  const l = new r.Mesh(
    new r.BoxGeometry(o - 0.2, 0.04, 0.04),
    K("#ffab55", 2.4),
  );
  (l.position.set(t, 0.03, 1.2), kt.add(l), Qe(0, 0.6, 2.2, "#ffab55", 5, 0.7));
  const c = new r.MeshPhysicalMaterial({
    color: "#dff6ff",
    roughness: 0.06,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    transparent: !0,
    opacity: 0.34,
    envMapIntensity: 1.8,
    depthWrite: !1,
  });
  z.posts = [];
  for (let f = 0; f < 4; f++) {
    const h = new r.Mesh(new r.BoxGeometry(0.09, 1, 0.09), c);
    (kt.add(h), Lt.push(h), z.posts.push(h));
  }
  const u = fs(1.77, { k: 0.8 });
  (u.position.set(oe.x0 + 1.9, 0.19, 1.306), kt.add(u));
}
const gi = Hr(Oo, 0, 0, 0, 7.8, 4.2, 0.46);
G.traverse((e) => {
  e.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
});
const d = {
    T: 0,
    playing: !0,
    scrub: 0,
    rip: 1,
    ripT: 1,
    vol: 1,
    volT: 1,
    ex: 0,
    exT: 0,
    exag: 400,
    win: 1.2,
    winL: -1,
    q: 0,
    xVis: 0,
    sig: 1,
    hand: 0,
    paused: 0,
  },
  Pt = [0.01, 10],
  co = (e) => Math.log(e / Pt[0]) / Math.log(Pt[1] / Pt[0]),
  uo = (e) => Pt[0] * Math.pow(Pt[1] / Pt[0], B(e, 0, 1)),
  ys = [0.045, 0.006, 0.02],
  wi = 0.72;
let _t = 0.016,
  wa = 0.016,
  $ = 0,
  fo = !1,
  Ma = 0;
function Mi(e) {
  d.playing && !d.scrub && (d.T += e);
  const t = Math.log(d.vol);
  ((d.vol = Math.exp(
    t + (Math.log(d.volT) - t) * (1 - Math.exp(-e * (fo ? 18 : 7))),
  )),
    (P.vRms = Math.sqrt(d.vol * X.Re)),
    C.on || P.quiet
      ? (P.gainT = 0)
      : P.gainT === 0 && w.kN * w.DT > C.relAt + 0.5 && (P.gainT = 1),
    An(d.T));
  const o = w.kLo * w.DT - 2;
  for (; P.ev.length > 2 && P.ev[1].at < o;) P.ev.shift();
  const n = d.T - Ma;
  if (
    ((Ma = d.T),
    Math.abs(n) < 1 && (d.q += Ne(d.T).i * n),
    (d.sig = pi(d.T)),
    !C.on)
  ) {
    let s = 0;
    for (let c = 0; c < 48; c++)
      s = Math.max(s, Math.abs(Ne(d.T - c * 0.025).x));
    const i = Math.min(Y[d.sig].exag, (0.7 * to) / Math.max(s, 1e-9)),
      l = Math.log(d.exag);
    d.exag = Math.exp(
      l + (Math.log(i) - l) * (1 - Math.exp(-e * (i < d.exag ? 9 : 2.2))),
    );
  }
  ((d.ex += (d.exT - d.ex) * (1 - Math.exp(-e * 2.4))),
    (d.rip += (d.ripT - d.rip) * (1 - Math.exp(-e * 5))),
    (d.hand += ((C.on ? 1 : 0) - d.hand) * (1 - Math.exp(-e * 6))),
    (d.paused += ((d.playing ? 0 : 1) - d.paused) * (1 - Math.exp(-e * 8))),
    (d.win += (ys[d.sig] * q - d.win) * (1 - Math.exp(-e * 4))));
  const a = d.T - wi * d.win;
  ((d.winL < -0.5 || (d.playing && !d.scrub)) &&
    (d.winL += (a - d.winL) * (d.winL < -0.5 ? 1 : 1 - Math.exp(-e * 9))),
    (d.winL = B(d.winL, d.T - 0.97 * d.win, d.T - 0.03 * d.win)),
    xi(d.T));
}
const Ts = (() => {
  const e = y.xBack + 0.08,
    t = 1.45,
    o = y.rimX0,
    n = y.rimOut,
    a = Math.atan2(n - t, o - e);
  return { th: a, y: -(e * Math.sin(a) - t * Math.cos(a)) + 0.004 };
})();
function bi() {
  const e = k.cur;
  e === "lab"
    ? (G.position.set(...In), G.rotation.set(0, -bs, 0))
    : e === "exploded"
      ? (G.position.set(oe.x, oe.y, 0), G.rotation.set(0, 0, 0))
      : (G.position.set(-0.6, Ts.y, 0.1), G.rotation.set(0, -0.36, Ts.th));
}
function yi() {
  const e = Ct[k.cur],
    t = Ye(0, 1, d.ex),
    o = Ne(d.T);
  (bi(),
    G.updateMatrixWorld(),
    G.localToWorld(xa.p.set(y.mouth + 0.9, 0, 0)),
    (xa.i = xa.i0 * d.rip * (k.cur === "studio" ? 0.25 : 1)),
    G.localToWorld(va.p.set(2.6, 1.8, 3.2)),
    (va.i = k.cur === "lab" ? va.i0 : k.cur === "exploded" ? 0.6 : 0),
    (d.xVis = B((o.x * d.exag) / to, -1.25, 1.25)));
  const n = k.cur === "exploded",
    a = (c) => (n ? oe.off[c] * t : 0);
  ((Gt.position.x = a("motor")),
    (Yo.position.x = a("cone")),
    (ro.position.x = a("coil") + d.xVis),
    (dt.position.x = a("spider")),
    (Ge.position.x = a("cone") + d.xVis));
  const s = !!e.cut;
  ((Xe.front.visible =
    ke.front.visible =
    Tt.front.visible =
    St.front.visible =
    z.spF.visible =
    z.suF.visible =
    z.spRingF.visible =
      !s),
    (Xe.cut.visible =
      ke.cut.visible =
      Tt.cut.visible =
      St.cut.visible =
      z.spC.visible =
      z.suC.visible =
        s),
    (Xe.cage.visible = k.cur === "lab"),
    (ke.leads.visible = k.cur !== "exploded"));
  for (const [c, u] of ma) vi(c, u * d.xVis);
  if (((z.saddle.visible = k.cur === "lab"), n)) {
    const u = y.scale,
      f = [
        ["coil", (y.coil0 + y.coil1) / 2, -0.6],
        ["spider", y.spX, -y.spOut + 0.02],
        ["cone", y.rimX0 - 0.24, -y.rimOut + 0.03],
        ["cone", y.rimX0 + 0.3, -y.rimOut + 0.03],
      ];
    z.posts.forEach((h, p) => {
      const [m, x, g] = f[p],
        M = oe.y + g * u,
        b = Math.max(0.01, M - 0.56);
      ((h.scale.y = b),
        h.position.set(oe.x + (oe.off[m] * t + x) * u, 0.56 + b / 2, 0),
        (h.visible = t > 0.6));
    });
  }
  V.slider.set(co(d.vol));
  const i = (Y[d.sig].f0 * d.T) / q;
  ((V.jog.userData.cap.rotation.z = -(i % 1) * Math.PI * 2),
    (V.jog.userData.arc.rotation.z =
      Math.PI * 0.95 - (i % 1) * Math.PI * 2 * 0),
    V.jog.userData.arc.material.color
      .setRGB(1, 0.62, 0.25)
      .multiplyScalar(d.playing ? 3.2 : 1.1));
  const l = ct();
  if (
    (V.btns.forEach((c, u) => {
      const f = u === l,
        h = c.userData;
      ((h.l =
        (h.l ?? 0) + ((f ? 1 : 0) - (h.l ?? 0)) * (1 - Math.exp(-_t * 10))),
        h.arc.material.color
          .setRGB(1, 0.62, 0.25)
          .multiplyScalar(0.5 + h.l * 2.8),
        h.icon.material.color.setRGB(
          0.55 + h.l * 0.3,
          0.62 + h.l * 0.9,
          0.7 + h.l * 1.3,
        ),
        (h.cap.position.z = -0.03 * h.l));
    }),
    (zo.userData.cap.rotation.z +=
      ((-l * Math.PI * 2) / 3 - zo.userData.cap.rotation.z) *
      (1 - Math.exp(-_t * 10))),
    Fe.userData.led.material.color
      .setRGB(0.5, 1.1, 1.5)
      .multiplyScalar(d.playing && !C.on ? 2.4 : 0.5),
    ue.visible && (Ps(V.scope), Ps(ds)),
    $ - V.drawnAt > 0.012 && ((V.drawnAt = $), Ii()),
    $ - V.holoAt > 0.08 && ee.visible)
  ) {
    V.holoAt = $;
    let c = !1;
    for (let u = 0; u < 4; u++) {
      const f = Math.round(((0.08 + u * 0.16) / te.dMax) * (We - 1)),
        h = ft[f * 4] / Xo,
        p = B(0.35 + 0.9 * h, 0.15, 1.4) * (0.25 + 0.75 * d.rip);
      Math.abs(p - sa[u]) > 0.02 && ((sa[u] = p), (c = !0));
    }
    c && Cn.userData.redraw(Cn.userData.full);
  }
}
const V = { drawnAt: 0, holoAt: 0 },
  Ti = (e) =>
    ze(
      160,
      160,
      (t, o, n) => {
        (t.clearRect(0, 0, o, n),
          (t.strokeStyle = "#fff"),
          (t.lineWidth = 11),
          (t.lineCap = "round"),
          (t.lineJoin = "round"),
          t.beginPath());
        for (let a = 26; a <= 134; a += 2) {
          const s = (a - 26) / 108;
          let i;
          if (e === 0) i = Math.sin(s * Math.PI * 2) * 30;
          else if (e === 1) i = Math.sin(s * Math.PI * 6) * 26;
          else {
            const l = (s * 3) % 1;
            i =
              Math.exp(-l * 5) * Math.cos(l * 28) * 34 +
              Math.sin(s * Math.PI * 6) * 6;
          }
          a === 26 ? t.moveTo(a, 80 - i) : t.lineTo(a, 80 - i);
        }
        t.stroke();
      },
      !0,
    );
function Si(e, t, o) {
  const n = new r.Group();
  (n.position.set(e, t, 0.03), ie.add(n));
  const a = 0.27,
    s = new r.Mesh(new r.CylinderGeometry(a * 1.02, a * 1.06, 0.06, 48), he);
  ((s.rotation.x = Math.PI / 2), (s.position.z = 0.02), n.add(s));
  const i = new r.Group();
  n.add(i);
  const l = new r.Mesh(
    new r.CylinderGeometry(a * 0.9, a * 0.92, 0.16, 48),
    E("#b9c1cc", { roughness: 0.22, metalness: 1 }),
  );
  ((l.rotation.x = Math.PI / 2), (l.position.z = 0.1), i.add(l));
  const c = new r.Mesh(
    new r.CircleGeometry(a * 0.88, 48),
    new r.MeshStandardMaterial({
      map: ra,
      roughness: 0.2,
      metalness: 1,
      envMapIntensity: 1.3,
    }),
  );
  ((c.position.z = 0.181), i.add(c));
  const u = new r.Mesh(
    new r.PlaneGeometry(a * 1.2, a * 1.2),
    new r.MeshBasicMaterial({
      map: Ti(o),
      transparent: !0,
      alphaTest: 0.35,
      fog: !1,
      color: new r.Color(0.6, 0.65, 0.7),
    }),
  );
  ((u.position.z = 0.186), i.add(u));
  const f = new r.Mesh(
    new r.TorusGeometry(a * 1.18, 0.014, 6, 64),
    K("#ffb454", 0.7),
  );
  ((f.position.z = 0.012), n.add(f));
  const h = new r.Mesh(
    new r.TorusGeometry(a * 1.18, 0.026, 8, 40, Math.PI * 0.9),
    K("#ffb454", 2),
  );
  return (
    (h.rotation.z = Math.PI * 1.05),
    (h.position.z = 0.016),
    n.add(h),
    (n.userData = { cap: i, icon: u, arc: h, ring: f, i: o }),
    n
  );
}
{
  (Rn(-4.95, 2.3),
    Rn(-1.55, 4.35),
    Rn(1.95, 2.85),
    Rn(4.85, 2.65),
    (V.jog = us(-4.95, Ve * 0.52, { r: 0.44, ring: "#ffb454" })),
    (V.scope = ks(ie, -1.55, Ve * 0.53, 0.036, 4.12, Ve * 0.64, 1100, {})),
    (V.screen = V.scope.scr),
    (V.slider = si(0.9, 3, Ve * 0.6, { chev: !1 })),
    (V.btns = [0, 1, 2].map((t) => Si(4.05 + t * 0.8, Ve * 0.56, t))));
  const e = (t, o, n, a = 1.2) => {
    const s = Qt(
      a,
      0.12,
      512,
      52,
      (i, l, c) => {
        ((i.fillStyle = "#9aa3b3"),
          (i.font = "600 30px DM Mono, monospace"),
          (i.letterSpacing = "3px"),
          (i.textAlign = "center"),
          (i.textBaseline = "middle"),
          i.fillText(n, l / 2, c / 2));
      },
      0.5,
      { alphaTest: 0.3 },
    );
    (s.position.set(t, o, 0.012), ie.add(s));
  };
  (e(-4.95, Ve * 0.14, "JOG \xB7 SCRUB"),
    e(1.95, Ve * 0.14, "VOLUME"),
    ["BASS", "TONE", "VOICE"].forEach((t, o) =>
      e(4.05 + o * 0.8, Ve * 0.18, t, 0.7),
    ),
    ii(-1.55, 0.085, 1.55));
}
const ba = (e, t) => {
    for (const o of t) if (o >= e) return o;
    return t[t.length - 1];
  },
  Ss = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
  ki = [0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
  ho = (e) => {
    const t = e * 1e3;
    return t < 10 ? t.toFixed(2) : t < 100 ? t.toFixed(1) : Math.round(t) + "";
  };
function Pi(e, t, o, n) {
  if (((e.fillStyle = "#07121e"), e.fillRect(0, 0, t, o), !Ao.ready)) return;
  const a = d.win,
    s = d.winL,
    i = w.kN * w.DT,
    l = d.sig,
    c = ut,
    u = ba(c.vPk / 1.8, Ss),
    f = ba((c.xPk * 1e3) / 1.8, ki),
    h = o / 4;
  ((e.lineWidth = 2), (e.strokeStyle = "rgba(110,190,235,.15)"));
  for (let I = 1; I < 10; I++) {
    const O = (I * t) / 10;
    (e.beginPath(), e.moveTo(O, 0), e.lineTo(O, o), e.stroke());
  }
  for (let I = 1; I < 4; I++)
    (e.beginPath(), e.moveTo(0, I * h), e.lineTo(t, I * h), e.stroke());
  ((e.strokeStyle = "rgba(120,200,240,.3)"),
    e.beginPath(),
    e.moveTo(0, o / 2),
    e.lineTo(t, o / 2),
    e.stroke());
  const p = Math.round(t / 3),
    m = ((d.T - s) / a) * t,
    x = (I, O, H, me, Ke, Ee, Xt) => {
      ((e.strokeStyle = O),
        (e.globalAlpha = Xt),
        (e.lineWidth = H),
        (e.shadowColor = O),
        (e.shadowBlur = me),
        e.beginPath());
      let le = !1;
      for (let de = 0; de <= p; de++) {
        const ae = (de / p) * t;
        if (Ee ? ae > m + 1 : ae < m - 1) continue;
        const we = s + (a * de) / p,
          Ce = I(we, we <= i);
        if (Ce === null) {
          le = !1;
          continue;
        }
        const Re = o / 2 - (Ce / Ke) * h;
        le ? e.lineTo(ae, Re) : (e.moveTo(ae, Re), (le = !0));
      }
      (e.stroke(), (e.shadowBlur = 0), (e.globalAlpha = 1));
    },
    g = (I, O) => (O ? Ne(I).v : no(I) * P.gain);
  (x(g, "#8fecff", n.gen ? 5 : 6, 18, u, !0, 1),
    x(g, "#8fecff", n.gen ? 4 : 4.5, 8, u, !1, 0.38),
    (e.strokeStyle = d.playing ? "rgba(230,248,255,.55)" : "#ffc57a"),
    (e.lineWidth = d.playing ? 2.5 : 4),
    e.beginPath(),
    e.moveTo(m, 6),
    e.lineTo(m, o - 6),
    e.stroke());
  const M = o / 2 - (g(d.T, d.T <= i) / u) * h;
  ((e.fillStyle = "#ffffff"),
    (e.shadowColor = "#8fecff"),
    (e.shadowBlur = 18),
    e.beginPath(),
    e.arc(m, M, n.gen ? 9 : 10, 0, 7),
    e.fill(),
    (e.shadowBlur = 0));
  const b = Math.round(o * (n.gen ? 0.07 : 0.1));
  ((e.font = `500 ${b}px DM Mono, monospace`),
    (e.textBaseline = "top"),
    (e.fillStyle = "#b9e9ff"),
    (e.textAlign = "left"));
  const S = Y[l],
    Z = l === 2 ? ' \xB7 "' + Ze[oo(d.T).i].v + '"' : "";
  n.card ||
    (e.fillText(
      S.name.toUpperCase() + "  " + S.f0 + " Hz" + Z,
      b * 0.8,
      b * 0.6,
    ),
    (e.textAlign = "right"),
    (e.fillStyle = "#8fb4c9"),
    e.fillText(
      u + " V/div \xB7 " + ho(a / q / 10) + " ms/div",
      t - b * 0.8,
      b * 0.6,
    ),
    n.gen &&
      d.playing &&
      ((e.textBaseline = "bottom"),
      (e.textAlign = "right"),
      (e.fillStyle = "#b9e9ff"),
      e.fillText(
        "OUT " + P.vRms.toFixed(2) + " V rms",
        t - b * 0.8,
        o - b * 0.5,
      )),
    d.playing ||
      ((e.textBaseline = "bottom"),
      (e.textAlign = "left"),
      (e.fillStyle = "#ffc57a"),
      e.fillText(
        "\u275A\u275A t = " + ho(d.T / q) + " ms \xB7 drag to scrub",
        b * 0.8,
        o - b * 0.5,
      )));
}
function ks(e, t, o, n, a, s, i, l) {
  const c = Math.round((i * s) / a),
    u = document.createElement("canvas");
  ((u.width = i), (u.height = c));
  const f = u.getContext("2d"),
    h = new r.CanvasTexture(u);
  ((h.colorSpace = r.SRGBColorSpace),
    (h.anisotropy = 8),
    (h.repeat.x = 1 / Io));
  const p = new r.Mesh(
    new r.PlaneGeometry(a, s),
    new r.MeshBasicMaterial({
      map: h,
      fog: !1,
      color: new r.Color(1.6, 1.6, 1.6),
    }),
  );
  (p.position.set(t, o, n), e.add(p));
  const m = Qt(a, s, i, c, null, 1.25, {
    alphaTest: 0,
    transparent: !0,
    depthWrite: !1,
  });
  (m.position.set(t, o, n + 0.004), e.add(m));
  const x = new r.Group();
  (x.position.set(t, o, n + 0.007), e.add(x));
  const g = new r.Mesh(
    new r.PlaneGeometry(a * 0.004, s * 0.94),
    new r.MeshBasicMaterial({
      color: new r.Color(1.6, 1.75, 1.9),
      transparent: !0,
      opacity: 0.6,
      depthWrite: !1,
      fog: !1,
    }),
  );
  x.add(g);
  const M = new r.Mesh(new r.CircleGeometry(s * 0.045, 24), K("#dff8ff", 3));
  ((M.position.z = 0.002), x.add(M));
  const b = new r.Mesh(new r.CircleGeometry(s * 0.11, 24), Vr("#7fe3ff", 0.55));
  ((b.position.z = -0.001), M.add(b));
  const S = new r.Mesh(
    new r.PlaneGeometry(1, s),
    new r.MeshBasicMaterial({
      color: "#050b14",
      transparent: !0,
      opacity: 0.7,
      depthWrite: !1,
      fog: !1,
    }),
  );
  return (
    (S.position.z = -0.002),
    x.add(S),
    Lt.push(m, g, b, S),
    {
      scr: p,
      ov: m,
      ph: x,
      line: g,
      dot: M,
      dim: S,
      g: f,
      t: h,
      c: u,
      cw: i,
      ch: c,
      w: a,
      h: s,
      o: l,
      L0: 0,
      W: 1,
      at: -9,
      key: "",
    }
  );
}
function Ln() {
  return { vDiv: ba(ut.vPk / 1.8, Ss) };
}
function Ci(e) {
  const { g: t, cw: o, ch: n } = e,
    a = d.win,
    s = d.winL,
    i = w.kN * w.DT,
    { vDiv: l } = Ln(),
    c = n / 4,
    u = a * Io;
  if (
    ((e.L0 = s),
    (e.W = a),
    (e.at = $),
    (e.vDiv = l),
    (t.fillStyle = "#07121e"),
    t.fillRect(0, 0, o, n),
    !Ao.ready)
  ) {
    e.t.needsUpdate = !0;
    return;
  }
  const f = Math.round(o / 2.5);
  ((t.lineJoin = "round"),
    ((p, m, x) => {
      ((t.strokeStyle = "#8fecff"),
        (t.globalAlpha = x),
        (t.lineWidth = p),
        (t.shadowColor = "#5fd6ff"),
        (t.shadowBlur = m),
        t.beginPath());
      for (let g = 0; g <= f; g++) {
        const M = s + (u * g) / f,
          b = M <= i ? Ne(M).v : no(M) * P.gain,
          S = (g / f) * o,
          Z = n / 2 - (b / l) * c;
        g ? t.lineTo(S, Z) : t.moveTo(S, Z);
      }
      t.stroke();
    })(e.o.gen ? 5 : 6, 18, 1),
    (t.shadowBlur = 0),
    (t.globalAlpha = 1),
    (e.t.needsUpdate = !0));
}
function Ri(e, t) {
  const { cw: o, ch: n, o: a } = e;
  ((e.key = t),
    e.ov.userData.redraw((s) => {
      const i = n / 4;
      ((s.lineWidth = 2), (s.strokeStyle = "rgba(110,190,235,.16)"));
      for (let f = 1; f < 10; f++) {
        const h = (f * o) / 10;
        (s.beginPath(), s.moveTo(h, 0), s.lineTo(h, n), s.stroke());
      }
      for (let f = 1; f < 4; f++)
        (s.beginPath(), s.moveTo(0, f * i), s.lineTo(o, f * i), s.stroke());
      if (
        ((s.strokeStyle = "rgba(120,200,240,.3)"),
        s.beginPath(),
        s.moveTo(0, n / 2),
        s.lineTo(o, n / 2),
        s.stroke(),
        !Ao.ready)
      )
        return;
      const l = Y[d.sig],
        c = d.sig === 2 ? ' \xB7 "' + Ze[oo(d.T).i].v + '"' : "",
        u = Math.round(n * (a.gen ? 0.07 : 0.1));
      if (
        ((s.font = `500 ${u}px DM Mono, monospace`),
        (s.textBaseline = "top"),
        (s.textAlign = "left"),
        (s.fillStyle = "#b9e9ff"),
        s.fillText(
          l.name.toUpperCase() + "  " + l.f0 + " Hz" + c,
          u * 0.8,
          u * 0.6,
        ),
        (s.textAlign = "right"),
        (s.fillStyle = "#8fb4c9"),
        s.fillText(
          Ln().vDiv + " V/div \xB7 " + ho(d.win / q / 10) + " ms/div",
          o - u * 0.8,
          u * 0.6,
        ),
        (s.textBaseline = "bottom"),
        a.gen &&
          d.playing &&
          ((s.textAlign = "right"),
          (s.fillStyle = "#b9e9ff"),
          s.fillText(
            "OUT " + P.vRms.toFixed(2) + " V rms",
            o - u * 0.8,
            n - u * 0.5,
          )),
        !d.playing)
      ) {
        const f = "\u275A\u275A t = " + ho(d.T / q) + " ms \xB7 drag to scrub",
          h = s.measureText(f).width;
        ((s.fillStyle = "rgba(5,10,18,.78)"),
          na(s, u * 0.45, n - u * 1.75, h + u * 0.7, u * 1.4, u * 0.4),
          s.fill(),
          (s.textAlign = "left"),
          (s.fillStyle = "#ffc57a"),
          s.fillText(f, u * 0.8, n - u * 0.5));
      }
    }));
}
function Ps(e) {
  if (!Ao.ready) return;
  const t = d.win,
    o = e.W * Io;
  let n = (d.winL - e.L0) / o;
  (($ - e.at > 0.05 ||
    n < 0 ||
    n > 1 - 1 / Io - 0.005 ||
    Math.abs(t - e.W) > e.W * 0.004 ||
    Ln().vDiv !== e.vDiv) &&
    (Ci(e), (n = 0)),
    (e.t.offset.x = n),
    (e.t.repeat.x = d.win / (e.W * Io)));
  const a = (d.T - d.winL) / d.win,
    s = (a - 0.5) * e.w,
    { vDiv: i } = Ln(),
    l = w.kN * w.DT,
    c = d.T <= l ? Ne(d.T).v : no(d.T) * P.gain;
  ((e.ph.position.x = e.scr.position.x + s),
    (e.dot.position.y = B(c / i / 4, -0.49, 0.49) * e.h),
    e.dot.children,
    e.line.material.color
      .setRGB(1, 1, 1)
      .multiplyScalar(d.playing ? 1.5 : 1)
      .lerp(Di.setRGB(1.9, 1.25, 0.55), d.playing ? 0 : 1),
    (e.line.material.opacity = d.playing ? 0.55 : 0.9));
  const u = Math.max(0.001, (1 - a) * e.w);
  ((e.dim.scale.x = u),
    (e.dim.position.x = u / 2),
    (e.dim.visible = a < 0.999));
  const f =
    d.sig +
    "|" +
    (d.sig === 2 ? oo(d.T).i : "") +
    "|" +
    i +
    "|" +
    d.win.toFixed(2) +
    "|" +
    d.playing +
    "|" +
    (d.playing ? "" : ho(d.T / q)) +
    "|" +
    P.vRms.toFixed(2);
  f !== e.key && $ - (e.keyAt || 0) > 0.05 && ((e.keyAt = $), Ri(e, f));
}
const Di = new r.Color(),
  po = T("#scrub-c"),
  Ai = po.getContext("2d");
function Ii() {
  const e = po.getBoundingClientRect(),
    t = Math.min(2, devicePixelRatio || 1),
    o = Math.round(e.width * t),
    n = Math.round(e.height * t);
  !o ||
    !n ||
    ((po.width !== o || po.height !== n) && ((po.width = o), (po.height = n)),
    Pi(Ai, o, n, { card: 1 }));
}
const Cs = { room: ee, bench: ue, stage: Vo, studioSet: Oo, exBase: kt },
  Ct = {
    lab: {
      bg: "#10151f",
      fog: "#1a2130",
      fogD: 0.0065,
      tone: r.ACESFilmicToneMapping,
      exp: 1.12,
      env: "show",
      envI: 0.75,
      bloomT: 1.05,
      bloomS: 0.42,
      refl: 0.5,
      hemi: [9414360, 3025446, 0.55],
      sun: [16761994, 2.3],
      sunDir: [0.72, 0.5, -0.3],
      rim: 1,
      key2: 0.85,
      satK: 1.14,
      show: { room: 1, bench: 1, stage: 0, studioSet: 0, exBase: 0 },
      ex: 0,
      cut: 1,
      dMax: 4.9,
      dofK: 0.5,
      light: 0,
      veil: "#0b0f1a",
    },
    exploded: {
      bg: "#0a1430",
      fog: "#0c1834",
      fogD: 0.006,
      tone: r.ACESFilmicToneMapping,
      exp: 1.05,
      env: "show",
      envI: 0.85,
      bloomT: 1,
      bloomS: 0.5,
      refl: 0.4,
      hemi: [8362712, 1844278, 0.55],
      sun: [16765600, 1.6],
      sunDir: [0.5, 0.7, 0.5],
      rim: 1.3,
      key2: 0.7,
      satK: 1,
      show: { room: 0, bench: 0, stage: 1, studioSet: 0, exBase: 1 },
      ex: 1,
      cut: 0,
      dMax: 5.4,
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
      show: { room: 0, bench: 0, stage: 0, studioSet: 1, exBase: 0 },
      ex: 0,
      cut: 0,
      dMax: 4.3,
      light: 1,
      veil: "#efe7dc",
    },
  },
  k = { cur: "lab", next: null, at: -99, out: -99, cam: null };
function ya() {
  const e = Ct[k.cur];
  (se.background.set(e.bg),
    se.fog.color.set(e.fog),
    (se.fog.density = e.fogD * v.fog),
    (N.toneMapping = e.tone),
    (N.toneMappingExposure = v.exposure * e.exp),
    (se.environment = vn[e.env]),
    (se.environmentIntensity = v.env * e.envI),
    (st.threshold = v.bloomThreshold * e.bloomT),
    (st.strength = v.bloomStrength * e.bloomS),
    (gn.uReflStrength.value = v.reflect * e.refl),
    mn.color.set(e.hemi[0]),
    mn.groundColor.set(e.hemi[1]),
    (mn.intensity = e.hemi[2] * v.fill),
    re.color.set(e.sun[0]),
    (re.intensity = e.sun[1] * v.sun),
    re.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    (Yn.intensity = e.rim * v.rim),
    (Qn.intensity = e.key2 * v.fill),
    (ja.value = v.sat * e.satK));
  for (const t in Cs) Cs[t].visible = !!e.show[t];
  (Oe.setLight(e.light),
    Fi(e.light),
    dn.classList.toggle("light", !!e.light),
    (te.dMax = e.dMax),
    (gi.visible = k.cur === "studio"),
    La.forEach((t) =>
      t.classList.toggle("on", t.dataset.v === (k.next || k.cur)),
    ));
}
function Rt(e, t = !1, o = null) {
  if (Ct[e]) {
    if (t) {
      ((k.cur = e),
        (k.next = null),
        ya(),
        (d.exT = Ct[e].ex),
        (d.ex = e === "exploded" ? 0 : d.exT),
        yo(o || pt[e]));
      return;
    }
    if (e === k.cur && !k.next) {
      o && yo(o);
      return;
    }
    ((k.next = e),
      (k.at = $),
      (k.cam = o),
      (T("#veil").style.background = Ct[e].veil),
      La.forEach((n) => n.classList.toggle("on", n.dataset.v === e)));
  }
}
function Bi() {
  const e = T("#veil");
  let t = 0;
  if (k.next) {
    const o = $ - k.at;
    ((t = B(o / 0.2, 0, 1)),
      o >= 0.2 &&
        ((k.cur = k.next),
        (k.next = null),
        ya(),
        (d.exT = Ct[k.cur].ex),
        (d.ex = 0),
        yo(k.cam || pt[k.cur]),
        (k.cam = null),
        (k.out = $),
        (t = 1)));
  } else t = 1 - B(($ - k.out) / 0.4, 0, 1);
  e.style.opacity = t.toFixed(3);
}
const Rs = 20,
  Ds = [0, 30],
  Qo = 72,
  Et = y.mouth - 0.9,
  Ta = (() => {
    const e = new r.InstancedBufferGeometry(),
      t = [],
      o = [],
      n = Ds[0] + Ds[1];
    for (let a = 0; a <= n; a++)
      for (let s = 0; s <= Qo; s++) t.push(a / n, s / Qo, 0);
    for (let a = 0; a < n; a++)
      for (let s = 0; s < Qo; s++) {
        const i = a * (Qo + 1) + s,
          l = i + Qo + 1;
        o.push(i, l, i + 1, l, l + 1, i + 1);
      }
    return (
      e.setAttribute("position", new r.Float32BufferAttribute(t, 3)),
      e.setIndex(o),
      e.setAttribute(
        "aRing",
        new r.InstancedBufferAttribute(new Float32Array(Rs * 2), 2).setUsage(
          r.DynamicDrawUsage,
        ),
      ),
      (e.instanceCount = 0),
      e
    );
  })(),
  Zo = {
    ...yn,
    uX0: { value: Et },
    uTh: { value: 0.66 },
    uLight: { value: 0 },
    uCol: { value: new r.Color(0.2, 0.46, 1.7) },
    uK: { value: 1 },
    uDMax: { value: 8 },
    uD0: { value: 0.9 },
    uFloor: { value: -99 },
  },
  As = new r.ShaderMaterial({
    uniforms: Zo,
    transparent: !0,
    depthTest: !1,
    depthWrite: !1,
    blending: r.AdditiveBlending,
    side: r.DoubleSide,
    vertexShader: `attribute vec2 aRing;uniform float uX0,uTh,uDMax,uD0,uFloor;varying vec3 vN,vV;varying float vE,vAmp,vD,vIn;
 void main(){float al=position.x*uTh,ph=position.y*6.2831853,d=max(aRing.x,.001);
  vec3 n=vec3(cos(al),sin(al)*-sin(ph),sin(al)*cos(ph)),p=vec3(uX0,0.,0.)+n*d;
  vec4 wp=modelMatrix*vec4(p,1.);vN=normalize(mat3(modelMatrix)*n);vV=cameraPosition-wp.xyz;vE=position.x;vAmp=aRing.y;vD=d/uDMax;vIn=smoothstep(uD0,uD0+.35,d)*smoothstep(uFloor,uFloor+.9,wp.y);
  gl_Position=projectionMatrix*viewMatrix*wp;}`,
    fragmentShader: `${oa}uniform vec3 uCol;uniform float uLight,uK;varying vec3 vN,vV;varying float vE,vAmp,vD,vIn;
 void main(){float f=1.-abs(dot(normalize(vN),normalize(vV)));
  float q1=(vE-.93)/.035,q2=(vE-.93)/.12;float fill=.045+f*f*f*1.1,band=exp(-q1*q1)*1.35+exp(-q2*q2)*.3;
  float a=clamp(vAmp,0.,1.5)*(fill*(1.-smoothstep(.9,.99,vE))+band)*vIn*(1.-smoothstep(.78,1.,vD))*uK*ovVis(.5);
  if(uLight>.5){float e2=clamp(band*.8,0.,1.);gl_FragColor=vec4(mix(vec3(.9,.95,1.),vec3(.25,.48,.98),e2),clamp(a*.85+fill*.25*vIn,0.,.8));}else gl_FragColor=vec4(uCol*a,1.);}`,
  }),
  mo = new r.Mesh(Ta, As);
((mo.frustumCulled = !1),
  (mo.matrixAutoUpdate = !1),
  (mo.renderOrder = 2),
  Kt.add(mo));
const Fn = 2200,
  Is = 0.9,
  Li = (() => {
    const e = new r.BufferGeometry(),
      t = new Float32Array(Fn * 3),
      o = new Float32Array(Fn * 4),
      n = new Float32Array(Fn),
      a = De(77),
      s = 7.2,
      i = y.mouth - Et;
    let l = 0;
    for (; l < Fn;) {
      const c = i + 0.05 + a() * (s - i),
        u = (a() * 2 - 1) * s * 0.75,
        f = (a() * 2 - 1) * Is,
        h = Math.hypot(c, u, f),
        p = Math.acos(c / h);
      h > s ||
        p > 0.7 ||
        (t.set([c, u, f], l * 3),
        o.set([c / h, u / h, f / h, h], l * 4),
        (n[l] = a()),
        l++);
    }
    return (
      e.setAttribute("position", new r.BufferAttribute(t, 3)),
      e.setAttribute("aN", new r.BufferAttribute(o, 4)),
      e.setAttribute("aS", new r.BufferAttribute(n, 1)),
      e
    );
  })(),
  zt = {
    ...yn,
    tField: { value: ha },
    uD0: { value: 0.9 },
    uFloor: { value: -99 },
    uDMax: { value: 8 },
    uX0: { value: Et },
    uXi: { value: 1.35 },
    uPref: { value: Xo },
    uK: { value: 1 },
    uPx: { value: 500 },
    uSize: { value: 0.036 },
    uT: { value: 0 },
    uLight: { value: 0 },
    uZ: { value: Is },
  },
  Bs = new r.ShaderMaterial({
    uniforms: zt,
    transparent: !0,
    depthTest: !1,
    depthWrite: !1,
    blending: r.AdditiveBlending,
    vertexShader: `attribute vec4 aN;attribute float aS;uniform sampler2D tField;uniform float uDMax,uX0,uXi,uPref,uPx,uSize,uT,uZ,uD0,uFloor;varying float vB,vA;
 vec2 fld(float d){float u=clamp(d/uDMax,0.,1.)*${We - 1}.;float i=floor(u);vec4 a=texture2D(tField,vec2((i+.5)/${We}.,.5)),b=texture2D(tField,vec2((min(i+1.,${We - 1}.)+.5)/${We}.,.5));return mix(a.xy,b.xy,u-i);}
 void main(){float d=aN.w;vec2 f=fld(d);float spread=1./(1.+d/3.2);
  float xi=clamp(f.y*uXi*spread,-.7,.7);
  vec3 drift=vec3(sin(uT*.21+aS*40.),sin(uT*.17+aS*23.),cos(uT*.19+aS*31.))*.035;
  vec3 p=position+vec3(uX0,0.,0.)+aN.xyz*xi+drift;
  vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float wy=(modelMatrix*vec4(p,1.)).y;
  float pn=clamp(f.x/uPref*spread*1.6,-1.,1.6);vB=.3+.7*max(pn,0.)-.2*max(-pn,0.);
  vA=(1.-smoothstep(.5,1.,abs(position.z)/uZ))*smoothstep(uD0,uD0+.5,d)*(1.-smoothstep(.8,1.,d/uDMax))*(1.-smoothstep(.45,.7,acos(clamp(aN.x,-1.,1.))))*smoothstep(uFloor,uFloor+.7,wy);
  gl_PointSize=uSize*uPx/max(-mv.z,.1)*(.75+.5*aS)*(1.+.35*max(pn,0.));}`,
    fragmentShader: `${oa}uniform float uK,uLight;varying float vB,vA;
 void main(){vec2 q=gl_PointCoord-.5;float r=dot(q,q)*4.;if(r>1.)discard;float a=(1.-r)*(1.-r)*vA*uK*ovVis(.4);
  if(uLight>.5)gl_FragColor=vec4(vec3(.1,.32,.6)*(.5+vB*.6),clamp(a*vB*.9,0.,.8));else gl_FragColor=vec4(vec3(.42,.72,1.3)*vB*a*.95,1.);}`,
  }),
  xo = new r.Points(Li, Bs);
((xo.frustumCulled = !1),
  (xo.matrixAutoUpdate = !1),
  (xo.renderOrder = 1),
  Kt.add(xo));
function Fi(e) {
  for (const t of [As, Bs])
    ((t.uniforms.uLight.value = e ? 1 : 0),
      (t.blending = e ? r.NormalBlending : r.AdditiveBlending),
      (t.needsUpdate = !0));
}
const Gi = (e) =>
    Object.assign(
      (t) => {
        (Object.assign(t.uniforms, e),
          (t.vertexShader = t.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
varying float vCu;`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
vCu=uv.x;`,
            )),
          (t.fragmentShader = t.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
uniform float uOff;varying float vCu;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
  {float q=fract(vCu*22.-uOff);float dash=smoothstep(.0,.06,q)*(1.-smoothstep(.12,.2,q));totalEmissiveRadiance+=vec3(1.,.7,.4)*dash*.3;}`,
            )));
      },
      { key: "cable" },
    ),
  Ls = [];
function _i() {
  (G.position.set(...In),
    G.rotation.set(0, -bs, 0),
    G.updateMatrixWorld(!0),
    Fe.updateMatrixWorld(!0),
    [
      [-0.22, 0.18, 1],
      [0.22, -0.2, -1],
    ].forEach(([e, t, o]) => {
      const n = Fe.localToWorld(
          new r.Vector3(W.w / 2 + 0.26, W.h / 2 + 0.62, t),
        ),
        a = G.localToWorld(new r.Vector3(y.xBack - 0.47, 0, e)),
        s = G.localToWorld(new r.Vector3(y.xBack - 0.9, 0, e * 1.15)),
        i = n.clone().lerp(s, 0.5);
      i.y += 0.12;
      const l = new r.CatmullRomCurve3(
          [n, n.clone().add(new r.Vector3(0.5, 0.02, 0)), i, s, a],
          !1,
          "centripetal",
        ),
        c = { uOff: { value: 0 } },
        u = nt(
          new r.MeshPhysicalMaterial({
            color: o > 0 ? "#c9763f" : "#b7bcc4",
            metalness: 1,
            roughness: 0.26,
            clearcoat: 0.6,
            clearcoatRoughness: 0.2,
            envMapIntensity: 1.3,
          }),
          Gi(c),
        );
      ((u.userData.u = c), (u.userData.sign = o));
      const f = new r.Mesh(new r.TubeGeometry(l, 90, 0.06, 10, !1), u);
      ((f.castShadow = !0), (f.receiveShadow = !0), ue.add(f), Ls.push(f));
    }));
}
const ve = { coil: No(), cone: No(), air: No(), magnet: No(), spider: No() },
  pe = new r.Vector3(),
  Je = new r.Vector3(),
  Ei = new r.Vector2(),
  Pl = new r.Vector3(),
  ht = [],
  Sa = Array.from({ length: 256 }, () => new r.Vector3()),
  Fs = new r.Color(0.18, 0.46, 2.1),
  ka = new r.Color(1.7, 0.95, 0.4),
  zi = new r.Color(0.5, 0.9, 1.5),
  Vi = new r.Color(0.45, 0.8, 1.6),
  fe = (e, t, o, n) => G.localToWorld(n.set(e, t, o)),
  Jo = (e, t) => (e >= 0 ? "+" : "\u2212") + Math.abs(e).toFixed(t);
let Gs = -9;
function Oi(e) {
  Oe.begin();
  const t = k.cur,
    o = t === "exploded",
    n = t === "lab",
    a = Ye(0, 1, d.ex),
    s = Ne(d.T);
  G.updateMatrixWorld(!0);
  const i = Ge.position.x - d.xVis,
    l = y.mouth + i,
    c = Ta.attributes.aRing,
    u = d.rip;
  let f = 0;
  if (u > 0.01)
    for (let I = 0; I < te.nC && f < Rs; I++) {
      const O = te.crests[I];
      ((c.array[f * 2] = O.d),
        (c.array[f * 2 + 1] = Math.min(
          1.5,
          ((O.a / Xo) * 1.1) / (1 + O.d / 6),
        )),
        f++);
    }
  ((Ta.instanceCount = f),
    (c.needsUpdate = !0),
    (mo.visible = f > 0),
    mo.matrix.copy(G.matrixWorld));
  const h = n ? xe + 0.25 : o ? 0.45 : -0.2;
  ((Zo.uFloor.value = zt.uFloor.value = h),
    (Zo.uX0.value = Et + i),
    (Zo.uK.value = u),
    (Zo.uDMax.value = te.dMax),
    xo.matrix.copy(G.matrixWorld),
    (zt.uX0.value = Et + i),
    (zt.uDMax.value = te.dMax),
    (zt.uK.value = u),
    (zt.uT.value = d.T),
    (xo.visible = u > 0.01),
    (zt.uPx.value =
      N.getDrawingBufferSize(Ei).y /
      (2 * Math.tan(r.MathUtils.degToRad(D.fov / 2)))));
  const p = Gt.position.x,
    m = o ? 0.55 + 0.45 * a : n ? 0.55 : 0;
  if (m > 0.01) {
    const I = n
        ? [Math.PI * 0.5, Math.PI * 1.5]
        : [0, 1, 2, 3, 4, 5, 6, 7].map((me) => ((me + 0.5) / 8) * Math.PI * 2),
      O = o ? [0.74, 0.9, 1.08, 1.26] : [0.76, 0.92, 1.1, 1.28],
      H = o ? [0.2, 0.38, 0.58, 0.8] : [0.12, 0.2, 0.3, 0.42];
    for (const me of I) {
      const Ke = Math.cos(me),
        Ee = -Math.sin(me),
        Xt = n ? 0.03 : 0;
      for (let le = 0; le < O.length; le++) {
        ht.length = 0;
        const de = [p + 0, O[le]],
          ae = [p + 0.09, 0.58],
          we = [(de[0] + ae[0]) / 2, (de[1] + ae[1]) / 2],
          Ce = [(ae[0] - de[0]) / 2, (ae[1] - de[1]) / 2],
          Re = Math.hypot(...Ce),
          At = [-Ce[1] / Re, Ce[0] / Re],
          Do = At[0] < 0 ? [-At[0], -At[1]] : At;
        for (let Ut = 0; Ut <= 20; Ut++) {
          const un = (Ut / 20) * Math.PI,
            fr = we[0] - Math.cos(un) * Ce[0] + Math.sin(un) * H[le] * Do[0],
            Wa = we[1] - Math.cos(un) * Ce[1] + Math.sin(un) * H[le] * Do[1];
          ht.push(fe(fr, Ee * Wa, Ke * Wa + Xt, Sa[Ut]));
        }
        Oe.line(
          ht,
          o ? 3.4 : 1.9,
          Fs,
          (Ut) =>
            m *
            (0.3 + 0.7 * Math.sin(Ut * Math.PI)) *
            (0.8 + 0.2 * Math.sin(e * 1.3 + le + me)),
        );
      }
      if (o)
        for (let le = 0; le < 2; le++) {
          ht.length = 0;
          const de = 0.38 + le * 0.3;
          for (let ae = 0; ae <= 20; ae++) {
            const we = (ae / 20) * Math.PI,
              Ce = p + qt(-0.02, y.xBack + 0.06, 0.5 - 0.5 * Math.cos(we)),
              Re = 1.46 + Math.sin(we) * de;
            ht.push(fe(Ce, Ee * Re, Ke * Re, Sa[ae]));
          }
          Oe.line(
            ht,
            1.5,
            Fs,
            (ae) => m * 0.55 * (0.3 + 0.7 * Math.sin(ae * Math.PI)),
          );
        }
    }
  }
  const x = s.i * X.Bl,
    g = Math.max(ut.fPk, 0.05),
    M = ro.position.x + (y.coil0 + y.coil1) / 2;
  if (n || o) {
    const I = B(x / g, -1.3, 1.3) * 0.6,
      O = o ? 0.95 : 0.98,
      H = n ? 0.55 : 0,
      me = M - I * 0.5,
      Ke = M + I * 0.5,
      Ee = bt(fe(M, O, H, pe), 3.2),
      Xt = Math.sign(I) || 1;
    if (Math.abs(I) > 0.03) {
      (fe(me, O, H, pe),
        fe(Ke - Xt * 0.07, O, H, Je),
        Oe.seg(pe, Je, Ee, Ee, ka, 0.95, 0.95));
      for (const we of [1, -1])
        (fe(Ke, O, H, pe),
          fe(Ke - Xt * 0.16, O + we * 0.11, H, Je),
          Oe.seg(pe, Je, Ee, Ee, ka, 1, 1));
    }
    const le = 10,
      de = y.coilR + 0.05,
      ae = d.q * 3.2;
    for (let we = 0; we < le; we++) {
      const Ce = (((we / le + ae) % 1) + 1) % 1,
        Re = (n ? -0.5 : -1) * Math.PI + Ce * (n ? 1 : 2) * Math.PI,
        At = Re + 0.18;
      (fe(M, -Math.sin(Re) * de, Math.cos(Re) * de, pe),
        fe(M, -Math.sin(At) * de, Math.cos(At) * de, Je));
      const Do = Math.min(1, Math.abs(s.i) / Math.max(ut.iPk, 0.01)) * 0.85;
      Oe.seg(pe, Je, bt(pe, 2.4), bt(Je, 2.4), ka, Do, Do);
    }
  }
  if (
    (o &&
      (fe(p + y.xBack - 0.3, 0, 0, pe),
      fe(l + te.dMax, 0, 0, Je),
      Oe.seg(pe, Je, bt(pe, 1.2), bt(Je, 1.2), zi, 0.55 * a, 0.25 * a)),
    t === "studio" && u > 0.01)
  ) {
    ht.length = 0;
    const I = te.dMax * 1.02,
      O = te.dMax * 1.9;
    for (let H = 0; H <= 120; H++) {
      const me = qt(I, O, H / 120),
        Ke = Ne(d.T - me / ca).a,
        Ee = (X.rho * X.Sd * Ke) / (2 * Math.PI) / Xo / (1 + me / 6);
      ht.push(fe(Et + i + me, B(Ee, -1.6, 1.6) * 0.62, 0, Sa[H]));
    }
    Oe.line(ht, 5, Vi, (H) => u * Math.sin(H * Math.PI) ** 0.5 * 1.6);
  }
  Oe.end();
  const b = $ - Gs > 0.1;
  b && (Gs = $);
  const S = eo && !k.next;
  (b &&
    (ve.coil.userData.set("Voice coil", Jo(s.i, 2) + " A", "#ffb454"),
    ve.cone.userData.set(
      "Cone",
      Jo(s.x * 1e3, s.x * 1e3 < 0.1 && s.x * 1e3 > -0.1 ? 3 : 2) + " mm",
      "#7fe3ff",
    ),
    ve.air.userData.set("Sound", "\u03BB " + Pa(ut.lam), "#8fb8ff"),
    ve.magnet.userData.set("Magnet", "1.1 T in the gap", "#9fc4ff"),
    ve.spider.userData.set("Spider", "a spring", "#d7a352")),
    (ve.coil.userData.want = S && (n || (o && a > 0.7)) ? 1 : 0),
    Wo(
      ve.coil,
      fe(M, n ? -1.05 : -0.95, n ? 0.45 : 0, pe),
      20,
      n ? -0.7 : -0.9,
    ),
    (ve.cone.userData.want = S ? 1 : 0),
    Wo(
      ve.cone,
      fe(Ge.position.x + 1.5, n ? 1.95 : o ? 2.15 : 2.1, n ? 0.3 : 0.2, pe),
      20,
    ));
  const Z = Math.min(te.dMax * 0.62, 4.2);
  ((ve.air.userData.want = S && u > 0.5 && !o ? 1 : 0),
    Wo(ve.air, fe(Et + i + Z * 0.8, Z * 0.62 + 0.3, 0, pe), 20),
    (ve.magnet.userData.want = S && o && a > 0.7 ? 1 : 0),
    Wo(ve.magnet, fe(p - 0.7, 1.75, 0, pe), 20),
    (ve.spider.userData.want = S && o && a > 0.7 ? 1 : 0),
    Wo(ve.spider, fe(dt.position.x + y.spX, y.spOut + 0.3, 0, pe), 20));
  for (const I of Ls)
    I.material.userData.u.uOff.value = I.material.userData.sign * d.q * 6;
}
const Pa = (e) =>
  e >= 1 ? e.toFixed(e < 10 ? 2 : 1) + " m" : Math.round(e * 100) + " cm";
function vo(e, t) {
  if (((e = B(e | 0, 0, 2)), e === ct())) {
    t || Te(Y[e].name + " \xB7 " + Y[e].f0 + " Hz");
    return;
  }
  qo(d.T);
  const o = Math.max(d.T, w.kLo * w.DT);
  (P.ev.push({ at: o, s: e }),
    d.playing || An(d.T),
    (on = !0),
    Ro(!0),
    t || Te(Y[e].name + " \xB7 " + Y[e].f0 + " Hz"),
    R.on &&
      e === 0 &&
      !R.bassHint &&
      ((R.bassHint = 1),
      setTimeout(
        () => Te("55 Hz is below most laptop speakers: try headphones"),
        900,
      )));
}
function Vt(e) {
  ((e = B(e, Pt[0], Pt[1])),
    !(Math.abs(e - d.volT) < 1e-6) && ((d.volT = e), qo(d.T), (on = !0)));
}
function Ue(e) {
  ((d.playing = !!e), e && (wo = null), Qs());
}
function Gn() {
  (Ue(!d.playing),
    Te(d.playing ? "Playing" : "Paused \xB7 drag the waveform to scrub"));
}
function go(e) {
  ((d.T = B(e, w.kLo * w.DT + 0.05, d.T + 60)), An(d.T));
}
function en(e) {
  ((d.ripT = e ? 1 : 0),
    T("#rip").classList.toggle("on", !!e),
    T("#rip").setAttribute("aria-pressed", !!e));
}
function tn() {
  if (C.on && !C.script) return;
  (qo(d.T), d.playing || Ue(!0));
  const e = (0.32 * to) / d.exag;
  ((C.on = !0),
    (C.x = j.x),
    (C.w = j.u / q),
    (C.script = { T0: w.kN * w.DT + 0.05, dur: 0.42, amp: e }));
}
let wo = null,
  on = !0;
const pt = {
    lab: {
      t: [-0.36, 3.57, 0.94],
      yaw: 0.036,
      pitch: 0.035,
      dist: 13.16,
      fov: 42,
      f: [-0.2, 4.6, 0.2],
      r: 5.4,
      fit: [16.2, 9.1],
    },
    exploded: {
      t: [0.25, 2.9, 0],
      yaw: 0.52,
      pitch: 0.1,
      dist: 15.2,
      f: [-0.4, 3, 0],
      r: 5.4,
      fit: [14.4, 6.4],
    },
    studio: {
      t: [1.5, 2.2, 0.3],
      yaw: 0.2,
      pitch: 0.08,
      dist: 15.4,
      fov: 32,
      f: [0.1, 2, 0.4],
      r: 3.8,
      fit: [12.8, 6.6],
    },
  },
  _s = { t: [0.6, 4.3, 0.4], yaw: 0.1, pitch: 0.14, dist: 13.2 },
  Ni = { lab: 8.6, exploded: 12, studio: 8.6 },
  L = { t: new r.Vector3(0, 3, 0), yaw: 0, pitch: 0.2, dist: 15 };
let _n = 4,
  qe = 1,
  En = 1,
  Mo = !1,
  _e = !1,
  Ca = [14.6, 6.4],
  Ra = 15,
  Es = 30;
const ge = N.domElement,
  Ot = new Map();
let zn = 0,
  bo = null,
  je = null,
  Da = null,
  et = null;
const Nt = new r.Raycaster(),
  zs = new r.Vector2();
function yo(e) {
  const t = Mo && D.aspect < 0.8 && e === pt.lab ? { ...e, ..._s } : e;
  (L.t.set(...t.t),
    (L.yaw = t.yaw),
    (L.pitch = t.pitch),
    (L.dist = t.dist),
    $t.set(...t.f),
    (_n = t.r),
    (Es = t.fov || 30),
    t.fit && ((Ca = t.fit), (Ra = t.dist)),
    (qe = 1),
    (_e = !1),
    ar());
}
const Vs = [],
  $e = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), Vs.push(e));
  };
(Ge.traverse((e) => {
  e.isMesh && $e(e, "cone");
}),
  [Gt, Yo, ro, dt].forEach((e) =>
    e.traverse((t) => {
      t.isMesh && $e(t, "body");
    }),
  ),
  $e(V.screen, "scope", { S: V.screen }),
  $e(la, "scope", { S: la }),
  V.jog.traverse((e) => {
    e.isMesh && $e(e, "jog");
  }),
  $e(V.slider.hit, "slider"),
  V.slider.knob.children.forEach((e) => $e(e, "slider")),
  V.btns.forEach((e, t) =>
    e.traverse((o) => {
      o.isMesh && $e(o, "btn", { s: t });
    }),
  ),
  zo.traverse((e) => {
    e.isMesh && $e(e, "genknob");
  }),
  $e(Cn, "holo"),
  ia.forEach((e) => $e(e.hit, "link", { L: e })));
const nn = (e) => {
  const t = ge.getBoundingClientRect();
  (zs.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Nt.setFromCamera(zs, D));
};
function Vn(e) {
  nn(e);
  const t = Nt.intersectObjects(
    Vs.filter((o) => Wi(o)),
    !1,
  )[0];
  return t
    ? {
        ...t.object.userData.hk,
        point: t.point,
        uv: t.uv,
        d: t.distance,
        obj: t.object,
      }
    : null;
}
const Wi = (e) => {
  for (let t = e; t; t = t.parent) if (!t.visible) return !1;
  return !0;
};
function Xi(e) {
  if (e)
    switch (e.kind) {
      case "cone":
        (tn(), Te("Tap: one push, one click"));
        break;
      case "body":
        k.cur === "lab" ? Rt("exploded") : k.cur === "exploded" && Rt("lab");
        break;
      case "jog":
        Gn();
        break;
      case "btn":
        vo(e.s);
        break;
      case "genknob":
        vo((ct() + 1) % 3);
        break;
      case "chev":
        Vt(uo(co(d.volT) + e.d * 0.1));
        break;
      case "holo":
        (en(d.ripT < 0.5),
          Te(d.ripT > 0.5 ? "Pressure rings on" : "Pressure rings off"));
        break;
      case "link":
        window.open(vr, "_blank", "noopener");
        break;
    }
}
function Aa(e, t) {
  const o =
      (D.position.distanceTo(L.t) *
        2 *
        Math.tan(r.MathUtils.degToRad(D.fov / 2))) /
      Math.max(It.clientHeight, 1),
    n = Math.cos(L.yaw),
    a = Math.sin(L.yaw);
  ((_e = !0),
    (L.t.x = B(L.t.x - n * e * o, -12, 12)),
    (L.t.z = B(L.t.z + a * e * o, -6, 8)),
    (L.t.y = B(L.t.y + t * o, 0.5, 9)));
}
const Os = {
    cone: () => "Drag to push the cone \xB7 click to tap it",
    body: () =>
      k.cur === "lab"
        ? "Pull it apart"
        : k.cur === "exploded"
          ? "Put it back together"
          : "",
    scope: () => "Drag to scrub the signal",
    jog: () =>
      d.playing
        ? "Turn to scrub \xB7 click to pause"
        : "Turn to scrub \xB7 click to play",
    slider: () => "Drag to set the volume",
    chev: (e) => (e.d < 0 ? "Quieter" : "Louder"),
    btn: (e) => Y[e.s].name + " \xB7 " + Y[e.s].f0 + " Hz",
    genknob: () => "Next signal",
    holo: () =>
      d.ripT > 0.5 ? "Hide the pressure rings" : "Show the pressure rings",
    link: () => "@RYANSAEL on X",
  },
  Wt = T("#tip");
let an = null;
function Ui(e) {
  const t = Vn(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== an && (an?.over(!1), o?.over(!0), (an = o)),
    (ge.style.cursor = t
      ? t.kind === "slider" || t.kind === "scope"
        ? "ew-resize"
        : t.kind === "cone"
          ? "grab"
          : "pointer"
      : ""));
  const n = t && Os[t.kind] ? Os[t.kind](t) : "";
  n
    ? ((Wt.textContent = n),
      (Wt.style.left = e.clientX + "px"),
      (Wt.style.top = e.clientY + "px"),
      Wt.classList.add("on"))
    : Wt.classList.remove("on");
}
const On = new r.Vector3(),
  Nn = new r.Vector3(),
  Wn = new r.Plane(),
  mt = new r.Vector3(),
  To = new r.Vector3();
function qi() {
  (G.updateMatrixWorld(!0),
    On.setFromMatrixPosition(G.matrixWorld),
    Nn.set(1, 0, 0).transformDirection(G.matrixWorld));
}
function Ns(e) {
  return (
    nn(e),
    qi(),
    To.copy(D.position).sub(On),
    To.addScaledVector(Nn, -To.dot(Nn)).normalize(),
    Wn.setFromNormalAndCoplanarPoint(To, On),
    Nt.ray.intersectPlane(Wn, mt) ? mt.sub(On).dot(Nn) : null
  );
}
function Ws(e, t) {
  nn(e);
  const o = Nt.intersectObject(t, !1)[0];
  return o
    ? o.uv.x
    : (t.updateMatrixWorld(),
      To.set(0, 0, 1).transformDirection(t.matrixWorld),
      Wn.setFromNormalAndCoplanarPoint(
        To,
        mt.setFromMatrixPosition(t.matrixWorld),
      ),
      Nt.ray.intersectPlane(Wn, mt)
        ? (t.worldToLocal(mt), mt.x / t.geometry.parameters.width + 0.5)
        : null);
}
function Xn(e) {
  const t = d.win;
  let o = d.winL,
    n = o + e * t;
  (e > 0.98
    ? ((o += (e - 0.98) * t), (d.winL = o))
    : e < 0.02 && ((o += (e - 0.02) * t), (d.winL = o)),
    go(o + B(e, 0.02, 0.98) * t));
}
function Xs(e) {
  (V.jog.updateMatrixWorld(),
    mt.setFromMatrixPosition(V.jog.matrixWorld).project(D));
  const t = ge.getBoundingClientRect();
  return Math.atan2(
    -(e.clientY - t.top - ((1 - mt.y) / 2) * t.height),
    e.clientX - t.left - ((mt.x + 1) / 2) * t.width,
  );
}
function ji(e, t) {
  if ((Q(), e.kind === "scope")) {
    (Ue(!1), (d.scrub = 1), (et = { kind: "scope", S: e.S }));
    const o = Ws(t, e.S);
    return (o != null && Xn(o), !0);
  }
  if (e.kind === "slider") {
    ((fo = !0), (et = { kind: "slider" }), nn(t));
    const o = V.slider.fromRay(Nt);
    return (o != null && Vt(uo(o)), !0);
  }
  if (e.kind === "jog")
    return ((et = { kind: "jog", a: Xs(t), moved: !1 }), !0);
  if (e.kind === "cone") {
    const o = Ns(t);
    return o == null
      ? !1
      : ((et = { kind: "cone", x0: o, xv0: d.xVis, moved: !1 }), !0);
  }
  return !1;
}
function $i(e) {
  const t = et;
  if (t.kind === "scope") {
    const o = Ws(e, t.S);
    o != null && Xn(o);
  } else if (t.kind === "slider") {
    nn(e);
    const o = V.slider.fromRay(Nt);
    o != null && Vt(uo(o));
  } else if (t.kind === "jog") {
    const o = Xs(e);
    let n = o - t.a;
    ((n = Math.atan2(Math.sin(n), Math.cos(n))),
      (Math.abs(n) > 0.02 || t.moved) &&
        (t.moved || ((t.moved = !0), Ue(!1), (d.scrub = 1)),
        (t.a = o),
        go(d.T - ((n / (Math.PI * 2)) * q) / Y[d.sig].f0)));
  } else if (t.kind === "cone") {
    const o = Ns(e);
    if (o == null) return;
    (!t.moved &&
      Math.abs(o - t.x0) > 0.03 &&
      ((t.moved = !0),
      qo(d.T),
      d.playing || Ue(!0),
      (C.script = null),
      (C.on = !0),
      (C.x = j.x),
      (C.w = j.u / q),
      (ge.style.cursor = "grabbing")),
      t.moved && (C.tgt = (B(t.xv0 + (o - t.x0), -1, 1) * to) / d.exag));
  }
}
function Hi() {
  const e = et;
  ((et = null),
    (fo = !1),
    e &&
      ((e.kind === "scope" || e.kind === "jog") && (d.scrub = 0),
      e.kind === "jog" && !e.moved && Gn(),
      e.kind === "cone" &&
        (e.moved ? ((C.on = !1), (C.relAt = w.kN * w.DT)) : tn())));
}
(ge.addEventListener("contextmenu", (e) => e.preventDefault()),
  ge.addEventListener("pointerleave", () => {
    (an?.over(!1),
      (an = null),
      Wt.classList.remove("on"),
      et || (ge.style.cursor = ""));
  }),
  ge.addEventListener("pointerdown", (e) => {
    (Q(), cn());
    try {
      ge.setPointerCapture(e.pointerId);
    } catch {}
    (Wt.classList.remove("on"),
      Ot.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (bo = null));
    const t = e.button === 0 && !e.shiftKey && Ot.size === 1 ? Vn(e) : null;
    ((Da = t),
      (je =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null),
      t && ji(t, e) && (je = null));
  }),
  ge.addEventListener("pointermove", (e) => {
    const t = Ot.get(e.pointerId);
    if (!t) {
      Ui(e);
      return;
    }
    const o = e.clientX - t[0],
      n = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), et)) {
      $i(e);
      return;
    }
    if (
      (je &&
        Math.hypot(e.clientX - je[0], e.clientY - je[1]) > 6 &&
        (je = null),
      !je)
    ) {
      if (((_e = !0), Ot.size === 2)) {
        const [a, s] = [...Ot.values()],
          i = Math.hypot(a[0] - s[0], a[1] - s[1]),
          l = [(a[0] + s[0]) / 2, (a[1] + s[1]) / 2];
        (zn && (qe = B((qe * zn) / i, 0.3, 2.2)),
          (zn = i),
          bo && Aa(l[0] - bo[0], l[1] - bo[1]),
          (bo = l));
        return;
      }
      t[2]
        ? Aa(o, n)
        : ((L.yaw -= o * 0.004),
          (L.pitch = B(L.pitch + n * 0.003, -0.05, 1.35)));
    }
  }));
const Us = (e) => {
  (et ? Hi() : je && Ot.size === 1 && performance.now() - je[2] < 450 && Xi(Da),
    (je = null),
    (Da = null),
    Ot.delete(e.pointerId),
    (zn = 0),
    (bo = null));
};
(ge.addEventListener("pointerup", Us),
  ge.addEventListener("pointercancel", (e) => {
    ((je = null), Us(e));
  }),
  ge.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        Q(),
        (_e = !0),
        (qe = B(
          qe * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.3,
          2.2,
        )));
    },
    { passive: !1 },
  ));
const So = new Set();
(addEventListener("keyup", (e) => So.delete(e.key.toLowerCase())),
  addEventListener("blur", () => So.clear()));
const Ki = new r.Vector3();
function Yi() {
  if (!So.size) return;
  const e = (So.has("shift") ? 2.4 : 1) * _t,
    t = (...a) => a.some((s) => So.has(s));
  let o = 0,
    n = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (n += 1),
    t("s", "arrowdown") && (n -= 1),
    (o || n) &&
      (Aa(o * e * 420, 0),
      L.t.addScaledVector(
        Ki.set(-Math.sin(L.yaw), 0, -Math.cos(L.yaw)),
        n * e * 5,
      )),
    t("q") && (L.yaw += e * 1.1),
    t("e") && (L.yaw -= e * 1.1),
    t("=", "+") && (qe = B(qe * Math.exp(-e * 1.3), 0.3, 2.2)),
    t("-", "_") && (qe = B(qe * Math.exp(e * 1.3), 0.3, 2.2)),
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
    ) && (_e = !0),
    (L.t.x = B(L.t.x, -12, 12)),
    (L.t.z = B(L.t.z, -5.5, 8)));
}
let Dt = !0,
  ko = -99,
  Un = -1,
  ye = null,
  qs = null,
  sn = 0;
const tt = (e) => () => vo(e, !0),
  js = () => Ue(!0),
  $s = (e) => () => {
    ((P.quiet = e), e || (P.gainT = 1));
  },
  Qi = (e, t) => () => {
    (Ue(!1), (wo = { at: $, T0: d.T, dur: e, amp: (t * q) / Y[ct()].f0 }));
  },
  Hs = () => tn(),
  Ia = [
    {
      view: "lab",
      ...pt.lab,
      dy: 0.003,
      hold: 14,
      wide: 1,
      beats: [
        [0, tt(1)],
        [0, js],
        [5, tt(0)],
        [9.5, tt(2)],
      ],
    },
    {
      view: "lab",
      t: [-0.25, 4.9, 0.4],
      yaw: 0.3,
      pitch: 0.1,
      dist: 6.2,
      dy: 0.012,
      f: [-0.15, 4.95, 0.2],
      r: 1.7,
      hold: 8,
      beats: [[0, tt(0)]],
    },
    {
      view: "lab",
      t: [2.4, 4.9, 1.2],
      yaw: -0.18,
      pitch: 0.07,
      dist: 10.5,
      fov: 36,
      dy: 0.012,
      f: [1.6, 5, 0.9],
      r: 3.6,
      hold: 8,
      beats: [[0, tt(1)]],
    },
    {
      view: "lab",
      t: [-5, 3.6, -1.2],
      yaw: 0.3,
      pitch: 0.1,
      dist: 8.4,
      dy: 0.008,
      f: [-6.3, 3.8, -1.45],
      r: 2.6,
      hold: 8,
      beats: [
        [0, tt(2)],
        [1.2, Qi(4.4, 1.4)],
        [6, js],
      ],
    },
    {
      view: "exploded",
      ...pt.exploded,
      dy: 0.005,
      hold: 10,
      wide: 1,
      beats: [[0, tt(1)]],
    },
    {
      view: "exploded",
      t: [-4.2, 3.3, 0.2],
      yaw: 0.7,
      pitch: 0.12,
      dist: 7.5,
      dy: 0.01,
      f: [-4.3, 3.2, 0],
      r: 2.4,
      hold: 7,
      beats: [[0, tt(0)]],
    },
    {
      view: "studio",
      ...pt.studio,
      dy: -0.008,
      hold: 9,
      wide: 1,
      beats: [[0, tt(2)]],
    },
    {
      view: "lab",
      t: [2.2, 5, 1],
      yaw: -0.42,
      pitch: 0.05,
      dist: 9.2,
      fov: 36,
      dy: 0.008,
      f: [1.5, 5.1, 0.8],
      r: 3,
      hold: 9,
      beats: [
        [0, tt(1)],
        [0.2, $s(!0)],
        [2.4, Hs],
        [5.4, Hs],
        [8.4, $s(!1)],
      ],
    },
  ];
function Ks(e, t) {
  ((Un = e),
    (ye = Ia[e]),
    (sn = 0),
    P.quiet && ((P.quiet = !1), (P.gainT = 1)));
  const o = Mo && D.aspect < 0.8 && e === 0 ? { ...ye, ..._s } : ye;
  ((qs = o),
    ye.view && ye.view !== (k.next || k.cur)
      ? (Rt(ye.view, !1, o), (ko = t + 0.2))
      : (yo(o), (ko = t)));
}
function Zi(e) {
  (e < ko - 1 && (ko = e),
    (!ye || e - ko > ye.hold) && Ks((Un + 1) % Ia.length, e));
  const t = e - ko;
  if (t < 0) return;
  for (; sn < ye.beats.length && t >= ye.beats[sn][0];)
    (ye.beats[sn][1](), sn++);
  if (_e) return;
  const o = qs || ye;
  ((L.yaw = o.yaw + t * o.dy),
    (L.dist = o.dist * (1 - t * 0.006)),
    $t.set(...o.f),
    (_n = o.r));
}
function Po(e) {
  (!e && P.quiet && ((P.quiet = !1), (P.gainT = 1)),
    (Dt = e),
    T("#cine").classList.toggle("on", e),
    T("#cine").setAttribute("aria-pressed", e),
    e && ((ye = null), (Un = -1), (_e = !1), (qe = 1)));
}
let rn = null;
const Q = () => {
  ((rn = null), (wo = null), Dt && Po(!1));
};
function Ba() {
  (Po(!1), yo(pt[k.cur]));
}
const Co = new r.Vector3(),
  ln = new r.Vector3();
function Ji(e) {
  const t = _e ? 0 : Math.sin(e / 8) * 0.022,
    o = Dt ? ye?.wide : rn ? rn.wide : !0,
    n = L.dist * qe * (o ? En : qt(1, En, 0.5)),
    a = L.yaw + t,
    s = Math.asin(B((0.35 - L.t.y) / Math.max(n, 0.1), -1, 1));
  let i = Math.max(L.pitch, s);
  const l = Math.cos(i);
  let c = L.t.x + Math.sin(a) * l * n,
    u = L.t.y + Math.sin(i) * n,
    f = L.t.z + Math.cos(a) * l * n;
  k.cur === "lab" &&
    ((u = Math.min(u, ne - 0.6)),
    (f = Math.max(f, ce + 1.2)),
    (c = B(c, Jt + 1, wt - 1)),
    c > Mt.x0 - 0.4 &&
      c < Mt.x1 + 0.4 &&
      f > -2.2 &&
      f < 2.6 &&
      (u = Math.max(u, Mt.top + 0.45)),
    c > W.x - 3 &&
      c < W.x + 3.6 &&
      f > W.z - 1.8 &&
      f < W.z + 1.3 &&
      (u = Math.max(u, W.y + W.h + 0.5)));
  {
    (Co.set(c, u, f),
      G.getWorldPosition(ln),
      (ln.x += k.cur === "exploded" ? 0 : 0.3));
    const g = k.cur === "exploded" ? 0 : 3.1,
      M = Co.distanceTo(ln);
    g &&
      M < g &&
      (Co.sub(ln)
        .multiplyScalar(g / Math.max(M, 0.001))
        .add(ln),
      (c = Co.x),
      (u = Co.y),
      (f = Co.z));
  }
  if ((D.position.set(c, u, f), D.lookAt(L.t), !Dt && !_e)) {
    const g = rn || pt[k.cur];
    ($t.set(...g.f), (_n = g.r));
  }
  const h = D.position.distanceTo(_e ? L.t : $t),
    p = _e ? Math.min(1, _t * 5) : 1,
    m = (_e ? Math.max(2.2, h * 0.28) : _n) * v.focalBand;
  ((Be.u.focus.value += (h - Be.u.focus.value) * p),
    (Be.u.range.value += (m - Be.u.range.value) * p));
  const x = Ct[k.cur].dofK || 1;
  Be.u.cocScale.value.set(v.apertureNear * x, v.aperture * x);
}
const Ys = [...document.querySelectorAll("#seg-sig button")],
  La = [...document.querySelectorAll("#seg-view button")];
(Ys.forEach(
  (e) =>
    (e.onclick = () => {
      (Q(), cn(), vo(+e.dataset.s));
    }),
),
  La.forEach(
    (e) =>
      (e.onclick = () => {
        (Q(), Rt(e.dataset.v));
      }),
  ));
{
  const e = T("#slide");
  let t = !1;
  const o = (a) => {
    const s = e.getBoundingClientRect();
    Vt(uo((a.clientX - s.left) / s.width));
  };
  (e.addEventListener("pointerdown", (a) => {
    (Q(), (t = !0), (fo = !0), e.setPointerCapture(a.pointerId), o(a));
  }),
    e.addEventListener("pointermove", (a) => {
      t && o(a);
    }),
    e.addEventListener("pointerup", () => {
      ((t = !1), (fo = !1));
    }),
    e.addEventListener("pointercancel", () => {
      ((t = !1), (fo = !1));
    }),
    e.addEventListener("keydown", (a) => {
      (a.key === "ArrowLeft" || a.key === "ArrowRight") &&
        (a.preventDefault(),
        a.stopPropagation(),
        Q(),
        Vt(uo(co(d.volT) + (a.key === "ArrowLeft" ? -0.04 : 0.04))));
    }));
  const n = document.createDocumentFragment();
  for (const a of [0.1, 1, 10]) {
    const s = document.createElement("div");
    ((s.className = "tk"),
      (s.style.left = co(a) * 100 + "%"),
      n.appendChild(s));
  }
  e.appendChild(n);
}
{
  const e = T("#scrub");
  let t = !1;
  const o = (a) => {
    const s = e.getBoundingClientRect();
    return (a.clientX - s.left) / s.width;
  };
  (e.addEventListener("pointerdown", (a) => {
    (Q(),
      (t = !0),
      e.setPointerCapture(a.pointerId),
      Ue(!1),
      (d.scrub = 1),
      Xn(o(a)));
  }),
    e.addEventListener("pointermove", (a) => {
      t && Xn(o(a));
    }));
  const n = () => {
    ((t = !1), (d.scrub = 0));
  };
  (e.addEventListener("pointerup", n),
    e.addEventListener("pointercancel", n),
    e.addEventListener("keydown", (a) => {
      (a.key === "ArrowLeft" || a.key === "ArrowRight") &&
        (a.preventDefault(),
        a.stopPropagation(),
        Q(),
        Zs(a.key === "ArrowLeft" ? -1 : 1));
    }));
}
((T("#play").onclick = () => {
  (Q(), cn(), Gn());
}),
  (T("#rip").onclick = () => {
    (Q(), en(d.ripT < 0.5));
  }),
  (T("#snd").onclick = () => {
    (Q(), Ga(!R.want));
  }));
function Qs() {
  const e = T("#play");
  (e.classList.toggle("paused", !d.playing),
    e.setAttribute("aria-label", d.playing ? "Pause" : "Play"),
    T("#play-i").setAttribute(
      "d",
      d.playing
        ? "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"
        : "M8 5.2v13.6a.6.6 0 0 0 .9.5l10.6-6.8a.6.6 0 0 0 0-1L8.9 4.7a.6.6 0 0 0-.9.5z",
    ));
}
function Zs(e) {
  (Ue(!1), go(d.T + (e * q) / Y[d.sig].f0 / 24));
}
let Js = 0;
const qn = (e) => {
  const t = e * 1e3;
  return t < 0.1
    ? t.toFixed(3)
    : t < 1
      ? t.toFixed(3).replace(/0$/, "")
      : t.toFixed(2);
};
function el(e) {
  const t = e / 7e-5;
  return t < 0.95
    ? t < 0.3
      ? "a fraction of a hair"
      : t < 0.6
        ? "under half a hair"
        : "thinner than a hair"
    : t < 1.5
      ? "about a hair"
      : Math.round(t) + " hairs";
}
function tl() {
  const e = ut,
    t = ct(),
    o = Y[t],
    n = Math.round(e.spl),
    a = Pa(e.lam);
  if (d.hand > 0.5)
    return `You are the signal now. Only the cone's <b>acceleration</b> reaches the air: push slowly and almost no ring leaves; flick it and a <span class="c">click</span> races out.`;
  if (!d.playing) {
    const s = Ne(d.T);
    return `Paused at <b>t = ${ho(d.T / q)} ms</b>. The coil carries <span class="a">${Jo(s.i, 2)} A</span>, the magnet turns that into <b>${Jo(s.i * X.Bl, 1)} N</b>, and the cone sits at <span class="c">${Jo(s.x * 1e3, 3)} mm</span>. Drag the waveform to scrub.`;
  }
  if (t === 0) {
    const s = Ft(1, P.vRms);
    return `At <b>${o.f0} Hz</b> the cone must swing <span class="c">\xB1${qn(e.xPk)} mm</span>, <b>${Math.round(e.xPk / s.xPk)}\xD7</b> farther than for the tone, to make <b>${n} dB</b> at a metre. Slow pushes barely squeeze the air, so bass needs long strokes; each ring is <b>${a}</b> long.`;
  }
  return t === 1
    ? `At <b>${o.f0} Hz</b> the cone moves only <span class="c">\xB1${qn(e.xPk)} mm</span>, ${el(e.xPk)}, yet it makes <b>${n} dB</b> at a metre: ${o.f0} pushes a second, each leaving as a ring <b>${a}</b> long.`
    : `A sung <b>"${Ze[oo(d.T).i].v}"</b> at <b>${o.f0} Hz</b>: 27 harmonics shaped by the mouth. The cone swings <span class="c">\xB1${qn(e.xPk)} mm</span>, mostly with the lowest one; the vowel lives in the rings.`;
}
function Ro(e) {
  if (!e && $ - Js < 0.1) return;
  ((Js = $),
    on && (Object.assign(ut, Ft(ct(), Math.sqrt(d.volT * X.Re))), (on = !1)));
  const t = ut,
    o = ct();
  ((T("#s-a").innerHTML = "\xB1" + qn(t.xPk) + "<small>mm</small>"),
    (T("#s-a2").textContent =
      "drawn \xD7" +
      (d.exag < 20
        ? d.exag.toFixed(1).replace(/\.0$/, "")
        : Math.round(d.exag))),
    (T("#s-b").innerHTML = Y[o].f0 + "<small>Hz</small>"),
    (T("#s-b2").textContent = "\u03BB " + Pa(t.lam)),
    (T("#s-c").innerHTML = Math.round(t.spl) + "<small>dB</small>"),
    (T("#s-c2").textContent = "at 1 m \xB7 " + t.pRms.toFixed(2) + " Pa"));
  const n = co(d.vol) * 100;
  ((T("#slide-kn").style.left = n + "%"),
    (T("#slide-fl").style.width = n + "%"),
    (T("#slide-v").textContent =
      (d.vol < 0.1
        ? d.vol.toFixed(2)
        : d.vol < 10
          ? d.vol.toFixed(1)
          : Math.round(d.vol)) + " W"),
    T("#slide").setAttribute("aria-valuenow", Math.round(n)),
    Ys.forEach((s, i) => s.classList.toggle("on", i === o)));
  const a = tl();
  a !== Ro.w && ((T("#why").innerHTML = a), (Ro.w = a));
}
const R = {
  want: !1,
  on: !1,
  ctx: null,
  bassHint: 0,
  osc: [],
  g: [],
  vox: [null, null],
  voxV: [-1, -1],
  voxG: [],
};
try {
  R.want = localStorage.getItem("speaker-cone:sound") === "1";
} catch {}
function Fa() {
  const e = T("#snd");
  (e.classList.toggle("on", R.want),
    e.setAttribute("aria-pressed", R.want),
    (T("#snd-w").style.display = R.want ? "" : "none"),
    (T("#snd-x").style.display = R.want ? "none" : ""));
}
function Ga(e) {
  R.want = !!e;
  try {
    localStorage.setItem("speaker-cone:sound", e ? "1" : "0");
  } catch {}
  (Fa(),
    e && cn(),
    Te(e ? "Sound on \xB7 the same signal at real speed" : "Sound off"));
}
const _a = new Map();
function Ea(e, t) {
  if (_a.has(t)) return _a.get(t);
  const o = Ze[t].h,
    n = new Float32Array(o.length + 1),
    a = new Float32Array(o.length + 1);
  for (const [i, l, c] of o)
    ((n[i] = l * Math.cos(c)), (a[i] = -l * Math.sin(c)));
  const s = e.createPeriodicWave(n, a, { disableNormalization: !0 });
  return (_a.set(t, s), s);
}
function cn() {
  if (R.want) {
    if (!R.ctx)
      try {
        const e = window.AudioContext || window.webkitAudioContext,
          t = new e();
        R.ctx = t;
        const o = t.createDynamicsCompressor();
        ((o.threshold.value = -10),
          (o.ratio.value = 6),
          o.connect(t.destination),
          (R.master = t.createGain()),
          (R.master.gain.value = 0),
          R.master.connect(o));
        for (const i of [0, 1]) {
          const l = t.createOscillator();
          ((l.type = "sine"), (l.frequency.value = Y[i].f0));
          const c = t.createGain();
          ((c.gain.value = 0),
            l.connect(c).connect(R.master),
            l.start(),
            (R.osc[i] = l),
            (R.g[i] = c));
        }
        const n = t.createGain();
        ((n.gain.value = 0), n.connect(R.master), (R.g[2] = n));
        const a = t.createOscillator();
        a.frequency.value = 5.3;
        const s = t.createGain();
        ((s.gain.value = Y[2].f0 * 0.011), a.connect(s), a.start());
        for (let i = 0; i < 2; i++) {
          const l = t.createOscillator();
          ((l.frequency.value = Y[2].f0),
            l.setPeriodicWave(Ea(t, i)),
            (R.voxV[i] = i),
            s.connect(l.frequency));
          const c = t.createGain();
          ((c.gain.value = i ? 0 : 1),
            l.connect(c).connect(n),
            l.start(),
            (R.vox[i] = l),
            (R.voxG[i] = c));
        }
      } catch {
        ((R.want = !1), Fa());
        return;
      }
    (R.ctx.state === "suspended" && R.ctx.resume(), (R.on = !0));
  }
}
function ol() {
  if (!R.ctx) return;
  const e = R.ctx,
    t = e.currentTime,
    o = 0.03,
    n = R.want && d.playing && !d.scrub && !C.on && !document.hidden,
    a = n ? Math.min(0.3, 0.13 * Math.sqrt(d.vol)) * P.gain : 0;
  R.master.gain.setTargetAtTime(a, t, 0.05);
  const s = P.ev,
    i = da(d.T),
    l = s[i],
    c = i > 0 ? Ye(l.at, l.at + P.XF, d.T) : 1,
    u = [0, 0, 0];
  ((u[l.s] += c), c < 1 && (u[s[i - 1].s] += 1 - c));
  for (let f = 0; f < 3; f++)
    R.g[f].gain.setTargetAtTime(u[f] * (f === 2 ? 0.62 : 1), t, o);
  if (u[2] > 0 || R.voxV[0] < 0) {
    const f = oo(d.T);
    let h = R.voxV.indexOf(f.i);
    h < 0 &&
      ((h = R.voxG[0].gain.value < R.voxG[1].gain.value ? 0 : 1),
      R.vox[h].setPeriodicWave(Ea(e, f.i)),
      (R.voxV[h] = f.i));
    const p = 1 - h;
    (f.w > 0.001 &&
      R.voxV[p] !== f.j &&
      (R.vox[p].setPeriodicWave(Ea(e, f.j)), (R.voxV[p] = f.j)),
      R.voxG[h].gain.setTargetAtTime(1 - f.w, t, 0.02),
      R.voxG[p].gain.setTargetAtTime(f.w, t, 0.02));
  }
}
Fa();
const xt = [
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
let He = 0,
  er = 0,
  za = 0,
  jn = 0,
  $n = 0;
function Pe() {
  (N.setPixelRatio(v.pixelRatio),
    Ie.setPixelRatio(v.pixelRatio),
    Fo.rt.samples !== v.msaa && ((Fo.rt.samples = v.msaa), Fo.rt.dispose()),
    (es.enabled = !!v.smaa),
    re.shadow.mapSize.x !== v.shadow &&
      (re.shadow.mapSize.set(v.shadow, v.shadow),
      re.shadow.map?.dispose(),
      (re.shadow.map = null)),
    (st.enabled = !!v.bloom),
    (st.radius = v.bloomRadius),
    (J.enabled = !0),
    J.updateGtaoMaterial({
      radius: v.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: v.ao ? v.aoSamples : 2,
    }),
    (Be.enabled = !!v.dof),
    (Be.u.maxCoc.value = v.maxCoc),
    ya(),
    sr());
}
function vt() {
  ((T("#tune-rows").innerHTML = xt
    .map(([e, t, o, n, , a, s], i) => {
      const l = v[e],
        c = ((l - o) / (n - o)) * 100;
      return `<div class="tr${i === He ? " sel" : ""}${s ? " sub" : ""}" data-i="${i}"><b>${t}</b><span class="tk"><i style="left:${B(c, 0, 100)}%"></i></span><u>${a(l)}</u></div>`;
    })
    .join("")),
    T("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((He = +e.dataset.i), vt());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (He = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const n = (a) => {
            const s = t.getBoundingClientRect(),
              [i, , l, c, u] = xt[He],
              f = B(
                Math.round(
                  (l + ((a.clientX - s.left) / s.width) * (c - l)) / u,
                ) * u,
                l,
                c,
              );
            f !== v[i] &&
              ((v[i] = +f.toFixed(4)), i !== "auto" && (v.auto = 0), Pe());
            const h = t.querySelector("i");
            ((h.style.left = B(((v[i] - l) / (c - l)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = xt[He][5](v[i])),
              (T("#tune-json").value = JSON.stringify(v)));
          };
          (n(o),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && n(a);
            }),
            (t.onpointerup = () => vt()));
        };
      }),
    (T("#tune-json").value = JSON.stringify(v)));
}
function nl(e, t) {
  const [o, , n, a, s] = xt[He],
    i = B(+(v[o] + e * s * (t ? 5 : 1)).toFixed(4), n, a);
  i !== v[o] && ((v[o] = i), o !== "auto" && (v.auto = 0), Pe(), vt());
}
function tr(e) {
  const t = T("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && vt());
}
function al(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (He = (He + (t === "ArrowUp" ? -1 : 1) + xt.length) % xt.length),
      vt(),
      T("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (nl(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , n, a, s] = xt[He];
    return a - n === s
      ? ((v[o] = v[o] ? 0 : 1), o !== "auto" && (v.auto = 0), Pe(), vt(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(v, ta) : (v[xt[He][0]] = ta[xt[He][0]]),
      (v.auto = 0),
      Pe(),
      vt(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(v, null, 1)), !0)
      : t === "Escape"
        ? (tr(!1), !0)
        : !1;
}
T("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in ta) typeof t[o] == "number" && (v[o] = t[o]);
    ((v.auto = 0), Pe(), vt());
  } catch {
    vt();
  }
});
const Hn = T("#ui-hint");
let or = -9;
function Te(e) {
  ((Hn.textContent = e), Hn.classList.add("on"), (or = $));
}
const nr = ["lab", "exploded", "studio"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), tr());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    T("#info").open
  )
    return;
  if (!T("#tune").hidden && al(e)) {
    e.preventDefault();
    return;
  }
  if (e.target.tagName === "BUTTON" && (e.key === " " || e.key === "Enter"))
    return;
  cn();
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
    if (e.target.id === "slide" || e.target.id === "scrub") return;
    (t.startsWith("arrow") && e.preventDefault(),
      t !== "shift" && Q(),
      So.add(t));
    return;
  }
  if (t === "1" || t === "2" || t === "3") (Q(), vo(+t - 1));
  else if (t === " ") (e.preventDefault(), Q(), Gn());
  else if (t === "," || t === ".") (Q(), Zs(t === "," ? -1 : 1));
  else if (t === "[" || t === "]")
    (Q(),
      Vt(uo(co(d.volT) + (t === "[" ? -0.05 : 0.05))),
      Te(
        "Volume " +
          (d.volT < 0.1 ? d.volT.toFixed(2) : d.volT.toFixed(1)) +
          " W",
      ));
  else if (t === "p")
    (Q(),
      en(d.ripT < 0.5),
      Te(d.ripT > 0.5 ? "Pressure rings on" : "Pressure rings off"));
  else if (t === "t") (Q(), tn(), Te("Tap: one push, one click"));
  else if (t === "m") Ga(!R.want);
  else if (t === "v") {
    Q();
    const o = nr[(nr.indexOf(k.next || k.cur) + 1) % 3];
    (Rt(o), Te(o[0].toUpperCase() + o.slice(1)));
  } else
    t === "x"
      ? (Q(), Rt((k.next || k.cur) === "exploded" ? "lab" : "exploded"))
      : t === "c"
        ? T("#cine").click()
        : t === "r"
          ? Ba()
          : t === "n"
            ? ((eo = !eo), Te(eo ? "Labels on" : "Labels off"))
            : t === "/" &&
              (e.preventDefault(),
              dn.classList.toggle("ui-off"),
              Te(
                dn.classList.contains("ui-off")
                  ? "Interface hidden \xB7 / to show"
                  : "Interface shown",
              ));
}),
  (T("#cine").onclick = () => {
    Dt ? Ba() : Po(!0);
  }),
  document
    .querySelectorAll(".ctl button")
    .forEach((e) =>
      e.addEventListener("pointerup", () => setTimeout(() => e.blur(), 0)),
    ),
  ge.addEventListener("dblclick", (e) => {
    Vn(e) || Ba();
  }),
  (T("#how").onclick = () => T("#info").showModal()),
  (T("#close").onclick = () => T("#info").close()),
  T("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    T("#tune").hidden || (T("#tune-fps").textContent = Math.round(er) + " fps");
  }, 500),
  (T("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e), Te("Link copied"));
    } catch {}
  }));
function ar() {
  const e = It.clientWidth,
    t = It.clientHeight;
  Mo = e < 900;
  const o = (Es * v.fov) / 30 + (Mo ? 8 : 0);
  (D.fov !== o && ((D.fov = o), D.updateProjectionMatrix()),
    D.setViewOffset(e, t, Mo ? 0 : e * 0.02, Mo ? t * 0.1 : -t * 0.02, e, t));
  const n = 2 * Math.tan(r.MathUtils.degToRad(D.fov / 2));
  En =
    D.aspect < 0.8
      ? B((Ni[k.next || k.cur] || 9) / (n * D.aspect) / Ra, 1, 3.2)
      : B(Math.max(Ca[0] / (n * D.aspect), Ca[1] / n) / Ra, 0.85, 2.2);
}
function sr() {
  const e = It.clientWidth,
    t = It.clientHeight;
  ((D.aspect = e / t),
    D.updateProjectionMatrix(),
    N.setSize(e, t),
    Ie.setSize(e, t));
  const o = N.getDrawingBufferSize(new r.Vector2());
  (Zn.setSize(Math.round(o.x * 0.5), Math.round(o.y * 0.5)),
    yn.uRes.value.copy(o),
    ar(),
    D.updateProjectionMatrix());
}
addEventListener("resize", sr);
let rr = performance.now(),
  Va = 0,
  Oa = 0,
  ir = 0;
function Na(e) {
  ((wa = B((e - rr) / 1e3, 0, 1.5)), (_t = Math.min(0.1, wa)), (rr = e));
  const t = e / 1e3;
  if ((($ = t), Dt && Zi(t), Yi(), wo)) {
    const o = wo,
      n = ($ - o.at) / o.dur;
    n >= 1
      ? (go(o.T0), (wo = null))
      : go(o.T0 - (o.amp * (1 - Math.cos(Math.PI * 2 * n))) / 2);
  }
  if (
    (Mi(_t),
    Bi(),
    yi(),
    Ji(t),
    D.updateMatrixWorld(),
    (N.shadowMap.needsUpdate = !0),
    Oi(t),
    Ro(),
    ol(),
    Hn.classList.contains("on") && $ - or > 1.8 && Hn.classList.remove("on"),
    (Va += wa),
    Oa++,
    e - ir > 1600)
  ) {
    const o = Oa / Math.max(Va, 0.001);
    ((Va = 0),
      (Oa = 0),
      (ir = e),
      (er = o),
      jn++,
      jn > 2 && (za = Math.max(za, o)),
      ($n = jn > 3 && o < za * 0.74 ? $n + 1 : 0),
      v._ceil === void 0 &&
        ((v._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (v._good = 0),
        (v._probe = 0)),
      !document.hidden &&
        v.auto &&
        jn > 3 &&
        (v._probe && o < 55
          ? ((v._probe = 0),
            (v._good = 0),
            (v._ceil = Math.max(1, +(v.pixelRatio - 0.25).toFixed(2))),
            (v.pixelRatio = v._ceil),
            Pe())
          : ((v._probe = 0),
            (v._good = o >= 58 ? Math.min(9, v._good + 1) : 0),
            v._good >= 3 &&
              v.pixelRatio < v._ceil &&
              ((v._good = 0),
              (v._probe = 1),
              (v.pixelRatio = Math.min(
                v._ceil,
                +(v.pixelRatio + 0.25).toFixed(2),
              )),
              Pe()))),
      !document.hidden &&
        v.auto &&
        $n >= 2 &&
        o < 50 &&
        (($n = 0),
        v.pixelRatio > 1
          ? ((v.pixelRatio = v._ceil =
              Math.max(1, +(v.pixelRatio - 0.25).toFixed(2))),
            Pe())
          : v.reflect
            ? ((v.reflect = 0), Pe())
            : v.msaa > 0
              ? ((v.msaa = 0), Pe())
              : v.ao && ((v.ao = 0), Pe())));
  }
  (kr(), N.info.reset(), Ie.render());
}
let lr = !0;
function cr(e) {
  (requestAnimationFrame(cr), lr && Na(e));
}
addEventListener("visibilitychange", () => {
  R.ctx &&
    document.hidden &&
    R.master.gain.setTargetAtTime(0, R.ctx.currentTime, 0.02);
});
function ur(e = 1) {
  ((w.kN = 0),
    (w.kLo = 0),
    (j.x = j.u = 0),
    (P.ev.length = 0),
    P.ev.push({ at: -1e9, s: e }),
    (P.gain = P.gainT = 1),
    (C.on = !1),
    (C.script = null),
    An(8),
    (d.T = 8),
    (Ma = 8),
    (d.winL = -1),
    (d.exag = Y[e].exag),
    (d.win = ys[e] * q),
    (on = !0));
}
((Ao.ready = !0), ur(1));
{
  const e = Math.sqrt(X.Re),
    t = Ft(0, e),
    o = Ft(1, e);
  ((T("#d-ratio").textContent = Math.round(t.xPk / o.xPk)),
    (T("#d-slow").textContent = q),
    (T("#d-ss").textContent = T("#d-ss2").textContent = xs));
}
(Pe(),
  _i(),
  Rt("lab", !0),
  Po(!0),
  T("#loading").remove(),
  Qs(),
  en(!0),
  Ro(!0),
  requestAnimationFrame(cr),
  (window.__step = (e) => Na(e)),
  (window.__loop = (e) => {
    lr = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = N.domElement,
      n = document.createElement("canvas");
    return (
      (n.width = e),
      (n.height = Math.round((e * o.height) / o.width)),
      n.getContext("2d").drawImage(o, 0, 0, n.width, n.height),
      n.toDataURL("image/webp", t)
    );
  }),
  (window.__shot = async (e, t = 1600, o) => {
    Na(o ?? performance.now());
    const n = window.__capture(t, 0.9);
    return (
      await fetch(
        "http://localhost:8792/shot?name=" + qa + "/_shots/" + e + ".webp",
        { method: "POST", body: n },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (Po(!1), (rn = e), e && yo({ fit: null, ...e }));
    },
    view: (e, t = !0) => Rt(e, t),
    cut: (e) => {
      (Po(!0), Ks(e, $));
    },
    signal: (e) => {
      vo(e, !0);
    },
    play: (e) => Ue(e),
    scrub: (e) => {
      (Ue(!1), go(d.T - (e / 1e3) * q));
    },
    volume: (e) => {
      ((d.volT = d.vol = e), Vt(e));
    },
    ripples: (e) => {
      (en(e), (d.rip = e ? 1 : 0));
    },
    sound: (e) => Ga(e),
    tap: () => tn(),
    push: (e) => {
      if (e == null) {
        ((C.on = !1), (C.relAt = w.kN * w.DT));
        return;
      }
      (C.on ||
        (qo(d.T), (C.on = !0), (C.script = null), (C.x = j.x), (C.w = j.u / q)),
        (C.tgt = (e * to) / d.exag));
    },
    explode: (e) => {
      d.exT = d.ex = e ? 1 : 0;
    },
    tags: (e) => {
      eo = !!e;
    },
    fresh: (e = 1) => {
      (ur(e), Ro(!0));
    },
    tune: (e) => (Object.assign(v, e), Pe(), { ...v }),
    model: () => ({
      DRV: X,
      STEADY: { ...ut },
      bass: Ft(0, Math.sqrt(X.Re)),
      tone: Ft(1, Math.sqrt(X.Re)),
      voice: Ft(2, Math.sqrt(X.Re)),
      cVis: ca,
    }),
    where: (e) => {
      const t = {
          screen: V.screen,
          gen: la,
          jog: V.jog,
          slider: V.slider.knob,
          btn0: V.btns[0],
          btn1: V.btns[1],
          btn2: V.btns[2],
          genKnob: zo,
          holo: Cn,
          mark: ia[0].hit,
        }[e],
        o = new r.Vector3();
      (e === "cone"
        ? (G.updateMatrixWorld(!0), Ge.localToWorld(o.set(Ms(1.39), 1.3, -0.5)))
        : e === "motor"
          ? G.localToWorld(o.set(y.xMid, 1.6, -0.4))
          : (t.updateMatrixWorld(!0), o.setFromMatrixPosition(t.matrixWorld)),
        o.project(D));
      const n = ge.getBoundingClientRect();
      return [
        ((o.x + 1) / 2) * n.width + n.left,
        ((1 - o.y) / 2) * n.height + n.top,
      ];
    },
    pickAt: (e, t) => {
      const o = Vn({ clientX: e, clientY: t });
      return o ? o.kind : null;
    },
    state: () => ({
      T: d.T,
      playing: d.playing,
      sig: ct(),
      vol: d.volT,
      rip: d.ripT,
      hand: C.on,
      script: !!C.script,
      view: k.cur,
      next: k.next,
      cine: Dt,
      tags: eo,
      exag: d.exag,
      xVis: d.xVis,
      snd: R.want,
      ui: dn.classList.contains("ui-off"),
    }),
    ST: d,
    VIEW: k,
    VIEWS: Ct,
    HERO: pt,
    SHOTS: Ia,
    H: w,
    GENS: P,
    FLD: te,
  }),
  (window.__x = {
    dof: Be,
    gtao: J,
    bloom: st,
    renderer: N,
    camera: D,
    scene: se,
    composer: Ie,
    cam: L,
    RT: v,
    overlay: Kt,
    rays: Oe,
    PART: z,
    UI: V,
    subject: G,
    AUD: R,
  }),
  (window.__dbg = () => ({
    t: +$.toFixed(2),
    view: k.cur,
    shot: Un,
    cine: Dt,
    T: +d.T.toFixed(3),
    sig: ct(),
    play: d.playing,
    x_mm: +(Ne(d.T).x * 1e3).toFixed(4),
    rings: te.nC,
    ex: +d.ex.toFixed(2),
    fit: +En.toFixed(3),
    focus: +Be.u.focus.value.toFixed(2),
    range: +Be.u.range.value.toFixed(2),
    calls: N.info.render.calls,
    tris: N.info.render.triangles,
  })));
