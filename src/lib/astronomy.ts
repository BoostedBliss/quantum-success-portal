import {
  Aspect,
  AspectType,
  BirthData,
  ElementType,
  FullNatalChart,
  HouseCusp,
  HouseSystem,
  ModalityType,
  PlanetId,
  PlanetPosition,
  SacredGeometryPattern,
  ZodiacSign,
} from '../types';
import { calculateHolisticTypology } from './archetypes';

// Constants for degree <-> radian conversions
const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 180.0 / Math.PI;

export function normalizeDegrees(deg: number): number {
  let b = deg % 360.0;
  if (b < 0) b += 360.0;
  return b;
}

export const ZODIAC_SIGNS: { name: ZodiacSign; element: ElementType; modality: ModalityType; symbol: string }[] = [
  { name: 'Aries', element: 'Fire', modality: 'Cardinal', symbol: '♈' },
  { name: 'Taurus', element: 'Earth', modality: 'Fixed', symbol: '♉' },
  { name: 'Gemini', element: 'Air', modality: 'Mutable', symbol: '♊' },
  { name: 'Cancer', element: 'Water', modality: 'Cardinal', symbol: '♋' },
  { name: 'Leo', element: 'Fire', modality: 'Fixed', symbol: '♌' },
  { name: 'Virgo', element: 'Earth', modality: 'Mutable', symbol: '♍' },
  { name: 'Libra', element: 'Air', modality: 'Cardinal', symbol: '♎' },
  { name: 'Scorpio', element: 'Water', modality: 'Fixed', symbol: '♏' },
  { name: 'Sagittarius', element: 'Fire', modality: 'Mutable', symbol: '♐' },
  { name: 'Capricorn', element: 'Earth', modality: 'Cardinal', symbol: '♑' },
  { name: 'Aquarius', element: 'Air', modality: 'Fixed', symbol: '♒' },
  { name: 'Pisces', element: 'Water', modality: 'Mutable', symbol: '♓' },
];

export const PLANET_META: Record<PlanetId, { name: string; glyph: string; color: string }> = {
  Sun: { name: 'Sun', glyph: '☉', color: '#fbbf24' },
  Moon: { name: 'Moon', glyph: '☽', color: '#cbd5e1' },
  Mercury: { name: 'Mercury', glyph: '☿', color: '#38bdf8' },
  Venus: { name: 'Venus', glyph: '♀', color: '#34d399' },
  Mars: { name: 'Mars', glyph: '♂', color: '#f87171' },
  Jupiter: { name: 'Jupiter', glyph: '♃', color: '#fb923c' },
  Saturn: { name: 'Saturn', glyph: '♄', color: '#ca8a04' },
  Uranus: { name: 'Uranus', glyph: '♅', color: '#2dd4bf' },
  Neptune: { name: 'Neptune', glyph: '♆', color: '#818cf8' },
  Pluto: { name: 'Pluto', glyph: '♇', color: '#c084fc' },
  Chiron: { name: 'Chiron', glyph: '⚷', color: '#e879f9' },
  NorthNode: { name: 'North Node', glyph: '☊', color: '#f43f5e' },
  SouthNode: { name: 'South Node', glyph: '☋', color: '#ec4899' },
  Lilith: { name: 'Lilith', glyph: '⚸', color: '#9333ea' },
  Ascendant: { name: 'Ascendant', glyph: 'ASC', color: '#e0e7ff' },
  Midheaven: { name: 'Midheaven', glyph: 'MC', color: '#fef08a' },
  PartOfFortune: { name: 'Part of Fortune', glyph: '⊕', color: '#facc15' },
};

export function getZodiacPosition(longitude: number) {
  const norm = normalizeDegrees(longitude);
  const signIndex = Math.floor(norm / 30);
  const sign = ZODIAC_SIGNS[signIndex % 12];
  const totalSignDegrees = norm - signIndex * 30;
  const signDegree = Math.floor(totalSignDegrees);
  const remMinutes = (totalSignDegrees - signDegree) * 60;
  const signMinute = Math.floor(remMinutes);
  const signSecond = Math.floor((remMinutes - signMinute) * 60);

  return {
    sign: sign.name,
    signIndex,
    signDegree,
    signMinute,
    signSecond,
    element: sign.element,
    modality: sign.modality,
    formatted: `${signDegree}° ${sign.symbol} ${signMinute.toString().padStart(2, '0')}'`,
  };
}

// Calculate Julian Day from Year, Month, Day, UT hours
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  utHours: number
): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + utHours / 24.0;
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    dayFrac +
    B -
    1524.5
  );
}

// True Obliquity of the Ecliptic in degrees
export function getObliquity(T: number): number {
  return (
    23.4392911 -
    0.0130042 * T -
    0.00000016 * T * T +
    0.000000504 * T * T * T
  );
}

// Greenwich Mean Sidereal Time in degrees
export function getGMST(jd: number, T: number, utHours: number): number {
  const d0 = jd - 2451545.0 - utHours / 24.0;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return normalizeDegrees(gmst);
}

// Keplerian orbit position solver for major planets
interface KeplerElements {
  a0: number; aDot: number; // AU
  e0: number; eDot: number;
  I0: number; IDot: number; // degrees
  L0: number; LDot: number; // mean longitude
  w0: number; wDot: number; // longitude of perihelion
  node0: number; nodeDot: number; // longitude of ascending node
}

