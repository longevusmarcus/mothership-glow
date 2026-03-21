// ── Live / Command Ship page mock data ──

export const revenueData = [
  { date: "Feb 4", value: 2100 },
  { date: "Feb 16", value: 4800 },
  { date: "Mar 5", value: 7200 },
  { date: "Mar 13", value: 12400 },
  { date: "Mar 17", value: 18600 },
  { date: "Mar 20", value: 25605 },
];

export const ecosystemStats = [
  { label: "Annual Run Rate", value: "$25,605", change: "+63% WoW" },
  { label: "Market Signals", value: "162", change: "0% WoW" },
  { label: "Ideas Generated", value: "757", change: "0% WoW" },
  { label: "Shipped Products", value: "40", change: null },
  { label: "Tasks Completed", value: "3,110", change: null },
];

export const liveDocuments = [
  { type: "M", company: "Supaborg", doc: "Mission", time: "11h ago" },
  { type: "R", company: "BloomOS", doc: "Market Research", time: "11h ago" },
  { type: "M", company: "BloomOS", doc: "Mission", time: "11h ago" },
  { type: "R", company: "Lanzalo", doc: "Market Research", time: "1h ago" },
  { type: "M", company: "Lanzalo", doc: "Mission", time: "1h ago" },
  { type: "M", company: "Borgpro", doc: "Mission", time: "10h ago" },
];

export const liveIdeas = [
  { name: "MetaLink", desc: "A community-governed platform and marketplace fo...", score: 90, time: "0s ago" },
  { name: "Nexus Slate", desc: "A premium, E-Ink powered tablet and local-first knowledge hu...", score: 90, time: "12s ago" },
  { name: "Human Seal", desc: "A secure hardware token for creators to digita...", score: 90, time: "24s ago" },
];

export const liveSignals = [
  { text: "Gym bros want AI meal prep from fridge photo", source: "TikTok", views: "3.4M views", time: "0s ago" },
  { text: "Small biz owners need automated bookkeeping", source: "Reddit", views: "89K views", time: "8s ago" },
  { text: "Remote workers want async standup bots", source: "Reddit", views: "45K views", time: "16s ago" },
  { text: "Gym bros want AI meal prep from fridge photo", source: "TikTok", views: "3.4M views", time: "24s ago" },
];

export const leaderboard = [
  { rank: 1, name: "Lanzalo", sub: "Lanzalo", mrr: "···", score: 94 },
  { rank: 2, name: "Borgpro", sub: "A platform where graduates com", mrr: "···", score: 91 },
  { rank: 3, name: "Supaborg", sub: "Supaborg agent product", mrr: "···", score: 88 },
  { rank: 4, name: "Suborg", sub: "", mrr: "···", score: 85 },
];

export const liveTasks = [
  { title: "Return 503 with Discord support link when bot pool is empty", tag: "mothershipx" },
  { title: "Add QA story prompts + gitignore cleanup", tag: "mothershipx" },
  { title: "Migrate 18 large EFs to Hono framework (batch 3)", tag: "mothershipx" },
];

export const liveProducts = [
  { name: "Lanzalo", domain: "lanzalo.msx.dev", time: "2m ago" },
  { name: "Borgpro", domain: "borgpro.msx.dev", time: "5m ago" },
  { name: "Supaborg", domain: "supaborg.msx.dev", time: "8m ago" },
  { name: "Suborg", domain: "suborg.msx.dev", time: "11m ago" },
];

export const liveTweets = [
  { text: "Built an AI tool that files pet insurance claims in 30 seconds. Already 89 users.", time: "1h ago" },
  { text: "Snap your fridge, get a personalized meal plan. FridgeFit just hit 156 users.", time: "2h ago" },
  { text: "Automated bookkeeping for small businesses. No more spreadsheets.", time: "3h ago" },
  { text: "Every parent needs smart screen time controls. Building ScreenGuard.", time: "4h ago" },
];

export const liveEmails = [
  { subject: "Welcome to MothershipX", to: "b***@gmail.com", time: "30m ago" },
  { subject: "Your idea is ready", to: "m***@outlook.com", time: "1h ago" },
  { subject: "New problem detected", to: "j***@hey.com", time: "1h ago" },
  { subject: "Weekly market report", to: "s***@proton.me", time: "2h ago" },
];

export const liveAds = [
  { name: "PetClaimBot - Google", spend: "$2.38", impr: "410", clicks: "20", ctr: "4.88%", cpc: "$0.12" },
  { name: "FridgeFit - Meta", spend: "$0.43", impr: "66", clicks: "2", ctr: "3.03%", cpc: "$0.22" },
  { name: "InvoiceSnap - Google", spend: "$1.34", impr: "124", clicks: "5", ctr: "4.03%", cpc: "$0.27" },
];

export const hackathon = {
  title: "Couple Conflict Resolver",
  desc: "Build an app that helps couples settle disputes fairly. Who's right? Let AI decide!",
  prize: "$1000",
  participants: "11/200",
  difficulty: "beginner",
};

export const terminalLines = [
  { text: "> Revenue event: $4.99 subscription activated", color: "text-muted-foreground" },
  { text: "> Revenue event: $4.99 subscription activated", color: "text-muted-foreground" },
  { text: "> Revenue event: $4.99 subscription activated", color: "text-muted-foreground" },
  { text: "> Agent Nova: shipping MVP for PetTrackr", color: "text-foreground" },
  { text: "> Message sent to company inbox...", color: "text-destructive" },
];
