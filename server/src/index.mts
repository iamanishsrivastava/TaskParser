import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import taskRouter from "./routes/tasks.mts";
import projectRouter from "./routes/projects.mts";
import { magicAuthMiddleware } from "./middlewares/magicAuth";
import { db } from "./utils/db.mts";
import { magic } from "./utils/magic";
import cors from "cors";
const app = express();
const PORT = 4000;

// FIXME: TypeError: Cannot destructure property 'title' of 'req.body' as it is undefined.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
console.log("JSON Middleware loaded");
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.get("/test-cookie", (req, res) => {
  res.cookie("session", "dummyToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.send("cookie sent");
});

app.post("/api/debug-task", (req, res) => {
  console.log("Debug BODY:", req.body);
  res.json(req.body);
});

app.post("/api/session", async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  console.log("Token:", token);
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    console.log("Session API: Missing token");
    return;
  }

  try {
    const metadata = await magic.users.getMetadataByToken(token);
    if (!metadata.issuer) throw new Error("Invalid token");

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Session creation error:", err);
    res.status(401).json({ error: "Invalid Magic token" });
  }
});

// Auth middleware applied here
// app.use("/api", magicAuthMiddleware);

// Auth-protected routes
app.use("/api/tasks", magicAuthMiddleware, taskRouter);
app.use("/api/projects", magicAuthMiddleware, projectRouter);

app.post("/api/logout", (_req, res) => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true });
});

// Health check
app.get("/api/health-check", async (_req, res) => {
  const result = await db.query("SELECT NOW()");
  res.send(result.rows[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
