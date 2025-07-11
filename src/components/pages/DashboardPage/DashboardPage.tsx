"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Plus, Search, LogOut } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TaskCard, TaskForm } from "./components";

export default function DashboardPage() {
  const { tasks, isLoading } = useTask();
  const { user, logout } = useAuth();
  const { lastMessage } = useWebSocket();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    if (lastMessage) console.log("WS msg:", lastMessage);
  }, [lastMessage]);

  // filter logic
  const filtered = tasks.filter((t) => {
    const textMatch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || t.status === statusFilter;
    const prioMatch = priorityFilter === "all" || t.priority === priorityFilter;
    return textMatch && statusMatch && prioMatch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Task Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center space-x-2">
            {user?.role === "admin" && (
              <Link href="/admin" passHref>
                <Button variant="secondary" size="sm">
                  Admin
                </Button>
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Tasks", value: stats.total, highlight: false },
            { label: "Completed", value: stats.completed, highlight: "green" },
            {
              label: "In Progress",
              value: stats.inProgress,
              highlight: "blue",
            },
            { label: "To Do", value: stats.todo, highlight: false },
          ].map((stat) => (
            <Card key={stat.label} className="h-full">
              <CardContent className="space-y-1 p-6">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p
                  className={`text-3xl font-bold ${
                    stat.highlight === "green"
                      ? "text-green-600"
                      : stat.highlight === "blue"
                      ? "text-blue-600"
                      : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 mr-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="flex space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36" placeholder="Status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-36" placeholder="Priority">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setShowTaskForm(true)}>
                <Plus className="mr-1 h-4 w-4" /> New Task
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-4">
              No tasks found matching your criteria.
            </p>
            <Button onClick={() => setShowTaskForm(true)}>
              Create Your First Task
            </Button>
          </div>
        )}

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            onClose={() => setShowTaskForm(false)}
            onSubmit={() => setShowTaskForm(false)}
          />
        )}
      </main>
    </div>
  );
}
