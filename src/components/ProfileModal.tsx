import React, { useState } from 'react';
import { BirthData, HouseSystem } from '../types';
import { CITIES_DATABASE, PRESET_CHARTS } from '../lib/cities';
import {
  X,
  User,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Save,
  Trash2,
  Check,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBirthData: BirthData;
  onSaveBirthData: (data: BirthData) => void;
  savedProfiles: BirthData[];
  onDeleteProfile: (id: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentBirthData,
  onSaveBirthData,
  savedProfiles,
  onDeleteProfile,
}) => {
  const [formData, setFormData] = useState<BirthData>({ ...currentBirthData });
  const [citySearch, setCitySearch] = useState('');
  const [showManualCoords, setShowManualCoords] = useState(false);

  if (!isOpen) return null;

  const filteredCities = CITIES_DATABASE.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSelectCity = (c: (typeof CITIES_DATABASE)[0]) => {
    setFormData({
      ...formData,
      city: `${c.name}, ${c.country}`,
      latitude: c.latitude,
      longitude: c.longitude,
      timezone: c.timezone,
    });
    setCitySearch('');
  };

  const handleSelectPreset = (preset: BirthData) => {
    setFormData({ ...preset, id: crypto.randomUUID() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBirthData(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0C0C0E] border border-[#222] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* macOS Modal Title Bar */}
        <div className="px-5 py-3.5 bg-[#050507] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-[#D1D1D1] font-display">
              Natal Chart Profile &amp; Ephemeris Parameters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#888] hover:text-[#D1D1D1] hover:bg-[#1A1A1C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Historical Presets */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#888] font-semibold block mb-2">
              Historical Archetypal Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_CHARTS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-3 py-1.5 rounded-lg bg-[#151517] hover:bg-[#1A1A1C] border border-[#222] text-xs text-[#D1D1D1] hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#888] mb-1">
                Subject Full Name / Alias
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Carl Gustav Jung"
                  className="w-full bg-[#050507] border border-[#222] rounded-xl pl-9 pr-3 py-2 text-sm text-[#D1D1D1] outline-none focus:border-[#D4AF37]/70 transition-colors"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">
                  Birth Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full bg-[#050507] border border-[#222] rounded-xl pl-9 pr-3 py-2 text-sm text-[#D1D1D1] outline-none focus:border-[#D4AF37]/70 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#888] mb-1">
                  Birth Time (Exact Minute)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
                  <input
                    type="time"
                    required
                    value={formData.birthTime}
                    onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                    className="w-full bg-[#050507] border border-[#222] rounded-xl pl-9 pr-3 py-2 text-sm text-[#D1D1D1] outline-none focus:border-[#D4AF37]/70 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* City Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-[#888]">
                  Birth Location
                </label>
                <button
                  type="button"
                  onClick={() => setShowManualCoords(!showManualCoords)}
                  className="text-[11px] text-[#D4AF37] hover:underline font-mono"
                >
                  {showManualCoords ? 'Use City Search' : 'Enter Manual Lat/Lng'}
                </button>
              </div>

              {!showManualCoords ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder={`Currently: ${formData.city} (Type to search cities...)`}
                      className="w-full bg-[#050507] border border-[#222] rounded-xl pl-9 pr-3 py-2 text-sm text-[#D1D1D1] outline-none focus:border-[#D4AF37]/70 transition-colors"
                    />
                  </div>

                  {citySearch && (
                    <div className="max-h-36 overflow-y-auto bg-[#050507] border border-[#222] rounded-xl divide-y divide-[#222]">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((c) => (
                          <div
                            key={`${c.name}-${c.country}`}
                            onClick={() => handleSelectCity(c)}
                            className="p-2.5 hover:bg-[#151517] cursor-pointer flex items-center justify-between text-xs text-[#D1D1D1]"
                          >
                            <span>
                              {c.name}, {c.country}
                            </span>
                            <span className="text-[10px] font-mono text-[#888]">
                              {c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}° (UTC
                              {c.timezone >= 0 ? `+${c.timezone}` : c.timezone})
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-[#888] text-center">
                          No matching cities in offline database. Toggle "Enter Manual Lat/Lng" above.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-[#888]">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#050507] border border-[#222] rounded-lg p-2 text-xs text-[#D1D1D1] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#888]">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#050507] border border-[#222] rounded-lg p-2 text-xs text-[#D1D1D1] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#888]">UTC Offset</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.timezone}
                      onChange={(e) =>
                        setFormData({ ...formData, timezone: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#050507] border border-[#222] rounded-lg p-2 text-xs text-[#D1D1D1] font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* House System */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#888] mb-1">
                House Division System
              </label>
              <select
                value={formData.houseSystem}
                onChange={(e) =>
                  setFormData({ ...formData, houseSystem: e.target.value as HouseSystem })
                }
                className="w-full bg-[#050507] border border-[#222] rounded-xl px-3 py-2 text-sm text-[#D1D1D1] outline-none focus:border-[#D4AF37]/70 cursor-pointer"
              >
                <option value="Placidus">Placidus (Standard Time-Proportional)</option>
                <option value="WholeSign">Whole Sign (Classical Hellenistic)</option>
                <option value="Equal">Equal House (30° from Ascendant)</option>
              </select>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="flex items-center space-x-2 text-[11px] text-[#888] bg-[#050507] p-2.5 rounded-xl border border-[#222] font-mono">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                100% Private: All planetary calculations run locally on your device. Zero personal data leaves this computer.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-[#D1D1D1] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#050507] font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Calculate &amp; Save Profile</span>
              </button>
            </div>
          </form>

          {/* Saved Profiles Drawer */}
          {savedProfiles.length > 0 && (
            <div className="pt-4 border-t border-[#222]">
              <span className="text-xs font-mono uppercase text-[#888] font-semibold block mb-2">
                Saved Local Profiles ({savedProfiles.length})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {savedProfiles.map((prof) => (
                  <div
                    key={prof.id}
                    className="p-2 rounded-xl bg-[#151517] border border-[#222] flex items-center justify-between text-xs text-[#D1D1D1]"
                  >
                    <div
                      onClick={() => {
                        onSaveBirthData(prof);
                        onClose();
                      }}
                      className="cursor-pointer hover:text-[#D4AF37] flex items-center space-x-2"
                    >
                      <span className="font-semibold">{prof.name}</span>
                      <span className="text-[11px] font-mono text-[#888]">
                        {prof.birthDate} ({prof.city})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteProfile(prof.id)}
                      className="p-1 text-[#666] hover:text-[#ef4444] transition-colors cursor-pointer"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
