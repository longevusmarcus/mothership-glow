import type { LucideIcon } from "lucide-react";

// ── Template Types (from GET /v1/templates) ──

export type SpendProfile = "low" | "medium" | "high";
export type SupportedChannel = "api" | "telegram" | "discord" | "whatsapp";

export interface TemplateDeployInput {
  field: string;
  type: string;
  description: string;
  required: boolean;
  secret?: boolean;
}

export interface Template {
  id: string;
  name: string;
  purpose: string;
  description: string;
  spend_profile: SpendProfile;
  autonomy_style: string;
  supported_channels: SupportedChannel[];
  public_output: string;
  deploy_inputs: TemplateDeployInput[];
}

// ── Agent Types (from GET /v1/agents) ──

export type LifecycleStage = "activating" | "waiting_external_confirmation" | "ready" | "activation_failed";
export type AgentReadiness = "not_ready" | "ready";
export type CapacityState = "claimed";
export type OfficeStatus = "pending" | "provisioning" | "reachable" | "failed";
export type ActivationStatus = "pending" | "provisioning" | "waiting_external_confirmation" | "completed" | "failed";

export type SiteStatus = "reserved" | "live" | "failed";
export interface SiteState {
  subdomain: string;
  status: SiteStatus;
  url: string;
}

export type TelegramBindingStatus = "not_attached" | "claimed";
export type TelegramConnectionStatus = "not_configured" | "pending" | "configured" | "verified" | "failed";
export interface TelegramState {
  bot_username: string;
  binding_status: TelegramBindingStatus;
  connection_status: TelegramConnectionStatus;
}

export interface FailureState {
  code: string;
  message: string;
}

export interface ApiAgent {
  id: string;
  template_id: string;
  lifecycle_stage: LifecycleStage;
  readiness: AgentReadiness;
  capacity_state: CapacityState;
  office_status: OfficeStatus;
  activation_status: ActivationStatus;
  site: SiteState;
  telegram: TelegramState;
  failure?: FailureState;
  created_at: string;
  updated_at: string;
}

// ── Account & Billing Types ──

export interface Slots {
  total: number;
  consumed: number;
  free: number;
}

export interface Budget {
  balance_cents: number;
}

export interface Account {
  user_id: string;
  slots: Slots;
  budget: Budget;
}

export interface SlotCheckoutOption {
  currency: string;
  unit_amount_cents: number;
  starter_budget_cents_per_slot: number;
  billing_interval: string;
  minimum_quantity: number;
  default_quantity: number;
}

export interface BudgetTopupOption {
  currency: string;
  minimum_amount_cents: number;
  preset_amounts_cents: number[];
}

export interface BillingOptions {
  slot_checkout: SlotCheckoutOption;
  budget_topup: BudgetTopupOption;
}

export interface DeployAgentRequest {
  template_id: string;
  subdomain: string;
}

// ── UI-level Agent Def (enriched for display) ──

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  color: string;
  desc: string;
  /** Maps to a Template.id from GET /v1/templates */
  template_id: string;
  spend_profile: SpendProfile;
  supported_channels: SupportedChannel[];
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
  category: string;
  views: string;
  trending: boolean;
  tags: string[];
  sentiment: number;
}

export interface Idea {
  title: string;
  revenue: string;
  tam: string;
  competitors: number;
  confidence: number;
  category: string;
  timeToMvp: string;
  marketGrowth: string;
  tags: string[];
}

// ── Deploy Types ──

export interface DeployStep {
  label: string;
  detail: string;
  duration: number;
}
