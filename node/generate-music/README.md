# Generate Music Node.js Example

This example submits a Generate Music task from Node.js and polls until the task reaches a terminal state.

## What this example shows

- Loading `APIDOT_API_KEY` from the environment or the repo-root `.env` file.
- Submitting an async music generation request with native `fetch`.
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

```bash
cd node/generate-music
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
          "file_url": "https://example.com/generated-music.mp3",
          "file_type": "audio"
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
- Avoid logging sensitive prompts, user-provided lyrics, API keys, or private callback URLs.
- Add request timeouts and retry policy in production service code.

## Common mistakes

- Running the script with Node.js older than 18.
- Forgetting to set `APIDOT_API_KEY`.
- Polling continuously without delay.
- Losing the returned `task_id` before the music task reaches a terminal state.
- Mixing simple mode fields with custom mode fields without checking the model docs.

## Related links

- cURL quickstart: [../../curl/music/generate-music.md](../../curl/music/generate-music.md)
- Polling guide: [../../polling/task-status.md](../../polling/task-status.md)
- Webhook examples: [../../webhooks](../../webhooks)
- Generate Music docs: https://apidot.ai/docs/generate-music
- Generate Music landing page: https://apidot.ai/models/generate-music
