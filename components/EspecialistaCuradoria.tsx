'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Save, 
  Info, 
  X, 
  RefreshCw,
  Award
} from 'lucide-react';
import { UNIVERSAL_EMOTIONS, UniversalEmotion } from '@/types';
import { ExpressionIntensityLevel, INTENSITY_LEVELS } from '@/types/expressions';

export interface SpecialistFaceRecord {
  id: string;
  url: string;
  emocao_final: UniversalEmotion;
  nivel_final: ExpressionIntensityLevel;
  aprovada_para_app: boolean;
  desativada: boolean;
  origem_email?: string;
}

const INITIAL_MOCK_DATA: SpecialistFaceRecord[] = [
  {
    id: 'spec-1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'alegria',
    nivel_final: 2,
    aprovada_para_app: false,
    desativada: false,
    origem_email: 'participante1@gmail.com',
  },
  {
    id: 'spec-2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'surpresa',
    nivel_final: 1,
    aprovada_para_app: false,
    desativada: false,
    origem_email: 'participante2@gmail.com',
  },
  {
    id: 'spec-3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'raiva',
    nivel_final: 3,
    aprovada_para_app: true,
    desativada: false,
    origem_email: 'participante3@gmail.com',
  },
  {
    id: 'spec-4',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&h=512&q=80',
    emocao_final: 'tristeza',
    nivel_final: 4,
    aprovada_para_app: true,
    desativada: false,
    origem_email: 'participante4@gmail.com',
  },
];

