export type Preferences = {
  motion: boolean;
  sound: boolean;
  night: boolean;
  blueprint: boolean;
};
export const preferenceKey = "kinetic-garden-preferences-v1";
export function readPreferences(): Preferences {
  const defaults = {
    motion: !matchMedia("(prefers-reduced-motion: reduce)").matches,
    sound: false,
    night: false,
    blueprint: false,
  };
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
    return {
      ...defaults,
      ...Object.fromEntries(
        Object.entries(saved).filter(
          ([k, v]) => k in defaults && typeof v === "boolean",
        ),
      ),
    };
  } catch {
    return defaults;
  }
}
export function writePreferences(preferences: Preferences) {
  try {
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
  } catch {
    /* Storage is optional. */
  }
  document.documentElement.dataset.theme = preferences.night ? "night" : "day";
  document.documentElement.dataset.motion = preferences.motion ? "on" : "off";
  window.dispatchEvent(
    new CustomEvent("garden:preferences", { detail: preferences }),
  );
}
