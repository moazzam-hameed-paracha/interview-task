import {
  getTasksReqSchema,
  getTasksResSchema,
  type GetTasksReqType,
  type GetTasksResType,
  postTaskCreateReqSchema,
  postTaskCreateResSchema,
  type PostTaskCreateReqType,
  type PostTaskCreateResType,
  putTaskUpdateReqSchema,
  putTaskUpdateResSchema,
  type PutTaskUpdateReqType,
  type PutTaskUpdateResType,
  deleteTaskReqSchema,
  deleteTaskResSchema,
  type DeleteTaskReqType,
  type DeleteTaskResType,
} from "./validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithValidation } from "../base-api";
import { API_ROUTES } from "@/constants/API_URL";
import { UseQueryType, UseMutationType } from "@/types/api";

// -- GET ALL TASKS [GET] --
export const useGetTasks = (
  params: GetTasksReqType,
  options: UseQueryType<GetTasksResType> = {}
) => {
  return useQuery({
    ...options,
    queryKey: ["tasks", params, ...(options.queryKey || [])],
    queryFn: () =>
      fetchWithValidation({
        reqSchema: getTasksReqSchema,
        resSchema: getTasksResSchema,
        request: params || {},
        type: "TASKS",
        fetchFn: {
          input: `${API_ROUTES.TASKS_GET_ALL}${
            params ? `?${new URLSearchParams(params).toString()}` : ""
          }`,
          init: {
            method: "GET",
          },
        },
      }),
  });
};

// -- GET ALL TASK MUTATION [GET] --
export const useGetTaskList = (
  options: UseMutationType<GetTasksResType, GetTasksReqType> = {}
) => {
  return useMutation({
    ...options,
    mutationFn: (params) =>
      fetchWithValidation({
        reqSchema: getTasksReqSchema,
        resSchema: getTasksResSchema,
        request: params || {},
        type: "TASKS",
        fetchFn: {
          input: `${API_ROUTES.TASKS_GET_ALL}${
            params ? `?${new URLSearchParams(params).toString()}` : ""
          }`,
          init: {
            method: "GET",
          },
        },
      }),
  });
};

// -- CREATE TASK [POST] --
export const usePostTaskCreate = (
  options: UseMutationType<PostTaskCreateResType, PostTaskCreateReqType> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (props) =>
      fetchWithValidation({
        reqSchema: postTaskCreateReqSchema,
        resSchema: postTaskCreateResSchema,
        request: props,
        type: "TASKS",
        fetchFn: {
          input: API_ROUTES.TASKS_CREATE,
          init: {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(props),
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// -- UPDATE TASK [PUT] --
export const usePutTaskUpdate = (
  options: UseMutationType<PutTaskUpdateResType, PutTaskUpdateReqType> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (props) =>
      fetchWithValidation({
        reqSchema: putTaskUpdateReqSchema,
        resSchema: putTaskUpdateResSchema,
        request: props,
        type: "TASKS",
        fetchFn: {
          input: API_ROUTES.TASKS_UPDATE(props.taskId),
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
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// -- DELETE TASK [DELETE] --
export const useDeleteTask = (
  options: UseMutationType<DeleteTaskResType, DeleteTaskReqType> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (props) =>
      fetchWithValidation({
        reqSchema: deleteTaskReqSchema,
        resSchema: deleteTaskResSchema,
        request: props || {},
        type: "TASKS",
        fetchFn: {
          input: API_ROUTES.TASKS_DELETE(props.taskId),
          init: {
            method: "DELETE",
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const TASKS = {
  useGetTasks,
  useGetTaskList,
  usePostTaskCreate,
  usePutTaskUpdate,
  useDeleteTask,
};
