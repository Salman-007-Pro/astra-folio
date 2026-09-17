import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";

const directory = path.dirname(fileURLToPath(import.meta.url));

export default withPayload({
  output: "standalone",
  outputFileTracingRoot: path.join(directory, "../.."),
  poweredByHeader: false,
  transpilePackages: ["@garden/content-schema"],
  agentRules: false,
});
