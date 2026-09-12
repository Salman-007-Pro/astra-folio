import { isStyleTransition, type StyleTransition } from "./style-transitions";
import { isVisualStyle, type VisualStyle } from "./visual-styles";
export type Preferences = {
  style: VisualStyle;
  transition: StyleTransition;
  motion: boolean;
  sound: boolean;
  night: boolean;
  blueprint: boolean;
  lightPalette: Palette;
  darkPalette: Palette;
};
export const palettes = ["garden", "ocean", "ember"] as const;
export type Palette = (typeof palettes)[number];
export const isPalette = (value: unknown): value is Palette =>
  palettes.includes(value as Palette);
export const preferenceKey = "kinetic-garden-preferences-v1";
export function readPreferences(): Preferences {
  const palette = document.documentElement.dataset.defaultPalette;
  const defaults: Preferences = {
    style: "default",
    transition: "pixels",
    motion: !matchMedia("(prefers-reduced-motion: reduce)").matches,
    sound: false,
    night: matchMedia("(prefers-color-scheme: dark)").matches,
    blueprint: false,
    lightPalette: isPalette(palette) ? palette : "garden",
    darkPalette: isPalette(palette) ? palette : "garden",
  };
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey) || "{}");
    return {
      ...defaults,
      transition: isStyleTransition(saved.transition)
        ? saved.transition
        : "pixels",
      style: isVisualStyle(saved.style) ? saved.style : "default",
      ...Object.fromEntries(
        Object.entries(saved).filter(
          ([k, v]) =>
            ["motion", "sound", "night", "blueprint"].includes(k) &&
            typeof v === "boolean",
        ),
      ),
      lightPalette: isPalette(saved.lightPalette)
        ? saved.lightPalette
        : defaults.lightPalette,
      darkPalette: isPalette(saved.darkPalette)
        ? saved.darkPalette
        : defaults.darkPalette,
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
  document.documentElement.dataset.style = preferences.style;
  document.documentElement.dataset.motion = preferences.motion ? "on" : "off";
  document.documentElement.dataset.palette = preferences.night
    ? preferences.darkPalette
    : preferences.lightPalette;
  window.dispatchEvent(
    new CustomEvent("garden:preferences", { detail: preferences }),
  );
}
