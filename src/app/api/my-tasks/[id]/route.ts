import { type NextRequest, NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
const myTasks = [
  {
    id: "mt1",
    title: "Submit Documents",
    description: "Make sure to submit all the necessary documents...",
    priority: "Extreme",
    status: "Not Started",
    createdAt: "2023-08-20T00:00:00Z",
    image: "/placeholder.svg",
    objective: "To submit required documents for something important.",
    taskDescription:
      "Review the list of documents required for submission and ensure all necessary documents are ready.",
    additionalNotes: [
      "Ensure that the documents are authentic and up-to-date.",
      "Maintain confidentiality and security of sensitive information during the submission process.",
    ],
    deadline: "End of Day",
  },
  {
    id: "mt2",
    title: "Complete assignments",
    description: "The assignments must be completed by end of year...",
    priority: "Ultimate",
    status: "In Progress",
    createdAt: "2023-08-20T00:00:00Z",
    image: "/placeholder.svg",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const task = myTasks.find((t) => t.id === params.id)

    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch{
    return NextResponse.json({ success: false, error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const taskIndex = myTasks.findIndex((t) => t.id === params.id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    myTasks[taskIndex] = {
      ...myTasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: myTasks[taskIndex],
      message: "Task updated successfully",
    })
  } catch{
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskIndex = myTasks.findIndex((t) => t.id === params.id)

    if (taskIndex === -1) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    const deletedTask = myTasks.splice(taskIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedTask,
      message: "Task deleted successfully",
    })
  } catch{
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
