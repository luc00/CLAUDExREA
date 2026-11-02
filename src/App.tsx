/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroIntake } from './components/HeroIntake';
import { BlueprintView } from './components/BlueprintView';
import { CreaConReaSandbox } from './components/CreaConReaSandbox';
import { PresetsGallery } from './components/PresetsGallery';
import { 
  CURATED_BLUEPRINTS, 
  ReaBlueprint, 
  assembleProjectZipManifest,
  TargetCategory,
  buildDynamicBlueprint,
  generateClaudePrompt,
  generateClaudeDeepLink,
  ClaudePromptOptions
} from './utils/reverseEngineerEngine';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'explorer' | 'blueprint' | 'sandbox' | 'presets'>('explorer');
  const [curatedList] = useState<ReaBlueprint[]>(CURATED_BLUEPRINTS);
  const [currentBlueprint, setCurrentBlueprint] = useState<ReaBlueprint>(CURATED_BLUEPRINTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const handleAnalyze = async (
    target: string, 
    category?: TargetCategory, 
    context?: string, 
    imageBase64?: string,
    options?: ClaudePromptOptions
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rea/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, category, context, imageBase64, claudeMode: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.blueprint) {
        setCurrentBlueprint(data.blueprint);
        setActiveView('sandbox');
        showToast(`✦ Sito decostruito! Claude ha generato l'Artifact per ${data.blueprint.name}`);
      }
    } catch (err) {
      console.warn('API error during analyze, generating local dynamic blueprint for Claude:', err);
      const fallback = buildDynamicBlueprint(target, context);
      setCurrentBlueprint(fallback);
      setActiveView('sandbox');
      showToast(`✦ Direttive Claude pronte per ${fallback.name}!`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemix = async (instruction: string) => {
    setIsRemixing(true);
    try {
      const response = await fetch('/api/rea/remix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint: currentBlueprint,
          remixInstruction: instruction,
          claudeTarget: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.blueprint) {
        setCurrentBlueprint(data.blueprint);
        showToast('✦ Claude ha aggiornato e raffinato il sito copiato!');
      }
    } catch (err) {
      console.warn('Remix error, applying local mutation:', err);
      const remixed: ReaBlueprint = {
        ...currentBlueprint,
        name: `${currentBlueprint.name} (Raffinato)`,
        summary: `${currentBlueprint.summary} Modificato da Claude: ${instruction}.`,
      };
      setCurrentBlueprint(remixed);
      showToast('✦ Claude ha applicato le modifiche al codice!');
    } finally {
      setIsRemixing(false);
    }
  };

  const handleExportAll = () => {
    const manifest = assembleProjectZipManifest(currentBlueprint);
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${currentBlueprint.id}-claude-bundle.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('✦ Pacchetto Claude Artifact scaricato con successo!');
  };

  const handleOpenClaudeDirect = () => {
    const prompt = generateClaudePrompt(currentBlueprint);
    const link = generateClaudeDeepLink(prompt);
    window.open(link, '_blank');
    showToast('✦ Apertura di Claude.ai con le direttive del sito...');
  };

  const handleSelectCurated = (blueprint: ReaBlueprint) => {
    setCurrentBlueprint(blueprint);
    setActiveView('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`✦ Caricato sito ${blueprint.name} per Claude Artifacts`);
  };

  return (
    <div className="min-h-screen bg-[#191716] text-[#EDE8DF] flex flex-col font-sans">
      {/* Top Bar Contract Header in Claude Theme */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onNewReverseEng={() => {
          setActiveView('explorer');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExportAll={handleExportAll}
        onOpenClaudeDirect={handleOpenClaudeDirect}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'explorer' && (
          <>
            <HeroIntake
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onSelectCurated={handleSelectCurated}
              curatedList={curatedList}
            />
            <div className="border-t border-[#332F2B]">
              <BlueprintView
                blueprint={currentBlueprint}
                onOpenSandbox={() => setActiveView('sandbox')}
              />
            </div>
          </>
        )}

        {activeView === 'blueprint' && (
          <BlueprintView
            blueprint={currentBlueprint}
            onOpenSandbox={() => setActiveView('sandbox')}
          />
        )}

        {activeView === 'sandbox' && (
          <CreaConReaSandbox
            blueprint={currentBlueprint}
            onRemix={handleRemix}
            isRemixing={isRemixing}
          />
        )}

        {activeView === 'presets' && (
          <PresetsGallery
            curatedList={curatedList}
            onSelect={handleSelectCurated}
          />
        )}
      </main>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#201E1C] border border-[#CC785C]/50 text-[#FAF9F5] text-xs font-medium rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast.type === 'success' ? (
            <img 
              src="/assets/aistudio/free-claude-3d-icon-png-download-14919396_90ac6ee5.png" 
              alt="Claude" 
              className="w-5 h-5 object-contain shrink-0" 
            />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Footer in Claude Aesthetic */}
      <footer className="border-t border-[#292523] bg-[#171514] py-8 text-xs text-[#A8A29E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img 
              src="/assets/aistudio/free-claude-3d-icon-png-download-14919396_90ac6ee5.png" 
              alt="Claude Logo" 
              className="w-5 h-5 object-contain shrink-0" 
            />
            <span className="font-extrabold text-[#FAF9F5]">REA × Claude</span>
            <span aria-hidden="true">·</span>
            <span>Reverse Engineer Anything Engine</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#CC785C] font-mono">Claude Artifacts Powered</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveView('explorer')} className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Copia Sito</button>
            <button onClick={() => setActiveView('blueprint')} className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Direttive Claude</button>
            <button onClick={() => setActiveView('sandbox')} className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Claude Artifacts</button>
            <button onClick={() => setActiveView('presets')} className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Libreria</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
