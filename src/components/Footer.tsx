import { Play, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-cinema-surface/50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Play className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <div>
                <h3 className="font-display text-xl text-gradient">
                  Reelspay
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              आपका daily dose of entertainment। Short drama movies का ultimate hub।
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Browse All</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Trending</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">New Releases</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Top Rated</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Genres</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Romance ❤️</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Horror 👻</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Comedy 😂</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Suspense 🔍</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Reelspay © 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
