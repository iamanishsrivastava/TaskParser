import type { RequestHandler } from "express";
import { Router } from "express";
import crypto from "crypto";
import { db } from "../utils/db.mjs";

const taskRouter: Router = Router();

interface Task {
  id: string;
  title: string;
  projectId: string;
  completed: boolean;
  createdAt: string;
  due_date: string | null;
  task_label: string;
  task_status: string;
  task_priority: string;
  description: string;
}

const allowedFields = [
  "title",
  "completed",
  "due_date",
  "task_label",
  "task_status",
  "task_priority",
  "description",
  "project_id",
];

// GET all tasks for the logged-in user
taskRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks WHERE user_id = $1", [
      req.user!.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST new task
taskRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      projectId,
      completed = false,
      due_date = null,
      task_label = "",
      task_status = "todo",
      task_priority = "medium",
      description = "",
    } = req.body;

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const userId = req.user!.id;

    const query = `
      INSERT INTO tasks (
        id, title, project_id, completed, created_at, due_date, task_label,
        task_status, task_priority, description, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *;
    `;

    const values = [
      id,
      title,
      projectId,
      completed,
      createdAt,
      due_date,
      task_label,
      task_status,
      task_priority,
      description,
      userId,
    ];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
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

    values.push(req.user!.id);

    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Task not found or access denied" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
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
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Mount routes
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
