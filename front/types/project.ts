import { User } from './user';

export type ProjectBase = {
  id: number;
  name: string;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectList = ProjectBase & {
  tasks_count: number;
  completed_tasks_count: number;
};

export type ProjectDetail = ProjectBase & {
  users: User[];
};

export type postProjectInput = {
  name: string;
  description: string;
  start_at: string;
  end_at: string;
};
