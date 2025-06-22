"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: "Moderate" | "High" | "Low"
  status: "Not Started" | "In Progress" | "Completed"
  dueDate: string
  createdAt: string
  image?: string
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Attend Nischal's Birthday Party",
    description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements).....",
    category: "Personal",
    priority: "Moderate",
    status: "Not Started",
    dueDate: "2023-06-20",
    createdAt: "2023-06-20",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Landing Page Design for TravelDays",
    description: "Get the work done by EOD and discuss with client before leaving (4 PM | Meeting Room)",
    category: "Work",
    priority: "Moderate",
    status: "In Progress",
    dueDate: "2023-06-20",
    createdAt: "2023-06-20",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Presentation on Final Product",
    description:
      "Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...",
    category: "Work",
    priority: "Moderate",
    status: "In Progress",
    dueDate: "2023-06-20",
    createdAt: "2023-06-20",
    image: "/placeholder.svg",
  },
]

const completedTasks = [
  {
    id: "c1",
    title: "Walk the dog",
    description: "Take the dog to the park and bring treats as well.",
    status: "Completed",
    completedDays: 2,
    image: "/placeholder.svg",
  },
  {
    id: "c2",
    title: "Conduct meeting",
    description: "Meet with the client and finalize requirements.",
    status: "Completed",
    completedDays: 2,
    image: "/placeholder.svg",
  },
]

export default function TaskManager() {
  const router = useRouter()

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

  const handleNavigation = (route: string) => {
    router.push(route)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white flex flex-col">
        {/* User Profile */}
        <div className="p-6 text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>AM</AvatarFallback>
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
                item.label === "Dashboard" ? "bg-coral-500 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold">
                <span className="text-coral-500">Dash</span>
                <span className="text-black">board</span>
              </h1>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search your task here..." className="pl-10 w-80 bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
                <Search className="w-4 h-4" />
              </Button>

              <Button size="sm" variant="outline" className="border-coral-500 text-coral-500">
                <Bell className="w-4 h-4" />
              </Button>

              <Button size="sm" variant="outline" className="border-coral-500 text-coral-500">
                <Calendar className="w-4 h-4" />
              </Button>

              <div className="text-right">
                <p className="text-sm font-medium">Tuesday</p>
                <p className="text-xs text-gray-500">20/08/2023</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Welcome back, amanuel 👋</h2>

              <div className="flex items-center gap-2">
                {teamMembers.map((avatar, index) => (
                  <Avatar key={index} className="w-8 h-8 border-2 border-white">
                    <AvatarImage src={avatar || "/placeholder.svg"} />
                    <AvatarFallback>U{index + 1}</AvatarFallback>
                  </Avatar>
                ))}
                <Button size="sm" variant="outline" className="ml-2">
                  <Users className="w-4 h-4 mr-1" />
                  invite
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* To-Do Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold">To-Do</h3>
                      </div>
                      <Button variant="ghost" size="sm" className="text-coral-500">
                        <Plus className="w-4 h-4 mr-1" />
                        Add task
                      </Button>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">20 June • Today</p>
                    </div>

                    <div className="space-y-4">
                      {sampleTasks.map((task) => (
                        <Card key={task.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-2 mb-2">
                                  <div
                                    className={`w-3 h-3 rounded-full mt-1 ${
                                      task.status === "Not Started"
                                        ? "bg-red-500"
                                        : task.status === "In Progress"
                                          ? "bg-blue-500"
                                          : "bg-green-500"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                                    <p className="text-xs text-gray-600 mb-3">{task.description}</p>

                                    <div className="flex items-center gap-4 text-xs">
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
                                      <span className="text-gray-400">Created on: {task.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                                <Image
                                  src={task.image || "/placeholder.svg"}
                                  alt={task.title}
                                  width={64}
                                  height={64}
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

              {/* Task Status */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded"></div>
                      </div>
                      <h3 className="font-semibold">Task Status</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Completed */}
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#10b981"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${84 * 2.26} ${100 * 2.26}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">84%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Completed</span>
                        </div>
                      </div>

                      {/* In Progress */}
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#3b82f6"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${46 * 2.26} ${100 * 2.26}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">46%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">In Progress</span>
                        </div>
                      </div>

                      {/* Not Started */}
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#ef4444"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${13 * 2.26} ${100 * 2.26}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold">13%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Not Started</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Completed Tasks */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckSquare className="w-5 h-5 text-coral-500" />
                      <h3 className="font-semibold text-coral-500">Completed Task</h3>
                    </div>

                    <div className="space-y-4">
                      {completedTasks.map((task) => (
                        <div key={task.id} className="flex gap-3">
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                                <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                                <div className="text-xs">
                                  <span className="text-green-600">Status: {task.status}</span>
                                  <br />
                                  <span className="text-gray-400">Completed {task.completedDays} days ago.</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                            <Image
                              src={task.image || "/placeholder.svg"}
                              alt={task.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
