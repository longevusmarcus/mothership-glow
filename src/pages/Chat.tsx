import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import AiIcon from "@/components/AiIcon";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2, Rocket, Zap, PlugZap, Bot, BarChart3, Radio, Lightbulb } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { TranslationKey } from "@/i18n/translations";
import { deployableAgents } from "@/data";
import type { CompanyRef } from "@/data";
import {
  SignalsCard, IdeasCard, AgentPickerCard, DeployingCard,
  DeployedCard, ApiDocsPaywall, DeployAgentCard, AddAgentToCompanyCard,
  AddingAgentCard, AgentAddedCard,
} from "@/components/chat";

// ── Types ──

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: "show_signals" | "show_ideas" | "pick_agent" | "deploying" | "deployed" | "show_api_docs" | "deploy_agent_flow" | "add_agent_to_company" | "adding_agent" | "agent_added" | "ask_subdomain";
}

const responseKeys: TranslationKey[] = [
  "chat.response.1", "chat.response.2", "chat.response.3", "chat.response.4", "chat.response.5",
];

const quickActions = [
  { icon: Rocket, label: "Deploy a company", labelIt: "Deploya un'azienda", prompt: "I want to deploy a new company" },
  { icon: Bot, label: "Add agent to company", labelIt: "Aggiungi agente", prompt: "I want to add a new agent to an existing company" },
  { icon: Zap, label: "Deploy agent", labelIt: "Deploya agente", prompt: "I want to deploy an agent to a company" },
  { icon: Radio, label: "Browse signals", labelIt: "Sfoglia segnali", prompt: "Show me the top market signals this week" },
  { icon: Lightbulb, label: "Explore ideas", labelIt: "Esplora idee", prompt: "Show me pre-validated business ideas" },
  { icon: PlugZap, label: "Integrate my agent", labelIt: "Integra il mio agente", prompt: "I want to integrate my own agent" },
  { icon: BarChart3, label: "Performance report", labelIt: "Report performance", prompt: "Give me a performance report across all agents and companies" },
];

// ── Main Chat component ──

