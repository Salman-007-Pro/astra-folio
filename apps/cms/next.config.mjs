import { withPayload } from "@payloadcms/next/withPayload";
export default withPayload({
  poweredByHeader: false,
  transpilePackages: ["@garden/content-schema"],
  agentRules: false,
});
