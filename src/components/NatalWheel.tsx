import React, { useState, useMemo } from 'react';
import {
  FullNatalChart,
  PlanetId,
  PlanetPosition,
  SacredGeometryPattern,
} from '../types';
import { JUNGIAN_ARCHETYPES } from '../lib/archetypes';
import { ZODIAC_SIGNS } from '../lib/astronomy';
import {
  Sparkles,
  Info,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ChevronRight,
  Shield,
  Eye,
} from 'lucide-react';
import {
  SacredGeometryOverlay,
  SacredGeometryHUD,
  SacredFilterType,
  FoldingMode,
  calculateDodecaIcosaHarmony,
} from './SacredGeometryOverlay';

interface NatalWheelProps {
  chart: FullNatalChart;
  showSacredGeometry: boolean;
  onSelectPlanet?: (planet: PlanetPosition) => void;
}

const CENTER_X = 450;
const CENTER_Y = 450;
const R_OUTER_FRAME = 430;
const R_ZODIAC_OUTER = 420;
const R_ZODIAC_INNER = 355;
const R_HOUSE_NUMBERS = 330;
const R_PLANETS = 285;
const R_ASPECT_HUB = 230;

export const NatalWheel: React.FC<NatalWheelProps> = ({
  chart,
  showSacredGeometry,
  onSelectPlanet,
}) => {
  const harmonyStats = useMemo(() => calculateDodecaIcosaHarmony(chart), [chart]);
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId | null>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<PlanetId | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<'all' | 'patterns' | 'phi' | 'flower'>('all');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Sacred Geometry Dual Polyhedra & Folding States
  const [sacredFilter, setSacredFilter] = useState<SacredFilterType>('compound');
  const [isFoldingActive, setIsFoldingActive] = useState<boolean>(true);
  const [manualFold, setManualFold] = useState<number>(0.5);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [webPulsesEnabled, setWebPulsesEnabled] = useState<boolean>(true);
  const [foldingMode, setFoldingMode] = useState<FoldingMode>('auto');
  const [activeHarmoniousAspectId, setActiveHarmoniousAspectId] = useState<string | null>(null);
  const [perspectiveDepth, setPerspectiveDepth] = useState<number>(3.8);
  const [showCrystalFaces, setShowCrystalFaces] = useState<boolean>(true);
  const [showAsteroidBeams, setShowAsteroidBeams] = useState<boolean>(true);

  const ascDeg = chart.angles.ascendant.longitude;

  // Converts ecliptic longitude to SVG (x, y) with Ascendant placed at exactly 9 o'clock (180 deg)
  const getCoordinates = (longitude: number, radius: number) => {
    // Angular difference from Ascendant: positive counter-clockwise
    const angleFromAsc = (longitude - ascDeg + 360) % 360;
    // In SVG: 0 deg is 3 o'clock, 90 is 6 o'clock, 180 is 9 o'clock, 270 is 12 o'clock
    // We want ASC (angleFromAsc = 0) to be at 9 o'clock (180 deg)
    // As longitude increases, we move counter-clockwise (angle decreasing in SVG coordinate system)
    const svgAngleDeg = 180 - angleFromAsc;
    const svgAngleRad = (svgAngleDeg * Math.PI) / 180;
    return {
      x: CENTER_X + radius * Math.cos(svgAngleRad),
      y: CENTER_Y + radius * Math.sin(svgAngleRad),
      angleDeg: svgAngleDeg,
    };
  };

  // Prevent planet glyph collisions: cluster dispersion
  const planetCoords = useMemo(() => {
    const sorted = [...chart.planets].sort((a, b) => a.longitude - b.longitude);
    const coordsMap = new Map<PlanetId, { x: number; y: number; r: number }>();

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      let r = R_PLANETS;

      // Stagger radius slightly if adjacent planet is within 6 degrees
      const prev = sorted[(i - 1 + sorted.length) % sorted.length];
      const next = sorted[(i + 1) % sorted.length];
      const diffPrev = Math.abs(p.longitude - prev.longitude);
      const diffNext = Math.abs(p.longitude - next.longitude);

      if (diffPrev < 6.5 || diffNext < 6.5) {
        r = i % 2 === 0 ? R_PLANETS + 20 : R_PLANETS - 18;
      }

      const { x, y } = getCoordinates(p.longitude, r);
      coordsMap.set(p.id, { x, y, r });
    }

    return coordsMap;
  }, [chart.planets, ascDeg]);

  // Selected or hovered planet data
  const inspectedPlanet = useMemo(() => {
    const id = hoveredPlanetId || selectedPlanetId;
    if (!id) return null;
    return chart.planets.find((p) => p.id === id) || null;
  }, [hoveredPlanetId, selectedPlanetId, chart.planets]);

  const inspectedArchetype = useMemo(() => {
    if (!inspectedPlanet) return null;
    return JUNGIAN_ARCHETYPES[inspectedPlanet.id];
  }, [inspectedPlanet]);

  // Handle planet click
  const handlePlanetClick = (p: PlanetPosition) => {
    setSelectedPlanetId(p.id === selectedPlanetId ? null : p.id);
    if (onSelectPlanet) onSelectPlanet(p);
  };

  return (
    <div className="relative w-full flex flex-col lg:flex-row items-center justify-center p-3 lg:p-6 select-none">
      {/* Interactive Sacred Geometry HUD or standard zoom overlay */}
      {showSacredGeometry ? (
        <SacredGeometryHUD
          harmonyStats={harmonyStats}
          chart={chart}
          activeFilter={sacredFilter}
          setActiveFilter={setSacredFilter}
          isFoldingActive={isFoldingActive}
          setIsFoldingActive={setIsFoldingActive}
          manualFold={manualFold}
          setManualFold={setManualFold}
          autoRotate={autoRotate}
          setAutoRotate={setAutoRotate}
          webPulsesEnabled={webPulsesEnabled}
          setWebPulsesEnabled={setWebPulsesEnabled}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          foldingMode={foldingMode}
          setFoldingMode={setFoldingMode}
          activeHarmoniousAspectId={activeHarmoniousAspectId}
          setActiveHarmoniousAspectId={setActiveHarmoniousAspectId}
          perspectiveDepth={perspectiveDepth}
          setPerspectiveDepth={setPerspectiveDepth}
          showCrystalFaces={showCrystalFaces}
          setShowCrystalFaces={setShowCrystalFaces}
          showAsteroidBeams={showAsteroidBeams}
          setShowAsteroidBeams={setShowAsteroidBeams}
        />
      ) : (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-[#0C0C0E]/90 backdrop-blur-md p-2 rounded-xl border border-[#222] shadow-xl text-xs">
          <div className="flex items-center space-x-1.5 pb-1.5 border-b border-[#222] font-medium text-[#888]">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-widest text-[#666]">Wheel Zoom</span>
          </div>
          <div className="flex items-center justify-between text-[#666]">
            <span className="text-[10px] font-mono">{Math.round(zoomLevel * 100)}%</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1 hover:bg-[#1A1A1C] rounded text-[#888] hover:text-[#D1D1D1]"
                title="Zoom out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-[#1A1A1C] rounded text-[#888] hover:text-[#D1D1D1]"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1 hover:bg-[#1A1A1C] rounded text-[#888] hover:text-[#D1D1D1]"
                title="Zoom in"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="relative flex items-center justify-center overflow-hidden max-w-[850px] w-full aspect-square">
        <svg
          id="astraea-natal-svg"
          viewBox="0 0 900 900"
          className="w-full h-full drop-shadow-2xl transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Elegant Dark Ambient Background Radial Gradient */}
            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0C0C0E" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#08080A" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#050507" stopOpacity="1" />
            </radialGradient>

            <radialGradient id="goldRim" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="#151517" stopOpacity="0.8" />
              <stop offset="98%" stopColor="#222222" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#333333" stopOpacity="1" />
            </radialGradient>

            {/* Glowing filters for sacred geometry */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Wheel Container */}
          <circle cx={CENTER_X} cy={CENTER_Y} r={R_OUTER_FRAME} fill="url(#hubGradient)" stroke="#222222" strokeWidth="2" />
          <circle cx={CENTER_X} cy={CENTER_Y} r={R_ZODIAC_OUTER} fill="none" stroke="#222222" strokeWidth="1" />
          <circle cx={CENTER_X} cy={CENTER_Y} r={R_ZODIAC_INNER} fill="none" stroke="#222222" strokeWidth="1.5" />
          <circle cx={CENTER_X} cy={CENTER_Y} r={R_ASPECT_HUB} fill="#08080A" stroke="#222222" strokeWidth="1.5" />

          {/* 12 ZODIAC SECTORS */}
          {ZODIAC_SIGNS.map((sign, idx) => {
            const startDeg = idx * 30;
            const endDeg = (idx + 1) * 30;
            const midDeg = idx * 30 + 15;

            const p1 = getCoordinates(startDeg, R_ZODIAC_INNER);
            const p2 = getCoordinates(startDeg, R_ZODIAC_OUTER);
            const p3 = getCoordinates(endDeg, R_ZODIAC_OUTER);
            const p4 = getCoordinates(endDeg, R_ZODIAC_INNER);

            const midCoord = getCoordinates(midDeg, (R_ZODIAC_OUTER + R_ZODIAC_INNER) / 2);

            let elementColor = 'rgba(239, 68, 68, 0.15)'; // Fire
            let elementStroke = '#ef4444';
            let textColor = '#fca5a5';
            if (sign.element === 'Earth') {
              elementColor = 'rgba(16, 185, 129, 0.15)';
              elementStroke = '#10b981';
              textColor = '#86efac';
            } else if (sign.element === 'Air') {
              elementColor = 'rgba(56, 189, 248, 0.15)';
              elementStroke = '#38bdf8';
              textColor = '#7dd3fc';
            } else if (sign.element === 'Water') {
              elementColor = 'rgba(129, 140, 248, 0.15)';
              elementStroke = '#818cf8';
              textColor = '#c7d2fe';
            }

            return (
              <g key={sign.name}>
                {/* Sector wedge */}
                <path
                  d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${R_ZODIAC_OUTER} ${R_ZODIAC_OUTER} 0 0 0 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${R_ZODIAC_INNER} ${R_ZODIAC_INNER} 0 0 1 ${p1.x} ${p1.y} Z`}
                  fill={elementColor}
                  stroke="#1e293b"
                  strokeWidth="0.75"
                />

                {/* Boundary line */}
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth="1" />

                {/* Zodiac Sign Symbol & Name */}
                <text
                  x={midCoord.x}
                  y={midCoord.y + 4}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="18"
                  fontWeight="600"
                  className="font-sans cursor-pointer hover:scale-125 transition-transform"
                >
                  {sign.symbol}
                </text>
              </g>
            );
          })}

          {/* 1-DEGREE AND 5-DEGREE TICKS IN ZODIAC BAND */}
          {Array.from({ length: 72 }).map((_, i) => {
            const deg = i * 5;
            const isTen = deg % 10 === 0;
            const r1 = R_ZODIAC_INNER;
            const r2 = isTen ? R_ZODIAC_INNER + 9 : R_ZODIAC_INNER + 5;
            const pStart = getCoordinates(deg, r1);
            const pEnd = getCoordinates(deg, r2);
            return (
              <line
                key={`tick-${deg}`}
                x1={pStart.x}
                y1={pStart.y}
                x2={pEnd.x}
                y2={pEnd.y}
                stroke="#475569"
                strokeWidth={isTen ? 1.2 : 0.6}
                opacity={0.7}
              />
            );
          })}

          {/* SACRED GEOMETRY ASTROLOGICAL WEB & DUAL POLYHEDRA OVERLAY */}
          {showSacredGeometry ? (
            <SacredGeometryOverlay
              harmonyStats={harmonyStats}
              chart={chart}
              showSacredGeometry={showSacredGeometry}
              selectedPlanetId={selectedPlanetId}
              hoveredPlanetId={hoveredPlanetId}
              getCoordinates={getCoordinates}
              centerX={CENTER_X}
              centerY={CENTER_Y}
              hubRadius={R_ASPECT_HUB}
              activeFilter={sacredFilter}
              isFoldingActive={isFoldingActive}
              manualFold={manualFold}
              autoRotate={autoRotate}
              webPulsesEnabled={webPulsesEnabled}
              foldingMode={foldingMode}
              activeHarmoniousAspectId={activeHarmoniousAspectId}
              showAsteroidBeams={showAsteroidBeams}
              perspectiveDepth={perspectiveDepth}
              showCrystalFaces={showCrystalFaces}
              onSelectHarmonicAspect={setActiveHarmoniousAspectId}
            />
          ) : (
            /* Baseline aspect lines when sacred geometry is toggled off */
            <g id="basic-aspect-lines">
              {chart.aspects.map((aspect, idx) => {
                const p1 = chart.planets.find((p) => p.id === aspect.planet1);
                const p2 = chart.planets.find((p) => p.id === aspect.planet2);
                if (!p1 || !p2) return null;

                const c1 = getCoordinates(p1.longitude, R_ASPECT_HUB);
                const c2 = getCoordinates(p2.longitude, R_ASPECT_HUB);

                const isHighlighted =
                  selectedPlanetId === null ||
                  selectedPlanetId === p1.id ||
                  selectedPlanetId === p2.id ||
                  hoveredPlanetId === p1.id ||
                  hoveredPlanetId === p2.id;

                const opacity = isHighlighted ? 0.75 : 0.12;
                const strokeWidth = isHighlighted ? (aspect.orb < 1.5 ? 2.0 : 1.2) : 0.6;

                return (
                  <line
                    key={`basic-aspect-${idx}`}
                    x1={c1.x}
                    y1={c1.y}
                    x2={c2.x}
                    y2={c2.y}
                    stroke={aspect.color}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                  />
                );
              })}
            </g>
          )}

          {/* HOUSE CUSP LINES & ROMAN NUMERALS */}
          {chart.houses.map((house, idx) => {
            const pStart = getCoordinates(house.longitude, R_ASPECT_HUB);
            const pEnd = getCoordinates(house.longitude, R_ZODIAC_INNER);

            const isAngle = [1, 4, 7, 10].includes(house.house);
            let strokeColor = isAngle ? '#94a3b8' : '#334155';
            let strokeWidth = isAngle ? 2.2 : 0.9;
            let strokeDash: string | undefined = isAngle ? undefined : '3 3';

            if (house.house === 1) strokeColor = '#38bdf8'; // Ascendant
            if (house.house === 10) strokeColor = '#facc15'; // Midheaven

            // Midpoint angle for placing house Roman numeral
            const nextHouse = chart.houses[(idx + 1) % 12];
            let midLong = (house.longitude + nextHouse.longitude) / 2;
            if (nextHouse.longitude < house.longitude) midLong += 180;
            const romanCoord = getCoordinates(midLong, R_HOUSE_NUMBERS);

            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

            return (
              <g key={`house-${house.house}`}>
                <line
                  x1={pStart.x}
                  y1={pStart.y}
                  x2={pEnd.x}
                  y2={pEnd.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                />
                {/* House Roman Numeral */}
                <text
                  x={romanCoord.x}
                  y={romanCoord.y + 3.5}
                  textAnchor="middle"
                  fill={isAngle ? '#e2e8f0' : '#64748b'}
                  fontSize={isAngle ? '11' : '9.5'}
                  fontWeight={isAngle ? '700' : '400'}
                  className="font-mono select-none"
                >
                  {romanNumerals[house.house - 1]}
                </text>
              </g>
            );
          })}

          {/* ASC / MC / DSC / IC BADGES */}
          {(() => {
            const ascCoord = getCoordinates(chart.angles.ascendant.longitude, R_ZODIAC_OUTER + 18);
            const mcCoord = getCoordinates(chart.angles.midheaven.longitude, R_ZODIAC_OUTER + 18);
            const dscCoord = getCoordinates(chart.angles.descendant.longitude, R_ZODIAC_OUTER + 18);
            const icCoord = getCoordinates(chart.angles.imumCoeli.longitude, R_ZODIAC_OUTER + 18);

            return (
              <g className="font-mono text-[10px] font-bold">
                <text x={ascCoord.x} y={ascCoord.y + 3} textAnchor="middle" fill="#38bdf8">
                  ASC
                </text>
                <text x={mcCoord.x} y={mcCoord.y + 3} textAnchor="middle" fill="#facc15">
                  MC
                </text>
                <text x={dscCoord.x} y={dscCoord.y + 3} textAnchor="middle" fill="#94a3b8">
                  DSC
                </text>
                <text x={icCoord.x} y={icCoord.y + 3} textAnchor="middle" fill="#94a3b8">
                  IC
                </text>
              </g>
            );
          })()}

          {/* PLANETS GLYPHS & MARKERS */}
          {chart.planets.map((planet) => {
            const coord = planetCoords.get(planet.id);
            if (!coord) return null;

            const isSelected = selectedPlanetId === planet.id;
            const isHovered = hoveredPlanetId === planet.id;

            return (
              <g
                key={planet.id}
                className="cursor-pointer group"
                onClick={() => handlePlanetClick(planet)}
                onMouseEnter={() => setHoveredPlanetId(planet.id)}
                onMouseLeave={() => setHoveredPlanetId(null)}
              >
                {/* Highlight Halo */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="19"
                    fill={planet.color}
                    fillOpacity="0.25"
                    stroke={planet.color}
                    strokeWidth="1.5"
                    filter="url(#glow)"
                  />
                )}

                {/* Glyph Node Background */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="13.5"
                  fill="#0f172a"
                  stroke={isSelected || isHovered ? planet.color : '#334155'}
                  strokeWidth={isSelected || isHovered ? '2' : '1.2'}
                  className="transition-all duration-200"
                />

                {/* Planet Glyph */}
                <text
                  x={coord.x}
                  y={coord.y + 4.5}
                  textAnchor="middle"
                  fill={planet.color}
                  fontSize="14"
                  fontWeight="600"
                  className="font-sans select-none"
                >
                  {planet.glyph}
                </text>

                {/* Retrograde Symbol (℞) */}
                {planet.isRetrograde && (
                  <text
                    x={coord.x + 9}
                    y={coord.y - 7}
                    fill="#ef4444"
                    fontSize="9"
                    fontWeight="bold"
                    className="font-mono select-none"
                  >
                    ℞
                  </text>
                )}
              </g>
            );
          })}

          {/* Central Sacred Sun Core */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="18" fill="#151517" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx={CENTER_X} cy={CENTER_Y} r="7" fill="#D4AF37" />
          <circle cx={CENTER_X} cy={CENTER_Y} r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Side Inspector Drawer (macOS Elegant Dark Detail Panel) */}
      <div className="w-full lg:w-80 lg:min-w-[320px] bg-[#0C0C0E] border border-[#222] rounded-2xl p-4 shadow-xl flex flex-col justify-between mt-4 lg:mt-0">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#222]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#666] font-semibold font-mono">
                {inspectedPlanet ? 'Archetypal Focus' : 'Natal Blueprint'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#666]">
              {chart.birthData.houseSystem}
            </span>
          </div>

          {inspectedPlanet && inspectedArchetype ? (
            /* Selected Planet Details */
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold bg-[#151517] border border-[#333]"
                    style={{ borderColor: inspectedPlanet.color, color: inspectedPlanet.color }}
                  >
                    {inspectedPlanet.glyph}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#D1D1D1] flex items-center gap-1.5">
                      {inspectedPlanet.name}
                      {inspectedPlanet.isRetrograde && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1A1C] text-[#FF5F56] border border-[#FF5F56]/40 font-mono">
                          Retrograde
                        </span>
                      )}
                    </h3>
                    <p className="text-xs font-mono text-[#D4AF37]">
                      {inspectedPlanet.formattedPos} • House {inspectedPlanet.house}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mythic Archetype Role */}
              <div className="bg-[#151517] p-2.5 rounded-xl border border-[#222]">
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono font-medium">
                  {inspectedArchetype.mythicFigure}
                </p>
                <p className="text-xs text-[#D1D1D1] font-medium mt-0.5">
                  {inspectedArchetype.psychologicalRole}
                </p>
              </div>

              {/* Shadow vs Gift Polarity */}
              <div className="space-y-2 text-xs">
                <div className="bg-[#151517] border border-[#333] p-2.5 rounded-xl">
                  <span className="font-semibold text-[#888] text-[10px] uppercase tracking-widest block mb-0.5 font-mono">
                    Unconscious Shadow
                  </span>
                  <p className="text-[#999] text-xs leading-relaxed">
                    {inspectedArchetype.shadowExpression}
                  </p>
                </div>

                <div className="bg-[#151517] border border-[#D4AF37]/30 p-2.5 rounded-xl">
                  <span className="font-semibold text-[#D4AF37] text-[10px] uppercase tracking-widest block mb-0.5 font-mono">
                    Individuated Gift
                  </span>
                  <p className="text-[#D1D1D1] text-xs leading-relaxed">
                    {inspectedArchetype.giftExpression}
                  </p>
                </div>
              </div>

              {/* Contemplative Inquiry */}
              <div className="bg-[#151517] border border-[#222] p-2.5 rounded-xl">
                <span className="font-semibold text-[#D4AF37] text-[10px] uppercase tracking-widest block mb-0.5 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  Self-Discovery Prompt
                </span>
                <p className="text-[#D1D1D1] text-xs italic">
                  "{inspectedArchetype.contemplativePrompt}"
                </p>
              </div>
            </div>
          ) : (
            /* General Trinity Summary */
            <div className="mt-3 space-y-3">
              <div className="p-2.5 rounded-xl bg-[#151517] border border-[#222]">
                <div className="text-[10px] uppercase tracking-widest text-[#666] font-mono">Primal Archetypal Trinity</div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                  <div className="p-2 rounded-lg bg-[#0C0C0E] border border-[#D4AF37]/30">
                    <div className="text-[#D4AF37] text-xs font-semibold">☉ Sun</div>
                    <div className="text-xs font-semibold text-[#D1D1D1] mt-1 font-mono">
                      {chart.planets.find((p) => p.id === 'Sun')?.sign}
                    </div>
                    <div className="text-[9px] text-[#666] uppercase tracking-wider mt-0.5">Core</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0C0C0E] border border-[#333]">
                    <div className="text-[#D1D1D1] text-xs font-semibold">☽ Moon</div>
                    <div className="text-xs font-semibold text-[#D1D1D1] mt-1 font-mono">
                      {chart.planets.find((p) => p.id === 'Moon')?.sign}
                    </div>
                    <div className="text-[9px] text-[#666] uppercase tracking-wider mt-0.5">Soul</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0C0C0E] border border-[#D4AF37]/30">
                    <div className="text-[#D4AF37] text-xs font-semibold">ASC Rising</div>
                    <div className="text-xs font-semibold text-[#D1D1D1] mt-1 font-mono">
                      {chart.angles.ascendant.sign}
                    </div>
                    <div className="text-[9px] text-[#666] uppercase tracking-wider mt-0.5">Persona</div>
                  </div>
                </div>
              </div>

              {/* Sacred Patterns Count */}
              <div className="p-2.5 rounded-xl bg-[#151517] border border-[#222]">
                <div className="flex items-center justify-between text-xs text-[#D1D1D1] font-medium">
                  <span className="flex items-center gap-1.5 text-xs text-[#888]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Sacred Geometric Configurations
                  </span>
                  <span className="font-mono text-[#D4AF37] font-bold">
                    {chart.sacredPatterns.length}
                  </span>
                </div>
                {chart.sacredPatterns.length > 0 ? (
                  <div className="mt-2 space-y-1.5">
                    {chart.sacredPatterns.slice(0, 3).map((pat) => (
                      <div
                        key={pat.id}
                        className="text-xs p-1.5 rounded-md bg-[#0C0C0E] border border-[#222] flex items-center justify-between text-[#D1D1D1]"
                      >
                        <span className="truncate">{pat.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A1A1C] text-[#888] font-mono border border-[#333]">
                          {pat.planets.join(' • ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#666] mt-1">
                    Distributed harmonic network across elements.
                  </p>
                )}
              </div>

              <div className="text-[11px] text-[#888] bg-[#151517] p-2.5 rounded-xl border border-[#222] flex items-start space-x-2">
                <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <p>
                  Click any planet glyph on the wheel to isolate its aspects and inspect its Jungian archetype and shadow polarity.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Subject Stamp */}
        <div className="pt-3 mt-3 border-t border-[#222] flex items-center justify-between text-[11px] text-[#666] font-mono">
          <span className="truncate max-w-[170px]">{chart.birthData.city}</span>
          <span>{chart.birthData.birthDate}</span>
        </div>
      </div>
    </div>
  );
};
