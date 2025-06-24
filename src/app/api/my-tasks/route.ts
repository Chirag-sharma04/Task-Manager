import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import MyTask from "@/models/MyTask"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    const query: Record<string, unknown> = {}

    if (status) query.status = status
    if (priority) query.priority = priority
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const myTasks = await MyTask.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: myTasks,
      total: myTasks.length,
    })
  } catch (error) {
    console.error("Error fetching my tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch my tasks" }, { status: 500 })
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

    const newMyTask = new MyTask({
      title: body.title,
      description: body.description,
      priority: body.priority || "Moderate",
      status: body.status || "Not Started",
      image: body.image,
      objective: body.objective,
      taskDescription: body.taskDescription,
      additionalNotes: body.additionalNotes || [],
      deadline: body.deadline,
    })

    const savedMyTask = await newMyTask.save()

    return NextResponse.json(
      {
        success: true,
        data: savedMyTask,
        message: "Task created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating my task:", error)
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
