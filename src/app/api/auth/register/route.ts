import { postAuthRegisterReqSchema } from "@/lib/api/auth"
import { readUsers, writeUsers } from "@/lib/store/userStore"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validation = postAuthRegisterReqSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Invalid request data", result: validation.error },
        },
        { status: 400 },
      )
    }

    const { email, password, name } = validation.data

    // Simulate user creation
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: "user" as const,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      password,
    }

    // Persist user to JSON store
    const users = await readUsers()
    users.push(newUser)
    writeUsers(users)

    // Generate mock token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`

    const response = NextResponse.json({
      success: true,
      data: {
        message: "Registration successful",
        result: {
          user: newUser,
          token,
        },
      },
    })

    // Set cookies for token and role
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    response.cookies.set("role", newUser.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return response
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: { message: "Internal server error" },
      },
      { status: 500 },
    )
  }
}
