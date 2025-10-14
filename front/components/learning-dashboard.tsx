"use client"

import { Button } from "@/components/ui/button"
import { ProjectRow } from "@/components/project-row"
import { TreeDeciduous } from "lucide-react"
import { useState } from "react"

interface Project {
  id: string
  name: string
  completedTasks: number
  totalTasks: number
  goalDate: string
}

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Advanced React Patterns",
    completedTasks: 40,
    totalTasks: 200,
    goalDate: "2025-10-31",
  },
  {
    id: "2",
    name: "TypeScript Mastery",
    completedTasks: 85,
    totalTasks: 150,
    goalDate: "2025-11-15",
  },
  {
    id: "3",
    name: "System Design Fundamentals",
    completedTasks: 12,
    totalTasks: 80,
    goalDate: "2025-12-01",
  },
  {
    id: "4",
    name: "Data Structures & Algorithms",
    completedTasks: 120,
    totalTasks: 300,
    goalDate: "2026-01-20",
  },
]

export function LearningDashboard() {
  const [mode, setMode] = useState<"list" | "kanban">("list")

  return (
    <div className="min-h-screen bg-[var(--color-forest-bg)]">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground">My Forest: Project Overview</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMode(mode === "list" ? "kanban" : "list")}
            className="h-10 w-10"
          >
            <TreeDeciduous className="h-5 w-5 text-[var(--color-forest-accent)]" />
          </Button>
        </div>
      </header>

      {/* Project List */}
      <main className="mx-auto max-w-7xl px-8 py-12">
        <div className="space-y-6">
          {sampleProjects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  )
}
