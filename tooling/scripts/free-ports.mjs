import { execSync, spawnSync } from "node:child_process";
const ports = [4321, 3001];
const stop = spawnSync(
  "pnpm",
  ["--filter", "@garden/web", "exec", "astro", "dev", "stop"],
  { stdio: "inherit", shell: true },
);
if (stop.status && stop.status !== 0)
  console.log("No Astro daemon to stop, checking ports.");
const output = execSync("netstat -ano", { encoding: "utf8" });
const pids = new Set();
for (const line of output.split(/\r?\n/)) {
  if (!/LISTENING/i.test(line)) continue;
  for (const port of ports) {
    if (line.includes(`:${port}`)) {
      const pid = line.trim().split(/\s+/).pop();
      if (pid && pid !== "0") pids.add(pid);
    }
  }
}
for (const pid of pids) {
  spawnSync("taskkill", ["/PID", pid, "/F"], { stdio: "inherit" });
  console.log(`Freed process ${pid}.`);
}
if (!pids.size) console.log(`Ports ${ports.join(" and ")} are free.`);
