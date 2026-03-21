import { ArrowLeft, Globe, Clock, Bot, Building2, Edit, Target, Rocket, MessageSquare, CheckCircle2, ExternalLink, Loader2, Eye, FileText, Download, Send, Mail, Twitter, Megaphone } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import CompanyChat from "@/components/company/CompanyChat";

const companyData: Record<string, {
  title: string; department: string; location: string; type: string; status: string;
  description: string; stack: string[]; stage: string; budget: string;
  agents: { id: number; name: string; type: string; score: number; status: string; tasks: number; telegram?: string }[];
  daysActive: number; aiSummary: string;
}> = {
  "1": {
    title: "NovaTech", department: "SaaS B2B", location: "Global",
    type: "MVP", status: "Attiva", stage: "MVP", budget: "$2,400/mo",
    description: "AI-powered project management platform for remote teams.",
    stack: ["React/TypeScript", "Node.js", "Supabase", "Stripe", "Vercel", "OpenAI API"],
    agents: [
      { id: 1, name: "CEO Agent", type: "Tech", score: 96, status: "Active", tasks: 47, telegram: "CEOAgent_bot" },
      { id: 2, name: "GrowthPilot", type: "Growth", score: 91, status: "Active", tasks: 23, telegram: "GrowthPilot_bot" },
      { id: 6, name: "MarketBot", type: "Growth", score: 88, status: "Active", tasks: 15, telegram: "MarketBot_agent" },
      { id: 3, name: "DesignMind", type: "Creative", score: 87, status: "Deployed", tasks: 31, telegram: "DesignMind_bot" },
    ],
    daysActive: 23,
    aiSummary: "NovaTech is progressing well toward MVP launch. CEO Agent has completed 47 tasks including the core dashboard, real-time collaboration features, and Stripe integration. GrowthPilot is building the landing page and setting up analytics. Estimated MVP completion: 5 days.",
  },
};

const defaultCompany = companyData["1"];

const taskLog = [
  { agent: "CEO Agent", task: "Implemented real-time collaboration WebSocket layer", time: "2h ago", status: "done" as const },
  { agent: "CEO Agent", task: "Integrated Stripe checkout + subscription management", time: "5h ago", status: "done" as const },
  { agent: "GrowthPilot", task: "Landing page v2 with A/B test variants", time: "8h ago", status: "done" as const },
  { agent: "DesignMind", task: "Dashboard UI redesign — dark mode + responsive", time: "1d ago", status: "done" as const },
  { agent: "MarketBot", task: "SEO meta tags + Open Graph for all pages", time: "1d ago", status: "done" as const },
  { agent: "CEO Agent", task: "Setting up CI/CD pipeline with GitHub Actions", time: "now", status: "in_progress" as const },
  { agent: "GrowthPilot", task: "Google Analytics 4 + conversion tracking", time: "now", status: "in_progress" as const },
];

const companyDocuments = [
  { name: "Company Mission & Vision", type: "Mission", agent: "GrowthPilot", time: "1d ago", size: "2.4 KB", status: "final" as const },
  { name: "Market Research — SaaS PM Tools", type: "Market Research", agent: "MarketBot", time: "2d ago", size: "18.7 KB", status: "final" as const },
  { name: "Competitive Analysis Report", type: "Market Research", agent: "MarketBot", time: "3d ago", size: "12.1 KB", status: "final" as const },
  { name: "Go-To-Market Strategy v2", type: "Strategy", agent: "GrowthPilot", time: "4d ago", size: "8.3 KB", status: "draft" as const },
  { name: "Technical Architecture Doc", type: "Technical", agent: "CEO Agent", time: "5d ago", size: "6.9 KB", status: "final" as const },
  { name: "Brand Guidelines & Tone", type: "Branding", agent: "DesignMind", time: "6d ago", size: "4.1 KB", status: "final" as const },
  { name: "Revenue Model & Projections", type: "Financial", agent: "GrowthPilot", time: "1w ago", size: "9.5 KB", status: "draft" as const },
];

const deployPreviews = [
  { name: "Dashboard v3.2", url: "novatech-dash.vercel.app", agent: "CEO Agent", time: "2h ago", status: "live" },
  { name: "Landing Page v2", url: "novatech.com", agent: "GrowthPilot", time: "8h ago", status: "live" },
  { name: "Onboarding Flow", url: "novatech-onboard.vercel.app", agent: "DesignMind", time: "1d ago", status: "preview" },
];

