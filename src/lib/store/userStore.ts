import fs from 'fs'
import path from 'path'
import type { User } from '@/types';

const dataFile = path.resolve(process.cwd(), 'data', 'users.json');

export function readUsers(): User[] {
  const data = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(data) as User[];
}

export function writeUsers(users: User[]): void {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}
