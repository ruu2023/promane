"use client"

import type { Task } from "@/types/task"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onDragStart: () => void
}

const priorityConfig = {
  high: {
    label: "High",
    className: "bg-[var(--color-priority-high)] text-white",
  },
  medium: {
    label: "Medium",
    className: "bg-[var(--color-priority-medium)] text-foreground",
  },
  low: {
    label: "Low",
    className: "bg-[var(--color-priority-low)] text-white",
  },
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const priority = priorityConfig[task.priority]

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group cursor-grab rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing"
    >
      {/* Task Title */}
      <h3 className="mb-3 text-sm font-medium leading-snug text-card-foreground">{task.title}</h3>

      {/* Priority Badge */}
      <div className="mb-3">
        <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", priority.className)}>
          {priority.label}
        </span>
      </div>

      {/* Assignee */}
      <div className="mb-3 flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="bg-primary text-[10px] font-medium text-primary-foreground">
            {task.assignee.avatar}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{task.dueDate}</span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">{task.comments}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span className="text-xs">{task.labels}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
