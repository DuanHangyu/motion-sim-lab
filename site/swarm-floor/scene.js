import * as r from "three";
import { OrbitControls as xn } from "three/addons/controls/OrbitControls.js";
function nt(e) {
  let t = e >>> 0 || 1;
  return function () {
    t += 1831565813;
    let n = t;
    return (
      (n = Math.imul(n ^ (n >>> 15), n | 1)),
      (n ^= n + Math.imul(n ^ (n >>> 7), n | 61)),
      ((n ^ (n >>> 14)) >>> 0) / 4294967296
    );
  };
}
var Ae = nt(1),
  me = (e, t) => e + Math.floor(Ae() * (t - e + 1)),
  Be = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  T = 46,
  H = 30,
  N = T * H,
  st = 0,
  It = 1,
  Ot = 2,
  yn = 3,
  ot = 4,
  Sn = 5,
  Tn = 6,
  V = new Uint8Array(N),
  re = new Float32Array(N),
  Q = new Uint8Array(N),
  j = new Float32Array(N),
  O = new Int16Array(N).fill(-1),
  S = (e, t) => t * T + e,
  L = (e) => e % T,
  P = (e) => (e - (e % T)) / T,
  x = (e) => e - T / 2 + 0.5,
  b = (e) => e - H / 2 + 0.5,
  Le = [],
  Pe = [],
  be = [
    [2, 7],
    [10, 15],
  ];
for (let e = 0; e < 11; e++) Le.push(3 + 4 * e);
for (let e = 0; e < 10; e++) Pe.push(5 + 4 * e);
var at = [
    [8, 9],
    [16, 17],
    [30, 31],
    [38, 39],
  ],
  Re = [6, 12, 18, 24, 30, 36],
  R = [],
  C = [],
  Ue = [],
  oe = [],
  He = [];
for (const e of Le)
  for (const [t, n] of be)
    for (let s = t; s <= n; s++) ((V[S(e, s)] = It), (V[S(e + 1, s)] = It));
for (let e = 4; e <= 41; e++) {
  const t = at.some((n) => e >= n[0] && e <= n[1]);
  (He.push({ x: e, z: 19, elev: t }),
    t ? (re[S(e, 19)] = 0.4) : (V[S(e, 19)] = Ot));
}
for (let e = 22; e <= 24; e++) for (let t = 18; t <= 20; t++) V[S(e, t)] = Sn;
Re.forEach((e, t) => {
  for (let n = e; n <= e + 1; n++)
    for (let s = 24; s <= 25; s++) V[S(n, s)] = yn;
  for (let n = e - 1; n <= e + 2; n++)
    for (let s = 22; s <= 23; s++) re[S(n, s)] += 0.6;
  R.push({
    i: t,
    name: "S" + (t + 1),
    x: e,
    entry: S(e, 23),
    busy: -1,
    timer: 0,
    done: 0,
    queue: 0,
    load: 0,
  });
});
for (let e = 6; e <= 41; e++)
  (He.push({ x: e, z: 27, elev: !1 }), (V[S(e, 27)] = Ot));
for (let e = 42; e <= 43; e++) for (let t = 26; t <= 28; t++) V[S(e, t)] = Tn;
[
  [1, 22],
  [1, 24],
  [1, 26],
  [1, 28],
  [3, 22],
  [3, 24],
  [3, 26],
  [3, 28],
].forEach((e, t) => {
  const n = S(e[0], e[1]);
  ((V[n] = ot),
    C.push({
      i: t,
      name: "CH-" + (t + 1),
      cell: n,
      x: e[0],
      z: e[1],
      online: !0,
      occupant: -1,
      reserved: -1,
    }));
});
for (let e = 0; e <= 4; e++) for (let t = 21; t <= 29; t++) re[S(e, t)] += 0.8;
for (let e = 43; e <= 45; e++) for (let t = 21; t <= 25; t++) oe.push(S(e, t));
for (let e = 44; e <= 45; e++) for (let t = 26; t <= 29; t++) oe.push(S(e, t));
for (const e of oe) re[e] += 0.8;
for (let e = 0; e < T; e++) ((re[S(e, 29)] += 2), (re[S(e, 0)] += 0.6));
var Gt = (e) => {
  const t = V[e];
  return t === st || t === ot;
};
for (const e of Le)
  for (const [t, n] of be)
    for (let s = t; s <= n; s++)
      (e - 1 >= 0 &&
        Gt(S(e - 1, s)) &&
        Ue.push({ shelf: S(e, s), face: S(e - 1, s), side: -1 }),
        e + 2 < T &&
          Gt(S(e + 2, s)) &&
          Ue.push({ shelf: S(e + 1, s), face: S(e + 2, s), side: 1 }));
function we(e) {
  const t = L(e),
    n = P(e);
  if (n >= 2 && n <= 15) {
    const s = Pe.findIndex((o) => t === o || t === o + 1);
    return s >= 0
      ? "AISLE " + String(s + 1).padStart(2, "0")
      : n >= 8 && n <= 9
        ? "CROSS AISLE"
        : "STORAGE EDGE";
  }
  if (n === 19) {
    const s = at.findIndex((o) => t >= o[0] && t <= o[1]);
    return s >= 0 ? "CROSSING C" + (s + 1) : "CONVEYOR";
  }
  if (n >= 16 && n <= 18) return "NORTH CORRIDOR";
  if (t <= 4 && n >= 21) return "CHARGING BAY";
  if (t >= 43 && n >= 21) return "PARKING";
  if (n >= 20 && n <= 23) {
    let s = 0,
      o = 1e9;
    return (
      Re.forEach((a, l) => {
        const d = Math.abs(a + 0.5 - t);
        d < o && ((o = d), (s = l));
      }),
      "STATION S" + (s + 1) + " APPROACH"
    );
  }
  return n >= 26 ? "OUTBOUND LANE" : "FLOOR";
}
var je = [...oe, ...C.map((e) => e.cell)];
for (let e = 5; e <= 41; e += 2) je.push(S(e, 21));
for (let e = 5; e <= 41; e += 2) je.push(S(e, 17));
for (let e = 5; e <= 41; e += 2) je.push(S(e, 1));
var _e = new Float32Array(N),
  it = new Int32Array(N),
  rt = new Int32Array(N),
  lt = new Int32Array(N),
  le = 0,
  ct = N * 4,
  z = new Float32Array(ct),
  F = new Int32Array(ct),
  Z = 0;
function Dt(e, t) {
  if (Z >= ct) return;
  let n = Z++;
  for (z[n] = e, F[n] = t; n > 0;) {
    const s = (n - 1) >> 1;
    if (z[s] <= z[n]) break;
    const o = z[s],
      a = F[s];
    ((z[s] = z[n]), (F[s] = F[n]), (z[n] = o), (F[n] = a), (n = s));
  }
}
function kn() {
  const e = F[0];
  if ((Z--, Z > 0)) {
    ((z[0] = z[Z]), (F[0] = F[Z]));
    let t = 0;
    for (;;) {
      const n = 2 * t + 1,
        s = n + 1;
      let o = t;
      if (
        (n < Z && z[n] < z[o] && (o = n),
        s < Z && z[s] < z[o] && (o = s),
        o === t)
      )
        break;
      const a = z[o],
        l = F[o];
      ((z[o] = z[t]), (F[o] = F[t]), (z[t] = a), (F[t] = l), (t = o));
    }
  }
  return e;
}
var ce = (e, t) => Math.abs(L(e) - L(t)) + Math.abs(P(e) - P(t)),
  $t = [1, -1, 0, 0],
  Nt = [0, 0, 1, -1],
  g = [];
