import type { LucideIcon } from "lucide-react";

// ── Agent Types ──

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

export interface CreateAgent extends AgentDef {
  status: "available" | "busy";
  busyOn?: string;
}

// ── Company Types ──

export interface CompanyRef {
  id: string;
  name: string;
  type: string;
  agents: number;
}

// ── Signal & Idea Types ──

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

// ── Deploy Types ──

export interface DeployStep {
  label: string;
  detail: string;
  duration: number;
}
