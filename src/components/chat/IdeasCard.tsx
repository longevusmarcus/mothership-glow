import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, RefreshCw } from "lucide-react";
import { allIdeas, shuffleAndPick, ease } from "@/data";

export function IdeasCard({ onSelect }: { onSelect: (idea: string) => void }) {
  const [ideas, setIdeas] = useState(() => shuffleAndPick(allIdeas, 4));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setIdeas(shuffleAndPick(allIdeas, 4)); setRefreshing(false); }, 400);
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
          <motion.button key={idea.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => onSelect(idea.title)}
            className="w-full text-left p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/[0.02] transition-all group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium">{idea.title}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="font-semibold text-primary">{idea.confidence}% confidence</span>
              <span>{idea.revenue}</span>
              <span>TAM {idea.tam}</span>
              <span>{idea.competitors} competitors</span>
            </div>
          </motion.button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60 text-center">You can always change your idea later after deployment</p>
    </motion.div>
  );
}
