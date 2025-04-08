import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StrategyModalProps {
  type: string;
  onClose: () => void;
}

interface StrategyDetails {
  title: string;
  icon: JSX.Element;
  description: JSX.Element;
  tip: string;
}

export default function StrategyModal({ type, onClose }: StrategyModalProps) {
  const [details, setDetails] = useState<StrategyDetails | null>(null);
  
  useEffect(() => {
    if (type === 'break') {
      setDetails({
        title: 'Prendre une Courte Pause',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"></path>
          </svg>
        ),
        description: (
          <>
            <p className="mb-3">Parfois, une pause rapide est tout ce dont tu as besoin pour retrouver ta concentration. Voici comment la rendre efficace :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Règle une minuterie pour 5 minutes</li>
              <li>Éloigne-toi de ton bureau</li>
              <li>Bois un peu d'eau</li>
              <li>Prends quelques respirations profondes</li>
              <li>Reviens avec une perspective rafraîchie</li>
            </ul>
          </>
        ),
        tip: "Les pauses courtes peuvent augmenter la productivité jusqu'à 20%. Ton cerveau a besoin de ces moments pour traiter efficacement l'information."
      });
    } else if (type === 'smaller') {
      setDetails({
        title: 'Découper en Petites Étapes',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
        ),
        description: (
          <>
            <p className="mb-3">Les grandes tâches peuvent sembler écrasantes. Essaie de les décomposer en petites étapes :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Identifie la plus petite première action possible</li>
              <li>Règle une minuterie pour seulement 5 minutes de travail</li>
              <li>Concentre-toi uniquement sur cette petite étape</li>
              <li>Célèbre la réalisation de chaque mini-étape</li>
              <li>Continue avec le morceau suivant</li>
            </ul>
          </>
        ),
        tip: "Pour les cerveaux TDAH, commencer est souvent la partie la plus difficile. Une fois que tu débutes par une petite étape, l'élan se construit naturellement."
      });
    } else if (type === 'different') {
      setDetails({
        title: 'Changer de Tâche',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-dark mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4L11 8"></path>
            <path d="M17 8v12M17 20l4-4M17 20l-4-4"></path>
          </svg>
        ),
        description: (
          <>
            <p className="mb-3">Parfois, ton cerveau a besoin de variété. C'est OK de passer temporairement à une tâche différente :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choisis une tâche différente de ta liste</li>
              <li>De préférence une qui utilise des compétences mentales différentes</li>
              <li>Travaille dessus pendant 15-20 minutes</li>
              <li>Utilise cet élan pour revenir à la tâche originale</li>
              <li>Ou continue avec la nouvelle tâche si tu es dans le flow</li>
            </ul>
          </>
        ),
        tip: "Le changement de tâche peut être stratégique pour les cerveaux TDAH. Ton objectif est la productivité globale, pas de te forcer à accomplir une seule tâche quand tu es bloqué."
      });
    }
  }, [type]);

  if (!details) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
          {details.icon}
          {details.title}
        </h2>
        
        <div className="mb-5 text-neutral-600">
          {details.description}
        </div>
        
        <div className="bg-neutral-50 p-4 rounded-lg mb-5">
          <p className="text-neutral-700 italic">{details.tip}</p>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-colors"
          >
            Essayer Maintenant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-md transition-colors"
          >
            Fermer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
