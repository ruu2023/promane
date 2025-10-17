'use client';

import { DailyTaskScreen } from '@/components/daily-task-screen';
import { ProjectOverview } from '@/components/project-overview';
import { useState } from 'react';
export type ViewName = 'ProjectOverview' | 'DailyTaskScreen';
export default function Home() {
  const [view, setView] = useState<ViewName>('ProjectOverview');

  switch (view) {
    case 'DailyTaskScreen':
      return <DailyTaskScreen onChangeView={setView} />;
      break;
    default:
      return <ProjectOverview onChangeView={setView} />;
      break;
  }
}
