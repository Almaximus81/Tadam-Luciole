import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MotivationalMessage as MessageType } from "@shared/schema";

export default function MotivationalMessage() {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  // Query to fetch all motivational messages
  const { data: messages = [] } = useQuery<MessageType[]>({
    queryKey: ['/api/motivational-messages'],
  });

  useEffect(() => {
    if (messages.length > 0) {
      generateRandomMessage();
    }
  }, [messages]);

  const generateRandomMessage = () => {
    if (messages.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex].message);
    setKey(prev => prev + 1);
  };

  if (!currentMessage) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="bg-white rounded-lg p-5 shadow-md mb-6 border-l-4 border-accent"
      >
        <div className="flex items-start">
          <div className="text-accent text-2xl mr-3 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-neutral-800 mb-1">Here's a boost!</h3>
            <p className="text-neutral-600">{currentMessage}</p>
          </div>
          <button 
            onClick={generateRandomMessage}
            className="ml-auto text-secondary hover:text-secondary-dark transition-colors"
            aria-label="Get new motivational message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
