import { Heart, Ghost, Search, Laugh } from "lucide-react";

const genres = [
  {
    name: "Romance",
    hindiName: "रोमांस",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    count: "120+",
  },
  {
    name: "Horror",
    hindiName: "डरावनी",
    icon: Ghost,
    color: "from-emerald-500 to-teal-600",
    count: "85+",
  },
  {
    name: "Suspense",
    hindiName: "रहस्य",
    icon: Search,
    color: "from-blue-500 to-indigo-600",
    count: "95+",
  },
  {
    name: "Comedy",
    hindiName: "कॉमेडी",
    icon: Laugh,
    color: "from-amber-500 to-orange-600",
    count: "150+",
  },
];

const GenreSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              Browse by Genre
            </h2>
            <p className="text-muted-foreground mt-1">
              अपना favourite genre चुनो
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.name}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80`} />
              <div className="absolute inset-0 bg-cinema-dark/20 group-hover:bg-cinema-dark/10 transition-colors" />
              
              <div className="relative p-6 md:p-8 flex flex-col h-32 md:h-40">
                <genre.icon className="w-8 h-8 text-foreground mb-auto" />
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-foreground">
                    {genre.name}
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    {genre.hindiName} • {genre.count} videos
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreSection;
