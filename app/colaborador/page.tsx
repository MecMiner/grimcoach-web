import React from 'react';
import Link from 'next/link';
import { Smile, AlertTriangle } from 'lucide-react';
import { AvaliarClient, GeneratedFace } from './AvaliarClient';
import Logo from '@/components/Logo';

// URL interna da API (não use NEXT_PUBLIC_ para manter oculta do navegador)
const BACKEND_INTERNAL_API = process.env.BACKEND_INTERNAL_API || 'http://localhost:8000';

// Mock de fallback para desenvolvimento
const INITIAL_FACES_MOCK: GeneratedFace[] = [
  {
    id: 'face-1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'alegria',
    nivel_final: 2,
    aprovada_para_app: true,
    desativada: false,
  },
  {
    id: 'face-2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'surpresa',
    nivel_final: 1,
    aprovada_para_app: false,
    desativada: false,
  },
  {
    id: 'face-3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'raiva',
    nivel_final: 3,
    aprovada_para_app: false,
    desativada: false,
  },
  {
    id: 'face-4',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'tristeza',
    nivel_final: 4,
    aprovada_para_app: true,
    desativada: false,
  },
];

// 1. Busca os dados no servidor Next.js
async function getFacesByAccessKey(accessKey: string): Promise<GeneratedFace[]> {
  try {
    // Comunicação direta entre servidores:
    // const res = await fetch(`${BACKEND_INTERNAL_API}/api/v1/imagens?access_key=${encodeURIComponent(accessKey)}`, {
    //   cache: 'no-store'
    // });
    // if (!res.ok) throw new Error('Falha ao buscar imagens');
    // return await res.json();

    return INITIAL_FACES_MOCK;
  } catch (err) {
    console.error('Erro na busca das faces:', err);
    return INITIAL_FACES_MOCK;
  }
}

// 2. SERVER ACTION: O cliente chama essa função, e o Next.js repassa para o FastAPI por trás dos panos
async function saveBatchAction(accessKey: string, payload: GeneratedFace[]) {
  'use server';

  try {
    // const res = await fetch(`${BACKEND_INTERNAL_API}/api/v1/imagens/lote?access_key=${encodeURIComponent(accessKey)}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // if (!res.ok) throw new Error('Erro ao salvar no backend');

    console.log(`[Server Action] Salvo lote de ${payload.length} itens para a chave: ${accessKey}`);
    return { success: true };
  } catch (error) {
    console.error('Erro no salvamento em lote:', error);
    return { success: false };
  }
}

// Página como Server Component assíncrono
export default async function AvaliarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const rawKey = resolvedParams.chave;
  const accessKey = typeof rawKey === 'string' ? rawKey : '';

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo/>
          <span className="text-xs font-bold text-slate-400">Curadoria Server-Side</span>
        </div>
      </header>

      {!accessKey ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">Chave de Acesso Ausente</h2>
          <p className="text-xs text-slate-500 max-w-sm">
            Você precisa fornecer uma chave de acesso válida na URL para carregar os recortes faciais.
          </p>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            Ir para a Página de Login
          </Link>
        </div>
      ) : (
        <AvaliarClient 
          initialFaces={await getFacesByAccessKey(accessKey)} 
          accessKey={accessKey}
          onSaveBatchAction={saveBatchAction}
        />
      )}
    </main>
  );
}