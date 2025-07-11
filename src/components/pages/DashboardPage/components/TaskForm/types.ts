import { postTaskCreateReqSchema, Task } from "@/lib/api/tasks";
import z from "zod";

export const taskFormSchema = postTaskCreateReqSchema;
export type TaskFormValues = z.infer<typeof taskFormSchema>;

export type TaskFormProps = {
  task?: Task;
  onClose: () => void;
  onSubmit: () => void;
};