function Me(e) {
  if (Q[e]) return !1;
  const t = V[e];
  return t === st || t === ot;
}
function zt(e, t, n, s) {
  if (e === t) return [];
  if (!Me(t)) return null;
  (le++, (Z = 0), (_e[e] = 0), (it[e] = -1), (rt[e] = le), Dt(ce(e, t), e));
  let o = 0;
  for (; Z > 0;) {
    const a = kn();
    if (a === t) {
      const h = [];
      let u = a;
      for (; u !== e && u >= 0;) (h.push(u), (u = it[u]));
      return (h.reverse(), h);
    }
    if (lt[a] === le) continue;
    if (((lt[a] = le), ++o > N * 3)) break;
    const l = L(a),
      d = P(a);
    for (let h = 0; h < 4; h++) {
      const u = l + $t[h],
        p = d + Nt[h];
      if (u < 0 || p < 0 || u >= T || p >= H) continue;
      const v = p * T + u;
      if (lt[v] === le || !Me(v)) continue;
      let m = 1 + re[v] + Math.min(j[v], 3) * 0.45;
      const I = O[v];
      if (I >= 0 && I !== n) {
        const se = g[I];
        m += se && se.next < 0 ? (s ? 9 : 4) : 1.2;
      }
      const $ = _e[a] + m;
      (rt[v] !== le || $ < _e[v]) &&
        ((rt[v] = le), (_e[v] = $), (it[v] = a), Dt($ + ce(v, t) * 1.001, v));
    }
  }
  return null;
}
var dt = 1 / 30,
  J = 60,
  Bt = 4,
  En = 75,
  Ut = 35,
  i = {
    time: 0,
    tick: 0,
    playing: !1,
    speed: 1,
    rate: 30,
    autoReroute: !1,
    orderAcc: 0,
    jobs: [],
    pending: [],
    done: [],
    deliveries: [],
    completedWaits: [],
    events: [],
    nextJob: 98200,
    nextRobot: 3101,
    faults: 0,
    parcels: [],
    parcelAcc: 0,
    replanQ: new Set(),
    selected: null,
    hovered: null,
    congestionCell: -1,
    congestionLevel: 0,
    scenario: "baseline",
    metrics: { thr: 0, wait: 0, jobs: 0, delayed: 0, pending: 0 },
    spark: { thr: [], wait: [], jobs: [], del: [] },
    lastSample: -1,
    sysStatus: "OK",
  },
  K = { paths: !1, heat: !1, queues: !0, ids: !1, bounds: !1, zones: !0 },
  c = {
    IDLE: "IDLE",
    TO_PICK: "TO PICK",
    PICKING: "PICKING",
    TO_STATION: "DELIVER",
    QUEUED: "QUEUED",
    PROCESSING: "AT STATION",
    TO_CHARGER: "TO CHARGER",
    CHARGING: "CHARGING",
    TO_PARK: "PARKING",
    FAULT: "FAULT",
    BLOCKED: "BLOCKED",
    SIDESTEP: "YIELDING",
  },
  Ht = () => {
    const e = Math.floor(i.time) + 36e3 + 1440,
      t = Math.floor(e / 3600) % 24,
      n = Math.floor(e / 60) % 60,
      s = e % 60;
    return `${String(t).padStart(2, "0")}:${String(n).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
function B(e, t) {
  (i.events.push({ t: Ht(), kind: e, text: t }),
    i.events.length > 60 && i.events.shift(),
    D.pushEvent(i.events[i.events.length - 1]));
}
var Zn = (e, t) => ((t.x = x(L(e))), (t.z = b(P(e))), t);
function Cn(e) {
  const t = {
    id: g.length,
    name: "R-" + i.nextRobot++,
    cell: e,
    next: -1,
    prog: 0,
    x: x(L(e)),
    z: b(P(e)),
    path: [],
    pi: 0,
    state: c.IDLE,
    job: null,
    carrying: !1,
    battery: 55 + Ae() * 45,
    speed: 1.6,
    wait: 0,
    totalWait: 0,
    queueTime: 0,
    dist: 0,
    target: -1,
    dwell: 0,
    charger: -1,
    faultT: 0,
    cooldown: 0,
    stuck: 0,
    parked: oe.includes(e),
    yaw: 0,
    rerouted: !1,
    resumeState: null,
    sinceReroute: 0,
  };
  return ((O[e] = t.id), t);
}
function An() {
  for (const e of je) if (O[e] < 0 && !Q[e]) return e;
  for (let e = 0; e < N; e++) if (Me(e) && O[e] < 0) return e;
  return -1;
}
function jt() {
  if (g.length >= J) return !1;
  const e = An();
  if (e < 0) return !1;
  const t = Cn(e);
  g.push(t);
  const n = C.find((s) => s.cell === e);
  return (
    n && ((n.occupant = t.id), (t.charger = n.i), (t.state = c.CHARGING)),
    !0
  );
}
function Ln() {
  if (g.length <= Bt) return !1;
  let e =
    g.find((t) => t.state === c.IDLE && t.parked && !t.job) ||
    g.find((t) => t.state === c.IDLE && !t.job) ||
    g.find((t) => t.state === c.TO_PARK || t.state === c.CHARGING) ||
    g[g.length - 1];
  if ((e === i.selected && ge(null), e.job)) {
    const t = e.job;
    ((t.robot = null),
      (t.assigned = -1),
      (t.picked = !1),
      i.pending.unshift(t));
  }
  xe(e);
  for (const t of R) t.busy === e.id && (t.busy = -1);
  (g.splice(e.id, 1),
    O.fill(-1),
    g.forEach((t, n) => {
      ((t.id = n), (O[t.cell] = n), t.next >= 0 && (O[t.next] = n));
    }));
  for (const t of C)
    ((t.occupant = g.findIndex(
      (n) => n.charger === t.i && n.state === c.CHARGING,
    )),
      (t.reserved = g.findIndex((n) => n.charger === t.i)));
  for (const t of R)
    t.busy = g.findIndex(
      (n) => n.state === c.PROCESSING && n.job && n.job.station === t.i,
    );
  return !0;
}
function xe(e) {
  if (e.charger >= 0) {
    const t = C[e.charger];
    (t.occupant === e.id && (t.occupant = -1),
      t.reserved === e.id && (t.reserved = -1),
      (e.charger = -1));
  }
}
function Pn(e, t) {
  let n = null,
    s = 1e9;
  for (const o of R) {
    const a =
      (t ? 0.5 : 1) * ce(e, o.entry) * 0.6 + o.load * 6 + (o.busy >= 0 ? 3 : 0);
    a < s && ((s = a), (n = o));
  }
  return n;
}
function ft(e) {
  const t = Ue[me(0, Ue.length - 1)],
    n = Pn(t.face, e);
  n.load++;
  const s = {
    id: "T-" + i.nextJob++,
    shelf: t.shelf,
    pick: t.face,
    station: n.i,
    rush: !!e,
    created: i.time,
    assigned: -1,
    picked: !1,
    completed: -1,
    robot: null,
    wait: 0,
    sla: e ? Ut : En,
    aisle: we(t.face),
  };
  return (i.jobs.push(s), e ? i.pending.unshift(s) : i.pending.push(s), s);
}
function te(e, t) {
  const n = e.next >= 0 ? e.next : e.cell,
    s = zt(n, t, e.id, e.stuck > 0);
  return (
    (e.target = t),
    s === null
      ? ((e.path = []), (e.pi = 0), !1)
      : ((e.path = s), (e.pi = 0), !0)
  );
}
function _t(e, t) {
  ((e.job = t),
    (t.robot = e),
    (t.assigned = i.time),
    (e.parked = !1),
    (e.state = c.TO_PICK),
    (e.rerouted = !1),
    (e.queueTime = 0),
    te(e, t.pick) || Ie(e));
}
function Ie(e) {
  (i.autoReroute && i.replanQ.add(e.id),
    (e.stuck = Math.min(e.stuck + 1, 3)),
    (e.cooldown = 2.5));
}
function Fe(e) {
  let t = null,
    n = 1e9;
  for (const s of C) {
    if (!s.online || s.reserved >= 0) continue;
    const o = ce(e.cell, s.cell);
    o < n && ((n = o), (t = s));
  }
  return t
    ? ((t.reserved = e.id),
      (e.charger = t.i),
      (e.parked = !1),
      (e.state = c.TO_CHARGER),
      te(e, t.cell) || Ie(e),
      !0)
    : !1;
}
function Rn(e) {
  let t = -1,
    n = 1e9;
  for (const s of oe) {
    if (
      (O[s] >= 0 && O[s] !== e.id) ||
      g.some((a) => a !== e && a.target === s && a.state === c.TO_PARK)
    )
      continue;
    const o = ce(e.cell, s);
    o < n && ((n = o), (t = s));
  }
  t < 0 || ((e.state = c.TO_PARK), te(e, t) || (e.state = c.IDLE));
}
function Mn(e) {
  const t = e.job,
    n = R[t.station];
  ((n.load = Math.max(0, n.load - 1)),
    n.done++,
    (n.busy = -1),
    (t.completed = i.time),
    (t.wait = e.queueTime),
    i.deliveries.push(i.time),
    i.deliveries.length > 400 && i.deliveries.shift(),
    i.completedWaits.push(e.queueTime),
    i.completedWaits.length > 24 && i.completedWaits.shift());
  const s = i.time - t.created > t.sla;
  (i.done.push(t), i.done.length > 200 && i.done.shift());
  const o = i.jobs.indexOf(t);
  (o >= 0 && i.jobs.splice(o, 1),
    Ke(1, n.x + 1, t.rush ? 2 : s ? 3 : me(0, 1)),
    (t.rush || s) &&
      B(
        s ? "warn" : "ok",
        `${t.id} ${t.rush ? "RUSH " : ""}delivered at ${n.name} by ${e.name}${s ? " \xB7 LATE" : ""}`,
      ),
    (e.job = null),
    (e.carrying = !1),
    (e.queueTime = 0),
    (e.state = c.IDLE));
}
function Ke(e, t, n) {
  (i.parcels.length >= 140 && i.parcels.shift(),
    i.parcels.push({ belt: e, t, color: n }));
}
function ut() {
  if (!i.pending.length) return;
  let e = 0;
  for (let t = 0; t < i.pending.length && e < 6; t++) {
    const n = i.pending[t];
    let s = null,
      o = 1e9;
    for (const a of g) {
      if (a.state !== c.IDLE || a.job || a.battery < 22) continue;
      const l = ce(a.cell, n.pick) + (a.parked ? 4 : 0);
      l < o && ((o = l), (s = a));
    }
    if (!s) {
      if (n.rush) {
        for (const a of g)
          if (a.state === c.TO_PICK && a.job && !a.job.rush && !a.job.picked) {
            const l = ce(a.cell, n.pick);
            l < o && ((o = l), (s = a));
          }
        if (s) {
          const a = s.job;
          ((a.robot = null),
            (a.assigned = -1),
            i.pending.splice(t, 1),
            i.pending.unshift(a),
            (t = 0),
            _t(s, n),
            e++,
            B("warn", `${s.name} preempted for rush ${n.id}`));
          continue;
        }
      }
      break;
    }
    (i.pending.splice(t, 1), t--, _t(s, n), e++);
  }
}
function In(e) {
  switch (e.state) {
    case c.TO_PICK:
      ((e.state = c.PICKING), (e.dwell = 1.4));
      break;
    case c.TO_STATION: {
      const t = R[e.job.station];
      ((t.busy = e.id), (e.state = c.PROCESSING), (e.dwell = 3.2));
      break;
    }
    case c.TO_CHARGER: {
      const t = C[e.charger];
      !t || !t.online || e.cell !== t.cell
        ? (xe(e), (e.state = c.IDLE), Fe(e) || (e.state = c.IDLE))
        : ((t.occupant = e.id), (e.state = c.CHARGING));
      break;
    }
    case c.TO_PARK:
      ((e.state = c.IDLE), (e.parked = !0));
      break;
    case c.SIDESTEP:
      ((e.state = e.resumeState || c.IDLE),
        (e.resumeState = null),
        e.state !== c.IDLE && Oe(e));
      break;
    default:
      e.state = c.IDLE;
  }
  e.stuck = 0;
}
function Oe(e) {
  const t = e.target;
  if (!(t < 0)) {
    if (e.state === c.TO_STATION) {
      if (!te(e, t)) {
        const n = e.job,
          s = R[n.station];
        let o = null,
          a = 1e9;
        for (const l of R) {
          if (l === s) continue;
          const d = zt(e.next >= 0 ? e.next : e.cell, l.entry, e.id, !1);
          d && d.length < a && ((a = d.length), (o = l));
        }
        o
          ? (s.load--,
            o.load++,
            (n.station = o.i),
            te(e, o.entry),
            B("info", `${e.name} diverted to ${o.name}`))
          : Ie(e);
      }
    } else
      e.state === c.TO_CHARGER
        ? te(e, t) || (xe(e), Fe(e) || (e.state = c.IDLE))
        : e.state === c.TO_PARK
          ? te(e, t) || (e.state = c.IDLE)
          : te(e, t) || Ie(e);
    e.sinceReroute = 0;
  }
}
function On(e) {
  const t = L(e.cell),
    n = P(e.cell),
    s = e.pi < e.path.length ? e.path[e.pi] : -1;
  for (let o = 0; o < 4; o++) {
    const a = t + $t[o],
      l = n + Nt[o];
    if (a < 0 || l < 0 || a >= T || l >= H) continue;
    const d = l * T + a;
    if (!(d === s || !Me(d) || O[d] >= 0))
      return (
        e.state !== c.SIDESTEP &&
          ((e.resumeState = e.state), (e.state = c.SIDESTEP)),
        (e.path = [d]),
        (e.pi = 0),
        (e.wait = 0),
        !0
      );
  }
  return !1;
}
function Gn(e, t) {
  if (e.next < 0) {
    if (e.pi >= e.path.length)
      if (e.target >= 0 && e.cell !== e.target && e.state !== c.SIDESTEP) {
        if (
          (e.cooldown <= 0 ? (Oe(e), (e.cooldown = 1.5)) : (e.cooldown -= t),
          e.pi >= e.path.length)
        ) {
          ((e.wait += t), (j[e.cell] += t * 1.5));
          return;
        }
      } else {
        In(e);
        return;
      }
    const d = e.path[e.pi];
    if (Q[d] || !Me(d)) {
      ((e.wait += t),
        (e.totalWait += t),
        (e.queueTime += t),
        (j[e.cell] += t * 3),
        (i.autoReroute || e.wait > 18) && (i.replanQ.add(e.id), (e.wait = 0)));
      return;
    }
    const h = O[d];
    if (h >= 0 && h !== e.id) {
      ((e.wait += t),
        (e.totalWait += t),
        (e.queueTime += t),
        (j[e.cell] +=
          t *
          (e.state === c.TO_STATION && e.path.length - e.pi <= 3 ? 0.5 : 2.2)));
      const u = g[h];
      if (
        ((u &&
          u.next < 0 &&
          u.pi < u.path.length &&
          u.path[u.pi] === e.cell &&
          e.wait > 0.6) ||
          e.wait > 2.4) &&
        e.cooldown <= 0
      ) {
        if ((e.stuck++, e.stuck >= 3 && On(e))) {
          e.cooldown = 1;
          return;
        }
        (i.replanQ.add(e.id), (e.cooldown = 1.2 + Ae() * 0.8));
      }
      e.cooldown > 0 && (e.cooldown -= t);
      return;
    }
    ((O[d] = e.id),
      (e.next = d),
      (e.prog = 0),
      (e.wait = 0),
      (e.cooldown = 0),
      e.stuck > 0 &&
        e.state !== c.SIDESTEP &&
        (e.stuck = Math.max(0, e.stuck - 1)));
  }
  const n = e.carrying ? 1.35 : e.speed;
  e.prog += n * t;
  const s = x(L(e.cell)),
    o = b(P(e.cell)),
    a = x(L(e.next)),
    l = b(P(e.next));
  ((e.yaw = Math.atan2(a - s, l - o)),
    e.prog >= 1
      ? (O[e.cell] === e.id && (O[e.cell] = -1),
        (e.cell = e.next),
        (e.next = -1),
        e.pi++,
        (e.dist += 1),
        (e.x = a),
        (e.z = l),
        (j[e.cell] += 0.12))
      : ((e.x = s + (a - s) * e.prog), (e.z = o + (l - o) * e.prog)));
}
function Dn(e, t) {
  if (((e.sinceReroute += t), e.state === c.FAULT)) {
    ((e.faultT -= t),
      e.faultT <= 0 &&
        ((e.state = e.resumeState || c.IDLE),
        (e.resumeState = null),
        e.state !== c.IDLE && Oe(e),
        B("ok", `${e.name} recovered from fault`)),
      (j[e.cell] += t * 0.8));
    return;
  }
  const n = e.next >= 0;
  switch (
    ((e.battery -= t * (n ? 0.14 : e.state === c.CHARGING ? 0 : 0.012)),
    e.battery < 0 && (e.battery = 0),
    e.state)
  ) {
    case c.IDLE:
      if (e.battery < 24 && Fe(e)) break;
      if (!e.job && !e.parked && i.pending.length === 0 && e.battery >= 24) {
        if (e.battery < 55 && Fe(e)) break;
        Rn(e);
      }
      break;
    case c.PICKING:
      ((e.dwell -= t),
        e.dwell <= 0 &&
          ((e.carrying = !0),
          (e.job.picked = !0),
          (e.state = c.TO_STATION),
          (e.rerouted = !1),
          te(e, R[e.job.station].entry) || Ie(e)));
      break;
    case c.PROCESSING:
      ((e.dwell -= t), e.dwell <= 0 && Mn(e));
      break;
    case c.CHARGING: {
      const s = C[e.charger];
      if (!s || !s.online) {
        (xe(e),
          (e.state = c.IDLE),
          B("warn", `${e.name} evicted from offline charger`));
        break;
      }
      ((e.battery += t * 5.5),
        e.battery >= 96 &&
          ((e.battery = 96), xe(e), (e.state = c.IDLE), (e.parked = !1)));
      break;
    }
    default:
      Gn(e, t);
  }
  e.state === c.TO_STATION && e.next < 0 && e.job;
}
function Ft() {
  for (const e of R) e.queue = 0;
  for (const e of g)
    e.state === c.TO_STATION &&
      e.job &&
      e.next < 0 &&
      e.path.length - e.pi <= 6 &&
      R[e.job.station].queue++;
}
function Kt() {
  let e = 0;
  for (let t = 0; t < N; t++) Q[t] && e++;
  return (
    (e = e > 0 ? Math.ceil(e / 9) : 0),
    (e += C.filter((t) => !t.online).length),
    (e += g.filter((t) => t.state === c.FAULT).length),
    e
  );
}
var ae = [];
function Wt(e, t) {
  if (ae.length >= 6)
    return (ne("Barricade limit reached (6). Clear incidents first."), !1);
  const n = L(e),
    s = P(e),
    o = [];
  for (let l = -1; l <= 1; l++)
    for (let d = -1; d <= 1; d++) {
      const h = n + d,
        u = s + l;
      if (h < 0 || u < 0 || h >= T || u >= H) continue;
      const p = u * T + h;
      V[p] === st &&
        !Q[p] &&
        !oe.includes(p) &&
        !R.some((v) => v.entry === p) &&
        o.push(p);
    }
  if (!o.length) return !1;
  for (const l of o) Q[l] = 1;
  ae.push({ cells: o, zone: we(e) });
  let a = 0;
  for (const l of g)
    for (let d = l.pi; d < l.path.length; d++)
      if (Q[l.path[d]]) {
        (a++, i.autoReroute && i.replanQ.add(l.id));
        break;
      }
  return (
    t ||
      B(
        "bad",
        `Barricade placed at ${we(e)} \xB7 ${a} routes cut${i.autoReroute ? " \xB7 auto rerouting" : ""}`,
      ),
    !0
  );
}
function Ge() {
  let e = 0;
  for (const t of g)
    t.target >= 0 &&
      (t.state === c.TO_PICK ||
        t.state === c.TO_STATION ||
        t.state === c.TO_CHARGER ||
        t.state === c.TO_PARK ||
        t.state === c.BLOCKED) &&
      (Oe(t), (t.rerouted = !0), (t.wait = 0), (t.stuck = 0), e++);
  return (
    i.replanQ.clear(),
    B(
      "info",
      `Reroute fleet \xB7 ${e} routes recomputed with live congestion costs`,
    ),
    D.flash("tReroute"),
    e
  );
}
function $n() {
  const e = ft(!0);
  (ut(),
    B(
      "warn",
      `Rush order ${e.id} \u2192 ${e.aisle} \u2192 ${R[e.station].name} \xB7 SLA ${Ut}s`,
    ));
}
function Nn() {
  const e = C.filter((s) => s.online);
  if (e.length <= 1) {
    ne("At least one charger must stay online.");
    return;
  }
  let t = e.find((s) => s.occupant >= 0) || e[e.length - 1];
  t.online = !1;
  const n = t.occupant >= 0 ? g[t.occupant] : null;
  if (((t.occupant = -1), t.reserved >= 0 && g[t.reserved])) {
    const s = g[t.reserved];
    s !== n && (xe(s), (s.state = c.IDLE));
  }
  ((t.reserved = -1),
    n &&
      ((n.charger = -1),
      (n.state = c.IDLE),
      B("warn", `${n.name} evicted from ${t.name}`)),
    B(
      "bad",
      `${t.name} forced offline \xB7 ${C.filter((s) => s.online).length} pads remain`,
    ));
}
function zn() {
  let e = i.selected;
  if (!e || e.state === c.FAULT || e.state === c.CHARGING) {
    const t = g.filter(
      (n) => n.state !== c.FAULT && n.state !== c.CHARGING && n.next >= 0,
    );
    if (!t.length) {
      ne("No moving robot to fault.");
      return;
    }
    e = t[me(0, t.length - 1)];
  }
  if (e.state === c.PROCESSING) {
    const t = R[e.job.station];
    ((t.busy = -1), (e.state = c.TO_STATION));
  }
  (e.next >= 0 &&
    (O[e.cell] === e.id && (O[e.cell] = -1),
    (e.cell = e.next),
    (e.next = -1),
    e.pi++,
    (e.x = x(L(e.cell))),
    (e.z = b(P(e.cell)))),
    (e.resumeState =
      e.state === c.IDLE || e.state === c.SIDESTEP ? c.IDLE : e.state),
    (e.state = c.FAULT),
    (e.faultT = 25),
    i.faults++,
    B(
      "bad",
      `${e.name} FAULT \xB7 drive stall at ${we(e.cell)} \xB7 25s recovery`,
    ));
}
function Bn() {
  let e = 0;
  for (const t of ae) {
    for (const n of t.cells) Q[n] = 0;
    e++;
  }
  ae.length = 0;
  for (const t of C) t.online || ((t.online = !0), e++);
  for (const t of g) t.state === c.FAULT && ((t.faultT = 0.01), e++);
  for (const t of g)
    t.state === c.BLOCKED && (t.state = t.resumeState || c.IDLE);
  (B("ok", `Incidents cleared (${e})`), i.autoReroute && Ge());
}
var qt = [
  { z: 19, x0: 4, x1: 41.5 },
  { z: 27, x0: 6, x1: 41.5 },
];
function Un(e) {
  ((i.parcelAcc += e),
    i.parcelAcc >= 1.7 && ((i.parcelAcc -= 1.7), Ke(0, 4, me(0, 1))));
  for (let t = i.parcels.length - 1; t >= 0; t--) {
    const n = i.parcels[t];
    ((n.t += e * 1.25), n.t > qt[n.belt].x1 && i.parcels.splice(t, 1));
  }
}
function Vt() {
  const e = i.time,
    t = 120;
  let n = 0;
  for (let p = i.deliveries.length - 1; p >= 0 && e - i.deliveries[p] <= t; p--)
    n++;
  const s = Math.max(30, Math.min(t, e));
  i.metrics.thr = Math.round((n / s) * 3600);
  const o = i.completedWaits;
  ((i.metrics.wait = o.length ? o.reduce((p, v) => p + v, 0) / o.length : 0),
    (i.metrics.jobs = g.filter((p) => p.job).length),
    (i.metrics.pending = i.pending.length));
  let a = 0;
  for (const p of i.jobs) e - p.created > p.sla && a++;
  i.metrics.delayed = a;
  const l = i.spark;
  (l.thr.push(i.metrics.thr),
    l.wait.push(i.metrics.wait),
    l.jobs.push(i.metrics.jobs),
    l.del.push(a));
  for (const p in l) l[p].length > 90 && l[p].shift();
  let d = 0,
    h = -1;
  for (let p = 0; p < N; p++) j[p] > d && ((d = j[p]), (h = p));
  ((i.congestionLevel = d), (i.congestionCell = h));
  const u = Kt();
  i.sysStatus =
    a > 10 || d > 14 ? "CRITICAL" : u > 0 || a > 2 || d > 8 ? "DEGRADED" : "OK";
}
function Qt() {
  const e = dt;
  for (i.tick++, i.time += e, i.orderAcc += (i.rate / 60) * e; i.orderAcc >= 1;)
    ((i.orderAcc -= 1), i.jobs.length < 220 && ft(!1));
  i.tick % 6 === 0 && ut();
  for (const n of g) Dn(n, e);
  let t = 0;
  for (const n of i.replanQ) {
    const s = g[n];
    if (
      (i.replanQ.delete(n),
      !!s &&
        (s.target >= 0 && s.next < 0 && s.state !== c.FAULT && (Oe(s), t++),
        t >= 8))
    )
      break;
  }
  if ((Un(e), i.tick % 3 === 0)) {
    const n = 1 - 0.09 * e * 3;
    for (let s = 0; s < N; s++) ((j[s] *= n), j[s] < 0.02 && (j[s] = 0));
  }
  (i.tick % 10 === 0 && Ft(),
    Math.floor(i.time) !== i.lastSample &&
      ((i.lastSample = Math.floor(i.time)), Vt()));
}
var Jt = {
  baseline: { seed: 11, robots: 24, rate: 30, auto: !1 },
  peak: { seed: 23, robots: 44, rate: 72, auto: !1 },
  chargers: {
    seed: 37,
    robots: 32,
    rate: 36,
    auto: !0,
    lowBat: !0,
    offline: 5,
  },
  closure: {
    seed: 51,
    robots: 34,
    rate: 48,
    auto: !1,
    block: [S(16, 19), S(30, 19)],
  },
};
function ht() {
  const e = Jt[i.scenario] || Jt.baseline;
  ((Ae = nt(e.seed)),
    (i.time = 0),
    (i.tick = 0),
    (i.orderAcc = 0),
    (i.jobs = []),
    (i.pending = []),
    (i.done = []),
    (i.deliveries = []),
    (i.completedWaits = []),
    (i.events = []),
    (i.nextJob = 98200),
    (i.nextRobot = 3101),
    (i.faults = 0),
    (i.parcels = []),
    (i.parcelAcc = 0),
    i.replanQ.clear(),
    (i.lastSample = -1),
    (i.rate = e.rate),
    (i.autoReroute = !!e.auto),
    (i.congestionCell = -1),
    (i.congestionLevel = 0),
    (i.sysStatus = "OK"));
  for (const t in i.spark) i.spark[t].length = 0;
  ((i.metrics = { thr: 0, wait: 0, jobs: 0, delayed: 0, pending: 0 }),
    O.fill(-1),
    j.fill(0),
    Q.fill(0),
    (ae.length = 0),
    (g = []),
    ge(null),
    (i.hovered = null));
  for (const t of R) ((t.busy = -1), (t.load = 0), (t.done = 0), (t.queue = 0));
  for (const t of C) ((t.online = !0), (t.occupant = -1), (t.reserved = -1));
  for (let t = 0; t < e.robots; t++) jt();
  if (e.lowBat) for (const t of g) t.battery = 18 + Ae() * 30;
  if (e.offline)
    for (let t = 0; t < e.offline; t++) C[C.length - 1 - t].online = !1;
  for (let t = 4; t <= 40; t += 1.7) Ke(0, t, me(0, 1));
  for (let t = 6; t <= 40; t += 2.6) Ke(1, t, me(0, 1));
  for (let t = 0; t < Math.min(6, Math.round(e.robots / 4)); t++) ft(!1);
  if ((ut(), e.block)) for (const t of e.block) Wt(t, !0);
  (D.reset(),
    B(
      "info",
      `Scenario ${i.scenario.toUpperCase()} loaded \xB7 ${g.length} robots \xB7 ${e.rate}/min`,
    ),
    e.block &&
      B(
        "bad",
        "Crossings C2 and C3 closed \xB7 auto reroute OFF \xB7 press REROUTE FLEET",
      ));
}
var W = document.getElementById("gl"),
  pt = document.getElementById("stage"),
  de = new r.WebGLRenderer({
    canvas: W,
    antialias: !0,
    alpha: !1,
    powerPreference: "high-performance",
  });
(de.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75)),
  (de.shadowMap.enabled = !0),
  (de.shadowMap.type = r.PCFShadowMap),
  (de.outputColorSpace = r.SRGBColorSpace));
var k = new r.Scene();
k.background = new r.Color(15527665);
var G = new r.OrthographicCamera(-30, 30, 18, -18, 1, 400),
  Yt = new r.Vector3(-42, 42, 42);
(G.position.copy(Yt), G.lookAt(0, 0, 0));
var U = new xn(G, W);
((U.enableDamping = !Be),
  (U.dampingFactor = 0.12),
  (U.minZoom = 0.55),
  (U.maxZoom = 4),
  (U.minPolarAngle = 0.35),
  (U.maxPolarAngle = 1.25),
  (U.screenSpacePanning = !1),
  (U.mouseButtons = {
    LEFT: r.MOUSE.ROTATE,
    MIDDLE: r.MOUSE.DOLLY,
    RIGHT: r.MOUSE.PAN,
  }),
  (U.touches = { ONE: r.TOUCH.ROTATE, TWO: r.TOUCH.DOLLY_PAN }),
  k.add(new r.HemisphereLight(16777215, 12172484, 0.95)));
var q = new r.DirectionalLight(16774374, 1.35);
(q.position.set(-18, 34, 14),
  (q.castShadow = !0),
  q.shadow.mapSize.set(2048, 2048),
  (q.shadow.camera.left = -34),
  (q.shadow.camera.right = 34),
  (q.shadow.camera.top = 26),
  (q.shadow.camera.bottom = -26),
  (q.shadow.camera.near = 5),
  (q.shadow.camera.far = 110),
  (q.shadow.bias = -6e-4),
  (q.shadow.normalBias = 0.02),
  k.add(q));
var Xt = new r.DirectionalLight(14412021, 0.35);
(Xt.position.set(22, 18, -16), k.add(Xt));
var w = {
    graphite: new r.MeshStandardMaterial({
      color: 2829876,
      roughness: 0.75,
      metalness: 0.15,
    }),
    steel: new r.MeshStandardMaterial({
      color: 9278364,
      roughness: 0.55,
      metalness: 0.35,
    }),
    light: new r.MeshStandardMaterial({ color: 14277857, roughness: 0.85 }),
    white: new r.MeshStandardMaterial({ color: 15987958, roughness: 0.9 }),
    belt: new r.MeshStandardMaterial({ color: 3817030, roughness: 0.95 }),
    warm: new r.MeshStandardMaterial({ color: 15906565, roughness: 0.6 }),
    red: new r.MeshStandardMaterial({ color: 15026253, roughness: 0.6 }),
    green: new r.MeshStandardMaterial({ color: 3127658, roughness: 0.6 }),
    cyan: new r.MeshStandardMaterial({
      color: 1357014,
      roughness: 0.5,
      emissive: 1357014,
      emissiveIntensity: 0.25,
    }),
    redBar: new r.MeshStandardMaterial({
      color: 15026253,
      roughness: 0.6,
      emissive: 15026253,
      emissiveIntensity: 0.15,
    }),
    inst: new r.MeshStandardMaterial({ color: 16777215, roughness: 0.7 }),
    body: new r.MeshStandardMaterial({ color: 16777215, roughness: 0.55 }),
  },
  M = new r.Object3D(),
  ee = new r.Color(),
  gt = new r.Vector3(),
  Zt = new r.Vector3();
function Hn() {
  const t = document.createElement("canvas");
  ((t.width = T * 24), (t.height = H * 24));
  const n = t.getContext("2d");
  ((n.fillStyle = "#e3e5e9"),
    n.fillRect(0, 0, t.width, t.height),
    (n.strokeStyle = "rgba(20,23,28,0.045)"),
    (n.lineWidth = 1));
  for (let a = 0; a <= T; a++)
    (n.beginPath(),
      n.moveTo(a * 24, 0),
      n.lineTo(a * 24, t.height),
      n.stroke());
  for (let a = 0; a <= H; a++)
    (n.beginPath(), n.moveTo(0, a * 24), n.lineTo(t.width, a * 24), n.stroke());
  n.fillStyle = "#e9ebee";
  for (const a of Pe)
    for (const [l, d] of be) n.fillRect(a * 24, l * 24, 48, (d - l + 1) * 24);
  ((n.strokeStyle = "rgba(43,46,52,0.32)"),
    (n.lineWidth = 1.5),
    n.setLineDash([24 * 0.5, 24 * 0.5]));
  for (const a of Pe)
    for (const [l, d] of be)
      (n.beginPath(),
        n.moveTo((a + 1) * 24, l * 24),
        n.lineTo((a + 1) * 24, (d + 1) * 24),
        n.stroke());
  for (const a of [17, 21, 9])
    (n.beginPath(),
      n.moveTo(72, (a + 0.5) * 24),
      n.lineTo(1032, (a + 0.5) * 24),
      n.stroke());
  n.setLineDash([]);
  const s = (a, l, d, h) => {
    (n.save(),
      n.beginPath(),
      n.rect(a * 24, l * 24, d * 24, h * 24),
      n.clip(),
      (n.fillStyle = "rgba(242,183,5,0.55)"),
      n.fillRect(a * 24, l * 24, d * 24, h * 24),
      (n.strokeStyle = "rgba(43,46,52,0.55)"),
      (n.lineWidth = 3));
    for (let u = -h * 24; u < d * 24 + h * 24; u += 12)
      (n.beginPath(),
        n.moveTo(a * 24 + u, l * 24),
        n.lineTo(a * 24 + u - h * 24, (l + h) * 24),
        n.stroke());
    n.restore();
  };
  for (const a of Re)
    (s(a - 1, 22, 0.25, 2),
      s(a + 2.75, 22, 0.25, 2),
      s(a - 1, 22, 4, 0.2),
      (n.strokeStyle = "rgba(242,183,5,0.8)"),
      (n.lineWidth = 2),
      n.setLineDash([6, 6]),
      n.strokeRect((a - 1) * 24 + 2, 530, 92, 44),
      n.setLineDash([]));
  (s(0, 21, 5, 0.25), s(4.75, 21, 0.25, 9), s(0, 29, T, 0.3));
  for (const a of C)
    ((n.strokeStyle = "rgba(47,185,106,0.9)"),
      (n.lineWidth = 2),
      n.strokeRect(a.x * 24 + 3, a.z * 24 + 3, 18, 18));
  ((n.strokeStyle = "rgba(43,46,52,0.35)"), (n.lineWidth = 1.5));
  for (const a of oe) n.strokeRect(L(a) * 24 + 3, P(a) * 24 + 3, 18, 18);
  ((n.fillStyle = "rgba(43,46,52,0.55)"),
    (n.font = `bold ${24 * 0.75}px ${getComputedStyle(document.body).fontFamily}`),
    (n.textBaseline = "middle"),
    (n.textAlign = "center"),
    n.save(),
    n.translate(2.5 * 24, 600),
    n.rotate(-Math.PI / 2),
    n.fillText("CHARGING BAY", 0, 0),
    n.restore(),
    n.save(),
    n.translate(1056, 23.5 * 24),
    n.rotate(-Math.PI / 2),
    n.fillText("PARKING", 0, 0),
    n.restore(),
    (n.font = `bold ${24 * 0.6}px ${getComputedStyle(document.body).fontFamily}`),
    Re.forEach((a, l) =>
      n.fillText("STATION S" + (l + 1), (a + 1) * 24, 21.5 * 24),
    ),
    n.fillText("INBOUND \u25B8", 144, 18.4 * 24),
    n.fillText("OUTBOUND \u25B8", 192, 28.4 * 24),
    n.fillText("SORTER", 552, 17.5 * 24),
    Pe.forEach((a, l) => {
      (n.fillText("A" + String(l + 1).padStart(2, "0"), (a + 1) * 24, 1.5 * 24),
        n.fillText(
          "A" + String(l + 1).padStart(2, "0"),
          (a + 1) * 24,
          16.5 * 24,
        ));
    }));
  const o = new r.CanvasTexture(t);
  return (
    (o.colorSpace = r.SRGBColorSpace),
    (o.anisotropy = Math.min(8, de.capabilities.getMaxAnisotropy())),
    o
  );
}
var jn = Hn(),
  vt = new r.Mesh(
    new r.PlaneGeometry(T, H),
    new r.MeshStandardMaterial({ map: jn, roughness: 0.95 }),
  );
((vt.rotation.x = -Math.PI / 2), (vt.receiveShadow = !0), k.add(vt));
var mt = new r.Mesh(new r.BoxGeometry(T + 1.2, 0.5, H + 1.2), w.light);
((mt.position.y = -0.26), (mt.receiveShadow = !0), k.add(mt));
var ye = new Uint8Array(N * 4),
  Se = new r.DataTexture(ye, T, H, r.RGBAFormat);
((Se.magFilter = r.NearestFilter),
  (Se.minFilter = r.NearestFilter),
  (Se.flipY = !1),
  (Se.needsUpdate = !0));
var De = new r.Mesh(
  new r.PlaneGeometry(T, H),
  new r.MeshBasicMaterial({ map: Se, transparent: !0, depthWrite: !1 }),
);
((De.rotation.x = -Math.PI / 2),
  (De.position.y = 0.03),
  (De.visible = !1),
  k.add(De));
function en() {
  for (let e = 0; e < N; e++) {
    const t = Math.min(1, j[e] / 7),
      n = ((H - 1 - P(e)) * T + L(e)) * 4;
    if (t < 0.03) {
      ye[n + 3] = 0;
      continue;
    }
    const s = Math.min(1, t * 1.4);
    ((ye[n] = 242 + -13 * s),
      (ye[n + 1] = 183 + -111 * s),
      (ye[n + 2] = 5 + 72 * s),
      (ye[n + 3] = Math.round(40 + 180 * t)));
  }
  Se.needsUpdate = !0;
}
function E(e, t, n, s = !0) {
  const o = new r.InstancedMesh(e, t, n);
  return (
    (o.castShadow = s),
    (o.receiveShadow = s),
    o.instanceMatrix.setUsage(r.DynamicDrawUsage),
    k.add(o),
    o
  );
}
function y(e, t, n, s, o, a = 1, l = 1, d = 1, h = 0) {
  (M.position.set(n, s, o),
    M.rotation.set(0, h, 0),
    M.scale.set(a, l, d),
    M.updateMatrix(),
    e.setMatrixAt(t, M.matrix));
}
var tn = [
  2793880, 15895592, 8085159, 15906565, 14239803, 13148266, 13148266, 11570522,
  2793880, 4029401,
];
((function () {
  const t = Le.length * be.length,
    n = E(new r.BoxGeometry(0.1, 2.7, 0.1), w.graphite, t * 8),
    s = E(new r.BoxGeometry(2, 0.07, 6.05), w.steel, t * 4),
    o = E(new r.BoxGeometry(0.78, 0.5, 0.8), w.inst, t * 36);
  let a = 0,
    l = 0,
    d = 0;
  const h = nt(7);
  for (const u of Le)
    for (const [p, v] of be) {
      const m = x(u) - 0.5,
        I = x(u + 1) + 0.5,
        $ = (b(p) + b(v)) / 2,
        se = [b(p) - 0.47, b(p) - 0.47 + 3, b(v) + 0.47, b(p) - 0.47 + 3];
      for (let A = 0; A < 4; A++)
        (y(n, a++, m + 0.05, 1.35, se[A]), y(n, a++, I - 0.05, 1.35, se[A]));
      for (let A = 0; A < 4; A++) y(s, l++, (m + I) / 2, 0.45 + A * 0.72, $);
      for (let A = 0; A < 3; A++)
        for (let Y = p; Y <= v; Y++)
          for (let X = 0; X < 2; X++) {
            if (h() < 0.22) {
              (y(o, d, 0, -5, 0, 0.001, 0.001, 0.001),
                o.setColorAt(d, ee.set(16777215)),
                d++);
              continue;
            }
            const wn = tn[Math.floor(h() * tn.length)],
              Mt = 0.35 + h() * 0.2;
            (y(
              o,
              d,
              X ? x(u + 1) + 0.05 : x(u) - 0.05,
              0.49 + A * 0.72 + Mt / 2,
              b(Y),
              0.95,
              Mt / 0.5,
              0.9,
            ),
              o.setColorAt(d, ee.set(wn)),
              d++);
          }
    }
  ((n.count = a),
    (s.count = l),
    (o.count = d),
    (o.instanceColor.needsUpdate = !0));
})(),
  (function () {
    const t = He.length,
      n = E(new r.BoxGeometry(1.02, 0.16, 0.9), w.steel, t),
      s = E(new r.BoxGeometry(1.02, 0.06, 0.7), w.belt, t),
      o = E(new r.BoxGeometry(0.08, 1, 0.08), w.graphite, t * 2),
      a = E(new r.BoxGeometry(1.02, 0.05, 0.05), w.graphite, t * 2);
    let l = 0,
      d = 0;
    He.forEach(($, se) => {
      const A = $.elev ? 1.2 : 0.5,
        Y = x($.x),
        X = b($.z);
      (y(n, se, Y, A - 0.1, X),
        y(s, se, Y, A, X),
        y(o, l++, Y - 0.35, A / 2 - 0.1, X - 0.4, 1, A - 0.15, 1),
        y(o, l++, Y + 0.35, A / 2 - 0.1, X + 0.4, 1, A - 0.15, 1),
        y(a, d++, Y, A + 0.12, X - 0.42),
        y(a, d++, Y, A + 0.12, X + 0.42));
    });
    const h = new r.Mesh(new r.BoxGeometry(3, 1.7, 3), w.graphite);
    (h.position.set(x(23), 0.85, b(19)),
      (h.castShadow = !0),
      (h.receiveShadow = !0),
      k.add(h));
    const u = new r.Mesh(new r.BoxGeometry(2.6, 0.12, 2.6), w.warm);
    (u.position.set(x(23), 1.76, b(19)), k.add(u));
    const p = new r.Mesh(new r.BoxGeometry(0.4, 0.9, 0.4), w.cyan);
    (p.position.set(x(23), 2.25, b(19)), k.add(p));
    const v = new r.Mesh(new r.BoxGeometry(2, 1.1, 3), w.steel);
    (v.position.set(x(42.5), 0.55, b(27)), (v.castShadow = !0), k.add(v));
    const m = new r.Mesh(new r.BoxGeometry(2, 0.1, 3), w.warm);
    (m.position.set(x(42.5), 1.12, b(27)), k.add(m));
    const I = new r.Mesh(new r.BoxGeometry(1.4, 1.1, 1.6), w.steel);
    (I.position.set(x(3.2), 0.55, b(19)), (I.castShadow = !0), k.add(I));
  })(),
  (function () {
    const t = R.length,
      n = E(new r.BoxGeometry(2, 0.9, 2), w.white, t),
      s = E(new r.BoxGeometry(0.08, 2.5, 0.08), w.graphite, t * 4),
      o = E(new r.BoxGeometry(2.3, 0.06, 2.3), w.light, t),
      a = E(new r.BoxGeometry(0.9, 0.5, 0.06), w.graphite, t),
      l = E(new r.BoxGeometry(0.6, 0.5, 0.9), w.steel, t);
    let d = 0;
    R.forEach((h, u) => {
      const p = x(h.x) + 0.5,
        v = b(24) + 0.5;
      (y(n, u, p, 0.45, v), y(o, u, p, 2.5, v));
      for (const m of [-1.05, 1.05])
        for (const I of [-1.05, 1.05]) y(s, d++, p + m, 1.25, v + I);
      (y(a, u, p, 1.6, v - 0.6), y(l, u, p, 0.55, v + 1.3));
    });
  })());
var nn = [];
(function () {
  const t = new r.CylinderGeometry(0.42, 0.42, 0.06, 20),
    n = new r.TorusGeometry(0.4, 0.035, 8, 28);
  for (const s of C) {
    const o = new r.Mesh(t, w.graphite);
    (o.position.set(x(s.x), 0.03, b(s.z)), (o.receiveShadow = !0), k.add(o));
    const a = new r.Mesh(n, w.green);
    ((a.rotation.x = Math.PI / 2),
      a.position.set(x(s.x), 0.07, b(s.z)),
      k.add(a),
      nn.push(a));
    const l = new r.Mesh(new r.BoxGeometry(0.16, 0.9, 0.16), w.steel);
    (l.position.set(x(s.x) - (s.x < 2 ? 0.7 : -0.7), 0.45, b(s.z)),
      (l.castShadow = !0),
      k.add(l));
  }
})();
var bt = new r.Group();
(k.add(bt),
  (function () {
    const t = new r.CylinderGeometry(0.07, 0.07, 0.6, 8),
      n = E(t, w.warm, 64, !1);
    (bt.add(n), k.remove(n));
    let s = 0;
    for (const o of Re)
      (y(n, s++, x(o - 1) - 0.4, 0.3, b(22) - 0.4),
        y(n, s++, x(o + 2) + 0.4, 0.3, b(22) - 0.4));
    for (let o = 21; o <= 29; o += 2) y(n, s++, x(5) - 0.5, 0.3, b(o));
    for (let o = 1; o < T; o += 4) y(n, s++, x(o), 0.3, b(29) + 0.45);
    n.count = s;
  })());
var wt = E(new r.CylinderGeometry(0.34, 0.36, 0.13, 16), w.graphite, J),
  $e = E(new r.CylinderGeometry(0.3, 0.32, 0.2, 16), w.body, J),
  xt = E(new r.CylinderGeometry(0.2, 0.2, 0.07, 14), w.graphite, J),
  yt = E(new r.BoxGeometry(0.16, 0.05, 0.06), w.cyan, J, !1),
  Te = E(new r.BoxGeometry(0.5, 0.42, 0.5), w.inst, J),
  ie = E(
    new r.RingGeometry(0.42, 0.5, 24),
    new r.MeshBasicMaterial({
      color: 16777215,
      transparent: !0,
      opacity: 0.85,
      side: r.DoubleSide,
      depthWrite: !1,
    }),
    J,
    !1,
  ),
  St = E(new r.BoxGeometry(0.86, 0.42, 0.86), w.redBar, 64),
  Tt = E(new r.BoxGeometry(0.9, 0.06, 0.9), w.white, 64, !1),
  fe = E(new r.BoxGeometry(0.5, 0.4, 0.5), w.inst, 160),
  We = E(new r.CylinderGeometry(0.13, 0.13, 0.05, 10), w.cyan, 160, !1),
  _n = [13148266, 11570522, 15895592, 15026253];
for (let e = 0; e < J; e++)
  ($e.setColorAt(e, ee.set(15906565)),
    Te.setColorAt(e, ee.set(13148266)),
    ie.setColorAt(e, ee.set(1357014)));
for (let e = 0; e < 160; e++) fe.setColorAt(e, ee.set(13148266));
var ue = new r.Mesh(
  new r.TorusGeometry(0.6, 0.05, 8, 32),
  new r.MeshBasicMaterial({ color: 1357014 }),
);
((ue.rotation.x = Math.PI / 2), (ue.visible = !1), k.add(ue));
var ke = new r.Mesh(
  new r.RingGeometry(0.5, 0.58, 28),
  new r.MeshBasicMaterial({
    color: 2829876,
    transparent: !0,
    opacity: 0.6,
    side: r.DoubleSide,
    depthWrite: !1,
  }),
);
((ke.rotation.x = -Math.PI / 2), (ke.visible = !1), k.add(ke));
var he = new r.Mesh(
  new r.BoxGeometry(3, 0.08, 3),
  new r.MeshBasicMaterial({
    color: 15026253,
    transparent: !0,
    opacity: 0.35,
    depthWrite: !1,
  }),
);
((he.visible = !1), k.add(he));
var qe = 140,
  sn = new Float32Array(J * qe * 2 * 3),
  Ve = new r.BufferGeometry();
Ve.setAttribute(
  "position",
  new r.BufferAttribute(sn, 3).setUsage(r.DynamicDrawUsage),
);
var Ne = new r.LineSegments(
  Ve,
  new r.LineBasicMaterial({ color: 1357014, transparent: !0, opacity: 0.55 }),
);
((Ne.visible = !1), (Ne.frustumCulled = !1), k.add(Ne));
var on = new Float32Array(qe * 2 * 3),
  Qe = new r.BufferGeometry();
Qe.setAttribute(
  "position",
  new r.BufferAttribute(on, 3).setUsage(r.DynamicDrawUsage),
);
var ze = new r.LineSegments(Qe, new r.LineBasicMaterial({ color: 957369 }));
((ze.frustumCulled = !1), (ze.visible = !1), k.add(ze));
var _ = {};
((_[c.IDLE] = 11120310),
  (_[c.TO_PICK] = 15906565),
  (_[c.PICKING] = 15906565),
  (_[c.TO_STATION] = 15906565),
  (_[c.PROCESSING] = 15906565),
  (_[c.TO_CHARGER] = 9425832),
  (_[c.CHARGING] = 3127658),
  (_[c.TO_PARK] = 11120310),
  (_[c.FAULT] = 11740702),
  (_[c.BLOCKED] = 15026253),
  (_[c.SIDESTEP] = 15895592),
  (_[c.QUEUED] = 15895592));
function an(e) {
  if (e.state === c.FAULT) return 11740702;
  if (e.next < 0 && e.pi < e.path.length) {
    const t = e.path[e.pi];
    if (Q[t]) return 15026253;
    if (e.wait > 0.5) return e.wait > 4 ? 15026253 : 15895592;
  }
  return _[e.state] || 15906565;
}
function rn(e) {
  return e.next < 0 && e.pi < e.path.length && e.wait > 0.3;
}
function Fn(e) {
  return (
    e.state === c.TO_STATION &&
    e.next < 0 &&
    e.path.length - e.pi <= 6 &&
    e.wait > 0.3
  );
}
var ln = 0;
function cn(e, t, n, s) {
  let o = n,
    a = 0,
    l = t.x,
    d = t.z;
  const h = 0.06;
  for (let u = t.pi; u < t.path.length && a < s; u++) {
    const p = t.path[u],
      v = x(L(p)),
      m = b(P(p));
    ((e[o++] = l),
      (e[o++] = h),
      (e[o++] = d),
      (e[o++] = v),
      (e[o++] = h),
      (e[o++] = m),
      (l = v),
      (d = m),
      a++);
  }
  return o;
}
function Kn(e) {
  ln += e;
  const t = i.selected;
  for (let o = 0; o < g.length; o++) {
    const a = g[o],
      l = (a.state === c.FAULT, 0);
    (y(wt, o, a.x, 0.07 + l, a.z, 1, 1, 1, a.yaw),
      y($e, o, a.x, 0.24, a.z, 1, 1, 1, a.yaw),
      y(xt, o, a.x, 0.37, a.z, 1, 1, 1, a.yaw),
      M.position.set(
        a.x + Math.sin(a.yaw) * 0.24,
        0.3,
        a.z + Math.cos(a.yaw) * 0.24,
      ),
      M.rotation.set(0, a.yaw, 0),
      M.scale.set(1, 1, 1),
      M.updateMatrix(),
      yt.setMatrixAt(o, M.matrix),
      $e.setColorAt(o, ee.set(an(a))),
      a.carrying
        ? (y(Te, o, a.x, 0.62, a.z, 1, 1, 1, a.yaw),
          Te.setColorAt(o, ee.set(a.job && a.job.rush ? 15895592 : 13148266)))
        : y(Te, o, a.x, -3, a.z, 0.001, 0.001, 0.001));
    const d = Fn(a),
      h = rn(a);
    K.bounds || (K.queues && d)
      ? (y(ie, o, a.x, 0.05, a.z, 1, 1, 1, 0),
        ie.setMatrixAt(o, M.matrix),
        M.rotation.set(-Math.PI / 2, 0, 0),
        M.updateMatrix(),
        ie.setMatrixAt(o, M.matrix),
        ie.setColorAt(o, ee.set(d ? 15895592 : h ? 15026253 : 1357014)))
      : y(ie, o, 0, -5, 0, 0.001, 0.001, 0.001);
  }
  for (let o = g.length; o < J; o++)
    (y(wt, o, 0, -9, 0, 0.001, 0.001, 0.001),
      $e.setMatrixAt(o, M.matrix),
      xt.setMatrixAt(o, M.matrix),
      yt.setMatrixAt(o, M.matrix),
      Te.setMatrixAt(o, M.matrix),
      ie.setMatrixAt(o, M.matrix));
  for (const o of [wt, $e, xt, yt, Te, ie])
    ((o.instanceMatrix.needsUpdate = !0),
      o.instanceColor && (o.instanceColor.needsUpdate = !0));
  let n = 0;
  for (const o of ae)
    for (const a of o.cells) {
      if (n >= 64) break;
      (y(St, n, x(L(a)), 0.21, b(P(a))), y(Tt, n, x(L(a)), 0.45, b(P(a))), n++);
    }
  ((St.count = n),
    (Tt.count = n),
    (St.instanceMatrix.needsUpdate = !0),
    (Tt.instanceMatrix.needsUpdate = !0));
  for (let o = 0; o < i.parcels.length; o++) {
    const a = i.parcels[o],
      l = qt[a.belt],
      h =
        (a.belt === 0 && at.some((u) => a.t >= u[0] - 0.5 && a.t <= u[1] + 0.5)
          ? 1.2
          : 0.5) + 0.23;
    (y(fe, o, x(a.t), h, b(l.z), 0.9, 0.9, 0.9),
      fe.setColorAt(o, ee.set(_n[a.color] || 13148266)));
  }
  ((fe.count = i.parcels.length),
    (fe.instanceMatrix.needsUpdate = !0),
    fe.instanceColor && (fe.instanceColor.needsUpdate = !0));
  for (const o of C)
    nn[o.i].material = o.online ? (o.occupant >= 0 ? w.cyan : w.green) : w.red;
  if (K.paths) {
    let o = 0;
    for (const a of g) a !== t && (o = cn(sn, a, o, qe));
    (Ve.setDrawRange(0, o / 3),
      (Ve.attributes.position.needsUpdate = !0),
      (Ne.visible = o > 0));
  } else Ne.visible = !1;
  if (t) {
    const o = cn(on, t, 0, qe);
    (Qe.setDrawRange(0, o / 3),
      (Qe.attributes.position.needsUpdate = !0),
      (ze.visible = o > 0));
    let a = 0;
    for (let d = t.pi; d < t.path.length && a < 160; d++) {
      const h = t.path[d];
      y(We, a++, x(L(h)), 0.05, b(P(h)), 1, 1, 1, 0);
    }
    ((We.count = a),
      (We.instanceMatrix.needsUpdate = !0),
      (ue.visible = !0),
      ue.position.set(t.x, 0.1, t.z));
    const l = Be ? 1 : 1 + Math.sin(ln * 4) * 0.06;
    ue.scale.set(l, l, 1);
  } else ((ze.visible = !1), (We.count = 0), (ue.visible = !1));
  const s = i.hovered;
  (s && s !== t
    ? ((ke.visible = !0), ke.position.set(s.x, 0.04, s.z))
    : (ke.visible = !1),
    (De.visible = K.heat),
    (bt.visible = K.zones));
}
var dn = new r.Raycaster(),
  kt = new r.Vector2(),
  Wn = new r.Plane(new r.Vector3(0, 1, 0), 0),
  qn = new r.Vector3(),
  pe = !1;
function fn(e) {
  const t = W.getBoundingClientRect();
  return (
    (kt.x = ((e.clientX - t.left) / t.width) * 2 - 1),
    (kt.y = -((e.clientY - t.top) / t.height) * 2 + 1),
    dn.setFromCamera(kt, G),
    dn.ray.intersectPlane(Wn, qn)
  );
}
function Et(e) {
  const t = Math.floor(e.x + T / 2),
    n = Math.floor(e.z + H / 2);
  return t < 0 || n < 0 || t >= T || n >= H ? -1 : S(t, n);
}
function un(e) {
  const t = Et(e);
  if (t < 0) return null;
  const n = L(t),
    s = P(t);
  let o = null,
    a = 0.75 * 0.75;
  for (let l = -1; l <= 1; l++)
    for (let d = -1; d <= 1; d++) {
      const h = n + d,
        u = s + l;
      if (h < 0 || u < 0 || h >= T || u >= H) continue;
      const p = O[u * T + h];
      if (p < 0) continue;
      const v = g[p],
        m = (v.x - e.x) * (v.x - e.x) + (v.z - e.z) * (v.z - e.z);
      m < a && ((a = m), (o = v));
    }
  return o;
}
function ge(e) {
  if (i.selected === e) {
    D.renderInspector(!0);
    return;
  }
  ((i.selected = e),
    D.renderInspector(!0),
    D.syncList(),
    e && window.innerWidth <= 1180 && D.openDrawer("right", !0));
}
var ve = null;
(W.addEventListener("pointerdown", (e) => {
  ve = { x: e.clientX, y: e.clientY, t: performance.now(), b: e.button };
}),
  W.addEventListener("pointerup", (e) => {
    if (!ve) return;
    const t = e.clientX - ve.x,
      n = e.clientY - ve.y,
      s = t * t + n * n > 36 || performance.now() - ve.t > 500,
      o = ve.b;
    if (((ve = null), s || o !== 0)) return;
    const a = fn(e);
    if (!a) return;
    if (pe) {
      const d = Et(a);
      d >= 0 && Wt(d, !1)
        ? Je(!1)
        : ne("Barricades need open floor. Try an aisle or corridor.");
      return;
    }
    const l = un(a);
    l ? ge(l) : i.selected && ge(null);
  }));
var hn = 0;
(W.addEventListener("pointermove", (e) => {
  const t = performance.now();
  if (t - hn < 40) return;
  hn = t;
  const n = fn(e);
  if (!n) {
    ((i.hovered = null), (he.visible = !1));
    return;
  }
  if (pe) {
    const s = Et(n);
    (s >= 0 && ((he.visible = !0), he.position.set(x(L(s)), 0.05, b(P(s)))),
      (i.hovered = null));
    return;
  }
  ((i.hovered = un(n)), W.classList.toggle("hov", !!i.hovered));
}),
  W.addEventListener("pointerleave", () => {
    ((i.hovered = null), (he.visible = !1), W.classList.remove("hov"));
  }));
function Je(e) {
  ((pe = e),
    W.classList.toggle("arm", e),
    document.getElementById("tBlock").classList.toggle("armed", e),
    document.getElementById("hint").classList.toggle("on", e),
    e || (he.visible = !1));
}
var Vn = document.getElementById("labels"),
  Ye = [],
  Xe = 0;
function Ee(e, t, n, s, o, a) {
  let l = Ye[Xe];
  (l ||
    ((l = document.createElement("div")),
    (l.className = "lbl"),
    (l._cls = ""),
    (l._txt = ""),
    Vn.appendChild(l),
    Ye.push(l)),
    Xe++,
    l._cls !== e && ((l.className = "lbl " + e), (l._cls = e)),
    l._txt !== t && ((l.textContent = t), (l._txt = t)),
    gt.set(n, s, o).project(G));
  const d = W.clientWidth,
    h = W.clientHeight,
    u = (gt.x * 0.5 + 0.5) * d,
    p = (-gt.y * 0.5 + 0.5) * h;
  l.style.transform = `translate3d(${Math.round(u)}px,${Math.round(p + a)}px,0) translate(-50%,-100%)`;
}
function Qn() {
  Xe = 0;
  const e = i.selected;
  if (K.ids) for (const t of g) t !== e && Ee("id", t.name, t.x, 0.5, t.z, -4);
  if (K.queues)
    for (const t of R)
      (t.queue > 0 || t.busy >= 0) &&
        Ee(
          "q",
          `${t.name} \xB7 QUEUE ${t.queue}${t.busy >= 0 ? " \xB7 BUSY" : ""}`,
          x(t.x) + 0.5,
          2.7,
          b(24) + 0.5,
          0,
        );
  for (const t of C)
    t.online || Ee("ch", `${t.name} OFFLINE`, x(t.x), 0.9, b(t.z), 0);
  for (const t of g)
    t.state === c.FAULT && Ee("ch", `${t.name} FAULT`, t.x, 0.8, t.z, 0);
  if (
    (e &&
      Ee(
        "sel",
        `${e.name} \xB7 ${e.state}${e.rerouted ? " \xB7 REROUTED" : ""}`,
        e.x,
        0.9,
        e.z,
        -14,
      ),
    i.congestionLevel > 6 && i.congestionCell >= 0)
  ) {
    const t = i.congestionCell;
    Ee("alert", `\u26A0 CONGESTION // ${we(t)}`, x(L(t)), 0.6, b(P(t)), -36);
  }
  for (let t = Xe; t < Ye.length; t++) {
    const n = Ye[t];
    n._cls !== "" &&
      ((n.style.transform = "translate3d(-1000px,-1000px,0)"),
      (n._cls = ""),
      (n.className = "lbl"));
  }
}
var f = (e) => document.getElementById(e),
  Ct = (e) => (Math.round(e * 10) / 10).toFixed(1);
