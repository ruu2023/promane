'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { PlaylistTask, Project } from '@/components/daily-task-screen';
import { TaskList, TodayTask } from '@/types/task';
import { ProjectList } from '@/types/project';

interface TodaysPlaylistProps {
  tasks: TodayTask[];
  projects: ProjectList[];
  onRemoveTask: (project: ProjectList, task: TodayTask) => void;
  onToggleComplete: (task: TodayTask) => void;
}

export function TodaysPlaylist({
  tasks,
  projects,
  onRemoveTask,
  onToggleComplete,
}: TodaysPlaylistProps) {
  const getProjectInfo = (projectId: number) => {
    return projects.find((p) => Number(p.id) === projectId);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Today&apos;s Playlist</h2>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="border border-border rounded-lg bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No tasks scheduled yet. Add tasks from the candidates list.
            </p>
          </div>
        ) : (
          tasks
            .filter((t) => t.status !== 'done')
            .map((task) => {
              const project = getProjectInfo(task.project_id);
              return (
                <div
                  key={task.id}
                  className="border border-border rounded-lg bg-card p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <Checkbox
                      checked={task.status === 'done'}
                      onCheckedChange={() => onToggleComplete(task)}
                      className="data-[state=checked]:bg-[var(--forest-accent)] data-[state=checked]:border-[var(--forest-accent)]"
                    />

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-medium mb-2 ${
                          task.status === 'done'
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {task.name}
                      </h3>

                      {project && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            // backgroundColor: project.color,
                            color: 'white',
                          }}
                        >
                          {project.name}
                        </span>
                      )}
                    </div>

                    {/* Remove Button */}
                    {project && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                        onClick={() => onRemoveTask(project, task)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
