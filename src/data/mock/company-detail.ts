// ── Company Detail page mock data ──

export interface MockCompanyDetail {
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  description: string;
  stack: string[];
  stage: string;
  budget: string;
  agents: { id: number; name: string; type: string; score: number; status: string; tasks: number; telegram?: string }[];
  daysActive: number;
  aiSummary: string;
}

export const companyDetailData: Record<string, MockCompanyDetail> = {
  "1": {
    title: "NovaTech",
    department: "SaaS B2B",
    location: "Global",
    type: "MVP",
    status: "Attiva",
    stage: "MVP",
    budget: "$2,400/mo",
    description: "AI-powered project management platform for remote teams.",
    stack: ["React/TypeScript", "Node.js", "Supabase", "Stripe", "Vercel", "OpenAI API"],
    agents: [
      { id: 1, name: "CEO Agent", type: "Tech", score: 96, status: "Active", tasks: 47, telegram: "CEOAgent_bot" },
      { id: 2, name: "GrowthPilot", type: "Growth", score: 91, status: "Active", tasks: 23, telegram: "GrowthPilot_bot" },
      { id: 6, name: "MarketBot", type: "Growth", score: 88, status: "Active", tasks: 15, telegram: "MarketBot_agent" },
      { id: 3, name: "DesignMind", type: "Creative", score: 87, status: "To Activate", tasks: 31, telegram: "DesignMind_bot" },
    ],
    daysActive: 23,
    aiSummary: "NovaTech is progressing well toward MVP launch. CEO Agent has completed 47 tasks including the core dashboard, real-time collaboration features, and Stripe integration. GrowthPilot is building the landing page and setting up analytics. Estimated MVP completion: 5 days.",
  },
};

export const defaultCompanyDetail = companyDetailData["1"];

export const taskLog = [
  { agent: "CEO Agent", task: "Implemented real-time collaboration WebSocket layer", time: "2h ago", status: "done" as const },
  { agent: "CEO Agent", task: "Integrated Stripe checkout + subscription management", time: "5h ago", status: "done" as const },
  { agent: "GrowthPilot", task: "Landing page v2 with A/B test variants", time: "8h ago", status: "done" as const },
  { agent: "DesignMind", task: "Dashboard UI redesign — dark mode + responsive", time: "1d ago", status: "done" as const },
  { agent: "MarketBot", task: "SEO meta tags + Open Graph for all pages", time: "1d ago", status: "done" as const },
  { agent: "CEO Agent", task: "Setting up CI/CD pipeline with GitHub Actions", time: "now", status: "in_progress" as const },
  { agent: "GrowthPilot", task: "Google Analytics 4 + conversion tracking", time: "now", status: "in_progress" as const },
];

export const companyDocuments = [
  { name: "Company Mission & Vision", type: "Mission", agent: "GrowthPilot", time: "1d ago", size: "2.4 KB", status: "final" as const },
  { name: "Market Research — SaaS PM Tools", type: "Market Research", agent: "MarketBot", time: "2d ago", size: "18.7 KB", status: "final" as const },
  { name: "Competitive Analysis Report", type: "Market Research", agent: "MarketBot", time: "3d ago", size: "12.1 KB", status: "final" as const },
  { name: "Go-To-Market Strategy v2", type: "Strategy", agent: "GrowthPilot", time: "4d ago", size: "8.3 KB", status: "draft" as const },
  { name: "Technical Architecture Doc", type: "Technical", agent: "CEO Agent", time: "5d ago", size: "6.9 KB", status: "final" as const },
  { name: "Brand Guidelines & Tone", type: "Branding", agent: "DesignMind", time: "6d ago", size: "4.1 KB", status: "final" as const },
  { name: "Revenue Model & Projections", type: "Financial", agent: "GrowthPilot", time: "1w ago", size: "9.5 KB", status: "draft" as const },
];

export const deployPreviews = [
  { name: "Dashboard v3.2", url: "novatech-dash.vercel.app", agent: "CEO Agent", time: "2h ago", status: "live" },
  { name: "Landing Page v2", url: "novatech.com", agent: "GrowthPilot", time: "8h ago", status: "live" },
  { name: "Onboarding Flow", url: "novatech-onboard.vercel.app", agent: "DesignMind", time: "1d ago", status: "preview" },
];

export const agentEmails = [
  { subject: "Welcome to NovaTech — Your workspace is ready", to: "new-user@gmail.com", agent: "GrowthPilot", time: "1h ago", status: "delivered" as const },
  { subject: "Your free trial ends in 3 days", to: "trial-user@company.co", agent: "GrowthPilot", time: "4h ago", status: "delivered" as const },
  { subject: "NovaTech Weekly Digest — What's new", to: "subscriber-list (847)", agent: "MarketBot", time: "1d ago", status: "delivered" as const },
  { subject: "Your invoice for March 2026", to: "paying-customer@startup.io", agent: "CEO Agent", time: "2d ago", status: "delivered" as const },
  { subject: "Re: Integration support request", to: "dev@partner.com", agent: "CEO Agent", time: "3d ago", status: "opened" as const },
];

export const agentXPosts = [
  { content: "Just shipped real-time collaboration for NovaTech 🚀 Remote teams can now co-edit projects live. Try it free →", agent: "GrowthPilot", time: "2h ago", likes: 142, retweets: 38, impressions: "12.4K" },
  { content: "Why we built NovaTech: 73% of remote PMs still use spreadsheets to track projects. That's insane in 2026. Thread 🧵", agent: "MarketBot", time: "8h ago", likes: 89, retweets: 24, impressions: "8.7K" },
  { content: "NovaTech vs Notion vs Linear — honest comparison from the team that built it. No BS, just data.", agent: "MarketBot", time: "1d ago", likes: 231, retweets: 67, impressions: "24.1K" },
  { content: "Stripe integration done ✅ Subscriptions, checkout, webhooks — all handled by our AI agents in 4 hours.", agent: "CEO Agent", time: "2d ago", likes: 56, retweets: 12, impressions: "5.2K" },
];

export const agentAds = [
  { name: "Google Search — 'project management tool'", platform: "Google Ads", agent: "GrowthPilot", spend: "$124", clicks: 342, ctr: "4.2%", conversions: 18, status: "active" as const },
  { name: "Meta — Remote team lookalike audience", platform: "Meta Ads", agent: "GrowthPilot", spend: "$89", clicks: 215, ctr: "3.8%", conversions: 11, status: "active" as const },
  { name: "Twitter — PM tool thread promo", platform: "X Ads", agent: "MarketBot", spend: "$45", clicks: 178, ctr: "5.1%", conversions: 7, status: "active" as const },
  { name: "LinkedIn — B2B SaaS decision makers", platform: "LinkedIn Ads", agent: "GrowthPilot", spend: "$210", clicks: 89, ctr: "2.9%", conversions: 5, status: "paused" as const },
];
