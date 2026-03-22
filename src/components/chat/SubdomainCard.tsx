import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { ease } from "@/data";

export function SubdomainCard({ onDone }: { onDone: (subdomain: string) => void }) {
  const [value, setValue] = useState("");
  const clean = value.trim().replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
  const canSubmit = clean.length >= 2;

  const handleSubmit = () => {
    if (canSubmit) onDone(clean);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="mt-3 space-y-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Choose your subdomain</p>
      <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
        <div className="flex items-center gap-0 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-1.5 pl-3 pr-1 shrink-0">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
          </div>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="yourcompany"
            autoFocus
            className="flex-1 bg-transparent px-2 py-2.5 text-[13px] font-mono placeholder:text-muted-foreground/40 focus:outline-none"
          />
          <span className="text-[12px] font-mono text-muted-foreground pr-3 shrink-0">.msx.dev</span>
        </div>
        {clean && (
          <p className="text-[10px] text-muted-foreground">
            Your company will be available at <span className="font-mono text-foreground font-semibold">{clean}.msx.dev</span>
          </p>
        )}
      </div>
      <button onClick={handleSubmit} disabled={!canSubmit}
        className="w-full h-9 rounded-xl bg-foreground text-background text-[11px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed">
        Confirm subdomain <ArrowRight className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
