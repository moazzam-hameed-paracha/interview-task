"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { API } from "@/lib/api";
import { useWebSocket } from "./WebSocketContext";
import {
  GetTasksResType,
  PostTaskCreateReqType,
  PutTaskUpdateReqType,
} from "@/lib/api/tasks";
import { useState } from "react";
import { useSearchParams } from 'next/navigation';

type TaskContextType = {
  tasks: GetTasksResType;
  isLoading: boolean;
  error: string | null;
  createTask: (task: PostTaskCreateReqType) => Promise<void>;
  updateTask: (updates: PutTaskUpdateReqType) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { useGetTasks, usePostTaskCreate, usePutTaskUpdate, useDeleteTask } =
    API.TASKS;

  // API hooks
  const searchParams = useSearchParams();
  const createdByParam = searchParams.get('createdBy') || undefined;
  const getTasksParams = createdByParam
    ? { createdBy: createdByParam }
    : undefined;

  const {
    data: tasksData = [],
    isLoading,
    error,
  } = useGetTasks(getTasksParams, {
    enabled: isAuthenticated,
  });

  const createTaskMutation = usePostTaskCreate();
  const updateTaskMutation = usePutTaskUpdate();
  const deleteTaskMutation = useDeleteTask();

  const queryClient = useQueryClient();
  const { lastMessage } = useWebSocket();

  const [tasks, setTasks] = useState<GetTasksResType>(tasksData);

  useEffect(() => {
    if (tasksData && tasksData.length > 0) {
      setTasks(tasksData);
    }
  }, [tasksData]);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === "TASK_LIST") {
        setTasks(lastMessage.payload as GetTasksResType);
      } else {
        // fallback: refetch tasks
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    }
  }, [lastMessage, queryClient]);

  const createTask = async (taskData: PostTaskCreateReqType) => {
    const previous = tasks;
    // create a temporary task for optimistic UI
    const tempId = `temp-${Date.now()}`;
    const now = new Date();
    const tempTask = {
      id: tempId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || "todo",
      priority: taskData.priority,
      createdBy: user!,
      createdAt: now,
      updatedAt: now,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
    } as any;
    setTasks((prev) => [tempTask, ...prev]);
    try {
      const result = await createTaskMutation.mutateAsync(taskData);
      // replace tempTask with actual result
      setTasks((prev) => prev.map((t) => (t.id === tempId ? result : t)));
    } catch (error) {
      // rollback
      setTasks(previous);
      throw error;
    }
  };

  const updateTask = async (updates: PutTaskUpdateReqType) => {
    const previous = tasks;
    const { taskId, ...fields } = updates;
    // Optimistically update
    setTasks(
      (prev) =>
        prev.map((t) =>
          t.id === taskId
            ? ({
                ...t,
                ...(fields as Partial<typeof t>),
                updatedAt: new Date(),
              } as any)
            : t
        ) as any
    );
    try {
      await updateTaskMutation.mutateAsync(updates);
    } catch (error) {
      // rollback
      setTasks(previous);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    const previous = tasks;
    // Optimistically remove
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTaskMutation.mutateAsync({ taskId: id });
    } catch (error) {
      // rollback
      setTasks(previous);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error: error?.message || null,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
