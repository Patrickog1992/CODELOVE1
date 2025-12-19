import React, { useEffect, useState } from 'react';

export const SnowEffect: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; animationDuration: number; opacity: number }>>([]);

  useEffect(() => {
    // Reduced number of flakes slightly for mobile performance
    const count = window.innerWidth < 768 ? 30 : 50;
    
    const flakes = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      animationDuration: Math.random() * 5 + 5, // seconds
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-10px] bg-white rounded-full w-2 h-2 shadow-sm will-change-transform"
          style={{
            left: `${flake.left}%`,
            opacity: flake.opacity,
            animation: `fall ${flake.animationDuration}s linear infinite`,
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)' // Force GPU acceleration
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0px);
          }
          100% {
            transform: translateY(110vh) translateX(20px);
          }
        }
        .will-change-transform {
            will-change: transform;
        }
      `}</style>
    </div>
  );
};