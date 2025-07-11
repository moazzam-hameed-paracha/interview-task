import {
  postAuthLoginReqSchema,
  postAuthLoginResSchema,
  type PostAuthLoginReqType,
  type PostAuthLoginResType,
  postAuthRegisterReqSchema,
  postAuthRegisterResSchema,
  type PostAuthRegisterReqType,
  type PostAuthRegisterResType,
  getAuthMeReqSchema,
  getAuthMeResSchema,
  type GetAuthMeResType,
  postAuthLogoutReqSchema,
  postAuthLogoutResSchema,
  type PostAuthLogoutReqType,
  type PostAuthLogoutResType,
} from "./validators";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWithValidation } from "../base-api";
import { API_ROUTES } from "@/constants/API_URL";
import { UseMutationType, UseQueryType } from "@/types/api";

// -- LOGIN [POST] --
export const usePostAuthLogin = (
  options: UseMutationType<PostAuthLoginResType, PostAuthLoginReqType> = {}
) => {
  return useMutation({
    ...options,
    mutationFn: (props) =>
      fetchWithValidation({
        reqSchema: postAuthLoginReqSchema,
        resSchema: postAuthLoginResSchema,
        request: props,
        type: "AUTH",
        fetchFn: {
          input: API_ROUTES.AUTH_LOGIN,
          init: {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props),
          },
          options: { skipAuthorization: true },
        },
      }),
  });
};

// -- REGISTER [POST] --
export const usePostAuthRegister = (
  options: UseMutationType<
    PostAuthRegisterResType,
    PostAuthRegisterReqType
  > = {}
) => {
  return useMutation({
    ...options,
    mutationFn: (props) =>
      fetchWithValidation({
        reqSchema: postAuthRegisterReqSchema,
        resSchema: postAuthRegisterResSchema,
        request: props,
        type: "AUTH",
        fetchFn: {
          input: API_ROUTES.AUTH_REGISTER,
          init: {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props),
          },
          options: { skipAuthorization: true },
        },
      }),
  });
};

// -- GET ME [GET] --
export const useGetAuthMe = (options: UseQueryType<GetAuthMeResType> = {}) => {
  return useQuery({
    ...options,
    queryKey: ["auth", "me", ...(options.queryKey || [])],
    queryFn: () =>
      fetchWithValidation({
        reqSchema: getAuthMeReqSchema,
        resSchema: getAuthMeResSchema,
        request: {},
        type: "AUTH",
        fetchFn: {
          input: API_ROUTES.AUTH_ME,
          init: {
            method: "GET",
          },
        },
      }),
  });
};

// -- LOGOUT [POST] --
export const usePostAuthLogout = (
  options: UseMutationType<PostAuthLogoutResType, PostAuthLogoutReqType> = {}
) => {
  return useMutation({
    ...options,
    mutationFn: (props) =>
      fetchWithValidation({
        reqSchema: postAuthLogoutReqSchema,
        resSchema: postAuthLogoutResSchema,
        request: props || {},
        type: "AUTH",
        fetchFn: {
          input: API_ROUTES.AUTH_LOGOUT,
          init: {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props || {}),
          },
        },
      }),
  });
};

export const AUTH = {
  usePostAuthLogin,
  usePostAuthRegister,
  useGetAuthMe,
  usePostAuthLogout,
};
