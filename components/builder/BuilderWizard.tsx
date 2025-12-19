import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, Music, Check, X, Trash2, Search, PlayCircle, Loader2, Copy, Share2, Download, CheckCircle, AlertTriangle, Info, Image as ImageIcon, Link as LinkIcon, Camera, Youtube, ExternalLink, ImagePlus, CloudLightning, Play, Pause } from 'lucide-react';
import { BuilderData, PhotoMode, BackgroundType } from '../../types';
import { PhonePreview } from './PhonePreview';

interface BuilderWizardProps {
  onClose: () => void;
  initialData?: Partial<BuilderData>;
  startFinished?: boolean;
}

const steps = [
  { title: 'Título da página', description: 'Escreva o título dedicatório para a página.' },
  { title: 'Mensagem', description: 'Escreva uma mensagem especial. Seja criativo e demonstre todo seu carinho.' },
  { title: 'Data de início', description: 'Informe a data de início que simbolize o início de uma união, relacionamento, amizade, etc.' },
  { title: 'Fotos de Natal', description: 'Personalize com fotos especiais. Envie fotos do seu celular ou computador.' },
  { title: 'Escolha uma música', description: 'Selecione a trilha sonora perfeita para o seu presente.' },
  { title: 'Animação de fundo', description: 'Escolha uma animação de fundo para a página.' },
];

