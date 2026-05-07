# GPT Image 2 cURL Quickstart

This example submits a GPT Image 2 text-to-image job through APIDot's unified async generation endpoint.

## Prerequisites

- An APIDot API key stored server-side.
- `curl` installed locally.

## Submit a text-to-image job

Replace `YOUR_APIDOT_API_KEY` with your server-side key before running the command.
These examples use Bash line continuation. On Windows, run them in Git Bash/WSL or adapt them to `curl.exe` PowerShell syntax.

```bash
curl --request POST \
  --url https://api.apidot.ai/api/generate/submit \
  --header 'Authorization: Bearer YOUR_APIDOT_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "model": "gpt-image-2",
    "input": {
      "prompt": "A premium product photo of a silver espresso machine on a clean white studio background, realistic lighting, high detail",
      "quality": "low",
      "size": "1:1",
      "resolution": "1K"
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

Store `data.task_id` immediately. You will need it for polling, webhook reconciliation, retries, and customer-facing status pages.

## Optional webhook

Add `callback_url` only when you have a real public webhook receiver. The full submit payload looks like this:

```json
{
  "model": "gpt-image-2",
  "callback_url": "https://example.com/api/apidot/webhook",
  "input": {
    "prompt": "A premium product photo of a silver espresso machine on a clean white studio background, realistic lighting, high detail",
    "quality": "low",
    "size": "1:1",
    "resolution": "1K"
  }
}
```

## Poll the result

```bash
curl --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header 'Authorization: Bearer YOUR_APIDOT_API_KEY'
```

Terminal statuses include `finished` and `failed`. Successful image jobs return generated file URLs in the status response.

## Edit variant

Use `gpt-image-2-edit` when the request includes reference image URLs.

```json
{
  "model": "gpt-image-2-edit",
  "callback_url": "https://example.com/api/apidot/webhook",
  "input": {
    "prompt": "Replace the background with a clean white studio backdrop and add a soft natural shadow",
    "quality": "high",
    "size": "2304x2048",
    "resolution": "2K",
    "image_urls": [
      "https://example.com/source-image.png"
    ]
  }
}
```
