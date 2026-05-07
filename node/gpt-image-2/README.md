# GPT Image 2 Node.js Example

This example submits a GPT Image 2 job and polls until the task reaches a terminal state.

## Run

```bash
cd node/gpt-image-2
cp ../../.env.example ../../.env
# Edit ../../.env and set APIDOT_API_KEY
npm start
```

The script uses native `fetch`, so Node.js 18 or newer is required.

## Safety

Do not commit `.env`. Keep real API keys and production callback URLs out of public repositories.
