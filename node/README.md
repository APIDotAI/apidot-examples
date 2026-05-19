# APIDot Node.js Examples

These examples are runnable backend integration examples for APIDot APIs. They are intentionally small and use Node.js native `fetch` only.

The cURL examples provide model-level request coverage. The Node.js examples focus on production integration patterns:

- Loading API keys from server-side environment variables.
- Submitting async media tasks and polling for completion.
- Sending direct chat requests without async polling.
- Handling non-2xx and API-level errors explicitly.

## Examples

| Example | API shape |
| --- | --- |
| [gpt-image-2](gpt-image-2) | Async image generation: submit, store `task_id`, poll status. |
| [seedance-2](seedance-2) | Async video generation: submit, store `task_id`, poll status. |
| [gemini-3](gemini-3) | Direct Gemini chat request. |
| [generate-music](generate-music) | Async music generation: submit, store `task_id`, poll status. |
| [meshy-6-3d](meshy-6-3d) | Async 3D generation: submit, store `task_id`, poll status. |

## Requirements

- Node.js 18 or newer.
- An APIDot API key stored server-side.
- No install step for these examples; each script uses native `fetch`.

## Environment

Create a repo-root `.env` file or export the variable in your shell:

```env
APIDOT_API_KEY=YOUR_API_KEY_HERE
# Optional for async examples only, after deploying a public webhook receiver.
# APIDOT_CALLBACK_URL=https://example.com/api/apidot/webhook
```

Keep real keys and private callback URLs out of public repositories.

## Choosing an example

Use `gemini-3` when you need the direct chat request shape. Use the other examples when you need the async generation pattern used by image, video, music, and 3D models.
