import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { Reflector } from "three/addons/objects/Reflector.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { PendulumModel, period, solveLength } from "./model.js";
const $ = (s) => document.querySelector(s),
  model = new PendulumModel();
let playing = true,
  speed = 1,
  view = "Lab",
  cinematic = false,
  renderCount = 0,
  repairCount = 4,
  last = performance.now(),
  interaction = null;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#172334");
scene.fog = new THREE.Fog("#172334", 28, 65);
const camera = new THREE.PerspectiveCamera(
  30,
  innerWidth / innerHeight,
  0.1,
  120,
);
const renderer = new THREE.WebGLRenderer({
  canvas: $("#scene"),
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.97;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 14;
controls.maxDistance = 90;
controls.maxPolarAngle = Math.PI * 0.49;
controls.target.set(-0.3, 3.02, 0.1);
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight),
  0.26,
  0.5,
  1.12,
);
composer.addPass(bloom);
composer.addPass(new OutputPass());
const mats = {
  steel: new THREE.MeshPhysicalMaterial({
    color: "#818b9a",
    envMapIntensity: 0.65,
    metalness: 1.0,
    roughness: 0.23,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
  }),
  dark: new THREE.MeshStandardMaterial({
    color: "#252a34",
    metalness: 0.72,
    roughness: 0.32,
  }),
  brass: new THREE.MeshPhysicalMaterial({
    color: "#d09a35",
    metalness: 0.92,
    roughness: 0.28,
    clearcoat: 0.5,
    clearcoatRoughness: 0.16,
  }),
  rubber: new THREE.MeshStandardMaterial({ color: "#101722", roughness: 0.7 }),
  wall: new THREE.MeshStandardMaterial({ color: "#263348", roughness: 0.85 }),
  blue: new THREE.MeshStandardMaterial({
    color: "#72b8ff",
    emissive: "#72b8ff",
    emissiveIntensity: 1.1,
  }),
  amber: new THREE.MeshStandardMaterial({
    color: "#ffb454",
    emissive: "#ffb454",
    emissiveIntensity: 1.0,
  }),
  warm: new THREE.MeshStandardMaterial({
    color: "#ffe0a7",
    emissive: "#ffbd72",
    emissiveIntensity: 3.1,
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: "#aac3de",
    metalness: 0.05,
    roughness: 0.08,
    transparent: true,
    opacity: 0.022,
    depthWrite: false,
    side: THREE.DoubleSide,
  }),
  white: new THREE.MeshStandardMaterial({ color: "#d5dbdf", roughness: 0.7 }),
};
const lab = new THREE.Group(),
  instrument = new THREE.Group();
scene.add(lab, instrument);
const pickables = [],
  pendulums = [],
  knobs = [],
  exploded = [];
