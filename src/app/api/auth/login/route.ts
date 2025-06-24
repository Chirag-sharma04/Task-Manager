import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectDB  from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { username, password } = await request.json()

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password (skip for Google users)
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
