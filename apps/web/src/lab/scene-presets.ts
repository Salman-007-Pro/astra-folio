import type { DemoPreset } from "@garden/content-schema";
import type { DemoOptions, DemoState } from "./model";
export type LabShape = "knot" | "sphere" | "torus" | "crystal";
export type LabFinish = "ceramic" | "metal" | "wireframe";
export const sceneFamilies = {
  layout: "layers",
  route: "pages",
  island: "pages",
  publish: "pages",
  state: "tree",
  store: "network",
  contract: "shield",
  auth: "shield",
  mobile: "phone",
  event: "orbits",
  request: "servers",
  middleware: "servers",
  routing: "servers",
  container: "container",
  query: "database",
  document: "documents",
  cache: "cache",
  bundle: "assembly",
  pipeline: "pipeline",
  test: "checks",
  browser: "pages",
  wallet: "chain",
  jobs: "queue",
  mesh: "sculpture",
} as const satisfies Record<DemoPreset, string>;
export const sceneLabels = {
  layers: "THE LAYOUT STUDIO",
  pages: "LIVING INTERFACES",
  tree: "REACTIVE COMPONENT TREE",
  network: "ONE STORE · CONNECTED VIEWS",
  shield: "THE TRUST BOUNDARY",
  phone: "A POCKET-SIZED PRODUCT",
  orbits: "THE EVENT LOOP",
  servers: "REQUESTS IN MOTION",
  container: "PACKAGED TO TRAVEL",
  database: "LAYERS OF DATA",
  documents: "DOCUMENT COLLECTION",
  cache: "THE FAST PATH",
  assembly: "FROM MODULES TO BUNDLE",
  pipeline: "THE DELIVERY LINE",
  checks: "BEHAVIOR UNDER TEST",
  chain: "CONNECTED BY TRUST",
  queue: "WORK IN THE WAITING ROOM",
  sculpture: "GEOMETRY PLAYGROUND",
};
export type SceneProps = {
  preset: DemoPreset;
  state: DemoState;
  options: DemoOptions;
  motion: boolean;
  color: string;
  shape: LabShape;
  finish: LabFinish;
  angle: number;
  onFailure: () => void;
};
