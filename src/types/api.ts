import type { ZodError } from "zod";
import type {
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

export type GlobalApiResponse<T = any> = {
  success: boolean;
  data: { message: string; result?: T };
};

export type GlobalErrorResType = {
  success: false;
  data: {
    message:
      | string
      | null
      | ZodError<{
          [x: string]: any;
        }>;
    result?:
      | string
      | null
      | ZodError<{
          [x: string]: any;
        }>;
  };
};

export type UseMutationType<T, R> = Omit<
  UseMutationOptions<GlobalApiResponse<T>["data"]["result"], Error, R>,
  "mutationFn"
>;

export type UseQueryType<T> = Omit<
  UndefinedInitialDataOptions<GlobalApiResponse<T>["data"]["result"]>,
  "queryFn" | "queryKey"
> & { queryKey?: string[] };

export type Role = "admin" | "user";
export type Protection = "public" | "unauth-only" | "auth-only";

export type RouteConfig = {
  path: string;
  protection: Protection;
  allowedRoles?: Role[];
  isApi: boolean;
};
