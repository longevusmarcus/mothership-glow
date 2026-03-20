import { DollarSign, Bot, CreditCard, Users, Zap, Shield, Mail, Bell, PlugZap, Clock, ArrowUpRight, Copy, Plus, FolderOpen } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

/* ======================== Data ======================== */

const teamMembers = [
  { name: "Maria Conti", email: "maria@mothershipx.com", role: "Admin", status: "Active" },
  { name: "Luca Bianchi", email: "luca@mothershipx.com", role: "Operator", status: "Active" },
  { name: "Anna Romano", email: "anna@mothershipx.com", role: "Operator", status: "Active" },
  { name: "Paolo Esposito", email: "paolo@mothershipx.com", role: "Viewer", status: "Invited" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-primary text-primary-foreground",
  Operator: "bg-accent text-accent-foreground",
  Viewer: "bg-muted text-muted-foreground",
};

const tabs = [
  { id: "budget", label: "Budget", labelIt: "Budget", icon: DollarSign },
  { id: "agents", label: "Agent Setup", labelIt: "Setup Agenti", icon: Bot },
  { id: "integrations", label: "Integrations", labelIt: "Integrazioni", icon: PlugZap },
  { id: "subscription", label: "Subscription", labelIt: "Abbonamento", icon: CreditCard },
  { id: "ai", label: "AI Config", labelIt: "AI Config", icon: () => <AiIcon className="text-muted-foreground" size={16} /> },
  { id: "personal-os", label: "Personal OS", labelIt: "OS Personale", icon: FolderOpen },
];

/* ======================== Budget Tab ======================== */

function BudgetTab({ locale }: { locale: string }) {
  const sharedBalance = 14.98;
  const agentCap = 20.00;
  const spent = 5.02;
  const remaining = agentCap - 0;
  const deposited = 15.00;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[13px] font-mondwest font-semibold">
          {locale === "it" ? "Budget Aziendale" : "Company Budget"}
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
          {locale === "it" ? "Alimenta VM hosting, token AI e servizi" : "Powers VM hosting, AI tokens, and services"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5 card-static">
          <p className="text-[11px] text-muted-foreground font-medium mb-1">
            {locale === "it" ? "Saldo Condiviso" : "Shared Balance"}
          </p>
          <p className="text-[28px] font-mondwest font-semibold tracking-tight leading-none tabular-nums">${sharedBalance.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 card-static">
          <p className="text-[11px] text-muted-foreground font-medium mb-1">
            {locale === "it" ? "Cap per Agente" : "Per Agent Cap"}
          </p>
          <p className="text-[28px] font-mondwest font-semibold tracking-tight leading-none tabular-nums">${agentCap.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 card-static space-y-4">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.4} />
          <span>
            {locale === "it" ? "Questo mese:" : "This month:"}{" "}
            <span className="text-foreground font-semibold tabular-nums">${spent.toFixed(2)} {locale === "it" ? "spesi" : "spent"}</span>,{" "}
            <span className="text-foreground font-semibold tabular-nums">${remaining.toFixed(2)} {locale === "it" ? "rimanenti" : "remaining"}</span>
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary/50 rounded-full transition-all" style={{ width: `${(spent / agentCap) * 100}%` }} />
        </div>
      </div>

      <div>
        <p className="text-[12px] font-medium mb-3">{locale === "it" ? "Aggiungi fondi" : "Add funds"}</p>
        <div className="grid grid-cols-3 gap-3">
          {[25, 50, 100].map(amount => (
            <button key={amount} className="py-3 bg-card border border-border rounded-xl text-[14px] font-mondwest font-semibold hover:bg-muted/30 hover:border-foreground/10 transition-all active:scale-[0.97]">
              ${amount}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
          <span>{locale === "it" ? "Depositato" : "Deposited"}: <span className="font-semibold tabular-nums">${deposited.toFixed(2)}</span></span>
          <span>{locale === "it" ? "Speso" : "Spent"}: <span className="font-semibold tabular-nums">${spent.toFixed(2)}</span></span>
        </div>
      </div>

      <button className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors mx-auto">
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} />
        {locale === "it" ? "Vedi Storico Utilizzo" : "View Usage History"}
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5 card-static">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
            </div>
            <div>
              <p className="text-[13px] font-semibold">{locale === "it" ? "Carta Virtuale" : "Virtual Card"}</p>
              <p className="text-[10px] text-muted-foreground">{locale === "it" ? "Dai al tuo agente una Visa virtuale per spese autonome" : "Give your agent a virtual Visa card for autonomous spending"}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-[11px] font-medium text-muted-foreground w-full justify-center">
            <Plus className="h-3 w-3" strokeWidth={1.6} />
            {locale === "it" ? "Abilita Carta Virtuale" : "Enable Virtual Card"}
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground/60 uppercase tracking-wider font-semibold ml-1">Soon</span>
          </button>
        </div>
        <div className="bg-card rounded-2xl p-5 card-static">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
            </div>
            <div>
              <p className="text-[13px] font-semibold">Email</p>
              <p className="text-[10px] text-muted-foreground">{locale === "it" ? "Ricevi e invia email come il tuo agente" : "Receive and send emails as your agent"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 text-[12px] font-medium tabular-nums">
            <span className="text-muted-foreground">nova@msx.dev</span>
            <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="h-3 w-3" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================== Agent Setup Tab ======================== */

function AgentSetupTab({ locale }: { locale: string }) {
  const agentTypes = [
    { type: "Tech", emoji: "⚡", count: 3, cap: "$20/mo", skills: ["React", "Node.js", "Python", "CI/CD"] },
    { type: "Growth", emoji: "📈", count: 2, cap: "$15/mo", skills: ["SEO", "Ads", "Content", "Analytics"] },
    { type: "Ops", emoji: "⚙️", count: 2, cap: "$12/mo", skills: ["Stripe", "Zapier", "DB", "Monitoring"] },
    { type: "Creative", emoji: "🎨", count: 1, cap: "$10/mo", skills: ["Figma", "Copy", "Brand", "Video"] },
  ];

  const recentSkills = [
    { name: "Agent Service API", agent: "CEOAgent-7x", installed: "1d ago" },
    { name: "Signal Scanner", agent: "GrowthPulse-3k", installed: "2d ago" },
    { name: "Email Inbox", agent: "CEOAgent-7x", installed: "3d ago" },
    { name: "SMS Inbox", agent: "FinOps-v9", installed: "3d ago" },
    { name: "Site Publisher", agent: "CEOAgent-7x", installed: "5d ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-mondwest font-semibold">
            {locale === "it" ? "Setup Agenti" : "Agent Setup"}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {locale === "it" ? "Tipi di agente, cap di budget e skills installati" : "Agent types, budget caps, and installed skills"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {agentTypes.map(agent => (
          <div key={agent.type} className="bg-card rounded-2xl p-5 card-static">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[20px]">{agent.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold">{agent.type}</p>
                  <span className="text-[10px] text-muted-foreground font-medium tabular-nums">{agent.count} {locale === "it" ? "attivi" : "active"}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{locale === "it" ? "Cap" : "Cap"}: {agent.cap}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map(s => (
                <span key={s} className="text-[9px] px-2 py-0.5 bg-muted text-muted-foreground rounded-lg font-medium">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl card-static overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h3 className="text-[13px] font-mondwest font-semibold">{locale === "it" ? "Skills Installati di Recente" : "Recently Installed Skills"}</h3>
        </div>
        <div className="divide-y divide-border">
          {recentSkills.map(skill => (
            <div key={skill.name} className="px-5 py-3.5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.4} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium">{skill.name}</p>
                <p className="text-[10px] text-muted-foreground">{locale === "it" ? "su" : "on"} {skill.agent}</p>
              </div>
              <span className="text-[10px] text-muted-foreground/50 font-medium">{skill.installed}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================== Integrations Tab ======================== */

function IntegrationsTab({ locale }: { locale: string }) {
  const integrations = [
    { name: "GitHub", desc: "Source code repositories", descIt: "Repository codice sorgente", status: "connected", icon: "🐙" },
    { name: "Vercel", desc: "Hosting & deployments", descIt: "Hosting e deploy", status: "connected", icon: "▲" },
    { name: "Stripe", desc: "Payments & subscriptions", descIt: "Pagamenti e abbonamenti", status: "connected", icon: "💳" },
    { name: "Codex", desc: "AI code generation & reasoning", descIt: "Generazione codice AI e ragionamento", status: "connected", icon: "🧠" },
    { name: "Claude", desc: "AI assistant & analysis", descIt: "Assistente AI e analisi", status: "disconnected", icon: "🤖" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[13px] font-mondwest font-semibold">
          {locale === "it" ? "Integrazioni" : "Integrations"}
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {locale === "it" ? "Connetti servizi esterni e agenti di terze parti" : "Connect external services and third-party agents"}
        </p>
      </div>
      <div className="space-y-3">
        {integrations.map(int => (
          <div key={int.name} className="bg-card rounded-2xl p-5 card-static flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-[18px] shrink-0">
              {int.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold">{int.name}</p>
              <p className="text-[10px] text-muted-foreground">{locale === "it" ? int.descIt : int.desc}</p>
            </div>
            {int.status === "connected" ? (
              <span className="text-[10px] font-semibold text-success px-2.5 py-1 rounded-lg bg-success/10">
                {locale === "it" ? "Connesso" : "Connected"}
              </span>
            ) : (
              <button className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all">
                {locale === "it" ? "Connetti" : "Connect"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================== Subscription Tab ======================== */

function SubscriptionTab({ locale }: { locale: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[13px] font-mondwest font-semibold">
          {locale === "it" ? "Abbonamento" : "Subscription"}
        </h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {locale === "it" ? "Il tuo piano e utilizzo" : "Your plan and usage"}
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 card-static">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{locale === "it" ? "Piano Attuale" : "Current Plan"}</p>
            <p className="text-[22px] font-mondwest font-semibold mt-1">Operator Pro</p>
          </div>
          <span className="text-[10px] font-semibold text-primary px-2.5 py-1 rounded-lg bg-primary/10">{locale === "it" ? "Attivo" : "Active"}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-[32px] font-mondwest font-bold tracking-tight tabular-nums">$47</span>
          <span className="text-[12px] text-muted-foreground font-medium">/{locale === "it" ? "mese" : "mo"}</span>
        </div>
        <div className="space-y-2">
          {[
            { label: locale === "it" ? "Agenti attivi" : "Active agents", value: "8 / 15", pct: 53 },
            { label: locale === "it" ? "Aziende" : "Companies", value: "4 / 10", pct: 40 },
            { label: locale === "it" ? "Token AI" : "AI tokens", value: "124K / 500K", pct: 25 },
            { label: locale === "it" ? "Deploys" : "Deploys", value: "47 / ∞", pct: 0 },
          ].map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted-foreground font-medium">{item.label}</span>
                <span className="text-[11px] font-medium tabular-nums">{item.value}</span>
              </div>
              {item.pct > 0 && (
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary/40 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-[12px] font-semibold hover:bg-primary/90 transition-all active:scale-[0.97]">
          {locale === "it" ? "Upgrade Piano" : "Upgrade Plan"}
        </button>
        <button className="flex-1 py-3 bg-card border border-border rounded-xl text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all active:scale-[0.97]">
          {locale === "it" ? "Gestisci Fatturazione" : "Manage Billing"}
        </button>
      </div>

      <div className="bg-card rounded-2xl card-static overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <h3 className="text-[13px] font-mondwest font-semibold">{locale === "it" ? "Fatture Recenti" : "Recent Invoices"}</h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { date: "Mar 1, 2026", amount: "$47.00", status: "Paid" },
            { date: "Feb 1, 2026", amount: "$47.00", status: "Paid" },
            { date: "Jan 1, 2026", amount: "$47.00", status: "Paid" },
          ].map(inv => (
            <div key={inv.date} className="px-5 py-3 flex items-center justify-between">
              <span className="text-[12px] font-medium">{inv.date}</span>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-mondwest font-semibold tabular-nums">{inv.amount}</span>
                <span className="text-[9px] font-semibold text-success px-2 py-0.5 rounded-lg bg-success/10">{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================== Main Settings ======================== */

const Settings = () => {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState("budget");

  const localTabs = tabs.map(tab => ({
    ...tab,
    label: locale === "it" ? tab.labelIt : tab.label,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight">
          <TextShimmer as="span" duration={2.5}>{t("settings.title")}</TextShimmer>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </div>

      {/* Mobile horizontal tabs */}
      <div className="lg:hidden overflow-x-auto -mx-4 px-4">
        <div className="flex gap-1 min-w-max">
          {localTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar tabs */}
        <div className="hidden lg:block w-48 shrink-0 space-y-0.5">
          {localTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] w-full font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" strokeWidth={1.6} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === "budget" && <BudgetTab locale={locale} />}
          {activeTab === "agents" && <AgentSetupTab locale={locale} />}
          {activeTab === "integrations" && <IntegrationsTab locale={locale} />}
          {activeTab === "subscription" && <SubscriptionTab locale={locale} />}


          {activeTab === "ai" && (
            <div className="space-y-5">
              <h2 className="text-[13px] font-mondwest font-semibold">{t("settings.ai.title")}</h2>
              <div className="rounded-2xl p-6 space-y-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
                <div className="flex items-center gap-3">
                  <AiIcon className="text-muted-foreground" size={20} />
                  <div>
                    <p className="text-[13px] font-medium">MSX AI</p>
                    <p className="text-[11px] text-muted-foreground">{t("settings.ai.subtitle")}</p>
                  </div>
                  <div className="ml-auto h-[22px] w-[40px] rounded-full bg-primary relative cursor-pointer">
                    <span className="absolute right-[3px] top-[3px] h-4 w-4 rounded-full bg-white transition-transform shadow-sm" />
                  </div>
                </div>
                {[
                  { label: t("settings.ai.autoParsing"), desc: t("settings.ai.autoParsingDesc"), enabled: true },
                  { label: t("settings.ai.autoMatching"), desc: t("settings.ai.autoMatchingDesc"), enabled: true },
                  { label: t("settings.ai.emailSuggestions"), desc: t("settings.ai.emailSuggestionsDesc"), enabled: true },
                  { label: t("settings.ai.weeklyReport"), desc: t("settings.ai.weeklyReportDesc"), enabled: false },
                ].map((setting, i) => (
                  <div key={i} className={`flex items-center justify-between ${i > 0 ? "border-t border-border pt-5" : ""}`}>
                    <div>
                      <p className="text-[13px] font-medium">{setting.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{setting.desc}</p>
                    </div>
                    <button className={`h-[22px] w-[40px] rounded-full relative transition-colors shrink-0 ${setting.enabled ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-all shadow-sm ${setting.enabled ? "right-[3px]" : "left-[3px]"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
