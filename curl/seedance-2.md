# Seedance 2 cURL Quickstart

This example submits a Seedance 2 video job through APIDot's unified async generation endpoint.

## Prerequisites

- An APIDot API key stored server-side.
- `curl` installed locally.

## Submit a video job

Replace `YOUR_APIDOT_API_KEY` with your server-side key before running the command.
These examples use Bash line continuation. On Windows, run them in Git Bash/WSL or adapt them to `curl.exe` PowerShell syntax.
The `--fail-with-body` flag makes API errors visible; remove it if your local `curl` does not support it.

```bash
curl --fail-with-body --request POST \
  --url https://api.apidot.ai/api/generate/submit \
  --header 'Authorization: Bearer YOUR_APIDOT_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "seedance-2",
    "input": {
      "prompt": "A slow dolly-in on a ceramic cup of espresso, morning light, cinematic realism",
      "duration": 5,
      "aspect_ratio": "16:9",
      "resolution": "720p",
      "generate_audio": true
    }
  }'
```

## Expected submit response

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

Store `data.task_id` immediately. Video generation is asynchronous, so your backend should poll status or wait for the webhook callback.

## Optional webhook

Add `callback_url` only when you have a real public webhook receiver. The full submit payload looks like this:

```json
{
  "model": "seedance-2",
  "callback_url": "https://example.com/api/apidot/webhook",
  "input": {
    "prompt": "A slow dolly-in on a ceramic cup of espresso, morning light, cinematic realism",
    "duration": 5,
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "generate_audio": true
  }
}
```

## Poll the result

Replace `task-unified-example` with the real `data.task_id` from your submit response.

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header 'Authorization: Bearer YOUR_APIDOT_API_KEY'
```

Terminal statuses include `finished` and `failed`. Successful video jobs return generated file URLs in the status response.

## Fast variant

Use `seedance-2-fast` for lower-latency iteration. It uses the same endpoint and request shape.

```json
{
  "model": "seedance-2-fast",
  "callback_url": "https://example.com/api/apidot/webhook",
  "input": {
    "prompt": "A handheld close-up of rain on a taxi window in neon city light",
    "duration": 5,
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "generate_audio": true
  }
}
```
