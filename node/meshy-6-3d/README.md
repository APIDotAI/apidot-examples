# Meshy 6 3D Node.js Example

This example submits a Meshy 6 text-to-3D task from Node.js and polls until the generated model file is ready.

## What this example shows

- Loading `APIDOT_API_KEY` from the environment or the repo-root `.env` file.
- Submitting an async 3D generation request with native `fetch`.
- Storing the returned `data.task_id`.
- Polling `/api/generate/status/{task_id}` until the result is `finished` or `failed`.
- Reading the generated model file URL from the final response.

## Requirements

- Node.js 18 or newer.
- An APIDot API key stored server-side.
- No npm dependencies are required.

## Environment variables

Use placeholders only. Do not commit real credentials.

```env
APIDOT_API_KEY=YOUR_API_KEY_HERE
# Optional: only set this when you have a real public webhook receiver.
# APIDOT_CALLBACK_URL=https://example.com/api/apidot/webhook
```

## How to run

```bash
cd node/meshy-6-3d
cp ../../.env.example ../../.env
# Edit ../../.env and set APIDOT_API_KEY
npm start
```

## Expected response

The script prints each polling attempt and then the final shortened task response:

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
    }
  }
}
```

## Production notes

- Persist `data.task_id` before polling or waiting for callbacks.
- Keep API keys out of browser code and public repositories.
- Store selected model, request payload, user ID, and task ID together for support and retries.
- Keep reference image URLs reachable long enough when using image-to-3D variants.
- Avoid logging private media URLs, API keys, or sensitive prompt text.

## Common mistakes

- Running the script with Node.js older than 18.
- Forgetting to set `APIDOT_API_KEY`.
- Polling continuously without delay.
- Assuming text-to-3D and image-to-3D accept the same input fields.
- Treating generated asset URLs as permanent without checking your storage policy.

## Related links

- cURL quickstart: [../../curl/3d/meshy-6-3d.md](../../curl/3d/meshy-6-3d.md)
- Polling guide: [../../polling/task-status.md](../../polling/task-status.md)
- Webhook examples: [../../webhooks](../../webhooks)
- Meshy 6 3D docs: https://apidot.ai/docs/meshy-6-3d
- Meshy 6 3D landing page: https://apidot.ai/models/meshy-6-3d
