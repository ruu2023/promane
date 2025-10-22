'use client';

import type React from 'react';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TagInput } from '@/components/tag-input';
import { InputErrorPopover } from './input-error-popover';
import { TaskErrors } from '@/types/task';
import { SubmitButton } from './submit-button';

interface QuickTaskAddProps {
  defaultDueDate: Date;
  availableTags?: string[];
  onCreateTask: (formData: FormData) => void;
  taskErrors: TaskErrors;
}

export function QuickTaskAdd({
  defaultDueDate,
  availableTags = [],
  onCreateTask,
  taskErrors,
}: QuickTaskAddProps) {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState<Date>(defaultDueDate);
  const [tags, setTags] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Task Add</h3>
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onCreateTask(formData);
          formRef.current?.reset();
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Project id */}

          {/* Task Name */}
          <div className="md:col-span-1 relative">
            <Label htmlFor="task-name" className="text-xs text-muted-foreground">
              Task Name
            </Label>
            <Input
              id="task-name"
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              className="mt-1"
              name="name"
            />
            <InputErrorPopover message={taskErrors?.name?.[0]} />
          </div>
          {/* Task description */}
          <div className="md:col-span-1 relative">
            <Label htmlFor="project-description" className="text-xs text-muted-foreground">
              Task description
            </Label>
            <Input
              id="project-description"
              placeholder="Enter project description"
              className="mt-1"
              name="description"
            />
            <InputErrorPopover message={taskErrors?.description?.[0]} />
          </div>

          {/* Due Date */}
          <div className="relative">
            <Label htmlFor="due-date" className="text-xs text-muted-foreground">
              Due Date
            </Label>
            <input type="hidden" name="end_at" value={format(dueDate, 'yyyy-MM-dd HH:mm:ss')} />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal mt-1',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                />
              </PopoverContent>
            </Popover>
            <InputErrorPopover message={taskErrors?.end_at?.[0]} />
          </div>

          <div>
            <TagInput
              label="Tags"
              placeholder="Add tags"
              suggestions={availableTags}
              value={tags}
              onChange={setTags}
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <SubmitButton name="Add Task" loadMessage="Adding..." />
        </div>
      </form>
    </div>
  );
}
