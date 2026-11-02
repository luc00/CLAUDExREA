/**
 * REA — REVERSE ENGINEER ANYTHING Engine
 * Pure logic module for dissecting systems, compiling schemas, and assembling recreation packages.
 */

export type TargetCategory = 'web_app' | 'hardware_iot' | 'algorithm_ai' | 'business_growth' | 'api_protocol';

export interface EntityField {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isNullable?: boolean;
  references?: string;
  description: string;
}

export interface EntityModel {
  tableName: string;
  description: string;
  fields: EntityField[];
}

export interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requestPayload?: string;
  responsePayload: string;
  latencyBudgetMs?: number;
}

export interface ComponentNode {
  name: string;
  type: 'page' | 'organism' | 'molecule' | 'atom';
  description: string;
  stateVariables?: string[];
  props?: string[];
  children?: ComponentNode[];
}

export interface ArchitectureLayer {
  name: string;
  technologies: string[];
  responsibilities: string[];
  tradeOffs: string;
}

export interface GrowthLoop {
  step: string;
  trigger: string;
  action: string;
  reward: string;
  metric: string;
}

export interface ReaBlueprint {
  id: string;
  name: string;
  tagline: string;
  category: TargetCategory;
  targetUrlOrSpec: string;
  summary: string;
  imagePath?: string;
  architecture: {
    overview: string;
    layers: ArchitectureLayer[];
    stateSyncStrategy: string;
    scalabilityBottlenecks: string[];
  };
  database: {
    dialect: 'postgresql';
    entities: EntityModel[];
    rawDdl: string;
  };
  api: {
    endpoints: EndpointSpec[];
    authStrategy: string;
    rateLimiting: string;
  };
  ui: {
    designTokens: {
      palette: { name: string; hex: string; role: string }[];
      typography: { heading: string; body: string; code: string };
      radii: string;
      elevation: string;
    };
    componentTree: ComponentNode[];
    keyInteractions: string[];
  };
  business: {
    monetization: string;
    conversionFunnel: string[];
    growthLoops: GrowthLoop[];
    moat: string;
  };
  rebuildDeliverables: {
    frontendCode: string;
    backendCode: string;
    sqlDdl: string;
    systemPrompt: string;
    sandboxPresetType: 'linear' | 'stripe' | 'dyson' | 'duolingo' | 'notion' | 'iot' | 'generic';
  };
}

/**
 * Pure function: Detect category from input string or URL
 */
export function detectTargetCategory(input: string): TargetCategory {
  const lower = input.toLowerCase();
  if (lower.includes('iot') || lower.includes('hardware') || lower.includes('sensor') || 
      lower.includes('esp32') || lower.includes('motor') || lower.includes('fan') || 
      lower.includes('circuit') || lower.includes('schematic') || lower.includes('dyson')) {
    return 'hardware_iot';
  }
  if (lower.includes('algorithm') || lower.includes('ai') || lower.includes('llm') || 
      lower.includes('neural') || lower.includes('prompt') || lower.includes('agent') || 
      lower.includes('recommendation') || lower.includes('gpt')) {
    return 'algorithm_ai';
  }
  if (lower.includes('growth') || lower.includes('monetization') || lower.includes('pricing') || 
      lower.includes('retention') || lower.includes('viral') || lower.includes('funnel') || 
      lower.includes('duolingo') || lower.includes('streak')) {
    return 'business_growth';
  }
  if (lower.includes('protocol') || lower.includes('api') || lower.includes('webhook') || 
      lower.includes('graphql') || lower.includes('rest') || lower.includes('oauth') || 
      lower.includes('stripe') || lower.includes('payment')) {
    return 'api_protocol';
  }
  return 'web_app';
}

/**
 * Pure function: Compile entity models into clean PostgreSQL DDL
 */
export function generateSqlDdl(entities: EntityModel[]): string {
  if (!entities || entities.length === 0) return '-- No entities specified\n';

  const ddlParts: string[] = [
    '-- =============================================',
    '-- REA Generated PostgreSQL DDL Schema',
    '-- Generated for high-throughput production deployment',
    '-- =============================================\n',
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n'
  ];

  for (const entity of entities) {
    ddlParts.push(`-- Table: ${entity.tableName}`);
    ddlParts.push(`-- ${entity.description}`);
    ddlParts.push(`CREATE TABLE IF NOT EXISTS "${entity.tableName}" (`);

    const fieldLines = entity.fields.map((f, idx) => {
      let line = `  "${f.name}" ${f.type}`;
      if (f.isPrimaryKey) line += ' PRIMARY KEY';
      if (!f.isPrimaryKey && !f.isNullable) line += ' NOT NULL';
      if (f.references) line += ` REFERENCES ${f.references}`;
      if (idx === entity.fields.length - 1) {
        return line;
      }
      return `${line},`;
    });

    ddlParts.push(fieldLines.join('\n'));
    ddlParts.push(');\n');

    // Add index for foreign keys
    entity.fields.forEach(f => {
      if (f.references) {
        ddlParts.push(`CREATE INDEX IF NOT EXISTS "idx_${entity.tableName}_${f.name}" ON "${entity.tableName}" ("${f.name}");`);
      }
    });
    ddlParts.push('');
  }

  return ddlParts.join('\n');
}

/**
 * Pure function: Flatten component tree to extract stats & component map
 */
