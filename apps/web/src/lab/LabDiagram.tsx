import { sceneFamilies, type SceneProps } from "./scene-presets";
export default function LabDiagram({
  preset,
  state,
  options,
  shape,
}: Pick<SceneProps, "preset" | "state" | "options" | "shape">) {
  const family = sceneFamilies[preset];
  return (
    <svg
      viewBox="0 0 500 210"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {["database", "cache"].includes(family) ? (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${140 + i * 110},60)`}>
              <path d="M-35 0V75C-35 96 35 96 35 75V0" />
              <ellipse rx="35" ry="12" />
              <path d="M-35 25C-35 46 35 46 35 25M-35 50C-35 71 35 71 35 50" />
            </g>
          ))}
          {options.indexed || state.cached ? (
            <path d="M110 170H390" strokeWidth="5" />
          ) : null}
        </>
      ) : family === "phone" ? (
        <>
          <rect x="190" y="12" width="120" height="182" rx="18" />
          <path d="M232 26H268" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={208 + (i % 2) * 48}
              y={48 + Math.floor(i / 2) * 40}
              width="35"
              height="28"
              rx="4"
              fill={i === state.count % 6 ? "currentColor" : "none"}
            />
          ))}
        </>
      ) : family === "shield" ? (
        <>
          <path d="M250 20L315 45V110Q310 155 250 187Q190 155 185 110V45Z" />
          <rect x="223" y="88" width="54" height="44" rx="5" />
          <path
            d={
              state.error
                ? "M247 88V72Q247 49 273 55"
                : "M234 88V72Q250 45 266 72V88"
            }
          />
        </>
      ) : family === "sculpture" || family === "orbits" ? (
        <g transform="translate(250 105)">
          <ellipse rx={shape === "sphere" ? 77 : 100} ry="68" />
          <ellipse rx="33" ry="88" transform="rotate(40)" />
          <ellipse rx="33" ry="88" transform="rotate(-40)" />
        </g>
      ) : family === "tree" || family === "network" ? (
        <>
          <path d="M250 40L140 105L85 165M140 105L195 165M250 40L360 105L305 165M360 105L415 165" />
          {[
            [250, 40],
            [140, 105],
            [360, 105],
            [85, 165],
            [195, 165],
            [305, 165],
            [415, 165],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === state.count % 7 ? 17 : 12}
              fill="var(--color-bg-canvas)"
            />
          ))}
        </>
      ) : ["pages", "layers", "documents"].includes(family) ? (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${120 + i * 65},${25 + i * 22})`}>
              <rect
                width="170"
                height="110"
                rx="5"
                fill="var(--color-bg-canvas)"
              />
              <path d="M0 20H170M20 42H70M20 62H145M20 82H130" />
            </g>
          ))}
        </>
      ) : family === "servers" ? (
        <>
          {Array.from(
            { length: preset === "routing" ? options.replicas : 3 },
            (_, i) => (
              <g
                key={i}
                transform={`translate(${60 + i * 105},42)`}
                opacity={options.offline && i === 0 ? 0.35 : 1}
              >
                <rect width="78" height="116" rx="4" />
                {[0, 1, 2].map((j) => (
                  <rect
                    key={j}
                    x="10"
                    y={12 + j * 33}
                    width="58"
                    height="22"
                    rx="2"
                  />
                ))}
              </g>
            ),
          )}
        </>
      ) : family === "chain" ? (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${125 + i * 125},105)`}>
              <path d="M0-47L41-24V24L0 47L-41 24V-24Z" />
              <circle r="21" />
              {i < 2 && <path d="M45 0H80" />}
            </g>
          ))}
        </>
      ) : (
        <>
          <path d="M60 140H440" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${85 + i * 110},100)`}>
              {family === "assembly" || family === "container" ? (
                <>
                  <rect x="-28" y="-36" width="56" height="56" />
                  <path d="M-28-36L-10-55H46L28-36M46-55V0L28 20" />
                </>
              ) : (
                <circle r={i === state.count % 4 ? 30 : 24} />
              )}
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
