import { motion } from "framer-motion";

interface StuckStrategiesProps {
  onStrategySelect: (strategy: string) => void;
}

export default function StuckStrategies({ onStrategySelect }: StuckStrategiesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="font-semibold text-xl mb-4 flex items-center text-neutral-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 15h8"></path>
          <path d="M9 9h.01"></path>
          <path d="M15 9h.01"></path>
        </svg>
        Tu es bloqué ?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStrategySelect('break')}
          className="bg-primary-light/10 hover:bg-primary-light/20 transition-colors p-4 rounded-lg flex flex-col items-center text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"></path>
          </svg>
          <span className="font-medium text-neutral-700">Faire une Pause</span>
          <p className="text-sm text-neutral-500 mt-1">5 min pour rafraîchir ton esprit</p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStrategySelect('smaller')}
          className="bg-secondary-light/10 hover:bg-secondary-light/20 transition-colors p-4 rounded-lg flex flex-col items-center text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
          <span className="font-medium text-neutral-700">Décomposer la Tâche</span>
          <p className="text-sm text-neutral-500 mt-1">Divise ta tâche en petites étapes</p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStrategySelect('different')}
          className="bg-accent-light/10 hover:bg-accent-light/20 transition-colors p-4 rounded-lg flex flex-col items-center text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-dark mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4L11 8"></path>
            <path d="M17 8v12M17 20l4-4M17 20l-4-4"></path>
          </svg>
          <span className="font-medium text-neutral-700">Changer de Tâche</span>
          <p className="text-sm text-neutral-500 mt-1">Travaille sur autre chose pendant un moment</p>
        </motion.button>
      </div>
    </div>
  );
}
