import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import pedroImage from '../assets/PedroPascal.png';

// Messages prédéfinis de Pedro
const pedroResponses = {
  default: [
    "Salut ! Je suis Pedro, ton assistant TDAH. Comment puis-je t'aider aujourd'hui ?",
    "Bonjour ! Besoin d'aide pour organiser tes tâches ?",
    "Hé ! C'est Pedro. Qu'est-ce qu'on fait aujourd'hui ?"
  ],
  motivation: [
    "Tu fais un travail formidable ! Continue comme ça !",
    "Chaque petite étape compte. Je suis fier de toi !",
    "N'oublie pas : tu es capable de grandes choses, même quand c'est difficile !"
  ],
  stuck: [
    "Bloqué(e) ? Essaie de diviser ta tâche en étapes plus petites.",
    "Parfois, prendre une courte pause de 5 minutes peut aider à relancer ton cerveau.",
    "Rappelle-toi la technique Pomodoro : 25 minutes de travail, puis une pause."
  ],
  energy: [
    "Ton énergie est basse ? C'est normal. Prends soin de toi et fais une activité qui te ressource.",
    "N'oublie pas de t'hydrater et de faire quelques étirements !",
    "Parfois, il faut savoir s'écouter et se reposer. Demain est un autre jour !"
  ],
  gladiator: [
    "Es-tu prêt(e) à conquérir tes tâches aujourd'hui, gladiateur ?",
    "La gloire t'attend au-delà de ta liste de tâches !",
    "Ce qui se passe dans ta liste de tâches... se répercute dans ta vie !"
  ]
};

// Liste de mots-clés pour les suggestions
const promptKeywords = [
  { text: "motivation", description: "Besoin d'encouragement" },
  { text: "bloqué", description: "Aide quand tu es bloqué" },
  { text: "énergie", description: "Conseils pour gérer ton énergie" },
  { text: "gladiateur", description: "Mode gladiateur activé!" },
];

interface PedroChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PedroChatbot({ isOpen, onClose }: PedroChatbotProps) {
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'pedro'}[]>([]);
  const [input, setInput] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialisation avec un message de bienvenue
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const randomIndex = Math.floor(Math.random() * pedroResponses.default.length);
      setMessages([{ text: pedroResponses.default[randomIndex], sender: 'pedro' }]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Ajouter le message de l'utilisateur
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    // Déterminer la catégorie de réponse basée sur les mots-clés
    let responseCategory = 'default';
    
    if (input.toLowerCase().includes('motiv')) {
      responseCategory = 'motivation';
    } else if (input.toLowerCase().includes('bloqu') || input.toLowerCase().includes('stuck') || input.toLowerCase().includes('aide')) {
      responseCategory = 'stuck';
    } else if (input.toLowerCase().includes('énergie') || input.toLowerCase().includes('fatigué') || input.toLowerCase().includes('fatigue')) {
      responseCategory = 'energy';
    } else if (input.toLowerCase().includes('gladiat')) {
      responseCategory = 'gladiator';
    }
    
    // Sélectionner une réponse aléatoire de la catégorie appropriée
    const responses = pedroResponses[responseCategory as keyof typeof pedroResponses];
    const randomIndex = Math.floor(Math.random() * responses.length);
    
    // Simuler un délai de réponse pour plus de naturel
    setTimeout(() => {
      setMessages(prev => [...prev, { text: responses[randomIndex], sender: 'pedro' }]);
    }, 1000);
    
    setInput('');
  };

  const handlePromptClick = (keyword: string) => {
    setInput(keyword);
    setShowPrompts(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 max-h-[500px] bg-white rounded-lg shadow-xl overflow-hidden z-50 flex flex-col">
      <div className="bg-primary p-3 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <img src={pedroImage} alt="Pedro" className="w-8 h-8 rounded-full" />
          <h3 className="font-bold">Pedro</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose} 
          className="h-6 w-6 p-0 text-white hover:bg-primary-dark"
        >
          ✕
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 max-h-[320px] bg-slate-50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {showPrompts && (
        <div className="bg-white p-2 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {promptKeywords.map((keyword, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                onClick={() => handlePromptClick(keyword.text)}
                className="text-xs"
              >
                {keyword.text}
                <span className="text-xs text-gray-400 ml-1">({keyword.description})</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-3 border-t border-gray-200 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-0"
          onClick={() => setShowPrompts(!showPrompts)}
        >
          ?
        </Button>
        <Input 
          placeholder="Écris à Pedro..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage}
          size="sm"
          className="h-10"
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
}