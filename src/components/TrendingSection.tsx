import { ChevronRight } from "lucide-react";
import VideoCard from "./VideoCard";
import thumbRomance from "@/assets/thumb-romance.jpg";
import thumbHorror from "@/assets/thumb-horror.jpg";
import thumbComedy from "@/assets/thumb-comedy.jpg";
import thumbSuspense from "@/assets/thumb-suspense.jpg";

const trendingVideos = [
  {
    id: 1,
    title: "Dil Ki Baatein",
    thumbnail: thumbRomance,
    duration: "8 min",
    rating: 4.9,
    genre: "Romance",
    isNew: true,
  },
  {
    id: 2,
    title: "Bhoot Bangla",
    thumbnail: thumbHorror,
    duration: "12 min",
    rating: 4.7,
    genre: "Horror",
    isNew: false,
  },
  {
    id: 3,
    title: "Hasi Toh Phasi",
    thumbnail: thumbComedy,
    duration: "6 min",
    rating: 4.8,
    genre: "Comedy",
    isNew: true,
  },
  {
    id: 4,
    title: "Kaun Hai Wo",
    thumbnail: thumbSuspense,
    duration: "15 min",
    rating: 4.6,
    genre: "Suspense",
    isNew: false,
  },
  {
    id: 5,
    title: "Mohabbat Zindabad",
    thumbnail: thumbRomance,
    duration: "10 min",
    rating: 4.5,
    genre: "Romance",
    isNew: false,
  },
  {
    id: 6,
    title: "Raaz Ki Raat",
    thumbnail: thumbHorror,
    duration: "14 min",
    rating: 4.4,
    genre: "Horror",
    isNew: true,
  },
];

const TrendingSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              Trending Now 🔥
            </h2>
            <p className="text-muted-foreground mt-1">
              आज का most watched content
            </p>
          </div>
          <button className="hidden md:flex items-center gap-1 text-gold hover:text-gold-light transition-colors font-medium">
            View All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {trendingVideos.map((video) => (
            <VideoCard
              key={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              rating={video.rating}
              genre={video.genre}
              isNew={video.isNew}
            />
          ))}
        </div>

        <button className="md:hidden flex items-center gap-1 text-gold mt-4 font-medium">
          View All
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default TrendingSection;
