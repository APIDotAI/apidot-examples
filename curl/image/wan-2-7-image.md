# Wan 2.7 Image cURL Quickstart

## What this example shows

This example shows how to submit a Wan 2.7 Image task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes the documented request shapes:

- `wan-2.7-image` for standard image requests.
- `wan-2.7-image-pro` as a documented alternate model ID.
- A reference-guided request shape using `input.image_urls`.

## When to use it

Use this example when you need a server-side cURL quickstart for Wan 2.7 Image generation or reference-guided image requests.

For production apps, persist the task ID before polling and keep source image URLs reachable long enough for processing.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- Public reference image URLs when using `input.image_urls`.

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
    "model": "wan-2.7-image",
    "input": {
      "prompt": "A clean square product image of a modern desk organizer on a light gray studio surface, soft natural shadow, no text",
      "size": "1024x1024",
      "n": 1
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Use `wan-2.7-image-pro` by changing the model ID and keeping the documented fields:

```json
{
  "model": "wan-2.7-image-pro",
  "input": {
    "prompt": "A portrait campaign image of a compact travel bag on a neutral background, editorial lighting, no brand logos",
    "size": "768x1024",
    "n": 1
  }
}
```

Include `input.image_urls` when the request should be guided by reference images:

```json
{
  "model": "wan-2.7-image",
  "input": {
    "prompt": "Use the first reference as the product source. Keep the product proportions and place it on a clean white ecommerce background.",
    "image_urls": [
      "https://example.com/source-product.png"
    ],
    "size": {
      "width": 1280,
      "height": 720
    },
    "n": 1
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

- Store `data.task_id` before polling or waiting for a webhook.
- Keep APIDot API keys in server-side environment variables.
- Treat `input.image_urls` as the switch between prompt-only and reference-guided requests.
- Validate `size`, `n`, `seed`, and reference image count before submitting.
- Keep reference image URLs public and stable during processing.
- Log task IDs and status transitions, but never log API keys.

## Common mistakes

- Sending more than 4 reference image URLs.
- Assuming `image_urls` is required for prompt-only generation.
- Sending `n` outside the documented range.
- Using a custom size object where your application expected a preset string.
- Retrying invalid payloads unchanged.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Wan 2.7 Image docs: https://apidot.ai/docs/wan-2-7-image
- Image models: https://apidot.ai/models/image
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/wan-2-7-image

<!-- devrel:internal
## Promotion

- Topic: Wan 2.7 Image generation and reference-guided requests with APIDot
- Audience: Developers building product image and creative asset workflows
- Tweet angle: Show how Wan 2.7 Image uses one request shape with optional reference images.
- Landing page: https://apidot.ai/models/wan-2-7-image
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
