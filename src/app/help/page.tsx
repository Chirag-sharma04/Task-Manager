"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  MessageCircle,
  Book,
  Video,
  Mail,
  Phone,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Star,
  Clock,
  Users,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function HelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const helpCategories = [
    {
      title: "Getting Started",
      icon: Book,
      articles: [
        "How to create your first task",
        "Understanding task categories",
        "Setting up your dashboard",
        "Managing your profile",
      ],
    },
    {
      title: "Task Management",
      icon: Users,
      articles: [
        "Creating and editing tasks",
        "Setting task priorities",
        "Using task categories",
        "Task collaboration features",
      ],
    },
    {
      title: "Account & Settings",
      icon: Star,
      articles: ["Changing your password", "Notification preferences", "Privacy settings", "Data export options"],
    },
    {
      title: "Troubleshooting",
      icon: Clock,
      articles: ["Common login issues", "Task sync problems", "Performance optimization", "Browser compatibility"],
    },
  ]

  const faqs = [
    {
      question: "How do I create a new task?",
      answer:
        'To create a new task, click the "Add Task" button on your dashboard, fill in the task details including title, description, priority, and category, then click "Create Task".',
    },
    {
      question: "Can I collaborate with team members?",
      answer:
        "Yes! You can invite team members to your workspace, assign tasks to them, and track progress together. Use the team collaboration features in the dashboard.",
    },
    {
      question: "How do I change my password?",
      answer:
        'Go to Settings > Change Password, enter your current password and new password, then click "Update Password" to save the changes.',
    },
    {
      question: "What are task categories and how do I use them?",
      answer:
        "Task categories help you organize your tasks by type or project. You can create custom categories in the Task Categories section and assign them when creating tasks.",
    },
    {
      question: "How do I export my data?",
      answer:
        'You can export all your tasks and data by going to Settings > Data Management and clicking the "Export" button. This will download a file with all your information.',
    },
    {
      question: "Why are my tasks not syncing?",
      answer:
        "Task sync issues can occur due to network connectivity. Try refreshing the page, checking your internet connection, or logging out and back in.",
    },
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log("Contact form submitted:", contactForm)
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" })
    alert("Your message has been sent! We'll get back to you soon.")
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-muted-foreground">Find answers and get support</p>
            </div>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Help Categories */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpCategories.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-coral-500" />
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.articles.map((article, articleIndex) => (
                            <li
                              key={articleIndex}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <ChevronRight className="h-3 w-3" />
                              {article}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <CardTitle className="flex items-center justify-between text-lg">
                        {faq.question}
                        {expandedFaq === index ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    {expandedFaq === index && (
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            {/* Video Tutorials */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Video Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Getting Started with To-Do", duration: "3:45" },
                  { title: "Advanced Task Management", duration: "5:20" },
                  { title: "Team Collaboration Features", duration: "4:15" },
                  { title: "Customizing Your Workspace", duration: "2:30" },
                ].map((video, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">{video.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/settings">
                    <Star className="h-4 w-4 mr-2" />
                    Account Settings
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  User Guide
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Tutorials
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Need more help? Get in touch with us</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-coral-500 hover:bg-coral-600">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-coral-500" />
                    <span>support@todo-app.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-coral-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">All systems operational</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Last updated: 2 minutes ago</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
