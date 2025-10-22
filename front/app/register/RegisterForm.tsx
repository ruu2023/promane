'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/header';
import { useState } from 'react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      // 成功時はリダイレクト
      window.location.href = '/member';
    } else {
      alert(JSON.stringify(data));
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* メインコンテンツを中央に配置 */}
      <main className="flex flex-1 items-center justify-center p-4">
        {/* フォームをカードで囲む */}
        <Card className="w-full max-w-sm">
          <form onSubmit={submit}>
            <CardHeader>
              <CardTitle className="text-2xl">ログイン</CardTitle>
              <CardDescription>
                お名前、メールアドレスとパスワードを入力してください。
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 mt-8">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">お名前</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Runch Wizard" // プレースホルダーを追加
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required // 必須項目にする
                />
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com" // プレースホルダーを追加
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required // 必須項目にする
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full mt-8">
                {' '}
                {/* 幅いっぱいのボタン */}
                ログイン
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
