import fs from "node:fs";
import { localEnvPath, sharedEnvPath } from "./paths.mjs";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadEnv() {
  parseEnvFile(sharedEnvPath);
  parseEnvFile(localEnvPath);
}

export function getEnvPaths() {
  return { sharedEnvPath, localEnvPath };
}
