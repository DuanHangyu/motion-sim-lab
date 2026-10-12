import * as v from "three";
const D = (e, t = document) => t.querySelector(e),
  X = (e, t, s) => (e < t ? t : e > s ? s : e),
  Xt = (e, t, s) => e + (t - e) * s,
  de = (e) => Math.round(e).toLocaleString("en-US"),
  he = (e) =>
    String(e ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    ),
  Pe = (e) => String(e).padStart(2, "0"),
  ne = Math.PI / 180,
  Xn = /[?&]embed\b/.test(location.search),
  Qe = matchMedia("(max-width:899px)").matches,
  en = !!navigator.connection?.saveData,
  St = {
    JP: "Japan",
    US: "United States",
    MX: "Mexico",
    IN: "India",
    BR: "Brazil",
    CN: "China",
    BD: "Bangladesh",
    AR: "Argentina",
    PK: "Pakistan",
    EG: "Egypt",
    PH: "Philippines",
    RU: "Russia",
    TR: "T\xFCrkiye",
    FR: "France",
    KR: "South Korea",
    NG: "Nigeria",
    ID: "Indonesia",
    GB: "United Kingdom",
    PE: "Peru",
    IR: "Iran",
    CD: "DR Congo",
    CO: "Colombia",
    HK: "Hong Kong",
    TW: "Taiwan",
    TH: "Thailand",
    CL: "Chile",
    ES: "Spain",
    VN: "Vietnam",
    CA: "Canada",
    SG: "Singapore",
  },
  Ct = [];
{
  const e = document.getElementById("places").textContent.trim();
  if (e && e[0] !== "@")
    for (const t of e.split("|")) {
      const s = parseInt(t.slice(0, 3), 36) / 100 - 90,
        a = parseInt(t.slice(3, 6), 36) / 100 - 180;
      Ct.push({
        la: s,
        lo: a,
        cc: t.slice(6, 8),
        name: t.slice(8),
        x: Math.cos(s * ne) * Math.cos(a * ne),
        y: Math.cos(s * ne) * Math.sin(a * ne),
        z: Math.sin(s * ne),
      });
    }
}
Object.assign(St, {
  AO: "Angola",
  IQ: "Iraq",
  SD: "Sudan",
  AU: "Australia",
  SA: "Saudi Arabia",
  MM: "Myanmar",
  CI: "C\xF4te d'Ivoire",
  ZA: "South Africa",
  DE: "Germany",
  DZ: "Algeria",
  IT: "Italy",
  KP: "North Korea",
  AF: "Afghanistan",
  GR: "Greece",
  MA: "Morocco",
  IL: "Israel",
  ET: "Ethiopia",
  KE: "Kenya",
  VE: "Venezuela",
  TZ: "Tanzania",
  PT: "Portugal",
  PL: "Poland",
  SY: "Syria",
  UA: "Ukraine",
  SN: "Senegal",
  EC: "Ecuador",
  MY: "Malaysia",
  PR: "Puerto Rico",
  TN: "Tunisia",
  AT: "Austria",
  LY: "Libya",
  UZ: "Uzbekistan",
  CU: "Cuba",
  DO: "Dominican Republic",
  AZ: "Azerbaijan",
  GH: "Ghana",
  BO: "Bolivia",
  KW: "Kuwait",
  YE: "Yemen",
  HT: "Haiti",
  RO: "Romania",
  CM: "Cameroon",
  PY: "Paraguay",
  LB: "Lebanon",
  BY: "Belarus",
  BE: "Belgium",
  MG: "Madagascar",
  HU: "Hungary",
  ZW: "Zimbabwe",
  UY: "Uruguay",
  ML: "Mali",
  GN: "Guinea",
  KH: "Cambodia",
  TG: "Togo",
  QA: "Qatar",
  MZ: "Mozambique",
  SV: "El Salvador",
  UG: "Uganda",
  NL: "Netherlands",
  AE: "UAE",
  NZ: "New Zealand",
  CG: "Congo",
  ZM: "Zambia",
  CR: "Costa Rica",
  PA: "Panama",
  SE: "Sweden",
  CH: "Switzerland",
  KZ: "Kazakhstan",
  BG: "Bulgaria",
  CZ: "Czechia",
  BF: "Burkina Faso",
  FI: "Finland",
  AM: "Armenia",
  SO: "Somalia",
  GE: "Georgia",
  RS: "Serbia",
  TJ: "Tajikistan",
  DK: "Denmark",
  JO: "Jordan",
  IE: "Ireland",
  LR: "Liberia",
  GT: "Guatemala",
  TD: "Chad",
  HN: "Honduras",
  JM: "Jamaica",
  DJ: "Djibouti",
  NI: "Nicaragua",
  NE: "Niger",
  AL: "Albania",
  NP: "Nepal",
  MN: "Mongolia",
  RW: "Rwanda",
  KG: "Kyrgyzstan",
  NO: "Norway",
  CF: "Central African Rep.",
  SL: "Sierra Leone",
  BJ: "Benin",
  LA: "Laos",
  LV: "Latvia",
  MR: "Mauritania",
  OM: "Oman",
  TM: "Turkmenistan",
  HR: "Croatia",
  BA: "Bosnia",
  MD: "Moldova",
  MW: "Malawi",
  ER: "Eritrea",
  MU: "Mauritius",
  GA: "Gabon",
  MO: "Macau",
  BH: "Bahrain",
  LT: "Lithuania",
  PS: "Palestine",
  MK: "North Macedonia",
  XS: "Somaliland",
  XK: "Kosovo",
  SK: "Slovakia",
  GW: "Guinea-Bissau",
  EE: "Estonia",
  MT: "Malta",
  LS: "Lesotho",
  BI: "Burundi",
  SI: "Slovenia",
  BN: "Brunei",
  TT: "Trinidad and Tobago",
  PG: "Papua New Guinea",
  NA: "Namibia",
  GY: "Guyana",
  SR: "Suriname",
  MQ: "France",
  LK: "Sri Lanka",
  TL: "Timor-Leste",
  BS: "The Bahamas",
  CY: "Cyprus",
  BW: "Botswana",
  GM: "The Gambia",
  BB: "Barbados",
  RE: "France",
  GI: "Gibraltar",
  SS: "South Sudan",
  FJ: "Fiji",
  GQ: "Equatorial Guinea",
  IS: "Iceland",
  CW: "Curacao",
  ME: "Montenegro",
  GP: "France",
  PF: "French Polynesia",
  KM: "Comoros",
  GU: "Guam",
  CV: "Cape Verde",
  MV: "Maldives",
  SZ: "Eswatini",
  LU: "Luxembourg",
  BT: "Bhutan",
  ST: "S\xE3o Tom\xE9 and Pr\xEDncipe",
  SB: "Solomon Islands",
  WS: "Samoa",
  AD: "Andorra",
  VC: "St Vincent",
  VU: "Vanuatu",
  TO: "Tonga",
  LC: "Saint Lucia",
  MC: "Monaco",
  LI: "Liechtenstein",
  AG: "Antigua and Barbuda",
  GD: "Grenada",
  SC: "Seychelles",
  SM: "San Marino",
  KI: "Kiribati",
  MH: "Marshall Islands",
  DM: "Dominica",
  KN: "St Kitts and Nevis",
  BZ: "Belize",
  PW: "Palau",
  TV: "Tuvalu",
  FM: "Micronesia",
  VA: "Vatican City",
  EH: "Western Sahara",
});
function tn(e, t) {
  if (!Ct.length || !isFinite(e)) return null;
  const s = Math.cos(e * ne) * Math.cos(t * ne),
    a = Math.cos(e * ne) * Math.sin(t * ne),
    o = Math.sin(e * ne);
  let w = null,
    h = -2;
  for (const p of Ct) {
    const y = p.x * s + p.y * a + p.z * o;
    y > h && ((h = y), (w = p));
  }
  const r = Math.acos(X(h, -1, 1)) * 6371;
  return { p: w, km: r };
}
function kt(e, t, s = !0) {
  if (!isFinite(e)) return "";
  const a = tn(e, t);
  if (!a || a.km > 150)
    return `${Math.abs(e).toFixed(1)}\xB0${e >= 0 ? "N" : "S"} ${Math.abs(t).toFixed(1)}\xB0${t >= 0 ? "E" : "W"}`;
  const o = St[a.p.cc] || "";
  return (
    (a.km < 20 ? "in " : "near ") +
    a.p.name +
    (s && o && o !== a.p.name ? ", " + o : "")
  );
}
function ea(e, t) {
  const s = tn(e, t);
  return s && s.km < 250 ? s.p.cc : null;
}
const ta =
    /^(streetcomplete|every ?door|osmand|organic ?maps|comaps|go ?map|vespucci|mapcomplete|osmgo|pushpin|scee|openstop|deflock|osm ?contributor|osmtracker|mapswithme|maps\.me|cartes|osm ?focus|survey|mapy|wheelmap)/i,
  na =
    /^(id|josm|rapid|potlatch|level0|maproulette|merkaartor|osmose|jungle|osm-relation|osmtools|osmapi|osmium|mapbuilder|pic4review)/i;
