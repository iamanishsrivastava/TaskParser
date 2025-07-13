import type { RequestHandler } from "express";
import express, { Router } from "express";
import crypto from "crypto";
import { db } from "../utils/db.mts";
import { validate } from "../middlewares/validate.ts";
import { createTaskSchema } from "../validators/task.ts";
import { smartParseTask } from "../services/smartParseTask.mts";

const taskRouter: Router = Router();

taskRouter.use(express.json());
console.log("Tasks router loaded");

// GET all tasks for the logged-in user
taskRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks WHERE user_id = $1", [
      req.user!.id,
    ]);
    const tasks = result.rows;
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST new task
taskRouter.post("/", validate(createTaskSchema), async (req, res) => {
  console.log("Received Payload:", req.body);
  try {
    const {
      title,
      project_id,
      completed = false,
      due_date = null,
      task_label = "",
      task_status = "todo",
      task_priority = "medium",
      description = "",
    } = req.body;

    const parsed = await smartParseTask(title);
    console.log("Parsed Task:", parsed);

    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const userId = req.user!.id;

    const query = `
      INSERT INTO tasks (
        id, title, project_id, completed, created_at, due_date, task_label,
        task_status, task_priority, description, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *;
    `;

    const values = [
      id,
      parsed.title || title,
      project_id,
      completed,
      created_at,
      parsed.due_date || due_date,
      task_label,
      task_status,
      parsed.task_priority || task_priority,
      description,
      userId,
    ];

    console.log("Final Insert Payload:", {
      ...req.body,
      id,
      created_at,
      userId,
    });
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
    console.log(err);
  }
});

// PUT update task by ID
const updateTask: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;

    // Build dynamic update query (simple example)
    const fields = Object.keys(req.body);
    if (fields.length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const setClause = fields.map((f, i) => `"${f}" = $${i + 2}`).join(", ");

    const values = [id, ...fields.map((f) => req.body[f]), req.user!.id];

    // Also restrict update to tasks belonging to this user
    const query = `
      UPDATE tasks SET ${setClause}
      WHERE id = $1 AND user_id = $${fields.length + 2}
      RETURNING *;
    `;

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Task not found or access denied" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
    console.log(err);
  }
};

// DELETE task by ID
const deleteTask: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM tasks WHERE id = $1 AND user_id = $2`;
    const result = await db.query(query, [id, req.user!.id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Task not found or access denied" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Mount routes
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
