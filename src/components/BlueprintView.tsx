import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Layout, 
  TrendingUp, 
  Copy, 
  Check, 
  ArrowRight, 
  Shield, 
  Clock, 
  Sparkles,
  ExternalLink,
  Terminal,
  Globe
} from 'lucide-react';
import { ReaBlueprint, generateClaudePrompt, generateClaudeDeepLink } from '../utils/reverseEngineerEngine';

interface BlueprintViewProps {
  blueprint: ReaBlueprint;
  onOpenSandbox: () => void;
}

export function BlueprintView({ blueprint, onOpenSandbox }: BlueprintViewProps) {
  const [activeTab, setActiveTab] = useState<'claude_directives' | 'architecture' | 'database_api' | 'components' | 'business'>('claude_directives');
  const [copiedDdl, setCopiedDdl] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const claudePrompt = generateClaudePrompt(blueprint);
  const claudeDeepLink = generateClaudeDeepLink(claudePrompt);

  const handleCopyDdl = () => {
    const ddl = blueprint.database.rawDdl || '-- DDL Schema';
    navigator.clipboard.writeText(ddl);
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(claudePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyEndpoint = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const tabs = [
    { id: 'claude_directives', label: '✦ Direttive Claude', icon: Terminal },
    { id: 'architecture', label: 'Architettura & Stack', icon: Server },
    { id: 'database_api', label: 'Database & API Spec', icon: Database },
    { id: 'components', label: 'Componenti & Design System', icon: Layout },
    { id: 'business', label: 'Business & Growth Loops', icon: TrendingUp },
  ] as const;

  return (
    <section className="py-8 bg-[#191716]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Bar of the Current Target */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#201E1C] border border-[#332F2B] rounded-2xl mb-8 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#CC785C]">
              <span className="uppercase">{blueprint.category.replace('_', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#A8A29E]">{blueprint.targetUrlOrSpec}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF9F5] tracking-tight">
              {blueprint.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#C4BDB0] max-w-3xl leading-relaxed">
              {blueprint.summary}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={claudeDeepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#292523] hover:bg-[#332F2B] border border-[#3D3833] text-xs font-semibold text-[#EDE8DF] rounded-xl transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#CC785C]" />
              <span>Invia a Claude.ai</span>
            </a>

            <button
              onClick={onOpenSandbox}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#CC785C] hover:bg-[#DA7756] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#CC785C]/20 transition-all cursor-pointer"
            >
              <span className="font-serif font-black">✦</span>
              <span>Genera Sito su Claude</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#332F2B] pb-px mb-8 overflow-x-auto scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#CC785C] text-[#CC785C] bg-[#262320] rounded-t-lg font-bold'
                    : 'border-transparent text-[#A8A29E] hover:text-[#FAF9F5] hover:border-[#3D3833]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 0: CLAUDE DIRECTIVES (Master Prompt & Instructions) */}
        {activeTab === 'claude_directives' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#201E1C] border border-[#332F2B] rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#FAF9F5] flex items-center gap-2">
                    <span className="text-[#CC785C] font-serif font-black text-lg">✦</span>
                    Istruzioni Perfette Inviate a Claude
                  </h3>
                  <p className="text-xs text-[#A8A29E]">
                    Queste direttive ingegnerizzate contengono ogni specifica di stile, modello dati e interazione per far generare a Claude il sito clonato perfetto.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={claudeDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CC785C] hover:bg-[#DA7756] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Apri in Claude.ai</span>
                  </a>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262320] hover:bg-[#332F2B] border border-[#3D3833] text-xs font-semibold text-[#EDE8DF] rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#CC785C]" />}
                    <span>{copiedPrompt ? 'Copiato!' : 'Copia Prompt Completo'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#171514] border border-[#2E2A27] rounded-xl font-mono text-xs text-[#EDE8DF] overflow-x-auto max-h-[460px] leading-relaxed">
                <pre>{claudePrompt}</pre>
              </div>
            </div>

            {/* Step-by-step Execution Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                <span className="text-[10px] font-mono text-[#CC785C] block mb-1">01. INTAKE & PARSING</span>
                <h4 className="text-sm font-bold text-[#FAF9F5] mb-1">Decostruzione URL</h4>
                <p className="text-xs text-[#A8A29E]">
                  Estrazione automatica dei token visivi, dei componenti e della struttura gerarchica del sito bersaglio.
                </p>
              </div>

              <div className="p-4 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                <span className="text-[10px] font-mono text-[#CC785C] block mb-1">02. CLAUDE DIRECTIVES</span>
                <h4 className="text-sm font-bold text-[#FAF9F5] mb-1">Prompt Engineering XML</h4>
                <p className="text-xs text-[#A8A29E]">
                  Formattazione rigorosa per Claude 3.5/3.7 Sonnet con sezioni token, logica reattiva e target id.
                </p>
              </div>

              <div className="p-4 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                <span className="text-[10px] font-mono text-[#CC785C] block mb-1">03. ARTIFACT GENERATION</span>
                <h4 className="text-sm font-bold text-[#FAF9F5] mb-1">Sito Copiato Eseguibile</h4>
                <p className="text-xs text-[#A8A29E]">
                  Claude compila il componente React 19 autonomo, interattivo e navigabile direttamente nell'Artifact.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-8">
            {/* Visual Schematic Card */}
            {blueprint.imagePath && (
              <div className="relative rounded-2xl overflow-hidden border border-[#332F2B] bg-[#201E1C] shadow-xl max-h-80">
                <img
                  src={blueprint.imagePath}
                  alt="Architettura Tecnica"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191716] via-[#191716]/40 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[11px] font-mono text-[#CC785C] uppercase tracking-wider block mb-1">
                      Schema Architetturale Estratto per Claude
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {blueprint.name} — Pipeline & Topologia di Sistema
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Architecture Overview */}
            <div className="p-6 bg-[#201E1C] border border-[#332F2B] rounded-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] font-mono mb-3">
                01. Visione d'Insieme & Pattern Architetturali
              </h3>
              <p className="text-sm text-[#EDE8DF] leading-relaxed">
                {blueprint.architecture.overview}
              </p>
            </div>

            {/* Architectural Layers */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] font-mono mb-4">
                02. Stratificazione dei Livelli di Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blueprint.architecture.layers.map((layer, idx) => (
                  <div key={idx} className="p-5 bg-[#201E1C] border border-[#332F2B] rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[#CC785C] font-semibold">{layer.name}</span>
                        <span className="text-[11px] font-mono text-[#78716C]">L{idx + 1}</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-[11px] uppercase tracking-wider text-[#A8A29E] font-mono block mb-1.5">Tecnologie Chiave</span>
                        <div className="flex flex-wrap gap-1.5">
                          {layer.technologies.map((t, ti) => (
                            <span key={ti} className="text-[11px] font-mono px-2 py-0.5 bg-[#171514] text-[#EDE8DF] rounded border border-[#2E2A27]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-[11px] uppercase tracking-wider text-[#A8A29E] font-mono block mb-1">Responsabilità</span>
                        <ul className="space-y-1">
                          {layer.responsibilities.map((r, ri) => (
                            <li key={ri} className="text-xs text-[#C4BDB0] flex items-start gap-1.5">
                              <span className="text-[#CC785C] font-mono">›</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#292523] text-[11px] text-[#A8A29E]">
                      <span className="font-semibold text-amber-400 block mb-0.5">Trade-off architetturale:</span>
                      <span>{layer.tradeOffs}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Strategy & Scalability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#CC785C]" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#EDE8DF] font-mono">
                    Strategia di Sincronizzazione dello Stato
                  </h4>
                </div>
                <p className="text-xs text-[#C4BDB0] leading-relaxed">
                  {blueprint.architecture.stateSyncStrategy}
                </p>
              </div>

              <div className="p-5 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#EDE8DF] font-mono">
                    Colli di Bottiglia & Scalabilità
                  </h4>
                </div>
                <ul className="space-y-1.5">
                  {blueprint.architecture.scalabilityBottlenecks.map((b, bi) => (
                    <li key={bi} className="text-xs text-[#C4BDB0] flex items-start gap-1.5">
                      <span className="text-amber-400 font-mono">!</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATABASE & API SPEC */}
        {activeTab === 'database_api' && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] font-mono">
                    01. Modello Dati Relazionale (PostgreSQL)
                  </h3>
                  <span className="text-xs text-[#78716C]">Tabelle fornite a Claude per la simulazione dello stato</span>
                </div>
                <button
                  onClick={handleCopyDdl}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262320] hover:bg-[#332F2B] text-xs font-medium text-[#EDE8DF] rounded-lg border border-[#332F2B] transition-colors cursor-pointer"
                >
                  {copiedDdl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#CC785C]" />}
                  <span>{copiedDdl ? 'Copiato!' : 'Copia DDL'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {blueprint.database.entities.map((entity, ei) => (
                  <div key={ei} className="bg-[#201E1C] border border-[#332F2B] rounded-xl overflow-hidden">
                    <div className="p-3.5 bg-[#1C1A18] border-b border-[#332F2B] flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#CC785C]">
                        {entity.tableName}
                      </span>
                      <span className="text-[10px] text-[#78716C] font-mono">{entity.fields.length} col</span>
                    </div>
                    <div className="p-3.5 space-y-2">
                      <p className="text-[11px] text-[#A8A29E] italic mb-2">{entity.description}</p>
                      <div className="divide-y divide-[#2E2A27] text-xs">
                        {entity.fields.map((f, fi) => (
                          <div key={fi} className="py-1.5 flex items-center justify-between gap-2 font-mono text-[11px]">
                            <div className="flex items-center gap-1.5 truncate">
                              {f.isPrimaryKey && <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded">PK</span>}
                              {f.references && <span className="text-[9px] px-1 bg-[#CC785C]/20 text-[#CC785C] rounded">FK</span>}
                              <span className="text-[#FAF9F5] truncate">{f.name}</span>
                            </div>
                            <span className="text-[#A8A29E] shrink-0">{f.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Raw DDL Box */}
              <div className="bg-[#171514] border border-[#332F2B] rounded-xl p-4 font-mono text-xs text-[#EDE8DF] overflow-x-auto max-h-64">
                <pre>{blueprint.database.rawDdl}</pre>
              </div>
            </div>

            {/* API Endpoints */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] font-mono">
                  02. Contratti API & Endpoints
                </h3>
                <span className="text-xs text-[#78716C]">Specifiche REST/GraphQL estratte dal sito</span>
              </div>

              <div className="bg-[#201E1C] border border-[#332F2B] rounded-xl overflow-hidden mb-4">
                <div className="divide-y divide-[#2E2A27]">
                  {blueprint.api.endpoints.map((ep, epi) => (
                    <div key={epi} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#262320]/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            ep.method === 'GET' ? 'bg-cyan-500/20 text-cyan-300' :
                            ep.method === 'POST' ? 'bg-[#CC785C]/20 text-[#CC785C]' :
                            ep.method === 'DELETE' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#FAF9F5]">{ep.path}</span>
                        </div>
                        <p className="text-xs text-[#A8A29E]">{ep.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {ep.latencyBudgetMs && (
                          <span className="text-[11px] font-mono text-[#A8A29E] bg-[#171514] px-2 py-1 rounded border border-[#2E2A27]">
                            Budget: <strong className="text-emerald-400 font-normal">{ep.latencyBudgetMs}ms</strong>
                          </span>
                        )}
                        <button
                          onClick={() => handleCopyEndpoint(`${ep.method} ${ep.path}`)}
                          className="p-1.5 text-[#A8A29E] hover:text-[#FAF9F5] transition-colors cursor-pointer"
                          title="Copia path"
                        >
                          {copiedEndpoint === `${ep.method} ${ep.path}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-[#CC785C]" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPONENTS & DESIGN SYSTEM */}
        {activeTab === 'components' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] font-mono mb-4">
                01. Design Tokens & Palette Cromatica
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {blueprint.ui.designTokens.palette.map((color, ci) => (
                  <div key={ci} className="p-3 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                    <div 
                      className="w-full h-12 rounded-lg mb-2.5 border border-white/10" 
                      style={{ backgroundColor: color.hex }} 
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-[#FAF9F5] block">{color.name}</span>
                      <span className="text-[11px] font-mono text-[#CC785C] block">{color.hex}</span>
                      <span className="text-[10px] text-[#A8A29E] block truncate">{color.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A8A29E] font-mono mb-4">
                02. Gerarchia Componenti per Claude Artifact
              </h3>
              <div className="p-5 bg-[#201E1C] border border-[#332F2B] rounded-xl space-y-4">
                {blueprint.ui.componentTree.map((comp, cti) => (
                  <div key={cti} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#CC785C]">{comp.name}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#171514] text-[#A8A29E] rounded">
                        {comp.type}
                      </span>
                      <span className="text-xs text-[#C4BDB0]">· {comp.description}</span>
                    </div>

                    {comp.children && comp.children.length > 0 && (
                      <div className="pl-6 border-l-2 border-[#332F2B] space-y-3 ml-2">
                        {comp.children.map((child, chi) => (
                          <div key={chi} className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-mono text-[#FAF9F5]">{child.name}</span>
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-[#262320] text-[#A8A29E] rounded">
                                {child.type}
                              </span>
                              <span className="text-[#78716C]">· {child.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BUSINESS */}
        {activeTab === 'business' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                <span className="text-[11px] font-mono text-[#CC785C] uppercase tracking-wider block mb-2">
                  Modello di Monetizzazione del Sito
                </span>
                <p className="text-xs sm:text-sm text-[#EDE8DF] leading-relaxed">
                  {blueprint.business.monetization}
                </p>
              </div>

              <div className="p-5 bg-[#201E1C] border border-[#332F2B] rounded-xl">
                <span className="text-[11px] font-mono text-[#CC785C] uppercase tracking-wider block mb-2">
                  Fossato Difendibile (Moat)
                </span>
                <p className="text-xs sm:text-sm text-[#EDE8DF] leading-relaxed">
                  {blueprint.business.moat}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
