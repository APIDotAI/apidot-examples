import express from "express";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "2mb" }));

const seenTaskIds = new Set();

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/apidot/webhook", async (req, res) => {
  const event = req.body;
  const taskId = event?.data?.task_id || event?.task_id;

  if (!taskId) {
    return res.status(400).json({ ok: false, error: "Missing task_id" });
  }

  if (seenTaskIds.has(taskId)) {
    return res.json({ ok: true, duplicate: true });
  }

  seenTaskIds.add(taskId);

  const status = event?.data?.status || event?.status || "unknown";
  const files = event?.data?.files || event?.files || [];

  console.log(
    JSON.stringify(
      {
        task_id: taskId,
        status,
        files,
      },
      null,
      2,
    ),
  );

  return res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`APIDot webhook receiver listening on http://localhost:${port}`);
});
