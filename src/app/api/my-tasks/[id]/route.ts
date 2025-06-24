import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import MyTask from "@/models/MyTask"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid task ID" }, { status: 400 })
    }

    const myTask = await MyTask.findById(id).lean()

    if (!myTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: myTask,
    })
  } catch (error) {
    console.error("Error fetching my task:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid task ID" }, { status: 400 })
    }

    const body = await request.json()

    const updatedMyTask = await MyTask.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    ).lean()

    if (!updatedMyTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedMyTask,
      message: "Task updated successfully",
    })
  } catch (error) {
    console.error("Error updating my task:", error)
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;

  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid task ID" }, { status: 400 })
    }

    const deletedMyTask = await MyTask.findByIdAndDelete(id).lean()

    if (!deletedMyTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: deletedMyTask,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting my task:", error)
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 })
  }
}