function At(e) {
  if (!e) return "";
  let t = e
    .replace(/^(\S+?)[\/ ]v?\d.*$/, "$1")
    .replace(/_ee$/, "")
    .trim();
  return (
    /^iD\b/.test(e) && (t = "iD"),
    /^JOSM/.test(e) && (t = "JOSM"),
    /^StreetComplete/.test(e) && (t = "StreetComplete"),
    /^Every Door/.test(e) && (t = "Every Door"),
    /^Organic Maps/.test(e) && (t = "Organic Maps"),
    /^Go Map/.test(e) && (t = "Go Map!!"),
    /^OsmAnd/.test(e) && (t = "OsmAnd"),
    /^Rapid/i.test(e) && (t = "Rapid"),
    t.slice(0, 22)
  );
}
function aa(e) {
  if (!e) return 0;
  const t = e.tags.created_by || "";
  return ta.test(t)
    ? 1
    : na.test(t)
      ? 2
      : /survey/i.test(e.tags.source || "")
        ? 1
        : 2;
}
function nn(e, t) {
  "use strict";
  const s =
      "https://osm-planet-eu-central-1.s3.dualstack.eu-central-1.amazonaws.com/",
    a = "https://planet.openstreetmap.org/replication/",
    o = {
      min: [s + "planet/replication/minute/", a + "minute/"],
      cs: [s + "changesets/replication/minute/", a + "changesets/"],
    };
  let w = 0;
  const h = (g) => {
      const C = String(g).padStart(9, "0");
      return C.slice(0, 3) + "/" + C.slice(3, 6) + "/" + C.slice(6, 9);
    },
    r = (g) => new Promise((C) => setTimeout(C, g));
  async function p(g, C, { fresh: B = !1, gz: F = !1 } = {}) {
    let q;
    for (let S = 0; S < 4; S++)
      try {
        const A = await fetch(o[g][w] + C, {
          cache: B ? "no-store" : "default",
        });
        if (!A.ok) {
          const _ = new Error(A.status + " " + C);
          throw ((_.status = A.status), _);
        }
        return F
          ? await new Response(
              A.body.pipeThrough(new DecompressionStream("gzip")),
            ).text()
          : await A.text();
      } catch (A) {
        if (((q = A), A.status === 404 && S > 0)) throw A;
        (S === 1 && (w ^= 1), await r(500 + S * 900));
      }
    throw q;
  }
  async function y(g) {
    const C = await p("min", g == null ? "state.txt" : h(g) + ".state.txt", {
      fresh: g == null,
    });
    return {
      seq: +/sequenceNumber=(\d+)/.exec(C)[1],
      t: Date.parse(/timestamp=(\S+)/.exec(C)[1].replace(/\\/g, "")),
    };
  }
  async function c() {
    const g = await p("cs", "state.yaml", { fresh: !0 }),
      C =
        /last_run:\s*(\d{4}-\d\d-\d\d) (\d\d:\d\d:\d\d)(\.\d+)?\s*([+-]\d\d:?\d\d)?/.exec(
          g,
        );
    return {
      seq: +/sequence:\s*(\d+)/.exec(g)[1],
      t: Date.parse(
        C[1] + "T" + C[2] + (C[3] ? C[3].slice(0, 4) : "") + (C[4] || "Z"),
      ),
    };
  }
  const l = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" },
    b = (g) =>
      g.indexOf("&") < 0
        ? g
        : g.replace(
            /&(amp|lt|gt|quot|apos|#(\d+)|#x([0-9a-fA-F]+));/g,
            (C, B, F, q) =>
              F
                ? String.fromCodePoint(+F)
                : q
                  ? String.fromCodePoint(parseInt(q, 16))
                  : l[B],
          ),
    L = new Map(),
    Y = (g) => {
      let C = L.get(g);
      return (
        C === void 0 &&
          ((C = Date.parse(g)), L.size > 5e3 && L.clear(), L.set(g, C)),
        C
      );
    };
  function le(g, C) {
    const B = new Map(),
      F = /<(create|modify|delete)>|<(node|way|relation)\s([^>]*?)\/?>/g,
      q = /(\w+)="([^"]*)"/g;
    let S = 0,
      A,
      _;
    const Ee = [1 / 0, 1 / 0, 1 / 0],
      ze = [0, 0, 0];
    for (; (A = F.exec(g));) {
      if (A[1]) {
        S = A[1] === "create" ? 0 : A[1] === "modify" ? 1 : 2;
        continue;
      }
      const U = A[2] === "node" ? 0 : A[2] === "way" ? 1 : 2;
      let ae = 0,
        Ve = "",
        Oe = 0,
        be = "",
        Ae = 0,
        oe = NaN,
        Le = NaN;
      for (q.lastIndex = 0; (_ = q.exec(A[3]));) {
        const ye = _[1],
          Se = _[2];
        ye === "id"
          ? (ae = +Se)
          : ye === "timestamp"
            ? (Ve = Se)
            : ye === "changeset"
              ? (Ae = +Se)
              : ye === "uid"
                ? (Oe = +Se)
                : ye === "user"
                  ? (be = Se)
                  : ye === "lat"
                    ? (oe = +Se)
                    : ye === "lon" && (Le = +Se);
      }
      const Ke = Y(Ve),
        dt = Ae + "@" + Ke;
      ze[S]++;
      let J = B.get(dt);
      if (
        (J ||
          ((J = {
            cs: Ae,
            uid: Oe,
            user: b(be),
            t: Ke,
            a: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            sx: 0,
            sy: 0,
            sz: 0,
            np: 0,
            bb: [90, 180, -90, -180],
            pts: [],
            mx: [0, 0, 0],
          }),
          B.set(dt, J)),
        J.a[U * 3 + S]++,
        S === 0 &&
          (ae > J.mx[U] && (J.mx[U] = ae),
          C && Ke >= C && ae < Ee[U] && (Ee[U] = ae)),
        U === 0 && oe === oe)
      ) {
        const ye = (oe * Math.PI) / 180,
          Se = (Le * Math.PI) / 180,
          Ne = Math.cos(ye);
        if (
          ((J.sx += Ne * Math.cos(Se)),
          (J.sy += Ne * Math.sin(Se)),
          (J.sz += Math.sin(ye)),
          J.np++,
          oe < J.bb[0] && (J.bb[0] = oe),
          Le < J.bb[1] && (J.bb[1] = Le),
          oe > J.bb[2] && (J.bb[2] = oe),
          Le > J.bb[3] && (J.bb[3] = Le),
          J.pts.length < 80)
        )
          J.pts.push(oe, Le);
        else if (S === 0) {
          const ot = (Math.random() * J.np) | 0;
          ot < 40 && ((J.pts[ot * 2] = oe), (J.pts[ot * 2 + 1] = Le));
        }
      }
    }
    const K = [];
    for (const U of B.values()) {
      if (U.np) {
        const ae = Math.hypot(U.sx, U.sy);
        ((U.la = (Math.atan2(U.sz, ae) * 180) / Math.PI),
          (U.lo = (Math.atan2(U.sy, U.sx) * 180) / Math.PI));
      } else ((U.la = NaN), (U.lo = NaN), (U.bb = null));
      (delete U.sx, delete U.sy, delete U.sz, K.push(U));
    }
    return (K.sort((U, ae) => U.t - ae.t), { ups: K, first: Ee, tot: ze });
  }
  const re = {
    comment: "comment",
    created_by: "created_by",
    source: "source",
    imagery_used: "imagery_used",
    hashtags: "hashtags",
    changesets_count: "changesets_count",
    locale: "locale",
    "StreetComplete:quest_type": "quest",
  };
  function f(g, C) {
    const B = [],
      F = /(\w+)="([^"]*)"/g,
      q = /<tag k="([^"]*)" v="([^"]*)"\s*\/>/g,
      S = g.split("<changeset ");
    for (let A = 1; A < S.length; A++) {
      const _ = S[A],
        Ee = _.indexOf(">"),
        ze = _.slice(0, Ee),
        K = {};
      let U;
      for (F.lastIndex = 0; (U = F.exec(ze));) K[U[1]] = U[2];
      const ae = {};
      for (q.lastIndex = 0; (U = q.exec(_));) {
        const Ae = re[b(U[1])];
        Ae && (ae[Ae] = b(U[2]).slice(0, 300));
      }
      const Ve = Date.parse(K.created_at),
        Oe = K.closed_at ? Date.parse(K.closed_at) : 0,
        be = K.open === "true";
      B.push({
        id: +K.id,
        uid: +K.uid || 0,
        user: b(K.user || ""),
        ca: Ve,
        cl: Oe,
        open: be,
        n: +K.num_changes || 0,
        cc: +K.comments_count || 0,
        bb:
          K.min_lat != null
            ? [+K.min_lat, +K.min_lon, +K.max_lat, +K.max_lon]
            : null,
        tags: ae,
        at: be ? Math.max(Ve, C - 4e4) : Oe,
      });
    }
    return B;
  }
  const I = async (g, C, B) => {
    let F = 0;
    await Promise.all(
      Array.from({ length: Math.min(C, g.length) }, async () => {
        for (; F < g.length;) {
          const q = g[F++];
          try {
            await B(q);
          } catch {}
        }
      }),
    );
  };
  let E = null,
    N = null,
    G = 0,
    z = 0;
  const P = async (g, C) => {
      const B = await p("min", h(g) + ".osc.gz", { gz: !0 }),
        F = le(B, C);
      return (
        e({ type: "diff", seq: g, ups: F.ups, tot: F.tot, first: F.first }),
        F
      );
    },
    m = (g) => N.t - (N.seq - g) * 6e4,
    V = async (g) => {
      const C = await p("cs", h(g) + ".osm.gz", { gz: !0 });
      e({ type: "cs", seq: g, list: f(C, m(g)) });
    };
  async function ke(g) {
    const C = await p("cs", h(g) + ".state.txt"),
      B =
        /last_run:\s*(\d{4}-\d\d-\d\d) (\d\d:\d\d:\d\d)(\.\d+)?\s*([+-]\d\d:?\d\d)?/.exec(
          C,
        );
    return {
      seq: g,
      t: Date.parse(
        B[1] + "T" + B[2] + (B[3] ? B[3].slice(0, 4) : "") + (B[4] || "Z"),
      ),
    };
  }
  async function ce(g, C, B) {
    let F = C.seq - Math.round((C.t - B) / 6e4),
      q;
    for (let A = 0; A < 8; A++) {
      ((F = Math.min(F, C.seq)), (q = await g(F)));
      const _ = Math.round((B - q.t) / 6e4);
      if (Math.abs(_) <= 1 || (F === C.seq && _ > 0)) break;
      F += _;
    }
    let S = 0;
    for (; q.t <= B && F < C.seq && S++ < 6;) (F++, (q = await g(F)));
    for (; S++ < 12;) {
      const A = await g(F - 1);
      if (A.t > B) (F--, (q = A));
      else break;
    }
    return F;
  }
  async function Z(g) {
    const C = await ce(y, E, g),
      B = [1 / 0, 1 / 0, 1 / 0];
    for (
      let S = 0;
      S < 3 && B.some((A) => A === 1 / 0) && C + S <= E.seq;
      S++
    ) {
      const A = le(await p("min", h(C + S) + ".osc.gz", { gz: !0 }), g);
      for (let _ = 0; _ < 3; _++) A.first[_] < B[_] && (B[_] = A.first[_]);
    }
    const F = await ce(ke, N, g);
    let q = 1 / 0;
    for (let S = -1; S < 5 && F + S <= N.seq; S++) {
      try {
        const A = f(await p("cs", h(F + S) + ".osm.gz", { gz: !0 }), 0);
        for (const _ of A) _.ca >= g && _.id < q && (q = _.id);
      } catch {}
      if (q < 1 / 0 && S >= 1) break;
    }
    e({ type: "base", mid: g, first: B, cs: q });
  }
  async function ve(g) {
    for (let S = 0; ; S++)
      try {
        [E, N] = await Promise.all([y(), c()]);
        break;
      } catch (A) {
        (e({ type: "status", ok: !1, msg: String((A && A.message) || A) }),
          await r(Math.min(3e4, 3e3 * (S + 1))));
      }
    (e({ type: "meta", min: E, cs: N }), (G = E.seq), (z = N.seq));
    const C = [];
    for (let S = E.seq; S > E.seq - g.back; S--) C.push(S);
    const B = [];
    for (let S = N.seq; S > N.seq - g.csBack; S--) B.push(S);
    (await Promise.all([I(C, 2, (S) => P(S)), I(B, 4, V)]),
      e({ type: "ready" }));
    const F = { min: new Map(), cs: new Map() };
    async function q(S, A, _, Ee) {
      let ze = A;
      for (let K = A + 1; K <= _; K++) {
        try {
          (await Ee(K), F[S].delete(K));
        } catch {
          const ae = (F[S].get(K) || 0) + 1;
          if ((F[S].set(K, ae), ae < 5)) break;
          F[S].delete(K);
        }
        ze = K;
      }
      return ze;
    }
    for (;;) {
      await r(g.poll);
      try {
        const S = await y();
        S.seq > G &&
          (S.seq - G > 20 && (G = S.seq - 3),
          (G = await q("min", G, S.seq, (_) => P(_))),
          (E = S),
          e({ type: "meta", min: S }));
        const A = await c();
        (A.seq > z &&
          ((N = A),
          A.seq - z > 20 && (z = A.seq - 3),
          (z = await q("cs", z, A.seq, V)),
          e({ type: "meta", cs: A })),
          e({ type: "status", ok: !0 }));
      } catch (S) {
        e({ type: "status", ok: !1, msg: String((S && S.message) || S) });
      }
    }
  }
  t((g) => {
    if (g.type === "init") ve(g);
    else if (g.type === "baseline") {
      const C = () =>
        E && N
          ? Z(g.mid).catch((B) =>
              e({ type: "status", ok: !0, msg: "no baseline: " + B }),
            )
          : setTimeout(C, 400);
      C();
    }
  });
}
let Ye = null;
const ge = () => Ye ?? performance.now(),
  O = { on: !1, rc: 0, p: 0, rate: 1, horizon: 0, waiting: !1 },
  pe = (e = ge()) => (O.on ? O.rc + (e - O.p) * O.rate : 0),
  Lt = (e, t = ge()) => {
    ((O.rc = e), (O.p = t));
  },
  oa = (e, t = ge()) => {
    ((O.rc = pe(t)), (O.p = t), (O.rate = e));
  },
  Tt = 75e3,
  sa = Date.now() - 6 * 36e5,
  Be = (e) => (e - sa) / 1e3,
  i = {
    pend: [],
    shown: [],
    csAll: new Map(),
    csQ: [],
    csLive: new Map(),
    closed: [],
    base: null,
    max: [0, 0, 0],
    maxCs: 0,
    mid: 0,
    nextMid: 0,
    win: { t0: 0, c: 0, m: 0, d: 0 },
    users: new Map(),
    split: new Map(),
    need: new Map(),
    ready: !1,
    status: "wait",
    histStream: [],
  },
  an = (e) => {
    const t = new Date(e);
    return (t.setHours(0, 0, 0, 0), t.getTime());
  },
  on = (e) => {
    const t = new Date(e);
    return (t.setHours(24, 0, 0, 0), t.getTime());
  };
function sn(e) {
  const t = ge();
  if (e.type === "meta")
    e.min &&
      !O.on &&
      (Lt(e.min.t - Tt, t),
      (O.on = !0),
      (O.horizon = e.min.t),
      (i.mid = an(O.rc)),
      (i.nextMid = on(O.rc)),
      dn({ type: "baselineAt", mid: i.mid }));
  else if (e.type === "diff") {
    const s = pe(t);
    let a = 0;
    for (const o of e.ups)
      (o.t > a && (a = o.t), o.t <= s ? ln(o, !0) : i.pend.push(o));
    if ((i.pend.sort((o, w) => o.t - w.t), a > O.horizon)) {
      O.horizon = a;
      const o = pe(t) - (a - Tt);
      (o < -24e4 && Lt(a - Tt, t),
        oa(X(1 - o / 12e4, 0.88, 1.12), t),
        (O.waiting = !1));
    }
  } else if (e.type === "cs") {
    const s = pe(t);
    for (const a of e.list) {
      const o = i.csAll.get(a.id);
      (!o || !a.open || (o.open && a.n >= o.n)) && i.csAll.set(a.id, a);
      const w = i.need.get(a.id);
      if (w) {
        i.need.delete(a.id);
        for (const h of w) {
          const r = h.la === h.la;
          (rn(h, a),
            !r &&
              a.bb &&
              ((h.la = (a.bb[0] + a.bb[2]) / 2),
              (h.lo = (a.bb[1] + a.bb[3]) / 2),
              (h.box = !0)),
            x.recolor(h, !r && h.la === h.la));
        }
      }
      a.at <= s ? cn(a, !0) : i.csQ.push(a);
    }
    (i.csQ.sort((a, o) => a.at - o.at), (ie.trend = ie.graph = ie.parts = !0));
  } else
    e.type === "base"
      ? e.mid === i.mid &&
        ((i.base = { first: e.first, cs: e.cs }), (ie.today = !0))
      : e.type === "ready"
        ? ((i.ready = !0),
          (i.status = "ok"),
          i.closed.sort((s, a) => s.cl - a.cl),
          $t.fill(i.histStream),
          (i.histStream = null),
          x.ready && x.ready(),
          (ie.trend = ie.graph = ie.parts = ie.today = !0))
        : e.type === "status" &&
          ((i.status = e.ok ? (i.ready ? "ok" : "wait") : "down"),
          e.ok || (i.msg = e.msg));
}
function rn(e, t) {
  ((e.meth = aa(t)),
    (e.ed = t ? At(t.tags.created_by) : ""),
    (e.cm = (t && t.tags.comment) || ""));
}
function ln(e, t) {
  const s = i.csAll.get(e.cs);
  for (let p = 0; p < 3; p++) e.mx[p] > i.max[p] && (i.max[p] = e.mx[p]);
  e.cs > i.maxCs && (i.maxCs = e.cs);
  const a = e.a[0] + e.a[3] + e.a[6],
    o = e.a[1] + e.a[4] + e.a[7],
    w = e.a[2] + e.a[5] + e.a[8],
    h = i.win;
  ((h.c += a), (h.m += o), (h.d += w), (!h.t0 || e.t < h.t0) && (h.t0 = e.t));
  const r = i.split.get(e.cs);
  if (
    (r ? ((r[0] += a), (r[1] += o), (r[2] += w)) : i.split.set(e.cs, [a, o, w]),
    e.la !== e.la &&
      s &&
      s.bb &&
      ((e.la = (s.bb[0] + s.bb[2]) / 2),
      (e.lo = (s.bb[1] + s.bb[3]) / 2),
      (e.box = !0)),
    (e.n = a + o + w),
    rn(e, s),
    !s)
  ) {
    const p = i.need.get(e.cs);
    p ? p.push(e) : i.need.set(e.cs, [e]);
  }
  if ((i.shown.push(e), e.la === e.la)) {
    const p = i.users.get(e.uid);
    if (p && e.t - p.t < 18e5 && e.t >= p.t) {
      const y = la(p.la, p.lo, e.la, e.lo);
      y > 20 && x.arc(p, e, y, t);
    }
    i.users.set(e.uid, { la: e.la, lo: e.lo, t: e.t });
  }
  (x.add(e, t), (ie.today = !0));
}
function cn(e, t) {
  (i.csLive.set(e.id, e),
    e.id > i.maxCs && e.ca <= pe() && (i.maxCs = e.id),
    e.open ||
      (i.closed.push(e), i.histStream ? i.histStream.push(e) : $t.push(e)),
    (ie.trend = ie.parts = !0));
}
function ia(e) {
  let t = 0;
  for (; t < i.pend.length && i.pend[t].t <= e;) t++;
  if (t) {
    const a = i.pend.splice(0, t);
    for (const o of a) ln(o, e - o.t > 5e3);
  }
  let s = 0;
  for (; s < i.csQ.length && i.csQ[s].at <= e;) s++;
  if (s) {
    const a = i.csQ.splice(0, s);
    for (const o of a) cn(o, !1);
  }
  i.nextMid &&
    e >= i.nextMid &&
    ((i.base = {
      first: [i.max[0] + 1, i.max[1] + 1, i.max[2] + 1],
      cs: i.maxCs + 1,
    }),
    (i.mid = i.nextMid),
    (i.nextMid = on(e + 1e3)),
    (ie.today = !0),
    (Me.cs.v = null),
    x.view === 0 && (Me.hero.v = null));
}
let un = 0;
function ra(e) {
  if (e < un) return;
  un = e + 15e3;
  let t = 0;
  for (; t < i.shown.length && i.shown[t].t < e - 20 * 6e4;) t++;
  for (
    t && i.shown.splice(0, t), t = 0;
    t < i.closed.length && i.closed[t].cl < e - 65 * 6e4;
  )
    t++;
  t && i.closed.splice(0, t);
  const s = e - 70 * 6e4;
  for (const [a, o] of i.csLive)
    (o.open ? o.at : o.cl) < s && i.csLive.delete(a);
  for (const [a, o] of i.csAll)
    Math.max(o.at, o.ca) < s - 10 * 6e4 &&
      (i.csAll.delete(a), i.split.delete(a));
  for (const [a, o] of i.users) o.t < e - 18e5 && i.users.delete(a);
  for (const [a, o] of i.need) o[o.length - 1].t < e - 9e5 && i.need.delete(a);
}
function la(e, t, s, a) {
  const o = e * ne,
    w = s * ne,
    h = (a - t) * ne;
  return (
    6371 *
    Math.acos(
      X(
        Math.sin(o) * Math.sin(w) + Math.cos(o) * Math.cos(w) * Math.cos(h),
        -1,
        1,
      ),
    )
  );
}
let dn = () => {};
function ca() {
  const e = {
      type: "init",
      back: en ? 3 : Qe ? 5 : 9,
      csBack: en ? 25 : 60,
      poll: 12e3,
      mid: 0,
    },
    t = (a) => {
      ((dn = (o) => {
        o.type === "baselineAt" && a({ type: "baseline", mid: o.mid });
      }),
        a(e));
    };
  try {
    const a = `(${nn.toString()})((m)=>postMessage(m),(fn)=>{onmessage=(e)=>fn(e.data);});`,
      o = new Worker(
        URL.createObjectURL(new Blob([a], { type: "text/javascript" })),
      );
    ((o.onmessage = (w) => sn(w.data)),
      (o.onerror = (w) => {
        (w.preventDefault?.(),
          console.warn("worker failed, running on the page", w.message),
          o.terminate(),
          s());
      }),
      t((w) => o.postMessage(w)));
  } catch {
    s();
  }
  function s() {
    let a = () => {};
    (nn(
      (o) => setTimeout(() => sn(o)),
      (o) => {
        a = o;
      },
    ),
      t((o) => a(o)));
  }
}
const ie = { today: !0, trend: !0, graph: !0, parts: !0 };
class it {
  constructor(t, s = "") {
    ((this.el = t),
      (this.pre = s),
      (this.v = null),
      (this.t = null),
      (this.s = ""));
  }
  set(t) {
    this.t = t;
  }
  step(t) {
    if (this.t == null || !isFinite(this.t)) return;
    (this.v == null || Math.abs(this.t - this.v) > 1e9
      ? (this.v = this.t)
      : (this.v += (this.t - this.v) * (1 - Math.exp(-t / 0.45))),
      Math.abs(this.t - this.v) < 0.5 && (this.v = this.t));
    const s = this.pre + de(Math.max(0, this.v));
    s !== this.s && ((this.el.textContent = s), (this.s = s));
  }
}
const Me = {
    cs: new it(D("#nCs")),
    hero: new it(D("#heroN")),
    plus: new it(D("#plus"), "+"),
    minus: new it(D("#minus"), "\u2212"),
    map: new it(D("#nMap")),
  },
  rt = new Map();
