import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Lightbulb, FolderOpen, ExternalLink, FileText, Link2, Search, Star, Clock, Flame, ChevronRight, Plus, BookOpen, Globe, Sparkles, Database, ChevronDown, SlidersHorizontal, Bot } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Tab = "signals" | "ideas" | "os";
type SignalSource = "all" | "TikTok" | "Reddit" | "Twitter/X" | "LinkedIn" | "ProductHunt" | "YouTube" | "Quora" | "HackerNews" | "IndieHackers" | "Discord" | "Facebook" | "Google Trends" | "App Store Reviews";
type IdeaStatus = "all" | "validated" | "ready" | "building" | "launched";
type SignalCategory = "all" | "FinTech" | "Health" | "Productivity" | "Sales" | "Social" | "DevTools" | "PetTech" | "Education" | "E-commerce" | "AI/ML" | "Creator Economy" | "HR" | "Legal" | "Real Estate";

const sources: SignalSource[] = ["all", "TikTok", "Reddit", "Twitter/X", "LinkedIn", "ProductHunt", "YouTube", "Quora", "HackerNews", "IndieHackers", "Discord", "Google Trends", "App Store Reviews"];
const signalCategories: SignalCategory[] = ["all", "FinTech", "Health", "Productivity", "Sales", "Social", "DevTools", "PetTech", "Education", "E-commerce", "AI/ML", "Creator Economy", "HR", "Legal", "Real Estate"];
const ideaStatuses: IdeaStatus[] = ["all", "validated", "ready", "building", "launched"];

// Generate large-scale mock signal data (representing ~200/week feed)
function generateSignals() {
  const titles = [
    "Invoice automation for freelancers", "AI meal prep for dietary restrictions", "Contractor payment splitting",
    "Pet health monitoring wearable", "Micro-SaaS for Notion power users", "AI cold email personalization",
    "Local event discovery for Gen Z", "Subscription fatigue manager", "AI resume screening for SMBs",
    "Automated bookkeeping for Etsy sellers", "Voice-first CRM for realtors", "AI legal contract reviewer",
    "Gym buddy matching app", "AI podcast transcription + clips", "Rent splitting for roommates",
    "AI homework tutor for K-12", "Freelancer tax estimator", "AI product photography generator",
    "Micro-influencer marketplace", "Smart receipt scanner for expenses", "AI interior design visualizer",
    "Automated DMCA takedown tool", "Language learning via memes", "AI meeting notes + action items",
    "Niche job board for remote devs", "AI-powered menu translation", "Carbon footprint tracker for SMBs",
    "Creator sponsorship matchmaker", "AI customer support for Shopify", "Smart inventory alerts for DTC",
    "AI pitch deck generator", "Automated LinkedIn content scheduler", "AI SEO blog writer for niche sites",
    "Telemedicine for pets", "Budget tracker for couples", "AI-generated product descriptions",
    "Parking spot finder for cities", "Automated review response tool", "AI fashion stylist chatbot",
    "Smart price comparison engine", "Community event crowdfunding", "AI code review bot for teams",
    "Digital business card maker", "Automated waitlist + launch page", "AI workout plan generator",
    "Smart grocery list from recipes", "Freelancer contract template AI", "AI video subtitle generator",
  ];
  const pains = [
    "Manual process wastes 6+ hours per week", "No personalized solution exists at scale",
    "Teams struggle with fragmented tools", "Users miss critical early warning signs",
    "Existing tools lack key automation", "Current solutions get <1% engagement",
    "Discovery is fragmented across platforms", "Average user overspends $200+/mo unknowingly",
    "Small teams can't afford enterprise solutions", "Manual work creates costly errors",
    "No mobile-first solution for this workflow", "Legal fees are prohibitive for solopreneurs",
    "Matching is inefficient and time-consuming", "Content repurposing takes hours manually",
    "Financial coordination causes roommate conflicts", "Tutoring is expensive and hard to access",
    "Tax complexity leads to overpayment", "Professional photos cost $500+ per product",
    "Finding the right influencer takes weeks", "Expense tracking is tedious and error-prone",
  ];
  const srcList: SignalSource[] = sources.filter(s => s !== "all") as SignalSource[];
  const catList: SignalCategory[] = signalCategories.filter(s => s !== "all") as SignalCategory[];
  const timeUnits = ["m", "h", "h", "h", "h", "d", "d", "d"];

  return Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    source: srcList[i % srcList.length],
    views: `${(Math.floor(Math.random() * 90) / 10 + 0.2).toFixed(1)}M`,
    sentiment: Math.floor(Math.random() * 30) + 65,
    trending: Math.random() > 0.6,
    category: catList[i % catList.length],
    timestamp: `${Math.floor(Math.random() * 23) + 1}${timeUnits[i % timeUnits.length]} ago`,
    pain: pains[i % pains.length],
  }));
}

