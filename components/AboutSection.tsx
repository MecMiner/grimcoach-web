'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  Eye, 
  CheckCircle2,
  Search,
  ScanFace,
  Sparkles,
  Binary
} from 'lucide-react';
import { UNIVERSAL_EMOTIONS } from '../types';

export const AboutSection: React.FC = () => {
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('alegria');
  const currentEmotion = UNIVERSAL_EMOTIONS.find((e) => e.id === selectedEmotionId) || UNIVERSAL_EMOTIONS[0];

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Bloco 1: O GrimCoach e a Leitura de Expressões no TEA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#4F46E5] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" />
              <span>Habilitação Socioemocional no TEA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Decodificar expressões é o primeiro passo para conectar pessoas.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              No Transtorno do Espectro Autista (TEA), interpretar micro-expressões e pistas não-verbais pode demandar alto esforço cognitivo.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              O <strong>GrimCoach</strong> foca na identificação objetiva dessas manifestações. O sistema divide a face em regiões de interesse anatômico, ensinando a reconhecer padrões visuais e proporcionando uma prática espelhada segura e sem julgamentos.
            </p>
          </div>

          {/* Cards dos Pilares */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#4F46E5] flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">Pistas Visuais Objetivas</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Olhos, lábios e sobrancelhas analisados como pontos de referência claros.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <ScanFace className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">Prática Espelhada</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Biofeedback em tempo real para associar o movimento motor à emoção identificada.
              </p>
            </div>
          </div>
        </div>

        {/* Bloco 2: A Base Científica - FACS (Facial Action Coding System) */}
        <div id="metodologia" className="pt-12 border-t border-slate-100 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[#4F46E5] text-xs font-bold uppercase tracking-wider">
              <Binary className="w-3.5 h-3.5" />
              <span>Fundamentação Científica</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Padronização Anatômica pelo Sistema FACS
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              O GrimCoach fundamenta toda a sua análise no <strong>FACS (Facial Action Coding System)</strong>. As expressões não são tratadas de forma abstrata: o app mapeia as <strong>Action Units (AUs)</strong> — contrações musculares anatômicas individuais — para garantir precisão e clareza no treino.
            </p>
          </div>

          {/* Abas das 7 Emoções */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {UNIVERSAL_EMOTIONS.map((emotion) => {
              const isActive = selectedEmotionId === emotion.id;
              return (
                <button
                  key={emotion.id}
                  type="button"
                  onClick={() => setSelectedEmotionId(emotion.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    isActive
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-md shadow-indigo-500/20 scale-[1.02]'
                      : 'bg-[#F8FAFC] border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold capitalize">{emotion.label}</span>
                </button>
              );
            })}
          </div>

          {/* Card Demonstrativo: Marcadores + FACS Action Units */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Identificação da Expressão */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#4F46E5]">
                  <Eye className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Expressão Mapeada</span>
                  <h3 className="text-2xl font-black text-[#0F172A] capitalize">
                    {currentEmotion.label}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {currentEmotion.description}
              </p>
            </div>

            {/* Mapeamento FACS & Pistas Visuais */}
            <div className="lg:col-span-8 space-y-5">
              {/* Unidades de Ação (AUs) do FACS */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Action Units (AUs) Detectadas no FACS:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentEmotion.actionUnits.map((au, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs font-bold text-[#4F46E5]"
                    >
                      {au}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pistas Visuais para Reconhecimento */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Pistas visuais para reconhecer no rosto:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentEmotion.keyFeatures.map((feature, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};