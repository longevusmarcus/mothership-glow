import { Code, TrendingUp, Brain, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Shared Types ──

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

export interface CompanyRef {
  id: string;
  name: string;
  type: string;
  agents: number;
}

export interface Signal {
  title: string;
  source: string;
  score: number;
  pain: string;
}

export interface Idea {
  title: string;
  revenue: string;
  tam: string;
  competitors: number;
  confidence: number;
}

// ── Type metadata (shared across Agents + AgentDetail) ──

export const typeMeta: Record<string, { label: string; color: string; icon: string }> = {
  tech: { label: "Tech", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "⚡" },
  growth: { label: "Growth", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "📈" },
  ops: { label: "Ops", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "⚙️" },
  creative: { label: "Creative", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "🎨" },
};

// ── Deployable agents (Chat + CompanyCreate) ──

export const deployableAgents: AgentDef[] = [
  {
    id: "ceoagent",
    name: "CEO Agent",
    role: "Full-Stack Builder",
    icon: Code,
    color: "hsl(var(--chart-1))",
    desc: "Builds MVPs end-to-end. Deploys landing pages, backends, and payment flows.",
  },
  {
    id: "growthpilot",
    name: "GrowthPilot",
    role: "Growth & Distribution",
    icon: TrendingUp,
    color: "hsl(var(--chart-2))",
    desc: "Sets up acquisition channels and runs traction experiments.",
  },
  {
    id: "visionarch",
    name: "VisionArch",
    role: "Product Strategist",
    icon: Brain,
    color: "hsl(var(--chart-3))",
    desc: "Synthesizes ideas into a coherent product strategy.",
  },
  {
    id: "dataweaver",
    name: "DataWeaver",
    role: "Data & Integrations",
    icon: Database,
    color: "hsl(var(--chart-4))",
    desc: "Connects APIs and builds automated pipelines.",
  },
];

// ── Existing companies (Chat deploy flow) ──

export const existingCompanies: CompanyRef[] = [
  { id: "1", name: "NovaTech", type: "SaaS B2B", agents: 4 },
  { id: "novapay", name: "NovaPay", type: "SaaS B2B", agents: 2 },
  { id: "mealmind", name: "MealMind", type: "Consumer App", agents: 1 },
  { id: "splitpay", name: "SplitPay", type: "Fintech", agents: 3 },
];

// ── Deploy steps (Chat + CompanyCreate) ──

export const chatDeploySteps = [
  "Analyzing selected signals & ideas...",
  "Generating business model & pricing...",
  "Designing tech architecture...",
  "Building landing page...",
  "Setting up backend & payments...",
  "Running pre-launch checks...",
  "Deploying to production...",
];

// ── Signal pool (Chat) ──

export const allSignals: Signal[] = [
  {
    title: "Invoice automation for freelancers",
    source: "TikTok",
    score: 94,
    pain: "Manual process wastes 6+ hours per week",
  },
  {
    title: "AI meal prep for dietary restrictions",
    source: "Reddit",
    score: 91,
    pain: "No personalized solution exists at scale",
  },
  {
    title: "Contractor payment splitting",
    source: "Twitter/X",
    score: 88,
    pain: "Financial coordination causes conflicts",
  },
  {
    title: "Subscription fatigue manager",
    source: "ProductHunt",
    score: 86,
    pain: "Average user overspends $200+/mo unknowingly",
  },
  {
    title: "AI resume screening for SMBs",
    source: "LinkedIn",
    score: 84,
    pain: "Small teams can't afford enterprise solutions",
  },
  {
    title: "Pet telehealth platform",
    source: "Reddit",
    score: 82,
    pain: "Rural pet owners drive 2+ hours for vet visits",
  },
  {
    title: "Creator royalty tracker",
    source: "Twitter/X",
    score: 80,
    pain: "Musicians lose 30% of earnings to bad accounting",
  },
  {
    title: "Micro-SaaS for HOA management",
    source: "Facebook",
    score: 79,
    pain: "HOAs still use spreadsheets and paper",
  },
  {
    title: "AI-powered lease review",
    source: "TikTok",
    score: 77,
    pain: "Tenants sign unfair leases without legal help",
  },
  {
    title: "Inventory forecasting for DTC brands",
    source: "Shopify",
    score: 75,
    pain: "Overstock/understock costs 15-25% of revenue",
  },
  {
    title: "Automated GDPR compliance checker",
    source: "HackerNews",
    score: 73,
    pain: "SMBs can't afford compliance consultants",
  },
  {
    title: "AI fitness coach for seniors",
    source: "Reddit",
    score: 71,
    pain: "Generic fitness apps ignore age-related needs",
  },
  {
    title: "Freelancer tax estimator",
    source: "Twitter/X",
    score: 90,
    pain: "Quarterly taxes surprise 80% of freelancers",
  },
  {
    title: "AI customer support for Shopify",
    source: "ProductHunt",
    score: 87,
    pain: "Small stores can't afford 24/7 support agents",
  },
  {
    title: "Niche job board aggregator",
    source: "LinkedIn",
    score: 83,
    pain: "Specialized roles are buried on general platforms",
  },
];

// ── Ideas pool (Chat) ──

export const allIdeas: Idea[] = [
  {
    title: "SplitPay — Contractor payment automation",
    revenue: "$4.2K MRR proven",
    tam: "$2.1B",
    competitors: 3,
    confidence: 92,
  },
  {
    title: "MealMind — AI dietary meal planner",
    revenue: "$1.8K MRR proven",
    tam: "$890M",
    competitors: 7,
    confidence: 87,
  },
  {
    title: "InvoiceFlow — Freelancer billing autopilot",
    revenue: "$6.1K MRR proven",
    tam: "$3.4B",
    competitors: 5,
    confidence: 95,
  },
  {
    title: "SubTrack — Subscription spend optimizer",
    revenue: "$2.3K MRR proven",
    tam: "$1.2B",
    competitors: 4,
    confidence: 83,
  },
  { title: "PetVet — Telehealth for pets", revenue: "$3.1K MRR proven", tam: "$1.8B", competitors: 2, confidence: 89 },
  {
    title: "RoyaltyAI — Creator earnings tracker",
    revenue: "$1.5K MRR proven",
    tam: "$670M",
    competitors: 3,
    confidence: 81,
  },
  {
    title: "HOAHub — Community management SaaS",
    revenue: "$2.8K MRR proven",
    tam: "$950M",
    competitors: 6,
    confidence: 78,
  },
  {
    title: "LeaseGuard — AI lease review tool",
    revenue: "$900 MRR proven",
    tam: "$1.4B",
    competitors: 2,
    confidence: 85,
  },
  {
    title: "StockSense — DTC inventory forecaster",
    revenue: "$5.4K MRR proven",
    tam: "$2.7B",
    competitors: 4,
    confidence: 91,
  },
  {
    title: "TaxPilot — Freelancer tax automation",
    revenue: "$7.2K MRR proven",
    tam: "$4.1B",
    competitors: 8,
    confidence: 93,
  },
  {
    title: "SupportBot — AI support for Shopify",
    revenue: "$3.6K MRR proven",
    tam: "$2.3B",
    competitors: 5,
    confidence: 88,
  },
  {
    title: "NicheJobs — Specialized job aggregator",
    revenue: "$1.1K MRR proven",
    tam: "$560M",
    competitors: 3,
    confidence: 76,
  },
];

// ── MSX Pro plan features (shared across paywalls) ──

export const mxProFeatures = [
  "Signals & idea database access",
  "Full ownership and control",
  "Stripe revenue collection",
  "Sub-domain deployment on msx.dev",
  "REST API & webhook access",
  "Agent workspace access",
  "Agent orchestration access",
  "Join The Arena & unlock rewards",
  "Free distribution on social media",
  "MSX agent program access ($3k/mo)",
  "$15 seed company budget",
];

// ── Deploy steps (CompanyCreate detailed) ──

export interface DeployStep {
  label: string;
  detail: string;
  duration: number;
}

export const companyDeploySteps: DeployStep[] = [
  { label: "Scanning signals database", detail: "Analyzing 847 market signals from last 30 days...", duration: 2200 },
  { label: "Cross-referencing ideas", detail: "Matching 750 validated ideas with current trends...", duration: 1800 },
  {
    label: "Generating business model",
    detail: "Building revenue model, pricing, and unit economics...",
    duration: 2400,
  },
  {
    label: "Designing tech architecture",
    detail: "Selecting stack: React, Supabase, Stripe, Resend...",
    duration: 1600,
  },
  { label: "Creating landing page", detail: "Deploying hero, features, pricing sections...", duration: 2000 },
  { label: "Setting up backend", detail: "Provisioning database, auth, and API routes...", duration: 1800 },
  { label: "Configuring payments", detail: "Integrating Stripe checkout and billing portal...", duration: 1400 },
  { label: "Running pre-launch checks", detail: "Testing flows, performance, and security...", duration: 1200 },
  { label: "Deploying to production", detail: "Publishing to global CDN with SSL...", duration: 1600 },
];

// ── Agents with status (CompanyCreate) ──

export interface CreateAgent extends AgentDef {
  status: "available" | "busy";
  busyOn?: string;
}

export const createAgents: CreateAgent[] = deployableAgents.map((a, i) => ({
  ...a,
  desc: [
    "Builds MVPs end-to-end from signals. Deploys landing pages, backends, and payment flows autonomously.",
    "Analyzes market signals, sets up acquisition channels, and runs initial traction experiments.",
    "Synthesizes ideas and signals into a coherent product strategy with roadmap and positioning.",
    "Connects APIs, scrapes data sources, and builds automated pipelines from signal databases.",
  ][i],
  status: i === 2 ? ("busy" as const) : ("available" as const),
  ...(i === 2 ? { busyOn: "NovaTech" } : {}),
}));

// ── Stage colors (shared across Agents, AgentDetail, Dashboard) ──

export const stageColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

// ── Utilities ──

export function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const ease = [0.16, 1, 0.3, 1] as const;
