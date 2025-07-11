"use client";

import { useTask } from "@/contexts/TaskContext";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { PAGE_URLS } from "@/constants/PAGE_URLS";

export default function AdminPage() {
  const { tasks } = useTask();
  const { logout } = useAuth();

  const tasksByUser = tasks.reduce((acc, task) => {
    const userId = task.createdBy.id;
    if (!acc[userId]) {
      acc[userId] = {
        user: task.createdBy,
        tasks: [],
      };
    }
    acc[userId].tasks.push(task);
    return acc;
  }, {} as Record<string, { user: any; tasks: any[] }>);

  const totalTasks = tasks.length;
  const activeUsers = Object.keys(tasksByUser).length;
  const completionRate = totalTasks
    ? Math.round(
        (tasks.filter((t) => t.status === "completed").length / totalTasks) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <p className="text-sm text-gray-500">Manage all tasks and users</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" passHref>
              <Button variant="ghost">← Back to Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{activeUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {completionRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by User</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {Object.values(tasksByUser).map(
                  ({ user, tasks: userTasks }) => (
                    <Link
                      href={PAGE_URLS.DASHBOARD + `?createdBy=${user.id}`}
                      key={user.id}
                    >
                      <Card>
                        <CardHeader className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {user.avatar ? (
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
                              ) : (
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-sm text-gray-500 truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {userTasks.length} tasks
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col">
                              <span className="text-gray-500 text-sm">
                                Completed
                              </span>
                              <span className="font-semibold text-green-600">
                                {
                                  userTasks.filter(
                                    (t) => t.status === "completed"
                                  ).length
                                }
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-gray-500 text-sm">
                                In Progress
                              </span>
                              <span className="font-semibold text-blue-600">
                                {
                                  userTasks.filter(
                                    (t) => t.status === "in-progress"
                                  ).length
                                }
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-gray-500 text-sm">
                                To Do
                              </span>
                              <span className="font-semibold text-gray-600">
                                {
                                  userTasks.filter((t) => t.status === "todo")
                                    .length
                                }
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
