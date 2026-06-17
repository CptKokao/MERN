import type { Request, Response, NextFunction } from "express";
import { TodoService } from "../services/todo.service.ts";

export const TodoController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Достаем строку поиска из query-параметров (например, /api/todos?search=Express)
      const { search } = req.query;

      // Приводим к строке, если параметр передан, иначе передаем undefined
      const searchString = typeof search === "string" ? search : undefined;

      const todos = await TodoService.getAllTodos(searchString);
      // Рендерим шаблон views/index.ejs и передаем в него объект с данными
      res.render("todos", { todos });
    } catch (error) {
      // Передаем ошибку в глобальный обработчик ошибок Express
      next(error);
    }
  },
  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const todo = await TodoService.getTodoById(req.params.id);

      // Рендерим шаблон views/index.ejs и передаем в него объект с данными
      res.render("todo", { todo });
    } catch (error) {
      // Передаем ошибку в глобальный обработчик ошибок Express
      next(error);
    }
  },
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const success = await TodoService.deleteTodo(id);

      if (!success) {
        res.status(404).json({ error: "Задача не найдена" });
        return;
      }
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  // Изменение статуса (выполнено / вернуть)
  async toggleStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { completed } = req.body; // Ожидаем { completed: true/false }

      // Приводим строку из формы 'true'/'false' к булевому типу
      const isCompleted = completed === "true";

      const updatedTodo = await TodoService.toggleTodoStatus(id, isCompleted);

      if (!updatedTodo) {
        res.status(404).json({ error: "Задача не найдена" });
        return;
      }
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
};
