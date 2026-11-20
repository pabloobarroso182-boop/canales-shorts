// Composición de prueba de las herramientas de animación instaladas el 19/11 (no se usa en el canal).
import React from "react";
import { AbsoluteFill, Composition, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { CameraMotionBlur } from "@remotion/motion-blur";
import gsap from "gsap";

const lottieData: LottieAnimationData = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 400, h: 400, nm: "pulso", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "c", sr: 1, ao: 0, ip: 0, op: 60, st: 0, bm: 0,
    ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [200, 200, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ t: 0, s: [40, 40, 100], i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } }, { t: 60, s: [120, 120, 100] }] } },
    shapes: [{ ty: "gr", it: [
      { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [200, 200] }, nm: "e" },
      { ty: "fl", c: { a: 0, k: [0.17, 0.85, 1, 1] }, o: { a: 0, k: 100 }, nm: "f" },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
    ], nm: "g" }],
  } as any],
} as any;

const Cubo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <mesh rotation={[f * 0.03, f * 0.05, 0]}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial color="#FFD23F" />
    </mesh>
  );
};

const Prueba: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const p = evolvePath(interpolate(f, [0, durationInFrames], [0, 1]), "M 100 1500 C 300 1300, 700 1700, 980 1450");
  const tl = gsap.timeline({ paused: true }).fromTo({ x: 0 }, { x: 0 }, { x: 600, duration: 1, ease: "bounce.out" });
  tl.progress(Math.min(1, f / 45));
  const gx = (tl.getChildren()[0] as any).targets()[0].x as number;
  return (
    <AbsoluteFill style={{ background: "#0B1230" }}>
      <ThreeCanvas width={width} height={900} style={{ position: "absolute", top: 120 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} />
        <Cubo />
      </ThreeCanvas>
      <div style={{ position: "absolute", top: 1000, left: 340, width: 400, height: 400 }}>
        <Lottie animationData={lottieData} />
      </div>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        <path d="M 100 1500 C 300 1300, 700 1700, 980 1450" stroke="#7CFF6B" strokeWidth={14} fill="none" strokeDasharray={p.strokeDasharray} strokeDashoffset={p.strokeDashoffset} />
      </svg>
      {new Array(20).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 60 + i * 48 + noise2D("x" + i, f * 0.02, 0) * 20, top: 1700 + noise2D("y" + i, 0, f * 0.02) * 40, width: 16, height: 16, borderRadius: 8, background: "#FF8A1F" }} />
      ))}
      <CameraMotionBlur shutterAngle={180} samples={4}>
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 1820, left: 120 + gx, width: 80, height: 40, borderRadius: 20, background: "#fff" }} />
        </AbsoluteFill>
      </CameraMotionBlur>
    </AbsoluteFill>
  );
};

export const RootPruebas: React.FC = () => (
  <Composition id="PruebaHerramientas" component={Prueba} fps={30} width={1080} height={1920} durationInFrames={60} />
);
