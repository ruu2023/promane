'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { TaskModal } from '@/components/task-modal';
import { QuickTaskAdd } from '@/components/quick-task-add';
import type { Project, Task } from '@/components/daily-task-screen';
import { ProjectList } from '@/types/project';
import { TaskErrors, TaskList, TaskPriority, TaskStatus } from '@/types/task';
import { getTasks } from '@/actions/task-actions';
import { getTaskLabels } from '@/actions/task-label-actions';
import { TaskLabel } from '@/types/task-label';
import { TaskSkeleton } from './task-skelton';
import { startOfToday, format } from 'date-fns';

interface TaskCandidatesProps {
  projects: ProjectList[];
  onAddTask: (project: ProjectList, task: TaskList) => void;
  onEditTask: (task: TaskList) => void;
  onCreateTask: (tprojectId: number, formData: FormData) => void;
  tasksByProject: Record<number, TaskList[]>;
  taskLabelsByProject: Record<number, TaskLabel[]>;
  onTriggerClick: (projectId: number) => void;
  taskErrors: TaskErrors;
}

export function TaskCandidates({
  projects,
  onAddTask,
  onEditTask,
  onCreateTask,
  tasksByProject,
  taskLabelsByProject,
  onTriggerClick,
  taskErrors,
}: TaskCandidatesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskList>();

  const handleEditTask = (task: TaskList) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Task Candidates</h2>

      <Accordion type="multiple" className="space-y-2">
        {projects.map((project) => {
          const tasks = tasksByProject[project.id] ?? [];
          const availableTags = taskLabelsByProject[project.id]?.map((label) => label.name) ?? [];
          const filteredTasks = tasks
            .filter((t) => t.is_today !== true && t.status !== 'done')
            .slice(0, 6);
          return (
            <AccordionItem
              key={project.id}
              value={String(project.id)}
              className="border border-border rounded-lg bg-card"
            >
              <AccordionTrigger
                onClick={() => onTriggerClick(project.id)}
                className="px-4 py-3 hover:no-underline"
              >
                <span className="text-sm font-medium text-foreground">{project.name}</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-4">
                  <QuickTaskAdd
                    defaultDueDate={startOfToday()}
                    availableTags={availableTags}
                    onCreateTask={(formData) => onCreateTask(project.id, formData)}
                    taskErrors={taskErrors}
                  />

                  {/* Task List */}
                  <div className="space-y-2">
                    {filteredTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground py-2">No tasks available</p>
                    )}

                    {filteredTasks.map((task) => {
                      return (
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
                              onClick={() => onAddTask(project, task)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {selectedTask && (
        <TaskModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode="edit"
          task={selectedTask}
          projectId={selectedTask.project_id}
          projects={projects}
          onSave={onEditTask}
        />
      )}
    </div>
  );
}
