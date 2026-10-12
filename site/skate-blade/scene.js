import * as r from "three";
import { EffectComposer as br } from "three/addons/postprocessing/EffectComposer.js";
import {
  Pass as ea,
  FullScreenQuad as bn,
} from "three/addons/postprocessing/Pass.js";
import { GTAOPass as $a } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as yr } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as Mr } from "three/addons/postprocessing/OutputPass.js";
import { SMAAPass as gr } from "three/addons/postprocessing/SMAAPass.js";
import { RoundedBoxGeometry as Sr } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries as Xa } from "three/addons/utils/BufferGeometryUtils.js";
const K = (e) => document.querySelector(e),
  Lt = K("#world"),
  ta = K("#app"),
  re = (e, t, o) => (e < t ? t : e > o ? o : e),
  He = (e, t, o) => e + (t - e) * o,
  fo = (e, t, o) => {
    const n = re((o - e) / (t - e), 0, 1);
    return n * n * (3 - 2 * n);
  },
  hl = (e) => 1 - (1 - e) ** 3,
  pl = (e) => (e < 0.5 ? 2 * e * e : 1 - (-2 * e + 2) ** 2 / 2);
function $e(e) {
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let t = Math.imul(e ^ (e >>> 15), 1 | e);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
const ml = $e(7),
  Kt = (e) => {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Tr = "https://x.com/ryansael",
  ja = "skate-blade",
  Te = new r.Scene();
((Te.background = new r.Color("#10151f")),
  (Te.fog = new r.FogExp2("#1a2130", 0.0065)));
const j = new r.PerspectiveCamera(30, 1, 0.3, 320);
let se;
try {
  se = new r.WebGLRenderer({
    antialias: !1,
    powerPreference: "high-performance",
    stencil: !1,
  });
} catch (e) {
  throw (
    (K("#loading").textContent =
      "This lab needs WebGL. Try a browser with graphics acceleration on."),
    e
  );
}
const kr = 25e5,
  Cr = () => {
    const e = innerWidth || 1440,
      t = innerHeight || 840;
    return re(Math.min(devicePixelRatio, 2, Math.sqrt(kr / (e * t))), 1, 2);
  },
  yn = Cr();
(se.setPixelRatio(yn),
  (se.info.autoReset = !1),
  (se.shadowMap.enabled = !0),
  (se.shadowMap.type = r.PCFShadowMap),
  (se.shadowMap.autoUpdate = !1),
  (se.transmissionResolutionScale = 0.6),
  (se.toneMapping = r.ACESFilmicToneMapping),
  Lt.appendChild(se.domElement));
const Mn = new r.HemisphereLight(9414360, 3813414, 0.5);
Te.add(Mn);
const Re = new r.DirectionalLight(16763279, 2.1);
((Re.castShadow = !0),
  Re.shadow.mapSize.set(2048, 2048),
  Object.assign(Re.shadow.camera, {
    left: -11,
    right: 11,
    top: 9,
    bottom: -7,
    near: 1,
    far: 60,
  }),
  (Re.shadow.normalBias = 0.03),
  (Re.shadow.bias = -4e-4),
  (Re.shadow.radius = 2),
  Te.add(Re, Re.target));
const Rr = new r.Vector3(0.62, 0.62, 0.48).normalize();
(Re.position.copy(Rr).multiplyScalar(30), Re.target.position.set(0, 2, 0));
const oa = new r.DirectionalLight(9427199, 0.9);
(oa.position.set(-6, 9, -14), Te.add(oa));
const na = new r.DirectionalLight(16773600, 0.55);
(na.position.set(-8, 12, 10), Te.add(na));
const Zt = new r.Group();
Te.add(Zt);
const Gt = 10,
  Co = {
    pos: {
      value: Array.from({ length: Gt }, () => new r.Vector4(0, -999, 0, 1)),
    },
    col: { value: Array.from({ length: Gt }, () => new r.Vector3()) },
  },
  zr = `uniform vec4 uFakePos[${Gt}];uniform vec3 uFakeCol[${Gt}];uniform float uSat;`,
  Lr = `#include <lights_fragment_end>
{vec3 fp=-vViewPosition;for(int i=0;i<${Gt};i++){vec3 d=uFakePos[i].xyz-fp;float dd=dot(d,d);float a=max(0.,1.-dd*uFakePos[i].w);a*=a;float n=dot(normal,d)*inversesqrt(dd+1e-4);reflectedLight.directDiffuse+=uFakeCol[i]*(a*(max(n,0.)*.8+.2))*material.diffuseContribution;}}`,
  Pr = `outgoingLight=max(mix(vec3(dot(outgoingLight,vec3(.2126,.7152,.0722))),outgoingLight,uSat),0.);
#include <opaque_fragment>`,
  Ya = { value: 1.16 };
function Xe(e, t) {
  return (
    (e.onBeforeCompile = (o) => {
      (Object.assign(o.uniforms, {
        uFakePos: Co.pos,
        uFakeCol: Co.col,
        uSat: Ya,
      }),
        (o.fragmentShader = o.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + zr,
          )
          .replace("#include <lights_fragment_end>", Lr)
          .replace("#include <opaque_fragment>", Pr)),
        t?.(o));
    }),
    (e.customProgramCacheKey = () => ja + (t ? t.key : "")),
    e
  );
}
const Ka = [];
function Qt(e, t, o, n, a, s) {
  const l = { p: new r.Vector3(e, t, o), c: new r.Color(n), r: a, i: s, i0: s };
  return (Ka.push(l), l);
}
const gn = new r.Vector3(),
  je = [],
  Ro = new r.Vector3(0, 3, 0);
function _r(e) {
  je.length = 0;
  for (const t of Ka)
    if (!(t.i <= 0.001)) {
      if (
        ((t.score = (t.i * t.r) / (1 + t.p.distanceToSquared(e) * 0.01)),
        je.length < Gt)
      )
        (je.push(t), je.length === Gt && je.sort((o, n) => o.score - n.score));
      else if (t.score > je[0].score) {
        je[0] = t;
        for (let o = 0; o < Gt - 1 && je[o].score > je[o + 1].score; o++) {
          const n = je[o];
          ((je[o] = je[o + 1]), (je[o + 1] = n));
        }
      }
    }
}
function Za(e, t) {
  _r(t);
  for (let o = 0; o < Gt; o++) {
    const n = je[o];
    if (!n) {
      (Co.col.value[o].set(0, 0, 0), Co.pos.value[o].set(0, -999, 0, 1));
      continue;
    }
    (gn.copy(n.p).applyMatrix4(e.matrixWorldInverse),
      Co.pos.value[o].set(gn.x, gn.y, gn.z, 1 / (n.r * n.r)),
      Co.col.value[o].set(n.c.r * n.i, n.c.g * n.i, n.c.b * n.i));
  }
}
const Bt = {};
{
  const e = new r.PMREMGenerator(se),
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
      const d = new r.Mesh(
        new r.BoxGeometry(a, s, 0.4),
        new r.MeshBasicMaterial({ color: new r.Color(...l) }),
      );
      (d.position.set(i, c, f), d.lookAt(0, 0, 0), n.add(d));
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
    Bt.show = e.fromScene(n, 0.03).texture;
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
      (Bt.studio = e.fromScene(n, 0.03).texture));
  }
  {
    const n = new r.Scene();
    (n.add(
      t(
        "varying vec3 d;void main(){vec3 c=mix(vec3(.75,.9,1.1),vec3(1.5,1.75,2.),smoothstep(-.6,-.02,d.y));c=mix(c,vec3(.16,.2,.3),smoothstep(.05,.5,d.y));gl_FragColor=vec4(c,1.);}",
      ),
    ),
      o(n, 14, 4, [6, 6.2, 6.6], -18, 16, 10),
      o(n, 10, 3, [4.2, 4.6, 5.2], 20, 12, -12));
    {
      const a = new r.Mesh(
        new r.BoxGeometry(46, 0.8, 0.8),
        new r.MeshBasicMaterial({ color: new r.Color(1.2, 3.2, 4.4) }),
      );
      (a.position.set(0, 1.5, -26), n.add(a));
    }
    Bt.ice = e.fromScene(n, 0.03).texture;
  }
  {
    const n = new r.Scene();
    (n.add(
      t(`varying vec3 d;void main(){float y=d.y,az=atan(d.z,d.x);
   vec3 gr=mix(vec3(.1,.12,.15),vec3(.66,.74,.84),smoothstep(-.4,-.03,y)),wl=mix(vec3(.03,.035,.045),vec3(.11,.12,.14),smoothstep(.12,.6,y));
   vec3 c=mix(gr,wl,smoothstep(-.03,.03,y));float st=pow(max(cos(az*9.+.4),0.),36.)*(.6+.4*sin(az*2.+1.));
   c+=vec3(1.7,1.7,1.8)*st*smoothstep(-.02,.1,y)*(1.-smoothstep(.45,.7,y));c+=vec3(.95,.92,.9)*smoothstep(.7,.9,y);gl_FragColor=vec4(c,1.);}`),
    ),
      (Bt.steel = e.fromScene(n, 0.02).texture));
  }
  {
    const n = new r.Scene();
    (n.add(
      t(`varying vec3 d;void main(){float y=d.y,az=atan(d.z,d.x);
   vec3 gr=mix(vec3(.07,.06,.055),vec3(.3,.26,.22),smoothstep(-.5,-.03,y)),up=mix(vec3(1.2,1.18,1.14),vec3(.42,.41,.4),smoothstep(.06,.55,y));
   vec3 c=mix(gr,up,smoothstep(-.03,.04,y));c+=vec3(2.2,2.1,1.9)*pow(max(cos(az*5.+.8),0.),30.)*smoothstep(.0,.15,y)*(1.-smoothstep(.5,.8,y));gl_FragColor=vec4(c,1.);}`),
    ),
      (Bt.steelLight = e.fromScene(n, 0.02).texture));
  }
  e.dispose();
}
((Te.environment = Bt.show), (Te.environmentIntensity = 0.7));
const Ar = 0,
  dt = new r.PerspectiveCamera(),
  Sn = new r.Vector3(0, 1, 0);
