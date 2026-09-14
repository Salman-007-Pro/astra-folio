import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TechLabSettings, Project } from "@garden/content-schema";
import { readPreferences, writePreferences } from "../lib/preferences";
import { initialOptions, initialState, runDemo } from "./model";
import {
  sceneFamilies,
  sceneLabels,
  type LabShape,
  type LabFinish,
} from "./scene-presets";
import LabDiagram from "./LabDiagram";
const LabScene = lazy(() => import("./LabScene"));
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function EngineeringLab({
  settings,
  projects,
}: {
  settings: TechLabSettings;
  projects: Project[];
}) {
  const [view, setView] = useState<"tech" | "systems">("tech");
  const [tech, setTech] = useState(
    settings.technologies.find((t) => t.id === "css")?.id ||
      settings.technologies[0].id,
  );
  const [scenario, setScenario] = useState(settings.scenarios[0].id);
  const [shape, setShape] = useState<LabShape>("knot");
  const [finish, setFinish] = useState<LabFinish>("ceramic");
  const [angle, setAngle] = useState(0);
  const [state, setState] = useState(initialState),
    [options, setOptions] = useState(initialOptions);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false),
    [motion, setMotion] = useState(false),
    [webgl, setWebgl] = useState(false),
    [color, setColor] = useState("#58715a");
  const root = useRef<HTMLDivElement>(null);
  const technology = settings.technologies.find((t) => t.id === tech)!;
  const system = settings.scenarios.find((s) => s.id === scenario)!;
  const preset = view === "tech" ? technology.preset : system.preset;
  const title = view === "tech" ? technology.name : system.title;
  const categories = [...new Set(settings.technologies.map((t) => t.category))];
  useEffect(() => {
    setReady(true);
    let visible = false;
    const sync = () => {
      const running =
        visible &&
        !document.hidden &&
        !document.documentElement.classList.contains("dialog-open");
      setActive(running);
      setMotion(readPreferences().motion);
      setColor(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent-signal")
          .trim() || "#58715a",
      );
      window.dispatchEvent(
        new CustomEvent("garden:lab-active", { detail: running }),
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    if (root.current) observer.observe(root.current);
    const mutations = new MutationObserver(sync);
    mutations.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-style"],
    });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("garden:preferences", sync);
    sync();
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      setWebgl(
        !!context &&
          new URLSearchParams(location.search).get("webgl") !== "off",
      );
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setWebgl(false);
    }
    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("garden:preferences", sync);
      window.dispatchEvent(
        new CustomEvent("garden:lab-active", { detail: false }),
      );
    };
  }, []);
  const reset = () => {
    setShape("knot");
    setFinish("ceramic");
    setAngle(0);
    setState(initialState);
    setOptions(initialOptions);
  };
  const select = (id: string) => {
    view === "tech" ? setTech(id) : setScenario(id);
    reset();
  };
  const checkbox = (
    key: "fail" | "requestFail" | "indexed" | "document" | "offline",
    label: string,
  ) => (
    <label className="lab-check">
      <input
        type="checkbox"
        checked={options[key]}
        onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
      />
      {label}
    </label>
  );
  return (
    <div className="engineering-lab" ref={root} data-lab-active={active}>
      <fieldset
        className="lab-fieldset"
        disabled={!ready}
        aria-label="Engineering lab controls"
      >
        <div
          className="lab-tabs"
          role="group"
          aria-label="Engineering lab views"
        >
          {(["tech", "systems"] as const).map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => {
                setView(v);
                reset();
              }}
            >
              {v === "tech" ? "Tech Stack" : "System Design"}
              <span>{v === "tech" ? settings.technologies.length : "06"}</span>
            </button>
          ))}
        </div>
        <div className="lab-layout">
          <nav
            className="lab-selector"
            aria-label={
              view === "tech" ? "Technologies" : "Architecture scenarios"
            }
          >
            {view === "tech" ? (
              categories.map((category) => (
                <div className="lab-category" key={category}>
                  <h3>{category}</h3>
                  <div>
                    {settings.technologies
                      .filter((t) => t.category === category)
                      .map((t) => (
                        <button
                          key={t.id}
                          aria-pressed={tech === t.id}
                          onClick={() => select(t.id)}
                        >
                          {t.name}
                        </button>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <>
                <p className="lab-system-intro">{settings.systemTitle}</p>
                {settings.scenarios.map((s, i) => (
                  <button
                    className="lab-scenario"
                    key={s.id}
                    aria-pressed={scenario === s.id}
                    onClick={() => select(s.id)}
                  >
                    <span>0{i + 1}</span>
                    {s.title}
                  </button>
                ))}
              </>
            )}
          </nav>
          <div className="lab-workbench">
            <div className="lab-heading">
              <span className="eyebrow">
                {view === "tech"
                  ? technology.category
                  : "ARCHITECTURE IN PRACTICE"}
              </span>
              <span className="lab-simulation">Interactive simulation</span>
            </div>
            <h3 className="lab-title">{title}</h3>
            <p>
              {view === "tech" ? technology.description : system.explanation}
            </p>
            <div
              className="lab-stage"
              data-preset={preset}
              data-scene={sceneFamilies[preset]}
              data-running={active && motion && !paused}
            >
              <div className="lab-scene-toolbar">
                <div className="lab-scene-title">
                  {sceneLabels[sceneFamilies[preset]]}
                </div>
                <button
                  className="lab-motion"
                  onClick={() => {
                    if (!motion) {
                      writePreferences({ ...readPreferences(), motion: true });
                      setPaused(false);
                    } else setPaused(!paused);
                  }}
                  aria-label={
                    motion && !paused
                      ? "Pause lab animation"
                      : "Play lab animation"
                  }
                >
                  <span className="lab-live-dot" aria-hidden="true" />
                  {motion && !paused ? "Pause animation" : "Play animation"}
                </button>
              </div>
              <div className="lab-spatial" aria-hidden="true">
                {active && webgl ? (
                  <SceneBoundary onFailure={() => setWebgl(false)}>
                    <Suspense fallback={<span className="lab-orbit">✳</span>}>
                      <LabScene
                        preset={preset}
                        state={state}
                        options={options}
                        motion={motion && !paused}
                        color={color}
                        shape={shape}
                        finish={finish}
                        angle={angle}
                        onFailure={() => setWebgl(false)}
                      />
                    </Suspense>
                  </SceneBoundary>
                ) : (
                  <LabDiagram
                    preset={preset}
                    state={state}
                    options={options}
                    shape={shape}
                  />
                )}
              </div>
              {preset === "layout" ? (
                <div
                  className="lab-css-preview"
                  style={{
                    display: options.layout === "grid" ? "grid" : "flex",
                    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                    flexDirection: "column",
                    gap: options.gap,
                  }}
                >
                  <div>Structure</div>
                  <div>Style</div>
                  <div>Meaning</div>
                </div>
              ) : preset === "mobile" ? (
                <div className="lab-phone">
                  <span>09:41</span>
                  <strong>
                    {state.count % 2 ? "Shipment #42" : "Your shipments"}
                  </strong>
                  <button
                    onClick={() => setState((s) => runDemo(preset, s, options))}
                  >
                    {state.count % 2 ? "← Back" : "Open shipment →"}
                  </button>
                </div>
              ) : (
                <div
                  className="lab-flow"
                  key={`${title}-${state.count}`}
                  aria-label="Current flow"
                >
                  {state.nodes.map((node, i) => (
                    <div
                      className="lab-node"
                      key={`${i}-${node}`}
                      style={{ animationDelay: `${i * 110}ms` }}
                    >
                      <span>0{i + 1}</span>
                      <strong>{node}</strong>
                      {i < state.nodes.length - 1 && (
                        <i aria-hidden="true">→</i>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="lab-stage-foot">
                <span>{webgl ? "SPATIAL VIEW" : "DIAGRAM VIEW"}</span>
                <span>{state.count.toString().padStart(2, "0")} RUNS</span>
              </div>
            </div>
            <div className="lab-controls">
              {preset === "mesh" && (
                <>
                  <label>
                    Geometry
                    <select
                      aria-label="Geometry"
                      value={shape}
                      onChange={(e) => setShape(e.target.value as LabShape)}
                    >
                      <option value="knot">Torus knot</option>
                      <option value="sphere">Sphere</option>
                      <option value="torus">Torus</option>
                      <option value="crystal">Crystal</option>
                    </select>
                  </label>
                  <label>
                    Material
                    <select
                      aria-label="Material"
                      value={finish}
                      onChange={(e) => setFinish(e.target.value as LabFinish)}
                    >
                      <option value="ceramic">Ceramic</option>
                      <option value="metal">Metal</option>
                      <option value="wireframe">Wireframe</option>
                    </select>
                  </label>
                  <label>
                    Rotation: {angle}°
                    <input
                      aria-label="Mesh rotation"
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                    />
                  </label>
                </>
              )}
              {preset === "layout" && (
                <>
                  <label>
                    Layout
                    <select
                      aria-label="Layout"
                      value={options.layout}
                      onChange={(e) =>
                        setOptions({ ...options, layout: e.target.value })
                      }
                    >
                      <option value="grid">Grid</option>
                      <option value="flex">Flex column</option>
                    </select>
                  </label>
                  <label>
                    Spacing: {options.gap}px
                    <input
                      type="range"
                      min="4"
                      max="24"
                      value={options.gap}
                      onChange={(e) =>
                        setOptions({ ...options, gap: Number(e.target.value) })
                      }
                    />
                  </label>
                </>
              )}
              {preset === "routing" && (
                <>
                  <label>
                    Replicas
                    <select
                      aria-label="Replicas"
                      value={options.replicas}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          replicas: Number(e.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  {checkbox("offline", "Take replica 1 offline")}
                </>
              )}
              {(preset === "query" || preset === "document") && (
                <>
                  {checkbox("indexed", "Use an index")}
                  {view === "systems" && checkbox("document", "Document model")}
                </>
              )}
              {preset === "auth" && (
                <label>
                  Caller role
                  <select
                    aria-label="Caller role"
                    value={options.role}
                    onChange={(e) =>
                      setOptions({ ...options, role: e.target.value })
                    }
                  >
                    {["guest", "member", "admin"].map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </label>
              )}
              {[
                "request",
                "middleware",
                "contract",
                "jobs",
                "pipeline",
                "test",
                "browser",
                "wallet",
              ].includes(preset) &&
                checkbox(
                  "fail",
                  preset === "wallet"
                    ? "Reject approval"
                    : preset === "contract"
                      ? "Invalid input"
                      : preset === "pipeline"
                        ? "Fail a test"
                        : "Simulate failure",
                )}
              {preset === "pipeline" &&
                checkbox("requestFail", "Fail a request after deployment")}
              {preset === "cache" && (
                <button
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      cached: false,
                      message:
                        "Cache invalidated. The next read goes to the database.",
                    }))
                  }
                >
                  Expire / invalidate
                </button>
              )}
            </div>
            <div className="lab-actions">
              <button
                className="lab-run"
                onClick={() => setState((s) => runDemo(preset, s, options))}
              >
                {preset === "wallet"
                  ? "Next transaction step"
                  : preset === "jobs"
                    ? "Run / retry same key"
                    : "Run example"}{" "}
                <span aria-hidden="true">↗</span>
              </button>
              <button onClick={reset}>Reset</button>
            </div>
            <p className="lab-result" data-error={state.error} role="status">
              {state.message}
            </p>
            {view === "systems" ? (
              <div className="lab-explanation">
                <div>
                  <h4>What happens</h4>
                  <p>{system.explanation}</p>
                </div>
                <div>
                  <h4>Why it matters</h4>
                  <p>{system.why}</p>
                </div>
                <div>
                  <h4>Trade-off</h4>
                  <p>{system.tradeoff}</p>
                </div>
              </div>
            ) : (
              <details className="lab-code" open>
                <summary>Small example · {title}</summary>
                <pre>
                  <code>{technology.code}</code>
                </pre>
              </details>
            )}
            {state.trace.length > 0 && (
              <details className="lab-code">
                <summary>Inspect log & trace</summary>
                <pre>{state.trace.join("\n")}</pre>
              </details>
            )}
            {view === "tech" && technology.projects.length > 0 && (
              <div className="lab-evidence">
                <span className="eyebrow">CONNECTED TO REAL WORK</span>
                {projects
                  .filter((p) => technology.projects.includes(p.slug))
                  .map((p) => (
                    <a key={p.slug} href={`/work/${p.slug}`}>
                      {p.shortTitle} ↗
                    </a>
                  ))}
              </div>
            )}
            <p className="lab-note">
              A small illustration of the idea. No live infrastructure, wallet
              or customer data.
            </p>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
