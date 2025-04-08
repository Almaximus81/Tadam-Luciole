import { Task } from "@shared/schema";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
  onTaskCompleted: (task: Task) => void;
}

export default function TaskCard({ task, onTaskCompleted }: TaskCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isHovering, setIsHovering] = useState(false);

  // Set border color based on difficulty
  const getBorderColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "border-l-emerald-500";
      case 2: return "border-l-amber-500";
      case 3: return "border-l-rose-500";
      default: return "border-l-emerald-500";
    }
  };

  // Complete task mutation
  const completeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/tasks/${task.id}/complete`, {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      onTaskCompleted(task);
    },
    onError: (error) => {
      toast({
        title: "Failed to complete task",
        description: `${error}`,
        variant: "destructive"
      });
    }
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/tasks/${task.id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task deleted",
        description: `"${task.name}" has been removed from your tasks.`
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: `${error}`,
        variant: "destructive"
      });
    }
  });

  const handleComplete = () => {
    completeMutation.mutate();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate();
    }
  };

  // Gets category icon
  const getCategoryIcon = (category: string | null) => {
    if (!category) return "ri-folder-line";
    
    switch (category.toLowerCase()) {
      case 'work': return "ri-briefcase-line";
      case 'personal': return "ri-user-line";
      case 'health': return "ri-heart-line";
      case 'home': return "ri-home-line";
      case 'learning': return "ri-book-open-line";
      default: return "ri-folder-line";
    }
  };

  return (
    <motion.li
      className={`relative bg-white border border-neutral-200 rounded-lg p-3 transition-all hover:shadow-md border-l-4 ${getBorderColor(task.difficulty)}`}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start">
        <button 
          onClick={handleComplete}
          disabled={completeMutation.isPending}
          className="mt-1 flex-shrink-0 rounded-full w-5 h-5 border-2 border-primary hover:bg-primary-light/20 transition-colors"
          aria-label="Complete task"
        >
          {completeMutation.isPending && (
            <span className="flex h-full w-full items-center justify-center">
              <span className="animate-spin h-3 w-3 border-2 border-primary rounded-full border-r-transparent" />
            </span>
          )}
        </button>

        <div className="ml-3 flex-grow">
          <h3 className="font-medium text-neutral-800">{task.name}</h3>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-1 bg-primary-light/10 text-primary-dark text-xs rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <rect x="9" y="11" width="6" height="8" rx="1"></rect>
              </svg>
              {task.energyCost}% energy
            </span>
            
            {task.category && (
              <span className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                {task.category}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <button 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-neutral-400 hover:text-rose-500 transition-colors"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </motion.li>
  );
}
