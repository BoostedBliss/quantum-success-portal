import React, { useState, useMemo } from 'react';
import { AspectType, BirthData, FullNatalChart, PlanetId, PlanetPosition } from '../types';
import { calculatePlanetsForDate } from '../lib/astronomy';
import { JUNGIAN_ARCHETYPES } from '../lib/archetypes';
import {
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Compass,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface TransitsViewProps {
  chart: FullNatalChart;
}

interface TransitHit {
  transitPlanet: PlanetPosition;
  natalPlanet: PlanetPosition;
  aspectType: AspectType;
  exactAngle: number;
  orb: number;
  color: string;
  theme: string;
  psychologicalImpact: string;
  actionableCounsel: string;
}

export const TransitsView: React.FC<TransitsViewProps> = ({ chart }) => {
  const [transitDate, setTransitDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filterPlanet, setFilterPlanet] = useState<string>('all');

  // Compute transit positions for the selected date
  const transitPlanets = useMemo(() => {
    return calculatePlanetsForDate(transitDate, '12:00', chart.birthData.timezone);
  }, [transitDate, chart.birthData.timezone]);

  // Compute aspects between Transit planets and Natal planets
  const transitHits: TransitHit[] = useMemo(() => {
    const hits: TransitHit[] = [];
    const outerAndPersonal = ['Sun', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron', 'NorthNode'] as PlanetId[];

    for (const tPlanet of transitPlanets) {
      if (!outerAndPersonal.includes(tPlanet.id)) continue;

      for (const nPlanet of chart.planets) {
        if (nPlanet.id === 'Ascendant' || nPlanet.id === 'Midheaven') continue;

        let diff = Math.abs(tPlanet.longitude - nPlanet.longitude);
        if (diff > 180) diff = 360 - diff;

        // Major aspects only for transits (Conjunction, Square, Trine, Opposition, Sextile)
        const checkAspect = (target: number, type: AspectType, maxOrb: number, color: string) => {
          const orb = Math.abs(diff - target);
          if (orb <= maxOrb) {
            // Generate psychological counsel based on archetypal pair
            let theme = `${tPlanet.name} activates Natal ${nPlanet.name}`;
            let psychologicalImpact = `Transit ${tPlanet.name} in ${tPlanet.sign} brings its evolutionary archetype into active dialogue with your natal ${nPlanet.name} in ${nPlanet.sign}.`;
            let actionableCounsel = 'Honor the invitation to step into greater maturity and conscious balance.';

            if (tPlanet.id === 'Jupiter') {
              theme = `Jupiterian Expansion & Creative Opportunity`;
              psychologicalImpact = `An influx of faith, synchronicity, and vision. Expands the archetype of natal ${nPlanet.name}.`;
              actionableCounsel = `Take bold, generous action without overextending resources or falling into hubris.`;
            } else if (tPlanet.id === 'Saturn') {
              theme = `Saturnian Reality Check & Structural Mastery`;
              psychologicalImpact = `Demands emotional and structural integrity. Tests the resilience of your natal ${nPlanet.name}.`;
              actionableCounsel = `Discipline, prune what is non-essential, and build sustainable long-term foundations.`;
            } else if (tPlanet.id === 'Uranus') {
              theme = `Promethean Awakening & Breakthrough`;
              psychologicalImpact = `Sudden insights, restlessness with conformity, and liberation of dormant potential.`;
              actionableCounsel = `Embrace necessary change flexibly; liberate yourself from stale routines without reckless chaos.`;
            } else if (tPlanet.id === 'Neptune') {
              theme = `Mystical Dissolution & Transpersonal Longing`;
              psychologicalImpact = `Softens ego boundaries, heightens spiritual empathy and artistic inspiration.`;
              actionableCounsel = `Ground your dreams in concrete practices; avoid escapism, numbing, or savior fantasies.`;
            } else if (tPlanet.id === 'Pluto') {
              theme = `Plutonian Metamorphosis & Evolutionary Rebirth`;
              psychologicalImpact = `Deep catharsis, shedding obsolete emotional armor, and reclaiming unshakeable personal sovereignty.`;
              actionableCounsel = `Surrender what is dying willingly; trust the resurrection power of your sovereign essence.`;
            } else if (tPlanet.id === 'Mars') {
              theme = `Martian Agency & Decisive Movement`;
              psychologicalImpact = `High physical energy, urgency, and direct assertion of personal desire.`;
              actionableCounsel = `Channel adrenaline into purposeful creative endeavor; steer clear of reactive disputes.`;
            }

            hits.push({
              transitPlanet: tPlanet,
              natalPlanet: nPlanet,
              aspectType: type,
              exactAngle: Math.round(diff * 100) / 100,
              orb: Math.round(orb * 100) / 100,
              color,
              theme,
              psychologicalImpact,
              actionableCounsel,
            });
          }
        };

        checkAspect(0, 'Conjunction', 3.0, '#fbbf24');
        checkAspect(90, 'Square', 3.0, '#ef4444');
        checkAspect(180, 'Opposition', 3.0, '#c084fc');
        checkAspect(120, 'Trine', 3.0, '#38bdf8');
        checkAspect(60, 'Sextile', 2.0, '#34d399');
      }
    }

    // Sort by tightest orb
    return hits.sort((a, b) => a.orb - b.orb);
  }, [transitPlanets, chart.planets]);

  const filteredHits = useMemo(() => {
    if (filterPlanet === 'all') return transitHits;
    return transitHits.filter(
      (h) => h.transitPlanet.id === filterPlanet || h.natalPlanet.id === filterPlanet
    );
  }, [transitHits, filterPlanet]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 select-none">
      {/* Header & Date Controller */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#222]">
        <div>
          <h2 className="text-xl font-semibold text-[#D1D1D1] font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D4AF37]" />
            Celestial Transits &amp; Psychological Weather
          </h2>
          <p className="text-xs text-[#888] mt-1">
            Tracking active planetary transits against your natal archetypes to reveal timely psychological windows
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Picker */}
          <div className="flex items-center space-x-2 bg-[#0C0C0E] border border-[#222] rounded-lg px-3 py-1.5 text-xs font-mono text-[#D1D1D1]">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#888]">Date:</span>
            <input
              type="date"
              value={transitDate}
              onChange={(e) => setTransitDate(e.target.value)}
              className="bg-transparent border-none text-[#D1D1D1] outline-none text-xs cursor-pointer"
            />
          </div>

          <button
            onClick={() => setTransitDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-1.5 rounded-lg bg-[#1A1A1C] hover:bg-[#252528] text-xs font-mono text-[#D4AF37] border border-[#333] transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Transit Filter and Summary Bar */}
      <div className="bg-[#151517] border border-[#222] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-[#888]">Active Transits:</span>
          <span className="font-mono text-[#D4AF37] font-bold bg-[#0C0C0E] px-2.5 py-0.5 rounded border border-[#222]">
            {transitHits.length} Planetary Contacts
          </span>
          <span className="text-[#666] text-[11px] font-mono hidden sm:inline">
            (Orb ≤ 3.0° for precise psychological influence)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#888]" />
          <select
            value={filterPlanet}
            onChange={(e) => setFilterPlanet(e.target.value)}
            className="bg-[#0C0C0E] border border-[#222] rounded-lg px-2.5 py-1 text-[#D1D1D1] outline-none text-xs cursor-pointer"
          >
            <option value="all">All Planetary Influences</option>
            <option value="Jupiter">Jupiter Transits (Expansion)</option>
            <option value="Saturn">Saturn Transits (Mastery)</option>
            <option value="Uranus">Uranus Transits (Awakening)</option>
            <option value="Neptune">Neptune Transits (Dissolution)</option>
            <option value="Pluto">Pluto Transits (Rebirth)</option>
            <option value="Sun">Sun / Solar Transits</option>
          </select>
        </div>
      </div>

      {/* Active Transits Cards */}
      <div className="space-y-4">
        {filteredHits.length > 0 ? (
          filteredHits.map((hit, idx) => (
            <div
              key={`transit-${idx}`}
              className="bg-[#151517] border border-[#222] rounded-2xl p-5 shadow-lg hover:border-[#D4AF37]/40 transition-all space-y-3"
            >
              {/* Card Header: Transit Planet -> Natal Planet */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222]">
                <div className="flex items-center space-x-3">
                  {/* Transit Planet Icon */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm bg-[#0C0C0E] border border-[#333]"
                    style={{ color: hit.transitPlanet.color }}
                  >
                    {hit.transitPlanet.glyph}
                  </div>

                  <div className="flex items-center space-x-2 font-medium text-[#D1D1D1]">
                    <span className="font-semibold text-[#D1D1D1]">
                      Transit {hit.transitPlanet.name}
                    </span>
                    <span className="text-xs font-mono text-[#888]">
                      ({hit.transitPlanet.formattedPos})
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#333] uppercase"
                      style={{ backgroundColor: '#1A1A1C', color: hit.color }}
                    >
                      {hit.aspectType}
                    </span>
                    <span className="font-semibold text-[#D1D1D1]">
                      Natal {hit.natalPlanet.name}
                    </span>
                    <span className="text-xs font-mono text-[#888]">
                      ({hit.natalPlanet.formattedPos})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-[#888]">
                  <span className="text-[#666]">Orb:</span>
                  <span className="text-[#D4AF37] font-bold">{hit.orb}°</span>
                  <span className="text-[#444]">•</span>
                  <span>{hit.orb < 1.0 ? 'Peak Exactness' : 'Active Field'}</span>
                </div>
              </div>

              {/* Theme & Impact */}
              <div>
                <h4 className="text-sm font-semibold text-[#D4AF37] font-display flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {hit.theme}
                </h4>
                <p className="text-xs text-[#999] mt-1 leading-relaxed">
                  {hit.psychologicalImpact}
                </p>
              </div>

              {/* Actionable Counsel */}
              <div className="bg-[#0C0C0E] border border-[#D4AF37]/30 rounded-xl p-3.5 text-xs flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#D4AF37] uppercase text-[10px] font-mono tracking-wider block mb-0.5">
                    Actionable Psychological Guidance
                  </span>
                  <p className="text-[#D1D1D1] leading-relaxed">
                    {hit.actionableCounsel}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#151517] border border-[#222] rounded-2xl p-8 text-center text-[#888] text-xs space-y-2">
            <p>No transits match the current filter on this date within a 3.0° orb.</p>
            <p className="text-[#666]">
              Try selecting "All Planetary Influences" or adjusting the observation date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
