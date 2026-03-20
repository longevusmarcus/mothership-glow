import { Search, Upload, X, FileText, CheckCircle, Loader2, ExternalLink, Building2, MapPin, GraduationCap, Briefcase, ChevronRight, List, KanbanSquare, Filter } from "lucide-react";
import { toast } from "sonner";
import { CleanMotionBackground } from "@/components/ui/animated-tabs-background";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CandidatesKanban from "@/components/candidates/CandidatesKanban";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";

const jobPositions = [
  "Senior Frontend Engineer",
  "Product Manager",
  "UX/UI Designer",
  "Senior Backend Engineer",
  "Data Analyst",
  "DevOps Engineer",
  "Full Stack Developer",
];

const sourceMeta: Record<string, { label: string; color: string; icon: string }> = {
  linkedin: { label: "LinkedIn", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "in" },
  indeed: { label: "Indeed", color: "bg-[#2164F3]/10 text-[#2164F3]", icon: "iD" },
  glassdoor: { label: "Glassdoor", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "gD" },
  infojobs: { label: "InfoJobs", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "iJ" },
  diretto: { label: "Diretto", color: "bg-muted text-muted-foreground", icon: "CV" },
  referral: { label: "Referral", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "Rf" },
};

const candidates = [
  {
    id: 1, name: "Marco Rossi", email: "marco.rossi@email.com", role: "Frontend Developer",
    company: "TechFlow Srl", jobTitle: "Senior Frontend Engineer", location: "Milano",
    linkedin: "linkedin.com/in/mrossi", skills: ["React", "TypeScript", "CSS", "Next.js"],
    experience: "5 anni", score: 92, stage: "Colloquio", aiParsed: true,
    jobPosition: "Senior Frontend Engineer", source: "linkedin",
    pastEmployers: ["Digital Agency SpA", "WebCraft Srl"],
    education: "Politecnico di Milano — Ing. Informatica",
    workHistory: [
      { role: "Senior Frontend Engineer", company: "TechFlow Srl", period: "2023 — Presente" },
      { role: "Frontend Developer", company: "Digital Agency SpA", period: "2020 — 2023" },
    ],
    matchCriteria: { currentRole: true, location: true, skills: true },
  },
  {
    id: 2, name: "Laura Bianchi", email: "laura.b@email.com", role: "Product Manager",
    company: "InnovaHub", jobTitle: "Senior Product Manager", location: "Roma",
    linkedin: "linkedin.com/in/lbianchi", skills: ["Agile", "Jira", "Analytics", "SQL"],
    experience: "7 anni", score: 87, stage: "Screening", aiParsed: true,
    jobPosition: "Product Manager", source: "indeed",
    pastEmployers: ["Startup Factory", "Accenture"],
    education: "LUISS — Economia e Management",
    workHistory: [
      { role: "Senior Product Manager", company: "InnovaHub", period: "2022 — Presente" },
      { role: "Product Manager", company: "Startup Factory", period: "2019 — 2022" },
    ],
    matchCriteria: { currentRole: true, location: false, skills: true },
  },
  {
    id: 3, name: "Alessandro Verdi", email: "a.verdi@email.com", role: "UX Designer",
    company: "DesignStudio", jobTitle: "Lead UX Designer", location: "Remote",
    linkedin: "linkedin.com/in/averdi", skills: ["Figma", "User Research", "Prototyping"],
    experience: "4 anni", score: 78, stage: "Shortlist", aiParsed: false,
    jobPosition: "UX/UI Designer", source: "diretto",
    pastEmployers: ["Creative Lab"],
    education: "IED Milano — Design della Comunicazione",
    workHistory: [
      { role: "Lead UX Designer", company: "DesignStudio", period: "2022 — Presente" },
      { role: "UX Designer", company: "Creative Lab", period: "2020 — 2022" },
    ],
    matchCriteria: { currentRole: true, location: true, skills: false },
  },
  {
    id: 4, name: "Giulia Neri", email: "giulia.neri@email.com", role: "Backend Developer",
    company: "CloudScale SpA", jobTitle: "Senior Backend Engineer", location: "Milano",
    linkedin: "linkedin.com/in/gneri", skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    experience: "6 anni", score: 95, stage: "Colloquio", aiParsed: true,
    jobPosition: "Senior Backend Engineer", source: "linkedin",
    pastEmployers: ["DataCore Srl", "Fintech Solutions"],
    education: "Università di Bologna — Informatica",
    workHistory: [
      { role: "Senior Backend Engineer", company: "CloudScale SpA", period: "2022 — Presente" },
      { role: "Backend Developer", company: "DataCore Srl", period: "2019 — 2022" },
    ],
    matchCriteria: { currentRole: true, location: true, skills: true },
  },
  {
    id: 5, name: "Francesco Russo", email: "f.russo@email.com", role: "Data Analyst",
    company: "Analytics Pro", jobTitle: "Data Analyst", location: "Torino",
    linkedin: "linkedin.com/in/frusso", skills: ["SQL", "Python", "Tableau"],
    experience: "3 anni", score: 71, stage: "Screening", aiParsed: false,
    jobPosition: "Data Analyst", source: "glassdoor",
    pastEmployers: ["DataViz Srl"],
    education: "Università di Torino — Statistica",
    workHistory: [
      { role: "Data Analyst", company: "Analytics Pro", period: "2023 — Presente" },
      { role: "Junior Analyst", company: "DataViz Srl", period: "2021 — 2023" },
    ],
    matchCriteria: { currentRole: true, location: false, skills: false },
  },
  {
    id: 6, name: "Elena Colombo", email: "elena.c@email.com", role: "DevOps Engineer",
    company: "InfraCloud", jobTitle: "Senior DevOps Engineer", location: "Milano",
    linkedin: "linkedin.com/in/ecolombo", skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
    experience: "5 anni", score: 88, stage: "Shortlist", aiParsed: true,
    jobPosition: "DevOps Engineer", source: "referral",
    pastEmployers: ["SysOps Italia", "CloudNet"],
    education: "Politecnico di Torino — Ing. Informatica",
    workHistory: [
      { role: "Senior DevOps Engineer", company: "InfraCloud", period: "2022 — Presente" },
      { role: "DevOps Engineer", company: "SysOps Italia", period: "2020 — 2022" },
    ],
    matchCriteria: { currentRole: true, location: true, skills: true },
  },
  {
    id: 7, name: "Luca Fontana", email: "luca.f@email.com", role: "Frontend Developer",
    company: "WebWorks", jobTitle: "Frontend Developer", location: "Firenze",
    linkedin: "linkedin.com/in/lfontana", skills: ["Vue.js", "JavaScript", "SASS"],
    experience: "4 anni", score: 74, stage: "Screening", aiParsed: false,
    jobPosition: "Senior Frontend Engineer", source: "infojobs",
    pastEmployers: ["Digital Solutions"],
    education: "Università di Firenze — Informatica",
    workHistory: [
      { role: "Frontend Developer", company: "WebWorks", period: "2022 — Presente" },
      { role: "Junior Developer", company: "Digital Solutions", period: "2020 — 2022" },
    ],
    matchCriteria: { currentRole: true, location: false, skills: false },
  },
  {
    id: 8, name: "Sara Mancini", email: "sara.m@email.com", role: "Full Stack Developer",
    company: "AppFactory", jobTitle: "Lead Full Stack Developer", location: "Milano",
    linkedin: "linkedin.com/in/smancini", skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    experience: "6 anni", score: 91, stage: "Placement", aiParsed: true,
    jobPosition: "Full Stack Developer", source: "linkedin",
    pastEmployers: ["CodeBase Srl", "TechStart"],
    education: "Università di Milano — Informatica",
    workHistory: [
      { role: "Lead Full Stack Developer", company: "AppFactory", period: "2022 — Presente" },
      { role: "Full Stack Developer", company: "CodeBase Srl", period: "2019 — 2022" },
    ],
    matchCriteria: { currentRole: true, location: true, skills: true },
  },
  {
    id: 9, name: "Andrea Moretti", email: "a.moretti@email.com", role: "Backend Developer",
    company: "ServerPro SpA", jobTitle: "Backend Engineer", location: "Roma",
    linkedin: "linkedin.com/in/amoretti", skills: ["Java", "Spring Boot", "Kafka", "PostgreSQL"],
    experience: "8 anni", score: 84, stage: "Screening", aiParsed: true,
    jobPosition: "Senior Backend Engineer", source: "indeed",
    pastEmployers: ["Enterprise Solutions", "IBM Italia"],
    education: "Sapienza Roma — Ing. Informatica",
    workHistory: [
      { role: "Backend Engineer", company: "ServerPro SpA", period: "2021 — Presente" },
      { role: "Senior Developer", company: "Enterprise Solutions", period: "2018 — 2021" },
    ],
    matchCriteria: { currentRole: true, location: false, skills: true },
  },
  {
    id: 10, name: "Chiara Ferrari", email: "c.ferrari@email.com", role: "UX Designer",
    company: "PixelPerfect", jobTitle: "Senior UX/UI Designer", location: "Milano",
    linkedin: "linkedin.com/in/cferrari", skills: ["Figma", "Sketch", "Design Systems", "CSS"],
    experience: "5 anni", score: 82, stage: "Colloquio", aiParsed: true,
    jobPosition: "UX/UI Designer", source: "diretto",
    pastEmployers: ["UX Agency", "Freelance"],
    education: "NABA Milano — Design",
    workHistory: [
      { role: "Senior UX/UI Designer", company: "PixelPerfect", period: "2023 — Presente" },
      { role: "UX Designer", company: "UX Agency", period: "2020 — 2023" },
    ],
    matchCriteria: { currentRole: true, location: true, skills: true },
  },
];

const stageColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

const MatchBadge = ({ match }: { match: boolean }) => (
  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${match ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground/50"}`}>
    {match ? "Match" : "—"}
  </span>
);

const useParsingSteps = () => {
  const { t } = useLanguage();
  return [
    { label: t("candidates.parsing.reading"), duration: 800 },
    { label: t("candidates.parsing.personal"), duration: 600 },
    { label: t("candidates.parsing.experience"), duration: 900 },
    { label: t("candidates.parsing.skills"), duration: 700 },
    { label: t("candidates.parsing.education"), duration: 500 },
    { label: t("candidates.parsing.languages"), duration: 600 },
    { label: t("candidates.parsing.normalizing"), duration: 400 },
    { label: t("candidates.parsing.scoring"), duration: 800 },
  ];
};

const parsedResult = {
  name: "Davide Marchetti",
  email: "d.marchetti@email.com",
  phone: "+39 347 5551234",
  location: "Torino",
  role: "Senior Full Stack Developer",
  experience: [
    { company: "CloudTech Srl", role: "Senior Full Stack Developer", period: "2022 — Presente" },
    { company: "WebFactory SpA", role: "Full Stack Developer", period: "2019 — 2022" },
    { company: "Digital Solutions", role: "Junior Developer", period: "2017 — 2019" },
  ],
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "GraphQL", "Redis"],
  education: "Laurea Magistrale in Ingegneria Informatica — Politecnico di Torino (2017)",
  languages: ["Italiano (Madrelingua)", "Inglese (C1)", "Spagnolo (B1)"],
  certifications: ["AWS Solutions Architect Associate", "MongoDB Certified Developer"],
  score: 89,
};

