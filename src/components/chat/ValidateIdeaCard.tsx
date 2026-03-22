import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, TrendingUp, Users, DollarSign, Target, ArrowRight } from "lucide-react";
import { ease } from "@/data";

const validationSteps = [
  "Scanning market signals...",
  "Analyzing competitor landscape...",
  "Estimating TAM & revenue potential...",
  "Running demand validation...",
];

interface ValidationMetrics {
  marketScore: number;
  demandScore: number;
  competitionLevel: string;
  estimatedTAM: string;
  revenueModel: string;
}

function generateMetrics(): ValidationMetrics {
  const market = 60 + Math.floor(Math.random() * 35);
  const demand = 55 + Math.floor(Math.random() * 40);
  const competitions = ["Low", "Medium", "High"];
  const tams = ["$2.4B", "$850M", "$5.1B", "$1.2B", "$3.8B"];
  const models = ["SaaS subscription", "Marketplace commission", "Usage-based", "Freemium + Pro"];
  return {
    marketScore: market,
    demandScore: demand,
    competitionLevel: competitions[Math.floor(Math.random() * competitions.length)],
    estimatedTAM: tams[Math.floor(Math.random() * tams.length)],
    revenueModel: models[Math.floor(Math.random() * models.length)],
  };
}

export function ValidateIdeaCard({ idea, onValidated }: { idea: string; onValidated: (idea: string) => void }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [metrics, setMetrics] = useState<ValidationMetrics | null>(null);

  useEffect(() => {
    if (step >= validationSteps.length) {
      setMetrics(generateMetrics());
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      setCompleted(prev => [...prev, step]);
      setStep(s => s + 1);
    }, 900 + Math.random() * 600);
    return () => clearTimeout(t);
  }, [step]);

  const progress = Math.round((completed.length / validationSteps.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-3">
      {!done && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Validating your idea</p>
            <span className="text-[11px] font-semibold tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="space-y-1">
            {validationSteps.map((s, i) => {
              const isDone = completed.includes(i);
              const active = step === i && !isDone;
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-[11px] ${active ? "bg-primary/[0.04]" : ""}`}>
                  {isDone ? <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.2} /> : active ? <Loader2 className="h-3 w-3 text-primary animate-spin shrink-0" /> : <div className="h-3 w-3 rounded-full border border-border shrink-0" />}
                  <span className={isDone || active ? "text-foreground" : "text-muted-foreground/40"}>{s}</span>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {done && metrics && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Validation results</p>

          <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3 space-y-3">
            <p className="text-[12px] font-semibold truncate">"{idea}"</p>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/40 border border-border p-2.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-primary" strokeWidth={1.8} />
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Market Score</span>
                </div>
                <p className="text-[16px] font-bold tabular-nums">{metrics.marketScore}<span className="text-[11px] text-muted-foreground">/100</span></p>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border p-2.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-primary" strokeWidth={1.8} />
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Demand</span>
                </div>
                <p className="text-[16px] font-bold tabular-nums">{metrics.demandScore}<span className="text-[11px] text-muted-foreground">/100</span></p>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border p-2.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-primary" strokeWidth={1.8} />
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Competition</span>
                </div>
                <p className="text-[13px] font-bold">{metrics.competitionLevel}</p>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border p-2.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3 text-primary" strokeWidth={1.8} />
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Est. TAM</span>
                </div>
                <p className="text-[13px] font-bold">{metrics.estimatedTAM}</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 border border-border px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Suggested model</span>
              <span className="text-[11px] font-semibold">{metrics.revenueModel}</span>
            </div>
          </div>

          <button onClick={() => onValidated(idea)}
            className="w-full h-9 rounded-xl bg-foreground text-background text-[11px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
            Continue with this idea <ArrowRight className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
