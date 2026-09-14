import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import { Color, Vector3, type Group, type Mesh } from "three";
import { sceneFamilies, type SceneProps } from "./scene-presets";
type Point = [number, number, number];
function MotionPart({
  children,
  motion,
  index = 0,
  mode = "float",
  position,
  rotation,
  scale,
}: {
  children: ReactNode;
  motion: boolean;
  index?: number;
  mode?: "float" | "lift" | "turn" | "pulse" | "slide";
  position?: Point;
  rotation?: Point;
  scale?: number;
}) {
  const ref = useRef<Group>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (!motion || !ref.current) return;
    elapsed.current += Math.min(delta, 0.05);
    const t = elapsed.current * 1.5 - index * 0.7;
    const part = ref.current;
    if (mode === "turn") part.rotation.y = Math.sin(t * 0.6) * 0.65;
    else if (mode === "slide") part.position.x = Math.sin(t) * 0.18;
    else if (mode === "pulse") part.scale.setScalar(1 + Math.sin(t) * 0.12);
    else {
      part.position.y = Math.sin(t) * (mode === "lift" ? 0.22 : 0.1);
      part.rotation.z = Math.sin(t * 0.7) * (mode === "lift" ? 0.025 : 0.055);
    }
  });
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={ref}>{children}</group>
    </group>
  );
}
function Box({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color,
  wire = false,
}: {
  position?: Point;
  size?: Point;
  color: string;
  wire?: boolean;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.15}
        wireframe={wire}
      />
    </mesh>
  );
}
function Orb({
  position = [0, 0, 0],
  radius = 0.2,
  color,
}: {
  position?: Point;
  radius?: number;
  color: string;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 20, 14]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.35} />
    </mesh>
  );
}
function Link({ from, to, color }: { from: Point; to: Point; color: string }) {
  const a = new Vector3(...from),
    b = new Vector3(...to);
  const direction = b.clone().sub(a);
  return (
    <group position={a.add(b).multiplyScalar(0.5)}>
      <LinkCylinder direction={direction} color={color} />
    </group>
  );
}
function LinkCylinder({
  direction,
  color,
}: {
  direction: Vector3;
  color: string;
}) {
  const ref = useRef<Mesh>(null);
  return (
    <mesh
      ref={ref}
      onUpdate={(m) =>
        m.quaternion.setFromUnitVectors(
          new Vector3(0, 1, 0),
          direction.clone().normalize(),
        )
      }
    >
      <cylinderGeometry args={[0.025, 0.025, direction.length(), 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function Ring({
  position = [0, 0, 0],
  radius = 1,
  color,
  rotation = [0, 0, 0],
}: {
  position?: Point;
  radius?: number;
  color: string;
  rotation?: Point;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[radius, 0.035, 8, 64]} />
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
    </mesh>
  );
}
function Panel({
  children,
  color,
  position = [0, 0, 0],
}: {
  children?: ReactNode;
  color: string;
  position?: Point;
}) {
  return (
    <group position={position}>
      <Box size={[2.4, 1.65, 0.12]} color={color} />
      {[-0.9, -0.65, -0.4].map((x) => (
        <Orb key={x} position={[x, 0.6, 0.09]} radius={0.05} color="#ffffff" />
      ))}
      {children}
    </group>
  );
}
export default function SceneObjects(props: SceneProps) {
  const { preset, state, options, motion, color, shape, finish, angle } = props;
  const family =
    preset === "query" && options.document
      ? "documents"
      : sceneFamilies[preset];
  const group = useRef<Group>(null);
  const packet = useRef<Mesh>(null);
  const elapsed = useRef(0);
  const impulse = useRef(0);
  useEffect(() => {
    impulse.current = state.count > 0 ? 1 : 0;
  }, [state.count]);
  const pale = `#${new Color(color).lerp(new Color("#ffffff"), 0.75).getHexString()}`;
  const dark = `#${new Color(color).lerp(new Color("#162b36"), 0.35).getHexString()}`;
  const signal = state.error ? "#e56b52" : "#73cbb5";
  useFrame((_, delta) => {
    if (!motion) return;
    const step = Math.min(delta, 0.05);
    elapsed.current += step;
    const t = elapsed.current;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.8) * 0.1;
      impulse.current = Math.max(0, impulse.current - step * 1.5);
      group.current.scale.setScalar(
        1 + Math.sin(impulse.current * Math.PI) * 0.09,
      );
      if (family === "sculpture" || family === "orbits" || family === "cache")
        group.current.rotation.y += step * 0.55;
    }
    if (packet.current) {
      if (family === "cache" || family === "orbits") {
        packet.current.position.set(
          Math.cos(t * 1.5) * 1.6,
          Math.sin(t * 1.5) * 1.6,
          0.15,
        );
      } else {
        packet.current.position.x = ((t % 3) / 3) * 5.5 - 2.75;
        packet.current.position.y = -1.65;
      }
    }
  });
  let object: ReactNode = null;
  switch (family) {
    case "sculpture":
      object = (
        <>
          <mesh rotation={[0.3, 0, 0.2]}>
            {shape === "knot" ? (
              <torusKnotGeometry args={[0.85, 0.28, 96, 16]} />
            ) : shape === "sphere" ? (
              <sphereGeometry args={[1.2, 32, 24]} />
            ) : shape === "torus" ? (
              <torusGeometry args={[1, 0.35, 20, 64]} />
            ) : (
              <icosahedronGeometry args={[1.35, 0]} />
            )}
            <meshStandardMaterial
              color={finish === "metal" ? pale : color}
              roughness={finish === "metal" ? 0.12 : 0.4}
              metalness={finish === "metal" ? 0.95 : 0.15}
              wireframe={finish === "wireframe"}
            />
          </mesh>
          <Ring radius={1.75} color={pale} rotation={[1.15, 0.3, 0]} />
          <Ring radius={2} color={color} rotation={[-0.8, 0.3, 0.3]} />
        </>
      );
      break;
    case "layers":
      object = (
        <group rotation={[-0.2, -0.35, 0]}>
          {[0, 1, 2].map((i) => (
            <MotionPart
              motion={motion}
              index={i}
              mode="lift"
              key={i}
              position={[(i - 1) * 0.45, (i - 1) * 0.42, (i - 1) * 0.45]}
            >
              <Panel color={i === 2 ? pale : i === 1 ? color : dark}>
                {i === 2 &&
                  [0, 1, 2].map((j) => (
                    <Box
                      key={j}
                      position={
                        options.layout === "grid"
                          ? [(j - 1) * (0.55 + options.gap / 90), -0.12, 0.13]
                          : [0, 0.24 - j * 0.38, 0.13]
                      }
                      size={
                        options.layout === "grid"
                          ? [0.46, 0.7, 0.09]
                          : [1.65, 0.22, 0.09]
                      }
                      color={j === state.count % 3 ? signal : color}
                    />
                  ))}
              </Panel>
            </MotionPart>
          ))}
        </group>
      );
      break;
    case "pages":
      object = (
        <group rotation={[0, -0.15, 0]}>
          {[0, 1, 2].map((i) => (
            <MotionPart
              motion={motion}
              index={i}
              mode="float"
              key={i}
              position={[
                (i - 1) * 2,
                Math.abs(i - 1) * -0.25,
                -Math.abs(i - 1) * 0.45,
              ]}
              rotation={[0, (i - 1) * -0.25, 0]}
              scale={i === state.count % 3 ? 1.08 : 0.9}
            >
              <Panel color={i === state.count % 3 ? color : pale}>
                <Box
                  position={[-0.65, 0.1, 0.12]}
                  size={[0.6, 0.45, 0.05]}
                  color={dark}
                />
                <Box
                  position={[0.4, 0.12, 0.12]}
                  size={[0.9, 0.12, 0.05]}
                  color={dark}
                />
                <Box
                  position={[0.1, -0.3, 0.12]}
                  size={[1.7, 0.13, 0.05]}
                  color={i === state.count % 3 ? signal : color}
                />
              </Panel>
            </MotionPart>
          ))}
        </group>
      );
      break;
    case "tree": {
      const nodes: Point[] = [
        [0, 1.3, 0],
        [-1.8, 0, 0],
        [1.8, 0, 0],
        [-2.6, -1.25, 0],
        [-1, -1.25, 0],
        [1, -1.25, 0],
        [2.6, -1.25, 0],
      ];
      object = (
        <>
          {nodes.slice(1).map((n, i) => (
            <Link
              key={i}
              from={nodes[i < 2 ? 0 : i < 4 ? 1 : 2]}
              to={n}
              color={pale}
            />
          ))}
          {nodes.map((n, i) => (
            <MotionPart
              motion={motion}
              index={i}
              mode="pulse"
              position={n}
              key={i}
            >
              {i === 0 ? (
                <Orb radius={0.42} color={color} />
              ) : (
                <Box
                  size={[0.9, 0.55, 0.3]}
                  color={i === state.count % 7 ? signal : color}
                />
              )}
            </MotionPart>
          ))}
        </>
      );
      break;
    }
    case "network":
      object = (
        <>
          <Orb radius={0.65} color={color} />
          <Ring radius={0.9} color={pale} />
          {[0, 1, 2, 3, 4].map((i) => {
            const p: Point = [
              Math.cos((i * Math.PI * 2) / 5) * 2.2,
              Math.sin((i * Math.PI * 2) / 5) * 1.5,
              0,
            ];
            return (
              <group key={i}>
                <Link from={[0, 0, 0]} to={p} color={pale} />
                <Box
                  position={p}
                  size={[0.65, 0.65, 0.3]}
                  color={i === state.count % 5 ? signal : color}
                />
              </group>
            );
          })}
        </>
      );
      break;
    case "database":
      object = (
        <group rotation={[0.15, -0.3, 0]}>
          {[-1.8, 0, 1.8].map((x, j) => (
            <MotionPart
              motion={motion}
              index={j}
              mode="lift"
              key={x}
              position={[x, 0, 0]}
            >
              {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[0, i * 0.36 - 0.6, 0]}>
                  <cylinderGeometry args={[0.66, 0.66, 0.28, 32]} />
                  <meshStandardMaterial
                    color={j === 1 ? color : pale}
                    roughness={0.4}
                    metalness={0.25}
                  />
                </mesh>
              ))}
              <Orb
                position={[0, 1.05, 0]}
                radius={0.14}
                color={options.indexed ? signal : dark}
              />
            </MotionPart>
          ))}
          <Link
            from={[-2.5, -1.3, 0]}
            to={[2.5, -1.3, 0]}
            color={options.indexed ? signal : pale}
          />
        </group>
      );
      break;
    case "documents":
      object = (
        <group rotation={[0, -0.25, 0]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <MotionPart
              motion={motion}
              index={i}
              mode="slide"
              key={i}
              position={[(i - 2) * 0.65, (i - 2) * 0.14, -i * 0.18]}
            >
              <Box size={[1.6, 2, 0.08]} color={i === 4 ? pale : color} />
              {[0, 1, 2, 3].map((j) => (
                <Box
                  key={j}
                  position={[-0.1, 0.55 - j * 0.35, 0.07]}
                  size={[j % 2 ? 0.75 : 1.1, 0.08, 0.04]}
                  color={
                    options.indexed && j === state.count % 4 ? signal : dark
                  }
                />
              ))}
            </MotionPart>
          ))}
        </group>
      );
      break;
    case "cache":
      object = (
        <>
          <Orb radius={0.7} color={state.cached ? signal : color} />
          <Ring radius={1.35} color={color} />
          <Ring radius={1.65} color={pale} rotation={[0.8, 0.3, 0.4]} />
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              position={[
                Math.cos((i * Math.PI) / 2) * 1.65,
                Math.sin((i * Math.PI) / 2) * 1.65,
                0,
              ]}
              size={[0.38, 0.38, 0.38]}
              color={state.cached ? signal : pale}
            />
          ))}
        </>
      );
      break;
    case "servers": {
      const n = preset === "routing" ? options.replicas : 3;
      object = (
        <group rotation={[0.05, -0.2, 0]}>
          {Array.from({ length: n }, (_, i) => (
            <MotionPart
              motion={motion && !(options.offline && i === 0)}
              index={i}
              mode="lift"
              key={i}
              position={[(i - (n - 1) / 2) * 1.45, 0, 0]}
            >
              <Box
                size={[1, 2.05, 0.6]}
                color={options.offline && i === 0 ? dark : pale}
              />
              {[0, 1, 2].map((j) => (
                <group key={j} position={[0, 0.6 - j * 0.6, 0.34]}>
                  <Box size={[0.8, 0.4, 0.08]} color={color} />
                  <Orb
                    position={[0.25, 0, 0.08]}
                    radius={0.065}
                    color={options.offline && i === 0 ? "#e56b52" : signal}
                  />
                </group>
              ))}
            </MotionPart>
          ))}
          <Link from={[-2.7, -1.5, 0]} to={[2.7, -1.5, 0]} color={pale} />
        </group>
      );
      break;
    }
    case "phone":
      object = (
        <MotionPart motion={motion} mode="turn" rotation={[0, -0.3, -0.08]}>
          <Box size={[1.65, 2.9, 0.22]} color={dark} />
          <Box position={[0, 0, 0.14]} size={[1.45, 2.65, 0.06]} color={pale} />
          <Box
            position={[0, 1.13, 0.19]}
            size={[0.45, 0.08, 0.04]}
            color={dark}
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Box
              key={i}
              position={[
                ((i % 2) - 0.5) * 0.6,
                0.62 - Math.floor(i / 2) * 0.55,
                0.2,
              ]}
              size={[0.43, 0.4, 0.06]}
              color={i === state.count % 6 ? signal : color}
            />
          ))}
          <Ring position={[0, -1.1, 0.19]} radius={0.1} color={dark} />
        </MotionPart>
      );
      break;
    case "shield":
      object = (
        <>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
            <cylinderGeometry args={[1.25, 1.25, 0.2, 6]} />
            <meshStandardMaterial
              color={pale}
              metalness={0.3}
              roughness={0.3}
            />
          </mesh>
          <group position={[0, 0, 0.3]}>
            <Box
              size={[1, 0.8, 0.28]}
              color={state.error ? "#e56b52" : color}
            />
            <Ring
              position={[state.count > 0 && !state.error ? 0.35 : 0, 0.52, 0]}
              radius={0.35}
              color={state.error ? "#e56b52" : color}
            />
            <Orb radius={0.08} position={[0, 0, 0.2]} color={pale} />
          </group>
          <Ring radius={1.65} color={color} />
        </>
      );
      break;
    case "chain":
      object = (
        <group rotation={[0.2, -0.15, 0]}>
          {[-2, 0, 2].map((x, i) => (
            <MotionPart
              motion={motion}
              index={i}
              mode="turn"
              key={x}
              position={[x, 0, 0]}
            >
              <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.7, 0.7, 0.3, 6]} />
                <meshStandardMaterial
                  color={i < state.phase ? signal : color}
                  metalness={0.55}
                  roughness={0.25}
                />
              </mesh>
              <Ring radius={0.38} color={pale} />
              {i < 2 && (
                <Ring
                  position={[1, 0, 0]}
                  radius={0.25}
                  color={pale}
                  rotation={[0, 0.7, 0]}
                />
              )}
            </MotionPart>
          ))}
        </group>
      );
      break;
    case "orbits":
      object = (
        <>
          <Orb radius={0.38} color={color} />
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[i * 0.6, 0.3 * i, i * 0.4]}>
              <Ring radius={1 + i * 0.4} color={i === 1 ? pale : color} />
              <Orb
                position={[1 + i * 0.4, 0, 0]}
                radius={0.16}
                color={signal}
              />
            </group>
          ))}
        </>
      );
      break;
    case "assembly":
    case "container":
      object = (
        <group rotation={[0.35, -0.55, 0]}>
          {Array.from({ length: 9 }, (_, i) => (
            <MotionPart key={i} motion={motion} index={i} mode="lift">
              <Box
                key={i}
                position={[
                  ((i % 3) - 1) * 0.8,
                  Math.floor(i / 3) * 0.65 - 0.65,
                  state.count > 0 ? 0 : (i % 2) * 0.5,
                ]}
                size={[0.68, 0.53, 0.65]}
                color={i === state.count % 9 ? signal : i % 2 ? color : pale}
              />
            </MotionPart>
          ))}
          {family === "container" && (
            <Box size={[2.65, 2.3, 1.2]} color={color} wire />
          )}
        </group>
      );
      break;
    case "pipeline":
    case "queue":
    case "checks":
      object = (
        <>
          <Box position={[0, -0.6, -0.12]} size={[6, 0.1, 0.65]} color={pale} />
          {[0, 1, 2, 3].map((i) => (
            <MotionPart
              motion={motion}
              index={i}
              mode={family === "queue" ? "slide" : "pulse"}
              key={i}
              position={[(i - 1.5) * 1.5, 0.05, 0]}
            >
              {family === "queue" ? (
                <Box
                  size={[0.85, 0.7, 0.6]}
                  color={
                    state.completed
                      ? signal
                      : i === state.count % 4
                        ? color
                        : pale
                  }
                />
              ) : (
                <>
                  <Ring
                    radius={0.46}
                    color={state.error && i === 1 ? "#e56b52" : color}
                  />
                  <Orb
                    radius={0.16}
                    color={i <= state.count % 4 ? signal : pale}
                  />
                </>
              )}
              {i < 3 && (
                <Link from={[0.45, 0, 0]} to={[1.05, 0, 0]} color={pale} />
              )}
            </MotionPart>
          ))}
        </>
      );
      break;
  }
  return (
    <group
      ref={group}
      rotation={[
        0,
        family === "sculpture"
          ? ((angle + state.count * 45) * Math.PI) / 180
          : 0,
        0,
      ]}
    >
      {object}
      {state.count > 0 && family !== "sculpture" && (
        <mesh ref={packet} position={[-2.75, -1.65, 0.15]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color={signal} />
        </mesh>
      )}
    </group>
  );
}
