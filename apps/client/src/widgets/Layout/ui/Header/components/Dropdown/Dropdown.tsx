'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TGenreBased, TCountryBased } from '@common/types';
import { dropdownCache } from './dropdownCache';
import styles from './Dropdown.module.scss';

interface HeaderDropdownProps {
  isClosing: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
}

export const Dropdown: React.FC<HeaderDropdownProps> = ({
  isClosing,
  onClose,
  onMouseEnter,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [genres, setGenres] = useState<TGenreBased[]>([]);
  const [genresLoading, setGenresLoading] = useState(!dropdownCache.isGenresLoaded());
  const [countries, setCountries] = useState<TCountryBased[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(!dropdownCache.isCountriesLoaded());
  const [years, setYears] = useState<number[]>([]);
  const [yearsLoading, setYearsLoading] = useState(!dropdownCache.isYearsLoaded());

  // Проверяем, находимся ли именно на странице со списком фильмов (не детальная страница)
  const isOnFilmsPage = pathname === '/films';

  useEffect(() => {
    const loadGenres = async () => {
      // Если данные уже загружены, используем их сразу
      if (dropdownCache.isGenresLoaded()) {
        const cachedData = await dropdownCache.getGenres();
        setGenres(cachedData);
        setGenresLoading(false);
        return;
      }

      // Иначе загружаем через кеш
      setGenresLoading(true);
      const data = await dropdownCache.getGenres();
      setGenres(data);
      setGenresLoading(false);
    };

    loadGenres();
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      // Если данные уже загружены, используем их сразу
      if (dropdownCache.isCountriesLoaded()) {
        const cachedData = await dropdownCache.getCountries();
        setCountries(cachedData);
        setCountriesLoading(false);
        return;
      }

      // Иначе загружаем через кеш
      setCountriesLoading(true);
      const data = await dropdownCache.getCountries();
      setCountries(data);
      setCountriesLoading(false);
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const loadYears = async () => {
      // Если данные уже загружены, используем их сразу
      if (dropdownCache.isYearsLoaded()) {
        const cachedData = await dropdownCache.getYears();
        setYears(cachedData);
        setYearsLoading(false);
        return;
      }

      // Иначе загружаем через кеш
      setYearsLoading(true);
      const data = await dropdownCache.getYears();
      setYears(data);
      setYearsLoading(false);
    };

    loadYears();
  }, []);

  // Обновление query-параметров на странице фильмов (с очисткой остальных фильтров)
  const updateQueryParams = (updates: Record<string, string | null>, clearOthers = false) => {
    if (!isOnFilmsPage) return;
    
    const params = clearOthers ? new URLSearchParams() : new URLSearchParams(searchParams?.toString() || '');
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newUrl = params.toString() 
      ? `${pathname}?${params.toString()}` 
      : pathname || '/films';
    
    router.replace(newUrl, { scroll: false });
    onClose();
  };

  const handleGenreClick = (genreNameEn: string) => {
    // Получаем имя жанра на русском для query-параметра
    const genre = genres.find(g => (g.nameEn || g.nameRu) === genreNameEn);
    if (!genre) return;

    const genreNameRu = genre.nameRu;
    
    if (isOnFilmsPage) {
      // Если на странице фильмов, устанавливаем только выбранный жанр, остальные параметры сбрасываем
      const currentGenres = searchParams?.get('genres')?.split(',').filter(Boolean) || [];
      
      // Если жанр уже выбран один и это он, сбрасываем все, иначе устанавливаем только его
      const isCurrentlySelected = currentGenres.length === 1 && currentGenres[0] === genreNameRu;
      
      updateQueryParams(
        { genres: isCurrentlySelected ? null : genreNameRu },
        true // Очищаем остальные параметры
      );
    } else {
      // Если не на странице фильмов, переходим на страницу только с выбранным жанром
      const params = new URLSearchParams();
      params.set('genres', genreNameRu);
      router.push(`/films?${params.toString()}`);
      onClose();
    }
  };

  const handleCountryClick = (countryName: string) => {
    if (isOnFilmsPage) {
      // Если на странице фильмов, устанавливаем только выбранную страну, остальные параметры сбрасываем
      const currentCountries = searchParams?.get('countries')?.split(',').filter(Boolean) || [];
      
      // Если страна уже выбрана одна и это она, сбрасываем все, иначе устанавливаем только её
      const isCurrentlySelected = currentCountries.length === 1 && currentCountries[0] === countryName;
      
      updateQueryParams(
        { countries: isCurrentlySelected ? null : countryName },
        true // Очищаем остальные параметры
      );
    } else {
      // Если не на странице фильмов, переходим на страницу только с выбранной страной
      const params = new URLSearchParams();
      params.set('countries', countryName);
      router.push(`/films?${params.toString()}`);
      onClose();
    }
  };

  const handleYearClick = (year: string) => {
    if (isOnFilmsPage) {
      // Если на странице фильмов, устанавливаем только выбранный год, остальные параметры сбрасываем
      const currentYear = searchParams?.get('year');
      
      // Если год уже выбран и это он, сбрасываем все, иначе устанавливаем только его
      const isCurrentlySelected = currentYear === year;
      
      updateQueryParams(
        { year: isCurrentlySelected ? null : year },
        true // Очищаем остальные параметры
      );
    } else {
      // Если не на странице фильмов, переходим на страницу только с выбранным годом
      const params = new URLSearchParams();
      params.set('year', year);
      router.push(`/films?${params.toString()}`);
      onClose();
    }
  };

  const renderFilmsDropdown = () => {
    // Разбиваем жанры на 3 столбца по 10 жанров в каждом (максимум 30 жанров)
    const genresPerColumn = 10;
    const maxGenres = 30;
    const limitedGenres = genres.slice(0, maxGenres);
    
    const genreColumns: TGenreBased[][] = [];
    for (let i = 0; i < limitedGenres.length; i += genresPerColumn) {
      genreColumns.push(limitedGenres.slice(i, i + genresPerColumn));
    }

    return (
      <div className={styles.content}>
        <div className={styles.column}>
          <h3 className={styles.heading}>Жанры</h3>
          {genresLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <div className={styles.list}>
              {genreColumns.map((columnGenres, columnIndex) => (
                <div key={columnIndex} className={styles.column}>
                  {columnGenres.map((genre) => (
                    <p
                      key={genre.id}
                      className={styles.item}
                      onClick={() => handleGenreClick(genre.nameEn || genre.nameRu)}
                    >
                      {genre.nameRu}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.column}>
        <h3 className={styles.heading}>Страны</h3>
          {countriesLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <div className={styles.list}>
              {/* Первый столбец стран (первые 10) */}
              <div className={styles.column}>
                {countries.slice(0, 10).map((country) => (
                  <p
                    key={country.id}
                    className={styles.item}
                    onClick={() => handleCountryClick(country.countryName)}
                  >
                    {country.countryName}
                  </p>
                ))}
              </div>
              {/* Второй столбец стран (следующие 10) */}
              <div className={styles.column}>
                {countries.slice(10, 20).map((country) => (
                  <p
                    key={country.id}
                    className={styles.item}
                    onClick={() => handleCountryClick(country.countryName)}
                  >
                    {country.countryName}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.column}>
          <h3 className={styles.heading}>Годы</h3>
          {yearsLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <div className={styles.list}>
              <div className={styles.column}>
                {years.map((year) => (
                  <p
                    key={year}
                    className={styles.item}
                    onClick={() => handleYearClick(String(year))}
                  >
                    {year}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${styles.dropdown} ${isClosing ? styles.closing : ''}`}
      onMouseLeave={onClose}
      onMouseEnter={onMouseEnter}
    >
      {renderFilmsDropdown()}
    </div>
  );
};
