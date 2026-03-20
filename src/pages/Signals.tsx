import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Search, Clock, Flame, Globe, Database, ChevronDown, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

type SignalSource = "all" | "TikTok" | "Reddit" | "Twitter/X" | "LinkedIn" | "ProductHunt" | "YouTube" | "Quora" | "HackerNews" | "IndieHackers" | "Discord" | "Google Trends" | "App Store Reviews";
type SignalCategory = "all" | "FinTech" | "Health" | "Productivity" | "Sales" | "Social" | "DevTools" | "PetTech" | "Education" | "E-commerce" | "AI/ML" | "Creator Economy" | "HR" | "Legal" | "Real Estate";

const sources: SignalSource[] = ["all", "TikTok", "Reddit", "Twitter/X", "LinkedIn", "ProductHunt", "YouTube", "Quora", "HackerNews", "IndieHackers", "Discord", "Google Trends", "App Store Reviews"];
const signalCategories: SignalCategory[] = ["all", "FinTech", "Health", "Productivity", "Sales", "Social", "DevTools", "PetTech", "Education", "E-commerce", "AI/ML", "Creator Economy", "HR", "Legal", "Real Estate"];

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
  const srcList = sources.filter(s => s !== "all") as SignalSource[];
  const catList = signalCategories.filter(s => s !== "all") as SignalCategory[];
  const timeUnits = ["m", "h", "h", "h", "h", "d", "d", "d"];

  return Array.from({ length: 48 }, (_, i) => ({
    id: i + 1, title: titles[i % titles.length], source: srcList[i % srcList.length],
    views: `${(Math.floor(Math.random() * 90) / 10 + 0.2).toFixed(1)}M`,
    sentiment: Math.floor(Math.random() * 30) + 65, trending: Math.random() > 0.6,
    category: catList[i % catList.length],
    timestamp: `${Math.floor(Math.random() * 23) + 1}${timeUnits[i % timeUnits.length]} ago`,
    pain: pains[i % pains.length],
  }));
}

const PAGE_SIZE = 15;

const Signals = () => {
  const { locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SignalSource>("all");
  const [categoryFilter, setCategoryFilter] = useState<SignalCategory>("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const allSignals = useMemo(() => generateSignals(), []);
  const filtered = useMemo(() => allSignals.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()) || s.pain.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "all" || s.source === sourceFilter;
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchSource && matchCat;
  }), [allSignals, search, sourceFilter, categoryFilter]);

  const visible = filtered.slice(0, page * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/more" className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
        </Link>
        <div className="flex-1">
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" strokeWidth={1.6} />
            {locale === "it" ? "Segnali" : "Signals"}
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5 font-mono">
            {locale === "it" ? "~200 nuovi segnali a settimana da 13 fonti" : "~200 new signals per week from 13 sources"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
          <Database className="h-3 w-3" strokeWidth={1.4} />
          847 in database
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
            <input type="text" placeholder={locale === "it" ? "Cerca segnali..." : "Search signals..."} value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-all" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`h-9 px-3 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all active:scale-[0.97] ${showFilters ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.6} /> {locale === "it" ? "Filtri" : "Filters"}
          </button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 px-0.5">Source</p>
                <div className="flex flex-wrap gap-1.5">
                  {sources.map(s => (
                    <button key={s} onClick={() => { setSourceFilter(s); setPage(1); }} className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${sourceFilter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {s === "all" ? "All" : s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 px-0.5">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {signalCategories.map(c => (
                    <button key={c} onClick={() => { setCategoryFilter(c); setPage(1); }} className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${categoryFilter === c ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {c === "all" ? "All" : c}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Showing {visible.length} of {filtered.length} signals
      </p>

      <div className="space-y-2">
        {visible.map((signal, i) => (
          <motion.div key={signal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
            className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {signal.trending && (
                    <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      <Flame className="h-2.5 w-2.5" /> TRENDING
                    </span>
                  )}
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{signal.category}</span>
                  <span className="text-[9px] text-muted-foreground/60 flex items-center gap-1"><Globe className="h-2.5 w-2.5" /> {signal.source}</span>
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
                <p className="text-[9px] text-muted-foreground/50 flex items-center justify-end gap-1"><Clock className="h-2.5 w-2.5" /> {signal.timestamp}</p>
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

export default Signals;
