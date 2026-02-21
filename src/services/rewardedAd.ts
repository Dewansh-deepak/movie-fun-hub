// ============================================================
// ✅ ADMOB TEST MODE — PWA Web Simulation
// Test Rewarded ID: ca-app-pub-3940256099942544/5224354917
// Trigger: 90% video completion → 8 coins reward
// ============================================================

const TEST_REWARDED_AD_UNIT = "ca-app-pub-3940256099942544/5224354917";
const COINS_PER_VIEW = 8;
let adReady = false;
let adShownForCurrentVideo = false;

console.log("[ReelsPay AdMob] ✅ TEST MODE ACTIVE — Web PWA Simulation");
console.log("[ReelsPay AdMob] Test Device ID: WEB_TEST_MODE");
console.log("[ReelsPay AdMob] 🎁 Test Rewarded Ad Unit:", TEST_REWARDED_AD_UNIT);

/**
 * Pre-load ad — simulates ad preload
 */
export const preloadAd = (_adType: "videoEnd" | "appOpen" = "videoEnd") => {
  adReady = true;
  console.log("[ReelsPay AdMob] 📦 Ad preloaded (test simulation)");
};

/**
 * Show rewarded ad — simulates showing ad and awards 8 coins
 */
export const showRewardedAd = async (
  videoId: string,
  viewerId: string | null,
  creatorId: string
): Promise<{ shown: boolean; coinsAwarded: number }> => {
  if (adShownForCurrentVideo) {
    return { shown: false, coinsAwarded: 0 };
  }

  console.log("[ReelsPay AdMob] 🎯 Ad Request Sent");
  console.log(`[ReelsPay AdMob] Video: ${videoId} | Viewer: ${viewerId} | Creator: ${creatorId}`);
  console.log("[ReelsPay AdMob] Test Device ID: WEB_TEST_MODE");

  // Simulate ad display delay
  await new Promise((r) => setTimeout(r, 500));

  adShownForCurrentVideo = true;
  console.log(`[ReelsPay AdMob] ✅ Test ad shown — +${COINS_PER_VIEW} coins awarded (placeholder)`);
  return { shown: true, coinsAwarded: COINS_PER_VIEW };
};

/**
 * Check video progress — returns true at 90% completion
 */
export const checkVideoProgress = (
  currentTime: number,
  duration: number
): boolean => {
  if (duration <= 0) return false;
  const progress = currentTime / duration;
  if (progress >= 0.9 && !adShownForCurrentVideo) {
    console.log("[ReelsPay AdMob] 📊 90% reached — triggering ad");
    console.log("Ad Request Sent");
    return true;
  }
  return false;
};

/**
 * Reset ad state for new video
 */
export const resetAdState = () => {
  adReady = false;
  adShownForCurrentVideo = false;
  console.log("[ReelsPay AdMob] 🔄 Ad state reset for next video");
};
