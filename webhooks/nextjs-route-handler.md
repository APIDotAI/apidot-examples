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
const reconcileTimeoutMs = Math.max(
  1000,
  Number(process.env.APIDOT_RECONCILE_TIMEOUT_MS || 5000) || 5000,
);

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

  // Store the update in your database or enqueue it here.
  // Keep this handler idempotent so duplicate callbacks are safe.
  console.log({ taskId, status, files, accepted: true });

  void reconcileTaskStatus(taskId, { timeoutMs: reconcileTimeoutMs }).then(
    (reconciled) => {
      console.log({ taskId, reconciled });
    },
  );

  return NextResponse.json({ ok: true });
}

async function isKnownTaskId(taskId: string) {
  // If APIDOT_KNOWN_TASK_IDS is unset, this demo accepts any task id so
  // real webhook tests are not dropped. Use a database lookup in production.
  return knownTaskIds.size === 0 || knownTaskIds.has(taskId);
}

function createTimeoutSignal(timeoutMs: number) {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

async function reconcileTaskStatus(
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
- Keep the response path short: persist or enqueue the callback, return 2xx quickly, and reconcile with `GET /api/generate/status/{task_id}` using a timeout before irreversible business actions.
