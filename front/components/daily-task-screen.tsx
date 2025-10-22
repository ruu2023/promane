'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TreesIcon } from 'lucide-react';
import { TaskCandidates } from '@/components/task-candidates';
import { TodaysPlaylist } from '@/components/todays-playlist';
import { useRouter } from 'next/navigation';
import { PaginatedData } from '@/types/common';
import { ProjectList } from '@/types/project';
import { User } from '@/types/user';
import { TaskErrors, TaskList, TaskPriority, TaskStatus, TodayTask } from '@/types/task';
import { startOfToday, format } from 'date-fns';
import { createTask, getTasks, updateTask } from '@/actions/task-actions';
import { getTaskLabels } from '@/actions/task-label-actions';
import { TaskLabel } from '@/types/task-label';

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

type Props = {
  projectsPaginated: PaginatedData<ProjectList>;
  currentUser: User;
  todayTasks: TodayTask[];
};
export function DailyTaskScreen({ projectsPaginated, currentUser, todayTasks }: Props) {
  const [projects, setProjects] = useState<ProjectList[]>(projectsPaginated.data);
  const [playlist, setPlaylist] = useState<TodayTask[]>(todayTasks);

  // 楽観的 UI 更新 Tasks
  const [isLoading, setIsLoading] = useState(false);
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

  const handleAddToPlaylist = async (project: ProjectList, task: TaskList) => {
    // Remove from project
    const updatedTask = {
      ...task,
      is_today: true,
    };

    setTasksByProject((prev) => ({
      ...prev,
      [project.id]: prev[project.id].map((t) => (t.id === task.id ? updatedTask : t)),
    }));

    const updatedPlayListTask = {
      ...updatedTask,
      project,
    };

    setPlaylist((prev) => [...prev, updatedPlayListTask]);

    const res = await updateTask(task.id, updatedTask);
    if (res.success) {
      const newTask: TodayTask = { ...res.data, project };
      setPlaylist((prev) => prev.map((t) => (t.id === task.id ? newTask : t)));
      return;
    }
    setPlaylist((prev) => prev.filter((p) => p.id !== task.id));
    const err = res.message;
  };

  const handleRemoveFromPlaylist = async (project: ProjectList, task: TodayTask) => {
    // Remove from project
    const updatedTask = {
      ...task,
      creator: currentUser,
      labels: [],
      is_today: false,
    };

    const prevTasks = tasksByProject[project.id] ?? null;
    if (prevTasks) {
      setTasksByProject((prev) => {
        const prevTasks = prev[project.id] ?? [];
        return {
          ...prev,
          [project.id]: prevTasks.map((t) => (t.id === task.id ? updatedTask : t)),
        };
      });
    }

    const updatedPlayListTask = {
      ...updatedTask,
      project,
    };

    setPlaylist((prev) => prev.filter((p) => p.id !== task.id));

    const res = await updateTask(task.id, updatedTask);
    if (res.success) {
      const newTask: TodayTask = { ...res.data, project };
      setPlaylist((prev) => prev.map((t) => (t.id === task.id ? newTask : t)));
      return;
    }

    setPlaylist((prev) => [...prev, updatedPlayListTask]);
    const err = res.message;
  };

  const handleToggleComplete = async (task: TodayTask) => {
    const newStatus = task.status !== 'done' ? 'done' : 'in_progress';
    setPlaylist((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));

    const updatedTask = {
      ...task,
      status: newStatus as TaskStatus,
      creator: currentUser,
      labels: [],
    };
    const res = await updateTask(task.id, updatedTask);
    if (res.success) {
      setPlaylist((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...res.data } : t)));
      return;
    }

    setPlaylist((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
    const err = res.message;
  };

  const handleEditTask = async (task: TaskList) => {
    const updatedTask = {
      ...task,
      creator: currentUser,
      labels: [],
    };
    const res = await updateTask(task.id, updatedTask);
    if (res.success) {
      setPlaylist((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...res.data } : t)));
      return;
    }

    // setPlaylist((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
    const err = res.message;
    // setProjects((prev) =>
    //   prev.map((project) =>
    //     project.id === updatedTask.projectId
    //       ? {
    //           ...project,
    //           tasks: project.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    //         }
    //       : project
    //   )
    // );
    // Also update in playlist if it exists there
    // setPlaylist((prev) =>
    //   prev.map((task) =>
    //     task.id === updatedTask.id
    //       ? {
    //           ...task,
    //           name: updatedTask.name,
    //           projectId: updatedTask.projectId,
    //           duration: updatedTask.duration,
    //           dueDate: updatedTask.dueDate,
    //           tags: updatedTask.tags,
    //         }
    //       : task
    //   )
    // );
  };

  const [taskErrors, setTaskErrors] = useState<TaskErrors>({});
  const handleCreateTask = (projectId: number, formData: FormData) => {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Two Column Layout */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Task Candidates */}
          <TaskCandidates
            projects={projects}
            onAddTask={handleAddToPlaylist}
            onEditTask={handleEditTask}
            onCreateTask={handleCreateTask}
            taskLabelsByProject={taskLabelsByProject}
            tasksByProject={tasksByProject}
            onTriggerClick={handleTriggerClick}
            taskErrors={taskErrors}
            isLoading={isLoading}
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
