import { getFilmById } from "@/entities/film";
import { TFilmWithProfessions } from "@common/types";
import { useEffect, useState } from "react";

export const useFilmDetails = (filmId: number) => {
  const [film, setFilm] = useState<TFilmWithProfessions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        setLoading(true);
        setError(null);
        const filmData = await getFilmById(filmId);
        setFilm(filmData);
      } catch (err) {
        console.error('Error fetching film:', err);
        setError('Ошибка загрузки фильма');
      } finally {
        setLoading(false);
      }
    };

    if (filmId) {
      fetchFilm();
    } else {
      setError('ID фильма не найден');
      setLoading(false);
    }
  }, [filmId]);

  return {
    film,
    error,
    loading
  }
}