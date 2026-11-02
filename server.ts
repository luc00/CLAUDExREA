import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  CURATED_BLUEPRINTS,
  buildDynamicBlueprint,
  detectTargetCategory,
  generateSqlDdl,
  ReaBlueprint
} from './src/utils/reverseEngineerEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI server-side with telemetry header
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/rea/presets', (req, res) => {
  res.json({ presets: CURATED_BLUEPRINTS });
});

app.post('/api/rea/analyze', async (req, res) => {
  const { target, category, context, imageBase64 } = req.body;

  if (!target || typeof target !== 'string' || !target.trim()) {
    return res.status(400).json({ error: 'Il target per il Reverse Engineering è obbligatorio' });
  }

  // Check if target matches one of our curated IDs
  const matchedCurated = CURATED_BLUEPRINTS.find(
    b => b.id.toLowerCase() === target.toLowerCase() || 
         b.name.toLowerCase().includes(target.toLowerCase()) ||
         b.targetUrlOrSpec.toLowerCase() === target.toLowerCase()
  );

  if (matchedCurated && !context && !imageBase64) {
    return res.json({ blueprint: matchedCurated, source: 'curated' });
  }

  // If Gemini API is available, perform deep multimodal reverse engineering
  if (ai) {
    try {
      const detectedCategory = category || detectTargetCategory(target);
      const systemInstruction = `Sei REA (Reverse Engineer Anything), il più avanzato motore di ingegneria inversa software, hardware e sistemica al mondo.
Il tuo compito è decostruire analiticamente l'obiettivo fornito e generare un blueprint completo con codice sorgente e schema dati.
Restituisci ESCLUSIVAMENTE un JSON valido (senza blocchi markdown aggiuntivi, solo il JSON) che aderisca alla struttura:
{
  "id": "slug-identificativo",
  "name": "Nome Prodotto / Sistema",
  "tagline": "Sottotitolo tecnico ad alto impatto",
  "category": "${detectedCategory}",
  "targetUrlOrSpec": "${target}",
  "summary": "Sintesi tecnica approfondita",
  "architecture": {
    "overview": "Descrizione architettura a livelli e flussi",
    "layers": [
      {
        "name": "Nome Livello (es. Client Cache Layer, Data Ingestion)",
        "technologies": ["Tech 1", "Tech 2"],
        "responsibilities": ["Responsabilità 1", "Responsabilità 2"],
        "tradeOffs": "Trade-off e compromessi architetturali"
      }
    ],
    "stateSyncStrategy": "Strategia di sincronizzazione dello stato",
    "scalabilityBottlenecks": ["Collo di bottiglia 1", "Collo di bottiglia 2"]
  },
  "database": {
    "dialect": "postgresql",
    "entities": [
      {
        "tableName": "nome_tabella",
        "description": "Scopo della tabella",
        "fields": [
          { "name": "id", "type": "UUID", "isPrimaryKey": true, "description": "Chiave primaria" },
          { "name": "campo", "type": "VARCHAR(128)", "isNullable": false, "description": "Descrizione campo" }
        ]
      }
    ],
    "rawDdl": "SQL CREATE TABLE DDL completo"
  },
  "api": {
    "endpoints": [
      {
        "method": "POST",
        "path": "/api/v1/...",
        "description": "Descrizione endpoint",
        "responsePayload": "{ ... }",
        "latencyBudgetMs": 40
      }
    ],
    "authStrategy": "Strategia di autenticazione e sicurezza",
    "rateLimiting": "Policy di rate limiting"
  },
  "ui": {
    "designTokens": {
      "palette": [
        { "name": "Primary", "hex": "#...", "role": "..." }
      ],
      "typography": { "heading": "Plus Jakarta Sans", "body": "Plus Jakarta Sans", "code": "JetBrains Mono" },
      "radii": "8px",
      "elevation": "Hairline 1px border"
    },
    "componentTree": [
      {
        "name": "RootComponent",
        "type": "page",
        "description": "Struttura principale",
        "children": []
      }
    ],
    "keyInteractions": ["Interazione 1", "Interazione 2"]
  },
  "business": {
    "monetization": "Modello di monetizzazione e pricing",
    "conversionFunnel": ["Fase 1", "Fase 2", "Fase 3"],
    "growthLoops": [
      {
        "step": "Viral Hook",
        "trigger": "Azione scatenante",
        "action": "Azione utente",
        "reward": "Valore ricevuto",
        "metric": "KPI di riferimento"
      }
    ],
    "moat": "Fattore di differenziazione difendibile"
  },
  "rebuildDeliverables": {
    "sandboxPresetType": "generic",
    "frontendCode": "Componente React TypeScript completo per visualizzare e testare una replica interattiva dell'app",
    "backendCode": "Route Express TypeScript per gestire le API di ${target}",
    "sqlDdl": "DDL PostgreSQL completo",
    "systemPrompt": "System prompt per ricreare ${target}"
  }
}`;

      const contents: any[] = [];
      if (imageBase64) {
        // Strip data prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        });
      }
      contents.push({
        text: `Decostruisci in reverse-engineering l'obiettivo seguente: "${target}".
Contesto addizionale dell'utente: ${context || 'Nessuno'}.
Estrai con massima precisione l'architettura tecnica, il modello dati, i flussi e genera il codice sorgente di re-implementazione.`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contents },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const jsonText = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(jsonText);
        if (parsed.database?.entities && !parsed.database.rawDdl) {
          parsed.database.rawDdl = generateSqlDdl(parsed.database.entities);
        }
        return res.json({ blueprint: parsed, source: 'gemini' });
      } catch (parseErr) {
        console.warn('JSON parse error from Gemini, falling back to dynamic generator:', parseErr);
      }
    } catch (aiErr) {
      console.error('Gemini API call error in /api/rea/analyze:', aiErr);
    }
  }

  // Fallback to high-fidelity dynamic generator
  const dynamicBlueprint = buildDynamicBlueprint(target, context);
  return res.json({ blueprint: dynamicBlueprint, source: 'fallback_dynamic' });
});

