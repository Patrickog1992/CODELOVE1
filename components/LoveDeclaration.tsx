import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface LoveDeclarationProps {
  onOpenBuilder: () => void;
}

export const LoveDeclaration: React.FC<LoveDeclarationProps> = ({ onOpenBuilder }) => {
  return (
    <section className="py-24 bg-gradient-to-br from-christmas-darkRed to-christmas-red relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-christmas-gold/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 border border-white/20 text-white/90 text-sm font-medium animate-pulse">
            <Sparkles className="w-4 h-4 text-christmas-gold" />
            <span>O presente perfeito</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
          Declare seu amor <br/> de forma única
        </h2>
        
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Crie uma página personalizada para quem você ama e surpreenda a pessoa com uma declaração especial que ficará para sempre.
        </p>

        <button
          onClick={onOpenBuilder}
          className="bg-green-600 text-white text-lg font-bold py-5 px-12 rounded-full shadow-2xl shadow-green-600/30 hover:bg-green-500 transition-all animate-pulse-scale flex items-center gap-3 mx-auto group"
        >
          <Heart className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          Quero criar a página
        </button>
      </div>
    </section>
  );
};