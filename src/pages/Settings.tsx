import { User, Shield, Mail, Bell, BookOpen, Plus, Search, Edit3, Trash2, X, ChevronDown, Tag, Clock, FileText, Eye } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

/* ======================== Data ======================== */

const teamMembers = [
  { name: "Maria Conti", email: "maria@recruitflow.com", role: "Admin", status: "Attivo" },
  { name: "Luca Bianchi", email: "luca@recruitflow.com", role: "Recruiter", status: "Attivo" },
  { name: "Anna Romano", email: "anna@recruitflow.com", role: "Recruiter", status: "Attivo" },
  { name: "Paolo Esposito", email: "paolo@recruitflow.com", role: "Viewer", status: "Invitato" },
];

const emailTemplates = [
  { name: "Conferma ricezione candidatura", subject: "Abbiamo ricevuto la tua candidatura", lastEdited: "5 Mar 2026", ai: true },
  { name: "Invito colloquio", subject: "Ti invitiamo a un colloquio", lastEdited: "8 Mar 2026", ai: true },
  { name: "Richiesta documentazione", subject: "Richiesta documenti aggiuntivi", lastEdited: "1 Mar 2026", ai: false },
  { name: "Esito positivo", subject: "Congratulazioni!", lastEdited: "10 Mar 2026", ai: true },
  { name: "Esito negativo", subject: "Aggiornamento sulla tua candidatura", lastEdited: "10 Mar 2026", ai: true },
];

const tabs = [
  { id: "team", label: "Team", icon: User },
  { id: "ruoli", label: "Ruoli", icon: Shield },
  { id: "email", label: "Template Email", icon: Mail },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "ai", label: "AI Config", icon: () => <AiIcon className="text-muted-foreground" size={16} /> },
];

const roleColors: Record<string, string> = {
  Admin: "bg-primary text-primary-foreground",
  Recruiter: "bg-accent text-accent-foreground",
  Viewer: "bg-muted text-muted-foreground",
};

/* ======================== Knowledge Base Types ======================== */

interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: "pubblicato" | "bozza";
}

const KB_CATEGORIES = [
  "Processo di Selezione",
  "Policy Aziendali",
  "Guide Operative",
  "FAQ Candidati",
  "Template e Modelli",
  "Onboarding",
  "Risorse Aziendali",
  "Branding & Employer Brand",
  "Storico Posizioni",
];

