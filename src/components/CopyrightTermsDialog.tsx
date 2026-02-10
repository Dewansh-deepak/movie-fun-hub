import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldCheck } from "lucide-react";

const CopyrightTermsDialog = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const accepted = localStorage.getItem(`reelspay_copyright_${user.id}`);
      if (!accepted) {
        setOpen(true);
      }
    }
  }, [user]);

  const handleAgree = () => {
    if (user) {
      localStorage.setItem(`reelspay_copyright_${user.id}`, "true");
    }
    setOpen(false);
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="glass border-border/50 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {t("copyrightTermsTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {t("copyrightTermsBody")}
          </AlertDialogDescription>
          <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-xs font-semibold text-destructive">
              {t("copyrightWarning")}
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleAgree}
            className="w-full bg-gradient-instagram text-white hover:opacity-90"
          >
            {t("copyrightTermsAgree")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CopyrightTermsDialog;