function et(e) {
  let t = 2166136261;
  for (let s = 0; s < e.length; s++)
    ((t ^= e.charCodeAt(s)), (t = Math.imul(t, 16777619)));
  return t >>> 0;
}
function fn(e) {
  const t = e || "?";
  let s = rt.get(t);
  if (s) return s;
  const a = et(t),
    o = et(t + "#osm"),
    w = document.createElement("canvas");
  w.width = w.height = 48;
  const h = w.getContext("2d"),
    r = a % 360,
    p = h.createLinearGradient(0, 0, 48, 48);
  (p.addColorStop(0, `hsl(${r} 42% 22%)`),
    p.addColorStop(1, `hsl(${(r + 40) % 360} 45% 13%)`),
    (h.fillStyle = p),
    h.fillRect(0, 0, 48, 48),
    (h.fillStyle = `hsl(${r} ${62 + (o % 22)}% ${62 + ((o >>> 20) % 14)}%)`));
  let y = 0;
  for (let c = 0; c < 5; c++)
    for (let l = 0; l < 3; l++)
      ((o >>> (c * 3 + l)) & 1 || (!y && c === 4 && l === 2)) &&
        (y++,
        h.fillRect(9 + l * 6, 9 + c * 6, 6, 6),
        h.fillRect(9 + (4 - l) * 6, 9 + c * 6, 6, 6));
  return (
    (s = w.toDataURL()),
    rt.set(t, s),
    rt.size > 500 && rt.delete(rt.keys().next().value),
    s
  );
}
const ua = (() => {
    const e = -new Date().getTimezoneOffset(),
      t = Math.trunc(e / 60),
      s = Math.abs(e % 60);
    return "GMT" + (e >= 0 ? "+" : "-") + Math.abs(t) + (s ? ":" + Pe(s) : "");
  })(),
  da = (e) => {
    const t = new Date(e);
    return `${t.getFullYear()}-${Pe(t.getMonth() + 1)}-${Pe(t.getDate())} ${Pe(t.getHours())}:${Pe(t.getMinutes())}:${Pe(t.getSeconds())} ${ua}`;
  },
  hn = (e) => {
    const t = new Date(e);
    return Pe(t.getHours()) + ":" + Pe(t.getMinutes());
  },
  fa = new Intl.DateTimeFormat(void 0, {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }),
  pn = (e) => "https://www.openstreetmap.org/changeset/" + e,
  vn = (e) => "https://www.openstreetmap.org/user/" + encodeURIComponent(e),
  Dt = (e) => window.open(e, "_blank", "noopener"),
  tt = {
    pen: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 2.5 3 3L6 13H3v-3z"/></svg>',
    up: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 11V3M4.5 6.5 8 3l3.5 3.5M3 13.5h10"/></svg>',
    walk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4.2" r="1.9" fill="currentColor" stroke="none"/><path d="m9 21 2.4-6.2L14 17v4M11.4 14.8 12.5 9l-3.3 1.6L8 13.5M12.5 9l2.4 2.5 2.8 1"/></svg>',
    desk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.8"/><path d="M9 20h6M12 16v4"/></svg>',
    pin: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 14V6"/><circle cx="8" cy="4.2" r="2.4" fill="currentColor" stroke="none"/></svg>',
    bar: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2.5 8h11"/></svg>',
  };
let Ze = "",
  mn = [];
const vt = D("#trend"),
  mt = new Map();
function ha(e) {
  const t = e - 36e5,
    s = new Map(),
    a = new Map();
  for (const c of i.csLive.values()) {
    const l = c.open ? c.at : c.cl;
    if (l < t || l > e) continue;
    const b = At(c.tags.created_by) || "Other";
    if ((a.set(b, (a.get(b) || 0) + 1), Ze && b !== Ze)) continue;
    let L = s.get(c.uid);
    (L ||
      ((L = { uid: c.uid, user: c.user, n: 0, k: 0, last: 0, cm: "", ed: "" }),
      s.set(c.uid, L)),
      (L.n += c.n),
      L.k++,
      l > L.last && ((L.last = l), (L.cm = c.tags.comment || ""), (L.ed = b)));
  }
  mn = [...a]
    .sort((c, l) => l[1] - c[1])
    .slice(0, 6)
    .map((c) => c[0]);
  const o = [...s.values()]
      .sort((c, l) => l.n - c.n || l.last - c.last)
      .slice(0, 6),
    w = vt.clientHeight,
    h = Math.max(4, w * 0.012),
    r = Math.min((w - h * 5) / 6, w / 5.2),
    p = new Set();
  o.forEach((c, l) => {
    let b = mt.get(c.uid);
    (b ||
      ((b = document.createElement("li")),
      (b.style.opacity = 0),
      (b.innerHTML =
        '<span class="rk"></span><img alt=""><div class="who"><div class="nm"></div><div class="st"></div></div><div class="cm" dir="auto"></div>'),
      (b.onclick = () => Dt(vn(b.dataset.user))),
      vt.appendChild(b),
      mt.set(c.uid, b),
      (b.style.transform = `translateY(${(l + 0.6) * (r + h)}px)`),
      requestAnimationFrame(() => {
        b.style.opacity = 1;
      })),
      p.add(c.uid),
      (b.dataset.user = c.user),
      (b.style.height = r + "px"),
      (b.style.transform = `translateY(${l * (r + h)}px)`),
      (b.children[0].textContent = l + 1));
    const L = b.children[1];
    (L.dataset.u !== c.user && ((L.src = fn(c.user)), (L.dataset.u = c.user)),
      (b.children[2].children[0].textContent = c.user),
      (b.children[2].children[1].innerHTML = `<i title="changes in the last hour">${tt.pen}${de(c.n)}</i><i title="changesets in the last hour">${tt.up}${c.k}</i>`),
      (b.children[3].textContent = c.cm || "(no comment)"),
      (b.title = `${c.user}: ${de(c.n)} changes in ${c.k} changeset${c.k > 1 ? "s" : ""} in the last hour, with ${c.ed}. Open their profile on openstreetmap.org`));
  });
  for (const [c, l] of mt)
    p.has(c) ||
      (mt.delete(c), (l.style.opacity = 0), setTimeout(() => l.remove(), 500));
  let y = vt.querySelector(".empty");
  !o.length && i.ready
    ? (y ||
        ((y = document.createElement("div")),
        (y.className = "empty"),
        vt.appendChild(y)),
      (y.textContent = Ze
        ? `Nobody on ${Ze} in the last hour yet.`
        : "Waiting for the first changesets\u2026"))
    : y && y.remove();
}
function gn() {
  const e = ["", ...mn.filter((s) => s !== "Other")],
    t = e.indexOf(Ze);
  ((Ze = e[(t + 1) % e.length] || ""),
    (D("#edTab").textContent = Ze || "All editors"),
    (ie.trend = !0));
}
D("#edTab").onclick = gn;
const $t = (() => {
    const e = D("#col"),
      t = [];
    let s = 0,
      a = null;
    function o(r) {
      const p = r.list[r.list.length - 1],
        y = r.list.length,
        c = r.list.some((z) => z.tags.changesets_count === "0"),
        l = r.list.reduce((z, P) => z + P.n, 0),
        b = l >= 1e3,
        L = r.list.some((z) => z.cc > 0),
        Y = c
          ? "FirstChangeset"
          : L
            ? "ChangesetDiscussion"
            : b
              ? "LargeChangeset"
              : "ChangesetClose";
      r.d.className =
        "ev" +
        (c ? " first" : L ? " talk" : b ? " bulk" : "") +
        (r.d.classList.contains("new") ? " new" : "");
      let le = 0,
        re = 0,
        f = 0,
        I = 0;
      for (const z of r.list) {
        const P = i.split.get(z.id);
        P &&
          ((le += P[0]), (re += P[1]), (f += P[2]), (I += P[0] + P[1] + P[2]));
      }
      const E =
          I >= l * 0.9 && l ? `+${de(le)} ~${de(re)} \u2212${de(f)}` : de(l),
        N = p.bb,
        G = N ? kt((N[0] + N[2]) / 2, (N[1] + N[3]) / 2) : "";
      ((r.d.innerHTML =
        `<div class="h"><span class="n">${Y}</span>${y > 1 ? `<span class="d"> \xD7${y}</span>` : ""} from <span class="u">${he(p.user)}</span></div><div class="d">${da(p.cl)}</div><div class="kv">editor: <q>${he(At(p.tags.created_by) || "unknown")}</q>  changes: ${E}</div>` +
        (p.tags.comment
          ? `<div class="kv">comment: <q class="cm" dir="auto">${he(p.tags.comment)}</q></div>`
          : "") +
        (G
          ? `<div class="kv">location: <q>${he(G.replace(/^(in|near) /, ""))}</q></div>`
          : "")),
        (r.d.title =
          y > 1
            ? `${y} changesets from ${p.user}: open their history on openstreetmap.org`
            : "Open this changeset on openstreetmap.org"));
    }
    function w(r, p, y) {
      if (
        ((r.d = document.createElement("div")),
        (r.d.className = "ev"),
        o(r),
        (r.d.onclick = () =>
          Dt(
            r.list.length > 1
              ? vn(r.list[0].user) + "/history"
              : pn(r.list[0].id),
          )),
        e.appendChild(r.d),
        (r.at = y),
        (a = r),
        e.querySelectorAll(".ev.new").forEach((c) => c.classList.remove("new")),
        r.d.classList.add("new"),
        p)
      ) {
        const c = r.d.offsetHeight;
        (r.d.classList.add("in"),
          (e.style.transition = "none"),
          (e.style.transform = `translateY(${c}px)`),
          e.offsetHeight,
          (e.style.transition = "transform .95s cubic-bezier(.2,.8,.2,1)"),
          (e.style.transform = "translateY(0)"));
      }
      for (; e.children.length > 18;) e.firstChild.remove();
    }
    const h = (r, p) => r && r.list[0].uid === p.uid;
    return {
      fill(r) {
        r.sort((y, c) => y.cl - c.cl);
        const p = [];
        for (const y of r)
          h(p[p.length - 1], y)
            ? p[p.length - 1].list.push(y)
            : p.push({ list: [y] });
        for (const y of p.slice(-14)) w(y, !1, ge());
      },
      push(r) {
        const p = ge();
        if (h(t[t.length - 1], r)) {
          t[t.length - 1].list.push(r);
          return;
        }
        if (!t.length && h(a, r) && p - a.at < 25e3 && a.d.isConnected) {
          (a.list.push(r), o(a));
          return;
        }
        if ((t.push({ list: [r] }), t.length > 8)) {
          const y = (c) => c.list.reduce((l, b) => l + b.n, 0);
          (t.sort((c, l) => y(l) - y(c)),
            (t.length = 6),
            t.sort((c, l) => c.list[0].cl - l.list[0].cl));
        }
      },
      step(r) {
        t.length &&
          r >= s &&
          !document.hidden &&
          (w(t.shift(), !0, r), (s = r + Math.max(650, 1500 - t.length * 160)));
      },
    };
  })(),
  pa = D("#graph"),
  wn = D("#gticks"),
  Ft = [];
