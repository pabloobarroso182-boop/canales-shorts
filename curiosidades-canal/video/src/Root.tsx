import { CalculateMetadataFunction, Composition } from "remotion";
import { Short } from "./short/Short";
import { ShortProps, shortSchema } from "./short/types";
import { Divulga, DivulgaProps, divulgaSchema } from "./divulga/Divulga";

const calcDivulga: CalculateMetadataFunction<DivulgaProps> = ({ props }) => ({
  durationInFrames: Math.max(1, Math.ceil((props.durationMs / 1000) * 30)),
});

const FPS = 30;

const calculateMetadata: CalculateMetadataFunction<ShortProps> = ({ props }) => ({
  durationInFrames: Math.max(1, Math.ceil((props.durationMs / 1000) * FPS)),
});

// Las props reales las escribe pipeline/make_short.py (output/<id>/props.json)
// y se pasan con: npx remotion render Short out.mp4 --props=props.json
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="Short"
      component={Short}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={300}
      schema={shortSchema}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        id: "demo",
        durationMs: 6000,
        audio: "shorts/demo.wav",
        scenes: [
          { startMs: 0, endMs: 3000, icon: "planet", big: "DÍA > AÑO", small: "en Venus", kind: "hook", accent: "#FFD23F" },
          { startMs: 3000, endMs: 6000, icon: "question", big: "", kind: "cta" },
        ],
        captions: [],
        estilo: "tarjetas",
      }}
    />
    <Composition
      id="Divulga"
      component={Divulga}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={300}
      schema={divulgaSchema}
      calculateMetadata={calcDivulga}
      defaultProps={{ id: "demo", durationMs: 4000, audio: "shorts/demo.wav", escenas: [{ clave: "gancho", startMs: 0 }], marcas: {}, captions: [] }}
    />
    </>
  );
};
