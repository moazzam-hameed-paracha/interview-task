import { z } from "zod"

// -- LOGIN [POST] --
export const postAuthLoginReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const postAuthLoginResSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(["admin", "user"]),
    avatar: z.string().optional(),
  }),
  token: z.string(),
})

export type PostAuthLoginReqType = z.infer<typeof postAuthLoginReqSchema>
export type PostAuthLoginResType = z.infer<typeof postAuthLoginResSchema>

// -- REGISTER [POST] --
export const postAuthRegisterReqSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
})

export const postAuthRegisterResSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(["admin", "user"]),
    avatar: z.string().optional(),
  }),
  token: z.string(),
})

export type PostAuthRegisterReqType = z.infer<typeof postAuthRegisterReqSchema>
export type PostAuthRegisterResType = z.infer<typeof postAuthRegisterResSchema>

// -- GET ME [GET] --
export const getAuthMeReqSchema = z.object({}).optional()

export const getAuthMeResSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
  avatar: z.string().optional(),
})

export type GetAuthMeReqType = z.infer<typeof getAuthMeReqSchema>
export type GetAuthMeResType = z.infer<typeof getAuthMeResSchema>

// -- LOGOUT [POST] --
export const postAuthLogoutReqSchema = z.object({}).optional()
export const postAuthLogoutResSchema = z.object({
  message: z.string(),
})

export type PostAuthLogoutReqType = z.infer<typeof postAuthLogoutReqSchema>
export type PostAuthLogoutResType = z.infer<typeof postAuthLogoutResSchema>
