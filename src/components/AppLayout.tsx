import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Building2,
  Rocket,
  BookOpen,
  MoreHorizontal,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  Languages,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const navItemsDef = [
  { id: "dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" as TranslationKey, to: "/" },
  { id: "chat", icon: Rocket, labelKey: "nav.chatAi" as TranslationKey, to: "/chat" },
  { id: "more", icon: MoreHorizontal, labelKey: "nav.more" as TranslationKey, to: "/more" },
  { id: "store", icon: ShoppingBag, labelKey: "nav.store" as TranslationKey, to: "/store" },
  { id: "candidates", icon: Bot, labelKey: "nav.candidates" as TranslationKey, to: "/agents" },
  { id: "jobs", icon: Building2, labelKey: "nav.jobs" as TranslationKey, to: "/companies" },
  { id: "analytics", icon: BarChart3, labelKey: "nav.analytics" as TranslationKey, to: "/analytics" },
];

function IconTooltip({ children, label }: { children: React.ReactNode; label: string }) {
  const [show, setShow] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();

  return (
    <div
      className="relative"
      onMouseEnter={() => { timeout.current = setTimeout(() => setShow(true), 400); }}
      onMouseLeave={() => { clearTimeout(timeout.current); setShow(false); }}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[300] px-2.5 py-1 rounded-lg bg-foreground text-background text-[11px] font-body font-medium whitespace-nowrap shadow-lg pointer-events-none"
          >
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconRail({
  activeSection,
  onSectionChange,
  onLogout,
  t,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onLogout: () => void;
  t: (key: TranslationKey) => string;
}) {
  return (
    <div className="w-[56px] bg-icon-rail flex flex-col items-center py-4 shrink-0 border-r border-detail-panel-border/50">
      <div className="mb-5">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="h-9 w-9 rounded-xl bg-gradient-to-br from-icon-rail-hover to-detail-panel-active flex items-center justify-center cursor-pointer shadow-sm"
        >
          <span className="text-[12px] font-heading font-bold text-icon-rail-active">MX</span>
        </motion.div>
      </div>

      <div className="w-6 h-px bg-detail-panel-border mb-3" />

      <div className="flex-1 flex flex-col items-center gap-0.5 overflow-y-auto">
        {navItemsDef.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <IconTooltip key={item.id} label={t(item.labelKey)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onSectionChange(item.id)}
                className={`relative h-9 w-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? "bg-icon-rail-hover text-icon-rail-active"
                    : "text-icon-rail-foreground hover:text-icon-rail-active hover:bg-icon-rail-hover/60"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="rail-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-icon-rail-active"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="h-[17px] w-[17px]" strokeWidth={1.6} />
              </motion.button>
            </IconTooltip>
          );
        })}
      </div>

      <div className="w-6 h-px bg-detail-panel-border my-2" />

      <div className="flex flex-col items-center gap-1">
        <IconTooltip label={t("nav.settings")}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSectionChange("settings")}
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors duration-200 relative ${
              activeSection === "settings"
                ? "bg-icon-rail-hover text-icon-rail-active"
                : "text-icon-rail-foreground hover:text-icon-rail-active hover:bg-icon-rail-hover/60"
            }`}
          >
            {activeSection === "settings" && (
              <motion.div
                layoutId="rail-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-icon-rail-active"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Settings className="h-[17px] w-[17px]" strokeWidth={1.6} />
          </motion.button>
        </IconTooltip>

        <IconTooltip label={t("nav.logout")}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={onLogout}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-icon-rail-foreground hover:text-destructive hover:bg-icon-rail-hover/60 transition-colors duration-200"
          >
            <LogOut className="h-[17px] w-[17px]" strokeWidth={1.6} />
          </motion.button>
        </IconTooltip>

        <motion.div
          whileHover={{ scale: 1.1 }}
          className="h-8 w-8 rounded-full bg-gradient-to-br from-detail-panel-border to-icon-rail-hover flex items-center justify-center mt-2 cursor-pointer ring-2 ring-transparent hover:ring-icon-rail-foreground/20 transition-all"
        >
          <span className="text-[10px] font-body font-semibold text-icon-rail-foreground">OP</span>
        </motion.div>
      </div>
    </div>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dark, setDark] = useState(() => {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
    return true;
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveSection("dashboard");
    else if (path.startsWith("/chat")) setActiveSection("chat");
    else if (path.startsWith("/more")) setActiveSection("more");
    else if (path.startsWith("/store")) setActiveSection("store");
    else if (path.startsWith("/agents")) setActiveSection("candidates");
    else if (path.startsWith("/companies")) setActiveSection("jobs");
    else if (path.startsWith("/analytics")) setActiveSection("analytics");
    else if (path.startsWith("/settings")) setActiveSection("settings");
  }, [location.pathname]);

  const notifications = [
    { text: t("notif.1"), time: `10 ${t("notif.time.minAgo")}`, unread: true },
    { text: t("notif.2"), time: `1 ${t("notif.time.hourAgo")}`, unread: true },
    { text: t("notif.3"), time: `2 ${t("notif.time.hoursAgo")}`, unread: false },
    { text: t("notif.4"), time: `3 ${t("notif.time.hoursAgo")}`, unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    const item = navItemsDef.find((n) => n.id === id);
    if (item?.to) navigate(item.to);
    else if (id === "settings") navigate("/settings");
    setMobileOpen(false);
  };

  const handleLogout = () => { console.log("Logout clicked"); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`fixed z-50 inset-y-0 left-0 flex lg:relative lg:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.4,1)] ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <IconRail activeSection={activeSection} onSectionChange={handleSectionChange} onLogout={handleLogout} t={t} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center px-4 sm:px-5 border-b border-border glass sticky top-0 z-30">
          <button className="lg:hidden mr-3 p-1.5 transition-all active:scale-95" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className="flex flex-col gap-[3.5px] w-[16px]">
              <motion.span animate={mobileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25, ease: [0.25, 1, 0.4, 1] }} className="block h-[1.5px] w-full bg-muted-foreground rounded-full origin-center" />
              <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.15 }} className="block h-[1.5px] w-full bg-muted-foreground rounded-full" />
              <motion.span animate={mobileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25, ease: [0.25, 1, 0.4, 1] }} className="block h-[1.5px] w-full bg-muted-foreground rounded-full origin-center" />
            </div>
          </button>

          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <button onClick={() => setLocale(locale === "it" ? "en" : "it")} className="h-8 px-2 rounded-xl flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" title={locale === "it" ? "Switch to English" : "Passa all'italiano"}>
              <Languages className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="text-[10px] font-body font-bold uppercase tracking-wider">{locale === "it" ? "EN" : "IT"}</span>
            </button>

            <button onClick={toggleDark} className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all" title={dark ? t("theme.light") : t("theme.dark")}>
              {dark ? <Sun className="h-3.5 w-3.5" strokeWidth={1.6} /> : <Moon className="h-3.5 w-3.5" strokeWidth={1.6} />}
            </button>

            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all relative">
                <Bell className="h-3.5 w-3.5" strokeWidth={1.6} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-foreground/60 border-2 border-background" />}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.4, 1] }}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-[200]"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-[12px] font-heading font-semibold">{t("notif.title")}</span>
                      {unreadCount > 0 && <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">{unreadCount} {t("notif.new")}</span>}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-border">
                      {notifications.map((n, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`px-4 py-3 ${n.unread ? "bg-muted/30" : ""} hover:bg-muted/30 transition-colors cursor-pointer`}>
                          <div className="flex items-start gap-2">
                            {n.unread && <div className="h-1.5 w-1.5 rounded-full bg-foreground/40 mt-1.5 shrink-0" />}
                            <div>
                              <p className="text-[11.5px] leading-relaxed">{n.text}</p>
                              <p className="text-[9px] text-muted-foreground mt-1 uppercase font-medium tracking-wider">{n.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-border">
                      <button className="text-[11px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors w-full text-center">{t("notif.viewAll")}</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-8 rounded-xl bg-accent flex items-center justify-center ml-1">
              <span className="text-[10px] font-body font-semibold text-foreground/60 tracking-wide">OP</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