function mesh(geo, mat, x = 0, y = 0, z = 0, parent = instrument) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = !mat.transparent;
  m.receiveShadow = !mat.transparent;
  parent.add(m);
  return m;
}
const boxGeometries = new Map();
function box(w, h, d, mat, x, y, z, parent) {
  const key = [w, h, d].join(",");
  let geo = boxGeometries.get(key);
  if (!geo) {
    const b = Math.min(w, h, d, 0.25) * 0.12;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + b, -h / 2 + b);
    s.lineTo(w / 2 - b, -h / 2 + b);
    s.lineTo(w / 2 - b, h / 2 - b);
    s.lineTo(-w / 2 + b, h / 2 - b);
    s.closePath();
    geo = new THREE.ExtrudeGeometry(s, {
      depth: Math.max(0.001, d - 2 * b),
      bevelEnabled: true,
      bevelSize: b,
      bevelThickness: b,
      bevelSegments: 2,
      steps: 1,
    });
    geo.translate(0, 0, -d / 2 + b);
    boxGeometries.set(key, geo);
  }
  return mesh(geo, mat, x, y, z, parent);
}
function cyl(r, h, mat, x, y, z, parent, r2 = r, n = 32) {
  return mesh(new THREE.CylinderGeometry(r, r2, h, n), mat, x, y, z, parent);
}
function ring(r, thick, mat, x, y, z, parent) {
  return mesh(new THREE.TorusGeometry(r, thick, 8, 80), mat, x, y, z, parent);
}
function label(
  text,
  color = "#b1c3d4",
  width = 2,
  size = 0.15,
  parent = instrument,
) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.font = "500 70px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, 512, 64);
  const tex = new THREE.CanvasTexture(c),
    s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthTest: false,
      }),
    );
  s.scale.set(width, size, 1);
  parent.add(s);
  return s;
}
// Narrow luminous panels give metal facets distinct warm/cool highlights.
const envScene = new THREE.Scene();
envScene.background = new THREE.Color("#293346");
for (const [x, y, z, w, h, color, intensity] of [
  [-7, 7, 3, 1.4, 10, "#c7ddff", 3.4],
  [7, 6, 4, 1.0, 9, "#ffe2a6", 5.0],
  [0, 12, 1, 11, 1.7, "#e1e9ff", 2.4],
  [0, 5, 12, 9, 8, "#e8ecff", 0.95],
  [0, 6, -7, 8, 1.4, "#809bc8", 1.5],
  [-1, 3, 10, 0.55, 8, "#fff0d2", 2.5],
]) {
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color).multiplyScalar(intensity),
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  panel.position.set(x, y, z);
  panel.lookAt(0, 4, 0);
  envScene.add(panel);
}
const pmenv = new THREE.PMREMGenerator(renderer);
scene.environment = pmenv.fromScene(envScene, 0.035, 0.1, 100, {
  position: new THREE.Vector3(0, 4, 0),
}).texture;
scene.environmentIntensity = 1.15;
pmenv.dispose();
scene.add(new THREE.HemisphereLight("#bccfe9", "#17141c", 0.62));
const key = new THREE.DirectionalLight("#ffe0ad", 2.1);
key.position.set(-3, 10, 7);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, {
  left: -10,
  right: 10,
  top: 11,
  bottom: -7,
  near: 1,
  far: 35,
});
key.shadow.normalBias = 0.022;
key.shadow.bias = -0.00008;
key.shadow.radius = 4;
scene.add(key);
const fill = new THREE.DirectionalLight("#94b8ec", 0.7);
fill.position.set(-8, 7, 5);
scene.add(fill);
const edge = new THREE.DirectionalLight("#fff0cb", 0.65);
edge.position.set(5, 8, -4);
scene.add(edge);
const accentLights = new THREE.Group();
scene.add(accentLights);
for (const x of [-5.2, 5.2]) {
  const light = new THREE.PointLight("#ffc27c", 2.4, 7, 2);
  light.position.set(x, 0.55, 2.65);
  accentLights.add(light);
}
const floor = box(
  100,
  0.1,
  100,
  new THREE.MeshStandardMaterial({
    color: "#10141e",
    metalness: 0.16,
    roughness: 0.42,
    envMapIntensity: 0.08,
  }),
  0,
  -0.09,
  0,
  scene,
);
// A real mirrored render, softened in the floor shader, follows the actual bobs.
const reflectionShader = {
  name: "PendulumSoftFloor",
  uniforms: {
    tDiffuse: { value: null },
    color: { value: new THREE.Color("#11151e") },
    textureMatrix: { value: new THREE.Matrix4() },
    texel: { value: new THREE.Vector2(1 / 768, 1 / 768) },
    reflectionStrength: { value: 0.27 },
  },
  vertexShader: `uniform mat4 textureMatrix;
    varying vec4 vReflect; varying vec3 vWorld;
    void main(){vReflect=textureMatrix*vec4(position,1.0);
      vWorld=(modelMatrix*vec4(position,1.0)).xyz;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec3 color;
    uniform vec2 texel; uniform float reflectionStrength;
    varying vec4 vReflect; varying vec3 vWorld;
    void main(){vec2 uv=vReflect.xy/vReflect.w;
      float spread=1.4+clamp((vWorld.z-2.5)*0.8,0.0,4.0);
      vec2 d=texel*spread;
      vec3 ref=texture2D(tDiffuse,uv).rgb*0.28;
      ref+=(texture2D(tDiffuse,uv+vec2(d.x,0.0)).rgb+texture2D(tDiffuse,uv-vec2(d.x,0.0)).rgb)*0.18;
      ref+=(texture2D(tDiffuse,uv+vec2(0.0,d.y)).rgb+texture2D(tDiffuse,uv-vec2(0.0,d.y)).rgb)*0.18;
      float fade=1.0-smoothstep(3.0,17.0,vWorld.z);
      vec3 c=mix(color,ref,reflectionStrength*fade);
      vec2 tile=abs(fract((vWorld.xz+1.5)/3.0)-0.5);
      float grid=smoothstep(0.49,0.499,max(tile.x,tile.y));
      c*=1.0-grid*0.16;
      gl_FragColor=vec4(c,1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};
const floorReflection = new Reflector(new THREE.PlaneGeometry(100, 100), {
  textureWidth: innerWidth < 700 ? 384 : 768,
  textureHeight: innerWidth < 700 ? 384 : 768,
  multisample: 0,
  clipBias: 0.004,
  color: "#11151e",
  shader: reflectionShader,
});
floorReflection.rotation.x = -Math.PI / 2;
floorReflection.position.y = -0.032;
scene.add(floorReflection);
// Warm light pools are restrained and fade out, rather than lifting the entire floor.
const glowCanvas = document.createElement("canvas");
glowCanvas.width = 256;
glowCanvas.height = 128;
const glowCtx = glowCanvas.getContext("2d");
const glowGradient = glowCtx.createRadialGradient(128, 64, 0, 128, 64, 110);
glowGradient.addColorStop(0, "rgba(255,170,75,0.46)");
glowGradient.addColorStop(0.32, "rgba(255,153,64,0.18)");
glowGradient.addColorStop(1, "rgba(255,137,55,0)");
glowCtx.fillStyle = glowGradient;
glowCtx.fillRect(0, 0, 256, 128);
const glowTexture = new THREE.CanvasTexture(glowCanvas);
glowTexture.colorSpace = THREE.SRGBColorSpace;
const floorGlow = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 3.8),
  new THREE.MeshBasicMaterial({
    map: glowTexture,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  }),
);
floorGlow.rotation.x = -Math.PI / 2;
floorGlow.position.set(0, -0.027, 3.5);
scene.add(floorGlow);
const roomLights = new THREE.Group();
lab.add(roomLights);
const roomStrip = mats.warm.clone();
roomStrip.emissiveIntensity = 1.6;
for (const x of [-10.5, 10.5]) {
  box(0.035, 10, 0.04, roomStrip, x, 5, -4.65, roomLights);
  const light = new THREE.PointLight("#ffc887", 5, 10, 2);
  light.position.set(x, 3.4, -4.2);
  roomLights.add(light);
}
box(21, 0.045, 0.045, roomStrip, 0, 0.15, -4.6, roomLights);
box(60, 20, 0.15, mats.wall, 0, 7, -5, lab);
box(0.2, 20, 20, mats.wall, -12, 7, -1, lab);
for (let x = -10; x <= 10; x += 5) {
  box(0.035, 15, 0.06, mats.steel, x, 6, -4.88, lab);
}
for (const x of [-8, 8]) {
  box(1.5, 7, 0.1, mats.rubber, x, 5, -4.75, lab);
  box(
    1.24,
    6.6,
    0.06,
    new THREE.MeshStandardMaterial({
      color: "#506c8b",
      emissive: "#5a82ab",
      emissiveIntensity: 0.32,
    }),
    x,
    5,
    -4.68,
    lab,
  );
  for (let y = 2; y < 9; y += 2)
    box(1.5, 0.06, 0.09, mats.steel, x, y, -4.6, lab);
}
for (const x of [-9, -6.8, 7.3, 9.5]) {
  const z = -2.6 + (x === -6.8 ? 1 : 0);
  cyl(0.42, 0.6, mats.white, x, 0.25, z, lab, 0.3);
  cyl(0.07, 1.9, mats.brass, x, 1.2, z, lab);
  for (let n = 0; n < 3; n++)
    mesh(
      new THREE.ConeGeometry(0.72 - n * 0.13, 1.0, 7),
      new THREE.MeshStandardMaterial({
        color: n % 2 ? "#2f4a46" : "#354e50",
        roughness: 0.95,
      }),
      x,
      1.35 + n * 0.54,
      z,
      lab,
    );
}
box(1.8, 2.3, 0.15, mats.dark, 5.8, 3.3, -4.5, lab);
const exhibit = label("OSCILLATION / 02", "#a9c0d3", 1.55, 0.14, lab);
exhibit.position.set(5.8, 4.15, -4.36);
for (let i = 0; i < 5; i++)
  box(1.3, 0.015, 0.01, mats.steel, 5.8, 3.65 - i * 0.25, -4.4, lab);
// Beveled wedge extrusion, with a sloped face oriented towards the viewer.
const section = new THREE.Shape();
section.moveTo(1.5, 0.13);
section.lineTo(1.5, 2.0);
section.lineTo(-1.13, 2.0);
section.lineTo(-2.45, 0.4);
section.lineTo(-2.45, 0.13);
section.closePath();
const wedgegeo = new THREE.ExtrudeGeometry(section, {
  depth: 13.5,
  bevelEnabled: true,
  bevelThickness: 0.06,
  bevelSize: 0.06,
  bevelSegments: 3,
  steps: 1,
});
wedgegeo.rotateY(Math.PI / 2);
wedgegeo.translate(-6.75, 0, 0);
mesh(wedgegeo, mats.dark);
for (const x of [-6.77, 6.77]) {
  const sidegeo = new THREE.ExtrudeGeometry(section, {
    depth: 0.13,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 2,
    steps: 1,
  });
  sidegeo.rotateY(Math.PI / 2);
  sidegeo.translate(x - 0.065, 0.018, 0);
  mesh(sidegeo, mats.steel);
}
for (const y of [0.2, 0.32]) {
  box(13.3, 0.025, 0.025, mats.warm, 0, y, 2.51);
  box(0.025, 0.025, 3.9, mats.warm, -6.69, y, 0.52);
  box(0.025, 0.025, 3.9, mats.warm, 6.69, y, 0.52);
}
for (const x of [-5.9, 5.9])
  for (const z of [-1.05, 1.95]) cyl(0.26, 0.15, mats.rubber, x, 0.05, z);
const plaque = label(
  "P E N D U L U M    /    R H Y T H M",
  "#a5b5c3",
  3.8,
  0.14,
);
plaque.position.set(0, 1.92, 1.3);
for (const x of [-3.35, 3.35]) {
  box(0.93, 0.16, 0.92, mats.steel, x, 2.13, -0.43);
  for (const dx of [-0.32, 0.32])
    for (const dz of [-0.31, 0.31])
      cyl(
        0.065,
        0.06,
        mats.brass,
        x + dx,
        2.24,
        -0.43 + dz,
        undefined,
        0.065,
        6,
      );
  box(0.59, 0.36, 0.58, mats.dark, x, 2.4, -0.43);
  box(0.27, 4.45, 0.29, mats.steel, x, 4.76, -0.43);
  box(0.04, 4.4, 0.04, mats.brass, x + 0.1, 4.75, -0.27);
  box(0.6, 0.51, 0.6, mats.brass, x, 6.96, -0.43);
  for (const dx of [-0.19, 0.19]) {
    const bolt = cyl(
      0.065,
      0.1,
      mats.steel,
      x + dx,
      7.02,
      -0.07,
      undefined,
      0.065,
      6,
    );
    bolt.rotation.x = Math.PI / 2;
  }
}
box(7.18, 0.49, 0.5, mats.steel, 0, 7.22, -0.43);
box(6.65, 0.025, 0.022, mats.brass, 0, 7.45, -0.17);
box(6.24, 3.83, 0.02, mats.glass, 0, 4.75, -0.64);
for (const x of [-3.1, 3.1]) box(0.012, 3.83, 0.018, mats.blue, x, 4.75, -0.62);
for (const y of [2.84, 6.66]) box(6.22, 0.012, 0.018, mats.blue, 0, y, -0.62);
function register(obj, type, index = 0) {
  obj.userData = { type, index };
  pickables.push(obj);
  return obj;
}
function makePendulum(i, wave = false) {
  const group = new THREE.Group();
  instrument.add(group);
  const x = wave ? -2.66 + (i * 5.32) / 14 : i ? 1.45 : -1.45,
    pivot = new THREE.Group();
  pivot.position.set(x, 6.7, 0);
  group.add(pivot);
  const hardware = new THREE.Group();
  hardware.position.copy(pivot.position);
  group.add(hardware);
  box(wave ? 0.15 : 0.45, 0.3, 0.33, mats.dark, 0, 0.26, -0.22, hardware);
  const washer = cyl(
    wave ? 0.1 : 0.23,
    0.05,
    mats.steel,
    0,
    0,
    -0.13,
    hardware,
  );
  washer.rotation.x = Math.PI / 2;
  const pin = cyl(wave ? 0.035 : 0.07, 0.44, mats.brass, 0, 0, -0.06, hardware);
  pin.rotation.x = Math.PI / 2;
  const hub = cyl(
    wave ? 0.09 : 0.19,
    0.13,
    i % 2 ? mats.brass : mats.steel,
    0,
    0,
    0.04,
    hardware,
  );
  hub.rotation.x = Math.PI / 2;
  ring(
    wave ? 0.11 : 0.24,
    0.013,
    i % 2 ? mats.amber : mats.blue,
    0,
    0,
    0.12,
    hardware,
  );
  if (!wave) {
    for (let k = -3; k <= 3; k++) {
      const a = k * 0.12;
      const tick = box(
        0.008,
        0.055,
        0.012,
        mats.white,
        Math.sin(a) * 0.43,
        -Math.cos(a) * 0.43,
        0.13,
        hardware,
      );
      tick.rotation.z = a;
    }
    exploded.push(
      {
        obj: washer,
        base: washer.position.clone(),
        shift: new THREE.Vector3(-0.43, 0, 0.55),
      },
      {
        obj: pin,
        base: pin.position.clone(),
        shift: new THREE.Vector3(0.4, 0.25, 0.6),
      },
      {
        obj: hub,
        base: hub.position.clone(),
        shift: new THREE.Vector3(0.2, 0, 1.05),
      },
    );
  }
  const rod = cyl(
    wave ? 0.014 : 0.023,
    1,
    wave ? mats.steel : i % 2 ? mats.brass : mats.steel,
    0,
    -0.5,
    0,
    pivot,
  );
  const bob = new THREE.Group();
  pivot.add(bob);
  const r = wave ? 0.13 : i ? 0.25 : 0.34;
  const bobMaterial = mats.brass.clone();
  bobMaterial.flatShading = true;
  const sphere = mesh(
    new THREE.IcosahedronGeometry(r, 1),
    bobMaterial,
    0,
    0,
    0,
    bob,
  );
  const neck = cyl(r * 0.17, r * 0.45, mats.brass, 0, r * 1.09, 0, bob);
  cyl(r * 0.36, r * 0.16, mats.steel, 0, r * 0.86, 0, bob);
  mesh(
    new THREE.ConeGeometry(r * 0.29, r * 0.33, 8),
    mats.brass,
    0,
    -r * 1.07,
    0,
    bob,
  ).rotation.z = Math.PI;
  const hit = register(
    mesh(
      new THREE.SphereGeometry(Math.max(r * 1.55, 0.22), 16, 10),
      new THREE.MeshBasicMaterial({ visible: false }),
      0,
      0,
      0,
      bob,
    ),
    "bob",
    i,
  );
  const ghosts = [];
  for (let k = 0; k < 3; k++) {
    const g = mesh(
      new THREE.IcosahedronGeometry(r, 1),
      new THREE.MeshBasicMaterial({
        color: "#7997b6",
        transparent: true,
        opacity: 0.12 / (k + 1),
        depthWrite: false,
      }),
      0,
      0,
      0,
      group,
    );
    ghosts.push(g);
  }
  const tg = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 35 }, () => new THREE.Vector3()),
  );
  const trail = new THREE.Line(
    tg,
    new THREE.LineBasicMaterial({
      color: i % 2 ? "#e7ac69" : "#82baf6",
      transparent: true,
      opacity: wave ? 0.14 : 0.32,
    }),
  );
  group.add(trail);
  return { group, pivot, hardware, rod, bob, hit, ghosts, trail, x, wave, r };
}
for (let i = 0; i < 2; i++) pendulums.push(makePendulum(i));
const waves = Array.from({ length: 15 }, (_, i) => makePendulum(i, true));
waves.forEach((p) => (p.group.visible = false));
// The phase dial and the model-sampled, past/future oscilloscope.
const phaseGroup = new THREE.Group();
phaseGroup.position.set(0, 4.72, -0.1);
instrument.add(phaseGroup);
for (const [i, r] of [0.38, 0.54, 0.69, 0.81].entries())
  ring(r, 0.008, i % 2 ? mats.steel : mats.blue, 0, 0, 0, phaseGroup);
const hands = [new THREE.Group(), new THREE.Group()];
for (let i = 0; i < 2; i++) {
  phaseGroup.add(hands[i]);
  const r = i ? 0.69 : 0.54;
  box(0.013, r, 0.014, i ? mats.amber : mats.blue, 0, r / 2, 0.035, hands[i]);
  mesh(
    new THREE.SphereGeometry(0.043, 12, 8),
    i ? mats.amber : mats.blue,
    0,
    r,
    0.04,
    hands[i],
  );
}
const inLabel = label("IN STEP", "#fbe4ad", 0.9, 0.22, phaseGroup);
inLabel.position.set(0, -1.03, 0);
const phaseText = label("PHASE RELATION", "#95b5d2", 1.5, 0.2, phaseGroup);
phaseText.position.set(0, 1.02, 0);
const curves = [];
for (let i = 0; i < 2; i++) {
  const geo = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 181 }, () => new THREE.Vector3()),
  );
  const line = new THREE.Line(
    geo,
    new THREE.LineBasicMaterial({
      color: i ? "#ffb454" : "#72b8ff",
      transparent: true,
      opacity: 0.87,
    }),
  );
  instrument.add(line);
  curves.push(line);
}
const nowLine = box(0.012, 0.86, 0.014, mats.white, 0, 3.12, 0.18);
const curveLabel = label("PAST  ←  NOW  →  PREDICTION", "#6c8ba7", 2.65, 0.085);
curveLabel.position.set(0, 2.62, 0.23);
const slopeAngle = -0.69;
function slope(obj) {
  obj.rotation.x = slopeAngle;
  return obj;
}
for (let i = 0; i < 2; i++) {
  const group = new THREE.Group();
  group.position.set(i ? 4.55 : -4.55, 1.21, 1.88);
  group.rotation.x = slopeAngle;
  instrument.add(group);
  const base = cyl(0.68, 0.09, mats.rubber, 0, 0, 0, group);
  base.rotation.x = Math.PI / 2;
  const rim = cyl(0.6, 0.09, mats.steel, 0, 0, 0.06, group);
  rim.rotation.x = Math.PI / 2;
  const disc = cyl(0.49, 0.13, mats.dark, 0, 0, 0.14, group);
  disc.rotation.x = Math.PI / 2;
  ring(0.53, 0.02, i ? mats.amber : mats.blue, 0, 0, 0.12, group);
  for (let k = 0; k < 32; k++) {
    const a = (k * Math.PI) / 16;
    const tick = box(
      0.008,
      k % 4 ? 0.04 : 0.09,
      0.009,
      k % 4 ? mats.steel : mats.white,
      Math.sin(a) * 0.73,
      Math.cos(a) * 0.73,
      0.1,
      group,
    );
    tick.rotation.z = -a;
  }
  const pointer = box(
    0.035,
    0.3,
    0.025,
    i ? mats.amber : mats.blue,
    0,
    0.28,
    0.225,
    group,
  );
  const value = label(
    i ? "23.1 CM" : "36.9 CM",
    i ? "#ffd09b" : "#9cd3ff",
    0.8,
    0.28,
    group,
  );
  value.position.set(0, -0.91, 0.05);
  const title = label(
    i ? "AMBER / LENGTH" : "BLUE / LENGTH",
    "#a4b4c5",
    1.6,
    0.2,
    group,
  );
  title.position.set(0, 1.05, 0);
  register(
    mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.22, 32),
      new THREE.MeshBasicMaterial({ visible: false }),
      0,
      0,
      0.08,
      group,
    ),
    "knob",
    i,
  ).rotation.x = Math.PI / 2;
  knobs.push({ group, pointer, value });
}
const bandGroup = new THREE.Group();
bandGroup.position.set(0, 1.15, 1.97);
bandGroup.rotation.x = slopeAngle;
instrument.add(bandGroup);
box(6.12, 0.8, 0.09, mats.rubber, 0, 0, 0, bandGroup);
box(6.0, 0.68, 0.04, mats.steel, 0, 0, 0.05, bandGroup);
const bandCanvas = document.createElement("canvas");
bandCanvas.width = 1400;
bandCanvas.height = 170;
const bandctx = bandCanvas.getContext("2d"),
  bandTexture = new THREE.CanvasTexture(bandCanvas);
const band = register(
  mesh(
    new THREE.PlaneGeometry(5.8, 0.54),
    new THREE.MeshBasicMaterial({ map: bandTexture }),
    0,
    0,
    0.077,
    bandGroup,
  ),
  "band",
);
for (const x of [-3.28, 3.28]) {
  const arrow = label(x < 0 ? "‹" : "›", "#b0cbdf", 0.3, 0.4, bandGroup);
  arrow.position.set(x, 0, 0.08);
  register(
    mesh(
      new THREE.SphereGeometry(0.25, 12, 8),
      new THREE.MeshBasicMaterial({ visible: false }),
      x,
      0,
      0.08,
      bandGroup,
    ),
    x < 0 ? "previous" : "next",
  );
}
const elabels = [];
for (const [text, x, y, z] of [
  ["BEARING", -2.45, 7.0, 0.7],
  ["WASHER", -0.9, 6.15, 0.7],
  ["CROSS PIN", 1.85, 7.15, 1],
  ["HUB", 2.45, 6.15, 1.3],
  ["LIGHT ROD", -2.3, 4.8, 0.9],
  ["FACETED BRASS", -0.1, 2.5, 0.9],
]) {
  const s = label(text, "#acd6f0", 1.7, 0.26);
  s.position.set(x, y, z);
  s.visible = false;
  elabels.push(s);
}
function resetCamera() {
  const mobile = innerWidth < 700;
  const aspect = innerWidth / innerHeight;
  let dist = mobile
    ? Math.max(31, (13.9 / (2 * Math.tan(Math.PI / 12) * aspect)) * 1.2)
    : Math.max(24.5, 14.8 / (2 * Math.tan(Math.PI / 12) * aspect));
  if (mobile) controls.target.set(0, 3.25, 0);
  else controls.target.set(-0.3, 3.65, 0.1);
  scene.fog.near = mobile ? dist + 10 : 28;
  scene.fog.far = mobile ? dist + 40 : 65;
  const yaw = model.mode === "wave" ? 0.31 : 0;
  camera.position.set(
    controls.target.x + Math.sin(yaw) * dist,
    controls.target.y + Math.sin(0.172) * dist,
    controls.target.z + Math.cos(yaw) * Math.cos(0.172) * dist,
  );
  camera.lookAt(controls.target);
  controls.update();
  render();
}
function bobPosition(p, angle, L) {
  const v = new THREE.Vector3(0, -L * 10, 0);
  if (p.wave) v.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle);
  else v.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
  return v.add(new THREE.Vector3(p.x, 6.7, 0));
}
function updateInstrument() {
  const state = model.state(),
    wave = model.mode === "wave",
    active = wave ? waves : pendulums;
  pendulums.forEach((p) => (p.group.visible = !wave));
  waves.forEach((p) => (p.group.visible = wave));
  phaseGroup.visible = !wave;
  curves.forEach((c) => (c.visible = !wave));
  curveLabel.visible = !wave;
  nowLine.visible = !wave;
  knobs.forEach((k) => (k.group.visible = !wave));
  for (let i = 0; i < active.length; i++) {
    const p = active[i],
      L = model.lengths[i],
      angle = state.angles[i];
    p.pivot.rotation.set(p.wave ? angle : 0, 0, p.wave ? 0 : angle);
    const rodL = L * 10 - p.r * 1.12;
    p.rod.scale.y = rodL;
    p.rod.position.y = -rodL / 2;
    p.bob.position.y = -L * 10;
    if (view === "Exploded" && !wave) {
      p.rod.position.z = 0.65;
      p.bob.position.z = 1.1;
    } else {
      p.rod.position.z = 0;
      p.bob.position.z = 0;
    }
    for (let k = 0; k < 3; k++) {
      const t = Math.max(0, model.time - 0.075 * (k + 1));
      p.ghosts[k].position.copy(bobPosition(p, model.state(t).angles[i], L));
      p.ghosts[k].visible = view !== "Exploded" && model.time > 0.1;
    }
    const ar = p.trail.geometry.attributes.position.array;
    for (let k = 0; k < 35; k++) {
      const pos = bobPosition(
        p,
        model.state(Math.max(0, model.time - (34 - k) * 0.007)).angles[i],
        L,
      );
      ar[k * 3] = pos.x;
      ar[k * 3 + 1] = pos.y;
      ar[k * 3 + 2] = pos.z - 0.04;
    }
    p.trail.geometry.attributes.position.needsUpdate = true;
    p.trail.visible = view !== "Exploded";
  }
  if (!wave) {
    for (let i = 0; i < 2; i++) {
      hands[i].rotation.z = -state.phases[i];
      const a = curves[i].geometry.attributes.position.array;
      for (let k = 0; k < 181; k++) {
        const d = (k - 90) / 30;
        const s = model.state(Math.max(0, model.time + d)).angles[i];
        a[k * 3] = (k - 90) / 45;
        a[k * 3 + 1] = 3.12 + s * 1.15;
        a[k * 3 + 2] = 0.22 + i * 0.012;
      }
      curves[i].geometry.attributes.position.needsUpdate = true;
      knobs[i].pointer.rotation.z =
        (-(model.lengths[i] - (i ? 0.09 : 0.2)) / (i ? 0.21 : 0.17)) *
        Math.PI *
        1.6;
    }
    const diff = state.phases[1] - state.phases[0],
      match = Math.abs(Math.atan2(Math.sin(diff), Math.cos(diff)));
    inLabel.visible = match < 0.13;
    phaseGroup.children
      .filter((o) => o.isMesh)
      .forEach(
        (o) =>
          (o.material.emissiveIntensity =
            o.material === mats.blue ? (match < 0.13 ? 1.6 : 1.1) : 0),
      );
  }
  exploded.forEach((e) =>
    e.obj.position
      .copy(e.base)
      .add(view === "Exploded" ? e.shift : new THREE.Vector3()),
  );
  return state;
}
function drawBand() {
  const w = 1400,
    h = 170,
    c = bandctx;
  c.fillStyle = "#101c2b";
  c.fillRect(0, 0, w, h);
  c.strokeStyle = "#2a3d54";
  c.lineWidth = 1;
  for (let x = 0; x < w; x += 70) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, h);
    c.stroke();
  }
  for (let y = 35; y < h; y += 35) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(w, y);
    c.stroke();
  }
  for (let i = 0; i < Math.min(2, model.lengths.length); i++) {
    c.beginPath();
    c.strokeStyle = i ? "#ffb454" : "#79b9ff";
    c.lineWidth = 2.4;
    for (let x = 0; x < w; x += 4) {
      const t = model.time + (x / w - 0.5) * 7,
        q = model.state(Math.max(0, t)).angles[i];
      const y = 85 + q * 165;
      if (x) c.lineTo(x, y);
      else c.moveTo(x, y);
    }
    c.stroke();
  }
  for (const e of model.syncEvents) {
    const x = ((e.time - model.time) / 7 + 0.5) * w;
    if (x < 0 || x > w) continue;
    c.fillStyle = e.kind === "in" ? "#e7f6ff" : "#7b8ba2";
    c.beginPath();
    c.moveTo(x, 13);
    c.lineTo(x - 7, 1);
    c.lineTo(x + 7, 1);
    c.fill();
  }
  for (const e of model.pushEvents) {
    const x = ((e.time - model.time) / 7 + 0.5) * w;
    c.fillStyle = "#ff7a77";
    c.fillRect(x - 3, 14, 6, 145);
  }
  c.strokeStyle = "#e8f8ff";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(w / 2, 0);
  c.lineTo(w / 2, h);
  c.stroke();
  c.font = "20px monospace";
  c.fillStyle = "#a6c1da";
  c.fillText(model.time.toFixed(2) + "s", w / 2 + 12, h - 8);
  bandTexture.needsUpdate = true;
}
function updateUI() {
  const wave = model.mode === "wave";
  $("#bluePeriod").textContent = wave
    ? "15 bobs"
    : model.periods[0].toFixed(3) + " s";
  $("#amberPeriod").textContent = wave
    ? "60 s"
    : model.periods[1].toFixed(3) + " s";
  const beat = wave
    ? 60
    : 1 / Math.abs(1 / model.periods[0] - 1 / model.periods[1]);
  $("#beat").textContent = wave
    ? "≈ 60 s"
    : beat > 10000
      ? "Always"
      : beat.toFixed(2) + " s";
  $("#blueLength").textContent = (model.lengths[0] * 100).toFixed(1) + " cm";
  $("#amberLength").textContent = (model.lengths[1] * 100).toFixed(1) + " cm";
  $("#length0").value = model.lengths[0] * 100;
  $("#length1").value = model.lengths[1] * 100;
  $("#lengthControls").hidden = wave;
  $("#lengthControls").style.display = wave ? "none" : "";
  $("#waveInfo").hidden = !wave;
  $("#time").value = model.time;
  $("#clock").textContent = model.time.toFixed(2).padStart(5, "0") + " s";
  $("#play").textContent = playing ? "Ⅱ Pause" : "▶ Play";
  $("#play").setAttribute(
    "aria-label",
    playing ? "Pause simulation" : "Play simulation",
  );
  const ratio = model.periods[0] / model.periods[1],
    simple = [
      [1, "1:1"],
      [1.25, "5:4"],
      [4 / 3, "4:3"],
      [1.5, "3:2"],
    ].find(([r]) => Math.abs(r - ratio) < 0.006);
  $("#ratioLabel").textContent = wave
    ? "15 INDEPENDENT SWINGS · PHASE COHERENCE"
    : simple
      ? "RATIO LOCKED  " + simple[1] + "  ·  FINITE-BOB PERIODS"
      : "FREE DRIFT · TWO INDEPENDENT SWINGS";
  document
    .querySelectorAll("[data-preset]")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.preset === model.preset),
    );
  document
    .querySelectorAll("[data-view]")
    .forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  document
    .querySelectorAll("[data-speed]")
    .forEach((b) =>
      b.classList.toggle("active", Number(b.dataset.speed) === speed),
    );
  $("#formation").textContent = wave
    ? (() => {
        const f = model.formation(),
          max = Math.max(...f),
          n = f.indexOf(max) + 1;
        return `${n === 1 ? "TOGETHER" : n + " GROUPS"}  ·  coherence ${(max * 100).toFixed(0)}%`;
      })()
    : "";
}
function render() {
  updateInstrument();
  drawBand();
  updateUI();
  controls.update();
  composer.render();
  renderCount++;
}
function setView(name) {
  if (!["Lab", "Exploded", "Studio"].includes(name)) return;
  view = name;
  lab.visible = name === "Lab";
  scene.background.set(
    name === "Studio" ? "#d6d0bf" : name === "Exploded" ? "#101c33" : "#172334",
  );
  scene.fog.color.copy(scene.background);
  floor.material.color.set(name === "Studio" ? "#c6beaa" : "#131b26");
  floor.material.roughness = name === "Studio" ? 0.55 : 0.25;
  key.color.set(name === "Studio" ? "#fff6e6" : "#ffe0ac");
  key.intensity = name === "Studio" ? 3 : 2.1;
  fill.intensity = name === "Studio" ? 1 : 0.7;
  accentLights.visible = name !== "Studio";
  floorGlow.visible = name !== "Studio";
  floorReflection.material.uniforms.color.value.set(
    name === "Studio" ? "#b8b1a4" : "#11151e",
  );
  floorReflection.material.uniforms.reflectionStrength.value =
    name === "Studio" ? 0.12 : 0.27;
  elabels.forEach(
    (s) => (s.visible = name === "Exploded" && model.mode !== "wave"),
  );
  $("#viewLegend").hidden = name !== "Exploded";
  document.body.classList.toggle("studio", name === "Studio");
  render();
}
function setPreset(name) {
  model.setPreset(name);
  playing = true;
  resetCamera();
  setView(view);
}
function setTime(t) {
  model.setTime(t);
  if (t > Number($("#time").max)) $("#time").max = 180;
  render();
}
function snapLength(i, cm) {
  let L = cm / 100;
  const other = i ? 0 : 1;
  for (const ratio of [1, 1.25, 4 / 3, 1.5]) {
    const t =
        period(model.lengths[other], model.radii[other], model.amplitude) *
        (i ? 1 / ratio : ratio),
      target = solveLength(t, model.radii[i], model.amplitude);
    if (Math.abs(target - L) < 0.0018) {
      L = target;
      break;
    }
  }
  model.setLength(i, L * 100);
  render();
}
function jump(dir) {
  const times = model.syncEvents
      .filter((e) => e.kind === "in")
      .map((e) => e.time),
    t =
      dir > 0
        ? times.find((x) => x > model.time + 0.025)
        : times.filter((x) => x < model.time - 0.025).at(-1);
  if (t !== undefined) setTime(t);
}
$("#play").onclick = () => {
  playing = !playing;
  render();
};
$("#time").oninput = (e) => setTime(Number(e.target.value));
$("#extend").onclick = () => {
  $("#time").max = 180;
  $("#extend").textContent = "180 s";
};
for (let i = 0; i < 2; i++) {
  $("#length" + i).oninput = (e) => snapLength(i, Number(e.target.value));
  $("#push" + i).onclick = () => {
    model.push(i, 0.45);
    render();
  };
}
$("#previous").onclick = () => jump(-1);
$("#next").onclick = () => jump(1);
$("#release").onclick = () => {
  model.release();
  playing = true;
  render();
};
document
  .querySelectorAll("[data-preset]")
  .forEach((b) => (b.onclick = () => setPreset(b.dataset.preset)));
document.querySelectorAll("[data-speed]").forEach(
  (b) =>
    (b.onclick = () => {
      speed = Number(b.dataset.speed);
      render();
    }),
);
document
  .querySelectorAll("[data-view]")
  .forEach((b) => (b.onclick = () => setView(b.dataset.view)));
$("#cinematic").onclick = () => {
  cinematic = !cinematic;
  $("#cinematic").classList.toggle("active", cinematic);
};
$("#help").onclick = () => $("#helpDialog").showModal();
$("#closeHelp").onclick = () => $("#helpDialog").close();
$("#mobileMore").onclick = () => $("#controls").classList.toggle("expanded");
const raycaster = new THREE.Raycaster(),
  mouse = new THREE.Vector2();
function pick(e) {
  mouse.set(
    (e.clientX / innerWidth) * 2 - 1,
    (-e.clientY / innerHeight) * 2 + 1,
  );
  raycaster.setFromCamera(mouse, camera);
  const visible = pickables.filter((p) => {
    let q = p;
    while (q) {
      if (!q.visible) return false;
      q = q.parent;
    }
    return true;
  });
  return raycaster.intersectObjects(visible, false)[0];
}
renderer.domElement.addEventListener(
  "pointerdown",
  (e) => {
    if (e.button !== 0) return;
    const hit = pick(e);
    if (!hit) return;
    const obj = hit.object,
      d = obj.userData;
    interaction = {
      type: d.type,
      index: d.index,
      x: e.clientX,
      y: e.clientY,
      startLength: model.lengths[d.index],
      startTime: model.time,
      wasPlaying: playing,
      moved: false,
    };
    controls.enabled = false;
    if (["bob", "band", "knob"].includes(d.type)) playing = false;
    renderer.domElement.setPointerCapture(e.pointerId);
  },
  true,
);
renderer.domElement.addEventListener(
  "pointermove",
  (e) => {
    if (!interaction) return;
    const q = interaction,
      dx = e.clientX - q.x,
      dy = e.clientY - q.y;
    if (Math.hypot(dx, dy) > 5) q.moved = true;
    if (!q.moved) return;
    if (q.type === "knob") {
      snapLength(q.index, q.startLength * 100 + (dx - dy) * 0.045);
    } else if (q.type === "band") {
      setTime(q.startTime + (dx / innerWidth) * 18);
    } else if (q.type === "bob") {
      if (Math.abs(dy) > Math.abs(dx) * 1.15) {
        snapLength(q.index, q.startLength * 100 + dy * 0.06);
      } else {
        model.setAmplitude(Math.min(26, Math.max(2, 16 + dx * 0.13)));
        render();
      }
    }
  },
  true,
);
renderer.domElement.addEventListener(
  "pointerup",
  (e) => {
    if (!interaction) return;
    const q = interaction;
    interaction = null;
    controls.enabled = true;
    if (!q.moved) {
      if (q.type === "bob") model.push(q.index, 0.48);
      if (q.type === "knob") {
        const ratios = [1, 1.25, 4 / 3, 1.5],
          current = model.periods[0] / model.periods[1];
        let targets = ratios
          .map((r) => {
            const t =
              period(
                model.lengths[q.index ? 0 : 1],
                model.radii[q.index ? 0 : 1],
                model.amplitude,
              ) * (q.index ? 1 / r : r);
            return {
              r,
              L: solveLength(t, model.radii[q.index], model.amplitude),
            };
          })
          .filter(
            (o) =>
              o.L >= (q.index ? 0.09 : 0.2) && o.L <= (q.index ? 0.3 : 0.37),
          );
        const next = targets.find((o) => o.r > current + 0.012) || targets[0];
        if (next) model.setLength(q.index, next.L * 100);
      }
      if (q.type === "band") {
        const hit = pick(e);
        if (hit?.uv) {
          const t = model.time + (hit.uv.x - 0.5) * 7;
          const event = model.syncEvents.reduce((a, b) =>
            Math.abs(b.time - t) < Math.abs(a.time - t) ? b : a,
          );
          setTime(Math.abs(event.time - t) < 0.25 ? event.time : t);
        }
      }
      if (q.type === "previous") jump(-1);
      if (q.type === "next") jump(1);
    }
    playing = q.type === "band" ? q.wasPlaying : true;
    render();
  },
  true,
);
renderer.domElement.addEventListener("pointercancel", () => {
  interaction = null;
  controls.enabled = true;
});
window.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName) || $("#helpDialog").open)
    return;
  const k = e.key;
  if (k === " ") {
    e.preventDefault();
    playing = !playing;
  } else if (k === ",") {
    playing = false;
    setTime(model.time - 1 / 120);
  } else if (k === ".") {
    playing = false;
    setTime(model.time + 1 / 120);
  } else if (k === "[") jump(-1);
  else if (k === "]") jump(1);
  else if ("12345".includes(k))
    setPreset(["Drift", "5:4", "3:2", "Twins", "Wave"][Number(k) - 1]);
  else if (k === "0") {
    model.release();
    playing = true;
  } else if (e.shiftKey && k.toLowerCase() === "o") model.push(0, 0.45);
  else if (e.shiftKey && k.toLowerCase() === "p") model.push(1, 0.45);
  else if (e.shiftKey && k.toLowerCase() === "v")
    setView(
      ["Lab", "Exploded", "Studio"][
        (["Lab", "Exploded", "Studio"].indexOf(view) + 1) % 3
      ],
    );
  else if (k.toLowerCase() === "r") resetCamera();
  else if (k.toLowerCase() === "c") cinematic = !cinematic;
  else if (k === "/") {
    e.preventDefault();
    document.body.classList.toggle("uihidden");
  }
  render();
});
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  resetCamera();
});
function coordinates() {
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const out = [];
  for (const obj of pickables) {
    let parent = obj,
      visible = true;
    while (parent) {
      if (!parent.visible) visible = false;
      parent = parent.parent;
    }
    if (!visible) continue;
    const p = obj.getWorldPosition(new THREE.Vector3()).project(camera);
    out.push({
      ...obj.userData,
      x: ((p.x + 1) * innerWidth) / 2,
      y: ((1 - p.y) * innerHeight) / 2,
    });
  }
  return out;
}
window.pendulumLab = {
  ready: true,
  snapshot() {
    const s = model.state();
    return {
      time: model.time,
      playing,
      speed,
      mode: model.mode,
      preset: model.preset,
      lengths: [...model.lengths],
      radii: [...model.radii],
      angles: s.angles,
      angularVelocities: s.angularVelocities,
      periods: [...model.periods],
      phases: s.phases,
      syncEvents: model.syncEvents.map((e) => ({ ...e })),
      pushEvents: model.pushEvents.map((e) => ({ ...e })),
      view,
      camera: {
        position: camera.position.toArray(),
        target: controls.target.toArray(),
        fov: camera.fov,
      },
      renderCount,
      interactive: coordinates(),
      formation: model.formation(),
      amplitude: model.amplitude,
      repairCount,
      revision: "refined-01",
      lighting: {
        planarReflection: true,
        reflectionResolution: floorReflection.getRenderTarget().width,
      },
    };
  },
  setPreset,
  setTime,
  play() {
    playing = true;
    render();
  },
  pause() {
    playing = false;
    render();
  },
  setSpeed(v) {
    if ([0.25, 0.5, 1].includes(v)) speed = v;
    render();
  },
  setLength(i, cm) {
    model.setLength(i, cm);
    render();
  },
  push(i, d) {
    model.push(i, d);
    render();
  },
  release() {
    model.release();
    playing = true;
    render();
  },
  setView,
  resetCamera,
  setCinematic(b) {
    cinematic = !!b;
    render();
  },
};
resetCamera();
function animate(now) {
  const elapsed = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (playing && !interaction) model.advance(elapsed * speed);
  if (cinematic && !interaction) {
    const d = camera.position.clone().sub(controls.target),
      angle = 0.035 * elapsed;
    d.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    camera.position.copy(controls.target).add(d);
  }
  updateInstrument();
  if (renderCount % 5 === 0) {
    drawBand();
    updateUI();
  }
  controls.update();
  composer.render();
  renderCount++;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
