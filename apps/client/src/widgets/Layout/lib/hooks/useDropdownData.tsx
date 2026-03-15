import { TCountryBased, TGenreBased } from "@common/types";
import { useEffect, useState } from "react";
import { dropdownCache } from "../utils";

interface DropdownState {
  genres: TGenreBased[];
  countries: TCountryBased[];
  years: number[];
  isLoading: boolean;
}

/**
 * Хук для загрузки данных для dropdown (с использованием кэширования).
 */
export const useDropdownData = () => {
  const [state, setState] = useState<DropdownState>({
    genres: [],
    countries: [],
    years: [],
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      //TODO: надо оптимизировать запросы и со стороны сервера и со стороны клиента - долго грузит
      const [genres, countries, years] = await Promise.all([
        dropdownCache.getGenres(),
        dropdownCache.getCountries(),
        dropdownCache.getYears(),
      ]);

      if (!mounted) return;

      setState({
        genres,
        countries,
        years,
        isLoading: false,
      });
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return state
}