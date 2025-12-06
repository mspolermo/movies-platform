import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { useEffect, useState } from "react";
import { TSearchResultProps } from "../../model";

export const useSearchByQuery = (query: string) => {

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TSearchResultProps>({
    films: [],
    persons: [],
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ films: [], persons: [] });
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchResults = async (currentQuery: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('name', currentQuery);
      const { data } = await apiClient.get(
        `${API_ENDPOINTS.SEARCH.GLOBAL}?${params.toString()}`
      );

      const films = Array.isArray(data?.films) ? data.films : [];
      const persons = Array.isArray(data?.persons) ? data.persons : [];

      setResults({
        films,
        persons,
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults({ films: [], persons: [] });
    } finally {
      setLoading(false);
    }
  };



    return {
      loading,
      results
    }
}