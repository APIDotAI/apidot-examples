import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  for (const envPath of [resolve(process.cwd(), ".env"), resolve(process.cwd(), "../../.env")]) {
    if (!existsSync(envPath)) continue;

    const content = readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;

      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));

  if (!response.ok || (body.code && body.code !== 0 && body.code !== 200)) {
    throw new Error(JSON.stringify(body, null, 2));
  }

  return body;
}

async function pollTask({ baseUrl, apiKey, taskId }) {
  for (let attempt = 1; attempt <= 90; attempt += 1) {
    const result = await requestJson(`${baseUrl}/api/generate/status/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const status = result.data?.status;
    console.log(`poll ${attempt}: ${status || "unknown"}`);

    if (status === "finished" || status === "failed") {
      return result;
    }

    await sleep(10000);
  }

  throw new Error(`Timed out waiting for task ${taskId}`);
}

loadEnv();

const apiKey = process.env.APIDOT_API_KEY;
const baseUrl = process.env.APIDOT_BASE_URL || "https://api.apidot.ai";
const callbackUrl = process.env.APIDOT_CALLBACK_URL || "https://example.com/api/apidot/webhook";

if (!apiKey || apiKey === "YOUR_APIDOT_API_KEY") {
  throw new Error("Set APIDOT_API_KEY in your environment or repo-root .env file.");
}

const payload = {
  model: "seedance-2",
  callback_url: callbackUrl,
  input: {
    prompt: "A slow dolly-in on a ceramic cup of espresso, morning light, cinematic realism",
    duration: 5,
    aspect_ratio: "16:9",
    resolution: "720p",
    generate_audio: true,
  },
};

const submitResult = await requestJson(`${baseUrl}/api/generate/submit`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

const taskId = submitResult.data?.task_id;
if (!taskId) {
  throw new Error(`Submit response did not include task_id: ${JSON.stringify(submitResult)}`);
}

console.log(`submitted task: ${taskId}`);

const finalResult = await pollTask({ baseUrl, apiKey, taskId });
console.log(JSON.stringify(finalResult, null, 2));
