# Seedance 2 cURL Quickstart

## What this example shows

This example shows how to submit a Seedance 2 video generation task through APIDot, store the returned `task_id`, and poll the shared status endpoint for the result.

It includes the documented request shapes:

- `seedance-2` for the main video generation request.
- `seedance-2-fast` as an alternate documented variant.

## When to use it

Use this example when you need a server-side cURL quickstart for text-to-video generation in a product backend, prototype, or media workflow.

For production apps, submit the task from your backend, persist `task_id`, and add webhooks after your callback receiver is deployed.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- A backend or terminal environment that does not expose API keys to browser code.

## Environment variables

Use placeholders only. Do not commit real credentials.

```env
APIDOT_API_KEY=YOUR_API_KEY_HERE
```

## How to run

These examples use Bash line continuation. On Windows, run them in Git Bash/WSL or adapt them to `curl.exe` PowerShell syntax.

Add `callback_url` only when you have a real webhook receiver. See the [webhooks docs](https://apidot.ai/docs/webhooks) for the production callback flow.

```bash
export APIDOT_API_KEY="YOUR_API_KEY_HERE"

curl --fail-with-body --request POST \
  --url https://api.apidot.ai/api/generate/submit \
  --header "Authorization: Bearer $APIDOT_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "seedance-2",
    "input": {
      "prompt": "A slow dolly-in on a ceramic cup of espresso, morning light",
      "duration": 5,
      "aspect_ratio": "16:9",
      "resolution": "720p",
      "generate_audio": true
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Use `seedance-2-fast` when you want to call the alternate documented variant:

```json
{
  "model": "seedance-2-fast",
  "input": {
    "prompt": "A handheld close-up of rain on a taxi window in neon city light",
    "duration": 5,
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "generate_audio": true
  }
}
```

## Expected response

Submit response:

```json
{
  "code": 200,
  "data": {
    "task_id": "task-unified-example",
    "status": "not_started",
    "created_time": "2026-04-19T21:19:42"
  }
}
```

Shortened status response:

```json
{
  "code": 200,
  "data": {
    "task_id": "task-unified-example",
    "status": "finished",
    "output": {
      "files": [
        {
          "file_url": "https://example.com/generated-video.mp4",
          "file_type": "video"
        }
      ]
    },
    "error_message": null
  }
}
```

## Production notes

- Store `data.task_id` before polling or waiting for a webhook.
- Keep APIDot API keys on the server side only.
- Poll at a moderate interval and avoid hot loops.
- Treat `finished` and `failed` as terminal states.
- Store selected model, request payload, user ID, and task ID together for support and retries.
- Use `callback_url` only after your webhook receiver can process duplicate callbacks idempotently.

## Common mistakes

- Committing a real API key or `.env` file.
- Calling APIDot directly from browser code.
- Losing the returned `task_id` before the video task reaches a terminal state.
- Polling continuously without delay.
- Assuming every video model accepts the same duration, resolution, or aspect ratio fields.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Seedance 2 docs: https://apidot.ai/docs/seedance-2
- Video models: https://apidot.ai/models/video
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/seedance-2

<!-- devrel:internal
## Promotion

- Topic: Seedance 2 video generation with APIDot
- Audience: Developers building video generation, product media, and creative automation workflows
- Tweet angle: Show Seedance 2 through the APIDot async task flow: submit, store task_id, then poll or use webhooks.
- Landing page: https://apidot.ai/models/seedance-2
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
