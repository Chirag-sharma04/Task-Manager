"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; type: "status" | "priority" }) => void
  type: "status" | "priority"
  editData?: { id: number; name: string } | null
  isLoading?: boolean
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  editData,
  isLoading = false,
}: CategoryModalProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (editData) {
      setName(editData.name)
    } else {
      setName("")
    }
  }, [editData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit({ name: name.trim(), type })
      setName("")
    }
  }

  const handleClose = () => {
    setName("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold dark:text-white">
            {editData ? `Edit ${type === "status" ? "Task Status" : "Task Priority"}` : "Create Categories"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-sm font-medium dark:text-white">
                Category Name
              </Label>
              <Input
                id="categoryName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Enter ${type === "status" ? "status" : "priority"} name`}
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex-1 bg-coral-500 hover:bg-coral-600 text-white"
              >
                {isLoading ? "Processing..." : editData ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
