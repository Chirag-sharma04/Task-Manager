"use client"

import { useState } from "react"
import { Bell, Calendar, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import NotificationsWidget from "./notifications-widget"
import { CalendarWidget } from "./calendar-widget"
import { ThemeToggle } from "./theme-toggle"

interface HeaderProps {
  onMenuClick?: () => void
  isMobileMenuOpen?: boolean
}

export function Header({ onMenuClick, isMobileMenuOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCalendarDate] = useState<Date>(new Date())

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const handleCalendarOpen = () => {
    setShowCalendar(true)
  }

  const handleCalendarClose = () => {
    setShowCalendar(false)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        {/* Left Section - Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden h-8 w-8 p-0">
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search your task here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-coral-500"
            />
          </div>
        </div>

        {/* Right Section - Actions & Date */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(true)}
            className="h-8 w-8 p-0 relative hover:bg-gray-100"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </Button>

          {/* Calendar Button */}
          <Button variant="ghost" size="sm" onClick={handleCalendarOpen} className="h-8 w-8 p-0 hover:bg-gray-100">
            <Calendar className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Date Display - Shows selected date from calendar */}
          <div className="hidden sm:block text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {formatDisplayDate(selectedCalendarDate)}
          </div>
        </div>
      </header>

      {/* Widgets */}
      <NotificationsWidget isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <CalendarWidget
        isOpen={showCalendar}
        onClose={handleCalendarClose}
        onDateSelect={() => {}}
        selectedDate={selectedCalendarDate}
      />
    </>
  )
}
