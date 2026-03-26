import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { colors } from "../theme";
import { fonts } from "../MainVideo";

const lines = [
  "AI agents are powerful.",
  "But they lack direction.",
  "No signals. No validation. No market.",
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 180,
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Vertical accent line */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: "20%",
          bottom: "20%",
          width: 2,
          background: colors.accent,
          opacity: interpolate(frame, [0, 20], [0, 0.4], { extrapolateRight: "clamp" }),
        }}
      />

      {lines.map((line, i) => {
        const delay = i * 22;
        const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 150 } });
        const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
        const x = interpolate(s, [0, 1], [-80, 0]);
        const isLast = i === lines.length - 1;

        return (
          <div
            key={i}
            style={{
              fontFamily: isLast ? fonts.mono : fonts.serif,
              fontSize: isLast ? 38 : 48,
              color: isLast ? colors.accent : colors.fg,
              fontWeight: isLast ? 700 : 400,
              opacity,
              transform: `translateX(${x}px)`,
              letterSpacing: isLast ? "0.05em" : undefined,
            }}
          >
            {isLast ? `> ${line}` : line}
          </div>
        );
      })}

      {/* Blinking cursor after last line */}
      <Sequence from={66}>
        <div
          style={{
            position: "absolute",
            left: 180,
            bottom: "32%",
            width: 3,
            height: 40,
            background: colors.accent,
            opacity: Math.sin(frame * 0.15) > 0 ? 1 : 0,
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
