import React, { useState } from 'react';
import { ElementType, FullNatalChart, ModalityType, PlanetId } from '../types';
import { JUNGIAN_ARCHETYPES } from '../lib/archetypes';
import { QuantumTimelineJournal } from './QuantumTimelineJournal';
import {
  Brain,
  Sparkles,
  Flame,
  Mountain,
  Wind,
  Droplets,
  HelpCircle,
  Compass,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Orbit,
} from 'lucide-react';

interface ArchetypeInspectorProps {
  chart: FullNatalChart;
}

export const ArchetypeInspector: React.FC<ArchetypeInspectorProps> = ({ chart }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId>('Sun');

  const sun = chart.planets.find((p) => p.id === 'Sun');
  const moon = chart.planets.find((p) => p.id === 'Moon');
  const asc = chart.angles.ascendant;

  const totalElements =
    chart.elementCounts.Fire +
    chart.elementCounts.Earth +
    chart.elementCounts.Air +
    chart.elementCounts.Water || 10;

  const totalModalities =
    chart.modalityCounts.Cardinal +
    chart.modalityCounts.Fixed +
    chart.modalityCounts.Mutable || 10;

  const activeArchetype = JUNGIAN_ARCHETYPES[selectedPlanet];
  const activePlanetObj = chart.planets.find((p) => p.id === selectedPlanet);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#222]">
        <div>
          <h2 className="text-xl font-semibold text-[#D1D1D1] font-display flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#D4AF37]" />
            Jungian Archetypal Matrix &amp; Psychological Insights
          </h2>
          <p className="text-xs text-[#888] mt-1">
            Synthesizing depth psychology, mythic archetypes, shadow complexes, and the individuation path
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="#quantum-timeline-journal"
            className="flex items-center space-x-1.5 text-xs font-medium text-[#D4AF37] bg-[#161618] hover:bg-[#1E1E22] px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 shadow-xs transition-all"
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Timeline Journal</span>
          </a>

          <div className="flex items-center space-x-2 text-xs font-mono text-[#888] bg-[#0C0C0E] px-3 py-1.5 rounded-lg border border-[#222]">
            <span>Subject:</span>
            <span className="text-[#D4AF37] font-semibold">{chart.birthData.name}</span>
          </div>
        </div>
      </div>

      {/* The Primal Trinity Banner: Sun, Moon, Ascendant */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sun • The Sovereign Self */}
        <div className="bg-[#151517] border border-[#D4AF37]/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-[#D4AF37]">
                ☉ The Sovereign Self
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#666]">Ego</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-[#D1D1D1] flex items-center gap-2">
              <span>{sun?.sign}</span>
              <span className="text-xs font-mono text-[#D4AF37]">({sun?.formattedPos})</span>
            </div>
            <p className="text-xs text-[#999] mt-2 leading-relaxed">
              The primary conscious identity, creative will, and solar vitality. Your journey toward self-authorship and radiant purpose.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#222] text-[11px] font-mono text-[#D4AF37]">
            House {sun?.house} • {sun?.sign} Solar Focus
          </div>
        </div>

        {/* Moon • The Emotional Matrix */}
        <div className="bg-[#151517] border border-[#333] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-[#D1D1D1]">
                ☽ The Anima / Soul Matrix
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#666]">Unconscious</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-[#D1D1D1] flex items-center gap-2">
              <span>{moon?.sign}</span>
              <span className="text-xs font-mono text-[#888]">({moon?.formattedPos})</span>
            </div>
            <p className="text-xs text-[#999] mt-2 leading-relaxed">
              The instinctive sanctuary, somatic emotional reflex, and maternal inner child. Where you seek unconditional nourishment.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#222] text-[11px] font-mono text-[#888]">
            House {moon?.house} • Lunar Instinct
          </div>
        </div>

        {/* Ascendant • The Persona Mask */}
        <div className="bg-[#151517] border border-[#D4AF37]/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-mono font-semibold text-[#D4AF37]">
                ASC The Sacred Persona
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#666]">Persona</span>
            </div>
            <div className="mt-2 text-lg font-semibold text-[#D1D1D1] flex items-center gap-2">
              <span>{asc.sign}</span>
              <span className="text-xs font-mono text-[#D4AF37]">({asc.formattedPos})</span>
            </div>
            <p className="text-xs text-[#999] mt-2 leading-relaxed">
              The external lens and vehicle through which the psyche meets the world. The spontaneous style of your first instinctual response.
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#222] text-[11px] font-mono text-[#D4AF37]">
            1st House Cusp • Rising Dawn
          </div>
        </div>
      </div>

      {/* Elemental & Modality Dials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Elements */}
        <div className="bg-[#151517] border border-[#222] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase text-[#666] tracking-widest">
              Elemental Constitution
            </span>
            <span className="text-xs text-[#666] font-mono">10 Bodies</span>
          </div>

          <div className="space-y-2.5">
            {/* Fire */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-red-400 flex items-center gap-1.5 font-medium">
                  <Flame className="w-3.5 h-3.5 text-red-400" /> Fire (Intuition &amp; Will)
                </span>
                <span className="font-mono text-[#888]">
                  {chart.elementCounts.Fire} ({Math.round((chart.elementCounts.Fire / totalElements) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#0C0C0E] h-2 rounded-full overflow-hidden border border-[#222]">
                <div
                  className="h-full bg-[#D4AF37] rounded-full"
                  style={{ width: `${(chart.elementCounts.Fire / totalElements) * 100}%` }}
                />
              </div>
            </div>

            {/* Earth */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Mountain className="w-3.5 h-3.5 text-emerald-400" /> Earth (Sensation &amp; Form)
                </span>
                <span className="font-mono text-[#888]">
                  {chart.elementCounts.Earth} ({Math.round((chart.elementCounts.Earth / totalElements) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#0C0C0E] h-2 rounded-full overflow-hidden border border-[#222]">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(chart.elementCounts.Earth / totalElements) * 100}%` }}
                />
              </div>
            </div>

            {/* Air */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-sky-400 flex items-center gap-1.5 font-medium">
                  <Wind className="w-3.5 h-3.5 text-sky-400" /> Air (Thinking &amp; Synthesis)
                </span>
                <span className="font-mono text-[#888]">
                  {chart.elementCounts.Air} ({Math.round((chart.elementCounts.Air / totalElements) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#0C0C0E] h-2 rounded-full overflow-hidden border border-[#222]">
                <div
                  className="h-full bg-sky-400 rounded-full"
                  style={{ width: `${(chart.elementCounts.Air / totalElements) * 100}%` }}
                />
              </div>
            </div>

            {/* Water */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-indigo-400 flex items-center gap-1.5 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-indigo-400" /> Water (Feeling &amp; Soul)
                </span>
                <span className="font-mono text-[#888]">
                  {chart.elementCounts.Water} ({Math.round((chart.elementCounts.Water / totalElements) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-[#0C0C0E] h-2 rounded-full overflow-hidden border border-[#222]">
                <div
                  className="h-full bg-indigo-400 rounded-full"
                  style={{ width: `${(chart.elementCounts.Water / totalElements) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modalities */}
        <div className="bg-[#151517] border border-[#222] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold uppercase text-[#666] tracking-widest">
              Dynamic Modalities
            </span>
            <span className="text-xs text-[#666] font-mono">Action Patterns</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#D4AF37] font-medium">Cardinal (Initiation &amp; Leadership)</span>
                <span className="font-mono text-[#888]">{chart.modalityCounts.Cardinal}</span>
              </div>
              <div className="w-full bg-[#0C0C0E] h-2 rounded-full overflow-hidden border border-[#222]">
                <div
                  className="h-full bg-[#D4AF37] rounded-full"
                  style={{ width: `${(chart.modalityCounts.Cardinal / totalModalities) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#D1D1D1] font-medium">Fixed (Stabilization &amp; Endurance)</span>
                <span className="font-mono text-[#888]">{chart.modalityCounts.Fixed}</span>
              </div>
              <div className="w-full bg-[#0C0C0E] h-2 rounded-full overflow-hidden border border-[#222]">
                <div
                  className="h-full bg-[#888] rounded-full"
                  style={{ width: `${(chart.modalityCounts.Fixed / totalModalities) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-teal-400 font-medium">Mutable (Adaptation &amp; Evolution)</span>
                <span className="font-mono text-[#888]">{chart.modalityCounts.Mutable}</span>
              </div>
              <div className="w-full bg-[#0C0C0E] h-2 rounded-full overflow-hidden border border-[#222]">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${(chart.modalityCounts.Mutable / totalModalities) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Archetypes Interactive Inspector */}
      <div className="bg-[#151517] border border-[#222] rounded-2xl p-4 md:p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#D1D1D1]">
            Planetary Archetypes &amp; Shadow Integration
          </h3>
          <p className="text-xs text-[#888] mt-0.5">
            Select an inner planet or transpersonal principle to examine its psychological role, shadow pitfall, and individuation gift.
          </p>
        </div>

        {/* Planet Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 border-b border-[#222]">
          {(
            [
              'Sun',
              'Moon',
              'Mercury',
              'Venus',
              'Mars',
              'Jupiter',
              'Saturn',
              'Uranus',
              'Neptune',
              'Pluto',
              'Chiron',
              'NorthNode',
              'Lilith',
            ] as PlanetId[]
          ).map((pId) => {
            const isSel = selectedPlanet === pId;
            const pObj = chart.planets.find((p) => p.id === pId);
            return (
              <button
                key={pId}
                onClick={() => setSelectedPlanet(pId)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSel
                    ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs font-semibold'
                    : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#1A1A1C]'
                }`}
              >
                <span style={{ color: pObj?.color || '#cbd5e1' }}>{pObj?.glyph || '•'}</span>
                <span>{pObj?.name || pId}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Selected Archetype Card */}
        {activeArchetype && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222]">
              <div>
                <div className="text-base font-semibold text-[#D1D1D1] flex items-center gap-2">
                  <span style={{ color: activePlanetObj?.color }} className="text-lg">
                    {activePlanetObj?.glyph}
                  </span>
                  <span>{activeArchetype.name}</span>
                  <span className="text-xs font-normal text-[#888]">
                    in {activePlanetObj?.sign} (House {activePlanetObj?.house})
                  </span>
                </div>
                <div className="text-xs font-mono text-[#D4AF37] mt-0.5">
                  Mythic Role: {activeArchetype.mythicFigure}
                </div>
              </div>

              <div className="px-3 py-1 rounded-full bg-[#0C0C0E] border border-[#333] text-xs font-mono text-[#D1D1D1] self-start">
                {activeArchetype.psychologicalRole}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shadow Complex */}
              <div className="bg-[#0C0C0E] border border-[#333] rounded-xl p-4 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#888]" />
                  Unconscious Shadow Complex
                </div>
                <p className="text-xs text-[#999] leading-relaxed">
                  {activeArchetype.shadowExpression}
                </p>
              </div>

              {/* Individuated Gift */}
              <div className="bg-[#0C0C0E] border border-[#D4AF37]/30 rounded-xl p-4 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Individuated Golden Gift
                </div>
                <p className="text-xs text-[#D1D1D1] leading-relaxed">
                  {activeArchetype.giftExpression}
                </p>
              </div>
            </div>

            {/* Individuation Task & Prompt */}
            <div className="bg-[#0C0C0E] border border-[#222] rounded-xl p-4 space-y-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888] block mb-1">
                  Active Individuation Task
                </span>
                <p className="text-xs text-[#D1D1D1] leading-relaxed">
                  {activeArchetype.individuationTask}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#222]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    Depth Contemplation Prompt
                  </span>

                  <a
                    href="#quantum-timeline-journal"
                    className="text-[11px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Log Realization for this Archetype</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-[#D1D1D1] italic mt-1">
                  "{activeArchetype.contemplativePrompt}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quantum Timeline Journal */}
      <QuantumTimelineJournal
        chart={chart}
        selectedPlanet={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
      />
    </div>
  );
};
