import { ArrowLeft, Loader2, Send } from "lucide-react";
import AiIcon from "@/components/AiIcon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";

const CompanyCreate = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title: "", department: "", location: "", type: "SaaS B2B",
    experience: "", salary: "", description: "", requirements: "", skills: "",
  });
  const [generating, setGenerating] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const inputClass = "w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-[13px] font-body placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring/15 transition-all";
  const labelClass = "block text-[10px] font-semibold text-muted-foreground mb-1.5 tracking-wider uppercase";

  const generateWithAI = useCallback(() => {
    setGenerating(true);
    const generated = {
      title: "SmartInvoice",
      department: "Fintech",
      location: "EU / Global",
      type: "SaaS B2B",
      experience: "MVP",
      salary: "$1,800/mo",
      description: "AI-powered invoicing platform for freelancers and small businesses. Automatically generates invoices from project tracking data, handles multi-currency conversions, sends payment reminders, and provides cash flow forecasting.\n\nKey features:\n• Auto-generate invoices from time tracking\n• Multi-currency support with real-time conversion\n• Smart payment reminders & follow-ups\n• Cash flow forecasting with AI predictions\n• Stripe & PayPal integration for instant payments\n• Tax calculation by jurisdiction",
      requirements: "Stripe API integration\nMulti-currency handling\nPDF generation\nEmail notifications\nDashboard analytics\nMobile-responsive design",
      skills: "React, TypeScript, Node.js, Stripe, Supabase, Resend, PDF-lib",
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} /> {t("jobs.backToJobs")}
      </Link>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-heading font-semibold tracking-tight"><TextShimmer as="span" duration={2.5}>{t("jobCreate.title")}</TextShimmer></h1>
          <p className="text-[13px] text-muted-foreground mt-1">{t("jobCreate.subtitle")}</p>
        </div>
        <button onClick={generateWithAI} disabled={generating} className="flex items-center gap-1.5 px-4 py-2 border border-border text-muted-foreground rounded-xl text-[12px] font-body font-medium hover:bg-muted transition-all disabled:opacity-50">
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
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)} className={inputClass} placeholder="e.g. SmartInvoice" />
          </div>
          <div>
            <label className={labelClass}>{t("jobCreate.department")} *</label>
            <input type="text" value={form.department} onChange={e => update("department", e.target.value)} className={inputClass} placeholder="e.g. Fintech" />
          </div>
          <div>
            <label className={labelClass}>{t("jobCreate.workLocation")} *</label>
            <input type="text" value={form.location} onChange={e => update("location", e.target.value)} className={inputClass} placeholder="e.g. EU / Global" />
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
            <input type="text" value={form.salary} onChange={e => update("salary", e.target.value)} className={inputClass} placeholder="e.g. $1,500 — $3,000/mo" />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("jobCreate.roleDescription")} *</label>
          <textarea rows={8} value={form.description} onChange={e => update("description", e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>{t("jobCreate.requiredSkills")}</label>
          <input type="text" value={form.skills} onChange={e => update("skills", e.target.value)} className={inputClass} placeholder="e.g. React, TypeScript, Stripe, Supabase" />
        </div>

        <div>
          <label className={labelClass}>{t("jobCreate.additionalRequirements")}</label>
          <textarea rows={4} value={form.requirements} onChange={e => update("requirements", e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
          <Link to="/companies" className="px-4 py-2.5 text-[12px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors">{t("jobCreate.cancel")}</Link>
          <InteractiveHoverButton text={t("jobCreate.saveDraft")} className="border-border" onClick={() => toast.success(t("jobCreate.saveDraft"))} />
          <InteractiveHoverButton text={t("jobCreate.publishPosition")} icon={<Send className="h-3.5 w-3.5" strokeWidth={1.6} />} onClick={() => toast.success("Company created!")} />
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
