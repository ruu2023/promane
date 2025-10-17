'use server';

import { ApiResponse, postProjectInput, Project } from '@/types/project';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const createProject = async (body: postProjectInput): Promise<ApiResponse<Project>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  // if (!token) return { success: false, message: '認証トークンがありません', errors: [] };
  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/projects`, {
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
    console.log(data);
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
