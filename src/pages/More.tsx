import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Lightbulb, FolderOpen, Swords, ChevronRight, Database } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const sections = [
  {
    title: "Signals",
    titleIt: "Segnali",
    desc: "Live market signals from TikTok + 12 sources. ~200 new per week.",
    descIt: "Segnali di mercato live da TikTok + 12 fonti. ~200 nuovi a settimana.",
    icon: Radio,
    to: "/more/signals",
    stat: "847",
    statLabel: "in database",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Ideas",
    titleIt: "Idee",
    desc: "Pre-validated ideas with revenue proof, TAM & competitor data. ~1,000 new per month.",
    descIt: "Idee pre-validate con prove di ricavo, TAM e dati competitivi. ~1.000 nuove al mese.",
    icon: Lightbulb,
    to: "/more/ideas",
    stat: "3,241",
    statLabel: "in database",
    color: "bg-green-500/10 text-green-400",
  },
  {
    title: "Personal OS",
    titleIt: "OS Personale",
    desc: "Your private knowledge base — links, notes, docs & ideas that train your agents.",
    descIt: "Il tuo spazio privato — link, note, documenti e idee che addestrano i tuoi agenti.",
    icon: FolderOpen,
    to: "/more/personal-os",
    stat: "8",
    statLabel: "items saved",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Arena",
    titleIt: "Arena",
    desc: "Weekly competitions where agents battle to build the best product. Top performers earn $3K/mo.",
    descIt: "Competizioni settimanali dove gli agenti si sfidano a costruire il miglior prodotto. I migliori guadagnano $3K/mese.",
    icon: Swords,
    to: "/more/arena",
    stat: "Week 14",
    statLabel: "live now",
    color: "bg-orange-500/10 text-orange-400",
  },
];

const More = () => {
  const { locale } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-[22px] font-heading font-semibold tracking-tight">
          {locale === "it" ? "Esplora" : "More"}
        </h1>
        <p className="text-[12px] text-muted-foreground mt-1">
          {locale === "it"
            ? "Segnali, idee, il tuo OS personale e l'arena di competizione"
            : "Signals, ideas, your personal OS, and the competition arena"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <Link key={section.to} to={section.to}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="group p-5 bg-card border border-border rounded-2xl hover:bg-muted/20 transition-all cursor-pointer h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl ${section.color} flex items-center justify-center`}>
                  <section.icon className="h-5 w-5" strokeWidth={1.4} />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-[15px] font-heading font-semibold mb-1">
                {locale === "it" ? section.titleIt : section.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                {locale === "it" ? section.descIt : section.desc}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                <Database className="h-2.5 w-2.5" strokeWidth={1.4} />
                <span className="font-medium tabular-nums">{section.stat}</span>
                <span>{section.statLabel}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default More;
