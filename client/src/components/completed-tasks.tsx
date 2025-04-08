import { Task } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface CompletedTasksProps {
  tasks: Task[];
}

export default function CompletedTasks({ tasks }: CompletedTasksProps) {
  // Function to format time
  const formatTime = (date: Date | null) => {
    if (!date) return "";
    
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "récemment";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="font-semibold text-xl mb-4 flex items-center text-neutral-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        Terminées Aujourd'hui
      </h2>
      
      {/* Empty state */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-6 text-center text-neutral-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <p>Aucune tâche terminée pour le moment. Vous pouvez le faire !</p>
        </motion.div>
      )}
      
      {/* Completed tasks list */}
      <AnimatePresence>
        <ul className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {tasks.map(task => (
            <motion.li
              key={task.id}
              className="relative bg-neutral-50 rounded-lg p-3 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-start">
                <div className="mt-1 flex-shrink-0 rounded-full w-5 h-5 bg-accent flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="ml-3 flex-grow">
                  <h3 className="font-medium text-neutral-600 line-through">{task.name}</h3>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 bg-accent-light/10 text-accent-dark text-xs rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                        <rect x="9" y="11" width="6" height="8" rx="1"></rect>
                      </svg>
                      {task.energyCost}% d'énergie
                    </span>
                    
                    {task.category && (
                      <span className="inline-flex items-center px-2 py-1 bg-neutral-100/80 text-neutral-600 text-xs rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
                
                <span className="text-xs text-neutral-500">{formatTime(task.completedAt)}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
}
