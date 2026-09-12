import { isVisualStyle, type VisualStyle } from "./visual-styles";

// Native cursor images preserve selection, keyboard focus and zero-lag pointing.
const marks: Record<VisualStyle, string> = {
  default: "",
  cyberpunk:
    '<path d="M3 3v24l6-7 7 1Z"/><path d="M21 3v7m-3-4h7" fill="none"/>',
  holographic:
    '<path d="m3 3 21 13-10 2-5 10Z"/><path d="m19 3 7 5-7 5-3-5Z" fill="none"/>',
  pixel: '<path d="M3 3h5v5h5v5h5v5h5v5H13v5H8V18H3Z"/>',
  parallax:
    '<path d="m3 3 8 24 4-11 12-4Z"/><path d="m19 22 7 3-4-7" fill="none"/>',
  glass:
    '<path d="M3 3q10 2 22 14l-11 1-5 10Z"/><circle cx="20" cy="6" r="3" fill="none"/>',
  neumorphism:
    '<path d="M3 3 24 16l-10 2-5 10Z"/><path d="m7 8 12 8-7 1" fill="none"/>',
  paper:
    '<path d="m3 3 22 13-10 1-6 12Z"/><path d="m3 3 12 14 10-1" fill="none"/>',
  editorial:
    '<path d="M3 3v24l7-9h12Z"/><path d="m11 19 5 9" fill="none" stroke-width="3"/>',
  aurora:
    '<path d="m3 3 6 25 5-12 13-6Z"/><circle cx="23" cy="23" r="4" fill="none"/>',
  cartoon: '<path d="M3 3q8 2 22 15l-10 1-4 10Z" stroke-width="3"/>',
  scrollytelling:
    '<path d="m3 3 21 12-11 3-5 11Z"/><path d="M21 23h8m-8 4h5" fill="none"/>',
  vintage:
    '<path d="M3 3 25 16l-11 2-5 11Z"/><path d="M7 9v11l5-5Z" fill="none"/>',
  clay: '<path d="M3 3Q1 20 9 28l6-10 12-4Q15 3 3 3Z" stroke-width="2.5"/>',
  doodle:
    '<path d="m3 3 2 24 8-9 12 1Z" fill="none" stroke-width="2.5"/><path d="m7 8 8 6M16 22l4 6" fill="none"/>',
};

export function initStyleChrome() {
  const root = document.documentElement;
  const footer = document.querySelector<HTMLElement>(".site-footer");
  let frame = 0;
  const position = () => {
    frame = 0;
    if (!footer || root.classList.contains("dialog-open")) return;
    root.style.setProperty(
      "--footer-avoid",
      `${Math.max(0, innerHeight - footer.getBoundingClientRect().top)}px`,
    );
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(position);
  };
  const update = () => {
    const style = root.dataset.style;
    const mark = isVisualStyle(style) ? marks[style] : "";
    if (!mark) {
      root.style.removeProperty("--style-cursor");
      root.style.removeProperty("--style-pointer");
    } else {
      const css = getComputedStyle(root);
      const ink = css.getPropertyValue("--color-text-primary").trim();
      const surface = css.getPropertyValue("--color-bg-surface").trim();
      const cursor = (active: boolean) =>
        `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="${active ? ink : surface}" stroke="${active ? surface : ink}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${mark}</g></svg>`)}") 3 3, ${active ? "pointer" : "auto"}`;
      root.style.setProperty("--style-cursor", cursor(false));
      root.style.setProperty("--style-pointer", cursor(true));
    }
    schedule();
  };
  const observer = new ResizeObserver(schedule);
  if (footer) observer.observe(footer);
  observer.observe(document.body);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("garden:layout", schedule);
  window.addEventListener("garden:preferences", update);
  void document.fonts.ready.then(schedule);
  update();
}
