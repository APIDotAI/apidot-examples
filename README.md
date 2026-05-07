<div align="center">

# APIDot Examples

**Production-oriented quickstarts for building with APIDot APIs.**

[Website](https://apidot.ai) | [Docs](https://apidot.ai/docs) | [Models](https://apidot.ai/models)

[GitHub](https://github.com/APIDotAI) | [X](https://x.com/APIDotAI) | [Discord](https://discord.gg/bu5hVztmHu)

</div>

---

APIDot gives developers one API key for production-ready image, video, chat, and music models. This repository contains small examples that show the real async generation flow: submit a task, store the `task_id`, poll status or receive a webhook, then retrieve generated file URLs.

## Start here

| Example | What it covers |
| --- | --- |
| [curl/gpt-image-2.md](curl/gpt-image-2.md) | Submit a GPT Image 2 text-to-image job with cURL. |
| [curl/seedance-2.md](curl/seedance-2.md) | Submit a Seedance 2 video job with cURL. |
| [node/gpt-image-2](node/gpt-image-2) | Run a GPT Image 2 job from Node.js with native `fetch`. |
| [node/seedance-2](node/seedance-2) | Run a Seedance 2 job from Node.js with native `fetch`. |
| [polling/task-status.md](polling/task-status.md) | Poll `/api/generate/status/{task_id}` until a task finishes. |
| [webhooks/express-webhook](webhooks/express-webhook) | Receive APIDot callbacks with a minimal Express server. |
| [webhooks/nextjs-route-handler.md](webhooks/nextjs-route-handler.md) | Receive APIDot callbacks in a Next.js App Router route handler. |

## Environment

Create an API key in the APIDot dashboard, then keep it on the server side.

```bash
cp .env.example .env
```

```bash
APIDOT_API_KEY=YOUR_APIDOT_API_KEY
# Optional: uncomment only when you have a real public webhook receiver.
# APIDOT_CALLBACK_URL=https://example.com/api/apidot/webhook
# Optional for local allowlist demos. If unset, webhook demos accept any task id.
# Use a database lookup in production.
# APIDOT_KNOWN_TASK_IDS=task-unified-example
```

## Core API flow

1. Submit a generation request:

```http
POST https://api.apidot.ai/api/generate/submit
Authorization: Bearer <APIDOT_API_KEY>
Content-Type: application/json
```

2. Store the returned `data.task_id` immediately.
3. Retrieve the result with polling:

```http
GET https://api.apidot.ai/api/generate/status/{task_id}
Authorization: Bearer <APIDOT_API_KEY>
```

4. Or pass `callback_url` during submit and receive a webhook when the task reaches a terminal state.

## Production notes

- Keep API keys out of browser code and public repositories.
- Treat webhooks as idempotent. Duplicate deliveries should not create duplicate user-visible results.
- Only process webhook `task_id` values that your system submitted and recorded.
- Persist task ids before starting polling or waiting for callbacks.
- Retry transient failures with backoff, but do not retry invalid payloads unchanged.
- APIDot is designed so failed generation tasks do not consume credits; check current billing behavior in the dashboard and docs before production use.

## Links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Models: https://apidot.ai/models
- Support: support@apidot.ai
- License: MIT
