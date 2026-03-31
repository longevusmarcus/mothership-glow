import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Building2,
  MessageSquare,
  MoreHorizontal,
  Swords,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  Search,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";
import { cn } from "@/lib/utils";

const navItemsDef = [
  { id: "dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" as TranslationKey, to: "/dashboard" },
  { id: "chat", icon: MessageSquare, labelKey: "nav.chatAi" as TranslationKey, to: "/chat" },
  { id: "agents", icon: Bot, labelKey: "nav.agents" as TranslationKey, to: "/agents" },
  { id: "companies", icon: Building2, labelKey: "nav.companies" as TranslationKey, to: "/companies" },
  { id: "more", icon: MoreHorizontal, labelKey: "nav.more" as TranslationKey, to: "/more" },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() => {
    document.documentElement.classList.remove("dark");
    return false;
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const desktopMainRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    desktopMainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ─── Mobile header + bottom nav state ─── */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen overflow-hidden bg-background md:flex">
      {/* ────────────────── DESKTOP SIDEBAR ────────────────── */}
      <aside
        className={cn(
          "hidden h-screen overflow-hidden bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:sticky md:top-0 md:flex md:flex-col",
          collapsed ? "md:w-[88px]" : "md:w-56",
        )}
      >
        {/* Logo */}
        <div className="flex items-center px-5 pb-4 pt-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-left leading-none transition-opacity hover:opacity-100"
          >
            {collapsed ? (
              <span className="font-pixel text-[0.95rem] font-normal leading-none tracking-[-0.08em] text-foreground">
                MSX
              </span>
            ) : (
              <span className="font-pixel text-[2rem] font-normal leading-none tracking-[-0.06em] text-foreground">
                MSX
              </span>
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {navItemsDef.map(({ to, id, labelKey, icon: Icon }) => {
              const isActive =
                to === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(to);

              return (
                <NavLink
                  key={id}
                  to={to}
                  className={cn(
                    "group flex h-12 items-center rounded-xl border text-sm transition-all",
                    collapsed ? "w-12 justify-center px-0" : "w-full gap-3 px-4",
                    isActive
                      ? "border-border bg-accent text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center transition-transform",
                      isActive && "scale-110",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px]",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    />
                  </span>
                  {!collapsed && (
                    <span
                      className={cn(
                        "font-grotesk text-[1.05rem] tracking-tight",
                        isActive ? "font-semibold text-foreground" : "font-medium text-foreground/80",
                      )}
                    >
                      {t(labelKey)}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4">
          {!collapsed && (
            <div className="mb-3 flex flex-col gap-1 px-1">
              <p className="mb-1 font-mono text-[11px] tracking-[0.08em] text-muted-foreground/40">
                © MSX 2026
              </p>
              <NavLink
                to="/settings"
                className="text-left font-mono text-[11px] lowercase tracking-[0.08em] text-muted-foreground/50 transition-colors hover:text-foreground"
              >
                settings
              </NavLink>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "flex h-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground",
              collapsed ? "w-12" : "w-9",
            )}
            title={collapsed ? "Expand menu" : "Collapse menu"}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-[3px] border border-current/70">
              <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
            </span>
          </button>
        </div>
      </aside>

      {/* ────────────────── MAIN AREA ────────────────── */}
      <div className="flex h-screen flex-1 flex-col overflow-hidden md:pr-4 md:pb-4">
        {/* Desktop header */}
        <header className="hidden md:flex md:h-20 md:items-center md:justify-between md:px-5 lg:px-6">
          <div className="flex flex-1">
            <label className="flex h-11 w-full max-w-xl items-center gap-3 rounded-full border border-border bg-muted px-4 text-sm text-muted-foreground transition-colors focus-within:border-ring focus-within:bg-card">
              <Search className="h-4 w-4 shrink-0" />
              <input
                type="text"
                placeholder="Search agents, companies, or signals"
                className="w-full bg-transparent font-grotesk text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title={dark ? t("theme.light") : t("theme.dark")}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-foreground/60 border-2 border-background" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.4, 1] }}
                    className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-[200]"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-[12px] font-mondwest font-semibold">{t("notif.title")}</span>
                      {unreadCount > 0 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                          {unreadCount} {t("notif.new")}
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-border">
                      {notifications.map((n, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`px-4 py-3 ${n.unread ? "bg-muted/30" : ""} hover:bg-muted/30 transition-colors cursor-pointer`}
                        >
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
                      <button className="text-[11px] font-mono font-medium text-muted-foreground hover:text-foreground transition-colors w-full text-center">
                        {t("notif.viewAll")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="flex h-10 min-w-10 items-center justify-center rounded-full border border-border bg-muted px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              title="Profile"
            >
              OP
            </button>
          </div>
        </header>

        {/* Desktop content card */}
        <div className="hidden md:flex md:min-h-0 md:flex-1 md:flex-col md:overflow-hidden md:rounded-[28px] md:border md:border-border md:bg-card md:shadow-lg">
          <main ref={desktopMainRef} className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-10">
            {children}
          </main>
        </div>

        {/* ─── MOBILE ─── */}
        {/* Mobile header */}
        <header className="z-40 bg-background/95 backdrop-blur md:hidden">
          <div className="flex items-center gap-2 px-4 pb-3 pt-4">
            <button onClick={() => navigate("/dashboard")} className="shrink-0 text-left leading-none">
              <span className="font-pixel text-[1.2rem] tracking-[-0.08em] text-foreground">
                MSX
              </span>
            </button>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <button
                onClick={toggleDark}
                className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Bell className="h-3.5 w-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-foreground/60 border-2 border-background" />
                )}
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted px-2 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent"
              >
                OP
              </button>
            </div>
          </div>
        </header>

        {/* Mobile content */}
        <main className="flex-1 overflow-auto p-4 pb-20 md:hidden">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
          <div className="flex items-center justify-around h-14 bg-sidebar border-t border-sidebar-border">
            {navItemsDef.map(({ to, id, labelKey, icon: Icon }) => {
              const isActive =
                to === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(to);

              return (
                <NavLink
                  key={id}
                  to={to}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full gap-0.5",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                  <span className={cn("text-[10px]", isActive && "font-medium")}>
                    {t(labelKey)}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
