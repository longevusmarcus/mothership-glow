import { ArrowLeft, Mail, Phone, MapPin, FileText, Send, Briefcase, GraduationCap, Languages, Award, Loader2, Target, StickyNote, ChevronDown } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link, useParams } from "react-router-dom";
import { useState, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const sourceMeta: Record<string, { label: string; color: string; icon: string }> = {
  linkedin: { label: "LinkedIn", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "in" },
  indeed: { label: "Indeed", color: "bg-[#2164F3]/10 text-[#2164F3]", icon: "iD" },
  glassdoor: { label: "Glassdoor", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "gD" },
  infojobs: { label: "InfoJobs", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "iJ" },
  diretto: { label: "Diretto", color: "bg-muted text-muted-foreground", icon: "CV" },
  referral: { label: "Referral", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "Rf" },
};

const candidateData: Record<string, {
  name: string; email: string; phone: string; location: string; role: string; score: number; stage: string;
  source: string;
  experience: { company: string; role: string; period: string; description: string }[];
  education: { institution: string; degree: string; year: string }[];
  skills: string[]; languages: { lang: string; level: string }[];
  certifications: string[];
  communications: { date: string; type: string; subject: string; status: string }[];
  history: { date: string; action: string; by: string; ai?: boolean }[];
  aiAnalysis: { summary: string; strengths: string[]; gaps: string[]; recommendation: string };
  matchScores: { job: string; overall: number; skills: number; experience: number; education: number }[];
  notes: { date: string; text: string; by: string }[];
}> = {
  "1": {
    name: "Marco Rossi", email: "marco.rossi@email.com", phone: "+39 333 1234567",
    location: "Milano", role: "Frontend Developer", score: 92, stage: "Colloquio", source: "linkedin",
    experience: [
      { company: "TechCorp Italia", role: "Senior Frontend Developer", period: "2023 — Presente", description: "Sviluppo di applicazioni React/TypeScript, lead di un team di 4 sviluppatori." },
      { company: "Digital Agency Srl", role: "Frontend Developer", period: "2020 — 2023", description: "Sviluppo UI per clienti enterprise con React, Vue.js e Angular." },
      { company: "StartupX", role: "Junior Developer", period: "2018 — 2020", description: "Sviluppo full-stack con Node.js e React." },
    ],
    education: [
      { institution: "Politecnico di Milano", degree: "Laurea Magistrale in Informatica", year: "2018" },
      { institution: "Università degli Studi di Milano", degree: "Laurea Triennale in Informatica", year: "2016" },
    ],
    skills: ["React", "TypeScript", "Next.js", "CSS/SASS", "Node.js", "GraphQL", "Jest", "Figma"],
    languages: [{ lang: "Italiano", level: "Madrelingua" }, { lang: "Inglese", level: "C1" }, { lang: "Francese", level: "B1" }],
    certifications: ["AWS Certified Cloud Practitioner", "Meta Frontend Developer Certificate"],
    communications: [
      { date: "15 Mar 2026", type: "Email", subject: "Invito colloquio tecnico", status: "Inviata" },
      { date: "12 Mar 2026", type: "Email", subject: "Conferma ricezione candidatura", status: "Inviata" },
      { date: "10 Mar 2026", type: "Email", subject: "Richiesta disponibilità", status: "Letta" },
    ],
    history: [
      { date: "15 Mar 2026", action: "Spostato a Colloquio", by: "Maria Conti" },
      { date: "12 Mar 2026", action: "CV analizzato — Score 92%", by: "RecruitFlow AI", ai: true },
      { date: "12 Mar 2026", action: "Match calcolato per 4 posizioni attive", by: "RecruitFlow AI", ai: true },
      { date: "10 Mar 2026", action: "Candidatura ricevuta via LinkedIn", by: "Sistema" },
    ],
    aiAnalysis: {
      summary: "Profilo senior con forte expertise in React/TypeScript e comprovata capacità di leadership tecnica. 5 anni di esperienza progressiva dal full-stack al frontend specializzato.",
      strengths: ["React/TypeScript avanzato con 5+ anni", "Esperienza di leadership (team lead)", "Certificazioni rilevanti (AWS, Meta)", "Background full-stack solido"],
      gaps: ["Nessuna esperienza diretta con design system enterprise", "Livello francese B1 potrebbe non bastare per clienti francofoni"],
      recommendation: "Forte candidato per Senior Frontend Developer. Consigliato colloquio tecnico su architettura React e gestione team. Score elevato (92%) supportato da match competenze e progressione di carriera coerente.",
    },
    matchScores: [
      { job: "Senior Frontend Developer", overall: 92, skills: 95, experience: 90, education: 88 },
      { job: "Full Stack Engineer", overall: 78, skills: 72, experience: 85, education: 80 },
      { job: "UX/UI Designer", overall: 35, skills: 20, experience: 30, education: 55 },
    ],
    notes: [
      { date: "15 Mar 2026", text: "Ottima impressione al primo screening telefonico. Molto motivato.", by: "Maria Conti" },
      { date: "12 Mar 2026", text: "CV ben strutturato, esperienza coerente con la posizione.", by: "Luca Bianchi" },
    ],
  },
  "2": {
    name: "Laura Bianchi", email: "laura.b@email.com", phone: "+39 339 9876543",
    location: "Roma", role: "Product Manager", score: 87, stage: "Screening", source: "indeed",
    experience: [
      { company: "InnovateTech", role: "Product Manager", period: "2021 — Presente", description: "Gestione roadmap prodotto, coordinamento team cross-funzionali." },
      { company: "ConsultCo", role: "Business Analyst", period: "2019 — 2021", description: "Analisi requisiti e definizione specifiche funzionali." },
    ],
    education: [
      { institution: "LUISS Guido Carli", degree: "MBA", year: "2019" },
      { institution: "Sapienza Università di Roma", degree: "Laurea in Economia", year: "2017" },
    ],
    skills: ["Agile/Scrum", "Jira", "Analytics", "SQL", "Figma", "Stakeholder Management"],
    languages: [{ lang: "Italiano", level: "Madrelingua" }, { lang: "Inglese", level: "C2" }],
    certifications: ["Certified Scrum Product Owner (CSPO)", "Google Analytics Certification"],
    communications: [
      { date: "14 Mar 2026", type: "Email", subject: "Conferma ricezione candidatura", status: "Inviata" },
    ],
    history: [
      { date: "14 Mar 2026", action: "Candidatura ricevuta", by: "Sistema" },
      { date: "14 Mar 2026", action: "CV analizzato — Score 87%", by: "RecruitFlow AI", ai: true },
      { date: "14 Mar 2026", action: "Match calcolato per 4 posizioni attive", by: "RecruitFlow AI", ai: true },
    ],
    aiAnalysis: {
      summary: "Product Manager con solida esperienza in metodologie agili e gestione stakeholder. MBA e background analitico forte.",
      strengths: ["CSPO certificata con esperienza Agile/Scrum", "Inglese C2 — comunicazione internazionale", "Background analitico (SQL, Analytics)", "MBA da istituto prestigioso"],
      gaps: ["Esperienza PM limitata a 3 anni", "Nessuna esperienza in settori tech B2B"],
      recommendation: "Ottimo match per Product Manager. Procedere con screening approfondito su esperienza gestione roadmap e interazione con team engineering.",
    },
    matchScores: [
      { job: "Product Manager", overall: 87, skills: 85, experience: 82, education: 95 },
      { job: "Business Analyst", overall: 79, skills: 80, experience: 85, education: 70 },
    ],
    notes: [],
  },
};

const defaultCandidate = candidateData["1"];

const stageColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

const stageOptions = ["Screening", "Colloquio", "Shortlist", "Placement"];

const CandidateDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profilo");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const candidateBase = candidateData[id || "1"] || defaultCandidate;
  const [currentStage, setCurrentStage] = useState(candidateBase.stage);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [notes, setNotes] = useState(candidateBase.notes || []);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newNote, setNewNote] = useState("");

  const candidate = { ...candidateBase, stage: currentStage };

  const inputClass = "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-body placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all";

  const stageDisplayName = (stage: string) => {
    const map: Record<string, TranslationKey> = {
      Screening: "stage.screening",
      Colloquio: "stage.interview",
      Shortlist: "stage.shortlist",
      Placement: "stage.placement",
    };
    return map[stage] ? t(map[stage]) : stage;
  };

  const tabs = [
    { id: "profilo", label: t("candidateDetail.profile") },
    { id: "ai", label: t("candidateDetail.aiAnalysis") },
    { id: "cv", label: t("candidateDetail.cvDocs") },
    { id: "comunicazioni", label: t("candidateDetail.communications") },
    { id: "storico", label: t("candidateDetail.history") },
  ];

  const generateEmailDraft = useCallback(() => {
    setGeneratingEmail(true);
    setEmailDraft("");
    const draft = `Gentile ${candidate.name},\n\nGrazie per aver inviato la Sua candidatura per la posizione di ${candidate.role}.\n\nAbbiamo analizzato il Suo profilo e siamo rimasti colpiti dalla Sua esperienza in ${candidate.skills.slice(0, 3).join(", ")}. Il Suo background presso ${candidate.experience[0]?.company || "la Sua azienda attuale"} è particolarmente rilevante per la nostra posizione.\n\nSaremmo lieti di invitarLa a un colloquio tecnico per approfondire la Sua candidatura. Le proporrei le seguenti date:\n\n• Lunedì 24 Marzo 2026, ore 10:00\n• Mercoledì 26 Marzo 2026, ore 14:00\n• Venerdì 28 Marzo 2026, ore 11:00\n\nIl colloquio si svolgerà presso la nostra sede di Milano e avrà una durata di circa 60 minuti.\n\nResta a disposizione per qualsiasi domanda.\n\nCordiali saluti,\nTeam Recruiting`;
    let i = 0;
    const interval = setInterval(() => {
      if (i < draft.length) {
        setEmailDraft(draft.slice(0, i + 1));
        i++;
      } else {
        setGeneratingEmail(false);
        clearInterval(interval);
      }
    }, 8);
  }, [candidate]);

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage);
    setShowStageDropdown(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleDateString("it-IT", { month: "short" })} ${now.getFullYear()}`;
    setNotes(prev => [{ date: dateStr, text: newNote.trim(), by: "Tu" }, ...prev]);
    setNewNote("");
    setShowNoteInput(false);
  };

  return (
    <div className="space-y-6">
      <Link to="/candidates" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
        {t("candidates.backToCandidates")}
      </Link>

      {/* Header */}
      <div className="bg-card rounded-2xl p-4 sm:p-7 card-static">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-accent/60 flex items-center justify-center">
              <span className="text-lg font-heading font-semibold text-foreground/50">
                {candidate.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{candidate.name}</TextShimmer></h1>
                <AiIcon className="text-muted-foreground" size={16} />
              </div>
              <p className="text-[13px] text-muted-foreground">{candidate.role}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" strokeWidth={1.6} /><span className="truncate max-w-[150px] sm:max-w-none">{candidate.email}</span></span>
                <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" strokeWidth={1.6} />{candidate.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" strokeWidth={1.6} />{candidate.location}</span>
                {candidate.source && sourceMeta[candidate.source] && (
                  <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-semibold ${sourceMeta[candidate.source].color}`}>
                    <span className="text-[8px] font-bold">{sourceMeta[candidate.source].icon}</span>
                    via {sourceMeta[candidate.source].label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <div className="relative">
              <button
                onClick={() => setShowStageDropdown(!showStageDropdown)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all hover:opacity-80 ${stageColors[candidate.stage]}`}
              >
                {stageDisplayName(candidate.stage)}
                <ChevronDown className="h-3 w-3" strokeWidth={1.6} />
              </button>
              {showStageDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowStageDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                    {stageOptions.map(stage => (
                      <button
                        key={stage}
                        onClick={() => handleStageChange(stage)}
                        className={`w-full text-left px-4 py-2.5 text-[11px] font-medium transition-all hover:bg-muted/50 flex items-center gap-2 ${stage === currentStage ? "text-foreground bg-muted/30" : "text-muted-foreground"}`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${stage === "Screening" ? "bg-muted-foreground" : stage === "Colloquio" ? "bg-accent" : stage === "Shortlist" ? "bg-secondary" : "bg-primary"}`} />
                        {stageDisplayName(stage)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[24px] font-heading font-semibold tabular-nums">{candidate.score}%</span>
              <span className="text-[10px] text-muted-foreground font-medium">AI Score</span>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex gap-2.5 mt-5">
          <button onClick={() => { setShowEmailModal(true); setEmailDraft(""); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm">
            <Send className="h-3 w-3" strokeWidth={1.6} /> {t("candidateDetail.sendEmail")}
          </button>
          <button onClick={() => setShowNoteInput(true)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">
            <StickyNote className="h-3 w-3" strokeWidth={1.6} /> {t("candidateDetail.addNote")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">
            <FileText className="h-3 w-3" strokeWidth={1.6} /> {t("candidateDetail.downloadCv")}
          </button>
        </div>

        {/* Inline Note Input */}
        {showNoteInput && (
          <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border space-y-3">
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder={t("candidateDetail.writeNote")}
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowNoteInput(false); setNewNote(""); }} className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("candidateDetail.cancel")}
              </button>
              <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-[11px] font-medium hover:opacity-90 transition-all disabled:opacity-50">
                {t("candidateDetail.saveNote")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Section */}
      {notes.length > 0 && (
        <div className="bg-card rounded-2xl p-5 card-static">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
            <h2 className="text-[12px] font-heading font-semibold">{t("candidateDetail.notes")} ({notes.length})</h2>
          </div>
          <div className="space-y-3">
            {notes.map((note, i) => (
              <div key={i} className="p-3 bg-muted/20 rounded-lg border border-border/50">
                <p className="text-[12px] text-foreground/80 leading-relaxed">{note.text}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{note.by} · {note.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-0 w-max sm:w-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-3 text-[12px] font-body font-medium transition-all border-b-2 -mb-px flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.id === "ai" && <AiIcon className="text-muted-foreground" size={12} />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "profilo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card rounded-2xl p-6 card-static">
              <div className="flex items-center gap-2.5 mb-5">
                <Briefcase className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                <h2 className="text-[13px] font-heading font-semibold">{t("candidateDetail.workExperience")}</h2>
              </div>
              <div className="space-y-5">
                {candidate.experience.map((exp, i) => (
                  <div key={i} className={i > 0 ? "border-t border-border pt-5" : ""}>
                    <p className="text-[13px] font-medium">{exp.role}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{exp.company} · {exp.period}</p>
                    <p className="text-[12px] text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 card-static">
              <div className="flex items-center gap-2.5 mb-5">
                <GraduationCap className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                <h2 className="text-[13px] font-heading font-semibold">{t("candidateDetail.education")}</h2>
              </div>
              <div className="space-y-4">
                {candidate.education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-[13px] font-medium">{edu.degree}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{edu.institution} · {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-card rounded-2xl p-5 card-static">
              <h2 className="text-[13px] font-heading font-semibold mb-4">{t("candidateDetail.skills")}</h2>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map(s => (
                  <span key={s} className="text-[10px] px-2.5 py-1 bg-muted text-muted-foreground rounded-lg font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 card-static">
              <div className="flex items-center gap-2.5 mb-4">
                <Languages className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                <h2 className="text-[13px] font-heading font-semibold">{t("candidateDetail.languages")}</h2>
              </div>
              <div className="space-y-2.5">
                {candidate.languages.map(l => (
                  <div key={l.lang} className="flex justify-between text-[13px]">
                    <span>{l.lang}</span>
                    <span className="text-muted-foreground text-[11px] font-medium">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 card-static">
              <div className="flex items-center gap-2.5 mb-4">
                <Award className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                <h2 className="text-[13px] font-heading font-semibold">{t("candidateDetail.certifications")}</h2>
              </div>
              <div className="space-y-2">
                {candidate.certifications.map(c => (
                  <p key={c} className="text-[12px] text-muted-foreground leading-relaxed">{c}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Tab */}
      {activeTab === "ai" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6 border border-border bg-gradient-to-br from-muted/50 via-transparent to-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <AiIcon className="text-muted-foreground" size={16} />
              <h2 className="text-[14px] font-heading font-semibold text-foreground/80">{t("candidateDetail.fullAiAnalysis")}</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border">Powered by AI</span>
            </div>
            <p className="text-[13px] text-foreground/80 leading-relaxed">{candidate.aiAnalysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-card rounded-2xl p-6 card-static">
              <h3 className="text-[13px] font-heading font-semibold mb-4 flex items-center gap-2 text-success">
                <div className="h-2 w-2 rounded-full bg-success" /> {t("candidateDetail.strengths")}
              </h3>
              <ul className="space-y-2.5">
                {candidate.aiAnalysis.strengths.map((s, i) => (
                  <li key={i} className="text-[12px] text-foreground/80 flex items-start gap-2.5 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-success/40 mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-6 card-static">
              <h3 className="text-[13px] font-heading font-semibold mb-4 flex items-center gap-2 text-warning">
                <div className="h-2 w-2 rounded-full bg-warning" /> {t("candidateDetail.areasOfAttention")}
              </h3>
              <ul className="space-y-2.5">
                {candidate.aiAnalysis.gaps.map((g, i) => (
                  <li key={i} className="text-[12px] text-foreground/80 flex items-start gap-2.5 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning/40 mt-1.5 shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 card-static">
            <h3 className="text-[13px] font-heading font-semibold mb-3">{t("candidateDetail.aiRecommendation")}</h3>
            <p className="text-[12px] text-foreground/80 leading-relaxed">{candidate.aiAnalysis.recommendation}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 card-static">
            <div className="flex items-center gap-2 mb-5">
              <Target className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
              <h3 className="text-[13px] font-heading font-semibold">{t("candidateDetail.matchScoreByPosition")}</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border">AI</span>
            </div>
            <div className="space-y-5">
              {candidate.matchScores.map((m, i) => (
                <div key={i} className={i > 0 ? "border-t border-border pt-5" : ""}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-medium">{m.job}</span>
                    <span className="text-[16px] font-heading font-semibold tabular-nums">{m.overall}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: t("candidateDetail.skills"), value: m.skills },
                      { label: t("candidates.experience"), value: m.experience },
                      { label: t("candidateDetail.education"), value: m.education },
                    ].map(sub => (
                      <div key={sub.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground font-medium">{sub.label}</span>
                          <span className="text-[10px] font-semibold tabular-nums">{sub.value}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-ai/30 rounded-full transition-all" style={{ width: `${sub.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "cv" && (
        <div className="bg-card rounded-2xl p-10 text-center card-static">
          <div className="h-14 w-14 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto mb-5">
            <FileText className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-[14px] font-heading font-semibold mb-1">{t("candidateDetail.cvOf")} {candidate.name}</h2>
          <p className="text-[11px] text-muted-foreground mb-1">{t("candidateDetail.lastUpdate")}: 10 Marzo 2026</p>
          <p className="text-[10px] text-muted-foreground font-medium mb-6 flex items-center justify-center gap-1"><AiIcon className="text-muted-foreground" size={12} /> {t("candidateDetail.parsedByAi")} — {candidate.skills.length} {t("candidateDetail.skillsExtracted")}, {candidate.experience.length} {t("candidateDetail.experiencesExtracted")}</p>
          <div className="flex justify-center gap-2.5">
            <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm">{t("candidateDetail.viewCv")}</button>
            <button className="px-5 py-2.5 border border-border rounded-xl text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-all">{t("candidateDetail.downloadPdf")}</button>
          </div>
        </div>
      )}

      {activeTab === "comunicazioni" && (
        <div className="space-y-5">
          <div className="flex justify-end">
            <button onClick={() => { setShowEmailModal(true); setEmailDraft(""); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm">
              <Send className="h-3 w-3" strokeWidth={1.6} /> {t("candidateDetail.newEmail")}
            </button>
          </div>
          <div className="bg-card rounded-2xl card-static divide-y divide-border overflow-hidden">
            {candidate.communications.map((com, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-muted/70 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium">{com.subject}</p>
                  <p className="text-[11px] text-muted-foreground">{com.type} · {com.date}</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-lg bg-muted text-muted-foreground font-medium">{com.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "storico" && (
        <div className="bg-card rounded-2xl p-7 card-static">
          <div className="space-y-0">
            {candidate.history.map((h, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className={`h-2.5 w-2.5 rounded-full ${h.ai ? "bg-foreground/40" : "bg-muted-foreground/30"}`} />
                  {i < candidate.history.length - 1 && <div className="w-px h-10 bg-border" />}
                </div>
                <div className="pb-5">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium">{h.action}</p>
                    {h.ai && <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border">AI</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{h.date} · {h.by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-foreground/8 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !generatingEmail && setShowEmailModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg p-7 space-y-5 card-static shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-heading font-semibold">{t("candidateDetail.sendEmailTo")} {candidate.name}</h2>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground uppercase tracking-wider border border-border flex items-center gap-1"><AiIcon size={10} /> AI Draft</span>
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground mb-1.5 tracking-wider uppercase font-semibold">{t("candidateDetail.template")}</label>
              <select className={inputClass}>
                <option>{t("candidateDetail.selectTemplate")}</option>
                <option>{t("candidateDetail.tpl.confirmReceipt")}</option>
                <option>{t("candidateDetail.tpl.interviewInvite")}</option>
                <option>{t("candidateDetail.tpl.docRequest")}</option>
                <option>{t("candidateDetail.tpl.positiveOutcome")}</option>
                <option>{t("candidateDetail.tpl.negativeOutcome")}</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground mb-1.5 tracking-wider uppercase font-semibold">{t("candidateDetail.subject")}</label>
              <input type="text" className={inputClass} placeholder={t("candidateDetail.subjectPlaceholder")} defaultValue={emailDraft ? `Invito colloquio — ${candidate.role}` : ""} />
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground mb-1.5 tracking-wider uppercase font-semibold">{t("candidateDetail.message")}</label>
              <textarea
                rows={8}
                className={`${inputClass} resize-none`}
                placeholder={t("candidateDetail.messagePlaceholder")}
                value={emailDraft}
                onChange={e => setEmailDraft(e.target.value)}
              />
              {generatingEmail && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
                  <span className="text-[10px] text-muted-foreground font-medium">{t("candidateDetail.aiGeneratingDraft")}</span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2.5 pt-1">
              <button onClick={() => setShowEmailModal(false)} className="px-4 py-2.5 text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("candidateDetail.cancel")}
              </button>
              <button onClick={generateEmailDraft} disabled={generatingEmail} className="flex items-center gap-1.5 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-[12px] font-body font-medium hover:bg-muted transition-all disabled:opacity-50">
                <AiIcon size={12} /> {t("candidateDetail.generateEmail")}
              </button>
              <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm">
                {t("candidateDetail.send")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
