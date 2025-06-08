// src/index.mts

import express from "express";
// import cors from "cors";
import taskRouter from "./routes/tasks.mts";
import { db } from "./utils/db.mts";

const app = express();
const PORT = 4000;

// app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRouter);

app.get("/ping-db", async (_req, res) => {
  const result = await db.query("SELECT NOW()");
  res.send(result.rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
