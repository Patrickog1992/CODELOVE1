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
  { title: 'Titulo da página', description: 'Escreva o titulo dedicatório para a página.' },
  { title: 'Mensagem', description: 'Escreva uma mensagem especial. Seja criativo e demonstre todo seu carinho.' },
  { title: 'Data de início', description: 'Informe a data de início que simbolize o início de uma união, relacionamento, amizade, etc.' },
  { title: 'Fotos de Natal', description: 'Personalize com fotos especiais. Envie fotos do seu celular ou computador.' },
  { title: 'Escolha uma música', description: 'Selecione a trilha sonora perfeita para o seu presente.' },
  { title: 'Animação de fundo', description: 'Escolha uma animação de fundo para a página.' },
  { title: 'Finalizar', description: 'Tudo pronto! Gere seu presente gratuitamente.' },
];

// Provided Music List
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
  
  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize form data, potentially merging with restored data from localStorage
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
    selectedPlan: initialData?.selectedPlan || null
  });

  // Music Preview State
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Parse date for selectors if exists
  const parseDate = (dateString: string) => {
      if(!dateString) return { day: '', month: '', year: '' };
      const parts = dateString.split('-');
      return parts.length === 3 ? { year: parts[0], month: parts[1], day: parts[2] } : { day: '', month: '', year: '' };
  };

  const [dateParts, setDateParts] = useState(parseDate(formData.date));

  // Update formData.date whenever parts change
  useEffect(() => {
    if (dateParts.day && dateParts.month && dateParts.year) {
        const isoDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
        setFormData(prev => ({ ...prev, date: isoDate }));
    }
  }, [dateParts]);
  
  // Auto-scroll to top when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  // Custom Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Generation Process
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ url: string; qrCodeUrl: string; warning?: string } | null>(null);

  // --- AUTO START EFFECT (When returning from payment) ---
  useEffect(() => {
      if (startFinished) {
          finishWizard();
      }
  }, [startFinished]);

  // Handle preview audio
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
        
        let qrCodeData = uniqueUrl;
        let warning = undefined;

        if (uniqueUrl.length > 2000) {
            warning = "Atenção: O link ficou longo. Algumas fotos podem não aparecer em leitores de QR antigos. Recomendamos usar menos fotos ou fotos da galeria.";
        }

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeData)}&color=D42426&bgcolor=ffffff&margin=10`;

        setGeneratedResult({
            url: uniqueUrl,
            qrCodeUrl: qrCodeUrl,
            warning: warning
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


  // --- PHOTO LOGIC ---

  const removePhoto = (index: number) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateField('photos', newPhotos);
  };

  // --- CUSTOM UPLOAD LOGIC ---
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
      case 0: // Title
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
      case 1: // Message
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
      case 2: // Date
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
            <p className="text-xs text-gray-500">Selecione o dia, mês e ano.</p>
          </div>
        );
      case 3: // Photos (Updated to Upload Only)
        return (
          <div className="space-y-6">
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
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
            
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Efeito de transição</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {id: 'coverflow', label: 'Deslizar'},
                  {id: 'cube', label: 'Cubo 3D'},
                  {id: 'cards', label: 'Baralho'},
                  {id: 'flip', label: 'Girar'}
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateField('photoMode', mode.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all border ${
                      formData.photoMode === mode.id
                        ? 'bg-christmas-red text-white border-christmas-red'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4: // Music (Updated List)
        return (
          <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700">Escolha uma música especial</label>
             {/* Alterado para Grid/Lista vertical sem scroll interno fixo, permitindo rolagem da página */}
             <div className="grid grid-cols-1 gap-2">
                 {MUSIC_OPTIONS.map((track) => {
                     const isSelected = formData.musicUrl === track.url;
                     const isPlaying = playingPreview === track.url;

                     return (
                         <div 
                            key={track.id}
                            onClick={() => handleMusicSelect(track)}
                            // Compactado: p-2, tamanhos reduzidos
                            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-red-50 border-christmas-red ring-1 ring-christmas-red' : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                         >
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-christmas-red text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Music className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold truncate ${isSelected ? 'text-christmas-darkRed' : 'text-gray-700'}`}>
                                        {track.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400">Faixa {track.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button 
                                    onClick={(e) => togglePreview(track.url, e)}
                                    className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                </button>
                                {isSelected && <CheckCircle className="w-4 h-4 text-christmas-red" />}
                            </div>
                         </div>
                     )
                 })}
             </div>
             
             <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100 mt-2">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="opacity-90 leading-relaxed">
                       A música tocará no player do presente somente quando a pessoa der play.
                    </p>
                </div>
             </div>
          </div>
        );
      case 5: // Background
        return (
          <div className="space-y-3">
             {[
               { id: 'none', label: 'Nenhuma' },
               { id: 'trees', label: 'Chuva de Árvores de Natal 🎄' },
               { id: 'hearts', label: 'Chuva de corações ❤️' },
               { id: 'stars_comets', label: 'Céu Estrelado com Cometas 🌠' },
               { id: 'stars_meteors', label: 'Céu Estrelado com Meteoros 🌌' },
               { id: 'aurora', label: 'Aurora Boreal ✨' },
               { id: 'vortex', label: 'Vórtice de cores 🌀' },
               { id: 'clouds', label: 'Nuvens ☁️' },
             ].map((bg) => (
               <button
                 key={bg.id}
                 onClick={() => updateField('background', bg.id)}
                 className={`w-full text-left px-5 py-3 rounded-xl transition-all border flex items-center justify-between ${
                   formData.background === bg.id
                     ? 'bg-christmas-snow border-christmas-red text-christmas-darkRed font-semibold'
                     : 'bg-white border-gray-100 hover:bg-gray-50'
                 }`}
               >
                 {bg.label}
                 {formData.background === bg.id && <Check className="w-5 h-5 text-christmas-red" />}
               </button>
             ))}
          </div>
        );
      case 6: // Finalize (Now Free)
        return (
          <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Presente de Natal</h3>
                  <p className="text-gray-600 mb-6">
                      Seu QR Code romântico será gerado gratuitamente. 
                      Aproveite para surpreender quem você ama!
                  </p>
                  <button
                      onClick={finishWizard}
                      className="w-full py-4 rounded-xl font-bold text-lg bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 animate-pulse-scale"
                  >
                      🎁 Gerar Presente Grátis
                  </button>
              </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ... (Rest of component remains the same)
  // SUCCESS SCREEN
  if (generatedResult) {
      // ... same success screen code ...
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
             {/* Same Success Screen Content */}
             <div className="hidden md:flex w-1/2 lg:w-7/12 bg-christmas-darkRed/5 items-center justify-center p-8 relative">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D42426 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8, y: 50 }}
                   animate={{ 
                       opacity: 1, 
                       scale: 1, 
                       y: [0, -15, 0] // Floating animation
                   }}
                   transition={{ 
                       opacity: { duration: 0.8, ease: "easeOut" },
                       scale: { duration: 0.8, ease: "easeOut" },
                       y: { 
                          duration: 6, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          times: [0, 0.5, 1] 
                       }
                   }}
                 >
                    <PhonePreview data={formData} />
                 </motion.div>
             </div>

             <div className="w-full md:w-1/2 lg:w-5/12 bg-white flex flex-col h-full overflow-y-auto">
                 <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                     
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: 0.2 }}
                       className="w-full max-w-sm"
                     >
                         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                         </div>
                         
                         <h2 className="text-3xl font-bold text-gray-900 mb-2">Presente Pronto! 🎁</h2>
                         <p className="text-gray-500 mb-6 leading-relaxed">
                             Seu presente foi gerado. Os dados da música e imagens estão salvos no link.
                         </p>

                         {isLocalhost && (
                             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                                 <div className="flex items-start gap-3">
                                     <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                     <div>
                                         <h4 className="font-bold text-yellow-800 text-sm">Atenção: Você está em Localhost</h4>
                                         <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                                             O QR Code abaixo aponta para o seu computador. Para funcionar no celular, publique o site (Deploy).
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         )}

                         <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-6 transform transition-transform hover:scale-105 duration-300">
                             <img src={generatedResult.qrCodeUrl} alt="QR Code" className="w-full aspect-square object-contain mb-4 rounded-lg" />
                             <div className="flex items-center justify-center gap-2 text-xs font-bold text-christmas-red uppercase tracking-widest bg-red-50 py-2 rounded-lg">
                                🎅 Edição Especial de Natal
                             </div>
                         </div>
                         
                         {generatedResult.warning && (
                            <div className="text-xs text-orange-600 mb-6 bg-orange-50 p-3 rounded-lg border border-orange-200 text-left leading-relaxed">
                                <strong>Nota Importante:</strong> {generatedResult.warning}
                            </div>
                         )}

                         <div className="space-y-3 w-full">
                             <div className="flex gap-2 cursor-pointer group" onClick={() => navigator.clipboard.writeText(generatedResult.url)}>
                                 <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm font-bold text-christmas-red truncate text-left font-mono uppercase tracking-wide group-hover:bg-red-50 transition-colors flex items-center">
                                     CLIQUE E COPIE O LINK DO PRESENTE
                                 </div>
                                 <button 
                                    className="bg-gray-100 group-hover:bg-red-100 text-gray-700 group-hover:text-red-700 px-4 rounded-xl flex items-center justify-center transition-all active:scale-95"
                                    title="Copiar Link"
                                 >
                                     <Copy className="w-5 h-5" />
                                 </button>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-2">
                                 <a 
                                    href={generatedResult.qrCodeUrl} 
                                    download="qrcode-natal.png"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-christmas-red text-white font-bold py-4 rounded-xl hover:bg-christmas-darkRed flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all hover:-translate-y-1 text-sm"
                                 >
                                     <Download className="w-4 h-4" /> Baixar Imagem
                                 </a>
                                 
                                 <a 
                                     href={generatedResult.qrCodeUrl}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-black flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-1 text-sm"
                                 >
                                     <ExternalLink className="w-4 h-4" /> Link QR Code
                                 </a>
                             </div>
                             
                             <button className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all hover:-translate-y-1">
                                 <Share2 className="w-5 h-5" /> Enviar no WhatsApp
                             </button>

                             <button onClick={onClose} className="block w-full py-4 text-gray-400 text-sm hover:text-gray-600 transition-colors">
                                 Criar outro presente
                             </button>
                         </div>
                     </motion.div>
                 </div>
             </div>

             <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-gold-500 z-50"></div>
        </div>
      )
  }

  // LOADING SCREEN
  if (isGenerating) {
      return (
          <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-[60]">
               <div className="w-16 h-16 border-4 border-christmas-red border-t-transparent rounded-full animate-spin mb-6"></div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Empacotando seu presente...</h3>
               <p className="text-gray-500 text-center max-w-md">
                   Estamos gerando um link único e criando seu QR Code exclusivo de Natal.
               </p>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col h-full bg-white border-r border-gray-100 shadow-xl z-20">
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
             <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
               <X className="w-5 h-5" />
             </button>
             <span className="font-bold text-christmas-darkRed tracking-tight">CODELOVE</span>
          </div>
          <div className="text-sm font-medium text-gray-500">
             {currentStep + 1}/{steps.length}
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
               className="max-w-md mx-auto"
             >
               <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
               <p className="text-gray-500 mb-8 leading-relaxed">{steps[currentStep].description}</p>
               
               {renderStepContent()}

               <div className="md:hidden mt-12 border-t border-gray-100 pt-8 pb-4">
                  <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
                    <span>📱</span> Veja como está ficando
                  </p>
                  <div className="flex justify-center">
                     <div className="transform scale-[0.85] sm:scale-90 origin-top">
                        <PhonePreview data={formData} />
                     </div>
                  </div>
               </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4 pb-4">
                     <button
                       onClick={handlePrev}
                       className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                     >
                       Voltar etapa
                     </button>
                     {currentStep < steps.length - 1 && (
                         <button
                           onClick={handleNext}
                           className="flex-1 px-6 py-3 rounded-full bg-christmas-red text-white font-bold hover:bg-christmas-darkRed shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2"
                         >
                           Próxima etapa
                           <ArrowRight className="w-4 h-4" />
                         </button>
                     )}
                </div>

             </motion.div>
           </AnimatePresence>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-christmas-snow items-center justify-center p-8 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D42426 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         <div className="absolute top-20 right-20 w-64 h-64 bg-christmas-gold/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-20 left-20 w-96 h-96 bg-christmas-red/10 rounded-full blur-3xl"></div>

        <PhonePreview data={formData} />
      </div>
    </div>
  );
}