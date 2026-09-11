export type RoundStatus = "ready" | "running" | "won" | "lost";
export const symbols = ["✦", "◎", "△", "◇", "✳", "⌘"];
export type MemoryState = {
  cards: number[];
  open: number[];
  matched: number[];
  moves: number;
  status: RoundStatus;
};
export function newMemory(random = Math.random): MemoryState {
  const cards = [...symbols.keys(), ...symbols.keys()];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return { cards, open: [], matched: [], moves: 0, status: "running" };
}
export function flipCard(state: MemoryState, index: number): MemoryState {
  if (
    state.status !== "running" ||
    state.open.length === 2 ||
    state.open.includes(index) ||
    state.matched.includes(index) ||
    index < 0 ||
    index >= state.cards.length
  )
    return state;
  const open = [...state.open, index];
  if (open.length === 1) return { ...state, open };
  const moves = state.moves + 1;
  if (state.cards[open[0]] === state.cards[open[1]]) {
    const matched = [...state.matched, ...open];
    return {
      ...state,
      open: [],
      matched,
      moves,
      status:
        matched.length === state.cards.length
          ? "won"
          : moves >= 18
            ? "lost"
            : "running",
    };
  }
  return { ...state, open, moves };
}
export function settleMemory(state: MemoryState): MemoryState {
  return state.open.length === 2
    ? { ...state, open: [], status: state.moves >= 18 ? "lost" : state.status }
    : state;
}
export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
const vectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
export const BOARD_SIZE = 16;
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
export type SnakeState = {
  body: Point[];
  direction: Direction;
  pending: Direction | null;
  food: Point;
  score: number;
  status: RoundStatus;
};
export function snakeFood(body: Point[], random = Math.random): Point {
  const free: Point[] = [];
  for (let y = 0; y < BOARD_SIZE; y++)
    for (let x = 0; x < BOARD_SIZE; x++)
      if (!body.some((p) => p.x === x && p.y === y)) free.push({ x, y });
  return (
    free[Math.min(free.length - 1, Math.floor(random() * free.length))] || {
      x: -1,
      y: -1,
    }
  );
}
export function newSnake(): SnakeState {
  return {
    body: [
      { x: 5, y: 8 },
      { x: 4, y: 8 },
      { x: 3, y: 8 },
    ],
    direction: "right",
    pending: null,
    food: { x: 9, y: 8 },
    score: 0,
    status: "running",
  };
}
export function turnSnake(state: SnakeState, direction: Direction): SnakeState {
  const a = vectors[state.direction],
    b = vectors[direction];
  if (
    state.status !== "running" ||
    state.pending ||
    (a.x + b.x === 0 && a.y + b.y === 0)
  )
    return state;
  return { ...state, pending: direction };
}
export function stepSnake(state: SnakeState, random = Math.random): SnakeState {
  if (state.status !== "running") return state;
  const direction = state.pending || state.direction,
    delta = vectors[direction];
  const head = { x: state.body[0].x + delta.x, y: state.body[0].y + delta.y };
  const grows = same(head, state.food);
  const occupied = grows ? state.body : state.body.slice(0, -1);
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= BOARD_SIZE ||
    head.y >= BOARD_SIZE ||
    occupied.some((p) => same(p, head))
  )
    return { ...state, status: "lost" };
  const body = [head, ...state.body];
  if (!grows) body.pop();
  const score = state.score + Number(grows);
  return {
    body,
    direction,
    pending: null,
    score,
    food: grows ? snakeFood(body, random) : state.food,
    status: score >= 10 ? "won" : "running",
  };
}
export type Target = { id: number; x: number; y: number; speed: number };
export type ShooterState = {
  targets: Target[];
  hits: number;
  lives: number;
  elapsed: number;
  spawnIn: number;
  nextId: number;
  status: RoundStatus;
};
export function newShooter(): ShooterState {
  return {
    targets: [],
    hits: 0,
    lives: 5,
    elapsed: 0,
    spawnIn: 0,
    nextId: 0,
    status: "running",
  };
}
export function stepShooter(
  state: ShooterState,
  delta: number,
  random = Math.random,
): ShooterState {
  if (state.status !== "running") return state;
  const dt = Math.min(100, Math.max(0, delta));
  let targets = state.targets.map((target) => ({
    ...target,
    y: target.y + target.speed * dt,
  }));
  const lives = Math.max(
    0,
    state.lives - targets.filter((target) => target.y > 91).length,
  );
  targets = targets.filter((target) => target.y <= 91);
  let spawnIn = state.spawnIn - dt,
    nextId = state.nextId;
  if (spawnIn <= 0 && targets.length < 5) {
    targets.push({
      id: nextId++,
      x: 12 + random() * 76,
      y: 9,
      speed: 0.009 + Math.min(state.hits, 15) * 0.0006,
    });
    spawnIn = 850;
  }
  return {
    ...state,
    targets,
    lives,
    spawnIn,
    nextId,
    elapsed: state.elapsed + dt,
    status: lives === 0 ? "lost" : "running",
  };
}
export function hitTarget(state: ShooterState, id: number): ShooterState {
  if (
    state.status !== "running" ||
    !state.targets.some((target) => target.id === id)
  )
    return state;
  const hits = state.hits + 1;
  return {
    ...state,
    hits,
    targets: state.targets.filter((target) => target.id !== id),
    status: hits >= 15 ? "won" : "running",
  };
}