function generateIdeas() {
  const ideas = [
    { title: "InvoiceFlow — AI invoicing for creators", signal: "Invoice automation for freelancers", tam: "$4.2B", competitors: 3 },
    { title: "AllergyChef — Personalized meal AI", signal: "AI meal prep for dietary restrictions", tam: "$8.1B", competitors: 7 },
    { title: "SplitPay — Contractor revenue sharing", signal: "Contractor payment splitting", tam: "$2.7B", competitors: 2 },
    { title: "PetPulse — Wearable health tracker", signal: "Pet health monitoring wearable", tam: "$6.3B", competitors: 5 },
    { title: "NotionOps — Automation layer", signal: "Micro-SaaS for Notion power users", tam: "$1.4B", competitors: 4 },
    { title: "ColdCraft — AI outreach engine", signal: "AI cold email personalization", tam: "$3.8B", competitors: 12 },
    { title: "EventBuzz — Gen Z local events", signal: "Local event discovery for Gen Z", tam: "$2.1B", competitors: 8 },
    { title: "SubStack — Kill subscription fatigue", signal: "Subscription fatigue manager", tam: "$1.8B", competitors: 6 },
    { title: "HireBot — AI resume screening", signal: "AI resume screening for SMBs", tam: "$5.4B", competitors: 15 },
    { title: "EtsyBooks — Seller bookkeeping", signal: "Automated bookkeeping for Etsy sellers", tam: "$0.9B", competitors: 3 },
    { title: "VoiceCRM — Talk-first real estate CRM", signal: "Voice-first CRM for realtors", tam: "$3.2B", competitors: 9 },
    { title: "LegalLens — AI contract review", signal: "AI legal contract reviewer", tam: "$7.1B", competitors: 11 },
    { title: "GymMatch — Workout buddy finder", signal: "Gym buddy matching app", tam: "$0.6B", competitors: 4 },
    { title: "PodClip — AI podcast highlights", signal: "AI podcast transcription + clips", tam: "$1.3B", competitors: 7 },
    { title: "RentSplit — Fair rent calculator", signal: "Rent splitting for roommates", tam: "$0.4B", competitors: 2 },
    { title: "TutorAI — K-12 homework help", signal: "AI homework tutor for K-12", tam: "$12.6B", competitors: 18 },
    { title: "TaxPilot — Freelancer tax tool", signal: "Freelancer tax estimator", tam: "$2.3B", competitors: 8 },
    { title: "SnapShot — AI product photos", signal: "AI product photography generator", tam: "$1.7B", competitors: 5 },
    { title: "NanoInfluence — Micro-influencer platform", signal: "Micro-influencer marketplace", tam: "$4.8B", competitors: 14 },
    { title: "ReceiptIQ — Smart expense scanner", signal: "Smart receipt scanner for expenses", tam: "$1.1B", competitors: 6 },
    { title: "RoomVision — AI interior design", signal: "AI interior design visualizer", tam: "$3.5B", competitors: 10 },
    { title: "TakedownBot — Automated DMCA", signal: "Automated DMCA takedown tool", tam: "$0.3B", competitors: 1 },
    { title: "MemeLang — Learn via memes", signal: "Language learning via memes", tam: "$5.9B", competitors: 20 },
    { title: "MeetingMind — AI notes + actions", signal: "AI meeting notes + action items", tam: "$2.8B", competitors: 13 },
    { title: "RemoteDev — Niche remote job board", signal: "Niche job board for remote devs", tam: "$0.7B", competitors: 9 },
    { title: "MenuAI — Instant menu translation", signal: "AI-powered menu translation", tam: "$0.5B", competitors: 3 },
    { title: "CarbonTrack — SMB footprint tool", signal: "Carbon footprint tracker for SMBs", tam: "$1.6B", competitors: 7 },
    { title: "SponsorMatch — Creator + brand pairing", signal: "Creator sponsorship matchmaker", tam: "$6.2B", competitors: 11 },
    { title: "ShopBot — AI Shopify support", signal: "AI customer support for Shopify", tam: "$4.1B", competitors: 16 },
    { title: "StockAlert — Smart DTC inventory", signal: "Smart inventory alerts for DTC", tam: "$1.9B", competitors: 4 },
  ];

  const statuses: IdeaStatus[] = ["validated", "ready", "building", "launched"];

  return ideas.map((idea, i) => ({
    id: i + 1,
    ...idea,
    score: Math.floor(Math.random() * 30) + 65,
    agents: Math.floor(Math.random() * 5),
    status: statuses[i % statuses.length],
    revenue: `$${Math.floor(Math.random() * 25) + 2}K MRR projected`,
  }));
}

