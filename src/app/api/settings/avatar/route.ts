import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    const formData = await request.formData()
    const file = formData.get("avatar") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 },
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File too large. Maximum size is 5MB" }, { status: 400 })
    }

    // Convert file to base64 for storage (in production, use cloud storage like AWS S3)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const avatarUrl = `data:${file.type};base64,${base64}`

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: avatarUrl,
        updatedAt: new Date(),
      },
      { new: true, select: "-password" },
    )

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
      avatar: avatarUrl,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json({ success: false, error: "Failed to upload avatar" }, { status: 500 })
  }
}
