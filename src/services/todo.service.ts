import type { ITodo } from "../types/todo.ts";
import fs from "node:fs/promises";
import path from "node:path";
import { join } from "node:path";
import { getObjectId } from "../utility.ts";

export const TodoService = {
  async _getRawData(): Promise<ITodo[]> {
    try {
      const dataFileName = join(process.cwd(), "data", "todos.json");
      const fileData = await fs.readFile(dataFileName, "utf-8");
      const parsedData = JSON.parse(fileData);

      // Возвращаем свежий массив из файла
      return parsedData.todos as ITodo[];
    } catch (error) {
      console.error("Ошибка чтения файла todos.json:", error);
      return [];
    }
  },
  // Асинхронный метод, чтобы потом было легко заменить на реальный запрос к БД
  async getAllTodos(
    search?: string,
    sortBy: "asc" | "desc" = "desc",
  ): Promise<ITodo[]> {
    const todos = (await this._getRawData()) as ITodo[];
    console.log(sortBy);
    let filteredTodos = todos;

    try {
      // Если передан поисковый запрос, фильтруем массив
      if (search) {
        const query = search.toLowerCase().trim();
        return todos.filter((todo) => todo.title.toLowerCase().includes(query));
      }

      filteredTodos.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        // Если desc — новые сверху (от большего времени к меньшему)
        // Если asc — старые сверху (от меньшего времени к большему)
        return sortBy === "desc" ? dateB - dateA : dateA - dateB;
      });

      return todos;
    } catch (error) {
      console.error("Ошибка при чтении файла todos.json:", error);
      // Возвращаем пустой массив, если файл не найден или поврежден
      return [];
    }
  },

  async getTodoById(id: string | string[]): Promise<ITodo | undefined> {
    const todos = (await this._getRawData()) as ITodo[];

    try {
      return todos.find((el) => el._id === id);
    } catch (error) {
      console.error("Ошибка при чтении файла todos.json:", error);
      // Возвращаем пустой массив, если файл не найден или поврежден
      return undefined;
    }
  },
  // Вспомогательный метод для сохранения данных в файл
  async _saveData(todos: ITodo[]): Promise<void> {
    await fs.writeFile(
      join(process.cwd(), "data", "todos.json"),
      JSON.stringify({ todos }, null, 2),
      "utf-8",
    );
  },

  async deleteTodo(id: string): Promise<boolean> {
    const todos = (await this._getRawData()) as ITodo[];

    const filteredTodos = todos.filter((todo) => todo._id !== id);

    if (todos.length === filteredTodos.length) return false;

    await this._saveData(filteredTodos);
    return true;
  },

  async addTodo(body: { title: string; desc: string }): Promise<boolean> {
    const todos = (await this._getRawData()) as ITodo[];

    const { title, desc } = body;

    const newTodo = {
      _id: getObjectId(),
      title,
      desc,
      createdAt: new Date().toString(),
      completed: false,
    };

    todos.push(newTodo);

    await this._saveData(todos);
    return true;
  },
  // МЕТОД ОБНОВЛЕНИЯ СТАТУСА (Сделано / Вернуть)
  async toggleTodoStatus(
    id: string,
    completed: boolean,
  ): Promise<ITodo | null> {
    const todos = (await this._getRawData()) as ITodo[];

    const todoIndex = todos.findIndex((todo) => todo._id === id);

    if (todoIndex === -1) return null;

    todos[todoIndex].completed = completed;
    await this._saveData(todos);
    return todos[todoIndex];
  },
};
