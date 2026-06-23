import { Router, urlencoded, static as static_ } from "express";
import { TodoController } from "../controllers/todo.controller.ts";
import { requestToContext } from "../middlewares/requestToContext.ts";
import methodOverride from "method-override"; // 1. Импортируем
import { createTodoValidator } from "../middlewares/todo.validator.ts";
import { validateTodoParamId } from "../middlewares/param.validator.ts";

const router = Router();

router.use(static_("public"));

router.use(urlencoded({ extended: true }));
router.use(methodOverride("_method"));

router.use(requestToContext);
// GET /api/todos - получить все задачи
router.post("/add", createTodoValidator, TodoController.add);
router.get("/add", TodoController.addPage);

router.get("/", TodoController.getAll);
router.get("/:id", validateTodoParamId, TodoController.getById);
router.delete("/:id", validateTodoParamId, TodoController.delete); // Маршрут для удаления
router.patch("/:id", validateTodoParamId, TodoController.toggleStatus);

export default router;