function Qa(e, t) {
  const o = new r.WebGLRenderTarget(1, 1, {
      type: r.HalfFloatType,
      generateMipmaps: !0,
      minFilter: r.LinearMipmapLinearFilter,
    }),
    n = {
      tReflect: { value: o.texture },
      uReflMatrix: { value: new r.Matrix4() },
      uReflStrength: { value: 0.5 },
    },
    a = Object.assign(
      (s) => {
        (Object.assign(s.uniforms, n),
          (s.vertexShader = s.vertexShader
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
          (s.fragmentShader = s.fragmentShader
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
      { key: t },
    );
  return {
    P: new r.Vector3(0, e, 0),
    target: o,
    U: n,
    extra: a,
    hide: [],
    on: !0,
    scale: 0.5,
  };
}
const zo = Qa(Ar, "reflF"),
  bt = Qa(0, "reflI"),
  Er = zo.U,
  Ja = zo.extra,
  aa = zo.hide,
  sa = new r.Vector3(),
  Tn = new r.Vector3(),
  ra = new r.Matrix4(),
  jo = new r.Plane(),
  qt = new r.Vector4(),
  es = new r.Vector4();
function ts(e) {
  const t = e.P;
  if (
    !R.reflect ||
    !e.on ||
    e.U.uReflStrength.value <= 0 ||
    j.position.y <= t.y + 0.02 ||
    !Re.shadow.map
  )
    return;
  (sa.setFromMatrixPosition(j.matrixWorld),
    ra.extractRotation(j.matrixWorld),
    dt.position.subVectors(t, sa).reflect(Sn).negate().add(t),
    Tn.set(0, 0, -1).applyMatrix4(ra).add(sa),
    Tn.subVectors(t, Tn).reflect(Sn).negate().add(t),
    dt.up.set(0, 1, 0).applyMatrix4(ra).reflect(Sn),
    dt.lookAt(Tn),
    (dt.far = j.far),
    dt.updateMatrixWorld(),
    dt.projectionMatrix.copy(j.projectionMatrix),
    e.U.uReflMatrix.value
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(dt.projectionMatrix)
      .multiply(dt.matrixWorldInverse),
    jo.setFromNormalAndCoplanarPoint(Sn, t).applyMatrix4(dt.matrixWorldInverse),
    qt.set(jo.normal.x, jo.normal.y, jo.normal.z, jo.constant));
  const o = dt.projectionMatrix.elements;
  (es.set(
    (Math.sign(qt.x) + o[8]) / o[0],
    (Math.sign(qt.y) + o[9]) / o[5],
    -1,
    (1 + o[10]) / o[14],
  ),
    qt.multiplyScalar(2 / qt.dot(es)),
    (o[2] = qt.x),
    (o[6] = qt.y),
    (o[10] = qt.z + 1),
    (o[14] = qt.w));
  const n = e.hide,
    a = n.map((l) => l.visible),
    s = se.shadowMap.needsUpdate;
  (n.forEach((l) => (l.visible = !1)),
    (se.shadowMap.needsUpdate = !1),
    Za(dt, Ro),
    se.setRenderTarget(e.target),
    se.clear(),
    se.render(Te, dt),
    se.setRenderTarget(null),
    n.forEach((l, i) => (l.visible = a[i])),
    (se.shadowMap.needsUpdate = s));
}
function Dr() {
  (ts(zo), ts(bt));
}
const Fr =
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
  kn = (e, t) =>
    new r.ShaderMaterial({
      uniforms: t,
      vertexShader: Fr,
      fragmentShader: e,
      depthTest: !1,
      depthWrite: !1,
    });
class Ir extends ea {
  constructor(t) {
    (super(),
      (this.needsSwap = !1),
      (this.rt = new r.WebGLRenderTarget(1, 1, {
        type: r.HalfFloatType,
        samples: t,
        depthTexture: new r.DepthTexture(1, 1),
      })),
      (this.quad = new bn(
        kn(
          "uniform sampler2D t;varying vec2 vUv;void main(){vec4 c=texture2D(t,vUv);bvec4 bad=bvec4(isnan(c.r)||isinf(c.r),isnan(c.g)||isinf(c.g),isnan(c.b)||isinf(c.b),false);gl_FragColor=any(bad)?vec4(0.,0.,0.,1.):vec4(min(c.rgb,vec3(6.)),c.a);}",
          { t: { value: this.rt.texture } },
        ),
      )));
  }
  setSize(t, o) {
    this.rt.setSize(t, o);
  }
  render(t, o, n) {
    (Za(j, Ro),
      t.setRenderTarget(this.rt),
      t.clear(),
      t.render(Te, j),
      t.setRenderTarget(n),
      this.quad.render(t));
  }
}
const os = `uniform sampler2D tDepth;uniform float near;uniform float far;uniform float focus;uniform float range;uniform vec2 cocScale;uniform float maxCoc;
float cocD(float d){float vd=near*far/((far-near)*d-far)*-1.;
 float z=vd-focus;float c=max(abs(z)-range*(z<0.?1.6:1.),0.)*(z<0.?cocScale.x:cocScale.y);return sign(z)*min(c,maxCoc);}
float coc(vec2 uv){return cocD(texture2D(tDepth,uv).x);}`;
class Gr extends ea {
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
        near: { value: j.near },
        far: { value: j.far },
        focus: { value: 14 },
        range: { value: 3 },
        cocScale: { value: new r.Vector2(1, 0.5) },
        maxCoc: { value: 13 },
        texel: { value: new r.Vector2() },
        fullTexel: { value: new r.Vector2() },
      }),
      (this.pre = new bn(
        kn(
          `uniform sampler2D tColor;uniform vec2 fullTexel;varying vec2 vUv;${os}
   void main(){vec2 o=fullTexel*.5;vec3 c=(texture2D(tColor,vUv+vec2(-o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(o.x,-o.y)).rgb+texture2D(tColor,vUv+vec2(-o.x,o.y)).rgb+texture2D(tColor,vUv+o).rgb)*.25;
   // the nearest of the four depths, so a wire one pixel wide still counts as the wire here and is not gathered into the blur behind it
   float d=min(min(texture2D(tDepth,vUv+vec2(-o.x,-o.y)).x,texture2D(tDepth,vUv+vec2(o.x,-o.y)).x),min(texture2D(tDepth,vUv+vec2(-o.x,o.y)).x,texture2D(tDepth,vUv+o).x));
   gl_FragColor=vec4(min(c,vec3(24.)),cocD(d));}`,
          this.u,
        ),
      )),
      (this.blur = new bn(
        kn(
          `uniform sampler2D tHalf;uniform vec2 texel;uniform float maxCoc;varying vec2 vUv;
   void main(){vec4 c0=texture2D(tHalf,vUv);float cc=abs(c0.a);vec3 col=c0.rgb;float tot=1.;float near=0.;
   float rnd=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);float r=1.2+rnd*.8;float ang=rnd*6.2831853;
   for(int i=0;i<72;i++){if(r>=maxCoc)break;vec2 tc=vUv+vec2(cos(ang),sin(ang))*texel*r;vec4 s=texture2D(tHalf,tc);float sc=abs(s.a);if(s.a>c0.a)sc=min(sc,cc*2.);
    float m=smoothstep(r-.8,r+.8,sc);col+=mix(col/tot,s.rgb,m);tot+=1.;if(s.a<0.)near=max(near,m*sc);ang+=2.39996;r+=2.0/r;}
   gl_FragColor=vec4(col/tot,near);}`,
          this.u,
        ),
      )),
      (this.comp = new bn(
        kn(
          `uniform sampler2D tColor;uniform sampler2D tBlur;uniform vec2 fullTexel;varying vec2 vUv;${os}
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
const R = {
    auto: 1,
    pixelRatio: yn,
    msaa: yn >= 1.5 ? 2 : 4,
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
    bloomRadius: 0.3,
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
  ia = { ...R },
  ut = new br(
    se,
    new r.WebGLRenderTarget(1, 1, { type: r.HalfFloatType, depthBuffer: !1 }),
  );
ut.setPixelRatio(yn);
const Yo = new Ir(R.msaa);
ut.addPass(Yo);
const Me = new $a(Te, j, 1, 1);
((Me.output = $a.OUTPUT.Off),
  (Me.needsSwap = !1),
  Me.updateGtaoMaterial({
    radius: 0.9,
    thickness: 1.1,
    distanceExponent: 1.4,
    distanceFallOff: 1,
    scale: 1.2,
    samples: 12,
  }),
  Me.updatePdMaterial({
    radius: 6,
    rings: 2,
    samples: 12,
    lumaPhi: 10,
    depthPhi: 2,
    normalPhi: 3,
  }));
const Br = Me.setSize.bind(Me),
  qr = Me.render.bind(Me);
Me.setSize = (e, t) => Br(Math.ceil(e / 2), Math.ceil(t / 2));
const Jt = [],
  ns = [];
((Me.render = (e, t, o) => {
  (Jt.forEach((n, a) => {
    ((ns[a] = n.visible), (n.visible = !1));
  }),
    qr(e, t, o),
    Jt.forEach((n, a) => (n.visible = ns[a])),
    (Me.blendMaterial.uniforms.intensity.value = R.ao ? R.aoIntensity : 0),
    (Me.blendMaterial.uniforms.tDiffuse.value = Me.pdRenderTarget.texture),
    Me._renderPass(e, Me.blendMaterial, o));
}),
  ut.addPass(Me));
const Vt = new yr(new r.Vector2(256, 256), 0.42, 0.55, 1.05),
  Vr = Vt.setSize.bind(Vt);
((Vt.setSize = (e, t) => Vr(Math.ceil(e / 2), Math.ceil(t / 2))),
  ut.addPass(Vt));
const ht = new Gr();
((ht.u.tDepth.value = Yo.rt.depthTexture), ut.addPass(ht));
const Ko = new r.Scene(),
  as = {
    tSceneDepth: { value: Me.depthTexture },
    uRes: { value: new r.Vector2(1, 1) },
    uNF: { value: new r.Vector2(j.near, j.far) },
  };
class Or extends ea {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t, o, n) {
    const a = t.autoClear;
    ((t.autoClear = !1),
      t.setRenderTarget(n),
      t.render(Ko, j),
      (t.autoClear = a));
  }
}
(ut.addPass(new Or()), ut.addPass(new Mr()));
const ss = new gr();
ut.addPass(ss);
const Ur = `uniform sampler2D tSceneDepth;uniform vec2 uRes;uniform vec2 uNF;
float ovLin(float d){return uNF.x*uNF.y/((uNF.y-uNF.x)*d-uNF.y)*-1.;}
float ovVis(float soft){float sd=ovLin(texture2D(tSceneDepth,gl_FragCoord.xy/uRes).x),md=ovLin(gl_FragCoord.z);return clamp((sd-md)/soft+1.,0.,1.);}`,
  Nr = (e, t, o, n = 0.06, a = 2) =>
    new Sr(e, t, o, a, Math.min(n, Math.min(e, t, o) / 2.02)),
  Ot = new Map();
function le(e, t = {}) {
  const o = "M" + e + JSON.stringify(t);
  return (
    Ot.has(o) ||
      Ot.set(
        o,
        Xe(
          new r.MeshStandardMaterial({
            color: e,
            roughness: 0.85,
            envMapIntensity: 0.5,
            ...t,
          }),
        ),
      ),
    Ot.get(o)
  );
}
function Wr(e, t = {}) {
  const o = "P" + e + JSON.stringify(t);
  return (
    Ot.has(o) ||
      Ot.set(
        o,
        Xe(
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
    Ot.get(o)
  );
}
function ue(e, t = {}) {
  const o = "T" + e + JSON.stringify(t);
  return (
    Ot.has(o) ||
      Ot.set(
        o,
        Xe(
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
    Ot.get(o)
  );
}
const qe = (e, t = 1) =>
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
  vl = ue("#434a55", { roughness: 0.36 }),
  wl = ue("#23272e", { roughness: 0.42, metalness: 0.7 }),
  Hr = ue("#15171b", { roughness: 0.46, metalness: 0.55 }),
  bl = ue("#c08a3e", { roughness: 0.3, metalness: 1, clearcoat: 0.5 }),
  rs = ue("#b9c0cb", { roughness: 0.22, metalness: 1 }),
  yl = le("#121316", { roughness: 0.72, envMapIntensity: 0.35 }),
  Ml = ue("#8e96a3", { roughness: 0.3, metalness: 0.9 }),
  gl = ue("#c46a3a", { roughness: 0.28, metalness: 1, clearcoat: 0.6 }),
  $r = new r.Matrix4(),
  Zo = new r.Quaternion(),
  is = new r.Euler(0, 0, 0, "YXZ"),
  ls = new r.Vector3(1, 1, 1),
  Sl = new r.Color(),
  Tl = new r.Vector3(1, 0, 0),
  cs = new r.Vector3(0, 1, 0),
  kl = new r.Vector3(0, 0, 1),
  Xr = new r.Vector3(),
  jr = new r.Quaternion();
function ve() {
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
          ? (Zo.setFromUnitVectors(
              cs,
              Xr.set(i.dir[0], i.dir[1], i.dir[2]).normalize(),
            ),
            i.roll && Zo.multiply(jr.setFromAxisAngle(cs, i.roll)))
          : (is.set(i.rx || 0, i.ry || 0, i.rz || 0), Zo.setFromEuler(is)),
        n.applyMatrix4(
          $r.compose(
            { x: a, y: s, z: l },
            Zo,
            i.s ? ls.set(i.s[0], i.s[1], i.s[2]) : ls.set(1, 1, 1),
          ),
        ));
      let c = e.get(o);
      (c || e.set(o, (c = { mat: o, list: [] })), c.list.push(n));
    };
  return {
    box(o, n, a, s, l, i, c, f = {}) {
      return (
        t(o, f.r ? Nr(l, i, c, f.r) : new r.BoxGeometry(l, i, c), n, a, s, f),
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
        const i = new r.Mesh(Xa(l), s);
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
const Lo = [];
document.fonts?.ready.then(() => Lo.forEach((e) => e()));
function la(e, t, o, n, a, s = 0.9, l = {}) {
  const i = document.createElement("canvas");
  ((i.width = o), (i.height = n));
  const c = i.getContext("2d"),
    f = new r.CanvasTexture(i);
  ((f.anisotropy = 8), (f.colorSpace = r.SRGBColorSpace));
  const d = new r.Mesh(
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
    (d.userData = {
      c: i,
      g: c,
      t: f,
      redraw(h) {
        (c.clearRect(0, 0, o, n), h(c, o, n), (f.needsUpdate = !0));
      },
    }),
    a && (d.userData.redraw(a), Lo.push(() => d.userData.redraw(a))),
    d
  );
}
const Yr = (e, t, o, n, a, s) => {
    (e.beginPath(), e.roundRect(t, o, n, a, s));
  },
  Po = (e, t, o, n = !0) => {
    const a = document.createElement("canvas");
    ((a.width = e), (a.height = t), o(a.getContext("2d"), e, t));
    const s = new r.CanvasTexture(a);
    return (n && (s.colorSpace = r.SRGBColorSpace), (s.anisotropy = 8), s);
  },
  Kr = Po(
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
  Cl = (e, t, o = Kr) =>
    new r.MeshBasicMaterial({
      map: o,
      color: e,
      transparent: !0,
      opacity: t,
      blending: r.AdditiveBlending,
      depthWrite: !1,
      fog: !1,
    });
function fs(e, t = 64, o = [0, Math.PI * 2]) {
  const n = new r.LatheGeometry(
    e.map(([a, s]) => new r.Vector2(s, a)),
    t,
    o[0],
    o[1],
  );
  return (n.rotateZ(-Math.PI / 2), n);
}
function Rl(e, t) {
  return [...e, ...t.slice().reverse(), e[0]];
}
function zl(e) {
  const t = new r.Shape(e.map(([s, l]) => new r.Vector2(s, l))),
    o = new r.ShapeGeometry(t, 1),
    n = o.clone();
  n.scale(1, -1, 1);
  const a = n.index.array;
  for (let s = 0; s < a.length; s += 3) {
    const l = a[s];
    ((a[s] = a[s + 2]), (a[s + 2] = l));
  }
  return (n.computeVertexNormals(), Xa([o.toNonIndexed(), n.toNonIndexed()]));
}
function Zr(e, t, o, n, a = 60, s = 0.07) {
  const l = [],
    i = [],
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
  for (let m = 0; m < d.length; m++)
    for (let v = 0; v <= c; v++) {
      const p = (v / c) * Math.PI * 2,
        x = (v % 6) / 6,
        S = x >= 0.17 && x < 0.67 ? 1 : 0,
        M = m === 2 || m === 3 ? (S ? n : n - s) : d[m][1];
      l.push(d[m][0], -Math.sin(p) * M, Math.cos(p) * M);
    }
  for (let m = 0; m < d.length - 1; m++)
    for (let v = 0; v < c; v++) {
      const p = m * (c + 1) + v,
        x = p + 1,
        S = p + c + 1,
        M = S + 1;
      i.push(p, x, S, x, M, S);
    }
  const h = new r.BufferGeometry();
  (h.setAttribute("position", new r.Float32BufferAttribute(l, 3)),
    h.setIndex(i));
  const w = h.toNonIndexed();
  return (w.computeVertexNormals(), w);
}
function Ll(e, t, o, n, a) {
  const s = new r.Shape(),
    l = n * 4;
  for (let f = 0; f <= l; f++) {
    const d = (f / l) * Math.PI * 2,
      h = f % 4,
      w = h === 1 || h === 2 ? t + o : t,
      m = d + ((h === 1 ? 0.18 : h === 2 ? -0.18 : 0) * Math.PI * 2) / n,
      v = Math.cos(m) * w,
      p = Math.sin(m) * w;
    f ? s.lineTo(v, p) : s.moveTo(v, p);
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
function Cn(e, t = 0.3, o = 1, n = 0) {
  const a = new r.IcosahedronGeometry(e, n),
    s = a.attributes.position,
    l = $e(o),
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
    const d = i.get(f);
    s.setXYZ(c, s.getX(c) * d[0], s.getY(c) * d[1], s.getZ(c) * d[2]);
  }
  return (a.computeVertexNormals(), a);
}
const pt = (() => {
  const e = (m, v, p) => {
    const x = Math.max(p - Math.abs(m - v), 0) / p;
    return Math.min(m, v) - x * x * p * 0.25;
  };
  function t(m, v, p) {
    const x = Math.cos(m),
      S = Math.sin(m),
      M = Math.cos(v),
      T = Math.sin(v),
      y = Math.cos(p),
      g = Math.sin(p),
      k = [
        [M, T * S, T * x],
        [0, x, -S],
        [-T, M * S, M * x],
      ],
      L = k.map((_) => [_[0] * y + _[1] * g, -_[0] * g + _[1] * y, _[2]]);
    return [
      L[0][0],
      L[1][0],
      L[2][0],
      L[0][1],
      L[1][1],
      L[2][1],
      L[0][2],
      L[1][2],
      L[2][2],
    ];
  }
  function o(m, v) {
    const p = {
      t: m,
      col: v.col ?? 0,
      m: !!v.m,
      paint: !!v.paint,
      sub: !!v.sub,
      k: v.k,
      R: v.rot ? t(v.rot[0], v.rot[1], v.rot[2]) : null,
    };
    if (m === 0)
      ((p.c = v.c),
        (p.r = v.r),
        (p.ir = v.r.map((x) => 1 / x)),
        (p.rmin = Math.min(...v.r)),
        (p.bs = [...v.c, Math.max(...v.r)]));
    else if (m === 1) {
      const x = v.a,
        S = v.b;
      ((p.a = x),
        (p.r1 = v.r1),
        (p.r2 = v.r2),
        (p.ba = [S[0] - x[0], S[1] - x[1], S[2] - x[2]]),
        (p.l2 = p.ba[0] ** 2 + p.ba[1] ** 2 + p.ba[2] ** 2),
        (p.rr = v.r1 - v.r2),
        (p.a2 = p.l2 - p.rr * p.rr),
        (p.il2 = 1 / p.l2),
        (p.bs = [
          (x[0] + S[0]) / 2,
          (x[1] + S[1]) / 2,
          (x[2] + S[2]) / 2,
          Math.sqrt(p.l2) / 2 + Math.max(v.r1, v.r2),
        ]));
    } else
      ((p.c = v.c),
        (p.h = v.h),
        (p.rad = v.rad || 0),
        (p.bs = [...v.c, Math.hypot(...v.h)]));
    return p;
  }
  function n(m, v, p, x) {
    if (m.t === 1) {
      const y = v - m.a[0],
        g = p - m.a[1],
        k = x - m.a[2],
        L = m.ba[0],
        _ = m.ba[1],
        O = m.ba[2],
        H = m.l2,
        G = y * L + g * _ + k * O,
        b = G - H,
        q = y * H - L * G,
        ee = g * H - _ * G,
        Z = k * H - O * G,
        ie = q * q + ee * ee + Z * Z,
        E = G * G * H,
        C = b * b * H,
        P = Math.sign(m.rr) * m.rr * m.rr * ie;
      return Math.sign(b) * m.a2 * C > P
        ? Math.sqrt(ie + C) * m.il2 - m.r2
        : Math.sign(G) * m.a2 * E < P
          ? Math.sqrt(ie + E) * m.il2 - m.r1
          : (Math.sqrt(ie * m.a2 * m.il2) + G * m.rr) * m.il2 - m.r1;
    }
    if (((v -= m.c[0]), (p -= m.c[1]), (x -= m.c[2]), m.R)) {
      const y = m.R,
        g = y[0] * v + y[1] * p + y[2] * x,
        k = y[3] * v + y[4] * p + y[5] * x,
        L = y[6] * v + y[7] * p + y[8] * x;
      ((v = g), (p = k), (x = L));
    }
    if (m.t === 0) {
      const y = v * m.ir[0],
        g = p * m.ir[1],
        k = x * m.ir[2],
        L = Math.sqrt(y * y + g * g + k * k),
        _ = y * m.ir[0],
        O = g * m.ir[1],
        H = k * m.ir[2],
        G = Math.sqrt(_ * _ + O * O + H * H);
      return G < 1e-9 ? -m.rmin : (L * (L - 1)) / G;
    }
    const S = Math.abs(v) - m.h[0] + m.rad,
      M = Math.abs(p) - m.h[1] + m.rad,
      T = Math.abs(x) - m.h[2] + m.rad;
    return (
      Math.hypot(Math.max(S, 0), Math.max(M, 0), Math.max(T, 0)) +
      Math.min(Math.max(S, M, T), 0) -
      m.rad
    );
  }
  function a(m, v) {
    const p = m.filter((S) => !S.paint),
      x = p.length;
    return (S, M, T) => {
      let y = 1e9;
      for (let g = 0; g < x; g++) {
        const k = p[g],
          L = k.m ? Math.abs(S) : S;
        if (k.sub) {
          const H = k.k || 0;
          if (y < 1e8) {
            const b = L - k.bs[0],
              q = M - k.bs[1],
              ee = T - k.bs[2];
            if (Math.sqrt(b * b + q * q + ee * ee) - k.bs[3] >= Math.abs(y) + H)
              continue;
          }
          const G = n(k, L, M, T);
          y = H > 0 ? -e(-y, G, H) : Math.max(y, -G);
          continue;
        }
        const _ = k.k ?? v;
        if (y < 1e8) {
          const H = L - k.bs[0],
            G = M - k.bs[1],
            b = T - k.bs[2];
          if (Math.sqrt(H * H + G * G + b * b) - k.bs[3] >= y + _) continue;
        }
        const O = n(k, L, M, T);
        y = y >= 1e8 ? O : _ > 0 ? e(y, O, _) : Math.min(y, O);
      }
      return y;
    };
  }
  function s(m) {
    const v = [1e9, 1e9, 1e9],
      p = [-1e9, -1e9, -1e9];
    for (const x of m) {
      if (x.paint || x.sub) continue;
      const [S, M, T, y] = x.bs,
        g = x.m ? [Math.abs(S), -Math.abs(S)] : [S];
      for (const k of g)
        ((v[0] = Math.min(v[0], k - y)), (p[0] = Math.max(p[0], k + y)));
      ((v[1] = Math.min(v[1], M - y)),
        (p[1] = Math.max(p[1], M + y)),
        (v[2] = Math.min(v[2], T - y)),
        (p[2] = Math.max(p[2], T + y)));
    }
    return [v, p];
  }
  const l = [0, 2, 4, 6, 0, 1, 4, 5, 0, 1, 2, 3],
    i = [1, 3, 5, 7, 2, 3, 6, 7, 4, 5, 6, 7];
  function c(m, v, p, x) {
    const S = v[0] - x * 1.5,
      M = v[1] - x * 1.5,
      T = v[2] - x * 1.5,
      y = Math.ceil((p[0] - v[0]) / x) + 4,
      g = Math.ceil((p[1] - v[1]) / x) + 4,
      k = Math.ceil((p[2] - v[2]) / x) + 4,
      L = new Float32Array(y * g * k);
    for (let E = 0, C = 0; E < k; E++)
      for (let P = 0; P < g; P++)
        for (let N = 0; N < y; N++, C++)
          L[C] = m(S + N * x, M + P * x, T + E * x);
    const _ = y - 1,
      O = g - 1,
      H = k - 1,
      G = new Int32Array(_ * O * H).fill(-1),
      b = [],
      q = new Float32Array(8);
    for (let E = 0; E < H; E++)
      for (let C = 0; C < O; C++)
        for (let P = 0; P < _; P++) {
          let N = 0;
          for (let W = 0; W < 8; W++) {
            const I =
              L[
                P +
                  (W & 1) +
                  y * (C + ((W >> 1) & 1) + g * (E + ((W >> 2) & 1)))
              ];
            ((q[W] = I), I < 0 && (N |= 1 << W));
          }
          if (N === 0 || N === 255) continue;
          let de = 0,
            D = 0,
            A = 0,
            F = 0;
          for (let W = 0; W < 12; W++) {
            const I = l[W],
              $ = i[W],
              U = q[I],
              ae = q[$];
            if (U < 0 == ae < 0) continue;
            const te = U / (U - ae);
            ((de += (I & 1) + (($ & 1) - (I & 1)) * te),
              (D += ((I >> 1) & 1) + ((($ >> 1) & 1) - ((I >> 1) & 1)) * te),
              (A += ((I >> 2) & 1) + ((($ >> 2) & 1) - ((I >> 2) & 1)) * te),
              F++);
          }
          ((G[P + _ * (C + O * E)] = b.length / 3),
            b.push(
              S + (P + de / F) * x,
              M + (C + D / F) * x,
              T + (E + A / F) * x,
            ));
        }
    const ee = [],
      Z = (E, C, P) =>
        E < 0 || C < 0 || P < 0 || E >= _ || C >= O || P >= H
          ? -1
          : G[E + _ * (C + O * P)],
      ie = (E, C, P, N, de, D) => {
        if (E < 0 || C < 0 || P < 0 || N < 0) return;
        const A = b[3 * P] - b[3 * E],
          F = b[3 * P + 1] - b[3 * E + 1],
          W = b[3 * P + 2] - b[3 * E + 2],
          I = b[3 * N] - b[3 * C],
          $ = b[3 * N + 1] - b[3 * C + 1],
          U = b[3 * N + 2] - b[3 * C + 2];
        if (
          (de === 0
            ? F * U - W * $
            : de === 1
              ? W * I - A * U
              : A * $ - F * I) >
            0 !=
          D > 0
        ) {
          const De = C;
          ((C = N), (N = De));
        }
        const te =
            (b[3 * E] - b[3 * P]) ** 2 +
            (b[3 * E + 1] - b[3 * P + 1]) ** 2 +
            (b[3 * E + 2] - b[3 * P + 2]) ** 2,
          oe =
            (b[3 * C] - b[3 * N]) ** 2 +
            (b[3 * C + 1] - b[3 * N + 1]) ** 2 +
            (b[3 * C + 2] - b[3 * N + 2]) ** 2;
        te < oe ? ee.push(E, C, P, E, P, N) : ee.push(E, C, N, C, P, N);
      };
    for (let E = 0; E < k; E++)
      for (let C = 0; C < g; C++)
        for (let P = 0; P < y; P++) {
          const N = L[P + y * (C + g * E)] < 0;
          (P + 1 < y &&
            N !== L[P + 1 + y * (C + g * E)] < 0 &&
            ie(
              Z(P, C - 1, E - 1),
              Z(P, C, E - 1),
              Z(P, C, E),
              Z(P, C - 1, E),
              0,
              N ? 1 : -1,
            ),
            C + 1 < g &&
              N !== L[P + y * (C + 1 + g * E)] < 0 &&
              ie(
                Z(P - 1, C, E - 1),
                Z(P, C, E - 1),
                Z(P, C, E),
                Z(P - 1, C, E),
                1,
                N ? 1 : -1,
              ),
            E + 1 < k &&
              N !== L[P + y * (C + g * (E + 1))] < 0 &&
              ie(
                Z(P - 1, C - 1, E),
                Z(P, C - 1, E),
                Z(P, C, E),
                Z(P - 1, C, E),
                2,
                N ? 1 : -1,
              ));
        }
    return { pos: b, idx: ee };
  }
  function f(m, v, p) {
    const x = p * 0.1,
      S = p * 0.8;
    for (let M = 0; M < v.length; M += 3) {
      let T = v[M],
        y = v[M + 1],
        g = v[M + 2];
      const k = T,
        L = y,
        _ = g;
      for (let q = 0; q < 3; q++) {
        const ee = m(T, y, g);
        if (Math.abs(ee) < p * 0.002) break;
        const Z = (m(T + x, y, g) - m(T - x, y, g)) / (2 * x),
          ie = (m(T, y + x, g) - m(T, y - x, g)) / (2 * x),
          E = (m(T, y, g + x) - m(T, y, g - x)) / (2 * x),
          C = Z * Z + ie * ie + E * E;
        if (C < 1e-12) break;
        ((T -= (Z * ee) / C), (y -= (ie * ee) / C), (g -= (E * ee) / C));
      }
      const O = T - k,
        H = y - L,
        G = g - _,
        b = Math.sqrt(O * O + H * H + G * G);
      if (b > S) {
        const q = S / b;
        ((T = k + O * q), (y = L + H * q), (g = _ + G * q));
      }
      ((v[M] = T), (v[M + 1] = y), (v[M + 2] = g));
    }
  }
  function d(m, v, p) {
    const x = m.length / 3,
      S = v.length / 3;
    if (S <= p) return { pos: m.slice(), idx: v.slice() };
    const M = Float64Array.from(m),
      T = Int32Array.from(v),
      y = new Uint8Array(S).fill(1),
      g = new Float64Array(x * 10),
      k = new Int32Array(x),
      L = new Uint8Array(x),
      _ = new Int32Array(x),
      O = Array.from({ length: x }, () => []);
    let H = 1;
    for (let D = 0; D < S; D++) {
      const A = T[3 * D],
        F = T[3 * D + 1],
        W = T[3 * D + 2];
      (O[A].push(D), O[F].push(D), O[W].push(D));
      const I = M[3 * A],
        $ = M[3 * A + 1],
        U = M[3 * A + 2],
        ae = M[3 * F] - I,
        te = M[3 * F + 1] - $,
        oe = M[3 * F + 2] - U,
        De = M[3 * W] - I,
        Ue = M[3 * W + 1] - $,
        Dt = M[3 * W + 2] - U;
      let Ge = te * Dt - oe * Ue,
        Le = oe * De - ae * Dt,
        Pe = ae * Ue - te * De;
      const Qe = Math.sqrt(Ge * Ge + Le * Le + Pe * Pe);
      if (Qe < 1e-14) continue;
      ((Ge /= Qe), (Le /= Qe), (Pe /= Qe));
      const Je = -(Ge * I + Le * $ + Pe * U),
        ke = Qe * 0.5,
        Ft = Ge * Ge * ke,
        Ne = Ge * Le * ke,
        et = Ge * Pe * ke,
        tt = Ge * Je * ke,
        ot = Le * Le * ke,
        Ce = Le * Pe * ke,
        We = Le * Je * ke,
        Rt = Pe * Pe * ke,
        zt = Pe * Je * ke,
        ct = Je * Je * ke;
      for (const co of [A, F, W]) {
        const xe = 10 * co;
        ((g[xe] += Ft),
          (g[xe + 1] += Ne),
          (g[xe + 2] += et),
          (g[xe + 3] += tt),
          (g[xe + 4] += ot),
          (g[xe + 5] += Ce),
          (g[xe + 6] += We),
          (g[xe + 7] += Rt),
          (g[xe + 8] += zt),
          (g[xe + 9] += ct));
      }
    }
    const G = [],
      b = [],
      q = (D) => {
        let A = G.length;
        for (G.push(D.c), b.push(D); A > 0;) {
          const F = (A - 1) >> 1;
          if (G[F] <= D.c) break;
          ((G[A] = G[F]), (b[A] = b[F]), (A = F));
        }
        ((G[A] = D.c), (b[A] = D));
      },
      ee = () => {
        const D = b[0],
          A = G.pop(),
          F = b.pop(),
          W = G.length;
        if (W) {
          let I = 0;
          for (;;) {
            const $ = 2 * I + 1,
              U = $ + 1;
            let ae = I,
              te = A;
            if (
              ($ < W && G[$] < te && ((ae = $), (te = G[$])),
              U < W && G[U] < te && (ae = U),
              ae === I)
            )
              break;
            ((G[I] = G[ae]), (b[I] = b[ae]), (I = ae));
          }
          ((G[I] = A), (b[I] = F));
        }
        return D;
      };
    function Z(D, A) {
      const F = 10 * D,
        W = 10 * A,
        I = g[F] + g[W],
        $ = g[F + 1] + g[W + 1],
        U = g[F + 2] + g[W + 2],
        ae = g[F + 3] + g[W + 3],
        te = g[F + 4] + g[W + 4],
        oe = g[F + 5] + g[W + 5],
        De = g[F + 6] + g[W + 6],
        Ue = g[F + 7] + g[W + 7],
        Dt = g[F + 8] + g[W + 8],
        Ge = g[F + 9] + g[W + 9],
        Le = (xe, ft, Be) =>
          I * xe * xe +
          2 * $ * xe * ft +
          2 * U * xe * Be +
          2 * ae * xe +
          te * ft * ft +
          2 * oe * ft * Be +
          2 * De * ft +
          Ue * Be * Be +
          2 * Dt * Be +
          Ge,
        Pe = M[3 * D],
        Qe = M[3 * D + 1],
        Je = M[3 * D + 2],
        ke = M[3 * A],
        Ft = M[3 * A + 1],
        Ne = M[3 * A + 2],
        et = (Pe + ke) / 2,
        tt = (Qe + Ft) / 2,
        ot = (Je + Ne) / 2;
      let Ce = Le(et, tt, ot),
        We = et,
        Rt = tt,
        zt = ot,
        ct;
      ((ct = Le(Pe, Qe, Je)) < Ce &&
        ((Ce = ct), (We = Pe), (Rt = Qe), (zt = Je)),
        (ct = Le(ke, Ft, Ne)) < Ce &&
          ((Ce = ct), (We = ke), (Rt = Ft), (zt = Ne)));
      const co =
        I * (te * Ue - oe * oe) - $ * ($ * Ue - oe * U) + U * ($ * oe - te * U);
      if (Math.abs(co) > 1e-12) {
        const xe = 1 / co,
          ft = -ae,
          Be = -De,
          It = -Dt,
          So =
            (ft * (te * Ue - oe * oe) -
              $ * (Be * Ue - oe * It) +
              U * (Be * oe - te * It)) *
            xe,
          To =
            (I * (Be * Ue - oe * It) -
              ft * ($ * Ue - oe * U) +
              U * ($ * It - Be * U)) *
            xe,
          ko =
            (I * (te * It - Be * oe) -
              $ * ($ * It - Be * U) +
              ft * ($ * oe - te * U)) *
            xe;
        (So - et) ** 2 + (To - tt) ** 2 + (ko - ot) ** 2 <
          (Pe - ke) ** 2 + (Qe - Ft) ** 2 + (Je - Ne) ** 2 &&
          (ct = Le(So, To, ko)) < Ce &&
          ((Ce = ct), (We = So), (Rt = To), (zt = ko));
      }
      return {
        c: Ce > 0 ? Ce : 0,
        a: D,
        b: A,
        sa: k[D],
        sb: k[A],
        x: We,
        y: Rt,
        z: zt,
      };
    }
    function ie(D) {
      const A = D.a,
        F = D.b;
      H++;
      for (const U of O[A])
        if (y[U]) for (let ae = 0; ae < 3; ae++) _[T[3 * U + ae]] = H;
      let W = 0,
        I = 0;
      const $ = ++H;
      for (const U of O[F])
        if (y[U]) {
          let ae = !1;
          for (let te = 0; te < 3; te++) {
            const oe = T[3 * U + te];
            (oe === A && (ae = !0),
              oe !== A && oe !== F && _[oe] === $ - 1 && (W++, (_[oe] = $)));
          }
          ae && I++;
        }
      if (I !== 2 || W !== 2) return !1;
      for (const U of [A, F])
        for (const ae of O[U]) {
          if (!y[ae]) continue;
          const te = T[3 * ae],
            oe = T[3 * ae + 1],
            De = T[3 * ae + 2];
          if (
            (te === A || oe === A || De === A) &&
            (te === F || oe === F || De === F)
          )
            continue;
          const Ue = M[3 * te],
            Dt = M[3 * te + 1],
            Ge = M[3 * te + 2],
            Le = M[3 * oe],
            Pe = M[3 * oe + 1],
            Qe = M[3 * oe + 2],
            Je = M[3 * De],
            ke = M[3 * De + 1],
            Ft = M[3 * De + 2];
          let Ne = Le - Ue,
            et = Pe - Dt,
            tt = Qe - Ge,
            ot = Je - Ue,
            Ce = ke - Dt,
            We = Ft - Ge;
          const Rt = et * We - tt * Ce,
            zt = tt * ot - Ne * We,
            ct = Ne * Ce - et * ot,
            co = te === U ? D.x : Ue,
            xe = te === U ? D.y : Dt,
            ft = te === U ? D.z : Ge,
            Be = oe === U ? D.x : Le,
            It = oe === U ? D.y : Pe,
            So = oe === U ? D.z : Qe,
            To = De === U ? D.x : Je,
            ko = De === U ? D.y : ke,
            Wa = De === U ? D.z : Ft;
          ((Ne = Be - co),
            (et = It - xe),
            (tt = So - ft),
            (ot = To - co),
            (Ce = ko - xe),
            (We = Wa - ft));
          const Kn = et * We - tt * Ce,
            Zn = tt * ot - Ne * We,
            Qn = Ne * Ce - et * ot,
            Ha = Math.sqrt(Rt * Rt + zt * zt + ct * ct),
            Jn = Math.sqrt(Kn * Kn + Zn * Zn + Qn * Qn);
          if (Jn < 1e-14) return !1;
          if (Ha < 1e-14) continue;
          if ((Rt * Kn + zt * Zn + ct * Qn) / (Ha * Jn) < 0.3) return !1;
          const wr =
            Ne * Ne +
            et * et +
            tt * tt +
            ot * ot +
            Ce * Ce +
            We * We +
            (To - Be) ** 2 +
            (ko - It) ** 2 +
            (Wa - So) ** 2;
          if ((3.4641 * Jn) / wr < 0.12) return !1;
        }
      return !0;
    }
    let E = S;
    {
      const D = new Set();
      for (let A = 0; A < S; A++)
        for (let F = 0; F < 3; F++) {
          const W = T[3 * A + F],
            I = T[3 * A + ((F + 1) % 3)],
            $ = W < I ? W * x + I : I * x + W;
          D.has($) || (D.add($), q(Z(W, I)));
        }
    }
    const C = [];
    for (; E > p && G.length;) {
      const D = ee(),
        A = D.a,
        F = D.b;
      if (L[A] || L[F] || k[A] !== D.sa || k[F] !== D.sb || !ie(D)) continue;
      ((M[3 * A] = D.x), (M[3 * A + 1] = D.y), (M[3 * A + 2] = D.z));
      for (let I = 0; I < 10; I++) g[10 * A + I] += g[10 * F + I];
      for (const I of O[F])
        if (y[I]) {
          if (T[3 * I] === A || T[3 * I + 1] === A || T[3 * I + 2] === A) {
            ((y[I] = 0), E--);
            continue;
          }
          for (let $ = 0; $ < 3; $++) T[3 * I + $] === F && (T[3 * I + $] = A);
          O[A].push(I);
        }
      ((O[F] = []), (L[F] = 1), k[A]++, k[F]++);
      const W = O[A].filter((I) => y[I]);
      ((O[A] = W), (C.length = 0), H++);
      for (const I of W)
        for (let $ = 0; $ < 3; $++) {
          const U = T[3 * I + $];
          U !== A && _[U] !== H && ((_[U] = H), C.push(U));
        }
      for (const I of C) q(Z(A, I));
    }
    const P = new Int32Array(x).fill(-1),
      N = [],
      de = [];
    for (let D = 0; D < S; D++)
      if (y[D])
        for (let A = 0; A < 3; A++) {
          const F = T[3 * D + A];
          (P[F] < 0 &&
            ((P[F] = N.length / 3),
            N.push(M[3 * F], M[3 * F + 1], M[3 * F + 2])),
            de.push(P[F]));
        }
    return { pos: N, idx: de };
  }
  function h(m, v, p, x) {
    let S = null,
      M = 1e9;
    for (const y of m) {
      if (y.paint || y.sub) continue;
      const g = n(y, y.m ? Math.abs(v) : v, p, x);
      g < M && ((M = g), (S = y));
    }
    let T = S ? S.col : 0;
    for (const y of m)
      y.paint && n(y, y.m ? Math.abs(v) : v, p, x) < 0 && (T = y.col);
    return T;
  }
  function w(m, v, p, x) {
    if (!m.filter((_) => !_.paint && !_.sub).length) return null;
    const M = a(m, v),
      [T, y] = s(m),
      { pos: g, idx: k } = c(M, T, y, p);
    f(M, g, p);
    const L = d(g, k, x);
    return { f: M, pos: L.pos, idx: L.idx, raw: k.length / 3 };
  }
  return {
    prim: o,
    dist: n,
    field: a,
    nets: c,
    project: f,
    decimate: d,
    colorIndex: h,
    mesh: w,
    rot: t,
  };
})();
function ds(e, t, o, n, a, s = 0, l = {}) {
  const i = new r.Group(),
    c = ve(),
    f = $e(Math.floor(t * 31 + n * 17 + 99));
  c.cyl(le("#5a3f2c"), 0, 0.5 * a, 0, 0.07 * a, 0.1 * a, 1 * a, { seg: 6 });
  const d = ["#4f7a3c", "#5f8c45", "#6f9a4c", "#3f6834"].map((h) =>
    new r.Color(h).offsetHSL(s, 0, 0).getStyle(),
  );
  for (let h = 0; h < (l.n || 5); h++)
    c.geo(
      le(d[h % 4], { flatShading: !0, roughness: 0.8 }),
      Cn(0.42 * a * (0.75 + f() * 0.5), 0.3, h + t * 7 + n * 3),
      (f() - 0.5) * 0.6 * a,
      (1.15 + f() * 0.7) * a,
      (f() - 0.5) * 0.6 * a,
    );
  return (c.flush(i), i.position.set(t, o, n), e.add(i), i);
}
const us = ["#2f5a3a", "#3a6b43", "#44784a"].map((e) =>
    le(e, { flatShading: !0, roughness: 0.85 }),
  ),
  hs = le("#4a3527", { roughness: 0.9 });
function Qr(e, t, o, n, a, s = 1) {
  const l = $e(s * 97 + 13);
  e.cyl(hs, t, o + 0.15 * a, n, 0.05 * a, 0.07 * a, 0.3 * a, { seg: 5 });
  for (let i = 0; i < 3; i++) {
    const c = (0.42 - i * 0.1) * a * (0.9 + l() * 0.2);
    e.cone(us[(i + s) % 3], t, o + (0.22 + i * 0.3) * a, n, c, 0.55 * a, {
      seg: 6 + (s % 2),
      ry: l() * 3,
    });
  }
}
const Jr = le("#8d8aa0", { flatShading: !0, roughness: 0.75 }),
  ei = le("#eef1f8", { flatShading: !0, roughness: 0.6 });
function ps(e, t, o, n, a, s, l = 1) {
  const i = new r.ConeGeometry(a, s, 7, 3).translate(0, s / 2, 0),
    c = i.attributes.position,
    f = $e(l);
  for (let h = 0; h < c.count; h++) {
    const w = c.getY(h);
    w > 0.01 &&
      w < s - 0.01 &&
      (c.setX(h, c.getX(h) * (1 + (f() - 0.5) * 0.35)),
      c.setZ(h, c.getZ(h) * (1 + (f() - 0.5) * 0.35)),
      c.setY(h, w + (f() - 0.5) * s * 0.08));
  }
  (i.computeVertexNormals(), e.geo(Jr, i, t, o, n));
  const d = new r.ConeGeometry(a * 0.36, s * 0.34, 7, 1).translate(
    0,
    s * 0.83 + 0.005,
    0,
  );
  e.geo(ei, d, t, o, n, { ry: l });
}
function Pl(e, t, o, n, a = 1, s = 1) {
  const l = ve(),
    i = $e(s * 31);
  (l
    .box(
      le("#5b4636", { roughness: 0.9 }),
      t,
      o + 0.09 * a,
      n,
      1.5 * a,
      0.18 * a,
      1 * a,
      { r: 0.02 * a },
    )
    .box(
      le("#5f8a4a", { flatShading: !0 }),
      t,
      o + 0.19 * a,
      n,
      1.46 * a,
      0.04 * a,
      0.96 * a,
    ),
    ps(l, t - 0.25 * a, o + 0.2 * a, n - 0.15 * a, 0.42 * a, 0.9 * a, s),
    ps(l, t + 0.3 * a, o + 0.2 * a, n - 0.2 * a, 0.34 * a, 0.66 * a, s + 3));
  for (let c = 0; c < 5; c++)
    Qr(
      l,
      t + (i() - 0.5) * 1.2 * a,
      o + 0.2 * a,
      n + 0.1 * a + i() * 0.3 * a,
      0.5 * a * (0.8 + i() * 0.4),
      s + c,
    );
  l.flush(e);
}
const ti = Po(
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
function oi(e, t, o, n, a, s, l = 0.5) {
  const i = new r.Mesh(
    new r.PlaneGeometry(a, s),
    new r.MeshBasicMaterial({
      map: ti,
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
    Jt.push(i),
    i
  );
}
const ni = Po(1024, 512, (e, t, o) => {
    const n = e.createLinearGradient(0, 0, 0, o);
    (n.addColorStop(0, "#6f8fc4"),
      n.addColorStop(0.52, "#d9b9b4"),
      n.addColorStop(0.72, "#f3c49a"),
      n.addColorStop(1, "#8a7a78"),
      (e.fillStyle = n),
      e.fillRect(0, 0, t, o));
    const a = $e(9),
      s = (l, i, c, f) => {
        ((e.fillStyle = c), e.beginPath(), e.moveTo(0, o));
        for (let d = 0; d <= t; d += 16) {
          const h = d / t;
          e.lineTo(
            d,
            l -
              i *
                (Math.abs(Math.sin(h * 5.1 + f)) * 0.7 +
                  Math.abs(Math.sin(h * 13.3 + f * 2)) * 0.3),
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
  _e = new r.Group();
Zt.add(_e);
const Qo = -7.6,
  _l = 11.2,
  nt = 12,
  Al = (() => {
    const e = Po(1024, 1024, (n, a, s) => {
      const i = a / 4,
        c = $e(3);
      for (let f = 0; f < 4; f++)
        for (let d = 0; d < 4; d++) {
          const h = c();
          ((n.fillStyle = `hsl(${212 + h * 8},${7 + h * 4}%,${50 + h * 6}%)`),
            n.fillRect(f * i, d * i, i, i));
          for (let w = 0; w < 70; w++)
            ((n.fillStyle = `rgba(${c() > 0.5 ? 255 : 70},${c() > 0.5 ? 250 : 60},240,${0.025 + c() * 0.03})`),
              n.beginPath(),
              n.ellipse(
                f * i + c() * i,
                d * i + c() * i,
                4 + c() * 40,
                2 + c() * 12,
                c() * 3,
                0,
                7,
              ),
              n.fill());
        }
      ((n.strokeStyle = "#3e434b"), (n.lineWidth = 3));
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
    const t = Xe(
        new r.MeshStandardMaterial({
          map: e,
          roughness: 0.2,
          metalness: 0.05,
          envMapIntensity: 0.55,
        }),
        Ja,
      ),
      o = new r.Mesh(new r.PlaneGeometry(72, 48), t);
    return (
      (o.rotation.x = -Math.PI / 2),
      o.position.set(0, 0, 4),
      (o.receiveShadow = !0),
      _e.add(o),
      aa.push(o),
      o
    );
  })(),
  ai = {},
  ca = le("#f1f4fa", {
    flatShading: !0,
    roughness: 0.55,
    envMapIntensity: 0.7,
  }),
  ms = le("#d7deea", { flatShading: !0, roughness: 0.6 }),
  El = le("#8a8ea3", { flatShading: !0, roughness: 0.75 });
function eo(e, t, o, n, a, s = 1) {
  const l = $e(s * 53 + 7);
  e.cyl(hs, t, o + 0.12 * a, n, 0.045 * a, 0.065 * a, 0.26 * a, { seg: 5 });
  const i = 4;
  for (let c = 0; c < i; c++) {
    const f = (0.44 - c * 0.085) * a * (0.92 + l() * 0.16),
      d = 0.46 * a,
      h = o + (0.2 + c * 0.27) * a,
      w = l() * 3;
    (e.cone(us[(c + s) % 3], t, h, n, f, d, { seg: 6 + (s % 2), ry: w }),
      e.cone(ca, t, h + d * 0.34, n, f * 0.8, d * 0.66, {
        seg: 6 + (s % 2),
        ry: w + 0.26,
      }));
  }
}
function uo(e, t, o, n, a, s, l = 1) {
  const i = new r.ConeGeometry(a, s, 8, 4).translate(0, s / 2, 0),
    c = i.attributes.position,
    f = $e(l);
  for (let w = 0; w < c.count; w++) {
    const m = c.getY(w);
    m > 0.01 &&
      m < s - 0.01 &&
      (c.setX(w, c.getX(w) * (1 + (f() - 0.5) * 0.4)),
      c.setZ(w, c.getZ(w) * (1 + (f() - 0.5) * 0.4)),
      c.setY(w, m + (f() - 0.5) * s * 0.07));
  }
  (i.computeVertexNormals(), e.geo(ms, i, t, o, n, { ry: l }));
  const d = new r.ConeGeometry(a * 0.72, s * 0.72, 8, 2).translate(
      0,
      s * 0.64 + 0.01,
      0,
    ),
    h = d.attributes.position;
  for (let w = 0; w < h.count; w++)
    h.getY(w) < s * 0.99 &&
      (h.setX(w, h.getX(w) * (1 + (f() - 0.5) * 0.25)),
      h.setZ(w, h.getZ(w) * (1 + (f() - 0.5) * 0.25)));
  (d.computeVertexNormals(), e.geo(ca, d, t, o, n, { ry: l + 0.3 }));
}
const Jo = le("#252e3c", { roughness: 0.62, envMapIntensity: 0.6 }),
  en = le("#1a212b", { roughness: 0.7 }),
  Ye = ue("#3a414c", { roughness: 0.4 }),
  fa = ue("#2c333d", { roughness: 0.45 });
{
  const e = ve(),
    t = Qo;
  e.box(Jo, 0, nt / 2, t - 0.2, 32, nt, 0.4);
  for (let f = -14.4; f <= 14.4; f += 2.4)
    (f < -10.6 || f > -7) && e.box(en, f, nt / 2, t + 0.01, 0.05, nt, 0.04);
  (e
    .box(Ye, 0, 0.12, t + 0.08, 32, 0.24, 0.14)
    .box(en, 0, nt + 0.2, -2, 32, 0.4, 20),
    e
      .box(en, -8.8, 3.4, t + 0.02, 2.9, 4.6, 0.05)
      .box(Ye, -8.8, 1.1, t + 0.45, 3.1, 0.14, 0.9)
      .box(Ye, -8.8, 5.72, t + 0.45, 3.1, 0.14, 0.9)
      .box(Ye, -10.3, 3.4, t + 0.45, 0.14, 4.76, 0.9)
      .box(Ye, -7.3, 3.4, t + 0.45, 0.14, 4.76, 0.9),
    e.box(fa, -8.8, 1.35, t + 0.35, 2.6, 0.36, 0.6, { r: 0.03 }));
  const o = 2,
    n = 3.7;
  (e
    .box(en, o + 1.6, 1.2, t + 0.5, 6.4, 2.4, 1, { r: 0.04 })
    .box(Ye, o + 1.6, 2.44, t + 0.5, 6.5, 0.08, 1.05),
    e
      .box(en, o, n, t + 0.03, 1.9, 2.4, 0.05)
      .box(Ye, o, n - 1.24, t + 0.4, 2.1, 0.12, 0.8)
      .box(Ye, o, n + 1.24, t + 0.4, 2.1, 0.12, 0.8)
      .box(Ye, o - 1.05, n, t + 0.4, 0.12, 2.6, 0.8)
      .box(Ye, o + 1.05, n, t + 0.4, 0.12, 2.6, 0.8),
    e
      .box(fa, o + 3.1, n - 0.5, t + 0.4, 2.9, 0.1, 0.8)
      .box(fa, o + 3.1, n + 1.2, t + 0.4, 2.9, 0.1, 0.8)
      .box(Ye, o + 4.62, n, t + 0.4, 0.12, 3.4, 0.8),
    e.flush(_e, !1));
  const a = (f, d, h, w, m, v, p, x) => {
    const S = new r.Mesh(new r.BoxGeometry(w, m, v), qe(p, x));
    return (S.position.set(f, d, h), _e.add(S), S);
  };
  (a(-8.8, 5.6, t + 0.85, 2.8, 0.04, 0.04, "#ffb86b", 3.2),
    a(-7.4, 3.4, t + 0.88, 0.04, 4.4, 0.04, "#ffb468", 2.2),
    Qt(-8.8, 4.6, t + 1.4, "#ffb86b", 3.2, 1),
    a(o, n + 1.13, t + 0.78, 1.8, 0.04, 0.04, "#ffc07a", 3.2),
    Qt(o, n + 0.3, t + 1.2, "#ffc07a", 2.6, 1.1),
    a(o + 1.3, n - 0.3, t + 0.85, 0.05, 4.6, 0.05, "#ffb468", 3),
    a(o + 4.72, n - 0.3, t + 0.85, 0.05, 4.6, 0.05, "#ffb468", 3),
    Qt(o + 3, n - 0.1, t + 1.4, "#ffb468", 3.5, 0.9),
    a(0, nt - 0.35, t + 0.3, 30, 0.06, 0.06, "#ffb86b", 3.2),
    a(0, 0.27, t + 0.16, 32, 0.04, 0.04, "#ffae5c", 1.6));
  const s = ve();
  (eo(s, -8.8, 1.53, t + 0.35, 3.6, 3),
    eo(s, -9.6, 1.53, t + 0.45, 1.4, 8),
    s
      .box(
        le("#0d0f13", { roughness: 0.35 }),
        o,
        n - 0.98,
        t + 0.45,
        0.9,
        0.42,
        0.6,
        { r: 0.03 },
      )
      .box(
        ue("#b69256", { roughness: 0.3 }),
        o,
        n - 0.75,
        t + 0.45,
        0.5,
        0.05,
        0.4,
      ),
    uo(s, o + 2.6, n + 1.25, t + 0.45, 0.75, 1.25, 4),
    uo(s, o + 3.5, n + 1.25, t + 0.4, 0.55, 0.85, 9),
    uo(s, o + 3.1, n - 0.45, t + 0.45, 0.5, 0.7, 12),
    s.flush(_e));
  const l = new r.Group(),
    i = ve(),
    c = qe("#dff4ff", 1.9);
  for (let f = 0; f < 6; f++) {
    const d = (f * Math.PI) / 3,
      h = Math.cos(d),
      w = Math.sin(d);
    i.box(c, h * 0.3, w * 0.3, 0, 0.6, 0.045, 0.03, { rz: d });
    for (const m of [0.3, 0.46])
      for (const v of [1, -1])
        i.box(
          c,
          h * m * 1 + Math.cos(d + v * 0.9) * 0.08,
          w * m + Math.sin(d + v * 0.9) * 0.08,
          0,
          0.18,
          0.03,
          0.03,
          { rz: d + v * 0.9 },
        );
  }
  (i.flush(l, !1),
    l.position.set(o, n + 0.1, t + 0.45),
    l.scale.setScalar(0.85),
    _e.add(l),
    (ai.fl = l),
    Qt(o, n + 0.1, t + 1, "#bfe9ff", 2.2, 0.5));
}
{
  const e = ve();
  for (const o of [-1, 1]) {
    const n = o * 13.5;
    e.box(Jo, n, nt / 2, -6.2, 0.4, nt, 3)
      .box(Jo, n, nt / 2, 17, 0.4, nt, 14)
      .box(Jo, n, 10.6, 4.9, 0.4, 2.8, 10.2)
      .box(Jo, n, 0.6, 4.9, 0.4, 1.2, 10.2);
    for (const s of [-0.2, 4.9, 10])
      e.box(Ye, n - o * 0.15, nt / 2, s, 0.16, nt, 0.16);
    e.box(Ye, n - o * 0.15, 1.25, 4.9, 0.16, 0.16, 10.3).box(
      Ye,
      n - o * 0.15,
      9.2,
      4.9,
      0.16,
      0.16,
      10.3,
    );
    const a = new r.Mesh(
      new r.PlaneGeometry(40, 16),
      new r.MeshBasicMaterial({ map: ni, fog: !1 }),
    );
    ((a.rotation.y = (-o * Math.PI) / 2),
      a.position.set(o * 30, 6.5, 4.9),
      _e.add(a));
  }
  e.flush(_e, !1);
  const t = ve();
  for (let o = 0; o < 40; o++) {
    const n = o % 2 ? 1 : -1,
      a = -6 + Kt(o) * 22,
      s = n * (15 + Kt(o + 0.5) * 10);
    eo(t, s, 0, a, 2.4 + Kt(o + 0.2) * 2.4, o);
  }
  t.flush(_e);
}
function si(e, t, o, n, a, s, l) {
  if (
    (e.save(),
    e.translate(t, o),
    (e.strokeStyle = s),
    (e.lineWidth = n * 0.035),
    (e.shadowColor = s),
    (e.shadowBlur = n * 0.12),
    (e.lineCap = "round"),
    e.beginPath(),
    e.moveTo(0, 0),
    Math.abs(a) < 0.01)
  )
    (e.setLineDash([n * 0.07, n * 0.06]), e.lineTo(0, n * 0.62));
  else {
    const i = Math.sign(a);
    e.bezierCurveTo(
      i * n * 0.02,
      n * 0.25,
      i * n * 0.25,
      n * 0.5,
      i * n * 0.72,
      n * 0.56,
    );
  }
  (e.stroke(),
    e.setLineDash([]),
    e.rotate(a),
    (e.shadowBlur = n * 0.05),
    (e.fillStyle = "rgba(200,218,238,.95)"),
    e.beginPath(),
    e.moveTo(-n * 0.12, -n * 0.22),
    e.lineTo(n * 0.12, -n * 0.22),
    e.lineTo(n * 0.02, -n * 0.03),
    e.lineTo(n * 0.016, 0),
    e.lineTo(-n * 0.016, 0),
    e.lineTo(-n * 0.02, -n * 0.03),
    e.closePath(),
    e.fill(),
    (e.fillStyle = "rgba(176,140,108,.95)"),
    e.fillRect(-n * 0.21, -n * 0.285, n * 0.42, n * 0.065),
    (e.fillStyle = "rgba(236,244,255,.96)"),
    e.beginPath(),
    e.moveTo(-n * 0.21, -n * 0.285),
    e.quadraticCurveTo(-n * 0.26, -n * 0.46, -n * 0.175, -n * 0.6),
    e.lineTo(-n * 0.165, -n * 0.97),
    e.quadraticCurveTo(0, -n * 1.03, n * 0.165, -n * 0.97),
    e.lineTo(n * 0.175, -n * 0.6),
    e.quadraticCurveTo(n * 0.26, -n * 0.46, n * 0.21, -n * 0.285),
    e.closePath(),
    e.fill(),
    (e.fillStyle = "rgba(84,104,136,.95)"),
    e.beginPath(),
    e.ellipse(0, -n * 0.975, n * 0.17, n * 0.045, 0, 0, 7),
    e.fill(),
    (e.shadowBlur = 0),
    (e.strokeStyle = "rgba(120,146,184,.95)"),
    (e.lineWidth = n * 0.02),
    (e.lineCap = "round"),
    e.beginPath());
  for (let i = 0; i < 5; i++) {
    const c = -n * (0.4 + i * 0.1);
    (e.moveTo(-n * 0.065, c),
      e.lineTo(n * 0.065, c - n * 0.055),
      e.moveTo(n * 0.065, c),
      e.lineTo(-n * 0.065, c - n * 0.055));
  }
  (e.stroke(), e.restore());
}
const da = [2, 1, 0],
  xs = (() => {
    const a = la(4.46, 2.37, 1400, Math.round(743.9461883408072), null, 1, {
      alphaTest: 0,
      transparent: !0,
      depthWrite: !1,
      opacity: 0.95,
      color: new r.Color(0.95, 1.05, 1.25),
    });
    (a.position.set(-2.37, 3.85, Qo + 2),
      _e.add(a),
      Jt.push(a),
      Qt(-2.37, 3.85, Qo + 3.5, "#7fd6ff", 6, 0.35));
    const s = (i, c, f) => {
      ((i.fillStyle = "rgba(18,38,66,.34)"),
        i.fillRect(0, 0, c, f),
        (i.strokeStyle = "rgba(143,228,255,.9)"),
        (i.lineWidth = 5),
        i.strokeRect(4, 4, c - 8, f - 8));
      const d = Ht.findIndex((w) => Math.abs(w - u.leanT) < 0.02),
        h = (c - 120) / 3;
      for (let w = 0; w < 3; w++) {
        const m = da[w],
          v = 40 + w * (h + 20),
          p = 40,
          x = f - 80,
          S = m === d;
        ((i.fillStyle = S ? "rgba(90,190,255,.16)" : "rgba(40,80,120,.12)"),
          i.fillRect(v, p, h, x),
          (i.strokeStyle = S ? "rgba(190,240,255,1)" : "rgba(120,190,230,.55)"),
          (i.lineWidth = S ? 5 : 3),
          i.strokeRect(v, p, h, x),
          (i.font = "600 30px DM Mono, monospace"),
          (i.letterSpacing = "6px"),
          (i.textAlign = "center"),
          (i.fillStyle = S ? "#e8f8ff" : "#8fb6d4"),
          i.fillText(["INSIDE", "FLAT", "OUTSIDE"][m], v + h / 2, p + 50),
          si(
            i,
            v + h / 2,
            p + x * 0.66,
            x * 0.42,
            -Ht[m] * 1.1,
            S ? "#7fe3ff" : "#5fa8d8",
          ));
      }
    };
    (Lo.push(() => a.userData.redraw(s)),
      (a.userData.drawFn = s),
      (a.userData.on = -2));
    const l = [0, 1, 2].map((i) => {
      const c = new r.Mesh(
        new r.PlaneGeometry(1.3366666666666667, 2.17),
        new r.MeshBasicMaterial({ visible: !1 }),
      );
      return (
        c.position.set(-2.37 + ((i - 1) * (4.46 - 0.35)) / 3, 3.85, Qo + 2.02),
        (c.userData.edge = da[i]),
        _e.add(c),
        c
      );
    });
    return { p: a, pads: l };
  })(),
  ye = { top: 1.32, bot: 0.28, run: 0.72 },
  ce = { r: 5, ice: ye.top + 0.12, wall: 0.62 },
  mt = new r.Group();
Zt.add(mt);
const at = Math.hypot(ye.run, ye.top - ye.bot),
  ri = [
    [-2.3, 5.45],
    [2.3, 5.45],
    [4.75, 4.72],
    [5.7, 1],
    [5.15, -3.3],
    [2.9, -5.6],
    [-2.9, -5.6],
    [-5.15, -3.3],
    [-5.7, 1],
    [-4.75, 4.72],
  ];
function ua(e, t) {
  const o = e.length,
    n = e.map((a, s) => {
      const l = e[(s + 1) % o],
        i = l[0] - a[0],
        c = l[1] - a[1],
        f = Math.hypot(i, c);
      return [-c / f, i / f];
    });
  return e.map((a, s) => {
    const l = n[(s + o - 1) % o],
      i = n[s],
      c = t / (1 + l[0] * i[0] + l[1] * i[1]);
    return [a[0] + (l[0] + i[0]) * c, a[1] + (l[1] + i[1]) * c];
  });
}
const Pt = {};
let Ae = null;
{
  const e = ri,
    t = ua(e, ye.run),
    o = ua(e, -0.06),
    n = e.length,
    a = [],
    s = (p, x, S, M) => a.push(...p, ...x, ...S, ...p, ...S, ...M);
  for (let p = 0; p < n; p++) {
    const x = (p + 1) % n,
      S = [t[p][0], ye.bot, t[p][1]],
      M = [t[x][0], ye.bot, t[x][1]],
      T = [e[p][0], ye.top - 0.05, e[p][1]],
      y = [e[x][0], ye.top - 0.05, e[x][1]],
      g = [o[p][0], ye.top, o[p][1]],
      k = [o[x][0], ye.top, o[x][1]];
    (s(S, M, y, T), s(T, y, k, g));
  }
  const l = new r.BufferGeometry();
  (l.setAttribute("position", new r.Float32BufferAttribute(a, 3)),
    l.computeVertexNormals());
  const i = new r.Mesh(
    l,
    ue("#434952", { roughness: 0.46, metalness: 0.55, envMapIntensity: 0.6 }),
  );
  ((i.castShadow = i.receiveShadow = !0), mt.add(i));
  const c = new r.ShapeGeometry(
    new r.Shape(o.map(([p, x]) => new r.Vector2(p, -x))),
  );
  (c.rotateX(-Math.PI / 2), c.translate(0, ye.top, 0));
  const f = new r.Mesh(
    c,
    ue("#5f666f", { roughness: 0.4, metalness: 0.6, envMapIntensity: 0.6 }),
  );
  ((f.receiveShadow = !0), mt.add(f));
  const d = ua(e, ye.run + 0.08),
    h = new r.Shape(d.map(([p, x]) => new r.Vector2(p, -x))),
    w = new r.ExtrudeGeometry(h, { depth: ye.bot, bevelEnabled: !1 });
  w.rotateX(-Math.PI / 2);
  const m = new r.Mesh(w, le("#15181d", { roughness: 0.6 }));
  ((m.receiveShadow = !0), mt.add(m));
  const v = ve();
  for (const p of [9, 0, 1]) {
    const x = (p + 1) % n,
      S = t[p],
      M = t[x],
      T = M[0] - S[0],
      y = M[1] - S[1],
      g = Math.hypot(T, y),
      k = -y / g,
      L = T / g,
      _ = Math.atan2(k, L),
      O = (S[0] + M[0]) / 2,
      H = (S[1] + M[1]) / 2;
    v.box(
      qe("#ffab55", 3.2),
      O + k * 0.12,
      ye.bot - 0.03,
      H + L * 0.12,
      g - 0.3,
      0.04,
      0.04,
      { ry: _ },
    );
    const G = e[p],
      b = e[x];
    (v.box(
      qe("#ffb468", 1.5),
      (G[0] + b[0]) / 2 + k * 0.02,
      ye.top - 0.04,
      (G[1] + b[1]) / 2 + L * 0.02,
      Math.hypot(b[0] - G[0], b[1] - G[1]) - 0.2,
      0.018,
      0.018,
      { ry: _ },
    ),
      Qt(O + k * 0.8, 0.3, H + L * 0.8, "#ffab55", 2.2, 0.25));
    const q = new r.Group();
    ((q.rotation.order = "YXZ"),
      q.position.set(O, ye.bot + 0.003, H),
      (q.rotation.y = _),
      (q.rotation.x = -Math.atan2(ye.run, ye.top - ye.bot)),
      mt.add(q),
      (Pt[p === 9 ? "L" : p === 0 ? "C" : "R"] = { g: q, len: g, yaw: _ }));
  }
  v.flush(mt, !1);
}
Ae = Pt.C.g;
const tn = new r.Group();
mt.add(tn);
{
  const e = ve();
  e.geo(
    ue("#b7bcc4", { roughness: 0.32, metalness: 0.85 }),
    fs(
      [
        [0, ce.r - 0.02],
        [0, ce.r + 0.34],
        [0.03, ce.r + 0.37],
        [0.11, ce.r + 0.37],
        [0.14, ce.r + 0.34],
        [0.14, ce.r - 0.02],
      ],
      96,
    ),
    ye.top,
    0,
    0,
    { rz: Math.PI / 2 },
  );
  for (let o = 0; o < 12; o++) {
    const n = ((o + 0.5) / 12) * Math.PI * 2;
    e.box(
      ue("#dfe4ea", { roughness: 0.2, metalness: 0.9 }),
      Math.sin(n) * (ce.r + 0.07),
      ce.ice + ce.wall / 2,
      Math.cos(n) * (ce.r + 0.07),
      0.018,
      ce.wall,
      0.03,
      { ry: n },
    );
  }
  e.flush(tn);
  const t = new r.Mesh(
    new r.TorusGeometry(ce.r + 0.07, 0.011, 5, 200),
    qe("#cdeeff", 1.7),
  );
  ((t.rotation.x = Math.PI / 2), (t.position.y = ce.ice + ce.wall), tn.add(t));
}
const Ee = { M: new r.Matrix3(), tile: 8, mat: null },
  ha = Po(1024, 1024, (e, t, o) => {
    const n = $e(21);
    ((e.fillStyle = "#86a9c6"), e.fillRect(0, 0, t, o));
    const a = (s) => {
      for (const l of [-t, 0, t])
        for (const i of [-o, 0, o])
          (e.save(), e.translate(l, i), s(), e.restore());
    };
    for (let s = 0; s < 26; s++) {
      const l = n() * t,
        i = n() * o,
        c = 60 + n() * 260,
        f = n() > 0.5;
      a(() => {
        const d = e.createRadialGradient(l, i, 0, l, i, c);
        (d.addColorStop(
          0,
          f ? "rgba(235,245,255,.16)" : "rgba(70,100,130,.12)",
        ),
          d.addColorStop(1, "rgba(0,0,0,0)"),
          (e.fillStyle = d),
          e.fillRect(l - c, i - c, c * 2, c * 2));
      });
    }
    e.lineCap = "round";
    for (let s = 0; s < 220; s++) {
      const l = n() * t,
        i = n() * o,
        c = 140 + n() * 900,
        f = n() * 6.3,
        d = 0.15 + n() * 0.9,
        h = 0.6 + n() * 2.2,
        w = 0.08 + n() * 0.28,
        m = n() < 0.35;
      a(() => {
        ((e.strokeStyle = `rgba(236,246,255,${w})`),
          (e.lineWidth = h),
          e.beginPath(),
          e.arc(l, i, c, f, f + d),
          e.stroke(),
          m &&
            ((e.lineWidth = h * 0.6),
            e.beginPath(),
            e.arc(l, i, c + 5 + n() * 4, f + 0.02, f + d * 0.9),
            e.stroke()));
      });
    }
    for (let s = 0; s < 5e3; s++) {
      e.fillStyle = `rgba(240,248,255,${0.03 + n() * 0.1})`;
      const l = n() * t,
        i = n() * o,
        c = 0.6 + n() * 1.6;
      e.fillRect(l, i, c, c);
    }
    for (let s = 0; s < 12; s++) {
      const l = n() * t,
        i = n() * o,
        c = 18 + n() * 50;
      a(() => {
        const f = e.createRadialGradient(l, i, 0, l, i, c);
        (f.addColorStop(0, "rgba(245,250,255,.22)"),
          f.addColorStop(1, "rgba(245,250,255,0)"),
          (e.fillStyle = f),
          e.beginPath(),
          e.ellipse(l, i, c * 1.8, c * 0.7, n() * 3, 0, 7),
          e.fill());
      });
    }
  });
ha.wrapS = ha.wrapT = r.RepeatWrapping;
const ii = { uIceM: { value: Ee.M } };
function li(e) {
  return Object.assign(
    (t) => {
      (e.extra(t),
        Object.assign(t.uniforms, ii),
        (t.vertexShader = t.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
uniform mat3 uIceM;varying vec2 vIceUV;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
{vec4 wq=modelMatrix*vec4(transformed,1.);vIceUV=(uIceM*vec3(wq.x,wq.z,1.)).xy;}`,
          )),
        (t.fragmentShader = t.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec2 vIceUV;`,
          )
          .replace(
            "#include <map_fragment>",
            "diffuseColor*=texture2D(map,vIceUV);",
          )));
    },
    { key: "ice" + e.extra.key },
  );
}
((bt.P.y = ce.ice),
  (Ee.mat = Xe(
    new r.MeshStandardMaterial({
      color: "#ffffff",
      map: ha,
      roughness: 0.08,
      metalness: 0,
      envMapIntensity: 0.8,
    }),
    li(bt),
  )),
  (bt.U.uReflStrength.value = 0.5));
{
  const e = new r.Mesh(new r.CircleGeometry(ce.r + 0.02, 160), Ee.mat);
  ((e.rotation.x = -Math.PI / 2),
    (e.position.y = ce.ice),
    (e.receiveShadow = !0),
    tn.add(e),
    (Ee.mesh = e),
    bt.hide.push(e));
}
const vs = Xe(
  new r.MeshStandardMaterial({
    color: "#d6f1ff",
    roughness: 0.04,
    metalness: 0,
    envMapIntensity: 1.7,
    transparent: !0,
    depthWrite: !1,
    side: r.DoubleSide,
  }),
  Object.assign(
    (e) => {
      e.fragmentShader = e.fragmentShader.replace(
        "#include <opaque_fragment>",
        `{float fr=1.-abs(dot(normalize(normal),normalize(vViewPosition)));diffuseColor.a=clamp(.04+.5*pow(max(fr,0.),3.),0.,1.);}
#include <opaque_fragment>`,
      );
    },
    { key: "glassF" },
  ),
);
{
  const e = new r.Mesh(
    new r.CylinderGeometry(
      ce.r + 0.07,
      ce.r + 0.07,
      ce.wall - 0.02,
      160,
      1,
      !0,
    ),
    vs,
  );
  ((e.position.y = ce.ice + ce.wall / 2 + 0.01),
    (e.renderOrder = 2),
    tn.add(e),
    Jt.push(e),
    (Ee.glass = e));
}
(bt.hide.push(mt.children[0], mt.children[1], mt.children[2]),
  Qt(-0.5, 4.5, 0.5, "#d4ecff", 7, 0.55));
{
  const e = ve(),
    t = le("#6d717a", { flatShading: !0, roughness: 0.8 });
  (e
    .geo(t, Cn(1, 0.12, 31, 1), -7, 0.95, -1.9, { s: [1.15, 1, 1.05] })
    .box(t, -7, 0.5, -1.9, 2.1, 1, 2, { r: 0.08 }),
    e.geo(ca, Cn(1, 0.15, 33, 1), -6.95, 1.5, -1.9, { s: [1.05, 0.28, 0.95] }),
    eo(e, -7.4, 1.6, -2.2, 1.9, 2),
    eo(e, -6.6, 1.6, -1.5, 1.5, 5),
    eo(e, -6.8, 1.6, -2.6, 1.2, 7),
    eo(e, -7.8, 1.6, -1.4, 1, 9),
    e
      .box(t, 6.6, 0.95, -3.9, 4.8, 1.9, 3.8, { r: 0.08 })
      .box(le("#e6ebf3", { roughness: 0.7 }), 6.6, 1.93, -3.9, 4.7, 0.08, 3.7),
    uo(e, 5.6, 1.95, -4.4, 1.6, 3.4, 21),
    uo(e, 7.3, 1.95, -4.2, 1.2, 2.4, 25),
    uo(e, 4.5, 1.95, -3.4, 0.95, 1.6, 27),
    uo(e, 8.4, 1.95, -3.2, 0.8, 1.3, 29));
  for (let a = 0; a < 8; a++)
    eo(
      e,
      4.4 + Kt(a + 3) * 4.4,
      1.97,
      -2.3 - Kt(a + 0.4) * 1.3,
      0.9 + Kt(a + 0.7) * 0.8,
      a + 11,
    );
  for (let a = 0; a < 4; a++)
    e.geo(
      ms,
      Cn(0.32 + Kt(a) * 0.2, 0.35, 41 + a, 0),
      4.9 + a * 1.05,
      2.1,
      -2.2 - Kt(a + 0.3) * 0.6,
      { s: [1, 0.7, 1] },
    );
  e.flush(_e);
  const o = ve(),
    n = le("#d9d3c8", { roughness: 0.55 });
  (o
    .box(n, -9.6, 0.45, 10.5, 1.2, 0.9, 1.2, { r: 0.06 })
    .box(n, 10, 0.45, 11.5, 1.2, 0.9, 1.2, { r: 0.06 }),
    o.flush(_e),
    ds(_e, -9.6, 0.9, 10.5, 1.5, 0, { n: 7 }),
    ds(_e, 10, 0.9, 11.5, 1.3, 0.02, { n: 6 }));
}
const ci = ue("#0b0e14", {
    roughness: 0.5,
    metalness: 0.3,
    clearcoat: 0.35,
    clearcoatRoughness: 0.45,
    envMapIntensity: 0.3,
  }),
  fi = ue("#7d848e", { roughness: 0.34 });
function pa(e, t, o = {}) {
  const n = o.h || at * 0.8,
    a = o.y || at * 0.5,
    s = ve();
  return (
    s
      .box(fi, e, a, 0.005, t, n, 0.03, { r: 0.05 })
      .box(ci, e, a, 0.02, t - 0.15, n - 0.08 * at, 0.02, { r: 0.04 }),
    s.flush(Ae, !1),
    { x: e, y: a, w: t, h: n }
  );
}
function Dl(e, t, o, n, a, s = {}) {
  const l = s.cw || 1024,
    i = Math.round((l * n) / o),
    c = document.createElement("canvas");
  ((c.width = l), (c.height = i));
  const f = c.getContext("2d"),
    d = new r.CanvasTexture(c);
  ((d.colorSpace = r.SRGBColorSpace), (d.anisotropy = 8));
  const h = new r.Mesh(
    new r.PlaneGeometry(o, n),
    new r.MeshBasicMaterial({
      map: d,
      fog: !1,
      color: new r.Color(s.k || 1.5, s.k || 1.5, s.k || 1.5),
    }),
  );
  return (
    h.position.set(e, t, 0.036),
    (s.parent || Ae).add(h),
    (h.userData = {
      c,
      g: f,
      t: d,
      redraw(w = 0) {
        (f.clearRect(0, 0, l, i), a(f, l, i, w), (d.needsUpdate = !0));
      },
    }),
    h.userData.redraw(0),
    Lo.push(() => h.userData.redraw(we)),
    h
  );
}
function Fl(e, t, o = {}) {
  const n = o.r || 0.36,
    a = new r.Group();
  (a.position.set(e, t, 0.03), Ae.add(a));
  const s = new r.Mesh(Zr(0, 0.14, 0, n * 0.86, 36, 0.02), rs);
  ((s.rotation.y = -Math.PI / 2), a.add(s));
  const l = new r.Mesh(
    new r.CylinderGeometry(n * 0.8, n * 0.84, 0.05, 48),
    ue("#d7dde6", { roughness: 0.18, metalness: 1 }),
  );
  ((l.rotation.x = Math.PI / 2), (l.position.z = 0.16), a.add(l));
  const i = new r.Mesh(
    new r.BoxGeometry(0.03, n * 0.4, 0.01),
    qe(o.ring || "#ffb454", 3),
  );
  (i.position.set(0, n * 0.5, 0.19), a.add(i));
  const c = new r.Mesh(
    new r.TorusGeometry(n * 1.08, 0.022, 8, 64),
    qe(o.ring || "#ffb454", 2.6),
  );
  return (
    (c.position.z = 0.01),
    a.add(c),
    (a.userData = { ring: c, tick: i, spin: 0 }),
    a
  );
}
function di(e, t, o, n = {}) {
  const a = Ae,
    s = ve();
  s.box(
    le("#0b0e13", { roughness: 0.5 }),
    (e + t) / 2,
    o,
    0.04,
    t - e + 0.1,
    0.05,
    0.02,
  );
  for (let v = 0; v <= 40; v++) {
    const p = He(e, t, v / 40);
    s.box(
      le("#5a6272"),
      p,
      o + (v % 5 ? 0.1 : 0.12),
      0.04,
      0.012,
      v % 5 ? 0.06 : 0.1,
      0.01,
    );
  }
  s.flush(Ae, !1);
  const l = n.color || "#6fdcff",
    i = new r.Mesh(new r.BoxGeometry(1, 0.028, 0.012), qe(l, 3));
  (i.position.set(e, o, 0.055), Ae.add(i));
  const c = new r.Group(),
    f = ve();
  (f
    .cyl(rs, 0, 0, 0, 0.16, 0.17, 0.09, { seg: 36, rx: Math.PI / 2 })
    .cyl(Hr, 0, 0, 0.05, 0.1, 0.1, 0.02, { seg: 28, rx: Math.PI / 2 }),
    f.flush(c));
  const d = new r.Mesh(new r.TorusGeometry(0.19, 0.014, 6, 48), qe(l, 2.6));
  ((d.position.z = -0.01), c.add(d), c.position.set(e, o, 0.1), Ae.add(c));
  const h = new r.Mesh(
    new r.PlaneGeometry(t - e + 0.3, 0.36),
    new r.MeshBasicMaterial({ visible: !1 }),
  );
  (h.position.set((e + t) / 2, o, 0.1), Ae.add(h));
  const w = (v, p) => {
      const x = new r.Group(),
        S = qe(l, 2.6);
      for (const T of [1, -1]) {
        const y = new r.Mesh(new r.BoxGeometry(0.2, 0.035, 0.012), S);
        (y.position.set(-p * 0.05, T * 0.06, 0),
          (y.rotation.z = T * p * -0.85),
          x.add(y));
      }
      const M = new r.Mesh(
        new r.PlaneGeometry(0.4, 0.5),
        new r.MeshBasicMaterial({ visible: !1 }),
      );
      return (
        x.add(M),
        (x.userData.hit = M),
        x.position.set(v, o + 0.02, 0.05),
        Ae.add(x),
        x
      );
    },
    m = {
      a: e,
      b: t,
      y: o,
      fill: i,
      knob: c,
      hit: h,
      chevL: n.chev === !1 ? null : w(e - 0.36, -1),
      chevR: n.chev === !1 ? null : w(t + 0.36, 1),
      t: 0,
      set(v) {
        this.t = re(v, 0, 1);
        const p = He(e, t, this.t);
        ((c.position.x = p),
          (i.scale.x = Math.max(0.001, p - e)),
          (i.position.x = e + (p - e) / 2));
      },
      fromRay(v) {
        const p = v.intersectObject(h, !1)[0];
        if (!p) return null;
        const x = a.worldToLocal(p.point.clone());
        return re((x.x - e) / (t - e), 0, 1);
      },
    };
  return (m.set(0), m);
}
const ws = [];
function ui(e, t, o, n, a, s = 128) {
  const l = "@RYANSAEL ON X",
    i = () => {
      ((e.font = `${n ? 700 : 600} ${s}px Outfit, sans-serif`),
        (e.letterSpacing = Math.round(s * 0.08) + "px"));
    };
  i();
  const c = e.measureText(l).width;
  c > t - 28 && ((s = Math.floor((s * (t - 28)) / c)), i());
  const f = t / 2 + Math.round(s * 0.04),
    d = o / 2 + s * 0.35;
  if (((e.textAlign = "center"), (e.textBaseline = "alphabetic"), n)) {
    ((e.fillStyle = "#fbf8f2"),
      e.fillText(l, f, d + s * 0.05),
      (e.fillStyle = a ? "#e08a24" : "#38332d"),
      e.fillText(l, f, d));
    return;
  }
  ((e.fillStyle = "#040506"),
    e.fillText(l, f + s * 0.02, d + s * 0.065),
    (e.fillStyle = "#fff0cc"),
    e.fillText(l, f, d - s * 0.025));
  const h = e.createLinearGradient(0, d - s * 0.7, 0, d);
  (h.addColorStop(0, "#f1d08c"),
    h.addColorStop(1, "#b3833d"),
    (e.fillStyle = h),
    e.fillText(l, f, d));
}
function ma(e, t = {}) {
  const o = !!t.pale,
    n = t.k ?? (o ? 0.92 : 0.6);
  let a = !1;
  const s = (i, c, f) => ui(i, c, f, o, a),
    l = la(e, e * 0.1375, 1280, 176, s, n, { alphaTest: 0.25 });
  return (
    (l.userData.mark = 1),
    aa.push(l),
    ws.push({
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
function hi(e, t, o = 1.2, n = {}) {
  const a = ma(o, n);
  return (a.position.set(e, t, 0.012), Ae.add(a), a);
}
const on = new r.Group();
(Zt.add(on), (on.visible = !1));
const Ve = new r.Group();
(Zt.add(Ve), (Ve.visible = !1));
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
        "varying vec3 vW;uniform vec3 uC;void main(){vec3 d=normalize(vW-vec3(0.,3.,0.));float glow=exp(-pow(length(vW.xy-uC.xy)/70.,2.));float up=smoothstep(-.1,.7,d.y);vec3 c=mix(vec3(.03,.075,.2),vec3(.07,.2,.46),glow);c=mix(c,vec3(.03,.06,.15),up*.6);gl_FragColor=vec4(c,1.);}",
    }),
  );
  ((e.renderOrder = -10), on.add(e), Jt.push(e));
  const t = Xe(
      new r.MeshStandardMaterial({
        color: "#1b3159",
        roughness: 0.3,
        metalness: 0.2,
        envMapIntensity: 0.5,
      }),
      Ja,
    ),
    o = new r.Mesh(new r.CircleGeometry(90, 64), t);
  ((o.rotation.x = -Math.PI / 2),
    (o.receiveShadow = !0),
    on.add(o),
    aa.push(o));
}
const to = new r.Group();
(Zt.add(to), (to.visible = !1));
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
    n = [],
    a = 70;
  e.forEach(([i, c], f) => {
    const [d, h] = e[Math.min(f + 1, e.length - 1)],
      [w, m] = e[Math.max(f - 1, 0)],
      v = d - w,
      p = h - m,
      x = Math.hypot(v, p) || 1;
    for (const S of [-a, a]) (t.push(S, c, i), o.push(0, -v / x, p / x));
  });
  for (let i = 0; i < e.length - 1; i++) {
    const c = i * 2;
    n.push(c, c + 1, c + 2, c + 1, c + 3, c + 2);
  }
  const s = new r.BufferGeometry();
  (s.setAttribute("position", new r.Float32BufferAttribute(t, 3)),
    s.setAttribute("normal", new r.Float32BufferAttribute(o, 3)),
    s.setIndex(n));
  const l = new r.Mesh(
    s,
    le("#efe6da", { roughness: 0.92, envMapIntensity: 0.4 }),
  );
  ((l.receiveShadow = !0), to.add(l));
}
const Ut = { y: 0.7, r: 2.9 },
  _o = new r.Group();
{
  const e = $e(77),
    t = 48,
    o = [];
  for (let x = 0; x < t; x++) {
    const S = (x / t) * Math.PI * 2,
      M = Ut.r * (1 + (e() - 0.5) * 0.05) * [1, 0.985, 0.925][x % 3];
    o.push([Math.cos(S) * M * 1.18, Math.sin(S) * M * 0.92, S]);
  }
  const n = [],
    a = [],
    s = new r.Color("#f7fbfe"),
    l = new r.Color("#e4f0f9"),
    i = new r.Color("#bcd8ec"),
    c = new r.Color("#86b2d6"),
    f = (x, S) => {
      (n.push(...x), a.push(S.r, S.g, S.b));
    },
    d = [
      [Ut.y, 1, s],
      [Ut.y - 0.09, 1.022, l],
      [Ut.y * 0.5, 1.04, i],
      [0.03, 0.99, c],
    ],
    h = d.map(([x, S, M], T) =>
      o.map(([y, g, k], L) => {
        const _ = T > 1 ? 1 + (e() - 0.5) * 0.08 : 1;
        return [y * S * _, x + (T === 2 ? (e() - 0.5) * 0.2 : 0), g * S * _];
      }),
    );
  for (let x = 0; x < 3; x++)
    for (let S = 0; S < t; S++) {
      const M = (S + 1) % t,
        T = h[x][S],
        y = h[x][M],
        g = h[x + 1][M],
        k = h[x + 1][S],
        L = d[x][2],
        _ = d[x + 1][2];
      (f(T, L), f(g, _), f(k, _), f(T, L), f(y, L), f(g, _));
    }
  const w = new r.BufferGeometry();
  (w.setAttribute("position", new r.Float32BufferAttribute(n, 3)),
    w.setAttribute("color", new r.Float32BufferAttribute(a, 3)),
    w.computeVertexNormals());
  const m = new r.Mesh(
    w,
    Xe(
      new r.MeshPhysicalMaterial({
        color: "#ffffff",
        vertexColors: !0,
        roughness: 0.12,
        metalness: 0,
        envMapIntensity: 1.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        flatShading: !0,
      }),
    ),
  );
  ((m.castShadow = m.receiveShadow = !0), to.add(m));
  const v = new r.Shape(o.map(([x, S]) => new r.Vector2(x, -S))),
    p = new r.Mesh(new r.ShapeGeometry(v), Ee.mat);
  ((p.rotation.x = -Math.PI / 2),
    (p.position.y = Ut.y + 0.004),
    (p.receiveShadow = !0),
    to.add(p),
    bt.hide.push(p),
    (Ut.top = p),
    oi(to, 0, 0, 0, Ut.r * 2.9, Ut.r * 2.4, 0.5));
}
class pi {
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
            ...as,
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
          fragmentShader: `${Ur}varying float vS;varying vec4 vC;uniform float uSoft;uniform float uLight;uniform float uLightK;
    void main(){float k=exp(-vS*vS*3.2),core=exp(-vS*vS*26.);float a=(k*.5+core*1.5)*vC.a*ovVis(uSoft);
     if(uLight>.5)gl_FragColor=vec4(vC.rgb*uLightK*(1.+core*.6),clamp(a*.75,0.,1.));else gl_FragColor=vec4(vC.rgb*a,1.);}`,
        }),
      )),
      (this.mesh.frustumCulled = !1),
      (this.n = 0),
      Ko.add(this.mesh));
  }
  setLight(t) {
    const o = this.mesh.material;
    ((o.uniforms.uLight.value = t ? 1 : 0),
      (o.blending = t ? r.NormalBlending : r.AdditiveBlending));
  }
  begin(t) {
    t || (this.n = 0);
  }
  seg(t, o, n, a, s, l, i) {
    if (this.n >= this.max) return;
    const c = this.n++;
    (bs.subVectors(o, t),
      ys.addVectors(t, o).multiplyScalar(0.5),
      Ms.subVectors(j.position, ys),
      st.crossVectors(bs, Ms).normalize());
    const f = this.pos,
      d = c * 12;
    ((f[d] = t.x - st.x * n),
      (f[d + 1] = t.y - st.y * n),
      (f[d + 2] = t.z - st.z * n),
      (f[d + 3] = t.x + st.x * n),
      (f[d + 4] = t.y + st.y * n),
      (f[d + 5] = t.z + st.z * n),
      (f[d + 6] = o.x - st.x * a),
      (f[d + 7] = o.y - st.y * a),
      (f[d + 8] = o.z - st.z * a),
      (f[d + 9] = o.x + st.x * a),
      (f[d + 10] = o.y + st.y * a),
      (f[d + 11] = o.z + st.z * a),
      this.side.set([-1, 1, -1, 1], c * 4));
    const h = this.col,
      w = c * 16;
    for (let m = 0; m < 4; m++)
      ((h[w + m * 4] = s.r),
        (h[w + m * 4 + 1] = s.g),
        (h[w + m * 4 + 2] = s.b),
        (h[w + m * 4 + 3] = m < 2 ? l : i));
  }
  line(t, o, n, a) {
    for (let s = 0; s < t.length - 1; s++) {
      const l = s / (t.length - 1),
        i = (s + 1) / (t.length - 1);
      this.seg(
        t[s],
        t[s + 1],
        me(t[s], o),
        me(t[s + 1], o),
        n,
        a ? a(l) : 1,
        a ? a(i) : 1,
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
const bs = new r.Vector3(),
  ys = new r.Vector3(),
  Ms = new r.Vector3(),
  st = new r.Vector3(),
  ge = new pi(6e3),
  me = (e, t) =>
    ((j.position.distanceTo(e) *
      Math.tan(r.MathUtils.degToRad(j.fov / 2)) *
      2) /
      Math.max(Lt.clientHeight, 1)) *
    t *
    0.5;
function Rn(e = 640, t = 104) {
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
    Ko.add(s),
    (s.userData = {
      key: "",
      w: e,
      h: t,
      a: 0,
      want: 1,
      set(l, i = "", c = "#7fe3ff", f = 0) {
        const d = l + "|" + i + "|" + c + "|" + f;
        if (d === this.key) return;
        ((this.key = d),
          (this.args = [l, i, c, f]),
          n.clearRect(0, 0, e, t),
          (n.font = "600 38px Outfit, sans-serif"));
        const h = n.measureText(l).width;
        n.font = "500 30px DM Mono, monospace";
        const w = i ? n.measureText(i).width + 26 : 0,
          m = Math.min(e - 8, h + w + 84),
          v = f < 0 ? 4 : f > 0 ? e - 4 - m : (e - m) / 2;
        ((n.fillStyle = "rgba(10,14,26,.86)"),
          Yr(n, v, 8, m, t - 16, (t - 16) / 2),
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
            n.fillText(i, v + 56 + h + 22, t / 2 + 2)),
          (a.needsUpdate = !0));
      },
    }),
    Lo.push(() => {
      const l = s.userData;
      l.args && ((l.key = ""), l.set(...l.args));
    }),
    s
  );
}
function ho(e, t, o = 24, n = 0) {
  const a = (me(t, o) * 2) / (e.userData.h / e.userData.w);
  (e.position.copy(t),
    e.quaternion.copy(j.quaternion),
    e.scale.set(a, a, a),
    n &&
      e.position.addScaledVector(
        mi.set(0, 1, 0).applyQuaternion(j.quaternion),
        (n * a * e.userData.h) / e.userData.w,
      ),
    (e.userData.a +=
      (e.userData.want - e.userData.a) * (1 - Math.exp(-qo * 8))),
    (e.material.opacity = e.userData.a),
    (e.visible = e.userData.a > 0.02));
}
const mi = new r.Vector3();
let Nt = !0;
const Se = 0.13,
  Fe = { R: 22, xc: 0.05, w: 0.045, top: 0.48 + Se },
  nn = 1.3,
  xa = (e) => Fe.R - Math.sqrt(Fe.R * Fe.R - (e - Fe.xc) ** 2),
  Ao = 0.565 + Se,
  yt = 0.9 + Se,
  _t = -0.45,
  va = (e) =>
    e >= 0.3 ? Ao : e <= _t ? yt : He(yt, Ao, (e - _t) / (0.3 - _t));
function Eo(e, t, o, n = 1.4, a = 0.015) {
  let s = e(t[0], t[1], t[2]);
  for (let l = a; l <= n; l += a) {
    const i = e(t[0] + o[0] * l, t[1] + o[1] * l, t[2] + o[2] * l);
    if (i > 0 != s > 0) {
      let c = l - a,
        f = l;
      for (let h = 0; h < 22; h++) {
        const w = (c + f) / 2;
        e(t[0] + o[0] * w, t[1] + o[1] * w, t[2] + o[2] * w) > 0 == s > 0
          ? (c = w)
          : (f = w);
      }
      const d = (c + f) / 2;
      return [t[0] + o[0] * d, t[1] + o[1] * d, t[2] + o[2] * d];
    }
    s = i;
  }
  return null;
}
function wa(e, t, o = 0.004) {
  const n = e(t[0] + o, t[1], t[2]) - e(t[0] - o, t[1], t[2]),
    a = e(t[0], t[1] + o, t[2]) - e(t[0], t[1] - o, t[2]),
    s = e(t[0], t[1], t[2] + o) - e(t[0], t[1], t[2] - o),
    l = Math.hypot(n, a, s) || 1;
  return [n / l, a / l, s / l];
}
const xi = (e) => new r.Vector3(e[0], e[1], e[2]);
function ba(e, t, o, n = 0.035, a = 1) {
  const s = $e(a),
    l = e.pos,
    i = e.idx,
    c = i.length,
    f = new Float32Array(c * 3),
    d = new Float32Array(c * 3),
    h = new r.Color();
  for (let m = 0; m < c; m += 3) {
    const v = i[m] * 3,
      p = i[m + 1] * 3,
      x = i[m + 2] * 3;
    f.set(
      [
        l[v],
        l[v + 1],
        l[v + 2],
        l[p],
        l[p + 1],
        l[p + 2],
        l[x],
        l[x + 1],
        l[x + 2],
      ],
      m * 3,
    );
    const S = t
      ? pt.colorIndex(
          t,
          (l[v] + l[p] + l[x]) / 3,
          (l[v + 1] + l[p + 1] + l[x + 1]) / 3,
          (l[v + 2] + l[p + 2] + l[x + 2]) / 3,
        )
      : 0;
    h.set(o[S] || o[0]).offsetHSL(0, 0, (s() - 0.5) * n * 2);
    for (let M = 0; M < 3; M++) d.set([h.r, h.g, h.b], (m + M) * 3);
  }
  const w = new r.BufferGeometry();
  return (
    w.setAttribute("position", new r.BufferAttribute(f, 3)),
    w.setAttribute("color", new r.BufferAttribute(d, 3)),
    w.computeVertexNormals(),
    w
  );
}
const po = (e, t, o = {}) => pt.prim(0, { c: e, r: t, ...o }),
  zn = (e, t, o, n, a = {}) => pt.prim(1, { a: e, b: t, r1: o, r2: n, ...a }),
  Do = (e, t, o, n = {}) => pt.prim(2, { c: e, h: t, rad: o, ...n });
function gs() {
  return [
    po([1.02, 0.8 + Se, 0], [0.47, 0.31, 0.41]),
    po([0.52, 0.86 + Se, 0], [0.6, 0.37, 0.49]),
    zn([0.34, 1 + Se, 0], [-0.22, 1.62 + Se, 0], 0.44, 0.49),
    zn([-0.9, 0.97 + Se, 0], [-0.85, 1.52 + Se, 0], 0.35, 0.33),
    Do([-0.55, 1.72 + Se, 0], [0.56, 0.52, 0.48], 0.42, { rot: [0, 0, -0.06] }),
    Do([-0.6, 2.3 + Se, 0], [0.53, 0.55, 0.47], 0.4, { rot: [0, 0, -0.12] }),
    po([-0.55, 1.62 + Se, 0.48], [0.1, 0.11, 0.06], { k: 0.09 }),
    po([-0.53, 1.6 + Se, -0.48], [0.1, 0.11, 0.06], { k: 0.09 }),
  ];
}
const ya = 2.66 + Se;
function Ss() {
  const e = Math.atan2(yt - Ao, 0.3 - _t),
    t = (0.3 + _t) / 2,
    o = (Ao + yt) / 2,
    n = Math.hypot(0.3 - _t, yt - Ao) / 2 + 0.02;
  return [
    Do([1.15, Ao - 1, 0], [0.85, 1, 1], 0, { sub: !0, k: 0.03 }),
    Do([-1.225, yt - 1, 0], [0.775, 1, 1], 0, { sub: !0, k: 0.03 }),
    Do([t - Math.sin(e) * 0.5, o - Math.cos(e) * 0.5, 0], [n, 0.5, 1], 0, {
      sub: !0,
      k: 0.03,
      rot: [0, 0, -e],
    }),
    Do([-0.55, ya + 0.5, 0], [1.2, 0.5, 1], 0, {
      sub: !0,
      k: 0.02,
      rot: [0, 0, -0.06],
    }),
    po([-0.62, ya, 0], [0.38, 0.34, 0.33], { sub: !0, k: 0.03 }),
  ];
}
const Ln = (e) => ya + (-0.55 - e) * 0.06,
  oo = { a: [0.8, 0.92 + Se], b: [-0.1, 2.62 + Se] },
  Ts = (() => {
    const e = oo.b[0] - oo.a[0],
      t = oo.b[1] - oo.a[1],
      o = Math.hypot(e, t);
    return [-t / o, e / o].map((n) => -n);
  })();
function Pn(e, t, o) {
  const n = He(oo.a[0], oo.b[0], t),
    a = He(oo.a[1], oo.b[1], t),
    s = [Ts[0], Ts[1], 0],
    l = Eo(
      e,
      [n + s[0] * 0.9, a + s[1] * 0.9, o],
      [-s[0], -s[1], 0],
      1.2,
      0.012,
    );
  return l ? { p: l, n: wa(e, l) } : null;
}
const ks = (() => {
    const e = performance.now(),
      t = gs(),
      o = pt.field([...t, ...Ss()], 0.16),
      n = [];
    for (let c = 0; c <= 10; c++) {
      const f = Pn(o, c / 10, 0);
      f && n.push(f);
    }
    const a = [];
    for (let c = 0; c < n.length - 1; c++) {
      const f = n[c],
        d = n[c + 1],
        h = 0.07,
        w = h - 0.028;
      a.push(
        zn(
          [f.p[0] - f.n[0] * w, f.p[1] - f.n[1] * w, f.p[2] - f.n[2] * w],
          [d.p[0] - d.n[0] * w, d.p[1] - d.n[1] * w, d.p[2] - d.n[2] * w],
          h,
          h,
          { sub: !0, k: 0.012 },
        ),
      );
    }
    const s = [...t, ...a, ...Ss()],
      l = pt.field(s, 0.16),
      i = pt.mesh(s, 0.16, 0.03, 1500);
    return { prims: s, f: l, m: i, S: n, ms: performance.now() - e };
  })(),
  Ma = Xe(
    new r.MeshPhysicalMaterial({
      color: "#f4f6fa",
      vertexColors: !0,
      roughness: 0.5,
      clearcoat: 0.35,
      clearcoatRoughness: 0.38,
      envMapIntensity: 0.85,
      flatShading: !0,
    }),
    Object.assign(
      (e) => {
        const t = "varying vec3 vLP;varying vec3 vLY;";
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
` + t,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vLP=position;vLY=normalize(normalMatrix*vec3(0.,1.,0.));`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
` + t,
            )
            .replace(
              "#include <normal_fragment_maps>",
              `#include <normal_fragment_maps>
  {float y=vLP.y-${Se.toFixed(3)},band=smoothstep(1.56,1.68,y)*(1.-smoothstep(1.98,2.1,y)),side=smoothstep(.16,.3,abs(vLP.z)),back=smoothstep(-1.02,-.7,vLP.x);
   float w=sin((y+.05*sin(vLP.x*6.+vLP.z*4.))*30.);normal=normalize(normal+vLY*(w*.65*band*side*back));}`,
            )));
      },
      { key: "folds" },
    ),
  ),
  ga = Xe(
    new r.MeshPhysicalMaterial({
      color: "#ffffff",
      vertexColors: !0,
      roughness: 0.78,
      envMapIntensity: 0.5,
      flatShading: !0,
    }),
  ),
  Sa = le("#e4ddd0", { roughness: 0.7, envMapIntensity: 0.55 }),
  vi = ue("#d4d9e1", { roughness: 0.2, metalness: 1 }),
  Cs = Wr("#6a452b", {
    roughness: 0.4,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    envMapIntensity: 0.9,
    flatShading: !0,
  }),
  wi = Xe(
    new r.MeshPhysicalMaterial({
      color: "#5f4430",
      roughness: 0.45,
      clearcoat: 0.55,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.9,
    }),
    Object.assign(
      (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vHP;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vHP=position;`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vHP;`,
            )
            .replace(
              "#include <color_fragment>",
              `#include <color_fragment>
  {float b=vHP.y*34.+sin(vHP.x*9.+vHP.z*7.)*.18,f=fract(b),g=smoothstep(0.,.12,f)*smoothstep(1.,.86,f),grain=.5+.5*sin(vHP.x*140.+sin(vHP.y*60.)*2.+floor(b)*1.7);
   diffuseColor.rgb*=mix(.58,1.,g)*(.9+.1*grain)*(.92+.16*fract(sin(floor(b)*12.9898)*43758.5));}`,
            )));
      },
      { key: "heel" },
    ),
  ),
  an = Po(
    512,
    128,
    (e, t, o) => {
      const n = $e(5);
      ((e.fillStyle = "rgb(128,128,128)"), e.fillRect(0, 0, t, o));
      for (let a = 0; a < 900; a++) {
        const s = n() * o,
          l = 104 + n() * 50;
        ((e.fillStyle = `rgba(${l},${l},${l},.5)`),
          e.fillRect(n() * t - 60, s, 40 + n() * 260, 0.6 + n() * 1.4));
      }
    },
    !1,
  );
((an.wrapS = an.wrapT = r.RepeatWrapping), an.repeat.set(1.2, 5));
const Rs = Object.assign(
    (e) => {
      const t =
        "varying vec3 vBP;varying vec3 vBN;varying vec3 vBX;varying vec3 vBY;";
      ((e.vertexShader = e.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
` + t,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
vBP=position;vBN=normal;vBX=normalize(normalMatrix*vec3(1.,0.,0.));vBY=normalize(normalMatrix*vec3(0.,1.,0.));`,
        )),
        (e.fragmentShader = e.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + t,
          )
          .replace(
            "#include <normal_fragment_maps>",
            `#include <normal_fragment_maps>
if(abs(vBN.z)>.9)normal=normalize(normal+vBX*(.35*(vBP.x+.05))+vBY*(5.*(vBP.y-.3)));`,
          )
          .replace(
            "#include <lights_fragment_end>",
            `#include <lights_fragment_end>
reflectedLight.directSpecular=min(reflectedLight.directSpecular,vec3(.45));`,
          )));
    },
    { key: "bend" },
  ),
  sn = Xe(
    new r.MeshPhysicalMaterial({
      color: "#eef2f7",
      metalness: 1,
      roughness: 0.3,
      roughnessMap: an,
      anisotropy: 0.25,
      envMapIntensity: 1.25,
    }),
    Rs,
  ),
  Ta = ue("#aab1bc", { roughness: 0.3, metalness: 1 });
function ka(e, t, o, n, a = 14) {
  const s = new r.CatmullRomCurve3(e.map(xi)),
    l = s.getSpacedPoints(a),
    i = [],
    c = [],
    f = new r.Vector3(),
    d = new r.Vector3(),
    h = new r.Vector3(),
    w = new r.Vector3(),
    m = 6;
  l.forEach((p, x) => {
    s.getTangentAt(Math.min(x / a, 1), f);
    const S = n([p.x, p.y, p.z]);
    (w.set(S[0], S[1], S[2]),
      d.copy(w).addScaledVector(f, -f.dot(w)).normalize(),
      h.crossVectors(f, d));
    for (let M = 0; M < m; M++) {
      const T = (M / m) * Math.PI * 2,
        y = (Math.cos(T) * t) / 2,
        g = (Math.sin(T) * o) / 2;
      i.push(
        p.x + h.x * y + d.x * g,
        p.y + h.y * y + d.y * g,
        p.z + h.z * y + d.z * g,
      );
    }
    if (x < a)
      for (let M = 0; M < m; M++) {
        const T = x * m + M,
          y = x * m + ((M + 1) % m);
        c.push(T, y, T + m, y, y + m, T + m);
      }
  });
  const v = new r.BufferGeometry();
  return (
    v.setAttribute("position", new r.Float32BufferAttribute(i, 3)),
    v.setIndex(c),
    v.computeVertexNormals(),
    v
  );
}
const X = {},
  Mt = new r.Group(),
  _n = new r.Group(),
  Fo = new r.Group(),
  rt = new r.Group(),
  Io = new r.Group();
(Mt.add(_n), _n.add(Fo), Fo.add(rt, Io), Zt.add(Mt));
{
  const { f: e, m: t, prims: o, S: n } = ks,
    a = new r.Mesh(ba(t, o, ["#f1f4f9"], 0.04, 3), Ma);
  ((a.castShadow = a.receiveShadow = !0),
    (X.boot = new r.Group()),
    X.boot.add(a),
    rt.add(X.boot));
  const s = n[n.length - 1],
    l = [];
  for (const b of n)
    l.push([
      b.p[0] - b.n[0] * 0.075,
      b.p[1] - b.n[1] * 0.075,
      b.p[2] - b.n[2] * 0.075,
    ]);
  const i = [s.p[0] - s.n[0] * 0.06 - 0.02, s.p[1] + 0.1, 0];
  l.push(i);
  const c = [];
  for (let b = 0; b < l.length - 1; b++)
    c.push(zn(l[b], l[b + 1], 0.056, 0.056));
  c.push(
    po([i[0] + 0.01, i[1] - 0.03, 0], [0.08, 0.08, 0.2]),
    po([i[0] + 0.01, i[1] + 0.035, 0], [0.3, 0.04, 0.3], { paint: !0, col: 1 }),
  );
  const f = pt.mesh(c, 0.05, 0.018, 220),
    d = new r.Mesh(ba(f, c, ["#f1eee9", "#8b919b"], 0.03, 5), ga);
  ((d.castShadow = !0),
    (X.tongue = new r.Group()),
    X.tongue.add(d),
    rt.add(X.tongue));
  const h = [];
  for (let b = 28; b <= 332; b += 13) {
    const q = (b * Math.PI) / 180,
      ee = Math.cos(q),
      Z = Math.sin(q),
      ie = -0.55 + ee * 0.5,
      E = Ln(ie) - 0.05,
      C = Eo(e, [-0.55 + ee * 1.2, E, Z * 1.2], [-ee, 0, -Z], 1.2, 0.01);
    C &&
      h.push(new r.Vector3(C[0] - ee * 0.07, Ln(C[0]) + 0.02, C[2] - Z * 0.07));
  }
  const w = new r.CatmullRomCurve3(h),
    m = ve();
  m.geo(ga, new r.TubeGeometry(w, 40, 0.078, 7, !1));
  for (const b of [h[0], h[h.length - 1]])
    m.sph(ga, b.x, b.y, b.z, 0.078, { seg: 7, seg2: 5 });
  const v = m.flush(rt)[0],
    p = new r.Color("#3b3f47"),
    x = v.geometry.attributes.position.count,
    S = new Float32Array(x * 3);
  for (let b = 0; b < x; b++) S.set([p.r, p.g, p.b], b * 3);
  (v.geometry.setAttribute("color", new r.BufferAttribute(S, 3)),
    v.geometry.computeVertexNormals(),
    (X.pad = v));
  const M = [],
    T = [];
  for (let b = 0; b < 10; b++) {
    const q = 0.1 + b * 0.092,
      ee = Pn(e, q, -0.15),
      Z = Pn(e, q, 0.15);
    ee && Z && (M.push(ee), T.push(Z));
  }
  const y = ve(),
    g = new r.TorusGeometry(0.033, 0.011, 6, 16).rotateX(Math.PI / 2);
  for (const b of [...M, ...T])
    y.geo(
      vi,
      g,
      b.p[0] + b.n[0] * 0.004,
      b.p[1] + b.n[1] * 0.004,
      b.p[2] + b.n[2] * 0.004,
      { dir: b.n },
    );
  X.eyelets = y.flush(rt);
  const k = (b) => wa(e, b),
    L = (b, q) => [
      b.p[0] + b.n[0] * q,
      b.p[1] + b.n[1] * q,
      b.p[2] + b.n[2] * q,
    ],
    _ = ve(),
    O = (b, q, ee) => {
      const Z = L(b, 0.012),
        ie = L(q, 0.012),
        E = [
          (b.n[0] + q.n[0]) / 2,
          (b.n[1] + q.n[1]) / 2,
          (b.n[2] + q.n[2]) / 2,
        ],
        C = 0.028 + ee,
        P = (N, de) => [
          He(Z[0], ie[0], N) + E[0] * de,
          He(Z[1], ie[1], N) + E[1] * de,
          He(Z[2], ie[2], N) + E[2] * de,
        ];
      _.geo(
        Sa,
        ka(
          [Z, P(0.25, C * 0.8), P(0.5, C), P(0.75, C * 0.8), ie],
          0.052,
          0.014,
          k,
          12,
        ),
      );
    };
  O(M[0], T[0], 0);
  for (let b = 0; b < M.length - 1; b++)
    (O(M[b], T[b + 1], 0), O(T[b], M[b + 1], 0.012));
  const H = L(n[n.length - 1], 0.06),
    G = (b, q, ee, Z) => [H[0] + q, H[1] + ee, H[2] + b * Z];
  for (const b of [-1, 1])
    (_.geo(
      Sa,
      ka(
        [
          L(b < 0 ? M[M.length - 1] : T[T.length - 1], 0.012),
          H,
          G(b, 0.06, 0.04, 0.12),
          G(b, 0.1, 0.02, 0.24),
          G(b, 0.08, -0.06, 0.2),
          G(b, 0.03, -0.03, 0.06),
          H,
        ],
        0.034,
        0.011,
        k,
        16,
      ),
    ),
      _.geo(
        Sa,
        ka(
          [
            H,
            G(b, 0.08, -0.07, 0.05),
            G(b, 0.12, -0.22, 0.08),
            G(b, 0.11, -0.36, 0.07),
          ],
          0.032,
          0.011,
          k,
          10,
        ),
      ));
  ((X.laces = _.flush(rt)),
    (X.upperG = new r.Group()),
    rt.add(X.upperG),
    X.upperG.add(X.boot, ...X.eyelets, ...X.laces));
  {
    const b = le("#dcd5c7", { roughness: 0.8, envMapIntensity: 0.4 }),
      q = ve(),
      ee = new r.CylinderGeometry(0.0055, 0.0055, 0.03, 4),
      Z = (C) => {
        const P = Math.hypot(C[0], C[1], C[2]) || 1;
        return [C[0] / P, C[1] / P, C[2] / P];
      },
      ie = (C) => {
        let P = 0.02;
        for (let N = 0; N < C.length - 1; N++) {
          const de = C[N],
            D = C[N + 1],
            A = D[0] - de[0],
            F = D[1] - de[1],
            W = D[2] - de[2],
            I = Math.hypot(A, F, W);
          if (I < 1e-5 || I > 0.3) {
            P = 0.02;
            continue;
          }
          for (; P < I;) {
            const $ = P / I,
              U = [de[0] + A * $, de[1] + F * $, de[2] + W * $],
              ae = wa(e, U);
            (q.geo(
              b,
              ee,
              U[0] + ae[0] * 0.007,
              U[1] + ae[1] * 0.007,
              U[2] + ae[2] * 0.007,
              { dir: [A, F, W] },
            ),
              (P += 0.056));
          }
          P -= I;
        }
      },
      E = (C, P, N, de) => {
        const D = [];
        for (let A = 0; A <= de; A++) {
          const F = C(He(P, N, A / de));
          F && D.push(F);
        }
        return D;
      };
    (ie(
      E(
        (C) => {
          const N = 0.1 + 1.9 * Math.cos(C),
            de = 1.1 * Math.sin(C),
            D = va(re(0.1 + 1.4 * Math.cos(C), -1.25, 1.45)) + 0.07;
          return Eo(e, [N, D, de], Z([0.1 - N, 0, -de]), 2.2, 0.01);
        },
        0,
        Math.PI * 2,
        140,
      ),
    ),
      ie(
        E(
          (C) => Eo(e, [-2, C, 0], [1, 0, 0], 1.4, 0.01),
          yt + 0.06,
          Ln(-1.1) - 0.13,
          32,
        ),
      ),
      ie(
        E(
          (C) => {
            const P = Math.cos(C),
              N = Math.sin(C);
            return Eo(
              e,
              [-0.55 + P * 1.2, Ln(-0.55 + P * 0.5) - 0.12, N * 1.2],
              [-P, 0, -N],
              1.2,
              0.01,
            );
          },
          0.55,
          Math.PI * 2 - 0.55,
          64,
        ),
      ));
    for (const C of [-0.25, 0.25])
      ie(
        E(
          (P) => {
            const N = Pn(e, P, C);
            return N ? N.p : null;
          },
          0.05,
          0.97,
          26,
        ),
      );
    (ie(
      E(
        (C) =>
          Eo(
            e,
            [0.74 + 0.14 * (1 - C * C), 2.8, C * 0.6],
            [0, -1, 0],
            2.3,
            0.01,
          ),
        -1,
        1,
        44,
      ),
    ),
      (X.stitch = q.flush(X.upperG)));
  }
}
{
  const e = pt.field(gs(), 0.16),
    t = (s, l, i) =>
      Math.max(
        e(s, va(s) + 0.045, i) - 0.025,
        Math.abs(l - (va(s) - 0.03)) - 0.03,
      ),
    o = pt.nets(t, [-1.36, 0.5 + Se, -0.6], [1.52, 0.95 + Se, 0.6], 0.02);
  pt.project(t, o.pos, 0.02);
  const n = pt.decimate(o.pos, o.idx, 520),
    a = new r.Mesh(ba(n, null, ["#6a452b"], 0.05, 9), Cs);
  ((Cs.vertexColors = !0),
    (a.castShadow = a.receiveShadow = !0),
    (X.sole = new r.Group()),
    X.sole.add(a),
    rt.add(X.sole));
}
{
  const e = new r.Shape(),
    t = 0.315,
    o = -0.945;
  (e.moveTo(_t + 0.01, -0.3),
    e.lineTo(o, -t),
    e.absarc(o, 0, t, -Math.PI / 2, -Math.PI * 1.5, !0),
    e.lineTo(_t + 0.01, 0.3),
    e.quadraticCurveTo(_t - 0.03, 0, _t + 0.01, -0.3));
  const n = yt - 0.06 - (Fe.top + 0.025) - 0.024,
    a = new r.ExtrudeGeometry(e, {
      depth: n,
      bevelEnabled: !0,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: 20,
    });
  (a.rotateX(Math.PI / 2), a.translate(0, yt - 0.06 - 0.012, 0));
  const s = a.attributes.position,
    l = yt - 0.06 - n;
  for (let c = 0; c < s.count; c++) {
    const f = He(0.9, 1, re((s.getY(c) - l) / n, 0, 1));
    (s.setX(c, o + 0.1 + (s.getX(c) - o - 0.1) * f), s.setZ(c, s.getZ(c) * f));
  }
  a.computeVertexNormals();
  const i = new r.Mesh(a, wi);
  ((i.castShadow = i.receiveShadow = !0),
    (X.heel = new r.Group()),
    X.heel.add(i),
    rt.add(X.heel));
}
const zs = (() => {
  const e = [],
    t = Fe.top,
    o = 0.14;
  for (let s = -1.5; s <= 1.2001; s += 0.05) e.push([s, xa(s)]);
  const n = [1.27, 0.05],
    a = [1.45, 0.4];
  for (let s = 0; s < 6; s++) {
    const l = s / 6,
      i = He(n[0], a[0], l),
      c = He(n[1], a[1], l);
    e.push([i - 0.012, c], [i + 0.05, c - 0.014]);
  }
  (e.push([1.47, 0.43], [1.45, 0.49], [1.39, t - 0.005], [1.33, t]),
    e.push([0.34, t], [0.27, t - 0.08], [0.2, 0.34], [0.15, o + 0.015]));
  for (let s = 0.12; s >= -0.6; s -= 0.06) e.push([s, xa(s) + o]);
  return (
    e.push([-0.65, o + 0.045], [-0.68, 0.34], [-0.62, t - 0.07], [-0.53, t]),
    e.push(
      [-1.22, t],
      [-1.3, t - 0.08],
      [-1.41, 0.36],
      [-1.49, 0.24],
      [-1.545, 0.17],
      [-1.57, 0.12],
      [-1.565, 0.07],
      [-1.545, xa(-1.545) + 0.004],
    ),
    e
  );
})();
{
  const e = new r.Shape(zs.map(([l, i]) => new r.Vector2(l, i))),
    t = (l, i, c, f, d) => {
      const h = new r.Path();
      return (
        h.moveTo(l + d, c),
        h.lineTo(i - d, c),
        h.absarc(i - d, c + d, d, -Math.PI / 2, 0, !1),
        h.lineTo(i, f - d),
        h.absarc(i - d, f - d, d, 0, Math.PI / 2, !1),
        h.lineTo(l + d, f),
        h.absarc(l + d, f - d, d, Math.PI / 2, Math.PI, !1),
        h.lineTo(l, c + d),
        h.absarc(l + d, c + d, d, Math.PI, Math.PI * 1.5, !1),
        h
      );
    };
  e.holes.push(
    t(0.44, 1.1, 0.22, 0.5, 0.09),
    t(-1.14, -0.84, 0.26, 0.5, 0.075),
  );
  const o = new r.ExtrudeGeometry(e, {
    depth: Fe.w - 0.012,
    bevelEnabled: !0,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 24,
  });
  o.translate(0, 0.006, -(Fe.w - 0.012) / 2);
  const n = new r.Mesh(o, sn);
  ((n.castShadow = n.receiveShadow = !0),
    (X.blade = new r.Group()),
    X.blade.add(n),
    Io.add(X.blade),
    (X.bladeGeo = o));
  const a = ve();
  (a
    .box(Ta, 0.83, Fe.top + 0.012, 0, 1.02, 0.025, 0.27, { r: 0.008 })
    .box(Ta, -0.87, Fe.top + 0.012, 0, 0.72, 0.025, 0.27, { r: 0.008 }),
    (X.plates = new r.Group()),
    a.flush(X.plates),
    Io.add(X.plates));
  const s = ve();
  X.screwXZ = [
    [0.45, 0.09],
    [0.45, -0.09],
    [0.85, 0.1],
    [0.85, -0.1],
    [1.22, 0.08],
    [1.22, -0.08],
    [-0.62, 0.09],
    [-0.62, -0.09],
    [-1.12, 0.09],
    [-1.12, -0.09],
  ];
  for (const [l, i] of X.screwXZ)
    s.cyl(Ta, l, Fe.top + 0.03, i, 0.017, 0.017, 0.012, { seg: 10 }).cyl(
      ue("#8d949e", { roughness: 0.35 }),
      l,
      Fe.top + 0.1,
      i,
      0.008,
      0.006,
      0.13,
      { seg: 6 },
    );
  ((X.screws = new r.Group()), s.flush(X.screws), Io.add(X.screws));
}
const bi = (e, t = 90) =>
    Object.assign(
      (o) => {
        ((o.vertexShader = o.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vSP;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vSP=position;`,
          )),
          (o.fragmentShader = o.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vSP;`,
            )
            .replace(
              "#include <color_fragment>",
              `#include <color_fragment>
  {vec3 q=floor(vSP*${t}.);float h=fract(sin(dot(q,vec3(12.9898,78.233,37.719)))*43758.5453);diffuseColor.rgb*=.72+.5*h*h;}`,
            )));
      },
      { key: e },
    ),
  Ls = (e, t) =>
    Xe(
      new r.MeshStandardMaterial({
        color: e,
        roughness: 0.95,
        envMapIntensity: 0.35,
        flatShading: !0,
      }),
      bi(t),
    );
X.layers = [];
{
  const e = X.boot.children[0].geometry,
    t = X.sole.children[0].geometry;
  for (const [o, n, a] of [
    [null, "sh", 1],
    ["#b98f5c", "fl0", 0.97],
    ["#3a3d44", "fl1", 0.95],
    ["#3552c4", "fl2", 0.93],
  ]) {
    const s = new r.Mesh(e, o ? Ls(o, n) : Ma);
    (s.scale.set(a, a, 0.3),
      (s.castShadow = !0),
      (s.visible = !1),
      rt.add(s),
      X.layers.push(s));
  }
  for (const [o, n] of [
    ["#232529", "in1"],
    ["#c9a36a", "in2"],
    ["#3d5fd6", "in3"],
  ]) {
    const a = new r.Mesh(t, Ls(o, n));
    (a.scale.set(0.97, 0.7, 0.95),
      (a.castShadow = !0),
      (a.visible = !1),
      rt.add(a),
      X.layers.push(a));
  }
}
const Ps = {
  upperG: [0.15, 1.25, 0],
  tongue: [0.3, 1.45, 0],
  pad: [0.15, 1.25, 0],
  sole: [0, 0.62, 0],
  heel: [0, 0.42, 0],
  screws: [0, 0.2, 0],
};
function _s(e) {
  for (const n in Ps) {
    const a = Ps[n];
    X[n].position.set(a[0] * e, a[1] * e, a[2] * e);
  }
  const t = X.layers,
    o = e > 0.02;
  t.forEach((n) => (n.visible = o));
  for (let n = 0; n < 4; n++) {
    const a = 4 - n;
    (t[n].position.set(
      -(0.45 + a * 0.4) * e,
      (1.25 - a * 0.04) * e + 0.02,
      -(0.08 + a * 0.1) * e,
    ),
      (t[n].rotation.z = (0.02 + a * 0.025) * e));
  }
  for (let n = 0; n < 3; n++)
    t[4 + n].position.set(0, (0.78 + n * 0.13) * e, 0);
}
const Wt = { skate: [-0.95, 1.5, -0.3], mini: [-7.2, 1.02, 0.4] };
{
  const e = ve(),
    t = vs;
  (e
    .box(ue("#252b35", { roughness: 0.34 }), 0, 0.16, -0.2, 17, 0.32, 3.4, {
      r: 0.05,
    })
    .box(le("#10141b"), 0, 0.03, -0.2, 16.7, 0.06, 3.1),
    e.flush(Ve));
  const o = new r.Mesh(new r.BoxGeometry(16.8, 0.035, 0.035), qe("#ffab55", 4));
  (o.position.set(0, 0.3, 1.52), Ve.add(o), Qt(0, 0.7, 2.4, "#ffab55", 5, 0.6));
  const n = ve();
  (n.box(ue("#252b35", { roughness: 0.34 }), 0, 0.07, 3.72, 15.4, 0.14, 0.7, {
    r: 0.03,
  }),
    n.flush(Ve));
  const a = new r.Mesh(new r.BoxGeometry(15.3, 0.025, 0.025), qe("#ffab55", 3));
  (a.position.set(0, 0.12, 4.08), Ve.add(a));
  const s = new r.Mesh(
    new r.BoxGeometry(2.9, 0.7, 1.9),
    new r.MeshPhysicalMaterial({
      color: "#e8f7ff",
      roughness: 0.06,
      metalness: 0,
      envMapIntensity: 1.4,
      clearcoat: 1,
      transparent: !0,
      opacity: 0.42,
      depthWrite: !1,
    }),
  );
  (s.position.set(Wt.mini[0], 0.67, Wt.mini[2]), Ve.add(s), Jt.push(s));
  const l = new r.Mesh(
    new r.BoxGeometry(2.94, 0.012, 1.94),
    qe("#9fe8ff", 1.6),
  );
  (l.position.set(Wt.mini[0], 1.02, Wt.mini[2]),
    Ve.add(l),
    (X.posts = [-1.1, 0.9].map((i) => {
      const c = new r.Mesh(
          new r.BoxGeometry(0.07, 1, 0.07),
          new r.MeshPhysicalMaterial({
            color: "#dff6ff",
            roughness: 0.08,
            metalness: 0,
            envMapIntensity: 1.4,
            transparent: !0,
            opacity: 0.5,
            depthWrite: !1,
          }),
        ),
        f = Wt.skate[1] - 0.32;
      return (
        c.position.set(Wt.skate[0] + i * nn, 0.32 + f / 2, Wt.skate[2]),
        (c.scale.y = f),
        Ve.add(c),
        Jt.push(c),
        c
      );
    })));
}
const rn = new r.Group();
Ve.add(rn);
{
  for (const e of [rt, Io])
    e.traverse((t) => {
      if (t.isMesh && !X.layers.includes(t)) {
        const o = new r.Mesh(t.geometry, t.material);
        (t.updateWorldMatrix(!0, !1), o.matrix.copy(t.matrix));
        let n = t.parent;
        const a = new r.Matrix4();
        for (; n && n !== rt && n !== Io;)
          (a.copy(n.matrix).multiply(o.matrix),
            o.matrix.copy(a),
            (n = n.parent));
        ((o.matrixAutoUpdate = !1), (o.castShadow = !0), rn.add(o));
      }
    });
  (rn.position.set(...Wt.mini),
    (rn.rotation.y = -0.5),
    rn.scale.setScalar(nn * 0.74));
}
const Ca = Xe(
    new r.MeshPhysicalMaterial({
      color: "#e6ebf2",
      metalness: 1,
      roughness: 0.34,
      roughnessMap: an,
      anisotropy: 0.25,
      envMapIntensity: 0.8,
    }),
    Rs,
  ),
  he = { x: 5.45, y: 2.05, z: 0.4, s: nn * 2.1, yaw: 2.55, r: 2.7 },
  Go = new r.Group(),
  ln = new r.Group();
(Go.add(ln), Ve.add(Go));
{
  const e = new r.Mesh(X.bladeGeo, Ca);
  ((e.castShadow = !0), ln.add(e));
  const t = X.plates.children[0],
    o = new r.Mesh(t.geometry, t.material);
  (ln.add(o),
    Go.position.set(he.x, he.y, he.z),
    (Go.rotation.y = -he.yaw),
    Go.scale.setScalar(he.s));
  const n = new r.Mesh(
    new r.CylinderGeometry(he.r, he.r + 0.08, he.y - 0.3, 40),
    le("#bcd6ea", { roughness: 0.12, envMapIntensity: 1.1, flatShading: !0 }),
  );
  (n.position.set(he.x, (he.y + 0.3) / 2, he.z),
    (n.castShadow = n.receiveShadow = !0),
    Ve.add(n));
  const a = new r.Mesh(new r.CircleGeometry(he.r - 0.01, 64), Ee.mat);
  ((a.rotation.x = -Math.PI / 2),
    a.position.set(he.x, he.y + 0.003, he.z),
    (a.receiveShadow = !0),
    Ve.add(a),
    bt.hide.push(a),
    (he.top = a));
}
function An(e, t, o, n) {
  const a = e.createLinearGradient(0, 0, 0, o);
  (a.addColorStop(0, "rgba(24,52,92,.92)"),
    a.addColorStop(1, "rgba(10,22,44,.92)"),
    (e.fillStyle = a),
    e.fillRect(0, 0, t, o),
    (e.strokeStyle = "rgba(150,225,255,.85)"),
    (e.lineWidth = 4),
    e.strokeRect(2, 2, t - 4, o - 4),
    (e.font = "600 26px DM Mono, monospace"),
    (e.letterSpacing = "4px"),
    (e.textAlign = "left"),
    (e.textBaseline = "top"),
    (e.fillStyle = "#9fd8f5"),
    e.fillText(n, 22, 18),
    (e.letterSpacing = "0px"));
}
function mo(e, t, o, n, a = "#e8f6ff", s = "left", l = 24) {
  ((e.font = `500 ${l}px DM Mono, monospace`),
    (e.textAlign = s),
    (e.textBaseline = "alphabetic"),
    (e.fillStyle = a),
    e.fillText(n, t, o));
}
function As(e, t, o, n, a, s) {
  const l = Math.atan2(u.vz, u.vx),
    i = Math.cos(l),
    c = Math.sin(l),
    f = Math.min(Q.count, a),
    d = 6;
  if (f < 2) return;
  const h = new Float32Array(f),
    w = new Float32Array(f),
    m = new Uint8Array(f);
  for (let p = 0; p < f; p++) {
    const x = (Q.head - 1 - p + Q.n) % Q.n,
      S = Q.x[x] - u.px,
      M = Q.z[x] - u.pz;
    ((h[p] = t + (-S * c + M * i) * n),
      (w[p] = o - (S * i + M * c) * n),
      (m[p] = Q.k[x] < -5 ? 1 : 0));
  }
  ((e.lineCap = "round"), (e.lineJoin = "round"));
  for (const p of [0, 1])
    for (let x = 0; x < d; x++) {
      const S = Math.floor((x * f) / d),
        M = Math.min(f - 1, Math.floor(((x + 1) * f) / d)),
        T = 1 - x / d;
      ((e.strokeStyle = p
        ? `rgba(175,240,255,${T.toFixed(3)})`
        : `rgba(60,190,255,${(T * 0.3).toFixed(3)})`),
        (e.lineWidth = p ? s : s * 3.4),
        e.beginPath(),
        e.moveTo(h[S], w[S]));
      for (let y = S + 1; y <= M; y++) e.lineTo(h[y], w[y]);
      e.stroke();
    }
  ((e.strokeStyle = "rgba(255,255,255,.92)"),
    (e.lineWidth = s * 1.7),
    e.beginPath());
  let v = !1;
  for (let p = 0; p < f; p++)
    m[p]
      ? (v ? e.lineTo(h[p], w[p]) : e.moveTo(h[p], w[p]), (v = !0))
      : (v = !1);
  e.stroke();
}
function yi(e, t, o) {
  An(e, t, o, "ROCKER");
  const n = t * 0.27,
    a = t * 0.5,
    s = o * 0.56;
  (e.save(),
    e.translate(a, s),
    (e.fillStyle = "rgba(215,228,240,.95)"),
    e.beginPath(),
    zs.forEach(([c, f], d) =>
      d ? e.lineTo(c * n, -f * n) : e.moveTo(c * n, -f * n),
    ),
    e.closePath(),
    e.fill());
  const l = 5,
    i = Fe.R / l;
  ((e.strokeStyle = "#7fe3ff"),
    (e.lineWidth = 3),
    e.setLineDash([10, 8]),
    e.beginPath());
  for (let c = -1.7; c <= 1.6; c += 0.05) {
    const f = i - Math.sqrt(Math.max(i * i - (c - Fe.xc) ** 2, 0));
    c > -1.69 ? e.lineTo(c * n, -f * n + 8) : e.moveTo(c * n, -f * n + 8);
  }
  (e.stroke(),
    e.setLineDash([]),
    e.restore(),
    mo(
      e,
      22,
      o - 26,
      `R ${B.R} m \xB7 drawn ${l}\xD7 more curved`,
      "#bfe6f7",
      "left",
      21,
    ));
}
function Es(e, t, o, n = u.M, a = u.lean, s = "EDGE, CUT ACROSS") {
  An(e, t, o, s);
  const l = t * 0.5,
    i = o * 0.63,
    c = o * 0.066,
    f = 8,
    d = B.rho * 1e3,
    h = (B.w / 2) * 1e3,
    w = d - Math.sqrt(d * d - h * h),
    m = n.d * 1e3 * f,
    v = n.two,
    p = v ? 0 : Math.sign(a) || 1,
    x = [];
  x.push([-h, (o * 0.52) / c]);
  for (let g = 0; g <= 20; g++) {
    const k = -h + (g / 20) * 2 * h;
    x.push([k, (w - (d - Math.sqrt(d * d - k * k))) * f]);
  }
  x.push([h, (o * 0.52) / c]);
  const S = (g, k) => {
    const L = g - p * h,
      _ = Math.cos(a),
      O = Math.sin(a);
    return [l + (L * _ + k * O) * c, i + (m - (-L * O + k * _)) * c];
  };
  ((e.fillStyle = "rgba(175,215,240,.25)"),
    e.fillRect(12, i, t - 24, o - i - 12));
  const M = () => {
    (e.beginPath(),
      x.forEach(([g, k], L) => {
        const [_, O] = S(g, k);
        L ? e.lineTo(_, O) : e.moveTo(_, O);
      }),
      e.closePath());
  };
  (M(),
    (e.fillStyle = "#dfe7f0"),
    e.fill(),
    (e.strokeStyle = "#8fa3b8"),
    (e.lineWidth = 2),
    e.stroke(),
    e.save(),
    e.beginPath(),
    e.rect(0, i, t, o),
    e.clip(),
    M(),
    (e.fillStyle = "#ffb454"),
    e.fill(),
    (e.strokeStyle = "rgba(255,170,80,.45)"),
    (e.lineWidth = 10),
    e.stroke(),
    e.restore(),
    (e.strokeStyle = "rgba(215,242,255,.95)"),
    (e.lineWidth = 3),
    e.beginPath(),
    e.moveTo(12, i),
    e.lineTo(t - 12, i),
    e.stroke());
  const [T, y] = S(p * h, 0);
  ((e.strokeStyle = "#ffc98a"),
    (e.lineWidth = 3),
    e.setLineDash([8, 7]),
    e.beginPath(),
    e.moveTo(T, y),
    e.lineTo(T, y - o * 0.46),
    e.stroke(),
    e.setLineDash([]),
    Math.abs(a) > 0.02 &&
      (e.beginPath(),
      e.arc(T, y, o * 0.3, -Math.PI / 2, -Math.PI / 2 + a, a < 0),
      e.stroke()),
    mo(
      e,
      T + (a >= 0 ? -12 : 12),
      y - o * 0.4,
      lo(a) + "\xB0",
      "#ffc98a",
      a >= 0 ? "right" : "left",
      26,
    ),
    mo(
      e,
      22,
      o - 58,
      v
        ? `both edges \xB7 ${(n.d * 1e3).toFixed(2)} mm deep`
        : `${za(a).toLowerCase()} \xB7 bites ${(n.d * 1e3).toFixed(2)} mm`,
      "#ffe2b8",
      "left",
      21,
    ),
    mo(
      e,
      22,
      o - 26,
      `4 mm blade \xB7 13 mm hollow \xB7 bite drawn ${f}\xD7`,
      "#bfe6f7",
      "left",
      21,
    ));
}
function Mi(e, t, o) {
  An(e, t, o, "THE CARVE, FROM ABOVE");
  const n = t * 0.5,
    a = o * 0.8,
    s = o * 0.052,
    l = Math.atan2(u.vz, u.vx),
    i = Math.cos(l),
    c = Math.sin(l);
  As(e, n, a, s, 320, 5);
  const f = (Math.sign(u.lean) * Math.sin(Math.abs(u.lean))) / B.R;
  ((e.strokeStyle = "rgba(255,196,120,.95)"),
    (e.lineWidth = 4),
    e.setLineDash([10, 9]),
    e.beginPath());
  for (let d = 0; d <= 9; d += 0.3) {
    const h = Math.abs(f) > 1e-5 ? Math.sin(f * d) / f : d,
      w = Math.abs(f) > 1e-5 ? (1 - Math.cos(f * d)) / f : 0;
    d ? e.lineTo(n + w * s, a - h * s) : e.moveTo(n, a);
  }
  (e.stroke(),
    e.setLineDash([]),
    (e.fillStyle = "#fff"),
    e.beginPath(),
    e.moveTo(n, a - 16),
    e.lineTo(n - 9, a + 6),
    e.lineTo(n + 9, a + 6),
    e.fill(),
    mo(
      e,
      22,
      o - 26,
      u.skid
        ? "skidding: the path smears"
        : `r = R / sin \u03B8 = ${js(u.M.r)}`,
      "#bfe6f7",
      "left",
      21,
    ));
}
function gi(e, t, o, n = u.M) {
  An(e, t, o, "CONTACT, FROM BELOW");
  const a = t * 0.5,
    s = o * 0.5,
    l = (t * 0.36) / 0.06,
    i = (o * 0.1) / 6e-4,
    c = (f, d, h) => {
      if (d <= 0) return;
      const w = e.createRadialGradient(f, s, 0, f, s, (d / 2) * l);
      (w.addColorStop(0, "rgba(255,245,220,1)"),
        w.addColorStop(0.35, "rgba(255,180,90,.95)"),
        w.addColorStop(0.75, "rgba(240,90,70,.8)"),
        w.addColorStop(1, "rgba(120,40,90,0)"),
        (e.fillStyle = w),
        e.beginPath(),
        e.ellipse(f, s, (d / 2) * l, Math.max(3, h * i), 0, 0, 7),
        e.fill());
    };
  (e.save(),
    e.translate(0, 0),
    n.two
      ? (e.translate(0, -o * 0.09),
        c(a, n.L, n.b),
        e.translate(0, o * 0.18),
        c(a, n.L2, n.b2))
      : c(a, n.L, n.b),
    e.restore(),
    mo(
      e,
      22,
      o - 58,
      `${(n.L * 100).toFixed(1)} cm \xD7 ${(n.b * 1e3).toFixed(2)} mm${n.two ? " \xD7 2" : ""}`,
      "#ffe2b8",
      "left",
      21,
    ),
    mo(
      e,
      22,
      o - 26,
      `\u2248 ${B.H / 1e6} MPa \xB7 melts ${n.dT.toFixed(1)} \xB0C lower`,
      "#bfe6f7",
      "left",
      21,
    ));
}
const Ra = [yi, Es, Mi, gi].map((e, t) => {
  const l = document.createElement("canvas");
  ((l.width = 660), (l.height = 390));
  const i = l.getContext("2d"),
    c = new r.CanvasTexture(l);
  ((c.colorSpace = r.SRGBColorSpace), (c.anisotropy = 8));
  const f = new r.Group();
  (f.position.set(-5.55 + t * 3.7, 0.14, 3.7),
    (f.rotation.x = -0.34),
    Ve.add(f));
  const d = new r.Mesh(
    new r.PlaneGeometry(3.3, 1.95),
    new r.MeshBasicMaterial({
      map: c,
      fog: !1,
      color: new r.Color(1.15, 1.15, 1.15),
    }),
  );
  ((d.position.y = 1.95 / 2 + 0.05), f.add(d));
  const h = new r.Mesh(
    new r.BoxGeometry(3.3 + 0.06, 0.05, 0.12),
    ue("#aab3bf", { roughness: 0.3 }),
  );
  return (
    (h.position.y = 0.03),
    f.add(h),
    {
      G: f,
      m: d,
      redraw() {
        (i.clearRect(0, 0, 660, 390), e(i, 660, 390), (c.needsUpdate = !0));
      },
    }
  );
});
let Ds = -1;
{
  const e = ma(1.72);
  (e.position.set(0.8, 0.14, 0.07), Ra[2].G.add(e));
}
{
  const e = ve(),
    t = ue("#b08a4e", { roughness: 0.3, metalness: 1, clearcoat: 0.6 }),
    o = new r.Shape(
      [
        [0, 0],
        [0.5, 0],
        [0.5, 0.06],
        [0, 0.26],
      ].map(([s, l]) => new r.Vector2(s, l)),
    ),
    n = new r.ExtrudeGeometry(o, {
      depth: 1.5,
      bevelEnabled: !0,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 1,
    });
  (n.rotateY(-Math.PI / 2),
    n.translate(0.75, 0, -0.25),
    e.geo(le("#dcd6cc", { roughness: 0.6 }), n, 0, 0, 0),
    e.flush(_o));
  const a = ma(1.35, { pale: !0 });
  ((a.rotation.x = -Math.atan2(0.2, 0.5)),
    a.position.set(0, 0.19, 0.12),
    _o.add(a),
    _o.position.set(4.3, 0, -2.2),
    (_o.rotation.y = -0.3),
    _o.scale.setScalar(0.8),
    to.add(_o));
}
const B = {
  R: 2.2,
  rho: 0.0127,
  w: 0.004,
  m: 55,
  g: 9.81,
  H: 3e7,
  Tice: -4,
  dTdp: 0.074,
  muG: 0.006,
  muS: 0.45,
  rF: 2.5,
};
((B.alpha = Math.asin(B.w / 2 / B.rho)),
  (B.hollow = B.rho - Math.sqrt(B.rho * B.rho - (B.w * B.w) / 4)));
const Si = (4 / 3) * Math.sqrt(2 * B.R);
function Ti(e, t) {
  const o = Math.abs(e),
    n = Math.sin(B.alpha + o),
    a = Math.max(Math.sin(B.alpha - o), 0.02),
    s = B.w * Math.sin(o),
    l = (h) => Si * (h ** 1.5 / n + (h > s ? (h - s) ** 1.5 / a : 0));
  let i = 0,
    c = 0.004;
  for (let h = 0; h < 40; h++) {
    const w = (i + c) / 2;
    B.H * l(w) < t ? (i = w) : (c = w);
  }
  const f = (i + c) / 2,
    d = Math.max(f - s, 0);
  return {
    d: f,
    d2: d,
    L: 2 * Math.sqrt(2 * B.R * f),
    L2: 2 * Math.sqrt(2 * B.R * d),
    b: f / n,
    b2: d / a,
    A: l(f),
    two: d > 1e-7,
  };
}
function Bo(e) {
  const t = Math.abs(e),
    o = Math.cos(t),
    n = t > 0.001 ? B.R / Math.sin(t) : 1 / 0,
    a = Math.sqrt((B.g * B.R) / o),
    s = (B.m * B.g) / o,
    l = Ti(e, s);
  return {
    th: e,
    a: t,
    r: n,
    v: a,
    F: s,
    ...l,
    grip: B.H * l.L * l.d,
    side: B.m * B.g * Math.tan(t),
    dT: (B.dTdp * B.H) / 1e6,
  };
}
const xt = (60 * Math.PI) / 180,
  Ht = [-0.52, 0, 0.52],
  Fs = ["Inside edge", "Flat", "Outside edge"],
  $t = [1, 0.25, 0.125],
  En = ["1\xD7", "\xBC\xD7", "\u215B\xD7"],
  za = (e) =>
    Math.abs(e) < 0.02 ? "Flat" : e < 0 ? "Inside edge" : "Outside edge",
  u = {
    lean: -0.52,
    leanT: -0.52,
    ts: 1,
    tsT: 1,
    ex: 0,
    exT: 0,
    simT: 0,
    px: 0,
    pz: 0,
    vx: 5,
    vz: 0,
    slip: 0,
    power: 0,
    skid: null,
    hold: null,
    M: null,
    since: 0,
  };
u.M = Bo(u.lean);
let qo = 0.016,
  La = 0.016,
  we = 0;
const ki = 1 / 240;
function Ci(e) {
  u.simT += e;
  const t = u.M;
  let o = u.vx,
    n = u.vz;
  const a = Math.hypot(o, n) || 1e-6,
    s = Math.atan2(n, o);
  let l = 0;
  if (u.skid) {
    const i = u.simT - u.skid.t0;
    ((l =
      u.skid.side * 0.9 * (i < 1.05 ? fo(0, 0.22, i) : 1 - fo(1.05, 1.45, i))),
      i > 1.6 && (u.skid = null));
  }
  if (
    ((u.slip += (l - u.slip) * (1 - Math.exp(-e * 14))),
    u.skid || Math.abs(u.slip) > 0.01)
  ) {
    const i = s + u.slip,
      c = Math.cos(i),
      f = Math.sin(i);
    let d = o * c + n * f,
      h = -o * f + n * c;
    const w = B.muS * B.g * e;
    ((u.power = B.muS * B.m * B.g * Math.abs(h)),
      (h = Math.abs(h) <= w ? 0 : h - Math.sign(h) * w),
      (d -= Math.sign(d) * B.muG * B.g * e),
      (o = d * c - h * f),
      (n = d * f + h * c));
  } else {
    u.power = 0;
    let i = (Math.sign(u.lean) * Math.sin(Math.abs(u.lean))) / B.R;
    if (u.hold) {
      const d = u.simT - u.hold.t0;
      ((i = He(i, u.hold.side / B.rF, fo(0, 0.2, d) * (1 - fo(1, 1.3, d)))),
        d > 1.35 && (u.hold = null));
    }
    const c = a + (t.v - a) * (1 - Math.exp(-e * 0.9)),
      f = s + c * i * e;
    ((o = Math.cos(f) * c), (n = Math.sin(f) * c));
  }
  ((u.vx = o), (u.vz = n), (u.px += o * e), (u.pz += n * e), zi());
}
let no = !1;
function Is(e) {
  ((u.lean += (u.leanT - u.lean) * (1 - Math.exp(-e * (no ? 16 : 4.5)))),
    (u.ts += (u.tsT - u.ts) * (1 - Math.exp(-e * 6))),
    (u.ex += (u.exT - u.ex) * (1 - Math.exp(-e * 2.8))),
    (u.M = Bo(u.lean)));
  const t = e * u.ts,
    o = Math.ceil(t / ki - 1e-6);
  for (let n = 0; n < o; n++) Ci(t / o);
  Ai(t);
}
const At = (e) => {
    u.leanT = re(e, -xt, xt);
  },
  cn = (e) => {
    (At(Ht[e]), Ct(Fs[e]));
  },
  fn = (e) => {
    u.tsT = $t[e];
  };
function dn(e) {
  if (u.skid || u.hold) return;
  const t = u.M,
    o = Math.hypot(u.vx, u.vz);
  e = e || Math.sign(u.lean) || 1;
  const n = (B.m * o * o) / B.rF;
  Math.sign(u.lean) === e && Math.abs(u.lean) > 0.05 && t.grip >= n
    ? ((u.hold = { t0: u.simT, side: e }),
      Ct(
        `The edge holds: ${Math.round(t.grip)} N of grip for ${Math.round(n)} N`,
      ))
    : ((u.skid = { t0: u.simT, side: e }),
      Ct(
        `Skid: ${Math.round(t.grip)} N of grip, the turn needs ${Math.round(n)} N`,
      ));
}
const ao = 0.5,
  z = { x: -0.2, y: ce.ice, z: -0.5, yaw: 2.45, cx: 0, cz: 0, r: ce.r, s: nn },
  vt = { c: 1, s: 0 };
function Pa() {
  const e = z.yaw - Math.atan2(u.vz, u.vx);
  ((vt.c = Math.cos(e)), (vt.s = Math.sin(e)));
  const t = 1 / Ee.tile / ao,
    o = vt.c,
    n = vt.s;
  Ee.M.set(
    o * t,
    n * t,
    u.px / Ee.tile - (o * z.x + n * z.z) * t,
    -n * t,
    o * t,
    u.pz / Ee.tile - (-n * z.x + o * z.z) * t,
    0,
    0,
    1,
  );
}
function Gs(e, t, o) {
  const n = (e - u.px) * ao,
    a = (t - u.pz) * ao;
  return (
    (o.x = z.x + vt.c * n - vt.s * a),
    (o.z = z.z + vt.s * n + vt.c * a),
    o
  );
}
function Ri(e, t, o) {
  const n = e - z.x,
    a = t - z.z;
  return (
    (o.x = u.px + (vt.c * n + vt.s * a) / ao),
    (o.z = u.pz + (-vt.s * n + vt.c * a) / ao),
    o
  );
}
const Q = {
  n: 1400,
  x: new Float32Array(1400),
  z: new Float32Array(1400),
  k: new Float32Array(1400),
  t: new Float32Array(1400),
  head: 0,
  count: 0,
  lx: 1e9,
  lz: 1e9,
};
function zi() {
  const e = u.px - Q.lx,
    t = u.pz - Q.lz;
  if (e * e + t * t < 0.0064) return;
  ((Q.lx = u.px), (Q.lz = u.pz));
  const o = Q.head;
  ((Q.x[o] = u.px),
    (Q.z[o] = u.pz),
    (Q.k[o] = u.skid || Math.abs(u.slip) > 0.08 ? -9 : u.lean),
    (Q.t[o] = u.simT),
    (Q.head = (o + 1) % Q.n),
    (Q.count = Math.min(Q.count + 1, Q.n)));
}
function Li() {
  if (Math.abs(u.px) < 400 && Math.abs(u.pz) < 400) return;
  const e = Math.round(u.px / Ee.tile) * Ee.tile,
    t = Math.round(u.pz / Ee.tile) * Ee.tile;
  ((u.px -= e), (u.pz -= t), (Q.lx -= e), (Q.lz -= t));
  for (let o = 0; o < Q.n; o++) ((Q.x[o] -= e), (Q.z[o] -= t));
  for (let o = 0; o < V.n; o++) V.st[o] === 2 && ((V.x[o] -= e), (V.z[o] -= t));
}
const V = {
    n: 1400,
    st: new Uint8Array(1400),
    x: new Float32Array(1400),
    y: new Float32Array(1400),
    z: new Float32Array(1400),
    vx: new Float32Array(1400),
    vy: new Float32Array(1400),
    vz: new Float32Array(1400),
    age: new Float32Array(1400),
    s: new Float32Array(1400),
    q: new Float32Array(1400 * 4),
    acc: 0,
    next: 0,
  },
  un = new r.BufferGeometry(),
  Dn = new Float32Array(1400 * 3),
  Bs = new Float32Array(1400);
(un.setAttribute(
  "position",
  new r.BufferAttribute(Dn, 3).setUsage(r.DynamicDrawUsage),
),
  un.setAttribute(
    "aSize",
    new r.BufferAttribute(Bs, 1).setUsage(r.DynamicDrawUsage),
  ));
const Fn = new r.ShaderMaterial({
    uniforms: { uScale: { value: 800 }, uLight: { value: 0 } },
    transparent: !0,
    depthWrite: !1,
    blending: r.AdditiveBlending,
    vertexShader:
      "attribute float aSize;uniform float uScale;varying float vA;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(aSize*uScale/max(-mv.z,.1),2.,40.);vA=clamp(aSize*uScale/max(-mv.z,.1)/1.5,.35,1.);gl_Position=projectionMatrix*mv;}",
    fragmentShader:
      "uniform float uLight;varying float vA;void main(){vec2 q=gl_PointCoord*2.-1.;float r=dot(q,q);if(r>1.)discard;float core=exp(-r*9.),halo=exp(-r*2.5)*.35;float a=(core+halo)*vA;if(uLight>.5)gl_FragColor=vec4(vec3(.62,.72,.82),a*.85);else gl_FragColor=vec4(vec3(1.5,1.75,2.)*a,1.);}",
  }),
  qs = new r.Points(un, Fn);
((qs.frustumCulled = !1), Zt.add(qs));
const so = { x: 0, z: 0 },
  Il = new r.Vector3(),
  hn = new r.Quaternion(),
  Gl = new r.Vector3(),
  Bl = new r.Matrix4(),
  Pi = new r.Euler();
function _i(e) {
  const t = V.next;
  ((V.next = (t + 1) % V.n), (V.st[t] = 1), (V.age[t] = 0));
  const o = z.yaw + u.slip,
    n = Math.cos(o),
    a = Math.sin(o),
    s = -a,
    l = n,
    i = Math.random(),
    c = Math.random() - 0.5,
    f = (e ? (Math.random() - 0.5) * 1.1 : -0.1 - Math.random() * 0.35) * z.s,
    d = e ? u.skid?.side || Math.sign(u.slip) || 1 : Math.sign(u.lean) || 1;
  ((V.x[t] = z.x + n * f - s * d * 0.03),
    (V.z[t] = z.z + a * f - l * d * 0.03),
    (V.y[t] = z.y + 0.02));
  let h, w, m;
  e
    ? ((h = 1.3 + i * 2.1),
      (w = (Math.random() - 0.3) * 0.9),
      (m = 1.6 + Math.random() * 2.2))
    : ((h = 0.25 + i * 0.9),
      (w = 0.9 + Math.random() * 1.8),
      (m = 2 + Math.random() * 2.6));
  const v = 0.24 * c;
  ((V.vx[t] = -s * d * h - n * w + -n * v * h),
    (V.vz[t] = -l * d * h - a * w + -a * v * h),
    (V.vy[t] = m),
    (V.s[t] = (0.014 + Math.random() ** 2 * 0.03) * z.s),
    hn.setFromEuler(
      Pi.set(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    ),
    V.q.set([hn.x, hn.y, hn.z, hn.w], t * 4));
}
function Ai(e) {
  if (e <= 0) return;
  const t = Math.hypot(u.vx, u.vz),
    o = Math.max(0, Math.abs(u.lean) - 0.3),
    n = u.power > 1;
  V.acc += (n ? u.power / 1.8 : o * t * 300) * e;
  let a = 0;
  for (; V.acc >= 1 && a++ < 80;) (V.acc--, _i(n));
  V.acc > 1 && (V.acc = 1);
  for (let s = 0; s < V.n; s++) {
    const l = V.st[s];
    if (l)
      if (((V.age[s] += e), l === 1)) {
        const i = Math.exp(-e * 1.1);
        ((V.vx[s] *= i),
          (V.vz[s] *= i),
          (V.vy[s] = V.vy[s] * i - 4.6 * e),
          (V.x[s] += V.vx[s] * e),
          (V.y[s] += V.vy[s] * e),
          (V.z[s] += V.vz[s] * e),
          V.y[s] <= z.y + 0.01 &&
            (Math.random() < (u.power > 1 ? 0.4 : 0.18)
              ? (Ri(V.x[s], V.z[s], so),
                (V.st[s] = 2),
                (V.x[s] = so.x),
                (V.z[s] = so.z),
                (V.age[s] = 0))
              : (V.st[s] = 0)));
      } else V.age[s] > 6 && (V.st[s] = 0);
  }
}
function Ei() {
  let e = 0;
  const t = z.r * z.r * 0.97;
  for (let n = 0; n < V.n; n++) {
    const a = V.st[n];
    if (!a) continue;
    let s = V.s[n],
      l,
      i,
      c;
    if (a === 1) ((l = V.x[n]), (i = V.y[n]), (c = V.z[n]));
    else {
      if (
        (Gs(V.x[n], V.z[n], so), (so.x - z.cx) ** 2 + (so.z - z.cz) ** 2 > t)
      ) {
        V.st[n] = 0;
        continue;
      }
      ((s *= 0.7 * (1 - fo(3.5, 6, V.age[n]))),
        (l = so.x),
        (i = z.y + 0.01),
        (c = so.z));
    }
    ((Dn[e * 3] = l),
      (Dn[e * 3 + 1] = i),
      (Dn[e * 3 + 2] = c),
      (Bs[e] = s),
      e++);
  }
  un.setDrawRange(0, e);
  const o = un.attributes;
  (o.position.clearUpdateRanges(),
    o.position.addUpdateRange(0, Math.max(e, 1) * 3),
    (o.position.needsUpdate = !0),
    o.aSize.clearUpdateRanges(),
    o.aSize.addUpdateRange(0, Math.max(e, 1)),
    (o.aSize.needsUpdate = !0),
    (Fn.uniforms.uScale.value =
      (Lt.clientHeight / (2 * Math.tan(r.MathUtils.degToRad(j.fov / 2)))) *
      se.getPixelRatio()));
}
function Di() {
  (Pa(), Li());
  {
    const t = Ht.findIndex((n) => Math.abs(n - u.leanT) < 0.02),
      o = xs.p.userData;
    t !== o.on && ((o.on = t), o.redraw(o.drawFn));
  }
  const e = Y.cur === "exploded";
  (Mt.scale.setScalar(e ? nn : z.s),
    e
      ? (Mt.position.set(...Wt.skate),
        (Mt.rotation.y = 0.3),
        (_n.rotation.y = 0),
        (Fo.rotation.x = 0),
        (ln.rotation.x = u.lean),
        (Go.rotation.y = -(he.yaw + u.slip)),
        _s(fo(0, 1, u.ex)),
        we - Ds > 0.12 && ((Ds = we), Ra.forEach((t) => t.redraw())))
      : (Mt.position.set(z.x, z.y, z.z),
        (Mt.rotation.y = -z.yaw),
        (_n.rotation.y = -u.slip),
        (Fo.rotation.x = u.lean),
        _s(0)),
    Ei(),
    fe.ready && Ii());
}
function Vs(e, t, o, n, a = {}) {
  const s = Ae,
    l = new r.Group();
  (l.position.set(e, t, 0.03), s.add(l));
  const i = new r.Mesh(
    fs(
      [
        [0, o * 0.97],
        [0.07, o * 0.97],
        [0.11, o * 1.02],
        [0.11, o * 1.13],
        [0.07, o * 1.19],
        [0, o * 1.19],
      ],
      72,
    ),
    ue("#c5cbd4", { roughness: 0.2, metalness: 1 }),
  );
  ((i.rotation.y = -Math.PI / 2), (i.castShadow = !0), l.add(i));
  const c = a.cw || 512,
    f = document.createElement("canvas");
  f.width = f.height = c;
  const d = f.getContext("2d"),
    h = new r.CanvasTexture(f);
  ((h.colorSpace = r.SRGBColorSpace), (h.anisotropy = 8));
  const w = new r.Mesh(
    new r.CircleGeometry(o * 0.975, 72),
    new r.MeshBasicMaterial({
      map: h,
      fog: !1,
      color: new r.Color(a.k || 1.25, a.k || 1.25, a.k || 1.25),
    }),
  );
  return (
    (w.position.z = 0.03),
    l.add(w),
    (l.userData = {
      face: w,
      redraw(m = 0) {
        (d.clearRect(0, 0, c, c),
          d.save(),
          d.beginPath(),
          d.arc(c / 2, c / 2, c / 2, 0, 7),
          d.clip(),
          n(d, c, m),
          d.restore(),
          (h.needsUpdate = !0));
      },
    }),
    l.userData.redraw(0),
    Lo.push(() => l.userData.redraw(we)),
    l
  );
}
function In(e, t, o, n, a, s = 2.6, l = !1) {
  const i = new r.Mesh(new r.TorusGeometry(t, 0.013, 6, 96, n - o), qe(a, s));
  if (((i.rotation.z = o), (i.position.z = 0.06), e.add(i), l))
    for (const [c, f] of [
      [o, -1],
      [n, 1],
    ]) {
      const d = new r.Mesh(new r.ConeGeometry(0.045, 0.1, 3), qe(a, s)),
        h = -Math.sin(c) * f,
        w = Math.cos(c) * f;
      (d.position.set(
        Math.cos(c) * t + h * 0.04,
        Math.sin(c) * t + w * 0.04,
        0.06,
      ),
        (d.rotation.z = Math.atan2(w, h) - Math.PI / 2),
        e.add(d));
    }
  return i;
}
const _a = { in: "#ffb454", out: "#7fe3ff", flat: "#eef2fa" },
  Os = (e) => (Math.abs(e) < 0.02 ? _a.flat : e < 0 ? _a.in : _a.out);
function Us(e, t, o) {
  ((e.fillStyle = o),
    e.beginPath(),
    e.moveTo(-0.32 * t, -0.62 * t),
    e.lineTo(0.02 * t, -0.62 * t),
    e.lineTo(0.05 * t, -0.2 * t),
    e.quadraticCurveTo(0.1 * t, -0.08 * t, 0.3 * t, -0.02 * t),
    e.quadraticCurveTo(0.46 * t, 0.02 * t, 0.47 * t, 0.12 * t),
    e.lineTo(0.47 * t, 0.18 * t),
    e.lineTo(-0.24 * t, 0.18 * t),
    e.lineTo(-0.26 * t, 0.12 * t),
    e.lineTo(-0.38 * t, 0.1 * t),
    e.lineTo(-0.36 * t, -0.1 * t),
    e.quadraticCurveTo(-0.34 * t, -0.35 * t, -0.32 * t, -0.62 * t),
    e.fill(),
    e.fillRect(-0.3 * t, 0.18 * t, 0.12 * t, 0.1 * t),
    e.fillRect(0.26 * t, 0.18 * t, 0.1 * t, 0.1 * t),
    e.fillRect(-0.4 * t, 0.27 * t, 0.86 * t, 0.04 * t),
    e.beginPath(),
    e.moveTo(0.46 * t, 0.2 * t),
    e.lineTo(0.52 * t, 0.25 * t),
    e.lineTo(0.47 * t, 0.31 * t),
    e.fill());
}
const fe = { ready: !1, drawnAt: 0, dialAt: 0, leanDrawn: 99 };
{
  ((Ae = Pt.L.g),
    pa(0, Pt.L.len - 0.34, { h: at * 0.84, y: at * 0.5 }),
    (fe.dialL = Vs(
      0.06,
      at * 0.52,
      0.42,
      (t, o) => {
        const n = t.createRadialGradient(
          o / 2,
          o * 0.45,
          0,
          o / 2,
          o / 2,
          o / 2,
        );
        (n.addColorStop(0, "#1a2b42"),
          n.addColorStop(1, "#0a111d"),
          (t.fillStyle = n),
          t.fillRect(0, 0, o, o),
          (t.strokeStyle = "#27405e"),
          (t.lineWidth = 3));
        for (let s = -6; s <= 6; s++) {
          const l = -Math.PI / 2 + s * 0.2;
          (t.beginPath(),
            t.moveTo(
              o / 2 + Math.cos(l) * o * 0.44,
              o / 2 + Math.sin(l) * o * 0.44,
            ),
            t.lineTo(
              o / 2 + Math.cos(l) * o * 0.4,
              o / 2 + Math.sin(l) * o * 0.4,
            ),
            t.stroke());
        }
        const a = -u.lean;
        ((t.strokeStyle = Os(u.lean)),
          (t.lineWidth = 7),
          t.beginPath(),
          t.moveTo(
            o / 2 + Math.sin(a) * o * 0.44,
            o / 2 - Math.cos(a) * o * 0.44,
          ),
          t.lineTo(
            o / 2 + Math.sin(a) * o * 0.36,
            o / 2 - Math.cos(a) * o * 0.36,
          ),
          t.stroke(),
          t.save(),
          t.translate(o / 2, o * 0.6),
          t.rotate(a),
          (t.globalAlpha = 0.25),
          Us(t, o * 0.54, "#5fc8ff"),
          (t.globalAlpha = 1),
          Us(t, o * 0.5, "#e8f0fa"),
          t.restore());
      },
      { cw: 384 },
    )),
    (fe.arcL = In(fe.dialL, 0.53, -0.5, Math.PI + 0.5, "#bfeaff", 2.4, !0)),
    In(fe.dialL, 0.47, Math.PI * 1.18, Math.PI * 1.82, "#ffb454", 2.4),
    (Ae = Pt.C.g),
    pa(0, Pt.C.len - 0.34, { h: at * 0.64, y: at * 0.6 }),
    (fe.slider = di(-1.62, 1.62, at * 0.64, { color: "#7fe3ff" })));
  const e = (t, o, n) => {
    const a = la(
      1.3,
      0.13,
      512,
      52,
      (s, l, i) => {
        ((s.font = "600 30px DM Mono, monospace"),
          (s.letterSpacing = "5px"),
          (s.textAlign = n),
          (s.textBaseline = "middle"),
          (s.fillStyle = "#8aa3bd"),
          s.fillText(
            o,
            n === "left" ? 4 : n === "right" ? l - 4 : l / 2,
            i / 2,
          ));
      },
      0.75,
      { alphaTest: 0.25 },
    );
    (a.position.set(t, at * 0.44, 0.045), Ae.add(a));
  };
  (e(-1.2, "OUTSIDE", "left"),
    e(0, "FLAT", "center"),
    e(1.2, "INSIDE", "right"),
    hi(0, 0.16, 1.02, { k: 0.8 }),
    (Ae = Pt.R.g),
    pa(0, Pt.R.len - 0.34, { h: at * 0.84, y: at * 0.5 }),
    (fe.dialR = Vs(-0.06, at * 0.52, 0.42, (t, o) => Fi(t, o), { cw: 384 })),
    In(fe.dialR, 0.53, Math.PI * 0.55, Math.PI * 1.45, "#ffb454", 2.6),
    (fe.arcR = In(
      fe.dialR,
      0.53,
      -Math.PI * 0.42,
      Math.PI * 0.42,
      "#dfe8f5",
      1.6,
    )),
    (Ae = Pt.C.g),
    (fe.ready = !0));
}
function Fi(e, t) {
  const o = e.createRadialGradient(t / 2, t * 0.45, 0, t / 2, t / 2, t / 2);
  (o.addColorStop(0, "#16263b"),
    o.addColorStop(1, "#080e19"),
    (e.fillStyle = o),
    e.fillRect(0, 0, t, t));
  const n = t / 2,
    a = t * 0.62,
    s = t * 0.043,
    l = Math.atan2(u.vz, u.vx),
    i = Math.cos(l),
    c = Math.sin(l);
  ((e.strokeStyle = "#1d3350"), (e.lineWidth = 2));
  for (const d of [0.18, 0.32, 0.46])
    (e.beginPath(), e.arc(t / 2, t / 2, t * d, 0, 7), e.stroke());
  As(e, n, a, s, 260, 6);
  const f = (Math.sign(u.lean) * Math.sin(Math.abs(u.lean))) / B.R;
  (e.setLineDash([10, 10]),
    (e.strokeStyle = "rgba(255,196,120,.9)"),
    (e.lineWidth = 4),
    e.beginPath());
  for (let d = 0; d <= 7; d += 0.25) {
    const h = Math.abs(f) > 1e-5 ? Math.sin(f * d) / f : d,
      w = Math.abs(f) > 1e-5 ? (1 - Math.cos(f * d)) / f : 0;
    d ? e.lineTo(n + w * s, a - h * s) : e.moveTo(n, a);
  }
  (e.stroke(),
    e.setLineDash([]),
    (e.fillStyle = "#ffffff"),
    e.beginPath(),
    e.arc(n, a, t * 0.018, 0, 7),
    e.fill(),
    (e.font = `500 ${Math.round(t * 0.066)}px DM Mono, monospace`),
    (e.textAlign = "center"),
    (e.fillStyle = u.tsT < 1 ? "#ffc27a" : "#7d93ad"),
    e.fillText(En[$t.indexOf(u.tsT)] ?? "1\xD7", t / 2, t * 0.9));
}
function Ii() {
  const e = (xt - u.lean) / (2 * xt),
    t = fe.slider;
  t.set(e);
  const o = (t.a + t.b) / 2,
    n = t.knob.position.x;
  ((t.fill.scale.x = Math.max(0.001, Math.abs(n - o))),
    (t.fill.position.x = (n + o) / 2),
    we - fe.dialAt > 0.1 &&
      ((fe.dialAt = we),
      Math.abs(u.lean - fe.leanDrawn) > 0.003 &&
        (fe.dialL.userData.redraw(we), (fe.leanDrawn = u.lean)),
      fe.dialR.userData.redraw(we)));
}
const Ns = { room: _e, bench: mt, stage: on, studioSet: to, exBase: Ve },
  Ws = {
    lab: {
      x: -0.59,
      y: ce.ice,
      z: 1.61,
      yaw: 1.9,
      cx: 0,
      cz: 0,
      r: ce.r,
      s: 1.08,
    },
    exploded: {
      x: he.x,
      y: he.y,
      z: he.z,
      yaw: he.yaw,
      cx: he.x,
      cz: he.z,
      r: he.r - 0.03,
      s: he.s,
    },
    studio: {
      x: -0.2,
      y: Ut.y,
      z: 0.45,
      yaw: 0.62,
      cx: 0,
      cz: 0,
      r: 2.62,
      s: 1.42,
    },
  },
  xo = {
    lab: {
      bg: "#10151f",
      fog: "#1a2130",
      fogD: 0.0065,
      tone: r.ACESFilmicToneMapping,
      exp: 1,
      env: "show",
      envI: 0.7,
      bloomT: 1.25,
      bloomS: 0.42,
      refl: 0.5,
      hemi: [9414360, 2501690, 0.55],
      sun: [16767412, 1.3],
      sunDir: [0.62, 0.62, 0.48],
      rim: 1.2,
      key2: 0.7,
      satK: 1.4,
      show: { room: 1, bench: 1, stage: 0, studioSet: 0, exBase: 0 },
      ex: 0,
      light: 0,
      veil: "#0b0f1a",
      iceR: 0.5,
    },
    exploded: {
      bg: "#07102a",
      fog: "#0a1638",
      fogD: 0.006,
      tone: r.ACESFilmicToneMapping,
      exp: 0.92,
      env: "show",
      envI: 0.8,
      bloomT: 1.25,
      bloomS: 0.45,
      refl: 0.4,
      hemi: [7311320, 1450042, 0.5],
      sun: [16765600, 1.5],
      sunDir: [0.5, 0.7, 0.5],
      rim: 1.3,
      key2: 0.6,
      satK: 1.35,
      show: { room: 0, bench: 0, stage: 1, studioSet: 0, exBase: 1 },
      ex: 1,
      light: 0,
      veil: "#081226",
      iceR: 0.45,
    },
    studio: {
      bg: "#f3ebe0",
      fog: "#f3ebe0",
      fogD: 0.0045,
      tone: r.NeutralToneMapping,
      exp: 0.96,
      env: "studio",
      envI: 0.62,
      bloomT: 2.6,
      bloomS: 0.18,
      refl: 0,
      hemi: [16185599, 13223101, 0.5],
      sun: [16774890, 3.4],
      sunDir: [-0.55, 0.75, 0.4],
      rim: 0.35,
      key2: 0.3,
      satK: 0.86,
      show: { room: 0, bench: 0, stage: 0, studioSet: 1, exBase: 0 },
      ex: 0,
      light: 1,
      veil: "#efe7dc",
      iceR: 0.35,
    },
  },
  Y = { cur: "lab", next: null, at: -99, out: -99, cam: null };
function Aa() {
  const e = xo[Y.cur];
  (Te.background.set(e.bg),
    Te.fog.color.set(e.fog),
    (Te.fog.density = e.fogD * R.fog),
    (se.toneMapping = e.tone),
    (se.toneMappingExposure = R.exposure * e.exp),
    (Te.environment = Bt[e.env]),
    (Te.environmentIntensity = R.env * e.envI),
    (sn.envMap = Ca.envMap = e.light ? Bt.steelLight : Bt.steel),
    sn.color.set(e.light ? "#eceef0" : "#eef2f7"),
    (sn.envMapIntensity = e.light ? 0.95 : 1.25),
    Ma.color.set(e.light ? "#fbf4ea" : "#f4f6fa"),
    (sn.needsUpdate = Ca.needsUpdate = !0),
    (Vt.threshold = R.bloomThreshold * e.bloomT),
    (Vt.strength = R.bloomStrength * e.bloomS),
    (Er.uReflStrength.value = R.reflect * e.refl),
    Mn.color.set(e.hemi[0]),
    Mn.groundColor.set(e.hemi[1]),
    (Mn.intensity = e.hemi[2] * R.fill),
    Re.color.set(e.sun[0]),
    (Re.intensity = e.sun[1] * R.sun),
    Re.position
      .set(...e.sunDir)
      .normalize()
      .multiplyScalar(30),
    (oa.intensity = e.rim * R.rim),
    (na.intensity = e.key2 * R.fill),
    (Ya.value = R.sat * e.satK));
  for (const t in Ns) Ns[t].visible = !!e.show[t];
  (ge.setLight(e.light),
    (Fn.uniforms.uLight.value = e.light ? 1 : 0),
    (Fn.blending = e.light ? r.NormalBlending : r.AdditiveBlending),
    ta.classList.toggle("light", !!e.light),
    Object.assign(z, Ws[Y.cur]),
    (bt.P.y = z.y),
    (bt.U.uReflStrength.value = R.reflect * e.iceR),
    (zo.on = e.refl > 0),
    qa.forEach((t) =>
      t.classList.toggle("on", t.dataset.v === (Y.next || Y.cur)),
    ));
}
function ro(e, t = !1, o = null) {
  if (xo[e]) {
    if (t) {
      ((Y.cur = e),
        (Y.next = null),
        Aa(),
        (u.exT = u.ex = xo[e].ex),
        No(o || Xt[e]));
      return;
    }
    if (e === Y.cur && !Y.next) {
      o && No(o);
      return;
    }
    ((Y.next = e),
      (Y.at = we),
      (Y.cam = o),
      (K("#veil").style.background = xo[e].veil),
      qa.forEach((n) => n.classList.toggle("on", n.dataset.v === e)));
  }
}
function Gi() {
  const e = K("#veil");
  let t = 0;
  if (Y.next) {
    const o = we - Y.at;
    ((t = re(o / 0.2, 0, 1)),
      o >= 0.2 &&
        ((Y.cur = Y.next),
        (Y.next = null),
        Aa(),
        (u.exT = xo[Y.cur].ex),
        No(Y.cam || Xt[Y.cur]),
        (Y.cam = null),
        (Y.out = we),
        (t = 1)));
  } else t = 1 - re((we - Y.out) / 0.4, 0, 1);
  e.style.opacity = t.toFixed(3);
}
const Oe = { edge: Rn(), radius: Rn(), bite: Rn(), angle: Rn() },
  ne = new r.Vector3(),
  be = new r.Vector3(),
  Ke = new r.Vector3(),
  vo = { x: 0, z: 0 },
  Bi = new r.Color(0.34, 1.1, 2.2),
  qi = new r.Color(1.25, 1.3, 1.4),
  Hs = new r.Color(1.5, 1, 0.5),
  $s = new r.Color(1.9, 1.55, 1.05),
  ql = new r.Color(),
  wo = { radius: 1, bite: 0 };
function Ea(e, t, o = 0) {
  const n = e - z.cx,
    a = t - z.cz;
  return n * n + a * a < (z.r - o) * (z.r - o);
}
function Vi(e) {
  ge.begin();
  const t = z.y + 0.006,
    o = xo[Y.cur].light,
    n = !0;
  if (n) {
    let l = 0,
      i = 0,
      c = 0,
      f = !1;
    for (let g = 0; g < Q.count; g++) {
      const k = (Q.head - 1 - g + Q.n) % Q.n;
      Gs(Q.x[k], Q.z[k], vo);
      const L = Ea(vo.x, vo.z, 0.04);
      if (f && L) {
        const _ = u.simT - Q.t[k],
          O = Q.k[k] < -5 || c < -5,
          H = (O ? 0.6 : 1.05) * Math.exp(-_ / 9) + 0.28;
        (ne.set(l, t, i), be.set(vo.x, t, vo.z));
        const G = me(ne, 24),
          b = me(be, 24);
        ge.seg(ne, be, G, b, O ? qi : Bi, H, H);
      }
      ((l = vo.x), (i = vo.z), (c = Q.k[k]), (f = L));
    }
    const d = u.M,
      h = z.yaw + u.slip,
      w = Math.cos(h),
      m = Math.sin(h),
      v = -m,
      p = w,
      x = d.L * 10 * z.s,
      S = Fe.w * 0.5 * z.s,
      M = Math.sign(u.lean) * Math.cos(u.lean) * S;
    for (const [g, k] of d.two
      ? [
          [-S, d.L2 * 10 * z.s],
          [S, d.L2 * 10 * z.s],
        ]
      : [[M, x]]) {
      const L = z.x + v * g,
        _ = z.z + p * g;
      (ne.set(L - (w * k) / 2, t, _ - (m * k) / 2),
        be.set(L + (w * k) / 2, t, _ + (m * k) / 2),
        Ke.set(L, t, _),
        ge.seg(ne, Ke, me(ne, 1), me(Ke, 4.5), $s, 0.2, 1),
        ge.seg(Ke, be, me(Ke, 4.5), me(be, 1), $s, 1, 0.2));
    }
    const T = Math.abs(u.lean) > 0.035 && !u.skid ? Math.sign(u.lean) : 0,
      y = d.r * ao;
    if (
      ((Oe.radius.userData.want = Nt && T && wo.radius ? 1 : 0), T && wo.radius)
    ) {
      const g = z.yaw,
        k = -Math.sin(g) * T,
        L = Math.cos(g) * T,
        _ = z.x + k * y,
        O = z.z + L * y;
      let H = 0;
      for (let b = 0.12; b < y - 0.05; b += 0.22) {
        const q = Math.min(b + 0.12, y);
        if (!Ea(z.x + k * q, z.z + L * q, 0.1)) break;
        (ne.set(z.x + k * b, t + 0.002, z.z + L * b),
          be.set(z.x + k * q, t + 0.002, z.z + L * q),
          ge.seg(ne, be, me(ne, 1.4), me(be, 1.4), Hs, 0.8, 0.8),
          (H = q));
      }
      const G = Ea(_, O, 0.15);
      if (G)
        for (let b = 0; b < 24; b++) {
          const q = (b / 24) * 6.283,
            ee = ((b + 0.6) / 24) * 6.283;
          (ne.set(_ + Math.cos(q) * 0.1, t + 0.002, O + Math.sin(q) * 0.1),
            be.set(_ + Math.cos(ee) * 0.1, t + 0.002, O + Math.sin(ee) * 0.1),
            ge.seg(ne, be, me(ne, 1.4), me(be, 1.4), Hs, 0.9, 0.9));
        }
      (Oe.radius.userData.set("Carve radius", js(d.r), "#ffb454"),
        ho(
          Oe.radius,
          ne.set(G ? _ : z.x + k * H, t + 0.02, G ? O : z.z + L * H),
          19,
          0.9,
        ));
    } else ho(Oe.radius, ne.set(z.x, t, z.z), 19, 0.9);
  }
  ge.end();
  const a = u.M,
    s = Math.round((Math.abs(u.lean) * 180) / Math.PI);
  (Oe.edge.userData.set(
    u.skid ? "Skidding" : za(u.lean),
    u.skid ? Math.round(Math.hypot(u.vx, u.vz) * 3.6) + " km/h" : s + "\xB0",
    u.skid ? "#ff6b86" : Os(u.lean),
  ),
    (Oe.edge.userData.want = Nt && Y.cur !== "exploded" ? 1 : 0),
    Y.cur === "exploded"
      ? ln.localToWorld(ne.set(-0.2, 0.75, 0))
      : Fo.localToWorld(ne.set(-0.55, 2.35 + Se, 0)),
    ho(Oe.edge, ne, 20, 0.9),
    Oe.bite.userData.set(
      a.two ? "Two edges" : "Edge bite",
      (a.d * 1e3).toFixed(2) + " mm \xB7 " + (a.L * 100).toFixed(1) + " cm",
      "#ff9d5c",
    ),
    (Oe.bite.userData.want = Nt && wo.bite && n ? 1 : 0),
    ho(Oe.bite, ne.set(z.x, z.y + 0.02, z.z), 18, -1.2),
    Ui());
}
const Oi = (() => {
    const t = document.createElement("canvas");
    t.width = t.height = 512;
    const o = t.getContext("2d"),
      n = new r.CanvasTexture(t);
    n.colorSpace = r.SRGBColorSpace;
    const a = new r.Mesh(
      new r.CircleGeometry(0.5, 72),
      new r.MeshBasicMaterial({
        map: n,
        transparent: !0,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        opacity: 0,
      }),
    );
    ((a.renderOrder = 11), (a.frustumCulled = !1), Ko.add(a));
    const s = new r.Mesh(
      new r.RingGeometry(0.5, 0.52, 72),
      new r.MeshBasicMaterial({
        color: new r.Color(1.1, 1.5, 1.8),
        transparent: !0,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        opacity: 0,
      }),
    );
    return (
      (s.renderOrder = 12),
      a.add(s),
      { m: a, ring: s, g: o, t: n, cw: 512, a: 0, at: -1 }
    );
  })(),
  Vo = new r.Vector3(),
  io = new r.Vector3(),
  Gn = new r.Vector3();
function Ui() {
  const e = Oi,
    t = Nt && (wo.bite || u.tsT < 1) && Y.cur !== "exploded" ? 1 : 0;
  if (
    ((e.a += (t - e.a) * (1 - Math.exp(-qo * 6))),
    (e.m.visible = e.a > 0.02),
    (e.m.material.opacity = e.a),
    (e.ring.material.opacity = e.a * 0.9),
    e.m.visible)
  ) {
    if (we - e.at > 0.066) {
      e.at = we;
      const f = e.g,
        d = e.cw;
      (f.clearRect(0, 0, d, d),
        f.save(),
        f.beginPath(),
        f.arc(d / 2, d / 2, d / 2 - 2, 0, 7),
        f.clip(),
        f.translate(0, d * 0.12),
        Es(f, d, d * 0.78, u.M, u.lean, "THE EDGE, \xD730"),
        f.restore(),
        (e.t.needsUpdate = !0));
    }
    Vo.set(z.x, z.y, z.z).project(j);
    const n = Lt.clientHeight,
      a = Lt.clientWidth,
      s = Math.min(230, n * 0.3);
    let l = Vo.x - ((s * 1.05) / a) * 2,
      i = Vo.y - ((s * 0.55) / n) * 2;
    (i - (s / 2 / n) * 2 < -0.95 && (i = Vo.y + ((s * 0.75) / n) * 2),
      l - (s / 2 / a) * 2 < -0.95 && (l = Vo.x + ((s * 1.05) / a) * 2),
      io.set(l, i, Vo.z).unproject(j),
      e.m.position.copy(io),
      e.m.quaternion.copy(j.quaternion));
    const c = me(io, s) * 2;
    (e.m.scale.setScalar(c),
      ge.begin(!0),
      Gn.set(z.x, z.y + 0.01, z.z),
      be.copy(io).sub(Gn).normalize(),
      Ke.copy(io).addScaledVector(be, -c * 0.52),
      ge.seg(Gn, Ke, me(Gn, 1), me(Ke, 1), Xs, 0.9 * e.a, 0.9 * e.a),
      ge.end(!0));
  }
  const o = Y.cur === "exploded" || wo.bite;
  if (
    ((Oe.angle.userData.want = Nt && o && Math.abs(u.lean) > 0.03 ? 1 : 0), o)
  ) {
    ge.begin(!0);
    const n = z.yaw + u.slip,
      a = -Math.sin(n),
      s = Math.cos(n),
      l = u.lean,
      i = (Y.cur === "exploded" ? 1.05 : 0.9) * z.s,
      c = i * 0.62,
      f = z.x,
      d = z.y + 0.01,
      h = z.z,
      w = (x, S, M, T, y, g) => {
        for (let k = 0; k < 9; k++) {
          const L = (k / 9) * T,
            _ = ((k + 0.55) / 9) * T;
          (ne.set(f + x * L, d + S * L, h + M * L),
            be.set(f + x * _, d + S * _, h + M * _),
            ge.seg(ne, be, me(ne, 1.3), me(be, 1.3), y, g, g));
        }
      };
    w(0, 1, 0, i, Bn, 0.9);
    const m = a * Math.sin(l),
      v = Math.cos(l),
      p = s * Math.sin(l);
    if ((w(m, v, p, i, Xs, 0.9), Math.abs(l) > 0.03)) {
      for (let y = 0; y < 16; y++) {
        const g = (l * y) / 16,
          k = (l * (y + 1)) / 16;
        (ne.set(
          f + a * Math.sin(g) * c,
          d + Math.cos(g) * c,
          h + s * Math.sin(g) * c,
        ),
          be.set(
            f + a * Math.sin(k) * c,
            d + Math.cos(k) * c,
            h + s * Math.sin(k) * c,
          ),
          ge.seg(ne, be, me(ne, 2), me(be, 2), Bn, 1, 1));
      }
      const S = l,
        M = l - Math.sign(l) * 0.16;
      Ke.set(
        f + a * Math.sin(S) * c,
        d + Math.cos(S) * c,
        h + s * Math.sin(S) * c,
      );
      for (const y of [0.88, 1.12])
        (ne.set(
          f + a * Math.sin(M) * c * y,
          d + Math.cos(M) * c * y,
          h + s * Math.sin(M) * c * y,
        ),
          ge.seg(ne, Ke, me(ne, 2), me(Ke, 2), Bn, 1, 1));
      Oe.angle.userData.set(lo(l) + "\xB0", za(l).toLowerCase(), "#ffb454");
      const T = l * 0.5;
      ho(
        Oe.angle,
        ne.set(
          f + a * Math.sin(T) * c * 1.35,
          d + Math.cos(T) * c * 1.35,
          h + s * Math.sin(T) * c * 1.35,
        ),
        17,
      );
    } else ho(Oe.angle, ne.set(f, d + c, h), 17);
    ge.end(!0);
  } else ho(Oe.angle, ne.set(z.x, z.y, z.z), 17);
  if (Y.cur === "exploded" && u.ex > 0.2) {
    ge.begin(!0);
    const n = fo(0.2, 1, u.ex);
    for (const a of [-0.95, 0.83]) {
      (Mt.localToWorld(ne.set(a, Fe.top, 0)),
        Mt.localToWorld(be.set(a, yt + 1.3, 0)));
      for (let s = 0; s < 14; s++) {
        const l = s / 14,
          i = (s + 0.55) / 14;
        (Ke.lerpVectors(ne, be, l),
          io.lerpVectors(ne, be, i),
          ge.seg(Ke, io, me(Ke, 1.2), me(io, 1.2), Bn, 0.8 * n, 0.8 * n));
      }
    }
    ge.end(!0);
  }
}
const Xs = new r.Color(1.1, 1.5, 1.9),
  Bn = new r.Color(1.6, 0.95, 0.4),
  js = (e) => (!isFinite(e) || e > 99 ? "straight" : e.toFixed(1) + " m"),
  Xt = {
    lab: {
      t: [-0.44, 1.62, 1.66],
      yaw: 0.076,
      pitch: 0.147,
      dist: 20.7,
      fov: 19.6,
      f: [-0.59, 2.5, 1.61],
      r: 9,
      fit: [11.4, 7.1],
    },
    exploded: {
      t: [-0.3, 3.1, 0.6],
      yaw: 0.04,
      pitch: 0.16,
      dist: 24,
      fov: 24,
      f: [-1, 3, 0],
      r: 8,
      fit: [18, 10],
    },
    studio: {
      t: [-0.05, 1.3, 0.3],
      yaw: 0.02,
      pitch: 0.23,
      dist: 9.3,
      fov: 30,
      f: [-0.2, 1.4, 0.45],
      r: 4.5,
      fit: [7.95, 4.97],
    },
  },
  Ys = { t: [-0.5, 2.75, 1.1], yaw: 0.06, pitch: 0.22, dist: 17 },
  J = { t: new r.Vector3(0, 3, 0), yaw: 0, pitch: 0.2, dist: 15, fov: 30 };
let qn = 4,
  gt = 1,
  Vn = 1,
  Oo = !1,
  wt = !1,
  Vl = !1,
  Da = [14.6, 6.4],
  Ks = 15;
const it = se.domElement,
  bo = new Map();
let On = 0,
  Uo = null,
  St = null,
  Fa = null;
const Un = new r.Raycaster(),
  Nn = new r.Vector2();
function No(e) {
  const t = Oo && j.aspect < 0.8 && e === Xt.lab ? { ...e, ...Ys } : e;
  (J.t.set(...t.t),
    (J.yaw = t.yaw),
    (J.pitch = t.pitch),
    (J.dist = t.dist),
    (J.fov = t.fov || 30),
    Ro.set(...t.f),
    (qn = t.r),
    t.fit && ((Da = t.fit), (Ks = t.dist)),
    (gt = 1),
    (wt = !1),
    ur());
}
const Zs = [],
  Et = (e, t, o = {}) => {
    ((e.userData.hk = { kind: t, ...o }), Zs.push(e));
  };
function Wn(e) {
  const t = it.getBoundingClientRect();
  (Nn.set(
    ((e.clientX - t.left) / t.width) * 2 - 1,
    -(((e.clientY - t.top) / t.height) * 2 - 1),
  ),
    Un.setFromCamera(Nn, j));
  const o = Un.intersectObjects(
    Zs.filter((n) => n.visible && Ni(n)),
    !1,
  )[0];
  return o
    ? { ...o.object.userData.hk, point: o.point, dist: o.distance }
    : null;
}
const Ni = (e) => {
    let t = e;
    for (; t.parent; t = t.parent) if (!t.visible) return !1;
    return t === Te && t.visible;
  },
  Ol = (e) => {
    ((u.exT = e ? 1 : 0), vn(!0));
  },
  Qs = new r.Vector3();
function Wi() {
  return (
    Qs.set(-Math.sin(z.yaw), 0, Math.cos(z.yaw)).applyQuaternion(
      Zo.copy(j.quaternion).invert(),
    ),
    Qs.x >= 0 ? 1 : -1
  );
}
const Hi = () => {
    const e = Ht.findIndex((t) => Math.abs(t - u.leanT) < 0.02);
    cn(e < 0 ? 1 : (e + 1) % 3);
  },
  $i = () => {
    const e = $t.indexOf(u.tsT);
    (fn((e + 1) % 3),
      Ct(u.tsT < 1 ? "Slow motion " + En[$t.indexOf(u.tsT)] : "Real time"));
  };
function Xi(e) {
  if (e)
    switch (e.kind) {
      case "skate":
        Y.cur === "lab" ? ro("exploded") : Y.cur === "exploded" && ro("lab");
        break;
      case "dialL":
        Hi();
        break;
      case "dialR":
        $i();
        break;
      case "holo":
        cn(e.i);
        break;
      case "chev":
        At(u.leanT - (e.d * 5 * Math.PI) / 180);
        break;
      case "ice": {
        const t = -Math.sin(z.yaw),
          o = Math.cos(z.yaw),
          n = (e.point.x - z.x) * t + (e.point.z - z.z) * o >= 0 ? 1 : -1;
        dn(n);
        break;
      }
      case "link":
        window.open(Tr, "_blank", "noopener");
        break;
    }
}
const Js = {
    skate: () =>
      Y.cur === "studio"
        ? "Drag sideways to lean"
        : "Drag sideways to lean \xB7 click to " +
          (Y.cur === "lab" ? "take it apart" : "put it back"),
    dialL: () => "Drag to lean \xB7 click for the next edge",
    dialR: () => "Slow motion: " + En[($t.indexOf(u.tsT) + 1) % 3],
    holo: (e) => Fs[e.i],
    slider: () => "Drag to lean: outside \u2190 flat \u2192 inside",
    chev: (e) => (e.d < 0 ? "Lean outside" : "Lean inside"),
    ice: () => "Force a turn this way",
    link: () => "@RYANSAEL on X",
  },
  yo = K("#tip");
let pn = null,
  Tt = null;
function ji(e) {
  const t = Wn(e),
    o = t?.kind === "link" ? t.L : null;
  (o !== pn && (pn?.over(!1), o?.over(!0), (pn = o)),
    (it.style.cursor = t
      ? t.kind === "slider" || t.kind === "skate" || t.kind === "dialL"
        ? "ew-resize"
        : "pointer"
      : ""));
  const n = t && Js[t.kind] ? Js[t.kind](t) : "";
  n
    ? ((yo.textContent = n),
      (yo.style.left = e.clientX + "px"),
      (yo.style.top = e.clientY + "px"),
      yo.classList.add("on"))
    : yo.classList.remove("on");
}
(it.addEventListener("contextmenu", (e) => e.preventDefault()),
  it.addEventListener("pointerleave", () => {
    (pn?.over(!1),
      (pn = null),
      yo.classList.remove("on"),
      (it.style.cursor = ""));
  }));
const er = () => {
  const e = fe.slider.fromRay(Un);
  e != null && At((1 - e * 2) * xt);
};
(it.addEventListener("pointerdown", (e) => {
  Ie();
  try {
    it.setPointerCapture(e.pointerId);
  } catch {}
  (yo.classList.remove("on"),
    bo.set(e.pointerId, [e.clientX, e.clientY, e.button === 2 || e.shiftKey]),
    (Uo = null));
  const t = e.button === 0 && !e.shiftKey && bo.size === 1 ? Wn(e) : null;
  ((Fa = t),
    (St =
      e.button === 0 && !e.shiftKey
        ? [e.clientX, e.clientY, performance.now()]
        : null),
    (Tt = null),
    t?.kind === "slider"
      ? ((Tt = "slider"), (no = !0), er())
      : (t?.kind === "skate" || t?.kind === "dialL") &&
        (Tt = {
          x: e.clientX,
          l0: u.leanT,
          s: t.kind === "dialL" ? -1 : Wi(),
        }));
}),
  it.addEventListener("pointermove", (e) => {
    const t = bo.get(e.pointerId);
    if (!t) {
      ji(e);
      return;
    }
    const o = e.clientX - t[0],
      n = e.clientY - t[1];
    if (((t[0] = e.clientX), (t[1] = e.clientY), Tt === "slider")) {
      const a = it.getBoundingClientRect();
      (Nn.set(
        ((e.clientX - a.left) / a.width) * 2 - 1,
        -(((e.clientY - a.top) / a.height) * 2 - 1),
      ),
        Un.setFromCamera(Nn, j),
        er());
      return;
    }
    if (Tt && Math.abs(e.clientX - Tt.x) > 4) {
      ((St = null), (no = !0), At(Tt.l0 + (e.clientX - Tt.x) * 0.0055 * Tt.s));
      return;
    }
    if (
      !Tt &&
      (St &&
        Math.hypot(e.clientX - St[0], e.clientY - St[1]) > 6 &&
        (St = null),
      !St)
    ) {
      if (((wt = !0), bo.size === 2)) {
        const [a, s] = [...bo.values()],
          l = Math.hypot(a[0] - s[0], a[1] - s[1]),
          i = [(a[0] + s[0]) / 2, (a[1] + s[1]) / 2];
        (On && (gt = re((gt * On) / l, 0.3, 2.2)),
          (On = l),
          Uo && Ia(i[0] - Uo[0], i[1] - Uo[1]),
          (Uo = i));
        return;
      }
      t[2]
        ? Ia(o, n)
        : ((J.yaw -= o * 0.004),
          (J.pitch = re(J.pitch + n * 0.003, -0.05, 1.35)));
    }
  }));
const tr = (e) => {
  (St && bo.size === 1 && performance.now() - St[2] < 450 && !no && Xi(Fa),
    (St = null),
    (Fa = null),
    (no = !1),
    (Tt = null),
    bo.delete(e.pointerId),
    (On = 0),
    (Uo = null));
};
(it.addEventListener("pointerup", tr),
  it.addEventListener("pointercancel", (e) => {
    ((St = null), tr(e));
  }),
  Mt.traverse((e) => {
    e.isMesh && Et(e, "skate");
  }),
  fe.dialL.traverse((e) => {
    e.isMesh && Et(e, "dialL");
  }),
  fe.dialR.traverse((e) => {
    e.isMesh && Et(e, "dialR");
  }),
  Et(fe.slider.hit, "slider"),
  fe.slider.knob.children.forEach((e) => Et(e, "slider")),
  Et(fe.slider.chevL.userData.hit, "chev", { d: -1 }),
  Et(fe.slider.chevR.userData.hit, "chev", { d: 1 }),
  Et(Ee.mesh, "ice"),
  xs.pads.forEach((e) => Et(e, "holo", { i: e.userData.edge })),
  ws.forEach((e) => Et(e.hit, "link", { L: e })));
function Ia(e, t) {
  const o =
      (j.position.distanceTo(J.t) *
        2 *
        Math.tan(r.MathUtils.degToRad(j.fov / 2))) /
      Math.max(Lt.clientHeight, 1),
    n = Math.cos(J.yaw),
    a = Math.sin(J.yaw);
  ((wt = !0),
    (J.t.x = re(J.t.x - n * e * o, -12, 12)),
    (J.t.z = re(J.t.z + a * e * o, -6, 8)),
    (J.t.y = re(J.t.y + t * o, 0.5, 9)));
}
it.addEventListener(
  "wheel",
  (e) => {
    (e.preventDefault(),
      Ie(),
      (wt = !0),
      (gt = re(
        gt * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)),
        0.3,
        2.2,
      )));
  },
  { passive: !1 },
);
const Wo = new Set();
(addEventListener("keyup", (e) => Wo.delete(e.key.toLowerCase())),
  addEventListener("blur", () => Wo.clear()));
const Yi = new r.Vector3();
function Ki() {
  if (!Wo.size) return;
  const e = (Wo.has("shift") ? 2.4 : 1) * qo,
    t = (...a) => a.some((s) => Wo.has(s));
  let o = 0,
    n = 0;
  (t("a", "arrowleft") && (o += 1),
    t("d", "arrowright") && (o -= 1),
    t("w", "arrowup") && (n += 1),
    t("s", "arrowdown") && (n -= 1),
    (o || n) &&
      (Ia(o * e * 420, 0),
      J.t.addScaledVector(
        Yi.set(-Math.sin(J.yaw), 0, -Math.cos(J.yaw)),
        n * e * 5,
      )),
    t("q") && (J.yaw += e * 1.1),
    t("e") && (J.yaw -= e * 1.1),
    t("=", "+") && (gt = re(gt * Math.exp(-e * 1.3), 0.3, 2.2)),
    t("-", "_") && (gt = re(gt * Math.exp(e * 1.3), 0.3, 2.2)),
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
    ) && (wt = !0));
}
let Mo = !0,
  Ho = -99,
  Hn = -1,
  ze = null,
  mn = 0;
const Ze = (e) => () => At((e * Math.PI) / 180),
  go = (e) => () => fn(e),
  or = (e) => () => dn(e),
  $o = (e) => () => {
    wo.bite = e;
  },
  Ga = [
    {
      view: "lab",
      ...Xt.lab,
      dy: 0.004,
      hold: 12,
      wide: 1,
      beats: [
        [0, go(0)],
        [0, () => At(Ht[0])],
        [0, $o(0)],
        [3.6, () => At(Ht[2])],
        [7.2, Ze(0)],
        [8.4, or(-1)],
      ],
    },
    {
      view: "lab",
      t: [-0.59, 2.05, 1.61],
      yaw: -0.22,
      pitch: 0.1,
      dist: 6.6,
      fov: 30,
      dy: 0.01,
      f: [-0.59, 1.75, 1.61],
      r: 2.2,
      hold: 9,
      beats: [
        [0, go(1)],
        [0, $o(1)],
        [0, Ze(8)],
        [2.5, Ze(28)],
        [5.5, Ze(50)],
      ],
    },
    {
      view: "lab",
      t: [-0.4, 2.2, 1.4],
      yaw: 0.42,
      pitch: 0.16,
      dist: 9.5,
      fov: 30,
      dy: -0.01,
      f: [-0.59, 1.9, 1.61],
      r: 2.8,
      hold: 9,
      beats: [
        [0, go(1)],
        [0, $o(0)],
        [0, Ze(0)],
        [1.6, or(-1)],
      ],
    },
    {
      view: "lab",
      t: [-0.2, 1.6, 0.5],
      yaw: 0.1,
      pitch: 1.02,
      dist: 12.5,
      fov: 44,
      dy: 0.006,
      f: [-0.4, 1.7, 1],
      r: 6,
      hold: 10,
      beats: [
        [0, go(0)],
        [0, $o(0)],
        [0, Ze(-34)],
        [2.6, Ze(34)],
        [5.2, Ze(-34)],
        [7.8, Ze(34)],
      ],
    },
    {
      view: "exploded",
      ...Xt.exploded,
      dy: 0.006,
      hold: 9,
      wide: 1,
      beats: [
        [0, go(0)],
        [0, Ze(30)],
      ],
    },
    {
      view: "studio",
      ...Xt.studio,
      dy: -0.008,
      hold: 8,
      wide: 1,
      beats: [
        [0, go(0)],
        [0, $o(0)],
        [0, Ze(-14)],
        [4.5, Ze(-30)],
      ],
    },
    {
      view: "lab",
      t: [0, 1.35, 4.9],
      yaw: 0.02,
      pitch: 0.24,
      dist: 10.5,
      fov: 30,
      dy: 0.006,
      f: [0, 0.95, 5.8],
      r: 3.2,
      hold: 7,
      beats: [
        [0, go(0)],
        [0, $o(0)],
        [0.5, Ze(-45)],
        [3.2, Ze(45)],
      ],
    },
  ];
function nr(e, t) {
  ((Hn = e), (ze = Ga[e]), (mn = 0), (u.skid = null), (u.hold = null));
  const o = Oo && j.aspect < 0.8 && e === 0 ? { ...ze, ...Ys } : ze;
  ze.view && ze.view !== (Y.next || Y.cur)
    ? (ro(ze.view, !1, o), (Ho = t + 0.2))
    : (No(o), (Ho = t));
}
function Zi(e) {
  (e < Ho - 1 && (Ho = e),
    (!ze || e - Ho > ze.hold) && nr((Hn + 1) % Ga.length, e));
  const t = e - Ho;
  if (!(t < 0)) {
    for (; mn < ze.beats.length && t >= ze.beats[mn][0];)
      (ze.beats[mn][1](), mn++);
    wt ||
      ((J.yaw = ze.yaw + t * ze.dy),
      (J.dist = ze.dist * (1 - t * 0.008)),
      Ro.set(...ze.f),
      (qn = ze.r));
  }
}
function Xo(e) {
  ((Mo = e),
    K("#cine").classList.toggle("on", e),
    K("#cine").setAttribute("aria-pressed", e),
    e && ((ze = null), (Hn = -1), (wt = !1), (gt = 1)));
}
let xn = null;
const Ie = () => {
  ((xn = null), Mo && Xo(!1));
};
function Ba() {
  (Xo(!1), No(Xt[Y.cur]));
}
function Qi(e) {
  const t = wt ? 0 : Math.sin(e / 8) * 0.025,
    o = Mo ? ze?.wide : xn ? xn.wide : !0,
    n = J.dist * gt * (o ? Vn : He(1, Vn, 0.5)),
    a = J.yaw + t,
    s = Math.asin(re((0.35 - J.t.y) / Math.max(n, 0.1), -1, 1)),
    l = Math.max(J.pitch, s),
    i = Math.cos(l);
  if (
    (j.position.set(
      J.t.x + Math.sin(a) * i * n,
      J.t.y + Math.sin(l) * n,
      J.t.z + Math.cos(a) * i * n,
    ),
    Y.cur === "lab")
  ) {
    const h = j.position;
    ((h.y = Math.min(h.y, nt - 0.8)),
      (h.x = re(h.x, -12.8, 12.8)),
      (h.z = re(h.z, Qo + 0.6, 46)));
  }
  if ((j.lookAt(J.t), !Mo && !wt)) {
    const h = xn || Xt[Y.cur];
    (Ro.set(...h.f), (qn = h.r));
  }
  const c = j.position.distanceTo(wt ? J.t : Ro),
    f = wt ? Math.min(1, qo * 5) : 1,
    d = (wt ? Math.max(2.2, c * 0.28) : qn) * R.focalBand;
  ((ht.u.focus.value += (c - ht.u.focus.value) * f),
    (ht.u.range.value += (d - ht.u.range.value) * f),
    ht.u.cocScale.value.set(R.apertureNear, R.aperture));
}
const ar = [...document.querySelectorAll("#seg-e button")],
  sr = [...document.querySelectorAll("#seg-t button")],
  qa = [...document.querySelectorAll("#seg-view button")];
(ar.forEach(
  (e) =>
    (e.onclick = () => {
      (Ie(), cn(+e.dataset.e));
    }),
),
  sr.forEach(
    (e) =>
      (e.onclick = () => {
        (Ie(), fn(+e.dataset.t));
      }),
  ),
  qa.forEach(
    (e) =>
      (e.onclick = () => {
        (Ie(), ro(e.dataset.v));
      }),
  ),
  (K("#force").onclick = () => {
    (Ie(), dn(0));
  }));
{
  const e = K("#slide");
  let t = !1;
  const o = (a) => {
    const s = e.getBoundingClientRect();
    At((1 - ((a.clientX - s.left) / s.width) * 2) * xt);
  };
  (e.addEventListener("pointerdown", (a) => {
    (Ie(), (t = !0), (no = !0), e.setPointerCapture(a.pointerId), o(a));
  }),
    e.addEventListener("pointermove", (a) => {
      t && o(a);
    }),
    e.addEventListener("pointerup", () => {
      ((t = !1), (no = !1));
    }),
    e.addEventListener("pointercancel", () => {
      ((t = !1), (no = !1));
    }),
    e.addEventListener("keydown", (a) => {
      (a.key === "ArrowLeft" || a.key === "ArrowRight") &&
        (a.preventDefault(),
        a.stopPropagation(),
        Ie(),
        At(u.leanT + ((a.key === "ArrowLeft" ? 2 : -2) * Math.PI) / 180));
    }));
  const n = document.createDocumentFragment();
  for (const a of Ht) {
    const s = document.createElement("div");
    ((s.className = "tk"),
      (s.style.left = (1 - a / xt) * 50 + "%"),
      n.appendChild(s));
  }
  e.appendChild(n);
}
let rr = 0;
const lo = (e) => Math.round((Math.abs(e) * 180) / Math.PI),
  Ji = (e) => (lo(e) < 1 ? "flat" : lo(e) + "\xB0 " + (e < 0 ? "in" : "out"));
function el() {
  const e = u.M,
    t = Math.hypot(u.vx, u.vz),
    o = (B.m * t * t) / B.rF,
    n = u.lean < 0 ? "inside edge" : "outside edge";
  return u.skid
    ? `Forced round on a flat blade, the edges hold only <b>${Math.round(e.grip)} N</b> sideways against the <b>${Math.round(o)} N</b> a ${B.rF} m turn asks: the blade <span class="r">skids</span>, scraping ice out of the turn and bleeding speed to <b>${Math.round(t * 3.6)} km/h</b>.`
    : u.hold
      ? `The ${n} bites: its groove wall holds <b>${Math.round(e.grip)} N</b> sideways, more than the <b>${Math.round(o)} N</b> a ${B.rF} m turn asks, so the blade carves tighter <span class="c">without slipping</span>.`
      : lo(u.lean) < 1
        ? `Flat, the blade rides on <b>both edges</b> with the hollow between them, each sunk just <b>${(e.d * 1e3).toFixed(2)} mm</b>. Nothing tips the rocker sideways, so the path runs <span class="c">straight</span>, and a turn forced now would skid.`
        : `Leaning <b>${lo(u.lean)}\xB0</b> tips the blade's <b>${B.R} m</b> rocker into the ice as an arc of <span class="c">${e.r.toFixed(1)} m</span>. The ${n} carries all <b>${Math.round(e.F)} N</b>, sinking <b>${(e.d * 1e3).toFixed(2)} mm</b> along <b>${(e.L * 100).toFixed(1)} cm</b>: about ${B.H / 1e6} MPa, which lowers ice's melting point by only <span class="a">${e.dT.toFixed(1)} \xB0C</span>.`;
}
function vn(e) {
  if (!e && we - rr < 0.1) return;
  rr = we;
  const t = u.M;
  ((K("#s-a").innerHTML =
    lo(u.lean) +
    "\xB0<small>" +
    (lo(u.lean) < 1 ? "flat" : u.lean < 0 ? "in" : "out") +
    "</small>"),
    (K("#s-b").innerHTML = u.skid
      ? "skid"
      : isFinite(t.r) && t.r < 99
        ? t.r.toFixed(1) + "<small>m</small>"
        : "straight"),
    (K("#s-c").innerHTML = Math.round(t.v * 3.6) + "<small>km/h</small>"));
  const o = (1 - u.lean / xt) * 50;
  ((K("#slide-kn").style.left = o + "%"),
    (K("#slide-fl").style.left = Math.min(o, 50) + "%"),
    (K("#slide-fl").style.width = Math.abs(o - 50) + "%"),
    (K("#slide-v").textContent = Ji(u.lean)));
  const n = Ht.findIndex((l) => Math.abs(l - u.leanT) < 0.02);
  ar.forEach((l) => l.classList.toggle("on", +l.dataset.e === n));
  const a = $t.indexOf(u.tsT);
  (sr.forEach((l, i) => l.classList.toggle("on", i === a)),
    K("#force").classList.toggle("on", !!(u.skid || u.hold)),
    K("#slide").setAttribute(
      "aria-valuenow",
      Math.round((u.lean * 180) / Math.PI),
    ));
  const s = el();
  s !== vn.w && ((K("#why").innerHTML = s), (vn.w = s));
}
const jt = [
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
let kt = 0,
  ir = 0,
  Va = 0,
  $n = 0,
  Xn = 0;
function lt() {
  (se.setPixelRatio(R.pixelRatio),
    ut.setPixelRatio(R.pixelRatio),
    Yo.rt.samples !== R.msaa && ((Yo.rt.samples = R.msaa), Yo.rt.dispose()),
    (ss.enabled = !!R.smaa),
    Re.shadow.mapSize.x !== R.shadow &&
      (Re.shadow.mapSize.set(R.shadow, R.shadow),
      Re.shadow.map?.dispose(),
      (Re.shadow.map = null)),
    (Vt.enabled = !!R.bloom),
    (Vt.radius = R.bloomRadius),
    (Me.enabled = !0),
    Me.updateGtaoMaterial({
      radius: R.aoRadius,
      thickness: 1.1,
      distanceExponent: 1.4,
      distanceFallOff: 1,
      scale: 1.2,
      samples: R.ao ? R.aoSamples : 2,
    }),
    (ht.enabled = !!R.dof),
    (ht.u.maxCoc.value = R.maxCoc),
    Aa(),
    hr());
}
function Yt() {
  ((K("#tune-rows").innerHTML = jt
    .map(([e, t, o, n, , a, s], l) => {
      const i = R[e],
        c = ((i - o) / (n - o)) * 100;
      return `<div class="tr${l === kt ? " sel" : ""}${s ? " sub" : ""}" data-i="${l}"><b>${t}</b><span class="tk"><i style="left:${re(c, 0, 100)}%"></i></span><u>${a(i)}</u></div>`;
    })
    .join("")),
    K("#tune-rows")
      .querySelectorAll(".tr")
      .forEach((e) => {
        e.onclick = () => {
          ((kt = +e.dataset.i), Yt());
        };
        const t = e.querySelector(".tk");
        t.onpointerdown = (o) => {
          (o.stopPropagation(),
            (kt = +e.dataset.i),
            t.setPointerCapture(o.pointerId));
          const n = (a) => {
            const s = t.getBoundingClientRect(),
              [l, , i, c, f] = jt[kt],
              d = re(
                Math.round(
                  (i + ((a.clientX - s.left) / s.width) * (c - i)) / f,
                ) * f,
                i,
                c,
              );
            d !== R[l] &&
              ((R[l] = +d.toFixed(4)), l !== "auto" && (R.auto = 0), lt());
            const h = t.querySelector("i");
            ((h.style.left = re(((R[l] - i) / (c - i)) * 100, 0, 100) + "%"),
              (e.querySelector("u").textContent = jt[kt][5](R[l])),
              (K("#tune-json").value = JSON.stringify(R)));
          };
          (n(o),
            (t.onpointermove = (a) => {
              t.hasPointerCapture(a.pointerId) && n(a);
            }),
            (t.onpointerup = () => Yt()));
        };
      }),
    (K("#tune-json").value = JSON.stringify(R)));
}
function tl(e, t) {
  const [o, , n, a, s] = jt[kt],
    l = re(+(R[o] + e * s * (t ? 5 : 1)).toFixed(4), n, a);
  l !== R[o] && ((R[o] = l), o !== "auto" && (R.auto = 0), lt(), Yt());
}
function lr(e) {
  const t = K("#tune"),
    o = e === void 0 ? t.hidden : e;
  ((t.hidden = !o), o && Yt());
}
function ol(e) {
  const t = e.key;
  if (t === "ArrowUp" || t === "ArrowDown")
    return (
      (kt = (kt + (t === "ArrowUp" ? -1 : 1) + jt.length) % jt.length),
      Yt(),
      K("#tune-rows .tr.sel")?.scrollIntoView({ block: "nearest" }),
      !0
    );
  if (t === "ArrowLeft" || t === "ArrowRight")
    return (tl(t === "ArrowLeft" ? -1 : 1, e.shiftKey), !0);
  if (t === "Enter" || t === " ") {
    const [o, , n, a, s] = jt[kt];
    return a - n === s
      ? ((R[o] = R[o] ? 0 : 1), o !== "auto" && (R.auto = 0), lt(), Yt(), !0)
      : !1;
  }
  return t === "0" || t === ")"
    ? (e.shiftKey ? Object.assign(R, ia) : (R[jt[kt][0]] = ia[jt[kt][0]]),
      (R.auto = 0),
      lt(),
      Yt(),
      !0)
    : t === "c" || t === "C"
      ? (navigator.clipboard?.writeText(JSON.stringify(R, null, 1)), !0)
      : t === "Escape"
        ? (lr(!1), !0)
        : !1;
}
K("#tune-json").addEventListener("change", (e) => {
  try {
    const t = JSON.parse(e.target.value);
    for (const o in ia) typeof t[o] == "number" && (R[o] = t[o]);
    ((R.auto = 0), lt(), Yt());
  } catch {
    Yt();
  }
});
const jn = K("#ui-hint");
let cr = -9;
function Ct(e) {
  ((jn.textContent = e), jn.classList.add("on"), (cr = we));
}
const fr = ["lab", "exploded", "studio"];
(addEventListener("keydown", (e) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    !e.altKey &&
    (e.code === "Quote" || e.key === "'")
  ) {
    (e.preventDefault(), lr());
    return;
  }
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.altKey ||
    /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) ||
    K("#info").open
  )
    return;
  if (!K("#tune").hidden && ol(e)) {
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
      t !== "shift" && Ie(),
      Wo.add(t));
    return;
  }
  if (t === "1" || t === "2" || t === "3") (Ie(), cn(da[+t - 1]));
  else if (t === "[" || t === "]")
    (Ie(), At(u.leanT + ((t === "[" ? 5 : -5) * Math.PI) / 180));
  else if (t === "f") (Ie(), dn(0));
  else if (t === " ")
    (e.preventDefault(),
      Ie(),
      fn(u.tsT < 1 ? 0 : 1),
      Ct(u.tsT < 1 ? "Slow motion \xBC\xD7" : "Real time"));
  else if (t === "," || t === ".") {
    Ie();
    const o = $t.indexOf(u.tsT);
    (fn(re((o < 0 ? 0 : o) + (t === "," ? 1 : -1), 0, 2)),
      Ct(u.tsT < 1 ? "Slow motion " + En[$t.indexOf(u.tsT)] : "Real time"));
  } else if (t === "m") dr();
  else if (t === "v") {
    Ie();
    const o = fr[(fr.indexOf(Y.next || Y.cur) + 1) % 3];
    (ro(o), Ct(o[0].toUpperCase() + o.slice(1)));
  } else
    t === "x"
      ? (Ie(), ro((Y.next || Y.cur) === "exploded" ? "lab" : "exploded"))
      : t === "c"
        ? K("#cine").click()
        : t === "r"
          ? Ba()
          : t === "n"
            ? ((Nt = !Nt), Ct(Nt ? "Labels on" : "Labels off"))
            : t === "/" &&
              (e.preventDefault(),
              ta.classList.toggle("ui-off"),
              Ct(
                ta.classList.contains("ui-off")
                  ? "Interface hidden \xB7 / to show"
                  : "Interface shown",
              ));
}),
  (K("#cine").onclick = () => {
    Mo ? Ba() : Xo(!0);
  }),
  it.addEventListener("dblclick", (e) => {
    Wn(e) || Ba();
  }));
{
  const e = Bo(0),
    t = (n) => Math.round(Bo(n).v * 3.6),
    o = {
      w: Math.round(B.w * 1e3) + " mm",
      rho: (B.rho * 1e3).toFixed(0) + " mm",
      R: B.R + " m",
      H:
        B.H / 1e6 +
        " MPa, about " +
        Math.round(B.H / 101325 / 10) * 10 +
        " atmospheres",
      H2: "Even " + B.H / 1e6 + " MPa",
      dT: ((B.dTdp * B.H) / 1e6).toFixed(1) + " \xB0C",
      dflat: (e.d * 1e3).toFixed(2) + " mm",
      vrange:
        "from " +
        t(0.02) +
        " km/h at a slight lean to " +
        t(xt) +
        " km/h at " +
        Math.round((xt * 180) / Math.PI) +
        "\xB0",
      sks: "about " + Math.round((10 * Ws.lab.s) / ao) + " times",
      rink: Math.round((ce.r * 2) / ao) + " m",
    };
  document
    .querySelectorAll("#info [data-t]")
    .forEach((n) => (n.textContent = o[n.dataset.t]));
}
((K("#how").onclick = () => K("#info").showModal()),
  (K("#close").onclick = () => K("#info").close()),
  K("#info").addEventListener("click", (e) => {
    e.target === e.currentTarget && e.currentTarget.close();
  }),
  setInterval(() => {
    K("#tune").hidden || (K("#tune-fps").textContent = Math.round(ir) + " fps");
  }, 500),
  (K("#share").onclick = async () => {
    const e = location.href.split("#")[0].split("?")[0];
    try {
      navigator.share
        ? await navigator.share({ title: document.title, url: e })
        : (await navigator.clipboard.writeText(e), Ct("Link copied"));
    } catch {}
  }));
let wn = !1;
const pe = { ctx: null };
function nl() {
  if (pe.ctx) return;
  const e = new (window.AudioContext || window.webkitAudioContext)();
  pe.ctx = e;
  const t = e.sampleRate * 2,
    o = e.createBuffer(1, t, e.sampleRate),
    n = o.getChannelData(0);
  let a = 0;
  for (let l = 0; l < t; l++)
    ((a = a * 0.2 + (Math.random() * 2 - 1) * 0.8), (n[l] = a));
  ((pe.master = e.createGain()),
    (pe.master.gain.value = 0.55),
    pe.master.connect(e.destination));
  const s = (l, i, c) => {
    const f = e.createBufferSource();
    ((f.buffer = o),
      (f.loop = !0),
      (f.playbackRate.value = 0.9 + Math.random() * 0.2));
    const d = e.createBiquadFilter();
    ((d.type = l), (d.frequency.value = i), (d.Q.value = c));
    const h = e.createGain();
    return (
      (h.gain.value = 0),
      f.connect(d).connect(h).connect(pe.master),
      f.start(),
      { bp: d, g: h }
    );
  };
  ((pe.hiss = s("bandpass", 4200, 1.1)),
    (pe.rumble = s("lowpass", 240, 0.7)),
    (pe.scrape = s("bandpass", 1700, 1.6)));
}
function al() {
  if (!wn || !pe.ctx) return;
  const e = pe.ctx,
    t = e.currentTime,
    o = Math.hypot(u.vx, u.vz),
    n = Math.sqrt(u.ts),
    a = Math.abs(u.lean),
    s = 1 + 0.18 * Math.sin(we * 7.3) * Math.sin(we * 2.1);
  (pe.hiss.g.gain.setTargetAtTime(
    (o / 6) * (0.3 + a * 0.9) * 0.2 * n * s,
    t,
    0.08,
  ),
    pe.hiss.bp.frequency.setTargetAtTime((2400 + a * 3e3) * n, t, 0.12),
    pe.rumble.g.gain.setTargetAtTime((o / 6) * 0.16 * n, t, 0.12),
    pe.scrape.g.gain.setTargetAtTime(
      Math.min(1, u.power / 800) * 0.6 * n,
      t,
      0.03,
    ),
    pe.scrape.bp.frequency.setTargetAtTime(
      (1300 + Math.random() * 900) * n,
      t,
      0.02,
    ));
}
function Yn(e) {
  ((wn = e),
    K("#snd").classList.toggle("on", e),
    K("#snd").setAttribute("aria-pressed", e));
  try {
    localStorage.setItem("skate-blade-sound", e ? "1" : "0");
  } catch {}
  e && pe.armed
    ? (nl(),
      pe.ctx.resume?.(),
      pe.master.gain.setTargetAtTime(0.55, pe.ctx.currentTime, 0.05))
    : pe.ctx && pe.master.gain.setTargetAtTime(0, pe.ctx.currentTime, 0.05);
}
function dr() {
  ((pe.armed = !0), Yn(!wn), Ct(wn ? "Sound on" : "Sound off"));
}
K("#snd").onclick = () => dr();
try {
  if (localStorage.getItem("skate-blade-sound") === "1") {
    Yn(!0);
    const e = () => {
      ((pe.armed = !0),
        wn && Yn(!0),
        removeEventListener("pointerdown", e, !0),
        removeEventListener("keydown", e, !0));
    };
    (addEventListener("pointerdown", e, !0),
      addEventListener("keydown", e, !0));
  }
} catch {}
function ur() {
  const e = Lt.clientWidth,
    t = Lt.clientHeight;
  Oo = e < 900;
  const o = ((J.fov * R.fov) / 30) * (Oo ? 1.25 : 1);
  (j.fov !== o && ((j.fov = o), j.updateProjectionMatrix()),
    j.setViewOffset(e, t, Oo ? 0 : e * 0.02, Oo ? t * 0.1 : -t * 0.02, e, t));
  const n = 2 * Math.tan(r.MathUtils.degToRad(j.fov / 2));
  Vn =
    j.aspect < 0.8
      ? re(0.62 / Math.max(j.aspect, 0.4), 1, 1.5)
      : re(Math.max(Da[0] / (n * j.aspect), Da[1] / n) / Ks, 0.85, 2.2);
}
function hr() {
  const e = Lt.clientWidth,
    t = Lt.clientHeight;
  ((j.aspect = e / t),
    j.updateProjectionMatrix(),
    se.setSize(e, t),
    ut.setSize(e, t));
  const o = se.getDrawingBufferSize(new r.Vector2());
  for (const n of [zo, bt])
    n.target.setSize(Math.round(o.x * n.scale), Math.round(o.y * n.scale));
  (as.uRes.value.copy(o), ur(), j.updateProjectionMatrix());
}
addEventListener("resize", hr);
let pr = performance.now(),
  Oa = 0,
  Ua = 0,
  mr = 0;
function Na(e) {
  ((La = re((e - pr) / 1e3, 0, 1.5)), (qo = Math.min(0.1, La)), (pr = e));
  const t = e / 1e3;
  we = t;
  const o = window.__PROF,
    n = o ? performance.now() : 0;
  (Mo && Zi(t), Ki(), Is(qo));
  const a = o ? performance.now() : 0;
  (Gi(), Di());
  const s = o ? performance.now() : 0;
  (Qi(t), j.updateMatrixWorld(), (se.shadowMap.needsUpdate = !0), Vi(t));
  const l = o ? performance.now() : 0;
  if (
    (vn(),
    al(),
    jn.classList.contains("on") && we - cr > 1.5 && jn.classList.remove("on"),
    (Oa += La),
    Ua++,
    e - mr > 1600)
  ) {
    const f = Ua / Math.max(Oa, 0.001);
    ((Oa = 0),
      (Ua = 0),
      (mr = e),
      (ir = f),
      $n++,
      $n > 2 && (Va = Math.max(Va, f)),
      (Xn = $n > 3 && f < Va * 0.74 ? Xn + 1 : 0),
      R._ceil === void 0 &&
        ((R._ceil = Math.min(2, Math.max(1, devicePixelRatio))),
        (R._good = 0),
        (R._probe = 0)),
      !document.hidden &&
        R.auto &&
        $n > 3 &&
        (R._probe && f < 55
          ? ((R._probe = 0),
            (R._good = 0),
            (R._ceil = Math.max(1, +(R.pixelRatio - 0.25).toFixed(2))),
            (R.pixelRatio = R._ceil),
            lt())
          : ((R._probe = 0),
            (R._good = f >= 58 ? Math.min(9, R._good + 1) : 0),
            R._good >= 3 &&
              R.pixelRatio < R._ceil &&
              ((R._good = 0),
              (R._probe = 1),
              (R.pixelRatio = Math.min(
                R._ceil,
                +(R.pixelRatio + 0.25).toFixed(2),
              )),
              lt()))),
      !document.hidden &&
        R.auto &&
        Xn >= 2 &&
        f < 50 &&
        ((Xn = 0),
        R.pixelRatio > 1
          ? ((R.pixelRatio = R._ceil =
              Math.max(1, +(R.pixelRatio - 0.25).toFixed(2))),
            lt())
          : R.reflect
            ? ((R.reflect = 0), lt())
            : R.msaa > 0
              ? ((R.msaa = 0), lt())
              : R.ao && ((R.ao = 0), lt())));
  }
  const i = o ? performance.now() : 0;
  Dr();
  const c = o ? performance.now() : 0;
  if ((se.info.reset(), ut.render(), o)) {
    const f = performance.now();
    ((o.step = (o.step || 0) + a - n),
      (o.apply = (o.apply || 0) + s - a),
      (o.explain = (o.explain || 0) + l - s),
      (o.dom = (o.dom || 0) + i - l),
      (o.mirror = (o.mirror || 0) + c - i),
      (o.post = (o.post || 0) + f - c),
      (o.n = (o.n || 0) + 1));
  }
}
let xr = !0;
function vr(e) {
  (requestAnimationFrame(vr), xr && Na(e));
}
(lt(), ro("lab", !0));
{
  Pa();
  for (let e = 0; e < 600; e++)
    ((u.leanT = e < 140 ? 0.42 : e < 280 ? -0.45 : e < 420 ? 0.42 : -0.52),
      Is(1 / 60),
      Pa());
  u.lean = u.leanT;
}
(Xo(!0),
  K("#loading").remove(),
  vn(!0),
  requestAnimationFrame(vr),
  (window.__step = (e) => Na(e)),
  (window.__loop = (e) => {
    xr = e;
  }),
  (window.__capture = (e = 1200, t = 0.85) => {
    const o = se.domElement,
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
        "http://localhost:8792/shot?name=" + ja + "/_shots/" + e + ".webp",
        { method: "POST", body: n },
      )
    ).text();
  }),
  (window.__lab = {
    script: (e) => {
      (Xo(!1), (xn = e), e && No({ fit: null, ...e }));
    },
    view: (e, t = !0) => ro(e, t),
    cut: (e) => {
      (Xo(!0), nr(e, we));
    },
    lean: (e) => {
      ((u.leanT = u.lean = re((e * Math.PI) / 180, -xt, xt)),
        (u.M = Bo(u.lean)));
    },
    edge: (e) => cn(e),
    speed: (e) => {
      u.tsT = u.ts = $t[e];
    },
    force: (e) => dn(e || 0),
    explode: (e) => {
      u.exT = u.ex = e ? 1 : 0;
    },
    tags: (e) => {
      Nt = !!e;
    },
    bite: (e) => {
      wo.bite = e ? 1 : 0;
    },
    sound: (e) => Yn(!!e),
    tune: (e) => (Object.assign(R, e), lt(), { ...R }),
    model: Bo,
    PH: B,
    ST: u,
    VIEW: Y,
    VIEWS: xo,
    HERO: Xt,
    SHOTS: Ga,
    ANC: z,
    TR: Q,
    SPR: V,
  }),
  (window.__x = {
    dof: ht,
    gtao: Me,
    bloom: Vt,
    renderer: se,
    camera: j,
    scene: Te,
    composer: ut,
    cam: J,
    RT: R,
    overlay: Ko,
    rays: ge,
    SK: X,
    UI: fe,
    BOOT: ks,
    skateRoot: Mt,
    leanG: Fo,
    ICE: Ee,
    FACES: Pt,
  }),
  (window.__room = _e),
  (window.__bench = mt),
  (window.__pick = (e, t) => {
    const o = Wn({ clientX: e, clientY: t });
    return o ? o.kind : null;
  }),
  (window.__insetURLs = () =>
    Ra.map((e) => e.m.material.map.image.toDataURL("image/png"))),
  (window.__dbg = () => ({
    t: +we.toFixed(2),
    view: Y.cur,
    shot: Hn,
    cine: Mo,
    lean: Math.round((u.lean * 180) / Math.PI),
    r: +u.M.r.toFixed(2),
    v: +Math.hypot(u.vx, u.vz).toFixed(2),
    skid: !!u.skid,
    ts: u.ts,
    ex: +u.ex.toFixed(2),
    fit: +Vn.toFixed(3),
    focus: +ht.u.focus.value.toFixed(2),
    range: +ht.u.range.value.toFixed(2),
    calls: se.info.render.calls,
    tris: se.info.render.triangles,
  })));
