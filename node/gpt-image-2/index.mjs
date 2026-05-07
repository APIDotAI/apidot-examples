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
  const responseText = await response.text();
  let body = {};

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      body = { raw: responseText };
    }
  }

  const apiCode = Number(body?.code);
  const hasApiError = Number.isFinite(apiCode) && apiCode !== 0 && apiCode !== 200;

  if (!response.ok || hasApiError) {
    throw new Error(
      `APIDot request failed: ${JSON.stringify(
        {
          http_status: response.status,
          http_status_text: response.statusText,
          api_code: body?.code,
          body,
        },
        null,
        2,
      )}`,
    );
  }

  return body;
}

async function pollTask({ baseUrl, apiKey, taskId }) {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
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
const callbackUrl = process.env.APIDOT_CALLBACK_URL;

if (!apiKey || apiKey === "YOUR_APIDOT_API_KEY") {
  throw new Error("Set APIDOT_API_KEY in your environment or repo-root .env file.");
}

const payload = {
  model: "gpt-image-2",
  ...(callbackUrl ? { callback_url: callbackUrl } : {}),
  input: {
    prompt: "A premium product photo of a silver espresso machine on a clean white studio background, realistic lighting, high detail",
    quality: "low",
    size: "1:1",
    resolution: "1K",
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