function ne(e) {
  const t = f("toast");
  ((t.textContent = e),
    t.classList.add("on"),
    clearTimeout(ne._t),
    (ne._t = setTimeout(() => t.classList.remove("on"), 2600)));
}
var D = {
  cards: [],
  lastListN: -1,
  reset() {
    (f("timeline")
      .querySelectorAll(".ev")
      .forEach((e) => e.remove()),
      (f("rate").value = i.rate),
      (f("rateV").textContent = i.rate),
      f("autoRe").setAttribute("aria-checked", String(i.autoReroute)),
      (this.lastListN = -1),
      this.syncList(),
      this.renderInspector(!0),
      this.updateKpis(),
      this.updateChrome());
  },
  pushEvent(e) {
    const t = f("timeline"),
      n = document.createElement("div");
    for (
      n.className = "ev " + e.kind,
        n.innerHTML = `<time>${e.t}</time>`,
        n.appendChild(document.createTextNode(e.text)),
        t.appendChild(n);
      t.querySelectorAll(".ev").length > 40;
    )
      t.querySelector(".ev").remove();
    t.scrollLeft = t.scrollWidth;
  },
  flash(e) {
    const t = f(e);
    (t.classList.add("flash"),
      setTimeout(() => t.classList.remove("flash"), 500));
  },
  syncList() {
    const e = f("robotList");
    if (this.lastListN !== g.length) {
      ((e.textContent = ""), (this.cards = []));
      for (const t of g) {
        const n = document.createElement("button");
        ((n.className = "rc"),
          n.setAttribute("role", "option"),
          (n.innerHTML =
            '<div class="puck"></div><div><div class="rn"><span class="nm"></span><span class="st"></span></div><div class="bat"><span class="pct v"></span><div class="bar"><i></i></div></div></div>'),
          n.addEventListener("click", () => {
            ge(g[this.cards.indexOf(n)]);
          }),
          e.appendChild(n),
          this.cards.push(n));
      }
      this.lastListN = g.length;
    }
    (g.forEach((t, n) => {
      const s = this.cards[n];
      if (!s) return;
      const o = t === i.selected;
      (s.classList.contains("sel") !== o && s.classList.toggle("sel", o),
        o
          ? s.setAttribute("aria-selected", "true")
          : s.removeAttribute("aria-selected"));
      const a = s.querySelector(".nm");
      a.textContent !== t.name && (a.textContent = t.name);
      const l = s.querySelector(".st"),
        d = t.state;
      l.textContent !== d && (l.textContent = d);
      const h = Math.round(t.battery),
        u = s.querySelector(".pct"),
        p = h + "%";
      u.textContent !== p && (u.textContent = p);
      const v = s.querySelector(".bar i");
      v.style.width = h + "%";
      const m = h < 25 ? "low" : h < 50 ? "mid" : "";
      v.className !== m && (v.className = m);
      const I = "#" + an(t).toString(16).padStart(6, "0");
      s.style.getPropertyValue("--st") !== I && s.style.setProperty("--st", I);
    }),
      (f("fleetN").textContent = g.length),
      (f("fMinus").disabled = g.length <= Bt),
      (f("fPlus").disabled = g.length >= J));
  },
  inspSig: "",
  renderInspector(e) {
    const t = i.selected,
      n = f("inspector");
    if (!t) {
      f("inspTitle").textContent = "FLEET INSPECTOR";
      const m = {};
      for (const $ of g) m[$.state] = (m[$.state] || 0) + 1;
      const I = "none" + JSON.stringify(m) + i.metrics.pending + ae.length;
      if (!e && I === this.inspSig) return;
      ((this.inspSig = I),
        (n.innerHTML = `<div class="empty"><b>No robot selected.</b><br>Click a robot on the floor or pick one from the list to see its job, battery, queue time and live route.</div>
        <div class="k">Fleet status</div><div class="status-grid">${Object.keys(
          m,
        )
          .sort()
          .map(($) => `<div><span>${$}</span><b>${m[$]}</b></div>`)
          .join("")}</div>
        <div class="mini"><div><div class="k">Pending orders</div><div class="val v">${i.metrics.pending}</div></div><div><div class="k">Barricades</div><div class="val v">${ae.length}</div></div><div><div class="k">Chargers online</div><div class="val v">${C.filter(($) => $.online).length} / ${C.length}</div></div><div><div class="k">Congestion peak</div><div class="val v">${Ct(i.congestionLevel)}</div></div></div>`));
      return;
    }
    f("inspTitle").textContent = "SELECTED ROBOT";
    const s = t.job,
      o = t.path.length - t.pi + (t.next >= 0 ? 1 - t.prog : 0),
      a = [];
    if (s) {
      const m = R[s.station];
      (a.push({
        t: `Pick \xB7 ${s.aisle}`,
        s: s.picked
          ? "done"
          : t.state === c.TO_PICK || t.state === c.PICKING
            ? "cur"
            : "",
      }),
        a.push({
          t: `Deliver \xB7 Station ${m.name}`,
          s:
            (s.picked && t.state !== c.PROCESSING) || t.state === c.PROCESSING
              ? "cur"
              : "",
        }),
        a.push({
          t:
            t.battery < 30 ? "Charge \xB7 Charging bay" : "Return \xB7 Parking",
          s: "",
        }));
    } else if (t.state === c.TO_CHARGER || t.state === c.CHARGING) {
      const m = C[t.charger];
      (a.push({ t: `Charge \xB7 ${m ? m.name : "pad"}`, s: "cur" }),
        a.push({ t: "Return \xB7 Parking", s: "" }));
    } else
      t.state === c.TO_PARK
        ? a.push({ t: "Return \xB7 Parking", s: "cur" })
        : a.push({ t: "Awaiting assignment", s: "" });
    const l = t.pi < t.path.length ? t.path[t.pi] : -1,
      d = l >= 0 && Q[l];
    d && a.splice(1, 0, { t: `Blocked \xB7 ${we(l)}`, s: "bad" });
    const h = t.battery / (0.14 * 60),
      u = t.battery < 25 ? "low" : t.battery < 50 ? "mid" : "",
      p = [
        t.name,
        t.state,
        Math.round(t.battery),
        s ? s.id : "",
        Math.round(t.queueTime),
        Math.round(t.dist),
        Math.round(o),
        a.map((m) => m.t + m.s).join(),
        t.rerouted,
        t.carrying,
      ].join("|");
    if (!e && p === this.inspSig) return;
    this.inspSig = p;
    const v =
      t.state === c.FAULT || d
        ? "bad"
        : t.state === c.IDLE
          ? "idle"
          : t.state === c.CHARGING
            ? ""
            : rn(t)
              ? "warn"
              : "";
    ((n.innerHTML = `<div class="hero"><div class="big"></div><div><h2>${t.name}</h2><div class="st"><span class="dot ${v}"></span>${t.state}${t.rerouted ? " \xB7 REROUTED" : ""}</div></div></div>
      <div class="fld"><div class="k">Battery</div><div class="row"><span class="val v">${Math.round(t.battery)}%</span><span class="sub">Est. ${Math.floor(h / 60)}h ${String(Math.round(h % 60)).padStart(2, "0")}m</span></div><div class="bar"><i class="${u}" style="width:${Math.round(t.battery)}%"></i></div></div>
      <div class="fld"><div class="k">Payload</div><div class="row"><span class="val v">${t.carrying ? (s && s.rush ? "RUSH POD" : "POD 18 kg") : "\u2014"}</span><span class="sub">/ 50 kg</span></div><div class="bar"><i class="cyan" style="width:${t.carrying ? 36 : 0}%"></i></div></div>
      <div class="fld"><div class="k">Current task</div><div class="task"><span class="chip">${s ? (s.picked ? "\u{1F4E6}" : "\u{1F50D}") : t.state === c.CHARGING || t.state === c.TO_CHARGER ? "\u26A1" : "\xB7"}</span>${s ? (s.picked ? "DELIVER" : "PICK") : t.state}</div><div class="task-sub">${s ? (s.picked ? `Drop at Station ${R[s.station].name}` : `Pick at ${s.aisle}`) : t.state === c.CHARGING ? "Charging to 96%" : t.parked ? "Parked, awaiting orders" : "\u2014"}</div></div>
      <div class="fld"><div class="row"><span class="k">Route</span><span class="legend2"><span style="--c:#14b4d6">live</span><span style="--c:#e5484d">blocked</span></span></div><ul class="route">${a.map((m) => `<li class="${m.s}">${m.t}${m.s === "done" ? '<span class="tail">done</span>' : m.s === "cur" ? '<span class="tail">now</span>' : ""}</li>`).join("")}</ul></div>
      <div class="mini"><div><div class="k">Queue time</div><div class="val v">${Ct(t.queueTime)} s</div></div><div><div class="k">Distance</div><div class="val v">${o.toFixed(0)} m<small style="color:var(--muted)"> left</small></div></div><div><div class="k">Travelled</div><div class="val v">${t.dist} m</div></div><div><div class="k">Waypoints</div><div class="val v">${Math.max(0, t.path.length - t.pi)}</div></div></div>
      <div class="kv"><span class="k">Task ID</span><b>${s ? s.id : "\u2014"}</b><span class="k">Priority</span><b style="color:${s && s.rush ? "var(--warm2)" : "inherit"}">${s ? (s.rush ? "RUSH" : "NORMAL") : "\u2014"}</b><span class="k">Assigned</span><b>${s ? Jn(s.assigned) : "\u2014"}</b><span class="k">SLA</span><b>${s ? `${Math.max(0, Math.round(s.sla - (i.time - s.created)))} s left` : "\u2014"}</b></div>
      <button class="pb dark wide" id="inspFocus"><i>\u25CE</i>Focus camera</button>`),
      f("inspFocus").addEventListener("click", pn));
  },
  sparks: {},
  updateKpis() {
    const e = i.metrics;
    ((f("kThr").textContent = e.thr),
      (f("kWait").textContent = Ct(e.wait)),
      (f("kJobs").textContent = e.jobs),
      (f("kJobsSub").textContent = `/ ${g.length} bots`),
      (f("kDel").textContent = e.delayed),
      f("kDelWrap").classList.toggle("bad", e.delayed > 0),
      (f("pendingV").textContent = `${e.pending} pending`),
      Ze("sThr", i.spark.thr, "#14b4d6"),
      Ze("sWait", i.spark.wait, "#f28c28"),
      Ze("sJobs", i.spark.jobs, "#2fb96a"),
      Ze("sDel", i.spark.del, "#e5484d"));
  },
  updateChrome() {
    f("clock").textContent = Ht();
    const e = i.sysStatus;
    ((f("sysTxt").textContent = e),
      (f("sysDot").className =
        "dot" + (e === "OK" ? "" : e === "DEGRADED" ? " warn" : " bad")));
    const t = g.filter(
      (s) => s.job || s.state === c.TO_CHARGER || s.state === c.CHARGING,
    ).length;
    ((f("fleetActive").textContent = `${t} active`),
      (f("robotsMeta").innerHTML =
        `<span class="dot"></span>${t} active \xB7 ${g.length} total`));
    const n = Kt();
    ((f("incCount").textContent = `${n} incident${n === 1 ? "" : "s"}`),
      (f("incCount").style.color = n ? "var(--red)" : ""));
  },
  openDrawer(e, t) {
    const n = f(e),
      s = t === void 0 ? !n.classList.contains("open") : t;
    (f("left").classList.remove("open"),
      f("right").classList.remove("open"),
      n.classList.toggle("open", s),
      f("scrim").classList.toggle("on", s),
      f("btnLeft").setAttribute("aria-pressed", String(e === "left" && s)),
      f("btnRight").setAttribute("aria-pressed", String(e === "right" && s)));
  },
};
function Jn(e) {
  const t = Math.floor(e) + 36e3 + 1440;
  return `${String(Math.floor(t / 3600) % 24).padStart(2, "0")}:${String(Math.floor(t / 60) % 60).padStart(2, "0")}`;
}
function Ze(e, t, n) {
  const s = f(e),
    o = s.getContext("2d"),
    a = s.width,
    l = s.height;
  if ((o.clearRect(0, 0, a, l), t.length < 2)) return;
  let d = 0;
  for (const u of t) u > d && (d = u);
  ((d = d || 1), o.beginPath());
  const h = Math.max(2, Math.min(90, t.length));
  for (let u = 0; u < t.length; u++) {
    const p = (u / (h - 1)) * (a - 2) + 1,
      v = l - 3 - (t[u] / d) * (l - 6);
    u === 0 ? o.moveTo(p, v) : o.lineTo(p, v);
  }
  ((o.strokeStyle = n),
    (o.lineWidth = 2.5),
    (o.lineJoin = "round"),
    o.stroke(),
    o.lineTo(((t.length - 1) / (h - 1)) * (a - 2) + 1, l),
    o.lineTo(1, l),
    o.closePath(),
    (o.fillStyle = n + "22"),
    o.fill());
}
function pn() {
  const e = i.selected;
  e &&
    (Zt.set(e.x, 0, e.z).sub(U.target),
    G.position.add(Zt),
    U.target.set(e.x, 0, e.z),
    U.update());
}
function et(e) {
  i.playing = e;
  const t = f("bPlay");
  (t.classList.toggle("paused", e),
    (t.innerHTML = e
      ? "<i>\u275A\u275A</i><span>Pause</span>"
      : "<i>\u25B6</i><span>Start</span>"),
    t.setAttribute("aria-pressed", String(e)));
}
(f("bPlay").addEventListener("click", () => et(!i.playing)),
  f("bStep").addEventListener("click", () => {
    et(!1);
    for (let e = 0; e < 6; e++) Qt();
    (Ft(), Vt(), Rt(!0));
  }),
  f("speedSeg")
    .querySelectorAll("button")
    .forEach((e) =>
      e.addEventListener("click", () => {
        ((i.speed = +e.dataset.s),
          f("speedSeg")
            .querySelectorAll("button")
            .forEach((t) => t.setAttribute("aria-pressed", String(t === e))));
      }),
    ),
  f("rate").addEventListener("input", (e) => {
    ((i.rate = +e.target.value), (f("rateV").textContent = i.rate));
  }),
  f("autoRe").addEventListener("click", () => {
    ((i.autoReroute = !i.autoReroute),
      f("autoRe").setAttribute("aria-checked", String(i.autoReroute)),
      B("info", `Auto reroute ${i.autoReroute ? "ON" : "OFF"}`),
      i.autoReroute && Ge());
  }),
  f("bReroute").addEventListener("click", Ge),
  f("tReroute").addEventListener("click", Ge),
  f("bReset").addEventListener("click", () => {
    (ht(), ne("Scenario reset"));
  }),
  f("scenario").addEventListener("change", (e) => {
    ((i.scenario = e.target.value), ht());
  }),
  f("tBlock").addEventListener("click", () => {
    (Je(!pe), pe && window.innerWidth <= 1180 && D.openDrawer("left", !1));
  }),
  f("tRush").addEventListener("click", $n),
  f("tCharger").addEventListener("click", Nn),
  f("tFault").addEventListener("click", zn),
  f("tClear").addEventListener("click", Bn),
  f("tFocus").addEventListener("click", () => {
    if (!i.selected) {
      ne("Select a robot first.");
      return;
    }
    pn();
  }),
  f("fPlus").addEventListener("click", () => {
    jt() &&
      (D.syncList(),
      B(
        "info",
        `${g[g.length - 1].name} joined the fleet \xB7 ${g.length} robots`,
      ));
  }),
  f("fMinus").addEventListener("click", () => {
    const e = g.length;
    Ln() &&
      (D.syncList(),
      D.renderInspector(!0),
      B("info", `Robot retired \xB7 ${g.length} robots`));
  }),
  document.querySelectorAll(".tg").forEach((e) =>
    e.addEventListener("click", () => {
      const t = e.dataset.layer;
      ((K[t] = !K[t]),
        e.setAttribute("aria-pressed", String(K[t])),
        t === "heat" && K.heat && en());
    }),
  ),
  f("btnDeselect").addEventListener("click", () => {
    (ge(null), window.innerWidth <= 1180 && D.openDrawer("right", !1));
  }),
  f("btnLeft").addEventListener("click", () => D.openDrawer("left")),
  f("btnRight").addEventListener("click", () => D.openDrawer("right")),
  f("scrim").addEventListener("click", () => {
    (f("left").classList.remove("open"),
      f("right").classList.remove("open"),
      f("scrim").classList.remove("on"),
      f("btnLeft").setAttribute("aria-pressed", "false"),
      f("btnRight").setAttribute("aria-pressed", "false"));
  }),
  f("btnHelp").addEventListener("click", () => {
    const e = f("help").classList.toggle("on");
    f("btnHelp").setAttribute("aria-pressed", String(e));
  }),
  document.addEventListener("click", (e) => {
    !f("help").contains(e.target) &&
      e.target !== f("btnHelp") &&
      f("help").classList.contains("on") &&
      (f("help").classList.remove("on"),
      f("btnHelp").setAttribute("aria-pressed", "false"));
  }));
