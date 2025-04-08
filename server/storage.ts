import {
  users, type User, type InsertUser,
  tasks, type Task, type InsertTask,
  userSettings, type UserSettings, type InsertUserSettings,
  motivationalMessages, type MotivationalMessage, type InsertMotivationalMessage,
  easyTaskSuggestions, type EasyTaskSuggestion, type InsertEasyTaskSuggestion,
  congratsMessages, type CongratsMessage, type InsertCongratsMessage,
  strategies, type Strategy, type InsertStrategy
} from "@shared/schema";
import { db } from './db';
import { eq } from 'drizzle-orm';

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
  updateMotivationalMessage(id: number, message: Partial<InsertMotivationalMessage>): Promise<MotivationalMessage | undefined>;
  deleteMotivationalMessage(id: number): Promise<boolean>;

  // Easy task suggestions methods
  getEasyTaskSuggestions(): Promise<EasyTaskSuggestion[]>;
  addEasyTaskSuggestion(suggestion: InsertEasyTaskSuggestion): Promise<EasyTaskSuggestion>;
  updateEasyTaskSuggestion(id: number, suggestion: Partial<InsertEasyTaskSuggestion>): Promise<EasyTaskSuggestion | undefined>;
  deleteEasyTaskSuggestion(id: number): Promise<boolean>;
  
  // Congrats messages methods
  getCongratsMessages(): Promise<CongratsMessage[]>;
  addCongratsMessage(message: InsertCongratsMessage): Promise<CongratsMessage>;
  updateCongratsMessage(id: number, message: Partial<InsertCongratsMessage>): Promise<CongratsMessage | undefined>;
  deleteCongratsMessage(id: number): Promise<boolean>;
  
  // Strategy methods
  getStrategies(): Promise<Strategy[]>;
  getStrategy(id: number): Promise<Strategy | undefined>;
  addStrategy(strategy: InsertStrategy): Promise<Strategy>;
  updateStrategy(id: number, strategy: Partial<InsertStrategy>): Promise<Strategy | undefined>;
  deleteStrategy(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private userSettings: Map<number, UserSettings>;
  private motivationalMessages: Map<number, MotivationalMessage>;
  private easyTaskSuggestions: Map<number, EasyTaskSuggestion>;
  private congratsMessages: Map<number, CongratsMessage>;
  private strategies: Map<number, Strategy>;
  
  private userId: number = 1;
  private taskId: number = 1;
  private userSettingsId: number = 1;
  private motivationalMessageId: number = 1;
  private easyTaskSuggestionId: number = 1;
  private congratsMessageId: number = 1;
  private strategyId: number = 1;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.userSettings = new Map();
    this.motivationalMessages = new Map();
    this.easyTaskSuggestions = new Map();
    this.congratsMessages = new Map();
    this.strategies = new Map();
    
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
      difficulty: insertTask.difficulty || 3,
      energyCost: insertTask.energyCost || 5,
      category: insertTask.category || null,
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
      userId: null,
      isActive: message.isActive !== undefined ? message.isActive : true
    };
    this.motivationalMessages.set(id, newMessage);
    return newMessage;
  }
  
  async updateMotivationalMessage(id: number, message: Partial<InsertMotivationalMessage>): Promise<MotivationalMessage | undefined> {
    const existingMessage = this.motivationalMessages.get(id);
    if (!existingMessage) return undefined;
    
    const updatedMessage = { ...existingMessage, ...message };
    this.motivationalMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteMotivationalMessage(id: number): Promise<boolean> {
    return this.motivationalMessages.delete(id);
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
      userId: null,
      isActive: suggestion.isActive !== undefined ? suggestion.isActive : true
    };
    this.easyTaskSuggestions.set(id, newSuggestion);
    return newSuggestion;
  }
  
  async updateEasyTaskSuggestion(id: number, suggestion: Partial<InsertEasyTaskSuggestion>): Promise<EasyTaskSuggestion | undefined> {
    const existingSuggestion = this.easyTaskSuggestions.get(id);
    if (!existingSuggestion) return undefined;
    
    const updatedSuggestion = { ...existingSuggestion, ...suggestion };
    this.easyTaskSuggestions.set(id, updatedSuggestion);
    return updatedSuggestion;
  }
  
  async deleteEasyTaskSuggestion(id: number): Promise<boolean> {
    return this.easyTaskSuggestions.delete(id);
  }
  
  // Congrats messages methods
  async getCongratsMessages(): Promise<CongratsMessage[]> {
    return Array.from(this.congratsMessages.values());
  }
  
  async addCongratsMessage(message: InsertCongratsMessage): Promise<CongratsMessage> {
    const id = this.congratsMessageId++;
    const newMessage: CongratsMessage = {
      ...message,
      id,
      userId: null,
      isActive: message.isActive !== undefined ? message.isActive : true
    };
    this.congratsMessages.set(id, newMessage);
    return newMessage;
  }
  
  async updateCongratsMessage(id: number, message: Partial<InsertCongratsMessage>): Promise<CongratsMessage | undefined> {
    const existingMessage = this.congratsMessages.get(id);
    if (!existingMessage) return undefined;
    
    const updatedMessage = { ...existingMessage, ...message };
    this.congratsMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async deleteCongratsMessage(id: number): Promise<boolean> {
    return this.congratsMessages.delete(id);
  }
  
  // Strategy methods
  async getStrategies(): Promise<Strategy[]> {
    return Array.from(this.strategies.values());
  }
  
  async getStrategy(id: number): Promise<Strategy | undefined> {
    return this.strategies.get(id);
  }
  
  async addStrategy(strategy: InsertStrategy): Promise<Strategy> {
    const id = this.strategyId++;
    const newStrategy: Strategy = {
      ...strategy,
      id,
      userId: null,
      isActive: strategy.isActive !== undefined ? strategy.isActive : true
    };
    this.strategies.set(id, newStrategy);
    return newStrategy;
  }
  
  async updateStrategy(id: number, strategy: Partial<InsertStrategy>): Promise<Strategy | undefined> {
    const existingStrategy = this.strategies.get(id);
    if (!existingStrategy) return undefined;
    
    const updatedStrategy = { ...existingStrategy, ...strategy };
    this.strategies.set(id, updatedStrategy);
    return updatedStrategy;
  }
  
  async deleteStrategy(id: number): Promise<boolean> {
    return this.strategies.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return db.select().from(tasks);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({
        ...task,
        userId: null,
        isCompleted: false,
        createdAt: new Date(),
        completedAt: null
      })
      .returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(task)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask || undefined;
  }

  async completeTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!task) return undefined;

    const [completedTask] = await db
      .update(tasks)
      .set({
        isCompleted: true,
        completedAt: new Date()
      })
      .where(eq(tasks.id, id))
      .returning();

    // Update energy level
    const userSettings = await this.getUserSettings();
    if (userSettings) {
      const newEnergy = Math.max(0, userSettings.energy - task.energyCost);
      await this.updateEnergy(newEnergy);
    }

    return completedTask || undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return !!result;
  }

  // User settings methods
  async getUserSettings(): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings);
    return settings || undefined;
  }

  async updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existingSettings = await this.getUserSettings();
    
    if (existingSettings) {
      const [updatedSettings] = await db
        .update(userSettings)
        .set(settings)
        .where(eq(userSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db
        .insert(userSettings)
        .values({
          userId: null,
          energy: 100,
          theme: "default",
          notificationsCompletion: true,
          notificationsReminders: true,
          notificationsMotivation: true,
          energyResetTime: "05:00",
          ...settings
        })
        .returning();
      return newSettings;
    }
  }

  async updateEnergy(energy: number): Promise<UserSettings | undefined> {
    const existingSettings = await this.getUserSettings();
    if (!existingSettings) return undefined;

    const [updatedSettings] = await db
      .update(userSettings)
      .set({ energy })
      .where(eq(userSettings.id, existingSettings.id))
      .returning();
    return updatedSettings || undefined;
  }

  // Motivational messages methods
  async getMotivationalMessages(): Promise<MotivationalMessage[]> {
    return db.select().from(motivationalMessages);
  }

  async addMotivationalMessage(message: InsertMotivationalMessage): Promise<MotivationalMessage> {
    const [newMessage] = await db
      .insert(motivationalMessages)
      .values({
        ...message,
        userId: null,
        isActive: message.isActive !== undefined ? message.isActive : true
      })
      .returning();
    return newMessage;
  }

  async updateMotivationalMessage(id: number, message: Partial<InsertMotivationalMessage>): Promise<MotivationalMessage | undefined> {
    const [updatedMessage] = await db
      .update(motivationalMessages)
      .set(message)
      .where(eq(motivationalMessages.id, id))
      .returning();
    return updatedMessage || undefined;
  }

  async deleteMotivationalMessage(id: number): Promise<boolean> {
    const result = await db.delete(motivationalMessages).where(eq(motivationalMessages.id, id));
    return !!result;
  }

  // Easy task suggestions methods
  async getEasyTaskSuggestions(): Promise<EasyTaskSuggestion[]> {
    return db.select().from(easyTaskSuggestions);
  }

  async addEasyTaskSuggestion(suggestion: InsertEasyTaskSuggestion): Promise<EasyTaskSuggestion> {
    const [newSuggestion] = await db
      .insert(easyTaskSuggestions)
      .values({
        ...suggestion,
        userId: null,
        isActive: suggestion.isActive !== undefined ? suggestion.isActive : true
      })
      .returning();
    return newSuggestion;
  }

  async updateEasyTaskSuggestion(id: number, suggestion: Partial<InsertEasyTaskSuggestion>): Promise<EasyTaskSuggestion | undefined> {
    const [updatedSuggestion] = await db
      .update(easyTaskSuggestions)
      .set(suggestion)
      .where(eq(easyTaskSuggestions.id, id))
      .returning();
    return updatedSuggestion || undefined;
  }

  async deleteEasyTaskSuggestion(id: number): Promise<boolean> {
    const result = await db.delete(easyTaskSuggestions).where(eq(easyTaskSuggestions.id, id));
    return !!result;
  }
  
  // Congrats messages methods
  async getCongratsMessages(): Promise<CongratsMessage[]> {
    return db.select().from(congratsMessages);
  }
  
  async addCongratsMessage(message: InsertCongratsMessage): Promise<CongratsMessage> {
    const [newMessage] = await db
      .insert(congratsMessages)
      .values({
        ...message,
        userId: null,
        isActive: message.isActive !== undefined ? message.isActive : true
      })
      .returning();
    return newMessage;
  }
  
  async updateCongratsMessage(id: number, message: Partial<InsertCongratsMessage>): Promise<CongratsMessage | undefined> {
    const [updatedMessage] = await db
      .update(congratsMessages)
      .set(message)
      .where(eq(congratsMessages.id, id))
      .returning();
    return updatedMessage || undefined;
  }
  
  async deleteCongratsMessage(id: number): Promise<boolean> {
    const result = await db.delete(congratsMessages).where(eq(congratsMessages.id, id));
    return !!result;
  }
  
  // Strategy methods
  async getStrategies(): Promise<Strategy[]> {
    return db.select().from(strategies);
  }
  
  async getStrategy(id: number): Promise<Strategy | undefined> {
    const [strategy] = await db.select().from(strategies).where(eq(strategies.id, id));
    return strategy || undefined;
  }
  
  async addStrategy(strategy: InsertStrategy): Promise<Strategy> {
    const [newStrategy] = await db
      .insert(strategies)
      .values({
        ...strategy,
        userId: null,
        isActive: strategy.isActive !== undefined ? strategy.isActive : true
      })
      .returning();
    return newStrategy;
  }
  
  async updateStrategy(id: number, strategy: Partial<InsertStrategy>): Promise<Strategy | undefined> {
    const [updatedStrategy] = await db
      .update(strategies)
      .set(strategy)
      .where(eq(strategies.id, id))
      .returning();
    return updatedStrategy || undefined;
  }
  
  async deleteStrategy(id: number): Promise<boolean> {
    const result = await db.delete(strategies).where(eq(strategies.id, id));
    return !!result;
  }
}

export const storage = new DatabaseStorage();
