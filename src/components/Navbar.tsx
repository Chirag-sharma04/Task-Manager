"use client"

import { Button } from "@/components/ui/button"
import { Search, Bell, Calendar, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { CalendarWidget } from "@/components/calendar-widget"
import NotificationsWidget from "@/components/notifications-widget"

export default function Navbar({
  onSidebarToggle,
  searchQuery,
  setSearchQuery,
  onSearch,
}: {
  onSidebarToggle: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  onSearch: (e: React.FormEvent) => void
}) {
  const [showNotification, setShowNotification] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-6 min-w-0 flex-1">
          <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="lg:hidden text-gray-600 dark:text-gray-300">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl lg:text-2xl font-bold">
            <span className="text-coral-500">Dash</span>
            <span className="text-black dark:text-white">board</span>
          </h1>

          <form onSubmit={onSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your task here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-60 lg:w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button size="sm" className="bg-coral-500 hover:bg-coral-600">
            <Search className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
            onClick={() => setShowNotification(!showNotification)}
          >
            <Bell className="w-4 h-4" />
            <NotificationsWidget isOpen={showNotification} onClose={() => setShowNotification(false)} />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex border-coral-500 text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar className="w-4 h-4" />
          </Button>
            <CalendarWidget 
              isOpen={showCalendar} 
              onClose={() => setShowCalendar(false)} 
              selectedDate={selectedDate ?? new Date()}
              onDateSelect={(date) => {
               setSelectedDate(date)
               setShowCalendar(false)
              }}
            />


          <ThemeToggle />

          {/* Date */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium dark:text-white">
            {(selectedDate ?? new Date()).toLocaleDateString("en-US", { weekday: "long" })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
             {(selectedDate ?? new Date()).toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })}
            </p>

          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <form onSubmit={onSearch} className="relative mt-3 md:hidden">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search your task here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white"
        />
      </form>
    </header>
  )
}
