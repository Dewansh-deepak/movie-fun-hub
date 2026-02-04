import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
} from "lucide-react";
import Logo from "./Logo";

const SideMenu = () => {
  const navigate = useNavigate();
  const { profile, signOut, session } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Creator Dashboard",
      onClick: () => {
        setOpen(false);
        navigate("/dashboard");
      },
      badge: null,
    },
    {
      icon: Coins,
      label: "Monetization Settings",
      onClick: () => {
        setOpen(false);
        navigate("/dashboard");
      },
      badge: null,
    },
    {
      icon: History,
      label: "Earnings History",
      onClick: () => {
        setOpen(false);
        navigate("/dashboard");
      },
      badge: profile?.coins_balance ? `${profile.coins_balance} coins` : null,
    },
    {
      icon: UserPlus,
      label: "Invite Friends",
      onClick: () => {
        setOpen(false);
        // TODO: Implement invite flow
      },
      badge: "₹50 bonus",
      highlight: true,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    navigate("/auth");
  };

  return (
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

        <div className="p-4 border-t border-border/30 space-y-1">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
            <Moon className="w-5 h-5" />
            <span className="flex-1 text-left font-medium">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="flex-1 text-left font-medium">Settings</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          {session ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/auth");
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-instagram text-white"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">Sign In</span>
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
