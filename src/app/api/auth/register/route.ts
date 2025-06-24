import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectDB  from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { firstName, lastName, username, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    })

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    // Create response
    const response = NextResponse.json({
      message: "User created successfully",
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
