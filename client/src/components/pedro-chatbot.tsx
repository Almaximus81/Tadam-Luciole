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
    "Aujourd'hui, tu es Maximus Alma Meridius… sauf que toi, tu combats une pile de linge sale, du désordre et des objets disséminés partout. Gloire à toi !",
    "Tu n'as pas à tout faire… Juste une première mini action. Et boum : combo de bravoure activé.",
    "Ta mission, si tu l'acceptes : ne pas fuir. Juste ouvrir, faire une petite chose et oser commencer.",
    "L'avenir appartient à ceux qui... respirent un bon coup et se motivent avec Pedro.",
    "Pedro a vu ton potentiel. Et il a dit : 'Cette personne est une légende en devenir.'",
    "Tu sais ce que Maximus ferait ? Il soufflerait fort… et il ferait une tâche domestique. Si, si !"
  ],
  stuck: [
    "Si tu n'arrives pas à tout faire… FAIS JUSTE LE TRUC LE PLUS FACILE. Et reviens vers Pedro pour une standing ovation imaginaire.",
    "N'aie pas peur. Même les tirones ont commencé par nettoyer la boue de leur tentorium !",
    "Rappelle-toi : même un canard qui rame à l'envers est plus avancé que celui qui reste sur la berge."
  ],
  energy: [
    "Ton niveau d'énergie est à 3 ? Parfait. C'est un nombre magique. Comme les trios de sorcières ou les tacos par portion.",
    "Tu es comme une pile rechargeable : commence par brancher ton courage, le reste suivra.",
    "Tu n'es pas paresseux·se. Tu es un stratège de l'effort sélectif. Pedro valide.",
    "On n'est pas ici pour être parfait. On est ici pour avancer avec panache et un poil de café.",
    "Tu crois être petit·e ? Pedro te voit comme un·e géant·e qui a juste un petit bug temporaire de démarrage."
  ],
  gladiator: [
    "Je sais, les tâches domestiques, c'est pas Commode. Haha ! Commode ! Tu l'as ? Bon, ok, on se met au travail, soldat !",
    "Es-tu prêt(e) à conquérir tes tâches aujourd'hui, gladiateur ?",
    "La gloire t'attend au-delà de ta liste de tâches !",
    "Ce qui se passe dans ta liste de tâches... se répercute dans ta vie !"
  ],
  microtasks: [
    "Un petit pas pour toi, un grand pas pour ta crédibilité d'adulte fonctionnel.",
    "Range 3 trucs et tu seras promu·e Capitaine de la Légion de la Propreté Suprême.",
    "Range un objet. Tu gagneras +10 en dignité et +3 en fierté intérieure. Et si tu en ranges 5 tu seras carrément une légende !",
    "Maximus avait une épée. Toi, t'as un balai, un aspiro robot ou une éponge… Chacun est une arme pour établir fièrement ta légende moderne.",
    "La motivation vient en marchant. Ou en dansant. Peu importe, du moment que tu réunis les chaussettes orphelines."
  ]
};

// Liste de mots-clés pour les suggestions
const promptKeywords = [
  { text: "motivation", description: "Besoin d'encouragement" },
  { text: "bloqué", description: "Aide quand tu es bloqué" },
  { text: "énergie", description: "Conseils pour gérer ton énergie" },
  { text: "gladiateur", description: "Mode gladiateur activé!" },
  { text: "micro-tâches", description: "Petites choses à faire" },
  { text: "fun", description: "Pour rigoler" },
  { text: "aléatoire", description: "Surprise!" },
  { text: "tâche faite", description: "Célébration" },
  { text: "encouragement", description: "Boost doux" },
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
    
    const inputLowerCase = input.toLowerCase();
    
    if (inputLowerCase.includes('motiv') || inputLowerCase.includes('encouragement')) {
      responseCategory = 'motivation';
    } else if (inputLowerCase.includes('bloqu') || inputLowerCase.includes('stuck') || inputLowerCase.includes('aide')) {
      responseCategory = 'stuck';
    } else if (inputLowerCase.includes('énergie') || inputLowerCase.includes('fatigué') || inputLowerCase.includes('fatigue')) {
      responseCategory = 'energy';
    } else if (inputLowerCase.includes('gladiat') || inputLowerCase.includes('fun')) {
      responseCategory = 'gladiator';
    } else if (inputLowerCase.includes('micro') || inputLowerCase.includes('tâche') || inputLowerCase.includes('petite')) {
      responseCategory = 'microtasks';
    } else if (inputLowerCase.includes('aléatoire')) {
      // Pour les requêtes aléatoires, choisir une catégorie au hasard
      const categories = ['motivation', 'stuck', 'energy', 'gladiator', 'microtasks'];
      const randomCategoryIndex = Math.floor(Math.random() * categories.length);
      responseCategory = categories[randomCategoryIndex];
    } else if (inputLowerCase.includes('tâche faite') || inputLowerCase.includes('terminé') || inputLowerCase.includes('fini')) {
      responseCategory = 'motivation'; // Utiliser les réponses de motivation pour les célébrations
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
    <div className="fixed bottom-6 right-6 w-96 max-h-[550px] bg-white rounded-lg shadow-xl overflow-hidden z-50 flex flex-col">
      <div className="bg-primary p-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-3">
          <img src={pedroImage} alt="Pedro" className="w-12 h-12 rounded-full border-2 border-white" />
          <h3 className="font-bold text-lg">Pedro</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose} 
          className="h-8 w-8 p-0 text-white hover:bg-primary-dark"
        >
          ✕
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 max-h-[380px] bg-slate-50">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block px-4 py-3 rounded-lg max-w-[85%] text-base ${
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
        <div className="bg-white p-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">Suggestions :</p>
          <div className="flex flex-wrap gap-2">
            {promptKeywords.map((keyword, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                onClick={() => handlePromptClick(keyword.text)}
                className="text-xs py-1 px-2 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                {keyword.text}
                <span className="text-xs text-gray-500 ml-1">({keyword.description})</span>
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