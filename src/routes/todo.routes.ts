import { Router, urlencoded, static as static_ } from "express";
import { TodoController } from "../controllers/todo.controller.ts";
import { requestToContext } from "../middlewares/requestToContext.ts";
import methodOverride from "method-override"; // 1. Импортируем

const router = Router();

router.use(static_("public"));

router.use(urlencoded({ extended: true }));
router.use(methodOverride("_method"));

router.use(requestToContext);
// GET /api/todos - получить все задачи
router.get("/", TodoController.getAll);
router.get("/:id", TodoController.getById);
router.delete("/:id", TodoController.delete); // Маршрут для удаления
router.patch("/:id", TodoController.toggleStatus);

export default router;
