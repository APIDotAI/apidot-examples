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

loadEnv();

const apiKey = process.env.APIDOT_API_KEY;
const baseUrl = process.env.APIDOT_BASE_URL || "https://api.apidot.ai";
const model = "gemini-3-flash-preview";

if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
  throw new Error("Set APIDOT_API_KEY in your environment or repo-root .env file.");
}

const payload = {
  contents: [
    {
      role: "user",
      parts: [
        {
          text: "Write a concise launch checklist for a developer API that supports native Gemini requests.",
        },
      ],
    },
  ],
  systemInstruction: {
    parts: [
      {
        text: "You are a concise technical assistant.",
      },
    ],
  },
  generationConfig: {
    temperature: 1,
    maxOutputTokens: 1024,
    topP: 0.95,
    topK: 40,
  },
};

const result = await requestJson(`${baseUrl}/v1beta/models/${model}:generateContent`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

console.log(JSON.stringify(result, null, 2));
