import { Play, Star, Clock } from "lucide-react";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  rating: number;
  genre: string;
  isNew?: boolean;
}

const VideoCard = ({
  title,
  thumbnail,
  duration,
  rating,
  genre,
  isNew = false,
}: VideoCardProps) => {
  return (
    <div className="group relative flex-shrink-0 w-[160px] md:w-[200px] cursor-pointer">
      {/* Thumbnail Container */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-card">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-transparent opacity-60" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {isNew && (
            <span className="px-2 py-0.5 bg-crimson rounded text-[10px] font-bold uppercase tracking-wide text-foreground">
              New
            </span>
          )}
          <span className="px-2 py-0.5 bg-cinema-dark/80 backdrop-blur rounded text-[10px] font-medium text-foreground flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {duration}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-cinema-dark/80 backdrop-blur rounded">
          <Star className="w-3 h-3 text-gold fill-gold" />
          <span className="text-xs font-semibold text-foreground">{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-foreground text-sm md:text-base leading-tight line-clamp-2 mb-1 group-hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{genre}</p>
      </div>
    </div>
  );
};

export default VideoCard;