export function flattenComponentTree(root: ComponentNode): { name: string; type: string; stateCount: number }[] {
  const result: { name: string; type: string; stateCount: number }[] = [];

  function traverse(node: ComponentNode) {
    result.push({
      name: node.name,
      type: node.type,
      stateCount: (node.stateVariables || []).length,
    });
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(root);
  return result;
}

/**
 * Pure function: Assemble code bundle manifest for project download
 */
export function assembleProjectZipManifest(blueprint: ReaBlueprint): { [filename: string]: string } {
  return {
    'README.md': `# ${blueprint.name} - Reverse Engineered with REA\n\n> ${blueprint.tagline}\n\n## Overview\n${blueprint.summary}\n\n## Architecture\n${blueprint.architecture.overview}\n\n### Scalability Considerations\n${blueprint.architecture.scalabilityBottlenecks.map(b => `- ${b}`).join('\n')}\n\n## Database Schema\nSee \`schema.sql\` for production PostgreSQL DDL.\n\n## API Endpoints\n${blueprint.api.endpoints.map(e => `- \`${e.method} ${e.path}\`: ${e.description}`).join('\n')}\n`,
    'schema.sql': blueprint.database.rawDdl || generateSqlDdl(blueprint.database.entities),
    'src/App.tsx': blueprint.rebuildDeliverables.frontendCode,
    'server/routes.ts': blueprint.rebuildDeliverables.backendCode,
    'rea-spec.json': JSON.stringify(blueprint, null, 2)
  };
}

export interface ClaudePromptOptions {
  fidelity?: 'pixel_perfect' | 'modernized' | 'fullstack';
  language?: 'typescript' | 'javascript';
  targetUrl?: string;
}

/**
 * Pure function: Generate precise Claude master prompt with reverse-engineered directives
 */
export function generateClaudePrompt(blueprint: ReaBlueprint, options: ClaudePromptOptions = {}): string {
  const fidelity = options.fidelity || 'pixel_perfect';
  const url = options.targetUrl || blueprint.targetUrlOrSpec;

  const paletteDescription = (blueprint.ui.designTokens.palette || [])
    .map(p => `${p.name}: ${p.hex} (${p.role})`)
    .join('\n    - ');

  const componentList = (blueprint.ui.componentTree || [])
    .map(c => `${c.name} [${c.type}]: ${c.description}`)
    .join('\n    - ');

  const interactions = (blueprint.ui.keyInteractions || [])
    .map(i => `${i}`)
    .join('\n    - ');

  const entities = (blueprint.database.entities || [])
    .map(e => `${e.tableName}: fields [${e.fields.map(f => f.name).join(', ')}]`)
    .join('\n    - ');

  return `You are Claude, operating in expert UI Engineering and System Replication mode.
I want you to clone and recreate the website: "${blueprint.name}" (${url}).
Follow these precise reverse-engineered architectural directives to generate a complete, working, interactive React artifact.

<clone_context>
Target: ${blueprint.name}
Reference URL: ${url}
Cloning Fidelity Mode: ${fidelity === 'pixel_perfect' ? 'Pixel-Perfect 1:1 Visual & Interaction Replica' : fidelity === 'modernized' ? 'Modernized & Polished Clone with Enhanced Micro-interactions' : 'Fullstack-Ready Replica with Mock Persistence & API Routes'}
Summary: ${blueprint.summary}
</clone_context>

<design_system_tokens>
  - Palette:
    - ${paletteDescription}
  - Typography: Heading "${blueprint.ui.designTokens.typography.heading}", Body "${blueprint.ui.designTokens.typography.body}"
  - Border Radii: ${blueprint.ui.designTokens.radii}
  - Elevation: ${blueprint.ui.designTokens.elevation}
</design_system_tokens>

<component_architecture>
  - Component Hierarchy:
    - ${componentList}
  - Key Interaction Patterns:
    - ${interactions}
</component_architecture>

<data_models_to_mock>
  - Database Entities:
    - ${entities}
</data_models_to_mock>

<instructions_for_claude>
1. Generate a single, production-ready, interactive React 19 component using Tailwind CSS and Lucide icons (lucide-react).
2. The cloned website must be fully interactive: buttons must click, form inputs must update state, toggles must change views, lists must filter or add items.
3. Zero placeholder boxes or "Coming soon" text. Provide rich realistic seed data matching ${blueprint.name}.
4. Implement mobile and desktop responsive layout cleanly.
5. Wrap your final code inside a Claude Artifact with the identifier "cloned-${blueprint.id}".
</instructions_for_claude>

Now generate the complete cloned website code as a standalone Claude Artifact.`;
}

/**
 * Pure function: Generate Claude web launcher deep link
 */
export function generateClaudeDeepLink(prompt: string): string {
  const truncated = prompt.length > 2000 ? prompt.slice(0, 1990) + '...' : prompt;
  return `https://claude.ai/new?q=${encodeURIComponent(truncated)}`;
}

/**
 * Curated Pre-Engineered Library
 */
