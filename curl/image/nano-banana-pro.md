# Nano Banana Pro cURL Quickstart

## What this example shows

This example shows how to submit a Nano Banana Pro image task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes both supported request shapes from the APIDot docs:

- `nano-banana-pro` for prompt-based image generation.
- `nano-banana-pro-edit` for reference-guided image editing.

## When to use it

Use this example when you need a server-side cURL quickstart for high-control product visuals, editorial-style images, or edits that preserve key subject details from a source image.

For production apps, keep the API key server-side and connect the task record to your own user or job ID.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- A public source image URL when using `nano-banana-pro-edit`.

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
    "model": "nano-banana-pro",
    "input": {
      "prompt": "Studio-quality product photography of a premium wireless earbuds case in matte titanium finish with subtle engraving '\''Aether Audio'\'', floating above a reflective black marble surface with dramatic side lighting and soft rim light. Cinematic 85mm lens, shallow depth of field, hyper-realistic textures on metal and silicone tips, commercial advertising style, 4K resolution, clean minimalist background.",
      "resolution": "1K",
      "size": "auto",
      "output_format": "png",
      "enable_web_search": false
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Use `nano-banana-pro-edit` for a reference-guided edit:

```json
{
  "model": "nano-banana-pro-edit",
  "callback_url": "https://example.com/api/apidot/webhook",
  "input": {
    "prompt": "Replace the clothing with a tailored modern fashion look in a luxury editorial style, but preserve the subject's facial identity, hairstyle, skin tone, body proportions, pose, and camera framing. Keep the lighting direction natural and consistent, and make the final image feel like a premium magazine campaign with clean styling and realistic fabric texture.",
    "resolution": "4K",
    "size": "16:9",
    "output_format": "png",
    "enable_web_search": false,
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

- Store `task_id` as soon as the submit request succeeds.
- Keep APIDot keys in backend services and server-side environment variables.
- Treat user prompts and source image URLs as application data that may need privacy controls.
- If `enable_web_search` is enabled in your own variant, review the data and compliance expectations for your product.
- Use retries only for transient network failures, not for unchanged invalid payloads.
- Prefer webhooks when users should receive results after leaving the page.

## Common mistakes

- Shipping the API key in frontend JavaScript.
- Using `nano-banana-pro-edit` without a reachable `image_urls` value.
- Logging raw prompts or private source image URLs in shared logs.
- Retrying a 400 response without fixing the payload.
- Assuming the edit variant and generation variant have identical fields.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Nano Banana Pro docs: https://apidot.ai/docs/nano-banana-pro
- Image models: https://apidot.ai/models/image
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/nano-banana-pro

<!-- devrel:internal
## Promotion

- Topic: Nano Banana Pro image generation and editing with APIDot
- Audience: Developers building premium image generation, product creative, and editorial automation workflows
- Tweet angle: Show a production-safe cURL path for Nano Banana Pro generation, edit mode, and async status polling.
- Landing page: https://apidot.ai/models/nano-banana-pro
- Source status: verified

## Quality review

- Quality score: 38/40
- Promotion candidate: yes
- Blocking issues: none
-->
