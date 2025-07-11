import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';
import type { User } from '@/types';

// Path to your JSON seed file (bundled read-only)
const dataFile = path.resolve(process.cwd(), 'data', 'users.json');
// Detect development mode (use JSON file locally)
const isDev = process.env.NODE_ENV === 'development';

/**
 * Read all users.
 * - In development: read directly from the JSON seed file.
 * - In production/preview: seed KV on first read then use KV storage.
 */
export async function readUsers(): Promise<User[]> {
  if (isDev) {
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw) as User[];
  }

  let users = await kv.get<User[]>('users');
  if (!users) {
    const raw = fs.readFileSync(dataFile, 'utf8');
    users = JSON.parse(raw) as User[];
    await kv.set('users', users);
  }

  return users;
}

/**
 * Persist updated users list.
 * - In development: write back to the JSON file.
 * - In production/preview: write to KV.
 */
export async function writeUsers(users: User[]): Promise<void> {
  if (isDev) {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
  } else {
    await kv.set('users', users);
  }
}
