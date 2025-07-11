import { Task } from "@/lib/api/tasks";
import { userSchema } from "@/lib/api/users";
import z from "zod";

export type User = z.infer<typeof userSchema>;

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type TaskState = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
};

export type WebSocketMessage = {
  type:
    | "TASK_CREATED"
    | "TASK_UPDATED"
    | "TASK_DELETED"
    | "USER_JOINED"
    | "USER_LEFT"
    | "TASK_LIST"
    | "ERROR";
  payload: any;
  timestamp: Date;
};
