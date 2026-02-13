import { Bell, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import SideMenu from "./SideMenu";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/hooks/useLanguage";

interface TopBarProps {
  showCategories?: boolean;
  category?: string;
  setCategory?: (category: string) => void;
}

const TopBar = ({ showCategories, category, setCategory }: TopBarProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const categories = [
    { id: "all", label: t("forYou") },
    { id: "drama", label: t("drama") },
    { id: "horror", label: t("horror") },
    { id: "comedy", label: t("comedy") },
    { id: "romance", label: t("romance") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 safe-area-top" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #333333 100%)' }}>
      <div className="flex items-center justify-between h-14 px-4">
        <SideMenu />
        <Logo size="small" />
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-muted"
            onClick={() => navigate("/")}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {showCategories && setCategory && (
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat.id
                  ? "bg-gradient-instagram text-white shadow-glow"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default TopBar;
