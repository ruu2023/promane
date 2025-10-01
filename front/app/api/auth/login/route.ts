import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json(); // { email, password }
  // Laravel のログインエンドポイント
  const laravelUrl = process.env.LARAVEL_API_URL + '/api/login';

  const laravelRes = await fetch(laravelUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await laravelRes.json();

  if (!laravelRes.ok) {
    return NextResponse.json({ error: data }, { status: laravelRes.status });
  }

  // 例: Laravel が { token: 'plain-text-token', user: {...} } を返す想定
  const token = data.token;
  const user = data.user ?? null;

  const res = NextResponse.json({ ok: true, user });

  // セキュアな httpOnly cookie をセット（有効期間は用途に合わせて調整）
  res.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}