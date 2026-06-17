import { Router } from "express";
import { TodoController } from "../controllers/todo.controller.ts";

const router = Router();

// GET /api/todos - получить все задачи
router.get("/", TodoController.getAll);

export default router;
