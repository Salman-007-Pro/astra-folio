export const styleTransitions = [
  { id: "fade", name: "Smooth Fade", description: "A quiet dissolve" },
  { id: "fold", name: "Page Fold", description: "Turn a new leaf" },
  {
    id: "pixels",
    name: "Pixel Flip",
    description: "Ten tiles across. A ripple of flips.",
  },
  { id: "curtain", name: "Curtain", description: "Open the next scene" },
  {
    id: "circle",
    name: "Circular Reveal",
    description: "A new look, radiating out",
  },
] as const;
export type StyleTransition = (typeof styleTransitions)[number]["id"];
export const isStyleTransition = (value: unknown): value is StyleTransition =>
  styleTransitions.some((effect) => effect.id === value);

let cancelActive = () => {};
let generation = 0;

export function transitionStyle(
  update: () => void,
  effect: StyleTransition = "fade",
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
  let view: ReturnType<Document["startViewTransition"]> | undefined;
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
    view?.skipTransition();
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

  if (effect !== "pixels" && document.startViewTransition) {
    view = document.startViewTransition(apply);
    void view.ready.catch(() => {});
    void view.finished.then(cleanup, cleanup);
    return;
  }
  if (effect !== "pixels") {
    apply();
    const animation = document
      .querySelector("main")
      ?.animate([{ opacity: 0.5 }, { opacity: 1 }], {
        duration: 420,
        easing: "ease-out",
      });
    if (animation) {
      animations.push(animation);
      void animation.finished.then(cleanup, cleanup);
    } else cleanup();
    return;
  }
  overlay = document.createElement("div");
  overlay.className = "style-pixel-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.setAttribute("popover", "manual");
  // A popover paints above the settings dialog without moving keyboard focus.
  document.body.append(overlay);
  if (typeof overlay.showPopover === "function") overlay.showPopover();
  else
    (document.querySelector("dialog[open]") || document.body).append(overlay);
  const size = innerWidth / 10;
  const rows = Math.ceil(innerHeight / size);
  overlay.style.setProperty("--tile-size", `${size}px`);
  const tiles = Array.from({ length: rows * 10 }, (_, index) => {
    const tile = document.createElement("span");
    tile.style.setProperty("--tile-tone", `${(index % 10) * 2 + 82}%`);
    overlay?.append(tile);
    return tile;
  });
  const animateTiles = (reveal: boolean) =>
    tiles.map((tile, index) => {
      const wave = ((index % 10) + Math.floor(index / 10)) / (rows + 8);
      const animation = tile.animate(
        reveal
          ? [
              { transform: "perspective(500px) rotateY(0deg)", opacity: 1 },
              { transform: "perspective(500px) rotateY(-90deg)", opacity: 0 },
            ]
          : [
              { transform: "perspective(500px) rotateY(90deg)", opacity: 0 },
              { transform: "perspective(500px) rotateY(0deg)", opacity: 1 },
            ],
        {
          duration: 260,
          delay: wave * 220,
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
