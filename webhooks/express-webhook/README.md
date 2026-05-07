# Express Webhook Receiver

This example receives APIDot task callbacks at `POST /api/apidot/webhook`.

## Run

```bash
cd webhooks/express-webhook
npm install
npm start
```

For local webhook testing, set `APIDOT_ALLOW_UNLISTED_TASK_IDS=true` or set `APIDOT_KNOWN_TASK_IDS` to the task ids you submitted. In production, replace the in-memory Set with your own database lookup and keep `APIDOT_ALLOW_UNLISTED_TASK_IDS` unset.

Expose the local server with a secure tunnel during development, then pass that public URL as `callback_url` in submit requests.

```json
{
  "callback_url": "https://example.com/api/apidot/webhook"
}
```

## Production notes

- Store task updates in a database instead of an in-memory `Set`.
- Only process callback `task_id` values that your system submitted and recorded.
- Keep the response path short: persist or enqueue the callback, return 2xx quickly, and reconcile with `GET /api/generate/status/{task_id}` using a timeout before irreversible business actions.
- Make the handler idempotent. In production, use `task_id` plus a status version, update time, or business unique key; do not rely only on an in-memory `Map`.
- Keep API keys and production callback URLs out of public repositories.
- Return a 2xx response only after your application has accepted the callback.
