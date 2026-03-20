import { Bot, Building2, Zap, TrendingUp, ArrowUpRight, ArrowDownRight, Bell, ChevronRight, Users, DollarSign, Eye } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";
import { useEffect } from "react";

const statusColors: Record<string, string> = {
  Training: "bg-muted text-muted-foreground",
  Deployed: "bg-accent text-accent-foreground",
  Active: "bg-secondary text-secondary-foreground",
  Integrated: "bg-primary text-primary-foreground",
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const view = searchParams.get("view") || "overview";

  // First-time onboarding: redirect to New Company page
  useEffect(() => {
    const onboarded = localStorage.getItem("mx_onboarded");
    if (!onboarded) {
      localStorage.setItem("mx_onboarded", "true");
      navigate("/companies/new", { replace: true });
    }
  }, [navigate]);
  const now = new Date();
  const hour = now.getHours();
  const greetingKey: TranslationKey = hour < 12 ? "dashboard.greeting.morning" : hour < 18 ? "dashboard.greeting.afternoon" : "dashboard.greeting.evening";
  const dateStr = now.toLocaleDateString(locale === "en" ? "en-US" : "it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const stats = [
    { labelKey: "dashboard.stat.activeAgents" as TranslationKey, value: "12", change: "+3", up: true, icon: Bot, href: "/agents" },
    { labelKey: "dashboard.stat.companiesBuilt" as TranslationKey, value: "6", change: "+2", up: true, icon: Building2, href: "/companies" },
    { labelKey: "dashboard.stat.apiSkills" as TranslationKey, value: "34", change: "+8", up: true, icon: Zap, href: "/settings" },
    { labelKey: "dashboard.stat.tasksCompleted" as TranslationKey, value: "847", change: "+124", up: true, icon: TrendingUp, href: "/analytics" },
  ];

  const recentAgents = [
    { id: 1, name: "CodeForge", type: "Tech Agent", score: 96, status: "Active", aiMatch: true },
    { id: 2, name: "GrowthPilot", type: "Growth Agent", score: 91, status: "Deployed", aiMatch: true },
    { id: 3, name: "DesignMind", type: "Creative Agent", score: 87, status: "Active", aiMatch: false },
    { id: 4, name: "DataStream", type: "Tech Agent", score: 94, status: "Integrated", aiMatch: true },
    { id: 5, name: "OpsEngine", type: "Ops Agent", score: 89, status: "Training", aiMatch: false },
  ];

  const activeCompanies = [
    { id: 1, title: "NovaTech", agents: 4, days: 23, trend: "+12 tasks" },
    { id: 2, title: "FinFlow", agents: 3, days: 15, trend: "+8 tasks" },
    { id: 3, title: "HealthAI", agents: 2, days: 8, trend: "+5 tasks" },
    { id: 4, title: "DataPulse", agents: 3, days: 31, trend: "+18 tasks" },
  ];

  const aiInsights = [
    { textKey: "dashboard.insight.1" as TranslationKey, actionKey: "dashboard.insight.action.1" as TranslationKey, href: "/agents" },
    { textKey: "dashboard.insight.2" as TranslationKey, actionKey: "dashboard.insight.action.2" as TranslationKey, href: "/companies/1" },
    { textKey: "dashboard.insight.3" as TranslationKey, actionKey: "dashboard.insight.action.3" as TranslationKey, href: "/chat" },
  ];

  const notifications = [
    { textKey: "dashboard.notif.1" as TranslationKey, timeKey: "dashboard.notif.time.1" as TranslationKey, unread: true },
    { textKey: "dashboard.notif.2" as TranslationKey, timeKey: "dashboard.notif.time.2" as TranslationKey, unread: true },
    { textKey: "dashboard.notif.3" as TranslationKey, timeKey: "dashboard.notif.time.3" as TranslationKey, unread: false },
  ];

  const pipelineStages = [
    { stageKey: "stage.screening" as TranslationKey, count: 5, pct: 100 },
    { stageKey: "stage.interview" as TranslationKey, count: 8, pct: 80 },
    { stageKey: "stage.shortlist" as TranslationKey, count: 12, pct: 60 },
    { stageKey: "stage.placement" as TranslationKey, count: 3, pct: 15 },
  ];

  const statusDisplayName = (status: string) => {
    const map: Record<string, TranslationKey> = {
      Training: "stage.screening",
      Deployed: "stage.interview",
      Active: "stage.shortlist",
      Integrated: "stage.placement",
    };
    return map[status] ? t(map[status]) : status;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-muted-foreground font-medium capitalize tracking-wide font-mono">{dateStr}</p>
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight mt-1">
            <TextShimmer as="span" duration={2.5}>{`${t(greetingKey)}, Orchestrator`}</TextShimmer>
          </h1>
        </div>
        <Link to="/companies/new" className="w-full sm:w-auto">
          <InteractiveHoverButton className="w-full sm:w-auto" text={t("dashboard.newCompany")} icon={<Building2 className="h-3.5 w-3.5" strokeWidth={1.6} />} />
        </Link>
      </div>

      <CursorCardsContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.labelKey} to={stat.href}>
            <CursorCard borderColor="hsl(var(--border))">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted/70 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                  </div>
                  <span className={`text-[11px] font-mono font-semibold flex items-center gap-0.5 ${stat.up ? "text-success" : "text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-[30px] font-mondwest font-semibold tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">{t(stat.labelKey)}</p>
              </div>
            </CursorCard>
          </Link>
        ))}
      </CursorCardsContainer>

      {view !== "summary" && (
        <div className="rounded-2xl p-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
              <AiIcon className="text-muted-foreground" size={13} />
            </div>
            <h2 className="text-[13px] font-mondwest font-semibold text-foreground">{t("dashboard.aiInsights")}</h2>
            <span className="text-[8px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-[0.08em] border border-border">Live</span>
          </div>
          <CursorCardsContainer className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight, i) => (
              <CursorCard key={i} illuminationColor="hsl(var(--foreground) / 0.04)" primaryHue="hsl(var(--foreground) / 0.12)" secondaryHue="hsl(var(--foreground) / 0.04)" borderColor="hsl(var(--border))">
                <div className="p-4 flex flex-col justify-between gap-4 min-h-[100px]">
                  <p className="text-[12.5px] leading-[1.6] text-foreground/75 font-mono">{t(insight.textKey)}</p>
                  <Link to={insight.href} className="text-[10.5px] font-medium text-muted-foreground hover:text-foreground transition-colors self-start flex items-center gap-1.5 group">
                    <Zap className="h-3 w-3 group-hover:scale-110 transition-transform" strokeWidth={1.8} /> {t(insight.actionKey)}
                  </Link>
                </div>
              </CursorCard>
            ))}
          </CursorCardsContainer>
        </div>
      )}

      {view === "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card rounded-2xl card-static overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[13px] font-mondwest font-semibold">{t("dashboard.pipelineSummary")}</h2>
              <Link to="/agents" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium">{t("dashboard.viewAllShort")}</Link>
            </div>
            <div className="p-6 space-y-4">
              {pipelineStages.map((s) => (
                <div key={s.stageKey} className="block hover:bg-muted/20 -mx-2 px-2 py-1 rounded-lg transition-all">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] font-medium">{t(s.stageKey)}</span>
                    <span className="text-[11px] text-muted-foreground">{s.count} {t("dashboard.agentsLabel")}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl card-static overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[13px] font-mondwest font-semibold">{t("dashboard.activeCompanies")}</h2>
              <Link to="/companies" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium">{t("dashboard.allCompanies")}</Link>
            </div>
            <div className="divide-y divide-border">
              {activeCompanies.map((c) => (
                <Link key={c.id} to={`/companies/${c.id}`} className="px-6 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-all block">
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground">{c.agents} {t("dashboard.agentsLabel")} · {c.days}{t("dashboard.daysLabel")} {t("dashboard.daysActiveLabel")}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-success">{c.trend}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {view !== "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <CursorCardsContainer className="lg:col-span-2">
            <CursorCard borderColor="hsl(var(--border))">
              <div className="overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-[13px] font-mondwest font-semibold">{t("dashboard.recentAgents")}</h2>
                  <Link to="/agents" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-medium">
                    {t("dashboard.viewAll")} <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {recentAgents.map((a) => (
                    <Link key={a.id} to={`/agents/${a.id}`} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition-all duration-200 block">
                      <div className="h-10 w-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-foreground/50" strokeWidth={1.6} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-medium">{a.name}</p>
                          {a.aiMatch && <AiIcon className="text-muted-foreground animate-pulse-ai" size={12} />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{a.type}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${statusColors[a.status]}`}>
                        {statusDisplayName(a.status)}
                      </span>
                      <span className="text-[15px] font-mondwest font-semibold tabular-nums w-12 text-right">
                        {a.score}%
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </CursorCard>
          </CursorCardsContainer>

          <CursorCardsContainer className="space-y-5">
            <CursorCard borderColor="hsl(var(--border))">
              <div className="overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  <h2 className="text-[13px] font-mondwest font-semibold">{t("dashboard.notifications")}</h2>
                </div>
                <div className="divide-y divide-border">
                  {notifications.map((n, i) => (
                    <div key={i} className={`px-5 py-3.5 ${n.unread ? "bg-muted/30" : ""}`}>
                      <div className="flex items-start gap-2.5">
                        {n.unread && <div className="h-1.5 w-1.5 rounded-full bg-foreground/40 mt-1.5 shrink-0" />}
                        <div>
                          <p className="text-[12px] leading-relaxed">{t(n.textKey)}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium tracking-wider">{t(n.timeKey)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CursorCard>

            <CursorCard borderColor="hsl(var(--border))">
              <div className="overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <h2 className="text-[13px] font-mondwest font-semibold">{t("dashboard.activeCompanies")}</h2>
                  <Link to="/companies" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium">{t("dashboard.allCompanies")}</Link>
                </div>
                <div className="divide-y divide-border">
                  {activeCompanies.map((c) => (
                    <Link key={c.id} to={`/companies/${c.id}`} className="px-5 py-3 flex items-center gap-3 hover:bg-muted/30 transition-all duration-200 block">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium truncate">{c.title}</p>
                        <p className="text-[10px] text-muted-foreground">{c.agents} {t("dashboard.agentsLabel")} · {c.days}{t("dashboard.daysLabel")}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-success">{c.trend}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </CursorCard>
          </CursorCardsContainer>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
