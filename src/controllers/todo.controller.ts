import type { Request, Response, NextFunction } from "express";
import { TodoService } from "../services/todo.service.ts";

export const TodoController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todos = await TodoService.getAllTodos();

      // Возвращаем данные в правильном формате обертки, как в твоем примере
      res.status(200).json({ todos });
    } catch (error) {
      // Передаем ошибку в глобальный обработчик ошибок Express
      next(error);
    }
  },
};
