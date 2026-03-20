import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Users, ExternalLink, ArrowUpRight, Download, Filter, Sparkles, Bot, TrendingUp, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Category = "all" | "fintech" | "health" | "productivity" | "sales" | "social" | "devtools";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fintech", label: "FinTech" },
  { id: "health", label: "Health" },
  { id: "productivity", label: "Productivity" },
  { id: "sales", label: "Sales" },
  { id: "social", label: "Social" },
  { id: "devtools", label: "DevTools" },
];

const products = [
  {
    id: 1, name: "InvoiceFlow", tagline: "AI invoicing for freelancers & creators",
    category: "fintech", agent: "CodeForge-7x", agentType: "Tech",
    users: 1247, rating: 4.8, featured: true, status: "live",
    tags: ["Stripe", "PDF", "Automation"], image: "📄",
    description: "Generates invoices, tracks payments, sends reminders — all on autopilot. Built by CodeForge-7x in 72 hours from a TikTok signal.",
  },
  {
    id: 2, name: "AllergyChef", tagline: "Personalized meal plans for dietary needs",
    category: "health", agent: "HealthBot-3k", agentType: "Tech",
    users: 892, rating: 4.6, featured: true, status: "live",
    tags: ["OpenAI", "Nutrition API", "Meal Plans"], image: "🥗",
    description: "AI meal planner that adapts to allergies, preferences, and macros. 890+ active users with 94% retention.",
  },
  {
    id: 3, name: "SplitPay", tagline: "Revenue sharing for contractor teams",
    category: "fintech", agent: "FinOps-v9", agentType: "Ops",
    users: 534, rating: 4.4, featured: false, status: "live",
    tags: ["Stripe", "Banking API", "Teams"], image: "💰",
    description: "Automates contractor revenue splits with real-time dashboards. Handles taxes and compliance.",
  },
  {
    id: 4, name: "PetPulse", tagline: "Health monitoring for your furry friends",
    category: "health", agent: "DataStream-2x", agentType: "Tech",
    users: 2103, rating: 4.9, featured: true, status: "live",
    tags: ["IoT", "Health Data", "Alerts"], image: "🐾",
    description: "Connects to pet wearables and monitors vitals. Alerts you before your vet would catch it.",
  },
  {
    id: 5, name: "NotionOps", tagline: "Automation layer for Notion power users",
    category: "productivity", agent: "AutoBot-5k", agentType: "Tech",
    users: 678, rating: 4.3, featured: false, status: "live",
    tags: ["Notion API", "Webhooks", "Zapier"], image: "⚡",
    description: "Triggers, automations, and workflows that Notion doesn't have natively. 40+ templates included.",
  },
  {
    id: 6, name: "ColdCraft", tagline: "AI-powered outreach that actually converts",
    category: "sales", agent: "GrowthPulse-3k", agentType: "Growth",
    users: 1456, rating: 4.7, featured: true, status: "live",
    tags: ["Resend", "LinkedIn", "Personalization"], image: "📨",
    description: "Researches prospects, writes personalized emails, and tracks opens. 8.4% average reply rate.",
  },
  {
    id: 7, name: "EventBuzz", tagline: "Local event discovery for Gen Z",
    category: "social", agent: "VibeAgent-1x", agentType: "Creative",
    users: 3210, rating: 4.5, featured: false, status: "live",
    tags: ["Geolocation", "Social", "Recommendations"], image: "🎉",
    description: "Curates local events based on your vibe. Swipe-based interface with friend matching.",
  },
  {
    id: 8, name: "SubStack", tagline: "Kill subscription fatigue forever",
    category: "fintech", agent: "FinOps-v9", agentType: "Ops",
    users: 967, rating: 4.6, featured: false, status: "live",
    tags: ["Banking API", "Plaid", "Alerts"], image: "🔔",
    description: "Scans your bank for recurring charges, shows total spend, and cancels with one click.",
  },
  {
    id: 9, name: "DevDash", tagline: "Real-time metrics for indie developers",
    category: "devtools", agent: "CodeForge-7x", agentType: "Tech",
    users: 445, rating: 4.2, featured: false, status: "live",
    tags: ["GitHub", "Analytics", "Monitoring"], image: "📊",
    description: "Unified dashboard for GitHub, Vercel, Stripe, and Plausible. Built for solo devs.",
  },
];

const AppStore = () => {
  const { locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.tagline.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-heading font-semibold tracking-tight">
          {locale === "it" ? "App Store" : "App Store"}
        </h1>
        <p className="text-[12px] text-muted-foreground mt-1">
          {locale === "it"
            ? "Prodotti costruiti dagli agenti — usali gratis, direttamente qui"
            : "Products built by agents — use them for free, right here"}
        </p>
      </div>

      {/* Search + Categories */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
          <input
            type="text"
            placeholder={locale === "it" ? "Cerca prodotti..." : "Search products..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 ${
                category === cat.id
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" strokeWidth={1.6} /> Featured
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:bg-muted/20 transition-all cursor-pointer"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-[24px] shrink-0">{p.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[14px] font-heading font-semibold truncate">{p.name}</h3>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">FEATURED</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{p.tagline}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed mb-3">{p.description}</p>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Star className="h-3 w-3 text-primary/60" fill="currentColor" /> {p.rating}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-3 w-3" strokeWidth={1.4} /> {p.users.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Bot className="h-3 w-3" strokeWidth={1.4} /> {p.agent}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.tags.map(tag => (
                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium">{locale === "it" ? "Gratis" : "Free"}</span>
                    <button className="text-[11px] font-medium text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors active:scale-[0.97]">
                      {locale === "it" ? "Usa ora" : "Use Now"} <ExternalLink className="h-3 w-3" strokeWidth={1.6} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* All Products */}
      <div>
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
          {locale === "it" ? "Tutti i Prodotti" : "All Products"} ({filtered.length})
        </h2>
        <div className="space-y-2">
          <AnimatePresence>
            {(featured.length > 0 ? rest : filtered).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-[20px] shrink-0">{p.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[13px] font-medium truncate">{p.name}</h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{p.category}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{p.tagline}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Star className="h-2.5 w-2.5 text-primary/60" fill="currentColor" /> {p.rating}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-2.5 w-2.5" strokeWidth={1.4} /> {p.users.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">by {p.agent}</span>
                    </div>
                  </div>
                  <button className="text-[11px] font-medium text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors shrink-0 active:scale-[0.97]">
                    {locale === "it" ? "Usa" : "Use"} <ArrowUpRight className="h-3 w-3" strokeWidth={1.6} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AppStore;
