'use server';

import { ApiResponse, PaginatedData } from '@/types/common';
import { postTaskInput, TaskDetail, TaskList, TodayTask } from '@/types/task';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const createTask = async (
  projectId: number,
  body: postTaskInput
): Promise<ApiResponse<TaskDetail>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 422 && data.errors) {
        return {
          success: false,
          message: '送信内容に誤りがあります',
          errors: data.errors,
        };
      }
      return {
        success: false,
        message: `登録に失敗しました : ${data.message || '不明なエラー'}`,
        errors: {},
      };
    }

    revalidatePath('/member');
    return { success: true, message: 'ok', data: data };
  } catch (err) {
    console.error('Network or other : ', err);
    return { success: false, message: '処理中にエラーが発生しました', errors: {} };
  }
};

export const updateTask = async (
  taskId: number,
  body: postTaskInput
): Promise<ApiResponse<TaskDetail>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 422 && data.errors) {
        return {
          success: false,
          message: '送信内容に誤りがあります',
          errors: data.errors,
        };
      }
      return {
        success: false,
        message: `登録に失敗しました : ${data.message || '不明なエラー'}`,
        errors: {},
      };
    }

    revalidatePath('/member');
    return { success: true, message: 'ok', data: data };
  } catch (err) {
    console.error('Network or other : ', err);
    return { success: false, message: '処理中にエラーが発生しました', errors: {} };
  }
};

export const getTodayTasks = async (): Promise<ApiResponse<TodayTask>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/tasks/today`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      // cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: `APIエラー: ${data.message || '不明なエラーです'}`,
        errors: {},
      };
    }
    return { success: true, message: 'ok', data: data };
  } catch (err) {
    console.error('Network or other : ', err);
    return {
      success: false,
      message: 'ネットワーク接続またはサーバー処理でエラーが発生しました',
      errors: {},
    };
  }
};