export default function EspecialistaCuradoria() {
  const [faces, setFaces] = useState<SpecialistFaceRecord[]>(INITIAL_MOCK_DATA);
  const [filterEmotion, setFilterEmotion] = useState<string>('todas');
  const [filterStatus, setFilterStatus] = useState<'todas' | 'pendentes' | 'aprovadas'>('todas');
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [faceToDelete, setFaceToDelete] = useState<SpecialistFaceRecord | null>(null);

  const handleToggleAppApproval = (id: string) => {
    setFaces((prev) =>
      prev.map((f) => (f.id === id ? { ...f, aprovada_para_app: !f.aprovada_para_app } : f))
    );
    setModifiedIds((prev) => new Set(prev).add(id));
  };

  const handleChangeEmotion = (id: string, newEmotion: UniversalEmotion) => {
    setFaces((prev) =>
      prev.map((f) => (f.id === id ? { ...f, emocao_final: newEmotion } : f))
    );
    setModifiedIds((prev) => new Set(prev).add(id));
  };

  const handleChangeLevel = (id: string, newLevel: ExpressionIntensityLevel) => {
    setFaces((prev) =>
      prev.map((f) => (f.id === id ? { ...f, nivel_final: newLevel } : f))
    );
    setModifiedIds((prev) => new Set(prev).add(id));
  };

  const confirmDelete = () => {
    if (!faceToDelete) return;
    setFaces((prev) =>
      prev.map((f) => (f.id === faceToDelete.id ? { ...f, desativada: true } : f))
    );
    setModifiedIds((prev) => new Set(prev).add(faceToDelete.id));
    setFaceToDelete(null);
  };

  const handleSaveBatch = async () => {
    if (modifiedIds.size === 0) return;
    setIsSaving(true);

    try {
      await new Promise((res) => setTimeout(res, 800));
      setModifiedIds(new Set());
      setFeedbackMsg('Curadoria sincronizada com sucesso.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch {
      alert('Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeFaces = faces.filter((f) => !f.desativada);
  const displayedFaces = activeFaces.filter((f) => {
    const matchEmotion = filterEmotion === 'todas' ? true : f.emocao_final === filterEmotion;
    const matchStatus =
      filterStatus === 'todas'
        ? true
        : filterStatus === 'aprovadas'
        ? f.aprovada_para_app
        : !f.aprovada_para_app;
    return matchEmotion && matchStatus;
  });

  const pendingCount = activeFaces.filter((f) => !f.aprovada_para_app).length;
  const approvedCount = activeFaces.filter((f) => f.aprovada_para_app).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-[#4F46E5]" />
              Auditoria e Liberação de Expressões
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#10B981] text-xs font-bold">
              {approvedCount} no App
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Validação de Action Units (FACS), ajuste de intensidade (1 a 4) e autorização para o treino.
          </p>
        </div>

        <button
          onClick={handleSaveBatch}
          disabled={modifiedIds.size === 0 || isSaving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
            modifiedIds.size > 0
              ? 'bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-indigo-500/25 ring-2 ring-indigo-400/40'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sincronizando...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>
                {modifiedIds.size > 0
                  ? `Publicar Alterações (${modifiedIds.size})`
                  : 'Nenhuma alteração pendente'}
              </span>
            </>
          )}
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span>Status:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full">
            <button
              type="button"
              onClick={() => setFilterStatus('todas')}
              className={`flex-1 py-1 rounded-lg transition-all ${filterStatus === 'todas' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-slate-500'}`}
            >
              Todas ({activeFaces.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('pendentes')}
              className={`flex-1 py-1 rounded-lg transition-all ${filterStatus === 'pendentes' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-500'}`}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('aprovadas')}
              className={`flex-1 py-1 rounded-lg transition-all ${filterStatus === 'aprovadas' ? 'bg-white text-[#10B981] shadow-xs' : 'text-slate-500'}`}
            >
              Aprovadas ({approvedCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Emoção:</span>
          <select
            value={filterEmotion}
            onChange={(e) => setFilterEmotion(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#0F172A] bg-[#F8FAFC] outline-none focus:border-[#4F46E5]"
          >
            <option value="todas">Todas as Emoções</option>
            {UNIVERSAL_EMOTIONS.map((em) => (
              <option key={em.id} value={em.id}>{em.label}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-end">
          Exibindo <strong>{displayedFaces.length}</strong> recortes faciais
        </div>
      </div>

      {/* Grid das Imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedFaces.map((face) => {
          const isModified = modifiedIds.has(face.id);
          const currentIntensity = INTENSITY_LEVELS.find((lvl) => lvl.level === face.nivel_final);

          return (
            <div
              key={face.id}
              className={`rounded-3xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                face.aprovada_para_app 
                  ? 'border-emerald-300 ring-2 ring-emerald-500/15' 
                  : isModified 
                  ? 'border-indigo-400 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200'
              }`}
            >
              <div className="relative aspect-square w-full bg-slate-900 overflow-hidden group">
                <img
                  src={face.url}
                  alt={`Face ${face.emocao_final}`}
                  width={512}
                  height={512}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <button
                  type="button"
                  onClick={() => handleToggleAppApproval(face.id)}
                  className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
                    face.aprovada_para_app
                      ? 'bg-[#10B981] text-white hover:bg-emerald-600'
                      : 'bg-slate-900/80 hover:bg-emerald-600 text-white backdrop-blur-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{face.aprovada_para_app ? 'Aprovada no App' : 'Liberar para App'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFaceToDelete(face)}
                  title="Desativar imagem"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-500 hover:text-white text-slate-600 shadow-md flex items-center justify-center transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {face.origem_email && (
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded-md truncate max-w-[200px]">
                    {face.origem_email}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3.5 bg-white">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between">
                    <span>Emoção FACS</span>
                    {isModified && (
                      <span className="text-[10px] text-[#4F46E5] font-bold">Modificado</span>
                    )}
                  </label>
                  <select
                    value={face.emocao_final}
                    onChange={(e) => handleChangeEmotion(face.id, e.target.value as UniversalEmotion)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-[#F8FAFC] text-[#0F172A] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none"
                  >
                    {UNIVERSAL_EMOTIONS.map((em) => (
                      <option key={em.id} value={em.id}>{em.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-500 uppercase">Intensidade:</span>
                    <span className="font-extrabold text-[#4F46E5]">
                      {currentIntensity?.label} (Nvl {face.nivel_final})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1">
                    {INTENSITY_LEVELS.map((lvl) => {
                      const isSelected = face.nivel_final === lvl.level;
                      return (
                        <button
                          key={lvl.level}
                          type="button"
                          onClick={() => handleChangeLevel(face.id, lvl.level)}
                          className={`py-1.5 px-1 rounded-xl text-[11px] font-bold text-center transition-all truncate ${
                            isSelected
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
          <Info className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[#0F172A]">Nenhum recorte encontrado com esses filtros.</h3>
        </div>
      )}

      {/* Modal de Exclusão */}
      {faceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Desativar Expressão?</h3>
                <p className="text-xs text-slate-500">A imagem não será mais catalogada para os treinos.</p>
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
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md active:scale-95 transition-all"
              >
                Confirmar Desativação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}