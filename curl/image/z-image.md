# Z-Image cURL Quickstart

## What this example shows

This example shows how to submit a Z-Image text-to-image task through APIDot, store the returned `task_id`, and poll the shared status endpoint for completion.

It includes the documented request shape for `z-image`, including `input.prompt`, `input.size`, and the optional `input.enable_safety_checker` boolean.

## When to use it

Use this example when you need a server-side cURL quickstart for prompt-only Z-Image generation through APIDot.

For production apps, submit the task from your backend and validate user-provided prompt and size values before sending them to APIDot.

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
    "model": "z-image",
    "input": {
      "prompt": "A square illustration of a quiet developer desk with a laptop, notebook, and soft daylight, clean composition, no text",
      "size": "1:1",
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

Use another documented aspect ratio by changing `input.size`:

```json
{
  "model": "z-image",
  "input": {
    "prompt": "A wide banner illustration of clean workspace objects on a neutral background, no text",
    "size": "16:9",
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
- Validate prompt length and supported size values before submitting.
- Send `input.enable_safety_checker` as a boolean when you include it.
- Do not copy reference-image fields from another image model; Z-Image is documented here as prompt-only.
- Poll at a moderate interval and avoid hot loops.

## Common mistakes

- Sending `image_urls` or edit-only fields copied from another image model.
- Omitting the required `input.size`.
- Sending a prompt that is too short or too long for the documented range.
- Sending `enable_safety_checker` as a string instead of a boolean.
- Calling APIDot directly from browser code with an API key.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Z-Image docs: https://apidot.ai/docs/z-image
- Image models: https://apidot.ai/models/image
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/z-image

<!-- devrel:internal
## Promotion

- Topic: Z-Image prompt-only generation with APIDot
- Audience: Developers adding text-to-image generation through APIDot
- Tweet angle: Show the minimal Z-Image request shape and the shared async task workflow.
- Landing page: https://apidot.ai/models/z-image
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
