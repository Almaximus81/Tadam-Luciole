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
        title: 'Take a Short Break',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"></path>
          </svg>
        ),
        description: (
          <>
            <p className="mb-3">Sometimes a quick break is all you need to reset your focus. Here's how to make it effective:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Set a timer for 5 minutes</li>
              <li>Step away from your desk</li>
              <li>Drink some water</li>
              <li>Take a few deep breaths</li>
              <li>Return with a refreshed perspective</li>
            </ul>
          </>
        ),
        tip: "Short breaks can increase productivity by up to 20%. Your brain needs these pauses to process information effectively."
      });
    } else if (type === 'smaller') {
      setDetails({
        title: 'Break It Down',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
        ),
        description: (
          <>
            <p className="mb-3">Large tasks can feel overwhelming. Try breaking it down into tiny steps:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Identify the smallest possible first action</li>
              <li>Set a timer for just 5 minutes of work</li>
              <li>Focus only on that one small step</li>
              <li>Celebrate completing each mini-step</li>
              <li>Continue with the next small piece</li>
            </ul>
          </>
        ),
        tip: "For ADHD brains, starting is often the hardest part. Once you begin with a tiny step, momentum builds naturally."
      });
    } else if (type === 'different') {
      setDetails({
        title: 'Switch Tasks',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-dark mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4M7 4L3 8M7 4L11 8"></path>
            <path d="M17 8v12M17 20l4-4M17 20l-4-4"></path>
          </svg>
        ),
        description: (
          <>
            <p className="mb-3">Sometimes your brain needs variety. It's OK to switch to a different task temporarily:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose a different task from your list</li>
              <li>Preferably one that uses different mental skills</li>
              <li>Work on it for 15-20 minutes</li>
              <li>Use the momentum to return to the original task</li>
              <li>Or continue with the new task if you're in flow</li>
            </ul>
          </>
        ),
        tip: "Task switching can be strategic for ADHD brains. Your goal is productivity overall, not forcing yourself through a single task when stuck."
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
            Try This Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-md transition-colors"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
