import { getProject } from '@/actions/project-actions';

import { ProjectOverview } from '@/components/project-overview';
import { CommonError } from '@/components/common-error';
import { getTasks } from '@/actions/task-actions';
import { getCurrentUser } from '@/actions/auth-actions';

export default async function SuspengecePage() {
  const res = await getProject();
  if (!res.success) {
    return <CommonError message={res.message} />;
  }
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <CommonError message={'ユーザーデータが取得できませんでした'} />;
  }
  return <ProjectOverview projectsPaginated={res.data} currentUser={currentUser} />;
}
