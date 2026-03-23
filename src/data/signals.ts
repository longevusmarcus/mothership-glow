import type { Signal, Idea } from "./types";

// ── Signal pool ──

export const allSignals: Signal[] = [
  { title: "Invoice automation for freelancers", source: "TikTok", score: 94, pain: "Manual process wastes 6+ hours per week", category: "FinTech", views: "2.1M", trending: true, tags: ["freelance", "billing", "automation"], sentiment: 89 },
  { title: "AI meal prep for dietary restrictions", source: "Reddit", score: 91, pain: "No personalized solution exists at scale", category: "Health", views: "1.4M", trending: true, tags: ["nutrition", "AI", "personalization"], sentiment: 85 },
  { title: "Contractor payment splitting", source: "Twitter/X", score: 88, pain: "Financial coordination causes conflicts", category: "FinTech", views: "890K", trending: false, tags: ["payments", "gig economy", "splitting"], sentiment: 78 },
  { title: "Subscription fatigue manager", source: "ProductHunt", score: 86, pain: "Average user overspends $200+/mo unknowingly", category: "Productivity", views: "1.8M", trending: true, tags: ["subscriptions", "budgeting", "waste"], sentiment: 92 },
  { title: "AI resume screening for SMBs", source: "LinkedIn", score: 84, pain: "Small teams can't afford enterprise solutions", category: "HR", views: "670K", trending: false, tags: ["hiring", "AI screening", "SMB"], sentiment: 74 },
  { title: "Pet telehealth platform", source: "Reddit", score: 82, pain: "Rural pet owners drive 2+ hours for vet visits", category: "PetTech", views: "3.2M", trending: true, tags: ["pets", "telehealth", "rural"], sentiment: 91 },
  { title: "Creator royalty tracker", source: "Twitter/X", score: 80, pain: "Musicians lose 30% of earnings to bad accounting", category: "Creator Economy", views: "1.1M", trending: false, tags: ["music", "royalties", "creator tools"], sentiment: 82 },
  { title: "Micro-SaaS for HOA management", source: "Facebook", score: 79, pain: "HOAs still use spreadsheets and paper", category: "Real Estate", views: "450K", trending: false, tags: ["HOA", "management", "community"], sentiment: 71 },
  { title: "AI-powered lease review", source: "TikTok", score: 77, pain: "Tenants sign unfair leases without legal help", category: "Legal", views: "5.6M", trending: true, tags: ["lease", "legal AI", "tenant rights"], sentiment: 88 },
  { title: "Inventory forecasting for DTC brands", source: "Shopify", score: 75, pain: "Overstock/understock costs 15-25% of revenue", category: "E-commerce", views: "320K", trending: false, tags: ["inventory", "DTC", "forecasting"], sentiment: 69 },
  { title: "Automated GDPR compliance checker", source: "HackerNews", score: 73, pain: "SMBs can't afford compliance consultants", category: "Legal", views: "280K", trending: false, tags: ["GDPR", "compliance", "privacy"], sentiment: 67 },
  { title: "AI fitness coach for seniors", source: "Reddit", score: 71, pain: "Generic fitness apps ignore age-related needs", category: "Health", views: "2.4M", trending: true, tags: ["fitness", "seniors", "accessibility"], sentiment: 86 },
  { title: "Freelancer tax estimator", source: "Twitter/X", score: 90, pain: "Quarterly taxes surprise 80% of freelancers", category: "FinTech", views: "1.9M", trending: true, tags: ["taxes", "freelance", "estimation"], sentiment: 90 },
  { title: "AI customer support for Shopify", source: "ProductHunt", score: 87, pain: "Small stores can't afford 24/7 support agents", category: "E-commerce", views: "780K", trending: false, tags: ["support", "AI chatbot", "Shopify"], sentiment: 76 },
  { title: "Niche job board aggregator", source: "LinkedIn", score: 83, pain: "Specialized roles are buried on general platforms", category: "HR", views: "540K", trending: false, tags: ["jobs", "niche", "aggregation"], sentiment: 73 },
];

// ── Ideas pool ──

export const allIdeas: Idea[] = [
  { title: "SplitPay — Contractor payment automation", revenue: "$4.2K MRR proven", tam: "$2.1B", competitors: 3, confidence: 92, category: "FinTech", timeToMvp: "3 weeks", marketGrowth: "+34% YoY", tags: ["payments", "gig economy"] },
  { title: "MealMind — AI dietary meal planner", revenue: "$1.8K MRR proven", tam: "$890M", competitors: 7, confidence: 87, category: "Health", timeToMvp: "4 weeks", marketGrowth: "+28% YoY", tags: ["nutrition", "AI"] },
  { title: "InvoiceFlow — Freelancer billing autopilot", revenue: "$6.1K MRR proven", tam: "$3.4B", competitors: 5, confidence: 95, category: "FinTech", timeToMvp: "2 weeks", marketGrowth: "+41% YoY", tags: ["invoicing", "automation"] },
  { title: "SubTrack — Subscription spend optimizer", revenue: "$2.3K MRR proven", tam: "$1.2B", competitors: 4, confidence: 83, category: "Productivity", timeToMvp: "3 weeks", marketGrowth: "+22% YoY", tags: ["subscriptions", "savings"] },
  { title: "PetVet — Telehealth for pets", revenue: "$3.1K MRR proven", tam: "$1.8B", competitors: 2, confidence: 89, category: "PetTech", timeToMvp: "5 weeks", marketGrowth: "+47% YoY", tags: ["pets", "telehealth"] },
  { title: "RoyaltyAI — Creator earnings tracker", revenue: "$1.5K MRR proven", tam: "$670M", competitors: 3, confidence: 81, category: "Creator Economy", timeToMvp: "3 weeks", marketGrowth: "+31% YoY", tags: ["music", "royalties"] },
  { title: "HOAHub — Community management SaaS", revenue: "$2.8K MRR proven", tam: "$950M", competitors: 6, confidence: 78, category: "Real Estate", timeToMvp: "4 weeks", marketGrowth: "+18% YoY", tags: ["HOA", "community"] },
  { title: "LeaseGuard — AI lease review tool", revenue: "$900 MRR proven", tam: "$1.4B", competitors: 2, confidence: 85, category: "Legal", timeToMvp: "3 weeks", marketGrowth: "+26% YoY", tags: ["legal", "AI review"] },
  { title: "StockSense — DTC inventory forecaster", revenue: "$5.4K MRR proven", tam: "$2.7B", competitors: 4, confidence: 91, category: "E-commerce", timeToMvp: "4 weeks", marketGrowth: "+37% YoY", tags: ["inventory", "DTC"] },
  { title: "TaxPilot — Freelancer tax automation", revenue: "$7.2K MRR proven", tam: "$4.1B", competitors: 8, confidence: 93, category: "FinTech", timeToMvp: "3 weeks", marketGrowth: "+39% YoY", tags: ["taxes", "automation"] },
  { title: "SupportBot — AI support for Shopify", revenue: "$3.6K MRR proven", tam: "$2.3B", competitors: 5, confidence: 88, category: "E-commerce", timeToMvp: "2 weeks", marketGrowth: "+33% YoY", tags: ["support", "AI"] },
  { title: "NicheJobs — Specialized job aggregator", revenue: "$1.1K MRR proven", tam: "$560M", competitors: 3, confidence: 76, category: "HR", timeToMvp: "4 weeks", marketGrowth: "+15% YoY", tags: ["jobs", "niche"] },
];
