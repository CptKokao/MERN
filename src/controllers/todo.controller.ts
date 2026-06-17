import type { Request, Response, NextFunction } from "express";
import { TodoService } from "../services/todo.service.ts";

export const TodoController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todos = await TodoService.getAllTodos();

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
};
