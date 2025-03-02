// models/Story.js
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Story extends Model {
  static table = 'stories';

  @field('title') title;
  @field('content') content;
  @field('created_at') createdAt;
  @field('author') author;
  @field('image_url') imageUrl;
}

export default Story;