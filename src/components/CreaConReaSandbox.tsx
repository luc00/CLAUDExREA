import React, { useState } from 'react';
import { 
  Play, 
  Code, 
  Database, 
  Server, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Terminal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders,
  Globe,
  Send
} from 'lucide-react';
import { 
  ReaBlueprint, 
  assembleProjectZipManifest,
  generateClaudePrompt,
  generateClaudeDeepLink
} from '../utils/reverseEngineerEngine';

interface CreaConReaSandboxProps {
  blueprint: ReaBlueprint;
  onRemix: (instruction: string) => Promise<void>;
  isRemixing: boolean;
}

export function CreaConReaSandbox({ blueprint, onRemix, isRemixing }: CreaConReaSandboxProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'claude_prompt' | 'code' | 'backend' | 'database'>('preview');
  const [copiedText, setCopiedText] = useState<'prompt' | 'code' | 'manifest' | null>(null);
  const [refinementInput, setRefinementInput] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [cloningFidelity, setCloningFidelity] = useState<'pixel_perfect' | 'modernized' | 'fullstack'>('pixel_perfect');

  // Interactive state for Linear clone
  const [linearIssues, setLinearIssues] = useState([
    { id: '1', identifier: 'ENG-101', title: 'Implement WebSocket delta sync', status: 'in_progress', priority: 'High' },
    { id: '2', identifier: 'ENG-102', title: 'Fractional indexing for drag & drop', status: 'done', priority: 'Urgent' },
    { id: '3', identifier: 'ENG-103', title: 'Command K fast launcher overlay', status: 'todo', priority: 'Medium' },
    { id: '4', identifier: 'ENG-104', title: 'Local SQLite offline mirror', status: 'backlog', priority: 'Low' },
  ]);
  const [newLinearTitle, setNewLinearTitle] = useState('');

  // Interactive state for Stripe clone
  const [stripeStep, setStripeStep] = useState<'form' | 'processing' | 'success'>('form');
  const [stripeCard, setStripeCard] = useState('4242 4242 4242 4242');

  // Interactive state for Dyson clone
  const [dysonSpeed, setDysonSpeed] = useState(6);
  const [dysonOscillating, setDysonOscillating] = useState(true);

  // Interactive state for Duolingo clone
  const [duoStreak, setDuoStreak] = useState(48);
  const [duoGems, setDuoGems] = useState(380);
  const [duoFreezes, setDuoFreezes] = useState(1);
  const [duoDoneToday, setDuoDoneToday] = useState(false);

  // Interactive state for Generic clone
  const [genericItems, setGenericItems] = useState([
    { id: '1', name: 'Modulo Autenticazione Client', status: 'Attivo', latency: '12ms' },
    { id: '2', name: 'Canale WebSocket Realtime', status: 'Nominale', latency: '4ms' },
    { id: '3', name: 'Store Reattivo Stato', status: 'Sincronizzato', latency: '1ms' },
  ]);
  const [genericInput, setGenericInput] = useState('');

  const claudePrompt = generateClaudePrompt(blueprint, { fidelity: cloningFidelity });
  const claudeDeepLink = generateClaudeDeepLink(claudePrompt);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(claudePrompt);
    setCopiedText('prompt');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText('code');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDownloadManifest = () => {
    const manifest = assembleProjectZipManifest(blueprint);
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifest, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${blueprint.id}-claude-artifact.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinementInput.trim() || isRemixing) return;
    await onRemix(refinementInput.trim());
    setRefinementInput('');
  };

  const presetType = blueprint.rebuildDeliverables.sandboxPresetType || 'generic';

  return (
    <section className="py-8 bg-[#191716] min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Claude Assistant Message Header */}
        <div className="p-5 bg-[#201E1C] border border-[#332F2B] rounded-2xl mb-6 shadow-xl">
          <div className="flex items-start gap-3.5">
            <img 
              src="/assets/aistudio/free-claude-3d-icon-png-download-14919396_90ac6ee5.png" 
              alt="Claude" 
              className="w-10 h-10 object-contain drop-shadow-md shrink-0 select-none" 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#FAF9F5]">Claude 3.7 Sonnet</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2E2A27] text-[#CC785C] border border-[#3D3833]">
                    Artifact Generator
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={claudeDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CC785C] hover:bg-[#DA7756] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Esegui su Claude.ai</span>
                  </a>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262320] hover:bg-[#332F2B] border border-[#3D3833] text-xs font-semibold text-[#EDE8DF] rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedText === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#CC785C]" />}
                    <span>{copiedText === 'prompt' ? 'Copiato!' : 'Copia Prompt Claude'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#C4BDB0] leading-relaxed mb-3">
                Ho decostruito l'URL <strong className="text-[#FAF9F5] font-mono">{blueprint.targetUrlOrSpec}</strong> e generato il sito copiato. 
                Tutte le direttive architetturali, i componenti visivi e la reattività sono stati sintetizzati nell'<strong>Artifact Interattivo</strong> sottostante.
              </p>

              {/* Collapsible Thinking Process */}
              <button
                onClick={() => setShowThinking(!showThinking)}
                className="flex items-center gap-1.5 text-xs text-[#A8A29E] hover:text-[#CC785C] font-mono transition-colors cursor-pointer"
              >
                <span>{showThinking ? '▼ Nascondi' : '▶ Mostra'} Processo di Ragionamento di Claude (Thinking)</span>
              </button>

              {showThinking && (
                <div className="mt-3 p-3.5 bg-[#171514] border border-[#2E2A27] rounded-xl font-mono text-xs text-[#A8A29E] space-y-2">
                  <p className="text-[#CC785C]">
                    [Thinking Process]: Analisi del target {blueprint.targetUrlOrSpec}...
                  </p>
                  <p>1. Estratto palette cromatica: {blueprint.ui.designTokens.palette.map(p => p.name).join(', ')}.</p>
                  <p>2. Mappato l'albero dei componenti ({blueprint.ui.componentTree.length} nodi principali) e identificati gli stati reattivi.</p>
                  <p>3. Compilato schema relazionale per mock dati ed endpoint REST ({blueprint.api.endpoints.length} contratti).</p>
                  <p>4. Sintetizzato codice standalone React 19 + Tailwind con id artifact "cloned-{blueprint.id}".</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CLAUDE ARTIFACT WINDOW */}
        <div className="bg-[#201E1C] border border-[#332F2B] rounded-2xl overflow-hidden shadow-2xl">
          {/* Artifact Window Top Bar */}
          <div className="px-4 py-3 bg-[#1A1817] border-b border-[#332F2B] flex flex-wrap items-center justify-between gap-3">
            {/* Artifact identity badge */}
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CC785C] animate-pulse" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#FAF9F5]">
                  Artifact: cloned-{blueprint.id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#262320] text-[#A8A29E] border border-[#332F2B]">
                  React 19 + Tailwind
                </span>
              </div>
            </div>

            {/* Artifact Workspace Tabs */}
            <div className="flex items-center gap-1 bg-[#262320] p-1 rounded-lg border border-[#332F2B]">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-[#38332F] text-[#FAF9F5] shadow-sm font-semibold'
                    : 'text-[#A8A29E] hover:text-[#FAF9F5]'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-[#CC785C]" />
                <span>Anteprima Sito Copiato</span>
              </button>

              <button
                onClick={() => setActiveTab('claude_prompt')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'claude_prompt'
                    ? 'bg-[#38332F] text-[#FAF9F5] shadow-sm font-semibold'
                    : 'text-[#A8A29E] hover:text-[#FAF9F5]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-[#CC785C]" />
                <span>Istruzioni Perfette per Claude</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-[#38332F] text-[#FAF9F5] shadow-sm font-semibold'
                    : 'text-[#A8A29E] hover:text-[#FAF9F5]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Codice Componente</span>
              </button>

              <button
                onClick={() => setActiveTab('backend')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'backend'
                    ? 'bg-[#38332F] text-[#FAF9F5] shadow-sm font-semibold'
                    : 'text-[#A8A29E] hover:text-[#FAF9F5]'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Backend Express</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'database'
                    ? 'bg-[#38332F] text-[#FAF9F5] shadow-sm font-semibold'
                    : 'text-[#A8A29E] hover:text-[#FAF9F5]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Schema PostgreSQL</span>
              </button>
            </div>

            {/* Quick download button */}
            <button
              onClick={handleDownloadManifest}
              title="Scarica il pacchetto del sito copiato"
              className="p-1.5 text-[#A8A29E] hover:text-[#FAF9F5] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* TAB 1: LIVE INTERACTIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="p-6 bg-[#171514] min-h-[480px]">
              {/* Target subtitle */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#292523] text-xs font-mono">
                <span className="text-[#CC785C] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Sito Copiato Eseguibile: {blueprint.name}
                </span>
                <span className="text-[#78716C]">{blueprint.targetUrlOrSpec}</span>
              </div>

              {/* RENDER ACTIVE RECREATED APP */}

              {/* Linear Recreated Clone */}
              {presetType === 'linear' && (
                <div className="space-y-4">
                  <form 
                    onSubmit={e => {
                      e.preventDefault();
                      if (!newLinearTitle.trim()) return;
                      setLinearIssues([
                        {
                          id: Date.now().toString(),
                          identifier: `ENG-${100 + linearIssues.length + 1}`,
                          title: newLinearTitle.trim(),
                          status: 'todo',
                          priority: 'Medium'
                        },
                        ...linearIssues
                      ]);
                      setNewLinearTitle('');
                    }}
                    className="flex gap-2"
                  >
                    <input 
                      type="text" 
                      value={newLinearTitle}
                      onChange={e => setNewLinearTitle(e.target.value)}
                      placeholder="Crea nuovo task nella replica di Linear... (Premi Invio)"
                      className="flex-1 bg-[#201E1C] border border-[#3D3833] px-3.5 py-2 text-xs rounded-xl text-[#FAF9F5] placeholder-[#78716C] focus:outline-none focus:border-[#CC785C]"
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-[#CC785C] hover:bg-[#DA7756] text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Aggiungi Task
                    </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {(['backlog', 'todo', 'in_progress', 'done'] as const).map(col => (
                      <div key={col} className="bg-[#1C1A18] p-3 rounded-xl border border-[#2E2A27]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-bold text-[#A8A29E] uppercase tracking-wider">
                            {col.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-mono text-[#CC785C] bg-[#292523] px-1.5 py-0.5 rounded">
                            {linearIssues.filter(i => i.status === col).length}
                          </span>
                        </div>

                        <div className="space-y-2 min-h-[140px]">
                          {linearIssues.filter(i => i.status === col).map(item => (
                            <div key={item.id} className="p-3 bg-[#23211F] hover:bg-[#282624] rounded-lg border border-[#332F2B] text-xs transition-colors">
                              <div className="flex items-center justify-between font-mono text-[11px] mb-1.5">
                                <span className="text-[#CC785C] font-bold">{item.identifier}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  item.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300' :
                                  item.priority === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-[#2E2A27] text-[#A8A29E]'
                                }`}>
                                  {item.priority}
                                </span>
                              </div>
                              <p className="text-[#FAF9F5] font-medium mb-2">{item.title}</p>
                              <div className="flex justify-end gap-1">
                                {col !== 'done' && (
                                  <button
                                    onClick={() => {
                                      const nextStatus = col === 'backlog' ? 'todo' : col === 'todo' ? 'in_progress' : 'done';
                                      setLinearIssues(linearIssues.map(i => i.id === item.id ? { ...i, status: nextStatus } : i));
                                    }}
                                    className="text-[10px] text-[#CC785C] hover:text-[#E08B70] font-medium cursor-pointer"
                                  >
                                    Avanza &rarr;
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stripe Recreated Clone */}
              {presetType === 'stripe' && (
                <div className="max-w-md mx-auto p-6 bg-[#201E1C] border border-[#332F2B] rounded-2xl shadow-xl">
                  {stripeStep === 'form' && (
                    <form 
                      onSubmit={e => {
                        e.preventDefault();
                        setStripeStep('processing');
                        setTimeout(() => setStripeStep('success'), 1400);
                      }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-[#332F2B]">
                        <div>
                          <span className="text-xs text-[#CC785C] font-mono">CLONED STRIPE CHECKOUT</span>
                          <h4 className="text-sm font-bold text-[#FAF9F5]">Abbonamento Software Pro</h4>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold text-sm">€ 149,00</span>
                      </div>

                      <div>
                        <label className="block text-xs text-[#C4BDB0] mb-1">Numero Carta (Circuito Test)</label>
                        <input
                          type="text"
                          value={stripeCard}
                          onChange={e => setStripeCard(e.target.value)}
                          className="w-full bg-[#171514] border border-[#3D3833] rounded-lg px-3 py-2 text-xs font-mono text-[#FAF9F5] focus:outline-none focus:border-[#CC785C]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-[#C4BDB0] mb-1">Scadenza</label>
                          <input
                            type="text"
                            defaultValue="11/29"
                            className="w-full bg-[#171514] border border-[#3D3833] rounded-lg px-3 py-2 text-xs font-mono text-[#FAF9F5]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#C4BDB0] mb-1">CVC</label>
                          <input
                            type="text"
                            defaultValue="912"
                            className="w-full bg-[#171514] border border-[#3D3833] rounded-lg px-3 py-2 text-xs font-mono text-[#FAF9F5]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#CC785C] hover:bg-[#DA7756] text-xs font-bold text-white rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        Paga € 149,00 con Idempotency Key
                      </button>
                    </form>
                  )}

                  {stripeStep === 'processing' && (
                    <div className="py-10 text-center space-y-3">
                      <div className="w-8 h-8 border-2 border-[#CC785C] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-[#C4BDB0] font-mono">Elaborazione token PCI & Lock Idempotenza...</p>
                    </div>
                  )}

                  {stripeStep === 'success' && (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                        ✓
                      </div>
                      <h4 className="text-sm font-bold text-[#FAF9F5]">Pagamento Confermato</h4>
                      <p className="text-xs text-[#A8A29E] font-mono">PaymentIntent: pi_3O19B7281 (Mock OK)</p>
                      <button
                        onClick={() => setStripeStep('form')}
                        className="px-4 py-1.5 bg-[#262320] hover:bg-[#332F2B] text-xs text-[#FAF9F5] rounded-lg border border-[#3D3833] transition-colors cursor-pointer"
                      >
                        Nuova Transazione
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Dyson Recreated Clone */}
              {presetType === 'dyson' && (
                <div className="max-w-md mx-auto p-5 bg-[#201E1C] border border-[#332F2B] rounded-2xl">
                  <div className="relative h-40 bg-[#171514] rounded-xl flex items-center justify-center overflow-hidden mb-4 border border-[#332F2B]">
                    <div className="relative w-28 h-32 border-4 border-[#3D3833] rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-20 h-24 border border-dashed border-[#CC785C]/50 rounded-full" />
                      <div className="absolute text-center font-mono">
                        <span className="text-[10px] text-[#A8A29E] block">FLOW</span>
                        <span className="text-xs font-bold text-[#CC785C]">{(dysonSpeed * 41).toFixed(0)} L/s</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-[#C4BDB0]">Flusso Moltiplicatore (1-10)</span>
                        <span className="text-[#CC785C] font-bold">{dysonSpeed} / 10 · {1100 + dysonSpeed * 240} RPM</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={dysonSpeed}
                        onChange={e => setDysonSpeed(Number(e.target.value))}
                        className="w-full accent-[#CC785C] cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#171514] rounded-xl border border-[#332F2B]">
                        <span className="text-[10px] font-mono text-[#A8A29E] block mb-1">SENSORE PM2.5</span>
                        <span className="text-lg font-bold font-mono text-emerald-400">11 µg/m³</span>
                        <span className="text-[10px] text-[#78716C] block">Aria Pulita (HEPA)</span>
                      </div>
                      <div className="p-3 bg-[#171514] rounded-xl border border-[#332F2B] flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-[#A8A29E] block mb-1">OSCILLAZIONE</span>
                        <button
                          onClick={() => setDysonOscillating(!dysonOscillating)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                            dysonOscillating ? 'bg-[#CC785C] text-white' : 'bg-[#262320] text-[#A8A29E]'
                          }`}
                        >
                          {dysonOscillating ? 'Attiva (70°)' : 'Ferma'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Duolingo Recreated Clone */}
              {presetType === 'duolingo' && (
                <div className="max-w-md mx-auto p-5 bg-[#201E1C] border border-[#332F2B] rounded-2xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#332F2B] font-mono">
                    <span className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                      🔥 {duoStreak} gg
                    </span>
                    <span className="flex items-center gap-1 text-[#CC785C] font-bold text-sm">
                      💎 {duoGems}
                    </span>
                    <span className="flex items-center gap-1 text-blue-400 font-bold text-sm">
                      ❄️ {duoFreezes}/2 Gelo
                    </span>
                  </div>

                  <div className="p-4 bg-[#171514] rounded-xl border border-[#332F2B] text-center mb-4">
                    <div className="text-3xl mb-2">{duoDoneToday ? '🎉' : '🦉'}</div>
                    <h4 className="text-sm font-bold text-[#FAF9F5] mb-1">
                      {duoDoneToday ? 'Serie protetta per oggi!' : 'Non rompere la serie di 48 giorni!'}
                    </h4>
                    <p className="text-xs text-[#A8A29E] mb-3">
                      {duoDoneToday ? 'Hai completato la pratica quotidiana.' : 'Completa una lezione veloce per mantenere accesa la fiamma.'}
                    </p>
                    <button
                      onClick={() => {
                        if (!duoDoneToday) {
                          setDuoStreak(s => s + 1);
                          setDuoGems(g => g + 25);
                          setDuoDoneToday(true);
                        }
                      }}
                      disabled={duoDoneToday}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                        duoDoneToday ? 'bg-[#262320] text-[#78716C] cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/20'
                      }`}
                    >
                      {duoDoneToday ? 'Lezione Completata (Serie Al Sicuro)' : 'Pratica Ora (+1 Giorno)'}
                    </button>
                  </div>

                  <div className="p-3 bg-[#171514] rounded-xl border border-[#332F2B] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#FAF9F5] block">Equipaggia Gelo (Streak Freeze)</span>
                      <span className="text-[11px] text-[#A8A29E]">Protegge se salti domani (100 gemme)</span>
                    </div>
                    <button
                      onClick={() => {
                        if (duoGems >= 100 && duoFreezes < 2) {
                          setDuoGems(g => g - 100);
                          setDuoFreezes(f => f + 1);
                        }
                      }}
                      disabled={duoGems < 100 || duoFreezes >= 2}
                      className="px-3 py-1.5 bg-[#CC785C] hover:bg-[#DA7756] disabled:opacity-40 text-xs font-semibold rounded-lg text-white cursor-pointer"
                    >
                      Acquista
                    </button>
                  </div>
                </div>
              )}

              {/* Generic Clone / Arbitrary URL Copy */}
              {(presetType === 'generic' || !['linear', 'stripe', 'dyson', 'duolingo'].includes(presetType)) && (
                <div className="space-y-4">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (!genericInput.trim()) return;
                      setGenericItems([
                        ...genericItems,
                        {
                          id: Date.now().toString(),
                          name: genericInput.trim(),
                          status: 'Attivo',
                          latency: `${Math.floor(Math.random() * 25 + 5)}ms`
                        }
                      ]);
                      setGenericInput('');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={genericInput}
                      onChange={e => setGenericInput(e.target.value)}
                      placeholder="Aggiungi elemento interattivo nel sito clonato..."
                      className="flex-1 bg-[#201E1C] border border-[#3D3833] px-3.5 py-2 text-xs rounded-xl text-[#FAF9F5] placeholder-[#78716C] focus:outline-none focus:border-[#CC785C]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#CC785C] hover:bg-[#DA7756] text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Inserisci Record
                    </button>
                  </form>

                  <div className="space-y-2">
                    {genericItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-[#201E1C] rounded-xl border border-[#332F2B] text-xs">
                        <span className="font-medium text-[#FAF9F5]">{item.name}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-[#A8A29E] text-[11px]">{item.latency}</span>
                          <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ISTRUZIONI PERFETTE PER CLAUDE */}
          {activeTab === 'claude_prompt' && (
            <div className="p-6 bg-[#171514] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#FAF9F5]">Master Prompt Formattato per Claude</h4>
                  <p className="text-xs text-[#A8A29E]">
                    Incolla questo prompt in Claude.ai o usa il pulsante per aprirlo direttamente.
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
                    <span>Invia a Claude.ai</span>
                  </a>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262320] hover:bg-[#332F2B] border border-[#3D3833] text-xs font-semibold text-[#EDE8DF] rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedText === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#CC785C]" />}
                    <span>{copiedText === 'prompt' ? 'Copiato!' : 'Copia Prompt'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#1F1D1B] border border-[#332F2B] rounded-xl font-mono text-xs text-[#EDE8DF] overflow-x-auto max-h-[500px] leading-relaxed">
                <pre>{claudePrompt}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: CODICE COMPONENTE */}
          {activeTab === 'code' && (
            <div className="p-6 bg-[#171514] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#A8A29E]">React 19 + TypeScript Component (Cloned Artifact)</span>
                <button
                  onClick={() => handleCopyCode(blueprint.rebuildDeliverables.frontendCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262320] hover:bg-[#332F2B] border border-[#3D3833] text-xs font-semibold text-[#EDE8DF] rounded-lg transition-colors cursor-pointer"
                >
                  {copiedText === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#CC785C]" />}
                  <span>{copiedText === 'code' ? 'Copiato!' : 'Copia Codice'}</span>
                </button>
              </div>

              <div className="p-4 bg-[#1F1D1B] border border-[#332F2B] rounded-xl font-mono text-xs text-[#EDE8DF] overflow-x-auto max-h-[500px]">
                <pre>{blueprint.rebuildDeliverables.frontendCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: BACKEND EXPRESS */}
          {activeTab === 'backend' && (
            <div className="p-6 bg-[#171514] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#A8A29E]">Express Route Server Stub</span>
                <button
                  onClick={() => handleCopyCode(blueprint.rebuildDeliverables.backendCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262320] hover:bg-[#332F2B] border border-[#3D3833] text-xs font-semibold text-[#EDE8DF] rounded-lg transition-colors cursor-pointer"
                >
                  {copiedText === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#CC785C]" />}
                  <span>{copiedText === 'code' ? 'Copiato!' : 'Copia Route'}</span>
                </button>
              </div>

              <div className="p-4 bg-[#1F1D1B] border border-[#332F2B] rounded-xl font-mono text-xs text-[#EDE8DF] overflow-x-auto max-h-[500px]">
                <pre>{blueprint.rebuildDeliverables.backendCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: DATABASE DDL */}
          {activeTab === 'database' && (
            <div className="p-6 bg-[#171514] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#A8A29E]">PostgreSQL DDL Schema</span>
                <button
                  onClick={() => handleCopyCode(blueprint.database.rawDdl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#262320] hover:bg-[#332F2B] border border-[#3D3833] text-xs font-semibold text-[#EDE8DF] rounded-lg transition-colors cursor-pointer"
                >
                  {copiedText === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#CC785C]" />}
                  <span>{copiedText === 'code' ? 'Copiato!' : 'Copia DDL'}</span>
                </button>
              </div>

              <div className="p-4 bg-[#1F1D1B] border border-[#332F2B] rounded-xl font-mono text-xs text-[#EDE8DF] overflow-x-auto max-h-[500px]">
                <pre>{blueprint.database.rawDdl}</pre>
              </div>
            </div>
          )}
        </div>

        {/* CLAUDE REFINEMENT PROMPT CONSOLE */}
        <div className="mt-6 p-5 bg-[#201E1C] border border-[#332F2B] rounded-2xl shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#CC785C] font-serif font-black">✦</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF9F5]">
              Chiedi a Claude di Modificare o Raffinare il Sito Copiato
            </h4>
          </div>
          <p className="text-xs text-[#A8A29E] mb-3">
            Invia istruzioni ulteriori per Claude (es. "Aggiungi autenticazione con Google", "Crea la pagina carrello", "Rendilo ottimizzato per smartphone PWA").
          </p>

          <form onSubmit={handleRefineSubmit} className="flex gap-2">
            <input
              type="text"
              value={refinementInput}
              onChange={e => setRefinementInput(e.target.value)}
              placeholder="Istruzioni di modifica per Claude (es. 'Aggiungi modalità scura con toggle', 'Inserisci pulsante per esportare in CSV')..."
              className="flex-1 bg-[#171514] border border-[#3D3833] px-3.5 py-2.5 text-xs rounded-xl text-[#FAF9F5] placeholder-[#78716C] focus:outline-none focus:border-[#CC785C]"
            />
            <button
              type="submit"
              disabled={isRemixing || !refinementInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#CC785C] hover:bg-[#DA7756] disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              {isRemixing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Claude sta raffinando...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Invia a Claude</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
