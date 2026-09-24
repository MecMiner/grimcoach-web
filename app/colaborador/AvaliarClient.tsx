'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Trash2, 
  KeyRound, 
  Layers, 
  Filter, 
  ArrowLeft,
  Lock,
  Save,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UNIVERSAL_EMOTIONS, UniversalEmotion } from '@/types';
import { ExpressionIntensityLevel, INTENSITY_LEVELS } from '@/types/expressions';

export interface GeneratedFace {
  id: string;
  url: string;
  emocao_final: UniversalEmotion;
  nivel_final: ExpressionIntensityLevel;
  aprovada_para_app: boolean;
  desativada: boolean;
}

interface AvaliarClientProps {
  initialFaces: GeneratedFace[];
  accessKey: string;
  // Ação de servidor passada como prop
  onSaveBatchAction: (accessKey: string, payload: GeneratedFace[]) => Promise<{ success: boolean }>;
}

export function AvaliarClient({ initialFaces, accessKey, onSaveBatchAction }: AvaliarClientProps) {
  const [faces, setFaces] = useState<GeneratedFace[]>(initialFaces);
  const [filterEmotion, setFilterEmotion] = useState<string>('todas');
  const [modifiedFaceIds, setModifiedFaceIds] = useState<Set<string>>(new Set());
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [faceToDelete, setFaceToDelete] = useState<GeneratedFace | null>(null);

  const handleChangeEmotion = (id: string, newEmotion: UniversalEmotion) => {
    setFaces((prev) =>
      prev.map((face) => (face.id === id ? { ...face, emocao_final: newEmotion } : face))
    );
    setModifiedFaceIds((prev) => new Set(prev).add(id));
  };

  const handleChangeNivel = (id: string, newNivel: ExpressionIntensityLevel) => {
    setFaces((prev) =>
      prev.map((face) => (face.id === id ? { ...face, nivel_final: newNivel } : face))
    );
    setModifiedFaceIds((prev) => new Set(prev).add(id));
  };

  const confirmDelete = () => {
    if (!faceToDelete) return;
    setFaces((prev) =>
      prev.map((face) => (face.id === faceToDelete.id ? { ...face, desativada: true } : face))
    );
    setModifiedFaceIds((prev) => new Set(prev).add(faceToDelete.id));
    setFaceToDelete(null);
  };

  // Dispara a requisição pelo Servidor Next.js
  const handleSaveBatch = async () => {
    if (modifiedFaceIds.size === 0) return;

    setIsSaving(true);
    setSaveSuccessMsg(null);

    const payload = faces.filter((face) => modifiedFaceIds.has(face.id));

    try {
      const res = await onSaveBatchAction(accessKey, payload);
      if (res.success) {
        setModifiedFaceIds(new Set());
        setSaveSuccessMsg(`${payload.length} alteração(ões) gravada(s) com sucesso no servidor.`);
        setTimeout(() => setSaveSuccessMsg(null), 3500);
      }
    } catch {
      alert('Falha ao comunicar com o servidor interno.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeFaces = faces.filter((face) => !face.desativada);
  const displayedFaces = activeFaces.filter((face) => 
    filterEmotion === 'todas' ? true : face.emocao_final === filterEmotion
  );
  const hasPendingChanges = modifiedFaceIds.size > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Topo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#4F46E5] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Login</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Painel de Curadoria do Colaborador
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F97316] text-xs font-bold">
              Imagens 512×512
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Validação protegida e processada diretamente pelo servidor Next.js.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Chave:</span>
            <span className="font-mono font-bold text-[#0F172A] truncate max-w-[130px]">
              {accessKey}
            </span>
          </div>

          <button
            onClick={handleSaveBatch}
            disabled={!hasPendingChanges || isSaving}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              hasPendingChanges
                ? 'bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-indigo-500/25 ring-2 ring-indigo-400/40'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gravando via Servidor...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>
                  {hasPendingChanges
                    ? `Salvar Alterações (${modifiedFaceIds.size})`
                    : 'Sem alterações pendentes'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Orientações */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-all">
        <div 
          onClick={() => setShowGuide(!showGuide)}
          className="p-4 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Orientações para Avaliação das Imagens
              </h3>
              <p className="text-[11px] text-slate-500">
                Instruções sobre os 4 níveis de intensidade e o sistema FACS.
              </p>
            </div>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-700">
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showGuide && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-4 bg-[#F8FAFC]/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 p-3 rounded-2xl bg-white border border-slate-200/80">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" /> 1. Validação da Emoção
                </span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Confira se a expressão capturada realmente corresponde à emoção indicada pelo sistema FACS.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-2xl bg-white border border-slate-200/80">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#10B981]" /> 2. Imagens Aprovadas
                </span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Imagens com o selo verde já estão ativas no app e não podem ser alteradas.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Escala de Intensidade (4 Níveis):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INTENSITY_LEVELS.map((lvl) => (
                  <div key={lvl.level} className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-black text-[#4F46E5] block text-xs">
                      Nível {lvl.level} • {lvl.label}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      {lvl.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filtrar por Emoção:</span>
          <select
            value={filterEmotion}
            onChange={(e) => setFilterEmotion(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] bg-[#F8FAFC] outline-none focus:border-[#4F46E5]"
          >
            <option value="todas">Todas as Emoções</option>
            {UNIVERSAL_EMOTIONS.map((em) => (
              <option key={em.id} value={em.id}>
                {em.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Exibindo <strong>{displayedFaces.length}</strong> de <strong>{activeFaces.length}</strong> faces ativas
        </div>
      </div>

      {/* Grid de Imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedFaces.map((face) => {
          const isModified = modifiedFaceIds.has(face.id);
          const currentIntensity = INTENSITY_LEVELS.find((lvl) => lvl.level === face.nivel_final);

          return (
            <div
              key={face.id}
              className={`rounded-3xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isModified 
                  ? 'border-indigo-400 ring-2 ring-indigo-500/20' 
                  : face.aprovada_para_app 
                    ? 'border-emerald-200 ring-2 ring-emerald-500/10' 
                    : 'border-slate-200'
              }`}
            >
              <div className="relative aspect-square w-full bg-slate-900 overflow-hidden group">
                <img
                  src={face.url}
                  alt={`Face de ${face.emocao_final} nível ${face.nivel_final}`}
                  width={512}
                  height={512}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {face.aprovada_para_app ? (
                  <div className="absolute top-3 left-3 bg-[#10B981] text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprovada no App</span>
                  </div>
                ) : isModified ? (
                  <div className="absolute top-3 left-3 bg-[#4F46E5] text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md">
                    Modificado
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-slate-200 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-slate-700">
                    Em Validação
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setFaceToDelete(face)}
                  title="Desativar imagem"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-500 hover:text-white text-slate-600 shadow-md flex items-center justify-center transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Controles */}
              <div className="p-4 space-y-3.5 bg-white">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between">
                    <span>Emoção Final</span>
                    {face.aprovada_para_app && (
                      <span className="text-[10px] text-[#10B981] flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </span>
                    )}
                  </label>
                  
                  <select
                    disabled={face.aprovada_para_app}
                    value={face.emocao_final}
                    onChange={(e) => handleChangeEmotion(face.id, e.target.value as UniversalEmotion)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      face.aprovada_para_app
                        ? 'bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed'
                        : 'bg-[#F8FAFC] text-[#0F172A] border-slate-200 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]'
                    }`}
                  >
                    {UNIVERSAL_EMOTIONS.map((em) => (
                      <option key={em.id} value={em.id}>
                        {em.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-500 uppercase">Intensidade:</span>
                    <span className="font-extrabold text-[#4F46E5]">
                      {currentIntensity?.label} (Nível {face.nivel_final})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1">
                    {INTENSITY_LEVELS.map((lvl) => {
                      const isSelected = face.nivel_final === lvl.level;
                      return (
                        <button
                          key={lvl.level}
                          type="button"
                          disabled={face.aprovada_para_app}
                          onClick={() => handleChangeNivel(face.id, lvl.level)}
                          title={`${lvl.label}: ${lvl.description}`}
                          className={`py-1.5 px-1 rounded-xl text-[11px] font-bold text-center transition-all truncate ${
                            face.aprovada_para_app
                              ? isSelected 
                                ? 'bg-emerald-100 text-[#10B981] border border-emerald-200 cursor-not-allowed'
                                : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                              : isSelected
                                ? 'bg-[#4F46E5] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {displayedFaces.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">Nenhuma imagem encontrada</h3>
        </div>
      )}

      {/* Modal Profissional de Desativação */}
      {faceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Desativar Imagem?</h3>
                  <p className="text-xs text-slate-500">O recorte será marcado como pendente de exclusão.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFaceToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl flex items-center gap-3.5">
              <img
                src={faceToDelete.url}
                alt="Miniatura"
                className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-2xs shrink-0"
              />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#0F172A] capitalize">
                  Expressão: {faceToDelete.emocao_final}
                </div>
                <div className="text-slate-500">
                  Intensidade: Nível {faceToDelete.nivel_final}
                </div>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold inline-block border border-amber-200">
                  Ação confirmada ao salvar alterações
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFaceToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 active:scale-95 transition-all"
              >
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}