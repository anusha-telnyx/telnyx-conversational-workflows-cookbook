import fs from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "./env.mjs";
import { projectDir, sharedEnvPath } from "./paths.mjs";

loadEnv();

const apiKey = process.env.TELNYX_API_KEY;
const apiBaseUrl = (process.env.TELNYX_API_BASE_URL || "https://api.telnyx.com/v2").replace(/\/$/, "");
const model = process.env.TELNYX_MODEL || "openai/gpt-4o";
const assistantName = process.env.TELNYX_ASSISTANT_NAME || "auto claim intake agent";

if (!apiKey) {
  console.error(`missing TELNYX_API_KEY. add it to ${sharedEnvPath} or the local .env file`);
  process.exit(1);
}

const instructions = await fs.readFile(path.join(projectDir, "prompts", "assistant_prompt.txt"), "utf8");
const greeting = await fs.readFile(path.join(projectDir, "prompts", "greeting.txt"), "utf8");

const payload = {
  name: assistantName,
  model,
  instructions,
  greeting,
  description: "auto insurance first notice of loss intake assistant"
};

const response = await fetch(`${apiBaseUrl}/ai/assistants`, {
  method: "POST",
  headers: {
    authorization: `Bearer ${apiKey}`,
    "content-type": "application/json"
  },
  body: JSON.stringify(payload)
});

const text = await response.text();
let data;

try {
  data = JSON.parse(text);
} catch {
  data = { raw: text };
}

if (!response.ok) {
  console.error(`telnyx assistant creation failed: http ${response.status}`);
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

await fs.writeFile(path.join(projectDir, ".telnyx-assistant.json"), `${JSON.stringify(data, null, 2)}\n`);

console.log(`created telnyx assistant: ${data.id || data.data?.id || assistantName}`);
console.log(`assistant name: ${data.name || data.data?.name || assistantName}`);
