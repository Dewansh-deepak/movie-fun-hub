import reelspayLogo from "@/assets/reelspay-logo.jpg";

const Logo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizes = {
    small: { img: "w-8 h-8", text: "text-lg" },
    default: { img: "w-10 h-10", text: "text-xl" },
    large: { img: "w-16 h-16", text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <img
        src={reelspayLogo}
        alt="Reelspay"
        className={`${s.img} rounded-lg object-contain`}
      />
      <div>
        <h1 className={`font-display ${s.text} text-gradient leading-none`}>
          Reelspay
        </h1>
        <p className="text-[10px] text-muted-foreground -mt-0.5">
          Create & Earn ₹
        </p>
      </div>
    </div>
  );
};

export default Logo;
