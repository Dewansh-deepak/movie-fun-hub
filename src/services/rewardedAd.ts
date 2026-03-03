// ============================================================
// ✅ REELSPAY AUTO REWARDED AD — 90% Trigger
// Median.co AdMob bridge + PWA web fallback
// Trigger: 90% video completion → automatic rewarded ad
// ============================================================

const COINS_PER_VIEW = 8;
let adShownForCurrentVideo = false;

// Detect Median.co native environment
const isMedianApp = (): boolean => {
  return typeof (window as any).median !== "undefined";
};

console.log("[ReelsPay Ad] Environment:", isMedianApp() ? "Median.co APK" : "Web/PWA");

/**
 * Pre-load ad — calls Median.co bridge or no-op for web
 */
export const preloadAd = (_adType: "videoEnd" | "appOpen" = "videoEnd") => {
  if (isMedianApp()) {
    try {
      (window as any).median?.admob?.showRewarded?.({ cached: true });
      console.log("[ReelsPay Ad] 📦 Median.co rewarded ad cached");
    } catch (e) {
      console.log("[ReelsPay Ad] Cache not available, will load on trigger");
    }
  }
};

/**
 * Show rewarded ad — auto-triggered at 90% video completion
 * Uses Median.co AdMob bridge in APK, simulates in web
 */
export const showRewardedAd = async (
  videoId: string,
  viewerId: string | null,
  creatorId: string
): Promise<{ shown: boolean; coinsAwarded: number }> => {
  if (adShownForCurrentVideo) {
    return { shown: false, coinsAwarded: 0 };
  }

  console.log(`[ReelsPay Ad] 🎯 Auto-trigger | Video: ${videoId}`);

  if (isMedianApp()) {
    // Median.co native AdMob bridge
    try {
      const median = (window as any).median;

      // Set up reward callback before showing
      const rewardPromise = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 30000);

        // Median.co fires this callback on reward
        (window as any).admob_reward = (data: any) => {
          clearTimeout(timeout);
          console.log("[ReelsPay Ad] ✅ Median.co reward callback:", data);
          resolve(true);
        };

        // Median.co fires this on ad close without reward
        (window as any).admob_close = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      });

      median.admob.showRewarded();
      console.log("[ReelsPay Ad] 📺 Median.co rewarded ad shown");

      const rewarded = await rewardPromise;
      if (rewarded) {
        adShownForCurrentVideo = true;
        console.log(`[ReelsPay Ad] ✅ +${COINS_PER_VIEW} coins awarded`);
        return { shown: true, coinsAwarded: COINS_PER_VIEW };
      }

      return { shown: true, coinsAwarded: 0 };
    } catch (error) {
      console.error("[ReelsPay Ad] Median.co ad error:", error);
      return { shown: false, coinsAwarded: 0 };
    }
  } else {
    // Web/PWA simulation — seamless, no UI interruption
    await new Promise((r) => setTimeout(r, 300));
    adShownForCurrentVideo = true;
    console.log(`[ReelsPay Ad] ✅ Web simulation — +${COINS_PER_VIEW} coins (test)`);
    return { shown: true, coinsAwarded: COINS_PER_VIEW };
  }
};

/**
 * Check video progress — returns true at 90% completion (auto-trigger)
 */
export const checkVideoProgress = (
  currentTime: number,
  duration: number
): boolean => {
  if (duration <= 0) return false;
  const progress = currentTime / duration;
  if (progress >= 0.9 && !adShownForCurrentVideo) {
    console.log("[ReelsPay Ad] 📊 90% reached — auto-triggering rewarded ad");
    return true;
  }
  return false;
};

/**
 * Reset ad state for new video
 */
export const resetAdState = () => {
  adShownForCurrentVideo = false;
};
