import React from 'react';
import { Heart } from 'lucide-react';

interface HeaderProps {
  onOpenBuilder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBuilder }) => {
    return (
        <header className="absolute top-0 left-0 w-full z-50 py-6">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
                    <Heart className="w-6 h-6 fill-white text-white" />
                    CODELOVE
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#" className="text-sm font-medium text-white/90 hover:text-white transition-opacity">Como funciona</a>
                    <a href="#pricing" className="text-sm font-medium text-white/90 hover:text-white transition-opacity">Preços</a>
                </nav>

                <button 
                  onClick={onOpenBuilder}
                  className="px-6 py-2.5 rounded-full text-sm font-bold bg-white text-christmas-darkRed hover:bg-gray-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
                >
                    Criar Presente
                </button>
            </div>
        </header>
    );
};