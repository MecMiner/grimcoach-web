'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Smile, 
  CheckCircle2, 
  ArrowRight, 
  Edit3, 
  X, 
  UserCheck, 
  Gamepad2, 
  BarChart3
} from 'lucide-react';
import Logo from '@/components/Logo';
import EspecialistaCuradoria from '@/components/EspecialistaCuradoria';

export interface UserSession {
  nome: string;
  sobrenome: string;
  email: string;
  role: 'especialista' | 'aluno';
  instituicao?: string;
}

export default function AppPage() {
  const [user, setUser] = useState<UserSession>({
    nome: 'Jéferson',
    sobrenome: 'Souza',
    email: 'jeferson.souza@grimcoach.ufms.br',
    role: 'especialista',
    instituicao: 'Universidade Federal de Mato Grosso do Sul (UFMS)',
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserSession>({ ...user });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...tempProfile });
    setIsProfileModalOpen(false);
    setSuccessMsg('Perfil atualizado com sucesso!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo showSubtitle={false} />
            <span className="h-5 w-px bg-slate-200 hidden sm:block" />
            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5 ${
              user.role === 'especialista'
                ? 'bg-indigo-50 text-[#4F46E5] border border-indigo-100'
                : 'bg-emerald-50 text-[#10B981] border border-emerald-100'
            }`}>
              {user.role === 'especialista' ? (
                <>
                  <Award className="w-3.5 h-3.5" />
                  <span>Avaliador FACS</span>
                </>
              ) : (
                <>
                  <Smile className="w-3.5 h-3.5" />
                  <span>Perfil Aluno</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTempProfile({ ...user });
                setIsProfileModalOpen(true);
              }}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                {user.nome[0]}{user.sobrenome[0]}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                  <span>{user.nome} {user.sobrenome}</span>
                  <Edit3 className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{user.email}</div>
              </div>
            </button>

            <Link
              href="/login"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl transition-colors"
            >
              Sair
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner do Usuário */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Painel do GrimCoach</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Olá, {user.nome}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {user.role === 'especialista'
                ? 'Você está no modo de auditoria científica. Valide os recortes e autorize as expressões para o app logo abaixo.'
                : 'Acesse suas atividades de biofeedback e treinos de expressão facial.'}
            </p>
          </div>

          {/* Seletor rápido de papel para homologação */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Alternar Perfil:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setUser((prev) => ({ ...prev, role: 'especialista' }))}
                className={`px-3 py-1.5 rounded-lg transition-all ${user.role === 'especialista' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-slate-500'}`}
              >
                Especialista FACS
              </button>
              <button
                type="button"
                onClick={() => setUser((prev) => ({ ...prev, role: 'aluno' }))}
                className={`px-3 py-1.5 rounded-lg transition-all ${user.role === 'aluno' ? 'bg-white text-[#10B981] shadow-xs' : 'text-slate-500'}`}
              >
                Aluno
              </button>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RENDERIZAÇÃO CONDICIONAL POR PERFIL (SINGLE PAGE)                         */}
        {/* ========================================================================= */}
        {user.role === 'especialista' ? (
          <EspecialistaCuradoria />
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Módulos de Habilitação & Treino
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#10B981]">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Sessão de Treino Facial</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Treino interativo com biofeedback em tempo real das 7 emoções universais.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#10B981] hover:bg-emerald-600 shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Iniciar Treino</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F97316]">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Meu Histórico & Desempenho</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Acompanhe o engajamento e a evolução das expressões ao longo dos dias.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>Ver Relatórios</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Perfil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Editar Perfil</h3>
                  <p className="text-[11px] text-slate-500">Altere seus dados cadastrais</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nome</label>
                  <input
                    type="text"
                    required
                    value={tempProfile.nome}
                    onChange={(e) => setTempProfile({ ...tempProfile, nome: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0F172A] outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sobrenome</label>
                  <input
                    type="text"
                    required
                    value={tempProfile.sobrenome}
                    onChange={(e) => setTempProfile({ ...tempProfile, sobrenome: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0F172A] outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">E-mail</label>
                <input
                  type="email"
                  required
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0F172A] outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Instituição</label>
                <input
                  type="text"
                  value={tempProfile.instituicao || ''}
                  onChange={(e) => setTempProfile({ ...tempProfile, instituicao: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0F172A] outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-indigo-700 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}