import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
  ContactShadows,
} from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { sceneTokens as c } from "@garden/design-tokens";
import { qualityConfig, type Quality } from "./quality";
import type { Preferences } from "../lib/preferences";
export type SceneProject = { slug: string; shortTitle: string; preset: string };

type Props = {
  projects: SceneProject[];
  selectedSlug?: string;
  quality: Quality;
  preferences: Preferences;
  unfold: number;
  focus: string;
  onSelect: (s: string) => void;
  onFailure: () => void;
  onQuality: (q: Quality) => void;
};
const material = (
  color: string,
  metalness = 0,
  roughness = 0.38,
  wireframe = false,
) => ({ color, metalness, roughness, wireframe });
function Ring({
  radius = 1,
  color = c.signal,
  y = 0,
  tube = 0.024,
  tilt = 0,
}: {
  radius?: number;
  color?: string;
  y?: number;
  tube?: number;
  tilt?: number;
}) {
  return (
    <mesh rotation={[Math.PI / 2 + tilt, 0, 0]} position={[0, y, 0]}>
      <torusGeometry args={[radius, tube, 8, 72]} />
      <meshStandardMaterial {...material(color, 0.3, 0.25)} />
    </mesh>
  );
}
function Plinth({
  radius = 1.45,
  height = 0.24,
  wireframe = false,
}: {
  radius?: number;
  height?: number;
  wireframe?: boolean;
}) {
  return (
    <group>
      <mesh receiveShadow position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[radius, radius + 0.03, height, 64]} />
        <meshStandardMaterial {...material(c.ceramic, 0, 0.65, wireframe)} />
      </mesh>
      <mesh position={[0, -height - 0.045, 0]}>
        <cylinderGeometry args={[radius * 0.88, radius * 0.86, 0.085, 64]} />
        <meshStandardMaterial {...material(c.metal, 0.65, 0.32, wireframe)} />
      </mesh>
      <Ring radius={radius - 0.06} color={c.white} y={0.012} tube={0.012} />
    </group>
  );
}
function Seed({
  motion,
  unfold,
  blueprint,
  onSelect,
}: {
  motion: boolean;
  unfold: number;
  blueprint: boolean;
  onSelect: (s: string) => void;
}) {
  const rotor = useRef<THREE.Group>(null),
    petals = useRef<THREE.Group>(null),
    core = useRef<THREE.Mesh>(null);
  const expand = useRef({ value: 0 });
  useEffect(() => {
    const tween = gsap.to(expand.current, {
      value: unfold % 2 ? 1 : 0,
      duration: motion ? 1.15 : 0,
      ease: "power3.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [unfold, motion]);
  useFrame(({ clock }, delta) => {
    if (!rotor.current || !petals.current) return;
    if (motion) {
      rotor.current.rotation.y += Math.min(delta, 0.03) * 0.12;
      if (core.current)
        core.current.position.y =
          1.02 + Math.sin(clock.elapsedTime * 0.9) * 0.035;
    }
    petals.current.children.forEach((petal, i) => {
      const a = (i * Math.PI) / 4;
      petal.position.set(
        Math.sin(a) * (0.69 + expand.current.value * 0.45),
        0.53 + expand.current.value * 0.09,
        Math.cos(a) * (0.69 + expand.current.value * 0.45),
      );
      petal.rotation.x = expand.current.value * 0.12;
    });
  });
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect("Every system starts with a seed.");
    gsap.to(expand.current, {
      value: expand.current.value > 0.5 ? 0 : 1,
      duration: motion ? 0.85 : 0,
      ease: "back.out(1.2)",
    });
  };
  return (
    <group position={[0, -0.12, 0.2]} onClick={click}>
      <Plinth radius={1.58} wireframe={blueprint} />
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.53, 0.62, 0.32, 48]} />
        <meshStandardMaterial {...material(c.ink, 0.75, 0.2, blueprint)} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.56, 32]} />
        <meshStandardMaterial {...material(c.sky, 0.6, 0.15, blueprint)} />
      </mesh>
      <group ref={rotor}>
        <group ref={petals}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <group
                key={i}
                position={[Math.sin(a) * 0.69, 0.53, Math.cos(a) * 0.69]}
                rotation={[0, a, 0]}
              >
                <RoundedBox
                  args={[0.48, 0.19, 0.98]}
                  radius={0.12}
                  smoothness={3}
                  castShadow
                >
                  <meshStandardMaterial
                    {...material(
                      i % 3 === 0 ? c.white : c.ceramic,
                      0.08,
                      0.27,
                      blueprint,
                    )}
                  />
                </RoundedBox>
                <mesh position={[0, 0.102, 0.2]}>
                  <boxGeometry args={[0.06, 0.012, 0.36]} />
                  <meshStandardMaterial
                    color={i % 2 ? c.signal : c.coral}
                    emissive={i % 2 ? c.signal : c.coral}
                    emissiveIntensity={0.25}
                  />
                </mesh>
                <mesh position={[0, 0.15, 0.49]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
                  <meshStandardMaterial color={c.metal} />
                </mesh>
              </group>
            );
          })}
        </group>
        <Ring radius={1.04} color={c.metal} y={0.25} tube={0.012} />
      </group>
      <mesh ref={core} position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.49, 48, 32]} />
        <meshPhysicalMaterial
          color={c.signal}
          metalness={0.6}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.08}
          wireframe={blueprint}
        />
      </mesh>
      <group rotation={[0.32, 0, -0.35]} position={[0, 1.02, 0]}>
        <Ring radius={0.67} color={c.coral} tube={0.02} />
      </group>
      <Ring radius={0.53} color={c.sky} y={0.98} tube={0.012} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 1.38, 0.018, Math.cos(a) * 1.38]}
            rotation={[-Math.PI / 2, 0, -a]}
          >
            <planeGeometry args={[0.022, 0.085]} />
            <meshBasicMaterial color={c.metal} />
          </mesh>
        );
      })}
    </group>
  );
}
function Connector({
  project,
  motion,
  blueprint,
  onSelect,
}: {
  project?: SceneProject;
  motion: boolean;
  blueprint: boolean;
  onSelect: (s: string) => void;
}) {
  const rot = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (motion && rot.current)
      rot.current.rotation.y -= Math.min(delta, 0.03) * 0.23;
  });
  return (
    <group
      position={[-2.6, 0.06, -1.62]}
      rotation={[0, -0.2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onSelect(project?.shortTitle || "The connector system");
      }}
      onClick={(e) => {
        e.stopPropagation();
        window.location.assign(project ? `/work/${project.slug}` : "/work");
      }}
    >
      <Plinth radius={0.84} height={0.22} wireframe={blueprint} />
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.095, 0.12, 0.6, 16]} />
        <meshStandardMaterial color={c.metal} metalness={0.6} roughness={0.2} />
      </mesh>
      <group ref={rot} position={[0, 0.62, 0]}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <RoundedBox
              args={[0.36, 0.44, 0.36]}
              radius={0.055}
              position={[0.39, 0, 0]}
              castShadow
            >
              <meshStandardMaterial
                {...material(
                  i === 1 ? c.coral : c.ceramic,
                  0.15,
                  0.28,
                  blueprint,
                )}
              />
            </RoundedBox>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0.18, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.4, 12]} />
              <meshStandardMaterial color={c.ink} />
            </mesh>
            <mesh position={[0.39, 0.24, 0]}>
              <sphereGeometry args={[0.045, 12, 8]} />
              <meshStandardMaterial color={c.signal} />
            </mesh>
          </group>
        ))}
      </group>
      <Ring radius={0.65} color={c.coral} y={0.1} tube={0.019} />
    </group>
  );
}
function Mobile({
  project,
  blueprint,
  onSelect,
}: {
  project?: SceneProject;
  blueprint: boolean;
  onSelect: (s: string) => void;
}) {
  return (
    <group
      position={[2.3, -0.27, 1.17]}
      rotation={[0, -0.6, 0.08]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onSelect(project?.shortTitle || "The mobile system");
      }}
      onClick={(e) => {
        e.stopPropagation();
        window.location.assign(project ? `/work/${project.slug}` : "/work");
      }}
    >
      <Plinth radius={0.92} height={0.19} wireframe={blueprint} />
      {[0, 1, 2].map((i) => (
        <group
          key={i}
          position={[0, 0.27 + i * 0.16, 0]}
          rotation={[0.04, i * 0.13, 0]}
        >
          <RoundedBox args={[0.8, 0.1, 1.1]} radius={0.09} castShadow>
            <meshStandardMaterial
              {...material(i === 2 ? c.ink : c.ceramic, 0.25, 0.25, blueprint)}
            />
          </RoundedBox>
          {i === 2 && (
            <>
              <RoundedBox
                args={[0.68, 0.012, 0.88]}
                radius={0.06}
                position={[0, 0.057, 0]}
              >
                <meshStandardMaterial
                  color={c.sky}
                  metalness={0.2}
                  roughness={0.25}
                />
              </RoundedBox>
              <RoundedBox
                args={[0.47, 0.015, 0.24]}
                radius={0.035}
                position={[0, 0.067, 0.19]}
              >
                <meshStandardMaterial color={c.ceramic} />
              </RoundedBox>
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-0.13, 0.071, -0.18]}
              >
                <circleGeometry args={[0.11, 24]} />
                <meshStandardMaterial color={c.signal} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}
function Observatory({
  project,
  motion,
  blueprint,
  onSelect,
}: {
  project?: SceneProject;
  motion: boolean;
  blueprint: boolean;
  onSelect: (s: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (motion && group.current)
      group.current.rotation.y += Math.min(delta, 0.03) * 0.17;
  });
  return (
    <group
      position={[1.25, 0.27, -2.44]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onSelect(project?.shortTitle || "The discovery system");
      }}
      onClick={(e) => {
        e.stopPropagation();
        location.assign(project ? `/work/${project.slug}` : "/work");
      }}
    >
      <Plinth radius={0.75} height={0.18} wireframe={blueprint} />
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.35, 0.41, 0.32, 32]} />
        <meshStandardMaterial {...material(c.ceramic, 0.1, 0.35, blueprint)} />
      </mesh>
      <group ref={group} position={[0, 0.65, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.37, 32, 20]} />
          <meshPhysicalMaterial
            color={c.violet}
            metalness={0.35}
            roughness={0.15}
            transparent
            opacity={0.72}
            clearcoat={1}
            wireframe={blueprint}
          />
        </mesh>
        <group rotation={[0.5, 0, 0.4]}>
          <Ring radius={0.55} color={c.ink} tube={0.026} />
          <mesh position={[0.55, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 12]} />
            <meshStandardMaterial color={c.lime} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
function Cable({
  points,
  color = c.line,
}: {
  points: [number, number, number][];
  color?: string;
}) {
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        40,
        0.022,
        6,
        false,
      ),
    [points],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}
function Engine({
  project,
  motion,
  blueprint,
  onSelect,
}: {
  project?: SceneProject;
  motion: boolean;
  blueprint: boolean;
  onSelect: (s: string) => void;
}) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (motion && rotor.current)
      rotor.current.rotation.z += Math.min(delta, 0.03) * 0.4;
  });
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        onSelect(project?.shortTitle || "The build system");
      }}
      onClick={(e) => {
        e.stopPropagation();
        location.assign(project ? `/work/${project.slug}` : "/work");
      }}
    >
      <Plinth radius={1.08} height={0.22} wireframe={blueprint} />
      <RoundedBox args={[1.15, 0.3, 0.65]} radius={0.1} position={[0, 0.15, 0]}>
        <meshStandardMaterial {...material(c.ceramic, 0.2, 0.25, blueprint)} />
      </RoundedBox>
      <group position={[0, 0.78, 0]} rotation={[0.1, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.35, 48]} />
          <meshStandardMaterial {...material(c.ink, 0.5, 0.24, blueprint)} />
        </mesh>
        <group ref={rotor} position={[0, 0, 0.2]}>
          {Array.from({ length: 8 }, (_, i) => (
            <group rotation={[0, 0, (i * Math.PI) / 4]} key={i}>
              <RoundedBox
                args={[0.18, 0.38, 0.12]}
                radius={0.04}
                position={[0, 0.3, 0]}
              >
                <meshStandardMaterial
                  {...material(i % 2 ? c.sky : c.ceramic, 0.25, 0.2, blueprint)}
                />
              </RoundedBox>
            </group>
          ))}
          <mesh>
            <sphereGeometry args={[0.17, 24, 16]} />
            <meshStandardMaterial
              color={c.signal}
              metalness={0.65}
              roughness={0.1}
            />
          </mesh>
        </group>
        <mesh rotation={[0, 0, 0]} position={[0, 0, 0.31]}>
          <torusGeometry args={[0.57, 0.018, 8, 64]} />
          <meshStandardMaterial color={c.coral} />
        </mesh>
      </group>
    </group>
  );
}
const cables: [number, number, number][][] = [
  [
    [-2.6, -0.17, -1.62],
    [-2.5, -0.65, -0.1],
    [-1.6, -0.62, 0.4],
    [-0.8, -0.23, 0.4],
  ],
  [
    [1.25, 0.08, -2.44],
    [2, -0.42, -2],
    [1.2, -0.55, -1],
    [0.4, -0.28, -0.5],
  ],
  [
    [1, -0.35, 0.2],
    [2, -0.7, -0.15],
    [2.8, -0.6, 0.2],
    [2.3, -0.4, 1.17],
  ],
];
function Dust({ count, motion }: { count: number; motion: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const obj = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    for (let i = 0; i < count; i++) {
      const angle = i * 2.399963;
      const radius = 1.9 + (i % 4) * 0.5;
      obj.position.set(
        Math.cos(angle + (motion ? clock.elapsedTime * 0.015 : 0)) * radius,
        -0.4 +
          (i % 6) * 0.31 +
          (motion ? Math.sin(clock.elapsedTime * 0.5 + i) * 0.045 : 0),
        Math.sin(angle) * radius,
      );
      obj.scale.setScalar(0.014 + (i % 3) * 0.008);
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color={c.signal} roughness={0.4} />
    </instancedMesh>
  );
}
function Scene({
  projects,
  selectedSlug,
  quality,
  preferences,
  unfold,
  focus,
  onSelect,
  onFailure,
  onQuality,
}: Props) {
  const projectFor = (preset: string) =>
    projects.find(
      (project) => project.preset === preset && project.slug === selectedSlug,
    ) || projects.find((project) => project.preset === preset);
  const root = useRef<THREE.Group>(null);
  const { gl, camera, size, invalidate, setDpr } = useThree();
  const [active, setActive] = useState(true);
  const motion = preferences.motion && active;
  const samples = useRef({ total: 0, frames: 0, done: false });
  const cfg = qualityConfig[quality];
  useEffect(() => {
    const canvas = gl.domElement;
    const loss = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", loss);
    let visible = true,
      labActive = false;
    const visibility = () =>
      setActive(visible && !document.hidden && !labActive);
    const lab = (event: Event) => {
      labActive = (event as CustomEvent<boolean>).detail;
      visibility();
    };
    window.addEventListener("garden:lab-active", lab);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        visibility();
      },
      { rootMargin: "120px" },
    );
    observer.observe(canvas);
    return () => {
      canvas.removeEventListener("webglcontextlost", loss);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("garden:lab-active", lab);
      observer.disconnect();
    };
  }, [gl, onFailure]);
  useEffect(() => {
    setDpr(Math.min(devicePixelRatio, cfg.dpr));
  }, [cfg.dpr, setDpr]);
  useEffect(() => {
    const mobile = innerWidth < 761;
    camera.position.set(
      mobile ? 6.8 : 7.8,
      mobile ? 5.8 : 6.5,
      mobile ? 8.8 : 10,
    );
    camera.lookAt(0, 0.1, -0.1);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = focus === "all" ? (mobile ? 35 : 27) : 22;
      camera.updateProjectionMatrix();
    }
    invalidate();
  }, [size.width, camera, invalidate, focus]);
  useEffect(() => {
    if (!root.current) return;
    root.current.scale.setScalar(focus === "all" ? 1 : 1.8);
    const tween = gsap.fromTo(
      root.current.position,
      { y: preferences.motion ? -0.5 : -0.05 },
      {
        y: -0.05,
        duration: preferences.motion ? 0.8 : 0,
        ease: "power3.out",
        onUpdate: invalidate,
      },
    );
    return () => {
      tween.kill();
    };
  }, [focus, preferences.motion, invalidate]);
  useEffect(() => {
    invalidate();
    const timer = setTimeout(() => invalidate(), 1200);
    return () => clearTimeout(timer);
  }, [preferences, unfold, invalidate]);
  useFrame(({ clock, pointer }, delta) => {
    if (motion) {
      invalidate();
      if (root.current) {
        root.current.rotation.y = THREE.MathUtils.damp(
          root.current.rotation.y,
          pointer.x * 0.09,
          3,
          delta,
        );
        root.current.rotation.x = THREE.MathUtils.damp(
          root.current.rotation.x,
          pointer.y * 0.035,
          3,
          delta,
        );
      }
    }
    if (
      clock.elapsedTime > 3 &&
      !samples.current.done &&
      active &&
      preferences.motion
    ) {
      samples.current.total += Math.min(delta, 0.1);
      samples.current.frames++;
      if (samples.current.frames >= 120) {
        samples.current.done = true;
        if (samples.current.total / 120 > 0.034 && quality !== "LOW")
          onQuality("LOW");
      }
    }
    if (import.meta.env.DEV && samples.current.frames % 30 === 0) {
      const element = document.querySelector<HTMLElement>(".world-stage");
      if (element) {
        element.dataset.drawCalls = String(gl.info.render.calls);
        element.dataset.triangles = String(gl.info.render.triangles);
        element.dataset.renderActive = String(active);
      }
    }
  });
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-4, 8, 5]} intensity={3.3} color="#fff9ed" />
      <directionalLight position={[5, 3, -5]} intensity={1.8} color={c.sky} />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={3} position={[-5, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={2} position={[5, 3, 5]} scale={[8, 4, 1]} />
        <Lightformer
          intensity={1.5}
          color={c.sky}
          position={[0, 2, -5]}
          scale={[6, 4, 1]}
        />
      </Environment>
      <group ref={root} position={[0, -0.05, 0]}>
        {focus === "garden" && (
          <Seed
            motion={motion}
            unfold={unfold}
            blueprint={preferences.blueprint}
            onSelect={onSelect}
          />
        )}
        {focus === "connector" && (
          <group position={[2.6, -0.06, 1.62]}>
            <Connector
              project={projectFor("connector")}
              motion={motion}
              blueprint={preferences.blueprint}
              onSelect={onSelect}
            />
          </group>
        )}
        {focus === "discovery" && (
          <group position={[-1.25, -0.27, 2.44]}>
            <Observatory
              project={projectFor("discovery")}
              motion={motion}
              blueprint={preferences.blueprint}
              onSelect={onSelect}
            />
          </group>
        )}
        {focus === "mobile" && (
          <group position={[-2.3, 0.27, -1.17]}>
            <Mobile
              project={projectFor("mobile")}
              blueprint={preferences.blueprint}
              onSelect={onSelect}
            />
          </group>
        )}
        {focus === "engine" && (
          <Engine
            project={projectFor("engine")}
            motion={motion}
            blueprint={preferences.blueprint}
            onSelect={onSelect}
          />
        )}
        {focus === "all" && (
          <>
            <Seed
              motion={motion}
              unfold={unfold}
              blueprint={preferences.blueprint}
              onSelect={onSelect}
            />
            <Connector
              project={projectFor("connector")}
              motion={motion}
              blueprint={preferences.blueprint}
              onSelect={onSelect}
            />
            <Mobile
              project={projectFor("mobile")}
              blueprint={preferences.blueprint}
              onSelect={onSelect}
            />
            <Observatory
              project={projectFor("discovery")}
              motion={motion}
              blueprint={preferences.blueprint}
              onSelect={onSelect}
            />
            {cables.map((points, i) => (
              <Cable
                points={points}
                color={i === 1 ? c.coral : c.line}
                key={i}
              />
            ))}
            <Dust count={cfg.particles} motion={motion} />
            <group position={[-1.8, -0.46, 1.63]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.31, 0.34, 40]} />
                <meshStandardMaterial color={c.metal} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0, 0.07, 0]}>
                <sphereGeometry args={[0.12, 24, 16]} />
                <meshStandardMaterial
                  color={c.coral}
                  metalness={0.3}
                  roughness={0.2}
                />
              </mesh>
            </group>
            <group position={[0.1, -0.4, 2.27]} rotation={[0, 0.4, 0]}>
              <RoundedBox args={[0.46, 0.11, 0.25]} radius={0.04}>
                <meshStandardMaterial color={c.lime} roughness={0.35} />
              </RoundedBox>
              <mesh position={[0, 0.065, 0]}>
                <boxGeometry args={[0.19, 0.01, 0.025]} />
                <meshStandardMaterial color={c.ink} />
              </mesh>
            </group>
          </>
        )}
      </group>
      {cfg.shadows && (
        <ContactShadows
          position={[0, -0.86, 0]}
          opacity={0.3}
          scale={12}
          blur={2.5}
          far={5}
          resolution={256}
          frames={1}
          color={c.ink}
        />
      )}
    </>
  );
}
export default function World(props: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, qualityConfig[props.quality].dpr]}
      camera={{ position: [7.8, 6.5, 10], fov: 32, near: 0.1, far: 60 }}
      gl={{
        antialias: props.quality !== "LOW",
        alpha: true,
        powerPreference: "low-power",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
