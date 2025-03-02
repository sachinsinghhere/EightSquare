import {appSchema, tableSchema} from '@nozbe/watermelondb';

/**
 * Puzzle table schema
 * Defines the structure for storing chess puzzles
 */
const puzzleSchema = tableSchema({
  name: 'puzzles',
  columns: [
    {name: 'puzzle_id', type: 'string'},
    {name: 'fen', type: 'string'},
    {name: 'moves', type: 'string'},
    {name: 'rating', type: 'number', isIndexed: true},
    {name: 'rating_deviation', type: 'number', isOptional: true},
    {name: 'popularity', type: 'number', isOptional: true},
    {name: 'nb_plays', type: 'number', isOptional: true},
    {name: 'themes', type: 'string', isIndexed: true},
    {name: 'game_url', type: 'string', isOptional: true},
    {name: 'opening_tags', type: 'string', isOptional: true, isIndexed: true},
    // {name: 'created_at', type: 'number'},
    // {name: 'updated_at', type: 'number'},
  ],
});

/**
 * Story table schema
 * Defines the structure for storing chess stories/lessons
 */
const storySchema = tableSchema({
  name: 'stories',
  columns: [
    {name: 'title', type: 'string'},
    {name: 'content', type: 'string'},
    {name: 'created_at', type: 'number'},
    {name: 'author', type: 'string', isOptional: true},
    {name: 'image_url', type: 'string', isOptional: true},
  ],
});

/**
 * Main database schema
 * Version 2 includes both puzzles and stories tables
 */
const schema = appSchema({
  version: 2,
  tables: [puzzleSchema, storySchema],
});

export default schema;
