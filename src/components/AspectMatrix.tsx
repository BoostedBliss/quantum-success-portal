import React, { useState } from 'react';
import { Aspect, AspectType, FullNatalChart, PlanetPosition } from '../types';
import { PLANET_META } from '../lib/astronomy';
import { Sparkles, Grid, Filter, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface AspectMatrixProps {
  chart: FullNatalChart;
  onSelectPlanet?: (planet: PlanetPosition) => void;
}

export const AspectMatrix: React.FC<AspectMatrixProps> = ({ chart, onSelectPlanet }) => {
  const [filterNature, setFilterNature] = useState<'all' | 'harmonious' | 'tension' | 'creative'>('all');
  const [selectedAspect, setSelectedAspect] = useState<Aspect | null>(null);

  const mainPlanets = chart.planets.filter(
    (p) => !['Ascendant', 'Midheaven'].includes(p.id)
  );

  const filteredAspects = chart.aspects.filter((a) => {
    if (filterNature === 'all') return true;
    return a.nature === filterNature;
  });

  // Find aspect between two planets
  const getAspectBetween = (id1: string, id2: string): Aspect | undefined => {
    return chart.aspects.find(
      (a) =>
        (a.planet1 === id1 && a.planet2 === id2) ||
        (a.planet1 === id2 && a.planet2 === id1)
    );
  };

  const getAspectGlyph = (type: AspectType) => {
    switch (type) {
      case 'Conjunction':
        return '☌';
      case 'Sextile':
        return '⚹';
      case 'Square':
        return '□';
      case 'Trine':
        return '△';
      case 'Opposition':
        return '☍';
      case 'Quincunx':
        return '⚻';
      case 'Quintile':
        return 'Q';
      case 'BiQuintile':
        return 'bQ';
      default:
        return '•';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 select-none">
      {/* Sacred Geometry Formations Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-base font-semibold text-[#D1D1D1] font-display">
              Sacred Geometric Formations ({chart.sacredPatterns.length})
            </h2>
          </div>
          <span className="text-[11px] text-[#666] font-mono">
            Harmonic aspect networks across the celestial mandala
          </span>
        </div>

        {chart.sacredPatterns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {chart.sacredPatterns.map((pat) => (
              <div
                key={pat.id}
                className="bg-[#151517] border border-[#222] rounded-xl p-4 shadow-md hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#333]"
                      style={{ backgroundColor: '#1A1A1C', color: pat.color }}
                    >
                      {pat.name}
                    </span>
                    <span className="text-[11px] text-[#888] font-mono">
                      {pat.planets.join(' • ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#999] leading-relaxed">
                    {pat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#222] flex items-center justify-between text-[11px] text-[#888] font-mono">
                  <span className="text-[#D4AF37] flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-[#D4AF37]" />
                    {pat.geometricMeaning}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#151517] border border-[#222] rounded-xl p-4 text-center text-xs text-[#888]">
            No closed Grand Trines, T-Squares, or Yods detected with current orbs. The psyche is guided by flexible individual aspect lines.
          </div>
        )}
      </section>

      {/* Interactive Aspect Matrix & Lower Triangle Grid */}
      <section className="bg-[#151517] border border-[#222] rounded-2xl p-4 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#222]">
          <div>
            <h3 className="text-sm font-semibold text-[#D1D1D1] flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#D4AF37]" />
              Classical Aspect Matrix &amp; Orbs
            </h3>
            <p className="text-xs text-[#888] mt-0.5">
              Lower-triangular harmonic aspect grid showing exact degrees &amp; angular resonance
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs bg-[#0C0C0E] p-1 rounded-lg border border-[#222] self-start">
            <button
              onClick={() => setFilterNature('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterNature === 'all'
                  ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                  : 'text-[#888] hover:text-[#D1D1D1]'
              }`}
            >
              All ({chart.aspects.length})
            </button>
            <button
              onClick={() => setFilterNature('harmonious')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterNature === 'harmonious'
                  ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                  : 'text-[#888] hover:text-[#D1D1D1]'
              }`}
            >
              Harmonic
            </button>
            <button
              onClick={() => setFilterNature('tension')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterNature === 'tension'
                  ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                  : 'text-[#888] hover:text-[#D1D1D1]'
              }`}
            >
              Dynamic Tension
            </button>
            <button
              onClick={() => setFilterNature('creative')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterNature === 'creative'
                  ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                  : 'text-[#888] hover:text-[#D1D1D1]'
              }`}
            >
              Golden Ratio
            </button>
          </div>
        </div>

        {/* The Classical Astrological Lower-Triangle Table */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-block min-w-full align-middle">
            <table className="border-collapse text-center">
              <thead>
                <tr>
                  <th className="p-1.5 w-10"></th>
                  {mainPlanets.slice(0, -1).map((p) => (
                    <th key={`col-${p.id}`} className="p-1.5 w-10 text-xs font-mono" style={{ color: p.color }}>
                      <span title={p.name}>{p.glyph}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mainPlanets.slice(1).map((pRow, rowIndex) => (
                  <tr key={`row-${pRow.id}`}>
                    <td className="p-1.5 text-xs font-mono font-semibold" style={{ color: pRow.color }}>
                      <span title={pRow.name}>{pRow.glyph}</span>
                    </td>
                    {mainPlanets.slice(0, rowIndex + 1).map((pCol) => {
                      const aspect = getAspectBetween(pRow.id, pCol.id);
                      if (!aspect) {
                        return (
                          <td
                            key={`cell-${pRow.id}-${pCol.id}`}
                            className="w-10 h-10 border border-[#222] bg-[#0C0C0E]/40"
                          ></td>
                        );
                      }

                      const glyph = getAspectGlyph(aspect.type);
                      const isSelected = selectedAspect === aspect;

                      return (
                        <td
                          key={`cell-${pRow.id}-${pCol.id}`}
                          onClick={() => setSelectedAspect(aspect)}
                          className={`w-10 h-10 border border-[#222] transition-colors cursor-pointer relative group ${
                            isSelected ? 'bg-[#1A1A1C] ring-1 ring-[#D4AF37]' : 'bg-[#0C0C0E] hover:bg-[#1A1A1C]'
                          }`}
                          title={`${aspect.planet1} ${aspect.type} ${aspect.planet2} (Orb: ${aspect.orb}°) • ${aspect.sacredGeometry}`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <span
                              className="text-sm font-bold leading-none"
                              style={{ color: aspect.color }}
                            >
                              {glyph}
                            </span>
                            <span className="text-[9px] text-[#666] font-mono mt-0.5">
                              {aspect.orb}°
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Aspect Detail Callout */}
        {selectedAspect && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#0C0C0E] border border-[#222] text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base border border-[#333]"
                style={{ backgroundColor: '#1A1A1C', color: selectedAspect.color }}
              >
                {getAspectGlyph(selectedAspect.type)}
              </span>
              <div>
                <div className="font-semibold text-[#D1D1D1]">
                  {selectedAspect.planet1} {selectedAspect.type} {selectedAspect.planet2}
                </div>
                <div className="text-[#888] text-[11px] font-mono">
                  Exact Angle: <span className="text-[#D4AF37]">{selectedAspect.actualAngle}°</span> (Target: {selectedAspect.angle}°) • Orb: {selectedAspect.orb}° ({selectedAspect.isApplying ? 'Applying' : 'Separating'})
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[#D4AF37] font-mono text-[11px] block">
                Sacred Geometry: {selectedAspect.sacredGeometry}
              </span>
              <span className="text-[#666] text-[10px] uppercase tracking-wider font-mono">
                Nature: {selectedAspect.nature.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Detailed Aspects List Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-mono font-semibold">
              Harmonic Aspect Ledger
            </span>
            <span className="text-xs text-[#666] font-mono">
              Showing {filteredAspects.length} of {chart.aspects.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-[#222] divide-y divide-[#222]">
            {filteredAspects.map((aspect, idx) => {
              const p1 = chart.planets.find((p) => p.id === aspect.planet1);
              const p2 = chart.planets.find((p) => p.id === aspect.planet2);
              return (
                <div
                  key={`aspect-row-${idx}`}
                  className="p-2.5 px-3 bg-[#0C0C0E] hover:bg-[#1A1A1C] transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="text-sm font-bold w-5 text-center"
                      style={{ color: aspect.color }}
                    >
                      {getAspectGlyph(aspect.type)}
                    </span>
                    <div className="flex items-center space-x-1.5 font-medium text-[#D1D1D1]">
                      <span style={{ color: p1?.color }}>{aspect.planet1}</span>
                      <span className="text-[#666]">↔</span>
                      <span style={{ color: p2?.color }}>{aspect.planet2}</span>
                    </div>
                  </div>

                  <div className="hidden sm:block text-[#888] font-mono text-[11px]">
                    {aspect.sacredGeometry}
                  </div>

                  <div className="flex items-center space-x-3 font-mono text-[11px]">
                    <span className="text-[#666]">{aspect.orb}° orb</span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-[#333]"
                      style={{ backgroundColor: '#1A1A1C', color: aspect.color }}
                    >
                      {aspect.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
