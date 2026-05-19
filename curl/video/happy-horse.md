# Happy Horse cURL Quickstart

## What this example shows

This example shows how to submit a Happy Horse video task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes the documented request shapes:

- Text-to-video with `happy-horse`.
- Image-to-video with `image_urls`.
- Reference-to-video with `reference_image_urls`.
- Video edit with `video_url`.

## When to use it

Use this example when you need a server-side cURL quickstart for a video workflow that may start from text, images, visual references, or an existing video.

For production apps, treat every submitted request as an asynchronous job and persist the APIDot task ID.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- Public media URLs for image-to-video, reference-to-video, or video-edit requests.

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
    "model": "happy-horse",
    "input": {
      "prompt": "A compact electric city bike gliding through a bright morning street market, smooth tracking shot, realistic reflections, lively background motion",
      "duration": 5,
      "aspect_ratio": "16:9",
      "resolution": "1080p",
      "seed": 12345,
      "enable_safety_checker": true
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Image-to-video request:

```json
{
  "model": "happy-horse",
  "input": {
    "image_urls": [
      "https://example.com/source-image.webp"
    ],
    "prompt": "Animate this product photo with a slow push-in and subtle studio reflections",
    "duration": 5,
    "resolution": "1080p",
    "seed": 12345,
    "enable_safety_checker": true
  }
}
```

Reference-to-video request:

```json
{
  "model": "happy-horse",
  "input": {
    "prompt": "character1 hands a glowing map to character2 in a neon train station, cinematic close-up then wide shot",
    "reference_image_urls": [
      "https://example.com/character-1.webp",
      "https://example.com/character-2.webp"
    ],
    "duration": 6,
    "aspect_ratio": "16:9",
    "resolution": "1080p",
    "seed": 12345,
    "enable_safety_checker": true
  }
}
```

Video edit request:

```json
{
  "model": "happy-horse",
  "input": {
    "video_url": "https://example.com/source-video.mp4",
    "prompt": "Replace the background with a clean futuristic showroom while preserving the camera motion and product shape",
    "reference_image_urls": [
      "https://example.com/showroom-reference.webp"
    ],
    "resolution": "1080p",
    "audio_setting": "auto",
    "seed": 12345,
    "enable_safety_checker": true
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

- Store `task_id`, selected request shape, and source media URLs with your application job.
- Keep API keys server-side.
- Make sure source image and video URLs are reachable long enough for processing.
- Validate user-provided media URLs before submitting them.
- Poll at a moderate interval for tests; use webhooks for durable production callbacks.
- Do not log private media URLs, API keys, or sensitive prompt text.

## Common mistakes

- Using private or expired source media URLs.
- Sending `video_url` when your workflow expects image-to-video fields.
- Logging user-provided prompts or private source URLs.
- Retrying a 400 response without changing the payload.
- Treating video generation as a synchronous request.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Happy Horse docs: https://apidot.ai/docs/happy-horse
- Video models: https://apidot.ai/models/video
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/happy-horse

<!-- devrel:internal
## Promotion

- Topic: Happy Horse video workflows with APIDot
- Audience: Developers building text-to-video, image-to-video, reference-video, and video-edit workflows
- Tweet angle: Show the request shapes developers need when a video job starts from text, images, references, or a source clip.
- Landing page: https://apidot.ai/models/happy-horse
- Source status: verified

## Quality review

- Quality score: 38/40
- Promotion candidate: yes
- Blocking issues: none
-->
