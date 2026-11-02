import React from 'react';
import { Sparkles, Download, Copy, ExternalLink, Terminal, Globe } from 'lucide-react';

interface HeaderProps {
  activeView: 'explorer' | 'blueprint' | 'sandbox' | 'presets';
  setActiveView: (view: 'explorer' | 'blueprint' | 'sandbox' | 'presets') => void;
  onNewReverseEng: () => void;
  onExportAll: () => void;
  onOpenClaudeDirect: () => void;
}

export function Header({ 
  activeView, 
  setActiveView, 
  onNewReverseEng, 
  onExportAll,
  onOpenClaudeDirect 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#191716]/95 backdrop-blur-md border-b border-[#332F2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title with Claude warm terracotta asterisk */}
        <button 
          onClick={() => setActiveView('explorer')}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
        >
          <img 
            src="/assets/aistudio/free-claude-3d-icon-png-download-14919396_90ac6ee5.png" 
            alt="Claude 3D Logo" 
            className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform shrink-0" 
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#FAF9F5] group-hover:text-[#CC785C] transition-colors whitespace-nowrap shrink-0">
              REA <span className="text-[#CC785C] font-mono text-xs font-normal">× Claude</span>
            </span>
            <span className="text-[10px] text-[#A8A29E] font-medium tracking-wide">
              Site Cloner & Claude Artifacts Engine
            </span>
          </div>
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#A8A29E]">
          <button 
            onClick={() => setActiveView('explorer')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeView === 'explorer' ? 'text-[#CC785C] font-semibold' : 'hover:text-[#FAF9F5]'}`}
          >
            Copia Sito (URL)
          </button>
          <button 
            onClick={() => setActiveView('blueprint')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeView === 'blueprint' ? 'text-[#CC785C] font-semibold' : 'hover:text-[#FAF9F5]'}`}
          >
            Direttive & Schema Claude
          </button>
          <button 
            onClick={() => setActiveView('sandbox')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${activeView === 'sandbox' ? 'text-[#CC785C] font-semibold' : 'hover:text-[#FAF9F5]'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CC785C]" />
            Generatore Claude Artifacts
          </button>
          <button 
            onClick={() => setActiveView('presets')}
            className={`transition-colors whitespace-nowrap shrink-0 ${activeView === 'presets' ? 'text-[#CC785C] font-semibold' : 'hover:text-[#FAF9F5]'}`}
          >
            Siti Iconici Pronti
          </button>
        </nav>

        {/* Zone 3: Primary action button & Claude quick link */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenClaudeDirect}
            title="Apri Claude.ai con le direttive del sito corrente"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FAF9F5] bg-[#292523] hover:bg-[#332F2B] border border-[#3D3833] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#CC785C]" />
            <span>Apri in Claude</span>
          </button>

          <button
            onClick={onNewReverseEng}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#CC785C] hover:bg-[#DA7756] rounded-lg shadow-md shadow-[#CC785C]/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Copia Nuovo Sito</span>
          </button>
        </div>
      </div>
    </header>
  );
}
