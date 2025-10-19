// `task_labels` テーブルの型 (Task の 'labels' で使用)
export type TaskLabel = {
  id: number;
  project_id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
};
