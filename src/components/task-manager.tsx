"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import TaskModal from "@/components/task-modal"
import NotificationsWidget from "@/components/notifications-widget";
import { CalendarWidget } from "@/components/calendar-widget"
import { useApi } from "@/hooks/use-api"
import {
  Search,
  Bell,
  Calendar,
  Plus,
  LayoutDashboard,
  Zap,
  CheckSquare,
  Grid3X3,
  Settings,
  HelpCircle,
  LogOut,
  Users,
  Edit,
  Trash2,
  Menu,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Task {
  _id: string
  title: string
  description: string
  category: string
  priority: "Low" | "Moderate" | "High" | "Extreme"
  status: "Not Started" | "In Progress" | "Completed"
  dueDate?: string
  createdAt: string
  image?: string
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const [showNotification, setShowNotification] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { user } = useAuth()

  // Create separate API instances to avoid dependency issues
  const { get } = useApi()
  const { delete: deleteTask } = useApi()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, route: "/" },
    { icon: Zap, label: "Vital Task", active: false, route: "/vital" },
    { icon: CheckSquare, label: "My Task", active: false, route: "/tasks" },
    { icon: Grid3X3, label: "Task Categories", active: false, route: "/categories" },
    { icon: Settings, label: "Settings", active: false, route: "/settings" },
    { icon: HelpCircle, label: "Help", active: false, route: "/help" },
  ]

  const teamMembers = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ]

  // Memoize fetchTasks to prevent infinite re-renders
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim())
      }

      const response = await get(`/api/tasks?${params.toString()}`)
      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data as Task[])
      } else {
        setTasks([])
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, get])

  // Load tasks on component mount and when search query changes
  useEffect(() => {
    fetchTasks()
  }, [])

  const handleNavigation = (route: string) => {
    router.push(route)
    setIsSidebarOpen(false) // Close sidebar on mobile after navigation
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await deleteTask(`/api/tasks/${taskId}`)
        if (response.success) {
          // Remove the deleted task from the local state
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
        }
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  const handleTaskModalSuccess = () => {
    // Refresh tasks after successful create/update
    fetchTasks()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // fetchTasks will be called automatically due to useEffect dependency on searchQuery
  }

  const getStatusStats = () => {
    const total = tasks.length
    if (total === 0) return { completed: 0, inProgress: 0, notStarted: 0 }

    const completed = tasks.filter((task) => task.status === "Completed").length
    const inProgress = tasks.filter((task) => task.status === "In Progress").length
    const notStarted = tasks.filter((task) => task.status === "Not Started").length

    return {
      completed: Math.round((completed / total) * 100),
      inProgress: Math.round((inProgress / total) * 100),
      notStarted: Math.round((notStarted / total) * 100),
    }
  }

  const stats = getStatusStats()
  const completedTasks = tasks.filter((task) => task.status === "Completed")

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
        <div className="p-6 text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-coral-500 text-white">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-gray-400 text-sm">{user?.email}</p>
      </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 lg:px-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg mb-2 text-left transition-colors text-sm lg:text-base ${
                item.label === "Dashboard"
                  ? "bg-coral-500 text-white"
                  : "text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800"
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
                <span className="text-coral-500">Dash</span>
                <span className="text-black dark:text-white">board</span>
              </h1>

              {/* Search - Hidden on small screens, shown on medium+ */}
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your task here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-60 lg:w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </form>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search Button - Visible on all screens */}
              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                <Search className="w-4 h-4" />
              </Button>

              {/* Notification and Calendar - Hidden on small screens */}
              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
                onClick={() => setShowNotification(!showNotification)}
              >

                <Bell className="w-4 h-4" />
              <NotificationsWidget isOpen={showNotification} onClose={() => setShowNotification(false)} />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="hidden sm:flex border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Calendar className="w-4 h-4" />
              <CalendarWidget isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
              </Button>

              <ThemeToggle />

              {/* Date - Hidden on small screens */}
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
          <form onSubmit={handleSearch} className="relative mt-3 md:hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your task here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </form>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-3 lg:p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
              <h2 className="text-2xl font-semibold dark:text-white">Welcome back, {user?.firstName} 👋</h2>

              <div className="flex items-center gap-2">
                {teamMembers.slice(0, 3).map((avatar, index) => (
                  <Avatar key={index} className="w-6 h-6 lg:w-8 lg:h-8 border-2 border-white dark:border-gray-700">
                    <AvatarImage src={avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-coral-500 text-white text-xs">U{index + 1}</AvatarFallback>
                  </Avatar>
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 lg:hidden">+{teamMembers.length - 3}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-xs lg:text-sm"
                >
                  <Users className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                  <span className="hidden sm:inline">invite</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
              {/* To-Do Section */}
              <div className="xl:col-span-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                        <h3 className="font-semibold text-base lg:text-lg dark:text-white">To-Do</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddTask}
                        className="text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20 text-xs lg:text-sm"
                      >
                        <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        <span className="hidden sm:inline">Add task</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        {new Date().toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        • Today
                      </p>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">Loading tasks...</p>
                      </div>
                    ) : tasks.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
                          No tasks found. Add your first task!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 lg:space-y-4">
                        {tasks.map((task) => (
                          <Card key={task._id} className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
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
                                      <h4 className="font-medium text-sm lg:text-base mb-1 dark:text-white truncate">
                                        {task.title}
                                      </h4>
                                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {task.description}
                                      </p>

                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs mb-2">
                                        <span className="text-blue-500">Priority: {task.priority}</span>
                                        <span
                                          className={`${
                                            task.status === "Not Started"
                                              ? "text-red-500"
                                              : task.status === "In Progress"
                                                ? "text-blue-500"
                                                : "text-green-500"
                                          }`}
                                        >
                                          Status: {task.status}
                                        </span>
                                        <span className="text-gray-400 hidden sm:inline">
                                          Created: {new Date(task.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>

                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEditTask(task)}
                                          className="text-coral-500 border-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20 text-xs"
                                        >
                                          <Edit className="w-3 h-3 mr-1" />
                                          <span className="hidden sm:inline">Edit</span>
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleDeleteTask(task._id)}
                                          className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                                        >
                                          <Trash2 className="w-3 h-3 mr-1" />
                                          <span className="hidden sm:inline">Delete</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-600 rounded-lg flex-shrink-0">
                                  <Image
                                    src={task.image || "/placeholder.svg"}
                                    alt={task.title}
                                    width={50}
                                    height={50}
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Task Status */}
              <div className="space-y-4 lg:space-y-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-400 rounded"></div>
                      </div>
                      <h3 className="font-semibold text-base lg:text-lg dark:text-white">Task Status</h3>
                    </div>

                    <div className="grid grid-cols-3 xl:grid-cols-1 gap-4 xl:gap-6">
                      {/* Completed */}
                      <div className="text-center">
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-2">
                          <svg className="w-16 h-16 lg:w-20 lg:h-20 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#374151"
                              strokeWidth="6"
                              fill="none"
                              className="lg:hidden"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#374151"
                              strokeWidth="8"
                              fill="none"
                              className="hidden lg:block"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#10b981"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${stats.completed * 1.76} ${100 * 1.76}`}
                              strokeLinecap="round"
                              className="lg:hidden"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#10b981"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${stats.completed * 2.26} ${100 * 2.26}`}
                              strokeLinecap="round"
                              className="hidden lg:block"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm lg:text-lg font-bold dark:text-white">{stats.completed}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs lg:text-sm dark:text-gray-300">Completed</span>
                        </div>
                      </div>

                      {/* In Progress */}
                      <div className="text-center">
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-2">
                          <svg className="w-16 h-16 lg:w-20 lg:h-20 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#374151"
                              strokeWidth="6"
                              fill="none"
                              className="lg:hidden"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#374151"
                              strokeWidth="8"
                              fill="none"
                              className="hidden lg:block"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#3b82f6"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${stats.inProgress * 1.76} ${100 * 1.76}`}
                              strokeLinecap="round"
                              className="lg:hidden"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#3b82f6"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${stats.inProgress * 2.26} ${100 * 2.26}`}
                              strokeLinecap="round"
                              className="hidden lg:block"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm lg:text-lg font-bold dark:text-white">{stats.inProgress}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs lg:text-sm dark:text-gray-300">In Progress</span>
                        </div>
                      </div>

                      {/* Not Started */}
                      <div className="text-center">
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-2">
                          <svg className="w-16 h-16 lg:w-20 lg:h-20 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#374151"
                              strokeWidth="6"
                              fill="none"
                              className="lg:hidden"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#374151"
                              strokeWidth="8"
                              fill="none"
                              className="hidden lg:block"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#ef4444"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${stats.notStarted * 1.76} ${100 * 1.76}`}
                              strokeLinecap="round"
                              className="lg:hidden"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#ef4444"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${stats.notStarted * 2.26} ${100 * 2.26}`}
                              strokeLinecap="round"
                              className="hidden lg:block"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm lg:text-lg font-bold dark:text-white">{stats.notStarted}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 lg:gap-2">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full"></div>
                          <span className="text-xs lg:text-sm dark:text-gray-300">Not Started</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Completed Tasks */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckSquare className="w-4 h-4 lg:w-5 lg:h-5 text-coral-500" />
                      <h3 className="font-semibold text-coral-500 text-base lg:text-lg">Completed Task</h3>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                      {completedTasks.length === 0 ? (
                        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">No completed tasks yet.</p>
                      ) : (
                        completedTasks.slice(0, 3).map((task) => (
                          <div key={task._id} className="flex gap-2 lg:gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-xs lg:text-sm mb-1 dark:text-white truncate">
                                    {task.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                    {task.description}
                                  </p>
                                  <div className="text-xs">
                                    <span className="text-green-600">Status: {task.status}</span>
                                    <br />
                                    <span className="text-gray-400">
                                      Completed{" "}
                                      {Math.floor(
                                        (Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24),
                                      )}{" "}
                                      days ago.
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 dark:bg-gray-600 rounded-lg flex-shrink-0">
                              <Image
                                src={task.image || "/placeholder.svg"}
                                alt={task.title}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        onSuccess={handleTaskModalSuccess}
      />
    </div>
  )
}