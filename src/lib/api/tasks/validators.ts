import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
  avatar: z.string().optional(),
});

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["todo", "in-progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  createdBy: userSchema,
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
});
export type Task = z.infer<typeof taskSchema>;

// -- GET ALL TASKS [GET] --
export const getTasksReqSchema = z
  .object({
    status: z.enum(["todo", "in-progress", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    createdBy: z.string().optional(),
  })
  .optional();

export const getTasksResSchema = z.array(taskSchema);

export type GetTasksReqType = z.infer<typeof getTasksReqSchema>;
export type GetTasksResType = z.infer<typeof getTasksResSchema>;

// -- CREATE TASK [POST] --
export const postTaskCreateReqSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  dueDate: z.string().optional(),
});

export const postTaskCreateResSchema = taskSchema;

export type PostTaskCreateReqType = z.infer<typeof postTaskCreateReqSchema>;
export type PostTaskCreateResType = z.infer<typeof postTaskCreateResSchema>;

// -- UPDATE TASK [PUT] --
export const putTaskUpdateReqSchema = z.object({
  taskId: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  dueDate: z.string().optional(),
});

export const putTaskUpdateResSchema = taskSchema;

export type PutTaskUpdateReqType = z.infer<typeof putTaskUpdateReqSchema>;
export type PutTaskUpdateResType = z.infer<typeof putTaskUpdateResSchema>;

// -- DELETE TASK [DELETE] --
export const deleteTaskReqSchema = z.object({
  taskId: z.string(),
});
export const deleteTaskResSchema = z.object({
  message: z.string(),
});

export type DeleteTaskReqType = z.infer<typeof deleteTaskReqSchema>;
export type DeleteTaskResType = z.infer<typeof deleteTaskResSchema>;
