# Claude 4.6 cURL Quickstart

## What this example shows

This example shows how to send a Claude 4.6 Messages request through APIDot using cURL.

It includes the documented request shapes:

- `claude-sonnet-4-6` for the main Messages request.
- `claude-opus-4-6` as an alternate documented variant.

## When to use it

Use this example when you need a server-side cURL quickstart for a Claude Messages integration through APIDot.

For production apps, send the request from your backend and keep the APIDot API key out of browser code.

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

```bash
export APIDOT_API_KEY="YOUR_API_KEY_HERE"

curl --fail-with-body --request POST \
  --url https://api.apidot.ai/v1/messages \
  --header "x-api-key: $APIDOT_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "temperature": 1,
    "top_p": 1,
    "system": "You are a concise product engineering assistant.",
    "messages": [
      {
        "role": "user",
        "content": "Review this migration plan and list the highest-risk gaps."
      }
    ]
  }'
```

Use `claude-opus-4-6` when your request should call the alternate documented variant:

```json
{
  "model": "claude-opus-4-6",
  "max_tokens": 1024,
  "temperature": 1,
  "top_p": 1,
  "system": "You are a senior architecture assistant.",
  "messages": [
    {
      "role": "user",
      "content": "Analyze this multi-service architecture decision and propose a safer rollout plan."
    }
  ]
}
```

## Expected response

Shortened response:

```json
{
  "id": "msg_example",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-6",
  "content": [
    {
      "type": "text",
      "text": "Here are the highest-risk gaps to review first..."
    }
  ],
  "stop_reason": "end_turn"
}
```

## Production notes

- Keep APIDot API keys in server-side environment variables.
- Set request timeouts in your backend HTTP client.
- Log request IDs, model names, and application context, but never log API keys.
- Store enough request metadata to debug user-visible failures.
- Validate user input before sending it to the model.
- Handle non-2xx responses explicitly instead of assuming every response has assistant text.

## Common mistakes

- Committing a real API key or `.env` file.
- Sending APIDot API keys from browser code.
- Using `Authorization: Bearer` for `/v1/messages` when this endpoint expects `x-api-key`.
- Omitting `max_tokens`.
- Assuming every chat model uses the same request body shape.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Claude 4.6 docs: https://apidot.ai/docs/claude-4-6
- Chat models: https://apidot.ai/models/chat
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/claude-4-6

<!-- devrel:internal
## Promotion

- Topic: Claude 4.6 Messages requests with APIDot
- Audience: Developers building chat, review, and assistant workflows
- Tweet angle: Show a direct Claude 4.6 Messages request through APIDot with server-side key handling.
- Landing page: https://apidot.ai/models/claude-4-6
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
