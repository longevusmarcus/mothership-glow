// ── Agent Detail page mock data ──

export interface MockAgentDetail {
  name: string;
  type: string;
  endpoint: string;
  version: string;
  role: string;
  score: number;
  stage: string;
  source: string;
  deployments: { company: string; role: string; period: string; description: string }[];
  training: { source: string; dataset: string; date: string }[];
  skills: string[];
  integrations: { name: string; status: string }[];
  apiSkills: string[];
  commands: { date: string; command: string; status: string }[];
  history: { date: string; action: string; by: string; ai?: boolean }[];
  aiAnalysis: { summary: string; strengths: string[]; gaps: string[]; recommendation: string };
  matchScores: { company: string; overall: number; skills: number; performance: number; reliability: number }[];
  notes: { date: string; text: string; by: string }[];
}

export const agentDetailData: Record<string, MockAgentDetail> = {
  "1": {
    name: "Nova",
    type: "tech",
    endpoint: "agent://novatech.msx",
    version: "v2.4.1",
    role: "CEO Agent — Full-Stack",
    score: 96,
    stage: "Shortlist",
    source: "tech",
    deployments: [
      { company: "NovaTech", role: "Lead Frontend Agent", period: "Jan 2026 — Present", description: "Building React/TypeScript frontend, component library, and design system." },
      { company: "DataPulse", role: "API Developer", period: "Nov 2025 — Jan 2026", description: "Built REST & GraphQL APIs with Node.js and PostgreSQL." },
      { company: "TestCo (Training)", role: "Junior Agent", period: "Sep 2025 — Nov 2025", description: "Initial training on full-stack development tasks." },
    ],
    training: [
      { source: "GPT-4 Base", dataset: "Full-Stack Development Corpus", date: "2025-09" },
      { source: "Fine-tune", dataset: "React/TypeScript Patterns (50K samples)", date: "2025-11" },
    ],
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL", "Tailwind CSS", "Jest", "Docker"],
    integrations: [
      { name: "GitHub", status: "Connected" },
      { name: "Vercel", status: "Connected" },
      { name: "Supabase", status: "Connected" },
    ],
    apiSkills: ["Stripe Payments", "Resend Email", "OpenAI Vision"],
    commands: [
      { date: "20 Mar 2026", command: "Build checkout flow with Stripe", status: "Completed" },
      { date: "18 Mar 2026", command: "Create responsive dashboard layout", status: "Completed" },
      { date: "15 Mar 2026", command: "Set up CI/CD pipeline", status: "Completed" },
    ],
    history: [
      { date: "20 Mar 2026", action: "Task completed: Checkout flow", by: "CEO Agent" },
      { date: "18 Mar 2026", action: "Deployed to NovaTech — Performance 96%", by: "MothershipX AI", ai: true },
      { date: "15 Mar 2026", action: "API Skill installed: Stripe", by: "Operator" },
      { date: "12 Mar 2026", action: "Agent created and trained", by: "System" },
    ],
    aiAnalysis: {
      summary: "High-performance full-stack agent with exceptional React/TypeScript capabilities. Consistently delivers clean, testable code with 96% task completion rate.",
      strengths: ["React/TypeScript — 96% accuracy", "Sub-5min average task completion", "Excellent code quality (0.2% error rate)", "Strong API integration skills"],
      gaps: ["Limited mobile-native experience", "No Rust/Go backend capability yet"],
      recommendation: "Top-tier agent for frontend-heavy companies. Recommend for lead role on any new SaaS project. Consider pairing with OpsEngine for full-stack coverage.",
    },
    matchScores: [
      { company: "NovaTech", overall: 96, skills: 98, performance: 95, reliability: 94 },
      { company: "FinFlow", overall: 82, skills: 78, performance: 88, reliability: 80 },
      { company: "HealthAI", overall: 71, skills: 65, performance: 80, reliability: 70 },
    ],
    notes: [
      { date: "20 Mar 2026", text: "Consistently high output. Handles complex React patterns well.", by: "Operator" },
      { date: "15 Mar 2026", text: "Stripe integration completed in under 3 minutes.", by: "System" },
    ],
  },
};

export const defaultAgentDetail = agentDetailData["1"];
