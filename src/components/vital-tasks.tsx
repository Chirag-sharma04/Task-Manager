"use client"

import { useState, useEffect, useCallback } from "react"
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
  Plus,
} from "lucide-react"
import VitalTaskModal from "./vital-task-modal"
import { useApi } from "@/hooks/use-api"


interface VitalTask {
  _id: string
  title: string
  description: string
  priority: "Extreme" | "High"
  status: "Not Started" | "In Progress" | "Completed"
  createdAt: string
  updatedAt: string
  image?: string
  detailedSteps?: string[]
}

export default function VitalTasks() {
  const [vitalTasks, setVitalTasks] = useState<VitalTask[]>([])
  const [selectedTask, setSelectedTask] = useState<VitalTask | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<VitalTask | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { loading: deleteLoading, delete: deleteTask } = useApi({
    onSuccess: () => {
      fetchVitalTasks()
      if (selectedTask && editingTask && selectedTask._id === editingTask._id) {
        setSelectedTask(null)
      }
    },
    onError: (error) => {
      console.error("Error deleting vital task:", error)
    },
  })

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, route: "/" },
    { icon: Zap, label: "Vital Task", active: true, route: "/vital" },
    { icon: CheckSquare, label: "My Task", active: false, route: "/tasks" },
    { icon: Grid3X3, label: "Task Categories", active: false, route: "/categories" },
    { icon: Settings, label: "Settings", active: false, route: "/settings" },
    { icon: HelpCircle, label: "Help", active: false, route: "/help" },
  ]

  const fetchVitalTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/vital-tasks?search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.success) {
        setVitalTasks(data.data || [])
        // Set first task as selected if no task is selected and tasks exist
        if (!selectedTask && data.data && data.data.length > 0) {
          setSelectedTask(data.data[0])
        }
      } else {
        console.error("Failed to fetch vital tasks:", data.error)
        setVitalTasks([])
      }
    } catch (error) {
      console.error("Error fetching vital tasks:", error)
      setVitalTasks([])
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, selectedTask])

  useEffect(() => {
    fetchVitalTasks()
  }, [fetchVitalTasks])

  const handleNavigation = (route: string) => {
    router.push(route)
    setIsSidebarOpen(false)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: VitalTask) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (task: VitalTask) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(`/api/vital-tasks/${task._id}`)
    }
  }

  const handleModalSuccess = () => {
    fetchVitalTasks()
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleTaskSelect = (task: VitalTask) => {
    setSelectedTask(task)
  }

  const getPriorityColor = (priority: string) => {
    return priority === "Extreme" ? "text-red-500" : "text-orange-500"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const filteredTasks = vitalTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <AvatarFallback className="bg-coral-500 text-white">UN</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-base lg:text-lg">user name</h3>
          <p className="text-gray-400 text-xs lg:text-sm">user@gmail.com</p>
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
                  placeholder="Search vital tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-60 lg:w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <Button size="sm" className="bg-coral-500 hover:bg-coral-600" onClick={handleAddTask}>
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add Task</span>
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
                <p className="text-sm font-medium dark:text-white">{new Date().toLocaleDateString("en-US", { weekday: "long" })}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="relative mt-3 md:hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search vital tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 lg:p-6 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading vital tasks...</p>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  {searchTerm ? "No vital tasks found" : "No vital tasks yet"}
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first vital task to get started"}
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddTask} className="bg-coral-500 hover:bg-coral-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vital Task
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full">
              {/* Vital Tasks List */}
              <div>
                <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                      <h2 className="text-base lg:text-lg font-semibold dark:text-white">
                        Vital Tasks ({filteredTasks.length})
                      </h2>
                      <Button size="sm" onClick={handleAddTask} className="bg-coral-500 hover:bg-coral-600">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3 lg:space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {filteredTasks.map((task) => (
                        <Card
                          key={task._id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedTask?._id === task._id
                              ? "ring-2 ring-coral-500 border-coral-500"
                              : "border-gray-200 dark:border-gray-600"
                          } dark:bg-gray-700`}
                          onClick={() => handleTaskSelect(task)}
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
                                      <span className="text-gray-400 hidden sm:inline">
                                        Created: {formatDate(task.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex-shrink-0">
                                <img
                                  src={task.image || "/placeholder.svg?height=48&width=48"}
                                  alt={task.title}
                                  className="w-full h-full object-cover rounded-lg"
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
                {selectedTask ? (
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
                            onClick={() => handleEditTask(selectedTask)}
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-xs"
                          >
                            <Edit className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTask(selectedTask)}
                            disabled={deleteLoading}
                            className="text-red-600 hover:text-red-700 dark:border-red-600 dark:text-red-400 text-xs"
                          >
                            <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                            <span className="hidden sm:inline">{deleteLoading ? "Deleting..." : "Delete"}</span>
                          </Button>
                        </div>
                      </div>

                      {/* Task Image */}
                      {selectedTask.image && (
                        <div className="mb-4 lg:mb-6">
                          <div className="w-full h-32 lg:h-48 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                            <img
                              src={selectedTask.image || "/placeholder.svg"}
                              alt={selectedTask.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Task Info */}
                      <div className="mb-4 lg:mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm mb-4">
                          <span className={`font-medium ${getPriorityColor(selectedTask.priority)}`}>
                            Priority: {selectedTask.priority}
                          </span>
                          <span className={`font-medium ${getStatusColor(selectedTask.status)}`}>
                            Status: {selectedTask.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm mb-4">
                          {selectedTask.description}
                        </p>
                      </div>

                      {/* Detailed Steps */}
                      {selectedTask.detailedSteps && selectedTask.detailedSteps.length > 0 && (
                        <div className="mb-4 lg:mb-6">
                          <h3 className="font-medium text-sm lg:text-base mb-3 dark:text-white">Activities:</h3>
                          <ol className="space-y-2">
                            {selectedTask.detailedSteps.map((step, index) => (
                              <li
                                key={index}
                                className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 flex gap-2"
                              >
                                <span className="text-coral-500 font-medium flex-shrink-0">{index + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div className="text-xs text-gray-400 space-y-1">
                        <div>Created: {formatDate(selectedTask.createdAt)}</div>
                        {selectedTask.updatedAt !== selectedTask.createdAt && (
                          <div>Updated: {formatDate(selectedTask.updatedAt)}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4 lg:p-6 flex items-center justify-center">
                      <div className="text-center">
                        <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Select a vital task to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Vital Task Modal */}
      <VitalTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
   