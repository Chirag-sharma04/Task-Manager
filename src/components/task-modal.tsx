"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Upload, X } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import Image from "next/image"

interface Task {
  _id?: string
  title: string
  description: string
  category: string
  priority: "Low" | "Moderate" | "High" | "Extreme"
  status: "Not Started" | "In Progress" | "Completed"
  dueDate?: string
  image?: string
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onSuccess?: () => void
}

export default function TaskModal({ isOpen, onClose, task, onSuccess }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    category: "Personal",
    priority: "Moderate",
    status: "Not Started",
    dueDate: "",
    image: "",
  })

  const [imagePreview, setImagePreview] = useState<string>("")

  const { loading, post, put } = useApi({
    onSuccess: () => {
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      console.error("Error saving task:", error)
    },
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "Personal",
        priority: task.priority || "Moderate",
        status: task.status || "Not Started",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        image: task.image || "",
      })
      setImagePreview(task.image || "")
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Personal",
        priority: "Moderate",
        status: "Not Started",
        dueDate: "",
        image: "",
      })
      setImagePreview("")
    }
  }, [task, isOpen])

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      category: "Personal",
      priority: "Moderate",
      status: "Not Started",
      dueDate: "",
      image: "",
    })
    setImagePreview("")
    onClose()
  }

  const handleInputChange = (field: keyof Task, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      return
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    }

    if (task?._id) {
      await put(`/api/tasks/${task._id}`, taskData)
    } else {
      await post("/api/tasks", taskData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xs sm:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700 mx-4 sm:mx-0">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-base lg:text-lg font-semibold dark:text-white">
            {task ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs lg:text-sm"
          >
            Go Back
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium dark:text-white">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter task title"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium dark:text-white">
              Date
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-sm font-medium dark:text-white">Priority</Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {["Extreme", "Moderate", "Low"].map((priority) => (
                <label key={priority} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                    className="w-4 h-4 text-coral-500 border-gray-300 focus:ring-coral-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-sm dark:text-white">{priority}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium dark:text-white">Status</Label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              {["Not Started", "In Progress", "Completed"].map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-4 h-4 text-coral-500 border-gray-300 focus:ring-coral-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-sm dark:text-white">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium dark:text-white">
              Category
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-coral-500 focus:border-coral-500 dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Shopping">Shopping</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Task Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium dark:text-white">
                Task Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Start writing here..."
                rows={6}
                className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm"
                required
              />
            </div>

            {/* Upload Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-white">Upload Image</Label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 lg:p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-24 lg:h-32 object-cover rounded-lg mb-2"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImagePreview("")
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <X className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-2">Drag&Drop files here</p>
                    <p className="text-xs text-gray-400 mb-3">OR</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-xs lg:text-sm"
                    >
                      Browse
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-start pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.description}
              className="bg-coral-500 hover:bg-coral-600 text-white px-6 lg:px-8 text-sm lg:text-base"
            >
              {loading ? "Saving..." : "Done"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