const MUSIC_OPTIONS = [
  { id: 1, name: "Melodia Natalina 1", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/01%20Faixa%201.mp3" },
  { id: 2, name: "Melodia Natalina 2", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/02%20Faixa%202.mp3" },
  { id: 3, name: "Melodia Natalina 3", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/03%20Faixa%203.mp3" },
  { id: 4, name: "Melodia Natalina 4", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/04%20Faixa%204.mp3" },
  { id: 5, name: "Melodia Natalina 5", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/05%20Faixa%205.mp3" },
  { id: 6, name: "Melodia Natalina 6", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/06%20Faixa%206.mp3" },
  { id: 7, name: "Melodia Natalina 7", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/07%20Faixa%207.mp3" },
  { id: 8, name: "Melodia Natalina 8", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/08%20Faixa%208.mp3" },
  { id: 9, name: "Melodia Natalina 9", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/09%20Faixa%209.mp3" },
  { id: 10, name: "Melodia Natalina 10", url: "https://ia902805.us.archive.org/11/items/10-faixa-10_202512/10%20Faixa%2010.mp3" },
];

export const BuilderWizard: React.FC<BuilderWizardProps> = ({ onClose, initialData, startFinished = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<BuilderData>({
    title: initialData?.title || '',
    message: initialData?.message || '',
    date: initialData?.date || '',
    photos: initialData?.photos || [],
    photoMode: initialData?.photoMode || 'coverflow',
    music: initialData?.music || '',
    musicUrl: initialData?.musicUrl || '',
    background: initialData?.background || 'none',
    email: initialData?.email || '',
    selectedPlan: 'lifetime' // Default para plano grátis eterno
  });

  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const parseDate = (dateString: string) => {
      if(!dateString) return { day: '', month: '', year: '' };
      const parts = dateString.split('-');
      return parts.length === 3 ? { year: parts[0], month: parts[1], day: parts[2] } : { day: '', month: '', year: '' };
  };

  const [dateParts, setDateParts] = useState(parseDate(formData.date));

  useEffect(() => {
    if (dateParts.day && dateParts.month && dateParts.year) {
        const isoDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
        setFormData(prev => ({ ...prev, date: isoDate }));
    }
  }, [dateParts]);
  
  useEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ url: string; qrCodeUrl: string; warning?: string } | null>(null);

  useEffect(() => {
      if (startFinished) {
          finishWizard();
      }
  }, [startFinished]);

  useEffect(() => {
    if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
    }
    
    if (playingPreview) {
        const audio = new Audio(playingPreview);
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Preview error", e));
        audio.onended = () => setPlayingPreview(null);
        audioPreviewRef.current = audio;
    }

    return () => {
        if (audioPreviewRef.current) {
            audioPreviewRef.current.pause();
        }
    };
  }, [playingPreview]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      finishWizard();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
    else onClose();
  };

  const finishWizard = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
        const compressedData = {
            t: formData.title,
            m: formData.message,
            d: formData.date,
            mu: formData.music,      
            muu: formData.musicUrl,
            bg: formData.background,
            pm: formData.photoMode,
            p: formData.photos       
        };

        const jsonString = JSON.stringify(compressedData);
        const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
        
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
        
        const uniqueUrl = `${origin}${cleanPath}?gift=${encodedData}`;
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(uniqueUrl)}&color=D42426&bgcolor=ffffff&margin=10`;

        setGeneratedResult({
            url: uniqueUrl,
            qrCodeUrl: qrCodeUrl,
            warning: uniqueUrl.length > 2000 ? "O link ficou longo. Algumas fotos podem não aparecer em leitores antigos." : undefined
        });
        setIsGenerating(false);
    }, 2000);
  };

  const updateField = (field: keyof BuilderData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMusicSelect = (music: { name: string, url: string }) => {
     setFormData(prev => ({
         ...prev,
         music: music.name,
         musicUrl: music.url
     }));
  };

  const togglePreview = (url: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (playingPreview === url) {
          setPlayingPreview(null);
      } else {
          setPlayingPreview(url);
      }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateField('photos', newPhotos);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const filesArray = Array.from(files) as File[];
      const remainingSlots = 8 - formData.photos.length;

      if (filesArray.length > remainingSlots) {
          alert(`Você só pode adicionar mais ${remainingSlots} fotos.`);
          return;
      }

      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of filesArray) {
          if (!file.type.startsWith('image/')) continue;

          const uploadData = new FormData();
          uploadData.append('file', file);
          uploadData.append('upload_preset', 'natal-upload');
          uploadData.append('folder', 'presentes-natal');

          try {
              const response = await fetch('https://api.cloudinary.com/v1_1/dzi28teuq/image/upload', {
                  method: 'POST',
                  body: uploadData
              });
              
              const data = await response.json();
              if (data.secure_url) {
                  uploadedUrls.push(data.secure_url);
              }
          } catch (err) {
              console.error("Network error uploading", err);
          }
      }

      if (uploadedUrls.length > 0) {
          setFormData(prev => ({
              ...prev,
              photos: [...prev.photos, ...uploadedUrls]
          }));
      }

      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ex: João & Maria"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent outline-none transition-all"
              maxLength={40}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <textarea
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              className="w-full h-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent outline-none transition-all resize-none"
              maxLength={500} 
            />
            <div className="text-right text-xs text-gray-400">{formData.message.length}/500</div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Data de Início</label>
            <div className="flex gap-2">
                <select 
                    className="w-1/3 px-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red outline-none bg-white text-sm"
                    value={dateParts.day}
                    onChange={(e) => setDateParts({...dateParts, day: e.target.value})}
                >
                    <option value="">Dia</option>
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                        <option key={d} value={d.toString().padStart(2, '0')}>{d}</option>
                    ))}
                </select>
                <select 
                    className="w-1/3 px-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red outline-none bg-white text-sm"
                    value={dateParts.month}
                    onChange={(e) => setDateParts({...dateParts, month: e.target.value})}
                >
                    <option value="">Mês</option>
                    {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((m, i) => (
                        <option key={i} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                    ))}
                </select>
                <select 
                    className="w-1/3 px-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red outline-none bg-white text-sm"
                    value={dateParts.year}
                    onChange={(e) => setDateParts({...dateParts, year: e.target.value})}
                >
                    <option value="">Ano</option>
                    {Array.from({length: 60}, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden" 
                    accept="image/*"
                    multiple
                />
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative border-2 border-dashed border-red-200 bg-red-50 hover:bg-red-100 transition-colors rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer min-h-[160px] ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                      {isUploading ? (
                          <div className="flex flex-col items-center animate-pulse">
                              <Loader2 className="w-10 h-10 text-christmas-red animate-spin mb-3" />
                              <p className="text-sm font-bold text-christmas-red">Enviando fotos...</p>
                          </div>
                      ) : (
                          <>
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                <ImagePlus className="w-7 h-7 text-christmas-red" />
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm">Toque para adicionar fotos</h4>
                            <p className="text-xs text-gray-500 mt-1 max-w-[200px] text-center">
                                Escolha da sua galeria. (Máx 8 fotos)
                            </p>
                          </>
                      )}
                </div>
            </div>
            
            {formData.photos.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Fotos Selecionadas ({formData.photos.length}/8)</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                         {formData.photos.map((photo, index) => (
                            <div key={index} className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden group shadow-sm bg-gray-100">
                                <img src={photo} className="w-full h-full object-cover" alt="Selected" />
                                <button 
                                    onClick={() => removePhoto(index)}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4 text-white" />
                                </button>
                            </div>
                         ))}
                    </div>
                </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
             <div className="grid grid-cols-1 gap-2">
                 {MUSIC_OPTIONS.map((track) => {
                     const isSelected = formData.musicUrl === track.url;
                     return (
                         <div 
                            key={track.id}
                            onClick={() => handleMusicSelect(track)}
                            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-red-50 border-christmas-red ring-1 ring-christmas-red' : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                         >
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-christmas-red text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Music className="w-4 h-4" />
                                </div>
                                <p className={`text-sm font-semibold truncate ${isSelected ? 'text-christmas-darkRed' : 'text-gray-700'}`}>
                                    {track.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => togglePreview(track.url, e)} className="p-1.5 rounded-full hover:bg-black/5">
                                    {playingPreview === track.url ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                {isSelected && <CheckCircle className="w-4 h-4 text-christmas-red" />}
                            </div>
                         </div>
                     )
                 })}
             </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-3">
             {[
               { id: 'none', label: 'Nenhuma' },
               { id: 'trees', label: 'Chuva de Árvores de Natal 🎄' },
               { id: 'hearts', label: 'Chuva de corações ❤️' },
               { id: 'stars_comets', label: 'Céu Estrelado 🌠' },
               { id: 'aurora', label: 'Aurora Boreal ✨' },
             ].map((bg) => (
               <button
                 key={bg.id}
                 onClick={() => updateField('background', bg.id)}
                 className={`w-full text-left px-5 py-3 rounded-xl transition-all border flex items-center justify-between ${
                   formData.background === bg.id ? 'bg-christmas-snow border-christmas-red text-christmas-darkRed' : 'bg-white border-gray-100'
                 }`}
               >
                 {bg.label}
                 {formData.background === bg.id && <Check className="w-5 h-5 text-christmas-red" />}
               </button>
             ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (generatedResult) {
      return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
             <div className="hidden md:flex w-1/2 lg:w-7/12 bg-christmas-darkRed/5 items-center justify-center p-8 relative">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D42426 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                 <PhonePreview data={formData} />
             </div>
             <div className="w-full md:w-1/2 lg:w-5/12 bg-white flex flex-col h-full overflow-y-auto">
                 <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                     </div>
                     <h2 className="text-3xl font-bold text-gray-900 mb-2">Presente Pronto! 🎁</h2>
                     <p className="text-gray-500 mb-6">Seu presente foi gerado gratuitamente.</p>
                     <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6">
                         <img src={generatedResult.qrCodeUrl} alt="QR Code" className="w-full aspect-square object-contain mb-4 rounded-lg" />
                         <div className="text-xs font-bold text-christmas-red uppercase tracking-widest bg-red-50 py-2 rounded-lg">🎅 Grátis para Sempre</div>
                     </div>
                     <div className="space-y-3 w-full max-w-sm">
                         <button onClick={() => navigator.clipboard.writeText(generatedResult.url)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-christmas-red truncate uppercase tracking-wide flex items-center justify-between">
                            <span>COPIAR LINK DO PRESENTE</span>
                            <Copy className="w-4 h-4" />
                         </button>
                         <a href={generatedResult.qrCodeUrl} download className="w-full bg-christmas-red text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"><Download className="w-4 h-4" /> Baixar QR Code</a>
                         <button onClick={onClose} className="w-full py-4 text-gray-400 text-sm hover:text-gray-600">Criar outro presente</button>
                     </div>
                 </div>
             </div>
        </div>
      )
  }

  if (isGenerating) {
      return (
          <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8">
               <div className="w-16 h-16 border-4 border-christmas-red border-t-transparent rounded-full animate-spin mb-6"></div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Empacotando seu presente...</h3>
               <p className="text-gray-500 text-center">Gerando seu QR Code exclusivo de Natal gratuitamente.</p>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col h-full bg-white border-r border-gray-100 shadow-xl z-20">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X className="w-5 h-5" /></button>
             <span className="font-bold text-christmas-darkRed">CODELOVE</span>
          </div>
          <div className="text-sm font-medium text-gray-500">{currentStep + 1}/{steps.length}</div>
        </div>
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-10">
           <AnimatePresence mode="wait">
             <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto">
               <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
               <p className="text-gray-500 mb-8">{steps[currentStep].description}</p>
               {renderStepContent()}
                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                     <button onClick={handlePrev} className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium">Voltar</button>
                     <button onClick={handleNext} className="flex-1 px-6 py-3 rounded-full bg-green-600 text-white font-bold animate-pulse-scale flex items-center justify-center gap-2">
                       {currentStep === steps.length - 1 ? 'Gerar Presente Grátis' : 'Próxima etapa'}
                       <ArrowRight className="w-4 h-4" />
                     </button>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
      <div className="hidden md:flex flex-1 bg-christmas-snow items-center justify-center p-8 relative overflow-hidden">
        <PhonePreview data={formData} />
      </div>
    </div>
  );
}