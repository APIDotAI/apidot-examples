# Veo 3.1 cURL Quickstart

## What this example shows

This example shows how to submit a Veo 3.1 video task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes documented variants for standard prompt-based generation, frame-based generation, reference-based generation, and quality-mode generation.

## When to use it

Use this example when you need a server-side cURL quickstart for a Veo 3.1 video workflow that may start from a prompt, frame images, or reference images.

For production apps, keep the API key server-side and persist the returned task ID before polling or waiting for a webhook.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- Public image URLs when using frame or reference variants.

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
    "model": "veo3.1-lite",
    "input": {
      "prompt": "A miniature city waking up at sunrise, cinematic light, smooth camera motion",
      "duration": 8,
      "aspect_ratio": "16:9",
      "resolution": "720p"
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Other documented variants:

```json
{
  "model": "veo3.1-fast",
  "input": {
    "prompt": "Dolphins jumping in a bright blue ocean with native ambient sound",
    "duration": 8,
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }
}
```

```json
{
  "model": "veo3.1-fast",
  "input": {
    "prompt": "Animate the subject from the first frame into a smooth final pose",
    "duration": 8,
    "aspect_ratio": "16:9",
    "resolution": "1080p",
    "generate_type": "frame",
    "image_urls": [
      "https://example.com/first-frame.webp",
      "https://example.com/last-frame.webp"
    ]
  }
}
```

```json
{
  "model": "veo3.1-fast",
  "input": {
    "prompt": "Create a dynamic product scene using the supplied visual references",
    "duration": 8,
    "aspect_ratio": "16:9",
    "resolution": "1080p",
    "generate_type": "reference",
    "image_urls": [
      "https://example.com/reference-1.webp",
      "https://example.com/reference-2.webp",
      "https://example.com/reference-3.webp"
    ]
  }
}
```

```json
{
  "model": "veo3.1-quality",
  "input": {
    "prompt": "A premium cinematic landscape reveal with natural camera motion and native ambience",
    "duration": 8,
    "aspect_ratio": "16:9",
    "resolution": "4k"
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

- Store `task_id`, selected variant, request payload, and user job ID together.
- Keep APIDot API keys out of frontend code.
- Keep frame and reference image URLs reachable long enough for processing.
- Validate image URL count and request shape before submission.
- Use polling for tests and webhooks for production queues.
- Avoid logging private media URLs or sensitive prompt text.

## Common mistakes

- Sending frame or reference fields without setting the matching `generate_type`.
- Using private or short-lived image URLs.
- Assuming every Veo 3.1 variant accepts the same fields.
- Polling without delay.
- Treating `not_started` or `running` as a failed task.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Veo 3.1 docs: https://apidot.ai/docs/veo-3-1
- Video models: https://apidot.ai/models/video
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/veo-3-1

<!-- devrel:internal
## Promotion

- Topic: Veo 3.1 video generation with APIDot
- Audience: Developers building prompt-based, frame-based, or reference-based video workflows
- Tweet angle: Show Veo 3.1 variants through one APIDot async request pattern.
- Landing page: https://apidot.ai/models/veo-3-1
- Source status: verified

## Quality review

- Quality score: 38/40
- Promotion candidate: yes
- Blocking issues: none
-->
