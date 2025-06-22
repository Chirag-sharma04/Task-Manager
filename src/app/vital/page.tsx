import Head from "next/head"
import VitalTasks from "@/components/vital-tasks"

export default function VitalPage() {
  return (
    <>
      <Head>
        <title>Vital Tasks - Personal Task Manager</title>
        <meta name="description" content="Manage your most important and urgent tasks efficiently." />
        <meta name="keywords" content="vital tasks, urgent tasks, high priority, task manager" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/vital" />
        <meta property="og:title" content="Vital Tasks - Personal Task Manager" />
        <meta property="og:description" content="Focus on your most critical tasks." />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <VitalTasks />
      </main>
    </>
  )
}
