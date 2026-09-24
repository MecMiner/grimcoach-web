'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Smile, 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  User,
  HeartHandshake
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Captura se veio uma chave de acesso na URL (ex: ?chave=...)
  const initialKey = searchParams.get('chave') || '';

  // Aba selecionada: 'user' (Email/Senha) ou 'collaborator' (Chave de Acesso)
  const [authMode, setAuthMode] = useState<'user' | 'collaborator'>(
    initialKey ? 'collaborator' : 'user'
  );

  // Estados do formulário de Usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados do formulário de Colaborador
  const [accessKey, setAccessKey] = useState(initialKey);

  // Estados de feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submissão do Login de Usuário (Email + Senha)
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Por favor, preencha o seu e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulação de chamada de autenticação da aplicação
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redireciona para o módulo principal de treino
      router.push('/treino');
    } catch {
      setErrorMessage('E-mail ou senha inválidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submissão do Acesso de Colaborador (Chave de Acesso)
  const handleCollaboratorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanKey = accessKey.trim();
    if (!cleanKey) {
      setErrorMessage('Por favor, insira a sua chave de acesso.');
      return;
    }

    setIsLoading(true);
    try {
      // Redireciona diretamente para o fluxo de avaliação com a chave
      router.push(`/colaborador?chave=${encodeURIComponent(cleanKey)}`);
    } catch {
      setErrorMessage('Chave de acesso não encontrada ou expirada.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Detalhes de iluminação no fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Identidade GrimCoach */}
        <Logo/>

        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Aceder à plataforma
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Escolha a modalidade de acesso de acordo com o seu perfil
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200/90 space-y-6">
          
          {/* Seletor de Tipo de Acesso */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('user');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                authMode === 'user'
                  ? 'bg-white text-[#4F46E5] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Utilizador</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('collaborator');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                authMode === 'collaborator'
                  ? 'bg-white text-[#F97316] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Colaborador</span>
            </button>
          </div>

          {/* Alerta de Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORMA 1: LOGIN DE UTILIZADOR (E-mail + Senha) */}
          {authMode === 'user' && (
            <form onSubmit={handleUserLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="utilizador@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Senha
                  </label>
                  <a href="#recuperar" className="text-[11px] font-semibold text-[#4F46E5] hover:underline">
                    Esqueceu-se da senha?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>A iniciar sessão...</span>
                ) : (
                  <>
                    <span>Entrar no GrimCoach</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORMA 2: LOGIN DE COLABORADOR (Access Key) */}
          {authMode === 'collaborator' && (
            <form onSubmit={handleCollaboratorLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Chave de Acesso (Access Key)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="ex: f82d9a1c-3b4e-..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 font-mono text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                  Insira a chave recebida no seu e-mail após o envio do vídeo de expressão.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#F97316] hover:bg-orange-600 shadow-md shadow-[#F97316]/25 active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>A validar chave...</span>
                ) : (
                  <>
                    <span>Validar e Aceder a Imagens</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  O acesso de colaborador permite rever e etiquetar os recortes faciais do seu envio.
                </span>
              </div>
            </form>
          )}

          {/* Rodapé de Informação Ética */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Ambiente seguro e em conformidade ética</span>
          </div>

        </div>

        {/* Link de Retorno */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  );
}