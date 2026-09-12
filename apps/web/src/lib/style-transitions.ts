export const styleTransitions = [
  {
    id: "pixels",
    name: "Pixel Flip",
    description: "Ten tiles across. A ripple of flips.",
  },
  {
    id: "shutters",
    name: "Shutter Sweep",
    description: "Alternating strips sweep across",
  },
  {
    id: "slices",
    name: "Diagonal Slice",
    description: "Slanted panels cut to the next scene",
  },
  {
    id: "mosaic",
    name: "Mosaic Bloom",
    description: "A mosaic expands from the centre",
  },
  {
    id: "blinds",
    name: "3D Blinds",
    description: "Tall louvers turn in sequence",
  },
] as const;
export type StyleTransition = (typeof styleTransitions)[number]["id"];
export const isStyleTransition = (value: unknown): value is StyleTransition =>
  styleTransitions.some((effect) => effect.id === value);

let cancelActive = () => {};
let generation = 0;

export function transitionStyle(
  update: () => void,
  effect: StyleTransition = "pixels",
) {
  cancelActive();
  const current = ++generation;
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let applied = false;
  const apply = () => {
    if (applied || current !== generation) return;
    applied = true;
    update();
  };
  if (root.dataset.motion === "off" || reduced.matches || document.hidden) {
    apply();
    return;
  }
  const animations: Animation[] = [];
  let overlay: HTMLElement | undefined;
  const cleanup = () => {
    animations.forEach((animation) => animation.cancel());
    overlay?.remove();
    window.removeEventListener("resize", cancel);
    window.removeEventListener("garden:preferences", preferencesChanged);
    document.removeEventListener("visibilitychange", cancel);
    reduced.removeEventListener("change", cancel);
    if (current === generation) {
      delete root.dataset.transitionRunning;
      cancelActive = () => {};
    }
  };
  const cancel = () => {
    apply();
    cleanup();
  };
  const preferencesChanged = () => {
    if (root.dataset.motion === "off") cancel();
  };
  cancelActive = cancel;
  root.dataset.transitionRunning = effect;
  window.addEventListener("resize", cancel);
  window.addEventListener("garden:preferences", preferencesChanged);
  document.addEventListener("visibilitychange", cancel);
  reduced.addEventListener("change", cancel);

  overlay = document.createElement("div");
  overlay.className = "style-effect-overlay";
  if (effect === "pixels") overlay.classList.add("style-pixel-overlay");
  overlay.dataset.effect = effect;
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("popover", "manual");
  // A popover paints above the settings dialog without moving keyboard focus.
  document.body.append(overlay);
  if (typeof overlay.showPopover === "function") overlay.showPopover();
  else
    (document.querySelector("dialog[open]") || document.body).append(overlay);
  const columns = effect === "mosaic" ? 8 : 10;
  const size = innerWidth / columns;
  const rows = Math.ceil(innerHeight / size);
  overlay.style.setProperty("--tile-size", `${size}px`);
  const count =
    effect === "pixels" || effect === "mosaic"
      ? rows * columns
      : effect === "shutters"
        ? 8
        : effect === "slices"
          ? 6
          : 10;
  const tiles = Array.from({ length: count }, (_, index) => {
    const tile = document.createElement("span");
    tile.style.setProperty("--tile-tone", `${(index % 10) * 2 + 82}%`);
    overlay?.append(tile);
    return tile;
  });
  const animateTiles = (reveal: boolean) =>
    tiles.map((tile, index) => {
      let delay = 0;
      let hidden: Keyframe;
      let covered: Keyframe = { transform: "none", opacity: 1 };
      let outgoing: Keyframe;
      if (effect === "pixels") {
        delay = (((index % 10) + Math.floor(index / 10)) / (rows + 8)) * 220;
        hidden = { transform: "perspective(500px) rotateY(90deg)", opacity: 0 };
        covered = { transform: "perspective(500px) rotateY(0deg)", opacity: 1 };
        outgoing = {
          transform: "perspective(500px) rotateY(-90deg)",
          opacity: 0,
        };
      } else if (effect === "shutters") {
        delay = index * 35;
        hidden = { transform: `translateX(${index % 2 ? "-" : ""}105%)` };
        outgoing = { transform: `translateX(${index % 2 ? "" : "-"}105%)` };
      } else if (effect === "slices") {
        delay = index * 55;
        hidden = { transform: "translateY(120vh) skewX(-16deg)" };
        covered = { transform: "translateY(0) skewX(-16deg)", opacity: 1 };
        outgoing = { transform: "translateY(-120vh) skewX(-16deg)" };
      } else if (effect === "mosaic") {
        delay =
          (Math.hypot(
            (index % columns) - (columns - 1) / 2,
            Math.floor(index / columns) - (rows - 1) / 2,
          ) /
            Math.hypot(columns / 2, rows / 2)) *
          260;
        hidden = { transform: "scale(0) rotate(-70deg)", opacity: 0 };
        outgoing = { transform: "scale(0) rotate(70deg)", opacity: 0 };
      } else {
        delay = index * 28;
        hidden = {
          transform: "perspective(900px) rotateY(-90deg)",
          opacity: 0,
        };
        covered = { transform: "perspective(900px) rotateY(0deg)", opacity: 1 };
        outgoing = {
          transform: "perspective(900px) rotateY(90deg)",
          opacity: 0,
        };
      }
      const animation = tile.animate(
        reveal ? [covered, outgoing] : [hidden, covered],
        {
          duration: effect === "pixels" ? 260 : 330,
          delay,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "both",
        },
      );
      animations.push(animation);
      return animation.finished;
    });
  void Promise.all(animateTiles(false))
    .then(async () => {
      if (current !== generation || !overlay?.isConnected) return;
      apply();
      await Promise.all(animateTiles(true));
      cleanup();
    })
    .catch(cleanup);
}
