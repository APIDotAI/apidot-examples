# Meshy 6 3D cURL Quickstart

## What this example shows

This example shows how to submit a Meshy 6 3D task through APIDot, store the returned `task_id`, and poll the shared status endpoint for the generated model file.

It includes the documented request shapes:

- `meshy-6-text-to-3d` for text-to-3D.
- `meshy-6-image-to-3d` for single-image-to-3D.
- `meshy-6-multi-image-to-3d` for multi-image-to-3D.

## When to use it

Use this example when you need a server-side cURL quickstart for generating a 3D asset from a prompt or reference images.

For production apps, submit the task from your backend, persist `task_id`, and add webhooks after your callback receiver is deployed.

## Requirements

- An APIDot account.
- An APIDot API key stored server-side.
- `curl` installed locally.
- Public reference image URLs when using image-to-3D or multi-image-to-3D.

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
    "model": "meshy-6-text-to-3d",
    "input": {
      "prompt": "A worn leather explorer backpack with brass buckles, canvas straps, realistic stitching, game-ready asset",
      "mode": "full",
      "topology": "triangle",
      "target_polycount": 30000,
      "should_remesh": true,
      "symmetry_mode": "auto",
      "enable_pbr": true,
      "enable_prompt_expansion": true,
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

Image-to-3D request:

```json
{
  "model": "meshy-6-image-to-3d",
  "input": {
    "image_urls": [
      "https://example.com/object-front.png"
    ],
    "topology": "triangle",
    "target_polycount": 30000,
    "should_texture": true,
    "enable_pbr": true,
    "enable_safety_checker": true
  }
}
```

Multi-image-to-3D request:

```json
{
  "model": "meshy-6-multi-image-to-3d",
  "input": {
    "image_urls": [
      "https://example.com/object-front.png",
      "https://example.com/object-side.png"
    ],
    "topology": "triangle",
    "target_polycount": 30000,
    "should_texture": true,
    "enable_pbr": true,
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
          "file_url": "https://example.com/generated-model.glb",
          "file_type": "model"
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
- Store selected model, request payload, user ID, and task ID together for support and retries.
- Keep reference image URLs reachable long enough for processing.
- Validate image URL count and request shape before submission.
- Avoid logging private media URLs, API keys, or sensitive prompt text.

## Common mistakes

- Committing a real API key or `.env` file.
- Sending APIDot API keys from browser code.
- Using private or expired reference image URLs.
- Polling continuously without delay.
- Assuming text-to-3D and image-to-3D accept the same input fields.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Meshy 6 3D docs: https://apidot.ai/docs/meshy-6-3d
- 3D models: https://apidot.ai/models/3d
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/meshy-6-3d

<!-- devrel:internal
## Promotion

- Topic: Meshy 6 3D generation with APIDot
- Audience: Developers building text-to-3D, image-to-3D, and asset generation workflows
- Tweet angle: Show Meshy 6 3D through the APIDot async task flow: submit, store task_id, then poll or use webhooks.
- Landing page: https://apidot.ai/models/meshy-6-3d
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
