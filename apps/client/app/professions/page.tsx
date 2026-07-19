import type { TPageProps, TSearchParams } from '@/shared/types';

import { notFound } from 'next/navigation';

import { fetchAllProfessionsData } from '@/entities/profession';
import { ProfessionsPage } from '@/pages/ProfessionsPage';
import { resolveInitialProfessionId } from '@/widgets/AllCreatorsViewer';

export default async function ProfessionsPageRoute({
  searchParams,
}: TPageProps<Record<string, never>, TSearchParams>) {
  const professions = await fetchAllProfessionsData();

  if (professions === null) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const initialActiveProfessionId = resolveInitialProfessionId(professions, resolvedSearchParams);

  return (
    <ProfessionsPage
      initialActiveProfessionId={initialActiveProfessionId}
      professions={professions}
    />
  );
}
