import {
  users, type User, type InsertUser,
  tasks, type Task, type InsertTask,
  userSettings, type UserSettings, type InsertUserSettings,
  motivationalMessages, type MotivationalMessage, type InsertMotivationalMessage,
  easyTaskSuggestions, type EasyTaskSuggestion, type InsertEasyTaskSuggestion
} from "@shared/schema";

// Interface for our storage
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  completeTask(id: number): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // User settings methods
  getUserSettings(): Promise<UserSettings | undefined>;
  updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  updateEnergy(energy: number): Promise<UserSettings | undefined>;

  // Motivational messages methods
  getMotivationalMessages(): Promise<MotivationalMessage[]>;
  addMotivationalMessage(message: InsertMotivationalMessage): Promise<MotivationalMessage>;

  // Easy task suggestions methods
  getEasyTaskSuggestions(): Promise<EasyTaskSuggestion[]>;
  addEasyTaskSuggestion(suggestion: InsertEasyTaskSuggestion): Promise<EasyTaskSuggestion>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private userSettings: Map<number, UserSettings>;
  private motivationalMessages: Map<number, MotivationalMessage>;
  private easyTaskSuggestions: Map<number, EasyTaskSuggestion>;
  
  private userId: number = 1;
  private taskId: number = 1;
  private userSettingsId: number = 1;
  private motivationalMessageId: number = 1;
  private easyTaskSuggestionId: number = 1;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.userSettings = new Map();
    this.motivationalMessages = new Map();
    this.easyTaskSuggestions = new Map();
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Default motivational messages
    const defaultMotivationalMessages = [
      "Remember: Small steps are still progress. You've got this!",
      "Your effort today shapes your success tomorrow.",
      "Focus on progress, not perfection.",
      "You don't have to be perfect to be amazing.",
      "Each task you complete is a victory worth celebrating!"
    ];
    
    defaultMotivationalMessages.forEach(message => {
      this.addMotivationalMessage({ message, isActive: true });
    });
    
    // Default easy task suggestions
    const defaultEasyTaskSuggestions = [
      "Take 2 minutes to clear your desk space",
      "Fill up your water bottle",
      "Write down your top 3 priorities for today",
      "Stretch for 1 minute",
      "Send that quick email you've been putting off",
      "Sort through 5 papers on your desk"
    ];
    
    defaultEasyTaskSuggestions.forEach(suggestion => {
      this.addEasyTaskSuggestion({ suggestion, isActive: true });
    });
    
    // Default user settings
    this.userSettings.set(1, {
      id: 1,
      userId: null,
      energy: 85,
      theme: "default",
      notificationsCompletion: true,
      notificationsReminders: true,
      notificationsMotivation: true,
      energyResetTime: "05:00"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const task: Task = {
      ...insertTask,
      id,
      userId: null,
      isCompleted: false,
      createdAt: new Date(),
      completedAt: null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async completeTask(id: number): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const completedTask = {
      ...task,
      isCompleted: true,
      completedAt: new Date()
    };
    this.tasks.set(id, completedTask);
    
    // Update energy level
    const userSettings = await this.getUserSettings();
    if (userSettings) {
      const newEnergy = Math.max(0, userSettings.energy - task.energyCost);
      await this.updateEnergy(newEnergy);
    }
    
    return completedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // User settings methods
  async getUserSettings(): Promise<UserSettings | undefined> {
    return this.userSettings.get(1); // For simplicity, always return the default settings
  }

  async updateUserSettings(settingsUpdate: Partial<InsertUserSettings>): Promise<UserSettings> {
    const settings = await this.getUserSettings() || {
      id: this.userSettingsId++,
      userId: null,
      energy: 100,
      theme: "default",
      notificationsCompletion: true,
      notificationsReminders: true,
      notificationsMotivation: true,
      energyResetTime: "05:00"
    };
    
    const updatedSettings = { ...settings, ...settingsUpdate };
    this.userSettings.set(updatedSettings.id, updatedSettings);
    return updatedSettings;
  }

  async updateEnergy(energy: number): Promise<UserSettings | undefined> {
    const settings = await this.getUserSettings();
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, energy };
    this.userSettings.set(updatedSettings.id, updatedSettings);
    return updatedSettings;
  }

  // Motivational messages methods
  async getMotivationalMessages(): Promise<MotivationalMessage[]> {
    return Array.from(this.motivationalMessages.values());
  }

  async addMotivationalMessage(message: InsertMotivationalMessage): Promise<MotivationalMessage> {
    const id = this.motivationalMessageId++;
    const newMessage: MotivationalMessage = {
      ...message,
      id,
      userId: null
    };
    this.motivationalMessages.set(id, newMessage);
    return newMessage;
  }

  // Easy task suggestions methods
  async getEasyTaskSuggestions(): Promise<EasyTaskSuggestion[]> {
    return Array.from(this.easyTaskSuggestions.values());
  }

  async addEasyTaskSuggestion(suggestion: InsertEasyTaskSuggestion): Promise<EasyTaskSuggestion> {
    const id = this.easyTaskSuggestionId++;
    const newSuggestion: EasyTaskSuggestion = {
      ...suggestion,
      id,
      userId: null
    };
    this.easyTaskSuggestions.set(id, newSuggestion);
    return newSuggestion;
  }
}

export const storage = new MemStorage();
