import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Rocket, Zap, Building2, PlugZap, Bot, BarChart3, Radio, Lightbulb, ChevronRight, Check, Upload, Link2, Code, TrendingUp, Brain, Database, ArrowRight, Sparkles, Lock, CreditCard, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { TranslationKey } from "@/i18n/translations";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: "show_signals" | "show_ideas" | "pick_agent" | "deploying" | "deployed" | "show_api_docs" | "deploy_agent_flow";
}

const responseKeys: TranslationKey[] = [
  "chat.response.1", "chat.response.2", "chat.response.3", "chat.response.4", "chat.response.5",
];

// Large signal pool — shuffled on refresh
const allSignals = [
  { title: "Invoice automation for freelancers", source: "TikTok", score: 94, pain: "Manual process wastes 6+ hours per week" },
  { title: "AI meal prep for dietary restrictions", source: "Reddit", score: 91, pain: "No personalized solution exists at scale" },
  { title: "Contractor payment splitting", source: "Twitter/X", score: 88, pain: "Financial coordination causes conflicts" },
  { title: "Subscription fatigue manager", source: "ProductHunt", score: 86, pain: "Average user overspends $200+/mo unknowingly" },
  { title: "AI resume screening for SMBs", source: "LinkedIn", score: 84, pain: "Small teams can't afford enterprise solutions" },
  { title: "Pet telehealth platform", source: "Reddit", score: 82, pain: "Rural pet owners drive 2+ hours for vet visits" },
  { title: "Creator royalty tracker", source: "Twitter/X", score: 80, pain: "Musicians lose 30% of earnings to bad accounting" },
  { title: "Micro-SaaS for HOA management", source: "Facebook", score: 79, pain: "HOAs still use spreadsheets and paper" },
  { title: "AI-powered lease review", source: "TikTok", score: 77, pain: "Tenants sign unfair leases without legal help" },
  { title: "Inventory forecasting for DTC brands", source: "Shopify", score: 75, pain: "Overstock/understock costs 15-25% of revenue" },
  { title: "Automated GDPR compliance checker", source: "HackerNews", score: 73, pain: "SMBs can't afford compliance consultants" },
  { title: "AI fitness coach for seniors", source: "Reddit", score: 71, pain: "Generic fitness apps ignore age-related needs" },
  { title: "Freelancer tax estimator", source: "Twitter/X", score: 90, pain: "Quarterly taxes surprise 80% of freelancers" },
  { title: "AI customer support for Shopify", source: "ProductHunt", score: 87, pain: "Small stores can't afford 24/7 support agents" },
  { title: "Niche job board aggregator", source: "LinkedIn", score: 83, pain: "Specialized roles are buried on general platforms" },
];

// Large ideas pool
const allIdeas = [
  { title: "SplitPay — Contractor payment automation", revenue: "$4.2K MRR proven", tam: "$2.1B", competitors: 3, confidence: 92 },
  { title: "MealMind — AI dietary meal planner", revenue: "$1.8K MRR proven", tam: "$890M", competitors: 7, confidence: 87 },
  { title: "InvoiceFlow — Freelancer billing autopilot", revenue: "$6.1K MRR proven", tam: "$3.4B", competitors: 5, confidence: 95 },
  { title: "SubTrack — Subscription spend optimizer", revenue: "$2.3K MRR proven", tam: "$1.2B", competitors: 4, confidence: 83 },
  { title: "PetVet — Telehealth for pets", revenue: "$3.1K MRR proven", tam: "$1.8B", competitors: 2, confidence: 89 },
  { title: "RoyaltyAI — Creator earnings tracker", revenue: "$1.5K MRR proven", tam: "$670M", competitors: 3, confidence: 81 },
  { title: "HOAHub — Community management SaaS", revenue: "$2.8K MRR proven", tam: "$950M", competitors: 6, confidence: 78 },
  { title: "LeaseGuard — AI lease review tool", revenue: "$900 MRR proven", tam: "$1.4B", competitors: 2, confidence: 85 },
  { title: "StockSense — DTC inventory forecaster", revenue: "$5.4K MRR proven", tam: "$2.7B", competitors: 4, confidence: 91 },
  { title: "TaxPilot — Freelancer tax automation", revenue: "$7.2K MRR proven", tam: "$4.1B", competitors: 8, confidence: 93 },
  { title: "SupportBot — AI support for Shopify", revenue: "$3.6K MRR proven", tam: "$2.3B", competitors: 5, confidence: 88 },
  { title: "NicheJobs — Specialized job aggregator", revenue: "$1.1K MRR proven", tam: "$560M", competitors: 3, confidence: 76 },
];

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const agents = [
  { id: "codeforge", name: "CodeForge", role: "Full-Stack Builder", icon: Code, color: "hsl(var(--chart-1))", desc: "Builds MVPs end-to-end. Deploys landing pages, backends, and payment flows." },
  { id: "growthpilot", name: "GrowthPilot", role: "Growth & Distribution", icon: TrendingUp, color: "hsl(var(--chart-2))", desc: "Sets up acquisition channels and runs traction experiments." },
  { id: "visionarch", name: "VisionArch", role: "Product Strategist", icon: Brain, color: "hsl(var(--chart-3))", desc: "Synthesizes ideas into a coherent product strategy." },
  { id: "dataweaver", name: "DataWeaver", role: "Data & Integrations", icon: Database, color: "hsl(var(--chart-4))", desc: "Connects APIs and builds automated pipelines." },
];

