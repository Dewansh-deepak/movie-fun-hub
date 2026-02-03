import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart, MessageCircle, Share2, Coins, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import FeedNavbar from "@/components/FeedNavbar";

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
  const { profile, session } = useAuth();

  const fetchVideos = useCallback(async () => {
    let query = supabase
      .from("videos")
      .select(`
        id, title, description, cloudinary_url, thumbnail_url,
        duration_seconds, category, views_count, likes_count, created_at,
        creator:profiles!videos_creator_id_fkey(id, display_name, avatar_url)
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
      // Transform the data to match our interface
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

    // Record view after 3 seconds of watching
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

  // Touch/scroll handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = startY - e.changedTouches[0].clientY;
      const deltaTime = Date.now() - startTime;
      const velocity = Math.abs(deltaY / deltaTime);

      if (Math.abs(deltaY) > 50 || velocity > 0.3) {
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
        <div className="animate-pulse text-gold">Loading videos...</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <FeedNavbar category={category} setCategory={setCategory} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center p-4">
          <p className="text-muted-foreground mb-4">No videos yet in this category</p>
          <Button variant="gold" onClick={() => setCategory("all")}>
            View All Videos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FeedNavbar category={category} setCategory={setCategory} />

      <div
        ref={containerRef}
        className="h-[calc(100vh-64px)] overflow-hidden relative"
      >
        {/* Video Container */}
        <div
          className="transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="h-[calc(100vh-64px)] relative flex items-center justify-center bg-cinema-dark"
            >
              {Math.abs(index - currentIndex) <= 1 && (
                <>
                  <video
                    ref={index === currentIndex ? videoRef : null}
                    src={video.cloudinary_url}
                    className="h-full w-full object-contain max-w-md mx-auto"
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                      <Play className="w-16 h-16 text-white/80 fill-white/80" />
                    </div>
                  )}

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="max-w-md mx-auto">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-sm font-bold">
                          {video.creator?.display_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            @{video.creator?.display_name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            Creator
                          </p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-gold/20 text-gold rounded capitalize">
                          {video.category}
                        </span>
                        <span>{video.views_count.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Side Actions */}
                  <div className="absolute right-4 bottom-24 flex flex-col gap-4">
                    <button
                      onClick={() => toggleLike(video.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          likedVideos.has(video.id)
                            ? "bg-crimson text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            likedVideos.has(video.id) ? "fill-current" : ""
                          }`}
                        />
                      </div>
                      <span className="text-xs text-foreground">
                        {video.likes_count}
                      </span>
                    </button>

                    <button
                      onClick={() => handleShare(video)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Share2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-foreground">Share</span>
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        {isMuted ? (
                          <VolumeX className="w-6 h-6 text-white" />
                        ) : (
                          <Volume2 className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-foreground">
                        {isMuted ? "Unmute" : "Mute"}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {videos.slice(0, 10).map((_, index) => (
            <div
              key={index}
              className={`w-1 h-4 rounded-full transition-colors ${
                index === currentIndex ? "bg-gold" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
