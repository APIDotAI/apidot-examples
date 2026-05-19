# Poll Task Status

APIDot media generation is asynchronous. Submit requests return a `task_id` quickly, then your backend can poll the shared status endpoint until the task reaches a terminal state.

## Endpoint

```http
GET https://api.apidot.ai/api/generate/status/{task_id}
Authorization: Bearer <APIDOT_API_KEY>
```

## cURL

Replace `task-unified-example` with the real `data.task_id` from your submit response.
The `--fail-with-body` flag makes API errors visible; remove it if your local `curl` does not support it.

```bash
curl --fail-with-body --request GET \
  --url https://api.apidot.ai/api/generate/status/task-unified-example \
  --header 'Authorization: Bearer YOUR_API_KEY_HERE'
```

## Node.js polling helper

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pollTask({ taskId, apiKey, baseUrl = "https://api.apidot.ai" }) {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    const response = await fetch(`${baseUrl}/api/generate/status/${taskId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const result = await response.json();
    const status = result.data?.status;

    if (status === "finished" || status === "failed") {
      return result;
    }

    await sleep(10000);
  }

  throw new Error(`Timed out waiting for task ${taskId}`);
}
```

## Production notes

- Persist `task_id` before polling.
- Use exponential backoff or a moderate fixed interval. Avoid hot-loop polling.
- Treat `failed` as terminal and surface the error to your application logs.
- Use webhooks for high-volume production workflows.
