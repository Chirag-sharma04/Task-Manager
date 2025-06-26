"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface EditData {
  _id: string
  name: string
  description?: string
  color?: string
  level?: number
}

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    description?: string
    color?: string
    level?: number
    type: "status" | "priority"
  }) => Promise<void>
  type: "status" | "priority"
  editData: EditData | null
  isLoading: boolean
}

const predefinedColors = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#6b7280" },
]

export default function CategoryModal({ isOpen, onClose, onSubmit, type, editData, isLoading }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6b7280",
    level: 5,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Reset form when modal opens/closes or editData changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // Editing existing item
        setFormData({
          name: editData.name || "",
          description: editData.description || "",
          color: editData.color || "#6b7280",
          level: editData.level || 5,
        })
      } else {
        // Creating new item
        setFormData({
          name: "",
          description: "",
          color: "#6b7280",
          level: 5,
        })
      }
      setErrors({})
    }
  }, [isOpen, editData])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters"
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters"
    }

    if (type === "priority") {
      if (formData.level < 1 || formData.level > 10) {
        newErrors.level = "Priority level must be between 1 and 10"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        type,
        ...(type === "priority" && { level: formData.level }),
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      color: "#6b7280",
      level: 5,
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-0">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {editData ? "Edit" : "Add"} {type === "status" ? "Status" : "Priority"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">{type === "status" ? "Status" : "Priority"} Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`Enter ${type} name`}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Enter ${type} description (optional)`}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Color Field */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2 flex-wrap">
              {predefinedColors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: colorOption.value })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === colorOption.value ? "border-gray-800 dark:border-white" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                />
              ))}
            </div>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-20 h-10"
            />
          </div>

          {/* Priority Level Field (only for priorities) */}
          {type === "priority" && (
            <div className="space-y-2">
              <Label htmlFor="level">Priority Level *</Label>
              <Select
                value={formData.level.toString()}
                onValueChange={(value) => setFormData({ ...formData, level: Number.parseInt(value) })}
              >
                <SelectTrigger className={errors.level ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level} {level <= 3 ? "(Low)" : level <= 6 ? "(Medium)" : "(High)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-coral-500 hover:bg-coral-600 flex-1">
              {isLoading ? "Saving..." : editData ? "Update" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
