import { ENV } from "./env.js";
import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const searchVideo = async (topic) => {
    try {
        let query = `free code camp ${topic}`;

        let { data } = await axios.get(BASE_URL, {
            params: {
                key: ENV.YOUTUBE_API_KEY,
                part: "snippet",
                q: query,
                maxResults: 1,
                type: "video"
            }
        });

        if (data.items.length > 0) {
            const video = data.items[0];

            if (
                video.snippet.channelTitle
                    .toLowerCase()
                    .includes("freecodecamp.org")
            ) {
                return {
                    title: video.snippet.title,
                    channel: video.snippet.channelTitle,
                    url: `https://www.youtube.com/watch?v=${video.id.videoId}`
                };
            }
        }

        // Fallback search
        const fallbackQuery = `${topic} tutorial`;

        const { data: fallbackData } = await axios.get(BASE_URL, {
            params: {
                key: ENV.YOUTUBE_API_KEY,
                part: "snippet",
                q: fallbackQuery,
                maxResults: 1,
                type: "video"
            }
        });

        if (fallbackData.items.length > 0) {
            const video = fallbackData.items[0];

            return {
                title: video.snippet.title,
                channel: video.snippet.channelTitle,
                url: `https://www.youtube.com/watch?v=${video.id.videoId}`
            };
        }

        return null;

    } catch (error) {
        console.error("YouTube search error:", error.response?.data || error.message);
        return null;
    }
};

export default searchVideo;