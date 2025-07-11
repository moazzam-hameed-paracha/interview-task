import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
  avatar: z.string().optional(),
  password: z.string().optional(),
});

// -- GET USER BY ID [GET] --
export const getUserByIdReqSchema = z.object({ userId: z.string() });
export const getUserByIdResSchema = userSchema;

export type GetUserByIdReqType = z.infer<typeof getUserByIdReqSchema>;
export type GetUserByIdResType = z.infer<typeof getUserByIdResSchema>;

// -- UPDATE USER [PUT] --
export const putUserUpdateReqSchema = z.object({
  userId: z.string(),
  name: z.string().optional(),
  role: z.enum(["admin", "user"]).optional(),
  avatar: z.string().optional(),
});

export const putUserUpdateResSchema = userSchema;

export type PutUserUpdateReqType = z.infer<typeof putUserUpdateReqSchema>;
export type PutUserUpdateResType = z.infer<typeof putUserUpdateResSchema>;
