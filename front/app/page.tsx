import Header from '@/components/header';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <p>
        <Link href={'./login'}>ログインページへ</Link>
      </p>
      <p>
        <Link href={'./register'}>会員登録</Link>
      </p>
    </>
  );
}
