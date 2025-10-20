'use client';

import type { Task } from '@/components/project-overview';
import { TaskList } from '@/types/task';
import { format, parseISO } from 'date-fns';
import { Button } from './ui/button';
import { DayButton } from 'react-day-picker';

interface TaskCardProps {
  task: TaskList;
  onDoneClick?: () => void;
}

export function TaskCard({ task, onDoneClick }: TaskCardProps) {
  const endDate = task.end_at ? parseISO(task.end_at) : new Date();
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      {/* Task Name */}
      <h3 className="mb-3 text-sm font-medium leading-snug text-card-foreground">{task.name}</h3>

      {/* Due Date */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground">Due: {format(endDate, 'MMM dd, yyyy')}</p>
      </div>

      {/* Tags */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.labels.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor: `color-mix(in oklch, ${tag.color} 20%, transparent)`,
                color: tag.color,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Done */}
      <Button
        type="button"
        onClick={onDoneClick}
        className="bg-[var(--forest-accent)] hover:bg-[var(--forest-muted)] text-white"
      >
        Done
      </Button>
    </div>
  );
}
