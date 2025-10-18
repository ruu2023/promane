import { getProject } from '@/actions/project-actions';

import { ProjectOverview } from '@/components/project-overview';
import { ComonError } from '@/components/common-error';

export default async function Home() {
  const res = await getProject();
  if (!res.success) {
    return <ComonError message={res.message} />;
  }
  return <ProjectOverview projectsPaginated={res.data} />;
}
