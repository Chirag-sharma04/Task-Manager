"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Image from "next/image"
interface VitalTask {
  id: string
  title: string
  description: string
  priority: "Extreme" | "High"
  status: "Not Started" | "In Progress" | "Completed"
  createdAt: string
  image?: string
  detailedSteps?: string[]
}

const vitalTasks: VitalTask[] = [
  {
    id: "v1",
    title: "Walk the dog",
    description: "Take the dog to the park and bring treats as well.",
    priority: "Extreme",
    status: "Not Started",
    createdAt: "20/08/2023",
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
    id: "v2",
    title: "Take grandma to hospital",
    description: "Go back home and take grandma to the hosp...",
    priority: "Extreme",
    status: "In Progress",
    createdAt: "20/08/2023",
    image: "/placeholder.svg",
  },
]

export default function VitalTasks() {
  const [selectedTask, setSelectedTask] = useState<VitalTask>(vitalTasks[0])
  const router = useRouter()

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, route: "/" },
    { icon: Zap, label: "Vital Task", active: true, route: "/vital" },
    { icon: CheckSquare, label: "My Task", active: false, route: "/tasks" },
    { icon: Grid3X3, label: "Task Categories", active: false, route: "/categories" },
    { icon: Settings, label: "Settings", active: false, route: "/settings" },
    { icon: HelpCircle, label: "Help", active: false, route: "/help" },
  ]

  const handleNavigation = (route: string) => {
    router.push(route)
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
                item.active ? "bg-coral-500 text-white" : "text-gray-300 hover:bg-gray-800"
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
                <span className="text-coral-500">To-</span>
                <span className="text-black">Do</span>
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Vital Tasks List */}
            <div>
              <Card className="h-full">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Vital Tasks</h2>

                  <div className="space-y-4">
                    {vitalTasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTask.id === task.id ? "ring-2 ring-coral-500 border-coral-500" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedTask(task)}
                      >
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
                                  <h3 className="font-medium text-sm mb-1">{task.title}</h3>
                                  <p className="text-xs text-gray-600 mb-3">{task.description}</p>

                                  <div className="flex items-center gap-4 text-xs">
                                    <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                                      Priority: {task.priority}
                                    </span>
                                    <span className={`font-medium ${getStatusColor(task.status)}`}>
                                      Status: {task.status}
                                    </span>
                                    <span className="text-gray-400">Created on: {task.createdAt}</span>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Task Detail View */}
            <div>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">{selectedTask.title}</h2>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Task Image */}
                  <div className="mb-6">
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={selectedTask.image || "/placeholder.svg"}
                        alt={selectedTask.title}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Task Info */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className={`font-medium ${getPriorityColor(selectedTask.priority)}`}>
                        Priority: {selectedTask.priority}
                      </span>
                      <span className={`font-medium ${getStatusColor(selectedTask.status)}`}>
                        Status: {selectedTask.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Take the dog to the park and bring treats as well.</p>
                    <p className="text-gray-600 text-sm mb-4">
                      Take Luffy and Jiro for a leisurely stroll around the neighbourhood. Enjoy the fresh air and give
                      them the exercise and mental stimulation they need for a happy and healthy day. Do not forget to
                      bring along squeaky and fluffy for some extra fun along the way!
                    </p>
                  </div>

                  {/* Detailed Steps */}
                  {selectedTask.detailedSteps && (
                    <div>
                      <h3 className="font-medium text-sm mb-3">Activities:</h3>
                      <ol className="space-y-2">
                        {selectedTask.detailedSteps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-coral-500 font-medium">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="mt-6 text-xs text-gray-400">Created on: 20/08/2023</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
