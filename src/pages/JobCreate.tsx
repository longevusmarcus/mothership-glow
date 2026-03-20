import { ArrowLeft, Loader2, CheckCircle2, Circle, ExternalLink, RefreshCw, AlertCircle, Send } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import type { TranslationKey } from "@/i18n/translations";

type Platform = {
  id: string;
  name: string;
  icon: string;
  descKey: TranslationKey;
  color: string;
  status: "idle" | "publishing" | "published" | "error";
  url?: string;
  candidatesReceived?: number;
};

const makeInitialPlatforms = (): Platform[] => [
  { id: "linkedin", name: "LinkedIn Jobs", icon: "in", descKey: "publish.desc.linkedin", color: "bg-[#0A66C2]/10 text-[#0A66C2]", status: "idle" },
  { id: "indeed", name: "Indeed", icon: "iD", descKey: "publish.desc.indeed", color: "bg-[#2164F3]/10 text-[#2164F3]", status: "idle" },
  { id: "glassdoor", name: "Glassdoor", icon: "gD", descKey: "publish.desc.glassdoor", color: "bg-[#0CAA41]/10 text-[#0CAA41]", status: "idle" },
  { id: "infojobs", name: "InfoJobs", icon: "iJ", descKey: "publish.desc.infojobs", color: "bg-[#FF6340]/10 text-[#FF6340]", status: "idle" },
  { id: "monster", name: "Monster", icon: "Mo", descKey: "publish.desc.monster", color: "bg-muted text-muted-foreground", status: "idle" },
];

