import { translationsNav } from "./translations/nav";
import { translationsDashboard } from "./translations/dashboard";
import { translationsCandidates } from "./translations/candidates";
import { translationsJobs } from "./translations/jobs";
import { translationsChat } from "./translations/chat";
import { translationsAnalytics } from "./translations/analytics";
import { translationsSettings } from "./translations/settings";
import { translationsCommon } from "./translations/common";

export type Locale = "it" | "en";

export const translations = {
  ...translationsNav,
  ...translationsDashboard,
  ...translationsCandidates,
  ...translationsJobs,
  ...translationsChat,
  ...translationsAnalytics,
  ...translationsSettings,
  ...translationsCommon,
} as const;

export type TranslationKey = keyof typeof translations;
