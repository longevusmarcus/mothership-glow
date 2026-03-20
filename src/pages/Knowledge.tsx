import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Lightbulb, FolderOpen, TrendingUp, ExternalLink, FileText, Link2, Upload, Search, Filter, Star, Clock, Flame, ChevronRight, Plus, BookOpen, Globe, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Tab = "signals" | "ideas" | "os";

const signals = [
  { id: 1, title: "Invoice automation for freelancers", source: "TikTok", views: "2.4M", sentiment: 92, trending: true, category: "FinTech", timestamp: "12m ago", pain: "Manual invoicing wastes 6h/week for solo creators" },
  { id: 2, title: "AI meal prep for dietary restrictions", source: "Reddit", views: "890K", sentiment: 87, trending: true, category: "Health", timestamp: "34m ago", pain: "People with allergies can't find personalized plans" },
  { id: 3, title: "Contractor payment splitting", source: "Twitter/X", views: "1.1M", sentiment: 78, trending: false, category: "FinTech", timestamp: "1h ago", pain: "Teams of contractors struggle with revenue splits" },
  { id: 4, title: "Pet health monitoring wearable", source: "TikTok", views: "4.7M", sentiment: 95, trending: true, category: "PetTech", timestamp: "2h ago", pain: "Pet owners miss early illness signs" },
  { id: 5, title: "Micro-SaaS for Notion power users", source: "ProductHunt", views: "340K", sentiment: 81, trending: false, category: "Productivity", timestamp: "3h ago", pain: "Notion lacks native automation triggers" },
  { id: 6, title: "AI cold email personalization", source: "LinkedIn", views: "620K", sentiment: 74, trending: true, category: "Sales", timestamp: "4h ago", pain: "Generic cold emails get <1% reply rates" },
  { id: 7, title: "Local event discovery for Gen Z", source: "TikTok", views: "3.2M", sentiment: 89, trending: true, category: "Social", timestamp: "5h ago", pain: "Young people miss local events because discovery is fragmented" },
  { id: 8, title: "Subscription fatigue manager", source: "Reddit", views: "1.5M", sentiment: 83, trending: false, category: "FinTech", timestamp: "6h ago", pain: "Average person spends $273/mo on forgotten subscriptions" },
];

const ideas = [
  { id: 1, title: "InvoiceFlow — AI invoicing for creators", signal: "Invoice automation for freelancers", tam: "$4.2B", score: 94, agents: 2, status: "validated", revenue: "$12K MRR projected", competitors: 3 },
  { id: 2, title: "AllergyChef — Personalized meal AI", signal: "AI meal prep for dietary restrictions", tam: "$8.1B", score: 89, agents: 0, status: "ready", revenue: "$8K MRR projected", competitors: 7 },
  { id: 3, title: "SplitPay — Contractor revenue sharing", signal: "Contractor payment splitting", tam: "$2.7B", score: 76, agents: 1, status: "building", revenue: "$6K MRR projected", competitors: 2 },
  { id: 4, title: "PetPulse — Wearable health tracker", signal: "Pet health monitoring wearable", tam: "$6.3B", score: 91, agents: 3, status: "validated", revenue: "$22K MRR projected", competitors: 5 },
  { id: 5, title: "NotionOps — Automation layer", signal: "Micro-SaaS for Notion power users", tam: "$1.4B", score: 72, agents: 0, status: "ready", revenue: "$4K MRR projected", competitors: 4 },
  { id: 6, title: "ColdCraft — AI outreach engine", signal: "AI cold email personalization", tam: "$3.8B", score: 85, agents: 1, status: "building", revenue: "$15K MRR projected", competitors: 12 },
];

const osItems = [
  { id: 1, type: "link" as const, title: "Stripe Atlas — best for incorporation", url: "https://stripe.com/atlas", tags: ["legal", "startup"], added: "2d ago" },
  { id: 2, type: "note" as const, title: "Focus on B2B micro-SaaS under $50/mo price point — lower churn, faster validation", tags: ["strategy", "pricing"], added: "3d ago" },
  { id: 3, type: "doc" as const, title: "Go-to-market playbook for dev tools", tags: ["gtm", "devtools"], added: "5d ago" },
  { id: 4, type: "idea" as const, title: "Build a Zapier competitor focused only on AI workflows", tags: ["idea", "automation"], added: "1w ago" },
  { id: 5, type: "link" as const, title: "Y Combinator application tips 2025", url: "https://ycombinator.com", tags: ["fundraising", "yc"], added: "1w ago" },
  { id: 6, type: "note" as const, title: "Agents perform 3x better when given market context before deployment", tags: ["agents", "performance"], added: "2w ago" },
  { id: 7, type: "doc" as const, title: "SEO audit template for SaaS landing pages", tags: ["seo", "marketing"], added: "2w ago" },
  { id: 8, type: "idea" as const, title: "White-label MothershipX for enterprise innovation teams", tags: ["enterprise", "b2b"], added: "3w ago" },
];

