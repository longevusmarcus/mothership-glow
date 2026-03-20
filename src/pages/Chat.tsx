import { useState, useRef, useEffect } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Bot, Zap, Building2, Database } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: { label: string; icon: string; onClick?: () => void }[];
}

const responseKeys: TranslationKey[] = [
  "chat.response.1", "chat.response.2", "chat.response.3", "chat.response.4", "chat.response.5",
];

const promptKeys: TranslationKey[] = [
  "chat.prompt.1", "chat.prompt.2", "chat.prompt.3", "chat.prompt.4",
];

const apiSkills = [
  { name: "Stripe Payments", desc: "Accept payments, subscriptions, invoicing", icon: "💳" },
  { name: "Resend Email", desc: "Transactional & marketing emails", icon: "📧" },
  { name: "OpenAI Vision", desc: "Image analysis & generation", icon: "👁️" },
  { name: "Twilio SMS", desc: "SMS notifications & 2FA", icon: "📱" },
  { name: "Cloudinary", desc: "Image & video optimization", icon: "🖼️" },
  { name: "Plausible Analytics", desc: "Privacy-first web analytics", icon: "📊" },
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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] max-w-3xl mx-auto">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-[20px] font-heading font-semibold tracking-tight mb-2">
            <TextShimmer as="span" duration={2.5}>{t("chat.assistantTitle")}</TextShimmer>
          </h1>
          <p className="text-[12px] text-muted-foreground mb-6">Deploy agents, install API skills, orchestrate companies</p>

          <div className="w-full mb-6">
            <PromptInputBox placeholder={t("chat.placeholder")} onSend={handleSend} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-2 w-full mb-8">
            {promptKeys.map(key => (
              <button key={key} onClick={() => handleSend(t(key))} className="text-[11px] font-body px-3.5 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-200 text-center">
                {t(key)}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="w-full space-y-4">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => handleSend("Deploy a Tech agent on my latest company")} className="p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/30 transition-all group">
                <Bot className="h-5 w-5 text-muted-foreground mb-2 group-hover:text-foreground transition-colors" strokeWidth={1.4} />
                <p className="text-[12px] font-medium">Deploy Agent</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Tech, Growth, Ops, Creative</p>
              </button>
              <button onClick={() => handleSend("Create a new SaaS company for invoice management")} className="p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/30 transition-all group">
                <Building2 className="h-5 w-5 text-muted-foreground mb-2 group-hover:text-foreground transition-colors" strokeWidth={1.4} />
                <p className="text-[12px] font-medium">New Company</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">AI-generated business plan</p>
              </button>
              <button onClick={() => handleSend("Show me available API Skills to install")} className="p-4 bg-card border border-border rounded-xl text-left hover:bg-muted/30 transition-all group">
                <Database className="h-5 w-5 text-muted-foreground mb-2 group-hover:text-foreground transition-colors" strokeWidth={1.4} />
                <p className="text-[12px] font-medium">Install API Skill</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Stripe, Email, AI, SMS...</p>
              </button>
            </div>

            {/* API Skills Catalog */}
            <div className="mt-6">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">API Skills Catalog — 1-Click Install</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {apiSkills.map(skill => (
                  <button key={skill.name} onClick={() => handleSend(`Install ${skill.name} API Skill`)} className="p-3 bg-card border border-border rounded-xl text-left hover:bg-muted/30 transition-all group flex items-start gap-2.5">
                    <span className="text-[16px] mt-0.5">{skill.icon}</span>
                    <div>
                      <p className="text-[11px] font-medium">{skill.name}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{skill.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
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
