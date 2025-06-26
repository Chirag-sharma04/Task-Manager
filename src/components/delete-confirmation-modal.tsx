"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const isDefaultItem = message.includes("default")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-0">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <DialogDescription className="text-gray-600 dark:text-gray-400 py-4">{message}</DialogDescription>

        <div className="flex gap-3 pt-4">
          {!isDefaultItem && (
            <Button onClick={onConfirm} disabled={isLoading} className="bg-red-500 hover:bg-red-600 flex-1">
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button variant="outline" onClick={onClose} disabled={isLoading} className={isDefaultItem ? "flex-1" : ""}>
            {isDefaultItem ? "OK" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
