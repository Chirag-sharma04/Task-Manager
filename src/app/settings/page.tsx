"use client"

import type React from "react"

import { useState, useContext, useRef} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Lock,
  Bell,
  Shield,
  Download,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/contexts/auth-context"

export default function SettingsPage() {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const user = auth?.user
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeSection, setActiveSection] = useState("account")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Form states - initialize with user data
  const [accountInfo, setAccountInfo] = useState({
    firstName: user?.firstName || user?.username || "",
    lastName: user?.lastName ||"",
    email: user?.email || "",
    contactNumber: "",
    avatar: "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyReports: true,
  })

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Only JPEG, PNG, and WebP are allowed.")
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setErrorMessage("File too large. Maximum size is 5MB.")
      return
    }

    setIsUploadingAvatar(true)
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await fetch("/api/settings/avatar", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setAccountInfo((prev) => ({ ...prev, avatar: result.avatar }))
        setSuccessMessage("Profile picture updated successfully!")

        // Update auth context if available
        if (auth?.user && result.user) {
          // You might need to update the auth context here
        }
      } else {
        setErrorMessage(result.error || "Failed to upload profile picture")
      }
    } catch (error) {
      console.error("Avatar upload error:", error)
      setErrorMessage("Failed to upload profile picture")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleAccountUpdate = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountInfo),
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage("Profile updated successfully!")

        // Update auth context if available
        if (auth?.user && result.user) {
          // You might need to update the auth context here
        }
      } else {
        setErrorMessage(result.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      setErrorMessage("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage("New passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch("/api/settings/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordForm),
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage("Password updated successfully!")
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        setErrorMessage(result.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Password update error:", error)
      setErrorMessage("Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch("/api/settings/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage("Preferences updated successfully!")
      } else {
        setErrorMessage(result.error || "Failed to update preferences")
      }
    } catch (error) {
      console.error("Preferences update error:", error)
      setErrorMessage("Failed to update preferences")
    } finally {
      setIsLoading(false)
    }
  }

  const settingsOptions = [
    { id: "account", label: "Account Information", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "data", label: "Data Management", icon: Download },
  ]

  const renderAccountInfo = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={accountInfo.avatar || "/placeholder.svg?height=80&width=80"} />
              <AvatarFallback className="text-lg">
                {accountInfo.firstName.charAt(0)}
                {accountInfo.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? <Upload className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {accountInfo.firstName} {accountInfo.lastName}
            </h3>
            <p className="text-muted-foreground">{accountInfo.email}</p>
            <Badge variant="secondary" className="mt-1">
              Active
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={accountInfo.firstName}
              onChange={(e) => setAccountInfo({ ...accountInfo, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={accountInfo.lastName}
              onChange={(e) => setAccountInfo({ ...accountInfo, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={accountInfo.email}
              onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={accountInfo.contactNumber}
              onChange={(e) => setAccountInfo({ ...accountInfo, contactNumber: e.target.value })}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleAccountUpdate}
            disabled={isLoading || !accountInfo.firstName || !accountInfo.email}
            className="bg-coral-500 hover:bg-coral-600"
          >
            {isLoading ? "Updating..." : "Update Info"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveSection("password")}
            className="border-coral-500 text-coral-500 hover:bg-coral-50"
          >
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderPasswordChange = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={accountInfo.avatar || "/placeholder.svg?height=64&width=64"} />
            <AvatarFallback>
              {accountInfo.firstName.charAt(0)}
              {accountInfo.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {accountInfo.firstName} {accountInfo.lastName}
            </h3>
            <p className="text-muted-foreground">{accountInfo.email}</p>
          </div>
        </div>

        <Separator />

        {/* Password Form */}
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handlePasswordUpdate}
            disabled={
              isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword
            }
            className="bg-coral-500 hover:bg-coral-600"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveSection("account")}
            className="border-coral-500 text-coral-500 hover:bg-coral-50"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderNotifications = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Task Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
            </div>
            <Switch
              checked={preferences.taskReminders}
              onCheckedChange={(checked) => setPreferences({ ...preferences, taskReminders: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly productivity reports</p>
            </div>
            <Switch
              checked={preferences.weeklyReports}
              onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyReports: checked })}
            />
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="pt-4">
          <Button onClick={handlePreferencesUpdate} disabled={isLoading} className="bg-coral-500 hover:bg-coral-600">
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderPrivacy = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage your privacy and security settings</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Login Activity</Label>
              <p className="text-sm text-muted-foreground">View recent login activity</p>
            </div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Data Sharing</Label>
              <p className="text-sm text-muted-foreground">Control how your data is shared</p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderDataManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Export or delete your data</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">Download all your tasks and data</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-destructive">Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return renderAccountInfo()
      case "password":
        return renderPasswordChange()
      case "notifications":
        return renderNotifications()
      case "privacy":
        return renderPrivacy()
      case "data":
        return renderDataManagement()
      default:
        return renderAccountInfo()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.id}
                        onClick={() => setActiveSection(option.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeSection === option.id ? "bg-coral-50 text-coral-600 border-r-2 border-coral-500" : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
