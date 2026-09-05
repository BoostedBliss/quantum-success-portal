import React, { useState, useMemo } from 'react';
import { AsteroidFact, AsteroidGroup, SpectralClass } from '../types';
import { ASTEROIDS_200_CATALOG } from '../lib/asteroidsData';
import {
  Search,
  SlidersHorizontal,
  Compass,
  Radio,
  Calendar,
  ShieldAlert,
  Rocket,
  Info,
  ExternalLink,
  ChevronRight,
  ArrowUpDown,
  Orbit,
  Sparkles,
  Zap,
  Globe2,
  CheckCircle2,
} from 'lucide-react';

export const AsteroidObservatory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedSpectral, setSelectedSpectral] = useState<string>('All');
  const [filterMissionsOnly, setFilterMissionsOnly] = useState<boolean>(false);
  const [filterPhaOnly, setFilterPhaOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'transitDate' | 'moid' | 'diameter' | 'period' | 'name'>('transitDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedAsteroidId, setSelectedAsteroidId] = useState<string>('99942'); // Default to Apophis

  // Filter and sort catalog
  const filteredAsteroids = useMemo(() => {
    return ASTEROIDS_200_CATALOG.filter((ast) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ast.name.toLowerCase().includes(q) ||
        ast.designation.toLowerCase().includes(q) ||
        ast.id.includes(q) ||
        (ast.provisionalDesignation && ast.provisionalDesignation.toLowerCase().includes(q)) ||
        ast.discoverer.toLowerCase().includes(q) ||
        (ast.explorationMission && ast.explorationMission.toLowerCase().includes(q));

      // Group filter
      const matchesGroup =
        selectedGroup === 'All' ||
        (selectedGroup === 'PHA' ? ast.isPotentiallyHazardous : ast.group === selectedGroup);

      // Spectral class filter
      const matchesSpectral =
        selectedSpectral === 'All' || ast.spectralType.startsWith(selectedSpectral);

      // Missions filter
      const matchesMission = !filterMissionsOnly || Boolean(ast.explorationMission);

      // PHA only filter
      const matchesPha = !filterPhaOnly || ast.isPotentiallyHazardous;

      return matchesSearch && matchesGroup && matchesSpectral && matchesMission && matchesPha;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'transitDate') {
        comparison = a.nextTransit.date.localeCompare(b.nextTransit.date);
      } else if (sortBy === 'moid') {
        comparison = a.earthMoidAU - b.earthMoidAU;
      } else if (sortBy === 'diameter') {
        comparison = b.estimatedDiameterMeters - a.estimatedDiameterMeters; // larger first by default
      } else if (sortBy === 'period') {
        comparison = a.orbitalPeriodYears - b.orbitalPeriodYears;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, selectedGroup, selectedSpectral, filterMissionsOnly, filterPhaOnly, sortBy, sortOrder]);

  // Active asteroid object
  const activeAsteroid = useMemo(() => {
    return (
      ASTEROIDS_200_CATALOG.find((a) => a.id === selectedAsteroidId) ||
      filteredAsteroids[0] ||
      ASTEROIDS_200_CATALOG[0]
    );
  }, [selectedAsteroidId, filteredAsteroids]);

  // Statistics calculation for the catalog
  const stats = useMemo(() => {
    const total = ASTEROIDS_200_CATALOG.length;
    const phas = ASTEROIDS_200_CATALOG.filter((a) => a.isPotentiallyHazardous).length;
    const missions = ASTEROIDS_200_CATALOG.filter((a) => a.explorationMission).length;
    const nextFiveYears = ASTEROIDS_200_CATALOG.filter((a) => {
      const yr = parseInt(a.nextTransit.date.split('-')[0], 10);
      return yr >= 2025 && yr <= 2030;
    }).length;
    return { total, phas, missions, nextFiveYears };
  }, []);

  // Format meters to human readable km or m
  const formatDiameter = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn text-[#D1D1D1]">
      {/* Header Banner: Astronomical Observatory */}
      <div className="bg-[#0D0D11] border border-[#222] rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-[#D4AF37] text-xs font-mono tracking-wider uppercase mb-1">
              <Orbit className="w-4 h-4 text-[#D4AF37]" />
              <span>Solar System Ephemeris &amp; Planetary Defense</span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-semibold text-white tracking-tight flex items-center gap-2.5">
              <span>200 Nearest Asteroids &amp; Transit Observatory</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#1A1A20] text-[#D4AF37] border border-[#D4AF37]/30">
                200 Objects Tracked
              </span>
            </h1>
            <p className="text-xs md:text-sm text-[#888] max-w-3xl mt-1.5 leading-relaxed">
              Astronomical catalog of near-Earth asteroids (NEAs), Potentially Hazardous Asteroids (PHAs), and notable near solar system bodies. Track orbital Keplerian trajectories, Minimum Orbit Intersection Distances (MOID), spectral compositions, and predicted transit schedules.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs shrink-0">
            <div className="bg-[#151518] border border-[#2A2A30] rounded-lg p-2.5">
              <div className="text-lg font-mono font-bold text-white">{stats.total}</div>
              <div className="text-[10px] text-[#777] uppercase tracking-wider">Cataloged</div>
            </div>
            <div className="bg-[#151518] border border-[#2A2A30] rounded-lg p-2.5">
              <div className="text-lg font-mono font-bold text-[#FFBD2E]">{stats.phas}</div>
              <div className="text-[10px] text-[#777] uppercase tracking-wider">PHAs Monitored</div>
            </div>
            <div className="bg-[#151518] border border-[#2A2A30] rounded-lg p-2.5">
              <div className="text-lg font-mono font-bold text-[#38bdf8]">{stats.missions}</div>
              <div className="text-[10px] text-[#777] uppercase tracking-wider">Spacecraft Missions</div>
            </div>
            <div className="bg-[#151518] border border-[#2A2A30] rounded-lg p-2.5">
              <div className="text-lg font-mono font-bold text-[#34d399]">{stats.nextFiveYears}</div>
              <div className="text-[10px] text-[#777] uppercase tracking-wider">Transits 2025–30</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filterable Asteroid Explorer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Search & Sort Controls */}
          <div className="bg-[#0C0C0E] border border-[#222] rounded-xl p-3.5 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search asteroid, number, discoverer, mission..."
                className="w-full bg-[#151518] text-xs text-white rounded-lg pl-9 pr-3 py-2 border border-[#28282E] focus:border-[#D4AF37]/60 outline-none placeholder-[#555] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#888] hover:text-white absolute right-3 top-2"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#888]">
                <span>Orbital Class:</span>
                <span className="font-mono text-[#AAA]">{filteredAsteroids.length} matches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Apollo', 'Aten', 'Amor', 'PHA', 'Main Belt'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                      selectedGroup === grp
                        ? 'bg-[#D4AF37] text-black font-semibold shadow-xs'
                        : 'bg-[#18181C] text-[#888] hover:text-[#D1D1D1] hover:bg-[#222]'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>

              {/* Toggles: Missions & Spectral */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1C1C20] text-xs">
                <button
                  onClick={() => setFilterMissionsOnly(!filterMissionsOnly)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] border transition-all ${
                    filterMissionsOnly
                      ? 'bg-[#38bdf8]/15 border-[#38bdf8]/50 text-[#38bdf8]'
                      : 'bg-[#151518] border-[#2A2A30] text-[#777] hover:text-[#CCC]'
                  }`}
                >
                  <Rocket className="w-3 h-3" />
                  <span>Space Missions</span>
                </button>

                <button
                  onClick={() => setFilterPhaOnly(!filterPhaOnly)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] border transition-all ${
                    filterPhaOnly
                      ? 'bg-[#FFBD2E]/15 border-[#FFBD2E]/50 text-[#FFBD2E]'
                      : 'bg-[#151518] border-[#2A2A30] text-[#777] hover:text-[#CCC]'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Hazardous (PHA)</span>
                </button>

                {/* Sort selection */}
                <div className="ml-auto flex items-center space-x-1 text-[11px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#151518] border border-[#2A2A30] text-[#AAA] rounded px-2 py-1 outline-none text-[11px]"
                  >
                    <option value="transitDate">Next Transit Date</option>
                    <option value="moid">Earth MOID (Closeness)</option>
                    <option value="diameter">Size / Diameter</option>
                    <option value="period">Orbital Period</option>
                    <option value="name">Name</option>
                  </select>
                  <button
                    onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                    title="Toggle sort direction"
                    className="p-1 bg-[#151518] border border-[#2A2A30] rounded text-[#888] hover:text-white"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Asteroid Virtualized / Scrollable List */}
          <div className="bg-[#0C0C0E] border border-[#222] rounded-xl overflow-hidden flex flex-col h-[560px]">
            <div className="px-3.5 py-2 bg-[#121215] border-b border-[#222] flex items-center justify-between text-[11px] text-[#777] font-mono">
              <span>DESIGNATION &amp; GROUP</span>
              <span>NEXT TRANSIT &amp; DISTANCE</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#18181C]">
              {filteredAsteroids.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#666]">
                  No asteroids matched the active search and filter parameters.
                </div>
              ) : (
                filteredAsteroids.map((ast) => {
                  const isSelected = ast.id === activeAsteroid.id;
                  const isVeryClose = ast.nextTransit.distanceLunarDistances < 10;
                  return (
                    <button
                      key={ast.id}
                      onClick={() => setSelectedAsteroidId(ast.id)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'bg-[#1C1C22] border-l-2 border-[#D4AF37] text-white'
                          : 'hover:bg-[#121215] text-[#AAA]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            ast.isPotentiallyHazardous
                              ? 'bg-[#FFBD2E]'
                              : ast.explorationMission
                              ? 'bg-[#38bdf8]'
                              : 'bg-[#555]'
                          }`}
                        />
                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-medium text-white truncate">
                              {ast.name}
                            </span>
                            {ast.explorationMission && (
                              <Rocket className="w-3 h-3 text-[#38bdf8] shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-[#666] font-mono flex items-center space-x-1">
                            <span>{ast.group}</span>
                            <span>•</span>
                            <span>{formatDiameter(ast.estimatedDiameterMeters)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[11px] font-mono font-medium text-[#CCC]">
                          {ast.nextTransit.date}
                        </div>
                        <div
                          className={`text-[10px] font-mono ${
                            isVeryClose ? 'text-[#FFBD2E] font-semibold' : 'text-[#777]'
                          }`}
                        >
                          {ast.nextTransit.distanceLunarDistances} LD ({ast.nextTransit.distanceAU.toFixed(3)} AU)
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Asteroid Dossier, Orbital Radar & Science (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Asteroid Headline Card */}
          <div className="bg-[#0C0C0E] border border-[#222] rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[11px] font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                    {activeAsteroid.designation}
                  </span>
                  <span className="text-[11px] font-mono text-[#888] px-2 py-0.5 rounded bg-[#18181C]">
                    {activeAsteroid.group} Group
                  </span>
                  {activeAsteroid.isPotentiallyHazardous && (
                    <span className="text-[11px] font-mono text-[#FFBD2E] px-2 py-0.5 rounded bg-[#FFBD2E]/10 border border-[#FFBD2E]/30 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      PHA
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{activeAsteroid.name}</span>
                  {activeAsteroid.provisionalDesignation && (
                    <span className="text-xs font-mono font-normal text-[#666]">
                      [{activeAsteroid.provisionalDesignation}]
                    </span>
                  )}
                </h2>
                <div className="text-xs text-[#777] mt-1">
                  Discovered in {activeAsteroid.discoveryYear} by {activeAsteroid.discoverer}
                </div>
              </div>

              {activeAsteroid.explorationMission && (
                <div className="bg-[#0F1E28] border border-[#38bdf8]/40 rounded-lg p-2.5 text-xs text-[#38bdf8] flex items-center gap-2 max-w-xs shrink-0">
                  <Rocket className="w-4 h-4 shrink-0 text-[#38bdf8]" />
                  <div>
                    <div className="font-semibold text-[11px]">Spacecraft Mission</div>
                    <div className="text-[10px] text-[#A5E3FC]">{activeAsteroid.explorationMission}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Next Transit Highlight Banner */}
            <div className="mt-4 p-3 rounded-lg bg-[#141419] border border-[#282830] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <div className="text-[10px] text-[#777] uppercase font-mono tracking-wider">
                    Next Earth Close Approach / Transit
                  </div>
                  <div className="text-white font-mono font-semibold text-sm">
                    {activeAsteroid.nextTransit.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 font-mono text-xs">
                <div>
                  <span className="text-[#666]">Miss Distance: </span>
                  <span className="text-[#D4AF37] font-semibold">
                    {activeAsteroid.nextTransit.distanceLunarDistances} LD
                  </span>{' '}
                  <span className="text-[11px] text-[#888]">
                    ({(activeAsteroid.nextTransit.distanceAU * 149597870.7).toLocaleString(undefined, { maximumFractionDigits: 0 })} km)
                  </span>
                </div>
                <div>
                  <span className="text-[#666]">Rel. Velocity: </span>
                  <span className="text-white">{activeAsteroid.nextTransit.relativeVelocityKmS} km/s</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#AAA] mt-2.5 italic">
              "{activeAsteroid.nextTransit.notes}"
            </p>
          </div>

          {/* Interactive Keplerian Orbit & Radar Diagram */}
          <div className="bg-[#0C0C0E] border border-[#222] rounded-xl p-4 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-between text-xs text-[#888] mb-2 font-mono">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Orbit className="w-3.5 h-3.5" />
                <span>KEPLERIAN HELIOCENTRIC ORBIT DIAGRAM (AU)</span>
              </span>
              <span>Ecliptic Plane Projection</span>
            </div>

            {/* SVG Orbit Visualizer */}
            <div className="w-full max-w-[480px] aspect-square relative flex items-center justify-center bg-[#070709] rounded-lg border border-[#1A1A20] overflow-hidden">
              <svg viewBox="-2.8 -2.8 5.6 5.6" className="w-full h-full">
                {/* Grid Rings */}
                <circle cx="0" cy="0" r="1.0" fill="none" stroke="#222" strokeWidth="0.015" strokeDasharray="0.04 0.04" />
                <circle cx="0" cy="0" r="2.0" fill="none" stroke="#1A1A20" strokeWidth="0.01" />

                {/* Sun */}
                <circle cx="0" cy="0" r="0.09" fill="#fbbf24" filter="drop-shadow(0 0 4px #fbbf24)" />
                <text x="0" y="0.22" textAnchor="middle" fill="#fbbf24" fontSize="0.12" fontFamily="monospace">☉ Sun</text>

                {/* Mercury Orbit (0.387 AU) */}
                <circle cx="0" cy="0" r="0.387" fill="none" stroke="#38bdf8" strokeWidth="0.008" opacity="0.3" />

                {/* Venus Orbit (0.723 AU) */}
                <circle cx="0" cy="0" r="0.723" fill="none" stroke="#34d399" strokeWidth="0.008" opacity="0.35" />

                {/* Earth Orbit (1.000 AU Reference) */}
                <circle cx="0" cy="0" r="1.000" fill="none" stroke="#38bdf8" strokeWidth="0.018" opacity="0.65" />
                {/* Earth position marker */}
                <circle cx="0.85" cy="-0.52" r="0.05" fill="#38bdf8" />
                <text x="0.85" y="-0.62" textAnchor="middle" fill="#38bdf8" fontSize="0.12" fontFamily="monospace">♁ Earth (1.0 AU)</text>

                {/* Mars Orbit (1.524 AU) */}
                <circle cx="0" cy="0" r="1.524" fill="none" stroke="#f87171" strokeWidth="0.01" opacity="0.35" />
                <text x="0" y="-1.56" textAnchor="middle" fill="#f87171" fontSize="0.10" fontFamily="monospace" opacity="0.6">Mars (1.52 AU)</text>

                {/* Asteroid Elliptical Orbit */}
                {(() => {
                  const a = activeAsteroid.semiMajorAxisAU;
                  const e = activeAsteroid.eccentricity;
                  const b = a * Math.sqrt(Math.max(0.001, 1 - e * e));
                  const c = a * e; // Focus offset from center
                  const perihelion = activeAsteroid.perihelionAU;
                  const aphelion = activeAsteroid.aphelionAU;

                  // Center of ellipse is at (-c, 0) if perihelion is at (a - c = perihelion, 0)
                  return (
                    <g>
                      {/* Ellipse path */}
                      <ellipse
                        cx={-c}
                        cy="0"
                        rx={a}
                        ry={b}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="0.024"
                        strokeDasharray="none"
                      />

                      {/* Perihelion Marker */}
                      <circle cx={perihelion} cy="0" r="0.04" fill="#22c55e" />
                      <text x={perihelion} y="0.16" textAnchor="middle" fill="#22c55e" fontSize="0.09" fontFamily="monospace">
                        q ({perihelion.toFixed(2)} AU)
                      </text>

                      {/* Aphelion Marker */}
                      <circle cx={-aphelion} cy="0" r="0.04" fill="#ef4444" />
                      <text x={-aphelion} y="0.16" textAnchor="middle" fill="#ef4444" fontSize="0.09" fontFamily="monospace">
                        Q ({aphelion.toFixed(2)} AU)
                      </text>

                      {/* Current Orbit Position (Estimated from longitude) */}
                      {(() => {
                        const rad = (activeAsteroid.currentEclipticLongitude * Math.PI) / 180;
                        const r = (a * (1 - e * e)) / (1 + e * Math.cos(rad));
                        const posX = r * Math.cos(rad);
                        const posY = r * Math.sin(rad);
                        return (
                          <g>
                            <circle cx={posX} cy={posY} r="0.055" fill="#D4AF37" stroke="#FFF" strokeWidth="0.01" />
                            <text x={posX} y={posY - 0.1} textAnchor="middle" fill="#FFF" fontSize="0.11" fontFamily="monospace" fontWeight="bold">
                              {activeAsteroid.name}
                            </text>
                          </g>
                        );
                      })()}
                    </g>
                  );
                })()}
              </svg>

              {/* Diagram Legend */}
              <div className="absolute bottom-2 left-2 flex items-center space-x-3 text-[10px] font-mono bg-black/70 backdrop-blur-xs px-2 py-1 rounded border border-[#222]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-[#38bdf8] inline-block" /> Earth Orbit
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-[#D4AF37] inline-block" /> Asteroid Orbit
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" /> Perihelion (q)
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Scientific Data Grid & Orbital Elements */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">SEMI-MAJOR AXIS (a)</div>
              <div className="text-white font-semibold text-sm mt-0.5">
                {activeAsteroid.semiMajorAxisAU} AU
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">ECCENTRICITY (e)</div>
              <div className="text-white font-semibold text-sm mt-0.5">
                {activeAsteroid.eccentricity}
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">INCLINATION (i)</div>
              <div className="text-white font-semibold text-sm mt-0.5">
                {activeAsteroid.inclinationDeg}°
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">ORBITAL PERIOD</div>
              <div className="text-white font-semibold text-sm mt-0.5">
                {activeAsteroid.orbitalPeriodYears} yrs ({activeAsteroid.orbitalPeriodDays} d)
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">EST. DIAMETER</div>
              <div className="text-white font-semibold text-sm mt-0.5">
                {formatDiameter(activeAsteroid.estimatedDiameterMeters)}
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">SPECTRAL CLASS</div>
              <div className="text-[#38bdf8] font-semibold text-xs mt-0.5 truncate">
                {activeAsteroid.spectralType}
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">EARTH MOID</div>
              <div className="text-[#FFBD2E] font-semibold text-sm mt-0.5">
                {activeAsteroid.earthMoidAU} AU
              </div>
            </div>

            <div className="bg-[#0C0C0E] border border-[#222] rounded-lg p-3">
              <div className="text-[10px] text-[#777]">GEOMETRIC ALBEDO</div>
              <div className="text-white font-semibold text-sm mt-0.5">
                {activeAsteroid.albedo}
              </div>
            </div>
          </div>

          {/* Astronomical Facts & Exploration Insights */}
          <div className="bg-[#0C0C0E] border border-[#222] rounded-xl p-4 space-y-2.5">
            <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cosmological Facts &amp; Scientific Discoveries</span>
            </div>
            <ul className="space-y-2 text-xs text-[#CCC] leading-relaxed">
              {activeAsteroid.facts.map((fact, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] font-serif text-sm leading-none mt-0.5">✦</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
