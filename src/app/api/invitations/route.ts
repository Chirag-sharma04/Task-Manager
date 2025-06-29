import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongodb"
import Invitation from "@/models/Invitation"
import User from "@/models/User"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get user from JWT token
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    let userId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      userId = decoded.userId
    } catch  {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    // Verify user exists
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { email, message } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    // Check if user is trying to invite themselves
    if (email.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: "You cannot invite yourself" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 })
    }

    // Check if there's already a pending invitation for this email
    const existingInvitation = await Invitation.findOne({
      email: email.toLowerCase(),
      status: "pending",
      expiresAt: { $gt: new Date() },
    })

    if (existingInvitation) {
      return NextResponse.json(
        { success: false, error: "An invitation has already been sent to this email" },
        { status: 400 },
      )
    }

    // Generate unique invitation token
    const invitationToken = crypto.randomBytes(32).toString("hex")

    // Create invitation
    const invitation = new Invitation({
      email: email.toLowerCase(),
      invitedBy: userId,
      message: message || "",
      token: invitationToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })

    await invitation.save()

    // In a real application, you would send an email here
    // For now, we'll just return success
    console.log(`Invitation sent to ${email} with token: ${invitationToken}`)
    console.log(`Invitation link: ${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitationToken}`)

    return NextResponse.json(
      {
        success: true,
        message: "Invitation sent successfully",
        data: {
          email: invitation.email,
          token: invitation.token,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error sending invitation:", error)
    return NextResponse.json({ success: false, error: "Failed to send invitation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get user from JWT token
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    let userId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      userId = decoded.userId
    } catch {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    // Build query
    const query: Record<string, unknown> = { invitedBy: userId }
    if (status) {
      query.status = status
    }

    // Get invitations with pagination
    const skip = (page - 1) * limit
    const invitations = await Invitation.find(query)
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Invitation.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: invitations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch invitations" }, { status: 500 })
  }
}
