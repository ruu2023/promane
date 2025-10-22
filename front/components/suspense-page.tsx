import { getProject } from '@/actions/project-actions';

import { ProjectOverview } from '@/components/project-overview';
import { CommonError } from '@/components/common-error';
import { getCurrentUser } from '@/actions/auth-actions';
import { DailyTaskScreen } from './daily-task-screen';
import { getTodayTasks } from '@/actions/today-actions';

type Props = { pageName: 'forest' | 'tree' };

export default async function SuspengecePage({ pageName }: Props) {
  const res = await getProject();
  if (!res.success) {
    return <CommonError message={res.message} />;
  }
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <CommonError message={'ユーザーデータが取得できませんでした'} />;
  }
  switch (pageName) {
    case 'forest':
      return <ProjectOverview projectsPaginated={res.data} currentUser={currentUser} />;
    case 'tree':
      const todayTasksRes = await getTodayTasks();
      if (!todayTasksRes.success) {
        return <CommonError message={todayTasksRes.message} />;
      }
      return (
        <DailyTaskScreen
          projectsPaginated={res.data}
          currentUser={currentUser}
          todayTasks={todayTasksRes.data}
        />
      );
    default:
      return <ProjectOverview projectsPaginated={res.data} currentUser={currentUser} />;
  }
}