const tabs: { id: Tab; label: string; labelIt: string; icon: typeof Radio; count: number }[] = [
  { id: "signals", label: "Signals", labelIt: "Segnali", icon: Radio, count: signals.length },
  { id: "ideas", label: "Ideas", labelIt: "Idee", icon: Lightbulb, count: ideas.length },
  { id: "os", label: "Personal OS", labelIt: "OS Personale", icon: FolderOpen, count: osItems.length },
];

const osTypeIcon = { link: Link2, note: FileText, doc: BookOpen, idea: Sparkles };

const Knowledge = () => {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("signals");
  const [search, setSearch] = useState("");

  const filteredSignals = signals.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()));
  const filteredIdeas = ideas.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const filteredOs = osItems.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.tags.some(t => t.includes(search.toLowerCase())));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-heading font-semibold tracking-tight">
          {locale === "it" ? "Knowledge Base" : "Knowledge Base"}
        </h1>
        <p className="text-[12px] text-muted-foreground mt-1">
          {locale === "it"
            ? "Segnali di mercato, idee validate e il tuo OS personale per addestrare gli agenti"
            : "Market signals, validated ideas, and your personal OS to train agents"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
            {locale === "it" ? tab.labelIt : tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-muted text-foreground" : "bg-transparent text-muted-foreground"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
          <input
            type="text"
            placeholder={locale === "it" ? "Cerca..." : "Search..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>
        {activeTab === "os" && (
          <button className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[12px] font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors active:scale-[0.97]">
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
            {locale === "it" ? "Aggiungi" : "Add Item"}
          </button>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "signals" && (
          <motion.div
            key="signals"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {filteredSignals.map((signal, i) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {signal.trending && (
                        <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <Flame className="h-2.5 w-2.5" /> TRENDING
                        </span>
                      )}
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{signal.category}</span>
                      <span className="text-[9px] text-muted-foreground/60 flex items-center gap-1">
                        <Globe className="h-2.5 w-2.5" /> {signal.source}
                      </span>
                    </div>
                    <p className="text-[13px] font-medium leading-snug mb-1">{signal.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{signal.pain}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="text-[11px] font-medium">{signal.views} views</p>
                    <div className="flex items-center justify-end gap-1">
                      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/60" style={{ width: `${signal.sentiment}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{signal.sentiment}%</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/50 flex items-center justify-end gap-1">
                      <Clock className="h-2.5 w-2.5" /> {signal.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "ideas" && (
          <motion.div
            key="ideas"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {filteredIdeas.map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        idea.status === "validated" ? "bg-green-500/10 text-green-400"
                        : idea.status === "building" ? "bg-blue-500/10 text-blue-400"
                        : "bg-muted text-muted-foreground"
                      }`}>
                        {idea.status === "validated" ? "✓ Validated" : idea.status === "building" ? "⚡ Building" : "○ Ready"}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">from signal: {idea.signal}</span>
                    </div>
                    <p className="text-[13px] font-medium leading-snug mb-1">{idea.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-muted-foreground">TAM {idea.tam}</span>
                      <span className="text-[10px] text-muted-foreground">{idea.revenue}</span>
                      <span className="text-[10px] text-muted-foreground">{idea.competitors} competitors</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Star className="h-3 w-3 text-primary/60" strokeWidth={1.6} />
                      <span className="text-[14px] font-heading font-semibold">{idea.score}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground">
                      {idea.agents} {idea.agents === 1 ? "agent" : "agents"} assigned
                    </p>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 ml-auto group-hover:text-foreground/50 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "os" && (
          <motion.div
            key="os"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {filteredOs.map((item, i) => {
              const Icon = osTypeIcon[item.type];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium leading-snug mb-1.5">{item.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                        ))}
                        <span className="text-[9px] text-muted-foreground/40 flex items-center gap-1 ml-auto">
                          <Clock className="h-2.5 w-2.5" /> {item.added}
                        </span>
                      </div>
                    </div>
                    {item.type === "link" && (
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors shrink-0 mt-1" strokeWidth={1.4} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Knowledge;
