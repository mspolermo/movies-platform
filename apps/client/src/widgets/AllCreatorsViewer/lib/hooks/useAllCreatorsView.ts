import { getAllProfessions } from "@/entities/profession";
import { TProfessionBased } from "@common/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TAllCreatorsViewerProps } from "../../ui/types";

interface TUseAllCreatorsViewProps extends TAllCreatorsViewerProps {}

/**
 * Хук для загрузки списка всех профессий и управления активной профессией
 * в режиме "All Creators Viewer".  
 * 
 * Позволяет:
 * - загружать все профессии с сервера  
 * - автоматически определять активную профессию на основе query-параметра `profession`
 * - синхронизировать изменение профессии с URL-параметрами
 * - обрабатывать состояния загрузки и ошибок
 */
export const useAllCreatorsView = ({searchParams}: TUseAllCreatorsViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professions, setProfessions] = useState<TProfessionBased[]>([]);
  const [activeProfessionId, setActiveProfessionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const data = await getAllProfessions();
        setProfessions(data);
        setError(null);
        
        // Проверяем query-параметр profession
        const professionParam = searchParams?.get('profession');
        
        if (professionParam && data.length > 0) {
          // Ищем профессию по названию (без учета регистра)
          const foundProfession = data.find(
            (p) => p.name.toLowerCase() === professionParam.toLowerCase()
          );
          if (foundProfession) {
            setActiveProfessionId(foundProfession.id);
          } else {
            // Если профессия не найдена, выбираем первую
            setActiveProfessionId(data[0].id);
          }
        } else if (data.length > 0 && activeProfessionId === null) {
          // Автоматически выбираем первую профессию, если нет query-параметра
          setActiveProfessionId(data[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки профессий');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleProfessionChange = (professionId: number) => {
    setActiveProfessionId(professionId);
    
    // Обновляем query-параметр в URL
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
    loading,
    error,
    handleProfessionChange
  }
}