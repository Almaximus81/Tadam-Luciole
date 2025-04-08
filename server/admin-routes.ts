import { Router, Request, Response } from 'express';
import { 
  storage,
  DatabaseStorage
} from './storage';
import { seedDatabase } from './seed';
import { migrateData } from './migrate-data';

// Create router
const router = Router();

// Admin authentication middleware
function isAdmin(req: Request, res: Response, next: Function) {
  // For simplicity, we're just using a basic admin check here
  // In a production environment, you would want to implement proper authentication
  const isAdmin = req.headers['x-admin-key'] === 'secret-admin-key';
  
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
  }
  
  next();
}

// Admin routes
router.get('/status', isAdmin, async (req: Request, res: Response) => {
  try {
    // Check if storage is using DatabaseStorage
    const usingDatabase = storage instanceof DatabaseStorage;
    
    res.json({
      status: 'ok',
      usingDatabase,
      message: usingDatabase 
        ? 'L\'application utilise la base de données PostgreSQL.' 
        : 'L\'application utilise le stockage en mémoire.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Une erreur est survenue' });
  }
});

// Seed database with initial data
router.post('/seed', isAdmin, async (req: Request, res: Response) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Base de données initialisée avec succès' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de l\'initialisation de la base de données' });
  }
});

// Migrate data from in-memory to database
router.post('/migrate', isAdmin, async (req: Request, res: Response) => {
  try {
    const result = await migrateData();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Erreur lors de la migration des données' });
  }
});

// Get all motivational messages
router.get('/messages', isAdmin, async (req: Request, res: Response) => {
  try {
    const messages = await storage.getMotivationalMessages();
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la récupération des messages' });
  }
});

// Add a new motivational message
router.post('/messages', isAdmin, async (req: Request, res: Response) => {
  try {
    const { message, isActive } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Le message est requis' });
    }
    
    const newMessage = await storage.addMotivationalMessage({ 
      message, 
      isActive: isActive !== undefined ? isActive : true 
    });
    
    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de l\'ajout du message' });
  }
});

// Update a motivational message
router.patch('/messages/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { message, isActive } = req.body;
    
    const updatedMessage = await storage.updateMotivationalMessage(id, { message, isActive });
    
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    
    res.json(updatedMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la mise à jour du message' });
  }
});

// Delete a motivational message
router.delete('/messages/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteMotivationalMessage(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la suppression du message' });
  }
});

// Get all easy task suggestions
router.get('/suggestions', isAdmin, async (req: Request, res: Response) => {
  try {
    const suggestions = await storage.getEasyTaskSuggestions();
    res.json(suggestions);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la récupération des suggestions' });
  }
});

// Add a new easy task suggestion
router.post('/suggestions', isAdmin, async (req: Request, res: Response) => {
  try {
    const { suggestion, isActive } = req.body;
    
    if (!suggestion) {
      return res.status(400).json({ error: 'La suggestion est requise' });
    }
    
    const newSuggestion = await storage.addEasyTaskSuggestion({ 
      suggestion, 
      isActive: isActive !== undefined ? isActive : true 
    });
    
    res.status(201).json(newSuggestion);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de l\'ajout de la suggestion' });
  }
});

// Update an easy task suggestion
router.patch('/suggestions/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { suggestion, isActive } = req.body;
    
    const updatedSuggestion = await storage.updateEasyTaskSuggestion(id, { suggestion, isActive });
    
    if (!updatedSuggestion) {
      return res.status(404).json({ error: 'Suggestion non trouvée' });
    }
    
    res.json(updatedSuggestion);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la mise à jour de la suggestion' });
  }
});

// Delete an easy task suggestion
router.delete('/suggestions/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteEasyTaskSuggestion(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Suggestion non trouvée' });
    }
    
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la suppression de la suggestion' });
  }
});

// Get all congrats messages
router.get('/congrats', isAdmin, async (req: Request, res: Response) => {
  try {
    const messages = await storage.getCongratsMessages();
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la récupération des messages de félicitations' });
  }
});

// Add a new congrats message
router.post('/congrats', isAdmin, async (req: Request, res: Response) => {
  try {
    const { message, isActive } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Le message est requis' });
    }
    
    const newMessage = await storage.addCongratsMessage({ 
      message, 
      isActive: isActive !== undefined ? isActive : true 
    });
    
    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de l\'ajout du message de félicitations' });
  }
});

// Update a congrats message
router.patch('/congrats/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { message, isActive } = req.body;
    
    const updatedMessage = await storage.updateCongratsMessage(id, { message, isActive });
    
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message de félicitations non trouvé' });
    }
    
    res.json(updatedMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la mise à jour du message de félicitations' });
  }
});

// Delete a congrats message
router.delete('/congrats/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteCongratsMessage(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Message de félicitations non trouvé' });
    }
    
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la suppression du message de félicitations' });
  }
});

// Get all strategies
router.get('/strategies', isAdmin, async (req: Request, res: Response) => {
  try {
    const strategies = await storage.getStrategies();
    res.json(strategies);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la récupération des stratégies' });
  }
});

// Get a strategy by ID
router.get('/strategies/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const strategy = await storage.getStrategy(id);
    
    if (!strategy) {
      return res.status(404).json({ error: 'Stratégie non trouvée' });
    }
    
    res.json(strategy);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la récupération de la stratégie' });
  }
});

// Add a new strategy
router.post('/strategies', isAdmin, async (req: Request, res: Response) => {
  try {
    const { type, title, description, tip, isActive } = req.body;
    
    if (!type || !title || !description || !tip) {
      return res.status(400).json({ error: 'Le type, le titre, la description et le conseil sont requis' });
    }
    
    const newStrategy = await storage.addStrategy({ 
      type, 
      title, 
      description, 
      tip, 
      isActive: isActive !== undefined ? isActive : true 
    });
    
    res.status(201).json(newStrategy);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de l\'ajout de la stratégie' });
  }
});

// Update a strategy
router.patch('/strategies/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { type, title, description, tip, isActive } = req.body;
    
    const updatedStrategy = await storage.updateStrategy(id, { type, title, description, tip, isActive });
    
    if (!updatedStrategy) {
      return res.status(404).json({ error: 'Stratégie non trouvée' });
    }
    
    res.json(updatedStrategy);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la mise à jour de la stratégie' });
  }
});

// Delete a strategy
router.delete('/strategies/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteStrategy(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Stratégie non trouvée' });
    }
    
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erreur lors de la suppression de la stratégie' });
  }
});

export default router;