app.post('/api/rea/remix', async (req, res) => {
  const { blueprint, remixInstruction } = req.body;

  if (!blueprint || !remixInstruction) {
    return res.status(400).json({ error: 'Blueprint e istruzioni di remix sono obbligatori' });
  }

  if (ai) {
    try {
      const prompt = `L'utente vuole effettuare un REMIX / EVOLUZIONE del seguente blueprint REA:
Target originario: ${blueprint.name} (${blueprint.targetUrlOrSpec})
Istruzioni di evoluzione richieste: "${remixInstruction}"

Aggiorna e modifica il blueprint in modo creativo e tecnicamente rigoroso per incorporare queste nuove specifiche.
Restituisci ESCLUSIVAMENTE un JSON valido con la medesima struttura del blueprint REA originale.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const jsonText = response.text?.trim() || '';
      const remixed = JSON.parse(jsonText);
      return res.json({ blueprint: remixed, source: 'gemini_remix' });
    } catch (err) {
      console.warn('Remix AI generation failed, falling back to heuristic remix:', err);
    }
  }

  // Heuristic remix fallback
  const remixed: ReaBlueprint = {
    ...blueprint,
    id: `${blueprint.id}-remix-${Date.now().toString().slice(-4)}`,
    name: `${blueprint.name} (Evolved // ${remixInstruction.slice(0, 30)})`,
    tagline: `Remixed edition: ${remixInstruction}`,
    summary: `${blueprint.summary} Modificato con: ${remixInstruction}.`,
    architecture: {
      ...blueprint.architecture,
      overview: `${blueprint.architecture.overview} [Aggiornato con ${remixInstruction}]`,
      layers: [
        {
          name: 'Evolved Remix Engine',
          technologies: ['Gemini 3.8 Flash', 'Event Streams', 'Reactive Signals'],
          responsibilities: [`Implementazione di: ${remixInstruction}`, 'Adattamento dinamico flussi'],
          tradeOffs: 'Nuova componente ad alta flessibilità'
        },
        ...blueprint.architecture.layers
      ]
    }
  };

  return res.json({ blueprint: remixed, source: 'heuristic_remix' });
});

// Setup Vite development middleware or static production serve
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[REA Server] Server listening on http://0.0.0.0:${PORT} in ${isDev ? 'dev' : 'production'} mode`);
  });
}

startServer().catch(err => {
  console.error('[REA Server] Failed to start server:', err);
  process.exit(1);
});
