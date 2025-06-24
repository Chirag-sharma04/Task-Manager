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

// Mock data -
let taskStatuses: TaskStatus[] = [
  { id: 1, name: "Completed", createdAt: "2023-08-20T00:00:00Z" },
  { id: 2, name: "In Progress", createdAt: "2023-08-20T00:00:00Z" },
  { id: 3, name: "Not Started", createdAt: "2023-08-20T00:00:00Z" },
]

let taskPriorities: TaskPriority[] = [
  { id: 1, name: "Extreme", createdAt: "2023-08-20T00:00:00Z" },
  { id: 2, name: "Moderate", createdAt: "2023-08-20T00:00:00Z" },
  { id: 3, name: "Low", createdAt: "2023-08-20T00:00:00Z" },
]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { 
  const { id: rawId } = await params; 
  const id = Number.parseInt(rawId); 

  try {
    const body = await request.json();
    const { type, name } = body;

    if (type === "status") {
      const statusIndex = taskStatuses.findIndex((status) => status.id === id);
      if (statusIndex === -1) {
        return NextResponse.json({ success: false, error: "Task status not found" }, { status: 404 });
      }

      taskStatuses[statusIndex] = {
        ...taskStatuses[statusIndex],
        name,
      };

      return NextResponse.json({
        success: true,
        data: taskStatuses[statusIndex],
        message: "Task status updated successfully",
      });
    } else if (type === "priority") {
      const priorityIndex = taskPriorities.findIndex((priority) => priority.id === id);
      if (priorityIndex === -1) {
        return NextResponse.json({ success: false, error: "Task priority not found" }, { status: 404 });
      }

      taskPriorities[priorityIndex] = {
        ...taskPriorities[priorityIndex],
        name,
      };

      return NextResponse.json({
        success: true,
        data: taskPriorities[priorityIndex],
        message: "Task priority updated successfully",
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid type specified" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) { 
  const { id: rawId } = await params; 
  const id = Number.parseInt(rawId); 

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "status") {
      const statusIndex = taskStatuses.findIndex((status) => status.id === id);
      if (statusIndex === -1) {
        return NextResponse.json({ success: false, error: "Task status not found" }, { status: 404 });
      }

      const deletedStatus = taskStatuses[statusIndex];
      taskStatuses = taskStatuses.filter((status) => status.id !== id);

      return NextResponse.json({
        success: true,
        data: deletedStatus,
        message: "Task status deleted successfully",
      });
    } else if (type === "priority") {
      const priorityIndex = taskPriorities.findIndex((priority) => priority.id === id);
      if (priorityIndex === -1) {
        return NextResponse.json({ success: false, error: "Task priority not found" }, { status: 404 });
      }

      const deletedPriority = taskPriorities[priorityIndex];
      taskPriorities = taskPriorities.filter((priority) => priority.id !== id);

      return NextResponse.json({
        success: true,
        data: deletedPriority,
        message: "Task priority deleted successfully",
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid type specified" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}