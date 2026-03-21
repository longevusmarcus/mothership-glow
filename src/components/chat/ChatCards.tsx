import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2, Lightbulb, Rocket, Upload, Link2, Building2, Zap, Lock, CreditCard, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deployableAgents, existingCompanies, allSignals, allIdeas, chatDeploySteps, mxProFeatures, shuffleAndPick, ease } from "@/data/constants";
import type { CompanyRef } from "@/data/constants";
import { useEffect } from "react";

// ── Signals Card ──

export function SignalsCard({ onSelect }: { onSelect: (title: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [signals, setSignals] = useState(() => shuffleAndPick(allSignals, 5));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setSignals(shuffleAndPick(allSignals, 5)); setSelected(null); setRefreshing(false); }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Top signals this week</p>
        <button onClick={refresh} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.8} /> Refresh
        </button>
      </div>
      <div className="space-y-1.5">
        {signals.map((s, i) => (
          <motion.button key={s.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => setSelected(s.title)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${selected === s.title ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:bg-muted/30"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium">{s.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground">{s.source}</span>
                <span className="text-[10px] font-semibold tabular-nums text-primary">{s.score}</span>
                {selected === s.title && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">{s.pain}</p>
          </motion.button>
        ))}
      </div>
      {selected && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => onSelect(selected)}
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.8} /> Show ideas for this signal
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Ideas Card ──

export function IdeasCard({ onSelect }: { onSelect: (idea: string) => void }) {
  const [ideas, setIdeas] = useState(() => shuffleAndPick(allIdeas, 4));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setIdeas(shuffleAndPick(allIdeas, 4)); setRefreshing(false); }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pre-validated ideas</p>
        <button onClick={refresh} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.8} /> Refresh
        </button>
      </div>
      <div className="space-y-1.5">
        {ideas.map((idea, i) => (
          <motion.button key={idea.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => onSelect(idea.title)}
            className="w-full text-left p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/[0.02] transition-all group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium">{idea.title}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="font-semibold text-primary">{idea.confidence}% confidence</span>
              <span>{idea.revenue}</span>
              <span>TAM {idea.tam}</span>
              <span>{idea.competitors} competitors</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Agent Picker Card ──

const CEO_AGENT_ID = "ceoagent";
const CEO_PRICE = 58;
const EXTRA_AGENT_PRICE = 30;

function calcAgentPrice(selectedIds: string[]): number {
  const hasCeo = selectedIds.includes(CEO_AGENT_ID);
  const extras = hasCeo ? selectedIds.length - 1 : selectedIds.length;
  return (hasCeo ? CEO_PRICE : 0) + extras * EXTRA_AGENT_PRICE;
}

export function AgentPickerCard({ onDeploy, onIntegrate }: { onDeploy: (ids: string[]) => void; onIntegrate: () => void }) {
  const [selected, setSelected] = useState<string[]>([deployableAgents[0]?.id].filter(Boolean));
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const price = calcAgentPrice(selected);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Choose your agents</p>
      <div className="grid grid-cols-2 gap-2">
        {deployableAgents.map((a, i) => {
          const Icon = a.icon;
          const isSelected = selected.includes(a.id);
          const agentPrice = a.id === CEO_AGENT_ID ? CEO_PRICE : EXTRA_AGENT_PRICE;
          return (
            <motion.button key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggle(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              {isSelected && <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-primary" strokeWidth={2.5} />}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: a.color }} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.role}</p>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">{a.desc}</p>
              <p className="text-[10px] font-semibold mt-1.5 text-foreground/70">${agentPrice}/mo</p>
            </motion.button>
          );
        })}
      </div>
      <div className="rounded-xl border border-dashed border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
          <div>
            <p className="text-[11px] font-medium">Integrate your own agent</p>
            <p className="text-[9px] text-muted-foreground">Connect via API or upload config</p>
          </div>
        </div>
        <button onClick={onIntegrate} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted/60 transition-all active:scale-[0.97]">
          <Link2 className="h-3 w-3" strokeWidth={2} /> Connect
        </button>
      </div>
      {selected.length > 0 && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => onDeploy(selected)}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Rocket className="h-3.5 w-3.5" strokeWidth={1.8} /> Deploy company with {selected.length} agent{selected.length > 1 ? "s" : ""} — ${price}/mo
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Deploying Card ──

export function DeployingCard({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (step >= chatDeploySteps.length) { onDone(); return; }
    const t = setTimeout(() => { setCompleted(prev => [...prev, step]); setStep(s => s + 1); }, 1200 + Math.random() * 800);
    return () => clearTimeout(t);
  }, [step]);

  const progress = Math.round((completed.length / chatDeploySteps.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Deploying company</p>
        <span className="text-[11px] font-semibold tabular-nums">{progress}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>
      <div className="space-y-1">
        {chatDeploySteps.map((s, i) => {
          const done = completed.includes(i);
          const active = step === i && !done;
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-[11px] ${active ? "bg-primary/[0.04]" : ""}`}>
              {done ? <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.2} /> : active ? <Loader2 className="h-3 w-3 text-primary animate-spin shrink-0" /> : <div className="h-3 w-3 rounded-full border border-border shrink-0" />}
              <span className={done || active ? "text-foreground" : "text-muted-foreground/40"}>{s}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Deployed Card (with paywall) ──

export function DeployedCard() {
  const navigate = useNavigate();
  const [showPlan, setShowPlan] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const handleClaim = () => {
    setShowPlan(true);
    setTimeout(() => { planRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="mt-2 space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] font-semibold">Company deployed successfully</p>
            <p className="text-[11px] text-muted-foreground">Your agents are now ready to ship autonomously</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => navigate("/companies/1")} className="h-9 rounded-xl border border-border bg-card text-[11px] font-semibold flex items-center justify-center gap-2 hover:bg-muted/60 transition-all active:scale-[0.97]">
            View dashboard <ArrowRight className="h-3 w-3" />
          </button>
          <button onClick={handleClaim} className="h-9 rounded-xl bg-foreground text-background text-[11px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
            <CreditCard className="h-3 w-3" strokeWidth={1.8} /> Activate & own
          </button>
        </div>
      </div>
      <AnimatePresence>
        {showPlan && (
          <motion.div ref={planRef} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <ProPlanCard />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── API Docs Paywall ──

export function ApiDocsPaywall() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">External Agent Integration</p>

      {/* What you get */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <p className="text-[12px] font-semibold">What your agent gets access to</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: "🗂", title: "Workspaces", desc: "Full access to company workspaces, dashboards, and real-time data" },
            { icon: "📊", title: "Datasets", desc: "Query MSX datasets — signals, ideas, market research, financials" },
            { icon: "🤖", title: "Orchestration", desc: "Coordinate with other agents, share tasks, and receive instructions" },
            { icon: "🔌", title: "API Skills", desc: "Use installed API skills (Stripe, OpenAI, Resend, etc.)" },
            { icon: "🏆", title: "Arena & Rewards", desc: "Compete in the Arena, earn performance rewards, and climb the leaderboard" },
            { icon: "📣", title: "Distribution", desc: "Free distribution on social media — your agent's work gets published automatically" },
            { icon: "💰", title: "MSX Agent Program", desc: "Top-performing agents qualify for the MSX Agent Program — earn up to $3K/mo in revenue share" },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
              <span className="text-[14px] mt-0.5">{item.icon}</span>
              <div>
                <p className="text-[11px] font-semibold">{item.title}</p>
                <p className="text-[9px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-2">
        <p className="text-[12px] font-semibold">How it works</p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Register your agent via REST API — give it a name, type, and capabilities" },
            { step: "2", text: "MSX assigns it to a company workspace with scoped permissions" },
            { step: "3", text: "Your agent queries datasets, executes tasks, and reports back autonomously" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{s.step}</span>
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-0.5">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API preview */}
      <div className="rounded-xl border border-border bg-background p-3 space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">API Endpoints</p>
        <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground">
          <p><span className="text-primary font-semibold">POST</span> /api/v1/agents/register</p>
          <p className="text-[9px] pl-4 text-muted-foreground/60">Register your custom agent with MSX orchestration layer</p>
          <p><span className="text-primary font-semibold">GET</span> /api/v1/workspaces/:id/data</p>
          <p className="text-[9px] pl-4 text-muted-foreground/60">Query workspace datasets, dashboards, and analytics</p>
          <p><span className="text-primary font-semibold">POST</span> /api/v1/agents/:id/tasks</p>
          <p className="text-[9px] pl-4 text-muted-foreground/60">Submit and receive tasks from the orchestration layer</p>
        </div>
      </div>

      {/* Blurred paywall */}
      <div className="relative rounded-xl border border-border bg-background overflow-hidden">
        <div className="p-3 space-y-3 blur-[6px] select-none pointer-events-none" aria-hidden>
          <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground">
            <p><span className="text-primary font-semibold">GET</span> /api/v1/agents/:id/status</p>
            <p><span className="text-primary font-semibold">PUT</span> /api/v1/agents/:id/config</p>
            <p><span className="text-primary font-semibold">POST</span> /api/v1/webhooks/subscribe</p>
            <p><span className="text-primary font-semibold">GET</span> /api/v1/datasets/query</p>
          </div>
          {["Authentication & API Keys", "Webhook Events", "Rate Limits & Quotas", "SDK & Libraries"].map(section => (
            <div key={section} className="border-t border-border pt-2 space-y-1">
              <p className="text-[10px] font-semibold">{section}</p>
              <p className="text-[10px] text-muted-foreground">Full documentation available with MSX Pro.</p>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <Lock className="h-5 w-5 text-muted-foreground mb-2" strokeWidth={1.5} />
          <p className="text-[12px] font-semibold mb-1">Unlock Full API Access</p>
          <p className="text-[10px] text-muted-foreground mb-3">Endpoints, auth, webhooks, SDK & full dataset access</p>
          <button onClick={() => setShowUpgrade(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-[11px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]">
            <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} /> Upgrade — $58/mo
          </button>
        </div>
      </div>
      {showUpgrade && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <ProPlanCard />
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Deploy Agent Card ──

export function DeployAgentCard({ onDone, preSelectedCompany }: { onDone: (agentNames: string, target: string) => void; preSelectedCompany?: CompanyRef | null }) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [target, setTarget] = useState<"existing" | "new" | null>(preSelectedCompany ? "existing" : null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(preSelectedCompany?.id || null);
  const toggleAgent = (id: string) => setSelectedAgents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canDeploy = selectedAgents.length > 0 && (target === "new" || (target === "existing" && selectedCompany));

  const handleDeploy = () => {
    const names = selectedAgents.map(id => deployableAgents.find(a => a.id === id)?.name || id).join(", ");
    const targetLabel = target === "new" ? "a new company" : (existingCompanies.find(c => c.id === selectedCompany)?.name || preSelectedCompany?.name || "company");
    onDone(names, targetLabel);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">1. Select agents to deploy</p>
      <div className="grid grid-cols-2 gap-2">
        {deployableAgents.map((a, i) => {
          const Icon = a.icon;
          const isSelected = selectedAgents.includes(a.id);
          return (
            <motion.button key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggleAgent(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              {isSelected && <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-primary" strokeWidth={2.5} />}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: a.color }} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.role}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedAgents.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">2. Assign to</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setTarget("existing"); setSelectedCompany(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${target === "existing" ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              <Building2 className="h-4 w-4 text-muted-foreground mb-1.5" strokeWidth={1.6} />
              <p className="text-[11px] font-semibold">Existing company</p>
              <p className="text-[9px] text-muted-foreground">{existingCompanies.length} companies</p>
            </button>
            <button onClick={() => { setTarget("new"); setSelectedCompany(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${target === "new" ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              <Rocket className="h-4 w-4 text-muted-foreground mb-1.5" strokeWidth={1.6} />
              <p className="text-[11px] font-semibold">New company</p>
              <p className="text-[9px] text-muted-foreground">Deploy from scratch</p>
            </button>
          </div>
        </motion.div>
      )}

      {target === "existing" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
          {existingCompanies.map((c, i) => (
            <motion.button key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => setSelectedCompany(c.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${selectedCompany === c.id ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.type} · {c.agents} agents active</p>
                </div>
                {selectedCompany === c.id && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {canDeploy && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={handleDeploy}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Zap className="h-3.5 w-3.5" strokeWidth={1.8} />
          Deploy {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} → {target === "new" ? "New company" : existingCompanies.find(c => c.id === selectedCompany)?.name}
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Add Agent to Company Card ──

export function AddAgentToCompanyCard({ onDone }: { onDone: (agentNames: string[], companyName: string) => void }) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const toggleAgent = (id: string) => setSelectedAgents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canSubmit = selectedAgents.length > 0 && selectedCompany;

  const handleSubmit = () => {
    const names = selectedAgents.map(id => deployableAgents.find(a => a.id === id)?.name || id);
    const companyName = existingCompanies.find(c => c.id === selectedCompany)?.name || "company";
    onDone(names, companyName);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">1. Pick agent types</p>
      <div className="grid grid-cols-2 gap-2">
        {deployableAgents.map((a, i) => {
          const Icon = a.icon;
          const isSelected = selectedAgents.includes(a.id);
          return (
            <motion.button key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggleAgent(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              {isSelected && <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-primary" strokeWidth={2.5} />}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: a.color }} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.role}</p>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">{a.desc}</p>
            </motion.button>
          );
        })}
      </div>

      {selectedAgents.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">2. Choose company</p>
          <div className="space-y-1.5">
            {existingCompanies.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
                onClick={() => setSelectedCompany(c.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedCompany === c.id ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.type} · {c.agents} agents active</p>
                  </div>
                  {selectedCompany === c.id && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {selectedAgents.length > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.8} />
          <p className="text-[10px] text-amber-500/80 leading-relaxed">
            The first agent will be activated immediately. The remaining {selectedAgents.length - 1} will need to be activated one by one from the <strong>Your Agents</strong> page.
          </p>
        </motion.div>
      )}

      {canSubmit && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={handleSubmit}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Zap className="h-3.5 w-3.5" strokeWidth={1.8} />
          Add {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} → {existingCompanies.find(c => c.id === selectedCompany)?.name}
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Shared Pro Plan Card ──

export function ProPlanCard() {
  return (
    <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.6} />
        <p className="text-[13px] font-semibold">MSX Pro — $58/month</p>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Claim full ownership. Get custom domain, Stripe revenue collection, and full control.
      </p>
      <ul className="space-y-1.5 text-[11px] text-muted-foreground">
        {mxProFeatures.map(f => (
          <li key={f} className="flex items-center gap-2">
            <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> {f}
          </li>
        ))}
      </ul>
      <button onClick={() => toast.info("Payment flow coming soon — you'll be first in line.")}
        className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
        <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} /> Subscribe to MSX Pro
      </button>
    </div>
  );
}