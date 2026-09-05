import { FullNatalChart, PlanetId, ZodiacSign } from '../types';
import { ASTEROIDS_200_CATALOG } from './asteroidsData';

export type AspectHarmonicClass = 'dodecahedron' | 'icosahedron' | 'compound';

export interface PlanetaryAsteroidAspect {
  id: string;
  planetId: PlanetId;
  planetName: string;
  planetLongitude: number;
  planetColor: string;
  planetGlyph: string;
  asteroidId: string;
  asteroidName: string;
  asteroidDesignation: string;
  asteroidLongitude: number;
  asteroidSign: ZodiacSign;
  asteroidGroup: string;
  aspectType: 'Trine' | 'Sextile' | 'Quintile' | 'BiQuintile' | 'Conjunction';
  exactAngleDeg: number;
  actualAngleDeg: number;
  orbDeg: number;
  resonancePower: number; // 0.0 - 1.0 (1.0 = exact 0.0° orb)
  targetGeometry: AspectHarmonicClass;
  harmonicDescription: string;
}

export interface PlanetaryAsteroidHarmonicsSummary {
  aspects: PlanetaryAsteroidAspect[];
  totalHarmonies: number;
  trinesCount: number;
  quintilesCount: number;
  sextilesCount: number;
  conjunctionsCount: number;
  dominantGeometry: AspectHarmonicClass;
  targetFoldProgress: number; // 0.0 (dodecahedron) to 1.0 (icosahedron)
  harmonicResonanceIndex: number; // 0 to 100
  hasHarmoniousAspects: boolean;
  strongestAspect: PlanetaryAsteroidAspect | null;
}

// Aspect angle definitions and maximum orbs
const HARMONIC_DEFINITIONS: {
  type: 'Trine' | 'Sextile' | 'Quintile' | 'BiQuintile' | 'Conjunction';
  angle: number;
  maxOrb: number;
  targetGeometry: AspectHarmonicClass;
  desc: string;
}[] = [
  {
    type: 'Conjunction',
    angle: 0,
    maxOrb: 3.5,
    targetGeometry: 'compound',
    desc: 'Unitive Focus / Harmonic Focal Stellation',
  },
  {
    type: 'Sextile',
    angle: 60,
    maxOrb: 3.2,
    targetGeometry: 'compound',
    desc: 'Hexagonal Bridge / Dual Resonance Synthesis',
  },
  {
    type: 'Quintile',
    angle: 72,
    maxOrb: 2.4,
    targetGeometry: 'dodecahedron',
    desc: 'Golden Ratio 5-Fold Aether / Dodecahedron Stimulus',
  },
  {
    type: 'Trine',
    angle: 120,
    maxOrb: 3.8,
    targetGeometry: 'icosahedron',
    desc: 'Triune Water Fluidity / Icosahedron Stimulus',
  },
  {
    type: 'BiQuintile',
    angle: 144,
    maxOrb: 2.2,
    targetGeometry: 'dodecahedron',
    desc: 'Stellated Pentagram 5-Fold / Dodecahedral Stellation',
  },
];

/**
 * Computes all active harmonious aspects between natal planets and the 200 nearest asteroids
 */
export function detectPlanetaryAsteroidHarmonics(
  chart: FullNatalChart
): PlanetaryAsteroidHarmonicsSummary {
  const aspects: PlanetaryAsteroidAspect[] = [];

  const planets = chart.planets;
  const asteroids = ASTEROIDS_200_CATALOG;

  for (const planet of planets) {
    for (const asteroid of asteroids) {
      const pLon = planet.longitude;
      const aLon = asteroid.currentEclipticLongitude;

      // Calculate minimal angular difference on 360° circle
      let diff = Math.abs(pLon - aLon) % 360;
      if (diff > 180) diff = 360 - diff;

      for (const def of HARMONIC_DEFINITIONS) {
        const orb = Math.abs(diff - def.angle);
        if (orb <= def.maxOrb) {
          const resonancePower = Math.max(0.1, 1.0 - orb / def.maxOrb);

          aspects.push({
            id: `asp-${planet.id}-${asteroid.id}-${def.type}`,
            planetId: planet.id,
            planetName: planet.name,
            planetLongitude: pLon,
            planetColor: planet.color || '#D4AF37',
            planetGlyph: planet.glyph || '☉',
            asteroidId: asteroid.id,
            asteroidName: asteroid.name,
            asteroidDesignation: asteroid.designation,
            asteroidLongitude: aLon,
            asteroidSign: asteroid.nextTransit?.sign || 'Aries',
            asteroidGroup: asteroid.group,
            aspectType: def.type,
            exactAngleDeg: def.angle,
            actualAngleDeg: diff,
            orbDeg: parseFloat(orb.toFixed(2)),
            resonancePower: parseFloat(resonancePower.toFixed(3)),
            targetGeometry: def.targetGeometry,
            harmonicDescription: def.desc,
          });
          break; // Don't match multiple aspects for the same pair
        }
      }
    }
  }

  // Sort by resonance power descending (tighter orbs first)
  aspects.sort((a, b) => b.resonancePower - a.resonancePower);

  const trines = aspects.filter((a) => a.aspectType === 'Trine');
  const quintiles = aspects.filter(
    (a) => a.aspectType === 'Quintile' || a.aspectType === 'BiQuintile'
  );
  const sextiles = aspects.filter((a) => a.aspectType === 'Sextile');
  const conjunctions = aspects.filter((a) => a.aspectType === 'Conjunction');

  // Determine dominant geometry based on weighted counts
  // Trines push to 1.0 (Icosahedron), Quintiles push to 0.0 (Dodecahedron)
  const icosaWeight = trines.length * 1.5 + sextiles.length * 0.5;
  const dodecaWeight = quintiles.length * 1.8 + sextiles.length * 0.5;
  const totalWeight = icosaWeight + dodecaWeight || 1;

  let targetFoldProgress = 0.5; // default compound equilibrium
  let dominantGeometry: AspectHarmonicClass = 'compound';

  if (aspects.length > 0) {
    if (icosaWeight > dodecaWeight * 1.25) {
      dominantGeometry = 'icosahedron';
      targetFoldProgress = Math.min(0.95, 0.5 + (icosaWeight / totalWeight) * 0.45);
    } else if (dodecaWeight > icosaWeight * 1.25) {
      dominantGeometry = 'dodecahedron';
      targetFoldProgress = Math.max(0.05, 0.5 - (dodecaWeight / totalWeight) * 0.45);
    } else {
      dominantGeometry = 'compound';
      targetFoldProgress = 0.5;
    }
  }

  // Calculate resonance index (0 to 100)
  const strongest = aspects[0] || null;
  const rawIndex = Math.min(
    100,
    Math.round(
      (aspects.length * 4.5 +
        (strongest ? strongest.resonancePower * 30 : 0) +
        conjunctions.length * 8) *
        0.85
    )
  );
  const harmonicResonanceIndex = Math.max(15, Math.min(99, rawIndex));

  return {
    aspects,
    totalHarmonies: aspects.length,
    trinesCount: trines.length,
    quintilesCount: quintiles.length,
    sextilesCount: sextiles.length,
    conjunctionsCount: conjunctions.length,
    dominantGeometry,
    targetFoldProgress,
    harmonicResonanceIndex,
    hasHarmoniousAspects: aspects.length > 0,
    strongestAspect: strongest,
  };
}
