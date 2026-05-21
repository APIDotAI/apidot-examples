# Seedream 5.0 Lite cURL Quickstart

## What this example shows

This example shows how to submit a Seedream 5.0 Lite image task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes the documented request shapes:

- `seedream-5.0-lite` for prompt-only image generation.
- `seedream-5.0-lite-edit` for reference-guided editing.

## When to use it

Use this example when you need a server-side cURL quickstart for prompt-only image generation or reference-guided Seedream 5.0 Lite edits.

For production apps, store the APIDot task ID and connect it to your own application job record.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- Public reference image URLs when using `seedream-5.0-lite-edit`.

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
    "model": "seedream-5.0-lite",
    "input": {
      "prompt": "A square product campaign image of a reusable water bottle on a clean stone surface, soft daylight, balanced shadows, no extra text",
      "size": "1:1",
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

Use `seedream-5.0-lite-edit` when the request depends on source or reference images:

```json
{
  "model": "seedream-5.0-lite-edit",
  "input": {
    "prompt": "Use the source image as the product reference. Place the item on a simple ecommerce background and preserve the product silhouette.",
    "image_urls": [
      "https://example.com/source-product.png"
    ],
    "size": "2K",
    "n": 1
  }
}
```

Use a custom size when your application needs an explicit canvas:

```json
{
  "model": "seedream-5.0-lite",
  "input": {
    "prompt": "A clean banner image for a developer newsletter, abstract workspace objects, calm lighting, no text",
    "size": {
      "width": 2304,
      "height": 1728
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

- Store `task_id`, model ID, and request variant together.
- Keep APIDot API keys on the server side only.
- Validate `size` and `n` before submitting user-provided values.
- Use edit mode only when you have public reference image URLs.
- Keep edit requests within the documented image and output count limits.
- Do not send unsupported fields copied from another image model.

## Common mistakes

- Sending `input.image_urls` to `seedream-5.0-lite`.
- Using `seedream-5.0-lite-edit` without `input.image_urls`.
- Sending `seed`; the current Seedream 5.0 Lite API rejects it.
- Submitting more total reference and output images than the documented edit limit.
- Dropping the task record before the image reaches `finished` or `failed`.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Seedream 5.0 Lite docs: https://apidot.ai/docs/seedream-5-0-lite
- Image models: https://apidot.ai/models/image
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/seedream-5-0-lite

<!-- devrel:internal
## Promotion

- Topic: Seedream 5.0 Lite generation and reference-guided editing with APIDot
- Audience: Developers building image generation and creative production workflows
- Tweet angle: Show Seedream 5.0 Lite generation and edit variants with clear request limits.
- Landing page: https://apidot.ai/models/seedream-5-0-lite
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
