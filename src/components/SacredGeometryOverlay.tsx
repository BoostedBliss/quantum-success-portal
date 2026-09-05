import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FullNatalChart,
  PlanetId,
  Aspect,
  SacredGeometryPattern,
} from '../types';
import {
  Sparkles,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Maximize2,
  Info,
  CircleDot,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  X,
  Orbit,
  Box,
  Eye,
  Activity,
  Check,
  Compass,
} from 'lucide-react';
import {
  detectPlanetaryAsteroidHarmonics,
  PlanetaryAsteroidAspect,
  PlanetaryAsteroidHarmonicsSummary,
  AspectHarmonicClass,
} from '../lib/planetaryAsteroidAspects';

export type SacredFilterType =
  | 'compound'
  | 'harmonious'
  | 'tension'
  | 'dodeca'
  | 'icosa'
  | 'asteroids'
  | 'all';

export type FoldingMode = 'auto' | 'breath' | 'manual';

export interface SacredGeometryOverlayProps {
  chart: FullNatalChart;
  showSacredGeometry: boolean;
  selectedPlanetId: PlanetId | null;
  hoveredPlanetId: PlanetId | null;
  getCoordinates: (longitude: number, radius: number) => { x: number; y: number; angleDeg: number };
  centerX?: number;
  centerY?: number;
  hubRadius?: number;
  // Controlled options
  activeFilter?: SacredFilterType;
  isFoldingActive?: boolean;
  manualFold?: number; // 0 to 1
  autoRotate?: boolean;
  webPulsesEnabled?: boolean;
  rotationAngle?: { x: number; y: number; z: number };
  foldingMode?: FoldingMode;
  activeHarmoniousAspectId?: string | null;
  showAsteroidBeams?: boolean;
  perspectiveDepth?: number;
  showCrystalFaces?: boolean;
  onSelectHarmonicAspect?: (aspectId: string | null) => void;
}

// Golden ratio constants
const PHI = (1 + Math.sqrt(5)) / 2; // ~1.6180339887
const INV_PHI = 1 / PHI; // ~0.6180339887
const ICOSA_NORM = Math.sqrt(1 + PHI * PHI); // ~1.902113
const DODECA_NORM = Math.sqrt(3); // ~1.73205

// 12 Normalized Vertices of Icosahedron (Dual of Dodecahedron)
export const RAW_ICOSA_VERTICES: [number, number, number][] = [
  [0, 1 / ICOSA_NORM, PHI / ICOSA_NORM],
  [0, 1 / ICOSA_NORM, -PHI / ICOSA_NORM],
  [0, -1 / ICOSA_NORM, PHI / ICOSA_NORM],
  [0, -1 / ICOSA_NORM, -PHI / ICOSA_NORM],
  [1 / ICOSA_NORM, PHI / ICOSA_NORM, 0],
  [1 / ICOSA_NORM, -PHI / ICOSA_NORM, 0],
  [-1 / ICOSA_NORM, PHI / ICOSA_NORM, 0],
  [-1 / ICOSA_NORM, -PHI / ICOSA_NORM, 0],
  [PHI / ICOSA_NORM, 0, 1 / ICOSA_NORM],
  [-PHI / ICOSA_NORM, 0, 1 / ICOSA_NORM],
  [PHI / ICOSA_NORM, 0, -1 / ICOSA_NORM],
  [-PHI / ICOSA_NORM, 0, -1 / ICOSA_NORM],
];

// 20 Normalized Vertices of Dodecahedron
export const RAW_DODECA_VERTICES: [number, number, number][] = [
  // 8 Cube Vertices
  [1 / DODECA_NORM, 1 / DODECA_NORM, 1 / DODECA_NORM],
  [1 / DODECA_NORM, 1 / DODECA_NORM, -1 / DODECA_NORM],
  [1 / DODECA_NORM, -1 / DODECA_NORM, 1 / DODECA_NORM],
  [1 / DODECA_NORM, -1 / DODECA_NORM, -1 / DODECA_NORM],
  [-1 / DODECA_NORM, 1 / DODECA_NORM, 1 / DODECA_NORM],
  [-1 / DODECA_NORM, 1 / DODECA_NORM, -1 / DODECA_NORM],
  [-1 / DODECA_NORM, -1 / DODECA_NORM, 1 / DODECA_NORM],
  [-1 / DODECA_NORM, -1 / DODECA_NORM, -1 / DODECA_NORM],
  // 4 on Y-Z planes
  [0, INV_PHI / DODECA_NORM, PHI / DODECA_NORM],
  [0, INV_PHI / DODECA_NORM, -PHI / DODECA_NORM],
  [0, -INV_PHI / DODECA_NORM, PHI / DODECA_NORM],
  [0, -INV_PHI / DODECA_NORM, -PHI / DODECA_NORM],
  // 4 on X-Y planes
  [INV_PHI / DODECA_NORM, PHI / DODECA_NORM, 0],
  [INV_PHI / DODECA_NORM, -PHI / DODECA_NORM, 0],
  [-INV_PHI / DODECA_NORM, PHI / DODECA_NORM, 0],
  [-INV_PHI / DODECA_NORM, -PHI / DODECA_NORM, 0],
  // 4 on X-Z planes
  [PHI / DODECA_NORM, 0, INV_PHI / DODECA_NORM],
  [PHI / DODECA_NORM, 0, -INV_PHI / DODECA_NORM],
  [-PHI / DODECA_NORM, 0, INV_PHI / DODECA_NORM],
  [-PHI / DODECA_NORM, 0, -INV_PHI / DODECA_NORM],
];

