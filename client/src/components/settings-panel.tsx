import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserSettings } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings?: UserSettings;
}

export default function SettingsPanel({ open, onClose, settings }: SettingsPanelProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const defaultSettings = {
    energy: 85,
    theme: "default",
    notificationsCompletion: true,
    notificationsReminders: true,
    notificationsMotivation: true,
    energyResetTime: "05:00"
  };
  
  const [formSettings, setFormSettings] = useState({
    ...defaultSettings,
    ...settings
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<UserSettings>) => {
      const res = await apiRequest('PATCH', '/api/settings', updatedSettings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update settings",
        description: `${error}`,
        variant: "destructive"
      });
    }
  });

  // Reset energy mutation
  const resetEnergyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/settings/reset-energy', {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Energy reset",
        description: "Your energy has been reset to 100%."
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to reset energy",
        description: `${error}`,
        variant: "destructive"
      });
    }
  });

  // Handler for theme changes
  const handleThemeChange = (theme: string) => {
    setFormSettings(prev => ({ ...prev, theme }));
    updateSettingsMutation.mutate({ theme });
  };

  // Handler for notification toggles
  const handleNotificationToggle = (field: string, value: boolean) => {
    setFormSettings(prev => ({ ...prev, [field]: value }));
    updateSettingsMutation.mutate({ [field]: value });
  };

  // Handler for energy reset time change
  const handleEnergyResetTimeChange = (energyResetTime: string) => {
    setFormSettings(prev => ({ ...prev, energyResetTime }));
    updateSettingsMutation.mutate({ energyResetTime });
  };

  // Handler for resetting energy
  const handleResetEnergy = () => {
    resetEnergyMutation.mutate();
  };

  // Handler for exporting data
  const handleExportData = () => {
    const data = {
      settings: formSettings
    };
    
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'focusflow-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handler for clearing data
  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      // Reset to defaults and update server
      const defaults = {
        energy: 100,
        theme: "default",
        notificationsCompletion: true,
        notificationsReminders: true,
        notificationsMotivation: true,
        energyResetTime: "05:00"
      };
      
      setFormSettings(defaults);
      updateSettingsMutation.mutate(defaults);
      
      // Invalidate tasks as well
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      
      toast({
        title: "Data cleared",
        description: "All your data has been reset to defaults."
      });
      
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto ${!open ? 'hidden' : ''}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">Settings</h2>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Notifications */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-completion" className="text-neutral-700">Task Completion</Label>
                <Switch
                  id="notif-completion"
                  checked={formSettings.notificationsCompletion}
                  onCheckedChange={(checked) => handleNotificationToggle('notificationsCompletion', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-reminders" className="text-neutral-700">Task Reminders</Label>
                <Switch
                  id="notif-reminders"
                  checked={formSettings.notificationsReminders}
                  onCheckedChange={(checked) => handleNotificationToggle('notificationsReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-motivation" className="text-neutral-700">Motivational Messages</Label>
                <Switch
                  id="notif-motivation"
                  checked={formSettings.notificationsMotivation}
                  onCheckedChange={(checked) => handleNotificationToggle('notificationsMotivation', checked)}
                />
              </div>
            </div>
          </div>
          
          {/* Theme */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Theme Colors</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={formSettings.theme === 'default' ? "default" : "outline"}
                className={`p-3 flex items-center justify-center ${formSettings.theme === 'default' ? 'bg-primary/10 text-primary ring-1 ring-primary' : ''}`}
                onClick={() => handleThemeChange('default')}
              >
                <span className="w-5 h-5 mr-2 rounded-full bg-primary"></span>
                Teal & Purple
              </Button>
              
              <Button
                type="button"
                variant={formSettings.theme === 'sunset' ? "default" : "outline"}
                className={`p-3 flex items-center justify-center ${formSettings.theme === 'sunset' ? 'bg-orange-500/10 text-orange-600 ring-1 ring-orange-500' : ''}`}
                onClick={() => handleThemeChange('sunset')}
              >
                <span className="w-5 h-5 mr-2 rounded-full bg-orange-500"></span>
                Sunset
              </Button>
              
              <Button
                type="button"
                variant={formSettings.theme === 'ocean' ? "default" : "outline"}
                className={`p-3 flex items-center justify-center ${formSettings.theme === 'ocean' ? 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500' : ''}`}
                onClick={() => handleThemeChange('ocean')}
              >
                <span className="w-5 h-5 mr-2 rounded-full bg-blue-500"></span>
                Ocean Blue
              </Button>
              
              <Button
                type="button"
                variant={formSettings.theme === 'forest' ? "default" : "outline"}
                className={`p-3 flex items-center justify-center ${formSettings.theme === 'forest' ? 'bg-green-600/10 text-green-700 ring-1 ring-green-600' : ''}`}
                onClick={() => handleThemeChange('forest')}
              >
                <span className="w-5 h-5 mr-2 rounded-full bg-green-600"></span>
                Forest Green
              </Button>
            </div>
          </div>
          
          {/* Energy Reset */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Energy Management</h3>
            
            <div className="mb-4">
              <Label htmlFor="energy-reset" className="block text-neutral-700 mb-1">Daily Energy Reset Time</Label>
              <Select
                value={formSettings.energyResetTime}
                onValueChange={handleEnergyResetTimeChange}
              >
                <SelectTrigger id="energy-reset" className="w-full">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="00:00">12:00 AM (Midnight)</SelectItem>
                  <SelectItem value="05:00">5:00 AM</SelectItem>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="button"
              variant="secondary"
              className="w-full py-2"
              onClick={handleResetEnergy}
              disabled={resetEnergyMutation.isPending}
            >
              {resetEnergyMutation.isPending ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              )}
              Reset Energy Now
            </Button>
          </div>
          
          {/* Data management */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-medium text-lg mb-3">Data Management</h3>
            
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-2 border border-neutral-300 text-neutral-700 font-medium"
                onClick={handleExportData}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export Data
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full py-2 border border-rose-200 text-rose-600 font-medium hover:bg-rose-50"
                onClick={handleClearData}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>FocusFlow v1.0.1</p>
          <p className="mt-1">Designed for ADHD management</p>
        </div>
      </div>
    </motion.div>
  );
}
