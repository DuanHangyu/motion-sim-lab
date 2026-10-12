var $ = (t) => document.querySelector(t),
  $$ = (t) => Array.from(document.querySelectorAll(t)),
  loading = $("#loading"),
  THREE,
  OrbitControls;
try {
  ((THREE = await import("three")),
    ({ OrbitControls } =
      await import("three/addons/controls/OrbitControls.js")));
} catch (t) {
  throw (
    (loading.innerHTML =
      "Could not load Three.js from the CDN<small>Check your connection and reload</small>"),
    t
  );
}
var PLANET_KM = 340,
  HS = 0.055,
  HMIN = -0.6,
  HMAX = 1.25,
  ELEV_M = 6e3,
  MAXH = 24,
  TAU = Math.PI * 2,
  HPI = Math.PI / 2,
  DEFAULTS = {
    brushKm: 96,
    strength: 0.65,
    sea: -0.12,
    temp: 0.37,
    moist: 0.58,
    erosion: 4,
    atm: 1,
    clouds: 0.55,
  },
  reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches,
  isSmall = Math.min(innerWidth, innerHeight) < 700,
  C = isSmall ? 320 : 512,
  R = C / 2,
  W1 = C + 1,
  N = (R + 1) * W1,
  BIOMES = [
    { name: "Ocean", hex: "#1f8f9e" },
    { name: "Beach", hex: "#d9b877" },
    { name: "Grassland", hex: "#8fa832" },
    { name: "Forest", hex: "#3f6b1f" },
    { name: "Taiga", hex: "#2f7a78" },
    { name: "Desert", hex: "#d98246" },
    { name: "Tundra", hex: "#7f95a3" },
    { name: "Ice", hex: "#e6ecef" },
  ],
  ROCK = { name: "Mountain", hex: "#6f665f" },
  RIVER = { name: "River", hex: "#2a8fa0" },
  state = {
    ...DEFAULTS,
    tool: "raise",
    biome: 2,
    seed: "7X4J-19Q2-8K7B",
    showClouds: !0,
    brushPreview: !0,
    autoRotate: !1,
  },
  clamp = (t, e, a) => (t < e ? e : t > a ? a : t),
  smooth = (t, e, a) => {
    const o = clamp((a - t) / (e - t), 0, 1);
    return o * o * (3 - 2 * o);
  };
