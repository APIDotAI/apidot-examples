# Gemini 3 cURL Quickstart

## What this example shows

This example shows how to send a native Gemini 3 request through APIDot using cURL.

It includes the documented request shapes:

- `gemini-3-flash-preview` as the main path model.
- `gemini-3-pro-preview` as an alternate documented path model.

## When to use it

Use this example when you need a server-side cURL quickstart for a Gemini Native request through APIDot.

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
  --url https://api.apidot.ai/v1beta/models/gemini-3-flash-preview:generateContent \
  --header "Authorization: Bearer $APIDOT_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "Write a concise launch checklist for a developer API that supports native Gemini requests."
          }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        {
          "text": "You are a concise technical assistant."
        }
      ]
    },
    "generationConfig": {
      "temperature": 1,
      "maxOutputTokens": 1024,
      "topP": 0.95,
      "topK": 40
    }
  }'
```

Use `gemini-3-pro-preview` by changing the model in the path and request intent:

```http
POST https://api.apidot.ai/v1beta/models/gemini-3-pro-preview:generateContent
```

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Review this API integration plan and identify the highest-risk missing checks before production launch."
        }
      ]
    }
  ],
  "systemInstruction": {
    "parts": [
      {
        "text": "You are a senior API integration reviewer. Be specific and concise."
      }
    ]
  },
  "generationConfig": {
    "temperature": 0.8,
    "maxOutputTokens": 2048,
    "topP": 0.95,
    "topK": 40
  }
}
```

## Expected response

Shortened response:

```json
{
  "candidates": [
    {
      "content": {
        "role": "model",
        "parts": [
          {
            "text": "Here is a concise launch checklist..."
          }
        ]
      },
      "finishReason": "STOP"
    }
  ]
}
```

## Production notes

- Keep APIDot API keys in server-side environment variables.
- Put the Gemini model ID in the URL path.
- Set request timeouts in your backend HTTP client.
- Log request IDs, model names, and application context, but never log API keys.
- Validate user input before sending it to the model.
- Handle non-2xx responses explicitly instead of assuming every response has candidates.

## Common mistakes

- Committing a real API key or `.env` file.
- Sending APIDot API keys from browser code.
- Putting the Gemini model ID in the body instead of the URL path.
- Mixing Claude Messages fields with Gemini Native request fields.
- Assuming every response contains at least one candidate.

## Related links

- Website: https://apidot.ai
- Docs: https://apidot.ai/docs
- Gemini 3 docs: https://apidot.ai/docs/gemini-3
- Chat models: https://apidot.ai/models/chat
- GitHub: https://github.com/APIDotAI
- Examples: https://github.com/APIDotAI/apidot-examples
- Related landing page: https://apidot.ai/models/gemini-3

<!-- devrel:internal
## Promotion

- Topic: Gemini 3 Native requests with APIDot
- Audience: Developers building chat, review, and Gemini-native workflows
- Tweet angle: Show a direct Gemini 3 native request through APIDot with the model in the URL path.
- Landing page: https://apidot.ai/models/gemini-3
- Source status: verified

## Quality review

- Quality score: 39/40
- Promotion candidate: yes
- Blocking issues: none
-->
