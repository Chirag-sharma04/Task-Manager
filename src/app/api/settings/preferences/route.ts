import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase  from "@/lib/mongodb"
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
    const { emailNotifications, pushNotifications, taskReminders, weeklyReports } = body

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        preferences: {
          emailNotifications: Boolean(emailNotifications),
          pushNotifications: Boolean(pushNotifications),
          taskReminders: Boolean(taskReminders),
          weeklyReports: Boolean(weeklyReports),
        },
        updatedAt: new Date(),
      },
      { new: true, select: "-password" },
    )

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      preferences: updatedUser.preferences,
    })
  } catch (error) {
    console.error("Preferences update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 })
  }
}
