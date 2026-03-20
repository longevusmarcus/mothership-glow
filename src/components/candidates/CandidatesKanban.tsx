import { useState, useCallback } from "react";
import AiIcon from "@/components/AiIcon";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

interface Candidate {
  id: number;
  name: string;
  role: string;
  score: number;
  stage: string;
  aiParsed?: boolean;
  jobPosition: string;
  source?: string;
}

const sourceMeta: Record<string, { label: string; color: string; icon: string }> = {
  linkedin: { label: "LinkedIn", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "in" },
  indeed: { label: "Indeed", color: "bg-[#2164F3]/10 text-[#2164F3]", icon: "iD" },
  glassdoor: { label: "Glassdoor", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "gD" },
  infojobs: { label: "InfoJobs", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "iJ" },
  diretto: { label: "Diretto", color: "bg-muted text-muted-foreground", icon: "CV" },
  referral: { label: "Referral", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "Rf" },
};

interface PipelineStage {
  id: string;
  labelKey: TranslationKey;
  color: string;
}

const stages: PipelineStage[] = [
  { id: "Screening", labelKey: "stage.screening", color: "bg-muted" },
  { id: "Colloquio", labelKey: "stage.interview", color: "bg-accent" },
  { id: "Shortlist", labelKey: "stage.shortlist", color: "bg-secondary" },
  { id: "Placement", labelKey: "stage.placement", color: "bg-primary" },
];

interface CandidatesKanbanProps {
  candidates: Candidate[];
}

const CandidatesKanban = ({ candidates }: CandidatesKanbanProps) => {
  const { t } = useLanguage();
  const [draggedCandidate, setDraggedCandidate] = useState<{ candidate: Candidate; fromStage: string } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [movedCandidates, setMovedCandidates] = useState<Record<number, string>>({});

  const getCandidateStage = (c: Candidate) => movedCandidates[c.id] || c.stage;

  const handleDragStart = (candidate: Candidate, stageId: string) => {
    setDraggedCandidate({ candidate, fromStage: stageId });
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => setDragOverStage(null);

  const handleDrop = useCallback((targetStageId: string) => {
    if (!draggedCandidate || draggedCandidate.fromStage === targetStageId) {
      setDraggedCandidate(null);
      setDragOverStage(null);
      return;
    }
    setMovedCandidates(prev => ({ ...prev, [draggedCandidate.candidate.id]: targetStageId }));
    setDraggedCandidate(null);
    setDragOverStage(null);
  }, [draggedCandidate]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
      {stages.map((stage) => {
        const stageCandidates = candidates.filter(c => getCandidateStage(c) === stage.id);
        return (
          <div
            key={stage.id}
            className={`min-w-[260px] sm:min-w-[280px] flex-1 shrink-0 rounded-2xl p-3 transition-all duration-200 snap-start ${
              dragOverStage === stage.id ? "bg-muted/60 ring-1 ring-border" : "bg-muted/30"
            }`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(stage.id)}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                <h3 className="text-[12px] font-heading font-semibold">{t(stage.labelKey)}</h3>
              </div>
              <span className="text-[10px] text-muted-foreground bg-card px-2 py-0.5 rounded-full font-semibold">
                {stageCandidates.length}
              </span>
            </div>
            <CursorCardsContainer className="space-y-2.5 min-h-[120px]">
              {stageCandidates.map((c) => (
                <CursorCard
                  key={c.id}
                  borderColor="hsl(var(--border))"
                  className="cursor-grab active:cursor-grabbing"
                >
                  <div
                    draggable
                    onDragStart={() => handleDragStart(c, getCandidateStage(c))}
                    className="p-4"
                  >
                    <Link to={`/candidates/${c.id}`} className="block">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-body font-semibold text-foreground/50">
                            {c.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-medium truncate">{c.name}</p>
                            {c.aiParsed && <AiIcon className="text-muted-foreground shrink-0" size={12} />}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{c.role}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 mb-3 px-0.5 flex items-center justify-between">
                        <span>{c.jobPosition}</span>
                        {c.source && sourceMeta[c.source] && (
                          <span className={`inline-flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded font-semibold ${sourceMeta[c.source].color}`}>
                            {sourceMeta[c.source].icon}
                          </span>
                        )}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden mr-3">
                        <div className="h-full bg-ai/25 rounded-full transition-all" style={{ width: `${c.score}%` }} />
                      </div>
                      <span className="text-[12px] font-heading font-semibold tabular-nums">{c.score}%</span>
                    </div>
                  </div>
                </CursorCard>
              ))}
            </CursorCardsContainer>
          </div>
        );
      })}
    </div>
  );
};

export default CandidatesKanban;