for (let e = 0; e < 6; e++) {
  const t = document.createElement("div");
  t.className = "blk";
  for (let s = 0; s < 60; s++) {
    const a = document.createElement("i");
    (t.appendChild(a), Ft.push(a));
  }
  (pa.appendChild(t), wn.appendChild(document.createElement("span")));
}
let yn = "";
function va(e) {
  const a = Math.floor(e / 6e5) * 6e5 + 6e5,
    o = a - 6 * 6e5,
    w = new Array(360).fill(0);
  for (const L of i.csAll.values())
    L.ca < o || L.ca > e || w[Math.floor((L.ca - o) / 1e4)]++;
  const h = w.filter((L) => L > 0).sort((L, Y) => L - Y),
    r = (L) =>
      h.length ? h[Math.min(h.length - 1, Math.floor(h.length * L))] : 1,
    p = r(0.25),
    y = r(0.5),
    c = r(0.8),
    l = Math.floor((e - o) / 1e4);
  for (let L = 0; L < 360; L++) {
    const Y = w[L],
      le =
        L > l
          ? "fut"
          : L === l
            ? "now"
            : Y === 0
              ? ""
              : Y <= p
                ? "c1"
                : Y <= y
                  ? "c2"
                  : Y <= c
                    ? "c3"
                    : "c4";
    Ft[L].className !== le && (Ft[L].className = le);
  }
  const b = o + "";
  b !== yn &&
    ((yn = b),
    [...wn.children].forEach((L, Y) => (L.textContent = hn(o + Y * 6e5))));
}
const xn = D("#parts");
function ma(e) {
  const t = e - 36e5,
    s = new Set(),
    a = new Map();
  for (const l of i.csLive.values()) {
    const b = l.open ? l.at : l.cl;
    if (b < t || b > e) continue;
    s.add(l.uid);
    const L = (l.tags.hashtags || "")
      .split(/[;,\s]+/)
      .filter((Y) => /^#\S{2,}/.test(Y));
    for (const Y of L) {
      const le = Y.toLowerCase();
      let re = a.get(le);
      (re || ((re = { h: Y, u: new Map(), n: 0 }), a.set(le, re)),
        (re.n += l.n),
        re.u.set(l.uid, (re.u.get(l.uid) || 0) + l.n),
        (re.user = re.user || new Map()),
        re.user.set(l.uid, l.user));
    }
  }
  Me.map.set(s.size);
  const o = [...a.values()].sort((l, b) => b.u.size - l.u.size || b.n - l.n),
    w = xn.clientWidth,
    h = o.slice(0, w < 190 ? 2 : 3),
    r =
      h.length === 3
        ? [0.16, 0.5, 0.84]
        : h.length === 2
          ? [0.25, 0.75]
          : [0.5];
  let p = '<div class="ln"></div>';
  h.forEach((l, b) => {
    const L = [...l.u].sort((Y, le) => le[1] - Y[1]).slice(0, w < 300 ? 3 : 4);
    p += `<div class="cl" style="left:${r[b] * 100}%" title="${he(l.h)}: ${l.u.size} mapper${l.u.size > 1 ? "s" : ""}, ${de(l.n)} changes in the last hour"><div class="up">+${de(l.n)}<small>${l.u.size} mapper${l.u.size > 1 ? "s" : ""}</small></div><div class="av">${L.map(([Y]) => `<img alt="" src="${fn(l.user.get(Y))}">`).join("")}</div><div class="dn">${he(l.h)}</div></div>`;
  });
  const y = o.slice(h.length);
  let c = 0;
  for (const l of y)
    for (const b of l.u.keys()) {
      if (c++ > 40) break;
      const L = (et(l.h + b) % 1e3) / 1e3;
      p += `<i class="pdot" style="left:${(4 + L * 92).toFixed(1)}%;background:hsl(${et(l.h) % 360} 80% 66%);opacity:.75"></i>`;
    }
  (!h.length &&
    i.ready &&
    (p +=
      '<div class="empty" style="position:absolute;top:60%;left:0">No campaigns tagged in the last hour.</div>'),
    (xn.innerHTML = p));
}
function ga(e) {
  const t = e - 6e5,
    s = new Map(),
    a = new Set();
  let o = 0,
    w = 0,
    h = 0;
  for (let l = i.shown.length - 1; l >= 0; l--) {
    const b = i.shown[l];
    if (b.t < t) break;
    if (
      !(b.t > e) &&
      (o++, a.add(b.uid), b.meth && (h++, b.meth === 1 && w++), b.la === b.la)
    ) {
      const L = ea(b.la, b.lo);
      L && s.set(L, (s.get(L) || 0) + 1);
    }
  }
  if (!o) {
    D("#why").textContent =
      i.status === "down"
        ? "OpenStreetMap is not answering right now; trying again."
        : "Connecting to OpenStreetMap\u2026";
    return;
  }
  const r = new Set([
      "US",
      "GB",
      "NL",
      "PH",
      "AE",
      "BS",
      "GM",
      "CF",
      "CD",
      "CG",
      "DO",
      "MV",
      "SB",
      "MH",
      "KM",
      "CZ",
      "VA",
    ]),
    p = (l) =>
      (r.has(l) && l !== "CZ" && l !== "CD" && l !== "CG" ? "the " : "") +
      (St[l] || l),
    y = [...s]
      .sort((l, b) => b[1] - l[1])
      .slice(0, 3)
      .map(([l]) => `<b>${he(p(l))}</b>`),
    c = y.length === 3 ? `${y[0]}, ${y[1]} and ${y[2]}` : y.join(" and ");
  D("#why").innerHTML =
    `In the last ten minutes, <b>${de(o)} uploads</b> from <b>${de(a.size)} mappers</b>${c ? `, most of them in ${c}` : ""}.` +
    (h > 20
      ? ` <b>${Math.round((w / h) * 100)}%</b> came from phones, out on the street.`
      : "");
}
const Mn = [
    {
      title: "Points Added",
      cap: "Today So Far",
      legend: `<li style="color:#ffb3d6">${tt.walk}On the ground</li><li style="color:#9cc3ff">${tt.desk}At a desk</li>`,
    },
    { title: "Map Changes", cap: "Last Hour", legend: "", row: !0 },
  ],
  bn = [
    ["New points", "#3b8bff"],
    ["New lines & areas", "#7a5cff"],
    ["Edited", "#c66bff"],
    ["Deleted", "#ff4f7b"],
    ["Relations", "#ffa4e0"],
  ];
Mn[1].legend = bn
  .map(
    ([e, t]) =>
      `<li><span class="sw" style="background:${t};box-shadow:0 0 8px ${t}"></span>${e}</li>`,
  )
  .join("");
function Sn(e) {
  const t = Mn[e];
  ((D("#heroT").textContent = t.title), (D("#heroC").textContent = t.cap));
  const s = D("#legend");
  ((s.innerHTML = t.legend),
    s.classList.toggle("row", !!t.row),
    (Me.hero.v = null),
    (Me.hero.s = ""));
}
function Cn(e) {
  const t = i.base;
  (t &&
    (isFinite(t.cs) && i.maxCs && Me.cs.set(Math.max(0, i.maxCs - t.cs + 1)),
    isFinite(t.first[0]) &&
      i.max[0] &&
      (lt.pts = Math.max(0, i.max[0] - t.first[0] + 1))),
    Me.plus.set(i.win.c),
    Me.minus.set(i.win.d),
    i.win.t0 &&
      (D("#since").textContent = "Created and deleted since " + hn(i.win.t0)));
  let s = 0;
  for (const a of i.closed) a.cl > e - 36e5 && a.cl <= e && (s += a.n);
  ((lt.hour = s), Me.hero.set(x.view === 0 ? lt.pts : lt.hour));
}
const lt = { pts: null, hour: null },
  kn = "sael-data-last";
function wa() {
  try {
    localStorage.setItem(
      kn,
      JSON.stringify({
        at: Date.now(),
        mid: i.mid,
        cs: Me.cs.t,
        pts: lt.pts,
        map: Me.map.t,
      }),
    );
  } catch {}
}
function ya() {
  try {
    const e = JSON.parse(localStorage.getItem(kn) || "null");
    if (!e || Date.now() - e.at > 6 * 36e5) return;
    const t = e.mid === an(Date.now() - 11e4);
    (t && e.cs && Me.cs.set(e.cs),
      t && e.pts && Me.hero.set(e.pts),
      e.map && Me.map.set(e.map),
      D("#app").classList.add("stale"));
  } catch {}
}
const Ce = { view: 0, auto: !Xn, next: 0, span: 24e3 },
  x = (() => {
    const e = D("#gl"),
      t = {
        ground: new v.Color("#ff4f9d"),
        desk: new v.Color("#3b82ff"),
        unknown: new v.Color("#9fbfff"),
      },
      s = bn.map(([, n]) => new v.Color(n));
    let a = null;
    try {
      a = new v.WebGLRenderer({
        canvas: e,
        antialias: !1,
        alpha: !1,
        depth: !0,
        stencil: !1,
        powerPreference: "high-performance",
      });
    } catch (n) {
      console.warn("no WebGL", n);
    }
    const o = {
      ok: !!a,
      add() {},
      arc() {},
      render() {},
      pick() {
        return null;
      },
      view: 0,
      fade: [1, 0],
      dpr: 1,
      W: 1,
      H: 1,
      yaw: 0,
      pitch: 0,
      dist: 0,
    };
    if (!a) return (D("#cover").classList.add("gone"), o);
    ((a.autoClear = !1), a.setClearColor(0, 0));
    const w = a.capabilities.isWebGL2;
    let h = 1,
      r = 1,
      p = 1,
      y = Math.min(2, Math.max(1, devicePixelRatio || 1));
    const c = new v.WebGLRenderTarget(4, 4, {
        type: v.HalfFloatType,
        samples: w ? 4 : 0,
        depthBuffer: !0,
      }),
      l = [0, 1, 2, 3, 4, 5].map(
        () =>
          new v.WebGLRenderTarget(4, 4, {
            type: v.HalfFloatType,
            depthBuffer: !1,
          }),
      ),
      b = new v.BufferGeometry();
    (b.setAttribute(
      "position",
      new v.BufferAttribute(
        new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
        3,
      ),
    ),
      b.setAttribute(
        "uv",
        new v.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2),
      ));
    const L = new v.Scene(),
      Y = new v.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      le = new v.Mesh(b);
    ((le.frustumCulled = !1), L.add(le));
    const re =
        "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
      f = new v.ShaderMaterial({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new v.Vector2() },
          uStretch: { value: new v.Vector2(1, 1) },
          uThresh: { value: 0.85 },
          uFirst: { value: 0 },
        },
        vertexShader: re,
        depthTest: !1,
        depthWrite: !1,
        fragmentShader: `uniform sampler2D tSrc;uniform vec2 uTexel,uStretch;uniform float uThresh,uFirst;varying vec2 vUv;
  vec3 s(vec2 o){return texture2D(tSrc,vUv+o*uTexel*uStretch).rgb;}
  void main(){vec3 c=s(vec2(0))*.125+(s(vec2(-2,2))+s(vec2(2,2))+s(vec2(-2,-2))+s(vec2(2,-2)))*.03125+(s(vec2(0,2))+s(vec2(-2,0))+s(vec2(2,0))+s(vec2(0,-2)))*.0625+(s(vec2(-1,1))+s(vec2(1,1))+s(vec2(-1,-1))+s(vec2(1,-1)))*.125;
  c=max(c,vec3(0.));if(c.r+c.g+c.b>1e4)c=vec3(0.);
  if(uFirst>.5){float b=max(c.r,max(c.g,c.b));float k=max(b-uThresh,0.);k=k*k/(k+.35);c*=k/max(b,1e-4);}
  gl_FragColor=vec4(c,1.);}`,
      }),
      I = new v.ShaderMaterial({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new v.Vector2() },
          uStretch: { value: new v.Vector2(1, 1) },
        },
        vertexShader: re,
        depthTest: !1,
        depthWrite: !1,
        blending: v.CustomBlending,
        blendSrc: v.OneFactor,
        blendDst: v.OneFactor,
        transparent: !0,
        fragmentShader: `uniform sampler2D tSrc;uniform vec2 uTexel,uStretch;varying vec2 vUv;
  void main(){vec2 o=uTexel*uStretch;vec3 c=texture2D(tSrc,vUv).rgb*4.;
  c+=(texture2D(tSrc,vUv+vec2(-o.x,0.)).rgb+texture2D(tSrc,vUv+vec2(o.x,0.)).rgb+texture2D(tSrc,vUv+vec2(0.,-o.y)).rgb+texture2D(tSrc,vUv+vec2(0.,o.y)).rgb)*2.;
  c+=texture2D(tSrc,vUv-o).rgb+texture2D(tSrc,vUv+o).rgb+texture2D(tSrc,vUv+vec2(-o.x,o.y)).rgb+texture2D(tSrc,vUv+vec2(o.x,-o.y)).rgb;
  gl_FragColor=vec4(c/16.,1.);}`,
      }),
      E = new v.ShaderMaterial({
        uniforms: {
          tScene: { value: null },
          tBloom: { value: null },
          uBloom: { value: 0.9 },
          uExpo: { value: 1 },
          uTime: { value: 0 },
          uDpr: { value: 1 },
          uStars: { value: 1 },
          uTop: { value: new v.Color("#03040b") },
          uBot: { value: new v.Color("#020309") },
        },
        vertexShader: re,
        depthTest: !1,
        depthWrite: !1,
        fragmentShader: `uniform sampler2D tScene,tBloom;uniform float uBloom,uExpo,uTime,uDpr,uStars;uniform vec3 uTop,uBot;varying vec2 vUv;
  vec3 aces(vec3 x){return clamp(x*(2.51*x+.03)/(x*(2.43*x+.59)+.14),0.,1.);}
  vec3 toS(vec3 c){c=max(c,vec3(0.));return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(vec3(.0031308),c));}
  float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  vec3 stars(vec2 px){float z=30.*uDpr;vec2 c=floor(px/z);if(h(c)>.15)return vec3(0.);vec2 o=vec2(h(c+3.1),h(c+7.7))*.8+.1;float d=length(px/z-c-o)*z/uDpr;
   float b=pow(h(c+11.3),5.)*1.4+.05;b*=.6+.4*sin(uTime*(.5+2.*h(c+5.5))+6.28*h(c+9.9));return vec3(.75,.83,1.)*b*exp(-d*d*1.3);}
  void main(){vec4 sc=texture2D(tScene,vUv);
   vec3 bg=mix(uBot,uTop,vUv.y)+stars(gl_FragCoord.xy)*uStars;   // uTop and uBot are linear already (three's Color)
   vec3 hdr=max(sc.rgb,vec3(0.))+texture2D(tBloom,vUv).rgb*uBloom;
   vec3 c=bg*(1.-clamp(sc.a,0.,1.))+aces(hdr*uExpo);
   gl_FragColor=vec4(toS(c)+(h(gl_FragCoord.xy+fract(uTime*7.))-.5)/255.,1.);}`,
      }),
      N = {
        blending: v.CustomBlending,
        blendSrc: v.OneFactor,
        blendDst: v.OneFactor,
        blendSrcAlpha: v.ZeroFactor,
        blendDstAlpha: v.OneFactor,
        transparent: !0,
        depthWrite: !1,
        side: v.DoubleSide,
      },
      G = new v.Scene(),
      z = new v.PerspectiveCamera(26, 1, 0.1, 60),
      P = new v.Group();
    G.add(P);
    const m = {
        uNow: { value: 0 },
        uFade: { value: 1 },
        uRes: { value: new v.Vector2(1, 1) },
        uDpr: { value: 1 },
        uLife: { value: 600 },
      },
      V = new v.ShaderMaterial({
        uniforms: {
          uMap: { value: null },
          uHas: { value: 0 },
          uLight: { value: new v.Vector3(-0.62, 0.52, 0.58).normalize() },
          uFade: m.uFade,
        },
        vertexShader:
          "varying vec2 vUv;varying vec3 vN,vP;void main(){vUv=uv;vN=normalMatrix*normal;vec4 p=modelViewMatrix*vec4(position,1.);vP=p.xyz;gl_Position=projectionMatrix*p;}",
        fragmentShader: `uniform sampler2D uMap;uniform float uHas,uFade;uniform vec3 uLight;varying vec2 vUv;varying vec3 vN,vP;
  void main(){vec3 n=normalize(vN),v=normalize(-vP);
   vec3 t=uHas>.5?texture2D(uMap,vUv).rgb:vec3(.004,.006,.03);
   // Black Marble's lights are warm and its land and sea are blue: the warmth is the city light
   float warm=max(0.,t.r*1.15+t.g*.45-t.b*1.25);
   vec3 lights=vec3(1.,.8,.55)*smoothstep(.004,.07,warm)*warm*4.;
   vec3 base=max(t-vec3(warm*.8,warm*.55,0.),vec3(0.));
   float l=dot(n,uLight),lit=.72+.62*smoothstep(-.5,.95,l);
   vec3 c=(base*vec3(3.2,2.3,.85)+vec3(.007,.0075,.024))*lit;
   float fr=pow(1.-max(dot(n,v),0.),2.8);
   c+=vec3(.11,.12,.3)*fr*(.35+.65*smoothstep(-.3,.8,l));
   c+=lights*(.7+.5*(1.-smoothstep(-.3,.8,l)));
   gl_FragColor=vec4(c*uFade,uFade);}`,
      }),
      ke = new v.Mesh(new v.SphereGeometry(1, 160, 100), V);
    P.add(ke);
    const ce = new v.Mesh(
      new v.SphereGeometry(1.1, 96, 64),
      new v.ShaderMaterial({
        uniforms: { uFade: m.uFade },
        ...N,
        side: v.BackSide,
        vertexShader:
          "varying vec3 vN,vP;void main(){vN=normalMatrix*normal;vec4 p=modelViewMatrix*vec4(position,1.);vP=p.xyz;gl_Position=projectionMatrix*p;}",
        fragmentShader:
          "uniform float uFade;varying vec3 vN,vP;void main(){float k=-dot(normalize(vN),normalize(-vP));float a=pow(smoothstep(0.,.46,k),6.);gl_FragColor=vec4(vec3(.26,.36,1.)*a*.2*uFade,0.);}",
      }),
    );
    G.add(ce);
    {
      const n = D("#earth").textContent.trim();
      if (n && n[0] !== "@") {
        const u = new Image();
        ((u.onload = () => {
          const d = new v.Texture(u);
          ((d.colorSpace = v.SRGBColorSpace),
            (d.anisotropy = Math.min(8, a.capabilities.getMaxAnisotropy())),
            (d.generateMipmaps = !0),
            (d.minFilter = v.LinearMipmapLinearFilter),
            (d.needsUpdate = !0),
            (V.uniforms.uMap.value = d),
            (V.uniforms.uHas.value = 1),
            (o.texReady = !0));
        }),
          (u.src = "data:image/webp;base64," + n));
      }
    }
    const Z = (n, u, d, M) => {
      const T = n * ne,
        $ = u * ne,
        R = Math.cos(T);
      ((d[M] = R * Math.cos($)),
        (d[M + 1] = Math.sin(T)),
        (d[M + 2] = -R * Math.sin($)));
    };
    function ve(n, u, d) {
      const M = new v.InstancedBufferGeometry();
      M.index = d.index;
      for (const $ in d.attributes) M.setAttribute($, d.attributes[$]);
      const T = {};
      for (const [$, R] of Object.entries(u))
        ((T[$] = new v.InstancedBufferAttribute(new Float32Array(n * R), R)),
          T[$].setUsage(v.DynamicDrawUsage),
          M.setAttribute($, T[$]));
      return (
        (M.instanceCount = 0),
        (M.boundingSphere = new v.Sphere(new v.Vector3(), 1e4)),
        { g: M, A: T, n, i: 0, count: 0 }
      );
    }
    function g(n) {
      const u = n.i;
      return (
        (n.i = (n.i + 1) % n.n),
        (n.count = Math.min(n.count + 1, n.n)),
        (n.g.instanceCount = n.count),
        u
      );
    }
    const C = new Set();
    function B(n, u, d) {
      (n._full ||
        (n.updateRanges.length >= 40
          ? ((n._full = !0), n.clearUpdateRanges())
          : n.addUpdateRange(u, d)),
        (n.needsUpdate = !0),
        C.add(n));
    }
    function F(n, u, d, ...M) {
      const T = n.A[u],
        $ = T.itemSize;
      for (let R = 0; R < $; R++) T.array[d * $ + R] = M[R];
      B(T, d * $, $);
    }
    const q = new v.BufferGeometry();
    (q.setAttribute(
      "position",
      new v.BufferAttribute(
        new Float32Array([-1, 0, 0, 1, 0, 0, -1, 1, 0, 1, 1, 0]),
        3,
      ),
    ),
      q.setIndex([0, 1, 2, 2, 1, 3]));
    const S = new v.BufferGeometry();
    (S.setAttribute(
      "position",
      new v.BufferAttribute(
        new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
        3,
      ),
    ),
      S.setIndex([0, 1, 2, 2, 1, 3]));
    const A = ve(4096, { aDir: 3, aPin: 4, aCol: 3 }, q),
      _ = `uniform float uNow,uFade,uLife,uDpr;uniform vec2 uRes;attribute vec3 aDir;attribute vec4 aPin;attribute vec3 aCol;varying vec3 vCol;varying float vA;
  float age(){return uNow-aPin.y;}float lifeK(float a){return 1.-smoothstep(uLife*.35,uLife,a);}
  float hgt(float a){return aPin.x*smoothstep(0.,1.1,a)*(.5+.5*lifeK(a));}`,
      Ee = new v.ShaderMaterial({
        uniforms: m,
        ...N,
        depthTest: !0,
        vertexShader:
          _ +
          `varying float vS,vL;void main(){float a=age();float h=hgt(a);
   vec4 c0=projectionMatrix*modelViewMatrix*vec4(aDir*1.0015,1.),c1=projectionMatrix*modelViewMatrix*vec4(aDir*(1.0015+h),1.);
   vec2 d=(c1.xy/c1.w-c0.xy/c0.w)*uRes;float L=length(d);vec2 dir=L>1e-3?d/L:vec2(0.,1.);vec2 nr=vec2(-dir.y,dir.x);
   vec4 c=mix(c0,c1,position.y);c.xy+=nr*position.x*(.75+.35*aPin.w)*uDpr*2./uRes*c.w;gl_Position=c;
   vS=position.x;vL=position.y;vCol=aCol;vA=lifeK(a)*step(0.,a)*uFade;}`,
        fragmentShader:
          "varying vec3 vCol;varying float vA,vS,vL;void main(){float e=1.-abs(vS);gl_FragColor=vec4(vCol*e*e*mix(.2,1.,vL*vL)*vA*1.5,0.);}",
      }),
      ze = new v.Mesh(A.g, Ee);
    ((ze.frustumCulled = !1), P.add(ze));
    const K = new v.ShaderMaterial({
        uniforms: m,
        ...N,
        depthTest: !0,
        vertexShader:
          _ +
          `varying vec2 vQ;void main(){float a=age();vec4 c=projectionMatrix*modelViewMatrix*vec4(aDir*(1.0015+hgt(a)),1.);
   float f=exp(-max(a,0.)*1.4);float r=(2.+1.3*aPin.w+5.*f)*uDpr;c.xy+=position.xy*r*2./uRes*c.w;gl_Position=c;
   vQ=position.xy;vCol=aCol*(1.+4.*f)+vec3(.6)*f;vA=lifeK(a)*step(0.,a)*uFade;}`,
        fragmentShader:
          "varying vec3 vCol;varying float vA;varying vec2 vQ;void main(){float r=dot(vQ,vQ);if(r>1.)discard;gl_FragColor=vec4(vCol*(exp(-r*7.)*2.2+exp(-r*2.4)*.35)*vA,0.);}",
      }),
      U = new v.Mesh(A.g, K);
    ((U.frustumCulled = !1), P.add(U));
    const ae = ve(256, { aDir: 3, aPin: 4, aCol: 3 }, S),
      Ve = new v.ShaderMaterial({
        uniforms: m,
        ...N,
        depthTest: !0,
        vertexShader:
          _ +
          `varying vec2 vQ;void main(){float a=age(),k=clamp(a/1.8,0.,1.);vec3 up=abs(aDir.y)>.95?vec3(1.,0.,0.):vec3(0.,1.,0.);
   vec3 t1=normalize(cross(up,aDir)),t2=cross(aDir,t1);float r=(.01+.05*aPin.x)*(.2+1.3*k);
   gl_Position=projectionMatrix*modelViewMatrix*vec4(aDir*1.003+(t1*position.x+t2*position.y)*r,1.);vQ=position.xy;vCol=aCol;vA=(1.-k)*(1.-k)*step(0.,a)*uFade;}`,
        fragmentShader:
          "varying vec3 vCol;varying float vA;varying vec2 vQ;void main(){float d=length(vQ);gl_FragColor=vec4(vCol*smoothstep(.6,.86,d)*smoothstep(1.,.88,d)*vA*2.4,0.);}",
      }),
      Oe = new v.Mesh(ae.g, Ve);
    ((Oe.frustumCulled = !1), P.add(Oe));
    const be = Qe ? 16384 : 49152,
      Ae = new v.BufferGeometry(),
      oe = {
        aDir: new v.BufferAttribute(new Float32Array(be * 3), 3),
        aPin: new v.BufferAttribute(new Float32Array(be * 4), 4),
        aCol: new v.BufferAttribute(new Float32Array(be * 3), 3),
      };
    for (const n in oe)
      (oe[n].setUsage(v.DynamicDrawUsage), Ae.setAttribute(n, oe[n]));
    (Ae.setAttribute("position", oe.aDir),
      Ae.setDrawRange(0, 0),
      (Ae.boundingSphere = new v.Sphere(new v.Vector3(), 2)));
    let Le = 0,
      Ke = 0;
    const dt = new v.ShaderMaterial({
        uniforms: m,
        ...N,
        depthTest: !0,
        vertexShader:
          _ +
          `void main(){float a=age();vec4 c=modelViewMatrix*vec4(aDir*1.0016,1.);gl_Position=projectionMatrix*c;
   float f=exp(-max(a,0.)*.7);gl_PointSize=(1.5+2.2*f)*uDpr;vCol=aCol*(.55+2.2*f);vA=lifeK(a)*step(0.,a)*uFade;}`,
        fragmentShader:
          "varying vec3 vCol;varying float vA;void main(){vec2 q=gl_PointCoord*2.-1.;float d=dot(q,q);if(d>1.)discard;gl_FragColor=vec4(vCol*exp(-d*3.)*vA,0.);}",
      }),
      J = new v.Points(Ae, dt);
    ((J.frustumCulled = !1), P.add(J));
    const ye = 56,
      Se = new v.BufferGeometry();
    {
      const n = [],
        u = [];
      for (let d = 0; d <= ye; d++)
        if ((n.push(d / ye, -1, 0, d / ye, 1, 0), d < ye)) {
          const M = d * 2;
          u.push(M, M + 1, M + 2, M + 2, M + 1, M + 3);
        }
      (Se.setAttribute(
        "position",
        new v.BufferAttribute(new Float32Array(n), 3),
      ),
        Se.setIndex(u));
    }
    const Ne = ve(512, { aA: 3, aB: 3, aArc: 4, aCol: 3 }, Se),
      ot = new v.ShaderMaterial({
        uniforms: m,
        ...N,
        depthTest: !0,
        vertexShader: `uniform float uNow,uFade,uLife,uDpr;uniform vec2 uRes;attribute vec3 aA,aB,aCol;attribute vec4 aArc;varying vec3 vCol;varying float vA,vS;
  vec3 sl(float t){float w=acos(clamp(dot(aA,aB),-1.,1.));vec3 d=w<1e-4?normalize(mix(aA,aB,t)):(sin((1.-t)*w)*aA+sin(t*w)*aB)/sin(w);return d*(1.002+aArc.y*sin(3.14159265*t));}
  void main(){float s=position.x,a=uNow-aArc.x,T=aArc.z;
   vec4 p=projectionMatrix*modelViewMatrix*vec4(sl(s),1.),q=projectionMatrix*modelViewMatrix*vec4(sl(min(s+.02,1.)),1.),r=projectionMatrix*modelViewMatrix*vec4(sl(max(s-.02,0.)),1.);
   vec2 d=(q.xy/q.w-r.xy/r.w)*uRes;float L=length(d);vec2 dir=L>1e-4?d/L:vec2(1.,0.);p.xy+=vec2(-dir.y,dir.x)*position.y*.85*uDpr*2./uRes*p.w;gl_Position=p;
   float head=clamp(a/T,0.,1.),glow=exp(-max(head-s,0.)*9.)*(1.-smoothstep(0.,.8,a-T));
   vA=step(s,head)*(.16+1.4*glow)*(1.-smoothstep(uLife*.3,uLife,a))*step(0.,a)*uFade;vS=position.y;vCol=aCol;}`,
        fragmentShader:
          "varying vec3 vCol;varying float vA,vS;void main(){float e=1.-abs(vS);gl_FragColor=vec4(vCol*e*vA*1.6,0.);}",
      }),
      Ht = new v.Mesh(Ne.g, ot);
    ((Ht.frustumCulled = !1), P.add(Ht));
    const je = [],
      En = (n) => 0.05 + 0.085 * Math.log10(1 + n);
    function It(n, u) {
      if (n.la !== n.la) return;
      const d = n.meth === 1 ? t.ground : n.meth === 2 ? t.desk : t.unknown,
        M = Be(n.t),
        T = [0, 0, 0];
      Z(n.la, n.lo, T, 0);
      const $ = X(Math.log10(1 + n.n) / 2.5, 0, 1.6),
        R = En(n.n),
        W = g(A);
      if (
        (F(A, "aDir", W, ...T),
        F(A, "aPin", W, R, M, 0, $),
        F(A, "aCol", W, d.r, d.g, d.b),
        (n.pin = W),
        (n.pinB = M),
        je.push({ u: n, d: T, h: R, b: M }),
        je.length > A.n && je.shift(),
        !u)
      ) {
        const fe = g(ae);
        (F(ae, "aDir", fe, ...T),
          F(ae, "aPin", fe, X(Math.log10(1 + n.n) / 3, 0.15, 1.4), M, 0, 0),
          F(ae, "aCol", fe, d.r, d.g, d.b));
      }
      const te = n.pts || [],
        H = te.length / 2,
        ue = Le;
      for (let fe = 0; fe < H; fe++) {
        const me = Le;
        ((Le = (Le + 1) % be),
          (Ke = Math.min(Ke + 1, be)),
          Z(te[fe * 2], te[fe * 2 + 1], oe.aDir.array, me * 3));
        const xe = oe.aPin.array;
        ((xe[me * 4] = 0),
          (xe[me * 4 + 1] = M + fe * 0.012),
          (xe[me * 4 + 2] = 0),
          (xe[me * 4 + 3] = 0));
        const He = oe.aCol.array;
        ((He[me * 3] = d.r * 0.8 + 0.2),
          (He[me * 3 + 1] = d.g * 0.8 + 0.2),
          (He[me * 3 + 2] = d.b * 0.8 + 0.2));
      }
      if (H) {
        const fe =
          ue + H <= be
            ? [[ue, H]]
            : [
                [ue, be - ue],
                [0, ue + H - be],
              ];
        for (const [me, xe] of fe)
          (B(oe.aDir, me * 3, xe * 3),
            B(oe.aPin, me * 4, xe * 4),
            B(oe.aCol, me * 3, xe * 3));
        Ae.setDrawRange(0, Ke);
      }
    }
    function Nn(n, u, d, M) {
      const T = g(Ne),
        $ = [0, 0, 0],
        R = [0, 0, 0];
      (Z(n.la, n.lo, $, 0), Z(u.la, u.lo, R, 0));
      const W = u.meth === 1 ? t.ground : u.meth === 2 ? t.desk : t.unknown;
      (F(Ne, "aA", T, ...$),
        F(Ne, "aB", T, ...R),
        F(
          Ne,
          "aArc",
          T,
          Be(u.t),
          X((d / 6371) * 0.42, 0.012, 0.42),
          1.1 + Math.min(2.2, d / 2500),
          0,
        ),
        F(Ne, "aCol", T, W.r * 0.7 + 0.3, W.g * 0.7 + 0.3, W.b * 0.7 + 0.3));
    }
    const Ot = new v.Scene(),
      Q = {
        uNow: { value: 0 },
        uFade: { value: 0 },
        uW: { value: 1 },
        uH: { value: 1 },
        uSpeed: { value: 10 },
        uLaneH: { value: 18 },
        uTop: { value: 20 },
        uRight: { value: 16 },
        uMask: { value: new v.Vector4(0, 0, 0, 0) },
      },
      Te = ve(
        Qe ? 2e4 : 42e3,
        { aT: 1, aOff: 1, aLane: 1, aCol: 3, aMisc: 2 },
        S,
      ),
      Hn = new v.ShaderMaterial({
        uniforms: Q,
        ...N,
        depthTest: !1,
        vertexShader: `uniform float uNow,uFade,uW,uH,uSpeed,uLaneH,uTop,uRight;uniform vec4 uMask;attribute float aT,aOff,aLane;attribute vec3 aCol;attribute vec2 aMisc;varying vec3 vCol;varying float vA;varying vec2 vQ;
  void main(){float a=uNow-aT,xh=uW-uRight-a*uSpeed,rev=aMisc.y*smoothstep(0.,.9,a),x=xh-aOff,y=uTop+(aLane+.5)*uLaneH;
   vec2 px=vec2(x+position.x*.8,y+position.y*uLaneH*.33*aMisc.x);
   gl_Position=vec4(px.x/uW*2.-1.,1.-px.y/uH*2.,0.,1.);
   float f=exp(-max(a,0.)*1.8)*exp(-aOff*.05);
   float m=(px.x<uMask.z&&px.y<uMask.w)?.08:1.;
   vA=step(aOff,rev+.01)*step(0.,a)*(1.-.55*aOff/max(aMisc.y,1.))*m*smoothstep(-6.,40.,x)*uFade;
   vCol=aCol*(1.+4.*f)+vec3(1.4)*f;vQ=position.xy;}`,
        fragmentShader:
          "varying vec3 vCol;varying float vA;varying vec2 vQ;void main(){float v=1.-vQ.y*vQ.y;gl_FragColor=vec4(vCol*vA*v*(1.-abs(vQ.x)*.6)*1.6,0.);}",
      }),
      Gt = new v.Mesh(Te.g, Hn);
    Gt.frustumCulled = !1;
    const $e = ve(Qe ? 4e3 : 9e3, { aT: 1, aLane: 1, aLen: 1, aCol: 3 }, S),
      In = new v.ShaderMaterial({
        uniforms: Q,
        ...N,
        depthTest: !1,
        vertexShader: `uniform float uNow,uFade,uW,uH,uSpeed,uLaneH,uTop,uRight;uniform vec4 uMask;attribute float aT,aLane,aLen;attribute vec3 aCol;varying vec3 vCol;varying float vA;varying vec2 vQ;
  void main(){float a=uNow-aT,xh=uW-uRight-a*uSpeed,rev=aLen*smoothstep(0.,.9,a),k=position.x*.5+.5;
   vec2 px=vec2(mix(xh-rev-3.,xh+2.,k),uTop+(aLane+.5)*uLaneH+position.y*uLaneH*.5);
   gl_Position=vec4(px.x/uW*2.-1.,1.-px.y/uH*2.,0.,1.);
   float m=(px.x<uMask.z&&px.y<uMask.w)?.08:1.;
   vA=step(0.,a)*m*smoothstep(-6.,40.,px.x)*uFade*(.35+.65*exp(-max(a,0.)*.9));vCol=aCol;vQ=vec2(k,position.y);}`,
        fragmentShader:
          "varying vec3 vCol;varying float vA;varying vec2 vQ;void main(){float v=exp(-vQ.y*vQ.y*5.);gl_FragColor=vec4(vCol*vA*v*mix(.26,.95,vQ.x*vQ.x),0.);}",
      }),
      Ut = new v.Mesh($e.g, In);
    ((Ut.frustumCulled = !1), Ot.add(Ut, Gt));
    let Ge = 24,
      Fe = [],
      ft = new Map(),
      Ue = [],
      Re = 80,
      Xe = 0;
    const On = (n) =>
      Math.round((9 + 17 * Math.log2(1 + n)) * X(h / 850, 0.6, 1.5));
    function _t() {
      const n = Math.max(14, r * 0.03),
        u = Math.max(54, r * 0.11),
        d = r - n - u,
        M = X(Math.round(d / 32), 11, 26);
      ((Ge = Math.max(5, Math.floor(d / M))),
        (Q.uLaneH.value = M),
        (Q.uTop.value = n + (d - Ge * M) / 2),
        (Q.uW.value = h),
        (Q.uH.value = r),
        (Q.uRight.value = Math.max(12, h * 0.018)),
        (Q.uSpeed.value = (h - Q.uRight.value) / Re),
        (Fe.length = Math.min(Fe.length, Ge)));
    }
    function Gn(n, u) {
      let d = ft.get(n);
      if (d != null && d < Ge && Fe[d] && Fe[d].uid === n)
        return ((Fe[d].s = u), d);
      for (let $ = 0; $ < Ge; $++) {
        const R = Fe[$];
        if (!R || u - R.s > Re * 0.36)
          return ((Fe[$] = { uid: n, s: u }), ft.set(n, $), $);
      }
      let M = 0,
        T = 1 / 0;
      for (let $ = 0; $ < Ge; $++) Fe[$].s < T && ((T = Fe[$].s), (M = $));
      return ((Fe[M] = { uid: n, s: u }), ft.set(n, M), M);
    }
    const Un = (n) => [
      n[0],
      n[3],
      n[1] + n[4],
      n[2] + n[5],
      n[6] + n[7] + n[8],
    ];
    function _n(n, u) {
      const d = n.i;
      return (
        (n.i = (n.i + u) % n.n),
        (n.count = Math.min(n.count + u, n.n)),
        (n.g.instanceCount = n.count),
        d
      );
    }
    function qn(n, u, d) {
      for (const M of Object.values(n.A)) {
        const T = M.itemSize;
        u + d <= n.n
          ? B(M, u * T, d * T)
          : (B(M, u * T, (n.n - u) * T), B(M, 0, (u + d - n.n) * T));
      }
    }
    function qt(n) {
      const u = Be(n.t),
        d = On(n.n),
        M = Gn(n.uid, u),
        T = Un(n.a),
        $ = T.reduce((ee, se) => ee + se, 0) || 1,
        R = X(Math.round(d / 3.1), 1, 96),
        W = T.map((ee) => (ee / $) * R),
        te = W.map(Math.floor);
      let H = R - te.reduce((ee, se) => ee + se, 0);
      W.map((ee, se) => [ee - Math.floor(ee), se])
        .sort((ee, se) => se[0] - ee[0])
        .forEach(([, ee]) => {
          H > 0 && T[ee] > 0 && (te[ee]++, H--);
        });
      let ue = et(n.cs + ":" + n.t);
      const fe = () => (
          (ue = Math.imul(ue ^ (ue >>> 15), 2246822507) >>> 0),
          (ue & 65535) / 65536
        ),
        me = [];
      (te.forEach((ee, se) => {
        for (let Ie = 0; Ie < ee; Ie++)
          me.push({ i: se, o: se * 1.1 + fe() * 3.2 });
      }),
        me.sort((ee, se) => ee.o - se.o));
      const xe = [0, 0, 0],
        He = me.length,
        Jt = _n(Te, He),
        _e = Te.A,
        Jn = Te.n;
      for (let ee = 0; ee < He; ee++) {
        const se = (Jt + ee) % Jn,
          Ie = s[me[ee].i];
        ((_e.aT.array[se] = u),
          (_e.aOff.array[se] = ee * (d / R) + (fe() - 0.5) * 0.8),
          (_e.aLane.array[se] = M),
          (_e.aCol.array[se * 3] = Ie.r),
          (_e.aCol.array[se * 3 + 1] = Ie.g),
          (_e.aCol.array[se * 3 + 2] = Ie.b),
          (_e.aMisc.array[se * 2] = ee < 2 ? 1 : 0.45 + 0.55 * fe()),
          (_e.aMisc.array[se * 2 + 1] = d),
          (xe[0] += Ie.r),
          (xe[1] += Ie.g),
          (xe[2] += Ie.b));
      }
      He && qn(Te, Jt, He);
      const pt = g($e),
        bt = Math.max(1, He);
      (F($e, "aT", pt, u),
        F($e, "aLane", pt, M),
        F($e, "aLen", pt, d),
        F($e, "aCol", pt, xe[0] / bt, xe[1] / bt, xe[2] / bt),
        Ue.push({ u: n, lane: M, s: u, len: d }),
        Ue.length > 6e3 && Ue.splice(0, 1e3));
    }
    const Wn = (n) => {
      ((n._full = !0), n.clearUpdateRanges(), (n.needsUpdate = !0), C.add(n));
    };
    function Vn(n) {
      ((Te.i = Te.count = 0),
        (Te.g.instanceCount = 0),
        ($e.i = $e.count = 0),
        ($e.g.instanceCount = 0),
        (Fe = []),
        (ft = new Map()),
        (Ue = []));
      for (const u of n) qt(u);
      for (const u of Object.values(Te.A).concat(Object.values($e.A))) Wn(u);
    }
    ((o.add = (n, u) => {
      (It(n, u), Wt || qt(n));
    }),
      (o.recolor = (n, u) => {
        if (u) {
          It(n, !0);
          return;
        }
        if (n.pin == null || A.A.aPin.array[n.pin * 4 + 1] !== n.pinB) return;
        const d = n.meth === 1 ? t.ground : n.meth === 2 ? t.desk : t.unknown;
        F(A, "aCol", n.pin, d.r, d.g, d.b);
      }),
      (o.arc = (n, u, d, M) => Nn(n, u, d, M)));
    let Wt = !0;
    o.ready = () => {
      Wt = !1;
      const n = pe();
      Vn(
        i.shown
          .filter((u) => u.t >= n - Re * 1e3 * 4 && u.t <= n)
          .sort((u, d) => u.t - d.t),
      );
    };
    const k = {
        yaw: 0,
        pitch: 0.36,
        dist: 4.4,
        zoom: 1,
        vy: 0,
        vp: 0,
        hold: 0,
        tw: null,
        home: null,
        px: 0,
        py: 0,
        ov: "",
      },
      Vt = (n) => -Math.PI / 2 - n * ne;
    function Kn() {
      const n = pe();
      let u = 0,
        d = 0,
        M = 0,
        T = 0;
      for (let $ = i.shown.length - 1; $ >= 0; $--) {
        const R = i.shown[$];
        if (R.t < n - 3e5) break;
        if (R.la !== R.la) continue;
        const W = 1 + Math.log2(1 + R.n);
        ((u += Math.cos(R.lo * ne) * W),
          (d += Math.sin(R.lo * ne) * W),
          (M += R.la * W),
          (T += W));
      }
      return T
        ? { lon: Math.atan2(d, u) / ne, lat: X((M / T) * 0.62, -10, 36) }
        : { lon: 12, lat: 22 };
    }
    function jn(n, u, d = 2600) {
      let M = Vt(n);
      for (; M - k.yaw > Math.PI;) M -= Math.PI * 2;
      for (; k.yaw - M > Math.PI;) M += Math.PI * 2;
      k.tw = { y0: k.yaw, p0: k.pitch, y1: M, p1: u * ne, t0: ge(), d };
    }
    ((o.aim = (n, u) => {
      if (n == null) {
        const d = Kn();
        ((n = d.lon), (u = d.lat));
      }
      jn(n, u);
    }),
      (o.reset = () => {
        ((k.zoom = 1),
          (k.vy = k.vp = 0),
          (k.hold = 0),
          (k.px = k.py = 0),
          (Xe = 0),
          (Re = 80),
          _t(),
          o.aim());
      }),
      (o.pan = (n, u) => {
        ((k.hold = ge()),
          (k.px = X(k.px + n, -h * 0.36, h * 0.36)),
          (k.py = X(k.py + u, -r * 0.36, r * 0.36)));
      }),
      (o.zoomTo = (n) => {
        ((k.tw = null), (k.hold = ge()), (k.zoom = X(n, 0.55, 1.9)));
      }),
      (o.spanTo = (n) => {
        ((Re = X(n, 25, 300)), (Q.uSpeed.value = (h - Q.uRight.value) / Re));
      }),
      (o.spanS = () => Re),
      (o.nudge = (n, u, d) => {
        ((k.tw = null),
          (k.hold = ge()),
          (k.vy += n),
          (k.vp += u),
          d && (k.zoom = X(k.zoom * d, 0.55, 1.9)));
      }),
      (o.scrub = (n) => {
        Xe = X(Xe + n, 0, 900);
      }),
      (o.span = (n) => {
        ((Re = X(Re * n, 25, 300)),
          (Q.uSpeed.value = (h - Q.uRight.value) / Re));
      }),
      (k.yaw = Vt(12)));
    function Qn(n, u) {
      if (k.tw) {
        const te = X((n - k.tw.t0) / k.tw.d, 0, 1),
          H = te < 0.5 ? 4 * te * te * te : 1 - Math.pow(-2 * te + 2, 3) / 2;
        ((k.yaw = Xt(k.tw.y0, k.tw.y1, H)),
          (k.pitch = Xt(k.tw.p0, k.tw.p1, H)),
          te >= 1 && (k.tw = null));
      } else {
        j ||
          ((k.yaw += k.vy * u), (k.pitch = X(k.pitch + k.vp * u, -1.1, 1.1)));
        const te = Math.exp(-u * 3.2);
        ((k.vy *= te),
          (k.vp *= te),
          Ce.auto && n - k.hold > 6e3 && !j && (k.yaw += 0.055 * u));
      }
      const d = (z.fov * ne) / 2,
        M = (Math.min(r * 0.32, h * 0.37) * k.zoom) / (r / 2);
      ((k.dist = Math.sqrt(
        1 + 1 / Math.pow(Math.min(M, 1.6) * Math.tan(d), 2),
      )),
        z.position.set(0, 0, k.dist),
        z.lookAt(0, 0, 0));
      const T = h / r < 0.95 ? Math.round(r * 0.13) : 0,
        $ = Math.round(k.px),
        R = T + Math.round(k.py),
        W = $ + "," + R;
      ((k.oy = R),
        (k.ox = $),
        W !== k.ov &&
          ((k.ov = W),
          $ || R ? z.setViewOffset(h, r, -$, -R, h, r) : z.clearViewOffset()),
        P.rotation.set(k.pitch, k.yaw, 0, "XYZ"),
        ce.rotation.copy(P.rotation));
    }
    const wt = D("#center");
    function ht() {
      const n = wt.getBoundingClientRect();
      ((h = Math.max(2, Math.round(n.width))),
        (r = Math.max(2, Math.round(n.height))),
        a.setPixelRatio(p),
        a.setSize(h, r, !1));
      const u = Math.round(h * p),
        d = Math.round(r * p);
      c.setSize(u, d);
      let M = u,
        T = d;
      for (const $ of l)
        ((M = Math.max(1, M >> 1)), (T = Math.max(1, T >> 1)), $.setSize(M, T));
      ((z.aspect = h / r),
        (k.ov = ""),
        z.updateProjectionMatrix(),
        m.uRes.value.set(u, d),
        (m.uDpr.value = p),
        (E.uniforms.uDpr.value = p),
        _t(),
        (o.W = h),
        (o.H = r),
        (o.dpr = p));
    }
    ((o.resize = ht), new ResizeObserver(() => ht()).observe(wt));
    let yt = 0,
      xt = 0,
      Kt = performance.now() + 4e3,
      jt = 0;
    const Yn = D("#hero");
    function Mt(n, u) {
      ((le.material = n), a.setRenderTarget(u), a.render(L, Y));
    }
    ((o.render = (n, u, d) => {
      const M = performance.now();
      ((m.uNow.value = Be(u)),
        (Q.uNow.value = Be(u) - Xe),
        (E.uniforms.uTime.value = n / 1e3));
      const T = o.fade;
      if (((m.uFade.value = T[0]), (Q.uFade.value = T[1]), n > jt)) {
        jt = n + 500;
        const H = Yn.getBoundingClientRect(),
          ue = wt.getBoundingClientRect();
        Q.uMask.value.set(0, 0, H.right - ue.left + 14, H.bottom - ue.top + 8);
      }
      Qn(n, d);
      for (const H of C) H._full && (H.clearUpdateRanges(), (H._full = !1));
      (C.clear(),
        a.setRenderTarget(c),
        a.clear(!0, !0, !1),
        T[0] > 0.002 && a.render(G, z),
        T[1] > 0.002 && a.render(Ot, Y));
      const $ = f.uniforms.uStretch.value;
      ($.set(1 + 4.2 * T[1], 1 - 0.45 * T[1]),
        I.uniforms.uStretch.value.copy($),
        (f.uniforms.uThresh.value = 0.85 - 0.4 * T[1]));
      let R = c.texture,
        W = c.width,
        te = c.height;
      for (let H = 0; H < l.length; H++)
        ((f.uniforms.tSrc.value = R),
          f.uniforms.uTexel.value.set(1 / W, 1 / te),
          (f.uniforms.uFirst.value = H ? 0 : 1),
          Mt(f, l[H]),
          (R = l[H].texture),
          (W = l[H].width),
          (te = l[H].height));
      for (let H = l.length - 2; H >= 0; H--)
        ((I.uniforms.tSrc.value = l[H + 1].texture),
          I.uniforms.uTexel.value.set(1 / l[H + 1].width, 1 / l[H + 1].height),
          Mt(I, l[H]));
      if (
        ((E.uniforms.tScene.value = c.texture),
        (E.uniforms.tBloom.value = l[0].texture),
        (E.uniforms.uBloom.value = 0.55 + 0.95 * T[1]),
        Mt(E, null),
        (yt += performance.now() - M + (d * 1e3 > 40 ? 8 : 0)),
        xt++,
        n > Kt && Ye == null)
      ) {
        const H = yt / xt;
        ((yt = xt = 0),
          (Kt = n + 3e3),
          H > 26 && p > 1
            ? ((p = Math.max(1, p - 0.25)), ht())
            : H < 9 && p < y && ((p = Math.min(y, p + 0.25)), ht()));
      }
    }),
      (p = Math.min(y, Qe ? 2 : 1.5)));
    const st = new v.Vector3(),
      Qt = new v.Vector3(),
      Zn = new v.Vector3();
    function Yt(n, u, d) {
      return (
        st
          .set(n[0], n[1], n[2])
          .multiplyScalar(1.0015 + u)
          .applyMatrix4(P.matrixWorld),
        Qt.set(n[0], n[1], n[2]).transformDirection(P.matrixWorld),
        (d.f = Qt.dot(Zn.copy(z.position).sub(st).normalize())),
        st.project(z),
        (d.x = (st.x * 0.5 + 0.5) * h),
        (d.y = (-st.y * 0.5 + 0.5) * r),
        d
      );
    }
    o.screenOf = Yt;
    const Zt = (n, u, d) => {
      const M = X((d - n) / (u - n), 0, 1);
      return M * M * (3 - 2 * M);
    };
    return (
      (o.pinH = (n) => {
        const u = Be(pe()) - n.b;
        return n.h * Zt(0, 1.1, u) * (0.5 + 0.5 * (1 - Zt(210, 600, u)));
      }),
      (o.pick = (n, u) => {
        if (o.view === 0) {
          let $ = null,
            R = 196;
          const W = {},
            te = Be(pe());
          for (let H = je.length - 1; H >= 0 && H > je.length - 2500; H--) {
            const ue = je[H];
            if (
              te - ue.b > 600 ||
              te < ue.b ||
              (Yt(ue.d, o.pinH(ue), W), W.f < 0.08)
            )
              continue;
            const fe = (W.x - n) ** 2 + (W.y - u) ** 2;
            fe < R && ((R = fe), ($ = ue.u));
          }
          return $;
        }
        const d = Be(pe()) - Xe,
          M = Q.uLaneH.value,
          T = Math.floor((u - Q.uTop.value) / M);
        if (T < 0 || T >= Ge) return null;
        for (let $ = Ue.length - 1; $ >= 0; $--) {
          const R = Ue[$];
          if (R.lane !== T || R.s > d) continue;
          const W = h - Q.uRight.value - (d - R.s) * Q.uSpeed.value;
          if (W < -R.len) break;
          if (n <= W + 4 && n >= W - R.len - 4) return R.u;
        }
        return null;
      }),
      (o.streakHead = (n) => {
        const u = Be(pe()) - Xe;
        return {
          x: h - Q.uRight.value - (u - n.s) * Q.uSpeed.value,
          y: Q.uTop.value + (n.lane + 0.5) * Q.uLaneH.value,
        };
      }),
      (o.streaks = () => Ue),
      (o.pins = () => je),
      (o.cam = k),
      (o.debug = () => {
        const n = Te.A.aT.array,
          u = Math.min(Te.count, 5);
        return {
          ticks: Te.count,
          bodies: $e.count,
          streaks: Ue.length,
          laneN: Ge,
          W: h,
          H: r,
          uW: Q.uW.value,
          uNow: Q.uNow.value,
          aT: [...n.slice(0, u)],
          speed: Q.uSpeed.value,
          fade: o.fade.slice(),
          info: { ...a.info.render },
        };
      }),
      (o.radius = () => {
        const n = (z.fov * ne) / 2;
        return ((Math.tan(Math.asin(1 / k.dist)) / Math.tan(n)) * r) / 2;
      }),
      (o.center = () => ({ x: h / 2 + (k.ox || 0), y: r / 2 + (k.oy || 0) })),
      (o.view = 0),
      (o.fade = [1, 0]),
      o
    );
  })(),
  An = (() => {
    const e = D("#labels"),
      t = D("#leaders"),
      s = [],
      a = Qe ? 2 : 5;
    let o = 0;
    const w = () => {
      const f = D("#center").getBoundingClientRect(),
        I = [];
      for (const E of ["#hero", ".ctl", ".cfoot"])
        for (const N of document.querySelectorAll(E)) {
          const G = N.getBoundingClientRect();
          G.width &&
            I.push({
              x0: G.left - f.left - 8,
              y0: G.top - f.top - 8,
              x1: G.right - f.left + 8,
              y1: G.bottom - f.top + 8,
            });
        }
      return I;
    };
    let h = [],
      r = 0;
    const p = (f, I) =>
      f.x0 < I.x1 && f.x1 > I.x0 && f.y0 < I.y1 && f.y1 > I.y0;
    function y(f, I) {
      const E = document.createElement("div");
      E.className = "lb" + (Qe ? " small" : "") + (I === 1 ? " bar" : "");
      const N = f.meth === 1 ? "#ff6fb1" : f.meth === 2 ? "#5b9bff" : "#9fbfff",
        G =
          f.cm ||
          (f.ed
            ? `${de(f.n)} change${f.n > 1 ? "s" : ""} with ${f.ed}`
            : `${de(f.n)} change${f.n > 1 ? "s" : ""}`),
        z = f.a[0] + f.a[3] + f.a[6],
        P = f.a[1] + f.a[4] + f.a[7],
        m = f.a[2] + f.a[5] + f.a[8],
        V = kt(f.la, f.lo),
        ke =
          f.meth === 1
            ? "On the ground"
            : f.meth === 2
              ? "At a desk"
              : "Uploaded";
      ((E.innerHTML = `<div class="t">${I === 0 ? tt.pin : tt.bar}<span dir="auto">${he(G)}</span></div><div class="s">${I === 0 ? `<i style="background:${N};box-shadow:0 0 6px ${N}"></i>${ke}${f.ed ? " with " + he(f.ed) : ""}${V ? " \xB7 " + he(V) : ""}` : `Upload from ${he(f.user)}${f.ed ? " \xB7 " + he(f.ed) : ""}`}<br>${I === 0 ? he(f.user) + " \xB7 " : ""}+${de(z)} ~${de(P)} \u2212${de(m)}${I === 1 && V ? " \xB7 " + he(V) : ""}</div>`),
        e.appendChild(E));
      const ce = document.createElementNS("http://www.w3.org/2000/svg", "line");
      return (
        t.appendChild(ce),
        {
          u: f,
          e: E,
          ln: ce,
          view: I,
          born: ge(),
          w: E.offsetWidth,
          h: E.offsetHeight,
          x: 0,
          y: 0,
          on: !1,
          dx: 16,
          dy: -1,
        }
      );
    }
    const c = [];
    function l(f) {
      (f.e.classList.remove("on"), f.ln.remove());
      const I = f.last;
      (I && c.push({ r: I, until: ge() + 650 }),
        setTimeout(() => f.e.remove(), 650));
    }
    function b() {
      for (; s.length;) l(s.pop());
    }
    const L = (f, I) =>
      !(
        f.x0 < 6 ||
        f.y0 < 6 ||
        f.x1 > x.W - 6 ||
        f.y1 > x.H - 6 ||
        h.some((E) => p(E, f)) ||
        I.some((E) => p(E, f))
      );
    function Y(f, I, E, N) {
      if (f.view === 0) {
        const { x: z, y: P } = x.center(),
          m = x.radius();
        let V = Math.atan2(E - P, I - z);
        const ke = f.a != null ? [[f.a, f.off]] : [];
        for (const ce of [22, 58, 104])
          for (const Z of [0, 0.18, -0.18, 0.4, -0.4, 0.65, -0.65, 0.95, -0.95])
            ke.push([V + Z, ce]);
        for (const [ce, Z] of ke) {
          const ve = z + Math.cos(ce) * (m + Z),
            g = P + Math.sin(ce) * (m + Z),
            C = Math.cos(ce) >= 0,
            B = {
              x0: C ? ve : ve - f.w,
              y0: g - f.h * 0.42,
              x1: C ? ve + f.w : ve,
              y1: g + f.h * 0.58,
            };
          if (L(B, N)) return ((f.a = ce), (f.off = Z), (f.right = C), B);
        }
        return ((f.a = null), null);
      }
      const G = [
        [16, -f.h - 10],
        [-f.w - 16, -f.h - 10],
        [16, 10],
        [-f.w - 16, 10],
      ];
      for (const [z, P] of [[f.dx, f.dy], ...G]) {
        if (P === -1) continue;
        const m = { x0: I + z, y0: E + P, x1: I + z + f.w, y1: E + P + f.h };
        if (L(m, N)) return ((f.dx = z), (f.dy = P), m);
      }
      return null;
    }
    function le(f, I) {
      const E = new Set(s.map((G) => G.u)),
        N = [];
      if (f === 0) {
        const G = {},
          z = x.pins();
        for (let P = z.length - 1; P >= 0 && P > z.length - 400; P--) {
          const m = z[P],
            V = Be(I) - m.b;
          V < 0.6 ||
            V > 90 ||
            E.has(m.u) ||
            (x.screenOf(m.d, x.pinH(m), G),
            !(G.f < 0.35) &&
              N.push({
                u: m.u,
                p: m,
                score: Math.log2(1 + m.u.n) * 1.6 + (m.u.cm ? 2.2 : 0) - V / 30,
              }));
        }
      } else {
        const G = x.streaks();
        for (let z = G.length - 1; z >= 0 && z > G.length - 500; z--) {
          const P = G[z];
          if (E.has(P.u)) continue;
          const m = x.streakHead(P);
          m.x < x.W * 0.35 ||
            m.x > x.W - 30 ||
            N.push({
              u: P.u,
              q: P,
              score: Math.log2(1 + P.u.n) * 1.8 + (P.u.cm ? 1.5 : 0),
            });
        }
      }
      return N.sort((G, z) => z.score - G.score);
    }
    function re(f, I) {
      const E = x.view,
        N = x.fade[E];
      f > r && ((h = w()), (r = f + 700));
      for (let m = s.length - 1; m >= 0; m--) {
        const V = s[m];
        (V.view !== E || f - V.born > (E === 0 ? 11e3 : 8e3)) &&
          (l(V), s.splice(m, 1));
      }
      if (N > 0.9 && f > o && s.length < a && i.ready) {
        o = f + (E === 0 ? 1700 : 1300);
        const m = le(E, I)[0];
        if (m) {
          const V = y(m.u, E);
          ((V.p = m.p), (V.q = m.q), s.push(V));
        }
      }
      const G = ge();
      for (let m = c.length - 1; m >= 0; m--) c[m].until < G && c.splice(m, 1);
      const z = c.map((m) => m.r),
        P = {};
      for (const m of s) {
        let V,
          ke,
          ce = !0;
        if (m.view === 0)
          (x.screenOf(m.p.d, x.pinH(m.p), P),
            (V = P.x),
            (ke = P.y),
            (ce = P.f > 0.2));
        else {
          const g = x.streakHead(m.q);
          ((V = g.x), (ke = g.y), (ce = g.x > 8 && g.x < x.W));
        }
        const Z = ce ? Y(m, V, ke, z) : null;
        if (Z) {
          (m.view === 0 && m.e.classList.toggle("r", !m.right),
            z.push(Z),
            (m.e.style.transform = `translate(${Z.x0.toFixed(1)}px,${Z.y0.toFixed(1)}px)`));
          const g =
              m.view === 0
                ? m.right
                  ? Z.x0 - 4
                  : Z.x1 + 4
                : m.dx > 0
                  ? Z.x0 - 3
                  : Z.x1 + 3,
            C =
              m.view === 0 ? Z.y0 + m.h * 0.3 : m.dy < 0 ? Z.y1 - 4 : Z.y0 + 8;
          (m.ln.setAttribute("x1", V.toFixed(1)),
            m.ln.setAttribute("y1", ke.toFixed(1)),
            m.ln.setAttribute("x2", g.toFixed(1)),
            m.ln.setAttribute("y2", C.toFixed(1)));
        }
        m.last = Z;
        const ve = !!Z && N > 0.6;
        ve !== m.on &&
          ((m.on = ve),
          m.e.classList.toggle("on", ve),
          (m.ln.style.opacity = ve ? 1 : 0));
      }
    }
    return { step: re, clear: b };
  })(),
  we = D("#gl"),
  Je = D("#tip");
