/**
 * Barrel export for the data layer.
 * 
 * Import from here: import { deployableAgents, CEO_PRICE } from "@/data";
 * Or import from specific modules for tree-shaking clarity.
 */

// Types
export type {
  AgentDef, CreateAgent, CompanyRef, Signal, Idea, DeployStep,
  Template, TemplateDeployInput, SpendProfile, SupportedChannel,
  ApiAgent, LifecycleStage, AgentReadiness, OfficeStatus, ActivationStatus,
  SiteState, SiteStatus, TelegramState, FailureState,
  Account, Slots, Budget, BillingOptions, SlotCheckoutOption, BudgetTopupOption,
  DeployAgentRequest,
} from "./types";

// Domain data
export { deployableAgents, createAgents, CEO_AGENT_ID } from "./agents";
export { existingCompanies } from "./companies";
export { allSignals, allIdeas } from "./signals";
export { chatDeploySteps, companyDeploySteps, addAgentSteps } from "./deploy";
export {
  CEO_PRICE, EXTRA_AGENT_PRICE, calcAgentPrice, mxProFeatures,
  SLOT_UNIT_AMOUNT_CENTS, STARTER_BUDGET_CENTS_PER_SLOT, SLOT_PRICE,
  slotTiers, defaultBillingOptions, defaultSlotCheckout, defaultBudgetTopup,
} from "./pricing";
export { typeMeta, stageColors, ease, shuffleAndPick } from "./ui";
