import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import TaskStatus from "@/models/TaskStatus"
import TaskPriority from "@/models/TaskPriority"
import Task from "@/models/Task"
import mongoose from "mongoose"

export async function PUT(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID format",
        },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { name, description, color, level, type } = body

    if (!name || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and type are required",
        },
        { status: 400 },
      )
    }

    if (type === "status") {
      // Check if another status with the same name exists (excluding current one)
      const existingStatus = await TaskStatus.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, "i") },
      })

      if (existingStatus) {
        return NextResponse.json(
          {
            success: false,
            error: "A status with this name already exists",
          },
          { status: 400 },
        )
      }

      const updatedStatus = await TaskStatus.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          description: description?.trim(),
          color: color || "#6b7280",
          updatedAt: new Date(),
        },
        { new: true, runValidators: true },
      )

      if (!updatedStatus) {
        return NextResponse.json(
          {
            success: false,
            error: "Status not found",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        data: updatedStatus,
        message: "Status updated successfully",
      })
    } else if (type === "priority") {
      // Check if another priority with the same name exists (excluding current one)
      const existingPriority = await TaskPriority.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, "i") },
      })

      if (existingPriority) {
        return NextResponse.json(
          {
            success: false,
            error: "A priority with this name already exists",
          },
          { status: 400 },
        )
      }

      // Check if another priority with the same level exists (excluding current one)
      if (level) {
        const existingLevel = await TaskPriority.findOne({
          _id: { $ne: id },
          level,
        })

        if (existingLevel) {
          return NextResponse.json(
            {
              success: false,
              error: `Priority level ${level} is already taken`,
            },
            { status: 400 },
          )
        }
      }

      const updatedPriority = await TaskPriority.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          description: description?.trim(),
          color: color || "#6b7280",
          level: level || 5,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true },
      )

      if (!updatedPriority) {
        return NextResponse.json(
          {
            success: false,
            error: "Priority not found",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        data: updatedPriority,
        message: "Priority updated successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid type. Must be 'status' or 'priority'",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error updating category:", error)

    // Handle MongoDB validation errors
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as mongoose.Error.ValidationError).name === "ValidationError"
    ) {
      const validationErrors = Object.values((error as mongoose.Error.ValidationError).errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message,
      )
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${validationErrors.join(", ")}`,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update category",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{id: string }> }) {
  const { id } = await params;
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid ID format",
        },
        { status: 400 },
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (!type || !["status", "priority"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Type parameter is required and must be 'status' or 'priority'",
        },
        { status: 400 },
      )
    }

    if (type === "status") {
      const status = await TaskStatus.findById(id)

      if (!status) {
        return NextResponse.json(
          {
            success: false,
            error: "Status not found",
          },
          { status: 404 },
        )
      }

      // Check if it's a default status
      if (status.isDefault) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot delete default status",
          },
          { status: 400 },
        )
      }

      // Check if any tasks are using this status
      const tasksUsingStatus = await Task.countDocuments({ status: status.name })

      if (tasksUsingStatus > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot delete status. ${tasksUsingStatus} task(s) are using this status.`,
          },
          { status: 400 },
        )
      }

      await TaskStatus.findByIdAndDelete(id)

      return NextResponse.json({
        success: true,
        message: "Status deleted successfully",
      })
    } else if (type === "priority") {
      const priority = await TaskPriority.findById(id)

      if (!priority) {
        return NextResponse.json(
          {
            success: false,
            error: "Priority not found",
          },
          { status: 404 },
        )
      }

      // Check if it's a default priority
      if (priority.isDefault) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot delete default priority",
          },
          { status: 400 },
        )
      }

      // Check if any tasks are using this priority
      const tasksUsingPriority = await Task.countDocuments({ priority: priority.name })

      if (tasksUsingPriority > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot delete priority. ${tasksUsingPriority} task(s) are using this priority.`,
          },
          { status: 400 },
        )
      }

      await TaskPriority.findByIdAndDelete(id)

      return NextResponse.json({
        success: true,
        message: "Priority deleted successfully",
      })
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete category",
      },
      { status: 500 },
    )
  }
}
