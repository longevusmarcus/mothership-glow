import { Code, TrendingUp, Brain, Database } from "lucide-react";
import type { AgentDef, CreateAgent } from "./types";

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

export const CEO_AGENT_ID = "ceoagent";

// ── Agents with status (CompanyCreate) ──

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
