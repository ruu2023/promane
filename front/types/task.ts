import { TaskLabel } from './task-label';
import { User } from './user';

// Enum 型を 'string literal types' として定義
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  status: TaskStatus;
  is_today: boolean;
  priority: TaskPriority;
  start_at: string | null;
  end_at: string | null;
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
};

export type TaskList = Task & {
  creator: User;
  assignee: User | null;
  labels: TaskLabel[];
};

export type TaskErrors = { [key: string]: string[] };

// export interface Task {
//   id: string;
//   title: string;
//   priority: 'high' | 'medium' | 'low';
//   assignee: {
//     name: string;
//     avatar: string;
//   };
//   dueDate: string;
//   comments: number;
//   labels: number;
//   status: 'backlog' | 'in-progress' | 'review' | 'done';
// }
