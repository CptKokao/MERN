import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { HttpError } from "http-errors";
import path from "path";
import todoRoutes from "./routes/todo.routes.ts";
import session from "express-session";
import createSessionStore from "session-file-store";
import { flash } from "express-flash-message";

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Инициализируем файловое хранилище для сессий
const FileStore = createSessionStore(session);

// НАСТРОЙКА EJS
app.set("view engine", "ejs");
// Указываем явный путь к папке views относительно корня проекта
app.set("views", path.resolve(process.cwd(), "src", "views"));
// Работа с json форматом
app.use(express.json());

// НАСТРОЙКА НАДЕЖНЫХ СЕССИЙ (ЧЕРЕЗ ФАЙЛЫ)
app.use(
  session({
    store: new FileStore({
      path: "./sessions", // Папка в корне проекта, куда будут падать JSON-файлы сессий
      ttl: 3600, // Время жизни сессии в секундах (1 час)
      logFn: () => {}, // Отключаем лишний спам логов библиотеки в консоль
    }),
    secret: process.env.SESSION_SECRET || "super-secret-key-change-me", // Ключ шифрования куки
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true только если используешь HTTPS
      maxAge: 60 * 60 * 1000, // 1 час жизни куки в браузере
    },
  }),
);

// ПОДКЛЮЧАЕМ FLASH СООБЩЕНИЯ (СТРОГО ПОСЛЕ СЕССИЙ!)
app.use(flash({ sessionKeyName: "flash_messages" }));

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