const deploySteps = [
  "Analyzing selected signals & ideas...",
  "Generating business model & pricing...",
  "Designing tech architecture...",
  "Building landing page...",
  "Setting up backend & payments...",
  "Running pre-launch checks...",
  "Deploying to production...",
];

const ease = [0.16, 1, 0.3, 1] as const;

// ---------- Inline card components rendered inside chat ----------

function SignalsCard({ onSelect }: { onSelect: (title: string) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [signals, setSignals] = useState(() => shuffleAndPick(allSignals, 5));
  const [refreshing, setRefreshing] = useState(false);
  const toggle = (t: string) => setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setSignals(shuffleAndPick(allSignals, 5));
      setSelected([]);
      setRefreshing(false);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Top signals this week</p>
        <button onClick={refresh} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.8} />
          Refresh
        </button>
      </div>
      <div className="space-y-1.5">
        {signals.map((s, i) => (
          <motion.button
            key={s.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => toggle(s.title)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${
              selected.includes(s.title) ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium">{s.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground">{s.source}</span>
                <span className="text-[10px] font-semibold tabular-nums text-primary">{s.score}</span>
                {selected.includes(s.title) && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">{s.pain}</p>
          </motion.button>
        ))}
      </div>
      {selected.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onSelect(selected.join(", "))}
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]"
        >
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.8} />
          Show ideas for {selected.length} signal{selected.length > 1 ? "s" : ""}
        </motion.button>
      )}
    </motion.div>
  );
}

