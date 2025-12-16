import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, Music, Check, X, Trash2, Search, PlayCircle, Loader2, Copy, Share2, Download, CheckCircle, AlertTriangle, Info, Image as ImageIcon, Link as LinkIcon, Camera, Youtube, ExternalLink } from 'lucide-react';
import { BuilderData, PhotoMode, BackgroundType } from '../../types';
import { PhonePreview } from './PhonePreview';

interface BuilderWizardProps {
  onClose: () => void;
}

const steps = [
  { title: 'Titulo da página', description: 'Escreva o titulo dedicatório para a página.' },
  { title: 'Mensagem', description: 'Escreva uma mensagem especial. Seja criativo e demonstre todo seu carinho.' },
  { title: 'Data de início', description: 'Informe a data de início que simbolize o início de uma união, relacionamento, amizade, etc.' },
  { title: 'Fotos do Casal', description: 'Personalize com fotos especiais. Escolha da galeria ou envie do seu celular.' },
  { title: 'Música dedicada', description: 'Escolha a trilha sonora perfeita para o momento.' },
  { title: 'Animação de fundo', description: 'Escolha uma animação de fundo para a página.' },
  { title: 'Informações de contato', description: 'Preencha as informações de contato para receber o link e o QR Code.' },
  { title: 'Escolha seu plano', description: 'Selecione o plano que melhor atende às suas necessidades.' },
];

// Reliable Unsplash Images
const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80", // Love Hand
  "https://images.unsplash.com/photo-1511285560982-1356c11d4606?w=500&q=80", // Wedding/Couple
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80", // Christmas Lights
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500&q=80", // Couple Snow
  "https://images.unsplash.com/photo-1621800100799-a8685161048f?w=500&q=80", // Hands holding
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=500&q=80", // Sparkler
  "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500&q=80", // Christmas Tree
  "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80"  // Gift
];

