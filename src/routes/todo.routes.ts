import { Router } from "express";
import { TodoController } from "../controllers/todo.controller.ts";

const router = Router();

// GET /api/todos - получить все задачи
router.get("/", TodoController.getAll);
router.get("/:id", TodoController.getById);
router.delete("/:id", TodoController.delete); // Маршрут для удаления
router.patch("/:id", TodoController.toggleStatus);

export default router;
