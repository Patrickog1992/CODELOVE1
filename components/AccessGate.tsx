import React, { useState } from 'react';
import { Lock, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { SnowEffect } from './SnowEffect';

interface AccessGateProps {
  onAccessGranted: () => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onAccessGranted }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normaliza para letras minúsculas e remove espaços extras
    if (code.toLowerCase().trim() === 'palomaoliveira') {
      onAccessGranted();
    } else {
      setError(true);
      const input = document.getElementById('access-code');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-christmas-darkRed flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <SnowEffect />
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-500 mx-4">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-christmas-gold w-20 h-20 rounded-full flex items-center justify-center border-4 border-christmas-darkRed shadow-lg">
          <Lock className="w-10 h-10 text-white" />
        </div>

        <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Área Exclusiva</h2>
            <div className="w-16 h-1 bg-christmas-red mx-auto rounded-full mb-6"></div>
            
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              COLOQUE O CÓDIGO QUE VOCÊ RECEBEU NAS COMPRAS DA LOJA <span className="font-bold text-christmas-darkRed">PALOMA OLIVEIRA STORE</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        id="access-code"
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError(false);
                        }}
                        placeholder="Digite o código aqui..."
                        className={`w-full px-6 py-4 rounded-xl border-2 text-center text-lg font-bold outline-none transition-all placeholder:font-normal placeholder:text-gray-400 ${
                            error 
                            ? 'border-red-500 bg-red-50 text-red-600 focus:ring-4 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-christmas-red focus:ring-4 focus:ring-red-100 text-gray-800'
                        }`}
                    />
                    {error && (
                        <p className="text-red-500 text-xs mt-2 font-medium animate-pulse">
                            Código incorreto. Tente novamente.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-500 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 group"
                >
                    Continuar
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Sparkles className="w-3 h-3 text-christmas-gold" />
                <span>Exclusivo para clientes Paloma Oliveira</span>
                <Sparkles className="w-3 h-3 text-christmas-gold" />
            </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};