import { supabase } from "./client";

// Type for puzzle data from Supabase
export interface PuzzleData {
  puzzle_id: string;
  fen: string;
  moves: string;
  rating: number;
  rating_deviation?: number;
  popularity?: number;
  nb_plays?: number;
  themes: string;
  gameUrl?: string;
  opening_tags?: string;
}

// Initialize Supabase client

// Fetch initial batch of puzzles
export async function fetchInitialPuzzles(): Promise<PuzzleData[]> {
  const {data, error} = await supabase
    .from('puzzles')
    .select('*')
    .order('puzzle_id')
    .limit(1000);

  if (error) {
    console.error('Error fetching puzzles:', error);
    return [];
  }

  // Log raw data sample
  if (data && data.length > 0) {
    console.log('Raw data sample from Supabase:');
    console.log('First puzzle:', JSON.stringify(data[0], null, 2));
    
    // Log opening tags from first few puzzles
    console.log('Opening tags from first 5 puzzles:');
    data.slice(0, 5).forEach((p, i) => {
      console.log(`Puzzle ${i + 1} opening_tags:`, p.opening_tags);
    });

    // Log distribution stats
    const withOpenings = data.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY').length;
    const emptyTags = data.filter(p => !p.opening_tags || p.opening_tags === 'EMPTY').length;
    console.log('\nOpening tags distribution:');
    console.log(`- With openings: ${withOpenings}/${data.length}`);
    console.log(`- Empty/no tags: ${emptyTags}/${data.length}`);

    if (withOpenings > 0) {
      const uniqueOpenings = new Set(
        data
          .filter(p => p.opening_tags && p.opening_tags !== 'EMPTY')
          .flatMap(p => p.opening_tags!.split(' '))
      );
      console.log('\nUnique openings found:', Array.from(uniqueOpenings));
    }
  } else {
    console.log('No data received from Supabase');
  }

  return data || [];
}

// Fetch more puzzles with pagination
export async function fetchMorePuzzles(
  offset: number = 1000,
  limit: number = 1000,
): Promise<PuzzleData[]> {
  const {data, error} = await supabase
    .from('puzzles')
    .select('*')
    .order('puzzle_id')
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching more puzzles:', error);
    return [];
  }

  // Log opening tags distribution
  if (data) {
    const withOpenings = data.filter(p => p.opening_tags && p.opening_tags !== 'EMPTY').length;
    console.log(`Additional fetch - Opening tags distribution:`);
    console.log(`With openings: ${withOpenings}/${data.length}`);
    const uniqueOpenings = new Set(
      data
        .filter(p => p.opening_tags && p.opening_tags !== 'EMPTY')
        .flatMap(p => p.opening_tags!.split(' '))
    );
    console.log('Additional unique openings found:', Array.from(uniqueOpenings));
  }

  return data || [];
}
