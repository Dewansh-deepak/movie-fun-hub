import { Upload, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadModal = ({ open, onOpenChange }: UploadModalProps) => {
  const navigate = useNavigate();

  const handleUpload = () => {
    onOpenChange(false);
    navigate("/upload");
  };

  const handleAIGenerate = () => {
    onOpenChange(false);
    navigate("/ai-generate");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-xl">
            Create Content
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            onClick={handleUpload}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card hover:bg-muted transition-colors border border-border/50"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-purple flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Upload Video</p>
              <p className="text-xs text-muted-foreground mt-1">
                From your device
              </p>
            </div>
          </button>

          <button
            onClick={handleAIGenerate}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card hover:bg-muted transition-colors border border-border/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-instagram opacity-10" />
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-secondary-foreground" />
              </div>
              <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-accent text-[10px] font-bold rounded-full text-accent-foreground">
                NEW
              </span>
            </div>
            <div className="text-center relative">
              <p className="font-semibold">AI Generate</p>
              <p className="text-xs text-muted-foreground mt-1">
                Powered by Hoopr.ai
              </p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
