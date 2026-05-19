# Seedance 2 Node.js Example

This example submits a Seedance 2 video task from Node.js and polls until the task reaches a terminal state.

## What this example shows

- Loading `APIDOT_API_KEY` from the environment or the repo-root `.env` file.
- Submitting an async video generation request with native `fetch`.
- Storing the returned `data.task_id`.
- Polling `/api/generate/status/{task_id}` until the result is `finished` or `failed`.

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

No install step is required for this example; it uses Node.js native `fetch` only.

```bash
cd node/seedance-2
cp ../../.env.example ../../.env
# Edit ../../.env and set APIDOT_API_KEY
npm start
```

The script uses native `fetch`, so Node.js 18 or newer is required.

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
          "file_url": "https://example.com/generated-video.mp4",
          "file_type": "video"
        }
      ]
    }
  }
}
```

## Production notes

- Persist `data.task_id` before polling or waiting for callbacks.
- Keep API keys out of browser code and public repositories.
- Set `APIDOT_CALLBACK_URL` only after your webhook receiver is reachable from the public internet.
- Add request timeouts and retry policy in production service code.
- Avoid logging API keys, private prompts, private media URLs, or callback URLs.

## Common mistakes

- Running the script with Node.js older than 18.
- Forgetting to set `APIDOT_API_KEY`.
- Polling continuously without delay.
- Assuming every task finishes successfully.
- Using this server-side example directly in browser code.

## Related links

- cURL quickstart: [../../curl/video/seedance-2.md](../../curl/video/seedance-2.md)
- Polling guide: [../../polling/task-status.md](../../polling/task-status.md)
- Webhook examples: [../../webhooks](../../webhooks)
- Seedance 2 docs: https://apidot.ai/docs/seedance-2
- Seedance 2 landing page: https://apidot.ai/models/seedance-2
