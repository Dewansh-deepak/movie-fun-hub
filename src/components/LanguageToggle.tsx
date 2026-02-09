import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();

  const toggle = () => {
    setLang(lang === "en" ? "hi" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="hover:bg-muted relative"
      title={lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
    >
      <Globe className="w-5 h-5" />
      <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
        {lang === "en" ? "Hi" : "En"}
      </span>
    </Button>
  );
};

export default LanguageToggle;
