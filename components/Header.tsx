import React from 'react';

interface HeaderProps {
  onOpenBuilder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBuilder }) => {
    return (
        <header className="absolute top-0 left-0 w-full z-50 py-2">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <a href="/" className="block">
                    <img 
                        src="https://i.imgur.com/bJxEkd2.png" 
                        alt="CODELOVE" 
                        className="w-[100px] h-[100px] object-contain"
                    />
                </a>
                
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#" className="text-sm font-medium text-white/90 hover:text-white transition-opacity">Como funciona</a>
                    <a href="#pricing" className="text-sm font-medium text-white/90 hover:text-white transition-opacity">Preços</a>
                </nav>

                <button 
                  onClick={onOpenBuilder}
                  className="px-6 py-2.5 rounded-full text-sm font-bold bg-green-600 text-white hover:bg-green-500 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 animate-pulse-scale"
                >
                    Criar Presente
                </button>
            </div>
        </header>
    );
};