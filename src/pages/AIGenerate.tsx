import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Wand2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const AIGenerate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description for your video");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (Hoopr.ai integration placeholder)
    setTimeout(() => {
      toast.info("AI video generation coming soon!");
      toast("This feature will be powered by Hoopr.ai", {
        description: "Stay tuned for AI-generated content creation!",
      });
      setIsGenerating(false);
    }, 2000);
  };

  const promptSuggestions = [
    "A romantic sunset scene with a couple walking on the beach",
    "A funny cat doing parkour in a living room",
    "A scary ghost appearing in an old mansion",
    "An emotional reunion between friends after years",
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className="pt-16 pb-20 px-4">
        <div className="flex items-center gap-3 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl text-gradient flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-gold" />
              AI Video Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Powered by Hoopr.ai
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Describe your video idea
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A dramatic scene where a hero saves the day..."
              className="min-h-[120px] bg-card border-border resize-none"
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try these ideas:</p>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(suggestion)}
                  className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors text-left"
                >
                  {suggestion.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-14 bg-gradient-instagram hover:opacity-90 text-white font-semibold text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Video
              </>
            )}
          </Button>

          {/* Coming Soon Banner */}
          <div className="p-6 rounded-xl bg-gradient-purple/20 border border-primary/30 text-center">
            <Sparkles className="w-10 h-10 text-gold mx-auto mb-3" />
            <h3 className="font-display text-lg mb-2">
              AI Generation Coming Soon!
            </h3>
            <p className="text-sm text-muted-foreground">
              We're integrating with Hoopr.ai to bring you powerful AI video
              creation. Create stunning videos from just a text prompt!
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AIGenerate;
