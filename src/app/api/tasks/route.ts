import { Task, postTaskCreateReqSchema } from "@/lib/api/tasks";
import { readTasks, writeTasks } from "@/lib/store/taskStore";
import { readUsers } from "@/lib/store/userStore";
import { Role } from "@/types/api";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const createdBy = searchParams.get("createdBy");

    // Determine current user from auth header
    const authHeader = request.headers.get("authorization");
    const currentUserId = authHeader?.split("-").at(3);
    const currentUserRole = request.cookies.get("role")?.value as Role || "user";

    let filteredTasks = [...readTasks()];
    // Apply createdBy filter for admin, or restrict non-admin to own tasks
    if (currentUserRole === "admin" && createdBy) {
      filteredTasks = filteredTasks.filter(
        (task) => task.createdBy.id === createdBy
      );
    } else if (currentUserRole !== "admin") {
      filteredTasks = filteredTasks.filter(
        (task) => task.createdBy.id === currentUserId
      );
    }

    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }
    if (priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priority
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Tasks retrieved successfully", result: filteredTasks },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: { message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = postTaskCreateReqSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Invalid request data", result: validation.error },
        },
        { status: 400 }
      );
    }

    const { title, description, priority, status, dueDate } =
      validation.data;

    // Get user from token (simplified)
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.split("-").at(3);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const createdBy: Task["createdBy"] = {
      id: userId,
      email: userId === "1" ? "admin@example.com" : "user@example.com",
      name: userId === "1" ? "Admin User" : "Regular User",
      role: userId === "1" ? "admin" : "user",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
        userId === "1" ? "admin@example.com" : "user@example.com"
      }`,
    };

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: status || ("todo" as const),
      priority,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    const tasks = readTasks();
    tasks.push(newTask);
    writeTasks(tasks);

    return NextResponse.json({
      success: true,
      data: { message: "Task created successfully", result: newTask },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: { message: "Internal server error" },
      },
      { status: 500 }
    );
  }
}
