import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, RefreshCw, TrendingUp, Clock, Users, X, Target, ArrowRight } from "lucide-react";
import { allIdeas, shuffleAndPick, ease } from "@/data";
import type { Idea } from "@/data/types";

function IdeaDetail({ idea, onClose }: { idea: Idea; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/[0.02] space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold leading-snug">{idea.title}</p>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium mt-1 inline-block">{idea.category}</span>
          </div>
          <button onClick={onClose} className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shrink-0">
            <X className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Confidence</p>
            <p className="text-[14px] font-bold text-primary tabular-nums">{idea.confidence}%</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Revenue</p>
            <p className="text-[12px] font-semibold">{idea.revenue}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">TAM</p>
            <p className="text-[12px] font-semibold flex items-center gap-1"><Target className="h-3 w-3 text-muted-foreground" /> {idea.tam}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Competitors</p>
            <p className="text-[12px] font-semibold flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" /> {idea.competitors} active</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Time to MVP</p>
            <p className="text-[12px] font-semibold flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" /> {idea.timeToMvp}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 space-y-0.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Market Growth</p>
            <p className="text-[12px] font-semibold flex items-center gap-1 text-primary"><TrendingUp className="h-3 w-3" /> {idea.marketGrowth}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {idea.tags.map(tag => (
            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function IdeasCard({ onSelect }: { onSelect: (idea: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [ideas, setIdeas] = useState(() => shuffleAndPick(allIdeas, 4));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setIdeas(shuffleAndPick(allIdeas, 4)); setSelected(null); setExpanded(null); setRefreshing(false); }, 400);
  };

  const handleClick = (idea: Idea) => {
    if (expanded === idea.title) {
      setExpanded(null);
    } else {
      setExpanded(idea.title);
      setSelected(idea.title);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-2 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pre-validated ideas</p>
        <button onClick={refresh} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.8} /> Refresh
        </button>
      </div>
      <div className="space-y-1.5">
        {ideas.map((idea, i) => (
          <div key={idea.title} className="space-y-1.5">
            <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => handleClick(idea)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${selected === idea.title ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:bg-muted/30"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium">{idea.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold tabular-nums text-primary">{idea.confidence}%</span>
                  {selected === idea.title && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>{idea.revenue}</span>
                <span>TAM {idea.tam}</span>
                <span>{idea.competitors} competitors</span>
              </div>
            </motion.button>
            <AnimatePresence>
              {expanded === idea.title && <IdeaDetail idea={idea} onClose={() => setExpanded(null)} />}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {selected && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => onSelect(selected)}
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} /> Build this idea
        </motion.button>
      )}
      <p className="text-[10px] text-muted-foreground/60 text-center">You can always change your idea later after deployment</p>
    </motion.div>
  );
}
