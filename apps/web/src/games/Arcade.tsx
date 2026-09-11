import { useEffect, useRef, useState, type RefObject } from "react";
import type { GameSettings } from "@garden/content-schema";
import {
  BOARD_SIZE,
  symbols,
  newMemory,
  flipCard,
  settleMemory,
  newSnake,
  turnSnake,
  stepSnake,
  newShooter,
  stepShooter,
  hitTarget,
  type RoundStatus,
  type Direction,
} from "./engines";
import "./arcade.css";

function usePause(root: RefObject<HTMLDivElement | null>, running: boolean) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!running) return;
    const pause = () => setPaused(true);
    const hidden = () => {
      if (document.hidden) pause();
    };
    const dialogs = new MutationObserver(() => {
      if (document.documentElement.classList.contains("dialog-open")) pause();
    });
    dialogs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) pause();
    });
    const surface = root.current?.querySelector(".game-surface");
    if (surface) observer.observe(surface);
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("blur", pause);
    return () => {
      observer.disconnect();
      dialogs.disconnect();
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("blur", pause);
    };
  }, [root, running]);
  return [paused, setPaused] as const;
}
function Result({
  status,
  settings,
  restart,
}: {
  status: RoundStatus;
  settings: GameSettings;
  restart: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quotes = status === "won" ? settings.winQuotes : settings.lossQuotes;
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)],
  );
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="round-result" tabIndex={-1} ref={ref} role="status">
      <span className="result-symbol" aria-hidden="true">
        {status === "won" ? "✦" : "↻"}
      </span>
      <h3>
        {status === "won"
          ? "Beautifully played."
          : "A new round, a new possibility."}
      </h3>
      <p>{quote}</p>
      <button className="button" onClick={restart}>
        Play again <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
