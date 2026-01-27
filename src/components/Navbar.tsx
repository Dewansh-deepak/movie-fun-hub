import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Search, Menu, X, Crown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shadow-glow">
              <Play className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-gradient leading-none">
                Movie Masti
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">
                Daily Dose of Fun 🎬
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-gold transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Trending
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              My List
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="goldOutline" size="sm" className="gap-2">
              <Crown className="w-4 h-4" />
              Go Premium
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-border/30 animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <a href="#" className="py-2 text-foreground font-medium">Home</a>
            <a href="#" className="py-2 text-muted-foreground">Browse</a>
            <a href="#" className="py-2 text-muted-foreground">Trending</a>
            <a href="#" className="py-2 text-muted-foreground">My List</a>
            <Button variant="gold" className="mt-2 gap-2">
              <Crown className="w-4 h-4" />
              Go Premium
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
