import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';

const PROOFS = [
  { name: "Ana C.", city: "São Paulo, SP" },
  { name: "João P.", city: "Rio de Janeiro, RJ" },
  { name: "Beatriz M.", city: "Belo Horizonte, MG" },
  { name: "Lucas S.", city: "Curitiba, PR" },
  { name: "Mariana R.", city: "Salvador, BA" },
  { name: "Pedro H.", city: "Brasília, DF" },
  { name: "Julia O.", city: "Recife, PE" },
  { name: "Gabriel F.", city: "Porto Alegre, RS" },
  { name: "Larissa K.", city: "Fortaleza, CE" },
  { name: "Rafael B.", city: "Goiânia, GO" },
  { name: "Fernanda L.", city: "Manaus, AM" },
  { name: "Thiago M.", city: "Campinas, SP" }
];

export const SocialProofPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentProof, setCurrentProof] = useState({ name: "", city: "" });

  useEffect(() => {
    // Show first popup quickly
    const initialTimeout = setTimeout(() => {
        triggerPopup();
    }, 2000);

    // Show subsequent popups periodically
    const interval = setInterval(() => {
        triggerPopup();
    }, 8000 + Math.random() * 5000); // Random interval between 8-13 seconds

    return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
    };
  }, []);

  const triggerPopup = () => {
    const randomProof = PROOFS[Math.floor(Math.random() * PROOFS.length)];
    setCurrentProof(randomProof);
    setVisible(true);

    // Hide after 4 seconds
    setTimeout(() => {
        setVisible(false);
    }, 4000);
  };

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white/95 backdrop-blur-sm border border-green-100 shadow-md rounded-lg p-2 flex items-center gap-2.5 w-auto max-w-[260px]"
          >
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
               <Gift className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex flex-col justify-center">
               <p className="text-[10px] font-bold text-gray-800 leading-none mb-0.5">
                  {currentProof.name} <span className="font-normal text-gray-400 text-[9px]">de {currentProof.city}</span>
               </p>
               <p className="text-[9px] text-gray-500 font-medium leading-none">
                  acabou de receber o CODELOVE
               </p>
            </div>
            <div className="ml-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};