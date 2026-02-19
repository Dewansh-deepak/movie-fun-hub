// ============================================================
// ⚠️ ADMOB TEMPORARILY DISABLED — UI PRIORITY MODE
// Console: AdMob DISABLED - UI Priority
// Placeholder: "Ads Coming Soon"
// ============================================================

console.log("AdMob DISABLED - UI Priority");
console.log("[ReelsPay AdMob] 🚫 AdMob is DISABLED — showing placeholder: 'Ads Coming Soon'");
console.log("[ReelsPay AdMob] ✅ All UI features (Creator बनें, Log Out, Navigation) are ACTIVE");

/**
 * Pre-load ad — DISABLED (no-op)
 */
export const preloadAd = (_adType: "videoEnd" | "appOpen" = "videoEnd") => {
  console.log("[ReelsPay AdMob] 🚫 preloadAd() called but AdMob is DISABLED");
};

/**
 * Show rewarded ad — DISABLED, returns placeholder response
 */
export const showRewardedAd = async (
  _videoId: string,
  _viewerId: string | null,
  _creatorId: string
): Promise<{ shown: boolean; coinsAwarded: number }> => {
  console.log("[ReelsPay AdMob] 🚫 showRewardedAd() called but AdMob is DISABLED");
  console.log("[ReelsPay AdMob] 📢 Placeholder: Ads Coming Soon");
  return { shown: false, coinsAwarded: 0 };
};

/**
 * Check video progress — DISABLED (always returns false)
 */
export const checkVideoProgress = (
  _currentTime: number,
  _duration: number
): boolean => {
  return false;
};

/**
 * Reset ad state — DISABLED (no-op)
 */
export const resetAdState = () => {
  console.log("[ReelsPay AdMob] 🔄 resetAdState() called — AdMob DISABLED");
};
