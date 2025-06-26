"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import  CategoryModal from "./category-modal"
import DeleteConfirmationModal from "./delete-confirmation-modal"
import { Plus, Edit, Trash2, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface TaskStatus {
  _id: string
  name: string
  description?: string
  color: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface TaskPriority {
  _id: string
  name: string
  description?: string
  color: string
  level: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface EditData {
  _id: string
  name: string
  description?: string
  color?: string
  level?: number
}

export default function TaskCategories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([])
  const [taskPriorities, setTaskPriorities] = useState<TaskPriority[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"status" | "priority">("status")
  const [editData, setEditData] = useState<EditData | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteData, setDeleteData] = useState<{
    _id: string
    name: string
    type: "status" | "priority"
    isDefault: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const router = useRouter()

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const fetchCategories = async () => {
    try {
      setIsPageLoading(true)
      const response = await fetch("/api/categories")
      const result = await response.json()

      if (result.success) {
        setTaskStatuses(result.data.statuses || [])
        setTaskPriorities(result.data.priorities || [])
      } else {
        showAlert("error", result.error || "Failed to fetch categories")
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      showAlert("error", "Failed to fetch categories. Please try again.")
    } finally {
      setIsPageLoading(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const openCreateModal = (type: "status" | "priority") => {
    setModalType(type)
    setEditData(null)
    setIsModalOpen(true)
  }

  const openEditModal = (type: "status" | "priority", item: EditData) => {
    setModalType(type)
    setEditData(item)
    setIsModalOpen(true)
  }

  const openDeleteModal = (type: "status" | "priority", item: { _id: string; name: string; isDefault: boolean }) => {
    setDeleteData({ ...item, type })
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (data: {
    name: string
    description?: string
    color?: string
    level?: number
    type: "status" | "priority"
  }) => {
    setIsLoading(true)
    try {
      let response

      if (editData) {
        // Update existing category
        response = await fetch(`/api/categories/${editData._id}`, {
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
        showAlert(
          "success",
          result.message ||
            `${data.type === "status" ? "Status" : "Priority"} ${editData ? "updated" : "created"} successfully!`,
        )
      } else {
        showAlert("error", result.error || "Failed to save category")
      }
    } catch (error) {
      console.error("Failed to save category:", error)
      showAlert("error", "Failed to save category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteData) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${deleteData._id}?type=${deleteData.type}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        await fetchCategories() // Refresh the data
        setIsDeleteModalOpen(false)
        setDeleteData(null)
        showAlert(
          "success",
          result.message || `${deleteData.type === "status" ? "Status" : "Priority"} deleted successfully!`,
        )
      } else {
        showAlert("error", result.error || "Failed to delete category")
        setIsDeleteModalOpen(false)
        setDeleteData(null)
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
      showAlert("error", "Failed to delete category. Please try again.")
      setIsDeleteModalOpen(false)
      setDeleteData(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    if (status.name.toLowerCase().includes("completed")) return "text-green-600"
    if (status.name.toLowerCase().includes("progress")) return "text-blue-600"
    if (status.name.toLowerCase().includes("not started")) return "text-red-600"
    return "text-gray-600"
  }

  const getPriorityColor = (priority: TaskPriority) => {
    if (priority.level >= 8) return "text-red-600"
    if (priority.level >= 6) return "text-orange-600"
    if (priority.level >= 4) return "text-yellow-600"
    if (priority.level >= 2) return "text-blue-600"
    return "text-green-600"
  }

  function fetchVitalTasks() {
    // This function can be implemented later if needed for search functionality
    console.log("Search functionality not implemented yet")
  }

  if (isPageLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            onSidebarToggle={() => setIsSidebarOpen(true)}
            onSearch={(e) => {
              e.preventDefault()
              fetchVitalTasks()
            }}
          />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-coral-500" />
              <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Navbar */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          onSidebarToggle={() => setIsSidebarOpen(true)}
          onSearch={(e) => {
            e.preventDefault()
            fetchVitalTasks()
          }}
        />

        {/* Main Content */}
        <main className="flex-1 p-3 lg:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-3">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold dark:text-white">Task Categories</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your task statuses and priorities
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="text-gray-600 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 text-sm lg:text-base w-fit"
              >
                Go Back
              </Button>
            </div>

            {/* Alert Messages */}
            {alert && (
              <Alert
                className={`mb-6 ${alert.type === "error" ? "border-red-200 bg-red-50 dark:bg-red-900/20" : "border-green-200 bg-green-50 dark:bg-green-900/20"}`}
              >
                {alert.type === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription
                  className={
                    alert.type === "error" ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"
                  }
                >
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6 lg:space-y-8">
              {/* Task Status Section */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <div>
                      <h3 className="text-base lg:text-lg font-semibold dark:text-white">Task Status</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage the different states your tasks can be in
                      </p>
                    </div>
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
                              Status Name
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {taskStatuses.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No task statuses found. Create your first status!
                              </td>
                            </tr>
                          ) : (
                            taskStatuses.map((status) => (
                              <tr key={status._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div
                                      className="w-3 h-3 rounded-full mr-3"
                                      style={{ backgroundColor: status.color }}
                                    />
                                    <span className={`font-medium ${getStatusColor(status)} dark:text-gray-100`}>
                                      {status.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 text-sm text-gray-600 dark:text-gray-400">
                                  {status.description || "No description"}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                  {status.isDefault ? (
                                    <Badge variant="secondary" className="text-xs">
                                      Default
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      Custom
                                    </Badge>
                                  )}
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
                                      disabled={status.isDefault}
                                      className="bg-red-500 hover:bg-red-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
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
                    <div>
                      <h3 className="text-base lg:text-lg font-semibold dark:text-white">Task Priority</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage the priority levels for your tasks
                      </p>
                    </div>
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
                              Priority Name
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Level
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                          {taskPriorities.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No task priorities found. Create your first priority!
                              </td>
                            </tr>
                          ) : (
                            taskPriorities.map((priority) => (
                              <tr key={priority._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div
                                      className="w-3 h-3 rounded-full mr-3"
                                      style={{ backgroundColor: priority.color }}
                                    />
                                    <span className={`font-medium ${getPriorityColor(priority)} dark:text-gray-100`}>
                                      {priority.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                  <Badge variant="outline" className="text-xs">
                                    Level {priority.level}
                                  </Badge>
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 text-sm text-gray-600 dark:text-gray-400">
                                  {priority.description || "No description"}
                                </td>
                                <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                                  {priority.isDefault ? (
                                    <Badge variant="secondary" className="text-xs">
                                      Default
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      Custom
                                    </Badge>
                                  )}
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
                                      disabled={priority.isDefault}
                                      className="bg-red-500 hover:bg-red-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
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
        title={`Delete ${deleteData?.type === "status" ? "Status" : "Priority"}`}
        message={
          deleteData?.isDefault
            ? `Cannot delete "${deleteData?.name}" because it's a default ${deleteData?.type}.`
            : `Are you sure you want to delete "${deleteData?.name}"? This action cannot be undone and will fail if any tasks are using this ${deleteData?.type}.`
        }
        isLoading={isDeleting}
      />
    </div>
  )
}