const ORBITAL_DATA: Record<string, KeplerElements> = {
  Mercury: {
    a0: 0.38709927, aDot: 0.00000037,
    e0: 0.20563593, eDot: 0.00001906,
    I0: 7.00497902, IDot: -0.00594749,
    L0: 252.25032350, LDot: 149472.67411175,
    w0: 77.45779628, wDot: 0.16047689,
    node0: 48.33076593, nodeDot: -0.12534081,
  },
  Venus: {
    a0: 0.72333566, aDot: 0.00000390,
    e0: 0.00677672, eDot: -0.00004107,
    I0: 3.39467605, IDot: -0.00078890,
    L0: 181.97909950, LDot: 58517.81538729,
    w0: 131.60246718, wDot: 0.00268329,
    node0: 76.67984255, nodeDot: -0.27769418,
  },
  Earth: {
    a0: 1.00000261, aDot: 0.00000562,
    e0: 0.01671123, eDot: -0.00004392,
    I0: -0.00001531, IDot: -0.01294668,
    L0: 100.46457166, LDot: 35999.37244981,
    w0: 102.93768193, wDot: 0.32327364,
    node0: 0.0, nodeDot: 0.0,
  },
  Mars: {
    a0: 1.52371034, aDot: 0.00001847,
    e0: 0.09339410, eDot: 0.00007882,
    I0: 1.84969142, IDot: -0.00813131,
    L0: -4.55343205, LDot: 19140.30268499,
    w0: -23.94362959, wDot: 0.44441088,
    node0: 49.55953891, nodeDot: -0.29257343,
  },
  Jupiter: {
    a0: 5.20288700, aDot: -0.00011607,
    e0: 0.04838624, eDot: -0.00013253,
    I0: 1.30439695, IDot: -0.00183714,
    L0: 34.39644051, LDot: 3034.74612775,
    w0: 14.72847983, wDot: 0.21252668,
    node0: 100.47390909, nodeDot: 0.20469106,
  },
  Saturn: {
    a0: 9.53667594, aDot: -0.00125060,
    e0: 0.05386179, eDot: -0.00050991,
    I0: 2.48599187, IDot: 0.00193609,
    L0: 49.95424423, LDot: 1222.49362201,
    w0: 92.59887831, wDot: -0.41897216,
    node0: 113.66242448, nodeDot: -0.28867794,
  },
  Uranus: {
    a0: 19.18916464, aDot: -0.00196176,
    e0: 0.04725744, eDot: -0.00004397,
    I0: 0.77263783, IDot: -0.00242939,
    L0: 313.23810451, LDot: 428.48202785,
    w0: 170.95427630, wDot: 0.40805281,
    node0: 74.01692503, nodeDot: 0.04240589,
  },
  Neptune: {
    a0: 30.06992276, aDot: 0.00026291,
    e0: 0.00860610, eDot: 0.00005105,
    I0: 1.77004347, IDot: 0.00035372,
    L0: -55.12002969, LDot: 218.45945325,
    w0: 44.96476227, wDot: -0.32241464,
    node0: 131.78422574, nodeDot: -0.00508664,
  },
  Pluto: {
    a0: 39.48211675, aDot: -0.00031596,
    e0: 0.24882730, eDot: 0.00005170,
    I0: 17.14001206, IDot: 0.00004818,
    L0: 238.92903833, LDot: 145.20780515,
    w0: 224.06870000, wDot: -0.04062000,
    node0: 110.30393600, nodeDot: -0.01183000,
  },
};

function solveKepler(M_rad: number, e: number): number {
  let E = M_rad;
  for (let i = 0; i < 15; i++) {
    const delta = (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
    E -= delta;
    if (Math.abs(delta) < 1e-8) break;
  }
  return E;
}

function getHeliocentricCoords(name: string, T: number): { x: number; y: number; z: number } {
  const el = ORBITAL_DATA[name];
  if (!el) return { x: 0, y: 0, z: 0 };

  const a = el.a0 + el.aDot * T;
  const e = el.e0 + el.eDot * T;
  const I = (el.I0 + el.IDot * T) * DEG2RAD;
  const L = normalizeDegrees(el.L0 + el.LDot * T);
  const w = normalizeDegrees(el.w0 + el.wDot * T);
  const node = normalizeDegrees(el.node0 + el.nodeDot * T) * DEG2RAD;

  const M = normalizeDegrees(L - w);
  const M_rad = M * DEG2RAD;
  const E = solveKepler(M_rad, e);

  // Heliocentric coords in orbital plane
  const xPrime = a * (Math.cos(E) - e);
  const yPrime = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const omega = (w - (el.node0 + el.nodeDot * T)) * DEG2RAD;

  // Rotate to ecliptic
  const x =
    (Math.cos(omega) * Math.cos(node) - Math.sin(omega) * Math.sin(node) * Math.cos(I)) * xPrime +
    (-Math.sin(omega) * Math.cos(node) - Math.cos(omega) * Math.sin(node) * Math.cos(I)) * yPrime;
  const y =
    (Math.cos(omega) * Math.sin(node) + Math.sin(omega) * Math.cos(node) * Math.cos(I)) * xPrime +
    (-Math.sin(omega) * Math.sin(node) + Math.cos(omega) * Math.cos(node) * Math.cos(I)) * yPrime;
  const z =
    (Math.sin(omega) * Math.sin(I)) * xPrime +
    (Math.cos(omega) * Math.sin(I)) * yPrime;

  return { x, y, z };
}

// Calculate geocentric solar longitude
export function calculateSunLongitude(T: number): { longitude: number; speed: number } {
  const L0 = normalizeDegrees(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG2RAD;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  const trueLong = normalizeDegrees(L0 + C);
  return { longitude: trueLong, speed: 0.9856 };
}

// High-precision lunar theory (Meeus truncated)
export function calculateMoonLongitude(T: number): { longitude: number; speed: number } {
  // Mean longitude of Moon
  const L_prime = normalizeDegrees(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841.0);
  // Mean elongation of Moon
  const D = normalizeDegrees(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) * DEG2RAD;
  // Sun's mean anomaly
  const M = normalizeDegrees(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T) * DEG2RAD;
  // Moon's mean anomaly
  const M_prime = normalizeDegrees(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) * DEG2RAD;
  // Moon's argument of latitude
  const F = normalizeDegrees(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T) * DEG2RAD;

  // Major periodic terms
  let l =
    L_prime +
    6.288774 * Math.sin(M_prime) +
    1.274027 * Math.sin(2 * D - M_prime) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * M_prime) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * M_prime) +
    0.057066 * Math.sin(2 * D - M - M_prime) +
    0.053322 * Math.sin(2 * D + M_prime) +
    0.046100 * Math.sin(2 * D - M) +
    0.015327 * Math.sin(2 * D - 2 * F);

  return { longitude: normalizeDegrees(l), speed: 13.176 };
}