const defaultArticles: KBArticle[] = [
  {
    id: "1",
    title: "Processo di screening tecnico",
    content: "Il processo di screening tecnico prevede le seguenti fasi:\n\n1. **Revisione CV**: Analisi delle competenze tecniche e dell'esperienza.\n2. **Test tecnico**: Invio di un coding challenge da completare in 48h.\n3. **Colloquio tecnico**: Sessione di 60 minuti con il team lead.\n4. **Valutazione finale**: Score composito basato su test + colloquio.\n\nCriteri di valutazione:\n- Qualità del codice: 30%\n- Problem solving: 25%\n- Conoscenza framework: 25%\n- Comunicazione: 20%",
    category: "Processo di Selezione",
    tags: ["tecnico", "screening", "colloquio"],
    createdAt: "2026-03-01",
    updatedAt: "2026-03-15",
    status: "pubblicato",
  },
  {
    id: "2",
    title: "Policy smart working",
    content: "La nostra policy di smart working prevede:\n\n- **Hybrid model**: 3 giorni in ufficio, 2 da remoto\n- **Full remote**: Disponibile per ruoli specifici previa approvazione\n- **Orari flessibili**: Core hours 10:00-16:00\n- **Equipment**: Budget di €500 per setup home office\n\nPer i candidati, comunicare sempre la policy durante il primo colloquio.",
    category: "Policy Aziendali",
    tags: ["smart working", "remoto", "policy"],
    createdAt: "2026-02-20",
    updatedAt: "2026-03-10",
    status: "pubblicato",
  },
  {
    id: "3",
    title: "Guida al colloquio comportamentale",
    content: "Utilizzare il metodo STAR per strutturare le domande:\n\n- **Situation**: Descrivi la situazione\n- **Task**: Qual era il compito\n- **Action**: Cosa hai fatto\n- **Result**: Qual è stato il risultato\n\nDomande consigliate:\n1. Racconta di un progetto complesso che hai gestito\n2. Come gestisci i conflitti nel team?\n3. Descrivi una situazione in cui hai dovuto prendere una decisione difficile",
    category: "Guide Operative",
    tags: ["colloquio", "STAR", "comportamentale"],
    createdAt: "2026-03-05",
    updatedAt: "2026-03-12",
    status: "pubblicato",
  },
  {
    id: "4",
    title: "Template offerta economica",
    content: "Template per la preparazione dell'offerta:\n\n- RAL: [inserire range]\n- Benefit: Ticket restaurant €8/giorno, assicurazione sanitaria\n- Bonus: Performance bonus annuale fino al 10%\n- Equity: Stock options per ruoli senior\n- Welfare: Budget €1.000/anno\n\nNote: Verificare sempre il budget approvato con il Finance prima di inviare l'offerta.",
    category: "Template e Modelli",
    tags: ["offerta", "RAL", "benefit"],
    createdAt: "2026-03-08",
    updatedAt: "2026-03-08",
    status: "bozza",
  },
  {
    id: "5",
    title: "Checklist onboarding nuovo assunto",
    content: "Checklist primo giorno:\n\n- [ ] Account email aziendale\n- [ ] Accesso Slack e canali team\n- [ ] Setup workstation\n- [ ] Badge ufficio\n- [ ] Presentazione al team\n- [ ] Welcome kit\n\nPrima settimana:\n- [ ] Meeting 1:1 con manager\n- [ ] Tour degli uffici\n- [ ] Formazione strumenti interni\n- [ ] Assegnazione buddy\n- [ ] Obiettivi primo mese",
    category: "Onboarding",
    tags: ["onboarding", "checklist", "nuovo assunto"],
    createdAt: "2026-03-10",
    updatedAt: "2026-03-14",
    status: "pubblicato",
  },
  {
    id: "6",
    title: "Presentazione aziendale per candidati",
    content: "Materiali da condividere con i candidati:\n\n**Chi siamo**\n- Fondata nel 2018, 120+ dipendenti in 3 sedi (Milano, Roma, Barcellona)\n- Mission: Innovare il recruiting con l'AI\n- Settore: HR Tech / SaaS B2B\n\n**Cultura aziendale**\n- Valori: Trasparenza, Innovazione, Collaborazione, Crescita\n- Ambiente informale e inclusivo\n- Team internazionale (14 nazionalità)\n\n**Perché lavorare con noi**\n- Prodotto in forte crescita (+200% YoY)\n- Stack tecnologico moderno\n- Budget formazione illimitato\n- Team retreat semestrali",
    category: "Risorse Aziendali",
    tags: ["presentazione", "azienda", "cultura"],
    createdAt: "2026-02-15",
    updatedAt: "2026-03-16",
    status: "pubblicato",
  },
  {
    id: "7",
    title: "Organigramma e struttura team",
    content: "**Engineering** (45 persone)\n- Frontend Team: 12 dev (React, TypeScript)\n- Backend Team: 15 dev (Node.js, Python, Go)\n- Platform & Infra: 8 dev\n- QA & Testing: 5 persone\n- Engineering Manager: 5\n\n**Product** (15 persone)\n- Product Manager: 4\n- UX/UI Designer: 6\n- UX Researcher: 2\n- Product Analyst: 3\n\n**Sales & Marketing** (25 persone)\n- Sales: 12\n- Marketing: 8\n- Customer Success: 5\n\n**People & Operations** (10 persone)\n- HR & Recruiting: 5\n- Finance: 3\n- Legal: 2",
    category: "Risorse Aziendali",
    tags: ["organigramma", "team", "struttura"],
    createdAt: "2026-01-20",
    updatedAt: "2026-03-01",
    status: "pubblicato",
  },
  {
    id: "8",
    title: "Brand guidelines per job posting",
    content: "**Tone of Voice**\n- Professionale ma accessibile\n- Evitare gergo troppo tecnico nelle descrizioni\n- Usare linguaggio inclusivo (no pronomi di genere specifici)\n- Enfatizzare crescita e impatto\n\n**Visual Identity**\n- Logo: Usare sempre la versione orizzontale su sfondo chiaro\n- Colori primari: Navy, Coral accent\n- Font: Inter per web, SF Pro per presentazioni\n- Immagini: Foto reali del team, mai stock generiche\n\n**Template Job Description**\n1. Headline coinvolgente (no \"Cercasi...\")\n2. Chi siamo (2-3 righe)\n3. Cosa farai (bullet points concreti)\n4. Chi cerchiamo (requisiti must-have vs nice-to-have)\n5. Cosa offriamo (benefit e perks)\n6. Come candidarsi",
    category: "Branding & Employer Brand",
    tags: ["branding", "tone of voice", "visual identity", "job description"],
    createdAt: "2026-02-10",
    updatedAt: "2026-03-18",
    status: "pubblicato",
  },
  {
    id: "9",
    title: "Strategia Employer Branding 2026",
    content: "**Obiettivi Q1-Q2 2026**\n- Aumentare candidature spontanee del 30%\n- Migliorare Glassdoor rating da 4.1 a 4.5\n- Lanciare blog \"Life at Company\" con 2 articoli/mese\n\n**Canali attivi**\n- LinkedIn: Post 3x/settimana, employee advocacy program\n- Instagram: Behind the scenes, team spotlight\n- YouTube: Tech talk mensili, day-in-the-life video\n- Meetup & conferenze: 2 eventi/mese come sponsor\n\n**Metriche**\n- Career page views: target 5.000/mese\n- Application rate: target 8%\n- Offer acceptance rate: target 85%\n- Employee referral rate: target 25% delle assunzioni",
    category: "Branding & Employer Brand",
    tags: ["employer branding", "strategia", "social media"],
    createdAt: "2026-01-15",
    updatedAt: "2026-03-10",
    status: "pubblicato",
  },
  {
    id: "10",
    title: "Senior Frontend Developer (chiusa - Feb 2026)",
    content: "**Posizione chiusa il 28/02/2026**\n\nRisultati:\n- Candidature ricevute: 87\n- Screening completati: 34\n- Colloqui tecnici: 12\n- Offerte inviate: 2\n- Assunto: Marco Rossi (score 92%)\n\n**Tempo di chiusura**: 23 giorni\n**Costo per assunzione**: €2.400\n\n**Requisiti utilizzati**:\n- React/TypeScript 3+ anni\n- Esperienza con design system\n- Conoscenza testing (Jest, Cypress)\n\n**Note per future ricerche simili**:\n- Il coding challenge ha filtrato efficacemente (60% dropout)\n- LinkedIn Recruiter ha generato i candidati migliori\n- Range salariale competitivo: €45-55K RAL",
    category: "Storico Posizioni",
    tags: ["frontend", "developer", "chiusa", "report"],
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
    status: "pubblicato",
  },
  {
    id: "11",
    title: "Product Manager (chiusa - Gen 2026)",
    content: "**Posizione chiusa il 15/01/2026**\n\nRisultati:\n- Candidature ricevute: 62\n- Screening completati: 28\n- Colloqui: 8\n- Case study presentati: 4\n- Offerte inviate: 1\n- Assunta: Laura Bianchi (score 87%)\n\n**Tempo di chiusura**: 31 giorni\n**Costo per assunzione**: €3.100\n\n**Requisiti utilizzati**:\n- 4+ anni esperienza PM in SaaS B2B\n- Esperienza con metodologie Agile\n- Capacità analitiche (SQL, analytics tools)\n\n**Note**:\n- Il case study è stato il differenziatore chiave\n- Candidati da referral avevano score medio più alto (+15%)\n- Suggerimento: includere sempre un case study per ruoli PM",
    category: "Storico Posizioni",
    tags: ["product manager", "chiusa", "report", "case study"],
    createdAt: "2026-01-20",
    updatedAt: "2026-01-20",
    status: "pubblicato",
  },
  {
    id: "12",
    title: "Materiali e risorse per recruiter",
    content: "**Documenti condivisi**\n- 📁 Google Drive: /Recruiting/Templates\n- 📁 Notion: Wiki Recruiting Team\n- 📁 Figma: Employer Brand Assets\n\n**Tool stack**\n- ATS: RecruitFlow (questo sistema)\n- Sourcing: LinkedIn Recruiter, GitHub\n- Video interview: Zoom, Loom\n- Assessment: HackerRank, TestGorilla\n- Background check: Cerved\n\n**Contatti utili**\n- Legal (contratti): legal@company.com\n- Finance (budget): finance@company.com\n- IT (account setup): it-support@company.com\n- Marketing (employer brand): marketing@company.com\n\n**SLA interni**\n- Risposta candidato: entro 48h\n- Feedback post-colloquio: entro 24h\n- Offerta dopo decisione: entro 3 giorni lavorativi",
    category: "Risorse Aziendali",
    tags: ["risorse", "tool", "contatti", "SLA"],
    createdAt: "2026-02-01",
    updatedAt: "2026-03-17",
    status: "pubblicato",
  },
];

