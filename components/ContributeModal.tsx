'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Lock, 
  Mail, 
  Send, 
  Camera, 
  StopCircle, 
  Video as VideoIcon,
  Clock
} from 'lucide-react';
import { 
  ModalBaseProps, 
  UniversalEmotion, 
  UNIVERSAL_EMOTIONS, 
  ContributionStep 
} from '../types';

export const ContributeModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<ContributionStep>('select_emotion');
  const [selectedEmotion, setSelectedEmotion] = useState<UniversalEmotion>('alegria');
  
  const [inputMode, setInputMode] = useState<'record' | 'upload'>('record');

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  
  const [userEmail, setUserEmail] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // E-mail confirmado retornado pela API
  const [confirmedEmail, setConfirmedEmail] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    stopCameraStream();
    setStep('select_emotion');
    setVideoFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl(null);
    setUserEmail('');
    setConfirmedEmail('');
    setConsentGiven(false);
    setErrorMessage(null);
    setInputMode('record');
    onClose();
  };

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch {
      setErrorMessage('Não foi possível acessar a câmera. Verifique as permissões do seu navegador.');
    }
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    setErrorMessage(null);

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: mimeType });
      const file = new File([blob], `expressao_${selectedEmotion}_${Date.now()}.webm`, {
        type: mimeType,
      });
      setVideoFile(file);
      const url = URL.createObjectURL(blob);
      setVideoPreviewUrl(url);
      stopCameraStream();
    };

    recorder.start();
    setIsRecording(true);
    setRecordingSeconds(0);

    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 4) {
          stopRecording();
          return 5;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMessage('Por favor, selecione um arquivo de vídeo válido.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('O arquivo de vídeo deve ter no máximo 50MB.');
      return;
    }

    setErrorMessage(null);
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
  };

  const handleNextStep = () => {
    if (step === 'select_emotion') {
      setStep('upload_video');
    } else if (step === 'upload_video') {
      if (!videoFile) {
        setErrorMessage('Grave ou selecione um vídeo antes de prosseguir.');
        return;
      }
      stopCameraStream();
      setErrorMessage(null);
      setStep('consent');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail.trim() || !userEmail.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido para receber a confirmação.');
      return;
    }

    if (!consentGiven || !videoFile) {
      setErrorMessage('É necessário aceitar os termos de consentimento para enviar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('selected_emotion', selectedEmotion);
      formData.append('consent_version', 'v1.0-2026');
      formData.append('email', userEmail.trim().toLowerCase());

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.grimcoach.com.br';
      const response = await fetch(`${apiUrl}/api/v1/enviar-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detailMsg = typeof errorData?.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData?.detail);
        throw new Error(detailMsg || `Erro no servidor: ${response.status}`);
      }

      const data = await response.json();
      
      // Resposta esperada: {"status": "recebido", "email": email}
      setConfirmedEmail(data?.email || userEmail.trim().toLowerCase());
      setStep('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na comunicação com a API.';
      setErrorMessage(`${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEmotionDetails = UNIVERSAL_EMOTIONS.find((e) => e.id === selectedEmotion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Ajude-nos a Melhorar o GrimCoach</h2>
              <p className="text-xs text-slate-500 font-medium">Envio de Vídeo para o Dataset</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicador de Passos */}
        {step !== 'success' && (
          <div className="grid grid-cols-3 border-b border-slate-100 bg-white text-xs font-semibold text-center">
            <div className={`py-2.5 border-b-2 transition-all ${step === 'select_emotion' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-slate-400'}`}>
              1. Emoção
            </div>
            <div className={`py-2.5 border-b-2 transition-all ${step === 'upload_video' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-slate-400'}`}>
              2. Vídeo
            </div>
            <div className={`py-2.5 border-b-2 transition-all ${step === 'consent' ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-slate-400'}`}>
              3. Dados & Termo
            </div>
          </div>
        )}

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PASSO 1: Seleção da Emoção */}
          {step === 'select_emotion' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Qual expressão você deseja demonstrar?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecione a expressão conforme os parâmetros do sistema FACS.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {UNIVERSAL_EMOTIONS.map((emotion) => {
                  const isSelected = selectedEmotion === emotion.id;
                  return (
                    <button
                      key={emotion.id}
                      type="button"
                      onClick={() => setSelectedEmotion(emotion.id)}
                      className={`p-3 rounded-2xl text-left border text-sm transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#4F46E5] bg-indigo-50/70 text-[#4F46E5] ring-2 ring-[#4F46E5]/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="font-bold capitalize">{emotion.label}</span>
                      <span className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                        {emotion.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedEmotionDetails && (
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs space-y-1.5">
                  <span className="font-bold text-[#0F172A] block">
                    Action Units (AUs) de {selectedEmotionDetails.label}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmotionDetails.actionUnits.map((au, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium text-[11px]">
                        {au}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSO 2: Câmera ou Upload de Arquivo */}
          {step === 'upload_video' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Expressão: <span className="text-[#4F46E5] capitalize">{selectedEmotion}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Grave um clipe de 3 a 5 segundos ou faça upload de um arquivo.
                  </p>
                </div>

                {!videoFile && (
                  <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        stopCameraStream();
                        setInputMode('record');
                      }}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        inputMode === 'record' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Gravar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopCameraStream();
                        setInputMode('upload');
                      }}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        inputMode === 'upload' ? 'bg-white text-[#4F46E5] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Arquivo</span>
                    </button>
                  </div>
                )}
              </div>

              {videoFile ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-56 mx-auto border border-slate-200 shadow-inner flex items-center justify-center">
                    {videoPreviewUrl && (
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-slate-600 font-medium truncate max-w-[260px]">
                      {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
                        setVideoPreviewUrl(null);
                      }}
                      className="text-[#4F46E5] font-semibold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Gravar ou escolher outro
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {inputMode === 'record' && (
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video max-h-56 mx-auto border border-slate-800 flex items-center justify-center">
                        <video
                          ref={liveVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
                        />

                        {!isCameraActive && (
                          <div className="text-center p-6 space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto">
                              <VideoIcon className="w-6 h-6" />
                            </div>
                            <p className="text-xs text-slate-300 font-medium">
                              Sua câmera será usada apenas para gravar esta expressão.
                            </p>
                            <button
                              type="button"
                              onClick={startCamera}
                              className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                            >
                              <Camera className="w-4 h-4" />
                              <span>Ativar Câmera</span>
                            </button>
                          </div>
                        )}

                        {isRecording && (
                          <div className="absolute top-3 left-3 bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white text-xs font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-white" />
                            <span>Gravando ({recordingSeconds}s / 5s)</span>
                          </div>
                        )}
                      </div>

                      {isCameraActive && (
                        <div className="flex items-center justify-center gap-3">
                          {!isRecording ? (
                            <button
                              type="button"
                              onClick={startRecording}
                              className="px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-[#F97316]/20 flex items-center gap-2 active:scale-95"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-white" />
                              <span>Começar Gravação (5s)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
                            >
                              <StopCircle className="w-4 h-4" />
                              <span>Parar e Salvar</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {inputMode === 'upload' && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#4F46E5] bg-[#F8FAFC] hover:bg-indigo-50/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#4F46E5] group-hover:scale-110 transition-all">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 mt-3 group-hover:text-[#4F46E5]">
                          Clique para escolher o vídeo do dispositivo
                        </p>
                        <p className="text-xs text-slate-400 mt-1">MP4, WebM ou MOV (máx. 50MB)</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* PASSO 3: E-mail e Termo */}
          {step === 'consent' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#4F46E5]" />
                  <span>Dados de Contato e Termo Ético</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Processaremos os frames do vídeo em segundo plano e enviaremos o acesso ao seu e-mail.
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="user-email" className="block text-xs font-bold text-slate-700">
                  Seu e-mail para receber a chave de avaliação:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="user-email"
                    type="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 text-sm text-[#0F172A] placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600 space-y-2.5 max-h-40 overflow-y-auto leading-relaxed">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5 pb-1 border-b border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Finalidade e Proteção de Dados (GrimCoach)</span>
                </div>
                <p>
                  <strong>1. Destinação:</strong> O vídeo será utilizado para alimentação da base do projeto GrimCoach voltado à habilitação no autismo (TEA).
                </p>
                <p>
                  <strong>2. Processamento Assíncrono:</strong> Os frames serão recortados e normalizados pelo backend. A chave de validação gerada será enviada diretamente para o e-mail informado.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#4F46E5] rounded border-slate-300 focus:ring-[#4F46E5]"
                />
                <span className="text-xs font-semibold text-[#0F172A] leading-snug">
                  Concordo com os termos e autorizo o processamento do vídeo para a pesquisa do GrimCoach.
                </span>
              </label>
            </div>
          )}

          {/* SUCESSO: Notificação de envio para o e-mail */}
          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#10B981] animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0F172A]">Vídeo Recebido com Sucesso!</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  O vídeo da expressão <span className="font-bold text-[#4F46E5] capitalize">{selectedEmotion}</span> entrou na fila de processamento da nossa API.
                </p>
              </div>

              {/* Bloco de Notificação de Espera no E-mail */}
              <div className="w-full max-w-md p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 text-left space-y-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">
                      Aguarde a chave no seu e-mail
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assim que a extração e padronização das faces forem concluídas, você receberá a <strong>chave de acesso</strong> e as orientações para avaliar as imagens em:
                    </p>
                    <p className="text-xs font-bold text-[#4F46E5] mt-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                      {confirmedEmail || userEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Isso costuma levar poucos minutos. Verifique também sua caixa de spam.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 active:scale-95"
              >
                Entendido, Fechar Janela
              </button>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        {step !== 'success' && (
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between">
            {step === 'select_emotion' ? (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  if (step === 'upload_video') setStep('select_emotion');
                  if (step === 'consent') setStep('upload_video');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                Voltar
              </button>
            )}

            {step !== 'consent' ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-indigo-700 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Avançar
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting || !consentGiven || !userEmail.trim()}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#F97316] hover:bg-orange-600 shadow-md shadow-[#F97316]/25 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando para a API...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Vídeo</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};