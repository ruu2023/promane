import { DailyTaskScreen } from '@/components/daily-task-screen';
import Header from '@/components/header';
import { ProjectSkeleton } from '@/components/project-skelton';
import SuspengecePage from '@/components/suspense-page';
import { Suspense } from 'react';
export default function Page() {
  return (
    <>
      <Header title="My Trees: Today's Focus" link="/member" />
      <Suspense fallback={<ProjectSkeleton />}>
        <SuspengecePage pageName="tree" />
      </Suspense>
    </>
  );
}
