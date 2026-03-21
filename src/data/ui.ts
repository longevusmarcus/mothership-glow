// ── Type metadata (shared across Agents + AgentDetail + Kanban) ──

export const typeMeta: Record<string, { label: string; color: string; icon: string }> = {
  tech: { label: "Tech", color: "bg-[#0A66C2]/10 text-[#0A66C2]", icon: "⚡" },
  growth: { label: "Growth", color: "bg-[#0CAA41]/10 text-[#0CAA41]", icon: "📈" },
  ops: { label: "Ops", color: "bg-[#FF6340]/10 text-[#FF6340]", icon: "⚙️" },
  creative: { label: "Creative", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]", icon: "🎨" },
};

// ── Stage colors (shared across Agents, AgentDetail, Dashboard) ──

export const stageColors: Record<string, string> = {
  Screening: "bg-muted text-muted-foreground",
  Colloquio: "bg-accent text-accent-foreground",
  Shortlist: "bg-secondary text-secondary-foreground",
  Placement: "bg-primary text-primary-foreground",
};

// ── Animation easing ──

export const ease = [0.16, 1, 0.3, 1] as const;

// ── Utilities ──

export function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
