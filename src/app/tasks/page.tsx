import Head from "next/head"
import MyTasks from "@/components/my-tasks"

export default function TasksPage() {
  return (
    <>
      <Head>
        <title>My Tasks - Personal Task Manager</title>
        <meta name="description" content="View and manage all your personal tasks in one place." />
        <meta name="keywords" content="my tasks, personal tasks, task management, productivity" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://task-manager-smoky-five.vercel.app/tasks" />
        <meta property="og:title" content="My Tasks - Personal Task Manager" />
        <meta property="og:description" content="Manage all your personal tasks efficiently." />
        <meta property="og:image" content="https://task-manager-smoky-five.vercel.app/og-image.jpg" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <MyTasks />
      </main>
    </>
  )
}
