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

  const reconciled = await reconcileTaskStatus(taskId);

  // Store the update in your database here.
  // Keep this handler idempotent so duplicate callbacks are safe.
  console.log({ taskId, status, files, reconciled });

  return NextResponse.json({ ok: true });
}

async function isKnownTaskId(taskId: string) {
  // Replace this Set with a database lookup in production. Only process
  // callbacks for task ids your system submitted and stored.
  return knownTaskIds.has(taskId);
}

async function reconcileTaskStatus(taskId: string) {
  const apiKey = process.env.APIDOT_API_KEY;
  const baseUrl = process.env.APIDOT_BASE_URL || "https://api.apidot.ai";

  if (!apiKey || apiKey === "YOUR_APIDOT_API_KEY") {
    return { task_id: taskId, reconciled: false, reason: "APIDOT_API_KEY is not set" };
  }

  const response = await fetch(`${baseUrl}/api/generate/status/${taskId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const body = await response.json().catch(() => ({}));

  return {
    task_id: taskId,
    reconciled: response.ok,
    http_status: response.status,
    status: body?.data?.status,
  };
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
- Reconcile webhook updates with `GET /api/generate/status/{task_id}` if your downstream workflow requires stronger consistency.
