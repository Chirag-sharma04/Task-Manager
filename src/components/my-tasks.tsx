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
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Filter,
} from "lucide-react"

interface Task {
  _id: string
  title: string
  description: string
  priority: "Extreme" | "Ultimate" | "High" | "Moderate" | "Low"
  status: "Not Started" | "In Progress" | "Completed"
  createdAt: string
  updatedAt: string
  dueDate?: string
  category?: string
  type: "vital" | "regular" | "my-task"
  image?: string
  detailedSteps?: string[]
  objective?: string
  taskDescription?: string
  additionalNotes?: string[]
  deadline?: string
}

interface TaskStatistics {
  total: number
  completed: number
  inProgress: number
  notStarted: number
  overdue: number
  completionRate: number
  averageCompletionTime: number
  priorityBreakdown: {
    extreme: number
    ultimate: number
    high: number
    moderate: number
    low: number
  }
  typeBreakdown: {
    vital: number
    regular: number
    myTask: number
  }
}

type FilterType = "all" | "vital" | "regular" | "my-task"
type StatusFilter = "all" | "Not Started" | "In Progress" | "Completed"
type PriorityFilter = "all" | "Low" | "Moderate" | "High" | "Extreme" | "Ultimate"

export default function MyTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [statistics, setStatistics] = useState<TaskStatistics | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")
  const router = useRouter()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, route: "/" },
    { icon: Zap, label: "Vital Task", active: false, route: "/vital" },
    { icon: CheckSquare, label: "My Task", active: true, route: "/tasks" },
    { icon: Grid3X3, label: "Task Categories", active: false, route: "/categories" },
    { icon: Settings, label: "Settings", active: false, route: "/settings" },
    { icon: HelpCircle, label: "Help", active: false, route: "/help" },
  ]

  const fetchAllTasks = useCallback(async () => {
    try {
      setIsLoading(true)

      // Fetch from all three endpoints
      const [vitalResponse, regularResponse, myTaskResponse] = await Promise.all([
        fetch("/api/vital-tasks"),
        fetch("/api/tasks"),
        fetch("/api/my-tasks"),
      ])

      const [vitalResult, regularResult, myTaskResult] = await Promise.all([
        vitalResponse.json(),
        regularResponse.json(),
        myTaskResponse.json(),
      ])

      const combinedTasks: Task[] = []

      // Add vital tasks
      if (vitalResult.success && vitalResult.data) {
        const vitalTasks = vitalResult.data.map((task: Task) => ({
          ...task,
          type: "vital" as const,
        }))
        combinedTasks.push(...vitalTasks)
      }

      // Add regular tasks
      if (regularResult.success && regularResult.data) {
        const regularTasks = regularResult.data.map((task: Task) => ({
          ...task,
          type: "regular" as const,
        }))
        combinedTasks.push(...regularTasks)
      }

      // Add my tasks
      if (myTaskResult.success && myTaskResult.data) {
        const myTasks = myTaskResult.data.map((task: Task) => ({
          ...task,
          type: "my-task" as const,
        }))
        combinedTasks.push(...myTasks)
      }

      // Sort by creation date (newest first)
      combinedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setAllTasks(combinedTasks)
      calculateStatistics(combinedTasks)

      if (combinedTasks.length > 0 && !selectedTask) {
        setSelectedTask(combinedTasks[0])
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setAllTasks([])
      setStatistics(null)
    } finally {
      setIsLoading(false)
    }
  }, [selectedTask])

  const applyFilters = useCallback(() => {
    let filtered = [...allTasks]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((task) => task.type === typeFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)

    // Update selected task if it's no longer in filtered results
    if (selectedTask && !filtered.find((task) => task._id === selectedTask._id)) {
      setSelectedTask(filtered.length > 0 ? filtered[0] : null)
    }
  }, [allTasks, searchTerm, typeFilter, statusFilter, priorityFilter, selectedTask])

  const calculateStatistics = (tasks: Task[]) => {
    if (tasks.length === 0) {
      setStatistics(null)
      return
    }

    const total = tasks.length
    const completed = tasks.filter((task) => task.status === "Completed").length
    const inProgress = tasks.filter((task) => task.status === "In Progress").length
    const notStarted = tasks.filter((task) => task.status === "Not Started").length

    // Calculate overdue tasks
    const now = new Date()
    const overdue = tasks.filter((task) => {
      if (!task.dueDate) return false
      return new Date(task.dueDate) < now && task.status !== "Completed"
    }).length

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Calculate average completion time
    const completedTasks = tasks.filter((task) => task.status === "Completed")
    let averageCompletionTime = 0
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, task) => {
        const created = new Date(task.createdAt)
        const updated = new Date(task.updatedAt)
        return sum + (updated.getTime() - created.getTime())
      }, 0)
      averageCompletionTime = Math.round(totalTime / completedTasks.length / (1000 * 60 * 60 * 24))
    }

    // Priority breakdown
    const priorityBreakdown = {
      extreme: tasks.filter((task) => task.priority === "Extreme").length,
      ultimate: tasks.filter((task) => task.priority === "Ultimate").length,
      high: tasks.filter((task) => task.priority === "High").length,
      moderate: tasks.filter((task) => task.priority === "Moderate").length,
      low: tasks.filter((task) => task.priority === "Low").length,
    }

    // Type breakdown
    const typeBreakdown = {
      vital: tasks.filter((task) => task.type === "vital").length,
      regular: tasks.filter((task) => task.type === "regular").length,
      myTask: tasks.filter((task) => task.type === "my-task").length,
    }

    setStatistics({
      total,
      completed,
      inProgress,
      notStarted,
      overdue,
      completionRate,
      averageCompletionTime,
      priorityBreakdown,
      typeBreakdown,
    })
  }

  useEffect(() => {
    fetchAllTasks()
  }, [fetchAllTasks])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vital":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "regular":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "my-task":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vital":
        return "Vital"
      case "regular":
        return "Regular"
      case "my-task":
        return "My Task"
      default:
        return "Unknown"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setStatusFilter("all")
    setPriorityFilter("all")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading all your tasks...</p>
          </div>
        </div>
      </div>
    )
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
                  placeholder="Search all tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              placeholder="Search all tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 lg:p-6 overflow-auto">
          {allTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Tasks Found</h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4">
                  You have not created any tasks yet. Start by adding your first task!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button className="bg-coral-500 hover:bg-coral-600" onClick={() => router.push("/")}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Add Regular Task
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600" onClick={() => router.push("/vital")}>
                    <Zap className="w-4 h-4 mr-2" />
                    Add Vital Task
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Task Statistics */}
              {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.total}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            Vital: {statistics.typeBreakdown.vital} | Regular: {statistics.typeBreakdown.regular} | My:{" "}
                            {statistics.typeBreakdown.myTask}
                          </div>
                        </div>
                        <BarChart3 className="w-8 h-8 text-coral-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                          <p className="text-2xl font-bold text-green-600">{statistics.completionRate}%</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {statistics.completed} of {statistics.total} completed
                          </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                          <p className="text-2xl font-bold text-blue-600">{statistics.inProgress}</p>
                          <div className="text-xs text-gray-500 mt-1">Not Started: {statistics.notStarted}</div>
                        </div>
                        <Clock className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                          <p className="text-2xl font-bold text-red-600">{statistics.overdue}</p>
                          <div className="text-xs text-gray-500 mt-1">Need attention</div>
                        </div>
                        <Target className="w-8 h-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Filters */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                    </div>

                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="all">All Types</option>
                      <option value="vital">Vital Tasks</option>
                      <option value="regular">Regular Tasks</option>
                      <option value="my-task">My Tasks</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="all">All Status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="all">All Priorities</option>
                      <option value="Extreme">Extreme</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>

                    <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                      Clear Filters
                    </Button>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {filteredTasks.length} of {allTasks.length} tasks
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full">
                {/* Tasks List */}
                <div>
                  <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4 lg:p-6">
                      <h2 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 dark:text-white">
                        All My Tasks ({filteredTasks.length})
                      </h2>

                      {filteredTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">No tasks match your current filters</p>
                          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
                            Clear Filters
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3 lg:space-y-4">
                          {filteredTasks.map((task) => (
                            <Card
                              key={task._id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedTask?._id === task._id
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
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className="font-medium text-sm lg:text-base dark:text-white truncate">
                                            {task.title}
                                          </h3>
                                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(task.type)}`}>
                                            {getTypeLabel(task.type)}
                                          </span>
                                        </div>
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
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Task Detail View */}
                <div>
                  {selectedTask ? (
                    <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
                          <div className="flex items-center gap-2">
                            <h2 className="text-base lg:text-lg font-semibold dark:text-white truncate">
                              {selectedTask.title}
                            </h2>
                            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(selectedTask.type)}`}>
                              {getTypeLabel(selectedTask.type)}
                            </span>
                          </div>
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
                            <span className="text-gray-400">Created: {formatDate(selectedTask.createdAt)}</span>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                              <strong>Description:</strong>
                            </h4>
                            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {selectedTask.description}
                            </p>
                          </div>

                          {selectedTask.category && (
                            <div>
                              <h4 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                                <strong>Category:</strong>
                              </h4>
                              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {selectedTask.category}
                              </p>
                            </div>
                          )}

                          {selectedTask.detailedSteps && selectedTask.detailedSteps.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                                <strong>Detailed Steps:</strong>
                              </h4>
                              <ul className="space-y-2">
                                {selectedTask.detailedSteps.map((step, index) => (
                                  <li
                                    key={index}
                                    className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 flex gap-2"
                                  >
                                    <span className="text-coral-500 flex-shrink-0">{index + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {selectedTask.additionalNotes && selectedTask.additionalNotes.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm lg:text-base mb-2 dark:text-white">
                                <strong>Additional Notes:</strong>
                              </h4>
                              <ul className="space-y-2">
                                {selectedTask.additionalNotes.map((note, index) => (
                                  <li
                                    key={index}
                                    className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 flex gap-2"
                                  >
                                    <span className="text-coral-500 flex-shrink-0">•</span>
                                    <span>{note}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {(selectedTask.dueDate || selectedTask.deadline) && (
                            <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <h4 className="font-medium text-sm lg:text-base mb-1 dark:text-white">
                                <strong>Due Date:</strong>
                              </h4>
                              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                                {selectedTask.dueDate ? formatDate(selectedTask.dueDate) : selectedTask.deadline}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="p-4 lg:p-6 flex items-center justify-center">
                        <div className="text-center">
                          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">Select a task to view details</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
