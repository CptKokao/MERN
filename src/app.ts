import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.ts"; // Импортируем роуты
import path from "path";
// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// НАСТРОЙКА EJS
app.set("view engine", "ejs");
// Указываем явный путь к папке views относительно корня проекта
app.set("views", path.resolve(process.cwd(), "src", "views"));

app.use(express.json());
// Полезно добавить для обработки данных из HTML-форм в будущем:
app.use(express.urlencoded({ extended: true }));

// Подключаем роуты задач с префиксом /api/todos
app.use("/", todoRoutes);

// Глобальный обработчик ошибок (опционально, но крайне полезно)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
