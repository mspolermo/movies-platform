import { Suspense } from 'react';

import { FilmsPage } from '@/pages/FilmsPage';

export default function FilmsPageRoute() {
  return (
    <Suspense fallback={null}>
      <FilmsPage />
    </Suspense>
  );
}
