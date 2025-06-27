"use client"
import Head from "next/head"
import TaskManager from "@/components/task-manager"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
    useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coral-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  return (
    <>
      <Head>
        <title>Personal Task Manager</title>
        <meta name="description" content="A simple personal task manager built with Next.js and Node.js." />
        <meta name="keywords" content="task manager, todo app, productivity, nextjs" />

        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://task-manager-smoky-five.vercel.app/" />
        <meta property="og:title" content="Personal Task Manager" />
        <meta property="og:description" content="Create and manage personal tasks effortlessly." />
        <meta property="og:image" content="https://task-manager-smoky-five.vercel.app/og-image.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personal Task Manager" />
        <meta name="twitter:description" content="Organize your tasks efficiently with this simple tool." />
        <meta name="twitter:image" content="https://task-manager-smoky-five.vercel.app/og-image.jpg" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <TaskManager />
      </main>
    </>
  )
}