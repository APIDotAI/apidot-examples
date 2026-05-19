# Sora 2 Official cURL Quickstart

## What this example shows

This example shows how to submit a Sora 2 Official video generation task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes the documented request shapes:

- `sora-2-official` for prompt-based video generation.
- `sora-2-pro-official` for an image-guided request with a reference image URL.

## When to use it

Use this example when you need a server-side cURL quickstart for cinematic prompt-based video generation or an image-guided video request.

For production apps, keep the API key server-side and connect APIDot task IDs to your own job records.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- A public reference image URL when using the image-guided variant.

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
    "model": "sora-2-official",
    "input": {
      "prompt": "A cinematic tracking shot of a compact electric car driving through neon-lit rain, realistic reflections, slow camera push, dramatic product commercial style.",
      "duration": 8,
      "aspect_ratio": "16:9"
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Use `sora-2-pro-official` when the request includes a reference image:

```json
{
  "model": "sora-2-pro-official",
  "input": {
    "prompt": "Animate the product from the reference image as a premium launch teaser, slow dolly-in, clean studio lighting, realistic reflections, polished campaign video.",
    "duration": 8,
    "aspect_ratio": "auto",
    "resolution": "1024p",
    "image_urls": [
      "https://example.com/product-reference.webp"
    ]
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

- Store `task_id`, model, and request payload together.
- Keep APIDot API keys in server-side environment variables.
- Keep reference image URLs reachable long enough for processing.
- Poll at a moderate interval for test workflows.
- Use webhooks for production flows where users may leave the page before the video is ready.
- Avoid logging prompts or source image URLs that may contain private user data.

## Common mistakes

- Sending API keys from browser code.
- Using the image-guided variant without `input.image_urls`.
- Passing temporary signed image URLs that expire too quickly.
- Retrying invalid payloads unchanged.
- Dropping the APIDot `task_id` before the final status is known.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Sora 2 Official docs: https://apidot.ai/docs/sora-2-official
- Video models: https://apidot.ai/models/video
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/sora-2-official

<!-- devrel:internal
## Promotion

- Topic: Sora 2 Official video generation with APIDot
- Audience: Developers adding prompt-based or image-guided video generation to apps
- Tweet angle: Show Sora 2 Official using the same APIDot async flow as other media models.
- Landing page: https://apidot.ai/models/sora-2-official
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
