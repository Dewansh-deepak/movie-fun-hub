import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Video, TrendingUp, ArrowRight, Sparkles, IndianRupee, Users, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Logo from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Top right controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageToggle />
        <button
          onClick={() => navigate("/feed")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted/80 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("skip")} <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-dark via-background to-cinema-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(280,85%,60%,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(320,80%,55%,0.15),transparent_50%)]" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <Logo size="large" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-gradient mb-4 tracking-wide">
            {t("createShareEarn")}
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-2">
            {t("indiaPlatform")}
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t("uploadDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/feed")}
              className="gap-2 text-lg px-8 bg-gradient-instagram hover:opacity-90 text-white"
            >
              <Play className="w-5 h-5 fill-current" />
              {t("startWatching")}
            </Button>
            {!user && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/auth")}
                className="gap-2 text-lg px-8 border-primary text-primary hover:bg-primary/10"
              >
                <Video className="w-5 h-5" />
                {t("becomeCreator")}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="glass rounded-xl p-4 border border-border/50">
              <p className="font-display text-2xl md:text-3xl text-gradient">60s</p>
              <p className="text-xs text-muted-foreground">{t("maxVideo")}</p>
            </div>
            <div className="glass rounded-xl p-4 border border-border/50">
              <p className="font-display text-2xl md:text-3xl text-gradient-gold">₹50</p>
              <p className="text-xs text-muted-foreground">{t("minPayout")}</p>
            </div>
            <div className="glass rounded-xl p-4 border border-border/50">
              <p className="font-display text-2xl md:text-3xl text-gradient">UPI</p>
              <p className="text-xs text-muted-foreground">{t("instantPay")}</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-cinema-surface">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-center text-foreground mb-4">
            {t("whyReelspay")}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
            {t("platformBuilt")}
          </p>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-purple flex items-center justify-center mx-auto mb-4">
                <Video className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{t("easyUpload")}</h3>
              <p className="text-muted-foreground text-sm">{t("easyUploadDesc")}</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{t("aiGenerate")}</h3>
              <p className="text-muted-foreground text-sm">{t("aiGenerateDesc")}</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-instagram flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{t("goViral")}</h3>
              <p className="text-muted-foreground text-sm">{t("goViralDesc")}</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">{t("earnMoney")}</h3>
              <p className="text-muted-foreground text-sm">{t("earnMoneyDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-center text-foreground mb-12">
            {t("howItWorks")}
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto">
            <div className="flex-1 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-instagram text-white flex items-center justify-center font-display text-2xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-foreground mb-2">{t("step1")}</h3>
              <p className="text-sm text-muted-foreground">{t("step1Desc")}</p>
            </div>
            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
            <div className="flex-1 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-purple text-white flex items-center justify-center font-display text-2xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-foreground mb-2">{t("step2")}</h3>
              <p className="text-sm text-muted-foreground">{t("step2Desc")}</p>
            </div>
            <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
            <div className="flex-1 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-gold text-secondary-foreground flex items-center justify-center font-display text-2xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-foreground mb-2">{t("step3")}</h3>
              <p className="text-sm text-muted-foreground">{t("step3Desc")}</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="gap-2 bg-gradient-instagram hover:opacity-90 text-white"
            >
              {user ? t("goToDashboard") : t("getStartedFree")}
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
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">{t("joinCommunity")}</h2>
            <p className="text-muted-foreground mb-8">{t("joinCommunityDesc")}</p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/community")}
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              {t("exploreCommunity")}
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
            Reelspay © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
