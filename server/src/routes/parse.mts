import express, { Router } from "express";
import { ragParseTask } from "../services/rag/ragParseTask.mts";
import { parseTask } from "../services/parseTask.mts";
const parseRouter: Router = Router();

parseRouter.use(express.json());

parseRouter.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    console.log("Received Payload:", title);
    const parsedTask = await ragParseTask(title);
    console.log("Parsed Task:", parsedTask);
    res.json(parsedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse task" });
  }
});
export default parseRouter;
