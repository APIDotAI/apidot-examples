<div align="center">

# APIDot Examples

**Production-oriented quickstarts for building with APIDot APIs.**

[Website](https://apidot.ai) | [Docs](https://apidot.ai/docs) | [Models](https://apidot.ai/models)

[GitHub](https://github.com/APIDotAI) | [X](https://x.com/APIDotAI) | [Discord](https://discord.gg/bu5hVztmHu)

</div>

---

APIDot gives developers one API key for production-ready image, video, chat, music, and 3D models. This repository contains small examples for server-side API calls, including async media generation and direct chat requests.

## Model-specific API repositories

These focused repositories are built as model-level API quickstarts with cURL, Node.js, polling, webhooks, pricing context, and production notes.

### Image models

| Model | Repository | APIDot links |
| --- | --- | --- |
| GPT Image 2 | [GPT Image 2 API examples](https://github.com/APIDotAI/gpt-image-2-api) | [Model page](https://apidot.ai/models/gpt-image-2) · [API docs](https://apidot.ai/docs/gpt-image-2) |
| Nano Banana 2 | [Nano Banana 2 API examples](https://github.com/APIDotAI/nano-banana-2-api) | [Model page](https://apidot.ai/models/nano-banana-2) · [API docs](https://apidot.ai/docs/nano-banana-2) |
| Nano Banana Pro | [Nano Banana Pro API examples](https://github.com/APIDotAI/nano-banana-pro-api) | [Model page](https://apidot.ai/models/nano-banana-pro) · [API docs](https://apidot.ai/docs/nano-banana-pro) |
| Seedream 4.5 | [Seedream 4.5 API examples](https://github.com/APIDotAI/seedream-4.5-api) | [Model page](https://apidot.ai/models/seedream-4-5) · [API docs](https://apidot.ai/docs/seedream-4-5) |

### Video models

| Model | Repository | APIDot links |
| --- | --- | --- |
| Seedance 2 | [Seedance 2 API examples](https://github.com/APIDotAI/seedance-2-api) | [Model page](https://apidot.ai/models/seedance-2) · [API docs](https://apidot.ai/docs/seedance-2) |
| Sora 2 Official | [Sora 2 Official API examples](https://github.com/APIDotAI/sora-2-official-api) | [Model page](https://apidot.ai/models/sora-2-official) · [API docs](https://apidot.ai/docs/sora-2-official) |
| Happy Horse | [Happy Horse API examples](https://github.com/APIDotAI/happy-horse-api) | [Model page](https://apidot.ai/models/happy-horse) · [API docs](https://apidot.ai/docs/happy-horse) |
| Veo 3.1 | [Veo 3.1 API examples](https://github.com/APIDotAI/veo-3.1-api) | [Model page](https://apidot.ai/models/veo-3-1) · [API docs](https://apidot.ai/docs/veo-3-1) |

## cURL model quickstarts

| Example | What it covers |
| --- | --- |
| [curl/image/gpt-image-2.md](curl/image/gpt-image-2.md) | Submit a GPT Image 2 text-to-image job with cURL. |
| [curl/image/flux-2.md](curl/image/flux-2.md) | Submit a FLUX.2 image job with cURL. |
| [curl/image/flux-kontext.md](curl/image/flux-kontext.md) | Submit a Flux Kontext image job with cURL. |
| [curl/image/nano-banana-2.md](curl/image/nano-banana-2.md) | Submit a Nano Banana 2 image job with cURL. |
| [curl/image/nano-banana-pro.md](curl/image/nano-banana-pro.md) | Submit a Nano Banana Pro image job with cURL. |
| [curl/image/seedream-4-5.md](curl/image/seedream-4-5.md) | Submit a Seedream 4.5 image job with cURL. |
| [curl/image/seedream-5-0-lite.md](curl/image/seedream-5-0-lite.md) | Submit a Seedream 5.0 Lite image job with cURL. |
| [curl/image/wan-2-7-image.md](curl/image/wan-2-7-image.md) | Submit a Wan 2.7 Image job with cURL. |
| [curl/image/z-image.md](curl/image/z-image.md) | Submit a Z-Image text-to-image job with cURL. |
| [curl/video/seedance-2.md](curl/video/seedance-2.md) | Submit a Seedance 2 video job with cURL. |
| [curl/video/sora-2-official.md](curl/video/sora-2-official.md) | Submit a Sora 2 Official video job with cURL. |
| [curl/video/happy-horse.md](curl/video/happy-horse.md) | Submit a Happy Horse video job with cURL. |
| [curl/video/veo-3-1.md](curl/video/veo-3-1.md) | Submit a Veo 3.1 video job with cURL. |
| [curl/music/generate-music.md](curl/music/generate-music.md) | Submit a Generate Music job with cURL. |
| [curl/music/minimax-music-2-6.md](curl/music/minimax-music-2-6.md) | Submit a MiniMax Music 2.6 job with cURL. |
| [curl/3d/meshy-6-3d.md](curl/3d/meshy-6-3d.md) | Submit a Meshy 6 3D job with cURL. |
| [curl/3d/tripo-h31-3d.md](curl/3d/tripo-h31-3d.md) | Submit a Tripo H3.1 3D job with cURL. |
| [curl/3d/tripo-p1-3d.md](curl/3d/tripo-p1-3d.md) | Submit a Tripo P1 3D job with cURL. |
| [curl/chat/claude-4-6.md](curl/chat/claude-4-6.md) | Send a Claude 4.6 Messages request with cURL. |
| [curl/chat/gemini-3.md](curl/chat/gemini-3.md) | Send a Gemini 3 native request with cURL. |
| [curl/chat/claude-4-5.md](curl/chat/claude-4-5.md) | Send a Claude 4.5 Messages request with cURL. |

## Node runnable examples

These examples show backend integration patterns with native `fetch`. They are not a model-by-model catalog; use the cURL quickstarts above for model-level request shapes.

| Example | What it covers |
| --- | --- |
| [node/gpt-image-2](node/gpt-image-2) | Run a GPT Image 2 job from Node.js with native `fetch`. |
| [node/seedance-2](node/seedance-2) | Run a Seedance 2 job from Node.js with native `fetch`. |
| [node/gemini-3](node/gemini-3) | Send a direct Gemini 3 chat request from Node.js. |
| [node/generate-music](node/generate-music) | Run a Generate Music job from Node.js with native `fetch`. |
| [node/meshy-6-3d](node/meshy-6-3d) | Run a Meshy 6 3D job from Node.js with native `fetch`. |

## Polling and webhooks

| Example | What it covers |
| --- | --- |
| [polling/task-status.md](polling/task-status.md) | Poll `/api/generate/status/{task_id}` until a task finishes. |
| [webhooks/express-webhook](webhooks/express-webhook) | Receive APIDot callbacks with a minimal Express server. |
| [webhooks/nextjs-route-handler.md](webhooks/nextjs-route-handler.md) | Receive APIDot callbacks in a Next.js App Router route handler. |

## Requirements

- APIDot API key.
- Node.js 18 or newer for Node.js and webhook examples.
- `curl` for cURL examples.

## Environment

Create an API key in the [APIDot dashboard](https://apidot.ai/dashboard/api-key), then keep it on the server side.

```bash
cp .env.example .env
```

```bash
APIDOT_API_KEY=YOUR_API_KEY_HERE
# Optional: uncomment only when you have a real public webhook receiver.
# APIDOT_CALLBACK_URL=https://example.com/api/apidot/webhook
# Optional for local webhook demos only. Do not use this in production.
# APIDOT_ALLOW_UNLISTED_TASK_IDS=true
# Optional local allowlist. Use a database lookup in production.
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
- Make webhook idempotency durable. Do not rely only on an in-memory `Map` in production.
- Retry transient failures with backoff, but do not retry invalid payloads unchanged.
- Check the dashboard and current docs for credit behavior, especially for failed or cancelled tasks.

## Links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Models: https://apidot.ai/models
- Support: support@apidot.ai
- License: MIT

## Contributing

Issues and PRs are welcome.
