import { Search, Bot, Zap, Building2, List, KanbanSquare } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CleanMotionBackground } from "@/components/ui/animated-tabs-background";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";
import AgentsKanban from "@/components/candidates/CandidatesKanban";

const agentTypes = ["Tech Agent", "Growth Agent", "Ops Agent", "Creative Agent"];

const typeMeta: Record<string, { label: string; color: string; icon: string }> = {
  tech: { label: "Tech", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "⚡" },
  growth: { label: "Growth", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "📈" },
  ops: { label: "Ops", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "⚙️" },
  creative: { label: "Creative", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "🎨" },
};

const agents = [
  { id: 1, name: "CodeForge", role: "Full-Stack Dev", score: 96, stage: "Shortlist", aiParsed: true, jobPosition: "NovaTech", source: "tech",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"], company: "NovaTech", location: "Cloud" },
  { id: 2, name: "GrowthPilot", role: "SEO & Content", score: 91, stage: "Colloquio", aiParsed: true, jobPosition: "NovaTech", source: "growth",
    skills: ["SEO", "Content Strategy", "Analytics", "A/B Testing"], company: "NovaTech", location: "Cloud" },
  { id: 3, name: "DesignMind", role: "UI/UX Design", score: 87, stage: "Shortlist", aiParsed: false, jobPosition: "HealthAI", source: "creative",
    skills: ["Figma", "Design Systems", "Prototyping"], company: "HealthAI", location: "Cloud" },
  { id: 4, name: "DataStream", role: "Data Pipeline", score: 94, stage: "Placement", aiParsed: true, jobPosition: "DataPulse", source: "tech",
    skills: ["Python", "SQL", "Spark", "Airflow"], company: "DataPulse", location: "Cloud" },
  { id: 5, name: "OpsEngine", role: "DevOps & CI/CD", score: 89, stage: "Screening", aiParsed: false, jobPosition: "FinFlow", source: "ops",
    skills: ["Docker", "Kubernetes", "Terraform", "AWS"], company: "FinFlow", location: "Cloud" },
  { id: 6, name: "MarketBot", role: "Paid Ads & Social", score: 88, stage: "Colloquio", aiParsed: true, jobPosition: "NovaTech", source: "growth",
    skills: ["Google Ads", "Meta Ads", "Analytics", "Copywriting"], company: "NovaTech", location: "Cloud" },
  { id: 7, name: "SecureGuard", role: "Security Audit", score: 92, stage: "Shortlist", aiParsed: true, jobPosition: "FinFlow", source: "ops",
    skills: ["Penetration Testing", "OWASP", "Compliance", "Monitoring"], company: "FinFlow", location: "Cloud" },
  { id: 8, name: "ContentCraft", role: "Copywriting", score: 83, stage: "Screening", aiParsed: false, jobPosition: "HealthAI", source: "creative",
    skills: ["Blog Writing", "Email Copy", "Brand Voice", "Social Media"], company: "HealthAI", location: "Cloud" },
  { id: 9, name: "APIForge", role: "Backend & APIs", score: 95, stage: "Placement", aiParsed: true, jobPosition: "DataPulse", source: "tech",
    skills: ["REST", "GraphQL", "Microservices", "Redis"], company: "DataPulse", location: "Cloud" },
  { id: 10, name: "FinOps", role: "Billing & Payments", score: 90, stage: "Colloquio", aiParsed: true, jobPosition: "FinFlow", source: "ops",
    skills: ["Stripe", "Billing Logic", "Reconciliation", "Compliance"], company: "FinFlow", location: "Cloud" },
];

const statusColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

const Agents = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  const filtered = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" || a.source === typeFilter;
    const matchesStage = stageFilter === "all" || a.stage === stageFilter;
    return matchesSearch && matchesType && matchesStage;
  });

  const statusDisplayName = (stage: string) => {
    const map: Record<string, string> = {
      Screening: t("stage.screening"),
      Colloquio: t("stage.interview"),
      Shortlist: t("stage.shortlist"),
      Placement: t("stage.placement"),
    };
    return map[stage] || stage;
  };

  return (
    <div className="space-y-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-heading font-semibold tracking-tight">
            <TextShimmer as="span" duration={2.5}>{t("candidates.title")}</TextShimmer>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {agents.length} {t("candidates.inDatabase")}
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <CleanMotionBackground
            className="bg-card border border-border rounded-xl p-1"
            hoverable={false}
            defaultKey={viewMode}
            onChange={(key) => key && setViewMode(key as "list" | "kanban")}
          >
            <div data-key="list">
              <span className="text-[11px] font-medium text-foreground flex items-center justify-center gap-1.5">
                <List className="h-3 w-3" strokeWidth={1.6} /> {t("candidates.list")}
              </span>
            </div>
            <div data-key="kanban">
              <span className="text-[11px] font-medium text-foreground flex items-center justify-center gap-1.5">
                <KanbanSquare className="h-3 w-3" strokeWidth={1.6} /> {t("candidates.kanban")}
              </span>
            </div>
          </CleanMotionBackground>
          <Link to="/chat">
            <InteractiveHoverButton text="Deploy Agent" icon={<Bot className="h-3.5 w-3.5" strokeWidth={1.6} />} />
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.6} />
          <input
            type="text"
            placeholder={t("candidates.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-[12px] font-body placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-[38px] rounded-xl text-[12px] border-border">
            <SelectValue placeholder={t("candidates.allPositions")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("candidates.allPositions")}</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="ops">Ops</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-[38px] rounded-xl text-[12px] border-border">
            <SelectValue placeholder={t("candidates.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("candidates.all")}</SelectItem>
            <SelectItem value="Screening">{t("stage.screening")}</SelectItem>
            <SelectItem value="Colloquio">{t("stage.interview")}</SelectItem>
            <SelectItem value="Shortlist">{t("stage.shortlist")}</SelectItem>
            <SelectItem value="Placement">{t("stage.placement")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === "kanban" ? (
        <AgentsKanban candidates={filtered} />
      ) : (
        <CursorCardsContainer>
          <CursorCard borderColor="hsl(var(--border))">
            <div className="overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="px-5 py-3">{t("candidates.th.name")}</th>
                      <th className="px-4 py-3">{t("candidates.th.role")}</th>
                      <th className="px-4 py-3">{t("candidates.th.position")}</th>
                      <th className="px-4 py-3">{t("candidates.th.source")}</th>
                      <th className="px-4 py-3">{t("candidates.th.skills")}</th>
                      <th className="px-4 py-3">{t("candidates.th.stage")}</th>
                      <th className="px-4 py-3 text-right">{t("candidates.th.aiScore")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((a) => (
                      <tr key={a.id} className="hover:bg-muted/20 transition-all duration-200 group">
                        <td className="px-5 py-3.5">
                          <Link to={`/agents/${a.id}`} className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                              <Bot className="h-4 w-4 text-foreground/50" strokeWidth={1.6} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-medium group-hover:text-foreground/80 transition-colors">{a.name}</span>
                                {a.aiParsed && <AiIcon className="text-muted-foreground" size={12} />}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 text-[12px] text-muted-foreground">{a.role}</td>
                        <td className="px-4 py-3.5">
                          <Link to={`/companies/${agents.indexOf(a) < 4 ? 1 : 2}`} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                            <Building2 className="h-3 w-3" strokeWidth={1.6} /> {a.jobPosition}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          {a.source && typeMeta[a.source] && (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-semibold ${typeMeta[a.source].color}`}>
                              {typeMeta[a.source].icon} {typeMeta[a.source].label}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {a.skills.slice(0, 3).map(s => (
                              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{s}</span>
                            ))}
                            {a.skills.length > 3 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground/50 font-medium">+{a.skills.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${statusColors[a.stage]}`}>
                            {statusDisplayName(a.stage)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-[14px] font-heading font-semibold tabular-nums">{a.score}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CursorCard>
        </CursorCardsContainer>
      )}
    </div>
  );
};

export default Agents;
