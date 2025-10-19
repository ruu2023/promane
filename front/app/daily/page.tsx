import { DailyTaskScreen } from '@/components/daily-task-screen';
import Header from '@/components/header';
export default function Page() {
  return (
    <>
      <Header title="My Trees: Today's Focus" link="/member" />
      <DailyTaskScreen />
    </>
  );
}
