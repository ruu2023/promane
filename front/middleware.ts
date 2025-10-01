// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/member'];
const AUTH_PAGE_PATHS = ['/login', '/register'];

const isPathStart = (pathname: string, specificPaths: string[]) =>
  specificPaths.some((p) => pathname.startsWith(p));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value ?? null;

  const isAuthPage = isPathStart(pathname, AUTH_PAGE_PATHS);
  const isProtected = isPathStart(pathname, PROTECTED_PATHS);

  // トークン無し
  if (!token) {
    if (isProtected) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // 未ログインでログイン・登録ページに来た場合はそのまま許可
    return NextResponse.next();
  }

  // token がある場合は検証する（外部呼び出しは try/catch で保護）
  let laravelRes: Response | null = null;
  try {
    laravelRes = await fetch(`${process.env.LARAVEL_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
  } catch (err) {
    console.error('Error calling /api/me in middleware:', err);
    // エラー時は保護ページを弾く（安全側）
    if (isProtected) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
  }

  // token 無効
  if (!laravelRes.ok) {
    // 無効なら cookie を削除して保護ページなら /login に飛ばす
    const resp = isProtected
      ? NextResponse.redirect(new URL('/login', req.url))
      : NextResponse.next();
    // cookie を削除（set value='' + maxAge:0）
    resp.cookies.set('auth_token', '', { path: '/', maxAge: 0 });
    return resp;
  }

  // トークン有効なら、ログインページに来たら /member にリダイレクト
  if (isAuthPage) {
    return NextResponse.redirect(new URL('/member', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/member/:path*', '/login', '/register'],
};