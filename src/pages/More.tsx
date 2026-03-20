import { Link } from "react-router-dom";
import { Radio, Lightbulb, FolderOpen, ChevronRight, Database, FileText, PenLine, Activity, Tv, Swords } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { useLanguage } from "@/i18n/LanguageContext";

const sections = [
  {
    title: "Live Ecosystem",
    titleIt: "Ecosistema Live",
    desc: "Real-time command ship view — revenue, signals, ideas, tasks, products, ads & more across MSX.",
    descIt: "Vista command ship in tempo reale — ricavi, segnali, idee, task, prodotti, ads e altro su MSX.",
    icon: Activity,
    to: "/more/live",
    stat: "Live",
    statLabel: "streaming now",
    statLabelIt: "in diretta",
    color: "bg-destructive/10 text-destructive",
  },
  {
    title: "Streaming",
    titleIt: "Streaming",
    desc: "Live streams, shows & broadcasts from the MSX ecosystem. Watch builders ship in real-time.",
    descIt: "Live stream, show e trasmissioni dall'ecosistema MSX. Guarda i builder in tempo reale.",
    icon: Tv,
    to: "https://msx.live",
    stat: "msx.live",
    statLabel: "external",
    statLabelIt: "esterno",
    color: "bg-destructive/10 text-destructive",
    external: true,
  },
  {
    title: "Arena",
    titleIt: "Arena",
    desc: "The app store of the future, built for agents.",
    descIt: "L'app store del futuro, costruito per gli agenti.",
    icon: Swords,
    to: "https://msx.gg",
    stat: "msx.gg",
    statLabel: "external",
    statLabelIt: "esterno",
    color: "bg-accent text-accent-foreground",
    external: true,
  },
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
    title: "Hackathons (soon)",
    titleIt: "Hackathon (presto)",
    desc: "Live hackathon events with real-time leaderboards, team formation & prize pools.",
    descIt: "Eventi hackathon live con classifiche in tempo reale, formazione team e montepremi.",
    icon: Swords,
    to: "#",
    stat: "—",
    statLabel: "coming soon",
    statLabelIt: "in arrivo",
    color: "bg-muted-foreground/10 text-muted-foreground",
    disabled: true,
  },
  {
    title: "Personal OS (soon)",
    titleIt: "OS Personale (presto)",
    desc: "Your private knowledge base — links, notes, docs & ideas that train your agents.",
    descIt: "Il tuo spazio privato — link, note, documenti e idee che addestrano i tuoi agenti.",
    icon: FolderOpen,
    to: "#",
    stat: "—",
    statLabel: "coming soon",
    statLabelIt: "in arrivo",
    color: "bg-muted-foreground/10 text-muted-foreground",
    disabled: true,
  },
];

const More = () => {
  const { locale } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight">
          <TextShimmer as="span" duration={2.5}>
            {locale === "it" ? "Esplora" : "Explore"}
          </TextShimmer>
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          {locale === "it"
            ? "Esplora l'intero ecosistema MSX"
            : "Explore the whole MSX ecosystem"}
        </p>
      </div>

      <CursorCardsContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => {
          const isExternal = 'external' in section && section.external;
          const isDisabled = 'disabled' in section && section.disabled;
          if (isDisabled) {
            return (
            <div key={section.title} className="opacity-50 cursor-not-allowed">
              <CursorCard borderColor="hsl(var(--border))">
                <div className="p-5 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-10 w-10 rounded-xl ${section.color} flex items-center justify-center`}>
                      <section.icon className="h-4 w-4" strokeWidth={1.6} />
                    </div>
                  </div>
                  <h3 className="text-[14px] font-mondwest font-semibold mb-1">
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
            </div>
            );
          }
          const Wrapper = isExternal ? 'a' : Link;
          const wrapperProps = isExternal
            ? { href: section.to, target: "_blank", rel: "noopener noreferrer" }
            : { to: section.to };
          return (
          <Wrapper key={section.title} {...(wrapperProps as any)}>
            <CursorCard borderColor="hsl(var(--border))">
              <div className="p-5 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${section.color} flex items-center justify-center`}>
                    <section.icon className="h-4 w-4" strokeWidth={1.6} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
                </div>
                <h3 className="text-[14px] font-mondwest font-semibold mb-1">
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
          </Wrapper>
          );
        })}
      </CursorCardsContainer>
    </div>
  );
};

export default More;
