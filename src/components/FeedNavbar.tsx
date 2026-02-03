import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Search, User, Upload, Coins, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface FeedNavbarProps {
  category: string;
  setCategory: (category: string) => void;
}

const categories = [
  { id: "all", label: "For You" },
  { id: "drama", label: "Drama" },
  { id: "horror", label: "Horror" },
  { id: "comedy", label: "Comedy" },
  { id: "romance", label: "Romance" },
];

const FeedNavbar = ({ category, setCategory }: FeedNavbarProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-gold flex items-center justify-center shadow-glow">
              <Play className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="font-display text-xl text-gradient hidden sm:block">
              AITube
            </span>
          </Link>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? "bg-gold text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {profile?.is_creator && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/upload")}
                    className="hidden sm:flex"
                  >
                    <Upload className="w-5 h-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="gap-2"
                >
                  <Coins className="w-4 h-4 text-gold" />
                  <span className="hidden sm:inline">
                    {profile?.coins_balance || 0}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/dashboard")}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {profile?.display_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </Button>
              </>
            ) : (
              <Button
                variant="gold"
                size="sm"
                onClick={() => navigate("/auth")}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FeedNavbar;
