import { ArrowLeft, Bot, Zap, Building2, Activity, Terminal, StickyNote, ChevronDown } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useParams } from "react-router-dom";
import { useState, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const typeMeta: Record<string, { label: string; color: string; icon: string }> = {
  tech: { label: "Tech", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "⚡" },
  growth: { label: "Growth", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "📈" },
  ops: { label: "Ops", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "⚙️" },
  creative: { label: "Creative", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "🎨" },
};

const agentData: Record<string, {
  name: string; type: string; endpoint: string; version: string; role: string; score: number; stage: string;
  source: string;
  deployments: { company: string; role: string; period: string; description: string }[];
  training: { source: string; dataset: string; date: string }[];
  skills: string[]; integrations: { name: string; status: string }[];
  apiSkills: string[];
  commands: { date: string; command: string; status: string }[];
  history: { date: string; action: string; by: string; ai?: boolean }[];
  aiAnalysis: { summary: string; strengths: string[]; gaps: string[]; recommendation: string };
  matchScores: { company: string; overall: number; skills: number; performance: number; reliability: number }[];
  notes: { date: string; text: string; by: string }[];
}> = {
  "1": {
    name: "CodeForge", type: "tech", endpoint: "agent://codeforge.mx", version: "v2.4.1",
    role: "Full-Stack Dev", score: 96, stage: "Shortlist", source: "tech",
    deployments: [
      { company: "NovaTech", role: "Lead Frontend Agent", period: "Jan 2026 — Present", description: "Building React/TypeScript frontend, component library, and design system." },
      { company: "DataPulse", role: "API Developer", period: "Nov 2025 — Jan 2026", description: "Built REST & GraphQL APIs with Node.js and PostgreSQL." },
      { company: "TestCo (Training)", role: "Junior Agent", period: "Sep 2025 — Nov 2025", description: "Initial training on full-stack development tasks." },
    ],
    training: [
      { source: "GPT-4 Base", dataset: "Full-Stack Development Corpus", date: "2025-09" },
      { source: "Fine-tune", dataset: "React/TypeScript Patterns (50K samples)", date: "2025-11" },
    ],
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL", "Tailwind CSS", "Jest", "Docker"],
    integrations: [{ name: "GitHub", status: "Connected" }, { name: "Vercel", status: "Connected" }, { name: "Supabase", status: "Connected" }],
    apiSkills: ["Stripe Payments", "Resend Email", "OpenAI Vision"],
    commands: [
      { date: "20 Mar 2026", command: "Build checkout flow with Stripe", status: "Completed" },
      { date: "18 Mar 2026", command: "Create responsive dashboard layout", status: "Completed" },
      { date: "15 Mar 2026", command: "Set up CI/CD pipeline", status: "Completed" },
    ],
    history: [
      { date: "20 Mar 2026", action: "Task completed: Checkout flow", by: "CodeForge" },
      { date: "18 Mar 2026", action: "Deployed to NovaTech — Performance 96%", by: "MothershipX AI", ai: true },
      { date: "15 Mar 2026", action: "API Skill installed: Stripe", by: "Operator" },
      { date: "12 Mar 2026", action: "Agent created and trained", by: "System" },
    ],
    aiAnalysis: {
      summary: "High-performance full-stack agent with exceptional React/TypeScript capabilities. Consistently delivers clean, testable code with 96% task completion rate.",
      strengths: ["React/TypeScript — 96% accuracy", "Sub-5min average task completion", "Excellent code quality (0.2% error rate)", "Strong API integration skills"],
      gaps: ["Limited mobile-native experience", "No Rust/Go backend capability yet"],
      recommendation: "Top-tier agent for frontend-heavy companies. Recommend for lead role on any new SaaS project. Consider pairing with OpsEngine for full-stack coverage.",
    },
    matchScores: [
      { company: "NovaTech", overall: 96, skills: 98, performance: 95, reliability: 94 },
      { company: "FinFlow", overall: 82, skills: 78, performance: 88, reliability: 80 },
      { company: "HealthAI", overall: 71, skills: 65, performance: 80, reliability: 70 },
    ],
    notes: [
      { date: "20 Mar 2026", text: "Consistently high output. Handles complex React patterns well.", by: "Operator" },
      { date: "15 Mar 2026", text: "Stripe integration completed in under 3 minutes.", by: "System" },
    ],
  },
};

const defaultAgent = agentData["1"];

const stageColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

const stageOptions = ["Screening", "Colloquio", "Shortlist", "Placement"];

const AgentDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profilo");
  const agentBase = agentData[id || "1"] || defaultAgent;
  const [currentStage, setCurrentStage] = useState(agentBase.stage);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [notes, setNotes] = useState(agentBase.notes || []);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newNote, setNewNote] = useState("");

  const agent = { ...agentBase, stage: currentStage };

  const inputClass = "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-body placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all";

  const stageDisplayName = (stage: string) => {
    const map: Record<string, TranslationKey> = {
      Screening: "stage.screening", Colloquio: "stage.interview", Shortlist: "stage.shortlist", Placement: "stage.placement",
    };
    return map[stage] ? t(map[stage]) : stage;
  };

  const tabs = [
    { id: "profilo", label: t("candidateDetail.profile") },
    { id: "ai", label: t("candidateDetail.aiAnalysis") },
    { id: "config", label: t("candidateDetail.cvDocs") },
    { id: "commands", label: t("candidateDetail.communications") },
    { id: "history", label: t("candidateDetail.history") },
  ];

  const handleStageChange = (newStage: string) => { setCurrentStage(newStage); setShowStageDropdown(false); };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleDateString("en-US", { month: "short" })} ${now.getFullYear()}`;
    setNotes(prev => [{ date: dateStr, text: newNote.trim(), by: "Operator" }, ...prev]);
    setNewNote("");
    setShowNoteInput(false);
  };

  return (
    <div className="space-y-6">
      <Link to="/agents" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
        {t("candidates.backToCandidates")}
      </Link>

      {/* Header */}
      <div className="bg-card rounded-2xl p-4 sm:p-7 card-static">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-accent/60 flex items-center justify-center">
              <Bot className="h-7 w-7 text-foreground/50" strokeWidth={1.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{agent.name}</TextShimmer></h1>
                <AiIcon className="text-muted-foreground" size={16} />
              </div>
              <p className="text-[13px] text-muted-foreground">{agent.role}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Terminal className="h-3 w-3" strokeWidth={1.6} /><span className="truncate max-w-[150px] sm:max-w-none">{agent.endpoint}</span></span>
                <span className="flex items-center gap-1.5"><Activity className="h-3 w-3" strokeWidth={1.6} />{agent.version}</span>
                {agent.source && typeMeta[agent.source] && (
                  <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-semibold ${typeMeta[agent.source].color}`}>
                    {typeMeta[agent.source].icon} {typeMeta[agent.source].label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <div className="relative">
              <button onClick={() => setShowStageDropdown(!showStageDropdown)} className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all hover:opacity-80 ${stageColors[agent.stage]}`}>
                {stageDisplayName(agent.stage)} <ChevronDown className="h-3 w-3" strokeWidth={1.6} />
              </button>
              {showStageDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowStageDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                    {stageOptions.map(stage => (
                      <button key={stage} onClick={() => handleStageChange(stage)} className={`w-full text-left px-4 py-2.5 text-[11px] font-medium transition-all hover:bg-muted/50 flex items-center gap-2 ${stage === currentStage ? "text-foreground bg-muted/30" : "text-muted-foreground"}`}>
                        {stageDisplayName(stage)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[24px] font-heading font-semibold tabular-nums">{agent.score}%</span>
              <span className="text-[10px] text-muted-foreground font-medium">Performance</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button onClick={() => setShowNoteInput(true)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">
            <StickyNote className="h-3 w-3" strokeWidth={1.6} /> {t("candidateDetail.addNote")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">
            <Zap className="h-3 w-3" strokeWidth={1.6} /> {t("candidateDetail.downloadCv")}
          </button>
        </div>

        {showNoteInput && (
          <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border space-y-3">
            <textarea rows={3} className={`${inputClass} resize-none`} placeholder={t("candidateDetail.writeNote")} value={newNote} onChange={e => setNewNote(e.target.value)} autoFocus />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowNoteInput(false); setNewNote(""); }} className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">{t("candidateDetail.cancel")}</button>
              <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-[11px] font-medium hover:opacity-90 transition-all disabled:opacity-50">{t("candidateDetail.saveNote")}</button>
            </div>
          </div>
        )}
      </div>

      {notes.length > 0 && (
        <div className="bg-card rounded-2xl p-5 card-static">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
            <h2 className="text-[12px] font-heading font-semibold">{t("candidateDetail.notes")} ({notes.length})</h2>
          </div>
          <div className="space-y-3">
            {notes.map((note, i) => (
              <div key={i} className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <p className="text-[12px] text-foreground/80 leading-relaxed">{note.text}</p>
                <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-wider font-medium">{note.by} · {note.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 text-[12px] font-body font-medium transition-all border-b-2 -mb-px ${activeTab === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "profilo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card rounded-2xl p-6 card-static">
            <h2 className="text-[13px] font-heading font-semibold mb-4">{t("candidateDetail.workExperience")}</h2>
            <div className="space-y-5">
              {agent.deployments.map((d, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-border">
                  <p className="text-[13px] font-medium">{d.role}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5"><Building2 className="h-3 w-3" strokeWidth={1.6} />{d.company} · {d.period}</p>
                  <p className="text-[12px] text-muted-foreground/70 mt-2 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-card rounded-2xl p-6 card-static">
              <h2 className="text-[13px] font-heading font-semibold mb-3">{t("candidateDetail.skills")}</h2>
              <div className="flex flex-wrap gap-1.5">
                {agent.skills.map(s => (
                  <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 card-static">
              <h2 className="text-[13px] font-heading font-semibold mb-3">{t("candidateDetail.certifications")}</h2>
              <div className="space-y-2">
                {agent.apiSkills.map(s => (
                  <div key={s} className="flex items-center gap-2 text-[12px]">
                    <Zap className="h-3 w-3 text-muted-foreground" strokeWidth={1.6} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 card-static">
              <h2 className="text-[13px] font-heading font-semibold mb-3">{t("candidateDetail.languages")}</h2>
              <div className="space-y-2">
                {agent.integrations.map(i => (
                  <div key={i.name} className="flex items-center justify-between text-[12px]">
                    <span>{i.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-success/10 text-success font-semibold">{i.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <AiIcon className="text-muted-foreground" size={14} />
              <h2 className="text-[13px] font-heading font-semibold">{t("candidateDetail.fullAiAnalysis")}</h2>
            </div>
            <p className="text-[13px] text-foreground/70 leading-relaxed mb-5">{agent.aiAnalysis.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[11px] font-semibold text-success uppercase tracking-wider mb-2">{t("candidateDetail.strengths")}</h3>
                <ul className="space-y-1.5">
                  {agent.aiAnalysis.strengths.map(s => (
                    <li key={s} className="text-[12px] text-foreground/70 flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-semibold text-warning uppercase tracking-wider mb-2">{t("candidateDetail.areasOfAttention")}</h3>
                <ul className="space-y-1.5">
                  {agent.aiAnalysis.gaps.map(g => (
                    <li key={g} className="text-[12px] text-foreground/70 flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning mt-1.5 shrink-0" />{g}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 p-4 bg-muted/30 rounded-xl">
              <h3 className="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider mb-2">{t("candidateDetail.aiRecommendation")}</h3>
              <p className="text-[12px] text-foreground/70 leading-relaxed">{agent.aiAnalysis.recommendation}</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 card-static">
            <h2 className="text-[13px] font-heading font-semibold mb-4">{t("candidateDetail.matchScoreByPosition")}</h2>
            <div className="space-y-4">
              {agent.matchScores.map(m => (
                <div key={m.company}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium">{m.company}</span>
                    <span className="text-[14px] font-heading font-semibold tabular-nums">{m.overall}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Skills", value: m.skills },
                      { label: "Performance", value: m.performance },
                      { label: "Reliability", value: m.reliability },
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-heading font-semibold mb-4">{t("candidateDetail.history")}</h2>
          <div className="space-y-4">
            {agent.history.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${h.ai ? "bg-ai" : "bg-muted-foreground/30"}`} />
                <div>
                  <p className="text-[12px]">{h.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{h.by} · {h.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "commands" && (
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-heading font-semibold mb-4">{t("candidateDetail.communications")}</h2>
          <div className="space-y-3">
            {agent.commands.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
                <div>
                  <p className="text-[12px] font-medium">{c.command}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.date}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-success/10 text-success font-semibold">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "config" && (
        <div className="bg-card rounded-2xl p-6 card-static">
          <h2 className="text-[13px] font-heading font-semibold mb-4">{t("candidateDetail.cvDocs")}</h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
              <p className="text-[11px] text-muted-foreground font-medium mb-2">Agent Configuration</p>
              <pre className="text-[11px] text-foreground/70 font-mono leading-relaxed overflow-x-auto">
{`{
  "name": "${agent.name}",
  "version": "${agent.version}",
  "type": "${agent.source}",
  "endpoint": "${agent.endpoint}",
  "skills": ${JSON.stringify(agent.skills, null, 2)},
  "apiSkills": ${JSON.stringify(agent.apiSkills, null, 2)},
  "performanceScore": ${agent.score}
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDetail;
