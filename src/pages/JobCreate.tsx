import { ArrowLeft, Bot, Brain, Code, Loader2, Rocket, Zap, Check, Radio, TrendingUp, Lightbulb, Database, Globe, ChevronRight, Plus, AlertCircle, Upload, Link2 } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Agent = {
  id: string; name: string; role: string; icon: any; color: string; desc: string;
  status: "available" | "busy";
  busyOn?: string;
};

const agents: Agent[] = [
  { id: "codeforge", name: "CodeForge", role: "Full-Stack Builder", icon: Code, color: "hsl(var(--chart-1))", desc: "Builds MVPs end-to-end from signals. Deploys landing pages, backends, and payment flows autonomously.", status: "available" },
  { id: "growthpilot", name: "GrowthPilot", role: "Growth & Distribution", icon: TrendingUp, color: "hsl(var(--chart-2))", desc: "Analyzes market signals, sets up acquisition channels, and runs initial traction experiments.", status: "available" },
  { id: "visionarch", name: "VisionArch", role: "Product Strategist", icon: Brain, color: "hsl(var(--chart-3))", desc: "Synthesizes ideas and signals into a coherent product strategy with roadmap and positioning.", status: "busy", busyOn: "NovaTech" },
  { id: "dataweaver", name: "DataWeaver", role: "Data & Integrations", icon: Database, color: "hsl(var(--chart-4))", desc: "Connects APIs, scrapes data sources, and builds automated pipelines from signal databases.", status: "available" },
];

type DeployStep = { label: string; detail: string; duration: number; agentId?: string };

const deploySteps: DeployStep[] = [
  { label: "Scanning signals database", detail: "Analyzing 847 market signals from last 30 days...", duration: 2200 },
  { label: "Cross-referencing ideas", detail: "Matching 750 validated ideas with current trends...", duration: 1800 },
  { label: "Generating business model", detail: "Building revenue model, pricing, and unit economics...", duration: 2400 },
  { label: "Designing tech architecture", detail: "Selecting stack: React, Supabase, Stripe, Resend...", duration: 1600 },
  { label: "Creating landing page", detail: "Deploying hero, features, pricing sections...", duration: 2000 },
  { label: "Setting up backend", detail: "Provisioning database, auth, and API routes...", duration: 1800 },
  { label: "Configuring payments", detail: "Integrating Stripe checkout and billing portal...", duration: 1400 },
  { label: "Running pre-launch checks", detail: "Testing flows, performance, and security...", duration: 1200 },
  { label: "Deploying to production", detail: "Publishing to global CDN with SSL...", duration: 1600 },
];

