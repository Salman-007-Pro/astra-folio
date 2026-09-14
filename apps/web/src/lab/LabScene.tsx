import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { OrthographicCamera } from "three";
import SceneObjects from "./SceneObjects";
import { sceneFamilies, type SceneProps } from "./scene-presets";
function Frame({ preset }: Pick<SceneProps, "preset">) {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const compact = [
      "sculpture",
      "phone",
      "shield",
      "cache",
      "orbits",
      "documents",
      "layers",
    ].includes(sceneFamilies[preset]);
    (camera as OrthographicCamera).zoom = Math.min(
      size.width / (compact ? 4.8 : 7.6),
      size.height / 4.6,
    );
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, preset, invalidate]);
  return null;
}
export default function LabScene(props: SceneProps) {
  return (
    <Canvas
      orthographic
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], zoom: 45 }}
      frameloop={props.motion ? "always" : "demand"}
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <directionalLight position={[-4, 1, 3]} intensity={1.5} color="#a3dcff" />
      <Frame preset={props.preset} />
      <ContextRecovery onFailure={props.onFailure} />
      <SceneObjects key={props.preset} {...props} />
    </Canvas>
  );
}
function ContextRecovery({ onFailure }: Pick<SceneProps, "onFailure">) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}
