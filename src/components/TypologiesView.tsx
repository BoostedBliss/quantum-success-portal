import React, { useState } from 'react';
import { FullNatalChart } from '../types';
import {
  Layers,
  Sparkles,
  Compass,
  Cpu,
  Key,
  ShieldAlert,
  Heart,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';

interface TypologiesViewProps {
  chart: FullNatalChart;
}

export const TypologiesView: React.FC<TypologiesViewProps> = ({ chart }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'enneagram' | 'mbti' | 'humandesign' | 'genekeys'>('all');

  const { enneagram, mbti, humanDesign, geneKeys } = chart.typology;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#222]">
        <div>
          <h2 className="text-xl font-semibold text-[#D1D1D1] font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D4AF37]" />
            Holistic Typology Matrix &amp; Self-Discovery
          </h2>
          <p className="text-xs text-[#888] mt-1">
            Bridging astrological planetary archetypes with Enneagram dynamics, MBTI cognitive stacks, Human Design, and Gene Keys
          </p>
        </div>

        {/* View Filter Pill */}
        <div className="flex items-center space-x-1.5 text-xs bg-[#0C0C0E] p-1 rounded-lg border border-[#222] self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                : 'text-[#888] hover:text-[#D1D1D1]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('enneagram')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'enneagram'
                ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                : 'text-[#888] hover:text-[#D1D1D1]'
            }`}
          >
            Enneagram
          </button>
          <button
            onClick={() => setActiveTab('mbti')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'mbti'
                ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                : 'text-[#888] hover:text-[#D1D1D1]'
            }`}
          >
            MBTI Stack
          </button>
          <button
            onClick={() => setActiveTab('humandesign')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'humandesign'
                ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                : 'text-[#888] hover:text-[#D1D1D1]'
            }`}
          >
            Human Design
          </button>
          <button
            onClick={() => setActiveTab('genekeys')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'genekeys'
                ? 'bg-[#1A1A1C] text-[#D4AF37] font-medium border border-[#D4AF37]/50'
                : 'text-[#888] hover:text-[#D1D1D1]'
            }`}
          >
            Gene Keys
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. ENNEAGRAM SYNTHESIS */}
        {(activeTab === 'all' || activeTab === 'enneagram') && (
          <div className="bg-[#151517] border border-[#222] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <h3 className="text-sm font-semibold text-[#D1D1D1] font-display">
                    Enneagram Archetype
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold px-2 py-0.5 rounded-md bg-[#1A1A1C] border border-[#333]">
                  Wing: {enneagram.wingSuggestion}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-base font-semibold text-[#D1D1D1]">
                  {enneagram.name}
                </div>
                <p className="text-xs text-[#888] mt-1 font-mono">
                  Astrological Resonance: {enneagram.astrologicalResonance}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="bg-[#0C0C0E] border border-[#333] p-3 rounded-xl">
                  <span className="font-semibold text-[#888] text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1 font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#888]" />
                    Core Fear
                  </span>
                  <p className="text-[#999] leading-relaxed">
                    {enneagram.coreFear}
                  </p>
                </div>

                <div className="bg-[#0C0C0E] border border-[#D4AF37]/30 p-3 rounded-xl">
                  <span className="font-semibold text-[#D4AF37] text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1 font-mono">
                    <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Core Desire
                  </span>
                  <p className="text-[#D1D1D1] leading-relaxed">
                    {enneagram.coreDesire}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between text-xs text-[#888] font-mono">
              <span>Growth Direction: Type {enneagram.growthDirection}</span>
              <span className="text-[#D4AF37] flex items-center gap-1">
                Integration Path <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
              </span>
            </div>
          </div>
        )}

        {/* 2. MBTI COGNITIVE STACK */}
        {(activeTab === 'all' || activeTab === 'mbti') && (
          <div className="bg-[#151517] border border-[#222] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <h3 className="text-sm font-semibold text-[#D1D1D1] font-display">
                    MBTI Cognitive Architecture
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold px-2 py-0.5 rounded-md bg-[#1A1A1C] border border-[#333]">
                  {mbti.type}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-base font-semibold text-[#D1D1D1]">
                  {mbti.title}
                </div>
                <p className="text-xs text-[#999] mt-1 leading-relaxed">
                  {mbti.cognitiveProfile}
                </p>
              </div>

              {/* 4 Cognitive Functions */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#0C0C0E] border border-[#222]">
                  <span className="text-[10px] text-[#D4AF37] uppercase block font-semibold tracking-wider">
                    1. Dominant (Hero)
                  </span>
                  <span className="text-[#D1D1D1] mt-0.5 block">{mbti.dominant}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0C0C0E] border border-[#222]">
                  <span className="text-[10px] text-[#888] uppercase block font-semibold tracking-wider">
                    2. Auxiliary (Parent)
                  </span>
                  <span className="text-[#D1D1D1] mt-0.5 block">{mbti.auxiliary}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0C0C0E] border border-[#222]">
                  <span className="text-[10px] text-[#888] uppercase block font-semibold tracking-wider">
                    3. Tertiary (Child)
                  </span>
                  <span className="text-[#D1D1D1] mt-0.5 block">{mbti.tertiary}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0C0C0E] border border-[#222]">
                  <span className="text-[10px] text-[#666] uppercase block font-semibold tracking-wider">
                    4. Inferior (Aspirations)
                  </span>
                  <span className="text-[#999] mt-0.5 block">{mbti.inferior}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#222] text-[11px] font-mono text-[#888]">
              {mbti.elementalHarmony}
            </div>
          </div>
        )}

        {/* 3. HUMAN DESIGN SYSTEM */}
        {(activeTab === 'all' || activeTab === 'humandesign') && (
          <div className="bg-[#151517] border border-[#222] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <h3 className="text-sm font-semibold text-[#D1D1D1] font-display">
                    Human Design Blueprint
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold px-2 py-0.5 rounded-md bg-[#1A1A1C] border border-[#333]">
                  Profile {humanDesign.profile}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-base font-semibold text-[#D1D1D1] flex items-center gap-2">
                  <span>{humanDesign.energyType}</span>
                </div>
                <p className="text-xs text-[#888] mt-0.5 font-mono">
                  {humanDesign.incarnationCross}
                </p>
              </div>

              <div className="space-y-2 mt-4 text-xs">
                <div className="p-2.5 rounded-xl bg-[#0C0C0E] border border-[#222]">
                  <span className="text-[10px] uppercase font-mono text-[#D4AF37] font-semibold block tracking-wider">
                    Operating Strategy
                  </span>
                  <span className="text-[#D1D1D1] mt-0.5 block leading-relaxed">
                    {humanDesign.strategy}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0C0C0E] border border-[#222]">
                  <span className="text-[10px] uppercase font-mono text-[#888] font-semibold block tracking-wider">
                    Inner Authority
                  </span>
                  <span className="text-[#D1D1D1] mt-0.5 block">
                    {humanDesign.authority}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#222] text-[11px] font-mono text-[#888] flex items-center justify-between">
              <span>Solar Gate: <span className="text-[#D4AF37]">{humanDesign.solarGate}</span></span>
              <span>Earth Gate: <span className="text-[#D1D1D1]">{humanDesign.earthGate}</span></span>
            </div>
          </div>
        )}

        {/* 4. GENE KEYS GOLDEN PATH */}
        {(activeTab === 'all' || activeTab === 'genekeys') && (
          <div className="bg-[#151517] border border-[#222] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#222]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <h3 className="text-sm font-semibold text-[#D1D1D1] font-display">
                    Gene Keys • Golden Path
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold px-2 py-0.5 rounded-md bg-[#1A1A1C] border border-[#333]">
                  4 Prime Spheres
                </span>
              </div>

              <div className="space-y-2.5 mt-4 text-xs">
                {/* Life's Work */}
                <div className="p-2.5 rounded-xl bg-[#0C0C0E] border border-[#222]">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="text-[#D4AF37] font-semibold">
                      {geneKeys.lifesWork.sphereName}
                    </span>
                    <span className="text-[#888]">
                      Key {geneKeys.lifesWork.gate}.{geneKeys.lifesWork.line}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-xs mt-1">
                    <span className="text-[#888]">{geneKeys.lifesWork.shadow}</span>
                    <span className="text-[#666]">→</span>
                    <span className="text-[#D4AF37] font-bold">{geneKeys.lifesWork.gift}</span>
                    <span className="text-[#666]">→</span>
                    <span className="text-[#D1D1D1]">{geneKeys.lifesWork.siddhi}</span>
                  </div>
                </div>

                {/* Evolution */}
                <div className="p-2.5 rounded-xl bg-[#0C0C0E] border border-[#222]">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="text-[#D1D1D1] font-semibold">
                      {geneKeys.evolution.sphereName}
                    </span>
                    <span className="text-[#888]">
                      Key {geneKeys.evolution.gate}.{geneKeys.evolution.line}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-xs mt-1">
                    <span className="text-[#888]">{geneKeys.evolution.shadow}</span>
                    <span className="text-[#666]">→</span>
                    <span className="text-[#D4AF37] font-bold">{geneKeys.evolution.gift}</span>
                    <span className="text-[#666]">→</span>
                    <span className="text-[#D1D1D1]">{geneKeys.evolution.siddhi}</span>
                  </div>
                </div>

                {/* Radiance */}
                <div className="p-2.5 rounded-xl bg-[#0C0C0E] border border-[#222]">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="text-[#D1D1D1] font-semibold">
                      {geneKeys.radiance.sphereName}
                    </span>
                    <span className="text-[#888]">
                      Key {geneKeys.radiance.gate}.{geneKeys.radiance.line}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-xs mt-1">
                    <span className="text-[#888]">{geneKeys.radiance.shadow}</span>
                    <span className="text-[#666]">→</span>
                    <span className="text-[#D4AF37] font-bold">{geneKeys.radiance.gift}</span>
                    <span className="text-[#666]">→</span>
                    <span className="text-[#D1D1D1]">{geneKeys.radiance.siddhi}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#222] text-[11px] font-mono text-[#888] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Transmuting primal shadows into genius through effortless contemplation.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
