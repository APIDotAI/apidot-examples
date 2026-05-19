# Nano Banana 2 cURL Quickstart

## What this example shows

This example shows how to submit a Nano Banana 2 image task through APIDot, store the returned `task_id`, and poll the shared status endpoint for the generated file.

It includes both supported request shapes from the APIDot docs:

- `nano-banana-2` for image generation.
- `nano-banana-2-edit` for image editing with reference image URLs.

## When to use it

Use this example when you need a server-side cURL quickstart for product images, prompt-based image generation, or guided image edits that keep the input image as a reference.

For production apps, submit from your backend and store the task record before returning control to the user.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- A public reference image URL when using `nano-banana-2-edit`.

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
    "model": "nano-banana-2",
    "input": {
      "prompt": "Studio product image of a compact travel camera on a brushed aluminum desk with clear engraved text '\''LUMA 42'\'', soft morning window light, realistic black glass lens, clean editorial composition, subtle shadows, high detail, commercial product photography.",
      "resolution": "1K",
      "size": "auto",
      "output_format": "png",
      "google_search": false
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Use `nano-banana-2-edit` when the request depends on a source image:

```json
{
  "model": "nano-banana-2-edit",
  "callback_url": "https://example.com/api/apidot/webhook",
  "input": {
    "prompt": "Keep the product shape and logo placement, replace the background with a bright kitchen counter scene, add natural daylight reflections, and make the image look like a clean ecommerce hero shot.",
    "resolution": "4K",
    "size": "16:9",
    "output_format": "webp",
    "google_search": false,
    "image_urls": [
      "https://example.com/source-image.png"
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
          "file_url": "https://example.com/generated-image.png",
          "file_type": "image"
        }
      ]
    },
    "error_message": null
  }
}
```

## Production notes

- Keep API keys in server-side environment variables.
- Persist `task_id` and the model name together so support and retries can reconstruct the request path.
- Use a moderate polling interval for tests and low-volume test tools.
- Use webhook callbacks for high-volume production flows.
- Validate user-provided reference image URLs before submitting edit requests.
- Never log API keys, source image URLs that contain private tokens, or sensitive prompts.

## Common mistakes

- Committing a real API key or `.env` file.
- Using edit mode without `input.image_urls`.
- Passing temporary signed image URLs that expire before the generation service can fetch them.
- Polling continuously without delay.
- Assuming every image model accepts the same input fields.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Nano Banana 2 docs: https://apidot.ai/docs/nano-banana-2
- Image models: https://apidot.ai/models/image
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/nano-banana-2

<!-- devrel:internal
## Promotion

- Topic: Nano Banana 2 image generation and editing with APIDot
- Audience: Developers building product image, design, and creative automation workflows
- Tweet angle: Show how Nano Banana 2 generation and edit variants share the same APIDot async task flow.
- Landing page: https://apidot.ai/models/nano-banana-2
- Source status: verified

## Quality review

- Quality score: 38/40
- Promotion candidate: yes
- Blocking issues: none
-->
