import express from "express";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.ts"; // Импортируем роуты
// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Подключаем роуты задач с префиксом /api/todos
app.use("/api/todos", todoRoutes);

// Глобальный обработчик ошибок (опционально, но крайне полезно)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