const JobCreate = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title: "", department: "", location: "", type: "Full-time",
    experience: "", salary: "", description: "", requirements: "", skills: "",
  });
  const [generating, setGenerating] = useState(false);

  // Publish state
  const [showPublish, setShowPublish] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>(makeInitialPlatforms);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [publishPhase, setPublishPhase] = useState<"select" | "publishing" | "done">("select");

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const inputClass = "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-body placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all";
  const labelClass = "block text-[10px] font-semibold text-muted-foreground mb-1.5 tracking-wider uppercase";

  const generateWithAI = useCallback(() => {
    setGenerating(true);
    const generated = {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Milano / Remote",
      type: "Full-time",
      experience: "5-8 anni",
      salary: "€50.000 — €65.000",
      description: "Cerchiamo un Senior Frontend Developer per guidare lo sviluppo dell'interfaccia utente dei nostri prodotti SaaS B2B. Il candidato ideale ha una profonda conoscenza di React e TypeScript, esperienza nella progettazione di design system scalabili e capacità di mentoring del team.\n\nResponsabilità principali:\n• Architettura e sviluppo di componenti React complessi e performanti\n• Definizione e mantenimento del design system aziendale\n• Code review e mentoring di sviluppatori junior/mid\n• Collaborazione con UX Designer e Product Manager\n• Ottimizzazione delle performance frontend (Core Web Vitals)\n• Implementazione di test automatizzati (unit, integration, e2e)",
      requirements: "React avanzato (3+ anni)\nTypeScript (2+ anni)\nEsperienza con design system (Material UI, Radix, Shadcn)\nConoscenza CI/CD (GitHub Actions, Jenkins)\nTesting (Jest, Cypress, Playwright)\nInglese fluente (B2+)\nEsperienza di leadership tecnica\nLaurea in Informatica o equivalente",
      skills: "React, TypeScript, Next.js, CSS/SASS, Tailwind CSS, Jest, Cypress, GraphQL, REST API, Git, Figma",
    };

    const fields = Object.entries(generated);
    let fieldIdx = 0;
    let charIdx = 0;

    const interval = setInterval(() => {
      if (fieldIdx >= fields.length) {
        setGenerating(false);
        clearInterval(interval);
        return;
      }

      const [key, value] = fields[fieldIdx];
      if (charIdx <= value.length) {
        setForm(prev => ({ ...prev, [key]: value.slice(0, charIdx) }));
        charIdx += Math.floor(Math.random() * 4) + 2;
      } else {
        setForm(prev => ({ ...prev, [key]: value }));
        fieldIdx++;
        charIdx = 0;
      }
    }, 15);
  }, []);

  const togglePlatform = (id: string) => {
    if (publishPhase !== "select") return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const startPublish = () => {
    if (selected.size === 0) return;
    setPublishPhase("publishing");

    const ids = Array.from(selected);
    let i = 0;

    const interval = setInterval(() => {
      if (i >= ids.length) {
        clearInterval(interval);
        setPublishPhase("done");
        return;
      }
      const currentId = ids[i];
      setPlatforms(prev => prev.map(p =>
        p.id === currentId ? { ...p, status: "publishing" } : p
      ));

      setTimeout(() => {
        const success = Math.random() > 0.12;
        setPlatforms(prev => prev.map(p =>
          p.id === currentId
            ? {
                ...p,
                status: success ? "published" : "error",
                url: success ? `https://${currentId}.com/jobs/mock-${Date.now()}` : undefined,
                candidatesReceived: success ? Math.floor(Math.random() * 8) : undefined,
              }
            : p
        ));
      }, 700 + Math.random() * 500);

      i++;
    }, 1000);
  };

  const resetPublish = () => {
    setPublishPhase("select");
    setSelected(new Set());
    setPlatforms(makeInitialPlatforms());
  };

  const handlePublishClick = () => {
    if (!form.title.trim()) {
      toast.error(t("jobCreate.positionTitle") + " required");
      return;
    }
    setShowPublish(true);
    resetPublish();
  };

  const publishedCount = platforms.filter(p => p.status === "published").length;
  const errorCount = platforms.filter(p => p.status === "error").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("jobs.backToJobs")}
      </Link>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("jobCreate.title")}</TextShimmer></h1>
          <p className="text-[13px] text-muted-foreground mt-1">{t("jobCreate.subtitle")}</p>
        </div>
        <button
          onClick={generateWithAI}
          disabled={generating}
          className="flex items-center gap-1.5 px-4 py-2 border border-border text-muted-foreground rounded-xl text-[12px] font-body font-medium hover:bg-muted transition-all disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AiIcon size={14} />}
          {generating ? t("jobCreate.generating") : t("jobCreate.generateAi")}
        </button>
      </div>

      {generating && (
        <div className="rounded-2xl p-4 flex items-center gap-3 border border-border bg-muted/30">
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
          <p className="text-[12px] text-muted-foreground font-medium">{t("jobCreate.aiGenerating")}</p>
        </div>
      )}

      <div className="bg-card rounded-2xl p-7 card-static space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>{t("jobCreate.positionTitle")} *</label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)} className={inputClass} placeholder="es. Senior Frontend Developer" />
          </div>
          <div>
            <label className={labelClass}>{t("jobCreate.department")} *</label>
            <input type="text" value={form.department} onChange={e => update("department", e.target.value)} className={inputClass} placeholder="es. Engineering" />
          </div>
          <div>
            <label className={labelClass}>{t("jobCreate.workLocation")} *</label>
            <input type="text" value={form.location} onChange={e => update("location", e.target.value)} className={inputClass} placeholder="es. Milano / Remote" />
          </div>
          <div>
            <label className={labelClass}>{t("jobCreate.contractType")} *</label>
            <select value={form.type} onChange={e => update("type", e.target.value)} className={inputClass}>
              <option>{t("jobCreate.fullTime")}</option>
              <option>{t("jobCreate.partTime")}</option>
              <option>{t("jobCreate.freelance")}</option>
              <option>{t("jobCreate.internship")}</option>
              <option>{t("jobCreate.apprenticeship")}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("jobCreate.requiredExperience")}</label>
            <select value={form.experience} onChange={e => update("experience", e.target.value)} className={inputClass}>
              <option value="">{t("jobCreate.select")}</option>
              <option>{t("jobCreate.years02")}</option>
              <option>{t("jobCreate.years35")}</option>
              <option>{t("jobCreate.years58")}</option>
              <option>{t("jobCreate.years8plus")}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("jobCreate.salaryRange")}</label>
            <input type="text" value={form.salary} onChange={e => update("salary", e.target.value)} className={inputClass} placeholder="es. €40.000 — €55.000" />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("jobCreate.roleDescription")} *</label>
          <textarea rows={8} value={form.description} onChange={e => update("description", e.target.value)} className={`${inputClass} resize-none`}
            placeholder="" />
        </div>

        <div>
          <label className={labelClass}>{t("jobCreate.requiredSkills")}</label>
          <input type="text" value={form.skills} onChange={e => update("skills", e.target.value)} className={inputClass}
            placeholder="es. React, TypeScript, Node.js" />
        </div>

        <div>
          <label className={labelClass}>{t("jobCreate.additionalRequirements")}</label>
          <textarea rows={4} value={form.requirements} onChange={e => update("requirements", e.target.value)} className={`${inputClass} resize-none`}
            placeholder="" />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
          <Link to="/jobs" className="px-4 py-2.5 text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">{t("jobCreate.cancel")}</Link>
          <InteractiveHoverButton
            text={t("jobCreate.saveDraft")}
            className="border-border"
            onClick={() => toast.success(t("jobCreate.saveDraft"))}
          />
          <InteractiveHoverButton
            text={t("jobCreate.publishPosition")}
            icon={<Send className="h-3.5 w-3.5" strokeWidth={1.6} />}
            onClick={handlePublishClick}
          />
        </div>
      </div>

      {/* Multi-Channel Publish Section */}
      {showPublish && (
        <div className="bg-card rounded-2xl card-static overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="p-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-heading font-semibold">{t("publish.title")}</h2>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {publishPhase === "select" && `${t("publish.selectWhere")} "${form.title || t("jobCreate.positionTitle")}"`}
                  {publishPhase === "publishing" && t("publish.publishing")}
                  {publishPhase === "done" && `${publishedCount} ${t("publish.platforms")} ${t("publish.published")}${errorCount > 0 ? ` · ${errorCount} ${t("publish.errors")}` : ""}`}
                </p>
              </div>
              {publishPhase === "publishing" && (
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              )}
              {publishPhase === "done" && (
                <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={1.6} />
              )}
            </div>
          </div>

          <div className="p-4 space-y-2">
            {platforms.map(p => {
              const isSelected = selected.has(p.id);
              const isActive = publishPhase !== "select" && isSelected;

              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  disabled={publishPhase !== "select"}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-200 text-left
                    ${isSelected && publishPhase === "select" ? "border-foreground/15 bg-muted/30" : "border-border/60 hover:border-border"}
                    ${publishPhase !== "select" && !isActive ? "opacity-25 pointer-events-none" : ""}
                    ${p.status === "published" ? "border-primary/20 bg-primary/[0.03]" : ""}
                    ${p.status === "error" ? "border-destructive/20 bg-destructive/[0.03]" : ""}
                    disabled:cursor-default
                  `}
                >
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${p.color}`}>
                    <span className="text-[10px] font-heading font-bold">{p.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium">{p.name}</span>
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                          className="text-muted-foreground/50 hover:text-foreground transition-colors">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {p.status === "published" && p.candidatesReceived !== undefined
                        ? `${t("publish.publishedStatus")} · ${p.candidatesReceived} ${t("publish.candidatesReceived")}`
                        : p.status === "error"
                          ? t("publish.error")
                          : t(p.descKey)
                      }
                    </span>
                  </div>

                  <div className="shrink-0">
                    {p.status === "idle" && publishPhase === "select" && (
                      isSelected
                        ? <CheckCircle2 className="h-4 w-4 text-foreground" strokeWidth={1.6} />
                        : <Circle className="h-4 w-4 text-muted-foreground/25" strokeWidth={1.6} />
                    )}
                    {p.status === "publishing" && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
                    {p.status === "published" && <CheckCircle2 className="h-4 w-4 text-primary" strokeWidth={1.6} />}
                    {p.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" strokeWidth={1.6} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            {publishPhase === "select" && (
              <>
                <span className="text-[11px] text-muted-foreground">
                  {selected.size} {selected.size === 1 ? t("publish.platform") : t("publish.platforms")} {selected.size === 1 ? t("publish.selectedSingle") : t("publish.selected")}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPublish(false)}
                    className="px-3 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("publish.close")}
                  </button>
                  <button
                    onClick={startPublish}
                    disabled={selected.size === 0}
                    className="px-4 py-2 bg-foreground text-background rounded-xl text-[12px] font-medium transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("publish.publishBtn")}
                  </button>
                </div>
              </>
            )}
            {publishPhase === "publishing" && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("publish.syncing")}
              </span>
            )}
            {publishPhase === "done" && (
              <>
                <span className="text-[11px] text-muted-foreground">
                  {t("publish.complete")}
                </span>
                <div className="flex gap-2">
                  {errorCount > 0 && (
                    <button
                      onClick={resetPublish}
                      className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all"
                    >
                      <RefreshCw className="h-3 w-3" /> {t("publish.retry")}
                    </button>
                  )}
                  <button
                    onClick={() => setShowPublish(false)}
                    className="px-4 py-2 bg-foreground text-background rounded-xl text-[12px] font-medium transition-all hover:opacity-90 active:scale-[0.97]"
                  >
                    {t("publish.close")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCreate;
