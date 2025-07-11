"use client";

import { Calendar, User, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { useTask } from "@/contexts/TaskContext";
import { Task } from "@/lib/api/tasks";
import { TaskForm } from "../TaskForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TaskCardProps } from "./types";

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTask();
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "todo":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const handleStatusChange = (newStatus: Task["status"]) => {
    updateTask({ taskId: task.id, status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
    }
  };

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onClose={() => setIsEditing(false)}
        onSubmit={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex justify-between items-start p-4 pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2 break-words">
          {task.title}
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            name="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            name="delete-btn"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4 pt-2">
        <p className="text-gray-600 line-clamp-3 break-words">
          {task.description}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 pt-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority.toUpperCase()}
        </span>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}
          />
          <Select
            value={task.status}
            onValueChange={(val) => handleStatusChange(val as Task["status"])}
          >
            <SelectTrigger name="status-select" className="text-sm w-32">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>

      <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-2 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <User size={14} />
          <span>{task.createdBy.name}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center space-x-1 justify-end">
            <Calendar size={14} />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
