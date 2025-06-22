import mongoose, { type Document, Schema } from "mongoose"

export interface IMyTask extends Document {
  title: string
  description: string
  priority: "Low" | "Moderate" | "High" | "Extreme" | "Ultimate"
  status: "Not Started" | "In Progress" | "Completed"
  image?: string
  objective?: string
  taskDescription?: string
  additionalNotes?: string[]
  deadline?: string
  createdAt: Date
  updatedAt: Date
}

const MyTaskSchema = new Schema<IMyTask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    priority: {
      type: String,
      enum: ["Low", "Moderate", "High", "Extreme", "Ultimate"],
      default: "Moderate",
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    image: {
      type: String,
    },
    objective: {
      type: String,
      trim: true,
    },
    taskDescription: {
      type: String,
      trim: true,
    },
    additionalNotes: [
      {
        type: String,
        trim: true,
      },
    ],
    deadline: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
MyTaskSchema.index({ status: 1 })
MyTaskSchema.index({ priority: 1 })
MyTaskSchema.index({ createdAt: -1 })

export default mongoose.models.MyTask || mongoose.model<IMyTask>("MyTask", MyTaskSchema)
