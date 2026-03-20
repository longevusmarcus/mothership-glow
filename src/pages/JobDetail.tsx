import { ArrowLeft, Globe, Clock, Bot, Building2, Edit, Archive, Target, Rocket, MessageSquare, CheckCircle2, ExternalLink, Send, Loader2, Eye } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const companyData: Record<string, {
  title: string; department: string; location: string; type: string; status: string;
  description: string; stack: string[]; stage: string; budget: string;
  agents: { id: number; name: string; type: string; score: number; status: string; tasks: number }[];
  daysActive: number;
  aiSummary: string;
}> = {
  "1": {
    title: "NovaTech", department: "SaaS B2B", location: "Global",
    type: "MVP", status: "Attiva", stage: "MVP", budget: "$2,400/mo",
    description: "AI-powered project management platform for remote teams. Features include real-time collaboration, AI task prioritization, automated sprint planning, and team analytics.",
    stack: ["React/TypeScript", "Node.js", "Supabase", "Stripe", "Vercel", "OpenAI API"],
    agents: [
      { id: 1, name: "CodeForge", type: "Tech", score: 96, status: "Active", tasks: 47 },
      { id: 2, name: "GrowthPilot", type: "Growth", score: 91, status: "Active", tasks: 23 },
      { id: 6, name: "MarketBot", type: "Growth", score: 88, status: "Active", tasks: 15 },
      { id: 3, name: "DesignMind", type: "Creative", score: 87, status: "Deployed", tasks: 31 },
    ],
    daysActive: 23,
    aiSummary: "NovaTech is progressing well toward MVP launch. CodeForge has completed 47 tasks including the core dashboard, real-time collaboration features, and Stripe integration. GrowthPilot is building the landing page and setting up analytics. Estimated MVP completion: 5 days.",
  },
};

const defaultCompany = companyData["1"];

const taskLog = [
  { agent: "CodeForge", task: "Implemented real-time collaboration WebSocket layer", time: "2h ago", status: "done" as const },
  { agent: "CodeForge", task: "Integrated Stripe checkout + subscription management", time: "5h ago", status: "done" as const },
  { agent: "GrowthPilot", task: "Landing page v2 with A/B test variants", time: "8h ago", status: "done" as const },
  { agent: "DesignMind", task: "Dashboard UI redesign — dark mode + responsive", time: "1d ago", status: "done" as const },
  { agent: "MarketBot", task: "SEO meta tags + Open Graph for all pages", time: "1d ago", status: "done" as const },
  { agent: "CodeForge", task: "Setting up CI/CD pipeline with GitHub Actions", time: "now", status: "in_progress" as const },
  { agent: "GrowthPilot", task: "Google Analytics 4 + conversion tracking", time: "now", status: "in_progress" as const },
];

const deployPreviews = [
  { name: "Dashboard v3.2", url: "novatech-dash.vercel.app", agent: "CodeForge", time: "2h ago", status: "live" },
  { name: "Landing Page v2", url: "novatech.com", agent: "GrowthPilot", time: "8h ago", status: "live" },
  { name: "Onboarding Flow", url: "novatech-onboard.vercel.app", agent: "DesignMind", time: "1d ago", status: "preview" },
];

interface ChatMsg {
  id: string;
  role: "user" | "agent";
  agent?: string;
  content: string;
  time: string;
}

const initialChat: ChatMsg[] = [
  { id: "1", role: "agent", agent: "CodeForge", content: "Stripe integration is live. Checkout, subscription management, and webhook handlers are all deployed. Running e2e tests now.", time: "2h ago" },
  { id: "2", role: "agent", agent: "GrowthPilot", content: "Landing page v2 is deployed with two A/B variants. Tracking is set up — we'll have data in 48h.", time: "1h ago" },
  { id: "3", role: "agent", agent: "DesignMind", content: "Dashboard dark mode is complete. Also fixed responsive issues on tablet. Preview link is ready for review.", time: "45m ago" },
];

const agentResponses = [
  "Got it — I'll start working on that right away. Should have an update within the hour.",
  "Understood. Let me analyze the current state and propose a plan before executing.",
  "On it. I'll coordinate with the other agents to avoid any conflicts.",
  "Good call. I'll prioritize this and push a preview once it's ready for review.",
];

function CompanyChat({ companyName }: { companyName: string }) {
  const [messages, setMessages] = useState<ChatMsg[]>(initialChat);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content: input, time: "now" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const agents = ["CodeForge", "GrowthPilot", "DesignMind", "MarketBot"];
      const resp: ChatMsg = {
        id: crypto.randomUUID(),
        role: "agent",
        agent: agents[Math.floor(Math.random() * agents.length)],
        content: agentResponses[Math.floor(Math.random() * agentResponses.length)],
        time: "just now",
      };
      setMessages(prev => [...prev, resp]);
      setIsLoading(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "agent" && (
              <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.4} />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-3 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border"}`}>
              {msg.role === "agent" && (
                <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">{msg.agent}</p>
              )}
              <p className="text-[12px] leading-relaxed">{msg.content}</p>
              <p className={`text-[9px] mt-1 ${msg.role === "user" ? "text-primary-foreground/40" : "text-muted-foreground/40"}`}>{msg.time}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.4} />
            </div>
            <div className="bg-muted/50 border border-border rounded-xl px-3 py-2 flex items-center gap-2">
              <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
              <span className="text-[11px] text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="px-4 pb-3 pt-2 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Message your agents..."
            className="flex-1 bg-muted/50 border-0 rounded-xl px-3 py-2 text-[12px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-border"
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-[0.95] disabled:opacity-40">
            <Send className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}

