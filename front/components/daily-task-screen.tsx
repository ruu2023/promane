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
import { createTask, getTasks } from '@/actions/task-actions';
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

  const handleAddToPlaylist = (task: TaskList) => {
    // Remove from project
    // setProjects((prev) =>
    //   prev.map((project) =>
    //     project.id === task.projectId
    //       ? { ...project, tasks: project.tasks.filter((t) => t.id !== task.id) }
    //       : project
    //   )
    // );
    // Add to playlist
    // const newTask: PlaylistTask = {
    //   ...task,
    //   completed: false,
    // };
    // setPlaylist((prev) => [...prev, newTask]);
  };

  const handleRemoveFromPlaylist = (task: TodayTask) => {
    // Remove from playlist
    // setPlaylist((prev) => prev.filter((t) => t.id !== task.id));
    // Add back to project
    // const taskWithoutPlaylistProps: Task = {
    //   id: task.id,
    //   name: task.name,
    //   projectId: task.projectId,
    //   duration: task.duration,
    //   dueDate: task.dueDate,
    //   tags: task.tags,
    // };
    // setProjects((prev) =>
    //   prev.map((project) =>
    //     project.id === task.projectId
    //       ? { ...project, tasks: [...project.tasks, taskWithoutPlaylistProps] }
    //       : project
    //   )
    // );
  };

  const handleToggleComplete = (taskId: number) => {
    // setPlaylist((prev) =>
    //   prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    // );
  };

  const handleEditTask = (updatedTask: TaskList) => {
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
