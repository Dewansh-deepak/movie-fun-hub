import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Eye, Heart } from "lucide-react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  thumbnail_url: string | null;
  views_count: number;
  likes_count: number;
  creator: {
    display_name: string;
  };
}

const Shorts = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          id, title, thumbnail_url, views_count, likes_count,
          creator:profiles!videos_creator_id_fkey(display_name)
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(30);

      if (data) {
        const transformedVideos = data.map((video: any) => ({
          ...video,
          creator: Array.isArray(video.creator) ? video.creator[0] : video.creator
        }));
        setVideos(transformedVideos);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className="pt-16 pb-20 px-2">
        <h1 className="font-display text-2xl text-gradient px-2 py-4">
          Creator Shorts
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => navigate("/feed")}
                className="relative aspect-[9/16] rounded-xl overflow-hidden group"
              >
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-purple flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/50" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                    {video.title}
                  </p>
                  <p className="text-white/70 text-xs">
                    @{video.creator?.display_name}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatCount(video.views_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatCount(video.likes_count)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Shorts;
