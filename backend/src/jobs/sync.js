import cron from 'node-cron';
import axios from 'axios';
import Video from '../models/Video.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const syncYouTube = async () => {
  try {
    const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'contentDetails',
        id: process.env.YOUTUBE_CHANNEL_ID,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    const playlistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

    const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId,
        maxResults: 10,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    for (const item of videosRes.data.items) {
      const { resourceId, title, thumbnails, publishedAt } = item.snippet;
      await Video.findOneAndUpdate(
        { youtubeId: resourceId.videoId },
        { youtubeId: resourceId.videoId, title, thumbnail: thumbnails?.high?.url, publishedAt },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log('YouTube sync complete');
  } catch (err) {
    console.error('YouTube sync error:', err.message);
  }
};

const weeklyReset = async () => {
  try {
    await User.updateMany({}, { streak: 0 });
    await Video.updateMany({}, { isActive: false });
    console.log('Weekly reset complete');
  } catch (err) {
    console.error('Weekly reset error:', err.message);
  }
};

cron.schedule('0 * * * *', syncYouTube);
cron.schedule('0 0 * * 0', weeklyReset);

syncYouTube();