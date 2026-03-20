import { BarChart3, TrendingUp, Clock, Bot, DollarSign, Users, Eye } from "lucide-react";
import { CleanMotionBackground } from "@/components/ui/animated-tabs-background";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const Analytics = () => {
  const { t, locale } = useLanguage();
  const [period, setPeriod] = useState("3m");

  const metrics = [
    { label: locale === "it" ? "Aziende Lanciate" : "Companies Launched", value: "6", icon: BarChart3, trend: "+2" },
    { label: locale === "it" ? "Task Completati" : "Tasks Completed", value: "847", icon: Bot, trend: "+124" },
    { label: locale === "it" ? "Visitatori Totali" : "Total Visitors", value: "24.3K", icon: Users, trend: "+18%" },
    { label: locale === "it" ? "Ricavi Generati" : "Revenue Generated", value: "$12,840", icon: DollarSign, trend: "+$3,200" },
  ];

  const agentDistribution = [
    { source: "Tech Agents", count: 5, pct: 42 },
    { source: "Growth Agents", count: 3, pct: 25 },
    { source: "Ops Agents", count: 2, pct: 17 },
    { source: "Creative Agents", count: 2, pct: 16 },
  ];

  const monthLabels = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

  const monthlyData = [
    { month: monthLabels[0], tasks: 85, completed: 72, visitors: 1200, revenue: 480 },
    { month: monthLabels[1], tasks: 124, completed: 108, visitors: 2800, revenue: 1120 },
    { month: monthLabels[2], tasks: 98, completed: 89, visitors: 3400, revenue: 1640 },
    { month: monthLabels[3], tasks: 156, completed: 142, visitors: 5200, revenue: 2480 },
    { month: monthLabels[4], tasks: 187, completed: 178, visitors: 6100, revenue: 3120 },
    { month: monthLabels[5], tasks: 203, completed: 194, visitors: 5600, revenue: 4000 },
  ];

  const maxTasks = Math.max(...monthlyData.map(d => d.tasks));
  const maxVisitors = Math.max(...monthlyData.map(d => d.visitors));
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  const revenueByCompany = [
    { company: "NovaTech", revenue: "$4,280", pct: 33, mrr: "$1,420/mo" },
    { company: "FinFlow", revenue: "$3,640", pct: 28, mrr: "$1,213/mo" },
    { company: "DataPulse", revenue: "$2,870", pct: 22, mrr: "$957/mo" },
    { company: "HealthAI", revenue: "$2,050", pct: 16, mrr: "$683/mo" },
  ];

  const visitorSources = [
    { source: "Organic Search", visitors: "9,840", pct: 41 },
    { source: "Direct", visitors: "5,830", pct: 24 },
    { source: "Social Media", visitors: "4,620", pct: 19 },
    { source: "Referral", visitors: "2,410", pct: 10 },
    { source: "Paid Ads", visitors: "1,600", pct: 7 },
  ];

  const performanceByType = [
    { role: "Tech Agent (CodeForge)", score: 96 },
    { role: "Tech Agent (APIForge)", score: 95 },
    { role: "Tech Agent (DataStream)", score: 94 },
    { role: "Ops Agent (SecureGuard)", score: 92 },
    { role: "Growth Agent (GrowthPilot)", score: 91 },
    { role: "Creative Agent (DesignMind)", score: 87 },
  ];

  const maxScore = Math.max(...performanceByType.map(r => r.score));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("analytics.title")}</TextShimmer></h1>
          <p className="text-[13px] text-muted-foreground mt-1 font-mono">{t("analytics.subtitle")}</p>
        </div>
        <CleanMotionBackground className="bg-card border border-border rounded-xl p-1" hoverable={false} defaultKey={period} onChange={(key) => key && setPeriod(key)}>
          {["1m", "3m", "6m", "1y"].map(p => (
            <div key={p} data-key={p}><span className="text-[11px] font-medium text-foreground">{p}</span></div>
          ))}
        </CleanMotionBackground>
      </div>

      {/* AI Summary */}
      <div className="rounded-2xl p-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center"><AiIcon className="text-muted-foreground" size={13} /></div>
          <h2 className="text-[13px] font-mondwest font-semibold text-foreground/80">{t("analytics.aiSummary")}</h2>
        </div>
        <p className="text-[13px] text-foreground/70 leading-relaxed font-mono">
          {locale === "it"
            ? <>Revenue in crescita del <strong className="text-foreground">34%</strong> questo trimestre. NovaTech guida con <strong className="text-foreground">$4,280</strong> totali. Il traffico organico è la fonte principale (<strong className="text-foreground">41%</strong> dei visitatori). Suggerimento: scala gli agenti Growth su FinFlow per accelerare la conversione.</>
            : <>Revenue is up <strong className="text-foreground">34%</strong> this quarter. NovaTech leads with <strong className="text-foreground">$4,280</strong> total. Organic search is the top source (<strong className="text-foreground">41%</strong> of visitors). Recommendation: scale Growth agents on FinFlow to accelerate conversion.</>
          }
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 card-static">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-muted/70 flex items-center justify-center">
                <m.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
              </div>
              <span className="text-[10px] font-semibold text-success">{m.trend}</span>
            </div>
            <p className="text-[28px] font-mondwest font-semibold tracking-tight leading-none tabular-nums">{m.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1: Tasks + Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tasks per Month */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-mondwest font-semibold mb-8">{locale === "it" ? "Task per Mese" : "Tasks per Month"}</h2>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map(d => {
              const totalH = (d.tasks / maxTasks) * 160;
              const completedPct = (d.completed / d.tasks) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums group-hover:text-foreground/80 transition-colors">{d.tasks}</span>
                  <div className="w-full rounded-xl bg-muted/50 border border-border transition-all duration-300 group-hover:border-border/80 relative overflow-hidden" style={{ height: `${totalH}px` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/20 border-t border-primary/30 transition-all" style={{ height: `${completedPct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-6">
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <span className="h-2.5 w-2.5 rounded-md bg-muted/50 border border-border" /> {locale === "it" ? "Task Totali" : "Total Tasks"}
            </span>
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <span className="h-2.5 w-2.5 rounded-md bg-primary/20" /> {locale === "it" ? "Completati" : "Completed"}
            </span>
          </div>
        </div>

        {/* Visitors per Month */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-mondwest font-semibold mb-8">{locale === "it" ? "Visitatori per Mese" : "Visitors per Month"}</h2>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map(d => {
              const barH = (d.visitors / maxVisitors) * 160;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums group-hover:text-foreground/80 transition-colors">{(d.visitors / 1000).toFixed(1)}K</span>
                  <div className="w-full rounded-xl bg-success/[0.12] border border-success/20 transition-all duration-300 group-hover:border-success/35 relative overflow-hidden" style={{ height: `${barH}px` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-success/[0.15] to-success/[0.04]" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-6">
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <span className="h-2.5 w-2.5 rounded-md bg-success/[0.12] border border-success/20" /> {locale === "it" ? "Visitatori Unici" : "Unique Visitors"}
            </span>
          </div>
        </div>
      </div>

      {/* Charts row 2: Revenue + Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue per Month */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-mondwest font-semibold mb-8">{locale === "it" ? "Ricavi per Mese" : "Revenue per Month"}</h2>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map(d => {
              const barH = (d.revenue / maxRevenue) * 160;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums group-hover:text-foreground/80 transition-colors">${(d.revenue / 1000).toFixed(1)}K</span>
                  <div className="w-full rounded-xl bg-primary/[0.15] border border-primary/20 transition-all duration-300 group-hover:border-primary/40 relative overflow-hidden" style={{ height: `${barH}px` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.20] to-primary/[0.06]" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-6">
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <span className="h-2.5 w-2.5 rounded-md bg-primary/[0.15] border border-primary/20" /> {locale === "it" ? "Ricavi" : "Revenue"}
            </span>
          </div>
        </div>

        {/* Visitor Sources */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-mondwest font-semibold mb-6">{locale === "it" ? "Fonti Traffico" : "Traffic Sources"}</h2>
          <div className="space-y-4">
            {visitorSources.map(s => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium">{s.source}</span>
                  <span className="text-[11px] text-muted-foreground font-medium tabular-nums">{s.visitors} ({s.pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-success/30 rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 3: Revenue by Company + Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue by Company */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-mondwest font-semibold mb-6">{locale === "it" ? "Ricavi per Azienda" : "Revenue by Company"}</h2>
          <div className="space-y-4">
            {revenueByCompany.map(c => (
              <div key={c.company}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium">{c.company}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground/50 tabular-nums">{c.mrr}</span>
                    <span className="text-[12px] font-mondwest font-semibold tabular-nums">{c.revenue}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary/40 rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-mondwest font-semibold mb-6">{locale === "it" ? "Performance Agenti" : "Agent Performance"}</h2>
          <div className="space-y-4">
            {performanceByType.map(r => (
              <div key={r.role}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium">{r.role}</span>
                  <span className="text-[12px] font-mondwest font-semibold tabular-nums">{r.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(r.score / maxScore) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