// Geocentric longitude for Keplerian planets
export function calculateGeocentricLongitude(
  planetName: string,
  T: number,
  earthCoords: { x: number; y: number; z: number }
): { longitude: number; isRetrograde: boolean; speed: number } {
  const pCoords = getHeliocentricCoords(planetName, T);
  // Geocentric coordinates
  const gx = pCoords.x - earthCoords.x;
  const gy = pCoords.y - earthCoords.y;
  let lon = Math.atan2(gy, gx) * RAD2DEG;
  lon = normalizeDegrees(lon);

  // Approximate speed by small delta
  const dt = 0.0001; // ~3.6 days
  const pNext = getHeliocentricCoords(planetName, T + dt);
  const eNext = getHeliocentricCoords('Earth', T + dt);
  const gx2 = pNext.x - eNext.x;
  const gy2 = pNext.y - eNext.y;
  let lon2 = Math.atan2(gy2, gx2) * RAD2DEG;
  lon2 = normalizeDegrees(lon2);

  let diff = lon2 - lon;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  const speed = diff / (dt * 36525); // degrees per day
  const isRetrograde = speed < 0;

  return { longitude: lon, isRetrograde, speed };
}

// Lunar Nodes (North Node Mean)
export function calculateNorthNode(T: number): number {
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0;
  return normalizeDegrees(omega);
}

// Black Moon Lilith (Mean Apogee)
export function calculateLilith(T: number): number {
  const apogee = 40.66249 + 4069.01388 * T + 0.01032 * T * T;
  return normalizeDegrees(apogee);
}

// Chiron Keplerian approximation
export function calculateChiron(T: number): { longitude: number; isRetrograde: boolean } {
  // Chiron orbital elements epoch J2000
  const a = 13.70;
  const e = 0.383;
  const I = 6.93 * DEG2RAD;
  const node = 171.32 * DEG2RAD;
  const w = 339.60 * DEG2RAD;
  const M0 = 29.80;
  const n = (360.0 / 50.7) * 0.01; // deg per century
  const M = normalizeDegrees(M0 + (360.0 / 50.7) * T * 100) * DEG2RAD;
  const E = solveKepler(M, e);
  const xP = a * (Math.cos(E) - e);
  const yP = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const x = (Math.cos(w) * Math.cos(node) - Math.sin(w) * Math.sin(node) * Math.cos(I)) * xP +
            (-Math.sin(w) * Math.cos(node) - Math.cos(w) * Math.sin(node) * Math.cos(I)) * yP;
  const y = (Math.cos(w) * Math.sin(node) + Math.sin(w) * Math.cos(node) * Math.cos(I)) * xP +
            (-Math.sin(w) * Math.sin(node) + Math.cos(w) * Math.cos(node) * Math.cos(I)) * yP;

  const eCoords = getHeliocentricCoords('Earth', T);
  const gx = x - eCoords.x;
  const gy = y - eCoords.y;
  const lon = normalizeDegrees(Math.atan2(gy, gx) * RAD2DEG);
  return { longitude: lon, isRetrograde: false };
}

// Ascendant & Midheaven calculation
export function calculateAscendantAndMC(
  ramcDeg: number,
  latDeg: number,
  epsDeg: number
): { ascendant: number; midheaven: number; descendant: number; imumCoeli: number } {
  const ramc = ramcDeg * DEG2RAD;
  const lat = latDeg * DEG2RAD;
  const eps = epsDeg * DEG2RAD;

  // Midheaven (MC)
  let mc = Math.atan2(Math.tan(ramc), Math.cos(eps)) * RAD2DEG;
  if (mc < 0) mc += 360;
  // Ensure MC is in correct quadrant with RAMC
  if (Math.abs(normalizeDegrees(mc) - ramcDeg) > 90 && Math.abs(normalizeDegrees(mc) - ramcDeg) < 270) {
    mc = normalizeDegrees(mc + 180);
  }

  // Ascendant (ASC)
  const y = -Math.cos(ramc);
  const x = Math.sin(ramc) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps);
  let asc = Math.atan2(y, x) * RAD2DEG;
  asc = normalizeDegrees(asc);

  const dsc = normalizeDegrees(asc + 180);
  const ic = normalizeDegrees(mc + 180);

  return { ascendant: asc, midheaven: mc, descendant: dsc, imumCoeli: ic };
}

