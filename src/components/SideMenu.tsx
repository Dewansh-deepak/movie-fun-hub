import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Menu,
  LayoutDashboard,
  Coins,
  History,
  UserPlus,
  Moon,
  Settings,
  LogOut,
  ChevronRight,
  IndianRupee,
  Flag,
} from "lucide-react";
import Logo from "./Logo";

const SideMenu = () => {
  const navigate = useNavigate();
  const { profile, signOut, session } = useAuth();
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(true);
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t("creatorDashboard"),
      onClick: () => { setOpen(false); navigate("/dashboard"); },
      badge: null,
    },
    {
      icon: Coins,
      label: t("monetizationSettings"),
      onClick: () => { setOpen(false); navigate("/dashboard"); },
      badge: null,
    },
    {
      icon: History,
      label: t("earningsHistory"),
      onClick: () => { setOpen(false); navigate("/dashboard"); },
      badge: profile?.coins_balance ? `${profile.coins_balance} coins` : null,
    },
    {
      icon: UserPlus,
      label: t("inviteFriends"),
      onClick: () => { setOpen(false); },
      badge: t("inviteBonus"),
      highlight: true,
    },
  ];

  const handleBackToWelcome = () => {
    setOpen(false);
    navigate("/");
  };

  const handleLogout = async () => {
    await signOut();
    setShowLogoutDialog(false);
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 glass border-r border-border/30 p-0">
          <SheetHeader className="p-6 border-b border-border/30">
            <div className="flex items-center justify-between">
              <Logo size="default" />
            </div>
            
            {session && profile && (
              <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-muted/50">
                <div className="w-12 h-12 rounded-full bg-gradient-instagram flex items-center justify-center text-white font-bold">
                  {profile.display_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">{profile.display_name}</p>
                  <div className="flex items-center gap-1 text-sm text-gold">
                    <IndianRupee className="w-3 h-3" />
                    <span>{profile.coins_balance} coins</span>
                  </div>
                </div>
              </div>
            )}
          </SheetHeader>

          <div className="p-4 space-y-1">
            <button
              onClick={handleBackToWelcome}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors mb-2 border border-border/50"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{t("backToWelcome")}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  item.highlight 
                    ? "bg-gradient-gold text-secondary-foreground hover:opacity-90" 
                    : "hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.highlight ? "bg-secondary-foreground/20" : "bg-gold/20 text-gold"
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Report Copyright */}
          <div className="px-4 pt-2">
            <button
              onClick={() => { setOpen(false); toast.info("Copyright report feature coming soon"); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive/80 transition-colors border border-destructive/20"
            >
              <Flag className="w-5 h-5" />
              <span className="flex-1 text-left font-medium text-sm">{t("reportCopyright")}</span>
            </button>
          </div>

          <div className="p-4 border-t border-border/30 space-y-1">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
              <Moon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{t("darkMode")}</span>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <button
              onClick={() => { setOpen(false); navigate("/settings"); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{t("settings")}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {session ? (
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="flex-1 text-left font-medium">{t("logout")}</span>
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); navigate("/auth"); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-instagram text-white"
              >
                <LogOut className="w-5 h-5" />
                <span className="flex-1 text-left font-medium">{t("signIn")}</span>
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="glass border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("logoutConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>{t("logoutDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("logout")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SideMenu;
