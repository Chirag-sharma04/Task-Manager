"use client"

import { useState, useEffect } from "react"
import { X, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Task {
  _id: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High" | "Extremely High"
  status: string
  dueDate: string
  createdAt: string
}

interface NotificationsWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsWidget({ isOpen, onClose }: NotificationsWidgetProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      setLoading(true)

      // Fetch from all task endpoints
      const [tasksRes, vitalTasksRes, myTasksRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/vital-tasks"),
        fetch("/api/my-tasks"),
      ])

      const [tasks, vitalTasks, myTasks] = await Promise.all([tasksRes.json(), vitalTasksRes.json(), myTasksRes.json()])

      // Combine all tasks and create notifications
      const allTasks = [...(tasks.tasks || []), ...(vitalTasks.tasks || []), ...(myTasks.tasks || [])]

      // Create notifications from recent tasks and due tasks
      const taskNotifications = allTasks
        .filter((task) => {
          const dueDate = new Date(task.dueDate)
          const now = new Date()
          const timeDiff = dueDate.getTime() - now.getTime()
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

          // Show tasks due within 3 days or recently created
          const isRecentlyCreated = new Date(task.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          const isDueSoon = daysDiff <= 3 && daysDiff >= 0
          const isOverdue = daysDiff < 0

          return isRecentlyCreated || isDueSoon || isOverdue || task.status === "In Progress"
        })
        .map((task) => {
          const dueDate = new Date(task.dueDate)
          const now = new Date()
          const timeDiff = dueDate.getTime() - now.getTime()
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
          const hoursDiff = Math.ceil(timeDiff / (1000 * 3600))

          let timeText = ""
          let notificationType = "info"

          if (daysDiff < 0) {
            timeText = `${Math.abs(daysDiff)}d overdue`
            notificationType = "overdue"
          } else if (daysDiff === 0) {
            if (hoursDiff <= 0) {
              timeText = "Due now"
              notificationType = "urgent"
            } else {
              timeText = `${hoursDiff}h left`
              notificationType = "urgent"
            }
          } else if (daysDiff <= 3) {
            timeText = `${daysDiff}d left`
            notificationType = "warning"
          } else {
            const createdHours = Math.floor((now.getTime() - new Date(task.createdAt).getTime()) / (1000 * 3600))
            timeText = createdHours < 24 ? `${createdHours}h ago` : `${Math.floor(createdHours / 24)}d ago`
            notificationType = "info"
          }

          return {
            id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            timeText,
            type: notificationType,
            status: task.status,
            category: task.category || "General",
          }
        })
        .sort((a, b) => {
          // Sort by priority and urgency
          const priorityOrder = { "Extremely High": 4, High: 3, Medium: 2, Low: 1 }
          const typeOrder = { overdue: 4, urgent: 3, warning: 2, info: 1 }

          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1
          const aType = typeOrder[a.type as keyof typeof typeOrder] || 1
          const bType = typeOrder[b.type as keyof typeof typeOrder] || 1

          if (aType !== bType) return bType - aType
          return bPriority - aPriority
        })
        .slice(0, 10) // Limit to 10 notifications

      setNotifications(taskNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Extremely High":
        return "text-red-600 bg-red-50"
      case "High":
        return "text-orange-600 bg-orange-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "overdue":
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getProjectImage = (title: string, category: string) => {
    // Generate a simple colored rectangle based on the title/category
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-indigo-400",
      "bg-teal-400",
    ]
    const colorIndex = (title.length + category.length) % colors.length
    return colors[colorIndex]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No notifications at this time</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="px-6 py-2">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Today</h3>
              </div>
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 leading-tight">{notification.title}</p>
                          {notification.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs px-2 py-0.5 ${getPriorityColor(notification.priority)}`}
                            >
                              Priority: {notification.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">{notification.timeText}</span>
                          </div>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-lg flex-shrink-0 ${getProjectImage(notification.title, notification.category)} flex items-center justify-center`}
                        >
                          <div className="w-8 h-6 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
