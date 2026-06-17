import { join } from "node:path";
import { readFileSync } from "node:fs";

const dataFileName = join(process.cwd(), "data", "todos.json");

const dataFile = readFileSync(dataFileName, "utf8");
const database = JSON.parse(dataFile);
export { database };
