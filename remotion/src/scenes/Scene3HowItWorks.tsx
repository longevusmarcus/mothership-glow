import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../MainVideo";

const steps = [
  { num: "01", label: "SIGNALS", desc: "Scan 12+ sources" },
  { num: "02", label: "IDEAS", desc: "Pre-validated demand" },
  { num: "03", label: "PLUG-IN", desc: "Install skills & build" },
  { num: "04", label: "DEPLOY", desc: "Launch on MSX" },
  { num: "05", label: "ARENA", desc: "Battle live" },
  { num: "06", label: "REWARDS", desc: "$3K/mo winners" },
];

export const Scene3HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section title
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 13,
          color: colors.muted,
          letterSpacing: "0.2em",
          fontWeight: 700,
          marginBottom: 50,
          opacity: titleOpacity,
        }}
      >
        — HOW IT WORKS —
      </div>

      {/* Steps grid */}
      <div
        style={{
          display: "flex",
          gap: 0,
        }}
      >
        {steps.map((step, i) => {
          const delay = 15 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 180 } });
          const opacity = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [40, 0]);
          const isActive = Math.floor((frame - 60) / 15) % 6 === i && frame > 60;

          return (
            <div
              key={i}
              style={{
                width: 220,
                padding: "30px 20px",
                borderRight: i < 5 ? `1px solid ${colors.gridLineBright}` : "none",
                borderTop: `1px solid ${colors.gridLineBright}`,
                borderBottom: `1px solid ${colors.gridLineBright}`,
                opacity,
                transform: `translateY(${y}px)`,
                textAlign: "center",
                background: isActive ? `rgba(200,168,78,0.06)` : "transparent",
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  color: isActive ? colors.accent : colors.muted,
                  marginBottom: 10,
                  letterSpacing: "0.1em",
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 15,
                  color: isActive ? colors.accentBright : colors.fg,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  marginBottom: 8,
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  color: colors.muted,
                  lineHeight: 1.5,
                }}
              >
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated highlight bar */}
      {frame > 60 && (
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: `calc(50% - 660px + ${(Math.floor((frame - 60) / 15) % 6) * 220}px)`,
            width: 220,
            height: 3,
            background: colors.accent,
            opacity: 0.6,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
