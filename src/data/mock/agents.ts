import type { LucideIcon } from "lucide-react";
import { Send, Building2 } from "lucide-react";

// ── Agent list page mock data ──

export const agentCompanies = ["NovaTech", "FinFlow", "DataPulse", "HealthAI"];

export const agentChannels = [
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "web", label: "Web Dashboard", icon: Building2 },
] as const;

export interface MockAgent {
  id: number;
  name: string;
  role: string;
  score: number;
  stage: string;
  aiParsed: boolean;
  jobPosition: string;
  source: string;
  skills: string[];
  telegram: string;
  status: "active" | "pending";
  isCeo: boolean;
}

export const initialAgents: MockAgent[] = [
  // CEO Agents (Full-Stack, bound to company)
  { id: 1, name: "Nova", role: "CEO Agent — Full-Stack", score: 96, stage: "Shortlist", aiParsed: true, jobPosition: "NovaTech", source: "tech", skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Stripe", "AI Ops"], telegram: "Nova_MSX_bot", status: "active", isCeo: true },
  { id: 3, name: "Medi", role: "CEO Agent — Full-Stack", score: 87, stage: "Shortlist", aiParsed: false, jobPosition: "HealthAI", source: "tech", skills: ["React", "Python", "Supabase", "HIPAA", "AI Ops"], telegram: "Medi_MSX_bot", status: "pending", isCeo: true },
  { id: 4, name: "Pulse", role: "CEO Agent — Full-Stack", score: 94, stage: "Placement", aiParsed: true, jobPosition: "DataPulse", source: "tech", skills: ["Python", "SQL", "Node.js", "Spark", "Airflow", "AI Ops"], telegram: "Pulse_MSX_bot", status: "active", isCeo: true },
  { id: 5, name: "Finn", role: "CEO Agent — Full-Stack", score: 89, stage: "Screening", aiParsed: false, jobPosition: "FinFlow", source: "tech", skills: ["React", "Node.js", "Stripe", "Docker", "Terraform", "AI Ops"], telegram: "Finn_MSX_bot", status: "pending", isCeo: true },
  // Specialized Agents (reassignable)
  { id: 2, name: "GrowthPilot", role: "SEO & Content", score: 91, stage: "Colloquio", aiParsed: true, jobPosition: "NovaTech", source: "growth", skills: ["SEO", "Content Strategy", "Analytics", "A/B Testing"], telegram: "GrowthPilot_MSX_bot", status: "active", isCeo: false },
  { id: 6, name: "MarketBot", role: "Paid Ads & Social", score: 88, stage: "Colloquio", aiParsed: true, jobPosition: "NovaTech", source: "growth", skills: ["Google Ads", "Meta Ads", "Analytics", "Copywriting"], telegram: "MarketBot_MSX_bot", status: "active", isCeo: false },
  { id: 7, name: "SecureGuard", role: "Security Audit", score: 92, stage: "Shortlist", aiParsed: true, jobPosition: "FinFlow", source: "ops", skills: ["Penetration Testing", "OWASP", "Compliance", "Monitoring"], telegram: "SecureGuard_MSX_bot", status: "active", isCeo: false },
  { id: 8, name: "ContentCraft", role: "Copywriting", score: 83, stage: "Screening", aiParsed: false, jobPosition: "HealthAI", source: "creative", skills: ["Blog Writing", "Email Copy", "Brand Voice", "Social Media"], telegram: "ContentCraft_MSX_bot", status: "active", isCeo: false },
  { id: 9, name: "APIForge", role: "Backend & APIs", score: 95, stage: "Placement", aiParsed: true, jobPosition: "DataPulse", source: "tech", skills: ["REST", "GraphQL", "Microservices", "Redis"], telegram: "APIForge_MSX_bot", status: "active", isCeo: false },
  { id: 10, name: "FinOps", role: "Billing & Payments", score: 90, stage: "Colloquio", aiParsed: true, jobPosition: "FinFlow", source: "ops", skills: ["Stripe", "Billing Logic", "Reconciliation", "Compliance"], telegram: "FinOps_MSX_bot", status: "active", isCeo: false },
  { id: 11, name: "DesignMind", role: "UI/UX Design", score: 86, stage: "Shortlist", aiParsed: true, jobPosition: "NovaTech", source: "creative", skills: ["Figma", "Design Systems", "Prototyping", "User Research"], telegram: "DesignMind_MSX_bot", status: "active", isCeo: false },
  { id: 12, name: "DataStream", role: "Data Pipeline", score: 93, stage: "Colloquio", aiParsed: true, jobPosition: "DataPulse", source: "tech", skills: ["Python", "SQL", "Spark", "Airflow", "ETL"], telegram: "DataStream_MSX_bot", status: "active", isCeo: false },
  { id: 13, name: "OpsEngine", role: "DevOps & CI/CD", score: 91, stage: "Shortlist", aiParsed: true, jobPosition: "FinFlow", source: "ops", skills: ["Docker", "Kubernetes", "Terraform", "AWS", "GitHub Actions"], telegram: "OpsEngine_MSX_bot", status: "active", isCeo: false },
];
