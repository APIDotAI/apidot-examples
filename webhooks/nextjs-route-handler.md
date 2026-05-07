# Next.js Route Handler Webhook

This example shows a minimal APIDot webhook receiver for the Next.js App Router.

Create `app/api/apidot/webhook/route.ts` in your Next.js app:

```ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const event = await request.json();
  const taskId = event?.data?.task_id || event?.task_id;

  if (!taskId) {
    return NextResponse.json(
      { ok: false, error: "Missing task_id" },
      { status: 400 },
    );
  }

  const status = event?.data?.status || event?.status || "unknown";
  const files = event?.data?.files || event?.files || [];

  // Store the update in your database here.
  // Keep this handler idempotent so duplicate callbacks are safe.
  console.log({ taskId, status, files });

  return NextResponse.json({ ok: true });
}
```

Then submit a task with:

```json
{
  "callback_url": "https://example.com/api/apidot/webhook"
}
```

## Production notes

- Do not expose APIDot API keys in client components.
- Persist callback payloads or normalized task state before returning success.
- Reconcile webhook updates with `GET /api/generate/status/{task_id}` if your downstream workflow requires stronger consistency.
