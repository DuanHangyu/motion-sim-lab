import * as l from "three";
import { EffectComposer as oc } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as ba,
  FullScreenQuad as c0,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as _r } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as nc } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as sc } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as ac } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as f0 } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as h0 } from "three/addons/utils/BufferGeometryUtils.js";
const L = (e) => document.querySelector(e),
  no = L("#world"),
  Er = L("#app"),
  U = (e, t, n) => (e < t ? t : e > n ? n : e),
  Ut = (e, t, n) => e + (t - e) * n,
  oe = (e, t, n) => {
    const s = U((n - e) / (t - e), 0, 1);
    return s * s * (3 - 2 * s);
  },
  rc = (e) => 1 - (1 - e) ** 3,
  gn = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2),
  Dr = (e) => (e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2);
function ye(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const af = ye(7),
  Ie = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  ic = "https://x.com/ryansael",
  lc = "prompt",
  Fr = [],
  d0 = [],
  Re = { desk: -1e3, dc: 0, city: 1e3, stage: 2e3 },
  Bt = new l.Scene();
Bt.background = new l.Color("#141b30");
const Z = new l.PerspectiveCamera(30, 1, 0.05, 1600);
let Ve;
try {
  Ve = new l.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (L("#loading").textContent =
      "This page needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const cc = 25e5,
  fc = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return U(Math.min(devicePixelRatio, 2, Math.sqrt(cc / (e * t))), 1, 2);
  },
  u0 = fc();
(Ve.setPixelRatio(u0),
  (Ve.info.autoReset = !1),
  (Ve.shadowMap.enabled = !0),
  (Ve.shadowMap.type = l.PCFShadowMap),
  (Ve.shadowMap.autoUpdate = !1),
  (Ve.transmissionResolutionScale = 0.6),
  (Ve.toneMapping = l.ACESFilmicToneMapping),
  no.appendChild(Ve.domElement));
const Gr = new l.Vector3(0.8, 0.1, -0.58).normalize(),
  ks = new l.Vector3(0.62, 0.62, 0.46).normalize(),
  p0 = new l.HemisphereLight(8361416, 3813162, 0.55);
Bt.add(p0);
const ct = new l.DirectionalLight(16757370, 2.2);
((ct.castShadow = !0),
  ct.shadow.mapSize.set(2048, 2048),
  Object.assign(ct.shadow.camera, {
    left: -20,
    right: 20,
    top: 20,
    bottom: -20,
    near: 1,
    far: 600,
  }),
  (ct.shadow.normalBias = 0.03),
  (ct.shadow.bias = -4e-4),
  (ct.shadow.radius = 2),
  Bt.add(ct, ct.target));
const xa = new l.DirectionalLight(9425151, 0.55);
(xa.position.set(-9, 7, 6), Bt.add(xa));
const wa = new l.DirectionalLight(14674175, 0.8);
(wa.position.set(-6, 8, 10), Bt.add(wa));
const Yn = new l.Group();
Bt.add(Yn);
const ga = `uniform vec3 uSun;uniform float uCity;
vec3 skyDusk(vec3 d){float y=d.y;float sd=max(dot(d,uSun),0.);vec2 hz=normalize(vec2(d.x,d.z)+1e-5),hs=normalize(uSun.xz);float toward=clamp(dot(hz,hs)*.5+.5,0.,1.);
 vec3 zen=vec3(.028,.05,.13),mid=vec3(.11,.14,.30),hazeC=mix(vec3(.30,.27,.42),vec3(.9,.46,.28),pow(toward,2.6));
 float h=clamp(y,0.,1.);vec3 c=mix(hazeC,mid,smoothstep(0.,.22,h));c=mix(c,zen,smoothstep(.18,.8,h));
 c+=vec3(1.3,.55,.22)*pow(sd,12.)*.7+vec3(1.6,.9,.5)*pow(sd,90.)*1.3;
 if(y<0.)c=mix(hazeC*.72,vec3(.05,.07,.12),smoothstep(0.,-.3,y));
 return c;}
vec3 skyChip(vec3 d){float y=d.y;float h=clamp(y,0.,1.);
 vec3 c=mix(vec3(.028,.05,.1),vec3(.012,.018,.042),smoothstep(0.,.35,h));c=mix(c,vec3(.006,.008,.02),smoothstep(.35,1.,h));
 c+=vec3(.08,.2,.32)*exp(-abs(y)*26.)*.55+vec3(.42,.22,.1)*exp(-abs(y)*70.)*.2;
 if(y<0.)c=mix(vec3(.025,.045,.08),vec3(.012,.018,.035),smoothstep(0.,-.3,y));
 return c;}
vec3 skyCol(vec3 d){return uCity>.999?skyChip(d):uCity<.001?skyDusk(d):mix(skyDusk(d),skyChip(d),uCity);}`,
  va = { uSun: { value: Gr }, uCity: { value: 0 } },
  nn = 10,
  jn = {
    pos: {
      value: Array.from({ length: nn }, () => new l.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: nn }, () => new l.Vector3()) },
  },
  Ms = {
    uFogD: { value: 0.0032 },
    uFogS: { value: 0 },
    uFogK: { value: 1 },
    uT: { value: 0 },
  },
  hc = `uniform vec4 uFakePos[${nn}];uniform vec3 uFakeCol[${nn}];uniform float uSat;uniform float uFogD;uniform float uFogS;uniform float uFogK;uniform float uT;varying vec3 vWPos;
${ga}`,
  dc = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${nn};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  uc = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  pc = `{vec3 dv=vWPos-cameraPosition;float dist=length(dv);vec3 dir=dv/max(dist,1e-4);
 float fd=max(dist-uFogS,0.)*uFogD;float f=1.-exp(-fd*fd);gl_FragColor.rgb=mix(gl_FragColor.rgb,skyCol(dir)*uFogK,clamp(f,0.,1.));}`,
  Vr = { value: 1.14 };
function pt(e, t) {
  return (
    (e.fog = !1),
    (e.onBeforeCompile = (n) => {
      (Object.assign(
        n.uniforms,
        { uFakePos: jn.pos, uFakeCol: jn.col, uSat: Vr },
        Ms,
        va,
      ),
        (n.vertexShader = n.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWPos;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
{vec4 wq=vec4(transformed,1.);
#ifdef USE_INSTANCING
wq=instanceMatrix*wq;
#endif
vWPos=(modelMatrix*wq).xyz;}`,
          )),
        (n.fragmentShader = n.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + hc,
          )
          .replace("#include <lights_fragment_end>", dc)
          .replace("#include <opaque_fragment>", uc)
          .replace("#include <fog_fragment>", pc)),
        t?.(n));
    }),
    (e.customProgramCacheKey = () => lc + (t ? t.key : "")),
    e
  );
}
const $r = [];
function qe(e, t, n, s, r, a) {
  const o = { p: new l.Vector3(e, t, n), c: new l.Color(s), r, i: a, i0: a };
  return ($r.push(o), o);
}
const m0 = new l.Vector3(),
  jt = [],
  vn = new l.Vector3(0, 3, 0);
function mc(e) {
  jt.length = 0;
  for (const t of $r)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r * t.r) / (1 + t.p.distanceToSquared(e) * 0.05)),
        jt.length < nn)
      )
        (jt.push(t), jt.length === nn && jt.sort((n, s) => n.score - s.score));
      else if (t.score > jt[0].score) {
        jt[0] = t;
        for (let n = 0; n < nn - 1 && jt[n].score > jt[n + 1].score; n++) {
          const s = jt[n];
          ((jt[n] = jt[n + 1]), (jt[n + 1] = s));
        }
      }
    }
}
let Wr = -1;
function Or(e, t) {
  Wr !== Ss && (mc(t), (Wr = Ss));
  for (let n = 0; n < nn; n++) {
    const s = jt[n];
    if (!s) {
      (jn.col.value[n].set(0, 0, 0), jn.pos.value[n].set(0, -999, 0, 1));
      continue;
    }
    (m0.copy(s.p).applyMatrix4(e.matrixWorldInverse),
      jn.pos.value[n].set(m0.x, m0.y, m0.z, 1 / (s.r * s.r)),
      jn.col.value[n].set(s.c.r * s.i, s.c.g * s.i, s.c.b * s.i));
  }
}
let Ss = 0;
const Ts = {},
  yc = (e, t = {}) =>
    new l.ShaderMaterial({
      side: l.BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: { ...va, ...t },
      vertexShader:
        "varying vec3 d;void main(){d=normalize((modelMatrix*vec4(position,1.)).xyz-cameraPosition);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_Position.z=gl_Position.w*.99999;}",
      fragmentShader: e,
    });
{
  const e = new l.PMREMGenerator(Ve),
    t = (s, r, a, o, i, c, f) => {
      const d = new l.Mesh(
        new l.BoxGeometry(r, a, 0.4),
        new l.MeshBasicMaterial({ color: new l.Color(...o) }),
      );
      (d.position.set(i, c, f), d.lookAt(0, 0, 0), s.add(d));
    },
    n = (s) =>
      new l.Mesh(
        new l.SphereGeometry(50, 48, 24),
        new l.ShaderMaterial({
          side: l.BackSide,
          uniforms: { uSun: { value: Gr }, uCity: { value: s } },
          vertexShader:
            "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader:
            ga +
            "varying vec3 d;void main(){gl_FragColor=vec4(skyCol(normalize(d))*1.1,1.);}",
        }),
      );
  {
    const s = new l.Scene();
    s.add(n(0));
    for (let r = 0; r < 7; r++) {
      const a = -1.4 - r * 0.34;
      t(
        s,
        5,
        1.2,
        [1.6, 1.05, 0.55],
        Math.cos(a) * 30,
        -2 + (r % 3) * 0.8,
        Math.sin(a) * 30,
      );
    }
    (t(s, 14, 2, [2.2, 2.6, 3.2], -18, 26, 14),
      (Ts.dusk = e.fromScene(s, 0.03).texture));
  }
  {
    const s = new l.Scene();
    s.add(n(1));
    for (let r = 0; r < 9; r++) {
      const a = (r / 9) * Math.PI * 2;
      t(
        s,
        6,
        2.6 + (r % 3),
        r % 3 === 0 ? [1.9, 1.2, 0.5] : [0.5, 1.3, 2.1],
        Math.cos(a) * 30,
        3 + (r % 4) * 2.2,
        Math.sin(a) * 30,
      );
    }
    (t(s, 30, 1, [0.6, 2.2, 3], 0, -4, -30),
      t(s, 30, 1, [2.4, 1.4, 0.6], 0, -4, 30),
      t(s, 16, 2, [1.1, 1.4, 2.2], -10, 28, 10),
      (Ts.city = e.fromScene(s, 0.03).texture));
  }
  {
    const s = new l.Scene();
    s.add(
      new l.Mesh(
        new l.SphereGeometry(50, 32, 16),
        new l.ShaderMaterial({
          side: l.BackSide,
          vertexShader:
            "varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader:
            "varying vec3 d;void main(){vec3 c=mix(vec3(.05,.07,.12),vec3(.12,.2,.38),smoothstep(-.3,.4,d.y));c=mix(c,vec3(.04,.06,.14),smoothstep(.5,1.,d.y));gl_FragColor=vec4(c,1.);}",
        }),
      ),
    );
    const r = [
      [5.5, 4.2, 3],
      [1.8, 3.6, 5.2],
      [4.6, 3, 1.5],
      [2.6, 2.9, 3.4],
      [1.5, 4.2, 5.5],
      [3.4, 3.4, 3.4],
    ];
    for (let a = 0; a < 6; a++) {
      const o = (a / 6) * Math.PI * 2 + 0.4;
      t(s, 12, 2.4, r[a], Math.sin(o) * 28, 12 + (a % 2) * 9, Math.cos(o) * 28);
    }
    {
      const a = new l.Mesh(
        new l.BoxGeometry(40, 1.2, 1.2),
        new l.MeshBasicMaterial({ color: new l.Color(6, 3.4, 1.2) }),
      );
      (a.position.set(0, -6, -30), s.add(a));
    }
    Ts.stage = e.fromScene(s, 0.03).texture;
  }
  e.dispose();
}
((Bt.environment = Ts.dusk), (Bt.environmentIntensity = 0.8));
const Zn = new l.Mesh(
  new l.SphereGeometry(1, 64, 32),
  yc(
    ga +
      `varying vec3 d;
 float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 void main(){vec3 n=normalize(d);vec3 c=skyCol(n);
  vec2 sp=vec2(atan(n.z,n.x)*120.,n.y*240.);vec2 i=floor(sp),f=fract(sp)-.5;float s=h21(i);float st=step(.985,s)*smoothstep(.12,.0,length(f))*smoothstep(.05,.4,n.y);
  c+=vec3(.8,.85,1.)*st*mix(.5,.25,uCity);gl_FragColor=vec4(c,1.);}`,
  ),
);
((Zn.renderOrder = -10), (Zn.frustumCulled = !1), Bt.add(Zn));
const Ur = 0,
  ka = new l.WebGLRenderTarget(1, 1, {
    type: l.HalfFloatType,
    generateMipmaps: !0,
    minFilter: l.LinearMipmapLinearFilter,
  }),
  y0 = {
    tReflect: { value: ka.texture },
    uReflMatrix: { value: new l.Matrix4() },
    uReflStrength: { value: 0.8 },
  },
  so = new l.PerspectiveCamera(),
  b0 = new l.Vector3(0, 1, 0),
  Cs = new l.Vector3(0, Ur, 0),
  Ma = new l.Vector3(),
  x0 = new l.Vector3(),
  Sa = new l.Matrix4(),
  Rs = new l.Plane(),
  sn = new l.Vector4(),
  Hr = new l.Vector4(),
  et = [];
let bc = !0;
function xc() {
  if (
    !D.reflect ||
    !bc ||
    y0.uReflStrength.value <= 0 ||
    Z.position.y <= Ur + 0.05 ||
    !ct.shadow.map
  )
    return;
  (Ma.setFromMatrixPosition(Z.matrixWorld),
    Sa.extractRotation(Z.matrixWorld),
    so.position.subVectors(Cs, Ma).reflect(b0).negate().add(Cs),
    x0.set(0, 0, -1).applyMatrix4(Sa).add(Ma),
    x0.subVectors(Cs, x0).reflect(b0).negate().add(Cs),
    so.up.set(0, 1, 0).applyMatrix4(Sa).reflect(b0),
    so.lookAt(x0),
    (so.near = Z.near),
    (so.far = Z.far),
    so.updateMatrixWorld(),
    so.projectionMatrix.copy(Z.projectionMatrix),
    y0.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(so.projectionMatrix)
      .multiply(so.matrixWorldInverse),
    Rs.setFromNormalAndCoplanarPoint(b0, Cs).applyMatrix4(
      so.matrixWorldInverse,
    ),
    sn.set(Rs.normal.x, Rs.normal.y, Rs.normal.z, Rs.constant));
  const e = so.projectionMatrix.elements;
  (Hr.set(
    (Math.sign(sn.x) + e[8]) / e[0],
    (Math.sign(sn.y) + e[9]) / e[5],
    -1,
    (1 + e[10]) / e[14],
  ),
    sn.multiplyScalar(2 / sn.dot(Hr)),
    (e[2] = sn.x),
    (e[6] = sn.y),
    (e[10] = sn.z + 1),
    (e[14] = sn.w));
  const t = et.map((s) => s.visible),
    n = Ve.shadowMap.needsUpdate;
  (et.forEach((s) => (s.visible = !1)),
    (Ve.shadowMap.needsUpdate = !1),
    Or(so, vn),
    Ve.setRenderTarget(ka),
    Ve.clear(),
    Ve.render(Bt, so),
    Ve.setRenderTarget(null),
    et.forEach((s, r) => (s.visible = t[r])),
    (Ve.shadowMap.needsUpdate = n));
}
function Qn(e, t = {}) {
  const n = t.blur ?? 2.2,
    s = t.k ?? 1;
  return pt(
    new l.MeshStandardMaterial({
      color: e,
      roughness: t.roughness ?? 0.55,
      metalness: t.metalness ?? 0.2,
      envMapIntensity: t.env ?? 0.35,
    }),
    Object.assign(
      (r) => {
        (Object.assign(r.uniforms, y0, {
          uMirK: { value: s },
          uMirBlur: { value: n },
        }),
          (r.vertexShader = r.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
uniform mat4 uReflMatrix;varying vec4 vRefl;`,
            )
            .replace(
              "#include <project_vertex>",
              `#include <project_vertex>
vRefl=uReflMatrix*modelMatrix*vec4(transformed,1.);`,
            )),
          (r.fragmentShader = r.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
uniform sampler2D tReflect;uniform float uReflStrength;uniform float uMirK;uniform float uMirBlur;varying vec4 vRefl;`,
            )
            .replace(
              "#include <opaque_fragment>",
              `{vec2 ru=vRefl.xy/vRefl.w;vec3 rc=textureLod(tReflect,ru+normal.xz*.004,uMirBlur).rgb;float fr=.35+.65*pow(1.-clamp(dot(normalize(vViewPosition),normal),0.,1.),3.);
    outgoingLight+=rc*uReflStrength*uMirK*fr;}
#include <opaque_fragment>`,
            )));
      },
      { key: "mir" + n + s },
    ),
  );
}
const wc =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  w0 = (e, t) =>
    new l.ShaderMaterial({
      uniforms: t,
      vertexShader: wc,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class gc extends ba {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new l.WebGLRenderTarget(1, 1, {
        type: l.HalfFloatType,
        samples: t,
        depthTexture: new l.DepthTexture(1, 1),
      })),
      (this.quad = new c0(
        w0(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, n) {
    this.rt.setSize(t, n);
  }
  render(t, n, s) {
    (Or(Z, vn),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(Bt, Z),
      t.setRenderTarget(s),
      this.quad.render(t));
  }
}
const Nr = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)/max(focus*.12,.02)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class vc extends ba {
  constructor() {
    super();
    const t = { type: l.HalfFloatType };
    ((this.half = new l.WebGLRenderTarget(1, 1, t)),
      (this.blurRT = new l.WebGLRenderTarget(1, 1, t)),
      (this.u = {
        tColor: { value: null },
        tDepth: { value: null },
        tHalf: { value: this.half.texture },
        tBlur: { value: this.blurRT.texture },
        near: { value: Z.near },
        far: { value: Z.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new l.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new l.Vector2() },
        fullTexel: { value: new l.Vector2() },
      }),
      (this.pre = new c0(
        w0(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${Nr}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new c0(
        w0(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new c0(
        w0(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${Nr}
   void main(){vec3 s=texture2D(tColor,vUv).rgb;vec4 b=texture2D(tBlur,vUv);vec2 o=fullTexel;
   float c=min(abs(coc(vUv)),min(min(abs(coc(vUv+vec2(o.x,0.))),abs(coc(vUv-vec2(o.x,0.)))),min(abs(coc(vUv+vec2(0.,o.y))),abs(coc(vUv-vec2(0.,o.y))))));
   gl_FragColor=vec4(mix(s,b.rgb,smoothstep(.45,1.8,max(c,b.a))),1.);}`,
          this.u,
        ),
      )));
  }
  setSize(t, n) {
    const s = Math.ceil(t / 2),
      r = Math.ceil(n / 2);
    (this.half.setSize(s, r),
      this.blurRT.setSize(s, r),
      this.u.texel.value.set(1 / s, 1 / r),
      this.u.fullTexel.value.set(1 / t, 1 / n));
  }
  render(t, n, s) {
    ((this.u.tColor.value = s.texture),
      t.setRenderTarget(this.half),
      this.pre.render(t),
      t.setRenderTarget(this.blurRT),
      this.blur.render(t),
      t.setRenderTarget(this.renderToScreen ? null : n),
      this.comp.render(t));
  }
}
const D = {
    auto: 1,
    pixelRatio: u0,
    msaa: u0 >= 1.5 ? 2 : 4,
    smaa: 1,
    shadow: 2048,
    exposure: 1,
    fov: 30,
    sun: 1,
    fill: 1,
    rim: 1,
    fog: 1,
    sat: 1.14,
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
    focalBand: 1,
    aperture: 1.2,
    apertureNear: 0.8,
    maxCoc: 12,
  },
  Ta = { ...D },
  bo = new oc(
    Ve,
    new l.WebGLRenderTarget(1, 1, { type: l.HalfFloatType, depthBuffer: !1 }),
  );
bo.setPixelRatio(u0);
const zs = new gc(D.msaa);
bo.addPass(zs);
const rt = new _r(Bt, Z, 1, 1);
((rt.output = _r.OUTPUT.Off),
  (rt.needsSwap = !1),
  rt.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  rt.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const kc = rt.setSize.bind(rt),
  Mc = rt.render.bind(rt);
rt.setSize = (e, t) => kc(Math.ceil(e / 2), Math.ceil(t / 2));
const ze = [],
  Xr = [];
((rt.render = (e, t, n) => {
  (ze.forEach((s, r) => {
    ((Xr[r] = s.visible), (s.visible = !1));
  }),
    Mc(e, t, n),
    ze.forEach((s, r) => (s.visible = Xr[r])),
    (rt.blendMaterial.uniforms.intensity.value = D.ao ? D.aoIntensity : 0),
    (rt.blendMaterial.uniforms.tDiffuse.value = rt.pdRenderTarget.texture),
    rt._renderPass(e, rt.blendMaterial, n));
}),
  bo.addPass(rt));
const an = new nc(new l.Vector2(256, 256), 0.5, 0.55, 1),
  Sc = an.setSize.bind(an);
((an.setSize = (e, t) => Sc(Math.ceil(e / 2), Math.ceil(t / 2))),
  bo.addPass(an));
const Ht = new vc();
((Ht.u.tDepth.value = zs.rt.depthTexture), bo.addPass(Ht));
const As = new l.Scene(),
  g0 = {
    tSceneDepth: { value: rt.depthTexture },
    uRes: { value: new l.Vector2(1, 1) },
    uNF: { value: new l.Vector2(Z.near, Z.far) },
  };
class Tc extends ba {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, n, s) {
    const r = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(s),
      t.render(As, Z),
      (t.autoClear = r));
  }
}
(bo.addPass(new Tc()), bo.addPass(new sc()));
const qr = new ac();
bo.addPass(qr);
const Kr = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/(soft*max(md*.02,.02))+1.,0.,1.);}`,
  _n = (e, t, n, s = 0.06, r = 2) =>
    new f0(e, t, n, r, Math.min(s, Math.min(e, t, n) / 2.02)),
  rn = new Map();
function se(e, t = {}) {
  const n = "M" + e + JSON.stringify(t);
  return (
    rn.has(n) ||
      rn.set(
        n,
        pt(
          new l.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    rn.get(n)
  );
}
function Uo(e, t = {}) {
  const n = "P" + e + JSON.stringify(t);
  return (
    rn.has(n) ||
      rn.set(
        n,
        pt(
          new l.MeshPhysicalMaterial({
            color: e,
            roughness: 0.34,
            clearcoat: 1,
            clearcoatRoughness: 0.16,
            envMapIntensity: 1.1,
            ...t,
          }),
        ),
      ),
    rn.get(n)
  );
}
function Le(e, t = {}) {
  const n = "T" + e + JSON.stringify(t);
  return (
    rn.has(n) ||
      rn.set(
        n,
        pt(
          new l.MeshPhysicalMaterial({
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
    rn.get(n)
  );
}
const Ca = new Map(),
  Ke = (e, t = 1) => {
    const n = e + "|" + t;
    return (
      Ca.has(n) ||
        Ca.set(
          n,
          new l.MeshBasicMaterial({
            color: new l.Color(e).multiplyScalar(t),
            fog: !1,
          }),
        ),
      Ca.get(n)
    );
  },
  rf = (e = {}) =>
    new l.MeshPhysicalMaterial({
      color: "#e6fbff",
      roughness: 0.05,
      metalness: 0,
      transmission: 0.95,
      thickness: 0.12,
      ior: 1.45,
      envMapIntensity: 1.3,
      ...e,
    }),
  lf = Le("#434a55", { roughness: 0.36 }),
  cf = Le("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Ra = Le("#15171b", { roughness: 0.46, metalness: 0.55 }),
  ff = Le("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  hf = Le("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  df = se("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  uf = Le("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  Yr = Le("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  pf = Le("#c9ced6", { roughness: 0.3, metalness: 0.9, clearcoat: 0.2 }),
  kn = Le("#d9a54a", { roughness: 0.26, metalness: 1, clearcoat: 0.4 }),
  ae = new l.Matrix4(),
  $e = new l.Quaternion(),
  v0 = new l.Euler(0, 0, 0, "YXZ"),
  Nt = new l.Vector3(1, 1, 1),
  Ps = new l.Color(),
  mf = new l.Vector3(1, 0, 0),
  Zt = new l.Vector3(0, 1, 0),
  yf = new l.Vector3(0, 0, 1),
  Cc = new l.Vector3(),
  Rc = new l.Quaternion();
function Pt() {
  const e = new Map(),
    t = (n, s, r, a, o, i) => {
      s = s.index ? s.toNonIndexed() : s;
      for (const f of Object.keys(s.attributes))
        ["position", "normal", "uv"].includes(f) || s.deleteAttribute(f);
      (s.attributes.uv ||
        s.setAttribute(
          "uv",
          new l.Float32BufferAttribute(
            new Float32Array(s.attributes.position.count * 2),
            2,
          ),
        ),
        i.dir
          ? ($e.setFromUnitVectors(
              Zt,
              Cc.set(i.dir[0], i.dir[1], i.dir[2]).normalize(),
            ),
            i.roll && $e.multiply(Rc.setFromAxisAngle(Zt, i.roll)))
          : (v0.set(i.rx || 0, i.ry || 0, i.rz || 0), $e.setFromEuler(v0)),
        s.applyMatrix4(
          ae.compose(
            { x: r, y: a, z: o },
            $e,
            i.s ? Nt.set(i.s[0], i.s[1], i.s[2]) : Nt.set(1, 1, 1),
          ),
        ));
      let c = e.get(n);
      (c || e.set(n, (c = { mat: n, list: [] })), c.list.push(s));
    };
  return {
    box(n, s, r, a, o, i, c, f = {}) {
      return (
        t(n, f.r ? _n(o, i, c, f.r) : new l.BoxGeometry(o, i, c), s, r, a, f),
        this
      );
    },
    cyl(n, s, r, a, o, i, c, f = {}) {
      return (
        t(
          n,
          new l.CylinderGeometry(o, i, c, f.seg || 20, 1, !!f.open),
          s,
          r,
          a,
          f,
        ),
        this
      );
    },
    cone(n, s, r, a, o, i, c = {}) {
      return (
        t(
          n,
          new l.ConeGeometry(o, i, c.seg || 6).translate(0, i / 2, 0),
          s,
          r,
          a,
          c,
        ),
        this
      );
    },
    sph(n, s, r, a, o, i = {}) {
      return (
        t(n, new l.SphereGeometry(o, i.seg || 14, i.seg2 || 10), s, r, a, i),
        this
      );
    },
    tor(n, s, r, a, o, i, c = {}) {
      return (
        t(
          n,
          new l.TorusGeometry(
            o,
            i,
            c.seg2 || 8,
            c.seg || 40,
            c.arc || Math.PI * 2,
          ),
          s,
          r,
          a,
          c,
        ),
        this
      );
    },
    geo(n, s, r = 0, a = 0, o = 0, i = {}) {
      return (t(n, s.clone(), r, a, o, i), this);
    },
    tube(n, s, r, a = {}) {
      const o = new l.CatmullRomCurve3(
        s.map((i) => (i.isVector3 ? i : new l.Vector3(...i))),
        !1,
        "catmullrom",
        a.tension ?? 0.2,
      );
      return (
        t(
          n,
          new l.TubeGeometry(
            o,
            a.n || Math.max(8, s.length * 6),
            r,
            a.seg || 8,
            !1,
          ),
          0,
          0,
          0,
          {},
        ),
        this
      );
    },
    get n() {
      let n = 0;
      for (const s of e.values()) n += s.list.length;
      return n;
    },
    flush(n, s = !0) {
      const r = [];
      for (const { mat: a, list: o } of e.values()) {
        const i = new l.Mesh(h0(o), a);
        ((i.castShadow = s),
          (i.receiveShadow = !0),
          n.add(i),
          r.push(i),
          o.forEach((c) => c.dispose()));
      }
      return (e.clear(), r);
    },
  };
}
const k0 = [];
document.fonts?.ready.then(() => k0.forEach((e) => e()));
function ln(e, t, n, s, r, a = 0.9, o = {}) {
  const i = document.createElement("canvas");
  ((i.width = n), (i.height = s));
  const c = i.getContext("2d"),
    f = new l.CanvasTexture(i);
  ((f.anisotropy = 8), (f.colorSpace = l.SRGBColorSpace));
  const d = new l.Mesh(
    new l.PlaneGeometry(e, t),
    new l.MeshBasicMaterial({
      map: f,
      alphaTest: 0.3,
      fog: !1,
      side: l.DoubleSide,
      color: new l.Color(a, a, a),
      ...o,
    }),
  );
  return (
    (d.userData = {
      c: i,
      g: c,
      t: f,
      redraw(h) {
        (c.clearRect(0, 0, n, s), h(c, n, s), (f.needsUpdate = !0));
      },
    }),
    r && (d.userData.redraw(r), k0.push(() => d.userData.redraw(r))),
    d
  );
}
const lt = (e, t, n, s, r, a) => {
    (e.beginPath(), e.roundRect(t, n, s, r, a));
  },
  We = (e, t, n, s = !0) => {
    const r = document.createElement("canvas");
    ((r.width = e), (r.height = t), n(r.getContext("2d"), e, t));
    const a = new l.CanvasTexture(r);
    return (s && (a.colorSpace = l.SRGBColorSpace), (a.anisotropy = 8), a);
  },
  jr = We(
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
  zc = (e, t, n = jr) =>
    new l.MeshBasicMaterial({
      map: n,
      color: e,
      transparent: !0,
      opacity: t,
      blending: l.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function bf(e, t = 64, n = [0, Math.PI * 2]) {
  const s = new l.LatheGeometry(
    e.map(([r, a]) => new l.Vector2(a, r)),
    t,
    n[0],
    n[1],
  );
  return (s.rotateZ(-Math.PI / 2), s);
}
function za(e, t = 0.3, n = 1, s = 0) {
  const r = new l.IcosahedronGeometry(e, s),
    a = r.attributes.position,
    o = ye(n),
    i = new Map();
  for (let c = 0; c < a.count; c++) {
    const f =
      a.getX(c).toFixed(3) +
      "," +
      a.getY(c).toFixed(3) +
      "," +
      a.getZ(c).toFixed(3);
    i.has(f) ||
      i.set(f, [1 + (o() - 0.5) * t, 1 + (o() - 0.5) * t, 1 + (o() - 0.5) * t]);
    const d = i.get(f);
    a.setXYZ(c, a.getX(c) * d[0], a.getY(c) * d[1], a.getZ(c) * d[2]);
  }
  return (r.computeVertexNormals(), r);
}
const Zr = ["#4c6b3e", "#5b7a45", "#6a8650", "#3f5c36"].map((e) =>
    se(e, { flatShading: !0, roughness: 0.8 }),
  ),
  Qr = se("#4a3527", { roughness: 0.9 });
function Jn(e, t, n, s, r, a = 1, o = 4) {
  const i = ye(Math.floor(a * 97 + 13));
  e.cyl(Qr, t, n + 0.5 * r, s, 0.06 * r, 0.1 * r, 1 * r, { seg: 6 });
  for (let c = 0; c < o; c++)
    e.geo(
      Zr[(c + a) % 4],
      za(0.45 * r * (0.75 + i() * 0.5), 0.32, c + a * 7),
      t + (i() - 0.5) * 0.6 * r,
      n + (1.15 + i() * 0.7) * r,
      s + (i() - 0.5) * 0.6 * r,
    );
}
const Ac = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
  se(e, { flatShading: !0, roughness: 0.85 }),
);
function Jr(e, t, n, s, r, a = 1) {
  const o = ye(a * 97 + 13);
  e.cyl(Qr, t, n + 0.15 * r, s, 0.05 * r, 0.07 * r, 0.3 * r, { seg: 5 });
  for (let i = 0; i < 3; i++) {
    const c = (0.42 - i * 0.1) * r * (0.9 + o() * 0.2);
    e.cone(Ac[(i + a) % 3], t, n + (0.22 + i * 0.3) * r, s, c, 0.55 * r, {
      seg: 6 + (a % 2),
      ry: o() * 3,
    });
  }
}
const Pc = We(
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
function Ic(e, t, n, s, r, a, o = 0.5) {
  const i = new l.Mesh(
    new l.PlaneGeometry(r, a),
    new l.MeshBasicMaterial({
      map: Pc,
      transparent: !0,
      opacity: o,
      depthWrite: !1,
      fog: !1,
      color: 0,
    }),
  );
  return (
    (i.rotation.x = -Math.PI / 2),
    i.position.set(t, n + 0.004, s),
    (i.renderOrder = -1),
    e.add(i),
    ze.push(i),
    i
  );
}
const M0 = [];
function ei(e, t, n, s, r, a = 128) {
  const o = "@RYANSAEL ON X",
    i = () => {
      ((e.font = `${s ? 700 : 600} ${a}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(a * 0.08) + "px"));
    };
  i();
  const c = e.measureText(o).width;
  c > t - 28 && ((a = Math.floor((a * (t - 28)) / c)), i());
  const f = t / 2 + Math.round(a * 0.04),
    d = n / 2 + a * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), s)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(o, f, d + a * 0.05),
      (e.fillStyle = r ? "#e08a24" : "#38332d"),
      e.fillText(o, f, d));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(o, f + a * 0.02, d + a * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(o, f, d - a * 0.025));
  const h = e.createLinearGradient(0, d - a * 0.7, 0, d);
  (h.addColorStop(0, "#f1d08c"),
    h.addColorStop(1, "#b3833d"),
    (e.fillStyle = h),
    e.fillText(o, f, d));
}
function ti(e, t = {}) {
  const n = !!t.pale,
    s = t.k ?? (n ? 0.92 : 0.6);
  let r = !1;
  const a = (i, c, f) => ei(i, c, f, n, r),
    o = ln(e, e * 0.1375, 1280, 176, a, s, { alphaTest: 0.25 });
  return (
    (o.userData.mark = 1),
    et.push(o),
    M0.push({
      hit: o,
      over(i) {
        ((r = i),
          n
            ? o.userData.redraw(a)
            : o.material.color.setRGB(i ? 3.4 : s, i ? 2.5 : s, i ? 1.4 : s));
      },
    }),
    o
  );
}
const tt = {
    sys: `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2024-06
Current date: 2026-10-01

Reasoning: low

# Valid channels: analysis, commentary, final. Channel must be included for every message.`,
    dev: `# Instructions

Answer in one short sentence.`,
    user: "Why is the sky blue?",
    prompt: [
      ["<|start|>", 200006, "mark"],
      ["system", 17360, "mark"],
      ["<|message|>", 200008, "mark"],
      ["You", 3575, "sys"],
      [" are", 553, "sys"],
      [" Chat", 17554, "sys"],
      ["GPT", 162016, "sys"],
      [",", 11, "sys"],
      [" a", 261, "sys"],
      [" large", 4410, "sys"],
      [" language", 6439, "sys"],
      [" model", 2359, "sys"],
      [" trained", 22203, "sys"],
      [" by", 656, "sys"],
      [" Open", 7788, "sys"],
      ["AI", 17527, "sys"],
      [
        `.
`,
        558,
        "sys",
      ],
      ["Knowledge", 87447, "sys"],
      [" cutoff", 100594, "sys"],
      [":", 25, "sys"],
      [" ", 220, "sys"],
      ["202", 1323, "sys"],
      ["4", 19, "sys"],
      ["-", 12, "sys"],
      ["06", 3218, "sys"],
      [
        `
`,
        198,
        "sys",
      ],
      ["Current", 6576, "sys"],
      [" date", 3521, "sys"],
      [":", 25, "sys"],
      [" ", 220, "sys"],
      ["202", 1323, "sys"],
      ["6", 21, "sys"],
      ["-", 12, "sys"],
      ["10", 702, "sys"],
      ["-", 12, "sys"],
      ["01", 2290, "sys"],
      [
        `

`,
        279,
        "sys",
      ],
      ["Reason", 30377, "sys"],
      ["ing", 289, "sys"],
      [":", 25, "sys"],
      [" low", 4465, "sys"],
      [
        `

`,
        279,
        "sys",
      ],
      ["#", 2, "sys"],
      [" Valid", 13888, "sys"],
      [" channels", 18403, "sys"],
      [":", 25, "sys"],
      [" analysis", 8450, "sys"],
      [",", 11, "sys"],
      [" commentary", 49159, "sys"],
      [",", 11, "sys"],
      [" final", 1721, "sys"],
      [".", 13, "sys"],
      [" Channel", 21030, "sys"],
      [" must", 2804, "sys"],
      [" be", 413, "sys"],
      [" included", 7360, "sys"],
      [" for", 395, "sys"],
      [" every", 1753, "sys"],
      [" message", 3176, "sys"],
      [".", 13, "sys"],
      ["<|end|>", 200007, "mark"],
      ["<|start|>", 200006, "mark"],
      ["developer", 77944, "mark"],
      ["<|message|>", 200008, "mark"],
      ["#", 2, "dev"],
      [" Instructions", 68406, "dev"],
      [
        `

`,
        279,
        "dev",
      ],
      ["Answer", 17045, "dev"],
      [" in", 306, "dev"],
      [" one", 1001, "dev"],
      [" short", 4022, "dev"],
      [" sentence", 21872, "dev"],
      [".", 13, "dev"],
      ["<|end|>", 200007, "mark"],
      ["<|start|>", 200006, "mark"],
      ["user", 1428, "mark"],
      ["<|message|>", 200008, "mark"],
      ["Why", 13903, "user"],
      [" is", 382, "user"],
      [" the", 290, "user"],
      [" sky", 17307, "user"],
      [" blue", 9861, "user"],
      ["?", 30, "user"],
      ["<|end|>", 200007, "mark"],
      ["<|start|>", 200006, "mark"],
      ["assistant", 173781, "mark"],
    ],
    runs: {
      low: {
        think: "We must answer in one short sentence.",
        answer:
          "Because molecules in the atmosphere scatter shorter blue wavelengths of sunlight more than other colors.",
        gen: [
          ["<|channel|>", 200005, "mark"],
          ["analysis", 35644, "mark"],
          ["<|message|>", 200008, "mark"],
          ["We", 2167, "think"],
          [" must", 2804, "think"],
          [" answer", 6052, "think"],
          [" in", 306, "think"],
          [" one", 1001, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [".", 13, "think"],
          ["<|end|>", 200007, "mark"],
          ["<|start|>", 200006, "mark"],
          ["assistant", 173781, "mark"],
          ["<|channel|>", 200005, "mark"],
          ["final", 17196, "mark"],
          ["<|message|>", 200008, "mark"],
          [
            "Because",
            30105,
            "answer",
            0.90421,
            [
              ["Because", 0.90421],
              ["The", 0.0953],
              ["Ray", 3e-4],
              ["Light", 7e-5],
              ["Sun", 5e-5],
              ["Due", 4e-5],
              ["Sc", 1e-5],
              ["Blue", 0],
              ["It", 0],
              ["Air", 0],
              ["because", 0],
              ["Atmos", 0],
              [" because", 0],
              ["Scatter", 0],
              ["When", 0],
              ["It's", 0],
              ["M", 0],
              ["Its", 0],
              [" Because", 0],
              ["Sky", 0],
            ],
          ],
          [
            " molecules",
            53785,
            "answer",
            0.97843,
            [
              [" molecules", 0.97843],
              [" shorter", 0.01087],
              [" Ray", 0.00453],
              [" short", 0.00243],
              [" Earth's", 0.0013],
              [" sunlight", 89e-5],
              [" air", 54e-5],
              [" blue", 42e-5],
              [" atmospheric", 23e-5],
              [" nitrogen", 14e-5],
              [" scattering", 6e-5],
              [" particles", 5e-5],
              [" molecular", 3e-5],
              [" Earth", 2e-5],
              [" water", 2e-5],
              [" the", 2e-5],
              [" gases", 1e-5],
              [" photons", 1e-5],
              [" scattered", 0],
              [" light", 0],
            ],
          ],
          [
            " in",
            306,
            "answer",
            0.49989,
            [
              [" in", 0.49989],
              [" scatter", 0.49989],
              [" and", 13e-5],
              [" scattering", 5e-5],
              [" scat", 1e-5],
              [" scattered", 1e-5],
              [" Ray", 0],
              [" of", 0],
              ["Scatter", 0],
              ["scatter", 0],
              [" preferential", 0],
              ["\u6563", 0],
              [" Scatter", 0],
              ["\u202F", 0],
              [" selectively", 0],
              ["-sc", 0],
              [" &", 0],
              [".scatter", 0],
              [" diffus", 0],
              [" disper", 0],
            ],
          ],
          [
            " the",
            290,
            "answer",
            0.98959,
            [
              [" the", 0.98959],
              [" Earth's", 0.00519],
              [" Earth", 0.00519],
              [" air", 2e-5],
              [" sunlight", 0],
              [" earth", 0],
              [" our", 0],
              [" atmosphere", 0],
              ["\u202F", 0],
              [" daylight", 0],
              [" atmospheric", 0],
              [" a", 0],
              [" Ray", 0],
              ["air", 0],
              [" nitrogen", 0],
              [" clear", 0],
              ["Earth", 0],
              [" Air", 0],
              [" light", 0],
              [" (", 0],
            ],
          ],
          [
            " atmosphere",
            22137,
            "answer",
            0.9995,
            [
              [" atmosphere", 0.9995],
              [" air", 43e-5],
              [" Earth's", 6e-5],
              [" clear", 1e-5],
              [" Earth", 0],
              [" atmospheric", 0],
              [" thin", 0],
              [" earth", 0],
              [" upper", 0],
              [" dry", 0],
              [" small", 0],
              [" clean", 0],
              [" blue", 0],
              [" tiny", 0],
              [" gas", 0],
              [" nitrogen", 0],
              [" daytime", 0],
              [" sun", 0],
              ["\u202F", 0],
              [" daylight", 0],
            ],
          ],
          [
            " scatter",
            36731,
            "answer",
            0.99974,
            [
              [" scatter", 0.99974],
              [" preferential", 16e-5],
              [" Ray", 8e-5],
              [" scattering", 0],
              [" scat", 0],
              [" scattered", 0],
              ["scatter", 0],
              [" selectively", 0],
              ["Scatter", 0],
              [" Scatter", 0],
              [" diffus", 0],
              ["\u6563", 0],
              [" strongly", 0],
              [".scatter", 0],
              ["\u202F", 0],
              [" more", 0],
              ["-sc", 0],
              [" elast", 0],
              [" *", 0],
              ["Ray", 0],
            ],
          ],
          [
            " shorter",
            37168,
            "answer",
            0.88066,
            [
              [" shorter", 0.88066],
              [" short", 0.11918],
              [" blue", 14e-5],
              [" sunlight", 1e-5],
              [" the", 1e-5],
              [" more", 0],
              [" shortest", 0],
              [" Short", 0],
              [" Sun", 0],
              ["short", 0],
              [" higher", 0],
              [" shortened", 0],
              ["\u202F", 0],
              [" violet", 0],
              [" (", 0],
              [" sun", 0],
              [" longer", 0],
              ["\u77ED", 0],
              ["-short", 0],
              [" brief", 0],
            ],
          ],
          [
            " blue",
            9861,
            "answer",
            0.76805,
            [
              [" blue", 0.76805],
              [" (", 0.22005],
              [",", 0.00664],
              ["\u2011", 0.00518],
              ["-blue", 3e-5],
              ["\u2014", 2e-5],
              ["-w", 1e-5],
              [" wavelengths", 1e-5],
              ["\u2010", 0],
              ["\u202F", 0],
              ["blue", 0],
              [" Blue", 0],
              [" \u2014", 0],
              [" violet", 0],
              [" wavelength", 0],
              ["\u2013", 0],
              [" \u2013", 0],
              [" blu", 0],
              [" blues", 0],
              ["-", 0],
            ],
          ],
          [
            " wavelengths",
            183230,
            "answer",
            0.9999,
            [
              [" wavelengths", 0.9999],
              [" light", 1e-4],
              [" sunlight", 0],
              ["-w", 0],
              ["\u2011", 0],
              [" wavelength", 0],
              [" w", 0],
              ["-light", 0],
              [" photons", 0],
              [" rays", 0],
              [" (", 0],
              ["\u202F", 0],
              ["\u2010", 0],
              [" visible", 0],
              [" violet", 0],
              [" daylight", 0],
              [" waves", 0],
              [" sun", 0],
              ["\u2013", 0],
              [" wave", 0],
            ],
          ],
          [
            " of",
            328,
            "answer",
            0.99996,
            [
              [" of", 0.99996],
              [" more", 4e-5],
              [" much", 0],
              ["of", 0],
              ["\u202F", 0],
              ["-of", 0],
              [" stronger", 0],
              [" sunlight", 0],
              [" Of", 0],
              [" light", 0],
              ["Of", 0],
              [" from", 0],
              ["_of", 0],
              [" far", 0],
              ["\u2011", 0],
              [" the", 0],
              ["\u200B", 0],
              ["more", 0],
              ["\xA0", 0],
              ["\u2014", 0],
            ],
          ],
          [
            " sunlight",
            55414,
            "answer",
            1,
            [
              [" sunlight", 1],
              [" light", 0],
              [" daylight", 0],
              [" Sun", 0],
              [" sun", 0],
              [" sunshine", 0],
              [" solar", 0],
              [" sunrise", 0],
              [" visible", 0],
              ["\u202F", 0],
              [" the", 0],
              [" incoming", 0],
              ["Sun", 0],
              [" sunny", 0],
              [" white", 0],
              [" Ray", 0],
              ["\xA0", 0],
              [" (", 0],
              [" SUN", 0],
              [" sunset", 0],
            ],
          ],
          [
            " more",
            945,
            "answer",
            1,
            [
              [" more", 1],
              [" much", 0],
              ["more", 0],
              [" far", 0],
              [" preferential", 0],
              [" stronger", 0],
              [" the", 0],
              [" most", 0],
              ["\u202F", 0],
              [" farther", 0],
              [" in", 0],
              [" toward", 0],
              ["More", 0],
              [" across", 0],
              [" m\xE1s", 0],
              ["\u2014", 0],
              [" longer", 0],
              [",", 0],
              [" More", 0],
              ["\u200B", 0],
            ],
          ],
          [
            " than",
            1572,
            "answer",
            0.99695,
            [
              [" than", 0.99695],
              [" strongly", 0.00117],
              [" efficiently", 0.00117],
              [" effectively", 71e-5],
              [" widely", 0],
              [" readily", 0],
              [" intensely", 0],
              [" easily", 0],
              ["\u202F", 0],
              [" Than", 0],
              [",", 0],
              [".", 0],
              ["than", 0],
              [" prominently", 0],
              [" so", 0],
              ["\u2014", 0],
              [" directly", 0],
              [" that", 0],
              [" effective", 0],
              [" heavily", 0],
            ],
          ],
          [
            " other",
            1273,
            "answer",
            0.91552,
            [
              [" other", 0.91552],
              [" the", 0.04558],
              [" longer", 0.0355],
              [" red", 0.00291],
              [" others", 31e-5],
              [" reds", 9e-5],
              [" they", 5e-5],
              [" any", 4e-5],
              [" colors", 1e-5],
              [" those", 0],
              [" all", 0],
              [" reddish", 0],
              [" long", 0],
              [" Red", 0],
              [" deeper", 0],
              [" larger", 0],
              ["\u5176\u4ED6", 0],
              [" higher", 0],
              [" that", 0],
              [" it", 0],
            ],
          ],
          [
            " colors",
            10803,
            "answer",
            0.99999,
            [
              [" colors", 0.99999],
              [" colours", 1e-5],
              [" wavelengths", 0],
              [" Colors", 0],
              ["Colors", 0],
              [" hues", 0],
              ["colors", 0],
              [" visible", 0],
              [".colors", 0],
              [" colores", 0],
              ["_colors", 0],
              [" color", 0],
              [" (", 0],
              [" COLORS", 0],
              ["(colors", 0],
              [" shades", 0],
              [" colored", 0],
              ["\u202F", 0],
              [",", 0],
              [" frequencies", 0],
            ],
          ],
          [
            ".",
            13,
            "answer",
            0.99998,
            [
              [".", 0.99998],
              [",", 2e-5],
              [".\u200B", 0],
              [".\u3010", 0],
              ["\u200B.", 0],
              [".<", 0],
              [".\\", 0],
              [".#", 0],
              ["..", 0],
              ["\u0964", 0],
              [".,", 0],
              ["\u3002", 0],
              [".\xBB", 0],
              [".|", 0],
              [",.", 0],
              [".\xAB", 0],
              [".@", 0],
              [".-", 0],
              [".{", 0],
              [".\u200F", 0],
            ],
          ],
          ["<|return|>", 200002, "mark"],
        ],
        provider: "DekaLLM",
        usage: { in: 86, out: 34, think: 8 },
      },
      greedy: {
        think: "Need short sentence answer.",
        answer:
          "The sky appears blue because molecules in the atmosphere scatter shorter (blue) wavelengths of sunlight more than longer (red) wavelengths.",
        gen: [
          ["<|channel|>", 200005, "mark"],
          ["analysis", 35644, "mark"],
          ["<|message|>", 200008, "mark"],
          ["Need", 23483, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [" answer", 6052, "think"],
          [".", 13, "think"],
          ["<|end|>", 200007, "mark"],
          ["<|start|>", 200006, "mark"],
          ["assistant", 173781, "mark"],
          ["<|channel|>", 200005, "mark"],
          ["final", 17196, "mark"],
          ["<|message|>", 200008, "mark"],
          [
            "The",
            976,
            "answer",
            0.67704,
            [
              ["The", 0.67704],
              ["Because", 0.31981],
              ["Ray", 0.00277],
              ["Sun", 23e-5],
              ["Due", 7e-5],
              ["Sc", 3e-5],
              ["Light", 2e-5],
              ["Air", 2e-5],
              ["Atmos", 1e-5],
              ["Blue", 0],
              ["because", 0],
              ["It", 0],
              ["Scatter", 0],
              ["M", 0],
              [" because", 0],
              ["When", 0],
              ["Earth", 0],
              ["Sky", 0],
              ["Rain", 0],
              ["It's", 0],
            ],
          ],
          [
            " sky",
            17307,
            "answer",
            1,
            [
              [" sky", 1],
              [" scattering", 0],
              [" atmosphere", 0],
              [" blue", 0],
              [" scattered", 0],
              [" Sky", 0],
              [" Earth's", 0],
              ["sky", 0],
              [" air", 0],
              [" light", 0],
              [" Ray", 0],
              [" sun", 0],
              [" short", 0],
              [" sunlight", 0],
              [" skyl", 0],
              [" skin", 0],
              [" skies", 0],
              [" sea", 0],
              [" clear", 0],
              [" brain", 0],
            ],
          ],
          [
            " appears",
            14518,
            "answer",
            0.99675,
            [
              [" appears", 0.99675],
              [" looks", 0.00317],
              [" is", 7e-5],
              [" scat", 0],
              [" appear", 0],
              ["\u2019s", 0],
              [" Appe", 0],
              [" scattering", 0],
              [" blue", 0],
              ["'s", 0],
              [" scatter", 0],
              ["appe", 0],
              [" seems", 0],
              [" appearing", 0],
              [" turns", 0],
              [" feels", 0],
              [" shines", 0],
              [" reflects", 0],
              [" acts", 0],
              [" appeared", 0],
            ],
          ],
          [
            " blue",
            9861,
            "answer",
            1,
            [
              [" blue", 1],
              [" blu", 0],
              ["blue", 0],
              [" Blue", 0],
              ["\u84DD", 0],
              [" azul", 0],
              [" BLUE", 0],
              ["-blue", 0],
              ["\u202F", 0],
              [" blues", 0],
              [" bl", 0],
              [" azure", 0],
              [" bleu", 0],
              ["\xA0", 0],
              [" bl\xE5", 0],
              [" blau", 0],
              [" deep", 0],
              [" **", 0],
              [" bright", 0],
              [
                `

`,
                0,
              ],
            ],
          ],
          [
            " because",
            2236,
            "answer",
            0.99999,
            [
              [" because", 0.99999],
              [" due", 1e-5],
              ["because", 0],
              [" Because", 0],
              ["Because", 0],
              [" porque", 0],
              [" when", 0],
              [" mainly", 0],
              [" weil", 0],
              ["\u56E0\u4E3A", 0],
              [" \u043F\u043E\u0442\u043E\u043C\u0443", 0],
              [" primarily", 0],
              [" caused", 0],
              [" karena", 0],
              ["\u202F", 0],
              [" \u0644\u0623\u0646", 0],
              [" since", 0],
              [" thanks", 0],
              [",", 0],
              [" fordi", 0],
            ],
          ],
          [
            " molecules",
            53785,
            "answer",
            0.90134,
            [
              [" molecules", 0.90134],
              [" air", 0.05762],
              [" shorter", 0.01651],
              [" Earth's", 0.01135],
              [" short", 0.00368],
              [" atmospheric", 0.00287],
              [" Ray", 0.00223],
              [" nitrogen", 0.00197],
              [" Earth", 93e-5],
              [" sunlight", 82e-5],
              [" tiny", 16e-5],
              [" gases", 13e-5],
              [" scattering", 7e-5],
              [" the", 5e-5],
              [" particles", 5e-5],
              [" scattered", 4e-5],
              [" small", 4e-5],
              [" molecular", 3e-5],
              [" gas", 2e-5],
              [" its", 2e-5],
            ],
          ],
          [
            " in",
            306,
            "answer",
            0.99987,
            [
              [" in", 0.99987],
              [" scatter", 11e-5],
              [" scattering", 2e-5],
              [" scattered", 0],
              [" and", 0],
              [" scat", 0],
              ["\u202F", 0],
              [" of", 0],
              [" Ray", 0],
              ["\u6563", 0],
              ["-sc", 0],
              ["Scatter", 0],
              [" air", 0],
              [" selectively", 0],
              [" smaller", 0],
              [" atmospheric", 0],
              ["\xA0", 0],
              ["\u2011", 0],
              [" preferential", 0],
              ["scatter", 0],
            ],
          ],
          [
            " the",
            290,
            "answer",
            0.622,
            [
              [" the", 0.622],
              [" Earth", 0.29381],
              [" Earth's", 0.08418],
              ["\u202F", 0],
              [" air", 0],
              [" our", 0],
              [" earth", 0],
              [" atmosphere", 0],
              ["\xA0", 0],
              [" sunlight", 0],
              ["\u2011", 0],
              ["Earth", 0],
              [" a", 0],
              [" its", 0],
              [" atmospheric", 0],
              ["\u2019s", 0],
              [" (", 0],
              [",", 0],
              [" daylight", 0],
              [" we", 0],
            ],
          ],
          [
            " atmosphere",
            22137,
            "answer",
            0.99744,
            [
              [" atmosphere", 0.99744],
              [" Earth's", 0.00193],
              [" Earth", 43e-5],
              [" air", 2e-4],
              [" earth", 0],
              [" thin", 0],
              [" clear", 0],
              ["\u202F", 0],
              [" atmospheric", 0],
              [" upper", 0],
              [" short", 0],
              [" tiny", 0],
              [" small", 0],
              [" dry", 0],
              [" daytime", 0],
              [" thinner", 0],
              [" shorter", 0],
              [" Atmos", 0],
              [" gas", 0],
              [" clean", 0],
            ],
          ],
          [
            " scatter",
            36731,
            "answer",
            0.99978,
            [
              [" scatter", 0.99978],
              [" preferential", 2e-4],
              [" Ray", 1e-5],
              [" scattering", 1e-5],
              [" scattered", 0],
              [" scat", 0],
              ["scatter", 0],
              [" selectively", 0],
              ["Scatter", 0],
              [" Scatter", 0],
              [" diffus", 0],
              ["\u6563", 0],
              [" strongly", 0],
              [" more", 0],
              [" predominantly", 0],
              [".scatter", 0],
              [" *", 0],
              ["\u202F", 0],
              ["-sc", 0],
              [" efficiently", 0],
            ],
          ],
          [
            " shorter",
            37168,
            "answer",
            0.88059,
            [
              [" shorter", 0.88059],
              [" short", 0.11917],
              [" sunlight", 23e-5],
              [" the", 0],
              [" Sun", 0],
              [" more", 0],
              [" blue", 0],
              [" shortest", 0],
              [" Short", 0],
              [" sun", 0],
              ["short", 0],
              [" shortened", 0],
              [" incoming", 0],
              [" higher", 0],
              [" (", 0],
              ["\u202F", 0],
              [" green", 0],
              ["\u77ED", 0],
              [" longer", 0],
              ["-short", 0],
            ],
          ],
          [
            " (",
            350,
            "answer",
            0.91692,
            [
              [" (", 0.91692],
              [" blue", 0.03555],
              [",", 0.03555],
              ["\u2011", 0.00793],
              ["-w", 0.00375],
              [" wavelengths", 13e-5],
              ["\u2014", 9e-5],
              [" wavelength", 5e-5],
              ["\u202F", 0],
              ["\u2010", 0],
              ["-blue", 0],
              [" \u2014", 0],
              [" violet", 0],
              [" \u2013", 0],
              ["\u2013", 0],
              ["blue", 0],
              ["\u2014and", 0],
              ["-", 0],
              [" sunlight", 0],
              [" Blue", 0],
            ],
          ],
          [
            "blue",
            18789,
            "answer",
            1,
            [
              ["blue", 1],
              [" blue", 0],
              ["blu", 0],
              ["bl", 0],
              ["Blue", 0],
              ["vio", 0],
              ["\u84DD", 0],
              ["-blue", 0],
              ["green", 0],
              ["\u2011", 0],
              ["short", 0],
              ["ble", 0],
              ["BLUE", 0],
              ["\u200B", 0],
              ["\u202F", 0],
              ["i", 0],
              ["_blue", 0],
              ["", 0],
              ["high", 0],
              ["white", 0],
            ],
          ],
          [
            ")",
            8,
            "answer",
            0.99999,
            [
              [")", 0.99999],
              ["\u2011", 1e-5],
              ["\u2010", 0],
              ["\u2013", 0],
              ["\u202F", 0],
              ["-", 0],
              [" wavelengths", 0],
              ["-green", 0],
              ["),", 0],
              ["\uFF09", 0],
              [" )", 0],
              ["-v", 0],
              ["-w", 0],
              [")\u2014", 0],
              ["]", 0],
              [")-", 0],
              [" and", 0],
              [".)", 0],
              ["-)", 0],
              ["\xAD", 0],
            ],
          ],
          [
            " wavelengths",
            183230,
            "answer",
            0.99999,
            [
              [" wavelengths", 0.99999],
              [" sunlight", 1e-5],
              [" light", 0],
              [" wavelength", 0],
              [" solar", 0],
              ["\u202F", 0],
              [" visible", 0],
              [" daylight", 0],
              ["-w", 0],
              [" sun", 0],
              [" w", 0],
              ["\u2011", 0],
              [" shorter", 0],
              [" waves", 0],
              [" rays", 0],
              [" short", 0],
              ["w", 0],
              [" Sun", 0],
              [" photons", 0],
              [" wave", 0],
            ],
          ],
          [
            " of",
            328,
            "answer",
            1,
            [
              [" of", 1],
              [" more", 0],
              ["of", 0],
              [" from", 0],
              [" sunlight", 0],
              ["\u202F", 0],
              [" Of", 0],
              ["Of", 0],
              ["_of", 0],
              ["-of", 0],
              [" light", 0],
              ["\u2011", 0],
              [" much", 0],
              ["\u200B", 0],
              ["	of", 0],
              [" the", 0],
              [" c\u1EE7a", 0],
              [" \u05E9\u05DC", 0],
              [",", 0],
              ["\u2014", 0],
            ],
          ],
          [
            " sunlight",
            55414,
            "answer",
            1,
            [
              [" sunlight", 1],
              [" daylight", 0],
              [" Sun", 0],
              [" light", 0],
              [" sunshine", 0],
              [" sun", 0],
              [" solar", 0],
              [" incoming", 0],
              [" the", 0],
              [" sunrise", 0],
              [" visible", 0],
              ["\u202F", 0],
              [" white", 0],
              [" sunny", 0],
              ["Sun", 0],
              [" short", 0],
              [" Earth's", 0],
              [" Ray", 0],
              [" sunset", 0],
              [" ultraviolet", 0],
            ],
          ],
          [
            " more",
            945,
            "answer",
            1,
            [
              [" more", 1],
              [" much", 0],
              ["more", 0],
              [" preferential", 0],
              ["\u202F", 0],
              [" far", 0],
              [" farther", 0],
              [" stronger", 0],
              ["\u2014", 0],
              [" in", 0],
              [",", 0],
              [" toward", 0],
              [" the", 0],
              [" More", 0],
              ["\u200B", 0],
              ["More", 0],
              [" across", 0],
              [" most", 0],
              [" longer", 0],
              [" m\xE1s", 0],
            ],
          ],
          [
            " than",
            1572,
            "answer",
            0.8574,
            [
              [" than", 0.8574],
              [" efficiently", 0.09037],
              [" effectively", 0.04269],
              [" strongly", 0.00952],
              [" intensely", 1e-5],
              [" readily", 0],
              [" widely", 0],
              ["\u202F", 0],
              [" easily", 0],
              [" effective", 0],
              ["\u2014", 0],
              [" directly", 0],
              [" Than", 0],
              [" that", 0],
              [",", 0],
              [" so", 0],
              [" efficient", 0],
              [" intens", 0],
              ["\u2011", 0],
              [" heavily", 0],
            ],
          ],
          [
            " longer",
            7411,
            "answer",
            0.99892,
            [
              [" longer", 0.99892],
              [" the", 91e-5],
              [" other", 7e-5],
              [" red", 6e-5],
              [" they", 4e-5],
              [" others", 0],
              [" those", 0],
              [" any", 0],
              [" reds", 0],
              [" long", 0],
              [" colors", 0],
              [" larger", 0],
              [" all", 0],
              [" deeper", 0],
              [" higher", 0],
              [" reddish", 0],
              [" they're", 0],
              [" it", 0],
              [" that", 0],
              [" at", 0],
            ],
          ],
          [
            " (",
            350,
            "answer",
            0.97574,
            [
              [" (", 0.97574],
              [" wavelengths", 0.02295],
              [" ones", 0.00114],
              [" colors", 8e-5],
              [" red", 7e-5],
              [",", 1e-5],
              [" reds", 0],
              [" hues", 0],
              ["\u2011", 0],
              ["\u2014", 0],
              ["\u202F", 0],
              [" reddish", 0],
              ["-colored", 0],
              [" shades", 0],
              ["-w", 0],
              [" rays", 0],
              [" (\u201C", 0],
              [' ("', 0],
              [" waves", 0],
              ["\xA0", 0],
            ],
          ],
          [
            "red",
            1291,
            "answer",
            1,
            [
              ["red", 1],
              [" red", 0],
              ["reds", 0],
              ["redd", 0],
              ["Red", 0],
              [" reds", 0],
              ["orange", 0],
              ["-red", 0],
              ["e", 0],
              ["like", 0],
              ["RED", 0],
              [" reddish", 0],
              ["yellow", 0],
              ["r", 0],
              ["\u7EA2", 0],
              ["\u2011", 0],
              ["green", 0],
              ["vio", 0],
              ["\u8D64", 0],
              ["(red", 0],
            ],
          ],
          [
            ")",
            8,
            "answer",
            1,
            [
              [")", 1],
              ["\u2011", 0],
              [" )", 0],
              [".)", 0],
              ["\u2013", 0],
              ["der", 0],
              [").", 0],
              ["\u202F", 0],
              ['")', 0],
              ["\u2026)", 0],
              ["]", 0],
              ["),", 0],
              ["\uFF09", 0],
              [")\u2014", 0],
              ["?)", 0],
              ["')", 0],
              ["\u200B", 0],
              ["_)", 0],
              ["\u2010", 0],
              [");", 0],
            ],
          ],
          [
            " wavelengths",
            183230,
            "answer",
            0.98901,
            [
              [" wavelengths", 0.98901],
              [" ones", 0.01099],
              [" colors", 0],
              [" hues", 0],
              [" waves", 0],
              [" tones", 0],
              ["\u202F", 0],
              [" those", 0],
              [" wavelength", 0],
              ["\u2011", 0],
              [" lengths", 0],
              [" rays", 0],
              [" frequencies", 0],
              [" shades", 0],
              [" w", 0],
              ["\xA0", 0],
              [" wav", 0],
              [" one", 0],
              [" light", 0],
              ["ones", 0],
            ],
          ],
          [
            ".",
            13,
            "answer",
            1,
            [
              [".", 1],
              [".\u200B", 0],
              [".\u3010", 0],
              [",", 0],
              ["\u200B.", 0],
              [".\\", 0],
              ["\u0964", 0],
              [".\u200F", 0],
              ["\u3002", 0],
              ["\u06D4", 0],
              [".<", 0],
              ["..", 0],
              [".{", 0],
              [".\xA7", 0],
              [".|", 0],
              [".#", 0],
              [".@", 0],
              ["\uFF0E", 0],
              [".~", 0],
              [".[", 0],
            ],
          ],
          ["<|return|>", 200002, "mark"],
        ],
        provider: "DekaLLM",
        usage: { in: 86, out: 40, think: 5 },
      },
      high: {
        think: `The user asks: "Why is the sky blue?" The developer instruction says: "Answer in one short sentence."

So we need to give a concise answer, one short sentence. Must comply with policy. The question about why sky is blue: scattering of short-wavelength light (Rayleigh scattering). Provide one short sentence.

We need to ensure no policy violations. So answer like: "Because Rayleigh scattering preferentially redirects shorter (blue) wavelengths of sunlight."

That is a short sentence (maybe a bit longer but okay). It must be one short sentence. We can keep as "Because Rayleigh scattering preferentially scatters short (blue) wavelengths of sunlight." That's one sentence.

Thus final answer: "Because Rayleigh scattering preferentially scatters the shorter, blue wavelengths of sunlight, giving the sky its color."

We should ensure it's one short sentence. It's somewhat long but still one sentence. Maybe they want brevity: "Because Rayleigh scattering scatters blue light more than other colors."

Let's answer with that.

We comply with instruction: one short sentence. We'll produce that.`,
        answer:
          "Because Rayleigh scattering scatters blue light more than other colors, the sky appears blue.",
        gen: [
          ["<|channel|>", 200005, "mark"],
          ["analysis", 35644, "mark"],
          ["<|message|>", 200008, "mark"],
          ["The", 976, "think"],
          [" user", 1825, "think"],
          [" asks", 31064, "think"],
          [":", 25, "think"],
          [' "', 392, "think"],
          ["Why", 13903, "think"],
          [" is", 382, "think"],
          [" the", 290, "think"],
          [" sky", 17307, "think"],
          [" blue", 9861, "think"],
          ['?"', 16842, "think"],
          [" The", 623, "think"],
          [" developer", 24261, "think"],
          [" instruction", 21179, "think"],
          [" says", 5003, "think"],
          [":", 25, "think"],
          [' "', 392, "think"],
          ["Answer", 17045, "think"],
          [" in", 306, "think"],
          [" one", 1001, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [
            `."

`,
            6635,
            "think",
          ],
          ["So", 5808, "think"],
          [" we", 581, "think"],
          [" need", 1309, "think"],
          [" to", 316, "think"],
          [" give", 3644, "think"],
          [" a", 261, "think"],
          [" concise", 82463, "think"],
          [" answer", 6052, "think"],
          [",", 11, "think"],
          [" one", 1001, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [".", 13, "think"],
          [" Must", 20953, "think"],
          [" comply", 40206, "think"],
          [" with", 483, "think"],
          [" policy", 7562, "think"],
          [".", 13, "think"],
          [" The", 623, "think"],
          [" question", 4928, "think"],
          [" about", 1078, "think"],
          [" why", 4436, "think"],
          [" sky", 17307, "think"],
          [" is", 382, "think"],
          [" blue", 9861, "think"],
          [":", 25, "think"],
          [" scattering", 109445, "think"],
          [" of", 328, "think"],
          [" short", 4022, "think"],
          ["-w", 4450, "think"],
          ["avelength", 61609, "think"],
          [" light", 4207, "think"],
          [" (", 350, "think"],
          ["Ray", 37513, "think"],
          ["leigh", 104153, "think"],
          [" scattering", 109445, "think"],
          [").", 741, "think"],
          [" Provide", 51441, "think"],
          [" one", 1001, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [
            `.

`,
            364,
            "think",
          ],
          ["We", 2167, "think"],
          [" need", 1309, "think"],
          [" to", 316, "think"],
          [" ensure", 6757, "think"],
          [" no", 860, "think"],
          [" policy", 7562, "think"],
          [" violations", 54446, "think"],
          [".", 13, "think"],
          [" So", 2632, "think"],
          [" answer", 6052, "think"],
          [" like", 1299, "think"],
          [":", 25, "think"],
          [' "', 392, "think"],
          ["Because", 30105, "think"],
          [" Ray", 19781, "think"],
          ["leigh", 104153, "think"],
          [" scattering", 109445, "think"],
          [" preferential", 167918, "think"],
          ["ly", 423, "think"],
          [" redirects", 155301, "think"],
          [" shorter", 37168, "think"],
          [" (", 350, "think"],
          ["blue", 18789, "think"],
          [")", 8, "think"],
          [" wavelengths", 183230, "think"],
          [" of", 328, "think"],
          [" sunlight", 55414, "think"],
          [
            `."

`,
            6635,
            "think",
          ],
          ["That", 7924, "think"],
          [" is", 382, "think"],
          [" a", 261, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [" (", 350, "think"],
          ["maybe", 62832, "think"],
          [" a", 261, "think"],
          [" bit", 3546, "think"],
          [" longer", 7411, "think"],
          [" but", 889, "think"],
          [" okay", 25435, "think"],
          [").", 741, "think"],
          [" It", 1225, "think"],
          [" must", 2804, "think"],
          [" be", 413, "think"],
          [" one", 1001, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [".", 13, "think"],
          [" We", 1416, "think"],
          [" can", 665, "think"],
          [" keep", 3357, "think"],
          [" as", 472, "think"],
          [' "', 392, "think"],
          ["Because", 30105, "think"],
          [" Ray", 19781, "think"],
          ["leigh", 104153, "think"],
          [" scattering", 109445, "think"],
          [" preferential", 167918, "think"],
          ["ly", 423, "think"],
          [" scat", 143716, "think"],
          ["ters", 2540, "think"],
          [" short", 4022, "think"],
          [" (", 350, "think"],
          ["blue", 18789, "think"],
          [")", 8, "think"],
          [" wavelengths", 183230, "think"],
          [" of", 328, "think"],
          [" sunlight", 55414, "think"],
          ['."', 3692, "think"],
          [" That's", 21926, "think"],
          [" one", 1001, "think"],
          [" sentence", 21872, "think"],
          [
            `.

`,
            364,
            "think",
          ],
          ["Thus", 84787, "think"],
          [" final", 1721, "think"],
          [" answer", 6052, "think"],
          [":", 25, "think"],
          [' "', 392, "think"],
          ["Because", 30105, "think"],
          [" Ray", 19781, "think"],
          ["leigh", 104153, "think"],
          [" scattering", 109445, "think"],
          [" preferential", 167918, "think"],
          ["ly", 423, "think"],
          [" scat", 143716, "think"],
          ["ters", 2540, "think"],
          [" the", 290, "think"],
          [" shorter", 37168, "think"],
          [",", 11, "think"],
          [" blue", 9861, "think"],
          [" wavelengths", 183230, "think"],
          [" of", 328, "think"],
          [" sunlight", 55414, "think"],
          [",", 11, "think"],
          [" giving", 9874, "think"],
          [" the", 290, "think"],
          [" sky", 17307, "think"],
          [" its", 1617, "think"],
          [" color", 3089, "think"],
          [
            `."

`,
            6635,
            "think",
          ],
          ["We", 2167, "think"],
          [" should", 1757, "think"],
          [" ensure", 6757, "think"],
          [" it's", 4275, "think"],
          [" one", 1001, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [".", 13, "think"],
          [" It's", 7744, "think"],
          [" somewhat", 24407, "think"],
          [" long", 1701, "think"],
          [" but", 889, "think"],
          [" still", 2928, "think"],
          [" one", 1001, "think"],
          [" sentence", 21872, "think"],
          [".", 13, "think"],
          [" Maybe", 17158, "think"],
          [" they", 1023, "think"],
          [" want", 1682, "think"],
          [" brev", 133961, "think"],
          ["ity", 536, "think"],
          [":", 25, "think"],
          [' "', 392, "think"],
          ["Because", 30105, "think"],
          [" Ray", 19781, "think"],
          ["leigh", 104153, "think"],
          [" scattering", 109445, "think"],
          [" scat", 143716, "think"],
          ["ters", 2540, "think"],
          [" blue", 9861, "think"],
          [" light", 4207, "think"],
          [" more", 945, "think"],
          [" than", 1572, "think"],
          [" other", 1273, "think"],
          [" colors", 10803, "think"],
          [
            `."

`,
            6635,
            "think",
          ],
          ["Let's", 58369, "think"],
          [" answer", 6052, "think"],
          [" with", 483, "think"],
          [" that", 484, "think"],
          [
            `.

`,
            364,
            "think",
          ],
          ["We", 2167, "think"],
          [" comply", 40206, "think"],
          [" with", 483, "think"],
          [" instruction", 21179, "think"],
          [":", 25, "think"],
          [" one", 1001, "think"],
          [" short", 4022, "think"],
          [" sentence", 21872, "think"],
          [".", 13, "think"],
          [" We'll", 46830, "think"],
          [" produce", 10635, "think"],
          [" that", 484, "think"],
          [".", 13, "think"],
          ["<|end|>", 200007, "mark"],
          ["<|start|>", 200006, "mark"],
          ["assistant", 173781, "mark"],
          ["<|channel|>", 200005, "mark"],
          ["final", 17196, "mark"],
          ["<|message|>", 200008, "mark"],
          [
            "Because",
            30105,
            "answer",
            1,
            [
              ["Because", 1],
              [" because", 0],
              ["The", 0],
              ["Porque", 0],
              ["because", 0],
              [" Because", 0],
              ["It", 0],
              ["Ray", 0],
              ["Since", 0],
              ["\u56E0\u4E3A", 0],
              ["Due", 0],
              ["Blue", 0],
              ["\u200B", 0],
              ['"', 0],
              ["\u201C", 0],
              ["It's", 0],
              ["Why", 0],
              ["A", 0],
              ["Cause", 0],
              ["**", 0],
            ],
          ],
          [
            " Ray",
            19781,
            "answer",
            1,
            [
              [" Ray", 1],
              ["\u202F", 0],
              [" atmospheric", 0],
              ["\xA0", 0],
              [" ray", 0],
              [" the", 0],
              ["Ray", 0],
              [" Earth", 0],
              [" Earth's", 0],
              [" Raman", 0],
              [" air", 0],
              [" tiny", 0],
              [" a", 0],
              [" (", 0],
              [" short", 0],
              [" Ra", 0],
              [" Raleigh", 0],
              [" Sun", 0],
              [" scattering", 0],
              [" R", 0],
            ],
          ],
          [
            "leigh",
            104153,
            "answer",
            1,
            [
              ["leigh", 1],
              ["\u202F", 0],
              ["lie", 0],
              ["\u2011", 0],
              ["le", 0],
              ["lee", 0],
              ["\xA0", 0],
              ["ley", 0],
              ["\xAD", 0],
              ["\u200B", 0],
              ["mond", 0],
              ["\u2010", 0],
              ["-ray", 0],
              ["let", 0],
              ["ly", 0],
              ["lay", 0],
              ["lace", 0],
              ["\u2009", 0],
              ["lel", 0],
              ["la", 0],
            ],
          ],
          [
            " scattering",
            109445,
            "answer",
            1,
            [
              [" scattering", 1],
              ["\u2011", 0],
              ["\u202F", 0],
              [" scatter", 0],
              ["\xA0", 0],
              ["-sc", 0],
              [" Sc", 0],
              ["\u2010", 0],
              ["\u2019s", 0],
              [" scattered", 0],
              ["\u2013", 0],
              [" (", 0],
              ["\u2014", 0],
              [" sc", 0],
              [" scrolling", 0],
              [" scanning", 0],
              [" atmospheric", 0],
              [
                `

`,
                0,
              ],
              ["'s", 0],
              [" diffusion", 0],
            ],
          ],
          [
            " scat",
            143716,
            "answer",
            0.80566,
            [
              [" scat", 0.80566],
              [" preferential", 0.12355],
              [" spreads", 0.04011],
              [" redirects", 0.01149],
              [" bends", 0.00543],
              [" dispers", 0.00479],
              [" causes", 0.002],
              [" makes", 0.002],
              [" sends", 0.00176],
              [" scatter", 31e-5],
              [" def", 31e-5],
              [" directs", 27e-5],
              [" more", 24e-5],
              [" selectively", 21e-5],
              ["\u202F", 19e-5],
              [" dif", 16e-5],
              [" scattering", 16e-5],
              [" diff", 14e-5],
              [" of", 14e-5],
              [" in", 1e-4],
            ],
          ],
          [
            "ters",
            2540,
            "answer",
            1,
            [
              ["ters", 1],
              ["its", 0],
              ["TERS", 0],
              ["\u202F", 0],
              ["\xAD", 0],
              ["\u2011", 0],
              ["erts", 0],
              ["ures", 0],
              ["les", 0],
              ["\xA0", 0],
              ["ens", 0],
              ["ers", 0],
              ["ulates", 0],
              ["ples", 0],
              ["apes", 0],
              ["gles", 0],
              ["ues", 0],
              ["ts", 0],
              ["ales", 0],
              [" the", 0],
            ],
          ],
          [
            " blue",
            9861,
            "answer",
            0.91507,
            [
              [" blue", 0.91507],
              [" the", 0.07511],
              [" short", 0.00897],
              [" shorter", 83e-5],
              [" sunlight", 0],
              ["\u202F", 0],
              [" blues", 0],
              [" Earth's", 0],
              [" brief", 0],
              [" light", 0],
              [" Blue", 0],
              [" blu", 0],
              [" more", 0],
              ["blue", 0],
              [" a", 0],
              [" (", 0],
              [" violet", 0],
              ["\xA0", 0],
              ["-blue", 0],
              [" green", 0],
            ],
          ],
          [
            " light",
            4207,
            "answer",
            0.99868,
            [
              [" light", 0.99868],
              [" wavelengths", 55e-5],
              [" sunlight", 43e-5],
              [" (", 34e-5],
              ["\u2011", 0],
              ["\u202F", 0],
              [",", 0],
              ["\u2014", 0],
              ["\u2010", 0],
              ["-light", 0],
              ["\u2019s", 0],
              ["\u2013", 0],
              [" short", 0],
              ["\u2014and", 0],
              [" Light", 0],
              ["\u2014the", 0],
              [" daylight", 0],
              [" and", 0],
              [" sun", 0],
              [" photons", 0],
            ],
          ],
          [
            " more",
            945,
            "answer",
            0.99954,
            [
              [" more", 0.99954],
              [" far", 34e-5],
              [" much", 1e-4],
              [" from", 1e-5],
              ["\u202F", 1e-5],
              ["\u2014", 0],
              [" in", 0],
              [" farther", 0],
              [" (", 0],
              ["\xA0", 0],
              ["\u2011", 0],
              ["\u200B", 0],
              ["\u2019s", 0],
              [",", 0],
              [" the", 0],
              [" about", 0],
              ["more", 0],
              [" a", 0],
              ["\u2009", 0],
              [" of", 0],
            ],
          ],
          [
            " than",
            1572,
            "answer",
            0.97485,
            [
              [" than", 0.97485],
              [" strongly", 0.02293],
              [" efficiently", 0.00188],
              [" effectively", 33e-5],
              [" intensely", 1e-5],
              ["\u202F", 0],
              [" readily", 0],
              [" heavily", 0],
              [" vigorously", 0],
              [" easily", 0],
              ["\xA0", 0],
              [" widely", 0],
              [" (", 0],
              ["\u2011", 0],
              [" sharply", 0],
              ["\u2014", 0],
              [" intens", 0],
              [",", 0],
              [" Than", 0],
              [" of", 0],
            ],
          ],
          [
            " other",
            1273,
            "answer",
            0.99325,
            [
              [" other", 0.99325],
              [" the", 0.00669],
              [" any", 6e-5],
              [" longer", 0],
              [" all", 0],
              [" colors", 0],
              [" others", 0],
              ["\u5176\u4ED6", 0],
              [" red", 0],
              ["\u202F", 0],
              [" it", 0],
              [" its", 0],
              [" higher", 0],
              [" every", 0],
              [" Other", 0],
              [" remaining", 0],
              [" (", 0],
              ["\xA0", 0],
              [" light", 0],
              [" a", 0],
            ],
          ],
          [
            " colors",
            10803,
            "answer",
            0.99781,
            [
              [" colors", 0.99781],
              [" wavelengths", 0.00193],
              [" colours", 26e-5],
              ["\u202F", 0],
              [" visible", 0],
              [" hues", 0],
              [" Colors", 0],
              [" sunlight", 0],
              ["Colors", 0],
              [" frequencies", 0],
              ["\u2011", 0],
              [" color", 0],
              [".colors", 0],
              ["colors", 0],
              [" colored", 0],
              [" solar", 0],
              [" (", 0],
              [" colores", 0],
              ["-colored", 0],
              [" COLORS", 0],
            ],
          ],
          [
            ",",
            11,
            "answer",
            0.97039,
            [
              [",", 0.97039],
              [".", 0.0293],
              [" of", 29e-5],
              [" in", 2e-5],
              [".\u200B", 0],
              [".,", 0],
              [" from", 0],
              [",.", 0],
              [".\u3010", 0],
              ["\u200B.", 0],
              [".\\", 0],
              ["\u200B", 0],
              [" and", 0],
              ["\uFF0C", 0],
              [" across", 0],
              ["\u3010", 0],
              [".\xAB", 0],
              ["\u2014", 0],
              ["\u200E", 0],
              [".\xBB", 0],
            ],
          ],
          [
            " the",
            290,
            "answer",
            0.63569,
            [
              [" the", 0.63569],
              [" giving", 0.18213],
              [" making", 0.18213],
              [" it", 3e-5],
              [" turning", 1e-5],
              [" leaving", 0],
              [" rendering", 0],
              ["\u202F", 0],
              [" causing", 0],
              [" coloring", 0],
              [" we", 0],
              [" tint", 0],
              [" filling", 0],
              [" which", 0],
              [" makes", 0],
              [" our", 0],
              ["making", 0],
              [" lending", 0],
              [" a", 0],
              [" so", 0],
            ],
          ],
          [
            " sky",
            17307,
            "answer",
            0.99973,
            [
              [" sky", 0.99973],
              [" daytime", 26e-5],
              [" daylight", 0],
              [" atmosphere", 0],
              [" day", 0],
              [" clear", 0],
              [" Sky", 0],
              [" sun", 0],
              [" midday", 0],
              [" overhead", 0],
              [" Earth's", 0],
              ["\u202F", 0],
              [" visible", 0],
              [" upward", 0],
              [" whole", 0],
              [" skyl", 0],
              [" Sun", 0],
              ["sky", 0],
              [" heavens", 0],
              [" skies", 0],
            ],
          ],
          [
            " appears",
            14518,
            "answer",
            0.99996,
            [
              [" appears", 0.99996],
              [" looks", 4e-5],
              [" appear", 0],
              [" Appe", 0],
              [" generally", 0],
              [" appearing", 0],
              ["appe", 0],
              [" usually", 0],
              [" normally", 0],
              [" typically", 0],
              ["\u202F", 0],
              [" often", 0],
              [" appeared", 0],
              ["\xA0", 0],
              [" appearance", 0],
              ["\u2011", 0],
              [" takes", 0],
              [" it", 0],
              ["\u2014", 0],
              [" erscheint", 0],
            ],
          ],
          [
            " blue",
            9861,
            "answer",
            1,
            [
              [" blue", 1],
              [" blu", 0],
              ["\u202F", 0],
              ["blue", 0],
              ["\u84DD", 0],
              [" Blue", 0],
              ["\xA0", 0],
              [" primarily", 0],
              [" azul", 0],
              [" predominantly", 0],
              ["-blue", 0],
              [" azure", 0],
              [" that", 0],
              [" bl", 0],
              [" to", 0],
              [" as", 0],
              [" mainly", 0],
              [" bright", 0],
              [" blues", 0],
              [" the", 0],
            ],
          ],
          [
            ".",
            13,
            "answer",
            1,
            [
              [".", 1],
              [".\u200B", 0],
              ["\u200B.", 0],
              ["\u0964", 0],
              ["\u3002", 0],
              [".\u200F", 0],
              [".)", 0],
              ["..", 0],
              [
                `.

`,
                0,
              ],
              ["\u06D4", 0],
              [".\u3010", 0],
              ["\uFF0E", 0],
              [".?", 0],
              [".;", 0],
              [".\xBB", 0],
              ["\u200C.", 0],
              [".]", 0],
              ['."', 0],
              [".</", 0],
              [
                `.
`,
                0,
              ],
            ],
          ],
          ["<|return|>", 200002, "mark"],
        ],
        provider: "DekaLLM",
        usage: { in: 86, out: 247, think: 225 },
      },
    },
    vocab: 201088,
    model: "openai/gpt-oss-120b",
    date: "2026-10-01",
  },
  Me = {
    name: "gpt-oss-120b",
    layers: 36,
    width: 2880,
    heads: 64,
    kvHeads: 8,
    headDim: 64,
    experts: 128,
    active: 4,
    window: 128,
    vocab: 201088,
    ctx: 131072,
    params: 11683e7,
    activeParams: 513e7,
    expertParams: 2488e4,
    attnParams: 96e7,
    embedParams: 116e7,
    expertBytes: (2488e4 * 4.25) / 8,
    checkpointGiB: 60.8,
  },
  S0 = {
    name: "H100 SXM",
    hbmGB: 80,
    bw: 335e10,
    tflops: 989,
    sms: 132,
    watts: 700,
    l2MB: 50,
    bwEff: 0.8,
    flopsEff: 0.45,
  },
  zo = 2 * Me.kvHeads * Me.headDim * 2 * Me.layers,
  Lc = zo / Me.layers,
  cn = {
    mark: { c: "#8c93a8", n: "marker" },
    sys: { c: "#9db0e0", n: "system" },
    dev: { c: "#b9a2ff", n: "the app" },
    user: { c: "#ffb454", n: "you" },
    hist: { c: "#6f7a94", n: "earlier chat" },
    think: { c: "#7df0b4", n: "thinking" },
    answer: { c: "#7fe3ff", n: "answer" },
  },
  Aa = 2e4,
  Pa = 24,
  De = { think: 0, temp: 1, hist: 0, busy: 1 },
  mt = () => (De.think ? tt.runs.high : De.temp ? tt.runs.low : tt.runs.greedy),
  xo = () => [5, 32, 256][De.busy],
  Ho = 24;
let Ae = [],
  ue = 86,
  ot = 34,
  Is = -1;
function Bc() {
  const e = mt();
  Ae = [];
  let t = 0;
  Is = -1;
  const n = (s, r, a, o = {}) => {
    (Ae.push({ t: s, id: r, role: a, pos: t, gen: -1, ...o }),
      (t += o.many || 1));
  };
  (tt.prompt.forEach(([s, r, a], o) => {
    if (De.hist && o === tt.prompt.findIndex((i) => i[0] === "user") - 1) {
      Is = Ae.length;
      for (let i = 0; i < Pa; i++) n("\u2026", -1, "hist", { many: Aa / Pa });
    }
    De.think && s === " low" ? n(" high", 1932, a) : n(s, r, a);
  }),
    (ue = Ae.length),
    e.gen.forEach(([s, r, a, o, i], c) => {
      n(s, r, a === "think" ? "think" : a === "answer" ? "answer" : "mark", {
        gen: c,
        p: o,
        top: i,
      });
    }),
    (ot = e.gen.length));
}
const yt = () => 86 + (De.hist ? Aa : 0);
function _c(e) {
  return Me.experts * (1 - Math.pow(1 - Me.active / Me.experts, e));
}
function oi(e, t, n) {
  const s = _c(e + t),
    r = Me.attnParams * 2 + Me.embedParams + s * Me.layers * Me.expertBytes,
    a = 1500,
    o = e * a * zo + (n || 0) * zo,
    i = r + o,
    c =
      2 * Me.activeParams * (e + t) +
      (t > 1
        ? 4 *
          Me.heads *
          Me.headDim *
          (((Me.layers / 2) * t * (t + (n || 0))) / 2 +
            (Me.layers / 2) * t * Math.min(t, 128))
        : 0),
    f = (i / (S0.bw * S0.bwEff)) * 1e3,
    d = (c / (S0.tflops * 1e12 * S0.flopsEff)) * 1e3;
  return {
    ms: Math.max(f, d) + 1.2,
    bytes: i,
    weights: r,
    flops: c,
    experts: s,
    tMem: f,
    tMath: d,
  };
}
let k = {};
function ni() {
  Bc();
  const e = xo(),
    t = mt(),
    n = {};
  ((n.send = 2.4),
    (n.arrive = n.send + Ho),
    (n.gate = n.arrive + 2),
    (n.safe = n.gate + 6),
    (n.lb = n.safe + 0.6),
    (n.tok = n.lb + 0.3),
    (n.wait = [1.5, 6, 34][De.busy]),
    (n.admit = n.tok + n.wait));
  const s = De.hist === 2 ? 12 : yt(),
    r = yt() - s;
  si =
    De.hist === 2
      ? Ae.findIndex((c) => c.t === "user" && c.role === "mark") - 1
      : 0;
  const a = oi(e - 1, s, r);
  n.steps = [
    {
      t0: n.admit,
      t1: n.admit + a.ms,
      kind: "prefill",
      cost: a,
      newTok: s,
      cached: r,
    },
  ];
  const o = oi(e, 0, 0);
  ((n.decode = o), (n.prefill = a));
  for (let c = 1; c < ot; c++) {
    const f = n.steps[c - 1].t1;
    n.steps.push({ t0: f, t1: f + o.ms, kind: "decode", cost: o });
  }
  ((n.gen = n.steps.map((c) => c.t1)),
    (n.end = n.gen[ot - 1]),
    (n.arr = n.gen.map((c, f) => c + 0.3 + Ho)));
  const i = t.gen;
  return (
    (n.firstThink = i.findIndex((c) => c[2] === "think")),
    (n.firstAns = i.findIndex((c) => c[2] === "answer")),
    (n.lastAns = i.map((c) => c[2]).lastIndexOf("answer")),
    (n.first = n.arr[n.firstAns]),
    (n.done = n.end + 0.3 + Ho),
    (n.total = n.done + 3),
    (n.thinkMs = n.gen[n.firstAns] - n.gen[0]),
    (n.kvBytes = (yt() + ot - 1) * zo),
    (n.bytesRead = a.bytes + o.bytes * (ot - 1)),
    (n.myBytes = (a.bytes / (e - 1 + s)) * s + (o.bytes / e) * (ot - 1)),
    (n.flopsMine = 2 * Me.activeParams * (s + ot - 1)),
    (n.joules =
      ((a.ms * (s / (e - 1 + s)) + (o.ms / e) * (ot - 1)) / 1e3) * 600 * 2),
    (k = n),
    n
  );
}
const St = 0.06,
  Tt = 0.9;
function wo(e) {
  const t = k.steps;
  if (!t || e < t[0].t0) return -1;
  for (let n = 0; n < t.length; n++) if (e < t[n].t1) return n;
  return t.length;
}
let si = 0;
const ai = (e) =>
  e < si ? -2 : e < ue ? 0 : e - ue + 1 < ot ? e - ue + 1 : -1;
function ri(e, t) {
  const n = ai(e);
  if (n === -2) return Me.layers;
  if (n < 0) return 0;
  const s = k.steps[n];
  return U(es(s, t) / Me.layers, 0, 1) * Me.layers;
}
function es(e, t) {
  const n = e.t1 - e.t0;
  return ((t - e.t0 - St * n) / ((Tt - St) * n)) * Me.layers;
}
const ii = (e) => (e < ue ? -1e9 : k.gen[e - ue]),
  ao = (e) =>
    e >= 1e12
      ? (e / 1e12).toFixed(1) + " TB"
      : e >= 1e9
        ? (e / 1e9).toFixed(e >= 1e10 ? 0 : 1) + " GB"
        : e >= 1e6
          ? (e / 1e6).toFixed(e >= 1e7 ? 0 : 1) + " MB"
          : e >= 1e3
            ? Math.round(e / 1e3) + " KB"
            : e + " B",
  Qt = (e) =>
    e < 1 ? e.toFixed(2) : e < 10 ? e.toFixed(1) : Math.round(e).toString(),
  It = (e) => (e / 1e3).toFixed(e < 1e3 ? 3 : 2),
  bt = (e) =>
    e === "\u2026"
      ? "\u2026"
      : e
          .replace(/\n/g, "\u23CE")
          .replace(/\u200b/g, "[zwsp]")
          .replace(/[\u202f\u00a0]/g, "[nbsp]")
          .replace(/\u00ad/g, "[shy]")
          .replace(/^ /, "\xB7");
ni();
const Oe = new l.Group();
(Oe.position.set(Re.desk, 0, 0), Yn.add(Oe));
const Ye = {
    laptop: [0.42, 0.77, -1.49],
    screen: [0.42, 0.87, -1.6],
    router: [1.96, 1.16, -1.74],
    lamp: [0.9, 1.15, -1.55],
    mug: [0.79, 0.82, -1.31],
    window: [0.62, 1.62, -1.97],
    chair: [1.14, 0.6, -0.72],
    phone: [-0.02, 0.76, -1.64],
    notebook: [0, 0.77, -1.34],
    desk: [0.62, 0.752, -1.53],
    room: [0, 1.2, -0.1],
  },
  Ne = {},
  Ao = (() => {
    const e = new l.Vector3(),
      t = new l.Vector3(),
      n = new l.Vector3(),
      s = new l.Vector3(),
      r = new l.Vector3(),
      a = new l.Vector3(),
      o = new l.Vector3(),
      i = new l.Matrix4(),
      c = new l.Quaternion(),
      f = new l.Quaternion(),
      d = new l.Euler(0, 0, 0, "YXZ");
    function h(P, H = 1, N = !1) {
      const E = P.attributes.position,
        _ = new Float32Array(E.count * 2);
      for (let A = 0; A < E.count; A += 3) {
        (e.fromBufferAttribute(E, A),
          t.fromBufferAttribute(E, A + 1),
          n.fromBufferAttribute(E, A + 2),
          s.subVectors(n, t).cross(r.subVectors(e, t)));
        const F = Math.abs(s.x),
          $ = Math.abs(s.y),
          Q = Math.abs(s.z);
        for (let W = 0; W < 3; W++) {
          const te = W === 0 ? e : W === 1 ? t : n;
          let ce, me;
          if (
            (F >= $ && F >= Q
              ? ((ce = te.z * Math.sign(s.x || 1)), (me = te.y))
              : $ >= Q
                ? ((ce = te.x), (me = te.z * Math.sign(s.y || 1)))
                : ((ce = -te.x * Math.sign(s.z || 1)), (me = te.y)),
            N)
          ) {
            const ve = ce;
            ((ce = me), (me = ve));
          }
          ((_[(A + W) * 2] = ce * H), (_[(A + W) * 2 + 1] = me * H));
        }
      }
      return (P.setAttribute("uv", new l.BufferAttribute(_, 2)), P);
    }
    const m = (P, H, N = 1) => ({
      isTint: !0,
      base: P,
      col: new l.Color(H).multiplyScalar(N),
    });
    function p() {
      const P = new Map(),
        H = new l.Matrix4();
      let N = !1;
      const E = (_, A, F, $, Q, W = {}) => {
        let te = null;
        (_.isTint && ((te = _.col), (_ = _.base)),
          (A = A.index ? A.toNonIndexed() : A));
        for (const ve of Object.keys(A.attributes))
          ve !== "position" &&
            ve !== "normal" &&
            ve !== "uv" &&
            ve !== "color" &&
            A.deleteAttribute(ve);
        (W.s && A.scale(W.s[0], W.s[1], W.s[2]),
          W.uv !== "keep" &&
            (W.uv === "box" || _.userData.boxUV) &&
            h(A, _.userData.boxUV || 1, !!W.vgrain),
          W.dir
            ? (c.setFromUnitVectors(
                Zt,
                r.set(W.dir[0], W.dir[1], W.dir[2]).normalize(),
              ),
              W.roll && c.multiply(f.setFromAxisAngle(Zt, W.roll)))
            : (d.set(W.rx || 0, W.ry || 0, W.rz || 0), c.setFromEuler(d)),
          i.compose(a.set(F, $, Q), c, o.set(1, 1, 1)),
          N && i.premultiply(H),
          A.applyMatrix4(i),
          A.attributes.uv ||
            A.setAttribute(
              "uv",
              new l.Float32BufferAttribute(
                new Float32Array(A.attributes.position.count * 2),
                2,
              ),
            ));
        const ce = A.attributes.position.count;
        if (_.vertexColors)
          if (A.attributes.color) {
            if (te) {
              const ve = A.attributes.color;
              for (let ke = 0; ke < ce; ke++)
                ve.setXYZ(
                  ke,
                  ve.getX(ke) * te.r,
                  ve.getY(ke) * te.g,
                  ve.getZ(ke) * te.b,
                );
            }
          } else {
            const ve = new Float32Array(ce * 3);
            for (let ke = 0; ke < ce; ke++)
              ((ve[ke * 3] = te ? te.r : 1),
                (ve[ke * 3 + 1] = te ? te.g : 1),
                (ve[ke * 3 + 2] = te ? te.b : 1));
            A.setAttribute("color", new l.BufferAttribute(ve, 3));
          }
        else A.attributes.color && A.deleteAttribute("color");
        let me = P.get(_);
        (me || P.set(_, (me = [])), me.push(A));
      };
      return {
        frame(_ = 0, A = 0, F = 0, $ = 0) {
          return (
            (N = !!(_ || A || F || $)),
            H.makeRotationY($).setPosition(_, A, F),
            this
          );
        },
        pt(_, A, F) {
          const $ = new l.Vector3(_, A, F);
          return N ? $.applyMatrix4(H) : $;
        },
        box(_, A, F, $, Q, W, te, ce = {}) {
          return (
            E(
              _,
              ce.r
                ? _n(Q, W, te, ce.r, ce.seg || 2)
                : new l.BoxGeometry(Q, W, te),
              A,
              F,
              $,
              ce,
            ),
            this
          );
        },
        cyl(_, A, F, $, Q, W, te, ce = {}) {
          return (
            E(
              _,
              new l.CylinderGeometry(Q, W, te, ce.seg || 16, 1, !!ce.open),
              A,
              F,
              $,
              ce,
            ),
            this
          );
        },
        sph(_, A, F, $, Q, W = {}) {
          return (
            E(
              _,
              new l.SphereGeometry(
                Q,
                W.seg || 12,
                W.seg2 || 8,
                0,
                Math.PI * 2,
                0,
                W.half ? Math.PI / 2 : Math.PI,
              ),
              A,
              F,
              $,
              W,
            ),
            this
          );
        },
        tor(_, A, F, $, Q, W, te = {}) {
          return (
            E(
              _,
              new l.TorusGeometry(
                Q,
                W,
                te.rs || 6,
                te.ts || 24,
                te.arc || Math.PI * 2,
              ),
              A,
              F,
              $,
              te,
            ),
            this
          );
        },
        geo(_, A, F = 0, $ = 0, Q = 0, W = {}) {
          return (E(_, A.clone(), F, $, Q, W), this);
        },
        tube(_, A, F, $ = {}) {
          const Q = new l.CatmullRomCurve3(
            A.map((W) => (W.isVector3 ? W : new l.Vector3(...W))),
            !!$.closed,
            $.tension != null ? "catmullrom" : "centripetal",
            $.tension ?? 0.5,
          );
          return (
            E(
              _,
              new l.TubeGeometry(
                Q,
                $.n || Math.max(8, A.length * 6),
                F,
                $.seg || 6,
                !!$.closed,
              ),
              0,
              0,
              0,
              { uv: $.uv || "keep" },
            ),
            this
          );
        },
        fbox(_, A, F, $, Q, W, te) {
          if (F - A < 1e-4 || Q - $ < 1e-4 || te - W < 1e-4) return this;
          const ce = new l.BoxGeometry(F - A, Q - $, te - W)
            .translate((A + F) / 2, ($ + Q) / 2, (W + te) / 2)
            .toNonIndexed();
          for (let me = 0; me < 6; me++) {
            if (!_[me]) continue;
            const ve = new l.BufferGeometry();
            for (const ke of ["position", "normal"]) {
              const kt = ce.attributes[ke];
              ve.setAttribute(
                ke,
                new l.BufferAttribute(kt.array.slice(me * 18, me * 18 + 18), 3),
              );
            }
            E(_[me], ve, 0, 0, 0);
          }
          return this;
        },
        flush(_, A = !0) {
          const F = [];
          for (const [$, Q] of P) {
            const W = new l.Mesh(h0(Q), $);
            ((W.castShadow = A && !$.transparent && !$.isMeshBasicMaterial),
              (W.receiveShadow = !$.isMeshBasicMaterial),
              _.add(W),
              F.push(W),
              Q.forEach((te) => te.dispose()));
          }
          return (P.clear(), F);
        },
      };
    }
    function x(P, H, N) {
      const E = new l.Shape(),
        _ = -P / 2,
        A = -H / 2,
        F = P / 2,
        $ = H / 2;
      return (
        (N = Math.min(N, P / 2 - 1e-4, H / 2 - 1e-4)),
        E.moveTo(_ + N, A),
        E.lineTo(F - N, A),
        E.absarc(F - N, A + N, N, -Math.PI / 2, 0),
        E.lineTo(F, $ - N),
        E.absarc(F - N, $ - N, N, 0, Math.PI / 2),
        E.lineTo(_ + N, $),
        E.absarc(_ + N, $ - N, N, Math.PI / 2, Math.PI),
        E.lineTo(_, A + N),
        E.absarc(_ + N, A + N, N, Math.PI, Math.PI * 1.5),
        E
      );
    }
    function w(P, H, N, E, _ = 0.0015, A = 3) {
      const F = new l.ExtrudeGeometry(
        x(P - 2 * _, H - 2 * _, Math.max(E - _, 6e-4)),
        {
          depth: Math.max(N - 2 * _, 1e-4),
          bevelEnabled: _ > 0,
          bevelThickness: _,
          bevelSize: _,
          bevelSegments: A,
          curveSegments: 8,
        },
      );
      return (F.translate(0, 0, _), F.rotateX(-Math.PI / 2), F);
    }
    function g(P, H, N, E = 8) {
      const _ = new l.ShapeGeometry(x(P, H, N), E);
      return (_.rotateX(-Math.PI / 2), _);
    }
    const u = (P, H = 24) =>
      new l.LatheGeometry(
        P.map(([N, E]) => new l.Vector2(Math.max(N, 0), E)),
        H,
      );
    function y(P) {
      P = P.index ? P.toNonIndexed() : P;
      const H = P.attributes.position,
        N = new Map(),
        E = [],
        _ = [];
      for (let F = 0; F < H.count; F++) {
        const $ = H.getX(F),
          Q = H.getY(F),
          W = H.getZ(F),
          te =
            Math.round($ * 4e3) +
            "_" +
            Math.round(Q * 4e3) +
            "_" +
            Math.round(W * 4e3);
        let ce = N.get(te);
        (ce === void 0 && ((ce = E.length / 3), N.set(te, ce), E.push($, Q, W)),
          _.push(ce));
      }
      const A = new l.BufferGeometry();
      return (
        A.setAttribute("position", new l.Float32BufferAttribute(E, 3)),
        A.setIndex(_),
        A.computeVertexNormals(),
        A
      );
    }
    function b(P, H, N, E = 0.05, _ = 0.018, A = 3) {
      const F = new f0(P, H, N, A, Math.min(E, Math.min(P, H, N) / 2.02)),
        $ = F.attributes.position;
      for (let Q = 0; Q < $.count; Q++) {
        const W = $.getX(Q) / (P / 2),
          te = $.getZ(Q) / (N / 2),
          ce = $.getY(Q);
        ce > 0 &&
          $.setY(
            Q,
            ce +
              _ *
                Math.max(0, 1 - W * W) *
                Math.max(0, 1 - te * te) *
                (ce / (H / 2)),
          );
      }
      return y(F);
    }
    function M(P, H, N, E = 7) {
      const _ = new l.BoxGeometry(P, H, N, E, E, 1),
        A = _.attributes.position;
      for (let F = 0; F < A.count; F++) {
        const $ = A.getX(F) / (P / 2),
          Q = A.getY(F) / (H / 2),
          W =
            Math.pow(Math.max(0, 1 - $ * $), 0.55) *
            Math.pow(Math.max(0, 1 - Q * Q), 0.55);
        (A.setZ(F, A.getZ(F) * (0.16 + 0.84 * W)),
          A.setX(F, A.getX(F) * (1 - 0.07 * Q * Q)),
          A.setY(F, A.getY(F) * (1 - 0.07 * $ * $)));
      }
      return y(_);
    }
    function T(
      P,
      H,
      {
        fold: N = 0.25,
        curl: E = 0.18,
        shape: _ = "oval",
        seg: A = 6,
        edge: F = null,
      } = {},
    ) {
      const $ = [],
        Q = [],
        W = [];
      for (let ve = 0; ve <= A; ve++) {
        const ke = ve / A;
        let kt =
          _ === "fiddle"
            ? Math.sin(Math.PI * Math.pow(ke, 0.75)) * (0.62 + 0.55 * ke)
            : _ === "heart"
              ? Math.sin(Math.PI * Math.pow(ke, 0.6)) * (1.1 - 0.3 * ke)
              : _ === "blade"
                ? Math.pow(
                    Math.sin(Math.PI * Math.min(1, 0.08 + ke * 0.95)),
                    0.45,
                  ) *
                  (1 - 0.5 * ke)
                : Math.sin(Math.PI * ke) * (1 - 0.2 * ke);
        kt = Math.max((kt * H) / 2, 0.0012);
        for (let Mt = -2; Mt <= 2; Mt++) {
          const Wt = Mt / 2;
          $.push(Wt * kt, ke * P, -Math.abs(Wt) * kt * N - E * P * ke * ke);
          const Ot = 1 - Math.abs(Wt);
          F && Math.abs(Wt) > 0.99
            ? Q.push(...F)
            : Q.push(
                0.8 + 0.3 * Ot * Ot * Ot,
                0.84 + 0.24 * Ot * Ot * Ot,
                0.8 + 0.2 * Ot * Ot * Ot,
              );
        }
      }
      const ce = 5;
      for (let ve = 0; ve < A; ve++)
        for (let ke = 0; ke < ce - 1; ke++) {
          const kt = ve * ce + ke,
            Mt = kt + 1,
            Wt = kt + ce,
            Ot = Wt + 1;
          W.push(kt, Wt, Mt, Mt, Wt, Ot);
        }
      const me = new l.BufferGeometry();
      return (
        me.setAttribute("position", new l.Float32BufferAttribute($, 3)),
        me.setAttribute("color", new l.Float32BufferAttribute(Q, 3)),
        me.setIndex(W),
        me.computeVertexNormals(),
        me.toNonIndexed()
      );
    }
    const S = new l.Vector3(),
      C = new l.Vector3(),
      R = new l.Vector3(),
      z = new l.Matrix4(),
      I = new l.Matrix4();
    function G(P, H, N, E, _) {
      (C.copy(N).normalize(),
        R.set(0, 1, 0).addScaledVector(C, -C.y),
        R.lengthSq() < 1e-4 && R.set(0, 0, 1),
        R.normalize(),
        S.crossVectors(C, R),
        z.makeBasis(S, C, R),
        P.applyMatrix4(z.premultiply(I.makeRotationAxis(C, E))),
        P.translate(H.x, H.y, H.z));
      const A = P.attributes.color;
      for (let F = 0; F < A.count; F++)
        A.setXYZ(F, A.getX(F) * _.r, A.getY(F) * _.g, A.getZ(F) * _.b);
      return P;
    }
    function V(P, H, N, E, _, A, F, $, Q = 0, W = null) {
      const te = m(ee, $),
        ce = m(ee, "#ebe4d6"),
        me = Math.cos(Q),
        ve = Math.sin(Q),
        ke = (Mt, Wt) => [H + Mt * me + Wt * ve, E - Mt * ve + Wt * me],
        kt = (Mt, Wt, Ot, ya, Zl, Ql, Jl) => {
          const [ec, tc] = ke(Wt, ya);
          P.box(Mt, ec, N + Ot, tc, Zl, Ql, Jl, { ry: Q });
        };
      if (
        (kt(te, -_ / 2 + 0.00125, A / 2, 0, 0.0025, A, F),
        kt(te, _ / 2 - 0.00125, A / 2, 0, 0.0025, A, F),
        kt(te, 0, A / 2, F / 2 - 0.0015, _, A, 0.003),
        kt(ce, 0, A / 2 - 0.0015, -0.0015, _ - 0.005, A - 0.007, F - 0.006),
        W)
      )
        for (const Mt of [A - 0.02, A - 0.028, 0.024])
          kt(m(ee, W), 0, Mt, F / 2 + 3e-4, _ - 0.0012, 0.0024, 0.001);
    }
    const B = ["#34552f", "#3e6437", "#4a7240", "#2e4b31", "#56793f"].map(
        (P) => new l.Color(P),
      ),
      O = (P) =>
        B[Math.floor(P() * B.length)].clone().multiplyScalar(0.85 + P() * 0.3),
      j = (P) => ((P.wrapS = P.wrapT = l.RepeatWrapping), P),
      J = j(
        We(512, 512, (P, H, N) => {
          ((P.fillStyle = "#ebe4d8"), P.fillRect(0, 0, H, N));
          const E = ye(21);
          for (let _ = 0; _ < 170; _++) {
            const A = E() * N,
              F = 0.035 + E() * 0.07,
              $ = E() < 0.72,
              Q = E() * 6.28,
              W = 1 + Math.floor(E() * 3),
              te = 1 + E() * 5;
            ((P.strokeStyle = $
              ? `rgba(96,66,38,${F})`
              : `rgba(255,250,240,${F})`),
              (P.lineWidth = 0.6 + E() * 2.4));
            for (const ce of [-N, 0, N])
              if (!(A + ce < -10 || A + ce > N + 10)) {
                P.beginPath();
                for (let me = 0; me <= H; me += 16) {
                  const ve = A + ce + Math.sin((me / H) * 6.2832 * W + Q) * te;
                  me ? P.lineTo(me, ve) : P.moveTo(me, ve);
                }
                P.stroke();
              }
          }
          for (let _ = 0; _ < 3e3; _++)
            ((P.fillStyle = `rgba(80,55,30,${0.04 + E() * 0.06})`),
              P.fillRect(E() * H, E() * N, 2 + E() * 6, 1));
        }),
      ),
      K = j(
        We(256, 256, (P, H, N) => {
          ((P.fillStyle = "#ece8e1"), P.fillRect(0, 0, H, N));
          const E = ye(5);
          for (let _ = 0; _ < N; _ += 4)
            for (let A = 0; A < H; A += 4) {
              const F = E();
              ((P.fillStyle =
                F < 0.5
                  ? `rgba(70,60,50,${0.05 + E() * 0.07})`
                  : `rgba(255,252,246,${0.07 + E() * 0.08})`),
                P.fillRect(A + ((_ >> 2) & 1) * 2, _, 3, 2));
            }
        }),
      ),
      X = j(
        We(256, 256, (P, H, N) => {
          ((P.fillStyle = "#f1ede6"), P.fillRect(0, 0, H, N));
          const E = ye(9);
          for (let _ = 0; _ < 170; _++) {
            const A = E() * H,
              F = E() * N,
              $ = 12 + E() * 60,
              Q = 0.03 + E() * 0.05,
              W = E() < 0.55 ? "110,100,90" : "255,255,255",
              te = P.createRadialGradient(A, F, 0, A, F, $);
            (te.addColorStop(0, `rgba(${W},${Q})`),
              te.addColorStop(1, `rgba(${W},0)`),
              (P.fillStyle = te));
            for (const ce of [-H, 0, H])
              for (const me of [-N, 0, N])
                A + ce + $ < 0 ||
                  A + ce - $ > H ||
                  F + me + $ < 0 ||
                  F + me - $ > N ||
                  (P.setTransform(1, 0, 0, 1, ce, me),
                  P.fillRect(A - $, F - $, $ * 2, $ * 2));
            P.setTransform(1, 0, 0, 1, 0, 0);
          }
        }),
      ),
      q = j(
        We(256, 256, (P, H, N) => {
          ((P.fillStyle = "#e9e2d8"), P.fillRect(0, 0, H, N));
          const E = ye(12);
          for (let _ = 0; _ < 2600; _++) {
            const A = E() * H,
              F = E() * N,
              $ = 1 + E() * 2.6;
            ((P.fillStyle =
              E() < 0.5
                ? `rgba(90,70,55,${0.05 + E() * 0.07})`
                : `rgba(255,250,242,${0.05 + E() * 0.08})`),
              P.beginPath(),
              P.arc(A, F, $, 0, 7),
              P.fill());
          }
        }),
      ),
      ne = j(
        We(1024, 1024, (P, H, N) => {
          const E = ye(4),
            _ = 7,
            A = N / _;
          for (let F = 0; F < _; F++) {
            const $ = F * A;
            let Q = -E() * 400;
            for (; Q < H;) {
              const W = 320 + E() * 480,
                te = E(),
                ce = Array.from({ length: 10 }, () => [
                  E() < 0.7,
                  0.05 + E() * 0.07,
                  1 + E() * 2.5,
                  $ + 4 + E() * (A - 8),
                  (E() - 0.5) * 10,
                  (E() - 0.5) * 10,
                  (E() - 0.5) * 4,
                ]);
              for (const me of [0, H])
                if (!(Q + W - me <= 0 || Q - me >= H)) {
                  (P.save(),
                    P.translate(-me, 0),
                    (P.fillStyle = `hsl(${30 + te * 4},${24 + te * 8}%,${50 + te * 9}%)`),
                    P.fillRect(Q, $, W, A));
                  for (const [ve, ke, kt, Mt, Wt, Ot, ya] of ce)
                    ((P.strokeStyle = ve
                      ? `rgba(95,62,32,${ke})`
                      : `rgba(255,245,225,${ke})`),
                      (P.lineWidth = kt),
                      P.beginPath(),
                      P.moveTo(Q, Mt),
                      P.bezierCurveTo(
                        Q + W * 0.3,
                        Mt + Wt,
                        Q + W * 0.6,
                        Mt + Ot,
                        Q + W,
                        Mt + ya,
                      ),
                      P.stroke());
                  ((P.fillStyle = "rgba(50,32,16,.55)"),
                    P.fillRect(Q + W - 1.5, $, 3, A),
                    P.restore());
                }
              Q += W;
            }
            ((P.fillStyle = "rgba(50,32,16,.5)"),
              P.fillRect(0, $, H, 2.5),
              (P.fillStyle = "rgba(255,240,220,.08)"),
              P.fillRect(0, $ + 2.5, H, 2));
          }
        }),
      ),
      le = (P, H) =>
        pt(new l.MeshStandardMaterial({ map: P, vertexColors: !0, ...H })),
      ee = se("#ffffff", {
        vertexColors: !0,
        roughness: 0.82,
        envMapIntensity: 0.32,
      }),
      Te = se("#ffffff", {
        vertexColors: !0,
        roughness: 0.38,
        envMapIntensity: 0.62,
      }),
      fe = Le("#ffffff", { vertexColors: !0, roughness: 0.3, metalness: 0.9 }),
      de = Uo("#ffffff", {
        vertexColors: !0,
        roughness: 0.22,
        clearcoatRoughness: 0.12,
      }),
      Pe = se("#ffffff", {
        vertexColors: !0,
        flatShading: !0,
        roughness: 0.62,
        side: l.DoubleSide,
        envMapIntensity: 0.55,
      }),
      Ce = le(J, { roughness: 0.46, envMapIntensity: 0.5 });
    Ce.userData.boxUV = 1 / 1.1;
    const Ue = le(K, { roughness: 0.96, envMapIntensity: 0.2 });
    Ue.userData.boxUV = 1 / 0.26;
    const it = le(X, { roughness: 0.93, envMapIntensity: 0.22 });
    it.userData.boxUV = 1 / 2.2;
    const ut = pt(
      new l.MeshPhysicalMaterial({
        map: q,
        vertexColors: !0,
        roughness: 0.46,
        clearcoat: 0.35,
        clearcoatRoughness: 0.35,
        envMapIntensity: 0.8,
      }),
    );
    ut.userData.boxUV = 1 / 0.3;
    const Yt = new l.MeshBasicMaterial({ vertexColors: !0, fog: !1 }),
      Ro = new l.MeshBasicMaterial({
        vertexColors: !0,
        fog: !1,
        side: l.BackSide,
      }),
      on = (P, H) => m(Yt, P, H),
      vt = (P, H) => m(Ro, P, H);
    for (const [P, H] of Object.entries({
      VC: ee,
      VS: Te,
      VM: fe,
      VP: de,
      FOL: Pe,
      WOOD: Ce,
      FAB: Ue,
      LIME: it,
      LEATH: ut,
      GLOWV: Yt,
      GLOWB: Ro,
    }))
      H.name = "desk." + P;
    return {
      B: p,
      T: m,
      G: on,
      GB: vt,
      boxUV: h,
      rr2: x,
      slab: w,
      flat: g,
      lathe: u,
      soft: y,
      cushion: b,
      pillow: M,
      book: V,
      leafGeo: T,
      placeLeaf: G,
      leafTint: O,
      planks: ne,
      VC: ee,
      VS: Te,
      VM: fe,
      VP: de,
      FOL: Pe,
      WOOD: Ce,
      FAB: Ue,
      LIME: it,
      LEATH: ut,
      GLOWV: Yt,
      GLOWB: Ro,
    };
  })(),
  En = {
    x0: -2.3,
    x1: 2.46,
    z0: -1.9,
    z1: 1.32,
    t: 0.16,
    h: 2.72,
    slab: 0.34,
    win: { x0: -0.43, x1: 1.67, y0: 0.82, y1: 2.42, mul: 1.12 },
    desk: { x: 0.62, z: -1.53, w: 1.5, d: 0.7, y: 0.752 },
  };
{
  const e = Ao,
    { T: t, VC: n, VS: s, VM: r, LIME: a, WOOD: o } = e,
    i = e.B(),
    c = En,
    { x0: f, x1: d, z0: h, z1: m, t: p, h: x } = c,
    w = c.win,
    g = t(a, "#66717f"),
    u = t(n, "#16171b"),
    y = t(s, "#5f6a78"),
    b = t(o, "#a98a66"),
    M = t(r, "#2c2a27"),
    T = t(o, "#ad9170");
  (i.fbox([u, null, null, u, u, null], f - p, d, -c.slab, -0.022, h - p, m),
    i.fbox([b, null, null, null, b, null], f - p, d, -0.022, -7e-4, h - p, m),
    i
      .box(
        t(r, "#b08d57"),
        d + 0.0015,
        -0.029,
        (h - p + m) / 2,
        0.003,
        0.004,
        m - h + p,
      )
      .box(
        t(r, "#b08d57"),
        (f - p + d) / 2,
        -0.029,
        m + 0.0015,
        d - f + p,
        0.004,
        0.003,
      ));
  const S = (C, R, z, I, G) =>
    i.fbox(
      [
        R >= d - 1e-4 ? u : g,
        C <= f - p + 1e-4 ? null : g,
        G ? u : g,
        z <= 0 ? null : g,
        g,
        null,
      ],
      C,
      R,
      z,
      I,
      h - p,
      h,
    );
  (S(f - p, w.x0, 0, x, !0),
    S(w.x1, d, 0, x, !0),
    S(w.x0, w.x1, 0, w.y0, !1),
    S(w.x0, w.x1, w.y1, x, !0),
    i.fbox([g, null, u, null, u, null], f - p, f, 0, x, h, m),
    i.fbox([u, g, u, null, g, null], d - p, d, 0, x, h, h + 0.42),
    i.fbox([u, null, u, null, u, g], f, f + 0.44, 0, x, m - p, m),
    i
      .box(y, (f + d - p) / 2, 0.035, h + 0.008, d - p - f, 0.07, 0.016)
      .box(
        y,
        f + 0.008,
        0.035,
        (h + m - p) / 2 + 0.004,
        0.016,
        0.07,
        m - p - h - 0.01,
      ));
  {
    const z = h - p * 0.45,
      I = (w.x0 + w.x1) / 2,
      G = w.x1 - w.x0,
      V = w.y1 - w.y0,
      B = (w.y0 + w.y1) / 2;
    (i
      .box(M, w.x0 + 0.05 / 2, B, z, 0.05, V, 0.075)
      .box(M, w.x1 - 0.05 / 2, B, z, 0.05, V, 0.075)
      .box(M, I, w.y1 - 0.05 / 2, z, G, 0.05, 0.075)
      .box(M, I, w.y0 + 0.05 / 2, z, G, 0.05, 0.075),
      i.box(M, w.mul, B, z, 0.044, V - 0.05, 0.075 - 0.008),
      i
        .box(M, w.mul + 0.075, B, z + 0.05, 0.014, 0.14, 0.014)
        .box(M, w.mul + 0.075, B + 0.06, z + 0.03, 0.016, 0.018, 0.03),
      i.box(
        T,
        I,
        w.y0 - 0.014,
        h - p * 0.45 + 0.075,
        G + 0.06,
        0.028,
        p * 0.55 + 0.06,
        { r: 0.004 },
      ));
    const O = new l.Mesh(
      new l.PlaneGeometry(G - 0.05, V - 0.05),
      new l.MeshPhysicalMaterial({
        color: "#1b2636",
        roughness: 0.05,
        metalness: 0,
        transparent: !0,
        opacity: 0.34,
        envMapIntensity: 0.45,
        depthWrite: !1,
      }),
    );
    (O.position.set(I, B, z - 0.014),
      (O.renderOrder = 2),
      Oe.add(O),
      ze.push(O),
      et.push(O));
  }
  {
    const C = t(s, "#f1eee8"),
      R = t(s, "#d9d5cc");
    i.box(C, f + 0.006, 1.12, 0.95, 0.012, 0.085, 0.085).box(
      R,
      f + 0.013,
      1.12,
      0.95,
      0.003,
      0.045,
      0.02,
    );
    for (const [z, I] of [
      [-0.26, 0.3],
      [1.52, 0.3],
    ]) {
      i.box(C, z, I, h + 0.006, 0.15, 0.085, 0.012);
      for (const G of [-1, 1])
        i.box(R, z + G * 0.037, I, h + 0.013, 0.03, 0.03, 0.003);
    }
  }
  i.flush(Oe);
  {
    const C = Qn("#bcae9f", {
      k: 0.22,
      roughness: 0.42,
      metalness: 0.04,
      blur: 2.4,
    });
    ((C.map = e.planks), (C.envMapIntensity = 0.4));
    const R = new l.PlaneGeometry(d - f, m - h);
    (R.rotateX(-Math.PI / 2), R.translate((f + d) / 2, 0, (h + m) / 2));
    const z = R.attributes.position,
      I = R.attributes.uv;
    for (let V = 0; V < I.count; V++)
      I.setXY(V, z.getZ(V) * 0.42, z.getX(V) * 0.42);
    const G = new l.Mesh(R, C);
    ((G.receiveShadow = !0), Oe.add(G), et.push(G));
  }
  {
    const C = ti(0.64);
    (C.position.set(1.42, -0.19, m + 0.004), Oe.add(C));
  }
}
{
  const e = Ao,
    { T: t, VC: n, VM: s, WOOD: r } = e,
    a = e.B(),
    o = En.desk,
    i = o.x - o.w / 2,
    c = o.x + o.w / 2,
    f = o.z - o.d / 2,
    d = o.z + o.d / 2,
    h = o.y,
    m = 0.032,
    p = t(r, "#584438"),
    x = t(r, "#634c3e");
  a.box(p, o.x, h - m / 2, o.z, o.w, m, o.d, { r: 0.006 });
  const w = h - m - 0.043,
    g = 0.084;
  (a
    .box(p, o.x, w, d - 0.045, o.w - 0.12, g, 0.02)
    .box(p, o.x, w, f + 0.04, o.w - 0.12, g, 0.02)
    .box(p, i + 0.05, w, o.z, 0.02, g, o.d - 0.1)
    .box(p, c - 0.05, w, o.z, 0.02, g, o.d - 0.1),
    a.box(x, o.x, w, d - 0.037, 0.58, g - 0.014, 0.012, { r: 0.002 }),
    a.box(t(s, "#c29b5b"), o.x, w, d - 0.026, 0.13, 0.008, 0.007, {
      r: 0.002,
    }));
  for (const y of [-1, 1])
    a.cyl(t(s, "#c29b5b"), o.x + y * 0.055, w, d - 0.03, 0.003, 0.003, 0.008, {
      rx: Math.PI / 2,
      seg: 8,
    });
  const u = h - m;
  for (const [y, b, M, T] of [
    [i + 0.06, d - 0.06, -1, 1],
    [c - 0.06, d - 0.06, 1, 1],
    [i + 0.06, f + 0.06, -1, -1],
    [c - 0.06, f + 0.06, 1, -1],
  ])
    a.geo(
      p,
      new l.CylinderGeometry(0.031, 0.018, u, 4).rotateY(Math.PI / 4),
      y + M * 0.008,
      u / 2,
      b + T * 0.006,
      { rz: -M * 0.022, rx: T * 0.018, vgrain: !0 },
    );
  (a.geo(
    t(e.FAB, "#2e2c2b"),
    e.slab(0.8, 0.4, 0.004, 0.02, 0.001, 1),
    0.42,
    h,
    -1.455,
    { ry: 0.05 },
  ),
    a.flush(Oe));
}
const li = (() => {
  const s =
      'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    r = (u, y) => `${u} ${y}px ${s}`,
    a = document.createElement("canvas");
  ((a.width = 1600), (a.height = 1e3));
  const o = a.getContext("2d"),
    i = new l.CanvasTexture(a);
  ((i.colorSpace = l.SRGBColorSpace), (i.anisotropy = 8));
  const c = {
      bg: "#212124",
      side: "#171719",
      sel: "#2b2b30",
      tx: "#ececf1",
      tx2: "#a4a4ae",
      tx3: "#70707a",
      bub: "#303036",
      comp: "#2c2c31",
      line: "#3b3b42",
    },
    f = [
      ["user", "Can you suggest a good book about light and colour?"],
      [
        "ai",
        "Try \u201CLight and Colour in the Outdoors\u201D by Marcel Minnaert: a field guide to rainbows, halos, blue skies and red sunsets, with simple things you can check for yourself outside.",
      ],
      ["user", "Is it hard to read without a physics background?"],
      [
        "ai",
        "Not really. It was written for curious walkers, not physicists: short sections, very little maths, and almost everything it explains is something you can go out and see.",
      ],
    ],
    d = [
      "Sourdough starter schedule",
      "Lisbon in three days",
      "Fix the flexbox gap in nav",
      "Birthday note for Mia",
      "Explain the TCP handshake",
      "Rename photos by date",
      "Houseplants for low light",
      "Budget sheet formulas",
      "Why do cats knead?",
      "Chord shapes for a ukulele",
    ];
  function h(u, y) {
    const b = [];
    for (const M of u.split(`
`)) {
      let T = "";
      for (const S of M.split(" ")) {
        const C = T ? T + " " + S : S;
        T && o.measureText(C).width > y ? (b.push(T), (T = S)) : (T = C);
      }
      b.push(T);
    }
    return b;
  }
  const m = (u, y = 3) => {
      ((o.strokeStyle = u),
        (o.lineWidth = y),
        (o.lineCap = "round"),
        (o.lineJoin = "round"));
    },
    p = {
      sidebar(u, y, b) {
        (m(b),
          lt(o, u, y, 34, 28, 7),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u + 12, y + 2),
          o.lineTo(u + 12, y + 26),
          o.stroke());
      },
      edit(u, y, b) {
        (m(b),
          o.beginPath(),
          o.moveTo(u + 14, y + 4),
          o.lineTo(u + 5, y + 4),
          o.quadraticCurveTo(u, y + 4, u, y + 9),
          o.lineTo(u, y + 26),
          o.quadraticCurveTo(u, y + 31, u + 5, y + 31),
          o.lineTo(u + 22, y + 31),
          o.quadraticCurveTo(u + 27, y + 31, u + 27, y + 26),
          o.lineTo(u + 27, y + 17),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u + 11, y + 20),
          o.lineTo(u + 12, y + 15),
          o.lineTo(u + 25, y + 2),
          o.lineTo(u + 30, y + 7),
          o.lineTo(u + 17, y + 20),
          o.closePath(),
          o.stroke());
      },
      search(u, y, b) {
        (m(b),
          o.beginPath(),
          o.arc(u + 12, y + 12, 10, 0, 7),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u + 19.5, y + 19.5),
          o.lineTo(u + 28, y + 28),
          o.stroke());
      },
      lib(u, y, b) {
        (m(b),
          lt(o, u, y + 3, 28, 26, 6),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u + 9, y + 3),
          o.lineTo(u + 9, y + 29),
          o.stroke());
      },
      chev(u, y, b) {
        (m(b, 3.2),
          o.beginPath(),
          o.moveTo(u, y),
          o.lineTo(u + 7, y + 7),
          o.lineTo(u + 14, y),
          o.stroke());
      },
      chevR(u, y, b) {
        (m(b, 3),
          o.beginPath(),
          o.moveTo(u, y),
          o.lineTo(u + 6, y + 6),
          o.lineTo(u, y + 12),
          o.stroke());
      },
      share(u, y, b) {
        (m(b),
          o.beginPath(),
          o.moveTo(u + 14, y + 3),
          o.lineTo(u + 14, y + 22),
          o.moveTo(u + 6, y + 10),
          o.lineTo(u + 14, y + 2),
          o.lineTo(u + 22, y + 10),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u + 4, y + 17),
          o.lineTo(u + 4, y + 29),
          o.lineTo(u + 24, y + 29),
          o.lineTo(u + 24, y + 17),
          o.stroke());
      },
      dots(u, y, b) {
        o.fillStyle = b;
        for (const M of [0, 1, 2])
          (o.beginPath(), o.arc(u + M * 11, y, 3.2, 0, 7), o.fill());
      },
      plus(u, y, b) {
        (m(b, 3.4),
          o.beginPath(),
          o.moveTo(u - 11, y),
          o.lineTo(u + 11, y),
          o.moveTo(u, y - 11),
          o.lineTo(u, y + 11),
          o.stroke());
      },
      mic(u, y, b) {
        (m(b, 3),
          lt(o, u - 6, y - 15, 12, 20, 6),
          o.stroke(),
          o.beginPath(),
          o.arc(u, y - 2, 11, 0.15, Math.PI - 0.15),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u, y + 9),
          o.lineTo(u, y + 15),
          o.stroke());
      },
      copy(u, y, b) {
        (m(b, 2.8),
          lt(o, u + 8, y, 18, 20, 4),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u + 4, y + 6),
          o.lineTo(u + 2, y + 6),
          o.quadraticCurveTo(u, y + 6, u, y + 8),
          o.lineTo(u, y + 24),
          o.quadraticCurveTo(u, y + 26, u + 2, y + 26),
          o.lineTo(u + 16, y + 26),
          o.quadraticCurveTo(u + 18, y + 26, u + 18, y + 24),
          o.lineTo(u + 18, y + 22),
          o.stroke());
      },
      thumb(u, y, b, M) {
        (o.save(),
          M && (o.translate(u, y + 26), o.scale(1, -1), o.translate(-u, -y)),
          m(b, 2.8),
          o.beginPath(),
          o.moveTo(u + 7, y + 11),
          o.lineTo(u + 12, y + 2),
          o.quadraticCurveTo(u + 17, y + 1, u + 16, y + 7),
          o.lineTo(u + 15, y + 10),
          o.lineTo(u + 22, y + 10),
          o.quadraticCurveTo(u + 26, y + 10, u + 25, y + 14),
          o.lineTo(u + 23, y + 22),
          o.quadraticCurveTo(u + 22, y + 25, u + 19, y + 25),
          o.lineTo(u + 7, y + 25),
          o.closePath(),
          o.stroke(),
          lt(o, u, y + 11, 5, 14, 1.5),
          o.stroke(),
          o.restore());
      },
      speaker(u, y, b) {
        (m(b, 2.8),
          o.beginPath(),
          o.moveTo(u, y + 9),
          o.lineTo(u + 5, y + 9),
          o.lineTo(u + 12, y + 3),
          o.lineTo(u + 12, y + 23),
          o.lineTo(u + 5, y + 17),
          o.lineTo(u, y + 17),
          o.closePath(),
          o.stroke(),
          o.beginPath(),
          o.arc(u + 13, y + 13, 7, -0.9, 0.9),
          o.stroke(),
          o.beginPath(),
          o.arc(u + 13, y + 13, 12, -0.9, 0.9),
          o.stroke());
      },
      regen(u, y, b) {
        (m(b, 2.8),
          o.beginPath(),
          o.arc(u + 13, y + 13, 10, -0.5, Math.PI * 1.45),
          o.stroke(),
          o.beginPath(),
          o.moveTo(u + 23, y + 2),
          o.lineTo(u + 22, y + 9),
          o.lineTo(u + 15, y + 8),
          o.stroke());
      },
      up(u, y, b) {
        (m(b, 3.6),
          o.beginPath(),
          o.moveTo(u, y + 11),
          o.lineTo(u, y - 11),
          o.moveTo(u - 9, y - 2),
          o.lineTo(u, y - 11),
          o.lineTo(u + 9, y - 2),
          o.stroke());
      },
    };
  function x(u, y, b, M, T, S) {
    if (o.measureText(u).width <= M) {
      ((o.fillStyle = T), o.fillText(u, y, b));
      return;
    }
    (o.save(),
      o.beginPath(),
      o.rect(y - 4, b - 40, M + 4, 56),
      o.clip(),
      (o.fillStyle = T),
      o.fillText(u, y, b));
    const R = o.createLinearGradient(y + M - 60, 0, y + M, 0);
    (R.addColorStop(0, S + "00"),
      R.addColorStop(1, S),
      (o.fillStyle = R),
      o.fillRect(y + M - 60, b - 40, 60, 56),
      o.restore());
  }
  function w(u) {
    (o.setTransform(1, 0, 0, 1, 0, 0),
      (o.textBaseline = "alphabetic"),
      (o.textAlign = "left"),
      (o.fillStyle = c.bg),
      o.fillRect(0, 0, 1600, 1e3));
    const y = 292,
      b = y + (1600 - y) / 2,
      M = 930,
      T = b - M / 2,
      S = b + M / 2,
      C = !u.history && !u.sent,
      R = 122,
      z = C ? 500 : 1e3 - R - 56,
      I = [],
      G = r(400, 38),
      V = 57,
      B = (K) => {
        o.font = G;
        const X = h(K, 660),
          q = Math.max(...X.map((ne) => o.measureText(ne).width));
        I.push({
          h: X.length * V + 40,
          gap: 34,
          draw(ne) {
            ((o.fillStyle = c.bub),
              lt(o, S - q - 60, ne, q + 60, X.length * V + 42, 32),
              o.fill(),
              (o.fillStyle = c.tx),
              (o.font = G),
              X.forEach((le, ee) =>
                o.fillText(le, S - q - 30, ne + 56 + ee * V),
              ));
          },
        });
      },
      O = (K, X = {}) => {
        o.font = G;
        const q = K ? h(K, M - 20) : [],
          ne = X.thought ? 62 : 0,
          le = X.thinking ? 62 : 0,
          ee = X.acts ? 70 : 0;
        I.push({
          h: ne + le + q.length * V + ee + (q.length ? 8 : 0),
          gap: 44,
          draw(Te) {
            let fe = Te;
            if (X.thinking) {
              o.font = r(500, 34);
              const de = o.measureText("Thinking").width,
                Pe = ((u.now * 0.75) % 1.7) - 0.35,
                Ce = o.createLinearGradient(T, 0, T + de, 0);
              (Ce.addColorStop(0, c.tx3),
                Ce.addColorStop(U(Pe - 0.22, 0, 1), c.tx3),
                Ce.addColorStop(U(Pe, 0, 1), "#f4f4f8"),
                Ce.addColorStop(U(Pe + 0.22, 0, 1), c.tx3),
                Ce.addColorStop(1, c.tx3),
                (o.fillStyle = Ce),
                o.fillText("Thinking", T, fe + 40),
                (fe += le));
            }
            if (X.thought) {
              ((o.font = r(500, 31)), (o.fillStyle = c.tx2));
              const de = `Thought for ${X.thought} s`;
              (o.fillText(de, T, fe + 34),
                p.chevR(T + o.measureText(de).width + 14, fe + 14, c.tx2),
                (fe += ne));
            }
            if (
              ((o.font = G),
              (o.fillStyle = c.tx),
              q.forEach((de, Pe) => o.fillText(de, T, fe + 42 + Pe * V)),
              X.cursor && q.length)
            ) {
              const de = q[q.length - 1],
                Pe = o.measureText(de).width,
                Ce = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(u.now * 6));
              ((o.fillStyle = `rgba(236,236,241,${Ce.toFixed(3)})`),
                o.beginPath(),
                o.arc(
                  T + Pe + (de ? 22 : 11),
                  fe + 29 + (q.length - 1) * V,
                  10.5,
                  0,
                  7,
                ),
                o.fill());
            }
            if (X.acts) {
              const de = fe + q.length * V + 26;
              ["copy", "thumb", "thumbD", "speaker", "regen"].forEach(
                (Pe, Ce) => {
                  const Ue = T + Ce * 58;
                  Pe === "thumbD"
                    ? p.thumb(Ue, de, c.tx2, !0)
                    : p[Pe](Ue, de, c.tx2);
                },
              );
            }
          },
        });
      };
    if (u.history)
      for (const [K, X] of f) K === "user" ? B(X) : O(X, { acts: !1 });
    if (
      (u.sent &&
        (B(u.prompt),
        u.nAns > 0
          ? O(u.answer, {
              thought: u.thoughtFor.toFixed(1),
              cursor: !u.done,
              acts: u.done,
            })
          : (u.waiting || u.thinking) && O("", { thinking: !0 })),
      C)
    )
      ((o.font = r(500, 52)),
        (o.fillStyle = c.tx),
        (o.textAlign = "center"),
        o.fillText("What\u2019s on your mind tonight?", b, z - 66),
        (o.textAlign = "left"));
    else {
      let K = 118;
      for (const le of I) K += le.h + le.gap;
      const X = z - 34;
      ((K = 118 + Math.min(0, X - K)),
        o.save(),
        o.beginPath(),
        o.rect(y, 0, 1600 - y, z - 8),
        o.clip());
      for (const le of I)
        (K + le.h > -10 && K < z && le.draw(K), (K += le.h + le.gap));
      o.restore();
      const ne = o.createLinearGradient(0, 70, 0, 128);
      (ne.addColorStop(0, c.bg),
        ne.addColorStop(1, c.bg + "00"),
        (o.fillStyle = ne),
        o.fillRect(y, 70, 1600 - y, 58),
        (o.fillStyle = c.bg),
        o.fillRect(y, 0, 1600 - y, 70));
    }
    ((o.font = r(600, 31)),
      (o.fillStyle = c.tx),
      o.fillText(u.model, y + 34, 58),
      p.chev(y + 34 + o.measureText(u.model).width + 16, 44, c.tx2),
      p.share(1472, 26, c.tx2),
      p.dots(1534, 43, c.tx2));
    {
      const K = T,
        X = z,
        q = M,
        ne = R;
      ((o.fillStyle = c.comp),
        lt(o, K, X, q, ne, 40),
        o.fill(),
        (o.strokeStyle = c.line),
        (o.lineWidth = 1.6),
        lt(o, K + 0.8, X + 0.8, q - 1.6, ne - 1.6, 39.2),
        o.stroke(),
        p.plus(K + 50, X + ne / 2, c.tx2));
      const le = u.sent
        ? ""
        : u.prompt.slice(0, Math.round(u.typed * u.prompt.length));
      if (
        ((o.font = r(400, 38)),
        le
          ? ((o.fillStyle = c.tx), o.fillText(le, K + 94, X + ne / 2 + 13))
          : ((o.fillStyle = c.tx3),
            o.fillText("Ask anything", K + 94, X + ne / 2 + 13)),
        !u.sent && u.caret)
      ) {
        const Te = le ? o.measureText(le).width : 0;
        ((o.fillStyle = "#dcdce6"),
          o.fillRect(K + 94 + Te + 2, X + ne / 2 - 22, 3.4, 46));
      }
      const ee = !u.sent && u.typed >= 1;
      (p.mic(K + q - 126, X + ne / 2 + 1, c.tx2),
        (o.fillStyle = ee ? "#ececf1" : "#48484f"),
        o.beginPath(),
        o.arc(K + q - 56, X + ne / 2, 30, 0, 7),
        o.fill(),
        p.up(K + q - 56, X + ne / 2, ee ? "#141416" : "#27272c"),
        (o.font = r(400, 21)),
        (o.fillStyle = c.tx3),
        (o.textAlign = "center"),
        o.fillText(
          u.model + " can make mistakes. Check important info.",
          b,
          C ? X + ne + 48 : 982,
        ),
        (o.textAlign = "left"));
    }
    ((o.fillStyle = c.side),
      o.fillRect(0, 0, 292, 1e3),
      p.sidebar(28, 26, c.tx2),
      p.edit(232, 24, c.tx2));
    let j = 128;
    for (const [K, X] of [
      ["edit", "New chat"],
      ["search", "Search chats"],
      ["lib", "Library"],
    ])
      (p[K](30, j - 24, c.tx),
        (o.font = r(500, 26)),
        (o.fillStyle = c.tx),
        o.fillText(X, 78, j),
        (j += 56));
    ((o.font = r(600, 21)),
      (o.fillStyle = c.tx3),
      o.fillText("Chats", 30, j + 22),
      (j += 74),
      (o.font = r(400, 26)),
      (u.sent || u.history ? [u.title, ...d] : d).forEach((K, X) => {
        const q = j + X * 54;
        if (q > 890) return;
        const ne = (u.sent || u.history) && X === 0;
        (ne &&
          ((o.fillStyle = c.sel), lt(o, 12, q - 36, 268, 52, 13), o.fill()),
          x(K, 28, q, 240, ne ? c.tx : "#cfcfd7", ne ? c.sel : c.side));
      }),
      (o.fillStyle = c.side),
      o.fillRect(0, 908, 292, 92),
      (o.fillStyle = "#3a3a41"),
      o.fillRect(18, 908, 256, 1.5),
      (o.fillStyle = "#c98a3c"),
      o.beginPath(),
      o.arc(50, 954, 21, 0, 7),
      o.fill(),
      (o.fillStyle = "#1d1409"),
      (o.font = r(700, 22)),
      (o.textAlign = "center"),
      o.fillText("R", 50, 962),
      (o.textAlign = "left"),
      (o.font = r(500, 25)),
      (o.fillStyle = c.tx),
      o.fillText("Personal", 86, 962),
      (i.needsUpdate = !0));
  }
  const g = new l.MeshBasicMaterial({
    map: i,
    color: new l.Color(1.16, 1.16, 1.19),
    fog: !1,
  });
  return (
    (g.onBeforeCompile = (u) => {
      u.fragmentShader = u.fragmentShader.replace(
        "#include <map_fragment>",
        `#ifdef USE_MAP
 vec2 dxu=dFdx(vMapUv),dyu=dFdy(vMapUv);
 vec4 sampledDiffuseColor=.25*(texture2D(map,vMapUv-.125*dxu-.375*dyu,-.6)+texture2D(map,vMapUv+.375*dxu-.125*dyu,-.6)+texture2D(map,vMapUv+.125*dxu+.375*dyu,-.6)+texture2D(map,vMapUv-.375*dxu+.125*dyu,-.6));
 diffuseColor*=sampledDiffuseColor;
#endif`,
      );
    }),
    (g.customProgramCacheKey = () => "deskScreen"),
    { c: a, g: o, tex: i, mat: g, draw: w, W: 1600, H: 1e3 }
  );
})();
{
  const e = Ao,
    { T: t, VM: n, VS: s, VC: r, VP: a } = e,
    o = En.desk,
    i = 0.312,
    c = 0.221,
    f = 0.0135,
    d = 0.0055,
    h = 0.2085,
    m = (105 * Math.PI) / 180,
    p = 0.0015,
    x = 0.3016,
    w = x / 1.6,
    g = h - w - 0.0068,
    u = 0.42,
    y = -1.49,
    b = 0.05,
    M = o.y + 0.004 + p,
    T = new l.Group();
  (T.position.set(u, M, y),
    (T.rotation.y = b),
    Oe.add(T),
    (Ne.lap = T),
    (Ne.lapRy = b));
  const S = t(n, "#cfccc8"),
    C = e.B();
  C.geo(S, e.slab(i, c, f, 0.012, 0.0018, 3), 0, 0, 0);
  for (const [ee, Te] of [
    [-0.13, -0.085],
    [0.13, -0.085],
    [-0.13, 0.085],
    [0.13, 0.085],
  ])
    C.cyl(t(r, "#1a1b1d"), ee, -p / 2, Te, 0.0065, 0.0065, p, { seg: 14 });
  const R = 0.019,
    z = 0.0034,
    I = [
      [[1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 0.0095],
      [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5], 0.0155],
      [[1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 0.0155],
      [[1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75], 0.0155],
      [[2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25], 0.0155],
      [[1, 1, 1, 1.25, 5, 1.25, 1, "L", "UD", "R"], 0.0155],
    ],
    G = [
      [
        "esc",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "",
      ],
      [
        "~\n`",
        `!
1`,
        `@
2`,
        `#
3`,
        `$
4`,
        `%
5`,
        `^
6`,
        `&
7`,
        `*
8`,
        `(
9`,
        `)
0`,
        `_
-`,
        `+
=`,
        "delete",
      ],
      [
        "tab",
        "Q",
        "W",
        "E",
        "R",
        "T",
        "Y",
        "U",
        "I",
        "O",
        "P",
        `{
[`,
        `}
]`,
        `|
\\`,
      ],
      [
        "caps lock",
        "A",
        "S",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        `:
;`,
        `"
'`,
        "return",
      ],
      [
        "shift",
        "Z",
        "X",
        "C",
        "V",
        "B",
        "N",
        "M",
        `<
,`,
        `>
.`,
        `?
/`,
        "shift",
      ],
      [
        "fn",
        "control",
        "option",
        "command",
        "",
        "command",
        "option",
        "\u25C0",
        "\u25B2\u25BC",
        "\u25B6",
      ],
    ],
    V = 14.5 * R,
    B = I.reduce((ee, Te) => ee + Te[1], 0) + z * 5,
    O = -c / 2 + 0.0135,
    j = t(s, "#161719"),
    J = [];
  {
    let ee = O;
    I.forEach(([Te, fe], de) => {
      let Pe = -V / 2;
      (Te.forEach((Ce, Ue) => {
        const it = (typeof Ce == "number" ? Ce : 1) * R;
        (Ce === "L" || Ce === "R"
          ? J.push([
              Pe + it / 2,
              ee + fe * 0.75,
              it - z,
              fe / 2 - z / 2,
              G[de][Ue],
            ])
          : Ce === "UD"
            ? (J.push([
                Pe + it / 2,
                ee + fe * 0.25,
                it - z,
                fe / 2 - z / 2,
                "\u25B2",
              ]),
              J.push([
                Pe + it / 2,
                ee + fe * 0.75,
                it - z,
                fe / 2 - z / 2,
                "\u25BC",
              ]))
            : J.push([Pe + it / 2, ee + fe / 2, it - z, fe - z, G[de][Ue]]),
          (Pe += it));
      }),
        (ee += fe + z));
    });
  }
  C.geo(
    t(r, "#0a0a0b"),
    e.flat(V + 0.005, B + 0.005, 0.003),
    0,
    f + 2e-4,
    O + B / 2,
  );
  for (const [ee, Te, fe, de] of J)
    C.box(j, ee, f + 6e-4, Te, fe, 0.0011, de, { r: 5e-4, seg: 1 });
  {
    const ee = c / 2 - 0.0115 - 0.04;
    C.geo(t(r, "#6d7075"), e.flat(0.1316, 0.0816, 0.0062), 0, f + 2e-4, ee).geo(
      t(n, "#b1b5bb"),
      e.flat(0.13, 0.08, 0.0055),
      0,
      f + 45e-5,
      ee,
    );
  }
  C.cyl(
    t(n, "#2d2f34"),
    0,
    f - 0.0036,
    -c / 2 + 0.0046,
    0.0048,
    0.0048,
    i - 0.05,
    { rz: Math.PI / 2, seg: 16 },
  );
  for (const [ee, Te, fe] of [
    [-i / 2, -0.062, 0.0092],
    [-i / 2, -0.046, 0.0092],
    [i / 2, -0.062, 0.0092],
  ])
    C.box(t(r, "#0e0f10"), ee, f * 0.46, Te, 0.0012, 0.0034, fe, {
      r: 5e-4,
      seg: 1,
    });
  C.flush(T);
  {
    const Te = Math.round((1024 * B) / V),
      fe = document.createElement("canvas");
    ((fe.width = 1024), (fe.height = Te));
    const de = fe.getContext("2d"),
      Pe = 1024 / V,
      Ce = 'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif';
    ((de.fillStyle = "#fff"), (de.textBaseline = "middle"));
    for (const [ut, Yt, Ro, on, vt] of J) {
      if (!vt) continue;
      const P = (ut + V / 2) * Pe,
        H = (Yt - O) * Pe,
        N = Ro * Pe,
        E = on * Pe;
      if (
        vt.includes(`
`)
      ) {
        const [_, A] = vt.split(`
`);
        ((de.font = `500 ${Math.round(E * 0.3)}px ${Ce}`),
          (de.textAlign = "center"),
          de.fillText(_, P, H - E * 0.19),
          de.fillText(A, P, H + E * 0.2));
      } else if (
        vt.length === 1 ||
        /^F\d/.test(vt) ||
        "\u25C0\u25B6\u25B2\u25BC".includes(vt[0])
      )
        ((de.font = `500 ${Math.round(E * (vt.length === 1 && !"\u25C0\u25B6\u25B2\u25BC".includes(vt) ? 0.42 : 0.3))}px ${Ce}`),
          (de.textAlign = "center"),
          de.fillText(vt, P, H + (vt.length === 1 ? 1 : 0)));
      else {
        de.font = `500 ${Math.round(E * 0.24)}px ${Ce}`;
        const _ =
          /return|delete/.test(vt) ||
          (vt === "shift" && ut > 0) ||
          (/command|option/.test(vt) && ut > 0);
        ((de.textAlign = _ ? "right" : "left"),
          de.fillText(
            vt,
            _ ? P + N / 2 - E * 0.16 : P - N / 2 + E * 0.16,
            H + E * 0.28,
          ));
      }
    }
    const Ue = new l.CanvasTexture(fe);
    ((Ue.colorSpace = l.SRGBColorSpace), (Ue.anisotropy = 8));
    const it = new l.Mesh(
      new l.PlaneGeometry(V, B),
      new l.MeshBasicMaterial({
        map: Ue,
        transparent: !0,
        depthWrite: !1,
        color: new l.Color(0.62, 0.6, 0.57),
        fog: !1,
      }),
    );
    ((it.rotation.x = -Math.PI / 2),
      it.position.set(0, f + 0.00145, O + B / 2),
      T.add(it),
      ze.push(it));
  }
  const K = new l.Group();
  (K.position.set(0, f - 0.0022, -c / 2 + 0.0035),
    (K.rotation.x = -(m - Math.PI / 2)),
    T.add(K));
  {
    const ee = e.B();
    (ee.geo(S, e.slab(i, h, d, 0.012, 0.0014, 3), 0, 0.0012 + h / 2, -d, {
      rx: Math.PI / 2,
    }),
      ee.geo(
        t(a, "#060708"),
        e.flat(i - 0.0026, h - 0.0026, 0.0105),
        0,
        0.0012 + h / 2,
        22e-5,
        { rx: Math.PI / 2 },
      ),
      ee.cyl(
        t(a, "#14171c"),
        0,
        0.0012 + h - 0.0034,
        4e-4,
        0.0017,
        0.0017,
        5e-4,
        { rx: Math.PI / 2, seg: 12 },
      ),
      ee.flush(K));
  }
  const X = new l.Mesh(new l.PlaneGeometry(x, w), li.mat);
  (X.position.set(0, 0.0012 + g + w / 2, 6e-4),
    K.add(X),
    (Ne.scr = X),
    T.updateMatrix(),
    K.updateMatrix(),
    X.updateMatrix());
  const q = new l.Matrix4()
      .multiplyMatrices(T.matrix, K.matrix)
      .multiply(X.matrix),
    ne = new l.Vector3().applyMatrix4(q),
    le = new l.Vector3(0, 0, 1).transformDirection(q);
  ((Ye.screen = [+ne.x.toFixed(4), +ne.y.toFixed(4), +ne.z.toFixed(4)]),
    (Ye.laptop = [u, +(M + f).toFixed(4), y]),
    (Ne.scrN = le),
    (Ne.scrLight = qe(
      ne.x + le.x * 0.16 + Re.desk,
      ne.y - 0.04,
      ne.z + le.z * 0.16,
      "#b7ccff",
      0.7,
      0.8,
    )),
    Ic(Oe, u, o.y + 0.004 - 0.003, y + 0.005, 0.37, 0.27, 0.42));
  {
    const ee = e.B(),
      Te = [
        [-i / 2 - 0.004, 0.006, -0.07],
        [-i / 2 - 0.03, 0.005, -0.078],
        [-i / 2 - 0.09, 0.004, -0.12],
      ].map((Pe) => new l.Vector3(...Pe).applyMatrix4(T.matrix)),
      fe = o.y + 0.004;
    ee.box(t(n, "#b9bdc3"), -i / 2 - 0.004, 0.006, -0.07, 0.008, 0.005, 0.013, {
      r: 0.0015,
    }).flush(T);
    const de = [
      ...Te,
      new l.Vector3(0.08, fe, -1.72),
      new l.Vector3(-0.03, o.y + 0.002, -1.85),
      new l.Vector3(-0.06, o.y - 0.005, -1.883),
      new l.Vector3(-0.09, o.y - 0.12, -1.892),
      new l.Vector3(-0.16, 0.42, -1.892),
      new l.Vector3(-0.23, 0.32, -1.886),
    ];
    e.B().tube(t(r, "#c9c6c0"), de, 0.0024, { n: 60 }).flush(Oe);
  }
}
{
  const e = Ao,
    {
      T: t,
      G: n,
      GB: s,
      VC: r,
      VS: a,
      VM: o,
      VP: i,
      FAB: c,
      WOOD: f,
      FOL: d,
    } = e,
    h = e.B(),
    m = En.desk.y;
  {
    h.frame(0.03, m, -1.8, 0.62);
    const p = t(o, "#2a2c30"),
      x = t(o, "#c29b5b");
    h.cyl(p, 0, 0.011, 0, 0.078, 0.083, 0.022, { seg: 40 }).cyl(
      p,
      0,
      0.029,
      0,
      0.026,
      0.03,
      0.016,
      { seg: 20 },
    );
    const w = new l.Vector3(0, 0.042, 0),
      g = new l.Vector3(0, 0.42, -0.07),
      u = new l.Vector3(0, 0.55, 0.23),
      y = (z, I, G, V, B = p) => {
        const O = I.clone().sub(z);
        h.cyl(
          B,
          (z.x + I.x) / 2 + V,
          (z.y + I.y) / 2,
          (z.z + I.z) / 2,
          G,
          G,
          O.length(),
          { dir: O.toArray(), seg: 8 },
        );
      };
    for (const z of [-0.011, 0.011]) (y(w, g, 0.0042, z), y(g, u, 0.0038, z));
    for (const z of [-0.021, 0.021])
      y(
        w.clone().add(new l.Vector3(0, 0.06, 0.012)),
        g.clone().add(new l.Vector3(0, -0.1, 0.012)),
        0.0052,
        z,
        t(o, "#50535a"),
      );
    for (const z of [g, u])
      h.cyl(x, z.x, z.y, z.z, 0.013, 0.013, 0.036, {
        rz: Math.PI / 2,
        seg: 18,
      });
    h.cyl(p, w.x, w.y, w.z, 0.013, 0.013, 0.036, { rz: Math.PI / 2, seg: 18 });
    const b = new l.Vector3(0, -0.84, 0.54).normalize(),
      M = u.clone().addScaledVector(b, 0.035),
      T = [
        [0.02, 0],
        [0.024, 0.01],
        [0.03, 0.028],
        [0.046, 0.07],
        [0.07, 0.115],
        [0.083, 0.142],
        [0.086, 0.15],
      ];
    (h.geo(p, e.lathe(T, 36), M.x, M.y, M.z, { dir: b.toArray() }),
      h.cyl(p, M.x, M.y, M.z, 0.02, 0.02, 0.004, { dir: b.toArray(), seg: 18 }),
      h.geo(
        s("#ffd9a8", 1.45),
        e.lathe(
          T.map(([z, I]) => [z - 0.0016, I + 0.003]),
          36,
        ),
        M.x,
        M.y,
        M.z,
        { dir: b.toArray() },
      ));
    const S = M.clone().addScaledVector(b, 0.075);
    h.sph(n("#fff3dd", 4.5), S.x, S.y, S.z, 0.021, { seg: 14, seg2: 10 });
    const C = h.pt(M.x + b.x * 0.4, M.y + b.y * 0.4 + 0.1, M.z + b.z * 0.4),
      R = h.pt(S.x, S.y, S.z);
    (h.frame(),
      (Ne.lampL = qe(C.x + Re.desk, C.y, C.z, "#ffc48a", 1.05, 2.6)),
      (Ne.lampB = qe(R.x + Re.desk, R.y + 0.02, R.z, "#ffd2a0", 0.55, 0.9)),
      (Ye.lamp = [+R.x.toFixed(3), +R.y.toFixed(3), +R.z.toFixed(3)]));
  }
  {
    const g = t(a, "#86705f");
    h.geo(
      g,
      e.lathe(
        [
          [0, 0],
          [0.036, 0],
          [0.0405, 0.004],
          [0.041, 0.02],
          [0.041, 0.092],
          [0.0398, 0.0962],
          [0.0378, 0.0962],
          [0.0368, 0.09],
          [0.0358, 0.012],
          [0, 0.011],
        ],
        32,
      ),
      0.8,
      m,
      -1.56,
    );
    const u = Math.cos(-0.8),
      y = -Math.sin(-0.8);
    (h.tor(g, 0.8 + u * 0.045, m + 0.05, -1.56 + y * 0.045, 0.023, 0.0058, {
      ry: -0.8,
      arc: Math.PI * 1.18,
      rz: -Math.PI * 0.59,
      ts: 16,
      rs: 7,
    }),
      h.cyl(t(i, "#24160d"), 0.8, m + 0.079, -1.56, 0.0356, 0.0356, 0.002, {
        seg: 28,
      }));
    const b = new l.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uA: { value: 1 } },
      transparent: !0,
      depthWrite: !1,
      blending: l.AdditiveBlending,
      side: l.DoubleSide,
      fog: !1,
      vertexShader:
        "varying vec2 vUv;uniform float uT;void main(){vUv=uv;vec3 p=position;float h=uv.y;p.x+=(sin(h*5.2-uT*1.5)*.011+sin(h*9.-uT*2.3)*.004)*h;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}",
      fragmentShader: `varying vec2 vUv;uniform float uT;uniform float uA;
    float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}
    void main(){float y=vUv.y,x=vUv.x-.5+sin(y*6.-uT*1.2)*.07*y;float w=.1+.22*y;
     float n=n2(vec2(vUv.x*3.2+sin(y*4.-uT*.8)*.5,y*4.5-uT*1.))*.62+n2(vec2(vUv.x*7.,y*10.-uT*1.8))*.38;
     float a=smoothstep(w,0.,abs(x))*smoothstep(0.,.14,y)*smoothstep(1.,.3,y)*smoothstep(.38,.8,n);
     gl_FragColor=vec4(vec3(1.,.93,.84)*max(a,0.)*.2*uA,1.);}`,
    });
    ((Ne.steam = []), (Ne.steamU = b.uniforms));
    for (const [M, T, S, C] of [
      [0, 0, 0.21, 1],
      [0.008, -0.006, 0.17, 0.8],
      [-0.009, 0.004, 0.15, 0.7],
    ]) {
      const R = new l.Mesh(
        new l.PlaneGeometry(0.075 * C, S).translate(0, S / 2, 0),
        b,
      );
      (R.position.set(0.8 + M, m + 0.082, -1.56 + T),
        (R.renderOrder = 3),
        Oe.add(R),
        ze.push(R),
        et.push(R),
        Ne.steam.push(R));
    }
    Ye.mug = [0.8, +(m + 0.1).toFixed(3), -1.56];
  }
  {
    h.frame(0, m, -1.34, 0.22);
    const p = t(c, "#252b3b"),
      x = t(r, "#efe9dc");
    (h
      .box(p, 0, 0.00125, 0, 0.15, 0.0025, 0.212, { r: 0.001, seg: 1 })
      .box(x, 0.0025, 0.0078, 0, 0.144, 0.0106, 0.205)
      .box(p, 0, 0.0143, 0, 0.15, 0.0025, 0.212, { r: 0.001, seg: 1 })
      .box(p, -0.0735, 0.0078, 0, 0.004, 0.0155, 0.212),
      h
        .box(t(r, "#1b1f2a"), 0.056, 0.0079, 0, 0.0055, 0.0163, 0.2135)
        .box(t(r, "#a4553a"), 0.02, 3e-4, 0.118, 0.007, 6e-4, 0.034),
      h
        .cyl(t(o, "#c7a063"), 0.012, 0.0178, -0.01, 0.0042, 0.0042, 0.138, {
          rz: Math.PI / 2,
          ry: 0.5,
          seg: 10,
        })
        .cyl(
          t(o, "#1f2023"),
          0.012 + Math.cos(0.5) * 0.052,
          0.0178,
          -0.01 - Math.sin(0.5) * 0.052,
          0.0044,
          0.0044,
          0.036,
          { rz: Math.PI / 2, ry: 0.5, seg: 10 },
        ),
      h.frame());
  }
  {
    (h.frame(0.95, m, -1.6, 0.32),
      h
        .geo(
          t(o, "#555a61"),
          e.slab(0.0715, 0.147, 0.0078, 0.011, 0.0014, 2),
          0,
          0,
          0,
        )
        .geo(t(a, "#2f3643"), e.flat(0.0686, 0.1442, 0.0098), 0, 0.0082, 0),
      h.geo(
        t(a, "#262c37"),
        e.slab(0.035, 0.035, 0.0017, 0.008, 5e-4, 1),
        -0.0155,
        0.0081,
        -0.0515,
      ));
    for (const [p, x] of [
      [-0.0235, -0.0595],
      [-0.0075, -0.0595],
      [-0.0235, -0.0435],
    ])
      h.cyl(t(o, "#9aa0a8"), p, 0.0102, x, 0.0066, 0.0066, 0.0016, {
        seg: 18,
      }).cyl(t(i, "#07080a"), p, 0.0106, x, 0.0052, 0.0052, 0.0016, {
        seg: 18,
      });
    (h.frame(), (Ye.phone = [0.95, m + 0.01, -1.6]));
  }
  {
    let p = m;
    for (const [x, w, g, u, y] of [
      [0.17, 0.24, 0.026, "#3b4a5a", 0.08],
      [0.15, 0.215, 0.018, "#d8cfbf", -0.05],
    ])
      (h.frame(1.1, p, -1.78, y),
        h
          .box(t(r, u), 0, 0.0015, 0, x, 0.003, w)
          .box(t(r, u), 0, g - 0.0015, 0, x, 0.003, w)
          .box(t(r, u), -x / 2 + 0.0015, g / 2, 0, 0.003, g, w)
          .box(
            t(r, "#ece6da"),
            0.0015,
            g / 2,
            0,
            x - 0.006,
            g - 0.005,
            w - 0.007,
          ),
        h.frame(),
        (p += g));
  }
  {
    const w = ye(33);
    (h.geo(
      t(a, "#8f9c86"),
      e.lathe(
        [
          [0, 0],
          [0.05, 0],
          [0.056, 0.008],
          [0.062, 0.1],
          [0.065, 0.106],
          [0.058, 0.106],
          [0.055, 0.1],
          [0, 0.1],
        ],
        28,
      ),
      1.27,
      m,
      -1.7,
    ),
      h.cyl(t(r, "#2b2119"), 1.27, m + 0.098, -1.7, 0.055, 0.055, 0.004, {
        seg: 20,
      }));
    for (let g = 0; g < 9; g++) {
      const u = g * 2.4 + w(),
        y = 0.06 + w() * 0.2,
        b = new l.Vector3(Math.sin(u) * y, 1, Math.cos(u) * y).normalize(),
        M = 0.16 + w() * 0.17;
      h.geo(
        d,
        e.placeLeaf(
          e.leafGeo(M, 0.034 + w() * 0.016, {
            shape: "blade",
            fold: 0.16,
            curl: -0.03,
            seg: 7,
            edge: [1.05, 1, 0.62],
          }),
          new l.Vector3(
            1.27 + Math.sin(u) * 0.025,
            m + 0.1,
            -1.7 + Math.cos(u) * 0.025,
          ),
          b,
          u + w(),
          e.leafTint(w).multiplyScalar(0.9),
        ),
        0,
        0,
        0,
        { uv: "keep" },
      );
    }
  }
  (h.tube(
    t(r, "#1c1d20"),
    [
      [0.03, m + 0.004, -1.86],
      [0, m + 0.004, -1.872],
      [-0.03, m - 0.004, -1.888],
      [-0.05, m - 0.1, -1.893],
      [-0.18, 0.45, -1.893],
      [-0.29, 0.32, -1.886],
    ],
    0.0022,
    { n: 40 },
  ),
    h.flush(Oe).forEach((p) => {
      p.material.isMeshBasicMaterial && et.push(p);
    }));
}
{
  const e = Ao,
    { T: t, VM: n, VC: s, LEATH: r } = e,
    a = e.B(),
    o = t(n, "#dcdfe4"),
    i = t(s, "#161719"),
    c = t(r, "#8d5534"),
    f = t(r, "#262322");
  a.frame(1.38, 0.012, -0.52, 1.15);
  const d = [
      [0.43, 0.262],
      [0.468, 0.238],
      [0.462, 0.16],
      [0.455, 0.06],
      [0.452, -0.04],
      [0.456, -0.13],
      [0.478, -0.195],
      [0.53, -0.232],
      [0.62, -0.255],
      [0.74, -0.272],
      [0.86, -0.288],
      [0.97, -0.302],
      [1.03, -0.31],
    ],
    h = new l.CatmullRomCurve3(
      d.slice(1).map(([w, g]) => new l.Vector3(0, w, g)),
      !1,
      "centripetal",
    ),
    m = h.getLength(),
    p = Math.round(m / 0.056);
  for (let w = 0; w < p; w++) {
    const g = (w + 0.5) / p,
      u = h.getPointAt(g),
      y = h.getTangentAt(g),
      b = new l.Vector3(0, -y.z, y.y),
      M = u.clone().addScaledVector(b, 0.011);
    a.geo(c, _n(0.438, 0.03, m / p - 0.0035, 0.012, 2), M.x, M.y, M.z, {
      rx: Math.atan2(-y.y, y.z),
    });
  }
  for (const w of [-1, 1]) {
    const g = [new l.Vector3(w * 0.231, d[0][0], d[0][1])];
    for (let u = 0; u <= 26; u++) {
      const y = u / 26,
        b = h.getPointAt(y),
        M = h.getTangentAt(y);
      g.push(new l.Vector3(w * 0.231, b.y + M.z * 0.003, b.z - M.y * 0.003));
    }
    (a.tube(o, g, 0.0115, { n: 80, seg: 10 }),
      a.sph(o, w * 0.231, 1.032, -0.311, 0.0118, { seg: 10 }),
      a.tube(
        o,
        [
          [w * 0.232, 0.462, -0.12],
          [w * 0.242, 0.54, -0.13],
          [w * 0.25, 0.615, -0.1],
          [w * 0.252, 0.64, -0.04],
        ],
        0.0085,
        { n: 20, seg: 8 },
      ),
      a.box(f, w * 0.252, 0.656, -0.02, 0.056, 0.026, 0.3, { r: 0.011 }));
  }
  (a
    .box(o, 0, 0.43, -0.03, 0.47, 0.016, 0.05)
    .box(o, 0, 0.8, -0.3, 0.47, 0.028, 0.016, { rx: -0.1 })
    .box(i, 0, 0.405, -0.02, 0.13, 0.04, 0.17, { r: 0.01 }),
    a
      .cyl(i, 0, 0.27, 0, 0.026, 0.026, 0.27, { seg: 18 })
      .cyl(o, 0, 0.16, 0, 0.031, 0.035, 0.09, { seg: 18 })
      .cyl(o, 0, 0.088, 0, 0.05, 0.058, 0.05, { seg: 24 }));
  for (let w = 0; w < 5; w++) {
    const g = (w / 5) * Math.PI * 2 + 0.3,
      u = Math.sin(g),
      y = Math.cos(g);
    (a.box(o, u * 0.17, 0.078, y * 0.17, 0.044, 0.026, 0.3, {
      ry: g,
      rx: 0.11,
      r: 0.008,
    }),
      a.box(i, u * 0.318, 0.05, y * 0.318, 0.03, 0.03, 0.042, {
        ry: g,
        r: 0.006,
      }));
    for (const b of [-1, 1])
      a.cyl(
        i,
        u * 0.318 + y * b * 0.013,
        0.026,
        y * 0.318 - u * b * 0.013,
        0.024,
        0.024,
        0.012,
        { dir: [y, 0, -u], seg: 16 },
      );
  }
  const x = a.pt(0, 0.6, 0);
  (a.frame(),
    a.flush(Oe),
    (Ye.chair = [+x.x.toFixed(3), 0.6, +x.z.toFixed(3)]));
}
{
  const e = Ao,
    t = 2.5,
    n = 1.85,
    s = 0.52,
    r = -0.8,
    a = 0.015,
    o = We(
      1024,
      760,
      (p, x, w) => {
        const g = ye(61);
        ((p.fillStyle = "#e4dccd"), p.fillRect(0, 0, x, w));
        for (let y = 0; y < 26e3; y++) {
          const b = g();
          ((p.fillStyle =
            b < 0.5
              ? `rgba(120,104,86,${0.05 + g() * 0.08})`
              : `rgba(255,250,240,${0.06 + g() * 0.09})`),
            p.fillRect(g() * x, g() * w, 1 + g() * 2.5, 1 + g() * 1.5));
        }
        const u = (y, b, M) => {
          ((p.strokeStyle = b),
            (p.lineWidth = M),
            p.strokeRect(y, y, x - 2 * y, w - 2 * y));
        };
        (u(34, "#3a3733", 6),
          u(52, "#a65b3e", 10),
          u(70, "#3a3733", 3),
          (p.strokeStyle = "rgba(58,55,51,.22)"),
          (p.lineWidth = 2));
        for (let y = 0; y < 15; y++) {
          const b = 110 + (y * (w - 220)) / 14;
          p.beginPath();
          for (let M = 110; M <= x - 110; M += 12) {
            const T = b + Math.sin(M * 0.05 + y) * 2;
            M > 110 ? p.lineTo(M, T) : p.moveTo(M, T);
          }
          p.stroke();
        }
        for (let y = 0; y < 9e3; y++)
          ((p.fillStyle = `rgba(${g() < 0.5 ? 40 : 255},${g() < 0.5 ? 35 : 250},${g() < 0.5 ? 30 : 240},${0.04 + g() * 0.05})`),
            p.fillRect(g() * x, g() * w, 3, 1));
      },
      !0,
    ),
    i = pt(
      new l.MeshStandardMaterial({
        map: o,
        roughness: 1,
        envMapIntensity: 0.15,
      }),
    ),
    c = new l.BoxGeometry(t, 0.012, n),
    f = c.attributes.uv;
  for (let p = 0; p < f.count; p++)
    (p < 8 || p >= 12) && f.setXY(p, 0.02, 0.02);
  const d = new l.Mesh(c, i);
  (d.position.set(s, 0.006, r),
    (d.rotation.y = a),
    (d.castShadow = !1),
    (d.receiveShadow = !0),
    Oe.add(d));
  const h = e.B();
  for (const p of [-1, 1])
    for (let x = 0; x < 44; x++) {
      const w = -n / 2 + 0.03 + (x * (n - 0.06)) / 43;
      h.box(
        e.T(e.VC, "#e7ded0"),
        p * (t / 2 + 0.026),
        0.0025,
        w,
        0.052,
        0.003,
        0.012,
      );
    }
  h.flush(Oe, !1).forEach((p) => {
    (p.position.set(s, 0, r), (p.rotation.y = a));
  });
}
{
  const e = Ao,
    { T: t, G: n, GB: s, VC: r, VS: a, VM: o, WOOD: i, FAB: c, FOL: f } = e,
    d = e.B(),
    h = En.x0,
    m = t(i, "#ab8e70"),
    p = t(i, "#b69878"),
    x = t(o, "#1d1e21"),
    w = ye(77),
    g = -1.12,
    u = 0.68,
    y = 0.44,
    b = h + 0.015 + y / 2,
    M = 0.13,
    T = 0.47,
    S = M + T + 0.03,
    C = (g + u) / 2,
    R = u - g;
  d.box(m, b, M + T / 2, C, y, T, R).box(
    p,
    b + 0.006,
    M + T + 0.015,
    C,
    y + 0.02,
    0.03,
    R + 0.02,
    { r: 0.004 },
  );
  for (const [I, G] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ])
    d.box(
      x,
      b + I * (y / 2 - 0.04),
      M / 2,
      C + G * (R / 2 - 0.05),
      0.022,
      M,
      0.022,
    );
  const z = h + 0.015 + y;
  for (let I = 0; I < 3; I++) {
    const G = g + (I * R) / 3,
      V = G + R / 3;
    for (let B = 0; B < 28; B++) {
      const O = G + 0.018 + (B * (R / 3 - 0.036)) / 27;
      d.cyl(m, z + 0.002, M + T / 2, O, 0.0072, 0.0072, T - 0.05, { seg: 8 });
    }
    (d.box(t(r, "#2a2118"), z + 0.001, M + T / 2, V, 0.004, T - 0.02, 0.004),
      d.sph(
        t(o, "#c29b5b"),
        z + 0.014,
        M + T - 0.07,
        I === 1 ? G + 0.03 : I === 0 ? V - 0.03 : G + 0.03,
        0.009,
        { seg: 10 },
      ));
  }
  {
    const I = b,
      G = -0.86,
      V = S;
    (d.geo(
      t(a, "#8e9a86"),
      e.lathe(
        [
          [0, 0],
          [0.06, 0],
          [0.1, 0.07],
          [0.098, 0.15],
          [0.05, 0.23],
          [0.02, 0.26],
          [0.02, 0.29],
          [0, 0.29],
        ],
        28,
      ),
      I,
      V,
      G,
    ),
      d.cyl(t(o, "#c29b5b"), I, V + 0.33, G, 0.006, 0.006, 0.08, { seg: 8 }),
      d.cyl(n("#f2c894", 0.95), I, V + 0.43, G, 0.16, 0.17, 0.22, {
        seg: 36,
        open: !0,
      }),
      d.cyl(s("#ffe6c4", 1.6), I, V + 0.43, G, 0.158, 0.168, 0.218, {
        seg: 36,
        open: !0,
      }),
      d.sph(n("#fff3df", 5), I, V + 0.39, G, 0.026),
      (Ne.credL = qe(I + 0.1 + Re.desk, V + 0.4, G, "#ffc98a", 1.9, 1)));
  }
  {
    let I = S;
    for (const [G, V, B, O, j] of [
      [0.3, 0.23, 0.034, "#2e3a4c", 0.1],
      [0.27, 0.21, 0.028, "#d6cdbd", -0.06],
      [0.24, 0.19, 0.03, "#a65b3e", 0.14],
    ])
      (d.frame(b, I, -0.18, j),
        d
          .box(t(r, O), 0, 0.0015, 0, G, 0.003, V)
          .box(t(r, O), 0, B - 0.0015, 0, G, 0.003, V)
          .box(t(r, O), 0, B / 2, -V / 2 + 0.0015, G, B, 0.003)
          .box(
            t(r, "#ece6da"),
            0,
            B / 2,
            0.0015,
            G - 0.007,
            B - 0.005,
            V - 0.006,
          ),
        d.frame(),
        (I += B));
    d.sph(t(o, "#c29b5b"), b + 0.02, I + 0.034, -0.2, 0.034, {
      seg: 20,
      seg2: 14,
    });
  }
  {
    const I = b - 0.01,
      G = 0.42,
      V = S;
    d.geo(
      t(a, "#34363a"),
      e.lathe(
        [
          [0, 0],
          [0.05, 0],
          [0.075, 0.06],
          [0.08, 0.12],
          [0.06, 0.2],
          [0.03, 0.26],
          [0.034, 0.29],
          [0.03, 0.29],
          [0.026, 0.26],
          [0, 0.25],
        ],
        24,
      ),
      I,
      V,
      G,
    );
    for (let B = 0; B < 5; B++) {
      const O = B * 1.3 + 0.3,
        j = 0.12 + B * 0.05,
        J = new l.Vector3(I, V + 0.27, G),
        K = new l.Vector3(
          I + Math.sin(O) * j * 0.35,
          V + 0.52,
          G + Math.cos(O) * j * 0.35,
        ),
        X = new l.Vector3(
          I + Math.sin(O) * j * 0.9,
          V + 0.78 + B * 0.03,
          G + Math.cos(O) * j * 0.9,
        );
      d.tube(t(r, "#8a6a48"), [J, K, X], 0.0026, { n: 12, seg: 4 });
      for (let q = 0; q < 7; q++) {
        const ne = 0.4 + q * 0.09,
          le = new l.CatmullRomCurve3([J, K, X]).getPoint(ne);
        d.geo(
          f,
          e.placeLeaf(
            e.leafGeo(0.03, 0.012, { seg: 3, fold: 0.2, curl: 0.1 }),
            le,
            new l.Vector3(Math.sin(O + q), 1.4, Math.cos(O + q)).normalize(),
            q,
            new l.Color("#b59a6c"),
          ),
          0,
          0,
          0,
          { uv: "keep" },
        );
      }
    }
  }
  {
    const V = h + 0.012,
      B = 1.5,
      O = -0.2,
      j = We(720, 528, (q, ne, le) => {
        const ee = ye(19),
          Te = q.createLinearGradient(0, 0, 0, le);
        (Te.addColorStop(0, "#2d3a55"),
          Te.addColorStop(0.52, "#c98d6c"),
          Te.addColorStop(0.62, "#e9c39a"),
          Te.addColorStop(1, "#e9c39a"),
          (q.fillStyle = Te),
          q.fillRect(0, 0, ne, le),
          (q.fillStyle = "#f5dcb2"),
          q.beginPath(),
          q.arc(ne * 0.66, le * 0.5, 40, 0, 7),
          q.fill());
        for (const [fe, de, Pe, Ce] of [
          ["#6f7c7a", 300, 46, 0.011],
          ["#4a5a5e", 350, 40, 0.016],
          ["#33413f", 400, 34, 0.021],
          ["#212b2c", 455, 24, 0.03],
        ]) {
          ((q.fillStyle = fe), q.beginPath(), q.moveTo(0, le));
          for (let Ue = 0; Ue <= ne; Ue += 8)
            q.lineTo(
              Ue,
              de -
                Math.abs(Math.sin(Ue * Ce + de)) * Pe -
                Math.sin(Ue * 0.05) * 6,
            );
          (q.lineTo(ne, le), q.fill());
        }
        for (let fe = 0; fe < (ne * le) / 50; fe++)
          ((q.fillStyle = `rgba(255,255,255,${0.03 + ee() * 0.04})`),
            q.fillRect(ee() * ne, ee() * le, 1.5, 1.5));
      }),
      J = 0.028,
      K = p;
    (d
      .box(K, V + 0.02, B, O - 0.9 / 2 + J / 2, 0.04, 0.66, J)
      .box(K, V + 0.02, B, O + 0.9 / 2 - J / 2, 0.04, 0.66, J)
      .box(K, V + 0.02, B + 0.66 / 2 - J / 2, O, 0.04, J, 0.9 - J * 2)
      .box(K, V + 0.02, B - 0.66 / 2 + J / 2, O, 0.04, J, 0.9 - J * 2),
      d.box(
        t(r, "#f1ede4"),
        V + 0.006,
        B,
        O,
        0.012,
        0.66 - J * 2,
        0.9 - J * 2,
      ));
    const X = new l.Mesh(
      new l.PlaneGeometry(0.9 - J * 2 - 0.1, 0.66 - J * 2 - 0.1),
      pt(
        new l.MeshStandardMaterial({
          map: j,
          roughness: 0.8,
          envMapIntensity: 0.3,
        }),
      ),
    );
    (X.position.set(V + 0.0135, B, O),
      (X.rotation.y = Math.PI / 2),
      (X.receiveShadow = !0),
      Oe.add(X));
  }
  d.flush(Oe);
}
{
  const e = Ao,
    { T: t, VC: n, VS: s, FOL: r, WOOD: a } = e,
    o = e.B(),
    i = En.z0,
    c = t(a, "#ad9170"),
    f = 2.04,
    d = i + 0.11,
    h = ye(55);
  for (const m of [1.13, 1.53])
    o.box(c, f, m, d, 0.46, 0.028, 0.22, { r: 0.003 });
  {
    o.geo(
      t(s, "#2a2c30"),
      e.slab(0.104, 0.104, 0.034, 0.026, 0.005, 3),
      0.2,
      0.8205,
      -1.893,
    ).geo(
      t(n, "#1b1c1f"),
      e.flat(0.07, 0.07, 0.02),
      0.2,
      0.8205 + 0.0342,
      -1.893,
    );
    for (let u = 0; u < 5; u++)
      o.box(
        t(n, "#131416"),
        0.2 - 0.024 + u * 0.012,
        0.8205 + 0.0345,
        -1.893,
        0.004,
        4e-4,
        0.05,
      );
    const w = new l.Mesh(
      new l.SphereGeometry(0.0024, 10, 8),
      new l.MeshBasicMaterial({ color: new l.Color(0.3, 0.9, 0.8), fog: !1 }),
    );
    (w.position.set(0.2, 0.8205 + 0.02, -1.893 + 0.0515), Oe.add(w));
    const g = new l.Mesh(new l.PlaneGeometry(0.05, 0.05), zc("#9ff5e6", 0));
    (g.position.set(0.2, 0.8205 + 0.02, -1.893 + 0.056),
      (g.renderOrder = 4),
      Oe.add(g),
      ze.push(g),
      et.push(g),
      (Ne.led = w),
      (Ne.ledHalo = g),
      (Ne.ledL = qe(
        0.2 + Re.desk,
        0.8205 + 0.03,
        -1.893 + 0.12,
        "#8ff0e0",
        0.35,
        0,
      )),
      (Ye.router = [
        0.2,
        +(0.8205 + 0.02).toFixed(3),
        +(-1.893 + 0.052).toFixed(3),
      ]));
  }
  {
    let m = 1.86;
    for (const [p, x, w, g, u] of [
      [0.028, 0.22, 0.16, "#2e3a4c", "#b89a5e"],
      [0.022, 0.2, 0.15, "#c9b79a", null],
      [0.032, 0.235, 0.17, "#5f6b5a", "#d9cfbc"],
      [0.026, 0.21, 0.16, "#8f4f38", null],
      [0.03, 0.225, 0.165, "#d9d0c1", "#3a3733"],
      [0.02, 0.19, 0.14, "#3a3733", null],
    ])
      (e.book(o, m + p / 2, 1.144, d + 0.005, p, x, w, g, 0, u),
        (m += p + 0.002));
    e.book(
      o,
      m + 0.07,
      1.144 + 0,
      d + 0.005,
      0.024,
      0.2,
      0.15,
      "#b9a27f",
      0,
      null,
    );
  }
  {
    const x = d;
    (o.geo(
      t(s, "#efece6"),
      e.lathe(
        [
          [0, 0],
          [0.045, 0],
          [0.052, 0.08],
          [0.056, 0.09],
          [0.05, 0.09],
          [0, 0.086],
        ],
        24,
      ),
      2.13,
      1.544,
      x,
    ),
      o.cyl(t(n, "#2b2119"), 2.13, 1.544 + 0.084, x, 0.047, 0.047, 0.004, {
        seg: 18,
      }));
    for (let w = 0; w < 4; w++) {
      let g = new l.Vector3(2.1 + w * 0.02, 1.6340000000000001, x + 0.02),
        u = new l.Vector3((w - 1.5) * 0.12, 0.35, 1).normalize();
      const y = 5 + w * 2;
      for (let b = 0; b < y; b++)
        ((g = g.clone().addScaledVector(u, 0.045)),
          (u.y -= 0.35),
          (u.x += (h() - 0.5) * 0.25),
          (u.z = Math.max(0.05, u.z * 0.7)),
          u.normalize(),
          g.z > x + 0.12 && (g.z = x + 0.12),
          o.geo(
            r,
            e.placeLeaf(
              e.leafGeo(0.05, 0.046, {
                shape: "heart",
                fold: 0.22,
                curl: 0.16,
                seg: 6,
              }),
              g,
              new l.Vector3(h() - 0.5, 0.35, 1).normalize(),
              h() * 2,
              e.leafTint(h).multiplyScalar(1.12),
            ),
            0,
            0,
            0,
            { uv: "keep" },
          ));
    }
    o.geo(
      t(s, "#c9b59a"),
      e.lathe(
        [
          [0, 0],
          [0.03, 0],
          [0.045, 0.05],
          [0.04, 0.11],
          [0.02, 0.15],
          [0.022, 0.17],
          [0.018, 0.17],
          [0, 0.16],
        ],
        20,
      ),
      1.92,
      1.544,
      x,
    );
  }
  o.flush(Oe);
}
{
  const e = Ao,
    { T: t, VS: n, VC: s, FOL: r } = e,
    a = e.B(),
    o = -1.86,
    i = -1.5,
    c = ye(5);
  (a.geo(
    t(n, "#d6cec1"),
    e.lathe(
      [
        [0, 0],
        [0.16, 0],
        [0.18, 0.02],
        [0.2, 0.42],
        [0.212, 0.44],
        [0.198, 0.44],
        [0.19, 0.42],
        [0, 0.41],
      ],
      32,
    ),
    o,
    0,
    i,
  ),
    a.cyl(t(s, "#2b2119"), o, 0.412, i, 0.19, 0.19, 0.006, { seg: 24 }));
  for (const [f, d, h] of [
    [0.02, 1.62, 0],
    [0.2, 1.3, 0.12],
    [-0.18, 1.12, -0.1],
    [0.08, 0.95, -0.2],
  ]) {
    const m = new l.CatmullRomCurve3([
      new l.Vector3(o, 0.41, i),
      new l.Vector3(o + f * 0.3, 0.41 + d * 0.35, i + h * 0.3),
      new l.Vector3(o + f * 0.8, 0.41 + d * 0.72, i + h * 0.8),
      new l.Vector3(o + f * 1.3, 0.41 + d, i + h * 1.3),
    ]);
    a.geo(t(s, "#4a4038"), new l.TubeGeometry(m, 12, 0.013, 5, !1));
    const p = 8 + Math.floor(c() * 3);
    for (let x = 0; x < p; x++) {
      const w = 0.3 + (0.7 * x) / (p - 1),
        g = m.getPoint(w),
        u = x * 2.4 + c() * 0.6,
        y = 0.25 + w * 0.5 + c() * 0.2,
        b = new l.Vector3(
          Math.cos(u) * Math.cos(y),
          Math.sin(y),
          Math.sin(u) * Math.cos(y),
        ),
        M = 0.25 + c() * 0.1 - 0.06 * w;
      a.geo(
        r,
        e.placeLeaf(
          e.leafGeo(M, M * 0.78, {
            shape: "fiddle",
            fold: 0.2,
            curl: 0.26,
            seg: 5,
          }),
          g,
          b,
          (c() - 0.5) * 0.8,
          e.leafTint(c),
        ),
        0,
        0,
        0,
        { uv: "keep" },
      );
    }
  }
  a.flush(Oe);
}
{
  const e = Ao,
    { T: t, G: n, VM: s } = e,
    r = e.B(),
    a = t(s, "#c29b5b"),
    o = -1.02,
    i = 1.74,
    c = En.z0;
  (r
    .cyl(a, o, i, c + 0.006, 0.042, 0.042, 0.012, { rx: Math.PI / 2, seg: 28 })
    .cyl(a, o, i, c + 0.06, 0.007, 0.007, 0.1, { rx: Math.PI / 2, seg: 10 })
    .cyl(a, o, i + 0.02, c + 0.115, 0.018, 0.022, 0.03, { seg: 16 }),
    r.sph(n("#ffe2bc", 1.12), o, i + 0.1, c + 0.115, 0.075, {
      seg: 28,
      seg2: 20,
    }),
    r.flush(Oe).forEach((f) => {
      f.material.isMeshBasicMaterial && et.push(f);
    }),
    (Ne.sconceL = qe(o + Re.desk, i + 0.1, c + 0.3, "#ffcf98", 1.35, 0.75)));
}
{
  const e = Ao,
    { T: t, G: n, GB: s, VC: r, VS: a, VM: o, WOOD: i, FAB: c } = e,
    f = e.B(),
    d = t(i, "#ab8e70"),
    h = t(c, "#8e9a84"),
    m = t(o, "#c29b5b");
  f.frame(-1.7, 0, 0.78, 2.3);
  {
    for (const g of [-1, 1]) {
      const u = g * 0.345;
      f.box(d, u, 0.56 / 2 - 0.01, 0.8 / 2 - 0.08, 0.046, 0.56 - 0.02, 0.046)
        .box(d, u, 0.56 / 2 + 0.03, -0.8 / 2 + 0.1, 0.046, 0.56 + 0.14, 0.046, {
          rx: -0.16,
        })
        .box(d, u, 0.56 + 0.014, 0, 0.078, 0.032, 0.8 - 0.02, { r: 0.012 })
        .box(d, u, 0.13, 0, 0.036, 0.04, 0.8 - 0.2);
    }
    (f
      .box(d, 0, 0.28, 0.8 / 2 - 0.08, 0.76 - 0.09, 0.05, 0.036)
      .box(d, 0, 0.28, -0.8 / 2 + 0.12, 0.76 - 0.09, 0.05, 0.036)
      .box(d, 0, 0.72, -0.8 / 2 + 0.02, 0.76 - 0.09, 0.05, 0.036, { rx: -0.3 }),
      f
        .geo(
          h,
          e.cushion(0.76 - 0.12, 0.13, 0.8 - 0.16, 0.05, 0.016, 2),
          0,
          0.37,
          0.03,
        )
        .geo(
          h,
          e.cushion(0.76 - 0.13, 0.48, 0.13, 0.06, 0.01, 2),
          0,
          0.66,
          -0.8 / 2 + 0.15,
          { rx: -0.3 },
        ),
      f.geo(t(c, "#b36a4c"), e.pillow(0.36, 0.3, 0.12), 0, 0.58, -0.1, {
        rx: -0.34,
        rz: 0.06,
      }));
  }
  f.frame();
  {
    for (let g = 0; g < 3; g++) {
      const u = (g / 3) * Math.PI * 2 + 0.4,
        y = -2.03 + Math.cos(u) * 0.27,
        b = 1.07 + Math.sin(u) * 0.27,
        M = -2.03 + Math.cos(u) * 0.03,
        T = 1.07 + Math.sin(u) * 0.03,
        S = 1.52 - 0.34;
      f.cyl(
        d,
        (y + M) / 2,
        S / 2,
        (b + T) / 2,
        0.011,
        0.015,
        Math.hypot(y - M, S, b - T),
        { dir: [M - y, S, T - b], seg: 8 },
      );
    }
    (f
      .cyl(m, -2.03, 1.52 - 0.3, 1.07, 0.011, 0.011, 0.14, { seg: 8 })
      .tor(m, -2.03, 1.52 + 0.03, 1.07, 0.2, 0.004, {
        rx: Math.PI / 2,
        ts: 32,
        rs: 4,
      })
      .tor(m, -2.03, 1.52 - 0.27, 1.07, 0.225, 0.004, {
        rx: Math.PI / 2,
        ts: 32,
        rs: 4,
      }),
      f
        .cyl(n("#f0c894", 1), -2.03, 1.52 - 0.12, 1.07, 0.2, 0.225, 0.3, {
          seg: 36,
          open: !0,
        })
        .cyl(s("#ffe4c0", 1.5), -2.03, 1.52 - 0.12, 1.07, 0.198, 0.223, 0.298, {
          seg: 36,
          open: !0,
        })
        .sph(n("#fff0d8", 4.5), -2.03, 1.52 - 0.19, 1.07, 0.03),
      (Ne.floorL = qe(
        -2.03 + 0.2 + Re.desk,
        1.52 - 0.25,
        1.07 - 0.2,
        "#ffc98a",
        2.3,
        1.05,
      )));
  }
  {
    const g = t(i, "#584438");
    (f
      .geo(
        g,
        e.lathe(
          [
            [0, 0.5 - 0.028],
            [0.22, 0.5 - 0.028],
            [0.225, 0.5 - 0.012],
            [0.22, 0.5],
            [0, 0.5],
          ],
          36,
        ),
        -1.15,
        0,
        1.06,
        { uv: "box" },
      )
      .cyl(g, -1.15, 0.5 / 2, 1.06, 0.026, 0.034, 0.5 - 0.03, { seg: 14 })
      .cyl(g, -1.15, 0.012, 1.06, 0.16, 0.17, 0.024, { seg: 30 }),
      f
        .box(
          t(r, "#d8cfbf"),
          -1.15 - 0.05,
          0.5 + 0.012,
          1.06 + 0.02,
          0.13,
          0.024,
          0.2,
          { ry: 0.4 },
        )
        .box(
          t(r, "#a65b3e"),
          -1.15 - 0.05,
          0.5 + 0.0245,
          1.06 + 0.02,
          0.132,
          0.001,
          0.202,
          { ry: 0.4 },
        ),
      f.geo(
        t(a, "#e9e4da"),
        e.lathe(
          [
            [0, 0],
            [0.028, 0],
            [0.034, 0.005],
            [0.036, 0.06],
            [0.033, 0.062],
            [0.031, 0.01],
            [0, 0.008],
          ],
          20,
        ),
        -1.15 + 0.09,
        0.5,
        1.06 - 0.06,
      ));
  }
  f.flush(Oe);
}
{
  const e = {
      c: [-150, -250],
      d: [0.83, -0.56],
      w: 190,
      m: 55,
      l: 480,
      bridge: -120,
    },
    t = -96,
    n = 0.42,
    s = 96,
    r = 80,
    a = ye(1234),
    o = Math.cos(n),
    i = Math.sin(n),
    c = [-120, -1150],
    f = {
      uCityLit: { value: 0.9 },
      uCityK: { value: 1.9 },
      uCityFog: { value: 0.28 },
      uCityHaze: { value: 0.07 },
      uCT: { value: 0 },
      uGA: { value: n },
      uOx: { value: Re.desk },
      uCY: { value: t },
    };
  Ne.cityU = f;
  const d =
      "float ch1(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}",
    h = pt(
      new l.MeshStandardMaterial({
        color: "#07090e",
        roughness: 0.9,
        metalness: 0,
        envMapIntensity: 0.06,
      }),
      Object.assign(
        (R) => {
          (Object.assign(R.uniforms, f),
            (R.vertexShader = R.vertexShader
              .replace(
                "#include <common>",
                `#include <common>
varying vec2 vFac;varying float vFW;varying float vRoof;varying float vSeed;varying float vBH;`,
              )
              .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
{vec3 sc=vec3(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz),length(instanceMatrix[2].xyz));bool sx=abs(normal.x)>.5;
 vFW=sx?sc.z:sc.x;vFac=vec2((sx?position.z:position.x)*vFW+vFW*.5,position.y*sc.y);vRoof=step(.5,normal.y);vBH=sc.y;
 vSeed=fract(sin(dot(instanceMatrix[3].xz,vec2(12.9898,78.233)))*43758.5453);}`,
              )),
            (R.fragmentShader = R.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
varying vec2 vFac;varying float vFW;varying float vRoof;varying float vSeed;varying float vBH;uniform float uCityLit;uniform float uCityK;uniform float uCityFog;uniform float uCityHaze;` +
                  d,
              )
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
if(vRoof<.5){float kind=fract(vSeed*13.7);float n=max(floor(vFW/(kind<.4?3.1:2.7)),1.),bw=vFW/n;
 vec2 q=vec2(vFac.x/bw,vFac.y/3.4),ci=floor(q),f=fract(q);
 float pane=kind<.4?smoothstep(.18,.26,f.x)*smoothstep(.82,.74,f.x)*smoothstep(.24,.32,f.y)*smoothstep(.86,.78,f.y)
  :kind<.75?smoothstep(.06,.12,f.x)*smoothstep(.94,.88,f.x)*smoothstep(.2,.28,f.y)*smoothstep(.9,.82,f.y)
  :smoothstep(.02,.05,f.x)*smoothstep(.98,.95,f.x)*smoothstep(.3,.38,f.y)*smoothstep(.95,.88,f.y);
 vec2 grp=floor(ci/vec2(3.,2.));float h1=ch1(grp+vSeed*97.1),h2=ch1(vec2(ci.y,vSeed*31.)),h3=ch1(ci*1.37+vSeed*7.);
 float lit=kind>.75?step(.78+.2*fract(vSeed*3.1),h2)*step(.15,h3):step(uCityLit-.12*fract(vSeed*5.3),h1)*step(.18,h3);
 float tone=fract(h1*7.31);vec3 wc=tone<.62?mix(vec3(1.,.55,.26),vec3(1.,.72,.44),fract(h1*3.7)):tone<.9?vec3(1.,.86,.66):vec3(.72,.84,1.);
 float aa=clamp(max(fwidth(q.x),fwidth(q.y))*1.3-.35,0.,1.);
 float e=mix(pane*lit*(.55+.9*fract(h1*3.3)),.045,aa);
 float lob=smoothstep(.5,1.4,vFac.y)*smoothstep(4.4,3.8,vFac.y);
 float crown=step(130.,vBH)*step(.62,fract(vSeed*7.7))*smoothstep(vBH-4.,vBH-3.2,vFac.y)*smoothstep(vBH-1.,vBH-1.6,vFac.y);
 totalEmissiveRadiance+=(wc*e+vec3(1.,.8,.58)*lob*.45+vec3(1.,.9,.75)*crown*.9)*uCityK;
 diffuseColor.rgb*=1.-pane*.4*(1.-aa);}`,
              )
              .replace(
                "max(dist-uFogS,0.)*uFogD",
                "max(dist-uFogS,0.)*uFogD*uCityFog",
              )
              .replace("skyCol(dir)*uFogK", "skyCol(dir)*uFogK*uCityHaze")));
        },
        { key: "deskCity" },
      ),
    ),
    m = [],
    p = [],
    x = (R, z) => [R * o - z * i, R * i + z * o];
  for (let R = -17; R <= 17; R++)
    for (let z = -20; z <= 20; z++) {
      const [I, G] = x((R + 0.5) * s, (z + 0.5) * r),
        V = Math.hypot(I, G);
      if (V > 1480 || V < 60) continue;
      const B = Math.hypot(I - c[0], G - c[1]),
        O = B < 400,
        j = a() < 0.55 ? 2 : 1,
        J = a() < 0.5 ? 2 : 1,
        K = s - 19,
        X = r - 19;
      for (let q = 0; q < j; q++)
        for (let ne = 0; ne < J; ne++) {
          if (j * J > 1 && a() < 0.12) continue;
          const le = K / j,
            ee = X / J,
            Te = le - 2 - a() * le * 0.3,
            fe = ee - 2 - a() * ee * 0.3,
            de = R * s + 9.5 + le * (q + 0.5),
            Pe = z * r + 9.5 + ee * (ne + 0.5),
            [Ce, Ue] = x(de, Pe),
            it = Math.hypot(Ce, Ue);
          {
            const Ro = Ce - e.c[0],
              on = Ue - e.c[1],
              vt = Ro * e.d[0] + on * e.d[1],
              P = -Ro * e.d[1] + on * e.d[0] + e.m * Math.sin(vt / e.l);
            if (Math.abs(P) < e.w + 14 + Math.max(Te, fe) * 0.6) continue;
          }
          let ut = O
            ? 60 + 190 * Math.pow(a(), 1.2) * (1 - B / 480)
            : 9 + 34 * Math.pow(a(), 2.6);
          (!O && a() < 0.025 && (ut = 90 + 90 * a()),
            it < 260 && (ut = Math.min(ut, 70 - (260 - it) * 0.08)),
            (ut = Math.max(ut, 8)),
            m.push([Ce, Ue, Te, ut, fe]));
          let Yt = ut;
          if (ut > 120) {
            const Ro = ut * (0.14 + a() * 0.1);
            if (
              (m.push([Ce, Ue, Te * 0.72, Yt + Ro, fe * 0.72]),
              (Yt += Ro),
              ut > 165)
            ) {
              const on = ut * (0.07 + a() * 0.06);
              (m.push([Ce, Ue, Te * 0.46, Yt + on, fe * 0.46]),
                (Yt += on),
                a() < 0.6 &&
                  (m.push([Ce, Ue, 0.9, Yt + 14 + a() * 16, 0.9]), (Yt += 22)));
            }
          }
          Yt > 150 && p.push([Ce, t + Yt + 1.5, Ue]);
        }
    }
  const w = new l.InstancedMesh(
      new l.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
      h,
      m.length,
    ),
    g = new l.Matrix4(),
    u = new l.Quaternion().setFromAxisAngle(Zt, -n),
    y = new l.Vector3(),
    b = new l.Vector3();
  (m.forEach(([R, z, I, G, V], B) =>
    w.setMatrixAt(B, g.compose(y.set(R, t, z), u, b.set(I, G, V))),
  ),
    (w.frustumCulled = !1),
    Oe.add(w),
    ze.push(w),
    et.push(w));
  const M = pt(
      new l.MeshStandardMaterial({
        color: "#06080c",
        roughness: 0.95,
        metalness: 0,
        envMapIntensity: 0.05,
      }),
      Object.assign(
        (R) => {
          (Object.assign(R.uniforms, f),
            (R.fragmentShader = R.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
uniform float uCityK;uniform float uCityFog;uniform float uCityHaze;uniform float uCT;uniform float uGA;uniform float uOx;` +
                  d +
                  `
float cn2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(ch1(i),ch1(i+vec2(1.,0.)),f.x),mix(ch1(i+vec2(0.,1.)),ch1(i+vec2(1.,1.)),f.x),f.y);}`,
              )
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
{vec2 w=vWPos.xz-vec2(uOx,0.);float fw0=max(fwidth(w.x),fwidth(w.y));
 vec2 rc=w-vec2(${e.c[0]}.,${e.c[1]}.);float along=dot(rc,vec2(${e.d[0]},${e.d[1]})),across=dot(rc,vec2(${-e.d[1]},${e.d[0]}))+${e.m}.*sin(along/${e.l}.);
 float water=1.-smoothstep(${e.w - 4}.,${e.w}.,abs(across)),bank=exp(-pow((abs(across)-${e.w + 6}.)/max(1.2,fw0*.7),2.))*min(1.,1.4/max(1.,fw0*fw0*.5));
 float c=cos(uGA),s=sin(uGA);vec2 p=vec2(w.x*c+w.y*s,-w.x*s+w.y*c);
 vec2 B=vec2(96.,80.),id=floor(p/B),f=p-id*B,d=min(f,B-f);float fw=max(fwidth(p.x),fwidth(p.y));
 float sg=max(1.,fw*.7),kk=1./(sg*sg),kn=min(1.,1.2/(sg*sg));
 float lx=mod(p.x,24.)-12.,lz=mod(p.y,24.)-12.;
 float lamps=(exp(-(lx*lx+(d.y-7.)*(d.y-7.))*kk)+exp(-(lz*lz+(d.x-7.)*(d.x-7.))*kk))*kn;
 float wash=(1.-smoothstep(6.,9.,d.y))+(1.-smoothstep(6.,9.,d.x));
 float ay=p.y/B.y,ly=floor(ay+.5),dy=p.y-ly*B.y,ax=p.x/B.x,lx2=floor(ax+.5),dx=p.x-lx2*B.x;
 vec3 car=vec3(0.);float cs=max(.9,fw*.6),ck=1./(cs*cs),cn=min(1.,.8/(cs*cs));
 if(mod(ly,3.)==0.){for(int k=0;k<2;k++){float dir=k==0?1.:-1.,lane=dir*2.6,sp=p.x+uCT*11.*dir+ch1(vec2(ly,float(k)))*400.,cell=floor(sp/38.),u=sp-cell*38.-19.;
   float on=step(.4,ch1(vec2(cell,ly+float(k)*7.)));car+=(k==0?vec3(1.,.95,.85):vec3(1.,.12,.06)*.9)*exp(-(u*u*.5+(dy-lane)*(dy-lane))*ck)*on*cn;}}
 if(mod(lx2,3.)==0.){for(int k=0;k<2;k++){float dir=k==0?1.:-1.,lane=dir*2.6,sp=p.y+uCT*11.*dir+ch1(vec2(lx2,float(k)+3.))*400.,cell=floor(sp/38.),u=sp-cell*38.-19.;
   float on=step(.4,ch1(vec2(cell,lx2+float(k)*7.+.5)));car+=(k==0?vec3(1.,.95,.85):vec3(1.,.12,.06)*.9)*exp(-(u*u*.5+(dx-lane)*(dx-lane))*ck)*on*cn;}}
 vec3 land=(vec3(1.,.64,.32)*(lamps*.9+wash*.012)+car*1.1)*uCityK;
 // the promenade lamps along both banks
 float pl=mod(along,16.)-8.;vec3 prom=vec3(1.,.72,.42)*exp(-(pl*pl)/max(1.4,fw0*fw0*.4))*bank*2.2;
 // the bridge: a dark deck across the water with a lamp every 30 m on each side
 float bd=along-(${e.bridge}.),bw=abs(bd);float deck=1.-smoothstep(11.,12.5,bw);float ba=mod(across,30.)-15.,bl=exp(-(ba*ba+(bw-10.)*(bw-10.))/max(1.3,fw0*fw0*.5))*step(abs(across),${e.w + 8}.);
 // water: the sky, rippled; the far bank's lights break up in it
 vec3 V=normalize(vWPos-cameraPosition);vec2 rp=w*vec2(.045,.11);float r1=cn2(rp+vec2(uCT*.05,0.))-.5,r2=cn2(rp*2.3-vec2(0.,uCT*.08))-.5;
 vec3 N=normalize(vec3(r1*.03,1.,r2*.05));vec3 R=reflect(V,N);R.y=abs(R.y);float fr=.02+.98*pow(clamp(1.-dot(-V,N),0.,1.),5.);
 vec3 sky=skyCol(R)*fr*1.3;
 float far=exp(-pow((across+${e.w - 10}.)/42.,2.))+exp(-pow((across-${e.w - 10}.)/30.,2.))*.5;float sh=pow(cn2(vec2(along*.09,across*.02+uCT*.1)),3.)*pow(cn2(vec2(along*.021,across*.13)),1.5);
 vec3 wat=sky+vec3(1.,.7,.42)*far*sh*.9*(1.-deck);
 diffuseColor.rgb*=1.-water;
 totalEmissiveRadiance+=mix(land,wat,water)+prom*uCityK+vec3(1.,.8,.55)*bl*2.*uCityK*water;
 totalEmissiveRadiance*=1.-deck*water*.85;}`,
              )
              .replace(
                "max(dist-uFogS,0.)*uFogD",
                "max(dist-uFogS,0.)*uFogD*uCityFog",
              )
              .replace("skyCol(dir)*uFogK", "skyCol(dir)*uFogK*uCityHaze")));
        },
        { key: "deskGround" },
      ),
    ),
    T = new l.Mesh(new l.PlaneGeometry(3400, 3400), M);
  ((T.rotation.x = -Math.PI / 2),
    T.position.set(0, t, 0),
    Oe.add(T),
    ze.push(T),
    et.push(T));
  const S = new l.MeshBasicMaterial({
      color: new l.Color(3, 0.25, 0.12),
      fog: !1,
    }),
    C = new l.InstancedMesh(
      new l.SphereGeometry(1.1, 8, 6),
      S,
      Math.max(p.length, 1),
    );
  (p.forEach((R, z) => C.setMatrixAt(z, g.makeTranslation(R[0], R[1], R[2]))),
    (C.count = p.length),
    (C.frustumCulled = !1),
    Oe.add(C),
    ze.push(C),
    et.push(C),
    (Ne.avM = S));
}
(qe(Re.desk + 0.1, 2.1, -0.4, "#ffd2a0", 4.2, 0.3),
  qe(Re.desk + 0.62, 1.35, -1.62, "#9fb2e0", 2.2, 0.22));
const Ia = {
  study: () => ({
    set: "desk",
    t: [0.3, 0.72, -0.55],
    yaw: 0.47,
    pitch: 0.35,
    dist: 10.4,
    f: [0.45, 0.8, -1.1],
    r: 3.2,
  }),
  laptop: () => ({
    set: "desk",
    t: [Ye.laptop[0] + 0.01, Ye.laptop[1] + 0.1, Ye.laptop[2] - 0.05],
    yaw: Ne.lapRy + 0.17,
    pitch: 0.24,
    dist: 1.08,
    f: Ye.screen,
    r: 0.42,
  }),
  screen: () => ({
    set: "desk",
    t: [
      Ye.screen[0] + Math.cos(Ne.lapRy) * 0.022,
      Ye.screen[1],
      Ye.screen[2] - Math.sin(Ne.lapRy) * 0.022,
    ],
    yaw: Ne.lapRy,
    pitch: 0.2618,
    dist: 0.8,
    f: Ye.screen,
    r: 0.22,
  }),
};
function Ec(e, t) {
  const n = Ne,
    s = m2(),
    r = s.sent && s.nAns === 0 && (s.waiting || s.thinking),
    a = s.nAns > 0 && !s.done;
  ((s.now = at),
    (s.title = s.history
      ? "Books on light and colour"
      : "Why the sky is blue"));
  const o = [
    Math.round(s.typed * s.prompt.length),
    s.typed >= 1,
    s.sent,
    s.nAns,
    s.done,
    s.history,
    s.caret && !s.sent,
    r ? Math.floor(at * 16) : -1,
    a ? Math.floor(at * 8) : -1,
    s.answerFull.length,
    s.model,
  ].join("|");
  o !== n.appKey && ((n.appKey = o), li.draw(s));
  let i = e >= k.send && e < k.send + 4;
  if (!i && k.arr)
    for (let h = 0; h < k.arr.length; h++) {
      const m = e - k.arr[h];
      if (m > -0.4 && m < 0.9) {
        i = !0;
        break;
      }
    }
  const c = i ? (Ie(Math.floor(at * 22)) > 0.4 ? 1 : 0.18) : 0,
    f = 0.55 + c * 2.6;
  (n.led.material.color.setRGB(0.3 * f, 0.95 * f, 0.82 * f),
    (n.ledHalo.material.opacity = c * 0.55),
    (n.ledL.i = c * 0.5),
    (n.steamU.uT.value = at));
  for (const h of n.steam)
    h.rotation.y = Math.atan2(
      Z.position.x - (h.position.x + Re.desk),
      Z.position.z - h.position.z,
    );
  const d = (at * 0.8) % 1 < 0.3 ? 1 : 0.08;
  (n.avM.color.setRGB(3 * d, 0.25 * d, 0.12 * d), (n.cityU.uCT.value = at));
}
const pe = new l.Group();
(pe.position.set(Re.dc, 0, 0), Yn.add(pe));
const re = (e, t, n) => new l.Vector3(e, t, n),
  Be = { x0: -35, x1: 35, z0: -20, z1: 20, h: 9.6, t: 0.35, rz: -2 },
  xe = { x0: -34.65, x1: -23.3, z0: 8.6, z1: 20 },
  Xt = { z0: -2, z1: 8.6 },
  No = 2.2,
  Mn = 0.6,
  Ls = 1.2,
  Ct = (e) => -21 + 5.4 * e,
  ci = (e) => 15.7 - 0.6 * e,
  Dc = (e) => -1.9 - 0.6 * e,
  La = 24,
  Fc = 23,
  Jt = 0.04445,
  Xo = (e) =>
    pt(
      new l.MeshStandardMaterial({
        roughness: 0.8,
        envMapIntensity: 0.5,
        ...e,
      }),
    ),
  Ba = (e) =>
    pt(
      new l.MeshPhysicalMaterial({
        roughness: 0.4,
        envMapIntensity: 0.9,
        ...e,
      }),
    ),
  fn = (e, t = 1, n = 1) => (
    (e.wrapS = e.wrapT = l.RepeatWrapping),
    e.repeat.set(t, n),
    e
  );
function fi(e, t, n = t) {
  for (const s of [].concat(e)) {
    if (!s) continue;
    const r = s.geometry,
      a = r.attributes.position,
      o = r.attributes.normal,
      i = r.attributes.uv;
    for (let c = 0; c < a.count; c++) {
      const f = a.getX(c),
        d = a.getY(c),
        h = a.getZ(c),
        m = o.getX(c),
        p = o.getY(c),
        x = o.getZ(c),
        w = Math.abs(m),
        g = Math.abs(p),
        u = Math.abs(x);
      g >= w && g >= u
        ? i.setXY(c, f / t, -h / n)
        : w >= u
          ? i.setXY(c, (-h * Math.sign(m)) / t, d / n)
          : i.setXY(c, (f * Math.sign(x)) / t, d / n);
    }
    i.needsUpdate = !0;
  }
}
const ts = (e, t, n, s, r, a = 1, o = 2) => {
    const i = ye(a);
    for (let c = 0; c < s; c++) {
      const f = i() > 0.5 ? 255 : 0;
      ((e.fillStyle = `rgba(${f},${f},${f},${r * i()})`),
        e.fillRect(i() * t, i() * n, o * (0.5 + i()), o * (0.5 + i())));
    }
  },
  ft = {};
((ft.clad = fn(
  We(256, 512, (e, t, n) => {
    const s = ye(3);
    for (let r = 0; r < 2; r++) {
      const a = s(),
        o = e.createLinearGradient(0, 0, 0, n);
      (o.addColorStop(0, `hsl(214,${9 + a * 3}%,${27 + a * 3}%)`),
        o.addColorStop(1, `hsl(214,${9 + a * 3}%,${22 + a * 3}%)`),
        (e.fillStyle = o),
        e.fillRect(r * 128, 0, 128, n),
        (e.fillStyle = "rgba(0,0,0,.5)"),
        e.fillRect(r * 128, 0, 4, n),
        (e.fillStyle = "rgba(255,255,255,.16)"),
        e.fillRect(r * 128 + 4, 0, 2, n),
        (e.fillStyle = "rgba(255,255,255,.05)"),
        e.fillRect(r * 128 + 60, 0, 3, n));
    }
    ((e.fillStyle = "rgba(0,0,0,.55)"),
      e.fillRect(0, n - 4, t, 4),
      (e.fillStyle = "rgba(255,255,255,.08)"),
      e.fillRect(0, 0, t, 2),
      ts(e, t, n, 900, 0.05, 4, 2));
  }),
)),
  (ft.louv = fn(
    We(128, 128, (e, t, n) => {
      ((e.fillStyle = "#14171c"), e.fillRect(0, 0, t, n));
      for (let s = 0; s < n; s += 12.8) {
        const r = e.createLinearGradient(0, s, 0, s + 10);
        (r.addColorStop(0, "#59616c"),
          r.addColorStop(0.25, "#3a414b"),
          r.addColorStop(1, "#20252c"),
          (e.fillStyle = r),
          e.fillRect(0, s, t, 9));
      }
    }),
  )),
  (ft.floor = fn(
    We(512, 512, (e, t, n) => {
      ((e.fillStyle = "#8b919a"), e.fillRect(0, 0, t, n));
      const s = ye(8);
      for (let r = 0; r < 260; r++) {
        const a = s() * t,
          o = s() * n,
          i = 10 + s() * 60,
          c = e.createRadialGradient(a, o, 0, a, o, i),
          f = s() > 0.5;
        (c.addColorStop(0, f ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)"),
          c.addColorStop(1, "rgba(0,0,0,0)"),
          (e.fillStyle = c),
          e.fillRect(a - i, o - i, 2 * i, 2 * i));
      }
      (ts(e, t, n, 5e3, 0.1, 9, 1.5),
        (e.fillStyle = "rgba(20,24,30,.8)"),
        e.fillRect(0, 0, t, 3),
        e.fillRect(0, 0, 3, n));
    }),
  )),
  (ft.asph = fn(
    We(256, 256, (e, t, n) => {
      ((e.fillStyle = "#8a8e94"),
        e.fillRect(0, 0, t, n),
        ts(e, t, n, 6e3, 0.22, 11, 1.6));
    }),
  )),
  (ft.grass = fn(
    We(256, 256, (e, t, n) => {
      ((e.fillStyle = "#5f6d50"), e.fillRect(0, 0, t, n));
      const s = ye(12);
      for (let r = 0; r < 140; r++) {
        const a = s() * t,
          o = s() * n,
          i = 8 + s() * 30,
          c = e.createRadialGradient(a, o, 0, a, o, i);
        (c.addColorStop(
          0,
          s() > 0.5 ? "rgba(40,60,30,.25)" : "rgba(150,160,110,.18)",
        ),
          c.addColorStop(1, "rgba(0,0,0,0)"),
          (e.fillStyle = c),
          e.fillRect(a - i, o - i, 2 * i, 2 * i));
      }
      ts(e, t, n, 3e3, 0.12, 13, 1.5);
    }),
  )),
  (ft.gravel = fn(
    We(256, 256, (e, t, n) => {
      ((e.fillStyle = "#8c8780"), e.fillRect(0, 0, t, n));
      const s = ye(14);
      for (let r = 0; r < 5e3; r++) {
        const a = (110 + s() * 110) | 0;
        ((e.fillStyle = `rgb(${a},${a - 4},${a - 9})`),
          e.beginPath(),
          e.arc(s() * t, s() * n, 0.8 + s() * 1.6, 0, 7),
          e.fill());
      }
    }),
  )),
  (ft.pave = fn(
    We(256, 256, (e, t, n) => {
      ((e.fillStyle = "#9b9a95"),
        e.fillRect(0, 0, t, n),
        ts(e, t, n, 2500, 0.1, 15, 1.5),
        (e.fillStyle = "rgba(40,40,40,.45)"),
        e.fillRect(0, 0, t, 2),
        e.fillRect(0, 0, 2, n),
        e.fillRect(0, n / 2, t, 1),
        e.fillRect(t / 2, 0, 1, n));
    }),
  )),
  (ft.road = We(256, 512, (e, t, n) => {
    ((e.fillStyle = "#8a8e94"),
      e.fillRect(0, 0, t, n),
      ts(e, t, n, 5e3, 0.2, 16, 1.6),
      (e.fillStyle = "#e9e4d6"));
    for (let s = 0; s < n; s += 128) e.fillRect(t / 2 - 3, s, 6, 64);
    ((e.fillStyle = "#dcd6c6"),
      e.fillRect(12, 0, 4, n),
      e.fillRect(t - 16, 0, 4, n));
  })),
  (ft.road.wrapS = ft.road.wrapT = l.RepeatWrapping));
const v = {
  clad: Xo({
    color: "#c9ced6",
    map: ft.clad,
    roughness: 0.55,
    metalness: 0.45,
    envMapIntensity: 0.7,
  }),
  louv: Xo({ color: "#ffffff", map: ft.louv, roughness: 0.5, metalness: 0.3 }),
  trim: Le("#a3aab2", { roughness: 0.34, clearcoat: 0 }),
  dark: se("#1b1f25", { roughness: 0.6 }),
  char: se("#101216", { roughness: 0.55 }),
  cut: se("#dcd4c6", { roughness: 0.95 }),
  wallIn: se("#252c36", { roughness: 0.72, envMapIntensity: 0.55 }),
  roof: se("#7c8086", { roughness: 0.92 }),
  deck: se("#3a3f46", { roughness: 0.8 }),
  steel: Le("#6f7781", { roughness: 0.42, metalness: 0.75, clearcoat: 0 }),
  steelL: Le("#9aa2ac", { roughness: 0.3, clearcoat: 0 }),
  white: se("#d9d8d3", { roughness: 0.6 }),
  grey: se("#8e939a", { roughness: 0.55, metalness: 0.2 }),
  greyD: se("#5b6068", { roughness: 0.55, metalness: 0.25 }),
  race: se("#c9a444", { roughness: 0.55, envMapIntensity: 0.55 }),
  ladder: Le("#2b3037", { roughness: 0.45, metalness: 0.6, clearcoat: 0 }),
  cabY: se("#d6b24a", { roughness: 0.5 }),
  cabA: se("#56c7d6", { roughness: 0.45 }),
  cabB: se("#3d6fa8", { roughness: 0.5 }),
  cabK: se("#15171b", { roughness: 0.5 }),
  cabG: se("#6f757e", { roughness: 0.55 }),
  pipeB: Uo("#4b6f95", { roughness: 0.4, clearcoat: 0.4 }),
  pipeR: Uo("#9a4b3f", { roughness: 0.4, clearcoat: 0.4 }),
  flange: Le("#8b939c", { roughness: 0.35, clearcoat: 0 }),
  bus: Le("#5d646d", { roughness: 0.4, clearcoat: 0 }),
  busD: se("#2c3138", { roughness: 0.5 }),
  cont: Le("#2a3038", { roughness: 0.45, metalness: 0.5, clearcoat: 0 }),
  oak: se("#a07a55", { roughness: 0.6 }),
  terra: se("#b0674a", { roughness: 0.8 }),
  grass: Xo({ color: "#66735a", map: ft.grass, roughness: 0.95 }),
  gravel: Xo({ color: "#c9c4bc", map: ft.gravel, roughness: 0.95 }),
  pave: Xo({ color: "#b9b7b0", map: ft.pave, roughness: 0.85 }),
  kerb: se("#a5a39c", { roughness: 0.85 }),
  road: Xo({
    color: "#565b62",
    map: ft.road,
    roughness: 0.7,
    envMapIntensity: 0.45,
  }),
  porc: Uo("#6a4630", { roughness: 0.3, clearcoat: 0.8 }),
  tfm: se("#7b8379", { roughness: 0.6, metalness: 0.2 }),
  tfmD: se("#5d645c", { roughness: 0.62, metalness: 0.2 }),
  gen: se("#c4c3bd", { roughness: 0.6 }),
  genD: se("#8f8f8a", { roughness: 0.6 }),
  glassDk: new l.MeshPhysicalMaterial({
    color: "#6f8fa8",
    roughness: 0.08,
    metalness: 0,
    transparent: !0,
    opacity: 0.2,
    envMapIntensity: 1.2,
    depthWrite: !1,
    side: l.DoubleSide,
  }),
  ledW: Ke("#dff0ff", 2.4),
  ledWarm: Ke("#ffd9a8", 2.6),
  ledCyan: Ke("#7fe3ff", 2.2),
};
{
  const e = new l.Shape();
  (e.moveTo(-400, -400),
    e.lineTo(400, -400),
    e.lineTo(400, 400),
    e.lineTo(-400, 400),
    e.lineTo(-400, -400));
  const t = new l.Path();
  (t.moveTo(Be.x0, Be.z0),
    t.lineTo(Be.x0, Be.z1),
    t.lineTo(Be.x1, Be.z1),
    t.lineTo(Be.x1, Be.z0),
    t.lineTo(Be.x0, Be.z0),
    e.holes.push(t));
  const n = new l.ShapeGeometry(e);
  n.rotateX(Math.PI / 2);
  const s = n.attributes.position,
    r = n.attributes.uv;
  for (let f = 0; f < s.count; f++) r.setXY(f, s.getX(f) / 5, s.getZ(f) / 5);
  const a = n.attributes.normal;
  for (let f = 0; f < a.count; f++) a.setXYZ(f, 0, 1, 0);
  const o = n.index.array;
  for (let f = 0; f < o.length; f += 3) {
    const d = o[f + 1];
    ((o[f + 1] = o[f + 2]), (o[f + 2] = d));
  }
  const i = Qn("#454a52", {
    k: 0.2,
    roughness: 0.6,
    metalness: 0.15,
    blur: 2.4,
    env: 0.3,
  });
  i.map = ft.asph;
  const c = new l.Mesh(n, i);
  ((c.receiveShadow = !0), pe.add(c), et.push(c));
}
{
  const e = (s, r, a, o, i, c) => {
      const f = new l.PlaneGeometry(r - s, o - a);
      (f.rotateX(-Math.PI / 2), f.translate((s + r) / 2, 0, (a + o) / 2));
      const d = f.attributes.position,
        h = f.attributes.uv;
      for (let p = 0; p < d.count; p++)
        h.setXY(p, d.getX(p) / c, d.getZ(p) / c);
      const m = new l.Mesh(f, i);
      return ((m.receiveShadow = !0), pe.add(m), et.push(m), m);
    },
    t = Qn("#343941", {
      k: 0.46,
      roughness: 0.34,
      metalness: 0.25,
      blur: 1.4,
      env: 0.45,
    });
  ((t.map = ft.floor),
    e(-23.3, Be.x1, Be.z0, Be.z1, t, 3),
    (ft.tile = fn(
      We(512, 512, (s, r, a) => {
        const i = r / 4,
          c = ye(12);
        for (let f = 0; f < 4; f++)
          for (let d = 0; d < 4; d++) {
            const h = c();
            if (
              ((s.fillStyle = `hsl(214,${8 + h * 4}%,${31 + h * 5}%)`),
              s.fillRect(f * i, d * i, i, i),
              (f + d * 3) % 5 === 0)
            ) {
              s.fillStyle = "rgba(10,12,16,.75)";
              for (let m = 0; m < 9; m++)
                for (let p = 0; p < 9; p++)
                  (s.beginPath(),
                    s.arc(
                      f * i + 10 + m * 13.5,
                      d * i + 10 + p * 13.5,
                      3.4,
                      0,
                      7,
                    ),
                    s.fill());
            }
            ((s.fillStyle = "rgba(255,255,255,.06)"),
              s.fillRect(f * i + 3, d * i + 3, i - 6, 3));
          }
        ((s.strokeStyle = "rgba(8,10,14,.9)"), (s.lineWidth = 4));
        for (let f = 0; f <= 4; f++)
          (s.beginPath(),
            s.moveTo(f * i, 0),
            s.lineTo(f * i, a),
            s.stroke(),
            s.beginPath(),
            s.moveTo(0, f * i),
            s.lineTo(r, f * i),
            s.stroke());
      }),
    )));
  const n = Qn("#56606e", {
    k: 0.2,
    roughness: 0.42,
    metalness: 0.15,
    blur: 2.2,
    env: 0.4,
  });
  ((n.map = ft.tile),
    e(Be.x0, -23.3, Xt.z0, Be.z1, n, 2.4),
    e(Be.x0, -23.3, Be.z0, Xt.z0, se("#3a3f46", { roughness: 0.8 }), 3));
}
const _a = Pt(),
  T0 = Pt(),
  hi = Pt(),
  di = Ke("#cfe6ff", 2.2);
{
  const e = _a,
    { x0: t, x1: n, z0: s, z1: r, h: a, t: o, rz: i } = Be,
    c = a + 0.8,
    f = v.clad,
    d = v.wallIn,
    h = v.cut,
    m = (S, C, R, z, I, G) => {
      const V = R - C,
        B = (C + R) / 2,
        O = I - z,
        j = (z + I) / 2;
      e.box(f, S + (G * (o - 0.04)) / 2, j, B, 0.04, O, V).box(
        d,
        S - G * 0.02,
        j,
        B,
        o - 0.04,
        O,
        V,
      );
    },
    p = (S, C, R, z, I, G) => {
      const V = R - C,
        B = (C + R) / 2,
        O = I - z,
        j = (z + I) / 2;
      e.box(f, B, j, S + (G * (o - 0.04)) / 2, V, O, 0.04).box(
        d,
        B,
        j,
        S - G * 0.02,
        V,
        O,
        o - 0.04,
      );
    },
    x = t + o / 2,
    w = n - o / 2,
    g = s + o / 2;
  (m(x, s, 1.5, 0, c, -1),
    m(x, 5.5, r, 0, c, -1),
    m(x, 1.5, 5.5, 3.6, c, -1),
    m(w, s, r, 0, c, 1),
    p(g, t, n, 0, c, -1));
  for (const S of [x, w]) e.box(h, S, c / 2, r + 0.006, o + 0.01, c, 0.012);
  for (const [S, C] of [
    [x, -1],
    [w, 1],
  ])
    e.box(v.trim, S + C * 0.02, c + 0.04, 0, o + 0.12, 0.08, r - s + 0.08).box(
      h,
      S,
      c + 0.04,
      r + 0.047,
      o + 0.13,
      0.09,
      0.012,
    );
  e.box(v.trim, 0, c + 0.04, g - 0.02, n - t + 0.12, 0.08, o + 0.12);
  for (const [S, C] of [
    [t, -1],
    [n, 1],
  ])
    e.box(di, S + C * 0.03, c - 0.12, 0, 0.02, 0.03, r - s - 0.1);
  e.box(di, 0, c - 0.12, s - 0.03, n - t - 0.1, 0.03, 0.02);
  const u = (S, C, R, z, I, G) =>
    e.box(
      v.louv,
      S + G * (o / 2 + 0.03),
      (z + I) / 2,
      (C + R) / 2,
      0.05,
      I - z,
      R - C,
    );
  (u(t, -17.5, -3, 6.6, 8.8, -1),
    u(t, 8, 17.5, 6.6, 8.8, -1),
    u(n, -17.5, 17.5, 6.6, 8.8, 1),
    e.box(v.louv, -14, 7.7, s - o / 2 - 0.03, 40, 2.2, 0.05));
  for (const [S, C] of [
    [t, -1],
    [n, 1],
  ])
    e.box(v.char, S + C * (o / 2 + 0.015), 0.3, 0, 0.03, 0.6, r - s);
  e.box(v.char, 0, 0.3, s - o / 2 - 0.015, n - t, 0.6, 0.03);
  {
    const S = t - 0.02;
    e.box(v.dark, S + 0.3, 3.35, 3.5, 0.6, 0.5, 4.2).box(
      v.dark,
      S + 0.3,
      0.02,
      3.5,
      0.6,
      0.04,
      4.2,
    );
    for (const C of [1.55, 2.55, 3.5, 4.45, 5.45])
      e.box(v.char, S + 0.45, 1.6, C, 0.08, 3.2, 0.07);
    (e.box(v.char, S + 0.45, 2.45, 3.5, 0.08, 0.06, 3.9),
      e
        .box(v.dark, t - 1.35, 3.95, 3.5, 2.7, 0.18, 6.4)
        .box(v.trim, t - 1.35, 4.06, 3.5, 2.72, 0.04, 6.42)
        .box(v.char, t - 2.66, 3.95, 3.5, 0.08, 0.2, 6.4));
    for (const C of [1, 2.5, 4.5, 6])
      e.box(v.ledWarm, t - 1.8, 3.855, C, 0.14, 0.012, 0.14);
  }
  const y = a,
    b = i - s;
  (e
    .box(v.deck, 0, y - 0.3, (s + i) / 2, n - t - 2 * o, 0.6, b)
    .box(v.roof, 0, y + 0.02, (s + i) / 2 + o / 2, n - t - 2 * o, 0.04, b - o),
    e.box(h, 0, y - 0.3, i + 0.006, n - t - 2 * o, 0.62, 0.012));
  for (let S = -30; S <= 30; S += 6) {
    const C = (s + o + i) / 2,
      R = i - s - o - 0.05;
    e.box(v.steel, S, y - 0.72, C, 0.18, 0.22, R).box(
      v.steel,
      S,
      y - 1.98,
      C,
      0.18,
      0.18,
      R,
    );
    for (let z = s + o + 0.1; z < i - 0.2; z += 2.2) {
      e.box(v.steel, S, y - 1.35, z, 0.1, 1.2, 0.1);
      const I = Math.min(z + 1.1, i - 0.1);
      e.box(
        v.steel,
        S,
        y - 1.35,
        (z + I) / 2,
        0.08,
        0.08,
        Math.hypot(1.26, I - z),
        { rx: Math.atan2(1.26, I - z) },
      );
    }
    e.box(h, S, y - 0.72, i - 0.044, 0.19, 0.23, 0.012).box(
      h,
      S,
      y - 1.98,
      i - 0.044,
      0.19,
      0.19,
      0.012,
    );
  }
  const M = 0.22,
    T = 4.6;
  (e
    .box(d, (xe.x0 + xe.x1) / 2, T / 2, xe.z0, xe.x1 - xe.x0, T, M)
    .box(
      h,
      (xe.x0 + xe.x1) / 2,
      T + 0.006,
      xe.z0,
      xe.x1 - xe.x0,
      0.012,
      M + 0.01,
    ),
    e.box(
      d,
      (xe.x0 + xe.x1) / 2,
      (y - 0.6) / 2,
      Xt.z0,
      xe.x1 - xe.x0,
      y - 0.6,
      M,
    ),
    e
      .box(d, xe.x1, T / 2, (Xt.z0 + Xt.z1) / 2, M, T, Xt.z1 - Xt.z0)
      .box(
        h,
        xe.x1,
        T + 0.006,
        (Xt.z0 + Xt.z1) / 2,
        M + 0.01,
        0.012,
        Xt.z1 - Xt.z0,
      ),
    e.box(
      d,
      xe.x1,
      (y - 0.6) / 2,
      (s + o + Xt.z0) / 2,
      M,
      y - 0.6,
      Xt.z0 - s - o,
    ));
  {
    const S = xe.x1,
      C = xe.z0,
      R = 15.5;
    e.box(v.cont, S, T - 0.05, (C + R) / 2, 0.12, 0.1, R - C)
      .box(v.cont, S, 0.05, (C + R) / 2, 0.12, 0.1, R - C)
      .box(v.cont, S, 2.7, (C + R) / 2, 0.1, 0.06, R - C);
    for (let I = C + 0.1; I <= R + 0.01; I += 1.5)
      e.box(v.cont, S, T / 2, Math.min(I, R - 0.05), 0.1, T, 0.08);
    e.box(h, S, T + 0.006, (C + R) / 2, 0.13, 0.012, R - C);
    const z = new l.Mesh(new l.PlaneGeometry(R - C, T - 0.1), v.glassDk);
    ((z.rotation.y = Math.PI / 2),
      z.position.set(S, T / 2, (C + R) / 2),
      pe.add(z),
      ze.push(z));
  }
}
const C0 = (() => {
    const t = document.createElement("canvas"),
      n = document.createElement("canvas");
    ((t.width = t.height = 2048), (n.width = n.height = 2048 / 2));
    const s = t.getContext("2d"),
      r = n.getContext("2d"),
      a = ye(21),
      o = (Jt * 2048) / No;
    ((r.fillStyle = "#000"), r.fillRect(0, 0, 2048 / 2, 2048 / 2));
    const i = (y, b, M, T, S, C = 0) => {
        ((s.fillStyle = "#0d1c24"),
          s.fillRect(y, b, M, T),
          (r.fillStyle = `rgb(${S ? Math.round(50 + a() * 205) : 0},${S ? 0 : 255},${C === 1 ? 128 : C === 2 ? 255 : 0})`),
          r.fillRect(y / 2, b / 2, Math.max(1.5, M / 2), Math.max(1.5, T / 2)));
      },
      c = (y, b, M, T, S = 200, C = 0) => {
        ((s.fillStyle = "#0f1d24"),
          s.fillRect(y, b, M, T),
          (r.fillStyle = `rgb(0,${S},${C === 1 ? 128 : C === 2 ? 255 : 0})`),
          r.fillRect(y / 2, b / 2, M / 2, Math.max(1, T / 2)));
      },
      f = (y, b, M, T, S, C = 3, R = 30) => {
        ((s.strokeStyle = S),
          (s.lineWidth = C),
          s.beginPath(),
          s.moveTo(y, b),
          s.bezierCurveTo(y, b + R, M, T - R * 0.4, M, T),
          s.stroke());
      },
      d = (y, b, M = 104, T = 1956) => {
        ((s.fillStyle = "#050608"),
          s.fillRect(y, 0, 512, 2048),
          (s.fillStyle = "#171a1f"),
          s.fillRect(y + 8, 8, 496, 2032),
          (s.fillStyle = "#0b0d10"),
          s.fillRect(y + 18, M, 476, T - M),
          (s.fillStyle = "#1d2127"),
          s.fillRect(y + 18, 18, 476, M - 24),
          (s.fillStyle = "#d6dade"),
          s.fillRect(y + 214, 30, 84, 22),
          (s.fillStyle = "#1d2230"),
          (s.font = "700 16px DM Mono, monospace"),
          (s.textAlign = "center"),
          s.fillText(b, y + 256, 47),
          (s.textAlign = "left"),
          c(y + 44, M - 20, 424, 9, 200));
        for (const S of [y + 20, y + 474]) {
          ((s.fillStyle = "#252a31"),
            s.fillRect(S, M, 18, T - M),
            (s.fillStyle = "#0a0b0d"));
          for (let C = M + 4; C < T - 4; C += o / 3) s.fillRect(S + 6, C, 6, 5);
        }
        ((s.fillStyle = "#0f1114"),
          s.fillRect(y + 8, T + 4, 496, 2048 - T - 12));
        for (let S = y + 30; S < y + 490; S += 16)
          ((s.fillStyle = "#06070a"), s.fillRect(S, T + 16, 8, 52));
        ((s.fillStyle = "#4a5058"), s.fillRect(y + 497, M + 700, 6, 220));
      },
      h = (y, b, M = 1) => {
        ((s.fillStyle = "#121418"),
          s.fillRect(y + 40, b + 1, 432, M * o - 2),
          (s.fillStyle = "#1b1f24"));
        for (let T = 0; T < M; T++)
          s.fillRect(y + 44, b + T * o + o * 0.45, 424, 2);
      },
      m = (y, b, M, T) => {
        for (const S of [y, y + M - 18])
          ((s.fillStyle = "#7d838b"),
            s.fillRect(S, b + 2, 18, T - 4),
            (s.fillStyle = "#aab0b8"),
            s.fillRect(S + 5, b + T * 0.3, 8, T * 0.4),
            (s.fillStyle = "#2a2e34"),
            s.beginPath(),
            s.arc(S + 9, b + 12, 3, 0, 7),
            s.arc(S + 9, b + T - 12, 3, 0, 7),
            s.fill());
      },
      p = (y, b) => {
        const M = 8 * o,
          T = y + 40,
          S = 432;
        ((s.fillStyle = "#15181d"),
          s.fillRect(T, b + 1, S, M - 2),
          m(T, b, S, M));
        const C = (S - 60) / 8;
        for (let I = 0; I < 8; I++) {
          const G = T + 30 + I * C;
          ((s.fillStyle = "#1f242b"),
            s.fillRect(G + 2, b + 8, C - 4, 2 * o - 14),
            (s.fillStyle = "#2e343d"),
            s.fillRect(G + 2, b + 8, C - 4, 4),
            (s.fillStyle = "#0b0d10"));
          for (let V = 0; V < 4; V++)
            s.fillRect(G + 9 + V * ((C - 18) / 4), b + 20, 3, 2 * o - 44);
          (i(G + 7, b + 2 * o - 18, 6, 4, 1, 0),
            i(G + 17, b + 2 * o - 18, 6, 4, 0, 1));
        }
        ((s.fillStyle = "#101317"),
          s.fillRect(T + 26, b + 2 * o, S - 52, o * 0.72),
          i(T + 36, b + 2 * o + 9, 9, 6, 0, 1),
          i(T + 52, b + 2 * o + 9, 9, 6, 0, 0),
          i(T + 68, b + 2 * o + 9, 9, 6, 1, 2),
          (s.fillStyle = "#2a2f36"),
          s.fillRect(T + 90, b + 2 * o + 8, 20, 12),
          s.fillRect(T + 116, b + 2 * o + 8, 20, 12),
          (s.fillStyle = "#8a929e"),
          (s.font = "600 12px DM Mono, monospace"),
          s.fillText("HGX H100 \xB7 8 GPU", T + S - 172, b + 2 * o + 20));
        const R = b + 2.85 * o,
          z = M - 2.85 * o - 12;
        ((s.fillStyle = "#1c2026"),
          s.fillRect(T + 26, R, S - 52, z),
          (s.fillStyle = "#08090b"));
        for (let I = R + 4, G = 0; I < R + z - 4; I += 7, G++)
          for (let V = T + 30 + (G % 2) * 4; V < T + S - 30; V += 8)
            s.fillRect(V, I, 5, 4);
        ((s.strokeStyle = "rgba(0,0,0,.6)"), (s.lineWidth = 4));
        for (let I = 0; I < 5; I++)
          for (let G = 0; G < 2; G++)
            (s.beginPath(),
              s.arc(
                T + 26 + ((S - 52) * (I + 0.5)) / 5,
                R + z * (G ? 0.73 : 0.27),
                z * 0.2,
                0,
                7,
              ),
              s.stroke());
        c(T + 44, b + M - 16, S - 88, 9, 190);
      },
      x = (y, b, M = 24, T = 0, S = null) => {
        ((s.fillStyle = "#16191e"),
          s.fillRect(y + 40, b + 1, 432, o - 2),
          m(y + 40, b, 432, o),
          i(y + 64, b + o * 0.35, 7, 5, 0, 1));
        const C = 360 / M;
        for (let R = 0; R < M; R++)
          for (let z = 0; z < 2; z++) {
            const I = y + 86 + R * C,
              G = b + 5 + z * (o / 2 - 2);
            ((s.fillStyle = "#050608"),
              s.fillRect(I, G, C - 4, o / 2 - 9),
              i(I + 1, G + (z ? o / 2 - 9 : -3), 4, 3, a() < 0.8, T));
          }
        if (S)
          for (let R = 0; R < M; R += 2)
            f(
              y + 88 + R * C,
              b + o - 4,
              y + (R < M / 2 ? 46 : 466),
              b + o + 40 + (R % 6) * 6,
              S[(R / 2) % S.length],
              2.6,
              26,
            );
      },
      w = (y, b, M) => {
        ((s.fillStyle = "#1b1e23"),
          s.fillRect(y + 40, b + 1, 432, o - 2),
          m(y + 40, b, 432, o));
        for (let T = 0; T < 24; T++)
          ((s.fillStyle = T % 2 ? "#2d6fa8" : "#d8d2c0"),
            s.fillRect(y + 84 + T * 15.5, b + o * 0.3, 10, o * 0.4));
        for (let T = 0; T < 24; T += 1)
          f(
            y + 89 + T * 15.5,
            b + o * 0.62,
            y + (T < 12 ? 48 : 464),
            b + o + 26 + (T % 5) * 7,
            M[T % M.length],
            2.4,
            20,
          );
      };
    {
      d(0, "A-07");
      let b = 104;
      (w(0, b, ["#56c7d6", "#e8c64a"]),
        (b += o),
        x(0, b, 32, 0),
        (b += o),
        x(0, b, 32, 0),
        (b += o),
        h(0, b),
        (b += o));
      for (let M = 0; M < 4; M++) (p(0, b), (b += 8 * o), h(0, b), (b += o));
      ((s.fillStyle = "#14171b"),
        s.fillRect(40, b + 1, 432, 2 * o - 2),
        m(40, b, 432, 2 * o));
      for (let M = 0; M < 6; M++) {
        ((s.fillStyle = "#1d2127"),
          s.fillRect(64 + M * 64, b + 6, 56, 2 * o - 12),
          (s.fillStyle = "#0a0b0d"));
        for (let T = 0; T < 6; T++)
          s.fillRect(70 + M * 64, b + 12 + T * 11, 44, 5);
        i(104 + M * 64, b + 2 * o - 14, 6, 5, 0, 1);
      }
      for (b += 2 * o; b < 1948 - o;) (h(0, b), (b += o));
    }
    {
      d(512, "N-01");
      let b = 104;
      const M = ["#e8c64a", "#56c7d6", "#e8c64a", "#3d8fd8"];
      (w(512, b, ["#e8c64a"]),
        (b += o),
        w(512, b, ["#56c7d6"]),
        (b += o * 1.9),
        x(512, b, 24, 0, M),
        (b += o),
        x(512, b, 24, 0, M),
        (b += o * 1.9),
        (s.fillStyle = "#101215"),
        s.fillRect(552, b, 432, o - 2));
      for (let S = 0; S < 40; S++)
        ((s.fillStyle = "#1b1d21"),
          s.fillRect(562 + S * 10.5, b + 4, 4, o - 10));
      b += o;
      {
        const S = 12 * o;
        ((s.fillStyle = "#16191e"),
          s.fillRect(552, b, 432, S),
          m(552, b, 432, S));
        for (let C = 0; C < 10; C++) {
          const R = 578 + C * 38.5,
            z = C === 4 || C === 5;
          if (
            ((s.fillStyle = z ? "#23272e" : "#1d2127"),
            s.fillRect(R, b + 8, 34, S - 110),
            z)
          )
            ((s.fillStyle = "#0c1418"),
              s.fillRect(R + 6, b + 30, 22, 40),
              c(R + 8, b + 34, 18, 28, 120, 0),
              i(R + 10, b + 90, 6, 5, 0, 1),
              i(R + 20, b + 90, 6, 5, 1, 0));
          else
            for (let I = 0; I < 10; I++)
              ((s.fillStyle = "#050608"),
                s.fillRect(R + 8, b + 28 + I * 38, 18, 26),
                i(R + 10, b + 22 + I * 38, 5, 4, 1, 0),
                i(R + 20, b + 22 + I * 38, 5, 4, a() < 0.3, 1),
                I % 2 === 0 &&
                  f(
                    R + 17,
                    b + 52 + I * 38,
                    512 + (C < 5 ? 46 : 466),
                    b + S - 60 + I * 3,
                    M[(C + I) % 4],
                    2.4,
                    18,
                  ));
          i(R + 13, b + S - 116, 8, 5, 0, 1);
        }
        ((s.fillStyle = "#1b1f25"),
          s.fillRect(574, b + S - 92, 388, 80),
          (s.fillStyle = "#08090b"));
        for (let C = b + S - 86; C < b + S - 18; C += 6)
          for (let R = 578; R < 958; R += 7) s.fillRect(R, C, 4, 3);
        b += S;
      }
      b += o * 0.2;
      const T = (S, C, R) => {
        ((s.fillStyle = "#1a1d22"),
          s.fillRect(552, b + 1, 432, S * o - 2),
          m(552, b, 432, S * o),
          (s.fillStyle = "#0a1418"),
          s.fillRect(578, b + o * 0.22, 70, S * o - o * 0.44),
          c(582, b + o * 0.3, 62, S * o - o * 0.6, 110, 0),
          (s.fillStyle = "#9aa3ae"),
          (s.font = "600 12px DM Mono, monospace"),
          s.fillText(C, 662, b + o * 0.62));
        for (let z = 0; z < R; z++)
          ((s.fillStyle = "#050608"),
            s.fillRect(774 + z * 23, b + o * 0.25, 18, o * 0.5),
            i(776 + z * 23, b + o * 0.12, 5, 3, 1, z % 3 ? 0 : 1));
        b += S * o;
      };
      for (
        T(2, "GATEWAY", 8),
          b += o * 0.3,
          T(2, "SAFETY", 8),
          b += o * 0.3,
          T(1, "LB-1", 8),
          T(1, "LB-2", 8),
          b += o * 0.4,
          x(512, b, 24, 0, M),
          b += o,
          x(512, b, 24, 1, M),
          b += o * 1.8;
        b < 1948 - o;
      )
        (h(512, b), (b += o));
    }
    {
      d(1024, "F-01");
      let b = 104;
      const M = ["#e8c64a", "#e8c64a", "#56c7d6"];
      for (let T = 0; T < 20 && b < 1928 - o; T++) {
        if (T % 4 === 3) {
          ((s.fillStyle = "#0f1114"), s.fillRect(1064, b, 432, o - 2));
          for (let S = 0; S < 12; S++)
            ((s.fillStyle = "#1c1f24"),
              s.fillRect(1084 + S * 34, b + 4, 20, o - 10));
          b += o;
          continue;
        }
        ((s.fillStyle = "#1c1f24"),
          s.fillRect(1064, b + 1, 432, o * 1.4 - 2),
          m(1064, b, 432, o * 1.4));
        for (let S = 0; S < 24; S++)
          ((s.fillStyle = S % 6 < 3 ? "#3b7fc4" : "#d9d3c3"),
            s.fillRect(1096 + S * 15.2, b + o * 0.3, 11, o * 0.6),
            a() < 0.5 && i(1097 + S * 15.2, b + o * 0.14, 4, 3, 1, 0));
        for (let S = 0; S < 24; S += 1 + (S % 3 === 0))
          f(
            1101 + S * 15.2,
            b + o * 0.9,
            1494,
            b + o * 1.4 + 50 + (S % 7) * 9,
            M[S % 3],
            2.4,
            30,
          );
        b += o * 1.4;
      }
      for (; b < 1948 - o;) (h(1024, b), (b += o));
    }
    {
      ((s.fillStyle = "#111418"), s.fillRect(1536, 0, 512, 1024));
      for (const b of [1706, 1877])
        ((s.fillStyle = "#0a0c0f"), s.fillRect(b, 8, 4, 1008));
      ((s.fillStyle = "#1c2026"),
        s.fillRect(1536, 0, 512, 10),
        s.fillRect(1536, 1014, 512, 10),
        (s.fillStyle = "#0b0d10"));
      for (let b = 0; b < 10; b++)
        for (let M = 0; M < 3; M++)
          s.fillRect(1576 + M * 170, 40 + b * 9, 90, 4);
      ((s.fillStyle = "#0e1014"),
        s.fillRect(1536, 1024, 512, 1024),
        (s.fillStyle = "#1d2127"),
        s.fillRect(1536, 1024, 512, 14),
        s.fillRect(1536, 2034, 512, 14),
        s.fillRect(1536, 1024, 14, 1024),
        s.fillRect(2034, 1024, 14, 1024));
      for (const b of [1300, 1760]) {
        ((s.fillStyle = "#050607"),
          s.fillRect(1646, b - 60, 292, 120),
          (s.strokeStyle = "#1c1f24"),
          (s.lineWidth = 2));
        for (let M = 0; M < 60; M++)
          (s.beginPath(),
            s.moveTo(1650 + M * 4.8, b - 56),
            s.lineTo(1652 + M * 4.8, b + 56),
            s.stroke());
      }
      s.fillStyle = "#07080a";
      for (let b = 0; b < 14; b++)
        for (let M = 0; M < 4; M++)
          s.fillRect(1596 + M * 104, 1080 + b * 9, 70, 4);
    }
    const g = new l.CanvasTexture(t);
    ((g.colorSpace = l.SRGBColorSpace), (g.anisotropy = 8));
    const u = new l.CanvasTexture(n);
    return ((u.anisotropy = 4), { map: g, mask: u, U: o, S: 2048 });
  })(),
  ui = {
    tMask: { value: C0.mask },
    uRack: { value: new l.Vector4(0, 0.7, 0, 3) },
    uLedK: { value: 1 },
  },
  pi = pt(
    new l.MeshStandardMaterial({
      map: C0.map,
      roughness: 0.5,
      metalness: 0.3,
      envMapIntensity: 0.55,
    }),
    Object.assign(
      (e) => {
        (Object.assign(e.uniforms, ui),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
#ifdef USE_INSTANCING
attribute vec4 aRack;
#endif
attribute float aFront;uniform vec4 uRack;varying vec4 vRack;`,
            )
            .replace(
              "#include <uv_vertex>",
              `#include <uv_vertex>
#ifdef USE_INSTANCING
vRack=aRack;
#else
vRack=uRack;
#endif
vMapUv.x+=aFront*vRack.x*.25;`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
uniform sampler2D tMask;uniform float uLedK;varying vec4 vRack;`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
{vec4 mk=texture2D(tMask,vMapUv);float ph=mk.r,isB=smoothstep(.08,.2,mk.r);
 float bl=isB*step(.42,fract(uT*(1.1+vRack.y*5.)*(.55+ph)+ph*11.+vRack.w));
 vec3 lc=mk.b<.25?vec3(.62,.95,1.55):mk.b<.7?vec3(.38,1.45,.68):vec3(1.6,.86,.28);
 totalEmissiveRadiance+=lc*(bl*2.2+mk.g*1.9)*uLedK*(1.+vRack.z*1.5);}`,
            )));
      },
      { key: "dcrack" },
    ),
  );
function Gc(e = Mn, t = No, n = Ls) {
  const s = new l.BoxGeometry(e, t, n);
  s.translate(0, t / 2, 0);
  const r = s.attributes.uv,
    a = new Float32Array(r.count),
    o = new Uint8Array(r.count),
    i = {
      0: [0.75, 0.5, 0.25, 0.5],
      1: [0.75, 0.5, 0.25, 0.5],
      2: [0.75, 0, 0.25, 0.5],
      3: [0.75, 0, 0.25, 0.5],
      4: [0, 0, 0.25, 1],
      5: [0.75, 0.5, 0.25, 0.5],
    };
  for (const c of s.groups) {
    const [f, d, h, m] = i[c.materialIndex];
    for (let p = c.start; p < c.start + c.count; p++) {
      const x = s.index.array[p];
      o[x] ||
        ((o[x] = 1),
        r.setXY(x, f + r.getX(x) * h, d + r.getY(x) * m),
        (a[x] = c.materialIndex === 4 ? 1 : 0));
    }
  }
  return (
    s.setAttribute("aFront", new l.BufferAttribute(a, 1)),
    s.clearGroups(),
    s
  );
}
const Xe = { p: 1, x: Ct(1), z: ci(0) },
  Dn = [];
for (let e = 0; e < 10; e++)
  for (const [t, n, s] of [
    [0, Ct(e), -Math.PI / 2],
    [1, Ct(e) + 2.4, Math.PI / 2],
  ])
    for (let r = 0; r < La + Fc; r++) {
      const a = r < La ? ci(r) : Dc(r - La);
      (e === Xe.p && t === 0 && r === 0) ||
        Dn.push({
          x: n,
          z: a,
          ry: s,
          kind: 0,
          busy: 0.35 + Ie(e * 97 + r * 3.1 + t) * 0.65,
          seed: Ie(e * 13 + r * 7.7 + t * 3) * 20,
        });
    }
const He = { z: 9.6, xs: [-31.1, -30.5, -29.9, -29.3, -28.7, -28.1, -27.5] };
((He.first = Dn.length),
  He.xs.forEach((e, t) =>
    Dn.push({
      x: e,
      z: He.z,
      ry: 0,
      kind: t < 2 ? 2 : 1,
      busy: 0.8 + Ie(t) * 0.2,
      seed: Ie(t + 40) * 20,
    }),
  ),
  (He.side = [11.2, 11.8, 12.4, 13]),
  He.side.forEach((e, t) =>
    Dn.push({
      x: xe.x0 + 0.3 + 0.6,
      z: e,
      ry: Math.PI / 2,
      kind: t % 2 ? 1 : 2,
      busy: 0.6,
      seed: Ie(t + 60) * 20,
    }),
  ));
const R0 = new l.InstancedBufferAttribute(new Float32Array(Dn.length * 4), 4);
R0.setUsage(l.DynamicDrawUsage);
{
  const e = Gc();
  e.setAttribute("aRack", R0);
  const t = new l.InstancedMesh(e, pi, Dn.length);
  (Dn.forEach((n, s) => {
    ($e.setFromAxisAngle(Zt, n.ry),
      ae.compose(re(n.x, 0, n.z), $e, Nt.set(1, 1, 1)),
      t.setMatrixAt(s, ae),
      R0.setXYZW(s, n.kind, n.busy, 0, n.seed));
  }),
    (t.castShadow = t.receiveShadow = !0),
    t.computeBoundingSphere(),
    pe.add(t),
    (pe.userData.racks = t));
}
const ro = [15.8, 11, 6.2, 1.8, -1.8, -6.6, -11.4, -15.2],
  Vc = Ke("#dcebff", 0.92),
  z0 = No + 2.2,
  $c = Xo({
    color: "#6b6660",
    emissive: new l.Color("#ffcf9a"),
    emissiveIntensity: 0.62,
    roughness: 0.6,
  }),
  Wc = Ke("#e8f3ff", 1.6),
  Oc = Ke("#bfe4ff", 1.5);
{
  const e = T0,
    t = No,
    n = [
      [1.6, 16],
      [-15.4, -1.6],
    ],
    s = xe.x1 + 0.3,
    r = Be.x1 - Be.t - 0.3;
  for (let o = 0; o < 10; o++) {
    const i = Ct(o),
      c = i + 2.4,
      f = i + 1.2;
    for (const [d, h] of n) {
      const m = h - d,
        p = (d + h) / 2;
      e.box($c, f, t + 0.03, p, 1.16, 0.03, m)
        .box(v.cont, i + 0.61, t + 0.06, p, 0.05, 0.08, m)
        .box(v.cont, c - 0.61, t + 0.06, p, 0.05, 0.08, m);
      for (let x = d + 1.2; x < h - 0.1; x += 1.2)
        e.box(v.cont, f, t + 0.055, x, 1.18, 0.03, 0.04);
      h > 0 &&
        e
          .box(v.char, f, t + 0.2, h + 0.03, 0.7, 0.22, 0.04)
          .box(Wc, f, t + 0.2, h + 0.052, 0.62, 0.15, 0.006);
      for (const x of [d, h]) {
        const w = x === h ? 1 : -1;
        (e
          .box(v.cont, f, t - 0.02, x + w * 0.02, 1.2, 0.08, 0.05)
          .box(v.cont, i + 0.62, t / 2, x + w * 0.02, 0.05, t, 0.05)
          .box(v.cont, c - 0.62, t / 2, x + w * 0.02, 0.05, t, 0.05)
          .box(v.cont, f, t / 2, x + w * 0.02, 0.04, t - 0.04, 0.05),
          e
            .box(v.dark, f, 0.12, x + w * 0.02, 1.1, 0.2, 0.03)
            .box(v.trim, f + 0.3, 1.05, x + w * 0.05, 0.02, 0.3, 0.03)
            .box(v.trim, f - 0.3, 1.05, x + w * 0.05, 0.02, 0.3, 0.03));
      }
      if (h > 0)
        for (const [x, w] of [
          [i - 0.6, 1],
          [c + 0.6, -1],
        ])
          (o === Xe.p && w > 0) ||
            e.box(
              Oc,
              x + w * 0.02,
              t / 2 + 0.02,
              h + 0.006,
              0.014,
              t - 0.14,
              0.01,
            );
      for (const [x, w] of [
        [i + 0.3, i],
        [c - 0.3, c],
      ]) {
        e.box(v.bus, x, t + 0.42, p, 0.12, 0.16, m + 0.3);
        for (let g = d + 0.3; g < h; g += 0.6)
          e.box(v.busD, x, t + 0.26, g, 0.1, 0.16, 0.16).box(
            v.cabK,
            x,
            t + 0.09,
            g,
            0.03,
            0.18,
            0.03,
          );
      }
      for (const x of [i - 0.45, c + 0.45]) {
        e.box(v.race, x, t + 0.3, p, 0.2, 0.012, m)
          .box(v.race, x - 0.1, t + 0.35, p, 0.012, 0.1, m)
          .box(v.race, x + 0.1, t + 0.35, p, 0.012, 0.1, m);
        for (let w = 0; w < 3; w++)
          e.box(
            v.cabY,
            x + (w - 1) * 0.05,
            t + 0.33 + (w % 2) * 0.02,
            p,
            0.035,
            0.035,
            m,
          );
        for (let w = d + 0.3; w < h; w += 1.2)
          e.box(v.steel, x, t + 0.15, w, 0.03, 0.3, 0.03);
      }
    }
    for (const [d, h] of [
      [f - 0.16, v.pipeB],
      [f + 0.16, v.pipeR],
    ]) {
      e.cyl(h, d, t + 0.62, (15.8 - 17.3) / 2, 0.075, 0.075, 15.8 + 17.3, {
        rx: Math.PI / 2,
        seg: 14,
      }).cyl(v.flange, d, t + 0.62, 15.8, 0.09, 0.09, 0.05, {
        rx: Math.PI / 2,
        seg: 14,
      });
      for (const [m, p] of n)
        for (let x = m + 0.6; x < p; x += 1.2)
          e.cyl(h, d, t + 0.33, x, 0.025, 0.025, 0.52, { seg: 8 }).box(
            v.flange,
            d,
            t + 0.46,
            x,
            0.07,
            0.04,
            0.07,
          );
      for (let m = -16.5; m < 16; m += 4.8)
        e.cyl(v.flange, d, t + 0.62, m, 0.1, 0.1, 0.05, {
          rx: Math.PI / 2,
          seg: 14,
        });
    }
  }
  for (const o of ro) {
    e.box(v.steel, (s + r) / 2, t + 1.25, o, r - s, 0.1, 0.08);
    for (let i = 0; i < 10; i++)
      for (const c of [Ct(i) + 0.62, Ct(i) + 1.78])
        e.box(v.steel, c, t + 0.66, o, 0.06, 1.2, 0.06);
  }
  const a = [(s - 0.3 + Ct(0) - 0.6) / 2];
  for (let o = 0; o < 9; o++) a.push(Ct(o) + 3.9);
  a.push((Ct(9) + 3 + r) / 2);
  for (const o of a) {
    for (const h of [-1, 1])
      e.box(v.ladder, o + h * 0.25, t + 1.36, 0, 0.03, 0.08, 32.4);
    for (let h = -16.2; h < 16.2; h += 0.3)
      e.box(v.ladder, o, t + 1.33, h, 0.5, 0.02, 0.03);
    [v.cabG, v.cabB, v.cabK, v.cabG].forEach((h, m) =>
      e.box(
        h,
        o + (m - 1.5) * 0.1,
        t + 1.37 + (m % 2) * 0.03,
        0,
        0.06,
        0.05,
        32.4,
      ),
    );
    for (const h of [-0.5, 0.5])
      e.box(v.char, o + h, t + 1.08, 0, 0.07, 0.03, 32.4 - 0.8).box(
        Vc,
        o + h,
        t + 1.058,
        0,
        0.05,
        0.014,
        32.4 - 0.9,
      );
  }
  {
    const o = (s + r) / 2 - 0.3,
      i = r - s + 0.6,
      c = ro[0],
      f = z0;
    e.box(v.race, o, f - 0.03, c, i, 0.012, 0.3)
      .box(v.race, o, f + 0.03, c + 0.15, i, 0.12, 0.012)
      .box(v.race, o, f + 0.03, c - 0.15, i, 0.12, 0.012);
    for (let d = 0; d < 4; d++)
      e.box(
        v.cabY,
        o,
        f + (d % 2) * 0.025,
        c + (d - 1.5) * 0.06,
        i,
        0.035,
        0.035,
      );
    for (let d = s; d <= r; d += 2.7)
      e.box(
        v.steel,
        d,
        (t + 1.3 + f - 0.04) / 2,
        c,
        0.04,
        f - 0.04 - t - 1.3,
        0.04,
      );
    for (let d = 0; d < 10; d++)
      for (const h of [Ct(d) - 0.45, Ct(d) + 2.85])
        e.tube(
          v.race,
          [
            re(h, f - 0.01, c),
            re(h, f - 0.25, c - 0.2),
            re(h, t + 1.1, c - 0.34),
            re(h, t + 0.5, c - 0.45),
          ],
          0.06,
          { n: 14, seg: 8 },
        );
  }
  for (const [o, i] of [
    [3.3, v.pipeB],
    [3.72, v.pipeR],
  ])
    e.cyl(i, (s + r) / 2, o, -17.3, 0.16, 0.16, r - s, {
      rz: Math.PI / 2,
      seg: 18,
    });
  for (let o = 0; o < 10; o++) {
    const i = Ct(o) + 1.2;
    for (const [c, f, d] of [
      [-0.16, 3.3, v.pipeB],
      [0.16, 3.72, v.pipeR],
    ])
      e.cyl(d, i + c, (t + 0.62 + f) / 2, -17.3, 0.075, 0.075, f - t - 0.62, {
        seg: 12,
      });
    e.box(v.white, i, 1.05, -18.95, 1.2, 2.1, 0.9, { r: 0.03 })
      .box(v.grey, i, 2.16, -18.95, 1.1, 0.12, 0.8)
      .box(v.greyD, i, 1.05, -18.49, 1.05, 1.8, 0.02);
    for (const [c, f] of [
      [-0.25, v.pipeB],
      [0.25, v.pipeR],
    ])
      e.cyl(f, i + c, 2.7, -18.95, 0.06, 0.06, 1.2, { seg: 10 });
  }
  for (let o = -14; o <= 14; o += 2.4)
    e.box(v.white, Be.x1 - Be.t - 0.35, 1.05, o, 0.6, 2.1, 1.2, {
      r: 0.02,
    }).box(v.greyD, Be.x1 - Be.t - 0.66, 1.1, o, 0.02, 1.6, 1);
}
{
  const e = [];
  for (let n = 0; n < 10; n++)
    for (const s of [16, 1.6, -1.6, -15.4])
      for (const r of [-1, 1]) {
        const a = new l.PlaneGeometry(0.52, 1.92);
        (a.translate(
          Ct(n) + 1.2 + r * 0.29,
          1.18,
          s + (s === 16 || s === -1.6 ? 0.02 : -0.02),
        ),
          e.push(a));
      }
  const t = new l.Mesh(
    h0(e),
    new l.MeshStandardMaterial({
      color: "#1b2633",
      roughness: 0.08,
      metalness: 0.3,
      transparent: !0,
      opacity: 0.55,
      envMapIntensity: 1.1,
      depthWrite: !1,
      side: l.DoubleSide,
    }),
  );
  ((t.renderOrder = 1), pe.add(t), ze.push(t));
}
const hn = {
  hole: re(-37.8, 0.06, 21.6),
  wall: re(Be.x0 - 0.02, 0.42, 18.9),
  box: re(Be.x0 + Be.t + 0.12, 0.55, 18.9),
  y: 3,
  z: 10.45,
  xr: Be.x0 + Be.t + 0.3,
  zf: 18.9,
  yh: 4.05,
};
{
  const e = T0,
    { x0: t, x1: n } = xe,
    s = hn.y,
    r = hn.z,
    a = (h, m, p = 0.24) => {
      const x = h.distanceTo(m),
        w = h.clone().add(m).multiplyScalar(0.5),
        g = Math.abs(m.x - h.x) > Math.abs(m.z - h.z);
      e.box(v.race, w.x, w.y - 0.05, w.z, g ? x + p : p, 0.012, g ? p : x + p);
      for (const u of [-1, 1])
        e.box(
          v.race,
          w.x + (g ? 0 : (u * p) / 2),
          w.y,
          w.z + (g ? (u * p) / 2 : 0),
          g ? x : 0.012,
          0.1,
          g ? 0.012 : x,
        );
      for (let u = 0; u < 3; u++) {
        const y = (u - 1) * p * 0.24;
        e.box(
          v.cabY,
          w.x + (g ? 0 : y),
          w.y - 0.02 + (u % 2) * 0.02,
          w.z + (g ? y : 0),
          g ? x : 0.035,
          0.035,
          g ? 0.035 : x,
        );
      }
      for (let u = 0; u <= x; u += 1.5) {
        const y = h.clone().lerp(m, x ? u / x : 0);
        e.box(v.steel, y.x, (y.y + 4.3) / 2, y.z, 0.025, 4.3 - y.y, 0.025);
      }
    };
  (a(re(t + 0.3, s, r), re(-24, s, r)),
    a(re(-24, s, r), re(-24, s, ro[0])),
    e.tube(
      v.race,
      [
        re(-24, s, ro[0]),
        re(-23.9, s + 0.3, ro[0]),
        re(-23.7, z0 - 0.2, ro[0]),
        re(-23.3, z0, ro[0]),
      ],
      0.07,
      { n: 14, seg: 8 },
    ));
  for (const h of He.xs)
    (e.tube(
      v.cabY,
      [
        re(h - 0.08, s - 0.05, r),
        re(h - 0.08, s - 0.3, r - 0.05),
        re(h - 0.08, No + 0.12, He.z + 0.45),
        re(h - 0.08, No, He.z + 0.45),
      ],
      0.022,
      { n: 10, seg: 6 },
    ),
      e.tube(
        v.cabA,
        [
          re(h + 0.06, s - 0.05, r),
          re(h + 0.06, s - 0.35, r - 0.08),
          re(h + 0.06, No + 0.1, He.z + 0.38),
          re(h + 0.06, No, He.z + 0.38),
        ],
        0.016,
        { n: 10, seg: 6 },
      ));
  for (const h of [-1, 1])
    e.box(
      v.ladder,
      (He.xs[0] + He.xs[6]) / 2,
      2.72,
      He.z - 0.3 + h * 0.22,
      4.4,
      0.07,
      0.03,
    );
  for (let h = He.xs[0] - 0.3; h < He.xs[6] + 0.4; h += 0.3)
    e.box(v.ladder, h, 2.69, He.z - 0.3, 0.03, 0.02, 0.44);
  [v.cabK, v.cabB, v.cabG].forEach((h, m) =>
    e.box(
      h,
      (He.xs[0] + He.xs[6]) / 2,
      2.74,
      He.z - 0.4 + m * 0.1,
      4.3,
      0.05,
      0.06,
    ),
  );
  const o = hn;
  (e
    .box(v.kerb, o.hole.x, 0.03, o.hole.z, 1.1, 0.06, 1.1)
    .box(v.char, o.hole.x, 0.065, o.hole.z, 0.8, 0.02, 0.8)
    .box(v.race, o.hole.x + 0.3, 0.11, o.hole.z, 0.12, 0.06, 0.04),
    e.tube(
      v.race,
      [
        re(o.hole.x + 0.2, 0.08, o.hole.z - 0.1),
        re(o.hole.x + 1, 0.12, o.wall.z + 0.4),
        re(o.wall.x - 0.5, 0.2, o.wall.z),
        re(o.wall.x - 0.05, o.wall.y, o.wall.z),
      ],
      0.05,
      { n: 16, seg: 10 },
    ),
    e
      .box(v.greyD, o.wall.x - 0.06, o.wall.y, o.wall.z, 0.1, 0.24, 0.24)
      .box(v.white, o.box.x, o.box.y, o.box.z, 0.2, 0.6, 0.45)
      .box(v.race, o.box.x + 0.105, o.box.y + 0.18, o.box.z, 0.01, 0.08, 0.3),
    e.box(
      v.race,
      o.box.x + 0.02,
      (o.box.y + 0.3 + o.yh) / 2,
      o.box.z,
      0.12,
      o.yh - o.box.y - 0.3,
      0.2,
    ),
    a(re(o.xr, o.yh, o.zf), re(o.xr, o.yh, r + 0.5)),
    e.tube(
      v.race,
      [
        re(o.xr, o.yh - 0.05, r + 0.5),
        re(o.xr, o.yh - 0.3, r + 0.3),
        re(o.xr, s + 0.25, r + 0.08),
        re(o.xr, s, r),
      ],
      0.07,
      { n: 12, seg: 8 },
    ));
  for (const h of [12.2, 16.4])
    e.box(v.steel, (t + n) / 2, 4.35, h, n - t, 0.12, 0.1)
      .box(v.char, (t + n) / 2, 4.26, h, n - t - 0.6, 0.05, 0.1)
      .box(v.ledW, (t + n) / 2, 4.23, h, n - t - 0.8, 0.012, 0.05);
  const i = He.xs[3],
    c = 14.4,
    f = 3.6,
    d = 2.8;
  e.box(v.char, i, 0.004, c, f, 0.008, d);
  for (const [h, m, p, x] of [
    [0, -d / 2, f, 0.03],
    [0, d / 2, f, 0.03],
    [-f / 2, 0, 0.03, d],
    [f / 2, 0, 0.03, d],
  ])
    e.box(
      Ke("#8fe4ff", 0.32),
      i + h,
      0.009,
      c + m,
      Math.min(p, f) * (p > 0.1 ? 1 : 0.6),
      0.004,
      Math.min(x, d) * (x > 0.1 ? 1 : 0.6),
    );
  ((He.check = [i, 0, c]),
    e
      .box(v.louv, (t + n) / 2, 3.3, xe.z0 + 0.12, n - t - 0.6, 0.7, 0.02)
      .box(v.char, (t + n) / 2, 4.48, xe.z0 + 0.2, n - t - 0.2, 0.06, 0.18)
      .box(v.ledWarm, (t + n) / 2, 4.44, xe.z0 + 0.28, n - t - 0.4, 0.02, 0.02),
    e
      .box(
        v.char,
        t + 0.2,
        4.48,
        (xe.z0 + xe.z1) / 2,
        0.18,
        0.06,
        xe.z1 - xe.z0 - 0.4,
      )
      .box(
        v.ledWarm,
        t + 0.28,
        4.44,
        (xe.z0 + xe.z1) / 2,
        0.02,
        0.02,
        xe.z1 - xe.z0 - 0.6,
      ),
    e.cyl(
      se("#b8322a", { roughness: 0.45 }),
      n - 0.6,
      0.35,
      xe.z0 + 0.4,
      0.09,
      0.09,
      0.6,
      { seg: 12 },
    ));
}
{
  const e = ln(
    3.2,
    0.34,
    1024,
    108,
    (s, r, a) => {
      ((s.font = "600 62px Outfit, sans-serif"),
        (s.letterSpacing = "14px"),
        (s.fillStyle = "#d9dee6"),
        (s.textAlign = "center"),
        (s.textBaseline = "middle"),
        s.fillText("EDGE \xB7 NETWORK ROOM", r / 2, a / 2 + 2));
    },
    0.62,
    { side: l.FrontSide },
  );
  (e.position.set(He.xs[3], 4.02, xe.z0 + 0.125), pe.add(e));
  const t = ln(
    1.6,
    0.9,
    640,
    360,
    (s, r, a) => {
      ((s.fillStyle = "#0a0f18"),
        s.fillRect(0, 0, r, a),
        (s.fillStyle = "#7f8aa3"),
        (s.font = "500 22px DM Mono, monospace"),
        s.fillText("EDGE \xB7 requests / s", 24, 40),
        (s.strokeStyle = "#7fe3ff"),
        (s.lineWidth = 3),
        s.beginPath());
      for (let o = 0; o <= r - 48; o += 6) {
        const i =
          200 -
          60 * Math.sin(o * 0.03) -
          30 * Math.sin(o * 0.11 + 1) -
          Ie(o) * 18;
        o ? s.lineTo(24 + o, i) : s.moveTo(24 + o, i);
      }
      (s.stroke(), (s.strokeStyle = "#ffb454"), s.beginPath());
      for (let o = 0; o <= r - 48; o += 6) {
        const i = 300 - 24 * Math.sin(o * 0.05 + 2) - Ie(o + 3) * 10;
        o ? s.lineTo(24 + o, i) : s.moveTo(24 + o, i);
      }
      (s.stroke(),
        (s.fillStyle = "#e9eef6"),
        (s.font = "600 44px Outfit, sans-serif"),
        s.fillText("48.2k", r - 190, 58));
    },
    1.25,
    { side: l.FrontSide },
  );
  (t.position.set(xe.x0 + 0.04, 2.1, 15.1),
    (t.rotation.y = Math.PI / 2),
    pe.add(t),
    ze.push(t));
  const n = Pt();
  (n.box(v.char, xe.x0 + 0.02, 2.1, 15.1, 0.03, 0.96, 1.66), n.flush(pe));
}
{
  const e = T0,
    t = (Xt.z0 + Xt.z1) / 2;
  e.box(v.dark, -30.2, 0.55, 3.4, 0.7, 1.1, 3.2)
    .box(v.oak, -30.2, 1.12, 3.4, 0.8, 0.05, 3.3)
    .box(v.ledWarm, -29.84, 0.08, 3.4, 0.02, 0.02, 3.1);
  for (let s = 0; s < 4; s++) {
    const r = 1.2 + s * 1.3;
    e.box(v.steelL, -27.4, 0.5, r, 0.9, 1, 0.18, { r: 0.03 }).box(
      v.ledCyan,
      -27.4,
      1.01,
      r,
      0.7,
      0.012,
      0.04,
    );
  }
  for (const s of [0, 1, 2])
    e.box(v.steelL, -27.4, 0.9, 1.85 + s * 1.3, 0.02, 0.8, 0.5);
  for (const [s, r] of [
    [-33.8, -1.2],
    [-24.2, -1.2],
    [-24.2, 7.8],
  ])
    (e.cyl(v.terra, s, 0.35, r, 0.34, 0.28, 0.7, { seg: 10 }),
      Jn(e, s, 0.6, r, 0.9, Math.round(s * 3 + r), 4));
  e.box(v.oak, -33.9, 0.45, 6.4, 0.45, 0.08, 2.2)
    .box(v.char, -33.9, 0.22, 5.5, 0.4, 0.44, 0.06)
    .box(v.char, -33.9, 0.22, 7.3, 0.4, 0.44, 0.06);
  for (const [s, r] of [
    [-30.2, 2.2],
    [-30.2, 4.6],
    [-26, 1.8],
    [-26, 5.4],
  ])
    e.cyl(v.char, s, 3.9, r, 0.004, 0.004, 1.2, { seg: 4 })
      .cyl(v.dark, s, 3.28, r, 0.16, 0.2, 0.18, { seg: 14 })
      .cyl(v.ledWarm, s, 3.185, r, 0.15, 0.15, 0.012, { seg: 14 });
  e.box(v.char, -34.4, 0.02, 3.5, 0.6, 0.02, 3.6);
  const n = ln(
    2.4,
    1.35,
    768,
    432,
    (s, r, a) => {
      ((s.fillStyle = "#0b111c"),
        s.fillRect(0, 0, r, a),
        (s.fillStyle = "#8f99b6"),
        (s.font = "500 24px DM Mono, monospace"),
        s.fillText("DATA HALL 1", 32, 52),
        (s.fillStyle = "#eef3fa"),
        (s.font = "700 92px Outfit, sans-serif"),
        s.fillText("38.6", 32, 170),
        (s.fillStyle = "#7fe3ff"),
        (s.font = "500 34px DM Mono, monospace"),
        s.fillText("MW  IT load", 250, 168));
      for (let o = 0; o < 24; o++) {
        const i = 0.3 + Ie(o * 1.7) * 0.6;
        ((s.fillStyle = o % 5 === 0 ? "#ffb454" : "#7df0b4"),
          s.fillRect(32 + o * 29, a - 40 - i * 160, 20, i * 160));
      }
    },
    1.2,
    { side: l.FrontSide },
  );
  (n.position.set(xe.x1 - 0.13, 2.4, t + 1.5),
    (n.rotation.y = -Math.PI / 2),
    pe.add(n),
    ze.push(n));
}
const Sn = new l.Group();
(Sn.position.set(Xe.x, 0, Xe.z), (Sn.rotation.y = -Math.PI / 2), pe.add(Sn));
function Uc(e, t, n, s, r, a) {
  const o = new l.PlaneGeometry(e, t),
    i = o.attributes.uv,
    c = C0.S;
  for (let d = 0; d < i.count; d++)
    i.setXY(
      d,
      (n + i.getX(d) * (r - n)) / c,
      1 - (a - i.getY(d) * (a - s)) / c,
    );
  const f = new l.Mesh(o, pi);
  return ((f.receiveShadow = !0), f);
}
const Hc = C0.U,
  eo = (e) => 104 + e * Hc,
  qo = { S1: [1, 8], S2: [9, 8], S3: [18, 8], S4: [27, 8] },
  Po = (e) => 0.1 + e * Jt,
  Nc = fn(
    We(128, 128, (e, t, n) => {
      ((e.fillStyle = "#3a414b"),
        e.fillRect(0, 0, t, n),
        (e.fillStyle = "#06070a"));
      for (let s = 0; s < 8; s++)
        for (let r = 0; r < 8; r++)
          (e.beginPath(),
            e.arc(r * 16 + (s % 2) * 8 + 4, s * 16 + 8, 5, 0, 7),
            e.fill());
    }),
    24,
    70,
  );
{
  const e = Pt(),
    t = Ls / 2,
    n = Mn / 2,
    s = v.char,
    r = se("#15181d", { roughness: 0.55, metalness: 0.3 });
  e.box(s, 0, 0.05, 0, Mn, 0.1, Ls);
  for (const p of [-1, 1])
    for (const x of [-1, 1])
      e.box(s, p * (n - 0.015), 1.15, x * (t - 0.015), 0.03, 2.1, 0.03);
  e.box(s, 0, 2.185, 0, Mn, 0.03, Ls);
  for (const p of [-0.2, 0.35]) e.box(v.char, 0, 2.202, p, 0.34, 0.006, 0.16);
  for (const p of [-1, 1])
    e.box(r, p * (n - 0.003), 1.15, 0, 0.006, 2.08, Ls - 0.06);
  e.box(r, 0, 1.15, -t + 0.003, Mn - 0.06, 2.08, 0.006);
  for (const p of [-1, 1])
    for (const x of [0.5, -0.42])
      e.box(v.steel, p * 0.233, 1.12, x, 0.018, 2, 0.04);
  const a = new Set();
  for (const p in qo) {
    const [x, w] = qo[p];
    for (let g = x; g < x + w; g++) a.add(g);
  }
  [37, 38, 40].forEach((p) => a.add(p));
  for (let p = 0; p < 45; p++)
    a.has(p) ||
      e.box(v.dark, 0, Po(p) + Jt / 2, 0.53, 0.482, Jt - 0.002, 0.012);
  for (const p of ["S1", "S2", "S4"]) {
    const [x, w] = qo[p];
    e.box(
      v.char,
      0,
      Po(x) + (w * Jt) / 2,
      0.53 - 0.45,
      0.447,
      w * Jt - 0.003,
      0.9,
    );
  }
  {
    const [p] = qo.S3;
    (e.box(
      v.char,
      0,
      Po(p + 4) + 2 * Jt,
      0.53 - 0.45,
      0.447,
      4 * Jt - 0.003,
      0.9,
    ),
      e.box(se("#08090b"), 0, Po(p) + 2 * Jt, -0.3, 0.447, 4 * Jt, 0.02));
    for (const x of [-1, 1])
      e.box(v.steelL, x * 0.226, Po(p) + 0.05, 0.13, 0.012, 0.04, 0.8);
  }
  for (const p of [37, 38])
    e.box(v.char, 0, Po(p) + Jt / 2, 0.3, 0.447, Jt - 0.002, 0.46);
  for (let p = 0; p < 8; p++) {
    const x = -0.17 + p * 0.048,
      w = Po(40) + 0.012,
      g = Po(38) + 0.03;
    e.tube(
      p % 3 ? v.cabA : v.cabY,
      [
        re(x, w, 0.56),
        re(x + 0.01, (w + g) / 2 + 0.01, 0.6),
        re(x - 0.02, g, 0.56),
      ],
      0.0035,
      { n: 8, seg: 5 },
    );
  }
  const o = new l.Group();
  (o.position.set(-n + 0.012, 0, t + 0.015), (o.rotation.y = -1.75), Sn.add(o));
  const i = Pt(),
    c = Mn - 0.03;
  (i
    .box(s, c / 2, 0.12, 0, c, 0.05, 0.025)
    .box(s, c / 2, 2.13, 0, c, 0.06, 0.025)
    .box(s, 0.02, 1.12, 0, 0.04, 2.08, 0.025)
    .box(s, c - 0.02, 1.12, 0, 0.04, 2.08, 0.025),
    i
      .box(v.trim, c - 0.035, 1.15, 0.02, 0.02, 0.22, 0.02)
      .box(v.steel, c - 0.035, 1.62, -0.018, 0.012, 0.9, 0.012)
      .box(v.steel, c - 0.035, 0.66, -0.018, 0.012, 0.9, 0.012),
    i
      .box(v.trim, 0.004, 1.12, 0.014, 0.008, 2.08, 0.004)
      .box(v.trim, c - 0.004, 1.12, 0.014, 0.008, 2.08, 0.004),
    i.flush(o));
  const f = Xo({
      map: Nc,
      color: "#d4dbe4",
      roughness: 0.38,
      metalness: 0.55,
      envMapIntensity: 1,
    }),
    d = new l.Mesh(new l.BoxGeometry(c - 0.07, 1.96, 0.006), f);
  (d.position.set(c / 2, 1.13, 0),
    (d.castShadow = d.receiveShadow = !0),
    o.add(d),
    (Sn.userData.door = o));
  const h = Ke("#8fe4ff", 1.15);
  e.box(h, 0, 2.16, t + 0.004, Mn - 0.02, 0.008, 0.006);
  for (const p of [-1, 1])
    e.box(h, p * (n - 0.004), 1.13, t + 0.004, 0.006, 2.04, 0.006);
  e.flush(Sn);
  const m = (p, x, w, g) => {
    const u = Uc(0.482, x * Jt - 0.002, 40, w, 472, g);
    return (u.position.set(0, Po(p) + (x * Jt) / 2, 0.5301), Sn.add(u), u);
  };
  (m(qo.S1[0], 8, eo(4), eo(12)),
    m(qo.S2[0], 8, eo(13), eo(21)),
    m(qo.S4[0], 8, eo(22), eo(30)),
    m(qo.S3[0] + 4, 4, eo(31), eo(35)),
    m(37, 1, eo(1), eo(2)),
    m(38, 1, eo(2), eo(3)),
    m(40, 1, eo(0), eo(1)));
}
const mi = (() => {
    const n = () => {
        const g = document.createElement("canvas");
        return ((g.width = 1600), (g.height = 2080), g);
      },
      s = n(),
      r = n(),
      a = s.getContext("2d"),
      o = r.getContext("2d"),
      i = ye(33);
    ((a.fillStyle = "#07090e"),
      a.fillRect(0, 0, 1600, 2080),
      (o.fillStyle = "#000"),
      o.fillRect(0, 0, 1600, 2080));
    const c = [
      "rgba(90,70,160,",
      "rgba(40,120,140,",
      "rgba(150,110,50,",
      "rgba(60,130,90,",
      "rgba(120,60,110,",
    ];
    for (const g of [18, 2e3]) {
      ((a.fillStyle = "#0d121b"), a.fillRect(90, g, 1420, 62));
      for (let u = 96; u < 1504; u += 9)
        ((a.fillStyle = u % 36 < 9 ? "#1d2a3c" : "#141c28"),
          a.fillRect(u, g + 6, 5, 50));
      ((o.fillStyle = "rgba(60,150,220,.35)"),
        o.fillRect(90, g + 24, 1420, 12));
    }
    for (const g of [16, 1522])
      for (let u = 0; u < 3; u++) {
        const y = 110 + u * 640;
        ((a.fillStyle = "#10161f"), a.fillRect(g, y, 62, 600));
        for (let b = 0; b < 600; b += 7)
          ((a.fillStyle = b % 28 < 7 ? "#22314a" : "#172233"),
            a.fillRect(g + 6, y + b, 50, 4));
        ((o.fillStyle = "rgba(80,190,255,.45)"),
          o.fillRect(g + 22, y + 10, 16, 580));
      }
    const f = 1600 / 2 - 110,
      d = 1600 / 2 + 110;
    for (const [g, u] of [
      [100, 2080 / 2 - 24],
      [2080 / 2 + 24, 1980],
    ]) {
      ((a.fillStyle = "#0c111a"), a.fillRect(f, g, d - f, u - g));
      for (let y = g + 6; y < u - 6; y += 22)
        for (let b = f + 8; b < d - 8; b += 34)
          ((a.fillStyle = (b + y) % 68 < 34 ? "#172136" : "#141b2c"),
            a.fillRect(b, y, 30, 18),
            (a.fillStyle = "rgba(120,140,200,.08)"),
            a.fillRect(b, y, 30, 2));
      o.fillStyle = "rgba(255,170,90,.16)";
      for (let y = g + 10; y < u - 10; y += 44)
        o.fillRect(f + 12, y, d - f - 24, 6);
    }
    ((a.fillStyle = "#161f30"),
      a.fillRect(f - 40, 2080 / 2 - 20, d - f + 80, 40),
      (o.fillStyle = "rgba(120,220,255,.5)"),
      o.fillRect(f - 40, 2080 / 2 - 6, d - f + 80, 12));
    const h = [
        [92, f - 20],
        [d + 20, 1508],
      ],
      m = 1814 / 4;
    let p = 0;
    for (const [g, u] of h)
      for (let y = 0; y < 4; y++) {
        const b = 100 + y * (m + 22),
          M = b + m;
        ((a.fillStyle = "#0a0e15"),
          a.fillRect(g, b, u - g, M - b),
          (a.fillStyle = "#121a28"),
          a.fillRect(g + 4, b + m * 0.46, u - g - 8, m * 0.08));
        const T = (u - g - 16) / 3,
          S = (m * 0.46 - 12) / 3;
        for (let C = 0; C < 2; C++)
          for (let R = 0; R < 3; R++)
            for (let z = 0; z < 3; z++) {
              const I = g + 8 + z * T,
                G = b + 6 + C * (m * 0.54) + R * S,
                V = p++ % 12 !== 7;
              ((a.fillStyle = "#0e1420"),
                a.fillRect(I + 3, G + 3, T - 6, S - 6));
              for (let B = 0; B < 2; B++)
                for (let O = 0; O < 2; O++) {
                  const j = I + 8 + (B * (T - 16)) / 2,
                    J = G + 8 + (O * (S * 0.62 - 8)) / 2,
                    K = (T - 16) / 2 - 4,
                    X = (S * 0.62 - 8) / 2 - 4;
                  ((a.fillStyle = "#141d2e"),
                    a.fillRect(j, J, K, X),
                    (a.fillStyle = "#1a263c"),
                    a.fillRect(j + 3, J + 3, K * 0.55, X - 6),
                    (a.fillStyle = "#0f1624"));
                  for (let q = 0; q < 5; q++)
                    a.fillRect(
                      j + K * 0.62,
                      J + 4 + (q * (X - 8)) / 5,
                      K * 0.32,
                      (X - 8) / 5 - 2,
                    );
                  V &&
                    ((o.fillStyle = `rgba(${(120 + i() * 60) | 0},${(150 + i() * 60) | 0},255,${0.28 + i() * 0.2})`),
                    o.fillRect(j + 3, J + 3, K * 0.55, X - 6));
                }
              ((a.fillStyle = "#182236"),
                a.fillRect(I + 8, G + S * 0.66, T - 16, S * 0.26),
                (a.fillStyle = "rgba(160,180,230,.07)"));
              for (let B = 0; B < 8; B++)
                a.fillRect(
                  I + 10 + (B * (T - 20)) / 8,
                  G + S * 0.68,
                  (T - 20) / 8 - 3,
                  S * 0.22,
                );
              V
                ? ((o.fillStyle = "rgba(140,120,255,.18)"),
                  o.fillRect(I + 8, G + S * 0.66, T - 16, S * 0.26))
                : ((a.fillStyle = "rgba(0,0,0,.35)"),
                  a.fillRect(I + 3, G + 3, T - 6, S - 6));
            }
      }
    for (let g = 0; g < 1600; g++) {
      const u = i() * 1600,
        y = i() * 2080,
        b = 20 + i() * 180,
        M = i() < 0.5;
      ((a.strokeStyle = `rgba(${(80 + i() * 60) | 0},${(100 + i() * 70) | 0},${(150 + i() * 80) | 0},${0.05 + i() * 0.12})`),
        (a.lineWidth = i() < 0.08 ? 2 : 1),
        a.beginPath(),
        a.moveTo(u, y),
        M ? a.lineTo(u, y + b) : a.lineTo(u + b, y),
        a.stroke());
    }
    for (let g = 0; g < 22; g++) {
      const u = i() * 1600,
        y = i() * 2080,
        b = 180 + i() * 420,
        M = a.createRadialGradient(u, y, 0, u, y, b),
        T = c[g % 5];
      (M.addColorStop(0, T + ".16)"),
        M.addColorStop(1, T + "0)"),
        (a.fillStyle = M),
        a.fillRect(u - b, y - b, 2 * b, 2 * b));
    }
    ((a.strokeStyle = "#26324a"),
      (a.lineWidth = 10),
      a.strokeRect(6, 6, 1588, 2068),
      (a.strokeStyle = "#0d1119"),
      (a.lineWidth = 4),
      a.strokeRect(14, 14, 1572, 2052));
    const x = new l.CanvasTexture(s),
      w = new l.CanvasTexture(r);
    return (
      (x.colorSpace = w.colorSpace = l.SRGBColorSpace),
      (x.anisotropy = w.anisotropy = 16),
      { map: x, glow: w }
    );
  })(),
  yi = We(1136, 624, (e, t, n) => {
    const s = ye(41);
    ((e.fillStyle = "#0f1c16"), e.fillRect(0, 0, t, n));
    for (let r = 0; r < 60; r++) {
      const a = s() * t,
        o = s() * n,
        i = 40 + s() * 120,
        c = e.createRadialGradient(a, o, 0, a, o, i);
      (c.addColorStop(0, "rgba(40,70,50,.18)"),
        c.addColorStop(1, "rgba(0,0,0,0)"),
        (e.fillStyle = c),
        e.fillRect(a - i, o - i, 2 * i, 2 * i));
    }
    ((e.strokeStyle = "rgba(60,100,70,.35)"), (e.lineWidth = 2));
    for (let r = 0; r < 160; r++) {
      const a = s() * t,
        o = s() * n;
      (e.beginPath(), e.moveTo(a, o));
      const i = s() < 0.5;
      (e.lineTo(a + (i ? 60 + s() * 120 : 0), o + (i ? 0 : 40 + s() * 80)),
        e.stroke());
    }
    e.fillStyle = "#b8914e";
    for (let r = 0; r < 900; r++)
      (e.beginPath(), e.arc(s() * t, s() * n, 1.4, 0, 7), e.fill());
    ((e.strokeStyle = "rgba(200,206,190,.4)"),
      (e.lineWidth = 1.5),
      e.strokeRect(t / 2 - 262, n / 2 - 205, 524, 410),
      e.strokeRect(16, 16, t - 32, n - 32));
    for (const [r, a] of [
      [36, 36],
      [t - 36, 36],
      [36, n - 36],
      [t - 36, n - 36],
      [t / 2 - 296, n / 2 - 248],
      [t / 2 + 296, n / 2 - 248],
      [t / 2 - 296, n / 2 + 248],
      [t / 2 + 296, n / 2 + 248],
    ])
      ((e.fillStyle = "#c9a256"),
        e.beginPath(),
        e.arc(r, a, 18, 0, 7),
        e.fill(),
        (e.fillStyle = "#050706"),
        e.beginPath(),
        e.arc(r, a, 10, 0, 7),
        e.fill());
    ((e.fillStyle = "rgba(222,226,212,.62)"),
      (e.font = "600 13px DM Mono, monospace"),
      e.fillText("H100 SXM5 80GB", t / 2 - 60, n / 2 + 232),
      e.fillText("699-2G520-0200", 64, 70),
      (e.fillStyle = "#e9e9e4"),
      e.fillRect(t - 150, n - 142, 88, 88),
      (e.fillStyle = "#161616"));
    for (let r = 0; r < 9; r++)
      for (let a = 0; a < 9; a++)
        (s() < 0.5 ||
          (r < 2 && a < 2) ||
          (r > 6 && a < 2) ||
          (r < 2 && a > 6)) &&
          e.fillRect(t - 146 + r * 9, n - 138 + a * 9, 8, 8);
  });
yi.anisotropy = 16;
const bi = We(64, 256, (e, t, n) => {
    for (let s = 0; s < 13; s++) {
      const r = (s * n) / 13;
      ((e.fillStyle = s === 12 ? "#20242b" : s % 2 ? "#3a404a" : "#2c3139"),
        e.fillRect(0, r, t, n / 13),
        (e.fillStyle = "#596170"),
        e.fillRect(0, r, t, 2));
    }
  }),
  xi = We(128, 128, (e, t, n) => {
    const s = e.createLinearGradient(0, 0, t, n);
    (s.addColorStop(0, "#5d6570"),
      s.addColorStop(1, "#454c56"),
      (e.fillStyle = s),
      e.fillRect(0, 0, t, n));
    const r = ye(46);
    for (let a = 0; a < 220; a++)
      ((e.fillStyle = `rgba(255,255,255,${0.02 + r() * 0.04})`),
        e.fillRect(0, r() * n, t, 1));
    ((e.strokeStyle = "rgba(20,24,30,.55)"),
      (e.lineWidth = 3),
      e.strokeRect(1.5, 1.5, t - 3, n - 3));
  }),
  Xc = We(512, 400, (e, t, n) => {
    const s = ye(44);
    ((e.fillStyle = "#262a20"), e.fillRect(0, 0, t, n));
    for (let r = 0; r < 1600; r++)
      ((e.fillStyle = s() < 0.5 ? "rgba(190,150,80,.35)" : "rgba(0,0,0,.25)"),
        e.fillRect(s() * t, s() * n, 2, 2));
  }),
  Ea = (e, t) =>
    Object.assign(
      (n) => {
        n.fragmentShader = n.fragmentShader.replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
{vec3 vv=normalize(vViewPosition);vec3 rw=inverseTransformDirection(reflect(-vv,normal),viewMatrix);float nv=clamp(dot(normal,vv),0.,1.);
 vec2 q=vec2(rw.x-.1,rw.z+.5);float box=smoothstep(.34,.08,abs(q.x))*smoothstep(.42,.1,abs(q.y))*smoothstep(.2,.6,rw.y);box*=box;
 vec3 film=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+nv*1.7+rw.x*.6));totalEmissiveRadiance+=mix(vec3(.75,.82,1.),film,.55)*box*${e.toFixed(3)};}`,
        );
      },
      { key: t },
    ),
  ie = {
    pcb: Ba({
      map: yi,
      roughness: 0.42,
      clearcoat: 0.8,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.8,
    }),
    pcbEdge: se("#16261d", { roughness: 0.5 }),
    base: Ba({
      color: "#10201a",
      roughness: 0.45,
      clearcoat: 0.7,
      clearcoatRoughness: 0.35,
    }),
    sub: Ba({ map: Xc, roughness: 0.5, clearcoat: 0.4 }),
    bga: se("#050505"),
    inter: pt(
      new l.MeshPhysicalMaterial({
        color: "#2a303b",
        roughness: 0.2,
        metalness: 0.7,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.2,
      }),
      Ea(0.12, "dcint"),
    ),
    under: Uo("#3e2a16", { roughness: 0.35, clearcoat: 0.6 }),
    die: pt(
      new l.MeshPhysicalMaterial({
        map: mi.map,
        color: new l.Color(2.4, 2.4, 2.4),
        emissiveMap: mi.glow,
        emissive: new l.Color("#9fc4ff"),
        emissiveIntensity: 0.16,
        metalness: 0.7,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        iridescence: 1,
        iridescenceIOR: 1.55,
        iridescenceThicknessRange: [260, 560],
        envMapIntensity: 2.2,
      }),
      Ea(0.12, "dcdie"),
    ),
    dieSide: Le("#20252e", { roughness: 0.3 }),
    hbm: pt(
      new l.MeshPhysicalMaterial({
        map: xi,
        color: "#9aa3ae",
        roughness: 0.22,
        metalness: 0.6,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.3,
      }),
      Ea(0.08, "dchbm"),
    ),
    hbmDummy: Xo({
      map: xi,
      color: "#d0d4da",
      roughness: 0.55,
      metalness: 0.25,
    }),
    hbmSide: Xo({
      map: bi,
      emissive: new l.Color("#5fd4ff"),
      emissiveMap: bi,
      emissiveIntensity: 0,
      roughness: 0.4,
      metalness: 0.5,
    }),
    fin: Le("#8f98a3", { roughness: 0.36, clearcoat: 0 }),
    cu: Yr,
    screw: Le("#8b939c", { roughness: 0.3 }),
    anod: Le("#23272e", { roughness: 0.4, metalness: 0.6 }),
    cap: se("#7d6d56", { roughness: 0.5 }),
    capEnd: Le("#aeb4bb", { roughness: 0.3 }),
    ind: Le("#6f757d", { roughness: 0.4 }),
    indTop: se("#1b1d21", { roughness: 0.6 }),
    qfn: se("#101114", { roughness: 0.5 }),
    conn: se("#0c0d10", { roughness: 0.5 }),
    busbar: Yr,
    pan: Le("#2c3138", { roughness: 0.45, metalness: 0.6 }),
    latch: se("#2f6fd0", { roughness: 0.45 }),
    dash: Ke("#bfe6ff", 0.9),
  },
  io = new l.Group();
(io.position.set(Xe.x - 0.96, Po(qo.S3[0]), Xe.z), pe.add(io));
const xt = 0.0134,
  Ko = xt + 0.0076,
  wi = [-0.329, -0.07],
  gi = [-0.1575, -0.0525, 0.0525, 0.1575],
  qt = { x: wi[0], z: gi[3] },
  vi = 0.2,
  ki = new l.MeshBasicMaterial({ color: new l.Color(0, 0, 0), fog: !1 });
function Mi(e, t, n, s) {
  e.box(ie.cu, t, n + 0.003, s, 0.15, 0.006, 0.098 + 0.002);
  for (let c = 0; c < 22; c++)
    e.box(
      ie.fin,
      t,
      n + 0.006 + 0.105 / 2,
      s - 0.098 / 2 + ((c + 0.5) * 0.098) / 22,
      0.148,
      0.105,
      0.0011,
    );
  for (const c of [-1, 1])
    e.box(
      ie.anod,
      t + c * (0.148 / 2 - 0.002),
      n + 0.0068 + 0.105,
      s,
      0.004,
      0.0016,
      0.098 + 0.002,
    ).box(
      ie.anod,
      t,
      n + 0.0068 + 0.105,
      s + c * (0.098 / 2 - 0.0015),
      0.148,
      0.0016,
      0.003,
    );
  for (const c of [-1, 1])
    for (let f = 0; f < 4; f++) {
      const d = s - 0.03528 + f * 0.098 * 0.24;
      e.cyl(
        ie.cu,
        t + c * 0.0755,
        n + 0.006 + 0.105 * 0.52,
        d,
        0.003,
        0.003,
        0.105 * 0.9,
        { seg: 10 },
      );
    }
  for (const c of [-1, 1])
    for (const f of [-1, 1])
      e.cyl(
        ie.screw,
        t + c * 0.066,
        n + 0.0075,
        s + f * 0.0345,
        0.0028,
        0.0028,
        0.004,
        { seg: 10 },
      ).cyl(
        ie.screw,
        t + c * 0.066,
        n - 0.001,
        s + f * 0.0345,
        0.0012,
        0.0012,
        0.008,
        { seg: 6 },
      );
}
{
  const e = Pt(),
    t = Pt();
  e.box(ie.pan, 0, 0.002, 0, 0.88, 0.004, 0.44);
  for (const h of [-1, 1])
    e.box(ie.pan, 0, 0.022, h * 0.218, 0.88, 0.04, 0.004);
  (e.box(ie.pan, 0.438, 0.022, 0, 0.004, 0.04, 0.44),
    e.box(v.char, -0.43, 0.089, 0, 0.02, 0.178, 0.44),
    e.cyl(v.trim, -0.468, 0.09, 0, 0.006, 0.006, 0.34, {
      rx: Math.PI / 2,
      seg: 10,
    }));
  for (const h of [-1, 1])
    e.box(v.trim, -0.455, 0.09, h * 0.17, 0.03, 0.012, 0.012).box(
      ie.latch,
      -0.444,
      0.15,
      h * 0.2,
      0.012,
      0.03,
      0.02,
    );
  for (const h of [-1, 1])
    e.box(v.steelL, 0, 0.03, h * 0.225, 0.86, 0.036, 0.006)
      .box(v.steelL, 0.33, 0.03, h * 0.231, 0.86, 0.032, 0.006)
      .box(v.steelL, 0.78, 0.03, h * 0.237, 0.86, 0.028, 0.006);
  e.box(ie.base, 0.01, xt - 0.0012, 0, 0.84, 0.0024, 0.43);
  for (const h of [-0.4, -0.1, 0.2, 0.42])
    for (const m of [-1, 1])
      e.cyl(ie.screw, h, 0.0075, m * 0.2, 0.003, 0.003, 0.007, { seg: 8 });
  for (const h of wi)
    for (const m of gi) {
      const p = h === qt.x && m === qt.z;
      for (const x of [-1, 1])
        e.box(ie.conn, h + x * 0.05, xt + 0.003, m, 0.012, 0.006, 0.06);
      p ||
        (e.box(ie.pcbEdge, h, Ko - 8e-4, m, 0.142, 0.0016, 0.078),
        e.box(ki, h, Ko + 0.0014, m, 0.153, 0.0022, 0.1),
        Mi(e, h, Ko + 0.003, m));
    }
  Mi(e, qt.x, Ko + 0.003 + vi, qt.z);
  for (const h of [-1, 1])
    for (const m of [-1, 1])
      for (let p = Ko + 0.004; p < Ko + vi - 0.004; p += 0.011)
        e.box(
          ie.dash,
          qt.x + h * 0.066,
          p + 0.003,
          qt.z + m * 0.0345,
          7e-4,
          0.006,
          7e-4,
        );
  for (const h of [-0.165, -0.055, 0.055, 0.165]) {
    e.box(ie.sub, -0.2, xt + 8e-4, h, 0.046, 0.0016, 0.046).box(
      ie.anod,
      -0.2,
      xt + 0.0036,
      h,
      0.044,
      0.004,
      0.044,
    );
    for (let m = 0; m < 10; m++)
      e.box(
        ie.anod,
        -0.2,
        xt + 0.0146,
        h - 0.0198 + m * 0.0044,
        0.044,
        0.018,
        0.0011,
      );
  }
  for (const h of [-0.17, -0.06, 0.06, 0.17]) {
    e.box(ie.sub, 0.12, xt + 8e-4, h, 0.032, 0.0016, 0.032).box(
      ie.anod,
      0.12,
      xt + 0.003,
      h,
      0.03,
      0.003,
      0.03,
    );
    for (let m = 0; m < 7; m++)
      e.box(
        ie.anod,
        0.12,
        xt + 0.011,
        h - 0.0129 + m * 0.0043,
        0.03,
        0.013,
        0.001,
      );
  }
  for (let h = 0; h < 8; h++)
    e.box(ie.qfn, 0.2, xt + 7e-4, -0.175 + h * 0.05, 0.012, 0.0014, 0.012);
  for (let h = 0; h < 12; h++)
    e.cyl(ie.anod, 0.255, xt + 0.007, -0.19 + h * 0.0345, 0.005, 0.005, 0.014, {
      seg: 12,
    });
  for (const h of [-0.175, -0.125, -0.075, -0.025, 0.025, 0.075, 0.125, 0.175])
    e.box(ie.conn, 0.405, xt + 0.0075, h, 0.03, 0.015, 0.042).box(
      ie.screw,
      0.405,
      xt + 0.0152,
      h,
      0.026,
      6e-4,
      0.036,
    );
  for (const h of [-1, 1]) {
    e.box(ie.conn, 0.33, xt + 0.014, h * 0.12, 0.05, 0.028, 0.07);
    for (const m of [-0.018, 0.018])
      e.box(ie.busbar, 0.33, xt + 0.038, h * 0.12 + m, 0.034, 0.022, 0.006);
  }
  e.flush(io);
  const n = new l.Group();
  (n.position.set(qt.x, Ko, qt.z),
    io.add(n),
    (io.userData.mod = n),
    t.box(ie.pcbEdge, 0, -8e-4, 0, 0.142, 0.0016, 0.078));
  {
    const h = new l.Mesh(new l.PlaneGeometry(0.142, 0.078), ie.pcb);
    ((h.rotation.x = -Math.PI / 2),
      (h.position.y = 3e-5),
      (h.receiveShadow = !0),
      n.add(h));
  }
  (t
    .box(ie.bga, 0, 2e-4, 0, 0.06, 4e-4, 0.046)
    .box(ie.sub, 0, 0.001, 0, 0.062, 0.0012, 0.048)
    .box(ie.inter, 0, 0.00185, 0, 0.052, 5e-4, 0.0355),
    t.box(ie.under, 0, 0.00222, 0, 0.0254, 25e-5, 0.0329));
  for (const h of [-1, 1])
    for (const m of [-1, 0, 1])
      t.box(ie.under, h * 0.019, 0.00222, m * 0.011, 0.0114, 25e-5, 0.0109);
  for (const h of [-1, 1]) {
    for (const m of [0.0515, 0.0605])
      for (let p = 0; p < 6; p++) {
        const x = -0.0275 + p * 0.011;
        t.box(ie.ind, h * m, 0.0022, x, 0.0068, 0.0044, 0.0068, {
          r: 6e-4,
        }).box(ie.indTop, h * m, 0.00445, x, 0.0056, 3e-4, 0.0056);
      }
    for (let m = 0; m < 6; m++)
      t.box(
        ie.qfn,
        h * 0.0425,
        5e-4,
        -0.0275 + m * 0.011,
        0.0048,
        0.001,
        0.0058,
      );
  }
  for (const h of [-1, 1])
    for (const m of [-1, 1])
      t.cyl(ie.screw, h * 0.066, 0.002, m * 0.0345, 0.0024, 0.0024, 0.004, {
        seg: 10,
      });
  t.flush(n);
  const s = (h, m, p, x, w) =>
      new l.Mesh(new l.BoxGeometry(h, m, p), [w, w, x, w, w, w]),
    r = s(0.025, 8e-4, 0.0325, ie.die, ie.dieSide);
  ((r.position.y = 0.0025),
    n.add(r),
    (io.userData.die = r),
    (io.userData.hbm = []));
  for (const h of [-1, 1])
    for (const m of [-1, 0, 1]) {
      const p = h > 0 && m > 0,
        x = s(0.011, 78e-5, 0.0105, p ? ie.hbmDummy : ie.hbm, ie.hbmSide);
      (x.position.set(h * 0.019, 0.00249, m * 0.011),
        n.add(x),
        io.userData.hbm.push(x));
    }
  n.traverse((h) => {
    h.isMesh && ((h.castShadow = !0), (h.receiveShadow = !0));
  });
  const a = [],
    o = (h, m, p, x = !0, w = 0.0014) => {
      for (let g = h; g <= m + 1e-6; g += w) a.push(x ? [g, p, 0] : [p, g, 1]);
    };
  for (const h of [-1, 1]) {
    for (const m of [0.0196, 0.0214]) o(-0.0275, 0.0275, h * m, !0, 0.0016);
    (o(-0.0165, 0.0165, h * 0.0284, !1, 0.0016),
      o(-0.029, 0.029, h * 0.0268, !0, 0.0021),
      o(-0.023, 0.023, h * 0.0345, !1, 0.0021));
  }
  for (let h = a.length - 1; h >= 0; h--) Ie(h * 1.37) < 0.18 && a.splice(h, 1);
  const i = new l.BoxGeometry(0.001, 5e-4, 5e-4),
    c = new l.BoxGeometry(22e-5, 52e-5, 52e-5),
    f = new l.InstancedMesh(i, ie.cap, a.length),
    d = new l.InstancedMesh(c, ie.capEnd, a.length * 2);
  a.forEach(([h, m, p], x) => {
    const w = Math.abs(h) < 0.031 && Math.abs(m) < 0.024 ? 0.00185 : 25e-5;
    ($e.setFromAxisAngle(Zt, p ? Math.PI / 2 : 0),
      ae.compose(re(h, w, m), $e, Nt.set(1, 1, 1)),
      f.setMatrixAt(x, ae));
    for (const g of [-1, 1])
      (ae.compose(
        re(h + (p ? 0 : g * 45e-5), w, m + (p ? g * 45e-5 : 0)),
        $e,
        Nt.set(1, 1, 1),
      ),
        d.setMatrixAt(x * 2 + (g > 0), ae));
  });
  for (const h of [f, d])
    ((h.castShadow = h.receiveShadow = !0),
      h.computeBoundingSphere(),
      n.add(h));
}
const Da = [];
{
  const e = _a,
    t = Be.h + 0.04,
    n = se("#c7cacd", { roughness: 0.55, metalness: 0.15 }),
    s = v.steel;
  for (const r of [-15.2, -7.8])
    for (const a of [-26, -13, 0, 13, 26]) {
      const o = t + 0.45;
      e.box(n, a, o + 1, r, 11, 2, 2.3, { r: 0.04 })
        .box(v.louv, a, o + 0.9, r + 1.16, 10.6, 1.5, 0.02)
        .box(v.louv, a, o + 0.9, r - 1.16, 10.6, 1.5, 0.02)
        .box(v.greyD, a, o + 2.02, r, 11.02, 0.05, 2.32);
      for (const i of [-5, 5])
        for (const c of [-0.9, 0.9])
          e.box(s, a + i, t + 0.22, r + c, 0.12, 0.45, 0.12);
      for (let i = 0; i < 5; i++) {
        const c = a - 4.4 + i * 2.2,
          f = o + 2.05;
        (e
          .cyl(
            se("#aeb2b6", { roughness: 0.5 }),
            c,
            f + 0.14,
            r,
            0.98,
            0.98,
            0.28,
            { seg: 28, open: !0 },
          )
          .cyl(v.char, c, f + 0.03, r, 0.95, 0.95, 0.04, { seg: 28 })
          .cyl(v.dark, c, f + 0.17, r, 0.13, 0.13, 0.12, { seg: 12 }),
          e
            .box(v.steel, c, f + 0.3, r, 1.9, 0.02, 0.03)
            .box(v.steel, c, f + 0.3, r, 0.03, 0.02, 1.9),
          Da.push([c, f + 0.2, r, 0.88, Ie(c * 3 + r)]));
      }
    }
  for (const [r, a] of [
    [-11.9, v.pipeB],
    [-11.1, v.pipeR],
  ]) {
    e.cyl(a, 0, t + 0.5, r, 0.16, 0.16, 64, { rz: Math.PI / 2, seg: 14 });
    for (const o of [-26, -13, 0, 13, 26])
      for (const i of [-1, 1])
        e.cyl(
          a,
          o + i * 0.4,
          t + 0.9,
          r + (r < -11.5 ? -1 : 1) * 1.6 * 0,
          0.09,
          0.09,
          0.8,
          { seg: 10 },
        );
    for (let o = -31; o <= 31; o += 6)
      e.box(v.steel, o, t + 0.2, r, 0.3, 0.4, 0.3);
  }
  e.box(se("#9ea3a8", { roughness: 0.6 }), -31, t + 0.45, -4, 1.4, 0.9, 1.4, {
    r: 0.03,
  });
}
{
  const e = [];
  for (let r = 0; r < 6; r++) {
    const a = new l.BoxGeometry(0.7040000000000001, 0.012, 0.2112);
    (a.translate(0.88 * 0.48, 0, 0),
      a.rotateX(0.32),
      a.rotateY((r / 6) * Math.PI * 2),
      e.push(a));
  }
  const n = h0(e),
    s = new l.InstancedMesh(
      n,
      se("#3a3f46", { roughness: 0.45, metalness: 0.3 }),
      Da.length,
    );
  ((s.castShadow = !1),
    (s.receiveShadow = !0),
    pe.add(s),
    (pe.userData.fans = s));
}
const Bs = [];
{
  const e = hi,
    t = (a, o, i, c, f, d) => {
      const h = new l.PlaneGeometry(i - o, f - c);
      (h.rotateX(-Math.PI / 2), h.translate((o + i) / 2, d, (c + f) / 2));
      const m = h.attributes.position,
        p = h.attributes.uv;
      for (let w = 0; w < p.count; w++)
        p.setXY(w, m.getX(w) / 6, -m.getZ(w) / 6);
      const x = new l.Mesh(h, a);
      return ((x.receiveShadow = !0), pe.add(x), x);
    },
    n = { x0: -66, x1: 78, z0: -40, z1: 27.4 };
  for (const [a, o, i, c] of [
    [-420, 420, n.z1, 420],
    [-420, 420, -420, n.z0],
    [-420, n.x0, n.z0, n.z1],
    [n.x1, 420, n.z0, n.z1],
  ])
    t(v.grass, a, o, i, c, 0.012);
  {
    const a = new l.PlaneGeometry(840, 7.5);
    (a.rotateX(-Math.PI / 2), a.translate(0, 0.02, 33.75));
    const o = a.attributes.uv,
      i = a.attributes.position;
    for (let f = 0; f < o.count; f++)
      o.setXY(f, (i.getZ(f) - 30) / 7.5, i.getX(f) / 12);
    const c = new l.Mesh(a, v.road);
    ((c.receiveShadow = !0), pe.add(c));
  }
  (t(v.pave, -420, 420, 28.2, 30, 0.07),
    t(v.pave, -420, 420, 37.5, 39.3, 0.07),
    e
      .box(v.kerb, 0, 0.04, 30.02, 840, 0.08, 0.14)
      .box(v.kerb, 0, 0.04, 37.48, 840, 0.08, 0.14));
  for (let a = -90; a <= 110; a += 22)
    (e
      .cyl(v.char, a, 4, 29.2, 0.07, 0.1, 8, { seg: 8 })
      .box(v.char, a, 7.95, 30.1, 0.12, 0.1, 1.9)
      .box(v.char, a, 7.9, 31, 0.24, 0.12, 0.6),
      Bs.push([a, 7.83, 31]));
  for (let a = n.x0; a <= n.x1; a += 3)
    (a > -54 && a < -44) ||
      e.cyl(v.steel, a, 1.1, 27.1, 0.035, 0.035, 2.2, { seg: 6 });
  for (const [a, o] of [
    [n.x0, -54],
    [-44, n.x1],
  ])
    for (const i of [0.25, 1.2, 2.15])
      e.box(v.steel, (a + o) / 2, i, 27.1, o - a, 0.03, 0.03);
  for (let a = n.z0; a <= n.z1; a += 3)
    for (const o of [n.x0, n.x1])
      e.cyl(v.steel, o, 1.1, a, 0.035, 0.035, 2.2, { seg: 6 });
  for (const a of [n.x0, n.x1])
    for (const o of [0.25, 1.2, 2.15])
      e.box(v.steel, a, o, (n.z0 + n.z1) / 2, 0.03, 0.03, n.z1 - n.z0);
  for (const a of [0.25, 1.2, 2.15])
    e.box(v.steel, (n.x0 + n.x1) / 2, a, n.z0, n.x1 - n.x0, 0.03, 0.03);
  (t(v.pave, -40, 40, 20.4, 26.8, 0.008),
    t(v.grass, -40, -8, 24, 26.6, 0.03),
    t(v.grass, 8, 40, 24, 26.6, 0.03),
    e
      .box(v.kerb, -24, 0.05, 23.95, 32, 0.1, 0.1)
      .box(v.kerb, 24, 0.05, 23.95, 32, 0.1, 0.1));
  for (let a = 0; a < 26; a++) {
    const o = (a < 13 ? -38.5 + a * 2.4 : 9 + (a - 13) * 2.4) + Ie(a) * 0.8,
      i = 25.2 + Ie(a + 0.5) * 0.9;
    e.geo(Zr[a % 4], za(0.5 + Ie(a * 3) * 0.35, 0.35, a + 11), o, 0.3, i, {
      s: [1.3, 0.8, 1],
    });
  }
  (Jn(e, -41.5, 0.03, 24.8, 2.2, 5, 5),
    Jn(e, 41.5, 0.03, 24.8, 2.1, 9, 5),
    t(se("#3b3f46", { roughness: 0.8 }), -63, -41, -16, 24, 0.006));
  for (const a of [-60.5, -43.5])
    for (let o = -14; o <= 22; o += 2.6)
      e.box(v.white, a + (a < -50 ? 1.3 : -1.3), 0.012, o, 0.08, 0.004, 4.6);
  for (const a of [-60.5, -43.5])
    e.box(v.white, a + (a < -50 ? 3.7 : -3.7), 0.012, 4, 0.08, 0.004, 36);
  for (const [a, o] of [
    [-52, -10],
    [-52, 10],
  ])
    (e
      .cyl(v.char, a, 4, o, 0.06, 0.08, 8, { seg: 8 })
      .box(v.char, a, 7.95, o, 1.6, 0.1, 0.3),
      Bs.push([a - 0.6, 7.85, o], [a + 0.6, 7.85, o]));
  for (let a = 0; a < 10; a++) {
    const o = -65 + Ie(a + 1) * 1.5,
      i = -36 + a * 6.4;
    Jn(e, o, 0.012, i, 2 + Ie(a + 5) * 0.7, a + 50, 5);
  }
  t(v.gravel, 38.5, 76, -36, 3, 0.02);
  for (let a = 38.5; a <= 76; a += 3)
    for (const o of [-36, 3])
      e.cyl(v.steel, a, 1.2, o, 0.03, 0.03, 2.4, { seg: 5 });
  for (let a = -36; a <= 3; a += 3)
    for (const o of [38.5, 76])
      e.cyl(v.steel, o, 1.2, a, 0.03, 0.03, 2.4, { seg: 5 });
  for (const a of [0.3, 1.3, 2.35])
    e.box(v.steel, 57.25, a, -36, 37.5, 0.03, 0.03)
      .box(v.steel, 57.25, a, 3, 37.5, 0.03, 0.03)
      .box(v.steel, 38.5, a, -16.5, 0.03, 0.03, 39)
      .box(v.steel, 76, a, -16.5, 0.03, 0.03, 39);
  for (const a of [46, 55, 64]) {
    e.box(v.kerb, a, 0.2, -12, 6, 0.4, 5).box(
      v.tfm,
      a,
      2.2,
      -12,
      3.6,
      3.4,
      2.6,
      { r: 0.05 },
    );
    for (const i of [-1, 1])
      for (let c = 0; c < 9; c++)
        e.box(v.tfmD, a - 1.6 + c * 0.4, 2.1, -12 + i * 1.75, 0.05, 2.8, 0.9);
    (e.cyl(v.tfm, a, 4.35, -12 - 0.8, 0.45, 0.45, 3, {
      rz: Math.PI / 2,
      seg: 16,
    }),
      e.box(v.tfmD, a, 3.95, -12 - 0.8, 0.2, 0.4, 0.2));
    for (let i = -1; i <= 1; i++) {
      const c = a + i * 0.9;
      e.cyl(v.porc, c, 4.55, -12 + 0.5, 0.1, 0.14, 1.6, { seg: 10 });
      for (let f = 0; f < 6; f++)
        e.cyl(v.porc, c, 3.95 + f * 0.22, -12 + 0.5, 0.2, 0.2, 0.05, {
          seg: 12,
        });
      e.cyl(v.steelL, c, 5.42, -12 + 0.5, 0.05, 0.05, 0.2, { seg: 8 });
    }
    for (let i = -1; i <= 1; i++)
      e.cyl(v.porc, a + i * 0.6, 3.95, -12 - 1.1, 0.06, 0.08, 0.5, { seg: 8 });
  }
  const s = (a, o, i) => {
    for (const c of [-0.6, 0.6])
      for (const f of [-0.6, 0.6])
        e.box(v.steelL, a + c, i / 2, o + f, 0.08, i, 0.08);
    for (let c = 1; c < i; c += 1.2)
      (e
        .box(v.steelL, a, c, o - 0.6, 1.2, 0.05, 0.05)
        .box(v.steelL, a, c, o + 0.6, 1.2, 0.05, 0.05)
        .box(v.steelL, a - 0.6, c, o, 0.05, 0.05, 1.2)
        .box(v.steelL, a + 0.6, c, o, 0.05, 0.05, 1.2),
        e
          .box(v.steelL, a, c + 0.6, o - 0.6, 1.3, 0.04, 0.04, { rz: 0.78 })
          .box(v.steelL, a, c + 0.6, o + 0.6, 1.3, 0.04, 0.04, { rz: -0.78 }));
  };
  (s(43, -27, 12),
    s(67, -27, 12),
    e.box(v.steelL, 55, 11.6, -27, 24, 0.5, 0.5));
  const r = [];
  for (const a of [46, 55, 64])
    for (let o = -1; o <= 1; o++) {
      const i = a + o * 0.9,
        c = re(i, 11.1, -27);
      (e.cyl(v.porc, i, 11.35, -27, 0.07, 0.07, 0.5, { seg: 8 }),
        e.tube(v.steel, [c, re(i, 8.3, -20), re(i, 5.5, -12 + 0.5)], 0.02, {
          n: 14,
          seg: 4,
        }),
        e.tube(
          v.steel,
          [c, re(i + o * 2, 9, -70), re(i + o * 4, 16, -140)],
          0.025,
          { n: 16, seg: 4 },
        ));
    }
  e.box(se("#b8bcc0", { roughness: 0.6 }), 48, 1.9, -1.2, 16, 3.8, 4, {
    r: 0.05,
  }).box(v.louv, 48, 2.6, 0.82, 14, 1.2, 0.02);
  for (let a = 0; a < 5; a++)
    e.box(v.greyD, 42 + a * 3, 1.1, 0.82, 0.9, 2, 0.03);
  for (const [a, o] of [
    [40.5, -20],
    [74, -4],
    [74, -30],
  ])
    (e
      .cyl(v.steel, a, 4.5, o, 0.06, 0.09, 9, { seg: 8 })
      .box(v.char, a, 8.9, o + (o < -10 ? 0.3 : -0.3), 0.5, 0.25, 0.35),
      Bs.push([a, 8.75, o + (o < -10 ? 0.3 : -0.3)]));
  t(v.pave, 40.6, 74, 7, 24, 0.01);
  for (let a = 0; a < 4; a++) {
    const o = 9.5 + a * 3.8,
      i = 56.5;
    e.box(v.char, i, 0.35, o, 12.4, 0.7, 2.7)
      .box(v.gen, i, 2.05, o, 12.2, 2.7, 2.5, { r: 0.04 })
      .box(v.genD, i, 3.44, o, 12.3, 0.08, 2.6);
    for (const c of [-1, 1]) e.box(v.louv, i + c * 6.12, 2, o, 0.03, 2.2, 2.1);
    for (let c = 0; c < 3; c++)
      e.box(v.greyD, i - 3 + c * 2.6, 1.7, o + 1.26, 0.9, 2, 0.03);
    (e
      .cyl(v.char, i + 3.8, 4.35, o, 0.22, 0.22, 1.8, { seg: 12 })
      .cyl(v.char, i + 3.8, 5.3, o, 0.3, 0.3, 0.08, { seg: 12 }),
      e.box(Ke("#7df0b4", 2.6), i - 5.6, 2.9, o + 1.265, 0.08, 0.08, 0.02));
  }
  for (let a = 0; a < 18; a++) {
    const o = -110 + a * 13 + Ie(a) * 4,
      i = 42 + Ie(a + 0.3) * 4;
    Jn(e, o, 0.012, i, 2 + Ie(a + 0.7) * 0.8, a + 70, 5);
  }
  for (let a = 0; a < 34; a++) {
    const o = -90 + Ie(a + 3) * 200,
      i = -62 - Ie(a + 0.9) * 60;
    Jr(e, o, 0.012, i, 6 + Ie(a + 0.2) * 4, a + 5);
  }
  for (let a = 0; a < 16; a++) {
    const o = 86 + Ie(a + 11) * 50,
      i = -60 + Ie(a + 0.4) * 100;
    (a % 3 ? Jn : Jr)(
      e,
      o,
      0.012,
      i,
      a % 3 ? 2.2 + Ie(a) * 0.8 : 6 + Ie(a) * 3,
      a + 120,
      5,
    );
  }
  for (let a = 0; a < 14; a++) {
    const o = -2.2 + a * 0.2 + Ie(a) * 0.1,
      i = 330 + Ie(a + 0.2) * 160;
    e.geo(
      se(["#3a4a3c", "#435244", "#34443a"][a % 3], {
        flatShading: !0,
        roughness: 0.95,
      }),
      za(1, 0.35, a + 300, 1),
      Math.cos(o) * i + 60,
      -4,
      Math.sin(o) * i - 60,
      { s: [60 + Ie(a) * 50, 18 + Ie(a + 0.1) * 24, 40 + Ie(a + 0.6) * 30] },
    );
  }
}
{
  const e = new l.BoxGeometry(0.7, 0.06, 0.36),
    t = new l.InstancedMesh(e, Ke("#ffd9a8", 4.5), Bs.length);
  (Bs.forEach((n, s) => {
    (ae.makeTranslation(n[0], n[1], n[2]),
      t.setMatrixAt(s, ae),
      qe(n[0] + pe.position.x, n[1] - 1, n[2], "#ffc98a", 12, 0.5));
  }),
    t.computeBoundingSphere(),
    pe.add(t));
}
const Si = [];
{
  const t = ye(77),
    n = [
      "#6c7b86",
      "#b9b4aa",
      "#3b4452",
      "#8d3b36",
      "#e3e0d8",
      "#2e3b35",
      "#9a8660",
    ],
    s = new l.InstancedMesh(
      _n(1.8, 0.62, 4.3, 0.16),
      Uo("#ffffff", { roughness: 0.3 }),
      14,
    ),
    r = new l.InstancedMesh(
      _n(1.62, 0.5, 2.3, 0.16),
      se("#1a2129", { roughness: 0.2, envMapIntensity: 1.3 }),
      14,
    ),
    a = new l.InstancedMesh(
      new l.BoxGeometry(1.4, 0.1, 0.05),
      Ke("#fff1d6", 5),
      6,
    ),
    o = new l.InstancedMesh(
      new l.BoxGeometry(1.4, 0.08, 0.05),
      Ke("#ff3b30", 3.2),
      6,
    );
  for (let i = 0; i < 14; i++)
    s.setColorAt(i, new l.Color(n[Math.floor(t() * n.length)]));
  for (let i = 0; i < 6; i++)
    Si.push({
      lane: i % 2 ? 35.6 : 31.9,
      dir: i % 2 ? -1 : 1,
      u: t(),
      v: 11 + t() * 5,
    });
  for (let i = 0; i < 8; i++) {
    const c = i < 4 ? -59.2 : -44.8,
      f = -9 + (i % 4) * 5.2 + (i > 3 ? 2.6 : 0),
      d = 6 + i;
    ($e.setFromAxisAngle(Zt, Math.PI / 2),
      ae.compose(re(c, 0.49, f), $e, Nt.set(1, 1, 1)),
      s.setMatrixAt(d, ae),
      ae.compose(re(c + (i < 4 ? 0.25 : -0.25), 1.02, f), $e, Nt.set(1, 1, 1)),
      r.setMatrixAt(d, ae));
  }
  for (const i of [s, r]) i.castShadow = i.receiveShadow = !0;
  (pe.add(s, r, a, o),
    (pe.userData.cars = { body: s, cab: r, hl: a, tl: o, n: 6 }));
}
const os = new l.Vector3(),
  _s = new l.Vector3(1, 1, 1);
function qc(e) {
  const t = pe.userData.cars;
  Si.forEach((n, s) => {
    const a = (((n.u + (e * n.v) / 260) % 1) + 1) % 1,
      o = n.dir > 0 ? -130 + a * 260 : 130 - a * 260;
    ($e.setFromAxisAngle(Zt, n.dir > 0 ? Math.PI / 2 : -Math.PI / 2),
      ae.compose(os.set(o, 0.49, n.lane), $e, _s),
      t.body.setMatrixAt(s, ae),
      ae.compose(os.set(o - n.dir * 0.25, 1.02, n.lane), $e, _s),
      t.cab.setMatrixAt(s, ae),
      ae.compose(os.set(o + n.dir * 2.16, 0.56, n.lane), $e, _s),
      t.hl.setMatrixAt(s, ae),
      ae.compose(os.set(o - n.dir * 2.16, 0.64, n.lane), $e, _s),
      t.tl.setMatrixAt(s, ae));
  });
  for (const n of [t.body, t.cab, t.hl, t.tl])
    n.instanceMatrix.needsUpdate = !0;
}
{
  const e = [..._a.flush(pe), ...T0.flush(pe), ...hi.flush(pe)];
  (fi(
    e.filter((t) => t.material === v.clad),
    1.2,
    2.4,
  ),
    fi(
      e.filter((t) => t.material === v.louv),
      1,
      1,
    ),
    e
      .filter((t) => t.material.isMeshBasicMaterial)
      .forEach((t) => {
        t.castShadow = !1;
      }));
}
function Kc(e, t = 0.22, n = 0.05) {
  const s = e.map((h) => (h.isVector3 ? h : re(...h))),
    r = [s[0].clone()],
    a = [0];
  for (let h = 1; h < s.length - 1; h++) {
    const m = s[h - 1],
      p = s[h],
      x = s[h + 1],
      w = p.clone().sub(m),
      g = x.clone().sub(p),
      u = w.length(),
      y = g.length();
    (w.normalize(), g.normalize());
    const b = Math.min(t, u * 0.45, y * 0.45),
      M = p.clone().addScaledVector(w, -b),
      T = p.clone().addScaledVector(g, b);
    for (let S = 0; S <= 8; S++) {
      const C = S / 8,
        R = M.clone()
          .multiplyScalar((1 - C) * (1 - C))
          .addScaledVector(p, 2 * C * (1 - C))
          .addScaledVector(T, C * C);
      r.push(R);
    }
    a.push(r.length - 5);
  }
  (r.push(s[s.length - 1].clone()), a.push(r.length - 1));
  const o = [0];
  for (let h = 1; h < r.length; h++)
    o.push(o[h - 1] + r[h].distanceTo(r[h - 1]));
  const i = o[o.length - 1],
    c = [],
    f = Math.ceil(i / n),
    d = (h) => {
      let m = 0,
        p = o.length - 1;
      for (; p - m > 1;) {
        const w = (m + p) >> 1;
        o[w] <= h ? (m = w) : (p = w);
      }
      const x = (h - o[m]) / Math.max(o[p] - o[m], 1e-6);
      return r[m].clone().lerp(r[p], x);
    };
  for (let h = 0; h <= f; h++) c.push(d((h / f) * i));
  return { pts: c, len: i, at: d, mark: a.map((h) => o[h]) };
}
function Yc(e, t = 0.012, n = 6) {
  const s = e.pts,
    r = s.length,
    a = new Float32Array(r * n * 3),
    o = new Float32Array(r * n * 3),
    i = new Float32Array(r * n),
    c = [],
    f = new l.Vector3(),
    d = new l.Vector3(),
    h = new l.Vector3(),
    m = new l.Vector3();
  for (let x = 0; x < r; x++) {
    (f.subVectors(s[Math.min(x + 1, r - 1)], s[Math.max(x - 1, 0)]).normalize(),
      m.set(0, 1, 0),
      Math.abs(f.y) > 0.9 && m.set(1, 0, 0),
      d.crossVectors(f, m).normalize(),
      h.crossVectors(f, d));
    for (let w = 0; w < n; w++) {
      const g = (w / n) * Math.PI * 2,
        u = Math.cos(g),
        y = Math.sin(g),
        b = (x * n + w) * 3,
        M = d.x * u + h.x * y,
        T = d.y * u + h.y * y,
        S = d.z * u + h.z * y;
      ((a[b] = s[x].x + M * t),
        (a[b + 1] = s[x].y + T * t),
        (a[b + 2] = s[x].z + S * t),
        (o[b] = M),
        (o[b + 1] = T),
        (o[b + 2] = S),
        (i[x * n + w] = (x / (r - 1)) * e.len));
    }
    if (x < r - 1)
      for (let w = 0; w < n; w++) {
        const g = x * n + w,
          u = x * n + ((w + 1) % n),
          y = g + n,
          b = u + n;
        c.push(g, y, u, u, y, b);
      }
  }
  const p = new l.BufferGeometry();
  return (
    p.setAttribute("position", new l.BufferAttribute(a, 3)),
    p.setAttribute("normal", new l.BufferAttribute(o, 3)),
    p.setAttribute("aS", new l.BufferAttribute(i, 1)),
    p.setIndex(c),
    p
  );
}
const Fa = (() => {
  const e = hn.y,
    t = hn.z,
    n = No,
    s = (C) => [
      [C - 0.16, e, t],
      [C, n + 0.06, He.z + 0.42],
      [C + 0.16, e, t],
    ],
    r = He.xs,
    a = hn,
    o = z0 + 0.01,
    i = (C) =>
      re(io.position.x + C[0], io.position.y + C[1], io.position.z + C[2]),
    c = Ct(Xe.p) - 0.45,
    f = [],
    d = {},
    h = (C, ...R) => {
      for (const z of R)
        (C && z === R[Math.floor(R.length / 2)] && (d[C] = f.length),
          f.push(z));
    };
  (h(
    0,
    [a.hole.x + 0.2, 0.1, a.hole.z - 0.1],
    [a.hole.x + 1, 0.13, a.wall.z + 0.8],
    [a.wall.x - 0.5, 0.22, a.wall.z],
    [a.wall.x, a.wall.y, a.wall.z],
    [a.box.x, a.box.y, a.box.z],
  ),
    h("corner", [a.box.x + 0.02, a.yh, a.box.z]),
    h(0, [a.xr, a.yh, t + 0.5], [a.xr, e, t]),
    h("router", ...s(r[2])),
    h("gate", ...s(r[4])),
    h("safe", ...s(r[5])),
    h("lb", ...s(r[6])),
    h(
      0,
      [-24, e, t],
      [-24, e, ro[0]],
      [-23.6, o, ro[0]],
      [c, o, ro[0]],
      [c, o - 0.28, ro[0] - 0.2],
      [c, n + 1.1, ro[0] - 0.34],
      [c, n + 0.36, ro[0] - 0.5],
      [c, n + 0.36, Xe.z + 0.2],
    ),
    h("rack", [c + 0.05, n + 0.02, Xe.z + 0.27]),
    h(
      0,
      [Xe.x - 0.56, No - 0.2, Xe.z + 0.27],
      [Xe.x - 0.56, Po(qo.S3[0]) + 0.1, Xe.z + 0.27],
      i([0.42, 0.06, 0.2]),
      i([0.25, xt + 0.03, 0.2]),
      i([0.25, xt + 0.03, 0]),
      i([-0.2, xt + 0.04, 0]),
      i([-0.2, xt + 0.04, qt.z]),
      i([qt.x + 0.03, Ko + 0.012, qt.z]),
      i([qt.x, Ko + 0.0035, qt.z]),
    ));
  const m = Kc(f, 0.18),
    p = m.mark,
    x = {
      corner: p[d.corner],
      router: p[d.router],
      gate: p[d.gate],
      safe: p[d.safe],
      lb: p[d.lb],
      rack: p[d.rack],
      end: m.len,
    },
    w = {
      uHead: { value: -9 },
      uTrail: { value: 2 },
      uOn: { value: 0 },
      uWide: { value: 0 },
      uCol: { value: new l.Color("#ffb454").multiplyScalar(2.6) },
    },
    g = new l.ShaderMaterial({
      uniforms: w,
      transparent: !0,
      depthWrite: !1,
      blending: l.AdditiveBlending,
      vertexShader:
        "attribute float aS;uniform float uWide;varying float vS;varying vec3 vN;varying vec3 vV;void main(){vS=aS;vec4 mv=modelViewMatrix*vec4(position+normal*uWide,1.);vN=normalMatrix*normal;vV=-mv.xyz;gl_Position=projectionMatrix*mv;}",
      fragmentShader:
        "uniform float uHead;uniform float uTrail;uniform float uOn;uniform vec3 uCol;varying float vS;varying vec3 vN;varying vec3 vV;void main(){float d=uHead-vS;float a=d>=0.?exp(-d/max(uTrail,1e-3)):exp(d/max(uTrail*.05,1e-3));a*=step(-uTrail,d);float f=abs(dot(normalize(vN),normalize(vV+1e-5)));gl_FragColor=vec4(uCol*a*uOn*(.25+1.1*f*f),1.);}",
    }),
    u = new l.Mesh(Yc(m, 0.0035), g);
  ((u.frustumCulled = !1), (u.renderOrder = 3), pe.add(u), ze.push(u));
  const y = new l.MeshBasicMaterial({
      map: jr,
      color: new l.Color("#ffb454").multiplyScalar(2.2),
      transparent: !0,
      depthWrite: !1,
      blending: l.AdditiveBlending,
      fog: !1,
    }),
    b = new l.Mesh(new l.PlaneGeometry(1, 1), y);
  ((b.renderOrder = 4), pe.add(b), ze.push(b));
  const M = new l.Mesh(new l.SphereGeometry(1, 12, 8), Ke("#ffd7a0", 3.2));
  (pe.add(M), ze.push(M));
  const T = qe(0, -99, 0, "#ffb870", 2.6, 0);
  return {
    path: m,
    S: x,
    U: w,
    tube: u,
    head: b,
    core: M,
    L: T,
    K: () => {
      const C = k,
        R = C.gate,
        z = C.lb,
        I = C.admit;
      return [
        [C.arrive - 9, 0],
        [C.arrive - 3.6, x.corner],
        [C.arrive, x.router],
        [C.arrive + 0.6, x.router],
        [R, x.gate],
        [R + 1.4, x.gate],
        [R + 2.6, x.safe],
        [C.safe, x.safe],
        [z, x.lb],
        [z + 0.46 * (I - z), x.rack],
        [I, x.end],
      ];
    },
    pos: new l.Vector3(),
    on: 0,
  };
})();
function jc(e) {
  const t = Fa.K();
  if (e <= t[0][0]) return -1;
  for (let n = 1; n < t.length; n++)
    if (e <= t[n][0]) {
      const [s, r] = t[n - 1],
        [a, o] = t[n];
      return Ut(r, o, oe(s, a, e));
    }
  return Fa.S.end;
}
{
  const e = We(
      256,
      256,
      (n, s, r) => {
        const a = n.createLinearGradient(0, 0, s, 0);
        (a.addColorStop(0, "rgba(0,0,0,0)"),
          a.addColorStop(0.28, "rgba(255,255,255,1)"),
          a.addColorStop(0.8, "rgba(255,255,255,1)"),
          a.addColorStop(1, "rgba(0,0,0,0)"),
          (n.fillStyle = a),
          n.fillRect(0, 0, s, r),
          (n.globalCompositeOperation = "destination-in"));
        const o = n.createLinearGradient(0, 0, 0, r);
        (o.addColorStop(0, "rgba(0,0,0,0)"),
          o.addColorStop(0.35, "rgba(0,0,0,1)"),
          o.addColorStop(0.75, "rgba(0,0,0,1)"),
          o.addColorStop(1, "rgba(0,0,0,0)"),
          (n.fillStyle = o),
          n.fillRect(0, 0, s, r));
      },
      !1,
    ),
    t = new l.MeshBasicMaterial({
      map: e,
      color: new l.Color(0.11, 0.155, 0.23),
      transparent: !0,
      depthWrite: !1,
      blending: l.AdditiveBlending,
      fog: !1,
      side: l.DoubleSide,
    });
  for (const [n, s] of [
    [2.9, 1],
    [4.2, 0.5],
  ]) {
    const r = new l.Mesh(
      new l.PlaneGeometry(Be.x1 - xe.x1 - 0.8, 18.5),
      t.clone(),
    );
    (r.material.color.multiplyScalar(s),
      (r.rotation.x = -Math.PI / 2),
      r.position.set((xe.x1 + Be.x1) / 2, n, 7),
      (r.renderOrder = 2),
      pe.add(r),
      ze.push(r),
      et.push(r),
      (pe.userData.airs = (pe.userData.airs || []).concat(r)));
  }
}
{
  const e = pe.position.x;
  for (const [t, n] of [
    [-12, 10],
    [6, 10],
    [22, 10],
    [-12, -8],
    [8, -8],
    [24, -8],
  ])
    qe(e + t, 3.4, n, "#cfe4ff", 12, 0.55);
  (qe(e - 29, 3.6, 14.5, "#d6e8ff", 7, 0.7),
    qe(e - 29, 2.2, 12, "#9fd8ff", 4, 0.35),
    qe(e - 29, 3.4, 3.4, "#ffcf94", 8, 0.7),
    qe(e - 37.5, 3.2, 3.5, "#ffcf94", 4, 0.8),
    (pe.userData.work = qe(
      e + Xe.x - 1.2,
      2.2,
      Xe.z + 0.7,
      "#e2eeff",
      3.2,
      1.1,
    )),
    qe(e + Xe.x - 1.6, 1.4, Xe.z - 1.2, "#8fd6ff", 2.4, 0.5),
    qe(e + Xe.x - 0.9, 1.5, Xe.z + 1.6, "#ffd0a0", 2.2, 0.55),
    (pe.userData.warm = qe(
      e + Xe.x - 1.25,
      io.position.y + 0.28,
      Xe.z + 0.42,
      "#ffc98c",
      0.95,
      1.3,
    )));
}
{
  const e = Sn.userData.door,
    t = Mn - 0.03,
    n = Pt();
  (n.box(v.char, t / 2, 0.56, -0.006, t - 0.02, 0.085, 0.028), n.flush(e));
  const s = ti(0.36);
  (s.position.set(t / 2, 0.56, -0.0215),
    (s.rotation.y = Math.PI),
    e.add(s),
    (pe.userData.mark = s));
}
const go = (() => {
    const e = io.position,
      t = re(e.x + qt.x, e.y + Ko + 0.0029, e.z + qt.z);
    return {
      door: [He.check[0], 0, He.check[2]],
      hall: [(Ct(0) - 0.6 + Ct(9) + 3) / 2, 1.6, 0.3],
      rack: [Xe.x, 1.15, Xe.z],
      server: [e.x, e.y + 0.06, e.z],
      gpu: t.toArray(),
      fibre: [hn.wall.x, hn.wall.y, hn.wall.z],
      hbm: [t.x - 0.019, t.y - 1e-5, t.z],
    };
  })(),
  ns = {
    outside: () => ({
      set: "dc",
      t: [6, 3, 0],
      yaw: -0.56,
      pitch: 0.25,
      dist: 122,
      r: 70,
      f: [-2, 3, 4],
    }),
    door: () => ({
      set: "dc",
      t: [go.door[0], 1.45, go.door[2] - 0.6],
      yaw: -0.2,
      pitch: 0.07,
      dist: 10.5,
      r: 5.5,
    }),
    hall: () => ({
      set: "dc",
      t: [Ct(0) + 3.9, 1.3, 7],
      yaw: -0.02,
      pitch: 0.065,
      dist: 13,
      r: 7,
      f: [Ct(0) + 3.9, 1.3, 6],
    }),
    rack: () => ({
      set: "dc",
      t: [Xe.x - 0.75, 1.15, Xe.z - 0.2],
      yaw: -0.5,
      pitch: 0.16,
      dist: 4.4,
      r: 1.4,
    }),
    server: () => ({
      set: "dc",
      t: [go.server[0] - 0.06, go.server[1] + 0.02, go.server[2] + 0.02],
      yaw: -0.5,
      pitch: 0.82,
      dist: 1.5,
      r: 0.45,
    }),
    gpu: () => ({
      set: "dc",
      t: go.gpu,
      yaw: -0.02,
      pitch: 1.02,
      dist: 0.112,
      r: 0.02,
    }),
  },
  xf = new l.Color();
function Zc(e, t) {
  const n = at;
  {
    const x = pe.userData.fans;
    (Da.forEach(([w, g, u, y, b], M) => {
      ($e.setFromAxisAngle(Zt, n * (1.6 + b * 0.8) + b * 6),
        ae.compose(os.set(w, g, u), $e, _s),
        x.setMatrixAt(M, ae));
    }),
      (x.instanceMatrix.needsUpdate = !0));
  }
  qc(n);
  {
    const x = oe(28, 70, Z.position.distanceTo(os.set(0, 4, 6)));
    for (const w of pe.userData.airs)
      ((w.visible = x > 0.01), (w.material.opacity = x));
  }
  const s = Fa,
    r = jc(e),
    a = Z.position.distanceTo(s.pos) || 10,
    o = r < 0 ? 0 : 1 - oe(k.admit - 0.1, k.admit, e);
  o > 0 && s.pos.copy(s.path.at(Math.min(r, s.path.len))).add(pe.position);
  const i = oe(20, 120, a);
  ((s.U.uHead.value = r),
    (s.U.uOn.value = o * (1 + 2.2 * i)),
    (s.U.uTrail.value = U(a * 0.04, 0.08, 4)),
    (s.U.uWide.value = U(a * a * 16e-6 + a * 5e-4, 0, 0.22)));
  const c =
    U(a * 0.016, 0.003, 2.4) * (1 + 0.12 * Math.sin(n * 9)) * (1 + 0.35 * i);
  ((s.head.visible = s.core.visible = o > 0.01),
    s.head.position.copy(s.pos).sub(pe.position),
    s.head.quaternion.copy(Z.quaternion),
    s.head.scale.setScalar(c * o),
    s.head.material.color.setRGB(1, 0.71, 0.33).multiplyScalar(2.2 + 3 * i),
    s.core.position.copy(s.head.position),
    s.core.scale.setScalar(Math.max(c * 0.05, 0.0025)),
    s.L.p.copy(s.pos),
    (s.L.i = 1.6 * o));
  {
    const x = k,
      w = R0,
      g = He.first,
      u = [
        [2, x.arrive - 0.3, x.gate],
        [4, x.gate, x.gate + 2.2],
        [5, x.gate + 2.2, x.safe + 0.2],
        [6, x.safe, x.lb + 0.3],
      ];
    let y = !1;
    for (const [b, M, T] of u) {
      const S = oe(M - 0.3, M + 0.2, e) * (1 - oe(T - 0.1, T + 0.4, e));
      Math.abs(w.getZ(g + b) - S) > 0.01 && (w.setZ(g + b, S), (y = !0));
    }
    y && (w.needsUpdate = !0);
  }
  const f = k.steps[0],
    d = oe(f.t0 - 0.12, f.t0, e) * (1 - oe(k.end, k.end + 3, e)),
    h = wo(e),
    m =
      h >= 0 && h < k.steps.length
        ? (e - k.steps[h].t0) / (k.steps[h].t1 - k.steps[h].t0)
        : 0,
    p = 0.28 + 0.72 * d * (0.8 + 0.2 * Math.sin(m * Math.PI));
  (ki.color.setRGB(0.35, 0.85, 1.5).multiplyScalar(p * 0.7),
    (ie.die.emissiveIntensity = 0.16 + 0.4 * p),
    (ie.hbmSide.emissiveIntensity = 0.8 * p),
    (ui.uRack.value.y = 0.7 + 0.3 * d));
}
const vo = new l.Group();
(vo.position.set(Re.stage, 0, 0), Yn.add(vo));
{
  const e = new l.Mesh(
    new l.PlaneGeometry(240, 240),
    Qn("#0c1426", { k: 0.8, roughness: 0.3, metalness: 0.45, blur: 1.2 }),
  );
  ((e.rotation.x = -Math.PI / 2), vo.add(e), et.push(e));
  const t = Pt();
  (t.box(Uo("#121a2c", { roughness: 0.3 }), 0, 0.16, 0, 15, 0.32, 6.4, {
    r: 0.08,
  }),
    t.box(Uo("#0d1322", { roughness: 0.34 }), 0, 0.36, 0, 14.4, 0.08, 5.8, {
      r: 0.03,
    }),
    t.box(Ke("#ffb454", 1.5), 0, 0.325, 3.21, 15, 0.018, 0.018),
    t.box(Ke("#7fe3ff", 1.4), 0, 0.325, -3.21, 15, 0.014, 0.014),
    t.box(kn, -4.05, 1.3, -1.25, 0.05, 2.2, 0.05, { rx: -0.12 }),
    t.box(kn, 4.05, 1.3, -1.25, 0.05, 2.2, 0.05, { rx: -0.12 }),
    t.box(Ra, 0, 0.45, -1.1, 8.4, 0.1, 0.5, { r: 0.03 }),
    t.flush(vo));
  for (let n = 0; n < 3; n++) {
    const s = qe(
      Re.stage + (n - 1) * 6,
      4,
      4,
      n === 1 ? "#ffd9b0" : "#8fd0ff",
      9,
      n === 1 ? 1.2 : 0.8,
    );
  }
}
const lo = { w: 8, h: 4.5, cw: 2400, ch: 1350 },
  A0 = document.createElement("canvas");
((A0.width = lo.cw), (A0.height = lo.ch));
const Ti = A0.getContext("2d"),
  P0 = new l.CanvasTexture(A0);
((P0.colorSpace = l.SRGBColorSpace), (P0.anisotropy = 8));
const Tn = new l.Mesh(
  new l.PlaneGeometry(lo.w, lo.h),
  new l.MeshBasicMaterial({
    map: P0,
    transparent: !0,
    color: new l.Color(0.95, 0.95, 0.95),
    fog: !1,
    depthWrite: !0,
  }),
);
(Tn.position.set(0, 2.45, -1.3),
  (Tn.rotation.x = -0.12),
  vo.add(Tn),
  ze.push(Tn));
const I0 = new l.Mesh(
  new l.BoxGeometry(lo.w + 0.2, lo.h + 0.2, 0.04),
  new l.MeshPhysicalMaterial({
    color: "#0a1020",
    roughness: 0.08,
    metalness: 0.1,
    transparent: !0,
    opacity: 0.72,
    envMapIntensity: 1.2,
    clearcoat: 1,
  }),
);
(I0.position.set(0, 2.45, -1.34), (I0.rotation.x = -0.12), vo.add(I0));
const Cn = [],
  Io = 46,
  L0 = 86,
  ss = 90,
  Qc = 150;
function Jc() {
  Cn.length = 0;
  const e = Ti;
  let t = ss,
    n = Qc;
  const s = lo.cw - 90;
  for (let r = 0; r < ue; r++) {
    const a = Ae[r];
    let o = a.t,
      i;
    if (a.role === "hist") {
      if (r !== Is) {
        Cn.push(null);
        continue;
      }
      o = "\u2026 20,000 tokens of earlier chat \u2026";
    }
    const c = a.role === "mark" && o.startsWith("<|");
    e.font = `${c ? 500 : 400} ${c ? Io * 0.72 : Io}px DM Mono, monospace`;
    const f = o.replace(/\n/g, "");
    ((i = e.measureText(f).width + (c ? 26 : 0)),
      t + i > s && t > ss && ((t = ss), (n += L0)),
      Cn.push({ x: t, y: n, w: i, t: f, mark: c, role: a.role }),
      (t += i + (c ? 10 : 0)));
    const d = (o.match(/\n/g) || []).length;
    (d && ((t = ss), (n += L0 * Math.min(d, 1) + (d > 1 ? L0 * 0.45 : 0))),
      a.role === "mark" && o === "<|end|>" && ((t = ss), (n += L0 * 0.7)));
  }
}
function e1(e, t, n) {
  const s = Ti,
    r = lo.cw,
    a = lo.ch;
  (s.clearRect(0, 0, r, a),
    (s.fillStyle = "rgba(9,14,26,.9)"),
    lt(s, 0, 0, r, a, 36),
    s.fill(),
    (s.font = "600 30px Outfit, sans-serif"),
    (s.fillStyle = "#7f89a6"),
    (s.letterSpacing = "4px"),
    s.fillText("WHAT THE MODEL READS", ss, 78),
    (s.letterSpacing = "0px"));
  const o = (i) =>
    e >= 4 ||
    (i === "sys" && e >= 1) ||
    (i === "dev" && e >= 2) ||
    ((i === "user" || i === "hist") && e >= 3) ||
    i === "mark";
  if (
    (Cn.forEach((i, c) => {
      if (!i || n > c) return;
      const f = o(i.role),
        d = cn[i.role].c;
      if (
        (i.mark
          ? ((s.fillStyle = f ? "#2a3144" : "#1a2030"),
            lt(s, i.x, i.y - Io * 0.62, i.w, Io * 1.02, 12),
            s.fill(),
            (s.font = `500 ${Io * 0.72}px DM Mono, monospace`),
            (s.fillStyle = f ? "#c3c9d8" : "#5d6478"),
            s.fillText(i.t, i.x + 13, i.y + 2))
          : ((s.font = `400 ${Io}px DM Mono, monospace`),
            (s.fillStyle = f ? d : "#3a4256"),
            s.fillText(i.t, i.x, i.y)),
        t > 0)
      ) {
        const h = U(t * 1.4 - (c / ue) * 0.4, 0, 1);
        h > 0 &&
          ((s.fillStyle = `rgba(255,210,122,${h * 0.95})`),
          s.fillRect(
            i.x + i.w + (i.mark ? 3 : 1),
            i.y - Io * 0.78,
            3,
            Io * 1.1,
          ));
      }
    }),
    e >= 4)
  ) {
    const i = Cn[ue - 1];
    i &&
      n < ue &&
      ((s.fillStyle = Math.sin(at * 5) > 0 ? "#7fe3ff" : "#7fe3ff44"),
      s.fillRect(i.x + i.w + 14, i.y - Io * 0.72, 6, Io * 0.95));
  }
  P0.needsUpdate = !0;
}
const Rn = 384,
  Es = 128,
  Fn = 6,
  Ga = 20,
  as = document.createElement("canvas");
((as.width = Rn * Fn), (as.height = Es * Ga));
const Ci = as.getContext("2d"),
  B0 = new l.CanvasTexture(as);
((B0.colorSpace = l.SRGBColorSpace), (B0.anisotropy = 8));
const Ds = new Map();
function t1(e) {
  const t = Ae[e],
    n = t.t + "|" + t.id + "|" + t.role;
  if (Ds.has(n)) return Ds.get(n);
  const s = Ds.size;
  if (s >= Fn * Ga) return 0;
  Ds.set(n, s);
  const r = (s % Fn) * Rn,
    a = Math.floor(s / Fn) * Es,
    o = Ci;
  (o.clearRect(r, a, Rn, Es),
    (o.fillStyle = "#0d1322"),
    lt(o, r + 4, a + 4, Rn - 8, Es - 8, 20),
    o.fill(),
    (o.fillStyle = cn[t.role].c),
    lt(o, r + 4, a + Es - 14, Rn - 8, 10, 5),
    o.fill());
  const i = t.role === "hist" ? "20,000 earlier" : bt(t.t);
  let c = 48;
  for (
    o.font = `500 ${c}px DM Mono, monospace`;
    o.measureText(i).width > Rn - 40 && c > 18;
  )
    ((c -= 2), (o.font = `500 ${c}px DM Mono, monospace`));
  return (
    (o.fillStyle = t.role === "mark" ? "#b4bccd" : "#f5f8ff"),
    (o.textAlign = "center"),
    (o.textBaseline = "middle"),
    o.fillText(i, r + Rn / 2, a + 46),
    (o.font = "400 26px DM Mono, monospace"),
    (o.fillStyle = "#8f99b6"),
    o.fillText(
      t.id >= 0 ? t.id.toLocaleString("en") : "\xD7 20,000",
      r + Rn / 2,
      a + 92,
    ),
    (o.textAlign = "left"),
    (B0.needsUpdate = !0),
    s
  );
}
const o1 = _n(1, 1, 1, 0.06),
  rs = new l.InstancedMesh(
    o1,
    new l.MeshStandardMaterial({
      color: "#0e1424",
      roughness: 0.3,
      metalness: 0.3,
    }),
    160,
  );
((rs.count = 0), (rs.castShadow = !0), vo.add(rs));
const Ri = new l.PlaneGeometry(1, 1),
  Va = new l.InstancedBufferAttribute(new Float32Array(320), 2);
Ri.setAttribute("aCell", Va);
const n1 = new l.ShaderMaterial({
    uniforms: { map: { value: B0 }, uK: { value: 1 } },
    vertexShader: `attribute vec2 aCell;varying vec2 vUv;
 void main(){vUv=vec2((aCell.x+uv.x)/${Fn}.,1.-(aCell.y+1.-uv.y)/${Ga}.);gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform sampler2D map;uniform float uK;varying vec2 vUv;void main(){vec4 c=texture2D(map,vUv);if(c.a<.5)discard;gl_FragColor=vec4(c.rgb*uK,1.);
 #include <colorspace_fragment>
 }`,
  }),
  is = new l.InstancedMesh(Ri, n1, 160);
((is.count = 0), vo.add(is), ze.push(is));
const co = { w: 0.66, h: 0.22, d: 0.08, per: 14, gx: 0.06, gy: 0.1 };
let $a = "";
function s1() {
  (Jc(), Ds.clear(), Ci.clearRect(0, 0, as.width, as.height), ($a = ""));
  let e = 0;
  for (let t = 0; t < ue; t++) {
    if (!Cn[t]) continue;
    const n = t1(t);
    (Va.setXY(e, n % Fn, Math.floor(n / Fn)), e++);
  }
  Va.needsUpdate = !0;
}
const Wa = new l.Vector3(),
  Oa = new l.Vector3(),
  _0 = new l.Vector3();
function a1(e, t) {
  const n = Cn[e],
    s = (n.x + n.w / 2) / lo.cw - 0.5,
    r = 0.5 - (n.y - Io * 0.25) / lo.ch;
  return (
    t
      .set(s * lo.w, r * lo.h, 0.05)
      .applyEuler(Tn.rotation)
      .add(Tn.position),
    t
  );
}
function r1(e, t) {
  const n = Math.floor(e / co.per),
    s = e % co.per;
  return t.set(
    (s - (co.per - 1) / 2) * (co.w + co.gx),
    0.62 + n * 0 + 0,
    0.8 + n * (co.h + co.gy) * 1.35,
  );
}
function i1(e, t) {
  const n = Y[Ee].c,
    s = U((t - Y[Ee].t0) / n.dur, 0, 1),
    r = n.id;
  f1(r === "embed" ? U(s / 0.62, 0, 1) : -1);
  let a = 4,
    o = 0,
    i = 0;
  r === "template"
    ? (a = Math.floor(U(s * 5.2, 0, 4.99)))
    : r === "tokens"
      ? ((o = oe(0.02, 0.3, s)), (i = oe(0.3, 0.8, s)))
      : ((a = 4), (i = 1));
  const c = Cn.map((m, p) => (m ? p : -1)).filter((m) => m >= 0),
    f = Math.floor(i * c.length * 1.25),
    d =
      a +
      "|" +
      o.toFixed(2) +
      "|" +
      Math.min(f, c.length) +
      "|" +
      (a >= 4 ? Math.sin(at * 5) > 0 : 0);
  d !== $a &&
    (($a = d),
    e1(
      a,
      o,
      i > 0
        ? c[Math.min(Math.max(f - 1, 0), c.length - 1)] + (f > 0 ? 1 : 0)
        : -1,
    ));
  let h = 0;
  for (const m of c) {
    const p = U(i * 1.25 - (h / c.length) * 0.25, 0, 1) * (i > 0 ? 1 : 0);
    if (p <= 0) {
      h++;
      continue;
    }
    (a1(m, Wa), r1(h, Oa));
    const x = Dr(p);
    (_0.lerpVectors(Wa, Oa, x), (_0.y += Math.sin(Math.PI * x) * 1.1));
    const w = Ae[m],
      g = w.role === "hist" ? 2.2 : 1,
      u = Ut(Tn.rotation.x, -1.15, x);
    ($e.setFromEuler(v0.set(u, 0, 0, "YXZ")),
      ae.compose(_0, $e, Nt.set(co.w * g, co.h, co.d)),
      rs.setMatrixAt(h, ae),
      ae.compose(
        Wa.copy(_0).add(Oa.set(0, 0, co.d / 2 + 0.004).applyQuaternion($e)),
        $e,
        Nt.set(co.w * g * 0.96, co.h * 0.92, 1),
      ),
      is.setMatrixAt(h, ae),
      h++);
  }
  ((rs.count = is.count = h),
    (rs.instanceMatrix.needsUpdate = !0),
    (is.instanceMatrix.needsUpdate = !0));
}
const Yo = new l.Group();
(vo.add(Yo), (Yo.visible = !1));
const we = { w: 5.4, h: 5.2, d: 1.1, y0: 0.42, z: -1.45 };
{
  const e = We(512, 1024, (a, o, i) => {
      ((a.fillStyle = "#07101d"), a.fillRect(0, 0, o, i));
      const c = ye(5);
      for (let f = 0; f < i; f += 2) {
        const d = 0.12 + c() * 0.25;
        ((a.fillStyle = `rgba(${(90 + c() * 60) | 0},${(150 + c() * 60) | 0},${(210 + c() * 40) | 0},${d})`),
          a.fillRect(0, f, o, 1));
      }
    }),
    t = new l.Mesh(
      new f0(we.w, we.h, we.d, 3, 0.06).translate(0, we.h / 2 + we.y0, we.z),
      new l.MeshPhysicalMaterial({
        color: "#0b1626",
        roughness: 0.08,
        metalness: 0.2,
        transparent: !0,
        opacity: 0.9,
        envMapIntensity: 1.3,
        clearcoat: 1,
        emissive: new l.Color("#5aa8e8"),
        emissiveMap: e,
        emissiveIntensity: 0.7,
      }),
    );
  ((t.castShadow = !0), Yo.add(t));
  const n = Pt();
  (n.box(
    Ke("#7fe3ff", 1.5),
    0,
    we.y0 + we.h + 0.01,
    we.z + we.d / 2,
    we.w,
    0.02,
    0.02,
  ),
    n.box(kn, 0, we.y0 - 0.04, we.z, we.w + 0.3, 0.08, we.d + 0.3),
    n.flush(Yo, !1));
  const s = ln(
    0.9,
    we.h,
    160,
    960,
    (a, o, i) => {
      ((a.font = "500 30px DM Mono, monospace"),
        (a.fillStyle = "#8fb8e0"),
        (a.textAlign = "right"));
      for (let c = 0; c <= 4; c++) {
        const f = Math.round((c / 4) * 201087),
          d = i - (c / 4) * (i - 40) - 20;
        (a.fillText(f.toLocaleString("en"), o - 16, d + 10),
          a.fillRect(o - 10, d, 10, 2));
      }
    },
    0.9,
  );
  (s.position.set(-we.w / 2 - 0.5, we.y0 + we.h / 2, we.z + we.d / 2),
    Yo.add(s));
  const r = ln(
    we.w,
    0.5,
    1600,
    150,
    (a, o, i) => {
      ((a.font = "600 60px Outfit, sans-serif"),
        (a.fillStyle = "#e6f6ff"),
        (a.textAlign = "center"),
        (a.textBaseline = "middle"),
        a.fillText("THE EMBEDDING TABLE", o / 2, 50),
        (a.font = "500 40px DM Mono, monospace"),
        (a.fillStyle = "#8fd8ff"),
        a.fillText("201,088 rows \xB7 2,880 numbers in each", o / 2, 112));
    },
    0.95,
  );
  (r.position.set(0, we.y0 + we.h + 0.42, we.z + we.d / 2), Yo.add(r));
}
const l1 = We(1024, 16, (e, t, n) => {
    const s = ye(9);
    for (let r = 0; r < t; r += 4) {
      const a = s() * 2 - 1,
        o = Math.abs(a);
      ((e.fillStyle =
        a > 0
          ? `rgba(255,${(170 - o * 50) | 0},80,${0.35 + o * 0.65})`
          : `rgba(${(110 - o * 40) | 0},210,255,${0.35 + o * 0.65})`),
        e.fillRect(r, 0, 3, n));
    }
  }),
  c1 = new l.MeshBasicMaterial({
    map: l1,
    color: new l.Color(1.15, 1.15, 1.15),
    fog: !1,
  }),
  dn = new l.InstancedMesh(new l.BoxGeometry(1, 1, 1), c1, 140);
((dn.count = 0), Yo.add(dn), ze.push(dn));
const Ua = [];
for (let e = 0; e < 6; e++) {
  const t = ln(1.5, 0.24, 600, 96, null, 0.95);
  ((t.visible = !1), Yo.add(t), Ua.push(t));
}
function f1(e) {
  const t = e >= 0;
  if (((Yo.visible = t), (Tn.visible = I0.visible = !t), !t)) return;
  let n = 0,
    s = 0;
  const r = [];
  for (let a = 0; a < ue; a++) Ae[a].role === "user" && r.push(a);
  for (let a = 0; a < ue && n < 140; a++) {
    const o = Ae[a];
    if (o.role === "hist" && a !== Is) continue;
    const i = o.role === "user",
      c = i ? 0.12 + r.indexOf(a) * 0.06 : 0.05 + (a / ue) * 0.3,
      f = U((e - c) / 0.22, 0, 1),
      d = we.y0 + 0.1 + (o.id >= 0 ? o.id / Me.vocab : 0.5) * (we.h - 0.2),
      h = (i ? 2.6 : 1.1) * gn(f),
      m = oe(0.78, 0.98, e),
      p = m * 14;
    if (
      (ae.compose(
        Nt.set(p, d, we.z + we.d / 2 - 0.06 + h),
        $e.identity(),
        new l.Vector3(we.w * 0.96, i ? 0.075 : 0.028, i ? 0.16 : 0.07),
      ),
      dn.setMatrixAt(n, ae),
      dn.setColorAt(n, Ps.set(cn[o.role].c).multiplyScalar(i ? 1.4 : 0.8)),
      n++,
      i && s < 6)
    ) {
      const x = r
          .slice()
          .sort((u, y) => Ae[u].id - Ae[y].id)
          .indexOf(a),
        w = Ua[s++];
      ((w.visible = f > 0.6 && m < 0.3),
        w.position.set(
          we.w / 2 + 1.55 + p,
          we.y0 + 0.55 + x * 0.36,
          we.z + we.d / 2 + h,
        ),
        (w.userData.from = [
          (we.w / 2) * 0.96 + p,
          d,
          we.z + we.d / 2 - 0.06 + h,
        ]),
        (w.userData.a = U((f - 0.6) / 0.3, 0, 1) * (1 - oe(0.2, 0.3, m))));
      const g = o.t + o.id;
      w.userData.k !== g &&
        ((w.userData.k = g),
        w.userData.redraw((u, y, b) => {
          ((u.fillStyle = "rgba(10,15,28,.9)"),
            lt(u, 0, 8, y, b - 16, 34),
            u.fill(),
            (u.font = "600 46px DM Mono, monospace"),
            (u.fillStyle = "#ffd9a3"),
            (u.textBaseline = "middle"),
            u.fillText(bt(o.t), 24, b / 2 + 2),
            (u.font = "500 34px DM Mono, monospace"),
            (u.fillStyle = "#9fb0d4"),
            (u.textAlign = "right"),
            u.fillText("row " + o.id.toLocaleString("en"), y - 24, b / 2 + 2));
        }));
    }
  }
  ((dn.count = n),
    (dn.instanceMatrix.needsUpdate = !0),
    dn.instanceColor && (dn.instanceColor.needsUpdate = !0));
}
function h1() {
  if (Yo.visible)
    for (const e of Ua) {
      if (!e.visible || !e.userData.from) continue;
      const t = e.userData.from;
      (po[0].set(t[0] + Re.stage, t[1], t[2]),
        po[1].set(e.position.x - 0.75 + Re.stage, e.position.y, e.position.z),
        Eo.line(po.slice(0, 2), 1.4, mn, () => e.userData.a * 0.8),
        zt.dot(po[0], gt(po[0], 6), mn, e.userData.a));
    }
}
const Kt = new l.Group();
(Kt.position.set(Re.city, 0, 0), Yn.add(Kt));
const Ha = 0.3,
  _t = 1.1,
  _e = 3.4,
  wt = 8,
  ht = 36,
  Rt = _e + ht * _t,
  nt = { w: 480, d: 400, z0: 70 },
  Na = We(2048, 1568, (e, t, n) => {
    ((e.fillStyle = "#07090f"), e.fillRect(0, 0, t, n));
    const s = ye(11),
      r = [
        [70, 860],
        [1188, 1978],
      ];
    for (const [a, o] of r)
      for (let i = 0; i < 4; i++) {
        const c = 70 + i * 365,
          f = c + 330;
        ((e.fillStyle = "#0c1019"),
          e.fillRect(a - 8, c - 8, o - a + 16, f - c + 16));
        for (let d = 0; d < 6; d++)
          for (let h = 0; h < 3; h++) {
            const m = a + d * ((o - a) / 6) + 6,
              p = c + h * 110 + 6,
              x = (o - a) / 6 - 12,
              w = 98;
            ((e.fillStyle = "#131a28"),
              e.fillRect(m, p, x, w),
              (e.fillStyle = "#1d2638"));
            for (let g = 0; g < 4; g++)
              e.fillRect(
                m + 6 + (g * (x - 12)) / 4,
                p + 8,
                (x - 12) / 4 - 5,
                w * 0.46,
              );
            ((e.fillStyle = "#232e44"),
              e.fillRect(m + 6, p + w * 0.62, x - 12, w * 0.3),
              (e.strokeStyle = "#34466a"),
              (e.lineWidth = 2),
              e.strokeRect(m + 1, p + 1, x - 2, w - 2));
          }
      }
    ((e.fillStyle = "#0d1320"), e.fillRect(900, 60, 248, n - 120));
    for (let a = 70; a < n - 70; a += 18)
      ((e.fillStyle = a % 36 ? "#141c2c" : "#18223a"),
        e.fillRect(910, a, 228, 12));
    for (let a = 0; a < 1400; a++) {
      const o = s() * t,
        i = s() * n,
        c = 20 + s() * 160,
        f = s() < 0.5;
      ((e.strokeStyle = `rgba(${(70 + s() * 50) | 0},${(110 + s() * 70) | 0},${(170 + s() * 70) | 0},${0.16 + s() * 0.24})`),
        (e.lineWidth = s() < 0.12 ? 3 : 1.4),
        e.beginPath(),
        e.moveTo(o, i),
        f ? e.lineTo(o, i + c) : e.lineTo(o + c, i),
        e.stroke());
    }
    ((e.strokeStyle = "#2a3550"),
      (e.lineWidth = 6),
      e.strokeRect(20, 20, t - 40, n - 40));
    for (let a = 40; a < t - 40; a += 14)
      ((e.fillStyle = "#1d2638"),
        e.fillRect(a, 26, 6, 10),
        e.fillRect(a, n - 36, 6, 10));
  });
Na.anisotropy = 16;
const Fs = Qn("#10151f", {
  roughness: 0.46,
  metalness: 0.5,
  env: 0.35,
  blur: 1.8,
  k: 0.7,
});
((Fs.map = Na),
  (Fs.emissiveMap = Na),
  (Fs.emissive = new l.Color("#6d9be6")),
  (Fs.emissiveIntensity = 1.6));
{
  const e = new l.Mesh(new l.PlaneGeometry(nt.w, nt.d), Fs);
  ((e.rotation.x = -Math.PI / 2),
    e.position.set(0, 0, nt.z0 - nt.d / 2),
    (e.receiveShadow = !0),
    Kt.add(e),
    et.push(e));
}
{
  const e = Pt();
  (e.box(
    se("#0a0d14", { roughness: 0.6 }),
    0,
    -0.6,
    nt.z0 - nt.d / 2,
    nt.w + 200,
    1.1,
    nt.d + 200,
  ),
    e.box(
      Le("#1a2230", { roughness: 0.3 }),
      0,
      -0.12,
      nt.z0 - nt.d / 2,
      nt.w + 8,
      0.2,
      nt.d + 8,
    ),
    e.flush(Kt, !1).forEach((t) => {
      ((t.receiveShadow = !0), et.push(t));
    }));
}
const Gs = [];
{
  const e = Pt(),
    t = Le("#12161f", { roughness: 0.34, metalness: 0.7 }),
    n = Le("#2a3346", { roughness: 0.3 });
  for (let s = 0; s < 6; s++) {
    const r = s < 3 ? -1 : 1,
      a = s % 3,
      o = r * (nt.w / 2 + 30),
      i = nt.z0 - nt.d / 2 + (a - 1) * 118,
      c = 40,
      f = 52,
      d = 96;
    e.box(t, o, f / 2, i, c, f, d, { r: 0.6 });
    for (let h = 1; h < 12; h++)
      e.box(n, o, (h * f) / 12, i, c + 0.3, 0.18, d + 0.3);
    Gs.push({ x: o, z: i, w: c, h: f, d, side: r, on: s !== 5 });
  }
  e.flush(Kt);
  for (const s of Gs) {
    const r = new l.Mesh(
      new l.BoxGeometry(s.w + 0.5, s.h * 0.985, s.d + 0.5),
      new l.MeshBasicMaterial({
        color: new l.Color(0.3, 0.9, 1.2),
        transparent: !0,
        opacity: 0,
        blending: l.AdditiveBlending,
        depthWrite: !1,
        fog: !1,
      }),
    );
    (r.position.set(s.x, s.h / 2, s.z),
      Kt.add(r),
      (s.glow = r),
      ze.push(r),
      et.push(r));
    const a = ln(
      26,
      3.2,
      1024,
      128,
      (o, i, c) => {
        ((o.font = "600 70px Outfit, sans-serif"),
          (o.fillStyle = s.on ? "#cfe6ff" : "#5d6780"),
          (o.textAlign = "center"),
          (o.textBaseline = "middle"),
          o.fillText(
            s.on ? "HBM3 \xB7 16 GB" : "HBM3 \xB7 unused",
            i / 2,
            c / 2,
          ));
      },
      0.95,
    );
    (a.position.set(s.x - s.side * (s.w / 2 + 0.05), s.h * 0.82, s.z),
      (a.rotation.y = (-s.side * Math.PI) / 2),
      Kt.add(a),
      (s.label = a));
  }
}
const Xa = 64,
  zi = new l.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
  qa = new l.InstancedBufferAttribute(new Float32Array(Xa * 4), 4);
zi.setAttribute("aT", qa);
const Ai = {
    uWave: { value: -1 },
    uFH: { value: _t },
    uLobby: { value: _e },
    uGrow: { value: 0 },
  },
  d1 = pt(
    new l.MeshStandardMaterial({
      color: "#0d1422",
      roughness: 0.18,
      metalness: 0.65,
      envMapIntensity: 1.1,
    }),
    Object.assign(
      (e) => {
        (Object.assign(e.uniforms, Ai),
          (e.vertexShader = e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
attribute vec4 aT;varying vec4 vT;varying vec3 vL;varying vec3 vN;varying vec3 vS;`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
vT=aT;vL=position;vN=normal;vS=vec3(instanceMatrix[0][0],instanceMatrix[1][1],instanceMatrix[2][2]);`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
uniform float uWave;uniform float uFH;uniform float uLobby;uniform float uGrow;varying vec4 vT;varying vec3 vL;varying vec3 vN;varying vec3 vS;
float oh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
// which part of its conversation a column holds: a header, then turns (you, sometimes its thinking, its answer), like ours
vec3 othRole(float ci,float sd){float x=40.+14.*oh(vec2(sd,1.));if(ci<x)return vec3(.62,.69,.88);
 for(int i=0;i<40;i++){float fi=float(i);float lu=5.+22.*oh(vec2(fi,sd+2.));if(ci<x+lu)return vec3(1.,.71,.33);x+=lu;
  float lt=oh(vec2(fi,sd+5.))<.5?0.:4.+14.*oh(vec2(fi,sd+3.));if(ci<x+lt)return vec3(.49,.94,.71);x+=lt;
  float la=16.+64.*oh(vec2(fi,sd+4.));if(ci<x+la)return vec3(.5,.89,1.);x+=la;}return vec3(.5,.89,1.);}`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
{ // windows on the long faces: columns = tokens, rows = floors; the lobby glows softly; the roof has a light line
 float y=vL.y*vS.y;float isSide=step(.5,abs(vN.z));float isEnd=step(.5,abs(vN.x));
 float u=(vL.x+.5)*vS.x;float cols=vT.x;float cw=vS.x/max(cols,1.);
 if(isSide>.5&&y>uLobby){float fl=(y-uLobby)/uFH;float fi=floor(fl);float ci=floor(u/cw);vec2 f=vec2(fract(u/cw),fract(fl));
  float pane=smoothstep(.06,.14,f.x)*smoothstep(.94,.86,f.x)*smoothstep(.08,.16,f.y)*smoothstep(.9,.82,f.y);
  float aa=clamp(max(fwidth(u/cw),fwidth(fl))*3.2-.3,0.,1.);pane=mix(pane,.62,aa);
  float on=step(fi,35.);vec3 tint=othRole(ci,vT.y);
  float lit=on*(.2+.1*oh(vec2(ci*1.7,fi+vT.y)));
  float newest=step(cols-1.,ci+.5+uGrow*0.)*step(ci,cols-.5);
  float wave=newest*smoothstep(1.4,0.,abs(fi+.5-uWave))*step(0.,uWave);
  totalEmissiveRadiance+=pane*(tint*lit*.9+vec3(.8,.95,1.2)*wave*4.)*(0.4+0.6*step(.5,vN.z));}
 if(y<uLobby&&y>.2&&(isSide>.5||isEnd>.5)){totalEmissiveRadiance+=vec3(.9,.8,.6)*.16*smoothstep(uLobby,.4,y);}
 if(abs(y-(uLobby+36.*uFH))<.12&&vN.y<.5)totalEmissiveRadiance+=vec3(.5,.9,1.2)*.9;}`,
            )));
      },
      { key: "oth" },
    ),
  ),
  un = new l.InstancedMesh(zi, d1, Xa);
((un.count = 0), (un.castShadow = !0), (un.receiveShadow = !0), Kt.add(un));
const jo = [];
{
  const e = ye(21);
  for (let t = 0; t < 6; t++)
    for (let n = -5; n <= 5; n++) {
      const s = -70 - t * 44 + (e() - 0.5) * 14,
        r = n * 44 + (t % 2 ? 22 : 0) + (e() - 0.5) * 14;
      (Math.abs(r) < 52 && t < 1) ||
        Math.abs(r) > nt.w / 2 - 30 ||
        s < -nt.d + 90 ||
        jo.push({
          x: r,
          z: s,
          rot: e() < 0.22 ? Math.PI / 2 : 0,
          cols: 40 + Math.floor(Math.pow(e(), 1.7) * 2600),
          seed: e() * 100,
          near: Math.hypot(r * 0.8, s + 20),
        });
    }
  for (const t of [-1, 1])
    for (let n = 0; n < 2; n++)
      jo.push({
        x: t * (96 + n * 40),
        z: -20 - n * 22,
        rot: 0,
        cols: 80 + Math.floor(e() * 500),
        seed: e() * 100,
        near: Math.hypot(t * (96 + n * 40), 20),
      });
  jo.sort((t, n) => t.near - n.near);
}
function u1(e) {
  ((e = Math.min(e, Xa, jo.length)), (un.count = e));
  for (let t = 0; t < e; t++) {
    const n = jo[t],
      s = U(6 + Math.sqrt(n.cols) * 0.78, 9, 38);
    ((n.w = s),
      ae.compose(
        Nt.set(n.x, 0, n.z),
        $e.setFromAxisAngle(Zt, n.rot),
        new l.Vector3(s, Rt, wt),
      ),
      un.setMatrixAt(t, ae),
      qa.setXYZW(t, Math.round(s / Ha), n.seed, 0, 0));
  }
  ((un.instanceMatrix.needsUpdate = !0),
    (qa.needsUpdate = !0),
    un.computeBoundingSphere());
}
const wf = [
  qe(Re.city - 60, 6, 20, "#7fd8ff", 70, 1.2),
  qe(Re.city + 60, 6, 10, "#ffb46a", 70, 1),
  qe(Re.city, 34, 6, "#bcd2ff", 50, 0.8),
];
{
  const t = new Float32Array(4800),
    n = ye(33);
  for (let o = 0; o < 1600; o++)
    ((t[o * 3] = (n() - 0.5) * 260),
      (t[o * 3 + 1] = n() * 60),
      (t[o * 3 + 2] = 40 - n() * 260));
  const s = new l.BufferGeometry();
  s.setAttribute("position", new l.BufferAttribute(t, 3));
  const r = new l.ShaderMaterial({
      uniforms: { uT: Ms.uT, uPx: { value: 1 } },
      transparent: !0,
      depthWrite: !1,
      blending: l.AdditiveBlending,
      vertexShader: `uniform float uT;varying float vA;void main(){vec3 p=position;p.x+=sin(uT*.07+position.z*.05)*3.;p.y+=sin(uT*.05+position.x*.04)*2.;p.z+=cos(uT*.06+position.y*.1)*3.;
   vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;gl_PointSize=clamp(90./d,1.,7.);vA=clamp(1.2-d/220.,0.,1.)*.55;}`,
      fragmentShader:
        "varying float vA;void main(){vec2 c=gl_PointCoord-.5;float a=exp(-dot(c,c)*14.)*vA;gl_FragColor=vec4(vec3(.55,.8,1.)*a,1.);}",
    }),
    a = new l.Points(s, r);
  ((a.frustumCulled = !1), Kt.add(a), ze.push(a), et.push(a));
}
const fo = new l.Group();
Kt.add(fo);
const pn = 512;
let Et = Ha,
  je = 0,
  to = 0,
  oo = 0;
const Pi = { mark: 0, sys: 1, dev: 2, user: 3, hist: 4, think: 5, answer: 6 },
  p1 = Object.keys(Pi).map((e) => new l.Color(cn[e].c)),
  Vs = new Uint8Array(pn * ht * 4),
  $s = new l.DataTexture(Vs, pn, ht, l.RGBAFormat);
(($s.magFilter = $s.minFilter = l.NearestFilter), ($s.needsUpdate = !0));
const Ii = {
    tState: { value: $s },
    uBuilt: { value: 1 },
    uRoleCol: { value: p1.map((e) => new l.Vector3(e.r, e.g, e.b)) },
    uTwT: { value: 0 },
    uLitK: { value: 1 },
  },
  Li = (e) =>
    pt(
      new l.MeshStandardMaterial({
        color: "#0b111d",
        roughness: 0.12,
        metalness: 0.7,
        envMapIntensity: 1.25,
        side: l.FrontSide,
      }),
      Object.assign(
        (t) => {
          (Object.assign(t.uniforms, Ii, e),
            (t.vertexShader = t.vertexShader
              .replace(
                "#include <common>",
                `#include <common>
varying vec2 vFacUv;`,
              )
              .replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
vFacUv=uv;`,
              )),
            (t.fragmentShader = t.fragmentShader
              .replace(
                "#include <common>",
                `#include <common>
varying vec2 vFacUv;uniform sampler2D tState;uniform float uBuilt;uniform float uF0;uniform float uFn;uniform vec3 uRoleCol[7];uniform float uTwT;uniform float uLitK;
float th(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}`,
              )
              .replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
{vec2 q=vec2(vFacUv.x*uBuilt,uF0+vFacUv.y*uFn);vec2 ci=floor(q),f=fract(q);
 vec4 st=texture2D(tState,(ci+.5)/vec2(${pn}.,36.));
 vec3 rc=uRoleCol[int(st.a*255./32.+.5)];
 float pane=smoothstep(.04,.1,f.x)*smoothstep(.96,.9,f.x)*smoothstep(.06,.14,f.y)*smoothstep(.9,.82,f.y);
 float aa=clamp(max(fwidth(q.x),fwidth(q.y))*3.2-.3,0.,1.);pane=mix(pane,.68,aa);                 // far away the grid melts into its average instead of shimmering
 float room=mix(.72+.38*smoothstep(.2,.9,f.y)+.12*th(ci),.9,aa);                                         // a lit room is brighter under its ceiling
 vec3 tint=rc*mix(.84,1.1,th(ci+7.3));
 // inside each pane, the token's numbers at this floor: 14 thin bars, warm or cool by sign, brightness by size (illustrative), melting into the role colour far away
 float bi=floor(f.x*14.);float bv=th(vec2(ci.x*7.13+bi*1.7,ci.y*3.31+bi*.37))*2.-1.;
 vec3 bars=mix(vec3(.45,.8,1.1),vec3(1.1,.7,.38),step(0.,bv))*(.35+.8*abs(bv));
 float bk=clamp(1.2-fwidth(q.x)*14.*1.6,0.,1.)*(1.-aa)*.55;tint=mix(tint,mix(tint,bars,.6),bk)*(1.-bk*.18*step(.82,fract(f.x*14.)));
 float lit=st.r*uLitK,wave=st.g,hi=st.b;
 totalEmissiveRadiance+=pane*(tint*room*(lit*.56)+mix(rc*1.2,vec3(.55,.9,1.25),.5)*wave*1.25+vec3(1.,.86,.55)*hi*2.2);
 diffuseColor.rgb*=1.-pane*.35;}`,
              )));
        },
        { key: "fac" },
      ),
    ),
  ho = { L: 35, g: 0, at: -1, ag: -1 },
  E0 = new l.Group(),
  Gn = new l.Group();
fo.add(E0, Gn);
const Ka = { uF0: { value: 0 }, uFn: { value: 36 } },
  Ya = { uF0: { value: 36 }, uFn: { value: 0 } },
  Vn = new l.Mesh(new l.PlaneGeometry(1, 1).translate(0.5, 0.5, 0), Li(Ka)),
  $n = new l.Mesh(Vn.geometry, Li(Ya));
((Vn.receiveShadow = $n.receiveShadow = !0),
  (Vn.position.z = $n.position.z = -0.02),
  E0.add(Vn),
  Gn.add($n));
const Bi = Le("#2a3140", { roughness: 0.3 }),
  D0 = Le("#1b212d", { roughness: 0.34, metalness: 0.6 }),
  _i = Uo("#0e1420", { roughness: 0.2, metalness: 0.5 }),
  Ei = new l.BoxGeometry(0.045, 1, 0.2).translate(0, 0.5, 0.02),
  Wn = new l.InstancedMesh(Ei, Bi, pn + 1),
  zn = new l.InstancedMesh(Ei, Bi, pn + 1);
for (const e of [Wn, zn])
  ((e.count = 0), (e.castShadow = !0), (e.receiveShadow = !0));
(E0.add(Wn), Gn.add(zn));
const m1 = new l.BoxGeometry(1, 0.075, wt + 0.26).translate(
    0.5,
    0,
    -(wt + 0.26) / 2 + 0.24,
  ),
  Ws = new l.InstancedMesh(m1, D0, ht + 1);
((Ws.castShadow = !0), (Ws.receiveShadow = !0), fo.add(Ws));
const y1 = new l.BoxGeometry(1, 0.022, 0.022).translate(0.5, 0, 0.25),
  Zo = new l.InstancedMesh(
    y1,
    new l.MeshBasicMaterial({ color: 16777215, fog: !1 }),
    ht + 1,
  );
((Zo.instanceColor = new l.InstancedBufferAttribute(
  new Float32Array((ht + 1) * 3),
  3,
)),
  fo.add(Zo),
  ze.push(Zo));
const Di = new l.BoxGeometry(0.022, 0.022, wt + 0.26).translate(
    0,
    0,
    -(wt + 0.26) / 2 + 0.24,
  ),
  Os = new l.InstancedMesh(Di, Zo.material, ht + 1),
  Us = new l.InstancedMesh(Di, Zo.material, ht + 1);
for (const e of [Os, Us])
  ((e.instanceColor = new l.InstancedBufferAttribute(
    new Float32Array((ht + 1) * 3),
    3,
  )),
    fo.add(e),
    ze.push(e));
const Fi = new l.BoxGeometry(1, 1, 0.3).translate(0.5, 0.5, -wt),
  F0 = new l.BoxGeometry(0.34, 1, wt + 0.5).translate(0, 0.5, -wt / 2 + 0.05),
  G0 = Le("#252c3a", { roughness: 0.28 }),
  Hs = new l.Mesh(Fi, _i),
  ls = new l.Mesh(Fi, _i),
  Ns = new l.Mesh(F0, G0),
  Xs = new l.Mesh(F0, G0),
  qs = new l.Mesh(F0, G0),
  Ks = new l.Mesh(F0, G0);
for (const e of [Hs, ls, Ns, Xs, qs, Ks]) e.castShadow = !0;
(E0.add(Hs, Ns, qs), Gn.add(ls, Xs, Ks));
{
  const e = new l.BoxGeometry(0.035, 1, 0.035).translate(0, 0.5, 0.3),
    t = Ke("#9fe8ff", 1.35);
  for (const [n, s] of [
    [Ns, -0.17],
    [Xs, -0.17],
    [qs, 0.17],
    [Ks, 0.17],
  ]) {
    const r = new l.Mesh(e, t);
    ((r.position.x = s), n.add(r), ze.push(r));
  }
}
const Ys = new l.Mesh(
  new l.BoxGeometry(0.05, ht * _t, 0.05).translate(0, _e + (ht * _t) / 2, 0.3),
  new l.MeshBasicMaterial({
    color: new l.Color(1.4, 1.2, 0.8),
    fog: !1,
    transparent: !0,
    opacity: 0,
    depthWrite: !1,
  }),
);
(fo.add(Ys), ze.push(Ys));
const js = new l.Mesh(
  new l.BoxGeometry(1, 0.34, wt + 0.5).translate(
    0.5,
    Rt + 0.17,
    -wt / 2 + 0.05,
  ),
  D0,
);
((js.castShadow = !0), (js.receiveShadow = !0), Gn.add(js));
const V0 = new l.Mesh(
  new l.BoxGeometry(1, 0.03, 0.03).translate(0.5, Rt + 0.35, 0.28),
  Ke("#9fe8ff", 2.2),
);
(Gn.add(V0), ze.push(V0));
const gf = Le("#1a202c", { roughness: 0.3 }),
  ja = new l.Mesh(
    new l.BoxGeometry(1, _e, wt - 0.6).translate(0.5, _e / 2, -wt / 2 - 0.1),
    Uo("#10151f", { roughness: 0.3 }),
  );
((ja.receiveShadow = !0), fo.add(ja));
const Za = new l.Mesh(
  new l.BoxGeometry(1, 0.12, 1.4).translate(0.5, _e - 0.02, 0.55),
  D0,
);
((Za.castShadow = !0), fo.add(Za));
const Qa = new l.Mesh(
  new l.BoxGeometry(1, 0.025, 0.025).translate(0.5, _e - 0.08, 1.26),
  Ke("#ffd9a0", 1.6),
);
(fo.add(Qa), ze.push(Qa));
const cs = 64,
  On = 320,
  Un = 32,
  $0 = 12,
  fs = document.createElement("canvas");
((fs.width = cs * Un), (fs.height = On * $0));
const Dt = fs.getContext("2d"),
  Zs = new l.CanvasTexture(fs);
((Zs.colorSpace = l.SRGBColorSpace),
  (Zs.anisotropy = 8),
  (Zs.generateMipmaps = !0));
const Qs = new Map();
function b1(e, t) {
  const n = e + "|" + t;
  if (Qs.has(n)) return Qs.get(n);
  const s = Qs.size;
  if (s >= Un * $0) return 0;
  Qs.set(n, s);
  const r = (s % Un) * cs,
    a = Math.floor(s / Un) * On;
  (Dt.save(),
    Dt.clearRect(r, a, cs, On),
    (Dt.fillStyle = "rgba(12,16,26,.94)"),
    Dt.fillRect(r + 3, a + 3, cs - 6, On - 6),
    (Dt.fillStyle = cn[t]?.c || "#fff"),
    Dt.fillRect(r + 3, a + On - 9, cs - 6, 6),
    Dt.translate(r + cs / 2, a + On - 22),
    Dt.rotate(-Math.PI / 2));
  const o = e === "\u2026" ? "\xB7 \xB7 \xB7" : bt(e);
  let i = 38;
  for (
    Dt.font = `500 ${i}px DM Mono, monospace`;
    Dt.measureText(o).width > On - 40 && i > 14;
  )
    ((i -= 2), (Dt.font = `500 ${i}px DM Mono, monospace`));
  return (
    (Dt.fillStyle = t === "mark" ? "#aeb6ca" : "#f4f7ff"),
    (Dt.textBaseline = "middle"),
    Dt.fillText(o, 0, 1),
    Dt.restore(),
    (Zs.needsUpdate = !0),
    s
  );
}
const Gi = new l.PlaneGeometry(1, 1),
  Ja = new l.InstancedBufferAttribute(new Float32Array(pn * 2), 2);
Gi.setAttribute("aCell", Ja);
const x1 = new l.ShaderMaterial({
    uniforms: { map: { value: Zs }, uK: { value: 1.05 }, uHi: { value: -1 } },
    vertexShader: `attribute vec2 aCell;varying vec2 vUv;varying float vI;
 void main(){vUv=(aCell+uv)/vec2(${Un}.,${$0}.);vUv.y=1.-((aCell.y+1.-uv.y)/${$0}.);vI=float(gl_InstanceID);gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform sampler2D map;uniform float uK;uniform float uHi;varying vec2 vUv;varying float vI;void main(){vec4 c=texture2D(map,vUv);if(c.a<.4)discard;float h=abs(vI-uHi)<.5?1.8:1.;gl_FragColor=vec4(c.rgb*uK*h,1.);
 #include <colorspace_fragment>
 }`,
  }),
  Js = new l.InstancedMesh(Gi, x1, pn);
((Js.count = 0), fo.add(Js));
function w1() {
  ((oo = Ae.length - 1),
    (Et = Math.min(Ha, 62 / Math.max(oo, 1))),
    (je = -(oo * Et) / 2));
  for (let e = 0; e <= oo; e++)
    (ae.makeTranslation(je + e * Et, 0, 0),
      Wn.setMatrixAt(e, ae),
      zn.setMatrixAt(e, ae));
  (Qs.clear(), Dt.clearRect(0, 0, fs.width, fs.height));
  for (let e = 0; e < oo; e++) {
    const t = b1(Ae[e].t, Ae[e].role);
    (Ja.setXY(e, t % Un, Math.floor(t / Un)),
      ae.compose(
        Nt.set(je + (e + 0.5) * Et, _e * 0.5 + 0.12, 0.1),
        $e.identity(),
        new l.Vector3(Et * 0.84, _e * 0.78, 1),
      ),
      Js.setMatrixAt(e, ae));
  }
  ((Ja.needsUpdate = !0),
    (Js.instanceMatrix.needsUpdate = !0),
    (Wn.instanceMatrix.needsUpdate = !0),
    (zn.instanceMatrix.needsUpdate = !0));
  for (let e = 0; e < oo; e++) {
    const t = e * 4 + 3;
    for (let n = 0; n < ht; n++) Vs[(n * pn + e) * 4 + 3] = Pi[Ae[e].role] * 32;
  }
  ((to = -1), (ho.at = -1), Vi(ue));
}
function Vi(e) {
  if (e === to) return;
  to = e;
  const t = Math.max(e, 0.001) * Et;
  Ii.uBuilt.value = Math.max(e, 1);
  for (const n of [Vn, $n]) ((n.scale.x = t), (n.position.x = je));
  ((Wn.count = zn.count = Math.min(e + 1, oo + 1)), (Js.count = e));
  for (const n of [Hs, ls, js, V0, ja, Za, Qa])
    ((n.scale.x = t + 0.24), (n.position.x = je - 0.12));
  ((Ns.position.x = Xs.position.x = je - 0.17),
    (qs.position.x = Ks.position.x = je + t + 0.17),
    (Ys.position.x = je + t + 0.02),
    (ho.at = -1),
    $i());
}
function $i() {
  const e = ho.L,
    t = ho.g;
  if (e === ho.at && t === ho.ag) return;
  ((ho.at = e), (ho.ag = t));
  const n = (e + 1) * _t,
    s = (ht - e - 1) * _t;
  ((Vn.scale.y = Math.max(n, 1e-4)),
    (Vn.position.y = _e),
    (Ka.uF0.value = 0),
    (Ka.uFn.value = e + 1),
    ($n.scale.y = Math.max(s, 1e-4)),
    ($n.position.y = _e + n + t),
    (Ya.uF0.value = e + 1),
    (Ya.uFn.value = ht - e - 1),
    ($n.visible = s > 0),
    (Wn.scale.y = n),
    (Wn.position.y = _e),
    (zn.scale.y = Math.max(s, 1e-4)),
    (zn.position.y = _e + n + t),
    (zn.visible = s > 0),
    (Hs.scale.y = n + 0.1),
    (Hs.position.y = _e),
    (ls.scale.y = Math.max(s + 0.1, 1e-4)),
    (ls.position.y = _e + n + t),
    (ls.visible = s > 0));
  for (const a of [Ns, qs]) ((a.scale.y = _e + n), (a.position.y = 0));
  for (const a of [Xs, Ks])
    ((a.scale.y = Math.max(s + 0.35, 1e-4)), (a.position.y = _e + n + t));
  ((js.position.y = V0.position.y = t),
    (Ze.position.y = Rt + 0.34 + t),
    (Gn.userData.g = t));
  const r = Math.max(to, 0.001) * Et;
  for (let a = 0; a <= ht; a++)
    (ae.compose(
      Nt.set(je - 0.12, _e + a * _t + (a > e ? t : 0), 0),
      $e.identity(),
      new l.Vector3(r + 0.24, 1, 1),
    ),
      Ws.setMatrixAt(a, ae),
      Zo.setMatrixAt(a, ae));
  for (let a = 0; a <= ht; a++) {
    const o = _e + a * _t + (a > e ? t : 0);
    (ae.makeTranslation(je - 0.13, o, 0),
      Os.setMatrixAt(a, ae),
      ae.makeTranslation(je + r + 0.13, o, 0),
      Us.setMatrixAt(a, ae));
  }
  ((Os.instanceMatrix.needsUpdate = Us.instanceMatrix.needsUpdate = !0),
    (Ws.instanceMatrix.needsUpdate = !0),
    (Zo.instanceMatrix.needsUpdate = !0),
    (Ys.visible = t < 0.01));
}
const hs = new l.Color();
function g1(e) {
  const t = wo(e);
  {
    const o = Y[Ee]?.c,
      i = o ? U((Se - Y[Ee].t0) / o.dur, 0, 1) : 0,
      c = o?.exp ? o.exp(i) : null;
    ((ho.L = c ? c.L : 35), (ho.g = c ? c.g : 0), $i());
  }
  let n = ue;
  for (let o = 0; o < ot - 1 && e >= k.gen[o]; o++) n = ue + o + 1;
  Vi(n);
  const s = t >= 0 && t < k.steps.length ? k.steps[t] : null,
    r = s ? es(s, e) : -1,
    a = typeof vr == "function" ? vr() : -1;
  for (let o = 0; o < oo; o++) {
    const i = ri(o, e),
      c = s && ai(o) === t;
    for (let f = 0; f < ht; f++) {
      const d = (f * pn + o) * 4,
        h = U(i - f, 0, 1);
      ((Vs[d] = h * 255),
        (Vs[d + 2] = o === a ? h * 70 : 0),
        (Vs[d + 1] =
          c && r >= 0 && r < ht + 0.5
            ? U(1 - Math.abs(f + 0.5 - r) / 1.3, 0, 1) * (t === 0 ? 150 : 255)
            : 0));
    }
  }
  $s.needsUpdate = !0;
  for (let o = 0; o <= ht; o++) {
    const i = s && r >= 0 ? U(1 - Math.abs(o - r) / 1.1, 0, 1) : 0;
    (hs.setRGB(0.22 + i * 1.3, 0.5 + i * 1.5, 0.8 + i * 1.4),
      Zo.setColorAt(o, hs));
  }
  Zo.instanceColor.needsUpdate = !0;
  for (let o = 0; o <= ht; o++)
    (Zo.getColorAt(o, hs),
      hs.multiplyScalar(0.7),
      Os.setColorAt(o, hs),
      Us.setColorAt(o, hs));
  ((Os.instanceColor.needsUpdate = Us.instanceColor.needsUpdate = !0),
    (Ys.material.opacity =
      s && s.kind === "decode" ? 0.35 + 0.3 * Math.sin(at * 6) : 0),
    (Ai.uWave.value = s ? r : -1));
}
const Ze = new l.Group();
fo.add(Ze);
const Ft = 3.05,
  W0 = document.createElement("canvas");
W0.width = W0.height = 1024;
const v1 = W0.getContext("2d"),
  e0 = new l.CanvasTexture(W0);
((e0.colorSpace = l.SRGBColorSpace), (e0.anisotropy = 8));
const t0 = new l.Group();
Ze.add(t0);
{
  const e = new l.Mesh(
    new l.CircleGeometry(Ft, 128),
    new l.MeshBasicMaterial({
      map: e0,
      color: new l.Color(0.72, 0.72, 0.72),
      fog: !1,
    }),
  );
  ((e.rotation.x = -Math.PI / 2), (e.position.y = 0.36), t0.add(e));
  const t = Pt();
  (t.cyl(D0, 0, 0.16, 0, Ft + 0.28, Ft + 0.36, 0.32, { seg: 96 }),
    t.tor(kn, 0, 0.37, 0, Ft + 0.02, 0.045, { seg: 128, rx: Math.PI / 2 }),
    t.cyl(kn, 0, 0.42, 0, 0.28, 0.32, 0.14, { seg: 32 }),
    t.tor(Le("#2a3140"), 0, 0.2, 0, Ft + 0.36, 0.03, {
      seg: 128,
      rx: Math.PI / 2,
    }),
    t.flush(Ze));
  const n = Pt();
  (n.box(kn, 0, 0.5, Ft + 0.3, 0.07, 0.07, 0.7, {}),
    n.cone(kn, 0, 0.5, Ft - 0.08, 0.1, 0.3, { dir: [0, 0, -1], seg: 4 }),
    n.cyl(kn, 0, 0.28, Ft + 0.62, 0.06, 0.08, 0.5, { seg: 12 }),
    n.flush(Ze));
}
function k1(e, t, n, s, r = 96) {
  const a = [],
    o = [],
    i = [];
  for (let f = 0; f <= r; f++) {
    const d = f / r,
      h = Ut(n, s, d);
    for (const [m, p] of [
      [t, 0],
      [e, 1],
    ])
      (a.push(Math.cos(h) * m, 0, Math.sin(h) * m), o.push(d, p));
  }
  for (let f = 0; f < r; f++) {
    const d = f * 2;
    i.push(d, d + 1, d + 2, d + 1, d + 3, d + 2);
  }
  const c = new l.BufferGeometry();
  return (
    c.setAttribute("position", new l.Float32BufferAttribute(a, 3)),
    c.setAttribute("uv", new l.Float32BufferAttribute(o, 2)),
    c.setIndex(i),
    c.computeVertexNormals(),
    c
  );
}
{
  const e = Pt();
  (e.geo(
    Ra,
    new l.RingGeometry(Ft + 0.05, Ft + 0.34, 128).rotateX(-Math.PI / 2),
    0,
    0.372,
    0,
  ),
    e.flush(Ze, !1));
  let t = !1;
  const n = document.createElement("canvas");
  ((n.width = 2048), (n.height = 176));
  const s = n.getContext("2d"),
    r = new l.CanvasTexture(n);
  ((r.colorSpace = l.SRGBColorSpace), (r.anisotropy = 8));
  const a = () => {
    (s.clearRect(0, 0, 2048, 176),
      ei(s, 2048, 176, !1, t, 118),
      (r.needsUpdate = !0));
  };
  (a(), k0.push(a));
  const o = 1.5,
    i = new l.Mesh(
      k1(
        Ft + 0.08,
        Ft + 0.31,
        Math.PI / 2 + o / 2 + 0.55,
        Math.PI / 2 - o / 2 + 0.55,
      ),
      new l.MeshBasicMaterial({
        map: r,
        alphaTest: 0.25,
        fog: !1,
        side: l.DoubleSide,
        color: new l.Color(0.66, 0.66, 0.66),
      }),
    );
  ((i.position.y = 0.376),
    Ze.add(i),
    et.push(i),
    M0.push({
      hit: i,
      over(c) {
        ((t = c),
          i.material.color.setRGB(
            c ? 3.2 : 0.66,
            c ? 2.4 : 0.66,
            c ? 1.3 : 0.66,
          ));
      },
    }));
}
const O0 = new l.Mesh(new l.SphereGeometry(0.07, 16, 12), Ke("#ffe2a0", 1.6));
(O0.position.set(0, 0.52, Ft - 0.2), Ze.add(O0), ze.push(O0));
const U0 = 300,
  M1 = new l.BoxGeometry(1, 0.03, 0.045).translate(0.5, 0, 0),
  Hn = new l.InstancedMesh(
    M1,
    new l.MeshBasicMaterial({ color: 16777215, fog: !1 }),
    U0,
  );
((Hn.instanceColor = new l.InstancedBufferAttribute(
  new Float32Array(U0 * 3),
  3,
)),
  t0.add(Hn),
  ze.push(Hn));
let Lo = 1;
function Wi(e, t, n) {
  if (Math.abs(n - 1) < 0.01) return { top: e, rest: t };
  if (n < 0.03) {
    const o = e.reduce((i, c) => (c.p > i.p ? c : i));
    return { top: e.map((i) => ({ t: i.t, p: i === o ? 1 : 0 })), rest: 0 };
  }
  const s = e.map((o) => Math.pow(Math.max(o.p, 1e-12), 1 / n)),
    r = t > 0 ? Math.pow(t / 2e4, 1 / n) * 2e4 : 0,
    a = s.reduce((o, i) => o + i, 0) + r;
  return { top: e.map((o, i) => ({ t: o.t, p: s[i] / a })), rest: r / a };
}
function er(e) {
  const t = mt().gen[e];
  if (!t) return null;
  if (t[2] === "answer" && t[4]) {
    let n = t[4].map(([r, a]) => ({ t: r, p: a })),
      s = Math.max(0, 1 - n.reduce((r, a) => r + a.p, 0));
    return (
      ({ top: n, rest: s } = Wi(n, s, Lo)),
      (n = n.filter((r) => r.p > 0.0015 || r.t === t[0])),
      {
        known: 1,
        top: n,
        rest: Math.max(0, 1 - n.reduce((r, a) => r + a.p, 0)),
        pick: t[0],
        j: e,
      }
    );
  }
  return { known: 0, top: [{ t: t[0], p: 1 }], rest: 0, pick: t[0], j: e };
}
function Oi(e) {
  const t = [];
  let n = 0;
  for (const s of e.top) {
    const r = s.p * Math.PI * 2;
    (t.push({ t: s.t, p: s.p, a0: n, a1: n + r }), (n += r));
  }
  return (
    e.rest > 0.001 &&
      t.push({
        t: "everything else",
        p: e.rest,
        a0: n,
        a1: Math.PI * 2,
        rest: 1,
      }),
    t
  );
}
let S1 = -2,
  Ui = [],
  vf = 0;
function Hi(e, t) {
  const n = v1,
    s = 1024,
    r = s / 2;
  if (
    (n.clearRect(0, 0, s, s),
    n.save(),
    n.translate(r, r),
    (n.fillStyle = "#0a0e18"),
    n.beginPath(),
    n.arc(0, 0, r, 0, 7),
    n.fill(),
    !e)
  ) {
    for (let c = 0; c < 24; c++)
      ((n.strokeStyle = "#ffffff10"),
        (n.lineWidth = 2),
        n.beginPath(),
        n.moveTo(0, 0),
        n.lineTo(
          Math.cos((c / 24) * 6.283) * r,
          Math.sin((c / 24) * 6.283) * r,
        ),
        n.stroke());
    (n.restore(), (e0.needsUpdate = !0));
    return;
  }
  const a = Oi(e);
  Ui = a;
  const o = e.known
    ? [
        [127, 227, 255],
        [93, 190, 230],
        [70, 150, 200],
        [55, 120, 170],
      ]
    : [[125, 240, 180]];
  (a.forEach((c, f) => {
    const d = t && c.t === e.pick;
    let [h, m, p] = c.rest ? [70, 78, 98] : o[f % o.length];
    (!e.known && mt().gen[e.j][2] === "mark" && ([h, m, p] = [150, 158, 178]),
      d && ([h, m, p] = c.p > 0.9 ? [196, 160, 98] : [255, 210, 122]),
      (n.fillStyle = `rgb(${h},${m},${p})`),
      (n.globalAlpha = c.rest ? 0.55 : d ? (c.p > 0.9 ? 0.62 : 1) : 0.78),
      n.beginPath(),
      n.moveTo(0, 0),
      n.arc(0, 0, r - 6, c.a0, c.a1),
      n.closePath(),
      n.fill(),
      (n.globalAlpha = 1),
      (n.strokeStyle = "#0a0e18"),
      (n.lineWidth = 4),
      n.stroke());
  }),
    (n.fillStyle = "#0a0e18"),
    n.beginPath(),
    n.arc(0, 0, r * 0.2, 0, 7),
    n.fill(),
    (n.textBaseline = "middle"),
    (n.textAlign = "center"));
  for (const c of a) {
    const f = c.a1 - c.a0;
    if (f < 0.16 && c.t !== e.pick) continue;
    const d = (c.a0 + c.a1) / 2,
      h = r * (f < 0.35 ? 0.72 : 0.6);
    (n.save(),
      n.translate(Math.cos(d) * h, Math.sin(d) * h),
      n.rotate(d - Math.PI / 2));
    const m = c.rest ? "the other 201,068" : bt(c.t),
      p = Math.min(f * h * 0.92, r * 0.9);
    let x = f > 0.5 ? 64 : f > 0.25 ? 50 : 38;
    n.font = `600 ${x}px DM Mono, monospace`;
    const w = n.measureText(m).width;
    (w > p &&
      ((x = Math.max(16, Math.floor((x * p) / w))),
      (n.font = `600 ${x}px DM Mono, monospace`)),
      (n.fillStyle = c.rest ? "#c9d0e2" : "#07101c"),
      n.fillText(m, 0, 0),
      e.known &&
        !c.rest &&
        f > 0.2 &&
        ((n.font = `500 ${Math.round(x * 0.6)}px DM Mono, monospace`),
        (n.globalAlpha = 0.78),
        n.fillText($o(c.p), 0, -x * 0.85),
        (n.globalAlpha = 1)),
      n.restore());
  }
  (n.restore(), (e0.needsUpdate = !0));
  const i = ye(e.j * 31 + 7);
  for (let c = 0; c < U0; c++) {
    const f = ((c + 0.5) / U0) * Math.PI * 2,
      d = a.find((w) => f >= w.a0 && f < w.a1) || a[a.length - 1],
      h = d.rest
        ? 0.08 + i() * 0.25 * Math.pow(i(), 3)
        : 0.3 +
          1.5 *
            Math.pow(U((Math.log(d.p) + 9) / 9, 0, 1), 1.3) *
            (0.92 + i() * 0.08);
    (ae.compose(
      Nt.set(Math.cos(f) * (Ft + 0.46), 0.05, Math.sin(f) * (Ft + 0.46)),
      $e.setFromAxisAngle(Zt, -f),
      new l.Vector3(h, 1, 1),
    ),
      Hn.setMatrixAt(c, ae));
    const m = t && d.t === e.pick,
      p = e.known ? 1 : 0.45,
      x = !e.known && mt().gen[e.j][2] === "mark";
    Hn.setColorAt(
      c,
      Ps.setRGB(
        ...(d.rest
          ? [0.16, 0.19, 0.26]
          : m
            ? [1.1 * p, 0.82 * p, 0.38 * p]
            : e.known
              ? [0.3, 0.8, 1.05]
              : x
                ? [0.26, 0.29, 0.36]
                : [0.2, 0.55, 0.4]),
      ),
    );
  }
  ((Hn.instanceMatrix.needsUpdate = !0), (Hn.instanceColor.needsUpdate = !0));
}
function T1() {
  const e = oo * Et;
  (Ze.position.set(
    je + Math.min(e * 0.72, e - 4.2),
    Rt + 0.34 + ho.g,
    -wt / 2 + 0.2,
  ),
    (S1 = -2),
    Hi(null));
}
const Ni = (e, t) => {
  const n = e.find((s) => s.t === t) || e[0];
  return (n.a0 + n.a1) / 2 - Math.PI / 2;
};
let Xi = 0,
  o0 = -2,
  qi = !1,
  Ki = 1;
function C1(e) {
  const t = wo(e);
  let n = -1,
    s = 1;
  if (t >= 0 && t < k.steps.length) {
    const c = k.steps[t],
      f = c.t1 - c.t0,
      d = c.t0 + Tt * f;
    e >= d ? ((n = t), (s = (e - d) / (c.t1 - d))) : ((n = t - 1), (s = 1));
  } else t >= k.steps.length && ((n = k.steps.length - 1), (s = 1));
  const r = s >= 1;
  if (n !== o0 || r !== qi || Lo !== Ki) {
    Ki = Lo;
    const c = n >= 0 ? er(n) : null;
    if ((Hi(c, r), n !== o0 && n >= 0)) {
      const f = n > 0 ? er(n - 1) : null;
      Xi = f ? Ni(Oi(f), f.pick) : 0;
    }
    ((o0 = n), (qi = r));
  }
  if (n < 0) {
    t0.rotation.y = 0;
    return;
  }
  const a = Ni(Ui, er(n).pick);
  let o = Xi;
  for (; o < a + Math.PI * 4;) o += Math.PI * 2;
  const i = 1 - Math.pow(1 - U(s, 0, 1), 3);
  ((t0.rotation.y = Ut(o, a, i)),
    O0.material.color.setRGB(...(r ? [2.2, 1.7, 1] : [1.2, 0.95, 0.6])));
}
const ds = new l.Group();
(fo.add(ds), (ds.visible = !1));
const n0 = 128,
  H0 = 16,
  Yi = 8,
  R1 = pt(
    new l.MeshStandardMaterial({
      color: "#101828",
      roughness: 0.25,
      metalness: 0.4,
      envMapIntensity: 0.9,
    }),
    Object.assign(
      (e) => {
        e.fragmentShader = e.fragmentShader
          .replace("#include <color_fragment>", "")
          .replace(
            "#include <emissivemap_fragment>",
            `#include <emissivemap_fragment>
#ifdef USE_INSTANCING_COLOR
totalEmissiveRadiance+=vColor;
#endif`,
          );
      },
      { key: "exp" },
    ),
  ),
  An = new l.InstancedMesh(_n(1, 1, 1, 0.05), R1, n0);
((An.instanceColor = new l.InstancedBufferAttribute(
  new Float32Array(n0 * 3),
  3,
)),
  (An.castShadow = !0),
  (An.receiveShadow = !0),
  ds.add(An));
const N0 = new l.Mesh(
  new l.PlaneGeometry(1, 1),
  new l.MeshBasicMaterial({ color: new l.Color(0.05, 0.09, 0.16), fog: !1 }),
);
((N0.rotation.x = -Math.PI / 2), ds.add(N0));
function ji(e, t, n) {
  const s = Math.max(to, 1) * Et,
    r = ((e % H0) + 0.5) / H0,
    a = (Math.floor(e / H0) + 0.5) / Yi;
  return n.set(
    je + 0.6 + r * (s - 1.2),
    _e + t * _t + 0.06,
    -0.9 - a * (wt - 1.8),
  );
}
function tr(e, t) {
  const n = Ae[e]?.id ?? e,
    s = ye((n * 131 + t * 977 + e * 7) >>> 0),
    r = [];
  for (; r.length < 4;) {
    const o = Math.floor(s() * n0);
    r.find((i) => i.e === o) || r.push({ e: o, w: 0.2 + s() });
  }
  const a = r.reduce((o, i) => o + i.w, 0);
  return (r.forEach((o) => (o.w /= a)), r.sort((o, i) => i.w - o.w));
}
const X0 = new Float32Array(n0),
  q0 = new l.Vector3();
function z1(e, t, n, s) {
  if (((ds.visible = s > 0.02), !ds.visible)) return;
  const r = Math.max(to, 1) * Et,
    a = (r - 1.2) / H0,
    o = (wt - 1.8) / Yi;
  (N0.scale.set(r, wt - 0.6, 1),
    N0.position.set(je + r / 2, _e + t * _t + 0.045, -wt / 2),
    X0.fill(0));
  for (let c = 0; c < ue; c++) for (const f of tr(c, t)) X0[f.e] += f.w;
  const i = n >= 0 ? tr(n, t) : [];
  for (let c = 0; c < n0; c++) {
    ji(c, t, q0);
    const f = 0.18 + Math.min(X0[c], 3) * 0.1;
    (ae.compose(
      Nt.set(q0.x, q0.y + f / 2, q0.z),
      $e.identity(),
      new l.Vector3(a * 0.78, f, o * 0.72),
    ),
      An.setMatrixAt(c, ae));
    const d = i.find((m) => m.e === c),
      h = U(X0[c] / 2.2, 0, 1);
    An.setColorAt(
      c,
      d
        ? Ps.setRGB(1.6 * s, 1.15 * s, 0.45 * s).multiplyScalar(0.7 + d.w * 1.6)
        : Ps.setRGB(
            0.05 + 0.25 * h,
            0.12 + 0.5 * h,
            0.2 + 0.7 * h,
          ).multiplyScalar(s * (0.35 + 0.65 * h)),
    );
  }
  ((An.instanceMatrix.needsUpdate = !0), (An.instanceColor.needsUpdate = !0));
}
const Bo = new l.Group();
(Kt.add(Bo), (Bo.visible = !1));
const Gt = { w: 6.4, h: 11, d: 2.2 },
  A1 = We(512, 1024, (e, t, n) => {
    ((e.fillStyle = "#08101c"), e.fillRect(0, 0, t, n));
    const s = ye(5);
    for (let r = 0; r < n; r += 2) {
      const a = 0.1 + s() * 0.22;
      ((e.fillStyle = `rgba(${(90 + s() * 60) | 0},${(150 + s() * 60) | 0},${(210 + s() * 40) | 0},${a})`),
        e.fillRect(0, r, t, 1));
    }
    for (let r = 0; r < t; r += 16)
      ((e.fillStyle = "rgba(120,200,255,.05)"), e.fillRect(r, 0, 1, n));
  }),
  Zi = new l.MeshPhysicalMaterial({
    color: "#0b1626",
    roughness: 0.08,
    metalness: 0.2,
    transparent: !0,
    opacity: 0.82,
    envMapIntensity: 1.3,
    clearcoat: 1,
    emissive: new l.Color("#5aa8e8"),
    emissiveMap: A1,
    emissiveIntensity: 0.55,
  }),
  Qi = new l.Mesh(
    new f0(Gt.w, Gt.h, Gt.d, 3, 0.08).translate(0, Gt.h / 2, 0),
    Zi,
  );
((Qi.castShadow = !0), Bo.add(Qi));
{
  const e = Pt();
  (e.box(Ke("#7fe3ff", 1.6), 0, Gt.h + 0.02, Gt.d / 2, Gt.w, 0.025, 0.025),
    e.box(Ke("#7fe3ff", 1.2), 0, 0.02, Gt.d / 2, Gt.w, 0.025, 0.025),
    e.box(Ra, 0, 0.1, 0, Gt.w + 0.6, 0.2, Gt.d + 0.6, { r: 0.05 }),
    e.flush(Bo, !1));
  const t = ln(
    Gt.w * 0.96,
    0.62,
    1536,
    150,
    (n, s, r) => {
      ((n.font = "600 64px Outfit, sans-serif"),
        (n.fillStyle = "#dff4ff"),
        (n.textAlign = "center"),
        (n.textBaseline = "middle"),
        n.fillText("THE EMBEDDING TABLE", s / 2, 48),
        (n.font = "500 44px DM Mono, monospace"),
        (n.fillStyle = "#8fd8ff"),
        n.fillText("201,088 rows \xD7 2,880 numbers", s / 2, 112));
    },
    0.95,
  );
  (t.position.set(0, Gt.h + 0.55, Gt.d / 2 + 0.02), Bo.add(t));
}
const P1 = We(1024, 16, (e, t, n) => {
    const s = ye(9);
    for (let r = 0; r < t; r += 4) {
      const a = s() * 2 - 1,
        o = Math.abs(a);
      ((e.fillStyle =
        a > 0
          ? `rgba(255,${(170 - o * 50) | 0},80,${0.35 + o * 0.65})`
          : `rgba(${(110 - o * 40) | 0},210,255,${0.35 + o * 0.65})`),
        e.fillRect(r, 0, 3, n));
    }
  }),
  I1 = new l.MeshBasicMaterial({
    map: P1,
    color: new l.Color(1.2, 1.2, 1.2),
    fog: !1,
  }),
  Ji = 140,
  _o = new l.InstancedMesh(new l.BoxGeometry(1, 1, 1), I1, Ji);
((_o.count = 0), Kt.add(_o), ze.push(_o));
function L1() {
  (Bo.position.set(je - 4.6, 0, 8.5), (Bo.rotation.y = 0.22));
}
const el = new l.Vector3(),
  or = new l.Vector3(),
  tl = new l.Vector3(),
  ol = new l.Quaternion(),
  B1 = new l.Matrix4();
function _1(e, t) {
  if (((Bo.visible = !1), (_o.visible = e > 0.01), !_o.visible)) return;
  (L1(),
    Bo.updateMatrixWorld(),
    B1.copy(Bo.matrixWorld).invert(),
    (Zi.opacity = 0.82 * e));
  let n = 0;
  for (let s = 0; s < ue && n < Ji; s++) {
    const r = Ae[s];
    if (r.role === "hist" && s !== Is) continue;
    const a = 0.05 + (s / ue) * 0.42,
      o = U((t - a) / 0.3, 0, 1);
    if (o <= 0 && t < a) continue;
    const i = 0.3 + (r.id >= 0 ? r.id / Me.vocab : 0.5) * (Gt.h - 0.6);
    (el.set(Ge(s) * 0.35 - 6, i * 0.6 + 6, 40),
      or.set(Ge(s) * 0.6 - 3, i * 0.3 + 5, 24),
      tl.set(Ge(s), _e - 0.25, 0.9));
    let c, f;
    if (o < 0.3) ((c = el.clone().lerp(or, gn(o / 0.3))), (f = 1));
    else {
      const h = gn((o - 0.3) / 0.7);
      ((c = or.clone().lerp(tl, h)),
        (c.y += Math.sin(Math.PI * h) * 3),
        (f = Ut(1, 0.08, h)));
    }
    const d = Gt.w * 0.92 * f;
    (ol.setFromEuler(
      v0.set(0, Ut(Bo.rotation.y, 0, U((o - 0.3) / 0.7, 0, 1)), 0, "YXZ"),
    ),
      ae.compose(c, ol, new l.Vector3(d, 0.07, 0.16)),
      _o.setMatrixAt(n, ae),
      _o.setColorAt?.(n, Ps.set(cn[r.role].c).multiplyScalar(1.3)),
      n++);
  }
  ((_o.count = n),
    (_o.instanceMatrix.needsUpdate = !0),
    _o.instanceColor && (_o.instanceColor.needsUpdate = !0));
}
class nl {
  constructor(t, n = 0) {
    this.max = t;
    const s = new l.BufferGeometry();
    ((this.pos = new Float32Array(t * 12)),
      (this.side = new Float32Array(t * 4)),
      (this.col = new Float32Array(t * 16)));
    const r = new Uint32Array(t * 6);
    for (let a = 0; a < t; a++) {
      const o = a * 4;
      r.set([o, o + 1, o + 2, o + 1, o + 3, o + 2], a * 6);
    }
    (s.setAttribute(
      "position",
      new l.BufferAttribute(this.pos, 3).setUsage(l.DynamicDrawUsage),
    ),
      s.setAttribute(
        "aSide",
        new l.BufferAttribute(this.side, 1).setUsage(l.DynamicDrawUsage),
      ),
      s.setAttribute(
        "aCol",
        new l.BufferAttribute(this.col, 4).setUsage(l.DynamicDrawUsage),
      ),
      s.setIndex(new l.BufferAttribute(r, 1)),
      (this.mesh = new l.Mesh(
        s,
        new l.ShaderMaterial({
          uniforms: { ...g0, uSoft: { value: 0.35 }, uXr: { value: n } },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: l.AdditiveBlending,
          side: l.DoubleSide,
          vertexShader:
            "attribute float aSide;attribute vec4 aCol;varying float vS;varying vec4 vC;void main(){vS=aSide;vC=aCol;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `${Kr}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uXr;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float v=ovVis(uSoft);float a=(k*.5+core*1.5)*vC.a*mix(uXr,1.,v);gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      As.add(this.mesh));
  }
  begin() {
    this.n = 0;
  }
  seg(t, n, s, r, a, o, i) {
    if (this.n >= this.max) return;
    const c = this.n++;
    (sl.subVectors(n, t),
      al.addVectors(t, n).multiplyScalar(0.5),
      rl.subVectors(Z.position, al),
      uo.crossVectors(sl, rl).normalize());
    const f = this.pos,
      d = c * 12;
    ((f[d] = t.x - uo.x * s),
      (f[d + 1] = t.y - uo.y * s),
      (f[d + 2] = t.z - uo.z * s),
      (f[d + 3] = t.x + uo.x * s),
      (f[d + 4] = t.y + uo.y * s),
      (f[d + 5] = t.z + uo.z * s),
      (f[d + 6] = n.x - uo.x * r),
      (f[d + 7] = n.y - uo.y * r),
      (f[d + 8] = n.z - uo.z * r),
      (f[d + 9] = n.x + uo.x * r),
      (f[d + 10] = n.y + uo.y * r),
      (f[d + 11] = n.z + uo.z * r),
      this.side.set([-1, 1, -1, 1], c * 4));
    const h = this.col,
      m = c * 16;
    for (let p = 0; p < 4; p++)
      ((h[m + p * 4] = a.r),
        (h[m + p * 4 + 1] = a.g),
        (h[m + p * 4 + 2] = a.b),
        (h[m + p * 4 + 3] = p < 2 ? o : i));
  }
  line(t, n, s, r) {
    for (let a = 0; a < t.length - 1; a++) {
      const o = a / (t.length - 1),
        i = (a + 1) / (t.length - 1);
      this.seg(
        t[a],
        t[a + 1],
        gt(t[a], n),
        gt(t[a + 1], n),
        s,
        r ? r(o) : 1,
        r ? r(i) : 1,
      );
    }
  }
  end() {
    const t = this.mesh.geometry,
      n = Math.max(this.n, 1);
    t.setDrawRange(0, this.n * 6);
    for (const [s, r] of [
      ["position", 12],
      ["aSide", 4],
      ["aCol", 16],
    ]) {
      const a = t.attributes[s];
      (a.clearUpdateRanges(), a.addUpdateRange(0, n * r), (a.needsUpdate = !0));
    }
  }
}
const sl = new l.Vector3(),
  al = new l.Vector3(),
  rl = new l.Vector3(),
  uo = new l.Vector3(),
  gt = (e, t) =>
    ((Z.position.distanceTo(e) *
      Math.tan(l.MathUtils.degToRad(Z.fov / 2)) *
      2) /
      Math.max(no.clientHeight, 1)) *
    t *
    0.5;
class E1 {
  constructor(t) {
    this.max = t;
    const n = new l.InstancedBufferGeometry(),
      s = new l.PlaneGeometry(2, 2);
    ((n.index = s.index),
      n.setAttribute("position", s.attributes.position),
      (this.pd = new Float32Array(t * 4)),
      (this.cd = new Float32Array(t * 4)),
      n.setAttribute(
        "aP",
        new l.InstancedBufferAttribute(this.pd, 4).setUsage(l.DynamicDrawUsage),
      ),
      n.setAttribute(
        "aC",
        new l.InstancedBufferAttribute(this.cd, 4).setUsage(l.DynamicDrawUsage),
      ),
      (this.mesh = new l.Mesh(
        n,
        new l.ShaderMaterial({
          uniforms: { ...g0, uXr: { value: 0.35 } },
          transparent: !0,
          depthTest: !1,
          depthWrite: !1,
          blending: l.AdditiveBlending,
          vertexShader:
            "attribute vec4 aP;attribute vec4 aC;varying vec2 vQ;varying vec4 vC;void main(){vQ=position.xy;vC=aC;vec4 mv=modelViewMatrix*vec4(aP.xyz,1.);mv.xy+=position.xy*aP.w;gl_Position=projectionMatrix*mv;}",
          fragmentShader: `${Kr}varying vec2 vQ;varying vec4 vC;uniform float uXr;void main(){float r=dot(vQ,vQ);float a=exp(-r*4.)*.7+exp(-r*22.)*1.6;float v=ovVis(.6);gl_FragColor=vec4(vC.rgb*a*vC.a*mix(uXr,1.,v),1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      As.add(this.mesh));
  }
  begin() {
    this.n = 0;
  }
  dot(t, n, s, r) {
    if (this.n >= this.max) return;
    const a = this.n++;
    (this.pd.set([t.x, t.y, t.z, n], a * 4),
      this.cd.set([s.r, s.g, s.b, r], a * 4));
  }
  end() {
    const t = this.mesh.geometry;
    t.instanceCount = this.n;
    for (const n of ["aP", "aC"]) {
      const s = t.attributes[n];
      (s.clearUpdateRanges(),
        s.addUpdateRange(0, Math.max(this.n, 1) * 4),
        (s.needsUpdate = !0));
    }
  }
}
const Eo = new nl(9e3, 0),
  nr = new nl(9e3, 0.28),
  zt = new E1(1400);
function D1(e = 720, t = 104) {
  const n = document.createElement("canvas");
  ((n.width = e), (n.height = t));
  const s = n.getContext("2d"),
    r = new l.CanvasTexture(n);
  ((r.colorSpace = l.SRGBColorSpace), (r.anisotropy = 4));
  const a = new l.Mesh(
    new l.PlaneGeometry(1, t / e),
    new l.MeshBasicMaterial({
      map: r,
      transparent: !0,
      depthTest: !1,
      depthWrite: !1,
      fog: !1,
      color: new l.Color(1.35, 1.35, 1.35),
    }),
  );
  return (
    (a.renderOrder = 10),
    (a.frustumCulled = !1),
    As.add(a),
    (a.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 0,
      pw: 0,
      set(o, i = "", c = "#7fe3ff", f = 0) {
        const d = o + "|" + i + "|" + c + "|" + f;
        if (d === this.key) return;
        ((this.key = d),
          (this.args = [o, i, c, f]),
          s.clearRect(0, 0, e, t),
          (s.font = "600 38px Outfit, sans-serif"));
        const h = s.measureText(o).width;
        s.font = "500 30px DM Mono, monospace";
        const m = i ? s.measureText(i).width + 26 : 0,
          p = Math.min(e - 8, h + m + 84),
          x = f < 0 ? 4 : f > 0 ? e - 4 - p : (e - p) / 2;
        ((this.pw = p),
          (s.fillStyle = "rgba(10,14,26,.86)"),
          lt(s, x, 8, p, t - 16, (t - 16) / 2),
          s.fill(),
          (s.fillStyle = c),
          s.beginPath(),
          s.arc(x + 34, t / 2, 9, 0, 7),
          s.fill(),
          (s.fillStyle = "#f2f6ff"),
          (s.font = "600 38px Outfit, sans-serif"),
          (s.textBaseline = "middle"),
          s.fillText(o, x + 56, t / 2 + 1),
          i &&
            ((s.fillStyle = "#9fe6ff"),
            (s.font = "500 30px DM Mono, monospace"),
            s.fillText(i, x + 56 + h + 22, t / 2 + 2)),
          (r.needsUpdate = !0));
      },
    }),
    k0.push(() => {
      const o = a.userData;
      o.args && ((o.key = ""), o.set(...o.args));
    }),
    a
  );
}
const F1 = new l.Vector3(),
  G1 = 1.75,
  s0 = { at: -9, r: [] },
  K0 = new l.Vector3();
function V1() {
  return (
    (at - s0.at > 0.4 || at < s0.at) &&
      ((s0.at = at),
      (s0.r = [
        ...document.querySelectorAll(
          ".brand,#chap,#ask,.tools,#insp,#whatif,#rail,#say.on,.br",
        ),
      ]
        .filter((e) => e.offsetParent && +getComputedStyle(e).opacity > 0.3)
        .map((e) => e.getBoundingClientRect()))),
    s0.r
  );
}
function $1(e) {
  return (
    K0.copy(e).project(Z),
    [
      ((K0.x + 1) / 2) * no.clientWidth,
      ((1 - K0.y) / 2) * no.clientHeight,
      K0.z,
    ]
  );
}
function W1(e, t, n, s) {
  if (
    e - n < 4 ||
    t - s < 4 ||
    e + n > no.clientWidth - 4 ||
    t + s > no.clientHeight - 4
  )
    return !0;
  for (const r of V1())
    if (
      e + n > r.left - 6 &&
      e - n < r.right + 6 &&
      t + s > r.top - 6 &&
      t - s < r.bottom + 6
    )
      return !0;
  return !1;
}
function O1(e, t, n = 22, s = 0) {
  n *= G1;
  const r = e.userData;
  r.pf = Ss;
  const a = (gt(t, n) * 2) / (r.h / r.w);
  (e.position.copy(t),
    e.quaternion.copy(Z.quaternion),
    e.scale.set(a, a, a),
    s &&
      e.position.addScaledVector(
        F1.set(0, 1, 0).applyQuaternion(Z.quaternion),
        (s * a * r.h) / r.w,
      ));
  let o = !1;
  if (r.want > 0) {
    const [i, c, f] = $1(e.position);
    o = f < 1 && W1(i, c, (r.pw / r.h) * n * 0.5, n * 0.42);
  }
  ((r.a += ((o ? 0 : r.want) - r.a) * (1 - Math.exp(-Bn * 8))),
    (e.material.opacity = r.a),
    (e.visible = r.a > 0.02));
}
let a0 = !0;
const Fe = (e, t, n, s = new l.Vector3()) => s.set(e + Re.city, t, n),
  Do = new l.Color(0.45, 0.85, 1.25),
  mn = new l.Color(1.6, 1.2, 0.55),
  U1 = new l.Color(0.5, 1.4, 0.95),
  il = new l.Color(1.5, 1.45, 1.4),
  Vt = new l.Vector3(),
  $t = new l.Vector3(),
  Qo = new l.Vector3(),
  po = Array.from({ length: 40 }, () => new l.Vector3()),
  ll = new l.Color(),
  cl = (e) => ll.set(cn[e].c),
  sr = [];
for (const e of Gs)
  if (e.on)
    for (let t = 0; t < 3; t++) {
      const n = e.z + (t - 1) * e.d * 0.28,
        s = e.x - (e.side * e.w) / 2,
        r = [],
        a = -40 + (t - 1) * 28,
        o = e.side * (nt.w * 0.28);
      for (let i = 0; i <= 24; i++) {
        const c = i / 24,
          f = c < 0.5 ? Ut(s, o, c * 2) : Ut(o, e.side * 22, (c - 0.5) * 2),
          d = c < 0.5 ? n : Ut(n, a, (c - 0.5) * 2);
        r.push(new l.Vector3(f, 0.12, d));
      }
      sr.push({
        pts: r,
        side: e.side,
        H: e,
        len: r.reduce((i, c, f) => (f ? i + c.distanceTo(r[f - 1]) : 0), 0),
      });
    }
function fl(e, t, n) {
  const s = e.pts.length - 1,
    r = U(t, 0, 1) * s,
    a = Math.min(Math.floor(r), s - 1);
  return n.lerpVectors(e.pts[a], e.pts[a + 1], r - a).setX(n.x + Re.city);
}
function H1(e) {
  const t = wo(e);
  let n = 0,
    s = 0;
  if (t >= 0 && t < k.steps.length) {
    const r = k.steps[t],
      a = r.t1 - r.t0;
    ((s = (e - r.t0) / a), (n = oe(0, 0.06, s) * oe(1, Tt, s)));
  }
  for (const r of Gs) r.glow && (r.glow.material.opacity = r.on ? n * 0.16 : 0);
  if (!(n < 0.01))
    for (let r = 0; r < sr.length; r++) {
      const a = sr[r];
      for (let o = 0; o < 14; o++) {
        const i = (s * 1.6 + o / 14 + Ie(r * 7.1 + o) * 0.05) % 1;
        fl(a, i, Vt);
        const c = n * oe(0, 0.08, i) * oe(1, 0.85, i);
        (zt.dot(Vt, gt(Vt, 5.5), Do, 0.8 * c),
          fl(a, Math.max(0, i - 0.012), $t),
          po[0].copy($t),
          po[1].copy(Vt),
          Eo.line(po.slice(0, 2), 3, Do, (f) => c * 0.5 * f));
      }
      nr.line(
        a.pts.map((o) => Fe(o.x, o.y, o.z, new l.Vector3())),
        1.8,
        Do,
        () => n * 0.05,
      );
    }
}
const kf = [];
function N1(e) {
  return e === 0 ? ue - 1 : ue + e - 1;
}
function X1(e) {
  const t = wo(e);
  if (t < 0 || t >= k.steps.length) return;
  const n = k.steps[t],
    s = n.t1 - n.t0,
    r = (e - n.t0) / s;
  if (r < Tt - 0.03) return;
  const a = oe(Tt - 0.03, Tt + 0.02, r) * oe(1.02, 0.96, r),
    o = N1(t);
  (Fe(Ge(o), Lt(35) + 0.3, 0.3, Vt),
    Fe(Ze.position.x, Ze.position.y + 0.5, Ze.position.z, $t));
  const i = [];
  for (let c = 0; c <= 16; c++) {
    const f = c / 16;
    i.push(
      new l.Vector3()
        .lerpVectors(Vt, $t, f)
        .add(Qo.set(0, Math.sin(Math.PI * f) * 2.2, 0)),
    );
  }
  (Eo.line(i, 5, Do, (c) => a * (0.5 + 0.5 * c)),
    zt.dot($t, gt($t, 26), Do, a * 0.9));
}
function q1(e) {
  for (let t = 0; t < ot - 1; t++) {
    const n = k.gen[t],
      s = k.steps[t + 1];
    if (!s) break;
    const r = (s.t1 - s.t0) * St * 0.95;
    if (e < n || e > n + r) continue;
    const a = (e - n) / r,
      o = ue + t,
      i = Ae[o].role,
      c = Fe(
        Ze.position.x,
        Ze.position.y + 0.5,
        Ze.position.z + Ft - 0.1,
        new l.Vector3(),
      ),
      f = Fe(Ge(o), Rt + 1.4, 1.2, new l.Vector3()),
      d = Fe(Ge(o), 0.8, 1.2, new l.Vector3()),
      h = (w) =>
        w < 0.28
          ? Qo.lerpVectors(c, f, gn(w / 0.28)).setY(
              Ut(c.y, f.y, w / 0.28) + Math.sin((Math.PI * w) / 0.28) * 1.4,
            )
          : Qo.lerpVectors(f, d, gn((w - 0.28) / 0.72));
    let m = 0;
    for (let w = 0; w < 10; w++) {
      const g = a - w * 0.018;
      if (g < 0) break;
      po[m++].copy(h(g));
    }
    const p = i === "answer" ? Do : i === "think" ? U1 : ll.set(cn.mark.c);
    m > 1 && Eo.line(po.slice(0, m), 6, p, (w) => (1 - w) * 0.9);
    const x = h(a);
    (zt.dot(x, gt(x, 16), p, 1), zt.dot(x, gt(x, 6), il, 1));
  }
}
function K1(e) {
  const t = k.firstAns;
  for (let n = t; n <= k.lastAns; n++) {
    const s = k.gen[n],
      r = (k.decode?.ms || 18) * 0.9;
    if (e < s || e > s + r) continue;
    const a = (e - s) / r;
    (Fe(Ze.position.x, Ze.position.y + 0.6, Ze.position.z, Vt),
      Fe(Ze.position.x * 0.4, 8, nt.z0 + 10, $t));
    const o = Qo.lerpVectors(Vt, $t, rc(a));
    ((o.y += Math.sin(Math.PI * a) * 10),
      zt.dot(o, gt(o, 12), mn, 1 - a * 0.6));
  }
}
const Y1 = [
  { id: "subject", c: new l.Color(1.5, 1, 0.4) },
  { id: "prev", c: new l.Color(0.95, 0.75, 1.6) },
  { id: "instr", c: new l.Color(0.5, 1.45, 0.9) },
  { id: "sink", c: new l.Color(0.7, 0.75, 0.9) },
];
function j1(e, t) {
  const n = new Float32Array(e);
  if (e < 1) return n;
  const s = Ae[e],
    r = (a) => Ae.findIndex((o, i) => i < e && o.t === a && o.role === "user");
  if (t === "prev")
    ((n[e - 1] = 0.7), e > 1 && (n[e - 2] = 0.2), e > 2 && (n[e - 3] = 0.1));
  else if (t === "sink") {
    n[0] = 0.8;
    for (let a = 1; a < e; a++) n[a] = 0.2 / (e - 1);
  } else if (t === "subject") {
    const a = r(" sky"),
      o = r(" blue"),
      i = r("Why");
    let c = 0;
    for (let f = 0; f < e; f++) {
      let d = 0.004;
      (f === a
        ? (d = 0.5)
        : f === o
          ? (d = 0.25)
          : f === i
            ? (d = 0.08)
            : Ae[f].role === "user"
              ? (d = 0.03)
              : Ae[f].role === "answer" && (d = 0.02),
        (n[f] = d),
        (c += d));
    }
    for (let f = 0; f < e; f++) n[f] /= c;
  } else if (t === "instr") {
    let a = 0;
    for (let o = 0; o < e; o++) {
      let i = 0.003;
      (Ae[o].role === "dev" &&
        (i = [" short", " sentence", " one", "Answer"].includes(Ae[o].t)
          ? 0.2
          : 0.03),
        (n[o] = i),
        (a += i));
    }
    for (let o = 0; o < e; o++) n[o] /= a;
  }
  return n;
}
function hl(e, t, n, s) {
  const r = Ge(e),
    a = Ge(t),
    o = Lt(n),
    i = Math.min(0.6 + Math.abs(r - a) * 0.34, 9);
  s.length = 0;
  for (let c = 0; c <= 14; c++) {
    const f = c / 14;
    s.push(
      Fe(
        Ut(r, a, f),
        o + Math.sin(Math.PI * f) * i * 0.35,
        0.25 + Math.sin(Math.PI * f) * i,
        new l.Vector3(),
      ),
    );
  }
  return s;
}
const Fo = [];
function Z1(e, t, n, s, r = 0) {
  if (!(e < 1 || s < 0.01)) {
    if (r > 0)
      for (let a = 0; a < e; a++)
        (hl(e, a, t, Fo),
          Eo.line(
            Fo,
            1.4,
            cl(Ae[a].role),
            (o) => s * r * (0.25 + 0.75 * Math.sin(Math.PI * o)),
          ));
    for (const a of n) {
      const o = Y1.find((c) => c.id === a.id),
        i = j1(e, a.id);
      for (let c = 0; c < e; c++) {
        const f = i[c] * a.k;
        if (
          !(f < 0.01) &&
          (hl(e, c, t, Fo),
          Eo.line(
            Fo,
            2.2 + f * 12,
            o.c,
            (d) =>
              s *
              U(0.25 + f * 2.4, 0.25, 1.3) *
              (0.4 + 0.6 * Math.sin(Math.PI * d)),
          ),
          f > 0.08 &&
            zt.dot(
              Fo[Fo.length - 1],
              gt(Fo[Fo.length - 1], 6 + f * 14),
              o.c,
              s * U(f * 2, 0.3, 1),
            ),
          f > 0.05)
        ) {
          const d = Fo.length - 1;
          for (let h = 0; h < 3; h++) {
            const m = 1 - ((at * 0.45 + h / 3 + c * 0.137) % 1),
              p = m * d,
              x = Math.min(Math.floor(p), d - 1),
              w = Qo.lerpVectors(Fo[x], Fo[x + 1], p - x);
            zt.dot(
              w,
              gt(w, 4 + f * 8),
              o.c,
              s * U(f * 2.5, 0.25, 1) * Math.sin(Math.PI * m),
            );
          }
        }
      }
    }
    (Fe(Ge(e), Lt(t), 0.3, Vt), zt.dot(Vt, gt(Vt, 18), mn, s));
  }
}
function Q1(e) {
  const t = k.steps[0],
    n = t.t1 - t.t0,
    s = (e - t.t0) / (n * St);
  if (!(s < 0 || s > 1.15))
    for (let r = 0; r < ue; r += 1) {
      const a = U(s * 1.3 - (r / ue) * 0.3, 0, 1);
      if (a <= 0 || a >= 1) continue;
      const o = Ge(r);
      (Vt.set(o * 0.3 + Re.city, 6, nt.z0), $t.set(o + Re.city, _e + 0.4, 0.4));
      const i = Qo.lerpVectors(Vt, $t, gn(a));
      ((i.y += Math.sin(Math.PI * a) * 4),
        zt.dot(i, gt(i, 7), cl(Ae[r].role).multiplyScalar(1.4), 1 - a * 0.3));
    }
}
function J1(e, t, n, s) {
  if (n < 0.02) return;
  const r = Lt(e),
    a = (o, i, c) => {
      const f = tr(o, e);
      Fe(Ge(o), r, 0.05, Vt);
      const d = Fe(Ge(o), r + 0.1, -0.7, new l.Vector3());
      (po[0].copy(Vt),
        po[1].copy(d),
        Eo.line(po.slice(0, 2), c ? 4 : 1.2, c ? mn : Do, () => i));
      for (const h of f) {
        (ji(h.e, e, $t), ($t.x += Re.city), ($t.y += 0.45));
        const m = [];
        for (let p = 0; p <= 10; p++) {
          const x = p / 10;
          m.push(
            new l.Vector3()
              .lerpVectors(d, $t, x)
              .add(Qo.set(0, Math.sin(Math.PI * x) * 0.9, 0)),
          );
        }
        if (
          (Eo.line(
            m,
            c ? 1.5 + h.w * 7 : 0.9,
            c ? mn : Do,
            (p) =>
              i * (c ? 0.5 + h.w : 0.35) * (0.4 + 0.6 * Math.sin(Math.PI * p)),
          ),
          c)
        ) {
          zt.dot($t, gt($t, 10 + h.w * 18), mn, i);
          for (let p = 0; p < 2; p++) {
            const x = (at * 0.5 + p / 2 + h.e * 0.01) % 1,
              w = x * 10,
              g = Math.min(Math.floor(w), 9),
              u = Qo.lerpVectors(m[g], m[g + 1], w - g);
            zt.dot(u, gt(u, 6), mn, i * Math.sin(Math.PI * x));
          }
        }
      }
    };
  if (s) for (let o = 0; o < ue; o++) o !== t && a(o, n * s * 0.22, !1);
  t >= 0 && a(t, n, !0);
}
const ar = new l.Vector3();
function e2(e) {
  const t = wo(e);
  if (t < 0 || t >= k.steps.length) return;
  const n = k.steps[t],
    s = es(n, e);
  if (s < 0 || s > 36) return;
  const r = _e + s * _t,
    a = oe(0, 1.5, s) * oe(36, 34.5, s);
  for (let o = 0; o < un.count; o++) {
    const i = jo[o];
    (ar
      .set(i.w / 2 - 0.25, r, wt / 2 + 0.15)
      .applyAxisAngle(Zt, i.rot)
      .add(Vt.set(i.x + Re.city, 0, i.z)),
      zt.dot(ar, gt(ar, 9), Do, 0.85 * a));
  }
}
function t2(e) {
  if (Je !== "city") return;
  const t = Y[Ee].c,
    n = U((Se - Y[Ee].t0) / t.dur, 0, 1);
  (H1(e), e2(e), X1(e), q1(e), K1(e), Q1(e));
  const s = t.att ? t.att(n, e) : null;
  s && Z1(s.q, s.L, s.heads, s.k, s.fan || 0);
  const r = t.ex ? t.ex(n, e) : null;
  (z1(e, r ? r.L : 3, r ? r.c : -1, r ? r.k : 0),
    r && J1(r.L, r.c, r.k, r.all || 0),
    o2(e, t, n));
}
const Nn = {};
function At(e, t, n, s, r, a = {}) {
  const o = D1();
  return ((Nn[e] = { m: o, pos: t, text: n, sub: s, dot: r, ...a }), Nn[e]);
}
(At(
  "yours",
  () => Fe(je + (to * Et) / 2, Rt + 4.5, 0),
  () => "Your conversation",
  () => `${(to + (De.hist ? Aa - Pa : 0)).toLocaleString("en")} tokens`,
  "#ffb454",
),
  At(
    "other",
    () => {
      const e = jo[0];
      return Fe(e.x, Rt + 4, e.z);
    },
    () => "Another conversation",
    () => `${Math.round(jo[0].cols).toLocaleString("en")} tokens`,
    "#9db0e0",
  ),
  At(
    "other2",
    () => {
      const e = jo[3];
      return Fe(e.x, Rt + 4, e.z);
    },
    () => "Another",
    () => `${Math.round(jo[3].cols).toLocaleString("en")} tokens`,
    "#9db0e0",
  ),
  At(
    "hbm",
    () => {
      const e = Gs[1];
      return Fe(e.x - e.side * e.w * 0.2, e.h + 6, e.z);
    },
    () => "Memory \xB7 16 GB",
    () => "\xD7 5",
    "#7fe3ff",
  ),
  At(
    "floors",
    () => Fe(je - 1.4, Lt(17), 0.4),
    () => "36 floors",
    () => "= 36 layers",
    "#7df0b4",
    { align: 1 },
  ),
  At(
    "floor1",
    () => Fe(je - 1.2, Lt(0), 0.4),
    () => "Floor 1",
    () => "",
    "#7df0b4",
    { align: 1 },
  ),
  At(
    "floor36",
    () => Fe(je - 1.2, Lt(35), 0.4),
    () => "Floor 36",
    () => "",
    "#7df0b4",
    { align: 1 },
  ),
  At(
    "user",
    () => {
      const e = Go((t) => t.role === "user");
      return Fe((Ge(e) + Ge(e + 5)) / 2, _e + 1.4, 1.2);
    },
    () => tt.user,
    () => "you \xB7 6 tokens",
    "#ffb454",
  ),
  At(
    "sys",
    () => Fe(Ge(28), _e + 1.4, 1.2),
    () => "The header",
    () => `${ko("sys")} tokens`,
    "#9db0e0",
  ),
  At(
    "dev",
    () => {
      const e = Go((t) => t.role === "dev");
      return Fe(Ge(e + 5), _e + 1.4, 1.2);
    },
    () => "The app\u2019s instruction",
    () => `${ko("dev")} tokens`,
    "#b9a2ff",
  ),
  At(
    "wheel",
    () => Fe(Ze.position.x, Ze.position.y + 2.6, Ze.position.z),
    () => "The guess",
    () => "odds for the next token",
    "#ffd27a",
  ),
  At(
    "cache",
    () => Fe(je + Math.min(ue, to) * Et * 0.5, Lt(24), 0.4),
    () => "Lit windows = the cache",
    () => ao(Math.min(to, oo) * zo),
    "#7fe3ff",
  ),
  At(
    "kept",
    () => Fe(je + to * Et * 0.5, Lt(12), 0.4),
    () => "Kept a few minutes",
    () => "in case you reply",
    "#7df0b4",
  ),
  At(
    "newest",
    () => Fe(Ge(Math.max(to - 1, 0)), Rt + 1.6, 0.6),
    () => "Newest token",
    () => bt(Ae[Math.max(to - 1, 0)]?.t || ""),
    "#7fe3ff",
  ),
  At(
    "router",
    () => {
      const e = Go((t) => t.t === " blue" && t.role === "user");
      return Fe(Ge(e), Lt(3) + 1.4, -0.6);
    },
    () => "Router",
    () => "picks 4 of 128",
    "#ffd27a",
  ),
  At(
    "experts",
    () => Fe(je + to * Et * 0.3, _e + 3 * _t + 1.6, -wt / 2),
    () => "128 experts",
    () => "on this floor",
    "#7fe3ff",
  ),
  At(
    "query",
    () => {
      const e = Go((t) => t.t === " blue" && t.role === "user");
      return Fe(Ge(e), Lt(3) + 1.1, 0.6);
    },
    () => "\xB7blue",
    () => "asks",
    "#ffd27a",
  ),
  At(
    "key",
    () => {
      const e = Go((t) => t.t === " sky" && t.role === "user");
      return Fe(Ge(e), Lt(3) - 1.1, 0.6);
    },
    () => "\xB7sky",
    () => "answers",
    "#ffb454",
  ));
let Mf = null;
function o2(e, t, n) {
  const s = typeof t.tags == "function" ? t.tags(n) : t.tags || [];
  for (const r in Nn) {
    const a = Nn[r],
      o = a.m,
      i = o.userData,
      c = a0 && s.includes(r) ? 1 : 0;
    ((i.want = c),
      c || i.a > 0.02
        ? (i.set(a.text(), a.sub(), a.dot, a.align || 0), O1(o, a.pos(), 19, 0))
        : ((o.visible = !1), (i.a = 0)));
  }
}
function n2() {
  for (const e in Nn) ((Nn[e].m.visible = !1), (Nn[e].m.userData.a = 0));
}
const dl = (e, t = new l.Vector3()) => t.set(e[0] + Re.desk, e[1], e[2]);
function s2() {
  return (
    Ye.window || [Ye.laptop[0] + 1.2, Ye.laptop[1] + 0.8, Ye.laptop[2] - 1.6]
  );
}
const rr = new l.Vector3(),
  Y0 = new l.Vector3(),
  ir = [],
  a2 = new l.Vector3(),
  r2 = new l.Vector3(),
  i2 = new l.Vector3();
function l2(e) {
  const t = Y[Ee].c;
  (dl(Ye.screen || Ye.laptop, Y0), dl(s2(), rr));
  const n = k.send,
    s = k.send + (k.arrive - k.send) * 0.38;
  if (e > n + 0.001 && e <= s + 0.6) {
    const r = U((e - n) / (s - n), 0, 1),
      a = a2.set(1, 0, 0).applyQuaternion(Z.quaternion),
      o = r2.set(0, 1, 0).applyQuaternion(Z.quaternion),
      i = i2.copy(Y0);
    i.y += 0.13;
    for (let f = 0; f < 4; f++) {
      const d = (r * 3.2 + f / 4) % 1,
        h = 0.03 + d * 0.42;
      ir.length = 0;
      for (let m = 0; m <= 48; m++) {
        const p = (m / 48) * Math.PI * 2;
        ir.push(
          i
            .clone()
            .addScaledVector(a, Math.cos(p) * h)
            .addScaledVector(o, Math.sin(p) * h),
        );
      }
      Eo.line(
        ir,
        1.8,
        Do,
        () => (1 - d) * (1 - d) * 0.9 * (1 - oe(0.85, 1, r)),
      );
    }
    const c = Qo.lerpVectors(Y0, rr, gn(r));
    ((c.y += Math.sin(Math.PI * r) * 0.25),
      zt.dot(c, gt(c, 22), mn, 1 - oe(0.9, 1, r)),
      zt.dot(c, gt(c, 8), il, 1 - oe(0.9, 1, r)));
  }
  if (
    t.id === "stream" ||
    t.id === "request" ||
    t.id === "enter" ||
    t.id === "stop" ||
    t.id === "recap"
  )
    for (let r = k.firstAns; r <= k.lastAns; r++) {
      const a = k.arr[r],
        o = 6;
      if (e < a - o || e > a + 0.5) continue;
      const i = U((e - (a - o)) / o, 0, 1),
        c = Qo.lerpVectors(rr, Y0, gn(i));
      ((c.y += Math.sin(Math.PI * i) * 0.2),
        zt.dot(c, gt(c, 9), Do, 0.9 * (1 - oe(0.95, 1.05, i))));
    }
}
const ko = (e) => Ae.filter((t) => t.role === e).length,
  Go = (e) => Ae.findIndex(e),
  Ge = (e) => je + (e + 0.5) * Et,
  Lt = (e) => _e + (e + 0.5) * _t + (e > ho.L ? ho.g : 0),
  Vo = () => k.firstAns,
  ul = () => k.lastAns,
  Mo = (e, t) => k.steps[e].t0 + t * (k.steps[e].t1 - k.steps[e].t0),
  $o = (e) =>
    e >= 0.995
      ? ">99%"
      : e < 0.001
        ? "<0.1%"
        : (e * 100).toFixed(e >= 0.1 ? 0 : 1) + "%",
  Sf = '<span class="k">',
  yn = {
    cityHero: () => ({
      set: "city",
      t: [0, 21, 0],
      yaw: -0.34,
      pitch: 0.07,
      dist: 128,
      r: 80,
    }),
    cityWide: () => ({
      set: "city",
      t: [0, 6, -60],
      yaw: -0.62,
      pitch: 0.42,
      dist: 300,
      r: 220,
    }),
    front: () => ({
      set: "city",
      t: [0, 21, 0],
      yaw: -0.08,
      pitch: 0.06,
      dist: 88,
      r: 50,
    }),
    userBase: () => {
      const e = Go((n) => n.role === "user"),
        t = e + 5;
      return {
        set: "city",
        t: [(Ge(e) + Ge(t)) / 2, 1.8, 0],
        yaw: -0.34,
        pitch: 0.1,
        dist: 9,
        r: 4,
      };
    },
    promptBase: () => ({
      set: "city",
      t: [Ge(Math.floor(ue / 2)), 2.4, 0],
      yaw: -0.3,
      pitch: 0.12,
      dist: 30,
      r: 16,
    }),
    floorAt: (e, t, n = {}) => ({
      set: "city",
      t: [Ge(t), Lt(e), 0.2],
      yaw: -0.62,
      pitch: 0.08,
      dist: 7,
      r: 3.5,
      ...n,
    }),
    roof: (e) => ({
      set: "city",
      t: [Ge(e) - 2, Rt + 3, -1],
      yaw: -0.42,
      pitch: 0.3,
      dist: 22,
      r: 10,
    }),
    edge: (e) => ({
      set: "city",
      t: [Ge(e) - 6, Rt * 0.55, 0],
      yaw: -0.55,
      pitch: 0.16,
      dist: 44,
      r: 24,
    }),
    hbm: () => ({
      set: "city",
      t: [-nt.w / 2 - 30, 26, nt.z0 - nt.d / 2],
      yaw: -1.05,
      pitch: 0.18,
      dist: 160,
      r: 90,
    }),
    laptop: () => Ia.laptop(),
    screen: () => Ia.screen(),
    study: () => Ia.study(),
    dcOut: () => ns.outside(),
    door: () => ns.door(),
    hall: () => ns.hall(),
    rack: () => ns.rack(),
    server: () => ns.server(),
    gpu: () => ns.gpu(),
    tape: () => ({
      set: "stage",
      t: [0.25, 2.4, -1.2],
      yaw: -0.08,
      pitch: 0.07,
      dist: 18.5,
      r: 7,
    }),
    tiles: () => ({
      set: "stage",
      t: [0.6, 0.7, 2.1],
      yaw: -0.06,
      pitch: 0.72,
      dist: 9.6,
      r: 5,
    }),
    table: () => ({
      set: "stage",
      t: [0, 1.6, 0],
      yaw: -0.5,
      pitch: 0.22,
      dist: 12,
      r: 6,
    }),
    dice: () => ({
      set: "city",
      t: [Ze.position.x, Rt + 0.6, Ze.position.z],
      yaw: -0.18,
      pitch: 0.62,
      dist: 13,
      r: 6,
    }),
  },
  he = (e, ...t) => yn[e](...t),
  c2 = (e) => {
    const t = Pn(e),
      n = wo(t);
    if (n < 1) return ue - 1;
    if (n >= k.steps.length) return oo - 1;
    const s = k.steps[n],
      r = U((t - s.t0) / (s.t1 - s.t0), 0, 1);
    return ue + n - 2 + j0(U(r / 0.25, 0, 1));
  };
((yn.follow =
  (e = {}) =>
  (t) => {
    const n = c2(t);
    return {
      set: "city",
      t: [je + (n + 0.5) * Et - (e.dx ?? 4), e.y ?? Rt * 0.55, e.z ?? 0],
      yaw: e.yaw ?? -0.5,
      pitch: e.pitch ?? 0.12,
      dist: e.dist ?? 40,
      r: e.r ?? 20,
    };
  }),
  (yn.rise =
    (e = {}) =>
    (t) => {
      const n = Pn(t),
        s = k.steps[0] ? U(es(k.steps[0], n), 0, 36) : 0;
      return {
        set: "city",
        t: [e.x ?? 0, _e + s * _t, 0],
        yaw: e.yaw ?? -0.2,
        pitch: e.pitch ?? 0.05,
        dist: e.dist ?? 56,
        r: e.r ?? 30,
      };
    }));
const Qe = [];
(Qe.push({
  id: "title",
  tags: (e) => (e > 0.15 && e < 0.9 ? ["yours"] : []),
  act: "",
  n: "Intro",
  title: "What happens when you <i>send a prompt</i>?",
  dur: 9,
  T: () => [
    [0, 0],
    [0.1, 0],
    [0.9, k.total],
    [1, k.total],
  ],
  cam: () => [
    [
      0,
      { set: "city", t: [2, 24, 0], yaw: -0.58, pitch: 0.02, dist: 118, r: 70 },
    ],
    [1, { ...he("cityHero"), yaw: -0.26, dist: 132 }],
  ],
  body: () =>
    `You ask <b class="a">\u201C${tt.user}\u201D</b>. <b class="c">${It(k.total)} seconds</b> later the answer is on your screen. In between, your words cross the internet, are cut into ${yt().toLocaleString("en")} pieces and sent up a tower of 36 floors inside a chip. Then the model writes, one piece at a time, climbing the tower again for every piece: <b>${ot} trips</b>. That was it, just now. Let\u2019s slow it down.`,
  nums: () => [
    ["Total", It(k.total), "s"],
    ["Tokens read", yt().toLocaleString("en"), ""],
    ["Tokens written", String(ot), ""],
  ],
  deep: () => [
    "Everything here is one real run of a real model: <b>gpt-oss-120b</b>, OpenAI\u2019s open model, asked this question on 1 October 2026. The words, the pieces and the probabilities are its own. The timings come from a model of the machine it runs on (one H100 GPU, shared with 31 other conversations).",
    "Press <b>Play</b>, drag the rail, or use the switches on the right to change the run.",
  ],
  tryB: [
    ["Play it", () => Ln(!0), "a"],
    ["What if it thinks a lot?", () => ys("think", 1, "think")],
  ],
}),
  Qe.push({
    id: "enter",
    act: "Act I \xB7 The message",
    n: "Enter",
    title: "You press Enter",
    dur: 10,
    T: () => [
      [0, 0],
      [0.74, 0],
      [1, k.send],
    ],
    cam: () => [
      [0, he("study")],
      [0.22, he("study")],
      [0.45, he("laptop")],
      [1, he("screen")],
    ],
    body: () =>
      "You type a question into a chat app and press Enter. It feels like texting someone. But nobody on the other end remembers you: a program will read your words, and everything around them, from the very beginning. First they have to get there.",
    like: "writing to a very fast pen pal with no memory at all.",
    nums: () => [
      ["Words", "5", ""],
      ["Characters", String(tt.user.length), ""],
      ["Sent at", It(k.send), "s"],
    ],
    deep: () => [
      "The app keeps a connection to the server open and already encrypted (TLS), so the request can leave the moment you press Enter.",
      "Some apps open that connection when you start typing, to save the round trip.",
    ],
  }),
  Qe.push({
    id: "request",
    act: "Act I \xB7 The message",
    n: "Request",
    title: "What your app really sends",
    dur: 16,
    T: () => [
      [0, k.send],
      [1, k.send],
    ],
    cam: () => {
      const e = Ne.lapRy,
        t = Ye.laptop,
        n = [t[0] + Math.cos(e) * 0.27, t[1] + 0.17, t[2] - Math.sin(e) * 0.27];
      return [
        [0, he("screen")],
        [
          0.2,
          {
            set: "desk",
            t: n,
            yaw: e - 0.02,
            pitch: 0.16,
            dist: 1.45,
            f: [n[0] + Math.sin(e) * 0.1, n[1], n[2] + Math.cos(e) * 0.1],
            r: 0.5,
          },
        ],
        [
          1,
          {
            set: "desk",
            t: n,
            yaw: e + 0.08,
            pitch: 0.18,
            dist: 1.55,
            r: 0.55,
          },
        ],
      ];
    },
    body: () =>
      `Not just your question. The app sends a small text file with the <b>model</b> it wants, <b class="v">its own instructions</b> (here: \u201C${tt.dev
        .split(
          `
`,
        )
        .pop()}\u201D), <b>every earlier message</b> in the chat, and settings for how much to <b>think</b> and how <b>random</b> to be. The model keeps nothing between messages: if it \u201Cremembers\u201D what you said before, it is because the app sent it again.`,
    like: "someone who rereads the whole letter thread before every reply.",
    nums: () => [
      ["Size", "0.4", "KB"],
      ["Messages", De.hist ? "41" : "2", ""],
      ["Remembered", "0", ""],
    ],
    deep: () => [
      "<code>stream: true</code> asks for the answer piece by piece, as it is written, instead of all at once at the end.",
      "<code>temperature: 1.0</code> is how random each word choice may be (1.0 is what this model\u2019s makers recommend).",
      '<code>reasoning_effort: "low"</code> asks it to think only briefly before answering.',
      "Your login (or an API key) says who is asking and who pays; it never reaches the model.",
    ],
  }),
  Qe.push({
    id: "trip",
    act: "Act I \xB7 The message",
    n: "Internet",
    title: "Across the internet",
    dur: 9,
    T: () => [
      [0, k.send],
      [1, k.arrive],
    ],
    cam: () => {
      const e = Ye.window,
        t = he("laptop");
      return [
        [0, { ...t, dist: 1.7 }],
        [
          0.42,
          {
            ...t,
            t: [
              e[0] * 0.5 + t.t[0] * 0.5,
              e[1] * 0.6 + t.t[1] * 0.4,
              e[2] * 0.5 + t.t[2] * 0.5,
            ],
            pitch: 0.12,
            dist: 2.6,
            f: e,
            r: 1.4,
          },
        ],
        [0.5, { ...he("dcOut") }],
        [1, he("dcOut")],
      ];
    },
    body: () =>
      `The request, about 400 bytes, leaves your laptop as radio waves, becomes flashes of light in a fibre, and crosses about 2,000 km of glass and a dozen routers to a data center: <b class="c">${Ho} ms</b>. That trip is a story of its own.`,
    nums: () => [
      ["One way", String(Ho), "ms"],
      ["Distance", "~2,000", "km"],
      ["Encrypted", "yes", ""],
    ],
    deep: () => [
      "Light in glass covers 204 km per millisecond; the rest of the 24 ms is routers and queues on the way.",
      "The connection is encrypted end to end: none of the routers on the way can read your question.",
    ],
    tryB: [
      [
        "See that trip: How the Internet Works",
        () => window.open("https://sael.net/internet/", "_blank", "noopener"),
      ],
    ],
  }),
  Qe.push({
    id: "door",
    act: "Act I \xB7 The message",
    n: "Front door",
    title: "The front door",
    dur: 14,
    T: () => [
      [0, k.arrive],
      [0.3, k.gate],
      [0.72, k.safe],
      [0.88, k.lb],
      [1, k.lb + 0.05],
    ],
    cam: () => [
      [0, he("dcOut")],
      [0.25, he("door")],
      [1, { ...he("door"), yaw: -0.05, dist: 11 }],
    ],
    body: () =>
      'A gateway checks <b>who you are</b> (your login or API key), <b>how much you have used</b> (limits per minute), and which <b>model</b> you asked for. A small, fast <b class="r">safety model</b> reads the prompt. Then a load balancer picks a server whose GPU has room, ideally one that still holds this conversation from last time.',
    like: "a hotel desk: check the booking, check the bag, hand over a room key.",
    nums: () => [
      ["Checks", "3", ""],
      ["Safety", "6", "ms"],
      ["Picked", "1", "GPU"],
    ],
    deep: () => [
      "Limits are counted in requests and in <b>tokens</b> per minute, because tokens are what cost money to compute.",
      "Big services run the same model on thousands of GPUs in several regions; the gateway sends you to one near you with free capacity.",
      "Sending a conversation back to the server that already holds its beginning (<b>cache-aware routing</b>) saves re-reading it. You\u2019ll see why that matters.",
      "Safety checks vary by provider; some run beside the model instead of before it.",
    ],
  }),
  Qe.push({
    id: "template",
    act: "Act II \xB7 Words into numbers",
    n: "Template",
    title: "One long piece of text",
    dur: 16,
    T: () => [
      [0, k.lb + 0.05],
      [1, k.lb + 0.12],
    ],
    cam: () => [
      [0, { ...he("tape"), yaw: -0.18, dist: 19.5 }],
      [1, { ...he("tape"), yaw: -0.06, dist: 18.5 }],
    ],
    body: () =>
      'The model never sees \u201Cmessages\u201D. The server glues everything into <b>one long text</b> with the model\u2019s own template: a <b class="s">header</b> (who it is, today\u2019s date, how hard to think), <b class="v">the app\u2019s instructions</b>, <b class="a">your message</b>, and markers between them. It ends with <code>&lt;|start|&gt;assistant</code>, an unfinished line. Everything the model does from here is <b>continue this text</b>.',
    like: "a play script whose last line is a speaker\u2019s name and nothing else.",
    nums: () => [
      [
        "Characters",
        String(tt.sys.length + tt.dev.length + tt.user.length + 80),
        "",
      ],
      [
        "Yours",
        Math.round(
          (tt.user.length /
            (tt.sys.length + tt.dev.length + tt.user.length + 80)) *
            100,
        ) + "%",
        "",
      ],
      ["Speakers", "3", ""],
    ],
    deep: () => [
      "This is the \u201Charmony\u201D format gpt-oss was trained on. The first line, <i>You are ChatGPT, a large language model trained by OpenAI</i>, is its default header, even when it runs somewhere else.",
      "Real chat apps add much longer instructions: rules, tools, the user\u2019s saved preferences. Often thousands of words, before your first one.",
      "<b>Reasoning: low</b> in the header is the \u201Cthink a little\u201D setting, written into the text itself.",
    ],
  }),
  Qe.push({
    id: "tokens",
    act: "Act II \xB7 Words into numbers",
    n: "Tokens",
    title: "Chopped into <i>tokens</i>",
    dur: 20,
    T: () => [
      [0, k.lb + 0.12],
      [1, k.tok],
    ],
    cam: () => [
      [0, he("tape")],
      [0.3, he("tape")],
      [0.62, he("tiles")],
      [1, { ...he("tiles"), yaw: 0.05, dist: 9.2 }],
    ],
    body: () =>
      `The text is cut into <b>tokens</b>, pieces from a fixed list of <b>${Me.vocab.toLocaleString("en")}</b>. Common words are one piece (<span class="tk">\xB7sky</span> is number 17,307), rare ones are split (<span class="tk">\xB7Chat</span><span class="tk">GPT</span>), a space usually rides on the next word, and numbers come in chunks of up to three digits (<span class="tk">202</span><span class="tk">6</span>). Your question is <b class="a">${ko("user")} tokens</b>. The whole text is <b>${yt().toLocaleString("en")}</b>.`,
    like: "a box of Lego: a fixed set of bricks that can build any text.",
    nums: () => [
      ["Tokens", yt().toLocaleString("en"), ""],
      ["Vocabulary", "201,088", ""],
      ["Yours", String(ko("user")), ""],
    ],
    deep: () => [
      "The list was built before training (byte-pair encoding): start from the 256 possible bytes, merge the most common neighbouring pair into a new piece, and repeat about 200,000 times.",
      "Markers like <code>&lt;|start|&gt;</code> are special tokens that can\u2019t be typed: they are how the model tells the speakers apart.",
      "This is the same tokenizer as GPT-4o and newer OpenAI models (o200k), plus the markers. English averages about 4 characters per token; other languages often need more.",
      "Models are priced and limited in tokens, not words: this prompt is 86.",
    ],
    tryB: [["Split your own text", () => G2()]],
  }),
  Qe.push({
    id: "queue",
    act: "Act II \xB7 Words into numbers",
    n: "Queue",
    title: "Waiting for the next step",
    dur: 12,
    T: () => [
      [0, k.tok],
      [1, k.admit],
    ],
    cam: () => [
      [0, he("hall")],
      [0.3, he("rack")],
      [0.62, he("rack")],
      [0.84, he("server")],
      [1, he("gpu")],
    ],
    body: () =>
      `The GPU is not waiting for you. It is already writing answers for <b>${xo() - 1} other conversations</b>, in <b>steps</b>: each step writes one more token for every one of them at once, about every <b class="c">${Qt(k.decode.ms)} ms</b>. Your request boards the next step, after <b>${Qt(k.wait)} ms</b>.`,
    like: "a train that leaves every 18 milliseconds: you board the next one.",
    nums: () => [
      ["Waited", Qt(k.wait), "ms"],
      ["Others", String(xo() - 1), ""],
      ["Step", Qt(k.decode.ms), "ms"],
    ],
    deep: () => [
      "This is <b>continuous batching</b>: conversations join and leave the batch at every step, instead of waiting for a whole group to finish.",
      "A long prompt can be split over several steps (chunked prefill) so the others\u2019 answers don\u2019t stall while it is read.",
      "The server\u2019s CPU did the template and the tokens; from here on, everything happens on the GPU.",
    ],
  }),
  Qe.push({
    id: "chip",
    viz: (e, t, n) => Mr.memory(e, t, n),
    tags: (e) =>
      e < 0.2
        ? []
        : e < 0.62
          ? ["yours", "other", "other2", "hbm"]
          : ["yours", "floors", "hbm"],
    act: "Act III \xB7 Inside the model",
    n: "The chip",
    title: "A city of conversations",
    dur: 16,
    T: () => [
      [0, k.admit],
      [1, k.admit],
    ],
    cam: () => [
      [0, he("gpu")],
      [0.1, he("gpu")],
      [
        0.2,
        {
          set: "city",
          t: [0, 0, -110],
          yaw: 0,
          pitch: 1.42,
          dist: 520,
          r: 400,
        },
      ],
      [
        0.36,
        {
          set: "city",
          t: [0, 0, -100],
          yaw: -0.2,
          pitch: 1.1,
          dist: 420,
          r: 320,
        },
      ],
      [0.62, he("cityWide")],
      [1, he("cityHero")],
    ],
    body: () =>
      "The model lives on one <b>H100 GPU</b>: 80 GB of fast memory beside 132 compute units. gpt-oss-120b\u2019s <b>117 billion numbers</b>, its <b>weights</b>, learned in training, fill 61 GB of it; the rest holds the conversations. Up close the chip is a city: <b>every tower is one conversation</b>, one column per token, and every tower has <b>36 floors</b>, because the model has 36 layers. Yours is in front.",
    like: "a city where every building is a conversation, all built to the same plan.",
    nums: () => [
      ["Weights", "61", "GB"],
      ["Memory", "80", "GB"],
      ["Towers", String(xo()), ""],
    ],
    deep: () => [
      "The 5 memory stacks (HBM3) move <b>3.35 TB/s</b> to the compute units. A sixth site on the chip is unused.",
      "The weights are stored in a 4-bit format (MXFP4) for the experts; at full 16-bit precision the model would need twice the memory.",
      "The chip can do about 1,000 trillion arithmetic operations a second at 16-bit precision, but for writing text, reading the weights from memory is the slow part. That comes back later.",
    ],
  }),
  Qe.push({
    id: "embed",
    emb: (e) => ({
      on: oe(0.6, 0.66, e),
      u: U((e - 0.6) / 0.4, 0, 1) * 0.62 + 0.3,
    }),
    tags: (e) => (e > 0.62 ? ["user", "dev"] : []),
    act: "Act III \xB7 Inside the model",
    n: "Embedding",
    title: "Every token becomes <i>2,880 numbers</i>",
    dur: 16,
    T: () => [
      [0, k.admit],
      [1, Mo(0, St)],
    ],
    cam: () => [
      [
        0,
        {
          set: "stage",
          t: [1.9, 2.9, -0.8],
          yaw: -0.2,
          pitch: 0.1,
          dist: 17.5,
          r: 8,
        },
      ],
      [
        0.58,
        {
          set: "stage",
          t: [2.2, 2.7, -0.5],
          yaw: -0.08,
          pitch: 0.12,
          dist: 17,
          r: 8,
        },
      ],
      [
        0.62,
        {
          set: "city",
          t: [Ge(Math.floor(ue * 0.6)), 3, 2],
          yaw: -0.25,
          pitch: 0.12,
          dist: 26,
          r: 14,
        },
      ],
      [
        1,
        {
          set: "city",
          t: [Ge(Math.floor(ue * 0.7)), 3.4, 1],
          yaw: -0.12,
          pitch: 0.1,
          dist: 30,
          r: 16,
        },
      ],
    ],
    body: () =>
      `Each token number opens one row of a table: <b>${Me.vocab.toLocaleString("en")} rows</b>, one per token, <b>${Me.width.toLocaleString("en")} numbers</b> each. That row is the token\u2019s starting meaning, learned in training. Tokens used alike get similar rows: <span class="tk">\xB7sky</span> lands near <span class="tk">\xB7clouds</span>, far from <span class="tk">\xB7spoon</span>. These numbers are what climbs the tower.`,
    like: "a dictionary where every word is written as 2,880 dials.",
    nums: () => [
      ["Rows", "201,088", ""],
      ["Numbers each", "2,880", ""],
      ["Table", "1.16", "GB"],
    ],
    deep: () => [
      "The numbers are learned: nobody chose them. Training nudged them, a little at a time, until they made good predictions.",
      "Where a token sits in the text is added later, on every floor, by rotating parts of these numbers by an angle that grows with the position (RoPE).",
      "There is a second table of the same size at the top of the tower: it turns the final numbers back into a score for every token.",
    ],
  }),
  Qe.push({
    id: "tower",
    tags: (e) => (e < 0.5 ? ["floor1", "floor36"] : ["floors", "yours"]),
    act: "Act III \xB7 Inside the model",
    n: "36 floors",
    title: "Up <i>36 floors</i>",
    dur: 16,
    T: () => [
      [0, Mo(0, St)],
      [1, Mo(0, St + ((Tt - St) * 2.6) / 36)],
    ],
    cam: () => [
      [0, { ...he("promptBase"), dist: 36 }],
      [1, { ...he("front"), dist: 64 }],
    ],
    body: () =>
      `All ${yt().toLocaleString("en")} tokens climb together, floor by floor. On every floor the same two things happen: the tokens <b class="c">look back</b> at the ones before them, then each one <b class="m">thinks on its own</b>. A floor doesn\u2019t replace a token\u2019s numbers: it <b>adds its notes</b> to them. By the top, the numbers carry what the model has worked out.`,
    like: "a form passed up an office tower: every floor adds a note, nobody erases.",
    nums: () => [
      ["Floors", "36", ""],
      ["Per floor", "2", "jobs"],
      ["Numbers", "2,880", "per token"],
    ],
    deep: () => [
      "Those running notes are called the <b>residual stream</b>. Each floor reads it, computes something, and adds the result back.",
      "Before each job the numbers are rescaled (RMSNorm) so they stay in a workable range 36 floors up.",
      "Every floor has its own weights: the 36 floors look alike but have learned different things.",
    ],
  }),
  Qe.push({
    id: "attention",
    tags: (e) => (e > 0.25 && e < 0.7 ? ["query", "key"] : []),
    att: (e, t) => ({
      q: Go((n) => n.t === " blue" && n.role === "user"),
      L: 3,
      k: oe(0, 0.1, e),
      fan: oe(0.12, 0.3, e) * 0.22,
      heads: [
        { id: "subject", k: oe(0.05, 0.22, e) },
        { id: "prev", k: oe(0.6, 0.72, e) * 0.8 },
        { id: "sink", k: oe(0.64, 0.76, e) * 0.7 },
        { id: "instr", k: oe(0.68, 0.8, e) * 0.6 },
      ],
    }),
    act: "Act III \xB7 Inside the model",
    n: "Attention",
    title: "Looking back <i>(attention)</i>",
    dur: 22,
    T: () => {
      const e = Mo(0, St + ((Tt - St) * 2.6) / 36),
        t = Mo(0, St + ((Tt - St) * 3.2) / 36);
      return [
        [0, e],
        [1, t],
      ];
    },
    cam: () => {
      const e = Go((n) => n.t === " blue" && n.role === "user"),
        t = Ge(e);
      return [
        [
          0,
          {
            set: "city",
            t: [t - 3, Lt(3), 1.5],
            yaw: 0.16,
            pitch: 0.34,
            dist: 16,
            r: 8,
          },
        ],
        [
          0.3,
          {
            set: "city",
            t: [t - 9, Lt(3), 3],
            yaw: 0.1,
            pitch: 0.62,
            dist: 28,
            r: 14,
          },
        ],
        [
          1,
          {
            set: "city",
            t: [t - 12, Lt(3), 3.5],
            yaw: 0.05,
            pitch: 0.7,
            dist: 34,
            r: 18,
          },
        ],
      ];
    },
    body: () =>
      'Each token asks a question (a <b class="c">query</b>) and every earlier token shows a label (a <b class="v">key</b>). Where they match, the token takes in that token\u2019s <b class="a">value</b>. That\u2019s how <span class="tk">\xB7blue</span> can learn it belongs to <span class="tk">\xB7sky</span>. Tokens only ever look <b>back</b>. <b>64 heads</b> do this side by side on every floor, each looking for something different.',
    like: "everyone in a meeting glancing back through the notes of those who spoke before.",
    nums: () => [
      ["Heads", "64", "per floor"],
      ["Looks at", "earlier", ""],
      ["Stored", "2", "KB/floor"],
    ],
    deep: () => [
      "Keys and values are kept in memory after they are made: the <b>KV cache</b>. Later tokens look back without redoing any of it.",
      "Half the floors look at the whole text; the other half only at the last 128 tokens, which keeps long chats cheaper.",
      "64 query heads share 8 key-value heads (grouped-query attention): the cache is 8 times smaller than it would be.",
      "Each head also has an \u201Cattention sink\u201D, somewhere to put its attention when nothing earlier is relevant.",
      "The lines here show the kind of pattern real heads learn. This run\u2019s own attention weights were not recorded.",
    ],
  }),
  Qe.push({
    id: "experts",
    exp: (e) => ({ L: 3, g: oe(0.02, 0.22, e) * oe(1, 0.9, e) * 13 }),
    ex: (e, t) => ({
      L: 3,
      c: Go((n) => n.t === " blue" && n.role === "user"),
      k: oe(0.08, 0.25, e) * oe(1, 0.9, e),
      all: oe(0.55, 0.7, e),
    }),
    tags: (e) =>
      e > 0.25 && e < 0.55
        ? ["router", "experts"]
        : e < 0.88 && e > 0.55
          ? ["experts"]
          : [],
    act: "Act III \xB7 Inside the model",
    n: "Experts",
    title: "4 experts out of 128",
    dur: 18,
    T: () => {
      const e = Mo(0, St + ((Tt - St) * 3.2) / 36),
        t = Mo(0, St + ((Tt - St) * 3.9) / 36);
      return [
        [0, e],
        [1, t],
      ];
    },
    cam: () => {
      const e = Go((n) => n.t === " blue" && n.role === "user"),
        t = Ge(e);
      return [
        [
          0,
          {
            set: "city",
            t: [t - 3, Lt(3), 0],
            yaw: 0.25,
            pitch: 0.2,
            dist: 26,
            r: 14,
          },
        ],
        [
          0.22,
          {
            set: "city",
            t: [t - 6, _e + 3 * _t + 0.5, -3],
            yaw: 0.2,
            pitch: 0.62,
            dist: 24,
            r: 12,
          },
        ],
        [
          1,
          {
            set: "city",
            t: [t - 9, _e + 3 * _t + 0.5, -3.5],
            yaw: 0.1,
            pitch: 0.72,
            dist: 30,
            r: 16,
          },
        ],
      ];
    },
    body: () =>
      `Then each token goes to specialists. A small <b>router</b> scores the floor\u2019s <b>128 experts</b> and sends the token to the best <b>4</b>. Each expert is a small network of its own; their answers are blended and added to the token\u2019s notes. That\u2019s why a model with ${Math.round(Me.params / 1e9)} billion weights uses only <b class="m">${(Me.activeParams / 1e9).toFixed(1)} billion</b> for each token.`,
    like: "a clinic where a nurse sends each patient to 4 of 128 specialists.",
    nums: () => [
      ["Experts", "128", "per floor"],
      ["Used", "4", ""],
      ["Weights used", "4.4", "%"],
    ],
    deep: () => [
      "This design is called a <b>mixture of experts</b>. Most large models today use it: more knowledge, same cost per token.",
      "Each expert makes two sets of 2,880 numbers from the token, lets one gate the other (SwiGLU), and maps the result back into the token\u2019s notes: about 25 million weights per expert.",
      "Experts are not neat topics like \u201Cphysics\u201D or \u201Cgrammar\u201D: what each one does is learned and mostly hard to name.",
      "Which experts each token visits is drawn here for illustration; this run\u2019s routing was not recorded.",
    ],
  }),
  Qe.push({
    id: "prefill",
    tags: (e) => (e > 0.45 ? ["cache"] : []),
    act: "Act III \xB7 Inside the model",
    n: "Prefill",
    title: "The whole prompt at once",
    dur: 14,
    T: () => [
      [0, Mo(0, St + ((Tt - St) * 3.9) / 36)],
      [1, Mo(0, Tt)],
    ],
    cam: () => [
      [0, yn.rise({ dist: 52, yaw: -0.25 })],
      [0.8, yn.rise({ dist: 64, yaw: -0.15, pitch: 0.1 })],
      [1, { ...he("cityHero"), dist: 110, yaw: -0.22 }],
    ],
    body: () =>
      `The GPU takes the whole prompt up all 36 floors in one step: <b class="c">${Qt(k.steps[0].t1 - k.steps[0].t0)} ms</b>. Every window that lights <b>stays lit</b>: each is a token\u2019s keys and values at one floor, kept in memory. That\u2019s the <b>KV cache</b>, <b>${Math.round(zo / 1024)} KB</b> per token, so this prompt never has to be read again, however long the answer.`,
    nums: () => [
      ["Prefill", Qt(k.steps[0].t1 - k.steps[0].t0), "ms"],
      ["Cache", ao(yt() * zo).split(" ")[0], ao(yt() * zo).split(" ")[1]],
      ["Tokens", yt().toLocaleString("en"), ""],
    ],
    deep: () => [
      "All the prompt\u2019s tokens can go up together because they are all known already. Only the answer has to be written one token at a time.",
      "For each floor the GPU reads that floor\u2019s weights once and uses them for every token in the step: that is what makes a prompt fast to read.",
      "The cache is per conversation: the ghost windows in the other towers are their caches.",
    ],
  }),
  Qe.push({
    id: "guess",
    lens: () => ue + Math.max(o0, 0),
    tags: (e) => (e > 0.3 ? ["wheel"] : []),
    act: "Act III \xB7 Inside the model",
    n: "The guess",
    title: "A score for <i>every token</i> it knows",
    dur: 16,
    T: () => [
      [0, Mo(0, Tt)],
      [1, k.gen[0] + 0.02],
    ],
    cam: () => [
      [0, he("edge", ue - 1)],
      [0.4, he("roof", ue - 1)],
      [1, { ...he("roof", ue - 1), yaw: -0.2, dist: 18 }],
    ],
    body: () =>
      `At the top, the <b>last</b> token\u2019s numbers are compared with all ${Me.vocab.toLocaleString("en")} tokens, giving a <b>score for each</b>: the model\u2019s guess for what comes next. The only question the whole tower answers is <b>what is the next token?</b> Here the template leaves no real choice: <span class="tk">&lt;|channel|&gt;</span>, the marker that opens its private notes.`,
    like: "a guess at the next word in a sentence, with odds on every word in the dictionary.",
    nums: () => [
      ["Scores", Me.vocab.toLocaleString("en"), ""],
      ["Uses", "last", "token"],
      ["Picked", "1", ""],
    ],
    deep: () => [
      "The scores (logits) become probabilities with a softmax: the higher the score, the exponentially likelier the token.",
      "The other 85 tokens\u2019 tops are not wasted: their keys and values are what the next tokens will look back at.",
    ],
  }),
  Qe.push({
    id: "think",
    tags: (e) => ["newest"],
    att: (e, t) => {
      const n = wo(t);
      if (n < 1 || n >= k.steps.length) return null;
      const s = k.steps[n],
        r = es(s, t);
      return r < 0 || r >= 36
        ? null
        : {
            q: ue + n - 1,
            L: Math.floor(r),
            k: oe(-0.5, 0.5, r) * oe(36, 35, r),
            fan: 0.06,
            heads: [
              { id: "subject", k: 0.8 },
              { id: "instr", k: 0.7 },
              { id: "prev", k: 0.5 },
              { id: "sink", k: 0.4 },
            ],
          };
    },
    act: "Act IV \xB7 One token at a time",
    n: "Thinking",
    title: "Thinking, in words",
    dur: 18,
    T: () => [
      [0, k.gen[0] + 0.02],
      [1, k.gen[Vo() - 1]],
    ],
    cam: () => [
      [0, he("roof", ue)],
      [
        0.24,
        yn.follow({ dist: 74, yaw: 0.62, y: Rt * 0.6, dx: 6, pitch: 0.14 }),
      ],
      [1, yn.follow({ dist: 70, yaw: 0.5, y: Rt * 0.56, dx: 7, pitch: 0.12 })],
    ],
    body: () => {
      const e = mt();
      return `Before answering, the model <b class="m">writes notes to itself</b> on a private channel: <i>\u201C${e.think.length > 90 ? e.think.slice(0, 88) + "\u2026" : e.think}\u201D</i>${De.think ? "" : " It read the app\u2019s instruction"}. The app hides these and shows <i>Thinking\u2026</i>. Each word of thought is a full trip up the tower, like any other word: ${ko("think")} tokens of thought and the markers round them, <b>${It(k.thinkMs)} s</b>.`;
    },
    nums: () => [
      ["Thinking", String(ko("think")), "tokens"],
      ["Took", It(k.thinkMs), "s"],
      ["Shown", "no", ""],
    ],
    deep: () => [
      "\u201CThinking\u201D is not a different kind of computing: it is more tokens, written before the answer, that the answer can then look back at.",
      "Set to think a lot, this model wrote 225 tokens of notes for the same question: it drafted four answers and picked the shortest.",
      "Models are trained to use these notes for hard problems: maths, code, plans. For \u201Cwhy is the sky blue?\u201D a line is enough.",
    ],
    tryB: [["Make it think a lot", () => ys("think", 1, "think")]],
  }),
  Qe.push({
    id: "dice",
    lens: () => ue + Math.max(o0, 0),
    tags: (e) => ["wheel"],
    act: "Act IV \xB7 One token at a time",
    n: "Dice",
    title: "Rolling the dice",
    dur: 22,
    T: () => {
      const e = Vo(),
        t = Vo() + 2;
      return [
        [0, Mo(e, Tt)],
        [0.42, k.gen[e]],
        [0.55, Mo(t, Tt)],
        [1, k.gen[t]],
      ];
    },
    cam: () => [
      [0, he("dice")],
      [1, { ...he("dice"), yaw: 0.15 }],
    ],
    body: () => {
      const e = mt().gen,
        t = e[Vo()],
        n = e[Vo() + 2];
      return `For every token there\u2019s a list of candidates with odds. The answer\u2019s first word: <span class="tk">${bt(t[4][0][0])}</span> ${$o(t[4][0][1])}, <span class="tk">${bt(t[4][1][0])}</span> ${$o(t[4][1][1])}. It doesn\u2019t simply take the top one: it <b>rolls a weighted die</b>. That\u2019s why the same question can get different answers. Two words later: <span class="tk">${bt(n[4][0][0])}</span> ${$o(n[4][0][1])}, <span class="tk">${bt(n[4][1][0])}</span> ${$o(n[4][1][1])}.${Math.abs(n[4][0][1] - n[4][1][1]) < 0.05 ? ' A <b class="g">coin flip</b>. Both would have worked.' : ""}`;
    },
    like: "a raffle where every word holds tickets in proportion to its odds.",
    nums: () => {
      const e = mt().gen[Vo()];
      return [
        ["Candidates", "201,088", ""],
        ["Top odds", $o(e[4][0][1]), ""],
        ["Randomness", De.temp ? "1.0" : "0", ""],
      ];
    },
    deep: () => [
      "<b>Temperature</b> reshapes the odds before the roll: below 1 the favourite gets likelier, at 0 it always wins (the same answer every time), above 1 the long shots get a chance.",
      "<b>Top-p</b> and <b>top-k</b> cut the long tail of unlikely tokens before rolling, so a 1-in-a-million word never slips in.",
      "The odds shown are the model\u2019s real ones for this run, returned with every token.",
      "For a factual question the model is usually sure. The dice matter most for creative writing.",
    ],
    tryX: D2,
    tryB: [
      ["Replay with no randomness", () => ys("temp", 0, "dice")],
      ["Normal randomness", () => ys("temp", 1, "dice")],
    ],
  }),
  Qe.push({
    id: "stream",
    act: "Act IV \xB7 One token at a time",
    n: "Streaming",
    title: "Streaming home",
    dur: 14,
    T: () => {
      const e = Vo() + 2;
      return [
        [0, k.gen[e]],
        [1, k.arr[e] + 1],
      ];
    },
    cam: () => [
      [0, he("screen")],
      [1, { ...he("screen"), dist: 0.7 }],
    ],
    body: () =>
      `Each token is turned back into text and sent home <b>the moment it is picked</b>, as a tiny event on the open connection: <code>data: {"delta":{"content":"${bt(mt().gen[Vo() + 2][0]).replace("\xB7", " ")}"}}</code>. It arrives ${Ho} ms later and the app adds it to the screen. That\u2019s why answers appear word by word: you are reading while it writes.`,
    nums: () => [
      ["First word", It(k.first), "s"],
      ["Delay", String(Ho), "ms"],
      ["Events", String(ko("answer")), ""],
    ],
    deep: () => [
      "These are <b>server-sent events</b> over the HTTP connection that carried the request; nothing new has to be set up.",
      "Some tokens are only part of a character (an emoji can be four tokens): the server holds them until the character is complete.",
      "A second, smaller safety model often reads the answer as it streams, and can stop it mid-sentence.",
    ],
  }),
  Qe.push({
    id: "loop",
    viz: (e, t, n) => Mr.step(e, t, n),
    tags: (e) => (e < 0.45 ? ["newest"] : ["yours", "other", "cache"]),
    att: (e, t) => {
      const n = wo(t);
      if (n < 1 || n >= k.steps.length) return null;
      const s = k.steps[n],
        r = es(s, t);
      return r < 0 || r >= 36
        ? null
        : {
            q: ue + n - 1,
            L: Math.floor(r),
            k: oe(-0.5, 0.5, r) * oe(36, 35, r),
            fan: 0.06,
            heads: [
              { id: "subject", k: 0.8 },
              { id: "instr", k: 0.7 },
              { id: "prev", k: 0.5 },
              { id: "sink", k: 0.4 },
            ],
          };
    },
    act: "Act IV \xB7 One token at a time",
    n: "Again",
    title: "Again, and again",
    dur: 20,
    T: () => [
      [0, k.arr[Vo() + 2] + 1],
      [1, k.gen[ul()]],
    ],
    cam: () => [
      [0, yn.follow({ dist: 70, yaw: 0.5, y: Rt * 0.55, dx: 7 })],
      [0.35, yn.follow({ dist: 84, yaw: 0.2, y: Rt * 0.5, dx: 10 })],
      [0.7, { ...he("cityWide"), dist: 240, pitch: 0.3, yaw: -0.5 }],
      [1, { ...he("cityHero"), yaw: -0.6, dist: 150, pitch: 0.16 }],
    ],
    body: () =>
      `Every token it picks becomes a new column and climbs the tower <b>alone</b>, looking back at every lit window before it. One trip up per token. Each trip needs the weights of every floor, so each step reads <b>${ao(k.decode.bytes)}</b> from memory, once, for all ${xo()} conversations. Reading, not arithmetic, is the slow part; that\u2019s why one GPU serves many people at once.`,
    like: "a bus route: the drive costs the same with 1 passenger or 32.",
    nums: () => [
      ["Per step", Qt(k.decode.ms), "ms"],
      ["Speed", Math.round(1e3 / k.decode.ms), "tokens/s"],
      [
        "Read",
        ao(k.decode.bytes).split(" ")[0],
        ao(k.decode.bytes).split(" ")[1] + "/step",
      ],
    ],
    deep: () => [
      "A step with more conversations reads a bit more (more experts, more caches) but serves many more people: with 255 others the GPU writes ~7,000 tokens a second in total, but each person gets ~28.",
      "Without the cache, every step would have to redo the whole text: the 100th word would cost 100 times the first.",
      "<b>Speculative decoding</b> speeds this up: a tiny model drafts a few tokens and the big one checks them all in one step.",
    ],
  }),
  Qe.push({
    id: "stop",
    viz: (e, t, n) => Mr.bill(e, t, n),
    tags: (e) =>
      e < 0.5
        ? ["newest", "wheel"]
        : e < 0.8
          ? ["kept", "yours"]
          : ["cache", "yours"],
    act: "Act IV \xB7 One token at a time",
    n: "Stop",
    title: "Knowing when to stop",
    dur: 12,
    T: () => [
      [0, k.gen[ul()]],
      [0.55, k.end],
      [1, k.done],
    ],
    cam: () => [
      [0, { ...he("roof", oo - 1), dist: 24, pitch: 0.42 }],
      [0.55, { ...he("roof", oo - 1), dist: 28, pitch: 0.38, yaw: -0.25 }],
      [1, { ...he("cityHero"), dist: 118 }],
    ],
    body: () =>
      `The model ends by writing one more marker, <span class="tk">&lt;|return|&gt;</span>: done. The stream closes. The server keeps this conversation\u2019s cache for a few minutes in case you reply, then frees the memory for someone else. What you pay for is counted in tokens: <b>${yt().toLocaleString("en")} read, ${ot} written</b>, ${ko("think")} of them thinking you never saw.`,
    nums: () => [
      ["Read", yt().toLocaleString("en"), "tokens"],
      ["Written", String(ot), "tokens"],
      ["Cache", ao(k.kvBytes).split(" ")[0], ao(k.kvBytes).split(" ")[1]],
    ],
    deep: () => [
      "If it never wrote the stop marker, the app\u2019s limit (max tokens) would cut it off.",
      "Written tokens usually cost several times more than read ones, because each needs its own step.",
      "Keeping the cache is <b>prompt caching</b>: a follow-up question skips re-reading everything, and is billed cheaper.",
    ],
  }),
  Qe.push({
    id: "recap",
    tags: (e) => (e > 0.2 ? ["yours"] : []),
    act: "",
    n: "The whole trip",
    title: "The whole trip",
    dur: 14,
    cutIn: 1,
    T: () => [
      [0, 0],
      [0.08, 0],
      [0.88, k.total],
      [1, k.total],
    ],
    cam: () => [
      [0, { ...he("cityHero"), yaw: -0.7, dist: 150 }],
      [1, { ...he("cityHero"), yaw: -0.3, dist: 128 }],
    ],
    body: () =>
      `<b class="c">${It(k.total)} seconds.</b> ${yt().toLocaleString("en")} tokens read, ${ot} written, ${ko("think")} of them thinking. ${k.steps.length} trips up a 36-floor tower. ${ao(k.bytesRead)} read from memory while it wrote. About <b>${Math.round(k.joules)} joules</b>, what a phone screen uses in ${Math.round(k.joules / 3)} seconds. Now change the run: make it think, take away the dice, give it a long chat, crowd the GPU.`,
    nums: () => [
      ["Total", It(k.total), "s"],
      ["Trips up", String(k.steps.length), ""],
      ["Energy", String(Math.round(k.joules)), "J"],
    ],
    deep: () => [
      "The energy is an estimate: the GPU at ~600 W while it works, shared by the conversations in each step, doubled for the rest of the server, the network and cooling.",
      "The biggest models today are larger than this one, with more experts and floors, but every step here is the same.",
    ],
  }));
const Tf = Qe.map((e) => e.id);
let Y = [],
  Jo = 0;
function f2() {
  let e = 0;
  ((Y = Qe.filter((t) => !t.when || t.when()).map((t) => {
    const n = { c: t, t0: e, t1: e + t.dur };
    return ((e += t.dur), n);
  })),
    (Jo = e));
}
function us(e) {
  for (let t = 0; t < Y.length; t++)
    if (e < Y[t].t1 || t === Y.length - 1) return t;
  return 0;
}
function h2(e, t, n = j0) {
  if (t <= e[0][0]) return e[0][1];
  for (let s = 1; s < e.length; s++)
    if (t <= e[s][0]) {
      const [r, a] = e[s - 1],
        [o, i] = e[s];
      return Ut(a, i, n((t - r) / Math.max(o - r, 1e-6)));
    }
  return e[e.length - 1][1];
}
const j0 = (e) => e * e * (3 - 2 * e),
  d2 = (e) => e,
  u2 = new Set(["title", "recap", "loop", "trip"]);
function Pn(e) {
  const t = us(e),
    n = Y[t],
    s = U((e - n.t0) / n.c.dur, 0, 1);
  return h2(n.c.T(), s, u2.has(n.c.id) ? d2 : j0);
}
const pl = {
  title: () => [
    [0.05, 0.45, `One question, at full speed: <b>${It(k.total)} s</b>.`],
    [
      0.5,
      0.95,
      "Every column of light is a token the model read or wrote. Now let\u2019s slow it down.",
    ],
  ],
  enter: () => [
    [0.06, 0.36, "An evening, a laptop, a question."],
    [0.4, 0.72, `<b>${tt.user}</b>`],
    [0.78, 0.98, "Enter."],
  ],
  request: () => [
    [0.04, 0.32, "What leaves your laptop is a small text file."],
    [0.36, 0.66, "Your question is one line. The app adds its own."],
    [
      0.7,
      0.97,
      "The model remembers nothing: the whole chat is sent, every time.",
    ],
  ],
  trip: () => [
    [0.05, 0.45, "Radio, then light in glass, then a dozen routers."],
    [0.5, 0.96, `${Ho} ms later: a data center.`],
  ],
  door: () => [
    [0.03, 0.3, "Who are you? How much have you used? Which model?"],
    [0.34, 0.7, "A small model reads the prompt first."],
    [0.74, 0.98, "A server with room is picked."],
  ],
  template: () => [
    [0.04, 0.4, "Everything becomes one long text."],
    [
      0.44,
      0.97,
      "It ends mid-script, <b>assistant</b>\u2026 The model\u2019s only job: write what comes next.",
    ],
  ],
  tokens: () => [
    [0.03, 0.3, "The text is cut into pieces the model knows."],
    [0.34, 0.64, "<b>\xB7sky</b> is token 17,307. <b>\xB7blue</b> is 9,861."],
    [
      0.68,
      0.97,
      `${yt().toLocaleString("en")} tokens. Your question is ${ko("user")} of them.`,
    ],
  ],
  queue: () => [
    [0.04, 0.48, `The GPU is busy with ${xo() - 1} other conversations.`],
    [
      0.52,
      0.97,
      `A step every ${Qt(k.decode.ms)} ms. Yours boards the next one.`,
    ],
  ],
  chip: () => [
    [0.04, 0.3, "Inside the GPU. Think of it as a city."],
    [
      0.34,
      0.66,
      "Every tower is a conversation. Every tower has 36 floors: the model\u2019s layers.",
    ],
    [0.7, 0.97, `Yours is in front, ${ue} columns wide.`],
  ],
  embed: () => [
    [0.04, 0.5, "Each token opens its row of a giant table."],
    [0.56, 0.97, "2,880 numbers each. That\u2019s what goes up."],
  ],
  tower: () => [
    [0.04, 0.48, "The whole prompt climbs, floor by floor."],
    [0.52, 0.97, "On every floor: look back, then think."],
  ],
  attention: () => [
    [0.03, 0.3, "Attention: every token looks back at the ones before it."],
    [0.34, 0.62, "<b>\xB7blue</b> finds <b>\xB7sky</b>."],
    [
      0.66,
      0.97,
      "Never ahead. 64 heads at once, each looking for something else.",
    ],
  ],
  experts: () => [
    [
      0.04,
      0.45,
      "A router sends each token to 4 of the floor\u2019s 128 experts.",
    ],
    [0.5, 0.97, "Only 4% of the model works on any one token."],
  ],
  prefill: () => [
    [
      0.04,
      0.5,
      `The whole prompt, 36 floors, in ${Qt(k.steps[0].t1 - k.steps[0].t0)} ms.`,
    ],
    [0.54, 0.97, "Lit windows stay lit: that\u2019s the cache."],
  ],
  guess: () => [
    [
      0.04,
      0.45,
      `At the top: a score for all ${Me.vocab.toLocaleString("en")} tokens.`,
    ],
    [0.5, 0.97, "The first pick opens its private notes."],
  ],
  think: () => [
    [0.04, 0.3, "It writes notes to itself first."],
    [
      0.34,
      0.7,
      `<i>\u201C${mt().think.slice(0, 60)}${mt().think.length > 60 ? "\u2026" : ""}\u201D</i>`,
    ],
    [0.74, 0.97, "Your screen says: Thinking\u2026"],
  ],
  dice: () => {
    const e = mt().gen,
      t = e[Vo()],
      n = e[Vo() + 2];
    return [
      [
        0.03,
        0.4,
        `<b>${bt(t[4][0][0])}</b> ${$o(t[4][0][1])}, <b>${bt(t[4][1][0])}</b> ${$o(t[4][1][1])}\u2026 roll.`,
      ],
      [0.44, 0.54, `<b>${bt(t[0])}</b>.`],
      [
        0.58,
        0.97,
        `<b>${bt(n[4][0][0])}</b> or <b>${bt(n[4][1][0])}</b>? ${$o(n[4][0][1])} against ${$o(n[4][1][1])}.`,
      ],
    ];
  },
  stream: () => [
    [0.04, 0.5, "Each token goes home the moment it\u2019s picked."],
    [0.54, 0.97, "You are reading while it writes."],
  ],
  loop: () => [
    [0.04, 0.34, "One column per token, one trip up for each."],
    [0.38, 0.68, "Every tower grows together, one step at a time."],
    [
      0.72,
      0.97,
      `${Math.round(1e3 / k.decode.ms)} tokens a second, for each of ${xo()} conversations.`,
    ],
  ],
  stop: () => [
    [0.04, 0.5, "The last token: <b>&lt;|return|&gt;</b>. Done."],
    [0.54, 0.97, "The cache waits a few minutes, then makes room."],
  ],
  recap: () => [
    [
      0.04,
      0.45,
      `<b>${It(k.total)} seconds.</b> ${k.steps.length} trips up the tower.`,
    ],
    [
      0.5,
      0.96,
      "Now try the switches: think harder, remove the dice, add a long chat, crowd the GPU.",
    ],
  ],
};
let Se = 0,
  So = !1,
  lr = 1,
  st = 0,
  Z0 = 0,
  Ee = 0,
  Je = null,
  ml = !0;
const yl = { desk: Oe, dc: pe, city: Kt, stage: vo };
function bl(e) {
  Je = e;
  for (const t in yl) yl[t].visible = t === e;
  ((Tr = e === "city" ? "city" : e === "stage" ? "stage" : "dusk"),
    (va.uCity.value = e === "city" ? 1 : 0),
    (Zn.visible = e !== "stage"),
    Dl());
}
const Q0 = { t: new l.Vector3(), f: new l.Vector3() },
  J0 = { t: new l.Vector3(), f: new l.Vector3() },
  ea = { t: new l.Vector3(), f: new l.Vector3() },
  xl = { t: new l.Vector3(), f: new l.Vector3() };
function cr(e, t, n) {
  typeof e == "function" && (e = e(t));
  const s = Re[e.set || "city"];
  return (
    n.t.set(e.t[0] + s, e.t[1], e.t[2]),
    (n.yaw = e.yaw),
    (n.pitch = e.pitch),
    (n.dist = e.dist),
    (n.r = e.r ?? Math.max(e.dist * 0.35, 0.2)),
    e.f ? n.f.set(e.f[0] + s, e.f[1], e.f[2]) : n.f.copy(n.t),
    (n.set = e.set || "city"),
    n
  );
}
function fr(e, t) {
  (e.t.copy(t.t),
    e.f.copy(t.f),
    (e.yaw = t.yaw),
    (e.pitch = t.pitch),
    (e.dist = t.dist),
    (e.r = t.r),
    (e.set = t.set));
}
function wl(e, t, n, s) {
  const r = t.t.distanceTo(n.t),
    a = Math.sin(Math.PI * s) * oe(8, 30, r) * Math.min(r * 0.22, 40);
  (e.t.lerpVectors(t.t, n.t, s),
    (e.t.y += a),
    e.f.lerpVectors(t.f, n.f, s),
    (e.f.y += a),
    (e.yaw = t.yaw + x2(n.yaw - t.yaw) * s),
    (e.pitch = Ut(t.pitch, n.pitch, s)),
    (e.dist =
      Math.exp(Ut(Math.log(t.dist), Math.log(n.dist), s)) *
      (1 + Math.sin(Math.PI * s) * Math.min(0.6, r / 150))),
    (e.r = Math.exp(Ut(Math.log(t.r), Math.log(n.r), s))),
    (e.set = t.set));
}
function gl(e, t) {
  const n = us(e),
    s = Y[n],
    r = s.c,
    a = r.cam(),
    o = U((e - s.t0) / r.dur, 0, 1);
  let i = 1;
  for (; i < a.length - 1 && a[i][0] < o;) i++;
  const [c, f] = a[i - 1],
    [d, h] = a.length > 1 ? a[i] : a[0],
    m = j0(U((o - c) / Math.max(d - c, 1e-6), 0, 1));
  (cr(f, e, Q0), cr(h, e, J0));
  let p = 0;
  Q0.set !== J0.set
    ? (fr(t, m < 0.5 ? Q0 : J0), (p = oe(0.35, 1, 1 - Math.abs(m - 0.5) * 2)))
    : wl(t, Q0, J0, m);
  const x = r.cutIn ? 1.8 : Math.min(3, r.dur * 0.2),
    w = e - s.t0;
  if (n > 0 && w < x) {
    const g = Y[n - 1];
    if ((p2(g, ea), ea.set !== t.set || r.cutIn)) {
      const u = w / x;
      (u < 0.5 && fr(t, ea),
        (p = Math.max(p, oe(0.35, 1, 1 - Math.abs(u - 0.5) * 2))));
    } else {
      const u = Dr(w / x);
      (fr(xl, t), wl(t, ea, xl, u));
    }
  }
  return ((t.veil = p), t);
}
function p2(e, t) {
  const n = e.c.cam(),
    s = n[n.length - 1][1];
  return cr(s, e.t1 - 0.001, t);
}
const bn = { t: new l.Vector3(), f: new l.Vector3() };
function vl(e, t) {
  (So && ((Se += t * lr), Se >= Jo && ((Se = Jo), (So = !1), sa())),
    (st = Pn(Se)));
  const n = Pn(Math.max(0, Se - 0.06)),
    s = Pn(Math.min(Jo, Se + 0.06));
  Z0 = Math.max((s - n) / 0.12, 0);
  const r = us(Se);
  (r !== Ee && ((Ee = r), S2(r)), gl(Se, bn));
  const a = dt && Je ? Je : bn.set;
  (a !== Je && bl(a),
    (L("#veil").style.opacity = (bn.veil || 0).toFixed(3)),
    ml &&
      !dt &&
      (be.t.copy(bn.t),
      (be.yaw = bn.yaw),
      (be.pitch = bn.pitch),
      (be.dist = bn.dist),
      vn.copy(bn.f),
      (oa = bn.r),
      (mo = 1)));
}
const hr = (() => {
  const e = tt.user,
    t = ye(11),
    n = [];
  let s = 0;
  for (let r = 0; r < e.length; r++)
    ((s += 0.75 + 0.55 * t() + (r > 0 && e[r - 1] === " " ? 0.85 : 0)),
      n.push(s));
  return n.map((r) => r / s);
})();
function dr(e) {
  const t = us(e),
    n = Y.findIndex((a) => a.c.id === "enter");
  if (t < n) return 0;
  if (Y[t].c.id !== "enter") return 1;
  const s = U(((e - Y[t].t0) / Y[t].c.dur - 0.28) / 0.42, 0, 1);
  let r = 0;
  for (; r < hr.length && hr[r] <= s + 1e-9;) r++;
  return r / hr.length;
}
function m2() {
  const e = Y[Ee]?.c,
    t = e ? U((Se - Y[Ee].t0) / e.dur, 0, 1) : 1,
    n = st,
    s = mt(),
    r = s.gen,
    a = dr(Se),
    o = n >= k.send && !(e?.id === "enter" && t < 0.74),
    i = k.firstAns;
  let c = "",
    f = 0;
  for (let h = i; h <= k.lastAns && n >= k.arr[h]; h++) ((c += r[h][0]), f++);
  const d = n >= k.arr[0] && n < k.arr[i];
  return {
    prompt: tt.user,
    typed: a,
    sent: o,
    thinking: d,
    thinkText: s.think,
    thoughtFor: (k.arr[i] - k.arr[0]) / 1e3,
    answer: c,
    nAns: f,
    answerFull: s.answer,
    done: n >= k.done,
    waiting: o && n < k.arr[0],
    caret: Math.sin(at * 6) > 0,
    model: "gpt-oss-120b",
    history: De.hist > 0,
  };
}
const ur = [];
function pr(e) {
  const t = document.createElement("canvas");
  ((t.width = e.cw), (t.height = e.ch));
  const n = t.getContext("2d"),
    s = new l.CanvasTexture(t);
  ((s.colorSpace = l.SRGBColorSpace), (s.anisotropy = 8));
  const r = new l.Mesh(
    new l.PlaneGeometry(e.w, (e.w * e.ch) / e.cw),
    new l.MeshBasicMaterial({
      map: s,
      transparent: !0,
      opacity: 0,
      depthWrite: !0,
      fog: !1,
      color: new l.Color(1.02, 1.02, 1.02),
    }),
  );
  ((r.renderOrder = 5),
    (r.visible = !1),
    ze.push(r),
    et.push(r),
    kl.push([e.set, r]));
  const a = { ...e, m: r, g: n, t: s, k: null };
  return (ur.push(a), a);
}
const kl = [];
function y2() {
  for (const [e, t] of kl)
    ({ desk: Oe, dc: pe, city: Kt, stage: vo })[e].add(t);
}
const mr = new l.Vector3();
function b2() {
  const e = Y[Ee]?.c,
    t = e ? U((Se - Y[Ee].t0) / e.dur, 0, 1) : 0;
  for (const n of ur) {
    const s = n.set === Je && e ? n.show(e.id, t) : 0;
    n.a = (n.a || 0) + (s - (n.a || 0)) * (1 - Math.exp(-Bn * 9));
    const r = n.a > 0.01;
    if (((n.m.visible = r), !r)) continue;
    const a = n.pos();
    (n.m.position.set(a[0], a[1], a[2]),
      (n.m.material.opacity = n.a),
      n.m.getWorldPosition(mr),
      n.m.rotation.set(
        0,
        Math.atan2(Z.position.x - mr.x, Z.position.z - mr.z) + (n.yaw || 0),
        0,
      ));
    const o = n.key ? n.key(e.id, t) : "";
    o !== n.k &&
      ((n.k = o),
      n.g.clearRect(0, 0, n.cw, n.ch),
      n.draw(n.g, n.cw, n.ch, e.id, t),
      (n.t.needsUpdate = !0));
  }
}
function yr(e, t, n, s, r) {
  ((e.fillStyle = "rgba(10,15,28,.9)"),
    lt(e, 0, 0, t, n, 34),
    e.fill(),
    (e.fillStyle = "rgba(127,227,255,.10)"),
    lt(e, 0, 0, t, 86, [34, 34, 0, 0]),
    e.fill(),
    (e.font = "600 30px Outfit, sans-serif"),
    (e.fillStyle = "#9fb0d4"),
    (e.letterSpacing = "3px"),
    (e.textBaseline = "middle"),
    e.fillText(s, 40, 44),
    (e.letterSpacing = "0px"),
    r &&
      ((e.font = "500 26px DM Mono, monospace"),
      (e.fillStyle = "#7f89a6"),
      (e.textAlign = "right"),
      e.fillText(r, t - 40, 44),
      (e.textAlign = "left")));
}
(pr({
  set: "desk",
  w: 0.33,
  cw: 1100,
  ch: 1060,
  pos: () => {
    const e = Ne.lapRy,
      t = Ye.laptop;
    return [
      t[0] + Math.cos(e) * 0.43 + Math.sin(e) * 0.2,
      t[1] + 0.2,
      t[2] - Math.sin(e) * 0.43 + Math.cos(e) * 0.2,
    ];
  },
  yaw: 0,
  show: (e, t) => (e === "request" ? oe(0.12, 0.2, t) : 0),
  key: (e, t) =>
    e + Math.min(5, Math.floor(t * 6)) + De.hist + De.think + De.temp,
  draw: (e, t, n, s, r) => {
    yr(e, t, n, "WHAT YOUR APP SENDS", "POST /v1/chat/completions");
    const a = Math.floor(r * 6),
      o = [
        ["{", "#c9d0e2", 0],
        ['  "model": "gpt-oss-120b",', "#7fe3ff", 1],
        ['  "stream": true,', "#ffd27a", 4],
        [`  "reasoning_effort": "${De.think ? "high" : "low"}",`, "#ffd27a", 4],
        [`  "temperature": ${De.temp ? "1.0" : "0"},`, "#ffd27a", 4],
        ['  "messages": [', "#c9d0e2", 2],
        ['    { "role": "system",', "#b9a2ff", 2],
        ['      "content": "Answer in one short sentence." },', "#b9a2ff", 2],
        ...(De.hist
          ? [["    \u202640 earlier messages, all of them\u2026", "#8c93a8", 5]]
          : []),
        ['    { "role": "user",', "#ffb454", 3],
        [`      "content": "${tt.user}" }`, "#ffb454", 3],
        ["  ]", "#c9d0e2", 2],
        ["}", "#c9d0e2", 0],
      ];
    let i = 150;
    e.font = "500 34px DM Mono, monospace";
    for (const [f, d, h] of o) {
      const m = h === 0 || a >= h || (a >= 5 && h === 2);
      ((e.globalAlpha = m ? 1 : 0.3),
        (e.fillStyle = m ? d : "#6f7894"),
        a >= 5 &&
          (h === 2 || h === 3 || h === 5) &&
          ((e.fillStyle = "rgba(255,210,122,.1)"),
          e.fillRect(24, i - 30, t - 48, 54),
          (e.fillStyle = d)),
        e.fillText(f, 40, i),
        (i += 62));
    }
    ((e.globalAlpha = 1),
      (e.font = "500 30px Outfit, sans-serif"),
      (e.fillStyle = "#ffd27a"));
    const c =
      a < 1
        ? ""
        : a < 2
          ? "Which model to use"
          : a < 3
            ? "The app\u2019s own instruction (you never see it)"
            : a < 4
              ? "Your message"
              : a < 5
                ? "How to answer: stream it, how much to think, how random"
                : "Every message, every time: the model remembers nothing";
    e.fillText(c, 40, n - 50);
  },
}),
  pr({
    set: "dc",
    w: 3.2,
    cw: 1100,
    ch: 760,
    pos: () => [go.door[0], go.door[1] + 1.7, go.door[2]],
    show: (e, t) => (e === "door" ? oe(0.2, 0.3, t) * oe(1, 0.95, t) : 0),
    key: (e, t) =>
      e +
      (st > k.gate ? 1 : 0) +
      (st > k.safe ? 1 : 0) +
      (st > k.lb ? 1 : 0) +
      Math.floor(t * 20),
    draw: (e, t, n) => {
      yr(e, t, n, "THE FRONT DOOR", `${It(st)} s`);
      const s = [
        ["Who are you?", "signed in \xB7 API key valid", k.gate],
        [
          "Within your limits?",
          "3 of 500 requests this minute \xB7 86 of 400,000 tokens",
          k.gate,
        ],
        ["Safe to answer?", "a small model read the prompt: fine", k.safe],
        ["Which GPU?", "one with room, in this building", k.lb],
      ];
      let r = 170;
      for (const [a, o, i] of s) {
        const c = st >= i;
        ((e.fillStyle = c ? "rgba(125,240,180,.16)" : "rgba(255,255,255,.05)"),
          lt(e, 40, r - 58, t - 80, 128, 22),
          e.fill(),
          (e.fillStyle = c ? "#7df0b4" : "#6f7894"),
          e.beginPath(),
          e.arc(92, r + 6, 20, 0, 7),
          e.fill(),
          c &&
            ((e.strokeStyle = "#0a1a12"),
            (e.lineWidth = 6),
            e.beginPath(),
            e.moveTo(82, r + 6),
            e.lineTo(90, r + 15),
            e.lineTo(104, r - 4),
            e.stroke()),
          (e.font = "600 38px Outfit, sans-serif"),
          (e.fillStyle = c ? "#fff" : "#9aa4bf"),
          e.fillText(a, 136, r - 14),
          (e.font = "400 28px DM Mono, monospace"),
          (e.fillStyle = c ? "#bfeccf" : "#6f7894"),
          e.fillText(o, 136, r + 30),
          (r += 146));
      }
    },
  }),
  pr({
    set: "dc",
    w: 0.9,
    cw: 1100,
    ch: 720,
    pos: () => [go.rack[0] - 1.3, go.rack[1] + 0.42, go.rack[2] + 0.95],
    yaw: 0,
    show: (e, t) => (e === "queue" ? oe(0.3, 0.4, t) * oe(0.84, 0.78, t) : 0),
    key: (e, t) => e + Math.floor(t * 40),
    draw: (e, t, n, s, r) => {
      yr(e, t, n, "THE GPU, STEP BY STEP", `every ${Qt(k.decode.ms)} ms`);
      const a = 60,
        o = t - 60,
        i = k.tok - k.decode.ms * 2.2,
        c = k.admit + k.decode.ms * 1.4,
        f = (m) => a + (o - a) * U((m - i) / (c - i), 0, 1);
      for (let m = -3; m < 3; m++) {
        const p = k.admit + m * k.decode.ms,
          x = p + k.decode.ms * 0.94;
        if (x < i || p > c) continue;
        const w = m >= 0,
          g = f(p),
          u = f(x);
        ((e.fillStyle = w ? "rgba(127,227,255,.28)" : "rgba(255,255,255,.09)"),
          lt(e, g, 230, Math.max(4, u - g), 120, 14),
          e.fill(),
          u - g > 170 &&
            ((e.font = "500 26px DM Mono, monospace"),
            (e.fillStyle = w ? "#dff7ff" : "#8f99b6"),
            e.fillText(
              m < 0
                ? `${xo() - 1} others`
                : m === 0
                  ? "you + " + (xo() - 1)
                  : "\u2026",
              g + 16,
              292,
            )));
      }
      const d = f(st);
      ((e.fillStyle = "#fff"), e.fillRect(d - 2, 190, 4, 190));
      const h = st >= k.admit;
      ((e.fillStyle = "#ffb454"),
        e.beginPath(),
        e.arc(h ? f(k.admit) + 36 : f(st) - 22, h ? 420 : 440, 16, 0, 7),
        e.fill(),
        (e.font = "500 30px Outfit, sans-serif"),
        (e.fillStyle = "#ffd9a3"),
        e.fillText(
          h
            ? "On board: the next step reads your whole prompt"
            : "Your request waits for the next step",
          60,
          500,
        ),
        (e.font = "400 26px DM Mono, monospace"),
        (e.fillStyle = "#8f99b6"),
        e.fillText(
          `waited ${Qt(k.wait)} ms \xB7 ${xo()} conversations per step \xB7 ${Qt(k.decode.ms)} ms a step`,
          60,
          560,
        ),
        e.fillText("a step writes one token for each of them", 60, 606));
    },
  }),
  y2(),
  d0.push(b2));
const be = {
  t: new l.Vector3(Re.city, 14, 0),
  yaw: -0.3,
  pitch: 0.2,
  dist: 90,
};
let mo = 1,
  Ml = 1,
  ta = !1,
  dt = !1,
  oa = 20;
function x2(e) {
  for (; e > Math.PI;) e -= Math.PI * 2;
  for (; e < -Math.PI;) e += Math.PI * 2;
  return e;
}
const r0 = new l.Vector3();
function w2(e, t) {
  return 0.06;
}
function g2(e) {
  const t = dt ? 0 : Math.sin(e / 9) * 0.012,
    n = be.dist * mo * (be.dist < 3 ? 1 : Ml),
    s = be.yaw + t;
  let r = be.pitch;
  for (let f = 0; f < 12; f++) {
    const d = Math.cos(r);
    if (
      (r0.set(
        be.t.x + Math.sin(s) * d * n,
        be.t.y + Math.sin(r) * n,
        be.t.z + Math.cos(s) * d * n,
      ),
      r0.y >= w2(r0.x, r0.z))
    )
      break;
    r += 0.04;
  }
  (Z.position.copy(r0), Z.lookAt(be.t));
  const a = U(n * 0.02, 0.006, 3);
  ((Math.abs(Z.near - a) > 1e-5 || Z.far !== 1600) &&
    ((Z.near = a), (Z.far = 1600), Z.updateProjectionMatrix()),
    Zn.position.copy(Z.position),
    Zn.scale.setScalar(1300),
    (Ht.u.near.value = Z.near),
    (Ht.u.far.value = Z.far),
    g0.uNF.value.set(Z.near, Z.far));
  const o = Z.position.distanceTo(dt ? be.t : vn),
    i = dt ? Math.min(1, Bn * 5) : 1,
    c = (dt ? Math.max(0.4, o * 0.22) : oa) * D.focalBand;
  ((Ht.u.focus.value += (o - Ht.u.focus.value) * i),
    (Ht.u.range.value += (c - Ht.u.range.value) * i),
    Ht.u.cocScale.value.set(D.apertureNear, D.aperture),
    (rt.gtaoMaterial.uniforms.radius.value =
      D.aoRadius * U(o * 0.045, 0.03, 5)),
    (rt.gtaoMaterial.uniforms.thickness.value = U(o * 0.05, 0.03, 4)),
    v2(dt ? be.t : vn, o),
    (Ms.uFogS.value = o * 0.8),
    (Ms.uFogD.value = Math.min(El[Tr].fogD, 0.9 / Math.max(o, 1)) * D.fog));
}
const na = new l.Vector3(),
  br = new l.Vector3(),
  xr = new l.Vector3();
function v2(e, t) {
  const n = U(t * 0.75, 1.2, 170),
    s = ct.shadow.camera;
  (s.right !== n &&
    ((s.left = -n),
    (s.right = n),
    (s.top = n),
    (s.bottom = -n),
    (s.near = 0.5),
    (s.far = n * 4 + 200),
    s.updateProjectionMatrix()),
    na.crossVectors(Zt, ks).normalize(),
    br.crossVectors(ks, na).normalize());
  const r = (2 * n) / D.shadow,
    a = Math.round(e.dot(na) / r) * r,
    o = Math.round(e.dot(br) / r) * r,
    i = e.dot(ks);
  (xr.copy(na).multiplyScalar(a).addScaledVector(br, o).addScaledVector(ks, i),
    ct.target.position.copy(xr),
    ct.position.copy(xr).addScaledVector(ks, n * 2 + 80),
    ct.target.updateMatrixWorld());
}
const Sl = (e) => String(e).padStart(2, "0");
let Tl = -1;
function k2(e, t = !0) {
  const n = Y[e].c,
    s = L("#chap"),
    r = () => {
      ((L("#ch-n").textContent = Sl(e)),
        (L("#ch-of").textContent = "/ " + Sl(Y.length - 1)),
        (L("#ch-act").textContent = n.act || ""),
        (L("#ch-title").innerHTML = n.title),
        (L("#ch-body").innerHTML = n.body()));
      const a = L("#ch-like");
      ((a.textContent = n.like || ""),
        (a.style.display = n.like ? "" : "none"),
        (L("#ch-nums").innerHTML = (n.nums ? n.nums() : [])
          .map(
            ([f, d, h], m) =>
              `<div class="stat${m === 0 ? " hot" : ""}"><i>${f}</i><b>${d}${h ? `<small>${h}</small>` : ""}</b></div>`,
          )
          .join("")));
      const o = L("#ch-try");
      ((o.innerHTML = ""),
        n.tryX && n.tryX(o),
        (n.tryB || []).forEach(([f, d, h]) => {
          const m = document.createElement("button");
          ((m.textContent = f),
            h && (m.className = h),
            (m.onclick = () => {
              d();
            }),
            o.appendChild(m));
        }),
        (o.style.display = n.tryB || n.tryX ? "" : "none"));
      const i = L("#ch-viz");
      if (((i.hidden = !n.viz), n.viz)) {
        const f = i.getContext("2d");
        (f.clearRect(0, 0, i.width, i.height), n.viz(f, i.width, i.height));
      }
      const c = n.deep ? n.deep() : [];
      ((L("#ch-deep-list").innerHTML = c.map((f) => `<li>${f}</li>`).join("")),
        (L("#ch-deep").style.display = c.length ? "" : "none"),
        (Tl = e));
    };
  t && Tl !== -1
    ? (s.classList.add("swap"),
      setTimeout(() => {
        (r(), s.classList.remove("swap"));
      }, 200))
    : r();
}
let wr = null;
function Cl(e) {
  (L("#whatif").classList.toggle("min", !e),
    L("#wi-h").setAttribute("aria-expanded", e));
}
L("#wi-h").onclick = () => {
  ((wr = L("#whatif").classList.contains("min")), Cl(wr));
};
const M2 = () => {
  const e = L("#insp");
  e.classList.toggle("clip", e.scrollHeight > e.clientHeight + 2);
};
if (window.ResizeObserver) {
  const e = new ResizeObserver(M2);
  for (const t of ["#insp", "#pane-p", "#pane-t"]) e.observe(L(t));
}
function S2(e) {
  (Y[e].c.id !== "dice" && (Lo = 1), k2(e));
  const t = Y[e].c.id;
  (L(".side").classList.toggle("compact", t !== "title"),
    wr === null && Cl(t === "title" || t === "recap" || t === "loop"),
    document
      .querySelectorAll("#segs .sg")
      .forEach((n, s) => n.classList.toggle("cur", s === e)),
    document
      .querySelectorAll("#names span")
      .forEach((n) =>
        n.classList.toggle("cur", e >= +n.dataset.a && e < +n.dataset.b),
      ));
}
const T2 = {
  "": "#7fe3ff",
  "Act I": "#ffb454",
  "Act II": "#b9a2ff",
  "Act III": "#7df0b4",
  "Act IV": "#7fe3ff",
};
function C2() {
  const e = L("#segs"),
    t = L("#names");
  ((e.innerHTML = ""),
    (t.innerHTML = ""),
    Y.forEach((r, a) => {
      const o = document.createElement("div");
      ((o.className = "sg"),
        (o.style.flex = r.c.dur + " 1 0"),
        (o.innerHTML = "<i></i>"),
        o.style.setProperty(
          "--sc",
          T2[(r.c.act || "").split(" \xB7")[0]] || "#7fe3ff",
        ),
        e.appendChild(o));
    }));
  const n = (r) => Y.findIndex((a) => a.c.id === r);
  [
    ["", 0, 1],
    ["Message", 1, n("template")],
    ["Words \u2192 numbers", n("template"), n("chip")],
    ["Inside the model", n("chip"), n("think")],
    ["One token at a time", n("think"), n("recap")],
    ["", n("recap"), Y.length],
  ].forEach(([r, a, o]) => {
    const i = Y.slice(a, o).reduce((f, d) => f + d.c.dur, 0),
      c = document.createElement("span");
    ((c.textContent = r),
      (c.style.flex = i + " 1 0"),
      (c.dataset.a = a),
      (c.dataset.b = o),
      t.appendChild(c));
  });
}
function Rl() {
  const e = document.querySelectorAll("#segs .sg i");
  Y.forEach((r, a) => {
    const o = U((Se - r.t0) / r.c.dur, 0, 1);
    e[a] && (e[a].style.width = (o * 100).toFixed(2) + "%");
  });
  const t = L("#track").getBoundingClientRect(),
    n = document.querySelectorAll("#segs .sg"),
    s = n[Ee];
  if (s) {
    const r = s.getBoundingClientRect(),
      a = U((Se - Y[Ee].t0) / Y[Ee].c.dur, 0, 1);
    L("#head").style.left = r.left - t.left + r.width * a + "px";
  }
  L("#track").setAttribute("aria-valuenow", Math.round((Se / Jo) * 100));
}
function zl(e) {
  const t = [...document.querySelectorAll("#segs .sg")];
  for (let n = 0; n < t.length; n++) {
    const s = t[n].getBoundingClientRect();
    if (e <= s.right + 1.5 || n === t.length - 1)
      return Y[n].t0 + U((e - s.left) / s.width, 0, 1) * Y[n].c.dur;
  }
  return 0;
}
{
  const e = L("#track");
  let t = !1;
  const n = L("#hov");
  (e.addEventListener("pointerdown", (s) => {
    ((t = !0), e.setPointerCapture(s.pointerId), In(zl(s.clientX)));
  }),
    e.addEventListener("pointermove", (s) => {
      const r = zl(s.clientX),
        a = us(r);
      n.textContent = Y[a].c.n + " \xB7 " + It(Pn(r)) + " s";
      const o = e.getBoundingClientRect();
      ((n.style.left = s.clientX - o.left + "px"), t && In(r));
    }),
    e.addEventListener("pointerup", () => {
      t = !1;
    }),
    e.addEventListener("pointercancel", () => {
      t = !1;
    }),
    e.addEventListener("keydown", (s) => {
      (s.key === "ArrowLeft" || s.key === "ArrowRight") &&
        (s.preventDefault(),
        s.stopPropagation(),
        In(Se + (s.key === "ArrowLeft" ? -2 : 2)));
    }));
}
function In(e) {
  ((Se = U(e, 0, Jo)), (dt = !1), Se >= Jo - 0.01 && (So = !1), sa());
}
function Ln(e) {
  ((So = e ?? !So), So && Se >= Jo - 0.01 && (Se = 0), So && (dt = !1), sa());
}
function sa() {
  ((L("#pp-i").innerHTML = So
    ? '<path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/>'
    : '<path d="M7 4.5v15l12.5-7.5z"/>'),
    L("#pp").setAttribute("aria-label", So ? "Pause" : "Play"));
}
const gr = (e) => {
  const t = U(Ee + e, 0, Y.length - 1);
  In(Y[t].t0 + 0.01);
};
((L("#pp").onclick = () => Ln()),
  (L("#prev").onclick = () => gr(Se - Y[Ee].t0 > 1.5 ? 0 : -1)),
  (L("#next").onclick = () => gr(1)),
  document.querySelectorAll("#spd button").forEach(
    (e) =>
      (e.onclick = () => {
        ((lr = +e.dataset.v),
          document
            .querySelectorAll("#spd button")
            .forEach((t) => t.classList.toggle("on", t === e)));
      }),
  ));
function R2() {
  L("#clock").innerHTML = It(st) + "<small>s</small>";
  let e;
  if (Z0 < 1e-7) e = "time held";
  else {
    const t = 1e3 / Z0;
    e =
      t < 1.5
        ? "real time"
        : "slowed " +
          (t >= 1e6
            ? (t / 1e6).toFixed(1) + " million"
            : t >= 1e4
              ? Math.round(t / 1e3) + ",000"
              : Math.round(t).toLocaleString("en")) +
          "\xD7";
  }
  L("#slowmo").textContent = e;
}
const Xn = document.createElement("canvas");
((Xn.id = "vec"), (Xn.width = 560), (Xn.height = 68));
let ps = "";
function vr() {
  const e = Y[Ee].c;
  if (e.lens) return e.lens();
  const t = wo(st);
  return t > 0 && t < k.steps.length
    ? ue + t - 1
    : t >= k.steps.length
      ? oo - 1
      : Go((s) => s.t === " blue" && s.role === "user");
}
function z2(e, t) {
  const n = Xn.getContext("2d"),
    s = Xn.width,
    r = Xn.height;
  n.clearRect(0, 0, s, r);
  const a = ye(e * 7 + 13),
    o = 144,
    i = s / o;
  for (let c = 0; c < o; c++) {
    const f =
        (a() - 0.5) * 2 * (0.4 + 0.6 * a()) +
        Math.sin(c * 0.37 + e) * 0.2 +
        (t / 36) * Math.sin(c * 1.3 + e * 0.1) * 0.5,
      d = U(Math.abs(f), 0, 1);
    ((n.fillStyle =
      f > 0
        ? `rgba(255,${(180 - d * 40) | 0},${(84 - d * 30) | 0},${0.2 + d * 0.8})`
        : `rgba(${(127 - d * 40) | 0},${(227 - d * 20) | 0},255,${0.2 + d * 0.8})`),
      n.fillRect(c * i, 4, i - 1, r - 8));
  }
}
function A2() {
  const e = Y.findIndex((f) => f.c.id === "tokens");
  if (Ee > 0 && Ee < e) {
    ps !== "none" &&
      ((ps = "none"),
      (L("#insp-title").textContent = "No tokens yet"),
      (L("#insp-dot").style.background = "#8c93a8"),
      (L("#insp-dot").style.boxShadow = "none"),
      (L("#insp-where").textContent = ""),
      (L("#insp-body").innerHTML =
        '<p class="foot" style="margin:4px 2px 6px;font-size:12px;line-height:1.55;color:#aeb8d0">Your words are still plain text. In a moment the server cuts them into tokens; this panel then follows one of them, <b style="color:#ffd9a3">\xB7blue</b>, all the way up the model.</p>'));
    return;
  }
  const t = vr();
  if (t == null || t < 0 || !Ae[t]) return;
  const n = Ae[t],
    s = ri(t, st),
    r = t < ue || st >= ii(t),
    a =
      t +
      "|" +
      Math.floor(s) +
      "|" +
      r +
      "|" +
      Ee +
      "|" +
      De.temp +
      De.think +
      De.hist +
      "|" +
      Lo;
  if (a === ps) return;
  ps = a;
  const o = cn[n.role];
  ((L("#insp-title").textContent =
    n.role === "mark" ? "Marker" : o.n[0].toUpperCase() + o.n.slice(1)),
    (L("#insp-dot").style.background = o.c),
    (L("#insp-dot").style.boxShadow = "0 0 10px " + o.c),
    (L("#insp-where").textContent =
      `position ${(n.pos + 1).toLocaleString("en")} of ${(yt() + ot).toLocaleString("en")}`));
  let i = `<div class="tok-big"><b>${aa(bt(n.t))}</b><span>${n.id >= 0 ? "token " + n.id.toLocaleString("en") : n.many + " tokens"}<br>${n.gen >= 0 ? "written" : "read"}</span></div>`;
  if (
    ((i += `<div class="irow">Floors done<em>${Math.floor(s)} / 36</em></div><div class="irow">Kept in the cache<em>${ao(Math.floor(s) * Lc)} of ${ao(zo)}</em></div>`),
    (i += `<div class="irow" style="margin-bottom:6px">Its 2,880 numbers<em>${s > 0 ? "floor " + Math.floor(s) : "from the table"}</em></div>`),
    n.gen >= 0 && n.top)
  ) {
    const f = Wi(
      n.top.map(([d, h]) => ({ t: d, p: h })),
      Math.max(0, 1 - n.top.reduce((d, h) => d + h[1], 0)),
      Lo,
    ).top.map((d) => [d.t, d.p]);
    i +=
      '<div class="cands">' +
      f
        .slice(0, 6)
        .map(
          ([d, h]) =>
            `<div class="cand${d === n.t ? " on" : ""}"><i style="width:${Math.max(h * 100, 1.5)}%"></i><span>${aa(bt(d))}</span><em>${$o(h)}</em></div>`,
        )
        .join("") +
      "</div>";
  } else
    n.gen >= 0 &&
      (i += `<p class="foot">Picked at ${It(ii(t))} s. The odds for ${n.role === "think" ? "thinking tokens" : "markers"} aren\u2019t returned by the API.</p>`);
  ((L("#insp-body").innerHTML = i),
    L("#insp-body .irow:nth-of-type(3)")?.after(Xn),
    z2(Math.max(n.id, 1), s));
}
const aa = (e) =>
    e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  ms = { c: L("#ladder"), on: !1 };
((L("#tab-p").onclick = () => {
  ((ms.on = !1),
    L("#tab-p").classList.add("on"),
    L("#tab-t").classList.remove("on"),
    (L("#pane-p").hidden = !1),
    (L("#pane-t").hidden = !0));
}),
  (L("#tab-t").onclick = () => {
    ((ms.on = !0),
      L("#tab-t").classList.add("on"),
      L("#tab-p").classList.remove("on"),
      (L("#pane-p").hidden = !0),
      (L("#pane-t").hidden = !1));
  }));
function P2() {
  if (!ms.on) return;
  const e = ms.c.getContext("2d"),
    t = ms.c.width,
    n = ms.c.height;
  e.clearRect(0, 0, t, n);
  const s = [
      ["Your app", 0, k.send, "#ffb454"],
      ["Internet", k.send, k.arrive, "#9db0e0"],
      ["Front door", k.arrive, k.lb, "#b9a2ff"],
      ["Tokens", k.lb, k.tok, "#b9a2ff"],
      ["Queue", k.tok, k.admit, "#8c93a8"],
      ["Prompt", k.steps[0].t0, k.steps[0].t1, "#9db0e0"],
      ["Thinking", k.steps[1]?.t0, k.gen[k.firstAns - 1], "#7df0b4"],
      ["Answer", k.gen[k.firstAns - 1], k.end, "#7fe3ff"],
      ["Home", k.arr[k.firstAns] - Ho, k.done, "#ffd27a"],
    ],
    r = 150,
    a = t - 20,
    o = k.total,
    i = (f) => r + (a - r) * U(f / o, 0, 1);
  ((e.font = "500 22px DM Mono, monospace"),
    (e.textBaseline = "middle"),
    s.forEach(([f, d, h, m], p) => {
      const x = 40 + p * 62;
      if (
        ((e.fillStyle = "#8f99b6"),
        e.fillText(f, 4, x),
        (e.fillStyle = "#ffffff10"),
        e.fillRect(r, x - 12, a - r, 24),
        (e.fillStyle = m),
        (e.globalAlpha = 0.85),
        e.fillRect(i(d), x - 12, Math.max(3, i(h) - i(d)), 24),
        (e.globalAlpha = 1),
        f === "Thinking" || f === "Answer")
      ) {
        e.fillStyle = "#0b1020";
        for (let w = 1; w < k.steps.length; w++) {
          const g = k.steps[w].t0;
          g > d && g < h && e.fillRect(i(g), x - 12, 1.5, 24);
        }
      }
    }));
  const c = i(st);
  ((e.fillStyle = "#fff"),
    e.fillRect(c - 1.5, 16, 3, n - 60),
    (e.fillStyle = "#cfd6ea"),
    (e.textAlign = c > t - 140 ? "right" : "left"),
    e.fillText(It(st) + " s", c + (c > t - 140 ? -8 : 8), n - 24),
    (e.textAlign = "left"),
    (L("#ladder-foot").textContent =
      `${k.steps.length} steps of ${Qt(k.decode.ms)} ms on the GPU \xB7 ${Ho} ms each way`));
}
const ra = {
  think: "#wi-think",
  temp: "#wi-temp",
  hist: "#wi-hist",
  busy: "#wi-busy",
};
function ys(e, t, n) {
  ((De[e] = t),
    e === "think" && t && (De.temp = 1),
    e === "temp" && !t && (De.think = 0));
  for (const i in ra)
    document
      .querySelectorAll(ra[i] + " button")
      .forEach((c) => c.classList.toggle("on", +c.dataset.v === De[i]));
  const s = us(Se),
    r = U((Se - Y[s].t0) / Y[s].c.dur, 0, 1),
    a = Y[s].c.id;
  Al();
  let o = Y.findIndex((i) => i.c.id === a);
  if ((o < 0 && (o = Math.min(s, Y.length - 1)), (Ee = -1), n)) {
    let i = Y.findIndex((c) => c.c.id === n);
    (i < 0 && (i = o), In(Y[i].t0 + 0.01), Ln(!0));
  } else Se = Y[o].t0 + r * Y[o].c.dur;
  i0(
    {
      think: t
        ? "It thinks a lot: 225 tokens of notes before the answer"
        : "It thinks a little",
      temp: t ? "Normal randomness" : "No randomness: always the favourite",
      hist: [
        "A new chat",
        "A long chat: 20,000 earlier tokens to read again",
        "A long chat, cached on the GPU",
      ][t],
      busy: [
        "Quiet: 4 others on the GPU",
        "31 others on the GPU",
        "Rush hour: 255 others on the GPU",
      ][t],
    }[e] +
      " \xB7 " +
      It(k.total) +
      " s",
  );
}
for (const e in ra)
  document
    .querySelectorAll(ra[e] + " button")
    .forEach((t) => (t.onclick = () => ys(e, +t.dataset.v)));
function Al() {
  (ni(), w1(), T1(), s1(), u1(xo() - 1), f2(), C2(), I2(), (ps = ""));
}
function I2() {
  L("#wi-total").textContent = It(k.total) + " s";
}
L("#go").onclick = () => {
  const e = Y.findIndex((t) => t.c.id === "enter");
  (In(Y[e].t0 + 0.01), Ln(!0));
};
const ia = L("#ui-hint");
let Pl = -9;
function i0(e) {
  ((ia.textContent = e), ia.classList.add("on"), (Pl = at));
}
function Il(e) {
  ((ml = !0),
    (dt = !e),
    L("#cine").classList.toggle("on", e),
    L("#cine").setAttribute("aria-pressed", e));
}
((L("#cine").onclick = () => {
  (Il(dt), !dt && !So && Ln(!0));
}),
  (L("#labels").onclick = () => {
    ((a0 = !a0), L("#labels").classList.toggle("on", a0));
  }),
  (L("#how").onclick = () => L("#info").showModal()),
  (L("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e), i0("Link copied"));
    } catch {}
  }));
let Ll = 0,
  Bl = "";
function L2() {
  const e = Y[Ee].c,
    t = U((Se - Y[Ee].t0) / e.dur, 0, 1),
    s = (pl[e.id] ? pl[e.id]() : []).find(([a, o]) => t >= a && t <= o),
    r = s ? s[2] : "";
  if (r !== Bl) {
    Bl = r;
    const a = L("#say");
    r ? ((a.innerHTML = r), a.classList.add("on")) : a.classList.remove("on");
  }
}
const B2 = new Set([
  "title",
  "guess",
  "think",
  "dice",
  "loop",
  "stop",
  "recap",
]);
let _l = "";
function _2() {
  const e = Y[Ee].c,
    t = B2.has(e.id) && Je === "city";
  if ((L("#gen").classList.toggle("on", t && k.gen[0] <= st), !t)) return;
  let n = 0;
  for (let o = 0; o < ot && k.gen[o] <= st; o++) n = o + 1;
  const s = n + "|" + De.think + De.temp;
  if (s === _l) return;
  _l = s;
  const r = mt().gen,
    a = Math.max(0, n - 16);
  L("#gen-t").innerHTML = r
    .slice(a, n)
    .map(
      (o, i) =>
        `<span class="tk2 ${o[2] === "think" ? "think" : o[2] === "mark" ? "mark" : ""}${a + i === n - 1 ? " new" : ""}">${aa(bt(o[0]))}</span>`,
    )
    .join("");
}
function E2() {
  at - Ll < 0.05 ||
    ((Ll = at),
    Rl(),
    R2(),
    A2(),
    L2(),
    P2(),
    _2(),
    ia.classList.contains("on") && at - Pl > 2.4 && ia.classList.remove("on"),
    L("#cine").classList.toggle("on", !dt));
}
function kr(e, t, n, s, r, a, o = ao) {
  ((e.font = "600 22px Outfit, sans-serif"),
    (e.fillStyle = "#9aa4bf"),
    e.fillText(s, 16, 30));
  let i = 16;
  const c = t - 32;
  for (const [h, m, p] of r) {
    const x = Math.max((m / a) * c, m > 0 ? 5 : 0);
    ((e.fillStyle = p),
      lt(e, i, 46, Math.max(x - 3, 2), 28, 6),
      e.fill(),
      (i += x));
  }
  e.font = "500 21px DM Mono, monospace";
  let f = 16,
    d = 104;
  for (const [h, m, p] of r) {
    const x = `${h} ${o(m)}`,
      w = e.measureText(x).width + 38;
    (f + w > t - 10 && ((f = 16), (d += 32)),
      (e.fillStyle = p),
      lt(e, f, d - 15, 17, 17, 4),
      e.fill(),
      (e.fillStyle = "#d6dcee"),
      e.fillText(x, f + 24, d),
      (f += w));
  }
}
const Mr = {
  memory: (e, t, n) => {
    const s = (xo() - 1) * 1500 * zo,
      r = (yt() + ot) * zo,
      a = 61e9,
      o = Math.max(0, 8e10 - a - s - r);
    kr(
      e,
      t,
      n,
      "WHAT FILLS THE GPU\u2019S 80 GB",
      [
        ["weights", a, "#2e8fc0"],
        ["other chats", s, "#6a78a0"],
        ["yours", r, "#ffb454"],
        ["free", o, "#2a3552"],
      ],
      8e10,
    );
  },
  step: (e, t, n) => {
    const s = k.decode,
      r = Me.attnParams * 2 + Me.embedParams,
      a = s.experts * Me.layers * Me.expertBytes,
      o = s.bytes - s.weights;
    kr(
      e,
      t,
      n,
      `ONE STEP READS ${ao(s.bytes)} (${Qt(s.ms)} ms)`,
      [
        ["attention + tables", r, "#7fe3ff"],
        [`${Math.round(s.experts)} of 128 experts \xD7 36`, a, "#7df0b4"],
        ["caches", o, "#ffb454"],
      ],
      s.bytes,
    );
  },
  bill: (e, t, n) => {
    const s = mt(),
      r = ko("think"),
      a = ko("answer"),
      o = ot - r - a;
    kr(
      e,
      t,
      n,
      "WHAT IT READ AND WROTE, IN TOKENS",
      [
        ["read", yt(), "#9db0e0"],
        ["thinking", r, "#7df0b4"],
        ["answer", a, "#7fe3ff"],
        ["markers", o, "#8c93a8"],
      ],
      yt() + ot,
      (i) => i.toLocaleString("en"),
    );
  },
};
function D2(e) {
  const t = document.createElement("div");
  ((t.className = "ts"),
    (t.innerHTML = `<label>Temperature <b id="ts-v">${Lo.toFixed(1)}</b></label><input id="ts-in" type="range" min="0" max="1.6" step="0.05" value="${Lo}" aria-label="Temperature"><small>Reshapes the odds on the wheel. The token picked stays the one the model picked.</small>`),
    e.appendChild(t));
  const n = t.querySelector("input");
  (n.addEventListener("input", () => {
    ((Lo = +n.value),
      (L("#ts-v").textContent = Lo.toFixed(Lo < 0.1 ? 2 : 1)),
      (ps = ""));
  }),
    n.addEventListener("keydown", (s) => s.stopPropagation()));
}
let bs = null,
  Sr = null;
function F2() {
  return bs
    ? Promise.resolve(bs)
    : (Sr ||
        (Sr =
          import("https://cdn.jsdelivr.net/npm/gpt-tokenizer@3.4.0/esm/encoding/o200k_base.js").then(
            (e) => (bs = e),
          )),
      Sr);
}
function G2() {
  const e = L("#ch-try");
  e.innerHTML =
    '<div class="tt"><input id="tt-in" maxlength="400" spellcheck="false" aria-label="Type any text to split into tokens"><div class="tt-n" id="tt-n">Loading the tokenizer\u2026</div><div class="tt-v" id="tt-v"></div></div>';
  const t = L("#tt-in");
  ((t.value = tt.user), t.focus(), t.select());
  const n = () => {
    if (!bs) return;
    const s = t.value,
      r = bs.encode(s);
    ((L("#tt-v").innerHTML = r
      .map(
        (a, o) =>
          `<span class="tt-t${o % 2 ? " o" : ""}" title="token ${a.toLocaleString("en")}">${aa(bt(bs.decode([a])))}<i>${a}</i></span>`,
      )
      .join("")),
      (L("#tt-n").innerHTML =
        `<b>${r.length}</b> token${r.length === 1 ? "" : "s"} \xB7 ${[...s].length} characters${s.length ? ` \xB7 ${(s.length / Math.max(r.length, 1)).toFixed(1)} per token` : ""}`));
  };
  (t.addEventListener("input", n),
    t.addEventListener("keydown", (s) => s.stopPropagation()),
    F2()
      .then(n)
      .catch(() => {
        L("#tt-n").textContent =
          "Couldn\u2019t load the tokenizer from here (it needs the internet).";
      }));
}
const xn = [
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
let Wo = 0;
const El = {
  dusk: {
    bg: "#1a2440",
    exp: 1,
    env: "dusk",
    envI: 0.8,
    bloomT: 1,
    bloomS: 0.5,
    refl: 0.6,
    hemi: [9348054, 4864816, 0.7],
    sun: [16760970, 2.5],
    rim: 0.55,
    key2: 0.8,
    fogD: 0.0026,
    satK: 1,
  },
  city: {
    bg: "#05080f",
    exp: 1.05,
    env: "city",
    envI: 0.7,
    bloomT: 1,
    bloomS: 0.66,
    refl: 0.9,
    hemi: [5927080, 1185055, 0.32],
    sun: [12374783, 0.7],
    rim: 0.9,
    key2: 0.35,
    fogD: 0.0034,
    satK: 1.04,
  },
  stage: {
    bg: "#0a1430",
    exp: 1.05,
    env: "stage",
    envI: 0.85,
    bloomT: 1,
    bloomS: 0.55,
    refl: 0.8,
    hemi: [8362712, 1844278, 0.55],
    sun: [16765600, 1.6],
    rim: 1.2,
    key2: 0.7,
    fogD: 0,
    satK: 1,
  },
};
let Tr = "city";
function Dl() {
  const e = El[Tr];
  (Bt.background.set(e.bg),
    (Ve.toneMappingExposure = D.exposure * e.exp),
    (Bt.environment = Ts[e.env]),
    (Bt.environmentIntensity = D.env * e.envI),
    (an.threshold = D.bloomThreshold * e.bloomT),
    (an.strength = D.bloomStrength * e.bloomS),
    (y0.uReflStrength.value = D.reflect * e.refl),
    p0.color.set(e.hemi[0]),
    p0.groundColor.set(e.hemi[1]),
    (p0.intensity = e.hemi[2] * D.fill),
    ct.color.set(e.sun[0]),
    (ct.intensity = e.sun[1] * D.sun),
    (xa.intensity = e.rim * D.rim),
    (wa.intensity = e.key2 * D.fill),
    (Vr.value = D.sat * e.satK));
}
function yo() {
  (Ve.setPixelRatio(D.pixelRatio),
    bo.setPixelRatio(D.pixelRatio),
    zs.rt.samples !== D.msaa && ((zs.rt.samples = D.msaa), zs.rt.dispose()),
    (qr.enabled = !!D.smaa),
    ct.shadow.mapSize.x !== D.shadow &&
      (ct.shadow.mapSize.set(D.shadow, D.shadow),
      ct.shadow.map?.dispose(),
      (ct.shadow.map = null)),
    (an.enabled = !!D.bloom),
    (an.radius = D.bloomRadius),
    (rt.enabled = !0),
    rt.updateGtaoMaterial({
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: D.ao ? D.aoSamples : 2,
    }),
    (Ht.enabled = !!D.dof),
    (Ht.u.maxCoc.value = D.maxCoc),
    Dl(),
    Hl());
}
function wn() {
  ((L("#tune-rows").innerHTML = xn
    .map(([e, t, n, s, , r, a], o) => {
      const i = D[e],
        c = ((i - n) / (s - n)) * 100;
      return `<div class="tr${o === Wo ? " sel" : ""}${a ? " sub" : ""}" data-i="${o}"><b>${t}</b><span class="tk"><i style="left:${U(c, 0, 100)}%"></i></span><u>${r(i)}</u></div>`;
    })
    .join("")),
    L("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((Wo = +e.dataset.i), wn());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (n) => {
          (n.stopPropagation(),
            (Wo = +e.dataset.i),
            t.setPointerCapture(n.pointerId));
          const s = (r) => {
            const a = t.getBoundingClientRect(),
              [o, , i, c, f] = xn[Wo],
              d = U(
                Math.round(
                  (i + ((r.clientX - a.left) / a.width) * (c - i)) / f,
                ) * f,
                i,
                c,
              );
            d !== D[o] &&
              ((D[o] = +d.toFixed(4)), o !== "auto" && (D.auto = 0), yo());
            const h = t.querySelector("i");
            ((h.style.left = U(((D[o] - i) / (c - i)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = xn[Wo][5](D[o])),
              (L("#tune-json").value = JSON.stringify(D)));
          };
          (s(n),
            (t.onpointermove = (r) => {
              t.hasPointerCapture(r.pointerId) && s(r);
            }),
            (t.onpointerup = () => wn()));
        };
      }),
    (L("#tune-json").value = JSON.stringify(D)));
}
function V2(e, t) {
  const [n, , s, r, a] = xn[Wo],
    o = U(+(D[n] + e * a * (t ? 5 : 1)).toFixed(4), s, r);
  o !== D[n] && ((D[n] = o), n !== "auto" && (D.auto = 0), yo(), wn());
}
function Fl(e) {
  const t = L("#tune"),
    n = e === void 0 ? t.hidden : e;
  ((t.hidden = !n), n && wn());
}
function $2(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (Wo = (Wo + (t === "ArrowUp" ? -1 : 1) + xn.length) % xn.length),
      wn(),
      L("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (V2(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [n, , s, r, a] = xn[Wo];
    return r - s === a
      ? ((D[n] = D[n] ? 0 : 1), n !== "auto" && (D.auto = 0), yo(), wn(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(D, Ta) : (D[xn[Wo][0]] = Ta[xn[Wo][0]]),
      (D.auto = 0),
      yo(),
      wn(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(D, null, 1)), !0)
      : t === "Escape"
        ? (Fl(!1), !0)
        : !1;
}
(L("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const n in Ta) typeof t[n] == "number" && (D[n] = t[n]);
    ((D.auto = 0), yo(), wn());
  } catch {
    wn();
  }
}),
  setInterval(() => {
    L("#tune").hidden || (L("#tune-fps").textContent = Math.round(ql) + " fps");
  }, 500));
let ge = null,
  Oo = !1,
  To = null,
  xs = null,
  en = -1,
  Cf = 0;
try {
  Oo = localStorage.getItem("prompt-sound") === "1";
} catch {}
function Gl() {
  if (ge) return;
  ge = new (window.AudioContext || window.webkitAudioContext)();
  const e = ge.createDynamicsCompressor();
  ((e.threshold.value = -18),
    (e.ratio.value = 3),
    e.connect(ge.destination),
    (To = ge.createGain()),
    (To.gain.value = 0),
    To.connect(e));
  const t = ge.sampleRate * 4,
    n = ge.createBuffer(1, t, ge.sampleRate),
    s = n.getChannelData(0);
  let r = 0;
  for (let f = 0; f < t; f++) {
    const d = Math.random() * 2 - 1;
    ((r = (r + 0.02 * d) / 1.02), (s[f] = r * 3.2));
  }
  const a = ge.createBufferSource();
  ((a.buffer = n), (a.loop = !0));
  const o = ge.createBiquadFilter();
  ((o.type = "lowpass"), (o.frequency.value = 700));
  const i = ge.createGain();
  ((i.gain.value = 0.05),
    a.connect(o).connect(i).connect(To),
    a.start(),
    (xs = ge.createGain()),
    (xs.gain.value = 0));
  const c = ge.createBiquadFilter();
  ((c.type = "lowpass"),
    (c.frequency.value = 420),
    c.connect(xs),
    xs.connect(To));
  for (const [f, d, h] of [
    [55, "sawtooth", 0.16],
    [110.4, "triangle", 0.12],
    [1760, "sine", 0.012],
  ]) {
    const m = ge.createOscillator();
    ((m.type = d), (m.frequency.value = f));
    const p = ge.createGain();
    ((p.gain.value = h), m.connect(p).connect(f > 1e3 ? xs : c), m.start());
  }
}
const ws = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24],
  Vl = new WeakMap();
function la(e, t, n, s, r) {
  let a = Vl.get(e);
  if (!a) {
    const f = Math.round(e.sampleRate * 0.06),
      d = ye(7);
    a = e.createBuffer(1, f, e.sampleRate);
    const h = a.getChannelData(0);
    for (let m = 0; m < f; m++)
      h[m] = (d() * 2 - 1) * Math.exp(-m / (e.sampleRate * 0.007));
    Vl.set(e, a);
  }
  const o = e.createBufferSource();
  ((o.buffer = a),
    (o.playbackRate.value = r ? 0.62 : 0.86 + ((s * 7919) % 13) / 42));
  const i = e.createBiquadFilter();
  ((i.type = "bandpass"),
    (i.frequency.value = r ? 1700 : 3100),
    (i.Q.value = 1.1));
  const c = e.createGain();
  ((c.gain.value = r ? 0.3 : 0.18),
    o.connect(i).connect(c).connect(t),
    o.start(n),
    o.stop(n + 0.12));
}
function ca(e, t = 0.22, n = 0.08, s = "sine") {
  if (!ge) return;
  const r = ge.currentTime,
    a = ge.createOscillator(),
    o = ge.createGain();
  ((a.type = s),
    (a.frequency.value = e),
    o.gain.setValueAtTime(0, r),
    o.gain.linearRampToValueAtTime(n, r + 0.006),
    o.gain.exponentialRampToValueAtTime(5e-4, r + t),
    a.connect(o).connect(To),
    a.start(r),
    a.stop(r + t + 0.05));
}
function W2(e) {
  Oo = e ?? !Oo;
  try {
    localStorage.setItem("prompt-sound", Oo ? "1" : "0");
  } catch {}
  (L("#snd").classList.toggle("on", Oo),
    L("#snd").setAttribute("aria-pressed", Oo),
    Oo
      ? (Gl(), ge.resume(), To.gain.setTargetAtTime(0.9, ge.currentTime, 0.3))
      : ge && To.gain.setTargetAtTime(0, ge.currentTime, 0.15),
    i0(Oo ? "Sound on" : "Sound off"));
}
let Cr = null,
  fa = null;
function O2() {
  if (!fa) {
    const r = ge.sampleRate * 2;
    fa = ge.createBuffer(1, r, ge.sampleRate);
    const a = fa.getChannelData(0);
    let o = 0;
    for (let i = 0; i < r; i++)
      ((o = (o + 0.02 * (Math.random() * 2 - 1)) / 1.02), (a[i] = o * 3.2));
  }
  const e = ge.currentTime,
    t = ge.createBufferSource();
  t.buffer = fa;
  const n = ge.createBiquadFilter();
  ((n.type = "bandpass"),
    (n.Q.value = 0.7),
    n.frequency.setValueAtTime(700, e),
    n.frequency.exponentialRampToValueAtTime(1900, e + 0.4));
  const s = ge.createGain();
  (s.gain.setValueAtTime(0.07, e),
    s.gain.linearRampToValueAtTime(0, e + 0.6),
    t.connect(n).connect(s).connect(To),
    t.start(e),
    t.stop(e + 0.7));
}
let ha = -1;
function U2() {
  if (!Oo || !ge) return;
  const e = st;
  (Cr && Je !== Cr && O2(), (Cr = Je));
  const t = Math.round(dr(Se) * tt.user.length);
  (Je === "desk" &&
    t > ha &&
    ha >= 0 &&
    t - ha < 4 &&
    la(ge, To, ge.currentTime, t, !1),
    (ha = t),
    Je === "desk" &&
      en >= 0 &&
      en < k.send &&
      e >= k.send &&
      e - en < 400 &&
      la(ge, To, ge.currentTime, 0, !0));
  const n = wo(e);
  let s = 0;
  if (n >= 0 && n < k.steps.length) {
    const a = k.steps[n],
      o = (e - a.t0) / (a.t1 - a.t0);
    s = oe(0, 0.06, o) * oe(1, Tt, o);
  }
  if (
    (xs.gain.setTargetAtTime(
      s * (Je === "city" ? 0.5 : Je === "dc" ? 0.3 : 0.06),
      ge.currentTime,
      0.05,
    ),
    en < 0 || e < en || e - en > 400)
  ) {
    en = e;
    return;
  }
  let r = 0;
  for (let a = 0; a < ot; a++) {
    const o = k.gen[a];
    if (o > en && o <= e && r < 3) {
      const c = mt().gen[a][2];
      if ((r++, c === "answer")) {
        const f = a - k.firstAns;
        ca(440 * Math.pow(2, ws[f % ws.length] / 12), 0.35, 0.07, "triangle");
      } else
        c === "think"
          ? ca(220 * Math.pow(2, ws[(a * 3) % 7] / 12), 0.28, 0.05, "sine")
          : ca(1760, 0.04, 0.022, "triangle");
    }
    const i = k.arr[a];
    Je === "desk" &&
      mt().gen[a][2] === "answer" &&
      i > en &&
      i <= e &&
      ca(2600, 0.03, 0.04, "triangle");
  }
  en = e;
}
d0.push(U2);
const Co = Ve.domElement,
  qn = new Map(),
  $l = new l.Raycaster(),
  Wl = new l.Vector2();
let da = 0,
  gs = null,
  tn = null,
  Rr = null;
function zr(e) {
  const t = Co.getBoundingClientRect();
  (Wl.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -((e.clientY - t.top) / t.height) * 2 + 1,
  ),
    $l.setFromCamera(Wl, Z));
  const n = $l.intersectObjects(
    M0.map((r) => r.hit).filter((r) => r.visible && H2(r)),
    !1,
  );
  if (!n.length) return null;
  const s = M0.find((r) => r.hit === n[0].object);
  return s ? { kind: "link", L: s, dist: n[0].distance } : null;
}
function H2(e) {
  for (; e;) {
    if (!e.visible) return !1;
    e = e.parent;
  }
  return !0;
}
function N2(e) {
  if (e && e.kind === "link") {
    window.open(ic, "_blank", "noopener");
    return;
  }
}
function Ar(e, t) {
  const n =
      (Z.position.distanceTo(be.t) *
        2 *
        Math.tan(l.MathUtils.degToRad(Z.fov / 2))) /
      Math.max(no.clientHeight, 1),
    s = Math.cos(be.yaw),
    r = Math.sin(be.yaw);
  ua();
  const a = Re[Je || "city"];
  ((be.t.x = U(be.t.x - s * e * n, a - 260, a + 260)),
    (be.t.z = U(be.t.z + r * e * n, -260, 120)),
    (be.t.y = U(be.t.y + t * n, 0.05, 90)));
}
const Kn = L("#tip");
let l0 = null;
function X2(e) {
  const t = zr(e),
    n = t?.kind === "link" ? t.L : null;
  (n !== l0 && (l0?.over(!1), n?.over(!0), (l0 = n)),
    (Co.style.cursor = t ? "pointer" : ""));
  const s = t ? "@RYANSAEL on X" : "";
  s
    ? ((Kn.textContent = s),
      (Kn.style.left = e.clientX + "px"),
      (Kn.style.top = e.clientY + "px"),
      Kn.classList.add("on"))
    : Kn.classList.remove("on");
}
function ua() {
  dt || ((dt = !0), L("#cine").classList.remove("on"));
}
(Co.addEventListener("contextmenu", (e) => e.preventDefault()),
  Co.addEventListener("pointerleave", () => {
    (l0?.over(!1),
      (l0 = null),
      Kn.classList.remove("on"),
      (Co.style.cursor = ""));
  }),
  Co.addEventListener("pointerdown", (e) => {
    try {
      Co.setPointerCapture(e.pointerId);
    } catch {}
    (Kn.classList.remove("on"),
      qn.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
      (gs = null),
      (Rr = e.button === 0 && !e.shiftKey && qn.size === 1 ? zr(e) : null),
      (tn =
        e.button === 0 && !e.shiftKey
          ? [e.clientX, e.clientY, performance.now()]
          : null));
  }),
  Co.addEventListener("pointermove", (e) => {
    const t = qn.get(e.pointerId);
    if (!t) {
      X2(e);
      return;
    }
    const n = e.clientX - t[0],
      s = e.clientY - t[1];
    if (
      ((t[0] = e.clientX),
      (t[1] = e.clientY),
      tn && Math.hypot(e.clientX - tn[0], e.clientY - tn[1]) > 6 && (tn = null),
      !tn)
    ) {
      if ((ua(), qn.size === 2)) {
        const [r, a] = [...qn.values()],
          o = Math.hypot(r[0] - a[0], r[1] - a[1]),
          i = [(r[0] + a[0]) / 2, (r[1] + a[1]) / 2];
        (da && (mo = U((mo * da) / o, 0.1, 4)),
          (da = o),
          gs && Ar(i[0] - gs[0], i[1] - gs[1]),
          (gs = i));
        return;
      }
      t[2]
        ? Ar(n, s)
        : ((be.yaw -= n * 0.004),
          (be.pitch = U(be.pitch + s * 0.003, -0.2, 1.45)));
    }
  }));
const Ol = (e) => {
  (tn && qn.size === 1 && performance.now() - tn[2] < 450 && N2(Rr),
    (tn = null),
    (Rr = null),
    qn.delete(e.pointerId),
    (da = 0),
    (gs = null));
};
(Co.addEventListener("pointerup", Ol),
  Co.addEventListener("pointercancel", (e) => {
    ((tn = null), Ol(e));
  }),
  Co.addEventListener(
    "wheel",
    (e) => {
      (e.preventDefault(),
        ua(),
        (mo = U(
          mo * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
          0.1,
          4,
        )));
    },
    { passive: !1 },
  ));
const vs = new Set();
(addEventListener("keyup", (e) => vs.delete(e.key.toLowerCase())),
  addEventListener("blur", () => vs.clear()));
const q2 = new l.Vector3();
function K2() {
  if (!vs.size) return;
  const e = (vs.has("shift") ? 2.4 : 1) * Bn,
    t = (...r) => r.some((a) => vs.has(a));
  let n = 0,
    s = 0;
  (t("a", "arrowleft") && (n += 1),
    t("d", "arrowright") && (n -= 1),
    t("w", "arrowup") && (s += 1),
    t("s", "arrowdown") && (s -= 1),
    (n || s) &&
      (Ar(n * e * 420, 0),
      be.t.addScaledVector(
        q2.set(-Math.sin(be.yaw), 0, -Math.cos(be.yaw)),
        s * e * be.dist * mo * 0.6,
      )),
    t("q") && (be.yaw += e * 1.1),
    t("e") && (be.yaw -= e * 1.1),
    t("=", "+") && (mo = U(mo * Math.exp(-e * 1.3), 0.1, 4)),
    t("-", "_") && (mo = U(mo * Math.exp(e * 1.3), 0.1, 4)),
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
    ) && ua());
}
function Ul() {
  ((dt = !1), (mo = 1), L("#cine").classList.add("on"));
}
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), Fl());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    L("#info")?.open
  )
    return;
  if (!L("#tune").hidden && $2(e)) {
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
    if (e.target.id === "track") return;
    (t.startsWith("arrow") && e.preventDefault(), vs.add(t));
    return;
  }
  t === " "
    ? (e.preventDefault(), Ln())
    : t === "enter"
      ? L("#go").click()
      : t === "[" || t === "]"
        ? gr(t === "[" ? (Se - Y[Ee].t0 > 1.5 ? 0 : -1) : 1)
        : t === "c"
          ? L("#cine").click()
          : t === "r"
            ? Ul()
            : t === "n"
              ? (L("#labels").click(), i0(a0 ? "Labels on" : "Labels off"))
              : t === "m"
                ? L("#snd").click()
                : t === "/" &&
                  (e.preventDefault(),
                  Er.classList.toggle("ui-off"),
                  i0(
                    Er.classList.contains("ui-off")
                      ? "Interface hidden \xB7 / to show"
                      : "Interface shown",
                  ));
}),
  Co.addEventListener("dblclick", (e) => {
    zr(e) || Ul();
  }));
async function Y2(e, t) {
  const s = Math.ceil(t * 48e3),
    r = new OfflineAudioContext(2, s, 48e3),
    a = r.createDynamicsCompressor();
  ((a.threshold.value = -18), (a.ratio.value = 3), a.connect(r.destination));
  const o = r.createGain();
  ((o.gain.value = 0.9), o.connect(a));
  const i = r.createBuffer(1, 48e3 * 4, 48e3),
    c = i.getChannelData(0);
  let f = 0;
  const d = ye(99);
  for (let B = 0; B < c.length; B++) {
    const O = d() * 2 - 1;
    ((f = (f + 0.02 * O) / 1.02), (c[B] = f * 3.2));
  }
  const h = r.createBufferSource();
  ((h.buffer = i), (h.loop = !0));
  const m = r.createBiquadFilter();
  ((m.type = "lowpass"), (m.frequency.value = 700));
  const p = r.createGain();
  ((p.gain.value = 0.05), h.connect(m).connect(p).connect(o), h.start(0));
  const x = r.createGain();
  x.gain.value = 0;
  const w = r.createBiquadFilter();
  ((w.type = "lowpass"), (w.frequency.value = 420), w.connect(x), x.connect(o));
  for (const [B, O, j] of [
    [55, "sawtooth", 0.16],
    [110.4, "triangle", 0.12],
    [1760, "sine", 0.012],
  ]) {
    const J = r.createOscillator();
    ((J.type = O), (J.frequency.value = B));
    const K = r.createGain();
    ((K.gain.value = j), J.connect(K).connect(B > 1e3 ? x : w), J.start(0));
  }
  const g = (B, O, j, J, K) => {
      const X = r.createOscillator(),
        q = r.createGain();
      ((X.type = K),
        (X.frequency.value = O),
        q.gain.setValueAtTime(0, B),
        q.gain.linearRampToValueAtTime(J, B + 0.006),
        q.gain.exponentialRampToValueAtTime(5e-4, B + j),
        X.connect(q).connect(o),
        X.start(B),
        X.stop(B + j + 0.05));
    },
    u = (B) => {
      const O = r.createBufferSource();
      O.buffer = i;
      const j = r.createBiquadFilter();
      ((j.type = "bandpass"),
        (j.Q.value = 0.7),
        j.frequency.setValueAtTime(380, B),
        j.frequency.exponentialRampToValueAtTime(1900, B + 0.7));
      const J = r.createGain();
      (J.gain.setValueAtTime(0, B),
        J.gain.linearRampToValueAtTime(0.09, B + 0.35),
        J.gain.linearRampToValueAtTime(0, B + 0.9),
        O.connect(j).connect(J).connect(o),
        O.start(B, (B * 0.37) % 3),
        O.stop(B + 1));
    },
    y = { t: new l.Vector3(), f: new l.Vector3() };
  let b = Pn(0),
    M = null,
    T = 0;
  for (let B = 0; (B * 1) / e < t; B++) {
    const O = B / e,
      j = O,
      J = Pn(O);
    gl(O, y);
    const K = y.set;
    (M && K !== M && u(Math.max(0, j - 0.35)), (M = K));
    const X = Math.round(dr(O) * tt.user.length);
    (K === "desk" && X > T && X - T < 4 && la(r, o, j, X, !1),
      (T = X),
      K === "desk" &&
        b < k.send &&
        J >= k.send &&
        J - b < 400 &&
        la(r, o, j, 0, !0));
    const q = wo(J);
    let ne = 0;
    if (q >= 0 && q < k.steps.length) {
      const le = k.steps[q],
        ee = (J - le.t0) / (le.t1 - le.t0);
      ne = oe(0, 0.06, ee) * oe(1, Tt, ee);
    }
    if (
      (x.gain.setTargetAtTime(
        ne * (K === "city" ? 0.5 : K === "dc" ? 0.3 : 0.06),
        j,
        0.05,
      ),
      J > b && J - b < 400)
    ) {
      let le = 0;
      for (let ee = 0; ee < ot; ee++) {
        const Te = k.gen[ee];
        if (Te > b && Te <= J && le < 3) {
          const de = mt().gen[ee][2];
          if ((le++, de === "answer")) {
            const Pe = ee - k.firstAns;
            g(
              j,
              440 * Math.pow(2, ws[Pe % ws.length] / 12),
              0.35,
              0.07,
              "triangle",
            );
          } else
            de === "think"
              ? g(
                  j,
                  220 * Math.pow(2, ws[(ee * 3) % 7] / 12),
                  0.28,
                  0.05,
                  "sine",
                )
              : g(j, 1760, 0.04, 0.022, "triangle");
        }
        const fe = k.arr[ee];
        K === "desk" &&
          mt().gen[ee][2] === "answer" &&
          fe > b &&
          fe <= J &&
          g(j, 2600, 0.03, 0.04, "triangle");
      }
    }
    b = J;
  }
  const S = await r.startRendering(),
    C = [S.getChannelData(0), S.getChannelData(1)],
    R = S.length,
    z = new DataView(new ArrayBuffer(44 + R * 4)),
    I = (B, O) => {
      for (let j = 0; j < O.length; j++) z.setUint8(B + j, O.charCodeAt(j));
    };
  (I(0, "RIFF"),
    z.setUint32(4, 36 + R * 4, !0),
    I(8, "WAVE"),
    I(12, "fmt "),
    z.setUint32(16, 16, !0),
    z.setUint16(20, 1, !0),
    z.setUint16(22, 2, !0),
    z.setUint32(24, 48e3, !0),
    z.setUint32(28, 48e3 * 4, !0),
    z.setUint16(32, 4, !0),
    z.setUint16(34, 16, !0),
    I(36, "data"),
    z.setUint32(40, R * 4, !0));
  for (let B = 0; B < R; B++)
    for (let O = 0; O < 2; O++)
      z.setInt16(
        44 + (B * 2 + O) * 2,
        Math.max(-1, Math.min(1, C[O][B])) * 32767,
        !0,
      );
  const G = new Uint8Array(z.buffer);
  let V = "";
  for (let B = 0; B < G.length; B += 32768)
    V += String.fromCharCode.apply(null, G.subarray(B, B + 32768));
  return ((window.__wav = btoa(V)), window.__wav.length);
}
function j2() {
  const e = no.clientWidth,
    t = no.clientHeight;
  ta = e < 900;
  const n = D.fov + (ta ? (e < t ? 18 : 10) : 0);
  (Z.fov !== n && ((Z.fov = n), Z.updateProjectionMatrix()),
    Z.setViewOffset(e, t, ta ? 0 : -e * 0.035, ta ? t * 0.08 : t * 0.035, e, t),
    (Ml =
      Z.aspect < 0.8
        ? U(0.55 / Math.max(Z.aspect, 0.4), 1, 1.35)
        : U(1.6 / Z.aspect, 0.9, 1.25)));
}
function Hl() {
  const e = no.clientWidth,
    t = no.clientHeight;
  ((Z.aspect = e / t),
    Z.updateProjectionMatrix(),
    Ve.setSize(e, t),
    bo.setSize(e, t));
  const n = Ve.getDrawingBufferSize(new l.Vector2());
  (ka.setSize(Math.round(n.x * 0.5), Math.round(n.y * 0.5)),
    g0.uRes.value.copy(n),
    j2(),
    Z.updateProjectionMatrix(),
    Y.length && Rl());
}
addEventListener("resize", Hl);
let Bn = 0.016,
  Pr = 0.016,
  at = 0,
  Nl = performance.now(),
  Ir = 0,
  Lr = 0,
  Xl = 0,
  ql = 0,
  Br = 0,
  pa = 0,
  ma = 0;
function Kl(e) {
  ((Pr = U((e - Nl) / 1e3, 0, 1.5)), (Bn = Math.min(0.1, Pr)), (Nl = e));
  const t = e / 1e3;
  if (
    ((at = t),
    Ss++,
    (Ms.uT.value = t),
    vl(t, Bn),
    Fr.forEach((n) => n(t, Bn)),
    K2(),
    g2(t),
    Z.updateMatrixWorld(),
    (Ve.shadowMap.needsUpdate =
      Ss % 2 === 0 || Ht.u.focus.value < 60 || !ct.shadow.map),
    d0.forEach((n) => n(t, Bn)),
    E2(),
    (Ir += Pr),
    Lr++,
    e - Xl > 1600)
  ) {
    const n = Lr / Math.max(Ir, 0.001);
    ((Ir = 0),
      (Lr = 0),
      (Xl = e),
      (ql = n),
      pa++,
      pa > 2 && (Br = Math.max(Br, n)),
      (ma = pa > 3 && n < Br * 0.74 ? ma + 1 : 0),
      D._ceil === void 0 &&
        ((D._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (D._good = 0),
        (D._probe = 0)),
      !document.hidden &&
        D.auto &&
        pa > 3 &&
        (D._probe && n < 55
          ? ((D._probe = 0),
            (D._good = 0),
            (D._ceil = Math.max(1, +(D.pixelRatio - 0.25).toFixed(2))),
            (D.pixelRatio = D._ceil),
            yo())
          : ((D._probe = 0),
            (D._good = n >= 58 ? Math.min(9, D._good + 1) : 0),
            D._good >= 3 &&
              D.pixelRatio < D._ceil &&
              ((D._good = 0),
              (D._probe = 1),
              (D.pixelRatio = Math.min(
                D._ceil,
                +(D.pixelRatio + 0.25).toFixed(2),
              )),
              yo()))),
      !document.hidden &&
        D.auto &&
        ma >= 2 &&
        n < 50 &&
        ((ma = 0),
        D.pixelRatio > 1
          ? ((D.pixelRatio = D._ceil =
              Math.max(1, +(D.pixelRatio - 0.25).toFixed(2))),
            yo())
          : D.reflect
            ? ((D.reflect = 0), yo())
            : D.msaa > 0
              ? ((D.msaa = 0), yo())
              : D.ao && ((D.ao = 0), yo())));
  }
  (xc(), Ve.info.reset(), bo.render());
}
let Yl = !0;
function jl(e) {
  (requestAnimationFrame(jl), Yl && Kl(e));
}
(Fr.push((e, t) => {
  const n = st;
  if (Je === "city") {
    (g1(n), C1(n));
    const s = Y[Ee].c,
      r = U((Se - Y[Ee].t0) / s.dur, 0, 1),
      a = s.emb ? s.emb(r) : null;
    _1(a ? a.on : 0, a ? a.u : 0);
  } else
    Je === "desk"
      ? Ec(n, Se)
      : Je === "dc"
        ? Zc(n, Se)
        : Je === "stage" && i1(n, Se);
}),
  d0.push(() => {
    (Eo.begin(),
      nr.begin(),
      zt.begin(),
      Je === "city" ? t2(st) : n2(),
      Je === "stage" && h1(),
      Je === "desk" && l2(st),
      Eo.end(),
      nr.end(),
      zt.end());
  }),
  (L("#snd").onclick = () => W2()),
  Oo &&
    (L("#snd").classList.add("on"),
    addEventListener(
      "pointerdown",
      () => {
        Oo &&
          (Gl(),
          ge.resume(),
          To.gain.setTargetAtTime(0.9, ge.currentTime, 0.3));
      },
      { once: !0 },
    )),
  (L("#close").onclick = () => L("#info").close()),
  L("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  Al(),
  yo(),
  (Ee = -1),
  (Se = Y[0].c.dur * 0.3),
  vl(0, 0),
  Il(!0),
  sa(),
  L("#loading").remove(),
  requestAnimationFrame(jl),
  setTimeout(() => {
    !So && !dt && Ee === 0 && Ln(!0);
  }, 700),
  (window.__step = (e) => Kl(e)),
  (window.__loop = (e) => {
    Yl = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const n = Ve.domElement,
      s = document.createElement("canvas");
    return (
      (s.width = e),
      (s.height = Math.round((e * n.height) / n.width)),
      s.getContext("2d").drawImage(n, 0, 0, s.width, s.height),
      s.toDataURL("image/webp", t)
    );
  }),
  (window.__x = {
    dof: Ht,
    gtao: rt,
    bloom: an,
    renderer: Ve,
    camera: Z,
    scene: Bt,
    composer: bo,
    cam: be,
    RT: D,
    overlay: As,
    focPt: vn,
    world: Yn,
    CITY: Kt,
    TOWER: fo,
    DESK: Oe,
    DC: pe,
    STAGE: vo,
    SETX: Re,
    HOLOS: ur,
    setFoc: (e, t, n, s) => {
      (vn.set(e, t, n), (oa = s));
    },
  }),
  (window.__p = {
    get E() {
      return k;
    },
    SCN: De,
    CH: Qe,
    get FILM() {
      return Y;
    },
    get SEQ() {
      return Ae;
    },
    seek: (e) => {
      In(e);
    },
    play: (e) => Ln(e),
    at: (e, t = 0) => {
      const n = Y.findIndex((s) => s.c.id === e);
      In(Y[n].t0 + t * Y[n].c.dur);
    },
    whatIf: ys,
    manual: (e) => {
      dt = !!e;
    },
    speed: (e) => {
      lr = e;
    },
  }),
  (window.__place = (e, t, n) => {
    const s = no.clientWidth,
      r = no.clientHeight,
      a = new l.Vector3((e / s) * 2 - 1, 1 - (t / r) * 2, 0.5)
        .unproject(Z)
        .sub(Z.position)
        .normalize(),
      o = Z.position.clone().addScaledVector(a, n);
    return {
      p: [+o.x.toFixed(3), +o.y.toFixed(3), +o.z.toFixed(3)],
      ppm: +(r / (2 * n * Math.tan((Z.fov * Math.PI) / 360))).toFixed(1),
      cam: Z.position.toArray().map((i) => +i.toFixed(3)),
    };
  }),
  (window.__cam = (e, t, n, s, r, a, o) => {
    ((dt = !0), e !== Je && bl(e));
    const i = Re[e];
    (be.t.set(t[0] + i, t[1], t[2]),
      (be.yaw = n),
      (be.pitch = s),
      (be.dist = r),
      (mo = 1),
      a && (vn.set(a[0] + i, a[1], a[2]), (oa = o || 20)));
  }),
  (window.__dbg = () => ({
    t: +at.toFixed(2),
    F: +Se.toFixed(2),
    ch: Y[Ee]?.c.id,
    sim: +st.toFixed(3),
    rate: +Z0.toFixed(4),
    set: Je,
    focus: +Ht.u.focus.value.toFixed(2),
    range: +Ht.u.range.value.toFixed(2),
    near: +Z.near.toFixed(3),
    calls: Ve.info.render.calls,
    tris: Ve.info.render.triangles,
    cam: [
      be.t.toArray().map((e) => +e.toFixed(1)),
      +be.yaw.toFixed(2),
      +be.pitch.toFixed(2),
      +be.dist.toFixed(1),
    ],
  })),
  (window.__film = {
    set: (e) => {
      ((Se = U(e, 0, Jo)),
        (So = !1),
        (dt = !1),
        window.__filmClock == null &&
          (L("#pp-i").innerHTML =
            '<path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/>'),
        (window.__filmClock = e));
    },
    len: () => Jo,
    seek: () => Promise.resolve(),
    sound: (e, t) => Y2(e, t),
    tune: (e) => {
      (Object.assign(D, e), yo());
    },
  }));
