// front/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // ログアウト後に遷移させたい先
  const redirectUrl = new URL('/login', req.url);

  const res = NextResponse.redirect(redirectUrl);

  // 下記は互換的に cookie を maxAge:0 にする
  res.cookies.set({
    name: 'auth_token',
    value: '',
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res;
}