const agentEmails = [
  { subject: "Welcome to NovaTech — Your workspace is ready", to: "new-user@gmail.com", agent: "GrowthPilot", time: "1h ago", status: "delivered" as const },
  { subject: "Your free trial ends in 3 days", to: "trial-user@company.co", agent: "GrowthPilot", time: "4h ago", status: "delivered" as const },
  { subject: "NovaTech Weekly Digest — What's new", to: "subscriber-list (847)", agent: "MarketBot", time: "1d ago", status: "delivered" as const },
  { subject: "Your invoice for March 2026", to: "paying-customer@startup.io", agent: "CEO Agent", time: "2d ago", status: "delivered" as const },
  { subject: "Re: Integration support request", to: "dev@partner.com", agent: "CEO Agent", time: "3d ago", status: "opened" as const },
];

const agentXPosts = [
  { content: "Just shipped real-time collaboration for NovaTech 🚀 Remote teams can now co-edit projects live. Try it free →", agent: "GrowthPilot", time: "2h ago", likes: 142, retweets: 38, impressions: "12.4K" },
  { content: "Why we built NovaTech: 73% of remote PMs still use spreadsheets to track projects. That's insane in 2026. Thread 🧵", agent: "MarketBot", time: "8h ago", likes: 89, retweets: 24, impressions: "8.7K" },
  { content: "NovaTech vs Notion vs Linear — honest comparison from the team that built it. No BS, just data.", agent: "MarketBot", time: "1d ago", likes: 231, retweets: 67, impressions: "24.1K" },
  { content: "Stripe integration done ✅ Subscriptions, checkout, webhooks — all handled by our AI agents in 4 hours.", agent: "CEO Agent", time: "2d ago", likes: 56, retweets: 12, impressions: "5.2K" },
];

const agentAds = [
  { name: "Google Search — 'project management tool'", platform: "Google Ads", agent: "GrowthPilot", spend: "$124", clicks: 342, ctr: "4.2%", conversions: 18, status: "active" as const },
  { name: "Meta — Remote team lookalike audience", platform: "Meta Ads", agent: "GrowthPilot", spend: "$89", clicks: 215, ctr: "3.8%", conversions: 11, status: "active" as const },
  { name: "Twitter — PM tool thread promo", platform: "X Ads", agent: "MarketBot", spend: "$45", clicks: 178, ctr: "5.1%", conversions: 7, status: "active" as const },
  { name: "LinkedIn — B2B SaaS decision makers", platform: "LinkedIn Ads", agent: "GrowthPilot", spend: "$210", clicks: 89, ctr: "2.9%", conversions: 5, status: "paused" as const },
];

