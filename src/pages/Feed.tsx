import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import VideoActions from "@/components/VideoActions";
import CreatorInfo from "@/components/CreatorInfo";

interface Video {
  id: string;
  title: string;
  description: string | null;
  cloudinary_url: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  category: string;
  views_count: number;
  likes_count: number;
  created_at: string;
  creator: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    is_creator?: boolean;
  };
}

const Feed = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState<string>("all");
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  const fetchVideos = useCallback(async () => {
    let query = supabase
      .from("videos")
      .select(`
        id, title, description, cloudinary_url, thumbnail_url,
        duration_seconds, category, views_count, likes_count, created_at,
        creator:profiles!videos_creator_id_fkey(id, display_name, avatar_url, is_creator)
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (category !== "all" && ["drama", "horror", "comedy", "romance"].includes(category)) {
      query = query.eq("category", category as "drama" | "horror" | "comedy" | "romance");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
    } else if (data) {
      const transformedVideos = data.map((video: any) => ({
        ...video,
        creator: Array.isArray(video.creator) ? video.creator[0] : video.creator
      }));
      setVideos(transformedVideos);
    }
    setLoading(false);
  }, [category]);

  const fetchLikedVideos = useCallback(async () => {
    if (!profile) return;

    const { data } = await supabase
      .from("video_likes")
      .select("video_id")
      .eq("profile_id", profile.id);

    if (data) {
      setLikedVideos(new Set(data.map((like) => like.video_id)));
    }
  }, [profile]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    if (profile) {
      fetchLikedVideos();
    }
  }, [profile, fetchLikedVideos]);

  // Record view when video changes
  useEffect(() => {
    if (videos.length === 0) return;
    const currentVideo = videos[currentIndex];
    if (!currentVideo) return;

    const recordView = async () => {
      try {
        await supabase.functions.invoke("record-view", {
          body: { video_id: currentVideo.id },
        });
      } catch (error) {
        console.error("Failed to record view:", error);
      }
    };

    const timer = setTimeout(recordView, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, videos]);

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "down" && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Touch/scroll handling with left/right swipe for navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let startX = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = startY - e.changedTouches[0].clientY;
      const deltaX = startX - e.changedTouches[0].clientX;
      const deltaTime = Date.now() - startTime;
      const velocityY = Math.abs(deltaY / deltaTime);
      const velocityX = Math.abs(deltaX / deltaTime);

      // Horizontal swipe detection (left = back, right = settings)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 80) {
        if (deltaX < 0) {
          // Swipe right - go back to welcome
          window.location.href = "/";
        } else if (deltaX > 0) {
          // Swipe left - go to settings (dashboard for now)
          window.location.href = "/dashboard";
        }
        return;
      }

      // Vertical swipe for video navigation
      if (Math.abs(deltaY) > 50 || velocityY > 0.3) {
        if (deltaY > 0) {
          handleScroll("down");
        } else {
          handleScroll("up");
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) {
        handleScroll("down");
      } else if (e.deltaY < -30) {
        handleScroll("up");
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex, videos.length]);

  const toggleLike = async (videoId: string) => {
    if (!profile) {
      toast.error("Please login to like videos");
      return;
    }

    const isLiked = likedVideos.has(videoId);

    if (isLiked) {
      await supabase
        .from("video_likes")
        .delete()
        .eq("video_id", videoId)
        .eq("profile_id", profile.id);

      setLikedVideos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, likes_count: v.likes_count - 1 } : v
        )
      );
    } else {
      await supabase
        .from("video_likes")
        .insert({ video_id: videoId, profile_id: profile.id });

      setLikedVideos((prev) => new Set(prev).add(videoId));

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, likes_count: v.likes_count + 1 } : v
        )
      );
    }
  };

  const handleShare = async (video: Video) => {
    const shareUrl = `${window.location.origin}/watch/${video.id}`;
    
    if (navigator.share) {
      await navigator.share({
        title: video.title,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!");
    }
  };

  const currentVideo = videos[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-instagram animate-pulse" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar showCategories category={category} setCategory={setCategory} />
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <p className="text-muted-foreground mb-4">No videos yet in this category</p>
          <button
            onClick={() => setCategory("all")}
            className="px-6 py-2 rounded-full bg-gradient-instagram text-white font-medium"
          >
            View All Videos
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-dark">
      <TopBar showCategories category={category} setCategory={setCategory} />

      <div
        ref={containerRef}
        className="h-screen overflow-hidden relative pt-[100px] pb-16"
      >
        <div
          className="transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="h-full relative flex items-center justify-center bg-cinema-dark"
            >
              {Math.abs(index - currentIndex) <= 1 && (
                <>
                  <video
                    ref={index === currentIndex ? videoRef : null}
                    src={video.cloudinary_url}
                    className="h-full w-full object-contain"
                    loop
                    playsInline
                    muted={isMuted}
                    autoPlay={index === currentIndex && isPlaying}
                    poster={video.thumbnail_url || undefined}
                    onClick={() => {
                      if (videoRef.current) {
                        if (isPlaying) {
                          videoRef.current.pause();
                        } else {
                          videoRef.current.play();
                        }
                        setIsPlaying(!isPlaying);
                      }
                    }}
                  />

                  {/* Play/Pause Overlay */}
                  {!isPlaying && index === currentIndex && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-cinema-dark via-cinema-dark/60 to-transparent pointer-events-none" />

                  {/* Video Info */}
                  <div className="absolute bottom-20 left-0 right-16 p-4">
                    <CreatorInfo
                      creator={video.creator}
                      title={video.title}
                      description={video.description}
                      category={video.category}
                      viewsCount={video.views_count}
                    />
                  </div>

                  {/* Side Actions */}
                  <div className="absolute right-3 bottom-28">
                    <VideoActions
                      videoId={video.id}
                      likesCount={video.likes_count}
                      isLiked={likedVideos.has(video.id)}
                      onLike={() => toggleLike(video.id)}
                      onShare={() => handleShare(video)}
                      coinsEarned={profile?.id === video.creator.id ? Math.floor(video.views_count / 10) : 0}
                    />
                  </div>

                  {/* Mute Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Feed;
