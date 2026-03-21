/**
 * Barrel export for the data layer.
 * 
 * Import from here: import { deployableAgents, CEO_PRICE } from "@/data";
 * Or import from specific modules for tree-shaking clarity.
 */

// Types
export type { AgentDef, CreateAgent, CompanyRef, Signal, Idea, DeployStep } from "./types";

// Domain data
export { deployableAgents, createAgents, CEO_AGENT_ID } from "./agents";
export { existingCompanies } from "./companies";
export { allSignals, allIdeas } from "./signals";
export { chatDeploySteps, companyDeploySteps, addAgentSteps } from "./deploy";
export { CEO_PRICE, EXTRA_AGENT_PRICE, calcAgentPrice, mxProFeatures } from "./pricing";
export { typeMeta, stageColors, ease, shuffleAndPick } from "./ui";