function Controls({
  status,
  paused,
  pause,
  restart,
}: {
  status: RoundStatus;
  paused: boolean;
  pause: () => void;
  restart: () => void;
}) {
  return (
    <div className="game-actions">
      {status === "running" && (
        <>
          <button className="game-control" onClick={pause}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button className="game-control" onClick={restart}>
            Restart
          </button>
        </>
      )}
    </div>
  );
}
function Memory({ settings }: { settings: GameSettings }) {
  const [game, setGame] = useState(() => ({
    ...newMemory(() => 0.5),
    status: "ready" as RoundStatus,
  }));
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = usePause(root, game.status === "running");
  const start = () => {
    setGame(newMemory());
    setPaused(false);
  };
  useEffect(() => {
    if (game.open.length !== 2 || paused || game.status !== "running") return;
    const timer = setTimeout(() => setGame(settleMemory), 800);
    return () => clearTimeout(timer);
  }, [game.open, game.status, paused]);
  const ended = game.status === "won" || game.status === "lost";
  return (
    <div className="game-layout" ref={root}>
      <div className="game-info">
        <span className="eyebrow">01 / PATTERN & PATIENCE</span>
        <h3>Card flip.</h3>
        <p>
          Find all six matching pairs in 18 moves. Turn two cards, remember what
          you see, and connect the pattern.
        </p>
        <div className="game-stats">
          <span>
            <strong>
              {game.matched.length / 2}
              <small> / 6</small>
            </strong>
            Pairs found
          </span>
          <span>
            <strong>
              {game.moves}
              <small> / 18</small>
            </strong>
            Moves used
          </span>
        </div>
        <Controls
          status={game.status}
          paused={paused}
          pause={() => setPaused(!paused)}
          restart={start}
        />
        <p className="game-instructions">
          Tap a card, or use Tab and Enter. No timer. Take your time.
        </p>
      </div>
      <div className="game-surface memory-surface">
        <div className="memory-grid" aria-label="Memory cards">
          {game.cards.map((symbol, index) => {
            const matched = game.matched.includes(index),
              revealed = matched || game.open.includes(index);
            return (
              <button
                key={index}
                className={`memory-card ${revealed ? "is-flipped" : ""} ${matched ? "is-matched" : ""}`}
                aria-label={`Card ${index + 1}${revealed ? `: ${symbols[symbol]}${matched ? ", matched" : ""}` : ", face down"}`}
                disabled={
                  game.status !== "running" ||
                  paused ||
                  matched ||
                  (game.open.length === 2 && !revealed)
                }
                onClick={() => setGame((current) => flipCard(current, index))}
              >
                <span aria-hidden="true">
                  {revealed ? symbols[symbol] : "✧"}
                </span>
                {matched && <small aria-hidden="true">✓</small>}
              </button>
            );
          })}
        </div>
        {game.status === "ready" && (
          <div className="game-overlay">
            <span aria-hidden="true">⌘</span>
            <h4>A little focus goes a long way.</h4>
            <button className="button" onClick={start}>
              Start card flip
            </button>
          </div>
        )}
        {paused && !ended && (
          <div className="game-overlay">
            <h4>Take your time.</h4>
            <p>Your round is paused.</p>
            <button className="button" onClick={() => setPaused(false)}>
              Resume card flip
            </button>
          </div>
        )}
        {ended && (
          <Result status={game.status} settings={settings} restart={start} />
        )}
      </div>
    </div>
  );
}
const arrows: Record<Direction, string> = {
  up: "↑",
  left: "←",
  down: "↓",
  right: "→",
};
const keys: Record<string, Direction> = {
  ArrowUp: "up",
  w: "up",
  ArrowDown: "down",
  s: "down",
  ArrowLeft: "left",
  a: "left",
  ArrowRight: "right",
  d: "right",
};
function Snake({ settings }: { settings: GameSettings }) {
  const [game, setGame] = useState(() => ({
    ...newSnake(),
    status: "ready" as RoundStatus,
  }));
  const root = useRef<HTMLDivElement>(null),
    board = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = usePause(root, game.status === "running");
  const start = () => {
    setGame(newSnake());
    setPaused(false);
    board.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (game.status !== "running" || paused) return;
    const timer = setInterval(
      () => setGame((current) => stepSnake(current)),
      180,
    );
    return () => clearInterval(timer);
  }, [game.status, paused]);
  const ended = game.status === "won" || game.status === "lost";
  const turn = (direction: Direction) => {
    if (!paused) setGame((current) => turnSnake(current, direction));
  };
  return (
    <div className="game-layout snake-layout" ref={root}>
      <div className="game-info">
        <span className="eyebrow">02 / FIND YOUR FLOW</span>
        <h3>Signal snake.</h3>
        <p>
          Collect ten signals to complete the circuit. Keep moving, plan your
          turns, and steer clear of the walls and your own trail.
        </p>
        <div className="game-stats">
          <span>
            <strong>
              {game.score}
              <small> / 10</small>
            </strong>
            Signals collected
          </span>
        </div>
        <p className="game-instructions">
          Use the arrow keys, WASD, or the direction buttons. Focus the board to
          use the keyboard; Space pauses.
        </p>
      </div>
      <div
        className="game-surface snake-surface"
        ref={board}
        tabIndex={0}
        role="group"
        aria-label="Snake game board"
        onKeyDown={(event) => {
          if (keys[event.key]) {
            event.preventDefault();
            turn(keys[event.key]);
          }
          if (
            event.key === " " &&
            game.status === "running" &&
            event.target === board.current
          ) {
            event.preventDefault();
            setPaused(!paused);
          }
        }}
      >
        <svg
          viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
          className="snake-board"
          aria-hidden="true"
        >
          {game.body.map((part, index) => (
            <rect
              key={`${part.x}-${part.y}`}
              x={part.x + 0.08}
              y={part.y + 0.08}
              width={0.84}
              height={0.84}
              rx={index ? 0.16 : 0.28}
              className={index ? "snake-body" : "snake-head"}
            />
          ))}
          <circle
            cx={game.food.x + 0.5}
            cy={game.food.y + 0.5}
            r={0.3}
            className="snake-food"
          />
        </svg>
        {game.status === "ready" && (
          <div className="game-overlay">
            <span aria-hidden="true">⌁</span>
            <h4>One signal at a time.</h4>
            <button className="button" onClick={start}>
              Start snake
            </button>
          </div>
        )}
        {paused && !ended && (
          <div className="game-overlay">
            <h4>Catch your breath.</h4>
            <p>Your round is paused.</p>
            <button
              className="button"
              onClick={() => {
                setPaused(false);
                board.current?.focus({ preventScroll: true });
              }}
            >
              Resume snake
            </button>
          </div>
        )}
        {ended && (
          <Result status={game.status} settings={settings} restart={start} />
        )}
      </div>
      <div className="snake-inputs">
        <div className="direction-pad" aria-label="Snake direction controls">
          {(["up", "left", "down", "right"] as const).map((direction) => (
            <button
              key={direction}
              className={`direction-${direction}`}
              aria-label={`Move ${direction}`}
              disabled={game.status !== "running" || paused}
              onClick={() => turn(direction)}
            >
              {arrows[direction]}
            </button>
          ))}
        </div>
        <Controls
          status={game.status}
          paused={paused}
          pause={() => {
            setPaused(!paused);
            board.current?.focus({ preventScroll: true });
          }}
          restart={start}
        />
      </div>
    </div>
  );
}
function Shooter({ settings }: { settings: GameSettings }) {
  const [game, setGame] = useState(() => ({
    ...newShooter(),
    status: "ready" as RoundStatus,
  }));
  const root = useRef<HTMLDivElement>(null);
  const arena = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = usePause(root, game.status === "running");
  const start = () => {
    setGame(newShooter());
    setPaused(false);
    arena.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (game.status !== "running" || paused) return;
    const timer = setInterval(
      () => setGame((current) => stepShooter(current, 50)),
      50,
    );
    return () => clearInterval(timer);
  }, [game.status, paused]);
  const ended = game.status === "won" || game.status === "lost";
  return (
    <div className="game-layout" ref={root}>
      <div className="game-info">
        <span className="eyebrow">03 / AIM WITH INTENTION</span>
        <h3>Orbit shooter.</h3>
        <p>
          Clear fifteen moving targets before five cross the lower boundary. Tap
          to shoot. Every hit makes room for the next one.
        </p>
        <div className="game-stats">
          <span>
            <strong>
              {game.hits}
              <small> / 15</small>
            </strong>
            Targets cleared
          </span>
          <span>
            <strong>
              {game.lives}
              <small> / 5</small>
            </strong>
            Shields left
          </span>
        </div>
        <Controls
          status={game.status}
          paused={paused}
          pause={() => setPaused(!paused)}
          restart={start}
        />
        <p className="game-instructions">
          Click or tap the targets. With the arena focused, Enter or Space fires
          at the next target. You can also Tab to a specific target.
        </p>
      </div>
      <div
        className="game-surface shooter-surface"
        ref={arena}
        tabIndex={0}
        role="group"
        aria-label="Orbit shooter arena"
        onKeyDown={(event) => {
          if (
            event.target !== arena.current ||
            !["Enter", " "].includes(event.key)
          )
            return;
          event.preventDefault();
          if (!paused && game.status === "running" && game.targets[0])
            setGame((current) =>
              hitTarget(current, current.targets[0]?.id ?? -1),
            );
        }}
      >
        <span className="arena-label" aria-hidden="true">
          SIGNAL RANGE / 15
        </span>
        {game.targets.map((target) => (
          <button
            className="orbit-target"
            key={target.id}
            aria-label={`Shoot target ${target.id + 1}`}
            disabled={paused || game.status !== "running"}
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            onClick={(event) => {
              if (event.detail === 0)
                arena.current?.focus({ preventScroll: true });
              setGame((current) => hitTarget(current, target.id));
            }}
          >
            <span aria-hidden="true">⊕</span>
          </button>
        ))}
        <span className="defense-line" aria-hidden="true">
          PROTECT THE LINE
        </span>
        {game.status === "ready" && (
          <div className="game-overlay">
            <span aria-hidden="true">⊕</span>
            <h4>Find your focus.</h4>
            <button className="button" onClick={start}>
              Start shooter
            </button>
          </div>
        )}
        {paused && !ended && (
          <div className="game-overlay">
            <h4>Hold that thought.</h4>
            <p>Your round is paused.</p>
            <button className="button" onClick={() => setPaused(false)}>
              Resume shooter
            </button>
          </div>
        )}
        {ended && (
          <Result status={game.status} settings={settings} restart={start} />
        )}
      </div>
    </div>
  );
}
export default function Arcade({ settings }: { settings: GameSettings }) {
  const [active, setActive] = useState("memory");
  return (
    <div className="arcade">
      <div className="arcade-menu" aria-label="Choose a game" role="group">
        {[
          { id: "memory", title: "Card flip", glyph: "⌘" },
          { id: "snake", title: "Snake", glyph: "⌁" },
          { id: "shooter", title: "Shooter", glyph: "⊕" },
        ].map((game, index) => (
          <button
            key={game.id}
            className="arcade-tab"
            aria-pressed={active === game.id}
            onClick={() => setActive(game.id)}
          >
            <span aria-hidden="true">{game.glyph}</span>
            <span>{game.title}</span>
            <small aria-hidden="true">0{index + 1}</small>
          </button>
        ))}
      </div>
      {active === "memory" ? (
        <Memory settings={settings} />
      ) : active === "snake" ? (
        <Snake settings={settings} />
      ) : (
        <Shooter settings={settings} />
      )}
      <div className="arcade-footnote">
        <span>PLAY A LITTLE. KEEP YOUR CURIOSITY.</span>
        <span>Rounds pause when you step away.</span>
      </div>
    </div>
  );
}
