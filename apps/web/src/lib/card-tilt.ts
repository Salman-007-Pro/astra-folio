export type TiltBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type Tilt = {
  rx: number;
  ry: number;
  nx: number;
  ny: number;
  px: number;
  py: number;
};

const WRITING_CARD_STYLES = new Set([
  "cartoon",
  "clay",
  "glass",
  "neumorphism",
  "holographic",
  "paper",
  "doodle",
]);
const EXPERIENCE_CARD_STYLES = new Set(["cyberpunk", "pixel"]);
export const TILT_FOLLOW_TAU = 0.16;
export const TILT_SETTLE_TAU = 0.28;
const REST: Tilt = { rx: 0, ry: 0, nx: 0, ny: 0, px: 50, py: 50 };

type Track = {
  el: HTMLElement;
  current: Tilt;
  target: Tilt;
  leaving: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

export function tiltFromPointer(
  clientX: number,
  clientY: number,
  rect: TiltBox,
  maxDeg: number,
): Tilt {
  const halfW = rect.width / 2 || 1;
  const halfH = rect.height / 2 || 1;
  const nx = clamp((clientX - (rect.left + halfW)) / halfW, -1, 1) || 0;
  const ny = clamp((clientY - (rect.top + halfH)) / halfH, -1, 1) || 0;
  return {
    nx,
    ny,
    rx: -ny * maxDeg || 0,
    ry: nx * maxDeg || 0,
    px: (nx + 1) * 50,
    py: (ny + 1) * 50,
  };
}

export function lerpTilt(current: Tilt, target: Tilt, amount: number): Tilt {
  const t = clamp(amount, 0, 1);
  return {
    rx: mix(current.rx, target.rx, t),
    ry: mix(current.ry, target.ry, t),
    nx: mix(current.nx, target.nx, t),
    ny: mix(current.ny, target.ny, t),
    px: mix(current.px, target.px, t),
    py: mix(current.py, target.py, t),
  };
}

export function tiltStep(dtSeconds: number, tau: number): number {
  if (dtSeconds <= 0) return 0;
  return 1 - Math.exp(-dtSeconds / Math.max(tau, 0.001));
}

function settled(tilt: Tilt) {
  return Math.abs(tilt.rx) < 0.04 && Math.abs(tilt.ry) < 0.04;
}

function closeTo(current: Tilt, target: Tilt) {
  return (
    Math.abs(current.rx - target.rx) < 0.04 &&
    Math.abs(current.ry - target.ry) < 0.04
  );
}

function allowed() {
  return (
    document.documentElement.dataset.motion !== "off" &&
    !document.hidden &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function maxDeg(element: HTMLElement) {
  const value = Number(element.dataset.tiltMax);
  return Number.isFinite(value) && value > 0 ? value : 6;
}

function isTiltSurface(element: HTMLElement) {
  const style = document.documentElement.dataset.style || "default";
  if (element.matches(".writing-item")) return WRITING_CARD_STYLES.has(style);
  if (element.matches(".experience-list details"))
    return EXPERIENCE_CARD_STYLES.has(style);
  return true;
}

function applyTilt(element: HTMLElement, tilt: Tilt) {
  element.style.setProperty("--tilt-rx", `${tilt.rx}deg`);
  element.style.setProperty("--tilt-ry", `${tilt.ry}deg`);
  element.style.setProperty("--tilt-nx", String(tilt.nx));
  element.style.setProperty("--tilt-ny", String(tilt.ny));
  element.style.setProperty("--tilt-px", `${tilt.px}%`);
  element.style.setProperty("--tilt-py", `${tilt.py}%`);
}

export function initCardTilt() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  const tracks = new Map<HTMLElement, Track>();
  let frame = 0;
  let last = 0;

  const stopLoop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  };

  const drop = (track: Track) => {
    track.el.classList.remove("is-tilting", "is-tilt-settling");
    applyTilt(track.el, REST);
    tracks.delete(track.el);
  };

  const tick = (now: number) => {
    frame = 0;
    const dt = last ? Math.min(0.032, (now - last) / 1000) : 1 / 60;
    last = now;
    let alive = false;
    for (const track of [...tracks.values()]) {
      const tau = track.leaving ? TILT_SETTLE_TAU : TILT_FOLLOW_TAU;
      track.current = lerpTilt(track.current, track.target, tiltStep(dt, tau));
      applyTilt(track.el, track.current);
      if (track.leaving && settled(track.current)) {
        drop(track);
        continue;
      }
      if (!track.leaving && closeTo(track.current, track.target)) {
        track.current = { ...track.target };
        applyTilt(track.el, track.current);
        continue;
      }
      alive = true;
    }
    if (alive) frame = requestAnimationFrame(tick);
    else last = 0;
  };

  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const follow = (element: HTMLElement, next: Tilt) => {
    let track = tracks.get(element);
    if (!track) {
      track = {
        el: element,
        current: { ...REST },
        target: next,
        leaving: false,
      };
      tracks.set(element, track);
    }
    track.target = next;
    track.leaving = false;
    element.classList.add("is-tilting");
    element.classList.remove("is-tilt-settling");
    for (const other of tracks.values()) {
      if (other.el === element || other.leaving) continue;
      other.leaving = true;
      other.target = { ...REST };
      other.el.classList.remove("is-tilting");
      other.el.classList.add("is-tilt-settling");
    }
    start();
  };

  const halt = () => {
    stopLoop();
    for (const track of [...tracks.values()]) drop(track);
  };

  const beginLeave = () => {
    let any = false;
    for (const track of tracks.values()) {
      if (track.leaving) continue;
      track.leaving = true;
      track.target = { ...REST };
      track.el.classList.remove("is-tilting");
      track.el.classList.add("is-tilt-settling");
      any = true;
    }
    if (any) start();
  };

  const paint = (event: PointerEvent) => {
    if (!allowed()) {
      halt();
      return;
    }
    const node = (event.target as Element | null)?.closest?.("[data-tilt]");
    const next =
      node instanceof HTMLElement && isTiltSurface(node) ? node : null;
    if (!next) {
      beginLeave();
      return;
    }
    follow(
      next,
      tiltFromPointer(
        event.clientX,
        event.clientY,
        next.getBoundingClientRect(),
        maxDeg(next),
      ),
    );
  };

  document.addEventListener("pointermove", paint, { passive: true });
  document.addEventListener("pointerleave", beginLeave);
  window.addEventListener("garden:preferences", halt);
  document.addEventListener("visibilitychange", halt);
  reduced.addEventListener("change", halt);
  pointer.addEventListener("change", halt);
}
