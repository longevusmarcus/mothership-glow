import {
  ArrowLeft,
  Bot,
  Loader2,
  Rocket,
  Zap,
  Check,
  Radio,
  Lightbulb,
  Globe,
  Plus,
  AlertCircle,
  Upload,
  Link2,
  Lock,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { createAgents, companyDeploySteps, ease, CEO_PRICE, EXTRA_AGENT_PRICE } from "@/data";
import { DollarSign } from "lucide-react";
import type { CreateAgent } from "@/data";
import { ProPlanCard, SignalsCard, IdeasCard, ApiDocsPaywall } from "@/components/chat";

const EXTRA_PRICE = EXTRA_AGENT_PRICE;

function StepHeader({
  number,
  title,
  done,
  active,
}: {
  number: number;
  title: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors ${
          done
            ? "bg-primary/10 text-primary"
            : active
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : number}
      </div>
      <p
        className={`text-[13px] font-semibold transition-colors ${active || done ? "text-foreground" : "text-muted-foreground/40"}`}
      >
        {title}
      </p>
    </div>
  );
}

function ClaimCompanyPaywall({ onDeployAnother, agentCount }: { onDeployAnother: () => void; agentCount: number }) {
  const [stage, setStage] = useState<"initial" | "plan" | "subscribed">("initial");
  const planRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClaim = () => {
    setStage("plan");
    setTimeout(() => {
      planRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleSubscribed = () => {
    setStage("subscribed");
  };

  return (
    <div className="space-y-3">
      {stage === "initial" && (
        <div className="flex justify-end gap-2.5">
          <button
            onClick={onDeployAnother}
            className="px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Deploy another
          </button>
          <button
            onClick={handleClaim}
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]"
          >
            <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} /> Claim
          </button>
        </div>
      )}

      <AnimatePresence>
        {stage === "plan" && (
          <motion.div ref={planRef} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <ProPlanCard onSubscribed={handleSubscribed} agentCount={agentCount} />
            <button
              onClick={onDeployAnother}
              className="w-full mt-2 px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Deploy another instead
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === "subscribed" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3 flex items-center gap-3">
              <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Subscription confirmed! Activate your company and agents to start running.
              </p>
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={onDeployAnother}
                className="px-4 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Deploy another
              </button>
              <button
                onClick={() => navigate("/agents")}
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]"
              >
                <Lock className="h-3.5 w-3.5" strokeWidth={1.8} /> Activate company & agent
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CompanyCreate = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Wizard state: 1=agents, 2=name, 3=signals, 4=ideas, 5=budget, 6=review, 7=deploying, 8=done
  const budgetTiers = [
    { label: "$50/mo", value: "50", desc: "Solo agent — lean MVP" },
    { label: "$150/mo", value: "150", desc: "Small team — 2-3 agents" },
    { label: "$500/mo", value: "500", desc: "Full stack — 5+ agents" },
    { label: "Custom", value: "custom", desc: "Set your own budget" },
  ];
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([createAgents[0].id]);
  const [agentName, setAgentName] = useState(createAgents[0].name);
  const [selectedSignals, setSelectedSignals] = useState<string>("");
  const [selectedIdea, setSelectedIdea] = useState<string>("");
  const [showIntegrate, setShowIntegrate] = useState(false);
  const [currentDeployStep, setCurrentDeployStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedCompany, setGeneratedCompany] = useState<{
    name: string;
    type: string;
    market: string;
    mrr: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const coreAgentId = createAgents[0].id;

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 150);
  };

  const toggleAgent = (id: string) => {
    if (id === coreAgentId) return;
    const agent = createAgents.find((a) => a.id === id);
    if (agent?.status === "busy") {
      toast.error(`${agent.name} is busy on ${agent.busyOn}. Spawn a new instance instead.`);
      return;
    }
    setSelectedAgents((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const spawnNewAgent = (a: CreateAgent) => {
    toast.success(`New ${a.name} instance spawned and selected!`);
    setSelectedAgents((prev) => [...prev, `${a.id}-new-${Date.now()}`]);
  };

  const calcPrice = () => {
    const hasCeo = selectedAgents.some((id) => id.startsWith(coreAgentId));
    const extras = hasCeo ? selectedAgents.length - 1 : selectedAgents.length;
    return (hasCeo ? CEO_PRICE : 0) + extras * EXTRA_PRICE;
  };

  const startDeploy = () => {
    setWizardStep(6);
    setCurrentDeployStep(0);
    setCompletedSteps([]);
    runStep(0);
  };

  const runStep = (idx: number) => {
    if (idx >= companyDeploySteps.length) {
      setGeneratedCompany({ name: "NovaPay", type: "SaaS B2B", market: "EU / Global", mrr: "$2,400" });
      setWizardStep(7);
      toast.success("Company pre-deployed successfully!", { duration: 3000 });
      return;
    }
    setCurrentDeployStep(idx);
    timerRef.current = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, idx]);
      runStep(idx + 1);
    }, companyDeploySteps[idx].duration);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const selectedAgentObjects = createAgents.filter((a) => selectedAgents.some((id) => id.startsWith(a.id)));
  const progress =
    wizardStep === 7
      ? 100
      : wizardStep === 6
        ? Math.round((completedSteps.length / companyDeploySteps.length) * 100)
        : 0;

  const advanceToStep = (next: number) => {
    setWizardStep(next);
    scrollToBottom();
  };

  const resetAll = () => {
    setWizardStep(1);
    setSelectedAgents([coreAgentId]);
    setAgentName(createAgents[0].name);
    setSelectedSignals("");
    setSelectedIdea("");
    setGeneratedCompany(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-pixel"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("companies.backToJobs")}
      </Link>

      <div>
        <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight">
          <TextShimmer as="span" duration={2.5}>
            {t("companyCreate.title")}
          </TextShimmer>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1 font-mono">
          Follow each step — the next one appears when you're ready
        </p>
      </div>

      {/* Progress bar */}
      {wizardStep <= 5 && (
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                s < wizardStep ? "bg-primary" : s === wizardStep ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {/* ─── Step 1: Select Agents ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 space-y-3"
        >
          <StepHeader number={1} title="Select your agents" done={wizardStep > 1} active={wizardStep === 1} />

          {wizardStep === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {createAgents.map((a) => {
                  const Icon = a.icon;
                  const isBusy = a.status === "busy";
                  const isCore = a.id === coreAgentId;
                  const selected = selectedAgents.some((id) => id.startsWith(a.id));
                  const price = isCore ? CEO_PRICE : EXTRA_PRICE;
                  return (
                    <div key={a.id} className="relative pb-2">
                      <button
                        onClick={() => toggleAgent(a.id)}
                        className={`relative w-full h-full text-left p-4 rounded-xl border transition-all duration-200 ${
                          isCore
                            ? "border-primary/40 bg-primary/[0.04] cursor-default"
                            : isBusy
                              ? "border-border/60 bg-muted/30 opacity-70"
                              : selected
                                ? "border-primary/40 bg-primary/[0.04]"
                                : "border-border bg-background hover:border-border/80"
                        }`}
                      >
                        {isCore && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                              Required
                            </span>
                            <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                          </div>
                        )}
                        {!isCore && selected && !isBusy && (
                          <Check className="absolute top-3 right-3 h-3.5 w-3.5 text-primary" strokeWidth={2} />
                        )}
                        {isBusy && (
                          <div className="absolute top-3 right-3 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                            </span>
                            <span className="text-[9px] font-semibold text-amber-500">Busy</span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: `${a.color}15` }}
                          >
                            <Icon className="h-4 w-4" style={{ color: a.color }} strokeWidth={1.6} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[12px] font-semibold">{a.name}</span>
                              <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                                {a.role}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{a.desc}</p>
                            <p className="text-[10px] font-semibold mt-1.5 text-foreground/70">${price}/mo</p>
                            {isBusy && (
                              <p className="text-[10px] text-amber-500/80 mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" strokeWidth={1.8} /> Working on {a.busyOn}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                      {isBusy && (
                        <button
                          onClick={() => spawnNewAgent(a)}
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 bg-card border border-border rounded-lg text-[9px] font-semibold hover:bg-muted transition-all shadow-sm active:scale-[0.97]"
                        >
                          <Plus className="h-2.5 w-2.5" strokeWidth={2} /> Spawn new
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Integrate your own */}
              <div className="rounded-xl border border-dashed border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Upload className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                    <div>
                      <p className="text-[11px] font-medium">Integrate your own agent</p>
                      <p className="text-[9px] text-muted-foreground">Connect via API or upload config</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowIntegrate((prev) => !prev)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted/60 transition-all active:scale-[0.97]"
                  >
                    <Link2 className="h-3 w-3" strokeWidth={2} /> {showIntegrate ? "Hide" : "Connect"}
                  </button>
                </div>
                <AnimatePresence>
                  {showIntegrate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <ApiDocsPaywall />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Summary + continue */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-muted-foreground">
                  {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} ·{" "}
                  <span className="font-semibold text-foreground">${calcPrice()}/mo</span>
                </p>
                <button
                  onClick={() => advanceToStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]"
                >
                  Continue <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className="flex -space-x-1.5">
                {selectedAgentObjects.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="h-6 w-6 rounded-md flex items-center justify-center border border-background"
                    style={{ background: `${a.color}20` }}
                  >
                    <a.icon className="h-3 w-3" style={{ color: a.color }} strokeWidth={1.6} />
                  </div>
                ))}
              </div>
              <span>
                {selectedAgents.length} agents · ${calcPrice()}/mo
              </span>
              {wizardStep < 6 && (
                <button onClick={() => setWizardStep(1)} className="text-primary hover:underline ml-1 text-[10px]">
                  Edit
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* ─── Step 2: Name your agent ─── */}
        {wizardStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            <StepHeader number={2} title="Name your CEO agent" done={wizardStep > 2} active={wizardStep === 2} />

            {wizardStep === 2 ? (
              <>
                <p className="text-[11px] text-muted-foreground">Choose a custom name for your core coding agent</p>
                <input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Nova, BuildBot, Archon..."
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all"
                />
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      if (!agentName.trim()) {
                        toast.error("Enter a name");
                        return;
                      }
                      advanceToStep(3);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]"
                  >
                    Continue <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Bot className="h-3.5 w-3.5" strokeWidth={1.4} />
                <span>{agentName}</span>
                {wizardStep < 6 && (
                  <button onClick={() => setWizardStep(2)} className="text-primary hover:underline ml-1 text-[10px]">
                    Edit
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Step 3: Select signals ─── */}
        {wizardStep >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            <StepHeader number={3} title="Pick a market signal" done={wizardStep > 3} active={wizardStep === 3} />

            {wizardStep === 3 ? (
              <SignalsCard
                onSelect={(s) => {
                  setSelectedSignals(s);
                  advanceToStep(4);
                }}
              />
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Radio className="h-3.5 w-3.5" strokeWidth={1.4} />
                <span className="truncate">{selectedSignals}</span>
                {wizardStep < 6 && (
                  <button
                    onClick={() => setWizardStep(3)}
                    className="text-primary hover:underline ml-1 text-[10px] shrink-0"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Step 4: Select idea ─── */}
        {wizardStep >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            <StepHeader number={4} title="Choose an idea to build" done={wizardStep > 4} active={wizardStep === 4} />

            {wizardStep === 4 ? (
              <IdeasCard
                onSelect={(idea) => {
                  setSelectedIdea(idea);
                  advanceToStep(5);
                }}
              />
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.4} />
                <span className="truncate">{selectedIdea}</span>
                {wizardStep < 6 && (
                  <button
                    onClick={() => setWizardStep(4)}
                    className="text-primary hover:underline ml-1 text-[10px] shrink-0"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Step 5: Review & Deploy ─── */}
        {wizardStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 space-y-4"
          >
            <StepHeader number={5} title="Review & deploy" done={false} active={true} />

            <div className="space-y-2">
              {[
                {
                  label: "Agents",
                  value: `${selectedAgents.length} agents (${selectedAgentObjects.map((a) => a.name).join(", ")})`,
                },
                { label: "CEO Name", value: agentName },
                { label: "Signal", value: selectedSignals },
                { label: "Idea", value: selectedIdea },
                { label: "Monthly cost", value: `$${calcPrice()}/mo` },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3 text-[11px]">
                  <span className="text-muted-foreground w-20 shrink-0 font-medium">{row.label}</span>
                  <span className="text-foreground font-medium">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                to="/companies"
                className="px-5 py-2.5 border border-border rounded-xl text-[12px] font-medium text-muted-foreground hover:text-foreground transition-all active:scale-[0.97]"
              >
                Cancel
              </Link>
              <button
                onClick={startDeploy}
                className="flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-xl text-[12px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]"
              >
                <Rocket className="h-3.5 w-3.5" strokeWidth={1.8} /> Deploy — ${calcPrice()}/mo
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── Step 6: Deploying ─── */}
        {wizardStep === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/[0.03]">
              <div className="flex -space-x-2">
                {selectedAgentObjects.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="h-9 w-9 rounded-xl flex items-center justify-center border-2 border-background"
                    style={{ background: `${a.color}20` }}
                  >
                    <a.icon className="h-4 w-4" style={{ color: a.color }} strokeWidth={1.6} />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">
                  {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} working on your company
                </p>
                <p className="text-[11px] text-muted-foreground">Autonomous pre-deployment in progress...</p>
              </div>
              <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="text-foreground font-semibold tabular-nums">{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {companyDeploySteps.map((s, i) => {
                const done = completedSteps.includes(i);
                const active = currentDeployStep === i && !done;
                const assignedAgent = selectedAgentObjects[i % selectedAgentObjects.length];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${active ? "bg-primary/[0.03]" : ""}`}
                  >
                    <div className="shrink-0">
                      {done ? (
                        <Check className="h-4 w-4 text-primary" strokeWidth={2.2} />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-[12px] font-medium ${done || active ? "text-foreground" : "text-muted-foreground/50"}`}
                        >
                          {s.label}
                        </p>
                        {assignedAgent && (done || active) && (
                          <span
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md"
                            style={{ background: `${assignedAgent.color}15`, color: assignedAgent.color }}
                          >
                            {assignedAgent.name}
                          </span>
                        )}
                      </div>
                      {active && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[11px] text-muted-foreground mt-0.5"
                        >
                          {s.detail}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── Step 7: Done ─── */}
        {wizardStep === 7 && generatedCompany && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 p-5 rounded-2xl border border-primary/25 bg-primary/[0.04]">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[15px] font-semibold">Company pre-deployed successfully</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""}{" "}
                  {selectedAgents.length > 1 ? "are" : "is"} working on one business out of 847 market signals and 750
                  validated ideas
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedAgentObjects.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-[11px] font-medium"
                >
                  <div
                    className="h-5 w-5 rounded-md flex items-center justify-center"
                    style={{ background: `${a.color}15` }}
                  >
                    <a.icon className="h-3 w-3" style={{ color: a.color }} strokeWidth={1.6} />
                  </div>
                  {a.name}
                  <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[18px] font-bold text-primary">
                  N
                </div>
                <div>
                  <h2 className="text-[18px] font-mondwest font-semibold">{generatedCompany.name}</h2>
                  <p className="text-[12px] text-muted-foreground">
                    {generatedCompany.type} · {generatedCompany.market}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Status", value: "Pre-deployed", color: "text-primary" },
                  { label: "Projected MRR", value: generatedCompany.mrr, color: "text-foreground" },
                  { label: "Pages pre-deployed", value: "7", color: "text-foreground" },
                  { label: "APIs connected", value: "4", color: "text-foreground" },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-xl bg-muted/40">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</p>
                    <p className={`text-[15px] font-semibold tabular-nums mt-0.5 ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                  In the pipeline
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Landing page with pricing",
                    "Stripe checkout integration",
                    "User auth & onboarding",
                    "Admin dashboard",
                    "Email sequences via Resend",
                    "Analytics & event tracking",
                    "REST API + webhooks",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ClaimCompanyPaywall onDeployAnother={resetAll} agentCount={selectedAgents.length} />
          </motion.div>
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default CompanyCreate;