let j = null,
  Ln = null,
  Tn = 0;
function ct(e, t, s) {
  if (!e) {
    (Je.classList.remove("on"), we.classList.remove("hot"));
    return;
  }
  const a = e.a[0] + e.a[3] + e.a[6],
    o = e.a[1] + e.a[4] + e.a[7],
    w = e.a[2] + e.a[5] + e.a[8];
  Je.innerHTML = `<b dir="auto">${he(e.cm || "Upload")}</b>${he(e.user)}${e.ed ? " \xB7 " + he(e.ed) : ""}<br><span class="k">${new Date(e.t).toLocaleTimeString()}</span> \xB7 +${de(a)} ~${de(o)} \u2212${de(w)}${e.la === e.la ? "<br>" + he(kt(e.la, e.lo)) : ""}<span class="go">Click to open changeset ${e.cs} \u2197</span>`;
  const h = x.W,
    r = x.H,
    p = Je.offsetWidth,
    y = Je.offsetHeight;
  ((Je.style.left = X(t + 16, 8, h - p - 8) + "px"),
    (Je.style.top =
      X(s + 16 > r - y - 8 ? s - y - 14 : s + 16, 8, r - y - 8) + "px"),
    Je.classList.add("on"),
    we.classList.add("hot"));
}
const De = new Map();
let qe = null;
const Dn = () => {
  const [e, t] = [...De.values()];
  return Math.hypot(e.x - t.x, e.y - t.y) || 1;
};
(we.addEventListener("pointerdown", (e) => {
  if (!(e.button > 2)) {
    try {
      we.setPointerCapture(e.pointerId);
    } catch {}
    if (
      (e.isPrimary && De.clear(),
      De.set(e.pointerId, { x: e.clientX, y: e.clientY }),
      (x.cam.vy = x.cam.vp = 0),
      ct(null),
      De.size === 2)
    ) {
      ((qe = { d0: Dn(), z0: x.cam.zoom, s0: x.spanS() }), (j = null));
      return;
    }
    De.size > 2 ||
      ((j = {
        x: e.clientX,
        y: e.clientY,
        x0: e.clientX,
        y0: e.clientY,
        moved: 0,
        t: performance.now(),
        vy: 0,
        vp: 0,
        btn: e.button,
      }),
      we.classList.add("drag"));
  }
}),
  we.addEventListener("pointermove", (e) => {
    const t = we.getBoundingClientRect(),
      s = e.clientX - t.left,
      a = e.clientY - t.top;
    if (
      (De.has(e.pointerId) &&
        De.set(e.pointerId, { x: e.clientX, y: e.clientY }),
      qe && De.size >= 2)
    ) {
      const w = Dn() / qe.d0;
      x.view === 0 ? x.zoomTo(qe.z0 * w) : x.spanTo(qe.s0 / w);
      return;
    }
    if (j) {
      const w = e.clientX - j.x,
        h = e.clientY - j.y;
      if (
        ((j.x = e.clientX),
        (j.y = e.clientY),
        (j.moved += Math.abs(w) + Math.abs(h)),
        x.view !== 0)
      )
        x.scrub((w * 80) / x.W);
      else if (j.btn === 2) x.pan(w, h);
      else {
        const r = x.cam,
          p = (w * 0.0052) / r.zoom,
          y = (h * 0.0045) / r.zoom,
          c = performance.now(),
          l = Math.max(8, c - j.t) / 1e3;
        ((j.t = c),
          (r.tw = null),
          (r.hold = ge()),
          (r.yaw += p),
          (r.pitch = X(r.pitch + y, -1.1, 1.1)),
          (j.vy = j.vy * 0.6 + (p / l) * 0.4),
          (j.vp = j.vp * 0.6 + (y / l) * 0.4));
      }
      return;
    }
    const o = performance.now();
    o - Tn < 30 || ((Tn = o), (Ln = x.pick(s, a)), ct(Ln, s, a));
  }));
