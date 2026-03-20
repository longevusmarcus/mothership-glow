import { ArrowLeft, MapPin, Clock, Users, Briefcase, Edit, Archive, Target, KanbanSquare, List, Globe } from "lucide-react";
import { PublishDialog } from "@/components/jobs/PublishDialog";
import { CleanMotionBackground } from "@/components/ui/animated-tabs-background";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { Link, useParams } from "react-router-dom";
import { useState, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface JobCandidate {
  id: number; name: string; score: number; stage: string; date: string; aiMatch?: boolean; skillsMatch: number; expMatch: number; eduMatch: number;
}

const jobData: Record<string, {
  title: string; department: string; location: string; type: string; status: string;
  description: string; requirements: string[]; experience: string; salary: string;
  candidates: JobCandidate[];
  daysOpen: number;
  aiSummary: string;
}> = {
  "1": {
    title: "Senior Frontend Developer", department: "Engineering", location: "Milano",
    type: "Full-time", status: "Attiva", experience: "5+ anni", salary: "€45.000 — €60.000",
    description: "Cerchiamo un frontend developer senior con esperienza in React e TypeScript per guidare lo sviluppo dell'interfaccia utente dei nostri prodotti. Il candidato ideale ha esperienza nella gestione di team e nella definizione di architetture frontend scalabili.",
    requirements: ["React/TypeScript avanzato", "Esperienza con design system", "Conoscenza CI/CD", "Leadership tecnica", "Testing (Jest, Cypress)", "Inglese fluente"],
    candidates: [
      { id: 1, name: "Marco Rossi", score: 92, stage: "Colloquio", date: "15 Mar 2026", aiMatch: true, skillsMatch: 95, expMatch: 90, eduMatch: 88 },
      { id: 8, name: "Sara Mancini", score: 91, stage: "Placement", date: "8 Mar 2026", aiMatch: true, skillsMatch: 88, expMatch: 92, eduMatch: 90 },
      { id: 7, name: "Luca Fontana", score: 74, stage: "Screening", date: "9 Mar 2026", skillsMatch: 65, expMatch: 70, eduMatch: 80 },
    ],
    daysOpen: 12,
    aiSummary: "2 candidati con score superiore al 90%. Marco Rossi è il match più forte per competenze React/TypeScript (95%) con esperienza di leadership confermata. Sara Mancini ha un profilo full-stack complementare (92% esperienza). Luca Fontana richiede valutazione: competenze Vue.js trasferibili ma gap su TypeScript. Consiglio: procedere con colloqui tecnici per Rossi e Mancini, screening approfondito per Fontana.",
  },
};

const defaultJob = jobData["1"];

const stageColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

const stageOrder = ["Screening", "Colloquio", "Shortlist", "Placement"];
const stageDotColors: Record<string, string> = {
  Screening: "bg-muted-foreground",
  Colloquio: "bg-accent",
  Shortlist: "bg-secondary",
  Placement: "bg-primary",
};

const JobDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const job = jobData[id || "1"] || defaultJob;
  const [sortBy, setSortBy] = useState<"score" | "date">("score");
  const [candidateView, setCandidateView] = useState<"list" | "kanban">("list");
  const [draggedCandidate, setDraggedCandidate] = useState<{ candidate: JobCandidate; fromStage: string } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [localCandidates, setLocalCandidates] = useState(job.candidates);
  const [publishOpen, setPublishOpen] = useState(false);

  const sorted = [...localCandidates].sort((a, b) =>
    sortBy === "score" ? b.score - a.score : 0
  );

  // Group candidates by stage for kanban
  const kanbanStages = stageOrder.map(stage => ({
    id: stage,
    label: stage,
    candidates: localCandidates.filter(c => c.stage === stage),
  }));

  const handleDragStart = (candidate: JobCandidate, stageId: string) => {
    setDraggedCandidate({ candidate, fromStage: stageId });
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDrop = useCallback((targetStageId: string) => {
    if (!draggedCandidate || draggedCandidate.fromStage === targetStageId) return;
    setLocalCandidates(prev => prev.map(c =>
      c.id === draggedCandidate.candidate.id ? { ...c, stage: targetStageId } : c
    ));
    setDraggedCandidate(null);
    setDragOverStage(null);
  }, [draggedCandidate]);

  return (
    <div className="space-y-6">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("jobs.backToJobs")}
      </Link>

      <div className="bg-card rounded-2xl p-4 sm:p-7 card-static">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-[18px] sm:text-[22px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{job.title}</TextShimmer></h1>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${job.status === "Attiva" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {job.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{job.department}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" strokeWidth={1.6} />{job.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="h-3 w-3" strokeWidth={1.6} />{job.type}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" strokeWidth={1.6} />{job.daysOpen}{t("jobs.daysOpen")} {t("jobs.daysOpenLabel")}</span>
              <span className="flex items-center gap-1.5"><Users className="h-3 w-3" strokeWidth={1.6} />{localCandidates.length} {t("jobs.candidates").toLowerCase()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPublishOpen(true)} className="flex items-center gap-2 px-3.5 py-2 bg-foreground text-background rounded-xl text-[11px] font-body font-medium hover:opacity-90 active:scale-[0.97] transition-all">
              <Globe className="h-3 w-3" strokeWidth={1.6} /> {t("jobs.publish")}
            </button>
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
            <p className="text-[13px] text-muted-foreground leading-[1.8]">{job.description}</p>
          </div>

          <div className="bg-card rounded-2xl card-static overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-heading font-semibold">{t("jobs.candidates")} ({localCandidates.length})</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-2 py-1 rounded-lg font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border flex items-center gap-1"><AiIcon size={10} /> AI Ranked</span>
                {candidateView === "list" && (
                  <CleanMotionBackground
                    className="bg-muted/50 rounded-lg p-0.5"
                    hoverable={false}
                    defaultKey={sortBy}
                    onChange={(key) => key && setSortBy(key as "score" | "date")}
                  >
                    <div data-key="score"><span className="text-[9px] font-medium text-foreground">Score</span></div>
                    <div data-key="date"><span className="text-[9px] font-medium text-foreground">Data</span></div>
                  </CleanMotionBackground>
                )}
                <CleanMotionBackground
                  className="bg-muted/50 rounded-lg p-0.5"
                  hoverable={false}
                  defaultKey={candidateView}
                  onChange={(key) => key && setCandidateView(key as "list" | "kanban")}
                >
                  <div data-key="list"><span className="text-[9px] font-medium text-foreground flex items-center gap-1"><List className="h-3 w-3" strokeWidth={1.6} /></span></div>
                  <div data-key="kanban"><span className="text-[9px] font-medium text-foreground flex items-center gap-1"><KanbanSquare className="h-3 w-3" strokeWidth={1.6} /></span></div>
                </CleanMotionBackground>
              </div>
            </div>

            {candidateView === "list" ? (
              <div className="divide-y divide-border">
                {sorted.map(c => (
                  <Link key={c.id} to={`/candidates/${c.id}`} className="px-6 py-4 hover:bg-muted/20 transition-all duration-200 block">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-body font-semibold text-foreground/50">{c.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-medium truncate">{c.name}</p>
                          {c.aiMatch && <AiIcon className="text-muted-foreground" size={12} />}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{c.date}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${stageColors[c.stage]}`}>{c.stage}</span>
                      <span className="text-[16px] font-heading font-semibold tabular-nums w-14 text-right">{c.score}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 ml-14">
                      {[
                        { label: "Competenze", value: c.skillsMatch },
                        { label: "Esperienza", value: c.expMatch },
                        { label: "Formazione", value: c.eduMatch },
                      ].map(sub => (
                        <div key={sub.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] text-muted-foreground font-medium">{sub.label}</span>
                            <span className="text-[9px] font-semibold tabular-nums">{sub.value}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-ai/30 rounded-full transition-all" style={{ width: `${sub.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Kanban View */
              <div className="flex gap-3 overflow-x-auto p-4 snap-x snap-mandatory">
                {kanbanStages.map(stage => (
                  <div
                    key={stage.id}
                    className={`min-w-[200px] w-[200px] shrink-0 rounded-xl p-2.5 transition-all duration-200 snap-start ${
                      dragOverStage === stage.id ? "bg-muted/60 ring-1 ring-border" : "bg-muted/30"
                    }`}
                    onDragOver={(e) => handleDragOver(e, stage.id)}
                    onDragLeave={() => setDragOverStage(null)}
                    onDrop={() => handleDrop(stage.id)}
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${stageDotColors[stage.id] || "bg-muted"}`} />
                        <h3 className="text-[11px] font-heading font-semibold">{stage.label}</h3>
                      </div>
                      <span className="text-[9px] text-muted-foreground bg-card px-1.5 py-0.5 rounded-full font-semibold">
                        {stage.candidates.length}
                      </span>
                    </div>
                    <CursorCardsContainer className="space-y-2 min-h-[80px]">
                      {stage.candidates.map(c => (
                        <CursorCard key={c.id} borderColor="hsl(var(--border))" className="cursor-grab active:cursor-grabbing">
                          <div
                            draggable
                            onDragStart={() => handleDragStart(c, stage.id)}
                            className="p-3"
                          >
                            <Link to={`/candidates/${c.id}`} className="block" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-7 w-7 rounded-lg bg-accent/60 flex items-center justify-center shrink-0">
                                  <span className="text-[8px] font-body font-semibold text-foreground/50">
                                    {c.name.split(" ").map(n => n[0]).join("")}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1">
                                    <p className="text-[11px] font-medium truncate">{c.name}</p>
                                    {c.aiMatch && <AiIcon className="text-muted-foreground shrink-0" size={10} />}
                                  </div>
                                </div>
                              </div>
                            </Link>
                            <div className="flex items-center justify-between">
                              <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden mr-2">
                                <div className="h-full bg-ai/25 rounded-full" style={{ width: `${c.score}%` }} />
                              </div>
                              <span className="text-[10px] font-heading font-semibold tabular-nums">{c.score}%</span>
                            </div>
                          </div>
                        </CursorCard>
                      ))}
                    </CursorCardsContainer>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl p-5 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
              <h2 className="text-[12px] font-heading font-semibold text-foreground/80">AI Matching Report</h2>
            </div>
            <p className="text-[11px] text-foreground/70 leading-relaxed">{job.aiSummary}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 card-static">
            <h2 className="text-[13px] font-heading font-semibold mb-4">{t("jobs.requirements")}</h2>
            <ul className="space-y-2.5">
              {job.requirements.map(r => (
                <li key={r} className="text-[12px] text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/20 mt-1.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-2xl p-6 card-static">
            <h2 className="text-[13px] font-heading font-semibold mb-4">{t("jobs.details")}</h2>
            <div className="space-y-3.5 text-[13px]">
              {[
                [t("jobs.experience"), job.experience],
                [t("jobs.contract"), job.type],
                [t("jobs.salary"), job.salary],
                [t("jobs.location"), job.location],
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

      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} jobTitle={job.title} />
    </div>
  );
};

export default JobDetail;
