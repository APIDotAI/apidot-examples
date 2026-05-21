# Flux Kontext cURL Quickstart

## What this example shows

This example shows how to submit a Flux Kontext image task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes the documented request shapes:

- `flux-kontext-pro` for text-to-image generation.
- `flux-kontext-pro-edit` for single-source image editing.
- `flux-kontext-max` and `flux-kontext-max-edit` as documented alternate variants.

## When to use it

Use this example when you need a server-side cURL quickstart for Flux Kontext generation or edits that depend on one source image.

For production apps, send the request from your backend and keep the APIDot API key out of browser code.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- A public source image URL when using an edit variant.

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
    "model": "flux-kontext-pro",
    "input": {
      "prompt": "A 16:9 homepage hero image showing a clean developer workspace, minimal desk, soft natural light, no visible brand logos",
      "size": "16:9",
      "output_format": "png"
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Use `flux-kontext-pro-edit` when the edit depends on one source image:

```json
{
  "model": "flux-kontext-pro-edit",
  "input": {
    "prompt": "Keep the subject from the source image unchanged. Replace the background with a bright studio setup and preserve realistic shadows.",
    "image_urls": [
      "https://example.com/source-image.png"
    ],
    "size": "16:9",
    "output_format": "png"
  }
}
```

Use a max variant by changing the model ID and keeping the documented fields:

```json
{
  "model": "flux-kontext-max",
  "input": {
    "prompt": "A clean magazine-style still life of a wireless keyboard, notebook, and coffee cup on a white desk",
    "size": "4:3",
    "output_format": "jpg"
  }
}
```

```json
{
  "model": "flux-kontext-max-edit",
  "input": {
    "prompt": "Use the source image as the layout. Change the lighting to a soft morning scene and keep the subject placement stable.",
    "image_urls": [
      "https://example.com/source-layout.png"
    ],
    "size": "4:3",
    "output_format": "png"
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
- Keep APIDot API keys in server-side environment variables.
- Use exactly one source image URL with edit variants.
- Validate `size` and `output_format` before submitting user-provided settings.
- Poll at a moderate interval and stop on terminal states.
- Never log API keys or private source image URLs.

## Common mistakes

- Sending multiple source images to a Flux Kontext edit variant.
- Sending `image_urls` to `flux-kontext-pro` or `flux-kontext-max`.
- Using an edit variant without `input.image_urls`.
- Sending an unsupported aspect ratio or output format.
- Retrying invalid edit payloads unchanged.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Flux Kontext docs: https://apidot.ai/docs/flux-kontext
- Image models: https://apidot.ai/models/image
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/flux-kontext

<!-- devrel:internal
## Promotion

- Topic: Flux Kontext generation and single-source image editing with APIDot
- Audience: Developers building product image editing and creative tooling
- Tweet angle: Show the direct difference between Flux Kontext text and edit request shapes.
- Landing page: https://apidot.ai/models/flux-kontext
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
