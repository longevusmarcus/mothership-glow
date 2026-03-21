import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lightbulb, RefreshCw } from "lucide-react";
import { allSignals, shuffleAndPick, ease } from "@/data";

export function SignalsCard({ onSelect }: { onSelect: (title: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [signals, setSignals] = useState(() => shuffleAndPick(allSignals, 5));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setSignals(shuffleAndPick(allSignals, 5)); setSelected(null); setRefreshing(false); }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Top signals this week</p>
        <button onClick={refresh} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.8} /> Refresh
        </button>
      </div>
      <div className="space-y-1.5">
        {signals.map((s, i) => (
          <motion.button key={s.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => setSelected(s.title)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${selected === s.title ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:bg-muted/30"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium">{s.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-muted-foreground">{s.source}</span>
                <span className="text-[10px] font-semibold tabular-nums text-primary">{s.score}</span>
                {selected === s.title && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">{s.pain}</p>
          </motion.button>
        ))}
      </div>
      {selected && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => onSelect(selected)}
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.8} /> Show ideas for this signal
        </motion.button>
      )}
    </motion.div>
  );
}
