import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface HeaderProps {
  onOpenBuilder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBuilder }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className={`flex items-center gap-2 font-bold text-xl tracking-tighter ${scrolled ? 'text-christmas-darkRed' : 'text-white'}`}>
                    <Heart className={`w-6 h-6 ${scrolled ? 'fill-christmas-red text-christmas-red' : 'fill-white text-white'}`} />
                    CODELOVE
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#" className={`text-sm font-medium hover:opacity-80 transition-opacity ${scrolled ? 'text-gray-700' : 'text-white'}`}>Como funciona</a>
                    <a href="#pricing" className={`text-sm font-medium hover:opacity-80 transition-opacity ${scrolled ? 'text-gray-700' : 'text-white'}`}>Preços</a>
                </nav>

                <button 
                  onClick={onOpenBuilder}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${scrolled ? 'bg-christmas-red text-white hover:bg-christmas-darkRed' : 'bg-white text-christmas-darkRed hover:bg-gray-100'}`}
                >
                    Criar Presente
                </button>
            </div>
        </header>
    );
};