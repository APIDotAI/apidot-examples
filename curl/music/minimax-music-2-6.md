# MiniMax Music 2.6 cURL Quickstart

## What this example shows

This example shows how to submit a MiniMax Music 2.6 task through APIDot, store the returned `task_id`, and poll the shared status endpoint for the result.

It uses the documented `minimax-music-2.6` request shape and includes an `audio_setting` object for output format settings.

## When to use it

Use this example when you need a server-side cURL quickstart for generating a music track with an explicit audio output format.

For production apps, submit the task from your backend, persist `task_id`, and add webhooks after your callback receiver is deployed.

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
    "model": "minimax-music-2.6",
    "input": {
      "prompt": "An uplifting indie pop song with female vocals, bright guitars, warm drums, and a clean festival-ready chorus",
      "lyrics_optimizer": true,
      "audio_setting": {
        "sample_rate": 44100,
        "bitrate": 256000,
        "format": "mp3"
      }
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
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
          "file_url": "https://example.com/generated-music.mp3",
          "file_type": "audio"
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
- Validate `audio_setting` in your application before submitting the request.
- Treat `finished` and `failed` as terminal states.
- Avoid logging sensitive prompts, user-provided lyrics, API keys, or private callback URLs.

## Common mistakes

- Committing a real API key or `.env` file.
- Sending APIDot API keys from browser code.
- Losing the returned `task_id` before the music task reaches a terminal state.
- Polling continuously without delay.
- Changing `audio_setting` fields without checking the model docs.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- MiniMax Music 2.6 docs: https://apidot.ai/docs/minimax-music-2-6
- Music models: https://apidot.ai/models/music
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/minimax-music-2-6

<!-- devrel:internal
## Promotion

- Topic: MiniMax Music 2.6 with APIDot
- Audience: Developers building music generation, audio tooling, and creative product workflows
- Tweet angle: Show MiniMax Music 2.6 through the APIDot async task flow with explicit audio output settings.
- Landing page: https://apidot.ai/models/minimax-music-2-6
- Source status: verified

## Quality review

- Quality score: 38/40
- Promotion candidate: yes
- Blocking issues: none
-->
