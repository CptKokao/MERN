import path from "path";
import type { Request, Response, NextFunction } from "express";
import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.ts"; // Импортируем роуты
import methodOverride from "method-override"; // 1. Импортируем
// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// НАСТРОЙКА EJS
app.set("view engine", "ejs");
// Указываем явный путь к папке views относительно корня проекта
app.set("views", path.resolve(process.cwd(), "src", "views"));

app.use(express.json());

// Обязательно для чтения данных из HTML-форм:
app.use(express.urlencoded({ extended: true }));

// Подключаем method-override.
// Строка '_method' означает, что мы будем передавать желаемый метод в URL как ?_method=DELETE
app.use(methodOverride("_method"));

// МИДЛВАР ДЛЯ ОТКЛЮЧЕНИЯ КЭША (Добавь этот блок)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Подключаем роуты
app.use("/", todoRoutes);

// Глобальный обработчик ошибок (опционально, но крайне полезно)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
