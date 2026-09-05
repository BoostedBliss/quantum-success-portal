import React from 'react';
import { FullNatalChart } from '../types';
import {
  X,
  Download,
  FileCode,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chart: FullNatalChart;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, chart }) => {
  if (!isOpen) return null;

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('astraea-natal-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chart.birthData.name.replace(/\s+/g, '_')}_Natal_Wheel_Sacred_Geometry.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(chart, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chart.birthData.name.replace(/\s+/g, '_')}_Astraea_Chart_Blueprint.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0C0C0E] border border-[#222] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Title Bar */}
        <div className="px-5 py-3.5 bg-[#050507] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-[#D1D1D1] font-display">
              Export Natal Chart Dossier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#888] hover:text-[#D1D1D1] hover:bg-[#1A1A1C] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-[#888]">
            Export the high-precision astronomical calculations and sacred geometry visuals for{' '}
            <strong className="text-[#D4AF37] font-semibold">{chart.birthData.name}</strong>:
          </p>

          <div className="space-y-2.5">
            {/* Download Vector SVG */}
            <button
              onClick={handleDownloadSVG}
              className="w-full p-3.5 rounded-xl bg-[#151517] hover:bg-[#1A1A1C] border border-[#222] hover:border-[#D4AF37]/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#0C0C0E] border border-[#333] flex items-center justify-center text-[#D4AF37]">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#D1D1D1] group-hover:text-[#D4AF37] transition-colors">
                    Vector Natal Chart Wheel (.SVG)
                  </div>
                  <div className="text-[11px] text-[#888]">
                    High-resolution vector graphic including all aspect lines &amp; sacred geometry
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#666] group-hover:text-[#D4AF37] transition-colors" />
            </button>

            {/* Download JSON Blueprint */}
            <button
              onClick={handleDownloadJSON}
              className="w-full p-3.5 rounded-xl bg-[#151517] hover:bg-[#1A1A1C] border border-[#222] hover:border-[#D4AF37]/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#0C0C0E] border border-[#333] flex items-center justify-center text-[#D4AF37]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#D1D1D1] group-hover:text-[#D4AF37] transition-colors">
                    Complete Chart Blueprint (.JSON)
                  </div>
                  <div className="text-[11px] text-[#888]">
                    Calculated degrees, house cusps, sacred patterns, and typology stacks
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#666] group-hover:text-[#D4AF37] transition-colors" />
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrintDossier}
              className="w-full p-3.5 rounded-xl bg-[#151517] hover:bg-[#1A1A1C] border border-[#222] hover:border-[#D4AF37]/50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#0C0C0E] border border-[#333] flex items-center justify-center text-[#D4AF37]">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#D1D1D1] group-hover:text-[#D4AF37] transition-colors">
                    Print / Save to PDF
                  </div>
                  <div className="text-[11px] text-[#888]">
                    Use macOS print dialog to save a clean PDF dossier
                  </div>
                </div>
              </div>
              <Printer className="w-4 h-4 text-[#666] group-hover:text-[#D4AF37] transition-colors" />
            </button>
          </div>

          <div className="pt-2 text-[11px] text-[#666] font-mono text-center">
            All files are produced client-side with 100% data integrity and privacy.
          </div>
        </div>
      </div>
    </div>
  );
};
