'use client';

import React from 'react';
import { Search, Check, ScanFace, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Decodificação Visual',
      badge: 'Cognitivo',
      description: 'O GrimCoach apresenta uma das 7 emoções e destaca exatamente onde focar o olhar: a curvatura dos lábios, o arqueamento das sobrancelhas ou a contração ao redor dos olhos.',
      icon: Search,
      accent: 'bg-indigo-50 text-[#4F46E5] border-indigo-200',
    },
    {
      number: '02',
      title: 'Desafio de Reconhecimento',
      badge: 'Associação',
      description: 'Você identifica a emoção correspondente através de pistas de contexto e exemplos visuais, consolidando o aprendizado teórico sobre o que aquela expressão realmente comunica.',
      icon: Check,
      accent: 'bg-emerald-50 text-[#10B981] border-emerald-200',
    },
    {
      number: '03',
      title: 'Fixação Motora & Conquistas',
      badge: 'Prática & Gamificação',
      description: 'Em frente à câmera, tente reproduzir a expressão. O biofeedback em tempo real valida a tentativa, gera reforço positivo imediato e acumula pontos para sua evolução.',
      icon: ScanFace,
      accent: 'bg-orange-50 text-[#F97316] border-orange-200',
    },
  ];

  return (
    <section id="como-funciona" className="py-20 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Jornada de Aprendizado
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Como funciona uma sessão de treino
          </h2>
          <p className="text-base text-slate-600">
            Uma abordagem estruturada em três fases que vai da percepção visual até a fixação prática motora.
          </p>
        </div>

        {/* Cards das Etapas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${step.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {step.badge}
                    </span>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-[#4F46E5]">
                  <span>Treino progressivo</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};