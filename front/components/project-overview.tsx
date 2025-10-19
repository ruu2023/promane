'use client';

import { Suspense, useOptimistic, useState } from 'react';
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
import { postProjectInput, ProjectList } from '@/types/project';
import { QuickProjectAdd } from './quick-project-add';
import { PaginatedData, ProjectErrors } from '@/types/common';
import { format, parseISO, startOfToday } from 'date-fns';
import { createTask, getTasks } from '@/actions/task-actions';
import { TaskErrors, TaskList, TaskPriority, TaskStatus } from '@/types/task';
import { ProjectSkeleton } from './project-skelton';
import { TaskSkeleton } from './task-skelton';
import { User } from '@/types/user';

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

// const initialMockProjects: ProjectType[] = [
//   {
//     id: '1',
//     name: '金の文法',
//     color: 'oklch(0.6 0.15 145)',
//     goalDate: '2025-11-15',
//     tasks: [
//       {
//         id: 't1',
//         name: 'Chapter 1: Basic Grammar',
//         projectId: '1',
//         dueDate: '2025-10-20',
//         tags: ['grammar', 'basics'],
//       },
//       {
//         id: 't2',
//         name: 'Chapter 2: Particles',
//         projectId: '1',
//         dueDate: '2025-10-25',
//         tags: ['grammar'],
//       },
//       {
//         id: 't3',
//         name: 'Chapter 3: Verb Conjugation',
//         projectId: '1',
//         dueDate: '2025-10-30',
//         tags: ['verbs', 'grammar'],
//       },
//       {
//         id: 't4',
//         name: 'Practice Exercises Set A',
//         projectId: '1',
//         dueDate: '2025-11-01',
//         tags: ['practice'],
//       },
//       {
//         id: 't5',
//         name: 'Practice Exercises Set B',
//         projectId: '1',
//         dueDate: '2025-11-05',
//         tags: ['practice'],
//       },
//       {
//         id: 't6',
//         name: 'Review and Quiz',
//         projectId: '1',
//         dueDate: '2025-11-10',
//         tags: ['review', 'quiz'],
//       },
//     ],
//   },
//   {
//     id: '2',
//     name: 'React Advanced Patterns',
//     color: 'oklch(0.6 0.2 260)',
//     goalDate: '2025-10-31',
//     tasks: [
//       {
//         id: 't7',
//         name: 'Compound Components Pattern',
//         projectId: '2',
//         dueDate: '2025-10-18',
//         tags: ['patterns', 'components'],
//       },
//       {
//         id: 't8',
//         name: 'Render Props Pattern',
//         projectId: '2',
//         dueDate: '2025-10-20',
//         tags: ['patterns'],
//       },
//       {
//         id: 't9',
//         name: 'Higher Order Components',
//         projectId: '2',
//         dueDate: '2025-10-23',
//         tags: ['patterns', 'hoc'],
//       },
//       {
//         id: 't10',
//         name: 'Custom Hooks Deep Dive',
//         projectId: '2',
//         dueDate: '2025-10-26',
//         tags: ['hooks'],
//       },
//       {
//         id: 't11',
//         name: 'Context API Best Practices',
//         projectId: '2',
//         dueDate: '2025-10-29',
//         tags: ['context', 'state'],
//       },
//     ],
//   },
//   {
//     id: '3',
//     name: 'Machine Learning Fundamentals',
//     color: 'oklch(0.65 0.2 40)',
//     goalDate: '2025-11-30',
//     tasks: [
//       {
//         id: 't12',
//         name: 'Linear Regression Theory',
//         projectId: '3',
//         dueDate: '2025-10-22',
//         tags: ['theory', 'ml'],
//       },
//       {
//         id: 't13',
//         name: 'Gradient Descent Algorithm',
//         projectId: '3',
//         dueDate: '2025-10-28',
//         tags: ['algorithms'],
//       },
//       {
//         id: 't14',
//         name: 'Neural Networks Basics',
//         projectId: '3',
//         dueDate: '2025-11-05',
//         tags: ['neural-networks'],
//       },
//       {
//         id: 't15',
//         name: 'Backpropagation Explained',
//         projectId: '3',
//         dueDate: '2025-11-12',
//         tags: ['neural-networks'],
//       },
//     ],
//   },
// ];

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

export function ProjectOverview({ projectsPaginated, currentUser }: Props) {
  // const [mockProjects, setMockProjects] = useState<ProjectType[]>(initialMockProjects);

  /**
   * Project
   */

  const getProjectTags = (project: ProjectList): string[] => {
    return ['tagA', 'tagB'];
    // const allTags = project.tasks.flatMap((task) => task.tags);
    // return Array.from(new Set(allTags));
  };

  // 楽観的 UI 更新 Project
  const [optimisticProjects, addOptimisticProjects] = useOptimistic(
    projectsPaginated.data,
    (curr, newProject: ProjectList) => {
      if (curr.length > projectsPaginated.per_page) {
        return [newProject, ...curr.slice(0, -1)];
      } else {
        return [newProject, ...curr];
      }
    }
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
    };

    addOptimisticProjects(project);
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
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasksPerPage, setTasksPerPage] = useState(20);
  // 楽観的 UI 更新 Tasks
  const [tasks, setTasks] = useState<TaskList[]>([]);
  const [optimisticTasks, addOptimisticTasks] = useOptimistic(tasks, (curr, newTask: TaskList) => {
    if (curr.length > tasksPerPage) {
      return [newTask, ...curr.slice(0, -1)];
    } else {
      return [newTask, ...curr];
    }
  });

  const handleTriggerClick = async (projectId: number) => {
    if (hasFetched || isLoading) return;
    setIsLoading(true);
    setHasFetched(true);

    const taskRes = await getTasks(projectId);
    if (!taskRes.success) throw new Error('タスクの取得に失敗しました');
    setTasksPerPage(taskRes.data.per_page);
    setTasks(taskRes.data.data);
    setIsLoading(false);
  };

  const [taskErrors, setTaskErrors] = useState<TaskErrors>({});
  const handleAddTask = async (projectId: number, formData: FormData) => {
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

    addOptimisticTasks(task);

    const res = await createTask(projectId, body);
    if (res.success) {
      setTasks((prev) => [res.data, ...prev]);
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
            const completedTasks = 0; // You can track this separately
            const totalTasks = project.tasks_count;
            const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const endDate = project.end_at ? parseISO(project.end_at) : new Date();
            const daysLeft = calculateDaysLeft(endDate);
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const availableTags = getProjectTags(project);

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
                      defaultDueDate={new Date()}
                      availableTags={availableTags}
                      onAddTask={(formData) => handleAddTask(project.id, formData)}
                    />
                  </div>

                  {/* Task Cards Grid */}
                  {isLoading && <TaskSkeleton />}

                  {!isLoading && hasFetched && optimisticTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No tasks yet. Add your first task above!</p>
                    </div>
                  )}

                  {!isLoading && optimisticTasks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {optimisticTasks.map((task) => (
                        <TaskCard key={task.id} task={task} projectColor={'#000'} />
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
