import fs from "node:fs";
import { getEnvPaths, loadEnv } from "./env.mjs";

loadEnv();

const { sharedEnvPath, localEnvPath } = getEnvPaths();
const hasKey = Boolean(process.env.TELNYX_API_KEY);

console.log(`shared env: ${sharedEnvPath}`);
console.log(`shared env exists: ${fs.existsSync(sharedEnvPath) ? "yes" : "no"}`);
console.log(`local env: ${localEnvPath}`);
console.log(`local env exists: ${fs.existsSync(localEnvPath) ? "yes" : "no"}`);
console.log(`telnyx api key loaded: ${hasKey ? "yes" : "no"}`);

if (!hasKey) {
  process.exitCode = 1;
}
