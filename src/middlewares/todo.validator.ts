import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

// 1. Правила валидации для формы
export const createTodoValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Заголовок задачи не может быть пустым")
    .isLength({ min: 3, max: 50 })
    .withMessage("Заголовок должен быть от 3 до 50 символов"),

  body("desc")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Описание не должно превышать 500 символов"),

  // 2. Мидлвар для проверки результатов валидации
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Передаем массив ошибок дальше в req, чтобы контроллер мог вернуть их на страницу
      // Либо, если это API, можно сразу вернуть res.status(400).json(...)
      req.body.validationErrors = errors.array();
    }

    next();
  },
];
