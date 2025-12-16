import React, { useEffect, useState } from 'react';
import { PhonePreview } from './builder/PhonePreview';
import { BuilderData } from '../types';
import { Heart, PlayCircle, Gift } from 'lucide-react';
import { SnowEffect } from './SnowEffect';

interface GiftViewerProps {
  data: Partial<BuilderData>;
}

export const GiftViewer: React.FC<GiftViewerProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Reconstruct full BuilderData with defaults for missing fields
  const fullData: BuilderData = {
    title: data.title || "Um Presente Especial",
    message: data.message || "",
    date: data.date || new Date().toISOString(),
    photos: data.photos || [], // Now containing URLs if selected from presets
    photoMode: data.photoMode || 'coverflow',
    music: data.music || "",
    musicUrl: data.musicUrl || "",
    background: data.background || 'none',
    email: "",
    selectedPlan: null
  };

  if (!isOpen) {
      return (
          <div className="min-h-screen bg-christmas-darkRed flex flex-col items-center justify-center p-4 relative overflow-hidden">
               {/* Decorative Background */}
              <div className="absolute inset-0 pointer-events-none">
                <SnowEffect />
              </div>
              
              <div className="z-10 text-center animate-in fade-in zoom-in duration-700">
                  <div className="w-24 h-24 bg-christmas-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce cursor-pointer" onClick={() => setIsOpen(true)}>
                      <Gift className="w-12 h-12 text-christmas-darkRed" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Você recebeu um presente!</h1>
                  <p className="text-white/80 mb-8">Alguém especial preparou uma surpresa para você.</p>
                  
                  <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-white text-christmas-red font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                  >
                      <PlayCircle className="w-5 h-5" />
                      Abrir Presente
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-christmas-darkRed flex flex-col items-center justify-center p-4 relative overflow-hidden animate-in fade-in duration-1000">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <SnowEffect />
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#F8B229 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="z-10 w-full max-w-md mx-auto flex flex-col items-center">
        <div className="mb-6 text-white font-bold text-xl flex items-center gap-2 animate-pulse">
            <Heart className="fill-white text-white" />
            <span>Feito com amor</span>
        </div>

        <div className="transform scale-100 sm:scale-105 transition-transform duration-500">
           <PhonePreview data={fullData} />
        </div>

        <div className="mt-8 text-center text-white/60 text-xs">
            Feito com <Heart className="inline w-3 h-3 mx-1 text-red-400 fill-red-400" /> via CODELOVE
        </div>
        
        <a href="/" className="mt-4 text-white/40 text-xs hover:text-white underline transition-colors">
            Crie o seu também
        </a>
      </div>
    </div>
  );
};