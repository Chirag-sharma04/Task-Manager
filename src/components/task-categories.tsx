"use client"
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
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

interface TaskStatus {
  id: number
  name: string
}

interface TaskPriority {
  id: number
  name: string
}

const taskStatuses: TaskStatus[] = [
  { id: 1, name: "Completed" },
  { id: 2, name: "In Progress" },
  { id: 3, name: "Not Started" },
]

const taskPriorities: TaskPriority[] = [
  { id: 1, name: "Extreme" },
  { id: 2, name: "Moderate" },
  { id: 3, name: "Low" },
]

export default function TaskCategories() {
  const router = useRouter()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, route: "/" },
    { icon: Zap, label: "Vital Task", active: false, route: "/vital" },
    { icon: CheckSquare, label: "My Task", active: false, route: "/tasks" },
    { icon: Grid3X3, label: "Task Categories", active: true, route: "/categories" },
    { icon: Settings, label: "Settings", active: false, route: "/settings" },
    { icon: HelpCircle, label: "Help", active: false, route: "/help" },
  ]

  const handleNavigation = (route: string) => {
    router.push(route)
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-black dark:bg-gray-950 text-white flex flex-col">
        {/* User Profile */}
        <div className="p-6 text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-coral-500 text-white">AM</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">amanuel</h3>
          <p className="text-gray-400 text-sm">amanuel@gmail.com</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.route)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-left transition-colors ${
                item.active ? "bg-coral-500 text-white" : "text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-800 rounded-lg">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold">
                <span className="text-coral-500">To-</span>
                <span className="text-black dark:text-white">Do</span>
              </h1>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your task here..."
                  className="pl-10 w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                <Search className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
              >
                <Bell className="w-4 h-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
              >
                <Calendar className="w-4 h-4" />
              </Button>

              <ThemeToggle />

              <div className="text-right">
                <p className="text-sm font-medium dark:text-white">Tuesday</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">20/08/2023</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-white">Task Categories</h2>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="text-gray-600 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Go Back
              </Button>
            </div>

            <div className="mb-6">
              <Button className="bg-coral-500 hover:bg-coral-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="space-y-8">
              {/* Task Status Section */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">Task Status</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task Status
                    </Button>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            S/N
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Task Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                        {taskStatuses.map((status) => (
                          <tr key={status.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {status.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {status.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Task Priority Section */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">Task Priority</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task Priority
                    </Button>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            S/N
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Task Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                        {taskPriorities.map((priority) => (
                          <tr key={priority.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {priority.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {priority.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
