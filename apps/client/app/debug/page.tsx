import { notFound } from 'next/navigation';

import { DebugPage } from '@/pages/DebugPage';

const isProduction =
  (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV ===
  'production';

/** Dev-only: отладка auth (JWT, cookies, refresh). В prod — 404. */
export default function DebugPageRoute() {
  if (isProduction) {
    notFound();
  }

  return <DebugPage />;
}
