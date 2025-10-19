import React, { Suspense } from 'react';

import SuspengecePage from '@/components/suspense-page';
import { ProjectSkeleton } from '@/components/project-skelton';
import Header from '@/components/header';

const page = async () => {
  return (
    <>
      <Header />
      <Suspense fallback={<ProjectSkeleton />}>
        <SuspengecePage />
      </Suspense>
    </>
  );
};

export default page;