function IdeasCard({ onSelect }: { onSelect: (idea: string) => void }) {
  const [ideas, setIdeas] = useState(() => shuffleAndPick(allIdeas, 4));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setIdeas(shuffleAndPick(allIdeas, 4));
      setRefreshing(false);
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pre-validated ideas</p>
        <button onClick={refresh} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.8} />
          Refresh
        </button>
      </div>
      <div className="space-y-1.5">
        {ideas.map((idea, i) => (
          <motion.button
            key={idea.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => onSelect(idea.title)}
            className="w-full text-left p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/[0.02] transition-all group"
          >
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

function AgentPickerCard({ onDeploy, onIntegrate }: { onDeploy: (ids: string[]) => void; onIntegrate: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Choose your agents</p>
      <div className="grid grid-cols-2 gap-2">
        {agents.map((a, i) => {
          const Icon = a.icon;
          const isSelected = selected.includes(a.id);
          return (
            <motion.button
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggle(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${
                isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"
              }`}
            >
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
            </motion.button>
          );
        })}
      </div>

      {/* Integrate own agent */}
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
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onDeploy(selected)}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]"
        >
          <Rocket className="h-3.5 w-3.5" strokeWidth={1.8} />
          Deploy company with {selected.length} agent{selected.length > 1 ? "s" : ""}
        </motion.button>
      )}
    </motion.div>
  );
}

function DeployingCard({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (step >= deploySteps.length) { onDone(); return; }
    const t = setTimeout(() => {
      setCompleted(prev => [...prev, step]);
      setStep(s => s + 1);
    }, 1200 + Math.random() * 800);
    return () => clearTimeout(t);
  }, [step]);

  const progress = Math.round((completed.length / deploySteps.length) * 100);

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
        {deploySteps.map((s, i) => {
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

function DeployedCard() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="mt-2">
      <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] font-semibold">Company deployed successfully</p>
            <p className="text-[11px] text-muted-foreground">Your agents are now building autonomously</p>
          </div>
        </div>
        <button onClick={() => navigate("/companies/1")} className="w-full h-9 rounded-xl border border-border bg-card text-[11px] font-semibold flex items-center justify-center gap-2 hover:bg-muted/60 transition-all active:scale-[0.97]">
          View company dashboard <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

function ApiDocsPaywall() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">REST API Access</p>

      {/* Visible preview */}
      <div className="rounded-xl border border-border bg-background p-3 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <span className="text-primary font-semibold">POST</span> /api/v1/agents/register
        </div>
        <p className="text-[10px] text-muted-foreground">Register your custom agent with MSX orchestration layer.</p>
      </div>

      {/* Blurred content */}
      <div className="relative rounded-xl border border-border bg-background overflow-hidden">
        <div className="p-3 space-y-3 blur-[6px] select-none pointer-events-none" aria-hidden>
          <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground">
            <p><span className="text-primary font-semibold">GET</span> /api/v1/agents/:id/status</p>
            <p><span className="text-primary font-semibold">POST</span> /api/v1/agents/:id/tasks</p>
            <p><span className="text-primary font-semibold">PUT</span> /api/v1/agents/:id/config</p>
            <p><span className="text-primary font-semibold">DELETE</span> /api/v1/agents/:id</p>
          </div>
          <div className="border-t border-border pt-2 space-y-1">
            <p className="text-[10px] font-semibold">Authentication</p>
            <p className="text-[10px] text-muted-foreground">Bearer token via X-MSX-Key header. Generate keys in Settings → API.</p>
          </div>
          <div className="border-t border-border pt-2 space-y-1">
            <p className="text-[10px] font-semibold">Webhook Events</p>
            <p className="text-[10px] text-muted-foreground">agent.task.completed, agent.error, agent.deployed — configure in Settings → Webhooks.</p>
          </div>
          <div className="border-t border-border pt-2 space-y-1">
            <p className="text-[10px] font-semibold">Rate Limits</p>
            <p className="text-[10px] text-muted-foreground">1,000 req/min per agent. Burst up to 2,500. Contact us for enterprise limits.</p>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <Lock className="h-5 w-5 text-muted-foreground mb-2" strokeWidth={1.5} />
          <p className="text-[12px] font-semibold mb-1">Unlock Full API Access</p>
          <p className="text-[10px] text-muted-foreground mb-3">Endpoints, auth, webhooks & SDK</p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-[11px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]"
          >
            <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} />
            Upgrade — $58/mo
          </button>
        </div>
      </div>

      {showUpgrade && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.6} />
            <p className="text-[13px] font-semibold">MSX Pro — $58/month</p>
          </div>
          <ul className="space-y-1.5 text-[11px] text-muted-foreground">
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> Full REST API access & SDK</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> Custom agent integration</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> Webhook event streaming</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> Priority agent orchestration</li>
            <li className="flex items-center gap-2"><Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> Claim & own deployed companies</li>
          </ul>
          <button
            onClick={() => toast.info("Payment flow coming soon — you'll be first in line.")}
            className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]"
          >
            Subscribe to MSX Pro
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Mock existing companies
const existingCompanies = [
  { id: "1", name: "NovaTech", type: "SaaS B2B", agents: 4 },
  { id: "novapay", name: "NovaPay", type: "SaaS B2B", agents: 2 },
  { id: "mealmind", name: "MealMind", type: "Consumer App", agents: 1 },
  { id: "splitpay", name: "SplitPay", type: "Fintech", agents: 3 },
];

function DeployAgentCard({ onDone, preSelectedCompany }: { onDone: (agentNames: string, target: string) => void; preSelectedCompany?: { id: string; name: string; type: string; agents: number } | null }) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [target, setTarget] = useState<"existing" | "new" | null>(preSelectedCompany ? "existing" : null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(preSelectedCompany?.id || null);
  const toggleAgent = (id: string) => setSelectedAgents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canDeploy = selectedAgents.length > 0 && (target === "new" || (target === "existing" && selectedCompany));

  const handleDeploy = () => {
    const names = selectedAgents.map(id => agents.find(a => a.id === id)?.name || id).join(", ");
    const targetLabel = target === "new" ? "a new company" : (existingCompanies.find(c => c.id === selectedCompany)?.name || preSelectedCompany?.name || "company");
    onDone(names, targetLabel);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      {/* Step 1: Pick agents */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">1. Select agents to deploy</p>
      <div className="grid grid-cols-2 gap-2">
        {agents.map((a, i) => {
          const Icon = a.icon;
          const isSelected = selectedAgents.includes(a.id);
          return (
            <motion.button
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggleAgent(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${
                isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"
              }`}
            >
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

      {/* Step 2: Choose target */}
      {selectedAgents.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">2. Assign to</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setTarget("existing"); setSelectedCompany(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${target === "existing" ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}
            >
              <Building2 className="h-4 w-4 text-muted-foreground mb-1.5" strokeWidth={1.6} />
              <p className="text-[11px] font-semibold">Existing company</p>
              <p className="text-[9px] text-muted-foreground">{existingCompanies.length} companies</p>
            </button>
            <button
              onClick={() => { setTarget("new"); setSelectedCompany(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${target === "new" ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}
            >
              <Rocket className="h-4 w-4 text-muted-foreground mb-1.5" strokeWidth={1.6} />
              <p className="text-[11px] font-semibold">New company</p>
              <p className="text-[9px] text-muted-foreground">Deploy from scratch</p>
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2b: Pick existing company */}
      {target === "existing" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
          {existingCompanies.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              onClick={() => setSelectedCompany(c.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedCompany === c.id ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"
              }`}
            >
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

      {/* Deploy button */}
      {canDeploy && (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleDeploy}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]"
        >
          <Zap className="h-3.5 w-3.5" strokeWidth={1.8} />
          Deploy {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} → {target === "new" ? "New company" : existingCompanies.find(c => c.id === selectedCompany)?.name}
        </motion.button>
      )}
    </motion.div>
  );
}

// ---------- Main Chat component ----------

const quickActions = [
  { icon: Rocket, label: "Deploy a company", labelIt: "Deploya un'azienda", prompt: "I want to deploy a new company" },
  { icon: Zap, label: "Deploy agent", labelIt: "Deploya agente", prompt: "I want to deploy an agent to a company" },
  { icon: Radio, label: "Browse signals", labelIt: "Sfoglia segnali", prompt: "Show me the top market signals this week" },
  { icon: Lightbulb, label: "Explore ideas", labelIt: "Esplora idee", prompt: "Show me pre-validated business ideas" },
  { icon: Bot, label: "Agent types", labelIt: "Tipi di agente", prompt: "Show me all available agent types and their capabilities" },
  { icon: PlugZap, label: "Integrate my agent", labelIt: "Integra il mio agente", prompt: "I want to integrate my own agent" },
  { icon: BarChart3, label: "Performance report", labelIt: "Report performance", prompt: "Give me a performance report across all agents and companies" },
];

const Chat = () => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [deployToCompany, setDeployToCompany] = useState<{ id: string; name: string; type: string; agents: number } | null>(null);
  const hasAutoTriggered = useRef(false);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Auto-trigger deploy agent flow when navigating from a company
  useEffect(() => {
    const state = location.state as { deployToCompany?: { id: string; name: string; type: string; agents: number } } | null;
    if (state?.deployToCompany && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      setDeployToCompany(state.deployToCompany);
      // Clear the state so refresh doesn't re-trigger
      window.history.replaceState({}, document.title);
      // Auto-send the deploy message
      setTimeout(() => {
        const company = state.deployToCompany!;
        const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: `Deploy agents to ${company.name}`, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setTimeout(() => {
          addAssistant(`Let's deploy agents to ${company.name} (${company.type}). Pick which agents you want to activate — they'll be assigned directly to ${company.name}.`, "deploy_agent_flow");
        }, 800);
      }, 300);
    }
  }, [location.state]);

  const addAssistant = (content: string, action?: ChatMessage["action"]) => {
    const msg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content, timestamp: new Date(), action };
    setMessages(prev => [...prev, msg]);
    setIsLoading(false);
  };

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const lower = message.toLowerCase();

    // Deploy flow triggers
    if (lower.includes("deploy") && (lower.includes("company") || lower.includes("azienda"))) {
      setTimeout(() => addAssistant("Let's build something. First, here are the strongest market signals I've found this week — pick the ones that resonate with you.", "show_signals"), 800);
      return;
    }

    if (lower.includes("signal")) {
      setTimeout(() => addAssistant("Here are the top-scoring signals from TikTok, Reddit, Twitter/X and 10 other sources. Select the ones you want to build on.", "show_signals"), 800);
      return;
    }

    if (lower.includes("idea")) {
      setTimeout(() => addAssistant("These ideas are pre-validated with revenue proof, TAM estimates, and competitor analysis. Pick one to deploy.", "show_ideas"), 800);
      return;
    }

    if (lower.includes("deploy") && lower.includes("agent") && (lower.includes("company") || lower.includes("assign") || !lower.includes("azienda"))) {
      setTimeout(() => addAssistant("Let's deploy your agents. Pick which agents you want to activate and where to assign them — an existing company or a brand new one.", "deploy_agent_flow"), 800);
      return;
    }

    if (lower.includes("integrate") && lower.includes("agent")) {
      setTimeout(() => addAssistant("Let's get your agent connected. Choose from our agents or integrate your own — you can mix both.", "pick_agent"), 800);
      return;
    }

    // Generic response
    setTimeout(() => {
      const key = responseKeys[Math.floor(Math.random() * responseKeys.length)];
      addAssistant(t(key));
    }, 1000 + Math.random() * 800);
  };

  // Flow handlers
  const handleSignalsSelected = (selectedSignals: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: `Selected signals: ${selectedSignals}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setTimeout(() => addAssistant("Great picks. Based on those signals, here are the strongest validated ideas with revenue proof. Choose one to build.", "show_ideas"), 900);
  };

  const handleIdeaSelected = (idea: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: `Build: ${idea}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setTimeout(() => addAssistant(`Solid choice — "${idea}" has strong market validation. Now pick the agents that will build it, or integrate your own.`, "pick_agent"), 900);
  };

  const handleDeploy = (agentIds: string[]) => {
    const names = agentIds.map(id => agents.find(a => a.id === id)?.name || id).join(", ");
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: `Deploy with: ${names}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => addAssistant(`Deploying your company with ${names}. Agents are taking over now...`, "deploying"), 600);
  };

  const handleDeployDone = () => {
    addAssistant("Your company is live. Agents are now working autonomously — check the dashboard for real-time updates.", "deployed");
  };

  const handleDeployAgentDone = (agentNames: string, target: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: `Deploy ${agentNames} → ${target}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => addAssistant(`Deploying ${agentNames} to ${target}. Agents are spinning up now...`, "deploying"), 600);
  };

  const handleIntegrate = () => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: "I want to integrate my own agent", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setTimeout(() => addAssistant("Here's everything you need to connect your agent via REST API. Unlock full access with the MSX Pro plan.", "show_api_docs"), 800);
  };

  const isEmpty = messages.length === 0;

  // Render interactive cards inside messages
  const renderMessageExtras = (msg: ChatMessage) => {
    switch (msg.action) {
      case "show_signals": return <SignalsCard onSelect={handleSignalsSelected} />;
      case "show_ideas": return <IdeasCard onSelect={handleIdeaSelected} />;
      case "pick_agent": return <AgentPickerCard onDeploy={handleDeploy} onIntegrate={handleIntegrate} />;
      case "deploying": return <DeployingCard onDone={handleDeployDone} />;
      case "deployed": return <DeployedCard />;
      case "show_api_docs": return <ApiDocsPaywall />;
      case "deploy_agent_flow": return <DeployAgentCard onDone={handleDeployAgentDone} preSelectedCompany={deployToCompany} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] max-w-2xl mx-auto">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight mb-1">
            <TextShimmer as="span" duration={2.5}>{t("chat.assistantTitle")}</TextShimmer>
          </h1>
          <p className="text-[12px] text-muted-foreground mb-8 text-center max-w-sm">
            {locale === "it"
              ? "Scopri segnali, esplora idee, deploya aziende — tutto in chat"
              : "Surface signals, explore ideas, deploy companies — all from chat"}
          </p>

          <div className="w-full max-w-lg">
            <PromptInputBox placeholder={t("chat.placeholder")} onSend={handleSend} isLoading={isLoading} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/15 hover:bg-muted/30 transition-all active:scale-[0.97]"
              >
                <action.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                {locale === "it" ? action.labelIt : action.label}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pb-4">
            <div className="space-y-1 pt-4">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className={`flex gap-3 px-2 py-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <AiIcon size={16} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className={`${msg.action ? "max-w-[90%]" : "max-w-[80%]"} rounded-2xl px-4 py-3 text-[13px] font-mono leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                      {msg.content}
                      {renderMessageExtras(msg)}
                      <p className={`text-[10px] mt-2 ${msg.role === "user" ? "text-primary-foreground/50" : "text-muted-foreground/50"}`}>
                        {msg.timestamp.toLocaleTimeString(locale === "en" ? "en-US" : "it-IT", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 px-2 py-3">
                  <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <AiIcon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                    <span className="text-[12px] text-muted-foreground font-mono">{t("chat.thinking")}</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="shrink-0 pb-2">
            <PromptInputBox placeholder={t("chat.placeholder")} onSend={handleSend} isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
