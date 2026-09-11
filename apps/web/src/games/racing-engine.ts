import type { RoundStatus } from "./engines";

export const RACE_GOAL = 20;
export const ROAD_ROWS = 20;
export const PLAYER_ROW = 15;
export type Lane = 0 | 1;
export type TrafficCar = { id: number; lane: Lane; row: number };
export type RaceState = {
  lane: Lane;
  traffic: TrafficCar[];
  passed: number;
  distance: number;
  spawnIn: number;
  nextId: number;
  status: RoundStatus;
};
export const raceLevel = (passed: number) =>
  Math.min(5, 1 + Math.floor(passed / 4));
export const raceTickMs = (passed: number) =>
  240 - (raceLevel(passed) - 1) * 25;
export function newRace(): RaceState {
  return {
    lane: 0,
    traffic: [{ id: 0, lane: 1, row: -4 }],
    passed: 0,
    distance: 0,
    spawnIn: 10,
    nextId: 1,
    status: "running",
  };
}
function collides(lane: Lane, traffic: TrafficCar[]) {
  return traffic.some(
    (car) =>
      car.lane === lane && car.row < PLAYER_ROW + 4 && car.row + 4 > PLAYER_ROW,
  );
}
export function steerRace(
  state: RaceState,
  direction: "left" | "right",
): RaceState {
  if (state.status !== "running") return state;
  const lane = direction === "left" ? 0 : 1;
  if (state.lane === lane) return state;
  return {
    ...state,
    lane,
    status: collides(lane, state.traffic) ? "lost" : "running",
  };
}
export function stepRace(state: RaceState, random = Math.random): RaceState {
  if (state.status !== "running") return state;
  let traffic = state.traffic.map((car) => ({ ...car, row: car.row + 1 }));
  if (collides(state.lane, traffic))
    return { ...state, traffic, status: "lost" };
  const passed =
    state.passed + traffic.filter((car) => car.row >= ROAD_ROWS).length;
  traffic = traffic.filter((car) => car.row < ROAD_ROWS);
  let spawnIn = state.spawnIn - 1;
  let nextId = state.nextId;
  // Ten rows between cars leave a safe lane-change window even at level five.
  if (spawnIn <= 0 && passed < RACE_GOAL) {
    traffic.push({ id: nextId++, lane: random() < 0.5 ? 0 : 1, row: -4 });
    spawnIn = 10;
  }
  return {
    ...state,
    traffic,
    passed,
    distance: state.distance + 1,
    spawnIn,
    nextId,
    status: passed >= RACE_GOAL ? "won" : "running",
  };
}