/* ======================== Knowledge Base Component ======================== */

function KnowledgeBase() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<KBArticle[]>(() => {
    const saved = localStorage.getItem("kb-articles");
    return saved ? JSON.parse(saved) : defaultArticles;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Editor state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState(KB_CATEGORIES[0]);
  const [editTags, setEditTags] = useState("");
  const [editStatus, setEditStatus] = useState<"pubblicato" | "bozza">("bozza");

  const saveArticles = (updated: KBArticle[]) => {
    setArticles(updated);
    localStorage.setItem("kb-articles", JSON.stringify(updated));
  };

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [articles, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const openCreate = () => {
    setEditTitle("");
    setEditContent("");
    setEditCategory(KB_CATEGORIES[0]);
    setEditTags("");
    setEditStatus("bozza");
    setIsCreating(true);
    setIsEditing(false);
    setSelectedArticle(null);
  };

  const openEdit = (article: KBArticle) => {
    setEditTitle(article.title);
    setEditContent(article.content);
    setEditCategory(article.category);
    setEditTags(article.tags.join(", "));
    setEditStatus(article.status);
    setIsEditing(true);
    setIsCreating(false);
    setSelectedArticle(article);
  };

  const saveArticle = () => {
    const now = new Date().toISOString().split("T")[0];
    const tags = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isCreating) {
      const newArticle: KBArticle = {
        id: Date.now().toString(),
        title: editTitle,
        content: editContent,
        category: editCategory,
        tags,
        createdAt: now,
        updatedAt: now,
        status: editStatus,
      };
      saveArticles([newArticle, ...articles]);
    } else if (isEditing && selectedArticle) {
      const updated = articles.map((a) =>
        a.id === selectedArticle.id
          ? { ...a, title: editTitle, content: editContent, category: editCategory, tags, status: editStatus, updatedAt: now }
          : a
      );
      saveArticles(updated);
    }

    setIsCreating(false);
    setIsEditing(false);
    setSelectedArticle(null);
  };

  const deleteArticle = (id: string) => {
    saveArticles(articles.filter((a) => a.id !== id));
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setIsEditing(false);
    if (!isCreating && selectedArticle) {
      // keep article selected in view mode
    } else {
      setSelectedArticle(null);
    }
  };

  const isFormOpen = isCreating || isEditing;
  const isViewing = selectedArticle && !isEditing && !isCreating;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-heading font-semibold">Knowledge Base</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {articles.length} {t("settings.kb.articles")} · {articles.filter((a) => a.status === "pubblicato").length} {t("settings.kb.published")}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("settings.kb.newArticle")}
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.6} />
          <input
            type="text"
            placeholder={t("settings.kb.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border-0 rounded-xl text-[12px] font-body placeholder:text-muted-foreground/40 focus:outline-none focus:bg-muted focus:ring-1 focus:ring-border transition-all"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`text-[10px] px-3 py-1.5 rounded-lg font-medium transition-all ${
            !selectedCategory
               ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          {t("settings.kb.all")} ({articles.length})
        </button>
        {KB_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === cat
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {cat} ({categoryCounts[cat] || 0})
          </button>
        ))}
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-2xl card-static p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-heading font-semibold">
                  {isCreating ? t("settings.kb.newArticle") : t("settings.kb.editArticle")}
                </h3>
                <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-body font-medium text-muted-foreground mb-1 block">{t("settings.kb.title")}</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder={t("settings.kb.titlePlaceholder")}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-[12px] font-body focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] font-body font-medium text-muted-foreground mb-1 block">{t("settings.kb.category")}</label>
                    <div className="relative">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-[12px] font-body focus:outline-none focus:ring-1 focus:ring-ring transition-all appearance-none cursor-pointer"
                      >
                        {KB_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[11px] font-body font-medium text-muted-foreground mb-1 block">{t("settings.kb.status")}</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditStatus("bozza")}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-medium transition-all ${
                          editStatus === "bozza"
                            ? "bg-muted text-foreground ring-1 ring-border"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {t("settings.kb.draft")}
                      </button>
                      <button
                        onClick={() => setEditStatus("pubblicato")}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-medium transition-all ${
                          editStatus === "pubblicato"
                            ? "bg-success text-success-foreground"
                            : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {t("settings.kb.publishedStatus")}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-body font-medium text-muted-foreground mb-1 block">{t("settings.kb.tags")}</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder={t("settings.kb.tagsPlaceholder")}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-[12px] font-body focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-body font-medium text-muted-foreground mb-1 block">{t("settings.kb.content")}</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder={t("settings.kb.contentPlaceholder")}
                    rows={10}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-[12px] font-body focus:outline-none focus:ring-1 focus:ring-ring transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-[12px] font-body font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                >
                  {t("settings.kb.cancel")}
                </button>
                <button
                  onClick={saveArticle}
                  disabled={!editTitle.trim() || !editContent.trim()}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCreating ? t("settings.kb.createArticle") : t("settings.kb.saveChanges")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article View */}
      <AnimatePresence>
        {isViewing && selectedArticle && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-2xl card-static overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <h3 className="text-[14px] font-heading font-semibold">{selectedArticle.title}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(selectedArticle)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteArticle(selectedArticle.id)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-3 bg-muted/20 flex items-center gap-3 text-[10px] border-b border-border">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Tag className="h-3 w-3" /> {selectedArticle.category}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" /> {t("settings.kb.updated")}: {selectedArticle.updatedAt}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-semibold ${
                  selectedArticle.status === "pubblicato"
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {selectedArticle.status === "pubblicato" ? t("settings.kb.publishedStatus") : t("settings.kb.draft")}
              </span>
            </div>

            <div className="px-6 py-5">
              <div className="text-[12px] leading-relaxed text-foreground/90 whitespace-pre-wrap font-body">
                {selectedArticle.content}
              </div>
              {selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-border">
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 bg-accent text-accent-foreground rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles List */}
      {!isViewing && (
        <div className="bg-card rounded-2xl card-static divide-y divide-border overflow-hidden">
          {filteredArticles.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-[12px] text-muted-foreground">
                {searchQuery || selectedCategory ? t("settings.kb.noResults") : t("settings.kb.empty")}
              </p>
              {!searchQuery && !selectedCategory && (
                <button onClick={openCreate} className="text-[11px] text-primary font-medium mt-2 hover:underline">
                  {t("settings.kb.createFirst")}
                </button>
              )}
            </div>
          ) : (
            filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ backgroundColor: "hsl(var(--muted) / 0.2)" }}
                className="px-6 py-4 flex items-center gap-4 cursor-pointer transition-all"
                onClick={() => {
                  setSelectedArticle(article);
                  setIsEditing(false);
                  setIsCreating(false);
                }}
              >
                <div className="h-10 w-10 rounded-xl bg-accent/50 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium truncate">{article.title}</p>
                    <span
                      className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
                        article.status === "pubblicato"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {article.status === "pubblicato" ? t("settings.kb.publishedStatus") : t("settings.kb.draft")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{article.category}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[10px] text-muted-foreground/60">{article.updatedAt}</span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-muted rounded font-medium text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-[8px] text-muted-foreground/50">+{article.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(article);
                    }}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-muted transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteArticle(article.id);
                    }}
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ======================== Settings Page ======================== */

const Settings = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "team");

  const localTabs = [
    { id: "team", label: t("settings.tab.team"), icon: User },
    { id: "ruoli", label: t("settings.tab.roles"), icon: Shield },
    { id: "email", label: t("settings.tab.email"), icon: Mail },
    { id: "knowledge", label: t("settings.tab.knowledge"), icon: BookOpen },
    { id: "ai", label: t("settings.tab.ai"), icon: () => <AiIcon className="text-muted-foreground" size={16} /> },
  ];

  useEffect(() => {
    if (tabFromUrl && localTabs.some(t => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("settings.title")}</TextShimmer></h1>
        <p className="text-[13px] text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </div>

      {/* Mobile tabs - horizontal scrollable */}
      <div className="lg:hidden overflow-x-auto -mx-4 px-4">
        <div className="flex gap-1 w-max bg-card border border-border rounded-xl p-1">
          {localTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar tabs */}
        <div className="hidden lg:block w-48 shrink-0 space-y-0.5">
          {localTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] w-full font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" strokeWidth={1.6} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === "team" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-heading font-semibold">{t("settings.team.title")}</h2>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm">
                  {t("settings.team.invite")}
                </button>
              </div>
              <div className="bg-card rounded-2xl card-static divide-y divide-border overflow-hidden">
                {teamMembers.map(m => (
                  <div key={m.email} className="px-6 py-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-accent/60 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-body font-semibold text-foreground/50">{m.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{m.email}</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${roleColors[m.role]}`}>{m.role}</span>
                    <span className={`text-[11px] ${m.status === "Attivo" ? "text-success font-medium" : "text-muted-foreground"}`}>
                      {m.status === "Attivo" ? t("settings.team.status.active") : t("settings.team.status.invited")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ruoli" && (
            <div className="space-y-5">
              <h2 className="text-[13px] font-heading font-semibold">{t("settings.roles.title")}</h2>
              <div className="space-y-4">
                {[
                  { role: "Admin", desc: t("settings.roles.admin.desc"), perms: [t("settings.perm.teamMgmt"), t("settings.perm.config"), t("settings.perm.crudCandidates"), t("settings.perm.crudPositions"), t("settings.perm.analytics"), t("settings.perm.aiConfig"), t("settings.perm.knowledgeBase")] },
                  { role: "Recruiter", desc: t("settings.roles.recruiter.desc"), perms: [t("settings.perm.crudCandidates"), t("settings.perm.crudPositions"), t("settings.perm.pipeline"), t("settings.perm.communications"), t("settings.perm.aiSearch"), t("settings.perm.knowledgeBase")] },
                  { role: "Viewer", desc: t("settings.roles.viewer.desc"), perms: [t("settings.perm.viewCandidates"), t("settings.perm.viewPositions"), t("settings.perm.viewAnalytics"), t("settings.perm.readKB")] },
                ].map(r => (
                  <div key={r.role} className="bg-card rounded-2xl p-6 card-static">
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${roleColors[r.role]}`}>{r.role}</span>
                    <p className="text-[12px] text-muted-foreground mt-3 leading-relaxed">{r.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {r.perms.map(p => (
                        <span key={p} className="text-[9px] px-2 py-0.5 bg-muted text-muted-foreground rounded-lg font-medium">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-heading font-semibold">{t("settings.email.title")}</h2>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm">
                  {t("settings.email.new")}
                </button>
              </div>
              <div className="bg-card rounded-2xl card-static divide-y divide-border overflow-hidden">
                {emailTemplates.map(t => (
                  <div key={t.name} className="px-6 py-4 flex items-center gap-4 hover:bg-muted/20 transition-all duration-200 cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-muted/70 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium">{t.name}</p>
                        {t.ai && <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border">AI</span>}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t.subject}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 font-medium">{t.lastEdited}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "knowledge" && <KnowledgeBase />}

          {activeTab === "ai" && (
            <div className="space-y-5">
              <h2 className="text-[13px] font-heading font-semibold">{t("settings.ai.title")}</h2>
              <div className="rounded-2xl p-6 space-y-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
                <div className="flex items-center gap-3">
                  <AiIcon className="text-muted-foreground" size={20} />
                  <div>
                    <p className="text-[13px] font-medium">RecruitFlow AI</p>
                    <p className="text-[11px] text-muted-foreground">{t("settings.ai.subtitle")}</p>
                  </div>
                  <div className="ml-auto h-[22px] w-[40px] rounded-full bg-ai relative cursor-pointer">
                    <span className="absolute right-[3px] top-[3px] h-4 w-4 rounded-full bg-white transition-transform shadow-sm" />
                  </div>
                </div>
                {[
                  { label: t("settings.ai.autoParsing"), desc: t("settings.ai.autoParsingDesc"), enabled: true },
                  { label: t("settings.ai.autoMatching"), desc: t("settings.ai.autoMatchingDesc"), enabled: true },
                  { label: t("settings.ai.emailSuggestions"), desc: t("settings.ai.emailSuggestionsDesc"), enabled: true },
                  { label: t("settings.ai.weeklyReport"), desc: t("settings.ai.weeklyReportDesc"), enabled: false },
                ].map((setting, i) => (
                  <div key={i} className={`flex items-center justify-between ${i > 0 ? "border-t border-border pt-5" : ""}`}>
                    <div>
                      <p className="text-[13px] font-medium">{setting.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{setting.desc}</p>
                    </div>
                    <button className={`h-[22px] w-[40px] rounded-full relative transition-colors shrink-0 ${setting.enabled ? "bg-ai" : "bg-muted"}`}>
                      <span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-all shadow-sm ${setting.enabled ? "right-[3px]" : "left-[3px]"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
