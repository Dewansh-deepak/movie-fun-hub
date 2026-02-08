import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, IndianRupee, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back! 🎬");
        navigate("/feed");
      } else {
        if (!displayName.trim()) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted/80 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-instagram opacity-10 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="large" />
        </div>

        {/* Tagline */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display text-gradient mb-2">
            Create. Share. Earn.
          </h2>
          <p className="text-muted-foreground text-sm">
            Turn your creativity into ₹ with AITube
          </p>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-sm">
          <div className="glass rounded-2xl p-6 border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm">
                    Creator Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your unique name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 bg-muted border-border h-12"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted border-border h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted border-border h-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-instagram hover:opacity-90 text-white font-semibold"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-purple flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">Earn ₹</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-gold flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-secondary-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">AI Create</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-instagram flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">Go Viral</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
