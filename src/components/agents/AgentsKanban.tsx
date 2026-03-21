import { useState, useCallback } from "react";
import AiIcon from "@/components/AiIcon";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";
import { Bot } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  role: string;
  score: number;
  stage: string;
  aiParsed?: boolean;
  jobPosition: string;
  source?: string;
}

const typeMeta: Record<string, { label: string; color: string; icon: string }> = {
  tech: { label: "Tech", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "⚡" },
  growth: { label: "Growth", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "📈" },
  ops: { label: "Ops", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "⚙️" },
  creative: { label: "Creative", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "🎨" },
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

interface AgentsKanbanProps {
  agents: Agent[];
}

const AgentsKanban = ({ agents }: AgentsKanbanProps) => {
  const { t } = useLanguage();
  const [draggedAgent, setDraggedAgent] = useState<{ agent: Agent; fromStage: string } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [movedAgents, setMovedAgents] = useState<Record<number, string>>({});

  const getAgentStage = (a: Agent) => movedAgents[a.id] || a.stage;

  const handleDragStart = (agent: Agent, stageId: string) => { setDraggedAgent({ agent, fromStage: stageId }); };
  const handleDragOver = (e: React.DragEvent, stageId: string) => { e.preventDefault(); setDragOverStage(stageId); };
  const handleDragLeave = () => setDragOverStage(null);

  const handleDrop = useCallback((targetStageId: string) => {
    if (!draggedAgent || draggedAgent.fromStage === targetStageId) {
      setDraggedAgent(null); setDragOverStage(null); return;
    }
    setMovedAgents(prev => ({ ...prev, [draggedAgent.agent.id]: targetStageId }));
    setDraggedAgent(null); setDragOverStage(null);
  }, [draggedAgent]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
      {stages.map(stage => {
        const stageAgents = agents.filter(a => getAgentStage(a) === stage.id);
        return (
          <div key={stage.id} className={`min-w-[260px] sm:min-w-[280px] flex-1 shrink-0 rounded-2xl p-3 transition-all duration-200 snap-start ${dragOverStage === stage.id ? "bg-muted/60 ring-1 ring-border" : "bg-muted/30"}`}
            onDragOver={e => handleDragOver(e, stage.id)} onDragLeave={handleDragLeave} onDrop={() => handleDrop(stage.id)}>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                <h3 className="text-[12px] font-mondwest font-semibold">{t(stage.labelKey)}</h3>
              </div>
              <span className="text-[10px] text-muted-foreground bg-card px-2 py-0.5 rounded-full font-semibold">{stageAgents.length}</span>
            </div>
            <CursorCardsContainer className="space-y-2.5 min-h-[120px]">
              {stageAgents.map(a => (
                <CursorCard key={a.id} borderColor="hsl(var(--border))" className="cursor-grab active:cursor-grabbing">
                  <div draggable onDragStart={() => handleDragStart(a, getAgentStage(a))} className="p-4">
                    <Link to={`/agents/${a.id}`} className="block">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-foreground/50" strokeWidth={1.6} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-medium truncate">{a.name}</p>
                            {a.aiParsed && <AiIcon className="text-muted-foreground shrink-0" size={12} />}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{a.role}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 mb-3 px-0.5 flex items-center justify-between">
                        <span>{a.jobPosition}</span>
                        {a.source && typeMeta[a.source] && (
                          <span className={`inline-flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded font-semibold ${typeMeta[a.source].color}`}>
                            {typeMeta[a.source].icon}
                          </span>
                        )}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden mr-3">
                        <div className="h-full bg-ai/25 rounded-full transition-all" style={{ width: `${a.score}%` }} />
                      </div>
                      <span className="text-[12px] font-mondwest font-semibold tabular-nums">{a.score}%</span>
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

export default AgentsKanban;
