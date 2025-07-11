import fs from 'fs';
import path from 'path';
import type { Task } from '@/lib/api/tasks';

const dataFile = path.resolve(process.cwd(), 'data', 'tasks.json');

export function readTasks(): Task[] {
  const data = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(data) as Task[];
}

export function writeTasks(tasks: Task[]): void {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
}
