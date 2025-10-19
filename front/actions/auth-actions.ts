import { cache } from 'react';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${process.env.LARAVEL_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const user: User = await res.json();
    return user;
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
});
