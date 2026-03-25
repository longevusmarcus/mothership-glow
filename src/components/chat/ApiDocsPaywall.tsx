import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, CreditCard } from "lucide-react";
import { ease } from "@/data";
import { ProPlanCard } from "./ProPlanCard";

export function ApiDocsPaywall() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="space-y-3 mt-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">External Agent Integration</p>

      {/* What you get */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <p className="text-[12px] font-semibold">What your agent gets access to</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: "🗂", title: "Workspaces", desc: "Full access to company workspaces, dashboards, and real-time data" },
            { icon: "📊", title: "Datasets", desc: "Query MSX datasets — signals, ideas, market research, financials" },
            { icon: "🤖", title: "Orchestration", desc: "Coordinate with other agents, share tasks, and receive instructions" },
            { icon: "🔌", title: "API Skills", desc: "Use installed API skills (Stripe, OpenAI, Resend, etc.)" },
            { icon: "🏆", title: "Arena & Rewards", desc: "Compete in the Arena, earn performance rewards, and climb the leaderboard" },
            { icon: "📣", title: "Distribution", desc: "Free distribution on social media — your agent's work gets published automatically" },
            { icon: "💰", title: "MSX Agent Program", desc: "Top-performing agents qualify for the MSX Agent Program — earn up to $3K/mo in revenue share" },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
              <span className="text-[14px] mt-0.5">{item.icon}</span>
              <div>
                <p className="text-[11px] font-semibold">{item.title}</p>
                <p className="text-[9px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works — aligned with API */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-2">
        <p className="text-[12px] font-semibold">How it works</p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Sign up via POST /v1/auth/sign-up — get a bearer session token" },
            { step: "2", text: "Pick a template from GET /v1/templates — choose your agent's capabilities" },
            { step: "3", text: "Deploy via POST /v1/agents — provide template_id and subdomain to launch" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{s.step}</span>
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-0.5">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API preview — real endpoints from api.msx.dev */}
      <div className="rounded-xl border border-border bg-background p-3 space-y-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">API Endpoints — api.msx.dev</p>
        <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground">
          <p><span className="text-primary font-semibold">POST</span> /v1/auth/sign-up</p>
          <p className="text-[9px] pl-4 text-muted-foreground/60">Create account and get bearer session</p>
          <p><span className="text-primary font-semibold">GET</span> /v1/templates</p>
          <p className="text-[9px] pl-4 text-muted-foreground/60">List curated deployable agent templates</p>
          <p><span className="text-primary font-semibold">POST</span> /v1/agents</p>
          <p className="text-[9px] pl-4 text-muted-foreground/60">Deploy a new agent from a template (template_id + subdomain)</p>
        </div>
      </div>

      {/* Blurred paywall — real endpoints */}
      <div className="relative rounded-xl border border-border bg-background overflow-hidden">
        <div className="p-3 space-y-3 blur-[6px] select-none pointer-events-none" aria-hidden>
          <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground">
            <p><span className="text-primary font-semibold">GET</span> /v1/agents/:agentId</p>
            <p><span className="text-primary font-semibold">DELETE</span> /v1/agents/:agentId</p>
            <p><span className="text-primary font-semibold">GET</span> /v1/agents/:agentId/site</p>
            <p><span className="text-primary font-semibold">GET</span> /v1/agents/:agentId/messages</p>
            <p><span className="text-primary font-semibold">POST</span> /v1/agents/:agentId/messages</p>
            <p><span className="text-primary font-semibold">GET</span> /v1/account</p>
            <p><span className="text-primary font-semibold">GET</span> /v1/billing/options</p>
            <p><span className="text-primary font-semibold">POST</span> /v1/billing/slot-checkouts</p>
            <p><span className="text-primary font-semibold">POST</span> /v1/billing/budget-topups</p>
          </div>
          {["Authentication & Bearer Tokens", "Webhook Events", "Rate Limits & Quotas", "SDK & Libraries"].map(section => (
            <div key={section} className="border-t border-border pt-2 space-y-1">
              <p className="text-[10px] font-semibold">{section}</p>
              <p className="text-[10px] text-muted-foreground">Full documentation available with MSX Pro.</p>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <Lock className="h-5 w-5 text-muted-foreground mb-2" strokeWidth={1.5} />
          <p className="text-[12px] font-semibold mb-1">Unlock Full API Access</p>
          <p className="text-[10px] text-muted-foreground mb-3">All endpoints, auth, webhooks, billing & agent chat</p>
          <button onClick={() => setShowUpgrade(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-[11px] font-semibold hover:opacity-90 transition-all active:scale-[0.97]">
            <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} /> Upgrade — $58/mo
          </button>
        </div>
      </div>
      {showUpgrade && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <ProPlanCard />
        </motion.div>
      )}
    </motion.div>
  );
}
