import { useEffect, useRef, useState } from "react";
import type { GameSettings } from "@garden/content-schema";
import type { RoundStatus } from "./engines";
import { Result, usePause } from "./shared";
import {
  newRace,
  steerRace,
  stepRace,
  raceLevel,
  raceTickMs,
  PLAYER_ROW,
  RACE_GOAL,
  type Lane,
} from "./racing-engine";
import "./racing.css";

const pixels = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [1, 2],
  [0, 3],
  [2, 3],
];
const bestKey = "kinetic-garden-racing-best-v1";
function Car({
  lane,
  row,
  player = false,
}: {
  lane: Lane;
  row: number;
  player?: boolean;
}) {
  return (
    <g
      className={player ? "lcd-player" : "lcd-traffic"}
      data-lane={lane}
      data-row={row}
    >
      {pixels.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={((lane === 0 ? 1 : 6) + x) * 10 + 1}
          y={(row + y) * 10 + 1}
          width="8"
          height="8"
        />
      ))}
    </g>
  );
}
export default function Racing({ settings }: { settings: GameSettings }) {
  const [game, setGame] = useState(() => ({
    ...newRace(),
    status: "ready" as RoundStatus,
  }));
  const [best, setBest] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = usePause(root, game.status === "running");
  const level = raceLevel(game.passed);
  const score = game.passed * 100;
  const ended = game.status === "won" || game.status === "lost";
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(bestKey));
      if (Number.isInteger(saved) && saved >= 0 && saved <= RACE_GOAL * 100)
        setBest(saved);
    } catch {
      /* Local scores are optional. */
    }
  }, []);
  useEffect(() => {
    if (score <= best) return;
    setBest(score);
    try {
      localStorage.setItem(bestKey, String(score));
    } catch {
      /* Continue without storage. */
    }
  }, [score, best]);
  useEffect(() => {
    if (game.status !== "running" || paused) return;
    const timer = setInterval(
      () => setGame((current) => stepRace(current)),
      raceTickMs(game.passed),
    );
    return () => clearInterval(timer);
  }, [game.status, level, paused]);
  const focus = () => board.current?.focus({ preventScroll: true });
  const start = () => {
    setGame(newRace());
    setPaused(false);
    focus();
    if (matchMedia("(max-width: 640px)").matches)
      root.current
        ?.querySelector(".racing-console")
        ?.scrollIntoView({ block: "center", behavior: "instant" });
  };
  const resume = () => {
    setPaused(false);
    focus();
  };
  const steer = (direction: "left" | "right") => {
    if (!paused) setGame((current) => steerRace(current, direction));
  };
  return (
    <div className="game-layout racing-layout" ref={root}>
      <div className="game-info">
        <span className="eyebrow">04 / THE ORIGINAL ROAD TRIP</span>
        <h3>Racing Classic.</h3>
        <p>
          Two lanes. One clear path. Dodge the traffic and pass twenty cars to
          reach the finish. Every four overtakes, the pace picks up.
        </p>
        <div className="game-stats">
          <span>
            <strong>
              {game.passed}
              <small> / {RACE_GOAL}</small>
            </strong>
            Cars passed
          </span>
        </div>
        <p className="game-instructions">
          Use ← → or A / D with the screen focused, or tap the steering buttons.
          Space pauses. Your best score stays on this device.
        </p>
      </div>
      <div className="racing-console">
        <div className="racing-console-label">
          <span>RACING CLASSIC</span>
          <span>BRICK / 04</span>
        </div>
        <div
          className="game-surface racing-screen"
          ref={board}
          tabIndex={0}
          role="group"
          aria-label="Racing Classic game screen"
          onKeyDown={(event) => {
            if (event.target !== board.current || game.status !== "running")
              return;
            const key = event.key.toLowerCase();
            if (["arrowleft", "a", "arrowright", "d"].includes(key)) {
              event.preventDefault();
              steer(key === "arrowleft" || key === "a" ? "left" : "right");
            }
            if (key === " " && !event.repeat) {
              event.preventDefault();
              setPaused((value) => !value);
            }
          }}
        >
          <svg className="racing-road" viewBox="0 0 100 200" aria-hidden="true">
            <g className="lcd-ghost">
              {Array.from({ length: 200 }, (_, index) => (
                <rect
                  key={index}
                  x={(index % 10) * 10 + 1}
                  y={Math.floor(index / 10) * 10 + 1}
                  width="8"
                  height="8"
                />
              ))}
            </g>
            <g className="lcd-road-edge">
              {Array.from(
                { length: 20 },
                (_, row) =>
                  (row - (game.distance % 4) + 4) % 4 < 3 && (
                    <g key={row}>
                      <rect x="1" y={row * 10 + 1} width="8" height="8" />
                      <rect x="91" y={row * 10 + 1} width="8" height="8" />
                    </g>
                  ),
              )}
            </g>
            {game.traffic.map((car) => (
              <Car key={car.id} lane={car.lane} row={car.row} />
            ))}
            <Car lane={game.lane} row={PLAYER_ROW} player />
          </svg>
          <div className="racing-dashboard">
            <dl>
              <div>
                <dt>Score</dt>
                <dd data-race-score>{String(score).padStart(4, "0")}</dd>
              </div>
              <div>
                <dt>Hi-score</dt>
                <dd data-race-best>{String(best).padStart(4, "0")}</dd>
              </div>
              <div>
                <dt>Level</dt>
                <dd>{String(level).padStart(2, "0")}</dd>
              </div>
              <div>
                <dt>Speed</dt>
                <dd>
                  {level}
                  <small> / 5</small>
                </dd>
              </div>
            </dl>
            <div className="racing-finish">
              <span className="race-flag" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <i
                    key={i}
                    className={(i + Math.floor(i / 4)) % 2 ? "" : "flag-dark"}
                  />
                ))}
              </span>
              <span>
                FINISH
                <br />
                {RACE_GOAL * 100} PTS
              </span>
            </div>
          </div>
          {game.status === "ready" && (
            <div className="game-overlay racing-overlay">
              <span aria-hidden="true">↔</span>
              <h4>Ready, driver?</h4>
              <p>Find your lane. Keep it clear.</p>
              <button className="button" onClick={start}>
                Start race
              </button>
            </div>
          )}
          {paused && !ended && (
            <div className="game-overlay racing-overlay">
              <h4>A quick pit stop.</h4>
              <p>Your race is paused.</p>
              <button className="button" onClick={resume}>
                Resume race
              </button>
            </div>
          )}
          {ended && (
            <Result status={game.status} settings={settings} restart={start} />
          )}
        </div>
        <div
          className="racing-controls"
          role="group"
          aria-label="Racing controls"
        >
          <button
            className="race-steer"
            aria-label="Steer left"
            disabled={game.status !== "running" || paused}
            onClick={() => steer("left")}
          >
            ←
          </button>
          <button
            className="race-pause"
            disabled={game.status !== "running"}
            onClick={() => {
              setPaused((value) => !value);
              focus();
            }}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            className="race-steer"
            aria-label="Steer right"
            disabled={game.status !== "running" || paused}
            onClick={() => steer("right")}
          >
            →
          </button>
        </div>
        <div className="racing-console-footer">
          <span>LEFT / STEADY / RIGHT</span>
          <button disabled={game.status === "ready"} onClick={start}>
            Restart race
          </button>
        </div>
      </div>
    </div>
  );
}
