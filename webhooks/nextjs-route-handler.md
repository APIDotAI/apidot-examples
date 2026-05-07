# Next.js Route Handler Webhook

This example shows a minimal APIDot webhook receiver for the Next.js App Router.

Create `app/api/apidot/webhook/route.ts` in your Next.js app:

```ts
import { NextResponse } from "next/server";

const knownTaskIds = new Set(
  (process.env.APIDOT_KNOWN_TASK_IDS || "")
    .split(",")
    .map((taskId) => taskId.trim())
    .filter(Boolean),
);
const allowUnlistedTaskIds = process.env.APIDOT_ALLOW_UNLISTED_TASK_IDS === "true";

export async function POST(request: Request) {
  const event = await request.json();
  const taskId = event?.data?.task_id || event?.task_id;

  if (!taskId) {
    return NextResponse.json(
      { ok: false, error: "Missing task_id" },
      { status: 400 },
    );
  }

  const knownTask = await isKnownTaskId(taskId);
  if (!knownTask) {
    return NextResponse.json(
      { ok: true, ignored: true, reason: "Unknown task_id" },
      { status: 202 },
    );
  }

  const status = event?.data?.status || event?.status || "unknown";
  const files = event?.data?.files || event?.files || [];

  // Persist the callback or enqueue a durable job before returning 2xx.
  // Keep this handler idempotent so duplicate callbacks are safe.
  await enqueueWebhookEvent({ taskId, status, files, event });

  return NextResponse.json({ ok: true });
}

async function isKnownTaskId(taskId: string) {
  // Use APIDOT_ALLOW_UNLISTED_TASK_IDS=true only for local demos.
  // In production, replace this with a database lookup.
  return knownTaskIds.has(taskId) || allowUnlistedTaskIds;
}

async function enqueueWebhookEvent(payload: {
  taskId: string;
  status: string;
  files: unknown;
  event: unknown;
}) {
  // Replace this with a database insert or durable queue publish.
  // Do not rely on promises started after the response returns in serverless.
  console.log({ ...payload, accepted: true });
}
```

Run status reconciliation from a queue worker after the callback is stored or dequeued. Do not rely on a promise started after the route handler returns; serverless runtimes may stop execution.

```ts
function createTimeoutSignal(timeoutMs: number) {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

export async function reconcileTaskStatusForWorker(
  taskId: string,
  { timeoutMs = 5000 }: { timeoutMs?: number } = {},
) {
  const apiKey = process.env.APIDOT_API_KEY;
  const baseUrl = process.env.APIDOT_BASE_URL || "https://api.apidot.ai";

  if (!apiKey || apiKey === "YOUR_APIDOT_API_KEY") {
    return { task_id: taskId, reconciled: false, reason: "APIDOT_API_KEY is not set" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/generate/status/${taskId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: createTimeoutSignal(timeoutMs),
    });

    const body = await response.json().catch(() => ({}));

    return {
      task_id: taskId,
      reconciled: response.ok,
      http_status: response.status,
      status: body?.data?.status,
    };
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    const message = error instanceof Error ? error.message : "Unknown status request error";

    return {
      task_id: taskId,
      reconciled: false,
      reason: name === "AbortError" || name === "TimeoutError" ? "status request timed out" : message,
    };
  }
}
```

For local webhook testing, set `APIDOT_ALLOW_UNLISTED_TASK_IDS=true` or set `APIDOT_KNOWN_TASK_IDS` to the task ids you submitted. In production, use a database lookup and keep `APIDOT_ALLOW_UNLISTED_TASK_IDS` unset.

Then submit a task with a complete payload that includes `callback_url`:

```json
{
  "model": "seedance-2",
  "callback_url": "https://example.com/api/apidot/webhook",
  "input": {
    "prompt": "A slow dolly-in on a ceramic cup of espresso, morning light, cinematic realism",
    "duration": 5,
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "generate_audio": true
  }
}
```

## Production notes

- Do not expose APIDot API keys in client components.
- Only process callback `task_id` values that your system submitted and recorded.
- Persist callback payloads or normalized task state before returning success.
- Keep the response path short: persist or enqueue the callback, return 2xx quickly, and reconcile with `GET /api/generate/status/{task_id}` from a queue worker using a timeout before irreversible business actions.
- Do not rely on post-response promises in serverless route handlers.
- Make webhook idempotency durable with `task_id` plus a status version, update time, or business unique key.
