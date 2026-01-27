import { ChevronRight, Sparkles } from "lucide-react";
import VideoCard from "./VideoCard";
import thumbRomance from "@/assets/thumb-romance.jpg";
import thumbHorror from "@/assets/thumb-horror.jpg";
import thumbComedy from "@/assets/thumb-comedy.jpg";
import thumbSuspense from "@/assets/thumb-suspense.jpg";

const freshReleases = [
  {
    id: 1,
    title: "Ishq Ka Jadoo",
    thumbnail: thumbRomance,
    duration: "9 min",
    rating: 4.8,
    genre: "Romance",
    isNew: true,
  },
  {
    id: 2,
    title: "Andhere Ka Saaya",
    thumbnail: thumbHorror,
    duration: "11 min",
    rating: 4.6,
    genre: "Horror",
    isNew: true,
  },
  {
    id: 3,
    title: "Jugaad King",
    thumbnail: thumbComedy,
    duration: "7 min",
    rating: 4.9,
    genre: "Comedy",
    isNew: true,
  },
  {
    id: 4,
    title: "Anjaan Chehra",
    thumbnail: thumbSuspense,
    duration: "13 min",
    rating: 4.7,
    genre: "Suspense",
    isNew: true,
  },
  {
    id: 5,
    title: "Pyaar Ki Kahani",
    thumbnail: thumbRomance,
    duration: "8 min",
    rating: 4.5,
    genre: "Romance",
    isNew: true,
  },
];

const FreshReleasesSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-gold text-sm font-medium">Fresh Daily</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              New Releases
            </h2>
            <p className="text-muted-foreground mt-1">
              रोज़ाना नया content सिर्फ आपके लिए
            </p>
          </div>
          <button className="hidden md:flex items-center gap-1 text-gold hover:text-gold-light transition-colors font-medium">
            View All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {freshReleases.map((video) => (
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
      </div>
    </section>
  );
};

export default FreshReleasesSection;