const Candidates = () => {
  const { t, locale } = useLanguage();
  const parsingSteps = useParsingSteps();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const [searchQuery, setSearchQuery] = useState("");
  const initialFilter = statusParam === "valutazione" ? "Screening" : statusParam === "assunti" ? "Placement" : statusParam === "archived" ? "archived" : "all";
  const [stageFilter, setStageFilter] = useState<string>(initialFilter);
  const [jobPositionFilter, setJobPositionFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadJobPosition, setUploadJobPosition] = useState<string>("");
  const [bulkFiles, setBulkFiles] = useState<string[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState(-1);
  const [parsingComplete, setParsingComplete] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | null>(null);

  useEffect(() => {
    const newFilter = statusParam === "valutazione" ? "Screening" : statusParam === "assunti" ? "Placement" : statusParam === "archived" ? "archived" : "all";
    setStageFilter(newFilter);
  }, [statusParam]);

  const filtered = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = stageFilter === "all" || c.stage === stageFilter;
    const matchesJob = jobPositionFilter === "all" || c.jobPosition === jobPositionFilter;
    const matchesSource = sourceFilter === "all" || c.source === sourceFilter;
    return matchesSearch && matchesStage && matchesJob && matchesSource;
  });

  const simulatedFileNames = ["Marco_Rossi_CV.pdf", "Laura_Bianchi_CV.pdf", "Giulia_Neri_CV.docx", "Sara_Mancini_CV.pdf", "Elena_Colombo_CV.pdf"];

  const handleBulkSelect = useCallback(() => {
    // Simulate selecting 3-5 random files
    const count = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...simulatedFileNames].sort(() => Math.random() - 0.5).slice(0, count);
    setBulkFiles(shuffled);
  }, []);

  const startParsing = useCallback(() => {
    setParsing(true);
    setParsingStep(0);
    setParsingComplete(false);
    setCurrentFileIndex(0);
  }, []);

  useEffect(() => {
    if (!parsing || parsingStep < 0) return;
    if (parsingStep >= parsingSteps.length) {
      setParsing(false);
      setParsingComplete(true);
      return;
    }
    const timer = setTimeout(() => {
      setParsingStep(prev => prev + 1);
    }, parsingSteps[parsingStep].duration);
    return () => clearTimeout(timer);
  }, [parsing, parsingStep]);

  const analysisFullText = locale === "en"
    ? `Analysis completed on ${candidates.length} candidates in the database.\n\n• 3 candidates with score above 90% (Giulia Neri 95%, Marco Rossi 92%, Sara Mancini 91%)\n• ${candidates.filter(c => c.aiParsed).length} candidates with AI-analyzed CV\n• Most requested skills: React (4), TypeScript (3), Python (3), Node.js (3)\n• Predominant stage: Screening (${candidates.filter(c => c.stage === "Screening").length}), Interview (${candidates.filter(c => c.stage === "Colloquio").length})\n• Suggestion: Elena Colombo (88%) is a strong match for the DevOps position — consider moving her to Interview.`
    : `Analisi completata su ${candidates.length} candidati nel database.\n\n• 3 candidati con score superiore al 90% (Giulia Neri 95%, Marco Rossi 92%, Sara Mancini 91%)\n• ${candidates.filter(c => c.aiParsed).length} candidati con CV analizzato da AI\n• Competenze più richieste: React (4), TypeScript (3), Python (3), Node.js (3)\n• Fase predominante: Screening (${candidates.filter(c => c.stage === "Screening").length}), Colloquio (${candidates.filter(c => c.stage === "Colloquio").length})\n• Suggerimento: Elena Colombo (88%) è un forte match per la posizione DevOps — considera di spostarla a Colloquio.`;

  const startAnalysis = useCallback(() => {
    setShowAnalysisModal(true);
    setAnalysisText("");
    setAnalysisComplete(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < analysisFullText.length) {
        setAnalysisText(analysisFullText.slice(0, i + 1));
        i++;
      } else {
        setAnalysisComplete(true);
        clearInterval(interval);
      }
    }, 12);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("candidates.title")}</TextShimmer></h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {candidates.length} {t("candidates.inDatabase")}
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <CleanMotionBackground
            className="bg-card border border-border rounded-xl p-1"
            hoverable={false}
            defaultKey={viewMode}
            onChange={(key) => key && setViewMode(key as "list" | "kanban")}
          >
            <div data-key="list">
              <span className="text-[11px] font-medium text-foreground flex items-center justify-center gap-1.5">
                <List className="h-3 w-3" strokeWidth={1.6} /> {t("candidates.list")}
              </span>
            </div>
            <div data-key="kanban">
              <span className="text-[11px] font-medium text-foreground flex items-center justify-center gap-1.5">
                <KanbanSquare className="h-3 w-3" strokeWidth={1.6} /> {t("candidates.kanban")}
              </span>
            </div>
          </CleanMotionBackground>
          <button
            onClick={startAnalysis}
            className="flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-ai/20 rounded-xl text-[11px] sm:text-[12px] font-body font-medium text-ai hover:bg-ai-muted transition-all"
          >
            <AiIcon className="text-ai" size={14} />
            <span className="hidden sm:inline">{t("candidates.aiAnalysis")}</span>
          </button>
          <InteractiveHoverButton
            className="flex-none"
            text={t("candidates.uploadCv")}
            icon={<Upload className="h-3.5 w-3.5" strokeWidth={1.6} />}
            onClick={() => { setShowUploadModal(true); setParsingComplete(false); setParsing(false); setParsingStep(-1); setUploadJobPosition(""); setBulkFiles([]); }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 px-1">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" strokeWidth={1.6} />
          <input
            type="text"
            placeholder={t("candidates.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-card border border-border rounded-xl text-[13px] font-body placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all"
          />
        </div>
        <Select value={jobPositionFilter} onValueChange={setJobPositionFilter}>
          <SelectTrigger className="w-full sm:w-[220px] h-[42px] bg-card border-border rounded-xl text-[12px] font-body">
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.6} />
              <SelectValue placeholder={t("candidates.allPositions")} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("candidates.allPositions")}</SelectItem>
            {jobPositions.map(jp => (
              <SelectItem key={jp} value={jp}>{jp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-[42px] bg-card border-border rounded-xl text-[12px] font-body">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.6} />
              <SelectValue placeholder={t("candidates.allSources")} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("candidates.allSources")}</SelectItem>
            {Object.entries(sourceMeta).map(([key, meta]) => (
              <SelectItem key={key} value={key}>{meta.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {viewMode === "list" && (
          <div className="overflow-x-auto -mx-1 px-1">
            <CleanMotionBackground
              className="bg-card border border-border rounded-xl p-1 w-max"
              hoverable={false}
              defaultKey={stageFilter}
              onChange={(key) => key && setStageFilter(key)}
            >
              {["all", "Screening", "Colloquio", "Shortlist", "Placement"].map(f => (
                <div key={f} data-key={f}>
                  <span className="text-[11px] font-medium text-foreground whitespace-nowrap">
                    {f === "all" ? t("candidates.all") : f}
                  </span>
                </div>
              ))}
            </CleanMotionBackground>
          </div>
        )}
      </div>

      {viewMode === "kanban" ? (
        <CandidatesKanban candidates={filtered.map(c => ({ ...c, aiParsed: c.aiParsed }))} />
      ) : (
      /* Main Content: Table + Detail Panel */
      <div className="flex gap-0 lg:h-[calc(100vh-300px)]">
        {/* Spreadsheet Table */}
        <div className={`bg-card rounded-2xl card-static overflow-hidden flex flex-col transition-all duration-300 ${selectedCandidate ? "hidden lg:flex flex-1" : "w-full"}`}>
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full min-w-[1000px]">
              <thead className="sticky top-0 z-10 bg-card">
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] w-8 whitespace-nowrap">#</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.name")}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.company")}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.role")}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.position")}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.source")}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.url")}</th>
                  <th className="text-center px-3 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.roleMatch")}</th>
                  <th className="text-center px-3 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.locationMatch")}</th>
                  <th className="text-center px-3 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.skillsMatch")}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.stage")}</th>
                  <th className="text-right px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.aiScore")}</th>
                  <th className="text-left px-4 py-3 text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{t("candidates.th.skills")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCandidate(selectedCandidate?.id === c.id ? null : c)}
                    className={`cursor-pointer transition-all duration-150 ${
                      selectedCandidate?.id === c.id
                        ? "bg-primary/5"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-4 py-3 text-[11px] text-muted-foreground tabular-nums">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-accent/60 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-body font-semibold text-foreground/50">
                            {c.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <span className="text-[12px] font-medium whitespace-nowrap">{c.name}</span>
                        {c.aiParsed && <AiIcon className="text-muted-foreground shrink-0" size={10} />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground whitespace-nowrap">{c.company}</td>
                    <td className="px-4 py-3 text-[12px] whitespace-nowrap">{c.jobTitle}</td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground whitespace-nowrap">{c.jobPosition}</td>
                    <td className="px-4 py-3">
                      {sourceMeta[c.source] && (
                        <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-semibold ${sourceMeta[c.source].color}`}>
                          <span className="text-[8px] font-bold">{sourceMeta[c.source].icon}</span>
                          {sourceMeta[c.source].label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-primary/70 hover:text-primary truncate max-w-[120px] block">{c.linkedin}</span>
                    </td>
                    <td className="px-3 py-3 text-center"><MatchBadge match={c.matchCriteria.currentRole} /></td>
                    <td className="px-3 py-3 text-center"><MatchBadge match={c.matchCriteria.location} /></td>
                    <td className="px-3 py-3 text-center"><MatchBadge match={c.matchCriteria.skills} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap ${stageColors[c.stage]}`}>{c.stage}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="h-1 w-10 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-ai/30 transition-all" style={{ width: `${c.score}%` }} />
                        </div>
                        <span className="text-[12px] font-heading font-semibold tabular-nums">{c.score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap max-w-[160px]">
                        {c.skills.slice(0, 2).map(s => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{s}</span>
                        ))}
                        {c.skills.length > 2 && <span className="text-[9px] text-muted-foreground/50 font-medium">+{c.skills.length - 2}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Side Panel */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-40 bg-background lg:relative lg:inset-auto lg:z-auto lg:w-[340px] shrink-0 lg:bg-card lg:rounded-2xl lg:card-static lg:ml-4 overflow-y-auto">
            <div className="p-5 border-b border-border flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-11 w-11 rounded-xl bg-accent/60 flex items-center justify-center">
                    <span className="text-[12px] font-body font-semibold text-foreground/50">
                      {selectedCandidate.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-heading font-semibold">{selectedCandidate.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{selectedCandidate.jobTitle}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedCandidate.location}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* AI Score */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">AI Score</span>
                <span className="text-[18px] font-heading font-semibold text-foreground">{selectedCandidate.score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-ai/35 transition-all" style={{ width: `${selectedCandidate.score}%` }} />
              </div>
            </div>

            {/* Match Criteria */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">{t("candidates.matchCriteria")}</p>
              <div className="space-y-2">
                {[
                  { label: t("candidates.matchRole"), match: selectedCandidate.matchCriteria.currentRole },
                  { label: `${t("candidates.locationLabel")}: ${selectedCandidate.location}`, match: selectedCandidate.matchCriteria.location },
                  { label: t("candidates.matchSkills"), match: selectedCandidate.matchCriteria.skills },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <CheckCircle className={`h-3.5 w-3.5 ${item.match ? "text-green-500" : "text-muted-foreground/30"}`} strokeWidth={1.6} />
                    <span className="text-[11px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source & Stage */}
            <div className="px-5 py-4 border-b border-border flex items-center gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">{t("candidates.source")}</p>
                {selectedCandidate.source && sourceMeta[selectedCandidate.source] ? (
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-semibold ${sourceMeta[selectedCandidate.source].color}`}>
                    <span className="text-[8px] font-bold">{sourceMeta[selectedCandidate.source].icon}</span>
                    {sourceMeta[selectedCandidate.source].label}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">—</span>
                )}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">{t("candidates.stage")}</p>
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold ${stageColors[selectedCandidate.stage]}`}>{selectedCandidate.stage}</span>
              </div>
            </div>

            {/* Work Experience */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                <Briefcase className="h-3 w-3 inline mr-1" strokeWidth={1.6} />
                {t("candidates.experience")}
              </p>
              <div className="space-y-2.5">
                {selectedCandidate.workHistory.map((w, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/20 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-medium">{w.role}</p>
                      <p className="text-[10px] text-muted-foreground">{w.company} · {w.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Employers */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                <Building2 className="h-3 w-3 inline mr-1" strokeWidth={1.6} />
                {t("candidates.pastEmployers")}
              </p>
              <p className="text-[11px] text-muted-foreground">{selectedCandidate.pastEmployers.join(" · ")}</p>
            </div>

            {/* Education */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                <GraduationCap className="h-3 w-3 inline mr-1" strokeWidth={1.6} />
                {t("candidates.education")}
              </p>
              <p className="text-[11px]">{selectedCandidate.education}</p>
            </div>

            {/* Skills */}
            <div className="px-5 py-4 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">{t("candidates.skills")}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 bg-ai-muted text-ai rounded-lg font-medium">{s}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 space-y-2">
              <Link
                to={`/candidates/${selectedCandidate.id}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all"
              >
                {t("candidates.viewFullProfile")} <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
      )}

      {/* CV Upload & AI Parsing Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-foreground/8 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !parsing && setShowUploadModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-xl p-7 card-static shadow-lg" onClick={e => e.stopPropagation()}>
            {!parsing && !parsingComplete ? (
              <>
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-[15px] font-heading font-semibold">{t("candidates.uploadTitle")}</h2>
                   <button onClick={() => setShowUploadModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Step 1: Select job position */}
                <div className="mb-5">
                  <label className="text-[11px] font-body font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">{t("candidates.appliedPosition")}</label>
                  <Select value={uploadJobPosition} onValueChange={setUploadJobPosition}>
                    <SelectTrigger className="w-full h-[42px] bg-background border-border rounded-xl text-[13px] font-body">
                      <SelectValue placeholder={t("candidates.selectPosition")} />
                    </SelectTrigger>
                    <SelectContent>
                      {jobPositions.map(jp => (
                        <SelectItem key={jp} value={jp}>{jp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 2: Upload CV (enabled only after position selected) */}
                <div
                  onClick={() => {
                    if (!uploadJobPosition) return;
                    if (bulkFiles.length === 0) {
                      handleBulkSelect();
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    uploadJobPosition
                      ? "border-ai/20 cursor-pointer hover:border-ai/40 hover:bg-ai-muted/20"
                      : "border-border/40 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Upload className="h-10 w-10 text-ai/40 mx-auto mb-4" strokeWidth={1.2} />
                   <p className="text-[13px] font-medium mb-1">{t("candidates.dragDrop")}</p>
                   <p className="text-[11px] text-muted-foreground">{t("candidates.fileFormats")} · <span className="text-ai font-medium">{t("candidates.bulkSupported")}</span></p>
                   <p className="text-[10px] text-ai font-medium mt-3 flex items-center justify-center gap-1">
                     <AiIcon className="text-ai" size={12} /> {t("candidates.aiAutoExtract")}
                   </p>
                </div>

                {/* Bulk file list */}
                {bulkFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-body font-semibold text-muted-foreground uppercase tracking-wider">{bulkFiles.length} {t("candidates.filesSelected")}</span>
                       <button onClick={() => setBulkFiles([])} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">{t("candidates.removeAll")}</button>
                    </div>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                      {bulkFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                            <span className="text-[12px]">{file}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setBulkFiles(prev => prev.filter((_, idx) => idx !== i)); }} className="text-muted-foreground/50 hover:text-foreground transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={startParsing}
                      className="w-full mt-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <AiIcon className="text-primary-foreground" size={14} />
                      {t("candidates.startParsing")} {bulkFiles.length} CV
                    </button>
                  </div>
                )}

                {!uploadJobPosition && (
                  <p className="text-[10px] text-muted-foreground mt-3 text-center">{t("candidates.selectFirst")}</p>
                )}
              </>
            ) : parsing ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-ai animate-spin" />
                    <h2 className="text-[15px] font-heading font-semibold">{t("candidates.parsing.inProgress")}</h2>
                  </div>
                  {bulkFiles.length > 1 && (
                    <span className="text-[11px] font-heading font-semibold text-ai bg-ai-muted px-2.5 py-1 rounded-lg">
                      {currentFileIndex + 1}/{bulkFiles.length}
                    </span>
                  )}
                </div>
                {bulkFiles.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-muted/30 rounded-lg">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                    <span className="text-[12px] font-medium">{bulkFiles[currentFileIndex] || bulkFiles[0]}</span>
                  </div>
                )}
                <div className="space-y-3">
                  {parsingSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 flex justify-center">
                        {i < parsingStep ? (
                          <CheckCircle className="h-4 w-4 text-green-500" strokeWidth={1.6} />
                        ) : i === parsingStep ? (
                          <Loader2 className="h-4 w-4 text-ai animate-spin" strokeWidth={1.6} />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-muted" />
                        )}
                      </div>
                      <span className={`text-[12px] transition-all duration-300 ${i < parsingStep ? "text-foreground font-medium" : i === parsingStep ? "text-ai font-medium" : "text-muted-foreground/50"}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  {bulkFiles.length > 1 && (
                    <div className="flex gap-1 mb-3">
                      {bulkFiles.map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= currentFileIndex ? "bg-ai" : "bg-muted"}`} />
                      ))}
                    </div>
                  )}
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-ai rounded-full transition-all duration-500 ease-out" style={{ width: `${(parsingStep / parsingSteps.length) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">{Math.round((parsingStep / parsingSteps.length) * 100)}% {t("candidates.parsing.completed")}</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={1.6} />
                  <h2 className="text-[15px] font-heading font-semibold">
                    {bulkFiles.length > 1 ? `${bulkFiles.length} ${t("candidates.parsing.cvAnalyzed")}` : t("candidates.parsing.complete")}
                  </h2>
                  <span className="ai-badge">AI</span>
                </div>

                {bulkFiles.length > 1 && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-xl space-y-2">
                    <p className="text-[11px] font-body font-semibold text-muted-foreground uppercase tracking-wider">{t("candidates.parsed.bulkSummary")}</p>
                    {bulkFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between px-2 py-1.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" strokeWidth={1.6} />
                          <span className="text-[12px]">{file}</span>
                        </div>
                        <span className="text-[11px] font-heading font-semibold text-ai tabular-nums">{Math.floor(Math.random() * 20 + 75)}%</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div>
                      <p className="text-[14px] font-heading font-semibold">{parsedResult.name}</p>
                      <p className="text-[12px] text-muted-foreground">{parsedResult.role}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[22px] font-heading font-semibold text-ai">{parsedResult.score}%</span>
                      <p className="text-[9px] text-ai font-medium">AI Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{t("candidates.parsed.contact")}</p>
                      <p className="text-[12px]">{parsedResult.email}</p>
                      <p className="text-[12px] text-muted-foreground">{parsedResult.phone} · {parsedResult.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{t("candidates.parsed.education")}</p>
                      <p className="text-[11px]">{parsedResult.education}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">{t("candidates.parsed.extractedSkills")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedResult.skills.map(s => (
                        <span key={s} className="text-[10px] px-2.5 py-1 bg-ai-muted text-ai rounded-lg font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-border">
                  <button onClick={() => setShowUploadModal(false)} className="px-4 py-2.5 text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">
                     {t("candidates.close")}
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      const count = bulkFiles.length > 1 ? bulkFiles.length : 1;
                      toast.success(`${count} ${count > 1 ? t("candidates.parsed.savedSuccess") : t("candidates.parsed.savedSingleSuccess")}`, {
                        description: `Posizione: ${uploadJobPosition}`,
                      });
                    }}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm"
                  >
                    {bulkFiles.length > 1 ? `${t("candidates.parsed.saveCandidates")} (${bulkFiles.length})` : t("candidates.parsed.saveCandidate")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-foreground/8 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => analysisComplete && setShowAnalysisModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg p-7 card-static shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-5">
              <AiIcon className={`text-ai ${!analysisComplete ? "animate-pulse-ai" : ""}`} size={16} />
              <h2 className="text-[15px] font-heading font-semibold">{t("candidates.analysis.title")}</h2>
              {!analysisComplete && <Loader2 className="h-3 w-3 text-ai animate-spin ml-1" />}
            </div>
            <div className="bg-muted/30 rounded-xl p-5 min-h-[200px]">
              <pre className="text-[12px] leading-relaxed whitespace-pre-wrap font-body text-foreground/80">{analysisText}<span className={`${analysisComplete ? "hidden" : "inline-block"} w-0.5 h-4 bg-ai ml-0.5 animate-pulse`} /></pre>
            </div>
            {analysisComplete && (
              <div className="flex justify-end mt-5">
                <button onClick={() => setShowAnalysisModal(false)} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-[12px] font-body font-medium hover:opacity-90 transition-all shadow-sm">
                  {t("candidates.close")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
