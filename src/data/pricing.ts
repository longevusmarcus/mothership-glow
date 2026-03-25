import type { SlotCheckoutOption, BudgetTopupOption, BillingOptions } from "./types";

// ── Slot-based pricing (aligned with GET /v1/billing/options) ──

/** Price per agent slot in cents — $29/mo per slot */
export const SLOT_UNIT_AMOUNT_CENTS = 2900;

/** Starter budget granted per slot in cents — $15 seed */
export const STARTER_BUDGET_CENTS_PER_SLOT = 1500;

/** Display price per slot in dollars */
export const SLOT_PRICE = SLOT_UNIT_AMOUNT_CENTS / 100; // $29

/** Legacy display constants (maps to slot pricing) */
export const CEO_PRICE = 58;           // 2 slots minimum (CEO = 2 slots)
export const EXTRA_AGENT_PRICE = 30;   // ~1 slot rounded for display

// ── Billing options (mirrors GET /v1/billing/options response) ──

export const defaultSlotCheckout: SlotCheckoutOption = {
  currency: "usd",
  unit_amount_cents: SLOT_UNIT_AMOUNT_CENTS,
  starter_budget_cents_per_slot: STARTER_BUDGET_CENTS_PER_SLOT,
  billing_interval: "month",
  minimum_quantity: 1,
  default_quantity: 2,
};

export const defaultBudgetTopup: BudgetTopupOption = {
  currency: "usd",
  minimum_amount_cents: 500,
  preset_amounts_cents: [500, 1500, 5000, 15000],
};

export const defaultBillingOptions: BillingOptions = {
  slot_checkout: defaultSlotCheckout,
  budget_topup: defaultBudgetTopup,
};

// ── Slot tier display (UX layer over slot billing) ──

export interface SlotTier {
  label: string;
  value: string;
  slots: number;
  desc: string;
  price: number;
}

export const slotTiers: SlotTier[] = [
  { label: "$58/mo",  value: "58",  slots: 2, desc: "Orbital — 1 agent",  price: 58  },
  { label: "$88/mo",  value: "88",  slots: 3, desc: "Orbital +1 — 2 agents", price: 88  },
  { label: "$118/mo", value: "118", slots: 4, desc: "Orbital +2 — 3 agents", price: 118 },
  { label: "$148/mo", value: "148", slots: 5, desc: "Interstellar — 4 agents", price: 148 },
];

export function calcAgentPrice(selectedIds: string[], ceoAgentId = "ceoagent"): number {
  const hasCeo = selectedIds.some(id => id.startsWith(ceoAgentId));
  const extras = hasCeo ? selectedIds.length - 1 : selectedIds.length;
  return (hasCeo ? CEO_PRICE : 0) + extras * EXTRA_AGENT_PRICE;
}

// ── MSX Pro plan features ──

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
