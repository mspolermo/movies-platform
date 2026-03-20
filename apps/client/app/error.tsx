'use client';

import { ErrorPage } from '@/pages/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorPage error={error} onRetry={reset}/>
}