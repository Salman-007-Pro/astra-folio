import { describe, it, expect } from "vitest";
import {
  newRace,
  steerRace,
  stepRace,
  raceLevel,
  raceTickMs,
  RACE_GOAL,
} from "../../apps/web/src/games/racing-engine";

describe("Racing Classic", () => {
  it("keeps steering inside two lanes and freezes terminal rounds", () => {
    const initial = newRace();
    expect(steerRace(initial, "left")).toBe(initial);
    expect(steerRace(initial, "right").lane).toBe(1);
    const ended = { ...initial, status: "lost" as const };
    expect(stepRace(ended)).toBe(ended);
    expect(steerRace(ended, "right")).toBe(ended);
  });
  it("detects approaching cars and steering into occupied road space", () => {
    const state = {
      ...newRace(),
      traffic: [{ id: 0, lane: 0 as const, row: 11 }],
    };
    expect(stepRace(state).status).toBe("lost");
    expect(stepRace(steerRace(state, "right")).status).toBe("running");
    const alongside = {
      ...state,
      lane: 1 as const,
      traffic: [{ id: 0, lane: 0 as const, row: 15 }],
    };
    expect(steerRace(alongside, "left").status).toBe("lost");
  });
  it("only awards points when a car clears the bottom of the road", () => {
    const state = {
      ...newRace(),
      traffic: [{ id: 0, lane: 1 as const, row: 19 }],
    };
    const cleared = stepRace(state);
    expect(cleared.passed).toBe(1);
    expect(stepRace(cleared).passed).toBe(1);
    expect(cleared.traffic).toHaveLength(0);
  });
  it("accelerates through five bounded levels", () => {
    expect([0, 4, 8, 12, 16].map(raceLevel)).toEqual([1, 2, 3, 4, 5]);
    expect(raceLevel(200)).toBe(5);
    expect(raceTickMs(0)).toBeGreaterThan(raceTickMs(16));
    expect(raceTickMs(200)).toBe(140);
  });
  it("leaves a traversable gap and wins after twenty overtakes", () => {
    let state = newRace();
    let spawn = 0;
    for (let i = 0; i < 400 && state.status === "running"; i++) {
      const approaching = state.traffic.find(
        (car) => car.row >= 10 && car.row < 19,
      );
      if (approaching)
        state = steerRace(state, approaching.lane === 0 ? "right" : "left");
      state = stepRace(state, () => (spawn++ % 2 ? 0.9 : 0.1));
      const rows = state.traffic.map((car) => car.row).sort((a, b) => b - a);
      for (let j = 1; j < rows.length; j++)
        expect(rows[j - 1] - rows[j]).toBeGreaterThanOrEqual(10);
      expect(state.status).not.toBe("lost");
    }
    expect(state.status).toBe("won");
    expect(state.passed).toBe(RACE_GOAL);
    expect(stepRace(state)).toBe(state);
  });
});
