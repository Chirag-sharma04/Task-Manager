import Head from "next/head"
import TaskCategories from "@/components/task-categories"

export default function CategoriesPage() {
  return (
    <>
      <Head>
        <title>Task Categories - Personal Task Manager</title>
        <meta name="description" content="Manage your task categories, statuses, and priorities efficiently." />
        <meta name="keywords" content="task categories, task status, task priority, management" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://task-manager-smoky-five.vercel.app/categories" />
        <meta property="og:title" content="Task Categories - Personal Task Manager" />
        <meta property="og:description" content="Organize and manage your task categories." />
        <meta property="og:image" content="https://task-manager-smoky-five.vercel.app/og-image.jpg" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <TaskCategories />
      </main>
    </>
  )
}
