import { useState, useRef, useEffect } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Rocket, Zap, Building2, PlugZap, Bot, BarChart3 } from "lucide-react";
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

const quickActions = [
  { icon: Rocket, label: "Deploy new agent", labelIt: "Deploy nuovo agente", prompt: "Deploy a new agent on my active company" },
  { icon: Bot, label: "Agent types", labelIt: "Tipi di agente", prompt: "Show me all available agent types and their capabilities" },
  { icon: Zap, label: "Install skills", labelIt: "Installa skills", prompt: "Show available API skills I can install on my agents" },
  { icon: Building2, label: "Company status", labelIt: "Status aziende", prompt: "Show the status of all my active companies" },
  { icon: PlugZap, label: "Integrate external agent", labelIt: "Integra agente esterno", prompt: "I want to integrate an external agent into my workspace" },
  { icon: BarChart3, label: "Performance report", labelIt: "Report performance", prompt: "Give me a performance report across all agents and companies" },
];

const Chat = () => {
  const { t, locale } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const key = responseKeys[Math.floor(Math.random() * responseKeys.length)];
      const aiMessage: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: t(key), timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] max-w-2xl mx-auto">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-[20px] font-heading font-semibold tracking-tight mb-1">
            <TextShimmer as="span" duration={2.5}>{t("chat.assistantTitle")}</TextShimmer>
          </h1>
          <p className="text-[12px] text-muted-foreground mb-8 text-center max-w-sm">
            {locale === "it"
              ? "Deploy agenti, assegna task, controlla lo status — chiedimi qualsiasi cosa"
              : "Deploy agents, assign tasks, check status — ask me anything"}
          </p>

          <div className="w-full max-w-lg">
            <PromptInputBox placeholder={t("chat.placeholder")} onSend={handleSend} isLoading={isLoading} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/15 hover:bg-muted/30 transition-all active:scale-[0.97]"
              >
                <action.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                {locale === "it" ? action.labelIt : action.label}
              </motion.button>
            ))}
          </div>
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
