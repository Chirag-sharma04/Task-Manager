import { type NextRequest, NextResponse } from "next/server"

interface TaskStatus {
  id: number
  name: string
  createdAt: string
}

interface TaskPriority {
  id: number
  name: string
  createdAt: string
}

// Mock data - in a real app, this would come from a database
const taskStatuses: TaskStatus[] = [
  { id: 1, name: "Completed", createdAt: "2023-08-20T00:00:00Z" },
  { id: 2, name: "In Progress", createdAt: "2023-08-20T00:00:00Z" },
  { id: 3, name: "Not Started", createdAt: "2023-08-20T00:00:00Z" },
]

const taskPriorities: TaskPriority[] = [
  { id: 1, name: "Extreme", createdAt: "2023-08-20T00:00:00Z" },
  { id: 2, name: "Moderate", createdAt: "2023-08-20T00:00:00Z" },
  { id: 3, name: "Low", createdAt: "2023-08-20T00:00:00Z" },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'status' or 'priority'

    if (type === "status") {
      return NextResponse.json({
        success: true,
        data: taskStatuses,
        total: taskStatuses.length,
      })
    } else if (type === "priority") {
      return NextResponse.json({
        success: true,
        data: taskPriorities,
        total: taskPriorities.length,
      })
    } else {
      return NextResponse.json({
        success: true,
        data: {
          statuses: taskStatuses,
          priorities: taskPriorities,
        },
      })
    }
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name } = body

    if (type === "status") {
      const newStatus: TaskStatus = {
        id: Math.max(...taskStatuses.map((s) => s.id), 0) + 1,
        name,
        createdAt: new Date().toISOString(),
      }
      taskStatuses.push(newStatus)

      return NextResponse.json(
        {
          success: true,
          data: newStatus,
          message: "Task status created successfully",
        },
        { status: 201 },
      )
    } else if (type === "priority") {
      const newPriority: TaskPriority = {
        id: Math.max(...taskPriorities.map((p) => p.id), 0) + 1,
        name,
        createdAt: new Date().toISOString(),
      }
      taskPriorities.push(newPriority)

      return NextResponse.json(
        {
          success: true,
          data: newPriority,
          message: "Task priority created successfully",
        },
        { status: 201 },
      )
    } else {
      return NextResponse.json({ success: false, error: "Invalid type specified" }, { status: 400 })
    }
  } catch  {
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
