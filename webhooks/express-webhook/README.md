# Express Webhook Receiver

This example receives APIDot task callbacks at `POST /api/apidot/webhook`.

## Run

```bash
cd webhooks/express-webhook
npm install
npm start
```

Expose the local server with a secure tunnel during development, then pass that public URL as `callback_url` in submit requests.

```json
{
  "callback_url": "https://example.com/api/apidot/webhook"
}
```

## Production notes

- Store task updates in a database instead of an in-memory `Set`.
- Make the handler idempotent. Duplicate callback delivery should be safe.
- Keep API keys and production callback URLs out of public repositories.
- Return a 2xx response only after your application has accepted the callback.
