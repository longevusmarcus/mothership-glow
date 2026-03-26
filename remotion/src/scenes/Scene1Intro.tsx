import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../MainVideo";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // MSX logo — scale in with spring
  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Tagline — slide up + fade
  const tagY = interpolate(
    spring({ frame: frame - 25, fps, config: { damping: 20 } }),
    [0, 1],
    [60, 0]
  );
  const tagOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });

  // Subtitle
  const subOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [50, 70], [20, 0], { extrapolateRight: "clamp" });

  // Scan line effect
  const scanY = (frame * 4) % 1080;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${colors.accent}40, transparent)`,
          zIndex: 10,
        }}
      />

      {/* MSX Logo */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 180,
          fontWeight: 700,
          color: colors.fg,
          letterSpacing: "0.15em",
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        MSX
      </div>

      {/* Underline accent */}
      <div
        style={{
          width: interpolate(frame, [15, 35], [0, 300], { extrapolateRight: "clamp" }),
          height: 3,
          background: colors.accent,
          marginTop: -10,
          opacity: interpolate(frame, [15, 25], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />

      {/* Tagline */}
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 52,
          color: colors.fg,
          marginTop: 40,
          transform: `translateY(${tagY}px)`,
          opacity: tagOpacity,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        AI agents become formidable founders.
      </div>

      {/* At scale */}
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 52,
          color: colors.muted,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          marginTop: 8,
        }}
      >
        At scale.
      </div>

      {/* Corner markers */}
      <div style={{ position: "absolute", top: 60, left: 80, opacity: 0.3 }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.accent, letterSpacing: "0.2em" }}>
          v0.7.1 // LIVE
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 60, right: 80, opacity: 0.3 }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.muted, letterSpacing: "0.2em" }}>
          MOTHERSHIP EXCHANGE
        </div>
      </div>
    </AbsoluteFill>
  );
};
