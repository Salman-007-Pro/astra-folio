import type { DemoPreset } from "@garden/content-schema";
export type DemoOptions = {
  fail: boolean;
  requestFail: boolean;
  indexed: boolean;
  document: boolean;
  replicas: number;
  offline: boolean;
  role: string;
  layout: string;
  gap: number;
};
export type DemoState = {
  count: number;
  phase: number;
  cached: boolean;
  completed: boolean;
  nodes: string[];
  message: string;
  trace: string[];
  error: boolean;
};
export const initialOptions: DemoOptions = {
  fail: false,
  requestFail: false,
  indexed: false,
  document: false,
  replicas: 3,
  offline: false,
  role: "guest",
  layout: "grid",
  gap: 16,
};
export const initialState: DemoState = {
  count: 0,
  phase: 0,
  cached: false,
  completed: false,
  nodes: ["Input", "Process", "Output"],
  message: "Ready. Run the example to follow the flow.",
  trace: [],
  error: false,
};
export function runDemo(
  preset: DemoPreset,
  state: DemoState,
  o: DemoOptions,
): DemoState {
  const s = { ...state, count: state.count + 1, error: false };
  const done = (
    nodes: string[],
    message: string,
    error = false,
  ): DemoState => ({
    ...s,
    nodes,
    message,
    error,
    trace: [
      `run-${s.count.toString().padStart(3, "0")} · ${preset}`,
      ...nodes.map((node, i) => `${i + 1}. ${node}`),
      message,
    ],
  });
  switch (preset) {
    case "routing": {
      const healthy = o.replicas - (o.offline ? 1 : 0);
      const replica = healthy
        ? (state.count % healthy) + (o.offline ? 2 : 1)
        : 0;
      return done(
        [
          "Request",
          "Router",
          replica ? `Replica ${replica}` : "No healthy replica",
          replica ? "200 OK" : "503 unavailable",
        ],
        replica
          ? `Routed to replica ${replica}. ${healthy} healthy of ${o.replicas}.`
          : "No healthy replicas. Restore capacity and retry.",
        !replica,
      );
    }
    case "query":
    case "document":
      return done(
        [
          o.document || preset === "document" ? "Document query" : "SQL query",
          o.indexed ? "Index lookup" : "Scan 8 records",
          "Order 42",
          "Result",
        ],
        `${o.indexed ? "Index narrows the lookup" : "Sequential scan checks each record"}. Illustrative access path, not a benchmark.`,
      );
    case "cache": {
      s.cached = true;
      return done(
        [
          "Read order",
          state.cached ? "Cache HIT" : "Cache MISS",
          state.cached ? "Cached value" : "Database → cache",
          "Order 42",
        ],
        state.cached
          ? "Cache hit: no new database read."
          : "Cache miss: fetched from database and stored for the next read.",
      );
    }
    case "jobs": {
      if (state.completed)
        return done(
          ["Job key: order-42", "Duplicate key", "Existing result"],
          "Duplicate suppressed. The completed job is not executed again.",
        );
      s.completed = !o.fail;
      return done(
        [
          "Job key: order-42",
          "Queued",
          o.fail ? "Attempt failed" : "Worker completed",
          o.fail ? "Retry available" : "Result stored",
        ],
        o.fail
          ? "Transient failure. Disable failure and retry the same key."
          : "Job completed once. Run again to check idempotency.",
        o.fail,
      );
    }
    case "auth":
      return done(
        [
          o.role === "guest" ? "No identity" : `Signed in: ${o.role}`,
          "Admin permission",
          o.role === "admin"
            ? "200 allowed"
            : o.role === "guest"
              ? "401 sign in"
              : "403 forbidden",
        ],
        o.role === "admin"
          ? "Admin action allowed."
          : o.role === "guest"
            ? "Authentication required before checking permissions."
            : "Authenticated, but not authorized for this action.",
        o.role !== "admin",
      );
    case "pipeline":
      return done(
        [
          "Commit",
          o.fail ? "Tests FAILED" : "Tests passed",
          ...(o.fail
            ? ["Deployment blocked"]
            : [
                "Build ready",
                "Deployed",
                o.requestFail ? "GET /orders · 500" : "GET /orders · 200",
              ]),
        ],
        o.fail
          ? "A failing test blocks deployment. Log: expected ready, received error."
          : o.requestFail
            ? "Trace: GET /orders → service → database timeout. Log: request failed after deployment."
            : "Trace: commit → tests → build → release → healthy request.",
        o.fail || o.requestFail,
      );
    case "wallet": {
      if (o.fail) {
        s.phase = 0;
        return done(
          ["Mock wallet", "Approval rejected"],
          "No transaction sent. Clear rejection and reconnect to retry.",
          true,
        );
      }
      s.phase = (state.phase % 4) + 1;
      const stages = [
        "Disconnected",
        "Connected",
        "Awaiting approval",
        "Pending",
        "Confirmed",
      ];
      return done(
        stages.slice(1, s.phase + 1),
        `${stages[s.phase]}. Simulation only: no wallet, signature or funds involved.`,
      );
    }
    case "contract":
      return done(
        [
          "Input",
          o.fail ? "Invalid value" : "Valid value",
          o.fail ? "Rejected" : "Accepted",
        ],
        o.fail
          ? "Input does not satisfy the required contract."
          : "Valid input can move into application state.",
        o.fail,
      );
    case "event":
      return done(
        ["start", "end", "microtask", "timer"],
        "Synchronous work finishes before queued microtasks and the timer callback.",
      );
    case "request":
    case "middleware":
      return done(
        [
          "GET /orders",
          preset === "middleware"
            ? "Middleware → handler"
            : "Service processing",
          o.fail ? "503 unavailable" : "200 response",
        ],
        o.fail
          ? "Request failed. Disable failure and retry."
          : "Response received: order-42 is ready.",
        o.fail,
      );
    case "test":
    case "browser":
      return done(
        [
          preset === "browser" ? "Fill form" : "Arrange input",
          preset === "browser" ? "Click Save" : "Run function",
          o.fail ? "Assertion failed" : "Assertion passed",
        ],
        o.fail
          ? "Regression detected: expected saved, received error."
          : "Expected behavior verified in this simulated example.",
        o.fail,
      );
    case "bundle":
      return done(
        ["Entry module", "Resolve imports", "Shared chunk", "App bundle"],
        `Build ${s.count}: modules assembled. No comparative timing is claimed.`,
      );
    case "container":
      return done(
        ["Application", "Runtime layer", "Image", "Running container"],
        "Application and runtime packaged into a repeatable process.",
      );
    case "route":
      return done(
        [
          s.count % 2 ? "/details" : "/home",
          "Server data",
          "Rendered HTML",
          "Client interaction",
        ],
        `Navigated to ${s.count % 2 ? "Details" : "Home"}. Rendering boundaries are illustrated.`,
      );
    case "mobile":
      return done(
        [
          "Phone",
          s.count % 2 ? "Shipment details" : "Shipments",
          "Touch navigation",
        ],
        s.count % 2 ? "Opened shipment #42." : "Returned to shipments.",
      );
    case "island":
      return done(
        ["Static HTML", "Visible island", "Hydrated control"],
        `Island active. Local interaction count: ${s.count}.`,
      );
    case "publish":
      return done(
        ["Draft record", "Published snapshot", "Page preview"],
        `Preview updated to revision ${s.count}. No live CMS changes.`,
      );
    case "mesh":
      return done(
        ["Geometry", "Material", "Light", `Rotation ${s.count * 45}°`],
        "The mesh rotates by another 45 degrees.",
      );
    case "layout":
      return done(
        [
          "Structure",
          o.layout === "grid" ? "Grid columns" : "Flex column",
          `Gap ${o.gap}px`,
        ],
        `Layout: ${o.layout}, spacing: ${o.gap}px. The preview uses real CSS.`,
      );
    case "store":
      return done(
        [
          "Increment action",
          `Store: ${s.count}`,
          `View A: ${s.count}`,
          `View B: ${s.count}`,
        ],
        "Both views read the same updated source of truth.",
      );
    default:
      return done(
        ["Click event", `State: ${s.count}`, `Rendered count: ${s.count}`],
        `Component state updated to ${s.count}.`,
      );
  }
}
