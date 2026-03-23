import { Suspense } from 'react';

import { ProfessionsPage } from '@/pages/ProfessionsPage';

export default function ProfessionsPageRoute() {
  return (
    <Suspense fallback={null}>
      <ProfessionsPage />
    </Suspense>
  );
}
