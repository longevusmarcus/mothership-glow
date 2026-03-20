import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Search, Star, ChevronRight, ChevronDown, Database, SlidersHorizontal, Bot, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

type IdeaStatus = "all" | "validated" | "ready" | "building" | "launched";
const ideaStatuses: IdeaStatus[] = ["all", "validated", "ready", "building", "launched"];

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
    id: i + 1, ...idea,
    score: Math.floor(Math.random() * 30) + 65,
    agents: Math.floor(Math.random() * 5),
    status: statuses[i % statuses.length],
    revenue: `$${Math.floor(Math.random() * 25) + 2}K MRR projected`,
  }));
}

const PAGE_SIZE = 15;

const Ideas = () => {
  const { locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IdeaStatus>("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const allIdeas = useMemo(() => generateIdeas(), []);
  const filtered = useMemo(() => allIdeas.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.signal.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  }), [allIdeas, search, statusFilter]);

  const visible = filtered.slice(0, page * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/more" className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
        </Link>
        <div className="flex-1">
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-400" strokeWidth={1.6} />
            {locale === "it" ? "Idee" : "Ideas"}
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {locale === "it" ? "~1.000 nuove idee al mese generate dall'AI" : "~1,000 new ideas per month AI-generated from signals"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
          <Database className="h-3 w-3" strokeWidth={1.4} /> 3,241 in database
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
            <input type="text" placeholder={locale === "it" ? "Cerca idee..." : "Search ideas..."} value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-all" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`h-9 px-3 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] ${showFilters ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.6} /> Filters
          </button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 px-0.5">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {ideaStatuses.map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${statusFilter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {s === "all" ? "All" : s === "validated" ? "✓ Validated" : s === "building" ? "⚡ Building" : s === "launched" ? "🚀 Launched" : "○ Ready"}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-muted-foreground">Showing {visible.length} of {filtered.length} ideas</p>

      <div className="space-y-2">
        {visible.map((idea, i) => (
          <motion.div key={idea.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
            className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer">
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
                  <span className="text-[9px] text-muted-foreground/60">from signal: {idea.signal}</span>
                </div>
                <p className="text-[13px] font-medium leading-snug mb-1">{idea.title}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[10px] text-muted-foreground">TAM {idea.tam}</span>
                  <span className="text-[10px] text-muted-foreground">{idea.revenue}</span>
                  <span className="text-[10px] text-muted-foreground">{idea.competitors} competitors</span>
                  {idea.agents > 0 && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Bot className="h-2.5 w-2.5" strokeWidth={1.4} /> {idea.agents} agents
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 space-y-2">
                <div className="flex items-center justify-end gap-1.5">
                  <Star className="h-3 w-3 text-primary/60" strokeWidth={1.6} />
                  <span className="text-[14px] font-mondwest font-semibold tabular-nums">{idea.score}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 ml-auto group-hover:text-foreground/50 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
        {visible.length < filtered.length && (
          <button onClick={() => setPage(p => p + 1)}
            className="w-full py-3 text-[12px] font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all active:scale-[0.99]">
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.6} />
            Load more ({filtered.length - visible.length} remaining)
          </button>
        )}
      </div>
    </div>
  );
};

export default Ideas;
