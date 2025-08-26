import User from "../components/user";
import {cache} from 'react'

const fetchVideoData = cache(async (video_id) => {
  let videoData = {
    id: null,
    username: "",
    tags: [],
    music: "",
    videoUrl: "",
    imageUrl: "",
    title: "",
    description: "",
  };
  
  try {
    const response = await fetch(`https://api.carets.tv/api/v1/videos/singleVideo/${video_id}`, {
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const { data: video } = await response.json();

    videoData = {
      id: video.id || null,
      username: video.users?.[0]?.username || "",
      tags: video.video_description ? video.video_description.split(" ") : [],
      music: video.sounds?.[0]?.name || "",
      videoUrl: video.video_url || "",
      imageUrl: video.image_url || "",
      title: video.video_title || "",
      description: video.video_description || "",
    };
  } catch (error) {
    console.error("Error fetching video:", error);
  }

  return videoData;
});

export async function generateMetadata({ searchParams }) {
    const {video_id} = searchParams;
  
    const videoData = await fetchVideoData(video_id);

    return {
        title: "Video Page",
        openGraph: {
            title: videoData.title,
            type: "video.other",
            description: videoData.description,
            url: `https://carets.tv/videos?video_id=${videoData.id}`,
            images: [
                {
                type: "image/png",
                url: "https://carets.tv/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F11.d4f9b12c.png&w=384&q=75",
                secureUrl: "https://carets.tv/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F11.d4f9b12c.png&w=384&q=75",
                width: 400,
                height: 300,
                },
            ],
            videos: [
                {
                type: "video/mp4",
                url: videoData.videoUrl,
                secureUrl: videoData.videoUrl,
                width: 1200,
                height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: videoData.title,
            description: videoData.description,
            image: "https://carets.tv/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F11.d4f9b12c.png&w=384&q=75",
            player: {
                url: `https://carets.tv/videos?video_id=${videoData.id}`,
                width: 1200,
                height: 630,
            },
        },
    };
}

export default async function VideoPage({ searchParams }) {
    const {video_id} = searchParams;
    const videoData = await fetchVideoData(video_id);

    return (
      <>
        <div className="customContainer">
            <div className="mt-14">
                <User data={videoData} />
            </div>
        </div>
      </>
    );
}
