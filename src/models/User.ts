import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      trim: true,
      default: "",
    },
    googleId: {
      type: String,
      sparse: true, // Allow multiple null values
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: false,
      },
      taskReminders: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes
userSchema.index({ email: 1 })
userSchema.index({ username: 1 })
userSchema.index({ googleId: 1 }, { sparse: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
