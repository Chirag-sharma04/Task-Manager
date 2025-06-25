import mongoose, { type Document, Schema } from "mongoose"

export interface ITask extends Document {
  title: string
  description: string
  category: string
  priority: "Low" | "Moderate" | "High" | "Extreme" | "Ultimate"
  status: "Not Started" | "In Progress" | "Completed"
  dueDate?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
  user: mongoose.Types.ObjectId 
}

const TaskSchema = new Schema<ITask>(
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
    category: {
      type: String,
      required: [true, "Task category is required"],
      trim: true,
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
    dueDate: {
      type: Date,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for performance
TaskSchema.index({ status: 1 })
TaskSchema.index({ priority: 1 })
TaskSchema.index({ category: 1 })
TaskSchema.index({ createdAt: -1 })

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)
