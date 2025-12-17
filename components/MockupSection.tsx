import React, { useState, useEffect } from 'react';

const CAROUSEL_IMAGES = [
  "https://i.imgur.com/73dp13S.jpg",
  "https://i.imgur.com/pO7c6ZD.jpg",
  "https://i.imgur.com/6hNipoh.jpg"
];

export const MockupSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Preload Images for instant transition
  useEffect(() => {
    CAROUSEL_IMAGES.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-christmas-snow overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <div className="relative max-w-[300px] md:max-w-[360px] mx-auto">
          {/* Phone Frame */}
          <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] md:w-[320px] shadow-2xl mx-auto flex flex-col overflow-hidden ring-4 ring-gray-900/10 z-20">
            {/* Screen Content */}
            <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
            
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
              {/* Christmas Screen UI Mockup */}
              
              {/* Carousel Background Layer */}
              {CAROUSEL_IMAGES.map((img, index) => (
                <div 
                    key={img}
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
                    style={{ 
                        backgroundImage: `url(${img})`,
                        opacity: index === currentImageIndex ? 1 : 0
                    }}
                />
              ))}

              <div className="absolute inset-0 bg-black/40" />
                
                {/* Tree Rain Animation Overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute animate-heart-rain-mockup" style={{
                        left: `${(i * 15) + Math.random() * 10}%`,
                        top: '-20px',
                        fontSize: `${Math.random() * 20 + 20}px`,
                        animationDuration: `${Math.random() * 2 + 3}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: 0.9
                    }}>🎄</div>
                    ))}
                </div>

                {/* Simulated Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-6 text-center">
                   <h2 className="text-3xl font-poppins font-bold mb-2 shadow-sm text-shadow">Feliz Natal, Amor!</h2>
                   <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl mb-4 text-sm border border-white/20 shadow-lg">
                      "Você é o meu melhor presente..."
                   </div>
                   <div className="flex gap-4 mb-8">
                     <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg border border-white/20">D</div>
                     <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg border border-white/20">H</div>
                     <div className="bg-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg border border-white/20">M</div>
                   </div>
                   <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-sm shadow-xl hover:scale-105 transition-transform animate-pulse-scale">
                     Ver nossa história
                   </button>
                </div>
            </div>
          </div>
          
          {/* Decorative Elements behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
      <style>{`
        .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        
        @keyframes heart-rain-mockup {
          0% { transform: translateY(-10%) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
        }
        .animate-heart-rain-mockup {
            animation-name: heart-rain-mockup;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }
      `}</style>
    </section>
  );
};