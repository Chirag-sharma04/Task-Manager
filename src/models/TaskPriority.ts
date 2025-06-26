import mongoose from "mongoose"

const TaskPrioritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Priority name is required"],
      trim: true,
      minlength: [2, "Priority name must be at least 2 characters"],
      maxlength: [50, "Priority name must be less than 50 characters"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description must be less than 200 characters"],
    },
    color: {
      type: String,
      default: "#6b7280",
      match: [/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"],
    },
    level: {
      type: Number,
      required: [true, "Priority level is required"],
      min: [1, "Priority level must be at least 1"],
      max: [10, "Priority level must be at most 10"],
      unique: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes
TaskPrioritySchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } })
TaskPrioritySchema.index({ level: 1 }, { unique: true })

export default mongoose.models.TaskPriority || mongoose.model("TaskPriority", TaskPrioritySchema)
