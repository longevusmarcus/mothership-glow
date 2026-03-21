import { translationsNav } from "./translations/nav";
import { translationsDashboard } from "./translations/dashboard";
import { translationsAgents } from "./translations/agents";
import { translationsCompanies } from "./translations/companies";
import { translationsChat } from "./translations/chat";
import { translationsAnalytics } from "./translations/analytics";
import { translationsSettings } from "./translations/settings";
import { translationsCommon } from "./translations/common";

export type Locale = "it" | "en";

export const translations = {
  ...translationsNav,
  ...translationsDashboard,
  ...translationsAgents,
  ...translationsCompanies,
  ...translationsChat,
  ...translationsAnalytics,
  ...translationsSettings,
  ...translationsCommon,
} as const;

export type TranslationKey = keyof typeof translations;
