import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { ease, slotTiers } from "@/data";

const outcomeOptions = [
  { label: "Launch MVP", emoji: "🚀" },
  { label: "First paying customers", emoji: "💰" },
  { label: "Product-market fit", emoji: "🎯" },
  { label: "$10K MRR", emoji: "📈" },
];

export function BudgetOutcomesCard({ onDone }: { onDone: (budget: string, outcomes: string[]) => void }) {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);

  const toggleOutcome = (label: string) => {
    setSelectedOutcomes(prev => prev.includes(label) ? prev.filter(o => o !== label) : [...prev, label]);
  };

  const canContinue = selectedBudget && selectedOutcomes.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-4 mt-3">
      {/* Budget — slot tiers */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Monthly budget</p>
        <div className="grid grid-cols-2 gap-2">
          {slotTiers.map(opt => {
            const active = selectedBudget === opt.value;
            return (
              <button key={opt.value} onClick={() => setSelectedBudget(opt.value)}
                className={`rounded-xl border p-3 text-left transition-all active:scale-[0.97] ${active ? "border-primary bg-primary/[0.05]" : "border-border bg-card hover:bg-muted/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold">{opt.label}</span>
                  {active && <Check className="h-3 w-3 text-primary" strokeWidth={2.2} />}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcomes */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Desired outcomes</p>
        <div className="flex flex-wrap gap-2">
          {outcomeOptions.map(opt => {
            const active = selectedOutcomes.includes(opt.label);
            return (
              <button key={opt.label} onClick={() => toggleOutcome(opt.label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-medium transition-all active:scale-[0.97] ${active ? "border-primary bg-primary/[0.05] text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted/30"}`}>
                <span>{opt.emoji}</span> {opt.label}
                {active && <Check className="h-3 w-3 text-primary ml-1" strokeWidth={2.2} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <button onClick={() => canContinue && onDone(selectedBudget!, selectedOutcomes)} disabled={!canContinue}
        className="w-full h-9 rounded-xl bg-foreground text-background text-[11px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed">
        Pick your agents <ArrowRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
