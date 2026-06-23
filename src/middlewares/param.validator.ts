import { param, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const validateTodoParamId = [
  // Проверяем параметр :id из URL
  param("id")
    .trim()
    .isHexadecimal()
    .withMessage(
      "ID должен состоять только из шестнадцатеричных символов (0-9, a-f)",
    )
    .isLength({ min: 24, max: 24 })
    .withMessage("ID должен быть строго длиной 24 символа"),

  // Проверка результатов
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Собираем текст ошибок в одну строчку
      const errorMsg = errors
        .array()
        .map((err) => err.msg)
        .join(", ");

      // Сразу бросаем 400 ошибку через http-errors
      // Наш глобальный обработчик поймает её и отрендерит страницу error.ejs
      return next(
        createError(400, `Некорректный формат параметра: ${errorMsg}`),
      );
    }

    next();
  },
];
