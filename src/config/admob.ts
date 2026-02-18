// AdMob Configuration (public identifiers)
export const ADMOB_CONFIG = {
  appId: "ca-app-pub-9001654710646663~4401746878",
  rewardedAdUnitId: "ca-app-pub-9001654710646663/3545505361", // Updated rewarded ad unit
} as const;

// Test Device IDs for development
export const ADMOB_TEST_DEVICES = [
  "EMULATOR",
  "33BE2250B43518CCDA7DE426D04EE231", // Example test device hash
];

// Log test device info on load
console.log("[ReelsPay AdMob] 🧪 TEST DEVICE IDs:", ADMOB_TEST_DEVICES);
console.log("[ReelsPay AdMob] 📱 App ID:", ADMOB_CONFIG.appId);
console.log("[ReelsPay AdMob] 🎁 Rewarded Ad Unit:", ADMOB_CONFIG.rewardedAdUnitId);

// Revenue split percentages
export const REVENUE_SPLIT = {
  creator: 70,  // ₹2.80 per view
  user: 20,     // 8 coins per view
  platform: 10, // ₹0.40 per view
} as const;