const Chat = () => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [deployToCompany, setDeployToCompany] = useState<CompanyRef | null>(null);
  const [deployedAgentCount, setDeployedAgentCount] = useState(1);
  const hasAutoTriggered = useRef(false);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const addAssistant = (content: string, action?: ChatMessage["action"]) => {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content, timestamp: new Date(), action }]);
    setIsLoading(false);
  };

  // Auto-trigger deploy agent flow when navigating from a company
  useEffect(() => {
    const state = location.state as { deployToCompany?: CompanyRef } | null;
    if (state?.deployToCompany && !hasAutoTriggered.current) {
      hasAutoTriggered.current = true;
      const company = state.deployToCompany;
      setDeployToCompany(company);
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        setMessages([{ id: crypto.randomUUID(), role: "user", content: `Deploy agents to ${company.name}`, timestamp: new Date() }]);
        setIsLoading(true);
        setTimeout(() => addAssistant(`Let's deploy agents to ${company.name} (${company.type}). Pick which agents you want to activate — they'll be assigned directly to ${company.name}.`, "deploy_agent_flow"), 800);
      }, 300);
    }
  }, [location.state]);

  const addUser = (content: string) => {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "user", content, timestamp: new Date() }]);
  };

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    addUser(message);
    setIsLoading(true);
    const lower = message.toLowerCase();

    if (lower.includes("add") && lower.includes("agent") && (lower.includes("company") || lower.includes("existing"))) {
      setTimeout(() => addAssistant("Let's add agents to one of your companies. Pick the agent types you need, then choose the company.", "add_agent_to_company"), 800);
    } else if (lower.includes("deploy") && (lower.includes("company") || lower.includes("azienda"))) {
      setTimeout(() => addAssistant("Let's build something. First, here are the strongest market signals I've found this week — pick the ones that resonate with you.", "show_signals"), 800);
    } else if (lower.includes("signal")) {
      setTimeout(() => addAssistant("Here are the top-scoring signals from TikTok, Reddit, Twitter/X and 10 other sources. Select the ones you want to build on.", "show_signals"), 800);
    } else if (lower.includes("idea")) {
      setTimeout(() => addAssistant("These ideas are pre-validated with revenue proof, TAM estimates, and competitor analysis. Pick one to deploy.", "show_ideas"), 800);
    } else if (lower.includes("deploy") && lower.includes("agent")) {
      setTimeout(() => addAssistant("Let's deploy your agents. Pick which agents you want to activate and where to assign them.", "deploy_agent_flow"), 800);
    } else if (lower.includes("integrate") && lower.includes("agent")) {
      setTimeout(() => addAssistant("Here's everything you need to connect your agent via REST API. Unlock full access with the MSX Pro plan.", "show_api_docs"), 800);
    } else {
      setTimeout(() => { addAssistant(t(responseKeys[Math.floor(Math.random() * responseKeys.length)])); }, 1000 + Math.random() * 800);
    }
  };

  // Flow handlers
  const handleSignalsSelected = (s: string) => { addUser(`Selected signals: ${s}`); setIsLoading(true); setTimeout(() => addAssistant("Great picks. Based on those signals, here are the strongest validated ideas with revenue proof. Choose one to build.", "show_ideas"), 900); };
  const handleIdeaSelected = (idea: string) => { addUser(`Build: ${idea}`); setIsLoading(true); setTimeout(() => addAssistant(`Solid choice — "${idea}" has strong market validation. Now pick the agents that will build it.`, "pick_agent"), 900); };
  const handleDeploy = (ids: string[]) => { setDeployedAgentCount(ids.length); const names = ids.map(id => deployableAgents.find(a => a.id === id)?.name || id).join(", "); addUser(`Deploy with: ${names}`); setTimeout(() => addAssistant(`Deploying your company with ${names}. Agents are taking over now...`, "deploying"), 600); };
  const handleDeployDone = () => { addAssistant("Your company is in progress. Agents are now ready to be activated and work autonomously — check the dashboard for real-time updates.", "deployed"); };
  const handleDeployAgentDone = (names: string, target: string) => { addUser(`Deploy ${names} → ${target}`); setTimeout(() => addAssistant(`Deploying ${names} to ${target}. Agents are spinning up now...`, "deploying"), 600); };
  const handleIntegrate = () => { addUser("I want to integrate my own agent"); setIsLoading(true); setTimeout(() => addAssistant("Here's everything you need to connect your agent via REST API. Unlock full access with the MSX Pro plan.", "show_api_docs"), 800); };
  const [pendingAddAgent, setPendingAddAgent] = useState<{ agentNames: string[]; companyName: string } | null>(null);
  const handleAddAgentDone = (agentNames: string[], companyName: string) => {
    addUser(`Add ${agentNames.join(", ")} → ${companyName}`);
    setPendingAddAgent({ agentNames, companyName });
    setDeployedAgentCount(agentNames.length);
    setTimeout(() => addAssistant(
      `Deploying ${agentNames.length} specialized agent${agentNames.length > 1 ? "s" : ""} to ${companyName}. Setting up workspace access, skills, and orchestration...`,
      "adding_agent"
    ), 600);
  };
  const handleAddAgentDeployDone = () => {
    if (!pendingAddAgent) return;
    const { agentNames, companyName } = pendingAddAgent;
    const firstAgent = agentNames[0];
    const restAgents = agentNames.slice(1);
    const msg = restAgents.length > 0
      ? `${firstAgent} and ${restAgents.length} more agent${restAgents.length > 1 ? "s" : ""} are now pre-deployed on ${companyName}. Activate & upgrade your subscription to start them.`
      : `${firstAgent} is now pre-deployed on ${companyName}. Activate & upgrade your subscription to start it.`;
    addAssistant(msg, "agent_added");
  };

  const renderExtras = (msg: ChatMessage) => {
    switch (msg.action) {
      case "show_signals": return <SignalsCard onSelect={handleSignalsSelected} />;
      case "show_ideas": return <IdeasCard onSelect={handleIdeaSelected} />;
      case "pick_agent": return <AgentPickerCard onDeploy={handleDeploy} onIntegrate={handleIntegrate} />;
      case "deploying": return <DeployingCard onDone={handleDeployDone} />;
      case "deployed": return <DeployedCard agentCount={deployedAgentCount} />;
      case "show_api_docs": return <ApiDocsPaywall />;
      case "deploy_agent_flow": return <DeployAgentCard onDone={handleDeployAgentDone} preSelectedCompany={deployToCompany} />;
      case "add_agent_to_company": return <AddAgentToCompanyCard onDone={handleAddAgentDone} />;
      case "adding_agent": return <AddingAgentCard onDone={handleAddAgentDeployDone} />;
      case "agent_added": return <AgentAddedCard agentCount={deployedAgentCount} />;
      default: return null;
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.20))] max-w-2xl mx-auto">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight mb-1">
            <TextShimmer as="span" duration={2.5}>{t("chat.assistantTitle")}</TextShimmer>
          </h1>
          <p className="text-[12px] text-muted-foreground mb-8 text-center max-w-sm">
            {locale === "it" ? "Scopri segnali, esplora idee, deploya aziende — tutto in chat" : "Surface signals, explore ideas, deploy companies — all from chat"}
          </p>
          <div className="w-full max-w-lg">
            <PromptInputBox placeholder={t("chat.placeholder")} onSend={handleSend} isLoading={isLoading} />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
            {quickActions.map((action, i) => (
              <motion.button key={action.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/15 hover:bg-muted/30 transition-all active:scale-[0.97]">
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
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex gap-3 px-2 py-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <AiIcon size={16} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className={`${msg.action ? "max-w-[90%]" : "max-w-[80%]"} rounded-2xl px-4 py-3 text-[13px] font-mono leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                      {msg.content}
                      {renderExtras(msg)}
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
                    <span className="text-[12px] text-muted-foreground font-mono">{t("chat.thinking")}</span>
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
