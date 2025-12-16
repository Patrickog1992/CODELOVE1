import React from 'react';
import { BuilderData } from '../../types';
import { SnowEffect } from '../SnowEffect';

interface PhonePreviewProps {
  data: BuilderData;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ data }) => {
  // Helper to render background effects
  const renderBackground = () => {
    switch (data.background) {
      case 'hearts':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="absolute text-red-500 animate-fall text-2xl" style={{
                 left: `${Math.random() * 100}%`,
                 top: `-20px`,
                 animationDuration: `${Math.random() * 3 + 3}s`,
                 animationDelay: `${Math.random() * 5}s`
               }}>❤️</div>
             ))}
          </div>
        );
      case 'stars_comets':
        return (
          <div className="absolute inset-0 bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute h-0.5 w-24 bg-gradient-to-r from-transparent via-white to-transparent animate-comet" style={{
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
          <div className="absolute inset-0 bg-[#0f172a] overflow-hidden">
             {[...Array(40)].map((_, i) => (
               <div key={i} className="absolute bg-white rounded-full animate-twinkle" style={{
                 width: Math.random() > 0.5 ? '2px' : '3px',
                 height: Math.random() > 0.5 ? '2px' : '3px',
                 top: `${Math.random() * 100}%`,
                 left: `${Math.random() * 100}%`,
                 animationDuration: `${Math.random() * 3 + 1}s`,
                 opacity: Math.random()
               }}></div>
             ))}
             {[...Array(6)].map((_, i) => (
               <div key={`m-${i}`} className="absolute w-[2px] h-[100px] bg-gradient-to-b from-white to-transparent animate-meteor" style={{
                 top: '-150px',
                 left: `${Math.random() * 100}%`,
                 animationDuration: `${Math.random() * 2 + 2}s`,
                 animationDelay: `${Math.random() * 5}s`
               }}></div>
             ))}
          </div>
        );
      case 'aurora':
        return (
           <div className="absolute inset-0 bg-black overflow-hidden">
             <div className="absolute inset-0 opacity-60 animate-aurora mix-blend-screen filter blur-[60px]" 
                  style={{ background: 'linear-gradient(45deg, #00ff87, #60efff, #0061ff)' }}>
             </div>
             <div className="absolute inset-0 opacity-40 animate-aurora-reverse mix-blend-screen filter blur-[40px]" 
                  style={{ background: 'linear-gradient(135deg, #ff00cc, #333399, #6600ff)' }}>
             </div>
           </div>
        );
      case 'vortex':
        return (
          <div className="absolute inset-0 bg-black overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-spin-slow opacity-60"
                  style={{ background: 'conic-gradient(from 0deg, #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8, #fb07d9, #ff0000)' }}>
             </div>
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          </div>
        );
      case 'clouds':
        return (
          <div className="absolute inset-0 bg-sky-300 overflow-hidden">
             <div className="absolute inset-0 animate-drift-slow" 
                  style={{ 
                    backgroundImage: 'url(https://assets.codepen.io/3364143/cloud1.png)', 
                    backgroundSize: 'cover',
                    opacity: 0.8 
                  }}>
             </div>
             <div className="absolute inset-0 animate-drift-medium" 
                  style={{ 
                    backgroundImage: 'url(https://assets.codepen.io/3364143/cloud2.png)', 
                    backgroundSize: 'cover',
                    opacity: 0.6 
                  }}>
             </div>
          </div>
        );
      case 'none':
      default:
        return <SnowEffect />;
    }
  };

  // Helper to calculate time elapsed
  const calculateTime = (startDate: string) => {
    if (!startDate) return { years: 0, months: 0, days: 0 };
    
    const start = new Date(startDate);
    const now = new Date();
    
    // Check if valid date
    if (isNaN(start.getTime())) return { years: 0, months: 0, days: 0 };

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Don't show negative values for future dates
    if (years < 0 || (years === 0 && months < 0) || (years === 0 && months === 0 && days < 0)) {
        return { years: 0, months: 0, days: 0 };
    }
    
    return { years, months, days };
  };

  const timeElapsed = calculateTime(data.date);

  return (
    <div>
      {/* Phone Frame */}
      <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[640px] w-[320px] shadow-2xl mx-auto flex flex-col overflow-hidden ring-4 ring-gray-900/10">
        {/* Hardware Buttons */}
        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
        
        {/* Screen Area */}
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
          
          {/* Background Layer */}
          <div className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500" 
               style={{ 
                 backgroundImage: data.photos.length > 0 ? `url(${data.photos[0]})` : 'url(https://picsum.photos/600/1000?random=christmas)',
                 filter: 'brightness(0.6)'
               }}>
          </div>
          
          {/* Effect Layer */}
          <div className="absolute inset-0 z-0">
            {renderBackground()}
          </div>

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col h-full text-white p-6 overflow-y-auto no-scrollbar">
             
             {/* Title */}
             <div className="mt-12 text-center">
                <h2 className="text-3xl font-poppins font-bold mb-2 break-words leading-tight shadow-sm text-shadow-lg">
                  {data.title || "Seu Título Aqui"}
                </h2>
             </div>

             {/* Date Counter */}
             {data.date && (
               <div className="mt-4 flex justify-center gap-2 text-xs font-mono bg-black/40 p-2 rounded-lg backdrop-blur-sm shadow-sm border border-white/10">
                 <div className="text-center px-1">
                     <div className="text-lg font-bold leading-none">{timeElapsed.years}</div>
                     <div className="text-[10px] opacity-80">Anos</div>
                 </div>
                 <div className="text-center px-1 border-l border-white/20">
                     <div className="text-lg font-bold leading-none">{timeElapsed.months}</div>
                     <div className="text-[10px] opacity-80">Meses</div>
                 </div>
                 <div className="text-center px-1 border-l border-white/20">
                     <div className="text-lg font-bold leading-none">{timeElapsed.days}</div>
                     <div className="text-[10px] opacity-80">Dias</div>
                 </div>
               </div>
             )}

             {/* Message */}
             <div className="mt-8 bg-white/20 backdrop-blur-md p-4 rounded-xl text-sm leading-relaxed shadow-lg border border-white/10 min-h-[100px] text-shadow-sm">
                {data.message || "Sua mensagem especial aparecerá aqui..."}
             </div>

             {/* Photo Gallery Preview */}
             {data.photos.length > 0 && (
               <div className="mt-6">
                 <div className="text-xs uppercase tracking-wider mb-2 opacity-80 text-center">{data.photoMode} Mode</div>
                 <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center border border-white/20 overflow-hidden shadow-2xl">
                    <img src={data.photos[0]} className="w-full h-full object-cover" alt="Preview" />
                 </div>
                 {data.photos.length > 1 && (
                     <div className="flex justify-center mt-3 gap-2">
                        {data.photos.slice(0, 4).map((photo, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`}></div>
                        ))}
                     </div>
                 )}
               </div>
             )}
             
             {/* Music Player Mock */}
             {data.music && (
               <div className="mt-auto mb-4 bg-black/60 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl">
                 <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-christmas-red to-orange-500 opacity-80"></div>
                    {/* Visualizer bars */}
                    <div className="flex items-end justify-center gap-[2px] h-4 w-5 z-10">
                        <div className="w-[3px] bg-white rounded-t-sm animate-music-bar-1"></div>
                        <div className="w-[3px] bg-white rounded-t-sm animate-music-bar-2"></div>
                        <div className="w-[3px] bg-white rounded-t-sm animate-music-bar-3"></div>
                        <div className="w-[3px] bg-white rounded-t-sm animate-music-bar-1"></div>
                    </div>
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <p className="text-xs font-bold truncate text-white">{data.music}</p>
                   <p className="text-[10px] text-gray-300">Tocando agora...</p>
                 </div>
               </div>
             )}

          </div>
        </div>
      </div>
      <style>{`
        .text-shadow-lg { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .text-shadow-sm { text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
        }
        @keyframes comet {
            0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
            100% { transform: translateX(400px) translateY(400px) rotate(-45deg); opacity: 0; }
        }
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes meteor {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(800px); opacity: 0; }
        }
        @keyframes aurora {
            0% { transform: translate(0, 0) scale(1.5); }
            50% { transform: translate(-20px, 20px) scale(1.6); }
            100% { transform: translate(0, 0) scale(1.5); }
        }
        @keyframes aurora-reverse {
            0% { transform: translate(0, 0) scale(1.5); }
            50% { transform: translate(20px, -20px) scale(1.6); }
            100% { transform: translate(0, 0) scale(1.5); }
        }
        @keyframes spin-slow {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes drift-slow {
            from { background-position: 0 0; }
            to { background-position: 100% 0; }
        }
        @keyframes drift-medium {
            from { background-position: 0 0; }
            to { background-position: -50% 0; }
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
        .animate-meteor { animation-timing-function: linear; animation-iteration-count: infinite; }
        .animate-aurora { animation: aurora 15s infinite alternate linear; }
        .animate-aurora-reverse { animation: aurora-reverse 20s infinite alternate linear; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-drift-slow { animation: drift-slow 60s linear infinite; }
        .animate-drift-medium { animation: drift-medium 40s linear infinite; }
      `}</style>
    </div>
  );
};