import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "hi";

const translations = {
  en: {
    // Common
    appName: "Reelspay",
    tagline: "Create Shorts → Earn Real ₹",
    createShareEarn: "Create. Share. Earn.",
    skip: "Skip",
    back: "Back",
    logout: "Logout",
    logoutConfirm: "Logout from Reelspay?",
    logoutDesc: "You will need to sign in again to access your account.",
    cancel: "Cancel",
    signIn: "Sign In",
    signUp: "Create Account",
    settings: "Settings",
    darkMode: "Dark Mode",

    // Nav
    home: "Home",
    shorts: "Shorts",
    create: "Create",
    community: "Community",
    trending: "Trending",

    // Side Menu
    creatorDashboard: "Creator Dashboard",
    monetizationSettings: "Monetization Settings",
    earningsHistory: "Earnings History",
    inviteFriends: "Invite Friends",
    inviteBonus: "₹50 bonus",
    backToWelcome: "Back to Welcome",

    // Onboarding
    onboardingHero: "💰 Reelspay: Create Shorts → Earn Real ₹",
    indiaPlatform: "India's AI-powered creator platform",
    uploadDesc: "Upload short videos, go viral, and earn real ₹ from views. It's that simple.",
    startWatching: "Start Watching",
    becomeCreator: "Become a Creator",
    maxVideo: "Max Video",
    minPayout: "Min Payout",
    instantPay: "Instant Pay",
    whyReelspay: "Why Reelspay?",
    platformBuilt: "The platform built for Indian creators to monetize their talent",
    easyUpload: "Easy Upload",
    easyUploadDesc: "Upload 15-60s shorts or 10min long-form",
    aiGenerate: "AI Generate",
    aiGenerateDesc: "Create videos with AI using Hoopr.ai",
    goViral: "Go Viral",
    goViralDesc: "AI recommendations boost your content",
    earnMoney: "Earn Money",
    earnMoneyDesc: "10 views = 1 coin. Withdraw via UPI",
    howItWorks: "How It Works",
    step1: "Sign Up",
    step1Desc: "Create your free creator account",
    step2: "Upload",
    step2Desc: "Post 60-second videos or use AI",
    step3: "Earn ₹",
    step3Desc: "Get coins from views, cash out via UPI",
    getStartedFree: "Get Started Free",
    goToDashboard: "Go to Dashboard",
    joinCommunity: "Join the Creator Community",
    joinCommunityDesc: "Connect with fellow creators, share tips, collaborate on content, and grow together. Reelspay is more than a platform—it's a family.",
    exploreCommunity: "Explore Community",
    madeInIndia: "Made with ❤️ in India 🇮🇳",

    // Auth
    turnCreativity: "Turn your creativity into ₹ with Reelspay",
    creatorName: "Creator Name",
    email: "Email",
    password: "Password",
    noAccount: "Don't have an account? Sign up",
    hasAccount: "Already have an account? Sign in",
    termsAgree: "By continuing, you agree to our Terms of Service and Privacy Policy",
    earnRupee: "Earn ₹",
    aiCreate: "AI Create",

    // Feed
    forYou: "For You",
    drama: "Drama",
    horror: "Horror",
    comedy: "Comedy",
    romance: "Romance",
    noVideos: "No videos yet in this category",
    viewAll: "View All Videos",

    // Dashboard
    backToFeed: "Back to Feed",
    creatorAccount: "Creator Account",
    viewerAccount: "Viewer Account",
    uploadVideo: "Upload Video",
    totalCoins: "Total Coins",
    totalViews: "Total Views",
    earnedToday: "Earned Today",
    videos: "Videos",
    overview: "Overview",
    earnings: "Earnings",
    payouts: "Payouts",
    videoStats60s: "60s Video Stats",
    earningsCalculator: "Earnings Calculator",
    requestPayout: "Request Payout",
    recentActivity: "Recent Activity",

    // Upload
    videoType: "Video Type",
    shortsLabel: "Shorts",
    longformLabel: "Long-form",
    title: "Title",
    description: "Description",
    category: "Category",
    uploadShort: "Upload Short",
    uploadVideoBtn: "Upload Video",

    // Community
    creatorCommunity: "Creator Community",
    connectCreators: "Connect with fellow creators",
    chatComingSoon: "Chat Coming Soon! 🚀",
    getNotified: "Get Notified",

    // Trending
    trendingNow: "Trending Now",

    // AI Generate
    aiVideoGenerator: "AI Video Generator",
    poweredByHoopr: "Powered by Hoopr.ai",
    describeIdea: "Describe your video idea",
    tryIdeas: "Try these ideas:",
    generateVideo: "Generate Video",
    aiComingSoon: "AI Generation Coming Soon!",

    // Shorts page
    creatorShorts: "Creator Shorts",

    // Language
    language: "Language",
  },
  hi: {
    appName: "Reelspay",
    tagline: "शॉर्ट्स बनाएं → असली ₹ कमाएं",
    createShareEarn: "बनाएं। शेयर करें। कमाएं।",
    skip: "छोड़ें",
    back: "वापस",
    logout: "लॉगआउट",
    logoutConfirm: "Reelspay से लॉगआउट करें?",
    logoutDesc: "आपको अपने खाते तक पहुंचने के लिए फिर से साइन इन करना होगा।",
    cancel: "रद्द करें",
    signIn: "साइन इन",
    signUp: "अकाउंट बनाएं",
    settings: "सेटिंग्स",
    darkMode: "डार्क मोड",

    home: "होम",
    shorts: "शॉर्ट्स",
    create: "बनाएं",
    community: "समुदाय",
    trending: "ट्रेंडिंग",

    creatorDashboard: "क्रिएटर डैशबोर्ड",
    monetizationSettings: "मुद्रीकरण सेटिंग्स",
    earningsHistory: "कमाई इतिहास",
    inviteFriends: "दोस्तों को आमंत्रित करें",
    inviteBonus: "₹50 बोनस",
    backToWelcome: "वेलकम पर वापस",

    onboardingHero: "💰 Reelspay: शॉर्ट्स बनाएं → असली ₹ कमाएं",
    indiaPlatform: "भारत का AI-संचालित क्रिएटर प्लेटफॉर्म",
    uploadDesc: "शॉर्ट वीडियो अपलोड करें, वायरल हों, और व्यूज से असली ₹ कमाएं।",
    startWatching: "देखना शुरू करें",
    becomeCreator: "क्रिएटर बनें",
    maxVideo: "अधिकतम वीडियो",
    minPayout: "न्यूनतम भुगतान",
    instantPay: "तुरंत भुगतान",
    whyReelspay: "Reelspay क्यों?",
    platformBuilt: "भारतीय क्रिएटर्स के लिए बना प्लेटफॉर्म",
    easyUpload: "आसान अपलोड",
    easyUploadDesc: "15-60s शॉर्ट्स या 10min लॉन्ग-फॉर्म अपलोड करें",
    aiGenerate: "AI जनरेट",
    aiGenerateDesc: "Hoopr.ai से AI वीडियो बनाएं",
    goViral: "वायरल हों",
    goViralDesc: "AI आपके कंटेंट को बूस्ट करेगा",
    earnMoney: "पैसे कमाएं",
    earnMoneyDesc: "10 व्यूज = 1 कॉइन। UPI से निकालें",
    howItWorks: "कैसे काम करता है",
    step1: "साइन अप",
    step1Desc: "अपना फ्री क्रिएटर अकाउंट बनाएं",
    step2: "अपलोड",
    step2Desc: "60 सेकंड वीडियो पोस्ट करें या AI यूज करें",
    step3: "₹ कमाएं",
    step3Desc: "व्यूज से कॉइन पाएं, UPI से कैश आउट करें",
    getStartedFree: "मुफ्त शुरू करें",
    goToDashboard: "डैशबोर्ड पर जाएं",
    joinCommunity: "क्रिएटर समुदाय से जुड़ें",
    joinCommunityDesc: "साथी क्रिएटर्स से जुड़ें, टिप्स शेयर करें, कंटेंट पर सहयोग करें।",
    exploreCommunity: "समुदाय देखें",
    madeInIndia: "❤️ के साथ भारत में बनाया 🇮🇳",

    turnCreativity: "Reelspay से अपनी क्रिएटिविटी को ₹ में बदलें",
    creatorName: "क्रिएटर नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    noAccount: "अकाउंट नहीं है? साइन अप करें",
    hasAccount: "पहले से अकाउंट है? साइन इन करें",
    termsAgree: "जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं",
    earnRupee: "₹ कमाएं",
    aiCreate: "AI बनाएं",

    forYou: "आपके लिए",
    drama: "ड्रामा",
    horror: "हॉरर",
    comedy: "कॉमेडी",
    romance: "रोमांस",
    noVideos: "इस श्रेणी में अभी कोई वीडियो नहीं",
    viewAll: "सभी वीडियो देखें",

    backToFeed: "फीड पर वापस",
    creatorAccount: "क्रिएटर अकाउंट",
    viewerAccount: "व्यूअर अकाउंट",
    uploadVideo: "वीडियो अपलोड",
    totalCoins: "कुल कॉइन",
    totalViews: "कुल व्यूज",
    earnedToday: "आज की कमाई",
    videos: "वीडियो",
    overview: "अवलोकन",
    earnings: "कमाई",
    payouts: "भुगतान",
    videoStats60s: "60s वीडियो आंकड़े",
    earningsCalculator: "कमाई कैलकुलेटर",
    requestPayout: "भुगतान अनुरोध",
    recentActivity: "हाल की गतिविधि",

    videoType: "वीडियो प्रकार",
    shortsLabel: "शॉर्ट्स",
    longformLabel: "लॉन्ग-फॉर्म",
    title: "शीर्षक",
    description: "विवरण",
    category: "श्रेणी",
    uploadShort: "शॉर्ट अपलोड",
    uploadVideoBtn: "वीडियो अपलोड",

    creatorCommunity: "क्रिएटर समुदाय",
    connectCreators: "साथी क्रिएटर्स से जुड़ें",
    chatComingSoon: "चैट जल्द आ रहा है! 🚀",
    getNotified: "सूचित करें",

    trendingNow: "अभी ट्रेंडिंग",

    aiVideoGenerator: "AI वीडियो जनरेटर",
    poweredByHoopr: "Hoopr.ai द्वारा संचालित",
    describeIdea: "अपने वीडियो आइडिया का वर्णन करें",
    tryIdeas: "ये आइडिया आज़माएं:",
    generateVideo: "वीडियो जनरेट करें",
    aiComingSoon: "AI जनरेशन जल्द आ रहा है!",

    creatorShorts: "क्रिएटर शॉर्ट्स",

    language: "भाषा",
  },
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("reelspay_lang");
    if (saved === "hi" || saved === "en") return saved;
    // Auto-detect
    const browserLang = navigator.language || "";
    if (browserLang.startsWith("hi")) return "hi";
    return "hi"; // Hindi default for India users
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("reelspay_lang", newLang);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
