import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, IndianRupee, UserPlus, Check } from "lucide-react";

interface CreatorInfoProps {
  creator: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    is_creator?: boolean;
  };
  title: string;
  description?: string | null;
  category: string;
  viewsCount: number;
}

const CreatorInfo = ({
  creator,
  title,
  description,
  category,
  viewsCount,
}: CreatorInfoProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="space-y-3">
      {/* Creator Row */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-instagram p-0.5">
          <div className="w-full h-full rounded-full bg-cinema-dark flex items-center justify-center overflow-hidden">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={creator.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-white">
                {creator.display_name?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              @{creator.display_name}
            </span>
            {creator.is_creator && (
              <span className="px-1.5 py-0.5 bg-gold/20 text-gold text-[10px] font-bold rounded">
                CREATOR
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatCount(viewsCount)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3 h-3" />
              {Math.floor(viewsCount / 10)} coins
            </span>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsFollowing(!isFollowing)}
          className={`rounded-full ${
            isFollowing
              ? "bg-muted text-foreground hover:bg-muted/80"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          {isFollowing ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-1" />
              Follow
            </>
          )}
        </Button>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="font-semibold text-white leading-tight">{title}</h3>
        {description && (
          <p className="text-sm text-white/80 line-clamp-2 mt-1">{description}</p>
        )}
      </div>

      {/* Category Tag */}
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-gradient-instagram text-white text-xs font-medium rounded-full capitalize">
          #{category}
        </span>
      </div>
    </div>
  );
};

export default CreatorInfo;
