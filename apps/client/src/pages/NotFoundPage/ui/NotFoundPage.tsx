import type { TNotFoundPageProps } from './types';

import { NotFoundView } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

/**
 * Страница 404 (app/not-found). Мягкий 404 админки использует тот же NotFoundView и Page.
 */
export const NotFoundPage = ({ description }: TNotFoundPageProps) => (
  <Page title="Страница не найдена">
    <NotFoundView description={description} />
  </Page>
);
