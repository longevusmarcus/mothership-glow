import { Briefcase, Users, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Bell, ChevronRight, Zap } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const stageColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const { t, locale } = useLanguage();
  const view = searchParams.get("view") || "overview";
  const now = new Date();
  const hour = now.getHours();
  const greetingKey: TranslationKey = hour < 12 ? "dashboard.greeting.morning" : hour < 18 ? "dashboard.greeting.afternoon" : "dashboard.greeting.evening";
  const dateStr = now.toLocaleDateString(locale === "en" ? "en-US" : "it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const stats = [
    { labelKey: "dashboard.stat.openPositions" as TranslationKey, value: "12", change: "+3", up: true, icon: Briefcase, href: "/jobs" },
    { labelKey: "dashboard.stat.totalCandidates" as TranslationKey, value: "847", change: "+24", up: true, icon: Users, href: "/candidates" },
    { labelKey: "dashboard.stat.avgTime" as TranslationKey, value: locale === "en" ? "18d" : "18g", change: locale === "en" ? "-2d" : "-2g", up: true, icon: Clock, href: "/analytics" },
    { labelKey: "dashboard.stat.conversion" as TranslationKey, value: "23%", change: "-1%", up: false, icon: TrendingUp, href: "/analytics" },
  ];

  const recentCandidates = [
    { id: 1, name: "Marco Rossi", role: "Frontend Developer", score: 92, stage: "Colloquio", aiMatch: true },
    { id: 2, name: "Laura Bianchi", role: "Product Manager", score: 87, stage: "Screening", aiMatch: true },
    { id: 3, name: "Alessandro Verdi", role: "UX Designer", score: 78, stage: "Shortlist", aiMatch: false },
    { id: 4, name: "Giulia Neri", role: "Backend Developer", score: 95, stage: "Colloquio", aiMatch: true },
    { id: 5, name: "Francesco Russo", role: "Data Analyst", score: 71, stage: "Screening", aiMatch: false },
  ];

  const activeJobs = [
    { id: 1, title: "Senior Frontend Developer", candidates: 34, days: 12, trend: "+5" },
    { id: 2, title: "Product Manager", candidates: 28, days: 8, trend: "+3" },
    { id: 3, title: "UX/UI Designer", candidates: 19, days: 15, trend: "+1" },
    { id: 4, title: "Backend Engineer", candidates: 42, days: 5, trend: "+8" },
  ];

  const aiInsights = [
    { textKey: "dashboard.insight.1" as TranslationKey, actionKey: "dashboard.insight.action.1" as TranslationKey, href: "/jobs/1" },
    { textKey: "dashboard.insight.2" as TranslationKey, actionKey: "dashboard.insight.action.2" as TranslationKey, href: "/analytics" },
    { textKey: "dashboard.insight.3" as TranslationKey, actionKey: "dashboard.insight.action.3" as TranslationKey, href: "/candidates" },
  ];

  const notifications = [
    { textKey: "dashboard.notif.1" as TranslationKey, timeKey: "dashboard.notif.time.1" as TranslationKey, unread: true },
    { textKey: "dashboard.notif.2" as TranslationKey, timeKey: "dashboard.notif.time.2" as TranslationKey, unread: true },
    { textKey: "dashboard.notif.3" as TranslationKey, timeKey: "dashboard.notif.time.3" as TranslationKey, unread: false },
  ];

  const pipelineStages = [
    { stageKey: "stage.screening" as TranslationKey, count: 45, pct: 100 },
    { stageKey: "stage.interview" as TranslationKey, count: 18, pct: 40 },
    { stageKey: "stage.shortlist" as TranslationKey, count: 8, pct: 18 },
    { stageKey: "stage.placement" as TranslationKey, count: 3, pct: 7 },
  ];

  const stageDisplayName = (stage: string) => {
    const map: Record<string, TranslationKey> = {
      Screening: "stage.screening",
      Colloquio: "stage.interview",
      Shortlist: "stage.shortlist",
      Placement: "stage.placement",
    };
    return map[stage] ? t(map[stage]) : stage;
  };

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-muted-foreground font-medium capitalize tracking-wide">{dateStr}</p>
          <h1 className="text-[22px] sm:text-[28px] font-heading font-semibold tracking-tight mt-1">
            <TextShimmer as="span" duration={2.5}>{`${t(greetingKey)}, Recruiter`}</TextShimmer>
          </h1>
        </div>
        <Link to="/jobs/new" className="w-full sm:w-auto">
          <InteractiveHoverButton className="w-full sm:w-auto" text={t("dashboard.newPosition")} icon={<Briefcase className="h-3.5 w-3.5" strokeWidth={1.6} />} />
        </Link>
      </div>

      {/* Stats — clickable */}
      <CursorCardsContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.labelKey} to={stat.href}>
            <CursorCard borderColor="hsl(var(--border))">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted/70 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                  </div>
                  <span className={`text-[11px] font-body font-semibold flex items-center gap-0.5 ${stat.up ? "text-success" : "text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-[30px] font-heading font-semibold tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">{t(stat.labelKey)}</p>
              </div>
            </CursorCard>
          </Link>
        ))}
      </CursorCardsContainer>

      {/* AI Insights — overview only */}
      {view !== "summary" && (
        <div className="rounded-2xl p-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
              <AiIcon className="text-muted-foreground" size={13} />
            </div>
            <h2 className="text-[13px] font-heading font-semibold text-foreground">{t("dashboard.aiInsights")}</h2>
            <span className="text-[8px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-[0.08em] border border-border">Live</span>
          </div>
          <CursorCardsContainer className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.map((insight, i) => (
              <CursorCard key={i} illuminationColor="hsl(var(--foreground) / 0.04)" primaryHue="hsl(var(--foreground) / 0.12)" secondaryHue="hsl(var(--foreground) / 0.04)" borderColor="hsl(var(--border))">
                <div className="p-4 flex flex-col justify-between gap-4 min-h-[100px]">
                  <p className="text-[12.5px] leading-[1.6] text-foreground/75 font-body">{t(insight.textKey)}</p>
                  <Link to={insight.href} className="text-[10.5px] font-medium text-muted-foreground hover:text-foreground transition-colors self-start flex items-center gap-1.5 group">
                    <Zap className="h-3 w-3 group-hover:scale-110 transition-transform" strokeWidth={1.8} /> {t(insight.actionKey)}
                  </Link>
                </div>
              </CursorCard>
            ))}
          </CursorCardsContainer>
        </div>
      )}

      {/* Summary view */}
      {view === "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card rounded-2xl card-static overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[13px] font-heading font-semibold">{t("dashboard.pipelineSummary")}</h2>
              <Link to="/candidates" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium">{t("dashboard.viewAllShort")}</Link>
            </div>
            <div className="p-6 space-y-4">
              {pipelineStages.map((s) => (
                <Link key={s.stageKey} to={`/candidates?status=${s.stageKey === "stage.screening" ? "valutazione" : s.stageKey === "stage.placement" ? "assunti" : t(s.stageKey).toLowerCase()}`} className="block hover:bg-muted/20 -mx-2 px-2 py-1 rounded-lg transition-all">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] font-medium">{t(s.stageKey)}</span>
                    <span className="text-[11px] text-muted-foreground">{s.count} {t("dashboard.candidatesLabel")}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl card-static overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[13px] font-heading font-semibold">{t("dashboard.activePositions")}</h2>
              <Link to="/jobs" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium">{t("dashboard.allPositions")}</Link>
            </div>
            <div className="divide-y divide-border">
              {activeJobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`} className="px-6 py-3.5 flex items-center gap-3 hover:bg-muted/30 transition-all block">
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">{job.title}</p>
                    <p className="text-[10px] text-muted-foreground">{job.candidates} {t("dashboard.candidatesLabel")} · {job.days}{t("dashboard.daysLabel")} {t("dashboard.daysOpenLabel")}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-success">{job.trend}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content — overview only */}
      {view !== "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <CursorCardsContainer className="lg:col-span-2">
            <CursorCard borderColor="hsl(var(--border))">
              <div className="overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-[13px] font-heading font-semibold">{t("dashboard.recentCandidates")}</h2>
                  <Link to="/candidates" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors font-medium">
                    {t("dashboard.viewAll")} <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {recentCandidates.map((c) => (
                    <Link key={c.id} to={`/candidates/${c.id}`} className="px-6 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition-all duration-200 block">
                      <div className="h-10 w-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-body font-semibold text-foreground/50">
                          {c.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-medium">{c.name}</p>
                          {c.aiMatch && <AiIcon className="text-muted-foreground animate-pulse-ai" size={12} />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{c.role}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${stageColors[c.stage]}`}>
                        {stageDisplayName(c.stage)}
                      </span>
                      <span className="text-[15px] font-heading font-semibold tabular-nums w-12 text-right">
                        {c.score}%
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
                  <h2 className="text-[13px] font-heading font-semibold">{t("dashboard.notifications")}</h2>
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
                  <h2 className="text-[13px] font-heading font-semibold">{t("dashboard.activePositions")}</h2>
                  <Link to="/jobs" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors font-medium">{t("dashboard.allPositions")}</Link>
                </div>
                <div className="divide-y divide-border">
                  {activeJobs.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="px-5 py-3 flex items-center gap-3 hover:bg-muted/30 transition-all duration-200 block">
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium truncate">{job.title}</p>
                        <p className="text-[10px] text-muted-foreground">{job.candidates} {t("dashboard.candidatesLabel")} · {job.days}{t("dashboard.daysLabel")}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-success">{job.trend}</span>
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
