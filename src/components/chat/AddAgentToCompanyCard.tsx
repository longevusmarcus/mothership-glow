import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Lightbulb } from "lucide-react";
import { deployableAgents, existingCompanies, CEO_AGENT_ID, CEO_PRICE, EXTRA_AGENT_PRICE, calcAgentPrice, ease } from "@/data";

export function AddAgentToCompanyCard({ onDone }: { onDone: (agentNames: string[], companyName: string) => void }) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const toggleAgent = (id: string) => {
    if (id === CEO_AGENT_ID) return;
    setSelectedAgents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const canSubmit = selectedAgents.length > 0 && selectedCompany;

  const handleSubmit = () => {
    const names = selectedAgents.map(id => deployableAgents.find(a => a.id === id)?.name || id);
    const companyName = existingCompanies.find(c => c.id === selectedCompany)?.name || "company";
    onDone(names, companyName);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">1. Pick agent types</p>
      <div className="grid grid-cols-2 gap-2">
        {deployableAgents.map((a, i) => {
          const Icon = a.icon;
          const isCeo = a.id === CEO_AGENT_ID;
          const isSelected = selectedAgents.includes(a.id);
          const agentPrice = isCeo ? CEO_PRICE : EXTRA_AGENT_PRICE;
          return (
            <motion.button key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggleAgent(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${
                isCeo ? "border-border/60 bg-muted/30 opacity-70 cursor-not-allowed"
                : isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"
              }`}>
              {isCeo && <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">Already added</span>}
              {!isCeo && isSelected && <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-primary" strokeWidth={2.5} />}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: a.color }} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.role}</p>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground leading-relaxed">{a.desc}</p>
              {!isCeo && <p className="text-[10px] font-semibold mt-1.5 text-foreground/70">${agentPrice}/mo</p>}
            </motion.button>
          );
        })}
      </div>

      {selectedAgents.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">2. Choose company</p>
          <div className="space-y-1.5">
            {existingCompanies.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}
                onClick={() => setSelectedCompany(c.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedCompany === c.id ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.type} · {c.agents} agents active</p>
                  </div>
                  {selectedCompany === c.id && <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {selectedAgents.length > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.8} />
          <p className="text-[10px] text-amber-500/80 leading-relaxed">
            The first agent will be activated immediately. The remaining {selectedAgents.length - 1} will need to be activated one by one from the <strong>Your Agents</strong> page.
          </p>
        </motion.div>
      )}

      {canSubmit && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={handleSubmit}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Zap className="h-3.5 w-3.5" strokeWidth={1.8} />
          Add {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} → {existingCompanies.find(c => c.id === selectedCompany)?.name} — ${calcAgentPrice(selectedAgents)}/mo
        </motion.button>
      )}
    </motion.div>
  );
}
