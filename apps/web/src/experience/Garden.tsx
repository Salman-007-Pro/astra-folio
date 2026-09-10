import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { readPreferences, type Preferences } from "../lib/preferences";
import { classifyQuality, type Quality } from "./quality";
const World = lazy(() => import("./World"));
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
export default function Garden() {
  const [ready, setReady] = useState(false);
  const [quality, setQuality] = useState<Quality>("MEDIUM");
  const [preferences, setPreferences] = useState<Preferences>({
    motion: false,
    sound: false,
    night: false,
    blueprint: false,
  });
  const [selected, setSelected] = useState("The signal seed");
  const [unfold, setUnfold] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState("all");
  const machine = useRef("connector");
  useEffect(() => {
    setPreferences(readPreferences());
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const test = document.createElement("canvas");
    let supported = false;
    try {
      const context = test.getContext("webgl2");
      supported = !!context;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {}
    if (new URLSearchParams(location.search).get("webgl") === "off")
      supported = false;
    setQuality(
      classifyQuality({
        width: innerWidth,
        cores: nav.hardwareConcurrency,
        memory: nav.deviceMemory,
        saveData: nav.connection?.saveData,
        webgl: supported,
      }),
    );
    const timer = window.setTimeout(() => setReady(true), 150);
    const listener = (e: Event) =>
      setPreferences((e as CustomEvent<Preferences>).detail);
    window.addEventListener("garden:preferences", listener);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("garden:preferences", listener);
    };
  }, []);
  useEffect(() => {
    const mount = document.querySelector<HTMLElement>("[data-world-mount]");
    const heroMount = document.querySelector<HTMLElement>(
      "[data-hero-world-mount]",
    );
    let scheduled = false;
    const update = () => {
      scheduled = false;
      if (
        !stage.current ||
        document.documentElement.classList.contains("dialog-open")
      )
        return;
      const work =
        !!mount &&
        innerWidth > 760 &&
        mount.getBoundingClientRect().top < innerHeight * 0.72;
      const destination = innerWidth <= 760 ? heroMount : work ? mount : null;
      stage.current.dataset.chapter = work ? "WORK" : "HERO";
      if (destination) {
        const rect = destination.getBoundingClientRect();
        Object.assign(stage.current.style, {
          top: `${rect.top + scrollY}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          right: "auto",
          minHeight: "0",
        });
        setFocus(work ? machine.current : "all");
      } else {
        stage.current.removeAttribute("style");
        setFocus("all");
      }
    };
    const scroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };
    const select = (event: Event) => {
      const detail = (event as CustomEvent<{ preset: string; title: string }>)
        .detail;
      machine.current = detail.preset;
      setSelected(detail.title);
      update();
    };
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", scroll);
    addEventListener("garden:machine", select);
    const resizeObserver = new ResizeObserver(scroll);
    for (const element of [
      mount,
      heroMount,
      document.querySelector(".hero-copy"),
    ]) {
      if (element) resizeObserver.observe(element);
    }
    void document.fonts.ready.then(scroll);
    update();
    return () => {
      removeEventListener("scroll", scroll);
      removeEventListener("resize", scroll);
      removeEventListener("garden:machine", select);
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div
      ref={stage}
      className="world-stage"
      data-quality={quality}
      data-chapter="HERO"
      aria-label="An interactive kinetic garden. All projects are also available in the selected work section."
    >
      <div className="scene-caption">
        <span>✳</span> THE KINETIC GARDEN <span>01—06</span>
      </div>
      {quality === "FALLBACK" ? (
        <div className="scene-fallback">
          <div>
            <div className="seed-symbol" aria-hidden="true">
              ✳
            </div>
            <p>A quieter kind of garden. All the work, ready to explore.</p>
            <a className="text-link" href="/reading">
              Open recruiter view →
            </a>
          </div>
        </div>
      ) : (
        ready && (
          <SceneBoundary onFailure={() => setQuality("FALLBACK")}>
            <Suspense fallback={null}>
              <World
                quality={quality}
                preferences={preferences}
                unfold={unfold}
                focus={focus}
                onSelect={setSelected}
                onFailure={() => setQuality("FALLBACK")}
                onQuality={setQuality}
              />
            </Suspense>
          </SceneBoundary>
        )
      )}
      {quality !== "FALLBACK" && (
        <div className="scene-label" aria-live="polite">
          <strong>{selected}</strong>
          <span>
            {preferences.blueprint
              ? "SYSTEM BLUEPRINT / LIVE"
              : "SMALL PARTS. CONNECTED POSSIBILITIES."}
          </span>
        </div>
      )}
      {quality !== "FALLBACK" && (
        <div className="scene-controls">
          <span>
            {preferences.motion
              ? "A living system. Go on, touch it."
              : "A still moment in the garden."}
          </span>
          <button
            disabled={!ready}
            onClick={() => {
              setUnfold((x) => x + 1);
              setSelected(
                unfold > 3
                  ? "Curiosity is a feature."
                  : "A little room to grow.",
              );
            }}
            aria-label="Unfold the signal seed"
          >
            {unfold % 2 ? "↙ Reassemble" : "↗ Unfold the seed"}
          </button>
        </div>
      )}
    </div>
  );
}
