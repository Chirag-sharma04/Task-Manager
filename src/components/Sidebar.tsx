"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { LogOut, LayoutDashboard, Zap, CheckSquare, Grid3X3, Settings, HelpCircle, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", route: "/" },
  { icon: Zap, label: "Vital Task", route: "/vital" },
  { icon: CheckSquare, label: "My Task", route: "/tasks" },
  { icon: Grid3X3, label: "Task Categories", route: "/categories" },
  { icon: Settings, label: "Settings", route: "/settings" },
  { icon: HelpCircle, label: "Help", route: "/help" },
]

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (route: string) => {
    router.push(route)
    onClose()
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-100 dark:bg-gray-950 text-black dark:text-white flex flex-col transition-transform duration-300`}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-800">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-6 text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-coral-500 text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
     
              {/* Navigation */}
        <nav className="flex-1 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.route
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.route)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-coral-600 text-white"
                    : "text-gray-800 hover:bg-gray-200 dark:text-gray-200  dark:hover:bg-gray-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
         <button
           onClick={logout}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-left text-sm transition-colors text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
            >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </>
  )
}
