import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const sharedEnvPath = path.resolve(projectDir, "..", ".env");
export const localEnvPath = path.join(projectDir, ".env");
