import { useState, useRef, useEffect } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Bot, MessageSquare, Plus, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const responseKeys: TranslationKey[] = [
  "chat.response.1", "chat.response.2", "chat.response.3", "chat.response.4", "chat.response.5",
];

type Mode = null | "deploy" | "chat";

const agentTypes = [
  { type: "Tech", desc: "Code, ship, debug, deploy", emoji: "⚡" },
  { type: "Growth", desc: "SEO, ads, content, conversions", emoji: "📈" },
  { type: "Ops", desc: "Automate, integrate, optimize", emoji: "⚙️" },
  { type: "Creative", desc: "Design, copy, brand, media", emoji: "🎨" },
];

const existingAgents = [
  { name: "CodeForge-7x", type: "Tech", status: "Active", company: "NovaTech" },
  { name: "GrowthPulse-3k", type: "Growth", status: "Active", company: "NovaTech" },
  { name: "FinOps-v9", type: "Ops", status: "Active", company: "FinFlow" },
  { name: "DesignMind-8q", type: "Creative", status: "Deployed", company: "HealthAI" },
];

const Chat = () => {
  const { t, locale } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setMode(null);

    setTimeout(() => {
      const key = responseKeys[Math.floor(Math.random() * responseKeys.length)];
      const aiMessage: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: t(key), timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  const isEmpty = messages.length === 0 && mode === null;
  const showPicker = messages.length === 0 && mode !== null;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] max-w-2xl mx-auto">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-[20px] font-heading font-semibold tracking-tight mb-1">
            <TextShimmer as="span" duration={2.5}>{t("chat.assistantTitle")}</TextShimmer>
          </h1>
          <p className="text-[12px] text-muted-foreground mb-10 text-center">
            {locale === "it" ? "Cosa vuoi fare?" : "What would you like to do?"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <button
              onClick={() => setMode("deploy")}
              className="group p-6 bg-card border border-border rounded-2xl text-left hover:bg-muted/20 hover:border-foreground/10 transition-all active:scale-[0.98]"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-5 w-5 text-primary" strokeWidth={1.6} />
              </div>
              <p className="text-[14px] font-heading font-semibold mb-1">
                {locale === "it" ? "Deploy Agente" : "Deploy Agent"}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {locale === "it" ? "Lancia un nuovo agente Tech, Growth, Ops o Creative su una company" : "Launch a new Tech, Growth, Ops, or Creative agent on a company"}
              </p>
            </button>

            <button
              onClick={() => setMode("chat")}
              className="group p-6 bg-card border border-border rounded-2xl text-left hover:bg-muted/20 hover:border-foreground/10 transition-all active:scale-[0.98]"
            >
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} />
              </div>
              <p className="text-[14px] font-heading font-semibold mb-1">
                {locale === "it" ? "Parla con un Agente" : "Chat with Agent"}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {locale === "it" ? "Orchestrare, assegnare task, controllare status" : "Orchestrate, assign tasks, check status"}
              </p>
            </button>
          </div>
        </div>
      ) : showPicker ? (
        <div className="flex-1 flex flex-col px-4 pt-6">
          <button onClick={() => setMode(null)} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors mb-6 self-start flex items-center gap-1">
            ← {locale === "it" ? "Indietro" : "Back"}
          </button>

          {mode === "deploy" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div>
                <h2 className="text-[16px] font-heading font-semibold mb-1">
                  {locale === "it" ? "Scegli tipo di agente" : "Choose agent type"}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  {locale === "it" ? "Seleziona e verrà deployato sulla tua company attiva" : "Select and it will be deployed on your active company"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {agentTypes.map(agent => (
                  <button
                    key={agent.type}
                    onClick={() => handleSend(`Deploy a new ${agent.type} agent`)}
                    className="p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/20 hover:border-foreground/10 transition-all active:scale-[0.98] group"
                  >
                    <span className="text-[20px] mb-2 block">{agent.emoji}</span>
                    <p className="text-[13px] font-medium">{agent.type}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{agent.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {mode === "chat" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div>
                <h2 className="text-[16px] font-heading font-semibold mb-1">
                  {locale === "it" ? "Scegli un agente" : "Choose an agent"}
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  {locale === "it" ? "Parla direttamente con uno dei tuoi agenti attivi" : "Talk directly with one of your active agents"}
                </p>
              </div>
              <div className="space-y-2">
                {existingAgents.map(agent => (
                  <button
                    key={agent.name}
                    onClick={() => handleSend(`Hey ${agent.name}, what's your current status on ${agent.company}?`)}
                    className="w-full p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/20 hover:border-foreground/10 transition-all active:scale-[0.98] flex items-center gap-3 group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium">{agent.name}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{agent.type}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{agent.status} on {agent.company}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pb-4">
            <div className="space-y-1 pt-4">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className={`flex gap-3 px-2 py-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <AiIcon size={16} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] font-body leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                      {msg.content}
                      <p className={`text-[10px] mt-2 ${msg.role === "user" ? "text-primary-foreground/50" : "text-muted-foreground/50"}`}>
                        {msg.timestamp.toLocaleTimeString(locale === "en" ? "en-US" : "it-IT", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 px-2 py-3">
                  <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <AiIcon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                    <span className="text-[12px] text-muted-foreground font-body">{t("chat.thinking")}</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="shrink-0 pb-2">
            <PromptInputBox placeholder={t("chat.placeholder")} onSend={handleSend} isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