const CompanyDetail = () => {
  const { id } = useParams();
  const { t, locale } = useLanguage();
  const company = companyData[id || "1"] || defaultCompany;
  const [activePanel, setActivePanel] = useState<"chat" | "tasks" | "docs" | "deploys" | "emails" | "xposts" | "ads">("chat");

  return (
    <div className="space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("companies.backToJobs")}
      </Link>

      {/* Header */}
      <div className="bg-card rounded-2xl p-4 sm:p-7 card-static">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-[22px] sm:text-[28px] font-mondwest font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{company.title}</TextShimmer></h1>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${company.status === "Attiva" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {company.status === "Attiva" ? t("companies.active") : t("companies.paused")}
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
            <Link to="/chat" state={{ deployToCompany: { id: id || "1", name: company.title, type: company.department, agents: company.agents.length } }} className="flex items-center gap-2 px-3.5 py-2 bg-foreground text-background rounded-xl text-[11px] font-mono font-medium hover:opacity-90 active:scale-[0.97] transition-all">
              <Rocket className="h-3 w-3" strokeWidth={1.6} /> Deploy Agent
            </Link>
            <button className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-[11px] font-mono font-medium text-muted-foreground hover:text-foreground transition-all">
              <Edit className="h-3 w-3" strokeWidth={1.6} /> {t("companies.edit")}
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
          <div className="flex items-center border-b border-border overflow-x-auto scrollbar-hide">
             {([
              { id: "chat" as const, label: "Orchestrator Chat", icon: MessageSquare },
              { id: "tasks" as const, label: "Task Log", icon: CheckCircle2 },
              { id: "docs" as const, label: "Docs", icon: FileText },
              { id: "emails" as const, label: "Emails", icon: Mail },
              { id: "xposts" as const, label: "X Posts", icon: Twitter },
              { id: "ads" as const, label: "Ads", icon: Megaphone },
              { id: "deploys" as const, label: "Deploys", icon: Eye },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-3.5 text-[11px] font-medium transition-all border-b-2 whitespace-nowrap shrink-0 ${
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

          {activePanel === "chat" && <CompanyChat />}

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

          {activePanel === "docs" && (
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {companyDocuments.map((doc, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="px-5 py-3.5 flex items-center gap-3 hover:bg-muted/20 transition-all">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium leading-snug truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-medium">{doc.agent}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">{doc.time}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">{doc.size}</span>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-lg font-semibold bg-muted text-muted-foreground uppercase tracking-wider">{doc.type}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-lg font-semibold shrink-0 ${doc.status === "final" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                    {doc.status === "final" ? "Final" : "Draft"}
                  </span>
                  <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <Download className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {activePanel === "emails" && (
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {agentEmails.map((email, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="px-5 py-3.5 flex items-center gap-3 hover:bg-muted/20 transition-all">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" strokeWidth={1.4} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium leading-snug truncate">{email.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-medium">{email.agent}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">to {email.to}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">{email.time}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-lg font-semibold shrink-0 ${email.status === "opened" ? "bg-accent text-accent-foreground" : "bg-success/10 text-success"}`}>
                    {email.status === "opened" ? "Opened" : "Delivered"}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {activePanel === "xposts" && (
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {agentXPosts.map((post, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="px-5 py-3.5 hover:bg-muted/20 transition-all">
                  <p className="text-[12px] leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground font-medium">{post.agent}</span>
                    <span className="text-[9px] text-muted-foreground/40">·</span>
                    <span className="text-[10px] text-muted-foreground/50">{post.time}</span>
                    <span className="text-[9px] text-muted-foreground/40">·</span>
                    <span className="text-[10px] text-muted-foreground/50">❤️ {post.likes}</span>
                    <span className="text-[10px] text-muted-foreground/50">🔁 {post.retweets}</span>
                    <span className="text-[10px] text-muted-foreground/50">👁 {post.impressions}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activePanel === "ads" && (
            <div className="divide-y divide-border flex-1 overflow-y-auto">
              {agentAds.map((ad, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="px-5 py-3.5 flex items-center gap-3 hover:bg-muted/20 transition-all">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${ad.status === "active" ? "bg-success/10" : "bg-muted"}`}>
                    <Megaphone className={`h-4 w-4 ${ad.status === "active" ? "text-success" : "text-muted-foreground"}`} strokeWidth={1.4} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium leading-snug truncate">{ad.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground font-medium">{ad.agent}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">{ad.platform}</span>
                      <span className="text-[9px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-muted-foreground/50">{ad.spend} spent</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[10px] text-muted-foreground tabular-nums">
                    <span>{ad.clicks} clicks</span>
                    <span>{ad.ctr} CTR</span>
                    <span className="font-semibold text-foreground">{ad.conversions} conv</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-lg font-semibold shrink-0 ${ad.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {ad.status === "active" ? "Active" : "Paused"}
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
                <div key={a.id} className="px-5 py-3 hover:bg-muted/20 transition-all">
                  <div className="flex items-center gap-3">
                    <Link to={`/agents/${a.id}`} className="h-8 w-8 rounded-lg bg-accent/60 flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5 text-foreground/50" strokeWidth={1.6} />
                    </Link>
                    <Link to={`/agents/${a.id}`} className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium truncate">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.type} · {a.tasks} tasks</p>
                    </Link>
                    <span className="text-[13px] font-mondwest font-semibold tabular-nums mr-2">{a.score}%</span>
                    {a.telegram && (
                      <a href={`https://t.me/${a.telegram}`} target="_blank" rel="noopener noreferrer"
                        className="h-7 w-7 rounded-lg bg-[#26A5E4]/10 flex items-center justify-center shrink-0 hover:bg-[#26A5E4]/20 transition-colors"
                        title={`Chat on Telegram`}>
                        <Send className="h-3 w-3 text-[#26A5E4]" strokeWidth={1.6} />
                      </a>
                    )}
                  </div>
                </div>
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
            <h2 className="text-[13px] font-mondwest font-semibold mb-3">{t("companies.details")}</h2>
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
