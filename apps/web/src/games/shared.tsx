import { useEffect, useRef, useState, type RefObject } from "react";
import type { GameSettings } from "@garden/content-schema";
import type { RoundStatus } from "./engines";

export function usePause(
  root: RefObject<HTMLDivElement | null>,
  running: boolean,
) {
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
export function Result({
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
