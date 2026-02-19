// AdMob Configuration (public identifiers)
export const ADMOB_CONFIG = {
  appId: "ca-app-pub-9001654710646663~4401746878", // Production App ID
  rewardedAdUnitId: "ca-app-pub-3940256099942544/5224354917", // ✅ TEST Rewarded Ad Unit ID
} as const;

// ✅ TEST MODE — No real ads will be served
export const IS_TEST_MODE = true;

// Test Device IDs for development
export const ADMOB_TEST_DEVICES = [
  "EMULATOR",
  "33BE2250B43518CCDA7DE426D04EE231", // Test device hash
  "ca-app-pub-3940256099942544",       // Google test publisher prefix
];

// Log test device info on load
console.log("[ReelsPay AdMob] ✅ TEST MODE ACTIVE — No real ads");
console.log("[ReelsPay AdMob] 🧪 TEST DEVICE IDs:", ADMOB_TEST_DEVICES);
console.log("[ReelsPay AdMob] 📱 App ID:", ADMOB_CONFIG.appId);
console.log("[ReelsPay AdMob] 🎁 TEST Rewarded Ad Unit:", ADMOB_CONFIG.rewardedAdUnitId);

// Revenue split percentages
export const REVENUE_SPLIT = {
  creator: 70,  // ₹2.80 per view
  user: 20,     // 8 coins per view
  platform: 10, // ₹0.40 per view
} as const;
