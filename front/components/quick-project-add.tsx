'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { InputErrorPopover } from './input-error-popover';
import { ProjectErrors } from '@/types/common';
import { SubmitButton } from './submit-button';

interface QuickTaskAddProps {
  onAddProject: (formData: FormData) => void;
  projectErrors?: ProjectErrors;
}

export function QuickProjectAdd({ onAddProject, projectErrors }: QuickTaskAddProps) {
  const [dueDate, setDueDate] = useState<Date>(startOfToday());
  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Project Add</h3>
      <form action={onAddProject} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Project Name */}
          <div className="md:col-span-1 relative">
            <Label htmlFor="project-name" className="text-xs text-muted-foreground">
              Project Name
            </Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              className="mt-1"
              name="name"
            />
            <InputErrorPopover message={projectErrors?.name?.[0]} />
          </div>
          {/* Project description */}
          <div className="md:col-span-1 relative">
            <Label htmlFor="project-description" className="text-xs text-muted-foreground">
              Project description
            </Label>
            <Input
              id="project-description"
              placeholder="Enter project description"
              className="mt-1"
              name="description"
            />
            <InputErrorPopover message={projectErrors?.description?.[0]} />
          </div>
          {/* Due Date */}
          <div className="relative">
            <input type="hidden" name="end_at" value={format(dueDate, 'yyyy-MM-dd HH:mm:ss')} />
            <Label htmlFor="due-date" className="text-xs text-muted-foreground">
              Due Date
            </Label>
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
            <InputErrorPopover message={projectErrors?.end_at?.[0]} />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
