import database from '../database'; // Import your WatermelonDB instance
import {supabase} from './client';

const syncStories = async () => {
  try {
    const {data: stories, error} = await supabase
      .from('stories')
      .select('*')
      .limit(40); // Fetch the initial 40 stories

    if (error) {
      console.error('Error fetching stories from Supabase:', error);
      return;
    }

    await database.write(async () => {
      const storyCollection = database.get('stories');
      await storyCollection.create(story => {
        story.title = stories[0].title;
        story.content = stories[0].content;
        story.createdAt = stories[0].created_at;
        story.author = stories[0].author;
        story.imageUrl = stories[0].image_url;
      });
    });

    console.log('Successfully synced stories from Supabase to WatermelonDB');
  } catch (error) {
    console.error('Error syncing stories:', error);
  }
};
