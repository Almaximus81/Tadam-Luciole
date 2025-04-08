import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface DailyStatsProps {
  completedCount: number;
  remainingCount: number;
  energySpent: number;
}

export default function DailyStats({ completedCount, remainingCount, energySpent }: DailyStatsProps) {
  // Calculate completion percentage
  const totalTasks = completedCount + remainingCount;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="font-semibold text-xl mb-4 flex items-center text-neutral-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        Daily Stats
      </h2>
      
      <ul className="space-y-3">
        <motion.li 
          className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-neutral-600">Tasks Completed</span>
          <span className="font-semibold text-primary">{completedCount}</span>
        </motion.li>
        <motion.li 
          className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-neutral-600">Tasks Remaining</span>
          <span className="font-semibold text-secondary">{remainingCount}</span>
        </motion.li>
        <motion.li 
          className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-neutral-600">Energy Spent</span>
          <span className="font-semibold text-teal">{energySpent}%</span>
        </motion.li>
      </ul>
      
      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-medium text-neutral-700 mb-2">Completion Progress</h3>
        <Progress 
          value={completionPercentage} 
          variant="accent"
          className="h-4 bg-neutral-200 rounded-full overflow-hidden transition-all duration-500 ease-out"
        />
        <div className="text-right mt-1 text-sm text-neutral-500">{completionPercentage}% done</div>
      </motion.div>
    </div>
  );
}
