import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Video, Coins, TrendingUp, Users, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-dark via-background to-cinema-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(38,92%,55%,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(350,85%,50%,0.1),transparent_50%)]" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow animate-pulse-glow">
              <Play className="w-8 h-8 text-primary-foreground fill-current" />
            </div>
          </div>

          <h1 className="font-display text-6xl md:text-8xl text-gradient mb-4 tracking-wider">
            AITube
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-2">
            Create. Share. <span className="text-gold">Earn.</span>
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            India's AI-powered short video platform. Upload 30-second clips, grow your audience, and earn real money.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate("/feed")}
              className="gap-2 text-lg px-8"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Watching
            </Button>
            {!user && (
              <Button
                variant="goldOutline"
                size="lg"
                onClick={() => navigate("/auth")}
                className="gap-2 text-lg px-8"
              >
                <Video className="w-5 h-5" />
                Become a Creator
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="glass rounded-xl p-4">
              <p className="font-display text-2xl md:text-3xl text-gold">30s</p>
              <p className="text-xs text-muted-foreground">Max Video</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="font-display text-2xl md:text-3xl text-gold">₹50</p>
              <p className="text-xs text-muted-foreground">Min Payout</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="font-display text-2xl md:text-3xl text-gold">UPI</p>
              <p className="text-xs text-muted-foreground">Instant Pay</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-cinema-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-center text-foreground mb-12">
            Why <span className="text-gradient">AITube</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                Easy Upload
              </h3>
              <p className="text-muted-foreground text-sm">
                Record or upload 30-second videos in Drama, Horror, Comedy, or Romance categories.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-xl bg-crimson/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-crimson" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                Grow Fast
              </h3>
              <p className="text-muted-foreground text-sm">
                AI-powered recommendations help your content reach the right audience.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                Earn Money
              </h3>
              <p className="text-muted-foreground text-sm">
                10 views = 1 coin. Cash out via UPI when you reach ₹50 (5000 coins).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-center text-foreground mb-12">
            How It <span className="text-gradient">Works</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-full bg-gold text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                Create your free creator account
              </p>
            </div>

            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />

            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-full bg-crimson text-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Upload</h3>
              <p className="text-sm text-muted-foreground">
                Post 30-second videos in any category
              </p>
            </div>

            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />

            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500 text-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Earn</h3>
              <p className="text-sm text-muted-foreground">
                Get coins from views, withdraw via UPI
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="gap-2"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="font-display text-xl text-gradient">AITube</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 AITube. Made in India 🇮🇳
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
