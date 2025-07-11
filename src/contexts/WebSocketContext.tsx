"use client";

import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { WebSocketMessage } from "@/types";
import { API_ROUTES } from "@/constants/API_URL";
import { API } from "@/lib/api";
import { useSearchParams } from "next/navigation";

type WebSocketContextType = {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const { user, isAuthenticated } = useAuth();
  const pollIntervalRef = useRef<NodeJS.Timeout>();

  const getTasksListMutation = API.TASKS.useGetTaskList({});

  const searchParams = useSearchParams();
  const createdByParam = searchParams.get("createdBy") || undefined;
  const getTasksParams = createdByParam
    ? { createdBy: createdByParam }
    : undefined;

  useEffect(() => {
    if (isAuthenticated && user) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isAuthenticated, user]);

  const fetchTasks = async () => {
    try {
      const data = await getTasksListMutation.mutateAsync(getTasksParams);

      const message: WebSocketMessage = {
        type: "TASK_LIST",
        payload: data,
        timestamp: new Date(),
      };
      setLastMessage(message);
    } catch (error: any) {
      const errMsg: WebSocketMessage = {
        type: "ERROR",
        payload: { message: error.message || "Fetch failed" },
        timestamp: new Date(),
      };
      setLastMessage(errMsg);
    }
  };

  const startPolling = () => {
    setIsConnected(true);
    fetchTasks();
    pollIntervalRef.current = setInterval(fetchTasks, 5000);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setIsConnected(false);
  };

  const sendMessage = (_message: WebSocketMessage) => {
    // no-op in polling simulation
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        sendMessage,
        lastMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
