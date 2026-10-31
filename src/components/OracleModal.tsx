import React, { useState } from 'react';
import { FullNatalChart } from '../types';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  BookOpen,
  Brain,
  ShieldCheck,
} from 'lucide-react';

interface OracleModalProps {
  isOpen: boolean;
  onClose: () => void;
  chart: FullNatalChart;
}

export const OracleModal: React.FC<OracleModalProps> = ({ isOpen, onClose, chart }) => {
  const [question, setQuestion] = useState(
    'Synthesize my primary psychological archetypes (Sun, Moon, Rising) and explain the core individuation tension revealed by my aspects and sacred geometry.'
  );
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAskOracle = async (customPrompt?: string) => {
    const promptToSend = customPrompt || question;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart,
          question: promptToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to synthesize chart');
      }

      setResponse(data.synthesis);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || 'An error occurred while contacting the psychological oracle. Ensure GEMINI_API_KEY is configured.'
      );
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Synthesize my primary psychological archetypes (Sun, Moon, Rising) and individuation path.',
    'How do my Enneagram type and Gene Keys shadow/gift dynamic intertwine?',
    'What is the deepest unconscious shadow revealed by my Saturn and Chiron placements?',
    'How can I creatively integrate the tension of my sacred geometry patterns into my vocation?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0C0C0E] border border-[#222] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Title Bar */}
        <div className="px-5 py-3.5 bg-[#050507] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-[#D1D1D1] font-display">
              Psychological Depth Oracle • Gemini Synthesis
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Oracle Modal"
            className="p-1 rounded-md text-[#888] hover:text-[#D1D1D1] hover:bg-[#1A1A1C] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Prompts */}
          <div>
            <span className="text-xs font-mono uppercase text-[#888] font-semibold block mb-2">
              Contemplative Inquiries
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(p);
                    handleAskOracle(p);
                  }}
                  className="p-2.5 rounded-xl bg-[#151517] hover:bg-[#1A1A1C] border border-[#222] text-left text-xs text-[#D1D1D1] hover:text-white transition-all flex items-start space-x-2 cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-[#888]">
              Custom Inquiry to the Oracle
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about a specific psychological tension, relationship pattern, or vocational calling..."
                className="w-full bg-[#050507] border border-[#222] rounded-xl p-3 text-xs text-[#D1D1D1] outline-none focus:border-[#D4AF37]/70 resize-none transition-colors"
              />
              <button
                disabled={loading}
                onClick={() => handleAskOracle()}
                className="px-5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] disabled:opacity-50 text-[#050507] font-semibold text-xs flex flex-col items-center justify-center gap-1 shrink-0 transition-all shadow-md cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#050507]" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Synthesize</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Container */}
          {loading && (
            <div className="p-8 rounded-2xl bg-[#151517] border border-[#222] text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#0C0C0E] border border-[#333] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#D4AF37] animate-spin" />
              </div>
              <p className="text-xs text-[#D1D1D1] font-medium">
                Synthesizing astronomical chart data, Jungian archetypes, and sacred geometry...
              </p>
              <p className="text-[11px] text-[#888] font-mono">
                Consulting Gemini Depth Model server-side
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-[#1A1111] border border-[#ef4444]/40 text-xs text-[#ef4444]">
              {error}
            </div>
          )}

          {response && (
            <div className="bg-[#151517] border border-[#222] rounded-2xl p-5 text-[#D1D1D1] text-xs leading-relaxed space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-[#222] text-[11px] font-mono text-[#D4AF37]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Archetypal Synthesis
                </span>
                <span className="text-[#888]">Gemini Depth Integration</span>
              </div>
              <div className="whitespace-pre-wrap font-sans text-xs text-[#D1D1D1] space-y-2">
                {response}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="flex items-center space-x-2 text-[11px] text-[#666] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#888] shrink-0" />
            <span>
              Calls to the Gemini model run via server-side API proxy, strictly guarding credentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
