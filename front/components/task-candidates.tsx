"use client"

import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Project, Task } from "@/components/daily-task-screen"

interface TaskCandidatesProps {
  projects: Project[]
  onAddTask: (task: Task) => void
}

export function TaskCandidates({ projects, onAddTask }: TaskCandidatesProps) {
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
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-3 text-[var(--forest-accent)] border-[var(--forest-accent)] hover:bg-[var(--forest-light)] bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Task to this Project
                </Button>

                {project.tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No tasks available</p>
                ) : (
                  project.tasks.map((task) => (
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
