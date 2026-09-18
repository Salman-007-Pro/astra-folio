export const palettes = [
  { id: "garden", label: "Garden" },
  { id: "ocean", label: "Ocean" },
  { id: "ember", label: "Ember" },
  { id: "dusk", label: "Dusk" },
  { id: "sage", label: "Sage" },
  { id: "sand", label: "Sand" },
  { id: "ink", label: "Ink" },
  { id: "rose", label: "Rose" },
  { id: "citrus", label: "Citrus" },
  { id: "glacier", label: "Glacier" },
  { id: "copper", label: "Copper" },
  { id: "orchid", label: "Orchid" },
  { id: "slate", label: "Slate" },
  { id: "forest", label: "Forest" },
  { id: "noir", label: "Noir" },
] as const;

export type Palette = (typeof palettes)[number]["id"];

export const paletteIds = palettes.map((palette) => palette.id);

export const isPalette = (value: unknown): value is Palette =>
  palettes.some((palette) => palette.id === value);
