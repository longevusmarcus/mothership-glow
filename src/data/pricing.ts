// ── Pricing Constants ──

export const CEO_PRICE = 58;
export const EXTRA_AGENT_PRICE = 30;

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
