import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Play, Eye, Heart, Flame } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

interface Video {
  id: string;
  title: string;
  thumbnail_url: string | null;
  views_count: number;
  likes_count: number;
  creator: { display_name: string; avatar_url: string | null };
}

const Trending = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      const { data } = await supabase
        .from("videos")
        .select(`id, title, thumbnail_url, views_count, likes_count, creator:profiles!videos_creator_id_fkey(display_name, avatar_url)`)
        .eq("is_published", true)
        .order("views_count", { ascending: false })
        .limit(20);

      if (data) {
        setVideos(data.map((v: any) => ({ ...v, creator: Array.isArray(v.creator) ? v.creator[0] : v.creator })));
      }
      setLoading(false);
    };
    fetchTrendingVideos();
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="pt-16 pb-20 px-4">
        <div className="flex items-center gap-2 py-4">
          <Flame className="w-6 h-6 text-accent" />
          <h1 className="font-display text-2xl text-gradient">{t("trendingNow")}</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-32 aspect-video rounded-lg bg-muted" />
                <div className="flex-1 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video, index) => (
              <button key={video.id} onClick={() => navigate("/feed")} className="w-full flex gap-4 group">
                <div className="flex items-center justify-center w-8">
                  <span className={`font-display text-2xl ${index < 3 ? "text-gradient" : "text-muted-foreground"}`}>{index + 1}</span>
                </div>
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  {video.thumbnail_url ? <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-purple flex items-center justify-center"><Play className="w-8 h-8 text-white/50" /></div>}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"><Play className="w-8 h-8 text-white fill-white" /></div>
                  {index < 3 && <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-accent text-[10px] font-bold text-white flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />HOT</div>}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-instagram flex items-center justify-center text-[10px] text-white font-bold">{video.creator?.display_name?.charAt(0).toUpperCase()}</div>
                    <span className="text-xs text-muted-foreground">@{video.creator?.display_name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatCount(video.views_count)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatCount(video.likes_count)}</span>
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

export default Trending;
