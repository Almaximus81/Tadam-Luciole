import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CelebrationOverlayProps {
  taskName: string;
  energyCost: number;
  currentEnergy: number;
  onClose: () => void;
}

export default function CelebrationOverlay({ 
  taskName, 
  energyCost, 
  currentEnergy, 
  onClose 
}: CelebrationOverlayProps) {
  const confettiContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate random congratulatory message
  const congratsMessages = [
    "Excellent travail !",
    "Super boulot !",
    "Tu l'as fait !",
    "Bravo !",
    "Tâche accomplie !",
    "Bien joué !"
  ];
  
  const randomMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
  
  // Create confetti animation
  useEffect(() => {
    if (!confettiContainerRef.current) return;
    
    const colors = ['#00A8A8', '#9F7AEA', '#FFD166', '#00B2CA'];
    const container = confettiContainerRef.current;
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute w-2.5 h-2.5 opacity-0';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animation = `confetti-animation ${Math.random() * 1 + 0.5}s ${Math.random() * 0.5}s ease-out forwards`;
      container.appendChild(confetti);
    }
    
    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-accent/20 rounded-full p-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">{randomMessage}</h2>
        
        <p className="text-neutral-600 mb-4">
          Tu as terminé "{taskName}" ! C'est {energyCost}% d'énergie bien utilisée.
        </p>
        
        <div className="energy-update flex items-center justify-center p-3 bg-primary-light/10 rounded-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
            <rect x="9" y="11" width="6" height="8" rx="1"></rect>
          </svg>
          <span className="text-primary-dark font-medium">
            Énergie restante : {currentEnergy}%
          </span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full py-3 bg-accent hover:bg-accent-dark text-neutral-800 font-semibold rounded-md transition-colors"
        >
          Continue comme ça !
        </motion.button>
        
        <div 
          ref={confettiContainerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        />
      </motion.div>
    </motion.div>
  );
}
