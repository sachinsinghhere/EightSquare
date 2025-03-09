import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import migrations from './schema/migrations';
import Puzzle from './models/puzzle';
import Story from './models/story';
import {
  fetchInitialPuzzles,
  fetchMorePuzzles,
} from '../supabase/puzzlesService';

/**
 * Initialize WatermelonDB with SQLite adapter
 * This setup includes:
 * - Schema validation
 * - Migrations support
 * - Native optimizations (JSI)
 * - Migration event logging
 */
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true, // Enable native optimizations
  migrationEvents: {
    onStart: () => console.log('Migration starting...'),
    onSuccess: () => console.log('Migration successful'),
    onError: (error: Error) => console.error('Migration failed:', error),
  },
});

/**
 * Database instance with model classes
 * This is the main entry point for database operations
 */
export const database = new Database({
  adapter,
  modelClasses: [Puzzle, Story],
});

/**
 * Syncs puzzles from remote source to local database
 * @returns Promise<boolean> Success status of the sync operation
 */
export async function syncPuzzlesToLocal(): Promise<boolean> {
  try {
    let existingCount = await database.get('puzzles').query().fetchCount();
    console.log('existingCount ', existingCount);

    // Check if we have any puzzles with opening tags
    if (existingCount > 0) {
      const puzzlesWithOpenings = await database
        .get<Puzzle>('puzzles')
        .query()
        .fetch()
        .then(puzzles => puzzles.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY').length);
      
      console.log('Existing puzzles with opening tags:', puzzlesWithOpenings);
      
      // If we have puzzles but none with opening tags, we should resync
      if (puzzlesWithOpenings === 0) {
        console.log('No puzzles with opening tags found, forcing resync...');
        // Clear existing puzzles
        await database.write(async () => {
          await database.get('puzzles').query().destroyAllPermanently();
        });
        existingCount = 0;
      }
    }

    if (existingCount === 0) {
      console.log('Fetching puzzles from Supabase...');
      const puzzles = await fetchInitialPuzzles();
      console.log('Received puzzles from Supabase:', puzzles.length);

      if (puzzles.length > 0) {
        await database.write(async () => {
          const puzzlesCollection = database.get<Puzzle>('puzzles');
          const puzzlesToCreate = puzzles.map(puzzle => 
            puzzlesCollection.prepareCreate((record: Puzzle) => {
              record.puzzle_id = puzzle.puzzle_id;
              record.fen = puzzle.fen;
              record.moves = puzzle.moves;
              record.rating = parseInt(puzzle.rating.toString());
              record.themes = puzzle.themes || '';
              record.opening_tags = (puzzle.opening_tags && puzzle.opening_tags !== 'EMPTY') 
                ? puzzle.opening_tags 
                : '';
            })
          );

          await database.batch(...puzzlesToCreate);
          console.log(`Successfully imported ${puzzlesToCreate.length} puzzles`);
          const withOpenings = puzzles.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY').length;
          console.log(`Puzzles with opening tags: ${withOpenings}/${puzzles.length}`);
          
          if (withOpenings === 0) {
            console.warn('Warning: No puzzles with opening tags were found in the Supabase data');
          }
        });
      } else {
        console.error('No puzzles received from Supabase');
        return false;
      }
    } else {
      console.log(`Found ${existingCount} puzzles in local database`);
    }

    return true;
  } catch (error) {
    console.error('Error syncing puzzles:', error);
    return false;
  }
}

/**
 * Loads additional puzzles into the database
 * @param offset Starting position for fetching puzzles
 * @param limit Maximum number of puzzles to fetch
 * @returns Promise<number> Number of puzzles loaded
 */
export async function loadMorePuzzles(
  offset: number = 1000,
  limit: number = 1000,
): Promise<number> {
  try {
    const morePuzzles = await fetchMorePuzzles(offset, limit);

    if (morePuzzles.length > 0) {
      await database.write(async () => {
        const puzzlesCollection = database.get<Puzzle>('puzzles');
        const puzzlesToCreate = morePuzzles.map(puzzle =>
          puzzlesCollection.prepareCreate((record: Puzzle) => {
            record.puzzle_id = puzzle.puzzle_id;
            record.fen = puzzle.fen;
            record.moves = puzzle.moves;
            record.rating = parseInt(puzzle.rating.toString());
            record.themes = puzzle.themes || '';
            record.opening_tags = (puzzle.opening_tags && puzzle.opening_tags !== 'EMPTY') 
              ? puzzle.opening_tags 
              : '';
          })
        );

        await database.batch(...puzzlesToCreate);
        console.log(`Loaded ${puzzlesToCreate.length} more puzzles`);
        const withOpenings = morePuzzles.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY').length;
        console.log(`Additional puzzles with opening tags: ${withOpenings}/${morePuzzles.length}`);
      });
    }

    return morePuzzles.length;
  } catch (error) {
    console.error('Error loading more puzzles:', error);
    return 0;
  }
} 