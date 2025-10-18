// ページネーション
type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type PaginatedData<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
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
