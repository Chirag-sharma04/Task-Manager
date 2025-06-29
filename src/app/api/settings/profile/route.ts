import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { firstName, lastName, email, contactNumber } = body

    // Validate required fields
    if (!firstName || !email) {
      return NextResponse.json({ success: false, error: "First name and email are required" }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email is already taken" }, { status: 400 })
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: firstName.trim(),
        lastName: lastName?.trim() || "",
        email: email.toLowerCase().trim(),
        contactNumber: contactNumber?.trim() || "",
        updatedAt: new Date(),
      },
      { new: true, select: "-password" },
    )

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 })
  }
}
