import { Button } from "@/components/ui/button";
import { Play, Plus, Star } from "lucide-react";
import heroImage from "@/assets/hero-romance.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-end pb-16 md:pb-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Featured Movie"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-gold/30 mb-4">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse-glow" />
            <span className="text-sm text-gold font-medium">Now Trending</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] mb-4">
            Pyaar Ka
            <span className="block text-gradient">Raaz</span>
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-foreground font-semibold">4.8</span>
            </span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>2024</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span>12 min</span>
            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
            <span className="px-2 py-0.5 bg-secondary rounded text-xs font-medium text-foreground">
              Romance
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            एक अनोखी love story जहाँ दो अजनबी destiny के खेल में मिलते हैं। क्या होगा जब secrets सामने आएंगे?
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" className="gap-3">
              <Play className="w-5 h-5 fill-current" />
              Watch Now
            </Button>
            <Button variant="glass" size="xl" className="gap-2">
              <Plus className="w-5 h-5" />
              My List
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
