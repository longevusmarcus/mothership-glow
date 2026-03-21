import { ArrowLeft, Bot, Loader2, Rocket, Zap, Check, Radio, Lightbulb, Globe, Plus, AlertCircle, Upload, Link2, Lock, CreditCard } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { createAgents, companyDeploySteps, ease } from "@/data/constants";
import type { CreateAgent } from "@/data/constants";
import { ProPlanCard, SignalsCard, IdeasCard } from "@/components/chat/ChatCards";

function ClaimCompanyPaywall({ onDeployAnother }: { onDeployAnother: () => void }) {
  const [showPlan, setShowPlan] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const handleClaim = () => {
    setShowPlan(true);
    setTimeout(() => { planRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
  };

  return (
    <div className="space-y-3">
      {!showPlan ? (
        <div className="flex justify-end gap-2.5">
          <button onClick={onDeployAnother} className="px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            Deploy another
          </button>
          <button onClick={handleClaim} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.8} /> Claim company & agent
          </button>
        </div>
      ) : (
        <motion.div ref={planRef} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <ProPlanCard />
          <button onClick={onDeployAnother} className="w-full mt-2 px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors text-center">
            Deploy another instead
          </button>
        </motion.div>
      )}
    </div>
  );
}

const CompanyCreate = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([createAgents[0].id]);
  const [agentName, setAgentName] = useState(createAgents[0].name);
  const [step, setStep] = useState<"select" | "deploying" | "done">("select");
  const [scanStep, setScanStep] = useState<"signals" | "ideas" | "ready">("signals");
  const [selectedSignals, setSelectedSignals] = useState<string>("");
  const [selectedIdea, setSelectedIdea] = useState<string>("");
  const [currentDeployStep, setCurrentDeployStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedCompany, setGeneratedCompany] = useState<{ name: string; type: string; market: string; mrr: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const coreAgentId = createAgents[0].id;

  const toggleAgent = (id: string) => {
    if (id === coreAgentId) return; // core agent is compulsory
    const agent = createAgents.find(a => a.id === id);
    if (agent?.status === "busy") {
      toast.error(`${agent.name} is busy on ${agent.busyOn}. Spawn a new instance instead.`);
      return;
    }
    setSelectedAgents(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const spawnNewAgent = (a: CreateAgent) => {
    toast.success(`New ${a.name} instance spawned and selected!`);
    setSelectedAgents(prev => [...prev, `${a.id}-new-${Date.now()}`]);
  };

  const startDeploy = () => {
    if (selectedAgents.length === 0) return;
    setStep("deploying");
    setCurrentDeployStep(0);
    setCompletedSteps([]);
    runStep(0);
  };

  const runStep = (idx: number) => {
    if (idx >= companyDeploySteps.length) {
      setGeneratedCompany({ name: "NovaPay", type: "SaaS B2B", market: "EU / Global", mrr: "$2,400" });
      setStep("done");
      toast.success("Company deployed autonomously!", { duration: 3000 });
      return;
    }
    setCurrentDeployStep(idx);
    timerRef.current = setTimeout(() => {
      setCompletedSteps(prev => [...prev, idx]);
      runStep(idx + 1);
    }, companyDeploySteps[idx].duration);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const selectedAgentObjects = createAgents.filter(a => selectedAgents.some(id => id.startsWith(a.id)));
  const progress = step === "done" ? 100 : step === "deploying" ? Math.round((completedSteps.length / companyDeploySteps.length) * 100) : 0;
  const agentNames = selectedAgentObjects.map(a => a.name).join(", ");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-pixel">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("companies.backToJobs")}
      </Link>

      <div>
        <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight">
          <TextShimmer as="span" duration={2.5}>{t("companyCreate.title")}</TextShimmer>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1 font-mono">Select one or more agents to autonomously build your next company</p>
      </div>

      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div key="select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr">
              {createAgents.map(a => {
                const Icon = a.icon;
                const isBusy = a.status === "busy";
                const isCore = a.id === coreAgentId;
                const selected = selectedAgents.some(id => id.startsWith(a.id));
                return (
                  <div key={a.id} className="relative pb-2">
                    <button onClick={() => toggleAgent(a.id)}
                      className={`relative w-full h-full text-left p-5 rounded-2xl border transition-all duration-200 group ${
                        isCore ? "border-primary/40 bg-primary/[0.04] shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.15)] cursor-default"
                        : isBusy ? "border-border/60 bg-muted/30 opacity-70"
                        : selected ? "border-primary/40 bg-primary/[0.04] shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.15)]"
                        : "border-border bg-card hover:border-border/80 hover:shadow-[0_2px_8px_-4px_hsl(var(--foreground)/0.06)]"
                      }`}>
                      {isCore && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">Required</span>
                          <Check className="h-4 w-4 text-primary" strokeWidth={2} />
                        </div>
                      )}
                      {!isCore && selected && !isBusy && <div className="absolute top-3 right-3"><Check className="h-4 w-4 text-primary" strokeWidth={2} /></div>}
                      {isBusy && (
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                          </span>
                          <span className="text-[9px] font-semibold text-amber-500">Busy</span>
                        </div>
                      )}
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${a.color}15` }}>
                          <Icon className="h-4.5 w-4.5" style={{ color: a.color }} strokeWidth={1.6} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold text-foreground">{a.name}</span>
                            <span className="text-[10px] font-pixel text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{a.role}</span>
                          </div>
                          <p className="text-[11.5px] text-muted-foreground mt-1.5 leading-relaxed font-mono">{a.desc}</p>
                          {isBusy && (
                            <p className="text-[10px] text-amber-500/80 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" strokeWidth={1.8} /> Working on {a.busyOn}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                    {isBusy && (
                      <button onClick={() => spawnNewAgent(a)}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-[10px] font-pixel font-semibold text-foreground hover:bg-muted transition-all shadow-sm active:scale-[0.97]">
                        <Plus className="h-3 w-3" strokeWidth={2} /> Spawn new instance
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Integrate your own agent */}
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center">
                  <Upload className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Integrate your own agent</p>
                  <p className="text-[11px] text-muted-foreground font-mono">Connect a custom agent via API, webhook, or upload a config</p>
                </div>
              </div>
              <button onClick={() => toast.info("API integration coming soon — your agents will decide what to build.")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-[11px] font-pixel font-semibold text-foreground hover:bg-muted/60 transition-all active:scale-[0.97]">
                <Link2 className="h-3 w-3" strokeWidth={2} /> Connect via API
              </button>
            </div>

            {/* Name your coding agent */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                <p className="text-[12px] font-semibold text-foreground">Name your coding agent</p>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">Choose a custom name for your core coding agent</p>
              <input
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                placeholder="e.g. CEO Agent, BuildBot, Archon..."
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all"
              />
            </div>

            {/* Selected agents summary */}
            {selectedAgents.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {selectedAgentObjects.slice(0, 4).map(a => (
                    <div key={a.id} className="h-8 w-8 rounded-lg flex items-center justify-center border-2 border-background" style={{ background: `${a.color}20` }}>
                      <a.icon className="h-3.5 w-3.5" style={{ color: a.color }} strokeWidth={1.6} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground">{selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} selected</p>
                  <p className="text-[10px] text-muted-foreground truncate">{agentName}{selectedAgentObjects.length > 1 ? `, ${selectedAgentObjects.slice(1).map(a => a.name).join(", ")}` : ""}</p>
                </div>
              </motion.div>
            )}

            {/* Data sources */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <p className="text-[12px] font-pixel font-semibold text-muted-foreground tracking-wider uppercase">
                {scanStep === "signals" ? "Select signals to scan" : scanStep === "ideas" ? "Choose an idea to build" : "Signals & idea locked in"}
              </p>

              {scanStep === "signals" && (
                <SignalsCard onSelect={(signals) => { setSelectedSignals(signals); setScanStep("ideas"); }} />
              )}

              {scanStep === "ideas" && (
                <>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                    <Check className="h-3 w-3 text-primary" strokeWidth={2} />
                    <span className="font-medium">Signals: {selectedSignals.split(", ").length} selected</span>
                    <button onClick={() => setScanStep("signals")} className="text-primary hover:underline ml-1">Change</button>
                  </div>
                  <IdeasCard onSelect={(idea) => { setSelectedIdea(idea); setScanStep("ready"); }} />
                </>
              )}

              {scanStep === "ready" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/[0.04] border border-primary/20">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-foreground">Signals: {selectedSignals.split(", ").length} selected</p>
                      <p className="text-[10px] text-muted-foreground truncate">{selectedSignals}</p>
                    </div>
                    <button onClick={() => setScanStep("signals")} className="text-[10px] text-primary hover:underline shrink-0">Change</button>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/[0.04] border border-primary/20">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={2} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-foreground">Idea selected</p>
                      <p className="text-[10px] text-muted-foreground truncate">{selectedIdea}</p>
                    </div>
                    <button onClick={() => setScanStep("ideas")} className="text-[10px] text-primary hover:underline shrink-0">Change</button>
                  </div>
                </div>
              )}
            </div>

            {/* Deploy button */}
            <div className="flex justify-end gap-3 pt-2">
              <Link to="/companies" className="h-12 px-8 rounded-none border border-border/60 font-mono text-[12px] font-medium tracking-widest text-muted-foreground/60 flex items-center justify-center hover:text-foreground hover:border-border transition-all active:scale-[0.97] uppercase">
                cancel
              </Link>
              <button onClick={startDeploy} disabled={selectedAgents.length === 0}
                className="h-12 px-8 rounded-none bg-foreground text-background font-mono text-[12px] font-medium tracking-widest flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-[0.97] uppercase">
                deploy_{selectedAgents.length}_agent{selectedAgents.length !== 1 ? "s" : ""}
              </button>
            </div>
          </motion.div>
        )}

        {step === "deploying" && (
          <motion.div key="deploying" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }} className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/[0.03]">
              <div className="flex -space-x-2">
                {selectedAgentObjects.slice(0, 4).map(a => (
                  <div key={a.id} className="h-9 w-9 rounded-xl flex items-center justify-center border-2 border-background" style={{ background: `${a.color}20` }}>
                    <a.icon className="h-4 w-4" style={{ color: a.color }} strokeWidth={1.6} />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground">{selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} building your company</p>
                <p className="text-[11px] text-muted-foreground">Autonomous deployment in progress...</p>
              </div>
              <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="text-foreground font-semibold tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {companyDeploySteps.map((s, i) => {
                const done = completedSteps.includes(i);
                const active = currentDeployStep === i && !done;
                const assignedAgent = selectedAgentObjects[i % selectedAgentObjects.length];
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${active ? "bg-primary/[0.03]" : ""}`}>
                    <div className="shrink-0">
                      {done ? <Check className="h-4 w-4 text-primary" strokeWidth={2.2} /> : active ? <Loader2 className="h-4 w-4 text-primary animate-spin" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-[12px] font-medium ${done || active ? "text-foreground" : "text-muted-foreground/50"}`}>{s.label}</p>
                        {assignedAgent && (done || active) && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: `${assignedAgent.color}15`, color: assignedAgent.color }}>
                            {assignedAgent.name}
                          </span>
                        )}
                      </div>
                      {active && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-muted-foreground mt-0.5">{s.detail}</motion.p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === "done" && generatedCompany && (
          <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="space-y-5">
            <div className="flex items-center gap-3 p-5 rounded-2xl border border-primary/25 bg-primary/[0.04]">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">Company deployed successfully</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} built everything from 847 signals and 750 validated ideas</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedAgentObjects.map(a => (
                <div key={a.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-[11px] font-medium">
                  <div className="h-5 w-5 rounded-md flex items-center justify-center" style={{ background: `${a.color}15` }}>
                    <a.icon className="h-3 w-3" style={{ color: a.color }} strokeWidth={1.6} />
                  </div>
                  {a.name}
                  <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[18px] font-bold text-primary">N</div>
                <div>
                  <h2 className="text-[18px] font-mondwest font-semibold text-foreground">{generatedCompany.name}</h2>
                  <p className="text-[12px] text-muted-foreground">{generatedCompany.type} · {generatedCompany.market}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Status", value: "Live", color: "text-emerald-500" },
                  { label: "Projected MRR", value: generatedCompany.mrr, color: "text-foreground" },
                  { label: "Pages pre-deployed", value: "7", color: "text-foreground" },
                  { label: "APIs connected", value: "4", color: "text-foreground" },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl bg-muted/40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</p>
                    <p className={`text-[15px] font-semibold tabular-nums mt-0.5 ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">What was pre-deployed</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["Landing page with pricing", "Stripe checkout integration", "User auth & onboarding", "Admin dashboard", "Email sequences via Resend", "Analytics & event tracking", "REST API + webhooks"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ClaimCompanyPaywall onDeployAnother={() => { setStep("select"); setSelectedAgents([coreAgentId]); setAgentName(createAgents[0].name); setGeneratedCompany(null); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyCreate;