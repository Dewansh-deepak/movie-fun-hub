// AdMob Configuration (public identifiers)
export const ADMOB_CONFIG = {
  appId: "ca-app-pub-9001654710646663~4401746878",
  rewardedAdUnitId: "ca-app-pub-9001654710646663/5896558305",
} as const;

// Revenue split percentages
export const REVENUE_SPLIT = {
  creator: 70,  // ₹2.80 per view
  user: 20,     // 8 coins per view
  platform: 10, // ₹0.40 per view
} as const;
