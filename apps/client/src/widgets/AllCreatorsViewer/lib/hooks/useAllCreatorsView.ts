'use client';

import type { TAllCreatorsViewerReadyProps } from '../../models';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Хук для режима «All Creators Viewer»: список профессий с сервера,
 * активная профессия по `initialActiveProfessionId` и query `profession`,
 * синхронизация смены профессии с URL.
 */
export const useAllCreatorsView = ({
  professions,
  initialActiveProfessionId,
}: TAllCreatorsViewerReadyProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeProfessionId, setActiveProfessionId] = useState<number | null>(
    initialActiveProfessionId
  );

  useEffect(() => {
    setActiveProfessionId(initialActiveProfessionId);
  }, [initialActiveProfessionId]);

  const handleProfessionChange = (professionId: number) => {
    setActiveProfessionId(professionId);

    const profession = professions.find((p) => p.id === professionId);
    if (profession) {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('profession', profession.name);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return {
    professions,
    activeProfessionId,
    handleProfessionChange,
  };
};
