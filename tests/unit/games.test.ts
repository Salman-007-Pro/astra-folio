import { describe, expect, it } from "vitest";
import {
  newMemory,
  flipCard,
  settleMemory,
  newSnake,
  turnSnake,
  stepSnake,
  snakeFood,
  newShooter,
  stepShooter,
  hitTarget,
} from "../../apps/web/src/games/engines";

describe("card flip rounds", () => {
  it("has six shuffled pairs and wins on the final match", () => {
    let state = newMemory(() => 0.37);
    expect(new Set(state.cards).size).toBe(6);
    for (const symbol of new Set(state.cards)) {
      const indexes = state.cards.flatMap((card, index) =>
        card === symbol ? [index] : [],
      );
      expect(indexes).toHaveLength(2);
      state = flipCard(flipCard(state, indexes[0]), indexes[1]);
    }
    expect(state.status).toBe("won");
    expect(state.moves).toBe(6);
  });
  it("locks mismatched pairs, rejects duplicate flips, and loses at the move limit", () => {
    let state = newMemory();
    const different = state.cards.findIndex((card) => card !== state.cards[0]);
    for (let i = 0; i < 18; i++) {
      state = flipCard(state, 0);
      expect(flipCard(state, 0)).toBe(state);
      state = flipCard(state, different);
      expect(flipCard(state, (different + 1) % 12)).toBe(state);
      state = settleMemory(state);
    }
    expect(state.status).toBe("lost");
    expect(flipCard(state, 0)).toBe(state);
  });
});
describe("snake movement", () => {
  it("prevents reversal and more than one queued turn per tick", () => {
    const state = newSnake();
    expect(turnSnake(state, "left")).toBe(state);
    const turning = turnSnake(state, "up");
    expect(turnSnake(turning, "left")).toBe(turning);
    expect(stepSnake(turning).body[0]).toEqual({ x: 5, y: 7 });
  });
  it("ends on wall and body collisions", () => {
    expect(stepSnake({ ...newSnake(), body: [{ x: 15, y: 8 }] }).status).toBe(
      "lost",
    );
    const folded = {
      ...newSnake(),
      body: [
        { x: 5, y: 8 },
        { x: 6, y: 8 },
        { x: 6, y: 9 },
        { x: 5, y: 9 },
      ],
    };
    expect(stepSnake(folded).status).toBe("lost");
  });
  it("can move into a departing tail cell and grows to the winning score", () => {
    const loop = {
      ...newSnake(),
      direction: "down" as const,
      body: [
        { x: 5, y: 8 },
        { x: 6, y: 8 },
        { x: 6, y: 9 },
        { x: 5, y: 9 },
      ],
    };
    expect(stepSnake(loop).status).toBe("running");
    const win = stepSnake({ ...newSnake(), score: 9, food: { x: 6, y: 8 } });
    expect(win.status).toBe("won");
    expect(win.body).toHaveLength(4);
    expect(win.body).not.toContainEqual(win.food);
    expect(snakeFood([{ x: 0, y: 0 }], () => 0)).toEqual({ x: 1, y: 0 });
  });
});
describe("orbit shooter", () => {
  it("counts each target once and wins after fifteen hits", () => {
    let state = newShooter();
    for (let i = 0; i < 15; i++) {
      state = stepShooter({ ...state, spawnIn: 0 }, 50, () => 0.5);
      const id = state.targets[0].id;
      state = hitTarget(state, id);
      expect(hitTarget(state, id)).toBe(state);
    }
    expect(state.status).toBe("won");
    expect(state.hits).toBe(15);
  });
  it("consumes shields only for escaped targets and freezes an ended round", () => {
    const state = stepShooter(
      {
        ...newShooter(),
        lives: 1,
        targets: [{ id: 9, x: 50, y: 91, speed: 0.1 }],
      },
      50,
    );
    expect(state.status).toBe("lost");
    expect(state.lives).toBe(0);
    expect(stepShooter(state, 5000)).toBe(state);
  });
});
