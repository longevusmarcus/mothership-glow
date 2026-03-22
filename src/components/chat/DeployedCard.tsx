import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ease } from "@/data";
import { ProPlanCard } from "./ProPlanCard";

export function DeployedCard({ agentCount = 1, subdomain }: { agentCount?: number; subdomain?: string | null }) {
  const navigate = useNavigate();
  const [showPlan, setShowPlan] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const handleClaim = () => {
    setShowPlan(true);
    setTimeout(() => { planRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
  };

  const handleSubscribed = () => {
    setSubscribed(true);
    setShowPlan(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="mt-2 space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] font-semibold">Company pre-deployed successfully</p>
            <p className="text-[11px] text-muted-foreground">
              {subdomain && <span className="font-mono text-foreground">{subdomain}.msx.dev</span>}
              {subdomain && " — "}
              {subscribed ? "Subscription confirmed — activate your agents from the Agents page" : "Claim your company, then subscribe to activate"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => navigate(subscribed ? "/agents" : "/companies/1")} className="h-9 rounded-xl border border-border bg-card text-[11px] font-semibold flex items-center justify-center gap-2 hover:bg-muted/60 transition-all active:scale-[0.97]">
            {subscribed ? "Activate & run" : "View dashboard"} <ArrowRight className="h-3 w-3" />
          </button>
          {!subscribed && (
            <button onClick={handleClaim} className="h-9 rounded-xl bg-foreground text-background text-[11px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
              <CreditCard className="h-3 w-3" strokeWidth={1.8} /> Claim
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showPlan && (
          <motion.div ref={planRef} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <ProPlanCard onSubscribed={handleSubscribed} agentCount={agentCount} />
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
