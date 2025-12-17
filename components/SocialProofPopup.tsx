import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Gift } from 'lucide-react';

const NAMES = [
  "Ana C.", "João P.", "Beatriz M.", "Lucas S.", 
  "Mariana R.", "Pedro H.", "Julia O.", "Gabriel F.",
  "Larissa K.", "Rafael B.", "Fernanda L.", "Thiago M."
];

export const SocialProofPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentName, setCurrentName] = useState("");

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
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    setCurrentName(randomName);
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
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white/95 backdrop-blur-sm border border-green-100 shadow-xl rounded-lg p-3 flex items-center gap-3 w-auto max-w-[280px]"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
               <Gift className="w-4 h-4 text-green-600" />
            </div>
            <div>
               <p className="text-xs font-bold text-gray-800">
                  {currentName}
               </p>
               <p className="text-[10px] text-gray-500 font-medium leading-tight">
                  acabou de receber o CODELOVE
               </p>
            </div>
            <div className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};