import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class Puzzle extends Model {
  static table = 'puzzles';

  @field('puzzle_id') puzzle_id!: string;
  @field('fen') fen!: string;
  @field('moves') moves!: string;
  @field('rating') rating!: number;
  @field('rating_deviation') rating_deviation?: number;
  @field('popularity') popularity?: number;
  @field('nb_plays') nb_plays?: number;
  @field('themes') themes!: string;
  @field('gameUrl') gameUrl?: string;
  @field('opening_tags') opening_tags?: string;
  @field('solved') solved?: boolean;
  // @date('created_at') createdAt!: Date;
  // @date('updated_at') updatedAt!: Date;

  // Computed properties
  get themesList(): string[] {
    return this.themes ? this.themes.split(' ') : [];
  }

  get openingList(): string[] {
    return this.opening_tags ? this.opening_tags.split(' ') : [];
  }

  // Helper to check if puzzle has specific theme
  hasTheme(theme: string): boolean {
    return this.themesList.includes(theme);
  }

  // Helper to check if puzzle has specific opening
  hasOpening(opening: string): boolean {
    return this.openingList.includes(opening);
  }

  // Mark puzzle as solved
  async markAsSolved() {
    await this.update(puzzle => {
      puzzle.solved = true;
    });
  }
}