const osItems = [
  { id: 1, type: "link" as const, title: "Stripe Atlas — best for incorporation", tags: ["legal", "startup"], added: "2d ago" },
  { id: 2, type: "note" as const, title: "Focus on B2B micro-SaaS under $50/mo price point — lower churn, faster validation", tags: ["strategy", "pricing"], added: "3d ago" },
  { id: 3, type: "doc" as const, title: "Go-to-market playbook for dev tools", tags: ["gtm", "devtools"], added: "5d ago" },
  { id: 4, type: "idea" as const, title: "Build a Zapier competitor focused only on AI workflows", tags: ["idea", "automation"], added: "1w ago" },
  { id: 5, type: "link" as const, title: "Y Combinator application tips 2025", tags: ["fundraising", "yc"], added: "1w ago" },
  { id: 6, type: "note" as const, title: "Agents perform 3x better when given market context before deployment", tags: ["agents", "performance"], added: "2w ago" },
  { id: 7, type: "doc" as const, title: "SEO audit template for SaaS landing pages", tags: ["seo", "marketing"], added: "2w ago" },
  { id: 8, type: "idea" as const, title: "White-label MothershipX for enterprise innovation teams", tags: ["enterprise", "b2b"], added: "3w ago" },
];

const osTypeIcon = { link: Link2, note: FileText, doc: BookOpen, idea: Sparkles };

const PAGE_SIZE = 15;

