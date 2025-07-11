import type React from "react";
import type { Metadata } from "next";
import { TaskProvider } from "@/contexts/TaskContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

export const metadata: Metadata = {
  title: "Task Management System",
  description: "Real-time collaborative task management application",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WebSocketProvider>
      <TaskProvider>{children}</TaskProvider>
    </WebSocketProvider>
  );
}
