# Generate Music cURL Quickstart

## What this example shows

This example shows how to submit a Generate Music task through APIDot, store the returned `task_id`, and poll the shared status endpoint for the result.

It includes the documented request shapes:

- Custom instrumental generation with `custom_mode: true` and `instrumental: true`.
- Simple mode generation with `custom_mode: false`.
- Custom vocal generation with `custom_mode: true` and `instrumental: false`.

## When to use it

Use this example when you need a server-side cURL quickstart for music generation in a product backend, creative tool, or test workflow.

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
    "model": "generate-music",
    "input": {
      "prompt": "A calm and relaxing piano track with soft melodies",
      "style": "Classical",
      "title": "Peaceful Piano Meditation",
      "custom_mode": true,
      "instrumental": true,
      "mv": "V5_5",
      "negative_tags": "Heavy Metal, Upbeat Drums",
      "style_weight": 0.65
    }
  }'
```

Store the returned `data.task_id`, then poll status:

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header "Authorization: Bearer $APIDOT_API_KEY"
```

Simple mode request:

```json
{
  "model": "generate-music",
  "input": {
    "prompt": "An upbeat acoustic pop song about a morning road trip",
    "custom_mode": false,
    "instrumental": false,
    "mv": "V4"
  }
}
```

Custom vocal request:

```json
{
  "model": "generate-music",
  "input": {
    "prompt": "Verse and chorus lyrics about city lights after rain",
    "style": "Indie pop, warm guitars, female vocal, mid tempo",
    "title": "City Lights After Rain",
    "custom_mode": true,
    "instrumental": false,
    "mv": "V5",
    "vocal_gender": "f",
    "style_weight": 0.7,
    "weirdness_constraint": 0.35,
    "audio_weight": 0.5
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
- Poll at a moderate interval and avoid hot loops.
- Treat `finished` and `failed` as terminal states.
- Avoid logging sensitive prompts, user-provided lyrics, API keys, or private callback URLs.

## Common mistakes

- Committing a real API key or `.env` file.
- Sending APIDot API keys from browser code.
- Losing the returned `task_id` before the music task reaches a terminal state.
- Polling continuously without delay.
- Mixing simple mode fields with custom mode fields without checking the model docs.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Generate Music docs: https://apidot.ai/docs/generate-music
- Music models: https://apidot.ai/models/music
- Quickstart: https://apidot.ai/docs/quickstart
- Webhooks: https://apidot.ai/docs/webhooks
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/generate-music

<!-- devrel:internal
## Promotion

- Topic: Generate Music with APIDot
- Audience: Developers building music generation, creative tools, and audio workflows
- Tweet angle: Show Generate Music through the APIDot async task flow: submit, store task_id, then poll or use webhooks.
- Landing page: https://apidot.ai/models/generate-music
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
