import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CEO_PRICE, EXTRA_AGENT_PRICE, ease } from "@/data";

function SubscriptionUpgradeCard({ onSubscribed, agentCount = 1 }: { onSubscribed: () => void; agentCount?: number }) {
  const tiers = [
    { name: "Orbital", price: 58, agents: 1, desc: "Base CEO Agent — everything included" },
    { name: "Orbital +1", price: 88, agents: 2, desc: "CEO + 1 specialized agent" },
    { name: "Orbital +2", price: 118, agents: 3, desc: "CEO + 2 specialized agents" },
    { name: "Interstellar", price: 148, agents: 4, desc: "CEO + 3 agents — full plan" },
  ];
  const totalNeeded = 1 + agentCount;
  const recommended = tiers.find(t => t.agents >= totalNeeded) || tiers[tiers.length - 1];

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.6} />
        <p className="text-[13px] font-semibold">Upgrade Subscription</p>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        You're adding {agentCount} agent{agentCount > 1 ? "s" : ""}. Upgrade to <strong>{recommended.name}</strong> (${recommended.price}/mo) to activate.
      </p>
      <div className="space-y-1.5">
        {tiers.map(tier => {
          const isRecommended = tier.name === recommended.name;
          return (
            <div key={tier.name} className={`flex items-center justify-between p-3 rounded-xl border ${isRecommended ? "border-primary bg-primary/[0.04]" : "border-border bg-background"}`}>
              <div className="flex items-center gap-2">
                {isRecommended && <span className="text-[8px] font-bold text-primary uppercase tracking-wider">Recommended</span>}
                <div>
                  <p className={`text-[11px] font-semibold ${isRecommended ? "text-foreground" : ""}`}>{tier.name}</p>
                  <p className="text-[9px] text-muted-foreground">{tier.desc}</p>
                </div>
              </div>
              <p className="text-[12px] font-semibold tabular-nums">${tier.price}<span className="text-[9px] text-muted-foreground font-normal">/mo</span></p>
            </div>
          );
        })}
      </div>
      <button onClick={() => { toast.success("Subscription confirmed!"); onSubscribed(); }}
        className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
        <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} /> Upgrade to {recommended.name} — ${recommended.price}/mo
      </button>
    </div>
  );
}

export function AgentAddedCard({ agentCount = 1 }: { agentCount?: number }) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClaim = () => {
    setShowUpgrade(true);
    setTimeout(() => { planRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
  };

  const handleSubscribed = () => {
    setSubscribed(true);
    setShowUpgrade(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="mt-2 space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] font-semibold">Pre-deployed successfully</p>
            <p className="text-[11px] text-muted-foreground">
              {subscribed ? "Subscription confirmed — activate your agents from the Agents page" : "Claim your agents, then upgrade to activate"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => navigate("/agents")} className="h-9 rounded-xl border border-border bg-card text-[11px] font-semibold flex items-center justify-center gap-2 hover:bg-muted/60 transition-all active:scale-[0.97]">
            {subscribed ? "Activate & run" : "View agents"} <ArrowRight className="h-3 w-3" />
          </button>
          {!subscribed && (
            <button onClick={handleClaim} className="h-9 rounded-xl bg-foreground text-background text-[11px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
              <CreditCard className="h-3 w-3" strokeWidth={1.8} /> Claim
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showUpgrade && (
          <motion.div ref={planRef} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <SubscriptionUpgradeCard onSubscribed={handleSubscribed} agentCount={agentCount} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {subscribed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3 flex items-center gap-3">
            <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Subscription active. Go to <button onClick={() => navigate("/agents")} className="text-foreground font-semibold underline underline-offset-2">/agents</button> to <strong>Activate & Run</strong> your pre-deployed agents.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
