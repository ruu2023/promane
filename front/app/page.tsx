import { ProjectOverview } from '@/components/project-overview';

export type ViewName = 'ProjectOverview' | 'DailyTaskScreen';
export default function Home() {
  return <ProjectOverview />;
}