const xa = (e) => {
  if ((De.delete(e.pointerId), qe)) {
    (De.size < 2 && (qe = null), (j = null), we.classList.remove("drag"));
    return;
  }
  if (!j) return;
  const t = j.moved < 5 && j.btn === 0;
  if (
    (x.view === 0 &&
      j.btn !== 2 &&
      performance.now() - j.t < 90 &&
      ((x.cam.vy = X(j.vy * 0.55, -2.2, 2.2)),
      (x.cam.vp = X(j.vp * 0.55, -1.6, 1.6))),
    (j = null),
    we.classList.remove("drag"),
    t)
  ) {
    const s = we.getBoundingClientRect(),
      a = x.pick(e.clientX - s.left, e.clientY - s.top);
    a && Dt(pn(a.cs));
  }
};
(we.addEventListener("pointerup", xa),
  we.addEventListener("pointercancel", (e) => {
    (De.delete(e.pointerId),
      De.size < 2 && (qe = null),
      (j = null),
      we.classList.remove("drag"));
  }),
  we.addEventListener("pointerleave", () => {
    j || ct(null);
  }),
  we.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const t = Math.exp(-e.deltaY * 0.0012);
      x.view === 0 ? x.nudge(0, 0, t) : x.span(1 / t);
    },
    { passive: !1 },
  ),
  we.addEventListener("contextmenu", (e) => e.preventDefault()));
