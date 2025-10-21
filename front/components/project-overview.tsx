'use client';

import { Suspense, useMemo, useOptimistic, useState, useTransition } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { QuickTaskAdd } from '@/components/quick-task-add';
import { TaskCard } from '@/components/task-card';
import { createProject } from '@/actions/project-actions';
import { ProjectList } from '@/types/project';
import { QuickProjectAdd } from './quick-project-add';
import { PaginatedData, ProjectErrors } from '@/types/common';
import { format, parseISO, startOfToday } from 'date-fns';
import { createTask, getTasks, updateTask } from '@/actions/task-actions';
import { TaskErrors, TaskList, TaskPriority, TaskStatus } from '@/types/task';
import { ProjectSkeleton } from './project-skelton';
import { TaskSkeleton } from './task-skelton';
import { User } from '@/types/user';
import { getTaskLabels } from '@/actions/task-label-actions';
import { TaskLabel } from '@/types/task-label';

export interface Task {
  id: string;
  name: string;
  projectId: string;
  dueDate: string;
  tags: string[];
}

export interface ProjectType {
  id: string;
  name: string;
  color: string;
  goalDate: string;
  tasks: Task[];
}

function calculateDaysLeft(goal: Date): number {
  const today = new Date();
  const diffTime = goal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

type Props = {
  projectsPaginated: PaginatedData<ProjectList>;
  currentUser: User;
};

type OptimisticProjectAction =
  | { type: 'ADD'; payload: ProjectList }
  | { type: 'UPDATE_COMPLETE_COUNT'; payload: { id: number; newCount: number } }
  | { type: 'UPDATE_TASK_COUNT'; payload: { id: number; newCount: number } };

export function ProjectOverview({ projectsPaginated, currentUser }: Props) {
  /**
   * Project
   */

  const getProjectTags = (project: ProjectList): string[] => {
    return ['tagA', 'tagB'];
    // const allTags = project.tasks.flatMap((task) => task.tags);
    // return Array.from(new Set(allTags));
  };

  const projectReducer = (
    currentState: ProjectList[],
    action: OptimisticProjectAction
  ): ProjectList[] => {
    switch (action.type) {
      case 'ADD': {
        const newProject = action.payload;
        if (currentState.length >= projectsPaginated.per_page) {
          return [newProject, ...currentState.slice(0, -1)];
        } else {
          return [newProject, ...currentState];
        }
      }
      case 'UPDATE_COMPLETE_COUNT': {
        const { id, newCount } = action.payload;
        return currentState.map((p) =>
          p.id === id ? { ...p, completed_tasks_count: newCount } : p
        );
      }
      case 'UPDATE_TASK_COUNT': {
        const { id, newCount } = action.payload;
        return currentState.map((p) => (p.id === id ? { ...p, tasks_count: newCount } : p));
      }
      default:
        return currentState;
    }
  };
  // 楽観的 UI 更新 Project
  const [optimisticProjects, setOptimisticProjects] = useOptimistic(
    projectsPaginated.data,
    projectReducer
  );

  const [projectErrors, setProjectErrors] = useState<ProjectErrors>({});

  const handleProjectCreate = async (formData: FormData) => {
    setProjectErrors({});
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const end_at = formData.get('end_at') as string;

    // For UX validation
    if (!name.trim()) {
      setProjectErrors({ name: ['プロジェクト名を入力してください'] });
      return;
    }

    const body = {
      name,
      description,
      start_at: format(startOfToday(), 'yyyy-MM-dd HH:mm:ss'),
      end_at,
    };

    const project = {
      ...body,
      id: -Date.now(),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      tasks_count: 0,
      completed_tasks_count: 0,
    };

    setOptimisticProjects({ type: 'ADD', payload: project });
    const res = await createProject(body);
    if (res.success) {
      return;
    }
    if (res.errors) {
      setProjectErrors(res.errors);
    }
  };

  /**
   * Task
   */
  const [isLoading, setIsLoading] = useState(false);
  // 楽観的 UI 更新 Tasks
  const [tasksByProject, setTasksByProject] = useState<Record<number, TaskList[]>>({});
  const [taskLabelsByProject, setTaskLabelsByProject] = useState<Record<number, TaskLabel[]>>({});
  const handleTriggerClick = async (projectId: number) => {
    const hasProjectFetched = Object.keys(tasksByProject).includes(String(projectId));
    if (hasProjectFetched || isLoading) return;
    setIsLoading(true);

    const taskRes = await getTasks(projectId);
    if (!taskRes.success) throw new Error('タスクの取得に失敗しました');
    setTasksByProject((prev) => ({ ...prev, [projectId]: taskRes.data.data }));
    const labelRes = await getTaskLabels(projectId);
    if (!labelRes.success) throw new Error('タスクの取得に失敗しました');
    setTaskLabelsByProject((prev) => ({ ...prev, [projectId]: labelRes.data }));
    setIsLoading(false);
  };

  const [isPending, startTransition] = useTransition();

  const [taskErrors, setTaskErrors] = useState<TaskErrors>({});
  const handleAddTask = (projectId: number, formData: FormData) => {
    setTaskErrors({});

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const end_at = formData.get('end_at') as string;

    // For UX validation
    if (!name.trim()) {
      setTaskErrors({ name: ['タスク名を入力してください'] });
      return;
    }

    const body = {
      name,
      description,
      status: 'in_progress' as TaskStatus,
      priority: 'low' as TaskPriority,
      start_at: format(startOfToday(), 'yyyy-MM-dd HH:mm:ss'),
      end_at,
      is_today: false,
      assigned_to: null,
    };

    const task = {
      ...body,
      id: -Date.now(),
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      creator: currentUser,
      assignee: null,
      labels: [],
      project_id: projectId,
      created_by: currentUser.id,
    };

    setTasksByProject((prev) => ({
      ...prev,
      [projectId]: [task, ...(prev[projectId] || [])],
    }));
    startTransition(() => {
      setOptimisticProjects({
        type: 'UPDATE_TASK_COUNT',
        payload: {
          id: projectId,
          newCount: (optimisticProjects.find((p) => p.id === projectId)?.tasks_count ?? 0) + 1,
        },
      });
    });
    createTask(projectId, body).then((res) => {
      if (res.success) {
        const newTask: TaskList = res.data;
        setTasksByProject((prev) => ({
          ...prev,
          [projectId]: prev[projectId].map((t) => (t.id === task.id ? newTask : t)),
        }));
        return;
      }
      if (res.errors) {
        setTasksByProject((prev) => ({
          ...prev,
          [projectId]: prev[projectId].filter((t) => t.id !== task.id),
        }));
        setTaskErrors(res.errors);
      }
    });
  };

  const handleDone = async (projectId: number, task: TaskList) => {
    if (!task) return;
    const body = {
      name: task.name,
      description: task.description,
      status: 'done' as TaskStatus,
      priority: task.priority,
      start_at: task.start_at,
      end_at: task.end_at,
      is_today: task.is_today,
      assigned_to: task.assigned_to,
    };

    startTransition(() => {
      setOptimisticProjects({
        type: 'UPDATE_COMPLETE_COUNT',
        payload: {
          id: projectId,
          newCount:
            (optimisticProjects.find((p) => p.id === projectId)?.completed_tasks_count ?? 0) + 1,
        },
      });
    });
    const res = await updateTask(task.id, body);
    if (res.success) {
      setTasksByProject((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((task) => (task.id === res.data.id ? res.data : task)),
      }));
      return;
    }
    if (res.errors) {
      setTaskErrors(res.errors);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Project Add */}
      <QuickProjectAdd onAddProject={handleProjectCreate} projectErrors={projectErrors} />

      {/* Project List */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <Accordion type="single" collapsible className="space-y-4">
          {optimisticProjects.map((project) => {
            const tasks = tasksByProject[project.id] ?? [];
            const completedTasks = project.completed_tasks_count ?? 0;
            const totalTasks = project.tasks_count;
            const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const endDate = project.end_at ? parseISO(project.end_at) : new Date();
            const daysLeft = calculateDaysLeft(endDate);
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const availableTags = taskLabelsByProject[project.id]?.map((label) => label.name) ?? [];
            return (
              <AccordionItem
                key={project.id}
                value={String(project.id)}
                className="border border-border rounded-lg bg-card"
              >
                <AccordionTrigger
                  onClick={() => handleTriggerClick(project.id)}
                  className="px-6 py-4 hover:no-underline"
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex-1 text-left">
                      {/* Project Name */}
                      <h2 className="text-lg font-semibold text-foreground mb-3">{project.name}</h2>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Progress value={progressPercentage} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          {completedTasks}/{totalTasks} tasks
                        </p>
                      </div>
                    </div>

                    {/* Goal Date and Days Left */}
                    <div className="flex items-center gap-8 ml-8">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Goal: {formattedEndDate}</p>
                      </div>
                      <div className="text-right min-w-[120px]">
                        <p className="text-3xl font-bold text-[var(--forest-accent)]">{daysLeft}</p>
                        <p className="text-sm text-muted-foreground">Days Left</p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  {/* Quick Task Add Form */}
                  <div className="mb-6">
                    <QuickTaskAdd
                      defaultDueDate={startOfToday()}
                      availableTags={availableTags}
                      onAddTask={(formData) => handleAddTask(project.id, formData)}
                      taskErrors={taskErrors}
                    />
                  </div>

                  {/* Task Cards Grid */}
                  {isLoading && <TaskSkeleton />}

                  {!isLoading && tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No tasks yet. Add your first task above!</p>
                    </div>
                  )}

                  {!isLoading && tasks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onDoneClick={() => handleDone(project.id, task)}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
