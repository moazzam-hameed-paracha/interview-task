import {
  getUserByIdReqSchema,
  getUserByIdResSchema,
  type GetUserByIdResType,
  putUserUpdateReqSchema,
  putUserUpdateResSchema,
  type PutUserUpdateReqType,
  type PutUserUpdateResType,
  GetUserByIdReqType,
} from "./validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithValidation } from "../base-api";
import { API_ROUTES } from "@/constants/API_URL";
import { UseQueryType, UseMutationType } from "@/types/api";

// -- GET USER BY ID [GET] --
export const useGetUserById = (
  params: GetUserByIdReqType,
  options: UseQueryType<GetUserByIdResType> = {}
) => {
  return useQuery({
    ...options,
    queryKey: ["users", ...(options.queryKey || [])],
    queryFn: () =>
      fetchWithValidation({
        reqSchema: getUserByIdReqSchema,
        resSchema: getUserByIdResSchema,
        request: params,
        type: "USERS",
        fetchFn: {
          input: API_ROUTES.USERS_GET_BY_ID(params.userId),
          init: {
            method: "GET",
          },
        },
      }),
  });
};

// -- UPDATE USER [PUT] --
export const usePutUserUpdate = (
  params: PutUserUpdateReqType,
  options: UseMutationType<PutUserUpdateResType, PutUserUpdateReqType> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (props) =>
      fetchWithValidation({
        reqSchema: putUserUpdateReqSchema,
        resSchema: putUserUpdateResSchema,
        request: props,
        type: "USERS",
        fetchFn: {
          input: API_ROUTES.USERS_UPDATE(params.userId),
          init: {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props),
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const USERS = {
  useGetUserById,
  usePutUserUpdate,
};