function gn(e) {
  ((G.zoom = r.MathUtils.clamp(G.zoom * e, U.minZoom, U.maxZoom)),
    G.updateProjectionMatrix());
}
(f("camIn").addEventListener("click", () => gn(1.25)),
  f("camOut").addEventListener("click", () => gn(0.8)),
  f("camHome").addEventListener("click", () => {
    (G.position.copy(Yt),
      U.target.set(0, 0, 0),
      (G.zoom = 1),
      G.updateProjectionMatrix(),
      U.update());
  }),
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    const t = e.key;
    t === " "
      ? (e.preventDefault(), et(!i.playing))
      : t === "."
        ? f("bStep").click()
        : t === "r" || t === "R"
          ? Ge()
          : t === "b" || t === "B"
            ? Je(!pe)
            : t === "Escape"
              ? pe
                ? Je(!1)
                : ge(null)
              : t === "+" || t === "="
                ? f("fPlus").click()
                : t === "-" && f("fMinus").click();
  }));
function vn() {
  const e = pt.clientWidth || 1,
    t = pt.clientHeight || 1;
  de.setSize(e, t, !1);
  const n = e / t;
  let s = 17.5,
    o = s * n;
  (o < 27 && ((o = 27), (s = o / n)),
    (G.left = -o),
    (G.right = o),
    (G.top = s),
    (G.bottom = -s),
    G.updateProjectionMatrix());
}
(new ResizeObserver(vn).observe(pt), vn());
var tt = 0,
  At = performance.now(),
  Ce = 0,
  Lt = 0,
  Pt = 0,
  es = document.hidden;
function Rt(e) {
  (D.syncList(), D.renderInspector(e), D.updateKpis(), D.updateChrome());
}
function mn(e) {
  Ce = requestAnimationFrame(mn);
  let t = (e - At) / 1e3;
  if (((At = e), t > 0.25 && (t = 0.25), i.playing)) {
    tt += t * i.speed;
    let n = 0;
    for (; tt >= dt && n < 14;) (Qt(), (tt -= dt), n++);
    n >= 14 && (tt = 0);
  }
  ((Lt += t),
    Lt >= 0.25 && ((Lt = 0), Rt(!1)),
    (Pt += t),
    K.heat && Pt >= 0.2 && ((Pt = 0), en()),
    U.update(),
    Kn(t),
    Qn(),
    de.render(k, G));
}
function bn() {
  Ce || ((At = performance.now()), (Ce = requestAnimationFrame(mn)));
}
function Yn() {
  Ce && (cancelAnimationFrame(Ce), (Ce = 0));
}
(document.addEventListener("visibilitychange", () => {
  document.hidden ? Yn() : bn();
}),
  ht(),
  et(!Be),
  Rt(!0),
  bn(),
  Be &&
    ne(
      "Reduced motion detected \xB7 simulation starts paused. Press Start when ready.",
    ));
