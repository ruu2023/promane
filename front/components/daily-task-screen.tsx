"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TreesIcon } from "lucide-react"
import { TaskCandidates } from "@/components/task-candidates"
import { TodaysPlaylist } from "@/components/todays-playlist"

export interface Task {
  id: string
  name: string
  projectId: string
  duration: number // in minutes
}

export interface Project {
  id: string
  name: string
  color: string
  tasks: Task[]
}

export interface PlaylistTask extends Task {
  completed: boolean
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "金の文法",
    color: "oklch(0.6 0.15 145)", // Green
    tasks: [
      { id: "t1", name: "Chapter 1: Basic Grammar", projectId: "1", duration: 30 },
      { id: "t2", name: "Chapter 2: Particles", projectId: "1", duration: 45 },
      { id: "t3", name: "Chapter 3: Verb Conjugation", projectId: "1", duration: 60 },
      { id: "t4", name: "Practice Exercises Set A", projectId: "1", duration: 30 },
      { id: "t5", name: "Practice Exercises Set B", projectId: "1", duration: 30 },
      { id: "t6", name: "Review and Quiz", projectId: "1", duration: 45 },
    ],
  },
  {
    id: "2",
    name: "React Advanced Patterns",
    color: "oklch(0.6 0.2 260)", // Blue
    tasks: [
      { id: "t7", name: "Compound Components Pattern", projectId: "2", duration: 45 },
      { id: "t8", name: "Render Props Pattern", projectId: "2", duration: 45 },
      { id: "t9", name: "Higher Order Components", projectId: "2", duration: 60 },
      { id: "t10", name: "Custom Hooks Deep Dive", projectId: "2", duration: 50 },
      { id: "t11", name: "Context API Best Practices", projectId: "2", duration: 40 },
    ],
  },
  {
    id: "3",
    name: "Machine Learning Fundamentals",
    color: "oklch(0.65 0.2 40)", // Orange
    tasks: [
      { id: "t12", name: "Linear Regression Theory", projectId: "3", duration: 60 },
      { id: "t13", name: "Gradient Descent Algorithm", projectId: "3", duration: 45 },
      { id: "t14", name: "Neural Networks Basics", projectId: "3", duration: 90 },
      { id: "t15", name: "Backpropagation Explained", projectId: "3", duration: 60 },
    ],
  },
]

export function DailyTaskScreen() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [playlist, setPlaylist] = useState<PlaylistTask[]>([
    {
      id: "t1",
      name: "Chapter 1: Basic Grammar",
      projectId: "1",
      duration: 30,
      completed: false,
    },
    {
      id: "t7",
      name: "Compound Components Pattern",
      projectId: "2",
      duration: 45,
      completed: false,
    },
  ])

  const handleAddToPlaylist = (task: Task) => {
    // Remove from project
    setProjects((prev) =>
      prev.map((project) =>
        project.id === task.projectId ? { ...project, tasks: project.tasks.filter((t) => t.id !== task.id) } : project,
      ),
    )

    // Add to playlist
    const newTask: PlaylistTask = {
      ...task,
      completed: false,
    }
    setPlaylist((prev) => [...prev, newTask])
  }

  const handleRemoveFromPlaylist = (task: PlaylistTask) => {
    // Remove from playlist
    setPlaylist((prev) => prev.filter((t) => t.id !== task.id))

    // Add back to project
    const taskWithoutPlaylistProps: Task = {
      id: task.id,
      name: task.name,
      projectId: task.projectId,
      duration: task.duration,
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.id === task.projectId ? { ...project, tasks: [...project.tasks, taskWithoutPlaylistProps] } : project,
      ),
    )
  }

  const handleToggleComplete = (taskId: string) => {
    setPlaylist((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">My Trees: Today&apos;s Focus</h1>
          <Button variant="ghost" size="icon">
            <TreesIcon className="h-5 w-5 text-[var(--forest-accent)]" />
          </Button>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Task Candidates */}
          <TaskCandidates projects={projects} onAddTask={handleAddToPlaylist} />

          {/* Right Column - Today's Playlist */}
          <TodaysPlaylist
            tasks={playlist}
            projects={projects}
            onRemoveTask={handleRemoveFromPlaylist}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </div>
  )
}
