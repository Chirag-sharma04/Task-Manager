"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X, Plus, Trash2 } from "lucide-react"
import { useApi } from "@/hooks/use-api"


interface VitalTask {
  _id?: string
  title: string
  description: string
  priority: "High" | "Extreme"
  status: "Not Started" | "In Progress" | "Completed"
  image?: string
  detailedSteps?: string[]
}

interface VitalTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: VitalTask | null
  onSuccess?: () => void
}

export default function VitalTaskModal({ isOpen, onClose, task, onSuccess }: VitalTaskModalProps) {
  const [formData, setFormData] = useState<Partial<VitalTask>>({
    title: "",
    description: "",
    priority: "High",
    status: "Not Started",
    image: "",
    detailedSteps: [],
  })

  const [imagePreview, setImagePreview] = useState<string>("")

  const { loading, post, put } = useApi({
    onSuccess: () => {
      onSuccess?.()
      handleClose()
    },
    onError: (error) => {
      console.error("Error saving vital task:", error)
    },
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "High",
        status: task.status || "Not Started",
        image: task.image || "",
        detailedSteps: task.detailedSteps || [],
      })
      setImagePreview(task.image || "")
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "High",
        status: "Not Started",
        image: "",
        detailedSteps: [],
      })
      setImagePreview("")
    }
  }, [task, isOpen])

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "High",
      status: "Not Started",
      image: "",
      detailedSteps: [],
    })
    setImagePreview("")
    onClose()
  }

  const handleInputChange = (field: keyof VitalTask, value: string | string[]) => {
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

  const addDetailedStep = () => {
    setFormData((prev) => ({
      ...prev,
      detailedSteps: [...(prev.detailedSteps || []), ""],
    }))
  }

  const updateDetailedStep = (index: number, value: string) => {
    const steps = [...(formData.detailedSteps || [])]
    steps[index] = value
    setFormData((prev) => ({
      ...prev,
      detailedSteps: steps,
    }))
  }

  const removeDetailedStep = (index: number) => {
    const steps = [...(formData.detailedSteps || [])]
    steps.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      detailedSteps: steps,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      return
    }

    const taskData = {
      ...formData,
      detailedSteps: formData.detailedSteps?.filter((step) => step.trim() !== ""),
    }

    if (task?._id) {
      await put(`/api/vital-tasks/${task._id}`, taskData)
    } else {
      await post("/api/vital-tasks", taskData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold dark:text-white">
            {task ? "Edit Vital Task" : "Add New Vital Task"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Go Back
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium dark:text-white">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter vital task title"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-sm font-medium dark:text-white">Priority</Label>
            <div className="flex gap-6">
              {["Extreme", "High"].map((priority) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                required
              />
            </div>

            {/* Upload Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-white">Upload Image</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mb-2"
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
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Drag&Drop files here</p>
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
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Browse
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium dark:text-white">Activities/Steps</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDetailedStep}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {formData.detailedSteps?.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={step}
                    onChange={(e) => updateDetailedStep(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDetailedStep(index)}
                    className="text-red-600 hover:text-red-700 dark:border-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={loading || !formData.title || !formData.description}
              className="bg-coral-500 hover:bg-coral-600 text-white px-8"
            >
              {loading ? "Saving..." : "Done"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
