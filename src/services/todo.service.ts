import { database } from "../models/loaddatabase.js";
import type { ITodo } from "../types/todo.ts";

const todos = database.todos as ITodo[];

export const TodoService = {
  // Асинхронный метод, чтобы потом было легко заменить на реальный запрос к БД
  async getAllTodos(): Promise<ITodo[]> {
    try {
      return todos;
    } catch (error) {
      console.error("Ошибка при чтении файла todos.json:", error);
      // Возвращаем пустой массив, если файл не найден или поврежден
      return [];
    }
  },
  async getTodoById(id: string | string[]): Promise<ITodo | undefined> {
    try {
      console.log(id);
      return todos.find((el) => el._id === id);
    } catch (error) {
      console.error("Ошибка при чтении файла todos.json:", error);
      // Возвращаем пустой массив, если файл не найден или поврежден
      return undefined;
    }
  },
};
