import { Heart, MessageCircle, Send, UserPlus, Bookmark, IndianRupee } from "lucide-react";
import { useState } from "react";

interface VideoActionsProps {
  videoId: string;
  likesCount: number;
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  commentsCount?: number;
  coinsEarned?: number;
}

const VideoActions = ({
  videoId,
  likesCount,
  isLiked,
  onLike,
  onShare,
  commentsCount = 0,
  coinsEarned = 0,
}: VideoActionsProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Like */}
      <button
        onClick={onLike}
        className="flex flex-col items-center gap-1 group"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isLiked
              ? "bg-accent text-white scale-110"
              : "bg-foreground/10 backdrop-blur-sm text-white hover:bg-foreground/20"
          }`}
        >
          <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
        </div>
        <span className="text-xs font-medium text-white">
          {formatCount(likesCount)}
        </span>
      </button>

      {/* Comment */}
      <button className="flex flex-col items-center gap-1 group">
        <div className="w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-foreground/20">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-medium text-white">
          {formatCount(commentsCount)}
        </span>
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-foreground/20">
          <Send className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-medium text-white">Share</span>
      </button>

      {/* Save */}
      <button
        onClick={() => setIsSaved(!isSaved)}
        className="flex flex-col items-center gap-1 group"
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isSaved
              ? "bg-gold text-secondary-foreground"
              : "bg-foreground/10 backdrop-blur-sm text-white hover:bg-foreground/20"
          }`}
        >
          <Bookmark className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
        </div>
        <span className="text-xs font-medium text-white">Save</span>
      </button>

      {/* Coins Earned (visible to creator) */}
      {coinsEarned > 0 && (
        <div className="flex flex-col items-center gap-1 mt-2">
          <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center animate-bounce-subtle">
            <IndianRupee className="w-5 h-5 text-secondary-foreground" />
          </div>
          <span className="text-xs font-bold text-gold">
            +{coinsEarned}
          </span>
        </div>
      )}
    </div>
  );
};

export default VideoActions;
