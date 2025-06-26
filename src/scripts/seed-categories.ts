import  connectDB  from "@/lib/mongodb"
import TaskStatus from "@/models/TaskStatus"
import TaskPriority from "@/models/TaskPriority"

const defaultStatuses = [
  {
    name: "Not Started",
    description: "Task has not been started yet",
    color: "#ef4444",
    isDefault: true,
  },
  {
    name: "In Progress",
    description: "Task is currently being worked on",
    color: "#3b82f6",
    isDefault: true,
  },
  {
    name: "Completed",
    description: "Task has been completed successfully",
    color: "#22c55e",
    isDefault: true,
  },
  {
    name: "On Hold",
    description: "Task is temporarily paused",
    color: "#eab308",
    isDefault: true,
  },
]

const defaultPriorities = [
  {
    name: "Low",
    description: "Low priority task",
    color: "#22c55e",
    level: 2,
    isDefault: true,
  },
  {
    name: "Moderate",
    description: "Moderate priority task",
    color: "#eab308",
    level: 5,
    isDefault: true,
  },
  {
    name: "High",
    description: "High priority task",
    color: "#f97316",
    level: 8,
    isDefault: true,
  },
  {
    name: "Extreme",
    description: "Extremely urgent task",
    color: "#ef4444",
    level: 10,
    isDefault: true,
  },
]

async function seedCategories() {
  try {
    await connectDB()
    console.log("Connected to MongoDB")

    // Seed statuses
    console.log("Seeding task statuses...")
    for (const status of defaultStatuses) {
      const existingStatus = await TaskStatus.findOne({ name: status.name })
      if (!existingStatus) {
        await TaskStatus.create(status)
        console.log(`Created status: ${status.name}`)
      } else {
        console.log(`Status already exists: ${status.name}`)
      }
    }

    // Seed priorities
    console.log("Seeding task priorities...")
    for (const priority of defaultPriorities) {
      const existingPriority = await TaskPriority.findOne({ name: priority.name })
      if (!existingPriority) {
        await TaskPriority.create(priority)
        console.log(`Created priority: ${priority.name}`)
      } else {
        console.log(`Priority already exists: ${priority.name}`)
      }
    }

    console.log("Categories seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding categories:", error)
  }
}

seedCategories()
