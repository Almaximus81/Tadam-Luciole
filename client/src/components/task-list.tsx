import { Task } from "@shared/schema";
import TaskCard from "@/components/task-card";
import { motion, AnimatePresence } from "framer-motion";

interface TaskListProps {
  tasks: Task[];
  onTaskCompleted: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskCompleted }: TaskListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h2 className="font-semibold text-xl mb-4 flex items-center text-neutral-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Active Tasks
      </h2>
      
      {/* Empty state */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-6 text-center text-neutral-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <p>No active tasks. Add a new task to get started!</p>
        </motion.div>
      )}
      
      {/* Task list */}
      <AnimatePresence>
        <ul className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskCompleted={onTaskCompleted}
            />
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
}
