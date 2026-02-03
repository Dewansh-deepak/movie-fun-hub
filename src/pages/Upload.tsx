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
import { ArrowLeft, Upload as UploadIcon, Video, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const categories = [
  { value: "drama", label: "Drama" },
  { value: "horror", label: "Horror" },
  { value: "comedy", label: "Comedy" },
  { value: "romance", label: "Romance" },
];

const Upload = () => {
  const { profile, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file too large (max 50MB)");
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
      setVideoDuration(Math.round(video.duration));
      if (video.duration > 30) {
        toast.warning("Video is longer than 30 seconds. It will be rejected.");
      }
    };
  };

  const handleUpload = async () => {
    if (!videoFile || !title || !category) {
      toast.error("Please fill all required fields");
      return;
    }

    if (videoDuration > 30) {
      toast.error("Video must be 30 seconds or less");
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          {/* Video Upload Area */}
          <div className="mb-6">
            <Label className="text-foreground mb-2 block">
              Video (Max 30 seconds, 50MB)
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
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                  {videoDuration}s {videoDuration > 30 && "⚠️"}
                </div>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-gold/50 transition-colors">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">
                    Click to select video
                  </p>
                  <p className="text-sm text-muted-foreground">
                    MP4, WebM, MOV up to 50MB
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
          <div className="mb-6">
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
            disabled={uploading || !videoFile || !title || !category || videoDuration > 30}
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
                Upload Video
              </>
            )}
          </Button>

          {/* Info */}
          <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
            <h4 className="font-medium text-gold mb-2">💰 Earn from views!</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Every 10 views = 1 coin</li>
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
