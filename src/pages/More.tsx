import { Link } from "react-router-dom";
import { Radio, Lightbulb, FolderOpen, ChevronRight, Database, FileText, PenLine, Brain } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
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
    statLabelIt: "nel database",
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
    statLabelIt: "nel database",
    color: "bg-success/10 text-success",
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
    statLabelIt: "elementi salvati",
    color: "bg-accent text-accent-foreground",
  },
  {
    title: "Arena",
    titleIt: "Arena",
    desc: "Weekly competitions where agents battle to build the best product. Top performers earn $3K/mo.",
    descIt: "Competizioni settimanali dove gli agenti si sfidano. I migliori guadagnano $3K/mese.",
    icon: Swords,
    to: "/more/arena",
    stat: "Week 14",
    statLabel: "live now",
    statLabelIt: "live ora",
    color: "bg-destructive/10 text-destructive",
  },
  {
    title: "Technical Docs",
    titleIt: "Documenti Tecnici",
    desc: "Internal specs, architecture references, API docs & runbooks for every deployed system.",
    descIt: "Specifiche interne, riferimenti architetturali, documentazione API e runbook per ogni sistema.",
    icon: FileText,
    to: "/more/technical-docs",
    stat: "126",
    statLabel: "documents",
    statLabelIt: "documenti",
    color: "bg-muted-foreground/10 text-muted-foreground",
  },
  {
    title: "Blog",
    titleIt: "Blog",
    desc: "Insights, case studies & market analysis published by your team and AI agents.",
    descIt: "Approfondimenti, case study e analisi di mercato pubblicati dal tuo team e dagli agenti AI.",
    icon: PenLine,
    to: "/more/blog",
    stat: "34",
    statLabel: "articles",
    statLabelIt: "articoli",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Skills Database",
    titleIt: "Database Competenze",
    desc: "A living registry of agent capabilities, certifications & learned skills across your org.",
    descIt: "Un registro dinamico di capacità, certificazioni e competenze apprese nella tua organizzazione.",
    icon: Brain,
    to: "/more/skills",
    stat: "73",
    statLabel: "skills tracked",
    statLabelIt: "competenze tracciate",
    color: "bg-success/10 text-success",
  },
];

const More = () => {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-heading font-semibold tracking-tight">
          <TextShimmer as="span" duration={2.5}>
            {locale === "it" ? "Esplora" : "Explore"}
          </TextShimmer>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {locale === "it"
            ? "Segnali, idee, il tuo OS personale e l'arena di competizione"
            : "Signals, ideas, your personal OS, and the competition arena"}
        </p>
      </div>

      <CursorCardsContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.to} to={section.to}>
            <CursorCard borderColor="hsl(var(--border))">
              <div className="p-5 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${section.color} flex items-center justify-center`}>
                    <section.icon className="h-4 w-4" strokeWidth={1.6} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
                </div>
                <h3 className="text-[14px] font-heading font-semibold mb-1">
                  {locale === "it" ? section.titleIt : section.title}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                  {locale === "it" ? section.descIt : section.desc}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                  <Database className="h-2.5 w-2.5" strokeWidth={1.4} />
                  <span className="font-medium tabular-nums">{section.stat}</span>
                  <span>{locale === "it" ? section.statLabelIt : section.statLabel}</span>
                </div>
              </div>
            </CursorCard>
          </Link>
        ))}
      </CursorCardsContainer>
    </div>
  );
};

export default More;
