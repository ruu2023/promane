'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, Project } from '@/components/daily-task-screen';
import { TaskList } from '@/types/task';
import { ProjectList } from '@/types/project';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  task: TaskList;
  projectId?: number;
  projects: ProjectList[];
  onSave: (task: TaskList) => void;
}

export function TaskModal({
  open,
  onOpenChange,
  mode,
  task,
  projectId,
  projects,
  onSave,
}: TaskModalProps) {
  const [taskName, setTaskName] = useState(task.name);
  const [selectedProjectId, setSelectedProjectId] = useState(task.project_id);
  const [description, setDescription] = useState(task.description || '');
  const handleSave = () => {
    if (!taskName.trim() || !selectedProjectId) return;

    const taskData = {
      ...task,
      name: taskName.trim(),
      project_id: selectedProjectId,
      description: description.trim(),
    };

    onSave(taskData);
    onOpenChange(false);
  };

  const modalTitle = `Edit '${task?.name}'`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">{modalTitle}</DialogTitle>
          <DialogDescription>アップデートします。</DialogDescription>
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
          {/* <div className="space-y-2">
            <Label htmlFor="project" className="text-sm font-medium text-foreground">
              Project <span className="text-destructive">*</span>
            </Label>
            <Select
              value={String(selectedProjectId)}
              onValueChange={(val) => setSelectedProjectId(Number(val))}
            >
              <SelectTrigger id="project" className="bg-background border-border">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

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
  );
}
