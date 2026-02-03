import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Coins,
  TrendingUp,
  Video,
  Eye,
  IndianRupee,
  Upload,
  ArrowLeft,
  LogOut,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface VideoStats {
  id: string;
  title: string;
  views_count: number;
  likes_count: number;
  created_at: string;
}

interface PayoutRequest {
  id: string;
  coins_amount: number;
  paise_amount: number;
  upi_id: string;
  status: string;
  created_at: string;
}

interface CoinTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { profile, user, signOut, becomeCreator, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoStats[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "videos" | "earnings" | "payouts">("overview");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchData();
      setUpiId(profile.upi_id || "");
    }
  }, [profile]);

  const fetchData = async () => {
    if (!profile) return;

    // Fetch videos
    const { data: videosData } = await supabase
      .from("videos")
      .select("id, title, views_count, likes_count, created_at")
      .eq("creator_id", profile.id)
      .order("created_at", { ascending: false });

    if (videosData) setVideos(videosData);

    // Fetch payouts
    const { data: payoutsData } = await supabase
      .from("payout_requests")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false });

    if (payoutsData) setPayouts(payoutsData);

    // Fetch transactions
    const { data: transactionsData } = await supabase
      .from("coin_transactions")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (transactionsData) setTransactions(transactionsData);

    setLoading(false);
  };

  const handleBecomeCreator = async () => {
    const { error } = await becomeCreator();
    if (error) {
      toast.error("Failed to become creator");
    } else {
      toast.success("🎉 You're now a creator! Start uploading videos.");
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseInt(payoutAmount);
    if (isNaN(amount) || amount < 5000) {
      toast.error("Minimum payout is 5000 coins (₹50)");
      return;
    }

    if (!upiId || !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    setRequestingPayout(true);

    try {
      const { data, error } = await supabase.functions.invoke("request-payout", {
        body: { coins_amount: amount, upi_id: upiId },
      });

      if (error) throw error;

      toast.success(`Payout requested: ₹${data.amount_inr}`);
      setPayoutAmount("");
      await refreshProfile();
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to request payout");
    } finally {
      setRequestingPayout(false);
    }
  };

  const totalViews = videos.reduce((sum, v) => sum + v.views_count, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likes_count, 0);
  const pendingPayouts = payouts.filter((p) => p.status === "pending");
  const earnedToday = transactions
    .filter(
      (t) =>
        t.transaction_type === "earned" &&
        new Date(t.created_at).toDateString() === new Date().toDateString()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  if (authLoading || loading) {
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
              onClick={() => navigate("/feed")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Feed
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="gap-2 text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow">
            {profile?.display_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl text-foreground">
              {profile?.display_name}
            </h1>
            <p className="text-muted-foreground">
              {profile?.is_creator ? "Creator Account" : "Viewer Account"}
            </p>
          </div>
          <div className="flex gap-3">
            {profile?.is_creator ? (
              <Button
                variant="gold"
                onClick={() => navigate("/upload")}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Video
              </Button>
            ) : (
              <Button variant="gold" onClick={handleBecomeCreator} className="gap-2">
                <Video className="w-4 h-4" />
                Become Creator
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <Coins className="w-5 h-5 text-gold" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {profile?.coins_balance?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-muted-foreground">Total Coins</p>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-crimson/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-crimson" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{earnedToday}</p>
            <p className="text-sm text-muted-foreground">Earned Today</p>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{videos.length}</p>
            <p className="text-sm text-muted-foreground">Videos</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["overview", "videos", "earnings", "payouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-gold text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payout Section */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-gold" />
                Request Payout
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">
                    Available: {profile?.coins_balance?.toLocaleString() || 0} coins
                    (₹{((profile?.coins_balance || 0) / 100).toFixed(2)})
                  </Label>
                </div>
                <div>
                  <Label htmlFor="payout">Coins to Withdraw (min 5000)</Label>
                  <Input
                    id="payout"
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="5000"
                    className="bg-muted"
                  />
                  {payoutAmount && (
                    <p className="text-sm text-gold mt-1">
                      = ₹{(parseInt(payoutAmount) / 100).toFixed(2)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input
                    id="upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="bg-muted"
                  />
                </div>
                <Button
                  variant="gold"
                  className="w-full gap-2"
                  onClick={handleRequestPayout}
                  disabled={
                    requestingPayout ||
                    !payoutAmount ||
                    parseInt(payoutAmount) < 5000 ||
                    (profile?.coins_balance || 0) < parseInt(payoutAmount || "0")
                  }
                >
                  <IndianRupee className="w-4 h-4" />
                  {requestingPayout ? "Processing..." : "Request Payout"}
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-xl text-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 border-b border-border/30"
                  >
                    <div>
                      <p className="text-sm text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        tx.amount > 0 ? "text-green-500" : "text-crimson"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </span>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No transactions yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="glass rounded-xl p-6">
            <h3 className="font-display text-xl text-foreground mb-4">Your Videos</h3>
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between py-3 border-b border-border/30"
                >
                  <div>
                    <p className="font-medium text-foreground">{video.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views_count}
                    </span>
                    <span>❤️ {video.likes_count}</span>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No videos uploaded yet
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="glass rounded-xl p-6">
            <h3 className="font-display text-xl text-foreground mb-4">
              Coin Transactions
            </h3>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-border/30"
                >
                  <div>
                    <p className="text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`font-bold ${
                      tx.amount > 0 ? "text-green-500" : "text-crimson"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount} coins
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="glass rounded-xl p-6">
            <h3 className="font-display text-xl text-foreground mb-4">
              Payout History
            </h3>
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between py-3 border-b border-border/30"
                >
                  <div>
                    <p className="text-foreground">
                      ₹{(payout.paise_amount / 100).toFixed(2)} to {payout.upi_id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payout.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      payout.status === "completed"
                        ? "bg-green-500/20 text-green-500"
                        : payout.status === "pending"
                        ? "bg-gold/20 text-gold"
                        : "bg-crimson/20 text-crimson"
                    }`}
                  >
                    {payout.status === "completed" && <CheckCircle className="w-3 h-3" />}
                    {payout.status === "pending" && <Clock className="w-3 h-3" />}
                    {payout.status === "failed" && <AlertCircle className="w-3 h-3" />}
                    {payout.status}
                  </span>
                </div>
              ))}
              {payouts.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No payout requests yet
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
