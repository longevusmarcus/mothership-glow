import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, ExternalLink, FileText, Link2, Search, Clock, Plus, BookOpen, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

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

const PersonalOS = () => {
  const { locale } = useLanguage();
  const [search, setSearch] = useState("");

  const filtered = osItems.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.tags.some(t => t.includes(search.toLowerCase())));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/more" className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
        </Link>
        <div className="flex-1">
          <h1 className="text-[22px] font-mondwest font-semibold tracking-tight flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-blue-400" strokeWidth={1.6} />
            Personal OS
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {locale === "it" ? "Il tuo spazio privato — tutto qui addestra automaticamente i tuoi agenti" : "Your private space — everything here autonomously trains your agents"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
          <input type="text" placeholder={locale === "it" ? "Cerca nel tuo OS..." : "Search your OS..."} value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border bg-card text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-all" />
        </div>
        <button className="h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[12px] font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors active:scale-[0.97]">
          <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
          {locale === "it" ? "Aggiungi" : "Add Item"}
        </button>
      </div>

      <div className="p-4 rounded-xl border border-dashed border-border bg-muted/10 text-center">
        <FolderOpen className="h-5 w-5 text-muted-foreground mx-auto mb-2" strokeWidth={1.4} />
        <p className="text-[12px] font-medium mb-1">{locale === "it" ? "Il tuo spazio privato" : "Your private knowledge"}</p>
        <p className="text-[10px] text-muted-foreground max-w-sm mx-auto">
          {locale === "it"
            ? "Salva idee, link, documenti e note. Tutto qui addestra automaticamente i tuoi agenti."
            : "Save ideas, links, docs & notes. Everything here autonomously trains your agents."}
        </p>
      </div>

      <div className="space-y-2">
        {filtered.map((item, i) => {
          const Icon = osTypeIcon[item.type];
          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="group p-4 bg-card border border-border rounded-xl hover:bg-muted/20 transition-all cursor-pointer">
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
    </div>
  );
};

export default PersonalOS;
