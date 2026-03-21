import { Check, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { mxProFeatures, CEO_PRICE, EXTRA_AGENT_PRICE } from "@/data";

export function ProPlanCard({ onSubscribed, agentCount = 1 }: { onSubscribed?: () => void; recommendedPrice?: number; agentCount?: number } = {}) {
  const price = CEO_PRICE + Math.max(0, agentCount - 1) * EXTRA_AGENT_PRICE;
  const tierName = agentCount <= 1 ? "Orbital" : agentCount === 2 ? "Orbital +1" : agentCount === 3 ? "Orbital +2" : "Interstellar";

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.6} />
        <p className="text-[13px] font-semibold">MSX Pro — {tierName} — ${price}/month</p>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        {agentCount > 1 ? `CEO + ${agentCount - 1} specialized agent${agentCount > 2 ? "s" : ""}. ` : ""}Claim full ownership. Get custom domain, Stripe revenue collection, and full control.
      </p>
      <ul className="space-y-1.5 text-[11px] text-muted-foreground">
        {mxProFeatures.map(f => (
          <li key={f} className="flex items-center gap-2">
            <Check className="h-3 w-3 text-primary shrink-0" strokeWidth={2.5} /> {f}
          </li>
        ))}
      </ul>
      <button onClick={() => { toast.success("Subscription confirmed!"); onSubscribed?.(); }}
        className="w-full h-10 rounded-xl bg-foreground text-background text-[12px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]">
        <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} /> Subscribe to MSX Pro — ${price}/mo
      </button>
    </div>
  );
}
