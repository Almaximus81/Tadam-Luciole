import { db } from './db';
import { 
  users, userSettings, tasks, motivationalMessages, easyTaskSuggestions, congratsMessages, strategies 
} from '@shared/schema';
import { 
  defaultMotivationalMessages, 
  defaultEasyTaskSuggestions, 
  strategies as strategyData,
  congratsMessages as congratsData 
} from '../client/src/lib/data';
import { log } from './vite';

/**
 * Migrate data from in-memory storage to PostgreSQL database
 */
export async function migrateData() {
  try {
    log('Starting data migration to PostgreSQL...', 'migrate');

    // Insert default settings if none exist
    const settingsCount = await db.select({ id: userSettings.id }).from(userSettings);
    if (settingsCount.length === 0) {
      log('Migrating user settings...', 'migrate');
      await db.insert(userSettings).values({
        energy: 85,
        theme: 'default',
        notificationsCompletion: true,
        notificationsReminders: true,
        notificationsMotivation: true,
        energyResetTime: '05:00',
      });
      log('User settings migrated successfully', 'migrate');
    }

    // Insert motivational messages if none exist
    const messagesCount = await db.select({ id: motivationalMessages.id }).from(motivationalMessages);
    if (messagesCount.length === 0) {
      log('Migrating motivational messages...', 'migrate');
      const messages = defaultMotivationalMessages.map(message => ({ 
        message, 
        isActive: true,
        userId: null
      }));
      await db.insert(motivationalMessages).values(messages);
      log(`${messages.length} motivational messages migrated successfully`, 'migrate');
    }

    // Insert easy task suggestions if none exist
    const suggestionsCount = await db.select({ id: easyTaskSuggestions.id }).from(easyTaskSuggestions);
    if (suggestionsCount.length === 0) {
      log('Migrating easy task suggestions...', 'migrate');
      const suggestions = defaultEasyTaskSuggestions.map(suggestion => ({ 
        suggestion, 
        isActive: true,
        userId: null
      }));
      await db.insert(easyTaskSuggestions).values(suggestions);
      log(`${suggestions.length} easy task suggestions migrated successfully`, 'migrate');
    }

    // Insert congrats messages if none exist
    const congratsCount = await db.select({ id: congratsMessages.id }).from(congratsMessages);
    if (congratsCount.length === 0) {
      log('Migrating congrats messages...', 'migrate');
      const congrats = congratsData.map(message => ({ 
        message, 
        isActive: true,
        userId: null
      }));
      await db.insert(congratsMessages).values(congrats);
      log(`${congrats.length} congrats messages migrated successfully`, 'migrate');
    }

    // Insert strategies if none exist
    const strategiesCount = await db.select({ id: strategies.id }).from(strategies);
    if (strategiesCount.length === 0) {
      log('Migrating strategies...', 'migrate');
      const strategiesArray = Object.entries(strategyData).map(([type, data]) => ({
        type,
        title: data.title,
        description: data.description.replace(/<[^>]*>?/gm, ''), // Strip HTML tags
        tip: data.tip,
        isActive: true,
        userId: null
      }));
      
      await db.insert(strategies).values(strategiesArray);
      log(`${strategiesArray.length} strategies migrated successfully`, 'migrate');
    }

    log('Data migration completed successfully!', 'migrate');
    return { success: true, message: 'Data migration completed successfully' };
  } catch (error: any) {
    const errorMessage = `Error during data migration: ${error.message || 'Unknown error'}`;
    log(errorMessage, 'migrate');
    console.error(error);
    return { success: false, message: errorMessage };
  }
}

// Note: Module ESM doesn't support require.main === module check
// Execute this script directly with: node --loader=tsx server/migrate-data.ts