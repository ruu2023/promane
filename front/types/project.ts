export type Pivot = {
  project_id: number;
  user_id: number;
  role: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  updated_at: string;
  created_at: string;
  users: User[];
};

export type postProjectInput = {
  name: string;
  description: string;
  start_at: string;
  end_at: string;
};

// 成功・失敗の型定義
export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};
export type ErrorResponse = {
  success: false;
  message: string;
  errors?: { [key: string]: string[] };
};
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
