import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Rocket, Building2 } from "lucide-react";
import { deployableAgents, existingCompanies, CEO_AGENT_ID, CEO_PRICE, EXTRA_AGENT_PRICE, calcAgentPrice, ease } from "@/data";
import type { CompanyRef } from "@/data";

export function DeployAgentCard({ onDone, preSelectedCompany }: { onDone: (agentNames: string, target: string) => void; preSelectedCompany?: CompanyRef | null }) {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [target, setTarget] = useState<"existing" | "new" | null>(preSelectedCompany ? "existing" : null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(preSelectedCompany?.id || null);
  const toggleAgent = (id: string) => setSelectedAgents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canDeploy = selectedAgents.length > 0 && (target === "new" || (target === "existing" && selectedCompany));

  const handleDeploy = () => {
    const names = selectedAgents.map(id => deployableAgents.find(a => a.id === id)?.name || id).join(", ");
    const targetLabel = target === "new" ? "a new company" : (existingCompanies.find(c => c.id === selectedCompany)?.name || preSelectedCompany?.name || "company");
    onDone(names, targetLabel);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">1. Select agents to deploy</p>
      <div className="grid grid-cols-2 gap-2">
        {deployableAgents.map((a, i) => {
          const Icon = a.icon;
          const isSelected = selectedAgents.includes(a.id);
          const agentPrice = a.id === CEO_AGENT_ID ? CEO_PRICE : EXTRA_AGENT_PRICE;
          return (
            <motion.button key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => toggleAgent(a.id)}
              className={`relative text-left p-3 rounded-xl border transition-all ${isSelected ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              {isSelected && <Check className="absolute top-2.5 right-2.5 h-3 w-3 text-primary" strokeWidth={2.5} />}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: a.color }} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold">{a.name}</p>
                  <p className="text-[9px] text-muted-foreground">{a.role}</p>
                </div>
              </div>
              <p className="text-[10px] font-semibold mt-1.5 text-foreground/70">${agentPrice}/mo</p>
            </motion.button>
          );
        })}
      </div>

      {selectedAgents.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">2. Assign to</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setTarget("existing"); setSelectedCompany(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${target === "existing" ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              <Building2 className="h-4 w-4 text-muted-foreground mb-1.5" strokeWidth={1.6} />
              <p className="text-[11px] font-semibold">Existing company</p>
              <p className="text-[9px] text-muted-foreground">{existingCompanies.length} companies</p>
            </button>
            <button onClick={() => { setTarget("new"); setSelectedCompany(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${target === "new" ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-background hover:border-border/80"}`}>
              <Rocket className="h-4 w-4 text-muted-foreground mb-1.5" strokeWidth={1.6} />
              <p className="text-[11px] font-semibold">New company</p>
              <p className="text-[9px] text-muted-foreground">Deploy from scratch</p>
            </button>
          </div>
        </motion.div>
      )}

      {target === "existing" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
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
        </motion.div>
      )}

      {canDeploy && (
        <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={handleDeploy}
          className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
          <Zap className="h-3.5 w-3.5" strokeWidth={1.8} />
          Deploy {selectedAgents.length} agent{selectedAgents.length > 1 ? "s" : ""} → {target === "new" ? "New company" : existingCompanies.find(c => c.id === selectedCompany)?.name} — ${calcAgentPrice(selectedAgents)}/mo
        </motion.button>
      )}
    </motion.div>
  );
}