function nt(e, t) {
  if (e === x.view) return;
  ((x.view = e),
    An.clear(),
    ct(null),
    D("#vGlobe").setAttribute("aria-pressed", e === 0),
    D("#vBars").setAttribute("aria-pressed", e === 1));
  const s = D("#hero");
  (s.classList.add("swap"),
    setTimeout(() => {
      (Sn(e), Cn(pe()), s.classList.remove("swap"));
    }, 420),
    e === 0 && !t && x.aim(),
    t && at(!1),
    (Ce.next = ge() + Ce.span));
}
function at(e) {
  ((Ce.auto = e),
    (Ce.next = ge() + Ce.span),
    (D("#pause").innerHTML = e
      ? '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2.5" y="1.8" width="2.4" height="8.4" rx=".6"/><rect x="7.1" y="1.8" width="2.4" height="8.4" rx=".6"/></svg>'
      : '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3.5 1.8v8.4L10 6z"/></svg>'),
    D("#pause").setAttribute(
      "aria-label",
      e ? "Pause the cycle" : "Play the cycle",
    ),
    (D("#pause").title = e ? "Pause the cycle (C)" : "Play the cycle (C)"));
}
((D("#vGlobe").onclick = () => nt(0, !0)),
  (D("#vBars").onclick = () => nt(1, !0)),
  (D("#pause").onclick = () => at(!Ce.auto)));