// Reliable Audio URLs
const PRESET_MUSIC = [
  { name: "Piano Romântico", url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=christmas-piano-126868.mp3" }, 
  { name: "Jingle Bells (Piano)", url: "https://cdn.pixabay.com/download/audio/2023/11/17/audio_51d28362d2.mp3" },
  { name: "We Wish You a Merry Christmas", url: "https://cdn.pixabay.com/download/audio/2022/11/24/audio_9242502b66.mp3" },
  { name: "Jazz Natalino", url: "https://cdn.pixabay.com/download/audio/2022/12/16/audio_03d6978502.mp3" },
  { name: "Silent Night (Suave)", url: "https://cdn.pixabay.com/download/audio/2023/11/27/audio_730b2c151c.mp3" }
];

export const BuilderWizard: React.FC<BuilderWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BuilderData>({
    title: '',
    message: '',
    date: '',
    photos: [],
    photoMode: 'coverflow',
    music: '',
    musicUrl: '',
    background: 'none',
    email: '',
    selectedPlan: null
  });

  const [customMusicUrl, setCustomMusicUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Photo Input State
  const [photoInputMode, setPhotoInputMode] = useState<'gallery' | 'upload'>('gallery');

  // State for Generation Process
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ url: string; qrCodeUrl: string; warning?: string } | null>(null);

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
        const fullExportData = {
            title: formData.title,
            message: formData.message,
            date: formData.date,
            music: formData.music,
            musicUrl: formData.musicUrl,
            background: formData.background,
            photoMode: formData.photoMode,
            photos: formData.photos
        };

        const jsonString = JSON.stringify(fullExportData);
        const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
        
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
        
        const uniqueUrl = `${origin}${cleanPath}?gift=${encodedData}`;
        
        // Check URL length for QR Code safety
        let qrCodeData = uniqueUrl;
        let warning = undefined;

        if (uniqueUrl.length > 3000) {
            warning = "Atenção: O link ficou muito longo! O QR Code pode demorar para ler. Use menos fotos ou fotos da galeria para otimizar.";
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

  const selectMusic = (music: { name: string, url: string }) => {
    setFormData(prev => ({
        ...prev,
        music: music.name,
        musicUrl: music.url
    }));
    setCustomMusicUrl('');
    setYoutubeUrl('');
  };

  const handleCustomMusic = () => {
      if(!customMusicUrl) return;
      setFormData(prev => ({
          ...prev,
          music: "Música Personalizada",
          musicUrl: customMusicUrl
      }));
      setYoutubeUrl('');
  };

  const handleYoutubeMusic = () => {
    if(!youtubeUrl) return;
    setFormData(prev => ({
        ...prev,
        music: "YouTube Music",
        musicUrl: youtubeUrl
    }));
    setCustomMusicUrl('');
  };

  // --- PHOTO LOGIC ---

  const togglePhoto = (url: string) => {
    const currentPhotos = [...formData.photos];
    if (currentPhotos.includes(url)) {
        updateField('photos', currentPhotos.filter(p => p !== url));
    } else {
        if (currentPhotos.length >= 8) return;
        updateField('photos', [...currentPhotos, url]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateField('photos', newPhotos);
  };

  // CLOUDINARY WIDGET INTEGRATION
  const openCloudinaryWidget = () => {
    if (formData.photos.length >= 8) {
        alert("Você já atingiu o limite de 8 fotos!");
        return;
    }

    const cloudName = "dzi28teuq";
    const uploadPreset = "natal-upload";

    // @ts-ignore
    if (!window.cloudinary) {
        alert("Carregando sistema de upload... aguarde 2 segundos e tente novamente.");
        return;
    }

    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        multiple: true,
        maxFiles: 8 - formData.photos.length,
        sources: ["local", "camera"],
        folder: "presentes-natal",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        language: "pt",
        text: {
           "pt": {
             "menu": { "files": "Meus Arquivos" },
             "local": { "browse": "Selecionar Fotos" },
             "or": "Ou"
           }
        },
        styles: {
            palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#D42426",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#D42426",
                action: "#D42426",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#D42426",
                complete: "#20B832",
                sourceBg: "#E4EBF1"
            }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const url = result.info.secure_url;
          // Add to state if not duplicate
          setFormData(prev => {
             if (prev.photos.includes(url)) return prev;
             return { ...prev, photos: [...prev.photos, url] };
          });
        }
      }
    );

    widget.open();
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
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red outline-none"
            />
          </div>
        );
      case 3: // Photos (Updated)
        return (
          <div className="space-y-6">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setPhotoInputMode('gallery')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${photoInputMode === 'gallery' ? 'bg-white text-christmas-red shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Galeria
                </button>
                <button 
                    onClick={() => setPhotoInputMode('upload')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${photoInputMode === 'upload' ? 'bg-white text-christmas-red shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Enviar Fotos
                </button>
            </div>

            {/* Gallery Content */}
            {photoInputMode === 'gallery' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                        Fotos de alta qualidade perfeitas para o Natal.
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {PRESET_IMAGES.map((url, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => togglePhoto(url)}
                                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${formData.photos.includes(url) ? 'border-christmas-red scale-95' : 'border-transparent hover:border-gray-300'}`}
                            >
                                <img src={url} alt="Preset" className="w-full h-full object-cover" />
                                {formData.photos.includes(url) && (
                                    <div className="absolute inset-0 bg-christmas-red/20 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-white drop-shadow-md" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Content (Cloudinary) */}
            {photoInputMode === 'upload' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-christmas-snow p-4 rounded-xl border border-red-100 text-center space-y-3">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-christmas-red">
                             <Camera className="w-6 h-6" />
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-900 text-sm">Upload Inteligente</h4>
                             <p className="text-xs text-gray-500 mt-1 max-w-[250px] mx-auto">
                                Suas fotos serão otimizadas automaticamente para garantir que o QR Code funcione perfeitamente.
                             </p>
                         </div>
                         
                        <button 
                          onClick={openCloudinaryWidget}
                          className="w-full py-3 bg-gradient-to-r from-christmas-red to-[#ff8fa3] text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Upload className="w-5 h-5" />
                            Enviar fotos do celular
                        </button>
                    </div>
                </div>
            )}
            
            {/* Selected Photos List */}
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
      case 4: // Music (Updated)
        return (
          <div className="space-y-6">
             <label className="block text-sm font-medium text-gray-700">Escolha a Música</label>
             
             {/* Presets */}
             <div className="space-y-2">
                 {PRESET_MUSIC.map((track, idx) => (
                     <button
                        key={idx}
                        onClick={() => selectMusic(track)}
                        className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${
                            formData.music === track.name 
                            ? 'bg-red-50 border-christmas-red ring-1 ring-christmas-red' 
                            : 'bg-white border-gray-200 hover:border-red-200'
                        }`}
                     >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.music === track.name ? 'bg-christmas-red text-white' : 'bg-gray-100 text-gray-400'}`}>
                             {formData.music === track.name ? <Music className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                         </div>
                         <div className="text-left flex-1">
                             <div className={`font-medium ${formData.music === track.name ? 'text-christmas-darkRed' : 'text-gray-900'}`}>{track.name}</div>
                             <div className="text-xs text-gray-500">Música sugerida</div>
                         </div>
                         {formData.music === track.name && <Check className="w-5 h-5 text-christmas-red" />}
                     </button>
                 ))}
             </div>

             <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">LINKS EXTERNOS</span>
                <div className="flex-grow border-t border-gray-300"></div>
             </div>

             {/* Youtube Input */}
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <Youtube className="w-4 h-4 text-red-600" />
                    YouTube (Link do Vídeo)
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-christmas-red outline-none"
                    />
                    <button 
                        onClick={handleYoutubeMusic}
                        className="bg-red-600 text-white px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                        Usar
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    Cole o link do vídeo do YouTube. O áudio tocará no celular.
                </p>
             </div>

             {/* Custom URL */}
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Link do MP3 (Opcional)</label>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="https://exemplo.com/musica.mp3"
                        value={customMusicUrl}
                        onChange={(e) => setCustomMusicUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-christmas-red outline-none"
                    />
                    <button 
                        onClick={handleCustomMusic}
                        className="bg-gray-800 text-white px-4 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                    >
                        Usar
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    Cole um link direto para um arquivo .mp3.
                </p>
             </div>
          </div>
        );
      case 5: // Background
        return (
          <div className="space-y-3">
             {[
               { id: 'none', label: 'Nenhuma' },
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
      case 6: // Contact
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Ex: seu.email@gmail.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red outline-none"
            />
          </div>
        );
      case 7: // Plan
        return (
          <div className="space-y-4">
            <div 
              onClick={() => updateField('selectedPlan', 'lifetime')}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden ${
                formData.selectedPlan === 'lifetime' 
                  ? 'border-christmas-red bg-red-50' 
                  : 'border-gray-200 bg-white hover:border-red-200'
              }`}
            >
              {formData.selectedPlan === 'lifetime' && (
                <div className="absolute top-0 right-0 bg-christmas-red text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                  Selecionado
                </div>
              )}
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold text-christmas-darkRed">Para sempre</h3>
                    <p className="text-xs text-gray-500">Especial de Natal</p>
                 </div>
                 <div className="text-right">
                    <span className="block text-xl font-bold text-gray-900">R$ 27,00</span>
                    <span className="text-xs text-gray-500">/uma vez</span>
                 </div>
              </div>
            </div>

            <div 
              onClick={() => updateField('selectedPlan', 'annual')}
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden ${
                formData.selectedPlan === 'annual' 
                  ? 'border-christmas-red bg-red-50' 
                  : 'border-gray-200 bg-white hover:border-red-200'
              }`}
            >
               {formData.selectedPlan === 'annual' && (
                <div className="absolute top-0 right-0 bg-christmas-red text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                  Selecionado
                </div>
              )}
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold text-gray-800">Anual</h3>
                    <p className="text-xs text-gray-500">Renovação anual</p>
                 </div>
                 <div className="text-right">
                    <span className="block text-xl font-bold text-gray-900">R$ 21,00</span>
                    <span className="text-xs text-gray-500">/ano</span>
                 </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // SUCCESS SCREEN
  if (generatedResult) {
      // ... same success screen code
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
             
             {/* Result Preview - Left Side (Desktop) */}
             <div className="hidden md:flex w-1/2 lg:w-7/12 bg-christmas-darkRed/5 items-center justify-center p-8 relative">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D42426 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8, y: 50 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ duration: 0.8, type: "spring" }}
                 >
                    <PhonePreview data={formData} />
                 </motion.div>
             </div>

             {/* Delivery Details - Right Side */}
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

                         {/* Localhost Warning */}
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

                         {/* QR Code Card */}
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

                         {/* Actions */}
                         <div className="space-y-3 w-full">
                             <div className="flex gap-2">
                                 <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 truncate text-left font-mono">
                                     Link do Presente
                                 </div>
                                 <button 
                                    onClick={() => navigator.clipboard.writeText(generatedResult.url)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 rounded-xl flex items-center justify-center transition-colors active:bg-green-100 active:text-green-700"
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

             {/* Confetti Overlay */}
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
      {/* Left Panel: Inputs */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col h-full bg-white border-r border-gray-100 shadow-xl z-20">
        
        {/* Header */}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
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

               {/* Mobile Preview Section */}
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
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="max-w-md mx-auto flex gap-4">
             <button
               onClick={handlePrev}
               className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
             >
               Voltar etapa
             </button>
             <button
               onClick={handleNext}
               className="flex-1 px-6 py-3 rounded-full bg-christmas-red text-white font-bold hover:bg-christmas-darkRed shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2"
             >
               {currentStep === steps.length - 1 ? 'Finalizar' : 'Próxima etapa'}
               {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Preview (Desktop) */}
      <div className="hidden md:flex flex-1 bg-christmas-snow items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D42426 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         <div className="absolute top-20 right-20 w-64 h-64 bg-christmas-gold/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-20 left-20 w-96 h-96 bg-christmas-red/10 rounded-full blur-3xl"></div>

        <PhonePreview data={formData} />
      </div>
    </div>
  );
};