import {Model} from '@nozbe/watermelondb';
import {field, text, date} from '@nozbe/watermelondb/decorators';

export default class Puzzle extends Model {
  static table = 'puzzles';

  @text('puzzle_id') puzzleId!: string;
  @text('fen') fen!: string;
  @text('moves') moves!: string;
  @field('rating') rating!: number;
  @field('rating_deviation') ratingDeviation?: number;
  @field('popularity') popularity?: number;
  @field('nb_plays') nbPlays?: number;
  @text('themes') themes!: string;
  @text('game_url') gameUrl?: string;
  @text('opening_tags') openingTags?: string;
  // @date('created_at') createdAt!: Date;
  // @date('updated_at') updatedAt!: Date;

  // Computed properties
  get themesList(): string[] {
    return this.themes ? this.themes.split(' ') : [];
  }

  get openingList(): string[] {
    return this.openingTags ? this.openingTags.split(' ') : [];
  }

  // Helper to check if puzzle has specific theme
  hasTheme(theme: string): boolean {
    return this.themesList.includes(theme);
  }

  // Helper to check if puzzle has specific opening
  hasOpening(opening: string): boolean {
    return this.openingList.includes(opening);
  }
}
