import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { EasyTaskSuggestion as SuggestionType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function EasyTaskSuggestion() {
  const [show, setShow] = useState(true);
  const [currentSuggestion, setCurrentSuggestion] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to fetch all easy task suggestions
  const { data: suggestions = [] } = useQuery<SuggestionType[]>({
    queryKey: ['/api/easy-task-suggestions'],
  });

  // Mutation for adding a task
  const addTaskMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest('POST', '/api/tasks', {
        name,
        difficulty: 1,
        energyCost: 5,
        category: 'quick-win'
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task added",
        description: "The suggested task has been added to your list."
      });
      setShow(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add task",
        description: `${error}`,
        variant: "destructive"
      });
    }
  });

  // Mutation for completing a task
  const completeTaskMutation = useMutation({
    mutationFn: async (name: string) => {
      // First create the task
      const createRes = await apiRequest('POST', '/api/tasks', {
        name,
        difficulty: 1,
        energyCost: 5,
        category: 'quick-win'
      });
      const task = await createRes.json();
      
      // Then complete it
      const completeRes = await apiRequest('POST', `/api/tasks/${task.id}/complete`, {});
      return completeRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Quick win completed!",
        description: "Great job completing the easy task! 🎉"
      });
      setShow(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to complete task",
        description: `${error}`,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (suggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * suggestions.length);
      setCurrentSuggestion(suggestions[randomIndex].suggestion);
    }
  }, [suggestions]);

  const handleAddTask = () => {
    if (currentSuggestion) {
      addTaskMutation.mutate(currentSuggestion);
    }
  };

  const handleCompleteTask = () => {
    if (currentSuggestion) {
      completeTaskMutation.mutate(currentSuggestion);
    }
  };

  if (!show || !currentSuggestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-teal-light to-primary rounded-lg p-5 shadow-md mb-6 text-white"
      >
        <div className="flex items-start">
          <div className="bg-white/20 rounded-full p-2 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Quick Win Suggestion</h3>
            <p className="text-white/90 mb-3">{currentSuggestion}</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleAddTask}
                disabled={addTaskMutation.isPending}
                className="bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center"
              >
                {addTaskMutation.isPending ? (
                  <span className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
                Add to Tasks
              </button>
              <button 
                onClick={handleCompleteTask}
                disabled={completeTaskMutation.isPending}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center"
              >
                {completeTaskMutation.isPending ? (
                  <span className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                I Did This!
              </button>
            </div>
          </div>
          <button 
            onClick={() => setShow(false)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss suggestion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
