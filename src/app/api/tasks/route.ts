import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Task from "@/models/Task"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query: Record<string, unknown> = {}

    if (status) query.status = status
    if (priority) query.priority = priority
    if (category) query.category = category
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get tasks with pagination
    const tasks = await Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    // Get total count for pagination
    const total = await Task.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json({ success: false, error: "Title and description are required" }, { status: 400 })
    }

    const newTask = new Task({
      title: body.title,
      description: body.description,
      category: body.category || "Personal",
      priority: body.priority || "Moderate",
      status: body.status || "Not Started",
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      image: body.image,
    })

    const savedTask = await newTask.save()

    return NextResponse.json(
      {
        success: true,
        data: savedTask,
        message: "Task created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
