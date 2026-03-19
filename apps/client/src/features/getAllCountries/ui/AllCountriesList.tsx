import { FilterCardButton, Loader } from "@/shared/ui";
import styles from './AllCountriesList.module.scss';
import { useAllCountries } from "../lib";

export const AllCountriesList = () => {
  const { loading, error, countries, handleCountryClick} = useAllCountries()

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size="small" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>{error}</div>
    );
  }

  return (
      <div className={styles.countriesGrid}>
        {countries.map((country) => (
          <FilterCardButton
            key={country.id}
            onClick={() => handleCountryClick(country.countryName)}
            ariaLabel={`Открыть фильмы страны ${country.countryName}`}
          >
            <h3 className={styles.countryName}>{country.countryName}</h3>
          </FilterCardButton>
        ))}
      </div>
  );
}