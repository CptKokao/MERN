import type { ITodo } from "../types/todo.ts";
import fs from "node:fs/promises";
import path from "node:path";

export const TodoService = {
  // Асинхронный метод, чтобы потом было легко заменить на реальный запрос к БД
  async getAllTodos(): Promise<ITodo[]> {
    try {
      // process.cwd() всегда смотрит на корень твоего проекта
      const filePath = path.resolve(process.cwd(), "data", "todos.json");

      const fileData = await fs.readFile(filePath, "utf-8");

      // Парсим JSON строку в объект
      const parsedData = JSON.parse(fileData);

      return parsedData.todos as ITodo[];
    } catch (error) {
      console.error("Ошибка при чтении файла todos.json:", error);
      // Возвращаем пустой массив, если файл не найден или поврежден
      return [];
    }
  },
};
