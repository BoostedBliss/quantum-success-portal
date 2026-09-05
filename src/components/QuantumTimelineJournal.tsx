import React, { useState, useEffect, useMemo } from 'react';
import {
  QuantumJournalEntry,
  QuantumJournalState,
  PlanetId,
  FullNatalChart,
} from '../types';
import { ASTEROIDS_200_CATALOG } from '../lib/asteroidsData';
import { JUNGIAN_ARCHETYPES } from '../lib/archetypes';
import {
  Orbit,
  Sparkles,
  Plus,
  Calendar,
  Compass,
  Tag,
  Trash2,
  Filter,
  Search,
  Download,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Star,
  Brain,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'quantum_timeline_journal_entries_v1';

const INITIAL_SAMPLE_ENTRIES: QuantumJournalEntry[] = [
  {
    id: 'entry-apophis-1',
    createdAt: '2026-09-04T18:30:00.000Z',
    entryDate: '2026-09-04',
    title: 'Sovereign Authority & Apophis Nodal Shift',
    realization:
      'Recognized that external uncertainty is an invitation to anchor deeper internal sovereignty. As Asteroid (99942) Apophis charts its dramatic close approach trajectory, the psychological mirror is that disruptive crossroads are not catastrophes, but accelerants for discarding obsolete false-self survival mechanisms.',
    groundedAction:
      'Decline two energy-draining peripheral commitments and dedicate two uninterrupted morning hours to writing the core synthesis blueprint.',
    asteroidId: '99942',
    asteroidName: '(99942) Apophis',
    transitDate: '2029-04-13',
    transitDistanceLD: 0.08,
    asteroidSign: 'Leo',
    planetArchetype: 'Sun',
    archetypeName: 'The Sovereign Self',
    quantumState: 'Breakthrough',
    resonanceScore: 5,
    tags: ['Sovereignty', 'Apophis', 'Courage', 'Shadow Integration'],
  },
  {
    id: 'entry-bennu-2',
    createdAt: '2026-08-28T09:15:00.000Z',
    entryDate: '2026-08-28',
    title: 'Primordial Memory & Carbonaceous Organic Roots',
    realization:
      'Reflecting on Bennu carrying prebiotic amino acids and solar system dawn records: intuitive clarity emerged regarding early childhood emotional conditioning. Unconscious protective defenses were formed to guard sensitive creative gifts, which are now ready to be reclaimed without shame.',
    groundedAction:
      'Practice 15 minutes of somatic breathwork and journaling every evening before sleep to integrate somatic emotional releases.',
    asteroidId: '101955',
    asteroidName: '(101955) Bennu',
    transitDate: '2026-09-24',
    transitDistanceLD: 1.9,
    asteroidSign: 'Virgo',
    planetArchetype: 'Moon',
    archetypeName: 'The Anima / Soul Matrix',
    quantumState: 'Integration',
    resonanceScore: 4,
    tags: ['Bennu', 'Emotional Memory', 'Inner Child', 'Somatic'],
  },
  {
    id: 'entry-psyche-3',
    createdAt: '2026-08-15T14:20:00.000Z',
    entryDate: '2026-08-15',
    title: 'The Indestructible Metallic Core',
    realization:
      'Contemplating (16) Psyche’s exposed nickel-iron metallic core after protoplanetary collisions. When surface superficialities are stripped by life challenges, what remains is an unshakeable structural integrity. The fear of failure dissolves when identity is rooted in inner core resilience rather than external validation.',
    groundedAction:
      'Set clear boundaries around project scope at work and speak candidly about capacity without apologetic over-explaining.',
    asteroidId: '16',
    asteroidName: '(16) Psyche',
    transitDate: '2027-08-15',
    transitDistanceLD: 684.0,
    asteroidSign: 'Capricorn',
    planetArchetype: 'Saturn',
    archetypeName: 'The Wise Elder / Architect',
    quantumState: 'Epiphany',
    resonanceScore: 5,
    tags: ['Psyche', 'Core Integrity', 'Boundaries', 'M-Type'],
  },
];

interface QuantumTimelineJournalProps {
  chart: FullNatalChart;
  selectedPlanet: PlanetId;
  onSelectPlanet?: (planetId: PlanetId) => void;
}

export const QuantumTimelineJournal: React.FC<QuantumTimelineJournalProps> = ({
  chart,
  selectedPlanet,
  onSelectPlanet,
}) => {
  // Load entries from localStorage or fallback to initial samples
  const [entries, setEntries] = useState<QuantumJournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_SAMPLE_ENTRIES;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Ignore quota error
    }
  }, [entries]);

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('all');
  const [filterPlanet, setFilterPlanet] = useState<string>('all');

  // Form fields
  const [formDate, setFormDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [formTitle, setFormTitle] = useState('');
  const [formRealization, setFormRealization] = useState('');
  const [formGroundedAction, setFormGroundedAction] = useState('');
  const [formAsteroidId, setFormAsteroidId] = useState<string>('99942');
  const [formPlanet, setFormPlanet] = useState<PlanetId>(selectedPlanet);
  const [formQuantumState, setFormQuantumState] =
    useState<QuantumJournalState>('Breakthrough');
  const [formResonance, setFormResonance] = useState<number>(5);
  const [formTagInput, setFormTagInput] = useState<string>('');
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [showAsteroidDropdown, setShowAsteroidDropdown] = useState(false);
  const [asteroidSearch, setAsteroidSearch] = useState('');

  // Sync default form planet when selectedPlanet prop changes
  useEffect(() => {
    if (!isCreating) {
      setFormPlanet(selectedPlanet);
    }
  }, [selectedPlanet, isCreating]);

  // Notable transit list curated for quick selection
  const asteroidOptions = useMemo(() => {
    if (!asteroidSearch.trim()) {
      return ASTEROIDS_200_CATALOG.slice(0, 30);
    }
    const q = asteroidSearch.toLowerCase();
    return ASTEROIDS_200_CATALOG.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.designation.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q)
    ).slice(0, 40);
  }, [asteroidSearch]);

  const selectedAsteroidObj = useMemo(() => {
    return (
      ASTEROIDS_200_CATALOG.find((a) => a.id === formAsteroidId) ||
      ASTEROIDS_200_CATALOG[0]
    );
  }, [formAsteroidId]);

  const handleAddTag = () => {
    const trimmed = formTagInput.trim().replace(/^#/, '');
    if (trimmed && !tagsList.includes(trimmed)) {
      setTagsList([...tagsList, trimmed]);
      setFormTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTagsList(tagsList.filter((t) => t !== tagToRemove));
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formRealization.trim()) {
      return;
    }

    const ast = selectedAsteroidObj;
    const arch = JUNGIAN_ARCHETYPES[formPlanet];

    const newEntry: QuantumJournalEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      entryDate: formDate || new Date().toISOString().split('T')[0],
      title: formTitle.trim(),
      realization: formRealization.trim(),
      groundedAction:
        formGroundedAction.trim() ||
        'Reflect and integrate this intuitive discovery in daily contemplation.',
      asteroidId: ast.id,
      asteroidName: ast.designation || ast.name,
      transitDate: ast.nextTransit?.date || '2026-10-01',
      transitDistanceLD: ast.nextTransit?.distanceLunarDistances || 1.0,
      asteroidSign: ast.nextTransit?.sign,
      planetArchetype: formPlanet,
      archetypeName: arch?.name || formPlanet,
      quantumState: formQuantumState,
      resonanceScore: formResonance,
      tags: tagsList.length > 0 ? tagsList : [ast.name, arch?.name || formPlanet],
    };

    setEntries([newEntry, ...entries]);

    // Reset Form
    setFormTitle('');
    setFormRealization('');
    setFormGroundedAction('');
    setTagsList([]);
    setFormTagInput('');
    setIsCreating(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handleExportJournal = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Quantum_Timeline_Journal_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        !searchQuery.trim() ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.realization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.groundedAction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.asteroidName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesState =
        filterState === 'all' || entry.quantumState === filterState;

      const matchesPlanet =
        filterPlanet === 'all' || entry.planetArchetype === filterPlanet;

      return matchesSearch && matchesState && matchesPlanet;
    });
  }, [entries, searchQuery, filterState, filterPlanet]);

  // Color mapping for quantum states
  const getStateBadgeStyle = (state: QuantumJournalState) => {
    switch (state) {
      case 'Breakthrough':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Synchronicity':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
      case 'Integration':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Epiphany':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Reframing':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-[#222] text-[#ccc] border-[#333]';
    }
  };

  return (
    <section
      id="quantum-timeline-journal"
      className="bg-[#111113] border border-[#D4AF37]/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#222]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#1A1A1C] border border-[#D4AF37]/40 text-[#D4AF37]">
              <Orbit className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-[#F0F0F2] font-display flex items-center gap-2">
              Quantum Timeline Journal
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-wider">
                Intuitive Synthesizer
              </span>
            </h3>
          </div>
          <p className="text-xs text-[#8E8E93] mt-1.5 leading-relaxed max-w-2xl">
            Log daily intuitive realizations, synchronicities, and breakthroughs correlated with specific asteroid transits and your active psychological archetypes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            id="journal-export-btn"
            onClick={handleExportJournal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8E8E93] hover:text-[#D1D1D1] bg-[#161618] hover:bg-[#1E1E22] border border-[#2A2A2E] transition-all"
            title="Export Timeline Journal to JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            id="journal-new-entry-btn"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0C0C0E] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:brightness-110 shadow-sm transition-all"
          >
            {isCreating ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Close Editor</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Log Realization</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Creation Modal / Inline Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreateEntry}
          className="bg-[#161618] border border-[#D4AF37]/40 rounded-xl p-5 space-y-4 shadow-inner animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2E]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#F0F0F2]">
                New Intuitive Realization Entry
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8E8E93]">
              Subject: {chart.birthData.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Entry Date */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1">
                Entry Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-[#0C0C0E] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#D1D1D1] focus:outline-hidden focus:border-[#D4AF37]"
                  required
                />
              </div>
            </div>

            {/* Correlated Asteroid Transit */}
            <div className="relative">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] mb-1 flex items-center justify-between">
                <span>Correlated Asteroid Transit</span>
                <span className="text-[10px] text-[#888] lowercase">
                  ({selectedAsteroidObj.nextTransit?.distanceLunarDistances || 0} LD)
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowAsteroidDropdown(!showAsteroidDropdown)}
                className="w-full bg-[#0C0C0E] border border-[#333] rounded-lg px-3 py-2 text-xs text-left text-[#D1D1D1] flex items-center justify-between hover:border-[#444] transition-all"
              >
                <span className="truncate">
                  {selectedAsteroidObj.designation || selectedAsteroidObj.name} • {selectedAsteroidObj.nextTransit?.date}
                </span>
                {showAsteroidDropdown ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#888] shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#888] shrink-0" />
                )}
              </button>

              {showAsteroidDropdown && (
                <div className="absolute z-30 mt-1 w-full bg-[#0C0C0E] border border-[#333] rounded-lg shadow-2xl p-2 max-h-56 overflow-y-auto space-y-1">
                  <input
                    type="text"
                    placeholder="Search 200 asteroids..."
                    value={asteroidSearch}
                    onChange={(e) => setAsteroidSearch(e.target.value)}
                    className="w-full bg-[#151517] border border-[#262626] rounded px-2.5 py-1 text-xs text-[#D1D1D1] mb-1.5 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                  {asteroidOptions.map((ast) => (
                    <button
                      key={ast.id}
                      type="button"
                      onClick={() => {
                        setFormAsteroidId(ast.id);
                        setShowAsteroidDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all flex items-center justify-between ${
                        formAsteroidId === ast.id
                          ? 'bg-[#1F1F24] text-[#D4AF37] font-semibold'
                          : 'text-[#999] hover:text-[#eee] hover:bg-[#1A1A1C]'
                      }`}
                    >
                      <span className="truncate">{ast.designation}</span>
                      <span className="text-[10px] font-mono text-[#666] shrink-0">
                        {ast.nextTransit?.distanceLunarDistances} LD
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Correlated Archetype */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1">
                Active Archetypal Matrix
              </label>
              <select
                value={formPlanet}
                onChange={(e) => setFormPlanet(e.target.value as PlanetId)}
                className="w-full bg-[#0C0C0E] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#D1D1D1] focus:outline-hidden focus:border-[#D4AF37]"
              >
                {chart.planets.map((p) => {
                  const arch = JUNGIAN_ARCHETYPES[p.id];
                  return (
                    <option key={p.id} value={p.id}>
                      {p.glyph} {p.name} • {arch?.name || p.id}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Title & Quantum State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1">
                Realization Theme / Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Confronting the Shadow of Perfectionism during Apophis Transit"
                className="w-full bg-[#0C0C0E] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#D1D1D1] focus:outline-hidden focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1">
                Quantum State
              </label>
              <select
                value={formQuantumState}
                onChange={(e) =>
                  setFormQuantumState(e.target.value as QuantumJournalState)
                }
                className="w-full bg-[#0C0C0E] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#D1D1D1] focus:outline-hidden focus:border-[#D4AF37]"
              >
                <option value="Breakthrough">Breakthrough (Catalytic Shift)</option>
                <option value="Synchronicity">Synchronicity (Meaningful Alignment)</option>
                <option value="Integration">Integration (Grounded Synthesis)</option>
                <option value="Epiphany">Epiphany (Direct Intuitive Knowing)</option>
                <option value="Reframing">Reframing (Alchemical Perspective)</option>
              </select>
            </div>
          </div>

          {/* Realization Text */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1 flex items-center justify-between">
              <span>Intuitive Realization &amp; Phenomenological Observations</span>
              <span className="text-[10px] text-[#666]">
                Prompt: "{JUNGIAN_ARCHETYPES[formPlanet]?.contemplativePrompt || 'What truth surfaced today?'}"
              </span>
            </label>
            <textarea
              rows={3}
              value={formRealization}
              onChange={(e) => setFormRealization(e.target.value)}
              placeholder="Record the spontaneous realization, synchronicity, or emotional shift experienced during this celestial window..."
              className="w-full bg-[#0C0C0E] border border-[#333] rounded-lg p-3 text-xs text-[#D1D1D1] leading-relaxed focus:outline-hidden focus:border-[#D4AF37]"
              required
            />
          </div>

          {/* Grounded Action */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Grounded Action Step (Anchoring Realization in Reality)</span>
            </label>
            <input
              type="text"
              value={formGroundedAction}
              onChange={(e) => setFormGroundedAction(e.target.value)}
              placeholder="What concrete action or behavioral shift will you embody today to ground this insight?"
              className="w-full bg-[#0C0C0E] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#D1D1D1] focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          {/* Resonance Score & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1">
                Resonance Intensity (1–5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormResonance(num)}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-mono transition-all ${
                      formResonance >= num
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                        : 'bg-[#0C0C0E] text-[#555] border border-[#222]'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        formResonance >= num ? 'fill-[#D4AF37]' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] mb-1">
                Tags &amp; Keywords
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formTagInput}
                  onChange={(e) => setFormTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. Somatic, Apophis, Sovereignty"
                  className="flex-1 bg-[#0C0C0E] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-[#D1D1D1] focus:outline-hidden focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-lg text-xs bg-[#222] hover:bg-[#2c2c2f] text-[#ccc] border border-[#333]"
                >
                  Add
                </button>
              </div>

              {tagsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagsList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1F1F24] border border-[#333] text-[10px] font-mono text-[#D1D1D1]"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#2A2A2E]">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#888] hover:text-[#ccc] bg-transparent hover:bg-[#1A1A1D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold text-[#0C0C0E] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:brightness-110 shadow-md"
            >
              Save Realization
            </button>
          </div>
        </form>
      )}

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0C0C0E] border border-[#222] rounded-xl p-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#666]" />
          <input
            type="text"
            placeholder="Search realizations, asteroids, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151517] border border-[#262626] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#D1D1D1] placeholder-[#666] focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Filter by State */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3 h-3 text-[#666]" />
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="bg-[#151517] border border-[#262626] rounded-lg px-2.5 py-1 text-xs text-[#D1D1D1] focus:outline-hidden"
            >
              <option value="all">All States ({entries.length})</option>
              <option value="Breakthrough">Breakthrough</option>
              <option value="Synchronicity">Synchronicity</option>
              <option value="Integration">Integration</option>
              <option value="Epiphany">Epiphany</option>
              <option value="Reframing">Reframing</option>
            </select>
          </div>

          {/* Filter by Archetype */}
          <select
            value={filterPlanet}
            onChange={(e) => setFilterPlanet(e.target.value)}
            className="bg-[#151517] border border-[#262626] rounded-lg px-2.5 py-1 text-xs text-[#D1D1D1] focus:outline-hidden shrink-0"
          >
            <option value="all">All Archetypes</option>
            {chart.planets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.glyph} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Realization Feed / Timeline View */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[#262626] rounded-xl bg-[#0C0C0E]/50 space-y-3">
          <BookOpen className="w-8 h-8 text-[#555] mx-auto" />
          <div className="text-sm font-medium text-[#888]">
            No realizations found matching your query
          </div>
          <p className="text-xs text-[#666] max-w-sm mx-auto">
            Try adjusting search parameters or click "Log Realization" to record a new discovery correlated with an asteroid transit.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterState('all');
              setFilterPlanet('all');
            }}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#1F1F24] text-[#D4AF37] border border-[#333]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="relative pl-4 md:pl-6 space-y-6 before:absolute before:top-3 before:bottom-3 before:left-2 md:before:left-3 before:w-px before:bg-gradient-to-b before:from-[#D4AF37]/40 before:via-[#333] before:to-transparent">
          {filteredEntries.map((entry) => {
            const planetObj = chart.planets.find(
              (p) => p.id === entry.planetArchetype
            );

            return (
              <div
                key={entry.id}
                className="relative bg-[#151517] border border-[#262626] hover:border-[#D4AF37]/40 rounded-xl p-4 md:p-5 transition-all shadow-md group"
              >
                {/* Timeline node pin */}
                <div className="absolute -left-4 md:-left-6 top-5 w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-4 ring-[#111113]" />

                {/* Top Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#D4AF37] flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      {entry.entryDate}
                    </span>

                    <span className="text-[#444]">•</span>

                    {/* Quantum State Badge */}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${getStateBadgeStyle(
                        entry.quantumState
                      )}`}
                    >
                      {entry.quantumState}
                    </span>

                    <span className="text-[#444]">•</span>

                    {/* Correlated Archetype */}
                    <button
                      type="button"
                      onClick={() => onSelectPlanet?.(entry.planetArchetype)}
                      className="text-xs font-mono text-[#D1D1D1] hover:text-[#D4AF37] flex items-center gap-1 px-2 py-0.5 rounded bg-[#0C0C0E] border border-[#262626] transition-all"
                      title="Inspect this archetype above"
                    >
                      <span style={{ color: planetObj?.color || '#D4AF37' }}>
                        {planetObj?.glyph || '•'}
                      </span>
                      <span>{entry.archetypeName}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Resonance score */}
                    <div className="flex items-center gap-0.5" title={`Resonance: ${entry.resonanceScore}/5`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= entry.resonanceScore
                              ? 'text-[#D4AF37] fill-[#D4AF37]'
                              : 'text-[#333]'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1 text-[#666] hover:text-red-400 transition-all rounded hover:bg-[#1F1F24]"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Correlated Asteroid Banner */}
                <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#F0F0F2] font-display">
                    {entry.title}
                  </h4>

                  {/* Correlated Asteroid Info Pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0C0C0E] border border-[#D4AF37]/30 text-xs font-mono text-[#D4AF37] self-start md:self-auto">
                    <Orbit className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-semibold">{entry.asteroidName}</span>
                    <span className="text-[#888]">Transit: {entry.transitDate}</span>
                    <span className="text-sky-400">({entry.transitDistanceLD} LD)</span>
                  </div>
                </div>

                {/* Realization Body */}
                <div className="mt-3 p-3.5 rounded-lg bg-[#0C0C0E]/70 border border-[#222] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#888] flex items-center gap-1">
                    <Brain className="w-3 h-3 text-[#D4AF37]" />
                    Intuitive Realization
                  </span>
                  <p className="text-xs text-[#D1D1D1] leading-relaxed whitespace-pre-wrap">
                    {entry.realization}
                  </p>
                </div>

                {/* Grounded Action Step */}
                <div className="mt-2.5 p-3 rounded-lg bg-[#121815] border border-emerald-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                      Grounded Timeline Integration Step
                    </span>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      {entry.groundedAction}
                    </p>
                  </div>
                </div>

                {/* Tags Footer */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1F1F24]">
                    <Tag className="w-3 h-3 text-[#555]" />
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0C0C0E] text-[#8E8E93] border border-[#222]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
