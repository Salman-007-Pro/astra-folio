import { readPreferences } from "./preferences";
export function initMotivation(root: HTMLElement) {
  const quotes = Array.from(
    root.querySelectorAll<HTMLElement>(".motivation-quote"),
  );
  const progress = root.querySelector<HTMLElement>("[data-quote-progress]")!;
  const play = root.querySelector<HTMLButtonElement>("[data-quote-play]")!;
  const counter = root.querySelector<HTMLElement>("[data-quote-counter]")!;
  let index = 0,
    elapsed = 0,
    visible = false,
    hovered = false,
    autoplay = readPreferences().motion,
    last = performance.now();
  const duration = Number(root.dataset.interval) * 1000;
  const sync = () => {
    play.textContent = autoplay ? "Pause" : "Play";
    play.setAttribute(
      "aria-label",
      autoplay ? "Pause quote rotation" : "Play quote rotation",
    );
    root.dataset.motion = String(readPreferences().motion);
  };
  const show = (next: number, manual = false) => {
    index = (next + quotes.length) % quotes.length;
    elapsed = 0;
    quotes.forEach((quote, i) => {
      quote.classList.toggle("is-current", i === index);
      quote.setAttribute("aria-hidden", String(i !== index));
      quote
        .querySelector("a")
        ?.setAttribute("tabindex", i === index ? "0" : "-1");
    });
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(quotes.length).padStart(2, "0")}`;
    progress.style.transform = "scaleX(0)";
    if (manual)
      root.querySelector<HTMLElement>("[data-quote-status]")!.textContent =
        quotes[index].textContent;
  };
  const prev = () => show(index - 1, true),
    next = () => show(index + 1, true),
    toggle = () => {
      autoplay = !autoplay;
      last = performance.now();
      sync();
    };
  const enter = () => {
      hovered = true;
    },
    leave = () => {
      hovered = false;
      last = performance.now();
    };
  const preferences = () => {
    if (!readPreferences().motion) autoplay = false;
    sync();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    },
    { threshold: 0.2 },
  );
  observer.observe(root);
  const timer = setInterval(() => {
    const now = performance.now();
    const delta = now - last;
    last = now;
    if (
      !autoplay ||
      !visible ||
      hovered ||
      document.hidden ||
      root.contains(document.activeElement) ||
      document.documentElement.classList.contains("dialog-open")
    )
      return;
    elapsed += delta;
    if (elapsed >= duration) show(index + 1);
    progress.style.transform = `scaleX(${elapsed / duration})`;
  }, 100);
  root.querySelector("[data-quote-prev]")?.addEventListener("click", prev);
  root.querySelector("[data-quote-next]")?.addEventListener("click", next);
  play.addEventListener("click", toggle);
  root.addEventListener("mouseenter", enter);
  root.addEventListener("mouseleave", leave);
  window.addEventListener("garden:preferences", preferences);
  const visibility = () => {
    last = performance.now();
  };
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("pageshow", visibility);
  sync();
  const cleanup = () => {
    clearInterval(timer);
    observer.disconnect();
    window.removeEventListener("garden:preferences", preferences);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("pageshow", visibility);
    root.querySelector("[data-quote-prev]")?.removeEventListener("click", prev);
    root.querySelector("[data-quote-next]")?.removeEventListener("click", next);
    play.removeEventListener("click", toggle);
    root.removeEventListener("mouseenter", enter);
    root.removeEventListener("mouseleave", leave);
  };
  window.addEventListener(
    "pagehide",
    (event) => {
      if (event.persisted) {
        last = performance.now();
        return;
      }
      cleanup();
    },
    { once: true },
  );
  return cleanup;
}