const CompanyDetail = () => {
  const { id } = useParams();
  const { t, locale } = useLanguage();
  const company = companyData[id || "1"] || defaultCompany;
  const [activePanel, setActivePanel] = useState<"chat" | "tasks" | "deploys">("chat");

  return (
    <div className="space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("jobs.backToJobs")}
      </Link>

      {/* Header */}
      <div className="bg-card rounded-2xl p-4 sm:p-7 card-static">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-[18px] sm:text-[22px] font-mondwest font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{company.title}</TextShimmer></h1>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${company.status === "Attiva" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {company.status === "Attiva" ? t("jobs.active") : t("jobs.paused")}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider">{company.department} · {company.type}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" strokeWidth={1.6} />{company.location}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" strokeWidth={1.6} />{company.stage}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" strokeWidth={1.6} />{company.daysActive}d active</span>
              <span className="flex items-center gap-1.5"><Bot className="h-3 w-3" strokeWidth={1.6} />{company.agents.length} agents</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/chat" className="flex items-center gap-2 px-3.5 py-2 bg-foreground text-background rounded-xl text-[11px] font-body font-medium hover:opacity-90 active:scale-[0.97] transition-all">
              <Rocket className="h-3 w-3" strokeWidth={1.6} /> Deploy Agent
            </Link>
            <button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-[11px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">
              <Edit className="h-3 w-3" strokeWidth={1.6} /> {t("jobs.edit")}
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Tasks Done", value: company.agents.reduce((s, a) => s + a.tasks, 0).toString(), trend: "+24 this week" },
          { label: "Deploys", value: "12", trend: "3 today" },
          { label: "Budget Used", value: company.budget, trend: "67% of cap" },
          { label: "Revenue", value: "$4,820", trend: "+$1,200 this month" },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl p-4 card-static">
            <p className="text-[22px] font-mondwest font-semibold tracking-tight leading-none tabular-nums">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">{stat.label}</p>
            <p className="text-[9px] text-muted-foreground/50 mt-0.5">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main panel — tabbed: Chat / Tasks / Deploys */}
        <div className="lg:col-span-2 bg-card rounded-2xl card-static overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex items-center border-b border-border">
            {([
              { id: "chat" as const, label: "Agent Chat", icon: MessageSquare },
              { id: "tasks" as const, label: "Task Log", icon: CheckCircle2 },
              { id: "deploys" as const, label: "Deploy Previews", icon: Eye },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-[12px] font-medium transition-all border-b-2 ${
                  activePanel === tab.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                {tab.label}
              </button>
            ))}
          </div>

          {activePanel === "chat" && <CompanyChat companyName={company.title} />}

          {activePanel === "tasks" && (
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {taskLog.map((task, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="px-5 py-3.5 flex items-start gap-3">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${task.status === "done" ? "bg-success/10" : "bg-primary/10"}`}>
                    {task.status === "done"
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-success" strokeWidth={1.6} />
                      : <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" strokeWidth={1.6} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium leading-snug">{task.task}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground font-medium">{task.agent}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">{task.time}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-lg font-semibold shrink-0 ${task.status === "done" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                    {task.status === "done" ? "Done" : "In Progress"}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {activePanel === "deploys" && (
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {deployPreviews.map((deploy, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="px-5 py-4 flex items-center gap-4">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${deploy.status === "live" ? "bg-success/10" : "bg-muted"}`}>
                    <Globe className={`h-4 w-4 ${deploy.status === "live" ? "text-success" : "text-muted-foreground"}`} strokeWidth={1.4} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium">{deploy.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-medium">{deploy.agent}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">{deploy.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] px-2 py-0.5 rounded-lg font-semibold ${deploy.status === "live" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {deploy.status === "live" ? "Live" : "Preview"}
                    </span>
                    <a href={`https://${deploy.url}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* AI Summary */}
          <div className="rounded-2xl p-5 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
              <h2 className="text-[12px] font-mondwest font-semibold text-foreground/80">AI Summary</h2>
            </div>
            <p className="text-[11px] text-foreground/70 leading-relaxed">{company.aiSummary}</p>
          </div>

          {/* Agents */}
          <div className="bg-card rounded-2xl card-static overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="text-[13px] font-mondwest font-semibold">Agents ({company.agents.length})</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-lg font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border flex items-center gap-1"><AiIcon size={10} /> Live</span>
            </div>
            <div className="divide-y divide-border">
              {company.agents.map(a => (
                <Link key={a.id} to={`/agents/${a.id}`} className="px-5 py-3 hover:bg-muted/20 transition-all block">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/60 flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5 text-foreground/50" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.type} · {a.tasks} tasks</p>
                    </div>
                    <span className="text-[13px] font-mondwest font-semibold tabular-nums">{a.score}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-card rounded-2xl p-5 card-static">
            <h2 className="text-[13px] font-mondwest font-semibold mb-3">Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {company.stack.map(s => (
                <span key={s} className="text-[10px] px-2.5 py-1 bg-muted text-muted-foreground rounded-lg font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-card rounded-2xl p-5 card-static">
            <h2 className="text-[13px] font-mondwest font-semibold mb-3">{t("jobs.details")}</h2>
            <div className="space-y-2.5 text-[12px]">
              {[
                ["Stage", company.stage],
                ["Type", company.type],
                ["Budget", company.budget],
                ["Location", company.location],
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
    </div>
  );
};

export default CompanyDetail;
