"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendarWidget({ isOpen, onClose }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Adjust for Monday start

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameDate = (date1: Date | null, date2: Date) => {
    if (!date1) return false
    return date1.toDateString() === date2.toDateString()
  }

  if (!isOpen) return null

  const days = getDaysInMonth(currentDate)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Calendar</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date Display */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 relative">
              {formatSelectedDate(selectedDate)}
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSelectedDate(new Date())}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(day)}
                disabled={!day}
                className={`
                  h-10 w-10 rounded-full text-sm font-medium transition-colors
                  ${!day ? "invisible" : ""}
                  ${isToday(day) ? "bg-blue-600 text-white" : ""}
                  ${isSameDate(day, selectedDate) && !isToday(day) ? "bg-blue-100 text-blue-600" : ""}
                  ${day && !isToday(day) && !isSameDate(day, selectedDate) ? "hover:bg-gray-100" : ""}
                `}
              >
                {day?.getDate()}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
