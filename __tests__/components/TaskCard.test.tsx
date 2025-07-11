import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Task } from "@/lib/api/tasks";
import { User } from "@/types";
import { AuthProvider } from "@/contexts/AuthContext";
import { TaskProvider } from "@/contexts/TaskContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { TaskCard } from "@/components/pages/DashboardPage/components";

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin@example.com",
};

const mockTask: Task = {
  id: "1",
  title: "Test Task",
  description: "Test Description",
  status: "todo",
  priority: "medium",
  createdBy: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
};


const Wrapper: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <ReactQueryProvider>
    <AuthProvider>
      <WebSocketProvider>
        <TaskProvider>{children}</TaskProvider>
      </WebSocketProvider>
    </AuthProvider>
  </ReactQueryProvider>
);

describe("TaskCard", () => {
  it("renders task information correctly", () => {
    render(<TaskCard task={mockTask} />, { wrapper: Wrapper });

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });


  it("shows edit and delete buttons", () => {
    render(<TaskCard task={mockTask} />, { wrapper: Wrapper });

    // Grab all buttons (there will be at least: status trigger + edit + delete)
    const buttons = screen.getAllByRole("button");

    // Find by the `name` attribute we passed in the component
    const editBtn = buttons.find(
      (btn) => btn.getAttribute("name") === "edit-btn"
    );
    const deleteBtn = buttons.find(
      (btn) => btn.getAttribute("name") === "delete-btn"
    );

    expect(editBtn).toBeDefined();
    expect(deleteBtn).toBeDefined();
  });
});
