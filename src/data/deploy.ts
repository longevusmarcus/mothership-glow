import type { DeployStep } from "./types";

// ── Chat deploy steps ──

export const chatDeploySteps = [
  "Analyzing selected signals & ideas...",
  "Generating business model & pricing...",
  "Designing tech architecture...",
  "Building landing page...",
  "Setting up backend & payments...",
  "Running pre-launch checks...",
  "Deploying to production...",
];

// ── Company create deploy steps (detailed) ──

export const companyDeploySteps: DeployStep[] = [
  { label: "Scanning signals database", detail: "Analyzing 847 market signals from last 30 days...", duration: 2200 },
  { label: "Cross-referencing ideas", detail: "Matching 750 validated ideas with current trends...", duration: 1800 },
  { label: "Generating business model", detail: "Building revenue model, pricing, and unit economics...", duration: 2400 },
  { label: "Designing tech architecture", detail: "Selecting stack: React, Supabase, Stripe, Resend...", duration: 1600 },
  { label: "Creating landing page", detail: "Deploying hero, features, pricing sections...", duration: 2000 },
  { label: "Setting up backend", detail: "Provisioning database, auth, and API routes...", duration: 1800 },
  { label: "Configuring payments", detail: "Integrating Stripe checkout and billing portal...", duration: 1400 },
  { label: "Running pre-launch checks", detail: "Testing flows, performance, and security...", duration: 1200 },
  { label: "Deploying to production", detail: "Publishing to global CDN with SSL...", duration: 1600 },
];

// ── Add-agent deploy steps ──

export const addAgentSteps = [
  "Connecting to company workspace...",
  "Configuring agent permissions...",
  "Installing required skills...",
  "Setting up orchestration layer...",
  "Running pre-launch checks...",
];
