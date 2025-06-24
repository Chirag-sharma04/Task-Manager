import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import VitalTask from "@/models/VitalTask"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid task ID" }, { status: 400 })
    }

    const vitalTask = await VitalTask.findById(id).lean()

    if (!vitalTask) {
      return NextResponse.json({ success: false, error: "Vital task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: vitalTask,
    })
  } catch (error) {
    console.error("Error fetching vital task:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch vital task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid task ID" }, { status: 400 })
    }

    const body = await request.json();

    const updatedVitalTask = await VitalTask.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    ).lean()

    if (!updatedVitalTask) {
      return NextResponse.json({ success: false, error: "Vital task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedVitalTask,
      message: "Vital task updated successfully",
    })
  } catch (error) {
    console.error("Error updating vital task:", error)
    return NextResponse.json({ success: false, error: "Failed to update vital task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;

  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid task ID" }, { status: 400 })
    }

    const deletedVitalTask = await VitalTask.findByIdAndDelete(id).lean()

    if (!deletedVitalTask) {
      return NextResponse.json({ success: false, error: "Vital task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: deletedVitalTask,
      message: "Vital task deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting vital task:", error)
    return NextResponse.json({ success: false, error: "Failed to delete vital task" }, { status: 500 })
  }
}
