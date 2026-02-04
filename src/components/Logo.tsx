import { IndianRupee } from "lucide-react";

const Logo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizes = {
    small: { container: "w-8 h-8", icon: "w-3 h-3", text: "text-lg" },
    default: { container: "w-10 h-10", icon: "w-4 h-4", text: "text-xl" },
    large: { container: "w-14 h-14", icon: "w-5 h-5", text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Instagram-style gradient circle */}
        <div className={`${s.container} rounded-full bg-gradient-instagram p-0.5 shadow-glow`}>
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <span className="text-gradient font-display font-bold text-sm">₹</span>
          </div>
        </div>
        
        {/* Flying cash icons */}
        <div className="absolute -top-1 -right-1">
          <IndianRupee className={`${s.icon} text-gold animate-float`} />
        </div>
        <div className="absolute -top-2 right-1 opacity-60" style={{ animationDelay: "0.5s" }}>
          <IndianRupee className={`${s.icon} text-gold animate-float`} style={{ animationDelay: "0.5s" }} />
        </div>
      </div>
      
      <div>
        <h1 className={`font-display ${s.text} text-gradient leading-none`}>
          AITube
        </h1>
        <p className="text-[10px] text-muted-foreground -mt-0.5">
          Create & Earn ₹
        </p>
      </div>
    </div>
  );
};

export default Logo;
