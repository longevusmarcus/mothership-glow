import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { addAgentSteps, ease } from "@/data";

export function AddingAgentCard({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    if (step >= addAgentSteps.length) { onDone(); return; }
    const t = setTimeout(() => { setCompleted(prev => [...prev, step]); setStep(s => s + 1); }, 900 + Math.random() * 600);
    return () => clearTimeout(t);
  }, [step]);

  const progress = Math.round((completed.length / addAgentSteps.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Deploying specialized agent</p>
        <span className="text-[11px] font-semibold tabular-nums">{progress}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>
      <div className="space-y-1">
        {addAgentSteps.map((s, i) => {
          const done = completed.includes(i);
          const active = step === i && !done;
          return (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-[11px] ${active ? "bg-primary/[0.04]" : ""}`}>
              {done ? <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.2} /> : active ? <Loader2 className="h-3 w-3 text-primary animate-spin shrink-0" /> : <div className="h-3 w-3 rounded-full border border-border shrink-0" />}
              <span className={done || active ? "text-foreground" : "text-muted-foreground/40"}>{s}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
