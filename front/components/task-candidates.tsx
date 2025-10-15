"use client"

import { useState } from "react"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TaskModal } from "@/components/task-modal"
import { QuickTaskAdd } from "@/components/quick-task-add"
import type { Project, Task } from "@/components/daily-task-screen"

interface TaskCandidatesProps {
  projects: Project[]
  onAddTask: (task: Task) => void
  onEditTask: (task: Task) => void
  onCreateTask: (task: Omit<Task, "id">) => void
}

export function TaskCandidates({ projects, onAddTask, onEditTask, onCreateTask }: TaskCandidatesProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setModalOpen(true)
  }

  const handleSaveTask = (taskData: Omit<Task, "id"> & { id?: string; description?: string }) => {
    if (taskData.id) {
      const updatedTask: Task = {
        id: taskData.id,
        name: taskData.name,
        projectId: taskData.projectId,
        duration: taskData.duration,
        dueDate: taskData.dueDate,
        tags: taskData.tags,
      }
      onEditTask(updatedTask)
    }
  }

  const handleQuickAddTask = (projectId: string, taskData: { name: string; dueDate: string; tags: string[] }) => {
    const newTask: Omit<Task, "id"> = {
      name: taskData.name,
      projectId,
      duration: 30, // Default duration
      dueDate: taskData.dueDate,
      tags: taskData.tags,
    }
    onCreateTask(newTask)
  }

  const getProjectTags = (project: Project): string[] => {
    const allTags = project.tasks.flatMap((task) => task.tags || [])
    return Array.from(new Set(allTags))
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Task Candidates</h2>

      <Accordion type="multiple" className="space-y-2">
        {projects.map((project) => (
          <AccordionItem key={project.id} value={project.id} className="border border-border rounded-lg bg-card">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="text-sm font-medium text-foreground">{project.name}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-4">
                <QuickTaskAdd
                  projectId={project.id}
                  defaultDueDate="2025-10-31"
                  availableTags={getProjectTags(project)}
                  onAddTask={handleQuickAddTask}
                />

                {/* Task List */}
                <div className="space-y-2">
                  {project.tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No tasks available</p>
                  ) : (
                    project.tasks.slice(0, 6).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent transition-colors group"
                      >
                        <span className="text-sm text-foreground flex-1">{task.name}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEditTask(task)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-[var(--forest-accent)] hover:text-[var(--forest-accent)] hover:bg-[var(--forest-light)]"
                            onClick={() => onAddTask(task)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <TaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="edit"
        task={selectedTask}
        projectId={selectedTask?.projectId || ""}
        projects={projects}
        onSave={handleSaveTask}
      />
    </div>
  )
}
