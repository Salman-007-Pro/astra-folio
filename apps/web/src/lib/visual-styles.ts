export const visualStyles = [
  { id: "default", name: "Original", description: "The Kinetic Garden" },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon edges. Sharp lines.",
  },
  {
    id: "holographic",
    name: "Holographic",
    description: "Iridescent light and foil",
  },
  {
    id: "pixel",
    name: "Pixel / Game",
    description: "Arcade panels and pixels",
  },
  {
    id: "parallax",
    name: "Parallax",
    description: "Depth that follows your scroll",
  },
  {
    id: "glass",
    name: "Liquid Glass",
    description: "Fluid light. Frosted surfaces.",
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft, sculpted surfaces",
  },
  {
    id: "paper",
    name: "Paper / Scrapbook",
    description: "Tactile layers and ink",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "A confident magazine layout",
  },
  { id: "aurora", name: "Aurora", description: "Luminous gradients and calm" },
  {
    id: "cartoon",
    name: "Cartoon / Illustrative",
    description: "Bold outlines. Playful panels.",
  },
  {
    id: "scrollytelling",
    name: "Scrollytelling",
    description: "A story that unfolds as you scroll",
  },
  {
    id: "vintage",
    name: "Retro / Vintage",
    description: "Classic print and warm nostalgia",
  },
  {
    id: "clay",
    name: "Claymorphism",
    description: "Soft volume and rounded forms",
  },
  {
    id: "doodle",
    name: "Hand-drawn / Doodle",
    description: "Loose lines and handwritten accents",
  },
] as const;

export type VisualStyle = (typeof visualStyles)[number]["id"];
export const isVisualStyle = (value: unknown): value is VisualStyle =>
  visualStyles.some((style) => style.id === value);

let transition: ReturnType<Document["startViewTransition"]> | undefined;
export function transitionStyle(update: () => void) {
  transition?.skipTransition();
  const root = document.documentElement;
  if (
    root.dataset.motion === "off" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  if (document.startViewTransition) {
    const next = document.startViewTransition(update);
    transition = next;
    void next.ready.catch(() => {});
    void next.finished
      .finally(() => {
        if (transition === next) transition = undefined;
      })
      .catch(() => {});
  } else {
    update();
    document
      .querySelector("main")
      ?.animate([{ opacity: 0.7 }, { opacity: 1 }], {
        duration: 420,
        easing: "ease-out",
      });
  }
}

// Only decorative layers move; content and fixed navigation stay in place.
export function initStyleMotion() {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  let frame = 0;
  let cleanup = () => {};
  const reset = () => {
    cleanup();
    cancelAnimationFrame(frame);
    frame = 0;
    for (const key of [
      "--style-depth",
      "--glass-x",
      "--glass-y",
      "--story-progress",
    ])
      root.style.removeProperty(key);
    if (reduced.matches || root.dataset.motion === "off" || document.hidden)
      return;
    if (root.dataset.style === "scrollytelling") {
      const animations = new Set<Animation>();
      const observer = new IntersectionObserver(
        (entries) => {
          if (root.classList.contains("dialog-open")) return;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            const animation = entry.target.animate(
              [
                { opacity: 0.55, transform: "translateY(16px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
            );
            animations.add(animation);
            void animation.finished.then(
              () => animations.delete(animation),
              () => animations.delete(animation),
            );
          }
        },
        { threshold: 0.15 },
      );
      document
        .querySelectorAll(
          "main .section-header, .reading-section > h2, .case-body h2, .about-story h2",
        )
        .forEach((element) => observer.observe(element));
      const paint = () => {
        frame = 0;
        if (root.classList.contains("dialog-open")) return;
        const distance = root.scrollHeight - innerHeight;
        root.style.setProperty(
          "--story-progress",
          String(
            distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0,
          ),
        );
      };
      const scroll = () => {
        if (!frame) frame = requestAnimationFrame(paint);
      };
      paint();
      window.addEventListener("scroll", scroll, { passive: true });
      window.addEventListener("resize", scroll);
      cleanup = () => {
        observer.disconnect();
        animations.forEach((animation) => animation.cancel());
        window.removeEventListener("scroll", scroll);
        window.removeEventListener("resize", scroll);
      };
    } else if (root.dataset.style === "parallax") {
      const paint = () => {
        frame = 0;
        if (!root.classList.contains("dialog-open")) {
          root.style.setProperty(
            "--style-depth",
            `${Math.min(window.scrollY * 0.065, 320)}px`,
          );
        }
      };
      const scroll = () => {
        if (!frame) frame = requestAnimationFrame(paint);
      };
      paint();
      window.addEventListener("scroll", scroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", scroll);
    } else if (root.dataset.style === "glass" && pointer.matches) {
      let x = 50,
        y = 30;
      const move = (event: PointerEvent) => {
        x = (event.clientX / window.innerWidth) * 100;
        y = (event.clientY / window.innerHeight) * 100;
        if (!frame)
          frame = requestAnimationFrame(() => {
            frame = 0;
            root.style.setProperty("--glass-x", `${x}%`);
            root.style.setProperty("--glass-y", `${y}%`);
          });
      };
      window.addEventListener("pointermove", move, { passive: true });
      cleanup = () => window.removeEventListener("pointermove", move);
    }
  };
  window.addEventListener("garden:preferences", reset);
  window.addEventListener("garden:layout", reset);
  document.addEventListener("visibilitychange", reset);
  reduced.addEventListener("change", reset);
  pointer.addEventListener("change", reset);
  reset();
}
