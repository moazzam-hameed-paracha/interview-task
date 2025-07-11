import { readUsers } from "@/lib/store/userStore"
import { postAuthLoginReqSchema } from "@/lib/api/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validation = postAuthLoginReqSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Invalid request data", result: validation.error },
        },
        { status: 400 },
      )
    }

    const { email, password } = validation.data

    // Find user
    const users = await readUsers()
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: { message: "Invalid credentials" },
        },
        { status: 401 },
      )
    }

    // Generate mock token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`

    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      data: {
        message: "Login successful",
        result: {
          user: userWithoutPassword,
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
    response.cookies.set("role", user.role, {
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
