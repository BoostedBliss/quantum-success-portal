import React, { useState, useEffect, useMemo } from 'react';
import { BirthData, FullNatalChart, HouseSystem, PlanetPosition } from './types';
import { PRESET_CHARTS } from './lib/cities';
import { calculateNatalChart } from './lib/astronomy';
import { MacTitleBar } from './components/MacTitleBar';
import { NatalWheel } from './components/NatalWheel';
import { AspectMatrix } from './components/AspectMatrix';
import { ArchetypeInspector } from './components/ArchetypeInspector';
import { TypologiesView } from './components/TypologiesView';
import { TransitsView } from './components/TransitsView';
import { AsteroidObservatory } from './components/AsteroidObservatory';
import { ProfileModal } from './components/ProfileModal';
import { ExportModal } from './components/ExportModal';
import { OracleModal } from './components/OracleModal';
import {
  Compass,
  Grid3X3,
  Brain,
  Layers,
  Clock,
  ShieldCheck,
  Info,
  Sparkles,
} from 'lucide-react';

const LOCAL_STORAGE_KEY_CURRENT = 'astraea_current_birth_data';
const LOCAL_STORAGE_KEY_PROFILES = 'astraea_saved_profiles';

export default function App() {
  // Load saved birth data or default to Carl Jung preset
  const [birthData, setBirthData] = useState<BirthData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return PRESET_CHARTS[0]; // Carl Gustav Jung
  });

  // Saved local profiles list
  const [savedProfiles, setSavedProfiles] = useState<BirthData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return PRESET_CHARTS;
  });

  const [activeTab, setActiveTab] = useState<
    'wheel' | 'aspects' | 'archetypes' | 'typologies' | 'transits' | 'asteroids'
  >('wheel');
  const [showSacredGeometry, setShowSacredGeometry] = useState(true);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isOracleModalOpen, setIsOracleModalOpen] = useState(false);

  // Save current profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT, JSON.stringify(birthData));
    } catch (e) {
      console.error(e);
    }
  }, [birthData]);

  // Save profile list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(savedProfiles));
    } catch (e) {
      console.error(e);
    }
  }, [savedProfiles]);

  // Calculate full natal chart (Astronomical ephemeris + Keplerian solver + Placidus houses + Sacred Geometry)
  const chart: FullNatalChart = useMemo(() => {
    return calculateNatalChart(birthData);
  }, [birthData]);

  const handleSaveBirthData = (newData: BirthData) => {
    setBirthData(newData);
    // Add to saved profiles if not already present
    setSavedProfiles((prev) => {
      const existing = prev.findIndex((p) => p.id === newData.id);
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = newData;
        return copy;
      }
      return [newData, ...prev];
    });
  };

  const handleDeleteProfile = (id: string) => {
    setSavedProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleChangeHouseSystem = (sys: HouseSystem) => {
    setBirthData((prev) => ({ ...prev, houseSystem: sys }));
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#D1D1D1] flex flex-col items-center justify-start p-1 sm:p-3 md:p-6 antialiased selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      {/* macOS Window Frame */}
      <div className="w-full max-w-7xl bg-[#0C0C0E] border border-[#222] rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[92vh]">
        {/* macOS Title Bar & App Header */}
        <MacTitleBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentProfileName={birthData.name}
          onOpenProfiles={() => setIsProfileModalOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenOracle={() => setIsOracleModalOpen(true)}
          showSacredGeometry={showSacredGeometry}
          setShowSacredGeometry={setShowSacredGeometry}
          houseSystem={birthData.houseSystem}
          onChangeHouseSystem={handleChangeHouseSystem}
        />

        {/* Main Application Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#050507] relative">
          {/* Subtle star-dust / coordinate dot-matrix background from Elegant Dark theme */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10">
            {activeTab === 'wheel' && (
              <NatalWheel
                chart={chart}
                showSacredGeometry={showSacredGeometry}
              />
            )}

            {activeTab === 'aspects' && (
              <AspectMatrix chart={chart} />
            )}

            {activeTab === 'archetypes' && (
              <ArchetypeInspector chart={chart} />
            )}

            {activeTab === 'typologies' && (
              <TypologiesView chart={chart} />
            )}

            {activeTab === 'transits' && (
              <TransitsView chart={chart} />
            )}

            {activeTab === 'asteroids' && (
              <AsteroidObservatory />
            )}
          </div>
        </main>

        {/* macOS Status Bar */}
        <footer className="px-4 py-2 bg-[#0C0C0E] border-t border-[#222] text-[11px] font-mono text-[#666] flex flex-wrap items-center justify-between gap-2 select-none">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 text-[#D1D1D1]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>{birthData.name}</span>
            </span>
            <span className="text-[#333]">|</span>
            <span className="text-[#888]">
              {birthData.birthDate} • {birthData.birthTime} (UTC
              {birthData.timezone >= 0 ? `+${birthData.timezone}` : birthData.timezone})
            </span>
            <span className="text-[#333] hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[#888]">
              {birthData.city} ({birthData.latitude.toFixed(2)}°, {birthData.longitude.toFixed(2)}°)
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[#777]">
            <span>House: <strong className="text-[#D1D1D1] font-normal">{birthData.houseSystem}</strong></span>
            <span className="text-[#333]">•</span>
            <span>Aspects: <strong className="text-[#D1D1D1] font-normal">{chart.aspects.length}</strong></span>
            <span className="text-[#333]">•</span>
            <span className="text-[#D4AF37]">
              Harmonics: {chart.sacredPatterns.length} Formations
            </span>
            <span className="text-[#333] hidden md:inline">•</span>
            <span className="text-[#38bdf8] hidden sm:inline">
              200 NEAs &amp; Transits
            </span>
            <span className="text-[#333] hidden md:inline">•</span>
            <span className="text-[#888] hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              100% Offline Engine
            </span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentBirthData={birthData}
        onSaveBirthData={handleSaveBirthData}
        savedProfiles={savedProfiles}
        onDeleteProfile={handleDeleteProfile}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        chart={chart}
      />

      <OracleModal
        isOpen={isOracleModalOpen}
        onClose={() => setIsOracleModalOpen(false)}
        chart={chart}
      />
    </div>
  );
}