// Precompute 30 Edges of Icosahedron
export const ICOSA_EDGES: [number, number][] = (() => {
  const edges: [number, number][] = [];
  const targetDist = 2 / ICOSA_NORM;
  for (let i = 0; i < RAW_ICOSA_VERTICES.length; i++) {
    for (let j = i + 1; j < RAW_ICOSA_VERTICES.length; j++) {
      const dx = RAW_ICOSA_VERTICES[i][0] - RAW_ICOSA_VERTICES[j][0];
      const dy = RAW_ICOSA_VERTICES[i][1] - RAW_ICOSA_VERTICES[j][1];
      const dz = RAW_ICOSA_VERTICES[i][2] - RAW_ICOSA_VERTICES[j][2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (Math.abs(d - targetDist) < 0.05) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
})();

// Precompute 30 Edges of Dodecahedron
export const DODECA_EDGES: [number, number][] = (() => {
  const edges: [number, number][] = [];
  const targetDist = (2 / PHI) / DODECA_NORM;
  for (let i = 0; i < RAW_DODECA_VERTICES.length; i++) {
    for (let j = i + 1; j < RAW_DODECA_VERTICES.length; j++) {
      const dx = RAW_DODECA_VERTICES[i][0] - RAW_DODECA_VERTICES[j][0];
      const dy = RAW_DODECA_VERTICES[i][1] - RAW_DODECA_VERTICES[j][1];
      const dz = RAW_DODECA_VERTICES[i][2] - RAW_DODECA_VERTICES[j][2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (Math.abs(d - targetDist) < 0.06) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
})();

// Precompute 20 Triangular Faces of Icosahedron (for 3D crystal shading)
export const ICOSA_FACES: [number, number, number][] = (() => {
  const faces: [number, number, number][] = [];
  const edgeSet = new Set(ICOSA_EDGES.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`));
  for (let i = 0; i < RAW_ICOSA_VERTICES.length; i++) {
    for (let j = i + 1; j < RAW_ICOSA_VERTICES.length; j++) {
      if (!edgeSet.has(`${i}-${j}`)) continue;
      for (let k = j + 1; k < RAW_ICOSA_VERTICES.length; k++) {
        if (edgeSet.has(`${i}-${k}`) && edgeSet.has(`${j}-${k}`)) {
          faces.push([i, j, k]);
        }
      }
    }
  }
  return faces;
})();

// Precompute 12 Pentagonal Faces of Dodecahedron corresponding to the 12 Icosahedron dual vertices
export const DODECA_FACES: number[][] = (() => {
  const faces: number[][] = [];
  for (let i = 0; i < RAW_ICOSA_VERTICES.length; i++) {
    const ic = RAW_ICOSA_VERTICES[i];
    const scored = RAW_DODECA_VERTICES.map((dc, idx) => ({
      idx,
      dot: dc[0] * ic[0] + dc[1] * ic[1] + dc[2] * ic[2],
    })).sort((a, b) => b.dot - a.dot);

    const faceIndices = scored.slice(0, 5).map((s) => s.idx);

    // Order vertices cyclically along connected dodecahedral edges
    const edgeMap = new Map<number, number[]>();
    faceIndices.forEach((idx) => edgeMap.set(idx, []));
    DODECA_EDGES.forEach(([u, v]) => {
      if (edgeMap.has(u) && edgeMap.has(v)) {
        edgeMap.get(u)!.push(v);
        edgeMap.get(v)!.push(u);
      }
    });

    const ordered: number[] = [faceIndices[0]];
    while (ordered.length < 5) {
      const curr = ordered[ordered.length - 1];
      const nbrs = edgeMap.get(curr) || [];
      const next = nbrs.find((n) => !ordered.includes(n));
      if (next !== undefined) {
        ordered.push(next);
      } else {
        break;
      }
    }
    faces.push(ordered.length === 5 ? ordered : faceIndices);
  }
  return faces;
})();

// Precompute 60 Origami Folding Struts linking 12 Icosahedron vertices to 12 Dodecahedron pentagonal faces
export const FOLDING_LINKAGES: { icosaIdx: number; dodecaIdx: number }[] = (() => {
  const linkages: { icosaIdx: number; dodecaIdx: number }[] = [];
  DODECA_FACES.forEach((face, icosaIdx) => {
    face.forEach((dodecaIdx) => {
      linkages.push({ icosaIdx, dodecaIdx });
    });
  });
  return linkages;
})();

// 3D Rotation Function
export function rotate3D(
  p: [number, number, number],
  rotX: number,
  rotY: number,
  rotZ: number
): [number, number, number] {
  const [x, y, z] = p;
  // Rotate around Y
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;

  // Rotate around X
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  // Rotate around Z
  const cosZ = Math.cos(rotZ);
  const sinZ = Math.sin(rotZ);
  const x3 = x1 * cosZ - y2 * sinZ;
  const y3 = x1 * sinZ + y2 * cosZ;

  return [x3, y3, z2];
}

// Helper to compute holistic harmony statistics combining natal aspects & planetary-asteroid alignments
export function calculateDodecaIcosaHarmony(chart: FullNatalChart) {
  const asteroidHarmonics = detectPlanetaryAsteroidHarmonics(chart);
  const trines = chart.aspects.filter((a) => a.type === 'Trine');
  const sextiles = chart.aspects.filter((a) => a.type === 'Sextile');
  const quintiles = chart.aspects.filter((a) => a.type === 'Quintile' || a.type === 'BiQuintile');
  const squares = chart.aspects.filter((a) => a.type === 'Square');
  const oppositions = chart.aspects.filter((a) => a.type === 'Opposition');
  const grandTrines = chart.sacredPatterns.filter((p) => p.type === 'GrandTrine');
  const yods = chart.sacredPatterns.filter((p) => p.type === 'Yod');
  const kites = chart.sacredPatterns.filter((p) => p.type === 'Kite');

  const harmoniousAspectsCount = trines.length + sextiles.length + quintiles.length;
  const tensionAspectsCount = squares.length + oppositions.length;
  const totalCount = chart.aspects.length || 1;

  // Weighted harmony score incorporating planetary-asteroid harmonies
  const rawScore =
    (trines.length * 1.5 +
      sextiles.length * 1.2 +
      quintiles.length * 1.0 +
      grandTrines.length * 3.0 +
      asteroidHarmonics.aspects.length * 1.3) /
    (totalCount * 0.75 + 2.5);
  const harmonyQuotient = Math.min(99, Math.max(25, Math.round(rawScore * 100)));

  // True if chart has enough harmonious alignment or active asteroid resonances to trigger folding
  const hasHarmoniousResonance =
    harmoniousAspectsCount >= 2 ||
    grandTrines.length > 0 ||
    asteroidHarmonics.hasHarmoniousAspects;

  return {
    trines: trines.length,
    sextiles: sextiles.length,
    quintiles: quintiles.length,
    squares: squares.length,
    oppositions: oppositions.length,
    grandTrines: grandTrines.length,
    yods: yods.length,
    kites: kites.length,
    harmoniousAspectsCount,
    tensionAspectsCount,
    totalAspects: chart.aspects.length,
    harmonyQuotient,
    hasHarmoniousResonance,
    asteroidHarmonics,
  };
}

/**
 * SacredGeometryOverlay Component
 * Renders the 3D-Perspective Folding Engine that morphs between Dodecahedron and Icosahedron wireframes
 * driven by harmonious aspects detected between planetary and asteroid bodies.
 */
export const SacredGeometryOverlay: React.FC<SacredGeometryOverlayProps> = ({
  chart,
  showSacredGeometry,
  selectedPlanetId,
  hoveredPlanetId,
  getCoordinates,
  centerX = 450,
  centerY = 450,
  hubRadius = 230,
  activeFilter: controlledFilter,
  isFoldingActive: controlledFolding,
  manualFold: controlledManualFold,
  autoRotate: controlledAutoRotate,
  webPulsesEnabled: controlledWebPulses,
  rotationAngle: controlledRotAngle,
  foldingMode: controlledFoldingMode,
  activeHarmoniousAspectId,
  showAsteroidBeams = true,
  perspectiveDepth = 3.8,
  showCrystalFaces = true,
  onSelectHarmonicAspect,
}) => {
  // Internal state fallbacks
  const [internalFilter] = useState<SacredFilterType>('compound');
  const [internalFolding] = useState<boolean>(true);
  const [internalManualFold] = useState<number>(0.5);
  const [internalAutoRotate] = useState<boolean>(true);
  const [internalWebPulses] = useState<boolean>(true);
  const [internalFoldingMode] = useState<FoldingMode>('auto');
  const [internalRotAngle, setInternalRotAngle] = useState<{ x: number; y: number; z: number }>({
    x: 0.38,
    y: 0.54,
    z: 0.12,
  });

  const activeFilter = controlledFilter ?? internalFilter;
  const isFoldingActive = controlledFolding ?? internalFolding;
  const manualFold = controlledManualFold ?? internalManualFold;
  const autoRotate = controlledAutoRotate ?? internalAutoRotate;
  const webPulsesEnabled = controlledWebPulses ?? internalWebPulses;
  const rotAngle = controlledRotAngle ?? internalRotAngle;
  const foldingMode = controlledFoldingMode ?? internalFoldingMode;

  // Animated continuous fold state with smooth physics interpolation
  const [currentFoldProgress, setCurrentFoldProgress] = useState<number>(0.5);
  const animFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());

  // Detect harmonious alignments between planetary and asteroid bodies
  const harmonyStats = useMemo(() => calculateDodecaIcosaHarmony(chart), [chart]);
  const asteroidHarmonics = harmonyStats.asteroidHarmonics;

  // Active target fold determined by detected aspect types:
  // - Trines pull towards Icosahedron (progress -> 0.92)
  // - Quintiles pull towards Dodecahedron (progress -> 0.08)
  // - Mixed/Sextiles stabilize around the interlocked Keplerian compound (0.50)
  const aspectTargetFold = useMemo(() => {
    if (activeHarmoniousAspectId) {
      const asp = asteroidHarmonics.aspects.find((a) => a.id === activeHarmoniousAspectId);
      if (asp) {
        if (asp.targetGeometry === 'icosahedron') return 0.92;
        if (asp.targetGeometry === 'dodecahedron') return 0.08;
        return 0.5;
      }
    }
    return asteroidHarmonics.targetFoldProgress;
  }, [activeHarmoniousAspectId, asteroidHarmonics]);

  // Main 3D Perspective Animation & Morphing Loop
  useEffect(() => {
    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // 3D Orbital Drift
      if (autoRotate && controlledRotAngle === undefined) {
        setInternalRotAngle((prev) => ({
          x: (prev.x + dt * 0.18) % (Math.PI * 2),
          y: (prev.y + dt * 0.28) % (Math.PI * 2),
          z: (prev.z + dt * 0.08) % (Math.PI * 2),
        }));
      }

      // 3D Folding Engine Computation
      if (foldingMode === 'auto') {
        if (isFoldingActive) {
          // If harmonious aspects detected: blend toward aspect target fold with subtle golden-harmonic respiration
          const target = aspectTargetFold;
          const pulse =
            asteroidHarmonics.hasHarmoniousAspects
              ? Math.sin(now * 0.0016) * 0.09 * (asteroidHarmonics.harmonicResonanceIndex / 100)
              : Math.sin(now * 0.0012) * 0.04;

          setCurrentFoldProgress((prev) => {
            const desired = Math.min(0.98, Math.max(0.02, target + pulse));
            // Smooth spring damping towards target
            return prev + (desired - prev) * (1 - Math.exp(-dt * 2.8));
          });
        }
      } else if (foldingMode === 'breath') {
        if (isFoldingActive) {
          // Continuous breathing oscillation between Dodecahedron (0.05) and Icosahedron (0.95)
          const t = now * 0.0015;
          const breath = 0.5 + 0.44 * Math.sin(t);
          setCurrentFoldProgress(breath);
        }
      } else {
        // Manual control
        setCurrentFoldProgress(manualFold);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoRotate, isFoldingActive, foldingMode, manualFold, aspectTargetFold, asteroidHarmonics, controlledRotAngle]);

  // Effective folding progress value (0 = Pure Dodecahedron, 1 = Pure Icosahedron)
  const effectiveFold = foldingMode === 'manual' ? manualFold : currentFoldProgress;

  // 3D Perspective Projection Function (Camera linear depth division)
  const projectPoint3D = (
    p: [number, number, number],
    radius: number,
    camDistance = perspectiveDepth
  ): { x: number; y: number; z: number; persp: number } => {
    const rotated = rotate3D(p, rotAngle.x, rotAngle.y, rotAngle.z);
    const pZ = rotated[2]; // [-1, 1]
    // Linear camera perspective foreshortening factor:
    const safeCamDist = Math.max(1.8, camDistance);
    const persp = safeCamDist / (safeCamDist - pZ * 0.95);
    const x = centerX + rotated[0] * radius * persp;
    const y = centerY + rotated[1] * radius * persp;
    return { x, y, z: pZ, persp };
  };

  // Base radii for polyhedral wireframes:
  // - As effectiveFold -> 0 (Dodecahedron): Dodecahedron expands, Icosahedron tucks into face centers
  // - As effectiveFold -> 1 (Icosahedron): Icosahedron expands, Dodecahedron contracts inward
  const basePolyRadius = hubRadius * 0.56;
  const dodecaRadius = basePolyRadius * (1.18 - effectiveFold * 0.42);
  const icosaRadius = basePolyRadius * (0.64 + effectiveFold * 0.52);

  // Project Icosahedron vertices (12 Vertices / Water Archetype)
  const icosaProjected = useMemo(() => {
    return RAW_ICOSA_VERTICES.map((v) => projectPoint3D(v, icosaRadius));
  }, [rotAngle, icosaRadius, centerX, centerY, perspectiveDepth]);

  // Project Dodecahedron vertices (20 Vertices / Aether Archetype)
  const dodecaProjected = useMemo(() => {
    return RAW_DODECA_VERTICES.map((v) => projectPoint3D(v, dodecaRadius));
  }, [rotAngle, dodecaRadius, centerX, centerY, perspectiveDepth]);

  // Dynamic 60 Origami Folding Linkages (Interconnecting Dodecahedron & Icosahedron duals in 3D perspective)
  const projectedStruts = useMemo(() => {
    if (!harmonyStats.hasHarmoniousResonance && !isFoldingActive && manualFold === 0) return [];
    return FOLDING_LINKAGES.map(({ icosaIdx, dodecaIdx }) => {
      const p1 = icosaProjected[icosaIdx];
      const p2 = dodecaProjected[dodecaIdx];
      const avgZ = (p1.z + p2.z) / 2;
      // Struts flare brightest during mid-transition (effectiveFold ~ 0.5)
      const morphFactor = Math.sin(effectiveFold * Math.PI);
      const opacity = Math.max(0.08, (0.45 + avgZ * 0.35) * (0.25 + morphFactor * 0.75));
      return { p1, p2, opacity, avgZ };
    });
  }, [icosaProjected, dodecaProjected, effectiveFold, isFoldingActive, manualFold, harmonyStats.hasHarmoniousResonance]);

  // 3D Translucent Faces sorted by depth for genuine crystal gem illumination
  const shadedIcosaFaces = useMemo(() => {
    if (!showCrystalFaces || effectiveFold < 0.15) return [];
    return ICOSA_FACES.map(([i, j, k]) => {
      const p1 = icosaProjected[i];
      const p2 = icosaProjected[j];
      const p3 = icosaProjected[k];
      const avgZ = (p1.z + p2.z + p3.z) / 3;
      return {
        points: `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`,
        avgZ,
        opacity: Math.max(0.04, (0.08 + avgZ * 0.08) * effectiveFold),
      };
    }).sort((a, b) => a.avgZ - b.avgZ);
  }, [icosaProjected, effectiveFold, showCrystalFaces]);

  const shadedDodecaFaces = useMemo(() => {
    if (!showCrystalFaces || effectiveFold > 0.85) return [];
    return DODECA_FACES.map((face) => {
      const pts = face.map((idx) => dodecaProjected[idx]);
      const avgZ = pts.reduce((acc, p) => acc + p.z, 0) / pts.length;
      const points = pts.map((p) => `${p.x},${p.y}`).join(' ');
      return {
        points,
        avgZ,
        opacity: Math.max(0.04, (0.09 + avgZ * 0.09) * (1 - effectiveFold)),
      };
    }).sort((a, b) => a.avgZ - b.avgZ);
  }, [dodecaProjected, effectiveFold, showCrystalFaces]);

  // Planetary-Asteroid Harmonious Beams linking wheel asteroids & planets directly to 3D folding engine
  const planetaryAsteroidBeams = useMemo(() => {
    if (!showAsteroidBeams || !showSacredGeometry) return [];
    const beams: {
      aspect: PlanetaryAsteroidAspect;
      planetCoord: { x: number; y: number };
      asteroidCoord: { x: number; y: number };
      hubTargetPoint: { x: number; y: number; z: number };
      color: string;
      isActive: boolean;
    }[] = [];

    asteroidHarmonics.aspects.forEach((asp, idx) => {
      const planetCoord = getCoordinates(asp.planetLongitude, hubRadius);
      const asteroidCoord = getCoordinates(asp.asteroidLongitude, hubRadius - 6);

      // Target vertex on the folding engine:
      // Trines target icosahedron; Quintiles target dodecahedron; Conjunctions/Sextiles target alternating
      const targetPoint =
        asp.targetGeometry === 'icosahedron'
          ? icosaProjected[idx % icosaProjected.length]
          : dodecaProjected[idx % dodecaProjected.length];

      const isActive =
        activeHarmoniousAspectId === asp.id ||
        selectedPlanetId === asp.planetId ||
        hoveredPlanetId === asp.planetId;

      beams.push({
        aspect: asp,
        planetCoord,
        asteroidCoord,
        hubTargetPoint: targetPoint,
        color:
          asp.aspectType === 'Trine'
            ? '#38bdf8'
            : asp.aspectType === 'Quintile' || asp.aspectType === 'BiQuintile'
            ? '#D4AF37'
            : '#34d399',
        isActive,
      });
    });

    return beams;
  }, [
    showAsteroidBeams,
    showSacredGeometry,
    asteroidHarmonics.aspects,
    getCoordinates,
    hubRadius,
    icosaProjected,
    dodecaProjected,
    activeHarmoniousAspectId,
    selectedPlanetId,
    hoveredPlanetId,
  ]);

  // Filtered standard natal aspect lines for the web
  const webAspects = useMemo(() => {
    return chart.aspects.filter((aspect) => {
      if (activeFilter === 'all' || activeFilter === 'compound') return true;
      if (activeFilter === 'harmonious') {
        return ['Trine', 'Sextile', 'Quintile', 'BiQuintile'].includes(aspect.type);
      }
      if (activeFilter === 'tension') {
        return ['Square', 'Opposition'].includes(aspect.type);
      }
      if (activeFilter === 'dodeca') {
        return ['Quintile', 'BiQuintile', 'Sextile', 'Trine'].includes(aspect.type);
      }
      if (activeFilter === 'icosa') {
        return ['Trine', 'Sextile'].includes(aspect.type);
      }
      if (activeFilter === 'asteroids') {
        return false; // Asteroid mode focuses specifically on asteroid-planetary chords
      }
      return true;
    });
  }, [chart.aspects, activeFilter]);

  if (!showSacredGeometry) return null;

  return (
    <g id="sacred-geometry-astrological-web" className="select-none pointer-events-none">
      <defs>
        {/* Prismatic Shimmer Gradient for Dodecaicosahedron compound */}
        <linearGradient id="foldBeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.95" />
        </linearGradient>

        {/* Trine Harmonic Azure Pulse Gradient */}
        <linearGradient id="trineWebPulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
        </linearGradient>

        {/* Sextile Emerald Shimmer Gradient */}
        <linearGradient id="sextileWebPulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
        </linearGradient>

        {/* Dodecahedron Core Gold Glow Filter */}
        <filter id="dodecaGlow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="3.0" result="blur1" />
          <feGaussianBlur stdDeviation="6.0" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Hyper Stellation Glow Filter */}
        <filter id="hyperGlow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2.2 -0.1"
            result="contrastGlow"
          />
          <feMerge>
            <feMergeNode in="contrastGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ========================================================= */}
      {/* 1. BACKGROUND SACRED HARMONIC MESH & PHI LATTICE          */}
      {/* ========================================================= */}
      <g opacity="0.38" className="transition-opacity duration-300">
        <circle
          cx={centerX}
          cy={centerY}
          r={hubRadius * 0.382}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.8"
          strokeDasharray="3 4"
          opacity="0.6"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={hubRadius * 0.618}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="0.9"
          strokeDasharray="4 6"
          opacity="0.5"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={hubRadius * 0.854}
          fill="none"
          stroke="#c084fc"
          strokeWidth="0.75"
          strokeDasharray="2 5"
          opacity="0.4"
        />

        {/* 12-Fold Sacred Decagon / Dodecagram Axis Chords */}
        {Array.from({ length: 6 }).map((_, idx) => {
          const angle = (idx * 30 * Math.PI) / 180;
          const x1 = centerX + hubRadius * Math.cos(angle);
          const y1 = centerY + hubRadius * Math.sin(angle);
          const x2 = centerX - hubRadius * Math.cos(angle);
          const y2 = centerY - hubRadius * Math.sin(angle);
          return (
            <line
              key={`sacred-diam-${idx}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#26262b"
              strokeWidth="0.8"
              strokeDasharray="2 8"
            />
          );
        })}
      </g>

      {/* ========================================================= */}
      {/* 2. DETECTED SACRED GEOMETRY FORMATION POLYGONS             */}
      {/* ========================================================= */}
      {chart.sacredPatterns.map((pat) => {
        const points = pat.planets
          .map((pId) => {
            const p = chart.planets.find((pl) => pl.id === pId);
            if (!p) return null;
            const c = getCoordinates(p.longitude, hubRadius - 12);
            return `${c.x},${c.y}`;
          })
          .filter(Boolean)
          .join(' ');

        let fillColor = 'rgba(56, 189, 248, 0.08)';
        let strokeColor = pat.color;
        if (pat.type === 'GrandTrine') {
          fillColor = 'rgba(212, 175, 55, 0.14)';
          strokeColor = '#D4AF37';
        } else if (pat.type === 'TSquare') {
          fillColor = 'rgba(239, 68, 68, 0.10)';
        } else if (pat.type === 'Yod') {
          fillColor = 'rgba(249, 115, 22, 0.12)';
        }

        return (
          <g key={pat.id}>
            <polygon
              points={points}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={pat.type === 'GrandTrine' ? '2.4' : '1.6'}
              strokeDasharray={pat.type === 'GrandTrine' ? '6 3' : '4 4'}
              filter="url(#hyperGlow)"
              className="animate-pulse"
              opacity="0.85"
            />
          </g>
        );
      })}

      {/* ========================================================= */}
      {/* 3. HIGH-FIDELITY ASTROLOGICAL WEB (Aspect Chords)         */}
      {/* ========================================================= */}
      <g id="astrological-web-chords">
        {webAspects.map((aspect, idx) => {
          const p1 = chart.planets.find((p) => p.id === aspect.planet1);
          const p2 = chart.planets.find((p) => p.id === aspect.planet2);
          if (!p1 || !p2) return null;

          const c1 = getCoordinates(p1.longitude, hubRadius);
          const c2 = getCoordinates(p2.longitude, hubRadius);

          const isInspected =
            selectedPlanetId === null ||
            selectedPlanetId === p1.id ||
            selectedPlanetId === p2.id ||
            hoveredPlanetId === p1.id ||
            hoveredPlanetId === p2.id;

          const isHarmonious = ['Trine', 'Sextile', 'Quintile', 'BiQuintile'].includes(aspect.type);
          const baseOpacity = isInspected ? (isHarmonious ? 0.92 : 0.75) : 0.12;
          const strokeWidth = isInspected ? (aspect.orb < 1.5 ? 2.4 : 1.5) : 0.6;
          const animDuration = Math.max(2.4, aspect.orb * 2 + 2);

          return (
            <g key={`web-aspect-${idx}`} className="transition-opacity duration-300">
              <line
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke={aspect.color}
                strokeWidth={strokeWidth}
                opacity={baseOpacity}
                strokeLinecap="round"
              />

              {webPulsesEnabled && isInspected && isHarmonious && (
                <line
                  x1={c1.x}
                  y1={c1.y}
                  x2={c2.x}
                  y2={c2.y}
                  stroke={aspect.type === 'Trine' ? 'url(#trineWebPulse)' : 'url(#sextileWebPulse)'}
                  strokeWidth={strokeWidth + 1.2}
                  strokeDasharray="12 28"
                  strokeLinecap="round"
                  opacity="0.8"
                  filter="url(#hyperGlow)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="160"
                    dur={`${animDuration}s`}
                    repeatCount="indefinite"
                  />
                </line>
              )}

              {isInspected && (
                <>
                  <circle
                    cx={c1.x}
                    cy={c1.y}
                    r={aspect.orb < 1.0 ? 3.5 : 2.5}
                    fill={aspect.color}
                    opacity="0.85"
                  />
                  <circle
                    cx={c2.x}
                    cy={c2.y}
                    r={aspect.orb < 1.0 ? 3.5 : 2.5}
                    fill={aspect.color}
                    opacity="0.85"
                  />
                </>
              )}
            </g>
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 4. PLANETARY-ASTEROID HARMONIC RESONANCE RAYS (Energy Chords into 3D Engine) */}
      {/* ========================================================================= */}
      {showAsteroidBeams && planetaryAsteroidBeams.length > 0 && (
        <g id="planetary-asteroid-harmonic-beams" className="transition-all duration-300">
          {planetaryAsteroidBeams.map((beam, bIdx) => {
            const asp = beam.aspect;
            const isHighlight =
              beam.isActive ||
              activeHarmoniousAspectId === null ||
              activeHarmoniousAspectId === undefined;
            const beamOpacity = isHighlight ? 0.75 : 0.15;
            const strokeW = isHighlight ? 1.4 : 0.8;

            return (
              <g key={`ast-beam-${asp.id}-${bIdx}`}>
                {/* Connecting chord between Planet and Asteroid across the wheel perimeter */}
                <line
                  x1={beam.planetCoord.x}
                  y1={beam.planetCoord.y}
                  x2={beam.asteroidCoord.x}
                  y2={beam.asteroidCoord.y}
                  stroke={beam.color}
                  strokeWidth={strokeW}
                  strokeDasharray="3 5"
                  opacity={beamOpacity * 0.7}
                />

                {/* Resonant Energy Ray projecting directly into central 3D folding vertex */}
                <line
                  x1={beam.asteroidCoord.x}
                  y1={beam.asteroidCoord.y}
                  x2={beam.hubTargetPoint.x}
                  y2={beam.hubTargetPoint.y}
                  stroke={beam.color}
                  strokeWidth={strokeW + 0.4}
                  strokeDasharray={asp.aspectType === 'Trine' ? '6 4' : '4 3'}
                  filter="url(#hyperGlow)"
                  opacity={beamOpacity}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="60"
                    to="0"
                    dur={`${2.5 + (bIdx % 3) * 0.8}s`}
                    repeatCount="indefinite"
                  />
                </line>

                {/* Traveling photon packet pulsing from asteroid into folding hub */}
                {isHighlight && (
                  <circle r="2.4" fill={beam.color} filter="url(#hyperGlow)">
                    <animateMotion
                      path={`M ${beam.asteroidCoord.x} ${beam.asteroidCoord.y} L ${beam.hubTargetPoint.x} ${beam.hubTargetPoint.y}`}
                      dur={`${2.8 + (bIdx % 4) * 0.6}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Asteroid Ecliptic Marker Node on inner wheel perimeter */}
                <g className="pointer-events-auto cursor-pointer" onClick={() => onSelectHarmonicAspect?.(asp.id)}>
                  <circle
                    cx={beam.asteroidCoord.x}
                    cy={beam.asteroidCoord.y}
                    r={beam.isActive ? 4.5 : 3.0}
                    fill={beam.color}
                    stroke="#08080A"
                    strokeWidth="1.2"
                    filter="url(#hyperGlow)"
                    opacity={beamOpacity + 0.2}
                  />
                  {beam.isActive && (
                    <circle
                      cx={beam.asteroidCoord.x}
                      cy={beam.asteroidCoord.y}
                      r="7.5"
                      fill="none"
                      stroke={beam.color}
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                      className="animate-spin"
                    />
                  )}
                </g>
              </g>
            );
          })}
        </g>
      )}

      {/* ========================================================================= */}
      {/* 5. 3D-PERSPECTIVE 'FOLDING ENGINE' (Dodecahedron <-> Icosahedron Wireframes) */}
      {/* ========================================================================= */}
      <g id="3d-perspective-folding-engine" className="transition-all duration-300">
        {/* Dynamic Harmonic Halo Flare based on folding progression and resonance */}
        {harmonyStats.hasHarmoniousResonance && (
          <circle
            cx={centerX}
            cy={centerY}
            r={basePolyRadius * (0.85 + effectiveFold * 0.35)}
            fill="none"
            stroke="url(#foldBeamGradient)"
            strokeWidth={1.4 + effectiveFold * 1.6}
            strokeDasharray="8 12"
            opacity={0.3 + effectiveFold * 0.45}
            filter="url(#dodecaGlow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${centerX} ${centerY}`}
              to={`360 ${centerX} ${centerY}`}
              dur="45s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* 5A. 3D TRANSLUCENT CRYSTAL FACES (Shaded Depth) */}
        {showCrystalFaces && (
          <g id="folding-engine-crystal-faces">
            {/* Shaded Dodecahedral Pentagonal Faces */}
            {(activeFilter === 'all' || activeFilter === 'dodeca' || activeFilter === 'compound') &&
              shadedDodecaFaces.map((face, fIdx) => (
                <polygon
                  key={`dodeca-face-${fIdx}`}
                  points={face.points}
                  fill="#D4AF37"
                  fillOpacity={face.opacity}
                  stroke="#D4AF37"
                  strokeWidth="0.5"
                  strokeOpacity={face.opacity * 1.5}
                />
              ))}

            {/* Shaded Icosahedral Triangular Faces */}
            {(activeFilter === 'all' || activeFilter === 'icosa' || activeFilter === 'compound') &&
              shadedIcosaFaces.map((face, fIdx) => (
                <polygon
                  key={`icosa-face-${fIdx}`}
                  points={face.points}
                  fill="#38bdf8"
                  fillOpacity={face.opacity}
                  stroke="#38bdf8"
                  strokeWidth="0.5"
                  strokeOpacity={face.opacity * 1.5}
                />
              ))}
          </g>
        )}

        {/* 5B. 60 DYNAMIC ORIGAMI FOLDING LINKAGES (Struts connecting the Duals) */}
        {(activeFilter === 'compound' || isFoldingActive || manualFold > 0) &&
          projectedStruts.map((strut, sIdx) => (
            <line
              key={`folding-linkage-${sIdx}`}
              x1={strut.p1.x}
              y1={strut.p1.y}
              x2={strut.p2.x}
              y2={strut.p2.y}
              stroke="url(#foldBeamGradient)"
              strokeWidth={0.85 + (strut.avgZ > 0 ? 0.35 : 0)}
              strokeDasharray={effectiveFold > 0.75 || effectiveFold < 0.25 ? '3 3' : undefined}
              opacity={strut.opacity}
              filter={strut.avgZ > 0.3 ? 'url(#hyperGlow)' : undefined}
            />
          ))}

        {/* 5C. DODECAHEDRON WIREFRAME (12 Pentagons / 30 Edges / 20 Vertices / Aether Archetype) */}
        {(activeFilter === 'all' || activeFilter === 'dodeca' || activeFilter === 'compound') && (
          <g id="dodecahedron-3d-wireframe">
            {DODECA_EDGES.map(([i, j], eIdx) => {
              const p1 = dodecaProjected[i];
              const p2 = dodecaProjected[j];
              const avgZ = (p1.z + p2.z) / 2;
              // Diminishes as effectiveFold -> 1 (morphs toward icosahedron)
              const foldAlpha = Math.max(0.12, 1.0 - effectiveFold * 0.85);
              const depthOpacity = Math.max(0.12, (0.75 + avgZ * 0.35) * foldAlpha);
              const strokeW = (1.4 + (avgZ > 0 ? 0.6 : 0)) * (0.6 + foldAlpha * 0.4);

              return (
                <line
                  key={`dodeca-edge-${eIdx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#D4AF37"
                  strokeWidth={strokeW}
                  opacity={depthOpacity}
                  filter={avgZ > 0.2 && foldAlpha > 0.5 ? 'url(#dodecaGlow)' : undefined}
                />
              );
            })}

            {/* Dodecahedron 20 Vertex Nodes */}
            {dodecaProjected.map((pt, vIdx) => {
              const foldAlpha = Math.max(0.15, 1.0 - effectiveFold * 0.85);
              const nodeOpacity = Math.max(0.18, (0.85 + pt.z * 0.4) * foldAlpha);
              return (
                <circle
                  key={`dodeca-v-${vIdx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={(pt.z > 0 ? 2.8 : 1.8) * pt.persp * 0.75}
                  fill="#D4AF37"
                  stroke="#151517"
                  strokeWidth="0.75"
                  opacity={nodeOpacity}
                />
              );
            })}
          </g>
        )}

        {/* 5D. ICOSAHEDRON WIREFRAME (20 Triangles / 30 Edges / 12 Vertices / Water Archetype) */}
        {(activeFilter === 'all' || activeFilter === 'icosa' || activeFilter === 'compound') && (
          <g id="icosahedron-3d-wireframe">
            {ICOSA_EDGES.map(([i, j], eIdx) => {
              const p1 = icosaProjected[i];
              const p2 = icosaProjected[j];
              const avgZ = (p1.z + p2.z) / 2;
              // Expands as effectiveFold -> 1 (morphs toward icosahedron)
              const foldAlpha = Math.max(0.12, 0.15 + effectiveFold * 0.85);
              const depthOpacity = Math.max(0.12, (0.7 + avgZ * 0.35) * foldAlpha);
              const strokeW = (1.3 + (avgZ > 0 ? 0.5 : 0)) * (0.6 + foldAlpha * 0.4);

              return (
                <line
                  key={`icosa-edge-${eIdx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#38bdf8"
                  strokeWidth={strokeW}
                  strokeDasharray={effectiveFold < 0.4 ? '5 2' : undefined}
                  opacity={depthOpacity}
                  filter={avgZ > 0.25 && foldAlpha > 0.5 ? 'url(#hyperGlow)' : undefined}
                />
              );
            })}

            {/* Icosahedron 12 Celestial Vertex Nodes */}
            {icosaProjected.map((pt, vIdx) => {
              const foldAlpha = Math.max(0.15, 0.2 + effectiveFold * 0.8);
              const nodeOpacity = Math.max(0.2, (0.85 + pt.z * 0.35) * foldAlpha);
              return (
                <g key={`icosa-v-${vIdx}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={(pt.z > 0 ? 3.2 : 2.0) * pt.persp * 0.75}
                    fill="#38bdf8"
                    stroke="#08080A"
                    strokeWidth="0.75"
                    opacity={nodeOpacity}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* 5E. STELLATION CENTRAL CORE */}
        {harmonyStats.hasHarmoniousResonance && (
          <g id="dodecaicosa-stellation-core">
            <circle
              cx={centerX}
              cy={centerY}
              r={12 + effectiveFold * 10}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.2"
              opacity={0.35 + effectiveFold * 0.55}
              filter="url(#hyperGlow)"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={4}
              fill="#ffffff"
              opacity="0.95"
              filter="url(#hyperGlow)"
            />
          </g>
        )}
      </g>
    </g>
  );
};

export interface SacredGeometryHUDProps {
  chart: FullNatalChart;
  activeFilter: SacredFilterType;
  setActiveFilter: (f: SacredFilterType) => void;
  isFoldingActive: boolean;
  setIsFoldingActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  manualFold: number;
  setManualFold: (v: number) => void;
  autoRotate: boolean;
  setAutoRotate: (r: boolean | ((prev: boolean) => boolean)) => void;
  webPulsesEnabled: boolean;
  setWebPulsesEnabled: (p: boolean | ((prev: boolean) => boolean)) => void;
  zoomLevel: number;
  setZoomLevel: (fn: (z: number) => number) => void;
  // Folding Engine Options
  foldingMode?: FoldingMode;
  setFoldingMode?: (mode: FoldingMode) => void;
  activeHarmoniousAspectId?: string | null;
  setActiveHarmoniousAspectId?: (id: string | null) => void;
  perspectiveDepth?: number;
  setPerspectiveDepth?: (depth: number) => void;
  showCrystalFaces?: boolean;
  setShowCrystalFaces?: (show: boolean | ((prev: boolean) => boolean)) => void;
  showAsteroidBeams?: boolean;
  setShowAsteroidBeams?: (show: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * SacredGeometryHUD
 * Interactive floating HUD controls providing complete mastery over the Astrological Web,
 * Planetary-Asteroid Harmonious Aspect detection, and the 3D-perspective Folding Engine.
 */
export const SacredGeometryHUD: React.FC<SacredGeometryHUDProps> = ({
  chart,
  activeFilter,
  setActiveFilter,
  isFoldingActive,
  setIsFoldingActive,
  manualFold,
  setManualFold,
  autoRotate,
  setAutoRotate,
  webPulsesEnabled,
  setWebPulsesEnabled,
  zoomLevel,
  setZoomLevel,
  foldingMode = 'auto',
  setFoldingMode,
  activeHarmoniousAspectId = null,
  setActiveHarmoniousAspectId,
  perspectiveDepth = 3.8,
  setPerspectiveDepth,
  showCrystalFaces = true,
  setShowCrystalFaces,
  showAsteroidBeams = true,
  setShowAsteroidBeams,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showAspectsDrawer, setShowAspectsDrawer] = useState<boolean>(false);

  const stats = useMemo(() => calculateDodecaIcosaHarmony(chart), [chart]);
  const asteroidHarmonics = stats.asteroidHarmonics;

  return (
    <>
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 bg-[#0C0C0E]/95 backdrop-blur-md p-2.5 rounded-xl border border-[#222] shadow-2xl text-xs w-[295px] max-w-[calc(100vw-24px)] select-none">
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#222]">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-semibold text-[#D1D1D1] text-[11px] tracking-wide">
              Sacred Geometry &amp; Folding Engine
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded text-[#888] hover:text-[#D4AF37] hover:bg-[#1A1A1C] transition-colors cursor-pointer"
              title="Keplerian Dual Polyhedra & Folding Engine Principles"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-[#888] hover:text-[#D1D1D1] hover:bg-[#1A1A1C] transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse controls' : 'Expand controls'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live Harmonious Resonance & Asteroid Coupling Badge */}
        <div className="bg-[#151517] p-2 rounded-lg border border-[#222]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#888] font-mono flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  stats.hasHarmoniousResonance ? 'bg-[#D4AF37] animate-pulse' : 'bg-[#38bdf8]'
                }`}
              />
              Harmonious Resonance
            </span>
            <span className="font-mono font-bold text-[#D4AF37] text-xs">
              {stats.harmonyQuotient}%
            </span>
          </div>

          <div className="w-full bg-[#0C0C0E] h-1.5 rounded-full mt-1.5 overflow-hidden border border-[#333]">
            <div
              className="h-full bg-gradient-to-r from-[#38bdf8] via-[#D4AF37] to-[#eab308] transition-all duration-500"
              style={{ width: `${stats.harmonyQuotient}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#888] mt-1.5 pt-1 border-t border-[#222]">
            <span>△ {stats.trines} Trines</span>
            <span>✶ {stats.sextiles} Sext</span>
            <span>⬠ {stats.quintiles} Quint</span>
            <span className="text-[#38bdf8] font-semibold">
              ☄ {asteroidHarmonics.totalHarmonies} Ast
            </span>
          </div>
        </div>

        {/* Active Planetary-Asteroid Harmonies Banner */}
        {asteroidHarmonics.totalHarmonies > 0 && (
          <div className="bg-[#121215] p-2 rounded-lg border border-[#2d2d35] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold text-[#38bdf8] flex items-center gap-1">
                <Orbit className="w-3 h-3 text-[#38bdf8]" />
                {asteroidHarmonics.totalHarmonies} Planet-Asteroid Harmonies
              </span>
              <button
                onClick={() => setShowAspectsDrawer(!showAspectsDrawer)}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1A1A1C] hover:bg-[#25252b] text-[#D1D1D1] transition-colors cursor-pointer"
              >
                {showAspectsDrawer ? 'Hide' : 'View All'}
              </button>
            </div>

            {/* Quick aspect highlights (Top 2) */}
            <div className="space-y-1">
              {asteroidHarmonics.aspects.slice(0, 2).map((asp) => {
                const isSelected = activeHarmoniousAspectId === asp.id;
                return (
                  <button
                    key={asp.id}
                    onClick={() =>
                      setActiveHarmoniousAspectId?.(isSelected ? null : asp.id)
                    }
                    className={`w-full text-left p-1 rounded text-[10px] font-mono transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/60'
                        : 'bg-[#0a0a0c] text-[#94a3b8] hover:bg-[#151517] hover:text-[#D1D1D1]'
                    }`}
                  >
                    <span className="truncate">
                      {asp.planetGlyph} {asp.planetName} {asp.aspectType === 'Trine' ? '△' : asp.aspectType === 'Sextile' ? '✶' : '⬠'} ({asp.asteroidId}) {asp.asteroidName}
                    </span>
                    <span className="shrink-0 text-[#D4AF37] ml-1">
                      {asp.orbDeg.toFixed(1)}°
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Expanded aspects drawer if requested */}
            {showAspectsDrawer && (
              <div className="max-h-32 overflow-y-auto space-y-1 pt-1 border-t border-[#222]">
                {asteroidHarmonics.aspects.slice(2).map((asp) => {
                  const isSelected = activeHarmoniousAspectId === asp.id;
                  return (
                    <button
                      key={asp.id}
                      onClick={() =>
                        setActiveHarmoniousAspectId?.(isSelected ? null : asp.id)
                      }
                      className={`w-full text-left p-1 rounded text-[9.5px] font-mono transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/60'
                          : 'bg-[#08080a] text-[#888] hover:bg-[#151517] hover:text-[#D1D1D1]'
                      }`}
                    >
                      <span className="truncate">
                        {asp.planetGlyph} {asp.planetName} {asp.aspectType === 'Trine' ? '△' : asp.aspectType === 'Sextile' ? '✶' : '⬠'} ({asp.asteroidId}) {asp.asteroidName}
                      </span>
                      <span className="shrink-0 text-[#D4AF37] ml-1">
                        {asp.orbDeg.toFixed(1)}°
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="space-y-2.5 pt-0.5">
            {/* 3D Folding Engine Controls */}
            <div className="bg-[#151517] p-2 rounded-lg border border-[#222] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#D4AF37]" />
                  3D Folding Engine
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setIsFoldingActive((prev) => !prev)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer ${
                      isFoldingActive
                        ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/60'
                        : 'text-[#888] hover:text-[#D1D1D1] bg-[#0C0C0E]'
                    }`}
                    title="Toggle active folding motion"
                  >
                    {isFoldingActive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                    {isFoldingActive ? 'Active' : 'Frozen'}
                  </button>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="grid grid-cols-3 gap-1 text-[9.5px] font-mono pt-0.5">
                <button
                  onClick={() => setFoldingMode?.('auto')}
                  className={`py-1 rounded text-center transition-colors cursor-pointer ${
                    foldingMode === 'auto'
                      ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 font-bold'
                      : 'text-[#777] hover:text-[#bbb] bg-[#0C0C0E]'
                  }`}
                  title="Resonance Auto: Adapts folding to planetary and asteroid aspect harmonics"
                >
                  Resonance
                </button>
                <button
                  onClick={() => setFoldingMode?.('breath')}
                  className={`py-1 rounded text-center transition-colors cursor-pointer ${
                    foldingMode === 'breath'
                      ? 'bg-[#1A1A1C] text-[#38bdf8] border border-[#38bdf8]/50 font-bold'
                      : 'text-[#777] hover:text-[#bbb] bg-[#0C0C0E]'
                  }`}
                  title="Golden Breath: Oscillates continuously along Phi wave"
                >
                  Φ Breath
                </button>
                <button
                  onClick={() => setFoldingMode?.('manual')}
                  className={`py-1 rounded text-center transition-colors cursor-pointer ${
                    foldingMode === 'manual'
                      ? 'bg-[#1A1A1C] text-[#e2e8f0] border border-[#555] font-bold'
                      : 'text-[#777] hover:text-[#bbb] bg-[#0C0C0E]'
                  }`}
                  title="Manual Morph: Direct slider control"
                >
                  Manual
                </button>
              </div>

              {/* Manual Fold Slider */}
              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between text-[10px] font-mono text-[#888]">
                  <span>⬠ Dodeca (0%)</span>
                  <span className="text-[#D4AF37]">
                    {foldingMode === 'manual'
                      ? `${Math.round(manualFold * 100)}%`
                      : foldingMode === 'auto'
                      ? 'Harmonic Morph'
                      : 'Φ Cycle'}
                  </span>
                  <span>△ Icosa (100%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={manualFold}
                  disabled={foldingMode !== 'manual'}
                  onChange={(e) => setManualFold(parseFloat(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer disabled:opacity-40 h-1 bg-[#0C0C0E] rounded"
                />
              </div>
            </div>

            {/* Geometry Layers Filters */}
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#666] font-mono block mb-1">
                Geometry Layers
              </span>
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <button
                  onClick={() => setActiveFilter('compound')}
                  className={`px-1.5 py-1 rounded transition-colors text-center font-medium cursor-pointer ${
                    activeFilter === 'compound'
                      ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50'
                      : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
                  }`}
                  title="Dual Compound (Dodecahedron & Icosahedron Dual)"
                >
                  Dual Compound
                </button>
                <button
                  onClick={() => setActiveFilter('harmonious')}
                  className={`px-1.5 py-1 rounded transition-colors text-center font-medium cursor-pointer ${
                    activeFilter === 'harmonious'
                      ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50'
                      : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
                  }`}
                  title="Harmonious Web (Trines, Sextiles, Quintiles)"
                >
                  Harmonious Web
                </button>
                <button
                  onClick={() => setActiveFilter('asteroids')}
                  className={`px-1.5 py-1 rounded transition-colors text-center font-medium cursor-pointer ${
                    activeFilter === 'asteroids'
                      ? 'bg-[#1A1A1C] text-[#38bdf8] border border-[#38bdf8]/50'
                      : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
                  }`}
                  title="Asteroid Harmonic Rays"
                >
                  Asteroid Rays
                </button>
                <button
                  onClick={() => setActiveFilter('dodeca')}
                  className={`px-1.5 py-1 rounded transition-colors text-center font-medium cursor-pointer ${
                    activeFilter === 'dodeca'
                      ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50'
                      : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
                  }`}
                  title="Dodecahedron (12 Pentagons / Aether / 5-fold Quintiles)"
                >
                  Dodeca (12)
                </button>
                <button
                  onClick={() => setActiveFilter('icosa')}
                  className={`px-1.5 py-1 rounded transition-colors text-center font-medium cursor-pointer ${
                    activeFilter === 'icosa'
                      ? 'bg-[#1A1A1C] text-[#38bdf8] border border-[#38bdf8]/50'
                      : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
                  }`}
                  title="Icosahedron (20 Triangles / Water / 3-fold Trines)"
                >
                  Icosa (20)
                </button>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-1.5 py-1 rounded transition-colors text-center font-medium cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-[#1A1A1C] text-[#D1D1D1] border border-[#555]'
                      : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
                  }`}
                  title="Show all geometric chords"
                >
                  All Chords
                </button>
              </div>
            </div>

            {/* 3D Perspective & Visual Settings */}
            <div className="bg-[#151517] p-2 rounded-lg border border-[#222] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#888]">
                <span className="flex items-center gap-1 text-[#aaa]">
                  <Box className="w-3 h-3 text-[#38bdf8]" />
                  3D Perspective &amp; Depth
                </span>
                <span className="text-[#38bdf8]">{perspectiveDepth.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="2.2"
                max="6.0"
                step="0.2"
                value={perspectiveDepth}
                onChange={(e) => setPerspectiveDepth?.(parseFloat(e.target.value))}
                className="w-full accent-[#38bdf8] cursor-pointer h-1 bg-[#0C0C0E] rounded"
                title="Camera focal perspective distance"
              />

              <div className="grid grid-cols-2 gap-1 pt-1 border-t border-[#222] text-[10px] font-mono">
                <button
                  onClick={() => setShowCrystalFaces?.((prev) => !prev)}
                  className={`py-1 px-1.5 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    showCrystalFaces
                      ? 'bg-[#1A1A1C] text-[#38bdf8] border border-[#38bdf8]/40'
                      : 'text-[#666] hover:text-[#888] bg-[#0C0C0E]'
                  }`}
                  title="Toggle 3D translucent crystal face shading"
                >
                  <Eye className="w-3 h-3" />
                  <span>Crystal Faces</span>
                </button>
                <button
                  onClick={() => setShowAsteroidBeams?.((prev) => !prev)}
                  className={`py-1 px-1.5 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                    showAsteroidBeams
                      ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/40'
                      : 'text-[#666] hover:text-[#888] bg-[#0C0C0E]'
                  }`}
                  title="Toggle resonant beams from asteroids & planets"
                >
                  <Orbit className="w-3 h-3" />
                  <span>Asteroid Beams</span>
                </button>
              </div>
            </div>

            {/* Astrological Web & 3D Celestial Motion Toggles */}
            <div className="flex items-center justify-between pt-1 border-t border-[#222] text-[10px] font-mono text-[#888]">
              <button
                onClick={() => setWebPulsesEnabled((prev) => !prev)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                  webPulsesEnabled
                    ? 'bg-[#1A1A1C] text-[#38bdf8] border border-[#38bdf8]/40'
                    : 'text-[#666] hover:text-[#888]'
                }`}
                title="Toggle moving photon energy pulses on aspect chords"
              >
                <Radio className="w-3 h-3" />
                <span>Web Pulses</span>
              </button>

              <button
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                  autoRotate
                    ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/40'
                    : 'text-[#666] hover:text-[#888]'
                }`}
                title="Toggle 3D auto-rotation of polyhedral compound"
              >
                <RotateCcw className="w-3 h-3" />
                <span>3D Drift</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                  className="px-1.5 py-0.5 hover:bg-[#1A1A1C] rounded text-[#888] hover:text-[#D1D1D1] cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="text-[10px] text-[#666]">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                  className="px-1.5 py-0.5 hover:bg-[#1A1A1C] rounded text-[#888] hover:text-[#D1D1D1] cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Educational Sacred Geometry Principles Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-[#0C0C0E] border border-[#222] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-[#050507] border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-semibold text-[#D1D1D1] font-display">
                  Keplerian Dual Polyhedra &amp; The 3D Folding Engine
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded text-[#888] hover:text-[#D1D1D1] hover:bg-[#1A1A1C] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#D1D1D1] leading-relaxed overflow-y-auto max-h-[80vh]">
              <div className="bg-[#151517] p-3.5 rounded-xl border border-[#222] space-y-2">
                <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider font-mono">
                  The Platonic Duality (Dodecahedron &times; Icosahedron)
                </h4>
                <p className="text-[#888]">
                  In classical sacred geometry and Johannes Kepler&apos;s <em>Mysterium Cosmographicum</em> (1596),
                  the <strong>Dodecahedron</strong> (12 pentagonal faces, 20 vertices, representing the Aether and the
                  12 signs of the Zodiac) and the <strong>Icosahedron</strong> (20 triangular faces, 12 vertices,
                  representing Primordial Water and Fluidity) exist in exact mathematical duality.
                </p>
                <p className="text-[#888]">
                  Every vertex of the Icosahedron corresponds directly to the normal center of a face on the Dodecahedron,
                  and every vertex of the Dodecahedron corresponds to a face of the Icosahedron. Both share exactly 30 edges.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#151517] p-3 rounded-xl border border-[#D4AF37]/30">
                  <div className="text-[#D4AF37] font-semibold text-xs font-mono">⬠ Dodecahedron (Aether)</div>
                  <div className="text-[11px] text-[#888] mt-1 space-y-1">
                    <div>• 12 Pentagonal Faces</div>
                    <div>• 20 Golden Vertices</div>
                    <div>• Resonates with 5-fold Quintiles (72°) &amp; BiQuintiles (144°)</div>
                    <div>• Folds out when Quintile harmonics dominate</div>
                  </div>
                </div>

                <div className="bg-[#151517] p-3 rounded-xl border border-[#38bdf8]/30">
                  <div className="text-[#38bdf8] font-semibold text-xs font-mono">△ Icosahedron (Water)</div>
                  <div className="text-[11px] text-[#888] mt-1 space-y-1">
                    <div>• 20 Triangular Faces</div>
                    <div>• 12 Celestial Vertices</div>
                    <div>• Resonates with 3-fold Trines (120°) &amp; Sextiles (60°)</div>
                    <div>• Folds out when Trine harmonics dominate</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#151517] p-3.5 rounded-xl border border-[#222] space-y-2">
                <h4 className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Asteroid-Planetary Harmonic Coupling
                </h4>
                <p className="text-[#888]">
                  The 3D-Perspective Folding Engine constantly monitors aspects between the natal planets and the
                  <strong> 200 nearest asteroids</strong> (such as Apophis, Bennu, Psyche, Eros, Didymos, and Ryugu).
                </p>
                <p className="text-[#888]">
                  When harmonious aspects (Trines of 120°, Quintiles of 72°, Sextiles of 60°, or Conjunctions) occur,
                  resonant energy beams connect the asteroid and planet positions to the 3D wireframe. This dynamic energy
                  drives the 60 folding struts, animating the continuous geometric transformation between the dual solids.
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#050507] border-t border-[#222] flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#050507] font-semibold text-xs transition-colors cursor-pointer"
              >
                Return to Natal Wheel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
