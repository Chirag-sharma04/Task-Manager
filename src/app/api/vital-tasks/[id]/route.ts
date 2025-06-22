import { type NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
const vitalTasks = [
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const task = vitalTasks.find((t) => t.id === params.id)

    if (!task) {
      return NextResponse.json({ success: false, error: "Vital task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch vital task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const taskIndex = vitalTasks.findIndex((t) => t.id === params.id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Vital task not found" }, { status: 404 })
    }

    vitalTasks[taskIndex] = {
      ...vitalTasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: vitalTasks[taskIndex],
      message: "Vital task updated successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update vital task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskIndex = vitalTasks.findIndex((t) => t.id === params.id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Vital task not found" }, { status: 404 })
    }

    const deletedTask = vitalTasks.splice(taskIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedTask,
      message: "Vital task deleted successfully",
    })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete vital task" }, { status: 500 })
  }
}
