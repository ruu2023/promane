'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TagInput } from '@/components/tag-input';
import { postProjectInput } from '@/types/project';
import { InputErrorPopover } from './input-error-popover';

interface QuickTaskAddProps {
  onAddProject: (body: postProjectInput) => void;
  projectErrors?: { [key: string]: string[] };
}

export function QuickProjectAdd({ onAddProject, projectErrors }: QuickTaskAddProps) {
  const initProjectData = {
    name: '',
    description: '',
    start_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    end_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  };
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState<postProjectInput>(initProjectData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!formData.name.trim()) return;
    setFormData((prevData) => ({
      ...prevData,
      end_at: format(new Date(dueDate), 'yyyy-MM-dd HH:mm:ss'),
    }));
    // console.log(formData);
    onAddProject(formData);

    // Reset form
    setFormData({
      name: '',
      description: '',
      start_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      end_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    });
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Project Add</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Project Name */}
          <div className="md:col-span-1 relative">
            <Label htmlFor="project-name" className="text-xs text-muted-foreground">
              Project Name
            </Label>
            <Input
              id="project-name"
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Enter project description"
              className="mt-1"
              name="description"
            />
            <InputErrorPopover message={projectErrors?.description?.[0]} />
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
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[var(--forest-accent)] hover:bg-[var(--forest-muted)] text-white"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </form>
    </div>
  );
}
