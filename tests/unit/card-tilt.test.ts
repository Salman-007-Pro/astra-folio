import { describe, expect, it } from "vitest";
import {
  lerpTilt,
  tiltFromPointer,
  tiltStep,
} from "../../apps/web/src/lib/card-tilt";

const box = { left: 0, top: 0, width: 200, height: 100 };

describe("tiltFromPointer", () => {
  it("returns zero rotation at the card centre", () => {
    expect(tiltFromPointer(100, 50, box, 7)).toEqual({
      rx: 0,
      ry: 0,
      nx: 0,
      ny: 0,
      px: 50,
      py: 50,
    });
  });

  it("leans right when the pointer is on the left", () => {
    const tilt = tiltFromPointer(0, 50, box, 7);
    expect(tilt.ry).toBe(-7);
    expect(tilt.rx).toBe(0);
    expect(tilt.nx).toBe(-1);
  });

  it("leans back when the pointer is at the top", () => {
    const tilt = tiltFromPointer(100, 0, box, 7);
    expect(tilt.rx).toBe(7);
    expect(tilt.ry).toBe(0);
    expect(tilt.ny).toBe(-1);
  });

  it("clamps pointer positions beyond the card edges", () => {
    const tilt = tiltFromPointer(-80, 400, box, 5);
    expect(tilt.nx).toBe(-1);
    expect(tilt.ny).toBe(1);
    expect(tilt.rx).toBe(-5);
    expect(tilt.ry).toBe(-5);
    expect(tilt.px).toBe(0);
    expect(tilt.py).toBe(100);
  });
});

describe("lerpTilt", () => {
  const from = { rx: 0, ry: 0, nx: 0, ny: 0, px: 50, py: 50 };
  const to = { rx: 8, ry: -4, nx: -1, ny: 1, px: 0, py: 100 };

  it("stays on the start pose at amount 0", () => {
    expect(lerpTilt(from, to, 0)).toEqual(from);
  });

  it("reaches the target at amount 1", () => {
    expect(lerpTilt(from, to, 1)).toEqual(to);
  });

  it("eases halfway between poses", () => {
    expect(lerpTilt(from, to, 0.5)).toEqual({
      rx: 4,
      ry: -2,
      nx: -0.5,
      ny: 0.5,
      px: 25,
      py: 75,
    });
  });
});

describe("tiltStep", () => {
  it("stays put when no time has passed", () => {
    expect(tiltStep(0, 0.16)).toBe(0);
  });

  it("moves a small fraction of the way in one 60Hz frame", () => {
    const step = tiltStep(1 / 60, 0.16);
    expect(step).toBeGreaterThan(0.09);
    expect(step).toBeLessThan(0.12);
  });

  it("keeps the same ease at 120Hz as at 60Hz for the same elapsed time", () => {
    const sixty = 1 - (1 - tiltStep(1 / 60, 0.16)) ** 2;
    const twice = 1 - (1 - tiltStep(1 / 120, 0.16)) ** 4;
    expect(Math.abs(sixty - twice)).toBeLessThan(0.002);
  });
});
