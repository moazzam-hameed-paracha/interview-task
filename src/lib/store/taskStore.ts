// lib/api/tasks.ts

import fs from "fs"
import path from "path"
import { kv } from "@vercel/kv"
import type { Task } from "@/lib/api/tasks"

const dataFile = path.resolve(process.cwd(), "data", "tasks.json")
// detect dev mode
const isDev = process.env.NODE_ENV !== "production"

/**
 * Read all tasks.
 * - In development: always read straight from your JSON file.
 * - In Production/Preview: seed & read from KV.
 */
export async function readTasks(): Promise<Task[]> {
  if (isDev) {
    const raw = fs.readFileSync(dataFile, "utf8")
    return JSON.parse(raw) as Task[]
  }

  let tasks = await kv.get<Task[]>("tasks")
  if (!tasks) {
    const raw = fs.readFileSync(dataFile, "utf8")
    tasks = JSON.parse(raw) as Task[]
    await kv.set("tasks", tasks)
  }
  return tasks
}

/**
 * Persist updated tasks.
 * - In development: write back to your JSON file so you can see changes locally.
 * - In Production/Preview: write into KV.
 */
export async function writeTasks(tasks: Task[]): Promise<void> {
  if (isDev) {
    fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2))
  } else {
    await kv.set("tasks", tasks)
  }
}
