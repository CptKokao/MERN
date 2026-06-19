import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { HttpError } from "http-errors";
import path from "path";
import todoRoutes from "./routes/todo.routes.ts";

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// НАСТРОЙКА EJS
app.set("view engine", "ejs");
// Указываем явный путь к папке views относительно корня проекта
app.set("views", path.resolve(process.cwd(), "src", "views"));

app.use(express.json());

// МИДЛВАР ДЛЯ ОТКЛЮЧЕНИЯ КЭША (Добавь этот блок)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Подключаем роуты
app.use("/", todoRoutes);

// Глобальный обработчик ошибок (опционально, но крайне полезно)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  let status = 500;
  let message = "Внутренняя ошибка сервера";

  // Проверяем: если пришедшая ошибка является экземпляром HttpError из библиотеки http-errors
  if (err instanceof HttpError) {
    status = err.status; // Теперь TypeScript знает, что здесь ТОЧНО есть поле status
    message = err.message;
  } else if (err instanceof Error) {
    // Если это обычная системная ошибка (например, упал fs.readFile), берем её текст
    message = err.message;
  }

  // Логируем для разработчика
  console.error(`[Error ${status}]: ${message}`);
  if (status === 500 && err instanceof Error) {
    console.error(err.stack);
  }

  // Отдаем ответ
  res.status(status);
  res.render("error", {
    status,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
