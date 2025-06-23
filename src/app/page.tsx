import Head from "next/head"
import TaskManager from "@/components/task-manager"

export default function Home() {
  return (
    <>
      <Head>
        <title>Personal Task Manager</title>
        <meta name="description" content="A simple personal task manager built with Next.js and Node.js." />
        <meta name="keywords" content="task manager, todo app, productivity, nextjs" />

        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:title" content="Personal Task Manager" />
        <meta property="og:description" content="Create and manage personal tasks effortlessly." />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personal Task Manager" />
        <meta name="twitter:description" content="Organize your tasks efficiently with this simple tool." />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <TaskManager />
      </main>
    </>
  )
}