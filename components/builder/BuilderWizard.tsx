import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, Music, Check, X, Trash2, Search, PlayCircle, Loader2, Copy, Share2, Download, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { BuilderData, PhotoMode, BackgroundType } from '../../types';
import { PhonePreview } from './PhonePreview';

interface BuilderWizardProps {
  onClose: () => void;
}

const steps = [
  { title: 'Titulo da página', description: 'Escreva o titulo dedicatório para a página.' },
  { title: 'Mensagem', description: 'Escreva uma mensagem especial. Seja criativo e demonstre todo seu carinho.' },
  { title: 'Data de início', description: 'Informe a data de início que simbolize o início de uma união, relacionamento, amizade, etc.' },
  { title: 'Fotos', description: 'Anexe fotos e escolha o modo de exibição para personalizar a página.' },
  { title: 'Música dedicada', description: 'Busque a música perfeita para o momento. A música será reproduzida automaticamente na página.' },
  { title: 'Animação de fundo', description: 'Escolha uma animação de fundo para a página.' },
  { title: 'Informações de contato', description: 'Preencha as informações de contato para receber o link e o QR Code.' },
  { title: 'Escolha seu plano', description: 'Selecione o plano que melhor atende às suas necessidades.' },
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
    background: 'none',
    email: '',
    selectedPlan: null
  });

  // State for Generation Process
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ url: string; qrCodeUrl: string; warning?: string } | null>(null);

  // Music Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Logic to generate unique Gift URL and QR Code
  const finishWizard = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
        // Create the payload for the URL
        // OPTIMIZATION: Shorten keys to reduce URL size if possible, or just keep as is.
        // NOTE: Photos are excluded because base64 images are too huge for QR codes/URL params without a database.
        const exportData = {
            t: formData.title, // shortened key
            m: formData.message,
            d: formData.date,
            mu: formData.music,
            bg: formData.background,
            pm: formData.photoMode,
            // photos: [] -> Intentionally omitted
        };

        // Standard JSON stringify (keys are now shorter to help with size)
        // We need to map these back in App.tsx if we shorten them, 
        // BUT for simplicity in this demo, let's keep full keys or handle mapping in viewer.
        // Let's stick to full keys to ensure compatibility with existing Viewer logic, 
        // but be mindful of length.
        
        const fullExportData = {
            title: formData.title,
            message: formData.message,
            date: formData.date,
            music: formData.music,
            background: formData.background,
            photoMode: formData.photoMode,
        };

        const jsonString = JSON.stringify(fullExportData);
        const encodedData = btoa(unescape(encodeURIComponent(jsonString)));
        
        // Construct the URL
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        // Remove trailing slash if exists to be clean
        const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
        
        const uniqueUrl = `${origin}${cleanPath}?gift=${encodedData}`;
        
        // QR Code Generation
        // API Limit Check: 
        // qrserver API via GET fails around ~2000 chars. 
        // If uniqueUrl is huge, we warn the user.
        
        let qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(uniqueUrl)}&color=D42426&bgcolor=ffffff&margin=10`;
        let warning = undefined;

        if (uniqueUrl.length > 1800) {
           // Fallback: Generate QR code with LESS data so it renders, but Link has full data
           // We create a "lite" version for the QR code just so it looks nice
           const liteData = { ...fullExportData, message: "Mensagem completa no link..." };
           const liteEncoded = btoa(unescape(encodeURIComponent(JSON.stringify(liteData))));
           const liteUrl = `${origin}${cleanPath}?gift=${liteEncoded}`;
           qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(liteUrl)}&color=D42426&bgcolor=ffffff&margin=10`;
           warning = "Sua mensagem é muito longa para o QR Code. O QR Code abrirá uma versão resumida, mas o Link Copiado contém tudo!";
        }

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

  // Music Search Simulation
  const handleMusicSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        setSearchResults([
          `${query} - Original Mix`,
          `${query} - Acoustic Version`,
          `Best of ${query}`,
          `Cover of ${query}`
        ]);
      }, 800);
    } else {
      setSearchResults([]);
    }
  };

  const selectMusic = (musicName: string) => {
    updateField('music', musicName);
    setSearchQuery(musicName);
    setSearchResults([]);
  };

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const promises = Array.from(files).slice(0, 8).map(file => {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file as Blob);
        });
    });

    Promise.all(promises).then(images => {
        updateField('photos', images);
    });
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateField('photos', newPhotos);
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
              placeholder="Ex: João & Maria ou Feliz Aniversário"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red focus:border-transparent outline-none transition-all"
              maxLength={40}
            />
            <p className="text-xs text-gray-500">Evite usar acentos ou caracteres especiais. Use apenas letras, números e espaços.</p>
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
              maxLength={1200}
            />
            <div className="text-right text-xs text-gray-400">{formData.message.length}/1200</div>
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
            <p className="text-xs text-gray-500">Preencha no formato: dia/mês/ano.</p>
          </div>
        );
      case 3: // Photos
        return (
          <div className="space-y-6">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept="image/*"
            />
            
            <div 
              onClick={handlePhotoUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-christmas-red transition-all group"
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-christmas-red" />
              <p className="text-sm text-gray-600 font-medium">
                {formData.photos.length > 0 ? `${formData.photos.length} fotos selecionadas` : 'Clique para adicionar fotos'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, GIF (máx. 8 fotos)</p>
            </div>

            {formData.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                    {formData.photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                            <img src={photo} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removePhoto(index)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Modo de mostrar</label>
              <div className="grid grid-cols-2 gap-3">
                {(['coverflow', 'cube', 'cards', 'flip'] as PhotoMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateField('photoMode', mode)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition-all border ${
                      formData.photoMode === mode
                        ? 'bg-christmas-red text-white border-christmas-red shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-christmas-red/50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4: // Music
        return (
          <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700">Música (Nome ou Artista)</label>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleMusicSearch(e.target.value)}
                  placeholder="Ex: Coldplay - Sky full of stars"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-christmas-red outline-none"
                />
                {isSearching && (
                   <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-christmas-red border-t-transparent rounded-full animate-spin"></div>
                   </div>
                )}
             </div>

             {searchResults.length > 0 && (
               <div className="bg-white border border-gray-100 rounded-xl shadow-lg divide-y divide-gray-50 overflow-hidden">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => selectMusic(result)}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 transition-colors group"
                    >
                       <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-christmas-red group-hover:text-white transition-colors">
                          <PlayCircle className="w-5 h-5" />
                       </div>
                       <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{result}</span>
                    </button>
                  ))}
               </div>
             )}

             {formData.music && !isSearching && searchResults.length === 0 && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-2 text-green-700 text-sm">
                   <Check className="w-4 h-4" />
                   Música selecionada: <strong>{formData.music}</strong>
                </div>
             )}
             
             <p className="text-xs text-gray-500">A música selecionada será reproduzida automaticamente quando a página for aberta.</p>
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
            <p className="text-xs text-gray-500">Enviaremos o link e o QR Code para este e-mail.</p>
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
              <ul className="text-xs space-y-1 text-gray-600 mb-2">
                 <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> Vitalício (não expira)</li>
                 <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> QR Code exclusivo</li>
                 <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> Todas as animações</li>
              </ul>
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
              <ul className="text-xs space-y-1 text-gray-500">
                 <li className="flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> Válido por 1 ano</li>
                 <li className="flex items-center gap-1"><X className="w-3 h-3 text-red-400" /> Sem memórias especiais</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // SUCCESS SCREEN
  if (generatedResult) {
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
                             Seu presente foi gerado. Como não temos um servidor, <strong>todos os dados estão salvos no link abaixo</strong>.
                         </p>

                         {/* Localhost Warning */}
                         {isLocalhost && (
                             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                                 <div className="flex items-start gap-3">
                                     <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                     <div>
                                         <h4 className="font-bold text-yellow-800 text-sm">Atenção: Você está em Localhost</h4>
                                         <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
                                             O QR Code abaixo aponta para o seu computador. Se você escanear com o celular, <strong>não vai abrir</strong>. Para testar o QR Code real, você precisa publicar este site.
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
                            <div className="text-xs text-orange-500 mb-6 bg-orange-50 p-2 rounded-lg border border-orange-100">
                                {generatedResult.warning}
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
                             
                             <a 
                                href={generatedResult.qrCodeUrl} 
                                download="qrcode-natal.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-christmas-red text-white font-bold py-4 rounded-xl hover:bg-christmas-darkRed flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all hover:-translate-y-1"
                             >
                                 <Download className="w-5 h-5" /> Baixar QR Code
                             </a>
                             
                             <button className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all hover:-translate-y-1">
                                 <Share2 className="w-5 h-5" /> Enviar no WhatsApp
                             </button>

                             <button onClick={onClose} className="block w-full py-4 text-gray-400 text-sm hover:text-gray-600 transition-colors">
                                 Criar outro presente
                             </button>
                             
                             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2 text-left">
                                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-600">
                                    <strong>Nota Técnica:</strong> Como não usamos banco de dados, as fotos enviadas não são salvas no QR Code (apenas textos e configurações) para que o código funcione.
                                </p>
                             </div>
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