import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import VitalTask from "@/models/VitalTask"

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

    const vitalTasks = await VitalTask.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: vitalTasks,
      total: vitalTasks.length,
    })
  } catch (error) {
    console.error("Error fetching vital tasks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch vital tasks" }, { status: 500 })
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

    const newVitalTask = new VitalTask({
      title: body.title,
      description: body.description,
      priority: body.priority || "High",
      status: body.status || "Not Started",
      image: body.image,
      detailedSteps: body.detailedSteps || [],
    })

    const savedVitalTask = await newVitalTask.save()

    return NextResponse.json(
      {
        success: true,
        data: savedVitalTask,
        message: "Vital task created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating vital task:", error)
    return NextResponse.json({ success: false, error: "Failed to create vital task" }, { status: 500 })
  }
}
