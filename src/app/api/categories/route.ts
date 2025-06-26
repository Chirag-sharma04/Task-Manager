import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import TaskStatus from "@/models/TaskStatus"
import TaskPriority from "@/models/TaskPriority"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "status") {
      const statuses = await TaskStatus.find({}).sort({ createdAt: -1 }).lean()
      return NextResponse.json({
        success: true,
        data: { statuses },
      })
    } else if (type === "priority") {
      const priorities = await TaskPriority.find({}).sort({ level: 1 }).lean()
      return NextResponse.json({
        success: true,
        data: { priorities },
      })
    } else {
      // Return both
      const [statuses, priorities] = await Promise.all([
        TaskStatus.find({}).sort({ createdAt: -1 }).lean(),
        TaskPriority.find({}).sort({ level: 1 }).lean(),
      ])

      return NextResponse.json({
        success: true,
        data: {
          statuses,
          priorities,
        },
      })
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, description, color, level, type } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and type are required",
        },
        { status: 400 },
      )
    }

    if (type === "status") {
      // Check if status name already exists
      const existingStatus = await TaskStatus.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      })

      if (existingStatus) {
        return NextResponse.json(
          {
            success: false,
            error: "A status with this name already exists",
          },
          { status: 400 },
        )
      }

      const newStatus = new TaskStatus({
        name: name.trim(),
        description: description?.trim(),
        color: color || "#6b7280",
        isDefault: false,
      })

      const savedStatus = await newStatus.save()

      return NextResponse.json(
        {
          success: true,
          data: savedStatus,
          message: "Status created successfully",
        },
        { status: 201 },
      )
    } else if (type === "priority") {
      // Check if priority name already exists
      const existingPriority = await TaskPriority.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      })

      if (existingPriority) {
        return NextResponse.json(
          {
            success: false,
            error: "A priority with this name already exists",
          },
          { status: 400 },
        )
      }

      // Check if priority level already exists
      if (level) {
        const existingLevel = await TaskPriority.findOne({ level })
        if (existingLevel) {
          return NextResponse.json(
            {
              success: false,
              error: `Priority level ${level} is already taken`,
            },
            { status: 400 },
          )
        }
      }

      const newPriority = new TaskPriority({
        name: name.trim(),
        description: description?.trim(),
        color: color || "#6b7280",
        level: level || 5,
        isDefault: false,
      })

      const savedPriority = await newPriority.save()

      return NextResponse.json(
        {
          success: true,
          data: savedPriority,
          message: "Priority created successfully",
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid type. Must be 'status' or 'priority'",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error creating category:", error)

    // Handle MongoDB validation errors
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as Record<string, unknown>).name === "ValidationError"
    ) {
      const validationErrors = Object.values(
        (error as Record<string, unknown>).errors as Record<string, { message: string }>
      ).map((err) => (err as { message: string }).message)
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${validationErrors.join(", ")}`,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
      },
      { status: 500 },
    )
  }
}
