import { type NextRequest, NextResponse } from "next/server"

interface VitalTask {
  id: string
  title: string
  description: string
  priority: "Extreme" | "High"
  status: "Not Started" | "In Progress" | "Completed"
  createdAt: string
  image?: string
  detailedSteps?: string[]
}

// Mock data - in a real app, this would come from a database
const vitalTasks: VitalTask[] = [
  {
    id: "v1",
    title: "Walk the dog",
    description: "Take the dog to the park and bring treats as well.",
    priority: "Extreme",
    status: "Not Started",
    createdAt: "2023-08-20T00:00:00Z",
    image: "/placeholder.svg",
    detailedSteps: [
      "Listen to a podcast or audiobook",
      "Practice mindfulness or meditation",
      "Take photos of interesting sights along the way",
      "Practice obedience training with your dog",
      "Chat with neighbors or other dog walkers",
      "Listen to music or an upbeat playlist",
    ],
  },
  {
    id: "v2",
    title: "Take grandma to hospital",
    description: "Go back home and take grandma to the hospital for her appointment.",
    priority: "Extreme",
    status: "In Progress",
    createdAt: "2023-08-20T00:00:00Z",
    image: "/placeholder.svg",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    let filteredTasks = vitalTasks

    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status)
    }

    if (priority) {
      filteredTasks = filteredTasks.filter((task) => task.priority === priority)
    }

    return NextResponse.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length,
    })
  } catch  {
    return NextResponse.json({ success: false, error: "Failed to fetch vital tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newTask: VitalTask = {
      id: `v${Date.now()}`,
      title: body.title,
      description: body.description,
      priority: body.priority || "High",
      status: body.status || "Not Started",
      createdAt: new Date().toISOString(),
      image: body.image,
      detailedSteps: body.detailedSteps || [],
    }

    // In a real app, save to database
    vitalTasks.push(newTask)

    return NextResponse.json(
      {
        success: true,
        data: newTask,
        message: "Vital task created successfully",
      },
      { status: 201 },
    )
  } catch{
    return NextResponse.json({ success: false, error: "Failed to create vital task" }, { status: 500 })
  }
}
