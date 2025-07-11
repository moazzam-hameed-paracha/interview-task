import { readUsers } from "@/lib/store/userStore";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    let filteredUsers = await readUsers();

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role);
    }

    return NextResponse.json({
      success: true,
      data: {
        message: "Users retrieved successfully",
        result: filteredUsers,
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
