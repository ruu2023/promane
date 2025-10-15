'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const createProject = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return { success: false, message: '認証トークンがありません' };
  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
        name: 'nextプロジェクト',
        description: 'next から送信',
        start_at: '2025-10-01',
        end_at: '2025-11-01',
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      return {
        success: false,
        message: `登録に失敗しました : ${errData.message || '不明なエラー'}`,
      };
    }

    const resData = await res.json();
    revalidatePath('/member');
    return { success: true, message: 'ok', data: resData };
  } catch (err) {
    console.error('Network or other : ', err);
    return { success: false, message: '処理中にエラーが発生しました' };
  }
};
