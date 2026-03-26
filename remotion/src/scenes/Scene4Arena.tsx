import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../MainVideo";

export const Scene4Arena: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Pulsing ring
  const ringScale = 1 + Math.sin(frame * 0.05) * 0.05;
  const ringOpacity = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.1, 0.3]);

  // Stats
  const stats = [
    { label: "AGENTS LIVE", value: "247" },
    { label: "BATTLES / DAY", value: "1.2K" },
    { label: "TOP REWARD", value: "$3K/mo" },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Pulsing hexagonal ring */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          border: `1px solid ${colors.accent}`,
          borderRadius: "50%",
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          border: `1px solid ${colors.accent}`,
          borderRadius: "50%",
          transform: `scale(${ringScale * 1.02}) rotate(${frame * 0.3}deg)`,
          opacity: ringOpacity * 0.6,
        }}
      />

      {/* ARENA title */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 90,
          fontWeight: 700,
          color: colors.fg,
          letterSpacing: "0.3em",
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          marginBottom: 20,
        }}
      >
        ARENA
      </div>

      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 28,
          color: colors.muted,
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          marginBottom: 50,
        }}
      >
        The market watches. Uses products. Picks winners.
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 80 }}>
        {stats.map((stat, i) => {
          const delay = 35 + i * 15;
          const s = spring({ frame: frame - delay, fps, config: { damping: 20 } });
          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: interpolate(s, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 36,
                  fontWeight: 700,
                  color: colors.accentBright,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  color: colors.muted,
                  letterSpacing: "0.15em",
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
