'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TreesIcon } from 'lucide-react';
import { TaskCandidates } from '@/components/task-candidates';
import { TodaysPlaylist } from '@/components/todays-playlist';
import { useRouter } from 'next/navigation';

export interface Task {
  id: string;
  name: string;
  projectId: string;
  duration: number; // in minutes
  dueDate?: string;
  tags?: string[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface PlaylistTask extends Task {
  completed: boolean;
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: '金の文法',
    color: 'oklch(0.6 0.15 145)', // Green
    tasks: [
      {
        id: 't1',
        name: 'Chapter 1: Basic Grammar',
        projectId: '1',
        duration: 30,
        dueDate: '2025-10-20',
        tags: ['grammar', 'basics'],
      },
      {
        id: 't2',
        name: 'Chapter 2: Particles',
        projectId: '1',
        duration: 45,
        dueDate: '2025-10-22',
        tags: ['grammar', 'particles'],
      },
      {
        id: 't3',
        name: 'Chapter 3: Verb Conjugation',
        projectId: '1',
        duration: 60,
        dueDate: '2025-10-25',
        tags: ['grammar', 'verbs'],
      },
      {
        id: 't4',
        name: 'Practice Exercises Set A',
        projectId: '1',
        duration: 30,
        dueDate: '2025-10-27',
        tags: ['practice'],
      },
      {
        id: 't5',
        name: 'Practice Exercises Set B',
        projectId: '1',
        duration: 30,
        dueDate: '2025-10-29',
        tags: ['practice'],
      },
      {
        id: 't6',
        name: 'Review and Quiz',
        projectId: '1',
        duration: 45,
        dueDate: '2025-10-31',
        tags: ['review', 'quiz'],
      },
    ],
  },
  {
    id: '2',
    name: 'React Advanced Patterns',
    color: 'oklch(0.6 0.2 260)', // Blue
    tasks: [
      {
        id: 't7',
        name: 'Compound Components Pattern',
        projectId: '2',
        duration: 45,
        dueDate: '2025-10-18',
        tags: ['patterns', 'components'],
      },
      {
        id: 't8',
        name: 'Render Props Pattern',
        projectId: '2',
        duration: 45,
        dueDate: '2025-10-20',
        tags: ['patterns', 'props'],
      },
      {
        id: 't9',
        name: 'Higher Order Components',
        projectId: '2',
        duration: 60,
        dueDate: '2025-10-23',
        tags: ['patterns', 'hoc'],
      },
      {
        id: 't10',
        name: 'Custom Hooks Deep Dive',
        projectId: '2',
        duration: 50,
        dueDate: '2025-10-25',
        tags: ['hooks', 'advanced'],
      },
      {
        id: 't11',
        name: 'Context API Best Practices',
        projectId: '2',
        duration: 40,
        dueDate: '2025-10-28',
        tags: ['context', 'state'],
      },
    ],
  },
  {
    id: '3',
    name: 'Machine Learning Fundamentals',
    color: 'oklch(0.65 0.2 40)', // Orange
    tasks: [
      {
        id: 't12',
        name: 'Linear Regression Theory',
        projectId: '3',
        duration: 60,
        dueDate: '2025-10-19',
        tags: ['theory', 'regression'],
      },
      {
        id: 't13',
        name: 'Gradient Descent Algorithm',
        projectId: '3',
        duration: 45,
        dueDate: '2025-10-22',
        tags: ['algorithms', 'optimization'],
      },
      {
        id: 't14',
        name: 'Neural Networks Basics',
        projectId: '3',
        duration: 90,
        dueDate: '2025-10-26',
        tags: ['neural-networks', 'basics'],
      },
      {
        id: 't15',
        name: 'Backpropagation Explained',
        projectId: '3',
        duration: 60,
        dueDate: '2025-10-30',
        tags: ['neural-networks', 'theory'],
      },
    ],
  },
];

type Props = {
  // onChangeView: (name: ViewName) => void;
};

export function DailyTaskScreen({}: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [playlist, setPlaylist] = useState<PlaylistTask[]>([
    {
      id: 't1',
      name: 'Chapter 1: Basic Grammar',
      projectId: '1',
      duration: 30,
      dueDate: '2025-10-20',
      tags: ['grammar', 'basics'],
      completed: false,
    },
    {
      id: 't7',
      name: 'Compound Components Pattern',
      projectId: '2',
      duration: 45,
      dueDate: '2025-10-18',
      tags: ['patterns', 'components'],
      completed: false,
    },
  ]);

  const handleAddToPlaylist = (task: Task) => {
    // Remove from project
    setProjects((prev) =>
      prev.map((project) =>
        project.id === task.projectId
          ? { ...project, tasks: project.tasks.filter((t) => t.id !== task.id) }
          : project
      )
    );

    // Add to playlist
    const newTask: PlaylistTask = {
      ...task,
      completed: false,
    };
    setPlaylist((prev) => [...prev, newTask]);
  };

  const handleRemoveFromPlaylist = (task: PlaylistTask) => {
    // Remove from playlist
    setPlaylist((prev) => prev.filter((t) => t.id !== task.id));

    // Add back to project
    const taskWithoutPlaylistProps: Task = {
      id: task.id,
      name: task.name,
      projectId: task.projectId,
      duration: task.duration,
      dueDate: task.dueDate,
      tags: task.tags,
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === task.projectId
          ? { ...project, tasks: [...project.tasks, taskWithoutPlaylistProps] }
          : project
      )
    );
  };

  const handleToggleComplete = (taskId: string) => {
    setPlaylist((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`, // Generate unique ID
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === newTask.projectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );
  };

  const handleEditTask = (updatedTask: Task) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedTask.projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
            }
          : project
      )
    );

    // Also update in playlist if it exists there
    setPlaylist((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,
              name: updatedTask.name,
              projectId: updatedTask.projectId,
              duration: updatedTask.duration,
              dueDate: updatedTask.dueDate,
              tags: updatedTask.tags,
            }
          : task
      )
    );
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">My Trees: Today&apos;s Focus</h1>
          <Button onClick={() => router.push('/')} variant="ghost" size="icon">
            <TreesIcon className="h-5 w-5 text-[var(--forest-accent)]" />
          </Button>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Task Candidates */}
          <TaskCandidates
            projects={projects}
            onAddTask={handleAddToPlaylist}
            onEditTask={handleEditTask}
            onCreateTask={handleCreateTask}
          />

          {/* Right Column - Today's Playlist */}
          <TodaysPlaylist
            tasks={playlist}
            projects={projects}
            onRemoveTask={handleRemoveFromPlaylist}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </div>
  );
}
