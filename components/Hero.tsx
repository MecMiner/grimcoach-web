'use client';

import React from 'react';
import { 
  Sparkles, 
  Target, 
  Smile, 
  Flame, 
  ArrowRight,
  BrainCircuit,
  Eye,
  BookOpen
} from 'lucide-react';

interface HeroProps {
  onOpenContributeModal?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#F8FAFC]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Coluna de Texto: Foco em Reconhecimento */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-[#4F46E5] shadow-sm">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Tecnologia Assistiva para o Espectro Autista (TEA)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              Aprenda a reconhecer e expressar <span className="text-[#4F46E5]">emoções faciais</span> com gamificação.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              O <strong>GrimCoach</strong> apoia pessoas autistas no <strong>reconhecimento e interpretação das expressões humanas</strong>. Através de estímulos visuais interativos e feedback imediato por visão computacional, o aplicativo torna a identificação das emoções mais intuitiva e prática no dia a dia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#comecar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-[#F97316] hover:bg-orange-600 shadow-lg shadow-[#F97316]/25 active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Começar Treino</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>

              <a
                href="#metodologia"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-bold text-[#4F46E5] bg-white border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm active:scale-95 transition-all"
              >
                <BookOpen className="w-5 h-5 text-[#4F46E5]" />
                <span>Conhecer a Metodologia</span>
              </a>
            </div>

            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-extrabold text-[#0F172A]">7</p>
                <p className="text-xs font-medium text-slate-500">Emoções Universais</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#4F46E5]">Cognitivo</p>
                <p className="text-xs font-medium text-slate-500">Foco em Reconhecimento</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#10B981]">Lúdico</p>
                <p className="text-xs font-medium text-slate-500">Aprendizado Leve</p>
              </div>
            </div>
          </div>

          {/* Mockup do App: Desafio de Reconhecimento */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200/90 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Modo Reconhecimento
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#F97316] text-xs font-extrabold">
                  <Flame className="w-3.5 h-3.5 fill-[#F97316]" />
                  <span>Nível 2 • 350 XP</span>
                </div>
              </div>

              <div className="relative mt-4 aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative flex flex-col items-center justify-center text-center p-4">
                  <div className="w-24 h-24 rounded-full border-2 border-[#10B981] flex items-center justify-center bg-indigo-950/40 backdrop-blur-xs mb-3 animate-pulse">
                    <Smile className="w-12 h-12 text-[#10B981]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    Expressão Identificada
                  </span>
                  <span className="text-[11px] text-[#10B981] font-mono mt-0.5">
                    Associação Correta: 96%
                  </span>
                </div>

                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-left">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Desafio
                  </span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#4F46E5]" /> Identifique a Alegria
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-[#10B981] text-white px-3 py-1 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Acertou!</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Progresso do Módulo</span>
                  <span className="text-[#4F46E5]">5 / 7 Emoções</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#10B981] rounded-full w-[72%] transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};