const We = D("#dlg"),
  Pt = () => {
    We.open
      ? We.close()
      : ((D("#dlgLag").textContent = $n() || "two minutes"), We.showModal());
  };
((D("#help").onclick = Pt),
  (D("#gear").onclick = Pt),
  (D("#dlgX").onclick = () => We.close()),
  We.addEventListener("click", (e) => {
    e.target === We && We.close();
  }));
const ut = new Set();
(addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (
    [
      "w",
      "a",
      "s",
      "d",
      "q",
      "e",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "+",
      "=",
      "-",
      "_",
    ].includes(t)
  ) {
    (ut.add(t), t.startsWith("Arrow") && e.preventDefault());
    return;
  }
  e.repeat ||
    (t === "1"
      ? nt(0, !0)
      : t === "2"
        ? nt(1, !0)
        : t === "c" || t === " "
          ? (e.preventDefault(), at(!Ce.auto))
          : t === "r"
            ? (x.reset(), at(!0))
            : t === "t" && e._houseKey
              ? gn()
              : t === "/"
                ? (e.preventDefault(), D("#app").classList.toggle("bare"))
                : t === "?"
                  ? Pt()
                  : t === "Escape" && ct(null));
}),
  addEventListener("keyup", (e) => {
    ut.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  }),
  addEventListener("blur", () => ut.clear()));
function Ma(e) {
  if (!ut.size) return;
  const t = (...a) => a.some((o) => ut.has(o));
  if (x.view === 0) {
    const a =
        (t("a", "ArrowLeft") ? -1 : 0) +
        (t("d", "ArrowRight") ? 1 : 0) +
        (t("q") ? -1.6 : 0) +
        (t("e") ? 1.6 : 0),
      o = (t("w", "ArrowUp") ? 1 : 0) + (t("s", "ArrowDown") ? -1 : 0);
    (a || o) && x.nudge(a * 2.4 * e, o * 2 * e, 0);
  } else {
    const a = (t("a", "ArrowLeft") ? 1 : 0) + (t("d", "ArrowRight") ? -1 : 0);
    a && x.scrub(a * 40 * e);
  }
  const s = (t("+", "=") ? 1 : 0) + (t("-", "_") ? -1 : 0);
  s &&
    (x.view === 0
      ? x.nudge(0, 0, Math.exp(s * 1.2 * e))
      : x.span(Math.exp(-s * 1.2 * e)));
}
const $n = () => {
  const e = (Date.now() - pe()) / 1e3;
  if (!O.on || e < 15 || e > 1800) return "";
  const t = Math.floor(e / 60),
    s = Math.round((e - t * 60) / 10) * 10;
  return (t ? t + " min " : "") + (s ? (s === 60 ? "" : s + " s") : "");
};
let gt = performance.now(),
  Ca = 0,
  Fn = 0,
  zt = 0,
  Rt = 0,
  Bt = 0,
  Pn = 0,
  zn = 0,
  Et = !0;
function Nt(e) {
  Et && (requestAnimationFrame(Nt), Rn(e));
}
function Rn(e) {
  const t = X((e - gt) / 1e3, 0, 0.1);
  gt = e;
  let s = pe(e);
  if (
    (O.on &&
      O.horizon &&
      s > O.horizon - 1500 &&
      (Lt(O.horizon - 1500, e),
      (O.rate = 0),
      (O.waiting = !0),
      (s = O.horizon - 1500)),
    O.on && (ia(s), ra(s)),
    Ce.auto && !We.open)
  ) {
    const a = Ce.next - e;
    (a <= 0 && nt(x.view ? 0 : 1, !1),
      (D("#cd").textContent = Math.max(1, Math.ceil(a / 1e3)) + " sec"));
  } else D("#cd").textContent = "Paused";
  if (
    ((x.fade[0] +=
      ((x.view === 0 ? 1 : 0) - x.fade[0]) * (1 - Math.exp(-t * 5))),
    (x.fade[1] +=
      ((x.view === 1 ? 1 : 0) - x.fade[1]) * (1 - Math.exp(-t * 5))),
    Ma(t),
    x.ok && !document.hidden && (x.render(e, s, t), An.step(e, s)),
    $t.step(e),
    Sa.step(e),
    e > zn)
  ) {
    if (((zn = e + 250), O.on)) {
      const w = new Date(s);
      ((D("#clk").textContent =
        `${Pe(w.getHours())}.${Pe(w.getMinutes())}.${Pe(w.getSeconds())}`),
        (D("#day").textContent = fa.format(w)));
    }
    const a = $n();
    D("#lag").textContent = O.waiting
      ? "Live \xB7 waiting for the next minute"
      : a
        ? `Live \xB7 ${a} behind`
        : "Live";
    const o = D("#brand");
    ((o.className =
      "brand " +
      (i.status === "down" ? "down" : i.ready && !O.waiting ? "" : "wait")),
      (ie.today || e > Fn) && ((ie.today = !1), (Fn = e + 1e3), Cn(s)),
      i.ready &&
        i.base &&
        D("#app").classList.contains("stale") &&
        D("#app").classList.remove("stale"));
  }
  (((ie.trend && e > zt) || e > zt + 5e3) &&
    ((ie.trend = !1), (zt = e + 2500), ha(s)),
    ((ie.graph && e > Rt) || e > Rt + 4e3) &&
      ((ie.graph = !1), (Rt = e + 2e3), va(s)),
    ((ie.parts && e > Bt) || e > Bt + 6e3) &&
      ((ie.parts = !1), (Bt = e + 4e3), ma(s), ga(s)),
    e > Pn && i.ready && ((Pn = e + 1e4), wa()));
  for (const a of Object.values(Me)) a.step(t);
  !Bn &&
    x.texReady &&
    i.shown.length > 20 &&
    e - ba > 300 &&
    ((Bn = !0),
    D("#cover").classList.add("gone"),
    D("#cover0").classList.add("gone"));
}
let Bn = !x.ok,
  ba = performance.now();
((window.__loop = (e) => {
  e !== Et &&
    ((Et = e),
    e &&
      (Ye != null && O.on && ((O.rc = pe(Ye)), (O.p = performance.now())),
      (Ye = null),
      requestAnimationFrame((t) => {
        ((gt = t), Nt(t));
      })));
}),
  (window.__step = (e) => {
    if (Ye == null && O.on) {
      const t = performance.now();
      ((O.rc = pe(t)), (O.p = e));
    }
    ((Ye = e), Rn(e));
  }),
  (window.__data = {
    M: i,
    R: O,
    GL: x,
    cycle: Ce,
    view: (e) => nt(e, !0),
    auto: at,
    aim: (e, t) => x.aim(e, t),
    bare: (e) => D("#app").classList.toggle("bare", e),
    stats: () => ({
      shown: i.shown.length,
      pend: i.pend.length,
      cs: i.csAll.size,
      live: i.csLive.size,
      closed: i.closed.length,
      rc: new Date(pe()).toISOString(),
      lag: (Date.now() - pe()) / 1e3,
      horizon: new Date(O.horizon).toISOString(),
      base: i.base,
      max: i.max,
      maxCs: i.maxCs,
      status: i.status,
      msg: i.msg,
      dpr: x.dpr,
      ready: i.ready,
    }),
  }));
const Sa = (() => {
  const e = D("#sky"),
    t = e.getContext("2d");
  let s = [],
    a = 0,
    o = 0,
    w = 1,
    h = 0;
  function r() {
    ((w = Math.min(2, devicePixelRatio || 1)),
      (a = innerWidth),
      (o = innerHeight),
      (e.width = a * w),
      (e.height = o * w));
    let y = et("sky" + a + "x" + o);
    const c = () => (
      (y = Math.imul(y ^ (y >>> 15), 2246822507) >>> 0),
      (y & 65535) / 65536
    );
    ((s = Array.from({ length: Math.round((a * o) / 5200) }, () => ({
      x: c() * a,
      y: c() * o,
      s: 0.45 + c() * c() * 1.3,
      a: 0.18 + c() * 0.55,
      tw: c() < 0.22 ? 0.6 + c() * 2.2 : 0,
      p: c() * 6.28,
    }))),
      p(0));
  }
  function p(y) {
    t.clearRect(0, 0, e.width, e.height);
    for (const c of s) {
      const l = c.a * (c.tw ? 0.55 + 0.45 * Math.sin(y * c.tw + c.p) : 1);
      ((t.fillStyle = `rgba(205,222,255,${l.toFixed(3)})`),
        t.beginPath(),
        t.arc(c.x * w, c.y * w, c.s * w, 0, 6.283),
        t.fill());
    }
  }
  return (
    addEventListener("resize", r),
    r(),
    {
      step(y) {
        y > h && !document.hidden && ((h = y + 140), p(y / 1e3));
      },
    }
  );
})();
(Sn(0),
  at(Ce.auto),
  ya(),
  "DecompressionStream" in window
    ? ca()
    : ((D("#why").textContent =
        "This browser cannot unpack the live feed (it needs DecompressionStream). Try a current Chrome, Safari or Firefox."),
      (i.status = "down")),
  (Ce.next = ge() + Ce.span + 6e3),
  requestAnimationFrame((e) => {
    ((gt = e), Nt(e));
  }));
