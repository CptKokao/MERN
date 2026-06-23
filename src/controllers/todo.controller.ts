import type { Request, Response, NextFunction } from "express";
import { TodoService } from "../services/todo.service.ts";
import createError from "http-errors"; // Импортируем http-errors

export const TodoController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Достаем строку поиска из query-параметров (например, /api/todos?search=Express)
      const { search, sort } = req.query;

      // Приводим к строке, если параметр передан, иначе передаем undefined
      const searchString = typeof search === "string" ? search : undefined;

      const session = req.session as any;

      // 1. Если пользователь явно кликнул по кнопке сортировки, в URL прилетит ?sort=asc или ?sort=desc
      // В этом случае мы обновляем значение в сессии
      if (sort === "asc" || sort === "desc") {
        session.sortBy = sort;
      }
      // 2. Если в URL ничего не передано, но в сессии ТОЖЕ еще пусто (первый заход на сайт),
      // задаем дефолтное значение
      if (!session.sortBy) {
        session.sortBy = "desc";
      }
      const todos = await TodoService.getAllTodos(searchString, session.sortBy);

      // Извлекаем сообщения из сессии (после этого они удаляются из файла сессии)
      const anyReq = req as any;
      const successMessages = await anyReq.consumeFlash("success");
      const errorMessages = await anyReq.consumeFlash("error");

      if (!todos) {
        throw createError(404, "Todos not found");
      }
      // Рендерим шаблон views/index.ejs и передаем в него объект с данными
      res.render("main", {
        todos, // Передаем первое сообщение из массива, если оно есть, иначе null
        successMsg: successMessages[0] || null,
        errorMsg: errorMessages[0] || null,
        // Передаем текущий режим в шаблон, чтобы подсветить активную кнопку
        sortBy: session.sortBy,
      });
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

      if (!todo) {
        throw createError(404, "Todo not found");
      }
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

      // Записываем флэш об удалении
      await (req as any).flash("error", "🗑️ Задача была безвозвратно удалена.");

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Если мидлвар валидации нашел ошибки
      if (req.body.validationErrors) {
        res.status(400).render("add", {
          errors: req.body.validationErrors,
          // Передаем назад то, что пользователь успел ввести
          data: { title: req.body.title, desc: req.body.desc },
        });
        return;
      }

      const success = await TodoService.addTodo(req.body);

      await (req as any).flash(
        "success",
        "🎉 Задача успешно создана и добавлена наверх!",
      );

      if (!success) {
        throw createError(500, "Todo didn't create");
      }
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },

  async addPage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      res.render("add", {
        errors: [],
      });
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

      const msg = isCompleted
        ? "✅ Задача отмечена как выполненная!"
        : "🔄 Задача возвращена в работу";

      await (req as any).flash("success", msg);

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
};
