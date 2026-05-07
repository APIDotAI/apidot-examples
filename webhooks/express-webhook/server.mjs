import express from "express";

const app = express();
const port = Number(process.env.PORT || 3000);
const reconcileTimeoutMs = Math.max(
  1000,
  Number(process.env.APIDOT_RECONCILE_TIMEOUT_MS || 5000) || 5000,
);

app.use(express.json({ limit: "2mb" }));

const lastStatusByTaskId = new Map();
const submittedTaskIds = new Set(
  (process.env.APIDOT_KNOWN_TASK_IDS || "")
    .split(",")
    .map((taskId) => taskId.trim())
    .filter(Boolean),
);

async function isKnownTaskId(taskId) {
  // If APIDOT_KNOWN_TASK_IDS is unset, this demo accepts any task id so
  // real webhook tests are not dropped. Use a database lookup in production.
  return submittedTaskIds.size === 0 || submittedTaskIds.has(taskId);
}

function createTimeoutSignal(timeoutMs) {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

async function reconcileTaskStatus(taskId, { timeoutMs = 5000 } = {}) {
  const apiKey = process.env.APIDOT_API_KEY;
  const baseUrl = process.env.APIDOT_BASE_URL || "https://api.apidot.ai";

  if (!apiKey || apiKey === "YOUR_APIDOT_API_KEY") {
    return { task_id: taskId, reconciled: false, reason: "APIDOT_API_KEY is not set" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/generate/status/${taskId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: createTimeoutSignal(timeoutMs),
    });

    const body = await response.json().catch(() => ({}));

    return {
      task_id: taskId,
      reconciled: response.ok,
      http_status: response.status,
      status: body?.data?.status,
    };
  } catch (error) {
    const name = error?.name || "Error";
    const message = error?.message || "Unknown status request error";

    return {
      task_id: taskId,
      reconciled: false,
      reason: name === "AbortError" || name === "TimeoutError" ? "status request timed out" : message,
    };
  }
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/apidot/webhook", async (req, res) => {
  const event = req.body;
  const taskId = event?.data?.task_id || event?.task_id;

  if (!taskId) {
    return res.status(400).json({ ok: false, error: "Missing task_id" });
  }

  if (!(await isKnownTaskId(taskId))) {
    return res.status(202).json({ ok: true, ignored: true, reason: "Unknown task_id" });
  }

  const status = event?.data?.status || event?.status || "unknown";
  const files = event?.data?.files || event?.files || [];

  if (lastStatusByTaskId.get(taskId) === status) {
    return res.json({ ok: true, duplicate: true });
  }

  lastStatusByTaskId.set(taskId, status);

  console.log(
    JSON.stringify(
      {
        task_id: taskId,
        status,
        files,
        accepted: true,
      },
      null,
      2,
    ),
  );

  // Keep the response path short. In production, persist the event first,
  // then reconcile in a background worker before irreversible business actions.
  void reconcileTaskStatus(taskId, { timeoutMs: reconcileTimeoutMs }).then((reconciled) => {
    console.log(JSON.stringify({ task_id: taskId, reconciled }, null, 2));
  });

  return res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`APIDot webhook receiver listening on port ${port}`);
});
