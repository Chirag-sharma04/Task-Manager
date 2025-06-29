import mongoose from "mongoose"

export interface IInvitation {
  _id?: string
  email: string
  invitedBy: mongoose.Types.ObjectId
  message?: string
  status: "pending" | "accepted" | "declined" | "expired"
  token: string
  expiresAt: Date
  acceptedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

const invitationSchema = new mongoose.Schema<IInvitation>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Inviter is required"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
invitationSchema.index({ email: 1, status: 1 })
invitationSchema.index({ token: 1 })
invitationSchema.index({ expiresAt: 1 })
invitationSchema.index({ invitedBy: 1 })

// Auto-expire invitations
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", invitationSchema)
