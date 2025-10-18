type Pivot = {
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
