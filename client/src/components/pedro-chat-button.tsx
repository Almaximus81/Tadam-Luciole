import React, { useState } from 'react';
import { Button } from './ui/button';
import PedroChatbot from './pedro-chatbot';
import pedroImage from '../assets/PedroPascal.png';

export default function PedroChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <Button
            onClick={() => setIsChatOpen(true)}
            className="rounded-full w-14 h-14 p-0 overflow-hidden shadow-lg hover:scale-105 transition-transform"
          >
            <img 
              src={pedroImage} 
              alt="Pedro" 
              className="w-full h-full object-cover"
            />
          </Button>
        )}
      </div>
      
      <PedroChatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}