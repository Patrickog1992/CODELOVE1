import React, { useEffect, useState } from 'react';
import { PhonePreview } from './builder/PhonePreview';
import { BuilderData } from '../types';
import { Heart, PlayCircle } from 'lucide-react';
import { SnowEffect } from './SnowEffect';

interface GiftViewerProps {
  data: Partial<BuilderData>;
}

export const GiftViewer: React.FC<GiftViewerProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Reconstruct full BuilderData with defaults for missing fields
  const fullData: BuilderData = {
    title: data.title || "Um Presente Especial",
    message: data.message || "",
    date: data.date || new Date().toISOString(),
    photos: data.photos || [], // Photos might be empty via URL due to size limits
    photoMode: data.photoMode || 'coverflow',
    music: data.music || "",
    background: data.background || 'none',
    email: "",
    selectedPlan: null
  };

  return (
    <div className="min-h-screen bg-christmas-darkRed flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <SnowEffect />
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#F8B229 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="z-10 w-full max-w-md mx-auto flex flex-col items-center">
        <div className="mb-6 text-white font-bold text-xl flex items-center gap-2 animate-pulse">
            <Heart className="fill-white text-white" />
            <span>Alguém criou isso para você</span>
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