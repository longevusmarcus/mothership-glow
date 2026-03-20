import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Loader2, Send } from "lucide-react";

interface ChatMsg {
  id: string;
  role: "user" | "agent";
  agent?: string;
  content: string;
  time: string;
}

const initialChat: ChatMsg[] = [
  { id: "1", role: "agent", agent: "CodeForge", content: "Stripe integration is live. Checkout, subscription management, and webhook handlers are all deployed. Running e2e tests now.", time: "2h ago" },
  { id: "2", role: "agent", agent: "GrowthPilot", content: "Landing page v2 is deployed with two A/B variants. Tracking is set up — we'll have data in 48h.", time: "1h ago" },
  { id: "3", role: "agent", agent: "DesignMind", content: "Dashboard dark mode is complete. Also fixed responsive issues on tablet. Preview link is ready for review.", time: "45m ago" },
];

const agentResponses = [
  "Got it — I'll start working on that right away. Should have an update within the hour.",
  "Understood. Let me analyze the current state and propose a plan before executing.",
  "On it. I'll coordinate with the other agents to avoid any conflicts.",
  "Good call. I'll prioritize this and push a preview once it's ready for review.",
];

export default function CompanyChat() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialChat);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "user", content: input, time: "now" }]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const agents = ["CodeForge", "GrowthPilot", "DesignMind", "MarketBot"];
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: "agent",
        agent: agents[Math.floor(Math.random() * agents.length)],
        content: agentResponses[Math.floor(Math.random() * agentResponses.length)],
        time: "just now",
      }]);
      setIsLoading(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "agent" && (
              <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.4} />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-3 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border"}`}>
              {msg.role === "agent" && <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">{msg.agent}</p>}
              <p className="text-[12px] leading-relaxed">{msg.content}</p>
              <p className={`text-[9px] mt-1 ${msg.role === "user" ? "text-primary-foreground/40" : "text-muted-foreground/40"}`}>{msg.time}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.4} />
            </div>
            <div className="bg-muted/50 border border-border rounded-xl px-3 py-2 flex items-center gap-2">
              <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
              <span className="text-[11px] text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="px-4 pb-3 pt-2 border-t border-border">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Message your agents..."
            className="flex-1 bg-muted/50 border-0 rounded-xl px-3 py-2 text-[12px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-border" />
          <button onClick={handleSend} disabled={isLoading || !input.trim()}
            className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all active:scale-[0.95] disabled:opacity-40">
            <Send className="h-3.5 w-3.5" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}