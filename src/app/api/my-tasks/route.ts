import { type NextRequest, NextResponse } from "next/server"

interface MyTask {
  id: string
  title: string
  description: string
  priority: "Extreme" | "Ultimate" | "High" | "Moderate" | "Low"
  status: "Not Started" | "In Progress" | "Completed"
  createdAt: string
  image?: string
  objective?: string
  taskDescription?: string
  additionalNotes?: string[]
  deadline?: string
}

// Mock data - in a real app, this would come from a database
const myTasks: MyTask[] = [
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
      "Review the list of documents required for submission and ensure all necessary documents are ready. Organize the documents accordingly and scan them if physical copies need to be submitted digitally. Rename the scanned files appropriately for easy identification and verify the accepted file formats. Upload the documents securely to the designated platform, double-check for accuracy, and obtain confirmation of successful submission. Follow up if necessary to ensure proper processing.",
    additionalNotes: [
      "Ensure that the documents are authentic and up-to-date.",
      "Maintain confidentiality and security of sensitive information during the submission process.",
      "If there are specific guidelines or deadlines for submission, adhere to them diligently.",
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    let filteredTasks = myTasks

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
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch my tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newTask: MyTask = {
      id: `mt${Date.now()}`,
      title: body.title,
      description: body.description,
      priority: body.priority || "Moderate",
      status: body.status || "Not Started",
      createdAt: new Date().toISOString(),
      image: body.image,
      objective: body.objective,
      taskDescription: body.taskDescription,
      additionalNotes: body.additionalNotes || [],
      deadline: body.deadline,
    }

    // In a real app, save to database
    myTasks.push(newTask)

    return NextResponse.json(
      {
        success: true,
        data: newTask,
        message: "Task created successfully",
      },
      { status: 201 },
    )
  } catch{
    return NextResponse.json({ success: false, error: "Failed to create task" }, { status: 500 })
  }
}
