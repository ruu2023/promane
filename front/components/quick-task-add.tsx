"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TagInput } from "@/components/tag-input"

interface QuickTaskAddProps {
  projectId: string
  defaultDueDate: string
  availableTags?: string[]
  onAddTask: (projectId: string, taskData: { name: string; dueDate: string; tags: string[] }) => void
}

export function QuickTaskAdd({ projectId, defaultDueDate, availableTags = [], onAddTask }: QuickTaskAddProps) {
  const [taskName, setTaskName] = useState("")
  const [dueDate, setDueDate] = useState<Date>(new Date(defaultDueDate))
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskName.trim()) return

    onAddTask(projectId, {
      name: taskName,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      tags,
    })

    // Reset form
    setTaskName("")
    setDueDate(new Date(defaultDueDate))
    setTags([])
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Task Add</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Task Name */}
          <div className="md:col-span-1">
            <Label htmlFor="task-name" className="text-xs text-muted-foreground">
              Task Name
            </Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              className="mt-1"
            />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="due-date" className="text-xs text-muted-foreground">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal mt-1", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={(date) => date && setDueDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <TagInput label="Tags" placeholder="Add tags" suggestions={availableTags} value={tags} onChange={setTags} />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-[var(--forest-accent)] hover:bg-[var(--forest-muted)] text-white">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </form>
    </div>
  )
}
