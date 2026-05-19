# Gemini 3 Node.js Example

This example sends a direct Gemini 3 chat request from Node.js through APIDot.

## What this example shows

- Loading `APIDOT_API_KEY` from the environment or the repo-root `.env` file.
- Calling the Gemini Native endpoint with the model ID in the URL path.
- Handling non-2xx and API-level errors explicitly.
- Printing the response JSON.

## Requirements

- Node.js 18 or newer.
- An APIDot API key stored server-side.
- No npm dependencies are required.

## Environment variables

Use placeholders only. Do not commit real credentials.

```env
APIDOT_API_KEY=YOUR_API_KEY_HERE
```

## How to run

```bash
cd node/gemini-3
cp ../../.env.example ../../.env
# Edit ../../.env and set APIDOT_API_KEY
npm start
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
- Log model names and application context, but never log API keys.
- Validate user input before sending it to the model.

## Common mistakes

- Committing a real API key or `.env` file.
- Sending APIDot API keys from browser code.
- Putting the Gemini model ID in the body instead of the URL path.
- Adding async `task_id` polling to this direct chat request.
- Assuming every response contains at least one candidate.

## Related links

- cURL quickstart: [../../curl/chat/gemini-3.md](../../curl/chat/gemini-3.md)
- Gemini 3 docs: https://apidot.ai/docs/gemini-3
- Chat models: https://apidot.ai/models/chat
- Gemini 3 landing page: https://apidot.ai/models/gemini-3
