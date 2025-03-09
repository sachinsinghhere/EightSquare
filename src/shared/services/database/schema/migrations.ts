import {createTable, schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
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
            {name: 'gameUrl', type: 'string', isOptional: true},
            {name: 'opening_tags', type: 'string', isOptional: true, isIndexed: true},
            // {name: 'created_at', type: 'number'},
            // {name: 'updated_at', type: 'number'},
          ],
        }),
        createTable({
          name: 'stories',
          columns: [
            {name: 'title', type: 'string'},
            {name: 'content', type: 'string'},
            {name: 'created_at', type: 'number'},
            {name: 'author', type: 'string', isOptional: true},
            {name: 'image_url', type: 'string', isOptional: true},
          ],
        }),
      ],
    },
  ],
}); 