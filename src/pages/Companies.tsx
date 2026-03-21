import { Plus, Globe, Clock, Bot } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { CleanMotionBackground } from "@/components/ui/animated-tabs-background";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const companies = [
  { id: 1, title: "NovaTech", department: "SaaS B2B", location: "Global", type: "MVP", agents: 4, daysActive: 23, status: "Attiva", description: "AI-powered project management platform for remote teams. Built with React, Node.js, and Supabase.", aiMatches: 3 },
  { id: 2, title: "FinFlow", department: "Fintech", location: "EU", type: "Growth", agents: 3, daysActive: 15, status: "Attiva", description: "Automated invoicing and expense management for freelancers and SMBs.", aiMatches: 2 },
  { id: 3, title: "HealthAI", department: "HealthTech", location: "US", type: "Idea", agents: 2, daysActive: 8, status: "Attiva", description: "AI symptom checker and telemedicine booking platform.", aiMatches: 1 },
  { id: 4, title: "DataPulse", department: "Data Analytics", location: "Global", type: "Scale", agents: 3, daysActive: 31, status: "Attiva", description: "Real-time business intelligence dashboard with AI-powered insights.", aiMatches: 3 },
  { id: 5, title: "EduSpark", department: "EdTech", location: "EU", type: "Idea", agents: 1, daysActive: 5, status: "In Pausa", description: "Personalized learning paths powered by AI tutoring agents.", aiMatches: 0 },
  { id: 6, title: "ShopStream", department: "E-commerce", location: "Global", type: "MVP", agents: 2, daysActive: 12, status: "Attiva", description: "AI-curated marketplace for handmade goods with automated logistics.", aiMatches: 1 },
];

const Companies = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? companies : companies.filter(j => j.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("companies.title")}</TextShimmer></h1>
          <p className="text-[13px] text-muted-foreground mt-1 font-mono">
            {companies.filter(c => c.status === "Attiva").length} {t("companies.activePositions")}
          </p>
        </div>
        <Link to="/companies/new" className="w-full sm:w-auto">
          <InteractiveHoverButton className="w-full sm:w-auto" text={t("companies.newPosition")} icon={<Plus className="h-3.5 w-3.5" strokeWidth={1.6} />} />
        </Link>
      </div>

      <CleanMotionBackground
        className="bg-card border border-border rounded-xl p-1 w-full sm:w-fit"
        hoverable={false}
        defaultKey={filter}
        onChange={(key) => key && setFilter(key)}
      >
        <div data-key="all"><span className="text-[11px] font-medium text-foreground">{t("companies.all")}</span></div>
        <div data-key="Attiva"><span className="text-[11px] font-medium text-foreground">{t("companies.active")}</span></div>
        <div data-key="In Pausa"><span className="text-[11px] font-medium text-foreground whitespace-nowrap">{t("companies.paused")}</span></div>
      </CleanMotionBackground>

      <CursorCardsContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((company) => (
          <CursorCard key={company.id} borderColor="hsl(var(--border))" className="h-full">
            <Link to={`/companies/${company.id}`} className="block p-6 group h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[15px] font-mondwest font-semibold group-hover:text-foreground/80 transition-colors">{company.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 uppercase font-medium tracking-wider font-mono">{company.department} · {company.type}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold shrink-0 ${company.status === "Attiva" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {company.status === "Attiva" ? t("companies.active") : t("companies.paused")}
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground mb-5 line-clamp-2 leading-relaxed flex-1">{company.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" strokeWidth={1.6} />{company.location}</span>
                  <span className="flex items-center gap-1.5"><Bot className="h-3 w-3" strokeWidth={1.6} />{company.agents}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" strokeWidth={1.6} />{company.daysActive}{t("companies.daysOpen")}</span>
                </div>
                {company.aiMatches > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <AiIcon size={12} /> {company.aiMatches} {t("companies.aiMatch")}
                  </span>
                )}
              </div>
            </Link>
          </CursorCard>
        ))}
      </CursorCardsContainer>
    </div>
  );
};

export default Companies;
