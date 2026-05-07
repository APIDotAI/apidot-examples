import express from "express";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "2mb" }));

const lastStatusByTaskId = new Map();
const submittedTaskIds = new Set(
  (process.env.APIDOT_KNOWN_TASK_IDS || "")
    .split(",")
    .map((taskId) => taskId.trim())
    .filter(Boolean),
);

async function isKnownTaskId(taskId) {
  // Replace this Set with a database lookup in production. Only process
  // callbacks for task ids your system submitted and stored.
  return submittedTaskIds.has(taskId);
}

async function reconcileTaskStatus(taskId) {
  const apiKey = process.env.APIDOT_API_KEY;
  const baseUrl = process.env.APIDOT_BASE_URL || "https://api.apidot.ai";

  if (!apiKey || apiKey === "YOUR_APIDOT_API_KEY") {
    return { task_id: taskId, reconciled: false, reason: "APIDOT_API_KEY is not set" };
  }

  const response = await fetch(`${baseUrl}/api/generate/status/${taskId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const body = await response.json().catch(() => ({}));

  return {
    task_id: taskId,
    reconciled: response.ok,
    http_status: response.status,
    status: body?.data?.status,
  };
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
  const reconciled = await reconcileTaskStatus(taskId);

  console.log(
    JSON.stringify(
      {
        task_id: taskId,
        status,
        files,
        reconciled,
      },
      null,
      2,
    ),
  );

  return res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`APIDot webhook receiver listening on port ${port}`);
});
