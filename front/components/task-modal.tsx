"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task, Project } from "@/components/daily-task-screen"

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  task?: Task & { description?: string }
  projectId?: string
  projects: Project[]
  onSave: (task: Omit<Task, "id"> & { id?: string; description?: string }) => void
}

export function TaskModal({ open, onOpenChange, mode, task, projectId, projects, onSave }: TaskModalProps) {
  const [taskName, setTaskName] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("30")

  // Initialize form when modal opens or task changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && task) {
        setTaskName(task.name)
        setSelectedProjectId(task.projectId)
        setDescription(task.description || "")
        setDuration(task.duration.toString())
      } else if (mode === "add") {
        setTaskName("")
        setSelectedProjectId(projectId || projects[0]?.id || "")
        setDescription("")
        setDuration("30")
      }
    }
  }, [open, mode, task, projectId, projects])

  const handleSave = () => {
    if (!taskName.trim() || !selectedProjectId) return

    const taskData = {
      ...(mode === "edit" && task ? { id: task.id } : {}),
      name: taskName.trim(),
      projectId: selectedProjectId,
      duration: Number.parseInt(duration) || 30,
      description: description.trim() || undefined,
    }

    onSave(taskData)
    onOpenChange(false)
  }

  const modalTitle = mode === "add" ? "Add New Task" : `Edit '${task?.name}'`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-sm font-medium text-foreground">
              Task Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-name"
              placeholder="e.g., Complete chapter review"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="project" className="text-sm font-medium text-foreground">
              Project <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger id="project" className="bg-background border-border">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium text-foreground">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="5"
              step="5"
              placeholder="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add notes or details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-background border-border resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!taskName.trim() || !selectedProjectId}
            className="bg-[var(--forest-accent)] hover:bg-[var(--forest-accent)]/90 text-white"
          >
            Save Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
