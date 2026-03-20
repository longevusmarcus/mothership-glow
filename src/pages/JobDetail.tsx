import { ArrowLeft, Globe, Clock, Bot, Building2, Edit, Archive, Target, Rocket } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const companyData: Record<string, {
  title: string; department: string; location: string; type: string; status: string;
  description: string; stack: string[]; stage: string; budget: string;
  agents: { id: number; name: string; type: string; score: number; status: string; tasks: number }[];
  daysActive: number;
  aiSummary: string;
}> = {
  "1": {
    title: "NovaTech", department: "SaaS B2B", location: "Global",
    type: "MVP", status: "Attiva", stage: "MVP", budget: "$2,400/mo",
    description: "AI-powered project management platform for remote teams. Features include real-time collaboration, AI task prioritization, automated sprint planning, and team analytics. Built with React, Node.js, Supabase, and deployed on Vercel.",
    stack: ["React/TypeScript", "Node.js", "Supabase", "Stripe", "Vercel", "OpenAI API"],
    agents: [
      { id: 1, name: "CodeForge", type: "Tech", score: 96, status: "Active", tasks: 47 },
      { id: 2, name: "GrowthPilot", type: "Growth", score: 91, status: "Active", tasks: 23 },
      { id: 6, name: "MarketBot", type: "Growth", score: 88, status: "Active", tasks: 15 },
      { id: 3, name: "DesignMind", type: "Creative", score: 87, status: "Deployed", tasks: 31 },
    ],
    daysActive: 23,
    aiSummary: "NovaTech is progressing well toward MVP launch. CodeForge has completed 47 tasks including the core dashboard, real-time collaboration features, and Stripe integration. GrowthPilot is building the landing page and setting up analytics. Estimated MVP completion: 5 days. Recommendation: Deploy an Ops agent for CI/CD and monitoring before launch.",
  },
};

const defaultCompany = companyData["1"];

const CompanyDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const company = companyData[id || "1"] || defaultCompany;

  return (
    <div className="space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("jobs.backToJobs")}
      </Link>

      <div className="bg-card rounded-2xl p-4 sm:p-7 card-static">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-[18px] sm:text-[22px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{company.title}</TextShimmer></h1>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${company.status === "Attiva" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {company.status === "Attiva" ? t("jobs.active") : t("jobs.paused")}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{company.department} · {company.type}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" strokeWidth={1.6} />{company.location}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" strokeWidth={1.6} />{company.stage}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" strokeWidth={1.6} />{company.daysActive}{t("jobs.daysOpen")} {t("jobs.daysOpenLabel")}</span>
              <span className="flex items-center gap-1.5"><Bot className="h-3 w-3" strokeWidth={1.6} />{company.agents.length} {t("jobs.candidates").toLowerCase()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/chat" className="flex items-center gap-2 px-3.5 py-2 bg-foreground text-background rounded-xl text-[11px] font-body font-medium hover:opacity-90 active:scale-[0.97] transition-all">
              <Rocket className="h-3 w-3" strokeWidth={1.6} /> Deploy Agent
            </Link>
            <button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-[11px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">
              <Edit className="h-3 w-3" strokeWidth={1.6} /> {t("jobs.edit")}
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-[11px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">
              <Archive className="h-3 w-3" strokeWidth={1.6} /> {t("jobs.archive")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card rounded-2xl p-6 card-static">
            <h2 className="text-[13px] font-heading font-semibold mb-4">{t("jobs.description")}</h2>
            <p className="text-[13px] text-muted-foreground leading-[1.8]">{company.description}</p>
          </div>

          <div className="bg-card rounded-2xl card-static overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[13px] font-heading font-semibold">{t("jobs.candidates")} ({company.agents.length})</h2>
              <span className="text-[9px] px-2 py-1 rounded-lg font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border flex items-center gap-1"><AiIcon size={10} /> Orchestrated</span>
            </div>
            <div className="divide-y divide-border">
              {company.agents.map(a => (
                <Link key={a.id} to={`/agents/${a.id}`} className="px-6 py-4 hover:bg-muted/20 transition-all duration-200 block">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-foreground/50" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-medium truncate">{a.name}</p>
                        <AiIcon className="text-muted-foreground" size={12} />
                      </div>
                      <p className="text-[11px] text-muted-foreground">{a.type} Agent · {a.tasks} tasks completed</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${a.status === "Active" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>{a.status}</span>
                    <span className="text-[16px] font-heading font-semibold tabular-nums w-14 text-right">{a.score}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl p-5 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
              <h2 className="text-[12px] font-heading font-semibold text-foreground/80">AI Orchestration Report</h2>
            </div>
            <p className="text-[11px] text-foreground/70 leading-relaxed">{company.aiSummary}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 card-static">
            <h2 className="text-[13px] font-heading font-semibold mb-4">{t("jobs.requirements")}</h2>
            <ul className="space-y-2.5">
              {company.stack.map(s => (
                <li key={s} className="text-[12px] text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/20 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl p-6 card-static">
            <h2 className="text-[13px] font-heading font-semibold mb-4">{t("jobs.details")}</h2>
            <div className="space-y-3.5 text-[13px]">
              {[
                [t("jobs.experience"), company.stage],
                [t("jobs.contract"), company.type],
                [t("jobs.salary"), company.budget],
                [t("jobs.location"), company.location],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
