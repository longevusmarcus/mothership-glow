import type { Signal, Idea } from "./types";

// ── Signal pool ──

export const allSignals: Signal[] = [
  { title: "Invoice automation for freelancers", source: "TikTok", score: 94, pain: "Manual process wastes 6+ hours per week" },
  { title: "AI meal prep for dietary restrictions", source: "Reddit", score: 91, pain: "No personalized solution exists at scale" },
  { title: "Contractor payment splitting", source: "Twitter/X", score: 88, pain: "Financial coordination causes conflicts" },
  { title: "Subscription fatigue manager", source: "ProductHunt", score: 86, pain: "Average user overspends $200+/mo unknowingly" },
  { title: "AI resume screening for SMBs", source: "LinkedIn", score: 84, pain: "Small teams can't afford enterprise solutions" },
  { title: "Pet telehealth platform", source: "Reddit", score: 82, pain: "Rural pet owners drive 2+ hours for vet visits" },
  { title: "Creator royalty tracker", source: "Twitter/X", score: 80, pain: "Musicians lose 30% of earnings to bad accounting" },
  { title: "Micro-SaaS for HOA management", source: "Facebook", score: 79, pain: "HOAs still use spreadsheets and paper" },
  { title: "AI-powered lease review", source: "TikTok", score: 77, pain: "Tenants sign unfair leases without legal help" },
  { title: "Inventory forecasting for DTC brands", source: "Shopify", score: 75, pain: "Overstock/understock costs 15-25% of revenue" },
  { title: "Automated GDPR compliance checker", source: "HackerNews", score: 73, pain: "SMBs can't afford compliance consultants" },
  { title: "AI fitness coach for seniors", source: "Reddit", score: 71, pain: "Generic fitness apps ignore age-related needs" },
  { title: "Freelancer tax estimator", source: "Twitter/X", score: 90, pain: "Quarterly taxes surprise 80% of freelancers" },
  { title: "AI customer support for Shopify", source: "ProductHunt", score: 87, pain: "Small stores can't afford 24/7 support agents" },
  { title: "Niche job board aggregator", source: "LinkedIn", score: 83, pain: "Specialized roles are buried on general platforms" },
];

// ── Ideas pool ──

export const allIdeas: Idea[] = [
  { title: "SplitPay — Contractor payment automation", revenue: "$4.2K MRR proven", tam: "$2.1B", competitors: 3, confidence: 92 },
  { title: "MealMind — AI dietary meal planner", revenue: "$1.8K MRR proven", tam: "$890M", competitors: 7, confidence: 87 },
  { title: "InvoiceFlow — Freelancer billing autopilot", revenue: "$6.1K MRR proven", tam: "$3.4B", competitors: 5, confidence: 95 },
  { title: "SubTrack — Subscription spend optimizer", revenue: "$2.3K MRR proven", tam: "$1.2B", competitors: 4, confidence: 83 },
  { title: "PetVet — Telehealth for pets", revenue: "$3.1K MRR proven", tam: "$1.8B", competitors: 2, confidence: 89 },
  { title: "RoyaltyAI — Creator earnings tracker", revenue: "$1.5K MRR proven", tam: "$670M", competitors: 3, confidence: 81 },
  { title: "HOAHub — Community management SaaS", revenue: "$2.8K MRR proven", tam: "$950M", competitors: 6, confidence: 78 },
  { title: "LeaseGuard — AI lease review tool", revenue: "$900 MRR proven", tam: "$1.4B", competitors: 2, confidence: 85 },
  { title: "StockSense — DTC inventory forecaster", revenue: "$5.4K MRR proven", tam: "$2.7B", competitors: 4, confidence: 91 },
  { title: "TaxPilot — Freelancer tax automation", revenue: "$7.2K MRR proven", tam: "$4.1B", competitors: 8, confidence: 93 },
  { title: "SupportBot — AI support for Shopify", revenue: "$3.6K MRR proven", tam: "$2.3B", competitors: 5, confidence: 88 },
  { title: "NicheJobs — Specialized job aggregator", revenue: "$1.1K MRR proven", tam: "$560M", competitors: 3, confidence: 76 },
];
