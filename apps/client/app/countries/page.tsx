import { getCountriesList } from '@/entities/country';
import CountriesPage from '@/pages/CountriesPage';
import { notFound } from 'next/navigation';

export default async function CountriesPageRoute() {
  const countriesList = await getCountriesList();

  if (!countriesList) {
    notFound();
  }

  return <CountriesPage countriesList={countriesList}/>;
}
