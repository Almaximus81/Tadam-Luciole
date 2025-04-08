import { db } from './db';
import { log } from './vite';
import { 
  motivationalMessages, 
  easyTaskSuggestions, 
  congratsMessages, 
  strategies,
  userSettings
} from '@shared/schema';
import { defaultMotivationalMessages, defaultEasyTaskSuggestions, strategies as strategyData, congratsMessages as congratsData } from '../client/src/lib/data';

/**
 * Seed the database with initial data
 */
export async function seedDatabase() {
  try {
    log('Starting database seeding...', 'seed');

    // Check if settings already exist
    const settingsCount = await db.select({ id: userSettings.id })
      .from(userSettings);

    if (settingsCount.length === 0) {
      // Insert default settings
      await db.insert(userSettings).values({
        energy: 100,
        theme: 'default',
        notificationsCompletion: true,
        notificationsReminders: true,
        notificationsMotivation: true,
        energyResetTime: '05:00',
      });
      log('Default user settings created', 'seed');
    }

    // Check if motivational messages exist
    const messagesCount = await db.select({ id: motivationalMessages.id })
      .from(motivationalMessages);

    if (messagesCount.length === 0) {
      // Insert default motivational messages
      const messages = defaultMotivationalMessages.map(message => ({ 
        message, 
        isActive: true, 
        userId: null 
      }));
      await db.insert(motivationalMessages).values(messages);
      log(`${messages.length} motivational messages inserted`, 'seed');
    }

    // Check if easy task suggestions exist
    const suggestionsCount = await db.select({ id: easyTaskSuggestions.id })
      .from(easyTaskSuggestions);
    
    if (suggestionsCount.length === 0) {
      // Insert default easy task suggestions
      const suggestions = defaultEasyTaskSuggestions.map(suggestion => ({ 
        suggestion,
        isActive: true,
        userId: null
      }));
      await db.insert(easyTaskSuggestions).values(suggestions);
      log(`${suggestions.length} easy task suggestions inserted`, 'seed');
    }

    // Check if congrats messages exist
    const congratsCount = await db.select({ id: congratsMessages.id })
      .from(congratsMessages);
    
    if (congratsCount.length === 0) {
      // Insert default congrats messages
      const congrats = congratsData.map(message => ({ 
        message,
        isActive: true,
        userId: null
      }));
      await db.insert(congratsMessages).values(congrats);
      log(`${congrats.length} congratulation messages inserted`, 'seed');
    }

    // Check if strategies exist
    const strategiesCount = await db.select({ id: strategies.id })
      .from(strategies);
    
    if (strategiesCount.length === 0) {
      // Insert default strategies
      const strategiesArray = Object.entries(strategyData).map(([type, data]) => ({
        type,
        title: data.title,
        // Strip HTML tags for storage
        description: data.description.replace(/<[^>]*>?/gm, ''),
        tip: data.tip,
        isActive: true,
        userId: null
      }));
      
      await db.insert(strategies).values(strategiesArray);
      log(`${strategiesArray.length} strategies inserted`, 'seed');
    }

    log('Database seeding completed successfully!', 'seed');
  } catch (error: any) {
    log(`Error seeding database: ${error.message || 'Unknown error'}`, 'seed');
    console.error(error);
  }
}