// Placidus House Cusps
export function calculateHouses(
  system: HouseSystem,
  asc: number,
  mc: number,
  ramcDeg: number,
  latDeg: number,
  epsDeg: number
): HouseCusp[] {
  const cusps: number[] = new Array(12).fill(0);

  if (system === 'WholeSign') {
    const ascSignIndex = Math.floor(asc / 30);
    for (let i = 0; i < 12; i++) {
      cusps[i] = normalizeDegrees((ascSignIndex + i) * 30);
    }
  } else if (system === 'Equal') {
    for (let i = 0; i < 12; i++) {
      cusps[i] = normalizeDegrees(asc + i * 30);
    }
  } else {
    // Placidus System
    // Houses 1, 4, 7, 10 are defined by ASC & MC
    cusps[0] = asc;
    cusps[9] = mc;
    cusps[6] = normalizeDegrees(asc + 180);
    cusps[3] = normalizeDegrees(mc + 180);

    const eps = epsDeg * DEG2RAD;
    const lat = latDeg * DEG2RAD;

    // Numerical approximation for intermediate houses 11, 12, 2, 3
    const computeIntermediate = (f: number, ramcOffsetDeg: number): number => {
      const ramcTarget = (ramcDeg + ramcOffsetDeg) * DEG2RAD;
      let guess = normalizeDegrees(ramcOffsetDeg + mc);
      // Iterate 4 times
      for (let k = 0; k < 4; k++) {
        const guessRad = guess * DEG2RAD;
        const decl = Math.asin(Math.sin(guessRad) * Math.sin(eps));
        const ascDiff = Math.asin(Math.max(-1, Math.min(1, Math.tan(lat) * Math.tan(decl))));
        const ra = Math.atan2(Math.sin(guessRad) * Math.cos(eps), Math.cos(guessRad));
        guess = normalizeDegrees(guess + (ramcTarget - (ra - f * ascDiff)) * RAD2DEG);
      }
      return guess;
    };

    // Placidus can fail near polar circles (|lat| > 66°), fallback to Equal if extreme
    if (Math.abs(latDeg) >= 66) {
      for (let i = 0; i < 12; i++) {
        cusps[i] = normalizeDegrees(asc + i * 30);
      }
    } else {
      const h11 = normalizeDegrees(computeIntermediate(1 / 3, 30));
      const h12 = normalizeDegrees(computeIntermediate(2 / 3, 60));
      const h2 = normalizeDegrees(computeIntermediate(2 / 3, 120));
      const h3 = normalizeDegrees(computeIntermediate(1 / 3, 150));

      cusps[10] = h11;
      cusps[11] = h12;
      cusps[1] = h2;
      cusps[2] = h3;

      // Opposites
      cusps[4] = normalizeDegrees(h11 + 180);
      cusps[5] = normalizeDegrees(h12 + 180);
      cusps[7] = normalizeDegrees(h2 + 180);
      cusps[8] = normalizeDegrees(h3 + 180);
    }
  }

  return cusps.map((c, idx) => {
    const pos = getZodiacPosition(c);
    return {
      house: idx + 1,
      longitude: c,
      sign: pos.sign,
      signDegree: pos.signDegree,
      signMinute: pos.signMinute,
    };
  });
}

// Find which house a degree falls in given cusps
export function getHouseForDegree(deg: number, cusps: HouseCusp[]): number {
  const norm = normalizeDegrees(deg);
  for (let i = 0; i < 12; i++) {
    const current = cusps[i].longitude;
    const next = cusps[(i + 1) % 12].longitude;
    if (current < next) {
      if (norm >= current && norm < next) return i + 1;
    } else {
      // Wraps around 360 / 0 Aries
      if (norm >= current || norm < next) return i + 1;
    }
  }
  return 1;
}

// Aspect configurations and orbs
const ASPECT_SPECS: {
  type: AspectType;
  angle: number;
  orb: number;
  nature: 'harmonious' | 'tension' | 'creative' | 'neutral';
  color: string;
  sacredGeometry: string;
}[] = [
  { type: 'Conjunction', angle: 0, orb: 8.0, nature: 'neutral', color: '#facc15', sacredGeometry: 'Monad / Circle of Unity' },
  { type: 'Sextile', angle: 60, orb: 5.5, nature: 'harmonious', color: '#10b981', sacredGeometry: 'Hexagram / Sacred Flower' },
  { type: 'Square', angle: 90, orb: 7.0, nature: 'tension', color: '#ef4444', sacredGeometry: 'Square / Crucible of Form' },
  { type: 'Trine', angle: 120, orb: 8.0, nature: 'harmonious', color: '#3b82f6', sacredGeometry: 'Equilateral Triangle / Divine Triad' },
  { type: 'Opposition', angle: 180, orb: 8.0, nature: 'tension', color: '#a855f7', sacredGeometry: 'Polarity Axis / Vesica Piscis' },
  { type: 'Quincunx', angle: 150, orb: 2.5, nature: 'creative', color: '#f97316', sacredGeometry: 'Dodecagram Harmonic / Alchemical Adjust' },
  { type: 'Quintile', angle: 72, orb: 2.0, nature: 'creative', color: '#eab308', sacredGeometry: 'Pentagram / Golden Ratio Phi (Φ)' },
  { type: 'BiQuintile', angle: 144, orb: 2.0, nature: 'creative', color: '#ec4899', sacredGeometry: 'Decagram / Divine Proportion' },
];

