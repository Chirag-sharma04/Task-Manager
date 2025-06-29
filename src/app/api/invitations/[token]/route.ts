import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Invitation from "@/models/Invitation"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest, { params }: { params: Promise<{token: string }> }) {
  try {
    await connectDB()

    const { token } = await params

    // Find invitation by token
    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    }).populate("invitedBy", "name email")

    if (!invitation) {
      return NextResponse.json({ success: false, error: "Invalid or expired invitation" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        email: invitation.email,
        invitedBy: invitation.invitedBy,
        message: invitation.message,
        expiresAt: invitation.expiresAt,
      },
    })
  } catch (error) {
    console.error("Error fetching invitation:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch invitation" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise <{ token: string }> }) {
  try {
    await connectDB()

    const { token } = await params
    const body = await request.json()
    const { name, password } = body

    // Validate required fields
    if (!name || !password) {
      return NextResponse.json({ success: false, error: "Name and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Find invitation by token
    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    })

    if (!invitation) {
      return NextResponse.json({ success: false, error: "Invalid or expired invitation" }, { status: 404 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: invitation.email })
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: invitation.email,
      password: hashedPassword,
    })

    await newUser.save()

    // Update invitation status
    invitation.status = "accepted"
    invitation.acceptedAt = new Date()
    await invitation.save()

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
          },
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return NextResponse.json({ success: false, error: "Failed to accept invitation" }, { status: 500 })
  }
}
