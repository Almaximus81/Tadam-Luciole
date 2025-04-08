import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTaskSchema, insertUserSettingsSchema } from "@shared/schema";
import adminRoutes from "./admin-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin routes
  app.use('/api/admin', adminRoutes);

  // API routes - prefix all routes with /api
  
  // Tasks endpoints
  app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  });

  app.get('/api/tasks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch task' });
    }
  });

  app.post('/api/tasks', async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid task data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create task' });
    }
  });

  app.patch('/api/tasks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      const updatedTask = await storage.updateTask(id, taskData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid task data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update task' });
    }
  });

  app.post('/api/tasks/:id/complete', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const completedTask = await storage.completeTask(id);
      
      if (!completedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Get updated user settings with new energy level
      const settings = await storage.getUserSettings();
      
      res.json({ task: completedTask, settings });
    } catch (error) {
      res.status(500).json({ message: 'Failed to complete task' });
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  });

  // User settings endpoints
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      
      if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });

  app.patch('/api/settings', async (req, res) => {
    try {
      const settingsData = insertUserSettingsSchema.partial().parse(req.body);
      const updatedSettings = await storage.updateUserSettings(settingsData);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid settings data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update settings' });
    }
  });

  app.post('/api/settings/reset-energy', async (req, res) => {
    try {
      const updatedSettings = await storage.updateEnergy(100);
      
      if (!updatedSettings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
      
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to reset energy' });
    }
  });

  // Motivational messages endpoints
  app.get('/api/motivational-messages', async (req, res) => {
    try {
      const messages = await storage.getMotivationalMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch motivational messages' });
    }
  });

  // Easy task suggestions endpoints
  app.get('/api/easy-task-suggestions', async (req, res) => {
    try {
      const suggestions = await storage.getEasyTaskSuggestions();
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch easy task suggestions' });
    }
  });
  
  // Congrats messages endpoints
  app.get('/api/congrats-messages', async (req, res) => {
    try {
      const messages = await storage.getCongratsMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch congrats messages' });
    }
  });
  
  // Strategies endpoints
  app.get('/api/strategies', async (req, res) => {
    try {
      const strategies = await storage.getStrategies();
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch strategies' });
    }
  });
  
  app.get('/api/strategies/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const strategy = await storage.getStrategy(id);
      
      if (!strategy) {
        return res.status(404).json({ message: 'Strategy not found' });
      }
      
      res.json(strategy);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch strategy' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