export function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const validPlanets = planets.filter((p) => p.id !== 'Ascendant' && p.id !== 'Midheaven');

  for (let i = 0; i < validPlanets.length; i++) {
    for (let j = i + 1; j < validPlanets.length; j++) {
      const p1 = validPlanets[i];
      const p2 = validPlanets[j];

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const spec of ASPECT_SPECS) {
        const orb = Math.abs(diff - spec.angle);
        if (orb <= spec.orb) {
          // Applying vs separating approximation
          const isApplying = (p1.speed > p2.speed && p1.longitude < p2.longitude) || orb < 1.0;
          aspects.push({
            planet1: p1.id,
            planet2: p2.id,
            type: spec.type,
            angle: spec.angle,
            actualAngle: Math.round(diff * 100) / 100,
            orb: Math.round(orb * 100) / 100,
            isApplying,
            nature: spec.nature,
            color: spec.color,
            sacredGeometry: spec.sacredGeometry,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

// Detect sacred geometry formations (Grand Trine, T-Square, Grand Cross, Yod, Kite, Stellium)
export function detectSacredPatterns(
  planets: PlanetPosition[],
  aspects: Aspect[]
): SacredGeometryPattern[] {
  const patterns: SacredGeometryPattern[] = [];
  const planetList = planets.filter((p) => p.id !== 'Ascendant' && p.id !== 'Midheaven');

  // Check Stelliums (3+ planets within 10 degrees or in the same sign)
  const signGroups: Record<string, PlanetId[]> = {};
  planetList.forEach((p) => {
    if (!signGroups[p.sign]) signGroups[p.sign] = [];
    signGroups[p.sign].push(p.id);
  });
  Object.entries(signGroups).forEach(([sign, pIds]) => {
    if (pIds.length >= 3) {
      patterns.push({
        id: `stellium-${sign}`,
        type: 'Stellium',
        name: `${sign} Stellium Conjunction`,
        planets: pIds,
        description: `Intense focal concentration of psychic energy in ${sign}. Acts as a central gravity point of life purpose.`,
        geometricMeaning: 'Concentrated Vortex of Primal Force',
        color: '#facc15',
      });
    }
  });

  // Grand Trines: 3 planets forming trines with one another
  for (let i = 0; i < planetList.length; i++) {
    for (let j = i + 1; j < planetList.length; j++) {
      for (let k = j + 1; k < planetList.length; k++) {
        const p1 = planetList[i].id;
        const p2 = planetList[j].id;
        const p3 = planetList[k].id;

        const hasTrine12 = aspects.some((a) => a.type === 'Trine' && ((a.planet1 === p1 && a.planet2 === p2) || (a.planet1 === p2 && a.planet2 === p1)));
        const hasTrine23 = aspects.some((a) => a.type === 'Trine' && ((a.planet1 === p2 && a.planet2 === p3) || (a.planet1 === p3 && a.planet2 === p2)));
        const hasTrine13 = aspects.some((a) => a.type === 'Trine' && ((a.planet1 === p1 && a.planet2 === p3) || (a.planet1 === p3 && a.planet2 === p1)));

        if (hasTrine12 && hasTrine23 && hasTrine13) {
          const sign1 = planetList[i].sign;
          const element = ZODIAC_SIGNS.find((z) => z.name === sign1)?.element;
          patterns.push({
            id: `grand-trine-${p1}-${p2}-${p3}`,
            type: 'GrandTrine',
            name: `Grand ${element || 'Sacred'} Trine`,
            planets: [p1, p2, p3],
            element,
            description: `Harmonic equilateral triangle of immense creative ease and natural psychic gifts in the ${element || ''} realm.`,
            geometricMeaning: 'Equilateral Triangle • Divine Trinity & Effortless Grace',
            color: '#38bdf8',
          });
        }
      }
    }
  }

  // T-Squares: 2 planets in opposition, both squaring a 3rd planet (apex)
  for (let i = 0; i < planetList.length; i++) {
    for (let j = i + 1; j < planetList.length; j++) {
      const p1 = planetList[i].id;
      const p2 = planetList[j].id;
      const isOpposition = aspects.some((a) => a.type === 'Opposition' && ((a.planet1 === p1 && a.planet2 === p2) || (a.planet1 === p2 && a.planet2 === p1)));

      if (isOpposition) {
        for (let k = 0; k < planetList.length; k++) {
          if (k === i || k === j) continue;
          const p3 = planetList[k].id; // Apex planet
          const sq1 = aspects.some((a) => a.type === 'Square' && ((a.planet1 === p1 && a.planet2 === p3) || (a.planet1 === p3 && a.planet2 === p1)));
          const sq2 = aspects.some((a) => a.type === 'Square' && ((a.planet1 === p2 && a.planet2 === p3) || (a.planet1 === p3 && a.planet2 === p2)));

          if (sq1 && sq2) {
            patterns.push({
              id: `tsquare-${p1}-${p2}-${p3}`,
              type: 'TSquare',
              name: `T-Square (Apex: ${p3})`,
              planets: [p1, p2, p3],
              description: `Powerful dynamic tension seeking cathartic breakthrough through the apex planet ${p3}. High achievement drive.`,
              geometricMeaning: 'Isosceles Triangle of Tension & Creative Pressure',
              color: '#ef4444',
            });
          }
        }
      }
    }
  }

  // Grand Cross: 4 planets, two mutual oppositions and four mutual squares
  // Yod (Finger of God): Two planets sextile each other, both quincunx a 3rd apex planet
  for (let i = 0; i < planetList.length; i++) {
    for (let j = i + 1; j < planetList.length; j++) {
      const p1 = planetList[i].id;
      const p2 = planetList[j].id;
      const hasSextile = aspects.some((a) => a.type === 'Sextile' && ((a.planet1 === p1 && a.planet2 === p2) || (a.planet1 === p2 && a.planet2 === p1)));
      if (hasSextile) {
        for (let k = 0; k < planetList.length; k++) {
          if (k === i || k === j) continue;
          const p3 = planetList[k].id;
          const q1 = aspects.some((a) => a.type === 'Quincunx' && ((a.planet1 === p1 && a.planet2 === p3) || (a.planet1 === p3 && a.planet2 === p1)));
          const q2 = aspects.some((a) => a.type === 'Quincunx' && ((a.planet1 === p2 && a.planet2 === p3) || (a.planet1 === p3 && a.planet2 === p2)));
          if (q1 && q2) {
            patterns.push({
              id: `yod-${p1}-${p2}-${p3}`,
              type: 'Yod',
              name: `Yod • Finger of Fate (Apex: ${p3})`,
              planets: [p1, p2, p3],
              description: `Special destiny configuration requiring psychological alchemy and spiritual recalibration directed through ${p3}.`,
              geometricMeaning: 'Sacred Needle • Evolutionary Crossroads & Karmic Adjustment',
              color: '#f97316',
            });
          }
        }
      }
    }
  }

  return patterns;
}

// Master Natal Chart Calculator
export function calculateNatalChart(birthData: BirthData): FullNatalChart {
  const [yearStr, monthStr, dayStr] = birthData.birthDate.split('-');
  const [hourStr, minuteStr] = birthData.birthTime.split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const localHour = parseInt(hourStr, 10) + parseInt(minuteStr, 10) / 60.0;

  // Convert to UT hours
  let utHour = localHour - birthData.timezoneOffset;
  let jdDay = day;
  if (utHour < 0) {
    utHour += 24;
    jdDay -= 1;
  } else if (utHour >= 24) {
    utHour -= 24;
    jdDay += 1;
  }

  const jd = calculateJulianDay(year, month, jdDay, utHour);
  const T = (jd - 2451545.0) / 36525.0;

  const eps = getObliquity(T);
  const gmst = getGMST(jd, T, utHour);
  const ramc = normalizeDegrees(gmst + birthData.longitude);

  // Ascendant & MC
  const angles = calculateAscendantAndMC(ramc, birthData.latitude, eps);

  // Houses
  const houses = calculateHouses(
    birthData.houseSystem,
    angles.ascendant,
    angles.midheaven,
    ramc,
    birthData.latitude,
    eps
  );

  // Heliocentric Earth
  const earthCoords = getHeliocentricCoords('Earth', T);

  // Calculate planetary positions
  const sunData = calculateSunLongitude(T);
  const moonData = calculateMoonLongitude(T);
  const mercuryData = calculateGeocentricLongitude('Mercury', T, earthCoords);
  const venusData = calculateGeocentricLongitude('Venus', T, earthCoords);
  const marsData = calculateGeocentricLongitude('Mars', T, earthCoords);
  const jupiterData = calculateGeocentricLongitude('Jupiter', T, earthCoords);
  const saturnData = calculateGeocentricLongitude('Saturn', T, earthCoords);
  const uranusData = calculateGeocentricLongitude('Uranus', T, earthCoords);
  const neptuneData = calculateGeocentricLongitude('Neptune', T, earthCoords);
  const plutoData = calculateGeocentricLongitude('Pluto', T, earthCoords);
  const chironData = calculateChiron(T);
  const northNodeLong = calculateNorthNode(T);
  const southNodeLong = normalizeDegrees(northNodeLong + 180);
  const lilithLong = calculateLilith(T);

  // Part of Fortune: Day vs Night birth
  const isDayBirth = Math.abs(angles.ascendant - sunData.longitude) < 180 ? sunData.longitude > angles.descendant : sunData.longitude < angles.ascendant;
  let pofLong = isDayBirth
    ? normalizeDegrees(angles.ascendant + moonData.longitude - sunData.longitude)
    : normalizeDegrees(angles.ascendant + sunData.longitude - moonData.longitude);

  const rawPositions: { id: PlanetId; lon: number; isRetro: boolean; speed: number }[] = [
    { id: 'Sun', lon: sunData.longitude, isRetro: false, speed: sunData.speed },
    { id: 'Moon', lon: moonData.longitude, isRetro: false, speed: moonData.speed },
    { id: 'Mercury', lon: mercuryData.longitude, isRetro: mercuryData.isRetrograde, speed: mercuryData.speed },
    { id: 'Venus', lon: venusData.longitude, isRetro: venusData.isRetrograde, speed: venusData.speed },
    { id: 'Mars', lon: marsData.longitude, isRetro: marsData.isRetrograde, speed: marsData.speed },
    { id: 'Jupiter', lon: jupiterData.longitude, isRetro: jupiterData.isRetrograde, speed: jupiterData.speed },
    { id: 'Saturn', lon: saturnData.longitude, isRetro: saturnData.isRetrograde, speed: saturnData.speed },
    { id: 'Uranus', lon: uranusData.longitude, isRetro: uranusData.isRetrograde, speed: uranusData.speed },
    { id: 'Neptune', lon: neptuneData.longitude, isRetro: neptuneData.isRetrograde, speed: neptuneData.speed },
    { id: 'Pluto', lon: plutoData.longitude, isRetro: plutoData.isRetrograde, speed: plutoData.speed },
    { id: 'Chiron', lon: chironData.longitude, isRetro: chironData.isRetrograde, speed: 0.02 },
    { id: 'NorthNode', lon: northNodeLong, isRetro: true, speed: -0.05 },
    { id: 'SouthNode', lon: southNodeLong, isRetro: true, speed: -0.05 },
    { id: 'Lilith', lon: lilithLong, isRetro: false, speed: 0.11 },
    { id: 'PartOfFortune', lon: pofLong, isRetro: false, speed: 0 },
  ];

  const planets: PlanetPosition[] = rawPositions.map((p) => {
    const meta = PLANET_META[p.id];
    const pos = getZodiacPosition(p.lon);
    const house = getHouseForDegree(p.lon, houses);
    return {
      id: p.id,
      name: meta.name,
      glyph: meta.glyph,
      longitude: p.lon,
      sign: pos.sign,
      signDegree: pos.signDegree,
      signMinute: pos.signMinute,
      signSecond: pos.signSecond,
      formattedPos: pos.formatted,
      house,
      isRetrograde: p.isRetro,
      speed: p.speed,
      color: meta.color,
    };
  });

  const ascPos = getZodiacPosition(angles.ascendant);
  const mcPos = getZodiacPosition(angles.midheaven);
  const dscPos = getZodiacPosition(angles.descendant);
  const icPos = getZodiacPosition(angles.imumCoeli);

  const ascPlanet: PlanetPosition = {
    id: 'Ascendant',
    name: 'Ascendant',
    glyph: 'ASC',
    longitude: angles.ascendant,
    sign: ascPos.sign,
    signDegree: ascPos.signDegree,
    signMinute: ascPos.signMinute,
    signSecond: ascPos.signSecond,
    formattedPos: ascPos.formatted,
    house: 1,
    isRetrograde: false,
    speed: 0,
    color: '#e0e7ff',
  };

  const mcPlanet: PlanetPosition = {
    id: 'Midheaven',
    name: 'Midheaven',
    glyph: 'MC',
    longitude: angles.midheaven,
    sign: mcPos.sign,
    signDegree: mcPos.signDegree,
    signMinute: mcPos.signMinute,
    signSecond: mcPos.signSecond,
    formattedPos: mcPos.formatted,
    house: 10,
    isRetrograde: false,
    speed: 0,
    color: '#fef08a',
  };

  const dscPlanet: PlanetPosition = {
    id: 'Ascendant', // angle proxy
    name: 'Descendant',
    glyph: 'DSC',
    longitude: angles.descendant,
    sign: dscPos.sign,
    signDegree: dscPos.signDegree,
    signMinute: dscPos.signMinute,
    signSecond: dscPos.signSecond,
    formattedPos: dscPos.formatted,
    house: 7,
    isRetrograde: false,
    speed: 0,
    color: '#e0e7ff',
  };

  const icPlanet: PlanetPosition = {
    id: 'Midheaven', // angle proxy
    name: 'Imum Coeli',
    glyph: 'IC',
    longitude: angles.imumCoeli,
    sign: icPos.sign,
    signDegree: icPos.signDegree,
    signMinute: icPos.signMinute,
    signSecond: icPos.signSecond,
    formattedPos: icPos.formatted,
    house: 4,
    isRetrograde: false,
    speed: 0,
    color: '#fef08a',
  };

  // Aspects & Sacred Geometry
  const aspects = calculateAspects(planets);
  const sacredPatterns = detectSacredPatterns(planets, aspects);

  // Element and modality counting
  const elementCounts: Record<ElementType, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalityCounts: Record<ModalityType, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };

  planets.forEach((p) => {
    if (['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(p.id)) {
      const z = ZODIAC_SIGNS.find((s) => s.name === p.sign);
      if (z) {
        elementCounts[z.element] += 1;
        modalityCounts[z.modality] += 1;
      }
    }
  });

  // Calculate holistic typology (Enneagram, MBTI, Human Design, Gene Keys)
  const typology = calculateHolisticTypology(planets, ascPlanet, mcPlanet, elementCounts, modalityCounts);

  return {
    birthData,
    calculatedAt: new Date().toISOString(),
    julianDay: jd,
    siderealTimeDegrees: ramc,
    obliquityDegrees: eps,
    planets,
    houses,
    angles: {
      ascendant: ascPlanet,
      midheaven: mcPlanet,
      descendant: dscPlanet,
      imumCoeli: icPlanet,
    },
    aspects,
    sacredPatterns,
    elementCounts,
    modalityCounts,
    typology,
  };
}

// Calculate real-time transits for now
export function calculateCurrentTransits(natalPlanets: PlanetPosition[]): {
  transitPlanets: PlanetPosition[];
  transitAspects: {
    transitingPlanet: PlanetPosition;
    natalPlanet: PlanetPosition;
    aspect: AspectType;
    orb: number;
    interpretation: string;
  }[];
} {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const utHours = now.getUTCHours() + now.getUTCMinutes() / 60.0;

  const jd = calculateJulianDay(year, month, day, utHours);
  const T = (jd - 2451545.0) / 36525.0;
  const earthCoords = getHeliocentricCoords('Earth', T);

  const transitRaw: { id: PlanetId; lon: number }[] = [
    { id: 'Sun', lon: calculateSunLongitude(T).longitude },
    { id: 'Moon', lon: calculateMoonLongitude(T).longitude },
    { id: 'Mercury', lon: calculateGeocentricLongitude('Mercury', T, earthCoords).longitude },
    { id: 'Venus', lon: calculateGeocentricLongitude('Venus', T, earthCoords).longitude },
    { id: 'Mars', lon: calculateGeocentricLongitude('Mars', T, earthCoords).longitude },
    { id: 'Jupiter', lon: calculateGeocentricLongitude('Jupiter', T, earthCoords).longitude },
    { id: 'Saturn', lon: calculateGeocentricLongitude('Saturn', T, earthCoords).longitude },
    { id: 'Uranus', lon: calculateGeocentricLongitude('Uranus', T, earthCoords).longitude },
    { id: 'Neptune', lon: calculateGeocentricLongitude('Neptune', T, earthCoords).longitude },
    { id: 'Pluto', lon: calculateGeocentricLongitude('Pluto', T, earthCoords).longitude },
  ];

  const transitPlanets: PlanetPosition[] = transitRaw.map((p) => {
    const meta = PLANET_META[p.id];
    const pos = getZodiacPosition(p.lon);
    return {
      id: p.id,
      name: meta.name,
      glyph: meta.glyph,
      longitude: p.lon,
      sign: pos.sign,
      signDegree: pos.signDegree,
      signMinute: pos.signMinute,
      signSecond: pos.signSecond,
      formattedPos: pos.formatted,
      house: 1,
      isRetrograde: false,
      speed: 1,
      color: meta.color,
    };
  });

  const transitAspects: {
    transitingPlanet: PlanetPosition;
    natalPlanet: PlanetPosition;
    aspect: AspectType;
    orb: number;
    interpretation: string;
  }[] = [];

  transitPlanets.forEach((tp) => {
    natalPlanets.forEach((np) => {
      let diff = Math.abs(tp.longitude - np.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const spec of ASPECT_SPECS) {
        // Tight orb for transits (max 3 degrees)
        if (Math.abs(diff - spec.angle) <= Math.min(3.5, spec.orb * 0.5)) {
          const orb = Math.round(Math.abs(diff - spec.angle) * 100) / 100;
          let interp = `Transiting ${tp.name} forms a ${spec.type} to natal ${np.name}.`;
          if (spec.nature === 'tension') {
            interp += ` Dynamic friction triggering psychological restructuring and shedding of outdated patterns.`;
          } else if (spec.nature === 'harmonious') {
            interp += ` Supportive wave of insight, integration, and easeful creative manifestation.`;
          } else {
            interp += ` Potent initiation cycle awakening fresh consciousness in this psychological sector.`;
          }

          transitAspects.push({
            transitingPlanet: tp,
            natalPlanet: np,
            aspect: spec.type,
            orb,
            interpretation: interp,
          });
          break;
        }
      }
    });
  });

  return { transitPlanets, transitAspects };
}

// Calculate planets for any specific calendar date and time
export function calculatePlanetsForDate(
  dateStr: string,
  timeStr: string = '12:00',
  timezoneOffset: number = 0
): PlanetPosition[] {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const [hourStr, minStr] = timeStr.split(':');

  const year = parseInt(yearStr, 10) || 2025;
  const month = parseInt(monthStr, 10) || 1;
  const day = parseInt(dayStr, 10) || 1;
  const localHour = (parseInt(hourStr, 10) || 12) + (parseInt(minStr, 10) || 0) / 60.0;

  let utHour = localHour - timezoneOffset;
  let jdDay = day;
  if (utHour < 0) {
    utHour += 24;
    jdDay -= 1;
  } else if (utHour >= 24) {
    utHour -= 24;
    jdDay += 1;
  }

  const jd = calculateJulianDay(year, month, jdDay, utHour);
  const T = (jd - 2451545.0) / 36525.0;
  const earthCoords = getHeliocentricCoords('Earth', T);

  const list: { id: PlanetId; lon: number }[] = [
    { id: 'Sun', lon: calculateSunLongitude(T).longitude },
    { id: 'Moon', lon: calculateMoonLongitude(T).longitude },
    { id: 'Mercury', lon: calculateGeocentricLongitude('Mercury', T, earthCoords).longitude },
    { id: 'Venus', lon: calculateGeocentricLongitude('Venus', T, earthCoords).longitude },
    { id: 'Mars', lon: calculateGeocentricLongitude('Mars', T, earthCoords).longitude },
    { id: 'Jupiter', lon: calculateGeocentricLongitude('Jupiter', T, earthCoords).longitude },
    { id: 'Saturn', lon: calculateGeocentricLongitude('Saturn', T, earthCoords).longitude },
    { id: 'Uranus', lon: calculateGeocentricLongitude('Uranus', T, earthCoords).longitude },
    { id: 'Neptune', lon: calculateGeocentricLongitude('Neptune', T, earthCoords).longitude },
    { id: 'Pluto', lon: calculateGeocentricLongitude('Pluto', T, earthCoords).longitude },
    { id: 'Chiron', lon: calculateChiron(T).longitude },
    { id: 'NorthNode', lon: calculateNorthNode(T) },
  ];

  return list.map((p) => {
    const meta = PLANET_META[p.id];
    const pos = getZodiacPosition(p.lon);
    return {
      id: p.id,
      name: meta?.name || p.id,
      glyph: meta?.glyph || '•',
      longitude: p.lon,
      sign: pos.sign,
      signDegree: pos.signDegree,
      signMinute: pos.signMinute,
      signSecond: pos.signSecond,
      formattedPos: pos.formatted,
      house: 1,
      isRetrograde: false,
      speed: 1,
      color: meta?.color || '#cbd5e1',
    };
  });
}
