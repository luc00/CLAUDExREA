import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Globe, ExternalLink, Zap, Sliders, CheckCircle2 } from 'lucide-react';
import { TargetCategory, ReaBlueprint, ClaudePromptOptions } from '../utils/reverseEngineerEngine';

interface HeroIntakeProps {
  onAnalyze: (target: string, category?: TargetCategory, context?: string, imageBase64?: string, options?: ClaudePromptOptions) => void;
  isLoading: boolean;
  onSelectCurated: (blueprint: ReaBlueprint) => void;
  curatedList: ReaBlueprint[];
}

export function HeroIntake({ onAnalyze, isLoading, onSelectCurated, curatedList }: HeroIntakeProps) {
  const [urlInput, setUrlInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [fidelity, setFidelity] = useState<'pixel_perfect' | 'modernized' | 'fullstack'>('pixel_perfect');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onAnalyze(
      urlInput.trim(),
      undefined,
      contextInput.trim() || undefined,
      undefined,
      { fidelity, targetUrl: urlInput.trim() }
    );
  };

  const handleQuickUrl = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
  };

  const sampleSites = [
    { label: 'Linear.app', url: 'https://linear.app', desc: 'Issue Tracker Reattivo' },
    { label: 'Stripe Checkout', url: 'https://stripe.com/checkout', desc: 'Flusso Pagamenti Tokenizzato' },
    { label: 'Duolingo', url: 'https://duolingo.com', desc: 'Habit Engine & Gamification' },
    { label: 'Dyson Air', url: 'https://dyson.com/air-multiplier', desc: 'Aerodinamica Hardware' }
  ];

  return (
    <section className="relative pt-12 pb-14 border-b border-[#332F2B] bg-[#191716] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#CC785C]/10 via-[#CC785C]/5 to-transparent pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Headline */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#262320] border border-[#3D3833] text-xs font-mono text-[#CC785C] mb-4">
            <img 
              src="/assets/aistudio/free-claude-3d-icon-png-download-14919396_90ac6ee5.png" 
              alt="Claude" 
              className="w-4 h-4 object-contain" 
            />
            <span>Powered by Claude Directives & Artifacts</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#A8A29E]">Reverse Engineering Automatico</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#FAF9F5] mb-4 text-balance">
            Metti l'URL del sito da copiare. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CC785C] via-[#E08B70] to-[#E8B298]">
              Claude lo crea in automatico.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#C4BDB0] leading-relaxed max-w-2xl">
            Inserisci l'indirizzo web di qualsiasi sito o applicazione. REA decostruisce layout, componenti, API e dati, fornendo 
            <strong> indicazioni perfette a Claude</strong> per generare istantaneamente il sito copiato e navigabile live come <em>Claude Artifact</em>.
          </p>
        </div>

        {/* URL Intake Card */}
        <div className="bg-[#201E1C] border border-[#332F2B] rounded-2xl p-5 sm:p-7 shadow-2xl mb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#CC785C]">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="Incolla l'URL del sito che vuoi copiare (es. https://linear.app, stripe.com, cal.com)..."
                  className="w-full pl-10 pr-4 py-3.5 bg-[#171514] border border-[#3D3833] rounded-xl text-sm text-[#FAF9F5] placeholder-[#78716C] focus:outline-none focus:border-[#CC785C] focus:ring-1 focus:ring-[#CC785C] transition-all font-sans"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#CC785C] hover:bg-[#DA7756] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg shadow-[#CC785C]/25 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Claude sta elaborando il sito...</span>
                  </>
                ) : (
                  <>
                    <span className="font-serif font-black text-sm">✦</span>
                    <span>Copia Sito in Automatico su Claude</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Fidelity selector mode */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#292523]">
              <span className="text-xs font-medium text-[#A8A29E] mr-2">Modalità di Copia Claude:</span>
              {(
                [
                  { id: 'pixel_perfect', label: '✦ Copia 1:1 Pixel-Perfect' },
                  { id: 'modernized', label: '✦ Copia Modernizzata (+ UX)' },
                  { id: 'fullstack', label: '✦ Copia Fullstack (+ Mock API)' }
                ] as const
              ).map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFidelity(mode.id)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    fidelity === mode.id
                      ? 'bg-[#332F2B] text-[#CC785C] border border-[#CC785C]/50 font-semibold'
                      : 'text-[#A8A29E] hover:text-[#FAF9F5] hover:bg-[#262320]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Sample URLs quick click */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-[#A8A29E]">
              <span>Prova subito con:</span>
              {sampleSites.map(s => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleQuickUrl(s.url)}
                  className="px-2.5 py-1 bg-[#1A1817] hover:bg-[#262320] border border-[#332F2B] rounded-md text-[#EDE8DF] hover:text-[#CC785C] transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Advanced contextual prompt */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-[#A8A29E] hover:text-[#EDE8DF] transition-colors cursor-pointer"
              >
                {showAdvanced ? '− Nascondi opzioni specifiche' : '+ Aggiungi istruzioni speciali per Claude (es. "Fallo in dark mode", "Aggiungi autenticazione")'}
              </button>
              {showAdvanced && (
                <div className="mt-3">
                  <textarea
                    value={contextInput}
                    onChange={e => setContextInput(e.target.value)}
                    rows={2}
                    placeholder="Istruzioni addizionali da dare a Claude (es. 'Ricrea anche la schermata impostazioni', 'Traduci tutti i testi in italiano', 'Aggiungi animazioni smooth framer-motion')..."
                    className="w-full p-3 bg-[#171514] border border-[#332F2B] rounded-lg text-xs text-[#FAF9F5] placeholder-[#78716C] focus:outline-none focus:border-[#CC785C]"
                  />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Curated Pre-Engineered Websites */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#CC785C] font-serif font-black">✦</span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                Siti già Analizzati con Direttive Claude Pronte
              </h3>
            </div>
            <span className="text-xs text-[#78716C]">1-click per generare su Claude Artifacts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {curatedList.map(item => (
              <button
                key={item.id}
                onClick={() => onSelectCurated(item)}
                className="text-left p-4 rounded-xl bg-[#201E1C]/80 hover:bg-[#201E1C] border border-[#332F2B] hover:border-[#CC785C]/60 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#A8A29E] font-mono mb-2">
                    <span className="uppercase text-[#CC785C]">{item.category.replace('_', ' ')}</span>
                    <span className="text-[#78716C]">Claude Ready</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#FAF9F5] group-hover:text-[#CC785C] transition-colors mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#A8A29E] line-clamp-2 leading-relaxed mb-4">
                    {item.tagline}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#292523] flex items-center justify-between text-xs text-[#CC785C] font-medium">
                  <span>Genera su Claude</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
