import { Plus, MapPin, Clock, Users } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { CleanMotionBackground } from "@/components/ui/animated-tabs-background";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const jobs = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Milano", type: "Full-time", candidates: 34, daysOpen: 12, status: "Attiva", description: "Frontend developer senior con esperienza in React e TypeScript.", aiMatches: 3 },
  { id: 2, title: "Product Manager", department: "Product", location: "Roma", type: "Full-time", candidates: 28, daysOpen: 8, status: "Attiva", description: "Product manager con esperienza in metodologie agili.", aiMatches: 2 },
  { id: 3, title: "UX/UI Designer", department: "Design", location: "Remote", type: "Full-time", candidates: 19, daysOpen: 15, status: "Attiva", description: "Designer con background in user research e design system.", aiMatches: 1 },
  { id: 4, title: "Backend Engineer", department: "Engineering", location: "Milano", type: "Full-time", candidates: 42, daysOpen: 5, status: "Attiva", description: "Backend engineer esperto in Node.js e architetture cloud.", aiMatches: 5 },
  { id: 5, title: "Data Analyst", department: "Data", location: "Remote", type: "Part-time", candidates: 15, daysOpen: 20, status: "In Pausa", description: "Data analyst con competenze in SQL e strumenti di visualizzazione.", aiMatches: 0 },
  { id: 6, title: "DevOps Engineer", department: "Engineering", location: "Milano", type: "Full-time", candidates: 11, daysOpen: 3, status: "Attiva", description: "DevOps con esperienza in AWS, Docker e pipeline CI/CD.", aiMatches: 1 },
];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const statusParam = searchParams.get("status");
  const initialFilter = statusParam === "completed" ? "Chiusa" : statusParam === "archived" ? "Archiviata" : "all";
  const [filter, setFilter] = useState<string>(initialFilter);
  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  useEffect(() => {
    const newFilter = statusParam === "completed" ? "Chiusa" : statusParam === "archived" ? "Archiviata" : "all";
    setFilter(newFilter);
  }, [statusParam]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("jobs.title")}</TextShimmer></h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {jobs.filter((j) => j.status === "Attiva").length} {t("jobs.activePositions")}
          </p>
        </div>
        <Link to="/jobs/new" className="w-full sm:w-auto">
          <InteractiveHoverButton className="w-full sm:w-auto" text={t("jobs.newPosition")} icon={<Plus className="h-3.5 w-3.5" strokeWidth={1.6} />} />
        </Link>
      </div>

      <CleanMotionBackground
        className="bg-card border border-border rounded-xl p-1 w-full sm:w-fit"
        hoverable={false}
        defaultKey={filter}
        onChange={(key) => key && setFilter(key)}
      >
        <div data-key="all"><span className="text-[11px] font-medium text-foreground">{t("jobs.all")}</span></div>
        <div data-key="Attiva"><span className="text-[11px] font-medium text-foreground">{t("jobs.active")}</span></div>
        <div data-key="In Pausa"><span className="text-[11px] font-medium text-foreground whitespace-nowrap">{t("jobs.paused")}</span></div>
      </CleanMotionBackground>

      <CursorCardsContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((job) => (
          <CursorCard key={job.id} borderColor="hsl(var(--border))" className="h-full">
            <Link to={`/jobs/${job.id}`} className="block p-6 group h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[15px] font-heading font-semibold group-hover:text-foreground/80 transition-colors">{job.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 uppercase font-medium tracking-wider">{job.department}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold shrink-0 ${job.status === "Attiva" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {job.status}
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground mb-5 line-clamp-2 leading-relaxed flex-1">{job.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" strokeWidth={1.6} />{job.location}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-3 w-3" strokeWidth={1.6} />{job.candidates}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" strokeWidth={1.6} />{job.daysOpen}{t("jobs.daysOpen")}</span>
                </div>
                {job.aiMatches > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                    <AiIcon size={12} /> {job.aiMatches} {t("jobs.aiMatch")}
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

export default Jobs;
