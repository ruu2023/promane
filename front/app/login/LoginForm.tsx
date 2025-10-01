'use client'
import { useState } from 'react';
import styles from './loginForm.module.scss';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
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
    <form onSubmit={submit} className={styles.form}>
      <label htmlFor="email">メールアドレス</label>
      <input type="email" id="email"  value={email} onChange={e => setEmail(e.target.value)} className={styles.input} />
      <label htmlFor="password">パスワード</label>
      <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} />
      <button type="submit">ログイン</button>
    </form>
  );
}