export const CURATED_BLUEPRINTS: ReaBlueprint[] = [
  {
    id: 'linear-issue-tracker',
    name: 'Linear — Reactive Issue Tracking',
    tagline: 'High-speed sync engine with optimistic updates and local SQLite mirror',
    category: 'web_app',
    targetUrlOrSpec: 'https://linear.app',
    summary: 'Decostruzione del celebre tracker ad alte prestazioni: architettura offline-first, client cache con sincronizzazione delta bidirezionale via WebSocket, optimistic UI e navigazione ultra-rapida da tastiera.',
    imagePath: '/src/assets/images/blueprint_software_arch_1793627413463.jpg',
    architecture: {
      overview: 'Architettura ibrida Client-Authoritative Sync. Il client scrive istantaneamente nel database SQLite locale (Wasm) prima di inviare i messaggi di mutazione. Il server valida le transazioni e propaga i delta via WebSocket a tutti i client concorrenti.',
      layers: [
        {
          name: 'Client Cache Layer',
          technologies: ['SQLite (WASM)', 'Optimistic Mutation Queue', 'Zustand Store'],
          responsibilities: ['Letture a latenza zero', 'Rollback transazionale su errore', 'Gestione conflitti Last-Write-Wins'],
          tradeOffs: 'Elevata complessità nella riconciliazione degli indici locali rispetto a semplici chiamate REST.'
        },
        {
          name: 'WebSocket Sync Fabric',
          technologies: ['Node.js Cluster', 'Redis Pub/Sub', 'Protobuf / MessagePack'],
          responsibilities: ['Fan-out dei delta', 'Broadcast della presenza utenti', 'Heartbeat e riconnessione esponenziale'],
          tradeOffs: 'Consumo persistente di socket rispetto al polling HTTP.'
        },
        {
          name: 'Persistence & Search',
          technologies: ['PostgreSQL 16', 'TimescaleDB', 'Meilisearch'],
          responsibilities: ['Event sourcing immutabile', 'Full-text fuzzy search', 'Partizionamento per Workspace ID'],
          tradeOffs: 'Storage maggiore per lo storico completo delle mutazioni.'
        }
      ],
      stateSyncStrategy: 'Delta Compression via Vector Clocks e CRDT semplificato per liste ordinate (Fractional Indexing).',
      scalabilityBottlenecks: [
        'Memory footprint della cache client per workspace con oltre 500k issue',
        'Burst di fan-out WebSocket durante import massivi o riordinamenti di board',
        'Validazione concorrente di chiavi esterne per team distribuiti in multi-region'
      ]
    },
    database: {
      dialect: 'postgresql',
      entities: [
        {
          tableName: 'workspaces',
          description: 'Spazio di lavoro isolato per team e tenant',
          fields: [
            { name: 'id', type: 'UUID', isPrimaryKey: true, description: 'Chiave primaria univoca' },
            { name: 'slug', type: 'VARCHAR(64)', isNullable: false, description: 'Slug univoco URL' },
            { name: 'name', type: 'VARCHAR(128)', isNullable: false, description: 'Nome del team' },
            { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Timestamp creazione' }
          ]
        },
        {
          tableName: 'issues',
          description: 'Task o issue tracciata con priorità e fractional index',
          fields: [
            { name: 'id', type: 'UUID', isPrimaryKey: true, description: 'ID univoco issue' },
            { name: 'workspace_id', type: 'UUID', references: '"workspaces"("id")', description: 'Riferimento tenant' },
            { name: 'identifier', type: 'VARCHAR(16)', isNullable: false, description: 'Codice breve (es. ENG-104)' },
            { name: 'title', type: 'TEXT', isNullable: false, description: 'Titolo conciso del task' },
            { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'backlog | todo | in_progress | done' },
            { name: 'priority', type: 'SMALLINT', isNullable: false, description: '0: Urgent, 1: High, 2: Medium, 3: Low' },
            { name: 'sort_order', type: 'FLOAT8', isNullable: false, description: 'Fractional index per drag-and-drop O(1)' },
            { name: 'version', type: 'BIGINT', isNullable: false, description: 'Contatore monolitico per delta sync' }
          ]
        },
        {
          tableName: 'issue_deltas',
          description: 'Registro transazionale di mutazioni per la sincronizzazione dei client',
          fields: [
            { name: 'id', type: 'BIGSERIAL', isPrimaryKey: true, description: 'Sequenza ordinata' },
            { name: 'issue_id', type: 'UUID', references: '"issues"("id")', description: 'Issue modificata' },
            { name: 'patch_data', type: 'JSONB', isNullable: false, description: 'JSON patch RFC 6902' },
            { name: 'applied_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Data applicazione' }
          ]
        }
      ],
      rawDdl: ''
    },
    api: {
      endpoints: [
        { method: 'POST', path: '/api/v1/sync/pull', description: 'Scarica tutti i delta avvenuti dal client_version', responsePayload: '{ deltas: IssueDelta[], currentVersion: number }', latencyBudgetMs: 25 },
        { method: 'POST', path: '/api/v1/sync/push', description: 'Invia lotto di mutazioni ottimistiche per validazione', responsePayload: '{ accepted: string[], rejected: { id: string, reason: string }[] }', latencyBudgetMs: 40 },
        { method: 'GET', path: '/api/v1/issues', description: 'Query iniziale snapshot del workspace', responsePayload: '{ issues: Issue[] }', latencyBudgetMs: 50 }
      ],
      authStrategy: 'Ed25519 Signed JWT tokens con sessioni effimere e refresh token in cookie HTTP-only.',
      rateLimiting: 'Token bucket per client IP: 120 req/min su REST, 600 frames/min su WebSocket.'
    },
    ui: {
      designTokens: {
        palette: [
          { name: 'Obsidian Slate', hex: '#0B0F19', role: 'Canvas Background' },
          { name: 'Carbon Neutral', hex: '#161F30', role: 'Surface Card / Column' },
          { name: 'Linear Purple', hex: '#5E6AD2', role: 'Brand & Active Selection' },
          { name: 'Urgent Amber', hex: '#F59E0B', role: 'High Priority Warning' },
          { name: 'Success Emerald', hex: '#10B981', role: 'Completed State' }
        ],
        typography: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', code: 'JetBrains Mono' },
        radii: '6px (subtle precision engineering)',
        elevation: 'Hairline 1px border con dark scrim (border-slate-800)'
      },
      componentTree: [
        {
          name: 'WorkspaceShell',
          type: 'page',
          description: 'Struttura principale con sidebar collassabile e area board',
          children: [
            {
              name: 'CommandMenu',
              type: 'organism',
              description: 'Palette comandi rapida attivata da Cmd+K',
              stateVariables: ['isOpen', 'searchQuery', 'selectedIndex']
            },
            {
              name: 'KanbanBoard',
              type: 'organism',
              description: 'Griglia a 4 colonne con Fractional Indexing Drag-Drop',
              children: [
                {
                  name: 'ColumnLane',
                  type: 'molecule',
                  description: 'Colonna di stato (Backlog, Todo, In Progress, Done)',
                  children: [
                    {
                      name: 'IssueCard',
                      type: 'atom',
                      description: 'Card ad alta densità con badge priorità e identifier',
                      props: ['id', 'title', 'priority', 'identifier']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      keyInteractions: [
        'Navigazione J/K per scorrere i task da tastiera',
        'C per creare istantaneamente un nuovo task modale',
        'Drag-and-Drop con aggiornamento istantaneo del fractional index'
      ]
    },
    business: {
      monetization: 'Freemium B2B SaaS con tier Pro ($10/user/mo) ed Enterprise ($14/user/mo) basato su limiti di cronologia e SSO/SAML.',
      conversionFunnel: [
        'Onboarding ultra-rapido (sotto 60 secondi con template pre-configurati)',
        'Invito spontaneo di colleghi per assegnazione ticket',
        'Raggiungimento del limite di 250 issue archiviate -> Blocco storico -> Upgrade Pro'
      ],
      growthLoops: [
        {
          step: 'Task Sharing',
          trigger: 'Menzione @membro o invio link issue esterno',
          action: 'Utente apre preview interattiva ultra-veloce',
          reward: 'Esperienza reattiva percepita 10x superiore a Jira',
          metric: 'Virality Coefficient K=1.35'
        }
      ],
      moat: 'Prestazioni percepite e fidelizzazione da scorciatoie tastiera estreme (muscle memory lock-in).'
    },
    rebuildDeliverables: {
      sandboxPresetType: 'linear',
      frontendCode: `// REA Linear Interactive Rebuild
import React, { useState } from 'react';

interface Issue {
  id: string;
  identifier: string;
  title: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
}

export function LinearClone() {
  const [issues, setIssues] = useState<Issue[]>([
    { id: '1', identifier: 'ENG-101', title: 'Implement WebSocket delta sync', status: 'in_progress', priority: 'High' },
    { id: '2', identifier: 'ENG-102', title: 'Fractional indexing for drag & drop', status: 'done', priority: 'Urgent' },
    { id: '3', identifier: 'ENG-103', title: 'Command K fast launcher overlay', status: 'todo', priority: 'Medium' },
    { id: '4', identifier: 'ENG-104', title: 'Local SQLite offline mirror', status: 'backlog', priority: 'Low' },
  ]);
  const [newTitle, setNewTitle] = useState('');

  const addIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newIssue: Issue = {
      id: Date.now().toString(),
      identifier: 'ENG-' + (100 + issues.length + 1),
      title: newTitle.trim(),
      status: 'todo',
      priority: 'Medium'
    };
    setIssues([newIssue, ...issues]);
    setNewTitle('');
  };

  const moveStatus = (id: string, nextStatus: Issue['status']) => {
    setIssues(issues.map(i => i.id === id ? { ...i, status: nextStatus } : i));
  };

  return (
    <div className="p-4 bg-slate-950 text-slate-100 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <h3 className="font-semibold text-sm tracking-wide text-slate-200">Linear Reactive Engine</h3>
        <span className="text-xs font-mono text-slate-400">Total: {issues.length} Issues</span>
      </div>
      <form onSubmit={addIssue} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Nuovo task... (Premi Enter)"
          className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs rounded text-slate-100 focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-medium rounded text-white transition-colors">
          Crea
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {(['backlog', 'todo', 'in_progress', 'done'] as const).map(col => (
          <div key={col} className="bg-slate-900/60 p-3 rounded border border-slate-800/80">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2 block">{col.replace('_', ' ')}</span>
            <div className="space-y-2 min-h-[120px]">
              {issues.filter(i => i.status === col).map(item => (
                <div key={item.id} className="p-2.5 bg-slate-800/90 rounded border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span>{item.identifier}</span>
                    <span className="text-amber-400">{item.priority}</span>
                  </div>
                  <p className="text-slate-200 font-medium mb-2">{item.title}</p>
                  <div className="flex gap-1">
                    {col !== 'done' && (
                      <button onClick={() => moveStatus(item.id, col === 'backlog' ? 'todo' : col === 'todo' ? 'in_progress' : 'done')} className="text-[10px] text-slate-400 hover:text-indigo-300">Avanza &rarr;</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      backendCode: `// Express API route for Linear sync delta
import express from 'express';
const router = express.Router();

router.post('/api/sync/delta', async (req, res) => {
  const { workspaceId, clientVersion, mutations } = req.body;
  // Validazione atomica e scrittura nel log delle mutazioni
  res.json({
    status: 'applied',
    newServerVersion: Date.now(),
    broadcastClientsCount: 4
  });
});

export default router;`,
      sqlDdl: `-- PostgreSQL DDL generato da REA per Linear
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(16) NOT NULL,
  title TEXT NOT NULL,
  status VARCHAR(32) NOT NULL,
  priority SMALLINT NOT NULL DEFAULT 2,
  sort_order FLOAT8 NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_issues_status ON issues (status);`,
      systemPrompt: 'You are recreating a high-performance issue tracker inspired by Linear. Enforce zero layout shifts, optimistic client updates, keyboard shortcut priority, and clean obsidian palette.'
    }
  },
  {
    id: 'stripe-checkout-pipeline',
    name: 'Stripe — Idempotent Payment Pipeline',
    tagline: 'Zero-downtime PCI-tokenized transaction processor with webhook retry queue',
    category: 'api_protocol',
    targetUrlOrSpec: 'https://stripe.com/checkout',
    summary: 'Decostruzione della pipeline di pagamento Stripe: architettura a tokenizzazione client-side (Elements), isolamento PCI-DSS SAQ-A, idempotency keys atomiche con Redis e motore di retry esponenziale per Webhook.',
    imagePath: '/src/assets/images/blueprint_software_arch_1793627413463.jpg',
    architecture: {
      overview: 'Separazione rigorosa tra flussi di autorizzazione tokenizzata e regolamento contabile. Il browser non tocca mai i numeri di carta di credito: dialoga con il vault PCI protetto che restituisce un PaymentMethod tokenizzato.',
      layers: [
        {
          name: 'PCI Vault & Tokenization',
          technologies: ['Hardware Security Module (HSM)', 'Encrypted Token Vault'],
          responsibilities: ['Cifratura AES-256 dei numeri di carta (PAN)', 'Emissione di PaymentMethod ID sicuri'],
          tradeOffs: 'Rigidi vincoli di conformità e perimetro di rete isolato.'
        },
        {
          name: 'Idempotent Payment Engine',
          technologies: ['PostgreSQL', 'Redis Distributed Lock', 'Two-Phase Commit'],
          responsibilities: ['Deduplicazione basata su Idempotency-Key', 'Autorizzazione preventiva 3D Secure v2'],
          tradeOffs: 'Conserva chiavi di idempotenza per 24 ore con lock distributed.'
        },
        {
          name: 'Webhook Event Bus',
          technologies: ['Apache Kafka', 'SQS Dead Letter Queue', 'HMAC SHA256 Signature'],
          responsibilities: ['Consegna affidabile degli eventi at-least-once', 'Retry con jitter esponenziale (fino a 72 ore)'],
          tradeOffs: 'I consumatori devono implementare gestione idempotente dei messaggi.'
        }
      ],
      stateSyncStrategy: 'State Machine deterministica (requires_payment_method -> requires_action -> processing -> succeeded).',
      scalabilityBottlenecks: [
        'Picchi di concorrenza Black Friday con 30k transazioni/sec',
        'Latenza degli intermediari bancari e circuiti Visa/Mastercard',
        'Allineamento dello stato delle sottoscrizioni ricorrenti in fusi orari multipli'
      ]
    },
    database: {
      dialect: 'postgresql',
      entities: [
        {
          tableName: 'customers',
          description: 'Profilo cliente con metodo di pagamento predefinito',
          fields: [
            { name: 'id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'cus_xxxx univoco' },
            { name: 'email', type: 'VARCHAR(255)', isNullable: false, description: 'Email per ricevute' },
            { name: 'currency', type: 'VARCHAR(3)', isNullable: false, description: 'Valuta di default (es. EUR)' }
          ]
        },
        {
          tableName: 'payment_intents',
          description: 'Tracciamento dell autorizzazione di pagamento con idempotenza',
          fields: [
            { name: 'id', type: 'VARCHAR(64)', isPrimaryKey: true, description: 'pi_xxxx identificatore' },
            { name: 'customer_id', type: 'VARCHAR(64)', references: '"customers"("id")', description: 'Cliente associato' },
            { name: 'amount_cents', type: 'BIGINT', isNullable: false, description: 'Importo in centesimi per precisione' },
            { name: 'currency', type: 'VARCHAR(3)', isNullable: false, description: 'ISO 4217 codice valuta' },
            { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'requires_payment_method | succeeded | canceled' },
            { name: 'idempotency_key', type: 'VARCHAR(128)', isNullable: false, description: 'Chiave client per prevenire addebiti doppi' }
          ]
        }
      ],
      rawDdl: ''
    },
    api: {
      endpoints: [
        { method: 'POST', path: '/v1/payment_intents', description: 'Crea un PaymentIntent con importo e valuta', responsePayload: '{ id: "pi_123", client_secret: "pi_123_secret_xyz", status: "requires_payment_method" }', latencyBudgetMs: 80 },
        { method: 'POST', path: '/v1/payment_intents/:id/confirm', description: 'Conferma il pagamento con il token del metodo', responsePayload: '{ id: "pi_123", status: "succeeded" }', latencyBudgetMs: 250 },
        { method: 'POST', path: '/v1/webhooks', description: 'Endpoint consumatore per eventi firmati HMAC', responsePayload: '{ received: true }', latencyBudgetMs: 15 }
      ],
      authStrategy: 'HTTP Basic Auth con Bearer Secret Key sul server; Publishable Key pubblica sul client.',
      rateLimiting: '100 req/sec in livemode, 25 req/sec in testmode con burst allowance.'
    },
    ui: {
      designTokens: {
        palette: [
          { name: 'Stripe Blurple', hex: '#635BFF', role: 'Primary Action & Brand' },
          { name: 'Pure Dark', hex: '#0A2540', role: 'Slate Contrast & Text' },
          { name: 'Success Mint', hex: '#00D924', role: 'Confirmed Payment' }
        ],
        typography: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', code: 'JetBrains Mono' },
        radii: '8px',
        elevation: 'Subtle box shadow con hairline border'
      },
      componentTree: [
        {
          name: 'CheckoutModal',
          type: 'organism',
          description: 'Form di pagamento sicuro con isolamento iframe',
          children: [
            { name: 'OrderSummary', type: 'molecule', description: 'Riepilogo totale e tasse' },
            { name: 'CardElement', type: 'molecule', description: 'Input carta tokenizzato con auto-formatting' },
            { name: 'PayButton', type: 'atom', description: 'CTA con stato di caricamento spinner e anti-double-click' }
          ]
        }
      ],
      keyInteractions: [
        'Rilevamento automatico circuito carta (Visa/Mastercard/Amex)',
        'Formattazione automatica MM/YY e CVC con validazione algoritmo di Luhn'
      ]
    },
    business: {
      monetization: '2.9% + 30c per transazione riuscita con volume-based discounts per enterprise.',
      conversionFunnel: [
        'One-click checkout Link salvato per oltre 100M acquirenti',
        'Adattamento automatico dei metodi locali (iDEAL, Bancontact, Klarna, Apple Pay)'
      ],
      growthLoops: [
        {
          step: 'Consumer Link Wallet',
          trigger: 'Acquisto su qualsiasi merchant Stripe',
          action: 'Cliente salva carta con un tap su Link',
          reward: 'Acquisto istantaneo su tutti gli altri negozi Stripe senza reinserire i dati',
          metric: 'Conversion lift +7.5%'
        }
      ],
      moat: 'Fiducia e integrazioni bancarie globali in oltre 45 paesi con conformità normativa certificata.'
    },
    rebuildDeliverables: {
      sandboxPresetType: 'stripe',
      frontendCode: `// REA Stripe Checkout Interactive Rebuild
import React, { useState } from 'react';

export function StripeCheckoutClone() {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div>
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">REA Rebuild</span>
          <h4 className="text-base font-bold text-white">Stripe Checkout Simulator</h4>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded">SAQ-A Ready</span>
      </div>

      {step === 'form' && (
        <form onSubmit={handlePay} className="space-y-4">
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Piano Pro Annuale</span>
              <span className="font-mono text-slate-200">€ 120,00</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-white">
              <span>Totale dovuto</span>
              <span className="font-mono text-emerald-400">€ 120,00</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Numero Carta (Test)</label>
            <input 
              type="text" 
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Scadenza</label>
              <input 
                type="text" 
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">CVC</label>
              <input 
                type="text" 
                value={cvc}
                onChange={e => setCvc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs rounded text-white transition-colors flex items-center justify-center gap-2"
          >
            Paga € 120,00
          </button>
        </form>
      )}

      {step === 'processing' && (
        <div className="py-8 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300">Verifica token PCI e idempotenza in corso...</p>
        </div>
      )}

      {step === 'success' && (
        <div className="py-6 text-center space-y-3">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
            ✓
          </div>
          <h5 className="text-sm font-semibold text-white">Pagamento Riuscito!</h5>
          <p className="text-xs text-slate-400">PaymentIntent: pi_3N9xJ2K392 (Idempotency Key Verificata)</p>
          <button 
            onClick={() => setStep('form')}
            className="px-4 py-1.5 bg-slate-800 text-xs rounded text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Nuova Transazione
          </button>
        </div>
      )}
    </div>
  );
}`,
      backendCode: `// Express API route for Stripe PaymentIntent with Idempotency
import express from 'express';
const router = express.Router();

router.post('/v1/payment_intents', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key header is mandatory' });
  }
  // Crea e restituisce PaymentIntent
  res.json({
    id: 'pi_' + Math.random().toString(36).substring(7),
    amount: req.body.amount,
    currency: req.body.currency,
    status: 'succeeded'
  });
});

export default router;`,
      sqlDdl: `-- DDL PostgreSQL per Stripe PaymentIntent
CREATE TABLE IF NOT EXISTS payment_intents (
  id VARCHAR(64) PRIMARY KEY,
  amount_cents BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(32) NOT NULL,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
      systemPrompt: 'You are recreating Stripe idempotent payment pipeline. Implement SAQ-A compliant card inputs, client-side tokenization, and idempotency key headers.'
    }
  },
  {
    id: 'dyson-air-multiplier',
    name: 'Dyson — Bladeless Air Multiplier',
    tagline: 'Coanda effect fluid dynamics with brushless DC motor PID velocity loop',
    category: 'hardware_iot',
    targetUrlOrSpec: 'Dyson AM06 / Purifier Cool Hardware System',
    summary: 'Decostruzione fisica ed elettronica del ventilatore senza pale Dyson: aerodinamica dell Effetto Coandă (profilo alare con fessura da 1.3mm), motore brushless a 9 pale con silenziatore di Helmholtz e microcontroller PID per il controllo del flusso d aria.',
    imagePath: '/src/assets/images/blueprint_hardware_system_1793627413454.jpg',
    architecture: {
      overview: 'Il ventilatore aspira aria alla base tramite un rotore misto (mixed-flow impeller) e la spinge in un anello cavo. L aria fuoriesce attraverso una fessura di 1.3mm lungo una rampa inclinata a 16°, inducendo l aria circostante per effetto Coandă con una moltiplicazione del flusso pari a 15x.',
      layers: [
        {
          name: 'Aerodynamic Fluidic Amplifier',
          technologies: ['Coanda Surface Profile', '1.3mm Annular Aperture', 'Airfoil Ramp 16°'],
          responsibilities: ['Moltiplicazione del flusso d aria 15x', 'Eliminazione del flusso a scatti delle pale'],
          tradeOffs: 'Richiede altissima precisione negli stampi a iniezione in policarbonato.'
        },
        {
          name: 'Motor & Acoustic Attenuation',
          technologies: ['Brushless DC (BLDC) Motor', 'Helmholtz Resonator Cavity', 'Vibration Isolators'],
          responsibilities: ['Spinta continua ad alto RPM con basso rumore', 'Cancellazione delle frequenze a 1 kHz del motore'],
          tradeOffs: 'Costo superiore del rotore bilanciato dinamicamente.'
        },
        {
          name: 'Control Electronics & Sensors',
          technologies: ['STM32 ARM Cortex-M4', 'VOC / PM2.5 Optical Sensors', 'IR Remote & BLE'],
          responsibilities: ['Loop di controllo PID per velocità costante', 'Telemetria qualità dell aria in tempo reale'],
          tradeOffs: 'Calibrazione sensori ottici soggetta a polvere nel tempo.'
        }
      ],
      stateSyncStrategy: 'Control loop PID locale a 200 Hz con sync telemetrico BLE/WiFi a 1 Hz verso app mobile.',
      scalabilityBottlenecks: [
        'Resistenza aerodinamica con filtri HEPA intasati che causano surriscaldamento motore',
        'Consumo energetico alla velocità massima (40W continuativi)'
      ]
    },
    database: {
      dialect: 'postgresql',
      entities: [
        {
          tableName: 'device_telemetry',
          description: 'Serie temporale di campionamento sensori per ogni ventilatore',
          fields: [
            { name: 'id', type: 'BIGSERIAL', isPrimaryKey: true, description: 'Sequenza campionamento' },
            { name: 'device_serial', type: 'VARCHAR(64)', isNullable: false, description: 'Numero di serie del dispositivo' },
            { name: 'fan_speed_rpm', type: 'INTEGER', isNullable: false, description: 'Velocità misurata del motore' },
            { name: 'airflow_liters_sec', type: 'FLOAT4', isNullable: false, description: 'Volume aria moltiplicato calcolato' },
            { name: 'pm25_ug_m3', type: 'FLOAT4', isNullable: false, description: 'Particolato PM2.5 misurato' },
            { name: 'timestamp', type: 'TIMESTAMPTZ', isNullable: false, description: 'Momento della lettura' }
          ]
        }
      ],
      rawDdl: ''
    },
    api: {
      endpoints: [
        { method: 'POST', path: '/api/v1/device/command', description: 'Invia comandi di velocità e oscillazione al ventilatore', responsePayload: '{ status: "acknowledged", currentRpm: 1800 }', latencyBudgetMs: 50 },
        { method: 'GET', path: '/api/v1/device/telemetry/live', description: 'Lettura telemetria sensori PM2.5 e flusso', responsePayload: '{ pm25: 12, fanSpeed: 6, airflowMultiplier: 15.2 }', latencyBudgetMs: 20 }
      ],
      authStrategy: 'Mutual TLS (mTLS) con certificato X.509 hardcoded nel chip di sicurezza del ventilatore.',
      rateLimiting: '10 comandi/sec per dispositivo fisico.'
    },
    ui: {
      designTokens: {
        palette: [
          { name: 'Titanium Graphite', hex: '#1E232A', role: 'Hardware Chassis' },
          { name: 'Airflow Cyan', hex: '#06B6D4', role: 'Streamline Coanda Indicator' },
          { name: 'Pure White', hex: '#FFFFFF', role: 'Display Numerals' }
        ],
        typography: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', code: 'JetBrains Mono' },
        radii: '12px',
        elevation: 'Subtle metallic rim lighting'
      },
      componentTree: [
        {
          name: 'DysonHardwareSimulator',
          type: 'page',
          description: 'Console interattiva di simulazione del flusso aerodinamico e controllo velocità',
          children: [
            { name: 'AirMultiplierGraphic', type: 'molecule', description: 'Visualizzazione vettoriale dell anello e particelle d aria' },
            { name: 'VelocitySlider', type: 'molecule', description: 'Slider a 10 step con feedback RPM' },
            { name: 'AirQualityGauge', type: 'molecule', description: 'Misuratore PM2.5 con indice di purezza' }
          ]
        }
      ],
      keyInteractions: [
        'Slider velocità da 1 a 10 con aumento sonoro simulato e moltiplicazione particelle',
        'Toggle oscillazione a 70° con animazione CSS fluida'
      ]
    },
    business: {
      monetization: 'Vendita hardware premium ad alto margine ($400 - $800) + ricavi ricorrenti dalla vendita di filtri HEPA semestrali ($70/filtro).',
      conversionFunnel: [
        'Demo fisica nei department store con palloncino sospeso nel flusso',
        'Notifica app "Filtro al 10% di vita rimanente" -> 1-tap re-order su Dyson Direct'
      ],
      growthLoops: [
        {
          step: 'Iconic Design Placement',
          trigger: 'Presenza visiva nel salotto o ufficio del cliente',
          action: 'Gli ospiti chiedono incuriositi come funzioni senza pale',
          reward: 'Passaparola spontaneo ad alto status percepito',
          metric: 'Referral organico oltre 35%'
        }
      ],
      moat: 'Oltre 120 brevetti internazionali sul profilo aerodinamico della rampa e sul silenziatore Helmholtz.'
    },
    rebuildDeliverables: {
      sandboxPresetType: 'dyson',
      frontendCode: `// REA Dyson Bladeless Interactive Simulator
import React, { useState } from 'react';

export function DysonSimulatorClone() {
  const [speed, setSpeed] = useState(5);
  const [oscillating, setOscillating] = useState(true);
  const [pm25, setPm25] = useState(14);

  const airflow = (speed * 42).toFixed(0);
  const rpm = 1200 + speed * 250;

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 max-w-lg mx-auto">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div>
          <span className="text-xs text-cyan-400 font-mono uppercase">Hardware Dissection</span>
          <h4 className="text-base font-bold text-white">Dyson Coandă Air Multiplier</h4>
        </div>
        <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">15x Amplification</span>
      </div>

      {/* Ring visualizer */}
      <div className="relative h-44 bg-slate-950 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800 mb-4">
        {/* The hollow ring */}
        <div className="relative w-28 h-36 border-4 border-slate-600 rounded-full flex items-center justify-center">
          <div className="w-20 h-28 border border-dashed border-cyan-500/50 rounded-full" />
          <div className="absolute text-center">
            <span className="text-[10px] text-slate-400 block font-mono">FLOW</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">{airflow} L/s</span>
          </div>
        </div>

        {/* Air streams */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full"
              style={{
                opacity: 0.2 + (speed / 12),
                transform: \`translateY(\${(i - 2.5) * 20}px)\`
              }} 
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-slate-300">Velocità Flusso (1-10)</span>
            <span className="text-cyan-400 font-bold">{speed} / 10 · {rpm} RPM</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">QUALITÀ ARIA PM2.5</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{pm25} µg/m³</span>
            <span className="text-[10px] text-slate-500 block">Ottimale (Filtro HEPA)</span>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 block font-mono">OSCILLAZIONE 70°</span>
            <button 
              onClick={() => setOscillating(!oscillating)}
              className={\`text-xs px-2 py-1 rounded font-semibold transition-colors \${oscillating ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'}\`}
            >
              {oscillating ? 'Attiva' : 'Fissa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      backendCode: `// Microcontroller firmware command stub
import express from 'express';
const router = express.Router();

router.post('/api/dyson/speed', (req, res) => {
  const { targetRpm } = req.body;
  // Calcolo loop PID: PWM output = Kp*error + Ki*integral + Kd*derivative
  res.json({ currentRpm: targetRpm, pwmDutyCycle: 0.72 });
});

export default router;`,
      sqlDdl: `-- DDL PostgreSQL per telemetria Dyson
CREATE TABLE IF NOT EXISTS dyson_telemetry (
  id BIGSERIAL PRIMARY KEY,
  device_id VARCHAR(64) NOT NULL,
  fan_speed_rpm INT NOT NULL,
  airflow_liters_sec FLOAT NOT NULL,
  pm25 FLOAT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);`,
      systemPrompt: 'You are recreating Dyson hardware air multiplier logic. Focus on fluid dynamics parameters, PID motor velocity control loop, and aerodynamic telemetry visualization.'
    }
  },
  {
    id: 'duolingo-habit-engine',
    name: 'Duolingo — Gamified Retention Engine',
    tagline: 'Loss-aversion streak mechanics with spaced repetition intervals (SM-2)',
    category: 'business_growth',
    targetUrlOrSpec: 'https://duolingo.com',
    summary: 'Decostruzione del motore di ritenzione e gamification di Duolingo: psicologia dell avversione alla perdita (Streak), gemme virtuali (Gems), inventario congelatori di serie (Streak Freeze) e algoritmo di ripetizione spaziata.',
    imagePath: '/src/assets/images/blueprint_ai_neural_flow_1793627413617.jpg',
    architecture: {
      overview: 'Architettura orientata alla massima reattività comportamentale. I nodi di apprendimento sono modellati come grafi di dipendenze. Il motore di notifica calcola per ciascun fuso orario il momento di massimo rimorso dell utente (tra le 20:00 e le 22:30).',
      layers: [
        {
          name: 'Spaced Repetition Scheduler',
          technologies: ['SuperMemo SM-2 Algorithm', 'Half-Life Decay Model'],
          responsibilities: ['Calcolo probabilistico del tasso di oblio per parola', 'Composizione dinamica della lezione'],
          tradeOffs: 'Complessità di calcolo per utenti con vocabolari superiori a 5.000 parole.'
        },
        {
          name: 'Loss Aversion & Streak Engine',
          technologies: ['Redis Sorted Sets', 'Cron Event Scheduler', 'Push Notification Matrix'],
          responsibilities: ['Verifica mezzanotte per ciascun timezone locale', 'Scalo automatico di Streak Freeze o reset streak'],
          tradeOffs: 'Elevato carico computazionale nei cambi d ora globali.'
        }
      ],
      stateSyncStrategy: 'Sincronizzazione della sessione offline con riconciliazione timestamp lato server per prevenire cheat dell orologio.',
      scalabilityBottlenecks: [
        'Milioni di push notification simultanee schedulate a mezzanotte locale',
        'Gestione delle leghe competitive settimanali con classifiche live (Leaderboards)'
      ]
    },
    database: {
      dialect: 'postgresql',
      entities: [
        {
          tableName: 'users_streak',
          description: 'Tracciamento della serie ininterrotta e inventario congelatori',
          fields: [
            { name: 'user_id', type: 'UUID', isPrimaryKey: true, description: 'ID univoco utente' },
            { name: 'current_streak', type: 'INTEGER', isNullable: false, description: 'Numero giorni consecutivi attivi' },
            { name: 'streak_freeze_count', type: 'INTEGER', isNullable: false, description: 'Congelatori disponibili (max 2)' },
            { name: 'last_lesson_completed_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Ultimo timestamp di completamento' }
          ]
        }
      ],
      rawDdl: ''
    },
    api: {
      endpoints: [
        { method: 'POST', path: '/api/v1/lessons/complete', description: 'Registra lezione completata e incrementa la streak', responsePayload: '{ streak: 42, gemsEarned: 15, leveledUp: true }', latencyBudgetMs: 35 },
        { method: 'POST', path: '/api/v1/streak/freeze/buy', description: 'Acquista un congelatore di serie con gemme', responsePayload: '{ remainingGems: 120, freezes: 2 }', latencyBudgetMs: 40 }
      ],
      authStrategy: 'OAuth2 Social Auth (Google / Apple ID) + sessioni JWT.',
      rateLimiting: '300 req/min per sessione attiva.'
    },
    ui: {
      designTokens: {
        palette: [
          { name: 'Duolingo Feather Green', hex: '#58CC02', role: 'Brand & Complete Lesson' },
          { name: 'Flame Orange', hex: '#FF9600', role: 'Active Streak Fire' },
          { name: 'Ruby Heart', hex: '#FF4B4B', role: 'Lives Counter' }
        ],
        typography: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', code: 'JetBrains Mono' },
        radii: '14px (tactile playfulness)',
        elevation: 'Bordo 3D inferiore 3px per effetto pulsante premibile'
      },
      componentTree: [
        {
          name: 'DuolingoLearnView',
          type: 'page',
          description: 'Mappa del percorso ad albero con pulsanti tactile e contatore streak',
          children: [
            { name: 'TopBarHeader', type: 'molecule', description: 'Contatore Streak con fiamma, Gemme e Vite' },
            { name: 'TreePathway', type: 'organism', description: 'Serie di nodi livello sbloccabili' }
          ]
        }
      ],
      keyInteractions: [
        'Animazione fiamma pulsante al completamento della lezione',
        'Pressione dei pulsanti con effetto tattile depressivo 3D'
      ]
    },
    business: {
      monetization: 'Modello Freemium con Duolingo Super ($6.99/mo) per vite infinite e rimozione annunci; microtransazioni di gemme e Streak Freeze.',
      conversionFunnel: [
        'Utente perde tutte le 5 vite a metà esercizio -> Pop-up "Passa a Super per continuare subito"',
        'Utente sta per perdere una streak di 100 giorni -> Pop-up "Ripara la streak con 200 gemme o iscriviti a Super"'
      ],
      growthLoops: [
        {
          step: 'Streak Milestone Celebrations',
          trigger: 'Raggiungimento di 50, 100, 365 giorni',
          action: 'Condivisione automatica su Instagram / WhatsApp Story',
          reward: 'Riconoscimento sociale e prova di disciplina personale',
          metric: 'Nuove registrazioni organiche referral +22%'
        }
      ],
      moat: 'Psicologia dell investimento continuo (IKEA effect): abbandonare l app significherebbe buttare via 200 giorni di impegno quotidiano.'
    },
    rebuildDeliverables: {
      sandboxPresetType: 'duolingo',
      frontendCode: `// REA Duolingo Streak Simulator
import React, { useState } from 'react';

export function DuolingoClone() {
  const [streak, setStreak] = useState(48);
  const [gems, setGems] = useState(350);
  const [freezes, setFreezes] = useState(1);
  const [completedToday, setCompletedToday] = useState(false);

  const completeLesson = () => {
    if (!completedToday) {
      setStreak(s => s + 1);
      setGems(g => g + 20);
      setCompletedToday(true);
    }
  };

  const buyFreeze = () => {
    if (gems >= 100 && freezes < 2) {
      setGems(g => g - 100);
      setFreezes(f => f + 1);
    }
  };

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 max-w-md mx-auto">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-amber-400 font-bold font-mono text-sm">
            🔥 {streak}
          </span>
          <span className="flex items-center gap-1 text-cyan-400 font-bold font-mono text-sm">
            💎 {gems}
          </span>
          <span className="flex items-center gap-1 text-blue-400 font-bold font-mono text-sm">
            ❄️ {freezes}/2
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">Habit Engine</span>
      </div>

      <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center mb-4">
        <div className="text-3xl mb-2">{completedToday ? '🎉' : '🦉'}</div>
        <h4 className="text-sm font-bold text-white mb-1">
          {completedToday ? 'Obiettivo giornaliero raggiunto!' : 'Mantieni accesa la tua serie!'}
        </h4>
        <p className="text-xs text-slate-400 mb-3">
          {completedToday ? 'Hai protetto la tua streak per oggi.' : 'Completa 1 lezione per non perdere la serie di 48 giorni.'}
        </p>
        <button 
          onClick={completeLesson}
          disabled={completedToday}
          className={\`w-full py-2.5 rounded-lg text-xs font-bold transition-all \${
            completedToday ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }\`}
        >
          {completedToday ? 'Lezione Completata (Protetto)' : 'Pratica Adesso (+1 Day)'}
        </button>
      </div>

      <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">Streak Freeze (Gelo)</span>
          <span className="text-[11px] text-slate-400">Protegge la streak se salti un giorno (100 gemme)</span>
        </div>
        <button 
          onClick={buyFreeze}
          disabled={gems < 100 || freezes >= 2}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold rounded text-white"
        >
          Acquista
        </button>
      </div>
    </div>
  );
}`,
      backendCode: `// Duolingo streak validator endpoint
import express from 'express';
const router = express.Router();

router.post('/api/duolingo/lesson-complete', (req, res) => {
  const { userId } = req.body;
  // Calcolo se la serie è valida o se serve consumare un congelatore
  res.json({ streakUpdated: true, newStreak: 49, xp: 20 });
});

export default router;`,
      sqlDdl: `-- DDL PostgreSQL per Duolingo Streak
CREATE TABLE IF NOT EXISTS duolingo_streaks (
  user_id UUID PRIMARY KEY,
  streak_count INT NOT NULL DEFAULT 0,
  freeze_count INT NOT NULL DEFAULT 1,
  last_active_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
      systemPrompt: 'You are recreating Duolingo gamification mechanics. Emphasize loss-aversion streak preservation, virtual economy gems, and positive reinforcement feedback.'
    }
  }
];

/**
 * Returns blueprint by ID or fallback
 */
export function getBlueprintById(id: string): ReaBlueprint | undefined {
  return CURATED_BLUEPRINTS.find(b => b.id === id);
}

/**
 * Build dynamic blueprint from Gemini AI or heuristics
 */
export function buildDynamicBlueprint(target: string, customSpec?: string): ReaBlueprint {
  const category = detectTargetCategory(target + ' ' + (customSpec || ''));
  const cleanName = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'Custom System';
  const id = 'custom-' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const entities: EntityModel[] = [
    {
      tableName: 'entities',
      description: `Modello principale per ${cleanName}`,
      fields: [
        { name: 'id', type: 'UUID', isPrimaryKey: true, description: 'Chiave primaria' },
        { name: 'name', type: 'VARCHAR(128)', isNullable: false, description: 'Nome identificativo' },
        { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Stato ciclo vitale' },
        { name: 'metadata', type: 'JSONB', isNullable: true, description: 'Attributi flessibili' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Data inserimento' }
      ]
    },
    {
      tableName: 'events_log',
      description: 'Audit log e tracciamento eventi per ' + cleanName,
      fields: [
        { name: 'id', type: 'BIGSERIAL', isPrimaryKey: true, description: 'Identificatore transazione' },
        { name: 'entity_id', type: 'UUID', references: '"entities"("id")', description: 'Riferimento entità' },
        { name: 'action', type: 'VARCHAR(64)', isNullable: false, description: 'Tipo operazione' },
        { name: 'payload', type: 'JSONB', isNullable: false, description: 'Dati modificati' },
        { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Timestamp' }
      ]
    }
  ];

  return {
    id,
    name: `REA // ${cleanName}`,
    tagline: `Reverse engineered architecture, schema and interactive replica of ${cleanName}`,
    category,
    targetUrlOrSpec: target,
    summary: `Decostruzione architetturale completa di ${cleanName}. Analisi dei pattern distribuiti, del modello dei dati e ricostruzione funzionale con codice sorgente pronto alla produzione.`,
    imagePath: '/src/assets/images/blueprint_software_arch_1793627413463.jpg',
    architecture: {
      overview: `Architettura scalabile per ${cleanName} con separazione rigida tra storage transazionale, cache distribuita e presentazione client-side reattiva.`,
      layers: [
        {
          name: 'Presentation & UI Layer',
          technologies: ['React 19', 'Tailwind CSS v4', 'TypeScript'],
          responsibilities: ['Interfacce interattive reattive', 'Gestione ottimistica dello stato', 'Zero layout shifts'],
          tradeOffs: 'Richiede sincronizzazione rigorosa con la cache remota.'
        },
        {
          name: 'Application & Orchestration Layer',
          technologies: ['Node.js Express', 'TypeScript', 'Redis Cache'],
          responsibilities: ['Validazione contratti API', 'Rate limiting', 'Gestione concorrenza'],
          tradeOffs: 'Necessita di replica orizzontale sotto picchi elevati.'
        },
        {
          name: 'Data & Persistence Layer',
          technologies: ['PostgreSQL 16', 'TimescaleDB / JSONB'],
          responsibilities: ['Consistenza ACID', 'Partizionamento per ID tenant', 'Backup point-in-time'],
          tradeOffs: 'Richiede indicizzazione accurata per query complesse.'
        }
      ],
      stateSyncStrategy: 'WebSocket event stream con polling HTTP fallback per riconnessioni.',
      scalabilityBottlenecks: [
        'Concorrenza di scrittura su tabelle ad alta frequenza di aggiornamento',
        'Consumo di memoria durante query analitiche aggregate'
      ]
    },
    database: {
      dialect: 'postgresql',
      entities,
      rawDdl: generateSqlDdl(entities)
    },
    api: {
      endpoints: [
        { method: 'GET', path: `/api/v1/${cleanName.toLowerCase()}/list`, description: 'Elenco entità con paginazione basata su cursore', responsePayload: '{ items: Entity[], nextCursor: string | null }', latencyBudgetMs: 30 },
        { method: 'POST', path: `/api/v1/${cleanName.toLowerCase()}/create`, description: 'Crea nuova entità con validazione schema', responsePayload: '{ item: Entity, status: "created" }', latencyBudgetMs: 45 },
        { method: 'DELETE', path: `/api/v1/${cleanName.toLowerCase()}/:id`, description: 'Soft-delete entità con tracciamento log eventi', responsePayload: '{ deleted: true }', latencyBudgetMs: 25 }
      ],
      authStrategy: 'Bearer JWT con rotazione chiavi asimmetriche RS256.',
      rateLimiting: '120 richieste/minuto per IP con burst allowance fino a 30.'
    },
    ui: {
      designTokens: {
        palette: [
          { name: 'Obsidian Slate', hex: '#0F172A', role: 'Canvas Background' },
          { name: 'Accent Cyan', hex: '#06B6D4', role: 'Active Interactive Element' },
          { name: 'Hairline Slate', hex: '#334155', role: 'Structural Dividers' }
        ],
        typography: { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', code: 'JetBrains Mono' },
        radii: '8px',
        elevation: 'Hairline 1px border'
      },
      componentTree: [
        {
          name: 'ReaDynamicShell',
          type: 'page',
          description: `Shell applicativa per ${cleanName}`,
          children: [
            { name: 'HeaderBar', type: 'molecule', description: 'Barra comandi e stato' },
            { name: 'InteractiveWorkspace', type: 'organism', description: 'Workspace con griglia interattiva' }
          ]
        }
      ],
      keyInteractions: [
        'Azione rapida di inserimento e filtro istantaneo',
        'Aggiornamento ottimistico dello stato senza ricaricare la pagina'
      ]
    },
    business: {
      monetization: 'B2B SaaS subscription basato su tier di utilizzo e supporto SLA.',
      conversionFunnel: [
        'Accesso immediato senza attrito',
        'Raggiungimento del valore chiave nei primi 3 minuti',
        'Passaggio a piano a pagamento al superamento della quota free'
      ],
      growthLoops: [
        {
          step: 'Content & Value Sharing',
          trigger: 'Esportazione report o collaborazione',
          action: 'Destinatario accede alla vista interattiva',
          reward: 'Acquisizione organica di nuovi account',
          metric: 'Virality Loop K > 1.1'
        }
      ],
      moat: 'Architettura proprietaria altamente ottimizzata e retention basata sui dati storici accumulati.'
    },
    rebuildDeliverables: {
      sandboxPresetType: 'generic',
      frontendCode: `// REA Generic System Rebuild for ${cleanName}
import React, { useState } from 'react';

export function ${cleanName.replace(/[^a-zA-Z]/g, '') || 'DynamicApp'}Clone() {
  const [items, setItems] = useState([
    { id: '1', name: 'Nodo Primario #1', status: 'Attivo', latency: '14ms' },
    { id: '2', name: 'Nodo Cache Redis #2', status: 'Nominale', latency: '2ms' },
    { id: '3', name: 'Worker Coda Transazioni', status: 'In elaborazione', latency: '42ms' },
  ]);
  const [nameInput, setNameInput] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setItems([...items, {
      id: Date.now().toString(),
      name: nameInput.trim(),
      status: 'Attivo',
      latency: Math.floor(Math.random() * 30 + 5) + 'ms'
    }]);
    setNameInput('');
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div>
          <span className="text-xs text-cyan-400 font-mono">REA Live Playground</span>
          <h4 className="text-sm font-bold text-white">${cleanName} Prototype</h4>
        </div>
        <span className="text-xs font-mono text-slate-400">Items: {items.length}</span>
      </div>

      <form onSubmit={addItem} className="flex gap-2 mb-3">
        <input 
          type="text" 
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          placeholder="Nuovo elemento da inserire..."
          className="flex-1 bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs rounded text-slate-100"
        />
        <button type="submit" className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold rounded text-white">
          Aggiungi
        </button>
      </form>

      <div className="space-y-1.5">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800 text-xs">
            <span className="font-medium text-slate-200">{item.name}</span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-slate-400 text-[11px]">{item.latency}</span>
              <span className="text-emerald-400 font-semibold">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
      backendCode: `// Express API route for ${cleanName}
import express from 'express';
const router = express.Router();

router.get('/api/${cleanName.toLowerCase()}/items', (req, res) => {
  res.json({
    service: '${cleanName}',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

export default router;`,
      sqlDdl: generateSqlDdl(entities),
      systemPrompt: `You are recreating ${cleanName}. Generate modular, clean TypeScript components with comprehensive state handling.`
    }
  };
}
