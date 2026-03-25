import type { DeployStep } from "./types";

// ── Chat deploy steps (aligned with POST /v1/agents lifecycle) ──

export const chatDeploySteps = [
  "Creating account session...",
  "Selecting agent template...",
  "Reserving subdomain on msx.dev...",
  "Deploying agent (POST /v1/agents)...",
  "Provisioning office environment...",
  "Configuring Telegram bot...",
  "Running activation checks...",
  "Agent is ready — site is live!",
];

// ── Company create deploy steps (detailed — maps to API lifecycle stages) ──

export const companyDeploySteps: DeployStep[] = [
  { label: "Creating slot checkout", detail: "Validating billing and reserving agent slots...", duration: 1800 },
  { label: "Selecting template", detail: "Loading curated template from /v1/templates...", duration: 1200 },
  { label: "Reserving subdomain", detail: "Claiming subdomain on msx.dev — status: reserved...", duration: 1600 },
  { label: "Deploying agent", detail: "POST /v1/agents — template_id + subdomain...", duration: 2200 },
  { label: "Provisioning office", detail: "Setting up agent workspace — office_status: provisioning...", duration: 2000 },
  { label: "Configuring Telegram", detail: "Binding bot and setting webhook — connection_status: pending...", duration: 1600 },
  { label: "Running activation", detail: "Activation checks — lifecycle_stage: activating...", duration: 1400 },
  { label: "Verifying readiness", detail: "Confirming readiness: ready — site status: live...", duration: 1200 },
  { label: "Agent deployed", detail: "All systems go — agent is reachable and ready!", duration: 800 },
];

// ── Add-agent deploy steps ──

export const addAgentSteps = [
  "Checking available slots...",
  "Selecting agent template...",
  "Deploying to workspace...",
  "Configuring permissions & channels...",
  "Running activation checks...",
];
