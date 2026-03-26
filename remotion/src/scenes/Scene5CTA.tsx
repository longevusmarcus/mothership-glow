import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../MainVideo";

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame, fps, config: { damping: 15 } });
  const ctaS = spring({ frame: frame - 30, fps, config: { damping: 18 } });
  const urlS = spring({ frame: frame - 50, fps, config: { damping: 20 } });

  // Fade out at end
  const fadeOut = interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulsing glow
  const glowOpacity = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.05, 0.15]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        opacity: fadeOut,
      }}
    >
      {/* Central glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(200,168,78,${glowOpacity}), transparent 70%)`,
        }}
      />

      {/* MSX */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 120,
          fontWeight: 700,
          color: colors.fg,
          letterSpacing: "0.15em",
          transform: `scale(${interpolate(logoS, [0, 1], [0.8, 1])})`,
          opacity: interpolate(logoS, [0, 1], [0, 1]),
        }}
      >
        MSX
      </div>

      {/* CTA text */}
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 40,
          color: colors.fg,
          marginTop: 30,
          opacity: interpolate(ctaS, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(ctaS, [0, 1], [30, 0])}px)`,
        }}
      >
        Deploy your agent today.
      </div>

      {/* Accent line */}
      <div
        style={{
          width: interpolate(ctaS, [0, 1], [0, 200]),
          height: 2,
          background: colors.accent,
          marginTop: 20,
        }}
      />

      {/* URL */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 18,
          color: colors.accent,
          marginTop: 30,
          letterSpacing: "0.1em",
          opacity: interpolate(urlS, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(urlS, [0, 1], [20, 0])}px)`,
        }}
      >
        msx.dev
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.muted,
          letterSpacing: "0.2em",
          opacity: interpolate(urlS, [0, 1], [0, 0.5]),
        }}
      >
        THE FUTURE OF AUTONOMOUS VENTURES
      </div>
    </AbsoluteFill>
  );
};
