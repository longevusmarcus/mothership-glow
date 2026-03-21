import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Rocket, Upload, Link2 } from "lucide-react";
import { deployableAgents, CEO_AGENT_ID, calcAgentPrice, CEO_PRICE, EXTRA_AGENT_PRICE, ease } from "@/data";
import { ApiDocsPaywall } from "./ApiDocsPaywall";

export function AgentPickerCard({ onDeploy, onIntegrate }: { onDeploy: (ids: string[]) => void; onIntegrate: () => void }) {
  const [selected, setSelected] = useState<string[]>([deployableAgents[0]?.id].filter(Boolean));
  const [showIntegrate, setShowIntegrate] = useState(false);
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const price = calcAgentPrice(selected);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Choose your agents</p>
      <div className="grid grid-cols-2 gap-2">
        {deployableAgents.map((a, i) => {
          const Icon = a.icon;
          const isSelected = selected.includes(a.id);
          const agentPrice = a.id === CEO_AGENT_ID ? CEO_PRICE : EXTRA_AGENT_PRICE;
          return (
            <motion.button key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggle(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              {isSelected && <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-primary" strokeWidth={2.5} />}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: a.color }} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.role}</p>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">{a.desc}</p>
              <p className="text-[10px] font-semibold mt-1.5 text-foreground/70">${agentPrice}/mo</p>
            </motion.button>
          );
        })}
      </div>
      <div className="rounded-xl border border-dashed border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
          <div>
            <p className="text-[11px] font-medium">Integrate your own agent</p>
            <p className="text-[9px] text-muted-foreground">Connect via API or upload config</p>
          </div>
        </div>
        <button onClick={() => setShowIntegrate(prev => !prev)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted/60 transition-all active:scale-[0.97]">
          <Link2 className="h-3 w-3" strokeWidth={2} /> {showIntegrate ? "Close" : "Connect"}
        </button>
      </div>
      {showIntegrate && <ApiDocsPaywall />}
      {selected.length > 0 && !showIntegrate && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={() => onDeploy(selected)}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Rocket className="h-3.5 w-3.5" strokeWidth={1.8} /> Deploy company with {selected.length} agent{selected.length > 1 ? "s" : ""} — ${price}/mo
        </motion.button>
      )}
    </motion.div>
  );
}
