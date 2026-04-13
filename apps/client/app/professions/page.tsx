import type { TSearchParams } from '@/shared/types';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getAllProfessionsForPage } from '@/features/professionsForPage';
import { ProfessionsPage } from '@/pages/ProfessionsPage';
import { resolveInitialProfessionId } from '@/widgets/AllCreatorsViewer';

export default async function ProfessionsPageRoute({
  searchParams,
}: {
  searchParams: TSearchParams;
}) {
  const professions = await getAllProfessionsForPage();

  if (professions === null) {
    notFound();
  }

  const initialActiveProfessionId = resolveInitialProfessionId(professions, searchParams);

  return (
    <Suspense fallback={null}>
      <ProfessionsPage
        initialActiveProfessionId={initialActiveProfessionId}
        professions={professions}
      />
    </Suspense>
  );
}
