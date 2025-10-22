import Header from '@/components/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">ForestTasks</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          ログインまたは会員登録して、ダッシュボードをはじめましょう。
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href={'./login'}>ログインページへ</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={'./register'}>会員登録</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
