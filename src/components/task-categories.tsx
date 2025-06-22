"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import CategoryModal from "./category-modal"
import DeleteConfirmationModal from "./delete-confirmation-modal"
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
  Plus,
  Edit,
  Trash2,
  Menu,
  X,
} from "lucide-react"

interface TaskStatus {
  id: number
  name: string
  createdAt: string
}

interface TaskPriority {
  id: number
  name: string
  createdAt: string
}

interface EditData {
  id: number
  name: string
}

export default function TaskCategories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([])
  const [taskPriorities, setTaskPriorities] = useState<TaskPriority[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"status" | "priority">("status")
  const [editData, setEditData] = useState<EditData | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteData, setDeleteData] = useState<{ id: number; name: string; type: "status" | "priority" } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, route: "/" },
    { icon: Zap, label: "Vital Task", active: false, route: "/vital" },
    { icon: CheckSquare, label: "My Task", active: false, route: "/tasks" },
    { icon: Grid3X3, label: "Task Categories", active: true, route: "/categories" },
    { icon: Settings, label: "Settings", active: false, route: "/settings" },
    { icon: HelpCircle, label: "Help", active: false, route: "/help" },
  ]

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const result = await response.json()

      if (result.success) {
        setTaskStatuses(result.data.statuses || [])
        setTaskPriorities(result.data.priorities || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleNavigation = (route: string) => {
    router.push(route)
    setIsSidebarOpen(false)
  }

  const handleGoBack = () => {
    router.back()
  }

  const openCreateModal = (type: "status" | "priority") => {
    setModalType(type)
    setEditData(null)
    setIsModalOpen(true)
  }

  const openEditModal = (type: "status" | "priority", item: { id: number; name: string }) => {
    setModalType(type)
    setEditData(item)
    setIsModalOpen(true)
  }

  const openDeleteModal = (type: "status" | "priority", item: { id: number; name: string }) => {
    setDeleteData({ ...item, type })
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (data: { name: string; type: "status" | "priority" }) => {
    setIsLoading(true)
    try {
      let response

      if (editData) {
        // Update existing category
        response = await fetch(`/api/categories/${editData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
      } else {
        // Create new category
        response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
      }

      const result = await response.json()

      if (result.success) {
        await fetchCategories() // Refresh the data
        setIsModalOpen(false)
        setEditData(null)
      } else {
        console.error("Failed to save category:", result.error)
      }
    } catch (error) {
      console.error("Failed to save category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteData) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${deleteData.id}?type=${deleteData.type}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        await fetchCategories() // Refresh the data
        setIsDeleteModalOpen(false)
        setDeleteData(null)
      } else {
        console.error("Failed to delete category:", result.error)
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
    } finally {
      setIsDeleting(false)
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
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
              <h2 className="text-lg lg:text-xl font-semibold dark:text-white">Task Categories</h2>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="text-gray-600 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 text-sm lg:text-base w-fit"
              >
                Go Back
              </Button>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {/* Task Status Section */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-base lg:text-lg font-semibold dark:text-white">Task Status</h3>
                    <Button
                      onClick={() => openCreateModal("status")}
                      className="bg-coral-500 hover:bg-coral-600 text-xs lg:text-sm w-fit"
                    >
                      <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      Add Task Status
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              S/N
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Task Status
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {taskStatuses.map((status, index) => (
                            <tr key={status.id}>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {index + 1}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {status.name}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => openEditModal("status", status)}
                                    className="bg-coral-500 hover:bg-coral-600 text-xs"
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openDeleteModal("status", status)}
                                    className="bg-red-500 hover:bg-red-600 text-xs"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Task Priority Section */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-base lg:text-lg font-semibold dark:text-white">Task Priority</h3>
                    <Button
                      onClick={() => openCreateModal("priority")}
                      className="bg-coral-500 hover:bg-coral-600 text-xs lg:text-sm w-fit"
                    >
                      <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      Add Task Priority
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              S/N
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Task Priority
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {taskPriorities.map((priority, index) => (
                            <tr key={priority.id}>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {index + 1}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {priority.name}
                              </td>
                              <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => openEditModal("priority", priority)}
                                    className="bg-coral-500 hover:bg-coral-600 text-xs"
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openDeleteModal("priority", priority)}
                                    className="bg-red-500 hover:bg-red-600 text-xs"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditData(null)
        }}
        onSubmit={handleSubmit}
        type={modalType}
        editData={editData}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteData(null)
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteData?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}
