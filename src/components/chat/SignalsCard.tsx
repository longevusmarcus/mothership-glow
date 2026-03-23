import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lightbulb, RefreshCw, Flame, Globe, Eye, TrendingUp, X } from "lucide-react";
import { allSignals, shuffleAndPick, ease } from "@/data";
import type { Signal } from "@/data/types";

function SignalDetail({ signal, onClose }: { signal: Signal; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/[0.02] space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold leading-snug">{signal.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{signal.pain}</p>
          </div>
          <button onClick={onClose} className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shrink-0">
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Score</p>
            <p className="text-[14px] font-bold text-primary tabular-nums">{signal.score}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Sentiment</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${signal.sentiment}%` }} />
              </div>
              <span className="text-[12px] font-semibold tabular-nums">{signal.sentiment}%</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Views</p>
            <p className="text-[12px] font-semibold flex items-center gap-1"><Eye className="h-3 w-3 text-muted-foreground" /> {signal.views}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Source</p>
            <p className="text-[12px] font-semibold flex items-center gap-1"><Globe className="h-3 w-3 text-muted-foreground" /> {signal.source}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{signal.category}</span>
          {signal.trending && (
            <span className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              <Flame className="h-2.5 w-2.5" /> Trending
            </span>
          )}
          {signal.tags.map(tag => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function SignalsCard({ onSelect }: { onSelect: (title: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [signals, setSignals] = useState(() => shuffleAndPick(allSignals, 5));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setSignals(shuffleAndPick(allSignals, 5)); setSelected(null); setExpanded(null); setRefreshing(false); }, 400);
  };

  const handleClick = (s: Signal) => {
    if (expanded === s.title) {
      setExpanded(null);
    } else {
      setExpanded(s.title);
      setSelected(s.title);
    }
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
          <div key={s.title} className="space-y-1.5">
            <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => handleClick(s)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${selected === s.title ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:bg-muted/30"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium">{s.title}</span>
                <div className="flex items-center gap-2">
                  {s.trending && <Flame className="h-3 w-3 text-primary" />}
                  <span className="text-[9px] font-mono text-muted-foreground">{s.source}</span>
                  <span className="text-[10px] font-semibold tabular-nums text-primary">{s.score}</span>
                  {selected === s.title && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">{s.pain}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{s.category}</span>
                <span className="text-[9px] text-muted-foreground/60 flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" /> {s.views}</span>
              </div>
            </motion.button>
            <AnimatePresence>
              {expanded === s.title && <SignalDetail signal={s} onClose={() => setExpanded(null)} />}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {selected && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => onSelect(selected)}
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.8} /> Show ideas for this signal
        </motion.button>
      )}
      <p className="text-[10px] text-muted-foreground/60 text-center">You can always change your signal later after deployment</p>
    </motion.div>
  );
}
