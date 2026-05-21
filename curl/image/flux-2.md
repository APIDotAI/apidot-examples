# FLUX.2 cURL Quickstart

## What this example shows

This example shows how to submit a FLUX.2 image task through APIDot, store the returned `task_id`, and poll the shared status endpoint for the result.

It includes the documented request shapes:

- `flux-2-pro` for text-to-image generation.
- `flux-2-pro-edit` for reference-image editing.
- `flux-2-flex` and `flux-2-flex-edit` as documented alternate variants.

## When to use it

Use this example when you need a server-side cURL quickstart for FLUX.2 generation or reference-guided image edits.

For production apps, submit the task from your backend, persist `task_id`, and keep the selected model variant with your application job record.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- Public reference image URLs when using an edit variant.

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
    "model": "flux-2-pro",
    "input": {
      "prompt": "A clean product image of a compact desk lamp on a neutral studio background, soft shadows, balanced composition, no extra text",
      "size": "1:1",
      "resolution": "1K"
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Use `flux-2-pro-edit` when the request depends on reference images:

```json
{
  "model": "flux-2-pro-edit",
  "input": {
    "prompt": "Use the reference image as the product source. Place it on a clean studio background and preserve the product shape.",
    "image_urls": [
      "https://example.com/source-product.png"
    ],
    "size": "auto",
    "resolution": "1K"
  }
}
```

Use a flex variant by changing the model ID and keeping the same documented fields:

```json
{
  "model": "flux-2-flex",
  "input": {
    "prompt": "A square editorial still life with a notebook, fountain pen, and a small glass vase on a walnut desk",
    "size": "1:1",
    "resolution": "2K"
  }
}
```

```json
{
  "model": "flux-2-flex-edit",
  "input": {
    "prompt": "Follow the first reference image for layout and update the color palette to cool blue and white.",
    "image_urls": [
      "https://example.com/layout-reference.png"
    ],
    "size": "auto",
    "resolution": "2K"
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
- Keep APIDot API keys on the server side only.
- Store the model variant with your job record so retries use the same request shape.
- Use edit variants only when `input.image_urls` is required by the prompt.
- Validate `size`, `resolution`, and reference image count before submitting.
- Never log API keys or private reference image URLs.

## Common mistakes

- Sending `input.image_urls` to `flux-2-pro` or `flux-2-flex`.
- Using an edit variant without `input.image_urls`.
- Sending more than 8 reference image URLs to an edit variant.
- Omitting the required `input.size` or `input.resolution` fields.
- Losing the returned `task_id` before the image reaches a terminal state.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- FLUX.2 docs: https://apidot.ai/docs/flux-2
- Image models: https://apidot.ai/models/image
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/flux-2

<!-- devrel:internal
## Promotion

- Topic: FLUX.2 generation and reference-image editing with APIDot
- Audience: Developers building image generation and editing workflows
- Tweet angle: Show how FLUX.2 separates text variants from edit variants while using the same async task workflow.
- Landing page: https://apidot.ai/models/flux-2
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
