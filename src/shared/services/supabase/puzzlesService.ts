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
console.log('data initial -->', data, error);
  if (error) {
    console.error('Error fetching puzzles:', error);
    return [];
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
    console.log('data -->',data , error)

  if (error) {
    console.error('Error fetching more puzzles:', error);
    return [];
  }

  return data || [];
}
