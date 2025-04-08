import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import PedroChatbot from './pedro-chatbot';
import pedroImage from '../assets/PedroPascal.png';
import { motion } from "framer-motion";

export default function PedroChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [showAttentionAnimation, setShowAttentionAnimation] = useState(false);

  // Animation d'attention périodique
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isChatOpen) {
        setShowAttentionAnimation(true);
        setTimeout(() => setShowAttentionAnimation(false), 2000);
      }
    }, 10000); // Toutes les 10 secondes
    
    return () => clearInterval(timer);
  }, [isChatOpen]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <div className="flex flex-col items-center">
            <motion.div 
              className="bg-white rounded-lg p-2 mb-2 shadow-md text-center text-sm font-medium text-neutral-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p>Un petit boost d'énergie ?</p> 
              <p>C'est Pedro qui offre !</p>
            </motion.div>
            <motion.div
              animate={showAttentionAnimation ? { 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, -5, 0]
              } : {}}
              transition={{ duration: 1 }}
            >
              <Button
                onClick={() => setIsChatOpen(true)}
                className="rounded-full w-20 h-20 p-0 overflow-hidden shadow-lg hover:scale-105 transition-transform border-4 border-primary"
              >
                <img 
                  src={pedroImage} 
                  alt="Pedro" 
                  className="w-full h-full object-cover"
                />
              </Button>
            </motion.div>
          </div>
        )}
      </div>
      
      <PedroChatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}