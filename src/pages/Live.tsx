import { Activity, TrendingUp, Package, CheckCircle2, Lightbulb, Radio, FileText, Mail, Megaphone, Trophy, Tv, Twitter, ExternalLink, Users, DollarSign, Timer, Flame } from "lucide-react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { CursorCardsContainer, CursorCard } from "@/components/ui/cursor-cards";
import { useLanguage } from "@/i18n/LanguageContext";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  revenueData,
  ecosystemStats,
  liveDocuments as documents,
  liveIdeas as ideas,
  liveSignals as signals,
  leaderboard,
  liveTasks as tasks,
  liveProducts as products,
  liveTweets as tweets,
  liveEmails as emails,
  liveAds as ads,
  hackathon,
  terminalLines,
} from "@/data/mock";

const SectionHeader = ({ icon: Icon, title, dot }: { icon?: any; title: string; dot?: boolean }) => (
  <div className="flex items-center gap-2 mb-4">
    {dot && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />}
    <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
      {">"} {title}
    </span>
    <span className="flex-1 border-t border-dashed border-border" />
  </div>
);

const Live = () => {
  const { locale } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Terminal header */}
      <div className="bg-foreground text-background rounded-lg p-4 font-mono text-[12px] leading-relaxed">
        {terminalLines.map((line, i) => (
          <div key={i} className={line.color === "text-destructive" ? "text-destructive" : "opacity-60"}>
            {line.text}
          </div>
        ))}
      </div>

      {/* ASCII header */}
      <div className="flex items-center gap-6">
        <pre className="text-[8px] leading-[1.1] font-mono text-muted-foreground hidden sm:block">{`
    .------.
   / .--. . \\
  / /  ( 6 6 ) \\
 | |   _\\  /_ |
 | | / \\    / |
  \\ \\|  '--'  |/
   \\ '._____.'  
    '--------'`}</pre>
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-mondwest font-semibold tracking-tight">
            <TextShimmer as="span" duration={2.5}>Command Ship</TextShimmer>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Orbiting the market, beaming signals to your launchpad, taking you to mars.
          </p>
        </div>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div>
            <SectionHeader title="ECOSYSTEM" />
            <div className="space-y-2">
              {ecosystemStats.map((s, i) => (
                <div key={i} className="flex items-baseline justify-between text-[13px]">
                  <span className="text-muted-foreground">{s.label}:</span>
                  <span>
                    <span className="font-semibold tabular-nums">{s.value}</span>
                    {s.change && <span className="text-muted-foreground text-[11px] ml-1.5">({s.change})</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue chart */}
          <div className="h-[180px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="liveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={40} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={1.5} fill="url(#liveGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Market Signals */}
          <div>
            <SectionHeader title="LIVE_MARKET_SIGNALS" />
            <div className="space-y-3">
              {signals.map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] leading-snug">{s.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.source} · {s.views}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <SectionHeader title="PRODUCT_LEADERBOARD" />
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-muted-foreground text-left">
                  <th className="font-normal pb-2 pr-2">#</th>
                  <th className="font-normal pb-2">Product</th>
                  <th className="font-normal pb-2 text-right">MRR</th>
                  <th className="font-normal pb-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((p) => (
                  <tr key={p.rank} className="border-t border-border/50">
                    <td className="py-2 pr-2 text-muted-foreground tabular-nums">{p.rank}</td>
                    <td className="py-2">
                      <div className="font-medium text-[13px]">{p.name}</div>
                      {p.sub && <div className="text-[10px] text-muted-foreground">{p.sub}</div>}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">{p.mrr}</td>
                    <td className="py-2 text-right font-medium tabular-nums">{p.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hackathon */}
          <div>
            <SectionHeader title="HACKATHON_OF_THE_DAY" />
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-[10px] font-mono uppercase text-destructive font-medium">LIVE NOW</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Live</span>
              </div>
              <h3 className="text-[15px] font-semibold">{hackathon.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{hackathon.desc}</p>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {hackathon.prize}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {hackathon.participants}</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {hackathon.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="space-y-6">
          {/* Documents */}
          <div>
            <SectionHeader title="DOCUMENTS" />
            <div className="space-y-2">
              {documents.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-[13px] py-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-muted-foreground w-4 text-center">{d.type}</span>
                    <span>{d.company} — {d.doc}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{d.time}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">+ 2,725 documents created in the past 24h</p>
          </div>

          {/* Ideas */}
          <div>
            <SectionHeader title="IDEAS_GENERATED" />
            <div className="space-y-3">
              {ideas.map((idea, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-[14px] font-semibold">{idea.name}</h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{idea.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">From: {idea.desc}</p>
                  <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
                    Score: {idea.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <SectionHeader title="TASKS_BY_PARTICIPANTS" />
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={i} className="bg-destructive/8 border border-destructive/15 rounded-lg p-4">
                  <p className="text-[13px] font-medium leading-snug mb-2">{task.title}</p>
                  <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-destructive/15 text-destructive">
                    {task.tag}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">+ 3,110 tasks completed in the past 24h</p>
          </div>

          {/* Products by participants */}
          <div>
            <SectionHeader title="PRODUCTS_BY_PARTICIPANTS" />
            <div className="space-y-2">
              {products.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-[13px] font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.domain}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{p.time}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">40 shipped products across participants</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Shows / Live stream */}
          <div>
            <SectionHeader title="SHOWS" dot />
            <div className="bg-muted/50 rounded-lg aspect-video flex flex-col items-center justify-center gap-2 border border-border">
              <Tv className="h-8 w-8 text-muted-foreground/40" strokeWidth={1} />
              <p className="text-[13px] font-mono text-muted-foreground">Streamer is absent</p>
              <p className="text-[11px] text-muted-foreground/60">Coming back soon</p>
            </div>
            <div className="flex items-center gap-2 mt-3 text-[12px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span className="font-mono font-medium text-destructive">LIVE</span>
              </span>
              <span className="font-mono truncate">The Future of VibeCoding</span>
              <a href="#" className="ml-auto shrink-0 inline-flex items-center gap-1 text-[11px] font-mono border border-destructive/30 text-destructive rounded-full px-3 py-1 hover:bg-destructive/10 transition-colors">
                Watch on supavibe.tv <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Live on <span className="underline">SupaVibe.TV</span>
            </p>
          </div>

          {/* X.COM */}
          <div>
            <SectionHeader title="X.COM" />
            <div className="space-y-3">
              {tweets.map((tw, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <p className="text-[13px] leading-snug">{tw.text}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{tw.time}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">4 tweets total</p>
          </div>

          {/* Email */}
          <div>
            <SectionHeader title="EMAIL" />
            <div className="space-y-2">
              {emails.map((e, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-1">
                  <div>
                    <p className="text-[13px] font-medium">{e.subject}</p>
                    <p className="text-[10px] text-muted-foreground">To: {e.to}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{e.time}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">4 total emails sent</p>
          </div>

          {/* Ads */}
          <div>
            <SectionHeader title="ADS_(DEMO:SOON)" />
            <p className="text-[13px] mb-3">
              Spend Today: <span className="font-semibold tabular-nums">$5.87</span>{" "}
              <span className="text-muted-foreground text-[11px]">($20.00/day budget)</span>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-muted-foreground text-left">
                    <th className="font-normal pb-2">Ad</th>
                    <th className="font-normal pb-2 text-right">Spend</th>
                    <th className="font-normal pb-2 text-right">Impr.</th>
                    <th className="font-normal pb-2 text-right">Clicks</th>
                    <th className="font-normal pb-2 text-right">CTR</th>
                    <th className="font-normal pb-2 text-right">CPC</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="py-1.5 pr-3 whitespace-nowrap">{ad.name}</td>
                      <td className="py-1.5 text-right tabular-nums">{ad.spend}</td>
                      <td className="py-1.5 text-right tabular-nums">{ad.impr}</td>
                      <td className="py-1.5 text-right tabular-nums">{ad.clicks}</td>
                      <td className="py-1.5 text-right tabular-nums">{ad.ctr}</td>
                      <td className="py-1.5 text-right tabular-nums">{ad.cpc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">+ 5 ads created in the past 24h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Live;
