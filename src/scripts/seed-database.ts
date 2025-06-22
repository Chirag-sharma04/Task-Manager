import connectDB from "../lib/mongodb"
import Task from "../models/Task"
import VitalTask from "../models/VitalTask"
import MyTask from "../models/MyTask"

async function seedDatabase() {
  try {
    await connectDB()
    console.log("Connected to MongoDB")

    // Clear existing data
    await Task.deleteMany({})
    await VitalTask.deleteMany({})
    await MyTask.deleteMany({})
    console.log("Cleared existing data")

    // Seed regular tasks
    const tasks = [
      {
        title: "Attend Nischal's Birthday Party",
        description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements).....",
        category: "Personal",
        priority: "Moderate",
        status: "Not Started",
        dueDate: new Date("2023-06-20"),
        image: "/placeholder.svg",
      },
      {
        title: "Landing Page Design for TravelDays",
        description: "Get the work done by EOD and discuss with client before leaving (4 PM | Meeting Room)",
        category: "Work",
        priority: "High",
        status: "In Progress",
        dueDate: new Date("2023-06-20"),
        image: "/placeholder.svg",
      },
      {
        title: "Presentation on Final Product",
        description:
          "Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...",
        category: "Work",
        priority: "High",
        status: "In Progress",
        dueDate: new Date("2023-06-20"),
        image: "/placeholder.svg",
      },
    ]

    await Task.insertMany(tasks)
    console.log("Seeded regular tasks")

    // Seed vital tasks
    const vitalTasks = [
      {
        title: "Walk the dog",
        description: "Take the dog to the park and bring treats as well.",
        priority: "Extreme",
        status: "Not Started",
        image: "/placeholder.svg",
        detailedSteps: [
          "Listen to a podcast or audiobook",
          "Practice mindfulness or meditation",
          "Take photos of interesting sights along the way",
          "Practice obedience training with your dog",
          "Chat with neighbors or other dog walkers",
          "Listen to music or an upbeat playlist",
        ],
      },
      {
        title: "Take grandma to hospital",
        description: "Go back home and take grandma to the hospital for her appointment.",
        priority: "Extreme",
        status: "In Progress",
        image: "/placeholder.svg",
      },
    ]

    await VitalTask.insertMany(vitalTasks)
    console.log("Seeded vital tasks")

    // Seed my tasks
    const myTasks = [
      {
        title: "Submit Documents",
        description: "Make sure to submit all the necessary documents...",
        priority: "Extreme",
        status: "Not Started",
        image: "/placeholder.svg",
        objective: "To submit required documents for something important.",
        taskDescription:
          "Review the list of documents required for submission and ensure all necessary documents are ready. Organize the documents accordingly and scan them if physical copies need to be submitted digitally. Rename the scanned files appropriately for easy identification and verify the accepted file formats. Upload the documents securely to the designated platform, double-check for accuracy, and obtain confirmation of successful submission. Follow up if necessary to ensure proper processing.",
        additionalNotes: [
          "Ensure that the documents are authentic and up-to-date.",
          "Maintain confidentiality and security of sensitive information during the submission process.",
          "If there are specific guidelines or deadlines for submission, adhere to them diligently.",
        ],
        deadline: "End of Day",
      },
      {
        title: "Complete assignments",
        description: "The assignments must be completed by end of year...",
        priority: "Ultimate",
        status: "In Progress",
        image: "/placeholder.svg",
      },
    ]

    await MyTask.insertMany(myTasks)
    console.log("Seeded my tasks")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
