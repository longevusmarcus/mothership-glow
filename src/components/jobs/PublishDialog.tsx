import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Circle, Loader2, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

type Platform = {
  id: string;
  name: string;
  icon: string;
  descKey: TranslationKey;
  status: "idle" | "publishing" | "published" | "error";
  url?: string;
  candidatesReceived?: number;
  lastSync?: string;
};

const makeInitialPlatforms = (): Platform[] => [
  { id: "linkedin", name: "LinkedIn Jobs", icon: "in", descKey: "publish.desc.linkedin", status: "idle" },
  { id: "indeed", name: "Indeed", icon: "iD", descKey: "publish.desc.indeed", status: "idle" },
  { id: "glassdoor", name: "Glassdoor", icon: "gD", descKey: "publish.desc.glassdoor", status: "idle" },
  { id: "infojobs", name: "InfoJobs", icon: "iJ", descKey: "publish.desc.infojobs", status: "idle" },
  { id: "monster", name: "Monster", icon: "Mo", descKey: "publish.desc.monster", status: "idle" },
];

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
}

export const PublishDialog = ({ open, onOpenChange, jobTitle }: PublishDialogProps) => {
  const { t } = useLanguage();
  const [platforms, setPlatforms] = useState<Platform[]>(makeInitialPlatforms);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<"select" | "publishing" | "done">("select");

  const toggle = (id: string) => {
    if (phase !== "select") return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const publish = () => {
    if (selected.size === 0) return;
    setPhase("publishing");

    const ids = Array.from(selected);
    let i = 0;

    const interval = setInterval(() => {
      if (i >= ids.length) {
        clearInterval(interval);
        setPhase("done");
        return;
      }
      const currentId = ids[i];
      setPlatforms(prev => prev.map(p =>
        p.id === currentId ? { ...p, status: "publishing" } : p
      ));

      setTimeout(() => {
        const success = Math.random() > 0.15;
        setPlatforms(prev => prev.map(p =>
          p.id === currentId
            ? {
                ...p,
                status: success ? "published" : "error",
                url: success ? `https://${currentId}.com/jobs/mock-123` : undefined,
                candidatesReceived: success ? Math.floor(Math.random() * 12) : undefined,
                lastSync: success ? t("publish.now") : undefined,
              }
            : p
        ));
      }, 800 + Math.random() * 600);

      i++;
    }, 1200);
  };

  const reset = () => {
    setPhase("select");
    setSelected(new Set());
    setPlatforms(makeInitialPlatforms());
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };

  const publishedCount = platforms.filter(p => p.status === "published").length;
  const errorCount = platforms.filter(p => p.status === "error").length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 overflow-hidden border-border">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-mondwest font-semibold tracking-tight">
              {t("publish.title")}
            </DialogTitle>
            <DialogDescription className="text-[12px] text-muted-foreground mt-1">
              {phase === "select" && `${t("publish.selectWhere")} "${jobTitle}"`}
              {phase === "publishing" && t("publish.publishing")}
              {phase === "done" && `${publishedCount} ${t("publish.platforms")} ${t("publish.published")}${errorCount > 0 ? `, ${errorCount} ${t("publish.errors")}` : ""}`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-4 space-y-2 max-h-[360px] overflow-y-auto">
          {platforms.map(p => {
            const isSelected = selected.has(p.id);
            const isActive = phase !== "select" && isSelected;

            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                disabled={phase !== "select"}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                  ${isSelected && phase === "select" ? "border-foreground/20 bg-muted/40" : "border-border hover:border-border/80"}
                  ${phase !== "select" && !isActive ? "opacity-30" : ""}
                  ${p.status === "published" ? "border-primary/20 bg-primary/5" : ""}
                  ${p.status === "error" ? "border-destructive/20 bg-destructive/5" : ""}
                  disabled:cursor-default
                `}
              >
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-mondwest font-bold text-muted-foreground">{p.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-medium truncate">{p.name}</span>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">
                    {p.status === "published" && p.candidatesReceived !== undefined
                      ? `${t("publish.publishedStatus")} · ${p.candidatesReceived} ${t("publish.candidatesReceived")} · ${t("publish.sync")}: ${p.lastSync}`
                      : p.status === "error"
                        ? t("publish.error")
                        : t(p.descKey)
                    }
                  </span>
                </div>

                <div className="shrink-0">
                  {p.status === "idle" && phase === "select" && (
                    isSelected
                      ? <CheckCircle2 className="h-4 w-4 text-foreground" strokeWidth={1.6} />
                      : <Circle className="h-4 w-4 text-muted-foreground/30" strokeWidth={1.6} />
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
          {phase === "select" && (
            <>
              <span className="text-[11px] text-muted-foreground">
                {selected.size} {selected.size === 1 ? t("publish.platform") : t("publish.platforms")} {selected.size === 1 ? t("publish.selectedSingle") : t("publish.selected")}
              </span>
              <button
                onClick={publish}
                disabled={selected.size === 0}
                className="px-4 py-2 bg-foreground text-background rounded-xl text-[12px] font-medium transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t("publish.publishBtn")}
              </button>
            </>
          )}
          {phase === "publishing" && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("publish.syncing")}
            </span>
          )}
          {phase === "done" && (
            <>
              <span className="text-[11px] text-muted-foreground">
                {t("publish.complete")}
              </span>
              <div className="flex gap-2">
                {errorCount > 0 && (
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all"
                  >
                    <RefreshCw className="h-3 w-3" /> {t("publish.retry")}
                  </button>
                )}
                <button
                  onClick={() => handleOpenChange(false)}
                  className="px-4 py-2 bg-foreground text-background rounded-xl text-[12px] font-medium transition-all hover:opacity-90 active:scale-[0.97]"
                >
                  {t("publish.close")}
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
