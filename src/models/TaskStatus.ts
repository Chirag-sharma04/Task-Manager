import mongoose from "mongoose"

const TaskStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Status name is required"],
      trim: true,
      minlength: [2, "Status name must be at least 2 characters"],
      maxlength: [50, "Status name must be less than 50 characters"],
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
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Create index for case-insensitive unique name
TaskStatusSchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } })

export default mongoose.models.TaskStatus || mongoose.model("TaskStatus", TaskStatusSchema)
