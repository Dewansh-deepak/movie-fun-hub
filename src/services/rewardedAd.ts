import { ADMOB_CONFIG, REVENUE_SPLIT, ADMOB_TEST_DEVICES, IS_TEST_MODE } from "@/config/admob";
import { supabase } from "@/integrations/supabase/client";

// Ad state management
let isAdLoaded = false;
let isAdShowing = false;

// Log test device IDs on service init
console.log("[ReelsPay AdMob] 🔧 Rewarded Ad Service Initialized");
console.log("[ReelsPay AdMob] 🚦 MODE:", IS_TEST_MODE ? "✅ TEST MODE (no real ads)" : "🔴 PRODUCTION");
console.log("[ReelsPay AdMob] 🎁 Active Ad Unit ID:", ADMOB_CONFIG.rewardedAdUnitId);
console.log("[ReelsPay AdMob] 🧪 Test Device IDs:", ADMOB_TEST_DEVICES);
console.log("[ReelsPay AdMob] 💰 Revenue Split → Creator:", REVENUE_SPLIT.creator + "% | Viewer:", REVENUE_SPLIT.user + "% | Platform:", REVENUE_SPLIT.platform + "%");

const AD_UNITS = {
  videoEnd: {
    name: "reelspay_video_end_reward",
    id: ADMOB_CONFIG.rewardedAdUnitId, // Fixed: use rewarded ad unit (not app ID)
    trafficShare: 0.8,
  },
  appOpen: {
    name: "reelspay_app_open_reward",
    id: ADMOB_CONFIG.rewardedAdUnitId,
    trafficShare: 0.2,
  },
} as const;

/**
 * Pre-load ad when video starts playing
 */
export const preloadAd = (adType: "videoEnd" | "appOpen" = "videoEnd") => {
  const unit = AD_UNITS[adType];
  console.log(`[ReelsPay Ad] 🔄 PRE-LOADING ad: ${unit.name}`);
  console.log(`[ReelsPay Ad] 📋 Ad Unit ID: ${unit.id}`);
  console.log(`[ReelsPay Ad] 📊 Traffic share: ${unit.trafficShare * 100}%`);

  // Simulate ad load delay (AdMob typically takes 1-3s)
  setTimeout(() => {
    isAdLoaded = true;
    console.log(`[ReelsPay Ad] ✅ Ad LOADED successfully: ${unit.name}`);
    console.log(`[ReelsPay Ad] 💰 Revenue split: Creator ${REVENUE_SPLIT.creator}% | User ${REVENUE_SPLIT.user}% | Platform ${REVENUE_SPLIT.platform}%`);
  }, 1500);
};

/**
 * Show rewarded ad (triggered at 90% video completion)
 * Returns true if ad was shown, false otherwise
 */
export const showRewardedAd = async (
  videoId: string,
  viewerId: string | null,
  creatorId: string
): Promise<{ shown: boolean; coinsAwarded: number }> => {
  console.log(`[ReelsPay Ad] 🎬 TRIGGER: Video 90% complete`);
  console.log(`[ReelsPay Ad] 📹 Video ID: ${videoId}`);
  console.log(`[ReelsPay Ad] 👤 Viewer: ${viewerId || "anonymous"}`);
  console.log(`[ReelsPay Ad] 🎥 Creator: ${creatorId}`);

  if (!isAdLoaded) {
    console.warn(`[ReelsPay Ad] ⚠️ Ad not loaded yet, attempting force load...`);
    isAdLoaded = true; // Force for simulation
  }

  if (isAdShowing) {
    console.warn(`[ReelsPay Ad] ⚠️ Ad already showing, skipping`);
    return { shown: false, coinsAwarded: 0 };
  }

  isAdShowing = true;
  console.log(`[ReelsPay Ad] 📺 SHOWING rewarded ad...`);
  console.log(`[ReelsPay Ad] ⏳ Simulating 3s ad view (native AdMob will show real ad)`);

  // Simulate ad viewing duration
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`[ReelsPay Ad] ✅ Ad COMPLETED by user`);
  console.log(`[ReelsPay Ad] 💰 Processing 70-20-10 split...`);

  // Process the reward
  const result = await processAdReward(videoId, viewerId, creatorId);

  isAdShowing = false;
  isAdLoaded = false; // Need to reload for next ad

  return result;
};

/**
 * Process the 70-20-10 revenue split after ad completion
 */
const processAdReward = async (
  videoId: string,
  viewerId: string | null,
  creatorId: string
): Promise<{ shown: boolean; coinsAwarded: number }> => {
  const viewerCoins = 8;
  const creatorPaise = 280; // ₹2.80

  console.log(`[ReelsPay Ad] 💎 REWARD BREAKDOWN:`);
  console.log(`[ReelsPay Ad]   Creator (70%): +₹${(creatorPaise / 100).toFixed(2)} (${creatorPaise} paise)`);
  console.log(`[ReelsPay Ad]   Viewer  (20%): +${viewerCoins} coins`);
  console.log(`[ReelsPay Ad]   Platform(10%): +₹0.40 (retained)`);

  try {
    // Record the view with coins via edge function
    const { error } = await supabase.functions.invoke("record-view", {
      body: { video_id: videoId },
    });

    if (error) {
      console.error(`[ReelsPay Ad] ❌ Failed to process reward:`, error);
      return { shown: true, coinsAwarded: 0 };
    }

    console.log(`[ReelsPay Ad] ✅ Reward processed successfully!`);
    console.log(`[ReelsPay Ad] 🎉 Viewer earned +${viewerCoins} coins`);
    console.log(`[ReelsPay Ad] 🎉 Creator earned +₹${(creatorPaise / 100).toFixed(2)}`);

    return { shown: true, coinsAwarded: viewerCoins };
  } catch (err) {
    console.error(`[ReelsPay Ad] ❌ Error:`, err);
    return { shown: true, coinsAwarded: 0 };
  }
};

/**
 * Check video progress and trigger ad at 90%
 */
export const checkVideoProgress = (
  currentTime: number,
  duration: number
): boolean => {
  if (duration <= 0) return false;
  const progress = currentTime / duration;
  
  if (progress >= 0.9) {
    console.log(`[ReelsPay Ad] 📊 Video progress: ${Math.round(progress * 100)}% — AD TRIGGER POINT`);
    return true;
  }
  return false;
};

/**
 * Reset ad state (call when switching videos)
 */
export const resetAdState = () => {
  isAdLoaded = false;
  isAdShowing = false;
  console.log(`[ReelsPay Ad] 🔄 Ad state RESET for new video`);
};
