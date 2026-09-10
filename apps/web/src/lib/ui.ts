import {
  readPreferences,
  writePreferences,
  type Preferences,
} from "./preferences";
let preferences = readPreferences();
writePreferences(preferences);
const settings = document.querySelector<HTMLDialogElement>(
  "#experience-settings",
);
const menu = document.querySelector<HTMLDialogElement>("#mobile-menu");
document
  .querySelector("[data-settings-open]")
  ?.addEventListener("click", () => settings?.showModal());
document
  .querySelector("[data-menu-open]")
  ?.addEventListener("click", () => menu?.showModal());
document.querySelectorAll<HTMLDialogElement>("dialog").forEach((dialog) => {
  dialog
    .querySelector("[data-dialog-close]")
    ?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => dialog.close()));
});
(["motion", "sound", "night", "blueprint"] as (keyof Preferences)[]).forEach(
  (key) => {
    const input = document.querySelector<HTMLInputElement>(`#pref-${key}`);
    if (!input) return;
    input.checked = preferences[key];
    input.addEventListener("change", () => {
      preferences = { ...preferences, [key]: input.checked };
      writePreferences(preferences);
      if (key === "sound" && input.checked) ping();
    });
  },
);
let audioContext: AudioContext | undefined;
function ping() {
  try {
    audioContext ||= new AudioContext();
    void audioContext.resume();
    const oscillator = audioContext.createOscillator(),
      gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      780,
      audioContext.currentTime + 0.08,
    );
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.12,
    );
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.13);
  } catch {}
}
document.addEventListener("click", (e) => {
  if (preferences.sound && (e.target as HTMLElement).closest("a,button"))
    ping();
});
const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");
mediaQuery.addEventListener("change", (e) => {
  preferences = { ...preferences, motion: !e.matches };
  writePreferences(preferences);
  const input = document.querySelector<HTMLInputElement>("#pref-motion");
  if (input) input.checked = preferences.motion;
});
const timeElement = document.querySelector("[data-local-time]");
function clock() {
  if (timeElement)
    timeElement.textContent =
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Riyadh",
      }).format(new Date()) + " AST";
}
clock();
if (timeElement) setInterval(clock, 60000);
document.querySelectorAll<HTMLElement>("[data-copy]").forEach((button) =>
  button.addEventListener("click", async () => {
    const value =
      button.dataset.copy === "url" ? location.href : button.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(value);
      const toast = document.querySelector<HTMLElement>("#toast");
      if (toast) {
        toast.textContent = "Copied to clipboard";
        toast.classList.add("visible");
        setTimeout(() => toast.classList.remove("visible"), 2200);
      }
    } catch {
      button.textContent = value;
    }
  }),
);
document
  .querySelector("[data-print]")
  ?.addEventListener("click", () => window.print());
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    settings?.open ? settings.close() : settings?.showModal();
  }
});
