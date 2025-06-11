import { Router, RequestHandler } from "express";
import crypto from "crypto";
import { db } from "../utils/db.mts";
import type { Project } from "../types/model";

const projectRouter = Router();

// GET all projects for logged-in user
projectRouter.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM projects WHERE user_id = $1", [
      req.user!.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// POST new project
projectRouter.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const userId = req.user!.id;

    const query = `
      INSERT INTO projects (id, title, created_at, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await db.query(query, [id, title, createdAt, userId]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT update project title by ID
const updateProject: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const query = `
      UPDATE projects
      SET title = $1
      WHERE id = $2 AND user_id = $3
      RETURNING *;
    `;

    const result = await db.query(query, [title, id, req.user!.id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Project not found or access denied" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update project" });
  }
};

// DELETE project by ID
const deleteProject: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `DELETE FROM projects WHERE id = $1 AND user_id = $2`,
      [id, req.user!.id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Project not found or access denied" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// Mount update/delete
projectRouter.put("/:id", updateProject);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;
