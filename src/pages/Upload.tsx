import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload as UploadIcon, Video, X, CheckCircle, Clock, Zap, AlertTriangle, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const categories = [
  { value: "drama", label: "Drama" },
  { value: "horror", label: "Horror" },
  { value: "comedy", label: "Comedy" },
  { value: "romance", label: "Romance" },
];

type VideoType = "shorts" | "longform";

interface VideoTypeOption {
  value: VideoType;
  label: string;
  duration: string;
  coins: string;
  recommended?: boolean;
  maxSize: string;
}

const videoTypes: VideoTypeOption[] = [
  { 
    value: "shorts", 
    label: "Shorts", 
    duration: "15-60 seconds", 
    coins: "2 coins/100 views",
    recommended: true,
    maxSize: "50MB"
  },
  { 
    value: "longform", 
    label: "Long-form", 
    duration: "1-10 minutes", 
    coins: "5 coins/500 views",
    maxSize: "100MB"
  },
];

const Upload = () => {
  const { profile, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoType, setVideoType] = useState<VideoType>("shorts");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showTrimWarning, setShowTrimWarning] = useState(false);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const maxDuration = videoType === "shorts" ? 60 : 600; // 60s for shorts, 10min for longform
  const minDuration = videoType === "shorts" ? 15 : 60; // 15s for shorts, 1min for longform
  const maxFileSize = videoType === "shorts" ? 50 : 100; // MB

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!authLoading && profile && !profile.is_creator) {
      toast.error("You need to be a creator to upload videos");
      navigate("/dashboard");
    }
  }, [user, profile, authLoading, navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    // Validate file size based on video type
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`Video file too large (max ${maxFileSize}MB for ${videoType})`);
      return;
    }

    setVideoFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoPreview(url);

    // Get video duration
    const video = document.createElement("video");
    video.src = url;
    video.onloadedmetadata = () => {
      const duration = Math.round(video.duration);
      setVideoDuration(duration);
      
      // Check if video exceeds max duration for shorts
      if (videoType === "shorts" && duration > 60) {
        setShowTrimWarning(true);
        toast.warning("Video exceeds 60s. Consider trimming for maximum virality!");
      } else if (duration < minDuration) {
        toast.warning(`Video is too short (min ${minDuration}s for ${videoType})`);
      }
    };
  };

  const handleUpload = async () => {
    if (!videoFile || !title || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate duration based on video type
    if (videoType === "shorts" && videoDuration > maxDuration) {
      toast.error(`Shorts must be ${maxDuration} seconds or less`);
      return;
    }
    if (videoDuration < minDuration) {
      toast.error(`${videoType === "shorts" ? "Shorts" : "Long-form"} must be at least ${minDuration} seconds`);
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("videoType", videoType);

      setUploadProgress(30);

      const { data, error } = await supabase.functions.invoke("upload-video", {
        body: formData,
      });

      setUploadProgress(90);

      if (error) throw error;

      setUploadProgress(100);
      toast.success("Video uploaded successfully! 🎬");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoDuration(0);
    setShowTrimWarning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isDurationValid = videoDuration >= minDuration && videoDuration <= maxDuration;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="font-display text-xl text-foreground">Upload Video</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="glass rounded-2xl p-6 md:p-8">
          {/* Video Type Selector */}
          <div className="mb-6">
            <Label className="text-foreground mb-3 block">Video Type *</Label>
            <div className="grid grid-cols-2 gap-3">
              {videoTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setVideoType(type.value);
                    clearVideo(); // Clear video when switching types
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    videoType === type.value
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  {type.recommended && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent text-[10px] font-bold rounded-full text-accent-foreground">
                      RECOMMENDED
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    {type.value === "shorts" ? (
                      <Zap className="w-5 h-5 text-gold" />
                    ) : (
                      <Clock className="w-5 h-5 text-primary" />
                    )}
                    <span className="font-semibold text-foreground">{type.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{type.duration}</p>
                  <p className="text-xs text-gold mt-1">{type.coins}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Max: {type.maxSize}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 60s Virality Tip */}
          {videoType === "shorts" && (
            <div className="mb-6 p-3 bg-primary/10 rounded-lg border border-primary/20 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">Pro tip:</span> 60s = Maximum virality per YouTube data. 
                The sweet spot is 45-55 seconds for best engagement.
              </p>
            </div>
          )}

          {/* Video Upload Area */}
          <div className="mb-6">
            <Label className="text-foreground mb-2 block">
              Video ({videoType === "shorts" ? "15-60s" : "1-10min"}, {maxFileSize}MB max)
            </Label>
            
            {videoPreview ? (
              <div className="relative rounded-xl overflow-hidden bg-cinema-dark">
                <video
                  src={videoPreview}
                  className="w-full aspect-[9/16] object-contain max-h-[400px]"
                  controls
                />
                <button
                  onClick={clearVideo}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs text-white ${
                  isDurationValid ? "bg-green-500/80" : "bg-red-500/80"
                }`}>
                  {videoDuration}s {!isDurationValid && "⚠️"}
                </div>
                {showTrimWarning && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-gold/80 rounded text-xs text-black font-medium">
                    Consider trimming to 60s
                  </div>
                )}
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-gold/50 transition-colors">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    Click to select video
                  </p>
                  <p className="text-sm text-muted-foreground">
                    MP4, WebM, MOV up to {maxFileSize}MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}

            {/* Duration Progress Bar */}
            {videoPreview && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{minDuration}s min</span>
                  <span>{videoDuration}s current</span>
                  <span>{maxDuration}s max</span>
                </div>
                <Progress 
                  value={Math.min((videoDuration / maxDuration) * 100, 100)} 
                  className={`h-2 ${!isDurationValid ? "[&>div]:bg-destructive" : "[&>div]:bg-green-500"}`}
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <Label htmlFor="title" className="text-foreground">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a catchy title"
              className="bg-muted border-border"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              className="bg-muted border-border resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <Label className="text-foreground">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Copyright Checkbox */}
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-start gap-3">
              <Checkbox
                id="copyright"
                checked={copyrightAgreed}
                onCheckedChange={(checked) => setCopyrightAgreed(checked === true)}
                className="mt-0.5"
              />
              <div>
                <label htmlFor="copyright" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  {t("copyrightCheckbox")}
                </label>
                <p className="text-xs text-destructive mt-1">{t("copyrightWarning")}</p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-6">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {uploadProgress < 30
                  ? "Preparing upload..."
                  : uploadProgress < 90
                  ? "Uploading to cloud..."
                  : "Finalizing..."}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            variant="gold"
            className="w-full gap-2"
            onClick={handleUpload}
            disabled={uploading || !videoFile || !title || !category || !isDurationValid || !copyrightAgreed}
          >
            {uploading ? (
              <>Uploading...</>
            ) : uploadProgress === 100 ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Uploaded!
              </>
            ) : (
              <>
                <UploadIcon className="w-5 h-5" />
                Upload {videoType === "shorts" ? "Short" : "Video"}
              </>
            )}
          </Button>

          {/* Info */}
          <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
            <h4 className="font-medium text-gold mb-2">💰 Earn from views!</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Shorts: 2 coins per 100 views</li>
              <li>• Long-form: 5 coins per 500 views</li>
              <li>• 100 coins = ₹1</li>
              <li>• Minimum payout: ₹50 (5000 coins)</li>
              <li>• Instant UPI withdrawal</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
