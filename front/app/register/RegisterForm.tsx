'use client'
import { useState } from 'react';
import styles from './RegisterForm.module.scss';

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
    <form onSubmit={submit} className={styles.form}>
      <label htmlFor="name">名前</label>
      <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={styles.input} />
      <label htmlFor="email">メールアドレス</label>
      <input type="email" id="email"  value={email} onChange={e => setEmail(e.target.value)} className={styles.input} />
      <label htmlFor="password">パスワード</label>
      <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} />
      <button type="submit">登録</button>
    </form>
  );
}