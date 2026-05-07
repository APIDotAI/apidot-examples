# Express Webhook Receiver

This example receives APIDot task callbacks at `POST /api/apidot/webhook`.

## Run

```bash
cd webhooks/express-webhook
npm install
npm start
```

By default, this demo accepts any task id so real webhook tests are not dropped. To test a local allowlist, set `APIDOT_KNOWN_TASK_IDS=task-unified-example`. In production, replace the in-memory Set with your own database lookup.

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
- Make the handler idempotent. Duplicate callback delivery should be safe.
- Keep API keys and production callback URLs out of public repositories.
- Return a 2xx response only after your application has accepted the callback.