const CompanyCreate = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [step, setStep] = useState<"select" | "deploying" | "done">("select");
  const [currentDeployStep, setCurrentDeployStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedCompany, setGeneratedCompany] = useState<{ name: string; type: string; market: string; mrr: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleAgent = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent?.status === "busy") {
      toast.error(`${agent.name} is busy on ${agent.busyOn}. Spawn a new instance instead.`);
      return;
    }
    setSelectedAgents(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const spawnNewAgent = (baseAgent: Agent) => {
    toast.success(`New ${baseAgent.name} instance spawned and selected!`);
    const newId = `${baseAgent.id}-new-${Date.now()}`;
    setSelectedAgents(prev => [...prev, newId]);
  };

  const startDeploy = () => {
    if (selectedAgents.length === 0) return;
    setStep("deploying");
    setCurrentDeployStep(0);
    setCompletedSteps([]);
    runStep(0);
  };

  const runStep = (idx: number) => {
    if (idx >= deploySteps.length) {
      setGeneratedCompany({ name: "NovaPay", type: "SaaS B2B", market: "EU / Global", mrr: "$2,400" });
      setStep("done");
      toast.success("Company deployed autonomously!");
      return;
    }
    setCurrentDeployStep(idx);
    timerRef.current = setTimeout(() => {
      setCompletedSteps(prev => [...prev, idx]);
      runStep(idx + 1);
    }, deploySteps[idx].duration);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const selectedAgentObjects = agents.filter(a => selectedAgents.some(id => id.startsWith(a.id)));
  const progress = step === "done" ? 100 : step === "deploying" ? Math.round((completedSteps.length / deploySteps.length) * 100) : 0;

  const agentNames = selectedAgentObjects.map(a => a.name).join(", ");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-pixel">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("jobs.backToJobs")}
      </Link>

      <div>
        <h1 className="text-[26px] font-heading font-semibold tracking-tight">
          <TextShimmer as="span" duration={2.5}>{t("jobCreate.title")}</TextShimmer>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1 font-pixel">Select one or more agents to autonomously build your next company</p>
      </div>

      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div key="select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="space-y-4">
            {/* Agent cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr">
              {agents.map(a => {
                const Icon = a.icon;
                const isBusy = a.status === "busy";
                const selected = selectedAgents.some(id => id.startsWith(a.id));
                return (
                  <div key={a.id} className="relative pb-2">
                    <button onClick={() => toggleAgent(a.id)}
                      className={`relative w-full h-full text-left p-5 rounded-2xl border transition-all duration-200 group ${
                        isBusy
                          ? "border-border/60 bg-muted/30 opacity-70"
                          : selected
                            ? "border-primary/40 bg-primary/[0.04] shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.15)]"
                            : "border-border bg-card hover:border-border/80 hover:shadow-[0_2px_8px_-4px_hsl(var(--foreground)/0.06)]"
                      }`}>
                      {selected && !isBusy && <div className="absolute top-3 right-3"><Check className="h-4 w-4 text-primary" strokeWidth={2} /></div>}
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
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{a.role}</span>
                          </div>
                          <p className="text-[11.5px] text-muted-foreground mt-1.5 leading-relaxed">{a.desc}</p>
                          {isBusy && (
                            <p className="text-[10px] text-amber-500/80 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" strokeWidth={1.8} />
                              Working on {a.busyOn}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                    {/* Spawn new instance button for busy agents */}
                    {isBusy && (
                      <button onClick={() => spawnNewAgent(a)}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-xl text-[10px] font-semibold text-foreground hover:bg-muted transition-all shadow-sm active:scale-[0.97]">
                        <Plus className="h-3 w-3" strokeWidth={2} />
                        Spawn new instance
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
                  <p className="text-[11px] text-muted-foreground">Connect a custom agent via API, webhook, or upload a config</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.info("API integration coming soon — your agents will decide what to build.")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-[11px] font-semibold text-foreground hover:bg-muted/60 transition-all active:scale-[0.97]"
                >
                  <Link2 className="h-3 w-3" strokeWidth={2} />
                  Connect via API
                </button>
                <button
                  onClick={() => toast.info("Config upload coming soon — bring your own agent logic.")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-[11px] font-semibold text-foreground hover:bg-muted/60 transition-all active:scale-[0.97]"
                >
                  <Upload className="h-3 w-3" strokeWidth={2} />
                  Upload config
                </button>
              </div>
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
                  <p className="text-[10px] text-muted-foreground truncate">{agentNames}</p>
                </div>
              </motion.div>
            )}

            {/* Data sources */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">Data sources agents will use</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Radio, label: "Signals", count: "847", sub: "last 30 days" },
                  { icon: Lightbulb, label: "Ideas", count: "750", sub: "validated" },
                  { icon: Globe, label: "Markets", count: "12", sub: "tracked" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <s.icon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[15px] font-semibold text-foreground tabular-nums">{s.count}</span>
                        <span className="text-[10px] text-muted-foreground">{s.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deploy button */}
            <div className="flex justify-end gap-2.5 pt-2">
              <Link to="/companies" className="px-4 py-2.5 text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">{t("jobCreate.cancel")}</Link>
              <button onClick={startDeploy} disabled={selectedAgents.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97]">
                <Rocket className="h-3.5 w-3.5" strokeWidth={1.8} />
                Deploy with {selectedAgents.length} agent{selectedAgents.length !== 1 ? "s" : ""}
              </button>
            </div>
          </motion.div>
        )}

        {step === "deploying" && (
          <motion.div key="deploying" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="space-y-5">
            {/* Agents header */}
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

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="text-foreground font-semibold tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {deploySteps.map((s, i) => {
                const done = completedSteps.includes(i);
                const active = currentDeployStep === i && !done;
                // Assign steps to agents round-robin
                const assignedAgent = selectedAgentObjects[i % selectedAgentObjects.length];
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${active ? "bg-primary/[0.03]" : ""}`}>
                    <div className="shrink-0">
                      {done ? <Check className="h-4 w-4 text-primary" strokeWidth={2.2} /> : active ? <Loader2 className="h-4 w-4 text-primary animate-spin" /> : <div className="h-4 w-4 rounded-full border border-border" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-[12px] font-medium ${done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground/50"}`}>{s.label}</p>
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
          <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-5">
            {/* Success header */}
            <div className="flex items-center gap-3 p-5 rounded-2xl border border-primary/25 bg-primary/[0.04]">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-foreground">Company deployed successfully</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} built everything from 847 signals and 750 validated ideas</p>
              </div>
            </div>

            {/* Agents that worked */}
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

            {/* Generated company summary */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[18px] font-bold text-primary">N</div>
                <div>
                  <h2 className="text-[18px] font-heading font-semibold text-foreground">{generatedCompany.name}</h2>
                  <p className="text-[12px] text-muted-foreground">{generatedCompany.type} · {generatedCompany.market}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Status", value: "Live", color: "text-emerald-500" },
                  { label: "Projected MRR", value: generatedCompany.mrr, color: "text-foreground" },
                  { label: "Pages deployed", value: "7", color: "text-foreground" },
                  { label: "APIs connected", value: "4", color: "text-foreground" },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl bg-muted/40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</p>
                    <p className={`text-[15px] font-semibold tabular-nums mt-0.5 ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">What was deployed</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["Landing page with pricing", "Stripe checkout integration", "User auth & onboarding", "Admin dashboard", "Email sequences via Resend", "Analytics & event tracking", "REST API + webhooks"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5">
              <button onClick={() => { setStep("select"); setSelectedAgents([]); setGeneratedCompany(null); }}
                className="px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                Deploy another
              </button>
              <button onClick={() => navigate("/companies/1")}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]">
                Open company <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyCreate;
