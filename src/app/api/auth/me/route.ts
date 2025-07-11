import { readUsers } from "@/lib/store/userStore";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Extract user ID from mock token
    const userId = token.split("-")[3];
    const users = await readUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "User not found" },
        },
        { status: 404 }
      );
    }

    // remove password before sending response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        message: "User retrieved successfully",
        result: userWithoutPassword,
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
