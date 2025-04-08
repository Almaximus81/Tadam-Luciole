import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EnergyMeter from "@/components/energy-meter";
import MotivationalMessage from "@/components/motivational-message";
import EasyTaskSuggestion from "@/components/easy-task-suggestion";
import NewTaskForm from "@/components/new-task-form";
import DailyStats from "@/components/daily-stats";
import TaskList from "@/components/task-list";
import CompletedTasks from "@/components/completed-tasks";
import StuckStrategies from "@/components/stuck-strategies";
import CelebrationOverlay from "@/components/celebration-overlay";
import StrategyModal from "@/components/strategy-modal";
import SettingsPanel from "@/components/settings-panel";
import { Task, UserSettings } from "@shared/schema";
import { Focus } from "lucide-react";

export default function Home() {
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedTaskName, setCompletedTaskName] = useState("");
  const [completedTaskEnergy, setCompletedTaskEnergy] = useState(0);
  const [strategyType, setStrategyType] = useState<string | null>(null);

  // Fetch tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Fetch user settings
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
  });

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  const handleTaskCompleted = (task: Task) => {
    setCompletedTaskName(task.name);
    setCompletedTaskEnergy(task.energyCost);
    setShowCelebration(true);
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
  };

  const energyLevel = settings?.energy ?? 85;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans text-neutral-800">
      {/* Header */}
      <header className="bg-primary px-4 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Focus className="text-white mr-2 h-7 w-7" />
            <h1 className="text-white font-bold text-2xl">FocusFlow</h1>
          </div>
          
          <div className="flex items-center">
            {/* Energy level display - desktop */}
            <div className="hidden sm:flex items-center mr-4 pr-4 border-r border-primary-light">
              <EnergyMeter energy={energyLevel} />
            </div>
            
            <button 
              onClick={() => setShowSettings(true)} 
              className="p-2 rounded-full hover:bg-primary-dark transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Mobile energy level */}
        <div className="sm:hidden mb-6">
          <EnergyMeter energy={energyLevel} isMobile />
        </div>
        
        {/* Motivational message */}
        <MotivationalMessage />
        
        {/* Easy task suggestion */}
        <EasyTaskSuggestion />
        
        {/* Tasks section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Add new task + Daily Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add New Task Card */}
            <NewTaskForm />
            
            {/* Stats Card */}
            <DailyStats 
              completedCount={completedTasks.length} 
              remainingCount={activeTasks.length}
              energySpent={100 - energyLevel}
            />
          </div>
          
          {/* Task Lists */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task lists container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Tasks */}
              <TaskList 
                tasks={activeTasks} 
                onTaskCompleted={handleTaskCompleted}
              />
              
              {/* Completed Tasks */}
              <CompletedTasks tasks={completedTasks} />
            </div>
            
            {/* When Stuck Card */}
            <StuckStrategies onStrategySelect={setStrategyType} />
          </div>
        </div>
      </main>
      
      {/* Modals and overlays */}
      {showCelebration && (
        <CelebrationOverlay 
          taskName={completedTaskName}
          energyCost={completedTaskEnergy}
          currentEnergy={energyLevel}
          onClose={handleCloseCelebration}
        />
      )}
      
      {strategyType && (
        <StrategyModal 
          type={strategyType} 
          onClose={() => setStrategyType(null)} 
        />
      )}
      
      {showSettings && (
        <SettingsPanel 
          open={showSettings} 
          onClose={() => setShowSettings(false)}
          settings={settings}
        />
      )}
    </div>
  );
}
