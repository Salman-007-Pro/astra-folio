export type Quality = "HIGH" | "MEDIUM" | "LOW" | "FALLBACK";
export function classifyQuality({
  width,
  cores = 4,
  memory = 4,
  webgl = true,
  saveData = false,
}: {
  width: number;
  cores?: number;
  memory?: number;
  webgl?: boolean;
  saveData?: boolean;
}): Quality {
  if (!webgl) return "FALLBACK";
  if (saveData || memory <= 2 || cores <= 2) return "LOW";
  return width >= 1100 && cores >= 8 && memory >= 8 ? "HIGH" : "MEDIUM";
}
export const qualityConfig = {
  HIGH: { dpr: 1.5, particles: 28, segments: 64, shadows: true },
  MEDIUM: { dpr: 1.25, particles: 14, segments: 40, shadows: true },
  LOW: { dpr: 1, particles: 6, segments: 24, shadows: false },
  FALLBACK: { dpr: 1, particles: 0, segments: 12, shadows: false },
};
export type Chapter =
  "HERO" | "WORK" | "EXPERIENCE" | "SKILLS" | "WRITING" | "ABOUT" | "CONTACT";
export const chapters: Chapter[] = [
  "HERO",
  "WORK",
  "EXPERIENCE",
  "SKILLS",
  "WRITING",
  "ABOUT",
  "CONTACT",
];
export function chapterAt(progress: number): Chapter {
  return chapters[
    Math.max(0, Math.min(chapters.length - 1, Math.floor(progress)))
  ];
}
