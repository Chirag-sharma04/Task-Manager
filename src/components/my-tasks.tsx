"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import {
  Search,
  Bell,
  Calendar,
  LayoutDashboard,
  Zap,
  CheckSquare,
  Grid3X3,
  Settings,
  HelpCircle,
  LogOut,
  Edit,
  Trash2,
  Menu,
  X,
} from "lucide-react"
import Image from "next/image"

interface MyTask {
  id: string
  title: string
  description: string
  priority: "Extreme" | "Ultimate" | "High" | "Moderate" | "Low"
  status: "Not Started" | "In Progress" | "Completed"
  createdAt: string
  image?: string
  objective?: string
  taskDescription?: string
  additionalNotes?: string[]
  deadline?: string
}

const myTasks: MyTask[] = [
  {
    id: "mt1",
    title: "Submit Documents",
    description: "Make sure to submit all the necessary documents...",
    priority: "Extreme",
    status: "Not Started",
    createdAt: "20/08/2023",
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
    id: "mt2",
    title: "Complete assignments",
    description: "The assignments must be completed by end of year...",
    priority: "Ultimate",
    status: "In Progress",
    createdAt: "20/08/2023",
    image: "/placeholder.svg",
  },
]

export default function MyTasks() {
  const [selectedTask, setSelectedTask] = useState<MyTask>(myTasks[0])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, route: "/" },
    { icon: Zap, label: "Vital Task", active: false, route: "/vital" },
    { icon: CheckSquare, label: "My Task", active: true, route: "/tasks" },
    { icon: Grid3X3, label: "Task Categories", active: false, route: "/categories" },
    { icon: Settings, label: "Settings", active: false, route: "/settings" },
    { icon: HelpCircle, label: "Help", active: false, route: "/help" },
  ]

  const handleNavigation = (route: string) => {
    router.push(route)
    setIsSidebarOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Ultimate":
        return "text-purple-600"
      case "Extreme":
        return "text-red-500"
      case "High":
        return "text-orange-500"
      case "Moderate":
        return "text-yellow-500"
      case "Low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-500"
      case "In Progress":
        return "text-blue-500"
      case "Not Started":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black dark:bg-gray-950 text-white flex flex-col transition-transform duration-300 ease-in-out`}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 lg:p-6 text-center">
          <Avatar className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-coral-500 text-white">AM</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-base lg:text-lg">amanuel</h3>
          <p className="text-gray-400 text-xs lg:text-sm">amanuel@gmail.com</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 lg:px-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg mb-2 text-left transition-colors text-sm lg:text-base ${
                item.active ? "bg-coral-500 text-white" : "text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 lg:p-4">
          <button className="w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 rounded-lg text-sm lg:text-base">
            <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-6 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-600 dark:text-gray-300"
              >
                <Menu className="w-5 h-5" />
              </Button>

              <h1 className="text-xl lg:text-2xl font-bold">
                <span className="text-coral-500">To-</span>
                <span className="text-black dark:text-white">Do</span>
              </h1>

              {/* Search - Hidden on small screens */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your task here..."
                  className="pl-10 w-60 lg:w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                <Search className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
              >
                <Bell className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
              >
                <Calendar className="w-4 h-4" />
              </Button>

              <ThemeToggle />

              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium dark:text-white">Tuesday</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">20/08/2023</p>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="relative mt-3 md:hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your task here..."
              className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 lg:p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full">
            {/* My Tasks List */}
            <div>
              <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 lg:p-6">
                  <h2 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 dark:text-white">My Tasks</h2>

                  <div className="space-y-3 lg:space-y-4">
                    {myTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTask.id === task.id
                            ? "ring-2 ring-coral-500 border-coral-500"
                            : "border-gray-200 dark:border-gray-600"
                        } dark:bg-gray-700`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <CardContent className="p-3 lg:p-4">
                          <div className="flex gap-3 lg:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-2">
                                <div
                                  className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full mt-1 flex-shrink-0 ${
                                    task.status === "Not Started"
                                      ? "bg-red-500"
                                      : task.status === "In Progress"
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm lg:text-base mb-1 dark:text-white truncate">
                                    {task.title}
                                  </h3>
                                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                    {task.description}
                                  </p>

                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                                      Priority: {task.priority}
                                    </span>
                                    <span className={`font-medium ${getStatusColor(task.status)}`}>
                                      Status: {task.status}
                                    </span>
                                    <span className="text-gray-400 hidden sm:inline">Created on: {task.createdAt}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex-shrink-0">
                              <Image
                                src={task.image || "/placeholder.svg"}
                                alt={task.title}
                                width={50}
                                height={60}
                                className=" object-cover rounded-lg"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Task Detail View */}
            <div>
              <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
                    <h2 className="text-base lg:text-lg font-semibold dark:text-white truncate">
                      {selectedTask.title}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-xs"
                      >
                        <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 dark:border-red-600 dark:text-red-400 text-xs"
                      >
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>

                  {/* Task Image */}
                  <div className="mb-4 lg:mb-6">
                    <div className="w-full h-32 lg:h-48 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                      <Image
                        src={selectedTask.image || "/placeholder.svg"}
                        alt={selectedTask.title}
                        width={50}
                        height={50}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Task Info */}
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm">
                      <span className={`font-medium ${getPriorityColor(selectedTask.priority)}`}>
                        Priority: {selectedTask.priority}
                      </span>
                      <span className={`font-medium ${getStatusColor(selectedTask.status)}`}>
                        Status: {selectedTask.status}
                      </span>
                    </div>

                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-gray-400">Created on: {selectedTask.createdAt}</span>
                    </div>

                    {selectedTask.objective && (
                      <div>
                        <h3 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                          <strong>Task Title:</strong> Document Submission
                        </h3>
                        <h4 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                          <strong>Objective:</strong>
                        </h4>
                        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {selectedTask.objective}
                        </p>
                      </div>
                    )}

                    {selectedTask.taskDescription && (
                      <div>
                        <h4 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                          <strong>Task Description:</strong>
                        </h4>
                        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {selectedTask.taskDescription}
                        </p>
                      </div>
                    )}

                    {selectedTask.additionalNotes && (
                      <div>
                        <h4 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                          <strong>Additional Notes:</strong>
                        </h4>
                        <ul className="space-y-2">
                          {selectedTask.additionalNotes.map((note, index) => (
                            <li key={index} className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                              <span className="text-coral-500 flex-shrink-0">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedTask.deadline && (
                      <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-medium text-sm lg:text-base mb-1 dark:text-white">
                          <strong>Deadline for Submission:</strong>
                        </h4>
                        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{selectedTask.deadline}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
