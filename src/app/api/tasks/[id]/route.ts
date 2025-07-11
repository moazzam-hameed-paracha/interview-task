import { putTaskUpdateReqSchema, Task } from "@/lib/api/tasks";
import { readTasks, writeTasks } from "@/lib/store/taskStore";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const taskId = params.id;

    // Validate request
    const validation = putTaskUpdateReqSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Invalid request data", result: validation.error },
        },
        { status: 400 }
      );
    }

    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Task not found" },
        },
        { status: 404 }
      );
    }

    // Update task
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...validation.data,
      dueDate: validation.data.dueDate
        ? new Date(validation.data.dueDate)
        : undefined,
      updatedAt: new Date(),
    };

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);

    return NextResponse.json({
      success: true,
      data: {
        message: "Task updated successfully",
        result: updatedTask,
      },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;

    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Task not found" },
        },
        { status: 404 }
      );
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    return NextResponse.json({
      success: true,
      data: {
        message: "Task deleted successfully",
        result: { message: "Task deleted successfully" },
      },
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