function xmur3(t) {
  let e = 1779033703 ^ t.length;
  for (let a = 0; a < t.length; a++)
    ((e = Math.imul(e ^ t.charCodeAt(a), 3432918353)),
      (e = (e << 13) | (e >>> 19)));
  return () => (
    (e = Math.imul(e ^ (e >>> 16), 2246822507)),
    (e = Math.imul(e ^ (e >>> 13), 3266489909)),
    (e ^= e >>> 16) >>> 0
  );
}
function mulberry32(t) {
  return () => {
    ((t |= 0), (t = (t + 1831565813) | 0));
    let e = Math.imul(t ^ (t >>> 15), 1 | t);
    return (
      (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
var makeRng = (t) => mulberry32(xmur3(t)()),
  SEED_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomSeed() {
  const t = [];
  for (let e = 0; e < 3; e++) {
    let a = "";
    for (let o = 0; o < 4; o++)
      a += SEED_CHARS[Math.floor(Math.random() * SEED_CHARS.length)];
    t.push(a);
  }
  return t.join("-");
}
var GRAD3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
    -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]),
  F3 = 1 / 3,
  G3 = 1 / 6,
  Simplex3 = class {
    constructor(t) {
      const e = new Uint8Array(256);
      for (let a = 0; a < 256; a++) e[a] = a;
      for (let a = 255; a > 0; a--) {
        const o = Math.floor(t() * (a + 1)),
          c = e[a];
        ((e[a] = e[o]), (e[o] = c));
      }
      ((this.perm = new Uint8Array(512)), (this.pm = new Uint8Array(512)));
      for (let a = 0; a < 512; a++)
        ((this.perm[a] = e[a & 255]), (this.pm[a] = this.perm[a] % 12));
    }
    noise(t, e, a) {
      const o = this.perm,
        c = this.pm,
        s = (t + e + a) * F3,
        i = Math.floor(t + s),
        r = Math.floor(e + s),
        n = Math.floor(a + s),
        d = (i + r + n) * G3,
        l = t - (i - d),
        f = e - (r - d),
        u = a - (n - d);
      let M, v, p, m, g, h;
      l >= f
        ? f >= u
          ? ((M = 1), (v = 0), (p = 0), (m = 1), (g = 1), (h = 0))
          : l >= u
            ? ((M = 1), (v = 0), (p = 0), (m = 1), (g = 0), (h = 1))
            : ((M = 0), (v = 0), (p = 1), (m = 1), (g = 0), (h = 1))
        : f < u
          ? ((M = 0), (v = 0), (p = 1), (m = 0), (g = 1), (h = 1))
          : l < u
            ? ((M = 0), (v = 1), (p = 0), (m = 0), (g = 1), (h = 1))
            : ((M = 0), (v = 1), (p = 0), (m = 1), (g = 1), (h = 0));
      const x = l - M + G3,
        S = f - v + G3,
        k = u - p + G3,
        z = l - m + 2 * G3,
        P = f - g + 2 * G3,
        A = u - h + 2 * G3,
        E = l - 1 + 3 * G3,
        U = f - 1 + 3 * G3,
        T = u - 1 + 3 * G3,
        F = i & 255,
        L = r & 255,
        b = n & 255;
      let D = 0,
        w;
      if (((w = 0.6 - l * l - f * f - u * u), w > 0)) {
        const y = c[F + o[L + o[b]]] * 3;
        ((w *= w),
          (D += w * w * (GRAD3[y] * l + GRAD3[y + 1] * f + GRAD3[y + 2] * u)));
      }
      if (((w = 0.6 - x * x - S * S - k * k), w > 0)) {
        const y = c[F + M + o[L + v + o[b + p]]] * 3;
        ((w *= w),
          (D += w * w * (GRAD3[y] * x + GRAD3[y + 1] * S + GRAD3[y + 2] * k)));
      }
      if (((w = 0.6 - z * z - P * P - A * A), w > 0)) {
        const y = c[F + m + o[L + g + o[b + h]]] * 3;
        ((w *= w),
          (D += w * w * (GRAD3[y] * z + GRAD3[y + 1] * P + GRAD3[y + 2] * A)));
      }
      if (((w = 0.6 - E * E - U * U - T * T), w > 0)) {
        const y = c[F + 1 + o[L + 1 + o[b + 1]]] * 3;
        ((w *= w),
          (D += w * w * (GRAD3[y] * E + GRAD3[y + 1] * U + GRAD3[y + 2] * T)));
      }
      return 32 * D;
    }
  };
function fbm(t, e, a, o, c) {
  let s = 1,
    i = 1,
    r = 0,
    n = 0;
  for (let d = 0; d < c; d++)
    ((r += s * t.noise(e * i, a * i, o * i)),
      (n += s),
      (s *= 0.5),
      (i *= 2.02));
  return r / n;
}
function ridged(t, e, a, o, c) {
  let s = 1,
    i = 1,
    r = 0,
    n = 0,
    d = 1;
  for (let l = 0; l < c; l++) {
    let f = 1 - Math.abs(t.noise(e * i, a * i, o * i));
    ((f = f * f * d),
      (d = clamp(f * 2, 0, 1)),
      (r += f * s),
      (n += s),
      (s *= 0.5),
      (i *= 2.1));
  }
  return r / n;
}
var W = {
  dirs: new Float32Array(N * 3),
  h: new Float32Array(N),
  nrm: new Float32Array(N * 3),
  moist: new Float32Array(N),
  flow: new Float32Array(N),
  pid: new Uint8Array(N),
  pw: new Uint8Array(N),
  acc: new Float32Array(N),
  down: new Int32Array(N),
  tmp: new Float32Array(N),
  keys: new Float64Array((R + 1) * C),
};
for (let t = 0; t <= R; t++) {
  const e = HPI - (t * Math.PI) / R,
    a = Math.cos(e),
    o = Math.sin(e);
  for (let c = 0; c <= C; c++) {
    const s = ((c % C) * TAU) / C,
      i = (t * W1 + c) * 3;
    ((W.dirs[i] = Math.sin(s) * a),
      (W.dirs[i + 1] = o),
      (W.dirs[i + 2] = Math.cos(s) * a));
  }
}
var INDEX = new Uint32Array(R * C * 6);
{
  let t = 0;
  for (let e = 0; e < R; e++)
    for (let a = 0; a < C; a++) {
      const o = e * W1 + a,
        c = o + 1,
        s = o + W1,
        i = s + 1;
      ((INDEX[t++] = o),
        (INDEX[t++] = s),
        (INDEX[t++] = c),
        (INDEX[t++] = c),
        (INDEX[t++] = s),
        (INDEX[t++] = i));
    }
}
function syncPole(t) {
  const e = t * W1;
  let a = 0;
  for (let o = 0; o < C; o++) a += W.h[e + o];
  a /= C;
  for (let o = 0; o <= C; o++) W.h[e + o] = a;
}
function computeFlow() {
  const { h: t, acc: e, down: a, flow: o, keys: c } = W,
    s = state.sea;
  let i = 0;
  for (let n = 0; n <= R; n++)
    for (let d = 0; d < C; d++) {
      const l = n * W1 + d;
      c[i++] = Math.floor((t[l] + 1) * 4e5) * 524288 + l;
    }
  (c.sort(), e.fill(1));
  for (let n = i - 1; n >= 0; n--) {
    const d = c[n],
      l = d - Math.floor(d / 524288) * 524288,
      f = (l / W1) | 0,
      u = l - f * W1;
    if (f === 0 || f === R) {
      a[l] = -1;
      continue;
    }
    const M = t[l];
    let v = -1,
      p = M;
    for (let m = -1; m <= 1; m++) {
      const g = (f + m) * W1;
      for (let h = -1; h <= 1; h++) {
        if (!m && !h) continue;
        let x = u + h;
        x < 0 ? (x += C) : x >= C && (x -= C);
        const S = g + x;
        t[S] < p && ((p = t[S]), (v = S));
      }
    }
    ((a[l] = v), v >= 0 && M > s && (e[v] += e[l]));
  }
  const r = 1 / Math.log(2501);
  for (let n = 0; n <= R; n++) {
    const d = n * W1;
    for (let l = 0; l < C; l++) {
      const f = d + l;
      o[f] = Math.min(1, Math.log(1 + e[f]) * r);
    }
    o[d + C] = o[d];
  }
}
function computeNormals(t, e) {
  const { dirs: a, h: o, nrm: c } = W;
  ((t = Math.max(0, t)), (e = Math.min(R, e)));
  for (let s = t; s <= e; s++) {
    const i = s * W1;
    if (s === 0 || s === R) {
      for (let r = 0; r <= C; r++) {
        const n = (i + r) * 3;
        ((c[n] = a[n]), (c[n + 1] = a[n + 1]), (c[n + 2] = a[n + 2]));
      }
      continue;
    }
    for (let r = 0; r < C; r++) {
      const n = i + r,
        d = i + (r === 0 ? C - 1 : r - 1),
        l = i + r + 1,
        f = n - W1,
        u = n + W1,
        M = 1 + o[d] * HS,
        v = 1 + o[l] * HS,
        p = 1 + o[f] * HS,
        m = 1 + o[u] * HS,
        g = a[l * 3] * v - a[d * 3] * M,
        h = a[l * 3 + 1] * v - a[d * 3 + 1] * M,
        x = a[l * 3 + 2] * v - a[d * 3 + 2] * M,
        S = a[u * 3] * m - a[f * 3] * p,
        k = a[u * 3 + 1] * m - a[f * 3 + 1] * p,
        z = a[u * 3 + 2] * m - a[f * 3 + 2] * p;
      let P = k * x - z * h,
        A = z * g - S * x,
        E = S * h - k * g;
      const U = a[n * 3],
        T = a[n * 3 + 1],
        F = a[n * 3 + 2];
      P * U + A * T + E * F < 0 && ((P = -P), (A = -A), (E = -E));
      const L = Math.sqrt(P * P + A * A + E * E) || 1;
      if (
        ((P /= L),
        (A /= L),
        (E /= L),
        (c[n * 3] = P),
        (c[n * 3 + 1] = A),
        (c[n * 3 + 2] = E),
        r === 0)
      ) {
        const b = (i + C) * 3;
        ((c[b] = P), (c[b + 1] = A), (c[b + 2] = E));
      }
    }
  }
}
var cloudOffset = [0, 0, 0];
function generate(t) {
  const e = makeRng(t),
    a = new Simplex3(e),
    o = [];
  for (let r = 0; r < 8; r++)
    o.push([(e() - 0.5) * 400, (e() - 0.5) * 400, (e() - 0.5) * 400]);
  const { dirs: c, h: s, moist: i } = W;
  for (let r = 0; r <= R; r++) {
    const n = HPI - (r * Math.PI) / R,
      d = Math.abs(n),
      l = r * W1,
      f = 0.36 * Math.exp(-Math.pow((d - 0.42) / 0.17, 2)),
      u = 0.2 * Math.exp(-Math.pow(n / 0.22, 2)),
      M = 0.25 * smooth(0.9, 1.4, d);
    for (let v = 0; v < C; v++) {
      const p = l + v,
        m = c[p * 3],
        g = c[p * 3 + 1],
        h = c[p * 3 + 2],
        x = fbm(a, m * 1.3 + o[0][0], g * 1.3 + o[0][1], h * 1.3 + o[0][2], 3),
        S = fbm(a, m * 1.3 + o[1][0], g * 1.3 + o[1][1], h * 1.3 + o[1][2], 3),
        k = fbm(a, m * 1.3 + o[2][0], g * 1.3 + o[2][1], h * 1.3 + o[2][2], 3),
        z = m + x * 0.4,
        P = g + S * 0.4,
        A = h + k * 0.4,
        E =
          fbm(
            a,
            z * 1.15 + o[3][0],
            P * 1.15 + o[3][1],
            A * 1.15 + o[3][2],
            5,
          ) *
            2.2 -
          0.35,
        U = ridged(
          a,
          z * 2.4 + o[4][0],
          P * 2.4 + o[4][1],
          A * 2.4 + o[4][2],
          5,
        ),
        T = fbm(a, m * 1.6 + o[5][0], g * 1.6 + o[5][1], h * 1.6 + o[5][2], 3),
        F = 1 - smooth(0, 0.18, Math.abs(T * 2)),
        L = smooth(-0.15, 0.25, E),
        b = fbm(a, m * 7 + o[6][0], g * 7 + o[6][1], h * 7 + o[6][2], 3) * 0.07;
      let D = E * 0.55;
      (D < 0 && (D *= 0.75),
        (D +=
          Math.pow(U, 1.6) * (0.2 + 0.8 * F) * 0.75 * L + b * (0.4 + 0.6 * L)),
        (s[p] = clamp(D, HMIN, HMAX)));
      let w =
        0.5 +
        fbm(a, m * 2.3 + o[7][0], g * 2.3 + o[7][1], h * 2.3 + o[7][2], 4) *
          1.6;
      ((w += u - f - M), (i[p] = clamp(w, 0, 1)));
    }
    ((s[l + C] = s[l]), (i[l + C] = i[l]));
  }
  (W.pid.fill(0), W.pw.fill(0), computeFlow());
  for (let r = 0; r <= R; r++) {
    const n = r * W1;
    for (let d = 0; d < C; d++) {
      const l = n + d;
      s[l] > state.sea && (s[l] -= 0.035 * smooth(0.55, 1, W.flow[l]));
    }
    s[n + C] = s[n];
  }
  (syncPole(0),
    syncPole(R),
    computeFlow(),
    computeNormals(0, R),
    (cloudOffset = [e() * 40, e() * 40, e() * 40]),
    generateStars(e));
}
function erodePass() {
  computeFlow();
  const { h: t, acc: e, down: a, tmp: o } = W,
    c = state.sea,
    s = 0.012;
  o.fill(0);
  for (let i = 1; i < R; i++) {
    const r = i * W1;
    for (let n = 0; n < C; n++) {
      const d = r + n,
        l = t[d],
        f = r + (n === 0 ? C - 1 : n - 1),
        u = r + n + 1,
        M = d - W1,
        v = d + W1,
        p = (t[f] + t[u] + t[M] + t[v]) * 0.25 - l,
        m = l - c;
      let g;
      if (m > 0) {
        g = (0.1 + 0.32 * smooth(0.12, 0.5, m)) * p;
        const h = a[d];
        if (h >= 0) {
          const x = l - t[h];
          if (x > 0) {
            let S = s * Math.sqrt(e[d]) * x * 4;
            ((S = Math.min(S, x * 0.45, 0.04)), (g -= S));
          }
        }
      } else g = 0.06 * p;
      o[d] = g;
    }
  }
  for (let i = 1; i < R; i++) {
    const r = i * W1;
    for (let n = 0; n < C; n++) {
      const d = r + n;
      t[d] = clamp(t[d] + o[d], HMIN, HMAX);
    }
    t[r + C] = t[r];
  }
  computeNormals(0, R);
}
function sampleH(t, e, a) {
  const o = Math.asin(clamp(e, -1, 1));
  let c = Math.atan2(t, a);
  c < 0 && (c += TAU);
  const s = ((HPI - o) / Math.PI) * R,
    i = (c / TAU) * C;
  let r = Math.floor(s);
  (r >= R && (r = R - 1), r < 0 && (r = 0));
  let n = Math.floor(i);
  (n >= C && (n = C - 1), n < 0 && (n = 0));
  const d = s - r,
    l = i - n,
    f = r * W1 + n,
    u = W.h;
  return (
    (u[f] * (1 - l) + u[f + 1] * l) * (1 - d) +
    (u[f + W1] * (1 - l) + u[f + W1 + 1] * l) * d
  );
}
var canvas = $("#c"),
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !0,
    powerPreference: "high-performance",
  });
