import React from 'react';
import { ReaBlueprint } from '../utils/reverseEngineerEngine';
import { ArrowRight, Layers, Cpu, Server, TrendingUp, Sparkles, ExternalLink } from 'lucide-react';

interface PresetsGalleryProps {
  curatedList: ReaBlueprint[];
  onSelect: (blueprint: ReaBlueprint) => void;
}

export function PresetsGallery({ curatedList, onSelect }: PresetsGalleryProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hardware_iot': return Cpu;
      case 'api_protocol': return Server;
      case 'business_growth': return TrendingUp;
      default: return Layers;
    }
  };

  return (
    <section className="py-12 bg-[#191716]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#CC785C] mb-2">
            <span>✦ ARCHIVIO SITI COPIABILI CLAUDE</span>
            <span aria-hidden="true">·</span>
            <span>ARTIFACTS PRE-CONFIGURATI</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FAF9F5] tracking-tight mb-2">
            Libreria dei Siti Decostruiti per Claude
          </h2>
          <p className="text-sm text-[#C4BDB0]">
            Seleziona uno dei siti web e delle piattaforme più iconiche al mondo. Ognuno contiene le direttive Claude pronte, lo schema relazionale e l'Artifact eseguibile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curatedList.map(blueprint => {
            const Icon = getCategoryIcon(blueprint.category);
            return (
              <div
                key={blueprint.id}
                className="bg-[#201E1C] border border-[#332F2B] rounded-2xl overflow-hidden hover:border-[#CC785C]/60 transition-all flex flex-col justify-between shadow-xl"
              >
                {blueprint.imagePath && (
                  <div className="relative h-48 overflow-hidden bg-[#171514]">
                    <img
                      src={blueprint.imagePath}
                      alt={blueprint.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#201E1C] via-[#201E1C]/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#191716]/90 backdrop-blur-md rounded-md border border-[#332F2B] text-[11px] font-mono text-[#CC785C]">
                      <Icon className="w-3 h-3" />
                      <span className="uppercase">{blueprint.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#FAF9F5] mb-1.5">{blueprint.name}</h3>
                    <p className="text-xs font-mono text-[#CC785C] mb-3">{blueprint.tagline}</p>
                    <p className="text-xs text-[#C4BDB0] leading-relaxed mb-4">{blueprint.summary}</p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#332F2B] text-center font-mono text-[11px] mb-4">
                      <div>
                        <span className="text-[#78716C] block text-[10px]">Tabelle</span>
                        <span className="text-[#FAF9F5] font-bold">{blueprint.database.entities.length}</span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block text-[10px]">Endpoints</span>
                        <span className="text-[#FAF9F5] font-bold">{blueprint.api.endpoints.length}</span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block text-[10px]">Livelli</span>
                        <span className="text-[#FAF9F5] font-bold">{blueprint.architecture.layers.length}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelect(blueprint)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#262320] hover:bg-[#CC785C] text-[#FAF9F5] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span className="font-serif font-black">✦</span>
                    <span>Copia Sito & Apri Claude Artifact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