const Knowledge = () => {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("signals");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SignalSource>("all");
  const [categoryFilter, setCategoryFilter] = useState<SignalCategory>("all");
  const [ideaStatusFilter, setIdeaStatusFilter] = useState<IdeaStatus>("all");
  const [signalPage, setSignalPage] = useState(1);
  const [ideaPage, setIdeaPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const allSignals = useMemo(() => generateSignals(), []);
  const allIdeas = useMemo(() => generateIdeas(), []);

  const filteredSignals = useMemo(() => allSignals.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()) || s.pain.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "all" || s.source === sourceFilter;
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchSource && matchCat;
  }), [allSignals, search, sourceFilter, categoryFilter]);

  const filteredIdeas = useMemo(() => allIdeas.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.signal.toLowerCase().includes(search.toLowerCase());
    const matchStatus = ideaStatusFilter === "all" || i.status === ideaStatusFilter;
    return matchSearch && matchStatus;
  }), [allIdeas, search, ideaStatusFilter]);

  const filteredOs = osItems.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.tags.some(t => t.includes(search.toLowerCase())));

  const visibleSignals = filteredSignals.slice(0, signalPage * PAGE_SIZE);
  const visibleIdeas = filteredIdeas.slice(0, ideaPage * PAGE_SIZE);

  const totalSignalsDb = 847;
  const totalIdeasDb = 3241;

  const tabData: { id: Tab; label: string; labelIt: string; icon: typeof Radio; count: string; subtitle: string }[] = [
    { id: "signals", label: "Signals", labelIt: "Segnali", icon: Radio, count: `${totalSignalsDb}`, subtitle: "~200/week from 13 sources" },
    { id: "ideas", label: "Ideas", labelIt: "Idee", icon: Lightbulb, count: `${totalIdeasDb}`, subtitle: "~1,000/month AI-generated" },
    { id: "os", label: "Personal OS", labelIt: "OS Personale", icon: FolderOpen, count: `${osItems.length}`, subtitle: "Your private knowledge" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-heading font-semibold tracking-tight">Knowledge Base</h1>
          <p className="text-[12px] text-muted-foreground mt-1">
            {locale === "it"
              ? "Segnali di mercato live, idee validate dal nostro database, e il tuo OS personale"
              : "Live market signals, pre-validated ideas from our database, and your personal OS"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
          <Database className="h-3 w-3" strokeWidth={1.4} />
          <span>{locale === "it" ? "Ultimo aggiornamento: 4m fa" : "Last synced: 4m ago"}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl w-fit">
        {tabData.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(""); }}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 ${
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span className="hidden sm:inline">{locale === "it" ? tab.labelIt : tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${activeTab === tab.id ? "bg-muted text-foreground" : "bg-transparent text-muted-foreground"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
            <input
              type="text"
              placeholder={activeTab === "signals" ? (locale === "it" ? "Cerca segnali..." : "Search signals...") : activeTab === "ideas" ? (locale === "it" ? "Cerca idee..." : "Search ideas...") : (locale === "it" ? "Cerca nel tuo OS..." : "Search your OS...")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
            />
          </div>
          {(activeTab === "signals" || activeTab === "ideas") && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 px-3 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] ${showFilters ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.6} />
              {locale === "it" ? "Filtri" : "Filters"}
            </button>
          )}
          {activeTab === "os" && (
            <button className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[12px] font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors active:scale-[0.97]">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
              {locale === "it" ? "Aggiungi" : "Add Item"}
            </button>
          )}
        </div>

        {/* Filter pills */}
        <AnimatePresence>
          {showFilters && activeTab === "signals" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 px-0.5">{locale === "it" ? "Fonte" : "Source"}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sources.map(s => (
                    <button key={s} onClick={() => { setSourceFilter(s); setSignalPage(1); }} className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${sourceFilter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {s === "all" ? (locale === "it" ? "Tutte" : "All") : s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 px-0.5">{locale === "it" ? "Categoria" : "Category"}</p>
                <div className="flex flex-wrap gap-1.5">
                  {signalCategories.map(c => (
                    <button key={c} onClick={() => { setCategoryFilter(c); setSignalPage(1); }} className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${categoryFilter === c ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {c === "all" ? (locale === "it" ? "Tutte" : "All") : c}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {showFilters && activeTab === "ideas" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 px-0.5">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {ideaStatuses.map(s => (
                  <button key={s} onClick={() => { setIdeaStatusFilter(s); setIdeaPage(1); }} className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${ideaStatusFilter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {s === "all" ? (locale === "it" ? "Tutti" : "All") : s === "validated" ? "✓ Validated" : s === "building" ? "⚡ Building" : s === "launched" ? "🚀 Launched" : "○ Ready"}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      {(activeTab === "signals" || activeTab === "ideas") && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            {activeTab === "signals"
              ? `${locale === "it" ? "Mostrati" : "Showing"} ${visibleSignals.length} ${locale === "it" ? "di" : "of"} ${filteredSignals.length} ${locale === "it" ? "segnali" : "signals"} (${totalSignalsDb} ${locale === "it" ? "nel database" : "in database"})`
              : `${locale === "it" ? "Mostrate" : "Showing"} ${visibleIdeas.length} ${locale === "it" ? "di" : "of"} ${filteredIdeas.length} ${locale === "it" ? "idee" : "ideas"} (${totalIdeasDb} ${locale === "it" ? "nel database" : "in database"})`
            }
          </p>
          <p className="text-[9px] text-muted-foreground/60 flex items-center gap-1">
            <Database className="h-2.5 w-2.5" strokeWidth={1.4} />
            {activeTab === "signals" ? "~200 new/week" : "~1,000 new/month"}
          </p>
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "signals" && (
          <motion.div key="signals" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-2">
            {visibleSignals.map((signal, i) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
                    <p className="text-[11px] font-medium tabular-nums">{signal.views} views</p>
                    <div className="flex items-center justify-end gap-1">
                      <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/60" style={{ width: `${signal.sentiment}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground tabular-nums">{signal.sentiment}%</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/50 flex items-center justify-end gap-1">
                      <Clock className="h-2.5 w-2.5" /> {signal.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {visibleSignals.length < filteredSignals.length && (
              <button
                onClick={() => setSignalPage(p => p + 1)}
                className="w-full py-3 text-[12px] font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all active:scale-[0.99]"
              >
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.6} />
                {locale === "it" ? "Carica altri" : "Load more"} ({filteredSignals.length - visibleSignals.length} {locale === "it" ? "rimanenti" : "remaining"})
              </button>
            )}
          </motion.div>
        )}

        {activeTab === "ideas" && (
          <motion.div key="ideas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-2">
            {visibleIdeas.map((idea, i) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                        idea.status === "validated" ? "bg-green-500/10 text-green-400"
                        : idea.status === "building" ? "bg-blue-500/10 text-blue-400"
                        : idea.status === "launched" ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                      }`}>
                        {idea.status === "validated" ? "✓ Validated" : idea.status === "building" ? "⚡ Building" : idea.status === "launched" ? "🚀 Launched" : "○ Ready"}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">{locale === "it" ? "dal segnale" : "from signal"}: {idea.signal}</span>
                    </div>
                    <p className="text-[13px] font-medium leading-snug mb-1">{idea.title}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">TAM {idea.tam}</span>
                      <span className="text-[10px] text-muted-foreground">{idea.revenue}</span>
                      <span className="text-[10px] text-muted-foreground">{idea.competitors} competitors</span>
                      {idea.agents > 0 && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Bot className="h-2.5 w-2.5" strokeWidth={1.4} /> {idea.agents} {idea.agents === 1 ? "agent" : "agents"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Star className="h-3 w-3 text-primary/60" strokeWidth={1.6} />
                      <span className="text-[14px] font-heading font-semibold tabular-nums">{idea.score}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 ml-auto group-hover:text-foreground/50 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
            {visibleIdeas.length < filteredIdeas.length && (
              <button
                onClick={() => setIdeaPage(p => p + 1)}
                className="w-full py-3 text-[12px] font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all active:scale-[0.99]"
              >
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.6} />
                {locale === "it" ? "Carica altre" : "Load more"} ({filteredIdeas.length - visibleIdeas.length} {locale === "it" ? "rimanenti" : "remaining"})
              </button>
            )}
          </motion.div>
        )}

        {activeTab === "os" && (
          <motion.div key="os" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="p-4 mb-4 rounded-xl border border-dashed border-border bg-muted/10 text-center">
              <FolderOpen className="h-5 w-5 text-muted-foreground mx-auto mb-2" strokeWidth={1.4} />
              <p className="text-[12px] font-medium mb-1">{locale === "it" ? "Il tuo spazio privato" : "Your private space"}</p>
              <p className="text-[10px] text-muted-foreground max-w-sm mx-auto">
                {locale === "it"
                  ? "Salva idee, link, documenti e note. Tutto qui addestra automaticamente i tuoi agenti."
                  : "Save ideas, links, docs & notes. Everything here autonomously trains your agents."}
              </p>
            </div>
            <div className="space-y-2">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Knowledge;
