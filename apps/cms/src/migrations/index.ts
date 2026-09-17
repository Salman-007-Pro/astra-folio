import * as migration_20260914_215620 from "./20260914_215620";

export const migrations = [
  {
    up: migration_20260914_215620.up,
    down: migration_20260914_215620.down,
    name: "20260914_215620",
  },
];
