import React from 'react';
import {
  Sparkles,
  Compass,
  Grid3X3,
  Brain,
  Layers,
  Clock,
  Orbit,
  ShieldCheck,
  Download,
  FolderOpen,
  Eye,
  EyeOff,
  Maximize2,
  Minus,
  X,
} from 'lucide-react';
import { HouseSystem } from '../types';

interface MacTitleBarProps {
  activeTab: 'wheel' | 'aspects' | 'archetypes' | 'typologies' | 'transits' | 'asteroids';
  setActiveTab: (tab: 'wheel' | 'aspects' | 'archetypes' | 'typologies' | 'transits' | 'asteroids') => void;
  currentProfileName: string;
  onOpenProfiles: () => void;
  onOpenExport: () => void;
  onOpenOracle: () => void;
  showSacredGeometry: boolean;
  setShowSacredGeometry: (show: boolean) => void;
  houseSystem: HouseSystem;
  onChangeHouseSystem: (sys: HouseSystem) => void;
}

export const MacTitleBar: React.FC<MacTitleBarProps> = ({
  activeTab,
  setActiveTab,
  currentProfileName,
  onOpenProfiles,
  onOpenExport,
  onOpenOracle,
  showSacredGeometry,
  setShowSacredGeometry,
  houseSystem,
  onChangeHouseSystem,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0C0C0E] border-b border-[#222] select-none px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
      {/* Left: macOS Traffic Lights & App Brand */}
      <div className="flex items-center space-x-3">
        {/* Native Traffic Lights */}
        <div className="flex items-center space-x-2 mr-1">
          <button
            title="Close"
            className="w-3 h-3 rounded-full bg-[#FF5F56] hover:opacity-80 transition-opacity flex items-center justify-center group"
          >
            <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            title="Minimize"
            className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:opacity-80 transition-opacity flex items-center justify-center group"
          >
            <Minus className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            title="Zoom"
            className="w-3 h-3 rounded-full bg-[#27C93F] hover:opacity-80 transition-opacity flex items-center justify-center group"
          >
            <Maximize2 className="w-1.5 h-1.5 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Brand & Active Profile Pill */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-[#222]">
          <div className="flex items-center space-x-1.5 font-medium tracking-tight">
            <span className="text-[#D4AF37] font-serif text-base">✦</span>
            <span className="text-[11px] font-medium tracking-widest text-[#888] uppercase font-mono">
              Astraea / Natal Engine
            </span>
          </div>

          <button
            onClick={onOpenProfiles}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#1A1A1C] border border-[#333] hover:bg-[#222] text-xs text-[#D1D1D1] transition-all"
            title="Manage Natal Chart Profiles"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="max-w-[130px] truncate font-medium">{currentProfileName}</span>
            <span className="text-[10px] text-[#666]">⌘O</span>
          </button>
        </div>
      </div>

      {/* Center: macOS Native-style Segmented Control */}
      <nav className="flex items-center bg-[#050507] p-0.5 rounded-lg border border-[#222] shadow-inner">
        <button
          onClick={() => setActiveTab('wheel')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'wheel'
              ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
              : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Natal Wheel</span>
        </button>

        <button
          onClick={() => setActiveTab('aspects')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'aspects'
              ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
              : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Sacred Geometry</span>
        </button>

        <button
          onClick={() => setActiveTab('archetypes')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'archetypes'
              ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
              : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Jungian Archetypes</span>
        </button>

        <button
          onClick={() => setActiveTab('typologies')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'typologies'
              ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
              : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Typology Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('transits')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'transits'
              ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
              : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Transits &amp; Weather</span>
        </button>

        <button
          onClick={() => setActiveTab('asteroids')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeTab === 'asteroids'
              ? 'bg-[#1A1A1C] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
              : 'text-[#888] hover:text-[#D1D1D1] hover:bg-[#151517]'
          }`}
          title="200 Nearest Asteroids &amp; Orbital Transit Observatory"
        >
          <Orbit className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>200 Asteroids</span>
        </button>
      </nav>

      {/* Right: Quick Controls, Offline Badge & AI Oracle */}
      <div className="flex items-center space-x-2.5">
        {/* Sacred Geometry Mandala Quick Toggle */}
        <button
          onClick={() => setShowSacredGeometry(!showSacredGeometry)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center space-x-1.5 border transition-all ${
            showSacredGeometry
              ? 'bg-[#1A1A1C] border-[#D4AF37]/50 text-[#D4AF37]'
              : 'bg-[#1A1A1C] border-[#333] text-[#888] hover:text-[#D1D1D1] hover:bg-[#222]'
          }`}
          title="Toggle Sacred Geometry Harmonic Grid (Phi / Flower of Life)"
        >
          {showSacredGeometry ? (
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-[#666]" />
          )}
          <span className="hidden sm:inline">Harmonics</span>
        </button>

        {/* House System Select */}
        <select
          value={houseSystem}
          onChange={(e) => onChangeHouseSystem(e.target.value as HouseSystem)}
          className="bg-[#1A1A1C] text-[#D1D1D1] border border-[#333] text-xs rounded-md px-2.5 py-1 outline-none hover:bg-[#222] transition-colors cursor-pointer"
          title="House Division System"
        >
          <option value="Placidus">Placidus</option>
          <option value="WholeSign">Whole Sign</option>
          <option value="Equal">Equal House</option>
        </select>

        {/* Export SVG / Dossier */}
        <button
          onClick={onOpenExport}
          className="p-1.5 rounded-md bg-[#1A1A1C] hover:bg-[#222] border border-[#333] text-[#D1D1D1] hover:text-white transition-colors"
          title="Export Natal Chart (SVG, PDF Dossier, JSON)"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* AI Depth Oracle button styled with gold CTA */}
        <button
          onClick={onOpenOracle}
          className="flex items-center space-x-1.5 px-3 py-1 bg-[#D4AF37] text-black font-semibold text-xs rounded-md hover:bg-[#C49F27] transition-all shadow-xs"
          title="Synthesize Chart with Gemini Depth Oracle"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Oracle</span>
        </button>

        {/* Offline Privacy Guarantee Badge */}
        <div
          className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#151517] border border-[#222] text-[11px] font-medium text-[#888]"
          title="All astronomical algorithms & archetype engines calculate 100% locally in your browser. Zero tracking, complete privacy."
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Offline</span>
        </div>
      </div>
    </header>
  );
};
