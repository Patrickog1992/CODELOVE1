import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-christmas-darkGreen text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 font-bold text-2xl tracking-tighter">
            <Heart className="fill-christmas-red text-christmas-red" /> CODELOVE
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-white/70">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
        </div>
        
        <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} CODELOVE. Feito com amor para o Natal. 🎄
        </p>
      </div>
    </footer>
  );
};