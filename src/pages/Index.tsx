import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Video, Coins, TrendingUp, ArrowRight, Sparkles, IndianRupee, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-dark via-background to-cinema-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(280,85%,60%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(320,80%,55%,0.15),transparent_50%)]" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="large" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-gradient mb-4 tracking-wide">
            Create. Share. Earn.
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-2">
            India's <span className="text-gradient">AI-powered</span> creator platform
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Upload short videos, go viral, and earn real ₹ from views. It's that simple.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/feed")}
              className="gap-2 text-lg px-8 bg-gradient-instagram hover:opacity-90 text-white"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Watching
            </Button>
            {!user && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth")}
                className="gap-2 text-lg px-8 border-primary text-primary hover:bg-primary/10"
              >
                <Video className="w-5 h-5" />
                Become a Creator
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="glass rounded-xl p-4 border border-border/50">
              <p className="font-display text-2xl md:text-3xl text-gradient">30s</p>
              <p className="text-xs text-muted-foreground">Max Video</p>
            </div>
            <div className="glass rounded-xl p-4 border border-border/50">
              <p className="font-display text-2xl md:text-3xl text-gradient-gold">₹50</p>
              <p className="text-xs text-muted-foreground">Min Payout</p>
            </div>
            <div className="glass rounded-xl p-4 border border-border/50">
              <p className="font-display text-2xl md:text-3xl text-gradient">UPI</p>
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
          <h2 className="font-display text-4xl md:text-5xl text-center text-foreground mb-4">
            Why <span className="text-gradient">AITube</span>?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
            The platform built for Indian creators to monetize their talent
          </p>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-purple flex items-center justify-center mx-auto mb-4">
                <Video className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Easy Upload
              </h3>
              <p className="text-muted-foreground text-sm">
                Record or upload 30-second videos instantly
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                AI Generate
              </h3>
              <p className="text-muted-foreground text-sm">
                Create videos with AI using Hoopr.ai
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-instagram flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Go Viral
              </h3>
              <p className="text-muted-foreground text-sm">
                AI recommendations boost your content
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Earn Money
              </h3>
              <p className="text-muted-foreground text-sm">
                10 views = 1 coin. Withdraw via UPI
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
              <div className="w-14 h-14 rounded-full bg-gradient-instagram text-white flex items-center justify-center font-display text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                Create your free creator account
              </p>
            </div>

            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />

            <div className="flex-1 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-purple text-white flex items-center justify-center font-display text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Upload</h3>
              <p className="text-sm text-muted-foreground">
                Post 30-second videos or use AI
              </p>
            </div>

            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />

            <div className="flex-1 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-gold text-secondary-foreground flex items-center justify-center font-display text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Earn ₹</h3>
              <p className="text-sm text-muted-foreground">
                Get coins from views, cash out via UPI
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="gap-2 bg-gradient-instagram hover:opacity-90 text-white"
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-cinema-surface">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-instagram flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Join the Creator Community
            </h2>
            <p className="text-muted-foreground mb-8">
              Connect with fellow creators, share tips, collaborate on content, and grow together. AITube is more than a platform—it's a family.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/community")}
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              Explore Community
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="small" />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 AITube. Made with ❤️ in India 🇮🇳
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
