"use client"

import { Progress } from "@/components/ui/progress"
import { differenceInDays, parseISO } from "date-fns"

interface ProjectRowProps {
  project: {
    id: string
    name: string
    completedTasks: number
    totalTasks: number
    goalDate: string
  }
}

export function ProjectRow({ project }: ProjectRowProps) {
  const { name, completedTasks, totalTasks, goalDate } = project
  const progressPercentage = (completedTasks / totalTasks) * 100
  const daysRemaining = differenceInDays(parseISO(goalDate), new Date())

  return (
    <div className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-[var(--color-forest-accent)] hover:shadow-lg">
      <div className="flex items-center justify-between gap-8">
        {/* Left Section: Project Info */}
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{name}</h2>

          {/* Progress Bar with Label */}
          <div className="space-y-2">
            <div className="relative">
              <Progress value={progressPercentage} className="h-8 bg-[var(--color-progress-bg)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-foreground">
                  {completedTasks}/{totalTasks} tasks
                </span>
              </div>
            </div>
          </div>

          {/* Goal Date */}
          <p className="text-base text-muted-foreground">
            Goal:{" "}
            {new Date(goalDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Right Section: Days Remaining */}
        <div className="flex flex-col items-end justify-center">
          <div className="text-right">
            <div className="text-5xl font-bold text-[var(--color-forest-accent)]">{daysRemaining}</div>
            <div className="mt-1 text-lg font-medium text-muted-foreground">Days Left</div>
          </div>
        </div>
      </div>
    </div>
  )
}
