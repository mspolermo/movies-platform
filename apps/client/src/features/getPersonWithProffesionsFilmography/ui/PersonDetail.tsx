import { usePersonDetails } from "../lib"
import { TPersonDetailProps } from "./types"
import styles from './PersonDetail.module.scss';
import { Loader } from "@/shared/ui";
import { PersonInfo } from "@/entities/person";
import { ProfessionsList } from "@/entities/profession";
import { Filmography } from "@/entities/film";

export const PersonDetail = ({ personId }: TPersonDetailProps) => {
  const {
    loading,
    error,
    person,
    filmsTotal,
    films,
    handleLoadMore,
    isLoadingMore,
    hasMoreFilms
  } = usePersonDetails(personId)

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorMessage}>
          {error || 'Персона не найдена'}
        </div>
      </div>
    );
  }

  return (
    <>
      <PersonInfo person={person} />

      <ProfessionsList professions={person.professions} />

      <Filmography
        filmsTotal={filmsTotal}
        films={films}
        onLoadMore={handleLoadMore}
        isLoading={isLoadingMore}
        hasMoreFilms={hasMoreFilms}
      />
    </>
  );
}