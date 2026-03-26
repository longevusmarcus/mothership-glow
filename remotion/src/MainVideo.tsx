import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadDMSerifDisplay } from "@remotion/google-fonts/DMSerifDisplay";
import { colors } from "./theme";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3HowItWorks } from "./scenes/Scene3HowItWorks";
import { Scene4Arena } from "./scenes/Scene4Arena";
import { Scene5CTA } from "./scenes/Scene5CTA";

const { fontFamily: monoFont } = loadSpaceMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
const { fontFamily: serifFont } = loadDMSerifDisplay("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const fonts = { mono: monoFont, serif: serifFont };

const TRANSITION_DURATION = 15;
const timing = springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_DURATION });

// Persistent animated grid background
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.3;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Horizontal grid lines */}
      {Array.from({ length: 20 }).map((_, i) => {
        const y = (i * 60 + drift) % 1200 - 60;
        const opacity = interpolate(
          Math.sin(frame * 0.02 + i * 0.5),
          [-1, 1],
          [0.03, 0.08]
        );
        return (
          <div
            key={`h${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y,
              height: 1,
              background: colors.accent,
              opacity,
            }}
          />
        );
      })}
      {/* Vertical grid lines */}
      {Array.from({ length: 35 }).map((_, i) => {
        const x = (i * 60 + drift * 0.5) % 2100 - 60;
        const opacity = interpolate(
          Math.sin(frame * 0.015 + i * 0.3),
          [-1, 1],
          [0.02, 0.06]
        );
        return (
          <div
            key={`v${i}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: x,
              width: 1,
              background: colors.accent,
              opacity,
            }}
          />
        );
      })}
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,168,78,0.06), transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene1Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={timing}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene2Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={timing}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene3HowItWorks />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={timing}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene4Arena />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={timing}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene5CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
