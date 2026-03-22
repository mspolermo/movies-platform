import { notFound } from 'next/navigation';

import { getCountriesList } from '@/entities/country';
import { CountriesPage } from '@/pages/CountriesPage';

export default async function CountriesPageRoute() {
  const countriesList = await getCountriesList();

  if (!countriesList) {
    notFound();
  }

  return <CountriesPage countriesList={countriesList} />;
}
