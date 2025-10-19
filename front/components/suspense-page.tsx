import { getProject } from '@/actions/project-actions';

import { ProjectOverview } from '@/components/project-overview';
import { CommonError } from '@/components/common-error';
import { getTasks } from '@/actions/task-actions';

export default async function SuspengecePage() {
  const res = await getProject();
  if (!res.success) {
    return <CommonError message={res.message} />;
  }
  return <ProjectOverview projectsPaginated={res.data} />;
}
