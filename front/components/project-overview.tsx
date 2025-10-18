'use client';

import { useOptimistic, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TreesIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { QuickTaskAdd } from '@/components/quick-task-add';
import { TaskCard } from '@/components/task-card';
import { createProject } from '@/actions/projectActions';
import { postProjectInput, Project } from '@/types/project';
import { QuickProjectAdd } from './quick-project-add';
import { ViewName } from '@/app/page';

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

const initialProjects: ProjectType[] = [
  {
    id: '1',
    name: '金の文法',
    color: 'oklch(0.6 0.15 145)',
    goalDate: '2025-11-15',
    tasks: [
      {
        id: 't1',
        name: 'Chapter 1: Basic Grammar',
        projectId: '1',
        dueDate: '2025-10-20',
        tags: ['grammar', 'basics'],
      },
      {
        id: 't2',
        name: 'Chapter 2: Particles',
        projectId: '1',
        dueDate: '2025-10-25',
        tags: ['grammar'],
      },
      {
        id: 't3',
        name: 'Chapter 3: Verb Conjugation',
        projectId: '1',
        dueDate: '2025-10-30',
        tags: ['verbs', 'grammar'],
      },
      {
        id: 't4',
        name: 'Practice Exercises Set A',
        projectId: '1',
        dueDate: '2025-11-01',
        tags: ['practice'],
      },
      {
        id: 't5',
        name: 'Practice Exercises Set B',
        projectId: '1',
        dueDate: '2025-11-05',
        tags: ['practice'],
      },
      {
        id: 't6',
        name: 'Review and Quiz',
        projectId: '1',
        dueDate: '2025-11-10',
        tags: ['review', 'quiz'],
      },
    ],
  },
  {
    id: '2',
    name: 'React Advanced Patterns',
    color: 'oklch(0.6 0.2 260)',
    goalDate: '2025-10-31',
    tasks: [
      {
        id: 't7',
        name: 'Compound Components Pattern',
        projectId: '2',
        dueDate: '2025-10-18',
        tags: ['patterns', 'components'],
      },
      {
        id: 't8',
        name: 'Render Props Pattern',
        projectId: '2',
        dueDate: '2025-10-20',
        tags: ['patterns'],
      },
      {
        id: 't9',
        name: 'Higher Order Components',
        projectId: '2',
        dueDate: '2025-10-23',
        tags: ['patterns', 'hoc'],
      },
      {
        id: 't10',
        name: 'Custom Hooks Deep Dive',
        projectId: '2',
        dueDate: '2025-10-26',
        tags: ['hooks'],
      },
      {
        id: 't11',
        name: 'Context API Best Practices',
        projectId: '2',
        dueDate: '2025-10-29',
        tags: ['context', 'state'],
      },
    ],
  },
  {
    id: '3',
    name: 'Machine Learning Fundamentals',
    color: 'oklch(0.65 0.2 40)',
    goalDate: '2025-11-30',
    tasks: [
      {
        id: 't12',
        name: 'Linear Regression Theory',
        projectId: '3',
        dueDate: '2025-10-22',
        tags: ['theory', 'ml'],
      },
      {
        id: 't13',
        name: 'Gradient Descent Algorithm',
        projectId: '3',
        dueDate: '2025-10-28',
        tags: ['algorithms'],
      },
      {
        id: 't14',
        name: 'Neural Networks Basics',
        projectId: '3',
        dueDate: '2025-11-05',
        tags: ['neural-networks'],
      },
      {
        id: 't15',
        name: 'Backpropagation Explained',
        projectId: '3',
        dueDate: '2025-11-12',
        tags: ['neural-networks'],
      },
    ],
  },
];

function calculateDaysLeft(goalDate: string): number {
  const today = new Date();
  const goal = new Date(goalDate);
  const diffTime = goal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

type Props = {
  // onChangeView: (name: ViewName) => void;
};

export function ProjectOverview({}: Props) {
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);

  const handleAddTask = (projectId: string, taskData: Omit<Task, 'id' | 'projectId'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      projectId,
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, tasks: [...project.tasks, newTask] } : project
      )
    );
  };

  const getProjectTags = (project: ProjectType): string[] => {
    const allTags = project.tasks.flatMap((task) => task.tags);
    return Array.from(new Set(allTags));
  };

  // 楽観的 UI 更新

  // optimistic
  // const [optimisticProject, addOptimisticProject] = useOptimistic(
  //   projectProps,
  //   (curr, newProject: Project) => {
  //     return [newProject, ...curr.slice(0, -1)];
  //   }
  // );

  // const handleProjectCreate = async () => {
  //   const tmpBody = {
  //     name: 'nextプロジェクト2025-10-17',
  //     description: 'next から送信',
  //     start_at: '2025-10-01',
  //     end_at: '2025-11-01',
  //   };

  //   const tmpProject = {
  //     ...tmpBody,
  //     id: Date.now(),
  //   };

  //   addOptimisticProject(tmpProject);
  //   const res = await createProject(tmpBody);
  //   if (res.success) {
  //     console.log('ok');
  //     return;
  //   }
  //   console.log('NG');
  // };

  const [projectErrors, setProjectErrors] = useState({});

  const handleAddProject = async (body: postProjectInput) => {
    const res = await createProject(body);
    if (res.success) {
      alert(`できたんご。${res.data.created_at}`);
    } else {
      if (res.errors) {
        setProjectErrors(res.errors);
      }
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">My Forest: Project Overview</h1>
          <Button onClick={() => router.push('/daily')} variant="ghost" size="icon">
            <TreesIcon className="h-5 w-5 text-[var(--forest-accent)]" />
          </Button>
        </div>
      </header>

      {/* Project Add */}
      <QuickProjectAdd onAddProject={handleAddProject} projectErrors={projectErrors} />

      {/* Project List */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <Accordion type="single" collapsible className="space-y-4">
          {projects.map((project) => {
            const completedTasks = 0; // You can track this separately
            const totalTasks = project.tasks.length;
            const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const daysLeft = calculateDaysLeft(project.goalDate);
            const availableTags = getProjectTags(project);

            return (
              <AccordionItem
                key={project.id}
                value={project.id}
                className="border border-border rounded-lg bg-card"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
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
                        <p className="text-sm text-muted-foreground">Goal: {project.goalDate}</p>
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
                      projectId={project.id}
                      defaultDueDate={project.goalDate}
                      availableTags={availableTags}
                      onAddTask={handleAddTask}
                    />
                  </div>

                  {/* Task Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} projectColor={project.color} />
                    ))}
                  </div>

                  {project.tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No tasks yet. Add your first task above!</p>
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
