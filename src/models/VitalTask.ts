import mongoose, { type Document, Schema } from "mongoose"

export interface IVitalTask extends Document {
  title: string
  description: string
  priority: "High" | "Extreme"
  status: "Not Started" | "In Progress" | "Completed"
  image?: string
  detailedSteps?: string[]
  createdAt: Date
  updatedAt: Date
}

const VitalTaskSchema = new Schema<IVitalTask>(
  {
    title: {
      type: String,
      required: [true, "Vital task title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Vital task description is required"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    priority: {
      type: String,
      enum: ["High", "Extreme"],
      default: "High",
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    image: {
      type: String,
    },
    detailedSteps: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
VitalTaskSchema.index({ status: 1 })
VitalTaskSchema.index({ priority: 1 })
VitalTaskSchema.index({ createdAt: -1 })

export default mongoose.models.VitalTask || mongoose.model<IVitalTask>("VitalTask", VitalTaskSchema)
