import { BarChart3, TrendingUp, Clock, Users, Download, FileText } from "lucide-react";
import { CleanMotionBackground } from "@/components/ui/animated-tabs-background";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const { t, locale } = useLanguage();
  const tab = searchParams.get("tab");
  const trend = searchParams.get("trend");
  const [period, setPeriod] = useState("3m");
  const funnelRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);

  const metrics = [
    { labelKey: "analytics.closedPositions" as TranslationKey, value: "24", periodKey: "analytics.lastMonth" as TranslationKey, icon: BarChart3, trend: "+8%" },
    { labelKey: "analytics.processedCandidates" as TranslationKey, value: "312", periodKey: "analytics.lastMonth" as TranslationKey, icon: Users, trend: "+15%" },
    { labelKey: "analytics.avgCloseTime" as TranslationKey, value: locale === "en" ? "21d" : "21g", periodKey: "analytics.avg3Months" as TranslationKey, icon: Clock, trend: "-12%" },
    { labelKey: "analytics.conversionRate" as TranslationKey, value: "18%", periodKey: "analytics.lastMonth" as TranslationKey, icon: TrendingUp, trend: "+3%" },
  ];

  const sourceData = [
    { source: "LinkedIn", count: 145, pct: 42 },
    { sourceKey: "analytics.website" as TranslationKey, count: 89, pct: 26 },
    { source: "Referral", count: 52, pct: 15 },
    { source: "Indeed", count: 38, pct: 11 },
    { sourceKey: "analytics.other" as TranslationKey, count: 21, pct: 6 },
  ];

  const monthKeys: TranslationKey[] = [
    "analytics.month.oct", "analytics.month.nov", "analytics.month.dec",
    "analytics.month.jan", "analytics.month.feb", "analytics.month.mar",
  ];

  const monthlyData = [
    { monthKey: monthKeys[0], candidates: 45, hired: 6 },
    { monthKey: monthKeys[1], candidates: 62, hired: 8 },
    { monthKey: monthKeys[2], candidates: 38, hired: 5 },
    { monthKey: monthKeys[3], candidates: 71, hired: 10 },
    { monthKey: monthKeys[4], candidates: 58, hired: 7 },
    { monthKey: monthKeys[5], candidates: 84, hired: 12 },
  ];

  const maxCandidates = Math.max(...monthlyData.map(d => d.candidates));

  const funnelData = [
    { stageKey: "analytics.funnel.received" as TranslationKey, count: 847, pct: 100 },
    { stageKey: "analytics.funnel.aiScreening" as TranslationKey, count: 523, pct: 62 },
    { stageKey: "analytics.funnel.interview" as TranslationKey, count: 198, pct: 23 },
    { stageKey: "analytics.funnel.shortlist" as TranslationKey, count: 87, pct: 10 },
    { stageKey: "analytics.funnel.placement" as TranslationKey, count: 42, pct: 5 },
  ];

  const timeToHireByRole = [
    { role: "Frontend Developer", days: 18 },
    { role: "Backend Engineer", days: 22 },
    { role: "Product Manager", days: 28 },
    { role: "UX/UI Designer", days: 15 },
    { role: "Data Analyst", days: 20 },
    { role: "DevOps Engineer", days: 25 },
  ];

  const maxDays = Math.max(...timeToHireByRole.map(r => r.days));

  useEffect(() => {
    if (tab === "funnel" && funnelRef.current) {
      funnelRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (trend && trendRef.current) {
      trendRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [tab, trend]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("analytics.title")}</TextShimmer></h1>
          <p className="text-[13px] text-muted-foreground mt-1">{t("analytics.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <CleanMotionBackground
            className="bg-card border border-border rounded-xl p-1"
            hoverable={false}
            defaultKey={period}
            onChange={(key) => key && setPeriod(key)}
          >
            {["1m", "3m", "6m", "1a"].map(p => (
              <div key={p} data-key={p}>
                <span className="text-[11px] font-medium text-foreground">{p}</span>
              </div>
            ))}
          </CleanMotionBackground>
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-2xl p-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
            <AiIcon className="text-muted-foreground" size={13} />
          </div>
          <h2 className="text-[13px] font-heading font-semibold text-foreground/80">{t("analytics.aiSummary")}</h2>
        </div>
        <p className="text-[13px] text-foreground/70 leading-relaxed">
          {t("analytics.aiSummaryText.timeReduced")} <strong className="text-foreground">12%</strong> {t("analytics.aiSummaryText.comparedToQuarter")}{" "}
          {t("analytics.aiSummaryText.linkedinMain")} <strong className="text-foreground">42%</strong> {t("analytics.aiSummaryText.ofCandidates")}{" "}
          {t("analytics.aiSummaryText.conversionImproved")} <strong className="text-foreground">3 {t("analytics.aiSummaryText.percentagePoints")}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.labelKey} className="bg-card rounded-2xl p-5 card-static">
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-muted/70 flex items-center justify-center">
                <m.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
              </div>
              <span className="text-[10px] font-semibold text-success">{m.trend}</span>
            </div>
            <p className="text-[28px] font-heading font-semibold tracking-tight leading-none">{m.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">{t(m.labelKey)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar chart */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-heading font-semibold mb-8">{t("analytics.candidatesPerMonth")}</h2>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map(d => {
              const barH = (d.candidates / maxCandidates) * 140;
              const hiredH = (d.hired / maxCandidates) * 140;
              return (
                <div key={d.monthKey} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums group-hover:text-foreground/80 transition-colors">{d.candidates}</span>
                  <div className="w-full flex flex-col gap-1.5">
                    {/* Main bar — card-like with ai blue glow */}
                    <div
                      className="w-full rounded-xl bg-ai/[0.12] border border-ai/20 transition-all duration-300 group-hover:border-ai/35 relative overflow-hidden"
                      style={{ height: `${barH}px` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-ai/[0.15] to-ai/[0.04]" />
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 24px hsl(var(--ai) / 0.2), 0 4px 16px hsl(var(--ai) / 0.1)' }} />
                    </div>
                    {/* Hired bar — warm cream/accent */}
                    <div
                      className="w-full rounded-lg bg-accent/70 border border-accent-foreground/10 transition-all duration-300 group-hover:bg-accent group-hover:border-accent-foreground/20"
                      style={{ height: `${Math.max(hiredH, 6)}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1 group-hover:text-foreground/70 transition-colors">{t(d.monthKey)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-5 mt-6">
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <span className="h-2.5 w-2.5 rounded-md bg-ai/[0.12] border border-ai/20" /> {t("analytics.candidates")}
            </span>
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <span className="h-2.5 w-2.5 rounded-md bg-accent/70 border border-accent-foreground/10" /> {t("analytics.hired")}
            </span>
          </div>
        </div>

        {/* Sources */}
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-heading font-semibold mb-6">{t("analytics.acquisitionSources")}</h2>
          <div className="space-y-4">
            {sourceData.map(s => {
              const name = 'sourceKey' in s ? t(s.sourceKey as TranslationKey) : (s as any).source;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium">{name}</span>
                    <span className="text-[11px] text-muted-foreground font-medium">{s.count} ({s.pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-ai/25 rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Funnel */}
        <div ref={trendRef} className={`bg-card rounded-2xl p-6 card-static ${trend ? "ring-2 ring-accent" : ""}`}>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-[13px] font-heading font-semibold">{t("analytics.conversionFunnel")}</h2>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border">AI</span>
          </div>
          <div className="space-y-4">
            {funnelData.map((f, i) => (
              <div key={f.stageKey}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium">{t(f.stageKey)}</span>
                  <span className="text-[11px] text-muted-foreground font-medium">{f.count} <span className="text-muted-foreground/40">({f.pct}%)</span></span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-ai/25 rounded-full transition-all" style={{ width: `${f.pct}%`, opacity: 1 - i * 0.1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time to hire */}
        <div ref={funnelRef} className={`bg-card rounded-2xl p-6 card-static ${tab === "funnel" ? "ring-2 ring-accent" : ""}`}>
          <h2 className="text-[13px] font-heading font-semibold mb-6">{t("analytics.avgTimeByRole")}</h2>
          <div className="space-y-4">
            {timeToHireByRole.map(r => (
              <div key={r.role}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium">{r.role}</span>
                  <span className="text-[12px] font-heading font-semibold tabular-nums">{r.days}{locale === "en" ? "d" : "g"}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(r.days / maxDays) * 100}%` }} />
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
