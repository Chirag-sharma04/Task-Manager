import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB  from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }

    // Find user
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
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
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
