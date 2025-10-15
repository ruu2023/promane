"use client"

import type { Task } from "@/components/project-overview"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  projectColor: string
}

export function TaskCard({ task, projectColor }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      {/* Task Name */}
      <h3 className="mb-3 text-sm font-medium leading-snug text-card-foreground">{task.name}</h3>

      {/* Due Date */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground">Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</p>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor: `color-mix(in oklch, ${projectColor} 20%, transparent)`,
                color: projectColor,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
