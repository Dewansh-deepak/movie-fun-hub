import { Home, Film, Plus, MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import UploadModal from "./UploadModal";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const tabs = [
    { id: "home", icon: Home, label: t("home"), path: "/feed" },
    { id: "shorts", icon: Film, label: t("shorts"), path: "/shorts" },
    { id: "upload", icon: Plus, label: t("create"), path: null },
    { id: "community", icon: MessageCircle, label: t("community"), path: "/community" },
    { id: "trending", icon: TrendingUp, label: t("trending"), path: "/trending" },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.id === "upload") {
      setShowUploadModal(true);
    } else if (tab.path) {
      navigate(tab.path);
    }
  };

  const isActive = (path: string | null) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-border/30 safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                tab.id === "upload" ? "" : isActive(tab.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.id === "upload" ? (
                <div className="w-12 h-12 rounded-full bg-gradient-instagram flex items-center justify-center shadow-glow -mt-4">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
                  <tab.icon className={`w-6 h-6 ${isActive(tab.path) ? "fill-primary/20" : ""}`} />
                  <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      <UploadModal open={showUploadModal} onOpenChange={setShowUploadModal} />
    </>
  );
};

export default BottomNav;