(renderer.setClearColor(197898, 1),
  (renderer.toneMapping = THREE.ACESFilmicToneMapping),
  (renderer.toneMappingExposure = 1.15));
var scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(38, 1, 0.05, 400);
camera.position.set(0, 0.55, 3.15);
var controls = new OrbitControls(camera, canvas);
((controls.enableDamping = !reduceMotion),
  (controls.dampingFactor = 0.08),
  (controls.minDistance = 1.22),
  (controls.maxDistance = 9),
  (controls.rotateSpeed = 0.55),
  (controls.zoomSpeed = 0.7),
  (controls.autoRotateSpeed = 0.35));
var SUN = new THREE.Vector3(-0.62, 0.38, 0.55).normalize(),
  NOISE_GLSL = `
float hash3(vec3 p){ p = fract(p*0.3183099 + vec3(0.1,0.2,0.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vnoise(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x), mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x), mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y), f.z); }`,
  terrainMat = new THREE.ShaderMaterial({
    uniforms: {
      uSun: { value: SUN },
      uSea: { value: state.sea },
      uHS: { value: HS },
      uTemp: { value: state.temp },
      uMoist: { value: state.moist },
      uAtm: { value: state.atm },
      uPal: { value: BIOMES.map((t) => new THREE.Color(t.hex)) },
    },
    vertexShader: `
    attribute float height; attribute float moisture; attribute float flow; attribute float paintId; attribute float paintW;
    uniform float uSea; uniform float uHS;
    varying vec3 vDir; varying vec3 vN; varying vec3 vWP; varying float vH; varying float vM; varying float vF; varying float vPid; varying float vPw;
    void main(){
      vDir = position; float hh = max(height, uSea);
      vec3 p = position * (1.0 + hh*uHS);
      vN = height < uSea ? position : normal;
      vH = height; vM = moisture; vF = flow; vPid = paintId; vPw = paintW;
      vec4 wp = modelMatrix * vec4(p, 1.0); vWP = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`,
    fragmentShader: `
    uniform vec3 uSun; uniform float uSea; uniform float uTemp; uniform float uMoist; uniform float uAtm; uniform vec3 uPal[8];
    varying vec3 vDir; varying vec3 vN; varying vec3 vWP; varying float vH; varying float vM; varying float vF; varying float vPid; varying float vPw;
    ${NOISE_GLSL}
    void main(){
      vec3 dir = normalize(vDir); vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vWP);
      float e = vH - uSea;
      float water = 1.0 - smoothstep(-0.0015, 0.0015, e);
      float cosS = clamp(dot(N, dir), 0.02, 1.0); float tanS = sqrt(1.0 - cosS*cosS) / cosS;
      float latT = 1.0 - pow(abs(dir.y), 1.4);
      float Tw = latT*1.15 - 0.12 + (uTemp - 0.37)*1.5;
      float T = Tw - max(e, 0.0)*2.0;
      float M = clamp(vM + (uMoist - 0.58)*1.3, 0.0, 1.0);
      float n1 = vnoise(dir*70.0); float n2 = vnoise(dir*210.0); float det = 0.82 + 0.22*n1 + 0.14*n2;
      vec3 cGrassCold = mix(uPal[2], uPal[6], 0.35);
      vec3 warm = mix(uPal[5], mix(uPal[2], uPal[3], smoothstep(0.42, 0.62, M)), smoothstep(0.18, 0.34, M));
      vec3 cold = mix(cGrassCold, uPal[4], smoothstep(0.28, 0.45, M));
      vec3 land = mix(cold, warm, smoothstep(0.40, 0.54, T));
      land = mix(uPal[6], land, smoothstep(0.16, 0.30, T));
      land = mix(uPal[7], land, smoothstep(0.02, 0.12, T));
      float beachW = (1.0 - smoothstep(0.004, 0.02, e)) * smoothstep(0.18, 0.30, T);
      land = mix(land, uPal[1], beachW);
      land *= det;
      vec3 cRock = vec3(0.30, 0.27, 0.25) * (0.8 + 0.4*n1);
      float rockW = smoothstep(0.25, 0.6, tanS + 0.12*n2 - 0.06);
      land = mix(land, cRock, rockW);
      land = mix(land, uPal[7]*det, (1.0 - smoothstep(-0.10, 0.04, T)) * rockW * 0.7);
      land = mix(land, land*0.8, smoothstep(0.25, 0.55, vF)*0.6);
      float riv = smoothstep(0.55, 0.85, vF) * smoothstep(0.003, 0.015, e);
      land = mix(land, vec3(0.12, 0.45, 0.55), riv*0.9);
      int pid = int(vPid + 0.5); vec3 pc = uPal[0];
      for (int k = 0; k < 8; k++) { if (k == pid) pc = uPal[k]; }
      land = mix(land, pc*det, vPw);
      float depth = max(-e, 0.0);
      vec3 wcol = mix(vec3(0.10, 0.62, 0.66), vec3(0.012, 0.10, 0.28), smoothstep(0.0, 0.10, depth));
      wcol = mix(vec3(0.6, 0.85, 0.85), wcol, smoothstep(0.0, 0.003, depth));
      float seaIce = 1.0 - smoothstep(-0.04, 0.08, Tw);
      wcol = mix(wcol, uPal[7]*(0.9 + 0.15*n1), seaIce);
      wcol = mix(wcol, pc*det, vPw * step(6.5, vPid));
      vec3 albedo = mix(land, wcol, water);
      float NdL = dot(N, uSun); float sNdL = dot(dir, uSun);
      float day = smoothstep(-0.15, 0.2, sNdL);
      float diff = mix(max(NdL, 0.0), max(sNdL, 0.0), 0.15);
      float twl = exp(-(sNdL*sNdL)/0.0225);
      vec3 sunCol = mix(vec3(1.0, 0.96, 0.9), vec3(1.0, 0.55, 0.3), twl*0.6);
      vec3 col = albedo * (diff*sunCol*1.25 + vec3(0.012, 0.016, 0.03));
      vec3 Hh = normalize(uSun + V); float sp = max(dot(N, Hh), 0.0);
      float spec = pow(sp, 120.0)*0.55 + pow(sp, 12.0)*0.06;
      col += spec * water * (1.0 - seaIce*0.8) * sunCol * day;
      float night = 1.0 - day;
      float habit = (1.0 - water) * smoothstep(0.003, 0.012, e) * (1.0 - smoothstep(0.15, 0.35, tanS)) * smoothstep(0.22, 0.35, T) * smoothstep(0.2, 0.4, M);
      vec3 g = dir*520.0; float hv = hash3(floor(g)); float dd = length(fract(g) - 0.5);
      float mask = smoothstep(0.5, 0.7, vnoise(dir*5.0 + 3.0));
      float lights = step(0.975, hv) * (1.0 - smoothstep(0.12, 0.42, dd)) * habit * mask;
      lights += step(0.995, hv) * (1.0 - smoothstep(0.2, 0.5, dd)) * habit * 0.6;
      col += vec3(1.0, 0.72, 0.38) * lights * night * 2.2;
      float fres = pow(1.0 - max(dot(dir, V), 0.0), 3.0);
      col += vec3(0.30, 0.55, 1.0) * fres * (0.25 + 0.75*day) * 0.45 * uAtm;
      col = mix(col, vec3(0.45, 0.65, 1.0)*day*0.6, fres*0.25*uAtm);
      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  }),
  geo = new THREE.BufferGeometry(),
  attrPos = new THREE.BufferAttribute(W.dirs, 3),
  attrN = new THREE.BufferAttribute(W.nrm, 3).setUsage(THREE.DynamicDrawUsage),
  attrH = new THREE.BufferAttribute(W.h, 1).setUsage(THREE.DynamicDrawUsage),
  attrM = new THREE.BufferAttribute(W.moist, 1),
  attrF = new THREE.BufferAttribute(W.flow, 1).setUsage(THREE.DynamicDrawUsage),
  attrPid = new THREE.BufferAttribute(W.pid, 1, !1).setUsage(
    THREE.DynamicDrawUsage,
  ),
  attrPw = new THREE.BufferAttribute(W.pw, 1, !0).setUsage(
    THREE.DynamicDrawUsage,
  );
(geo.setAttribute("position", attrPos),
  geo.setAttribute("normal", attrN),
  geo.setAttribute("height", attrH),
  geo.setAttribute("moisture", attrM),
  geo.setAttribute("flow", attrF),
  geo.setAttribute("paintId", attrPid),
  geo.setAttribute("paintW", attrPw),
  geo.setIndex(new THREE.BufferAttribute(INDEX, 1)),
  (geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.1)));
var planet = new THREE.Mesh(geo, terrainMat);
scene.add(planet);
var cloudMat = new THREE.ShaderMaterial({
    transparent: !0,
    depthWrite: !1,
    uniforms: {
      uSun: { value: SUN },
      uTime: { value: 0 },
      uCover: { value: state.clouds },
      uOff: { value: new THREE.Vector3() },
    },
    vertexShader:
      "varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `
    uniform vec3 uSun; uniform float uTime; uniform float uCover; uniform vec3 uOff;
    varying vec3 vDir;
    ${NOISE_GLSL}
    float fbm5(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < ${isSmall ? 4 : 5}; i++){ s += a*vnoise(p); p = p*2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }
    float fbm3(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++){ s += a*vnoise(p); p = p*2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return s; }
    void main(){
      vec3 d = normalize(vDir); float ang = uTime*0.006; float ca = cos(ang), sa = sin(ang);
      vec3 d2 = vec3(d.x*ca - d.z*sa, d.y, d.x*sa + d.z*ca);
      vec3 p = d2*3.2 + uOff;
      float w1 = fbm3(p*0.9 + vec3(2.1)); float w2 = fbm3(p*0.9 + vec3(7.3));
      float n = fbm5(p + (vec3(w1, w2, w1*w2) - 0.5)*1.7);
      float thr = 0.66 - uCover*0.32;
      float a = smoothstep(thr, thr + 0.22, n) * (0.7 + 0.6*vnoise(d*2.0 + 5.0));
      float NdL = dot(d, uSun); float light = smoothstep(-0.2, 0.3, NdL);
      vec3 col = mix(vec3(0.02, 0.03, 0.06), vec3(1.0, 0.98, 0.96), light);
      col = mix(col, vec3(1.0, 0.6, 0.35), exp(-(NdL*NdL)/0.0225)*0.5*light);
      col *= 0.7 + 0.4*smoothstep(thr, thr + 0.4, n);
      float alpha = clamp(a, 0.0, 1.0) * 0.95;
      if (alpha < 0.01) discard;
      gl_FragColor = vec4(col, alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  }),
  clouds = new THREE.Mesh(new THREE.SphereGeometry(1.085, 96, 64), cloudMat);
((clouds.renderOrder = 1), scene.add(clouds));
var atmoMat = new THREE.ShaderMaterial({
    transparent: !0,
    depthWrite: !1,
    blending: THREE.AdditiveBlending,
    toneMapped: !1,
    uniforms: {
      uSun: { value: SUN },
      uAtm: { value: state.atm },
      uRa: { value: 1.1 },
    },
    vertexShader:
      "varying vec3 vWP; varying vec3 vN; void main(){ vN = position; vec4 wp = modelMatrix*vec4(position,1.0); vWP = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader: `
    uniform vec3 uSun; uniform float uAtm; uniform float uRa; varying vec3 vWP; varying vec3 vN;
    void main(){
      vec3 ro = cameraPosition; vec3 rd = normalize(vWP - ro);
      float b = length(cross(ro, rd)); float Rp = 0.995; float Ra = uRa;
      float outer = sqrt(max(Ra*Ra - b*b, 0.0)); float inner = sqrt(max(Rp*Rp - b*b, 0.0));
      float path = (b < Rp) ? (outer - inner) : 2.0*outer;
      float pmax = sqrt(max(Ra*Ra - Rp*Rp, 1e-4));
      float od = path / pmax; od = 2.0*pow(od*0.5, 1.6);
      float alt = max(b - Rp, 0.0) / max(Ra - Rp, 1e-3); od *= exp(-alt*3.0);
      vec3 n = normalize(vN); float sNdL = dot(n, uSun);
      float lit = smoothstep(-0.25, 0.3, sNdL);
      vec3 col = mix(vec3(1.0, 0.45, 0.2), vec3(0.30, 0.58, 1.0), smoothstep(-0.05, 0.35, sNdL));
      gl_FragColor = vec4(col * od * 0.55 * uAtm * lit, 1.0);
      #include <colorspace_fragment>
    }`,
  }),
  atmo = new THREE.Mesh(new THREE.SphereGeometry(1.16, 64, 48), atmoMat);
((atmo.renderOrder = 2), scene.add(atmo));
var STAR_N = 2600,
  starPos = new Float32Array(STAR_N * 3),
  starCol = new Float32Array(STAR_N * 3),
  starSize = new Float32Array(STAR_N),
  starGeo = new THREE.BufferGeometry();
(starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3)),
  starGeo.setAttribute("starColor", new THREE.BufferAttribute(starCol, 3)),
  starGeo.setAttribute("size", new THREE.BufferAttribute(starSize, 1)));
var starMat = new THREE.ShaderMaterial({
    transparent: !0,
    depthWrite: !1,
    blending: THREE.AdditiveBlending,
    toneMapped: !1,
    uniforms: { uPR: { value: 1 } },
    vertexShader:
      "attribute float size; attribute vec3 starColor; uniform float uPR; varying vec3 vC; void main(){ vC = starColor; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = size*uPR; gl_Position = projectionMatrix*mv; }",
    fragmentShader: `varying vec3 vC;
    void main(){
      float d = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.05, 0.5, d); a *= a;
      gl_FragColor = vec4(vC*a, 1.0);
      #include <colorspace_fragment>
    }`,
  }),
  stars = new THREE.Points(starGeo, starMat);
((stars.frustumCulled = !1), scene.add(stars));
function generateStars(t) {
  for (let e = 0; e < STAR_N; e++) {
    const a = t() * 2 - 1,
      o = t() * TAU,
      c = Math.sqrt(1 - a * a),
      s = 120;
    ((starPos[e * 3] = c * Math.cos(o) * s),
      (starPos[e * 3 + 1] = a * s),
      (starPos[e * 3 + 2] = c * Math.sin(o) * s));
    const i = t(),
      r = 0.35 + Math.pow(t(), 3) * 0.9,
      n = i < 0.2 ? 0.75 : i < 0.8 ? 0.95 : 1,
      d = i < 0.2 ? 0.82 : i < 0.8 ? 0.95 : 0.85,
      l = i < 0.2 || i < 0.8 ? 1 : 0.65;
    ((starCol[e * 3] = n * r),
      (starCol[e * 3 + 1] = d * r),
      (starCol[e * 3 + 2] = l * r),
      (starSize[e] = 1 + Math.pow(t(), 4) * 2.6));
  }
  ((starGeo.attributes.position.needsUpdate = !0),
    (starGeo.attributes.starColor.needsUpdate = !0),
    (starGeo.attributes.size.needsUpdate = !0));
}
var SEG = 96,
  ringGroup = new THREE.Group();
((ringGroup.renderOrder = 10), scene.add(ringGroup));
var rings = [16777215, 12971595, 12971595].map((t, e) => {
    const a = new THREE.BufferGeometry();
    (a.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(SEG * 3), 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    ),
      (a.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2)));
    const o = new THREE.LineLoop(
      a,
      new THREE.LineBasicMaterial({
        color: t,
        transparent: !0,
        opacity: [0.9, 0.55, 0.35][e],
        depthTest: !1,
        depthWrite: !1,
      }),
    );
    return ((o.renderOrder = 10), (o.frustumCulled = !1), ringGroup.add(o), o);
  }),
  ringDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.004, 10, 8),
    new THREE.MeshBasicMaterial({ color: 16777215, depthTest: !1 }),
  );
((ringDot.renderOrder = 11), ringGroup.add(ringDot), (ringGroup.visible = !1));
var _u = new THREE.Vector3(),
  _v = new THREE.Vector3(),
  _q = new THREE.Vector3(),
  _hit = new THREE.Vector3(),
  _dir = new THREE.Vector3(),
  _p = new THREE.Vector3();
function updateRing(t) {
  const e = state.brushKm / PLANET_KM,
    a = state.sea;
  (_u.set(0, 1, 0),
    Math.abs(t.y) > 0.95 && _u.set(1, 0, 0),
    _u.crossVectors(t, _u).normalize(),
    _v.crossVectors(t, _u).normalize());
  const o = state.tool === "inspect" || state.tool === "orbit";
  for (let s = 0; s < 3; s++) {
    const i = e * [1, 0.66, 0.33][s],
      r = Math.cos(i),
      n = Math.sin(i),
      d = rings[s].geometry.attributes.position.array;
    if (((rings[s].visible = !o), !o)) {
      for (let l = 0; l < SEG; l++) {
        const f = (l / SEG) * TAU,
          u = Math.cos(f) * n,
          M = Math.sin(f) * n,
          v = t.x * r + _u.x * u + _v.x * M,
          p = t.y * r + _u.y * u + _v.y * M,
          m = t.z * r + _u.z * u + _v.z * M,
          g = 1 + Math.max(sampleH(v, p, m), a) * HS + 0.004;
        ((d[l * 3] = v * g), (d[l * 3 + 1] = p * g), (d[l * 3 + 2] = m * g));
      }
      rings[s].geometry.attributes.position.needsUpdate = !0;
    }
  }
  const c = 1 + Math.max(sampleH(t.x, t.y, t.z), a) * HS + 0.004;
  ringDot.position.copy(t).multiplyScalar(c);
}
function insideAt(t, e, a) {
  _p.copy(e).multiplyScalar(a).add(t);
  const o = _p.length(),
    c = sampleH(_p.x / o, _p.y / o, _p.z / o);
  return o <= 1 + Math.max(c, state.sea) * HS;
}
function hitPlanet(t, e) {
  const a = t.origin,
    o = t.direction,
    c = 1 + HMAX * HS + 0.01,
    s = a.dot(o),
    i = a.lengthSq() - c * c,
    r = s * s - i;
  if (r < 0) return !1;
  const n = Math.sqrt(r);
  let d = -s - n;
  const l = -s + n;
  if (l < 0) return !1;
  d < 0 && (d = 0);
  let f = d;
  for (let u = d; u <= l; u += 0.012) {
    if (insideAt(a, o, u)) {
      let M = f,
        v = u;
      for (let p = 0; p < 10; p++) {
        const m = (M + v) * 0.5;
        insideAt(a, o, m) ? (v = m) : (M = m);
      }
      return (e.copy(o).multiplyScalar(v).add(a), !0);
    }
    f = u;
  }
  return !1;
}
function markRows(t, e, a) {
  ((t = Math.max(0, t)), (e = Math.min(R, e)));
  const o = t * W1,
    c = (e - t + 1) * W1;
  a
    ? (attrPid.addUpdateRange(o, c),
      (attrPid.needsUpdate = !0),
      attrPw.addUpdateRange(o, c),
      (attrPw.needsUpdate = !0))
    : (attrH.addUpdateRange(o, c),
      (attrH.needsUpdate = !0),
      attrN.addUpdateRange(o * 3, c * 3),
      (attrN.needsUpdate = !0));
}
function uploadAll() {
  for (const t of [attrH, attrN, attrF, attrPid, attrPw])
    (t.clearUpdateRanges(), (t.needsUpdate = !0));
}
function applyBrush(t, e) {
  const a = t.x,
    o = t.y,
    c = t.z,
    s = state.brushKm / PLANET_KM,
    i = Math.cos(s),
    r = Math.asin(clamp(o, -1, 1));
  let n = Math.atan2(a, c);
  n < 0 && (n += TAU);
  const d = Math.min(HPI, r + s),
    l = Math.max(-HPI, r - s),
    f = Math.max(0, Math.floor(((HPI - d) / Math.PI) * R)),
    u = Math.min(R, Math.ceil(((HPI - l) / Math.PI) * R)),
    M = Math.min(Math.cos(d), Math.cos(l)),
    v =
      d >= HPI - 1e-6 || l <= -HPI + 1e-6
        ? Math.PI
        : Math.min(Math.PI, s / Math.max(M, 1e-4));
  let p, m;
  v >= Math.PI
    ? ((p = 0), (m = C - 1))
    : ((p = Math.floor(((n - v) / TAU) * C)),
      (m = Math.ceil(((n + v) / TAU) * C)));
  const { dirs: g, h, pid: x, pw: S } = W,
    k = state.tool,
    z = state.strength * e,
    P = state.sea,
    A = P - 0.03,
    E = Math.min(1, state.strength * 1.6);
  for (let U = f; U <= u; U++) {
    const T = U * W1;
    for (let F = p; F <= m; F++) {
      let L = F % C;
      L < 0 && (L += C);
      const b = T + L,
        D = g[b * 3] * a + g[b * 3 + 1] * o + g[b * 3 + 2] * c;
      if (D < i) continue;
      const w = Math.acos(Math.min(1, D)) / s;
      let y = 1 - w * w;
      if (((y *= y), k === "paint")) {
        x[b] = state.biome;
        const H = Math.round(255 * y * E);
        (H > S[b] && (S[b] = H),
          L === 0 && ((x[T + C] = x[b]), (S[T + C] = S[b])));
        continue;
      }
      let B = h[b];
      if (k === "raise") B += z * y * 0.35;
      else if (k === "lower") B -= z * y * 0.35;
      else if (k === "smooth") {
        const H = T + (L === 0 ? C - 1 : L - 1),
          I = T + L + 1,
          _ = U > 0 ? b - W1 : b,
          O = U < R ? b + W1 : b,
          V = (h[H] + h[I] + h[_] + h[O]) * 0.25;
        B += (V - B) * Math.min(1, z * y * 4);
      } else k === "water" && B > A && (B += (A - B) * Math.min(1, z * y * 4));
      ((B = clamp(B, HMIN, HMAX)), (h[b] = B), L === 0 && (h[T + C] = B));
    }
  }
  if (k === "paint") {
    markRows(f, u, !0);
    return;
  }
  (f === 0 && syncPole(0),
    u === R && syncPole(R),
    computeNormals(f - 1, u + 1),
    markRows(f - 1, u + 1, !1));
}
function classify(t) {
  const e = W.h[t],
    a = W.dirs[t * 3 + 1],
    o = e - state.sea,
    c = W.nrm[t * 3],
    s = W.nrm[t * 3 + 1],
    i = W.nrm[t * 3 + 2],
    r = clamp(c * W.dirs[t * 3] + s * a + i * W.dirs[t * 3 + 2], 0.02, 1),
    n = Math.sqrt(1 - r * r) / r,
    d = 1 - Math.pow(Math.abs(a), 1.4),
    l = d * 1.15 - 0.12 + (state.temp - 0.37) * 1.5,
    f = l - Math.max(o, 0) * 2,
    u = clamp(W.moist[t] + (state.moist - 0.58) * 1.3, 0, 1);
  return o < 0
    ? l < 0.02
      ? BIOMES[7]
      : BIOMES[0]
    : W.pw[t] > 128
      ? BIOMES[W.pid[t]]
      : W.flow[t] > 0.7 && o > 0.003
        ? RIVER
        : f < 0.07
          ? BIOMES[7]
          : n > 0.42
            ? ROCK
            : o < 0.012 && f > 0.24
              ? BIOMES[1]
              : f < 0.23
                ? BIOMES[6]
                : f < 0.47
                  ? u < 0.36
                    ? BIOMES[2]
                    : BIOMES[4]
                  : u < 0.26
                    ? BIOMES[5]
                    : u < 0.52
                      ? BIOMES[2]
                      : BIOMES[3];
}
var els = {
    iLat: $("#iLat"),
    iLon: $("#iLon"),
    iElev: $("#iElev"),
    iSlope: $("#iSlope"),
    iBiome: $("#iBiome"),
    iDot: $("#iDot"),
    iState: $("#iState"),
    iAge: $("#iAge"),
  },
  pinned = !1;
function inspectAt(t) {
  const e = Math.asin(clamp(t.y, -1, 1)),
    a = Math.atan2(t.x, t.z);
  let o = a < 0 ? a + TAU : a;
  const c = Math.round(((HPI - e) / Math.PI) * R),
    s = Math.round((o / TAU) * C) % C,
    i = c * W1 + s,
    r = classify(i),
    n = (W.h[i] - state.sea) * ELEV_M,
    d = clamp(
      W.nrm[i * 3] * W.dirs[i * 3] +
        W.nrm[i * 3 + 1] * W.dirs[i * 3 + 1] +
        W.nrm[i * 3 + 2] * W.dirs[i * 3 + 2],
      -1,
      1,
    ),
    l = (e * 180) / Math.PI,
    f = (a * 180) / Math.PI;
  ((els.iLat.textContent = `${Math.abs(l).toFixed(2)}\xB0 ${l >= 0 ? "N" : "S"}`),
    (els.iLon.textContent = `${Math.abs(f).toFixed(2)}\xB0 ${f >= 0 ? "E" : "W"}`),
    (els.iElev.textContent = `${Math.round(n).toLocaleString("en-US")} m`),
    (els.iSlope.textContent = `${((Math.acos(d) * 180) / Math.PI).toFixed(1)}\xB0`),
    (els.iBiome.textContent = r.name),
    (els.iDot.style.background = r.hex));
}
var history = [],
  cur = -1,
  undoBtn = $("#undoBtn"),
  redoBtn = $("#redoBtn");
function commit(t, e) {
  const a = cur >= 0 ? history[cur].age : 0;
  ((history.length = cur + 1),
    history.push({
      h: W.h.slice(),
      pid: W.pid.slice(),
      pw: W.pw.slice(),
      age: Math.round((a + e) * 10) / 10,
      label: t,
    }),
    history.length > MAXH && history.shift(),
    (cur = history.length - 1),
    refreshHistoryUI());
}
function restore(t) {
  if (t < 0 || t >= history.length || t === cur || eroding) return;
  const e = history[t];
  (W.h.set(e.h),
    W.pid.set(e.pid),
    W.pw.set(e.pw),
    (cur = t),
    computeNormals(0, R),
    computeFlow(),
    uploadAll(),
    refreshHistoryUI(),
    pointer.has && (pointer.dirty = !0));
}
function refreshHistoryUI() {
  ((undoBtn.disabled = cur <= 0),
    (redoBtn.disabled = cur >= history.length - 1));
  const t = history[cur].age;
  els.iAge.textContent = `${t.toFixed(1)} Ma`;
  let e = 250;
  for (const n of history) e = Math.max(e, Math.ceil(n.age / 50) * 50);
  const a = $("#tlTicks");
  let o = "";
  const c = e <= 300 ? 50 : e <= 600 ? 100 : 250;
  for (let n = 0; n <= e; n += c)
    o += `<span style="left:${(n / e) * 100}%">${n} Ma</span>`;
  a.innerHTML = o;
  const s = $("#tlMarkers");
  let i = "";
  (history.forEach((n, d) => {
    i += `<button class="tl-m ${d < cur ? "done" : ""} ${d === cur ? "cur" : ""}" style="left:${(n.age / e) * 100}%" data-k="${d}" title="${n.label} \xB7 ${n.age.toFixed(1)} Ma" aria-label="Jump to ${n.label} at ${n.age.toFixed(1)} Ma"></button>`;
  }),
    (s.innerHTML = i),
    ($("#tlFill").style.width = `${(t / e) * 100}%`));
  const r = $("#tlCur");
  ((r.style.left = `${clamp((t / e) * 100, 6, 94)}%`),
    (r.innerHTML = `<b>${t.toFixed(1)} Ma</b><span>${history[cur].label}</span>`));
}
($("#tlMarkers").addEventListener("click", (t) => {
  const e = t.target.closest(".tl-m");
  e && restore(+e.dataset.k);
}),
  undoBtn.addEventListener("click", () => restore(cur - 1)),
  redoBtn.addEventListener("click", () => restore(cur + 1)));
var eroding = !1,
  erodeBtn = $("#erodeBtn"),
  erodeLabel = $("#erodeLabel");
function runErosion() {
  if (eroding) return;
  ((eroding = !0),
    erodeBtn.classList.add("busy"),
    erodeBtn.setAttribute("aria-busy", "true"));
  let t = 0;
  const e = state.erosion,
    a = () => {
      if (document.hidden) {
        setTimeout(a, 250);
        return;
      }
      (erodePass(),
        t++,
        uploadAll(),
        (erodeLabel.textContent = `ERODING ${t}/${e}`),
        t < e
          ? setTimeout(a, reduceMotion ? 10 : 160)
          : (computeFlow(),
            uploadAll(),
            (eroding = !1),
            erodeBtn.classList.remove("busy"),
            erodeBtn.removeAttribute("aria-busy"),
            (erodeLabel.textContent = "RUN EROSION"),
            commit(`Erosion \xD7${e}`, 9.6 * e),
            toast(`Erosion complete \xB7 ${e} passes`),
            pointer.has && (pointer.dirty = !0)));
    };
  setTimeout(a, 30);
}
erodeBtn.addEventListener("click", runErosion);
var toastT = 0,
  toastEl = $("#toast");
function toast(t) {
  ((toastEl.textContent = t),
    toastEl.classList.add("show"),
    clearTimeout(toastT),
    (toastT = setTimeout(() => toastEl.classList.remove("show"), 1800)));
}
var HINTS = {
  orbit:
    "Drag to orbit \xB7 Right-drag to pan \xB7 Wheel to zoom \xB7 Click to inspect",
  raise: "Drag on the globe to raise terrain \xB7 Hold Space to orbit",
  lower: "Drag on the globe to carve terrain down \xB7 Hold Space to orbit",
  smooth: "Drag to smooth ridges and fill noise \xB7 Hold Space to orbit",
  water: "Drag to flood land below sea level \xB7 Hold Space to orbit",
  paint: "Drag to paint the selected legend biome \xB7 Hold Space to orbit",
  inspect: "Click the globe to pin a location report",
};
function setTool(t) {
  ((state.tool = t),
    $$(".tool").forEach((e) => {
      const a = e.dataset.tool === t;
      (e.classList.toggle("active", a), e.setAttribute("aria-pressed", a));
    }),
    ($("#hint").textContent = HINTS[t]),
    canvas.classList.toggle("orbit", t === "orbit"),
    (pointer.dirty = !0));
}
$$(".tool").forEach((t) =>
  t.addEventListener("click", () => setTool(t.dataset.tool)),
);
var legend = $("#legend");
BIOMES.forEach((t, e) => {
  const a = document.createElement("button");
  ((a.className = "lg"),
    (a.dataset.biome = e),
    (a.title =
      e === 0 ? "Ocean \u2014 select the Water tool" : `Paint ${t.name}`),
    (a.innerHTML = `<i style="background:${t.hex}"></i><span>${t.name}</span>`),
    legend.appendChild(a));
});
function setBiome(t) {
  ((state.biome = t),
    $$(".lg").forEach((e) =>
      e.setAttribute("aria-pressed", +e.dataset.biome === t),
    ));
}
legend.addEventListener("click", (t) => {
  const e = t.target.closest(".lg");
  if (!e) return;
  const a = +e.dataset.biome;
  if (a === 0) {
    (setTool("water"), toast("Water tool selected"));
    return;
  }
  (setBiome(a), setTool("paint"));
});
function setToggle(t, e) {
  (t === "clouds"
    ? ((state.showClouds = e), (clouds.visible = e))
    : ((state.brushPreview = e),
      e || (ringGroup.visible = !1),
      (pointer.dirty = !0)),
    $$(`[data-toggle="${t}"]`).forEach((a) =>
      a.setAttribute("aria-checked", e),
    ));
}
$$("[data-toggle]").forEach((t) =>
  t.addEventListener("click", () =>
    setToggle(t.dataset.toggle, t.getAttribute("aria-checked") !== "true"),
  ),
);
var updaters = [];
function bindRange(t, e, a, o, c) {
  const s = $(t),
    i = $(t + "Val"),
    r = () => {
      ((s.value = state[e]), (i.textContent = a(state[e])));
    };
  return (
    s.addEventListener("input", () => {
      ((state[e] = parseFloat(s.value)),
        (i.textContent = a(state[e])),
        o && o());
    }),
    c && s.addEventListener("change", c),
    updaters.push(r),
    r
  );
}
var f2 = (t) => t.toFixed(2);
function syncUniforms() {
  ((terrainMat.uniforms.uSea.value = state.sea),
    (terrainMat.uniforms.uTemp.value = state.temp),
    (terrainMat.uniforms.uMoist.value = state.moist),
    (terrainMat.uniforms.uAtm.value = state.atm),
    (atmoMat.uniforms.uAtm.value = state.atm),
    (atmoMat.uniforms.uRa.value = 1 + 0.1 * Math.max(state.atm, 0.05)),
    (atmo.visible = state.atm > 0.005),
    (cloudMat.uniforms.uCover.value = state.clouds),
    ($("#aHeight").textContent = `${Math.round(32 * state.atm)} km`),
    ($("#aDensity").textContent = state.atm.toFixed(2)),
    ($("#aScatter").textContent = (0.65 * Math.sqrt(state.atm)).toFixed(2)),
    ($("#erVal").textContent = state.erosion),
    ($("#erVal2").textContent = state.erosion),
    (pointer.dirty = !0));
}
(bindRange(
  "#sRadius",
  "brushKm",
  (t) => `${Math.round(t)} km`,
  () => {
    pointer.dirty = !0;
  },
),
  bindRange("#sStrength", "strength", f2),
  bindRange("#sSea", "sea", f2, syncUniforms, () => {
    (computeFlow(), attrF.clearUpdateRanges(), (attrF.needsUpdate = !0));
  }),
  bindRange("#sTemp", "temp", f2, syncUniforms),
  bindRange("#sMoist", "moist", f2, syncUniforms),
  bindRange("#sAtm", "atm", f2, syncUniforms),
  bindRange("#sClouds", "clouds", f2, syncUniforms),
  $("#erMinus").addEventListener("click", () => {
    ((state.erosion = Math.max(1, state.erosion - 1)), syncUniforms());
  }),
  $("#erPlus").addEventListener("click", () => {
    ((state.erosion = Math.min(12, state.erosion + 1)), syncUniforms());
  }));
var seedInput = $("#seedInput");
function normalizeSeed(t) {
  return (
    (t = t
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "")
      .slice(0, 16)),
    t || randomSeed()
  );
}
async function regenerate(t, e) {
  eroding ||
    ((state.seed = normalizeSeed(t)),
    (seedInput.value = state.seed),
    e && (Object.assign(state, DEFAULTS), updaters.forEach((a) => a())),
    loading.classList.remove("hide"),
    (loading.innerHTML = "Generating world<small>" + state.seed + "</small>"),
    await new Promise((a) => setTimeout(a, 30)),
    generate(state.seed),
    uploadAll(),
    syncUniforms(),
    cloudMat.uniforms.uOff.value.set(
      cloudOffset[0],
      cloudOffset[1],
      cloudOffset[2],
    ),
    (history.length = 0),
    (cur = -1),
    commit("Genesis", 0),
    (pinned = !1),
    (els.iState.textContent = "Hover globe"),
    loading.classList.add("hide"));
}
(seedInput.addEventListener("change", () => {
  const t = normalizeSeed(seedInput.value);
  t !== state.seed ? regenerate(t, !1) : (seedInput.value = t);
}),
  seedInput.addEventListener("keydown", (t) => {
    t.key === "Enter" && seedInput.blur();
  }),
  $("#diceBtn").addEventListener("click", () => regenerate(randomSeed(), !1)),
  $("#menuRegen").addEventListener("click", () => {
    (closeMenu(), regenerate(randomSeed(), !1));
  }),
  $("#resetBtn").addEventListener("click", () => regenerate(state.seed, !0)),
  $("#menuReset").addEventListener("click", () => {
    (closeMenu(), regenerate(state.seed, !0));
  }),
  $("#snapBtn").addEventListener("click", () => {
    (renderer.render(scene, camera),
      canvas.toBlob((t) => {
        if (!t) {
          toast("Snapshot failed");
          return;
        }
        const e = document.createElement("a");
        ((e.href = URL.createObjectURL(t)),
          (e.download = `terraform-${state.seed}.png`),
          document.body.appendChild(e),
          e.click(),
          e.remove(),
          setTimeout(() => URL.revokeObjectURL(e.href), 3e3),
          toast("Snapshot saved"));
      }, "image/png"));
  }));
var menu = $("#menu"),
  menuBtn = $("#menuBtn");
function openMenu() {
  (menu.classList.add("open"), menuBtn.setAttribute("aria-expanded", "true"));
}
function closeMenu() {
  (menu.classList.remove("open"),
    menuBtn.setAttribute("aria-expanded", "false"));
}
(menuBtn.addEventListener("click", (t) => {
  (t.stopPropagation(),
    menu.classList.contains("open") ? closeMenu() : openMenu());
}),
  document.addEventListener("pointerdown", (t) => {
    menu.classList.contains("open") &&
      !menu.contains(t.target) &&
      t.target !== menuBtn &&
      closeMenu();
  }),
  $$("[data-cam]").forEach((t) =>
    t.addEventListener("click", () => {
      (goPreset(t.dataset.cam), closeMenu());
    }),
  ),
  $("#autoRotate").addEventListener("click", () => {
    ((state.autoRotate = !state.autoRotate),
      (controls.autoRotate = state.autoRotate),
      (controls.autoRotateSpeed = reduceMotion ? 0.12 : 0.35),
      $("#autoRotate").setAttribute("aria-checked", state.autoRotate));
  }));
var world = $("#world");
($("#worldTab").addEventListener("click", () => world.classList.add("open")),
  $("#worldClose").addEventListener("click", () =>
    world.classList.remove("open"),
  ));
var PRESETS = {
    overview: [0, 0.55, 3.15],
    pole: [0.01, 3.1, 0.6],
    terminator: [2.05, 0.55, 2.05],
  },
  camAnim = {
    active: !1,
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    t: 0,
  };
function goPreset(t) {
  (t === "closeup"
    ? camAnim.to.copy(camera.position).normalize().multiplyScalar(1.55)
    : camAnim.to.set(...PRESETS[t]),
    controls.target.set(0, 0, 0),
    reduceMotion
      ? (camera.position.copy(camAnim.to), (camAnim.active = !1))
      : (camAnim.from.copy(camera.position),
        (camAnim.t = 0),
        (camAnim.active = !0)));
}
var raycaster = new THREE.Raycaster(),
  pointer = { x: 0, y: 0, has: !1, dirty: !1, hitOK: !1 },
  stroke = {
    active: !1,
    hit: !1,
    dirty: !1,
    dir: new THREE.Vector3(),
    downX: 0,
    downY: 0,
    moved: !1,
  },
  activePointers = 0,
  spaceHeld = !1,
  effTool = () => (spaceHeld ? "orbit" : state.tool);
function setPointer(t) {
  const e = canvas.getBoundingClientRect();
  ((pointer.x = ((t.clientX - e.left) / e.width) * 2 - 1),
    (pointer.y = -((t.clientY - e.top) / e.height) * 2 + 1),
    (pointer.has = !0),
    (pointer.dirty = !0));
}
function raycastPointer() {
  return (
    raycaster.setFromCamera(pointer, camera),
    hitPlanet(raycaster.ray, _hit)
  );
}
function endStroke() {
  if (stroke.active) {
    if (
      ((stroke.active = !1), canvas.classList.remove("grabbing"), stroke.dirty)
    ) {
      const t = state.tool;
      (commit(
        t === "paint"
          ? `Paint ${BIOMES[state.biome].name}`
          : t[0].toUpperCase() + t.slice(1),
        3.4,
      ),
        computeFlow(),
        attrF.clearUpdateRanges(),
        (attrF.needsUpdate = !0));
    }
    ((stroke.dirty = !1), (controls.enableRotate = !0));
  }
}
(canvas.addEventListener(
  "pointerdown",
  (t) => {
    if (
      (activePointers++,
      setPointer(t),
      closeMenu(),
      (stroke.downX = t.clientX),
      (stroke.downY = t.clientY),
      (stroke.moved = !1),
      activePointers > 1)
    ) {
      (endStroke(), (controls.enableRotate = !0));
      return;
    }
    const e = effTool(),
      a = e !== "orbit" && e !== "inspect",
      o = raycastPointer();
    ((pointer.hitOK = o),
      a && o && !eroding && t.button === 0
        ? ((stroke.active = !0),
          (stroke.hit = !0),
          stroke.dir.copy(_hit).normalize(),
          (controls.enableRotate = !1))
        : ((controls.enableRotate = !0),
          e === "orbit" && canvas.classList.add("grabbing")));
  },
  { capture: !0 },
),
  canvas.addEventListener("pointermove", (t) => {
    (setPointer(t),
      Math.abs(t.clientX - stroke.downX) + Math.abs(t.clientY - stroke.downY) >
        4 && (stroke.moved = !0));
  }),
  window.addEventListener("pointerup", (t) => {
    ((activePointers = Math.max(0, activePointers - 1)),
      canvas.classList.remove("grabbing"));
    const e = stroke.active;
    if (
      (endStroke(),
      !e && !stroke.moved && t.target === canvas && activePointers === 0)
    ) {
      const a = effTool();
      (a === "orbit" || a === "inspect") &&
        (setPointer(t),
        raycastPointer() &&
          (_dir.copy(_hit).normalize(),
          inspectAt(_dir),
          (pinned = !0),
          (els.iState.textContent = "Pinned \xB7 Esc to release")));
    }
    activePointers === 0 && (controls.enableRotate = !0);
  }),
  window.addEventListener("pointercancel", () => {
    ((activePointers = 0), endStroke(), (controls.enableRotate = !0));
  }),
  canvas.addEventListener("pointerleave", () => {
    ((pointer.has = !1),
      (ringGroup.visible = !1),
      pinned || (els.iState.textContent = "Hover globe"));
  }),
  canvas.addEventListener("contextmenu", (t) => t.preventDefault()),
  window.addEventListener("keydown", (t) => {
    if (t.target === seedInput) return;
    const e = t.key.toLowerCase();
    if (e === " ") {
      (spaceHeld || ((spaceHeld = !0), canvas.classList.add("orbit")),
        t.preventDefault());
      return;
    }
    const a = {
      o: "orbit",
      r: "raise",
      f: "lower",
      s: "smooth",
      w: "water",
      b: "paint",
      i: "inspect",
    };
    if (a[e] && !t.ctrlKey && !t.metaKey) {
      setTool(a[e]);
      return;
    }
    e === "u" || ((t.ctrlKey || t.metaKey) && e === "z" && !t.shiftKey)
      ? (t.preventDefault(), restore(cur - 1))
      : e === "y" || ((t.ctrlKey || t.metaKey) && e === "z" && t.shiftKey)
        ? (t.preventDefault(), restore(cur + 1))
        : e === "e"
          ? runErosion()
          : e === "n"
            ? regenerate(randomSeed(), !1)
            : e === "c"
              ? setToggle("clouds", !state.showClouds)
              : e === "["
                ? ((state.brushKm = Math.max(12, state.brushKm - 6)),
                  updaters[0](),
                  (pointer.dirty = !0))
                : e === "]"
                  ? ((state.brushKm = Math.min(220, state.brushKm + 6)),
                    updaters[0](),
                    (pointer.dirty = !0))
                  : e === "1"
                    ? goPreset("overview")
                    : e === "2"
                      ? goPreset("pole")
                      : e === "3"
                        ? goPreset("terminator")
                        : e === "4"
                          ? goPreset("closeup")
                          : e === "escape" &&
                            (closeMenu(),
                            world.classList.remove("open"),
                            (pinned = !1),
                            (els.iState.textContent = "Hover globe"));
  }),
  window.addEventListener("keyup", (t) => {
    t.key === " " &&
      ((spaceHeld = !1),
      canvas.classList.toggle("orbit", state.tool === "orbit"));
  }));
var tools = $("#tools"),
  bottom = $("#bottom");
function resize() {
  const t = innerWidth,
    e = innerHeight;
  (renderer.setPixelRatio(
    Math.min(devicePixelRatio || 1, isSmall ? 1.5 : 1.75),
  ),
    renderer.setSize(t, e, !1),
    (camera.aspect = t / e),
    camera.updateProjectionMatrix(),
    (starMat.uniforms.uPR.value = renderer.getPixelRatio()),
    (tools.style.bottom = t <= 900 ? `${bottom.offsetHeight + 16}px` : ""));
}
window.addEventListener("resize", resize);
var raf = 0,
  last = performance.now(),
  running = !1,
  clock = 0;
function frame(t) {
  if (!running) return;
  raf = requestAnimationFrame(frame);
  const e = Math.min(0.05, (t - last) / 1e3);
  if (
    ((last = t),
    reduceMotion || (clock += e),
    (cloudMat.uniforms.uTime.value = clock),
    camAnim.active)
  ) {
    camAnim.t = Math.min(1, camAnim.t + e / 0.75);
    const a =
        camAnim.t < 0.5
          ? 2 * camAnim.t * camAnim.t
          : 1 - Math.pow(-2 * camAnim.t + 2, 2) / 2,
      o = camAnim.from.length(),
      c = camAnim.to.length();
    (_p.copy(camAnim.from).normalize(),
      _q.copy(camAnim.to).normalize(),
      _p.lerp(_q, a),
      _p.lengthSq() < 1e-6 && _p.set(0.001, 1, 0),
      _p.normalize().multiplyScalar(o + (c - o) * a),
      camera.position.copy(_p),
      camAnim.t >= 1 && (camAnim.active = !1));
  }
  if (pointer.dirty && pointer.has) {
    pointer.dirty = !1;
    const a = raycastPointer();
    ((pointer.hitOK = a),
      a
        ? (_dir.copy(_hit).normalize(),
          stroke.active && (stroke.dir.copy(_dir), (stroke.hit = !0)),
          pinned || (inspectAt(_dir), (els.iState.textContent = "Hover")))
        : (stroke.active && (stroke.hit = !1),
          pinned || (els.iState.textContent = "Hover globe")),
      (ringGroup.visible = a && state.brushPreview && effTool() !== "orbit"),
      ringGroup.visible && updateRing(_dir));
  }
  (stroke.active &&
    stroke.hit &&
    !eroding &&
    (applyBrush(stroke.dir, e),
    (stroke.dirty = !0),
    ringGroup.visible && updateRing(stroke.dir)),
    controls.update(),
    renderer.render(scene, camera));
}
function start() {
  running ||
    ((running = !0),
    (last = performance.now()),
    (raf = requestAnimationFrame(frame)));
}
function stop() {
  ((running = !1), cancelAnimationFrame(raf));
}
(document.addEventListener("visibilitychange", () => {
  document.hidden ? stop() : start();
}),
  setTool("raise"),
  setBiome(2),
  setToggle("clouds", !0),
  setToggle("brush", !0),
  resize(),
  await regenerate(state.seed, !0),
  start());
