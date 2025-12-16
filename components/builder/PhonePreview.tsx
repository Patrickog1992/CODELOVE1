import React, { useRef, useEffect, useState } from 'react';
import { BuilderData } from '../../types';
import { SnowEffect } from '../SnowEffect';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Music } from 'lucide-react';

interface PhonePreviewProps {
  data: BuilderData;
}

// Helper to extract YouTube ID
const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const PhonePreview: React.FC<PhonePreviewProps> = ({ data }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const youtubeId = getYoutubeId(data.musicUrl || '');
  const isYoutube = !!youtubeId;

  // Auto-play audio when mounted or when URL changes
  useEffect(() => {
    setIsPlaying(false); // Reset state on change
    
    if (isYoutube) {
        // YouTube autoplay is restricted by browsers, but we set state to be ready
        // Real autoplay needs user interaction usually
        setIsPlaying(true); 
    } else if (audioRef.current && data.musicUrl) {
        audioRef.current.volume = 0.5;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.log("Audio autoplay prevented by browser policy");
            setIsPlaying(false);
          });
        }
    }
  }, [data.musicUrl, isYoutube]);

  // Effect to control YouTube iframe via postMessage
  useEffect(() => {
    if (!isYoutube || !iframeRef.current) return;

    const command = isPlaying ? 'playVideo' : 'pauseVideo';
    try {
        iframeRef.current.contentWindow?.postMessage(JSON.stringify({
            event: 'command',
            func: command,
            args: []
        }), '*');
    } catch(e) {
        console.warn("YouTube control error", e);
    }
  }, [isPlaying, isYoutube]);


  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isYoutube) {
        setIsPlaying(!isPlaying);
        return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handle Photo Navigation
  const photos = data.photos && data.photos.length > 0 ? data.photos : ['https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500&q=80'];
  
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };
  
  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Helper to render background OVERLAYS (not replacing the background)
  const renderBackgroundEffects = () => {
    switch (data.background) {
      case 'hearts':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
             {/* Generate fixed hearts with robust animation */}
             {[...Array(15)].map((_, i) => (
               <div key={i} className="absolute text-red-500 animate-heart-rain" style={{
                 left: `${(i * 7) + Math.random() * 5}%`,
                 top: '-20px',
                 fontSize: `${Math.random() * 20 + 20}px`,
                 animationDuration: `${Math.random() * 2 + 3}s`,
                 animationDelay: `${Math.random() * 2}s`,
                 opacity: 0.8
               }}>❤️</div>
             ))}
          </div>
        );
      case 'stars_comets':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {/* Transparent overlay to make stars pop slightly */}
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div> 
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent animate-comet shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{
                top: `${Math.random() * 70}%`,
                left: '-100px',
                animationDuration: `${Math.random() * 3 + 4}s`,
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
        );
      case 'stars_meteors':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
             <div className="absolute inset-0 bg-black/50 mix-blend-multiply"></div>
             {[...Array(50)].map((_, i) => (
               <div key={i} className="absolute bg-white rounded-full animate-twinkle shadow-[0_0_5px_white]" style={{
                 width: Math.random() > 0.5 ? '2px' : '4px',
                 height: Math.random() > 0.5 ? '2px' : '4px',
                 top: `${Math.random() * 100}%`,
                 left: `${Math.random() * 100}%`,
                 animationDuration: `${Math.random() * 3 + 1}s`,
                 opacity: Math.random()
               }}></div>
             ))}
          </div>
        );
      case 'aurora':
        return (
           <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
             <div className="absolute inset-0 opacity-60 animate-aurora mix-blend-overlay filter blur-[40px]" 
                  style={{ background: 'linear-gradient(45deg, #00ff87, #60efff, #0061ff, #ff00ff)' }}>
             </div>
           </div>
        );
      case 'vortex':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slow opacity-40 mix-blend-color-dodge"
                  style={{ background: 'conic-gradient(from 0deg, #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8, #fb07d9, #ff0000)' }}>
             </div>
          </div>
        );
      case 'clouds':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
             {/* Use CSS gradients to simulate clouds moving if image fails, or reliable SVG data uri */}
             <div className="absolute inset-0 animate-cloud-scroll" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 560 200' preserveAspectRatio='xMidYMid slice'%3E%3Cpath d='M112.5 70c-26 0-47.5 21-47.5 47s21.5 47 47.5 47c6 0 11.5-1.5 16.5-4 5 16.5 20.5 29 38.5 29 22 0 40-18 40-40 0-3-.5-6-1.5-8.5 3-1 6-1.5 9-1.5 16.5 0 30-13.5 30-30 0-14.5-10.5-26.5-24.5-29-2.5-19.5-19-34.5-39-34.5-16.5 0-30.5 10.5-36 25-5.5-1-11-1.5-16.5-1.5-2.5 0-5 .5-7.5 1z' fill='white' fill-opacity='0.5'/%3E%3Cpath d='M392.5 50c-33 0-60 27-60 60s27 60 60 60c7.5 0 14.5-1.5 21-4.5 6.5 21 26 36.5 49 36.5 27.5 0 50-22.5 50-50 0-4-1-8-2-11.5 4-1 8-2 12-2 22 0 40-18 40-40 0-19.5-14-35.5-32.5-39-3-24.5-24-43.5-49.5-43.5-20.5 0-38.5 13-45.5 31.5-6.5-1.5-13.5-2-20.5-2-3 0-6 .5-9.5 1.5z' fill='white' fill-opacity='0.4' transform='translate(-50, 20)'/%3E%3C/svg%3E")`,
                    backgroundSize: '150% auto',
                    backgroundRepeat: 'repeat-x',
                    opacity: 0.8
                  }}>
             </div>
          </div>
        );
      case 'none':
      default:
        return <SnowEffect />;
    }
  };

  // Render Image based on Photo Mode
  const renderPhotoImage = () => {
    const activePhoto = photos[currentPhotoIndex];
    
    // Animation variants based on mode
    const variants = {
        coverflow: {
            enter: { x: 100, opacity: 0, scale: 0.8 },
            center: { x: 0, opacity: 1, scale: 1 },
            exit: { x: -100, opacity: 0, scale: 0.8 }
        },
        cube: {
            enter: { rotateY: 90, opacity: 0 },
            center: { rotateY: 0, opacity: 1 },
            exit: { rotateY: -90, opacity: 0 }
        },
        cards: {
            enter: { y: -50, scale: 0.9, opacity: 0, zIndex: 0 },
            center: { y: 0, scale: 1, opacity: 1, zIndex: 1 },
            exit: { y: 20, scale: 0.95, opacity: 0, zIndex: 0 }
        },
        flip: {
            enter: { rotateX: 90, opacity: 0 },
            center: { rotateX: 0, opacity: 1 },
            exit: { rotateX: -90, opacity: 0 }
        }
    };

    const mode = data.photoMode || 'coverflow';
    const selectedVariant = variants[mode as keyof typeof variants] || variants.coverflow;

    return (
        <div className="relative w-full h-full perspective-1000">
             <AnimatePresence mode='wait'>
                <motion.div
                    key={activePhoto + currentPhotoIndex} // Force re-render on change
                    variants={selectedVariant}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
                    className="w-full h-full rounded-lg overflow-hidden shadow-2xl bg-gray-200"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <img src={activePhoto} className="w-full h-full object-cover" alt="Memory" />
                </motion.div>
             </AnimatePresence>

             {/* Navigation Overlay */}
             {photos.length > 1 && (
                 <>
                    <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full backdrop-blur-sm transition-all z-20">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full backdrop-blur-sm transition-all z-20">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Dots */}
                    <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1.5 z-20">
                        {photos.slice(0, 5).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentPhotoIndex ? 'bg-white w-3' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                 </>
             )}
        </div>
    );
  };

  // Helper to calculate time elapsed
  const calculateTime = (startDate: string) => {
    if (!startDate) return { years: 0, months: 0, days: 0 };
    
    const start = new Date(startDate);
    const now = new Date();
    
    if (isNaN(start.getTime())) return { years: 0, months: 0, days: 0 };

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years < 0 || (years === 0 && months < 0) || (years === 0 && months === 0 && days < 0)) {
        return { years: 0, months: 0, days: 0 };
    }
    
    return { years, months, days };
  };

  const timeElapsed = calculateTime(data.date);

  return (
    <div>
      {/* Audio Element (Standard MP3) */}
      {!isYoutube && data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop playsInline />}

      {/* YouTube Iframe (Hidden but optimized) */}
      {isYoutube && (
        <div className="hidden">
            <iframe 
                ref={iframeRef}
                width="1" 
                height="1" 
                src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&loop=1&playlist=${youtubeId}&autoplay=1&playsinline=1`} 
                title="YouTube Audio Player" 
                allow="autoplay; encrypted-media"
                loading="eager"
            ></iframe>
        </div>
      )}

      {/* Phone Frame */}
      <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl mx-auto flex flex-col overflow-hidden ring-4 ring-gray-900/10 box-border">
        {/* Hardware Buttons */}
        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
        
        {/* Screen Area */}
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
          
          {/* Background Base Layer (Always the active photo, blurred) */}
          <div className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700" 
               style={{ 
                 backgroundImage: `url(${photos[currentPhotoIndex]})`,
                 // We blur the background image so text is readable
                 filter: 'brightness(0.5) blur(8px)',
                 transform: 'scale(1.1)'
               }}>
          </div>
          
          {/* Effect Layer (Overlay) */}
          {renderBackgroundEffects()}

          {/* Content Layer */}
          <div className="relative z-20 flex flex-col h-full text-white p-5 overflow-y-auto no-scrollbar scroll-smooth">
             
             {/* Main Flex Container for uniform spacing */}
             <div className="flex flex-col gap-6 w-full pt-4 pb-8">

                 {/* Title - Fixed Responsive */}
                 <div className="text-center w-full shrink-0">
                    <h2 className="text-2xl font-poppins font-bold w-full break-words whitespace-normal leading-tight shadow-sm text-shadow-lg px-2">
                      {data.title || "Seu Título Aqui"}
                    </h2>
                 </div>

                 {/* Date Counter - Fixed Responsive */}
                 {data.date && (
                   <div className="shrink-0 flex flex-row items-center justify-center gap-1 text-xs font-mono bg-black/40 p-2 rounded-lg backdrop-blur-sm shadow-sm border border-white/10 w-full max-w-[90%] mx-auto">
                     <div className="flex-1 text-center min-w-0">
                         <div className="text-lg font-bold leading-none">{timeElapsed.years}</div>
                         <div className="text-[9px] uppercase opacity-80">Anos</div>
                     </div>
                     <div className="w-[1px] h-6 bg-white/20"></div>
                     <div className="flex-1 text-center min-w-0">
                         <div className="text-lg font-bold leading-none">{timeElapsed.months}</div>
                         <div className="text-[9px] uppercase opacity-80">Meses</div>
                     </div>
                     <div className="w-[1px] h-6 bg-white/20"></div>
                     <div className="flex-1 text-center min-w-0">
                         <div className="text-lg font-bold leading-none">{timeElapsed.days}</div>
                         <div className="text-[9px] uppercase opacity-80">Dias</div>
                     </div>
                   </div>
                 )}

                 {/* Message - Fixed Responsive */}
                 <div className="shrink-0 bg-white/20 backdrop-blur-md p-4 rounded-xl text-sm leading-relaxed shadow-lg border border-white/10 min-h-[80px] text-shadow-sm w-full break-words whitespace-pre-wrap">
                    {data.message || "Sua mensagem especial aparecerá aqui..."}
                 </div>

                 {/* Photo Gallery with Modes - Flexible grow */}
                 <div className="w-full aspect-square relative max-w-[260px] mx-auto shrink-0">
                     {renderPhotoImage()}
                 </div>
                 
                 {/* Music Player Mock - Pushed to bottom flow but with gap */}
                 {data.music && (
                   <div className="shrink-0 bg-black/60 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl cursor-pointer hover:bg-black/70 transition-colors w-full" onClick={toggleAudio}>
                     <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-tr from-christmas-red to-orange-500 opacity-80"></div>
                        {isPlaying ? (
                            <div className="flex items-end justify-center gap-[2px] h-4 w-5 z-10">
                                <div className="w-[3px] bg-white rounded-t-sm animate-music-bar-1"></div>
                                <div className="w-[3px] bg-white rounded-t-sm animate-music-bar-2"></div>
                                <div className="w-[3px] bg-white rounded-t-sm animate-music-bar-3"></div>
                            </div>
                        ) : (
                            <Play className="w-4 h-4 text-white z-10 fill-white ml-0.5" />
                        )}
                     </div>
                     <div className="flex-1 overflow-hidden min-w-0">
                       <p className="text-xs font-bold truncate text-white block">{data.music}</p>
                       <p className="text-[10px] text-gray-300 flex items-center gap-1 truncate">
                          {isPlaying ? 'Tocando agora...' : 'Toque para ouvir'}
                       </p>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white fill-white" />}
                     </div>
                   </div>
                 )}
             </div>

          </div>
        </div>
      </div>
      <style>{`
        .text-shadow-lg { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .text-shadow-sm { text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        .perspective-1000 { perspective: 1000px; }
        
        /* Hearts Rain Animation - Fixed */
        @keyframes heart-rain {
          0% { transform: translateY(-10%) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
        }
        .animate-heart-rain {
            animation-name: heart-rain;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }

        /* Clouds Scroll Animation - Fixed */
        @keyframes cloud-scroll {
            from { background-position: 0 0; }
            to { background-position: 200% 0; }
        }
        .animate-cloud-scroll {
            animation: cloud-scroll 30s linear infinite;
        }

        @keyframes comet {
            0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
            100% { transform: translateX(400px) translateY(400px) rotate(-45deg); opacity: 0; }
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes aurora {
            0% { transform: translate(0, 0) scale(1.5); }
            50% { transform: translate(-20px, 20px) scale(1.6); }
            100% { transform: translate(0, 0) scale(1.5); }
        }
        @keyframes spin-slow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        /* Music Bars */
        @keyframes music-bar {
            0%, 100% { height: 30%; }
            50% { height: 100%; }
        }
        .animate-music-bar-1 { animation: music-bar 0.8s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar 1.1s ease-in-out infinite; }
        .animate-music-bar-3 { animation: music-bar 0.6s ease-in-out infinite; }
        
        .animate-comet { animation-timing-function: linear; animation-iteration-count: infinite; }
        .animate-twinkle { animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .animate-aurora { animation: aurora 15s infinite alternate linear; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};